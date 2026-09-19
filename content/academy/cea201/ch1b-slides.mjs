/**
 * CEA201 · Chương 1 — Basic Concepts and Computer Evolution, học theo từng slide: PHẦN B (slide 23–43).
 * Deck 'cea1' (CEA1), 43 slide, ảnh đã render lên CDN images/academy/CEA201/v1/cea1/NNN.webp.
 * Nối tiếp ch1a-slides.mjs (slide 1–22).
 *
 * Nội dung bám ĐÚNG chữ trích từ CH01-COA11e.pptx của trường (/tmp/cea201-text/cea1.txt, slide 23→43).
 * Bộ slide CHÍNH HÃNG đi kèm Stallings, "Computer Organization and Architecture: Designing for
 * Performance", 11th Edition Global Edition (Pearson, 2022), tỉ lệ 4:3.
 * Các slide chỉ có tiêu đề + hình (23, 24, 25, 26, 27, 32, 33, 35, 38, 40, 41, 42) đã được đọc
 * thẳng từ ảnh đã render để lấy đúng từng nhãn trong sơ đồ.
 *
 * Những chỗ SLIDE GỐC SAI, LỖI THỜI hoặc dễ gây hiểu nhầm — đã nêu rõ trong bài, KHÔNG im lặng
 * chép lại và KHÔNG tự ý sửa slide:
 *   · slide 25 (Figure 1.11): nhãn trục tung ghi "10.000" (dấu chấm) lẫn giữa "100,000" và
 *     "1,000" (dấu phẩy) — phải đọc là 10,000. Biểu đồ dừng ở 2011 nên KHÔNG thấy giai đoạn
 *     chững lại sau ~2015. Đồ thị là DRAM, không phải bộ xử lý.
 *   · slide 26: "has sustained that rate ever since" (vẫn giữ nhịp 18 tháng tới nay) KHÔNG đúng
 *     với chính bảng số liệu của sách ở slide 28–31: 4004 (2.300 transistor, 1971) → i9-7900X
 *     (7,2 tỉ, 2017) là 3,13 triệu lần trong 46 năm = một lần gấp đôi mỗi 2,13 năm. Nếu nhịp
 *     18 tháng có thật thì 2017 phải có 3,9×10¹² transistor, gấp 544 lần thực tế.
 *   · slide 28: tiêu đề cột ghi "Feature size (m)" — rụng ký tự µ, phải là µm. Cột 8088 ghi
 *     6 µm trong khi 8086 ra trước một năm, cùng 29.000 transistor, lại ghi 3 µm.
 *   · slide 30: Pentium Pro ghi "512 kB L1 and 1 MB L2". Con số L1 không thể đúng — Pentium Pro
 *     có L1 8 kB lệnh + 8 kB dữ liệu = 16 kB, còn 256 kB/512 kB/1 MB là L2 đóng chung gói.
 *   · slide 32: hộp 8086 bị TRÀN CHỮ, cụt ở "(securing the success of Intel" — thiếu dấu đóng
 *     ngoặc và phần còn lại của câu.
 *   · slide 40: bốn hàng cuối của đồ hoạ để TRỐNG (lỗi bố cục), không phải thiếu nội dung.
 *   · slide 41: đồ hoạ là bậc thang đi lên A → R → M, dễ bị hiểu nhầm M mạnh nhất. Không phải
 *     xếp hạng hiệu năng, mà là ba đích ngắm khác nhau.
 *   · slide 43 (Summary) liệt kê "ARM evolution" và "Instruction set architecture" nhưng bộ
 *     slide 11th ed KHÔNG có slide riêng cho hai mục đó — chúng là mục trong SÁCH.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea1';

export default {
  title: '1.0b — Slide by slide: Microelectronics, Moore’s law, the Intel line, embedded systems and ARM (slides 23–43)|||1.0b — Slide bài giảng: Vi điện tử, định luật Moore, dòng Intel, hệ nhúng & ARM (slide 23–43)',
  slug: 'cea201-1-0b-slides-moore-intel-arm',
  type: 'DOCUMENT',
  description: 'Nửa sau Chương 1 của CEA201 (slide 23–43) theo đúng bộ slide chính hãng Stallings 11th Edition: từ tấm wafer silic và quan hệ wafer–chip–gate, qua đồ thị tăng trưởng transistor và định luật Moore, tới bốn bảng số liệu tiến hoá vi xử lý Intel từ 4004 (1971) đến Core i9-7900X (2017). Mọi con số trong bảng đều được tính lại để rút ra ba kết luận lớn của môn: nhịp gấp đôi thật là 2,13 năm chứ không phải 18 tháng, xung nhịp đứng lại từ năm 2000 vì tường công suất P ≈ C·V²·f nên transistor dư được đổ vào ĐA LÕI và CACHE, và khoảng cách CPU–RAM chính là lý do tồn tại của Chương 4–5. Phần cuối đi hết hệ nhúng, IoT, vi điều khiển và kiến trúc ARM, có chỉ rõ những chỗ slide gốc ghi sai hoặc đã lỗi thời.',
  content: [
    walkHead(D, 23, 43),
    walk(D, [

      [23, 'Figure 1.9 — Relationship Among Wafer, Chip, and Gate',
        `<p class="y-chinh">🎯 One picture, three zoom levels: a round <strong>wafer</strong> is diced into hundreds of rectangular <strong>chips</strong>; each chip holds millions of <strong>gates</strong>; a chip is then sealed into a <strong>packaged chip</strong> with legs you can solder. This is the manufacturing hierarchy behind slide 21.</p>
<ul>
<li><strong>Why the wafer is round and the chips are not</strong> — silicon is grown as a cylindrical single crystal (an ingot) and sliced into discs, so the raw material is round; chips are cut out with straight saw lines, so they are rectangular. Look at the rim of the figure: the partial squares there are wasted silicon, and that waste is one reason bigger wafers (300 mm today) are better.</li>
<li><strong>The economic point — cost is per WAFER, not per chip.</strong> Slide 21 already said "many transistors can be produced at the same time on a single wafer". The whole wafer goes through the same few hundred process steps whatever is printed on it, so the price of one chip is roughly (wafer cost) ÷ (good chips per wafer).</li>
<li><strong>Two ways to get more chips per wafer</strong> — make the wafer bigger, or make each chip smaller. Shrinking the feature size (slides 28–31) does the second, and that is the real engine behind everything getting cheaper.</li>
<li><strong>Yield is why small dies win twice.</strong> Defects land on the wafer more or less at random. A big die is more likely to catch one and be thrown away; a small die is both more numerous and more likely to be good. Halve the linear size and you quarter the area.</li>
<li><strong>Why package at all</strong> — the bare chip in the figure is a few millimetres across with contact pads microns apart; no human and no circuit board can connect to that. The package converts micron pitch into millimetre pitch, protects the die, and spreads heat.</li>
</ul>
<p class="dap-an">✅ Worked example (arithmetic, not on the slide). A 300 mm wafer has area π × 150² ≈ 70,686 mm². Ignoring edge loss: a 100 mm² die gives about 70,686 ÷ 100 ≈ <strong>707 dies</strong>; shrink the linear feature by half so the same circuit needs 25 mm² and you get 70,686 ÷ 25 ≈ <strong>2,827 dies</strong> — 4× as many from the same wafer, at the same wafer cost. That factor of 4 per halving is the whole business model of the semiconductor industry.</p>
<p class="pitfall">⚠️ Do not use "chip" and "package" as synonyms in an exam answer — the figure deliberately draws them as two separate objects. The <em>chip</em> (also called the <em>die</em>) is the bare square of silicon; the <em>packaged chip</em> is that square sealed in plastic or ceramic with pins. And a <em>wafer</em> is never one chip: it is the sheet many chips are cut from.</p>`,
        `<p class="y-chinh">🎯 Một bức hình, ba mức phóng to: tấm <strong>wafer</strong> tròn được cắt thành hàng trăm <strong>chip</strong> hình chữ nhật; mỗi chip chứa hàng triệu <strong>cổng logic (gate)</strong>; rồi chip được đóng vào vỏ thành <strong>packaged chip</strong> có chân để hàn. Đây là bậc thang chế tạo nằm sau slide 21.</p>
<ul>
<li><strong>Vì sao wafer tròn mà chip thì không</strong> — silic được nuôi thành một thỏi đơn tinh thể hình trụ rồi cắt thành lát, nên vật liệu thô là hình tròn; chip thì cưa theo đường thẳng nên ra hình chữ nhật. Nhìn kỹ viền hình: những ô vuông bị cắt dở ở rìa chính là silic bỏ đi, và đó là một lý do wafer càng to càng lợi (ngày nay 300 mm).</li>
<li><strong>Điểm kinh tế mấu chốt — tiền tính theo WAFER, không theo chip.</strong> Slide 21 đã nói "nhiều transistor được tạo ra cùng lúc trên một tấm wafer". Cả tấm đi qua cùng vài trăm bước công nghệ bất kể in cái gì lên đó, nên giá một con chip xấp xỉ (giá một wafer) ÷ (số chip TỐT trên wafer đó).</li>
<li><strong>Hai cách lấy thêm chip từ một wafer</strong> — làm wafer to hơn, hoặc làm mỗi chip nhỏ đi. Thu nhỏ kích thước đặc trưng (slide 28–31) là cách thứ hai, và đó mới là động cơ thật sự làm mọi thứ rẻ đi.</li>
<li><strong>Tỉ lệ đạt (yield) khiến die nhỏ thắng kép.</strong> Khuyết tật rơi lên wafer gần như ngẫu nhiên. Die to dễ dính khuyết tật hơn nên dễ bị vứt; die nhỏ vừa nhiều hơn vừa ít hỏng hơn. Giảm kích thước dài đi một nửa thì diện tích còn một phần tư.</li>
<li><strong>Đóng gói để làm gì</strong> — con chip trần trong hình chỉ vài milimét, các điểm tiếp xúc cách nhau vài micromét; không tay người nào, không bo mạch nào nối vào đó được. Vỏ chip đổi bước chân từ micromét sang milimét, che chắn cho die, và tản nhiệt.</li>
</ul>
<p class="dap-an">✅ Ví dụ tính tay (phép tính này KHÔNG có trên slide). Wafer 300 mm có diện tích π × 150² ≈ 70.686 mm². Bỏ qua hao rìa: die 100 mm² cho khoảng 70.686 ÷ 100 ≈ <strong>707 die</strong>; thu nhỏ kích thước dài đi một nửa để cùng mạch ấy chỉ còn 25 mm² thì được 70.686 ÷ 25 ≈ <strong>2.827 die</strong> — gấp 4 lần, từ cùng một tấm wafer, cùng một giá wafer. Hệ số 4 sau mỗi lần giảm nửa chính là toàn bộ mô hình kinh doanh của ngành bán dẫn.</p>
<p class="pitfall">⚠️ Đừng dùng "chip" và "vỏ chip" như đồng nghĩa trong bài thi — hình vẽ cố ý tách chúng thành hai vật. <em>Chip</em> (còn gọi là <em>die</em>) là miếng silic trần; <em>packaged chip</em> là miếng ấy đã bọc nhựa/gốm và có chân. Còn <em>wafer</em> không bao giờ là một chip: nó là tấm để cắt ra nhiều chip.</p>`],

      [24, 'Figure 1.10 — Processor or Memory Chip on Motherboard',
        `<p class="y-chinh">🎯 Two photographs continuing the zoom of Figure 1.9 one step outward: (a) a close-up of a packaged chip with its legs fanned out, and (b) that kind of chip sitting on a real motherboard among capacitors and resistors. Silicon does not float in space — it lives on a board.</p>
<ul>
<li><strong>What you are actually looking at in (a)</strong> — the black square is the <em>package</em>, not the die. The die is inside it, typically a quarter of that area or less. The metal legs are the second-level connection of Figure 1.12 (slide 27): package → printed circuit board.</li>
<li><strong>Count the legs and you learn something</strong> — every pin is a wire the chip needs to the outside world: address lines, data lines, control lines, power and ground. Slide 28's "bus width 4 bits → 64 bits" column is literally a count of some of these pins, and pin count is one of the hard physical limits on a processor's bandwidth. Chapter 3 will call this the <em>system bus</em>.</li>
<li><strong>Why packages have pins on all four sides (or underneath)</strong> — a chip's edge is short and pins need room. A modern processor has over a thousand connections, which no edge row can carry, so the pins moved to the underside as a ball grid array. The photo shows the older quad-flat style, easier to see.</li>
<li><strong>The board is the interconnection</strong> — the green traces are the physical form of "System Interconnection", the fourth structural component listed on slide 7. Structure (slide 4) is not an abstraction here; it is copper you can photograph.</li>
<li><strong>The other components matter too</strong> — the little cylinders and blocks around the chip are capacitors and resistors that stabilise the supply voltage. A processor switching billions of times per second demands current in violent bursts; without local capacitors the voltage would sag and the chip would compute wrong answers.</li>
</ul>
<p class="meo">💡 Hold the three scales in one sentence: <strong>gate (nanometres) → die (millimetres) → package (centimetres) → board (tens of centimetres)</strong>. Each step up is roughly 1,000× larger, and each step exists only to let the next one connect to it.</p>
<p class="pitfall">⚠️ These are photographs of packages, so you cannot see a single transistor in them — at 14 nm a transistor is about 5,000× smaller than the wavelength of visible light is coarse enough to resolve. If an exam figure is captioned "chip on motherboard", the expected answer is about packaging and interconnection, never about gate structure.</p>`,
        `<p class="y-chinh">🎯 Hai tấm ảnh nối tiếp phép phóng to của Figure 1.9 thêm một nấc ra ngoài: (a) cận cảnh một con chip đã đóng vỏ với dàn chân xoè ra, và (b) đúng loại chip ấy nằm trên một bo mạch chủ thật, giữa tụ và điện trở. Silic không lơ lửng giữa không trung — nó sống trên một tấm bo.</p>
<ul>
<li><strong>Thứ bạn đang nhìn ở (a) là gì</strong> — khối vuông đen là <em>vỏ chip</em>, không phải die. Die nằm bên trong, thường chỉ bằng một phần tư diện tích ấy hoặc nhỏ hơn. Dàn chân kim loại chính là "second level connection" của Figure 1.12 (slide 27): vỏ chip → bo mạch in.</li>
<li><strong>Đếm chân là học được một điều</strong> — mỗi chân là một sợi dây chip cần nối ra thế giới: đường địa chỉ, đường dữ liệu, đường điều khiển, nguồn và đất. Cột "bus width 4 bit → 64 bit" ở slide 28 chính là đếm một phần số chân này, và số chân là một trong những giới hạn vật lý cứng nhất của băng thông bộ xử lý. Chương 3 sẽ gọi nó là <em>bus hệ thống</em>.</li>
<li><strong>Vì sao vỏ chip có chân cả bốn cạnh (hoặc nằm dưới bụng)</strong> — cạnh chip thì ngắn mà chân thì cần chỗ. Bộ xử lý hiện đại có trên một nghìn mối nối, không hàng cạnh nào chở nổi, nên chân dời xuống mặt dưới thành lưới bi (BGA). Ảnh chụp kiểu cũ hơn (chân xoè bốn cạnh) cho dễ nhìn.</li>
<li><strong>Bo mạch chính là phần liên kết</strong> — những đường màu xanh lá chính là hình hài vật lý của "System Interconnection", thành phần cấu trúc thứ tư liệt kê ở slide 7. Ở đây "cấu trúc" (slide 4) không còn trừu tượng; nó là đồng, chụp ảnh được.</li>
<li><strong>Mấy linh kiện xung quanh cũng có việc</strong> — các trụ nhỏ và khối vuông cạnh chip là tụ và điện trở giữ ổn định điện áp nguồn. Một bộ xử lý đóng ngắt hàng tỉ lần mỗi giây rút dòng theo từng đợt dữ dội; không có tụ đặt sát bên thì điện áp sụt và chip tính ra kết quả sai.</li>
</ul>
<p class="meo">💡 Nhớ ba thang đo trong một câu: <strong>cổng logic (nanomét) → die (milimét) → vỏ chip (xentimét) → bo mạch (vài chục xentimét)</strong>. Mỗi nấc lớn hơn nấc trước khoảng 1.000 lần, và nấc nào cũng chỉ tồn tại để nấc kế tiếp nối được vào.</p>
<p class="pitfall">⚠️ Đây là ảnh chụp VỎ chip, nên trong đó bạn không thể thấy một transistor nào — ở 14 nm, transistor nhỏ hơn bước sóng ánh sáng nhìn thấy hàng chục lần, kính hiển vi quang học không phân giải nổi. Nếu đề thi đưa hình chú thích "chip on motherboard" thì đáp án mong đợi nói về đóng gói và liên kết, không bao giờ nói về cấu tạo cổng logic.</p>`],

      [25, 'Figure 1.11 — Growth in Transistor Count on Integrated Circuits (DRAM memory)',
        `<p class="y-chinh">🎯 One chart, one message: on a <strong>logarithmic</strong> vertical axis the transistor count draws an almost straight line from 1947 to 2011 — and a straight line on a log axis means <strong>exponential growth</strong>. Three vertical markers date the story: first working transistor (1947), invention of the integrated circuit (≈1958), Moore's law promulgated (1965).</p>
<table>
<tr><th>What the axis says</th><th>How to read it</th></tr>
<tr><td>Vertical: 1 · 10 · 100 · 1,000 · 10,000 · 100,000 · 10 m · 100 m · 1 bn · 10 bn · 100 bn</td><td>Each gridline is <strong>×10</strong>, not +10. Eleven gridlines span a factor of 10<sup>10</sup>. "m" = million, "bn" = billion.</td></tr>
<tr><td>Horizontal: 1947 → 2011, evenly spaced</td><td>Linear time. So constant slope = constant <em>ratio</em> per year = exponential.</td></tr>
<tr><td>The curve</td><td>≈1 transistor in 1947 · ≈1,000 around 1965 · ≈100,000 around 1980 · ≈10 billion by 2011.</td></tr>
</table>
<ul>
<li><strong>Why a log axis is the honest way to draw this.</strong> On a linear axis everything before 2000 would be flat against the floor and you would see nothing. The log axis turns "multiply by 2 every N years" into a straight line whose slope <em>is</em> the doubling rate — so you can read the rate off the picture instead of trusting a slogan.</li>
<li><strong>The slope steepens slightly around 1975–1980</strong> — the curve is not perfectly straight. That kink is the transition from small/medium-scale integration to LSI and VLSI, and it is exactly the period slide 26 says the pace settled to "every 18 months".</li>
<li><strong>Read the caption, it changes the meaning</strong> — this is <strong>DRAM memory</strong>, not processors. DRAM is the densest, most regular circuit anybody makes (one transistor and one capacitor per bit, repeated identically), so it always leads logic by a few years. Quoting this curve as "processor transistor counts" is a factual error; the processor numbers are in the tables on slides 28–31.</li>
<li><strong>Where it links back</strong> — CSI106 taught you five generations by name (vacuum tube, transistor, IC, VLSI, ULSI). This one chart is those five generations measured instead of named, and CEA201 expects you to compute with it, not recite it.</li>
</ul>
<p class="dap-an">✅ Read the rate off the chart. From ≈1 transistor in 1947 to ≈10<sup>10</sup> in 2011 is a factor of 10<sup>10</sup> over 64 years. log₂(10<sup>10</sup>) = 33.2 doublings, so 64 ÷ 33.2 ≈ <strong>one doubling every 1.93 years</strong>. That is the honest slope of this picture — close to two years, <em>not</em> the 18 months slide 26 claims, and almost exactly the 2.13 years the Intel tables give on slides 28–31.</p>
<p class="pitfall">⚠️ Two defects in this slide to notice rather than copy. (1) The axis label between "100,000" and "1,000" is printed <strong>"10.000"</strong> with a decimal point while its neighbours use commas — read it as ten thousand, not ten. (2) The chart <strong>stops at 2011</strong>, so the flattening of the curve after about 2015 simply is not in the picture; do not cite this figure as evidence that growth continues today.</p>`,
        `<p class="y-chinh">🎯 Một biểu đồ, một thông điệp: trên trục tung <strong>logarit</strong>, số transistor vẽ thành một đường gần như thẳng từ 1947 tới 2011 — mà đường thẳng trên trục log nghĩa là <strong>tăng theo hàm mũ</strong>. Ba vạch dọc đánh dấu mốc: transistor đầu tiên chạy được (1947), phát minh mạch tích hợp (≈1958), định luật Moore được nêu ra (1965).</p>
<table>
<tr><th>Trục ghi gì</th><th>Đọc thế nào</th></tr>
<tr><td>Trục tung: 1 · 10 · 100 · 1.000 · 10.000 · 100.000 · 10 m · 100 m · 1 bn · 10 bn · 100 bn</td><td>Mỗi vạch là <strong>×10</strong>, không phải +10. Mười một vạch trải một hệ số 10<sup>10</sup>. "m" = triệu, "bn" = tỉ.</td></tr>
<tr><td>Trục hoành: 1947 → 2011, chia đều</td><td>Thời gian tuyến tính. Nên độ dốc không đổi = <em>tỉ lệ</em> mỗi năm không đổi = hàm mũ.</td></tr>
<tr><td>Đường cong</td><td>≈1 transistor năm 1947 · ≈1.000 quãng 1965 · ≈100.000 quãng 1980 · ≈10 tỉ vào 2011.</td></tr>
</table>
<ul>
<li><strong>Vì sao trục log mới là cách vẽ trung thực.</strong> Trên trục tuyến tính, mọi thứ trước năm 2000 sẽ bẹp dí sát đáy và bạn chẳng thấy gì. Trục log biến "cứ N năm nhân đôi" thành một đường thẳng mà độ dốc CHÍNH LÀ nhịp gấp đôi — nhờ vậy bạn đọc được nhịp ấy từ bức hình thay vì tin vào một câu khẩu hiệu.</li>
<li><strong>Độ dốc hơi dựng lên quãng 1975–1980</strong> — đường cong không thẳng tuyệt đối. Chỗ gấp khúc đó là lúc chuyển từ tích hợp cỡ nhỏ/vừa sang LSI rồi VLSI, và đúng là giai đoạn slide 26 nói nhịp đã ổn định ở "mỗi 18 tháng".</li>
<li><strong>Đọc chú thích hình, nó đổi cả nghĩa</strong> — đây là <strong>bộ nhớ DRAM</strong>, không phải bộ xử lý. DRAM là mạch dày đặc và đều đặn nhất mà con người làm được (mỗi bit chỉ một transistor và một tụ, lặp lại y hệt), nên nó luôn đi trước mạch logic vài năm. Đem đường cong này gọi là "số transistor của CPU" là sai sự thật; số của CPU nằm ở các bảng slide 28–31.</li>
<li><strong>Nối về chỗ đã học</strong> — CSI106 dạy bạn gọi tên năm thế hệ (đèn điện tử, transistor, IC, VLSI, ULSI). Biểu đồ này là năm thế hệ ấy được ĐO thay vì được GỌI TÊN, và CEA201 đòi bạn tính toán trên nó chứ không đọc thuộc.</li>
</ul>
<p class="dap-an">✅ Đọc nhịp ngay trên biểu đồ. Từ ≈1 transistor năm 1947 lên ≈10<sup>10</sup> năm 2011 là hệ số 10<sup>10</sup> trong 64 năm. log₂(10<sup>10</sup>) = 33,2 lần gấp đôi, vậy 64 ÷ 33,2 ≈ <strong>một lần gấp đôi mỗi 1,93 năm</strong>. Đó là độ dốc thật của bức hình — gần hai năm, <em>không phải</em> 18 tháng như slide 26 khẳng định, và gần khớp với 2,13 năm mà bảng Intel ở slide 28–31 cho ra.</p>
<p class="pitfall">⚠️ Hai lỗi của slide này cần NHẬN RA chứ đừng chép lại. (1) Nhãn trục nằm giữa "100,000" và "1,000" in là <strong>"10.000"</strong> với dấu chấm trong khi các nhãn xung quanh dùng dấu phẩy kiểu Anh — phải đọc là mười nghìn, không phải mười. (2) Biểu đồ <strong>dừng ở 2011</strong>, nên đoạn đường cong chững lại sau khoảng 2015 đơn giản là không có trong hình; đừng lấy hình này làm bằng chứng rằng đà tăng vẫn tiếp diễn tới hôm nay.</p>`],

      [26, 'Moore’s Law',
        `<p class="y-chinh">🎯 <strong>1965; Gordon Moore, co-founder of Intel:</strong> the <em>observed</em> number of transistors that could be put on a single chip was doubling every year. The slide adds that the pace slowed to a doubling every 18 months in the 1970s "but has sustained that rate ever since", then lists five consequences.</p>
<table>
<tr><th>The five consequences on the slide</th><th>Why it follows</th></tr>
<tr><td>The cost of computer logic and memory circuitry has fallen at a dramatic rate</td><td>Same wafer cost ÷ many more, smaller dies (slide 23).</td></tr>
<tr><td>The electrical path length is shortened, increasing operating speed</td><td>Signals travel at a finite speed and every millimetre of wire adds delay and capacitance. Closer = faster.</td></tr>
<tr><td>Computer becomes smaller and more convenient to use in a variety of environments</td><td>This is the sentence that ends in slides 34–39: embedded systems and the IoT.</td></tr>
<tr><td>Reduction in power and cooling requirements</td><td>True <strong>per transistor</strong>. Per chip it stopped being true around 2004 — see slide 31.</td></tr>
<tr><td>Fewer interchip connections</td><td>Functions that needed several chips fit on one, so the slow, power-hungry off-chip wires disappear. Slide 27's multichip module attacks the same problem from the other side.</td></tr>
</table>
<ul>
<li><strong>It is an observation, not a law of physics.</strong> Moore counted a handful of points on a graph in a 1965 <em>Electronics</em> magazine article and drew a line through them. Nothing in nature enforces it; it held because an industry organised its investment around it. The slide's own word is <em>"Observed"</em> — quote that word in an exam answer.</li>
<li><strong>Exponentials get absurd quickly — do the arithmetic.</strong> Doubling every 2 years for 20 years = 2<sup>10</sup> = <strong>1,024×</strong>. Doubling every 18 months for 20 years = 20 ÷ 1.5 = 13.3 doublings = <strong>≈10,300×</strong>. Moore's original every-year claim over 20 years = 2<sup>20</sup> = <strong>1,048,576×</strong>. The gap between the three versions is why the exact interval matters.</li>
<li><strong>It has been slowing since roughly 2015, for three separate reasons.</strong> <em>Physics:</em> a 5 nm dimension is about 21 silicon atoms wide (nearest-neighbour spacing ≈ 0.235 nm), and you cannot have half an atom. <em>Leakage:</em> once the gate insulator is a few atoms thick, electrons tunnel through it and the transistor leaks current even when switched off, so static power no longer shrinks. <em>Money:</em> a leading-edge fabrication plant now costs well over ten billion dollars, and that cost has been doubling roughly every four years — often called Rock's law, or "Moore's second law". Growth stops when the next step stops paying for itself.</li>
<li><strong>Where the industry went instead</strong> — if you cannot make one core much faster, put several on the die (slides 31, 33), stack more cache (slide 30), or bond several dies into one package (slide 27). Every one of those is in this chapter.</li>
</ul>
<p class="dap-an">✅ Test the slide against the book's own data. Slides 28–31 give 4004: 2,300 transistors in 1971; Core i9-7900X: 7.2 billion in 2017. Ratio = 7.2×10<sup>9</sup> ÷ 2,300 ≈ <strong>3,130,000×</strong>; log₂ of that = 21.58 doublings; 46 years ÷ 21.58 = <strong>one doubling every 2.13 years</strong>. Had the 18-month rate truly been "sustained ever since", 46 ÷ 1.5 = 30.7 doublings would give 2,300 × 2<sup>30.7</sup> ≈ <strong>3.9 × 10<sup>12</sup></strong> transistors — <strong>544× more</strong> than the 7.2 billion actually shipped. <em>The slide's claim is not supported by the slide deck's own tables.</em> Say "about two years" and you are both safe and right.</p>
<p class="pitfall">⚠️ The single most common wrong sentence in this course: "Moore's law says processor SPEED doubles every 18 months." Both halves are wrong. The quantity is the <strong>number of transistors on one chip at minimum cost per component</strong>, not speed; and the interval Moore himself used was one year, revised to two. Clock speed stopped doubling around 2004 while transistor counts kept climbing — slide 31 shows exactly that split.</p>`,
        `<p class="y-chinh">🎯 <strong>1965; Gordon Moore, đồng sáng lập Intel:</strong> số transistor <em>quan sát được</em> có thể đặt lên một con chip đang gấp đôi mỗi năm. Slide nói thêm rằng nhịp đó chậm lại còn gấp đôi mỗi 18 tháng vào thập niên 1970 "nhưng vẫn giữ nhịp ấy từ đó tới nay", rồi liệt kê năm hệ quả.</p>
<table>
<tr><th>Năm hệ quả trên slide</th><th>Vì sao suy ra được</th></tr>
<tr><td>Giá thành mạch logic và mạch nhớ giảm cực nhanh</td><td>Cùng giá một wafer chia cho rất nhiều die nhỏ hơn (slide 23).</td></tr>
<tr><td>Đường đi điện ngắn lại, tốc độ làm việc tăng</td><td>Tín hiệu truyền với vận tốc hữu hạn, mỗi milimét dây thêm một chút trễ và điện dung. Gần hơn = nhanh hơn.</td></tr>
<tr><td>Máy tính nhỏ đi, tiện dùng trong nhiều môi trường</td><td>Chính câu này dẫn thẳng tới slide 34–39: hệ nhúng và IoT.</td></tr>
<tr><td>Giảm yêu cầu về nguồn điện và làm mát</td><td>Đúng khi tính <strong>trên mỗi transistor</strong>. Tính trên cả con chip thì điều này hết đúng từ khoảng 2004 — xem slide 31.</td></tr>
<tr><td>Ít mối nối giữa các chip hơn</td><td>Chức năng trước cần vài chip nay gói trong một, nên những sợi dây ra khỏi chip (chậm và tốn điện) biến mất. Module đa chip ở slide 27 đánh vào đúng vấn đề ấy từ hướng ngược lại.</td></tr>
</table>
<ul>
<li><strong>Đây là một QUAN SÁT, không phải định luật vật lý.</strong> Năm 1965 Moore chấm vài điểm lên đồ thị trong một bài trên tạp chí <em>Electronics</em> rồi kẻ một đường qua chúng. Không có quy luật tự nhiên nào bắt buộc điều đó; nó đúng vì cả một ngành công nghiệp đã tổ chức vốn đầu tư quanh nó. Chính slide dùng chữ <em>"Observed"</em> (quan sát được) — hãy trích đúng chữ ấy khi làm bài.</li>
<li><strong>Hàm mũ phi lý rất nhanh — cứ tính ra sẽ thấy.</strong> Gấp đôi mỗi 2 năm trong 20 năm = 2<sup>10</sup> = <strong>1.024 lần</strong>. Gấp đôi mỗi 18 tháng trong 20 năm = 20 ÷ 1,5 = 13,3 lần gấp đôi = <strong>≈10.300 lần</strong>. Còn bản gốc "mỗi năm" của Moore trong 20 năm = 2<sup>20</sup> = <strong>1.048.576 lần</strong>. Khoảng cách giữa ba phiên bản đó cho thấy vì sao cái mốc thời gian phải nói cho đúng.</li>
<li><strong>Nó đã CHẬM LẠI từ khoảng 2015, vì ba lý do tách bạch.</strong> <em>Vật lý:</em> kích thước 5 nm chỉ rộng chừng 21 nguyên tử silic (khoảng cách hai nguyên tử gần nhất ≈ 0,235 nm), mà không ai có nửa nguyên tử. <em>Dòng rò:</em> khi lớp cách điện cổng chỉ còn dày vài nguyên tử, electron chui hầm xuyên qua, transistor rò dòng ngay cả lúc đã tắt, nên công suất tĩnh không giảm theo nữa. <em>Tiền:</em> một xưởng đúc thế hệ mới nay tốn trên mười tỉ đô la, và con số ấy cũng gấp đôi chừng mỗi bốn năm — người ta gọi là định luật Rock, hay "định luật Moore thứ hai". Đà tăng dừng khi bước tiếp theo không còn tự trả nổi chi phí cho mình.</li>
<li><strong>Ngành công nghiệp đã rẽ đi đâu</strong> — nếu không làm một lõi nhanh hơn nhiều được nữa thì đặt vài lõi lên cùng một die (slide 31, 33), chất thêm cache (slide 30), hoặc gắn nhiều die vào cùng một vỏ (slide 27). Cả ba đều nằm trong chương này.</li>
</ul>
<p class="dap-an">✅ Đem chính số liệu của sách ra kiểm câu nói trên slide. Slide 28–31 cho: 4004 có 2.300 transistor năm 1971; Core i9-7900X có 7,2 tỉ năm 2017. Tỉ số = 7,2×10<sup>9</sup> ÷ 2.300 ≈ <strong>3.130.000 lần</strong>; log₂ của nó = 21,58 lần gấp đôi; 46 năm ÷ 21,58 = <strong>một lần gấp đôi mỗi 2,13 năm</strong>. Nếu nhịp 18 tháng thật sự "giữ nguyên tới nay" thì 46 ÷ 1,5 = 30,7 lần gấp đôi sẽ cho 2.300 × 2<sup>30,7</sup> ≈ <strong>3,9 × 10<sup>12</sup></strong> transistor — <strong>gấp 544 lần</strong> con số 7,2 tỉ thực tế. <em>Khẳng định của slide KHÔNG được chính bảng số liệu trong bộ slide này ủng hộ.</em> Trả lời "khoảng hai năm" thì vừa an toàn vừa đúng.</p>
<p class="pitfall">⚠️ Câu sai phổ biến nhất cả môn: "Định luật Moore nói TỐC ĐỘ bộ xử lý gấp đôi mỗi 18 tháng." Sai cả hai vế. Đại lượng là <strong>số transistor trên một chip ở mức giá thấp nhất cho mỗi linh kiện</strong>, không phải tốc độ; còn khoảng thời gian Moore dùng ban đầu là một năm, sau sửa thành hai. Xung nhịp đã ngừng gấp đôi từ khoảng 2004 trong khi số transistor vẫn leo — slide 31 cho thấy đúng chỗ tách đôi đó.</p>`],

      [27, 'Figure 1.12 — Multichip Module (MCM)',
        `<p class="y-chinh">🎯 If one die cannot hold everything, put several <strong>bare chips</strong> side by side on a <strong>common circuit base</strong> and seal them into one <strong>MCM package</strong>. The figure names the two levels of wiring: <em>first level connection</em> (bare chip → common base) and <em>second level connection</em> (module → printed circuit board).</p>
<ul>
<li><strong>Read the drawing bottom-up</strong> — the grey chevron at the bottom is the motherboard; the speckled box sitting on it is the MCM package; inside it the white slab is the common circuit base; on top of that sit three bare, unpackaged chips connected by little arched bond wires. Only the module, not each chip, gets legs to the board.</li>
<li><strong>The point is wire length.</strong> Two chips in separate packages on a board are centimetres apart; two bare dies on a common base are millimetres apart. Shorter wires mean less delay, less capacitance to charge, less power, and fewer driver circuits — exactly the "electrical path length is shortened" and "fewer interchip connections" consequences from slide 26.</li>
<li><strong>It also rescues yield.</strong> One enormous die has a poor chance of being defect-free (slide 23); four quarter-sized dies, tested separately and only the good ones assembled, are far cheaper for the same total silicon area. This is why the technique is now everywhere.</li>
<li><strong>This is the modern answer to the end of Moore's law</strong> — under the name <em>chiplets</em>, MCM packaging is how today's processors keep growing after single-die scaling slowed: several CPU dies plus an I/O die in one package, GPUs with stacks of HBM memory beside the compute die, laptop processors with the DRAM inside the same package.</li>
<li><strong>Where it connects</strong> — Chapter 3 studies the interconnection between components; Chapter 21 studies multicore. An MCM is one physical way to build either.</li>
</ul>
<p class="meo">💡 Remember the two levels by who they join: <strong>first level = silicon to substrate (inside the package); second level = package to board (outside).</strong> The figure labels exactly those two arrows and nothing else — so that is what an exam can ask.</p>
<p class="pitfall">⚠️ A multichip module is <strong>not</strong> the same thing as a multicore processor. Multicore = many cores on <em>one</em> die. MCM = many <em>dies</em> in one package. A modern processor is often both at once, which is why the words get confused; keep "die" as the dividing line and you will not slip.</p>`,
        `<p class="y-chinh">🎯 Nếu một die không chứa nổi tất cả, hãy đặt vài <strong>chip trần</strong> cạnh nhau lên một <strong>đế mạch chung</strong> rồi bọc cả cụm vào một <strong>vỏ MCM</strong>. Hình gọi tên hai mức đi dây: <em>first level connection</em> (chip trần → đế chung) và <em>second level connection</em> (module → bo mạch in).</p>
<ul>
<li><strong>Đọc hình từ dưới lên</strong> — dải xám dưới cùng là bo mạch chủ; hộp lấm chấm nằm trên nó là vỏ MCM; bên trong, thanh trắng là đế mạch chung; trên đế có ba chip TRẦN, chưa đóng vỏ, nối bằng những sợi dây bonding cong cong. Chỉ cả module mới có chân xuống bo, từng chip thì không.</li>
<li><strong>Cốt lõi là ĐỘ DÀI DÂY.</strong> Hai chip nằm trong hai vỏ riêng trên bo thì cách nhau hàng xentimét; hai die trần trên cùng một đế thì cách nhau vài milimét. Dây ngắn hơn nghĩa là ít trễ hơn, ít điện dung phải nạp hơn, ít điện hơn, cần ít mạch đệm hơn — đúng hai hệ quả "đường đi điện ngắn lại" và "ít mối nối giữa các chip" ở slide 26.</li>
<li><strong>Nó còn cứu tỉ lệ đạt.</strong> Một die khổng lồ có rất ít cơ hội sạch khuyết tật (slide 23); bốn die nhỏ bằng một phần tư, kiểm riêng từng con rồi chỉ lắp con tốt, sẽ rẻ hơn hẳn với cùng diện tích silic. Vì thế kỹ thuật này nay có mặt khắp nơi.</li>
<li><strong>Đây chính là lời đáp hiện đại cho việc định luật Moore chậm lại</strong> — dưới cái tên <em>chiplet</em>, đóng gói kiểu MCM là cách bộ xử lý ngày nay tiếp tục lớn lên sau khi việc thu nhỏ một die đơn đã đuối: vài die CPU cộng một die I/O trong một vỏ, GPU có các chồng nhớ HBM nằm sát die tính toán, chip laptop mang luôn DRAM trong cùng gói.</li>
<li><strong>Nối đi đâu</strong> — Chương 3 nghiên cứu liên kết giữa các thành phần; Chương 21 nghiên cứu đa lõi. MCM là một cách vật lý để dựng cả hai.</li>
</ul>
<p class="meo">💡 Nhớ hai mức theo việc chúng nối ai: <strong>mức một = silic nối vào đế (bên TRONG vỏ); mức hai = vỏ nối xuống bo (bên NGOÀI).</strong> Hình chỉ ghi đúng hai mũi tên ấy và không ghi gì khác — nên đề thi cũng chỉ hỏi được đúng chỗ đó.</p>
<p class="pitfall">⚠️ Module đa chip <strong>không phải</strong> là bộ xử lý đa lõi. Đa lõi = nhiều lõi trên MỘT die. MCM = nhiều DIE trong một vỏ. Bộ xử lý hiện đại thường là cả hai cùng lúc, nên hai chữ hay bị lẫn; cứ lấy chữ "die" làm ranh giới thì không trượt.</p>`],

      [28, 'Evolution of Intel Microprocessors (1 of 4) — 1970s Processors',
        `<p class="y-chinh">🎯 The first of four data tables that carry the rest of the chapter. Learn to <em>compute</em> with them rather than memorise them: every column is a measurable quantity, and the trends you extract here are the exam answers.</p>
<table>
<tr><th></th><th>4004</th><th>8008</th><th>8080</th><th>8086</th><th>8088</th></tr>
<tr><td>Introduced</td><td>1971</td><td>1972</td><td>1974</td><td>1978</td><td>1979</td></tr>
<tr><td>Clock speeds</td><td>108 kHz</td><td>108 kHz</td><td>2 MHz</td><td>2, 8, 10 MHz</td><td>5, 8 MHz</td></tr>
<tr><td>Bus width</td><td>4 bits</td><td>8 bits</td><td>8 bits</td><td>16 bits</td><td>8 bits</td></tr>
<tr><td>Number of transistors</td><td>2,300</td><td>3,500</td><td>6,000</td><td>29,000</td><td>29,000</td></tr>
<tr><td>Feature size (µm)</td><td>10</td><td>8</td><td>6</td><td>3</td><td>6</td></tr>
<tr><td>Addressable memory</td><td>640 bytes</td><td>16 KB</td><td>64 KB</td><td>1 MB</td><td>1 MB</td></tr>
</table>
<ul>
<li><strong>What the 4004 was.</strong> 1971, 2,300 transistors — the first time a whole CPU fitted on one chip. Everything in slides 6–8 (control unit, ALU, registers, internal interconnection) stopped being a cabinet full of boards and became one piece of silicon you could hold.</li>
<li><strong>The "addressable memory" column is just 2 to the power of the address lines</strong> — 16 KB = 2<sup>14</sup>, 64 KB = 2<sup>16</sup>, 1 MB = 2<sup>20</sup>. That is why the numbers jump in such tidy steps, and it is the single most reliable calculation in this chapter.</li>
<li><strong>The 8088 is slide 2 in one row.</strong> Same 29,000 transistors and the same architecture as the 8086 — same instructions, same 1 MB of addressable memory — but an <strong>8-bit</strong> external bus instead of 16. Identical architecture, cheaper organization, half the bandwidth. IBM chose it for the first IBM PC, which is why x86 owns the desktop today.</li>
<li><strong>Feature size falls as everything else rises</strong> — 10 µm down to 3 µm in seven years. One micrometre (µm) is 1,000 nanometres, so the 4004's 10 µm is 10,000 nm, about 700× coarser than the 14 nm on slide 31.</li>
</ul>
<p class="dap-an">✅ Compute the decade's growth rate. Transistors 2,300 (1971) → 29,000 (1978) = <strong>12.6×</strong> in 7 years. log₂(12.6) = 3.66 doublings, so 7 ÷ 3.66 = <strong>one doubling every 1.91 years</strong> — again about two years, matching the chart on slide 25 and contradicting the "18 months" on slide 26. Clock over the same span: 108 kHz → 8 MHz ≈ <strong>74×</strong>, far faster than the transistor count grew, because in this era shrinking the transistor made it switch faster essentially for free.</p>
<p class="pitfall">⚠️ Three defects in this table to flag rather than copy. (1) The header reads <strong>"Feature size (m)"</strong> — the µ has been lost in the conversion, and 10 metres would be absurd; read µm. (2) The <strong>8088 is listed at 6 µm while the 8086 a year earlier is 3 µm</strong>, with identical transistor counts — the 8088 was essentially the same die with a narrower external bus, so this entry is inconsistent. (3) The <strong>8008 repeats the 4004's 108 kHz</strong>, while Intel's own historical data puts the 8008 in the 200–800 kHz range. Quote the table if the question demands it, but know it is not clean data.</p>`,
        `<p class="y-chinh">🎯 Bảng số liệu đầu tiên trong bốn bảng gánh phần còn lại của chương. Hãy học cách <em>TÍNH</em> trên chúng thay vì học thuộc: mỗi cột là một đại lượng đo được, và những xu hướng bạn rút ra ở đây chính là đáp án đề thi.</p>
<table>
<tr><th></th><th>4004</th><th>8008</th><th>8080</th><th>8086</th><th>8088</th></tr>
<tr><td>Ra mắt</td><td>1971</td><td>1972</td><td>1974</td><td>1978</td><td>1979</td></tr>
<tr><td>Xung nhịp</td><td>108 kHz</td><td>108 kHz</td><td>2 MHz</td><td>2, 8, 10 MHz</td><td>5, 8 MHz</td></tr>
<tr><td>Độ rộng bus</td><td>4 bit</td><td>8 bit</td><td>8 bit</td><td>16 bit</td><td>8 bit</td></tr>
<tr><td>Số transistor</td><td>2.300</td><td>3.500</td><td>6.000</td><td>29.000</td><td>29.000</td></tr>
<tr><td>Kích thước đặc trưng (µm)</td><td>10</td><td>8</td><td>6</td><td>3</td><td>6</td></tr>
<tr><td>Bộ nhớ đánh địa chỉ được</td><td>640 byte</td><td>16 KB</td><td>64 KB</td><td>1 MB</td><td>1 MB</td></tr>
</table>
<ul>
<li><strong>4004 là cái gì.</strong> Năm 1971, 2.300 transistor — lần đầu tiên cả một CPU nằm gọn trên một con chip. Mọi thứ ở slide 6–8 (khối điều khiển, ALU, thanh ghi, liên kết nội bộ) thôi là một tủ đầy bo mạch và trở thành một mẩu silic cầm được trên tay.</li>
<li><strong>Cột "bộ nhớ đánh địa chỉ được" chỉ là 2 mũ số đường địa chỉ</strong> — 16 KB = 2<sup>14</sup>, 64 KB = 2<sup>16</sup>, 1 MB = 2<sup>20</sup>. Vì thế các con số nhảy theo bậc gọn ghẽ như vậy, và đây là phép tính đáng tin cậy nhất của cả chương.</li>
<li><strong>Con 8088 chính là slide 2 gói trong một hàng bảng.</strong> Cùng 29.000 transistor, cùng kiến trúc với 8086 — cùng tập lệnh, cùng 1 MB bộ nhớ đánh địa chỉ được — nhưng bus ngoài chỉ <strong>8 bit</strong> thay vì 16. Kiến trúc y hệt, tổ chức rẻ hơn, băng thông còn một nửa. IBM chọn nó cho chiếc IBM PC đầu tiên, và đó là lý do x86 thống trị máy để bàn tới hôm nay.</li>
<li><strong>Kích thước đặc trưng giảm trong khi mọi thứ khác tăng</strong> — từ 10 µm xuống 3 µm trong bảy năm. Một micromét (µm) bằng 1.000 nanomét, nên 10 µm của 4004 là 10.000 nm, thô hơn con số 14 nm ở slide 31 khoảng 700 lần.</li>
</ul>
<p class="dap-an">✅ Tính nhịp tăng của thập niên này. Transistor 2.300 (1971) → 29.000 (1978) = <strong>12,6 lần</strong> trong 7 năm. log₂(12,6) = 3,66 lần gấp đôi, vậy 7 ÷ 3,66 = <strong>một lần gấp đôi mỗi 1,91 năm</strong> — lại khoảng hai năm, khớp với biểu đồ slide 25 và ngược với con số "18 tháng" ở slide 26. Xung nhịp cùng quãng đó: 108 kHz → 8 MHz ≈ <strong>74 lần</strong>, nhanh hơn hẳn đà tăng transistor, vì ở thời kỳ này thu nhỏ transistor thì nó đóng ngắt nhanh lên gần như miễn phí.</p>
<p class="pitfall">⚠️ Ba chỗ lỗi trong bảng này cần CHỈ RA chứ đừng chép lại. (1) Tiêu đề cột ghi <strong>"Feature size (m)"</strong> — ký tự µ đã rụng mất khi chuyển đổi, mà 10 MÉT thì vô lý; phải đọc là µm. (2) <strong>8088 ghi 6 µm trong khi 8086 ra trước một năm lại ghi 3 µm</strong>, cùng số transistor — 8088 về cơ bản là cùng một die với bus ngoài hẹp hơn, nên ô này mâu thuẫn. (3) <strong>8008 chép lại đúng 108 kHz của 4004</strong>, trong khi tư liệu lịch sử của chính Intel để 8008 ở mức 200–800 kHz. Cần thì cứ trích bảng, nhưng biết rằng đây không phải dữ liệu sạch.</p>`],

      [29, 'Evolution of Intel Microprocessors (2 of 4) — 1980s Processors',
        `<p class="y-chinh">🎯 The 1980s row is where two brand-new columns appear — <strong>virtual memory</strong> and <strong>cache</strong> — and both of them are whole chapters later in this course. Notice what the machine gained: not just more of the same, but new kinds of capability.</p>
<table>
<tr><th></th><th>80286</th><th>386 DX</th><th>386 SX</th><th>486 DX CPU</th></tr>
<tr><td>Introduced</td><td>1982</td><td>1985</td><td>1988</td><td>1989</td></tr>
<tr><td>Clock speeds</td><td>6–12.5 MHz</td><td>16–33 MHz</td><td>16–33 MHz</td><td>25–50 MHz</td></tr>
<tr><td>Bus width</td><td>16 bits</td><td>32 bits</td><td>16 bits</td><td>32 bits</td></tr>
<tr><td>Number of transistors</td><td>134,000</td><td>275,000</td><td>275,000</td><td>1.2 million</td></tr>
<tr><td>Feature size (µm)</td><td>1.5</td><td>1</td><td>1</td><td>0.8–1</td></tr>
<tr><td>Addressable memory</td><td>16 MB</td><td>4 GB</td><td>16 MB</td><td>4 GB</td></tr>
<tr><td>Virtual memory</td><td>1 GB</td><td>64 TB</td><td>64 TB</td><td>64 TB</td></tr>
<tr><td>Cache</td><td>–</td><td>–</td><td>–</td><td>8 kB</td></tr>
</table>
<ul>
<li><strong>Check the powers of two and the table explains itself.</strong> 16 MB = 2<sup>24</sup> (24 address lines), 4 GB = 2<sup>32</sup> (the 386 is Intel's first 32-bit chip), 1 GB virtual = 2<sup>30</sup>, and 64 TB virtual = 2<sup>46</sup> bytes — the 386's segmented virtual address is 46 bits wide. Nothing here is arbitrary.</li>
<li><strong>Physical versus virtual, in one line.</strong> <em>Addressable memory</em> is how much real RAM the chip can wire up; <em>virtual memory</em> is how large an address space a program may pretend to have, with the operating system paging pieces in and out. The 386 offers 4 GB real and 64 TB virtual at the same time — that is not a contradiction, it is the whole point. Chapter 9 (OS Support) builds this machinery.</li>
<li><strong>The 386 SX is the 8088 trick repeated.</strong> Same 275,000 transistors and the same 32-bit architecture as the DX, but a 16-bit external bus and only 24 address lines, hence 16 MB instead of 4 GB of physical memory. Same architecture, cheaper organization, lower price — slide 2 again, five years later.</li>
<li><strong>The 486 puts cache on the processor die for the first time — 8 kB.</strong> That single entry is the seed of Chapters 4 and 5. It appeared because the clock had reached 50 MHz while DRAM had not got much faster; the gap had to be bridged with something small and close.</li>
<li><strong>Feature size crosses 1 µm</strong> — from 1.5 µm to 0.8 µm. Below this line the industry would soon stop writing micrometres and switch to nanometres, which is exactly what happens in the table on slide 31.</li>
</ul>
<p class="dap-an">✅ Growth across the decade: transistors 134,000 (1982) → 1.2 million (1989) = <strong>8.96×</strong> in 7 years. log₂(8.96) = 3.16 doublings, so <strong>one doubling every 2.21 years</strong>. Clock 6 MHz → 50 MHz = <strong>8.3×</strong>. Notice the two rates are now almost equal, unlike the 1970s where the clock ran far ahead — the free speed from shrinking was starting to run out.</p>
<p class="pitfall">⚠️ Exam trap: being asked for "the amount of memory the 80286 can use" and answering 1 GB. The 1 GB is <strong>virtual</strong>; the physical maximum is 16 MB (24 address lines). Read the row label before you read the number — these two rows are deliberately adjacent and the numbers deliberately differ.</p>`,
        `<p class="y-chinh">🎯 Hàng thập niên 1980 là chỗ xuất hiện hai cột hoàn toàn mới — <strong>bộ nhớ ảo</strong> và <strong>cache</strong> — và cả hai đều là những chương riêng ở phần sau môn học. Để ý xem cỗ máy được thêm gì: không chỉ nhiều hơn về lượng, mà là những NĂNG LỰC mới.</p>
<table>
<tr><th></th><th>80286</th><th>386 DX</th><th>386 SX</th><th>486 DX CPU</th></tr>
<tr><td>Ra mắt</td><td>1982</td><td>1985</td><td>1988</td><td>1989</td></tr>
<tr><td>Xung nhịp</td><td>6–12,5 MHz</td><td>16–33 MHz</td><td>16–33 MHz</td><td>25–50 MHz</td></tr>
<tr><td>Độ rộng bus</td><td>16 bit</td><td>32 bit</td><td>16 bit</td><td>32 bit</td></tr>
<tr><td>Số transistor</td><td>134.000</td><td>275.000</td><td>275.000</td><td>1,2 triệu</td></tr>
<tr><td>Kích thước đặc trưng (µm)</td><td>1,5</td><td>1</td><td>1</td><td>0,8–1</td></tr>
<tr><td>Bộ nhớ đánh địa chỉ được</td><td>16 MB</td><td>4 GB</td><td>16 MB</td><td>4 GB</td></tr>
<tr><td>Bộ nhớ ảo</td><td>1 GB</td><td>64 TB</td><td>64 TB</td><td>64 TB</td></tr>
<tr><td>Cache</td><td>–</td><td>–</td><td>–</td><td>8 kB</td></tr>
</table>
<ul>
<li><strong>Kiểm lại luỹ thừa của 2 là bảng tự giải thích chính nó.</strong> 16 MB = 2<sup>24</sup> (24 đường địa chỉ), 4 GB = 2<sup>32</sup> (386 là con 32 bit đầu tiên của Intel), 1 GB ảo = 2<sup>30</sup>, và 64 TB ảo = 2<sup>46</sup> byte — địa chỉ ảo phân đoạn của 386 rộng 46 bit. Không con số nào ở đây là tuỳ tiện.</li>
<li><strong>Vật lý và ảo, gói trong một dòng.</strong> <em>Bộ nhớ đánh địa chỉ được</em> là lượng RAM thật chip có thể đấu dây tới; <em>bộ nhớ ảo</em> là không gian địa chỉ mà chương trình được phép TƯỞNG là mình có, còn hệ điều hành thì tráo từng mảnh ra vào. Con 386 cho 4 GB thật và 64 TB ảo cùng lúc — đó không phải mâu thuẫn, đó chính là mục đích. Chương 9 (Hỗ trợ của hệ điều hành) dựng đúng bộ máy này.</li>
<li><strong>386 SX là chiêu của 8088 diễn lại.</strong> Cùng 275.000 transistor và cùng kiến trúc 32 bit với bản DX, nhưng bus ngoài 16 bit và chỉ 24 đường địa chỉ, nên có 16 MB thay vì 4 GB bộ nhớ thật. Cùng kiến trúc, tổ chức rẻ hơn, giá thấp hơn — lại là slide 2, năm năm sau.</li>
<li><strong>486 lần đầu đặt cache ngay trên die của bộ xử lý — 8 kB.</strong> Đúng một ô bảng ấy là mầm của Chương 4 và Chương 5. Nó xuất hiện vì xung nhịp đã tới 50 MHz trong khi DRAM chẳng nhanh lên bao nhiêu; khoảng cách đó buộc phải được bắc cầu bằng một thứ nhỏ và đặt thật gần.</li>
<li><strong>Kích thước đặc trưng vượt mốc 1 µm</strong> — từ 1,5 µm xuống 0,8 µm. Dưới mốc này ngành sẽ sớm thôi viết micromét mà chuyển sang nanomét, đúng như bảng ở slide 31.</li>
</ul>
<p class="dap-an">✅ Đà tăng cả thập niên: transistor 134.000 (1982) → 1,2 triệu (1989) = <strong>8,96 lần</strong> trong 7 năm. log₂(8,96) = 3,16 lần gấp đôi, tức <strong>một lần gấp đôi mỗi 2,21 năm</strong>. Xung nhịp 6 MHz → 50 MHz = <strong>8,3 lần</strong>. Để ý hai nhịp giờ đã gần bằng nhau, khác hẳn thập niên 1970 khi xung nhịp chạy trước rất xa — phần tốc độ "cho không" nhờ thu nhỏ đã bắt đầu cạn.</p>
<p class="pitfall">⚠️ Bẫy đề thi: hỏi "80286 dùng được bao nhiêu bộ nhớ" và bị trả lời 1 GB. Con 1 GB là bộ nhớ <strong>ẢO</strong>; mức vật lý tối đa là 16 MB (24 đường địa chỉ). Đọc nhãn HÀNG trước khi đọc con số — hai hàng này được đặt cạnh nhau có chủ ý và các con số khác nhau cũng có chủ ý.</p>`],

      [30, 'Evolution of Intel Microprocessors (3 of 4) — 1990s Processors',
        `<p class="y-chinh">🎯 The 1990s row is the decade of the <strong>cache explosion</strong>. Transistor counts grow steadily, but the cache column grows far faster — from 8 kB to megabytes, and from one level to two. That is the memory wall being papered over in real time.</p>
<table>
<tr><th></th><th>486 SX</th><th>Pentium</th><th>Pentium Pro</th><th>Pentium II</th></tr>
<tr><td>Introduced</td><td>1991</td><td>1993</td><td>1995</td><td>1997</td></tr>
<tr><td>Clock speeds</td><td>16–33 MHz</td><td>60–166 MHz</td><td>150–200 MHz</td><td>200–300 MHz</td></tr>
<tr><td>Bus width</td><td>32 bits</td><td>32 bits</td><td>64 bits</td><td>64 bits</td></tr>
<tr><td>Number of transistors</td><td>1.185 million</td><td>3.1 million</td><td>5.5 million</td><td>7.5 million</td></tr>
<tr><td>Feature size (µm)</td><td>1</td><td>0.8</td><td>0.6</td><td>0.35</td></tr>
<tr><td>Addressable memory</td><td>4 GB</td><td>4 GB</td><td>64 GB</td><td>64 GB</td></tr>
<tr><td>Virtual memory</td><td>64 TB</td><td>64 TB</td><td>64 TB</td><td>64 TB</td></tr>
<tr><td>Cache</td><td>8 kB</td><td>8 kB</td><td>512 kB L1 and 1 MB L2</td><td>512 kB L2</td></tr>
</table>
<ul>
<li><strong>The bus goes to 64 bits before the architecture does.</strong> The Pentium Pro has a 64-bit bus but is still a 32-bit processor (4 GB → 64 GB addressable via 36 address lines, 2<sup>36</sup> = 64 GB). Data bus width and address width are different things, and this row proves it. Chapter 3 separates the address bus, the data bus and the control bus for exactly this reason.</li>
<li><strong>Cache goes multi-level.</strong> Slide 10 already defined the idea — L1 closest to the core, L2 and L3 progressively farther. Here you watch it appear in a product: one 8 kB cache in 1991, a two-level hierarchy by 1995. Chapter 5 spends a whole chapter on how the levels cooperate.</li>
<li><strong>Why cache had to grow this fast — the memory wall.</strong> Clock over these six years: 16 MHz → 300 MHz, a factor of <strong>18.75×</strong>. DRAM access latency over the same six years improved by well under 2×. Every doubling of clock speed makes a main-memory access cost twice as many wasted cycles, so the only way forward was to make sure most accesses never reach main memory at all. That is the entire justification for Chapters 4 and 5.</li>
<li><strong>Feature size 1 µm → 0.35 µm</strong>, a 2.9× linear shrink, which is an 8.2× reduction in area per transistor — and that is precisely where the room for those extra caches came from.</li>
</ul>
<p class="dap-an">✅ Transistors 1.185 million (1991) → 7.5 million (1997) = <strong>6.33×</strong> in 6 years. log₂(6.33) = 2.66 doublings, so <strong>one doubling every 2.25 years</strong> — the third independent confirmation, after slides 25 and 28, that the real rate is about two years and not 18 months.</p>
<p class="pitfall">⚠️ The Pentium Pro entry, <strong>"512 kB L1 and 1 MB L2", cannot be right.</strong> The Pentium Pro had an L1 of 8 kB for instructions plus 8 kB for data (16 kB total); 256 kB, 512 kB or 1 MB was the <em>L2</em>, carried on a second die in the same package (a multichip module — slide 27!). A 512 kB L1 on a 5.5-million-transistor chip is arithmetically impossible: SRAM needs roughly six transistors per bit, so 512 kB would alone require about 25 million transistors. Flag it as a table error; do not reproduce it as fact.</p>`,
        `<p class="y-chinh">🎯 Hàng thập niên 1990 là thập niên <strong>cache bùng nổ</strong>. Số transistor tăng đều, nhưng cột cache tăng nhanh hơn hẳn — từ 8 kB lên hàng megabyte, và từ một cấp lên hai cấp. Đó là bức tường bộ nhớ đang được trám lại ngay trước mắt.</p>
<table>
<tr><th></th><th>486 SX</th><th>Pentium</th><th>Pentium Pro</th><th>Pentium II</th></tr>
<tr><td>Ra mắt</td><td>1991</td><td>1993</td><td>1995</td><td>1997</td></tr>
<tr><td>Xung nhịp</td><td>16–33 MHz</td><td>60–166 MHz</td><td>150–200 MHz</td><td>200–300 MHz</td></tr>
<tr><td>Độ rộng bus</td><td>32 bit</td><td>32 bit</td><td>64 bit</td><td>64 bit</td></tr>
<tr><td>Số transistor</td><td>1,185 triệu</td><td>3,1 triệu</td><td>5,5 triệu</td><td>7,5 triệu</td></tr>
<tr><td>Kích thước đặc trưng (µm)</td><td>1</td><td>0,8</td><td>0,6</td><td>0,35</td></tr>
<tr><td>Bộ nhớ đánh địa chỉ được</td><td>4 GB</td><td>4 GB</td><td>64 GB</td><td>64 GB</td></tr>
<tr><td>Bộ nhớ ảo</td><td>64 TB</td><td>64 TB</td><td>64 TB</td><td>64 TB</td></tr>
<tr><td>Cache</td><td>8 kB</td><td>8 kB</td><td>512 kB L1 và 1 MB L2</td><td>512 kB L2</td></tr>
</table>
<ul>
<li><strong>Bus lên 64 bit TRƯỚC khi kiến trúc lên 64 bit.</strong> Pentium Pro có bus 64 bit nhưng vẫn là bộ xử lý 32 bit (4 GB → 64 GB nhờ 36 đường địa chỉ, 2<sup>36</sup> = 64 GB). Độ rộng bus DỮ LIỆU và độ rộng ĐỊA CHỈ là hai thứ khác nhau, và hàng này chứng minh điều đó. Chương 3 tách riêng bus địa chỉ, bus dữ liệu và bus điều khiển đúng vì lý do ấy.</li>
<li><strong>Cache chuyển sang nhiều cấp.</strong> Slide 10 đã định nghĩa ý này — L1 gần lõi nhất, rồi L2, L3 xa dần. Ở đây bạn thấy nó hiện ra trong một sản phẩm thật: một cache 8 kB năm 1991, tới 1995 đã thành hệ hai cấp. Chương 5 dành trọn một chương cho việc các cấp phối hợp với nhau ra sao.</li>
<li><strong>Vì sao cache buộc phải lớn nhanh như vậy — bức tường bộ nhớ.</strong> Xung nhịp trong sáu năm đó: 16 MHz → 300 MHz, hệ số <strong>18,75 lần</strong>. Trong khi độ trễ truy cập DRAM cùng sáu năm ấy cải thiện chưa tới 2 lần. Mỗi lần xung nhịp gấp đôi thì một lần chạm vào bộ nhớ chính lại tốn gấp đôi số chu kỳ chờ vô ích, nên lối thoát duy nhất là làm sao phần lớn lần truy cập KHÔNG bao giờ phải xuống tới bộ nhớ chính. Đó là toàn bộ lý do tồn tại của Chương 4 và Chương 5.</li>
<li><strong>Kích thước đặc trưng 1 µm → 0,35 µm</strong>, thu nhỏ chiều dài 2,9 lần, tức diện tích mỗi transistor giảm 8,2 lần — và chỗ trống cho đống cache mới kia đến chính từ đó.</li>
</ul>
<p class="dap-an">✅ Transistor 1,185 triệu (1991) → 7,5 triệu (1997) = <strong>6,33 lần</strong> trong 6 năm. log₂(6,33) = 2,66 lần gấp đôi, tức <strong>một lần gấp đôi mỗi 2,25 năm</strong> — lần xác nhận độc lập thứ ba, sau slide 25 và slide 28, rằng nhịp thật là khoảng hai năm chứ không phải 18 tháng.</p>
<p class="pitfall">⚠️ Ô của Pentium Pro, <strong>"512 kB L1 và 1 MB L2", không thể đúng.</strong> Pentium Pro có L1 gồm 8 kB lệnh + 8 kB dữ liệu (tổng 16 kB); còn 256 kB, 512 kB hay 1 MB là <em>L2</em>, nằm trên một die thứ hai trong cùng vỏ (đúng là một module đa chip — slide 27!). L1 512 kB trên con chip 5,5 triệu transistor là bất khả thi về số học: SRAM cần chừng sáu transistor cho mỗi bit, nên riêng 512 kB đã đòi khoảng 25 triệu transistor. Hãy chỉ ra đây là lỗi bảng; đừng chép lại như sự thật.</p>`],

      [31, 'Evolution of Intel Microprocessors (4 of 4) — Recent Processors',
        `<p class="y-chinh">🎯 The most important table in Chapter 1. Two columns change the story of computing: the <strong>clock speed stops rising</strong> around 2000, and a brand-new bottom row appears — <strong>number of cores</strong>. Everything in Chapters 18, 20 and 21 exists because of what this table shows.</p>
<table>
<tr><th></th><th>Pentium III</th><th>Pentium 4</th><th>Core 2 Duo</th><th>Core i7 EE 4960X</th><th>Core i9-7900X</th></tr>
<tr><td>Introduced</td><td>1999</td><td>2000</td><td>2006</td><td>2013</td><td>2017</td></tr>
<tr><td>Clock speeds</td><td>450–660 MHz</td><td>1.3–1.8 GHz</td><td>1.06–1.2 GHz</td><td>4 GHz</td><td>4.3 GHz</td></tr>
<tr><td>Bus width</td><td>64 bits</td><td>64 bits</td><td>64 bits</td><td>64 bits</td><td>64 bits</td></tr>
<tr><td>Number of transistors</td><td>9.5 million</td><td>42 million</td><td>167 million</td><td>1.86 billion</td><td>7.2 billion</td></tr>
<tr><td>Feature size (nm)</td><td>250</td><td>180</td><td>65</td><td>22</td><td>14</td></tr>
<tr><td>Addressable memory</td><td>64 GB</td><td>64 GB</td><td>64 GB</td><td>64 GB</td><td>128 GB</td></tr>
<tr><td>Virtual memory</td><td>64 TB</td><td>64 TB</td><td>64 TB</td><td>64 TB</td><td>64 TB</td></tr>
<tr><td>Cache</td><td>512 kB L2</td><td>256 kB L2</td><td>2 MB L2</td><td>1.5 MB L2 / 1.5 MB L3</td><td>14 MB L3</td></tr>
<tr><td><strong>Number of cores</strong></td><td>1</td><td>1</td><td>2</td><td>6</td><td>10</td></tr>
</table>
<ul>
<li><strong>Look at the clock row and find the impossible entry.</strong> The Pentium 4 reached 1.8 GHz in 2000; the Core 2 Duo of <em>2006</em> runs at 1.06–1.2 GHz — <strong>slower</strong>, six years later. From 2000 to 2017 the clock rose only 1.8 → 4.3 GHz = <strong>2.4×</strong>, while transistors rose 42 million → 7.2 billion = <strong>171×</strong>. Something stopped the clock while nothing stopped the transistors.</li>
<li><strong>What stopped it: the power wall.</strong> The dynamic power a CMOS chip burns is approximately <strong>P ≈ C · V<sup>2</sup> · f</strong>. <em>C</em> is the switched capacitance — every gate and wire you must charge and discharge, so it grows with the transistor count. <em>V</em> is the supply voltage, and it appears <strong>squared</strong>, which makes it the most valuable knob. <em>f</em> is the clock frequency, and power is merely linear in it. The catch: running faster requires a higher <em>V</em> to switch the transistors in time, so raising <em>f</em> drags <em>V</em> up with it and the real cost grows roughly like <em>f</em><sup>3</sup>. Add leakage, which flows whether or not anything is switching, and a die of about 1–2 cm² cannot shed more than roughly 100–150 W without exotic cooling. That ceiling is the wall.</li>
<li><strong>The answer was to spend transistors on cores, not on megahertz.</strong> Two cores at 1.2 GHz do more total work than one core at 2.4 GHz, and they cost far less power because <em>V</em> can stay low. Read the last row as the industry's decision: 1, 1, 2, 6, 10. Chapter 21 is entirely about the consequences, and Chapter 20 about how to program them.</li>
<li><strong>The memory wall, measured across all four tables.</strong> Clock went from 108 kHz on the 4004 to 4.3 GHz here — about <strong>40,000×</strong>. DRAM access latency in the same period improved by only about 5–10×. The processor therefore waits thousands of times longer, in clock cycles, for a memory word than it used to. Watch the cache column absorb the blow: 8 kB on the 486 to <strong>14 MB of L3</strong> here, a factor of 1,792. This is why Chapter 4 (memory hierarchy, locality) and Chapter 5 (cache) sit right after the basics rather than at the end.</li>
<li><strong>Feature size crosses into nanometres</strong> — the header unit changed from µm to nm between slide 30 and this slide. 250 nm → 14 nm is a <strong>17.9×</strong> linear shrink, so <strong>319×</strong> less area per transistor over 18 years.</li>
</ul>
<p class="dap-an">✅ The two rates, computed. Transistors 9.5 million (1999) → 7.2 billion (2017) = <strong>758×</strong>; log₂(758) = 9.57 doublings over 18 years = <strong>one doubling every 1.88 years</strong>. Clock over the same 18 years: 450 MHz → 4.3 GHz = only <strong>9.6×</strong>, i.e. about one doubling every 5.5 years. <em>Transistors kept obeying Moore; speed did not.</em> The gap between 758× and 9.6× is the single most important number pair in Chapter 1, and it is the reason the rest of the course is about parallelism and caching rather than about faster clocks.</p>
<p class="pitfall">⚠️ Two things this table will mislead you about if you are not careful. (1) <strong>Modern "feature sizes" are marketing names, not measurements.</strong> Up to roughly the 22 nm row, the number still tracked a real physical dimension. Since then it does not: on a chip sold as "3 nm" or "2 nm", <em>no feature is 3 or 2 nm wide</em> — the labels are process-generation brand names, and different foundries' "5 nm" differ substantially. Never compute atom counts or densities from a modern node name. (2) The <strong>128 GB</strong> for the i9 is a platform/memory-controller limit, not an address-line count like the 1970s rows — x86-64 chips of that era implement 46-bit physical and 48-bit virtual addressing. The meaning of that column quietly changed between the first table and this one.</p>`,
        `<p class="y-chinh">🎯 Bảng quan trọng nhất của Chương 1. Hai cột ở đây đổi hẳn câu chuyện của ngành máy tính: <strong>xung nhịp NGỪNG tăng</strong> quanh năm 2000, và một hàng hoàn toàn mới xuất hiện — <strong>số lõi</strong>. Mọi thứ trong Chương 18, 20 và 21 tồn tại vì đúng điều bảng này cho thấy.</p>
<table>
<tr><th></th><th>Pentium III</th><th>Pentium 4</th><th>Core 2 Duo</th><th>Core i7 EE 4960X</th><th>Core i9-7900X</th></tr>
<tr><td>Ra mắt</td><td>1999</td><td>2000</td><td>2006</td><td>2013</td><td>2017</td></tr>
<tr><td>Xung nhịp</td><td>450–660 MHz</td><td>1,3–1,8 GHz</td><td>1,06–1,2 GHz</td><td>4 GHz</td><td>4,3 GHz</td></tr>
<tr><td>Độ rộng bus</td><td>64 bit</td><td>64 bit</td><td>64 bit</td><td>64 bit</td><td>64 bit</td></tr>
<tr><td>Số transistor</td><td>9,5 triệu</td><td>42 triệu</td><td>167 triệu</td><td>1,86 tỉ</td><td>7,2 tỉ</td></tr>
<tr><td>Kích thước đặc trưng (nm)</td><td>250</td><td>180</td><td>65</td><td>22</td><td>14</td></tr>
<tr><td>Bộ nhớ đánh địa chỉ được</td><td>64 GB</td><td>64 GB</td><td>64 GB</td><td>64 GB</td><td>128 GB</td></tr>
<tr><td>Bộ nhớ ảo</td><td>64 TB</td><td>64 TB</td><td>64 TB</td><td>64 TB</td><td>64 TB</td></tr>
<tr><td>Cache</td><td>512 kB L2</td><td>256 kB L2</td><td>2 MB L2</td><td>1,5 MB L2 / 1,5 MB L3</td><td>14 MB L3</td></tr>
<tr><td><strong>Số lõi</strong></td><td>1</td><td>1</td><td>2</td><td>6</td><td>10</td></tr>
</table>
<ul>
<li><strong>Nhìn hàng xung nhịp và tìm ô "vô lý".</strong> Pentium 4 đạt 1,8 GHz năm 2000; Core 2 Duo năm <em>2006</em> chạy 1,06–1,2 GHz — <strong>CHẬM HƠN</strong>, sáu năm sau. Từ 2000 tới 2017 xung nhịp chỉ đi từ 1,8 lên 4,3 GHz = <strong>2,4 lần</strong>, trong khi transistor đi từ 42 triệu lên 7,2 tỉ = <strong>171 lần</strong>. Có thứ gì đó chặn xung nhịp lại mà không chặn transistor.</li>
<li><strong>Thứ chặn nó lại: TƯỜNG CÔNG SUẤT.</strong> Công suất động của một chip CMOS xấp xỉ <strong>P ≈ C · V<sup>2</sup> · f</strong>. <em>C</em> là điện dung phải đóng ngắt — mỗi cổng, mỗi sợi dây bạn phải nạp rồi xả, nên nó tăng theo số transistor. <em>V</em> là điện áp nguồn, và nó nằm ở <strong>bậc hai</strong>, nên đây là cái núm vặn đáng giá nhất. <em>f</em> là tần số xung nhịp, và công suất chỉ tỉ lệ BẬC NHẤT với nó. Cái bẫy nằm ở chỗ: muốn chạy nhanh hơn thì phải nâng <em>V</em> để transistor kịp đóng ngắt, nên nâng <em>f</em> kéo <em>V</em> lên theo và cái giá thật tăng cỡ <em>f</em><sup>3</sup>. Cộng thêm dòng rò, thứ chảy bất kể có đóng ngắt hay không, thì một miếng die chừng 1–2 cm² không thải nổi quá khoảng 100–150 W nếu không dùng cách làm mát đặc biệt. Cái trần đó chính là bức tường.</li>
<li><strong>Lời đáp là đổ transistor vào SỐ LÕI, không đổ vào megahertz.</strong> Hai lõi chạy 1,2 GHz làm được nhiều việc hơn một lõi 2,4 GHz, mà tốn ít điện hơn hẳn vì <em>V</em> được giữ thấp. Hãy đọc hàng cuối như một quyết định của cả ngành: 1, 1, 2, 6, 10. Chương 21 nói trọn về hệ quả, còn Chương 20 nói về cách lập trình cho chúng.</li>
<li><strong>Bức tường bộ nhớ, đo trên cả bốn bảng.</strong> Xung nhịp đi từ 108 kHz của 4004 lên 4,3 GHz ở đây — khoảng <strong>40.000 lần</strong>. Độ trễ truy cập DRAM cùng quãng đó chỉ cải thiện chừng 5–10 lần. Nghĩa là tính theo chu kỳ đồng hồ, bộ xử lý phải chờ một từ nhớ lâu gấp hàng nghìn lần so với ngày xưa. Hãy xem cột cache hứng đòn: từ 8 kB trên con 486 lên <strong>14 MB L3</strong> ở đây, gấp 1.792 lần. Đó là lý do Chương 4 (phân cấp bộ nhớ, tính cục bộ) và Chương 5 (cache) nằm ngay sau phần nhập môn chứ không nằm cuối sách.</li>
<li><strong>Kích thước đặc trưng bước sang nanomét</strong> — đơn vị ở tiêu đề cột đã đổi từ µm sang nm giữa slide 30 và slide này. 250 nm → 14 nm là thu nhỏ chiều dài <strong>17,9 lần</strong>, tức diện tích mỗi transistor giảm <strong>319 lần</strong> trong 18 năm.</li>
</ul>
<p class="dap-an">✅ Tính ra hai nhịp. Transistor 9,5 triệu (1999) → 7,2 tỉ (2017) = <strong>758 lần</strong>; log₂(758) = 9,57 lần gấp đôi trong 18 năm = <strong>một lần gấp đôi mỗi 1,88 năm</strong>. Xung nhịp cũng 18 năm ấy: 450 MHz → 4,3 GHz = chỉ <strong>9,6 lần</strong>, tức chừng 5,5 năm mới gấp đôi một lần. <em>Transistor vẫn theo Moore; tốc độ thì không.</em> Khoảng cách giữa 758 lần và 9,6 lần là cặp số quan trọng nhất của Chương 1, và nó là lý do phần còn lại của môn học nói về SONG SONG và CACHE chứ không nói về xung nhịp cao hơn.</p>
<p class="pitfall">⚠️ Hai chỗ bảng này sẽ làm bạn hiểu sai nếu không cẩn thận. (1) <strong>"Kích thước đặc trưng" thời nay là TÊN THƯƠNG MẠI, không phải số đo.</strong> Tới quãng hàng 22 nm, con số vẫn còn bám một kích thước vật lý thật. Từ đó trở đi thì không: trên con chip bán dưới tên "3 nm" hay "2 nm", <em>không có chi tiết nào rộng 3 hay 2 nm cả</em> — đó là nhãn hiệu thế hệ công nghệ, và "5 nm" của các xưởng đúc khác nhau lệch nhau đáng kể. Đừng bao giờ đem tên tiến trình hiện đại ra tính số nguyên tử hay mật độ. (2) Con <strong>128 GB</strong> của i9 là giới hạn của nền tảng/bộ điều khiển nhớ, không phải số đường địa chỉ như các hàng thập niên 1970 — chip x86-64 thời đó hiện thực địa chỉ vật lý 46 bit và địa chỉ ảo 48 bit. Ý nghĩa của cột này đã âm thầm đổi giữa bảng đầu và bảng này.</p>`],

      [32, 'Highlights of the Evolution of the Intel Product Line (1 of 2) — 8080 to 80486',
        `<p class="y-chinh">🎯 The same five chips as slide 28–29, but told as milestones instead of numbers. Each box names the <em>first</em> time something appeared, and almost every one of those firsts is a later chapter of this book.</p>
<table>
<tr><th>Chip</th><th>What the slide says</th><th>Where it leads in CEA201</th></tr>
<tr><td>8080</td><td>World's first <strong>general-purpose</strong> microprocessor; 8-bit machine, 8-bit data path to memory; used in the first personal computer (Altair)</td><td>Ch.3 — data path width and the system bus</td></tr>
<tr><td>8086</td><td>A more powerful 16-bit machine; has an <strong>instruction cache, or queue, that prefetches a few instructions before they are executed</strong>; the first appearance of the x86 architecture; the 8088 was a variant used in IBM's first personal computer</td><td>Ch.16 — pipelining starts exactly here</td></tr>
<tr><td>80286</td><td>Extension of the 8086 enabling addressing of 16 MB of memory instead of just 1 MB</td><td>Ch.14 — addressing; Ch.9 — protected mode</td></tr>
<tr><td>80386</td><td>Intel's first <strong>32-bit</strong> machine; first Intel processor to support <strong>multitasking</strong></td><td>Ch.9 — OS support, paging, protection</td></tr>
<tr><td>80486</td><td>Introduced much more sophisticated and powerful <strong>cache</strong> technology and sophisticated <strong>instruction pipelining</strong>; also offered a built-in math coprocessor</td><td>Ch.5 — cache; Ch.16 — pipeline</td></tr>
</table>
<ul>
<li><strong>Read "first general-purpose" carefully.</strong> The 4004 (1971) was the first microprocessor, but it was built for a calculator. The 8080 (1974) is the first <em>general-purpose</em> one. An exam that asks "the first microprocessor" wants 4004; one that quotes the phrase "general-purpose" wants 8080. The difference is one adjective and a whole mark.</li>
<li><strong>The 8086's prefetch queue is the most under-rated line on this slide.</strong> Fetching the next instructions while the current one executes is the germ of the pipeline (Chapter 16), and once you have a pipeline you can start thinking about issuing several instructions at once (Chapter 18, superscalar). A 1978 feature opens two chapters of the course.</li>
<li><strong>The 486's built-in math coprocessor is an architecture change, not just an organization change.</strong> Before it, floating-point work needed a separate 8087/80287/80387 chip; folding it in removed an interchip connection (slide 26's fifth consequence) and made floating-point instructions something every program could simply assume. Chapter 11 does the arithmetic itself.</li>
<li><strong>Context the slide does not give.</strong> This microprocessor story runs in parallel with the minicomputer and mainframe stories — DEC's PDP-8 (1965) made computing cheap enough for a laboratory, and IBM's System/360 (1964) invented the compatible family that slide 3 described. The 9th-edition syllabus covers them in its Chapter 2; the 11th-edition slides do not, so read them in the book rather than hunting for a missing slide.</li>
</ul>
<p class="pitfall">⚠️ This slide has a genuine defect: the <strong>8086 box overflows and is cut off</strong> at "(securing the success of Intel" — no closing bracket, no end of sentence. The book's sentence continues to say that IBM's choice secured Intel's success as the supplier of CPUs for personal computers. Note it, do not quote a truncated sentence back in an exam.</p>`,
        `<p class="y-chinh">🎯 Vẫn năm con chip của slide 28–29, nhưng kể bằng CỘT MỐC thay vì bằng con số. Mỗi hộp nêu <em>lần đầu tiên</em> một thứ xuất hiện, và gần như mỗi cái "lần đầu" ấy là một chương phía sau của cuốn sách.</p>
<table>
<tr><th>Chip</th><th>Slide nói gì</th><th>Dẫn tới đâu trong CEA201</th></tr>
<tr><td>8080</td><td>Vi xử lý <strong>đa dụng</strong> đầu tiên thế giới; máy 8 bit, đường dữ liệu 8 bit tới bộ nhớ; dùng trong máy tính cá nhân đầu tiên (Altair)</td><td>Ch.3 — độ rộng đường dữ liệu và bus hệ thống</td></tr>
<tr><td>8086</td><td>Máy 16 bit mạnh hơn; có <strong>cache lệnh, hay hàng đợi, nạp trước vài lệnh trước khi chúng được thi hành</strong>; lần đầu kiến trúc x86 xuất hiện; 8088 là biến thể dùng trong máy tính cá nhân đầu tiên của IBM</td><td>Ch.16 — đường ống lệnh bắt đầu đúng từ đây</td></tr>
<tr><td>80286</td><td>Mở rộng từ 8086, cho phép đánh địa chỉ 16 MB bộ nhớ thay vì chỉ 1 MB</td><td>Ch.14 — chế độ địa chỉ; Ch.9 — chế độ bảo vệ</td></tr>
<tr><td>80386</td><td>Máy <strong>32 bit</strong> đầu tiên của Intel; bộ xử lý Intel đầu tiên hỗ trợ <strong>đa nhiệm</strong></td><td>Ch.9 — hỗ trợ HĐH, phân trang, bảo vệ</td></tr>
<tr><td>80486</td><td>Đưa vào công nghệ <strong>cache</strong> tinh vi và mạnh hơn nhiều cùng <strong>đường ống lệnh</strong> tinh vi; ngoài ra có sẵn bộ đồng xử lý toán học tích hợp</td><td>Ch.5 — cache; Ch.16 — đường ống</td></tr>
</table>
<ul>
<li><strong>Đọc kỹ chữ "đa dụng đầu tiên".</strong> Con 4004 (1971) là vi xử lý đầu tiên, nhưng nó được làm cho máy tính bỏ túi. Con 8080 (1974) mới là con <em>đa dụng</em> đầu tiên. Đề hỏi "vi xử lý đầu tiên" thì muốn 4004; đề trích đúng cụm "general-purpose" thì muốn 8080. Khác nhau một tính từ và trọn một điểm.</li>
<li><strong>Hàng đợi nạp trước của 8086 là dòng bị đánh giá thấp nhất trên slide này.</strong> Việc nạp lệnh kế tiếp trong khi lệnh hiện tại đang chạy chính là mầm của đường ống lệnh (Chương 16), và khi đã có đường ống thì mới nghĩ được tới chuyện phát nhiều lệnh cùng lúc (Chương 18, superscalar). Một tính năng của năm 1978 mở ra hai chương của môn học.</li>
<li><strong>Bộ đồng xử lý toán tích hợp của 486 là thay đổi KIẾN TRÚC, không chỉ là thay đổi tổ chức.</strong> Trước đó, tính dấu chấm động cần một con chip 8087/80287/80387 riêng; gộp nó vào giúp bớt một mối nối liên chip (hệ quả thứ năm ở slide 26) và làm cho mọi chương trình đều được quyền mặc định là có lệnh dấu chấm động. Chương 11 lo phần số học bên trong.</li>
<li><strong>Bối cảnh slide không nói.</strong> Câu chuyện vi xử lý này chạy song song với câu chuyện máy mini và máy lớn — PDP-8 của DEC (1965) làm cho máy tính rẻ tới mức một phòng thí nghiệm mua nổi, còn System/360 của IBM (1964) phát minh ra khái niệm họ máy tương thích mà slide 3 đã kể. Syllabus theo bản 9th ed có hai thứ đó ở Chương 2 của nó; bộ slide 11th ed thì không, nên hãy đọc trong SÁCH thay vì đi tìm một slide không tồn tại.</li>
</ul>
<p class="pitfall">⚠️ Slide này có một lỗi thật: <strong>hộp 8086 bị TRÀN CHỮ và cụt</strong> ở "(securing the success of Intel" — không có dấu đóng ngoặc, không có phần cuối câu. Câu trong sách nói tiếp rằng lựa chọn của IBM đã bảo đảm thành công của Intel với vai trò nhà cung cấp CPU cho máy tính cá nhân. Hãy ghi nhận điều đó, đừng chép lại một câu cụt vào bài thi.</p>`],

      [33, 'Highlights of the Evolution of the Intel Product Line (2 of 2) — Pentium to Core 2',
        `<p class="y-chinh">🎯 Seven boxes that, read in order, tell the story of <strong>three different kinds of parallelism</strong> arriving one after another: first more instructions at once, then more data per instruction, then more cores.</p>
<table>
<tr><th>Chip</th><th>What the slide says</th><th>Kind of parallelism</th></tr>
<tr><td>Pentium</td><td>Intel introduced <strong>superscalar</strong> techniques, which allow multiple instructions to execute in parallel</td><td>Instruction level (ILP) — Ch.18</td></tr>
<tr><td>Pentium Pro</td><td>Continued into superscalar organization with aggressive <strong>register renaming, branch prediction, data flow analysis, speculative execution</strong></td><td>ILP, made deeper — Ch.16, Ch.18</td></tr>
<tr><td>Pentium II</td><td>Incorporated Intel <strong>MMX</strong> technology, designed specifically to process video, audio and graphics data efficiently</td><td>Data level (SIMD) — Ch.13</td></tr>
<tr><td>Pentium III</td><td>Additional floating-point instructions; <strong>Streaming SIMD Extensions (SSE)</strong></td><td>Data level (SIMD)</td></tr>
<tr><td>Pentium 4</td><td>Additional floating-point and other enhancements for multimedia</td><td>Data level (SIMD)</td></tr>
<tr><td>Core</td><td>First Intel x86 <strong>micro-core</strong></td><td>Thread level begins — Ch.21</td></tr>
<tr><td>Core 2</td><td>Extends the Core architecture to <strong>64 bits</strong>; Core 2 Quad provides four cores on a single chip; more recent Core offerings have up to 10 cores per chip; an important addition to the architecture was the <strong>Advanced Vector Extensions (AVX)</strong> instruction set</td><td>Thread level + data level — Ch.20, Ch.21</td></tr>
</table>
<ul>
<li><strong>Why the order is not accidental.</strong> When you can no longer raise the clock (slide 31), you must get more work out of each tick. First the designers did it invisibly — superscalar, speculation, renaming — all of which are <em>organization</em> and require no change to your program. When that ran out, they added new <em>architecture</em>: MMX, SSE, AVX let one instruction operate on many data items. When that ran out too, they added cores, which requires the programmer to write parallel code. The difficulty for the programmer rises at every step.</li>
<li><strong>Notice the slide uses slide 2's vocabulary correctly.</strong> It says "an important addition to the <strong>architecture</strong> was the AVX instruction set" — and that is right: new instructions are visible to the programmer, so they are architecture. By contrast register renaming and branch prediction are invisible, so they are organization. If you can explain that distinction using this one slide, you have understood the chapter.</li>
<li><strong>Speculative execution, in one sentence</strong> — rather than waiting to learn whether a branch is taken, the processor guesses, runs ahead, and throws the work away if it guessed wrong. It is pure organization, it is why modern processors are fast, and it is also the origin of the Spectre/Meltdown class of security flaws discovered in 2018 — a rare case where "invisible to the programmer" turned out to be not quite invisible enough.</li>
<li><strong>"Core 2 Quad provides four cores on a single chip"</strong> — pair this with slide 9's careful definitions: a <em>core</em> is one processing unit, a <em>processor</em> is the physical piece of silicon containing one or more cores. A quad-core is one processor, four cores. Chapter 21 will need that vocabulary exactly.</li>
</ul>
<p class="pitfall">⚠️ The phrase <strong>"first Intel x86 micro-core"</strong> in the Core box is vague and is not a standard term; the book means the Core microarchitecture, the line from which Intel's multi-core x86 desktop parts descend. Do not memorise "micro-core" as a technical concept — there is no such thing to define. If asked when Intel's multicore era begins, answer with the table on slide 31: the first entry with 2 cores is the Core 2 Duo, 2006.</p>`,
        `<p class="y-chinh">🎯 Bảy cái hộp mà nếu đọc theo thứ tự sẽ kể đúng câu chuyện <strong>ba kiểu song song</strong> lần lượt xuất hiện: đầu tiên là nhiều LỆNH cùng lúc, rồi nhiều DỮ LIỆU trên mỗi lệnh, rồi nhiều LÕI.</p>
<table>
<tr><th>Chip</th><th>Slide nói gì</th><th>Kiểu song song</th></tr>
<tr><td>Pentium</td><td>Intel đưa vào kỹ thuật <strong>superscalar</strong>, cho phép nhiều lệnh thi hành song song</td><td>Mức lệnh (ILP) — Ch.18</td></tr>
<tr><td>Pentium Pro</td><td>Đi tiếp vào tổ chức superscalar với <strong>đổi tên thanh ghi, dự đoán rẽ nhánh, phân tích luồng dữ liệu, thi hành suy đoán</strong> ở mức mạnh tay</td><td>ILP, đào sâu hơn — Ch.16, Ch.18</td></tr>
<tr><td>Pentium II</td><td>Tích hợp công nghệ <strong>MMX</strong>, thiết kế riêng để xử lý hiệu quả dữ liệu video, âm thanh và đồ hoạ</td><td>Mức dữ liệu (SIMD) — Ch.13</td></tr>
<tr><td>Pentium III</td><td>Thêm lệnh dấu chấm động; <strong>Streaming SIMD Extensions (SSE)</strong></td><td>Mức dữ liệu (SIMD)</td></tr>
<tr><td>Pentium 4</td><td>Thêm lệnh dấu chấm động và các cải tiến khác cho đa phương tiện</td><td>Mức dữ liệu (SIMD)</td></tr>
<tr><td>Core</td><td>"Micro-core" x86 đầu tiên của Intel</td><td>Bắt đầu mức luồng — Ch.21</td></tr>
<tr><td>Core 2</td><td>Mở rộng kiến trúc Core lên <strong>64 bit</strong>; Core 2 Quad cho bốn lõi trên một chip; các đời Core gần đây có tới 10 lõi mỗi chip; một bổ sung quan trọng vào kiến trúc là tập lệnh <strong>Advanced Vector Extensions (AVX)</strong></td><td>Mức luồng + mức dữ liệu — Ch.20, Ch.21</td></tr>
</table>
<ul>
<li><strong>Vì sao thứ tự này không ngẫu nhiên.</strong> Khi không nâng được xung nhịp nữa (slide 31), người ta buộc phải vắt thêm việc ra từ mỗi nhịp. Đầu tiên các kỹ sư làm điều đó một cách VÔ HÌNH — superscalar, suy đoán, đổi tên thanh ghi — tất cả đều là <em>tổ chức</em> và không đòi chương trình của bạn sửa gì. Khi cạn đường, họ thêm <em>kiến trúc</em> mới: MMX, SSE, AVX cho phép một lệnh thao tác trên nhiều phần tử dữ liệu. Khi cái đó cũng cạn, họ thêm lõi — và cái này thì BẮT lập trình viên phải viết mã song song. Mỗi nấc, phần khó dồn về phía người lập trình nhiều hơn.</li>
<li><strong>Để ý slide dùng đúng từ vựng của slide 2.</strong> Nó viết "một bổ sung quan trọng vào <strong>KIẾN TRÚC</strong> là tập lệnh AVX" — và viết vậy là đúng: lệnh mới thì lập trình viên nhìn thấy, nên thuộc kiến trúc. Ngược lại, đổi tên thanh ghi và dự đoán rẽ nhánh thì vô hình, nên thuộc tổ chức. Giải thích được phép phân biệt ấy chỉ bằng slide này là bạn đã nắm được chương.</li>
<li><strong>Thi hành suy đoán, gói trong một câu</strong> — thay vì đứng chờ xem lệnh rẽ nhánh có nhảy hay không, bộ xử lý ĐOÁN, chạy tiếp, và vứt bỏ phần đã làm nếu đoán sai. Nó thuần tuý là tổ chức, nó là lý do bộ xử lý hiện đại nhanh, và nó cũng là gốc của lớp lỗ hổng bảo mật Spectre/Meltdown công bố năm 2018 — một trường hợp hiếm hoi khi "vô hình với lập trình viên" hoá ra chưa đủ vô hình.</li>
<li><strong>"Core 2 Quad cho bốn lõi trên một chip"</strong> — hãy ghép câu này với định nghĩa rất cẩn thận ở slide 9: <em>lõi (core)</em> là một đơn vị xử lý, <em>bộ xử lý (processor)</em> là miếng silic vật lý chứa một hoặc nhiều lõi. Con bốn lõi là MỘT bộ xử lý, BỐN lõi. Chương 21 sẽ cần đúng bộ từ vựng đó.</li>
</ul>
<p class="pitfall">⚠️ Cụm <strong>"micro-core x86 đầu tiên của Intel"</strong> trong hộp Core là mơ hồ và không phải thuật ngữ chuẩn; ý sách muốn nói tới vi kiến trúc Core, dòng khai sinh ra các bộ xử lý x86 đa lõi cho máy để bàn của Intel. Đừng học thuộc "micro-core" như một khái niệm kỹ thuật — không có định nghĩa nào cho nó cả. Nếu bị hỏi kỷ nguyên đa lõi của Intel bắt đầu khi nào, hãy trả lời bằng bảng slide 31: ô đầu tiên có 2 lõi là Core 2 Duo, năm 2006.</p>`],

      [34, 'Embedded Systems',
        `<p class="y-chinh">🎯 The chapter turns away from desktops. An <strong>embedded system</strong> is "the use of electronics and software <em>within a product</em>" — the computer is not the product, it is a component of something else, and that single fact changes every design rule.</p>
<ul>
<li><strong>The scale, in the slide's own words</strong> — "billions of computer systems are produced each year that are embedded within larger devices", and "today many devices that use electric power have an embedded computing system". Count the processors in the room you are sitting in: the ones you would call computers are a small minority.</li>
<li><strong>Tightly coupled to their environment</strong> — this is the defining phrase. A desktop program's world is files and users; an embedded program's world is a motor, a temperature, a wheel. The program must keep up with something physical that will not wait.</li>
<li><strong>Which gives rise to real-time constraints.</strong> The slide names the three sources exactly: <em>required speeds of motion</em>, <em>required precision of measurement</em>, <em>required time durations</em>. These "dictate the timing of software operations" — i.e. in an embedded system, being late is being wrong. A correct answer delivered after the airbag should have fired is a failure, not a slow success.</li>
<li><strong>And if several activities must run at once, the constraints get harder</strong> — the last bullet. Managing many deadlines simultaneously is the reason real-time operating systems and priority scheduling exist; Chapter 9 touches this ground.</li>
<li><strong>Hard versus soft real time</strong> (useful vocabulary the slide omits) — <em>hard</em>: missing the deadline is a system failure (airbag, engine ignition timing, motor commutation). <em>Soft</em>: missing it degrades quality (a dropped video frame, a stutter in audio). Designers spend money very differently on the two.</li>
<li><strong>Why it belongs in Chapter 1</strong> — it is the direct consequence of Moore's law consequence number three on slide 26: "computer becomes smaller and more convenient to use in a variety of environments". Cheap, tiny, low-power computing did not just make PCs better; it put a processor inside the washing machine.</li>
</ul>
<p class="pitfall">⚠️ Do not define embedded as "small" or "weak". A car contains dozens of processors including some quite powerful ones; a network router is an embedded system with gigabits per second of throughput. <strong>Embedded is about the ROLE</strong> — the computer serves a product whose purpose is not computing — not about size or speed.</p>`,
        `<p class="y-chinh">🎯 Chương này quay lưng lại với máy để bàn. <strong>Hệ nhúng</strong> là "việc dùng điện tử và phần mềm <em>bên trong một sản phẩm</em>" — máy tính KHÔNG phải là sản phẩm, nó là một bộ phận của thứ khác, và chỉ riêng sự thật ấy đã đổi mọi luật thiết kế.</p>
<ul>
<li><strong>Quy mô, theo đúng lời slide</strong> — "hàng tỉ hệ máy tính được sản xuất mỗi năm, nhúng bên trong các thiết bị lớn hơn", và "ngày nay nhiều thiết bị dùng điện đều có một hệ thống tính toán nhúng bên trong". Thử đếm số bộ xử lý trong căn phòng bạn đang ngồi: những thứ bạn gọi là "máy tính" chỉ là thiểu số nhỏ.</li>
<li><strong>Gắn chặt với môi trường của nó</strong> — đây là cụm từ định danh. Thế giới của một chương trình máy để bàn là tệp tin và người dùng; thế giới của một chương trình nhúng là một động cơ, một nhiệt độ, một bánh xe. Chương trình phải theo kịp một thứ vật lý không chịu đứng chờ.</li>
<li><strong>Từ đó sinh ra ràng buộc thời gian thực.</strong> Slide nêu đúng ba nguồn: <em>tốc độ chuyển động yêu cầu</em>, <em>độ chính xác đo yêu cầu</em>, <em>khoảng thời gian yêu cầu</em>. Chúng "quy định nhịp thời gian của các thao tác phần mềm" — nghĩa là trong hệ nhúng, TRỄ tức là SAI. Một đáp số đúng trả về sau khi túi khí lẽ ra phải bung là một thất bại, không phải một thành công chậm.</li>
<li><strong>Và nếu phải quản nhiều hoạt động cùng lúc thì ràng buộc còn khó hơn</strong> — gạch đầu dòng cuối. Quản nhiều hạn chót song song chính là lý do tồn tại của hệ điều hành thời gian thực và lập lịch theo độ ưu tiên; Chương 9 chạm vào mảng này.</li>
<li><strong>Thời gian thực CỨNG và MỀM</strong> (từ vựng hữu ích mà slide bỏ qua) — <em>cứng</em>: trễ hạn là hệ thống hỏng (túi khí, thời điểm đánh lửa, đảo pha động cơ). <em>Mềm</em>: trễ hạn thì chất lượng giảm (rớt một khung hình, tiếng bị vấp). Người thiết kế chi tiền cho hai loại này rất khác nhau.</li>
<li><strong>Vì sao nó nằm ở Chương 1</strong> — nó là hệ quả trực tiếp của hệ quả số ba của định luật Moore ở slide 26: "máy tính nhỏ đi và tiện dùng trong nhiều môi trường". Tính toán rẻ, bé, ít điện không chỉ làm PC tốt hơn; nó đặt một bộ xử lý vào trong cái máy giặt.</li>
</ul>
<p class="pitfall">⚠️ Đừng định nghĩa hệ nhúng là "nhỏ" hay "yếu". Một chiếc ô tô chứa hàng chục bộ xử lý trong đó có những con khá mạnh; một router mạng là hệ nhúng với thông lượng hàng gigabit mỗi giây. <strong>Nhúng nói về VAI TRÒ</strong> — máy tính phục vụ một sản phẩm mà mục đích của sản phẩm ấy không phải là tính toán — chứ không nói về kích thước hay tốc độ.</p>`],

      [35, 'Figure 1.13 — Possible Organization of an Embedded System',
        `<p class="y-chinh">🎯 The block diagram of an embedded system, and it is deliberately not the diagram of a PC. A <strong>Processor</strong> sits in the middle; around it are <strong>Memory</strong>, <strong>Custom logic</strong>, a <strong>Human interface</strong>, a <strong>Diagnostic port</strong>, and two converters: <strong>A/D conversion</strong> fed by <strong>Sensors</strong>, and <strong>D/A conversion</strong> feeding <strong>Actuators/indicators</strong>.</p>
<ul>
<li><strong>Read the arrowheads, they carry the meaning.</strong> Sensors → A/D → Processor is a <em>one-way road in</em>; Processor → D/A → Actuators/indicators is a <em>one-way road out</em>. The human interface, memory, custom logic and diagnostic port all have double arrows. Information enters as a measurement and leaves as an action: this is a control loop, not a document editor.</li>
<li><strong>Why two converters exist at all.</strong> The physical world is continuous — a temperature, a pressure, an angle — while the processor only manipulates discrete numbers. The A/D converter samples the world into numbers and the D/A converter turns numbers back into a voltage a motor or a display can use. Those two boxes are the border between physics and arithmetic, and Chapter 10 (number systems) is what happens on the digital side of that border.</li>
<li><strong>Custom logic is a design decision, drawn.</strong> Anything too fast or too specialised for software goes into dedicated hardware (an ASIC or an FPGA). "Do it in hardware or in software?" is the trade-off this whole course keeps re-posing; here it has its own box on the diagram. Note it is wired to both Processor and Memory, so it can work on data without going through the CPU.</li>
<li><strong>The diagnostic port has no equivalent on a PC.</strong> A device with no screen and no keyboard still has to be tested in the factory, calibrated, and repaired in the field. That is an engineering requirement that a general-purpose computer never states explicitly, because its screen serves the purpose.</li>
<li><strong>Compare it with Figure 1.1 on slide 6 and the four functions on slide 5.</strong> Everything is still here — data processing (Processor), data storage (Memory), data movement (the converters and ports), control (the processor again) — but I/O is dominated by sensors and actuators instead of keyboard and display, and the human interface is an optional extra rather than the reason the machine exists. Slide 39 will remove it entirely.</li>
</ul>
<p class="meo">💡 Read the figure left-to-right as one sentence and you have memorised it: <strong>world → sensor → A/D → compute → D/A → actuator → world</strong>. Everything else on the diagram (memory, custom logic, diagnostic port, human interface) hangs off that spine as an optional branch.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ khối của một hệ nhúng, và nó CỐ Ý không phải sơ đồ của một chiếc PC. <strong>Processor</strong> nằm giữa; quanh nó là <strong>Memory</strong> (bộ nhớ), <strong>Custom logic</strong> (logic chuyên dụng), <strong>Human interface</strong> (giao diện người), <strong>Diagnostic port</strong> (cổng chẩn đoán), và hai bộ chuyển đổi: <strong>A/D</strong> nhận từ <strong>Sensors</strong> (cảm biến), và <strong>D/A</strong> đẩy ra <strong>Actuators/indicators</strong> (cơ cấu chấp hành / đèn báo).</p>
<ul>
<li><strong>Nhìn đầu mũi tên, ý nghĩa nằm ở đó.</strong> Sensors → A/D → Processor là một <em>đường MỘT CHIỀU đi vào</em>; Processor → D/A → Actuators là một <em>đường MỘT CHIỀU đi ra</em>. Còn giao diện người, bộ nhớ, logic chuyên dụng và cổng chẩn đoán đều có mũi tên hai chiều. Thông tin vào dưới dạng một phép ĐO và ra dưới dạng một HÀNH ĐỘNG: đây là một vòng điều khiển, không phải một trình soạn thảo văn bản.</li>
<li><strong>Vì sao phải có hai bộ chuyển đổi.</strong> Thế giới vật lý là liên tục — một nhiệt độ, một áp suất, một góc quay — trong khi bộ xử lý chỉ thao tác được trên số rời rạc. Bộ A/D lấy mẫu thế giới thành số, bộ D/A biến số trở lại thành điện áp mà động cơ hay màn hiển thị dùng được. Hai cái hộp ấy là biên giới giữa vật lý và số học, còn Chương 10 (hệ đếm) là chuyện xảy ra ở phía số của biên giới đó.</li>
<li><strong>Custom logic là một quyết định thiết kế, được vẽ ra.</strong> Thứ gì quá nhanh hoặc quá chuyên biệt để làm bằng phần mềm thì đưa vào phần cứng riêng (ASIC hay FPGA). "Làm bằng phần cứng hay bằng phần mềm?" là phép đánh đổi mà cả môn học này liên tục đặt lại; ở đây nó có hẳn một cái hộp trên sơ đồ. Để ý nó nối cả tới Processor lẫn Memory, nên nó xử lý dữ liệu được mà không phải đi qua CPU.</li>
<li><strong>Cổng chẩn đoán thì PC không có thứ tương đương.</strong> Một thiết bị không màn hình, không bàn phím vẫn phải được kiểm tra ở nhà máy, hiệu chuẩn, và sửa chữa ngoài hiện trường. Đó là một yêu cầu kỹ thuật mà máy tính đa dụng không bao giờ phải nêu ra, vì màn hình của nó đã làm việc đó rồi.</li>
<li><strong>So với Figure 1.1 ở slide 6 và bốn chức năng ở slide 5.</strong> Mọi thứ vẫn còn đủ — xử lý dữ liệu (Processor), lưu trữ (Memory), di chuyển dữ liệu (các bộ chuyển đổi và cổng), điều khiển (lại là processor) — nhưng phần I/O nay do cảm biến và cơ cấu chấp hành chiếm chỗ thay vì bàn phím với màn hình, còn giao diện người chỉ là phần thêm tuỳ chọn chứ không phải lý do cỗ máy tồn tại. Slide 39 sẽ bỏ hẳn nó đi.</li>
</ul>
<p class="meo">💡 Đọc hình từ trái sang phải thành một câu là thuộc: <strong>thế giới → cảm biến → A/D → tính toán → D/A → cơ cấu chấp hành → thế giới</strong>. Mọi thứ còn lại trên sơ đồ (bộ nhớ, logic chuyên dụng, cổng chẩn đoán, giao diện người) chỉ là những nhánh tuỳ chọn treo vào cái xương sống ấy.</p>`],

      [36, 'The Internet of Things (IoT)',
        `<p class="y-chinh">🎯 The IoT is defined here as "the expanding interconnection of smart devices, ranging from appliances to tiny sensors", <strong>primarily driven by deeply embedded devices</strong>. The slide then gives four <em>generations of deployment</em> — and the exam question is almost always "which generation is the IoT?"</p>
<table>
<tr><th>Generation</th><th>What the devices are</th><th>Who buys them</th><th>Connectivity</th></tr>
<tr><td>1. Information technology (IT)</td><td>PCs, servers, routers, firewalls</td><td>Enterprise IT people, as IT devices</td><td>Primarily <strong>wired</strong></td></tr>
<tr><td>2. Operational technology (OT)</td><td>Machines/appliances with embedded IT built by <strong>non-IT</strong> companies: medical machinery, SCADA, process control, kiosks</td><td>Enterprise OT people, as appliances</td><td>Primarily <strong>wired</strong></td></tr>
<tr><td>3. Personal technology</td><td>Smartphones, tablets, eBook readers</td><td>Consumers, as IT devices</td><td><strong>Exclusively wireless</strong>, often <em>multiple</em> forms</td></tr>
<tr><td>4. Sensor/actuator technology <strong>← this is the IoT</strong></td><td>Single-purpose devices, part of larger systems</td><td>Consumers, IT <em>and</em> OT people</td><td><strong>Exclusively wireless</strong>, generally a <em>single</em> form</td></tr>
</table>
<ul>
<li><strong>The table has a shape — read down the last two columns.</strong> Buyer goes enterprise → enterprise → consumer → everyone; connectivity goes wired → wired → wireless(many) → wireless(one). Memorise those two progressions and you can reconstruct the whole slide, which is far cheaper than memorising the prose.</li>
<li><strong>Why generation 4 has only ONE form of wireless</strong> — and generation 3 has several. Your phone carries Wi-Fi, Bluetooth, NFC and a cellular modem because it has a battery you charge nightly and a price to match. A sensor that must live years on a coin cell can afford exactly one radio, the cheapest and lowest-power one that reaches. Constraint drives the design, which is slide 39's theme.</li>
<li><strong>"Part of larger systems" is the key phrase</strong> — an IoT sensor alone is useless. Its value comes from thousands of them reporting into something that aggregates. That is a different architecture from a PC, which is valuable on its own.</li>
<li><strong>IT versus OT is a real workplace distinction, not just exam vocabulary.</strong> IT departments own the office network; OT departments own the factory floor, the hospital equipment, the power grid controls. The IoT is exactly the merge of those two worlds, which is also why IoT security is so hard: OT gear was designed to sit on an isolated network and suddenly isn't.</li>
<li><strong>Where it comes from and goes to</strong> — driven by the deeply embedded devices of slide 39, built from the microcontrollers of slide 38, running on the ARM Cortex-M parts of slide 41. The last five slides of this chapter are one continuous argument.</li>
</ul>
<p class="pitfall">⚠️ Two exam traps. (1) "Which generation is usually thought of as the IoT?" — the <strong>fourth</strong>, sensor/actuator technology, "marked by the use of billions of embedded devices". Not the third: smartphones are personal technology. (2) Do not swap IT and OT. <strong>OT = built by non-IT companies and bought as appliances</strong> — the slide says so explicitly, and that clause is the discriminator.</p>`,
        `<p class="y-chinh">🎯 IoT ở đây được định nghĩa là "sự kết nối ngày càng mở rộng giữa các thiết bị thông minh, từ đồ gia dụng cho tới cảm biến tí hon", và <strong>chủ yếu do các thiết bị nhúng sâu thúc đẩy</strong>. Rồi slide đưa ra bốn <em>thế hệ triển khai</em> — và câu hỏi thi gần như luôn là "thế hệ nào mới là IoT?".</p>
<table>
<tr><th>Thế hệ</th><th>Thiết bị là gì</th><th>Ai mua</th><th>Kết nối</th></tr>
<tr><td>1. Công nghệ thông tin (IT)</td><td>PC, máy chủ, router, tường lửa</td><td>Bộ phận IT của doanh nghiệp, mua như thiết bị IT</td><td>Chủ yếu <strong>có dây</strong></td></tr>
<tr><td>2. Công nghệ vận hành (OT)</td><td>Máy móc/thiết bị có IT nhúng bên trong, do các công ty <strong>KHÔNG thuộc ngành IT</strong> chế tạo: máy y tế, SCADA, điều khiển quá trình, kiosk</td><td>Bộ phận OT của doanh nghiệp, mua như thiết bị máy móc</td><td>Chủ yếu <strong>có dây</strong></td></tr>
<tr><td>3. Công nghệ cá nhân</td><td>Điện thoại thông minh, máy tính bảng, máy đọc sách</td><td>Người tiêu dùng, mua như thiết bị IT</td><td><strong>Hoàn toàn không dây</strong>, thường <em>nhiều</em> dạng</td></tr>
<tr><td>4. Công nghệ cảm biến/chấp hành <strong>← ĐÂY mới là IoT</strong></td><td>Thiết bị đơn mục đích, là một phần của hệ thống lớn hơn</td><td>Người tiêu dùng, dân IT <em>và</em> dân OT</td><td><strong>Hoàn toàn không dây</strong>, thường chỉ <em>một</em> dạng</td></tr>
</table>
<ul>
<li><strong>Bảng này có HÌNH DÁNG — hãy đọc dọc hai cột cuối.</strong> Người mua đi từ doanh nghiệp → doanh nghiệp → người tiêu dùng → tất cả; kết nối đi từ có dây → có dây → không dây (nhiều dạng) → không dây (một dạng). Thuộc hai mạch tiến đó là dựng lại được cả slide, rẻ hơn nhiều so với học thuộc đoạn văn.</li>
<li><strong>Vì sao thế hệ 4 chỉ có MỘT dạng không dây</strong> — trong khi thế hệ 3 có vài dạng. Điện thoại của bạn mang cả Wi-Fi, Bluetooth, NFC và modem di động vì nó có pin sạc mỗi đêm và có mức giá tương xứng. Một con cảm biến phải sống nhiều năm bằng một viên pin cúc áo thì chỉ đủ sức nuôi đúng một bộ thu phát, loại rẻ nhất và tốn ít điện nhất mà vẫn với tới được. Ràng buộc quyết định thiết kế, đúng chủ đề của slide 39.</li>
<li><strong>Cụm "là một phần của hệ thống lớn hơn" là chìa khoá</strong> — một cảm biến IoT đứng một mình thì vô dụng. Giá trị của nó đến từ việc hàng nghìn con cùng báo về một chỗ tổng hợp. Đó là kiến trúc khác hẳn chiếc PC, thứ tự nó đã có giá trị.</li>
<li><strong>IT với OT là phân biệt có thật trong đời làm nghề, không chỉ là từ vựng thi cử.</strong> Bộ phận IT quản mạng văn phòng; bộ phận OT quản sàn nhà máy, thiết bị bệnh viện, hệ điều khiển lưới điện. IoT chính là chỗ hai thế giới đó nhập vào nhau, và cũng vì thế mà an toàn IoT khó tới vậy: thiết bị OT vốn được thiết kế để nằm trên một mạng cô lập, rồi đột nhiên không còn cô lập nữa.</li>
<li><strong>Từ đâu tới và đi về đâu</strong> — được thúc đẩy bởi các thiết bị nhúng sâu ở slide 39, dựng từ vi điều khiển ở slide 38, chạy trên các lõi ARM Cortex-M ở slide 41. Năm slide cuối chương này là một mạch lập luận liền một hơi.</li>
</ul>
<p class="pitfall">⚠️ Hai bẫy đề thi. (1) "Thế hệ nào thường được coi là IoT?" — thế hệ <strong>THỨ TƯ</strong>, công nghệ cảm biến/chấp hành, "đặc trưng bởi việc dùng hàng tỉ thiết bị nhúng". Không phải thế hệ ba: điện thoại thông minh thuộc công nghệ cá nhân. (2) Đừng đảo IT với OT. <strong>OT = do công ty KHÔNG thuộc ngành IT chế tạo và được mua như máy móc thiết bị</strong> — slide nói thẳng như vậy, và mệnh đề đó chính là dấu hiệu phân biệt.</p>`],

      [37, 'Embedded Operating Systems · Application Processors versus Dedicated Processors',
        `<p class="y-chinh">🎯 Two questions on one slide. First: where does an embedded OS come from? <strong>Either adapt an existing OS, or design one solely for embedded use.</strong> Second: what kind of processor is underneath? <strong>Application processors</strong> run complex operating systems; <strong>dedicated processors</strong> do one job as cheaply as possible.</p>
<table>
<tr><th></th><th>Application processor</th><th>Dedicated processor</th></tr>
<tr><td>Slide's definition</td><td>Defined by the processor's <strong>ability to execute complex operating systems</strong>; general-purpose in nature</td><td><strong>Dedicated to one or a small number of specific tasks</strong> required by the host device</td></tr>
<tr><td>Example on the slide</td><td>The smartphone — designed to support numerous apps and perform a wide variety of functions</td><td>(no example given; slide 38's microcontroller is the picture of one)</td></tr>
<tr><td>Consequence</td><td>Needs an MMU, megabytes of RAM, a file system, drivers</td><td>Processor and associated components can be <strong>engineered to reduce size and cost</strong></td></tr>
<tr><td>In ARM's catalogue (slide 41)</td><td>Cortex-<strong>A</strong> (A for Application)</td><td>Cortex-<strong>M</strong> (M for Microcontroller), Cortex-R for real-time</td></tr>
</table>
<ul>
<li><strong>The two OS approaches are a genuine engineering trade, not trivia.</strong> <em>Adapt an existing OS</em> (embedded Linux, Android): you inherit drivers, a network stack, a file system, debuggers and a hiring pool — at the cost of megabytes of memory and timing you cannot fully predict. <em>Build one for embedded use</em> (a small RTOS, or no OS at all): a few kilobytes, latency you can bound and prove — but you write everything yourself.</li>
<li><strong>Predictability is the real currency.</strong> A desktop OS optimises average throughput; an embedded OS optimises the <em>worst case</em>. Nobody certifies a brake controller on its average response time. That is why "adapt Linux" is a hard sell where hard deadlines exist.</li>
<li><strong>"Ability to execute complex operating systems" is a hardware statement.</strong> Running Linux needs a memory management unit for virtual memory and protection (Chapter 9), enough RAM, and usually external DRAM. A dedicated processor typically has no MMU at all — and that single missing block is what makes it small and cheap.</li>
<li><strong>The distinction is not about power, it is about role.</strong> A modern Cortex-M7 can be clocked faster than early smartphone chips, and it is still a dedicated processor, because it is built to run one program forever rather than to host an OS and arbitrary apps.</li>
<li><strong>Where it lands next</strong> — slide 38 draws what a dedicated-processor chip actually contains; slide 39 takes it to the extreme; slide 41 shows ARM selling exactly these two categories as two product lines.</li>
</ul>
<p class="pitfall">⚠️ "Application processor" does not mean "the processor that runs the application". Every processor runs some application. It means <strong>a processor capable of hosting a full, complex operating system</strong> — general-purpose hardware. Use the slide's own words and you will not lose the mark.</p>`,
        `<p class="y-chinh">🎯 Hai câu hỏi trên một slide. Thứ nhất: hệ điều hành nhúng lấy từ đâu ra? <strong>Hoặc cải biên một HĐH có sẵn, hoặc thiết kế một cái chỉ dành riêng cho nhúng.</strong> Thứ hai: bên dưới là loại bộ xử lý nào? <strong>Bộ xử lý ứng dụng</strong> chạy được HĐH phức tạp; <strong>bộ xử lý chuyên dụng</strong> làm đúng một việc với giá rẻ nhất có thể.</p>
<table>
<tr><th></th><th>Bộ xử lý ứng dụng</th><th>Bộ xử lý chuyên dụng</th></tr>
<tr><td>Định nghĩa trên slide</td><td>Được định nghĩa bởi <strong>khả năng thi hành các hệ điều hành phức tạp</strong>; về bản chất là đa dụng</td><td><strong>Chuyên cho một hoặc vài tác vụ cụ thể</strong> mà thiết bị chủ đòi hỏi</td></tr>
<tr><td>Ví dụ slide đưa</td><td>Điện thoại thông minh — thiết kế để chạy vô số ứng dụng và làm rất nhiều chức năng khác nhau</td><td>(slide không nêu ví dụ; con vi điều khiển ở slide 38 chính là bức ảnh của nó)</td></tr>
<tr><td>Hệ quả</td><td>Cần MMU, hàng megabyte RAM, hệ tệp, trình điều khiển</td><td>Bộ xử lý và linh kiện đi kèm được <strong>thiết kế để giảm kích thước và giá thành</strong></td></tr>
<tr><td>Trong danh mục ARM (slide 41)</td><td>Cortex-<strong>A</strong> (A = Application)</td><td>Cortex-<strong>M</strong> (M = Microcontroller), Cortex-R cho thời gian thực</td></tr>
</table>
<ul>
<li><strong>Hai lối làm HĐH là một phép đánh đổi kỹ thuật thật, không phải chuyện vặt.</strong> <em>Cải biên HĐH có sẵn</em> (Linux nhúng, Android): bạn thừa hưởng trình điều khiển, ngăn xếp mạng, hệ tệp, công cụ gỡ lỗi và cả nguồn nhân lực — đổi lại là hàng megabyte bộ nhớ và nhịp thời gian không đoán trước hết được. <em>Tự dựng một HĐH cho nhúng</em> (một RTOS nhỏ, hoặc không HĐH nào cả): vài kilobyte, độ trễ chặn trên được và chứng minh được — nhưng bạn phải tự viết tất cả.</li>
<li><strong>Tính ĐOÁN TRƯỚC ĐƯỢC mới là đồng tiền thật ở đây.</strong> HĐH máy để bàn tối ưu thông lượng trung bình; HĐH nhúng tối ưu <em>trường hợp XẤU NHẤT</em>. Không ai chứng nhận một bộ điều khiển phanh dựa trên thời gian đáp ứng trung bình. Vì thế "cứ lấy Linux về sửa" rất khó bán ở nơi có hạn chót cứng.</li>
<li><strong>"Khả năng thi hành HĐH phức tạp" là một phát biểu về PHẦN CỨNG.</strong> Chạy được Linux cần một khối quản lý bộ nhớ (MMU) để có bộ nhớ ảo và cơ chế bảo vệ (Chương 9), đủ RAM, và thường là DRAM ngoài. Bộ xử lý chuyên dụng thường KHÔNG có MMU — và đúng cái khối thiếu vắng ấy làm nó nhỏ và rẻ.</li>
<li><strong>Phân biệt này không nói về sức mạnh, nó nói về vai trò.</strong> Một con Cortex-M7 đời mới có thể chạy xung nhịp cao hơn chip điện thoại thuở đầu, mà vẫn là bộ xử lý chuyên dụng, vì nó được dựng để chạy mãi một chương trình chứ không phải để cõng một HĐH và những ứng dụng tuỳ ý.</li>
<li><strong>Đi tiếp về đâu</strong> — slide 38 vẽ ra con chip xử lý chuyên dụng thật sự chứa những gì; slide 39 đẩy nó tới cực đoan; slide 41 cho thấy ARM bán đúng hai hạng mục này thành hai dòng sản phẩm.</li>
</ul>
<p class="pitfall">⚠️ "Bộ xử lý ứng dụng" KHÔNG có nghĩa là "bộ xử lý chạy ứng dụng". Bộ xử lý nào chẳng chạy một ứng dụng nào đó. Nó nghĩa là <strong>bộ xử lý đủ sức cõng một hệ điều hành đầy đủ, phức tạp</strong> — tức phần cứng đa dụng. Cứ dùng đúng chữ của slide thì không mất điểm.</p>`],

      [38, 'Figure 1.14 — Typical Microcontroller Chip Elements',
        `<p class="y-chinh">🎯 The whole diagram sits inside one <strong>dotted rectangle</strong>, and that rectangle is <em>one chip</em>. That is the entire point of the figure: a <strong>microcontroller</strong> is a processor plus memory plus I/O plus timers on a single die, whereas a <strong>microprocessor</strong> is only the CPU and needs all of this wired up externally.</p>
<table>
<tr><th>Block in the figure</th><th>The label beside it</th><th>Why it is there</th></tr>
<tr><td>Processor</td><td>—</td><td>The CPU of slide 8: control unit, ALU, registers.</td></tr>
<tr><td>RAM</td><td>Temporary data</td><td>Volatile working storage — variables, stack. Often only kilobytes.</td></tr>
<tr><td>ROM</td><td>Program and data</td><td>The program itself, fixed. Slide 39: "burned into ROM".</td></tr>
<tr><td>EEPROM</td><td>Permanent data</td><td>Non-volatile <em>but rewritable</em>: calibration constants, settings, counters that must survive power loss.</td></tr>
<tr><td>TIMER</td><td>Timing functions</td><td>Time is a first-class resource in a real-time system (slide 34).</td></tr>
<tr><td>A/D converter</td><td>Analog data acquisition</td><td>Sensors in.</td></tr>
<tr><td>D/A converter</td><td>Analog data transmission</td><td>Actuators out.</td></tr>
<tr><td>Serial I/O ports</td><td>Send/receive data</td><td>Few wires, longer distance.</td></tr>
<tr><td>Parallel I/O ports</td><td>Peripheral interfaces</td><td>Many wires, short distance, fast.</td></tr>
<tr><td>System bus</td><td>—</td><td>The fourth structural component from slide 7, now inside the chip.</td></tr>
</table>
<ul>
<li><strong>Three memories, three jobs — this is the most examinable part of the figure.</strong> RAM is fast and forgets everything at power-off; ROM never forgets and never changes; EEPROM never forgets but can be rewritten a limited number of times. A device that must remember your last setting after the power cut needs the third one, and no amount of RAM or ROM substitutes for it. Chapters 5 and 6 classify all of these properly.</li>
<li><strong>Compare with Figure 1.1 on slide 6 and the hierarchy claim of slide 4.</strong> The four structural components are all here — CPU (Processor), main memory (RAM/ROM/EEPROM), I/O (the four port blocks and the converters), and system interconnection (the bus). The hierarchy of slide 4 is unchanged; it has simply been shrunk into one package. That is a strong illustration that "structure and function" are level-independent.</li>
<li><strong>Why integration is the whole value.</strong> Every block that moves onto the die removes a package, a set of pins, a piece of board and a handful of external wires — cheaper, smaller, lower power, more reliable (fewer solder joints to fail). This is Moore's-law consequence number five from slide 26, delivered as a product category.</li>
<li><strong>What is NOT in the figure is just as telling</strong> — no cache, no MMU, no disk controller, no graphics. A dedicated processor (slide 37) does not need them, and leaving them out is how the chip gets cheap enough to put in a toothbrush.</li>
</ul>
<p class="dap-an">✅ The classic question: <em>state the difference between a microprocessor and a microcontroller.</em> Answer with this figure: a <strong>microprocessor</strong> is a CPU on a chip — it needs external memory, external I/O and an external bus before it can do anything. A <strong>microcontroller</strong> is a complete small computer on one chip: processor + RAM + ROM + EEPROM + timers + serial and parallel I/O + A/D and D/A, joined by an on-chip system bus. The difference is <em>self-containment</em>, not speed.</p>
<p class="pitfall">⚠️ Do not read the dotted line as "the box on the circuit board". It is the <strong>chip boundary</strong>. Every block drawn inside it is on the same piece of silicon, which is exactly why the only arrows crossing the line are the four labelled data flows on the left and the notes on the right.</p>`,
        `<p class="y-chinh">🎯 Cả sơ đồ nằm trong một <strong>hình chữ nhật nét đứt</strong>, và hình chữ nhật đó là <em>MỘT CON CHIP</em>. Đó là toàn bộ ý của hình: <strong>vi điều khiển</strong> là bộ xử lý cộng bộ nhớ cộng I/O cộng bộ định thời trên cùng một die, trong khi <strong>vi xử lý</strong> chỉ là CPU và cần đấu tất cả những thứ kia từ bên ngoài.</p>
<table>
<tr><th>Khối trong hình</th><th>Nhãn ghi bên cạnh</th><th>Có mặt để làm gì</th></tr>
<tr><td>Processor</td><td>—</td><td>Chính là CPU ở slide 8: khối điều khiển, ALU, thanh ghi.</td></tr>
<tr><td>RAM</td><td>Dữ liệu tạm</td><td>Bộ nhớ làm việc, mất khi cắt điện — biến, ngăn xếp. Thường chỉ vài kilobyte.</td></tr>
<tr><td>ROM</td><td>Chương trình và dữ liệu</td><td>Chính chương trình, cố định. Slide 39: "nung vào ROM".</td></tr>
<tr><td>EEPROM</td><td>Dữ liệu vĩnh viễn</td><td>Không mất khi cắt điện <em>nhưng ghi lại được</em>: hằng số hiệu chuẩn, thiết lập, bộ đếm cần sống sót qua lần mất điện.</td></tr>
<tr><td>TIMER</td><td>Chức năng định thời</td><td>Trong hệ thời gian thực, THỜI GIAN là một tài nguyên hạng nhất (slide 34).</td></tr>
<tr><td>Bộ chuyển A/D</td><td>Thu nhận dữ liệu tương tự</td><td>Cảm biến đi vào.</td></tr>
<tr><td>Bộ chuyển D/A</td><td>Phát dữ liệu tương tự</td><td>Cơ cấu chấp hành đi ra.</td></tr>
<tr><td>Cổng I/O nối tiếp</td><td>Gửi/nhận dữ liệu</td><td>Ít dây, đi xa được.</td></tr>
<tr><td>Cổng I/O song song</td><td>Giao tiếp ngoại vi</td><td>Nhiều dây, cự ly ngắn, nhanh.</td></tr>
<tr><td>System bus</td><td>—</td><td>Thành phần cấu trúc thứ tư ở slide 7, nay nằm bên trong chip.</td></tr>
</table>
<ul>
<li><strong>Ba loại bộ nhớ, ba nhiệm vụ — đây là phần dễ ra đề nhất của hình.</strong> RAM nhanh và quên sạch khi cắt điện; ROM không bao giờ quên và không bao giờ đổi; EEPROM không quên nhưng ghi lại được một số lần hữu hạn. Thiết bị phải nhớ thiết lập cuối cùng của bạn sau khi cúp điện thì cần loại thứ ba, và bao nhiêu RAM hay ROM cũng không thay thế được. Chương 5 và Chương 6 phân loại đầy đủ những thứ này.</li>
<li><strong>So với Figure 1.1 ở slide 6 và khẳng định phân cấp ở slide 4.</strong> Bốn thành phần cấu trúc đều có mặt — CPU (Processor), bộ nhớ chính (RAM/ROM/EEPROM), I/O (bốn khối cổng và hai bộ chuyển đổi), và liên kết hệ thống (bus). Phân cấp ở slide 4 không đổi chút nào; nó chỉ bị thu nhỏ vào trong một cái vỏ. Đây là minh hoạ mạnh cho việc "cấu trúc và chức năng" không phụ thuộc vào cấp.</li>
<li><strong>Vì sao TÍCH HỢP chính là toàn bộ giá trị.</strong> Mỗi khối dọn được vào die là bớt một cái vỏ, một bộ chân, một mảnh bo và một nắm dây bên ngoài — rẻ hơn, nhỏ hơn, ít điện hơn, tin cậy hơn (ít mối hàn để hỏng hơn). Đây chính là hệ quả thứ năm của định luật Moore ở slide 26, giao đến tay dưới dạng một chủng loại sản phẩm.</li>
<li><strong>Thứ KHÔNG có trong hình cũng nói lên nhiều điều</strong> — không cache, không MMU, không bộ điều khiển đĩa, không đồ hoạ. Bộ xử lý chuyên dụng (slide 37) không cần chúng, và chính việc bỏ chúng đi mới làm con chip rẻ tới mức nhét được vào bàn chải đánh răng.</li>
</ul>
<p class="dap-an">✅ Câu hỏi kinh điển: <em>nêu khác biệt giữa vi xử lý và vi điều khiển.</em> Trả lời bằng chính hình này: <strong>vi xử lý</strong> là một CPU trên một con chip — nó cần bộ nhớ ngoài, I/O ngoài và bus ngoài thì mới làm được gì. <strong>Vi điều khiển</strong> là một máy tính nhỏ HOÀN CHỈNH trên một con chip: bộ xử lý + RAM + ROM + EEPROM + bộ định thời + I/O nối tiếp và song song + A/D và D/A, nối với nhau bằng bus hệ thống ngay trên chip. Khác biệt nằm ở tính <em>tự chứa</em>, không nằm ở tốc độ.</p>
<p class="pitfall">⚠️ Đừng đọc nét đứt thành "cái hộp trên bo mạch". Nó là <strong>ranh giới CON CHIP</strong>. Mọi khối vẽ bên trong đều nằm trên cùng một miếng silic, và đúng vì thế mà những mũi tên duy nhất cắt qua đường nét đứt là bốn luồng dữ liệu có nhãn bên trái và mấy ghi chú bên phải.</p>`],

      [39, 'Deeply Embedded Systems',
        `<p class="y-chinh">🎯 The extreme case. A <strong>deeply embedded system</strong> is a <em>subset</em> of embedded systems in which the computer has disappeared entirely: no user, no visible behaviour, no way to reprogram it, and resources measured in kilobytes and microamps.</p>
<table>
<tr><th>What the slide states</th><th>What it implies in practice</th></tr>
<tr><td>Behaviour is difficult to observe by both the programmer and the user</td><td>No screen, often no serial port: you debug with an oscilloscope and a toggled output pin.</td></tr>
<tr><td>Uses a <strong>microcontroller</strong> rather than a microprocessor</td><td>Exactly the chip on slide 38 — self-contained, no external memory.</td></tr>
<tr><td>Not programmable once the program logic has been burned into ROM</td><td>The software is fixed for the life of the product; a bug is a recall, not a patch.</td></tr>
<tr><td>Has <strong>no interaction with a user</strong></td><td>The Human interface box of Figure 1.13 (slide 35) is simply absent.</td></tr>
<tr><td>Dedicated, single purpose: detect something in the environment, perform basic processing, do something with the results</td><td>Sense → compute → act, with nothing else in the program.</td></tr>
<tr><td>Often wireless, in networked configurations such as sensor networks over a large area</td><td>This is generation four of slide 36 — the IoT is built out of these.</td></tr>
<tr><td>Typically <strong>extreme resource constraints</strong>: memory, processor size, time, power consumption</td><td>Kilobytes, not megabytes; and energy is usually the binding one.</td></tr>
</table>
<ul>
<li><strong>Energy is the constraint that shapes everything else.</strong> A sensor expected to run for years on one coin cell cannot stay awake: it sleeps at microamps, wakes on a timer or an interrupt, measures, transmits a few bytes, and sleeps again. Since radio transmission costs far more energy than computation, the design rule inverts — it is often cheaper to <em>compute more</em> locally in order to <em>transmit less</em>. Nothing about desktop programming prepares you for that trade.</li>
<li><strong>"Difficult to observe" is a testing problem, not a philosophical one.</strong> With no console you cannot printf. Real techniques: toggle a GPIO pin and watch it on a scope, use the diagnostic port of Figure 1.13, or use the on-chip debug and trace blocks — which is exactly what the DAP and ETM blocks in Figure 1.15 (slide 42) are for.</li>
<li><strong>Deeply embedded is a SUBSET, not a synonym.</strong> Every deeply embedded system is embedded; most embedded systems are not deeply embedded. A smartphone is the slide's own example of an <em>application processor</em> (slide 37) — heavily interactive and endlessly reprogrammable, so it is nowhere near this category.</li>
<li><strong>A modernity note the slide does not make.</strong> "Not programmable once burned into ROM" describes classic mask-ROM parts. Much modern hardware uses flash and can be field-updated — and that shift is precisely what created the IoT security problem: billions of networked devices that either cannot be patched, or can be patched by whoever reaches them first.</li>
</ul>
<p class="meo">💡 One sentence that captures the definition: <strong>a deeply embedded system senses, computes a little, acts, and no human ever knows it is there.</strong> If any part of that sentence fails — a user interacts with it, or you can reflash it, or it hosts an OS — it is embedded, but not deeply embedded.</p>`,
        `<p class="y-chinh">🎯 Trường hợp cực đoan. <strong>Hệ nhúng sâu</strong> là một <em>tập con</em> của hệ nhúng, trong đó chiếc máy tính đã biến mất hoàn toàn: không người dùng, không hành vi nhìn thấy được, không cách nào lập trình lại, và tài nguyên đo bằng kilobyte với microampe.</p>
<table>
<tr><th>Slide phát biểu gì</th><th>Trong thực tế nghĩa là gì</th></tr>
<tr><td>Hành vi khó quan sát, với cả lập trình viên lẫn người dùng</td><td>Không màn hình, thường không cả cổng nối tiếp: bạn gỡ lỗi bằng máy hiện sóng và một chân ra bật tắt.</td></tr>
<tr><td>Dùng <strong>vi điều khiển</strong> chứ không dùng vi xử lý</td><td>Đúng con chip ở slide 38 — tự chứa, không cần bộ nhớ ngoài.</td></tr>
<tr><td>Không lập trình lại được một khi logic chương trình đã nung vào ROM</td><td>Phần mềm cố định suốt đời sản phẩm; một con bọ nghĩa là thu hồi hàng, không phải một bản vá.</td></tr>
<tr><td><strong>Không tương tác với người dùng</strong></td><td>Cái hộp "Human interface" của Figure 1.13 (slide 35) đơn giản là biến mất.</td></tr>
<tr><td>Chuyên dụng, đơn mục đích: phát hiện một thứ gì đó trong môi trường, xử lý sơ bộ, rồi làm gì đó với kết quả</td><td>Cảm nhận → tính → hành động, trong chương trình không có gì khác.</td></tr>
<tr><td>Thường có khả năng không dây, nằm trong cấu hình mạng như các mạng cảm biến trải trên vùng rộng</td><td>Đây là thế hệ thứ tư ở slide 36 — IoT được dựng từ chính những thứ này.</td></tr>
<tr><td>Thường <strong>bị ràng buộc tài nguyên cực gắt</strong>: bộ nhớ, kích thước bộ xử lý, thời gian, mức tiêu thụ điện</td><td>Kilobyte chứ không megabyte; và thường ĐIỆN mới là ràng buộc quyết định.</td></tr>
</table>
<ul>
<li><strong>Năng lượng là ràng buộc nhào nặn mọi thứ còn lại.</strong> Một cảm biến phải chạy nhiều năm bằng một viên pin cúc áo thì không được phép thức: nó ngủ ở mức vài microampe, thức dậy theo bộ định thời hoặc theo ngắt, đo, phát vài byte, rồi ngủ tiếp. Vì phát sóng tốn năng lượng hơn tính toán rất nhiều, luật thiết kế bị lộn ngược — thường TÍNH NHIỀU HƠN tại chỗ để PHÁT ÍT ĐI lại rẻ hơn. Không có gì trong lập trình máy để bàn chuẩn bị cho bạn phép đánh đổi đó.</li>
<li><strong>"Khó quan sát" là vấn đề KIỂM THỬ, không phải vấn đề triết học.</strong> Không có cửa sổ console thì không printf được. Cách làm thật: bật tắt một chân GPIO rồi soi bằng máy hiện sóng, dùng cổng chẩn đoán của Figure 1.13, hoặc dùng các khối gỡ lỗi và truy vết ngay trên chip — đúng là việc của hai khối DAP và ETM trong Figure 1.15 (slide 42).</li>
<li><strong>Nhúng sâu là TẬP CON, không phải từ đồng nghĩa.</strong> Mọi hệ nhúng sâu đều là hệ nhúng; phần lớn hệ nhúng thì không nhúng sâu. Điện thoại thông minh chính là ví dụ mà slide 37 đưa ra cho <em>bộ xử lý ứng dụng</em> — tương tác dày đặc và lập trình lại thoải mái, nên nó chẳng gần hạng mục này chút nào.</li>
<li><strong>Một ghi chú thời sự mà slide không nói.</strong> Câu "không lập trình lại được sau khi nung vào ROM" mô tả các linh kiện ROM mặt nạ kiểu cũ. Phần cứng ngày nay phần lớn dùng flash và cập nhật được ngoài hiện trường — và chính bước chuyển đó đã tạo ra bài toán an toàn của IoT: hàng tỉ thiết bị nối mạng mà hoặc không vá được, hoặc vá được bởi bất cứ ai chạm tới trước.</li>
</ul>
<p class="meo">💡 Một câu gói trọn định nghĩa: <strong>hệ nhúng sâu cảm nhận, tính một chút, hành động, và không người nào biết là nó có ở đó.</strong> Hỏng bất cứ vế nào của câu ấy — có người tương tác với nó, hoặc nạp lại phần mềm được, hoặc nó cõng một HĐH — thì đó là hệ nhúng, nhưng không phải nhúng sâu.</p>`],

      [40, 'ARM',
        `<p class="y-chinh">🎯 The last architecture of the chapter, and by count the biggest one on earth. Five statements: ARM evolved from <strong>RISC</strong> design principles and is used in embedded systems; it is a family of RISC-based microprocessors and microcontrollers designed by <strong>ARM Holdings, Cambridge, England</strong>; the chips are known for <strong>small die size and low power</strong>; it is probably the most widely used embedded processor architecture <em>and indeed the most widely used processor architecture of any kind in the world</em>; and the name stands for <strong>Acorn RISC Machine / Advanced RISC Machine</strong>.</p>
<ul>
<li><strong>Both expansions of the name are on the slide because both are historically true.</strong> It began in 1985 at Acorn Computers as the <em>Acorn</em> RISC Machine; when ARM Ltd was spun out in 1990 it became the <em>Advanced</em> RISC Machine. If an exam asks what ARM stands for, giving both — with the reason — is the complete answer.</li>
<li><strong>"Small die size and low power" is a consequence of RISC, not a coincidence.</strong> A reduced instruction set needs less decoding logic, fewer microcode structures and simpler control (Chapter 17 is devoted to why). Less logic means a smaller die, and a smaller die switching fewer gates means less of the <em>C</em> in P ≈ C·V<sup>2</sup>·f from slide 31. Simplicity converts directly into battery life.</li>
<li><strong>Why "most widely used of any kind" is possible at all</strong> — and this is the part the slide does not say. ARM Holdings does not manufacture chips; it <strong>licenses the architecture and the core designs</strong> to everyone else. Apple, Qualcomm, Samsung, NXP, TI and hundreds of others each build their own silicon around an ARM core. Slide 2's separation of architecture from organization is the reason this business model can exist: many organizations, one architecture, many companies.</li>
<li><strong>Put ARM and x86 side by side and the chapter closes its own loop.</strong> x86 (slides 28–33) grew from the desktop down; ARM grew from the embedded world up. Both are long-lived architectures with backward compatibility, and both now appear in phones, laptops and servers. This is the practical payoff of the definitions on slide 2.</li>
<li><strong>Where to go next in this course</strong> — Chapter 17 explains the RISC principles this slide only names; Chapter 13 covers instruction set characteristics; slide 41 lists the product families and slide 42 opens one up.</li>
</ul>
<p class="pitfall">⚠️ A layout defect to notice: the graphic has <strong>four empty rows below "Acorn RISC Machine/Advanced RISC Machine"</strong>. Nothing has been cut off — the shape simply has more slots than the slide has statements. Do not go hunting for missing content, and do not assume the printed handout lost anything.</p>`,
        `<p class="y-chinh">🎯 Kiến trúc cuối cùng của chương, và xét về số lượng thì là kiến trúc lớn nhất hành tinh. Năm phát biểu: ARM tiến hoá từ các nguyên lý thiết kế <strong>RISC</strong> và được dùng trong hệ nhúng; nó là một họ vi xử lý và vi điều khiển dựa trên RISC do <strong>ARM Holdings, Cambridge, Anh</strong> thiết kế; các chip nổi tiếng vì <strong>die nhỏ và tiêu thụ điện thấp</strong>; nó có lẽ là kiến trúc bộ xử lý nhúng được dùng rộng rãi nhất <em>và thực ra là kiến trúc bộ xử lý được dùng rộng rãi nhất thuộc mọi loại trên thế giới</em>; và tên viết tắt của <strong>Acorn RISC Machine / Advanced RISC Machine</strong>.</p>
<ul>
<li><strong>Cả hai cách giải nghĩa tên đều có trên slide vì cả hai đều đúng về lịch sử.</strong> Nó khởi đầu năm 1985 tại công ty Acorn Computers với tên <em>Acorn</em> RISC Machine; khi ARM Ltd được tách ra thành công ty riêng năm 1990 thì thành <em>Advanced</em> RISC Machine. Nếu đề hỏi ARM viết tắt của gì, nêu cả hai kèm lý do mới là câu trả lời đầy đủ.</li>
<li><strong>"Die nhỏ, điện thấp" là HỆ QUẢ của RISC, không phải trùng hợp.</strong> Tập lệnh rút gọn cần ít mạch giải mã hơn, ít cấu trúc vi chương trình hơn và khối điều khiển đơn giản hơn (Chương 17 dành trọn để giải thích vì sao). Ít mạch nghĩa là die nhỏ, mà die nhỏ đóng ngắt ít cổng hơn thì giảm đúng thừa số <em>C</em> trong P ≈ C·V<sup>2</sup>·f ở slide 31. Sự đơn giản đổi thẳng thành thời lượng pin.</li>
<li><strong>Vì sao "được dùng rộng rãi nhất thuộc mọi loại" là chuyện có thể xảy ra</strong> — và đây là phần slide không nói. ARM Holdings KHÔNG sản xuất chip; họ <strong>cấp phép kiến trúc và các thiết kế lõi</strong> cho tất cả những hãng khác. Apple, Qualcomm, Samsung, NXP, TI và hàng trăm hãng nữa, mỗi hãng tự dựng silic của mình quanh một lõi ARM. Phép tách kiến trúc khỏi tổ chức ở slide 2 chính là lý do mô hình kinh doanh này tồn tại được: nhiều tổ chức, một kiến trúc, nhiều công ty.</li>
<li><strong>Đặt ARM cạnh x86 là chương này tự khép vòng của nó.</strong> x86 (slide 28–33) lớn lên từ máy để bàn đi xuống; ARM lớn lên từ thế giới nhúng đi lên. Cả hai đều là kiến trúc trường thọ có tương thích ngược, và nay cả hai đều có mặt trong điện thoại, máy tính xách tay và máy chủ. Đây là phần lợi ích thực tế của những định nghĩa ở slide 2.</li>
<li><strong>Đi tiếp đâu trong môn này</strong> — Chương 17 giải thích các nguyên lý RISC mà slide này mới chỉ gọi tên; Chương 13 nói về đặc điểm tập lệnh; slide 41 liệt kê các dòng sản phẩm và slide 42 mở tung một con ra.</li>
</ul>
<p class="pitfall">⚠️ Một lỗi bố cục cần nhận ra: đồ hoạ có <strong>bốn hàng TRỐNG bên dưới dòng "Acorn RISC Machine/Advanced RISC Machine"</strong>. Không có nội dung nào bị cắt — cái khuôn hình đơn giản là có nhiều ô hơn số phát biểu mà slide cần. Đừng đi tìm phần nội dung "thiếu", và cũng đừng nghĩ bản in phát tay đã làm rơi mất thứ gì.</p>`],

      [41, 'ARM Products — Cortex-A, Cortex-R, Cortex-M',
        `<p class="y-chinh">🎯 ARM's catalogue in three letters. A staircase of three steps — <strong>Cortex-A</strong>, <strong>Cortex-R</strong>, <strong>Cortex-M</strong> — with only the M family expanded: M0, M0+, M3, M4, M7, M23, M33.</p>
<table>
<tr><th>Family</th><th>The letter stands for</th><th>What it is built to do</th><th>Maps onto</th></tr>
<tr><td>Cortex-<strong>A</strong></td><td><strong>A</strong>pplication</td><td>Runs full operating systems — Linux, Android, iOS. Has an MMU, caches, high clock.</td><td>"Application processor", slide 37</td></tr>
<tr><td>Cortex-<strong>R</strong></td><td><strong>R</strong>eal-time</td><td>Bounded, predictable latency above all. Storage controllers, automotive, baseband modems.</td><td>Real-time constraints, slide 34</td></tr>
<tr><td>Cortex-<strong>M</strong></td><td><strong>M</strong>icrocontroller</td><td>Smallest, cheapest, lowest power. The microcontroller chip of slide 38.</td><td>"Dedicated processor", slide 37; deeply embedded, slide 39</td></tr>
</table>
<ul>
<li><strong>Three letters, three answers — that is the whole slide.</strong> A-pplication, R-eal-time, M-icrocontroller. If you remember only the expansion of each letter you can reconstruct everything else, because the letter <em>is</em> the design brief.</li>
<li><strong>The three families are the earlier slides made into products.</strong> Slide 37 split processors into application versus dedicated; slide 34 introduced real-time constraints; slide 38 drew a microcontroller; slide 39 described deeply embedded devices. ARM sells one product line per concept. This is a good moment to check you can still state each concept without looking.</li>
<li><strong>Why only the M family is listed out.</strong> The chapter is about embedded systems, and M is the embedded line — the parts that go into the billions of devices slide 34 counted. The A and R families are no less real (there are many Cortex-A and Cortex-R cores); the slide simply does not need them here.</li>
<li><strong>Reading the M list itself</strong> — the numbers roughly order capability, not chronology: M0 and M0+ are the smallest and cheapest, M3 is the classic mid-range part shown in Figure 1.15 on the next slide, M4 adds digital-signal-processing instructions, M7 is the fastest of the classic line, and M23/M33 add TrustZone security features for microcontrollers. You are not expected to memorise the list; you are expected to recognise that one family spans a wide range of sizes.</li>
<li><strong>Same architecture, many organizations — again.</strong> All three families share the ARM instruction-set lineage, so the knowledge transfers; what changes is what is built around the core. That is slide 2 for the third time in this chapter, and it is the idea the exam most reliably rewards.</li>
</ul>
<p class="pitfall">⚠️ The graphic is a <strong>staircase ascending A → R → M</strong>, which strongly suggests that M is the highest, best or most powerful. It is not. The three families are <em>three different targets</em>, not a performance ranking — in raw performance the order is essentially the reverse, with Cortex-A at the top. Treat the rising steps as decoration, not data.</p>`,
        `<p class="y-chinh">🎯 Danh mục sản phẩm của ARM gói trong ba chữ cái. Một cầu thang ba bậc — <strong>Cortex-A</strong>, <strong>Cortex-R</strong>, <strong>Cortex-M</strong> — và chỉ riêng họ M được liệt kê ra: M0, M0+, M3, M4, M7, M23, M33.</p>
<table>
<tr><th>Họ</th><th>Chữ cái viết tắt của</th><th>Được dựng để làm gì</th><th>Ứng với</th></tr>
<tr><td>Cortex-<strong>A</strong></td><td><strong>A</strong>pplication (ứng dụng)</td><td>Chạy hệ điều hành đầy đủ — Linux, Android, iOS. Có MMU, có cache, xung nhịp cao.</td><td>"Bộ xử lý ứng dụng", slide 37</td></tr>
<tr><td>Cortex-<strong>R</strong></td><td><strong>R</strong>eal-time (thời gian thực)</td><td>Trên hết là độ trễ chặn trên được và đoán trước được. Bộ điều khiển lưu trữ, ô tô, modem băng gốc.</td><td>Ràng buộc thời gian thực, slide 34</td></tr>
<tr><td>Cortex-<strong>M</strong></td><td><strong>M</strong>icrocontroller (vi điều khiển)</td><td>Nhỏ nhất, rẻ nhất, ít điện nhất. Chính là con chip vi điều khiển ở slide 38.</td><td>"Bộ xử lý chuyên dụng", slide 37; nhúng sâu, slide 39</td></tr>
</table>
<ul>
<li><strong>Ba chữ cái, ba câu trả lời — cả slide chỉ có thế.</strong> A-pplication, R-eal-time, M-icrocontroller. Chỉ cần nhớ mỗi chữ cái viết tắt của từ nào là dựng lại được mọi thứ còn lại, vì chính chữ cái ấy LÀ đề bài thiết kế.</li>
<li><strong>Ba họ này chính là các slide trước được biến thành sản phẩm.</strong> Slide 37 chia bộ xử lý thành ứng dụng với chuyên dụng; slide 34 giới thiệu ràng buộc thời gian thực; slide 38 vẽ một con vi điều khiển; slide 39 mô tả thiết bị nhúng sâu. ARM bán đúng một dòng sản phẩm cho mỗi khái niệm. Đây là lúc tốt để tự kiểm xem bạn còn phát biểu lại được từng khái niệm mà không cần nhìn lại hay không.</li>
<li><strong>Vì sao chỉ có họ M được liệt kê.</strong> Chương này nói về hệ nhúng, mà M là dòng nhúng — những linh kiện đi vào hàng tỉ thiết bị mà slide 34 đã đếm. Họ A và họ R không hề kém thật (có rất nhiều lõi Cortex-A và Cortex-R); slide đơn giản là không cần tới chúng ở đây.</li>
<li><strong>Đọc chính danh sách M</strong> — các con số xếp theo năng lực chứ không theo thời gian ra đời: M0 và M0+ nhỏ nhất và rẻ nhất, M3 là con tầm trung kinh điển được vẽ ở Figure 1.15 slide sau, M4 thêm lệnh xử lý tín hiệu số, M7 nhanh nhất trong dòng kinh điển, còn M23/M33 bổ sung tính năng bảo mật TrustZone cho vi điều khiển. Không ai bắt bạn thuộc danh sách này; điều cần nhận ra là MỘT họ trải được một dải năng lực rất rộng.</li>
<li><strong>Cùng kiến trúc, nhiều tổ chức — lại một lần nữa.</strong> Cả ba họ cùng chung dòng dõi tập lệnh ARM, nên kiến thức chuyển được qua lại; thứ thay đổi là những gì được dựng quanh cái lõi. Đây là slide 2 lần thứ ba trong chương này, và là ý mà đề thi thưởng điểm đều đặn nhất.</li>
</ul>
<p class="pitfall">⚠️ Đồ hoạ là một <strong>cầu thang ĐI LÊN theo thứ tự A → R → M</strong>, rất dễ khiến người xem tưởng M là cao nhất, tốt nhất, mạnh nhất. Không phải vậy. Ba họ là <em>ba đích ngắm khác nhau</em>, không phải một bảng xếp hạng hiệu năng — xét hiệu năng thô thì thứ tự về cơ bản là NGƯỢC LẠI, với Cortex-A đứng đầu. Hãy coi các bậc thang là trang trí, không phải dữ liệu.</p>`],

      [42, 'Figure 1.15 — Typical Microcontroller Chip Based on Cortex-M3',
        `<p class="y-chinh">🎯 The chapter's closing figure, and it is slide 4's hierarchy drawn three times over: <strong>Microcontroller Chip → Cortex-M3 Processor → Cortex-M3 Core</strong>. Three nested boxes, each one an expansion of a block inside the previous one — exactly the method Figure 1.1 used for COMPUTER → CPU → CONTROL UNIT.</p>
<table>
<tr><th>Level</th><th>What it contains in the figure</th></tr>
<tr><td><strong>Microcontroller Chip</strong></td><td><em>Security:</em> hardware AES · <em>Analog interfaces:</em> A/D and D/A converters · <em>Timers &amp; triggers:</em> peripheral bus interrupt, timer/counter, low energy, real time counter, pulse counter, watchdog timer · <em>Parallel I/O ports:</em> pin reset, general purpose I/O, external interrupts · <em>Serial interfaces:</em> USART, USB, UART, low-energy UART · a <em>peripheral bus</em> and a <em>32-bit bus</em> · <em>Energy management:</em> voltage regulator, voltage comparator, power-on reset, brown-out detector · <em>Clock management:</em> high- and low-frequency RC oscillators, high- and low-frequency crystal oscillators · <em>Core and memory:</em> flash memory 64 kB, SRAM memory 64 kB, debug interface, DMA controller, memory protection unit, the Cortex-M3 processor</td></tr>
<tr><td><strong>Cortex-M3 Processor</strong></td><td>ICode interface · SRAM &amp; peripheral interface · bus matrix · debug logic · DAP · memory protection unit · NVIC · <strong>ARM core</strong> · ETM</td></tr>
<tr><td><strong>Cortex-M3 Core</strong></td><td>NVIC interface · ETM interface · 32-bit ALU containing a hardware divider and a 32-bit multiplier · control logic · Thumb decode · instruction interface · data interface</td></tr>
</table>
<ul>
<li><strong>Read the memory numbers and feel the gap.</strong> This entire chip has <strong>64 kB of flash and 64 kB of SRAM</strong>. The Core i9-7900X on slide 31 carries <strong>14 MB of L3 cache alone</strong> — that is 14 × 1024 ÷ 64 = <strong>224×</strong> more memory in nothing but its cache than this chip has RAM in total. Same chapter, same technology era, two completely different design problems.</li>
<li><strong>Two buses, deliberately.</strong> A fast <em>32-bit bus</em> joins the core, flash, SRAM and DMA; a slower <em>peripheral bus</em> hangs all the timers, ports and serial interfaces off it. Bandwidth is spent where it matters and area is saved where it does not — Chapter 3 studies exactly this kind of decision.</li>
<li><strong>Two kinds of oscillator, twice.</strong> RC oscillators are cheap, start instantly and are imprecise; crystal oscillators are precise, start slowly and cost more power. Having a high- and low-frequency version of each lets the chip run the fast precise clock only when it must and doze on the slow cheap one the rest of the time. This single block is the "extreme power constraints" of slide 39 turned into silicon.</li>
<li><strong>Blocks a PC would not have on the processor at all</strong> — the energy-management group (voltage regulator, brown-out detector, power-on reset) lives on a desktop <em>motherboard</em>, not inside the CPU. Here it is on the die, because there may be no motherboard worth the name.</li>
<li><strong>"Thumb decode" in the core is worth a note.</strong> Thumb is ARM's compressed 16-bit instruction encoding: the same operations in half the space. When your whole program must fit in 64 kB of flash, code density is a first-class design goal — a point Chapters 13 and 17 will make properly.</li>
<li><strong>The debug hardware is drawn, not hidden.</strong> DAP (debug access port), ETM (embedded trace macrocell) and the debug interface exist because of slide 39's "behaviour is difficult to observe". The chip designers put the observability in the silicon, since nothing else can provide it.</li>
</ul>
<p class="pitfall">⚠️ <strong>"Cortex-M3 processor" and "Cortex-M3 core" are not the same box</strong>, and the figure separates them on purpose. The <em>core</em> is the ALU, control logic, decode and interfaces; the <em>processor</em> is that core <em>plus</em> the NVIC interrupt controller, the memory protection unit, the bus matrix and the debug and trace logic wrapped around it. This is precisely the CPU-versus-core vocabulary defined back on slide 9, and confusing the two levels is the easiest mark to lose on this figure.</p>`,
        `<p class="y-chinh">🎯 Hình khép lại chương, và nó chính là phân cấp của slide 4 được vẽ ba lần chồng lên nhau: <strong>Con chip vi điều khiển → Bộ xử lý Cortex-M3 → Lõi Cortex-M3</strong>. Ba khung lồng nhau, mỗi khung là phần phóng to của một khối bên trong khung trước — đúng phương pháp mà Figure 1.1 đã dùng cho COMPUTER → CPU → CONTROL UNIT.</p>
<table>
<tr><th>Mức</th><th>Trong hình có những gì</th></tr>
<tr><td><strong>Con chip vi điều khiển</strong></td><td><em>Bảo mật:</em> AES bằng phần cứng · <em>Giao tiếp tương tự:</em> bộ chuyển A/D và D/A · <em>Định thời &amp; kích hoạt:</em> ngắt bus ngoại vi, bộ định thời/đếm, khối tiết kiệm điện, bộ đếm thời gian thực, bộ đếm xung, bộ định thời giám sát (watchdog) · <em>Cổng I/O song song:</em> chân reset, I/O đa dụng, ngắt ngoài · <em>Giao tiếp nối tiếp:</em> USART, USB, UART, UART tiết kiệm điện · một <em>bus ngoại vi</em> và một <em>bus 32 bit</em> · <em>Quản lý năng lượng:</em> bộ ổn áp, bộ so sánh điện áp, reset khi cấp nguồn, bộ phát hiện sụt áp · <em>Quản lý xung nhịp:</em> dao động RC tần số cao và thấp, dao động thạch anh tần số cao và thấp · <em>Lõi và bộ nhớ:</em> flash 64 kB, SRAM 64 kB, giao diện gỡ lỗi, bộ điều khiển DMA, khối bảo vệ bộ nhớ, bộ xử lý Cortex-M3</td></tr>
<tr><td><strong>Bộ xử lý Cortex-M3</strong></td><td>Giao diện ICode · giao diện SRAM &amp; ngoại vi · ma trận bus · logic gỡ lỗi · DAP · khối bảo vệ bộ nhớ · NVIC · <strong>lõi ARM</strong> · ETM</td></tr>
<tr><td><strong>Lõi Cortex-M3</strong></td><td>Giao diện NVIC · giao diện ETM · ALU 32 bit chứa bộ chia phần cứng và bộ nhân 32 bit · logic điều khiển · giải mã Thumb · giao diện lệnh · giao diện dữ liệu</td></tr>
</table>
<ul>
<li><strong>Đọc con số bộ nhớ và cảm nhận khoảng cách.</strong> Cả con chip này có <strong>64 kB flash và 64 kB SRAM</strong>. Con Core i9-7900X ở slide 31 mang <strong>riêng 14 MB cache L3</strong> — tức là 14 × 1024 ÷ 64 = <strong>gấp 224 lần</strong> lượng bộ nhớ, chỉ tính phần cache của nó, so với TOÀN BỘ RAM của con chip này. Cùng một chương, cùng một thời kỳ công nghệ, hai bài toán thiết kế khác hẳn nhau.</li>
<li><strong>Hai bus, có chủ ý.</strong> Một <em>bus 32 bit</em> nhanh nối lõi, flash, SRAM và DMA; một <em>bus ngoại vi</em> chậm hơn treo toàn bộ bộ định thời, cổng và giao tiếp nối tiếp vào đó. Băng thông được tiêu ở chỗ đáng tiêu còn diện tích được tiết kiệm ở chỗ không cần — Chương 3 nghiên cứu đúng loại quyết định này.</li>
<li><strong>Hai loại bộ dao động, mỗi loại hai bản.</strong> Dao động RC thì rẻ, khởi động tức thì, nhưng không chính xác; dao động thạch anh thì chính xác, khởi động chậm và tốn điện hơn. Có cả bản tần số cao lẫn tần số thấp của mỗi loại giúp con chip chỉ chạy đồng hồ nhanh và chính xác khi buộc phải, còn lại thì lim dim trên đồng hồ chậm và rẻ. Riêng khối này là "ràng buộc điện cực gắt" của slide 39 được đúc thành silic.</li>
<li><strong>Có những khối mà PC không hề đặt trong bộ xử lý</strong> — nhóm quản lý năng lượng (ổn áp, phát hiện sụt áp, reset khi cấp nguồn) trên máy để bàn nằm ở <em>bo mạch chủ</em>, không nằm trong CPU. Ở đây nó nằm ngay trên die, vì có khi chẳng có cái bo mạch chủ nào đáng gọi tên.</li>
<li><strong>Khối "Thumb decode" trong lõi đáng ghi chú.</strong> Thumb là kiểu mã hoá lệnh nén 16 bit của ARM: cùng những thao tác ấy nhưng tốn nửa chỗ. Khi cả chương trình của bạn phải nằm vừa trong 64 kB flash thì MẬT ĐỘ MÃ là một mục tiêu thiết kế hạng nhất — điều Chương 13 và Chương 17 sẽ nói cho ra đầu ra đũa.</li>
<li><strong>Phần cứng gỡ lỗi được VẼ RA, không bị giấu.</strong> DAP (cổng truy cập gỡ lỗi), ETM (khối truy vết nhúng) và giao diện gỡ lỗi tồn tại chính vì câu "hành vi khó quan sát" ở slide 39. Người thiết kế chip đặt khả năng quan sát vào trong silic, vì không còn chỗ nào khác cung cấp được nó.</li>
</ul>
<p class="pitfall">⚠️ <strong>"Bộ xử lý Cortex-M3" và "lõi Cortex-M3" KHÔNG phải cùng một cái hộp</strong>, và hình cố ý tách chúng ra. <em>Lõi</em> là ALU, logic điều khiển, bộ giải mã và các giao diện; <em>bộ xử lý</em> là cái lõi ấy <em>cộng thêm</em> bộ điều khiển ngắt NVIC, khối bảo vệ bộ nhớ, ma trận bus cùng logic gỡ lỗi và truy vết bọc quanh nó. Đây đúng là bộ từ vựng CPU–lõi đã định nghĩa từ slide 9, và lẫn hai mức này là cách mất điểm dễ nhất ở hình này.</p>`],

      [43, 'Summary — Chapter 1: Basic Concepts and Computer Evolution',
        `<p class="y-chinh">🎯 The closing checklist. Use it as a self-test: cover the right-hand column and try to answer each item in one sentence. If you cannot, the slide number tells you exactly where to go back to.</p>
<table>
<tr><th>Summary item</th><th>One-sentence answer</th><th>Slides</th></tr>
<tr><td>Organization and architecture</td><td>Architecture = attributes visible to the programmer with direct impact on logical execution; organization = the operational units and interconnections that realize them.</td><td>2–3</td></tr>
<tr><td>Structure and function</td><td>Structure = how components relate; function = what each does. Four functions (process, store, move, control), four components (CPU, memory, I/O, interconnection).</td><td>4–8</td></tr>
<tr><td>The IAS computer</td><td>Von Neumann's stored-program machine, 1952, 40-bit words, 21 instructions, the prototype of every later general-purpose computer.</td><td>14–20</td></tr>
<tr><td>Gates, memory cells, chips, multichip modules</td><td>Gates process, memory cells store; both are etched on a wafer, diced into chips, and several bare chips can share one MCM package.</td><td>21–27</td></tr>
<tr><td>Evolution of the Intel x86 architecture</td><td>4004 (1971, 2,300 transistors) to Core i9-7900X (2017, 7.2 billion, 10 cores) — one architecture, endlessly re-organized.</td><td>28–33</td></tr>
<tr><td>Embedded systems · IoT · embedded OS · application vs dedicated processors · microprocessor vs microcontroller · embedded vs deeply embedded</td><td>Computing inside products rather than as products, with real-time constraints; the IoT is the fourth deployment generation; a microcontroller is a whole small computer on one chip.</td><td>34–39</td></tr>
<tr><td>ARM architecture · ARM evolution · instruction set architecture · ARM products</td><td>RISC-derived, licensed rather than manufactured, the most widely used architecture in the world; Cortex-A / R / M for application, real-time and microcontroller roles.</td><td>40–42</td></tr>
</table>
<ul>
<li><strong>The three numbers worth carrying out of this chapter.</strong> (1) The real doubling rate of transistor count is about <strong>2.1 years</strong>, not 18 months — computed four separate ways on slides 25, 28, 29, 30 and 31. (2) From 1999 to 2017, transistors rose <strong>758×</strong> while clock speed rose only <strong>9.6×</strong>. (3) Cores went <strong>1 → 10</strong> in the same table. Those three facts explain the syllabus of the rest of the course.</li>
<li><strong>The one sentence that ties the chapter together.</strong> Physics stopped giving away speed, so architects started buying performance with <em>parallelism</em> (more cores, more instructions at once, more data per instruction) and with <em>locality</em> (caches). Everything from Chapter 4 to Chapter 21 is one of those two purchases.</li>
<li><strong>How this differs from what CSI106 taught you.</strong> CSI106 named the generations and the von Neumann parts. CEA201 hands you the measurements and asks you to compute the trend, spot when a published claim does not match its own data, and explain the physical reason behind each turn. Naming earns few marks here; explaining and calculating earn most of them.</li>
<li><strong>What comes immediately next.</strong> Chapter 2 (deck CEA2) makes performance quantitative: clock rate, cycles per instruction, MIPS, benchmarks and Amdahl's law — the tools to say <em>how much</em> faster, instead of just "faster". Chapter 3 then opens the top-level structure and the buses that connect it.</li>
</ul>
<p class="pitfall">⚠️ Two items on this summary list — <strong>"ARM evolution"</strong> and <strong>"Instruction set architecture"</strong> — have no slides of their own in this 11th-edition deck; they are sections of the <em>book</em> chapter. Do not assume your handout is missing pages, and do read those two sections in the textbook, because a summary slide is a fair source of exam questions even where the deck is silent.</p>`,
        `<p class="y-chinh">🎯 Danh sách kiểm khép chương. Hãy dùng nó để tự kiểm: che cột bên phải lại và thử trả lời từng mục bằng một câu. Không trả lời được thì số slide bên cạnh chỉ đúng chỗ cần quay lại.</p>
<table>
<tr><th>Mục trong phần tóm tắt</th><th>Câu trả lời một dòng</th><th>Slide</th></tr>
<tr><td>Kiến trúc và tổ chức</td><td>Kiến trúc = thuộc tính lập trình viên nhìn thấy, tác động trực tiếp tới việc thi hành logic; tổ chức = các khối chức năng và liên kết hiện thực hoá chúng.</td><td>2–3</td></tr>
<tr><td>Cấu trúc và chức năng</td><td>Cấu trúc = các thành phần quan hệ với nhau ra sao; chức năng = mỗi thành phần làm gì. Bốn chức năng (xử lý, lưu trữ, di chuyển, điều khiển), bốn thành phần (CPU, bộ nhớ, I/O, liên kết).</td><td>4–8</td></tr>
<tr><td>Máy tính IAS</td><td>Cỗ máy chương trình lưu trữ của von Neumann, 1952, từ nhớ 40 bit, 21 lệnh, nguyên mẫu của mọi máy tính đa dụng về sau.</td><td>14–20</td></tr>
<tr><td>Cổng logic, ô nhớ, chip và module đa chip</td><td>Cổng xử lý, ô nhớ lưu trữ; cả hai được khắc lên wafer, cắt thành chip, và vài chip trần có thể chung một vỏ MCM.</td><td>21–27</td></tr>
<tr><td>Tiến hoá kiến trúc x86 của Intel</td><td>Từ 4004 (1971, 2.300 transistor) tới Core i9-7900X (2017, 7,2 tỉ, 10 lõi) — một kiến trúc, tổ chức lại không biết bao nhiêu lần.</td><td>28–33</td></tr>
<tr><td>Hệ nhúng · IoT · HĐH nhúng · bộ xử lý ứng dụng và chuyên dụng · vi xử lý và vi điều khiển · nhúng và nhúng sâu</td><td>Tính toán nằm BÊN TRONG sản phẩm chứ không phải là sản phẩm, kèm ràng buộc thời gian thực; IoT là thế hệ triển khai thứ tư; vi điều khiển là cả một máy tính nhỏ trên một con chip.</td><td>34–39</td></tr>
<tr><td>Kiến trúc ARM · tiến hoá ARM · kiến trúc tập lệnh · sản phẩm ARM</td><td>Bắt nguồn từ RISC, bán giấy phép chứ không tự sản xuất, là kiến trúc được dùng rộng rãi nhất thế giới; Cortex-A / R / M cho ba vai trò ứng dụng, thời gian thực và vi điều khiển.</td><td>40–42</td></tr>
</table>
<ul>
<li><strong>Ba con số đáng mang ra khỏi chương này.</strong> (1) Nhịp gấp đôi thật của số transistor là khoảng <strong>2,1 năm</strong>, không phải 18 tháng — đã tính bằng bốn cách độc lập ở slide 25, 28, 29, 30 và 31. (2) Từ 1999 tới 2017, transistor tăng <strong>758 lần</strong> trong khi xung nhịp chỉ tăng <strong>9,6 lần</strong>. (3) Số lõi đi từ <strong>1 lên 10</strong> trong cùng bảng ấy. Ba dữ kiện đó giải thích toàn bộ đề cương phần còn lại của môn học.</li>
<li><strong>Một câu buộc cả chương lại với nhau.</strong> Vật lý thôi cho không tốc độ, nên người thiết kế bắt đầu MUA hiệu năng bằng <em>song song</em> (nhiều lõi hơn, nhiều lệnh cùng lúc hơn, nhiều dữ liệu trên mỗi lệnh hơn) và bằng <em>tính cục bộ</em> (cache). Mọi thứ từ Chương 4 tới Chương 21 đều là một trong hai món hàng đó.</li>
<li><strong>Khác gì với thứ CSI106 đã dạy bạn.</strong> CSI106 gọi tên các thế hệ và các bộ phận von Neumann. CEA201 đưa cho bạn số đo và bắt bạn tính ra xu hướng, phát hiện chỗ một khẳng định in trên slide không khớp với chính số liệu của nó, và giải thích nguyên nhân vật lý sau mỗi khúc ngoặt. Gọi tên ở đây được ít điểm; giải thích và tính toán mới được phần lớn điểm.</li>
<li><strong>Ngay sau đây là gì.</strong> Chương 2 (deck CEA2) biến hiệu năng thành định lượng: tần số xung nhịp, số chu kỳ trên mỗi lệnh (CPI), MIPS, các bộ đo chuẩn và định luật Amdahl — bộ công cụ để nói <em>nhanh hơn BAO NHIÊU</em> thay vì chỉ nói "nhanh hơn". Rồi Chương 3 mở ra cấu trúc tổng thể và các bus nối chúng lại.</li>
</ul>
<p class="pitfall">⚠️ Hai mục trong danh sách tóm tắt này — <strong>"ARM evolution"</strong> và <strong>"Instruction set architecture"</strong> — KHÔNG có slide riêng nào trong bộ 11th ed; chúng là các mục trong <em>SÁCH</em>. Đừng nghĩ bản in phát tay của bạn bị thiếu trang, và hãy đọc hai mục đó trong giáo trình, vì slide tóm tắt vẫn là nguồn ra đề chính đáng kể cả ở chỗ bộ slide im lặng.</p>`],

    ]),
  ].join('\n'),
};
