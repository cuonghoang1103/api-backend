/**
 * CSI106 · Chương 2 — Numbering systems, học theo từng slide (slide 1–21).
 * Deck 'csi2' (CSI2), 21 slide, ảnh đã render sẵn lên CDN images/academy/CSI106/v1/csi2/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ CSI_02.pptx của trường (/tmp/csi106-text/csi2.txt).
 * Các slide chỉ có HÌNH/BẢNG (5, 7, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20, 21) đã được
 * đọc thẳng từ ảnh render để lấy đúng từng ô của bảng trọng số, từng bước chia/nhân
 * và từng con số trong Figure 2.2–2.7.
 *
 * MỌI phép đổi cơ số dưới đây đã được kiểm CHÉO HAI CHIỀU bằng python3 (Fraction để
 * phần thập phân không sai số nhị phân):
 *   · (2A)16 = (52)8 = 42        ✓   · (2AE)16 = (1256)8 = 686 = (1010101110)2 ✓
 *   · (101.11)2 = 5.75            ✓   · (110.11)2 = 6.75 ✓
 *   · (1A.23)16 = 26.13671875     ✓   (slide làm tròn thành 26.137 — đã nêu rõ)
 *   · 35 = (100011)2              ✓   · 126 = (176)8 ✓
 *   · 0.625 = (0.101)2            ✓   · 0.634 ≈ (0.5044)8 ✓
 *   · (24C)16 = (001001001100)2 = 588 ✓   · (24)8 = (010100)2 = 20 ✓
 *   · Figure 2.7: (4116)8 = (100001001110)2 = (84E)16 = 2126 ✓
 *   · Bảng 2.1: (1001.11)2 = 9.75 · (156.23)8 = 110.296875 · (A2C.A1)16 = 2604.62890625 ✓
 *   · Toàn bộ bài luyện tự thêm (45, 87, 200, 1000, 214, 250, 429, 1017, 234,
 *     0.375, 0.8125, 0.1, 25.6875) đều đổi xuôi rồi đổi ngược ra đúng số ban đầu ✓
 *
 * ⚠ Các chỗ slide gốc SAI/LỆCH đã được nêu thẳng trong bài, KHÔNG im lặng chép lại
 *   và KHÔNG tự ý sửa slide:
 *   · "b 5 10", "S 5 {0,…}" (slide 8, 9, 10, 11) — dấu "=" bị font nuốt thành "5".
 *   · Slide 15, 16 viết "Covert" thay vì "Convert".
 *   · Hàng Multiplication của Figure 2.2 (slide 15) in "S0 × b0" HAI LẦN; đúng phải là
 *     "S1 × b1 + S0 × b0".
 *   · Slide 16 đánh số ví dụ lộn: "Example 3.1" và "Example 2.3" (2.3 đã dùng ở slide 11).
 *   · Slide 16: 26.137 là số LÀM TRÒN, giá trị đúng là 26.13671875.
 *   · Slide 20: "What is the binary equivalent of for (24)8?" — thừa chữ "of".
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'csi2';

export default {
  title: '2.0 — Slide by slide: Positional number systems and base conversion (21 slides)|||2.0 — Slide bài giảng: Hệ đếm theo vị trí & chuyển đổi cơ số (21 slide)',
  slug: 'csi106-2-0-slides-he-dem-chuyen-co-so',
  type: 'DOCUMENT',
  description: 'Toàn bộ 21 slide Chương 2 của CSI106 (Forouzan, Foundations of Computer Science): hệ đếm theo vị trí, bốn hệ thập phân · nhị phân · bát phân · thập lục phân, và bộ quy tắc chuyển đổi qua lại giữa chúng. Đây là chương ứng với CLO2 và là kỹ năng TÍNH TAY bị hỏi nhiều nhất trong đề thi, nên mỗi phép đổi đều có bảng chạy tay từng bước (chia 2 liên tiếp, nhân trọng số, nhân 2 liên tiếp cho phần lẻ), cộng thêm hơn hai mươi bài luyện tự thêm có lời giải đầy đủ. Mọi con số trong bài đã được kiểm chéo hai chiều bằng máy, và những chỗ slide gốc in sai đều được chỉ ra thay vì chép lại.',
  content: [
    walkHead(D, 1, 21),
    walk(D, [

      [1, '2. Numbering systems',
        `<p class="y-chinh">🎯 The title slide of the shortest but most <em>calculated-on</em> chapter of CSI106: 21 slides that teach you to write the same quantity in four different alphabets, and to move a number between them by hand, on paper, without a calculator.</p>
<ul>
<li><strong>Why a whole chapter on counting</strong> — Chapter 1 said a computer is a data processor built from switches. A switch has two states, so the machine can only spell numbers with two symbols. Everything you will ever store in it — text, images, sound, instructions — is first turned into a number, and then that number is written in base 2.</li>
<li><strong>What "numbering system" means here</strong> — not "how big a number is", but "how a number is <em>written down</em>". The quantity forty-two does not change when you write it 42, or 101010, or 2A. Only the notation changes. Keeping quantity and notation apart is the single idea the whole chapter rests on.</li>
<li><strong>The four systems you must own</strong> — decimal (base 10, the one you think in), binary (base 2, the one the machine works in), hexadecimal (base 16, the one programmers write binary in), octal (base 8, the older shorthand, still used for Unix file permissions).</li>
<li><strong>This is CLO2</strong> — the learning outcome "represent data in different number systems and convert between them". In the exam it shows up as short computational questions worth easy marks if you have drilled the procedure, and worth zero if you have only read about it.</li>
<li><strong>The skill is mechanical, and that is good news</strong> — there is no insight to have. There are four procedures (any base → decimal, decimal → any base for the integer part, decimal → any base for the fraction, and grouping bits for octal/hex) and each one is a loop you can run in your head after twenty repetitions.</li>
<li><strong>Book chapter</strong> — Forouzan, <em>Foundations of Computer Science</em>, Chapter 2. The figures numbered 2.1 to 2.7 and the examples numbered 2.1 to 2.5 that you will see on these slides are lifted straight from it, so the book is the place to find more drill problems.</li>
</ul>
<p class="meo">💡 Set yourself the target now: by slide 21 you should be able to fill this row from memory in under a minute — decimal <strong>42</strong>, binary <strong>101010</strong>, octal <strong>52</strong>, hex <strong>2A</strong> — and to explain why the binary and the octal forms of the same number look nothing alike yet are built from exactly the same bits.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề của chương ngắn nhất nhưng <em>phải tính tay nhiều nhất</em> của CSI106: 21 slide dạy bạn viết cùng một lượng bằng bốn bộ chữ cái khác nhau, và chuyển một con số qua lại giữa chúng bằng tay, trên giấy, không máy tính bỏ túi.</p>
<ul>
<li><strong>Vì sao dành hẳn một chương cho chuyện đếm</strong> — Chương 1 nói máy tính là một cỗ máy xử lý dữ liệu dựng từ các công tắc. Công tắc có hai trạng thái, nên máy chỉ đánh vần số bằng hai ký hiệu. Mọi thứ bạn cất vào nó — chữ, ảnh, âm thanh, lệnh — trước hết bị biến thành một con số, rồi con số ấy được viết ở cơ số 2.</li>
<li><strong>"Hệ đếm" ở đây nghĩa là gì</strong> — không phải "con số lớn cỡ nào", mà "con số được <em>viết ra</em> thế nào". Lượng bốn mươi hai không đổi khi bạn viết 42, hay 101010, hay 2A. Chỉ có cách ghi là đổi. Tách bạch được LƯỢNG và CÁCH GHI là ý tưởng duy nhất mà cả chương này dựa vào.</li>
<li><strong>Bốn hệ phải thuộc</strong> — thập phân (cơ số 10, hệ bạn suy nghĩ bằng nó), nhị phân (cơ số 2, hệ máy làm việc bằng nó), thập lục phân (cơ số 16, hệ lập trình viên dùng để viết tắt nhị phân), bát phân (cơ số 8, lối viết tắt cũ hơn, nay vẫn còn dùng cho quyền tệp Unix).</li>
<li><strong>Đây chính là CLO2</strong> — chuẩn đầu ra "biểu diễn dữ liệu trong các hệ đếm khác nhau và chuyển đổi giữa chúng". Vào đề thi nó hiện ra dưới dạng câu tính ngắn: luyện đủ thì ăn điểm dễ, chỉ đọc mà không làm thì mất trắng.</li>
<li><strong>Kỹ năng này thuần máy móc, và đó là tin mừng</strong> — không có "cú giác ngộ" nào phải chờ. Chỉ có bốn quy trình (cơ số bất kỳ → thập phân; thập phân → cơ số bất kỳ cho phần nguyên; thập phân → cơ số bất kỳ cho phần lẻ; và gom bit cho bát phân/thập lục phân), mỗi cái là một vòng lặp mà sau hai mươi lần làm bạn chạy được trong đầu.</li>
<li><strong>Giáo trình</strong> — Forouzan, <em>Foundations of Computer Science</em>, chương 2. Các hình đánh số 2.1 đến 2.7 và các ví dụ đánh số 2.1 đến 2.5 mà bạn sắp thấy đều bê nguyên từ sách ra, nên muốn thêm bài luyện thì mở đúng chương đó.</li>
</ul>
<p class="meo">💡 Đặt mục tiêu ngay bây giờ: tới slide 21 bạn phải điền được hàng này từ trí nhớ trong chưa đầy một phút — thập phân <strong>42</strong>, nhị phân <strong>101010</strong>, bát phân <strong>52</strong>, thập lục phân <strong>2A</strong> — và giải thích được vì sao dạng nhị phân và dạng bát phân của cùng một số nhìn chẳng giống nhau tí nào mà lại được dựng từ đúng những bit ấy.</p>`],

      [2, 'Content',
        `<p class="y-chinh">🎯 The whole chapter in three lines: <strong>2.1 Introduction</strong>, <strong>2.2 Positional Number Systems</strong>, <strong>2.3 Conversion</strong>. Every later slide belongs to one of those three, and the section dividers on slides 4, 6 and 13 tell you when you cross a border.</p>
<ul>
<li><strong>2.1 Introduction</strong> (slides 4–5) — the shortest part. It only establishes the vocabulary: a number system defines how a number is represented with distinct symbols, and the same quantity has different representations in different systems.</li>
<li><strong>2.2 Positional Number Systems</strong> (slides 6–12) — the theory part. One general formula, then the same formula instantiated four times for base 10, base 2, base 16 and base 8, then a summary table. If you understand the formula once, the four systems cost you nothing extra.</li>
<li><strong>2.3 Conversion</strong> (slides 13–21) — the exam part, and by far the biggest. Any base to decimal, decimal to any base (integer part, then fraction part), binary to/from hexadecimal, binary to/from octal, and finally octal to/from hexadecimal.</li>
<li><strong>Read the ordering as a dependency chain</strong> — you cannot convert before you know what a positional system is, and you cannot understand a positional system before you accept that notation is not quantity. Each part is the tool for the next one.</li>
<li><strong>Where the marks are</strong> — parts 2.1 and 2.2 produce definition questions (what is the base, what is the symbol set, what is a positional system) worth a line each; part 2.3 produces computational questions worth several marks each. Budget your revision the same way: understand 2.1–2.2 once, drill 2.3 repeatedly.</li>
<li><strong>What this chapter deliberately leaves out</strong> — negative numbers, floating point, and characters. Those are Chapter 3 (<em>Data storage</em>). Here every number is an unsigned quantity with an optional plus/minus sign written in front; nothing is stored in two's complement yet.</li>
</ul>
<p class="meo">💡 Copy these three headings onto the top of your revision sheet and tick them off separately. Students who "revise chapter 2" as one lump usually re-read 2.1 four times (it is easy and pleasant) and run out of time on 2.3 (which is the only part the exam actually counts).</p>`,
        `<p class="y-chinh">🎯 Cả chương gói trong ba dòng: <strong>2.1 Introduction</strong>, <strong>2.2 Positional Number Systems</strong>, <strong>2.3 Conversion</strong>. Mọi slide phía sau đều thuộc về một trong ba phần đó, và các slide phân cách ở vị trí 4, 6, 13 báo cho bạn biết lúc nào vừa vượt qua ranh giới.</p>
<ul>
<li><strong>2.1 Introduction</strong> (slide 4–5) — phần ngắn nhất. Nó chỉ dựng từ vựng: một hệ đếm quy định cách biểu diễn một con số bằng các ký hiệu phân biệt, và cùng một lượng thì có cách viết khác nhau ở các hệ khác nhau.</li>
<li><strong>2.2 Positional Number Systems</strong> (slide 6–12) — phần lý thuyết. Một công thức tổng quát, rồi chính công thức ấy được thế số bốn lần cho cơ số 10, 2, 16 và 8, rồi một bảng tổng kết. Hiểu công thức một lần thì bốn hệ kia không tốn thêm gì.</li>
<li><strong>2.3 Conversion</strong> (slide 13–21) — phần ra đề thi, và dài nhất. Cơ số bất kỳ về thập phân, thập phân về cơ số bất kỳ (phần nguyên trước, phần lẻ sau), nhị phân ↔ thập lục phân, nhị phân ↔ bát phân, và cuối cùng bát phân ↔ thập lục phân.</li>
<li><strong>Hãy đọc thứ tự này như một chuỗi phụ thuộc</strong> — không chuyển đổi được nếu chưa biết hệ theo vị trí là gì, và không hiểu được hệ theo vị trí nếu chưa chấp nhận rằng cách ghi khác với lượng. Mỗi phần là công cụ cho phần kế tiếp.</li>
<li><strong>Điểm nằm ở đâu</strong> — phần 2.1 và 2.2 đẻ ra câu hỏi định nghĩa (cơ số là gì, tập ký hiệu là gì, hệ theo vị trí là gì), mỗi câu một dòng; phần 2.3 đẻ ra câu tính, mỗi câu nhiều điểm. Hãy chia thời gian ôn theo đúng tỷ lệ đó: 2.1–2.2 hiểu một lần, 2.3 luyện đi luyện lại.</li>
<li><strong>Thứ chương này cố ý bỏ ra ngoài</strong> — số âm, số thực dấu phẩy động, và ký tự. Những cái đó thuộc Chương 3 (<em>Data storage</em>). Ở đây mọi số đều là lượng không dấu, có thể kèm một dấu cộng/trừ viết phía trước; chưa có gì được lưu dạng bù hai cả.</li>
</ul>
<p class="meo">💡 Chép ba đầu mục này lên đầu tờ giấy ôn và tick riêng từng cái. Sinh viên "ôn chương 2" theo kiểu một cục thường đọc lại 2.1 tới bốn lần (vì nó dễ và dễ chịu) rồi hết giờ ở 2.3 — đúng cái phần duy nhất mà đề thi tính điểm.</p>`],

      [3, 'Objectives',
        `<p class="y-chinh">🎯 Nine objectives, and they are nine exam questions in disguise. Note the shape: the first four are "describe" (recall), the next two are "distinguish/convert", and the last one — "find the number of digits needed" — is the one most students have never practised.</p>
<ul>
<li><strong>"Understand the concept of number systems"</strong> — be able to say in one sentence: a number system defines how a number can be represented using <em>distinct symbols</em>. The phrase "distinct symbols" is the examinable part.</li>
<li><strong>"Distinguish between non-positional and positional"</strong> — Roman numerals are non-positional: in <code>XXX</code> each X is worth ten no matter where it stands. Decimal is positional: in <code>333</code> the three digits are worth 300, 30 and 3. Have one example of each ready.</li>
<li><strong>"Describe the decimal / binary / hexadecimal / octal system"</strong> — four objectives, one answer template each: give the <em>base</em>, give the <em>symbol set</em>, give the <em>place values</em>, give one example. Slides 8–11 fill that template four times.</li>
<li><strong>"Convert binary/octal/hex to decimal"</strong> — one procedure for all three: multiply each symbol by its place value and add. Slides 15–16.</li>
<li><strong>"Convert decimal to binary/octal/hex"</strong> — two procedures, one for the integer part (divide repeatedly) and one for the fraction (multiply repeatedly). Slides 17–18.</li>
<li><strong>"Find the number of digits needed to represent a particular value"</strong> — this is the quiet one, and it is asked. The rule: in base b you need the smallest k with b<sup>k</sup> &gt; value; equivalently k = floor(log<sub>b</sub> value) + 1.</li>
</ul>
<p class="nhan">Worked example of the last objective — how many digits does the value 234 need?</p>
<table>
<tr><th>Base</th><th>Powers that bracket 234</th><th>Digits needed</th><th>Check</th></tr>
<tr><td>2</td><td>2<sup>7</sup> = 128 ≤ 234 &lt; 256 = 2<sup>8</sup></td><td><strong>8 bits</strong></td><td>(11101010)<sub>2</sub> = 234</td></tr>
<tr><td>8</td><td>8<sup>2</sup> = 64 ≤ 234 &lt; 512 = 8<sup>3</sup></td><td><strong>3 digits</strong></td><td>(352)<sub>8</sub> = 192+40+2 = 234</td></tr>
<tr><td>16</td><td>16<sup>1</sup> = 16 ≤ 234 &lt; 256 = 16<sup>2</sup></td><td><strong>2 digits</strong></td><td>(EA)<sub>16</sub> = 224+10 = 234</td></tr>
</table>
<p class="dap-an">✅ Answer: 8 bits, 3 octal digits, 2 hexadecimal digits. The bigger the base, the fewer symbols — that is the whole reason hexadecimal exists, and slide 10 will say it again.</p>
<p class="meo">💡 Flip the question around and it becomes the other standard exam item: <em>with k digits in base b, how many different values can I write?</em> Answer: b<sup>k</sup> values, running from 0 to b<sup>k</sup> − 1. With 8 bits that is 256 values, 0 to 255. Learn both directions of the same sentence.</p>`,
        `<p class="y-chinh">🎯 Chín mục tiêu, và chúng là chín câu hỏi thi đội lốt. Để ý hình dạng: bốn cái đầu là "mô tả" (nhớ), hai cái tiếp là "phân biệt/chuyển đổi", còn cái cuối — "tìm số chữ số cần dùng" — là cái mà phần đông sinh viên chưa từng luyện.</p>
<ul>
<li><strong>"Hiểu khái niệm hệ đếm"</strong> — nói được trong một câu: hệ đếm quy định cách biểu diễn một con số bằng những <em>ký hiệu phân biệt</em>. Cụm "ký hiệu phân biệt" chính là phần được chấm.</li>
<li><strong>"Phân biệt hệ KHÔNG theo vị trí và hệ THEO vị trí"</strong> — số La Mã là không theo vị trí: trong <code>XXX</code> mỗi chữ X đều đáng mười, đứng đâu cũng vậy. Thập phân là theo vị trí: trong <code>333</code> ba chữ số đáng 300, 30 và 3. Luôn thủ sẵn một ví dụ cho mỗi loại.</li>
<li><strong>"Mô tả hệ thập phân / nhị phân / thập lục phân / bát phân"</strong> — bốn mục tiêu, mỗi cái một khuôn trả lời giống nhau: nêu <em>cơ số</em>, nêu <em>tập ký hiệu</em>, nêu <em>trọng số từng vị trí</em>, cho một ví dụ. Slide 8–11 điền đúng cái khuôn ấy bốn lần.</li>
<li><strong>"Đổi nhị phân/bát phân/thập lục phân sang thập phân"</strong> — một quy trình dùng chung cho cả ba: nhân mỗi ký hiệu với trọng số vị trí của nó rồi cộng lại. Slide 15–16.</li>
<li><strong>"Đổi thập phân sang nhị phân/bát phân/thập lục phân"</strong> — hai quy trình, một cho phần nguyên (chia liên tiếp) và một cho phần lẻ (nhân liên tiếp). Slide 17–18.</li>
<li><strong>"Tìm số chữ số cần để biểu diễn một giá trị"</strong> — đây là mục tiêu ít ai để ý, và nó VẪN ra thi. Quy tắc: ở cơ số b, lấy k nhỏ nhất sao cho b<sup>k</sup> &gt; giá trị; tương đương k = phần nguyên của log<sub>b</sub>(giá trị) rồi cộng 1.</li>
</ul>
<p class="nhan">Làm mẫu mục tiêu cuối — giá trị 234 cần bao nhiêu chữ số?</p>
<table>
<tr><th>Cơ số</th><th>Hai luỹ thừa kẹp lấy 234</th><th>Số chữ số cần</th><th>Kiểm lại</th></tr>
<tr><td>2</td><td>2<sup>7</sup> = 128 ≤ 234 &lt; 256 = 2<sup>8</sup></td><td><strong>8 bit</strong></td><td>(11101010)<sub>2</sub> = 234</td></tr>
<tr><td>8</td><td>8<sup>2</sup> = 64 ≤ 234 &lt; 512 = 8<sup>3</sup></td><td><strong>3 chữ số</strong></td><td>(352)<sub>8</sub> = 192+40+2 = 234</td></tr>
<tr><td>16</td><td>16<sup>1</sup> = 16 ≤ 234 &lt; 256 = 16<sup>2</sup></td><td><strong>2 chữ số</strong></td><td>(EA)<sub>16</sub> = 224+10 = 234</td></tr>
</table>
<p class="dap-an">✅ Đáp án: 8 bit, 3 chữ số bát phân, 2 chữ số thập lục phân. Cơ số càng lớn thì càng ít ký hiệu — đó chính là toàn bộ lý do tồn tại của hệ thập lục phân, và slide 10 sẽ nói lại điều này.</p>
<p class="meo">💡 Lật ngược câu hỏi là ra dạng đề chuẩn còn lại: <em>với k chữ số ở cơ số b thì viết được bao nhiêu giá trị khác nhau?</em> Đáp: b<sup>k</sup> giá trị, chạy từ 0 tới b<sup>k</sup> − 1. Với 8 bit là 256 giá trị, từ 0 tới 255. Học thuộc cả hai chiều của cùng một câu.</p>`],

      [4, '1-Introduction',
        `<p class="y-chinh">🎯 A one-line divider opening section 2.1. Nothing to memorise here, so use the pause to fix the one distinction the whole chapter depends on: <strong>a quantity</strong> versus <strong>a representation of that quantity</strong>.</p>
<ul>
<li><strong>The quantity is physical</strong> — forty-two apples on a table. Count them in any language, in any century, on any planet: there are still forty-two. The quantity exists before anybody writes it down.</li>
<li><strong>The representation is a human convention</strong> — "42" is a two-character string that happens to mean that quantity under the agreement called <em>decimal</em>. Under a different agreement the same quantity is the string "101010" or the string "2A".</li>
<li><strong>Why the distinction is not pedantry</strong> — every single conversion exercise in this chapter changes the representation and leaves the quantity untouched. If you ever finish a conversion and the quantity has changed, you have made an arithmetic mistake, and that is exactly how you check your own work.</li>
<li><strong>The self-check rule, stated once for the whole chapter</strong> — after converting X from base p to base q, convert the answer back from q to p. If you do not land on X, something is wrong. It costs thirty seconds and it catches almost every exam slip.</li>
<li><strong>Vocabulary that arrives in this section</strong> — <em>number system</em> (also called <em>numeral system</em>), <em>symbol</em>, <em>base</em> (also called <em>radix</em>), and the subscript notation (2A)<sub>16</sub> that tells you which system a string is written in.</li>
<li><strong>Always write the subscript</strong> — "10" means ten in decimal, two in binary, eight in octal and sixteen in hexadecimal. Without a subscript the string 10 is meaningless. Examiners take marks for missing subscripts, and rightly so.</li>
</ul>
<p class="pitfall">⚠️ The most common beginner sentence is "convert 1010 <em>into</em> a number". A string is not a number and a number is not a string — 1010 already <em>is</em> a quantity; what you are asked to do is rewrite it in a different notation. Say "convert (1010)<sub>2</sub> to base 10", never "convert binary into a number".</p>`,
        `<p class="y-chinh">🎯 Một slide phân cách chỉ có một dòng, mở phần 2.1. Không có gì phải thuộc ở đây, nên hãy dùng khoảng nghỉ này để chốt lại cái phân biệt mà cả chương dựa vào: <strong>một lượng</strong> khác với <strong>một cách ghi lượng ấy</strong>.</p>
<ul>
<li><strong>Lượng là thứ có thật</strong> — bốn mươi hai quả táo trên bàn. Đếm bằng ngôn ngữ nào, ở thế kỷ nào, trên hành tinh nào cũng vẫn là bốn mươi hai. Lượng tồn tại trước khi có ai viết nó ra.</li>
<li><strong>Cách ghi là quy ước của con người</strong> — "42" là một chuỗi hai ký tự, tình cờ mang nghĩa lượng đó dưới một thoả thuận tên là <em>thập phân</em>. Dưới một thoả thuận khác, cùng lượng ấy là chuỗi "101010" hoặc chuỗi "2A".</li>
<li><strong>Vì sao phân biệt này không phải là bắt bẻ chữ nghĩa</strong> — mọi bài chuyển đổi trong chương đều đổi CÁCH GHI và giữ nguyên LƯỢNG. Nếu bạn làm xong một phép đổi mà lượng đã khác đi thì bạn tính sai, và đó chính là cách tự kiểm bài của bạn.</li>
<li><strong>Quy tắc tự kiểm, nói một lần cho cả chương</strong> — đổi X từ cơ số p sang cơ số q xong thì đổi ngược kết quả từ q về p. Không về đúng X nghĩa là có chỗ hỏng. Tốn ba mươi giây và bắt được gần như mọi lỗi cẩu thả trong phòng thi.</li>
<li><strong>Từ vựng xuất hiện trong phần này</strong> — <em>number system</em> (còn gọi <em>numeral system</em>, hệ đếm), <em>symbol</em> (ký hiệu), <em>base</em> (cơ số, còn gọi <em>radix</em>), và lối viết chỉ số dưới (2A)<sub>16</sub> để báo chuỗi đó được viết ở hệ nào.</li>
<li><strong>Luôn viết chỉ số dưới</strong> — "10" nghĩa là mười ở thập phân, hai ở nhị phân, tám ở bát phân và mười sáu ở thập lục phân. Không có chỉ số dưới thì chuỗi 10 vô nghĩa. Người chấm trừ điểm chỗ thiếu chỉ số, và trừ là đúng.</li>
</ul>
<p class="pitfall">⚠️ Câu nói sai phổ biến nhất của người mới là "đổi 1010 <em>thành số</em>". Chuỗi không phải số và số không phải chuỗi — 1010 tự nó ĐÃ là một lượng; việc bạn được yêu cầu làm là viết lại nó bằng một cách ghi khác. Hãy nói "đổi (1010)<sub>2</sub> sang cơ số 10", đừng bao giờ nói "đổi nhị phân thành số".</p>`],

      [5, '1- Introduction',
        `<p class="y-chinh">🎯 The definition, the consequence, and one example. <strong>A number system defines how a number can be represented using distinct symbols.</strong> A number can be represented differently in different systems — and (2A)<sub>16</sub> and (52)<sub>8</sub> both refer to the same quantity, (42)<sub>10</sub>.</p>
<ul>
<li><strong>"Using distinct symbols"</strong> — distinct means the symbols are different from one another and each has a fixed value. Base 10 has ten distinct symbols, base 2 has two, base 16 has sixteen. The count of distinct symbols <em>is</em> the base; that is not a coincidence, it is the definition.</li>
<li><strong>Figure 2.1, read from the slide image</strong> — a tree with "Number System" at the root and four children: Decimal Numbers (Base 10, 0–9), Binary Numbers (Base 2, 0 and 1), Octal Numbers (Base 8, 0–7), Hexadecimal Numbers (Base 16, 0–9 and A–F). Memorise the symbol ranges from this figure alone and you have half of slide 12's table already.</li>
<li><strong>The symbol set always starts at 0 and stops one below the base</strong> — base 8 stops at 7, not 8. The digit 8 simply does not exist in octal, the same way there is no single digit for ten in decimal. Writing (18)<sub>8</sub> is as wrong as writing a decimal number with a symbol "ten" in it.</li>
<li><strong>Verifying the slide's own example</strong> — (2A)<sub>16</sub>: the digit 2 sits in the 16<sup>1</sup> place and A means ten, so 2×16 + 10 = 42. (52)<sub>8</sub>: 5×8 + 2 = 42. Both land on 42, exactly as claimed.</li>
<li><strong>Why hexadecimal needs letters</strong> — base 16 needs sixteen distinct symbols and humanity only invented ten digit shapes, so the remaining six borrow the letters A, B, C, D, E, F for the values ten to fifteen. They are digits wearing letter costumes, nothing more.</li>
<li><strong>Same bits underneath</strong> — 42 in binary is (101010)<sub>2</sub>. Group those bits in threes from the right: 101 010 → 5, 2 → (52)<sub>8</sub>. Group them in fours from the right (pad to 00101010): 0010 1010 → 2, A → (2A)<sub>16</sub>. The slide's two representations are literally the same bit string cut up two different ways — that is the whole content of slides 19–21, glimpsed here on slide 5.</li>
</ul>
<table>
<tr><th>System</th><th>Base</th><th>Symbols</th><th>Forty-two written in it</th></tr>
<tr><td>Decimal</td><td>10</td><td>0–9</td><td>(42)<sub>10</sub></td></tr>
<tr><td>Binary</td><td>2</td><td>0, 1</td><td>(101010)<sub>2</sub></td></tr>
<tr><td>Octal</td><td>8</td><td>0–7</td><td>(52)<sub>8</sub></td></tr>
<tr><td>Hexadecimal</td><td>16</td><td>0–9, A–F</td><td>(2A)<sub>16</sub></td></tr>
</table>
<p class="dap-an">✅ All four rows verified both ways: 4×10+2 = 42 · 32+8+2 = 42 · 5×8+2 = 42 · 2×16+10 = 42. Four different strings, one quantity.</p>
<p class="pitfall">⚠️ The last bullet on the slide ends mid-sentence — <em>"This is the same as using."</em> The sentence was cut when the slide was made; in Forouzan the thought continues "…as using different words for the same object in different languages". Nothing is missing from the theory, only from the sentence.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa, hệ quả, và một ví dụ. <strong>Hệ đếm quy định cách biểu diễn một con số bằng những ký hiệu phân biệt.</strong> Một con số được biểu diễn khác nhau ở các hệ khác nhau — và (2A)<sub>16</sub> với (52)<sub>8</sub> cùng chỉ một lượng, tức (42)<sub>10</sub>.</p>
<ul>
<li><strong>"Bằng những ký hiệu phân biệt"</strong> — phân biệt nghĩa là các ký hiệu khác nhau từng cái một và mỗi cái có một giá trị cố định. Cơ số 10 có mười ký hiệu, cơ số 2 có hai, cơ số 16 có mười sáu. Số lượng ký hiệu CHÍNH LÀ cơ số; đây không phải trùng hợp, đây là định nghĩa.</li>
<li><strong>Figure 2.1, đọc thẳng từ ảnh slide</strong> — một cây có gốc "Number System" và bốn nhánh: Decimal Numbers (Base 10, 0–9), Binary Numbers (Base 2, 0 và 1), Octal Numbers (Base 8, 0–7), Hexadecimal Numbers (Base 16, 0–9 và A–F). Chỉ cần thuộc dải ký hiệu trong hình này là bạn đã nắm nửa cái bảng của slide 12.</li>
<li><strong>Tập ký hiệu luôn bắt đầu từ 0 và dừng ở dưới cơ số một đơn vị</strong> — cơ số 8 dừng ở 7, không có 8. Chữ số 8 đơn giản là KHÔNG TỒN TẠI trong bát phân, y như trong thập phân không có một chữ số riêng cho "mười". Viết (18)<sub>8</sub> sai y hệt như viết một số thập phân có ký hiệu "mười" trong đó.</li>
<li><strong>Kiểm lại chính ví dụ của slide</strong> — (2A)<sub>16</sub>: chữ số 2 nằm ở vị trí 16<sup>1</sup>, còn A nghĩa là mười, nên 2×16 + 10 = 42. (52)<sub>8</sub>: 5×8 + 2 = 42. Cả hai cùng ra 42, đúng như slide nói.</li>
<li><strong>Vì sao thập lục phân phải mượn chữ cái</strong> — cơ số 16 cần mười sáu ký hiệu phân biệt mà loài người chỉ nghĩ ra mười hình chữ số, nên sáu cái còn lại mượn các chữ A, B, C, D, E, F cho các giá trị mười tới mười lăm. Chúng là chữ số mặc áo chữ cái, chỉ vậy thôi.</li>
<li><strong>Bên dưới vẫn là những bit ấy</strong> — 42 ở nhị phân là (101010)<sub>2</sub>. Gom bit thành nhóm 3 từ PHẢI sang: 101 010 → 5, 2 → (52)<sub>8</sub>. Gom thành nhóm 4 từ phải sang (đệm thành 00101010): 0010 1010 → 2, A → (2A)<sub>16</sub>. Hai cách viết trên slide đúng nghĩa đen là một chuỗi bit bị cắt theo hai kiểu — đó là toàn bộ nội dung slide 19–21, thoáng thấy ngay từ slide 5.</li>
</ul>
<table>
<tr><th>Hệ</th><th>Cơ số</th><th>Ký hiệu</th><th>Bốn mươi hai viết ra</th></tr>
<tr><td>Thập phân</td><td>10</td><td>0–9</td><td>(42)<sub>10</sub></td></tr>
<tr><td>Nhị phân</td><td>2</td><td>0, 1</td><td>(101010)<sub>2</sub></td></tr>
<tr><td>Bát phân</td><td>8</td><td>0–7</td><td>(52)<sub>8</sub></td></tr>
<tr><td>Thập lục phân</td><td>16</td><td>0–9, A–F</td><td>(2A)<sub>16</sub></td></tr>
</table>
<p class="dap-an">✅ Cả bốn hàng đã kiểm hai chiều: 4×10+2 = 42 · 32+8+2 = 42 · 5×8+2 = 42 · 2×16+10 = 42. Bốn chuỗi khác nhau, một lượng duy nhất.</p>
<p class="pitfall">⚠️ Gạch đầu dòng cuối của slide đứt giữa câu — <em>"This is the same as using."</em> Câu bị cắt lúc làm slide; trong sách Forouzan ý ấy chạy tiếp là "…giống như dùng những từ khác nhau cho cùng một vật ở các ngôn ngữ khác nhau". Lý thuyết không mất gì, chỉ mất nửa câu văn.</p>`],

      [6, '2 - Positional Number Systems',
        `<p class="y-chinh">🎯 Divider for section 2.2, and the moment to name the thing the section is <em>not</em> about: <strong>non-positional</strong> systems, where a symbol is worth the same wherever it stands.</p>
<ul>
<li><strong>Non-positional, the classic example</strong> — Roman numerals. In <code>XXXI</code> every X is worth ten and the I is worth one, so the value is 31 no matter how you shuffle the Xs. Position carries almost no information; value comes from adding the symbols up.</li>
<li><strong>Positional, the contrast</strong> — in (333)<sub>10</sub> the three identical symbols are worth 300, 30 and 3. Same symbol, three different values, because of <em>where</em> it sits. That is the definition the next slide states formally.</li>
<li><strong>Why positional systems won</strong> — arithmetic. Try multiplying MCMXCIV by XLII on paper. Now try 1994 × 42. Long multiplication, long division and carrying only work because each column has a fixed weight, and columns line up.</li>
<li><strong>Why the computer cares</strong> — a positional system in base 2 means the hardware only needs an adder for one column plus a carry wire to the next column. Chapter 4 of the book builds exactly that circuit. A non-positional system has no columns, so there is nothing to build.</li>
<li><strong>The zero is what makes it work</strong> — positional notation needs a symbol meaning "this column is empty", otherwise 305 and 35 look alike. Roman numerals have no zero, which is a big part of why they are non-positional.</li>
<li><strong>What section 2.2 will do</strong> — state one general formula (slide 7), then instantiate it for base 10 (slide 8), base 2 (slide 9), base 16 (slide 10) and base 8 (slide 11), and summarise in a table (slide 12). Four systems, one idea.</li>
</ul>
<p class="meo">💡 Exam-ready one-liner: <em>"In a non-positional system a symbol's value is fixed; in a positional system a symbol's value is its face value multiplied by the weight of the position it occupies."</em> Learn it word for word — it answers objective 2 of slide 3 completely.</p>`,
        `<p class="y-chinh">🎯 Slide phân cách cho phần 2.2, và là lúc gọi tên cái mà phần này <em>không</em> nói tới: hệ <strong>KHÔNG theo vị trí</strong>, nơi một ký hiệu đứng đâu cũng đáng như nhau.</p>
<ul>
<li><strong>Không theo vị trí, ví dụ kinh điển</strong> — số La Mã. Trong <code>XXXI</code> mỗi chữ X đáng mười và chữ I đáng một, nên giá trị là 31 dù bạn xáo các chữ X thế nào. Vị trí gần như không mang thông tin; giá trị có được bằng cách cộng các ký hiệu lại.</li>
<li><strong>Theo vị trí, chỗ tương phản</strong> — trong (333)<sub>10</sub> ba ký hiệu giống hệt nhau lại đáng 300, 30 và 3. Cùng một ký hiệu, ba giá trị khác nhau, chỉ vì nó đứng ở ĐÂU. Đó là định nghĩa mà slide sau phát biểu một cách hình thức.</li>
<li><strong>Vì sao hệ theo vị trí thắng</strong> — vì phép tính. Thử nhân MCMXCIV với XLII trên giấy. Rồi thử 1994 × 42. Nhân dài, chia dài và phép nhớ chỉ chạy được vì mỗi cột có một trọng số cố định, và các cột thẳng hàng với nhau.</li>
<li><strong>Vì sao máy tính quan tâm</strong> — hệ theo vị trí ở cơ số 2 nghĩa là phần cứng chỉ cần một bộ cộng cho một cột cộng thêm một dây nhớ sang cột kế. Chương 4 của sách dựng đúng mạch đó. Hệ không theo vị trí thì không có cột nào cả, nên chẳng có gì để dựng.</li>
<li><strong>Chính số 0 làm cho nó chạy được</strong> — ký pháp theo vị trí cần một ký hiệu nghĩa là "cột này rỗng", nếu không thì 305 và 35 trông giống nhau. Số La Mã không có số 0, và đó là một phần lớn lý do nó không theo vị trí.</li>
<li><strong>Phần 2.2 sẽ làm gì</strong> — phát biểu một công thức tổng quát (slide 7), rồi thế số cho cơ số 10 (slide 8), cơ số 2 (slide 9), cơ số 16 (slide 10) và cơ số 8 (slide 11), rồi tổng kết vào bảng (slide 12). Bốn hệ, một ý tưởng.</li>
</ul>
<p class="meo">💡 Câu trả lời thi sẵn sàng: <em>"Ở hệ không theo vị trí, giá trị của một ký hiệu là cố định; ở hệ theo vị trí, giá trị của một ký hiệu bằng giá trị mặt của nó nhân với trọng số của vị trí nó đứng."</em> Học thuộc từng chữ — nó trả lời trọn vẹn mục tiêu số 2 ở slide 3.</p>`],

      [7, 'Introduction (positional number systems)',
        `<p class="y-chinh">🎯 The master formula of the whole chapter, in two boxed lines. A number is written as <code>± (S<sub>k−1</sub> … S<sub>2</sub> S<sub>1</sub> S<sub>0</sub> . S<sub>−1</sub> S<sub>−2</sub> … S<sub>−L</sub>)<sub>b</sub></code> and its value is <code>n = ± (S<sub>k−1</sub>×b<sup>k−1</sup> + … + S<sub>1</sub>×b<sup>1</sup> + S<sub>0</sub>×b<sup>0</sup> + S<sub>−1</sub>×b<sup>−1</sup> + S<sub>−2</sub>×b<sup>−2</sup> + … + S<sub>−L</sub>×b<sup>−L</sup>)</code>.</p>
<ul>
<li><strong>Decode every letter once and you never have to again</strong> — <em>S</em> is a symbol taken from the system's symbol set; <em>b</em> is the base (also called the radix); <em>k</em> is how many symbols sit to the left of the point; <em>L</em> is how many sit to the right. The subscript on each S is not a name, it is <em>the exponent that position carries</em>.</li>
<li><strong>The rightmost integer position is S<sub>0</sub>, not S<sub>1</sub></strong> — that is why the leftmost is S<sub>k−1</sub> and not S<sub>k</sub>. Counting positions from zero is the single most common slip in exam answers, and it costs you a whole power of the base.</li>
<li><strong>The exponents just count off from the point</strong> — walk left from the point and they go 0, 1, 2, 3…; walk right and they go −1, −2, −3…. There is no exponent for the point itself; the point is only a marker for where the counting starts.</li>
<li><strong>The formula is base-agnostic</strong> — nothing in it says 10, or 2, or 16. Put b = 10 and you get the decimal system of slide 8; put b = 2 and you get slide 9; b = 16 gives slide 10; b = 8 gives slide 11. Four slides, one equation with a different letter substituted.</li>
<li><strong>The ± is the sign, and it lives outside the parentheses</strong> — the chapter treats sign as a separate mark written in front, not as part of the digit string. How a computer actually stores a negative number (sign-and-magnitude, one's complement, two's complement) is Chapter 3's business, not this one's.</li>
<li><strong>Read the formula as an instruction, because that is what it is</strong> — "for each symbol, multiply it by the base raised to that position's exponent, then add everything up". That sentence <em>is</em> the any-base-to-decimal procedure of slide 15. The theory slide and the conversion slide are the same slide, written twice.</li>
</ul>
<p class="nhan">The formula unrolled on a concrete number, (1101.01)<sub>2</sub>:</p>
<table>
<tr><th>Symbol</th><td>1</td><td>1</td><td>0</td><td>1</td><td>.</td><td>0</td><td>1</td></tr>
<tr><th>Position</th><td>S<sub>3</sub></td><td>S<sub>2</sub></td><td>S<sub>1</sub></td><td>S<sub>0</sub></td><td>—</td><td>S<sub>−1</sub></td><td>S<sub>−2</sub></td></tr>
<tr><th>Place value</th><td>2<sup>3</sup> = 8</td><td>2<sup>2</sup> = 4</td><td>2<sup>1</sup> = 2</td><td>2<sup>0</sup> = 1</td><td>—</td><td>2<sup>−1</sup> = 0.5</td><td>2<sup>−2</sup> = 0.25</td></tr>
<tr><th>Product</th><td>8</td><td>4</td><td>0</td><td>1</td><td>—</td><td>0</td><td>0.25</td></tr>
</table>
<p class="dap-an">✅ Sum: 8 + 4 + 0 + 1 + 0 + 0.25 = <strong>13.25</strong>, so (1101.01)<sub>2</sub> = (13.25)<sub>10</sub>. Checked backwards: 13 = 8+4+1 = 1101, and 0.25 = 2<sup>−2</sup> = .01 — back to the number we started from.</p>
<p class="pitfall">⚠️ The slide's text renders the equals signs as the digit 5 — you will read <em>"b 5 10"</em> and <em>"S 5 {0, 1}"</em> on slides 8 to 11. That is a font problem in the original PowerPoint, not a formula: read every stray "5" between a letter and a set or a number as "=". Do not memorise "b 5 2" as if 5 meant something.</p>`,
        `<p class="y-chinh">🎯 Công thức gốc của cả chương, nằm trong hai khung đỏ. Một số được viết là <code>± (S<sub>k−1</sub> … S<sub>2</sub> S<sub>1</sub> S<sub>0</sub> . S<sub>−1</sub> S<sub>−2</sub> … S<sub>−L</sub>)<sub>b</sub></code> và giá trị của nó là <code>n = ± (S<sub>k−1</sub>×b<sup>k−1</sup> + … + S<sub>1</sub>×b<sup>1</sup> + S<sub>0</sub>×b<sup>0</sup> + S<sub>−1</sub>×b<sup>−1</sup> + S<sub>−2</sub>×b<sup>−2</sup> + … + S<sub>−L</sub>×b<sup>−L</sup>)</code>.</p>
<ul>
<li><strong>Giải mã từng chữ một lần rồi khỏi phải làm lại</strong> — <em>S</em> là một ký hiệu lấy từ tập ký hiệu của hệ; <em>b</em> là cơ số (base, còn gọi radix); <em>k</em> là số ký hiệu nằm bên TRÁI dấu phẩy; <em>L</em> là số ký hiệu nằm bên PHẢI. Chỉ số dưới của mỗi S không phải cái tên, nó CHÍNH LÀ số mũ mà vị trí đó mang.</li>
<li><strong>Vị trí nguyên ngoài cùng bên phải là S<sub>0</sub>, không phải S<sub>1</sub></strong> — chính vì thế ngoài cùng bên trái mới là S<sub>k−1</sub> chứ không phải S<sub>k</sub>. Đếm vị trí từ 0 là chỗ trượt tay phổ biến nhất trong bài thi, và trượt một cái là lệch nguyên một luỹ thừa của cơ số.</li>
<li><strong>Số mũ chỉ đơn giản đếm ra từ dấu phẩy</strong> — đi sang trái thì 0, 1, 2, 3…; đi sang phải thì −1, −2, −3…. Không có số mũ nào cho chính dấu phẩy; dấu phẩy chỉ là cái mốc đánh dấu chỗ bắt đầu đếm.</li>
<li><strong>Công thức không phụ thuộc cơ số</strong> — trong nó chẳng có chỗ nào ghi 10, hay 2, hay 16. Thay b = 10 ra hệ thập phân của slide 8; thay b = 2 ra slide 9; b = 16 ra slide 10; b = 8 ra slide 11. Bốn slide, một phương trình chỉ đổi một chữ.</li>
<li><strong>Dấu ± là dấu âm dương, và nó nằm NGOÀI dấu ngoặc</strong> — chương này coi dấu là một ký hiệu riêng viết phía trước, không phải một phần của chuỗi chữ số. Chuyện máy tính thật sự lưu số âm ra sao (dấu-độ lớn, bù một, bù hai) là việc của Chương 3, không phải chương này.</li>
<li><strong>Hãy đọc công thức như một MỆNH LỆNH, vì nó đúng là mệnh lệnh</strong> — "với mỗi ký hiệu, nhân nó với cơ số luỹ thừa số mũ của vị trí ấy, rồi cộng tất cả lại". Câu đó CHÍNH LÀ quy trình đổi-cơ-số-bất-kỳ-về-thập-phân của slide 15. Slide lý thuyết và slide chuyển đổi là cùng một slide viết hai lần.</li>
</ul>
<p class="nhan">Trải công thức ra trên một số cụ thể, (1101.01)<sub>2</sub>:</p>
<table>
<tr><th>Ký hiệu</th><td>1</td><td>1</td><td>0</td><td>1</td><td>,</td><td>0</td><td>1</td></tr>
<tr><th>Vị trí</th><td>S<sub>3</sub></td><td>S<sub>2</sub></td><td>S<sub>1</sub></td><td>S<sub>0</sub></td><td>—</td><td>S<sub>−1</sub></td><td>S<sub>−2</sub></td></tr>
<tr><th>Trọng số</th><td>2<sup>3</sup> = 8</td><td>2<sup>2</sup> = 4</td><td>2<sup>1</sup> = 2</td><td>2<sup>0</sup> = 1</td><td>—</td><td>2<sup>−1</sup> = 0,5</td><td>2<sup>−2</sup> = 0,25</td></tr>
<tr><th>Tích</th><td>8</td><td>4</td><td>0</td><td>1</td><td>—</td><td>0</td><td>0,25</td></tr>
</table>
<p class="dap-an">✅ Cộng lại: 8 + 4 + 0 + 1 + 0 + 0,25 = <strong>13,25</strong>, tức (1101.01)<sub>2</sub> = (13,25)<sub>10</sub>. Kiểm ngược: 13 = 8+4+1 = 1101, và 0,25 = 2<sup>−2</sup> = .01 — quay về đúng con số ban đầu.</p>
<p class="pitfall">⚠️ Phần chữ của slide in dấu bằng thành chữ số 5 — bạn sẽ đọc thấy <em>"b 5 10"</em> và <em>"S 5 {0, 1}"</em> ở slide 8 tới 11. Đó là lỗi FONT của file PowerPoint gốc chứ không phải công thức: mọi chữ "5" lạc giữa một chữ cái và một tập hợp hay một con số đều phải đọc là "=". Đừng học thuộc "b 5 2" như thể số 5 có nghĩa gì.</p>`],

      [8, 'The decimal system (base 10)',
        `<p class="y-chinh">🎯 The general formula with b = 10 plugged in. Base ten, ten symbols S = {0,1,2,3,4,5,6,7,8,9} called <strong>decimal digits</strong>, and a number written <code>± (S<sub>k−1</sub> … S<sub>1</sub> S<sub>0</sub> . S<sub>−1</sub> … S<sub>−L</sub>)<sub>10</sub></code>.</p>
<ul>
<li><strong>Why start with the system you already know</strong> — because you already run the algorithm perfectly and have never noticed. Making the familiar case explicit is what lets you transplant it to base 2 without re-learning anything.</li>
<li><strong>The etymology is examinable</strong> — <em>decimal</em> from the Latin root <em>decem</em> = ten. Slides 9, 10 and 11 each give the same kind of root (<em>bini</em>, <em>hex</em>+<em>decem</em>, <em>octo</em>), and short-answer questions do ask for them.</li>
<li><strong>Ten symbols, not ten values per position</strong> — careful with the wording. Each position holds one of ten symbols; the <em>value</em> that position contributes is the symbol multiplied by a power of ten, so it can be far larger than nine.</li>
<li><strong>The place values you have used since primary school</strong> — …1000, 100, 10, 1 . 0.1, 0.01, 0.001… Those are 10<sup>3</sup>, 10<sup>2</sup>, 10<sup>1</sup>, 10<sup>0</sup>, 10<sup>−1</sup>, 10<sup>−2</sup>, 10<sup>−3</sup>. Writing them as powers is the only new thing on this slide.</li>
<li><strong>Base 10 is a biological accident</strong> — ten fingers. There is nothing mathematically special about it; the Babylonians used base 60 and we still buy their minutes and degrees. This is worth saying out loud, because students often feel base 2 is "unnatural" — it is exactly as arbitrary as base 10, only better suited to a switch.</li>
<li><strong>What the formula makes visible</strong> — that (2345.56)<sub>10</sub>, the example of slide 12's table, means 2×10<sup>3</sup> + 3×10<sup>2</sup> + 4×10<sup>1</sup> + 5×10<sup>0</sup> + 5×10<sup>−1</sup> + 6×10<sup>−2</sup>. You have been evaluating that sum in your head since you were six.</li>
</ul>
<table>
<tr><th>Symbol</th><td>2</td><td>3</td><td>4</td><td>5</td><td>.</td><td>5</td><td>6</td></tr>
<tr><th>Place value</th><td>10<sup>3</sup> = 1000</td><td>10<sup>2</sup> = 100</td><td>10<sup>1</sup> = 10</td><td>10<sup>0</sup> = 1</td><td>—</td><td>10<sup>−1</sup> = 0.1</td><td>10<sup>−2</sup> = 0.01</td></tr>
<tr><th>Product</th><td>2000</td><td>300</td><td>40</td><td>5</td><td>—</td><td>0.5</td><td>0.06</td></tr>
</table>
<p class="dap-an">✅ 2000 + 300 + 40 + 5 + 0.5 + 0.06 = <strong>2345.56</strong> — the sum reproduces the number it came from, which is the sanity check that the place-value table has been filled in correctly.</p>
<p class="meo">💡 Rehearse the procedure <em>here</em>, where you can spot your own mistakes instantly, before you take it to base 2 where you cannot. Any time a binary conversion feels confusing, redo the identical steps on a decimal number first; the confusion is almost always about positions, not about bits.</p>`,
        `<p class="y-chinh">🎯 Công thức tổng quát với b = 10 thế vào. Cơ số mười, mười ký hiệu S = {0,1,2,3,4,5,6,7,8,9} gọi là <strong>chữ số thập phân</strong>, và một số được viết <code>± (S<sub>k−1</sub> … S<sub>1</sub> S<sub>0</sub> . S<sub>−1</sub> … S<sub>−L</sub>)<sub>10</sub></code>.</p>
<ul>
<li><strong>Vì sao bắt đầu bằng hệ bạn đã biết</strong> — vì bạn đã chạy đúng thuật toán này từ lâu mà chưa bao giờ để ý. Nói huỵch toẹt trường hợp quen thuộc ra chính là thứ cho phép bạn bê nguyên nó sang cơ số 2 mà không phải học lại gì.</li>
<li><strong>Từ nguyên cũng ra thi</strong> — <em>decimal</em> từ gốc Latin <em>decem</em> = mười. Slide 9, 10 và 11 mỗi cái đều cho một gốc từ kiểu này (<em>bini</em>, <em>hex</em>+<em>decem</em>, <em>octo</em>), và câu hỏi trả lời ngắn CÓ hỏi tới.</li>
<li><strong>Mười KÝ HIỆU, không phải mười giá trị mỗi vị trí</strong> — để ý câu chữ. Mỗi vị trí chứa một trong mười ký hiệu; còn <em>giá trị</em> mà vị trí đó đóng góp là ký hiệu nhân với một luỹ thừa của mười, nên nó lớn hơn chín rất nhiều.</li>
<li><strong>Các trọng số bạn đã dùng từ hồi tiểu học</strong> — …1000, 100, 10, 1 . 0,1 · 0,01 · 0,001… Chúng là 10<sup>3</sup>, 10<sup>2</sup>, 10<sup>1</sup>, 10<sup>0</sup>, 10<sup>−1</sup>, 10<sup>−2</sup>, 10<sup>−3</sup>. Viết chúng dưới dạng luỹ thừa là điều duy nhất mới mẻ trên slide này.</li>
<li><strong>Cơ số 10 là một tai nạn sinh học</strong> — mười ngón tay. Về mặt toán học nó chẳng có gì đặc biệt; người Babylon dùng cơ số 60 và tới giờ ta vẫn mua lại phút với độ của họ. Điều này đáng nói to, vì sinh viên hay cảm thấy cơ số 2 "không tự nhiên" — nó tuỳ tiện y hệt cơ số 10, chỉ hợp với cái công tắc hơn thôi.</li>
<li><strong>Công thức làm lộ ra điều gì</strong> — rằng (2345.56)<sub>10</sub>, chính ví dụ trong bảng của slide 12, nghĩa là 2×10<sup>3</sup> + 3×10<sup>2</sup> + 4×10<sup>1</sup> + 5×10<sup>0</sup> + 5×10<sup>−1</sup> + 6×10<sup>−2</sup>. Bạn đã tính nhẩm tổng đó từ năm sáu tuổi.</li>
</ul>
<table>
<tr><th>Ký hiệu</th><td>2</td><td>3</td><td>4</td><td>5</td><td>,</td><td>5</td><td>6</td></tr>
<tr><th>Trọng số</th><td>10<sup>3</sup> = 1000</td><td>10<sup>2</sup> = 100</td><td>10<sup>1</sup> = 10</td><td>10<sup>0</sup> = 1</td><td>—</td><td>10<sup>−1</sup> = 0,1</td><td>10<sup>−2</sup> = 0,01</td></tr>
<tr><th>Tích</th><td>2000</td><td>300</td><td>40</td><td>5</td><td>—</td><td>0,5</td><td>0,06</td></tr>
</table>
<p class="dap-an">✅ 2000 + 300 + 40 + 5 + 0,5 + 0,06 = <strong>2345,56</strong> — tổng dựng lại đúng con số ban đầu, đó là phép kiểm rằng bảng trọng số đã điền chuẩn.</p>
<p class="meo">💡 Hãy tập quy trình NGAY Ở ĐÂY, nơi bạn phát hiện lỗi của mình tức thì, trước khi mang nó sang cơ số 2 nơi bạn không phát hiện được. Bất cứ lúc nào một phép đổi nhị phân thấy rối, hãy làm lại đúng các bước ấy trên một số thập phân trước; cái rối gần như luôn là chuyện VỊ TRÍ chứ không phải chuyện bit.</p>`],

      [9, 'The binary system (base 2)',
        `<p class="y-chinh">🎯 Base 2, two symbols S = {0, 1}, and a new word: each symbol is a <strong>bit</strong> (binary digit). The slide's closing line is the one that matters for the rest of the degree — <em>data and programs are stored in the computer using binary patterns, a string of bits</em>.</p>
<ul>
<li><strong>Etymology</strong> — <em>binary</em> from the Latin root <em>bini</em>, "two by two". Two symbols, so the base is 2, so the place values are powers of two.</li>
<li><strong>Why the machine insists on two</strong> — a circuit stores a value as a voltage. Distinguishing "high" from "low" is easy and survives noise; distinguishing ten voltage levels reliably, billions of times a second, for years, is not. Two states is the most robust alphabet physics offers cheaply, which is why base 2 is not a design preference but an engineering consequence.</li>
<li><strong>The place values to memorise</strong> — going left from the point: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024. Going right: 0.5, 0.25, 0.125, 0.0625. Knowing these by heart is the difference between a thirty-second conversion and a three-minute one.</li>
<li><strong>Binary numbers get long fast</strong> — the value 686 needs 10 bits, (1010101110)<sub>2</sub>. That length is precisely the problem slide 10 opens with, and the reason hexadecimal and octal were invented.</li>
<li><strong>The word "bit" is doing double duty</strong> — it means both "one binary symbol" and "the unit in which we measure storage". Eight bits is a byte; Chapter 3 builds everything else out of that.</li>
<li><strong>Example 2.1 on the slide</strong> — (101.11)<sub>2</sub> = 5.75 in decimal, with the boxed table showing the place values 2<sup>2</sup>, 2<sup>1</sup>, 2<sup>0</sup>, 2<sup>−1</sup>, 2<sup>−2</sup> above the digits 1, 0, 1, 1, 1.</li>
</ul>
<p class="nhan">Example 2.1 worked out one position at a time:</p>
<table>
<tr><th>Bit</th><td>1</td><td>0</td><td>1</td><td>.</td><td>1</td><td>1</td></tr>
<tr><th>Place value</th><td>2<sup>2</sup> = 4</td><td>2<sup>1</sup> = 2</td><td>2<sup>0</sup> = 1</td><td>—</td><td>2<sup>−1</sup> = 0.5</td><td>2<sup>−2</sup> = 0.25</td></tr>
<tr><th>Bit × place</th><td>1×4 = 4</td><td>0×2 = 0</td><td>1×1 = 1</td><td>—</td><td>1×0.5 = 0.5</td><td>1×0.25 = 0.25</td></tr>
</table>
<p class="dap-an">✅ 4 + 0 + 1 + 0.5 + 0.25 = <strong>5.75</strong>, matching the slide. Checked backwards: 5 = 4+1 = 101, and 0.75 = 0.5+0.25 = .11 → (101.11)<sub>2</sub>. Both directions agree.</p>
<p class="nhan">The weights ruler — write this line at the top of your exam paper before you start:</p>
<pre><code>1024  512  256  128   64   32   16    8    4    2    1  .  0.5  0.25  0.125  0.0625
 2^10 2^9  2^8  2^7  2^6  2^5  2^4  2^3  2^2  2^1  2^0    2^-1  2^-2   2^-3    2^-4</code></pre>
<p class="nhan">Practice — binary to decimal (cover the answers and do them first):</p>
<ul>
<li><strong>(110101)<sub>2</sub></strong> — weights 32, 16, 8, 4, 2, 1 under the bits 1,1,0,1,0,1 → 32 + 16 + 0 + 4 + 0 + 1.</li>
<li><strong>(10011011)<sub>2</sub></strong> — weights 128, 64, 32, 16, 8, 4, 2, 1 under 1,0,0,1,1,0,1,1 → 128 + 16 + 8 + 2 + 1.</li>
<li><strong>(1111)<sub>2</sub></strong> — 8 + 4 + 2 + 1.</li>
<li><strong>(100000)<sub>2</sub></strong> — one bit set, in the 2<sup>5</sup> position.</li>
<li><strong>(1010101110)<sub>2</sub></strong> — 512 + 128 + 32 + 8 + 4 + 2.</li>
</ul>
<p class="dap-an">✅ Answers: 53 · 155 · 15 · 32 · 686. All five verified by converting back: 53 = 110101, 155 = 10011011, 15 = 1111, 32 = 100000, 686 = 1010101110. Note the last one — it is the same 686 that slides 10 and 11 write as (2AE)<sub>16</sub> and (1256)<sub>8</sub>.</p>
<p class="meo">💡 Shortcut worth having: a binary number made of n ones, like (1111)<sub>2</sub>, is always 2<sup>n</sup> − 1. Four ones = 16 − 1 = 15; eight ones = 256 − 1 = 255. That is also why an 8-bit unsigned range stops at 255.</p>`,
        `<p class="y-chinh">🎯 Cơ số 2, hai ký hiệu S = {0, 1}, và một từ mới: mỗi ký hiệu là một <strong>bit</strong> (binary digit). Câu chốt của slide mới là câu quan trọng cho suốt phần còn lại của ngành học — <em>dữ liệu và chương trình được lưu trong máy dưới dạng mẫu nhị phân, một chuỗi bit</em>.</p>
<ul>
<li><strong>Từ nguyên</strong> — <em>binary</em> từ gốc Latin <em>bini</em>, "hai một cặp". Hai ký hiệu nên cơ số là 2, nên trọng số các vị trí là luỹ thừa của hai.</li>
<li><strong>Vì sao máy khăng khăng dùng hai</strong> — một mạch điện lưu giá trị bằng điện áp. Phân biệt "cao" với "thấp" thì dễ và chịu được nhiễu; còn phân biệt cho chắc mười mức điện áp, hàng tỷ lần mỗi giây, suốt nhiều năm, thì không. Hai trạng thái là bộ chữ cái bền nhất mà vật lý bán rẻ, nên cơ số 2 không phải một sở thích thiết kế mà là một hệ quả kỹ thuật.</li>
<li><strong>Bảng trọng số phải thuộc lòng</strong> — đi sang trái từ dấu phẩy: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024. Đi sang phải: 0,5 · 0,25 · 0,125 · 0,0625. Thuộc mấy con số này là khác biệt giữa một phép đổi ba mươi giây và một phép đổi ba phút.</li>
<li><strong>Số nhị phân dài ra rất nhanh</strong> — giá trị 686 cần tới 10 bit, (1010101110)<sub>2</sub>. Chính cái độ dài ấy là vấn đề mà slide 10 mở đầu, và là lý do người ta đẻ ra thập lục phân với bát phân.</li>
<li><strong>Chữ "bit" gánh hai nghĩa</strong> — vừa là "một ký hiệu nhị phân", vừa là "đơn vị đo dung lượng". Tám bit là một byte; Chương 3 dựng mọi thứ còn lại từ đó.</li>
<li><strong>Example 2.1 trên slide</strong> — (101.11)<sub>2</sub> = 5,75 ở thập phân, với khung đỏ hiện các trọng số 2<sup>2</sup>, 2<sup>1</sup>, 2<sup>0</sup>, 2<sup>−1</sup>, 2<sup>−2</sup> đặt trên các chữ số 1, 0, 1, 1, 1.</li>
</ul>
<p class="nhan">Giải Example 2.1 từng vị trí một:</p>
<table>
<tr><th>Bit</th><td>1</td><td>0</td><td>1</td><td>,</td><td>1</td><td>1</td></tr>
<tr><th>Trọng số</th><td>2<sup>2</sup> = 4</td><td>2<sup>1</sup> = 2</td><td>2<sup>0</sup> = 1</td><td>—</td><td>2<sup>−1</sup> = 0,5</td><td>2<sup>−2</sup> = 0,25</td></tr>
<tr><th>Bit × trọng số</th><td>1×4 = 4</td><td>0×2 = 0</td><td>1×1 = 1</td><td>—</td><td>1×0,5 = 0,5</td><td>1×0,25 = 0,25</td></tr>
</table>
<p class="dap-an">✅ 4 + 0 + 1 + 0,5 + 0,25 = <strong>5,75</strong>, khớp với slide. Kiểm ngược: 5 = 4+1 = 101, và 0,75 = 0,5+0,25 = .11 → (101.11)<sub>2</sub>. Hai chiều khớp nhau.</p>
<p class="nhan">Cây thước trọng số — hãy viết dòng này lên đầu tờ giấy thi trước khi bắt đầu:</p>
<pre><code>1024  512  256  128   64   32   16    8    4    2    1  ,  0,5  0,25  0,125  0,0625
 2^10 2^9  2^8  2^7  2^6  2^5  2^4  2^3  2^2  2^1  2^0    2^-1  2^-2   2^-3    2^-4</code></pre>
<p class="nhan">Bài luyện — nhị phân sang thập phân (che đáp án và làm trước):</p>
<ul>
<li><strong>(110101)<sub>2</sub></strong> — đặt trọng số 32, 16, 8, 4, 2, 1 dưới các bit 1,1,0,1,0,1 → 32 + 16 + 0 + 4 + 0 + 1.</li>
<li><strong>(10011011)<sub>2</sub></strong> — trọng số 128, 64, 32, 16, 8, 4, 2, 1 dưới 1,0,0,1,1,0,1,1 → 128 + 16 + 8 + 2 + 1.</li>
<li><strong>(1111)<sub>2</sub></strong> — 8 + 4 + 2 + 1.</li>
<li><strong>(100000)<sub>2</sub></strong> — chỉ một bit bật, ở vị trí 2<sup>5</sup>.</li>
<li><strong>(1010101110)<sub>2</sub></strong> — 512 + 128 + 32 + 8 + 4 + 2.</li>
</ul>
<p class="dap-an">✅ Đáp án: 53 · 155 · 15 · 32 · 686. Cả năm đã kiểm bằng cách đổi ngược: 53 = 110101, 155 = 10011011, 15 = 1111, 32 = 100000, 686 = 1010101110. Để ý cái cuối — đó đúng là con số 686 mà slide 10 và 11 viết thành (2AE)<sub>16</sub> và (1256)<sub>8</sub>.</p>
<p class="meo">💡 Một mẹo nên có: số nhị phân gồm n chữ số 1, như (1111)<sub>2</sub>, luôn bằng 2<sup>n</sup> − 1. Bốn số 1 = 16 − 1 = 15; tám số 1 = 256 − 1 = 255. Đó cũng là lý do dải không dấu 8 bit dừng ở 255.</p>`],

      [10, 'The hexadecimal system (base 16)',
        `<p class="y-chinh">🎯 The slide opens with the <strong>problem</strong>, not the system: decimal does not show what is stored in the computer, because there is no obvious relationship between a count of bits and a count of decimal digits. Hexadecimal and octal were devised to fix exactly that.</p>
<ul>
<li><strong>State the problem precisely</strong> — 8 bits do not correspond to a whole number of decimal digits. 8 bits give 256 values, which is more than 2 decimal digits (100) and less than 3 (1000). So you cannot look at a decimal number and see the bit pattern, nor chop a decimal number into bit-sized pieces.</li>
<li><strong>Why 16 fixes it</strong> — 16 = 2<sup>4</sup>. One hexadecimal symbol therefore covers exactly four bits, with no remainder and no ambiguity, forever. Eight bits = exactly two hex digits. 32 bits = exactly eight hex digits. That clean division is the entire justification for the system.</li>
<li><strong>Etymology, and the slide's own joke</strong> — <em>hexadecimal</em> from Greek <em>hex</em> (six) plus Latin <em>decem</em> (ten). The slide notes that to be consistent it should have been <em>sexadecimal</em>, from the Latin <em>sex</em> and <em>decem</em>. Mixing a Greek root with a Latin one is a linguistic crime the industry committed and kept.</li>
<li><strong>Sixteen symbols</strong> — S = {0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F}, where A = 10, B = 11, C = 12, D = 13, E = 14, F = 15. These letters are values, not names: in a calculation you substitute the number and never carry the letter along.</li>
<li><strong>"More common" is not an opinion</strong> — memory addresses, colour codes (#FF8800), MAC addresses, machine-code dumps and Unicode code points (U+00E9) are all written in hex, because all of them are really bit patterns whose length is a multiple of four.</li>
<li><strong>Example 2.2 on the slide</strong> — (2AE)<sub>16</sub> = 686 in decimal, with the boxed table showing place values 16<sup>2</sup>, 16<sup>1</sup>, 16<sup>0</sup> over the symbols 2, A, E and the products 2×16<sup>2</sup>, 10×16<sup>1</sup>, 14×16<sup>0</sup>.</li>
</ul>
<p class="nhan">Example 2.2, step by step:</p>
<table>
<tr><th>Symbol</th><td>2</td><td>A</td><td>E</td></tr>
<tr><th>Value of the symbol</th><td>2</td><td>10</td><td>14</td></tr>
<tr><th>Place value</th><td>16<sup>2</sup> = 256</td><td>16<sup>1</sup> = 16</td><td>16<sup>0</sup> = 1</td></tr>
<tr><th>Product</th><td>2 × 256 = 512</td><td>10 × 16 = 160</td><td>14 × 1 = 14</td></tr>
</table>
<p class="dap-an">✅ 512 + 160 + 14 = <strong>686</strong>, exactly as the slide claims. Checked backwards by repeated division: 686 ÷ 16 = 42 remainder 14 (E); 42 ÷ 16 = 2 remainder 10 (A); 2 ÷ 16 = 0 remainder 2 → reading the remainders upwards gives 2, A, E.</p>
<p class="nhan">The table that halves your exam time — learn all sixteen rows cold:</p>
<table>
<tr><th>Hex</th><th>Bits</th><th>Dec</th><th>Hex</th><th>Bits</th><th>Dec</th></tr>
<tr><td>0</td><td>0000</td><td>0</td><td>8</td><td>1000</td><td>8</td></tr>
<tr><td>1</td><td>0001</td><td>1</td><td>9</td><td>1001</td><td>9</td></tr>
<tr><td>2</td><td>0010</td><td>2</td><td>A</td><td>1010</td><td>10</td></tr>
<tr><td>3</td><td>0011</td><td>3</td><td>B</td><td>1011</td><td>11</td></tr>
<tr><td>4</td><td>0100</td><td>4</td><td>C</td><td>1100</td><td>12</td></tr>
<tr><td>5</td><td>0101</td><td>5</td><td>D</td><td>1101</td><td>13</td></tr>
<tr><td>6</td><td>0110</td><td>6</td><td>E</td><td>1110</td><td>14</td></tr>
<tr><td>7</td><td>0111</td><td>7</td><td>F</td><td>1111</td><td>15</td></tr>
</table>
<p class="meo">💡 You do not have to memorise the table as sixteen facts. Each 4-bit row is just 8-4-2-1: C = 1100 = 8+4 = 12, B = 1011 = 8+2+1 = 11. Reconstructing a row takes two seconds, and after a week of doing that you will have memorised it without trying.</p>
<p class="pitfall">⚠️ The letters are case-insensitive (2ae = 2AE) but the symbol set stops at F. There is no G, no H, and no such thing as (2G)<sub>16</sub> — a hex string containing a letter beyond F is not a number at all, it is a typo.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu bằng <strong>vấn đề</strong> chứ không phải bằng hệ đếm: thập phân KHÔNG cho thấy thứ đang nằm trong máy, vì không có liên hệ hiển nhiên nào giữa số lượng bit và số lượng chữ số thập phân. Thập lục phân và bát phân sinh ra để vá đúng chỗ đó.</p>
<ul>
<li><strong>Nói cho chính xác vấn đề là gì</strong> — 8 bit không ứng với một số nguyên chữ số thập phân. 8 bit cho 256 giá trị, nhiều hơn 2 chữ số thập phân (100) và ít hơn 3 chữ số (1000). Nên bạn không nhìn một số thập phân mà thấy được mẫu bit, cũng không chặt một số thập phân thành từng khúc vừa cỡ bit được.</li>
<li><strong>Vì sao 16 vá được</strong> — 16 = 2<sup>4</sup>. Thế nên một ký hiệu thập lục phân phủ đúng bốn bit, không dư, không nhập nhằng, vĩnh viễn. Tám bit = đúng hai chữ số hex. 32 bit = đúng tám chữ số hex. Phép chia hết gọn gàng ấy là toàn bộ lý do tồn tại của hệ này.</li>
<li><strong>Từ nguyên, và câu đùa của chính slide</strong> — <em>hexadecimal</em> từ gốc Hy Lạp <em>hex</em> (sáu) cộng gốc Latin <em>decem</em> (mười). Slide ghi chú rằng cho nhất quán thì đáng lẽ phải gọi là <em>sexadecimal</em>, từ hai gốc Latin <em>sex</em> và <em>decem</em>. Trộn gốc Hy Lạp với gốc Latin là một tội ngôn ngữ mà ngành máy tính đã trót phạm rồi giữ luôn.</li>
<li><strong>Mười sáu ký hiệu</strong> — S = {0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F}, trong đó A = 10, B = 11, C = 12, D = 13, E = 14, F = 15. Các chữ cái này là GIÁ TRỊ chứ không phải cái tên: vào phép tính là phải thay bằng con số, không bao giờ vác chữ cái đi theo.</li>
<li><strong>"Phổ biến hơn" không phải là ý kiến chủ quan</strong> — địa chỉ bộ nhớ, mã màu (#FF8800), địa chỉ MAC, bản đổ mã máy và điểm mã Unicode (U+00E9) đều viết bằng hex, vì tất cả chúng thực chất là mẫu bit có độ dài là bội của bốn.</li>
<li><strong>Example 2.2 trên slide</strong> — (2AE)<sub>16</sub> = 686 ở thập phân, với khung đỏ hiện trọng số 16<sup>2</sup>, 16<sup>1</sup>, 16<sup>0</sup> trên các ký hiệu 2, A, E và các tích 2×16<sup>2</sup>, 10×16<sup>1</sup>, 14×16<sup>0</sup>.</li>
</ul>
<p class="nhan">Example 2.2, từng bước:</p>
<table>
<tr><th>Ký hiệu</th><td>2</td><td>A</td><td>E</td></tr>
<tr><th>Giá trị của ký hiệu</th><td>2</td><td>10</td><td>14</td></tr>
<tr><th>Trọng số</th><td>16<sup>2</sup> = 256</td><td>16<sup>1</sup> = 16</td><td>16<sup>0</sup> = 1</td></tr>
<tr><th>Tích</th><td>2 × 256 = 512</td><td>10 × 16 = 160</td><td>14 × 1 = 14</td></tr>
</table>
<p class="dap-an">✅ 512 + 160 + 14 = <strong>686</strong>, đúng như slide nói. Kiểm ngược bằng chia liên tiếp: 686 ÷ 16 = 42 dư 14 (E); 42 ÷ 16 = 2 dư 10 (A); 2 ÷ 16 = 0 dư 2 → đọc các số dư từ dưới lên được 2, A, E.</p>
<p class="nhan">Cái bảng làm giảm nửa thời gian làm bài — học thuộc cả mười sáu dòng:</p>
<table>
<tr><th>Hex</th><th>Bit</th><th>Thập phân</th><th>Hex</th><th>Bit</th><th>Thập phân</th></tr>
<tr><td>0</td><td>0000</td><td>0</td><td>8</td><td>1000</td><td>8</td></tr>
<tr><td>1</td><td>0001</td><td>1</td><td>9</td><td>1001</td><td>9</td></tr>
<tr><td>2</td><td>0010</td><td>2</td><td>A</td><td>1010</td><td>10</td></tr>
<tr><td>3</td><td>0011</td><td>3</td><td>B</td><td>1011</td><td>11</td></tr>
<tr><td>4</td><td>0100</td><td>4</td><td>C</td><td>1100</td><td>12</td></tr>
<tr><td>5</td><td>0101</td><td>5</td><td>D</td><td>1101</td><td>13</td></tr>
<tr><td>6</td><td>0110</td><td>6</td><td>E</td><td>1110</td><td>14</td></tr>
<tr><td>7</td><td>0111</td><td>7</td><td>F</td><td>1111</td><td>15</td></tr>
</table>
<p class="meo">💡 Không cần học bảng này như mười sáu sự kiện rời. Mỗi dòng 4 bit chỉ là 8-4-2-1: C = 1100 = 8+4 = 12, B = 1011 = 8+2+1 = 11. Dựng lại một dòng mất hai giây, và sau một tuần làm vậy bạn thuộc lúc nào không hay.</p>
<p class="pitfall">⚠️ Chữ cái không phân biệt hoa thường (2ae = 2AE) nhưng tập ký hiệu DỪNG ở F. Không có G, không có H, và không tồn tại thứ gọi là (2G)<sub>16</sub> — một chuỗi hex chứa chữ cái quá F thì không phải con số, nó là lỗi gõ.</p>`],

      [11, 'The octal system (base 8)',
        `<p class="y-chinh">🎯 The second shorthand for binary: base 8, eight symbols S = {0,1,2,3,4,5,6,7}, called <strong>octal digits</strong>. Since 8 = 2<sup>3</sup>, one octal digit stands for exactly three bits.</p>
<ul>
<li><strong>Etymology</strong> — <em>octal</em> from the Latin root <em>octo</em> (eight). Same pattern as the previous three slides: root word, base, symbol set, example.</li>
<li><strong>Same motivation as hexadecimal, different chunk size</strong> — the slide says it plainly: octal was devised "to show the equivalent of the binary system outside the computer". Hex packs 4 bits per symbol, octal packs 3. Both are readable; neither loses information.</li>
<li><strong>The symbol set stops at 7</strong> — there is no 8 and no 9 in octal. If you ever write down an octal answer containing an 8, you have made a mistake in the division, every single time.</li>
<li><strong>Where you still meet it</strong> — Unix file permissions, <code>chmod 755</code>. Each digit is three bits: read-write-execute. 7 = 111 = rwx, 5 = 101 = r-x. That is the clearest living example of "one octal digit = three bits" you will ever see.</li>
<li><strong>Why hexadecimal mostly won</strong> — machine word sizes are 8, 16, 32 and 64 bits, all divisible by 4 but not by 3. Hex therefore lines up with byte boundaries and octal does not: one byte is two clean hex digits, but two and two-thirds octal digits.</li>
<li><strong>Example 2.3 on the slide</strong> — (1256)<sub>8</sub> = 686 in decimal, with the boxed table showing place values 8<sup>3</sup>, 8<sup>2</sup>, 8<sup>1</sup>, 8<sup>0</sup> over the digits 1, 2, 5, 6.</li>
</ul>
<p class="nhan">Example 2.3, step by step:</p>
<table>
<tr><th>Digit</th><td>1</td><td>2</td><td>5</td><td>6</td></tr>
<tr><th>Place value</th><td>8<sup>3</sup> = 512</td><td>8<sup>2</sup> = 64</td><td>8<sup>1</sup> = 8</td><td>8<sup>0</sup> = 1</td></tr>
<tr><th>Product</th><td>1 × 512 = 512</td><td>2 × 64 = 128</td><td>5 × 8 = 40</td><td>6 × 1 = 6</td></tr>
</table>
<p class="dap-an">✅ 512 + 128 + 40 + 6 = <strong>686</strong>, as the slide says. And it is the <em>same</em> 686 as slide 10's (2AE)<sub>16</sub> — deliberately, so you can see one quantity in three notations at once.</p>
<p class="nhan">The three-way view of 686, which is the single most useful thing on these two slides:</p>
<table>
<tr><th>Notation</th><th>Value</th><th>Built from the bits how</th></tr>
<tr><td>Binary</td><td>(1010101110)<sub>2</sub></td><td>the raw bit string</td></tr>
<tr><td>Octal</td><td>(1256)<sub>8</sub></td><td>001 010 101 110 → 1, 2, 5, 6</td></tr>
<tr><td>Hexadecimal</td><td>(2AE)<sub>16</sub></td><td>0010 1010 1110 → 2, A, E</td></tr>
<tr><td>Decimal</td><td>686</td><td>512+128+32+8+4+2</td></tr>
</table>
<p class="dap-an">✅ Verified: grouping (1010101110)<sub>2</sub> in threes from the right, after padding one zero on the left, gives 001·010·101·110 = 1256<sub>8</sub>; grouping in fours, after padding two zeros, gives 0010·1010·1110 = 2AE<sub>16</sub>. Slides 19 and 20 will turn this observation into a formal procedure.</p>
<p class="pitfall">⚠️ Octal has a nasty real-world trap: in C, Java and JavaScript a numeric literal starting with 0 is read as octal, so <code>012</code> means ten, not twelve. That is why a date written <code>{13, 08, 2025}</code> refuses to compile — "invalid digit 8 in octal constant". Keep it in mind when you write dates and IP-style numbers in code.</p>`,
        `<p class="y-chinh">🎯 Lối viết tắt thứ hai cho nhị phân: cơ số 8, tám ký hiệu S = {0,1,2,3,4,5,6,7}, gọi là <strong>chữ số bát phân</strong>. Vì 8 = 2<sup>3</sup> nên một chữ số bát phân đứng thay cho đúng ba bit.</p>
<ul>
<li><strong>Từ nguyên</strong> — <em>octal</em> từ gốc Latin <em>octo</em> (tám). Vẫn khuôn cũ của ba slide trước: gốc từ, cơ số, tập ký hiệu, ví dụ.</li>
<li><strong>Cùng động cơ với thập lục phân, chỉ khác cỡ khúc</strong> — slide nói thẳng: bát phân được đẻ ra "để trình bày tương đương của hệ nhị phân ở BÊN NGOÀI máy tính". Hex gói 4 bit một ký hiệu, octal gói 3. Cả hai đều đọc được; không cái nào làm mất thông tin.</li>
<li><strong>Tập ký hiệu dừng ở 7</strong> — trong bát phân không có 8 và không có 9. Nếu bạn viết ra một đáp án bát phân có chữ số 8 thì bạn đã chia sai, không trừ lần nào.</li>
<li><strong>Chỗ bạn vẫn còn gặp nó</strong> — quyền tệp Unix, <code>chmod 755</code>. Mỗi chữ số là ba bit: đọc-ghi-chạy. 7 = 111 = rwx, 5 = 101 = r-x. Đó là ví dụ sống động nhất cho câu "một chữ số bát phân = ba bit" mà bạn sẽ thấy.</li>
<li><strong>Vì sao thập lục phân phần lớn đã thắng</strong> — độ dài từ máy là 8, 16, 32 và 64 bit, đều chia hết cho 4 nhưng không chia hết cho 3. Nên hex khớp với ranh giới byte còn octal thì không: một byte là đúng hai chữ số hex, nhưng lại là hai chữ số bát phân và hai phần ba.</li>
<li><strong>Example 2.3 trên slide</strong> — (1256)<sub>8</sub> = 686 ở thập phân, với khung hiện trọng số 8<sup>3</sup>, 8<sup>2</sup>, 8<sup>1</sup>, 8<sup>0</sup> trên các chữ số 1, 2, 5, 6.</li>
</ul>
<p class="nhan">Example 2.3, từng bước:</p>
<table>
<tr><th>Chữ số</th><td>1</td><td>2</td><td>5</td><td>6</td></tr>
<tr><th>Trọng số</th><td>8<sup>3</sup> = 512</td><td>8<sup>2</sup> = 64</td><td>8<sup>1</sup> = 8</td><td>8<sup>0</sup> = 1</td></tr>
<tr><th>Tích</th><td>1 × 512 = 512</td><td>2 × 64 = 128</td><td>5 × 8 = 40</td><td>6 × 1 = 6</td></tr>
</table>
<p class="dap-an">✅ 512 + 128 + 40 + 6 = <strong>686</strong>, đúng như slide. Và nó là CÙNG con số 686 với (2AE)<sub>16</sub> ở slide 10 — cố ý như vậy, để bạn nhìn thấy một lượng trong ba cách ghi cùng lúc.</p>
<p class="nhan">Góc nhìn ba đường của 686, thứ hữu ích nhất trong hai slide này:</p>
<table>
<tr><th>Cách ghi</th><th>Giá trị</th><th>Dựng từ bit ra sao</th></tr>
<tr><td>Nhị phân</td><td>(1010101110)<sub>2</sub></td><td>chuỗi bit gốc</td></tr>
<tr><td>Bát phân</td><td>(1256)<sub>8</sub></td><td>001 010 101 110 → 1, 2, 5, 6</td></tr>
<tr><td>Thập lục phân</td><td>(2AE)<sub>16</sub></td><td>0010 1010 1110 → 2, A, E</td></tr>
<tr><td>Thập phân</td><td>686</td><td>512+128+32+8+4+2</td></tr>
</table>
<p class="dap-an">✅ Đã kiểm: gom (1010101110)<sub>2</sub> thành nhóm 3 từ phải sang, sau khi đệm một số 0 bên trái, được 001·010·101·110 = 1256<sub>8</sub>; gom thành nhóm 4, sau khi đệm hai số 0, được 0010·1010·1110 = 2AE<sub>16</sub>. Slide 19 và 20 sẽ biến nhận xét này thành một quy trình chính thức.</p>
<p class="pitfall">⚠️ Bát phân có một cái bẫy đời thật khá ác: trong C, Java và JavaScript, một hằng số bắt đầu bằng chữ số 0 bị đọc là bát phân, nên <code>012</code> nghĩa là mười chứ không phải mười hai. Đó là lý do một ngày tháng viết <code>{13, 08, 2025}</code> không chịu biên dịch — "invalid digit 8 in octal constant". Nhớ điều này khi gõ ngày tháng hay các con số kiểu địa chỉ IP trong mã.</p>`],

      [12, 'Summary of the four positional systems',
        `<p class="y-chinh">🎯 Table 2.1: the four systems side by side, with base, symbol set and one example each. This is the single slide to photograph before the exam — everything in section 2.2 is compressed into four rows.</p>
<ul>
<li><strong>Row 1 — Decimal, base 10</strong>, symbols 0–9, example <code>2345.56</code>. Notice it is written without a subscript, because decimal is the default assumption; every other row carries its subscript.</li>
<li><strong>Row 2 — Binary, base 2</strong>, symbols 0 and 1, example <code>(1001.11)<sub>2</sub></code>. Evaluate it: 8 + 0 + 0 + 1 + 0.5 + 0.25 = <strong>9.75</strong>.</li>
<li><strong>Row 3 — Octal, base 8</strong>, symbols 0–7, example <code>(156.23)<sub>8</sub></code>. Evaluate: 64 + 40 + 6 + 2/8 + 3/64 = 110 + 0.25 + 0.046875 = <strong>110.296875</strong>.</li>
<li><strong>Row 4 — Hexadecimal, base 16</strong>, symbols 0–9 and A–F, example <code>(A2C.A1)<sub>16</sub></code>. Evaluate: 10×256 + 2×16 + 12 + 10/16 + 1/256 = 2604 + 0.625 + 0.00390625 = <strong>2604.62890625</strong>.</li>
<li><strong>The pattern the table makes obvious</strong> — the number of symbols always equals the base, and the symbols always run from 0 up to base − 1. That is not four separate facts, it is one rule applied four times.</li>
<li><strong>Every example has a fractional part on purpose</strong> — the table is warning you that these systems are not restricted to whole numbers. Slide 18 is where fractions get their own conversion procedure, and it is the part students skip and then lose marks on.</li>
</ul>
<p class="nhan">The table, extended with the two columns the exam actually needs:</p>
<table>
<tr><th>System</th><th>Base</th><th>Symbols</th><th>Slide's example</th><th>Its decimal value</th><th>Bits per symbol</th></tr>
<tr><td>Decimal</td><td>10</td><td>0 … 9</td><td>2345.56</td><td>2345.56</td><td>— (not a power of 2)</td></tr>
<tr><td>Binary</td><td>2</td><td>0, 1</td><td>(1001.11)<sub>2</sub></td><td>9.75</td><td>1</td></tr>
<tr><td>Octal</td><td>8</td><td>0 … 7</td><td>(156.23)<sub>8</sub></td><td>110.296875</td><td>3 (8 = 2<sup>3</sup>)</td></tr>
<tr><td>Hexadecimal</td><td>16</td><td>0 … 9, A … F</td><td>(A2C.A1)<sub>16</sub></td><td>2604.62890625</td><td>4 (16 = 2<sup>4</sup>)</td></tr>
</table>
<p class="dap-an">✅ All three non-decimal values computed with exact fractions and checked in both directions. The last column explains the whole chapter in one line: 8 and 16 are powers of 2 so their conversions to binary are pure regrouping, while 10 is not, so decimal conversions need real arithmetic.</p>
<p class="nhan">The other table worth owning — how much you can count to with k digits:</p>
<table>
<tr><th>k bits</th><th>Distinct values 2<sup>k</sup></th><th>Unsigned range</th><th>Same width in hex</th></tr>
<tr><td>1</td><td>2</td><td>0 … 1</td><td>—</td></tr>
<tr><td>4</td><td>16</td><td>0 … 15</td><td>1 digit</td></tr>
<tr><td>8</td><td>256</td><td>0 … 255</td><td>2 digits</td></tr>
<tr><td>10</td><td>1024</td><td>0 … 1023</td><td>—</td></tr>
<tr><td>16</td><td>65 536</td><td>0 … 65 535</td><td>4 digits</td></tr>
<tr><td>32</td><td>4 294 967 296</td><td>0 … 4 294 967 295</td><td>8 digits</td></tr>
</table>
<p class="pitfall">⚠️ The classic off-by-one: k bits give 2<sup>k</sup> <em>values</em>, and the largest of them is 2<sup>k</sup> − 1, not 2<sup>k</sup>. Eight bits reach 255, not 256. If an exam answer says "8 bits can store up to 256", it is wrong by exactly one, and that is the mark being tested.</p>`,
        `<p class="y-chinh">🎯 Table 2.1: bốn hệ đặt cạnh nhau, kèm cơ số, tập ký hiệu và mỗi hệ một ví dụ. Đây là slide duy nhất nên chụp lại trước khi thi — toàn bộ phần 2.2 được nén vào bốn dòng.</p>
<ul>
<li><strong>Dòng 1 — Thập phân, cơ số 10</strong>, ký hiệu 0–9, ví dụ <code>2345.56</code>. Để ý nó viết KHÔNG kèm chỉ số dưới, vì thập phân là mặc định; mọi dòng còn lại đều mang chỉ số của mình.</li>
<li><strong>Dòng 2 — Nhị phân, cơ số 2</strong>, ký hiệu 0 và 1, ví dụ <code>(1001.11)<sub>2</sub></code>. Tính thử: 8 + 0 + 0 + 1 + 0,5 + 0,25 = <strong>9,75</strong>.</li>
<li><strong>Dòng 3 — Bát phân, cơ số 8</strong>, ký hiệu 0–7, ví dụ <code>(156.23)<sub>8</sub></code>. Tính: 64 + 40 + 6 + 2/8 + 3/64 = 110 + 0,25 + 0,046875 = <strong>110,296875</strong>.</li>
<li><strong>Dòng 4 — Thập lục phân, cơ số 16</strong>, ký hiệu 0–9 và A–F, ví dụ <code>(A2C.A1)<sub>16</sub></code>. Tính: 10×256 + 2×16 + 12 + 10/16 + 1/256 = 2604 + 0,625 + 0,00390625 = <strong>2604,62890625</strong>.</li>
<li><strong>Quy luật mà cái bảng phơi ra</strong> — số lượng ký hiệu luôn bằng cơ số, và các ký hiệu luôn chạy từ 0 tới cơ số − 1. Đây không phải bốn sự kiện riêng lẻ, đây là một quy tắc áp bốn lần.</li>
<li><strong>Mọi ví dụ đều có phần lẻ, và đó là cố ý</strong> — bảng đang cảnh báo rằng các hệ này không giới hạn ở số nguyên. Slide 18 là chỗ phần lẻ có quy trình đổi riêng, và đó cũng là phần sinh viên hay bỏ qua rồi mất điểm.</li>
</ul>
<p class="nhan">Chính cái bảng đó, thêm hai cột mà đề thi thật sự cần:</p>
<table>
<tr><th>Hệ</th><th>Cơ số</th><th>Ký hiệu</th><th>Ví dụ của slide</th><th>Giá trị thập phân</th><th>Bit mỗi ký hiệu</th></tr>
<tr><td>Thập phân</td><td>10</td><td>0 … 9</td><td>2345.56</td><td>2345,56</td><td>— (không phải luỹ thừa của 2)</td></tr>
<tr><td>Nhị phân</td><td>2</td><td>0, 1</td><td>(1001.11)<sub>2</sub></td><td>9,75</td><td>1</td></tr>
<tr><td>Bát phân</td><td>8</td><td>0 … 7</td><td>(156.23)<sub>8</sub></td><td>110,296875</td><td>3 (8 = 2<sup>3</sup>)</td></tr>
<tr><td>Thập lục phân</td><td>16</td><td>0 … 9, A … F</td><td>(A2C.A1)<sub>16</sub></td><td>2604,62890625</td><td>4 (16 = 2<sup>4</sup>)</td></tr>
</table>
<p class="dap-an">✅ Cả ba giá trị ngoài thập phân đều tính bằng phân số đúng và kiểm hai chiều. Cột cuối giải thích cả chương trong một dòng: 8 và 16 là luỹ thừa của 2 nên đổi sang nhị phân chỉ là GOM LẠI, còn 10 thì không, nên đổi thập phân phải tính thật.</p>
<p class="nhan">Cái bảng thứ hai nên thuộc — k chữ số thì đếm được tới đâu:</p>
<table>
<tr><th>k bit</th><th>Số giá trị 2<sup>k</sup></th><th>Dải không dấu</th><th>Cùng độ rộng ở hex</th></tr>
<tr><td>1</td><td>2</td><td>0 … 1</td><td>—</td></tr>
<tr><td>4</td><td>16</td><td>0 … 15</td><td>1 chữ số</td></tr>
<tr><td>8</td><td>256</td><td>0 … 255</td><td>2 chữ số</td></tr>
<tr><td>10</td><td>1024</td><td>0 … 1023</td><td>—</td></tr>
<tr><td>16</td><td>65 536</td><td>0 … 65 535</td><td>4 chữ số</td></tr>
<tr><td>32</td><td>4 294 967 296</td><td>0 … 4 294 967 295</td><td>8 chữ số</td></tr>
</table>
<p class="pitfall">⚠️ Lỗi lệch một kinh điển: k bit cho 2<sup>k</sup> <em>giá trị</em>, và giá trị LỚN NHẤT trong đó là 2<sup>k</sup> − 1 chứ không phải 2<sup>k</sup>. Tám bit lên tới 255, không phải 256. Bài thi trả lời "8 bit lưu được tới 256" là sai đúng một đơn vị, và đó chính là điểm mà câu hỏi đang kiểm.</p>`],

      [13, '3 - Conversion',
        `<p class="y-chinh">🎯 Divider for section 2.3, the part that gets examined. From here to slide 21 there is nothing to understand and everything to <em>practise</em>: four procedures, each a short loop, each needing muscle memory rather than insight.</p>
<ul>
<li><strong>Procedure A — any base to decimal</strong> (slides 15–16): multiply each symbol by its place value and add. One loop, works for base 2, 8, 16 and anything else.</li>
<li><strong>Procedure B — decimal to any base, integer part</strong> (slide 17): divide by the base repeatedly, collect the remainders, read them <em>bottom to top</em>.</li>
<li><strong>Procedure C — decimal to any base, fractional part</strong> (slide 18): multiply by the base repeatedly, collect the integer parts, read them <em>top to bottom</em>. Note it is the mirror image of B in every respect, including the reading direction.</li>
<li><strong>Procedure D — binary to/from octal or hexadecimal</strong> (slides 19–21): no arithmetic at all, just group the bits in threes or fours. This is the cheap one, and the one to reach for whenever both bases are powers of two.</li>
<li><strong>Choosing the route matters</strong> — to convert (2AE)<sub>16</sub> to octal, do <em>not</em> go via decimal. Go hex → binary (D) → octal (D): two regroupings, no arithmetic, no chance of an error. Going through decimal costs two multiplications and a long division for no reason.</li>
<li><strong>The habit that saves you in the exam</strong> — always convert your answer back. Every procedure here has an inverse listed above it, so verification costs one extra minute and turns a guess into a certainty.</li>
</ul>
<table>
<tr><th>You have</th><th>You want</th><th>Use</th><th>Cost</th></tr>
<tr><td>base 2 / 8 / 16</td><td>decimal</td><td>A — weights and sum</td><td>one multiply per symbol</td></tr>
<tr><td>decimal, integer</td><td>base 2 / 8 / 16</td><td>B — divide repeatedly</td><td>one division per output digit</td></tr>
<tr><td>decimal, fraction</td><td>base 2 / 8 / 16</td><td>C — multiply repeatedly</td><td>one multiply per output digit</td></tr>
<tr><td>base 2</td><td>base 8 or 16</td><td>D — group 3 or 4 bits</td><td>no arithmetic</td></tr>
<tr><td>base 8</td><td>base 16 (or back)</td><td>D twice, via binary</td><td>no arithmetic</td></tr>
</table>
<p class="meo">💡 Write this five-row table on your revision card instead of five separate procedures. In an exam the hard part is usually not doing a conversion, it is picking the cheapest route before you start — and the wrong route is where the time goes.</p>`,
        `<p class="y-chinh">🎯 Slide phân cách cho phần 2.3, phần ra đề thi. Từ đây tới slide 21 không có gì để hiểu và mọi thứ để <em>luyện</em>: bốn quy trình, mỗi cái là một vòng lặp ngắn, cần trí nhớ cơ bắp chứ không cần giác ngộ.</p>
<ul>
<li><strong>Quy trình A — cơ số bất kỳ về thập phân</strong> (slide 15–16): nhân mỗi ký hiệu với trọng số vị trí rồi cộng. Một vòng lặp, chạy được cho cơ số 2, 8, 16 và mọi cơ số khác.</li>
<li><strong>Quy trình B — thập phân sang cơ số bất kỳ, phần nguyên</strong> (slide 17): chia liên tiếp cho cơ số, nhặt các số dư, đọc chúng từ <em>DƯỚI LÊN</em>.</li>
<li><strong>Quy trình C — thập phân sang cơ số bất kỳ, phần lẻ</strong> (slide 18): nhân liên tiếp với cơ số, nhặt các phần nguyên, đọc chúng từ <em>TRÊN XUỐNG</em>. Để ý nó là ảnh gương của B ở mọi điểm, kể cả chiều đọc.</li>
<li><strong>Quy trình D — nhị phân ↔ bát phân hoặc thập lục phân</strong> (slide 19–21): không tính toán gì cả, chỉ gom bit thành nhóm ba hoặc bốn. Đây là quy trình rẻ nhất, và là thứ phải với tay lấy mỗi khi cả hai cơ số đều là luỹ thừa của hai.</li>
<li><strong>Chọn đường đi có ý nghĩa</strong> — muốn đổi (2AE)<sub>16</sub> sang bát phân thì <em>đừng</em> vòng qua thập phân. Hãy đi hex → nhị phân (D) → bát phân (D): hai lần gom nhóm, không phép tính nào, không có chỗ để sai. Vòng qua thập phân tốn hai phép nhân và một phép chia dài mà chẳng được gì.</li>
<li><strong>Thói quen cứu bạn trong phòng thi</strong> — luôn đổi ngược đáp án lại. Mọi quy trình ở đây đều có quy trình nghịch nằm ngay trên/dưới nó, nên kiểm lại tốn thêm một phút và biến một phỏng đoán thành một điều chắc chắn.</li>
</ul>
<table>
<tr><th>Đang có</th><th>Muốn ra</th><th>Dùng</th><th>Giá phải trả</th></tr>
<tr><td>cơ số 2 / 8 / 16</td><td>thập phân</td><td>A — trọng số rồi cộng</td><td>một phép nhân mỗi ký hiệu</td></tr>
<tr><td>thập phân, phần nguyên</td><td>cơ số 2 / 8 / 16</td><td>B — chia liên tiếp</td><td>một phép chia mỗi chữ số ra</td></tr>
<tr><td>thập phân, phần lẻ</td><td>cơ số 2 / 8 / 16</td><td>C — nhân liên tiếp</td><td>một phép nhân mỗi chữ số ra</td></tr>
<tr><td>cơ số 2</td><td>cơ số 8 hoặc 16</td><td>D — gom 3 hoặc 4 bit</td><td>không tính toán</td></tr>
<tr><td>cơ số 8</td><td>cơ số 16 (và ngược lại)</td><td>D hai lần, đi vòng qua nhị phân</td><td>không tính toán</td></tr>
</table>
<p class="meo">💡 Hãy chép cái bảng năm dòng này vào thẻ ôn thi thay vì chép năm quy trình rời. Trong phòng thi, phần khó thường không phải là làm phép đổi, mà là chọn đường rẻ nhất TRƯỚC KHI bắt đầu — và đường sai chính là chỗ thời gian bốc hơi.</p>`],

      [14, 'Introduction (conversion)',
        `<p class="y-chinh">🎯 The plan for section 2.3, in three steps, ordered by dependency: <strong>first</strong> any base to decimal, <strong>then</strong> decimal to any base, <strong>finally</strong> the easy shortcuts between binary and hexadecimal or octal.</p>
<ul>
<li><strong>Why decimal sits in the middle</strong> — the slide gives the honest reason: "the decimal system is more familiar than the other systems". Decimal is used as a hub not because it is mathematically privileged but because your intuition lives there and you can sanity-check a decimal number at a glance.</li>
<li><strong>Step 1, any base → decimal</strong> — this is just the positional formula of slide 7 evaluated. You already know it; slide 15 only draws it as a picture.</li>
<li><strong>Step 2, decimal → any base</strong> — genuinely new, and it splits in two because integers and fractions behave differently. Slide 17 does the integer part, slide 18 the fraction.</li>
<li><strong>Step 3, binary ↔ hex/octal</strong> — the shortcut. The slide says "easily", and it means it: there is no arithmetic, and it is the only conversion you can do accurately while half asleep.</li>
<li><strong>Combining steps gives you every pair</strong> — hex → octal is step 3 backwards then step 3 forwards. Octal → decimal is step 1. Decimal → hex is step 2. With three steps you can get from any of the four systems to any other.</li>
<li><strong>A warning about the hub</strong> — using decimal as a stopover is correct but often wasteful. Between two power-of-two bases, going through decimal is the slow road; the direct bit regrouping of step 3 is always better.</li>
</ul>
<table>
<tr><th>Conversion</th><th>Best route</th><th>Slide</th></tr>
<tr><td>binary → decimal</td><td>step 1 directly</td><td>15, 16</td></tr>
<tr><td>decimal → binary</td><td>step 2 (divide / multiply)</td><td>17, 18</td></tr>
<tr><td>binary → hex</td><td>step 3, group 4 bits</td><td>19</td></tr>
<tr><td>binary → octal</td><td>step 3, group 3 bits</td><td>20</td></tr>
<tr><td>hex → octal</td><td>hex → binary → octal</td><td>21</td></tr>
<tr><td>hex → decimal</td><td>step 1 directly (do <em>not</em> go via binary)</td><td>16</td></tr>
</table>
<p class="pitfall">⚠️ The slide's second bullet stops mid-sentence: <em>"Since the decimal system is more familiar than the other systems,"</em> — the main clause is missing. Forouzan finishes it as "…we first show how to convert from any base to decimal". The plan is intact; only the punctuation was lost when the slide was typed.</p>`,
        `<p class="y-chinh">🎯 Kế hoạch của phần 2.3, ba bước, xếp theo thứ tự phụ thuộc: <strong>trước hết</strong> cơ số bất kỳ về thập phân, <strong>rồi</strong> thập phân sang cơ số bất kỳ, <strong>cuối cùng</strong> là các lối tắt dễ dàng giữa nhị phân với thập lục phân hoặc bát phân.</p>
<ul>
<li><strong>Vì sao thập phân đứng ở giữa</strong> — slide nói thẳng lý do: "hệ thập phân quen thuộc hơn các hệ khác". Thập phân được dùng làm trạm trung chuyển không phải vì nó được toán học ưu ái, mà vì trực giác của bạn sống ở đó và bạn liếc một cái là biết một số thập phân có hợp lý không.</li>
<li><strong>Bước 1, cơ số bất kỳ → thập phân</strong> — chẳng qua là công thức vị trí của slide 7 đem ra tính. Bạn đã biết rồi; slide 15 chỉ vẽ nó thành hình.</li>
<li><strong>Bước 2, thập phân → cơ số bất kỳ</strong> — mới thật sự, và nó tách làm hai vì phần nguyên với phần lẻ hành xử khác nhau. Slide 17 lo phần nguyên, slide 18 lo phần lẻ.</li>
<li><strong>Bước 3, nhị phân ↔ hex/bát phân</strong> — lối tắt. Slide viết "dễ dàng", và nó nói thật: không có phép tính nào, và đây là phép đổi duy nhất bạn làm đúng được lúc đang buồn ngủ.</li>
<li><strong>Ghép các bước lại là ra mọi cặp</strong> — hex → bát phân là bước 3 đi ngược rồi bước 3 đi xuôi. Bát phân → thập phân là bước 1. Thập phân → hex là bước 2. Có ba bước là đi được từ bất kỳ hệ nào trong bốn hệ tới bất kỳ hệ nào khác.</li>
<li><strong>Một cảnh báo về cái trạm trung chuyển</strong> — dùng thập phân làm trạm dừng thì đúng nhưng thường phí. Giữa hai cơ số đều là luỹ thừa của hai, đi vòng qua thập phân là đường chậm; gom bit trực tiếp theo bước 3 luôn tốt hơn.</li>
</ul>
<table>
<tr><th>Phép đổi</th><th>Đường tốt nhất</th><th>Slide</th></tr>
<tr><td>nhị phân → thập phân</td><td>bước 1 trực tiếp</td><td>15, 16</td></tr>
<tr><td>thập phân → nhị phân</td><td>bước 2 (chia / nhân)</td><td>17, 18</td></tr>
<tr><td>nhị phân → hex</td><td>bước 3, gom 4 bit</td><td>19</td></tr>
<tr><td>nhị phân → bát phân</td><td>bước 3, gom 3 bit</td><td>20</td></tr>
<tr><td>hex → bát phân</td><td>hex → nhị phân → bát phân</td><td>21</td></tr>
<tr><td>hex → thập phân</td><td>bước 1 trực tiếp (<em>đừng</em> vòng qua nhị phân)</td><td>16</td></tr>
</table>
<p class="pitfall">⚠️ Gạch đầu dòng thứ hai của slide đứt giữa câu: <em>"Since the decimal system is more familiar than the other systems,"</em> — thiếu mất mệnh đề chính. Sách Forouzan viết tiếp là "…nên ta trình bày trước cách đổi từ cơ số bất kỳ về thập phân". Kế hoạch không mất gì, chỉ mất nửa câu lúc gõ slide.</p>`],

      [15, 'Covert from any base to decimal',
        `<p class="y-chinh">🎯 Figure 2.2 drawn as four stacked rows: the <strong>symbols</strong>, their <strong>place values</strong> (b<sup>K−1</sup> … b<sup>1</sup>, b<sup>0</sup> then b<sup>−1</sup>, b<sup>−2</sup> … b<sup>−L</sup>), the <strong>multiplications</strong>, and the two sums they collapse into — <em>Integral</em> on the left of the point and <em>Fraction</em> on the right.</p>
<ul>
<li><strong>The procedure in one sentence</strong> — write the place value under each symbol, multiply, add. That is all of "any base to decimal", for every base, forever.</li>
<li><strong>Read the figure right to left when you fill it in</strong> — start at the point and walk outwards. Leftwards the exponent goes 0, 1, 2, 3…; rightwards it goes −1, −2, −3…. Filling in from the left edge is how people end up one power out.</li>
<li><strong>Why the figure splits integral and fraction</strong> — not because the arithmetic differs (it does not; it is one sum) but because the <em>reverse</em> direction genuinely needs two different algorithms, and Figure 2.3 and 2.4 will each handle one half. The split here is foreshadowing.</li>
<li><strong>Negative exponents mean division</strong> — b<sup>−1</sup> is 1/b, b<sup>−2</sup> is 1/b<sup>2</sup>. In base 2 that is 0.5, 0.25, 0.125, 0.0625; in base 8 it is 1/8, 1/64; in base 16 it is 1/16, 1/256. The fractional columns are where marks are lost, because people multiply by 2 instead of dividing.</li>
<li><strong>The result is always exact here</strong> — going <em>to</em> decimal, any finite string in base 2, 8 or 16 has a finite exact decimal value, because 2, 8 and 16 all divide a power of 10... careful: they do not, but their negative powers are 1/2<sup>n</sup>, and 1/2<sup>n</sup> always terminates in decimal since 10 = 2 × 5. Going the other way is where infinite expansions appear (see slide 18).</li>
<li><strong>Skipping zeros is legal and fast</strong> — a symbol 0 contributes 0 to the sum no matter what its place value is, so you can leave those columns blank. In a long binary number that removes half the work.</li>
</ul>
<p class="nhan">The same figure, filled in for (1011.101)<sub>2</sub> so you can see the layout you should copy on paper:</p>
<table>
<tr><th>Binary</th><td>1</td><td>0</td><td>1</td><td>1</td><td>.</td><td>1</td><td>0</td><td>1</td></tr>
<tr><th>Place value</th><td>2<sup>3</sup> = 8</td><td>2<sup>2</sup> = 4</td><td>2<sup>1</sup> = 2</td><td>2<sup>0</sup> = 1</td><td>—</td><td>2<sup>−1</sup> = 0.5</td><td>2<sup>−2</sup> = 0.25</td><td>2<sup>−3</sup> = 0.125</td></tr>
<tr><th>Multiplication</th><td>8</td><td>0</td><td>2</td><td>1</td><td>—</td><td>0.5</td><td>0</td><td>0.125</td></tr>
<tr><th>Collapses to</th><td colspan="4">Integral = 8 + 0 + 2 + 1 = 11</td><td>—</td><td colspan="3">Fraction = 0.5 + 0 + 0.125 = 0.625</td></tr>
</table>
<p class="dap-an">✅ (1011.101)<sub>2</sub> = <strong>11.625</strong>. Checked backwards: 11 = 8+2+1 = 1011, and 0.625 = 0.5 + 0.125 = .101 — which is also the very number slide 18 converts the other way.</p>
<p class="pitfall">⚠️ The figure on this slide has a misprint: its Multiplication row reads <code>S<sub>K−1</sub>×b<sup>K−1</sup> + … + S<sub>0</sub>×b<sup>0</sup> + S<sub>0</sub>×b<sup>0</sup></code> — the term <code>S<sub>0</sub>×b<sup>0</sup></code> appears <strong>twice</strong>. Compare it with the correct formula on slide 7: the second-to-last term must be <code>S<sub>1</sub>×b<sup>1</sup></code>. Use slide 7's version; this one would double-count the units column. (Also note both slide titles here spell it "Covert" instead of "Convert".)</p>`,
        `<p class="y-chinh">🎯 Figure 2.2 được vẽ thành bốn hàng chồng lên nhau: các <strong>ký hiệu</strong>, <strong>trọng số</strong> của chúng (b<sup>K−1</sup> … b<sup>1</sup>, b<sup>0</sup> rồi b<sup>−1</sup>, b<sup>−2</sup> … b<sup>−L</sup>), các <strong>phép nhân</strong>, và hai tổng mà chúng gộp lại — <em>Integral</em> (phần nguyên) bên trái dấu phẩy và <em>Fraction</em> (phần lẻ) bên phải.</p>
<ul>
<li><strong>Quy trình trong một câu</strong> — viết trọng số dưới mỗi ký hiệu, nhân, cộng. Đó là toàn bộ chuyện "cơ số bất kỳ về thập phân", cho mọi cơ số, mãi mãi.</li>
<li><strong>Điền vào hình thì đọc từ PHẢI sang TRÁI</strong> — bắt đầu ở dấu phẩy rồi đi ra hai phía. Đi sang trái số mũ chạy 0, 1, 2, 3…; đi sang phải chạy −1, −2, −3…. Điền từ mép trái vào chính là cách người ta lệch mất một luỹ thừa.</li>
<li><strong>Vì sao hình tách phần nguyên và phần lẻ</strong> — không phải vì phép tính khác nhau (không khác; vẫn một tổng) mà vì chiều NGƯỢC LẠI thật sự cần hai thuật toán khác nhau, và Figure 2.3 với 2.4 mỗi cái sẽ lo một nửa. Chỗ tách ở đây là báo trước.</li>
<li><strong>Số mũ âm nghĩa là CHIA</strong> — b<sup>−1</sup> là 1/b, b<sup>−2</sup> là 1/b<sup>2</sup>. Ở cơ số 2 là 0,5 · 0,25 · 0,125 · 0,0625; ở cơ số 8 là 1/8, 1/64; ở cơ số 16 là 1/16, 1/256. Các cột phần lẻ là nơi mất điểm, vì người ta hay nhân với 2 thay vì chia.</li>
<li><strong>Ở chiều này kết quả luôn CHÍNH XÁC</strong> — đi <em>về</em> thập phân, mọi chuỗi hữu hạn ở cơ số 2, 8 hay 16 đều có giá trị thập phân hữu hạn, vì mọi trọng số âm đều có dạng 1/2<sup>n</sup>, mà 1/2<sup>n</sup> luôn kết thúc trong thập phân (do 10 = 2 × 5). Chiều ngược lại mới là nơi sinh ra khai triển vô hạn (xem slide 18).</li>
<li><strong>Bỏ qua các cột số 0 là hợp lệ và nhanh</strong> — ký hiệu 0 đóng góp 0 vào tổng bất kể trọng số là gì, nên cứ để trống những cột đó. Với một số nhị phân dài, cách này cắt đi một nửa công việc.</li>
</ul>
<p class="nhan">Chính hình đó, điền cho (1011.101)<sub>2</sub> để bạn thấy cái bố cục nên chép ra giấy:</p>
<table>
<tr><th>Nhị phân</th><td>1</td><td>0</td><td>1</td><td>1</td><td>,</td><td>1</td><td>0</td><td>1</td></tr>
<tr><th>Trọng số</th><td>2<sup>3</sup> = 8</td><td>2<sup>2</sup> = 4</td><td>2<sup>1</sup> = 2</td><td>2<sup>0</sup> = 1</td><td>—</td><td>2<sup>−1</sup> = 0,5</td><td>2<sup>−2</sup> = 0,25</td><td>2<sup>−3</sup> = 0,125</td></tr>
<tr><th>Phép nhân</th><td>8</td><td>0</td><td>2</td><td>1</td><td>—</td><td>0,5</td><td>0</td><td>0,125</td></tr>
<tr><th>Gộp lại</th><td colspan="4">Phần nguyên = 8 + 0 + 2 + 1 = 11</td><td>—</td><td colspan="3">Phần lẻ = 0,5 + 0 + 0,125 = 0,625</td></tr>
</table>
<p class="dap-an">✅ (1011.101)<sub>2</sub> = <strong>11,625</strong>. Kiểm ngược: 11 = 8+2+1 = 1011, và 0,625 = 0,5 + 0,125 = .101 — cũng chính là con số mà slide 18 đổi theo chiều ngược lại.</p>
<p class="pitfall">⚠️ Hình trên slide này có một chỗ IN SAI: hàng Multiplication ghi <code>S<sub>K−1</sub>×b<sup>K−1</sup> + … + S<sub>0</sub>×b<sup>0</sup> + S<sub>0</sub>×b<sup>0</sup></code> — số hạng <code>S<sub>0</sub>×b<sup>0</sup></code> xuất hiện <strong>HAI LẦN</strong>. Đối chiếu với công thức đúng ở slide 7: số hạng áp chót phải là <code>S<sub>1</sub>×b<sup>1</sup></code>. Hãy dùng bản của slide 7; bản này sẽ đếm cột đơn vị hai lần. (Cũng để ý tiêu đề slide 15 và 16 đều gõ nhầm "Covert" thay vì "Convert".)</p>`],

      [16, 'Covert from any base to decimal (examples)',
        `<p class="y-chinh">🎯 Two worked conversions in the exact table layout you should reproduce in the exam: <strong>(110.11)<sub>2</sub> = 6.75</strong> and <strong>(1A.23)<sub>16</sub> = 26.137</strong>.</p>
<ul>
<li><strong>Example 3.1, binary</strong> — the slide's table lays out Binary / Place values / Partial results: bits 1, 1, 0 . 1, 1 with place values 2<sup>2</sup>, 2<sup>1</sup>, 2<sup>0</sup>, 2<sup>−1</sup>, 2<sup>−2</sup> and partial results 4, 2, 0, 0.5, 0.25.</li>
<li><strong>Adding them up</strong> — 4 + 2 + 0 + 0.5 + 0.25 = 6.75. Reverse check: 6 = 4 + 2 = (110)<sub>2</sub>, and 0.75 = 0.5 + 0.25 = (.11)<sub>2</sub>. Both directions agree, so the answer is safe.</li>
<li><strong>Second example, hexadecimal</strong> — (1A.23)<sub>16</sub>, place values 16<sup>1</sup>, 16<sup>0</sup>, 16<sup>−1</sup>, 16<sup>−2</sup>, partial results 16, 10, 0.125, 0.012.</li>
<li><strong>Substitute the letter first</strong> — A is not a symbol to be carried around, it is the value 10. Students who leave the A in place get stuck; students who write 10 immediately get 10 × 16<sup>0</sup> = 10 and move on.</li>
<li><strong>The fractional hex columns</strong> — 2 × 16<sup>−1</sup> = 2/16 = 0.125 exactly; 3 × 16<sup>−2</sup> = 3/256 = 0.01171875, which the slide rounds to 0.012.</li>
<li><strong>Notice the rounding, and say so in your answer</strong> — the exact value is 26.13671875. The slide's 26.137 is that number rounded to three decimals. Writing the exact value, or writing "≈ 26.137", both earn full marks; writing 26.137 as if it were exact is what an examiner may query.</li>
</ul>
<p class="nhan">Example 3.1, column by column:</p>
<table>
<tr><th>Binary</th><td>1</td><td>1</td><td>0</td><td>.</td><td>1</td><td>1</td></tr>
<tr><th>Place value</th><td>2<sup>2</sup> = 4</td><td>2<sup>1</sup> = 2</td><td>2<sup>0</sup> = 1</td><td>—</td><td>2<sup>−1</sup> = 0.5</td><td>2<sup>−2</sup> = 0.25</td></tr>
<tr><th>Partial result</th><td>4</td><td>2</td><td>0</td><td>—</td><td>0.5</td><td>0.25</td></tr>
</table>
<p class="dap-an">✅ 4 + 2 + 0 + 0.5 + 0.25 = <strong>6.75</strong> — matches the slide.</p>
<p class="nhan">The hexadecimal example, column by column:</p>
<table>
<tr><th>Hexadecimal</th><td>1</td><td>A (= 10)</td><td>.</td><td>2</td><td>3</td></tr>
<tr><th>Place value</th><td>16<sup>1</sup> = 16</td><td>16<sup>0</sup> = 1</td><td>—</td><td>16<sup>−1</sup> = 1/16</td><td>16<sup>−2</sup> = 1/256</td></tr>
<tr><th>Partial result</th><td>1 × 16 = 16</td><td>10 × 1 = 10</td><td>—</td><td>2/16 = 0.125</td><td>3/256 = 0.01171875</td></tr>
</table>
<p class="dap-an">✅ 16 + 10 + 0.125 + 0.01171875 = <strong>26.13671875</strong>, which rounds to the slide's <strong>26.137</strong>. Both the slide's "0.012" cell and its "26.137" total are rounded values, not exact ones — worth saying explicitly rather than copying silently.</p>
<p class="nhan">Practice — any base to decimal. Do all five, then check:</p>
<ul>
<li><strong>(11010110)<sub>2</sub></strong> — weights 128, 64, 32, 16, 8, 4, 2, 1 under 1,1,0,1,0,1,1,0.</li>
<li><strong>(1111111001)<sub>2</sub></strong> — 512+256+128+64+32+16+8+1.</li>
<li><strong>(655)<sub>8</sub></strong> — 6×64 + 5×8 + 5.</li>
<li><strong>(3F9)<sub>16</sub></strong> — 3×256 + 15×16 + 9.</li>
<li><strong>(10.101)<sub>2</sub></strong> — 2 + 0 + 0.5 + 0 + 0.125.</li>
</ul>
<p class="dap-an">✅ Answers: 214 · 1017 · 429 · 1017 · 2.625. All checked by converting back (214 = 11010110, 1017 = 1111111001 = 3F9, 429 = 655<sub>8</sub>, 2.625 = 10.101). Note that items 2 and 4 are the same quantity written in two bases — a free demonstration that (3F9)<sub>16</sub> = (1111111001)<sub>2</sub>, which slide 19 will produce without any arithmetic at all.</p>`,
        `<p class="y-chinh">🎯 Hai phép đổi làm mẫu, trình bày đúng cái bố cục bảng mà bạn nên chép lại trong phòng thi: <strong>(110.11)<sub>2</sub> = 6,75</strong> và <strong>(1A.23)<sub>16</sub> = 26,137</strong>.</p>
<ul>
<li><strong>Example 3.1, nhị phân</strong> — bảng của slide xếp ba hàng Binary / Place values / Partial results: các bit 1, 1, 0 . 1, 1 với trọng số 2<sup>2</sup>, 2<sup>1</sup>, 2<sup>0</sup>, 2<sup>−1</sup>, 2<sup>−2</sup> và kết quả từng phần 4, 2, 0, 0,5, 0,25.</li>
<li><strong>Cộng lại</strong> — 4 + 2 + 0 + 0,5 + 0,25 = 6,75. Kiểm ngược: 6 = 4 + 2 = (110)<sub>2</sub>, và 0,75 = 0,5 + 0,25 = (.11)<sub>2</sub>. Hai chiều khớp nhau nên đáp án chắc chắn.</li>
<li><strong>Ví dụ thứ hai, thập lục phân</strong> — (1A.23)<sub>16</sub>, trọng số 16<sup>1</sup>, 16<sup>0</sup>, 16<sup>−1</sup>, 16<sup>−2</sup>, kết quả từng phần 16, 10, 0,125, 0,012.</li>
<li><strong>Thay chữ cái NGAY từ đầu</strong> — A không phải ký hiệu để vác đi, nó là giá trị 10. Sinh viên để nguyên chữ A thì tắc; sinh viên viết ngay 10 thì ra 10 × 16<sup>0</sup> = 10 rồi đi tiếp.</li>
<li><strong>Hai cột lẻ của hex</strong> — 2 × 16<sup>−1</sup> = 2/16 = 0,125 chính xác; 3 × 16<sup>−2</sup> = 3/256 = 0,01171875, và slide làm tròn thành 0,012.</li>
<li><strong>Hãy để ý chỗ làm tròn, và nói ra trong bài</strong> — giá trị đúng là 26,13671875. Con số 26,137 của slide là số đó làm tròn ba chữ số lẻ. Viết giá trị chính xác, hoặc viết "≈ 26,137", đều được trọn điểm; viết 26,137 như thể nó chính xác mới là chỗ người chấm có thể vặn.</li>
</ul>
<p class="nhan">Example 3.1, từng cột:</p>
<table>
<tr><th>Nhị phân</th><td>1</td><td>1</td><td>0</td><td>,</td><td>1</td><td>1</td></tr>
<tr><th>Trọng số</th><td>2<sup>2</sup> = 4</td><td>2<sup>1</sup> = 2</td><td>2<sup>0</sup> = 1</td><td>—</td><td>2<sup>−1</sup> = 0,5</td><td>2<sup>−2</sup> = 0,25</td></tr>
<tr><th>Kết quả từng phần</th><td>4</td><td>2</td><td>0</td><td>—</td><td>0,5</td><td>0,25</td></tr>
</table>
<p class="dap-an">✅ 4 + 2 + 0 + 0,5 + 0,25 = <strong>6,75</strong> — khớp với slide.</p>
<p class="nhan">Ví dụ thập lục phân, từng cột:</p>
<table>
<tr><th>Thập lục phân</th><td>1</td><td>A (= 10)</td><td>,</td><td>2</td><td>3</td></tr>
<tr><th>Trọng số</th><td>16<sup>1</sup> = 16</td><td>16<sup>0</sup> = 1</td><td>—</td><td>16<sup>−1</sup> = 1/16</td><td>16<sup>−2</sup> = 1/256</td></tr>
<tr><th>Kết quả từng phần</th><td>1 × 16 = 16</td><td>10 × 1 = 10</td><td>—</td><td>2/16 = 0,125</td><td>3/256 = 0,01171875</td></tr>
</table>
<p class="dap-an">✅ 16 + 10 + 0,125 + 0,01171875 = <strong>26,13671875</strong>, làm tròn ra đúng <strong>26,137</strong> của slide. Cả ô "0,012" lẫn tổng "26,137" trên slide đều là số ĐÃ LÀM TRÒN chứ không chính xác — nên nói thẳng ra thay vì chép lại lặng lẽ.</p>
<p class="nhan">Bài luyện — cơ số bất kỳ về thập phân. Làm hết năm câu rồi mới dò:</p>
<ul>
<li><strong>(11010110)<sub>2</sub></strong> — đặt trọng số 128, 64, 32, 16, 8, 4, 2, 1 dưới 1,1,0,1,0,1,1,0.</li>
<li><strong>(1111111001)<sub>2</sub></strong> — 512+256+128+64+32+16+8+1.</li>
<li><strong>(655)<sub>8</sub></strong> — 6×64 + 5×8 + 5.</li>
<li><strong>(3F9)<sub>16</sub></strong> — 3×256 + 15×16 + 9.</li>
<li><strong>(10.101)<sub>2</sub></strong> — 2 + 0 + 0,5 + 0 + 0,125.</li>
</ul>
<p class="dap-an">✅ Đáp án: 214 · 1017 · 429 · 1017 · 2,625. Tất cả đã kiểm bằng cách đổi ngược (214 = 11010110, 1017 = 1111111001 = 3F9, 429 = 655<sub>8</sub>, 2,625 = 10.101). Để ý câu 2 và câu 4 là CÙNG một lượng viết ở hai cơ số — một minh hoạ cho không rằng (3F9)<sub>16</sub> = (1111111001)<sub>2</sub>, điều mà slide 19 sẽ cho ra mà chẳng cần tính toán gì.</p>`],

      [17, 'Convert from decimal to any base',
        `<p class="y-chinh">🎯 The reverse direction, and it needs <strong>two</strong> procedures because the integer part and the fractional part behave differently. This slide gives the integer one: Figure 2.3 — <em>divide the source by the base, insert the remainder at the LEFT of the destination, the quotient becomes the new source, stop when the quotient is zero</em>.</p>
<ul>
<li><strong>Read the flowchart as a loop</strong> — Start → create an empty destination → divide source by base → insert remainder at the left of the destination → quotient becomes new source → is the quotient zero? if not, loop → Stop, return destination. Four boxes and one decision.</li>
<li><strong>Why the remainder is the next digit</strong> — dividing by b strips off exactly the units column, and what is stripped off is the remainder, which by definition is between 0 and b−1 — exactly the range of a valid symbol. That is the whole proof, in one sentence.</li>
<li><strong>Why you insert at the LEFT</strong> — the first remainder you get is the <em>least</em> significant digit, so each new remainder has to go in front of what you already have. Equivalently: write the remainders in a column and read them <strong>bottom to top</strong>. This single detail is the most common source of wrong answers.</li>
<li><strong>Stop when the quotient is zero, not when the remainder is zero</strong> — the last division is always something ÷ b = 0 remainder something. Stopping early loses the leading digit.</li>
<li><strong>The slide's first example</strong> — convert 35 to binary. The diagram shows the chain 35 → 17 → 8 → 4 → 2 → 1 → 0 with the bits 1, 1, 0, 0, 0, 1 hanging below, read from the right end backwards.</li>
<li><strong>The slide's second example</strong> — convert 126 to octal: the chain 126 → 15 → 1 → 0 with digits 6, 7, 1 below it.</li>
</ul>
<p class="nhan">Example 1 — 35 to binary, one row per division:</p>
<table>
<tr><th>Step</th><th>Source ÷ 2</th><th>Quotient</th><th>Remainder = bit</th></tr>
<tr><td>1</td><td>35 ÷ 2</td><td>17</td><td><strong>1</strong> (least significant)</td></tr>
<tr><td>2</td><td>17 ÷ 2</td><td>8</td><td><strong>1</strong></td></tr>
<tr><td>3</td><td>8 ÷ 2</td><td>4</td><td><strong>0</strong></td></tr>
<tr><td>4</td><td>4 ÷ 2</td><td>2</td><td><strong>0</strong></td></tr>
<tr><td>5</td><td>2 ÷ 2</td><td>1</td><td><strong>0</strong></td></tr>
<tr><td>6</td><td>1 ÷ 2</td><td>0 → stop</td><td><strong>1</strong> (most significant)</td></tr>
</table>
<p class="dap-an">✅ Reading the remainders bottom to top: <strong>(100011)<sub>2</sub></strong>. Verified forwards: 32 + 0 + 0 + 0 + 2 + 1 = 35. ✓</p>
<p class="nhan">Example 2 — 126 to octal:</p>
<table>
<tr><th>Step</th><th>Source ÷ 8</th><th>Quotient</th><th>Remainder = digit</th></tr>
<tr><td>1</td><td>126 ÷ 8</td><td>15</td><td><strong>6</strong></td></tr>
<tr><td>2</td><td>15 ÷ 8</td><td>1</td><td><strong>7</strong></td></tr>
<tr><td>3</td><td>1 ÷ 8</td><td>0 → stop</td><td><strong>1</strong></td></tr>
</table>
<p class="dap-an">✅ Bottom to top: <strong>(176)<sub>8</sub></strong>. Verified: 1×64 + 7×8 + 6 = 64 + 56 + 6 = 126. ✓</p>
<p class="nhan">Practice — decimal to base 2, 8 and 16. Build the division table each time, do not guess:</p>
<ul>
<li><strong>45 to binary</strong> — 45÷2 = 22 r<strong>1</strong> · 22÷2 = 11 r<strong>0</strong> · 11÷2 = 5 r<strong>1</strong> · 5÷2 = 2 r<strong>1</strong> · 2÷2 = 1 r<strong>0</strong> · 1÷2 = 0 r<strong>1</strong>.</li>
<li><strong>87 to binary</strong> — 87÷2 = 43 r<strong>1</strong> · 43÷2 = 21 r<strong>1</strong> · 21÷2 = 10 r<strong>1</strong> · 10÷2 = 5 r<strong>0</strong> · 5÷2 = 2 r<strong>1</strong> · 2÷2 = 1 r<strong>0</strong> · 1÷2 = 0 r<strong>1</strong>.</li>
<li><strong>200 to binary</strong> — 200÷2 = 100 r<strong>0</strong> · 100÷2 = 50 r<strong>0</strong> · 50÷2 = 25 r<strong>0</strong> · 25÷2 = 12 r<strong>1</strong> · 12÷2 = 6 r<strong>0</strong> · 6÷2 = 3 r<strong>0</strong> · 3÷2 = 1 r<strong>1</strong> · 1÷2 = 0 r<strong>1</strong>.</li>
<li><strong>1000 to octal</strong> — 1000÷8 = 125 r<strong>0</strong> · 125÷8 = 15 r<strong>5</strong> · 15÷8 = 1 r<strong>7</strong> · 1÷8 = 0 r<strong>1</strong>.</li>
<li><strong>1000 to hexadecimal</strong> — 1000÷16 = 62 r<strong>8</strong> · 62÷16 = 3 r<strong>14 = E</strong> · 3÷16 = 0 r<strong>3</strong>.</li>
<li><strong>2126 to hexadecimal</strong> — 2126÷16 = 132 r<strong>14 = E</strong> · 132÷16 = 8 r<strong>4</strong> · 8÷16 = 0 r<strong>8</strong>.</li>
</ul>
<p class="dap-an">✅ Answers, each verified by converting back: 45 = (101101)<sub>2</sub> [32+8+4+1] · 87 = (1010111)<sub>2</sub> [64+16+4+2+1] · 200 = (11001000)<sub>2</sub> [128+64+8] · 1000 = (1750)<sub>8</sub> [512+448+40] · 1000 = (3E8)<sub>16</sub> [768+224+8] · 2126 = (84E)<sub>16</sub> [2048+64+14] — the last one being exactly the number in Figure 2.7 on slide 21.</p>
<p class="pitfall">⚠️ Two traps live in this one procedure. First, reading the remainders <em>top to bottom</em> gives you the answer reversed (35 would come out as 110001 = 49). Second, in base 16 a remainder of 10 to 15 must be written as A to F, not as the two characters "1" and "0" — a remainder of 10 written literally turns 2AE into 210E and the answer is nonsense.</p>`,
        `<p class="y-chinh">🎯 Chiều ngược lại, và nó cần tới <strong>HAI</strong> quy trình vì phần nguyên và phần lẻ hành xử khác nhau. Slide này cho quy trình phần nguyên: Figure 2.3 — <em>chia số nguồn cho cơ số, chèn số dư vào BÊN TRÁI của kết quả, thương trở thành nguồn mới, dừng khi thương bằng 0</em>.</p>
<ul>
<li><strong>Đọc lưu đồ như một vòng lặp</strong> — Start → tạo một kết quả rỗng → chia nguồn cho cơ số → chèn số dư vào bên trái kết quả → thương thành nguồn mới → thương đã bằng 0 chưa? chưa thì lặp → Stop, trả về kết quả. Bốn ô và một điều kiện.</li>
<li><strong>Vì sao SỐ DƯ chính là chữ số tiếp theo</strong> — chia cho b tức là lột đi đúng cột đơn vị, và thứ bị lột ra chính là số dư, mà số dư theo định nghĩa nằm trong khoảng 0 tới b−1 — đúng bằng dải của một ký hiệu hợp lệ. Đó là toàn bộ chứng minh, gói trong một câu.</li>
<li><strong>Vì sao phải chèn vào BÊN TRÁI</strong> — số dư đầu tiên bạn lấy được là chữ số CÓ TRỌNG SỐ NHỎ NHẤT, nên mỗi số dư mới phải đứng lên phía trước những gì đã có. Nói cách khác: viết các số dư thành một cột rồi đọc từ <strong>DƯỚI LÊN</strong>. Chỉ riêng chi tiết này là nguồn gốc của phần lớn đáp án sai.</li>
<li><strong>Dừng khi THƯƠNG bằng 0, không phải khi số dư bằng 0</strong> — phép chia cuối luôn có dạng "gì đó ÷ b = 0 dư gì đó". Dừng sớm là mất chữ số đầu.</li>
<li><strong>Ví dụ thứ nhất của slide</strong> — đổi 35 sang nhị phân. Sơ đồ hiện chuỗi 35 → 17 → 8 → 4 → 2 → 1 → 0 với các bit 1, 1, 0, 0, 0, 1 treo bên dưới, đọc ngược từ đầu bên phải.</li>
<li><strong>Ví dụ thứ hai của slide</strong> — đổi 126 sang bát phân: chuỗi 126 → 15 → 1 → 0 với các chữ số 6, 7, 1 bên dưới.</li>
</ul>
<p class="nhan">Ví dụ 1 — 35 sang nhị phân, mỗi dòng một phép chia:</p>
<table>
<tr><th>Bước</th><th>Nguồn ÷ 2</th><th>Thương</th><th>Số dư = bit</th></tr>
<tr><td>1</td><td>35 ÷ 2</td><td>17</td><td><strong>1</strong> (trọng số nhỏ nhất)</td></tr>
<tr><td>2</td><td>17 ÷ 2</td><td>8</td><td><strong>1</strong></td></tr>
<tr><td>3</td><td>8 ÷ 2</td><td>4</td><td><strong>0</strong></td></tr>
<tr><td>4</td><td>4 ÷ 2</td><td>2</td><td><strong>0</strong></td></tr>
<tr><td>5</td><td>2 ÷ 2</td><td>1</td><td><strong>0</strong></td></tr>
<tr><td>6</td><td>1 ÷ 2</td><td>0 → dừng</td><td><strong>1</strong> (trọng số lớn nhất)</td></tr>
</table>
<p class="dap-an">✅ Đọc các số dư từ dưới lên: <strong>(100011)<sub>2</sub></strong>. Kiểm xuôi: 32 + 0 + 0 + 0 + 2 + 1 = 35. ✓</p>
<p class="nhan">Ví dụ 2 — 126 sang bát phân:</p>
<table>
<tr><th>Bước</th><th>Nguồn ÷ 8</th><th>Thương</th><th>Số dư = chữ số</th></tr>
<tr><td>1</td><td>126 ÷ 8</td><td>15</td><td><strong>6</strong></td></tr>
<tr><td>2</td><td>15 ÷ 8</td><td>1</td><td><strong>7</strong></td></tr>
<tr><td>3</td><td>1 ÷ 8</td><td>0 → dừng</td><td><strong>1</strong></td></tr>
</table>
<p class="dap-an">✅ Đọc từ dưới lên: <strong>(176)<sub>8</sub></strong>. Kiểm: 1×64 + 7×8 + 6 = 64 + 56 + 6 = 126. ✓</p>
<p class="nhan">Bài luyện — thập phân sang cơ số 2, 8 và 16. Lần nào cũng dựng bảng chia ra, đừng đoán:</p>
<ul>
<li><strong>45 sang nhị phân</strong> — 45÷2 = 22 dư <strong>1</strong> · 22÷2 = 11 dư <strong>0</strong> · 11÷2 = 5 dư <strong>1</strong> · 5÷2 = 2 dư <strong>1</strong> · 2÷2 = 1 dư <strong>0</strong> · 1÷2 = 0 dư <strong>1</strong>.</li>
<li><strong>87 sang nhị phân</strong> — 87÷2 = 43 dư <strong>1</strong> · 43÷2 = 21 dư <strong>1</strong> · 21÷2 = 10 dư <strong>1</strong> · 10÷2 = 5 dư <strong>0</strong> · 5÷2 = 2 dư <strong>1</strong> · 2÷2 = 1 dư <strong>0</strong> · 1÷2 = 0 dư <strong>1</strong>.</li>
<li><strong>200 sang nhị phân</strong> — 200÷2 = 100 dư <strong>0</strong> · 100÷2 = 50 dư <strong>0</strong> · 50÷2 = 25 dư <strong>0</strong> · 25÷2 = 12 dư <strong>1</strong> · 12÷2 = 6 dư <strong>0</strong> · 6÷2 = 3 dư <strong>0</strong> · 3÷2 = 1 dư <strong>1</strong> · 1÷2 = 0 dư <strong>1</strong>.</li>
<li><strong>1000 sang bát phân</strong> — 1000÷8 = 125 dư <strong>0</strong> · 125÷8 = 15 dư <strong>5</strong> · 15÷8 = 1 dư <strong>7</strong> · 1÷8 = 0 dư <strong>1</strong>.</li>
<li><strong>1000 sang thập lục phân</strong> — 1000÷16 = 62 dư <strong>8</strong> · 62÷16 = 3 dư <strong>14 = E</strong> · 3÷16 = 0 dư <strong>3</strong>.</li>
<li><strong>2126 sang thập lục phân</strong> — 2126÷16 = 132 dư <strong>14 = E</strong> · 132÷16 = 8 dư <strong>4</strong> · 8÷16 = 0 dư <strong>8</strong>.</li>
</ul>
<p class="dap-an">✅ Đáp án, mỗi cái đều đã kiểm bằng cách đổi ngược: 45 = (101101)<sub>2</sub> [32+8+4+1] · 87 = (1010111)<sub>2</sub> [64+16+4+2+1] · 200 = (11001000)<sub>2</sub> [128+64+8] · 1000 = (1750)<sub>8</sub> [512+448+40] · 1000 = (3E8)<sub>16</sub> [768+224+8] · 2126 = (84E)<sub>16</sub> [2048+64+14] — cái cuối chính là con số trong Figure 2.7 ở slide 21.</p>
<p class="pitfall">⚠️ Có hai cái bẫy nằm trong đúng một quy trình này. Thứ nhất, đọc số dư từ <em>trên xuống</em> là ra đáp án ngược (35 sẽ thành 110001 = 49). Thứ hai, ở cơ số 16 số dư từ 10 tới 15 phải viết thành A tới F chứ không phải hai ký tự "1" và "0" — viết số dư 10 theo đúng nghĩa đen là biến 2AE thành 210E và đáp án thành vô nghĩa.</p>`],

      [18, 'Convert from decimal to any base (cont.)',
        `<p class="y-chinh">🎯 The second half of the reverse direction: the <strong>fractional part</strong>. Figure 2.4 is the mirror of Figure 2.3 — <em>multiply the source by the base, insert the integral part of the result at the RIGHT of the destination, the fraction of the result becomes the new source, stop when the fraction is zero OR when you have enough digits</em>.</p>
<ul>
<li><strong>Every step of the loop is mirrored</strong> — divide becomes multiply, remainder becomes integral part, insert at the left becomes insert at the right, and "quotient is zero" becomes "fraction is zero <em>or</em> you have enough digits". Learn it as the mirror and you only have one algorithm to remember.</li>
<li><strong>Read the digits TOP to BOTTOM</strong> — the opposite of the integer case, and for the same reason: here the first digit you produce is the <em>most</em> significant one (the b<sup>−1</sup> column). Getting the direction right in both halves is what the exam is checking.</li>
<li><strong>The new stopping condition matters</strong> — "destination digits are enough". Unlike the integer part, this loop may never terminate on its own. 0.1 in binary runs forever: 0.000110011001100… repeating. The question must tell you how many digits to produce, and if it does not, produce a sensible number and say you truncated.</li>
<li><strong>Which fractions terminate</strong> — in base 2, exactly those whose denominator is a power of 2 (1/2, 1/4, 3/8, 5/16 …). 0.625 = 5/8 terminates in three bits. 0.1 = 1/10 does not, because 10 has a factor 5. This is the same phenomenon as 1/3 = 0.333… in decimal, seen from the other side.</li>
<li><strong>The slide's first example</strong> — 0.625 to binary, shown as the chain 0.625 → 0.25 → 0.50 → 0.00 with the bits 1, 0, 1 underneath, giving (.101)<sub>2</sub>.</li>
<li><strong>The slide's second example</strong> — 0.634 to octal with a maximum of four digits: the chain 0.634 → 0.072 → 0.576 → 0.608 → 0.864 with digits 5, 0, 4, 4, giving (.5044)<sub>8</sub>. Note the loop was stopped by the digit budget, not by reaching zero.</li>
</ul>
<p class="nhan">Example 1 — 0.625 to binary, one row per multiplication:</p>
<table>
<tr><th>Step</th><th>Source × 2</th><th>Result</th><th>Integral part = bit</th><th>New source</th></tr>
<tr><td>1</td><td>0.625 × 2</td><td>1.25</td><td><strong>1</strong></td><td>0.25</td></tr>
<tr><td>2</td><td>0.25 × 2</td><td>0.50</td><td><strong>0</strong></td><td>0.50</td></tr>
<tr><td>3</td><td>0.50 × 2</td><td>1.00</td><td><strong>1</strong></td><td>0.00 → stop</td></tr>
</table>
<p class="dap-an">✅ Reading top to bottom: <strong>(0.101)<sub>2</sub></strong>. Verified forwards: 0.5 + 0 + 0.125 = 0.625. ✓ (The slide's chain 0.625 → 0.25 → 0.50 → 0.00 is exactly the "new source" column of this table.)</p>
<p class="nhan">Example 2 — 0.634 to octal, maximum four digits:</p>
<table>
<tr><th>Step</th><th>Source × 8</th><th>Result</th><th>Integral part = digit</th><th>New source</th></tr>
<tr><td>1</td><td>0.634 × 8</td><td>5.072</td><td><strong>5</strong></td><td>0.072</td></tr>
<tr><td>2</td><td>0.072 × 8</td><td>0.576</td><td><strong>0</strong></td><td>0.576</td></tr>
<tr><td>3</td><td>0.576 × 8</td><td>4.608</td><td><strong>4</strong></td><td>0.608</td></tr>
<tr><td>4</td><td>0.608 × 8</td><td>4.864</td><td><strong>4</strong></td><td>0.864 → budget spent, stop</td></tr>
</table>
<p class="dap-an">✅ <strong>(0.5044)<sub>8</sub></strong>, which is an <em>approximation</em>: converting back gives 5/8 + 0/64 + 4/512 + 4/4096 = 0.6337890625, close to but not equal to 0.634. Say "≈" in your answer — the difference is the truncation, not a mistake.</p>
<p class="nhan">Practice — decimal fractions. Multiply by the base, collect the integral parts, read downwards:</p>
<ul>
<li><strong>0.375 to binary</strong> — 0.375×2 = 0.75 → <strong>0</strong>; 0.75×2 = 1.5 → <strong>1</strong>; 0.5×2 = 1.0 → <strong>1</strong>, fraction zero, stop.</li>
<li><strong>0.8125 to binary</strong> — ×2 = 1.625 → <strong>1</strong>; 0.625×2 = 1.25 → <strong>1</strong>; 0.25×2 = 0.5 → <strong>0</strong>; 0.5×2 = 1.0 → <strong>1</strong>, stop.</li>
<li><strong>25.6875 to binary</strong> — do the two halves separately: 25 by repeated division, 0.6875 by repeated multiplication (×2 = 1.375 → <strong>1</strong>; 0.375×2 = 0.75 → <strong>0</strong>; 0.75×2 = 1.5 → <strong>1</strong>; 0.5×2 = 1.0 → <strong>1</strong>), then join them with a point.</li>
<li><strong>0.1 to binary, eight digits</strong> — ×2 = 0.2 → <strong>0</strong>; 0.4 → <strong>0</strong>; 0.8 → <strong>0</strong>; 1.6 → <strong>1</strong>; 1.2 → <strong>1</strong>; 0.4 → <strong>0</strong>; 0.8 → <strong>0</strong>; 1.6 → <strong>1</strong>… watch the pattern start repeating.</li>
<li><strong>0.75 to hexadecimal</strong> — 0.75 × 16 = 12.0 → integral part 12 = <strong>C</strong>, fraction zero, stop.</li>
</ul>
<p class="dap-an">✅ Answers, all checked by converting back: 0.375 = (0.011)<sub>2</sub> [0.25+0.125] · 0.8125 = (0.1101)<sub>2</sub> [0.5+0.25+0.0625] · 25.6875 = (11001.1011)<sub>2</sub> [16+8+1 and 0.5+0.125+0.0625] · 0.1 ≈ (0.00011001)<sub>2</sub> with the block <code>0011</code> repeating forever · 0.75 = (0.C)<sub>16</sub> [12/16]. The fourth one is the classic: it is exactly why <code>0.1 + 0.2</code> does not equal <code>0.3</code> in any programming language.</p>
<p class="pitfall">⚠️ Three ways to lose the marks here. (1) Reading the digits bottom-to-top, copying the habit from slide 17 — in this half you read <strong>downwards</strong>. (2) Carrying the integral part into the next step: after you write down the digit, the next source is the <em>fraction only</em>, so 1.25 continues as 0.25, never as 1.25. (3) Converting the integer and the fraction of a mixed number with the same procedure — 25.6875 needs division for the 25 and multiplication for the .6875.</p>`,
        `<p class="y-chinh">🎯 Nửa sau của chiều ngược lại: <strong>phần lẻ</strong>. Figure 2.4 là ảnh gương của Figure 2.3 — <em>nhân số nguồn với cơ số, chèn phần nguyên của kết quả vào BÊN PHẢI của kết quả đích, phần lẻ của kết quả trở thành nguồn mới, dừng khi phần lẻ bằng 0 HOẶC khi đã đủ số chữ số</em>.</p>
<ul>
<li><strong>Từng bước của vòng lặp đều soi gương</strong> — chia thành nhân, số dư thành phần nguyên, chèn bên trái thành chèn bên phải, và "thương bằng 0" thành "phần lẻ bằng 0 <em>hoặc</em> đã đủ chữ số". Học nó như một ảnh gương thì bạn chỉ phải nhớ một thuật toán.</li>
<li><strong>Đọc các chữ số từ TRÊN XUỐNG</strong> — ngược với phần nguyên, và vì cùng một lý do: ở đây chữ số sinh ra đầu tiên là chữ số có trọng số LỚN NHẤT (cột b<sup>−1</sup>). Nhớ đúng chiều ở cả hai nửa chính là thứ đề thi đang kiểm.</li>
<li><strong>Điều kiện dừng mới có ý nghĩa riêng</strong> — "đã đủ số chữ số đích". Khác với phần nguyên, vòng lặp này có thể KHÔNG BAO GIỜ tự dừng. Số 0,1 ở nhị phân chạy mãi: 0,000110011001100… lặp lại. Đề bài phải nói rõ lấy bao nhiêu chữ số, còn nếu không nói thì hãy lấy một số hợp lý và ghi rõ là đã cắt.</li>
<li><strong>Phân số nào thì dừng được</strong> — ở cơ số 2, đúng những phân số có mẫu là luỹ thừa của 2 (1/2, 1/4, 3/8, 5/16 …). 0,625 = 5/8 dừng sau ba bit. 0,1 = 1/10 thì không, vì 10 có thừa số 5. Đây đúng là hiện tượng 1/3 = 0,333… trong thập phân, nhìn từ phía bên kia.</li>
<li><strong>Ví dụ thứ nhất của slide</strong> — 0,625 sang nhị phân, vẽ thành chuỗi 0.625 → 0.25 → 0.50 → 0.00 với các bit 1, 0, 1 bên dưới, ra (.101)<sub>2</sub>.</li>
<li><strong>Ví dụ thứ hai của slide</strong> — 0,634 sang bát phân lấy tối đa bốn chữ số: chuỗi 0.634 → 0.072 → 0.576 → 0.608 → 0.864 với các chữ số 5, 0, 4, 4, ra (.5044)<sub>8</sub>. Để ý vòng lặp bị dừng bởi HẠN MỨC chữ số chứ không phải vì đã về 0.</li>
</ul>
<p class="nhan">Ví dụ 1 — 0,625 sang nhị phân, mỗi dòng một phép nhân:</p>
<table>
<tr><th>Bước</th><th>Nguồn × 2</th><th>Kết quả</th><th>Phần nguyên = bit</th><th>Nguồn mới</th></tr>
<tr><td>1</td><td>0,625 × 2</td><td>1,25</td><td><strong>1</strong></td><td>0,25</td></tr>
<tr><td>2</td><td>0,25 × 2</td><td>0,50</td><td><strong>0</strong></td><td>0,50</td></tr>
<tr><td>3</td><td>0,50 × 2</td><td>1,00</td><td><strong>1</strong></td><td>0,00 → dừng</td></tr>
</table>
<p class="dap-an">✅ Đọc từ trên xuống: <strong>(0.101)<sub>2</sub></strong>. Kiểm xuôi: 0,5 + 0 + 0,125 = 0,625. ✓ (Chuỗi 0.625 → 0.25 → 0.50 → 0.00 trên slide chính là cột "Nguồn mới" của bảng này.)</p>
<p class="nhan">Ví dụ 2 — 0,634 sang bát phân, tối đa bốn chữ số:</p>
<table>
<tr><th>Bước</th><th>Nguồn × 8</th><th>Kết quả</th><th>Phần nguyên = chữ số</th><th>Nguồn mới</th></tr>
<tr><td>1</td><td>0,634 × 8</td><td>5,072</td><td><strong>5</strong></td><td>0,072</td></tr>
<tr><td>2</td><td>0,072 × 8</td><td>0,576</td><td><strong>0</strong></td><td>0,576</td></tr>
<tr><td>3</td><td>0,576 × 8</td><td>4,608</td><td><strong>4</strong></td><td>0,608</td></tr>
<tr><td>4</td><td>0,608 × 8</td><td>4,864</td><td><strong>4</strong></td><td>0,864 → hết hạn mức, dừng</td></tr>
</table>
<p class="dap-an">✅ <strong>(0.5044)<sub>8</sub></strong>, và đây là một số XẤP XỈ: đổi ngược lại được 5/8 + 0/64 + 4/512 + 4/4096 = 0,6337890625, gần chứ không bằng 0,634. Hãy viết dấu "≈" trong bài — chênh lệch đó là do cắt bớt chứ không phải do làm sai.</p>
<p class="nhan">Bài luyện — phần lẻ thập phân. Nhân với cơ số, nhặt phần nguyên, đọc xuôi từ trên xuống:</p>
<ul>
<li><strong>0,375 sang nhị phân</strong> — 0,375×2 = 0,75 → <strong>0</strong>; 0,75×2 = 1,5 → <strong>1</strong>; 0,5×2 = 1,0 → <strong>1</strong>, phần lẻ về 0, dừng.</li>
<li><strong>0,8125 sang nhị phân</strong> — ×2 = 1,625 → <strong>1</strong>; 0,625×2 = 1,25 → <strong>1</strong>; 0,25×2 = 0,5 → <strong>0</strong>; 0,5×2 = 1,0 → <strong>1</strong>, dừng.</li>
<li><strong>25,6875 sang nhị phân</strong> — làm hai nửa riêng: 25 bằng chia liên tiếp, 0,6875 bằng nhân liên tiếp (×2 = 1,375 → <strong>1</strong>; 0,375×2 = 0,75 → <strong>0</strong>; 0,75×2 = 1,5 → <strong>1</strong>; 0,5×2 = 1,0 → <strong>1</strong>), rồi ghép hai nửa bằng một dấu phẩy.</li>
<li><strong>0,1 sang nhị phân, tám chữ số</strong> — ×2 = 0,2 → <strong>0</strong>; 0,4 → <strong>0</strong>; 0,8 → <strong>0</strong>; 1,6 → <strong>1</strong>; 1,2 → <strong>1</strong>; 0,4 → <strong>0</strong>; 0,8 → <strong>0</strong>; 1,6 → <strong>1</strong>… hãy để ý lúc mẫu bắt đầu lặp lại.</li>
<li><strong>0,75 sang thập lục phân</strong> — 0,75 × 16 = 12,0 → phần nguyên 12 = <strong>C</strong>, phần lẻ về 0, dừng.</li>
</ul>
<p class="dap-an">✅ Đáp án, tất cả đã kiểm bằng cách đổi ngược: 0,375 = (0.011)<sub>2</sub> [0,25+0,125] · 0,8125 = (0.1101)<sub>2</sub> [0,5+0,25+0,0625] · 25,6875 = (11001.1011)<sub>2</sub> [16+8+1 và 0,5+0,125+0,0625] · 0,1 ≈ (0.00011001)<sub>2</sub> với khối <code>0011</code> lặp vô tận · 0,75 = (0.C)<sub>16</sub> [12/16]. Câu thứ tư là câu kinh điển: nó chính là lý do <code>0.1 + 0.2</code> không bằng <code>0.3</code> trong mọi ngôn ngữ lập trình.</p>
<p class="pitfall">⚠️ Ba cách mất điểm ở đây. (1) Đọc chữ số từ dưới lên vì bê nguyên thói quen của slide 17 — ở nửa này phải đọc <strong>TỪ TRÊN XUỐNG</strong>. (2) Vác phần nguyên sang bước sau: sau khi ghi chữ số ra rồi thì nguồn kế tiếp chỉ là <em>phần lẻ</em>, nên 1,25 đi tiếp là 0,25 chứ không bao giờ là 1,25. (3) Đổi phần nguyên và phần lẻ của một số hỗn hợp bằng CÙNG một quy trình — 25,6875 cần phép chia cho số 25 và phép nhân cho phần ,6875.</p>`],

      [19, 'Binary–hexadecimal conversion',
        `<p class="y-chinh">🎯 The cheapest conversion in the chapter, because 16 = 2<sup>4</sup>: <strong>one hexadecimal digit is exactly four bits</strong>. Figure 2.5 draws the bits in boxes of four — B<sub>3</sub>B<sub>2</sub>B<sub>1</sub>B<sub>0</sub> under H<sub>0</sub>, B<sub>7</sub>B<sub>6</sub>B<sub>5</sub>B<sub>4</sub> under H<sub>1</sub>, and so on — with double-headed arrows, because the procedure works identically in both directions.</p>
<ul>
<li><strong>Hex → binary</strong> — replace each hexadecimal symbol by its 4-bit pattern. No arithmetic, no carrying, no order to remember. Just substitution.</li>
<li><strong>Binary → hex</strong> — group the bits in fours <strong>starting from the point and moving left</strong>, pad the leftmost group with zeros if it is short, then replace each group by its symbol.</li>
<li><strong>Grouping direction is not a style choice</strong> — group from the right and 11010110 becomes 1101·0110 = D6 (correct, 214). Group from the left and you get 1101·0110 only by luck; with 1011011 (7 bits) grouping left-to-right gives 1011·011 = B3 = 179, which is wrong — the correct answer is 0101·1011 = 5B = 91. Always anchor at the point.</li>
<li><strong>Padding is free and mandatory</strong> — leading zeros never change a value, so pad the top group up to four bits. For a fractional part you pad on the <em>right</em> instead, because there the groups grow away from the point in the other direction.</li>
<li><strong>Why this beats going through decimal</strong> — no division, no multiplication, nothing to carry, and the work is proportional to the number of digits rather than to the size of the value. A 32-bit number becomes 8 hex digits in about ten seconds.</li>
<li><strong>Example 2.4 on the slide</strong> — the binary equivalent of (24C)<sub>16</sub>: each digit becomes a 4-bit pattern, 2 → 0010, 4 → 0100, C → 1100, giving (001001001100)<sub>2</sub>.</li>
</ul>
<p class="nhan">Example 2.4, digit by digit:</p>
<table>
<tr><th>Hex digit</th><td>2</td><td>4</td><td>C</td></tr>
<tr><th>Its value</th><td>2</td><td>4</td><td>12</td></tr>
<tr><th>4 bits (8-4-2-1)</th><td>0010</td><td>0100</td><td>1100</td></tr>
</table>
<p class="dap-an">✅ Concatenate: <strong>(001001001100)<sub>2</sub></strong>, exactly as the slide says. Verified independently through decimal: (24C)<sub>16</sub> = 2×256 + 4×16 + 12 = 588, and (001001001100)<sub>2</sub> = 512+64+8+4 = 588. ✓ The two leading zeros are cosmetic — (1001001100)<sub>2</sub> is the same number — but keeping them shows the grouping and costs nothing.</p>
<p class="nhan">Practice — binary ↔ hexadecimal, no arithmetic allowed:</p>
<ul>
<li><strong>(11010110)<sub>2</sub> → hex</strong> — group from the right: 1101 · 0110.</li>
<li><strong>(10111)<sub>2</sub> → hex</strong> — only five bits, so pad to eight: 0001 · 0111.</li>
<li><strong>(3F9)<sub>16</sub> → binary</strong> — 3 → 0011, F → 1111, 9 → 1001.</li>
<li><strong>(BEEF)<sub>16</sub> → binary</strong> — B → 1011, E → 1110, E → 1110, F → 1111.</li>
<li><strong>(1010101110)<sub>2</sub> → hex</strong> — pad two zeros on the left: 0010 · 1010 · 1110.</li>
</ul>
<p class="dap-an">✅ Answers: (D6)<sub>16</sub> = 214 · (17)<sub>16</sub> = 23 · (1111111001)<sub>2</sub> = 1017 · (1011111011101111)<sub>2</sub> = 48 879 · (2AE)<sub>16</sub> = 686. Every one verified by evaluating both sides in decimal. The last is the same 686 as slides 10 and 11 — reached this time with zero multiplications.</p>
<p class="pitfall">⚠️ For a number with a fractional part, the two halves are grouped <em>away from the point in opposite directions</em>. In (1011.1)<sub>2</sub>: the integer side groups leftwards to 1011 = B; the fraction side groups rightwards and must be padded on the right, 1 → 1000 = 8, giving (B.8)<sub>16</sub>. Padding the fraction on the left would turn 0.5 into 0.0625 — a factor of eight wrong.</p>`,
        `<p class="y-chinh">🎯 Phép đổi rẻ nhất của cả chương, vì 16 = 2<sup>4</sup>: <strong>một chữ số thập lục phân đúng bằng bốn bit</strong>. Figure 2.5 vẽ các bit trong những ô bốn cái một — B<sub>3</sub>B<sub>2</sub>B<sub>1</sub>B<sub>0</sub> dưới H<sub>0</sub>, B<sub>7</sub>B<sub>6</sub>B<sub>5</sub>B<sub>4</sub> dưới H<sub>1</sub>, và cứ thế — với mũi tên hai đầu, vì quy trình chạy y hệt theo cả hai chiều.</p>
<ul>
<li><strong>Hex → nhị phân</strong> — thay mỗi ký hiệu thập lục phân bằng mẫu 4 bit của nó. Không tính toán, không nhớ, không phải nhớ thứ tự nào. Chỉ là thay thế.</li>
<li><strong>Nhị phân → hex</strong> — gom bit thành nhóm bốn <strong>bắt đầu từ dấu phẩy và đi sang trái</strong>, đệm số 0 cho nhóm ngoài cùng bên trái nếu thiếu, rồi thay mỗi nhóm bằng ký hiệu của nó.</li>
<li><strong>Chiều gom KHÔNG phải chuyện sở thích</strong> — gom từ phải thì 11010110 thành 1101·0110 = D6 (đúng, 214). Gom từ trái mà ra đúng chỉ là ăn may; với 1011011 (7 bit), gom từ trái sang được 1011·011 = B3 = 179, sai — đáp án đúng là 0101·1011 = 5B = 91. Luôn neo ở dấu phẩy.</li>
<li><strong>Đệm số 0 vừa miễn phí vừa bắt buộc</strong> — số 0 đứng đầu không đổi giá trị, nên cứ đệm nhóm trên cùng cho đủ bốn bit. Với phần LẺ thì phải đệm bên <em>phải</em>, vì ở đó các nhóm lớn dần theo chiều ra xa dấu phẩy ở phía kia.</li>
<li><strong>Vì sao cách này hơn đường vòng qua thập phân</strong> — không chia, không nhân, không có gì phải nhớ, và khối lượng việc tỉ lệ với SỐ CHỮ SỐ chứ không tỉ lệ với ĐỘ LỚN của giá trị. Một số 32 bit thành 8 chữ số hex trong khoảng mười giây.</li>
<li><strong>Example 2.4 trên slide</strong> — dạng nhị phân của (24C)<sub>16</sub>: mỗi chữ số thành một mẫu 4 bit, 2 → 0010, 4 → 0100, C → 1100, ra (001001001100)<sub>2</sub>.</li>
</ul>
<p class="nhan">Example 2.4, từng chữ số:</p>
<table>
<tr><th>Chữ số hex</th><td>2</td><td>4</td><td>C</td></tr>
<tr><th>Giá trị của nó</th><td>2</td><td>4</td><td>12</td></tr>
<tr><th>4 bit (8-4-2-1)</th><td>0010</td><td>0100</td><td>1100</td></tr>
</table>
<p class="dap-an">✅ Nối lại: <strong>(001001001100)<sub>2</sub></strong>, đúng như slide nói. Kiểm độc lập qua thập phân: (24C)<sub>16</sub> = 2×256 + 4×16 + 12 = 588, và (001001001100)<sub>2</sub> = 512+64+8+4 = 588. ✓ Hai số 0 đứng đầu chỉ là trang trí — (1001001100)<sub>2</sub> vẫn là số đó — nhưng giữ chúng lại thì thấy rõ cách gom nhóm và chẳng tốn gì.</p>
<p class="nhan">Bài luyện — nhị phân ↔ thập lục phân, cấm tính toán:</p>
<ul>
<li><strong>(11010110)<sub>2</sub> → hex</strong> — gom từ phải: 1101 · 0110.</li>
<li><strong>(10111)<sub>2</sub> → hex</strong> — chỉ có năm bit, đệm cho đủ tám: 0001 · 0111.</li>
<li><strong>(3F9)<sub>16</sub> → nhị phân</strong> — 3 → 0011, F → 1111, 9 → 1001.</li>
<li><strong>(BEEF)<sub>16</sub> → nhị phân</strong> — B → 1011, E → 1110, E → 1110, F → 1111.</li>
<li><strong>(1010101110)<sub>2</sub> → hex</strong> — đệm hai số 0 bên trái: 0010 · 1010 · 1110.</li>
</ul>
<p class="dap-an">✅ Đáp án: (D6)<sub>16</sub> = 214 · (17)<sub>16</sub> = 23 · (1111111001)<sub>2</sub> = 1017 · (1011111011101111)<sub>2</sub> = 48 879 · (2AE)<sub>16</sub> = 686. Mỗi câu đều đã kiểm bằng cách tính cả hai vế ra thập phân. Câu cuối vẫn là con số 686 của slide 10 và 11 — lần này tới đích mà không tốn một phép nhân nào.</p>
<p class="pitfall">⚠️ Với số CÓ PHẦN LẺ, hai nửa được gom theo hai chiều <em>ngược nhau tính từ dấu phẩy</em>. Trong (1011.1)<sub>2</sub>: bên phần nguyên gom sang trái được 1011 = B; bên phần lẻ gom sang phải và phải đệm bên PHẢI, 1 → 1000 = 8, ra (B.8)<sub>16</sub>. Đệm phần lẻ ở bên trái sẽ biến 0,5 thành 0,0625 — sai đi tám lần.</p>`],

      [20, 'Binary–octal conversion',
        `<p class="y-chinh">🎯 The same trick with a smaller chunk: 8 = 2<sup>3</sup>, so <strong>one octal digit is exactly three bits</strong>. Figure 2.6 shows B<sub>2</sub>B<sub>1</sub>B<sub>0</sub> under O<sub>0</sub>, B<sub>5</sub>B<sub>4</sub>B<sub>3</sub> under O<sub>1</sub>, and so on, again with two-way arrows.</p>
<ul>
<li><strong>Everything from slide 19 carries over</strong> — same anchoring at the point, same grouping from the right for the integer part, same left-padding with zeros, same "no arithmetic". Only the group size changes, from four to three.</li>
<li><strong>The eight patterns to know</strong> — 0 = 000, 1 = 001, 2 = 010, 3 = 011, 4 = 100, 5 = 101, 6 = 110, 7 = 111. That is the 4-2-1 weighting, and you can rebuild any row in a second.</li>
<li><strong>Why three bits maxes out at 7</strong> — 111 is the biggest 3-bit pattern and it is 4+2+1 = 7. So an octal digit can never be 8 or 9; the symbol set of slide 11 and the group size here are the same fact seen twice.</li>
<li><strong>Example 2.5 on the slide</strong> — the binary equivalent of (24)<sub>8</sub>: write each octal digit as its bit pattern, 2 → 010 and 4 → 100, giving (010100)<sub>2</sub>.</li>
<li><strong>Verify it independently</strong> — (24)<sub>8</sub> = 2×8 + 4 = 20, and (010100)<sub>2</sub> = 16 + 4 = 20. ✓ The leading zero is only there to keep the group of three visible.</li>
<li><strong>Which shorthand to choose</strong> — if the question mentions bytes, addresses or colours, use hex; if it mentions Unix permissions or the question itself is in octal, use octal. Both are equally correct and equally fast; hex just lines up with byte boundaries and octal does not.</li>
</ul>
<p class="nhan">Example 2.5, digit by digit:</p>
<table>
<tr><th>Octal digit</th><td>2</td><td>4</td></tr>
<tr><th>3 bits (4-2-1)</th><td>010</td><td>100</td></tr>
<tr><th>Place check</th><td>2 × 8 = 16</td><td>4 × 1 = 4</td></tr>
</table>
<p class="dap-an">✅ (24)<sub>8</sub> = <strong>(010100)<sub>2</sub></strong> = 20 in decimal, matching the slide. (The slide's sentence reads "What is the binary equivalent of for (24)8?" — the word "of" is a typo left in the original; the question is simply "what is the binary equivalent of (24)<sub>8</sub>".)</p>
<p class="nhan">Practice — binary ↔ octal, groups of three from the point:</p>
<ul>
<li><strong>(110101101)<sub>2</sub> → octal</strong> — 110 · 101 · 101.</li>
<li><strong>(10111)<sub>2</sub> → octal</strong> — five bits, pad to six: 010 · 111.</li>
<li><strong>(372)<sub>8</sub> → binary</strong> — 3 → 011, 7 → 111, 2 → 010.</li>
<li><strong>(1256)<sub>8</sub> → binary</strong> — 1 → 001, 2 → 010, 5 → 101, 6 → 110.</li>
<li><strong>(755)<sub>8</sub> → binary</strong> — the <code>chmod</code> number: 7 → 111 (rwx), 5 → 101 (r-x), 5 → 101 (r-x).</li>
</ul>
<p class="dap-an">✅ Answers: (655)<sub>8</sub> = 429 · (27)<sub>8</sub> = 23 · (11111010)<sub>2</sub> = 250 · (1010101110)<sub>2</sub> = 686 · (111101101)<sub>2</sub> = 493. All checked in decimal both ways. Compare item 2 with slide 19's item 2: the same five bits are (17)<sub>16</sub> and (27)<sub>8</sub>, both equal to 23 — a good reminder that a value without its base is meaningless.</p>
<p class="meo">💡 Octal → hexadecimal has no direct rule, because 8 and 16 are different powers of two and their digits do not line up. The route is always octal → binary → hexadecimal, which is exactly what slide 21 is about.</p>`,
        `<p class="y-chinh">🎯 Vẫn mẹo ấy nhưng khúc nhỏ hơn: 8 = 2<sup>3</sup>, nên <strong>một chữ số bát phân đúng bằng ba bit</strong>. Figure 2.6 vẽ B<sub>2</sub>B<sub>1</sub>B<sub>0</sub> dưới O<sub>0</sub>, B<sub>5</sub>B<sub>4</sub>B<sub>3</sub> dưới O<sub>1</sub>, và cứ thế, cũng với mũi tên hai chiều.</p>
<ul>
<li><strong>Mọi thứ của slide 19 đều bê nguyên sang</strong> — vẫn neo ở dấu phẩy, vẫn gom từ phải cho phần nguyên, vẫn đệm số 0 bên trái, vẫn "không tính toán gì". Chỉ có cỡ nhóm đổi, từ bốn xuống ba.</li>
<li><strong>Tám mẫu phải biết</strong> — 0 = 000, 1 = 001, 2 = 010, 3 = 011, 4 = 100, 5 = 101, 6 = 110, 7 = 111. Đó là trọng số 4-2-1, và bạn dựng lại một dòng bất kỳ trong một giây.</li>
<li><strong>Vì sao ba bit chỉ lên tới 7</strong> — 111 là mẫu 3 bit lớn nhất và nó bằng 4+2+1 = 7. Nên một chữ số bát phân không bao giờ là 8 hay 9; tập ký hiệu ở slide 11 và cỡ nhóm ở đây là CÙNG một sự thật nhìn hai lần.</li>
<li><strong>Example 2.5 trên slide</strong> — dạng nhị phân của (24)<sub>8</sub>: viết mỗi chữ số bát phân thành mẫu bit của nó, 2 → 010 và 4 → 100, ra (010100)<sub>2</sub>.</li>
<li><strong>Kiểm lại một cách độc lập</strong> — (24)<sub>8</sub> = 2×8 + 4 = 20, và (010100)<sub>2</sub> = 16 + 4 = 20. ✓ Số 0 đứng đầu chỉ ở đó để giữ cho nhóm ba bit nhìn thấy được.</li>
<li><strong>Chọn lối viết tắt nào</strong> — đề nhắc tới byte, địa chỉ hay màu thì dùng hex; đề nhắc tới quyền Unix hoặc bản thân đề đã ở bát phân thì dùng bát phân. Cả hai đều đúng và đều nhanh như nhau; chỉ là hex khớp ranh giới byte còn bát phân thì không.</li>
</ul>
<p class="nhan">Example 2.5, từng chữ số:</p>
<table>
<tr><th>Chữ số bát phân</th><td>2</td><td>4</td></tr>
<tr><th>3 bit (4-2-1)</th><td>010</td><td>100</td></tr>
<tr><th>Kiểm bằng trọng số</th><td>2 × 8 = 16</td><td>4 × 1 = 4</td></tr>
</table>
<p class="dap-an">✅ (24)<sub>8</sub> = <strong>(010100)<sub>2</sub></strong> = 20 ở thập phân, khớp với slide. (Câu trên slide viết "What is the binary equivalent of for (24)8?" — chữ "of" là lỗi gõ còn sót trong bản gốc; câu hỏi chỉ đơn giản là "dạng nhị phân của (24)<sub>8</sub> là gì".)</p>
<p class="nhan">Bài luyện — nhị phân ↔ bát phân, nhóm ba tính từ dấu phẩy:</p>
<ul>
<li><strong>(110101101)<sub>2</sub> → bát phân</strong> — 110 · 101 · 101.</li>
<li><strong>(10111)<sub>2</sub> → bát phân</strong> — năm bit, đệm cho đủ sáu: 010 · 111.</li>
<li><strong>(372)<sub>8</sub> → nhị phân</strong> — 3 → 011, 7 → 111, 2 → 010.</li>
<li><strong>(1256)<sub>8</sub> → nhị phân</strong> — 1 → 001, 2 → 010, 5 → 101, 6 → 110.</li>
<li><strong>(755)<sub>8</sub> → nhị phân</strong> — chính là con số <code>chmod</code>: 7 → 111 (rwx), 5 → 101 (r-x), 5 → 101 (r-x).</li>
</ul>
<p class="dap-an">✅ Đáp án: (655)<sub>8</sub> = 429 · (27)<sub>8</sub> = 23 · (11111010)<sub>2</sub> = 250 · (1010101110)<sub>2</sub> = 686 · (111101101)<sub>2</sub> = 493. Tất cả đã kiểm hai chiều qua thập phân. Hãy so câu 2 ở đây với câu 2 của slide 19: cùng năm bit ấy là (17)<sub>16</sub> và (27)<sub>8</sub>, cả hai đều bằng 23 — một lời nhắc tốt rằng một giá trị mà thiếu cơ số thì vô nghĩa.</p>
<p class="meo">💡 Bát phân → thập lục phân KHÔNG có quy tắc trực tiếp, vì 8 và 16 là hai luỹ thừa khác nhau của hai nên các chữ số không thẳng hàng với nhau. Đường đi luôn là bát phân → nhị phân → thập lục phân, và đó đúng là nội dung của slide 21.</p>`],

      [21, 'Octal–hexadecimal conversion',
        `<p class="y-chinh">🎯 The last slide, and it teaches a <em>route</em> rather than a rule: to go between octal and hexadecimal, <strong>always pass through binary</strong>. Figure 2.7 shows it in three stacked rows — octal on top, the bit string in the middle, hexadecimal at the bottom — with brackets of three bits going up and brackets of four bits going down.</p>
<ul>
<li><strong>Read the figure's own numbers</strong> — the octal row is 4, 1, 1, 6; the binary row is 1 0 0 0 0 1 0 0 1 1 1 0; the hexadecimal row is 8, 4, E. The brackets above the bits split them in threes; the brackets below split the very same bits in fours.</li>
<li><strong>Why there is no direct rule</strong> — three bits and four bits only line up again every twelve bits (the least common multiple), so there is no fixed "one octal digit equals so many hex digits" relation. Binary is the common denominator of both.</li>
<li><strong>Octal → hexadecimal, the three steps</strong> — (1) expand each octal digit to 3 bits, (2) re-group the whole bit string in 4s from the right, padding on the left, (3) replace each group of 4 with its hex symbol.</li>
<li><strong>Hexadecimal → octal, the mirror</strong> — expand each hex digit to 4 bits, regroup in 3s from the right, read off octal digits. Exactly the same three steps with the two group sizes swapped.</li>
<li><strong>Do not stop at step 1</strong> — the most common mistake is expanding to bits and then reading the groups of three as if they were hex. The whole point of step 2 is that the boundaries move.</li>
<li><strong>The closing idea of the chapter</strong> — all four systems of Table 2.1 are now connected: to decimal by weights (slide 15), from decimal by division and multiplication (slides 17–18), and to each other through bits (slides 19–21). There is no pair of bases left that you cannot get between.</li>
</ul>
<p class="nhan">Figure 2.7 worked through step by step, octal → hexadecimal:</p>
<table>
<tr><th>Step</th><th>What you write</th></tr>
<tr><td>Given</td><td>(4116)<sub>8</sub></td></tr>
<tr><td>1 — each octal digit to 3 bits</td><td>4 → 100 · 1 → 001 · 1 → 001 · 6 → 110</td></tr>
<tr><td>Bit string</td><td>1000 0100 1110 &nbsp; (that is 100·001·001·110 rewritten without the old boundaries)</td></tr>
<tr><td>2 — regroup in 4s from the right</td><td>1000 · 0100 · 1110</td></tr>
<tr><td>3 — each group to a hex symbol</td><td>1000 → 8 · 0100 → 4 · 1110 → E</td></tr>
</table>
<p class="dap-an">✅ (4116)<sub>8</sub> = <strong>(84E)<sub>16</sub></strong>, exactly as Figure 2.7 shows. Verified through decimal in both directions: (4116)<sub>8</sub> = 4×512 + 1×64 + 1×8 + 6 = 2048+64+8+6 = <strong>2126</strong>, and (84E)<sub>16</sub> = 8×256 + 4×16 + 14 = 2048+64+14 = <strong>2126</strong>. ✓ Notice that 12 bits divide evenly by both 3 and 4, which is why this example needed no padding at all.</p>
<p class="nhan">Practice — the route in both directions:</p>
<ul>
<li><strong>(2AE)<sub>16</sub> → octal</strong> — 2 → 0010, A → 1010, E → 1110 gives 001010101110; regroup in 3s: 001 · 010 · 101 · 110.</li>
<li><strong>(755)<sub>8</sub> → hexadecimal</strong> — 111 101 101 gives 111101101; pad to twelve bits: 0001 · 1110 · 1101.</li>
<li><strong>(FF)<sub>16</sub> → octal</strong> — 1111 1111 gives 11111111; pad to nine bits: 011 · 111 · 111.</li>
<li><strong>(1256)<sub>8</sub> → hexadecimal</strong> — 001 010 101 110 gives 001010101110; regroup in 4s: 0010 · 1010 · 1110.</li>
</ul>
<p class="dap-an">✅ Answers: (1256)<sub>8</sub> = 686 · (1ED)<sub>16</sub> = 493 · (377)<sub>8</sub> = 255 · (2AE)<sub>16</sub> = 686. All verified by evaluating both bases in decimal. Items 1 and 4 are each other's inverse, which is the cheapest way to check your own work: convert, then convert back, and you must land on the string you started from.</p>
<p class="meo">💡 The one-line summary of the whole chapter, worth writing on the inside cover of your notes: <em>to or from decimal you must calculate (weights one way, repeated division or multiplication the other); between 2, 8 and 16 you only regroup bits, because 8 and 16 are powers of 2 and 10 is not.</em> Everything on slides 1 to 21 is a consequence of that single asymmetry.</p>`,
        `<p class="y-chinh">🎯 Slide cuối, và nó dạy một <em>ĐƯỜNG ĐI</em> chứ không phải một quy tắc: muốn đi giữa bát phân và thập lục phân thì <strong>luôn đi vòng qua nhị phân</strong>. Figure 2.7 vẽ điều đó thành ba hàng chồng nhau — bát phân ở trên, chuỗi bit ở giữa, thập lục phân ở dưới — với các dấu ngoặc ba bit hướng lên và các dấu ngoặc bốn bit hướng xuống.</p>
<ul>
<li><strong>Đọc chính những con số trong hình</strong> — hàng bát phân là 4, 1, 1, 6; hàng nhị phân là 1 0 0 0 0 1 0 0 1 1 1 0; hàng thập lục phân là 8, 4, E. Các ngoặc phía trên chẻ bit thành nhóm ba; các ngoặc phía dưới chẻ ĐÚNG những bit ấy thành nhóm bốn.</li>
<li><strong>Vì sao không có quy tắc trực tiếp</strong> — ba bit và bốn bit chỉ thẳng hàng lại sau mỗi mười hai bit (bội chung nhỏ nhất), nên không tồn tại một quan hệ cố định kiểu "một chữ số bát phân bằng bấy nhiêu chữ số hex". Nhị phân là mẫu số chung của cả hai.</li>
<li><strong>Bát phân → thập lục phân, ba bước</strong> — (1) trải mỗi chữ số bát phân thành 3 bit, (2) GOM LẠI cả chuỗi bit thành nhóm 4 tính từ bên phải, đệm 0 ở bên trái, (3) thay mỗi nhóm 4 bằng ký hiệu hex của nó.</li>
<li><strong>Thập lục phân → bát phân, ảnh gương</strong> — trải mỗi chữ số hex thành 4 bit, gom lại thành nhóm 3 tính từ bên phải, đọc ra chữ số bát phân. Vẫn đúng ba bước ấy, chỉ tráo hai cỡ nhóm cho nhau.</li>
<li><strong>Đừng dừng lại ở bước 1</strong> — lỗi phổ biến nhất là trải ra bit rồi đọc luôn các nhóm ba như thể chúng là hex. Toàn bộ ý nghĩa của bước 2 nằm ở chỗ các RANH GIỚI phải DỜI ĐI.</li>
<li><strong>Ý chốt của cả chương</strong> — bốn hệ trong Table 2.1 giờ đã nối với nhau hết: về thập phân bằng trọng số (slide 15), từ thập phân bằng chia và nhân (slide 17–18), và nối với nhau qua bit (slide 19–21). Không còn cặp cơ số nào mà bạn không đi qua lại được.</li>
</ul>
<p class="nhan">Giải Figure 2.7 từng bước, bát phân → thập lục phân:</p>
<table>
<tr><th>Bước</th><th>Bạn viết ra gì</th></tr>
<tr><td>Đề cho</td><td>(4116)<sub>8</sub></td></tr>
<tr><td>1 — mỗi chữ số bát phân thành 3 bit</td><td>4 → 100 · 1 → 001 · 1 → 001 · 6 → 110</td></tr>
<tr><td>Chuỗi bit</td><td>1000 0100 1110 &nbsp; (chính là 100·001·001·110 viết lại sau khi xoá ranh giới cũ)</td></tr>
<tr><td>2 — gom lại thành nhóm 4 từ phải sang</td><td>1000 · 0100 · 1110</td></tr>
<tr><td>3 — mỗi nhóm thành một ký hiệu hex</td><td>1000 → 8 · 0100 → 4 · 1110 → E</td></tr>
</table>
<p class="dap-an">✅ (4116)<sub>8</sub> = <strong>(84E)<sub>16</sub></strong>, đúng như Figure 2.7. Kiểm qua thập phân cả hai chiều: (4116)<sub>8</sub> = 4×512 + 1×64 + 1×8 + 6 = 2048+64+8+6 = <strong>2126</strong>, và (84E)<sub>16</sub> = 8×256 + 4×16 + 14 = 2048+64+14 = <strong>2126</strong>. ✓ Để ý 12 bit chia hết cho cả 3 lẫn 4, nên ví dụ này không cần đệm số 0 nào cả.</p>
<p class="nhan">Bài luyện — đi đường ấy theo cả hai chiều:</p>
<ul>
<li><strong>(2AE)<sub>16</sub> → bát phân</strong> — 2 → 0010, A → 1010, E → 1110 được 001010101110; gom lại thành nhóm 3: 001 · 010 · 101 · 110.</li>
<li><strong>(755)<sub>8</sub> → thập lục phân</strong> — 111 101 101 được 111101101; đệm cho đủ mười hai bit: 0001 · 1110 · 1101.</li>
<li><strong>(FF)<sub>16</sub> → bát phân</strong> — 1111 1111 được 11111111; đệm cho đủ chín bit: 011 · 111 · 111.</li>
<li><strong>(1256)<sub>8</sub> → thập lục phân</strong> — 001 010 101 110 được 001010101110; gom lại thành nhóm 4: 0010 · 1010 · 1110.</li>
</ul>
<p class="dap-an">✅ Đáp án: (1256)<sub>8</sub> = 686 · (1ED)<sub>16</sub> = 493 · (377)<sub>8</sub> = 255 · (2AE)<sub>16</sub> = 686. Tất cả đã kiểm bằng cách tính cả hai cơ số ra thập phân. Câu 1 và câu 4 là nghịch đảo của nhau, và đó là cách kiểm bài rẻ nhất: đổi đi rồi đổi lại, phải rơi đúng vào chuỗi ban đầu.</p>
<p class="meo">💡 Câu tổng kết một dòng cho cả chương, đáng viết vào mặt trong bìa vở: <em>đi tới hoặc đi khỏi thập phân thì phải TÍNH (trọng số cho chiều này, chia hoặc nhân liên tiếp cho chiều kia); còn đi giữa 2, 8 và 16 thì chỉ GOM LẠI BIT, vì 8 và 16 là luỹ thừa của 2 còn 10 thì không.</em> Mọi thứ từ slide 1 tới slide 21 đều là hệ quả của đúng một chỗ bất đối xứng ấy.</p>`],

    ]),
  ].join('\n'),
};
