/**
 * CEA201 · Chương 15 trên web (= Ch.21 bản 11e của Stallings) — Multicore
 * Computers, học theo từng slide (slide 1–30, trọn deck 'cea21').
 *
 * ⚠️ ĐÁNH SỐ: đây là CHƯƠNG CUỐI của bộ slide. Trên web môn này gom
 * "Parallel Processing (cea20) + Multicore (cea21)" thành "Chương 15", nên file
 * tên ch15c. Syllabus của trường (theo bản 9th ed) gọi phần này là "Ch.18
 * Multicore". Bảng quy đổi đầy đủ: _slides.mjs.
 *
 * Nội dung bám ĐÚNG chữ trích từ CH21-COA11e.pptx (/tmp/cea201-text/cea21.txt).
 * Các slide mà bản trích chữ BỎ SÓT hoặc chỉ có tiêu đề đã được ĐỌC THẲNG TỪ
 * ẢNH render (/tmp/cea201-slides/cea21/NNN.webp): 1, 2, 3, 4, 5, 8, 9, 10, 11,
 * 12, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 26, 28, 29, 30.
 *   · slide 10 và 23, 24: bản trích CHỈ lấy được tiêu đề ("Heterogeneous
 *     Multicore Organization", "Interrupt Handling", "GIC") — toàn bộ thân
 *     slide nằm trong SmartArt nên phải đọc từ ảnh. Chữ trong bài lấy từ ảnh.
 *
 * ⚠️ MỌI con số trong bài đã kiểm bằng python3 TRƯỚC khi viết:
 *   · Amdahl S = 1/((1−f) + f/N) cho f = 0,5 · 0,75 · 0,9 · 0,95 · 0,99 và
 *     N = 2 · 4 · 8 · 16 · 64 · 256 — nguyên bảng in trong slide 4, cùng trần
 *     1/(1−f) = 2 · 4 · 10 · 20 · 100.
 *   · Bài ngược: N = 16, S = 12 ⇒ f = 0,977778 (97,78%). Kiểm chéo: f = 0,98667
 *     với N = 16 cho S = 13,33 (lớn hơn 12, khớp chiều đơn điệu).
 *   · Gustafson S = (1−f) + f·N: f = 0,95, N = 64 → 60,85 (Amdahl chỉ 15,42).
 *   · Bức tường công suất P ≈ C·V²·f: 2 lõi @ f/2 với V→0,7V = 0,49 lần công
 *     suất của 1 lõi @ f, cùng thông lượng. V→V/2 thì còn 0,25. V giữ nguyên
 *     thì 1,00 (không lời gì) — nên VOLTAGE mới là chỗ ăn tiền.
 *   · Table 21.1 kiểm chéo bằng nhân tay: 3,8 × 4 × 8 = 121,6 GFLOPS và
 *     0,8 × 384 × 2 = 614,4 GFLOPS — KHỚP đúng hai ô GFLOPS của slide.
 *
 * ⚠️ PHÉP ĐO THẬT (chạy trên chính máy viết bài — Apple M1 Max, Apple clang,
 *    cc -O2, mã nguồn in nguyên trong bài):
 *   · Máy này CHÍNH LÀ một chip đa lõi KHÔNG ĐỒNG NHẤT: hw.perflevel0 =
 *     8 lõi "Performance", hw.perflevel1 = 2 lõi "Efficiency" (tổng 10).
 *     Cache đo bằng sysctl: lõi P có L1I 192 kB · L1D 128 kB · L2 dùng chung
 *     12 MB; lõi E có L1I 128 kB · L1D 64 kB · L2 dùng chung 4 MB; dòng cache
 *     128 byte; RAM 32 GB.
 *   · Tăng tốc thật khi tăng số luồng (200 triệu phép sin×cos, 2 lượt):
 *     1→1,00 · 2→1,99/1,98 · 3→2,96/2,91 · 4→3,90/3,87 · 5→4,87/4,81 ·
 *     6→4,15/5,62 · 8→6,89/6,58 · 10→7,06/6,67.
 *     Khớp ngược vào Amdahl: N=8, S=6,89 ⇒ f = 0,977 (2,3% tuần tự).
 *     Và 10 luồng CHỈ hơn 8 luồng chút xíu — vì 2 lõi cuối là lõi E chậm hơn,
 *     chúng thành kẻ về đích cuối. Đây là minh hoạ sống của slide 15–17.
 *
 * Chỗ slide gốc SAI/LỆCH — nêu rõ trong bài, không im lặng chép, không tự sửa:
 *   · slide 20 (Table 21.2) ghi nhãn "(a) MESIM" và "(b) MOISI". Đúng phải là
 *     MESI và MOESI — chính slide 30 (Summary) viết "the MOESI model".
 *   · slide 20 bảng (b): hai dòng "Unique?" và "Can write?" ghi Yes cho CẢ bốn
 *     trạng thái M/O/E/S. Điều đó mâu thuẫn với Figure 21.12 ở slide 19 (Owned
 *     và Shared nằm trong cột "Shared", không phải "Unique") và mâu thuẫn với
 *     chính dòng Comments của nó ("Must write back to transition").
 *   · slide 19 (Figure 21.12) in sai chính tả ô lớn bên phải: "Invaiid".
 *   · slide 14 (Figure 21.8) in "4 ARM cores @ 1.4 Ghz" — đơn vị đúng là GHz.
 *   · CÔNG THỨC Amdahl KHÔNG in trên slide nào của chương này; slide 4 chỉ vẽ
 *     ĐỒ THỊ của nó. Gustafson KHÔNG xuất hiện ở đâu trong deck. Bài này nói rõ
 *     chỗ nào là slide, chỗ nào là sách.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea21';

export default {
  title: '15.0c — Slide by slide: Multicore — the power wall, cache organisation, Amdahl and heterogeneous chips (30 slides)|||15.0c — Slide bài giảng: Đa lõi — bức tường công suất, tổ chức cache, Amdahl & chip không đồng nhất (30 slide)',
  slug: 'cea201-15-0c-slides-da-loi-cache-va-khong-dong-nhat',
  type: 'DOCUMENT',
  description: 'Trọn Chương 21 bản 11e (30 slide) — CHƯƠNG CUỐI của CEA201. Đi từ lý do vật lý phải chuyển sang đa lõi (bức tường công suất P ≈ C·V²·f, giới hạn ILP, quy tắc Pollack), qua bốn phương án tổ chức cache đa lõi của Figure 21.6 (L1 riêng · L2 riêng · L2 chung · L3 chung), tới hiệu năng PHẦN MỀM trên đa lõi với bảng Amdahl đầy đủ và phép đo tăng tốc thật trên máy 8+2 lõi, rồi sang nửa sau mà tiêu đề hay bỏ quên: đa lõi KHÔNG ĐỒNG NHẤT (CPU+GPU, HSA, TI 66AK2H12, ARM big.Little), nhất quán cache ACE/MOESI, và ba ví dụ chip thật Intel Core i7-5960X · ARM Cortex-A15 MPCore (ngắt, GIC, SCU) · IBM z13 với L4 480 MB. Mọi con số đã kiểm bằng python3 và đối chiếu chéo với chính bảng của slide.',
  content: [
    walkHead(D, 1, 30),
    walk(D, [

      [1, 'Chapter 21 — Multicore Computers (title slide)',
        `<p class="y-chinh">🎯 The last chapter of the book, and it answers a question the previous twenty chapters kept raising: <strong>if making one processor faster is the whole game, why did the industry stop doing it around 2004 and start gluing cores together instead?</strong> The answer is not "more is better" — it is a wall of physics that this chapter measures.</p>
<ul>
<li><strong>Read the chapter as two halves, not one.</strong> Slides 2–9 are the <em>general</em> argument: why multicore, how software behaves on it, and the four ways to wire the caches. Slides 10–29 are the half that the chapter title hides — <em>heterogeneous</em> multicore (CPU+GPU, HSA, TI 66AK2H12, ARM big.Little), cache coherence with ACE/MOESI, and three real chips: Intel Core i7-5960X, ARM Cortex-A15 MPCore, IBM z13.</li>
<li><strong>The one sentence that drives everything.</strong> Power grows roughly as <code>P ≈ C·V<sup>2</sup>·f</code> and voltage must rise with frequency, so pushing one core faster costs power <em>super-linearly</em>, while adding a second core at a lower clock costs power almost linearly. Slide 3 turns that into arithmetic.</li>
<li><strong>Numbering warning.</strong> Your syllabus follows the 9th edition and calls this "Ch.18 Multicore"; the site groups it with Parallel Processing as "Chapter 15". The slide deck itself says <strong>Chapter 21</strong>. Same content, three names — do not panic in the exam when the numbering does not match.</li>
<li><strong>What you must already own before this deck.</strong> Cache and the memory hierarchy (Ch.4–5), pipelining and superscalar issue (Ch.16, Ch.18), the MESI protocol and the SMP/NUMA taxonomy (Ch.20 — lessons 15.0a and 15.0b). This chapter is the place where all three meet on one piece of silicon.</li>
<li><strong>Where the exam marks live.</strong> Three places, and only three: (1) Amdahl arithmetic on a multicore, (2) naming and comparing the four cache organisations of Figure 21.6, (3) the coherence state tables (MESI vs MOESI). Everything else is recognition, not calculation.</li>
</ul>
<p class="meo">💡 Keep one image for the chapter: <strong>a factory that cannot make its one worker run faster, so it hires more workers</strong>. The rest of the chapter is the two problems that follow — the workers must share one set of tools (cache coherence) and somebody has to split the job (Amdahl).</p>`,
        `<p class="y-chinh">🎯 Chương CUỐI của sách, và nó trả lời một câu hỏi mà hai mươi chương trước cứ khơi lên mãi: <strong>nếu làm một bộ xử lý chạy nhanh hơn là toàn bộ cuộc chơi, thì vì sao khoảng năm 2004 cả ngành DỪNG việc đó lại và quay sang dán nhiều lõi vào nhau?</strong> Câu trả lời không phải "nhiều thì tốt hơn" — mà là một bức tường vật lý, và chương này ĐO nó.</p>
<ul>
<li><strong>Đọc chương thành HAI NỬA, đừng đọc thành một.</strong> Slide 2–9 là lập luận <em>TỔNG QUÁT</em>: vì sao đa lõi, phần mềm cư xử ra sao trên đa lõi, và bốn cách đi dây cache. Slide 10–29 là cái nửa mà tiêu đề chương giấu đi — đa lõi <em>KHÔNG ĐỒNG NHẤT</em> (CPU+GPU, HSA, TI 66AK2H12, ARM big.Little), nhất quán cache bằng ACE/MOESI, và ba con chip THẬT: Intel Core i7-5960X, ARM Cortex-A15 MPCore, IBM z13.</li>
<li><strong>Một câu lái cả chương.</strong> Công suất tăng xấp xỉ theo <code>P ≈ C·V<sup>2</sup>·f</code> mà điện áp lại phải tăng theo tần số, nên đẩy MỘT lõi nhanh hơn thì tốn công suất <em>SIÊU TUYẾN TÍNH</em>, còn thêm một lõi thứ hai chạy chậm hơn thì tốn gần như tuyến tính. Slide 3 biến câu đó thành phép tính.</li>
<li><strong>Cảnh báo đánh số.</strong> Syllabus của trường theo bản 9th ed nên gọi đây là "Ch.18 Multicore"; trên web thì gộp với Parallel Processing thành "Chương 15". Còn chính bộ slide ghi <strong>Chapter 21</strong>. Cùng một nội dung, ba cái tên — vào phòng thi thấy số không khớp thì đừng hoảng.</li>
<li><strong>Bạn phải nắm sẵn gì trước deck này.</strong> Cache và phân cấp bộ nhớ (Ch.4–5), pipeline và phát lệnh superscalar (Ch.16, Ch.18), giao thức MESI cùng phân loại SMP/NUMA (Ch.20 — bài 15.0a và 15.0b). Chương này là chỗ cả ba thứ đó gặp nhau trên CÙNG một miếng silic.</li>
<li><strong>Điểm thi nằm ở đâu.</strong> Đúng ba chỗ, không hơn: (1) phép tính Amdahl trên đa lõi, (2) gọi tên và so sánh bốn phương án tổ chức cache của Figure 21.6, (3) bảng trạng thái nhất quán (MESI so với MOESI). Phần còn lại là NHẬN BIẾT, không phải TÍNH TOÁN.</li>
</ul>
<p class="meo">💡 Giữ một hình ảnh cho cả chương: <strong>một xưởng không thể bắt người thợ duy nhất làm nhanh hơn, nên nó thuê thêm thợ</strong>. Phần còn lại của chương là hai rắc rối kéo theo — đám thợ phải dùng chung một bộ đồ nghề (nhất quán cache) và phải có ai đó chia việc ra (Amdahl).</p>`],

      [2, 'Figure 21.1 — Alternative Chip Organizations',
        `<p class="y-chinh">🎯 Three ways to spend a transistor budget, drawn one under the other so you can see exactly what gets <strong>duplicated</strong> in each. This single figure is the whole taxonomy of on-chip parallelism.</p>
<table>
<tr><th></th><th>(a) Superscalar</th><th>(b) Simultaneous multithreading</th><th>(c) Multicore</th></tr>
<tr><td><strong>Program counters</strong></td><td>ONE ("Program counter")</td><td><strong>n</strong> (PC 1 … PC n)</td><td>one per core</td></tr>
<tr><td><strong>Register file</strong></td><td>ONE ("Single-thread register file")</td><td><strong>n</strong> (Registers 1 … Registers n)</td><td>one per core</td></tr>
<tr><td><strong>Issue logic</strong></td><td>one, shared</td><td>one, shared</td><td>one <em>per core</em></td></tr>
<tr><td><strong>Execution units</strong></td><td>one set</td><td>one set, <em>shared by all threads</em></td><td>one set per core</td></tr>
<tr><td><strong>L1 I-cache / D-cache</strong></td><td>one pair</td><td>one pair, shared</td><td><strong>one pair per core</strong> (L1-I, L1-D)</td></tr>
<tr><td><strong>L2 cache</strong></td><td>one</td><td>one</td><td>ONE, shared by all n cores</td></tr>
</table>
<ul>
<li><strong>Read the figure top-down as "how much do I duplicate?".</strong> Superscalar duplicates nothing above the execution units — it just issues several instructions of <em>one</em> thread per cycle. SMT duplicates only the <em>architectural state</em> (PC + registers) and keeps the expensive execution hardware shared. Multicore duplicates <strong>everything</strong> up to and including L1, and shares only L2 and below.</li>
<li><strong>The cost order is the duplication order.</strong> SMT is nearly free in area (a few kB of register state) which is why it ships as "Hyper-Threading" on chips that also have many cores. A core is expensive. That is why (b) and (c) are <em>combined</em> in practice — note the label inside each core in (c): "<strong>Core n (superscalar or SMT)</strong>". They are not rivals.</li>
<li><strong>Why superscalar hit a ceiling.</strong> Ch.18 showed the limits of instruction-level parallelism: dependencies, branches, and a window that gets quadratically more expensive to widen. Past roughly 4–6 issue slots you pay a lot of transistors for almost nothing — which is what pushes the budget towards (b) and (c).</li>
<li><strong>What each one needs from software.</strong> (a) needs nothing — a plain single-threaded program speeds up for free. (b) and (c) need <strong>threads</strong>: if your program has one thread, a 16-core chip runs it exactly as fast as a 1-core chip. That dependence is what slides 4–8 are about.</li>
</ul>
<p class="pitfall">⚠️ Classic exam trap: "SMT gives you n processors". No — SMT gives you <em>n sets of state sharing one set of execution units</em>. If two threads both want the multiplier in the same cycle, one waits. Multicore gives genuinely independent execution hardware.</p>`,
        `<p class="y-chinh">🎯 Ba cách tiêu một ngân sách transistor, vẽ chồng lên nhau để bạn thấy đúng cái gì bị <strong>NHÂN ĐÔI</strong> ở mỗi phương án. Chỉ một hình này là trọn bộ phân loại song song trên chip.</p>
<table>
<tr><th></th><th>(a) Superscalar</th><th>(b) Đa luồng đồng thời (SMT)</th><th>(c) Đa lõi (multicore)</th></tr>
<tr><td><strong>Bộ đếm chương trình</strong></td><td>MỘT ("Program counter")</td><td><strong>n</strong> cái (PC 1 … PC n)</td><td>mỗi lõi một cái</td></tr>
<tr><td><strong>Tệp thanh ghi</strong></td><td>MỘT ("Single-thread register file")</td><td><strong>n</strong> bộ (Registers 1 … Registers n)</td><td>mỗi lõi một bộ</td></tr>
<tr><td><strong>Logic phát lệnh</strong></td><td>một, dùng chung</td><td>một, dùng chung</td><td>một <em>cho MỖI lõi</em></td></tr>
<tr><td><strong>Khối thực thi</strong></td><td>một bộ</td><td>một bộ, <em>mọi luồng dùng chung</em></td><td>mỗi lõi một bộ</td></tr>
<tr><td><strong>L1 I-cache / D-cache</strong></td><td>một cặp</td><td>một cặp, dùng chung</td><td><strong>mỗi lõi một cặp</strong> (L1-I, L1-D)</td></tr>
<tr><td><strong>L2 cache</strong></td><td>một</td><td>một</td><td>MỘT, cả n lõi dùng chung</td></tr>
</table>
<ul>
<li><strong>Đọc hình từ trên xuống theo câu hỏi "tôi nhân đôi tới đâu?".</strong> Superscalar KHÔNG nhân đôi gì phía trên khối thực thi — nó chỉ phát nhiều lệnh của <em>MỘT</em> luồng trong một chu kỳ. SMT chỉ nhân đôi <em>TRẠNG THÁI KIẾN TRÚC</em> (PC + thanh ghi) và giữ nguyên phần cứng thực thi đắt đỏ để dùng chung. Đa lõi nhân đôi <strong>MỌI THỨ</strong> lên tới và bao gồm cả L1, chỉ dùng chung từ L2 trở xuống.</li>
<li><strong>Thứ tự giá tiền chính là thứ tự nhân đôi.</strong> SMT gần như MIỄN PHÍ về diện tích (thêm vài kB trạng thái thanh ghi), nên nó nằm sẵn dưới tên "Hyper-Threading" trên những chip vốn đã nhiều lõi. Một cái lõi thì ĐẮT. Vì thế trong thực tế (b) và (c) được <em>GHÉP</em> với nhau — để ý nhãn bên trong mỗi lõi ở hình (c): "<strong>Core n (superscalar or SMT)</strong>". Chúng không phải đối thủ của nhau.</li>
<li><strong>Vì sao superscalar đụng trần.</strong> Ch.18 đã cho thấy giới hạn của song song mức lệnh: phụ thuộc dữ liệu, rẽ nhánh, và cửa sổ phát lệnh mà mở rộng thì chi phí tăng theo bình phương. Vượt quá cỡ 4–6 khe phát lệnh là bạn trả rất nhiều transistor để đổi lấy gần như không gì — đó chính là thứ đẩy ngân sách sang (b) và (c).</li>
<li><strong>Mỗi phương án đòi gì ở phần mềm.</strong> (a) không đòi gì — chương trình một luồng bình thường tự nhanh lên miễn phí. (b) và (c) đòi <strong>LUỒNG</strong>: chương trình của bạn chỉ có một luồng thì chip 16 lõi chạy nó nhanh y hệt chip 1 lõi. Chính sự phụ thuộc đó là nội dung của slide 4–8.</li>
</ul>
<p class="pitfall">⚠️ Bẫy kinh điển: "SMT cho bạn n bộ xử lý". KHÔNG — SMT cho bạn <em>n bộ TRẠNG THÁI dùng chung MỘT bộ khối thực thi</em>. Hai luồng cùng đòi bộ nhân trong một chu kỳ thì một đứa phải chờ. Đa lõi mới cho phần cứng thực thi độc lập thật sự.</p>`],

      [3, 'Figure 21.2 — Power and Memory Considerations',
        `<p class="y-chinh">🎯 The physical reason the whole chapter exists. A log-scale plot of <strong>power density (watts/cm<sup>2</sup>)</strong> against <strong>feature size (µm)</strong> shrinking from 0.25 down to 0.10: the <em>logic</em> line climbs to about 100 W/cm<sup>2</sup>, the <em>memory</em> line stays far below it. Two labels on the right, "Power" and "Memory", name the two lessons.</p>
<ul>
<li><strong>Lesson 1 — the power wall.</strong> Shrinking transistors lets you pack more of them per cm<sup>2</sup>, but the heat per cm<sup>2</sup> goes up with them. Reading the log axis: logic goes from roughly 25 to roughly 100 W/cm<sup>2</sup> across those four nodes — about <strong>4×</strong>. (The slide puts no number on any point; that is read off the graph, and the tick lines at 1, 10 and 100 are all the calibration you get.) At 100 W/cm<sup>2</sup> you are in the region of a kitchen hot plate, and you simply cannot remove the heat from a chip package.</li>
<li><strong>Lesson 2 — memory is the cheap place to spend transistors.</strong> The memory line sits roughly an order of magnitude below logic at every node. Cache is mostly idle SRAM cells; logic switches every cycle. So if you have transistors to spend and a power budget you cannot exceed, <strong>spend them on cache</strong>. That is why Figure 21.6 (slide 9) is a chapter about cache, and why the i7-5960X on slide 21 carries 20 MB of L3.</li>
</ul>
<p class="nhan">📐 <strong>The arithmetic behind the wall.</strong> Dynamic power of CMOS is approximately <code>P ≈ C · V<sup>2</sup> · f</code> where C is switched capacitance (roughly, how much silicon you have), V is supply voltage and f is clock frequency. Compare two ways to reach the <em>same</em> total throughput. Normalise option A to 1:</p>
<table>
<tr><th>Option</th><th>Capacitance</th><th>Voltage</th><th>Frequency</th><th>Power = C·V<sup>2</sup>·f</th></tr>
<tr><td><strong>A</strong> — one core at f</td><td>C</td><td>V</td><td>f</td><td>1,00</td></tr>
<tr><td><strong>B1</strong> — two cores at f/2, V unchanged</td><td>2C</td><td>V</td><td>f/2</td><td>2 × 1 × 0,5 = <strong>1,00</strong></td></tr>
<tr><td><strong>B2</strong> — two cores at f/2, V → 0,7V</td><td>2C</td><td>0,7V</td><td>f/2</td><td>2 × 0,49 × 0,5 = <strong>0,49</strong></td></tr>
<tr><td><strong>B3</strong> — two cores at f/2, V → V/2</td><td>2C</td><td>0,5V</td><td>f/2</td><td>2 × 0,25 × 0,5 = <strong>0,25</strong></td></tr>
</table>
<p class="dap-an">✅ Answer: two cores at half the clock deliver the same aggregate throughput for <strong>49% of the power</strong> when the voltage can be dropped to 0,7V, or <strong>25%</strong> if it halves. Notice row B1: with voltage <em>unchanged</em> the saving is exactly zero. <strong>The win comes from the V<sup>2</sup> term, not from the core count</strong> — a lower clock is what permits a lower voltage. Run the argument backwards and you get the wall: doubling one core's frequency needs a higher voltage too, so power grows roughly as <strong>f<sup>3</sup></strong> — up to 8× the power for 2× the speed.</p>
<p class="meo">💡 <strong>Pollack's rule</strong> is the other half of the same story: a single core's performance grows roughly as the <em>square root</em> of its complexity. Spend 4× the transistors on one core and you get about 2× the speed; spend them on 4 cores and you get up to 4× — <em>if</em> the software has the parallelism. That "if" is slide 4.</p>`,
        `<p class="y-chinh">🎯 Lý do VẬT LÝ khiến cả chương này tồn tại. Đồ thị thang log của <strong>MẬT ĐỘ CÔNG SUẤT (watt/cm<sup>2</sup>)</strong> theo <strong>kích thước đặc trưng (µm)</strong> co từ 0,25 xuống 0,10: đường <em>logic</em> leo lên khoảng 100 W/cm<sup>2</sup>, đường <em>memory</em> nằm thấp hơn hẳn. Hai chữ bên phải, "Power" và "Memory", đặt tên cho hai bài học.</p>
<ul>
<li><strong>Bài học 1 — BỨC TƯỜNG CÔNG SUẤT.</strong> Co transistor lại thì nhét được nhiều hơn trên mỗi cm<sup>2</sup>, nhưng NHIỆT trên mỗi cm<sup>2</sup> cũng tăng theo. Đọc trục log: logic đi từ cỡ 25 lên cỡ 100 W/cm<sup>2</sup> qua bốn thế hệ đó — khoảng <strong>4 lần</strong>. (Slide KHÔNG ghi con số nào cho từng điểm; đó là đọc từ đồ thị, và ba vạch 1 · 10 · 100 là toàn bộ thước đo bạn có.) Ở mức 100 W/cm<sup>2</sup> là ngang cái bếp điện, và đơn giản là không rút nhiệt ra khỏi vỏ chip nổi.</li>
<li><strong>Bài học 2 — BỘ NHỚ là chỗ RẺ để tiêu transistor.</strong> Đường memory nằm thấp hơn logic cỡ một bậc thang log ở mọi thế hệ. Cache phần lớn là ô SRAM nằm im; logic thì đảo trạng thái mỗi chu kỳ. Nên nếu bạn còn transistor để tiêu mà ngân sách công suất thì không được vượt, hãy <strong>TIÊU VÀO CACHE</strong>. Đó là lý do Figure 21.6 (slide 9) hoá ra là một chương về cache, và vì sao con i7-5960X ở slide 21 vác theo 20 MB L3.</li>
</ul>
<p class="nhan">📐 <strong>Phép tính đằng sau bức tường.</strong> Công suất động của CMOS xấp xỉ <code>P ≈ C · V<sup>2</sup> · f</code>, với C là điện dung chuyển mạch (đại khái: bạn có bao nhiêu silic), V là điện áp nguồn, f là tần số xung nhịp. So hai cách đạt CÙNG một thông lượng tổng. Chuẩn hoá phương án A bằng 1:</p>
<table>
<tr><th>Phương án</th><th>Điện dung</th><th>Điện áp</th><th>Tần số</th><th>Công suất = C·V<sup>2</sup>·f</th></tr>
<tr><td><strong>A</strong> — 1 lõi chạy f</td><td>C</td><td>V</td><td>f</td><td>1,00</td></tr>
<tr><td><strong>B1</strong> — 2 lõi chạy f/2, GIỮ NGUYÊN V</td><td>2C</td><td>V</td><td>f/2</td><td>2 × 1 × 0,5 = <strong>1,00</strong></td></tr>
<tr><td><strong>B2</strong> — 2 lõi chạy f/2, V → 0,7V</td><td>2C</td><td>0,7V</td><td>f/2</td><td>2 × 0,49 × 0,5 = <strong>0,49</strong></td></tr>
<tr><td><strong>B3</strong> — 2 lõi chạy f/2, V → V/2</td><td>2C</td><td>0,5V</td><td>f/2</td><td>2 × 0,25 × 0,5 = <strong>0,25</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án: hai lõi chạy nửa xung nhịp cho cùng thông lượng tổng mà chỉ tốn <strong>49% công suất</strong> nếu hạ được điện áp xuống 0,7V, hoặc <strong>25%</strong> nếu điện áp giảm một nửa. Để ý dòng B1: GIỮ NGUYÊN điện áp thì tiết kiệm đúng bằng KHÔNG. <strong>Cái lời nằm ở số hạng V<sup>2</sup>, không nằm ở số lõi</strong> — xung nhịp thấp chỉ là thứ CHO PHÉP hạ điện áp. Chạy ngược lập luận là ra bức tường: muốn nhân đôi tần số của một lõi thì phải nâng cả điện áp, nên công suất phình theo cỡ <strong>f<sup>3</sup></strong> — tới 8 lần công suất để đổi lấy 2 lần tốc độ.</p>
<p class="meo">💡 <strong>Quy tắc Pollack</strong> là nửa còn lại của cùng câu chuyện: hiệu năng của MỘT lõi tăng xấp xỉ theo <em>CĂN BẬC HAI</em> của độ phức tạp. Tiêu gấp 4 transistor vào một lõi thì được cỡ 2 lần tốc độ; tiêu vào 4 lõi thì được tới 4 lần — <em>NẾU</em> phần mềm có đủ tính song song. Chữ "NẾU" đó là slide 4.</p>`],

      [4, 'Figure 21.3 — Performance Effect of Multiple Cores',
        `<p class="y-chinh">🎯 The most exam-relevant slide of the chapter. Two graphs of <strong>relative speedup against number of processors (1 to 8)</strong>. Graph (a) "Speedup with 0%, 2%, 5%, and 10% sequential portions" — four curves that fan out and flatten. Graph (b) "Speedup with overheads" — curves for 5%, 10%, 15%, 20% that rise, <strong>peak around 4–5 processors and then come back down</strong>.</p>
<p class="nhan">📐 The formula is <strong>not printed on the slide</strong> — it comes from the book (Amdahl's law, introduced back in Ch.2). With <em>f</em> the fraction of the code that is parallelisable and <em>N</em> the number of cores:</p>
<pre>S(N) = 1 / ( (1 − f) + f/N )        ceiling as N → ∞ :  1/(1 − f)</pre>
<table>
<tr><th>f (parallel fraction)</th><th>N=2</th><th>N=4</th><th>N=8</th><th>N=16</th><th>N=64</th><th>N=256</th><th>Ceiling 1/(1−f)</th></tr>
<tr><td>0,50</td><td>1,33</td><td>1,60</td><td>1,78</td><td>1,88</td><td>1,97</td><td>1,99</td><td><strong>2,0</strong></td></tr>
<tr><td>0,75</td><td>1,60</td><td>2,29</td><td>2,91</td><td>3,37</td><td>3,82</td><td>3,95</td><td><strong>4,0</strong></td></tr>
<tr><td>0,90</td><td>1,82</td><td>3,08</td><td>4,71</td><td>6,40</td><td>8,77</td><td>9,66</td><td><strong>10,0</strong></td></tr>
<tr><td>0,95</td><td>1,90</td><td>3,48</td><td>5,93</td><td>9,14</td><td>15,42</td><td>18,62</td><td><strong>20,0</strong></td></tr>
<tr><td>0,99</td><td>1,98</td><td>3,88</td><td>7,48</td><td>13,91</td><td>39,26</td><td>72,11</td><td><strong>100,0</strong></td></tr>
</table>
<p class="dap-an">✅ Read the last column first: <strong>5% sequential code caps you at 20×, no matter how many cores you buy.</strong> At f = 0,95 you have already collected 15,42× of that 20× by 64 cores; going from 64 to 256 cores — four times the silicon and four times the power — buys you 15,42 → 18,62, i.e. <strong>21% more</strong>. Multicore is not a free lunch; it is a lunch whose price rises steeply once you are near the ceiling.</p>
<p class="nhan">📐 <strong>The reverse question, the one exams actually ask.</strong> "I have 16 cores and I want 12× speedup — what is the minimum f?" Rearrange: from S = 1/((1−f) + f/N), solve for f → <code>f = (1 − 1/S) / (1 − 1/N)</code>. Substituting S = 12, N = 16: f = (1 − 0,08333) / (1 − 0,0625) = 0,91667 / 0,9375 = <strong>0,97778</strong>.</p>
<p class="dap-an">✅ Answer: at least <strong>97,78% of the program must be parallel</strong> — you are allowed only 2,22% sequential code. Sanity check in the other direction: f = 0,95 with N = 16 gives only 9,14×, which is less than 12, so 0,95 really is not enough. And f = 0,98667 gives 13,33× &gt; 12, consistent with the answer lying between them.</p>
<p class="nhan">📐 <strong>Measured on this machine</strong> (Apple M1 Max, 8 Performance + 2 Efficiency cores, <code>cc -O2</code>, 200 million sin×cos operations split evenly over threads, two runs):</p>
<table>
<tr><th>Threads</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>8</th><th>10</th></tr>
<tr><td>Speedup (run 1)</td><td>1,00</td><td>1,99</td><td>2,96</td><td>3,90</td><td>4,87</td><td>4,15</td><td>6,89</td><td>7,06</td></tr>
<tr><td>Speedup (run 2)</td><td>1,00</td><td>1,98</td><td>2,91</td><td>3,87</td><td>4,81</td><td>5,62</td><td>6,58</td><td>6,67</td></tr>
</table>
<p class="dap-an">✅ Fitting Amdahl backwards to the 8-thread point: f = (1 − 1/6,89)/(1 − 1/8) = <strong>0,977</strong>, i.e. about <strong>2,3% of this embarrassingly parallel program still behaves as sequential</strong> — thread creation, joining, and the fact that some threads finish late. Even a loop with no shared data does not reach the ideal line.</p>
<p class="pitfall">⚠️ Graph (b) is the half students forget, and it is <em>not</em> Amdahl. Amdahl's curve is monotonically increasing — it flattens but never falls. Graph (b) <strong>falls</strong> after its peak because it adds a <em>communication/synchronisation overhead that grows with N</em>. Real message: past some core count, adding cores makes the program <strong>slower</strong>. You can see a hint of it in the measured table above — 6 threads scored 4,15 in run 1, <em>worse</em> than 5 threads.</p>`,
        `<p class="y-chinh">🎯 Slide đáng thi nhất của cả chương. Hai đồ thị <strong>tăng tốc tương đối theo số bộ xử lý (1 tới 8)</strong>. Đồ thị (a) "Speedup with 0%, 2%, 5%, and 10% sequential portions" — bốn đường xoè ra rồi bẹt dần. Đồ thị (b) "Speedup with overheads" — các đường 5%, 10%, 15%, 20% leo lên, <strong>ĐẠT ĐỈNH quanh 4–5 bộ xử lý rồi TỤT XUỐNG</strong>.</p>
<p class="nhan">📐 Công thức <strong>KHÔNG được in trên slide</strong> — nó đến từ SÁCH (định luật Amdahl, đã giới thiệu từ Ch.2). Gọi <em>f</em> là phần mã song song hoá được, <em>N</em> là số lõi:</p>
<pre>S(N) = 1 / ( (1 − f) + f/N )        trần khi N → ∞ :  1/(1 − f)</pre>
<table>
<tr><th>f (phần song song)</th><th>N=2</th><th>N=4</th><th>N=8</th><th>N=16</th><th>N=64</th><th>N=256</th><th>Trần 1/(1−f)</th></tr>
<tr><td>0,50</td><td>1,33</td><td>1,60</td><td>1,78</td><td>1,88</td><td>1,97</td><td>1,99</td><td><strong>2,0</strong></td></tr>
<tr><td>0,75</td><td>1,60</td><td>2,29</td><td>2,91</td><td>3,37</td><td>3,82</td><td>3,95</td><td><strong>4,0</strong></td></tr>
<tr><td>0,90</td><td>1,82</td><td>3,08</td><td>4,71</td><td>6,40</td><td>8,77</td><td>9,66</td><td><strong>10,0</strong></td></tr>
<tr><td>0,95</td><td>1,90</td><td>3,48</td><td>5,93</td><td>9,14</td><td>15,42</td><td>18,62</td><td><strong>20,0</strong></td></tr>
<tr><td>0,99</td><td>1,98</td><td>3,88</td><td>7,48</td><td>13,91</td><td>39,26</td><td>72,11</td><td><strong>100,0</strong></td></tr>
</table>
<p class="dap-an">✅ Đọc CỘT CUỐI trước: <strong>chỉ 5% mã tuần tự đã chặn trần ở 20×, mua bao nhiêu lõi cũng vậy.</strong> Với f = 0,95 thì tới 64 lõi bạn đã gom được 15,42× trong cái trần 20× đó; đi từ 64 lên 256 lõi — gấp bốn lần silic và gấp bốn lần điện — chỉ mua thêm 15,42 → 18,62, tức <strong>hơn 21%</strong>. Đa lõi KHÔNG phải bữa trưa miễn phí; nó là bữa trưa mà giá dựng đứng lên khi bạn đã gần trần.</p>
<p class="nhan">📐 <strong>BÀI NGƯỢC, đúng dạng đề hay hỏi.</strong> "Có 16 lõi, muốn tăng tốc 12× — f tối thiểu là bao nhiêu?" Biến đổi từ S = 1/((1−f) + f/N), giải ra f → <code>f = (1 − 1/S) / (1 − 1/N)</code>. Thay S = 12, N = 16: f = (1 − 0,08333) / (1 − 0,0625) = 0,91667 / 0,9375 = <strong>0,97778</strong>.</p>
<p class="dap-an">✅ Đáp án: ít nhất <strong>97,78% chương trình phải song song</strong> — chỉ được phép còn 2,22% mã tuần tự. Kiểm ngược cho chắc: f = 0,95 với N = 16 chỉ cho 9,14× (nhỏ hơn 12, vậy 0,95 đúng là không đủ), còn f = 0,98667 cho 13,33× (lớn hơn 12) — đáp số nằm giữa hai mốc đó, khớp.</p>
<p class="nhan">📐 <strong>ĐO THẬT trên máy viết bài</strong> (Apple M1 Max, 8 lõi Performance + 2 lõi Efficiency, <code>cc -O2</code>, 200 triệu phép sin×cos chia đều cho các luồng, chạy 2 lượt):</p>
<table>
<tr><th>Số luồng</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>8</th><th>10</th></tr>
<tr><td>Tăng tốc (lượt 1)</td><td>1,00</td><td>1,99</td><td>2,96</td><td>3,90</td><td>4,87</td><td>4,15</td><td>6,89</td><td>7,06</td></tr>
<tr><td>Tăng tốc (lượt 2)</td><td>1,00</td><td>1,98</td><td>2,91</td><td>3,87</td><td>4,81</td><td>5,62</td><td>6,58</td><td>6,67</td></tr>
</table>
<p class="dap-an">✅ Khớp ngược Amdahl vào điểm 8 luồng: f = (1 − 1/6,89)/(1 − 1/8) = <strong>0,977</strong>, tức khoảng <strong>2,3% của một chương trình song song tuyệt đối vẫn cư xử như mã tuần tự</strong> — tạo luồng, chờ luồng, và chuyện vài luồng về đích muộn. Ngay cả một vòng lặp không chia sẻ dữ liệu gì cũng KHÔNG chạm được đường lý tưởng.</p>
<p class="pitfall">⚠️ Đồ thị (b) là nửa sinh viên hay quên, và nó <em>KHÔNG PHẢI</em> Amdahl. Đường Amdahl tăng đơn điệu — bẹt dần nhưng không bao giờ tụt. Đường (b) <strong>TỤT XUỐNG</strong> sau đỉnh vì nó cộng thêm một khoản <em>chi phí truyền tin/đồng bộ TĂNG THEO N</em>. Thông điệp thật: quá một ngưỡng số lõi, thêm lõi làm chương trình <strong>CHẬM ĐI</strong>. Bảng đo ở trên đã le lói dấu hiệu đó — 6 luồng ở lượt 1 chỉ được 4,15, <em>tệ hơn</em> 5 luồng.</p>`],

      [5, 'Figure 21.4 — Scaling of Database Workloads on Multiple-Processor Hardware',
        `<p class="y-chinh">🎯 The optimistic counterweight to slide 4. Scaling plotted from 0 to <strong>64 processors</strong> for four real database workloads, all of them hugging the dashed "<strong>perfect scaling</strong>" diagonal: <em>Oracle DSS 4-way join</em>, <em>TMC data mining</em>, <em>DB2 DSS scan &amp; aggs</em>, and — lowest of the four — <em>Oracle ad hoc insurance OLTP</em>.</p>
<ul>
<li><strong>Read the ranking, it is the lesson.</strong> The three <em>decision-support / data-mining</em> workloads scale almost perfectly, because a big scan or a big join splits into independent chunks with almost nothing shared. The <em>OLTP</em> workload trails: online transaction processing means many small transactions contending for the same rows, the same locks, the same log. <strong>Sharing is what costs you, not the core count.</strong></li>
<li><strong>Why databases are the textbook success story of multicore.</strong> The query optimiser already knows the whole plan before execution, so it can partition the work itself. The programmer writes ordinary SQL and gets 50× on 64 cores without ever typing the word "thread" — which is exactly the "multi-threaded native application" category of slide 6.</li>
<li><strong>Look at where the curves sit at 64.</strong> Roughly 52–62 out of a theoretical 64. Put that through Amdahl backwards: reaching 52× on 64 cores needs f = (1 − 1/52)/(1 − 1/64) ≈ 0,996, i.e. <strong>under half a percent sequential</strong>. That is how demanding near-perfect scaling actually is — and why it is a headline-worthy result rather than the norm.</li>
</ul>
<p class="nhan">📐 <strong>Amdahl versus Gustafson — the reason this figure does not contradict slide 4.</strong> Neither Gustafson's name nor his formula appears anywhere in this deck; this comes from the wider literature, but it is the only honest way to reconcile the two slides. <strong>Amdahl fixes the problem size</strong> and asks how much faster N cores finish it: <code>S = 1/((1−f) + f/N)</code>. <strong>Gustafson lets the problem grow with N</strong> — you buy 64 cores to run a <em>bigger</em> query, not the same one faster: <code>S = (1 − f) + f·N</code>.</p>
<table>
<tr><th>f = 0,95</th><th>N=2</th><th>N=4</th><th>N=8</th><th>N=16</th><th>N=64</th><th>N=256</th></tr>
<tr><td><strong>Amdahl</strong> (same problem)</td><td>1,95</td><td>3,48</td><td>5,93</td><td>9,14</td><td>15,42</td><td>18,62</td></tr>
<tr><td><strong>Gustafson</strong> (problem grows)</td><td>1,95</td><td>3,85</td><td>7,65</td><td>15,25</td><td><strong>60,85</strong></td><td><strong>243,25</strong></td></tr>
</table>
<p class="dap-an">✅ Same f = 0,95, same 64 cores, two answers: <strong>15,42× or 60,85×</strong>. Neither is wrong — they answer different questions. Amdahl says "a fixed job has a ceiling"; Gustafson says "a growing job does not, because the sequential part stays the same size while the parallel part grows". A database serving 64× more queries is a Gustafson situation, which is why Figure 21.4 looks so much better than Figure 21.3.</p>
<p class="pitfall">⚠️ Exam trap: do not quote Gustafson's numbers for an Amdahl question. If the problem says "<em>the same program</em> on N processors", it is Amdahl and the answer has a ceiling. If it says "<em>a larger dataset</em> in the same time", it is Gustafson and the speedup is near-linear.</p>`,
        `<p class="y-chinh">🎯 Đối trọng LẠC QUAN cho slide 4. Đồ thị scaling từ 0 tới <strong>64 bộ xử lý</strong> cho bốn tải cơ sở dữ liệu THẬT, cả bốn bám sát đường chéo nét đứt "<strong>perfect scaling</strong>": <em>Oracle DSS 4-way join</em>, <em>TMC data mining</em>, <em>DB2 DSS scan &amp; aggs</em>, và — thấp nhất trong bốn — <em>Oracle ad hoc insurance OLTP</em>.</p>
<ul>
<li><strong>Đọc THỨ HẠNG, đó mới là bài học.</strong> Ba tải <em>hỗ trợ quyết định / khai phá dữ liệu</em> scaling gần như hoàn hảo, vì một lượt quét lớn hay một phép nối lớn chẻ ra thành các mẩu độc lập, gần như không chia sẻ gì. Tải <em>OLTP</em> thì lẹt đẹt phía sau: xử lý giao dịch trực tuyến nghĩa là rất nhiều giao dịch nhỏ TRANH nhau cùng những dòng dữ liệu, cùng những khoá, cùng cái nhật ký. <strong>Cái đắt là SỰ CHIA SẺ, không phải số lõi.</strong></li>
<li><strong>Vì sao cơ sở dữ liệu là câu chuyện thành công mẫu mực của đa lõi.</strong> Bộ tối ưu truy vấn đã biết trọn kế hoạch TRƯỚC khi chạy, nên nó tự phân hoạch công việc được. Lập trình viên viết SQL bình thường mà được 50× trên 64 lõi, không hề gõ chữ "thread" nào — đúng là hạng "multi-threaded native application" của slide 6.</li>
<li><strong>Nhìn xem các đường nằm ở đâu tại mốc 64.</strong> Cỡ 52–62 trên lý thuyết 64. Đưa qua Amdahl ngược: đạt 52× trên 64 lõi cần f = (1 − 1/52)/(1 − 1/64) ≈ 0,996, tức <strong>phần tuần tự dưới NỬA phần trăm</strong>. Đòi hỏi của scaling gần-hoàn-hảo khắt khe đến thế — và vì thế nó là kết quả đáng lên tiêu đề chứ không phải chuyện thường ngày.</li>
</ul>
<p class="nhan">📐 <strong>Amdahl so với Gustafson — lý do hình này KHÔNG mâu thuẫn với slide 4.</strong> Cả tên lẫn công thức Gustafson đều KHÔNG xuất hiện ở bất kỳ slide nào của deck này; phần dưới lấy từ tài liệu rộng hơn, nhưng đó là cách thành thật duy nhất để hoà giải hai slide. <strong>Amdahl GIỮ NGUYÊN kích thước bài toán</strong> rồi hỏi N lõi làm xong nhanh hơn bao nhiêu: <code>S = 1/((1−f) + f/N)</code>. <strong>Gustafson cho bài toán TO RA theo N</strong> — bạn mua 64 lõi để chạy một truy vấn <em>LỚN HƠN</em>, chứ không phải chạy đúng truy vấn cũ nhanh hơn: <code>S = (1 − f) + f·N</code>.</p>
<table>
<tr><th>f = 0,95</th><th>N=2</th><th>N=4</th><th>N=8</th><th>N=16</th><th>N=64</th><th>N=256</th></tr>
<tr><td><strong>Amdahl</strong> (bài toán cố định)</td><td>1,95</td><td>3,48</td><td>5,93</td><td>9,14</td><td>15,42</td><td>18,62</td></tr>
<tr><td><strong>Gustafson</strong> (bài toán to ra)</td><td>1,95</td><td>3,85</td><td>7,65</td><td>15,25</td><td><strong>60,85</strong></td><td><strong>243,25</strong></td></tr>
</table>
<p class="dap-an">✅ Cùng f = 0,95, cùng 64 lõi, hai đáp số: <strong>15,42× hay 60,85×</strong>. Không cái nào sai — chúng trả lời hai câu hỏi khác nhau. Amdahl bảo "việc cố định thì có trần"; Gustafson bảo "việc lớn dần thì không, vì phần tuần tự giữ nguyên kích thước trong khi phần song song phình ra". Một cơ sở dữ liệu phục vụ gấp 64 lần truy vấn là tình huống Gustafson, và đó là lý do Figure 21.4 trông đẹp hơn hẳn Figure 21.3.</p>
<p class="pitfall">⚠️ Bẫy đề thi: đừng bê số của Gustafson vào câu hỏi Amdahl. Đề nói "<em>CÙNG một chương trình</em> trên N bộ xử lý" thì đó là Amdahl và đáp án có TRẦN. Đề nói "<em>tập dữ liệu LỚN HƠN</em> trong cùng thời gian" thì đó là Gustafson và tăng tốc gần như tuyến tính.</p>`],

      [6, 'Effective Applications for Multicore Processors',
        `<p class="y-chinh">🎯 Four categories of software that actually benefit from a multicore chip. The slide is a checklist: if your program is in none of these four boxes, extra cores do nothing for it.</p>
<table>
<tr><th>Category</th><th>Kind of parallelism</th><th>What the slide says characterises it</th></tr>
<tr><td><strong>Multi-threaded native applications</strong></td><td><strong>Thread-level</strong> parallelism</td><td>Having a <em>small number of highly threaded processes</em></td></tr>
<tr><td><strong>Multi-process applications</strong></td><td><strong>Process-level</strong> parallelism</td><td>The presence of <em>many single-threaded processes</em></td></tr>
<tr><td><strong>Java applications</strong></td><td>Threading "in a fundamental way"</td><td>The JVM is itself a multi-threaded process that provides scheduling and memory management for Java applications</td></tr>
<tr><td><strong>Multi-instance applications</strong></td><td>Isolation via <em>virtualization</em></td><td>If multiple application instances require some degree of isolation, virtualization gives each its own separate and secure environment</td></tr>
</table>
<ul>
<li><strong>The first two are opposites, and the contrast is the point.</strong> "A small number of highly threaded processes" is one program deliberately written to split its own work — a database engine, a game engine, a video encoder. "Many single-threaded processes" is the opposite: nobody parallelised anything, there just happen to be dozens of independent programs running. A web server forking one process per request lands in this second box and scales beautifully <em>without anyone writing thread code</em>.</li>
<li><strong>Why Java gets its own line.</strong> You do not have to write threads to get them: the JVM runs the garbage collector, the JIT compiler and the finalizers on their own threads. So even a single-threaded Java program keeps two or three cores mildly busy. This is the chapter's example of a <em>runtime</em> providing parallelism the programmer did not ask for.</li>
<li><strong>Multi-instance is the cloud, described in 2010s language.</strong> Instead of making one program parallel, run many copies, each isolated in a VM or container. The parallelism is at the level of the <em>customer</em>, not the algorithm. This is how a 64-core server is actually sold today, and it is the one category where Amdahl never bites — separate instances share nothing.</li>
<li><strong>Connect to slide 4.</strong> Categories 2 and 4 have f effectively equal to 1 (no shared sequential section at all), which is why they scale like Figure 21.4. Category 1 has the real fight — that is where locks, barriers and cache coherence traffic drag f below 1.</li>
</ul>
<p class="meo">💡 One-line memory aid: <strong>one program many threads · many programs one thread each · the JVM does it for you · many copies in boxes</strong>.</p>`,
        `<p class="y-chinh">🎯 Bốn hạng phần mềm THẬT SỰ hưởng lợi từ chip đa lõi. Slide này là một danh sách kiểm: chương trình của bạn không nằm trong bốn ô này thì thêm lõi cũng chẳng để làm gì.</p>
<table>
<tr><th>Hạng</th><th>Loại song song</th><th>Slide nói đặc trưng của nó là gì</th></tr>
<tr><td><strong>Ứng dụng đa luồng thuần (multi-threaded native)</strong></td><td>Song song <strong>mức LUỒNG</strong></td><td>Có <em>MỘT SỐ ÍT tiến trình nhưng rất nhiều luồng</em></td></tr>
<tr><td><strong>Ứng dụng đa tiến trình (multi-process)</strong></td><td>Song song <strong>mức TIẾN TRÌNH</strong></td><td>Có <em>RẤT NHIỀU tiến trình, mỗi cái một luồng</em></td></tr>
<tr><td><strong>Ứng dụng Java</strong></td><td>Ôm lấy đa luồng "một cách nền tảng"</td><td>Bản thân JVM là một tiến trình đa luồng, lo lập lịch và quản lý bộ nhớ cho ứng dụng Java</td></tr>
<tr><td><strong>Ứng dụng đa thể hiện (multi-instance)</strong></td><td>Cách ly bằng <em>ẢO HOÁ</em></td><td>Nếu nhiều thể hiện cần cách ly ở mức nào đó, công nghệ ảo hoá cho mỗi cái một môi trường riêng và an toàn</td></tr>
</table>
<ul>
<li><strong>Hai hạng đầu NGƯỢC NHAU, và chính sự tương phản đó là ý.</strong> "Ít tiến trình nhưng nhiều luồng" là một chương trình CỐ Ý viết để tự chẻ việc của mình — engine cơ sở dữ liệu, engine game, bộ mã hoá video. "Nhiều tiến trình một luồng" thì ngược hẳn: chẳng ai song song hoá gì cả, chỉ là tình cờ có hàng chục chương trình độc lập cùng chạy. Máy chủ web fork một tiến trình cho mỗi yêu cầu rơi vào ô thứ hai này và scaling rất đẹp <em>mà không ai phải viết mã luồng</em>.</li>
<li><strong>Vì sao Java được một dòng riêng.</strong> Bạn không cần viết luồng vẫn có luồng: JVM chạy bộ thu gom rác, trình biên dịch JIT và các finalizer trên những luồng riêng của nó. Nên kể cả một chương trình Java một luồng cũng làm hai ba lõi bận nhè nhẹ. Đây là ví dụ của chương về chuyện <em>MÔI TRƯỜNG CHẠY</em> cấp cho bạn tính song song mà lập trình viên không hề yêu cầu.</li>
<li><strong>Multi-instance chính là điện toán đám mây, diễn đạt bằng ngôn ngữ những năm 2010.</strong> Thay vì làm cho một chương trình song song, hãy chạy thật nhiều bản sao, mỗi bản cách ly trong một máy ảo hay container. Tính song song nằm ở mức <em>KHÁCH HÀNG</em>, không ở mức thuật toán. Máy chủ 64 lõi ngày nay được bán đúng theo kiểu đó, và đây là hạng duy nhất mà Amdahl không cắn nổi — các thể hiện riêng biệt chẳng chia sẻ gì.</li>
<li><strong>Nối về slide 4.</strong> Hạng 2 và hạng 4 có f coi như bằng 1 (không hề có đoạn tuần tự dùng chung), nên chúng scaling giống Figure 21.4. Hạng 1 mới là chỗ đánh nhau thật — đó là nơi khoá, rào chắn và lưu lượng nhất quán cache kéo f tụt xuống dưới 1.</li>
</ul>
<p class="meo">💡 Mẹo nhớ một dòng: <strong>một chương trình nhiều luồng · nhiều chương trình mỗi cái một luồng · JVM làm hộ · nhiều bản sao nhốt trong hộp</strong>.</p>`],
      [7, 'Threading Granularity',
        `<p class="y-chinh">🎯 Granularity is defined on the slide as <strong>"the minimal unit of work that can be beneficially parallelized"</strong>. The whole slide is one trade-off, stated twice — once in favour of fine grain, once against it.</p>
<table>
<tr><th>The slide's claim</th><th>Direction</th></tr>
<tr><td>The <strong>finer</strong> the granularity the system enables, the <strong>less constrained</strong> is the programmer in parallelizing a program</td><td>for fine</td></tr>
<tr><td><strong>Finer grain</strong> threading systems allow parallelization in <strong>more situations</strong> than coarse-grained ones</td><td>for fine</td></tr>
<tr><td>The finer grain systems are <strong>preferable because of the flexibility</strong> they afford to the programmer</td><td>for fine</td></tr>
<tr><td>The finer the threading granularity, the <strong>more significant part of the execution is taken by the threading system overhead</strong></td><td><strong>against fine</strong></td></tr>
</table>
<ul>
<li><strong>Note the word "beneficially" in the definition.</strong> It is not the smallest unit you <em>can</em> split — you can always split further — it is the smallest unit where splitting still <em>pays</em>. Below that size, the cost of handing work to another thread exceeds the work itself.</li>
<li><strong>The trade-off in one sentence.</strong> Fine grain buys <em>flexibility</em> (more of your program becomes parallelisable, so f in Amdahl goes up) and costs <em>overhead</em> (the constant per-task price eats the gain). The slide itself calls it "an inherent tradeoff" in the choice of a target granularity for an architecture.</li>
<li><strong>Where you meet it in code.</strong> Parallelising an outer loop over 1000 images = coarse grain, thousands of instructions per task, overhead invisible. Parallelising the innermost loop over 8 pixels = fine grain, a few instructions per task, and the thread handshake costs more than the pixels. Same program, same cores, opposite results.</li>
<li><strong>This is exactly why graph (b) of Figure 21.3 turns downward.</strong> Overhead that grows with the number of threads is the same overhead named here. Slide 7 gives the mechanism; slide 4 graph (b) gives the shape.</li>
<li><strong>It is an ARCHITECTURE decision, not just a programming one.</strong> The slide says the choice of <em>target granularity of an architecture</em> involves the trade-off — hardware support (fast thread spawn, hardware queues, cheap synchronisation) is what lets a machine profit from finer grain. The TI chip on slide 14 ships a hardware "Queue Manager" for precisely this reason.</li>
</ul>
<p class="meo">💡 Remember it as a shipping analogy: <strong>fine grain = many tiny parcels</strong> — flexible, but you pay postage on every one. <strong>Coarse grain = few big crates</strong> — cheap per item, but you cannot split a crate between two trucks.</p>`,
        `<p class="y-chinh">🎯 Slide định nghĩa độ mịn (granularity) là <strong>"đơn vị công việc NHỎ NHẤT mà song song hoá vẫn CÓ LỢI"</strong>. Cả slide chỉ là MỘT sự đánh đổi, nói hai lần — một lần bênh vực grain mịn, một lần chống lại nó.</p>
<table>
<tr><th>Khẳng định của slide</th><th>Nghiêng về</th></tr>
<tr><td>Hệ thống cho phép grain càng <strong>MỊN</strong> thì lập trình viên càng <strong>ÍT BỊ TRÓI</strong> khi song song hoá chương trình</td><td>bênh mịn</td></tr>
<tr><td>Hệ đa luồng <strong>grain mịn</strong> cho song song hoá được trong <strong>NHIỀU TÌNH HUỐNG HƠN</strong> hệ grain thô</td><td>bênh mịn</td></tr>
<tr><td>Hệ grain mịn <strong>ĐÁNG CHUỘNG HƠN vì sự linh hoạt</strong> nó dành cho lập trình viên</td><td>bênh mịn</td></tr>
<tr><td>Grain càng mịn thì <strong>phần thời gian chạy bị CHI PHÍ HỆ ĐA LUỒNG ngốn mất càng lớn</strong></td><td><strong>chống mịn</strong></td></tr>
</table>
<ul>
<li><strong>Để ý chữ "CÓ LỢI" trong định nghĩa.</strong> Nó không phải đơn vị nhỏ nhất bạn <em>CÓ THỂ</em> chẻ — chẻ nữa lúc nào chả được — mà là đơn vị nhỏ nhất mà chẻ ra vẫn <em>LỜI</em>. Nhỏ hơn mức đó thì cái giá của việc giao việc cho luồng khác đã lớn hơn chính công việc ấy.</li>
<li><strong>Sự đánh đổi trong một câu.</strong> Grain mịn mua được <em>SỰ LINH HOẠT</em> (nhiều phần chương trình song song hoá được hơn, nên f trong Amdahl tăng lên) và trả bằng <em>CHI PHÍ QUẢN LÝ</em> (cái giá cố định trên mỗi tác vụ ăn hết phần lời). Chính slide gọi đây là "một đánh đổi cố hữu" khi chọn độ mịn mục tiêu cho một kiến trúc.</li>
<li><strong>Bạn gặp nó ở đâu trong mã.</strong> Song song hoá vòng lặp ngoài chạy qua 1000 tấm ảnh = grain THÔ, mỗi tác vụ hàng nghìn lệnh, chi phí quản lý tàng hình. Song song hoá vòng lặp trong cùng chạy qua 8 điểm ảnh = grain MỊN, mỗi tác vụ vài lệnh, và cái bắt tay giữa các luồng còn tốn hơn mấy điểm ảnh đó. Cùng chương trình, cùng số lõi, kết quả ngược nhau.</li>
<li><strong>Đây đúng là lý do đồ thị (b) của Figure 21.3 quay đầu đi xuống.</strong> Khoản chi phí tăng theo số luồng chính là khoản được gọi tên ở đây. Slide 7 cho CƠ CHẾ; đồ thị (b) của slide 4 cho HÌNH DÁNG.</li>
<li><strong>Đây là quyết định KIẾN TRÚC, không chỉ là chuyện lập trình.</strong> Slide nói việc chọn <em>độ mịn mục tiêu CỦA MỘT KIẾN TRÚC</em> kéo theo đánh đổi này — hỗ trợ phần cứng (tạo luồng nhanh, hàng đợi phần cứng, đồng bộ rẻ) mới là thứ cho một cỗ máy kiếm lời từ grain mịn hơn. Con chip TI ở slide 14 gắn hẳn một "Queue Manager" phần cứng đúng vì lý do đó.</li>
</ul>
<p class="meo">💡 Nhớ bằng phép ví chuyển hàng: <strong>grain mịn = nhiều kiện nhỏ xíu</strong> — linh hoạt, nhưng kiện nào cũng phải trả cước. <strong>Grain thô = ít thùng to</strong> — rẻ trên mỗi món, nhưng không chẻ một cái thùng cho hai xe tải được.</p>`],

      [8, 'Figure 21.5 — Hybrid Threading for Rendering Module (the Valve game engine example)',
        `<p class="y-chinh">🎯 A real threading tree from Valve's Source engine rendering module. Root <strong>Render</strong> forks into <strong>Skybox · Main View · Monitor · Etc.</strong>; Main View leads to <strong>Scene List</strong>, then <strong>For each object</strong>, which fans out into <strong>Particles</strong> (→ Sim and Draw), <strong>Character</strong> (→ Bone Setup, → Draw), and <strong>Etc.</strong></p>
<ul>
<li><strong>Why "hybrid".</strong> The tree mixes two styles at once. Near the root it is <em>coarse-grained functional</em> decomposition — Skybox, Main View and Monitor are <em>different kinds of work</em> done in parallel. Near the leaves it is <em>fine-grained data</em> decomposition — "For each object" is the same work repeated over many objects. Neither style alone would fill the cores; together they do.</li>
<li><strong>Read it as an answer to slide 7.</strong> The engine does not pick one granularity; it picks coarse at the top (cheap to split, few tasks) and fine at the bottom (many tasks, but only where there is enough of them to amortise the overhead). That is what "hybrid" means in practice.</li>
<li><strong>The shape tells you the maximum parallelism.</strong> The width of the tree at each level is how many cores can be busy at that moment. Notice the neck: everything below Main View passes through a single <strong>Scene List</strong> node. That serialisation point is exactly the (1 − f) of Amdahl made visible — you cannot start drawing objects before you know which objects are in the scene.</li>
<li><strong>Why a game is the textbook case.</strong> A frame must finish in about 16 ms; there is no option to "run it overnight on more data", so it is an <strong>Amdahl</strong> problem, not a Gustafson one. Fixed deadline, fixed work, hard ceiling — which is why game engines fight so hard for every parallel branch in this diagram.</li>
<li><strong>Category check.</strong> This is slide 6's first box: a <em>small number of highly threaded processes</em>. One process, a deliberate thread tree inside it. Compare with a web server, which gets the same effect for free with many single-threaded processes.</li>
</ul>
<p class="pitfall">⚠️ The diagram shows the <em>task</em> tree, not the <em>thread</em> tree. Real engines do not spawn one OS thread per box — they push these boxes as tasks into a pool of N worker threads, where N matches the core count. Confusing "task" with "thread" is a common exam slip: tasks are logical units of work, threads are the scarce hardware-backed resources that execute them.</p>`,
        `<p class="y-chinh">🎯 Một cây phân luồng THẬT từ module dựng hình của engine Source (Valve). Gốc <strong>Render</strong> chẻ thành <strong>Skybox · Main View · Monitor · Etc.</strong>; Main View dẫn xuống <strong>Scene List</strong>, rồi <strong>For each object</strong>, từ đó toả ra <strong>Particles</strong> (→ Sim and Draw), <strong>Character</strong> (→ Bone Setup, → Draw), và <strong>Etc.</strong></p>
<ul>
<li><strong>Vì sao gọi là "lai" (hybrid).</strong> Cái cây trộn HAI kiểu cùng lúc. Gần gốc là phân rã <em>THEO CHỨC NĂNG, grain THÔ</em> — Skybox, Main View, Monitor là những <em>LOẠI việc KHÁC NHAU</em> làm song song. Gần lá là phân rã <em>THEO DỮ LIỆU, grain MỊN</em> — "For each object" là CÙNG một việc lặp trên nhiều đối tượng. Chỉ một kiểu thôi thì không lấp đầy được các lõi; hai kiểu cùng nhau thì lấp được.</li>
<li><strong>Đọc nó như câu trả lời cho slide 7.</strong> Engine KHÔNG chọn một độ mịn duy nhất; nó chọn THÔ ở trên (chẻ rẻ, ít tác vụ) và MỊN ở dưới (nhiều tác vụ, nhưng chỉ ở chỗ nào đủ nhiều để bù lại chi phí). "Lai" trong thực tế nghĩa là như thế.</li>
<li><strong>Hình dáng cái cây cho biết mức song song TỐI ĐA.</strong> Bề rộng của cây ở mỗi tầng chính là số lõi có thể bận vào lúc đó. Để ý cái CỔ CHAI: mọi thứ dưới Main View đều phải chui qua một nút <strong>Scene List</strong> duy nhất. Điểm tuần tự hoá đó chính là (1 − f) của Amdahl hiện hình — không thể bắt đầu vẽ các đối tượng trước khi biết cảnh có những đối tượng nào.</li>
<li><strong>Vì sao game là ca mẫu mực.</strong> Một khung hình phải xong trong khoảng 16 ms; không có lựa chọn "để nó chạy qua đêm trên dữ liệu lớn hơn", nên đây là bài toán <strong>AMDAHL</strong>, không phải Gustafson. Hạn chót cố định, khối lượng việc cố định, trần cứng — và đó là lý do các engine game giành giật từng nhánh song song trong sơ đồ này.</li>
<li><strong>Kiểm hạng.</strong> Đây là ô thứ nhất của slide 6: <em>ít tiến trình nhưng rất nhiều luồng</em>. Một tiến trình, bên trong là một cây luồng dựng có chủ đích. So với máy chủ web — nó được cùng hiệu quả ấy MIỄN PHÍ nhờ nhiều tiến trình một luồng.</li>
</ul>
<p class="pitfall">⚠️ Sơ đồ vẽ cây <em>TÁC VỤ</em>, không phải cây <em>LUỒNG</em>. Engine thật KHÔNG tạo một luồng hệ điều hành cho mỗi cái ô — nó đẩy các ô này thành tác vụ vào một bể N luồng thợ, với N bằng số lõi. Lẫn "tác vụ" với "luồng" là lỗi rất hay gặp khi thi: tác vụ là đơn vị công việc LOGIC, luồng là tài nguyên khan hiếm có phần cứng đỡ lưng để thực thi chúng.</p>`],

      [9, 'Figure 21.6 — Multicore Organization Alternatives (the four cache layouts)',
        `<p class="y-chinh">🎯 The single most examinable figure in the chapter: <strong>four ways to arrange cache on a multicore chip</strong>, drawn as (a) Dedicated L1 cache, (b) Dedicated L2 cache, (c) Shared L2 cache, (d) Shared L3 cache. In every panel each core keeps its own <strong>L1-D and L1-I</strong> — what changes is everything below that.</p>
<table>
<tr><th></th><th>(a) Dedicated L1</th><th>(b) Dedicated L2</th><th>(c) Shared L2</th><th>(d) Shared L3</th></tr>
<tr><td><strong>Private per core</strong></td><td>L1-D, L1-I only</td><td>L1 + <strong>L2</strong></td><td>L1 only</td><td>L1 + <strong>L2</strong></td></tr>
<tr><td><strong>Shared on chip</strong></td><td>L2 (off the core cluster)</td><td>nothing — straight to main memory</td><td><strong>L2</strong></td><td><strong>L3</strong></td></tr>
<tr><td><strong>Main advantage</strong></td><td>simple; one big L2 to amortise</td><td>each core gets full L2 bandwidth and no interference from neighbours</td><td>one core can use the whole L2 when others are idle; shared data stored <em>once</em></td><td>best of both: private fast L2 + a big shared last level</td></tr>
<tr><td><strong>Main drawback</strong></td><td>L2 is far and contended by every core</td><td>shared data is <strong>duplicated</strong> in several L2s; wastes capacity</td><td>cores interfere with each other (one thrashing core evicts everyone)</td><td>most transistors, most latency levels, most complex</td></tr>
<tr><td><strong>Coherence needed at</strong></td><td>L1 level only</td><td>L1 <em>and</em> L2 — the hard case</td><td>L1 level only (L2 is a single copy)</td><td>L1 and L2</td></tr>
<tr><td><strong>Seen in</strong></td><td>early dual-core parts</td><td>early AMD/Intel dual cores</td><td>ARM Cortex-A15 MPCore (slide 22)</td><td><strong>Intel Core i7-5960X (slide 21)</strong>, IBM z13 (slide 29, which goes further to L4)</td></tr>
</table>
<ul>
<li><strong>The one principle behind all four rows.</strong> <em>Private = fast and predictable but wasteful; shared = efficient and coherent but contended.</em> Every real chip resolves it the same way: private at the levels where latency matters (L1, often L2), shared at the level where capacity matters (last level).</li>
<li><strong>Why (b) is the coherence nightmare.</strong> If two cores both cache the same line in their <em>private</em> L2, a write by one must be seen by the other — and there is no common point below to arbitrate except main memory. That is where snooping and the MESI/MOESI machinery of slides 18–20 becomes unavoidable.</li>
<li><strong>Why (c) is attractive for a small core count.</strong> A shared L2 stores one copy of shared data instead of n, and a single core running alone can use the entire L2 — dynamic allocation for free. It stops scaling when the number of cores makes the shared port a bottleneck, which is why large chips go to (d).</li>
<li><strong>Connect back to slide 3.</strong> Cache has low power density, so the shared last level is where a chip can safely spend its remaining transistor budget. 20 MB of L3 on the i7 is not generosity, it is the cheapest legal way to use the silicon.</li>
<li><strong>Connect back to Ch.4–5.</strong> Everything you learned about hit ratio, block size and replacement still applies unchanged <em>per level</em>; multicore only adds the question of <em>who</em> owns each level.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: L1 is <strong>always private per core</strong> in all four panels. A question offering "shared L1" as an option is offering a wrong answer — L1 must be one cycle away from its own pipeline, and you cannot do that with a cache several cores away.</p>`,
        `<p class="y-chinh">🎯 Hình đáng thi nhất chương: <strong>bốn cách bố trí cache trên một chip đa lõi</strong>, vẽ thành (a) L1 riêng, (b) L2 riêng, (c) L2 DÙNG CHUNG, (d) L3 DÙNG CHUNG. Ở CẢ BỐN ô, mỗi lõi đều giữ <strong>L1-D và L1-I</strong> của riêng nó — thứ thay đổi là mọi tầng bên dưới.</p>
<table>
<tr><th></th><th>(a) L1 riêng</th><th>(b) L2 riêng</th><th>(c) L2 dùng chung</th><th>(d) L3 dùng chung</th></tr>
<tr><td><strong>Riêng mỗi lõi</strong></td><td>chỉ L1-D, L1-I</td><td>L1 + <strong>L2</strong></td><td>chỉ L1</td><td>L1 + <strong>L2</strong></td></tr>
<tr><td><strong>Dùng chung trên chip</strong></td><td>L2 (nằm ngoài cụm lõi)</td><td>không có gì — xuống thẳng bộ nhớ chính</td><td><strong>L2</strong></td><td><strong>L3</strong></td></tr>
<tr><td><strong>Lợi chính</strong></td><td>đơn giản; một L2 to dùng chung nên bù được chi phí</td><td>mỗi lõi hưởng trọn băng thông L2, không bị hàng xóm quấy</td><td>một lõi dùng được CẢ L2 khi lõi khác rảnh; dữ liệu dùng chung chỉ lưu <em>MỘT BẢN</em></td><td>được cả hai: L2 riêng nhanh + tầng cuối dùng chung to</td></tr>
<tr><td><strong>Hại chính</strong></td><td>L2 ở xa và bị mọi lõi tranh</td><td>dữ liệu dùng chung bị <strong>NHÂN BẢN</strong> trong nhiều L2; phí dung lượng</td><td>các lõi quấy nhau (một lõi quét loạn là đuổi hết đồ của cả đám)</td><td>tốn transistor nhất, nhiều tầng độ trễ nhất, phức tạp nhất</td></tr>
<tr><td><strong>Cần nhất quán ở đâu</strong></td><td>chỉ mức L1</td><td>CẢ L1 <em>VÀ</em> L2 — ca khó nhất</td><td>chỉ mức L1 (L2 chỉ có một bản)</td><td>L1 và L2</td></tr>
<tr><td><strong>Thấy ở đâu</strong></td><td>các chip hai lõi đời đầu</td><td>AMD/Intel hai lõi đời đầu</td><td>ARM Cortex-A15 MPCore (slide 22)</td><td><strong>Intel Core i7-5960X (slide 21)</strong>, IBM z13 (slide 29, còn đi xa tới L4)</td></tr>
</table>
<ul>
<li><strong>Một nguyên lý đứng sau cả bốn cột.</strong> <em>RIÊNG = nhanh và đoán được nhưng lãng phí; CHUNG = tiết kiệm và dễ nhất quán nhưng bị tranh.</em> Mọi con chip thật đều giải bài này theo cùng một cách: RIÊNG ở những tầng mà ĐỘ TRỄ quyết định (L1, thường cả L2), CHUNG ở tầng mà DUNG LƯỢNG quyết định (tầng cuối).</li>
<li><strong>Vì sao (b) là cơn ác mộng nhất quán.</strong> Nếu hai lõi cùng đệm một dòng trong L2 <em>RIÊNG</em> của mình, một lõi ghi thì lõi kia phải thấy — mà bên dưới không còn điểm chung nào để phân xử ngoài bộ nhớ chính. Đó là nơi cơ chế snoop và bộ máy MESI/MOESI của slide 18–20 trở thành BẮT BUỘC.</li>
<li><strong>Vì sao (c) hấp dẫn khi ít lõi.</strong> L2 dùng chung lưu MỘT bản dữ liệu chia sẻ thay vì n bản, và một lõi chạy một mình được dùng trọn L2 — cấp phát động miễn phí. Nó hết scaling khi số lõi làm cái cổng dùng chung thành nút thắt, và đó là lúc chip lớn chuyển sang (d).</li>
<li><strong>Nối ngược về slide 3.</strong> Cache có mật độ công suất THẤP, nên tầng cuối dùng chung là chỗ an toàn để chip tiêu nốt ngân sách transistor. 20 MB L3 trên con i7 không phải sự hào phóng, đó là cách hợp pháp RẺ NHẤT để xài hết miếng silic.</li>
<li><strong>Nối ngược về Ch.4–5.</strong> Mọi thứ bạn học về tỉ lệ trúng, kích thước khối, chính sách thay thế vẫn đúng y nguyên <em>CHO TỪNG TẦNG</em>; đa lõi chỉ thêm vào câu hỏi <em>AI</em> sở hữu mỗi tầng.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: L1 <strong>LUÔN LUÔN riêng cho từng lõi</strong> ở cả bốn ô. Câu hỏi nào chào bạn phương án "L1 dùng chung" là đang chào một đáp án SAI — L1 phải cách pipeline của chính nó đúng một chu kỳ, mà cache nằm cách vài lõi thì không làm được điều đó.</p>`],

      [10, 'Heterogeneous Multicore Organization',
        `<p class="y-chinh">🎯 The pivot of the chapter. Everything so far assumed all cores are identical; from here on they are not. The slide's four panels define the idea and name the dominant case.</p>
<table>
<tr><th>Panel</th><th>What it says (read from the slide)</th></tr>
<tr><td>1</td><td>Refers to a processor chip that includes <strong>more than one kind of core</strong></td></tr>
<tr><td>2</td><td>The most prominent trend is the use of <strong>both CPUs and graphics processing units (GPUs) on the same chip</strong> — this mix however presents issues of <strong>coordination and correctness</strong></td></tr>
<tr><td>3</td><td>GPUs are characterized by the ability to support <strong>thousands of parallel execution trends</strong></td></tr>
<tr><td>4</td><td>Thus, GPUs are well matched to applications that process <strong>large amounts of vector and matrix data</strong></td></tr>
</table>
<ul>
<li><strong>Why heterogeneity happens at all.</strong> Once you accept the power wall of slide 3, the next question is not "how many cores" but "<em>what kind</em> of cores". A core tuned for latency on one thread and a core tuned for throughput on thousands of threads are different machines; a chip that has to do both work types is better off carrying both.</li>
<li><strong>Read panel 2's second half — it is the whole cost.</strong> "Issues of coordination and correctness" means: two kinds of core with different memory models, different caches and different address translation must still agree about what is in memory. That problem is what slide 13 (HSA) exists to solve.</li>
<li><strong>The two flavours of heterogeneity, named later in the chapter.</strong> (i) <strong>Different instruction set architectures</strong> — CPU + GPU, or the ARM + DSP chip on slide 14; the two kinds cannot run each other's code at all. (ii) <strong>Equivalent instruction set architectures</strong> — ARM big.Little on slides 15–17, where every core runs the same binary but at different power/performance points. The summary slide 30 lists exactly these two headings.</li>
<li><strong>Typo watch.</strong> Panel 3 as printed reads "thousands of parallel execution <em>trends</em>" — the intended word is <strong>threads</strong>. Do not memorise the typo; the sentence only makes sense with "threads".</li>
<li><strong>This is not exotic hardware.</strong> The machine this lesson is written on reports <code>hw.perflevel0.physicalcpu = 8</code> (Performance cores) and <code>hw.perflevel1.physicalcpu = 2</code> (Efficiency cores) — a heterogeneous multicore with equivalent ISAs, plus an integrated GPU on the same die, which is the "different ISA" case as well. Both flavours, one laptop.</li>
</ul>
<p class="meo">💡 Frame the rest of the chapter as three questions about heterogeneity: <strong>can the cores run the same code?</strong> (equivalent vs different ISA) · <strong>can they see the same memory?</strong> (HSA, slide 13) · <strong>can they agree on what is in that memory?</strong> (cache coherence, slides 18–20).</p>`,
        `<p class="y-chinh">🎯 Bản lề của cả chương. Từ đầu tới giờ ta mặc định mọi lõi giống hệt nhau; từ đây trở đi thì KHÔNG. Bốn ô của slide định nghĩa ý tưởng và gọi tên ca phổ biến nhất.</p>
<table>
<tr><th>Ô</th><th>Slide viết gì (đọc từ ảnh)</th></tr>
<tr><td>1</td><td>Chỉ một con chip bộ xử lý chứa <strong>NHIỀU HƠN MỘT LOẠI LÕI</strong></td></tr>
<tr><td>2</td><td>Xu hướng nổi bật nhất là dùng <strong>cả CPU lẫn bộ xử lý đồ hoạ (GPU) trên CÙNG một chip</strong> — nhưng hỗn hợp này đặt ra <strong>vấn đề phối hợp và tính đúng đắn</strong></td></tr>
<tr><td>3</td><td>GPU có đặc trưng là đỡ được <strong>hàng NGHÌN luồng thực thi song song</strong></td></tr>
<tr><td>4</td><td>Vì thế GPU rất hợp với ứng dụng xử lý <strong>khối lượng lớn dữ liệu vector và ma trận</strong></td></tr>
</table>
<ul>
<li><strong>Vì sao lại sinh ra sự không đồng nhất.</strong> Một khi đã chấp nhận bức tường công suất ở slide 3 thì câu hỏi kế tiếp không phải "bao nhiêu lõi" mà là "lõi <em>LOẠI GÌ</em>". Một lõi tối ưu cho ĐỘ TRỄ của một luồng và một lõi tối ưu cho THÔNG LƯỢNG của hàng nghìn luồng là hai cỗ máy khác nhau; con chip nào phải làm cả hai loại việc thì mang cả hai loại lõi vẫn hơn.</li>
<li><strong>Đọc kỹ nửa sau của ô 2 — đó là toàn bộ CÁI GIÁ.</strong> "Vấn đề phối hợp và tính đúng đắn" nghĩa là: hai loại lõi với mô hình bộ nhớ khác nhau, cache khác nhau, dịch địa chỉ khác nhau vẫn phải THỐNG NHẤT với nhau về nội dung bộ nhớ. Bài toán đó chính là lý do slide 13 (HSA) tồn tại.</li>
<li><strong>Hai vị của sự không đồng nhất, chương này đặt tên ở phần sau.</strong> (i) <strong>KHÁC kiến trúc tập lệnh</strong> — CPU + GPU, hoặc con chip ARM + DSP ở slide 14; hai loại không chạy nổi mã của nhau. (ii) <strong>TƯƠNG ĐƯƠNG kiến trúc tập lệnh</strong> — ARM big.Little ở slide 15–17, mọi lõi chạy cùng một bản nhị phân nhưng ở những điểm công suất/hiệu năng khác nhau. Slide tổng kết 30 liệt kê đúng hai đề mục này.</li>
<li><strong>Canh lỗi chính tả.</strong> Ô 3 in là "thousands of parallel execution <em>trends</em>" — chữ đúng phải là <strong>threads</strong> (luồng). Đừng học thuộc cái lỗi ấy; câu chỉ có nghĩa với "threads".</li>
<li><strong>Đây KHÔNG phải phần cứng kỳ dị.</strong> Chính cái máy viết bài này báo <code>hw.perflevel0.physicalcpu = 8</code> (lõi Performance) và <code>hw.perflevel1.physicalcpu = 2</code> (lõi Efficiency) — một chip đa lõi không đồng nhất kiểu ISA tương đương, cộng thêm GPU tích hợp trên cùng miếng đế, tức là có luôn cả ca "khác ISA". Cả hai vị, trong một cái laptop.</li>
</ul>
<p class="meo">💡 Hãy đóng khung phần còn lại của chương thành ba câu hỏi về sự không đồng nhất: <strong>các lõi có chạy được cùng mã không?</strong> (ISA tương đương hay khác nhau) · <strong>chúng có nhìn thấy cùng một bộ nhớ không?</strong> (HSA, slide 13) · <strong>chúng có thống nhất được nội dung bộ nhớ đó không?</strong> (nhất quán cache, slide 18–20).</p>`],

      [11, 'Figure 21.7 — Heterogenous Multicore Chip Elements',
        `<p class="y-chinh">🎯 The generic floor plan of a heterogeneous chip. Across the top: several <strong>CPU</strong> blocks and several <strong>GPU</strong> blocks, <em>each with its own Cache</em>. All of them hang off one <strong>On-Chip Interconnection Network</strong>. Below it: two <strong>DRAM Controllers</strong> at the edges and several <strong>Last-Level Cache</strong> banks in the middle.</p>
<ul>
<li><strong>The interconnect is the star, not the cores.</strong> Notice every arrow is double-headed and every block talks only to the network. This is the successor to the shared bus of Ch.3 — a bus cannot carry the traffic of a dozen heterogeneous masters, so it is replaced by a ring, mesh or crossbar. When a chapter says "scalability", this box is what it means.</li>
<li><strong>Last-level cache is BANKED, not one block.</strong> The figure draws several LLC boxes side by side. Splitting the last level into banks (usually by address) lets several cores hit different banks in the same cycle. Compare Figure 21.6(d) on slide 9, which drew the shared L3 as one rectangle — that was the logical view; this is the physical one.</li>
<li><strong>Two DRAM controllers, one at each end.</strong> Bandwidth, not capacity: a GPU eats memory bandwidth by the fistful, and one controller cannot feed it. Placing them at opposite edges of the network also shortens the worst-case path. Compare the i7 on slide 21: "4×8B @ 2.133 GT/s".</li>
<li><strong>Every core has its own cache — so coherence is mandatory here.</strong> The CPUs and GPUs each cache the same shared DRAM. If the CPU writes a matrix and the GPU reads a stale copy, the program is silently wrong. That is precisely the "issues of coordination and correctness" of slide 10, and the reason HSA (slide 13) insists on "a coherent memory policy".</li>
<li><strong>What this figure does NOT show.</strong> No clock frequencies, no core counts, no cache sizes — it is a template, not a product. Table 21.1 on the next slide is the same picture with real numbers attached.</li>
</ul>
<p class="meo">💡 Read the figure as a sentence: <em>many different kinds of master · each with a private cache · one network in the middle · shared banked cache and memory below</em>. Nearly every modern SoC block diagram, including slides 14, 21, 22 and 29, is that sentence redrawn.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ mặt bằng TỔNG QUÁT của một chip không đồng nhất. Hàng trên: mấy khối <strong>CPU</strong> và mấy khối <strong>GPU</strong>, <em>mỗi khối có Cache riêng</em>. Tất cả treo vào một <strong>Mạng liên kết trên chip (On-Chip Interconnection Network)</strong>. Bên dưới: hai <strong>DRAM Controller</strong> ở hai rìa và mấy ngăn <strong>Last-Level Cache</strong> ở giữa.</p>
<ul>
<li><strong>Ngôi sao là MẠNG LIÊN KẾT, không phải các lõi.</strong> Để ý mọi mũi tên đều hai đầu và mọi khối chỉ nói chuyện với cái mạng. Đây là hậu duệ của bus dùng chung ở Ch.3 — một cái bus không cõng nổi lưu lượng của cả chục chủ bus không đồng nhất, nên nó bị thay bằng vòng ring, lưới mesh hay crossbar. Khi một chương nói "khả năng mở rộng", chính cái ô này là thứ họ muốn nói.</li>
<li><strong>Cache tầng cuối được CHIA NGĂN, không phải một khối liền.</strong> Hình vẽ mấy ô LLC nằm cạnh nhau. Chẻ tầng cuối thành các ngăn (thường theo địa chỉ) cho phép nhiều lõi trúng những ngăn khác nhau trong cùng một chu kỳ. So với Figure 21.6(d) ở slide 9 — nó vẽ L3 dùng chung thành MỘT hình chữ nhật; đó là góc nhìn LOGIC, còn đây là góc nhìn VẬT LÝ.</li>
<li><strong>Hai bộ điều khiển DRAM, mỗi rìa một cái.</strong> Chuyện BĂNG THÔNG chứ không phải dung lượng: GPU ngốn băng thông bộ nhớ từng vốc, một bộ điều khiển không nuôi nổi. Đặt chúng ở hai rìa đối diện của mạng còn rút ngắn được đường đi xấu nhất. So với con i7 ở slide 21: "4×8B @ 2.133 GT/s".</li>
<li><strong>MỌI lõi đều có cache riêng — nên ở đây nhất quán là BẮT BUỘC.</strong> Các CPU và các GPU đều đệm cùng một vùng DRAM chung. CPU ghi một ma trận mà GPU đọc trúng bản cũ thì chương trình SAI trong im lặng. Đó đúng là "vấn đề phối hợp và tính đúng đắn" của slide 10, và là lý do HSA (slide 13) khăng khăng đòi "chính sách bộ nhớ nhất quán".</li>
<li><strong>Hình này KHÔNG cho biết gì.</strong> Không tần số, không số lõi, không kích thước cache — nó là một cái KHUÔN, không phải một sản phẩm. Table 21.1 ở slide sau chính là bức tranh này gắn số thật vào.</li>
</ul>
<p class="meo">💡 Đọc hình như một câu: <em>nhiều loại chủ bus khác nhau · mỗi cái một cache riêng · một cái mạng ở giữa · cache chia ngăn dùng chung và bộ nhớ ở dưới</em>. Gần như mọi sơ đồ khối SoC hiện đại, kể cả slide 14, 21, 22 và 29, đều là câu đó vẽ lại.</p>`],

      [12, 'Table 21.1 — Operating Parameters of AMD 5100K Heterogeneous Multicore Processor',
        `<p class="y-chinh">🎯 One real chip, four rows of numbers, and the single most instructive comparison in the chapter: the GPU half is <strong>5× faster than the CPU half in floating point while running at one fifth of the clock</strong>.</p>
<table>
<tr><th></th><th>CPU</th><th>GPU</th><th>Ratio GPU / CPU</th></tr>
<tr><td><strong>Clock frequency (GHz)</strong></td><td>3,8</td><td>0,8</td><td>0,21× (GPU is <em>slower</em>)</td></tr>
<tr><td><strong>Cores</strong></td><td>4</td><td>384</td><td><strong>96×</strong></td></tr>
<tr><td><strong>FLOPS/core</strong></td><td>8</td><td>2</td><td>0,25× (CPU core is <em>wider</em>)</td></tr>
<tr><td><strong>GFLOPS</strong></td><td>121,6</td><td>614,4</td><td><strong>5,05×</strong></td></tr>
</table>
<p class="nhan">📐 <strong>Check the table's own arithmetic</strong> — GFLOPS = clock (GHz) × cores × FLOPS per core:</p>
<pre>CPU:  3,8 × 4   × 8 = 121,6 GFLOPS   ✓ matches the table
GPU:  0,8 × 384 × 2 = 614,4 GFLOPS   ✓ matches the table</pre>
<p class="dap-an">✅ Both rows verify exactly, so the table is internally consistent — worth doing, because a table you can reproduce is a table you can be asked to complete. The slide also defines its terms in the footnotes: <em>FLOPS = floating point operations per second</em>, <em>FLOPS/core = number of parallel floating point operations that can be performed</em>.</p>
<ul>
<li><strong>Read the design philosophy out of the two middle rows.</strong> The CPU takes <em>few, wide, fast</em> cores (4 cores × 8 ops × 3,8 GHz); the GPU takes <em>many, narrow, slow</em> cores (384 × 2 × 0,8). Per core the CPU delivers 3,8 × 8 = 30,4 GFLOPS against the GPU core's 0,8 × 2 = 1,6 — the CPU core is <strong>19× stronger individually</strong> and still loses the total 5:1. Parallelism beats clock speed, but only in aggregate.</li>
<li><strong>Why that does not make the CPU useless.</strong> A single-threaded task runs on one core. On the CPU that is 30,4 GFLOPS; on the GPU it is 1,6. For code with no parallelism the CPU is <strong>19× faster</strong>. This is Amdahl again, wearing hardware: the sequential fraction of a program wants the strong core, the parallel fraction wants the 384 weak ones. A heterogeneous chip is a bet that programs contain both.</li>
<li><strong>And why the GPU's clock is low on purpose.</strong> Back to <code>P ≈ C·V<sup>2</sup>·f</code> on slide 3: 0,8 GHz allows a much lower voltage, so 384 slow cores fit inside a power budget that 384 fast ones never would. The GPU is the power-wall lesson taken to its extreme.</li>
<li><strong>The exam-safe sentence.</strong> Heterogeneous multicore exists because <em>throughput per watt</em> and <em>latency of one thread</em> are optimised by opposite designs, and one chip can carry both.</li>
</ul>
<p class="pitfall">⚠️ Do not read "384 cores" as 384 things like a CPU core. A GPU "core" here is a lane of a SIMD unit — no private branch predictor, no independent instruction stream, sharing a scheduler with dozens of siblings. That is why it manages only 2 FLOPS per clock and why it is useless for irregular, branchy code.</p>`,
        `<p class="y-chinh">🎯 Một con chip thật, bốn dòng số, và phép so sánh dạy được nhiều nhất cả chương: nửa GPU <strong>nhanh gấp 5 lần nửa CPU về dấu phẩy động trong khi chạy ở một phần năm xung nhịp</strong>.</p>
<table>
<tr><th></th><th>CPU</th><th>GPU</th><th>Tỉ lệ GPU / CPU</th></tr>
<tr><td><strong>Tần số xung nhịp (GHz)</strong></td><td>3,8</td><td>0,8</td><td>0,21× (GPU <em>CHẬM hơn</em>)</td></tr>
<tr><td><strong>Số lõi</strong></td><td>4</td><td>384</td><td><strong>96×</strong></td></tr>
<tr><td><strong>FLOPS/lõi</strong></td><td>8</td><td>2</td><td>0,25× (lõi CPU <em>RỘNG hơn</em>)</td></tr>
<tr><td><strong>GFLOPS</strong></td><td>121,6</td><td>614,4</td><td><strong>5,05×</strong></td></tr>
</table>
<p class="nhan">📐 <strong>Kiểm lại phép tính của chính cái bảng</strong> — GFLOPS = xung nhịp (GHz) × số lõi × FLOPS mỗi lõi:</p>
<pre>CPU:  3,8 × 4   × 8 = 121,6 GFLOPS   ✓ khớp bảng
GPU:  0,8 × 384 × 2 = 614,4 GFLOPS   ✓ khớp bảng</pre>
<p class="dap-an">✅ Cả hai dòng khớp CHÍNH XÁC, vậy bảng nhất quán nội tại — đáng làm, vì cái bảng mà bạn dựng lại được là cái bảng người ta có thể bắt bạn điền ô trống. Slide cũng tự định nghĩa thuật ngữ ở chân trang: <em>FLOPS = số phép dấu phẩy động mỗi giây</em>, <em>FLOPS/core = số phép dấu phẩy động SONG SONG thực hiện được</em>.</p>
<ul>
<li><strong>Đọc triết lý thiết kế ra từ hai dòng giữa.</strong> CPU chọn <em>ÍT lõi, RỘNG, NHANH</em> (4 lõi × 8 phép × 3,8 GHz); GPU chọn <em>NHIỀU lõi, HẸP, CHẬM</em> (384 × 2 × 0,8). Tính trên MỖI lõi thì CPU cho 3,8 × 8 = 30,4 GFLOPS còn lõi GPU chỉ 0,8 × 2 = 1,6 — lõi CPU <strong>mạnh gấp 19 lần</strong> mà vẫn thua tổng 5:1. Tính song song thắng tốc độ xung nhịp, nhưng chỉ thắng khi cộng dồn.</li>
<li><strong>Và vì sao điều đó KHÔNG làm CPU thành vô dụng.</strong> Một tác vụ một luồng chạy trên MỘT lõi. Trên CPU là 30,4 GFLOPS; trên GPU là 1,6. Với mã không có tính song song thì CPU <strong>nhanh gấp 19 lần</strong>. Lại là Amdahl, khoác áo phần cứng: phần tuần tự của chương trình cần lõi mạnh, phần song song cần 384 lõi yếu. Chip không đồng nhất là canh bạc đặt cược rằng chương trình có CẢ HAI phần.</li>
<li><strong>Và vì sao xung nhịp GPU thấp CÓ CHỦ Ý.</strong> Quay lại <code>P ≈ C·V<sup>2</sup>·f</code> ở slide 3: 0,8 GHz cho phép hạ điện áp xuống thấp hơn nhiều, nên 384 lõi chậm nhét vừa cái ngân sách công suất mà 384 lõi nhanh không đời nào vừa. GPU là bài học bức tường công suất đẩy tới cực đoan.</li>
<li><strong>Câu an toàn để đi thi.</strong> Đa lõi không đồng nhất tồn tại vì <em>thông lượng trên mỗi watt</em> và <em>độ trễ của một luồng</em> được tối ưu bởi hai thiết kế NGƯỢC NHAU, mà một con chip thì cõng được cả hai.</li>
</ul>
<p class="pitfall">⚠️ Đừng đọc "384 lõi" như 384 thứ giống lõi CPU. "Lõi" GPU ở đây là một LÀN của khối SIMD — không có bộ đoán rẽ nhánh riêng, không có dòng lệnh độc lập, dùng chung bộ lập lịch với hàng chục anh em. Đó là lý do nó chỉ kham nổi 2 FLOPS mỗi nhịp, và lý do nó vô dụng với mã lắt léo nhiều rẽ nhánh.</p>`],

      [13, 'Heterogeneous System Architecture (HSA)',
        `<p class="y-chinh">🎯 If slide 12 showed why you <em>want</em> a GPU next to a CPU, this slide is the software contract that makes it usable. HSA is a set of requirements on the hardware so that programmers stop copying buffers back and forth by hand.</p>
<table>
<tr><th>#</th><th>Key feature of the HSA approach (slide text)</th><th>The pain it removes</th></tr>
<tr><td>1</td><td>The <strong>entire virtual memory space is visible to both CPU and GPU</strong></td><td>No more "GPU memory" vs "CPU memory": one pointer means the same thing to both</td></tr>
<tr><td>2</td><td>The virtual memory system <strong>brings in pages to physical main memory as needed</strong></td><td>The GPU can take a page fault; you no longer have to preload every byte it might touch</td></tr>
<tr><td>3</td><td>A <strong>coherent memory policy</strong> ensures that CPU and GPU caches both see an up-to-date view of data</td><td>No explicit flush/invalidate between kernels — the hardware guarantees it</td></tr>
<tr><td>4</td><td>A <strong>unified programming interface</strong> that lets users exploit GPU parallelism inside programs that also rely on CPU execution</td><td>One language and one toolchain instead of two</td></tr>
</table>
<ul>
<li><strong>The stated objective, in the slide's own words.</strong> To allow programmers to write applications that exploit "<em>the serial power of CPUs and the parallel-processing power of GPUs seamlessly, with efficient coordination at the OS and hardware level</em>". Note where the coordination is placed: OS and hardware, <em>not</em> the application.</li>
<li><strong>Feature 1 is the big one, and it is a Ch.9 idea.</strong> Shared virtual address space means the GPU has its own view through the <em>same</em> page tables — so the GPU needs address translation hardware (an IOMMU / GPU MMU). Everything you learned about virtual memory in the OS-support chapter now applies to a second kind of core.</li>
<li><strong>Feature 3 is a Ch.20 idea.</strong> "Coherent memory policy" between CPU and GPU caches is exactly the cache-coherence problem of slides 18–20, except the two parties are not even the same kind of processor. ARM's answer, ACE (slide 18), explicitly advertises support for "coherency between dissimilar processors".</li>
<li><strong>Why it matters practically.</strong> Before HSA, offloading work to a GPU meant: allocate a device buffer, copy input over the bus, launch, copy results back. For a small kernel the copying cost more than the computing, so only huge jobs were worth offloading. Shared coherent memory lowers that break-even point, which is the difference between "GPU for supercomputing" and "GPU for everyday code".</li>
<li><strong>Connect to the granularity slide.</strong> HSA is a <em>granularity</em> argument in disguise: reduce the fixed cost per offloaded task, and finer-grained work becomes worth offloading — exactly the trade-off named on slide 7.</li>
</ul>
<p class="meo">💡 Four features, one sentence: <strong>same address space · pages on demand · coherent caches · one programming interface</strong>. Every one of them removes a manual copy step.</p>`,
        `<p class="y-chinh">🎯 Nếu slide 12 cho thấy vì sao bạn <em>MUỐN</em> có GPU nằm cạnh CPU, thì slide này là bản hợp đồng phần mềm khiến nó DÙNG ĐƯỢC. HSA là một bộ yêu cầu đặt lên phần cứng để lập trình viên thôi phải chép qua chép lại các vùng đệm bằng tay.</p>
<table>
<tr><th>#</th><th>Đặc điểm then chốt của HSA (chữ trên slide)</th><th>Nó gỡ bỏ nỗi khổ nào</th></tr>
<tr><td>1</td><td><strong>TOÀN BỘ không gian bộ nhớ ảo nhìn thấy được với CẢ CPU lẫn GPU</strong></td><td>Hết cảnh "bộ nhớ GPU" với "bộ nhớ CPU": một con trỏ có cùng ý nghĩa với cả hai</td></tr>
<tr><td>2</td><td>Hệ thống bộ nhớ ảo <strong>nạp trang vào bộ nhớ chính vật lý KHI CẦN</strong></td><td>GPU được phép gây lỗi trang; không còn phải nạp trước mọi byte mà nó CÓ THỂ đụng tới</td></tr>
<tr><td>3</td><td><strong>Chính sách bộ nhớ NHẤT QUÁN</strong> bảo đảm cache của CPU và của GPU đều thấy dữ liệu mới nhất</td><td>Không cần xả/vô hiệu cache thủ công giữa các kernel — phần cứng bảo đảm</td></tr>
<tr><td>4</td><td><strong>Giao diện lập trình HỢP NHẤT</strong> để người dùng khai thác tính song song của GPU ngay trong chương trình vốn dựa vào CPU</td><td>Một ngôn ngữ, một bộ công cụ, thay vì hai</td></tr>
</table>
<ul>
<li><strong>Mục tiêu, nói bằng chính chữ của slide.</strong> Cho phép lập trình viên viết ứng dụng khai thác "<em>sức mạnh TUẦN TỰ của CPU và sức mạnh XỬ LÝ SONG SONG của GPU một cách liền mạch, với sự phối hợp hiệu quả ở mức hệ điều hành và phần cứng</em>". Để ý sự phối hợp được đặt ở đâu: hệ điều hành và phần cứng, <em>KHÔNG PHẢI</em> ứng dụng.</li>
<li><strong>Đặc điểm 1 là cái lớn nhất, và nó là ý tưởng của Ch.9.</strong> Chung không gian địa chỉ ảo nghĩa là GPU có góc nhìn riêng nhưng qua CÙNG bộ bảng trang — nên GPU cần phần cứng dịch địa chỉ (IOMMU / MMU của GPU). Mọi thứ bạn học về bộ nhớ ảo ở chương hỗ trợ hệ điều hành nay áp dụng cho một loại lõi thứ hai.</li>
<li><strong>Đặc điểm 3 là ý tưởng của Ch.20.</strong> "Chính sách bộ nhớ nhất quán" giữa cache CPU và cache GPU đúng là bài toán nhất quán cache của slide 18–20, chỉ khác là hai bên thậm chí không cùng LOẠI bộ xử lý. Câu trả lời của ARM là ACE (slide 18), vốn quảng cáo thẳng rằng nó đỡ được "nhất quán giữa những bộ xử lý KHÔNG GIỐNG NHAU".</li>
<li><strong>Vì sao nó quan trọng trong thực tế.</strong> Trước HSA, đẩy việc sang GPU nghĩa là: cấp vùng đệm trên thiết bị, chép dữ liệu vào qua bus, chạy, rồi chép kết quả về. Với một kernel nhỏ thì chi phí chép còn tốn hơn chi phí tính, nên chỉ việc nào thật to mới bõ đẩy đi. Bộ nhớ chung có nhất quán hạ cái điểm hoà vốn đó xuống — đó là khác biệt giữa "GPU cho siêu máy tính" và "GPU cho mã đời thường".</li>
<li><strong>Nối về slide độ mịn.</strong> HSA thật ra là một lập luận về <em>ĐỘ MỊN</em> trá hình: giảm chi phí cố định trên mỗi tác vụ đẩy đi, thì việc grain mịn hơn cũng bõ đẩy đi — đúng cái đánh đổi được gọi tên ở slide 7.</li>
</ul>
<p class="meo">💡 Bốn đặc điểm, một câu: <strong>chung không gian địa chỉ · nạp trang khi cần · cache nhất quán · một giao diện lập trình</strong>. Cái nào cũng gỡ bỏ một bước chép tay.</p>`],

      [14, 'Figure 21.8 — Texas Instruments 66AK2H12 Heterogenous Multicore Chip',
        `<p class="y-chinh">🎯 A real heterogeneous chip with <strong>two different instruction sets on one die</strong>: <em>8 C66x DSP cores @ 1.2 GHz</em> and <em>4 ARM Cortex-A15 cores @ 1.4 GHz</em>, tied together by a switch fabric called <strong>TeraNet</strong>.</p>
<table>
<tr><th>Block on the figure</th><th>What it is</th></tr>
<tr><td><strong>4 × ARM Cortex-A15</strong></td><td>Each with 32 kB L1 P-Cache and 32 kB L1 D-Cache, over a <strong>4 MB L2 cache shared by the four</strong> — this is Figure 21.6(c), "shared L2"</td></tr>
<tr><td><strong>8 × C66x DSP</strong></td><td>Each with 32 kB L1 P-Cache + 32 kB L1 D-Cache and its <em>own</em> 1 MB L2 — this is Figure 21.6(b), "dedicated L2"</td></tr>
<tr><td><strong>Memory Subsystem</strong></td><td>Two 72-bit DDR3 EMIF controllers, 6 MB MSM SRAM, and the MSMC (multicore shared memory controller)</td></tr>
<tr><td><strong>TeraNet</strong></td><td>The on-chip interconnect of Figure 21.7, named</td></tr>
<tr><td><strong>Multicore Navigator</strong></td><td><em>Queue Manager</em> + <em>Packet DMA</em> — hardware task dispatch</td></tr>
<tr><td><strong>Network Coprocessor</strong></td><td>5-port Ethernet switch, 4 × 1GbE, Security Accelerator, Packet Accelerator</td></tr>
<tr><td><strong>Peripherals / support</strong></td><td>Debug &amp; Trace, Boot ROM, Semaphore, Power Management, PLL, 5 × EDMA, EMIF16, GPIO ×32, 3 × I<sup>2</sup>C, USB 3.0, 2 × UART, 3 × SPI, PCIe ×2, SRIO ×4, 2 × HyperLink</td></tr>
</table>
<ul>
<li><strong>The headline lesson: TWO cache organisations coexist on one chip.</strong> The ARM cluster shares its L2; the DSP cluster gives each core a private 1 MB L2. Figure 21.6 was not a menu from which a designer picks once — it is a menu you can order from twice, per cluster, according to what each kind of core does.</li>
<li><strong>Why different ISAs here and not big.Little.</strong> DSP cores and ARM cores cannot run each other's binaries at all. The programmer decides explicitly what runs where: control, OS and networking on the ARMs; signal-processing kernels on the DSPs. That is the <strong>"different instruction set architectures"</strong> heading of the summary slide.</li>
<li><strong>The "Semaphore" block is worth noticing.</strong> A dedicated hardware unit just for synchronisation between clusters — when two different ISAs must lock the same resource, you cannot rely on one ISA's atomic instruction. Slide 7's "cheap synchronisation is what makes fine grain affordable" made into silicon.</li>
<li><strong>And "Multicore Navigator" is slide 7 in silicon too.</strong> A hardware queue manager dispatches tasks without an OS round trip, which lowers the per-task overhead and therefore lowers the granularity at which parallelising still pays.</li>
<li><strong>Where you would meet this chip.</strong> Base stations, industrial imaging, radar — workloads that are simultaneously control-heavy (ARM) and stream-heavy (DSP). It is the embedded twin of the CPU+GPU story of slides 10–13.</li>
</ul>
<p class="pitfall">⚠️ The slide prints "4 ARM cores @ 1.4 Ghz". The correct unit symbol is <strong>GHz</strong> (giga-hertz, capital H because Hertz is a person's name). Harmless here, but write it correctly in your own answers.</p>`,
        `<p class="y-chinh">🎯 Một con chip không đồng nhất thật, với <strong>HAI tập lệnh khác nhau trên cùng một miếng đế</strong>: <em>8 lõi DSP C66x @ 1.2 GHz</em> và <em>4 lõi ARM Cortex-A15 @ 1.4 GHz</em>, nối với nhau bằng một ma trận chuyển mạch tên <strong>TeraNet</strong>.</p>
<table>
<tr><th>Khối trên hình</th><th>Nó là gì</th></tr>
<tr><td><strong>4 × ARM Cortex-A15</strong></td><td>Mỗi lõi 32 kB L1 P-Cache và 32 kB L1 D-Cache, bên dưới là <strong>4 MB L2 DÙNG CHUNG cho cả bốn</strong> — đây chính là Figure 21.6(c), "L2 dùng chung"</td></tr>
<tr><td><strong>8 × DSP C66x</strong></td><td>Mỗi lõi 32 kB L1 P-Cache + 32 kB L1 D-Cache và 1 MB L2 <em>RIÊNG</em> — đây chính là Figure 21.6(b), "L2 riêng"</td></tr>
<tr><td><strong>Memory Subsystem</strong></td><td>Hai bộ điều khiển DDR3 EMIF 72 bit, 6 MB MSM SRAM, và MSMC (bộ điều khiển bộ nhớ dùng chung đa lõi)</td></tr>
<tr><td><strong>TeraNet</strong></td><td>Chính là mạng liên kết trên chip của Figure 21.7, có tên riêng</td></tr>
<tr><td><strong>Multicore Navigator</strong></td><td><em>Queue Manager</em> + <em>Packet DMA</em> — điều phối tác vụ bằng PHẦN CỨNG</td></tr>
<tr><td><strong>Network Coprocessor</strong></td><td>Switch Ethernet 5 cổng, 4 × 1GbE, Security Accelerator, Packet Accelerator</td></tr>
<tr><td><strong>Ngoại vi / hỗ trợ</strong></td><td>Debug &amp; Trace, Boot ROM, Semaphore, Power Management, PLL, 5 × EDMA, EMIF16, GPIO ×32, 3 × I<sup>2</sup>C, USB 3.0, 2 × UART, 3 × SPI, PCIe ×2, SRIO ×4, 2 × HyperLink</td></tr>
</table>
<ul>
<li><strong>Bài học lớn nhất: HAI kiểu tổ chức cache cùng tồn tại trên MỘT chip.</strong> Cụm ARM dùng chung L2; cụm DSP cho mỗi lõi một L2 riêng 1 MB. Figure 21.6 KHÔNG phải cái thực đơn mà người thiết kế chỉ gọi món một lần — nó là thực đơn có thể gọi HAI lần, mỗi cụm một món, tuỳ theo mỗi loại lõi làm việc gì.</li>
<li><strong>Vì sao ở đây là ISA KHÁC NHAU chứ không phải big.Little.</strong> Lõi DSP và lõi ARM hoàn toàn không chạy nổi mã nhị phân của nhau. Lập trình viên phải quyết định TƯỜNG MINH cái gì chạy ở đâu: điều khiển, hệ điều hành và mạng trên ARM; các kernel xử lý tín hiệu trên DSP. Đó đúng là đề mục <strong>"different instruction set architectures"</strong> ở slide tổng kết.</li>
<li><strong>Khối "Semaphore" đáng để ý.</strong> Một đơn vị phần cứng riêng chỉ để đồng bộ giữa các cụm — khi hai ISA khác nhau phải khoá cùng một tài nguyên thì không thể trông vào lệnh nguyên tử của một ISA nào. Đây là câu "đồng bộ rẻ mới làm grain mịn bõ tiền" của slide 7 đúc thành silic.</li>
<li><strong>Và "Multicore Navigator" cũng là slide 7 đúc thành silic.</strong> Một bộ quản lý hàng đợi bằng phần cứng điều phối tác vụ mà không phải vòng qua hệ điều hành, nhờ vậy hạ chi phí trên mỗi tác vụ và do đó hạ luôn cái độ mịn mà song song hoá vẫn còn lời.</li>
<li><strong>Bạn gặp con chip này ở đâu.</strong> Trạm gốc viễn thông, ảnh công nghiệp, radar — những tải vừa nặng điều khiển (ARM) vừa nặng luồng dữ liệu (DSP). Nó là bản song sinh nhúng của câu chuyện CPU+GPU ở slide 10–13.</li>
</ul>
<p class="pitfall">⚠️ Slide in "4 ARM cores @ 1.4 Ghz". Ký hiệu đơn vị đúng là <strong>GHz</strong> (giga-hertz, chữ H viết hoa vì Hertz là tên người). Ở đây thì vô hại, nhưng trong bài làm của bạn thì hãy viết cho đúng.</p>`],

      [15, 'Figure 21.9 — big.Little Chip Components',
        `<p class="y-chinh">🎯 ARM's answer to heterogeneity with <strong>equivalent instruction sets</strong>: two <em>Cortex-A15</em> cores with their own L2, two <em>Cortex-A7</em> cores with their own L2, a <strong>GIC-400 Global Interrupt Controller</strong> above them feeding Interrupts to both clusters, and a <strong>CCI-400 (Cache Coherent Interconnect)</strong> below tying the two L2s and an <em>I/O Coherent Master</em> to the Memory Controller Ports and the System Port.</p>
<ul>
<li><strong>The key difference from slide 14.</strong> The A15 and the A7 run <em>the same ARM instruction set</em>. A thread can be stopped on one and resumed on the other with no recompilation — the OS just migrates it. That is the whole point of "equivalent ISA" heterogeneity: the choice of core becomes a <em>scheduling</em> decision, not a programming one.</li>
<li><strong>Why two clusters and not four mixed cores.</strong> Each cluster has its own L2 (Figure 21.6(b) twice over) because the two core types want different cache behaviour and different voltage/frequency domains. The A7 cluster can be clocked and powered down independently of the A15 cluster — which is the energy saving you bought the design for.</li>
<li><strong>CCI-400 is the load-bearing block.</strong> Migrating a thread from an A15 to an A7 means its warm data sits in the A15 cluster's L2. Without a coherent interconnect the A7 would read stale memory. CCI-400 makes the two private L2s coherent with each other — this is exactly the ACE coherence of slide 18, and the slide text there says ACE "supports coherency between dissimilar processors enabling ARM big.Little technology".</li>
<li><strong>GIC-400 at the top is not decoration.</strong> If a thread can run on any of the four cores, then an interrupt for that thread must be routable to any of the four. Interrupt distribution is a first-class requirement of heterogeneous multicore — which is why slides 23–26 spend four slides on the GIC.</li>
<li><strong>The "I/O Coherent Master" on the right.</strong> A DMA engine or accelerator that participates in coherence without having a CPU-style cache. Slide 18 calls this out too: ACE "supports I/O coherency for un-cached masters".</li>
</ul>
<p class="meo">💡 Remember the three blocks by their jobs: <strong>GIC = who gets the interrupt · CCI = who has the newest data · the two clusters = fast-and-thirsty vs slow-and-frugal</strong>.</p>`,
        `<p class="y-chinh">🎯 Câu trả lời của ARM cho sự không đồng nhất kiểu <strong>TẬP LỆNH TƯƠNG ĐƯƠNG</strong>: hai lõi <em>Cortex-A15</em> với L2 riêng của cụm, hai lõi <em>Cortex-A7</em> với L2 riêng của cụm, phía trên là <strong>GIC-400 Global Interrupt Controller</strong> rót Interrupts xuống cả hai cụm, phía dưới là <strong>CCI-400 (Cache Coherent Interconnect)</strong> buộc hai cái L2 và một <em>I/O Coherent Master</em> vào Memory Controller Ports cùng System Port.</p>
<ul>
<li><strong>Khác biệt then chốt so với slide 14.</strong> A15 và A7 chạy <em>CÙNG một tập lệnh ARM</em>. Một luồng có thể bị dừng trên lõi này rồi chạy tiếp trên lõi kia mà không cần biên dịch lại — hệ điều hành chỉ việc di chuyển nó. Đó là toàn bộ ý nghĩa của sự không đồng nhất "ISA tương đương": chọn lõi trở thành quyết định <em>LẬP LỊCH</em>, không phải quyết định lập trình.</li>
<li><strong>Vì sao chia hai CỤM chứ không trộn bốn lõi.</strong> Mỗi cụm có L2 riêng (đúng Figure 21.6(b), lặp hai lần) vì hai loại lõi cần hành vi cache khác nhau và cần miền điện áp/tần số khác nhau. Cụm A7 có thể hạ xung nhịp và cắt điện độc lập với cụm A15 — chính là khoản tiết kiệm năng lượng mà bạn mua thiết kế này để có.</li>
<li><strong>CCI-400 mới là khối chịu lực.</strong> Di chuyển một luồng từ A15 sang A7 nghĩa là dữ liệu còn nóng của nó đang nằm trong L2 của cụm A15. Không có liên kết nhất quán thì A7 sẽ đọc phải bộ nhớ cũ. CCI-400 làm hai cái L2 riêng nhất quán với nhau — đúng là cơ chế ACE của slide 18, và chữ trên slide đó ghi rằng ACE "đỡ được nhất quán giữa những bộ xử lý KHÔNG GIỐNG NHAU, cho phép công nghệ ARM big.Little".</li>
<li><strong>GIC-400 ở trên cùng không phải để trang trí.</strong> Nếu một luồng có thể chạy trên bất kỳ lõi nào trong bốn lõi, thì ngắt dành cho luồng đó phải định tuyến được tới bất kỳ lõi nào trong bốn. Phân phối ngắt là yêu cầu hạng nhất của đa lõi không đồng nhất — và vì thế slide 23–26 dành hẳn bốn slide cho GIC.</li>
<li><strong>Khối "I/O Coherent Master" bên phải.</strong> Một cỗ máy DMA hay bộ tăng tốc tham gia vào cơ chế nhất quán mà bản thân KHÔNG có cache kiểu CPU. Slide 18 cũng nêu thẳng điều này: ACE "đỡ nhất quán I/O cho những chủ bus không có cache".</li>
</ul>
<p class="meo">💡 Nhớ ba khối theo đúng việc của chúng: <strong>GIC = ai nhận ngắt · CCI = ai đang giữ dữ liệu mới nhất · hai cụm = nhanh-mà-ngốn với chậm-mà-tiết-kiệm</strong>.</p>`],

      [16, 'Figure 21.10 — Cortex A-7 and A-15 Pipelines',
        `<p class="y-chinh">🎯 Why two core types are genuinely different machines, shown as two pipelines side by side. This slide is Chapter 16 and Chapter 18 coming back for a final appearance.</p>
<table>
<tr><th></th><th>(a) Cortex A-7 — the "Little"</th><th>(b) Cortex A-15 — the "big"</th></tr>
<tr><td><strong>Fetch stages drawn</strong></td><td>3</td><td>5</td></tr>
<tr><td><strong>Front end</strong></td><td>Fetch → Decode → Issue (with a small loop buffer feeding Decode)</td><td>Fetch → <strong>Decode, Rename &amp; Dispatch</strong> (with a <em>Loop Cache</em>) → Queue → Issue</td></tr>
<tr><td><strong>Execution order</strong></td><td><strong>In-order</strong> — no queue between issue and the units</td><td><strong>Out-of-order</strong> — register <em>renaming</em> plus a queue in front of every unit</td></tr>
<tr><td><strong>Functional units shown</strong></td><td>Integer · Multiply · Floating-Point/NEON · Dual Issue · Load/Store</td><td><strong>Two</strong> Integer · Multiply · Floating-Point/NEON (a much longer chain) · Branch · Load · Store</td></tr>
<tr><td><strong>Issue width</strong></td><td>up to 2 ("Dual Issue")</td><td>wider, with independent queues per unit</td></tr>
</table>
<ul>
<li><strong>The word that explains the entire power difference: RENAME.</strong> The A-15 box says "Decode, Rename &amp; Dispatch". Register renaming is what enables out-of-order execution (Ch.16/18) — and it costs a rename table, a reorder buffer, wake-up logic and many more register file ports. All of that switches every cycle, and by slide 3 that means power.</li>
<li><strong>In-order versus out-of-order is the whole big.Little bet.</strong> An in-order core stalls whenever an operand is not ready; an out-of-order core finds other work. On code with many cache misses the A-15 wins big; on steady, predictable code the A-7 comes surprisingly close for a fraction of the energy. So schedule bursty foreground work on the big core and steady background work on the little one.</li>
<li><strong>Count the queues, that is the area.</strong> Panel (b) draws a queue in front of <em>every</em> functional unit; panel (a) draws none. Those buffers are the "complexity" in Pollack's rule from slide 3 — and the reason the A-15 delivers maybe 2–3× the performance for far more than 2–3× the power.</li>
<li><strong>Both have Floating-Point/NEON, and that matters.</strong> Equivalent ISA means <em>every</em> instruction must exist on both cores, including the SIMD ones. The A-7's FP/NEON chain is simply shorter and narrower. A thread migrating mid-execution must find every instruction it might use on the destination core.</li>
<li><strong>The Loop Cache on the A-15 is a locality trick.</strong> A loop small enough to fit is replayed from the cache without re-fetching and re-decoding — saving the whole front-end's power on exactly the code that runs most. Temporal locality (Ch.4) applied to instruction decoding.</li>
</ul>
<p class="pitfall">⚠️ Do not say "the A-7 is a cut-down A-15". They are separate designs with the same instruction set. The A-7 is not an A-15 with pieces removed; it was designed in-order from the start, which is why its pipeline is shorter rather than just narrower.</p>`,
        `<p class="y-chinh">🎯 Vì sao hai loại lõi thật sự là hai cỗ máy khác nhau, trình bày bằng hai pipeline đặt cạnh nhau. Slide này là Chương 16 và Chương 18 quay lại chào lần cuối.</p>
<table>
<tr><th></th><th>(a) Cortex A-7 — lõi "Little"</th><th>(b) Cortex A-15 — lõi "big"</th></tr>
<tr><td><strong>Số ô Fetch vẽ ra</strong></td><td>3</td><td>5</td></tr>
<tr><td><strong>Đầu vào (front end)</strong></td><td>Fetch → Decode → Issue (có một bộ đệm vòng lặp nhỏ tiếp cho Decode)</td><td>Fetch → <strong>Decode, Rename &amp; Dispatch</strong> (có <em>Loop Cache</em>) → Queue → Issue</td></tr>
<tr><td><strong>Thứ tự thực thi</strong></td><td><strong>ĐÚNG THỨ TỰ</strong> — không có hàng đợi giữa phát lệnh và các khối</td><td><strong>KHÔNG THEO THỨ TỰ</strong> — có <em>đổi tên thanh ghi</em> cộng một hàng đợi trước MỖI khối</td></tr>
<tr><td><strong>Khối chức năng vẽ ra</strong></td><td>Integer · Multiply · Floating-Point/NEON · Dual Issue · Load/Store</td><td><strong>HAI</strong> khối Integer · Multiply · Floating-Point/NEON (chuỗi dài hơn hẳn) · Branch · Load · Store</td></tr>
<tr><td><strong>Bề rộng phát lệnh</strong></td><td>tối đa 2 ("Dual Issue")</td><td>rộng hơn, mỗi khối một hàng đợi độc lập</td></tr>
</table>
<ul>
<li><strong>Chữ giải thích toàn bộ chênh lệch công suất: RENAME.</strong> Ô của A-15 ghi "Decode, Rename &amp; Dispatch". Đổi tên thanh ghi là thứ cho phép thực thi không theo thứ tự (Ch.16/18) — và nó tốn một bảng đổi tên, một bộ đệm sắp xếp lại, logic đánh thức, cùng rất nhiều cổng thêm cho tệp thanh ghi. Tất cả những thứ đó đảo trạng thái MỖI chu kỳ, mà theo slide 3 thì đảo trạng thái nghĩa là tốn điện.</li>
<li><strong>Đúng-thứ-tự so với không-theo-thứ-tự chính là toàn bộ canh bạc big.Little.</strong> Lõi đúng thứ tự đứng khựng mỗi khi toán hạng chưa sẵn sàng; lõi không theo thứ tự đi tìm việc khác mà làm. Với mã trượt cache nhiều thì A-15 thắng đậm; với mã đều đặn, dễ đoán thì A-7 bám sát đến bất ngờ mà chỉ tốn một phần năng lượng. Vậy nên hãy xếp việc tiền cảnh dồn dập lên lõi to, việc nền đều đều lên lõi nhỏ.</li>
<li><strong>Đếm số hàng đợi, đó chính là DIỆN TÍCH.</strong> Ô (b) vẽ một hàng đợi trước <em>MỖI</em> khối chức năng; ô (a) không vẽ cái nào. Những bộ đệm ấy chính là "độ phức tạp" trong quy tắc Pollack ở slide 3 — và là lý do A-15 cho cỡ 2–3 lần hiệu năng mà tốn hơn 2–3 lần công suất rất nhiều.</li>
<li><strong>Cả hai đều có Floating-Point/NEON, và điều đó quan trọng.</strong> ISA tương đương nghĩa là <em>MỌI</em> lệnh phải tồn tại trên cả hai lõi, kể cả lệnh SIMD. Chuỗi FP/NEON của A-7 chỉ đơn giản là ngắn hơn và hẹp hơn. Một luồng di chuyển giữa chừng phải tìm thấy đủ mọi lệnh nó có thể dùng trên lõi đích.</li>
<li><strong>Loop Cache trên A-15 là một mẹo tính cục bộ.</strong> Vòng lặp nào đủ nhỏ để nhét vừa thì được phát lại từ cache, khỏi nạp lại và giải mã lại — tiết kiệm trọn công suất của cả đầu vào, đúng trên đoạn mã chạy nhiều nhất. Cục bộ thời gian (Ch.4) áp vào khâu giải mã lệnh.</li>
</ul>
<p class="pitfall">⚠️ Đừng nói "A-7 là A-15 cắt gọt bớt". Chúng là hai thiết kế riêng biệt dùng chung tập lệnh. A-7 không phải A-15 gỡ bớt linh kiện; nó được thiết kế đúng-thứ-tự ngay từ đầu, và vì thế pipeline của nó NGẮN hơn chứ không chỉ hẹp hơn.</p>`],

      [17, 'Figure 21.11 — Cortex-A7 and A15 Performance Comparison',
        `<p class="y-chinh">🎯 One curve that justifies the whole big.Little idea: <strong>Power</strong> on the vertical axis, <strong>Performance</strong> on the horizontal, with a short flat green segment from "Lowest Cortex-A7 Operating Point" to "Highest Cortex-A7 Operating Point", and a long steeply rising black curve from "Lowest Cortex-A15 Operating Point" to "Highest Cortex-A15 Operating Point".</p>
<ul>
<li><strong>The two curves overlap in performance but not in power.</strong> The highest A7 point and the lowest A15 point sit at roughly the same performance — but the A15 needs visibly more power to get there. Below that crossover the A7 is strictly better; above it only the A15 can go. That crossover is the <strong>scheduling threshold</strong> the OS uses to decide which cluster a thread belongs on.</li>
<li><strong>Note the SHAPES, because the shapes are the argument.</strong> The A7 line is nearly flat: raising its clock barely raises its power. The A15 curve bends sharply upwards: the last bit of performance costs disproportionately. That is <code>P ≈ C·V<sup>2</sup>·f</code> from slide 3 drawn as a curve — voltage must rise with frequency, so the top of any core's range is always the most expensive part.</li>
<li><strong>There are no numbers on either axis.</strong> The slide gives no units, no ticks, no values — it is a qualitative figure. Say "the A15 costs far more power at equal performance" in an exam, not "the A15 uses X watts". Inventing numbers here is a trap.</li>
<li><strong>Why not just run one A15 at low clock all the time?</strong> Because a big out-of-order core burns power even at low frequency — all those queues, the rename table and the reorder buffer keep switching. That is why its curve starts high on the vertical axis instead of at the origin. Only a physically simpler core gets you the bottom-left corner.</li>
</ul>
<p class="nhan">📐 <strong>Measured on this machine</strong>, which is exactly a heterogeneous multicore with equivalent ISAs (<code>sysctl</code>, Apple M1 Max):</p>
<table>
<tr><th></th><th>Performance cores (the "big")</th><th>Efficiency cores (the "Little")</th></tr>
<tr><td><strong>Physical cores</strong></td><td>8 (<code>hw.perflevel0.physicalcpu</code>)</td><td>2 (<code>hw.perflevel1.physicalcpu</code>)</td></tr>
<tr><td><strong>L1 instruction cache</strong></td><td>192 kB per core</td><td>128 kB per core</td></tr>
<tr><td><strong>L1 data cache</strong></td><td>128 kB per core</td><td>64 kB per core</td></tr>
<tr><td><strong>L2 cache</strong></td><td>12 MB shared by the cluster</td><td>4 MB shared by the cluster</td></tr>
<tr><td><strong>Cache line / RAM</strong></td><td>128 bytes (<code>hw.cachelinesize</code>)</td><td>32 GB total (<code>hw.memsize</code>)</td></tr>
</table>
<p class="dap-an">✅ Two things to read off it. First, the <strong>Figure 21.9 layout is literally this machine</strong>: two clusters, each with its own shared L2 — Figure 21.6(c) applied twice. Second, the E cores are not merely slower, they have <em>half the L1D and a third of the L2</em>, so their disadvantage grows with working-set size, not just with clock.</p>
<p class="dap-an">✅ And it shows up in the thread-scaling measurement of slide 4: 8 threads reached <strong>6,89×</strong>, and adding the two E cores to make 10 threads only reached <strong>7,06×</strong> — a gain of 2,5% from 25% more cores. The reason is the <em>straggler</em> effect: the test splits the work into 10 equal parts, so the two E cores receive a full share each and finish last, and everyone waits for them. Modelling it as "the E core runs at rate r relative to a P core", a 10-way even split predicts speedup = r × 10; the measured 7,06 implies <strong>r ≈ 0,7</strong>.</p>
<p class="pitfall">⚠️ The practical lesson, and it is a real bug people ship: on a heterogeneous machine, <strong>never split work into equal parts, one per core</strong>. Equal parts assume equal cores. Use a work queue with small chunks so fast cores simply take more chunks — that is why the granularity trade-off of slide 7 is not academic.</p>`,
        `<p class="y-chinh">🎯 Một đường cong biện minh cho cả ý tưởng big.Little: <strong>Power</strong> trên trục đứng, <strong>Performance</strong> trên trục ngang, với một đoạn xanh lá ngắn và phẳng đi từ "Lowest Cortex-A7 Operating Point" tới "Highest Cortex-A7 Operating Point", và một đường đen dài dựng đứng dần đi từ "Lowest Cortex-A15 Operating Point" tới "Highest Cortex-A15 Operating Point".</p>
<ul>
<li><strong>Hai đường CHỒNG LẤN về hiệu năng nhưng không chồng lấn về công suất.</strong> Điểm cao nhất của A7 và điểm thấp nhất của A15 nằm ở xấp xỉ cùng mức hiệu năng — nhưng A15 phải tốn nhiều công suất hơn hẳn mới tới đó. Dưới điểm giao đó thì A7 tốt hơn tuyệt đối; trên điểm đó thì chỉ A15 đi tiếp được. Điểm giao ấy chính là <strong>NGƯỠNG LẬP LỊCH</strong> mà hệ điều hành dùng để quyết định một luồng thuộc về cụm nào.</li>
<li><strong>Để ý HÌNH DÁNG, vì hình dáng chính là lập luận.</strong> Đường A7 gần như phẳng: nâng xung nhịp của nó hầu như không làm công suất nhích lên. Đường A15 bẻ cong dựng ngược: chút hiệu năng cuối cùng có giá không tương xứng. Đó là <code>P ≈ C·V<sup>2</sup>·f</code> của slide 3 vẽ thành đường cong — điện áp phải tăng theo tần số, nên phần đỉnh trong dải hoạt động của BẤT KỲ lõi nào cũng luôn là phần đắt nhất.</li>
<li><strong>KHÔNG có con số nào trên hai trục.</strong> Slide không cho đơn vị, không vạch chia, không giá trị — đây là hình ĐỊNH TÍNH. Vào phòng thi hãy viết "A15 tốn công suất hơn hẳn ở cùng mức hiệu năng", đừng viết "A15 dùng X watt". Bịa số ở đây là một cái bẫy.</li>
<li><strong>Sao không chạy luôn một con A15 ở xung nhịp thấp cho xong?</strong> Vì một lõi to không-theo-thứ-tự vẫn đốt điện kể cả ở tần số thấp — đám hàng đợi, bảng đổi tên và bộ đệm sắp xếp lại vẫn đảo trạng thái liên tục. Vì thế đường của nó khởi đầu đã CAO trên trục đứng chứ không xuất phát từ gốc. Chỉ một lõi đơn giản hơn về mặt vật lý mới với tới được góc dưới-trái.</li>
</ul>
<p class="nhan">📐 <strong>ĐO THẬT trên máy viết bài</strong>, mà chính nó là một chip đa lõi không đồng nhất kiểu ISA tương đương (<code>sysctl</code>, Apple M1 Max):</p>
<table>
<tr><th></th><th>Lõi Performance (lõi "to")</th><th>Lõi Efficiency (lõi "nhỏ")</th></tr>
<tr><td><strong>Số lõi vật lý</strong></td><td>8 (<code>hw.perflevel0.physicalcpu</code>)</td><td>2 (<code>hw.perflevel1.physicalcpu</code>)</td></tr>
<tr><td><strong>L1 lệnh</strong></td><td>192 kB mỗi lõi</td><td>128 kB mỗi lõi</td></tr>
<tr><td><strong>L1 dữ liệu</strong></td><td>128 kB mỗi lõi</td><td>64 kB mỗi lõi</td></tr>
<tr><td><strong>L2</strong></td><td>12 MB dùng chung trong cụm</td><td>4 MB dùng chung trong cụm</td></tr>
<tr><td><strong>Dòng cache / RAM</strong></td><td>128 byte (<code>hw.cachelinesize</code>)</td><td>32 GB tổng (<code>hw.memsize</code>)</td></tr>
</table>
<p class="dap-an">✅ Đọc ra hai điều. Thứ nhất, <strong>bố cục của Figure 21.9 chính là cái máy này theo đúng nghĩa đen</strong>: hai cụm, mỗi cụm một L2 dùng chung riêng — Figure 21.6(c) áp dụng hai lần. Thứ hai, lõi E không chỉ CHẬM hơn, nó còn có <em>một nửa L1D và một phần ba L2</em>, nên thế yếu của nó lớn dần theo kích thước vùng làm việc chứ không chỉ theo xung nhịp.</p>
<p class="dap-an">✅ Và điều đó hiện ra trong phép đo tăng tốc ở slide 4: 8 luồng đạt <strong>6,89×</strong>, thêm hai lõi E thành 10 luồng chỉ đạt <strong>7,06×</strong> — thêm 25% số lõi để đổi lấy 2,5% tốc độ. Nguyên nhân là hiệu ứng <em>KẺ VỀ ĐÍCH CUỐI</em>: phép thử chia việc thành 10 phần BẰNG NHAU, nên hai lõi E nhận trọn một phần mỗi đứa và xong sau cùng, cả đám phải chờ chúng. Mô hình hoá bằng "lõi E chạy với tốc độ r so với lõi P", chia đều 10 phần cho ra tăng tốc = r × 10; số đo 7,06 suy ra <strong>r ≈ 0,7</strong>.</p>
<p class="pitfall">⚠️ Bài học thực hành, và đây là lỗi người ta ship ra thật: trên máy không đồng nhất, <strong>ĐỪNG BAO GIỜ chia việc thành các phần bằng nhau, mỗi lõi một phần</strong>. Chia đều là mặc định các lõi ngang nhau. Hãy dùng hàng đợi công việc với các mẩu nhỏ, để lõi nhanh tự lấy thêm nhiều mẩu hơn — và đó là lý do sự đánh đổi độ mịn ở slide 7 không hề hàn lâm.</p>`],

      [18, 'Cache Coherence (and ARM ACE)',
        `<p class="y-chinh">🎯 The problem statement of the last third of the chapter, in the slide's own words: <strong>"when multiple caches exist there is a need for a cache-coherence scheme to avoid access to invalid data"</strong>. Then the slide rules out one solution and names two.</p>
<table>
<tr><th>Approach</th><th>What the slide says about it</th></tr>
<tr><td><strong>Software-based techniques</strong></td><td>Coherence "may be addressed" this way, <em>but</em> the <strong>software burden consumes too many resources in a SoC chip</strong> — i.e. rejected for this class of system</td></tr>
<tr><td><strong>Directory protocols</strong></td><td>One of the two main hardware approaches</td></tr>
<tr><td><strong>Snoopy protocols</strong></td><td>The other one</td></tr>
</table>
<ul>
<li><strong>Directory vs snoopy in one line each</strong> (this is Ch.20, lesson 15.0a, returning). <em>Snoopy</em>: every cache watches a shared medium and reacts to what others do — simple, no central structure, but every transaction is broadcast, so it stops scaling once the core count is large. <em>Directory</em>: a central table records which caches hold each line, and messages go point-to-point only to those — scales much further, but costs storage and an extra hop of latency.</li>
<li><strong>Why software coherence is rejected, precisely.</strong> Doing it in software means the compiler or programmer must insert flush/invalidate operations around every access to potentially shared data. It is conservative (it flushes when in doubt), it is error-prone, and on an SoC the instruction and energy cost is unacceptable. Hardware does the same job without touching the instruction stream.</li>
</ul>
<p class="nhan">📐 <strong>ACE — Advanced Extensible Interface Coherence Extensions</strong>, ARM's hardware coherence capability. The slide lists five properties, and each one exists for a concrete reason:</p>
<table>
<tr><th>ACE property (slide text)</th><th>Why it is there</th></tr>
<tr><td>Can be configured to implement <strong>either the directory or the snoopy approach</strong></td><td>One IP block serves a 2-core phone and a 16-core server</td></tr>
<tr><td>Designed to support a <strong>wide range of coherent masters with differing capabilities</strong></td><td>SoCs are not made of identical CPUs</td></tr>
<tr><td>Supports coherency <strong>between dissimilar processors, enabling ARM big.Little</strong></td><td>This is exactly the CCI-400 job of slide 15</td></tr>
<tr><td>Supports <strong>I/O coherency for un-cached masters</strong></td><td>The "I/O Coherent Master" box of Figure 21.9</td></tr>
<tr><td>Supports masters with <strong>differing cache line sizes</strong>, differing <strong>internal cache state models</strong>, and masters with <strong>write-back or write-through</strong> caches</td><td>A GPU, a DSP and a CPU genuinely disagree about all three</td></tr>
</table>
<p class="dap-an">✅ Read that last row twice — it is the whole difficulty of heterogeneous coherence. In a homogeneous SMP (Ch.20) every cache has the same line size and the same state machine, so MESI just works. Here one master may use 64-byte lines and MESI while another uses 128-byte lines and MOESI, and ACE has to make them agree. "Differing internal cache state models" is exactly why the next two slides put MESI and MOESI side by side.</p>
<p class="pitfall">⚠️ Coherence is <em>not</em> the same thing as consistency. <strong>Coherence</strong> answers "what is the value of <em>this one</em> location?" — all caches must eventually agree. <strong>Consistency</strong> answers "in what order do writes to <em>different</em> locations become visible?" This chapter is entirely about coherence; a question about reordering or memory barriers is a consistency question.</p>`,
        `<p class="y-chinh">🎯 Phát biểu bài toán cho một phần ba cuối của chương, bằng chính chữ của slide: <strong>"khi tồn tại NHIỀU cache thì cần một cơ chế nhất quán cache để tránh truy cập phải dữ liệu không còn hợp lệ"</strong>. Rồi slide gạt bỏ một lời giải và gọi tên hai lời giải.</p>
<table>
<tr><th>Hướng tiếp cận</th><th>Slide nói gì về nó</th></tr>
<tr><td><strong>Kỹ thuật bằng PHẦN MỀM</strong></td><td>"Có thể" giải theo cách này, <em>NHƯNG</em> <strong>gánh nặng phần mềm ngốn quá nhiều tài nguyên trên một chip SoC</strong> — tức là BỊ LOẠI với lớp hệ thống này</td></tr>
<tr><td><strong>Giao thức THƯ MỤC (directory)</strong></td><td>Một trong hai hướng phần cứng chính</td></tr>
<tr><td><strong>Giao thức NGHE LÉN (snoopy)</strong></td><td>Hướng còn lại</td></tr>
</table>
<ul>
<li><strong>Directory và snoopy, mỗi cái một dòng</strong> (đây là Ch.20, bài 15.0a, quay lại). <em>Snoopy</em>: mọi cache theo dõi một môi trường dùng chung và phản ứng theo việc kẻ khác làm — đơn giản, không cần cấu trúc trung tâm, nhưng mọi giao dịch đều phải PHÁT QUẢNG BÁ nên hết scaling khi số lõi lớn. <em>Directory</em>: một bảng trung tâm ghi cache nào đang giữ dòng nào, thông điệp chỉ gửi ĐIỂM-TỚI-ĐIỂM đúng những cache đó — mở rộng xa hơn nhiều, nhưng tốn bộ nhớ lưu bảng và thêm một chặng độ trễ.</li>
<li><strong>Vì sao nhất quán bằng phần mềm bị loại, nói cho chính xác.</strong> Làm bằng phần mềm nghĩa là trình biên dịch hoặc lập trình viên phải chèn lệnh xả/vô hiệu cache quanh MỌI truy cập vào dữ liệu có thể bị chia sẻ. Nó bảo thủ (nghi ngờ là xả), nó dễ sai, và trên một SoC thì cái giá về số lệnh lẫn về điện là không chấp nhận được. Phần cứng làm đúng việc đó mà không đụng vào dòng lệnh.</li>
</ul>
<p class="nhan">📐 <strong>ACE — Advanced Extensible Interface Coherence Extensions</strong>, năng lực nhất quán bằng phần cứng của ARM. Slide liệt kê năm tính chất, và mỗi tính chất có một lý do cụ thể:</p>
<table>
<tr><th>Tính chất của ACE (chữ trên slide)</th><th>Vì sao nó có mặt</th></tr>
<tr><td>Cấu hình được để chạy <strong>HOẶC hướng directory HOẶC hướng snoopy</strong></td><td>Một khối IP phục vụ cả điện thoại 2 lõi lẫn máy chủ 16 lõi</td></tr>
<tr><td>Thiết kế để đỡ được <strong>nhiều loại chủ bus nhất quán với năng lực KHÁC NHAU</strong></td><td>SoC không được làm từ những CPU giống hệt nhau</td></tr>
<tr><td>Đỡ nhất quán <strong>giữa những bộ xử lý KHÔNG GIỐNG NHAU, cho phép ARM big.Little</strong></td><td>Đây đúng là việc của CCI-400 ở slide 15</td></tr>
<tr><td>Đỡ <strong>nhất quán I/O cho những chủ bus KHÔNG có cache</strong></td><td>Chính là ô "I/O Coherent Master" của Figure 21.9</td></tr>
<tr><td>Đỡ được các chủ bus có <strong>kích thước dòng cache khác nhau</strong>, <strong>mô hình trạng thái cache nội bộ khác nhau</strong>, và chủ bus dùng cache <strong>ghi-trả (write-back) hoặc ghi-xuyên (write-through)</strong></td><td>Một GPU, một DSP và một CPU bất đồng thật sự ở cả ba điểm ấy</td></tr>
</table>
<p class="dap-an">✅ Đọc dòng cuối hai lần — đó là toàn bộ cái khó của nhất quán không đồng nhất. Trong một hệ SMP đồng nhất (Ch.20), mọi cache cùng kích thước dòng và cùng máy trạng thái, nên MESI chạy ngon lành. Ở đây một chủ bus có thể dùng dòng 64 byte với MESI trong khi chủ bus khác dùng dòng 128 byte với MOESI, và ACE phải làm cho chúng thống nhất. "Mô hình trạng thái cache nội bộ khác nhau" chính xác là lý do hai slide tiếp theo đặt MESI và MOESI cạnh nhau.</p>
<p class="pitfall">⚠️ Nhất quán (coherence) KHÔNG phải cùng một thứ với tính nhất quán bộ nhớ (consistency). <strong>Coherence</strong> trả lời "giá trị của <em>MỘT</em> ô nhớ này là bao nhiêu?" — mọi cache rốt cuộc phải đồng ý với nhau. <strong>Consistency</strong> trả lời "các lần ghi vào những ô nhớ KHÁC NHAU hiện ra theo THỨ TỰ nào?". Chương này hoàn toàn nói về coherence; câu hỏi nào về sắp xếp lại thứ tự hay về rào chắn bộ nhớ là câu hỏi về consistency.</p>`],

      [19, 'Figure 21.12 — ARM ACE Cache Line States',
        `<p class="y-chinh">🎯 The five MOESI states arranged as a <strong>2 × 3 grid</strong>, and the grid is the whole insight: the states are not five arbitrary names, they are the <em>product of two independent yes/no questions</em>.</p>
<table>
<tr><th></th><th>Unique</th><th>Shared</th><th>Invalid</th></tr>
<tr><td><strong>Dirty</strong></td><td><strong>Modified</strong></td><td><strong>Owned</strong></td><td>Invalid — one tall cell spanning both rows</td></tr>
<tr><td><strong>Clean</strong></td><td><strong>Exclusive</strong></td><td><strong>Shared</strong></td><td>— same Invalid cell</td></tr>
</table>
<ul>
<li><strong>Question 1 (the columns): who else has a copy?</strong> <em>Unique</em> = I am the only cache holding this line. <em>Shared</em> = other caches may hold it too. <em>Invalid</em> = I do not hold it at all, which is why that column is one tall block, not two cells.</li>
<li><strong>Question 2 (the rows): does memory agree with me?</strong> <em>Clean</em> = my copy matches main memory, so I can silently drop it. <em>Dirty</em> = I have changed it, so <strong>somebody must write it back</strong> before this line can disappear.</li>
<li><strong>Now every state name becomes derivable instead of memorised.</strong> Modified = dirty + unique. Exclusive = clean + unique. Shared = clean + shared. <strong>Owned = dirty + shared</strong> — the cell that plain MESI does not have.</li>
<li><strong>Why Owned is the whole point of MOESI.</strong> In MESI, a dirty line cannot be shared: if another core asks for it, you must write it back to memory first, then both hold a clean Shared copy. In MOESI you may hand the data straight to the requester and keep it dirty, becoming its <em>Owner</em> — the one responsible for eventually writing it back. That deletes one main-memory write per sharing event, and on a chip where cores pass data back and forth constantly, that is a large saving.</li>
<li><strong>Owner = "dirty and responsible".</strong> Exactly one cache may be Owner of a line at a time; the others hold Shared copies. When the Owner evicts the line, it must write back. This is the concept ACE adds on top of the MESI you learned in Ch.20 — the state definitions in lesson 15.0a, the bus transactions in 15.0b.</li>
</ul>
<p class="meo">💡 Build the grid from scratch in the exam rather than memorising five words: draw two columns (unique / shared), two rows (dirty / clean), fill in M, O, E, S, then add Invalid on the side. Five states in ten seconds, and you can never mix up Owned with Exclusive again.</p>
<p class="pitfall">⚠️ The slide contains a spelling error: the large right-hand block is printed "<strong>Invaiid</strong>". The state is <strong>Invalid</strong>. Copy the grid, not the typo.</p>`,
        `<p class="y-chinh">🎯 Năm trạng thái MOESI xếp thành một <strong>lưới 2 × 3</strong>, và chính cái lưới là toàn bộ cái hay: các trạng thái không phải năm cái tên tuỳ tiện, chúng là <em>TÍCH của hai câu hỏi có/không độc lập nhau</em>.</p>
<table>
<tr><th></th><th>Unique (độc bản)</th><th>Shared (chia sẻ)</th><th>Invalid</th></tr>
<tr><td><strong>Dirty (bẩn)</strong></td><td><strong>Modified</strong></td><td><strong>Owned</strong></td><td>Invalid — một ô CAO trùm cả hai hàng</td></tr>
<tr><td><strong>Clean (sạch)</strong></td><td><strong>Exclusive</strong></td><td><strong>Shared</strong></td><td>— vẫn là ô Invalid ấy</td></tr>
</table>
<ul>
<li><strong>Câu hỏi 1 (các CỘT): còn ai giữ bản sao nữa không?</strong> <em>Unique</em> = chỉ mình tôi giữ dòng này. <em>Shared</em> = cache khác cũng có thể đang giữ. <em>Invalid</em> = tôi KHÔNG giữ gì cả, và vì thế cột đó là một khối CAO liền chứ không phải hai ô.</li>
<li><strong>Câu hỏi 2 (các HÀNG): bộ nhớ có khớp với tôi không?</strong> <em>Clean</em> = bản của tôi trùng với bộ nhớ chính, nên tôi vứt đi lúc nào cũng được, im lặng. <em>Dirty</em> = tôi đã sửa nó, nên <strong>PHẢI có ai đó ghi trả</strong> trước khi dòng này biến mất.</li>
<li><strong>Bây giờ mọi cái tên trạng thái SUY RA ĐƯỢC chứ không phải học thuộc.</strong> Modified = bẩn + độc bản. Exclusive = sạch + độc bản. Shared = sạch + chia sẻ. <strong>Owned = bẩn + chia sẻ</strong> — đúng cái ô mà MESI thuần không có.</li>
<li><strong>Vì sao Owned mới là toàn bộ ý nghĩa của MOESI.</strong> Trong MESI, dòng BẨN không được phép chia sẻ: lõi khác hỏi xin thì bạn phải ghi trả xuống bộ nhớ trước, rồi cả hai mới giữ bản Shared sạch. Trong MOESI bạn được đưa thẳng dữ liệu cho kẻ hỏi mà vẫn giữ nó BẨN, và trở thành <em>CHỦ (Owner)</em> của nó — kẻ chịu trách nhiệm ghi trả sau này. Việc đó xoá đi MỘT lần ghi bộ nhớ chính cho mỗi lần chia sẻ, mà trên một con chip nơi các lõi chuyền dữ liệu qua lại liên tục thì đó là khoản tiết kiệm lớn.</li>
<li><strong>Owner = "bẩn và chịu trách nhiệm".</strong> Tại một thời điểm chỉ ĐÚNG MỘT cache được làm Owner của một dòng; những cache còn lại giữ bản Shared. Khi Owner đuổi dòng đó ra, nó phải ghi trả. Đây là khái niệm ACE thêm vào bên trên cái MESI bạn đã học ở Ch.20 — định nghĩa trạng thái ở bài 15.0a, các giao dịch bus ở bài 15.0b.</li>
</ul>
<p class="meo">💡 Vào phòng thi hãy DỰNG LẠI cái lưới thay vì học thuộc năm chữ: vẽ hai cột (độc bản / chia sẻ), hai hàng (bẩn / sạch), điền M, O, E, S, rồi thêm Invalid ra bên cạnh. Năm trạng thái trong mười giây, và bạn sẽ không bao giờ lẫn Owned với Exclusive nữa.</p>
<p class="pitfall">⚠️ Slide có lỗi chính tả: khối lớn bên phải in là "<strong>Invaiid</strong>". Trạng thái đúng là <strong>Invalid</strong>. Hãy chép cái lưới, đừng chép cái lỗi.</p>`],

      [20, 'Table 21.2 — Comparison of States in Snoop Protocols (MESI vs MOESI)',
        `<p class="y-chinh">🎯 The two protocols laid out row by row so you can see precisely what the extra <strong>Owned</strong> state buys. The slide labels the halves "(a) MESIM" and "(b) MOISI", and notes the table is on page 756 of the textbook.</p>
<p class="nhan">📐 <strong>(a) MESI — four states, exactly as printed on the slide:</strong></p>
<table>
<tr><th></th><th>Modified</th><th>Exclusive</th><th>Shared</th><th>Invalid</th></tr>
<tr><td><strong>Clean/Dirty</strong></td><td>Dirty</td><td>Clean</td><td>Clean</td><td>N/A</td></tr>
<tr><td><strong>Unique?</strong></td><td>Yes</td><td>Yes</td><td><strong>No</strong></td><td>N/A</td></tr>
<tr><td><strong>Can write?</strong></td><td>Yes</td><td>Yes</td><td><strong>No</strong></td><td>N/A</td></tr>
<tr><td><strong>Can forward?</strong></td><td>Yes</td><td>Yes</td><td>Yes</td><td>N/A</td></tr>
<tr><td><strong>Comments</strong></td><td>Must write back to share or replace</td><td>Transitions to M on write</td><td>Shared implies clean, can forward</td><td>Cannot read</td></tr>
</table>
<ul>
<li><strong>The row that defines MESI is "Shared implies clean".</strong> Because a shared line must be clean, going from Modified to shared <em>forces</em> a write-back — the Modified comment says it outright: "Must write back to share or replace".</li>
<li><strong>Why Exclusive exists at all.</strong> E and S are both clean, so why distinguish them? Because writing to an E line needs <em>no bus traffic</em> — nobody else has it, so you just flip to M. Writing to an S line requires invalidating everyone first. E is a free pass for the very common "load then modify" pattern.</li>
<li><strong>"Can forward" means cache-to-cache transfer.</strong> Answering another cache's miss directly, instead of making it go to DRAM. All valid states can do it, which is why the i7's ring and ARM's SCU (slide 27) invest in it.</li>
</ul>
<p class="nhan">📐 <strong>(b) MOESI — five states. This is where the slide needs care:</strong></p>
<table>
<tr><th></th><th>Modified</th><th>Owned</th><th>Exclusive</th><th>Shared</th><th>Invalid</th></tr>
<tr><td><strong>Clean/Dirty</strong> (as printed)</td><td>Dirty</td><td>Dirty</td><td>Clean</td><td>Either</td><td>N/A</td></tr>
<tr><td><strong>Unique?</strong> (as printed)</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>N/A</td></tr>
<tr><td><strong>Can write?</strong> (as printed)</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>N/A</td></tr>
<tr><td><strong>Can forward?</strong></td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>N/A</td></tr>
<tr><td><strong>Comments</strong></td><td>Can share without write back</td><td>Must write back to transition</td><td>Transitions to M on write</td><td>Shared, can be dirty or clean</td><td>Cannot read</td></tr>
</table>
<p class="dap-an">✅ <strong>The slide is wrong on two rows of table (b), and you should say so rather than copy it.</strong> As printed, "Unique?" and "Can write?" are <em>Yes</em> for all four valid states — including Shared. That cannot be right, and three independent things in this same deck prove it: (1) Figure 21.12 on slide 19 puts <strong>Owned and Shared in the "Shared" column, not "Unique"</strong>; (2) the table's own Comments row says Owned "must write back to transition", which is meaningless if it could already write; (3) a protocol where every cache may write a Shared line freely provides no coherence at all. The consistent reading is <strong>Unique? = Yes / No / Yes / No</strong> and <strong>Can write? = Yes / No / Yes / No</strong> across M / O / E / S. Learn the logic of the grid on slide 19; do not memorise this table's two broken rows.</p>
<p class="dap-an">✅ Second correction, this one only in the labels: the slide heads the halves "<strong>(a) MESIM</strong>" and "<strong>(b) MOISI</strong>". Read the column names — (a) has Modified, Exclusive, Shared, Invalid = <strong>MESI</strong>; (b) has Modified, Owned, Exclusive, Shared, Invalid = <strong>MOESI</strong>. The chapter's own summary slide (slide 30) writes "<em>Cache coherence and the MOESI model</em>", which settles it.</p>
<p class="meo">💡 The one comparison worth carrying into the exam: <strong>MESI must write back before sharing a dirty line; MOESI can share it dirty and let the Owner write back later.</strong> Compare the two Modified comments in the tables above — "Must write back to share or replace" versus "Can share without write back". That single sentence pair <em>is</em> the difference between the protocols.</p>`,
        `<p class="y-chinh">🎯 Hai giao thức bày ra từng dòng để bạn thấy chính xác trạng thái <strong>Owned</strong> thêm vào mua được gì. Slide đặt tên hai nửa là "(a) MESIM" và "(b) MOISI", và ghi chú rằng bảng này nằm ở trang 756 của giáo trình.</p>
<p class="nhan">📐 <strong>(a) MESI — bốn trạng thái, chép đúng như in trên slide:</strong></p>
<table>
<tr><th></th><th>Modified</th><th>Exclusive</th><th>Shared</th><th>Invalid</th></tr>
<tr><td><strong>Sạch/Bẩn</strong></td><td>Bẩn</td><td>Sạch</td><td>Sạch</td><td>Không áp dụng</td></tr>
<tr><td><strong>Độc bản?</strong></td><td>Có</td><td>Có</td><td><strong>Không</strong></td><td>Không áp dụng</td></tr>
<tr><td><strong>Ghi được?</strong></td><td>Có</td><td>Có</td><td><strong>Không</strong></td><td>Không áp dụng</td></tr>
<tr><td><strong>Chuyển tiếp được?</strong></td><td>Có</td><td>Có</td><td>Có</td><td>Không áp dụng</td></tr>
<tr><td><strong>Ghi chú của slide</strong></td><td>Phải ghi trả mới chia sẻ hoặc thay thế được</td><td>Chuyển sang M khi ghi</td><td>Shared kéo theo sạch, chuyển tiếp được</td><td>Không đọc được</td></tr>
</table>
<ul>
<li><strong>Dòng định nghĩa MESI là "Shared kéo theo SẠCH".</strong> Vì dòng đang chia sẻ bắt buộc phải sạch, nên đi từ Modified sang chia sẻ là <em>BUỘC</em> phải ghi trả — ghi chú của Modified nói thẳng: "Phải ghi trả mới chia sẻ hoặc thay thế được".</li>
<li><strong>Vì sao lại cần Exclusive.</strong> E và S đều sạch, vậy phân biệt làm gì? Vì ghi vào dòng E <em>KHÔNG tốn lưu lượng bus nào</em> — chẳng ai khác giữ nó, bạn chỉ việc lật sang M. Ghi vào dòng S thì phải vô hiệu hoá của cả đám trước. E là tấm vé miễn phí cho cái mẫu cực kỳ phổ biến "nạp lên rồi sửa".</li>
<li><strong>"Chuyển tiếp được" nghĩa là truyền cache-sang-cache.</strong> Trả lời thẳng cú trượt của cache khác, thay vì bắt nó xuống DRAM. Mọi trạng thái hợp lệ đều làm được, và đó là lý do vòng ring của i7 và khối SCU của ARM (slide 27) đầu tư vào việc này.</li>
</ul>
<p class="nhan">📐 <strong>(b) MOESI — năm trạng thái. Đây là chỗ phải đọc cẩn thận:</strong></p>
<table>
<tr><th></th><th>Modified</th><th>Owned</th><th>Exclusive</th><th>Shared</th><th>Invalid</th></tr>
<tr><td><strong>Sạch/Bẩn</strong> (như in)</td><td>Bẩn</td><td>Bẩn</td><td>Sạch</td><td>Sạch hay bẩn đều được</td><td>Không áp dụng</td></tr>
<tr><td><strong>Độc bản?</strong> (như in)</td><td>Có</td><td>Có</td><td>Có</td><td>Có</td><td>Không áp dụng</td></tr>
<tr><td><strong>Ghi được?</strong> (như in)</td><td>Có</td><td>Có</td><td>Có</td><td>Có</td><td>Không áp dụng</td></tr>
<tr><td><strong>Chuyển tiếp được?</strong></td><td>Có</td><td>Có</td><td>Có</td><td>Có</td><td>Không áp dụng</td></tr>
<tr><td><strong>Ghi chú của slide</strong></td><td>Chia sẻ được mà KHÔNG cần ghi trả</td><td>Phải ghi trả mới chuyển trạng thái được</td><td>Chuyển sang M khi ghi</td><td>Đang chia sẻ, có thể bẩn hoặc sạch</td><td>Không đọc được</td></tr>
</table>
<p class="dap-an">✅ <strong>Slide SAI ở hai dòng của bảng (b), và bạn nên nói ra chứ đừng chép lại.</strong> Như in trên slide, "Độc bản?" và "Ghi được?" đều là <em>Có</em> cho cả bốn trạng thái hợp lệ — kể cả Shared. Điều đó không thể đúng, và ba thứ độc lập nhau ngay trong chính deck này chứng minh: (1) Figure 21.12 ở slide 19 xếp <strong>Owned và Shared vào cột "Shared", không phải cột "Unique"</strong>; (2) chính dòng Ghi chú của bảng nói Owned "phải ghi trả mới chuyển trạng thái được", câu đó vô nghĩa nếu nó vốn đã ghi được; (3) một giao thức mà cache nào cũng được tự do ghi vào dòng Shared thì không đảm bảo nhất quán gì hết. Cách đọc nhất quán là <strong>Độc bản? = Có / Không / Có / Không</strong> và <strong>Ghi được? = Có / Không / Có / Không</strong> cho M / O / E / S. Hãy học cái LOGIC của lưới ở slide 19; đừng học thuộc hai dòng hỏng của bảng này.</p>
<p class="dap-an">✅ Chỗ sai thứ hai, lần này chỉ ở NHÃN: slide đặt tên hai nửa là "<strong>(a) MESIM</strong>" và "<strong>(b) MOISI</strong>". Đọc tên các cột mà xem — (a) có Modified, Exclusive, Shared, Invalid = <strong>MESI</strong>; (b) có Modified, Owned, Exclusive, Shared, Invalid = <strong>MOESI</strong>. Chính slide tổng kết của chương (slide 30) viết "<em>Cache coherence and the MOESI model</em>", thế là ngã ngũ.</p>
<p class="meo">💡 Một phép so sánh đáng mang vào phòng thi: <strong>MESI phải ghi trả TRƯỚC khi chia sẻ một dòng bẩn; MOESI chia sẻ nguyên trạng thái bẩn và để Owner ghi trả sau.</strong> So hai ghi chú của cột Modified trong hai bảng trên — "Phải ghi trả mới chia sẻ được" với "Chia sẻ được mà không cần ghi trả". Đúng cặp câu đó <em>CHÍNH LÀ</em> khác biệt giữa hai giao thức.</p>`],

      [21, 'Figure 21.13 — Intel Core i7-5960X Block Diagram',
        `<p class="y-chinh">🎯 The first of the chapter's three real chips, drawn twice: (a) a logical block diagram, (b) the physical layout on the die. It is <strong>Figure 21.6(d), "shared L3", built for real</strong>.</p>
<table>
<tr><th>Level</th><th>Size and ownership on this chip</th><th>Maps to</th></tr>
<tr><td><strong>Cores</strong></td><td>8 (Core 0 … Core 7)</td><td>the n of Figure 21.6</td></tr>
<tr><td><strong>L1</strong></td><td>32 kB L1-I + 32 kB L1-D, <em>private per core</em></td><td>always private, all four panels</td></tr>
<tr><td><strong>L2</strong></td><td>256 kB, <em>private per core</em></td><td>the "dedicated L2" of panel (b)</td></tr>
<tr><td><strong>L3</strong></td><td><strong>20 MB, shared by all eight</strong></td><td>the "shared L3" of panel (d)</td></tr>
<tr><td><strong>Memory</strong></td><td>DDR4 Memory Controllers, <strong>4 × 8B @ 2.133 GT/s</strong></td><td>on-die memory controller</td></tr>
<tr><td><strong>I/O</strong></td><td>PCI Express, <strong>40 lanes @ 8 GT/s</strong></td><td>on-die I/O</td></tr>
</table>
<p class="nhan">📐 <strong>Two numbers worth working out, because the slide gives you the pieces.</strong> Memory: 4 channels × 8 bytes × 2,133 GT/s = 4 × 8 × 2,133 ≈ <strong>68 GB/s</strong> of DRAM bandwidth. Cache: 20 MB of L3 shared by 8 cores is <strong>2,5 MB per core</strong> on average — but the whole point of sharing is that one active core may use far more than its average share while the others idle.</p>
<ul>
<li><strong>Read panel (b), the physical layout — it explains panel (a).</strong> Eight core tiles sit in two rows of four, with the <strong>Shared L3 Cache</strong> as one long band down the middle, I/O on one edge and the Memory Controller on the other. The L3 is physically <em>between</em> the cores because it must be reachable from all of them at similar latency. Floor planning is architecture here, not decoration.</li>
<li><strong>Note that L2 is private and small (256 kB).</strong> That is a deliberate choice: a small private L2 keeps latency low and lets the big capacity live in the shared L3, where it can be reallocated dynamically. Compare the TI chip on slide 14, which gave each DSP a full 1 MB private L2 — a different workload, a different answer.</li>
<li><strong>Coherence load.</strong> With private L1 and private L2 per core, the same line can live in up to 8 L1s and 8 L2s. Intel's inclusive L3 acts as a <em>snoop filter</em>: because everything in a private cache is also in L3, the L3 tags alone can tell you which cores to bother. This is the same idea as the "duplicated tag RAMs" on slide 27, just implemented differently.</li>
<li><strong>Everything is on the die.</strong> Memory controller and PCIe used to be separate chips (the "northbridge"). Moving them on-die removed a hop and let the interconnect of Figure 21.7 carry all traffic — cores, cache, memory and I/O on one network.</li>
</ul>
<p class="pitfall">⚠️ GT/s is <strong>giga-transfers per second</strong>, not gigabytes and not GHz. You must multiply by the width to get bandwidth — which is exactly why the figure prints "4×8B @ 2.133 GT/s" rather than a single byte-rate: it is handing you the two factors to multiply.</p>`,
        `<p class="y-chinh">🎯 Con chip thật đầu tiên trong ba con của chương, vẽ hai lần: (a) sơ đồ khối LOGIC, (b) bố trí VẬT LÝ trên đế. Nó chính là <strong>Figure 21.6(d), "L3 dùng chung", dựng ngoài đời</strong>.</p>
<table>
<tr><th>Tầng</th><th>Kích thước và quyền sở hữu trên chip này</th><th>Ứng với</th></tr>
<tr><td><strong>Lõi</strong></td><td>8 lõi (Core 0 … Core 7)</td><td>chữ n của Figure 21.6</td></tr>
<tr><td><strong>L1</strong></td><td>32 kB L1-I + 32 kB L1-D, <em>RIÊNG mỗi lõi</em></td><td>luôn riêng, cả bốn ô</td></tr>
<tr><td><strong>L2</strong></td><td>256 kB, <em>RIÊNG mỗi lõi</em></td><td>"L2 riêng" của ô (b)</td></tr>
<tr><td><strong>L3</strong></td><td><strong>20 MB, cả tám lõi DÙNG CHUNG</strong></td><td>"L3 dùng chung" của ô (d)</td></tr>
<tr><td><strong>Bộ nhớ</strong></td><td>DDR4 Memory Controllers, <strong>4 × 8B @ 2.133 GT/s</strong></td><td>bộ điều khiển bộ nhớ nằm trên đế</td></tr>
<tr><td><strong>Vào/ra</strong></td><td>PCI Express, <strong>40 làn @ 8 GT/s</strong></td><td>I/O nằm trên đế</td></tr>
</table>
<p class="nhan">📐 <strong>Hai con số đáng tính ra, vì slide đã đưa đủ nguyên liệu.</strong> Bộ nhớ: 4 kênh × 8 byte × 2,133 GT/s = 4 × 8 × 2,133 ≈ <strong>68 GB/s</strong> băng thông DRAM. Cache: 20 MB L3 chia cho 8 lõi là trung bình <strong>2,5 MB mỗi lõi</strong> — nhưng toàn bộ ý nghĩa của việc dùng chung nằm ở chỗ một lõi đang hoạt động có thể xài NHIỀU HƠN phần trung bình của nó rất nhiều khi các lõi kia nằm không.</p>
<ul>
<li><strong>Đọc ô (b), bố trí vật lý — nó giải thích ô (a).</strong> Tám ô lõi xếp thành hai hàng bốn, với <strong>Shared L3 Cache</strong> là một dải dài chạy giữa, I/O ở một rìa và Memory Controller ở rìa kia. L3 nằm VẬT LÝ <em>GIỮA</em> các lõi vì nó phải với tới được từ mọi lõi với độ trễ tương đương. Ở đây bố trí mặt bằng CHÍNH LÀ kiến trúc, không phải trang trí.</li>
<li><strong>Để ý L2 là RIÊNG và NHỎ (256 kB).</strong> Đó là lựa chọn có chủ ý: L2 riêng nhỏ thì độ trễ thấp, còn dung lượng lớn thì để dành cho L3 dùng chung, nơi nó có thể được phân bổ lại động. So với con chip TI ở slide 14 — nó cho mỗi DSP hẳn 1 MB L2 riêng; tải khác nhau thì đáp án khác nhau.</li>
<li><strong>Gánh nặng nhất quán.</strong> Với L1 riêng và L2 riêng cho từng lõi, cùng một dòng có thể nằm trong tới 8 cái L1 và 8 cái L2. L3 kiểu bao hàm (inclusive) của Intel đóng vai <em>BỘ LỌC SNOOP</em>: vì mọi thứ trong cache riêng đều cũng có trong L3, nên chỉ cần tra thẻ (tag) của L3 là biết phải làm phiền những lõi nào. Đây đúng là ý tưởng "duplicated tag RAMs" ở slide 27, chỉ khác cách cài đặt.</li>
<li><strong>Mọi thứ nằm TRÊN ĐẾ.</strong> Bộ điều khiển bộ nhớ và PCIe xưa là chip riêng ("northbridge"). Đưa chúng lên đế xoá đi một chặng và để mạng liên kết của Figure 21.7 cõng toàn bộ lưu lượng — lõi, cache, bộ nhớ và vào/ra trên cùng một mạng.</li>
</ul>
<p class="pitfall">⚠️ GT/s là <strong>giga-transfer mỗi giây</strong>, KHÔNG phải gigabyte và cũng không phải GHz. Phải nhân với BỀ RỘNG mới ra băng thông — và đó chính là lý do hình in "4×8B @ 2.133 GT/s" thay vì in thẳng một con số byte/giây: nó đang đưa cho bạn hai thừa số để nhân.</p>`],

      [22, 'Figure 21.14 — ARM Cortex-A15 MPCore Chip Block Diagram',
        `<p class="y-chinh">🎯 The second real chip, and structurally the opposite choice from the i7: <strong>Figure 21.6(c), "shared L2"</strong>. Four cores, each with L1 ICache, L1 DCache and TLBs; below them an "L2 memory system" containing a <strong>Snoop Control Unit</strong> and one <strong>L2 cache</strong> shared by all four. Above them sit Debug Unit &amp; Interface, Trace, <strong>GIC</strong> (fed by Interrupts) and Generic Timer (producing Timer Events).</p>
<table>
<tr><th>Block</th><th>Job</th><th>Covered on</th></tr>
<tr><td><strong>Core 0…3 + L1 I/D + TLBs</strong></td><td>the four identical cores; TLBs are the address-translation caches of Ch.9</td><td>slide 16 (the A15 pipeline)</td></tr>
<tr><td><strong>Snoop Control Unit (SCU)</strong></td><td>keeps the four L1 D-caches coherent with each other and with L2</td><td>slide 27, in detail</td></tr>
<tr><td><strong>L2 cache</strong></td><td>one shared cache for all four cores</td><td>Figure 21.6(c)</td></tr>
<tr><td><strong>GIC</strong></td><td>routes external interrupts to whichever core should take them</td><td>slides 23–26</td></tr>
<tr><td><strong>Generic Timer</strong></td><td>per-core timers producing Timer Events (OS ticks, watchdogs)</td><td>slide 25, "private timer and/or watchdog interrupts"</td></tr>
<tr><td><strong>Debug Unit &amp; Trace</strong></td><td>on-chip observation — indispensable when n cores interleave</td><td>—</td></tr>
</table>
<ul>
<li><strong>Why shared L2 here and private L2 on the i7.</strong> Four cores, not eight, so contention on one shared L2 is manageable — and sharing means shared data is stored once and a single active core may use the whole L2. On an eight-core desktop part that shared port becomes a bottleneck, so Intel adds a private L2 and moves sharing down to L3. <strong>Same figure, different core count, different panel.</strong></li>
<li><strong>The SCU is why this layout is affordable.</strong> With a shared L2 there is exactly one copy of each line below L1, so coherence only has to be maintained among four L1 D-caches — much simpler than the private-L2 case of Figure 21.6(b). The SCU sits right next to L2 for that reason.</li>
<li><strong>TLBs are drawn explicitly, and that is deliberate.</strong> Each core translates addresses independently, so a page-table change on one core must be propagated to the others (TLB shootdown). Multicore turns an OS bookkeeping detail from Ch.9 into a hardware-visible cost.</li>
<li><strong>Notice the top row is all about observability and time.</strong> Debug, Trace, interrupts and timers get as much diagram space as the caches. On a single core you can reason about "what happened"; on four cores you need hardware help to even see it.</li>
<li><strong>This block is the "big" cluster of Figure 21.9.</strong> Slide 15 showed two A15s plus two A7s; here is what an A15 cluster looks like on its own, with four cores instead of two.</li>
</ul>
<p class="meo">💡 Compare the two chips in one line: <strong>i7 = 8 cores, private L2, shared L3 (panel d)</strong> · <strong>Cortex-A15 MPCore = 4 cores, no private L2, shared L2 (panel c)</strong>. If an exam asks you to classify a block diagram, count the cores and find the first <em>shared</em> level — those two facts pick the panel.</p>`,
        `<p class="y-chinh">🎯 Con chip thật thứ hai, và về cấu trúc thì nó chọn NGƯỢC với i7: <strong>Figure 21.6(c), "L2 dùng chung"</strong>. Bốn lõi, mỗi lõi có L1 ICache, L1 DCache và TLBs; bên dưới là "L2 memory system" chứa một <strong>Snoop Control Unit</strong> và MỘT <strong>L2 cache</strong> cho cả bốn lõi. Phía trên là Debug Unit &amp; Interface, Trace, <strong>GIC</strong> (nhận Interrupts) và Generic Timer (sinh Timer Events).</p>
<table>
<tr><th>Khối</th><th>Nhiệm vụ</th><th>Nói kỹ ở</th></tr>
<tr><td><strong>Core 0…3 + L1 I/D + TLBs</strong></td><td>bốn lõi GIỐNG NHAU; TLB là cache dịch địa chỉ của Ch.9</td><td>slide 16 (pipeline A15)</td></tr>
<tr><td><strong>Snoop Control Unit (SCU)</strong></td><td>giữ bốn cái L1 D-cache nhất quán với nhau và với L2</td><td>slide 27, rất chi tiết</td></tr>
<tr><td><strong>L2 cache</strong></td><td>một cache dùng chung cho cả bốn lõi</td><td>Figure 21.6(c)</td></tr>
<tr><td><strong>GIC</strong></td><td>định tuyến ngắt ngoài tới đúng lõi phải nhận</td><td>slide 23–26</td></tr>
<tr><td><strong>Generic Timer</strong></td><td>bộ định thời riêng từng lõi, sinh Timer Events (nhịp hệ điều hành, watchdog)</td><td>slide 25, "ngắt định thời riêng và/hoặc watchdog"</td></tr>
<tr><td><strong>Debug Unit &amp; Trace</strong></td><td>quan sát ngay trên chip — không thể thiếu khi n lõi xen kẽ nhau</td><td>—</td></tr>
</table>
<ul>
<li><strong>Vì sao ở đây L2 dùng chung mà trên i7 lại L2 riêng.</strong> Bốn lõi chứ không phải tám, nên tranh chấp trên một L2 dùng chung còn chịu được — mà dùng chung thì dữ liệu chia sẻ chỉ lưu MỘT bản và một lõi đang chạy được xài cả L2. Trên con chip để bàn tám lõi thì cái cổng dùng chung ấy thành nút thắt, nên Intel thêm L2 riêng và đẩy chỗ dùng chung xuống L3. <strong>Cùng một hình, khác số lõi, khác ô.</strong></li>
<li><strong>SCU là thứ khiến bố cục này có giá phải chăng.</strong> Với L2 dùng chung thì bên dưới L1 chỉ có ĐÚNG MỘT bản sao của mỗi dòng, nên nhất quán chỉ phải giữ giữa bốn cái L1 D-cache — đơn giản hơn hẳn ca L2 riêng của Figure 21.6(b). SCU nằm ngay sát L2 chính vì lý do đó.</li>
<li><strong>TLB được vẽ TƯỜNG MINH, và đó là có chủ ý.</strong> Mỗi lõi dịch địa chỉ độc lập, nên một thay đổi bảng trang trên lõi này phải lan sang các lõi kia (TLB shootdown). Đa lõi biến một chi tiết sổ sách của hệ điều hành ở Ch.9 thành một khoản chi phí NHÌN THẤY ĐƯỢC ở phần cứng.</li>
<li><strong>Để ý hàng trên cùng toàn là chuyện QUAN SÁT ĐƯỢC và THỜI GIAN.</strong> Debug, Trace, ngắt và định thời chiếm chỗ trong sơ đồ ngang với cả đám cache. Trên một lõi bạn còn suy luận được "chuyện gì đã xảy ra"; trên bốn lõi thì phải có phần cứng đỡ mới NHÌN THẤY nổi.</li>
<li><strong>Khối này chính là cụm "big" của Figure 21.9.</strong> Slide 15 vẽ hai lõi A15 cộng hai lõi A7; còn đây là hình dạng của riêng một cụm A15, với bốn lõi thay vì hai.</li>
</ul>
<p class="meo">💡 So hai con chip trong một dòng: <strong>i7 = 8 lõi, L2 riêng, L3 dùng chung (ô d)</strong> · <strong>Cortex-A15 MPCore = 4 lõi, không có L2 riêng, L2 dùng chung (ô c)</strong>. Đề bắt phân loại một sơ đồ khối thì hãy đếm số lõi và tìm tầng ĐẦU TIÊN được dùng chung — hai dữ kiện đó chọn ra ô.</p>`],

      [23, 'Interrupt Handling — what the Generic Interrupt Controller (GIC) provides',
        `<p class="y-chinh">🎯 Why a multicore chip needs a whole subsystem just for interrupts: on one core "interrupt the processor" is unambiguous; on four cores somebody has to decide <strong>which core</strong>, <strong>in what order</strong>, and <strong>whether it may be interrupted again</strong>.</p>
<table>
<tr><th>The GIC provides (slide list)</th><th>The multicore problem it solves</th></tr>
<tr><td><strong>Masking</strong> of interrupts</td><td>a core in a critical section must be able to say "not now"</td></tr>
<tr><td><strong>Prioritization</strong> of the interrupts</td><td>with many sources and few cores, order matters</td></tr>
<tr><td><strong>Distribution</strong> of the interrupts to the target A15 cores</td><td>the genuinely new problem: <em>which</em> core takes it</td></tr>
<tr><td><strong>Tracking the status</strong> of interrupts</td><td>the same interrupt may be Pending on one core and Active on another — slide 25</td></tr>
<tr><td><strong>Generation</strong> of interrupts <strong>by software</strong></td><td>one core must be able to poke another (IPIs)</td></tr>
</table>
<p class="nhan">📐 The slide's second box states four facts about the GIC itself:</p>
<ul>
<li><strong>It is memory mapped.</strong> So configuring it is just load/store to reserved addresses — no special instructions. That is the memory-mapped I/O of Ch.8, applied to the interrupt controller.</li>
<li><strong>It is a single functional unit placed in the system alongside the A15 cores</strong> — beside them, not inside any one of them. That is the only arrangement that can be fair: a controller living inside core 0 could not route impartially.</li>
<li><strong>It enables the number of interrupts supported to be independent of the A15 core design.</strong> A big design decision: a chip vendor can attach 200 peripherals without redesigning the core. Separating "how many sources" from "how the core works" is what makes one core reusable across dozens of SoCs.</li>
<li><strong>It is accessed by the A15 cores using a private interface through the SCU.</strong> Note <em>private interface</em> — each core has its own view of the controller (its own mask and its own priority threshold), even though there is one shared GIC.</li>
</ul>
<ul>
<li><strong>Connect back to Ch.8 and Ch.16.</strong> You already know what an interrupt does to one processor: finish the current instruction, save state, vector to a handler. Nothing here changes that. What multicore adds is purely the <em>routing and arbitration</em> layer in front of it.</li>
<li><strong>Connect back to slide 15.</strong> The GIC-400 box at the top of Figure 21.9 is this unit, and in big.Little it must route to <em>two different kinds of core</em> — another reason it cannot live inside a core.</li>
</ul>
<p class="meo">💡 One sentence: <strong>on a single core an interrupt is an event; on a multicore it is a routing decision.</strong></p>`,
        `<p class="y-chinh">🎯 Vì sao chip đa lõi cần cả một phân hệ chỉ để lo ngắt: trên một lõi thì "ngắt bộ xử lý" là câu không mơ hồ; trên bốn lõi thì phải có ai đó quyết định <strong>LÕI NÀO</strong>, <strong>THEO THỨ TỰ NÀO</strong>, và <strong>có được ngắt tiếp hay không</strong>.</p>
<table>
<tr><th>GIC cung cấp (danh sách trên slide)</th><th>Bài toán đa lõi mà nó giải</th></tr>
<tr><td><strong>Che (masking)</strong> ngắt</td><td>lõi đang ở trong đoạn tới hạn phải nói được "khoan đã"</td></tr>
<tr><td><strong>Sắp thứ tự ưu tiên</strong> các ngắt</td><td>nhiều nguồn mà ít lõi thì thứ tự có ý nghĩa</td></tr>
<tr><td><strong>Phân phối</strong> ngắt tới các lõi A15 đích</td><td>bài toán MỚI thật sự: <em>LÕI NÀO</em> nhận</td></tr>
<tr><td><strong>Theo dõi trạng thái</strong> của các ngắt</td><td>cùng một ngắt có thể đang Pending ở lõi này và Active ở lõi kia — slide 25</td></tr>
<tr><td><strong>Sinh ngắt BẰNG PHẦN MỀM</strong></td><td>một lõi phải chọc được sang lõi khác (IPI)</td></tr>
</table>
<p class="nhan">📐 Ô thứ hai của slide nêu bốn sự thật về chính GIC:</p>
<ul>
<li><strong>Nó được ánh xạ vào bộ nhớ (memory mapped).</strong> Nên cấu hình nó chỉ là load/store vào những địa chỉ dành riêng — không cần lệnh đặc biệt nào. Đó là vào/ra ánh xạ bộ nhớ của Ch.8, áp vào bộ điều khiển ngắt.</li>
<li><strong>Nó là MỘT đơn vị chức năng đặt trong hệ thống, BÊN CẠNH các lõi A15</strong> — cạnh chúng, không nằm trong lõi nào cả. Đó là cách bố trí duy nhất có thể công bằng: một bộ điều khiển nằm bên trong lõi 0 thì không định tuyến vô tư được.</li>
<li><strong>Nó cho phép số lượng ngắt mà hệ thống đỡ được ĐỘC LẬP với thiết kế lõi A15.</strong> Một quyết định thiết kế lớn: nhà làm chip gắn thêm 200 ngoại vi mà không phải thiết kế lại lõi. Tách "có bao nhiêu nguồn ngắt" khỏi "lõi hoạt động ra sao" chính là thứ khiến một cái lõi dùng lại được trên hàng chục con SoC.</li>
<li><strong>Các lõi A15 truy cập nó qua một GIAO DIỆN RIÊNG, đi xuyên SCU.</strong> Để ý chữ <em>giao diện riêng</em> — mỗi lõi có góc nhìn riêng của mình vào bộ điều khiển (mặt nạ che riêng, ngưỡng ưu tiên riêng), dù chỉ có MỘT cái GIC dùng chung.</li>
</ul>
<ul>
<li><strong>Nối ngược về Ch.8 và Ch.16.</strong> Bạn đã biết ngắt làm gì với MỘT bộ xử lý: kết thúc lệnh hiện tại, lưu trạng thái, nhảy tới trình phục vụ. Không có gì ở đây thay đổi điều đó. Thứ mà đa lõi thêm vào thuần tuý là tầng <em>ĐỊNH TUYẾN VÀ PHÂN XỬ</em> nằm phía trước.</li>
<li><strong>Nối ngược về slide 15.</strong> Ô GIC-400 ở đỉnh Figure 21.9 chính là đơn vị này, và trong big.Little nó còn phải định tuyến tới <em>HAI LOẠI LÕI KHÁC NHAU</em> — thêm một lý do nữa để nó không thể nằm bên trong một cái lõi.</li>
</ul>
<p class="meo">💡 Một câu: <strong>trên một lõi, ngắt là một SỰ KIỆN; trên đa lõi, ngắt là một QUYẾT ĐỊNH ĐỊNH TUYẾN.</strong></p>`],

      [24, 'GIC — the two functional requirements and the three routing modes',
        `<p class="y-chinh">🎯 The GIC's job reduced to two requirements and three delivery modes. Memorise the three modes; they are the classic exam item on this block.</p>
<table>
<tr><th>Designed to satisfy TWO functional requirements</th></tr>
<tr><td>1. Provide a means of <strong>routing an interrupt request to a single CPU or multiple CPUs</strong> as required</td></tr>
<tr><td>2. Provide a means of <strong>interprocessor communication</strong> so that a thread on one CPU can cause activity by a thread on another CPU</td></tr>
</table>
<table>
<tr><th>Can route an interrupt to one or more CPUs in THREE ways</th><th>Typical use</th></tr>
<tr><td>directed to a <strong>specific processor only</strong></td><td>a device whose driver is pinned to one core — best cache locality</td></tr>
<tr><td>directed to a <strong>defined group of processors</strong></td><td>let the hardware give it to whichever member is free; also how big.Little targets one cluster</td></tr>
<tr><td>directed to <strong>all processors</strong></td><td>broadcast events: a TLB shootdown, a timer tick, a shutdown request</td></tr>
</table>
<ul>
<li><strong>Requirement 2 is the one people underestimate.</strong> "A thread on one CPU can cause activity by a thread on another CPU" is the <strong>inter-processor interrupt</strong> (IPI) — the mechanism behind every "wake up core 3 and run this", every scheduler rebalance, every TLB shootdown. Without it an OS cannot manage a multicore at all.</li>
<li><strong>Note that requirement 2 is software generating an interrupt, not a device.</strong> That is why slide 23's list ends with "generation of interrupts by software". A core writes a GIC register and another core gets interrupted — the only general way for cores to poke each other without polling shared memory.</li>
<li><strong>The three modes are a locality / load-balance trade-off.</strong> "Specific processor" keeps the handler's data in one core's cache (good for throughput, bad if that core is busy). "Group" lets the hardware balance but costs cache locality. "All" is expensive — n cores each take an exception — so it is reserved for events that genuinely concern everyone.</li>
<li><strong>Why "one or more".</strong> An interrupt delivered to several CPUs raises the question of who actually handles it. That is exactly what the <em>Inactive / Pending / Active</em> states of slide 25 exist to track: the same interrupt can be in different states on different cores at the same time.</li>
</ul>
<p class="meo">💡 Remember the three modes as <strong>unicast · multicast · broadcast</strong> — the same three delivery patterns you know from networking, applied to interrupts.</p>
<p class="pitfall">⚠️ Do not confuse "routed to all processors" with "handled by all processors". Routing sends the signal everywhere; the software still usually arranges for exactly one core to do the work and the rest to acknowledge and move on. Routing is hardware, arbitration of the work is software.</p>`,
        `<p class="y-chinh">🎯 Việc của GIC rút gọn thành hai yêu cầu và ba kiểu chuyển phát. Hãy thuộc ba kiểu chuyển phát; đó là mục thi kinh điển của khối này.</p>
<table>
<tr><th>Thiết kế để thoả HAI yêu cầu chức năng</th></tr>
<tr><td>1. Cung cấp cách <strong>định tuyến một yêu cầu ngắt tới MỘT CPU hoặc NHIỀU CPU</strong> tuỳ nhu cầu</td></tr>
<tr><td>2. Cung cấp cách <strong>truyền tin GIỮA CÁC BỘ XỬ LÝ</strong> để một luồng trên CPU này gây ra hoạt động cho một luồng trên CPU khác</td></tr>
</table>
<table>
<tr><th>Định tuyến ngắt tới một hoặc nhiều CPU theo BA cách</th><th>Dùng điển hình</th></tr>
<tr><td>gửi tới <strong>ĐÚNG MỘT bộ xử lý cụ thể</strong></td><td>thiết bị có trình điều khiển ghim vào một lõi — tính cục bộ cache tốt nhất</td></tr>
<tr><td>gửi tới <strong>MỘT NHÓM bộ xử lý đã định</strong></td><td>để phần cứng giao cho thành viên nào đang rảnh; cũng là cách big.Little nhắm vào một cụm</td></tr>
<tr><td>gửi tới <strong>TẤT CẢ bộ xử lý</strong></td><td>sự kiện quảng bá: TLB shootdown, nhịp định thời, yêu cầu tắt máy</td></tr>
</table>
<ul>
<li><strong>Yêu cầu 2 là cái người ta hay xem nhẹ.</strong> "Một luồng trên CPU này gây ra hoạt động cho một luồng trên CPU khác" chính là <strong>NGẮT GIỮA CÁC BỘ XỬ LÝ</strong> (IPI) — cơ chế đứng sau mọi lệnh "đánh thức lõi 3 và chạy cái này", mọi lần bộ lập lịch cân bằng lại tải, mọi lần TLB shootdown. Không có nó thì hệ điều hành không quản nổi máy đa lõi.</li>
<li><strong>Để ý yêu cầu 2 là PHẦN MỀM sinh ngắt, không phải thiết bị.</strong> Đó là lý do danh sách ở slide 23 kết bằng "sinh ngắt bằng phần mềm". Một lõi ghi vào thanh ghi của GIC là lõi khác bị ngắt — cách tổng quát duy nhất để các lõi chọc nhau mà không phải thăm dò bộ nhớ chung.</li>
<li><strong>Ba kiểu là một đánh đổi giữa TÍNH CỤC BỘ và CÂN BẰNG TẢI.</strong> "Một bộ xử lý cụ thể" giữ dữ liệu của trình phục vụ trong cache của một lõi (tốt cho thông lượng, dở nếu lõi đó đang bận). "Nhóm" để phần cứng cân bằng nhưng mất tính cục bộ cache. "Tất cả" thì đắt — n lõi mỗi lõi nhận một ngoại lệ — nên chỉ dành cho sự kiện thật sự liên quan tới mọi người.</li>
<li><strong>Vì sao lại "một HOẶC NHIỀU".</strong> Ngắt gửi tới nhiều CPU đặt ra câu hỏi rốt cuộc AI xử lý. Đó đúng là thứ mà ba trạng thái <em>Inactive / Pending / Active</em> của slide 25 sinh ra để theo dõi: cùng một ngắt có thể ở những trạng thái khác nhau trên những lõi khác nhau, cùng một lúc.</li>
</ul>
<p class="meo">💡 Nhớ ba kiểu bằng <strong>unicast · multicast · broadcast</strong> — đúng ba mẫu chuyển phát bạn đã biết từ mạng máy tính, áp vào ngắt.</p>
<p class="pitfall">⚠️ Đừng lẫn "định tuyến tới TẤT CẢ bộ xử lý" với "được TẤT CẢ bộ xử lý xử lý". Định tuyến gửi tín hiệu đi khắp nơi; phần mềm thường vẫn thu xếp để đúng một lõi làm việc, số còn lại xác nhận rồi đi tiếp. Định tuyến là phần cứng, phân xử công việc là phần mềm.</p>`],

      [25, 'Interrupt states and interrupt sources',
        `<p class="y-chinh">🎯 The three states an interrupt can be in, and the four places interrupts come from. The state definitions are written from a <strong>per-CPU</strong> point of view, and that is the whole subtlety of the slide.</p>
<table>
<tr><th>State</th><th>Slide's definition</th><th>Plain reading</th></tr>
<tr><td><strong>Inactive</strong></td><td>One that is nonasserted, <em>or</em> which in a multiprocessing environment has been completely processed by that CPU but can still be either Pending or Active in some of the CPUs to which it is targeted, and so might not have been cleared at the interrupt source</td><td>"Nothing to do <em>here</em>" — which does <strong>not</strong> mean nothing to do anywhere</td></tr>
<tr><td><strong>Pending</strong></td><td>One that has been asserted, and for which <strong>processing has not started</strong> on that CPU</td><td>queued, waiting its turn</td></tr>
<tr><td><strong>Active</strong></td><td>One that has been <strong>started</strong> on that CPU, but processing is <strong>not complete</strong></td><td>the handler is running right now</td></tr>
</table>
<ul>
<li><strong>Read the Inactive definition again — it is the examinable sentence.</strong> An interrupt can be Inactive <em>on this CPU</em> while still Pending or Active <em>on another</em>, and therefore may not yet have been cleared at the source. The state is a property of the <strong>(interrupt, CPU) pair</strong>, not of the interrupt alone. That is exactly what "routed to multiple CPUs" on slide 24 forces.</li>
<li><strong>Active can be pre-empted.</strong> The slide says so directly: an Active interrupt "can be pre-empted when a new interrupt of higher priority interrupts A15 core interrupt processing". So handlers nest, and the GIC's priority machinery (slide 23) is what decides whether the nesting is allowed.</li>
<li><strong>The life cycle in one line.</strong> Inactive → (asserted) → Pending → (core takes it) → Active → (handler finishes, writes End Of Interrupt) → Inactive. That last step, EOI, is the arrow drawn back into the GIC on Figure 21.15 (slide 26) as "Core acknowledge and End Of Interrupt (EOI) information from CPU interface".</li>
</ul>
<table>
<tr><th>Interrupts come from (slide list)</th><th>What it is</th></tr>
<tr><td><strong>Interprocessor interrupts (IPIs)</strong></td><td>software-generated, core to core — requirement 2 of slide 24</td></tr>
<tr><td><strong>Private timer and/or watchdog interrupts</strong></td><td>per-core timers — the Generic Timer of Figure 21.14; the OS scheduler tick lives here</td></tr>
<tr><td><strong>Legacy FIQ lines</strong></td><td>ARM's Fast Interrupt reQuest, kept for backward compatibility with pre-GIC designs</td></tr>
<tr><td><strong>Hardware interrupts</strong></td><td>ordinary peripherals — the case from Ch.8</td></tr>
</table>
<ul>
<li><strong>Note that two of the four sources are internal to the chip.</strong> IPIs and private timers do not come from any device — they exist <em>because</em> the system is multicore. On a single core, an interrupt controller would only need the last two rows.</li>
<li><strong>"Private timer" is per-core on purpose.</strong> A shared timer would mean every scheduler tick interrupts one designated core, which then has to IPI the others. Giving each core its own timer removes that bottleneck completely.</li>
</ul>
<p class="pitfall">⚠️ Classic exam confusion: <strong>Pending ≠ Inactive</strong> and <strong>Inactive ≠ disabled</strong>. Inactive is a <em>state on one CPU</em>; masking (slide 23) is a separate mechanism that prevents delivery. An interrupt can be unmasked and Inactive at the same time — it simply has not fired yet on this core.</p>`,
        `<p class="y-chinh">🎯 Ba trạng thái mà một ngắt có thể ở, và bốn nơi ngắt sinh ra. Các định nghĩa trạng thái được viết theo góc nhìn <strong>TỪNG CPU</strong>, và đó là toàn bộ chỗ tinh tế của slide.</p>
<table>
<tr><th>Trạng thái</th><th>Định nghĩa của slide</th><th>Đọc cho dễ</th></tr>
<tr><td><strong>Inactive</strong></td><td>Ngắt không được khẳng định, <em>HOẶC</em> trong môi trường đa xử lý là ngắt đã được CPU đó xử lý xong hoàn toàn nhưng VẪN CÓ THỂ đang Pending hoặc Active ở vài CPU khác mà nó nhắm tới, nên có thể CHƯA được xoá ở nguồn ngắt</td><td>"Ở ĐÂY thì không còn gì phải làm" — điều đó <strong>KHÔNG</strong> có nghĩa là mọi nơi đều xong</td></tr>
<tr><td><strong>Pending</strong></td><td>Ngắt đã được khẳng định, và trên CPU đó thì việc xử lý <strong>CHƯA BẮT ĐẦU</strong></td><td>đang xếp hàng, chờ tới lượt</td></tr>
<tr><td><strong>Active</strong></td><td>Ngắt đã <strong>BẮT ĐẦU</strong> trên CPU đó, nhưng việc xử lý <strong>CHƯA XONG</strong></td><td>trình phục vụ đang chạy ngay lúc này</td></tr>
</table>
<ul>
<li><strong>Đọc lại định nghĩa Inactive — đó là câu đáng thi.</strong> Một ngắt có thể là Inactive <em>TRÊN CPU NÀY</em> trong khi vẫn đang Pending hoặc Active <em>TRÊN CPU KHÁC</em>, và do đó có thể chưa hề được xoá ở nguồn. Trạng thái là thuộc tính của <strong>CẶP (ngắt, CPU)</strong>, không phải của riêng cái ngắt. Đó chính xác là hệ quả mà "định tuyến tới nhiều CPU" ở slide 24 ép ra.</li>
<li><strong>Active CÓ THỂ bị chiếm quyền.</strong> Slide nói thẳng: một ngắt đang Active "có thể bị chiếm quyền khi một ngắt mới có mức ưu tiên CAO HƠN ngắt ngang việc xử lý ngắt của lõi A15". Vậy là các trình phục vụ LỒNG NHAU, và bộ máy ưu tiên của GIC (slide 23) là thứ quyết định có cho lồng hay không.</li>
<li><strong>Vòng đời gói trong một dòng.</strong> Inactive → (được khẳng định) → Pending → (lõi nhận) → Active → (trình phục vụ xong, ghi End Of Interrupt) → Inactive. Bước cuối, EOI, chính là mũi tên vẽ ngược vào GIC trên Figure 21.15 (slide 26): "Core acknowledge and End Of Interrupt (EOI) information from CPU interface".</li>
</ul>
<table>
<tr><th>Ngắt đến từ (danh sách trên slide)</th><th>Nó là gì</th></tr>
<tr><td><strong>Ngắt giữa các bộ xử lý (IPI)</strong></td><td>do phần mềm sinh, lõi tới lõi — yêu cầu 2 của slide 24</td></tr>
<tr><td><strong>Ngắt định thời riêng và/hoặc watchdog</strong></td><td>bộ định thời của từng lõi — chính là Generic Timer của Figure 21.14; nhịp lập lịch của hệ điều hành nằm ở đây</td></tr>
<tr><td><strong>Đường FIQ cũ (legacy FIQ lines)</strong></td><td>Fast Interrupt reQuest của ARM, giữ lại để tương thích ngược với những thiết kế có trước GIC</td></tr>
<tr><td><strong>Ngắt phần cứng</strong></td><td>ngoại vi thông thường — đúng ca của Ch.8</td></tr>
</table>
<ul>
<li><strong>Để ý HAI trong bốn nguồn là nội bộ ngay trong chip.</strong> IPI và bộ định thời riêng không đến từ thiết bị nào — chúng tồn tại <em>VÌ</em> hệ thống là đa lõi. Trên một lõi đơn, bộ điều khiển ngắt chỉ cần hai dòng cuối.</li>
<li><strong>"Bộ định thời RIÊNG" là cố ý cho từng lõi.</strong> Một bộ định thời dùng chung nghĩa là mỗi nhịp lập lịch lại ngắt đúng một lõi được chỉ định, rồi lõi đó phải IPI cho những lõi còn lại. Cho mỗi lõi một bộ định thời riêng xoá sạch cái nút thắt đó.</li>
</ul>
<p class="pitfall">⚠️ Nhầm lẫn kinh điển khi thi: <strong>Pending ≠ Inactive</strong> và <strong>Inactive ≠ bị vô hiệu hoá</strong>. Inactive là <em>TRẠNG THÁI TRÊN MỘT CPU</em>; còn che ngắt (masking, slide 23) là cơ chế KHÁC ngăn việc chuyển phát. Một ngắt hoàn toàn có thể vừa không bị che vừa đang Inactive — đơn giản là nó chưa nổ trên lõi này.</p>`],

      [26, 'Figure 21.15 — Generic Interrupt Controller Block Diagram',
        `<p class="y-chinh">🎯 The GIC opened up. On the left, many interrupt lines arrive at an <strong>Interrupt interface</strong>. In the middle sits the <strong>Interrupt list</strong> — a table with a <strong>Priority</strong> column and a <strong>Status</strong> column, one row per interrupt. On the right, a <strong>Prioritization and selection</strong> block emits, for each of A15 Core 0…3, a pair (<strong>Interrupt number, Priority</strong>) as the <strong>IRQ request to each CPU interface</strong>. A <strong>Decoder</strong> on top takes Private bus Read/Write, and four lines carry <strong>Core acknowledge and End Of Interrupt (EOI) information from CPU interface</strong> back in.</p>
<ul>
<li><strong>The Interrupt list IS slides 23–25 made into hardware.</strong> The Priority column is the "prioritization" bullet; the Status column holds the Inactive / Pending / Active state of slide 25. One row per interrupt source, and that is why the number of supported interrupts is independent of the core design — you enlarge the table, not the CPU.</li>
<li><strong>Four separate outputs, one per core — that is "distribution".</strong> The selection block does not produce one answer; it produces the <em>highest-priority pending interrupt for each core individually</em>, because each core has its own mask and its own current priority level. Four cores, four simultaneous, possibly different answers.</li>
<li><strong>Each output is a PAIR, and both halves matter.</strong> The interrupt <em>number</em> tells the core which handler to run; the <em>priority</em> tells it whether this one may pre-empt what it is already running — the pre-emption rule of slide 25. Sending the number alone would make nesting impossible to decide.</li>
<li><strong>The feedback lines are the other half of the protocol.</strong> Acknowledge moves a row from Pending to Active; EOI moves it back to Inactive <em>for that core</em>. Without that returning path the controller could not know when a handler finished, and could never re-arm a level-triggered source.</li>
<li><strong>The Decoder plus "Private bus Read/Write" is the memory-mapped interface</strong> of slide 23. Software configures priorities, masks and target lists by writing registers here — ordinary stores, decoded into the right row of the table.</li>
</ul>
<p class="meo">💡 Read the diagram as a loop, not a pipeline: <em>lines in → table of (priority, status) → per-core selection → IRQ out → acknowledge/EOI back in → table updated</em>. Every interrupt goes round that loop exactly once per core it is delivered to.</p>
<p class="pitfall">⚠️ The figure looks like a single arbiter picking one winner. It is not — it picks <strong>one winner per core</strong>, in parallel, using per-core state. A question claiming "the GIC selects the single highest-priority interrupt in the system" is describing a uniprocessor controller, not this one.</p>`,
        `<p class="y-chinh">🎯 GIC mổ ra. Bên trái, nhiều đường ngắt đổ vào một <strong>Interrupt interface</strong>. Ở giữa là <strong>Interrupt list</strong> — một cái bảng có cột <strong>Priority</strong> và cột <strong>Status</strong>, mỗi ngắt một dòng. Bên phải, khối <strong>Prioritization and selection</strong> phát ra, cho từng A15 Core 0…3, một CẶP (<strong>Interrupt number, Priority</strong>) làm <strong>yêu cầu IRQ tới giao diện CPU của mỗi lõi</strong>. Phía trên có một <strong>Decoder</strong> nhận Private bus Read/Write, và bốn đường mang <strong>thông tin Core acknowledge và End Of Interrupt (EOI) từ giao diện CPU</strong> quay ngược vào.</p>
<ul>
<li><strong>Cái Interrupt list CHÍNH LÀ slide 23–25 đúc thành phần cứng.</strong> Cột Priority là gạch đầu dòng "sắp thứ tự ưu tiên"; cột Status giữ trạng thái Inactive / Pending / Active của slide 25. Mỗi nguồn ngắt một dòng, và đó là lý do số ngắt đỡ được ĐỘC LẬP với thiết kế lõi — bạn nới rộng cái BẢNG, không phải nới rộng CPU.</li>
<li><strong>Bốn đầu ra RIÊNG BIỆT, mỗi lõi một đầu ra — đó chính là "phân phối".</strong> Khối chọn lựa KHÔNG cho ra một đáp án; nó cho ra <em>ngắt ưu tiên cao nhất đang chờ, TÍNH RIÊNG cho từng lõi</em>, vì mỗi lõi có mặt nạ che riêng và mức ưu tiên hiện hành riêng. Bốn lõi, bốn đáp án cùng lúc, có thể khác nhau.</li>
<li><strong>Mỗi đầu ra là một CẶP, và cả hai nửa đều có việc.</strong> <em>SỐ HIỆU</em> ngắt bảo lõi phải chạy trình phục vụ nào; <em>MỨC ƯU TIÊN</em> bảo nó cái này có được chiếm quyền của thứ đang chạy hay không — đúng quy tắc chiếm quyền ở slide 25. Gửi mỗi số hiệu thôi thì không có cách nào quyết định chuyện lồng nhau.</li>
<li><strong>Các đường phản hồi là nửa còn lại của giao thức.</strong> Acknowledge chuyển một dòng từ Pending sang Active; EOI chuyển nó về Inactive <em>CHO LÕI ĐÓ</em>. Không có đường về ấy thì bộ điều khiển không thể biết trình phục vụ đã xong lúc nào, và không bao giờ nạp lại được một nguồn ngắt kiểu theo mức.</li>
<li><strong>Cái Decoder cộng "Private bus Read/Write" chính là giao diện ánh xạ bộ nhớ</strong> của slide 23. Phần mềm cấu hình mức ưu tiên, mặt nạ che và danh sách lõi đích bằng cách ghi thanh ghi ở đây — lệnh store bình thường, được giải mã vào đúng dòng của bảng.</li>
</ul>
<p class="meo">💡 Đọc sơ đồ như một VÒNG LẶP chứ không phải một dây chuyền: <em>đường ngắt vào → bảng (ưu tiên, trạng thái) → chọn lựa cho từng lõi → IRQ ra → acknowledge/EOI quay về → cập nhật bảng</em>. Mỗi ngắt đi hết vòng đó đúng một lần cho MỖI lõi mà nó được chuyển tới.</p>
<p class="pitfall">⚠️ Hình trông như một trọng tài duy nhất chọn ra một kẻ thắng. KHÔNG phải — nó chọn <strong>một kẻ thắng CHO MỖI LÕI</strong>, song song, dựa trên trạng thái riêng của từng lõi. Câu hỏi nào bảo "GIC chọn ra ngắt có ưu tiên cao nhất TRONG HỆ THỐNG" là đang mô tả bộ điều khiển của máy MỘT bộ xử lý, không phải cái này.</p>`],

      [27, 'Cache Coherency — the Snoop Control Unit and its three optimisations',
        `<p class="y-chinh">🎯 How the Cortex-A15 MPCore actually keeps four L1 D-caches coherent. The slide names the unit, states the protocol, and then lists <strong>three optimisations</strong> — and every one of them exists to avoid a trip to a slower level of memory.</p>
<ul>
<li><strong>The Snoop Control Unit (SCU)</strong> — in the slide's words, it "resolves most of the traditional bottlenecks related to access to shared data and the scalability limitation introduced by coherence traffic". Read that as: the SCU exists because <em>snooping does not scale</em> (slide 18), so you put a smart unit in the middle instead of broadcasting everything.</li>
<li><strong>The L1 cache coherency scheme is based on the MESI protocol</strong> — the four states of Table 21.2(a) on slide 20, not MOESI. MOESI/ACE is what the <em>interconnect between clusters</em> speaks (slide 15); inside one cluster, MESI plus the SCU is enough.</li>
</ul>
<table>
<tr><th>Optimisation</th><th>What the slide says it does</th><th>The memory trip it avoids</th></tr>
<tr><td><strong>Direct Data Intervention (DDI)</strong></td><td>Enables copying <em>clean</em> data between L1 caches without accessing external memory · reduces read-after-write from L1 to L2 · can resolve a local L1 miss from a <strong>remote L1</strong> rather than L2</td><td>L1 miss served by a sibling L1 instead of L2 — one whole level skipped</td></tr>
<tr><td><strong>Duplicated tag RAMs</strong></td><td>Cache tags implemented as a separate block of RAM, same length as the number of lines in the cache · duplicates used by the SCU to check data availability <strong>before</strong> sending coherency commands · only send to CPUs that must update coherent data cache</td><td>the broadcast itself — cores that do not hold the line are never disturbed</td></tr>
<tr><td><strong>Migratory lines</strong></td><td>Allows moving <em>dirty</em> data between CPUs without writing to L2 and reading back from external memory</td><td>a write-back plus a re-read — the expensive path MESI normally forces</td></tr>
</table>
<ul>
<li><strong>Read DDI and migratory lines as a pair: clean and dirty.</strong> DDI moves <em>clean</em> lines cache-to-cache; migratory lines move <em>dirty</em> ones. Together they cover every case where one core hands data to another — and the dirty case is exactly the write-back that plain MESI demands and MOESI's Owned state removes (slide 19). Same problem, two solutions, one in the protocol and one in the unit.</li>
<li><strong>Duplicated tags are a snoop filter, and the cost is explicit on the slide.</strong> "Same length as the number of lines in the cache" means the SCU carries a second full copy of every core's tag array. You pay real SRAM to avoid coherence traffic — a straight area-for-bandwidth trade, and the same trick as Intel's inclusive L3 on slide 21.</li>
<li><strong>Why "migratory" is the right word.</strong> A migratory line is one that keeps moving from core to core, each of which reads it, modifies it and passes it on — a lock, a shared counter, a work-queue head. It is the single most common and most expensive sharing pattern, which is why it earns a hardware optimisation of its own.</li>
<li><strong>Connect to the slide-4 measurement.</strong> Every one of these three features raises f in Amdahl by cutting the cost of the shared, sequential part. They do not add parallelism; they make the parallelism you have cheaper to use.</li>
</ul>
<p class="meo">💡 One sentence for all three: <strong>ask the neighbour, not the parent</strong> — DDI for clean data, migratory lines for dirty data, duplicated tags so you only ask the neighbours who actually have it.</p>`,
        `<p class="y-chinh">🎯 Cortex-A15 MPCore thật sự giữ bốn cái L1 D-cache nhất quán bằng cách nào. Slide gọi tên đơn vị phụ trách, nêu giao thức, rồi liệt kê <strong>BA tối ưu hoá</strong> — và cái nào cũng sinh ra để né một chuyến đi xuống tầng bộ nhớ chậm hơn.</p>
<ul>
<li><strong>Snoop Control Unit (SCU)</strong> — theo chữ của slide, nó "hoá giải phần lớn các nút thắt cổ điển liên quan tới truy cập dữ liệu dùng chung và giới hạn mở rộng do lưu lượng nhất quán gây ra". Đọc câu đó thành: SCU tồn tại vì <em>snoop không mở rộng được</em> (slide 18), nên người ta đặt một đơn vị THÔNG MINH ở giữa thay vì quảng bá tất tần tật.</li>
<li><strong>Cơ chế nhất quán L1 dựa trên giao thức MESI</strong> — đúng bốn trạng thái của Table 21.2(a) ở slide 20, KHÔNG phải MOESI. MOESI/ACE là thứ mà <em>liên kết GIỮA CÁC CỤM</em> nói (slide 15); còn bên trong một cụm thì MESI cộng với SCU là đủ.</li>
</ul>
<table>
<tr><th>Tối ưu hoá</th><th>Slide nói nó làm gì</th><th>Nó né được chuyến đi nào</th></tr>
<tr><td><strong>Direct Data Intervention (DDI)</strong></td><td>Cho phép chép dữ liệu <em>SẠCH</em> giữa các L1 mà KHÔNG đụng bộ nhớ ngoài · giảm đọc-sau-ghi từ L1 xuống L2 · giải quyết được cú trượt L1 cục bộ bằng một <strong>L1 Ở XA</strong> thay vì bằng L2</td><td>trượt L1 được một L1 anh em phục vụ thay vì L2 — bỏ qua trọn một tầng</td></tr>
<tr><td><strong>Nhân đôi RAM thẻ (duplicated tag RAMs)</strong></td><td>Thẻ cache làm thành một khối RAM RIÊNG, dài đúng bằng số dòng của cache · SCU dùng bản nhân đôi để kiểm dữ liệu có sẵn hay không <strong>TRƯỚC KHI</strong> gửi lệnh nhất quán · chỉ gửi tới những CPU thật sự phải cập nhật cache dữ liệu nhất quán</td><td>chính cái lượt quảng bá — lõi nào không giữ dòng đó thì không bị làm phiền</td></tr>
<tr><td><strong>Dòng di trú (migratory lines)</strong></td><td>Cho phép chuyển dữ liệu <em>BẨN</em> giữa các CPU mà không phải ghi xuống L2 rồi đọc ngược lên từ bộ nhớ ngoài</td><td>một lần ghi trả cộng một lần đọc lại — đúng con đường đắt mà MESI thường bắt phải đi</td></tr>
</table>
<ul>
<li><strong>Đọc DDI và dòng di trú như một CẶP: sạch và bẩn.</strong> DDI chuyển dòng <em>SẠCH</em> từ cache sang cache; dòng di trú chuyển dòng <em>BẨN</em>. Gộp lại, chúng phủ mọi ca một lõi trao dữ liệu cho lõi khác — và ca "bẩn" chính xác là lần ghi trả mà MESI thuần đòi hỏi còn trạng thái Owned của MOESI xoá đi (slide 19). Cùng một bài toán, hai lời giải: một nằm trong giao thức, một nằm trong đơn vị phần cứng.</li>
<li><strong>Thẻ nhân đôi là một BỘ LỌC SNOOP, và slide nói thẳng cái giá.</strong> "Dài đúng bằng số dòng của cache" nghĩa là SCU vác theo một bản sao ĐẦY ĐỦ mảng thẻ của mọi lõi. Bạn trả bằng SRAM thật để né lưu lượng nhất quán — một cuộc đổi thẳng diện tích lấy băng thông, và cũng là mẹo mà L3 kiểu bao hàm của Intel dùng ở slide 21.</li>
<li><strong>Vì sao "di trú" là chữ đúng.</strong> Dòng di trú là dòng cứ đi từ lõi này sang lõi khác, lõi nào cũng đọc nó, sửa nó, rồi chuyền đi — một cái khoá, một biến đếm dùng chung, đầu một hàng đợi công việc. Đó là mẫu chia sẻ PHỔ BIẾN NHẤT và ĐẮT NHẤT, nên nó xứng đáng có riêng một tối ưu hoá phần cứng.</li>
<li><strong>Nối về phép đo ở slide 4.</strong> Cả ba tính năng này đều nâng f trong Amdahl lên bằng cách cắt giảm chi phí của phần dùng chung, tuần tự. Chúng KHÔNG thêm tính song song; chúng làm cho phần song song bạn đang có trở nên rẻ hơn khi dùng.</li>
</ul>
<p class="meo">💡 Một câu cho cả ba: <strong>hỏi hàng xóm, đừng hỏi cha mẹ</strong> — DDI cho dữ liệu sạch, dòng di trú cho dữ liệu bẩn, thẻ nhân đôi để chỉ hỏi đúng những hàng xóm thật sự đang giữ nó.</p>`],

      [28, 'Figure 21.16 — IBM z13 Drawer Structure',
        `<p class="y-chinh">🎯 The third real machine, and a jump in scale: a <strong>CPC Drawer</strong> holding <strong>two Nodes</strong>, each with <strong>three Processor Units (PU) of 8 cores</strong> — so 24 cores per node, <strong>48 cores per drawer</strong>, and drawers connect to further drawers.</p>
<table>
<tr><th>Element on the figure</th><th>What it is</th></tr>
<tr><td><strong>Processor Unit (PU), 8 cores</strong></td><td>the chip; three of them per node</td></tr>
<tr><td><strong>X-BUS — "Intra-node interface"</strong></td><td>ties the three PUs of a node to that node's Storage Control</td></tr>
<tr><td><strong>Storage Control (SC)</strong></td><td>one per node — the cache/coherence hub, holding the L4 of slide 29</td></tr>
<tr><td><strong>S-BUS — "Inter-node interface"</strong></td><td>connects Node 0's SC to Node 1's SC inside the same drawer</td></tr>
<tr><td><strong>A-BUS</strong></td><td>leaves each SC downwards "To other drawers"</td></tr>
<tr><td><strong>Memory 0…4, GX++, PCIe, PSI</strong></td><td>memory and I/O attached per PU</td></tr>
</table>
<ul>
<li><strong>Read the three bus names as three distances.</strong> X-BUS = inside a node · S-BUS = between the two nodes of a drawer · A-BUS = between drawers. Three tiers of interconnect because latency and bandwidth differ by an order of magnitude at each step — this is <strong>NUMA</strong> (Ch.20) built explicitly into the box structure.</li>
<li><strong>Every bus here is also a coherence path.</strong> Figure 21.17 on the next slide labels A-BUS "inter-drawer snoop interface" and S-BUS "inter-node snoop interface". So the physical hierarchy and the coherence hierarchy are the <em>same</em> hierarchy — a snoop that can be answered inside the node never leaves it.</li>
<li><strong>The Storage Control is the architectural centrepiece.</strong> It is not a bus, it is a hub with memory in it. Everything a node's 24 cores cannot answer among themselves goes to its SC; only what the SC cannot answer goes to the other node or another drawer. That is a directory-style filter at the top of a snoop-style bottom (slide 18: real systems combine both).</li>
<li><strong>Why mainframes push this hardest.</strong> A z13 runs thousands of concurrent transactions with strict correctness requirements — exactly the OLTP workload that scaled <em>worst</em> on Figure 21.4 (slide 5), because it shares heavily. When your workload cannot avoid sharing, you buy your way out with interconnect and cache, which is what slide 29 shows.</li>
</ul>
<p class="meo">💡 Count upwards and keep the numbers: <strong>8 cores per PU → 3 PUs per node = 24 → 2 nodes per drawer = 48 → several drawers per machine</strong>. Then remember that each level up adds a slower bus and a bigger shared cache.</p>`,
        `<p class="y-chinh">🎯 Cỗ máy thật thứ ba, và là một bước nhảy về quy mô: một <strong>CPC Drawer</strong> chứa <strong>HAI Node</strong>, mỗi node có <strong>BA Processor Unit (PU), mỗi PU 8 lõi</strong> — tức 24 lõi mỗi node, <strong>48 lõi mỗi drawer</strong>, và các drawer còn nối sang drawer khác.</p>
<table>
<tr><th>Thành phần trên hình</th><th>Nó là gì</th></tr>
<tr><td><strong>Processor Unit (PU), 8 lõi</strong></td><td>con chip; mỗi node có ba cái</td></tr>
<tr><td><strong>X-BUS — "Intra-node interface"</strong></td><td>buộc ba PU của một node vào Storage Control của node đó</td></tr>
<tr><td><strong>Storage Control (SC)</strong></td><td>mỗi node một cái — trung tâm cache/nhất quán, chứa cả L4 của slide 29</td></tr>
<tr><td><strong>S-BUS — "Inter-node interface"</strong></td><td>nối SC của Node 0 với SC của Node 1 trong CÙNG một drawer</td></tr>
<tr><td><strong>A-BUS</strong></td><td>đi từ mỗi SC xuống dưới "To other drawers" (sang các drawer khác)</td></tr>
<tr><td><strong>Memory 0…4, GX++, PCIe, PSI</strong></td><td>bộ nhớ và vào/ra gắn theo từng PU</td></tr>
</table>
<ul>
<li><strong>Đọc ba cái tên bus như BA KHOẢNG CÁCH.</strong> X-BUS = trong một node · S-BUS = giữa hai node của một drawer · A-BUS = giữa các drawer. Ba tầng liên kết vì độ trễ và băng thông lệch nhau cả một bậc ở mỗi bước — đây chính là <strong>NUMA</strong> (Ch.20) dựng tường minh vào cấu trúc thùng máy.</li>
<li><strong>Mọi cái bus ở đây đồng thời là một ĐƯỜNG NHẤT QUÁN.</strong> Figure 21.17 ở slide sau ghi rõ A-BUS là "inter-drawer snoop interface" và S-BUS là "inter-node snoop interface". Vậy phân cấp VẬT LÝ và phân cấp NHẤT QUÁN là CÙNG MỘT phân cấp — một cú snoop trả lời được ngay trong node thì không bao giờ ra khỏi node.</li>
<li><strong>Storage Control mới là trụ cột kiến trúc.</strong> Nó không phải cái bus, nó là một TRUNG TÂM có bộ nhớ bên trong. Thứ gì 24 lõi của một node không tự trả lời được cho nhau thì đi tới SC của node đó; chỉ thứ gì SC cũng chịu thì mới sang node kia hoặc drawer khác. Đó là bộ lọc kiểu directory đặt trên một nền kiểu snoop (slide 18: hệ thống thật thì kết hợp cả hai).</li>
<li><strong>Vì sao máy mainframe đẩy chuyện này mạnh nhất.</strong> Một con z13 chạy hàng nghìn giao dịch đồng thời với đòi hỏi đúng đắn nghiêm ngặt — đúng cái tải OLTP scaling <em>TỆ NHẤT</em> trên Figure 21.4 (slide 5), vì nó chia sẻ rất nhiều. Khi tải của bạn không thể tránh chia sẻ, bạn phải mua đường thoát bằng liên kết và bằng cache, và đó là thứ slide 29 trưng ra.</li>
</ul>
<p class="meo">💡 Đếm ngược lên và nhớ lấy con số: <strong>8 lõi mỗi PU → 3 PU mỗi node = 24 → 2 node mỗi drawer = 48 → nhiều drawer mỗi máy</strong>. Rồi nhớ thêm rằng mỗi bậc đi lên là thêm một cái bus chậm hơn và một cái cache dùng chung to hơn.</p>`],

      [29, 'Figure 21.17 — IBM z13 Cache Hierarchy in Single Node',
        `<p class="y-chinh">🎯 Figure 21.6 taken to its limit: this machine has <strong>four levels of cache</strong>, and the top two are shared. Per node the figure draws <strong>three groups of 8 cores</strong>, each core with its own L1 and L2, each group under a <strong>64 MB shared eDRAM L3</strong>, all three L3s joined by the <strong>X-Bus (intra-node snoop interface)</strong> to a single <strong>480 MB shared eDRAM L4</strong> beside a <strong>Non-data Inclusive coherent (NIC) directory</strong>, with the <strong>A-Bus (inter-drawer snoop interface)</strong> above and the <strong>S-Bus (inter-node snoop interface)</strong> to the side.</p>
<table>
<tr><th>Level</th><th>Ownership</th><th>Size shown</th><th>Figure 21.6 analogue</th></tr>
<tr><td><strong>L1</strong></td><td>private per core</td><td>(not labelled here)</td><td>always private</td></tr>
<tr><td><strong>L2</strong></td><td>private per core</td><td>(not labelled here)</td><td>panel (b), dedicated L2</td></tr>
<tr><td><strong>L3</strong></td><td>shared by 8 cores</td><td><strong>64 MB eDRAM</strong>, ×3 per node</td><td>panel (d), shared L3</td></tr>
<tr><td><strong>L4</strong></td><td>shared by the whole node (24 cores)</td><td><strong>480 MB eDRAM</strong></td><td>beyond the figure — a level Figure 21.6 does not have</td></tr>
</table>
<ul>
<li><strong>Count 24 L1/L2 pairs in the figure.</strong> Three rows of eight stacked boxes, and they are drawn individually rather than abbreviated — the figure wants you to see that all 24 cores of the node sit under one L4.</li>
<li><strong>eDRAM, not SRAM, and that is the whole reason these sizes are possible.</strong> Embedded DRAM stores a bit in one transistor plus a capacitor instead of the six transistors of an SRAM cell, so it is several times denser. It is slower than SRAM — which is fine, because L3 and L4 are not on the critical path the way L1 is. 480 MB of SRAM would not fit; 480 MB of eDRAM does.</li>
<li><strong>The NIC directory is the most interesting box on the slide.</strong> "Non-data Inclusive coherent" means it tracks <em>which caches hold which lines</em> without storing the data itself. A fully inclusive L4 would have to hold a copy of everything in all the L3s, wasting most of its capacity; a non-data-inclusive directory gets the filtering benefit of inclusion (slide 21's snoop filter, slide 27's duplicated tags) while spending its 480 MB on <em>useful</em> data. Same idea as duplicated tag RAMs, at a scale 1000× larger.</li>
<li><strong>Three snoop interfaces, one per distance.</strong> X-Bus inside the node, S-Bus to the other node, A-Bus to other drawers. A coherence request climbs only as far as it must — the entire structure is designed so that most requests are answered at L3 or L4 and never leave the node.</li>
<li><strong>Close the loop with slide 3.</strong> Why can a machine afford 480 MB of on-package cache? Because memory has far lower power density than logic. The z13 is the most extreme illustration in the book of the chapter's opening lesson: <em>when you cannot spend power on faster logic, spend area on more memory</em>.</li>
</ul>
<p class="pitfall">⚠️ Do not read "480 MB L4" as "main memory". It is <em>cache</em> — the machine's DRAM is measured in terabytes. The L4's job is to answer for the node so that coherence traffic and memory requests do not escape onto the S-Bus and A-Bus.</p>`,
        `<p class="y-chinh">🎯 Figure 21.6 đẩy tới cực hạn: cỗ máy này có <strong>BỐN tầng cache</strong>, và hai tầng trên cùng đều dùng chung. Trong một node, hình vẽ <strong>ba cụm 8 lõi</strong>, mỗi lõi có L1 và L2 riêng, mỗi cụm nằm dưới một <strong>L3 eDRAM dùng chung 64 MB</strong>, cả ba cái L3 nối bằng <strong>X-Bus (giao diện snoop trong node)</strong> lên MỘT <strong>L4 eDRAM dùng chung 480 MB</strong> nằm cạnh một <strong>thư mục NIC (Non-data Inclusive coherent)</strong>, phía trên là <strong>A-Bus (giao diện snoop giữa các drawer)</strong> và bên hông là <strong>S-Bus (giao diện snoop giữa các node)</strong>.</p>
<table>
<tr><th>Tầng</th><th>Ai sở hữu</th><th>Kích thước hình ghi</th><th>Ứng với ô nào của Figure 21.6</th></tr>
<tr><td><strong>L1</strong></td><td>riêng mỗi lõi</td><td>(hình không ghi số)</td><td>luôn luôn riêng</td></tr>
<tr><td><strong>L2</strong></td><td>riêng mỗi lõi</td><td>(hình không ghi số)</td><td>ô (b), L2 riêng</td></tr>
<tr><td><strong>L3</strong></td><td>8 lõi dùng chung</td><td><strong>64 MB eDRAM</strong>, ×3 mỗi node</td><td>ô (d), L3 dùng chung</td></tr>
<tr><td><strong>L4</strong></td><td>cả node dùng chung (24 lõi)</td><td><strong>480 MB eDRAM</strong></td><td>vượt ra ngoài hình — một tầng mà Figure 21.6 không có</td></tr>
</table>
<ul>
<li><strong>Đếm đủ 24 cặp L1/L2 trên hình.</strong> Ba hàng, mỗi hàng tám ô chồng, và chúng được vẽ RIÊNG TỪNG CÁI chứ không viết tắt — hình muốn bạn thấy rõ cả 24 lõi của node nằm dưới CÙNG MỘT cái L4.</li>
<li><strong>Là eDRAM chứ không phải SRAM, và đó là toàn bộ lý do những con số này khả thi.</strong> DRAM nhúng lưu một bit bằng một transistor cộng một tụ, thay vì sáu transistor của một ô SRAM, nên nó dày đặc hơn nhiều lần. Nó chậm hơn SRAM — mà chuyện đó không sao, vì L3 và L4 không nằm trên đường găng như L1. 480 MB SRAM thì không nhét vừa; 480 MB eDRAM thì vừa.</li>
<li><strong>Thư mục NIC là cái ô thú vị nhất slide.</strong> "Non-data Inclusive coherent" nghĩa là nó theo dõi <em>CACHE NÀO đang giữ DÒNG NÀO</em> mà KHÔNG lưu chính dữ liệu. Một cái L4 bao hàm đầy đủ sẽ phải giữ bản sao của mọi thứ trong tất cả các L3, phí mất phần lớn dung lượng; còn thư mục kiểu không-bao-hàm-dữ-liệu vẫn hưởng lợi ích lọc của tính bao hàm (bộ lọc snoop ở slide 21, thẻ nhân đôi ở slide 27) mà vẫn dùng trọn 480 MB cho dữ liệu <em>CÓ ÍCH</em>. Cùng ý tưởng với duplicated tag RAM, ở quy mô lớn hơn 1000 lần.</li>
<li><strong>Ba giao diện snoop, mỗi khoảng cách một cái.</strong> X-Bus trong node, S-Bus sang node kia, A-Bus sang drawer khác. Một yêu cầu nhất quán chỉ leo lên ĐÚNG mức nó buộc phải leo — toàn bộ cấu trúc được thiết kế để phần lớn yêu cầu được trả lời ngay ở L3 hoặc L4 và không bao giờ rời khỏi node.</li>
<li><strong>Khép vòng với slide 3.</strong> Vì sao một cỗ máy kham nổi 480 MB cache ngay trên gói chip? Vì bộ nhớ có mật độ công suất thấp hơn logic rất nhiều. Con z13 là minh hoạ cực đoan nhất trong cả sách cho bài học mở đầu chương: <em>khi không thể tiêu điện vào logic nhanh hơn, hãy tiêu diện tích vào nhiều bộ nhớ hơn</em>.</li>
</ul>
<p class="pitfall">⚠️ Đừng đọc "L4 480 MB" thành "bộ nhớ chính". Nó là <em>CACHE</em> — DRAM của cỗ máy này tính bằng terabyte. Việc của L4 là trả lời thay cho cả node, để lưu lượng nhất quán và các yêu cầu bộ nhớ không thoát ra S-Bus và A-Bus.</p>`],

      [30, 'Summary — Chapter 21, Multicore Computers (and the end of the course)',
        `<p class="y-chinh">🎯 The closing slide lists the chapter under six headings. Use it as a self-test: if you cannot say two sentences about each line, that is the slide to go back to.</p>
<table>
<tr><th>Summary heading</th><th>Where it was</th><th>The one thing to remember</th></tr>
<tr><td><strong>Hardware performance issues</strong> — increase in parallelism and complexity · power consumption</td><td>slides 2–3</td><td>ILP ran out (Fig 21.1) and power density ran up (Fig 21.2): P ≈ C·V<sup>2</sup>·f</td></tr>
<tr><td><strong>Software performance issues</strong> — software on multicore · Valve game software example</td><td>slides 4–8</td><td>Amdahl: 5% sequential caps you at 20×; granularity decides whether splitting pays</td></tr>
<tr><td><strong>Multicore organization</strong> — levels of cache · simultaneous multithreading</td><td>slides 2, 9</td><td>the four panels of Figure 21.6; L1 is always private</td></tr>
<tr><td><strong>Heterogeneous multicore organization</strong> — different ISAs · equivalent ISAs · cache coherence and the MOESI model</td><td>slides 10–20</td><td>CPU+GPU/DSP cannot share binaries; big.Little can; MOESI = MESI + Owned</td></tr>
<tr><td><strong>Intel Core i7-5960X</strong></td><td>slide 21</td><td>8 cores, private 256 kB L2, shared 20 MB L3 = Figure 21.6(d)</td></tr>
<tr><td><strong>ARM Cortex-A15 MPCore</strong> — interrupt handling · cache coherency · L2 cache coherency</td><td>slides 22–27</td><td>shared L2 = panel (c); GIC routes interrupts; SCU + DDI + duplicated tags + migratory lines</td></tr>
<tr><td><strong>IBM z13 mainframe</strong> — organization · cache structure</td><td>slides 28–29</td><td>48 cores per drawer, four cache levels, 480 MB shared eDRAM L4</td></tr>
</table>
<p class="nhan">📐 <strong>And now close the whole course.</strong> Fifteen chapters were one continuous argument, and it reads best from the bottom up:</p>
<table>
<tr><th>Layer</th><th>Chapters</th><th>The question it answered</th></tr>
<tr><td><strong>Gates and circuits</strong></td><td>Ch.9 (digital logic), Ch.10–11 (number systems, arithmetic)</td><td>how do you build an adder out of switches, and how are numbers represented at all?</td></tr>
<tr><td><strong>The machine instruction</strong></td><td>Ch.10–11 on the site (instruction sets, addressing modes)</td><td>what is the contract between hardware and software?</td></tr>
<tr><td><strong>The processor</strong></td><td>Ch.12–14 (processor structure, RISC, pipelining, superscalar, control unit)</td><td>how do you execute that contract fast — and where does "fast" stop?</td></tr>
<tr><td><strong>Memory and I/O</strong></td><td>Ch.4–7 (hierarchy, cache, internal/external memory, I/O, OS support)</td><td>how do you feed the processor, given that no memory is fast, big and cheap?</td></tr>
<tr><td><strong>Parallelism</strong></td><td>Ch.15 (parallel processing, multicore — this lesson)</td><td>when one processor can go no faster, what then?</td></tr>
</table>
<p class="dap-an">✅ The single thread through all of it: <strong>every level of a computer is the same trade-off in new clothes</strong>. Fast/big/cheap for memory (Ch.4), simple/fast versus complex/capable for instruction sets (RISC vs CISC), deep pipeline versus branch penalty (Ch.14), private versus shared cache (Figure 21.6), one strong core versus many weak ones (Table 21.1). You were never learning facts about chips; you were learning to recognise a trade-off and to price both sides of it.</p>
<p class="meo">💡 <strong>Where to go next, in order of usefulness.</strong> (1) Write assembly for a simple machine — MARIE, MIPS or ARM — until the fetch/decode/execute cycle is muscle memory; nothing else makes Ch.12–14 concrete so fast. (2) Take an <em>operating systems</em> course: Ch.7 (OS support), the interrupt slides here and the coherence chapters are its prerequisites, and multicore scheduling is where this chapter continues. (3) Write a small multi-threaded program and <em>measure</em> it, exactly as this lesson did on slide 4 — you will see Amdahl's law with your own eyes, and that is the fastest way to stop believing that more cores means more speed.</p>
<p class="pitfall">⚠️ Final exam warning about this very slide: it writes "<strong>the MOESI model</strong>", while Table 21.2 on slide 20 labelled the same thing "MOISI" and labelled MESI "MESIM". The summary is the one that is right. And do not rely on the summary's ordering as the exam's ordering — it lists Intel and IBM before ARM, while the slides run ARM before IBM.</p>`,
        `<p class="y-chinh">🎯 Slide khép lại liệt kê cả chương theo sáu đề mục. Hãy dùng nó làm bài tự kiểm: dòng nào bạn không nói nổi hai câu thì đó là slide cần quay lại.</p>
<table>
<tr><th>Đề mục tổng kết</th><th>Nằm ở đâu</th><th>Một điều phải nhớ</th></tr>
<tr><td><strong>Vấn đề hiệu năng PHẦN CỨNG</strong> — tăng tính song song và độ phức tạp · tiêu thụ điện năng</td><td>slide 2–3</td><td>ILP đã cạn (Fig 21.1) và mật độ công suất thì leo (Fig 21.2): P ≈ C·V<sup>2</sup>·f</td></tr>
<tr><td><strong>Vấn đề hiệu năng PHẦN MỀM</strong> — phần mềm trên đa lõi · ví dụ game của Valve</td><td>slide 4–8</td><td>Amdahl: 5% tuần tự chặn trần ở 20×; độ mịn quyết định chẻ việc có lời hay không</td></tr>
<tr><td><strong>Tổ chức đa lõi</strong> — các tầng cache · đa luồng đồng thời</td><td>slide 2, 9</td><td>bốn ô của Figure 21.6; L1 LUÔN riêng</td></tr>
<tr><td><strong>Tổ chức đa lõi KHÔNG ĐỒNG NHẤT</strong> — ISA khác nhau · ISA tương đương · nhất quán cache và mô hình MOESI</td><td>slide 10–20</td><td>CPU+GPU/DSP không chung được mã nhị phân; big.Little thì chung được; MOESI = MESI + Owned</td></tr>
<tr><td><strong>Intel Core i7-5960X</strong></td><td>slide 21</td><td>8 lõi, L2 riêng 256 kB, L3 dùng chung 20 MB = Figure 21.6(d)</td></tr>
<tr><td><strong>ARM Cortex-A15 MPCore</strong> — xử lý ngắt · nhất quán cache · nhất quán cache L2</td><td>slide 22–27</td><td>L2 dùng chung = ô (c); GIC định tuyến ngắt; SCU + DDI + thẻ nhân đôi + dòng di trú</td></tr>
<tr><td><strong>Mainframe IBM z13</strong> — tổ chức · cấu trúc cache</td><td>slide 28–29</td><td>48 lõi mỗi drawer, bốn tầng cache, L4 eDRAM dùng chung 480 MB</td></tr>
</table>
<p class="nhan">📐 <strong>Và bây giờ khép lại CẢ MÔN.</strong> Mười lăm chương là MỘT lập luận liên tục, và đọc từ dưới lên là dễ thấy nhất:</p>
<table>
<tr><th>Tầng</th><th>Chương</th><th>Câu hỏi nó trả lời</th></tr>
<tr><td><strong>Cổng logic và mạch</strong></td><td>Ch.9 (logic số), Ch.10–11 (hệ đếm, số học)</td><td>làm sao dựng được bộ cộng từ mấy cái công tắc, và rốt cuộc số được biểu diễn thế nào?</td></tr>
<tr><td><strong>Lệnh máy</strong></td><td>Ch.10–11 trên web (tập lệnh, chế độ địa chỉ)</td><td>bản hợp đồng giữa phần cứng và phần mềm là gì?</td></tr>
<tr><td><strong>Bộ xử lý</strong></td><td>Ch.12–14 (cấu trúc bộ xử lý, RISC, pipeline, superscalar, khối điều khiển)</td><td>làm sao thực thi bản hợp đồng đó cho NHANH — và chữ "nhanh" dừng lại ở đâu?</td></tr>
<tr><td><strong>Bộ nhớ và vào/ra</strong></td><td>Ch.4–7 (phân cấp, cache, bộ nhớ trong/ngoài, I/O, hỗ trợ hệ điều hành)</td><td>làm sao nuôi đủ cho bộ xử lý, khi không bộ nhớ nào vừa nhanh vừa lớn vừa rẻ?</td></tr>
<tr><td><strong>Song song</strong></td><td>Ch.15 (xử lý song song, đa lõi — chính bài này)</td><td>khi một bộ xử lý không nhanh hơn được nữa thì làm gì tiếp?</td></tr>
</table>
<p class="dap-an">✅ Sợi chỉ xuyên suốt tất cả: <strong>mọi tầng của máy tính đều là CÙNG MỘT sự đánh đổi khoác áo mới</strong>. Nhanh/lớn/rẻ ở bộ nhớ (Ch.4), đơn giản-nhanh so với phức tạp-làm-được-nhiều ở tập lệnh (RISC với CISC), pipeline sâu so với hình phạt rẽ nhánh (Ch.14), cache riêng so với cache chung (Figure 21.6), một lõi mạnh so với nhiều lõi yếu (Table 21.1). Bạn chưa bao giờ học thuộc dữ kiện về mấy con chip; bạn đang học cách NHẬN RA một sự đánh đổi và BÁO GIÁ được cả hai phía của nó.</p>
<p class="meo">💡 <strong>Học tiếp gì, xếp theo mức hữu ích.</strong> (1) Viết hợp ngữ cho một cỗ máy đơn giản — MARIE, MIPS hoặc ARM — cho tới khi vòng nạp/giải mã/thực thi thành phản xạ; không thứ gì làm Ch.12–14 cụ thể hoá nhanh bằng. (2) Học một môn <em>HỆ ĐIỀU HÀNH</em>: Ch.7 (hỗ trợ hệ điều hành), mấy slide ngắt ở đây và các chương nhất quán chính là phần tiên quyết của nó, và lập lịch trên đa lõi là chỗ chương này đi tiếp. (3) Viết một chương trình đa luồng nhỏ rồi <em>ĐO</em> nó, đúng như bài này đã làm ở slide 4 — bạn sẽ thấy định luật Amdahl bằng chính mắt mình, và đó là cách nhanh nhất để thôi tin rằng nhiều lõi nghĩa là nhanh hơn.</p>
<p class="pitfall">⚠️ Cảnh báo cuối về chính slide này: nó viết "<strong>the MOESI model</strong>", trong khi Table 21.2 ở slide 20 gọi đúng thứ đó là "MOISI" và gọi MESI là "MESIM". Cái ĐÚNG là slide tổng kết. Và đừng tin thứ tự của slide tổng kết là thứ tự của đề thi — nó xếp Intel và IBM trước ARM, còn bộ slide thì chạy ARM trước IBM.</p>`],

    ]),
  ].join('\n'),
};
