/**
 * CEA201 · Chương 14 trên web (= Chapter 18 bản 11e, syllabus 9th ed gọi là
 * "Chapter 16") — Instruction-Level Parallelism and Superscalar Processors,
 * học theo từng slide, PHẦN A: slide 1–20 của deck 'cea18' (tổng 40 slide).
 *
 * Nội dung bám ĐÚNG chữ trích từ CH18-COA11e.pptx (/tmp/cea201-text/cea18.txt).
 * Slide chỉ có tiêu đề + hình (2, 3, 4, 6, 8, 10, 11, 12, 13, 14, 16, 17, 18,
 * 20) đã ĐỌC THẲNG TỪ ẢNH render để lấy đúng từng nhãn trên sơ đồ.
 *
 * ⚠️ MỌI giản đồ phát lệnh và MỌI số chu kỳ trong bài đã kiểm bằng một bộ lập
 * lịch superscalar viết bằng python3 TRƯỚC khi viết lời giảng:
 *   · Bộ lập lịch tái tạo ĐÚNG Figure 18.5 của sách — 8 / 7 / 6 chu kỳ cho ba
 *     chính sách, và khớp từng ô (kể cả chi tiết I6 thực thi TRƯỚC I5 ở bản
 *     out-of-order). Đây là phép kiểm BỘ KIỂM trước khi tin nó.
 *   · Ví dụ riêng 8 lệnh của bài: 12 / 12 / 11 chu kỳ. Sau đổi tên thanh ghi:
 *     12 / 11 / 9. Mọi WAR (3 cặp) và WAW (1 cặp) biến mất sau đổi tên; RAW
 *     I1→I4 gián tiếp cũng biến mất vì I4 chuyển sang đọc R3c.
 *   · Figure 18.3: đường ống 4 tầng thường xong 6 lệnh ở chu kỳ 9; superpipeline
 *     bậc 2 xong ở 6,5; superscalar bậc 2 xong ở 6. Tại t = 6 base cycle:
 *     3 · 5 · 6 lệnh hoàn thành.
 *   · Table 18.1: 8 số liệu, trung bình 3,422 · trung vị 2,25; bỏ hai giá trị
 *     ngoại lai 8 và 7 thì trung bình còn 2,063.
 *
 * Chỗ slide gốc CẦN NÓI RÕ — nêu thẳng, không im lặng chép, không tự sửa slide:
 *   · Deck KHÔNG có slide nào in định nghĩa chữ nghĩa cho "output dependency"
 *     và "antidependency"; slide 7 chỉ LIỆT KÊ TÊN. Định nghĩa + ví dụ cặp lệnh
 *     lấy từ sách mục 18.2, bài này nói rõ chỗ nào là slide, chỗ nào là sách.
 *   · Figure 18.4 (slide 8) vẽ BỐN ca nhưng chỉ ba trong số năm ràng buộc của
 *     slide 7 (data, procedural, resource) — output dependency và
 *     antidependency KHÔNG có hình.
 *   · Slide 8 tiêu đề dính liền trong bản trích: "Figure 18.4Effect of
 *     Dependencies" (thiếu dấu cách, lỗi của chính file .pptx).
 *   · Slide 13 "Register Renaming (1 of 2)" KHÔNG có ví dụ đổi tên nào; ví dụ
 *     4 lệnh kinh điển nằm trong sách. Slide 26 mới là "(2 of 2)".
 *   · Slide 19 (Table 18.2) ghi ô "Store · Throughput" của dòng L1 data cache
 *     là 3 clock cycles trong khi Latency là 2 — thông lượng CHẬM HƠN độ trễ,
 *     nghe ngược; đây là số in đúng trên slide, nêu lại nguyên văn.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea18';

export default {
  title: '14.0a — Slide by slide: Superscalar, instruction dependencies and the Intel Core front end (slides 1–20)|||14.0a — Slide bài giảng: Superscalar, các phụ thuộc giữa lệnh & đầu-trước Intel Core (slide 1–20)',
  slug: 'cea201-14-0a-slides-superscalar-phu-thuoc-lenh-intel-core',
  type: 'DOCUMENT',
  description: 'Nửa đầu Chương 18 bản 11e (slide 1–20) — chương đưa CPI xuống dưới 1. Đi từ superscalar là gì và khác superpipeline ra sao, qua năm ràng buộc của song song mức lệnh (phụ thuộc dữ liệu thật RAW, phụ thuộc thủ tục, xung đột tài nguyên, phụ thuộc đầu ra WAW, phản phụ thuộc WAR), tới ba chính sách phát lệnh và đổi tên thanh ghi. Có một đoạn 8 lệnh cụ thể được lập lịch bằng máy cho cả ba chính sách (12 / 12 / 11 chu kỳ) rồi đổi tên thanh ghi (12 / 11 / 9), và giản đồ Figure 18.5 của sách được tái dựng khớp từng ô bằng bộ lập lịch python3.',
  content: [
    walkHead(D, 1, 20),
    walk(D, [

      [1, 'Chapter 18 — Instruction-Level Parallelism and Superscalar Processors (title slide)',
        `<p class="y-chinh">🎯 The opening slide of the chapter that breaks a barrier the previous chapters could not: every pipeline you have seen so far tops out at <strong>one instruction completed per cycle</strong>. This chapter is how a processor finishes <em>more than one</em>, i.e. how CPI drops below 1.</p>
<ul>
<li><strong>Numbering warning, read this first.</strong> Your syllabus follows the 9th edition and calls this block <em>"Chapter 16: Instruction-Level Parallelism and Superscalar Processors"</em>. The slide deck in front of you is the 11th edition, where the same material is <strong>Chapter 18</strong>. On the course website it is indexed as <strong>Chapter 14</strong>. Three numbers, one chapter — do not waste exam time hunting for a missing chapter.</li>
<li><strong>What "instruction-level parallelism" means in one line.</strong> ILP is the degree to which the instructions of a program <em>can</em> be executed in parallel (slide 7 gives exactly this definition). It is a property of the <em>program</em>. The hardware's ability to cash it in is called <em>machine parallelism</em>, and slide 9 insists the two are different things.</li>
<li><strong>The chapter has four movements.</strong> Slides 2–6: what a superscalar machine <em>is</em>, and how it differs from a superpipelined one. Slides 7–9: the five <em>constraints</em> that stop you going faster. Slides 10–14: <em>issue policy</em> and <em>register renaming</em> — the two levers that buy the speed back. Slides 15–20 onward: branch prediction, implementation, and a real chip (Intel Core).</li>
<li><strong>Where the exam marks are.</strong> Almost entirely in slides 7, 8, 11 and 13: name the four dependency types, find them in a given code fragment, and draw the issue diagram for the three issue policies. This walkthrough works a full eight-instruction example through all three policies, twice.</li>
<li><strong>What it connects to.</strong> Ch.16 (11e) gave you the basic pipeline and its hazards — this chapter widens that pipeline. Ch.17 gave you RISC, whose fixed-length, register-to-register instructions are precisely what makes multiple issue tractable. Ch.2 gave you CPI; this is the chapter where CPI goes below 1 and the number stops being intuitive.</li>
</ul>
<p class="meo">💡 One sentence to carry through the whole chapter: <strong>a pipeline makes instructions overlap; a superscalar makes them simultaneous.</strong> Deeper pipe = finer slices of the same single track. Superscalar = more tracks.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu của chương phá đúng một rào mà các chương trước không phá nổi: mọi đường ống bạn đã học đều đụng trần ở <strong>MỘT lệnh hoàn thành mỗi chu kỳ</strong>. Chương này nói cách bộ xử lý hoàn thành <em>NHIỀU HƠN MỘT</em>, tức là cách CPI tụt xuống dưới 1.</p>
<ul>
<li><strong>Cảnh báo đánh số, đọc trước đã.</strong> Syllabus của trường theo bản 9th ed nên gọi khối này là <em>"Chapter 16: Instruction-Level Parallelism and Superscalar Processors"</em>. Bộ slide trước mặt bạn là bản 11th ed, ở đó cùng nội dung ấy là <strong>Chapter 18</strong>. Trên web của môn nó được đánh là <strong>Chương 14</strong>. Ba con số, MỘT chương — đừng mất thì giờ đi tìm một chương không tồn tại.</li>
<li><strong>"Song song mức lệnh" (ILP) nghĩa là gì, gói trong một dòng.</strong> ILP là MỨC ĐỘ mà các lệnh của một chương trình <em>CÓ THỂ</em> được chạy song song (slide 7 ghi đúng định nghĩa này). Nó là tính chất của <em>CHƯƠNG TRÌNH</em>. Còn khả năng phần cứng biến nó thành tiền mặt thì gọi là <em>machine parallelism</em> — song song của máy, và slide 9 nhấn mạnh rằng hai thứ đó KHÁC NHAU.</li>
<li><strong>Chương có bốn đoạn.</strong> Slide 2–6: superscalar <em>LÀ GÌ</em>, và khác superpipeline ở đâu. Slide 7–9: năm <em>RÀNG BUỘC</em> chặn bạn chạy nhanh hơn. Slide 10–14: <em>CHÍNH SÁCH PHÁT LỆNH</em> và <em>ĐỔI TÊN THANH GHI</em> — hai cái cần gạt mua lại tốc độ. Slide 15–20 trở đi: dự đoán rẽ nhánh, cách hiện thực, và một con chip thật (Intel Core).</li>
<li><strong>Điểm thi nằm ở đâu.</strong> Gần như trọn vẹn ở slide 7, 8, 11 và 13: gọi tên bốn loại phụ thuộc, tìm chúng trong một đoạn mã cho trước, và vẽ giản đồ phát lệnh cho ba chính sách. Bài này chạy trọn một ví dụ TÁM LỆNH qua cả ba chính sách, HAI lần.</li>
<li><strong>Nó nối vào đâu.</strong> Ch.16 (bản 11e) cho bạn đường ống cơ bản và các hazard — chương này NỚI RỘNG cái đường ống đó. Ch.17 cho bạn RISC, mà lệnh dài cố định, thanh-ghi-sang-thanh-ghi của RISC chính là thứ làm cho phát nhiều lệnh một lúc trở nên khả thi. Ch.2 cho bạn CPI; đây là chương mà CPI xuống dưới 1 và con số đó hết trực giác.</li>
</ul>
<p class="meo">💡 Một câu mang theo suốt chương: <strong>đường ống làm các lệnh GỐI LÊN NHAU; superscalar làm chúng ĐỒNG THỜI.</strong> Ống sâu hơn = cắt cùng một làn đường thành lát mỏng hơn. Superscalar = THÊM LÀN.</p>`],

      [2, 'Superscalar Overview — six statements that define the term',
        `<p class="y-chinh">🎯 Six boxes, and together they are the definition you should be able to write from memory. A superscalar machine is one built to <strong>execute independent instructions concurrently in different pipelines</strong>, and the term was <strong>first coined in 1987</strong>.</p>
<table>
<tr><th>Box on the slide</th><th>Why that sentence is there</th></tr>
<tr><td><strong>Term first coined in 1987</strong></td><td>It is young. RISC (Ch.17) came first and cleared the ground; superscalar is what RISC made affordable</td></tr>
<tr><td><strong>Refers to a machine designed to improve the performance of the execution of scalar instructions</strong></td><td>"Scalar" = ordinary single-value instructions, as opposed to <em>vector</em> instructions. This is <strong>not</strong> a vector machine</td></tr>
<tr><td><strong>In most applications the bulk of the operations are on scalar quantities</strong></td><td>The economic argument: speeding up ordinary code beats speeding up array code, because ordinary code is what there is most of</td></tr>
<tr><td><strong>Represents the next step in the evolution of high-performance general-purpose processors</strong></td><td>Positions it on the timeline: microprogrammed → pipelined → RISC → superscalar</td></tr>
<tr><td><strong>Essence of the approach is the ability to execute instructions independently and concurrently in different pipelines</strong></td><td>This is the actual definition. Note the plural: <em>pipelines</em></td></tr>
<tr><td><strong>Concept can be further exploited by allowing instructions to be executed in an order different from the program order</strong></td><td>This is the trailer for slides 10–12: out-of-order execution</td></tr>
</table>
<ul>
<li><strong>"Scalar" is the word students lose marks on.</strong> A scalar instruction operates on one pair of operands. A <em>vector</em> instruction operates on a whole array at once (SIMD, Ch.20). Superscalar does <em>not</em> mean "better than vector" — it means "several scalar operations at once", which is a different kind of parallelism entirely.</li>
<li><strong>Read box 5 and box 6 as two separate promotions.</strong> Box 5 gets you <em>multiple issue</em> (width). Box 6 gets you <em>out-of-order</em> (flexibility). A machine can have the first without the second — the original Pentium did — and it is still superscalar.</li>
<li><strong>The honest limit.</strong> Nothing here promises a speedup equal to the number of pipelines. Slide 5 will show real machines getting 1.58× to 8×, most of them under 3×, from hardware with several units. The gap between "four pipelines" and "2× faster" is the subject of slide 7.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: "superscalar" describes the <strong>hardware organization</strong> (several complete pipelines). "Instruction-level parallelism" describes the <strong>program</strong>. A question that says "a superscalar processor increases the ILP of a program" is wrong — the ILP was already there, the hardware only harvests it.</p>`,
        `<p class="y-chinh">🎯 Sáu cái hộp, và gộp lại chúng chính là định nghĩa bạn phải viết được từ trí nhớ. Máy superscalar là máy được dựng để <strong>chạy ĐỒNG THỜI các lệnh độc lập trên NHỮNG đường ống KHÁC NHAU</strong>, và thuật ngữ này <strong>xuất hiện lần đầu năm 1987</strong>.</p>
<table>
<tr><th>Hộp trên slide</th><th>Vì sao câu đó có mặt ở đây</th></tr>
<tr><td><strong>Thuật ngữ ra đời năm 1987</strong></td><td>Nó còn TRẺ. RISC (Ch.17) tới trước và dọn đất; superscalar là thứ mà RISC làm cho vừa túi tiền</td></tr>
<tr><td><strong>Chỉ cỗ máy được thiết kế để cải thiện hiệu năng THỰC THI CÁC LỆNH VÔ HƯỚNG (scalar)</strong></td><td>"Scalar" = lệnh thường trên một giá trị, đối lập với lệnh <em>VECTOR</em>. Đây <strong>KHÔNG</strong> phải máy vector</td></tr>
<tr><td><strong>Trong hầu hết ứng dụng, phần lớn phép toán là trên đại lượng vô hướng</strong></td><td>Lập luận kinh tế: tăng tốc mã THƯỜNG lời hơn tăng tốc mã mảng, vì mã thường mới là thứ nhiều nhất</td></tr>
<tr><td><strong>Là bước tiến hoá tiếp theo của bộ xử lý đa dụng hiệu năng cao</strong></td><td>Đặt nó lên dòng thời gian: vi chương trình → đường ống → RISC → superscalar</td></tr>
<tr><td><strong>Cốt lõi là khả năng chạy các lệnh ĐỘC LẬP và ĐỒNG THỜI trên các đường ống khác nhau</strong></td><td>Đây mới là định nghĩa thật. Để ý số nhiều: <em>CÁC đường ống</em></td></tr>
<tr><td><strong>Ý tưởng còn khai thác được xa hơn bằng cách cho phép lệnh chạy theo thứ tự KHÁC thứ tự chương trình</strong></td><td>Đây là lời rao trước cho slide 10–12: thực thi không theo thứ tự</td></tr>
</table>
<ul>
<li><strong>"Scalar" là chữ sinh viên hay mất điểm nhất.</strong> Lệnh vô hướng thao tác trên MỘT cặp toán hạng. Lệnh <em>VECTOR</em> thao tác trên cả một mảng cùng lúc (SIMD, Ch.20). Superscalar KHÔNG có nghĩa "xịn hơn vector" — nó nghĩa là "nhiều phép vô hướng cùng lúc", một kiểu song song hoàn toàn khác.</li>
<li><strong>Đọc hộp 5 và hộp 6 như HAI lần thăng hạng riêng biệt.</strong> Hộp 5 cho bạn <em>PHÁT NHIỀU LỆNH</em> (bề rộng). Hộp 6 cho bạn <em>KHÔNG THEO THỨ TỰ</em> (độ linh hoạt). Một cỗ máy có thể có cái thứ nhất mà không có cái thứ hai — Pentium đời đầu đúng như vậy — và nó vẫn là superscalar.</li>
<li><strong>Giới hạn nói thật.</strong> Không có chữ nào ở đây hứa rằng tốc độ tăng bằng số đường ống. Slide 5 sẽ trưng ra các máy thật đạt 1,58× tới 8×, phần lớn dưới 3×, dù phần cứng có vài đơn vị chức năng. Khoảng cách giữa "bốn đường ống" và "nhanh gấp 2" chính là chủ đề của slide 7.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: "superscalar" mô tả <strong>TỔ CHỨC PHẦN CỨNG</strong> (nhiều đường ống hoàn chỉnh). "Song song mức lệnh" mô tả <strong>CHƯƠNG TRÌNH</strong>. Câu nào nói "bộ xử lý superscalar làm TĂNG ILP của chương trình" là SAI — ILP vốn đã có sẵn, phần cứng chỉ đi GẶT.</p>`],

      [3, 'Figure 18.1 — Superscalar Organization Compared to Ordinary Scalar Organization',
        `<p class="y-chinh">🎯 Two block diagrams stacked, and the difference between them is the entire chapter in one picture: <strong>(a) scalar has ONE pipelined integer unit and ONE pipelined floating-point unit; (b) superscalar has SEVERAL of each.</strong> Everything else — the register files, the memory — is identical.</p>
<table>
<tr><th>Block on the figure</th><th>(a) Scalar organization</th><th>(b) Superscalar organization</th></tr>
<tr><td>Integer register file</td><td>one, narrow</td><td>one, but <strong>wider</strong> (drawn stretched) — more read/write ports</td></tr>
<tr><td>Floating point register file</td><td>one, narrow</td><td>one, <strong>wider</strong></td></tr>
<tr><td>Pipelined integer functional unit<strong>s</strong></td><td><strong>1</strong></td><td><strong>several</strong> (drawn as boxes with "…" between them)</td></tr>
<tr><td>Pipelined floating-point functional unit<strong>s</strong></td><td><strong>1</strong></td><td><strong>several</strong></td></tr>
<tr><td>Memory</td><td>one block, centre</td><td>one block, centre — unchanged</td></tr>
</table>
<ul>
<li><strong>The hidden cost is in the register file, not the ALUs.</strong> Adding a second integer unit is cheap; feeding it is not. Two integer instructions per cycle need <strong>four read ports and two write ports</strong> instead of two and one. Register file area and delay grow roughly with the <em>square</em> of the port count — that is why the boxes in (b) are drawn physically wider, and why nobody builds a 16-issue machine.</li>
<li><strong>Memory did not multiply.</strong> Look carefully: there is still one Memory block. If two instructions both want to load in the same cycle, one waits. That is a <strong>resource conflict</strong> (slide 7), and it is why real designs add a second load/store port or a banked/dual-ported L1 D-cache (Ch.5).</li>
<li><strong>"Pipelined" is doing work in the label.</strong> Each functional unit is itself a pipeline. So a superscalar is <em>parallel pipelines</em>: at any instant, unit 1 may hold four instructions in four stages and unit 2 another four. Total instructions in flight = width × depth.</li>
<li><strong>Integer and floating-point are kept apart on purpose.</strong> FP operations take longer (multi-cycle multiply, many-cycle divide), so they get their own register file and their own units. A long FP divide then cannot block a one-cycle integer add — an important source of the out-of-order completion you will see on slide 11.</li>
</ul>
<p class="meo">💡 Remember Figure 18.1 as <strong>"copy-paste the functional unit, widen the register file, leave memory alone"</strong>. Those three verbs also predict the three things that go wrong: port pressure, memory conflicts, and the need to write results back in the right order.</p>`,
        `<p class="y-chinh">🎯 Hai sơ đồ khối xếp chồng, và khác biệt giữa chúng chính là cả chương gói trong một bức tranh: <strong>(a) scalar có MỘT đơn vị số nguyên đường ống và MỘT đơn vị dấu chấm động đường ống; (b) superscalar có NHIỀU cái mỗi loại.</strong> Mọi thứ còn lại — tệp thanh ghi, bộ nhớ — y hệt nhau.</p>
<table>
<tr><th>Khối trên hình</th><th>(a) Tổ chức scalar</th><th>(b) Tổ chức superscalar</th></tr>
<tr><td>Tệp thanh ghi số nguyên</td><td>một, hẹp</td><td>một, nhưng <strong>RỘNG HƠN</strong> (vẽ kéo dài) — nhiều cổng đọc/ghi hơn</td></tr>
<tr><td>Tệp thanh ghi dấu chấm động</td><td>một, hẹp</td><td>một, <strong>RỘNG HƠN</strong></td></tr>
<tr><td>Đơn vị số nguyên đường ống</td><td><strong>1</strong></td><td><strong>NHIỀU</strong> (vẽ thành các hộp có dấu "…" ở giữa)</td></tr>
<tr><td>Đơn vị dấu chấm động đường ống</td><td><strong>1</strong></td><td><strong>NHIỀU</strong></td></tr>
<tr><td>Memory (bộ nhớ)</td><td>một khối, ở giữa</td><td>một khối, ở giữa — KHÔNG đổi</td></tr>
</table>
<ul>
<li><strong>Cái giá ẩn nằm ở TỆP THANH GHI, không nằm ở ALU.</strong> Thêm một đơn vị số nguyên thì rẻ; NUÔI nó mới đắt. Hai lệnh số nguyên mỗi chu kỳ cần <strong>BỐN cổng đọc và HAI cổng ghi</strong> thay vì hai và một. Diện tích và độ trễ của tệp thanh ghi tăng xấp xỉ theo <em>BÌNH PHƯƠNG</em> số cổng — đó là lý do các hộp trong (b) được vẽ rộng ra thật, và là lý do không ai dựng máy phát 16 lệnh.</li>
<li><strong>Bộ nhớ KHÔNG được nhân lên.</strong> Nhìn kỹ: vẫn chỉ một khối Memory. Nếu hai lệnh cùng muốn nạp trong một chu kỳ thì một cái phải chờ. Đó là <strong>XUNG ĐỘT TÀI NGUYÊN</strong> (slide 7), và là lý do thiết kế thật phải thêm cổng load/store thứ hai hoặc dùng L1 D-cache chia băng/hai cổng (Ch.5).</li>
<li><strong>Chữ "Pipelined" trong nhãn làm việc thật.</strong> Bản thân mỗi đơn vị chức năng đã là một đường ống. Nên superscalar là <em>NHIỀU ĐƯỜNG ỐNG SONG SONG</em>: tại một thời điểm, đơn vị 1 có thể đang giữ bốn lệnh ở bốn tầng và đơn vị 2 giữ bốn lệnh nữa. Tổng số lệnh đang bay = BỀ RỘNG × ĐỘ SÂU.</li>
<li><strong>Số nguyên và dấu chấm động bị tách riêng CÓ CHỦ Ý.</strong> Phép dấu chấm động lâu hơn (nhân nhiều chu kỳ, chia rất nhiều chu kỳ) nên được cấp tệp thanh ghi riêng và đơn vị riêng. Nhờ vậy một phép chia FP dài không chặn được một phép cộng số nguyên một chu kỳ — nguồn gốc quan trọng của "hoàn thành không theo thứ tự" mà bạn sẽ gặp ở slide 11.</li>
</ul>
<p class="meo">💡 Nhớ Figure 18.1 bằng ba động từ: <strong>"CHÉP thêm đơn vị chức năng, NỚI rộng tệp thanh ghi, ĐỂ YÊN bộ nhớ"</strong>. Ba động từ đó cũng dự báo luôn ba thứ sẽ hỏng: áp lực cổng thanh ghi, xung đột bộ nhớ, và nhu cầu ghi kết quả về ĐÚNG THỨ TỰ.</p>`],

      [4, 'Figure 18.2 — Generic Superscalar Organization (degree = 4)',
        `<p class="y-chinh">🎯 The real machine, drawn end to end, with a <strong>degree of 4</strong> — four instructions move through every stage per cycle. This one figure contains every box the rest of the chapter will name, so it is worth spending five minutes on.</p>
<table>
<tr><th>Stage on the figure</th><th>Boxes drawn</th><th>What happens there</th></tr>
<tr><td>Supply</td><td><strong>L2 Cache → PD → I-cache → IF → I-buffer → ID</strong></td><td>PD = predecode, IF = instruction fetch, ID = instruction decode. Four instructions per cycle come out</td></tr>
<tr><td>Issue</td><td><strong>Issue window</strong> (4 red slots) → <strong>Issue</strong> bar → <strong>Reservation stations</strong></td><td>The window holds decoded instructions waiting for operands; reservation stations hold them at the door of each unit</td></tr>
<tr><td>Execute</td><td><strong>MUL MUL MUL / MUL MUL MUL / ALU / CTU / LSU</strong></td><td>Two 3-stage pipelined multiply units, one ALU, one control/transfer unit (branches), one load/store unit</td></tr>
<tr><td>Finish &amp; commit</td><td><strong>Reorder buffer → WB → Register File</strong></td><td>Labels on the arrows read <em>Issue → Dispatch → Finish → Complete</em>. FWD is the forwarding path back to the reservation stations</td></tr>
<tr><td>Memory side</td><td><strong>Store buffer ↔ LSU ↔ D-cache ↔ L2 Cache</strong></td><td>Stores are buffered so a store never stalls the pipeline waiting on cache</td></tr>
</table>
<ul>
<li><strong>Read the four verbs printed on the arrows — they are the exam vocabulary.</strong> <em>Issue</em> = leave the window for a functional unit. <em>Dispatch</em> = hand the instruction to the unit. <em>Finish</em> = execution done, result exists but is not architecturally visible. <em>Complete</em> (also called <em>commit</em> or <em>retire</em>) = the result is written into the register file and the instruction officially happened. Slide 11's three policies are about the ordering of <em>issue</em> versus <em>complete</em>.</li>
<li><strong>The reorder buffer is why out-of-order is safe.</strong> Instructions may finish in any order, but the ROB releases their results to the register file <em>in program order</em>. So an interrupt or a mispredicted branch can throw away everything after a given point and the machine looks exactly as if it had run sequentially. Slide 24 (later half of the deck) gives the Intel version: 126 micro-ops tracked at once.</li>
<li><strong>Count the units and you can predict the resource conflicts.</strong> Degree 4 but only ONE ALU, ONE LSU, ONE branch unit. So four simple ADDs arriving together cannot all go — three wait. "Degree of 4" is about the <em>width of the pipe</em>, never a promise that any four instructions fit.</li>
<li><strong>FWD (forwarding) is the same trick as in the basic pipeline.</strong> A result is sent straight from the output of a unit back to the inputs of the reservation stations, without going through the register file. Without it, every RAW dependency would cost the full write-then-read latency. This is why, in the simulations later in this lesson, a dependent instruction can start in the cycle <em>immediately after</em> its producer finishes executing.</li>
</ul>
<p class="meo">💡 Trace one instruction with your finger: <strong>L2 → PD → I-cache → IF → I-buffer → ID → issue window → reservation station → a functional unit → reorder buffer → WB → register file.</strong> Say the four arrow-verbs out loud as you pass them. If you can do that from memory you can answer most descriptive questions on this chapter.</p>`,
        `<p class="y-chinh">🎯 Cỗ máy THẬT, vẽ từ đầu tới cuối, với <strong>bậc bằng 4</strong> — bốn lệnh đi qua mỗi tầng mỗi chu kỳ. Riêng hình này chứa mọi cái hộp mà phần còn lại của chương sẽ gọi tên, nên bỏ ra năm phút cho nó là đáng.</p>
<table>
<tr><th>Tầng trên hình</th><th>Các hộp được vẽ</th><th>Ở đó xảy ra chuyện gì</th></tr>
<tr><td>Cấp lệnh</td><td><strong>L2 Cache → PD → I-cache → IF → I-buffer → ID</strong></td><td>PD = giải mã sơ bộ, IF = nạp lệnh, ID = giải mã lệnh. Ra bốn lệnh mỗi chu kỳ</td></tr>
<tr><td>Phát lệnh</td><td><strong>Issue window</strong> (4 ô đỏ) → thanh <strong>Issue</strong> → <strong>Reservation stations</strong></td><td>Cửa sổ giữ các lệnh đã giải mã đang chờ toán hạng; trạm đặt chỗ giữ chúng ngay trước cửa mỗi đơn vị</td></tr>
<tr><td>Thực thi</td><td><strong>MUL MUL MUL / MUL MUL MUL / ALU / CTU / LSU</strong></td><td>Hai đơn vị nhân đường ống 3 tầng, một ALU, một đơn vị điều khiển/rẽ nhánh (CTU), một đơn vị nạp/lưu (LSU)</td></tr>
<tr><td>Kết thúc &amp; chốt</td><td><strong>Reorder buffer → WB → Register File</strong></td><td>Nhãn trên các mũi tên ghi <em>Issue → Dispatch → Finish → Complete</em>. FWD là đường chuyển tiếp quay ngược về trạm đặt chỗ</td></tr>
<tr><td>Phía bộ nhớ</td><td><strong>Store buffer ↔ LSU ↔ D-cache ↔ L2 Cache</strong></td><td>Lệnh lưu được đệm lại để một lệnh lưu không bao giờ chặn đường ống chờ cache</td></tr>
</table>
<ul>
<li><strong>Đọc BỐN động từ in trên các mũi tên — đó là từ vựng đi thi.</strong> <em>Issue</em> (phát) = rời cửa sổ để tới một đơn vị chức năng. <em>Dispatch</em> (giao) = trao lệnh cho đơn vị. <em>Finish</em> (xong) = thực thi xong, kết quả đã có nhưng CHƯA nhìn thấy được ở mức kiến trúc. <em>Complete</em> (hoàn thành, còn gọi là <em>commit</em>/<em>retire</em>) = kết quả được ghi vào tệp thanh ghi và lệnh CHÍNH THỨC đã xảy ra. Ba chính sách ở slide 11 nói về thứ tự của <em>issue</em> so với <em>complete</em>.</li>
<li><strong>Bộ đệm sắp xếp lại (reorder buffer) là lý do "không theo thứ tự" vẫn AN TOÀN.</strong> Lệnh được phép XONG theo thứ tự bất kỳ, nhưng ROB chỉ nhả kết quả của chúng vào tệp thanh ghi <em>THEO ĐÚNG THỨ TỰ CHƯƠNG TRÌNH</em>. Nhờ vậy một ngắt hay một nhánh đoán sai có thể vứt bỏ mọi thứ sau một điểm cho trước, và cỗ máy nhìn y như thể nó chạy tuần tự. Slide 24 (nửa sau của deck) cho bản Intel: theo dõi 126 micro-op cùng lúc.</li>
<li><strong>Đếm số đơn vị là đoán được xung đột tài nguyên.</strong> Bậc 4 nhưng chỉ MỘT ALU, MỘT LSU, MỘT đơn vị rẽ nhánh. Nên bốn lệnh ADD đơn giản tới cùng lúc thì KHÔNG thể đi hết — ba cái phải chờ. "Bậc 4" nói về <em>BỀ RỘNG CỦA ỐNG</em>, không bao giờ là lời hứa rằng bốn lệnh BẤT KỲ sẽ lọt.</li>
<li><strong>FWD (chuyển tiếp) là đúng mẹo của đường ống cơ bản.</strong> Kết quả được gửi thẳng từ đầu ra của một đơn vị về đầu vào các trạm đặt chỗ, không đi vòng qua tệp thanh ghi. Không có nó thì mọi phụ thuộc RAW đều phải trả trọn độ trễ ghi-rồi-đọc. Đây chính là lý do trong các mô phỏng ở phần sau của bài, một lệnh phụ thuộc có thể khởi động ngay <em>CHU KỲ KẾ TIẾP</em> sau khi lệnh sinh ra nó thực thi xong.</li>
</ul>
<p class="meo">💡 Lấy ngón tay dò theo MỘT lệnh: <strong>L2 → PD → I-cache → IF → I-buffer → ID → cửa sổ phát → trạm đặt chỗ → một đơn vị chức năng → reorder buffer → WB → tệp thanh ghi.</strong> Vừa dò vừa đọc to bốn động từ trên mũi tên. Làm được từ trí nhớ là trả lời được phần lớn câu hỏi mô tả của chương này.</p>`],

      [5, 'Table 18.1 — Reported Speedups of Superscalar-Like Machines',
        `<p class="y-chinh">🎯 Eight published measurements, and the honest message is <strong>how much they disagree</strong>: from 1.58× to 8×. This table is the reality check against the fantasy that "four pipelines means four times faster".</p>
<table>
<tr><th>Reference</th><th>Speedup</th><th>Reference</th><th>Speedup</th></tr>
<tr><td>[TJAD70]</td><td>1.8</td><td>[SOHI90]</td><td>1.8</td></tr>
<tr><td>[KUCK77]</td><td><strong>8</strong></td><td>[SMIT89]</td><td>2.3</td></tr>
<tr><td>[WEIS84]</td><td><strong>1.58</strong></td><td>[JOUP89b]</td><td>2.2</td></tr>
<tr><td>[ACOS86]</td><td>2.7</td><td>[LEE91]</td><td><strong>7</strong></td></tr>
</table>
<p class="nhan">📐 Worked with <code>python3</code> rather than eyeballed — eight values 1.8, 8, 1.58, 2.7, 1.8, 2.3, 2.2, 7:</p>
<table>
<tr><th>Statistic</th><th>Value</th><th>Reading</th></tr>
<tr><td>Minimum</td><td><strong>1.58</strong> [WEIS84]</td><td>Barely more than a scalar machine</td></tr>
<tr><td>Maximum</td><td><strong>8</strong> [KUCK77]</td><td>Five times the minimum, same idea</td></tr>
<tr><td>Arithmetic mean</td><td><strong>3.422</strong></td><td>Dragged up by the two outliers</td></tr>
<tr><td>Median</td><td><strong>2.25</strong></td><td>The honest centre</td></tr>
<tr><td>Mean after dropping 8 and 7</td><td><strong>2.063</strong></td><td>Six of the eight studies cluster near 2×</td></tr>
</table>
<p class="dap-an">✅ Answer to "what speedup does superscalar actually give?": the typical reported figure is <strong>about 2×</strong> (median 2.25, trimmed mean 2.06), not the 4× or 8× the hardware width suggests. The two studies reporting 7 and 8 are outliers — and, as the textbook notes, they assumed idealised machines with unlimited resources and no procedural dependencies, which is exactly what Figure 18.7 (slide 14) measures separately.</p>
<ul>
<li><strong>Why the spread is so wide — and why that is not sloppy research.</strong> Each study assumed a different machine (different number of units, window size, whether renaming existed) and ran different benchmarks. A speedup number is meaningless without both. This is the same lesson Ch.2 taught with SPEC: <em>a performance number is a triple (machine, workload, metric), never a single scalar.</em></li>
<li><strong>Convert to CPI so it connects to Ch.2.</strong> If the base machine has CPI = 1, a 1.8× speedup means CPI = 1/1.8 = <strong>0.556</strong>, and a 2.2× speedup means CPI = <strong>0.455</strong>. IPC (instructions per cycle) = the speedup itself. This is the chapter where CPI stops being ≥ 1 and you must be careful which of the two numbers a question is asking for.</li>
<li><strong>Amdahl's law is the reason for the ceiling.</strong> Whatever fraction of the program cannot be parallelised — the dependent chains — sets the floor on execution time no matter how many units you add. Slide 7 lists the five specific mechanisms that create that non-parallelisable fraction.</li>
<li><strong>The dates matter.</strong> [TJAD70] is 1970, seventeen years before the word "superscalar" existed. The idea of issuing several instructions at once was studied long before anyone could build it cheaply; RISC (Ch.17) is what made it affordable.</li>
</ul>
<p class="pitfall">⚠️ Do not quote "superscalar gives 8× speedup" from this table. One study out of eight says so, under idealised assumptions. If an exam asks for a typical figure, say <strong>around 2×</strong> and name the reason for the ceiling (dependencies, slide 7).</p>`,
        `<p class="y-chinh">🎯 Tám phép đo đã công bố, và thông điệp thành thật nằm ở chỗ <strong>chúng KHÔNG ĐỒNG Ý với nhau</strong>: từ 1,58× tới 8×. Bảng này là gáo nước lạnh dội vào ảo tưởng "bốn đường ống nghĩa là nhanh gấp bốn".</p>
<table>
<tr><th>Tài liệu</th><th>Tăng tốc</th><th>Tài liệu</th><th>Tăng tốc</th></tr>
<tr><td>[TJAD70]</td><td>1,8</td><td>[SOHI90]</td><td>1,8</td></tr>
<tr><td>[KUCK77]</td><td><strong>8</strong></td><td>[SMIT89]</td><td>2,3</td></tr>
<tr><td>[WEIS84]</td><td><strong>1,58</strong></td><td>[JOUP89b]</td><td>2,2</td></tr>
<tr><td>[ACOS86]</td><td>2,7</td><td>[LEE91]</td><td><strong>7</strong></td></tr>
</table>
<p class="nhan">📐 Tính bằng <code>python3</code> chứ không nhẩm bằng mắt — tám giá trị 1,8 · 8 · 1,58 · 2,7 · 1,8 · 2,3 · 2,2 · 7:</p>
<table>
<tr><th>Thống kê</th><th>Giá trị</th><th>Đọc ra sao</th></tr>
<tr><td>Nhỏ nhất</td><td><strong>1,58</strong> [WEIS84]</td><td>Nhỉnh hơn máy scalar không đáng kể</td></tr>
<tr><td>Lớn nhất</td><td><strong>8</strong> [KUCK77]</td><td>Gấp năm lần cái nhỏ nhất, cùng một ý tưởng</td></tr>
<tr><td>Trung bình cộng</td><td><strong>3,422</strong></td><td>Bị hai giá trị ngoại lai kéo lên</td></tr>
<tr><td>Trung vị</td><td><strong>2,25</strong></td><td>Tâm điểm thành thật</td></tr>
<tr><td>Trung bình sau khi bỏ 8 và 7</td><td><strong>2,063</strong></td><td>Sáu trong tám nghiên cứu xúm quanh mức 2×</td></tr>
</table>
<p class="dap-an">✅ Đáp cho câu "superscalar thật ra tăng tốc bao nhiêu?": con số hay gặp là <strong>khoảng 2×</strong> (trung vị 2,25, trung bình cắt ngoại lai 2,06), KHÔNG phải 4× hay 8× như bề rộng phần cứng gợi ý. Hai nghiên cứu báo 7 và 8 là ngoại lai — và như sách ghi chú, chúng giả định máy lý tưởng với tài nguyên vô hạn và KHÔNG có phụ thuộc thủ tục, đúng là thứ mà Figure 18.7 (slide 14) đo riêng.</p>
<ul>
<li><strong>Vì sao khoảng rộng đến thế — và vì sao đó KHÔNG phải nghiên cứu cẩu thả.</strong> Mỗi nghiên cứu giả định một cỗ máy khác nhau (số đơn vị khác, cửa sổ khác, có đổi tên thanh ghi hay không) và chạy bộ benchmark khác nhau. Một con số tăng tốc là VÔ NGHĨA nếu thiếu cả hai. Đây đúng là bài học Ch.2 dạy với SPEC: <em>một con số hiệu năng là một BỘ BA (máy, tải, thước đo), không bao giờ là một số đơn lẻ.</em></li>
<li><strong>Đổi sang CPI để nối với Ch.2.</strong> Nếu máy nền có CPI = 1 thì tăng tốc 1,8× nghĩa là CPI = 1/1,8 = <strong>0,556</strong>, và 2,2× nghĩa là CPI = <strong>0,455</strong>. Còn IPC (số lệnh mỗi chu kỳ) thì đúng bằng chính hệ số tăng tốc. Đây là chương mà CPI thôi còn ≥ 1, và bạn phải cẩn thận xem đề đang hỏi con số nào trong hai con số đó.</li>
<li><strong>Định luật Amdahl là lý do của cái trần.</strong> Phần nào của chương trình không song song hoá được — những chuỗi lệnh phụ thuộc nhau — đặt ra một SÀN cho thời gian chạy, thêm bao nhiêu đơn vị cũng vô ích. Slide 7 liệt kê đúng năm cơ chế tạo ra cái phần không song song hoá được ấy.</li>
<li><strong>Năm tháng cũng có ý nghĩa.</strong> [TJAD70] là năm 1970, mười bảy năm trước khi chữ "superscalar" tồn tại. Ý tưởng phát nhiều lệnh cùng lúc đã được nghiên cứu từ rất lâu trước khi ai đó dựng nổi nó với giá phải chăng; RISC (Ch.17) mới là thứ làm nó vừa túi tiền.</li>
</ul>
<p class="pitfall">⚠️ Đừng trích "superscalar cho tăng tốc 8×" từ bảng này. Một trên tám nghiên cứu nói vậy, dưới giả định lý tưởng hoá. Đề hỏi con số điển hình thì trả lời <strong>khoảng 2×</strong> và nêu luôn lý do của cái trần (các phụ thuộc, slide 7).</p>`],

      [6, 'Figure 18.3 — Comparison of Superscalar and Superpipeline Approaches',
        `<p class="y-chinh">🎯 Three timing diagrams stacked, all drawn against the same horizontal axis "<strong>Time in base cycles</strong>" 0 to 9, with the key <em>Ifetch | Decode | Execute | Write</em>. Top: a <strong>simple 4-stage pipeline</strong>. Middle: <strong>superpipelined</strong>. Bottom: <strong>superscalar</strong>. This is the single most exam-likely figure in the first half of the chapter.</p>
<table>
<tr><th></th><th>Simple 4-stage pipeline</th><th>Superpipelined (degree 2)</th><th>Superscalar (degree 2)</th></tr>
<tr><td><strong>The trick</strong></td><td>4 stages, 1 instruction issued per base cycle</td><td>Each stage split into <strong>2 half-cycle sub-stages</strong>; 1 instruction issued per <em>half</em> cycle</td><td><strong>2 complete pipelines</strong>; 2 instructions issued per base cycle</td></tr>
<tr><td><strong>How the bars look</strong></td><td>One bar per row, each starting 1 cycle after the one above</td><td>Bars are <em>thinner</em> and start half a cycle apart</td><td>Bars are <em>stacked in pairs</em>, two rows starting at the same time</td></tr>
<tr><td><strong>Clock</strong></td><td>base</td><td><strong>double-rate</strong> — needs faster logic and more latches</td><td>base — same clock as the simple pipeline</td></tr>
<tr><td><strong>Extra hardware</strong></td><td>—</td><td>More pipeline registers, tighter timing</td><td>Duplicated functional units, wider register file</td></tr>
<tr><td><strong>Cost of a mispredicted branch</strong></td><td>4 stages to refill</td><td><strong>8 sub-stages</strong> to refill — worse</td><td>4 stages × 2 instructions = a whole <em>bundle</em> lost</td></tr>
</table>
<p class="nhan">📐 Computed with <code>python3</code> from the figure's own model (six instructions, each 4 base cycles of work), <em>not</em> read off the picture by eye. Instruction <em>k</em> finishes at: base <code>k + 4</code> · superpipelined <code>k/2 + 4</code> · superscalar <code>floor(k/2) + 4</code>:</p>
<table>
<tr><th>Time (base cycles)</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th></tr>
<tr><td>Simple pipeline — instructions completed</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td><strong>6</strong></td></tr>
<tr><td>Superpipelined — instructions completed</td><td>1</td><td>3</td><td>5</td><td><strong>6</strong></td><td>6</td><td>6</td></tr>
<tr><td>Superscalar — instructions completed</td><td>2</td><td>4</td><td><strong>6</strong></td><td>6</td><td>6</td><td>6</td></tr>
</table>
<p class="dap-an">✅ Answer: over the same six instructions, the simple pipeline finishes at <strong>cycle 9</strong>, superpipelined at <strong>6.5</strong>, superscalar at <strong>6</strong>. At <em>t</em> = 6 base cycles the three machines have completed <strong>3 · 5 · 6</strong> instructions respectively. So both advanced schemes deliver roughly 2× — matching Table 18.1's median — and superscalar is slightly ahead because it issues its pair <em>simultaneously</em> rather than half a cycle apart.</p>
<ul>
<li><strong>The one-line distinction to memorise.</strong> <strong>Superpipelined = more stages, faster clock, still ONE instruction at a time.</strong> <strong>Superscalar = more pipelines, same clock, SEVERAL instructions at a time.</strong> Both raise throughput ~2×; neither shortens the latency of any single instruction (still 4 base cycles of work).</li>
<li><strong>Why superscalar won in industry.</strong> Superpipelining needs an ever-faster clock, and clock speed hit a power wall around 2004 (Ch.2's power density story). Duplicating units costs area, which Moore's law kept giving away for free. Every mainstream CPU today is superscalar; the deep-pipeline extreme (Pentium 4, 20+ stages) was abandoned.</li>
<li><strong>Branches hurt both, but differently.</strong> A deeper pipe has more stages to flush; a wider pipe throws away a whole bundle per flush. That is why slide 15 says branch prediction becomes <em>more</em> important, not less, as machines get wider and deeper.</li>
<li><strong>Nothing stops you doing both.</strong> Real processors are superscalar <em>and</em> deeply pipelined — Intel Core (slide 18) is 4-wide with ~14 stages. The figure separates them only so you can name the mechanism when an exam question describes one.</li>
</ul>
<p class="meo">💡 Mnemonic: <strong>superPIPElined = thinner SLICES of one pipe · superSCALAR = more PIPES.</strong> If the question mentions "each stage divided in two" or "clock doubled" → superpipelined. If it mentions "two ALUs", "issue two instructions per cycle", "degree" → superscalar.</p>`,
        `<p class="y-chinh">🎯 Ba giản đồ thời gian xếp chồng, cùng vẽ trên một trục ngang "<strong>Time in base cycles</strong>" từ 0 tới 9, với chú giải <em>Ifetch | Decode | Execute | Write</em>. Trên cùng: <strong>đường ống 4 tầng thường</strong>. Giữa: <strong>superpipelined</strong>. Dưới: <strong>superscalar</strong>. Đây là hình DỄ RA ĐỀ nhất của nửa đầu chương.</p>
<table>
<tr><th></th><th>Đường ống 4 tầng thường</th><th>Superpipeline (bậc 2)</th><th>Superscalar (bậc 2)</th></tr>
<tr><td><strong>Mẹo của nó</strong></td><td>4 tầng, phát 1 lệnh mỗi chu kỳ nền</td><td>Mỗi tầng CHẺ ĐÔI thành <strong>2 tầng con nửa chu kỳ</strong>; phát 1 lệnh mỗi <em>NỬA</em> chu kỳ</td><td><strong>2 đường ống hoàn chỉnh</strong>; phát 2 lệnh mỗi chu kỳ nền</td></tr>
<tr><td><strong>Các thanh trông thế nào</strong></td><td>Mỗi hàng một thanh, hàng dưới bắt đầu sau hàng trên 1 chu kỳ</td><td>Thanh <em>MỎNG HƠN</em>, cách nhau nửa chu kỳ</td><td>Thanh <em>XẾP THÀNH CẶP</em>, hai hàng bắt đầu cùng lúc</td></tr>
<tr><td><strong>Xung nhịp</strong></td><td>nền</td><td><strong>GẤP ĐÔI</strong> — cần logic nhanh hơn và nhiều chốt hơn</td><td>nền — y hệt đường ống thường</td></tr>
<tr><td><strong>Phần cứng thêm</strong></td><td>—</td><td>Nhiều thanh ghi đường ống hơn, định thời gắt hơn</td><td>Nhân bản đơn vị chức năng, nới rộng tệp thanh ghi</td></tr>
<tr><td><strong>Giá của một nhánh đoán sai</strong></td><td>Nạp lại 4 tầng</td><td>Nạp lại <strong>8 tầng con</strong> — TỆ HƠN</td><td>4 tầng × 2 lệnh = mất nguyên một <em>BÓ</em></td></tr>
</table>
<p class="nhan">📐 Tính bằng <code>python3</code> theo đúng mô hình của chính hình (sáu lệnh, mỗi lệnh 4 chu kỳ nền công việc), <em>KHÔNG</em> nhìn hình đoán bằng mắt. Lệnh thứ <em>k</em> xong tại: thường <code>k + 4</code> · superpipeline <code>k/2 + 4</code> · superscalar <code>floor(k/2) + 4</code>:</p>
<table>
<tr><th>Thời điểm (chu kỳ nền)</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th></tr>
<tr><td>Đường ống thường — số lệnh đã xong</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td><strong>6</strong></td></tr>
<tr><td>Superpipeline — số lệnh đã xong</td><td>1</td><td>3</td><td>5</td><td><strong>6</strong></td><td>6</td><td>6</td></tr>
<tr><td>Superscalar — số lệnh đã xong</td><td>2</td><td>4</td><td><strong>6</strong></td><td>6</td><td>6</td><td>6</td></tr>
</table>
<p class="dap-an">✅ Đáp án: với cùng sáu lệnh, đường ống thường xong ở <strong>chu kỳ 9</strong>, superpipeline ở <strong>6,5</strong>, superscalar ở <strong>6</strong>. Tại <em>t</em> = 6 chu kỳ nền, ba cỗ máy đã hoàn thành lần lượt <strong>3 · 5 · 6</strong> lệnh. Vậy cả hai lối tiên tiến đều cho khoảng 2× — khớp với trung vị của Table 18.1 — và superscalar nhỉnh hơn vì nó phát cả cặp <em>CÙNG MỘT LÚC</em> chứ không lệch nhau nửa chu kỳ.</p>
<ul>
<li><strong>Câu phân biệt phải thuộc lòng.</strong> <strong>Superpipeline = NHIỀU TẦNG HƠN, xung nhịp NHANH HƠN, vẫn MỘT lệnh một lúc.</strong> <strong>Superscalar = NHIỀU ĐƯỜNG ỐNG HƠN, xung nhịp GIỮ NGUYÊN, NHIỀU lệnh một lúc.</strong> Cả hai nâng thông lượng khoảng 2×; KHÔNG cái nào rút ngắn độ trễ của một lệnh đơn lẻ (vẫn 4 chu kỳ nền công việc).</li>
<li><strong>Vì sao superscalar THẮNG trong công nghiệp.</strong> Superpipeline cần xung nhịp ngày càng nhanh, mà tốc độ xung đụng tường công suất khoảng năm 2004 (câu chuyện mật độ công suất của Ch.2). Còn nhân bản đơn vị thì tốn diện tích, thứ mà định luật Moore cứ cho không. Mọi CPU phổ thông ngày nay đều là superscalar; cực đoan ống-thật-sâu (Pentium 4, hơn 20 tầng) đã bị bỏ.</li>
<li><strong>Rẽ nhánh làm đau CẢ HAI, nhưng theo kiểu khác nhau.</strong> Ống sâu hơn thì có nhiều tầng phải xả; ống rộng hơn thì mỗi lần xả vứt đi nguyên một bó. Đó là lý do slide 15 nói dự đoán rẽ nhánh trở nên QUAN TRỌNG HƠN, chứ không nhẹ đi, khi máy vừa rộng vừa sâu.</li>
<li><strong>Không có gì cấm làm CẢ HAI.</strong> Bộ xử lý thật vừa superscalar vừa đường ống sâu — Intel Core (slide 18) rộng 4 với khoảng 14 tầng. Hình này tách riêng chúng chỉ để bạn gọi đúng tên cơ chế khi đề mô tả một trong hai.</li>
</ul>
<p class="meo">💡 Mẹo nhớ: <strong>superPIPE = LÁT MỎNG HƠN của MỘT ống · superSCALAR = NHIỀU ỐNG HƠN.</strong> Đề nhắc "mỗi tầng chia đôi", "xung nhịp gấp đôi" → superpipeline. Đề nhắc "hai ALU", "phát hai lệnh mỗi chu kỳ", "bậc (degree)" → superscalar.</p>`],

      [7, 'Constraints — instruction-level parallelism and its five limitations',
        `<p class="y-chinh">🎯 The slide that generates most of the exam questions in this chapter. It defines <strong>instruction level parallelism</strong> — "the degree to which the instructions of a program can be executed in parallel" — says it is maximised by <strong>a combination of compiler based optimization and hardware techniques</strong>, and then lists <strong>five limitations</strong>.</p>
<table>
<tr><th>#</th><th>The slide's name</th><th>Standard name</th><th>Shape</th><th>Concrete pair</th><th>What goes wrong if reordered</th><th>Cure</th></tr>
<tr><td>1</td><td><strong>True data dependency</strong></td><td>RAW — Read After Write</td><td>Write X, then read X</td><td><code>ADD R3, R1, R2</code><br /><code>SUB R5, R3, R4</code></td><td>SUB reads a stale R3 — <strong>wrong answer</strong></td><td>None. Must <strong>wait</strong>; forwarding only shortens the wait</td></tr>
<tr><td>2</td><td><strong>Procedural dependency</strong></td><td>control dependency</td><td>A branch, then anything after it</td><td><code>BEQ R1, R0, L</code><br /><code>ADD R4, R5, R6</code></td><td>The ADD may not belong to the taken path — <strong>work that must be undone</strong></td><td>Branch prediction + speculation + a reorder buffer to undo it (slides 12, 15)</td></tr>
<tr><td>3</td><td><strong>Resource conflicts</strong></td><td>structural hazard</td><td>Two instructions want the same unit</td><td><code>MUL R1, R2, R3</code><br /><code>MUL R4, R5, R6</code> with ONE multiplier</td><td>Nothing wrong — just <strong>slow</strong>. Correctness is not at risk</td><td><strong>Duplicate the unit</strong>, or pipeline it</td></tr>
<tr><td>4</td><td><strong>Output dependency</strong></td><td>WAW — Write After Write</td><td>Write X, then write X again</td><td><code>ADD R3, R1, R2</code><br /><code>MUL R3, R6, R7</code></td><td>If MUL writes first, R3 ends up holding the ADD's result — <strong>wrong final state</strong></td><td><strong>Register renaming</strong> (slide 13) — give the second write its own register</td></tr>
<tr><td>5</td><td><strong>Antidependency</strong></td><td>WAR — Write After Read</td><td>Read X, then write X</td><td><code>SUB R5, R3, R4</code><br /><code>ADD R3, R6, R7</code></td><td>If ADD writes first, SUB reads the <em>new</em> R3 — <strong>wrong input</strong></td><td><strong>Register renaming</strong> — give the writer its own register</td></tr>
</table>
<ul>
<li><strong>The big split: one of these is real, two are fake, one is capacity, one is control.</strong> Only <strong>RAW is a true dependency</strong> — a value genuinely flows from one instruction to the next, and no amount of hardware can invent it early. WAW and WAR are called <em>false</em> or <em>name</em> dependencies: nothing flows, the two instructions merely happen to have been assigned the same register name by the compiler. That is why renaming erases them completely and cannot touch RAW.</li>
<li><strong>Why false dependencies exist at all.</strong> An ISA has a fixed, small number of architectural registers — 16 on x86-64, 32 on most RISC. The compiler must recycle them. Recycling creates name collisions between instructions that have nothing to do with each other. The hardware has <em>more</em> physical registers (Intel Core: 128, slide 26) and simply stops recycling.</li>
<li><strong>Procedural dependency is the expensive one on a wide machine.</strong> On a scalar pipeline a mispredicted branch costs you the few instructions in the pipe. On a 4-wide machine, every flushed stage throws away up to 4 instructions. The wider and deeper the machine, the more a single wrong guess costs — which is the whole argument of slide 15.</li>
<li><strong>Resource conflict is the only one that is purely economic.</strong> It never produces a wrong answer, only a slow one, and you can always buy your way out with more silicon. The other four are properties of the program, and silicon can only work around them.</li>
<li><strong>Connect to PRF192.</strong> This table is exactly why <code>gcc -O2</code> reorders your statements. The compiler builds the same dependency graph, keeps the RAW edges (it must), and shuffles everything else to spread the independent work apart so the hardware's window finds it. Two C statements that you wrote adjacent may end up ten instructions apart in the object code, and both are correct.</li>
</ul>
<p class="meo">💡 Remember the three false-or-true letters by the <em>order of the operations on the shared register</em>: <strong>RAW = Read After Write (true, must wait) · WAR = Write After Read (false, rename) · WAW = Write After Write (false, rename)</strong>. The pattern: if the first letter is W, it is fake.</p>
<p class="pitfall">⚠️ The slide LISTS these five names and nothing more — it prints no definition and no example for output dependency or antidependency. The definitions, the instruction pairs and the cures in the table above come from the textbook (section 18.2). Figure 18.4 on the next slide illustrates only three of the five; WAW and WAR are never drawn in this deck. Do not go looking for a picture of them.</p>`,
        `<p class="y-chinh">🎯 Slide sinh ra phần lớn câu hỏi thi của chương này. Nó định nghĩa <strong>song song mức lệnh</strong> — "mức độ mà các lệnh của một chương trình CÓ THỂ chạy song song" — nói rằng nó được tối đa hoá bằng <strong>kết hợp tối ưu hoá của trình biên dịch và kỹ thuật phần cứng</strong>, rồi liệt kê <strong>NĂM GIỚI HẠN</strong>.</p>
<table>
<tr><th>#</th><th>Tên trên slide</th><th>Tên chuẩn</th><th>Hình dạng</th><th>Cặp lệnh cụ thể</th><th>Chạy sai thứ tự thì hỏng gì</th><th>Cách chữa</th></tr>
<tr><td>1</td><td><strong>True data dependency</strong> — phụ thuộc dữ liệu THẬT</td><td>RAW — Đọc sau Ghi</td><td>Ghi X rồi đọc X</td><td><code>ADD R3, R1, R2</code><br /><code>SUB R5, R3, R4</code></td><td>SUB đọc R3 CŨ — <strong>SAI KẾT QUẢ</strong></td><td>Không có. Phải <strong>CHỜ</strong>; chuyển tiếp (forwarding) chỉ rút ngắn thời gian chờ</td></tr>
<tr><td>2</td><td><strong>Procedural dependency</strong> — phụ thuộc THỦ TỤC</td><td>phụ thuộc điều khiển</td><td>Một nhánh, rồi mọi thứ sau nó</td><td><code>BEQ R1, R0, L</code><br /><code>ADD R4, R5, R6</code></td><td>Lệnh ADD có thể không thuộc nhánh được chọn — <strong>công làm rồi phải huỷ</strong></td><td>Dự đoán rẽ nhánh + chạy suy đoán + reorder buffer để huỷ (slide 12, 15)</td></tr>
<tr><td>3</td><td><strong>Resource conflicts</strong> — xung đột TÀI NGUYÊN</td><td>hazard cấu trúc</td><td>Hai lệnh cùng đòi một đơn vị</td><td><code>MUL R1, R2, R3</code><br /><code>MUL R4, R5, R6</code> mà chỉ có MỘT bộ nhân</td><td>Không sai gì cả — chỉ <strong>CHẬM</strong>. Tính đúng đắn không bị đe doạ</td><td><strong>Nhân bản đơn vị</strong>, hoặc làm nó thành đường ống</td></tr>
<tr><td>4</td><td><strong>Output dependency</strong> — phụ thuộc ĐẦU RA</td><td>WAW — Ghi sau Ghi</td><td>Ghi X rồi lại ghi X</td><td><code>ADD R3, R1, R2</code><br /><code>MUL R3, R6, R7</code></td><td>Nếu MUL ghi trước thì R3 cuối cùng giữ kết quả của ADD — <strong>SAI TRẠNG THÁI CUỐI</strong></td><td><strong>Đổi tên thanh ghi</strong> (slide 13) — cấp cho lần ghi thứ hai một thanh ghi riêng</td></tr>
<tr><td>5</td><td><strong>Antidependency</strong> — PHẢN phụ thuộc</td><td>WAR — Ghi sau Đọc</td><td>Đọc X rồi ghi X</td><td><code>SUB R5, R3, R4</code><br /><code>ADD R3, R6, R7</code></td><td>Nếu ADD ghi trước thì SUB đọc phải R3 <em>MỚI</em> — <strong>SAI ĐẦU VÀO</strong></td><td><strong>Đổi tên thanh ghi</strong> — cấp cho lệnh ghi một thanh ghi riêng</td></tr>
</table>
<ul>
<li><strong>Vạch chia lớn: MỘT cái là thật, HAI cái là giả, một cái là sức chứa, một cái là điều khiển.</strong> Chỉ <strong>RAW mới là phụ thuộc THẬT</strong> — một GIÁ TRỊ thật sự chảy từ lệnh này sang lệnh kia, và không phần cứng nào bịa được nó ra sớm hơn. WAW và WAR bị gọi là phụ thuộc <em>GIẢ</em> hay phụ thuộc <em>TÊN</em>: chẳng có gì chảy cả, hai lệnh chỉ tình cờ được trình biên dịch gán cùng một TÊN thanh ghi. Đó là lý do đổi tên xoá sạch chúng và KHÔNG đụng được tới RAW.</li>
<li><strong>Vì sao phụ thuộc giả lại tồn tại.</strong> Một tập lệnh chỉ có một số ít thanh ghi kiến trúc cố định — 16 trên x86-64, 32 trên hầu hết RISC. Trình biên dịch BUỘC phải tái sử dụng chúng. Tái sử dụng sinh ra va chạm TÊN giữa những lệnh chẳng liên quan gì tới nhau. Phần cứng thì có <em>NHIỀU HƠN</em> thanh ghi vật lý (Intel Core: 128, slide 26) và đơn giản là thôi tái sử dụng.</li>
<li><strong>Phụ thuộc thủ tục mới là thứ ĐẮT trên máy rộng.</strong> Trên đường ống scalar, một nhánh đoán sai làm mất vài lệnh đang trong ống. Trên máy rộng 4, mỗi tầng bị xả vứt đi tới 4 lệnh. Máy càng rộng càng sâu thì một lần đoán sai càng đắt — đó là toàn bộ lập luận của slide 15.</li>
<li><strong>Xung đột tài nguyên là cái DUY NHẤT thuần kinh tế.</strong> Nó không bao giờ cho kết quả sai, chỉ cho kết quả chậm, và bạn luôn có thể mua đường thoát bằng thêm silic. Bốn cái còn lại là tính chất của CHƯƠNG TRÌNH, silic chỉ có thể đi vòng chứ không xoá được.</li>
<li><strong>Nối sang PRF192.</strong> Bảng này chính xác là lý do <code>gcc -O2</code> sắp xếp lại các câu lệnh của bạn. Trình biên dịch dựng đúng cái đồ thị phụ thuộc này, GIỮ các cạnh RAW (buộc phải giữ), rồi xáo mọi thứ khác để trải phần việc độc lập ra xa nhau cho cửa sổ của phần cứng tìm thấy. Hai câu lệnh C bạn viết cạnh nhau có thể nằm cách nhau mười lệnh trong mã đối tượng, và cả hai đều ĐÚNG.</li>
</ul>
<p class="meo">💡 Nhớ ba chữ viết tắt theo <em>THỨ TỰ thao tác trên thanh ghi dùng chung</em>: <strong>RAW = Read After Write (thật, phải chờ) · WAR = Write After Read (giả, đổi tên) · WAW = Write After Write (giả, đổi tên)</strong>. Quy luật: chữ cái ĐẦU là W thì nó là đồ giả.</p>
<p class="pitfall">⚠️ Slide chỉ LIỆT KÊ năm cái tên này, không hơn — nó KHÔNG in định nghĩa và KHÔNG in ví dụ nào cho output dependency và antidependency. Định nghĩa, cặp lệnh và cách chữa trong bảng trên lấy từ SÁCH (mục 18.2). Figure 18.4 ở slide kế minh hoạ chỉ BA trong năm; WAW và WAR không được vẽ ở bất cứ đâu trong deck này. Đừng đi tìm hình của chúng.</p>`],

      [8, 'Figure 18.4 — Effect of Dependencies',
        `<p class="y-chinh">🎯 Four issue diagrams stacked on one time axis (0 to 9 base cycles), key <em>Ifetch | Decode | Execute | Write</em>, showing what each constraint <strong>costs in cycles</strong> on a machine that issues two instructions per cycle. This is the picture that turns slide 7's list into a number.</p>
<table>
<tr><th>Band</th><th>Label on the figure</th><th>What the bars do</th><th>Cost</th></tr>
<tr><td>1</td><td><strong>No Dependency</strong></td><td>i0 and i1 sit exactly on top of each other — same fetch, same decode, same execute, same write</td><td><strong>0 cycles.</strong> The ideal: two instructions in the time of one</td></tr>
<tr><td>2</td><td><strong>Data Dependency</strong> (i1 uses data computed by i0)</td><td>i0 and i1 fetch and decode together, then i1's <em>Execute</em> block is pushed one cycle right — a visible gap in i1's row</td><td><strong>1 cycle lost.</strong> i1 must wait for i0's result</td></tr>
<tr><td>3</td><td><strong>Procedural Dependency</strong></td><td>i0 and i1/branch go together; then i2 and i3 start a full cycle later, and i4, i5 later again — the whole stream is shifted</td><td><strong>The worst case drawn.</strong> Everything after the branch is delayed until the branch is resolved</td></tr>
<tr><td>4</td><td><strong>Resource Conflict</strong> (i0 and i1 use the same functional unit)</td><td>Identical shape to band 2 — i1's Execute is pushed one cycle right</td><td><strong>1 cycle lost</strong></td></tr>
</table>
<ul>
<li><strong>The most useful thing on this figure is that bands 2 and 4 look IDENTICAL.</strong> A data dependency and a resource conflict produce exactly the same picture — one stalled cycle — yet they are completely different problems. Band 2 you can never fix (the value does not exist yet). Band 4 you fix by buying a second multiplier. <em>Same symptom, opposite cure.</em> An exam question that shows you a stall and asks "what would fix this?" is really asking you to tell these two apart, and the only way is to read the instructions, not the diagram.</li>
<li><strong>Band 3 is drawn longest for a reason.</strong> Notice the branch is <em>i1</em>, the second of a pair. The machine fetched i0 and i1 together, so it was already committed to i1 before knowing it was a branch. Then i2 and i3 cannot start until the branch resolves. On a 2-wide machine that is 2 instructions per wasted cycle; on a 4-wide machine, 4.</li>
<li><strong>Band 1 is the yardstick, not the expectation.</strong> Every later figure in the chapter is measured against "how close did we get back to band 1". Table 18.1's median of 2.25× on a machine with several units is the honest distance between band 1 and real code.</li>
<li><strong>The five constraints, but only three pictures.</strong> Output dependency (WAW) and antidependency (WAR) do not appear here. That is not an oversight: on an <em>in-order completion</em> machine they cost nothing, because results are written in program order anyway. They only start costing cycles once you allow out-of-order completion — which is exactly the story of slides 11 and 13.</li>
<li><strong>Connect to Ch.16.</strong> You have seen this diagram before, one instruction wide, as the pipeline hazard chart. Nothing conceptually new has happened; the hazards simply got more expensive because each stalled cycle now wastes <em>two</em> issue slots instead of one.</li>
</ul>
<p class="pitfall">⚠️ The extracted title of this slide reads "<strong>Figure 18.4Effect of Dependencies</strong>" with no space — that is a formatting fault in the original .pptx file, not two separate labels.</p>
<p class="meo">💡 When you draw one of these in an exam, always label the axis "time in base cycles" and always draw the <em>no-dependency</em> band first as a reference. Markers look for the gap; the gap only means something next to the ideal.</p>`,
        `<p class="y-chinh">🎯 Bốn giản đồ phát lệnh xếp chồng trên một trục thời gian (0 tới 9 chu kỳ nền), chú giải <em>Ifetch | Decode | Execute | Write</em>, cho thấy mỗi ràng buộc <strong>tốn bao nhiêu CHU KỲ</strong> trên cỗ máy phát hai lệnh mỗi chu kỳ. Đây là bức tranh biến danh sách của slide 7 thành CON SỐ.</p>
<table>
<tr><th>Dải</th><th>Nhãn trên hình</th><th>Các thanh làm gì</th><th>Giá phải trả</th></tr>
<tr><td>1</td><td><strong>No Dependency</strong> — không phụ thuộc</td><td>i0 và i1 nằm CHỒNG KHÍT lên nhau — cùng nạp, cùng giải mã, cùng thực thi, cùng ghi</td><td><strong>0 chu kỳ.</strong> Trường hợp lý tưởng: hai lệnh trong thời gian của một</td></tr>
<tr><td>2</td><td><strong>Data Dependency</strong> (i1 dùng dữ liệu do i0 tính ra)</td><td>i0 và i1 nạp và giải mã cùng nhau, rồi khối <em>Execute</em> của i1 bị ĐẨY SANG PHẢI một chu kỳ — thấy rõ một khoảng trống trên hàng i1</td><td><strong>Mất 1 chu kỳ.</strong> i1 phải chờ kết quả của i0</td></tr>
<tr><td>3</td><td><strong>Procedural Dependency</strong> — phụ thuộc thủ tục</td><td>i0 và i1/branch đi cùng nhau; rồi i2 và i3 bắt đầu muộn trọn một chu kỳ, i4 và i5 lại muộn thêm — cả dòng lệnh bị dịch đi</td><td><strong>Ca tệ nhất được vẽ.</strong> Mọi thứ sau nhánh bị hoãn cho tới khi nhánh được giải quyết</td></tr>
<tr><td>4</td><td><strong>Resource Conflict</strong> (i0 và i1 dùng cùng một đơn vị chức năng)</td><td>Hình dạng Y HỆT dải 2 — Execute của i1 bị đẩy sang phải một chu kỳ</td><td><strong>Mất 1 chu kỳ</strong></td></tr>
</table>
<ul>
<li><strong>Thứ hữu ích nhất ở hình này là dải 2 và dải 4 trông GIỐNG HỆT NHAU.</strong> Một phụ thuộc dữ liệu và một xung đột tài nguyên cho ra đúng cùng một bức tranh — một chu kỳ đứng chờ — mà lại là hai vấn đề hoàn toàn khác nhau. Dải 2 bạn KHÔNG BAO GIỜ sửa được (giá trị chưa tồn tại). Dải 4 bạn sửa bằng cách mua thêm bộ nhân thứ hai. <em>Cùng triệu chứng, ngược cách chữa.</em> Câu hỏi thi đưa bạn một chỗ đứng chờ rồi hỏi "sửa thế nào?" thật ra đang hỏi bạn phân biệt hai cái đó, và cách duy nhất là ĐỌC CÁC LỆNH, không phải nhìn giản đồ.</li>
<li><strong>Dải 3 được vẽ dài nhất có lý do.</strong> Để ý lệnh nhánh là <em>i1</em>, cái thứ HAI của một cặp. Máy đã nạp i0 và i1 cùng nhau nên nó đã trót cam kết với i1 trước khi biết i1 là một nhánh. Rồi i2 và i3 không thể khởi động cho tới khi nhánh được giải quyết. Trên máy rộng 2 thì mỗi chu kỳ phí mất 2 lệnh; trên máy rộng 4 thì 4 lệnh.</li>
<li><strong>Dải 1 là THƯỚC ĐO, không phải kỳ vọng.</strong> Mọi hình sau này trong chương đều được đo bằng câu "ta quay lại gần dải 1 tới đâu". Trung vị 2,25× của Table 18.1 trên một cỗ máy có vài đơn vị chức năng chính là khoảng cách thành thật giữa dải 1 và mã thật.</li>
<li><strong>Năm ràng buộc mà chỉ ba bức tranh.</strong> Phụ thuộc đầu ra (WAW) và phản phụ thuộc (WAR) không có mặt ở đây. Đó không phải sơ suất: trên cỗ máy <em>HOÀN THÀNH ĐÚNG THỨ TỰ</em> chúng không tốn gì cả, vì kết quả dù sao cũng được ghi theo thứ tự chương trình. Chúng chỉ bắt đầu tốn chu kỳ khi bạn cho phép hoàn thành KHÔNG theo thứ tự — đúng là câu chuyện của slide 11 và 13.</li>
<li><strong>Nối sang Ch.16.</strong> Bạn đã gặp giản đồ này rồi, ở bề rộng một lệnh, dưới tên biểu đồ hazard của đường ống. Về mặt khái niệm chẳng có gì mới; các hazard chỉ trở nên ĐẮT HƠN vì mỗi chu kỳ đứng chờ giờ phí <em>HAI</em> khe phát lệnh thay vì một.</li>
</ul>
<p class="pitfall">⚠️ Tiêu đề trích ra của slide này ghi "<strong>Figure 18.4Effect of Dependencies</strong>" không có dấu cách — đó là lỗi định dạng trong chính file .pptx gốc, không phải hai nhãn riêng.</p>
<p class="meo">💡 Khi bạn vẽ một giản đồ kiểu này trong bài thi, LUÔN ghi nhãn trục là "thời gian tính bằng chu kỳ nền" và LUÔN vẽ dải <em>không phụ thuộc</em> trước làm mốc. Người chấm tìm cái khoảng trống; khoảng trống chỉ có nghĩa khi đặt cạnh trường hợp lý tưởng.</p>`],

      [9, 'Design Issues — Instruction-Level Parallelism and Machine Parallelism',
        `<p class="y-chinh">🎯 Two terms that sound like synonyms and are not, and the exam loves the difference. <strong>Instruction-level parallelism is a property of the PROGRAM. Machine parallelism is a property of the HARDWARE.</strong> Your actual speed is the smaller of the two.</p>
<table>
<tr><th></th><th>Instruction level parallelism</th><th>Machine parallelism</th></tr>
<tr><td><strong>Slide's definition</strong></td><td>Instructions in a sequence are <em>independent</em>; execution can be <em>overlapped</em></td><td>The <em>ability to take advantage of</em> instruction level parallelism</td></tr>
<tr><td><strong>Slide says it is governed by</strong></td><td><strong>Data and procedural dependency</strong></td><td><strong>Number of parallel pipelines</strong></td></tr>
<tr><td><strong>Belongs to</strong></td><td>The program (and therefore the compiler)</td><td>The chip (and therefore the architect)</td></tr>
<tr><td><strong>You change it by</strong></td><td>Rewriting or recompiling the code — loop unrolling, software pipelining, scheduling</td><td>Buying a different processor — more units, bigger window, renaming</td></tr>
<tr><td><strong>If it is the bottleneck</strong></td><td>Extra hardware sits idle</td><td>Independent instructions sit waiting</td></tr>
</table>
<ul>
<li><strong>The sentence to write in an exam:</strong> "ILP is how much parallelism the program <em>contains</em>; machine parallelism is how much the processor can <em>exploit</em>. Performance is limited by whichever is smaller." Give a one-line example of each failure mode and you have a full-mark answer.</li>
<li><strong>Case A — program-limited.</strong> Take <code>a = a + 1; b = a * 2; c = b - 3;</code> — a pure RAW chain, ILP = 1. Run it on a 4-wide out-of-order monster and you still get one instruction per cycle. Three quarters of the chip is dark. No hardware fixes this; only rewriting the algorithm does.</li>
<li><strong>Case B — machine-limited.</strong> Take a loop summing four independent arrays. ILP is 4 or more, but on a 1-wide scalar pipeline you get 1 per cycle. Here the program is fine and the chip is the problem.</li>
<li><strong>Note the slide's phrase "governed by number of parallel pipelines" is deliberately narrow.</strong> Machine parallelism is really three things: how many instructions can be <em>fetched/decoded</em> per cycle, how many <em>functional units</em> exist, and how large the <em>window</em> is (how far ahead the machine may look for independent work). Figure 18.7 on slide 14 measures precisely this — it varies window size 8, 16, 32 and watches speedup grow.</li>
<li><strong>Connect to the compiler, because this is where the two meet.</strong> The slide says ILP is maximised by "a combination of compiler based optimization and hardware techniques" (slide 7). The compiler cannot see the runtime, and the hardware cannot see more than its window. Loop unrolling is the classic collaboration: the compiler flattens four iterations into one body so that <em>independent</em> instructions end up close enough together for the hardware's window to notice them.</li>
</ul>
<p class="meo">💡 Analogy that survives the exam: ILP is <strong>how many dishes can be cooked at the same time by this recipe</strong>; machine parallelism is <strong>how many burners the kitchen has</strong>. One burner and a ten-dish recipe: the kitchen is the problem. Ten burners and a recipe where each step needs the previous one's output: the recipe is the problem.</p>`,
        `<p class="y-chinh">🎯 Hai thuật ngữ nghe như đồng nghĩa mà KHÔNG phải, và đề thi rất thích chỗ khác nhau này. <strong>Song song mức lệnh (ILP) là tính chất của CHƯƠNG TRÌNH. Song song của máy (machine parallelism) là tính chất của PHẦN CỨNG.</strong> Tốc độ thật của bạn là cái NHỎ HƠN trong hai.</p>
<table>
<tr><th></th><th>Instruction level parallelism</th><th>Machine parallelism</th></tr>
<tr><td><strong>Định nghĩa trên slide</strong></td><td>Các lệnh trong một dãy là <em>ĐỘC LẬP</em>; việc thực thi có thể <em>GỐI LÊN NHAU</em></td><td><em>KHẢ NĂNG TẬN DỤNG</em> song song mức lệnh</td></tr>
<tr><td><strong>Slide nói nó bị chi phối bởi</strong></td><td><strong>Phụ thuộc dữ liệu và phụ thuộc thủ tục</strong></td><td><strong>Số đường ống song song</strong></td></tr>
<tr><td><strong>Thuộc về ai</strong></td><td>Chương trình (và do đó là trình biên dịch)</td><td>Con chip (và do đó là kiến trúc sư)</td></tr>
<tr><td><strong>Muốn đổi thì</strong></td><td>Viết lại hoặc biên dịch lại mã — bung vòng lặp, đường ống phần mềm, sắp lịch lệnh</td><td>Mua bộ xử lý khác — nhiều đơn vị hơn, cửa sổ lớn hơn, có đổi tên thanh ghi</td></tr>
<tr><td><strong>Nếu nó là nút thắt</strong></td><td>Phần cứng dư ngồi chơi</td><td>Các lệnh độc lập ngồi chờ</td></tr>
</table>
<ul>
<li><strong>Câu nên viết vào bài thi:</strong> "ILP là lượng song song mà chương trình <em>CHỨA</em>; machine parallelism là lượng mà bộ xử lý <em>KHAI THÁC ĐƯỢC</em>. Hiệu năng bị chặn bởi cái nào nhỏ hơn." Thêm mỗi bên một ví dụ một dòng là đủ điểm tối đa.</li>
<li><strong>Ca A — chương trình chặn.</strong> Lấy <code>a = a + 1; b = a * 2; c = b - 3;</code> — một chuỗi RAW thuần, ILP = 1. Chạy nó trên con quái vật rộng 4 không theo thứ tự thì bạn vẫn chỉ được một lệnh mỗi chu kỳ. Ba phần tư con chip nằm tối. Không phần cứng nào chữa được; chỉ viết lại thuật toán mới chữa được.</li>
<li><strong>Ca B — máy chặn.</strong> Lấy một vòng lặp cộng bốn mảng độc lập. ILP là 4 trở lên, nhưng trên đường ống scalar rộng 1 bạn được 1 mỗi chu kỳ. Ở đây chương trình không có lỗi, con chip mới là vấn đề.</li>
<li><strong>Để ý cụm "bị chi phối bởi số đường ống song song" trên slide được viết hẹp có chủ ý.</strong> Machine parallelism thật ra gồm BA thứ: mỗi chu kỳ <em>nạp/giải mã</em> được bao nhiêu lệnh, có bao nhiêu <em>đơn vị chức năng</em>, và <em>CỬA SỔ</em> lớn cỡ nào (máy được nhìn xa tới đâu để tìm việc độc lập). Figure 18.7 ở slide 14 đo đúng thứ này — nó đổi cửa sổ 8, 16, 32 và nhìn tốc độ tăng theo.</li>
<li><strong>Nối sang trình biên dịch, vì đây là chỗ hai thứ gặp nhau.</strong> Slide nói ILP được tối đa hoá bằng "kết hợp tối ưu hoá của trình biên dịch và kỹ thuật phần cứng" (slide 7). Trình biên dịch không nhìn thấy lúc chạy, còn phần cứng không nhìn xa hơn cửa sổ của nó. Bung vòng lặp (loop unrolling) là kiểu hợp tác kinh điển: trình biên dịch dàn bốn vòng lặp thành một thân, để những lệnh <em>ĐỘC LẬP</em> nằm đủ gần nhau cho cửa sổ của phần cứng nhìn thấy.</li>
</ul>
<p class="meo">💡 Phép ví sống được qua kỳ thi: ILP là <strong>công thức nấu này cho phép nấu mấy món cùng lúc</strong>; machine parallelism là <strong>bếp có mấy cái lò</strong>. Một lò mà công thức mười món: cái bếp là vấn đề. Mười lò mà công thức bước nào cũng cần đầu ra của bước trước: cái công thức là vấn đề.</p>`],

      [10, 'Instruction Issue Policy — four quadrants',
        `<p class="y-chinh">🎯 The vocabulary slide for the rest of the chapter, drawn as a circle in four quarters. It defines <strong>instruction issue</strong>, defines <strong>instruction issue policy</strong>, names the <strong>three orderings</strong> that matter, and lists the <strong>three categories</strong> of policy that slide 11 then draws.</p>
<table>
<tr><th>Quadrant</th><th>What the slide says</th></tr>
<tr><td><strong>Instruction issue</strong></td><td>"Refers to the process of <em>initiating instruction execution</em> in the processor's functional units"</td></tr>
<tr><td><strong>Instruction issue policy</strong></td><td>"Refers to the <em>protocol</em> used to issue instructions." And the precise moment: "instruction issue occurs when instruction moves <em>from the decode stage of the pipeline to the first execute stage</em>"</td></tr>
<tr><td><strong>Three types of orderings are important</strong></td><td>1. The order in which instructions are <strong>fetched</strong><br />2. The order in which instructions are <strong>executed</strong><br />3. The order in which instructions <strong>update the contents of register and memory locations</strong></td></tr>
<tr><td><strong>Superscalar issue policies group into</strong></td><td>1. <strong>In-order issue with in-order completion</strong><br />2. <strong>In-order issue with out-of-order completion</strong><br />3. <strong>Out-of-order issue with out-of-order completion</strong></td></tr>
</table>
<ul>
<li><strong>Read the three orderings as three independent dials.</strong> Fetch order is almost always kept in program order (you fetch along the predicted path). Execute order and update order are the two you may relax — and the three policies are simply the three sensible combinations. Note what is <em>missing</em> from the list: there is no "out-of-order issue with in-order completion" category, because relaxing the harder constraint while keeping the easier one buys you nothing.</li>
<li><strong>Ordering 3 is the one that must never be visibly broken.</strong> Instructions may be <em>executed</em> in any order the hardware likes, but the point at which register and memory state changes must look sequential to the programmer, otherwise interrupts and exceptions become unrecoverable. In a modern machine that is exactly what the reorder buffer (slide 4, slide 12) enforces — physically out of order, architecturally in order.</li>
<li><strong>Get the definition of "issue" exactly right, because the whole chapter hangs on it.</strong> Issue = decode stage → first execute stage. It is <em>not</em> fetch, and it is <em>not</em> completion. In Figure 18.2's vocabulary (slide 4), issue sits between the issue window and the reservation stations, and the stages after it are dispatch → finish → complete.</li>
<li><strong>Why in-order issue is the default.</strong> It is dramatically simpler: the decoder hands instructions to units in program order and never has to search. The cost is that a single stalled instruction blocks every instruction behind it, even fully independent ones — a phenomenon you will watch happen cycle by cycle on slide 11.</li>
<li><strong>The three categories are a difficulty ladder, not three equal options.</strong> Category 1 is the simplest hardware and the slowest. Category 3 is the most complex and the fastest, and it is what every performance desktop and server CPU since the mid-1990s implements. Category 2 is the halfway house — it needs the WAW check but not a full window.</li>
</ul>
<p class="meo">💡 Fix the four verbs in this order and the rest of the chapter reads easily: <strong>fetch → decode → ISSUE → execute → finish → COMPLETE (commit).</strong> A policy name is always two of these words joined by "with": what you relax at ISSUE, and what you relax at COMPLETE.</p>`,
        `<p class="y-chinh">🎯 Slide từ vựng cho phần còn lại của chương, vẽ thành một vòng tròn chia tư. Nó định nghĩa <strong>phát lệnh (instruction issue)</strong>, định nghĩa <strong>chính sách phát lệnh</strong>, gọi tên <strong>BA thứ tự</strong> đáng quan tâm, và liệt kê <strong>BA nhóm</strong> chính sách mà slide 11 sẽ vẽ ra.</p>
<table>
<tr><th>Góc phần tư</th><th>Slide viết gì</th></tr>
<tr><td><strong>Instruction issue</strong></td><td>"Chỉ quá trình <em>KHỞI ĐỘNG việc thực thi lệnh</em> trong các đơn vị chức năng của bộ xử lý"</td></tr>
<tr><td><strong>Instruction issue policy</strong></td><td>"Chỉ <em>GIAO THỨC</em> dùng để phát lệnh." Và thời điểm chính xác: "phát lệnh xảy ra khi lệnh đi <em>TỪ tầng giải mã của đường ống SANG tầng thực thi đầu tiên</em>"</td></tr>
<tr><td><strong>Ba loại thứ tự đều quan trọng</strong></td><td>1. Thứ tự các lệnh được <strong>NẠP</strong><br />2. Thứ tự các lệnh được <strong>THỰC THI</strong><br />3. Thứ tự các lệnh <strong>CẬP NHẬT nội dung thanh ghi và ô nhớ</strong></td></tr>
<tr><td><strong>Chính sách phát lệnh superscalar gom thành</strong></td><td>1. <strong>Phát đúng thứ tự, hoàn thành đúng thứ tự</strong><br />2. <strong>Phát đúng thứ tự, hoàn thành KHÔNG theo thứ tự</strong><br />3. <strong>Phát KHÔNG theo thứ tự, hoàn thành KHÔNG theo thứ tự</strong></td></tr>
</table>
<ul>
<li><strong>Đọc ba thứ tự như BA cái núm vặn độc lập.</strong> Thứ tự NẠP gần như luôn giữ đúng thứ tự chương trình (bạn nạp dọc theo đường đã đoán). Thứ tự THỰC THI và thứ tự CẬP NHẬT là hai cái bạn có thể nới — và ba chính sách chỉ đơn giản là ba tổ hợp hợp lý. Để ý cái <em>THIẾU</em> trong danh sách: KHÔNG có nhóm "phát không theo thứ tự, hoàn thành đúng thứ tự", vì nới cái ràng buộc KHÓ mà giữ cái DỄ thì chẳng được gì.</li>
<li><strong>Thứ tự số 3 là cái không bao giờ được phép vỡ một cách NHÌN THẤY ĐƯỢC.</strong> Lệnh được phép <em>thực thi</em> theo thứ tự nào phần cứng thích, nhưng thời điểm trạng thái thanh ghi và bộ nhớ thay đổi phải TRÔNG như tuần tự với người lập trình, nếu không thì ngắt và ngoại lệ trở nên không cứu được. Trên máy hiện đại đó đúng là việc mà reorder buffer (slide 4, slide 12) cưỡng chế — vật lý thì lộn xộn, kiến trúc thì đúng thứ tự.</li>
<li><strong>Nhớ CHÍNH XÁC định nghĩa "issue", vì cả chương treo vào nó.</strong> Issue = tầng giải mã → tầng thực thi ĐẦU TIÊN. Nó KHÔNG phải nạp lệnh, và KHÔNG phải hoàn thành. Trong từ vựng của Figure 18.2 (slide 4), issue nằm giữa cửa sổ phát và các trạm đặt chỗ, và các bước sau nó là dispatch → finish → complete.</li>
<li><strong>Vì sao phát đúng thứ tự là mặc định.</strong> Nó đơn giản hơn hẳn: bộ giải mã trao lệnh cho các đơn vị theo thứ tự chương trình và không bao giờ phải đi tìm. Cái giá là MỘT lệnh bị kẹt sẽ chặn MỌI lệnh phía sau nó, kể cả những lệnh hoàn toàn độc lập — hiện tượng bạn sẽ xem diễn ra từng chu kỳ ở slide 11.</li>
<li><strong>Ba nhóm là một cái THANG ĐỘ KHÓ, không phải ba lựa chọn ngang nhau.</strong> Nhóm 1 phần cứng đơn giản nhất và chậm nhất. Nhóm 3 phức tạp nhất và nhanh nhất, và là thứ mà mọi CPU máy bàn/máy chủ hiệu năng cao từ giữa thập niên 1990 đều hiện thực. Nhóm 2 là nhà nghỉ giữa đường — nó cần phép kiểm WAW nhưng chưa cần một cửa sổ đầy đủ.</li>
</ul>
<p class="meo">💡 Ghim sáu động từ theo đúng thứ tự này thì phần còn lại của chương đọc rất trôi: <strong>nạp → giải mã → PHÁT (issue) → thực thi → xong (finish) → HOÀN THÀNH (complete/commit).</strong> Tên một chính sách luôn là hai trong các chữ đó nối bằng chữ "với": bạn nới cái gì ở PHÁT, và nới cái gì ở HOÀN THÀNH.</p>`],

      [11, 'Figure 18.5 — Superscalar Instruction Issue and Completion Policies',
        `<p class="y-chinh">🎯 The most important figure in the chapter, and the one most likely to become an exam question verbatim. Six instructions I1–I6, three policies, three cycle counts: <strong>8 → 7 → 6</strong>. Everything in the rest of this lesson is built on reading this correctly.</p>
<p class="nhan">📐 The book's assumptions, printed alongside the figure: <strong>I1 requires two cycles to execute · I3 and I4 conflict for the same functional unit · I5 depends on the value produced by I4 · I5 and I6 conflict for a functional unit.</strong> The machine decodes 2 instructions per cycle and has 2 write ports.</p>
<table>
<tr><th>(a) In-order issue, in-order completion</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
<tr><td><strong>Decode</strong></td><td>I1 I2</td><td>I3 I4</td><td>I3 I4</td><td>— I4</td><td>I5 I6</td><td>— I6</td><td>—</td><td>—</td></tr>
<tr><td><strong>Execute</strong></td><td>—</td><td>I1 I2</td><td>I1</td><td>I3</td><td>I4</td><td>I5</td><td>I6</td><td>—</td></tr>
<tr><td><strong>Write</strong></td><td>—</td><td>—</td><td>—</td><td>I1 I2</td><td>—</td><td>I3 I4</td><td>—</td><td>I5 I6</td></tr>
</table>
<table>
<tr><th>(b) In-order issue, out-of-order completion</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th></tr>
<tr><td><strong>Decode</strong></td><td>I1 I2</td><td>I3 I4</td><td>— I4</td><td>I5 I6</td><td>— I6</td><td>—</td><td>—</td></tr>
<tr><td><strong>Execute</strong></td><td>—</td><td>I1 I2</td><td>I1 I3</td><td>I4</td><td>I5</td><td>I6</td><td>—</td></tr>
<tr><td><strong>Write</strong></td><td>—</td><td>—</td><td>I2</td><td>I1 I3</td><td>I4</td><td>I5</td><td>I6</td></tr>
</table>
<table>
<tr><th>(c) Out-of-order issue, out-of-order completion</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
<tr><td><strong>Decode</strong></td><td>I1 I2</td><td>I3 I4</td><td>I5 I6</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td><strong>Window</strong></td><td>—</td><td>I1, I2</td><td>I3, I4</td><td>I4, I5, I6</td><td>I5</td><td>—</td></tr>
<tr><td><strong>Execute</strong></td><td>—</td><td>I1 I2</td><td>I1 I3</td><td>I6 I4</td><td>I5</td><td>—</td></tr>
<tr><td><strong>Write</strong></td><td>—</td><td>—</td><td>I2</td><td>I1 I3</td><td>I4 I6</td><td>I5</td></tr>
</table>
<p class="nhan">📐 <strong>Verified by machine, not by counting squares.</strong> A small superscalar scheduler was written in <code>python3</code> (decode 1 cycle, execute earliest the following cycle, write one cycle after execute ends, 2-wide issue, 2 write ports) and run on exactly these four assumptions. It reproduced the figure <em>cell for cell</em> — including the detail that in (c) <strong>I6 executes in cycle 4, one cycle BEFORE I5</strong>, which is the only place in the whole figure where program order is visibly violated. Checking the checker before trusting it is the point: the same script is then used for the worked example below.</p>
<p class="dap-an">✅ Answer: <strong>(a) 8 cycles · (b) 7 cycles · (c) 6 cycles.</strong> Relaxing completion order saves 1 cycle; also relaxing issue order saves another 1. Total gain from (a) to (c) = 8/6 = <strong>1.33×</strong>, on six instructions and a tiny machine.</p>
<ul>
<li><strong>Where (a) loses its cycles — read the Decode row.</strong> In cycle 3, I3 and I4 are sitting in decode doing nothing, even though a functional unit is free, because I1 is still executing and in-order completion gives the machine nowhere to park an early result. This is the signature symptom of policy (a): <strong>a stall propagates backwards and freezes instructions that were ready</strong>.</li>
<li><strong>What (b) actually changes — read the Write row.</strong> I2 writes in cycle 3, <em>before</em> I1 writes in cycle 4, although I1 comes first in the program. That is out-of-order completion in one cell. It is legal here only because I1 and I2 write different registers; if they wrote the same one you would have a WAW hazard, which is precisely the constraint slide 7 listed and slide 13 removes.</li>
<li><strong>What (c) adds — read the Window row.</strong> A new stage appears between decode and execute: the <em>window</em>, holding I4, I5, I6 together in cycle 4. Because the machine can look at all three at once, it notices I5 is blocked (it needs I4's result) but I6 is not, and runs <strong>I6 before I5</strong>. No in-order machine can do this at any price.</li>
<li><strong>The cost of (c) is not free and the figure hides it.</strong> The window needs associative logic comparing every waiting instruction against every finishing result, every cycle. That circuit grows roughly with the square of the window size, which is why Figure 18.7 (slide 14) stops at window = 32 and why the speedup curve there flattens.</li>
<li><strong>Exam technique.</strong> When asked to draw one of these, always write the four assumptions at the top first, then fill the Execute row before the Write row (writes are derived, executes are decided). And always state your convention for when a dependent instruction may start — with forwarding it is the cycle <em>after</em> the producer finishes executing.</li>
</ul>
<p class="pitfall">⚠️ The commonest mistake is to think out-of-order <em>completion</em> and out-of-order <em>issue</em> are the same relaxation. They are not. In (b) the instructions still <em>enter</em> execution strictly in program order — it is only the writes that overtake each other. Only in (c) does an instruction jump the queue.</p>`,
        `<p class="y-chinh">🎯 Hình quan trọng nhất của chương, và là hình dễ vào đề nguyên xi nhất. Sáu lệnh I1–I6, ba chính sách, ba con số chu kỳ: <strong>8 → 7 → 6</strong>. Mọi thứ còn lại trong bài này đều dựng trên việc đọc đúng hình này.</p>
<p class="nhan">📐 Giả định của sách, in kèm hình: <strong>I1 cần HAI chu kỳ để thực thi · I3 và I4 TRANH CHẤP cùng một đơn vị chức năng · I5 PHỤ THUỘC vào giá trị do I4 sinh ra · I5 và I6 tranh chấp một đơn vị chức năng.</strong> Máy giải mã 2 lệnh mỗi chu kỳ và có 2 cổng ghi.</p>
<table>
<tr><th>(a) Phát đúng thứ tự, hoàn thành đúng thứ tự</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
<tr><td><strong>Decode</strong></td><td>I1 I2</td><td>I3 I4</td><td>I3 I4</td><td>— I4</td><td>I5 I6</td><td>— I6</td><td>—</td><td>—</td></tr>
<tr><td><strong>Execute</strong></td><td>—</td><td>I1 I2</td><td>I1</td><td>I3</td><td>I4</td><td>I5</td><td>I6</td><td>—</td></tr>
<tr><td><strong>Write</strong></td><td>—</td><td>—</td><td>—</td><td>I1 I2</td><td>—</td><td>I3 I4</td><td>—</td><td>I5 I6</td></tr>
</table>
<table>
<tr><th>(b) Phát đúng thứ tự, hoàn thành KHÔNG theo thứ tự</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th></tr>
<tr><td><strong>Decode</strong></td><td>I1 I2</td><td>I3 I4</td><td>— I4</td><td>I5 I6</td><td>— I6</td><td>—</td><td>—</td></tr>
<tr><td><strong>Execute</strong></td><td>—</td><td>I1 I2</td><td>I1 I3</td><td>I4</td><td>I5</td><td>I6</td><td>—</td></tr>
<tr><td><strong>Write</strong></td><td>—</td><td>—</td><td>I2</td><td>I1 I3</td><td>I4</td><td>I5</td><td>I6</td></tr>
</table>
<table>
<tr><th>(c) Phát KHÔNG theo thứ tự, hoàn thành KHÔNG theo thứ tự</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
<tr><td><strong>Decode</strong></td><td>I1 I2</td><td>I3 I4</td><td>I5 I6</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td><strong>Window (cửa sổ)</strong></td><td>—</td><td>I1, I2</td><td>I3, I4</td><td>I4, I5, I6</td><td>I5</td><td>—</td></tr>
<tr><td><strong>Execute</strong></td><td>—</td><td>I1 I2</td><td>I1 I3</td><td>I6 I4</td><td>I5</td><td>—</td></tr>
<tr><td><strong>Write</strong></td><td>—</td><td>—</td><td>I2</td><td>I1 I3</td><td>I4 I6</td><td>I5</td></tr>
</table>
<p class="nhan">📐 <strong>ĐÃ KIỂM BẰNG MÁY, không phải đếm ô bằng mắt.</strong> Một bộ lập lịch superscalar nhỏ được viết bằng <code>python3</code> (giải mã 1 chu kỳ, thực thi sớm nhất là chu kỳ kế tiếp, ghi sau khi thực thi xong 1 chu kỳ, phát 2 lệnh/chu kỳ, 2 cổng ghi) rồi chạy trên đúng bốn giả định trên. Nó tái tạo hình <em>KHỚP TỪNG Ô</em> — kể cả chi tiết ở (c) <strong>I6 thực thi ở chu kỳ 4, TRƯỚC I5 một chu kỳ</strong>, đó là chỗ DUY NHẤT trong cả hình mà thứ tự chương trình bị vi phạm một cách nhìn thấy được. Kiểm BỘ KIỂM trước khi tin nó — vì chính đoạn script ấy sẽ được dùng cho ví dụ ở dưới.</p>
<p class="dap-an">✅ Đáp án: <strong>(a) 8 chu kỳ · (b) 7 chu kỳ · (c) 6 chu kỳ.</strong> Nới thứ tự HOÀN THÀNH tiết kiệm 1 chu kỳ; nới thêm thứ tự PHÁT tiết kiệm thêm 1 nữa. Tổng lợi từ (a) sang (c) = 8/6 = <strong>1,33×</strong>, trên sáu lệnh và một cỗ máy tí hon.</p>
<ul>
<li><strong>(a) mất chu kỳ ở đâu — hãy đọc hàng Decode.</strong> Ở chu kỳ 3, I3 và I4 ngồi trong tầng giải mã KHÔNG LÀM GÌ, dù một đơn vị chức năng đang rảnh, chỉ vì I1 còn đang thực thi và cơ chế hoàn thành đúng thứ tự không cho máy chỗ nào đỗ tạm một kết quả tới sớm. Đây là triệu chứng đặc trưng của chính sách (a): <strong>một chỗ kẹt LAN NGƯỢC về phía sau và đóng băng cả những lệnh vốn đã sẵn sàng</strong>.</li>
<li><strong>(b) thay đổi cái gì — hãy đọc hàng Write.</strong> I2 ghi ở chu kỳ 3, <em>TRƯỚC</em> I1 ghi ở chu kỳ 4, dù I1 đứng trước trong chương trình. Đó là "hoàn thành không theo thứ tự" gói trong một ô. Ở đây nó hợp lệ CHỈ vì I1 và I2 ghi vào hai thanh ghi khác nhau; nếu chúng ghi cùng một thanh ghi thì bạn có ngay một hazard WAW, đúng cái ràng buộc slide 7 liệt kê và slide 13 gỡ bỏ.</li>
<li><strong>(c) thêm cái gì — hãy đọc hàng Window.</strong> Một tầng mới xuất hiện giữa giải mã và thực thi: <em>CỬA SỔ</em>, giữ I4, I5, I6 cùng lúc ở chu kỳ 4. Vì máy nhìn được cả ba một lượt, nó nhận ra I5 bị chặn (cần kết quả của I4) còn I6 thì không, nên nó chạy <strong>I6 TRƯỚC I5</strong>. Không cỗ máy phát-đúng-thứ-tự nào làm được việc này với bất kỳ giá nào.</li>
<li><strong>Cái giá của (c) không miễn phí và hình đã giấu nó.</strong> Cửa sổ cần mạch so sánh liên kết, đối chiếu MỌI lệnh đang chờ với MỌI kết quả vừa xong, MỖI chu kỳ. Mạch đó phình xấp xỉ theo BÌNH PHƯƠNG kích thước cửa sổ, đó là lý do Figure 18.7 (slide 14) dừng ở cửa sổ = 32 và là lý do đường tăng tốc ở đó đi ngang.</li>
<li><strong>Kỹ thuật làm bài.</strong> Khi đề bảo vẽ một giản đồ kiểu này, LUÔN viết bốn giả định lên đầu trước, rồi điền hàng Execute TRƯỚC hàng Write (Write là hệ quả, Execute mới là quyết định). Và luôn nêu rõ quy ước của bạn về thời điểm một lệnh phụ thuộc được phép bắt đầu — có forwarding thì đó là chu kỳ NGAY SAU khi lệnh sinh ra nó thực thi xong.</li>
</ul>
<p class="pitfall">⚠️ Lỗi phổ biến nhất là tưởng "hoàn thành không theo thứ tự" và "phát không theo thứ tự" là cùng một sự nới lỏng. KHÔNG PHẢI. Ở (b) các lệnh vẫn <em>ĐI VÀO</em> thực thi đúng nghiêm ngặt theo thứ tự chương trình — chỉ có các lần GHI là vượt mặt nhau. Chỉ ở (c) mới có lệnh NHẢY HÀNG.</p>`],

      [12, 'Figure 18.6 — Organization for Out-of-Order Issue with Out-of-Order Completion',
        `<p class="y-chinh">🎯 The block diagram of policy (c), and the single most quoted shape in modern processor design: an <strong>in-order front end</strong>, a <strong>buffer of instructions</strong>, an <strong>out-of-order execution</strong> core, and a final <strong>Commit</strong> stage that puts the world back in order.</p>
<table>
<tr><th>Region on the figure</th><th>Stages drawn</th><th>Order</th><th>Why</th></tr>
<tr><td><strong>In-order front end</strong></td><td>Fetch · Decode · <strong>Rename</strong> · Dispatch</td><td>Strictly program order</td><td>You must decode in order to know what the instructions even are, and renaming must see the true program sequence to assign names correctly</td></tr>
<tr><td><strong>Buffer of instructions</strong></td><td>one wide box across the top</td><td>unordered pool</td><td>The window. Instructions wait here for operands and units</td></tr>
<tr><td><strong>Out-of-order execution</strong></td><td>Issue · Register read · Execute · Write back</td><td><strong>Any order</strong></td><td>Whichever instruction is ready goes first — this is where the speed comes from</td></tr>
<tr><td><strong>Commit</strong></td><td>one tall box on the right</td><td>Back to program order</td><td>Architectural state changes here, sequentially, so interrupts and mispredictions stay recoverable</td></tr>
</table>
<p class="nhan">📐 <strong>A full worked example on exactly this organization.</strong> Take an eight-instruction fragment. The machine: issue width 2, <strong>two ALUs</strong> (1 cycle each), <strong>one multiplier</strong> (2 cycles), <strong>one branch unit</strong>, 2 write ports, forwarding enabled:</p>
<pre>I1:  MUL  R3, R3, R5
I2:  ADD  R4, R3, #1
I3:  ADD  R3, R5, #1
I4:  MUL  R7, R3, R4
I5:  MUL  R8, R6, R2
I6:  SUB  R2, R8, R1
I7:  BEQ  R2, R0, L
I8:  ADD  R9, R9, #4</pre>
<p class="nhan">📐 Step 1 — <strong>list every dependency by type</strong> (produced by the script, not by eye):</p>
<table>
<tr><th>Type</th><th>Pairs found</th><th>Register</th><th>True or false?</th></tr>
<tr><td><strong>RAW</strong> (true data)</td><td>I1→I2 · I1→I4 · I2→I4 · I3→I4 · I5→I6 · I6→I7</td><td>R3 · R3 · R4 · R3 · R8 · R2</td><td><strong>TRUE</strong> — must be obeyed</td></tr>
<tr><td><strong>WAR</strong> (antidependency)</td><td>I1→I3 · I2→I3 · I5→I6</td><td>R3 · R3 · R2</td><td>false — a name collision only</td></tr>
<tr><td><strong>WAW</strong> (output)</td><td>I1→I3</td><td>R3</td><td>false — a name collision only</td></tr>
<tr><td><strong>Procedural</strong></td><td>I7→I8</td><td>—</td><td>control, not data</td></tr>
<tr><td><strong>Resource conflict</strong></td><td>I1, I4, I5 all need the single multiplier</td><td>—</td><td>economic — buy a second one</td></tr>
</table>
<p class="nhan">📐 Step 2 — <strong>the dependency graph</strong>, drawn as a table (an arrow means "must come after"):</p>
<table>
<tr><th>Instruction</th><th>Must wait for (RAW)</th><th>Also ordered after (false deps)</th><th>Depth in the chain</th></tr>
<tr><td>I1 MUL R3</td><td>—</td><td>—</td><td>0</td></tr>
<tr><td>I2 ADD R4</td><td>I1 (R3)</td><td>—</td><td>1</td></tr>
<tr><td>I3 ADD R3</td><td>—</td><td>I1 (WAW R3), I1 &amp; I2 (WAR R3)</td><td>0 really, 2 apparently</td></tr>
<tr><td>I4 MUL R7</td><td>I2 (R4), I3 (R3)</td><td>—</td><td>2</td></tr>
<tr><td>I5 MUL R8</td><td>—</td><td>—</td><td><strong>0 — fully independent</strong></td></tr>
<tr><td>I6 SUB R2</td><td>I5 (R8)</td><td>I5 (WAR R2)</td><td>1</td></tr>
<tr><td>I7 BEQ</td><td>I6 (R2)</td><td>—</td><td>2</td></tr>
<tr><td>I8 ADD R9</td><td>—</td><td>I7 (procedural)</td><td><strong>0 really, blocked by the branch</strong></td></tr>
</table>
<p class="nhan">📐 Step 3 — <strong>the issue diagram for all three policies</strong> (D = waiting in decode/window, EX = executing, WB = write back). Every cell below is output from the Python scheduler that was first proved against Figure 18.5:</p>
<table>
<tr><th>(a) in-order / in-order — <strong>12 cycles</strong></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th></tr>
<tr><td>I1 MUL</td><td>D</td><td>EX</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I2 ADD</td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I3 ADD</td><td></td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I4 MUL</td><td></td><td></td><td></td><td>D</td><td>EX</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I5 MUL</td><td></td><td></td><td></td><td>D</td><td>D</td><td>D</td><td>EX</td><td>EX</td><td>WB</td><td></td><td></td><td></td></tr>
<tr><td>I6 SUB</td><td></td><td></td><td></td><td></td><td>D</td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td><td></td></tr>
<tr><td>I7 BEQ</td><td></td><td></td><td></td><td></td><td></td><td></td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td></tr>
<tr><td>I8 ADD</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>D</td><td>D</td><td>EX</td><td>WB</td></tr>
</table>
<table>
<tr><th>(b) in-order issue / out-of-order completion — <strong>12 cycles</strong></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th></tr>
<tr><td>I1 MUL</td><td>D</td><td>EX</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I2 ADD</td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I3 ADD</td><td></td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I4 MUL</td><td></td><td></td><td></td><td>D</td><td>D</td><td>EX</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td></tr>
<tr><td>I5 MUL</td><td></td><td></td><td></td><td></td><td>D</td><td>D</td><td>EX</td><td>EX</td><td>WB</td><td></td><td></td><td></td></tr>
<tr><td>I6 SUB</td><td></td><td></td><td></td><td></td><td></td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td><td></td></tr>
<tr><td>I7 BEQ</td><td></td><td></td><td></td><td></td><td></td><td></td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td></tr>
<tr><td>I8 ADD</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>D</td><td>D</td><td>EX</td><td>WB</td></tr>
</table>
<table>
<tr><th>(c) out-of-order / out-of-order — <strong>11 cycles</strong></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th></tr>
<tr><td>I1 MUL</td><td>D</td><td>EX</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I2 ADD</td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I3 ADD</td><td></td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I4 MUL</td><td></td><td>D</td><td>D</td><td>D</td><td>EX</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td></tr>
<tr><td>I5 MUL</td><td></td><td></td><td>D</td><td>D</td><td>D</td><td>EX</td><td>EX</td><td>WB</td><td></td><td></td><td></td></tr>
<tr><td>I6 SUB</td><td></td><td></td><td>D</td><td>D</td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td><td></td></tr>
<tr><td>I7 BEQ</td><td></td><td></td><td></td><td>D</td><td>D</td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td></tr>
<tr><td>I8 ADD</td><td></td><td></td><td></td><td>D</td><td>D</td><td>D</td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td></tr>
</table>
<p class="dap-an">✅ Answer: <strong>(a) 12 cycles · (b) 12 cycles · (c) 11 cycles.</strong> The honest and slightly surprising result is that policy (b) buys <em>nothing at all</em> here. Why: out-of-order completion lets I2 write early, but I3 is then held back by the <strong>WAW on R3 with I1</strong> — it may not write R3 until I1 has. On this fragment the false dependencies eat the whole benefit. That is exactly the argument for slide 13: <em>out-of-order completion without register renaming is half a machine.</em></p>
<ul>
<li><strong>Watch I5 and I8, the two fully independent instructions.</strong> Neither has a single RAW input from anything before it, yet in policy (a) I5 does not execute until cycle 7 and I8 not until cycle 11. They are held purely by in-order issue and by the branch. On a wide machine the loss is not in the dependent chains; it is in the independent work that never gets a chance to start.</li>
<li><strong>Why (c) gains only one cycle.</strong> The single multiplier is the binding constraint: I1, I4 and I5 all need it, and it is busy for 2 cycles each time. Out-of-order issue can rearrange <em>who</em> waits, not how many multiplier-cycles exist. This is the practical face of slide 7's distinction: reordering cures dependency stalls, more silicon cures resource conflicts, and neither cures the other.</li>
<li><strong>The branch at I7 caps everything.</strong> I8 is independent of every register in the fragment, yet it cannot issue before I7 resolves. Remove the procedural dependency (perfect branch prediction plus speculation) and I8 would slot into any free ALU cycle. This is the quantitative reason Figure 18.7 on slide 14 is titled "<em>without procedural dependencies</em>" — the book measures the idealised case precisely because the branch dominates otherwise.</li>
<li><strong>Connect to Ch.16.</strong> In the plain 5-stage pipeline of Chapter 16 the same fragment would take roughly 8 + 4 = 12 cycles too, but for a different reason: there, one instruction per cycle is the ceiling. Here the ceiling is 2 per cycle and we still land on 12 — because dependencies, not width, are doing the limiting. That is the whole chapter in one comparison.</li>
</ul>
<p class="meo">💡 Method for any exam question of this shape, in four steps: (1) tabulate RAW/WAR/WAW/procedural/resource; (2) draw the graph and find the <strong>longest RAW chain</strong> — that is your absolute floor; (3) add resource stalls; (4) only then fill the grid. Here the longest true chain is I1 → I2 → I4, which is 2 + 1 + 2 = 5 cycles of execution, so no policy could ever beat about 7–8 cycles end to end.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ khối của chính sách (c), và là hình dạng được trích dẫn nhiều nhất trong thiết kế bộ xử lý hiện đại: một <strong>đầu trước ĐÚNG THỨ TỰ</strong>, một <strong>bộ đệm lệnh</strong>, một lõi <strong>thực thi KHÔNG theo thứ tự</strong>, và một tầng <strong>Commit</strong> cuối cùng đặt thế giới trở lại đúng thứ tự.</p>
<table>
<tr><th>Vùng trên hình</th><th>Các tầng được vẽ</th><th>Thứ tự</th><th>Vì sao</th></tr>
<tr><td><strong>In-order front end</strong></td><td>Fetch · Decode · <strong>Rename</strong> · Dispatch</td><td>Nghiêm ngặt theo thứ tự chương trình</td><td>Phải giải mã theo thứ tự thì mới biết các lệnh là gì, và việc đổi tên PHẢI nhìn thấy đúng trình tự chương trình mới gán tên đúng được</td></tr>
<tr><td><strong>Buffer of instructions</strong></td><td>một hộp rộng vắt ngang phía trên</td><td>một bể KHÔNG thứ tự</td><td>Đây là CỬA SỔ. Lệnh nằm chờ toán hạng và đơn vị chức năng ở đây</td></tr>
<tr><td><strong>Out-of-order execution</strong></td><td>Issue · Register read · Execute · Write back</td><td><strong>Thứ tự bất kỳ</strong></td><td>Lệnh nào sẵn sàng thì đi trước — tốc độ sinh ra từ đây</td></tr>
<tr><td><strong>Commit</strong></td><td>một hộp cao bên phải</td><td>Trở lại đúng thứ tự chương trình</td><td>Trạng thái kiến trúc thay đổi ở đây, TUẦN TỰ, để ngắt và nhánh đoán sai vẫn cứu được</td></tr>
</table>
<p class="nhan">📐 <strong>Một ví dụ làm trọn trên đúng tổ chức này.</strong> Lấy một đoạn tám lệnh. Cỗ máy: bề rộng phát 2, <strong>HAI ALU</strong> (1 chu kỳ mỗi cái), <strong>MỘT bộ nhân</strong> (2 chu kỳ), <strong>MỘT đơn vị rẽ nhánh</strong>, 2 cổng ghi, có forwarding:</p>
<pre>I1:  MUL  R3, R3, R5
I2:  ADD  R4, R3, #1
I3:  ADD  R3, R5, #1
I4:  MUL  R7, R3, R4
I5:  MUL  R8, R6, R2
I6:  SUB  R2, R8, R1
I7:  BEQ  R2, R0, L
I8:  ADD  R9, R9, #4</pre>
<p class="nhan">📐 Bước 1 — <strong>liệt kê MỌI phụ thuộc theo loại</strong> (do script sinh ra, không phải nhìn bằng mắt):</p>
<table>
<tr><th>Loại</th><th>Các cặp tìm được</th><th>Thanh ghi</th><th>Thật hay giả?</th></tr>
<tr><td><strong>RAW</strong> (dữ liệu thật)</td><td>I1→I2 · I1→I4 · I2→I4 · I3→I4 · I5→I6 · I6→I7</td><td>R3 · R3 · R4 · R3 · R8 · R2</td><td><strong>THẬT</strong> — bắt buộc phải tuân thủ</td></tr>
<tr><td><strong>WAR</strong> (phản phụ thuộc)</td><td>I1→I3 · I2→I3 · I5→I6</td><td>R3 · R3 · R2</td><td>GIẢ — chỉ là va chạm TÊN</td></tr>
<tr><td><strong>WAW</strong> (đầu ra)</td><td>I1→I3</td><td>R3</td><td>GIẢ — chỉ là va chạm TÊN</td></tr>
<tr><td><strong>Thủ tục</strong></td><td>I7→I8</td><td>—</td><td>điều khiển, không phải dữ liệu</td></tr>
<tr><td><strong>Xung đột tài nguyên</strong></td><td>I1, I4, I5 đều cần bộ nhân DUY NHẤT</td><td>—</td><td>kinh tế — mua thêm cái thứ hai</td></tr>
</table>
<p class="nhan">📐 Bước 2 — <strong>ĐỒ THỊ PHỤ THUỘC</strong>, vẽ bằng bảng (mũi tên nghĩa là "phải đứng sau"):</p>
<table>
<tr><th>Lệnh</th><th>Phải chờ (RAW)</th><th>Còn bị xếp sau (phụ thuộc giả)</th><th>Độ sâu trong chuỗi</th></tr>
<tr><td>I1 MUL R3</td><td>—</td><td>—</td><td>0</td></tr>
<tr><td>I2 ADD R4</td><td>I1 (R3)</td><td>—</td><td>1</td></tr>
<tr><td>I3 ADD R3</td><td>—</td><td>I1 (WAW R3), I1 &amp; I2 (WAR R3)</td><td>thực chất 0, BỀ NGOÀI 2</td></tr>
<tr><td>I4 MUL R7</td><td>I2 (R4), I3 (R3)</td><td>—</td><td>2</td></tr>
<tr><td>I5 MUL R8</td><td>—</td><td>—</td><td><strong>0 — độc lập hoàn toàn</strong></td></tr>
<tr><td>I6 SUB R2</td><td>I5 (R8)</td><td>I5 (WAR R2)</td><td>1</td></tr>
<tr><td>I7 BEQ</td><td>I6 (R2)</td><td>—</td><td>2</td></tr>
<tr><td>I8 ADD R9</td><td>—</td><td>I7 (thủ tục)</td><td><strong>thực chất 0, bị nhánh chặn</strong></td></tr>
</table>
<p class="nhan">📐 Bước 3 — <strong>GIẢN ĐỒ PHÁT LỆNH cho cả ba chính sách</strong> (D = đang chờ ở decode/cửa sổ, EX = đang thực thi, WB = ghi kết quả). Mọi ô dưới đây là ĐẦU RA của bộ lập lịch Python đã được chứng minh trước bằng Figure 18.5:</p>
<table>
<tr><th>(a) đúng thứ tự / đúng thứ tự — <strong>12 chu kỳ</strong></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th></tr>
<tr><td>I1 MUL</td><td>D</td><td>EX</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I2 ADD</td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I3 ADD</td><td></td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I4 MUL</td><td></td><td></td><td></td><td>D</td><td>EX</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I5 MUL</td><td></td><td></td><td></td><td>D</td><td>D</td><td>D</td><td>EX</td><td>EX</td><td>WB</td><td></td><td></td><td></td></tr>
<tr><td>I6 SUB</td><td></td><td></td><td></td><td></td><td>D</td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td><td></td></tr>
<tr><td>I7 BEQ</td><td></td><td></td><td></td><td></td><td></td><td></td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td></tr>
<tr><td>I8 ADD</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>D</td><td>D</td><td>EX</td><td>WB</td></tr>
</table>
<table>
<tr><th>(b) phát đúng thứ tự / hoàn thành không thứ tự — <strong>12 chu kỳ</strong></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th></tr>
<tr><td>I1 MUL</td><td>D</td><td>EX</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I2 ADD</td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I3 ADD</td><td></td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I4 MUL</td><td></td><td></td><td></td><td>D</td><td>D</td><td>EX</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td></tr>
<tr><td>I5 MUL</td><td></td><td></td><td></td><td></td><td>D</td><td>D</td><td>EX</td><td>EX</td><td>WB</td><td></td><td></td><td></td></tr>
<tr><td>I6 SUB</td><td></td><td></td><td></td><td></td><td></td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td><td></td></tr>
<tr><td>I7 BEQ</td><td></td><td></td><td></td><td></td><td></td><td></td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td></tr>
<tr><td>I8 ADD</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td>D</td><td>D</td><td>EX</td><td>WB</td></tr>
</table>
<table>
<tr><th>(c) không thứ tự / không thứ tự — <strong>11 chu kỳ</strong></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th></tr>
<tr><td>I1 MUL</td><td>D</td><td>EX</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I2 ADD</td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I3 ADD</td><td></td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>I4 MUL</td><td></td><td>D</td><td>D</td><td>D</td><td>EX</td><td>EX</td><td>WB</td><td></td><td></td><td></td><td></td></tr>
<tr><td>I5 MUL</td><td></td><td></td><td>D</td><td>D</td><td>D</td><td>EX</td><td>EX</td><td>WB</td><td></td><td></td><td></td></tr>
<tr><td>I6 SUB</td><td></td><td></td><td>D</td><td>D</td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td><td></td></tr>
<tr><td>I7 BEQ</td><td></td><td></td><td></td><td>D</td><td>D</td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td><td></td></tr>
<tr><td>I8 ADD</td><td></td><td></td><td></td><td>D</td><td>D</td><td>D</td><td>D</td><td>D</td><td>D</td><td>EX</td><td>WB</td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>(a) 12 chu kỳ · (b) 12 chu kỳ · (c) 11 chu kỳ.</strong> Kết quả thành thật và hơi bất ngờ là chính sách (b) ở đây <em>KHÔNG được gì cả</em>. Vì sao: hoàn thành không theo thứ tự cho phép I2 ghi sớm, nhưng I3 lại bị giữ lại bởi <strong>WAW trên R3 với I1</strong> — nó không được ghi R3 chừng nào I1 chưa ghi. Trên đoạn mã này các phụ thuộc GIẢ nuốt trọn phần lợi. Đó đúng là lập luận cho slide 13: <em>hoàn thành không theo thứ tự mà KHÔNG đổi tên thanh ghi thì chỉ là nửa cỗ máy.</em></p>
<ul>
<li><strong>Hãy nhìn I5 và I8, hai lệnh độc lập hoàn toàn.</strong> Không lệnh nào có lấy một đầu vào RAW từ thứ gì trước nó, vậy mà ở chính sách (a) I5 mãi tới chu kỳ 7 mới chạy và I8 tới chu kỳ 11. Chúng bị giữ THUẦN TUÝ bởi phát-đúng-thứ-tự và bởi cái nhánh. Trên máy rộng, tổn thất không nằm ở các chuỗi phụ thuộc; nó nằm ở phần việc ĐỘC LẬP không bao giờ có cơ hội khởi động.</li>
<li><strong>Vì sao (c) chỉ được đúng MỘT chu kỳ.</strong> Bộ nhân duy nhất là ràng buộc siết chặt nhất: I1, I4 và I5 đều cần nó, và mỗi lần nó bận 2 chu kỳ. Phát không theo thứ tự sắp xếp lại được <em>AI</em> phải chờ, chứ không tạo thêm được chu kỳ-bộ-nhân. Đây là bộ mặt thực tế của phân biệt ở slide 7: sắp xếp lại chữa chỗ kẹt do phụ thuộc, thêm silic chữa xung đột tài nguyên, và không cái nào chữa được cái kia.</li>
<li><strong>Lệnh nhánh I7 đóng trần cho tất cả.</strong> I8 độc lập với mọi thanh ghi trong đoạn, vậy mà nó không thể phát trước khi I7 được giải quyết. Bỏ phụ thuộc thủ tục đi (dự đoán nhánh hoàn hảo cộng chạy suy đoán) thì I8 lọt vào bất kỳ chu kỳ ALU rảnh nào. Đây là lý do ĐỊNH LƯỢNG khiến Figure 18.7 ở slide 14 mang tên "<em>without procedural dependencies</em>" — sách đo ca lý tưởng hoá chính vì nếu không thì cái nhánh át hết.</li>
<li><strong>Nối sang Ch.16.</strong> Trên đường ống 5 tầng thường của Chương 16, cùng đoạn này cũng mất khoảng 8 + 4 = 12 chu kỳ, nhưng vì lý do KHÁC: ở đó trần là một lệnh mỗi chu kỳ. Ở đây trần là hai lệnh mỗi chu kỳ mà ta vẫn rơi đúng 12 — vì các PHỤ THUỘC, chứ không phải bề rộng, mới đang là thứ chặn. Cả chương gói trong một phép so sánh đó.</li>
</ul>
<p class="meo">💡 Phương pháp cho mọi câu hỏi thi dạng này, bốn bước: (1) lập bảng RAW/WAR/WAW/thủ tục/tài nguyên; (2) vẽ đồ thị và tìm <strong>chuỗi RAW DÀI NHẤT</strong> — đó là SÀN tuyệt đối của bạn; (3) cộng thêm chỗ kẹt vì tài nguyên; (4) đến lúc đó mới điền lưới. Ở đây chuỗi thật dài nhất là I1 → I2 → I4, tức 2 + 1 + 2 = 5 chu kỳ thực thi, nên không chính sách nào có thể xuống dưới khoảng 7–8 chu kỳ tổng thể.</p>`],

      [13, 'Register Renaming (1 of 2)',
        `<p class="y-chinh">🎯 Three boxes chained by arrows, and they are a cause-and-effect story: <strong>"Output and antidependencies occur because register contents may not reflect the correct ordering from the program"</strong> → <strong>"May result in a pipeline stall"</strong> → <strong>"Registers allocated dynamically"</strong>. That last four-word box is the entire solution.</p>
<ul>
<li><strong>Read box 1 very carefully — it names the culprit exactly.</strong> Output dependencies (WAW) and antidependencies (WAR) exist because the <em>contents</em> of a register no longer tell you which instruction put them there. The register name is a shared mailbox, and two unrelated instructions were given the same mailbox by the compiler. No value flows between them; only the name is shared.</li>
<li><strong>Box 3 is the fix, and "dynamically" is the load-bearing word.</strong> Registers are allocated by the <em>hardware at run time</em>, not by the compiler at compile time. When an instruction writes to architectural register R3, the rename stage hands it a fresh <em>physical</em> register and records the mapping. The next instruction that writes R3 gets a <em>different</em> physical register. Two writers, two mailboxes, no collision.</li>
<li><strong>It is done in the in-order front end, and that is not an accident.</strong> Look back at Figure 18.6 (slide 12): <em>Rename</em> sits between Decode and Dispatch, inside the in-order region. Renaming must see the true program sequence to know which write is "the latest" for each name — do it out of order and you would assign the wrong mapping to a reader.</li>
<li><strong>What renaming can never do.</strong> It cannot touch a RAW dependency. If I2 genuinely needs the number that I1 computes, no amount of naming changes that the number does not exist yet. Renaming removes <em>name</em> conflicts, never <em>value</em> conflicts. An exam answer that says "register renaming eliminates all data hazards" is wrong.</li>
</ul>
<p class="nhan">📐 <strong>Apply it to the same eight instructions from slide 12.</strong> Each write gets a fresh physical name; each read is redirected to the most recent physical name for that architectural register:</p>
<table>
<tr><th>Original</th><th>After renaming</th><th>What changed</th></tr>
<tr><td><code>I1: MUL R3, R3, R5</code></td><td><code>MUL R3b, R3a, R5a</code></td><td>Writes a brand-new R3b; reads the old R3a</td></tr>
<tr><td><code>I2: ADD R4, R3, #1</code></td><td><code>ADD R4b, R3b, #1</code></td><td>Reads R3b — the RAW from I1 is <strong>preserved</strong>, correctly</td></tr>
<tr><td><code>I3: ADD R3, R5, #1</code></td><td><code>ADD R3c, R5a, #1</code></td><td><strong>Writes R3c, a third name.</strong> The WAW with I1 and the WAR with I1/I2 are gone</td></tr>
<tr><td><code>I4: MUL R7, R3, R4</code></td><td><code>MUL R7b, R3c, R4b</code></td><td>Reads R3c — the RAW from I3 is preserved. Note the spurious I1→I4 edge has vanished</td></tr>
<tr><td><code>I5: MUL R8, R6, R2</code></td><td><code>MUL R8b, R6a, R2a</code></td><td>Reads the original R2a</td></tr>
<tr><td><code>I6: SUB R2, R8, R1</code></td><td><code>SUB R2b, R8b, R1a</code></td><td><strong>Writes R2b.</strong> The WAR against I5 on R2 is gone</td></tr>
<tr><td><code>I7: BEQ R2, R0, L</code></td><td><code>BEQ R2b, R0</code></td><td>RAW from I6 preserved</td></tr>
<tr><td><code>I8: ADD R9, R9, #4</code></td><td><code>ADD R9b, R9a, #4</code></td><td>Unchanged in structure; still blocked by the branch</td></tr>
</table>
<p class="nhan">📐 Re-running the dependency scan on the renamed code (same script, same machine):</p>
<table>
<tr><th>Type</th><th>Before renaming</th><th>After renaming</th></tr>
<tr><td><strong>RAW</strong></td><td>6 pairs: I1→I2, I1→I4, I2→I4, I3→I4, I5→I6, I6→I7</td><td><strong>5 pairs</strong> — I1→I4 disappeared, because I4 now reads R3c not R3</td></tr>
<tr><td><strong>WAR</strong></td><td>3 pairs: I1→I3, I2→I3, I5→I6</td><td><strong>0 — ALL GONE</strong></td></tr>
<tr><td><strong>WAW</strong></td><td>1 pair: I1→I3</td><td><strong>0 — GONE</strong></td></tr>
<tr><td><strong>Procedural</strong></td><td>I7→I8</td><td>I7→I8 — <strong>unchanged</strong>, renaming cannot touch control</td></tr>
</table>
<p class="nhan">📐 And re-running the three schedules on the renamed code:</p>
<table>
<tr><th>Policy</th><th>Before renaming</th><th>After renaming</th><th>Saved</th></tr>
<tr><td>(a) in-order issue / in-order completion</td><td>12 cycles</td><td><strong>12 cycles</strong></td><td><strong>nothing</strong></td></tr>
<tr><td>(b) in-order issue / out-of-order completion</td><td>12 cycles</td><td><strong>11 cycles</strong></td><td>1 cycle</td></tr>
<tr><td>(c) out-of-order issue / out-of-order completion</td><td>11 cycles</td><td><strong>9 cycles</strong></td><td><strong>2 cycles</strong></td></tr>
</table>
<p class="dap-an">✅ Answer: renaming removes <strong>all 3 WAR pairs and the 1 WAW pair</strong>, and drives the best policy from <strong>11 down to 9 cycles</strong>. Measured against the plain in-order baseline of 12, the combination "out-of-order issue + register renaming" gives 12/9 = <strong>1.33× speedup</strong>. And note the row that earns its place: policy (a) gains <strong>exactly zero</strong> from renaming. With in-order completion, results are written in program order anyway, so WAW and WAR could never have caused a stall — there was nothing for renaming to remove. <strong>Renaming only pays when completion is out of order.</strong> That is precisely the shape of Figure 18.7 on the next slide.</p>
<p class="pitfall">⚠️ This slide is titled "(1 of 2)" and prints no example at all — the four-instruction renaming example students usually quote is in the textbook, not on any slide, and the "(2 of 2)" slide is number 26, in the second half of this deck, where it is applied to the Intel Core (16 architectural registers remapped onto 128 physical ones).</p>
<p class="meo">💡 The mailbox picture: an architectural register is a <strong>named pigeonhole shared by the whole program</strong>; a physical register is <strong>a fresh envelope per result</strong>. Renaming just stops reusing envelopes. Two people writing to the same pigeonhole must take turns; two people with their own envelopes need not.</p>`,
        `<p class="y-chinh">🎯 Ba cái hộp nối bằng mũi tên, và chúng là một câu chuyện NHÂN — QUẢ: <strong>"Phụ thuộc đầu ra và phản phụ thuộc xảy ra VÌ nội dung thanh ghi có thể KHÔNG phản ánh đúng thứ tự của chương trình"</strong> → <strong>"Có thể gây ra chỗ kẹt trong đường ống"</strong> → <strong>"Thanh ghi được cấp phát ĐỘNG"</strong>. Cái hộp bốn chữ cuối cùng đó chính là toàn bộ lời giải.</p>
<ul>
<li><strong>Đọc hộp 1 thật kỹ — nó gọi đúng tên thủ phạm.</strong> Phụ thuộc đầu ra (WAW) và phản phụ thuộc (WAR) tồn tại vì <em>NỘI DUNG</em> một thanh ghi không còn cho bạn biết lệnh nào đã đặt nó vào đó. Tên thanh ghi là một cái HỘP THƯ DÙNG CHUNG, và hai lệnh chẳng liên quan gì tới nhau lại bị trình biên dịch phát cho cùng một hộp thư. Không có giá trị nào chảy giữa chúng; chỉ có cái TÊN là chung.</li>
<li><strong>Hộp 3 là cách chữa, và chữ "ĐỘNG" là chữ chịu lực.</strong> Thanh ghi được cấp phát bởi <em>PHẦN CỨNG LÚC CHẠY</em>, không phải bởi trình biên dịch lúc dịch. Khi một lệnh ghi vào thanh ghi kiến trúc R3, tầng rename phát cho nó một thanh ghi <em>VẬT LÝ</em> mới toanh và ghi lại ánh xạ. Lệnh kế tiếp ghi R3 sẽ nhận một thanh ghi vật lý <em>KHÁC</em>. Hai người ghi, hai hộp thư, không va chạm.</li>
<li><strong>Việc này làm ở đầu-trước ĐÚNG THỨ TỰ, và đó không phải ngẫu nhiên.</strong> Nhìn lại Figure 18.6 (slide 12): <em>Rename</em> nằm giữa Decode và Dispatch, BÊN TRONG vùng đúng-thứ-tự. Đổi tên PHẢI nhìn thấy trình tự chương trình thật mới biết lần ghi nào là "mới nhất" cho mỗi tên — làm nó không theo thứ tự thì bạn sẽ gán nhầm ánh xạ cho một lệnh đọc.</li>
<li><strong>Điều đổi tên KHÔNG BAO GIỜ làm được.</strong> Nó không đụng tới được phụ thuộc RAW. Nếu I2 thật sự cần con số mà I1 tính ra thì không cách đặt tên nào thay đổi được sự thật rằng con số đó CHƯA TỒN TẠI. Đổi tên gỡ xung đột <em>TÊN</em>, không bao giờ gỡ xung đột <em>GIÁ TRỊ</em>. Bài thi trả lời "đổi tên thanh ghi loại bỏ mọi data hazard" là SAI.</li>
</ul>
<p class="nhan">📐 <strong>Áp dụng vào đúng tám lệnh của slide 12.</strong> Mỗi lần ghi nhận một tên vật lý mới; mỗi lần đọc được chuyển hướng tới tên vật lý MỚI NHẤT của thanh ghi kiến trúc đó:</p>
<table>
<tr><th>Bản gốc</th><th>Sau khi đổi tên</th><th>Đổi cái gì</th></tr>
<tr><td><code>I1: MUL R3, R3, R5</code></td><td><code>MUL R3b, R3a, R5a</code></td><td>Ghi vào R3b mới tinh; đọc R3a cũ</td></tr>
<tr><td><code>I2: ADD R4, R3, #1</code></td><td><code>ADD R4b, R3b, #1</code></td><td>Đọc R3b — RAW từ I1 được <strong>GIỮ NGUYÊN</strong>, đúng như phải thế</td></tr>
<tr><td><code>I3: ADD R3, R5, #1</code></td><td><code>ADD R3c, R5a, #1</code></td><td><strong>Ghi vào R3c, cái tên thứ ba.</strong> WAW với I1 và WAR với I1/I2 BIẾN MẤT</td></tr>
<tr><td><code>I4: MUL R7, R3, R4</code></td><td><code>MUL R7b, R3c, R4b</code></td><td>Đọc R3c — RAW từ I3 được giữ. Để ý cạnh giả I1→I4 đã biến mất</td></tr>
<tr><td><code>I5: MUL R8, R6, R2</code></td><td><code>MUL R8b, R6a, R2a</code></td><td>Đọc R2a gốc</td></tr>
<tr><td><code>I6: SUB R2, R8, R1</code></td><td><code>SUB R2b, R8b, R1a</code></td><td><strong>Ghi vào R2b.</strong> WAR với I5 trên R2 biến mất</td></tr>
<tr><td><code>I7: BEQ R2, R0, L</code></td><td><code>BEQ R2b, R0</code></td><td>RAW từ I6 được giữ</td></tr>
<tr><td><code>I8: ADD R9, R9, #4</code></td><td><code>ADD R9b, R9a, #4</code></td><td>Cấu trúc không đổi; vẫn bị nhánh chặn</td></tr>
</table>
<p class="nhan">📐 Chạy lại phép quét phụ thuộc trên mã đã đổi tên (cùng script, cùng cỗ máy):</p>
<table>
<tr><th>Loại</th><th>Trước khi đổi tên</th><th>Sau khi đổi tên</th></tr>
<tr><td><strong>RAW</strong></td><td>6 cặp: I1→I2, I1→I4, I2→I4, I3→I4, I5→I6, I6→I7</td><td><strong>5 cặp</strong> — I1→I4 biến mất, vì I4 giờ đọc R3c chứ không đọc R3</td></tr>
<tr><td><strong>WAR</strong></td><td>3 cặp: I1→I3, I2→I3, I5→I6</td><td><strong>0 — SẠCH HẾT</strong></td></tr>
<tr><td><strong>WAW</strong></td><td>1 cặp: I1→I3</td><td><strong>0 — BIẾN MẤT</strong></td></tr>
<tr><td><strong>Thủ tục</strong></td><td>I7→I8</td><td>I7→I8 — <strong>KHÔNG ĐỔI</strong>, đổi tên không đụng được tới điều khiển</td></tr>
</table>
<p class="nhan">📐 Và chạy lại ba lịch phát lệnh trên mã đã đổi tên:</p>
<table>
<tr><th>Chính sách</th><th>Trước đổi tên</th><th>Sau đổi tên</th><th>Tiết kiệm</th></tr>
<tr><td>(a) phát đúng thứ tự / hoàn thành đúng thứ tự</td><td>12 chu kỳ</td><td><strong>12 chu kỳ</strong></td><td><strong>KHÔNG GÌ CẢ</strong></td></tr>
<tr><td>(b) phát đúng thứ tự / hoàn thành không thứ tự</td><td>12 chu kỳ</td><td><strong>11 chu kỳ</strong></td><td>1 chu kỳ</td></tr>
<tr><td>(c) phát không thứ tự / hoàn thành không thứ tự</td><td>11 chu kỳ</td><td><strong>9 chu kỳ</strong></td><td><strong>2 chu kỳ</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án: đổi tên gỡ bỏ <strong>cả 3 cặp WAR và 1 cặp WAW</strong>, và kéo chính sách tốt nhất từ <strong>11 xuống 9 chu kỳ</strong>. So với mốc phát-đúng-thứ-tự 12 chu kỳ, tổ hợp "phát không theo thứ tự + đổi tên thanh ghi" cho 12/9 = <strong>tăng tốc 1,33×</strong>. Và để ý cái hàng đáng giá nhất: chính sách (a) được <strong>ĐÚNG BẰNG KHÔNG</strong> từ việc đổi tên. Với hoàn thành đúng thứ tự thì kết quả dù sao cũng được ghi theo thứ tự chương trình, nên WAW và WAR chưa bao giờ gây kẹt được — chẳng có gì cho việc đổi tên gỡ cả. <strong>Đổi tên chỉ có lãi khi việc hoàn thành KHÔNG theo thứ tự.</strong> Đó chính xác là hình dạng của Figure 18.7 ở slide kế tiếp.</p>
<p class="pitfall">⚠️ Slide này mang tên "(1 of 2)" và KHÔNG in một ví dụ nào cả — ví dụ đổi tên bốn lệnh mà sinh viên hay trích nằm trong SÁCH, không nằm trên slide nào, còn slide "(2 of 2)" là slide số 26, thuộc nửa sau của deck, ở đó nó được áp vào Intel Core (16 thanh ghi kiến trúc ánh xạ lên 128 thanh ghi vật lý).</p>
<p class="meo">💡 Hình ảnh hộp thư: thanh ghi kiến trúc là <strong>một ô thư CÓ TÊN dùng chung cho cả chương trình</strong>; thanh ghi vật lý là <strong>một chiếc phong bì MỚI cho mỗi kết quả</strong>. Đổi tên chỉ đơn giản là THÔI TÁI SỬ DỤNG phong bì. Hai người cùng ghi vào một ô thư thì phải thay phiên; hai người có phong bì riêng thì không cần.</p>`],

      [14, 'Figure 18.7 — Speedups of Various Machine Organizations without Procedural Dependencies',
        `<p class="y-chinh">🎯 Two bar charts side by side — <strong>"Without renaming"</strong> on the left, <strong>"With renaming"</strong> on the right — each with four hardware configurations and three window sizes (8, 16, 32). It is the experimental proof of everything slides 11–13 argued, and the message is blunt: <strong>hardware you add without renaming is largely wasted.</strong></p>
<table>
<tr><th>Configuration (x-axis)</th><th>What it means</th><th>Without renaming (window 8 / 16 / 32)</th><th>With renaming (window 8 / 16 / 32)</th></tr>
<tr><td><strong>base</strong></td><td>The baseline machine</td><td>≈ 1.9 / 2.0 / 2.1</td><td>≈ 2.35 / 2.55 / 2.6</td></tr>
<tr><td><strong>+ld/st</strong></td><td>Add a load/store unit</td><td>≈ 1.9 / 2.0 / 2.1</td><td>≈ 2.4 / 2.6 / 2.65</td></tr>
<tr><td><strong>+alu</strong></td><td>Add an ALU</td><td>≈ 2.2 / 2.4 / 2.45</td><td>≈ 2.9 / 3.25 / 3.75</td></tr>
<tr><td><strong>+both</strong></td><td>Add both</td><td>≈ 2.3 / 2.5 / 2.6</td><td><strong>≈ 3.0 / 3.75 / 4.15</strong></td></tr>
</table>
<ul>
<li><strong>Read the two charts as one experiment with one variable.</strong> Same benchmarks, same units, same window sizes. The only difference between left and right is whether the machine renames registers. Left tops out around <strong>2.6×</strong>; right reaches <strong>4.15×</strong>. Renaming alone is worth roughly <strong>60% more speedup</strong> at the best configuration — from hardware that costs a rename table and extra physical registers, far less area than a second ALU.</li>
<li><strong>The "+ld/st" bars are the punchline nobody notices.</strong> On the left, adding a load/store unit changes almost nothing (1.92 → 1.92 at window 8). You bought a whole functional unit and got zero. Why? Because the machine could not reach the independent loads anyway — they were blocked behind false dependencies. <strong>A resource you cannot reach is not a resource.</strong> This is the chart's version of what happened to I5 and I8 in the worked example on slide 12.</li>
<li><strong>Window size only helps once the false dependencies are gone.</strong> Left chart: going from window 8 to 32 buys about 0.2–0.3. Right chart, +alu configuration: 2.9 → 3.75, nearly 0.9. A bigger window lets the machine <em>look</em> further ahead, but looking further is pointless if everything you see is falsely serialised. <strong>Renaming and windowing multiply each other; neither works alone.</strong></li>
<li><strong>Mind the title: "without procedural dependencies".</strong> This is an idealised experiment in which branches are assumed resolved for free. Real machines have branches, which is why Table 18.1 (slide 5) reports a median of 2.25× while this chart reaches 4.15×. The gap between the two numbers <em>is</em> the cost of branches — and that is the entire justification for slide 15.</li>
<li><strong>The curve is flattening, and that is the historical punchline.</strong> Even in this idealised setting, doubling the window from 16 to 32 in the best configuration buys only 3.75 → 4.15. Meanwhile the window's comparison logic grows roughly with the square of its size. This diminishing return is exactly why the industry stopped widening single cores around 2005 and went multicore instead (Ch.21).</li>
</ul>
<p class="pitfall">⚠️ Exam trap: do not read these bars as "a superscalar processor is 4× faster". They are speedups of an idealised machine with no procedural dependencies. If a question asks what a real superscalar achieves, quote Table 18.1's roughly 2× and explain the difference in one sentence: branches and memory.</p>
<p class="meo">💡 One sentence to keep from this slide: <strong>"More units without renaming is money burned; renaming without more units is a small gain; the two together are where the 4× lives."</strong></p>`,
        `<p class="y-chinh">🎯 Hai biểu đồ cột đặt cạnh nhau — <strong>"Without renaming"</strong> (không đổi tên) bên trái, <strong>"With renaming"</strong> (có đổi tên) bên phải — mỗi bên bốn cấu hình phần cứng và ba cỡ cửa sổ (8, 16, 32). Đây là BẰNG CHỨNG THỰC NGHIỆM cho mọi thứ slide 11–13 lập luận, và thông điệp thì thẳng thừng: <strong>phần cứng bạn thêm vào mà không có đổi tên thì phần lớn là ném đi.</strong></p>
<table>
<tr><th>Cấu hình (trục x)</th><th>Nghĩa là gì</th><th>Không đổi tên (cửa sổ 8 / 16 / 32)</th><th>Có đổi tên (cửa sổ 8 / 16 / 32)</th></tr>
<tr><td><strong>base</strong></td><td>Cỗ máy nền</td><td>≈ 1,9 / 2,0 / 2,1</td><td>≈ 2,35 / 2,55 / 2,6</td></tr>
<tr><td><strong>+ld/st</strong></td><td>Thêm một đơn vị nạp/lưu</td><td>≈ 1,9 / 2,0 / 2,1</td><td>≈ 2,4 / 2,6 / 2,65</td></tr>
<tr><td><strong>+alu</strong></td><td>Thêm một ALU</td><td>≈ 2,2 / 2,4 / 2,45</td><td>≈ 2,9 / 3,25 / 3,75</td></tr>
<tr><td><strong>+both</strong></td><td>Thêm cả hai</td><td>≈ 2,3 / 2,5 / 2,6</td><td><strong>≈ 3,0 / 3,75 / 4,15</strong></td></tr>
</table>
<ul>
<li><strong>Đọc hai biểu đồ như MỘT thí nghiệm với MỘT biến số.</strong> Cùng benchmark, cùng số đơn vị, cùng cỡ cửa sổ. Khác biệt duy nhất giữa trái và phải là máy CÓ đổi tên thanh ghi hay KHÔNG. Bên trái đụng trần khoảng <strong>2,6×</strong>; bên phải chạm <strong>4,15×</strong>. Riêng việc đổi tên đáng giá khoảng <strong>60% tăng tốc nhiều hơn</strong> ở cấu hình tốt nhất — từ một phần cứng chỉ gồm bảng ánh xạ tên và ít thanh ghi vật lý dư, tốn ít diện tích hơn hẳn một ALU thứ hai.</li>
<li><strong>Cụm cột "+ld/st" mới là cú chốt mà ít ai để ý.</strong> Bên trái, thêm một đơn vị nạp/lưu gần như chẳng đổi gì (1,92 → 1,92 ở cửa sổ 8). Bạn mua nguyên một đơn vị chức năng và nhận về SỐ KHÔNG. Vì sao? Vì đằng nào máy cũng không VỚI TỚI được các lệnh nạp độc lập — chúng bị chặn sau những phụ thuộc GIẢ. <strong>Tài nguyên mà bạn không với tới được thì không phải tài nguyên.</strong> Đây là phiên bản biểu đồ của đúng chuyện đã xảy ra với I5 và I8 trong ví dụ ở slide 12.</li>
<li><strong>Cỡ cửa sổ chỉ giúp SAU KHI các phụ thuộc giả đã bị gỡ.</strong> Biểu đồ trái: đi từ cửa sổ 8 lên 32 chỉ mua được khoảng 0,2–0,3. Biểu đồ phải, cấu hình +alu: 2,9 → 3,75, gần 0,9. Cửa sổ to hơn cho máy <em>NHÌN</em> xa hơn, nhưng nhìn xa thì vô ích nếu mọi thứ nhìn thấy đều bị nối đuôi một cách giả tạo. <strong>Đổi tên và cửa sổ NHÂN LÊN với nhau; không cái nào chạy một mình được.</strong></li>
<li><strong>Chú ý tiêu đề: "without procedural dependencies".</strong> Đây là thí nghiệm LÝ TƯỞNG HOÁ, giả định rẽ nhánh được giải quyết miễn phí. Máy thật thì có rẽ nhánh, đó là lý do Table 18.1 (slide 5) báo trung vị 2,25× trong khi biểu đồ này chạm 4,15×. Khoảng cách giữa hai con số ấy CHÍNH LÀ cái giá của rẽ nhánh — và đó là toàn bộ lý do tồn tại của slide 15.</li>
<li><strong>Đường cong đang ĐI NGANG, và đó mới là cú chốt lịch sử.</strong> Ngay cả trong bối cảnh lý tưởng hoá này, nhân đôi cửa sổ từ 16 lên 32 ở cấu hình tốt nhất chỉ mua được 3,75 → 4,15. Trong khi đó mạch so sánh của cửa sổ phình xấp xỉ theo BÌNH PHƯƠNG kích thước. Chính cái lợi-suất-giảm-dần này là lý do ngành công nghiệp thôi nới rộng lõi đơn từ khoảng năm 2005 và chuyển sang ĐA LÕI (Ch.21).</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: đừng đọc mấy cột này thành "bộ xử lý superscalar nhanh gấp 4". Đó là tốc độ của một cỗ máy LÝ TƯỞNG HOÁ không có phụ thuộc thủ tục. Đề hỏi máy superscalar THẬT đạt bao nhiêu thì trích Table 18.1 khoảng 2× và giải thích khác biệt trong một câu: rẽ nhánh và bộ nhớ.</p>
<p class="meo">💡 Một câu giữ lại từ slide này: <strong>"Thêm đơn vị mà không đổi tên là đốt tiền; đổi tên mà không thêm đơn vị thì lãi mỏng; hai thứ ĐI CÙNG NHAU mới là chỗ con số 4× sinh sống."</strong></p>`],

      [15, 'Branch Prediction',
        `<p class="y-chinh">🎯 The slide opens with a claim that should now feel inevitable: <strong>"any high-performance pipelined machine must address the issue of dealing with branches"</strong>. It then walks three historical answers — the Intel 80486's, the RISC answer, and the superscalar answer — and the third one is a <em>return</em> to the first.</p>
<table>
<tr><th>Machine class</th><th>What the slide says it does</th><th>Why</th></tr>
<tr><td><strong>Intel 80486</strong></td><td>Fetches <em>both</em> the next sequential instruction after a branch <em>and</em> speculatively fetches the branch target instruction</td><td>Hedge the bet: whichever way the branch goes, the first instruction is already in hand</td></tr>
<tr><td><strong>RISC machines</strong></td><td><strong>Delayed branch</strong> was explored: the processor <em>always</em> executes the single instruction immediately following the branch. This "keeps the pipeline full while the processor fetches a new instruction stream"</td><td>Turn the unavoidable bubble into a slot the compiler can fill with real work</td></tr>
<tr><td><strong>Superscalar machines</strong></td><td>"Delayed branch strategy has <em>less appeal</em>"; they "have <strong>returned to pre-RISC techniques of branch prediction</strong>"</td><td>One delay slot is far too small a patch for a machine that loses several instructions per cycle</td></tr>
</table>
<ul>
<li><strong>Why the delayed branch died — do the arithmetic.</strong> A delay slot hides <em>exactly one</em> instruction-time of branch latency. On a scalar 5-stage pipeline that was most of the penalty, so it worked. On a 4-wide machine with a 14-stage pipeline, a mispredict can cost 14 × 4 ≈ 56 instruction slots. Filling one of them is a rounding error. The technique did not become wrong; the machines outgrew it.</li>
<li><strong>The delayed branch also became a permanent liability.</strong> It is baked into the <em>instruction set</em>, so it is visible to every program ever compiled. Once you have shipped an ISA with delay slots (SPARC, MIPS), every future implementation must keep honouring them even when the pipeline no longer has that shape. Branch prediction, by contrast, is pure microarchitecture — invisible to software, improvable every generation. This is one of the clearest lessons of Ch.13 and Ch.17: <strong>never put a microarchitectural workaround into the architecture.</strong></li>
<li><strong>"Returned to pre-RISC techniques" is a historically loaded phrase.</strong> Dynamic branch prediction predates RISC; RISC briefly argued it could be replaced by a compile-time trick. Superscalar settled the argument in favour of hardware, because only hardware sees the actual run-time behaviour of each branch — and behaviour is what a predictor learns.</li>
<li><strong>Connect it to the numbers in this lesson.</strong> On slide 12 the branch I7 delayed a completely independent instruction I8 by several cycles. On slide 14 the entire chart was titled "without procedural dependencies" precisely because branches would otherwise dominate the result. Branch prediction is what converts Figure 18.7's idealised 4.15× into Table 18.1's real 2×-ish — the better the predictor, the closer the two get.</li>
<li><strong>The cost of a wrong guess is not just lost time.</strong> Every speculatively executed instruction may have written a physical register and occupied a reorder-buffer slot. On a mispredict, all of them must be discarded cleanly — which is only possible because of the in-order Commit stage of Figure 18.6 (slide 12). Speculation and the reorder buffer are two halves of one mechanism; you cannot have one without the other.</li>
</ul>
<p class="meo">💡 Three-word summary of the slide's history lesson: <strong>hedge (80486) → delay (RISC) → predict (superscalar)</strong>. And the reason for the last arrow in one line: a delay slot patches a <em>fixed, small</em> hole, while a wide deep pipeline has a <em>large, growing</em> one.</p>
<p class="pitfall">⚠️ Do not confuse the 80486's approach with prediction. Fetching <em>both</em> paths is <strong>hedging</strong> — it costs double fetch bandwidth and works only for the first instruction. Prediction picks <em>one</em> path and runs down it at full speed. A question describing "fetches both the sequential and the target instruction" is describing the 486, not a predictor.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu bằng một khẳng định mà tới giờ nghe đã thấy tất yếu: <strong>"bất kỳ cỗ máy đường ống hiệu năng cao nào cũng PHẢI giải quyết vấn đề rẽ nhánh"</strong>. Rồi nó đi qua ba câu trả lời lịch sử — của Intel 80486, của RISC, và của superscalar — mà câu thứ ba lại là một cuộc <em>QUAY VỀ</em> câu thứ nhất.</p>
<table>
<tr><th>Lớp máy</th><th>Slide nói nó làm gì</th><th>Vì sao</th></tr>
<tr><td><strong>Intel 80486</strong></td><td>Nạp <em>CẢ HAI</em>: lệnh tuần tự kế tiếp sau nhánh <em>VÀ</em> nạp suy đoán lệnh ở đích nhánh</td><td>Đặt cửa hai bên: nhánh đi lối nào thì lệnh đầu tiên cũng đã nằm sẵn trong tay</td></tr>
<tr><td><strong>Máy RISC</strong></td><td><strong>Nhánh có trễ (delayed branch)</strong> từng được thử nghiệm: bộ xử lý <em>LUÔN LUÔN</em> thực thi một lệnh nằm ngay sau lệnh nhánh. Việc này "giữ cho đường ống đầy trong khi bộ xử lý nạp dòng lệnh mới"</td><td>Biến cái bong bóng không tránh được thành một KHE mà trình biên dịch có thể lấp bằng việc thật</td></tr>
<tr><td><strong>Máy superscalar</strong></td><td>"Chiến lược nhánh có trễ <em>KÉM HẤP DẪN HƠN</em>"; chúng "đã <strong>QUAY VỀ các kỹ thuật DỰ ĐOÁN RẼ NHÁNH thời TIỀN-RISC</strong>"</td><td>Một khe trễ là miếng vá quá bé cho một cỗ máy mất vài lệnh mỗi chu kỳ</td></tr>
</table>
<ul>
<li><strong>Vì sao nhánh có trễ CHẾT — làm phép tính đi.</strong> Một khe trễ che được <em>ĐÚNG MỘT</em> khoảng thời gian lệnh của độ trễ nhánh. Trên đường ống scalar 5 tầng thì đó là phần lớn hình phạt, nên nó hiệu quả. Trên máy rộng 4 với đường ống 14 tầng, một lần đoán sai có thể tốn 14 × 4 ≈ 56 khe lệnh. Lấp đầy MỘT khe trong số đó là sai số làm tròn. Kỹ thuật ấy không trở nên SAI; chỉ là máy móc đã LỚN VƯỢT khỏi nó.</li>
<li><strong>Nhánh có trễ còn trở thành một món NỢ VĨNH VIỄN.</strong> Nó được nướng thẳng vào <em>TẬP LỆNH</em>, nên nó nhìn thấy được bởi mọi chương trình từng được biên dịch. Một khi bạn đã xuất xưởng một ISA có khe trễ (SPARC, MIPS) thì mọi bản hiện thực tương lai đều phải tiếp tục tôn trọng nó, kể cả khi đường ống không còn hình dạng ấy nữa. Dự đoán rẽ nhánh thì ngược lại — nó thuần tuý là VI KIẾN TRÚC: phần mềm không nhìn thấy, và mỗi thế hệ cải tiến được. Đây là một trong những bài học rõ nhất của Ch.13 và Ch.17: <strong>đừng bao giờ nhét một mẹo chữa cháy của vi kiến trúc vào KIẾN TRÚC.</strong></li>
<li><strong>Cụm "quay về kỹ thuật thời tiền-RISC" mang nặng ý nghĩa lịch sử.</strong> Dự đoán rẽ nhánh động có TRƯỚC RISC; RISC có một thời lập luận rằng nó thay thế được bằng một mẹo lúc biên dịch. Superscalar đã khép lại cuộc tranh luận ấy theo hướng PHẦN CỨNG, vì chỉ phần cứng mới nhìn thấy HÀNH VI THẬT lúc chạy của từng lệnh nhánh — và hành vi mới là thứ mà một bộ dự đoán học được.</li>
<li><strong>Nối với chính các con số trong bài này.</strong> Ở slide 12, lệnh nhánh I7 làm trễ một lệnh HOÀN TOÀN ĐỘC LẬP là I8 mất mấy chu kỳ. Ở slide 14, cả biểu đồ mang tên "không có phụ thuộc thủ tục" chính vì nếu không thì rẽ nhánh sẽ át hết kết quả. Dự đoán rẽ nhánh là thứ chuyển con số 4,15× lý tưởng của Figure 18.7 thành con số khoảng 2× thực tế của Table 18.1 — bộ dự đoán càng tốt thì hai con số càng lại gần nhau.</li>
<li><strong>Cái giá của một lần đoán sai không chỉ là thời gian mất.</strong> Mỗi lệnh đã chạy suy đoán đều có thể đã ghi vào một thanh ghi vật lý và chiếm một khe reorder buffer. Khi đoán sai, tất cả chúng phải bị vứt bỏ SẠCH SẼ — mà việc đó chỉ khả thi nhờ tầng Commit đúng-thứ-tự của Figure 18.6 (slide 12). Chạy suy đoán và reorder buffer là hai nửa của MỘT cơ chế; không thể có cái này mà thiếu cái kia.</li>
</ul>
<p class="meo">💡 Tóm bài học lịch sử của slide bằng ba chữ: <strong>ĐẶT CỬA HAI BÊN (80486) → TRÌ HOÃN (RISC) → DỰ ĐOÁN (superscalar)</strong>. Và lý do của mũi tên cuối cùng gói trong một dòng: khe trễ vá một cái lỗ <em>CỐ ĐỊNH và NHỎ</em>, trong khi đường ống vừa rộng vừa sâu có một cái lỗ <em>TO và NGÀY CÀNG TO</em>.</p>
<p class="pitfall">⚠️ Đừng nhầm cách làm của 80486 với dự đoán. Nạp <em>CẢ HAI</em> đường là <strong>ĐẶT CỬA HAI BÊN</strong> — nó tốn gấp đôi băng thông nạp lệnh và chỉ ăn thua cho lệnh ĐẦU TIÊN. Dự đoán thì CHỌN <em>MỘT</em> đường và lao hết tốc lực xuống đường đó. Câu hỏi mô tả "nạp cả lệnh tuần tự lẫn lệnh ở đích" là đang mô tả con 486, không phải một bộ dự đoán.</p>`],

      [16, 'Figure 18.8 — Conceptual Depiction of Superscalar Processing',
        `<p class="y-chinh">🎯 The chapter's summary picture, drawn left to right as a <strong>flow that fans out and then fans back in</strong>: a rigid sequential program enters on the left, becomes a cloud of parallel activity in the middle, and is squeezed back into a rigid sequential order on the right.</p>
<table>
<tr><th>Stage on the figure</th><th>What is drawn</th><th>Order</th></tr>
<tr><td><strong>static program</strong></td><td>A box of stacked horizontal lines — the instructions as written</td><td>Strictly sequential</td></tr>
<tr><td><strong>instruction fetch and branch prediction</strong></td><td>A row of vertical ticks — the fetched stream</td><td>Sequential along the <em>predicted</em> path</td></tr>
<tr><td><strong>instruction dispatch</strong></td><td>Arrows fanning out, crossing each other</td><td>Order starts to break</td></tr>
<tr><td><strong>window of execution</strong></td><td>A grey dashed box holding several ticks, arrows crossing inside it</td><td><strong>No order at all</strong></td></tr>
<tr><td><strong>instruction issue</strong></td><td>Ticks leaving the window in scrambled order</td><td>Whoever is ready</td></tr>
<tr><td><strong>instruction execution</strong></td><td>Arrows converging</td><td>Parallel</td></tr>
<tr><td><strong>instruction reorder and commit</strong></td><td>A neat row of evenly spaced vertical ticks</td><td><strong>Back to strictly sequential</strong></td></tr>
</table>
<ul>
<li><strong>The shape is the message: sequential in, parallel in the middle, sequential out.</strong> The programmer wrote a sequence and expects sequential semantics. The hardware needs parallelism to go fast. The two are reconciled by breaking order only <em>inside</em> the window, where nobody can observe it, and restoring it at commit, where everybody can.</li>
<li><strong>The window of execution is the only genuinely disordered region, and it is drawn dashed for that reason.</strong> Everything to its left is in program order; everything to its right is being put back into program order. The grey box is where the speed comes from, and it is also the only place where a bug would be invisible until it corrupted state.</li>
<li><strong>"Branch prediction" is named in the very first stage, not later.</strong> That placement matters: the machine must decide which instructions even <em>exist</em> before it can do anything else. If the prediction is wrong, the entire picture downstream is full of work that must be thrown away. The wider the fan-out, the more is thrown away — the quantitative point of slide 15.</li>
<li><strong>Compare with Figure 18.6 (slide 12) — they are the same machine at two zoom levels.</strong> Figure 18.6 names the stages as hardware boxes (Fetch, Decode, Rename, Dispatch | buffer | Issue, Register read, Execute, Write back | Commit). Figure 18.8 draws the same thing as <em>instruction flow</em>. If an exam asks you to "describe superscalar execution", answering with the fan-out/fan-in shape and naming the six labels is a complete answer.</li>
<li><strong>The evenly spaced ticks on the right are a promise to the programmer.</strong> They say: whatever happened in the grey box, the observable result is exactly what a simple sequential machine would have produced. That promise is what lets an operating system take an interrupt, or a debugger stop at a line, on a processor that internally executed the program in a different order.</li>
</ul>
<p class="meo">💡 Learn this figure as a sentence you can write in an exam: <strong>"Fetch and predict in order → dispatch into a window → issue out of order as operands and units become available → execute in parallel → reorder and commit in order."</strong> Six clauses, one for each label on the figure.</p>`,
        `<p class="y-chinh">🎯 Bức tranh tổng kết của chương, vẽ từ trái sang phải như một <strong>dòng chảy XOÈ RA rồi KHÉP LẠI</strong>: một chương trình tuần tự cứng nhắc đi vào bên trái, biến thành một đám mây hoạt động song song ở giữa, rồi bị ép trở lại thành một thứ tự tuần tự cứng nhắc ở bên phải.</p>
<table>
<tr><th>Giai đoạn trên hình</th><th>Vẽ cái gì</th><th>Thứ tự</th></tr>
<tr><td><strong>static program</strong></td><td>Một hộp gồm các vạch ngang xếp chồng — các lệnh như đã viết</td><td>Tuần tự nghiêm ngặt</td></tr>
<tr><td><strong>instruction fetch and branch prediction</strong></td><td>Một hàng vạch dọc — dòng lệnh đã nạp</td><td>Tuần tự dọc theo đường đã <em>DỰ ĐOÁN</em></td></tr>
<tr><td><strong>instruction dispatch</strong></td><td>Các mũi tên XOÈ RA, cắt chéo nhau</td><td>Thứ tự bắt đầu vỡ</td></tr>
<tr><td><strong>window of execution</strong></td><td>Một hộp xám nét đứt chứa vài vạch, mũi tên cắt chéo bên trong</td><td><strong>KHÔNG có thứ tự nào cả</strong></td></tr>
<tr><td><strong>instruction issue</strong></td><td>Các vạch rời cửa sổ theo thứ tự xáo trộn</td><td>Ai sẵn sàng thì đi</td></tr>
<tr><td><strong>instruction execution</strong></td><td>Các mũi tên hội tụ</td><td>Song song</td></tr>
<tr><td><strong>instruction reorder and commit</strong></td><td>Một hàng vạch dọc ngay ngắn, cách đều</td><td><strong>Trở lại tuần tự nghiêm ngặt</strong></td></tr>
</table>
<ul>
<li><strong>Chính HÌNH DẠNG là thông điệp: tuần tự vào, song song ở giữa, tuần tự ra.</strong> Người lập trình viết một dãy và kỳ vọng ngữ nghĩa tuần tự. Phần cứng cần song song để chạy nhanh. Hai bên được hoà giải bằng cách chỉ phá vỡ thứ tự <em>BÊN TRONG</em> cửa sổ, nơi không ai quan sát được, rồi khôi phục nó ở bước commit, nơi ai cũng quan sát được.</li>
<li><strong>Cửa sổ thực thi là vùng DUY NHẤT thật sự mất trật tự, và nó được vẽ NÉT ĐỨT vì lẽ đó.</strong> Mọi thứ bên trái nó đều theo thứ tự chương trình; mọi thứ bên phải nó đang được đặt lại vào thứ tự chương trình. Cái hộp xám là nơi tốc độ sinh ra, và cũng là nơi DUY NHẤT mà một lỗi sẽ vô hình cho tới khi nó làm hỏng trạng thái.</li>
<li><strong>"Branch prediction" được gọi tên ngay ở giai đoạn ĐẦU TIÊN, không phải muộn hơn.</strong> Vị trí ấy có ý nghĩa: máy phải quyết định những lệnh nào <em>TỒN TẠI</em> trước khi làm được bất cứ việc gì khác. Nếu dự đoán sai thì toàn bộ bức tranh phía sau đầy những việc phải vứt đi. Dòng chảy xoè càng rộng thì vứt càng nhiều — đúng luận điểm định lượng của slide 15.</li>
<li><strong>So với Figure 18.6 (slide 12) — chúng là CÙNG MỘT cỗ máy ở hai mức phóng to.</strong> Figure 18.6 gọi tên các tầng như những hộp phần cứng (Fetch, Decode, Rename, Dispatch | bộ đệm | Issue, Register read, Execute, Write back | Commit). Figure 18.8 vẽ đúng thứ đó dưới dạng <em>DÒNG CHẢY LỆNH</em>. Đề hỏi "mô tả cách thực thi superscalar" thì trả lời bằng hình dạng xoè-ra/khép-lại và gọi tên sáu nhãn là một câu trả lời trọn vẹn.</li>
<li><strong>Hàng vạch cách đều bên phải là một LỜI HỨA với người lập trình.</strong> Nó nói: dù trong cái hộp xám đã xảy ra chuyện gì, kết quả quan sát được vẫn ĐÚNG BẰNG thứ mà một cỗ máy tuần tự đơn giản sẽ tạo ra. Chính lời hứa ấy cho phép hệ điều hành nhận một ngắt, hay trình gỡ lỗi dừng ở một dòng, trên một bộ xử lý mà bên trong đã chạy chương trình theo thứ tự khác.</li>
</ul>
<p class="meo">💡 Học hình này thành một câu có thể viết thẳng vào bài thi: <strong>"Nạp và dự đoán ĐÚNG THỨ TỰ → đưa vào CỬA SỔ → phát KHÔNG THEO THỨ TỰ khi toán hạng và đơn vị sẵn sàng → thực thi SONG SONG → sắp lại và commit ĐÚNG THỨ TỰ."</strong> Sáu mệnh đề, mỗi mệnh đề một nhãn trên hình.</p>`],

      [17, 'Superscalar Implementation — five key elements',
        `<p class="y-chinh">🎯 The engineering checklist. Five bullets under the heading <strong>"Key elements"</strong>, and each one is the answer to one of the problems the chapter raised. If you can map each bullet back to its problem, you have understood the chapter.</p>
<table>
<tr><th>#</th><th>The slide's key element</th><th>Which problem it answers</th></tr>
<tr><td>1</td><td><strong>Instruction fetch strategies that simultaneously fetch multiple instruction</strong></td><td>You cannot issue 4 per cycle if you can only fetch 1. Needs a wide I-cache port and branch prediction, because a branch may sit in the middle of the fetched group</td></tr>
<tr><td>2</td><td><strong>Logic for determining true dependencies involving register values, and mechanisms for communicating these values to where they are needed during execution</strong></td><td>RAW (slide 7). "Determining" = the dependency check; "communicating" = <strong>forwarding</strong> (the FWD path of Figure 18.2)</td></tr>
<tr><td>3</td><td><strong>Mechanisms for initiating, or issuing, multiple instructions in parallel</strong></td><td>The issue policy of slides 10–11 and the window of Figure 18.6</td></tr>
<tr><td>4</td><td><strong>Resources for parallel execution of multiple instructions, including multiple pipelined functional units and memory hierarchies capable of simultaneously servicing multiple memory references</strong></td><td>Resource conflicts (slide 7). Note the second half: the <em>memory system</em> must be parallel too</td></tr>
<tr><td>5</td><td><strong>Mechanisms for committing the process state in correct order</strong></td><td>The reorder buffer / Commit stage. This is what makes speculation and out-of-order safe</td></tr>
</table>
<ul>
<li><strong>Note the phrase "true dependencies" in bullet 2 — that word is deliberate.</strong> The list asks for logic to find the <em>true</em> (RAW) dependencies, because those are the only ones that must be respected. The false ones (WAW, WAR) get removed by renaming rather than detected and obeyed. One word on the slide encodes the whole distinction of slide 7.</li>
<li><strong>Bullet 4 is the one students skip, and it is half the battle.</strong> "Memory hierarchies capable of simultaneously servicing multiple memory references" means the L1 data cache must handle two or more accesses per cycle — through multiple ports, or banking, or both. Look back at Figure 18.1 (slide 3): the Memory block was <em>not</em> duplicated. This bullet is the chapter admitting that it has to be, in practice. It connects straight to Ch.5.</li>
<li><strong>Bullets 1 and 5 are the bookends, and they are both about ORDER.</strong> Bullet 1 gets instructions in, in order and in bulk. Bullet 5 puts results out, in order. Everything interesting happens between them, out of order. That is Figure 18.8 (slide 16) restated as a requirements list.</li>
<li><strong>Read the list as a design order, because that is how a chip is actually built.</strong> Widen the fetch (1), then you need dependency logic (2), then issue hardware (3), then you discover you need more units and more memory ports (4), and finally you discover you cannot ship any of it without in-order commit (5). Skip bullet 5 and the processor is fast and unusable — no interrupts, no exceptions, no debugging.</li>
<li><strong>Every one of these five costs area and power, which is the chapter's quiet conclusion.</strong> Doubling the issue width roughly squares the dependency-check logic of bullet 2 and the window logic of bullet 3. That is why Figure 18.7's curve flattened, and why the answer after about 2005 was to stop widening one core and put several on the die instead (Ch.21).</li>
</ul>
<p class="meo">💡 Memorise the five as a sentence: <strong>fetch many · find the real dependencies and forward the values · issue many · have enough units AND enough memory ports · commit in order.</strong> If an exam asks "what must a superscalar implementation provide?", that sentence unpacked into five bullets is the full-mark answer.</p>`,
        `<p class="y-chinh">🎯 Bảng kiểm của kỹ sư. Năm gạch đầu dòng dưới tiêu đề <strong>"Key elements"</strong>, và mỗi cái là lời giải cho một trong những vấn đề chương này đã nêu. Ánh xạ được từng gạch ngược về đúng vấn đề của nó là bạn đã hiểu chương.</p>
<table>
<tr><th>#</th><th>Yếu tố then chốt trên slide</th><th>Nó giải vấn đề nào</th></tr>
<tr><td>1</td><td><strong>Chiến lược nạp lệnh có thể nạp ĐỒNG THỜI NHIỀU lệnh</strong></td><td>Không thể phát 4 lệnh/chu kỳ nếu chỉ nạp được 1. Cần cổng I-cache rộng và dự đoán rẽ nhánh, vì một lệnh nhánh có thể nằm GIỮA nhóm vừa nạp</td></tr>
<tr><td>2</td><td><strong>Logic xác định các phụ thuộc THẬT liên quan tới giá trị thanh ghi, và cơ chế TRUYỀN các giá trị đó tới nơi cần chúng lúc thực thi</strong></td><td>RAW (slide 7). "Xác định" = phép kiểm phụ thuộc; "truyền" = <strong>FORWARDING</strong> (đường FWD của Figure 18.2)</td></tr>
<tr><td>3</td><td><strong>Cơ chế khởi động, hay PHÁT, nhiều lệnh song song</strong></td><td>Chính sách phát lệnh ở slide 10–11 và cửa sổ của Figure 18.6</td></tr>
<tr><td>4</td><td><strong>Tài nguyên để thực thi song song nhiều lệnh, gồm NHIỀU đơn vị chức năng đường ống VÀ phân cấp bộ nhớ phục vụ được đồng thời nhiều tham chiếu bộ nhớ</strong></td><td>Xung đột tài nguyên (slide 7). Để ý nửa sau: <em>HỆ THỐNG NHỚ</em> cũng phải song song</td></tr>
<tr><td>5</td><td><strong>Cơ chế CHỐT (commit) trạng thái tiến trình ĐÚNG THỨ TỰ</strong></td><td>Reorder buffer / tầng Commit. Đây là thứ làm cho chạy suy đoán và không-theo-thứ-tự trở nên AN TOÀN</td></tr>
</table>
<ul>
<li><strong>Chú ý cụm "true dependencies" ở gạch 2 — chữ đó là CỐ Ý.</strong> Danh sách đòi logic để tìm các phụ thuộc <em>THẬT</em> (RAW), vì đó là những cái DUY NHẤT bắt buộc phải tôn trọng. Những cái GIẢ (WAW, WAR) thì được gỡ bằng đổi tên chứ không phải được phát hiện rồi tuân thủ. Một chữ trên slide mã hoá trọn vẹn sự phân biệt của slide 7.</li>
<li><strong>Gạch 4 là cái sinh viên hay bỏ qua, mà nó chiếm nửa trận đánh.</strong> "Phân cấp bộ nhớ phục vụ được đồng thời nhiều tham chiếu" nghĩa là L1 data cache phải xử lý được hai hoặc nhiều truy cập mỗi chu kỳ — bằng nhiều cổng, bằng chia băng, hoặc cả hai. Nhìn lại Figure 18.1 (slide 3): khối Memory đã KHÔNG được nhân bản. Gạch này là lúc chương thừa nhận rằng trong thực tế thì nó BUỘC phải được nhân bản. Nó nối thẳng sang Ch.5.</li>
<li><strong>Gạch 1 và gạch 5 là hai cái chặn sách ở hai đầu, và cả hai đều nói về THỨ TỰ.</strong> Gạch 1 đưa lệnh VÀO, đúng thứ tự và theo lô. Gạch 5 đưa kết quả RA, đúng thứ tự. Mọi thứ thú vị xảy ra ở GIỮA, không theo thứ tự. Đó chính là Figure 18.8 (slide 16) phát biểu lại dưới dạng danh sách yêu cầu.</li>
<li><strong>Đọc danh sách như một THỨ TỰ THIẾT KẾ, vì con chip thật được dựng đúng như vậy.</strong> Nới rộng khâu nạp (1), thế là cần logic phụ thuộc (2), rồi cần phần cứng phát lệnh (3), rồi phát hiện ra mình cần thêm đơn vị và thêm cổng bộ nhớ (4), và cuối cùng phát hiện ra không thể xuất xưởng bất cứ thứ gì nếu thiếu commit đúng thứ tự (5). Bỏ gạch 5 thì bộ xử lý vừa nhanh vừa VÔ DỤNG — không ngắt, không ngoại lệ, không gỡ lỗi được.</li>
<li><strong>Mỗi cái trong năm cái này đều tốn DIỆN TÍCH và ĐIỆN, đó là kết luận lặng lẽ của chương.</strong> Nhân đôi bề rộng phát lệnh thì logic kiểm phụ thuộc ở gạch 2 và logic cửa sổ ở gạch 3 phình xấp xỉ theo BÌNH PHƯƠNG. Đó là lý do đường cong của Figure 18.7 đi ngang, và là lý do sau khoảng năm 2005 câu trả lời là THÔI nới rộng một lõi mà đặt NHIỀU lõi lên cùng miếng đế (Ch.21).</li>
</ul>
<p class="meo">💡 Thuộc năm cái thành một câu: <strong>nạp nhiều · tìm phụ thuộc THẬT rồi chuyển tiếp giá trị · phát nhiều · đủ đơn vị VÀ đủ cổng bộ nhớ · chốt ĐÚNG THỨ TỰ.</strong> Đề hỏi "một hiện thực superscalar phải cung cấp những gì?" thì câu đó bung ra năm gạch là câu trả lời điểm tối đa.</p>`],

      [18, 'Figure 18.9 — Intel Core Microarchitecture',
        `<p class="y-chinh">🎯 A real, shipped processor drawn as one block diagram — and every box on it is something this chapter has already named. This is where the theory stops being theory. Note the topic has changed: from here to the end of the deck, the chapter is doing <em>case studies</em>.</p>
<table>
<tr><th>Region</th><th>Boxes on the figure (top to bottom)</th><th>The chapter's name for it</th></tr>
<tr><td><strong>Front end</strong></td><td>L1 Instruction Cache → Instruction Fetch and PreDecode → Instruction Queue → Decode (with <strong>Microcode ROM</strong> beside it) → <strong>Rename/Alloc</strong></td><td>The in-order front end of Figure 18.6: Fetch · Decode · Rename · Dispatch</td></tr>
<tr><td><strong>Prediction</strong></td><td><strong>Branch Prediction Unit</strong>, fed back from the Retirement Unit, feeding the Fetch/PreDecode stage</td><td>Slide 15's branch prediction — note it <em>learns</em> from retirement, i.e. from what actually happened</td></tr>
<tr><td><strong>Reorder</strong></td><td><strong>Retirement Unit (Re-Order Buffer)</strong></td><td>The Commit stage. The slide labels it with both names in one box</td></tr>
<tr><td><strong>Issue</strong></td><td><strong>Scheduler / Reservation Station</strong>, feeding <strong>Port 0 · Port 1 · Port 2 · Port 3 · Port 4</strong></td><td>The window + reservation stations of Figure 18.2</td></tr>
<tr><td><strong>Execute</strong></td><td>Port 0: Integer ALU, Branch, MMX/SSE, FPmove · Port 1: Integer ALU, FPAdd, MMX/SSE, FPmove · Port 2: Integer ALU, FPMul, MMX/SSE, FPmove · Port 3: <strong>Load Unit</strong> · Port 4: <strong>Store Unit</strong>, with a <strong>Memory Ordering Buffer</strong> under 3 and 4</td><td>The multiple pipelined functional units of Figure 18.1(b)</td></tr>
<tr><td><strong>Memory</strong></td><td>L1 Data Cache and DTLB → <strong>Shared L2 Cache (up to 10.7 Gbps FSB)</strong> → <strong>Shared Bus Interface Unit</strong></td><td>Ch.5's cache hierarchy, now with the bandwidth this chapter demands</td></tr>
</table>
<ul>
<li><strong>Count the ports and you have read the machine's width.</strong> Five issue ports, but only three can do integer ALU work and only one can load and one can store. So "how many instructions per cycle?" has no single answer — it depends entirely on the <em>mix</em>. Three ADDs go together; three loads do not. That is slide 7's resource conflict, in silicon, with a part number.</li>
<li><strong>The ports are specialised, not identical, and that asymmetry is deliberate.</strong> FPAdd hangs only off Port 1, FPMul only off Port 2, Branch only off Port 0. Duplicating a floating-point multiplier on every port would cost enormous area for a case that rarely occurs. The designers measured the instruction mix and bought exactly the units the mix needs.</li>
<li><strong>"Rename/Alloc" is one box for a reason.</strong> Renaming (slide 13) and resource allocation happen together: the same stage that hands out a fresh physical register also reserves a reorder-buffer entry and a scheduler slot. Slide 24 of this deck spells out what it allocates; slide 26 gives the number — 16 architectural registers remapped onto <strong>128 physical</strong> ones.</li>
<li><strong>Follow the arrow from the Retirement Unit back up to the Branch Prediction Unit.</strong> That feedback loop is the predictor <em>learning</em>: only at retirement does the machine know for certain which way a branch really went. Prediction is not a static guess baked in at compile time — it is a running statistical model of this program's behaviour, which is precisely why slide 15 says superscalar machines abandoned the compile-time delayed branch.</li>
<li><strong>The Memory Ordering Buffer under Ports 3 and 4 is the memory version of the reorder buffer.</strong> Loads and stores may execute out of order for speed, but the memory system must still <em>appear</em> to see them in program order. Get this wrong and you do not get a slow program, you get a wrong one — and on a multicore chip (Ch.21) you get a bug that only appears on someone else's machine.</li>
</ul>
<p class="meo">💡 Use this figure as the answer key for the whole chapter: point at a box and say which slide introduced it. Rename/Alloc → slide 13. Reservation Station → slide 4. Re-Order Buffer → slides 4 and 12. Branch Prediction Unit → slide 15. Five ports → slide 3. If you can do all five, the chapter is done.</p>`,
        `<p class="y-chinh">🎯 Một bộ xử lý THẬT, đã xuất xưởng, vẽ thành một sơ đồ khối — và mọi cái hộp trên đó đều là thứ chương này đã gọi tên rồi. Đây là chỗ lý thuyết thôi làm lý thuyết. Để ý chủ đề đã đổi: từ đây tới cuối deck, chương chuyển sang <em>NGHIÊN CỨU TÌNH HUỐNG</em>.</p>
<table>
<tr><th>Vùng</th><th>Các hộp trên hình (trên xuống dưới)</th><th>Tên mà chương này gọi</th></tr>
<tr><td><strong>Đầu trước</strong></td><td>L1 Instruction Cache → Instruction Fetch and PreDecode → Instruction Queue → Decode (có <strong>Microcode ROM</strong> bên cạnh) → <strong>Rename/Alloc</strong></td><td>Đầu-trước đúng-thứ-tự của Figure 18.6: Fetch · Decode · Rename · Dispatch</td></tr>
<tr><td><strong>Dự đoán</strong></td><td><strong>Branch Prediction Unit</strong>, nhận phản hồi từ Retirement Unit, cấp cho tầng Fetch/PreDecode</td><td>Dự đoán rẽ nhánh của slide 15 — để ý nó <em>HỌC</em> từ khâu retirement, tức là từ những gì THẬT SỰ đã xảy ra</td></tr>
<tr><td><strong>Sắp lại</strong></td><td><strong>Retirement Unit (Re-Order Buffer)</strong></td><td>Tầng Commit. Slide ghi cả hai cái tên trong MỘT hộp</td></tr>
<tr><td><strong>Phát lệnh</strong></td><td><strong>Scheduler / Reservation Station</strong>, cấp cho <strong>Port 0 · Port 1 · Port 2 · Port 3 · Port 4</strong></td><td>Cửa sổ + trạm đặt chỗ của Figure 18.2</td></tr>
<tr><td><strong>Thực thi</strong></td><td>Port 0: Integer ALU, Branch, MMX/SSE, FPmove · Port 1: Integer ALU, FPAdd, MMX/SSE, FPmove · Port 2: Integer ALU, FPMul, MMX/SSE, FPmove · Port 3: <strong>Load Unit</strong> · Port 4: <strong>Store Unit</strong>, bên dưới 3 và 4 là <strong>Memory Ordering Buffer</strong></td><td>Nhiều đơn vị chức năng đường ống của Figure 18.1(b)</td></tr>
<tr><td><strong>Bộ nhớ</strong></td><td>L1 Data Cache and DTLB → <strong>Shared L2 Cache (tới 10,7 Gbps FSB)</strong> → <strong>Shared Bus Interface Unit</strong></td><td>Phân cấp cache của Ch.5, giờ với băng thông mà chương này đòi hỏi</td></tr>
</table>
<ul>
<li><strong>Đếm số cổng (port) là đọc ra bề rộng thật của cỗ máy.</strong> Năm cổng phát lệnh, nhưng chỉ BA cổng làm được việc ALU số nguyên, và chỉ MỘT nạp được, MỘT lưu được. Nên câu "mỗi chu kỳ được mấy lệnh?" KHÔNG có một câu trả lời duy nhất — nó phụ thuộc hoàn toàn vào <em>THÀNH PHẦN</em> lệnh. Ba lệnh ADD đi cùng nhau được; ba lệnh nạp thì không. Đó là xung đột tài nguyên của slide 7, bằng silic, có mã sản phẩm hẳn hoi.</li>
<li><strong>Các cổng được CHUYÊN MÔN HOÁ chứ không giống nhau, và sự bất đối xứng đó là cố ý.</strong> FPAdd chỉ treo ở Port 1, FPMul chỉ ở Port 2, Branch chỉ ở Port 0. Nhân bản một bộ nhân dấu chấm động lên mọi cổng sẽ tốn diện tích khổng lồ cho một trường hợp hiếm khi xảy ra. Người thiết kế đã ĐO thành phần lệnh và mua đúng những đơn vị mà thành phần đó cần.</li>
<li><strong>"Rename/Alloc" gộp thành MỘT hộp có lý do.</strong> Đổi tên (slide 13) và cấp phát tài nguyên xảy ra CÙNG LÚC: chính cái tầng phát ra thanh ghi vật lý mới cũng đồng thời giữ chỗ một ô trong reorder buffer và một khe trong bộ lập lịch. Slide 24 của deck này kể chi tiết nó cấp phát những gì; slide 26 cho con số — 16 thanh ghi kiến trúc ánh xạ lên <strong>128 thanh ghi vật lý</strong>.</li>
<li><strong>Dò theo mũi tên từ Retirement Unit ngược lên Branch Prediction Unit.</strong> Vòng phản hồi đó chính là bộ dự đoán đang <em>HỌC</em>: chỉ tới lúc retire thì máy mới biết CHẮC CHẮN nhánh đã đi lối nào. Dự đoán không phải một phỏng đoán tĩnh nướng sẵn lúc biên dịch — nó là một mô hình thống kê CHẠY LIÊN TỤC về hành vi của chính chương trình này, đúng là lý do slide 15 nói máy superscalar đã bỏ nhánh-có-trễ kiểu biên dịch.</li>
<li><strong>Memory Ordering Buffer nằm dưới Port 3 và 4 là phiên bản BỘ NHỚ của reorder buffer.</strong> Lệnh nạp và lưu được phép thực thi không theo thứ tự cho nhanh, nhưng hệ thống nhớ vẫn phải <em>TRÔNG NHƯ</em> nhìn thấy chúng theo thứ tự chương trình. Làm sai chỗ này thì bạn không nhận được một chương trình chậm, bạn nhận được một chương trình SAI — và trên chip đa lõi (Ch.21) thì bạn nhận được một lỗi chỉ hiện ra trên máy của người khác.</li>
</ul>
<p class="meo">💡 Dùng hình này làm ĐÁP ÁN cho cả chương: chỉ vào một cái hộp rồi nói nó được giới thiệu ở slide nào. Rename/Alloc → slide 13. Reservation Station → slide 4. Re-Order Buffer → slide 4 và 12. Branch Prediction Unit → slide 15. Năm cổng → slide 3. Làm được cả năm là xong chương.</p>`],

      [19, 'Table 18.2 — Cache/Memory Parameters and Performance of Processors Based on Intel Core Microarchitecture',
        `<p class="y-chinh">🎯 Two tables in one slide: <strong>(a) Cache Parameters</strong> and <strong>(b) Load/Store Performance</strong>. Together they give the real numbers behind the "memory hierarchies capable of simultaneously servicing multiple memory references" that slide 17 demanded.</p>
<table>
<tr><th>(a) Cache Level</th><th>Capacity</th><th>Associativity (ways)</th><th>Line Size (bytes)</th><th>Update Policy</th></tr>
<tr><td>L1 data</td><td>32 kB</td><td>8</td><td>64</td><td>Writeback</td></tr>
<tr><td>L1 instruction</td><td>32 kB</td><td>8</td><td><strong>N/A</strong></td><td><strong>N/A</strong></td></tr>
<tr><td>L2 (shared) <sup>1</sup></td><td>2, 4 MB</td><td>8 or 16</td><td>64</td><td>Writeback</td></tr>
<tr><td>L2 (shared) <sup>2</sup></td><td>3, 6 MB</td><td>12 or 24</td><td>64</td><td>Writeback</td></tr>
<tr><td>L3 (shared) <sup>2</sup></td><td>8, 12, 16 MB</td><td>15</td><td>64</td><td>Writeback</td></tr>
</table>
<p class="nhan">📐 Notes printed on the slide: <sup>1</sup> Intel Core Microarchitecture · <sup>2</sup> Enhanced Intel Core Microarchitecture. Table is on page 648 of the textbook.</p>
<table>
<tr><th>(b) Data Locality</th><th>Load Latency</th><th>Load Throughput</th><th>Store Latency</th><th>Store Throughput</th></tr>
<tr><td>L1 data cache</td><td>3 clock cycles</td><td>1 clock cycle</td><td>2 clock cycles</td><td>3 clock cycles</td></tr>
<tr><td>L1 data cache of the other core in modified state</td><td>14 clock cycles + 5.5 bus cycles</td><td>14 clock cycles + 5.5 bus cycles</td><td>14 clock cycles + 5.5 bus cycles</td><td><strong>N/A</strong></td></tr>
<tr><td>L2 cache</td><td>14</td><td>3</td><td>14</td><td>3</td></tr>
<tr><td>Memory</td><td>14 clock cycles + 5.5 bus cycles + memory latency</td><td>Depends on bus read protocol</td><td>14 clock cycles + 5.5 bus cycles + memory latency</td><td>Depends on bus read protocol</td></tr>
</table>
<ul>
<li><strong>The single most important pair of numbers on this slide is L1 load latency 3 versus throughput 1.</strong> Latency 3 means a load's result is not usable for 3 cycles. Throughput 1 means a <em>new</em> load can start every cycle. So the cache is pipelined, and the right way to spend those 3 cycles is to have <em>other independent work</em> ready — which is exactly what out-of-order issue provides. <strong>Latency is what the dependency chain sees; throughput is what the machine can sustain.</strong> Confusing the two is the commonest error in this chapter's numerical questions.</li>
<li><strong>The L1 → L2 step is 3 → 14 cycles, and that ratio is why this chapter exists.</strong> On a 4-wide machine, an L2 hit costs 14 × 4 ≈ 56 instruction slots of potential work. Filling them is the whole job of the window. Everything on slides 10–13 is, in the end, a machine for hiding these 14 cycles.</li>
<li><strong>Row 2 is the multicore row, and it is startling.</strong> Reading data that is sitting <em>modified</em> in the other core's L1 costs 14 cycles + 5.5 bus cycles — about as expensive as going to L2, and far more than a local L1 hit at 3. That is the price of cache coherence, the subject of Ch.21. Two threads ping-ponging one shared variable pay this on every access.</li>
<li><strong>The "N/A" entries each say something.</strong> The L1 <em>instruction</em> cache has no line size and no update policy listed because it is <strong>read-only</strong> in normal operation — nothing ever writes back to it. And "store to the other core's L1" is N/A because you do not store into another core's cache; the coherence protocol invalidates it instead.</li>
<li><strong>Connect to Ch.5.</strong> Every column heading here — capacity, associativity, line size, write policy — is a parameter you learned to reason about in the cache chapter. This table is that chapter's vocabulary applied to one shipped product, and it shows the values a real design converged on: 64-byte lines everywhere, 8-way L1, write-back at every level.</li>
</ul>
<p class="pitfall">⚠️ Read the L1 data cache row of table (b) carefully: <strong>store latency is 2 cycles but store throughput is 3 cycles</strong> — the throughput number is <em>larger</em> than the latency number, which reads backwards compared with the load row (3 and 1). That is what is printed on the slide and in the textbook; quote it as printed rather than silently "fixing" it, and if an exam question depends on it, state the figures you are using.</p>
<p class="meo">💡 Keep three numbers from this slide and you can answer most quantitative questions: <strong>L1 = 3 cycles · L2 = 14 cycles · other core's L1 = 14 + 5.5 bus cycles.</strong> Roughly: local is 3, anything else is 14 or worse.</p>`,
        `<p class="y-chinh">🎯 Hai bảng trong một slide: <strong>(a) Cache Parameters</strong> (tham số cache) và <strong>(b) Load/Store Performance</strong> (hiệu năng nạp/lưu). Gộp lại chúng cho những con số THẬT đứng sau cái "phân cấp bộ nhớ phục vụ được đồng thời nhiều tham chiếu" mà slide 17 đòi hỏi.</p>
<table>
<tr><th>(a) Mức cache</th><th>Dung lượng</th><th>Độ liên kết (ways)</th><th>Cỡ dòng (byte)</th><th>Chính sách cập nhật</th></tr>
<tr><td>L1 data</td><td>32 kB</td><td>8</td><td>64</td><td>Writeback</td></tr>
<tr><td>L1 instruction</td><td>32 kB</td><td>8</td><td><strong>N/A</strong></td><td><strong>N/A</strong></td></tr>
<tr><td>L2 (dùng chung) <sup>1</sup></td><td>2, 4 MB</td><td>8 hoặc 16</td><td>64</td><td>Writeback</td></tr>
<tr><td>L2 (dùng chung) <sup>2</sup></td><td>3, 6 MB</td><td>12 hoặc 24</td><td>64</td><td>Writeback</td></tr>
<tr><td>L3 (dùng chung) <sup>2</sup></td><td>8, 12, 16 MB</td><td>15</td><td>64</td><td>Writeback</td></tr>
</table>
<p class="nhan">📐 Ghi chú in trên slide: <sup>1</sup> Intel Core Microarchitecture · <sup>2</sup> Enhanced Intel Core Microarchitecture. Bảng nằm ở trang 648 của giáo trình.</p>
<table>
<tr><th>(b) Vị trí dữ liệu</th><th>Độ trễ NẠP</th><th>Thông lượng NẠP</th><th>Độ trễ LƯU</th><th>Thông lượng LƯU</th></tr>
<tr><td>L1 data cache</td><td>3 chu kỳ</td><td>1 chu kỳ</td><td>2 chu kỳ</td><td>3 chu kỳ</td></tr>
<tr><td>L1 data cache của lõi KIA, ở trạng thái modified</td><td>14 chu kỳ + 5,5 chu kỳ bus</td><td>14 chu kỳ + 5,5 chu kỳ bus</td><td>14 chu kỳ + 5,5 chu kỳ bus</td><td><strong>N/A</strong></td></tr>
<tr><td>L2 cache</td><td>14</td><td>3</td><td>14</td><td>3</td></tr>
<tr><td>Memory (bộ nhớ chính)</td><td>14 chu kỳ + 5,5 chu kỳ bus + độ trễ bộ nhớ</td><td>Tuỳ giao thức đọc của bus</td><td>14 chu kỳ + 5,5 chu kỳ bus + độ trễ bộ nhớ</td><td>Tuỳ giao thức đọc của bus</td></tr>
</table>
<ul>
<li><strong>Cặp số quan trọng nhất trên slide này là L1: độ trễ nạp 3 so với thông lượng 1.</strong> Độ trễ 3 nghĩa là kết quả của một lệnh nạp phải 3 chu kỳ sau mới dùng được. Thông lượng 1 nghĩa là một lệnh nạp <em>MỚI</em> có thể khởi động MỖI chu kỳ. Vậy cache là ĐƯỜNG ỐNG, và cách đúng để tiêu 3 chu kỳ đó là có sẵn <em>VIỆC ĐỘC LẬP KHÁC</em> để làm — đúng là thứ mà phát-không-theo-thứ-tự cung cấp. <strong>Độ trễ là thứ mà CHUỖI PHỤ THUỘC nhìn thấy; thông lượng là thứ mà CỖ MÁY duy trì được.</strong> Lẫn hai cái này là lỗi phổ biến nhất trong các câu hỏi tính toán của chương.</li>
<li><strong>Bậc nhảy L1 → L2 là 3 → 14 chu kỳ, và chính tỉ số ấy là lý do chương này tồn tại.</strong> Trên máy rộng 4, một lần trúng L2 tốn 14 × 4 ≈ 56 khe lệnh công việc tiềm năng. Lấp đầy chúng là toàn bộ nhiệm vụ của CỬA SỔ. Mọi thứ ở slide 10–13, xét cho cùng, là một cỗ máy để GIẤU 14 chu kỳ này.</li>
<li><strong>Hàng thứ 2 là hàng ĐA LÕI, và nó gây giật mình.</strong> Đọc dữ liệu đang nằm ở trạng thái <em>modified</em> trong L1 của lõi KIA tốn 14 chu kỳ + 5,5 chu kỳ bus — đắt ngang đi xuống L2, và đắt hơn rất nhiều so với trúng L1 cục bộ chỉ 3 chu kỳ. Đó là cái giá của TÍNH NHẤT QUÁN CACHE, chủ đề của Ch.21. Hai luồng đá qua đá lại một biến dùng chung sẽ trả khoản này ở MỌI lần truy cập.</li>
<li><strong>Mỗi ô "N/A" đều nói lên một điều.</strong> Cache <em>LỆNH</em> L1 không có cỡ dòng và không có chính sách cập nhật vì nó <strong>CHỈ ĐỌC</strong> trong hoạt động bình thường — chẳng bao giờ có ai ghi ngược vào nó. Còn "lưu vào L1 của lõi kia" là N/A vì bạn KHÔNG lưu vào cache của lõi khác; giao thức nhất quán sẽ VÔ HIỆU HOÁ nó thay vì ghi vào.</li>
<li><strong>Nối sang Ch.5.</strong> Mọi tiêu đề cột ở đây — dung lượng, độ liên kết, cỡ dòng, chính sách ghi — đều là tham số bạn đã học cách lập luận ở chương cache. Bảng này là từ vựng của chương ấy áp vào MỘT sản phẩm đã xuất xưởng, và nó cho thấy những giá trị mà một thiết kế thật đã hội tụ về: dòng 64 byte ở mọi nơi, L1 liên kết 8 đường, write-back ở mọi mức.</li>
</ul>
<p class="pitfall">⚠️ Đọc kỹ hàng L1 data cache của bảng (b): <strong>độ trễ LƯU là 2 chu kỳ nhưng thông lượng LƯU là 3 chu kỳ</strong> — con số thông lượng LỚN HƠN con số độ trễ, đọc ngược so với hàng nạp (3 và 1). Đó là thứ IN TRÊN SLIDE và trong giáo trình; hãy trích nguyên như đã in chứ đừng lặng lẽ "sửa lại", và nếu một câu hỏi thi phụ thuộc vào nó thì nêu rõ bạn đang dùng con số nào.</p>
<p class="meo">💡 Giữ lại BA con số từ slide này là trả lời được phần lớn câu hỏi định lượng: <strong>L1 = 3 chu kỳ · L2 = 14 chu kỳ · L1 của lõi kia = 14 + 5,5 chu kỳ bus.</strong> Nôm na: cục bộ là 3, mọi thứ khác là 14 trở lên.</p>`],

      [20, 'Front End — three major components',
        `<p class="y-chinh">🎯 The slide that opens the detailed tour of the Intel Core front end. It says the front end <strong>"consists of three major components"</strong> and names them: the <strong>Branch prediction unit (BPU)</strong>, the <strong>Instruction fetch and predecode unit</strong>, and the <strong>Instruction queue and decode unit</strong>.</p>
<table>
<tr><th>Component</th><th>Its job in one line</th><th>Where the rest of the deck details it</th></tr>
<tr><td><strong>Branch prediction unit (BPU)</strong></td><td>Decide which instructions even exist — predict conditional, indirect, direct, call and return branches, maintain a branch target buffer</td><td>Slide 21</td></tr>
<tr><td><strong>Instruction fetch and predecode unit</strong></td><td>Get the bytes out of the L1 I-cache and mark up where instructions begin and end</td><td>Slide 22</td></tr>
<tr><td><strong>Instruction queue and decode unit</strong></td><td>Buffer the fetched bytes, find instruction boundaries, translate each machine instruction into one to four <strong>micro-ops</strong> (118-bit RISC instructions), then hand them to rename/allocate</td><td>Slide 23</td></tr>
</table>
<ul>
<li><strong>Why the front end has to be discussed separately at all.</strong> The back end can only be as busy as the front end keeps it. A 4-wide out-of-order core starved of instructions is just an expensive 1-wide core. The front end is a <em>supply</em> problem, and it is entirely in-order — look back at Figure 18.6 (slide 12), where Fetch, Decode, Rename and Dispatch all sit inside the "in-order front end" box.</li>
<li><strong>The order of the three components is the order of the pipeline, and also the order of difficulty.</strong> Prediction comes <em>first</em>, not last, because you cannot fetch until you know where to fetch from. Every cycle the BPU must produce a next-fetch address before the current fetch has even finished decoding — which is why it needs its own cache of past behaviour, the branch target buffer.</li>
<li><strong>"Predecode" exists because x86 instructions are variable length, and this is a direct echo of Ch.17.</strong> On a RISC machine every instruction is 4 bytes, so finding the boundaries of four instructions is trivial arithmetic. On x86 an instruction is 1 to 15 bytes, so the machine must <em>scan</em> to find where each one starts — and it cannot decode four in parallel until it knows. Predecode marks the boundaries once, on the way into the cache, so the decoder does not have to redo it every time the code is executed. This is the CISC tax that slide 2's "next step in the evolution" had to pay.</li>
<li><strong>The micro-op translation is the real answer to the CISC/RISC argument of Ch.17.</strong> The decoder turns each complex x86 instruction into one to four fixed-format 118-bit RISC-like micro-ops, and everything after this point in the machine — rename, window, issue, execute, commit — operates on micro-ops, not on x86 instructions. So a modern x86 chip is a RISC superscalar core wearing a CISC instruction set as a compatibility layer. That single design decision is why x86 survived RISC.</li>
<li><strong>Note what this means for the counts you have been learning.</strong> "Issue width 4" on such a machine means 4 <em>micro-ops</em>, not 4 x86 instructions. A question that asks how many x86 instructions per cycle has no fixed answer — it depends on how many micro-ops each one expands to, which is exactly why slide 23 bothers to say "one to four".</li>
</ul>
<p class="meo">💡 Three components, three verbs, in order: <strong>PREDICT where to go → FETCH and mark boundaries → QUEUE and translate to micro-ops.</strong> Then hand over to Rename/Alloc and the out-of-order half of the machine takes over.</p>`,
        `<p class="y-chinh">🎯 Slide mở màn phần tham quan chi tiết đầu-trước của Intel Core. Nó nói đầu-trước <strong>"gồm BA thành phần chính"</strong> và gọi tên: <strong>Khối dự đoán rẽ nhánh (BPU)</strong>, <strong>Khối nạp lệnh và giải mã sơ bộ</strong>, và <strong>Khối hàng đợi lệnh và giải mã</strong>.</p>
<table>
<tr><th>Thành phần</th><th>Việc của nó gói trong một dòng</th><th>Deck nói chi tiết ở đâu</th></tr>
<tr><td><strong>Branch prediction unit (BPU)</strong></td><td>Quyết định xem những lệnh nào TỒN TẠI — dự đoán nhánh có điều kiện, gián tiếp, trực tiếp, gọi hàm và trở về; duy trì một branch target buffer</td><td>Slide 21</td></tr>
<tr><td><strong>Instruction fetch and predecode unit</strong></td><td>Lấy các byte ra khỏi L1 I-cache và ĐÁNH DẤU chỗ mỗi lệnh bắt đầu và kết thúc</td><td>Slide 22</td></tr>
<tr><td><strong>Instruction queue and decode unit</strong></td><td>Đệm các byte đã nạp, tìm ranh giới lệnh, dịch mỗi lệnh máy thành MỘT tới BỐN <strong>micro-op</strong> (lệnh kiểu RISC rộng 118 bit), rồi trao cho tầng rename/allocate</td><td>Slide 23</td></tr>
</table>
<ul>
<li><strong>Vì sao đầu-trước lại phải bàn riêng.</strong> Đầu-sau chỉ bận rộn được tới mức mà đầu-trước nuôi nổi. Một lõi rộng 4 không-theo-thứ-tự mà bị đói lệnh thì chỉ là một lõi rộng 1 đắt tiền. Đầu-trước là bài toán <em>CUNG CẤP</em>, và nó HOÀN TOÀN đúng-thứ-tự — nhìn lại Figure 18.6 (slide 12), nơi Fetch, Decode, Rename và Dispatch đều nằm trong cái hộp "in-order front end".</li>
<li><strong>Thứ tự ba thành phần chính là thứ tự của đường ống, và cũng là thứ tự độ khó.</strong> Dự đoán đứng <em>ĐẦU TIÊN</em>, không phải cuối, vì bạn không nạp được nếu chưa biết nạp TỪ ĐÂU. Mỗi chu kỳ, BPU phải đẻ ra một địa chỉ nạp kế tiếp trước khi lượt nạp hiện tại kịp giải mã xong — đó là lý do nó cần một bộ nhớ đệm riêng về hành vi quá khứ, tức branch target buffer.</li>
<li><strong>"Predecode" tồn tại vì lệnh x86 có ĐỘ DÀI THAY ĐỔI, và đây là tiếng vọng trực tiếp của Ch.17.</strong> Trên máy RISC mọi lệnh đều 4 byte, nên tìm ranh giới của bốn lệnh chỉ là phép cộng tầm thường. Trên x86, một lệnh dài từ 1 tới 15 byte, nên máy phải <em>QUÉT</em> để tìm chỗ mỗi lệnh bắt đầu — và nó không giải mã song song bốn lệnh được chừng nào chưa biết. Predecode đánh dấu ranh giới MỘT LẦN, trên đường vào cache, để bộ giải mã khỏi phải làm lại mỗi lần đoạn mã được chạy. Đây là khoản THUẾ CISC mà cái "bước tiến hoá tiếp theo" của slide 2 buộc phải trả.</li>
<li><strong>Việc dịch sang micro-op mới là câu trả lời thật cho cuộc tranh luận CISC/RISC của Ch.17.</strong> Bộ giải mã biến mỗi lệnh x86 phức tạp thành một tới bốn micro-op khuôn dạng cố định rộng 118 bit kiểu RISC, và MỌI thứ sau điểm này trong cỗ máy — rename, cửa sổ, phát lệnh, thực thi, commit — đều làm việc trên MICRO-OP chứ không phải trên lệnh x86. Nên một con chip x86 hiện đại là một lõi superscalar RISC KHOÁC lên mình một tập lệnh CISC làm lớp tương thích. Chính quyết định thiết kế duy nhất ấy là lý do x86 sống sót qua RISC.</li>
<li><strong>Để ý điều này có nghĩa gì với những con số bạn vừa học.</strong> "Bề rộng phát 4" trên một cỗ máy như vậy nghĩa là 4 <em>MICRO-OP</em>, không phải 4 lệnh x86. Câu hỏi hỏi mỗi chu kỳ được mấy lệnh x86 thì KHÔNG có đáp án cố định — nó phụ thuộc mỗi lệnh bung ra bao nhiêu micro-op, đúng là lý do slide 23 phải nói rõ "một tới bốn".</li>
</ul>
<p class="meo">💡 Ba thành phần, ba động từ, theo thứ tự: <strong>DỰ ĐOÁN đi đâu → NẠP và đánh dấu ranh giới → XẾP HÀNG và dịch sang micro-op.</strong> Rồi trao cho Rename/Alloc, và nửa không-theo-thứ-tự của cỗ máy tiếp quản.</p>`],

    ]),
  ].join('\n'),
};
