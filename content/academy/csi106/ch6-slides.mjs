/**
 * CSI106 · Chương 6 — Algorithms, học theo từng slide (slide 1–30, toàn bộ deck).
 * Deck 'csi6' (CSI6), 30 slide, ảnh đã render lên CDN images/academy/CSI106/v1/csi6/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ CSI_06.pptx của trường (/tmp/csi106-text/csi6.txt).
 * Các slide mà nội dung chính nằm TRONG ẢNH (5, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18,
 * 20, 21, 23, 24, 27, 29, 30) đã được đọc thẳng từ ảnh đã render để lấy đúng từng nhãn
 * trong lưu đồ và từng dòng mã giả.
 *
 * MỌI con số trong bài (bảng chạy tay, số phép so sánh, kết quả sắp xếp) đều lấy từ
 * chương trình C chạy thật, không tự nghĩ ra.
 *
 * Những chỗ SLIDE GỐC SAI hoặc tự mâu thuẫn — đã nêu rõ trong bài, KHÔNG im lặng chép
 * lại và KHÔNG tự ý sửa slide:
 *   · slide 11 thân bài trích "(Figure 8.6)" trong khi hình ngay dưới mang nhãn
 *     "Figure 6.4" — vết còn lại của Chương 8 sách Forouzan.
 *   · slide 20 chú thích "Figure 6.11 UML for Calculating the sum of two integers"
 *     nhưng lưu đồ trong hình cộng CẢ MỘT DANH SÁCH số nguyên, không phải hai số.
 *   · slide 23 có hình mang nhãn "Figure 7.1" nằm lẫn giữa các hình 6.x.
 *   · slide 24 nói về BUBBLE SORT nhưng chú thích hình ghi "Figure 6.14 Example of
 *     selection sort" — chép nhầm chú thích của slide 23.
 *   · slide 27 viết "n+1/2 comparisons"; đúng phải là (n+1)/2.
 *   · slide 2 (Content) chỉ liệt kê 4 mục, nhưng deck thật có 5 mục (thiếu hẳn mục
 *     "4. BASIC ALGORITHMS" ở slide 19) và đánh số mục trên slide phân cách (1-, 2-,
 *     3-, 4., 5-) không khớp cách đánh 6.1/6.2/6.3/6.4 của slide Content.
 *   · slide 3 (Objectives) hứa dạy "subalgorithms" và "iterative vs recursive" —
 *     deck KHÔNG có slide nào về hai chủ đề đó.
 *   · slide 30 mã giả dùng chỉ số 1-based trong khi hình slide 29 dùng 0-based
 *     (int begin = 0); và mã giả KHÔNG có bước kiểm x == a[m] lẫn bước trả về vị trí.
 *   · slide 21 trong hình gõ nhầm "smallest ← curent" (thiếu chữ r).
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'csi6';

export default {
  title: '6.0 — Slide by slide: Algorithms, the three constructs, flowcharts/pseudocode and searching (30 slides)|||6.0 — Slide bài giảng: Thuật toán, ba cấu trúc cơ bản, lưu đồ/mã giả & tìm kiếm (30 slide)',
  slug: 'csi106-6-0-slides-thuat-toan-tim-kiem',
  type: 'DOCUMENT',
  description: 'Toàn bộ Chương 6 của CSI106 (30 slide) đi theo đúng bộ slide của trường: khái niệm thuật toán vào–xử lý–ra, ba cấu trúc tuần tự/rẽ nhánh/lặp, ba cách biểu diễn (UML, mã giả, lưu đồ), các thuật toán cơ bản (tổng, lớn nhất/nhỏ nhất, selection sort, bubble sort) và hai thuật toán tìm kiếm tuyến tính & nhị phân. Mỗi thuật toán đều có bảng chạy tay từng lượt trên mảng cụ thể, và phần so sánh Linear vs Binary dùng SỐ PHÉP SO SÁNH ĐO THẬT bằng chương trình C trên mảng 16 · 1.000 · 1.000.000 phần tử (499.501 so với 19 — chênh 26.309 lần). Những chỗ slide gốc ghi nhầm chú thích hình hoặc thiếu bước trong mã giả đều được chỉ ra thay vì chép lại.',
  content: [
    walkHead(D, 1, 30),
    walk(D, [

      [1, '6. Algorithms',
        `<p class="y-chinh">🎯 The title slide of Chapter 6. After five chapters about <em>the machine</em>, this chapter finally asks the question the machine exists to answer: <strong>how do you describe a method precisely enough that a machine can follow it?</strong></p>
<ul>
<li><strong>Where the word comes from</strong> — "algorithm" is a Latinisation of <em>al-Khwārizmī</em>, a Persian mathematician working in Baghdad around 820 AD whose book on Hindu–Arabic arithmetic taught Europe how to add with digits instead of an abacus. The word "algebra" comes from the title of another of his books. So the term is about 1200 years old; the mathematics it names is older still.</li>
<li><strong>Why this chapter sits here</strong> — Chapters 1–5 built the hardware and the operating system. From here on, the course is about <em>software</em>: Chapter 6 algorithms, Chapter 7 programming languages, Chapter 8 software engineering. You cannot write a program before you can state an algorithm.</li>
<li><strong>The textbook chapter</strong> — this deck is Forouzan, <em>Foundations of Computer Science</em>, Chapter 8 ("Algorithms"), with a couple of figures pulled from Chapter 7. That is why you will see a "Figure 8.6" reference on slide 11 and a "Figure 7.1" caption on slide 23 even though every other figure is renumbered 6.x.</li>
<li><strong>The learning outcome</strong> — this chapter is CLO6 of CSI106. The examinable skills are: define an algorithm, name and recognise the three constructs, read and write pseudocode, trace linear search and binary search by hand.</li>
<li><strong>The one sentence to carry</strong> — an algorithm is a <em>finite, ordered, unambiguous</em> set of steps that turns input into output. Everything else in this chapter is that sentence, illustrated.</li>
<li><strong>The link to PRF192</strong> — the three constructs on slides 11–14 map one-to-one onto C: sequence = statements separated by <code>;</code>, decision = <code>if</code>/<code>switch</code>, repetition = <code>for</code>/<code>while</code>. If you have written a loop in PRF192, you have already used all three.</li>
</ul>
<p class="meo">💡 Chapter 6 is the one chapter of CSI106 where you cannot pass by memorising. The exam will hand you an array and a target and ask what <code>low</code> and <code>high</code> are after pass 3. Practise the tracing tables in this lesson with a pen until you can do them without thinking.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề Chương 6. Sau năm chương nói về <em>cỗ máy</em>, chương này mới hỏi đúng câu mà cỗ máy sinh ra để trả lời: <strong>làm sao mô tả một cách làm chính xác đến mức máy theo được?</strong></p>
<ul>
<li><strong>Chữ này từ đâu ra</strong> — "algorithm" là biến âm La-tinh của <em>al-Khwārizmī</em>, nhà toán học Ba Tư làm việc ở Baghdad khoảng năm 820, người có cuốn sách dạy châu Âu cộng bằng chữ số Hindu–Ả Rập thay vì bàn tính. Chữ "algebra" (đại số) cũng ra từ nhan đề một cuốn khác của ông. Vậy thuật ngữ này khoảng 1200 năm tuổi; còn thứ toán mà nó gọi tên thì còn già hơn.</li>
<li><strong>Vì sao chương này nằm ở đây</strong> — Chương 1–5 dựng phần cứng và hệ điều hành. Từ đây trở đi môn học nói về <em>phần mềm</em>: Chương 6 thuật toán, Chương 7 ngôn ngữ lập trình, Chương 8 công nghệ phần mềm. Không phát biểu nổi thuật toán thì không viết nổi chương trình.</li>
<li><strong>Chương tương ứng trong giáo trình</strong> — deck này là Chương 8 ("Algorithms") của Forouzan, <em>Foundations of Computer Science</em>, có vài hình lấy từ Chương 7. Vì thế slide 11 còn sót chữ "Figure 8.6" và slide 23 còn sót chú thích "Figure 7.1" trong khi mọi hình khác đã đánh lại thành 6.x.</li>
<li><strong>Chuẩn đầu ra</strong> — chương này ứng với CLO6 của CSI106. Kỹ năng ra thi gồm: định nghĩa thuật toán, gọi tên và nhận ra ba cấu trúc, đọc và viết mã giả, chạy tay tìm kiếm tuyến tính và tìm kiếm nhị phân.</li>
<li><strong>Một câu mang theo</strong> — thuật toán là một tập bước <em>hữu hạn, có thứ tự, không nhập nhằng</em> biến đầu vào thành đầu ra. Mọi thứ còn lại trong chương chỉ là minh hoạ cho câu ấy.</li>
<li><strong>Nối sang PRF192</strong> — ba cấu trúc ở slide 11–14 ánh xạ một-một sang C: tuần tự = các câu lệnh ngăn bằng <code>;</code>, rẽ nhánh = <code>if</code>/<code>switch</code>, lặp = <code>for</code>/<code>while</code>. Bạn đã viết một vòng lặp ở PRF192 nghĩa là đã dùng đủ cả ba.</li>
</ul>
<p class="meo">💡 Chương 6 là chương duy nhất của CSI106 mà học thuộc không qua nổi. Đề sẽ đưa một mảng và một giá trị cần tìm rồi hỏi sau lượt thứ 3 thì <code>low</code> và <code>high</code> bằng bao nhiêu. Hãy cầm bút chạy lại các bảng trong bài này cho tới khi làm mà không cần nghĩ.</p>`],

      [2, 'Content',
        `<p class="y-chinh">🎯 The chapter map: four sections — concepts, the three constructs, representation, and searching. Read it as four exam topics, not four titles.</p>
<ul>
<li><strong>6.1 Concepts: input, output, processing</strong> (slides 4–9) — the informal definition, then the FindLargest example told three times: as prose, refined, and generalised. The whole point is watching a vague description become mechanical.</li>
<li><strong>6.2 Three basic constructs</strong> (slides 10–14) — sequence, decision, repetition. The Böhm–Jacopini result: those three are enough for <em>any</em> computable program. No fourth construct is needed.</li>
<li><strong>6.3 Algorithm representation</strong> (slides 15–18) — UML activity diagrams, pseudocode, and a worked example. Two languages for the same thing: one pictorial, one textual.</li>
<li><strong>6.4 Search Algorithms: linear, binary</strong> (slides 25–30) — the payoff of the chapter, and the part with the most exam marks.</li>
<li><strong>What the Content slide leaves out</strong> — slides 19–24 are a whole section ("4. BASIC ALGORITHMS": summation, smallest/largest, sorting, selection sort, bubble sort) that this list does not mention at all. Do not use this slide as a revision checklist; use the deck.</li>
<li><strong>Numbering mismatch</strong> — this slide says 6.1/6.2/6.3/6.4, but the section-divider slides say "1-", "2-", "3-", "4.", "5-". The same content, two numbering schemes, one of them off by one after the missing section.</li>
</ul>
<p class="pitfall">⚠️ Trap for revision: because "BASIC ALGORITHMS" is missing from this contents list, students routinely skip selection sort and bubble sort — which are exactly the algorithms the objectives slide promises ("three primitive sorting algorithms"). Slides 19–24 are examinable.</p>`,
        `<p class="y-chinh">🎯 Bản đồ chương: bốn mục — khái niệm, ba cấu trúc, cách biểu diễn, và tìm kiếm. Hãy đọc nó như bốn chủ đề thi, không phải bốn cái tựa.</p>
<ul>
<li><strong>6.1 Khái niệm: vào, ra, xử lý</strong> (slide 4–9) — định nghĩa phi hình thức, rồi ví dụ FindLargest kể ba lần: bằng lời, đã tinh chỉnh, đã tổng quát hoá. Toàn bộ ý nghĩa nằm ở chỗ được nhìn một mô tả mơ hồ dần trở thành máy móc.</li>
<li><strong>6.2 Ba cấu trúc cơ bản</strong> (slide 10–14) — tuần tự, rẽ nhánh, lặp. Kết quả Böhm–Jacopini: ba cái đó đủ cho <em>mọi</em> chương trình tính được. Không cần cấu trúc thứ tư nào.</li>
<li><strong>6.3 Biểu diễn thuật toán</strong> (slide 15–18) — sơ đồ hoạt động UML, mã giả, và một ví dụ làm mẫu. Hai thứ tiếng cho cùng một nội dung: một bằng hình, một bằng chữ.</li>
<li><strong>6.4 Thuật toán tìm kiếm: tuyến tính, nhị phân</strong> (slide 25–30) — phần "trả công" của cả chương, và cũng là phần nhiều điểm thi nhất.</li>
<li><strong>Slide Content bỏ sót cái gì</strong> — slide 19–24 là nguyên một mục ("4. BASIC ALGORITHMS": tổng, nhỏ nhất/lớn nhất, sắp xếp, selection sort, bubble sort) mà danh sách này không hề nhắc. Đừng lấy slide này làm bảng kiểm ôn thi; hãy lấy cả deck.</li>
<li><strong>Lệch cách đánh số</strong> — slide này ghi 6.1/6.2/6.3/6.4, còn các slide phân cách ghi "1-", "2-", "3-", "4.", "5-". Cùng một nội dung, hai lối đánh số, và một lối bị lệch một nhịp vì mục bị thiếu.</li>
</ul>
<p class="pitfall">⚠️ Bẫy khi ôn: vì "BASIC ALGORITHMS" vắng mặt trong danh sách này nên sinh viên hay bỏ qua selection sort và bubble sort — đúng những thuật toán mà slide Objectives hứa dạy ("ba thuật toán sắp xếp sơ cấp"). Slide 19–24 CÓ trong phạm vi thi.</p>`],

      [3, 'Objectives',
        `<p class="y-chinh">🎯 Nine objectives. Six of them the deck delivers; two of them (subalgorithms, iterative vs recursive) it never mentions again; one (sorting) it delivers under a heading the Content slide forgot.</p>
<ul>
<li><strong>"Define an algorithm and relate it to problem solving"</strong> — slides 5–9. Expected answer: a step-by-step method for solving a problem or doing a task, taking input and producing output.</li>
<li><strong>"Define three constructs — sequence, selection, and repetition"</strong> — slides 11–14. Note the slide says <em>selection</em> here but the body slides say <em>decision</em>. They are the same construct; both words are accepted.</li>
<li><strong>"Describe UML diagrams"</strong> — slide 16 only. One slide, one figure, three shapes. Small topic, easy marks.</li>
<li><strong>"Describe pseudocode"</strong> — slides 17–18, plus every algorithm from slide 20 onwards.</li>
<li><strong>"List basic algorithms and their applications"</strong> — slides 19–24: summation, smallest/largest, sorting, searching.</li>
<li><strong>"Three primitive sorting algorithms"</strong> — the deck shows only <strong>two</strong> in detail (selection sort, bubble sort). The third, insertion sort, is named on slide 22's list and never explained. If the exam asks about insertion sort you must get it from the textbook, not this deck.</li>
<li><strong>"Two common searching algorithms"</strong> — slides 26–30, linear and binary. This is the heaviest-weighted objective.</li>
<li><strong>"Define subalgorithms" and "distinguish iterative and recursive"</strong> — <strong>not covered anywhere in these 30 slides.</strong> These are Forouzan §8.5 and §8.6. Read them in the book if your syllabus keeps them.</li>
</ul>
<p class="pitfall">⚠️ Do not treat an objectives slide as proof of coverage. Two of these nine objectives have no slide behind them, and one is covered only two-thirds. Check the deck against the objectives before the exam, not after.</p>`,
        `<p class="y-chinh">🎯 Chín mục tiêu. Sáu cái deck có dạy; hai cái (subalgorithms, lặp và đệ quy) không bao giờ được nhắc lại; một cái (sắp xếp) được dạy dưới một tiêu đề mà slide Content quên mất.</p>
<ul>
<li><strong>"Định nghĩa thuật toán và liên hệ với giải quyết vấn đề"</strong> — slide 5–9. Câu trả lời mong đợi: một phương pháp từng bước để giải một bài toán hoặc làm một việc, nhận đầu vào và sinh ra đầu ra.</li>
<li><strong>"Định nghĩa ba cấu trúc — tuần tự, chọn lựa, lặp"</strong> — slide 11–14. Để ý slide này dùng chữ <em>selection</em> còn các slide thân bài dùng chữ <em>decision</em>. Cùng một cấu trúc; bài thi chấp nhận cả hai chữ.</li>
<li><strong>"Mô tả sơ đồ UML"</strong> — chỉ slide 16. Một slide, một hình, ba hình dạng. Chủ đề nhỏ, điểm dễ.</li>
<li><strong>"Mô tả mã giả"</strong> — slide 17–18, cộng với mọi thuật toán từ slide 20 trở đi.</li>
<li><strong>"Liệt kê các thuật toán cơ bản và ứng dụng"</strong> — slide 19–24: tổng, nhỏ nhất/lớn nhất, sắp xếp, tìm kiếm.</li>
<li><strong>"Ba thuật toán sắp xếp sơ cấp"</strong> — deck chỉ trình bày kỹ <strong>hai</strong> (selection sort, bubble sort). Cái thứ ba, insertion sort, chỉ được nêu tên trong danh sách ở slide 22 rồi thôi. Nếu đề hỏi insertion sort thì phải lấy từ giáo trình, không có trong deck này.</li>
<li><strong>"Hai thuật toán tìm kiếm thông dụng"</strong> — slide 26–30, tuyến tính và nhị phân. Đây là mục tiêu nặng điểm nhất.</li>
<li><strong>"Định nghĩa subalgorithm" và "phân biệt lặp với đệ quy"</strong> — <strong>không có ở bất kỳ chỗ nào trong 30 slide này.</strong> Đó là §8.5 và §8.6 của Forouzan. Nếu đề cương môn còn giữ hai mục ấy thì phải đọc sách.</li>
</ul>
<p class="pitfall">⚠️ Đừng coi slide Objectives là bằng chứng đã dạy đủ. Hai trong chín mục tiêu không có slide nào đứng sau, và một mục chỉ dạy được hai phần ba. Hãy đối chiếu deck với mục tiêu TRƯỚC kỳ thi, đừng đối chiếu sau.</p>`],

      [4, '1 - Concepts: input, output, processing',
        `<p class="y-chinh">🎯 A section divider announcing the shape every algorithm has: <strong>input → processing → output</strong>. Three words, and they are the frame for the whole chapter.</p>
<ul>
<li><strong>Why this framing and not another</strong> — it is deliberately the same three-part picture as the Turing model from Chapter 1 (<code>Input data → [Computer] → Output data</code>). An algorithm is what you put <em>inside</em> that box. Chapter 1 drew the box; Chapter 6 fills it.</li>
<li><strong>Input</strong> — the data the algorithm is given. It must be stated: "a list of n positive integers", not "some numbers". An algorithm with an undefined input is not an algorithm.</li>
<li><strong>Processing</strong> — the ordered steps. This is where the three constructs live.</li>
<li><strong>Output</strong> — what comes back. Every algorithm must produce at least one output, otherwise running it was pointless. In pseudocode this is the <code>return</code> line (slide 18).</li>
<li><strong>Four properties an algorithm must have</strong> (the classic exam list, which the slides imply but never number): <em>finiteness</em> — it stops; <em>definiteness</em> — every step is unambiguous; <em>input and output</em> — zero or more in, at least one out; <em>effectiveness</em> — every step is basic enough to actually be carried out. Slide 5's box hides all four inside the phrase "step-by-step method".</li>
<li><strong>The three slides ahead</strong> — 5 gives the definition, 6–7 give the FindLargest example in words and in a picture, 8–9 fix its two defects.</li>
</ul>
<p class="meo">💡 Memorise the four properties with the word <strong>FDIE</strong>: <strong>F</strong>initeness, <strong>D</strong>efiniteness, <strong>I</strong>nput/output, <strong>E</strong>ffectiveness. Counterexamples are on the next slide's notes — an exam loves to give you a broken "algorithm" and ask which property it violates.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục, công bố hình dạng mà mọi thuật toán đều có: <strong>vào → xử lý → ra</strong>. Ba chữ, và chúng là khung của cả chương.</p>
<ul>
<li><strong>Vì sao lại là khung này</strong> — nó cố tình trùng đúng bức tranh ba phần của mô hình Turing ở Chương 1 (<code>Input data → [Computer] → Output data</code>). Thuật toán chính là thứ bạn đặt <em>vào trong</em> cái hộp ấy. Chương 1 vẽ cái hộp; Chương 6 lấp đầy nó.</li>
<li><strong>Đầu vào</strong> — dữ liệu được đưa cho thuật toán. Phải phát biểu rõ: "một danh sách n số nguyên dương", không phải "vài con số". Thuật toán mà đầu vào không xác định thì không phải thuật toán.</li>
<li><strong>Xử lý</strong> — các bước có thứ tự. Đây là chỗ ba cấu trúc sinh sống.</li>
<li><strong>Đầu ra</strong> — thứ trả về. Mọi thuật toán phải sinh ra ít nhất một đầu ra, không thì chạy nó làm gì. Trong mã giả đó là dòng <code>return</code> (slide 18).</li>
<li><strong>Bốn tính chất bắt buộc của thuật toán</strong> (danh sách kinh điển trong đề thi, slide có ngụ ý nhưng không đánh số): <em>hữu hạn</em> — nó phải dừng; <em>xác định</em> — mỗi bước không nhập nhằng; <em>có đầu vào/đầu ra</em> — không hoặc nhiều đầu vào, ít nhất một đầu ra; <em>khả thi</em> — mỗi bước đủ sơ cấp để thật sự làm được. Cái khung đỏ ở slide 5 giấu cả bốn tính chất trong cụm "step-by-step method".</li>
<li><strong>Ba slide sắp tới</strong> — slide 5 đưa định nghĩa, 6–7 đưa ví dụ FindLargest bằng lời và bằng hình, 8–9 vá hai khuyết điểm của nó.</li>
</ul>
<p class="meo">💡 Nhớ bốn tính chất bằng chữ <strong>HXVK</strong>: <strong>H</strong>ữu hạn, <strong>X</strong>ác định, <strong>V</strong>ào/ra, <strong>K</strong>hả thi. Phản ví dụ cho từng cái nằm ở slide sau — đề thi rất thích đưa một "thuật toán" hỏng rồi hỏi nó vi phạm tính chất nào.</p>`],

      [5, '1. Informal definition',
        `<p class="y-chinh">🎯 The definition the chapter runs on, in a red box: <strong>"Algorithm: a step-by-step method for solving a problem or doing a task."</strong> Figure 6.1 draws it as a box labelled with that sentence, with <em>Input data</em> entering from above and <em>Output data</em> leaving below.</p>
<ul>
<li><strong>Why "informal"</strong> — the slide says so itself. A formal definition would have to say what a "step" is, and that requires a machine model (a Turing machine, or a specific instruction set). For this course the informal one is enough and it is the one to write in the exam.</li>
<li><strong>Read the figure carefully</strong> — the algorithm box is <em>between</em> the two arrows. It is not the data and it is not the answer; it is the method. Three separate things, and exam questions like to swap them.</li>
<li><strong>Counterexample — finiteness</strong>: "Step 1: set <code>i = 1</code>. Step 2: print <code>i</code>. Step 3: go to Step 2." Perfectly definite, perfectly effective, and it never stops. Not an algorithm; it is a procedure or a non-terminating computation.</li>
<li><strong>Counterexample — definiteness</strong>: "Add a suitable amount of salt." Suitable for whom? A recipe can say that; an algorithm cannot. Same problem with "sort the list somehow".</li>
<li><strong>Counterexample — input/output</strong>: "Step 1: think about the number 7. Step 2: stop." It halts, it is definite, it is effective, and it produces nothing. Useless, so not counted as an algorithm.</li>
<li><strong>Counterexample — effectiveness</strong>: "Step 1: let <em>x</em> be the exact decimal value of π. Step 2: print <em>x</em>." Every step is unambiguous, but step 1 can never actually be carried out — π has infinitely many digits. Also: "if this program halts on every input, print YES" — the halting problem, provably not effective.</li>
</ul>
<p class="meo">💡 The quick test for "is this an algorithm?": could you hand it to a bored, extremely literal stranger who knows nothing about the problem, and would they produce the right answer and stop? If you would have to explain anything, a step is not definite enough.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa mà cả chương chạy trên đó, nằm trong khung đỏ: <strong>"Algorithm: a step-by-step method for solving a problem or doing a task"</strong> (thuật toán: phương pháp từng bước để giải một bài toán hoặc làm một việc). Hình 6.1 vẽ nó thành một hộp mang đúng câu ấy, <em>Input data</em> đi vào từ trên, <em>Output data</em> đi ra ở dưới.</p>
<ul>
<li><strong>Vì sao "phi hình thức"</strong> — chính slide nói vậy. Một định nghĩa hình thức sẽ phải nói "một bước" là gì, mà muốn thế thì cần một mô hình máy (máy Turing, hoặc một tập lệnh cụ thể). Với môn này thì bản phi hình thức là đủ, và đó là bản nên viết vào bài thi.</li>
<li><strong>Đọc kỹ cái hình</strong> — hộp thuật toán nằm <em>giữa</em> hai mũi tên. Nó không phải dữ liệu và cũng không phải đáp số; nó là phương pháp. Ba thứ khác nhau, và đề thi rất thích tráo chúng cho nhau.</li>
<li><strong>Phản ví dụ — tính hữu hạn</strong>: "Bước 1: đặt <code>i = 1</code>. Bước 2: in <code>i</code>. Bước 3: quay lại Bước 2." Hoàn toàn xác định, hoàn toàn khả thi, và nó không bao giờ dừng. Không phải thuật toán; đó là một thủ tục chạy mãi.</li>
<li><strong>Phản ví dụ — tính xác định</strong>: "Cho muối vừa ăn." Vừa với ai? Công thức nấu ăn nói vậy được; thuật toán thì không. Cũng vướng y như vậy là câu "sắp xếp danh sách bằng cách nào đó".</li>
<li><strong>Phản ví dụ — có đầu vào/đầu ra</strong>: "Bước 1: nghĩ về số 7. Bước 2: dừng." Nó dừng, nó xác định, nó khả thi, và nó chẳng sinh ra gì. Vô dụng, nên không được tính là thuật toán.</li>
<li><strong>Phản ví dụ — tính khả thi</strong>: "Bước 1: gọi <em>x</em> là giá trị thập phân ĐÚNG của π. Bước 2: in <em>x</em>." Mỗi bước đều không nhập nhằng, nhưng bước 1 không đời nào thực hiện được — π có vô hạn chữ số. Một ví dụ khác: "nếu chương trình này dừng với mọi đầu vào thì in YES" — bài toán dừng, đã chứng minh được là không khả thi.</li>
</ul>
<p class="meo">💡 Phép thử nhanh "đây có phải thuật toán không": bạn có dám đưa nó cho một người lạ cực kỳ máy móc, chẳng biết gì về bài toán, và người đó vẫn ra đúng đáp án rồi dừng không? Nếu bạn còn phải giải thích thêm câu nào thì bước đó chưa đủ xác định.</p>`],

      [6, 'Example (find the largest integer)',
        `<p class="y-chinh">🎯 The chapter's running example: find the largest of the list <strong>12, 8, 13, 9, 11</strong> — and the requirement that the method must not depend on there being exactly five numbers.</p>
<ul>
<li><strong>Step 1</strong> — look at the first integer (12), invent a variable called <em>Largest</em>, set it to 12.</li>
<li><strong>Step 2</strong> — compare Largest (12) with the second integer (8). 12 &gt; 8, so nothing changes.</li>
<li><strong>Step 3</strong> — the new integer (13) is bigger than Largest (12), so Largest becomes 13.</li>
<li><strong>Steps 4 and 5</strong> — 9 and 11 are both smaller than 13, nothing changes. Answer: 13.</li>
<li><strong>Why a variable and not "just look"</strong> — a human sees 13 instantly because we perceive all five numbers at once. A machine reads one value at a time, so it needs somewhere to keep "the best so far". That storage <em>is</em> the algorithm's idea. Everything else is bookkeeping.</li>
<li><strong>The general shape</strong> — this is the <em>accumulator</em> pattern and you will meet it in every language you learn: keep a running answer, update it as the data streams past. Summation on slide 20 is the same pattern with <code>+</code> instead of <code>max</code>.</li>
</ul>
<p>Traced with a real program (initialising Largest to the first element, five reads, four comparisons):</p>
<table><tr><th>Step</th><th>current</th><th>Largest before</th><th>current &gt; Largest?</th><th>Largest after</th></tr>
<tr><td>1</td><td>12</td><td>— (init)</td><td>set Largest := 12</td><td>12</td></tr>
<tr><td>2</td><td>8</td><td>12</td><td>8 &gt; 12 → no</td><td>12</td></tr>
<tr><td>3</td><td>13</td><td>12</td><td>13 &gt; 12 → YES</td><td>13</td></tr>
<tr><td>4</td><td>9</td><td>13</td><td>9 &gt; 13 → no</td><td>13</td></tr>
<tr><td>5</td><td>11</td><td>13</td><td>11 &gt; 13 → no</td><td>13</td></tr></table>
<p class="dap-an">✅ Answer: <strong>Largest = 13</strong>, reached after <strong>4 comparisons</strong> in this version (steps 2–5). Note that Largest changed only twice: once at initialisation and once in step 3.</p>
<p class="pitfall">⚠️ The slide says "a list of <em>positive</em> integers" for a reason — it lets the refined version on slide 8 initialise Largest to −∞ (or to 0, in a lazier textbook) and still be correct. Feed the same code a list of all-negative numbers with <code>Largest = 0</code> and it returns 0, a number that is not in the list at all.</p>`,
        `<p class="y-chinh">🎯 Ví dụ xuyên suốt cả chương: tìm số lớn nhất trong danh sách <strong>12, 8, 13, 9, 11</strong> — kèm yêu cầu cách làm phải không phụ thuộc vào việc có đúng năm số.</p>
<ul>
<li><strong>Bước 1</strong> — nhìn số đầu tiên (12), đặt ra một biến tên <em>Largest</em>, gán cho nó bằng 12.</li>
<li><strong>Bước 2</strong> — so Largest (12) với số thứ hai (8). 12 &gt; 8 nên không đổi gì.</li>
<li><strong>Bước 3</strong> — số mới (13) lớn hơn Largest (12), nên Largest thành 13.</li>
<li><strong>Bước 4 và 5</strong> — 9 và 11 đều nhỏ hơn 13, không đổi gì. Đáp số: 13.</li>
<li><strong>Vì sao phải có biến chứ không "nhìn phát ra ngay"</strong> — người nhìn ra 13 tức thì vì ta thấy cả năm số cùng lúc. Máy đọc mỗi lần một giá trị, nên nó cần một chỗ giữ "cái tốt nhất tới lúc này". Chính chỗ lưu ấy <em>là</em> ý tưởng của thuật toán. Phần còn lại chỉ là sổ sách.</li>
<li><strong>Dạng tổng quát</strong> — đây là mẫu <em>bộ tích luỹ</em> (accumulator), và bạn sẽ gặp lại nó trong mọi ngôn ngữ: giữ một đáp án đang chạy, cập nhật nó khi dữ liệu trôi qua. Bài tính tổng ở slide 20 là đúng mẫu này, chỉ thay <code>max</code> bằng <code>+</code>.</li>
</ul>
<p>Chạy tay bằng chương trình thật (khởi tạo Largest bằng phần tử đầu, đọc 5 lần, so sánh 4 lần):</p>
<table><tr><th>Bước</th><th>current</th><th>Largest trước</th><th>current &gt; Largest?</th><th>Largest sau</th></tr>
<tr><td>1</td><td>12</td><td>— (khởi tạo)</td><td>gán Largest := 12</td><td>12</td></tr>
<tr><td>2</td><td>8</td><td>12</td><td>8 &gt; 12 → không</td><td>12</td></tr>
<tr><td>3</td><td>13</td><td>12</td><td>13 &gt; 12 → CÓ</td><td>13</td></tr>
<tr><td>4</td><td>9</td><td>13</td><td>9 &gt; 13 → không</td><td>13</td></tr>
<tr><td>5</td><td>11</td><td>13</td><td>11 &gt; 13 → không</td><td>13</td></tr></table>
<p class="dap-an">✅ Đáp án: <strong>Largest = 13</strong>, đạt được sau <strong>4 phép so sánh</strong> ở phiên bản này (bước 2–5). Để ý Largest chỉ đổi hai lần: một lần lúc khởi tạo và một lần ở bước 3.</p>
<p class="pitfall">⚠️ Slide ghi "danh sách số nguyên <em>dương</em>" là có lý do — nhờ vậy bản tinh chỉnh ở slide 8 mới được phép khởi tạo Largest bằng −∞ (hoặc bằng 0 trong những sách lười hơn) mà vẫn đúng. Đưa đúng đoạn mã ấy một danh sách toàn số âm với <code>Largest = 0</code> thì nó trả về 0, một con số không hề có trong danh sách.</p>`],

      [7, 'Example (flow)',
        `<p class="y-chinh">🎯 The same example drawn as a picture. Five rows, one per step; each row shows the list <code>12 8 13 9 11</code> with the current element highlighted, and the box <em>Largest</em> on the left showing its value after that step. Input <code>(12 8 13 9 11)</code> enters at the top, output <code>(13)</code> leaves at the bottom, and the whole thing is labelled <strong>FindLargest</strong>.</p>
<ul>
<li><strong>What the picture adds over slide 6</strong> — it makes the <em>state</em> visible. At every moment there are exactly two things that matter: where the pointer is, and what Largest holds. The five rows are five snapshots of that pair.</li>
<li><strong>Read the Largest column down</strong> — 12, 12, 13, 13, 13. It changes twice and then stays. That column is the whole computation; the rest of the picture is context.</li>
<li><strong>Why the box has a name</strong> — <code>FindLargest</code> is written under it because an algorithm is a <em>named</em> thing you can invoke. This foreshadows slide 18 where the pseudocode begins <code>Algorithm: SumOfTwo (first, second)</code>, and PRF192 where it becomes a function.</li>
<li><strong>The highlighted cell is the "current" pointer</strong> — in C this will be the loop variable <code>i</code>. The picture is showing you <code>a[i]</code> for i = 0..4.</li>
<li><strong>Input and output are drawn outside the box</strong> — deliberately. They are not part of the algorithm; they are what it consumes and produces. Same three-part frame as Figure 6.1.</li>
</ul>
<p class="dap-an">✅ Answer to the obvious exam question ("what does Largest hold after step 3?"): <strong>13</strong>. After step 2 it still holds <strong>12</strong>. The trap is that the <em>largest value seen so far</em> and the <em>value currently being inspected</em> are different columns, and step 2 is where they differ most obviously (Largest = 12, current = 8).</p>
<p class="meo">💡 When you trace any algorithm on paper, copy this layout: one row per iteration, one column per variable. Ninety percent of trace-table exam mistakes come from trying to keep the variables in your head instead of on the page.</p>`,
        `<p class="y-chinh">🎯 Cũng ví dụ ấy nhưng vẽ thành hình. Năm hàng, mỗi hàng một bước; mỗi hàng hiện danh sách <code>12 8 13 9 11</code> với phần tử đang xét được tô đậm, và ô <em>Largest</em> bên trái cho biết giá trị của nó sau bước đó. Đầu vào <code>(12 8 13 9 11)</code> đi vào từ trên, đầu ra <code>(13)</code> đi ra ở dưới, cả khối mang tên <strong>FindLargest</strong>.</p>
<ul>
<li><strong>Hình thêm được gì so với slide 6</strong> — nó làm cho <em>trạng thái</em> hiện ra. Ở mỗi thời điểm chỉ có đúng hai thứ đáng quan tâm: con trỏ đang ở đâu, và Largest đang giữ gì. Năm hàng là năm ảnh chụp của cặp ấy.</li>
<li><strong>Đọc cột Largest theo chiều dọc</strong> — 12, 12, 13, 13, 13. Nó đổi hai lần rồi đứng yên. Cột đó chính là toàn bộ phép tính; phần còn lại của hình chỉ là bối cảnh.</li>
<li><strong>Vì sao cái hộp có tên</strong> — chữ <code>FindLargest</code> viết dưới hộp vì thuật toán là một thứ <em>có tên</em> để gọi được. Đây là điềm báo cho slide 18, nơi mã giả mở đầu bằng <code>Algorithm: SumOfTwo (first, second)</code>, và cho PRF192, nơi nó trở thành một hàm.</li>
<li><strong>Ô được tô là con trỏ "current"</strong> — trong C nó sẽ là biến lặp <code>i</code>. Hình đang cho bạn xem <code>a[i]</code> với i = 0..4.</li>
<li><strong>Đầu vào và đầu ra vẽ NGOÀI cái hộp</strong> — cố ý. Chúng không thuộc về thuật toán; chúng là thứ nó tiêu thụ và thứ nó sinh ra. Vẫn đúng khung ba phần của Hình 6.1.</li>
</ul>
<p class="dap-an">✅ Đáp án cho câu hỏi thi hiển nhiên ("sau bước 3 thì Largest bằng bao nhiêu?"): <strong>13</strong>. Sau bước 2 nó vẫn là <strong>12</strong>. Bẫy nằm ở chỗ <em>giá trị lớn nhất đã gặp</em> và <em>giá trị đang xét</em> là hai cột khác nhau, và bước 2 là chỗ hai cột đó lệch nhau rõ nhất (Largest = 12, current = 8).</p>
<p class="meo">💡 Khi chạy tay bất kỳ thuật toán nào trên giấy, hãy chép đúng cách bày này: mỗi lượt một hàng, mỗi biến một cột. Chín phần mười lỗi sai ở câu chạy bảng là do cố giữ các biến trong đầu thay vì viết ra giấy.</p>`],

      [8, '2. Refinement',
        `<p class="y-chinh">🎯 The first version has two defects, and the slide names both: <strong>step 1 does something different from the other steps</strong>, and <strong>steps 2–5 are not worded identically</strong>. Figure 6.2 fixes them by adding a <em>Step 0</em> that sets <code>Largest ← −∞</code>, after which all five steps read exactly the same sentence.</p>
<ul>
<li><strong>Why uniformity matters so much</strong> — you cannot put a loop around steps that are not identical. Step 0 exists purely so that steps 1–5 can become one repeated instruction. This is the single most important idea on the slide.</li>
<li><strong>The sentence that all five steps now share</strong> — "If the current integer is greater than Largest, set Largest to the current integer." One decision construct, applied n times.</li>
<li><strong>Why −∞ and not 0</strong> — because −∞ is smaller than every possible input, the first comparison is guaranteed to succeed and Largest picks up the real first element. Using 0 only works because the slide promised positive integers; −∞ works always.</li>
<li><strong>How −∞ is written in real code</strong> — C has <code>INT_MIN</code> from <code>&lt;limits.h&gt;</code> (−2147483648 for 32-bit <code>int</code>), or <code>-INFINITY</code> from <code>&lt;math.h&gt;</code> for <code>double</code>. Most working programmers avoid the problem entirely by initialising to <code>a[0]</code> and looping from index 1 — that is the version on slide 6.</li>
<li><strong>Note the comparison count changes</strong> — with the −∞ initialisation the loop runs n times and does n comparisons; with the <code>a[0]</code> initialisation it runs n−1 times and does n−1 comparisons. Same answer, one comparison apart.</li>
</ul>
<p>Measured on <code>12 8 13 9 11</code> with the slide's own −∞ version:</p>
<table><tr><th>Step</th><th>current</th><th>Test</th><th>Result</th><th>Largest after</th></tr>
<tr><td>0</td><td>—</td><td>set Largest ← −∞</td><td>—</td><td>−∞</td></tr>
<tr><td>1</td><td>12</td><td>12 &gt; −∞ ?</td><td>TRUE</td><td>12</td></tr>
<tr><td>2</td><td>8</td><td>8 &gt; 12 ?</td><td>FALSE</td><td>12</td></tr>
<tr><td>3</td><td>13</td><td>13 &gt; 12 ?</td><td>TRUE</td><td>13</td></tr>
<tr><td>4</td><td>9</td><td>9 &gt; 13 ?</td><td>FALSE</td><td>13</td></tr>
<tr><td>5</td><td>11</td><td>11 &gt; 13 ?</td><td>FALSE</td><td>13</td></tr></table>
<p class="dap-an">✅ Answer: Largest = <strong>13</strong> after <strong>5 comparisons</strong> (one per element). The comparison went TRUE twice, at steps 1 and 3.</p>`,
        `<p class="y-chinh">🎯 Bản đầu có hai khuyết điểm, và slide nêu đích danh cả hai: <strong>bước 1 làm việc khác các bước còn lại</strong>, và <strong>bước 2–5 không được diễn đạt giống hệt nhau</strong>. Hình 6.2 vá bằng cách thêm một <em>Step 0</em> gán <code>Largest ← −∞</code>, sau đó cả năm bước đọc lên y hệt một câu.</p>
<ul>
<li><strong>Vì sao sự đồng dạng lại quan trọng đến thế</strong> — bạn không thể quàng một vòng lặp quanh những bước không giống nhau. Bước 0 tồn tại chỉ để bước 1–5 trở thành MỘT lệnh lặp lại. Đây là ý quan trọng nhất của slide.</li>
<li><strong>Câu mà cả năm bước giờ dùng chung</strong> — "Nếu số hiện tại lớn hơn Largest thì gán Largest bằng số hiện tại." Một cấu trúc rẽ nhánh, áp dụng n lần.</li>
<li><strong>Vì sao là −∞ chứ không phải 0</strong> — vì −∞ nhỏ hơn mọi đầu vào có thể có, nên phép so sánh đầu tiên chắc chắn đúng và Largest nhặt được phần tử đầu thật. Dùng 0 chỉ chạy được nhờ slide đã hứa là số nguyên dương; dùng −∞ thì lúc nào cũng đúng.</li>
<li><strong>−∞ viết thế nào trong mã thật</strong> — C có <code>INT_MIN</code> trong <code>&lt;limits.h&gt;</code> (−2147483648 với <code>int</code> 32 bit), hoặc <code>-INFINITY</code> trong <code>&lt;math.h&gt;</code> cho <code>double</code>. Đa số người viết mã thật né hẳn vấn đề bằng cách khởi tạo bằng <code>a[0]</code> rồi lặp từ chỉ số 1 — đúng phiên bản ở slide 6.</li>
<li><strong>Để ý số phép so sánh đổi</strong> — với cách khởi tạo −∞ thì vòng lặp chạy n lượt và làm n phép so sánh; với cách khởi tạo <code>a[0]</code> thì chạy n−1 lượt và làm n−1 phép so sánh. Cùng đáp số, lệch nhau đúng một phép.</li>
</ul>
<p>Đo thật trên <code>12 8 13 9 11</code> với đúng phiên bản −∞ của slide:</p>
<table><tr><th>Bước</th><th>current</th><th>Phép kiểm</th><th>Kết quả</th><th>Largest sau</th></tr>
<tr><td>0</td><td>—</td><td>gán Largest ← −∞</td><td>—</td><td>−∞</td></tr>
<tr><td>1</td><td>12</td><td>12 &gt; −∞ ?</td><td>ĐÚNG</td><td>12</td></tr>
<tr><td>2</td><td>8</td><td>8 &gt; 12 ?</td><td>SAI</td><td>12</td></tr>
<tr><td>3</td><td>13</td><td>13 &gt; 12 ?</td><td>ĐÚNG</td><td>13</td></tr>
<tr><td>4</td><td>9</td><td>9 &gt; 13 ?</td><td>SAI</td><td>13</td></tr>
<tr><td>5</td><td>11</td><td>11 &gt; 13 ?</td><td>SAI</td><td>13</td></tr></table>
<p class="dap-an">✅ Đáp án: Largest = <strong>13</strong> sau <strong>5 phép so sánh</strong> (mỗi phần tử một phép). Phép so sánh cho ĐÚNG hai lần, ở bước 1 và bước 3.</p>`],

      [9, '3. Generalization',
        `<p class="y-chinh">🎯 The last step of the refinement: replace "five steps" with "<strong>Repeat the following step n times</strong>". Figure 6.3 shows the whole algorithm collapsed into two boxes — <code>Set Largest to −∞</code>, then a red loop box containing the single decision sentence — with input <em>(n integers)</em> and one output.</p>
<ul>
<li><strong>What generalisation actually buys</strong> — the picture no longer grows when the data grows. Five numbers, a thousand, a million: the diagram is the same size. That is the difference between describing a <em>computation</em> and describing an <em>algorithm</em>.</li>
<li><strong>The slide's own numbers</strong> — "n can be 1000, 1 000 000, or more". Those are not decoration; they are the reason loops exist. Writing out a million steps is not an option, and a million-step description would not be an algorithm anyway (it would violate the spirit of finiteness — the <em>description</em> must be finite and fixed, not just the run).</li>
<li><strong>Two constructs, visible in one picture</strong> — the outer red box is <em>repetition</em>, the sentence inside it is <em>decision</em>, and the two boxes stacked vertically are <em>sequence</em>. All three constructs of section 6.2 are already on this slide, before the section that names them.</li>
<li><strong>In C this is four lines</strong> — <code>int largest = INT_MIN;</code> then <code>for (int i = 0; i &lt; n; i++) if (a[i] &gt; largest) largest = a[i];</code> then <code>return largest;</code>. Compare that with Figure 6.3 box by box: they match line for line.</li>
<li><strong>Cost of the algorithm</strong> — exactly n comparisons for n elements, no matter what the data looks like. There is no best case and no worst case. In the notation of slide 26's discussion, that is <strong>O(n)</strong>: double the data, double the work.</li>
</ul>
<p class="dap-an">✅ Worked check: for n = 1 000 000 this algorithm does exactly <strong>1 000 000 comparisons</strong>. You cannot do better — finding a maximum requires looking at every element at least once, otherwise the one you skipped might have been the largest. FindLargest is provably optimal, which is rare and worth knowing.</p>
<p class="pitfall">⚠️ "Repeat n times" hides an assumption the picture does not state: you must be able to <em>get</em> the next integer each time. If the input is a stream with fewer than n values the loop reads garbage. In pseudocode this is why the summation diagram on slide 20 uses the condition "more integers to add" rather than a fixed count.</p>`,
        `<p class="y-chinh">🎯 Bước cuối của việc tinh chỉnh: thay "năm bước" bằng "<strong>Lặp lại bước sau n lần</strong>". Hình 6.3 vẽ cả thuật toán rút còn hai khối — <code>Set Largest to −∞</code>, rồi một khối lặp màu đỏ chứa đúng một câu rẽ nhánh — với đầu vào <em>(n số nguyên)</em> và một đầu ra.</p>
<ul>
<li><strong>Tổng quát hoá thật ra mua được gì</strong> — bức hình không phình ra khi dữ liệu phình ra. Năm số, một nghìn số, một triệu số: sơ đồ vẫn y nguyên kích thước. Đó chính là khác biệt giữa mô tả một <em>phép tính</em> và mô tả một <em>thuật toán</em>.</li>
<li><strong>Con số của chính slide</strong> — "n có thể là 1000, 1 000 000, hoặc hơn". Đó không phải trang trí; đó là lý do vòng lặp tồn tại. Viết ra một triệu bước là chuyện không thể, mà một mô tả dài một triệu bước thì cũng chẳng còn là thuật toán (nó phá vỡ tinh thần của tính hữu hạn — <em>bản mô tả</em> phải hữu hạn và cố định, chứ không chỉ lần chạy).</li>
<li><strong>Hai cấu trúc hiện rõ trong một hình</strong> — khối đỏ bên ngoài là <em>lặp</em>, câu bên trong nó là <em>rẽ nhánh</em>, và hai khối xếp chồng theo chiều dọc là <em>tuần tự</em>. Cả ba cấu trúc của mục 6.2 đã có mặt ở slide này, trước cả cái mục đặt tên cho chúng.</li>
<li><strong>Trong C nó là bốn dòng</strong> — <code>int largest = INT_MIN;</code> rồi <code>for (int i = 0; i &lt; n; i++) if (a[i] &gt; largest) largest = a[i];</code> rồi <code>return largest;</code>. Hãy đối chiếu với Hình 6.3 từng khối một: chúng khớp nhau dòng đối dòng.</li>
<li><strong>Giá của thuật toán</strong> — đúng n phép so sánh cho n phần tử, bất kể dữ liệu trông thế nào. Không có trường hợp tốt nhất và cũng không có xấu nhất. Theo ký hiệu bàn ở slide 26, đó là <strong>O(n)</strong>: dữ liệu gấp đôi thì công gấp đôi.</li>
</ul>
<p class="dap-an">✅ Kiểm lại bằng số: với n = 1 000 000 thuật toán này làm đúng <strong>1 000 000 phép so sánh</strong>. Không thể làm tốt hơn — muốn tìm cực đại thì buộc phải nhìn mọi phần tử ít nhất một lần, không thì cái bạn bỏ qua có thể chính là số lớn nhất. FindLargest tối ưu một cách chứng minh được, chuyện hiếm và đáng nhớ.</p>
<p class="pitfall">⚠️ "Lặp n lần" giấu một giả định mà hình không nói: mỗi lượt bạn phải <em>lấy được</em> số kế tiếp. Nếu đầu vào là một dòng dữ liệu có ít hơn n giá trị thì vòng lặp đọc phải rác. Trong mã giả, đó là lý do lưu đồ tính tổng ở slide 20 dùng điều kiện "còn số để cộng" thay vì một con số đếm cố định.</p>`],

      [10, '2 - Three basic constructs',
        `<p class="y-chinh">🎯 A section divider, and arguably the most important claim in the whole chapter: <strong>three constructs are enough for every algorithm that exists</strong>.</p>
<ul>
<li><strong>The theorem behind the claim</strong> — the <em>structured program theorem</em>, proved by Corrado Böhm and Giuseppe Jacopini in 1966. Any computable function can be expressed using only sequence, selection and iteration. No <code>goto</code> is ever necessary.</li>
<li><strong>Why anyone cared</strong> — in the 1960s programs were written with unrestricted jumps, and large ones became unreadable ("spaghetti code"). Edsger Dijkstra's 1968 letter <em>"Go To Statement Considered Harmful"</em> turned this theorem into a design rule, and structured programming became the standard by the mid-1970s. Every mainstream language since is built on it.</li>
<li><strong>What "enough" means and does not mean</strong> — it means <em>expressible</em>, not <em>convenient</em>. C still has <code>break</code>, <code>continue</code>, <code>return</code> from the middle of a function and even <code>goto</code>; they are shortcuts, not new powers. Anything they do can be rewritten with the three constructs, sometimes with an extra flag variable.</li>
<li><strong>The three, named</strong> — <em>sequence</em> (do this, then this), <em>decision / selection</em> (do this or that), <em>repetition / loop</em> (do this again). Slides 12, 13 and 14 take one each.</li>
<li><strong>Why this makes programs debuggable</strong> — each construct has exactly one entry point and one exit point. Stack them and the result still has one entry and one exit, so you can reason about any block without knowing what surrounds it. Unrestricted <code>goto</code> destroys that property, which is precisely why it is hard to debug.</li>
</ul>
<p class="meo">💡 Exam phrasing to memorise verbatim: "It has been proven that there is no need for any other constructs. Using only these constructs makes a program or an algorithm easy to understand, debug, or change." That sentence, or a close paraphrase, is the expected answer to "why only three?".</p>`,
        `<p class="y-chinh">🎯 Slide phân mục, và có lẽ là tuyên bố quan trọng nhất cả chương: <strong>ba cấu trúc là đủ cho mọi thuật toán tồn tại trên đời</strong>.</p>
<ul>
<li><strong>Định lý đứng sau tuyên bố ấy</strong> — <em>định lý chương trình có cấu trúc</em>, do Corrado Böhm và Giuseppe Jacopini chứng minh năm 1966. Mọi hàm tính được đều biểu diễn được chỉ bằng tuần tự, chọn lựa và lặp. Không bao giờ cần tới <code>goto</code>.</li>
<li><strong>Vì sao người ta quan tâm</strong> — thập niên 1960 người ta viết chương trình bằng các lệnh nhảy tự do, và chương trình lớn trở nên không đọc nổi ("mã mì spaghetti"). Lá thư năm 1968 của Edsger Dijkstra, <em>"Go To Statement Considered Harmful"</em>, biến định lý này thành một quy tắc thiết kế, và tới giữa thập niên 1970 lập trình có cấu trúc thành chuẩn mực. Mọi ngôn ngữ phổ thông từ đó tới nay đều dựng trên nền ấy.</li>
<li><strong>"Đủ" nghĩa là gì và KHÔNG nghĩa là gì</strong> — nghĩa là <em>biểu diễn được</em>, chứ không phải <em>tiện</em>. C vẫn có <code>break</code>, <code>continue</code>, <code>return</code> giữa hàm và thậm chí cả <code>goto</code>; chúng là lối tắt, không phải năng lực mới. Việc gì chúng làm được cũng viết lại được bằng ba cấu trúc, đôi khi phải thêm một biến cờ.</li>
<li><strong>Ba cái, gọi tên</strong> — <em>tuần tự</em> (làm cái này rồi làm cái kia), <em>rẽ nhánh / chọn lựa</em> (làm cái này hoặc cái kia), <em>lặp</em> (làm lại cái này). Slide 12, 13 và 14 mỗi slide nhận một cái.</li>
<li><strong>Vì sao nhờ vậy mà chương trình gỡ lỗi được</strong> — mỗi cấu trúc có đúng một lối vào và một lối ra. Xếp chồng chúng lên nhau thì kết quả vẫn một vào một ra, nên bạn lý luận được về một khối bất kỳ mà không cần biết xung quanh nó là gì. <code>goto</code> tự do phá đúng tính chất ấy, và đó chính xác là lý do nó khó gỡ lỗi.</li>
</ul>
<p class="meo">💡 Câu nên thuộc nguyên văn để viết vào bài thi: "It has been proven that there is no need for any other constructs. Using only these constructs makes a program or an algorithm easy to understand, debug, or change." Câu ấy, hoặc một bản diễn đạt sát nó, là câu trả lời mong đợi cho "vì sao chỉ ba?".</p>`],

      [11, 'Introduction (three constructs)',
        `<p class="y-chinh">🎯 The three constructs, side by side in Figure 6.4: <strong>a. Sequence</strong> (do action 1, do action 2, … do action n), <strong>b. Decision</strong> (if a condition is true, do a series of actions; else, do another series), <strong>c. Repetition</strong> (while a condition is true, do a series of actions).</p>
<ul>
<li><strong>Read the figure as three sentences</strong> — each yellow box is an action, each outer box is a construct. Notice that the decision box and the repetition box both contain <em>a series of actions</em>, which may itself be any of the three constructs. That nesting is what gives three primitives unlimited power.</li>
<li><strong>Sequence is the default</strong> — it needs no keyword in any language. In C, writing two statements one after another <em>is</em> a sequence. It is a construct precisely because the order is part of the meaning: <code>x = 5; y = x + 1;</code> and <code>y = x + 1; x = 5;</code> compute different things.</li>
<li><strong>Decision is the only construct that can skip work</strong> — sequence always runs everything; repetition always runs the same thing. Only decision lets the data change which instructions execute. Without it, a program could not react to anything.</li>
<li><strong>Repetition is the only construct that can run more instructions than you wrote</strong> — this is why a four-line loop can do a million comparisons. It is also the only construct that can fail to terminate, which is why "does this loop stop?" is the first question to ask about any loop.</li>
<li><strong>The mapping to C, memorise it</strong> — sequence = statements ending in <code>;</code>; decision = <code>if</code>/<code>else</code>, <code>switch</code>, and the ternary <code>?:</code>; repetition = <code>while</code>, <code>do…while</code>, <code>for</code>.</li>
<li><strong>They compose, they do not merely coexist</strong> — an <code>if</code> inside a <code>for</code> inside a function is three constructs nested. Slide 9's FindLargest already showed all three in one four-line algorithm.</li>
</ul>
<p class="dap-an">✅ Worked exercise — classify each line of FindLargest: <code>largest = a[0];</code> → sequence. <code>for (i = 1; i &lt; n; i++)</code> → repetition. <code>if (a[i] &gt; largest)</code> → decision. <code>largest = a[i];</code> → sequence. <code>return largest;</code> → sequence. Answer: <strong>3 sequences, 1 decision, 1 repetition</strong> — every construct used, nothing else needed.</p>
<p class="pitfall">⚠️ The slide's own text says "(Figure 8.6)" while the figure printed directly under it is captioned "Figure 6.4". This is a leftover from Forouzan's Chapter 8, which the school renumbered to 6 for this course. Both refer to the same picture; do not waste time hunting for a Figure 8.6 that is not in the deck.</p>`,
        `<p class="y-chinh">🎯 Ba cấu trúc đặt cạnh nhau trong Hình 6.4: <strong>a. Sequence</strong> (làm action 1, làm action 2, … làm action n), <strong>b. Decision</strong> (nếu điều kiện đúng thì làm một loạt hành động; ngược lại làm loạt hành động khác), <strong>c. Repetition</strong> (chừng nào điều kiện còn đúng thì còn làm một loạt hành động).</p>
<ul>
<li><strong>Đọc hình như ba câu văn</strong> — mỗi ô vàng là một hành động, mỗi khung ngoài là một cấu trúc. Để ý khung decision và khung repetition đều chứa <em>một loạt hành động</em>, mà loạt ấy lại có thể là bất kỳ cấu trúc nào trong ba. Chính sự lồng nhau đó cho ba viên gạch một sức mạnh vô hạn.</li>
<li><strong>Tuần tự là mặc định</strong> — nó không cần từ khoá ở bất kỳ ngôn ngữ nào. Trong C, viết hai câu lệnh nối nhau <em>chính là</em> một dãy tuần tự. Nó được gọi là cấu trúc đúng vì thứ tự là một phần của ý nghĩa: <code>x = 5; y = x + 1;</code> và <code>y = x + 1; x = 5;</code> cho ra hai kết quả khác nhau.</li>
<li><strong>Rẽ nhánh là cấu trúc DUY NHẤT bỏ qua được việc</strong> — tuần tự luôn chạy hết; lặp luôn chạy đúng một thứ. Chỉ rẽ nhánh mới cho dữ liệu quyết định lệnh nào được thi hành. Không có nó thì chương trình không phản ứng được với bất cứ gì.</li>
<li><strong>Lặp là cấu trúc DUY NHẤT chạy nhiều lệnh hơn số lệnh bạn viết</strong> — vì thế một vòng lặp bốn dòng làm được một triệu phép so sánh. Nó cũng là cấu trúc duy nhất có thể không dừng, nên "vòng lặp này có dừng không?" là câu hỏi đầu tiên phải đặt cho mọi vòng lặp.</li>
<li><strong>Ánh xạ sang C, nhớ thuộc</strong> — tuần tự = các câu lệnh kết bằng <code>;</code>; rẽ nhánh = <code>if</code>/<code>else</code>, <code>switch</code>, và toán tử ba ngôi <code>?:</code>; lặp = <code>while</code>, <code>do…while</code>, <code>for</code>.</li>
<li><strong>Chúng LỒNG vào nhau chứ không chỉ đứng cạnh nhau</strong> — một <code>if</code> nằm trong một <code>for</code> nằm trong một hàm là ba cấu trúc lồng nhau. FindLargest ở slide 9 đã phô đủ cả ba trong một thuật toán bốn dòng.</li>
</ul>
<p class="dap-an">✅ Bài tập chạy tay — phân loại từng dòng của FindLargest: <code>largest = a[0];</code> → tuần tự. <code>for (i = 1; i &lt; n; i++)</code> → lặp. <code>if (a[i] &gt; largest)</code> → rẽ nhánh. <code>largest = a[i];</code> → tuần tự. <code>return largest;</code> → tuần tự. Đáp án: <strong>3 tuần tự, 1 rẽ nhánh, 1 lặp</strong> — dùng đủ mọi cấu trúc, không cần thêm gì.</p>
<p class="pitfall">⚠️ Chữ trên chính slide ghi "(Figure 8.6)" trong khi cái hình in ngay dưới lại mang chú thích "Figure 6.4". Đây là vết còn sót của Chương 8 sách Forouzan mà trường đánh lại số thành 6 cho môn này. Cả hai chỉ cùng một bức hình; đừng mất công đi tìm một "Figure 8.6" không có trong deck.</p>`],

      [12, 'Sequence',
        `<p class="y-chinh">🎯 The first construct. The text is two lines; the picture on the right is the one that matters: a UML activity diagram running <strong>filled start dot → A → B → C → ⋯ → N → end dot (circled)</strong>, straight down, no branches.</p>
<ul>
<li><strong>The definition worth quoting</strong> — "An algorithm, and eventually a program, is a sequence of instructions, which can be a simple instruction or either of the other two constructs." Read the second half slowly: a step in a sequence may itself be a whole decision or a whole loop. That single sentence is the recursion that lets three constructs build anything.</li>
<li><strong>Why the diagram has a start dot and an end dot</strong> — they are the single entry and single exit that make structured programming work. Standard UML: a solid black disc for the initial node, a black disc with a ring around it for the final node.</li>
<li><strong>Sequence is the construct people forget to name</strong> — asked "name the three constructs", many students say "if, loop, and… er". The missing one is always sequence, because it is invisible: it is what you get by doing nothing special.</li>
<li><strong>Order is semantics, not style</strong> — <code>scanf("%d", &amp;n); printf("%d", n);</code> works; swap the two lines and you print an uninitialised variable. Nothing in the syntax objects; the meaning is simply wrong.</li>
<li><strong>Where sequence is the <em>only</em> thing you need</strong> — slide 18's SumOfTwo is a complete, useful algorithm made of nothing but sequence: compute, then return. Not every problem needs a loop.</li>
</ul>
<p class="dap-an">✅ Trace exercise: given the sequence <code>x = 3;</code> <code>y = x * 2;</code> <code>x = y + 1;</code> <code>y = x - y;</code> — after line 1: x=3. After line 2: x=3, y=6. After line 3: x=7, y=6. After line 4: x=7, y=1. Answer: <strong>x = 7, y = 1</strong>. The trap is line 4, where <code>x</code> already holds the <em>new</em> value from line 3, not 3.</p>
<p class="meo">💡 Every trace-table question about a sequence is really a question about <em>when</em> each variable was last written. Write one column per variable and one row per line, and copy the unchanged values down — never leave a cell blank.</p>`,
        `<p class="y-chinh">🎯 Cấu trúc thứ nhất. Chữ chỉ có hai dòng; cái đáng xem là hình bên phải: một sơ đồ hoạt động UML chạy <strong>chấm tròn đen bắt đầu → A → B → C → ⋯ → N → chấm tròn có vòng ngoài (kết thúc)</strong>, thẳng một mạch xuống, không có nhánh nào.</p>
<ul>
<li><strong>Câu định nghĩa đáng trích</strong> — "Thuật toán, và rốt cuộc là chương trình, là một DÃY lệnh, mà mỗi lệnh có thể là một lệnh đơn hoặc chính là một trong hai cấu trúc kia." Hãy đọc chậm nửa sau: một bước trong dãy có thể tự nó là cả một khối rẽ nhánh hoặc cả một vòng lặp. Đúng một câu ấy là phép đệ quy cho phép ba cấu trúc dựng nên mọi thứ.</li>
<li><strong>Vì sao sơ đồ có chấm đầu và chấm cuối</strong> — đó là một lối vào duy nhất và một lối ra duy nhất, thứ làm cho lập trình có cấu trúc chạy được. Chuẩn UML: đĩa đen đặc là nút khởi đầu, đĩa đen có vòng bao quanh là nút kết thúc.</li>
<li><strong>Tuần tự là cấu trúc người ta hay quên gọi tên</strong> — hỏi "kể ba cấu trúc", nhiều sinh viên đáp "if, vòng lặp, và… ờ". Cái thiếu luôn là tuần tự, vì nó vô hình: nó là thứ bạn có được khi không làm gì đặc biệt cả.</li>
<li><strong>Thứ tự là NGỮ NGHĨA, không phải phong cách</strong> — <code>scanf("%d", &amp;n); printf("%d", n);</code> chạy đúng; đảo hai dòng thì bạn in ra một biến chưa khởi tạo. Cú pháp không phản đối gì hết; chỉ có ý nghĩa là sai.</li>
<li><strong>Chỗ mà tuần tự là thứ DUY NHẤT cần tới</strong> — SumOfTwo ở slide 18 là một thuật toán hoàn chỉnh và có ích, làm bằng độc mỗi tuần tự: tính, rồi trả về. Không phải bài toán nào cũng cần vòng lặp.</li>
</ul>
<p class="dap-an">✅ Bài chạy tay: cho dãy <code>x = 3;</code> <code>y = x * 2;</code> <code>x = y + 1;</code> <code>y = x - y;</code> — sau dòng 1: x=3. Sau dòng 2: x=3, y=6. Sau dòng 3: x=7, y=6. Sau dòng 4: x=7, y=1. Đáp án: <strong>x = 7, y = 1</strong>. Bẫy nằm ở dòng 4, nơi <code>x</code> đã mang giá trị MỚI từ dòng 3 chứ không còn là 3.</p>
<p class="meo">💡 Mọi câu hỏi bảng chạy tay về tuần tự thật ra là câu hỏi biến nào được ghi lần cuối vào <em>lúc nào</em>. Hãy kẻ mỗi biến một cột, mỗi dòng lệnh một hàng, và chép giá trị không đổi xuống hàng dưới — đừng bao giờ để ô trống.</p>`],

      [13, 'Decision',
        `<p class="y-chinh">🎯 The second construct. The text gives the definition; the picture gives the shape: <strong>Input → an oval labelled "Algorithm" → two arrows out, one to YES and one to NO</strong>. One test, two mutually exclusive outcomes.</p>
<ul>
<li><strong>The exact wording to learn</strong> — "Some problems cannot be solved with only a sequence of simple instructions. Sometimes we need to test a condition. If the result of testing is true, we follow a sequence of instructions; if it is false, we follow a different sequence of instructions. This is called the decision (selection) construct."</li>
<li><strong>"Decision" and "selection" are the same thing</strong> — the objectives slide says selection, this slide says decision, Forouzan uses both. In an exam either word earns the mark.</li>
<li><strong>The condition must be boolean</strong> — it evaluates to exactly true or false, never to "maybe". That is what makes the two branches exhaustive and exclusive: every run takes exactly one of them.</li>
<li><strong>The false branch may be empty</strong> — "if the current integer is greater than Largest, set Largest" has no else. That is still a decision; the else branch just does nothing. In UML you will see the [false] arrow bypass the action box and rejoin below it (Figure 6.8c).</li>
<li><strong>In C</strong> — <code>if (cond) { A } else { B }</code>. Note that C's condition is an integer, and <em>any</em> non-zero value is true; <code>if (x = 5)</code> assigns 5 and is always true. That single missing <code>=</code> is the most famous bug in the language, and modern compilers warn about it.</li>
<li><strong>Multi-way decisions</strong> — <code>switch</code> and chained <code>else if</code> look like more than two branches, but they are just nested decisions. Still one construct.</li>
</ul>
<p class="dap-an">✅ Worked example — classify a grade: <code>if (m &gt;= 8.5) "A"; else if (m &gt;= 7.0) "B"; else if (m &gt;= 5.0) "C"; else "F";</code>. Trace m = 7.0: test 1 → 7.0 &gt;= 8.5 false; test 2 → 7.0 &gt;= 7.0 TRUE → answer <strong>"B"</strong>, and tests 3 and 4 never run. Trace m = 4.9: all three tests false → <strong>"F"</strong>, 3 comparisons. The order of the tests is load-bearing: put <code>m &gt;= 5.0</code> first and every passing student gets a C.</p>
<p class="pitfall">⚠️ Exam trap: a decision construct has <em>one entry and one exit</em>. Students draw two separate endpoints, one per branch. Both branches must rejoin (in UML, at the grey diamond you will see on slide 16) before the algorithm continues. Otherwise the block no longer has a single exit and it is not structured.</p>`,
        `<p class="y-chinh">🎯 Cấu trúc thứ hai. Phần chữ đưa định nghĩa; phần hình đưa hình dạng: <strong>Input → một hình ô-van ghi "Algorithm" → hai mũi tên đi ra, một tới YES và một tới NO</strong>. Một phép kiểm, hai kết cục loại trừ nhau.</p>
<ul>
<li><strong>Nguyên văn cần thuộc</strong> — "Có những bài toán không giải được chỉ bằng một dãy lệnh đơn. Đôi khi ta cần kiểm tra một điều kiện. Nếu kết quả kiểm tra là đúng, ta đi theo một dãy lệnh; nếu sai, ta đi theo một dãy lệnh khác. Cái đó gọi là cấu trúc rẽ nhánh (chọn lựa)."</li>
<li><strong>"Decision" và "selection" là MỘT</strong> — slide Objectives dùng chữ selection, slide này dùng chữ decision, Forouzan dùng cả hai. Trong bài thi viết chữ nào cũng được điểm.</li>
<li><strong>Điều kiện phải là kiểu luận lý</strong> — nó cho ra đúng true hoặc false, không bao giờ cho ra "có thể". Chính điều đó làm hai nhánh vừa phủ hết vừa loại trừ nhau: mỗi lần chạy đi đúng một nhánh.</li>
<li><strong>Nhánh sai được phép rỗng</strong> — "nếu số hiện tại lớn hơn Largest thì gán Largest" chẳng có else nào. Nó vẫn là rẽ nhánh; nhánh else chỉ đơn giản là không làm gì. Trong UML bạn sẽ thấy mũi tên [false] đi vòng qua ô hành động rồi nhập lại ở dưới (Hình 6.8c).</li>
<li><strong>Trong C</strong> — <code>if (cond) { A } else { B }</code>. Lưu ý điều kiện của C là một số nguyên, và <em>mọi</em> giá trị khác 0 đều là đúng; <code>if (x = 5)</code> gán 5 và luôn luôn đúng. Đúng một dấu <code>=</code> bị thiếu ấy là con bọ nổi tiếng nhất của ngôn ngữ này, và trình biên dịch hiện đại đã cảnh báo về nó.</li>
<li><strong>Rẽ nhiều nhánh</strong> — <code>switch</code> và chuỗi <code>else if</code> trông như nhiều hơn hai nhánh, nhưng chúng chỉ là các rẽ nhánh lồng nhau. Vẫn là một cấu trúc.</li>
</ul>
<p class="dap-an">✅ Ví dụ chạy tay — xếp loại điểm: <code>if (m &gt;= 8.5) "A"; else if (m &gt;= 7.0) "B"; else if (m &gt;= 5.0) "C"; else "F";</code>. Chạy m = 7.0: kiểm 1 → 7.0 &gt;= 8.5 sai; kiểm 2 → 7.0 &gt;= 7.0 ĐÚNG → đáp án <strong>"B"</strong>, và kiểm 3, 4 không bao giờ chạy. Chạy m = 4.9: cả ba phép kiểm đều sai → <strong>"F"</strong>, tốn 3 phép so sánh. Thứ tự các phép kiểm là chịu lực: đặt <code>m &gt;= 5.0</code> lên đầu thì mọi sinh viên qua môn đều bị xếp loại C.</p>
<p class="pitfall">⚠️ Bẫy thi: cấu trúc rẽ nhánh có <em>một lối vào và một lối ra</em>. Sinh viên hay vẽ hai điểm kết thúc riêng, mỗi nhánh một cái. Hai nhánh BẮT BUỘC nhập lại (trong UML là cái hình thoi xám bạn sẽ thấy ở slide 16) rồi thuật toán mới đi tiếp. Không thì khối ấy mất tính một-lối-ra và không còn là có cấu trúc nữa.</p>`],

      [14, 'Repetition',
        `<p class="y-chinh">🎯 The third construct, and the picture is a genuine flowchart rather than UML: <strong>WRITE "Positive number?" → READ Number → a hexagonal test <code>Number &gt; 0</code></strong>, with the <em>False</em> arrow looping all the way back to the top and the <em>True</em> arrow leaving the bottom.</p>
<ul>
<li><strong>Read the loop the figure actually draws</strong> — it keeps asking until the user types a positive number. That is a <code>do…while</code>: the body runs <em>before</em> the first test, so the prompt always appears at least once. In C: <code>do { printf("Positive number?"); scanf("%d",&amp;n); } while (n &lt;= 0);</code></li>
<li><strong>Flowchart shapes, since this is the only slide that uses them</strong> — parallelogram = input/output, rectangle = process, hexagon or diamond = decision, arrow = flow of control. The slide mixes flowchart notation here with UML notation on slides 12, 13 and 16; both are legal ways to draw an algorithm.</li>
<li><strong>Every loop needs three things</strong> — an initialisation, a condition, and something inside the body that <em>changes</em> what the condition tests. Drop the third and you have an infinite loop. In the figure, <code>READ Number</code> is what makes progress possible.</li>
<li><strong>Pre-test vs post-test</strong> — <code>while</code> tests first and may run the body zero times; <code>do…while</code> runs the body once then tests. The figure is post-test. Exam questions love "how many times does the body execute?" and the answer differs by one between the two forms.</li>
<li><strong>Counted vs conditional</strong> — "repeat n times" (slide 9) is a counted loop, naturally a <code>for</code>; "repeat while there are more integers" (slide 20) is conditional, naturally a <code>while</code>. Both are the same construct.</li>
<li><strong>Why the slide mentions FindLargest here</strong> — "finding the largest integer among a set of integers can use a construct of this kind." It closes the loop with section 6.1: the generalisation on slide 9 was exactly this construct.</li>
</ul>
<p class="dap-an">✅ Trace the figure with the user typing <code>-4</code>, then <code>0</code>, then <code>7</code>: pass 1 → prompt, read −4, test −4 &gt; 0 FALSE → loop back. Pass 2 → prompt, read 0, test 0 &gt; 0 FALSE → loop back. Pass 3 → prompt, read 7, test 7 &gt; 0 TRUE → exit. Answer: the body ran <strong>3 times</strong>, the test ran <strong>3 times</strong>, and the prompt was printed <strong>3 times</strong>. Note 0 fails the test — <code>&gt; 0</code> is strict.</p>
<p class="pitfall">⚠️ The classic infinite loop in this exact pattern is putting <code>READ Number</code> <em>above</em> the loop instead of inside it. The condition then tests the same value forever. When a program hangs, the first thing to check is whether the loop body updates the variable the condition reads.</p>`,
        `<p class="y-chinh">🎯 Cấu trúc thứ ba, và hình ở đây là một lưu đồ (flowchart) thật chứ không phải UML: <strong>WRITE "Positive number?" → READ Number → một ô lục giác kiểm <code>Number &gt; 0</code></strong>, với mũi tên <em>False</em> vòng ngược hẳn lên đầu và mũi tên <em>True</em> đi ra ở dưới.</p>
<ul>
<li><strong>Đọc đúng vòng lặp mà hình vẽ ra</strong> — nó hỏi đi hỏi lại cho tới khi người dùng gõ một số dương. Đó là <code>do…while</code>: thân chạy <em>trước</em> lần kiểm đầu tiên, nên lời nhắc luôn hiện ít nhất một lần. Trong C: <code>do { printf("Positive number?"); scanf("%d",&amp;n); } while (n &lt;= 0);</code></li>
<li><strong>Các hình dạng của lưu đồ, vì đây là slide duy nhất dùng chúng</strong> — hình bình hành = vào/ra, hình chữ nhật = xử lý, lục giác hoặc thoi = rẽ nhánh, mũi tên = luồng điều khiển. Slide trộn ký hiệu lưu đồ ở đây với ký hiệu UML ở slide 12, 13 và 16; cả hai đều là cách vẽ thuật toán hợp lệ.</li>
<li><strong>Mọi vòng lặp cần ba thứ</strong> — một phần khởi tạo, một điều kiện, và một thứ bên trong thân <em>làm thay đổi</em> cái mà điều kiện kiểm. Bỏ thứ ba đi là có vòng lặp vô tận. Trong hình, chính <code>READ Number</code> là thứ tạo ra tiến triển.</li>
<li><strong>Kiểm trước và kiểm sau</strong> — <code>while</code> kiểm trước nên thân có thể chạy không lần nào; <code>do…while</code> chạy thân một lần rồi mới kiểm. Hình này là kiểm sau. Đề thi rất thích hỏi "thân vòng lặp chạy bao nhiêu lần?" và đáp án lệch nhau đúng một giữa hai dạng.</li>
<li><strong>Đếm lần và theo điều kiện</strong> — "lặp n lần" (slide 9) là vòng lặp đếm, tự nhiên là <code>for</code>; "lặp chừng nào còn số để cộng" (slide 20) là theo điều kiện, tự nhiên là <code>while</code>. Cả hai đều là một cấu trúc.</li>
<li><strong>Vì sao slide nhắc FindLargest ở đây</strong> — "tìm số nguyên lớn nhất trong một tập số có thể dùng một cấu trúc loại này." Nó khép vòng lại với mục 6.1: bản tổng quát hoá ở slide 9 chính là cấu trúc này.</li>
</ul>
<p class="dap-an">✅ Chạy tay hình này với người dùng gõ <code>-4</code>, rồi <code>0</code>, rồi <code>7</code>: lượt 1 → nhắc, đọc −4, kiểm −4 &gt; 0 SAI → quay lại. Lượt 2 → nhắc, đọc 0, kiểm 0 &gt; 0 SAI → quay lại. Lượt 3 → nhắc, đọc 7, kiểm 7 &gt; 0 ĐÚNG → thoát. Đáp án: thân chạy <strong>3 lần</strong>, phép kiểm chạy <strong>3 lần</strong>, lời nhắc in <strong>3 lần</strong>. Để ý số 0 KHÔNG qua được phép kiểm — <code>&gt; 0</code> là chặt.</p>
<p class="pitfall">⚠️ Vòng lặp vô tận kinh điển ở đúng mẫu này là đặt <code>READ Number</code> <em>bên trên</em> vòng lặp thay vì bên trong. Khi ấy điều kiện kiểm mãi một giá trị không đổi. Khi chương trình treo, thứ đầu tiên cần soi là thân vòng lặp có cập nhật cái biến mà điều kiện đọc hay không.</p>`],

      [15, '3 - Algorithm representation',
        `<p class="y-chinh">🎯 A section divider. The question it opens: once you have an algorithm in your head, <strong>how do you write it down</strong> so another person — or the version of you three months from now — can implement it correctly?</p>
<ul>
<li><strong>The three answers this deck gives</strong> — <em>flowchart</em> (slide 14's picture), <em>UML activity diagram</em> (slide 16), <em>pseudocode</em> (slides 17–18). All three describe the same three constructs; they differ only in notation.</li>
<li><strong>Why not just write C</strong> — because a representation should not commit you to a language, a compiler, or a type system while you are still thinking about the method. Pseudocode lets you write <code>sum ← sum + current</code> without deciding whether <code>sum</code> is <code>int</code> or <code>long long</code>. That decision belongs to the implementation step, not the design step.</li>
<li><strong>Pictures vs text, the honest trade-off</strong> — a diagram makes control flow obvious at a glance and is unbeatable for explaining a branchy algorithm to a person. Text is faster to write, diffs cleanly in version control, and scales: a 200-line algorithm as a flowchart is unreadable, as pseudocode it is fine.</li>
<li><strong>Which one industry actually uses</strong> — pseudocode and plain prose dominate; UML activity diagrams survive in requirements documents and in courses; hand-drawn flowcharts survive on whiteboards. Knowing all three is a reading skill more than a writing skill.</li>
<li><strong>What the exam asks</strong> — "Describe UML diagrams and how they can be used when representing algorithms" and the same sentence for pseudocode. Two of the nine objectives, one slide each.</li>
</ul>
<p class="meo">💡 The test of any representation is the same: hand it to someone who has never seen the problem and see whether they produce working code without asking you a question. If they have to ask, the representation was not definite enough — the same criterion as the definition of an algorithm on slide 5.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục. Câu hỏi nó mở ra: khi đã có thuật toán trong đầu rồi thì <strong>viết nó ra bằng cách nào</strong> để người khác — hoặc chính bạn ba tháng sau — cài đặt lại cho đúng?</p>
<ul>
<li><strong>Ba câu trả lời của deck này</strong> — <em>lưu đồ</em> (hình ở slide 14), <em>sơ đồ hoạt động UML</em> (slide 16), <em>mã giả</em> (slide 17–18). Cả ba đều mô tả đúng ba cấu trúc ấy; chúng chỉ khác nhau ở ký hiệu.</li>
<li><strong>Sao không viết thẳng C cho xong</strong> — vì một cách biểu diễn không nên trói bạn vào một ngôn ngữ, một trình biên dịch hay một hệ kiểu trong khi bạn còn đang nghĩ về phương pháp. Mã giả cho phép viết <code>sum ← sum + current</code> mà chưa cần quyết <code>sum</code> là <code>int</code> hay <code>long long</code>. Quyết định ấy thuộc bước cài đặt, không thuộc bước thiết kế.</li>
<li><strong>Hình và chữ, đánh đổi nói thẳng</strong> — sơ đồ làm luồng điều khiển hiện ra tức thì và vô địch khi phải giải thích một thuật toán nhiều nhánh cho người nghe. Chữ thì viết nhanh hơn, so khác bản sạch sẽ trong git, và mở rộng được: một thuật toán 200 dòng vẽ thành lưu đồ thì không đọc nổi, viết thành mã giả thì bình thường.</li>
<li><strong>Ngoài đời người ta dùng cái nào</strong> — mã giả và văn xuôi chiếm đa số; sơ đồ hoạt động UML còn sống trong tài liệu đặc tả và trong trường học; lưu đồ vẽ tay còn sống trên bảng trắng. Biết cả ba là kỹ năng ĐỌC nhiều hơn là kỹ năng viết.</li>
<li><strong>Đề thi hỏi gì</strong> — "Mô tả sơ đồ UML và cách dùng nó để biểu diễn thuật toán", và đúng câu ấy cho mã giả. Hai trong chín mục tiêu, mỗi cái một slide.</li>
</ul>
<p class="meo">💡 Phép thử cho mọi cách biểu diễn đều như nhau: đưa nó cho một người chưa từng thấy bài toán và xem họ có viết ra mã chạy được mà không phải hỏi bạn câu nào không. Nếu họ phải hỏi thì cách biểu diễn ấy chưa đủ xác định — đúng tiêu chí của định nghĩa thuật toán ở slide 5.</p>`],

      [16, '1. UML',
        `<p class="y-chinh">🎯 UML activity diagrams for the three constructs, in Figure 6.8. <strong>a. Sequence</strong>: Action 1 → Action 2 → ⋯ → Action n straight down. <strong>b. Decision</strong>: a red diamond with <code>[false]</code> going left and <code>[true]</code> going right, each side running its own chain of actions, both rejoining at a grey diamond below. <strong>c. Repetition</strong>: a red diamond whose <code>[true]</code> path runs TrueAction 1 … TrueAction n and then loops back up to the diamond.</p>
<ul>
<li><strong>What UML is</strong> — Unified Modeling Language, standardised in 1997 by the OMG out of three competing notations (Booch, Rumbaugh's OMT, Jacobson's OOSE). It has fourteen diagram types; this course uses exactly one, the <em>activity diagram</em>, which is UML's flowchart.</li>
<li><strong>The slide's own justification</strong> — "It hides all the details of an algorithm in an attempt to give the 'big picture' and to show how the algorithm flows from beginning to end." Hiding detail is the feature, not a limitation.</li>
<li><strong>The four shapes you must recognise</strong> — rounded rectangle = action; red/filled diamond = decision (branch); grey/hollow diamond = merge (where branches rejoin); arrow = flow. Guard conditions go in square brackets: <code>[true]</code>, <code>[false]</code>, <code>[x &gt; 0]</code>.</li>
<li><strong>Decision and merge are different nodes</strong> — this is the detail students miss. A branch has one input and many outputs; a merge has many inputs and one output. Drawing only the branch and letting the arrows dangle is wrong UML and, more importantly, breaks the one-exit rule from slide 10.</li>
<li><strong>Repetition is drawn as a decision with a back-edge</strong> — look at part c: there is no special "loop" symbol. A loop <em>is</em> a decision whose false path exits and whose true path comes back. This is exactly how a CPU implements a loop: compare, then conditional jump backwards.</li>
<li><strong>Nesting works because each fragment has one entry and one exit</strong> — you can drop diagram b in place of any single action box in diagram a and the result is still a valid diagram.</li>
</ul>
<p class="dap-an">✅ Reading exercise on part c: if the guard is <code>[more integers to process]</code> and the list is empty, how many times do TrueAction 1..n run? The diamond is tested <em>first</em>, so the answer is <strong>0 times</strong> — this is a pre-test (while) loop, unlike the post-test flowchart on slide 14 where the body always runs at least once. Same construct, one difference in where the diamond sits.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ hoạt động UML cho ba cấu trúc, trong Hình 6.8. <strong>a. Sequence</strong>: Action 1 → Action 2 → ⋯ → Action n thẳng xuống. <strong>b. Decision</strong>: một hình thoi đỏ với <code>[false]</code> rẽ trái và <code>[true]</code> rẽ phải, mỗi bên chạy chuỗi hành động riêng, rồi cả hai nhập lại ở một hình thoi xám bên dưới. <strong>c. Repetition</strong>: một hình thoi đỏ mà nhánh <code>[true]</code> chạy TrueAction 1 … TrueAction n rồi vòng ngược lên chính hình thoi đó.</p>
<ul>
<li><strong>UML là gì</strong> — Unified Modeling Language, được OMG chuẩn hoá năm 1997 từ ba ký pháp đang cạnh tranh nhau (Booch, OMT của Rumbaugh, OOSE của Jacobson). Nó có mười bốn loại sơ đồ; môn này dùng đúng một loại, <em>sơ đồ hoạt động</em>, tức là cái lưu đồ của UML.</li>
<li><strong>Lý do mà chính slide đưa ra</strong> — "Nó giấu mọi chi tiết của thuật toán nhằm đưa ra 'bức tranh lớn' và cho thấy thuật toán chảy từ đầu tới cuối ra sao." Giấu chi tiết là TÍNH NĂNG, không phải hạn chế.</li>
<li><strong>Bốn hình dạng bắt buộc nhận ra</strong> — chữ nhật bo góc = hành động; thoi đỏ/đặc = rẽ nhánh (branch); thoi xám/rỗng = nhập lại (merge); mũi tên = luồng. Điều kiện canh cửa viết trong ngoặc vuông: <code>[true]</code>, <code>[false]</code>, <code>[x &gt; 0]</code>.</li>
<li><strong>Rẽ nhánh và nhập lại là HAI nút khác nhau</strong> — đây là chi tiết sinh viên hay bỏ sót. Nút rẽ có một đầu vào và nhiều đầu ra; nút nhập có nhiều đầu vào và một đầu ra. Chỉ vẽ nút rẽ rồi để mũi tên lơ lửng là sai UML, và quan trọng hơn là phá luật một-lối-ra ở slide 10.</li>
<li><strong>Lặp được vẽ bằng một rẽ nhánh có cạnh quay ngược</strong> — nhìn phần c: không có ký hiệu "vòng lặp" riêng nào cả. Vòng lặp <em>chính là</em> một rẽ nhánh mà nhánh sai đi ra còn nhánh đúng quay về. Đây đúng là cách CPU cài đặt vòng lặp: so sánh rồi nhảy có điều kiện về phía sau.</li>
<li><strong>Lồng nhau chạy được vì mỗi mảnh có một vào một ra</strong> — bạn thả nguyên sơ đồ b vào chỗ của một ô hành động bất kỳ trong sơ đồ a, kết quả vẫn là một sơ đồ hợp lệ.</li>
</ul>
<p class="dap-an">✅ Bài đọc hình phần c: nếu điều kiện canh là <code>[còn số để xử lý]</code> mà danh sách rỗng thì TrueAction 1..n chạy mấy lần? Hình thoi được kiểm <em>trước</em>, nên đáp án là <strong>0 lần</strong> — đây là vòng lặp kiểm trước (while), khác với lưu đồ kiểm sau ở slide 14 nơi thân luôn chạy ít nhất một lần. Cùng một cấu trúc, khác đúng chỗ đặt hình thoi.</p>`],

      [17, '2. Pseudocode',
        `<p class="y-chinh">🎯 Pseudocode is "an English-language-like representation of an algorithm", and the slide is honest about the crucial fact: <strong>there is no standard</strong>. Figure 6.9 shows the three constructs in a C-like dialect: <code>action 1 / action 2 / … / action n</code>; <code>if (condition) { trueAction(s) } else { falseAction(s) }</code>; <code>while (condition) { Action(s) }</code>.</p>
<ul>
<li><strong>"No standard" is a permission and a warning</strong> — permission, because you will not lose marks for writing <code>←</code> instead of <code>=</code>, or <code>endif</code> instead of <code>}</code>. Warning, because the person reading your pseudocode has to guess your conventions, so you must be internally consistent within one answer.</li>
<li><strong>The three dialects you will meet</strong> — the C/Java-like one in this figure (braces); the Pascal-like one Forouzan uses in his boxed algorithms (<code>begin … end</code>); and the near-English one on slide 28 ("Take the input array from user"). This deck uses all three in different slides, which is itself the lesson.</li>
<li><strong>What pseudocode must have</strong> — a name, its inputs, its steps, and a stated result. Slide 18 shows the full ceremonial form: <code>Algorithm / Purpose / Pre / Post / Return / { … }</code>.</li>
<li><strong>What pseudocode must not have</strong> — <code>#include</code>, semicolons you do not need, variable declarations with types, memory management, error handling for things the problem did not mention. If your pseudocode is as long as the C would be, you have written C with worse syntax.</li>
<li><strong>The arrow <code>←</code></strong> — used throughout this deck for assignment (<code>sum ← sum + current</code>). It exists to stop the <code>=</code>-means-equality / <code>=</code>-means-assignment confusion that trips people moving between mathematics and C. Read it aloud as "becomes".</li>
<li><strong>Pseudocode is what an exam answer looks like</strong> — when a question says "write an algorithm to …", it almost never wants compilable C. It wants pseudocode: correct, ordered, unambiguous, and short enough to read.</li>
</ul>
<p class="dap-an">✅ Translate Figure 6.9b to C and back. Pseudocode: <code>if (mark &gt;= 5) { print "PASS" } else { print "FAIL" }</code>. C: <code>if (mark &gt;= 5) printf("PASS"); else printf("FAIL");</code>. The only differences are <code>print</code> → <code>printf</code>, quotes staying the same, and semicolons appearing. Answer: <strong>the structure is identical</strong> — which is exactly why pseudocode is worth writing first.</p>
<p class="meo">💡 Write pseudocode with indentation, always. Indentation is what carries the nesting when there is no standard to tell the reader where a block ends. An unindented ten-line pseudocode with two nested loops is genuinely ambiguous.</p>`,
        `<p class="y-chinh">🎯 Mã giả là "cách biểu diễn thuật toán tựa như tiếng Anh", và slide nói thẳng cái sự thật quan trọng nhất: <strong>không có chuẩn nào cả</strong>. Hình 6.9 vẽ ba cấu trúc theo phương ngữ giống C: <code>action 1 / action 2 / … / action n</code>; <code>if (condition) { trueAction(s) } else { falseAction(s) }</code>; <code>while (condition) { Action(s) }</code>.</p>
<ul>
<li><strong>"Không có chuẩn" vừa là giấy phép vừa là lời cảnh báo</strong> — giấy phép, vì bạn không bị trừ điểm khi viết <code>←</code> thay cho <code>=</code>, hay <code>endif</code> thay cho <code>}</code>. Cảnh báo, vì người chấm phải đoán quy ước của bạn, nên trong một bài làm bạn buộc phải nhất quán với chính mình.</li>
<li><strong>Ba phương ngữ bạn sẽ gặp</strong> — kiểu C/Java trong hình này (dấu ngoặc nhọn); kiểu Pascal mà Forouzan dùng trong các khung thuật toán (<code>begin … end</code>); và kiểu gần như tiếng Anh thường ở slide 28 ("Take the input array from user"). Deck này dùng cả ba ở các slide khác nhau, và chính điều đó là bài học.</li>
<li><strong>Mã giả BẮT BUỘC có gì</strong> — một cái tên, các đầu vào, các bước, và kết quả được phát biểu rõ. Slide 18 cho xem dạng đầy đủ nghi thức: <code>Algorithm / Purpose / Pre / Post / Return / { … }</code>.</li>
<li><strong>Mã giả KHÔNG được có gì</strong> — <code>#include</code>, dấu chấm phẩy không cần thiết, khai báo biến kèm kiểu, quản lý bộ nhớ, xử lý lỗi cho những thứ đề bài không nhắc. Nếu mã giả của bạn dài bằng mã C thì bạn đã viết C bằng một cú pháp tệ hơn.</li>
<li><strong>Mũi tên <code>←</code></strong> — được dùng suốt deck này cho phép gán (<code>sum ← sum + current</code>). Nó tồn tại để chặn sự lẫn lộn giữa <code>=</code> nghĩa là bằng và <code>=</code> nghĩa là gán, thứ hay vấp phải khi người ta đi lại giữa toán học và C. Hãy đọc to nó là "trở thành".</li>
<li><strong>Mã giả chính là hình dạng của một bài thi</strong> — khi đề nói "viết thuật toán để…", nó gần như không bao giờ muốn C biên dịch được. Nó muốn mã giả: đúng, có thứ tự, không nhập nhằng, và ngắn đủ để đọc.</li>
</ul>
<p class="dap-an">✅ Dịch Hình 6.9b sang C rồi dịch ngược. Mã giả: <code>if (mark &gt;= 5) { print "PASS" } else { print "FAIL" }</code>. C: <code>if (mark &gt;= 5) printf("PASS"); else printf("FAIL");</code>. Khác biệt duy nhất là <code>print</code> → <code>printf</code>, dấu nháy giữ nguyên, và xuất hiện dấu chấm phẩy. Đáp án: <strong>cấu trúc giống hệt nhau</strong> — và đó đúng là lý do nên viết mã giả trước.</p>
<p class="meo">💡 Viết mã giả thì LUÔN thụt lề. Thụt lề là thứ gánh vác việc thể hiện lồng nhau, khi không có chuẩn nào nói cho người đọc biết một khối kết thúc ở đâu. Mười dòng mã giả không thụt lề với hai vòng lặp lồng nhau là nhập nhằng thật sự.</p>`],

      [18, '3. Example (SumOfTwo pseudocode)',
        `<p class="y-chinh">🎯 The first complete pseudocode in the deck, in full ceremonial form. Figure 6.10 reads: <code>Algorithm: SumOfTwo (first, second)</code> · <code>Purpose: Find the sum of two integers</code> · <code>Pre: Given: two integers (first and second)</code> · <code>Post: None</code> · <code>Return: The sum value</code> · then the body <code>{ sum ← first + second ; return sum }</code>.</p>
<ul>
<li><strong>Six parts, and each one answers a question a reader would ask</strong> — <em>Algorithm</em>: what is it called and what does it take? <em>Purpose</em>: what problem does it solve? <em>Pre</em>: what must be true before it runs? <em>Post</em>: what does it leave changed in the outside world? <em>Return</em>: what comes back? <em>Body</em>: how.</li>
<li><strong>Pre and Post are the interesting pair</strong> — they are <em>preconditions</em> and <em>postconditions</em>, the vocabulary of design-by-contract. "Pre: two integers are given" is a promise the <em>caller</em> must keep; "Post: None" is a promise the <em>algorithm</em> makes — it changes nothing outside itself, no global variable, no file, no screen output.</li>
<li><strong>Why "Post: None" is not the same as "Return: the sum"</strong> — students conflate them constantly. Return is the value handed back; Post is the <em>side effect</em>. A function that sorts an array in place has a strong Post (the array is now ordered) and might return nothing at all.</li>
<li><strong>Sequence only, as the slide says</strong> — two statements, no condition, no loop. It is the smallest algorithm that is still worth naming, and that is precisely why it is the example.</li>
<li><strong>In C, line by line</strong> — <code>int SumOfTwo(int first, int second) { int sum = first + second; return sum; }</code>. The pseudocode header becomes the function signature, Pre becomes the parameter types, Return becomes the return type.</li>
<li><strong>The named intermediate variable</strong> — <code>sum</code> is not strictly needed (<code>return first + second</code> would do). It is there because naming an intermediate result is how pseudocode stays readable, and because Return says "the sum value" — the name and the documentation agree.</li>
</ul>
<p class="dap-an">✅ Trace with first = 12, second = 8: line 1 → <code>sum ← 12 + 8 = 20</code>. Line 2 → <code>return 20</code>. Answer: <strong>20</strong>, reached in 2 steps with 0 comparisons and 0 iterations. Now check the contract: Pre held (two integers were given), Post held (nothing outside changed), Return delivered (a sum value came back). A complete, verifiable algorithm in two lines.</p>
<p class="pitfall">⚠️ Exam trap on Pre: an algorithm whose Pre is violated is <em>allowed</em> to do anything, including crash. If the exam asks "what happens if SumOfTwo is given a string?", the correct answer is not "it returns 0" — it is "the precondition is violated, so the algorithm makes no promise". This is exactly why C's <code>binarySearch</code> on an unsorted array (slide 29) gives nonsense rather than an error.</p>`,
        `<p class="y-chinh">🎯 Mã giả hoàn chỉnh đầu tiên của deck, ở dạng đầy đủ nghi thức. Hình 6.10 đọc là: <code>Algorithm: SumOfTwo (first, second)</code> · <code>Purpose: Find the sum of two integers</code> · <code>Pre: Given: two integers (first and second)</code> · <code>Post: None</code> · <code>Return: The sum value</code> · rồi tới thân <code>{ sum ← first + second ; return sum }</code>.</p>
<ul>
<li><strong>Sáu phần, mỗi phần trả lời một câu người đọc sẽ hỏi</strong> — <em>Algorithm</em>: nó tên gì và nhận gì? <em>Purpose</em>: nó giải bài toán nào? <em>Pre</em>: trước khi chạy thì phải đúng những gì? <em>Post</em>: nó để lại thay đổi gì ở thế giới bên ngoài? <em>Return</em>: cái gì trả về? <em>Thân</em>: làm thế nào.</li>
<li><strong>Pre và Post là cặp đáng chú ý</strong> — đó là <em>tiền điều kiện</em> và <em>hậu điều kiện</em>, từ vựng của lối thiết kế theo hợp đồng. "Pre: được cho hai số nguyên" là lời hứa mà <em>người gọi</em> phải giữ; "Post: None" là lời hứa mà <em>thuật toán</em> đưa ra — nó không đổi gì bên ngoài nó, không biến toàn cục, không file, không in ra màn hình.</li>
<li><strong>Vì sao "Post: None" khác với "Return: tổng"</strong> — sinh viên gộp hai cái này suốt. Return là giá trị trao trả; Post là <em>tác dụng phụ</em>. Một hàm sắp xếp mảng tại chỗ có Post rất mạnh (mảng giờ đã có thứ tự) mà có khi chẳng trả về gì cả.</li>
<li><strong>Chỉ tuần tự, đúng như slide nói</strong> — hai câu lệnh, không điều kiện, không vòng lặp. Đó là thuật toán nhỏ nhất mà vẫn đáng đặt tên, và đó chính xác là lý do nó được chọn làm ví dụ.</li>
<li><strong>Sang C, từng dòng</strong> — <code>int SumOfTwo(int first, int second) { int sum = first + second; return sum; }</code>. Phần đầu mã giả thành chữ ký hàm, Pre thành kiểu tham số, Return thành kiểu trả về.</li>
<li><strong>Cái biến trung gian có tên</strong> — <code>sum</code> nói cho chặt thì không cần (<code>return first + second</code> là xong). Nó có mặt vì đặt tên cho kết quả trung gian là cách mã giả giữ được sự dễ đọc, và vì Return ghi "the sum value" — cái tên và tài liệu khớp nhau.</li>
</ul>
<p class="dap-an">✅ Chạy tay với first = 12, second = 8: dòng 1 → <code>sum ← 12 + 8 = 20</code>. Dòng 2 → <code>return 20</code>. Đáp án: <strong>20</strong>, đạt sau 2 bước, 0 phép so sánh, 0 lượt lặp. Giờ kiểm lại hợp đồng: Pre giữ được (đã cho hai số nguyên), Post giữ được (không có gì bên ngoài thay đổi), Return giao đúng (một giá trị tổng trả về). Một thuật toán hoàn chỉnh và kiểm chứng được trong hai dòng.</p>
<p class="pitfall">⚠️ Bẫy thi ở phần Pre: thuật toán bị vi phạm Pre thì <em>được phép</em> làm bất cứ gì, kể cả sập. Nếu đề hỏi "SumOfTwo nhận vào một chuỗi thì sao?", đáp án đúng không phải "nó trả về 0" — mà là "tiền điều kiện bị vi phạm nên thuật toán không hứa gì hết". Đây đúng là lý do hàm <code>binarySearch</code> trong C chạy trên mảng chưa sắp (slide 29) trả về thứ vô nghĩa chứ không báo lỗi.</p>`],

      [19, '4. BASIC ALGORITHMS',
        `<p class="y-chinh">🎯 A section divider — and the section that the Content slide on slide 2 forgot to list. Slides 20–24 cover four building blocks that reappear inside almost every larger program: <strong>summation, smallest/largest, sorting, and (from slide 25) searching</strong>.</p>
<ul>
<li><strong>Why "basic" and not "simple"</strong> — these are <em>basic</em> in the sense of a basis: larger algorithms are built out of them. Finding a median needs sorting; computing an average needs summation; a database query needs searching. They are the vocabulary, not the easy warm-up.</li>
<li><strong>The shared shape</strong> — every one of them is the accumulator pattern from slide 6: initialise something, loop over the data updating it, return it. Summation accumulates a running total; FindLargest accumulates a running maximum; selection sort accumulates a growing sorted prefix; linear search accumulates "not found yet".</li>
<li><strong>What is coming</strong> — slide 20 summation, slide 21 smallest and largest, slide 22 the sorting overview and its five named algorithms, slide 23 selection sort, slide 24 bubble sort.</li>
<li><strong>Complexity, introduced informally here</strong> — count how many times the innermost operation runs, as a function of n. Summation and search: n operations, written <strong>O(n)</strong>. Selection sort and bubble sort: about n²/2 comparisons, written <strong>O(n²)</strong>. Binary search: about log₂ n, written <strong>O(log n)</strong>. That is the whole notation at this level: how does the work grow when the data grows?</li>
<li><strong>Why complexity matters before you can define it formally</strong> — the difference between O(n) and O(log n) on a million records is the difference between 1 000 000 steps and 20 steps. Slide 29's measurements make that concrete.</li>
</ul>
<p class="dap-an">✅ Quick sizing exercise: at 100 million simple operations per second, how long does each take on n = 1 000 000? O(log n) ≈ 20 ops → about <strong>0,2 microseconds</strong>. O(n) = 1 000 000 ops → about <strong>10 milliseconds</strong>. O(n²) = 10¹² ops → about <strong>10 000 seconds ≈ 2,8 hours</strong>. Same machine, same data, three orders of magnitude apart — that is why the chapter spends six slides on searching.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục — và là cái mục mà slide Content ở slide 2 quên liệt kê. Slide 20–24 nói về bốn viên gạch xuất hiện lại trong hầu hết mọi chương trình lớn: <strong>tính tổng, nhỏ nhất/lớn nhất, sắp xếp, và (từ slide 25) tìm kiếm</strong>.</p>
<ul>
<li><strong>Vì sao gọi là "cơ bản" chứ không phải "đơn giản"</strong> — chúng <em>cơ bản</em> theo nghĩa là cơ sở: các thuật toán lớn hơn được dựng từ chúng. Tìm trung vị cần sắp xếp; tính trung bình cần tính tổng; một truy vấn cơ sở dữ liệu cần tìm kiếm. Chúng là từ vựng, không phải bài khởi động dễ.</li>
<li><strong>Hình dạng chung</strong> — cả bốn đều là mẫu bộ tích luỹ ở slide 6: khởi tạo một thứ, lặp qua dữ liệu để cập nhật nó, rồi trả nó về. Tính tổng tích luỹ một tổng đang chạy; FindLargest tích luỹ một cực đại đang chạy; selection sort tích luỹ một đoạn đầu đã sắp mỗi lúc một dài; tìm kiếm tuyến tính tích luỹ trạng thái "chưa thấy".</li>
<li><strong>Sắp tới có gì</strong> — slide 20 tính tổng, slide 21 nhỏ nhất và lớn nhất, slide 22 tổng quan sắp xếp với năm thuật toán được nêu tên, slide 23 selection sort, slide 24 bubble sort.</li>
<li><strong>Độ phức tạp, giới thiệu không hình thức ngay ở đây</strong> — hãy đếm xem phép toán trong cùng chạy bao nhiêu lần, xét theo n. Tính tổng và tìm tuyến tính: n phép, viết là <strong>O(n)</strong>. Selection sort và bubble sort: khoảng n²/2 phép so sánh, viết là <strong>O(n²)</strong>. Tìm nhị phân: khoảng log₂ n, viết là <strong>O(log n)</strong>. Ở mức nhập môn thì ký hiệu chỉ có vậy: dữ liệu lớn lên thì công việc lớn lên theo kiểu gì?</li>
<li><strong>Vì sao phải quan tâm độ phức tạp trước khi định nghĩa được nó cho chặt</strong> — khác biệt giữa O(n) và O(log n) trên một triệu bản ghi là khác biệt giữa 1 000 000 bước và 20 bước. Các phép đo ở slide 29 làm cho điều đó thành cụ thể.</li>
</ul>
<p class="dap-an">✅ Bài ước lượng nhanh: với tốc độ 100 triệu phép đơn giản mỗi giây, mỗi loại tốn bao lâu khi n = 1 000 000? O(log n) ≈ 20 phép → khoảng <strong>0,2 micro giây</strong>. O(n) = 1 000 000 phép → khoảng <strong>10 mili giây</strong>. O(n²) = 10¹² phép → khoảng <strong>10 000 giây ≈ 2,8 giờ</strong>. Cùng cỗ máy, cùng dữ liệu, cách nhau ba bậc độ lớn — đó là lý do chương này dành sáu slide cho tìm kiếm.</p>`],

      [20, '4.1 Summation',
        `<p class="y-chinh">🎯 The accumulator pattern, stated explicitly. The slide names <strong>three logical parts</strong> every summation has: (1) initialisation of the sum, (2) the loop that adds one integer per iteration, (3) return of the result after the loop exits. Figure 6.11 draws it: start → <code>sum ← 0</code> → a red diamond guarded by <em>"more integers to add"</em> → <code>current ← next integer</code> → <code>sum ← sum + current</code> → back to the diamond; the [false] path goes to the end node, <em>Returned: sum</em>.</p>
<ul>
<li><strong>Why <code>sum ← 0</code> and not <code>sum ← a[0]</code></strong> — 0 is the <em>identity element</em> for addition: adding it changes nothing, so an empty list correctly gives 0. For multiplication the identity is 1, for maximum it is −∞ (slide 8). Every accumulator starts at its operation's identity; that is the rule behind the three examples.</li>
<li><strong>Part 2 is two actions, not one</strong> — <code>current ← next integer</code> then <code>sum ← sum + current</code>. Reading and accumulating are separate steps. Merge them and you cannot reuse <code>current</code> for anything else, which is why the smallest/largest diagram on slide 21 needs them separate.</li>
<li><strong>Part 3 matters more than it looks</strong> — the return happens <em>after</em> the loop, not inside it. Returning inside the loop would end the algorithm after the first integer. Notice where the arrow to the end node comes from: the diamond's [false] branch.</li>
<li><strong>Termination</strong> — the guard is "more integers to add", so the loop runs exactly n times for n integers and always stops. n comparisons of the guard, n additions: O(n).</li>
<li><strong>In C</strong> — <code>int sum = 0; for (int i = 0; i &lt; n; i++) sum += a[i]; return sum;</code>. Three lines, three parts, in the same order as the slide's list.</li>
<li><strong>The real-world trap the slide does not mention</strong> — overflow. Summing 100 000 values of about 100 000 each exceeds a 32-bit <code>int</code> (max 2 147 483 647) and silently wraps to a negative number. The algorithm is right; the data type is wrong. Use a wider accumulator than the elements.</li>
</ul>
<p>Traced on the chapter's list 12, 8, 13, 9, 11 with a real program:</p>
<table><tr><th>Iteration</th><th>current</th><th>sum before</th><th>sum ← sum + current</th></tr>
<tr><td>0 (init)</td><td>—</td><td>—</td><td>0</td></tr>
<tr><td>1</td><td>12</td><td>0</td><td>12</td></tr>
<tr><td>2</td><td>8</td><td>12</td><td>20</td></tr>
<tr><td>3</td><td>13</td><td>20</td><td>33</td></tr>
<tr><td>4</td><td>9</td><td>33</td><td>42</td></tr>
<tr><td>5</td><td>11</td><td>42</td><td>53</td></tr></table>
<p class="dap-an">✅ Answer: <strong>sum = 53</strong> after 5 iterations, 5 additions and 6 guard tests (five true, one false — the test that ends the loop is the extra one, and exam questions about "how many times is the condition evaluated" hinge on exactly that +1).</p>
<p class="pitfall">⚠️ The caption under the figure reads "Figure 6.11 UML for Calculating the sum of two integers" — but the diagram shown sums a whole <em>list</em>, not two integers. The caption was copied from slide 18's SumOfTwo and never updated. Trust the diagram, not the caption.</p>`,
        `<p class="y-chinh">🎯 Mẫu bộ tích luỹ, được phát biểu thành lời. Slide nêu đích danh <strong>ba phần lô-gic</strong> mà mọi bài tính tổng đều có: (1) khởi tạo tổng, (2) vòng lặp mà mỗi lượt cộng thêm một số, (3) trả kết quả sau khi thoát vòng lặp. Hình 6.11 vẽ ra: bắt đầu → <code>sum ← 0</code> → hình thoi đỏ canh bởi <em>"còn số để cộng"</em> → <code>current ← số kế tiếp</code> → <code>sum ← sum + current</code> → quay về hình thoi; nhánh [false] đi tới nút kết thúc, <em>Returned: sum</em>.</p>
<ul>
<li><strong>Vì sao <code>sum ← 0</code> chứ không phải <code>sum ← a[0]</code></strong> — 0 là <em>phần tử đơn vị</em> của phép cộng: cộng nó vào không đổi gì, nên danh sách rỗng cho ra 0 một cách đúng đắn. Với phép nhân thì đơn vị là 1, với phép lấy max thì là −∞ (slide 8). Mọi bộ tích luỹ đều khởi tạo bằng đơn vị của phép toán mình dùng; đó là quy luật đứng sau cả ba ví dụ.</li>
<li><strong>Phần 2 gồm HAI hành động chứ không phải một</strong> — <code>current ← số kế tiếp</code> rồi <code>sum ← sum + current</code>. Đọc và tích luỹ là hai bước riêng. Gộp chúng lại thì không dùng lại <code>current</code> cho việc khác được, và đó đúng là lý do sơ đồ nhỏ nhất/lớn nhất ở slide 21 cần tách chúng ra.</li>
<li><strong>Phần 3 quan trọng hơn vẻ ngoài của nó</strong> — lệnh trả về xảy ra <em>sau</em> vòng lặp, không phải bên trong. Trả về bên trong vòng lặp thì thuật toán kết thúc ngay sau số đầu tiên. Hãy để ý mũi tên đi tới nút kết thúc xuất phát từ đâu: từ nhánh [false] của hình thoi.</li>
<li><strong>Tính dừng</strong> — điều kiện canh là "còn số để cộng", nên vòng lặp chạy đúng n lượt với n số và luôn dừng. n lần kiểm điều kiện, n phép cộng: O(n).</li>
<li><strong>Trong C</strong> — <code>int sum = 0; for (int i = 0; i &lt; n; i++) sum += a[i]; return sum;</code>. Ba dòng, ba phần, đúng thứ tự như danh sách trên slide.</li>
<li><strong>Cái bẫy đời thật mà slide không nhắc</strong> — tràn số. Cộng 100 000 giá trị mỗi giá trị cỡ 100 000 là vượt quá <code>int</code> 32 bit (tối đa 2 147 483 647) và âm thầm quấn thành số âm. Thuật toán thì đúng; kiểu dữ liệu mới sai. Hãy dùng bộ tích luỹ rộng hơn phần tử.</li>
</ul>
<p>Chạy tay trên danh sách 12, 8, 13, 9, 11 của chương, bằng chương trình thật:</p>
<table><tr><th>Lượt</th><th>current</th><th>sum trước</th><th>sum ← sum + current</th></tr>
<tr><td>0 (khởi tạo)</td><td>—</td><td>—</td><td>0</td></tr>
<tr><td>1</td><td>12</td><td>0</td><td>12</td></tr>
<tr><td>2</td><td>8</td><td>12</td><td>20</td></tr>
<tr><td>3</td><td>13</td><td>20</td><td>33</td></tr>
<tr><td>4</td><td>9</td><td>33</td><td>42</td></tr>
<tr><td>5</td><td>11</td><td>42</td><td>53</td></tr></table>
<p class="dap-an">✅ Đáp án: <strong>sum = 53</strong> sau 5 lượt, 5 phép cộng và 6 lần kiểm điều kiện (năm lần đúng, một lần sai — lần kiểm kết thúc vòng lặp chính là cái +1 dôi ra, và mọi câu hỏi "điều kiện được đánh giá bao nhiêu lần" đều xoay quanh đúng cái +1 ấy).</p>
<p class="pitfall">⚠️ Chú thích dưới hình ghi "Figure 6.11 UML for Calculating the sum of two integers" — nhưng sơ đồ trong hình cộng nguyên một <em>danh sách</em>, không phải hai số. Chú thích bị chép lại từ SumOfTwo ở slide 18 mà quên sửa. Hãy tin cái sơ đồ, đừng tin cái chú thích.</p>`],

      [21, '2. Smallest and largest',
        `<p class="y-chinh">🎯 The same accumulator, run the other way. Figure 6.12 draws FindSmallest: start → <code>smallest ← +∞</code> → outer diamond <em>[more integers to process]</em> → <code>current ← next integer</code> → inner diamond <em>[current &lt; smallest]</em> → <code>smallest ← current</code> → merge → back to the outer diamond; exit gives <em>Returned: smallest</em>.</p>
<ul>
<li><strong>Two minor differences from FindLargest, both named by the slide</strong> — (1) the decision compares with <code>&lt;</code> instead of <code>&gt;</code>; (2) the initialisation is a very <em>large</em> integer instead of a very small one. Nothing else changes. That is the whole slide, and it is an exam favourite because it is so easy to get backwards.</li>
<li><strong>Why +∞ for smallest</strong> — same identity-element rule as slide 20: the starting value must lose every comparison, so that the first real element replaces it. For minimum that means starting at the largest possible value.</li>
<li><strong>In C</strong> — <code>#include &lt;limits.h&gt;</code> then <code>int smallest = INT_MAX;</code> (2147483647). Or, more robustly, <code>int smallest = a[0];</code> with the loop starting at <code>i = 1</code>.</li>
<li><strong>Two nested constructs, clearly visible</strong> — the outer diamond is repetition, the inner diamond is decision, and the inner one has an empty false branch that merges straight back. Compare with Figure 6.8c: same shape.</li>
<li><strong>Cost</strong> — n loop-guard tests and n value comparisons, so O(n) and optimal: you cannot find a minimum without looking at every element.</li>
<li><strong>Finding both at once</strong> — the naive way costs 2n comparisons (two passes). A single pass comparing elements in pairs first costs about 3n/2. That trick is not in the syllabus but it is the standard follow-up question if a lecturer wants to separate the top of the class.</li>
</ul>
<p>Traced on 12, 8, 13, 9, 11, using the slide's own +∞ initialisation:</p>
<table><tr><th>Iteration</th><th>current</th><th>smallest before</th><th>current &lt; smallest?</th><th>smallest after</th></tr>
<tr><td>0</td><td>—</td><td>—</td><td>init</td><td>+∞</td></tr>
<tr><td>1</td><td>12</td><td>+∞</td><td>TRUE</td><td>12</td></tr>
<tr><td>2</td><td>8</td><td>12</td><td>TRUE</td><td>8</td></tr>
<tr><td>3</td><td>13</td><td>8</td><td>false</td><td>8</td></tr>
<tr><td>4</td><td>9</td><td>8</td><td>false</td><td>8</td></tr>
<tr><td>5</td><td>11</td><td>8</td><td>false</td><td>8</td></tr></table>
<p class="dap-an">✅ Answer: <strong>smallest = 8</strong> after 5 comparisons, with the assignment firing twice (iterations 1 and 2). Compare with the FindLargest table on slide 8: same list, same 5 comparisons, also 2 assignments — but the assignments happen at different iterations (1 and 3 there, 1 and 2 here). If an exam asks "how many times does the body of the <code>if</code> execute?", you must trace; there is no shortcut.</p>
<p class="pitfall">⚠️ The figure contains a typo: the action box reads <code>smallest ← curent</code> (one <em>r</em> short of "current"). The neighbouring note box spells it correctly as <code>current &lt; smallest</code>. Harmless in a diagram, fatal in code — this is the class of typo that C catches as "undeclared identifier" and Python does not catch at all.</p>`,
        `<p class="y-chinh">🎯 Vẫn bộ tích luỹ ấy, chạy theo chiều ngược. Hình 6.12 vẽ FindSmallest: bắt đầu → <code>smallest ← +∞</code> → hình thoi ngoài <em>[còn số để xử lý]</em> → <code>current ← số kế tiếp</code> → hình thoi trong <em>[current &lt; smallest]</em> → <code>smallest ← current</code> → nhập lại → quay về hình thoi ngoài; thoát ra cho <em>Returned: smallest</em>.</p>
<ul>
<li><strong>Hai khác biệt nhỏ so với FindLargest, slide nêu đích danh cả hai</strong> — (1) phép rẽ nhánh so bằng <code>&lt;</code> thay vì <code>&gt;</code>; (2) khởi tạo bằng một số rất <em>lớn</em> thay vì rất nhỏ. Không có gì khác nữa. Cả slide chỉ có thế, và đề thi rất thích chỗ này vì nó cực dễ làm ngược.</li>
<li><strong>Vì sao +∞ cho nhỏ nhất</strong> — vẫn quy luật phần tử đơn vị ở slide 20: giá trị khởi đầu phải THUA mọi phép so sánh, để phần tử thật đầu tiên thay được nó. Với cực tiểu thì nghĩa là bắt đầu ở giá trị lớn nhất có thể.</li>
<li><strong>Trong C</strong> — <code>#include &lt;limits.h&gt;</code> rồi <code>int smallest = INT_MAX;</code> (2147483647). Hoặc chắc chắn hơn: <code>int smallest = a[0];</code> với vòng lặp bắt đầu từ <code>i = 1</code>.</li>
<li><strong>Hai cấu trúc lồng nhau, nhìn thấy rõ</strong> — hình thoi ngoài là lặp, hình thoi trong là rẽ nhánh, và cái trong có nhánh sai rỗng chạy thẳng về chỗ nhập lại. Hãy so với Hình 6.8c: cùng một hình dạng.</li>
<li><strong>Giá</strong> — n lần kiểm điều kiện vòng lặp và n phép so sánh giá trị, tức O(n) và tối ưu: không thể tìm cực tiểu mà không nhìn hết mọi phần tử.</li>
<li><strong>Tìm CẢ HAI cùng lúc</strong> — cách ngây thơ tốn 2n phép so sánh (hai lượt quét). Một lượt duy nhất, so các phần tử theo từng cặp trước, chỉ tốn khoảng 3n/2. Mẹo đó không có trong đề cương nhưng là câu hỏi nối tiếp chuẩn mực khi giảng viên muốn phân loại nhóm đầu lớp.</li>
</ul>
<p>Chạy tay trên 12, 8, 13, 9, 11 với đúng cách khởi tạo +∞ của slide:</p>
<table><tr><th>Lượt</th><th>current</th><th>smallest trước</th><th>current &lt; smallest?</th><th>smallest sau</th></tr>
<tr><td>0</td><td>—</td><td>—</td><td>khởi tạo</td><td>+∞</td></tr>
<tr><td>1</td><td>12</td><td>+∞</td><td>ĐÚNG</td><td>12</td></tr>
<tr><td>2</td><td>8</td><td>12</td><td>ĐÚNG</td><td>8</td></tr>
<tr><td>3</td><td>13</td><td>8</td><td>sai</td><td>8</td></tr>
<tr><td>4</td><td>9</td><td>8</td><td>sai</td><td>8</td></tr>
<tr><td>5</td><td>11</td><td>8</td><td>sai</td><td>8</td></tr></table>
<p class="dap-an">✅ Đáp án: <strong>smallest = 8</strong> sau 5 phép so sánh, với lệnh gán nổ ra hai lần (lượt 1 và 2). So với bảng FindLargest ở slide 8: cùng danh sách, cùng 5 phép so sánh, cũng 2 lần gán — nhưng các lần gán rơi vào những lượt KHÁC nhau (ở kia là lượt 1 và 3, ở đây là lượt 1 và 2). Đề mà hỏi "thân lệnh <code>if</code> chạy mấy lần?" thì bắt buộc phải chạy tay, không có lối tắt nào.</p>
<p class="pitfall">⚠️ Trong hình có lỗi gõ: ô hành động ghi <code>smallest ← curent</code> (thiếu một chữ <em>r</em> so với "current"). Ô ghi chú bên cạnh lại viết đúng là <code>current &lt; smallest</code>. Vô hại trong sơ đồ, chí mạng trong mã — đây đúng loại lỗi gõ mà C bắt được thành "undeclared identifier" còn Python thì không bắt được gì cả.</p>`],

      [22, '3. Sorting',
        `<p class="y-chinh">🎯 Sorting: "the process by which data is arranged according to its values", with the telephone-book argument for why it matters, and a list of <strong>five common algorithms</strong>: Bubble/Shell sort, Insertion sort, Selection sort, Quick sort, Merge sort.</p>
<ul>
<li><strong>The telephone-book argument, sharpened</strong> — an unordered phone book of a million names needs on average 500 000 comparisons to find one number (slide 26's linear search). Ordered, it needs 20 (binary search). Sorting is not an end in itself; it is the price you pay once so that every later search is cheap.</li>
<li><strong>The five, grouped by how they behave</strong> — the first three (bubble, insertion, selection) are the <em>primitive</em> or <em>quadratic</em> sorts: simple, in-place, about n²/2 comparisons. Quick sort and merge sort are the <em>efficient</em> ones: about n log₂ n. The syllabus only asks you to <em>name</em> the last two.</li>
<li><strong>What n log n buys, in numbers</strong> — for n = 1 000 000: n²/2 = 5·10¹¹ comparisons versus n log₂ n ≈ 2·10⁷. At 100 million comparisons per second that is about <strong>83 minutes versus 0,2 seconds</strong>. That gap is why nobody bubble-sorts real data.</li>
<li><strong>"Bubble/Shell sort" on one line is the slide's own compression</strong> — they are different algorithms. Bubble sort is O(n²); Shell sort (Donald Shell, 1959) is a gap-based improvement on insertion sort with much better real performance. Grouping them is a simplification, not a fact.</li>
<li><strong>What real programs use</strong> — C's <code>qsort()</code>, C++'s <code>std::sort</code> (introsort: quicksort that switches to heapsort when recursion gets deep), Java's <code>Arrays.sort</code> and Python's <code>sorted()</code> (Timsort, a merge sort tuned for partly-ordered data). You will almost never write a sort; you will constantly choose a comparison function.</li>
<li><strong>The one property the slide never mentions: stability</strong> — a stable sort keeps equal elements in their original relative order. Merge sort and insertion sort are stable; quicksort and selection sort are not. It matters the moment you sort a table by one column having already sorted by another.</li>
</ul>
<p class="dap-an">✅ Sizing exercise on the school's own data: sorting 40 000 student records with selection sort is 40 000²/2 = <strong>800 million comparisons</strong>; with merge sort it is 40 000 × log₂(40 000) ≈ 40 000 × 15,3 ≈ <strong>612 000 comparisons</strong>. Ratio: about <strong>1 300×</strong>. Same answer, same machine.</p>
<p class="meo">💡 Remember the five in two groups, never as one list: <strong>slow and simple</strong> (bubble, insertion, selection — n²) versus <strong>fast and clever</strong> (quick, merge — n log n). Any exam question that asks you to compare will be asking about that line.</p>`,
        `<p class="y-chinh">🎯 Sắp xếp: "quá trình dữ liệu được xếp đặt theo giá trị của nó", kèm lập luận danh bạ điện thoại cho thấy vì sao nó quan trọng, và một danh sách <strong>năm thuật toán thông dụng</strong>: Bubble/Shell sort, Insertion sort, Selection sort, Quick sort, Merge sort.</p>
<ul>
<li><strong>Lập luận danh bạ, nói cho sắc</strong> — một cuốn danh bạ một triệu tên không sắp xếp cần trung bình 500 000 phép so sánh để tra một số (tìm tuyến tính ở slide 26). Đã sắp xếp thì cần 20 (tìm nhị phân). Sắp xếp không phải mục đích tự thân; nó là cái giá trả MỘT LẦN để mọi lần tra sau đó đều rẻ.</li>
<li><strong>Năm cái, nhóm theo cách chúng chạy</strong> — ba cái đầu (bubble, insertion, selection) là nhóm <em>sơ cấp</em> hay <em>bậc hai</em>: đơn giản, sắp tại chỗ, khoảng n²/2 phép so sánh. Quick sort và merge sort thuộc nhóm <em>hiệu quả</em>: khoảng n log₂ n. Đề cương chỉ yêu cầu bạn <em>gọi tên</em> hai cái sau.</li>
<li><strong>n log n mua được gì, bằng con số</strong> — với n = 1 000 000: n²/2 = 5·10¹¹ phép so sánh so với n log₂ n ≈ 2·10⁷. Với 100 triệu phép so sánh mỗi giây thì đó là <strong>khoảng 83 phút so với 0,2 giây</strong>. Khoảng cách ấy là lý do không ai đem bubble sort ra dùng với dữ liệu thật.</li>
<li><strong>Việc gộp "Bubble/Shell sort" vào một dòng là sự nén của chính slide</strong> — chúng là hai thuật toán khác nhau. Bubble sort là O(n²); Shell sort (Donald Shell, 1959) là cải tiến của insertion sort theo khoảng cách, chạy thật nhanh hơn hẳn. Gộp chúng là một sự đơn giản hoá, không phải sự thật.</li>
<li><strong>Chương trình thật dùng gì</strong> — <code>qsort()</code> của C, <code>std::sort</code> của C++ (introsort: quicksort tự chuyển sang heapsort khi đệ quy quá sâu), <code>Arrays.sort</code> của Java và <code>sorted()</code> của Python (Timsort, một merge sort tinh chỉnh cho dữ liệu đã sắp một phần). Bạn gần như sẽ không bao giờ tự viết một hàm sắp xếp; bạn sẽ liên tục phải chọn một hàm so sánh.</li>
<li><strong>Tính chất duy nhất mà slide không hề nhắc: tính ổn định</strong> — một phép sắp ổn định giữ nguyên thứ tự tương đối của các phần tử bằng nhau. Merge sort và insertion sort ổn định; quicksort và selection sort thì không. Nó quan trọng ngay khi bạn sắp một bảng theo cột này sau khi đã sắp theo cột khác.</li>
</ul>
<p class="dap-an">✅ Bài ước lượng trên chính dữ liệu của trường: sắp 40 000 hồ sơ sinh viên bằng selection sort tốn 40 000²/2 = <strong>800 triệu phép so sánh</strong>; bằng merge sort tốn 40 000 × log₂(40 000) ≈ 40 000 × 15,3 ≈ <strong>612 000 phép so sánh</strong>. Tỷ lệ: khoảng <strong>1 300 lần</strong>. Cùng đáp số, cùng cỗ máy.</p>
<p class="meo">💡 Nhớ năm cái theo hai nhóm, đừng bao giờ nhớ thành một danh sách: <strong>chậm mà đơn giản</strong> (bubble, insertion, selection — n²) đối lại <strong>nhanh mà khôn</strong> (quick, merge — n log n). Mọi câu hỏi thi bắt so sánh đều đang hỏi về cái ranh giới đó.</p>`],

      [23, 'Selection Sort',
        `<p class="y-chinh">🎯 Selection sort in one sentence: the list is split by an <strong>imaginary wall</strong> into a sorted left part and an unsorted right part; each pass finds the smallest element in the unsorted part, swaps it to the front of that part, and moves the wall one step right. Figure 7.1 shows six passes on <code>23 78 45 8 32 56</code>; Figure 6.13 shows the UML with the note "This involves another loop" pointing at "Find smallest element in unsorted list".</p>
<ul>
<li><strong>The note "This involves another loop" is the whole complexity story</strong> — finding the smallest of the unsorted part is itself a loop (FindSmallest from slide 21). A loop inside a loop is where n² comes from. Every quadratic sort has that shape.</li>
<li><strong>Exactly n−1 passes</strong> — after the wall has moved n−1 times, the last element has nothing left to swap with and is already in place. Running an n-th pass is harmless but pointless.</li>
<li><strong>The comparison count is fixed by the data size, not the data</strong> — pass 1 compares 5 elements, pass 2 compares 4, and so on: 5+4+3+2+1 = 15 for n = 6. In general n(n−1)/2. A selection sort on an already-sorted list does exactly the same 15 comparisons — it cannot detect that it is done. That is its one clear disadvantage against bubble sort.</li>
<li><strong>Its one clear advantage</strong> — at most n−1 swaps, the fewest of any simple sort. When moving an element is expensive (large records, slow storage) selection sort is the right primitive choice.</li>
<li><strong>Not stable</strong> — swapping a distant small element to the front jumps it over equal values, changing their relative order.</li>
</ul>
<p>Measured with a real C program on the slide's own list <code>23 78 45 8 32 56</code> — the output matches Figure 7.1 pass for pass:</p>
<table><tr><th>Pass</th><th>Unsorted region</th><th>Smallest found</th><th>Swapped with</th><th>List after pass</th></tr>
<tr><td>1</td><td>a[0..5]</td><td>8</td><td>23</td><td>8 78 45 23 32 56</td></tr>
<tr><td>2</td><td>a[1..5]</td><td>23</td><td>78</td><td>8 23 45 78 32 56</td></tr>
<tr><td>3</td><td>a[2..5]</td><td>32</td><td>45</td><td>8 23 32 78 45 56</td></tr>
<tr><td>4</td><td>a[3..5]</td><td>45</td><td>78</td><td>8 23 32 45 78 56</td></tr>
<tr><td>5</td><td>a[4..5]</td><td>56</td><td>78</td><td>8 23 32 45 56 78</td></tr></table>
<p class="dap-an">✅ Answer: sorted list <strong>8 23 32 45 56 78</strong> after <strong>5 passes, 15 comparisons and 5 swaps</strong>. Note pass 3 produces <code>8 23 32 78 45 56</code> — the 78 moved <em>right past</em> 45, which is why selection sort is not stable and why the middle of the list can look more disordered than it started.</p>
<p class="pitfall">⚠️ The caption on the left-hand example reads "Figure 7.1" while everything else in the deck is numbered 6.x — a leftover from Forouzan's Chapter 7. Same picture, different numbering; do not go looking for a chapter 7 in this course's slides.</p>`,
        `<p class="y-chinh">🎯 Selection sort trong một câu: danh sách bị một <strong>bức tường tưởng tượng</strong> chia thành phần trái đã sắp và phần phải chưa sắp; mỗi lượt tìm phần tử nhỏ nhất trong phần chưa sắp, đổi nó lên đầu phần đó, rồi dịch tường sang phải một bước. Hình 7.1 cho xem sáu ảnh trên <code>23 78 45 8 32 56</code>; Hình 6.13 cho xem sơ đồ UML với ghi chú "This involves another loop" chỉ vào ô "Find smallest element in unsorted list".</p>
<ul>
<li><strong>Ghi chú "cái này bao hàm một vòng lặp nữa" chính là toàn bộ câu chuyện độ phức tạp</strong> — tìm số nhỏ nhất của phần chưa sắp tự nó đã là một vòng lặp (FindSmallest ở slide 21). Vòng lặp trong vòng lặp là chỗ n² sinh ra. Mọi phép sắp bậc hai đều mang hình dạng ấy.</li>
<li><strong>Đúng n−1 lượt</strong> — sau khi tường đã dịch n−1 lần thì phần tử cuối không còn ai để đổi chỗ và đã nằm đúng chỗ rồi. Chạy thêm lượt thứ n thì vô hại nhưng vô nghĩa.</li>
<li><strong>Số phép so sánh do KÍCH THƯỚC dữ liệu quyết, không do dữ liệu</strong> — lượt 1 so 5 phần tử, lượt 2 so 4, và cứ thế: 5+4+3+2+1 = 15 với n = 6. Tổng quát là n(n−1)/2. Selection sort chạy trên một danh sách đã sắp sẵn vẫn làm đúng 15 phép so sánh ấy — nó không phát hiện được là mình đã xong. Đó là nhược điểm rõ ràng duy nhất của nó so với bubble sort.</li>
<li><strong>Ưu điểm rõ ràng duy nhất của nó</strong> — nhiều nhất n−1 lần đổi chỗ, ít nhất trong các phép sắp sơ cấp. Khi việc DI CHUYỂN một phần tử là đắt (bản ghi to, lưu trữ chậm) thì selection sort là lựa chọn sơ cấp đúng.</li>
<li><strong>Không ổn định</strong> — đổi một phần tử nhỏ ở xa lên đầu khiến nó nhảy qua những giá trị bằng nhau, làm đổi thứ tự tương đối của chúng.</li>
</ul>
<p>Đo bằng chương trình C thật trên đúng danh sách của slide <code>23 78 45 8 32 56</code> — kết quả khớp Hình 7.1 từng lượt một:</p>
<table><tr><th>Lượt</th><th>Vùng chưa sắp</th><th>Nhỏ nhất tìm được</th><th>Đổi chỗ với</th><th>Danh sách sau lượt</th></tr>
<tr><td>1</td><td>a[0..5]</td><td>8</td><td>23</td><td>8 78 45 23 32 56</td></tr>
<tr><td>2</td><td>a[1..5]</td><td>23</td><td>78</td><td>8 23 45 78 32 56</td></tr>
<tr><td>3</td><td>a[2..5]</td><td>32</td><td>45</td><td>8 23 32 78 45 56</td></tr>
<tr><td>4</td><td>a[3..5]</td><td>45</td><td>78</td><td>8 23 32 45 78 56</td></tr>
<tr><td>5</td><td>a[4..5]</td><td>56</td><td>78</td><td>8 23 32 45 56 78</td></tr></table>
<p class="dap-an">✅ Đáp án: danh sách đã sắp <strong>8 23 32 45 56 78</strong> sau <strong>5 lượt, 15 phép so sánh và 5 lần đổi chỗ</strong>. Để ý lượt 3 cho ra <code>8 23 32 78 45 56</code> — số 78 nhảy <em>vượt qua</em> số 45, và đó là lý do selection sort không ổn định, cũng là lý do khúc giữa danh sách có lúc trông lộn xộn hơn lúc đầu.</p>
<p class="pitfall">⚠️ Chú thích của ví dụ bên trái ghi "Figure 7.1" trong khi mọi thứ khác trong deck đánh số 6.x — vết còn sót của Chương 7 sách Forouzan. Cùng bức hình, khác cách đánh số; đừng đi tìm một chương 7 trong bộ slide của môn này.</p>`],

      [24, 'Bubble sorts',
        `<p class="y-chinh">🎯 Bubble sort, drawn in Figure 6.14 as the same wall picture but with red arcs labelled <strong>"Bubble up"</strong> arching from the right end back toward the wall: the smallest element in the unsorted region is bubbled leftwards, one adjacent swap at a time, until it lands next to the wall. One such journey = <strong>one sort pass</strong>.</p>
<ul>
<li><strong>The difference from selection sort, in one line</strong> — selection sort <em>finds</em> the minimum then makes <strong>one</strong> long-distance swap; bubble sort <em>walks</em> the minimum home with <strong>many</strong> adjacent swaps. Same result, same n(n−1)/2 comparisons, very different swap counts.</li>
<li><strong>Why only adjacent elements are ever compared</strong> — that is the definition of the algorithm, and it is what makes bubble sort <em>stable</em>: two equal elements are never swapped past each other because the test is strict (<code>&lt;</code>, not <code>&lt;=</code>).</li>
<li><strong>The direction confusion, settled</strong> — most textbooks bubble the <em>largest</em> element to the right end. Forouzan, and therefore this slide, bubbles the <em>smallest</em> to the left end. Both are bubble sort. In an exam, follow the direction the question's figure shows, and say which one you used.</li>
<li><strong>Bubble sort's one advantage over selection sort</strong> — it can stop early. Add a flag: if a whole pass makes no swap, the list is already sorted and you exit. On an already-sorted list that turns n(n−1)/2 comparisons into n−1, i.e. O(n) best case. Selection sort has no such shortcut.</li>
<li><strong>Its disadvantage</strong> — swap count. On reversed data bubble sort performs n(n−1)/2 swaps, against selection sort's n−1. If swapping is expensive, bubble sort is the worst of the three primitive sorts.</li>
<li><strong>Why it is still taught</strong> — not because anyone uses it, but because it is the shortest correct sort you can write (two nested loops and one <code>if</code>), so it is the standard vehicle for teaching nested loops and loop invariants.</li>
</ul>
<p>Measured with a real C program on <code>23 78 45 8 32 56</code>, bubbling the smallest leftwards exactly as the figure shows:</p>
<table><tr><th>Pass</th><th>List before</th><th>Comparisons in pass</th><th>Swaps in pass</th><th>List after</th></tr>
<tr><td>1</td><td>23 78 45 8 32 56</td><td>5</td><td>3</td><td>8 23 78 45 32 56</td></tr>
<tr><td>2</td><td>8 23 78 45 32 56</td><td>4</td><td>2</td><td>8 23 32 78 45 56</td></tr>
<tr><td>3</td><td>8 23 32 78 45 56</td><td>3</td><td>1</td><td>8 23 32 45 78 56</td></tr>
<tr><td>4</td><td>8 23 32 45 78 56</td><td>2</td><td>1</td><td>8 23 32 45 56 78</td></tr>
<tr><td>5</td><td>8 23 32 45 56 78</td><td>1</td><td>0</td><td>8 23 32 45 56 78</td></tr></table>
<p class="dap-an">✅ Answer: same sorted list <strong>8 23 32 45 56 78</strong>, same <strong>15 comparisons</strong> as selection sort — but <strong>7 swaps instead of 5</strong>. Pass 5 makes zero swaps, which is exactly the signal an early-exit flag would use to stop one pass sooner.</p>
<p class="pitfall">⚠️ The caption under the figure reads "Figure 6.14 Example of selection sort" — on a slide titled "Bubble sorts", about bubble sort. The caption was copied from slide 23 and never corrected. The picture itself is bubble sort (the "Bubble up" arcs make that unambiguous); only the caption is wrong.</p>`,
        `<p class="y-chinh">🎯 Bubble sort, vẽ trong Hình 6.14 cũng bằng bức tranh bức tường ấy nhưng thêm những vòng cung đỏ ghi <strong>"Bubble up"</strong> uốn từ đầu phải ngược về phía tường: phần tử nhỏ nhất trong vùng chưa sắp được "sủi" dần sang trái, mỗi lần đổi chỗ với đúng một hàng xóm, cho tới khi nó nằm sát tường. Một chuyến đi như thế = <strong>một lượt sắp</strong>.</p>
<ul>
<li><strong>Khác selection sort ở đúng một dòng</strong> — selection sort <em>tìm</em> ra cực tiểu rồi làm <strong>MỘT</strong> cú đổi chỗ đường dài; bubble sort <em>dắt</em> cực tiểu về nhà bằng <strong>NHIỀU</strong> cú đổi chỗ kề nhau. Cùng kết quả, cùng n(n−1)/2 phép so sánh, nhưng số lần đổi chỗ khác hẳn.</li>
<li><strong>Vì sao chỉ so các phần tử kề nhau</strong> — đó là định nghĩa của thuật toán, và chính nó làm bubble sort <em>ổn định</em>: hai phần tử bằng nhau không bao giờ bị đổi vượt qua nhau vì phép kiểm là chặt (<code>&lt;</code>, không phải <code>&lt;=</code>).</li>
<li><strong>Chuyện lẫn lộn chiều, nói cho dứt</strong> — đa số giáo trình sủi phần tử <em>lớn nhất</em> sang đầu phải. Forouzan, và do đó slide này, sủi phần tử <em>nhỏ nhất</em> sang đầu trái. Cả hai đều là bubble sort. Trong bài thi, hãy theo chiều mà hình của đề vẽ, và ghi rõ bạn dùng chiều nào.</li>
<li><strong>Ưu điểm duy nhất của bubble sort so với selection sort</strong> — nó dừng sớm được. Thêm một biến cờ: nếu cả một lượt không đổi chỗ lần nào thì danh sách đã sắp xong và thoát. Trên danh sách đã sắp sẵn, điều đó biến n(n−1)/2 phép so sánh thành n−1, tức trường hợp tốt nhất là O(n). Selection sort không có lối tắt nào như vậy.</li>
<li><strong>Nhược điểm của nó</strong> — số lần đổi chỗ. Trên dữ liệu đảo ngược, bubble sort đổi chỗ n(n−1)/2 lần, trong khi selection sort chỉ n−1. Nếu việc đổi chỗ đắt thì bubble sort là cái tệ nhất trong ba phép sắp sơ cấp.</li>
<li><strong>Vì sao nó vẫn được dạy</strong> — không phải vì ai dùng, mà vì nó là phép sắp đúng NGẮN NHẤT bạn viết được (hai vòng lặp lồng nhau và một <code>if</code>), nên nó là phương tiện chuẩn để dạy vòng lặp lồng nhau và bất biến vòng lặp.</li>
</ul>
<p>Đo bằng chương trình C thật trên <code>23 78 45 8 32 56</code>, sủi số nhỏ nhất sang trái đúng như hình vẽ:</p>
<table><tr><th>Lượt</th><th>Danh sách trước</th><th>So sánh trong lượt</th><th>Đổi chỗ trong lượt</th><th>Danh sách sau</th></tr>
<tr><td>1</td><td>23 78 45 8 32 56</td><td>5</td><td>3</td><td>8 23 78 45 32 56</td></tr>
<tr><td>2</td><td>8 23 78 45 32 56</td><td>4</td><td>2</td><td>8 23 32 78 45 56</td></tr>
<tr><td>3</td><td>8 23 32 78 45 56</td><td>3</td><td>1</td><td>8 23 32 45 78 56</td></tr>
<tr><td>4</td><td>8 23 32 45 78 56</td><td>2</td><td>1</td><td>8 23 32 45 56 78</td></tr>
<tr><td>5</td><td>8 23 32 45 56 78</td><td>1</td><td>0</td><td>8 23 32 45 56 78</td></tr></table>
<p class="dap-an">✅ Đáp án: cũng ra danh sách <strong>8 23 32 45 56 78</strong>, cũng <strong>15 phép so sánh</strong> như selection sort — nhưng <strong>7 lần đổi chỗ thay vì 5</strong>. Lượt 5 không đổi chỗ lần nào, và đó chính là tín hiệu mà biến cờ thoát sớm sẽ dùng để dừng sớm hơn một lượt.</p>
<p class="pitfall">⚠️ Chú thích dưới hình ghi "Figure 6.14 Example of selection sort" — trên một slide tựa là "Bubble sorts", nói về bubble sort. Chú thích bị chép từ slide 23 mà không sửa. Bản thân bức hình đúng là bubble sort (các vòng cung "Bubble up" không thể hiểu nhầm được); chỉ có cái chú thích là sai.</p>`],

      [25, '5 - Search Algorithms: linear, binary',
        `<p class="y-chinh">🎯 The last section divider, and the one that carries the most exam weight: <strong>searching</strong>. Six slides, two algorithms, and one comparison that every CSI106 paper asks about in some form.</p>
<ul>
<li><strong>Why searching is the natural end of the chapter</strong> — it uses everything before it. Linear search is the accumulator pattern with an early exit; binary search is the first algorithm in the course that is <em>cleverer</em> than brute force, and the only one whose cost grows slower than the data.</li>
<li><strong>The single distinction to hold on to</strong> — linear search works on <em>any</em> list; binary search works only on a <em>sorted</em> list. That precondition is the entire trade-off, and slide 29 is where the exam probes it.</li>
<li><strong>What the numbers will show</strong> — measured with a real C program on a sorted array of 1 000 000 elements, finding an element takes on average <strong>499 501 comparisons</strong> with linear search and <strong>19 comparisons</strong> with binary search. That is the whole section in one line.</li>
<li><strong>The complexity vocabulary you need</strong> — linear search is <strong>O(n)</strong>, binary search is <strong>O(log n)</strong>. "log" here always means log base 2, because each step halves the range. log₂(1 000 000) ≈ 19,93, so at most 20 steps.</li>
<li><strong>What is coming</strong> — slide 26 defines searching and states the precondition; 27 and 28 give linear search with a picture and pseudocode; 29 and 30 do the same for binary search.</li>
</ul>
<p class="meo">💡 Every exam question in this section is one of four shapes: (a) trace the search, give <code>low</code>/<code>high</code>/<code>mid</code> after pass k; (b) how many comparisons in the worst case; (c) why does binary search need a sorted list; (d) which search would you choose and why. Prepare one confident answer for each and you have the section.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục cuối cùng, và cũng là phần nặng điểm thi nhất: <strong>tìm kiếm</strong>. Sáu slide, hai thuật toán, và một phép so sánh mà đề CSI106 nào cũng hỏi dưới dạng nào đó.</p>
<ul>
<li><strong>Vì sao tìm kiếm là cái kết tự nhiên của chương</strong> — nó dùng lại mọi thứ phía trước. Tìm tuyến tính là mẫu bộ tích luỹ có thêm lối thoát sớm; tìm nhị phân là thuật toán đầu tiên trong cả môn <em>khôn hơn</em> kiểu vét cạn, và là cái duy nhất có chi phí tăng chậm hơn dữ liệu.</li>
<li><strong>Một phân biệt duy nhất phải nắm</strong> — tìm tuyến tính chạy trên <em>mọi</em> danh sách; tìm nhị phân chỉ chạy trên danh sách <em>đã sắp xếp</em>. Tiền điều kiện ấy chính là toàn bộ sự đánh đổi, và slide 29 là chỗ đề thi chọc vào nó.</li>
<li><strong>Con số sắp tới sẽ cho thấy gì</strong> — đo bằng chương trình C thật trên mảng đã sắp 1 000 000 phần tử, tìm một phần tử tốn trung bình <strong>499 501 phép so sánh</strong> với tìm tuyến tính và <strong>19 phép so sánh</strong> với tìm nhị phân. Cả mục này gói trong một dòng ấy.</li>
<li><strong>Từ vựng độ phức tạp cần có</strong> — tìm tuyến tính là <strong>O(n)</strong>, tìm nhị phân là <strong>O(log n)</strong>. Chữ "log" ở đây luôn là log cơ số 2, vì mỗi bước chia đôi khoảng tìm kiếm. log₂(1 000 000) ≈ 19,93, nên nhiều nhất 20 bước.</li>
<li><strong>Sắp tới có gì</strong> — slide 26 định nghĩa tìm kiếm và nêu tiền điều kiện; 27 và 28 đưa tìm tuyến tính kèm hình và mã giả; 29 và 30 làm y vậy cho tìm nhị phân.</li>
</ul>
<p class="meo">💡 Mọi câu hỏi thi ở mục này đều thuộc một trong bốn dạng: (a) chạy tay phép tìm, cho biết <code>low</code>/<code>high</code>/<code>mid</code> sau lượt thứ k; (b) trường hợp xấu nhất tốn mấy phép so sánh; (c) vì sao tìm nhị phân cần danh sách đã sắp; (d) bạn chọn phép tìm nào và vì sao. Chuẩn bị sẵn một câu trả lời chắc chắn cho mỗi dạng là xong cả mục.</p>`],

      [26, '5.1 Searching',
        `<p class="y-chinh">🎯 The definition: searching is "the process of finding the location of a target among a list of objects" — and note the precise wording, <strong>the location of the FIRST element that contains that value</strong>. Two basic searches exist: sequential (linear), usable on any list; and binary, which <strong>requires the list first to be sorted</strong>.</p>
<ul>
<li><strong>"Location", not "value"</strong> — a search returns <em>where</em>, not <em>what</em>. You already know what you are looking for. This matters in code: the return type is an index, and "not found" needs a value that is not a valid index — conventionally <code>-1</code> in C and Java, <code>None</code> in Python.</li>
<li><strong>"The first element"</strong> — the slide is careful, and so should you be. If the list is <code>5 9 5 2</code> and you search for 5, the answer is index 0, not index 2. Linear search gives the first by construction; binary search on duplicates may land on any of them, so returning "the first" needs an extra step.</li>
<li><strong>The precondition, stated once and tested forever</strong> — "binary search requires the list first to be sorted". This is the single most examined sentence in the chapter. It is a <em>precondition</em> in the sense of slide 18: violate it and the algorithm promises nothing, and — the dangerous part — it does not complain.</li>
<li><strong>The cost of meeting the precondition</strong> — sorting a million items costs about 2·10⁷ comparisons (merge sort). One binary search costs 20. So sorting pays for itself only if you will search many times: the break-even against linear search is roughly 40 searches. Search once and linear search wins outright.</li>
<li><strong>A third option the slide does not mention</strong> — hashing, O(1) average. That is Chapter 10/11 material (file structures and databases). Mentioning it in an exam answer about "choose a search strategy" is a genuine bonus, not a distraction.</li>
</ul>
<p class="dap-an">✅ Decision exercise. You have 1 000 000 unsorted records. (a) One lookup, never again → <strong>linear search</strong>, 500 000 comparisons on average; sorting first would cost 40× more. (b) Ten thousand lookups → <strong>sort once, then binary search</strong>: 2·10⁷ + 10 000 × 20 = 2,02·10⁷, against linear's 10 000 × 500 000 = 5·10⁹ — about <strong>250× cheaper</strong>. The right answer depends on how many times you will search, and an exam answer that says so scores higher than one that names a favourite.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa: tìm kiếm là "quá trình tìm ra vị trí của một mục tiêu giữa một danh sách các đối tượng" — và hãy để ý cách diễn đạt rất chuẩn, <strong>vị trí của phần tử ĐẦU TIÊN chứa giá trị đó</strong>. Có hai phép tìm cơ bản: tuần tự (tuyến tính), dùng được cho mọi danh sách; và nhị phân, <strong>đòi hỏi danh sách phải được sắp xếp trước</strong>.</p>
<ul>
<li><strong>"Vị trí", không phải "giá trị"</strong> — phép tìm trả về <em>ở đâu</em>, chứ không trả về <em>cái gì</em>. Bạn đã biết mình tìm cái gì rồi. Điều này quan trọng trong mã: kiểu trả về là một chỉ số, và "không tìm thấy" cần một giá trị không phải chỉ số hợp lệ — theo quy ước là <code>-1</code> trong C và Java, <code>None</code> trong Python.</li>
<li><strong>"Phần tử đầu tiên"</strong> — slide diễn đạt cẩn thận, và bạn cũng nên vậy. Nếu danh sách là <code>5 9 5 2</code> và bạn tìm 5 thì đáp án là chỉ số 0, không phải chỉ số 2. Tìm tuyến tính cho ra cái đầu tiên một cách tự nhiên; tìm nhị phân trên dữ liệu có trùng lặp có thể rơi vào bất kỳ cái nào, nên muốn trả "cái đầu tiên" thì phải thêm một bước.</li>
<li><strong>Tiền điều kiện, nói một lần và bị hỏi mãi mãi</strong> — "tìm nhị phân đòi hỏi danh sách phải được sắp xếp trước". Đây là câu bị ra đề nhiều nhất cả chương. Nó là một <em>tiền điều kiện</em> theo nghĩa ở slide 18: vi phạm nó thì thuật toán không hứa gì hết, và — phần nguy hiểm — nó không hề than phiền.</li>
<li><strong>Cái giá của việc thoả mãn tiền điều kiện</strong> — sắp một triệu phần tử tốn khoảng 2·10⁷ phép so sánh (merge sort). Một lần tìm nhị phân tốn 20. Vậy việc sắp chỉ hoàn vốn nếu bạn còn tìm nhiều lần nữa: điểm hoà vốn so với tìm tuyến tính là khoảng 40 lần tìm. Tìm đúng một lần thì tìm tuyến tính thắng tuyệt đối.</li>
<li><strong>Một lựa chọn thứ ba mà slide không nhắc</strong> — băm (hashing), trung bình O(1). Đó là nội dung Chương 10/11 (cấu trúc tệp và cơ sở dữ liệu). Nhắc tới nó trong bài thi ở câu "chọn chiến lược tìm kiếm" là điểm cộng thật sự, không phải lạc đề.</li>
</ul>
<p class="dap-an">✅ Bài tập ra quyết định. Bạn có 1 000 000 bản ghi chưa sắp. (a) Tra đúng một lần, không bao giờ tra nữa → <strong>tìm tuyến tính</strong>, trung bình 500 000 phép so sánh; sắp trước sẽ tốn gấp 40 lần. (b) Tra mười nghìn lần → <strong>sắp một lần rồi tìm nhị phân</strong>: 2·10⁷ + 10 000 × 20 = 2,02·10⁷, so với tuyến tính là 10 000 × 500 000 = 5·10⁹ — rẻ hơn khoảng <strong>250 lần</strong>. Đáp án đúng phụ thuộc vào việc bạn sẽ tìm bao nhiêu lần, và bài thi nào nói được điều đó thì điểm cao hơn bài chỉ gọi tên một thuật toán mình thích.</p>`],

      [27, '5.2 Linear Search',
        `<p class="y-chinh">🎯 Linear search: check each element in turn until a match is found or the list runs out. Figure 6.15 shows the array <code>10 45 8 2 98 33 11</code> with the label <strong>Find − '98'</strong>, and orange arrows stepping across 10, 45, 8, 2 and landing on 98, which is highlighted green.</p>
<ul>
<li><strong>The cost, in the slide's own words</strong> — "at worst linear time and at most n comparisons, where n is the length of the list". Worst case is the target being last, or absent: n comparisons either way.</li>
<li><strong>The average case, and the typo</strong> — the slide writes "an average case of <em>n+1/2</em> comparisons". Read literally that is n + 0,5, which is nonsense. The intended formula is <strong>(n+1)/2</strong>: if the target is equally likely to be at any of the n positions, the expected number of comparisons is (1+2+⋯+n)/n = (n+1)/2. Verified by counting every target in a real program: for n = 16 the measured average is exactly 8,50 = (16+1)/2; for n = 1000 it is exactly 500,50 = (1000+1)/2.</li>
<li><strong>"the average case can be affected if the search probabilities vary"</strong> — true and useful: if 90% of lookups are for one popular item, put it first and the average collapses. That is the idea behind move-to-front lists and caches.</li>
<li><strong>Why linear search needs no precondition at all</strong> — it makes no assumption about order, uniqueness, or type beyond "can be compared for equality". It works on linked lists, files, network streams — anything you can walk once. Binary search needs random access <em>and</em> sorted order.</li>
<li><strong>Complexity</strong> — O(n). Double the list, double the expected work. Confirmed by measurement: average 8,50 at n = 16, 500,50 at n = 1000, 499 501,00 at n = 1 000 000.</li>
</ul>
<p>Traced with a real program on the slide's own array, target 98:</p>
<table><tr><th>Step</th><th>index (0-based)</th><th>position (1-based)</th><th>arr[i]</th><th>arr[i] == 98?</th><th>comparisons so far</th></tr>
<tr><td>1</td><td>0</td><td>1</td><td>10</td><td>no</td><td>1</td></tr>
<tr><td>2</td><td>1</td><td>2</td><td>45</td><td>no</td><td>2</td></tr>
<tr><td>3</td><td>2</td><td>3</td><td>8</td><td>no</td><td>3</td></tr>
<tr><td>4</td><td>3</td><td>4</td><td>2</td><td>no</td><td>4</td></tr>
<tr><td>5</td><td>4</td><td>5</td><td>98</td><td>YES</td><td>5</td></tr></table>
<p class="dap-an">✅ Answer: found at <strong>index 4</strong> (the 5th position), after <strong>5 comparisons</strong>. Searching for 11 (the last element) would take 7; searching for 99 (absent) would take 7 and return "not found". Average over all seven present values, measured: (1+2+3+4+5+6+7)/7 = <strong>4,0 comparisons</strong> = (7+1)/2. ✓</p>
<p class="pitfall">⚠️ Two traps in one. First, index versus position: the exam may ask for either, and they differ by one — the figure's green cell is the <em>5th</em> element but index <em>4</em>. Second, the slide's "n+1/2" is a typo for (n+1)/2; write the parentheses in your answer or you will be marked wrong for copying the slide faithfully.</p>`,
        `<p class="y-chinh">🎯 Tìm tuyến tính: kiểm từng phần tử một cho tới khi khớp hoặc hết danh sách. Hình 6.15 vẽ mảng <code>10 45 8 2 98 33 11</code> với nhãn <strong>Find − '98'</strong>, và các mũi tên cam bước qua 10, 45, 8, 2 rồi dừng ở 98 được tô xanh lá.</p>
<ul>
<li><strong>Chi phí, theo đúng chữ của slide</strong> — "xấu nhất là thời gian tuyến tính và nhiều nhất n phép so sánh, với n là độ dài danh sách". Trường hợp xấu nhất là mục tiêu nằm cuối, hoặc không có mặt: cả hai đều tốn n phép so sánh.</li>
<li><strong>Trường hợp trung bình, và lỗi gõ</strong> — slide viết "trung bình <em>n+1/2</em> phép so sánh". Đọc theo đúng nghĩa đen thì đó là n + 0,5, vô nghĩa. Công thức muốn nói là <strong>(n+1)/2</strong>: nếu mục tiêu có xác suất nằm ở n vị trí như nhau thì kỳ vọng số phép so sánh là (1+2+⋯+n)/n = (n+1)/2. Đã kiểm bằng chương trình đếm hết mọi mục tiêu: với n = 16 trung bình đo được đúng 8,50 = (16+1)/2; với n = 1000 đúng 500,50 = (1000+1)/2.</li>
<li><strong>"trường hợp trung bình có thể bị ảnh hưởng nếu xác suất tìm khác nhau"</strong> — đúng và hữu ích: nếu 90% lượt tra là để tìm một mục phổ biến thì đặt nó lên đầu, trung bình tụt hẳn. Đó là ý tưởng đứng sau danh sách "đưa lên đầu khi dùng" và bộ đệm cache.</li>
<li><strong>Vì sao tìm tuyến tính KHÔNG cần tiền điều kiện nào</strong> — nó không giả định gì về thứ tự, tính duy nhất hay kiểu dữ liệu ngoài "so được bằng nhau hay không". Nó chạy trên danh sách liên kết, trên file, trên luồng dữ liệu mạng — mọi thứ đi qua được một lượt. Tìm nhị phân thì cần truy cập ngẫu nhiên <em>và</em> thứ tự đã sắp.</li>
<li><strong>Độ phức tạp</strong> — O(n). Danh sách gấp đôi thì công kỳ vọng gấp đôi. Đo thật xác nhận: trung bình 8,50 ở n = 16, 500,50 ở n = 1000, 499 501,00 ở n = 1 000 000.</li>
</ul>
<p>Chạy tay bằng chương trình thật trên đúng mảng của slide, tìm 98:</p>
<table><tr><th>Bước</th><th>chỉ số (0-based)</th><th>vị trí (1-based)</th><th>arr[i]</th><th>arr[i] == 98?</th><th>số so sánh cộng dồn</th></tr>
<tr><td>1</td><td>0</td><td>1</td><td>10</td><td>không</td><td>1</td></tr>
<tr><td>2</td><td>1</td><td>2</td><td>45</td><td>không</td><td>2</td></tr>
<tr><td>3</td><td>2</td><td>3</td><td>8</td><td>không</td><td>3</td></tr>
<tr><td>4</td><td>3</td><td>4</td><td>2</td><td>không</td><td>4</td></tr>
<tr><td>5</td><td>4</td><td>5</td><td>98</td><td>CÓ</td><td>5</td></tr></table>
<p class="dap-an">✅ Đáp án: tìm thấy ở <strong>chỉ số 4</strong> (vị trí thứ 5), sau <strong>5 phép so sánh</strong>. Tìm số 11 (phần tử cuối) sẽ tốn 7; tìm số 99 (không có) tốn 7 rồi trả về "không thấy". Trung bình trên cả bảy giá trị có mặt, đo được: (1+2+3+4+5+6+7)/7 = <strong>4,0 phép so sánh</strong> = (7+1)/2. ✓</p>
<p class="pitfall">⚠️ Hai bẫy trong một. Thứ nhất, chỉ số khác vị trí: đề có thể hỏi cái nào cũng được, và chúng lệch nhau một — ô xanh trong hình là phần tử <em>thứ 5</em> nhưng chỉ số <em>4</em>. Thứ hai, chữ "n+1/2" của slide là lỗi gõ của (n+1)/2; hãy viết đủ ngoặc trong bài làm, không thì bạn bị trừ điểm vì chép slide một cách trung thành.</p>`],

      [28, 'Linear Search (Pseudocode)',
        `<p class="y-chinh">🎯 Linear search written in the most English-like pseudocode dialect in the deck, six numbered steps: take the array, take the target <code>x</code>, <strong>set flag = −1</strong>, loop from <code>arr[start]</code> to <code>arr[end]</code> testing <code>arr[current_position] == x</code> — on a match, print the position, <strong>set flag = 0</strong> and <em>abort</em>; after the loop, if <code>flag == −1</code> print "No Match Found"; STOP.</p>
<ul>
<li><strong>What the flag is for</strong> — it carries information <em>out</em> of the loop. Inside the loop you know you found it; after the loop you no longer do, unless you wrote it down. The flag is the written note. This pattern appears in every language and is worth recognising on sight.</li>
<li><strong>Why −1 and 0 and not true/false</strong> — this dialect has no boolean type, so it borrows the C convention where "not found" is the impossible index −1. Using the <em>position</em> as the flag would be better design: initialise <code>pos = -1</code>, set <code>pos = current_position</code> on a match, and you get both the answer and the found/not-found signal from one variable.</li>
<li><strong>"abort" means break out of the loop</strong> — not terminate the program. In C it is <code>break</code>; in a function, <code>return i</code> is cleaner and removes the need for a flag entirely.</li>
<li><strong>The early exit is the whole reason linear search is ever fast</strong> — without <em>abort</em> the loop always runs n times even after finding the target. With it, the average drops from n to (n+1)/2. Measured at n = 1000: 1000 comparisons without early exit versus 500,50 with it.</li>
<li><strong>Weaknesses in this pseudocode worth noticing</strong> — it <em>prints</em> the position instead of returning it (so a caller cannot use the result); it does not say what <code>start</code> and <code>end</code> are; and with a match at the very first element it still executes step 5's flag test. Compare with slide 18's disciplined form (Algorithm/Pre/Post/Return) and you can see why that form exists.</li>
</ul>
<p>Traced exactly as written, on <code>arr = [10, 45, 8, 2, 98, 33, 11]</code>, x = 33:</p>
<table><tr><th>Step</th><th>current_position</th><th>arr[cp]</th><th>arr[cp] == 33?</th><th>flag after</th></tr>
<tr><td>init</td><td>—</td><td>—</td><td>—</td><td>−1</td></tr>
<tr><td>loop 1</td><td>0</td><td>10</td><td>no</td><td>−1</td></tr>
<tr><td>loop 2</td><td>1</td><td>45</td><td>no</td><td>−1</td></tr>
<tr><td>loop 3</td><td>2</td><td>8</td><td>no</td><td>−1</td></tr>
<tr><td>loop 4</td><td>3</td><td>2</td><td>no</td><td>−1</td></tr>
<tr><td>loop 5</td><td>4</td><td>98</td><td>no</td><td>−1</td></tr>
<tr><td>loop 6</td><td>5</td><td>33</td><td>YES → print, flag = 0, abort</td><td>0</td></tr>
</table>
<p class="dap-an">✅ Answer: prints "Match Found at position 5" (index) or "6" (1-based position, which is what the pseudocode's wording suggests), with <strong>6 comparisons</strong>, and flag ends at 0 so step 5 prints nothing. Now run it with x = 99: the loop completes all <strong>7 comparisons</strong>, flag stays −1, and step 5.1 fires → <strong>"No Match Found"</strong>. Those two runs are the only two behaviours this algorithm has.</p>
<p class="meo">💡 In an exam, write linear search as a function instead: <code>for (i = 0; i &lt; n; i++) if (a[i] == x) return i; return -1;</code> — three lines, no flag, no ambiguity about whether you print or return. It earns full marks and is faster to write than copying the six numbered steps.</p>`,
        `<p class="y-chinh">🎯 Tìm tuyến tính viết bằng phương ngữ mã giả gần tiếng Anh thường nhất trong deck, sáu bước đánh số: nhận mảng, nhận mục tiêu <code>x</code>, <strong>đặt flag = −1</strong>, lặp từ <code>arr[start]</code> tới <code>arr[end]</code> kiểm <code>arr[current_position] == x</code> — khớp thì in vị trí, <strong>đặt flag = 0</strong> và <em>abort</em>; sau vòng lặp, nếu <code>flag == −1</code> thì in "No Match Found"; STOP.</p>
<ul>
<li><strong>Biến cờ dùng để làm gì</strong> — nó mang thông tin <em>ra khỏi</em> vòng lặp. Bên trong vòng lặp bạn biết mình đã tìm thấy; sau vòng lặp bạn không còn biết nữa, trừ khi đã ghi lại. Biến cờ chính là mẩu giấy ghi ấy. Mẫu này có ở mọi ngôn ngữ và đáng nhận ra ngay từ cái nhìn đầu.</li>
<li><strong>Vì sao dùng −1 và 0 chứ không dùng true/false</strong> — phương ngữ này không có kiểu luận lý, nên nó mượn quy ước của C, nơi "không tìm thấy" là chỉ số bất khả −1. Thiết kế tốt hơn là dùng chính <em>vị trí</em> làm cờ: khởi tạo <code>pos = -1</code>, gặp khớp thì gán <code>pos = current_position</code>, thế là một biến cho cả đáp án lẫn tín hiệu thấy/không thấy.</li>
<li><strong>"abort" nghĩa là thoát khỏi vòng lặp</strong> — không phải kết thúc chương trình. Trong C nó là <code>break</code>; còn trong một hàm thì <code>return i</code> sạch hơn và xoá hẳn nhu cầu có biến cờ.</li>
<li><strong>Lối thoát sớm là toàn bộ lý do tìm tuyến tính có lúc nhanh</strong> — không có <em>abort</em> thì vòng lặp luôn chạy đủ n lượt kể cả sau khi đã thấy mục tiêu. Có nó thì trung bình tụt từ n xuống (n+1)/2. Đo ở n = 1000: 1000 phép so sánh khi không thoát sớm, so với 500,50 khi có.</li>
<li><strong>Những điểm yếu của mã giả này đáng để ý</strong> — nó <em>in</em> vị trí thay vì trả về (nên người gọi không dùng được kết quả); nó không nói <code>start</code> và <code>end</code> là gì; và ngay cả khi khớp ở phần tử đầu tiên, nó vẫn chạy phép kiểm cờ ở bước 5. Hãy so với dạng kỷ luật ở slide 18 (Algorithm/Pre/Post/Return) là thấy vì sao dạng ấy tồn tại.</li>
</ul>
<p>Chạy tay đúng như viết, trên <code>arr = [10, 45, 8, 2, 98, 33, 11]</code>, x = 33:</p>
<table><tr><th>Bước</th><th>current_position</th><th>arr[cp]</th><th>arr[cp] == 33?</th><th>flag sau đó</th></tr>
<tr><td>khởi tạo</td><td>—</td><td>—</td><td>—</td><td>−1</td></tr>
<tr><td>lượt 1</td><td>0</td><td>10</td><td>không</td><td>−1</td></tr>
<tr><td>lượt 2</td><td>1</td><td>45</td><td>không</td><td>−1</td></tr>
<tr><td>lượt 3</td><td>2</td><td>8</td><td>không</td><td>−1</td></tr>
<tr><td>lượt 4</td><td>3</td><td>2</td><td>không</td><td>−1</td></tr>
<tr><td>lượt 5</td><td>4</td><td>98</td><td>không</td><td>−1</td></tr>
<tr><td>lượt 6</td><td>5</td><td>33</td><td>CÓ → in, flag = 0, abort</td><td>0</td></tr>
</table>
<p class="dap-an">✅ Đáp án: in ra "Match Found at position 5" (theo chỉ số) hoặc "6" (theo vị trí 1-based, đúng cách diễn đạt của mã giả), tốn <strong>6 phép so sánh</strong>, và flag kết thúc bằng 0 nên bước 5 không in gì. Giờ chạy lại với x = 99: vòng lặp chạy hết cả <strong>7 phép so sánh</strong>, flag vẫn −1, và bước 5.1 nổ ra → <strong>"No Match Found"</strong>. Hai lần chạy ấy là hai hành vi duy nhất mà thuật toán này có.</p>
<p class="meo">💡 Trong bài thi, hãy viết tìm tuyến tính dưới dạng hàm thay vì chép sáu bước: <code>for (i = 0; i &lt; n; i++) if (a[i] == x) return i; return -1;</code> — ba dòng, không cần cờ, không nhập nhằng chuyện in hay trả về. Nó vẫn ăn trọn điểm và viết nhanh hơn.</p>`],

      [29, '5.3 Binary Search',
        `<p class="y-chinh">🎯 Binary search — "half-interval search, logarithmic search, or binary chop" — compares the target with the <strong>middle</strong> element, throws away the half it cannot be in, and repeats. Figure 6.16 traces <em>Searching for 14 in a 12-element array</em> <code>1 3 5 6 7 8 9 11 14 15 19 27</code>, with code fragments showing <code>int begin = 0; int end = A.Length - 1; int mid = (begin + end) / 2;</code> and then <code>if (A[mid] == k) return mid; else if (A[mid] &gt; k) end = mid - 1; else begin = mid + 1;</code></p>
<ul>
<li><strong>Read the figure's two iterations</strong> — iteration 1: begin = 0, end = 11, mid = 5, A[5] = 8 (blacked out in the picture). 8 &lt; 14, so go right: begin = 6. Iteration 2: begin = 6, end = 11, mid = 8, A[8] = 14 → found. Two iterations, exactly as the figure's two rows show.</li>
<li><strong>Why it is O(log n)</strong> — each step discards half the remaining range: 12 → 6 → 3 → 1. The number of halvings needed is log₂ n. That is the only idea in the algorithm; everything else is index arithmetic.</li>
<li><strong>The three-way comparison is the heart</strong> — equal (done), less (go right), greater (go left). Miss the equality case and the loop runs to exhaustion even when the target is sitting under <code>mid</code>.</li>
<li><strong>Termination</strong> — "if the search ends with the remaining half being empty, the target is not in the array". In code that is the moment <code>begin &gt; end</code>. Every iteration strictly shrinks the range because <code>mid</code> is excluded by <code>mid ± 1</code>; write <code>end = mid</code> instead of <code>mid - 1</code> and you get an infinite loop.</li>
<li><strong>The overflow bug that lived in the JDK for nine years</strong> — <code>(begin + end) / 2</code> overflows when both are near the maximum <code>int</code>. The fix is <code>begin + (end - begin) / 2</code>. Joshua Bloch published this in 2006 about <code>java.util.Arrays.binarySearch</code>, which had shipped in 1997. Worth knowing that a nine-line algorithm can hide a bug for that long.</li>
</ul>
<p>Measured comparison counts, counted by a real C program searching for <em>every</em> element of a sorted array:</p>
<table><tr><th>n</th><th>Linear avg</th><th>Linear worst</th><th>Binary avg</th><th>Binary worst</th><th>log₂ n</th><th>Linear ÷ Binary</th></tr>
<tr><td>16</td><td>8,50</td><td>16</td><td>3,38</td><td>5</td><td>4,00</td><td>2,5×</td></tr>
<tr><td>1 000</td><td>500,50</td><td>1 000</td><td>8,99</td><td>10</td><td>9,97</td><td>55,7×</td></tr>
<tr><td>1 000 000</td><td>499 501,00</td><td>1 000 000</td><td>18,99</td><td>20</td><td>19,93</td><td>26 309×</td></tr>
</table>
<p class="dap-an">✅ Answer: <strong>log₂(1 000 000) = 19,93, so 20 steps is the worst case</strong> — measured worst case: exactly 20. Searching a million records costs 20 comparisons instead of a million. Note the worst case is ⌊log₂ n⌋ + 1, not log₂ n: at n = 16 the measured worst is <strong>5</strong>, not 4. A target that is absent costs 4 · 9 · 19 comparisons at the three sizes (one fewer, because the final equality test never succeeds).</p>
<p class="pitfall">⚠️⚠️ <strong>Binary search on an unsorted array fails SILENTLY.</strong> Measured on the slide 27 array <code>10 45 8 2 98 33 11</code>, running binary search for all seven values that <em>are</em> present: it found 2 and 33 correctly and returned −1 ("not in the array") for <strong>10, 45, 8 and 98 — five of seven wrong</strong>. Tracing the search for 98: [lo=0 hi=6 mid=3 a[mid]=2] → 2 &lt; 98 go right → [lo=4 hi=6 mid=5 a[mid]=33] → 33 &lt; 98 go right → [lo=6 hi=6 mid=6 a[mid]=11] → 11 &lt; 98 go right → lo = 7 &gt; hi = 6 → returns −1, even though 98 is sitting at index 4. No error, no warning, no crash — just a wrong answer. This is the precondition of slide 26 being violated, and it is why "sorted" is not a suggestion.</p>`,
        `<p class="y-chinh">🎯 Tìm nhị phân — "half-interval search, logarithmic search, hay binary chop" — so mục tiêu với phần tử <strong>ở giữa</strong>, vứt bỏ nửa mà nó không thể nằm trong, rồi lặp lại. Hình 6.16 chạy tay <em>tìm 14 trong mảng 12 phần tử</em> <code>1 3 5 6 7 8 9 11 14 15 19 27</code>, kèm mẩu mã <code>int begin = 0; int end = A.Length - 1; int mid = (begin + end) / 2;</code> rồi <code>if (A[mid] == k) return mid; else if (A[mid] &gt; k) end = mid - 1; else begin = mid + 1;</code></p>
<ul>
<li><strong>Đọc hai lượt trong hình</strong> — lượt 1: begin = 0, end = 11, mid = 5, A[5] = 8 (bị tô đen trong hình). 8 &lt; 14 nên đi sang phải: begin = 6. Lượt 2: begin = 6, end = 11, mid = 8, A[8] = 14 → tìm thấy. Đúng hai lượt, đúng bằng hai hàng mà hình vẽ.</li>
<li><strong>Vì sao nó là O(log n)</strong> — mỗi bước vứt đi một nửa khoảng còn lại: 12 → 6 → 3 → 1. Số lần chia đôi cần thiết là log₂ n. Đó là ý tưởng duy nhất của thuật toán; mọi thứ còn lại chỉ là số học chỉ số.</li>
<li><strong>Phép so sánh ba chiều là trái tim</strong> — bằng (xong), nhỏ hơn (sang phải), lớn hơn (sang trái). Bỏ sót trường hợp bằng thì vòng lặp chạy tới cạn kiệt kể cả khi mục tiêu đang nằm ngay dưới <code>mid</code>.</li>
<li><strong>Tính dừng</strong> — "nếu kết thúc mà nửa còn lại rỗng thì mục tiêu không có trong mảng". Trong mã đó là lúc <code>begin &gt; end</code>. Mỗi lượt đều thu hẹp khoảng một cách CHẶT vì <code>mid</code> bị loại bởi <code>mid ± 1</code>; viết <code>end = mid</code> thay cho <code>mid - 1</code> là có vòng lặp vô tận.</li>
<li><strong>Lỗi tràn số sống chín năm trong JDK</strong> — <code>(begin + end) / 2</code> tràn khi cả hai gần giá trị <code>int</code> lớn nhất. Cách vá là <code>begin + (end - begin) / 2</code>. Joshua Bloch công bố chuyện này năm 2006 về <code>java.util.Arrays.binarySearch</code>, thứ đã phát hành từ 1997. Đáng nhớ rằng một thuật toán chín dòng giấu được một con bọ lâu tới thế.</li>
</ul>
<p>Số phép so sánh đo thật, đếm bằng chương trình C tìm <em>mọi</em> phần tử của một mảng đã sắp:</p>
<table><tr><th>n</th><th>Tuyến tính TB</th><th>Tuyến tính xấu nhất</th><th>Nhị phân TB</th><th>Nhị phân xấu nhất</th><th>log₂ n</th><th>Tuyến tính ÷ Nhị phân</th></tr>
<tr><td>16</td><td>8,50</td><td>16</td><td>3,38</td><td>5</td><td>4,00</td><td>2,5 lần</td></tr>
<tr><td>1 000</td><td>500,50</td><td>1 000</td><td>8,99</td><td>10</td><td>9,97</td><td>55,7 lần</td></tr>
<tr><td>1 000 000</td><td>499 501,00</td><td>1 000 000</td><td>18,99</td><td>20</td><td>19,93</td><td>26 309 lần</td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>log₂(1 000 000) = 19,93 nên xấu nhất là 20 bước</strong> — đo thật xấu nhất: đúng 20. Tìm trong một triệu bản ghi tốn 20 phép so sánh thay vì một triệu. Để ý trường hợp xấu nhất là ⌊log₂ n⌋ + 1 chứ không phải log₂ n: ở n = 16 giá trị xấu nhất đo được là <strong>5</strong>, không phải 4. Mục tiêu KHÔNG có trong mảng tốn 4 · 9 · 19 phép so sánh ở ba cỡ (ít hơn một, vì phép kiểm bằng cuối cùng không bao giờ đúng).</p>
<p class="pitfall">⚠️⚠️ <strong>Tìm nhị phân trên mảng CHƯA SẮP hỏng một cách ÂM THẦM.</strong> Đo trên mảng của slide 27 <code>10 45 8 2 98 33 11</code>, chạy tìm nhị phân cho cả bảy giá trị <em>có mặt</em>: nó tìm đúng 2 và 33, còn trả về −1 ("không có trong mảng") cho <strong>10, 45, 8 và 98 — sai năm trên bảy</strong>. Chạy tay lượt tìm 98: [lo=0 hi=6 mid=3 a[mid]=2] → 2 &lt; 98 sang phải → [lo=4 hi=6 mid=5 a[mid]=33] → 33 &lt; 98 sang phải → [lo=6 hi=6 mid=6 a[mid]=11] → 11 &lt; 98 sang phải → lo = 7 &gt; hi = 6 → trả về −1, dù 98 đang nằm ngay ở chỉ số 4. Không lỗi, không cảnh báo, không sập — chỉ là một đáp án sai. Đây chính là tiền điều kiện ở slide 26 bị vi phạm, và đó là lý do chữ "đã sắp xếp" không phải một lời gợi ý.</p>`],

      [30, 'Binary Search (Pseudocode)',
        `<p class="y-chinh">🎯 The chapter's last slide: binary search as pseudocode, Figure 6.17. <code>i = left endpoint</code>, <code>j = right endpoint</code>, <code>Start: i = 1, j = n, x = (term to find)</code>, then <strong>While i &lt; j</strong> do: <code>m = ⌊(i+j)/2⌋</code>; <strong>If x &gt; a<sub>m</sub></strong>, search the second half and set <code>i = m+1</code>; <strong>Else</strong> search the first half and set <code>j = m</code>.</p>
<ul>
<li><strong>This is a different variant from slide 29, and you must notice</strong> — slide 29's code is 0-based with a three-way comparison and <code>end = mid - 1</code>. This one is 1-based, has only a <em>two-way</em> comparison, and uses <code>j = m</code> (not <code>m − 1</code>). It is the "find the boundary" variant: it narrows until <code>i == j</code> and never returns early.</li>
<li><strong>Two consequences of dropping the equality test</strong> — (1) it does <em>not</em> stop when it lands on the target; it keeps halving to the end. (2) it does not tell you whether the value was found. The pseudocode as printed has <strong>no step that checks <code>a[i] == x</code> and no step that returns anything</strong> — you must add both yourself.</li>
<li><strong>Why <code>j = m</code> and not <code>j = m − 1</code> here</strong> — because <code>m</code> has not been excluded: without the equality test, <code>a[m]</code> might still be the answer, so it has to stay inside the range. And the loop still terminates because <code>m = ⌊(i+j)/2⌋ &lt; j</code> whenever <code>i &lt; j</code>, so <code>j</code> strictly decreases.</li>
<li><strong>Why anyone would write it this way</strong> — it always does exactly ⌈log₂ n⌉ iterations, so its cost is perfectly predictable, and it naturally returns the <em>first</em> occurrence when there are duplicates, which slide 26's definition actually asked for. Slide 29's variant is faster on a lucky hit but may land on any duplicate.</li>
<li><strong>The floor brackets ⌊ ⌋</strong> — integer division, discarding the fraction. In C the <code>/</code> on two <code>int</code>s already does this, so <code>(i+j)/2</code> is correct without any extra function.</li>
</ul>
<p>Traced exactly as printed, 1-based, on <code>a[1..12] = 1 3 5 6 7 8 9 11 14 15 19 27</code>, x = 14 — measured with a real program:</p>
<table><tr><th>Iteration</th><th>i</th><th>j</th><th>m = ⌊(i+j)/2⌋</th><th>a[m]</th><th>x &gt; a[m]?</th><th>new i, j</th></tr>
<tr><td>1</td><td>1</td><td>12</td><td>6</td><td>8</td><td>14 &gt; 8 → YES</td><td>i = 7, j = 12</td></tr>
<tr><td>2</td><td>7</td><td>12</td><td>9</td><td>14</td><td>14 &gt; 14 → no</td><td>i = 7, j = 9</td></tr>
<tr><td>3</td><td>7</td><td>9</td><td>8</td><td>11</td><td>14 &gt; 11 → YES</td><td>i = 9, j = 9</td></tr>
</table>
<p class="dap-an">✅ Answer: the loop ends when <code>i = j = 9</code>, and <code>a[9] = 14</code> — correct. It took <strong>3 iterations</strong>, against slide 29's <strong>2</strong> for the same array and the same target, because this variant cannot stop early. Note it found the answer at position 9 (1-based) = index 8 (0-based), which is exactly where Figure 6.16 highlighted it. And note the missing final step: the algorithm as printed leaves <code>i = 9</code> without ever saying "check whether <code>a[9] == x</code>, and if not, report not-found". Add that line or the algorithm cannot distinguish "found at 9" from "not present, would belong at 9".</p>
<p class="pitfall">⚠️ Exam trap built into this slide: it is 1-based (<code>i = 1, j = n</code>) while slide 29's figure is 0-based (<code>begin = 0, end = A.Length − 1</code>). The same array gives <em>different numbers</em> for <code>m</code> depending on which convention the question uses — here m = 6 on iteration 1, there mid = 5. Before you write anything, look at the question's own indexing and state it in your answer.</p>`,
        `<p class="y-chinh">🎯 Slide cuối cùng của chương: tìm nhị phân dưới dạng mã giả, Hình 6.17. <code>i = đầu mút trái</code>, <code>j = đầu mút phải</code>, <code>Start: i = 1, j = n, x = (giá trị cần tìm)</code>, rồi <strong>While i &lt; j</strong> làm: <code>m = ⌊(i+j)/2⌋</code>; <strong>If x &gt; a<sub>m</sub></strong> thì tìm ở nửa sau và đặt <code>i = m+1</code>; <strong>Else</strong> tìm ở nửa trước và đặt <code>j = m</code>.</p>
<ul>
<li><strong>Đây là một BIẾN THỂ KHÁC với slide 29, và bạn bắt buộc phải nhận ra</strong> — mã ở slide 29 dùng 0-based, so sánh ba chiều và <code>end = mid - 1</code>. Cái này dùng 1-based, chỉ so <em>hai chiều</em>, và dùng <code>j = m</code> (không phải <code>m − 1</code>). Đó là biến thể "tìm ranh giới": nó thu hẹp cho tới khi <code>i == j</code> và không bao giờ trả về sớm.</li>
<li><strong>Hai hệ quả của việc bỏ phép kiểm bằng</strong> — (1) nó <em>không</em> dừng khi rơi trúng mục tiêu; nó cứ chia đôi tới cùng. (2) nó không cho bạn biết có tìm thấy hay không. Mã giả in ra <strong>không có bước nào kiểm <code>a[i] == x</code> và không có bước nào trả về gì cả</strong> — bạn phải tự thêm cả hai.</li>
<li><strong>Vì sao ở đây là <code>j = m</code> chứ không phải <code>j = m − 1</code></strong> — vì <code>m</code> chưa bị loại: không có phép kiểm bằng thì <code>a[m]</code> vẫn có thể là đáp án, nên nó phải nằm lại trong khoảng. Mà vòng lặp vẫn dừng vì <code>m = ⌊(i+j)/2⌋ &lt; j</code> mỗi khi <code>i &lt; j</code>, nên <code>j</code> giảm một cách chặt.</li>
<li><strong>Vì sao có người viết theo lối này</strong> — nó LUÔN chạy đúng ⌈log₂ n⌉ lượt nên chi phí dự đoán được hoàn hảo, và nó trả về <em>lần xuất hiện đầu tiên</em> một cách tự nhiên khi có giá trị trùng — đúng thứ mà định nghĩa ở slide 26 yêu cầu. Biến thể ở slide 29 nhanh hơn khi may mắn trúng ngay, nhưng có thể rơi vào bất kỳ bản trùng nào.</li>
<li><strong>Cặp ngoặc sàn ⌊ ⌋</strong> — phép chia lấy nguyên, vứt phần lẻ. Trong C, dấu <code>/</code> giữa hai <code>int</code> đã làm đúng việc ấy rồi, nên <code>(i+j)/2</code> là đúng mà không cần hàm nào thêm.</li>
</ul>
<p>Chạy tay đúng như in, 1-based, trên <code>a[1..12] = 1 3 5 6 7 8 9 11 14 15 19 27</code>, x = 14 — đo bằng chương trình thật:</p>
<table><tr><th>Lượt</th><th>i</th><th>j</th><th>m = ⌊(i+j)/2⌋</th><th>a[m]</th><th>x &gt; a[m]?</th><th>i, j mới</th></tr>
<tr><td>1</td><td>1</td><td>12</td><td>6</td><td>8</td><td>14 &gt; 8 → CÓ</td><td>i = 7, j = 12</td></tr>
<tr><td>2</td><td>7</td><td>12</td><td>9</td><td>14</td><td>14 &gt; 14 → không</td><td>i = 7, j = 9</td></tr>
<tr><td>3</td><td>7</td><td>9</td><td>8</td><td>11</td><td>14 &gt; 11 → CÓ</td><td>i = 9, j = 9</td></tr>
</table>
<p class="dap-an">✅ Đáp án: vòng lặp dừng khi <code>i = j = 9</code>, và <code>a[9] = 14</code> — đúng. Nó tốn <strong>3 lượt</strong>, so với <strong>2 lượt</strong> của slide 29 trên cùng mảng và cùng mục tiêu, vì biến thể này không dừng sớm được. Để ý nó tìm ra đáp án ở vị trí 9 (1-based) = chỉ số 8 (0-based), đúng chỗ mà Hình 6.16 tô đen. Và để ý bước cuối bị thiếu: thuật toán như in ra để <code>i = 9</code> nằm đó mà không hề nói "kiểm xem <code>a[9] == x</code> không, nếu không thì báo không tìm thấy". Phải thêm dòng ấy, không thì thuật toán không phân biệt được "tìm thấy ở 9" với "không có, mà nếu có thì sẽ nằm ở 9".</p>
<p class="pitfall">⚠️ Bẫy thi được cài sẵn trong slide này: nó dùng 1-based (<code>i = 1, j = n</code>) trong khi hình ở slide 29 dùng 0-based (<code>begin = 0, end = A.Length − 1</code>). Cùng một mảng mà <code>m</code> ra <em>số khác nhau</em> tuỳ đề dùng quy ước nào — ở đây m = 6 ở lượt 1, còn bên kia mid = 5. Trước khi viết gì, hãy nhìn xem đề đánh chỉ số từ mấy, và ghi rõ điều đó vào bài làm.</p>`],
    ]),
  ].join('\n'),
};
