/**
 * CSI106 · Chương 1 — Computer Organization, học theo từng slide: PHẦN B (slide 29–59).
 * Deck 'csi1' (CSI1), 59 slide, ảnh đã render sẵn lên CDN images/academy/CSI106/v1/csi1/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ CSI_01.pptx của trường (/tmp/csi106-text/csi1.txt,
 * slide 29→59). Các slide chỉ có TIÊU ĐỀ + HÌNH (33, 34, 35, 39, 43, 44, 45, 46, 47,
 * 49, 52, 53, 54, 56, 57, 58, 59) đã được đọc THẲNG TỪ ẢNH để lấy đúng nhãn trong
 * sơ đồ — vì file trích chữ chỉ còn lại dòng "Figure 1.xx".
 *
 * Giáo trình gốc: Behrouz Forouzan, "Foundations of Computer Science", chương 5
 * (Computer Organization). Đó là lý do slide 31 ghi "Table 6.1" và slide 32 ghi
 * "Example 5.1 / 5.2" — số hiệu của SÁCH, không phải của chương 1 trong deck.
 *
 * Những chỗ slide gốc lệch với thực tế, đã NÊU RÕ trong bài (không im lặng chép lại,
 * cũng không tự sửa slide):
 *   · slide 45 — "SCSI ... 32 components": không khớp bản SCSI nào (SCSI-1 tối đa 8
 *     thiết bị kể cả controller; Wide SCSI 16). Năm cũng thường được ghi là 1986
 *     (chuẩn ANSI X3.131-1986).
 *   · slide 40 — "SSD đắt gấp 7–8 lần HDD trên mỗi đơn vị dung lượng": số của khoảng
 *     2014. Giá 2026 chênh khoảng 3–4 lần.
 *   · slide 58 — file trích chữ ghi "Figure 1.38 Parallel processing", nhưng ẢNH là
 *     "MISD organization"; slide 59 lại cũng đánh số "Figure 1.38". Deck trùng số hình.
 *   · slide 31 — bảng "Table 6.1" trộn hai hệ đơn vị: cột giữa là 2^10/2^20/2^30/2^40
 *     (chuẩn nhị phân, đúng tên là KiB/MiB/GiB/TiB) còn cột phải là 10^3/10^6/10^9/10^12.
 *     Đây chính là nguồn gốc chuyện ổ "1 TB" hiện ra 931 GB.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'csi1';

export default {
  title: '1.0b — Slide by slide: Main memory, the memory hierarchy, the I/O subsystem, interconnection and different architectures (slides 29–59)|||1.0b — Slide bài giảng: Bộ nhớ chính, phân cấp bộ nhớ, hệ con vào/ra, kết nối hệ con & các kiến trúc (slide 29–59)',
  slug: 'csi106-1-0b-slides-bo-nho-vao-ra',
  type: 'DOCUMENT',
  description: 'Nửa sau chương 1 CSI106 (slide 29–59): bộ nhớ chính và khái niệm không gian địa chỉ (có giải trọn hai Example 5.1 và 5.2 của trường, kèm cách phân biệt KB với KiB — lý do ổ "1 TB" hiện ra 931 GB), các loại bộ nhớ RAM/ROM cùng họ hàng SRAM · DRAM · Flash · PROM · EPROM · EEPROM, phân cấp bộ nhớ và cache với độ trễ đo thật theo chu kỳ, hệ con vào/ra với thiết bị lưu trữ từ · quang · SSD, cách nối CPU với bộ nhớ bằng ba bus và nối thiết bị qua SCSI/FireWire/USB, hai kiểu định địa chỉ vào/ra, rồi khép lại bằng CISC vs RISC (x86-64 vs ARM), pipelining và bốn tổ chức SISD/SIMD/MISD/MIMD của phân loại Flynn.',
  content: [
    walkHead(D, 29, 59),
    walk(D, [

      [29, '6 - MAIN MEMORY',
        `<p class="y-chinh">🎯 A section-divider slide. Part 5 finished the CPU — the thing that <em>does</em> the work. Part 6 turns to main memory — the thing that <em>holds</em> the work, both the program and its data, exactly as the von Neumann model on slide 12 demanded.</p>
<ul>
<li><strong>Why memory comes right after the CPU</strong> — slide 23 split the hardware into three subsystems: CPU, main memory, I/O. We have just done the first. Sections 6, 7 and 8 do the second, the third, and the wiring between all three.</li>
<li><strong>"Main" is a deliberate word</strong> — it means the memory the CPU can address directly, one word at a time, not the disk. A disk is an I/O device (slide 38 will say so explicitly), even though users call both "memory".</li>
<li><strong>What the next six slides must answer</strong> — how a location is named (address), how big the naming scheme can be (address space), what the memory is physically made of (RAM / ROM families), and why one memory is never enough (hierarchy, cache).</li>
<li><strong>The property that defines main memory</strong> — it is <em>volatile</em>: cut the power and it is blank. That single fact is why storage devices exist at all, and it is the sentence slide 38 will use to separate the two.</li>
<li><strong>The number you will meet everywhere</strong> — a modern laptop has 8–32 GB of main memory and a 64-bit CPU, meaning the address space is far larger than the memory actually installed. Sections 6 will show you why that is not a contradiction.</li>
</ul>
<p class="meo">💡 Keep the von Neumann picture (slide 11) open in your head while reading this section: memory is one of the four boxes, and everything here is a zoom-in on that single box.</p>`,
        `<p class="y-chinh">🎯 Một slide phân mục. Phần 5 vừa xong CPU — thứ <em>làm</em> việc. Phần 6 quay sang bộ nhớ chính — thứ <em>giữ</em> việc, giữ cả chương trình lẫn dữ liệu của nó, đúng như mô hình von Neumann ở slide 12 đòi hỏi.</p>
<ul>
<li><strong>Vì sao bộ nhớ đứng ngay sau CPU</strong> — slide 23 đã chia phần cứng làm ba hệ con: CPU, bộ nhớ chính, vào/ra. Ta vừa xong cái thứ nhất. Mục 6, 7 và 8 lần lượt làm cái thứ hai, cái thứ ba, và phần dây nối cả ba lại.</li>
<li><strong>Chữ "chính" (main) là cố ý</strong> — nó chỉ vùng nhớ mà CPU địa chỉ hoá trực tiếp được, từng từ một, chứ không phải đĩa. Đĩa là thiết bị vào/ra (slide 38 sẽ nói thẳng như vậy), dù người dùng quen gọi cả hai là "bộ nhớ".</li>
<li><strong>Sáu slide tới phải trả lời gì</strong> — một ô nhớ được gọi tên thế nào (địa chỉ), cách gọi tên ấy lớn tới đâu (không gian địa chỉ), bộ nhớ làm bằng gì (họ RAM / ROM), và vì sao một loại bộ nhớ không bao giờ đủ (phân cấp, cache).</li>
<li><strong>Tính chất định nghĩa bộ nhớ chính</strong> — nó <em>bay hơi</em> (volatile): cắt điện là trắng trơn. Đúng một sự thật ấy là lý do các thiết bị lưu trữ tồn tại, và là câu slide 38 dùng để tách hai nhóm.</li>
<li><strong>Con số bạn sẽ gặp khắp nơi</strong> — máy tính xách tay hôm nay có 8–32 GB bộ nhớ chính và CPU 64 bit, tức không gian địa chỉ lớn hơn dung lượng thật gắn trong máy rất nhiều lần. Mục 6 sẽ cho thấy vì sao điều đó không hề mâu thuẫn.</li>
</ul>
<p class="meo">💡 Khi đọc mục này hãy mở sẵn bức tranh von Neumann (slide 11) trong đầu: bộ nhớ là một trong bốn ô, và tất cả những gì sắp tới chỉ là phóng to đúng cái ô đó.</p>`],

      [30, 'Introduction',
        `<p class="y-chinh">🎯 Two sentences that carry the whole model of memory: it is <strong>a collection of storage locations, each with a unique identifier called an address</strong>, and data moves in and out <strong>in groups of bits called words</strong>. Figure 1.23 draws it as a two-column table — addresses on the left, contents on the right.</p>
<ul>
<li><strong>Read the figure carefully</strong> — the left column shows <code>0000000000</code>, <code>0000000001</code>, <code>0000000010</code>, … up to <code>1111111111</code>: the addresses, in binary, counting up. The right column shows the 16-bit contents of each location. The address is <em>where</em>, the content is <em>what</em>.</li>
<li><strong>Address and content are different things with the same look</strong> — both are bit patterns, and a beginner confuses them constantly. Location 0 might hold the value <code>0111001011001100</code>; the number 0 is its name, the pattern is its value.</li>
<li><strong>"Unique" is the key adjective</strong> — no two locations share an address, and no location has two addresses. That is exactly the property that makes an address usable as a number in an instruction.</li>
<li><strong>A "word" is not always 8 bits</strong> — the word is the chunk the machine moves per access. In Figure 1.23 it is 16 bits; on a modern 64-bit CPU the natural word is 64 bits (8 bytes), while the <em>addressable unit</em> is still one byte. Slide 32's Example 5.2 lives entirely on this distinction.</li>
<li><strong>Why the whole thing is addressed at all</strong> — the stored-program idea of slide 12 needs the control unit to say "fetch the instruction at 4096". Without addresses there is no fetch-decode-execute cycle.</li>
<li><strong>Today's version of the same picture</strong> — a DDR5 module is this exact table, just with 2^34 rows instead of 2^10, and with electronics that read a whole 64-byte line at a time because moving one word at a time would waste the bus.</li>
</ul>
<p class="meo">💡 Mnemonic for the figure: <em>street numbers on the left, houses on the right</em>. A postman needs the number; the letter inside is the content. You can change the letter; you cannot change the number.</p>`,
        `<p class="y-chinh">🎯 Hai câu chở toàn bộ mô hình bộ nhớ: nó là <strong>một tập các ô nhớ, mỗi ô có một định danh duy nhất gọi là địa chỉ</strong>, và dữ liệu ra vào <strong>theo từng nhóm bit gọi là từ (word)</strong>. Hình 1.23 vẽ nó thành bảng hai cột — địa chỉ bên trái, nội dung bên phải.</p>
<ul>
<li><strong>Hãy đọc kỹ hình</strong> — cột trái là <code>0000000000</code>, <code>0000000001</code>, <code>0000000010</code>, … tới <code>1111111111</code>: các địa chỉ, viết nhị phân, đếm lên. Cột phải là nội dung 16 bit của từng ô. Địa chỉ là <em>ở đâu</em>, nội dung là <em>cái gì</em>.</li>
<li><strong>Địa chỉ và nội dung là hai thứ khác nhau nhưng nhìn giống hệt</strong> — cả hai đều là dãy bit, và người mới học nhầm hai cái này liên tục. Ô số 0 có thể đang chứa giá trị <code>0111001011001100</code>; con số 0 là TÊN của nó, còn dãy bit kia là GIÁ TRỊ.</li>
<li><strong>"Duy nhất" là tính từ mấu chốt</strong> — không hai ô nào chung một địa chỉ, và không ô nào có hai địa chỉ. Chính tính chất đó khiến địa chỉ dùng được như một con số trong lệnh máy.</li>
<li><strong>"Từ" (word) không phải lúc nào cũng 8 bit</strong> — từ là khối mà máy chuyển đi trong một lần truy cập. Trong hình 1.23 nó là 16 bit; trên CPU 64 bit hôm nay, từ tự nhiên là 64 bit (8 byte), còn <em>đơn vị địa chỉ hoá</em> vẫn là một byte. Cả Example 5.2 ở slide 32 sống nhờ đúng chỗ phân biệt này.</li>
<li><strong>Vì sao phải đánh địa chỉ</strong> — ý tưởng chương trình-lưu-trữ ở slide 12 cần khối điều khiển nói được "nạp lệnh ở ô 4096". Không có địa chỉ thì không có chu trình nạp–giải mã–thi hành.</li>
<li><strong>Phiên bản hôm nay của đúng bức hình ấy</strong> — một thanh DDR5 chính là cái bảng này, chỉ khác là có 2^34 dòng thay vì 2^10, và mạch điện đọc trọn một dòng 64 byte mỗi lần vì chuyển từng từ một sẽ phí bus.</li>
</ul>
<p class="meo">💡 Cách nhớ hình: <em>số nhà bên trái, ngôi nhà bên phải</em>. Người đưa thư cần số nhà; lá thư bên trong là nội dung. Thư thì đổi được, số nhà thì không.</p>`],

      [31, 'Address space',
        `<p class="y-chinh">🎯 The definition you will be examined on: <strong>the address space is the total number of uniquely identifiable locations in memory</strong>. The slide's own example: 64 kilobytes with a 1-byte word gives addresses <strong>0 to 65,535</strong>. Table 6.1 supplies the exact powers of two.</p>
<ul>
<li><strong>Check the slide's example yourself</strong> — 64 KB = 64 × 1024 = 65,536 bytes. Word size 1 byte, so 65,536 locations. Numbering from 0 gives 0 … 65,535, and 65,536 = 2^16, so <strong>16 bits</strong> of address. The slide's numbers are right.</li>
<li><strong>Programmers use names, hardware uses numbers</strong> — the first bullet says exactly that. <code>int x;</code> in C is a name; after compilation it is an offset, and at run time it is an address on the address bus of slide 43.</li>
<li><strong>Table 6.1, exactly as printed</strong> — kilobyte = 2^10 = 1,024 bytes ≈ 10^3; megabyte = 2^20 = 1,048,576 ≈ 10^6; gigabyte = 2^30 = 1,073,741,824 ≈ 10^9; terabyte = 2^40 ≈ 10^12. Note the word "Approximation" over the right column: the powers of ten are <em>not</em> the definition here.</li>
<li><strong>The rule that solves every exam question of this type</strong> — <em>n bits of address ⇒ 2^n locations</em>, and going backwards, <em>N locations ⇒ ceil(log2 N) bits</em>. Everything on slide 32 is this one rule applied twice.</li>
<li><strong>Address space is a ceiling, not an inventory</strong> — a 64-bit CPU has an address space of 2^64 = 18.4 quintillion bytes, but your laptop has 16 GB installed. The extra addresses are simply not wired to anything (and in practice x86-64 only implements 48 or 57 of those bits).</li>
</ul>
<table>
<tr><th>Binary unit (IEC)</th><th>Exact</th><th>Decimal unit (SI)</th><th>Exact</th><th>Gap</th></tr>
<tr><td>1 KiB (kibibyte)</td><td>2^10 = 1,024</td><td>1 kB</td><td>10^3 = 1,000</td><td>+2.4%</td></tr>
<tr><td>1 MiB</td><td>2^20 = 1,048,576</td><td>1 MB</td><td>10^6</td><td>+4.9%</td></tr>
<tr><td>1 GiB</td><td>2^30 = 1,073,741,824</td><td>1 GB</td><td>10^9</td><td>+7.4%</td></tr>
<tr><td>1 TiB</td><td>2^40 = 1,099,511,627,776</td><td>1 TB</td><td>10^12</td><td>+10.0%</td></tr>
</table>
<p class="dap-an">✅ This table answers the most famous "bug" in computing: you buy a <strong>1 TB</strong> drive and Windows shows <strong>931 GB</strong>. Nothing is missing. The maker sold 1 TB = 10^12 bytes (SI); Windows divides by 2^30 and labels the result "GB": 10^12 ÷ 1,073,741,824 = <strong>931.3</strong>. Same bytes, two rulers. macOS and Linux (since about 2009) divide by 10^9 instead and show 1.00 TB — which is why the same drive "changes size" when you move it between machines.</p>
<p class="pitfall">⚠️ Exam habit: unless the question says otherwise, in <em>memory</em> questions K/M/G always mean 2^10 / 2^20 / 2^30, because addresses are binary. In <em>network speed</em> and <em>disk capacity</em> questions they mean 10^3 / 10^6 / 10^9. Slide 31's table shows both columns precisely because the textbook wants you to see the two systems side by side.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa sẽ bị hỏi trong bài thi: <strong>không gian địa chỉ là tổng số ô nhớ định danh được duy nhất trong bộ nhớ</strong>. Ví dụ của chính slide: 64 kilobyte với từ dài 1 byte cho dải địa chỉ <strong>0 tới 65.535</strong>. Bảng 6.1 cung cấp luỹ thừa 2 chính xác.</p>
<ul>
<li><strong>Tự kiểm ví dụ của slide</strong> — 64 KB = 64 × 1024 = 65.536 byte. Từ dài 1 byte nên có 65.536 ô. Đánh số từ 0 được 0 … 65.535, mà 65.536 = 2^16, vậy cần <strong>16 bit</strong> địa chỉ. Số của slide đúng.</li>
<li><strong>Lập trình viên dùng TÊN, phần cứng dùng SỐ</strong> — gạch đầu dòng thứ nhất nói đúng điều đó. <code>int x;</code> trong C là một cái tên; sau khi biên dịch nó thành một độ dời, và lúc chạy nó là một địa chỉ trên bus địa chỉ ở slide 43.</li>
<li><strong>Bảng 6.1, đúng như in trên slide</strong> — kilobyte = 2^10 = 1.024 byte ≈ 10^3; megabyte = 2^20 = 1.048.576 ≈ 10^6; gigabyte = 2^30 = 1.073.741.824 ≈ 10^9; terabyte = 2^40 ≈ 10^12. Để ý chữ "Approximation" (xấp xỉ) trên cột phải: luỹ thừa 10 ở đây KHÔNG phải định nghĩa.</li>
<li><strong>Quy tắc giải mọi câu hỏi dạng này</strong> — <em>n bit địa chỉ ⇒ 2^n ô</em>, và ngược lại <em>N ô ⇒ cần trần(log2 N) bit</em>. Toàn bộ slide 32 chỉ là quy tắc này dùng hai lần.</li>
<li><strong>Không gian địa chỉ là TRẦN, không phải kiểm kê</strong> — CPU 64 bit có không gian địa chỉ 2^64 = 18,4 tỷ tỷ byte, nhưng máy bạn cắm 16 GB. Những địa chỉ thừa đơn giản là không nối vào đâu cả (và thực tế x86-64 chỉ hiện thực 48 hoặc 57 bit trong số đó).</li>
</ul>
<table>
<tr><th>Đơn vị nhị phân (IEC)</th><th>Chính xác</th><th>Đơn vị thập phân (SI)</th><th>Chính xác</th><th>Chênh</th></tr>
<tr><td>1 KiB (kibibyte)</td><td>2^10 = 1.024</td><td>1 kB</td><td>10^3 = 1.000</td><td>+2,4%</td></tr>
<tr><td>1 MiB</td><td>2^20 = 1.048.576</td><td>1 MB</td><td>10^6</td><td>+4,9%</td></tr>
<tr><td>1 GiB</td><td>2^30 = 1.073.741.824</td><td>1 GB</td><td>10^9</td><td>+7,4%</td></tr>
<tr><td>1 TiB</td><td>2^40 = 1.099.511.627.776</td><td>1 TB</td><td>10^12</td><td>+10,0%</td></tr>
</table>
<p class="dap-an">✅ Bảng này trả lời "lỗi" nổi tiếng nhất của ngành máy tính: bạn mua ổ <strong>1 TB</strong> mà Windows hiện <strong>931 GB</strong>. Không mất byte nào cả. Hãng bán 1 TB = 10^12 byte (chuẩn SI); Windows chia cho 2^30 rồi vẫn ghi nhãn "GB": 10^12 ÷ 1.073.741.824 = <strong>931,3</strong>. Cùng số byte, hai cây thước. macOS và Linux (từ khoảng 2009) chia cho 10^9 nên hiện 1,00 TB — vì vậy cùng một cái ổ lại "đổi dung lượng" khi cắm sang máy khác.</p>
<p class="pitfall">⚠️ Thói quen làm bài: trừ khi đề nói khác, trong câu hỏi về <em>bộ nhớ</em> thì K/M/G luôn là 2^10 / 2^20 / 2^30, vì địa chỉ là nhị phân. Trong câu hỏi về <em>tốc độ mạng</em> và <em>dung lượng đĩa</em> thì chúng là 10^3 / 10^6 / 10^9. Bảng ở slide 31 in cả hai cột chính là vì sách muốn bạn nhìn thấy hai hệ đặt cạnh nhau.</p>`],

      [32, 'Examples',
        `<p class="y-chinh">🎯 Two worked problems from Forouzan, both applications of one rule — <em>number of address bits = log2(number of addressable units)</em>. Example 5.1 addresses <strong>bytes</strong>; Example 5.2 addresses <strong>words</strong>, and that single word is the whole difficulty.</p>
<ul>
<li><strong>Example 5.1 asked</strong> — "A computer has 32 MB of memory. How many bits are needed to address any single byte in memory?"</li>
<li><strong>Step 1 — turn MB into a power of two</strong>: 32 MB = 32 × 2^20 = 2^5 × 2^20 = <strong>2^25</strong> bytes = 33,554,432 bytes.</li>
<li><strong>Step 2 — one address per byte</strong>: there are 2^25 addressable units, so we need log2(2^25) = <strong>25 bits</strong>. Addresses run 0 … 33,554,431.</li>
<li><strong>Example 5.2 asked</strong> — "A computer has 128 MB of memory. Each word in this computer is eight bytes. How many bits are needed to address any single word?"</li>
<li><strong>Step 1</strong>: 128 MB = 2^7 × 2^20 = <strong>2^27</strong> bytes. <strong>Step 2</strong>: one word = 8 bytes = 2^3 bytes, so the number of words is 2^27 ÷ 2^3 = <strong>2^24</strong> = 16,777,216 words. <strong>Step 3</strong>: log2(2^24) = <strong>24 bits</strong>.</li>
<li><strong>Read the OCR carefully</strong> — the extracted text shows "225", "220", "227", "224" because the superscripts were flattened. They are 2^25, 2^20, 2^27, 2^24. Always restore the exponent before you compute.</li>
</ul>
<p class="dap-an">✅ Example 5.1 = <strong>25 bits</strong>. Example 5.2 = <strong>24 bits</strong>. Cross-check on 5.2: 24 bits of address × 8-byte words = 2^24 × 2^3 = 2^27 bytes = 128 MB ✓. Note the pleasing consequence: making the word 8× bigger saves exactly 3 address bits, because 8 = 2^3.</p>
<table>
<tr><th>Problem</th><th>Total size</th><th>Addressable unit</th><th>Locations</th><th>Bits</th></tr>
<tr><td>Example 5.1</td><td>32 MB = 2^25 B</td><td>1 byte = 2^0 B</td><td>2^25</td><td>25</td></tr>
<tr><td>Example 5.2</td><td>128 MB = 2^27 B</td><td>8 bytes = 2^3 B</td><td>2^24</td><td>24</td></tr>
<tr><td>Practice A</td><td>4 GB = 2^32 B</td><td>1 byte</td><td>2^32</td><td>32</td></tr>
<tr><td>Practice B</td><td>4 GB = 2^32 B</td><td>4 bytes = 2^2 B</td><td>2^30</td><td>30</td></tr>
<tr><td>Practice C</td><td>1 TB = 2^40 B</td><td>1 byte</td><td>2^40</td><td>40</td></tr>
</table>
<p class="meo">💡 Do it as subtraction of exponents, never as division of big numbers: <em>bits = log2(total bytes) − log2(bytes per word)</em>. Example 5.2 is just 27 − 3 = 24, done in one second. And 2^32 bytes = 4,294,967,296 = 4 GiB is worth memorising: it is exactly why a 32-bit Windows could never use more than 4 GB of RAM.</p>`,
        `<p class="y-chinh">🎯 Hai bài giải mẫu lấy từ Forouzan, cả hai đều áp dụng một quy tắc — <em>số bit địa chỉ = log2(số đơn vị địa chỉ hoá được)</em>. Ví dụ 5.1 đánh địa chỉ theo <strong>byte</strong>; ví dụ 5.2 đánh địa chỉ theo <strong>từ</strong>, và đúng một chữ đó là toàn bộ chỗ khó.</p>
<ul>
<li><strong>Ví dụ 5.1 hỏi</strong> — "Một máy tính có 32 MB bộ nhớ. Cần bao nhiêu bit để đánh địa chỉ bất kỳ byte nào?"</li>
<li><strong>Bước 1 — đổi MB về luỹ thừa 2</strong>: 32 MB = 32 × 2^20 = 2^5 × 2^20 = <strong>2^25</strong> byte = 33.554.432 byte.</li>
<li><strong>Bước 2 — mỗi byte một địa chỉ</strong>: có 2^25 đơn vị địa chỉ hoá, nên cần log2(2^25) = <strong>25 bit</strong>. Địa chỉ chạy 0 … 33.554.431.</li>
<li><strong>Ví dụ 5.2 hỏi</strong> — "Một máy tính có 128 MB bộ nhớ. Mỗi từ dài tám byte. Cần bao nhiêu bit để đánh địa chỉ bất kỳ từ nào?"</li>
<li><strong>Bước 1</strong>: 128 MB = 2^7 × 2^20 = <strong>2^27</strong> byte. <strong>Bước 2</strong>: một từ = 8 byte = 2^3 byte, nên số từ là 2^27 ÷ 2^3 = <strong>2^24</strong> = 16.777.216 từ. <strong>Bước 3</strong>: log2(2^24) = <strong>24 bit</strong>.</li>
<li><strong>Đọc kỹ phần trích chữ</strong> — bản trích hiện ra "225", "220", "227", "224" vì số mũ bị làm phẳng khi xuất chữ. Thực chất là 2^25, 2^20, 2^27, 2^24. Luôn phục hồi số mũ trước khi tính.</li>
</ul>
<p class="dap-an">✅ Ví dụ 5.1 = <strong>25 bit</strong>. Ví dụ 5.2 = <strong>24 bit</strong>. Thử lại bài 5.2: 24 bit địa chỉ × từ 8 byte = 2^24 × 2^3 = 2^27 byte = 128 MB ✓. Để ý hệ quả đẹp: làm cho từ to gấp 8 lần thì tiết kiệm đúng 3 bit địa chỉ, vì 8 = 2^3.</p>
<table>
<tr><th>Bài</th><th>Tổng dung lượng</th><th>Đơn vị địa chỉ hoá</th><th>Số ô</th><th>Số bit</th></tr>
<tr><td>Ví dụ 5.1</td><td>32 MB = 2^25 B</td><td>1 byte = 2^0 B</td><td>2^25</td><td>25</td></tr>
<tr><td>Ví dụ 5.2</td><td>128 MB = 2^27 B</td><td>8 byte = 2^3 B</td><td>2^24</td><td>24</td></tr>
<tr><td>Tự luyện A</td><td>4 GB = 2^32 B</td><td>1 byte</td><td>2^32</td><td>32</td></tr>
<tr><td>Tự luyện B</td><td>4 GB = 2^32 B</td><td>4 byte = 2^2 B</td><td>2^30</td><td>30</td></tr>
<tr><td>Tự luyện C</td><td>1 TB = 2^40 B</td><td>1 byte</td><td>2^40</td><td>40</td></tr>
</table>
<p class="meo">💡 Hãy làm bằng phép TRỪ SỐ MŨ, đừng chia số lớn: <em>số bit = log2(tổng byte) − log2(byte mỗi từ)</em>. Ví dụ 5.2 chỉ là 27 − 3 = 24, xong trong một giây. Và nên thuộc 2^32 byte = 4.294.967.296 = 4 GiB: đó chính xác là lý do Windows 32 bit không bao giờ dùng nổi quá 4 GB RAM.</p>`],

      [33, 'Memory types',
        `<p class="y-chinh">🎯 The family tree of memory chips: <strong>two main types, RAM and ROM</strong>, each with the sub-types the slide boxes in green — RAM splits into <strong>SRAM</strong>, <strong>DRAM</strong> (e.g. DDR SDRAM) and <strong>NAND-based Flash RAM</strong>; ROM splits into <strong>PROM</strong>, <strong>EPROM</strong> and <strong>EEPROM</strong>.</p>
<ul>
<li><strong>"Random access" does not mean "random"</strong> — it means every location costs the <em>same</em> time to reach, whatever its address. The opposite is sequential access (magnetic tape), where reaching the end means winding through everything before it.</li>
<li><strong>SRAM — static</strong>: each bit is a small flip-flop of about 6 transistors. It holds its value as long as power is on, needs no refresh, and is the fastest. It is also the biggest and most expensive per bit, which is why it is used only for caches and registers (slide 35).</li>
<li><strong>DRAM — dynamic</strong>: each bit is one transistor plus one tiny capacitor. The charge leaks away in milliseconds, so the controller must <em>refresh</em> every row thousands of times a second — hence "dynamic". It is dense and cheap, so it is what the RAM sticks in your machine are made of (DDR4/DDR5 SDRAM).</li>
<li><strong>NAND Flash sits oddly in the RAM box</strong> — the slide places it there, but note that flash is <em>non-volatile</em>: it keeps data with the power off. That is exactly the property slide 40 needs for the SSD. Most textbooks place flash as a modern descendant of EEPROM rather than of RAM.</li>
<li><strong>The ROM ladder is a story about erasing</strong> — plain ROM is written once at the factory; PROM is written once by the buyer; EPROM is erased in bulk by ultraviolet light through a quartz window; EEPROM is erased electrically, byte by byte, in place.</li>
<li><strong>Where you meet ROM today</strong> — the UEFI/BIOS firmware of a PC and the bootloader of a phone live in flash (an EEPROM descendant), which is why a BIOS "update" is possible at all; a true ROM could never be updated.</li>
</ul>
<table>
<tr><th>Type</th><th>Volatile?</th><th>Writable?</th><th>Erased by</th><th>Where you meet it today</th></tr>
<tr><td>SRAM</td><td>✅ yes</td><td>✅ freely</td><td>—</td><td>L1/L2/L3 cache, registers</td></tr>
<tr><td>DRAM (DDR SDRAM)</td><td>✅ yes</td><td>✅ freely</td><td>—</td><td>Main RAM, 8–64 GB</td></tr>
<tr><td>NAND Flash</td><td>❌ no</td><td>✅ by block</td><td>electrically, by block</td><td>SSD, memory cards, USB sticks</td></tr>
<tr><td>ROM</td><td>❌ no</td><td>❌ (written at the factory)</td><td>cannot be erased</td><td>Cheap embedded parts</td></tr>
<tr><td>PROM</td><td>❌ no</td><td>once only</td><td>cannot be erased</td><td>Fixed configuration data</td></tr>
<tr><td>EPROM</td><td>❌ no</td><td>✅ rewritable</td><td>ultraviolet light (~20 min)</td><td>Practically extinct</td></tr>
<tr><td>EEPROM</td><td>❌ no</td><td>✅ rewritable</td><td>electrically, byte by byte</td><td>BIOS/UEFI, microcontrollers</td></tr>
</table>
<p class="meo">💡 Remember the ROM ladder from its own letters: <em>ROM</em> → add <em>P</em>rogrammable (writable once) → add <em>E</em>rasable (erasable, by UV) → add <em>E</em>lectrically (erased by electricity). Every letter added is one more step of "easier to change".</p>`,
        `<p class="y-chinh">🎯 Cây phả hệ của chip nhớ: <strong>hai loại chính, RAM và ROM</strong>, mỗi loại có các nhánh con mà slide đóng khung xanh — RAM chia thành <strong>SRAM</strong>, <strong>DRAM</strong> (ví dụ DDR SDRAM) và <strong>NAND-based Flash RAM</strong>; ROM chia thành <strong>PROM</strong>, <strong>EPROM</strong> và <strong>EEPROM</strong>.</p>
<ul>
<li><strong>"Truy cập ngẫu nhiên" không có nghĩa là "hú hoạ"</strong> — nó nghĩa là mọi ô đều tốn thời gian NHƯ NHAU để với tới, bất kể địa chỉ nào. Đối lập với nó là truy cập tuần tự (băng từ), muốn tới cuối băng thì phải quay qua hết phần đầu.</li>
<li><strong>SRAM — tĩnh</strong>: mỗi bit là một mạch lật (flip-flop) chừng 6 transistor. Có điện là nó giữ giá trị, không cần làm tươi, và nhanh nhất. Đổi lại nó to nhất và đắt nhất trên mỗi bit, nên chỉ dùng cho cache và thanh ghi (slide 35).</li>
<li><strong>DRAM — động</strong>: mỗi bit là một transistor cộng một tụ điện tí hon. Điện tích rò hết trong vài mili giây, nên bộ điều khiển phải <em>làm tươi</em> (refresh) từng hàng hàng nghìn lần mỗi giây — vì thế mới gọi là "động". Nó dày đặc và rẻ, nên thanh RAM cắm trong máy bạn làm bằng chính nó (DDR4/DDR5 SDRAM).</li>
<li><strong>NAND Flash nằm hơi lạ trong khung RAM</strong> — slide xếp nó ở đó, nhưng hãy nhớ flash <em>không bay hơi</em>: mất điện vẫn giữ dữ liệu. Đó đúng là tính chất slide 40 cần cho SSD. Đa số sách xếp flash là hậu duệ hiện đại của EEPROM chứ không phải của RAM.</li>
<li><strong>Thang ROM là câu chuyện về chuyện XOÁ</strong> — ROM thuần được ghi một lần ở nhà máy; PROM do người mua ghi một lần; EPROM xoá cả khối bằng tia cực tím chiếu qua cửa sổ thạch anh; EEPROM xoá bằng điện, từng byte, ngay tại chỗ.</li>
<li><strong>Hôm nay gặp ROM ở đâu</strong> — firmware UEFI/BIOS của máy tính và bootloader của điện thoại nằm trong flash (hậu duệ EEPROM), đó chính là lý do "cập nhật BIOS" tồn tại được; ROM thật thì không bao giờ cập nhật nổi.</li>
</ul>
<table>
<tr><th>Loại</th><th>Bay hơi?</th><th>Ghi được?</th><th>Xoá bằng</th><th>Dùng ở đâu hôm nay</th></tr>
<tr><td>SRAM</td><td>✅ có</td><td>✅ tự do</td><td>—</td><td>Cache L1/L2/L3, thanh ghi</td></tr>
<tr><td>DRAM (DDR SDRAM)</td><td>✅ có</td><td>✅ tự do</td><td>—</td><td>RAM chính 8–64 GB</td></tr>
<tr><td>NAND Flash</td><td>❌ không</td><td>✅ theo khối</td><td>điện, theo khối</td><td>SSD, thẻ nhớ, USB</td></tr>
<tr><td>ROM</td><td>❌ không</td><td>❌ (nhà máy ghi)</td><td>không xoá được</td><td>Mạch nhúng giá rẻ</td></tr>
<tr><td>PROM</td><td>❌ không</td><td>một lần duy nhất</td><td>không xoá được</td><td>Nạp cấu hình cố định</td></tr>
<tr><td>EPROM</td><td>❌ không</td><td>✅ ghi lại được</td><td>tia cực tím (~20 phút)</td><td>Gần như tuyệt chủng</td></tr>
<tr><td>EEPROM</td><td>❌ không</td><td>✅ ghi lại được</td><td>điện, từng byte</td><td>BIOS/UEFI, vi điều khiển</td></tr>
</table>
<p class="pitfall">⚠️ Bẫy thi kinh điển: "RAM nhanh hơn ROM" là câu SAI ở dạng tổng quát. Chữ RAM/ROM nói về CÁCH GHI và tính bay hơi, không nói về tốc độ. Thứ tự đúng để trả lời là: SRAM nhanh hơn DRAM, DRAM nhanh hơn Flash, và cả ba đều nhanh hơn đĩa.</p>`],

      [34, 'Memory hierarchy',
        `<p class="y-chinh">🎯 The economic argument of the whole chapter, in one line the slide prints in red: <strong>very fast memory is usually not cheap</strong>. Users want "a lot, very fast, very cheap" and can have only two of the three, so the answer is a <strong>hierarchy</strong>: the pyramid of Figure 1.24 with <em>Registers</em> on top, <em>Cache memory</em> in the middle, <em>Main memory</em> at the base.</p>
<ul>
<li><strong>Read the four arrow labels on the figure</strong> — up the pyramid: "More costly" and "Fastest"; down the pyramid: "Less costly" and "Slowest". Size grows downwards, speed grows upwards, and price per byte follows speed.</li>
<li><strong>Why the compromise works at all</strong> — the principle of <em>locality</em>. Programs do not touch memory at random: they reuse the same variables (temporal locality) and walk through neighbouring addresses (spatial locality). So a small fast level, well chosen, catches the great majority of accesses.</li>
<li><strong>How good "the great majority" is</strong> — typical hit rates are around 95% or better for L1. The average access time is then <em>hit_rate × fast_time + miss_rate × slow_time</em>, which lands close to the fast time even though the slow level is hundreds of times slower.</li>
<li><strong>The real ladder is longer than three steps</strong> — registers, L1, L2, L3, main memory, SSD, hard disk, and cloud/tape at the bottom. The textbook draws three because the idea, not the count, is the point.</li>
<li><strong>The numbers that make it concrete</strong> — see the table: the jump from a register to a hard disk is roughly ten million to one. That is the same ratio as one second versus four months.</li>
<li><strong>Cost is the other axis</strong> — SRAM costs on the order of dollars per megabyte, DRAM on the order of a few dollars per gigabyte, and hard disk space around two cents per gigabyte. Building a whole machine out of the top level would be unaffordable, and building it out of the bottom would be unbearably slow.</li>
</ul>
<table>
<tr><th>Level</th><th>Made of</th><th>Typical size</th><th>Latency (CPU cycles)</th><th>If 1 cycle = 1 second</th></tr>
<tr><td>Registers</td><td>SRAM/flip-flops</td><td>a few hundred bytes</td><td>~1</td><td>1 second</td></tr>
<tr><td>L1 cache</td><td>SRAM</td><td>32–128 KB per core</td><td>~4</td><td>4 seconds</td></tr>
<tr><td>L2 cache</td><td>SRAM</td><td>0.5–2 MB per core</td><td>~12</td><td>12 seconds</td></tr>
<tr><td>L3 cache</td><td>SRAM</td><td>8–64 MB shared</td><td>~40</td><td>40 seconds</td></tr>
<tr><td>Main memory</td><td>DRAM</td><td>8–64 GB</td><td>~200</td><td>3 minutes</td></tr>
<tr><td>NVMe SSD</td><td>NAND Flash</td><td>0.5–4 TB</td><td>~100,000</td><td>~1 day</td></tr>
<tr><td>Hard disk</td><td>spinning magnetic platters</td><td>2–20 TB</td><td>~10,000,000</td><td>~4 months</td></tr>
</table>
<p class="meo">💡 Hold the whole figure in one sentence: <strong>upwards is FAST – SMALL – EXPENSIVE, downwards is SLOW – BIG – CHEAP</strong>. The three pairs always move together, and exam questions usually give you one of them and ask you to infer the other two.</p>`,
        `<p class="y-chinh">🎯 Lý lẽ kinh tế của cả chương, gói trong một dòng slide in đỏ: <strong>bộ nhớ rất nhanh thường không rẻ</strong>. Người dùng muốn "thật nhiều, thật nhanh, thật rẻ" mà chỉ được chọn hai trong ba, nên lời giải là <strong>phân cấp</strong>: kim tự tháp hình 1.24 với <em>Registers</em> (thanh ghi) trên đỉnh, <em>Cache memory</em> ở giữa, <em>Main memory</em> dưới đáy.</p>
<ul>
<li><strong>Đọc bốn nhãn mũi tên trên hình</strong> — đi lên: "More costly" (đắt hơn) và "Fastest" (nhanh nhất); đi xuống: "Less costly" (rẻ hơn) và "Slowest" (chậm nhất). Dung lượng lớn dần khi xuống, tốc độ tăng dần khi lên, và giá mỗi byte đi theo tốc độ.</li>
<li><strong>Vì sao sự thoả hiệp này lại chạy được</strong> — nhờ nguyên lý <em>cục bộ</em> (locality). Chương trình không đụng bộ nhớ một cách ngẫu nhiên: nó dùng đi dùng lại cùng những biến (cục bộ thời gian) và đi lần lượt qua các địa chỉ kề nhau (cục bộ không gian). Nên một mức nhỏ mà nhanh, chọn khéo, hứng được phần lớn số lần truy cập.</li>
<li><strong>"Phần lớn" là bao nhiêu</strong> — tỷ lệ trúng của L1 thường từ 95% trở lên. Thời gian truy cập trung bình khi đó là <em>tỷ lệ trúng × thời gian nhanh + tỷ lệ trượt × thời gian chậm</em>, và kết quả nằm sát mức nhanh dù mức chậm chậm hơn hàng trăm lần.</li>
<li><strong>Cái thang thật dài hơn ba bậc</strong> — thanh ghi, L1, L2, L3, bộ nhớ chính, SSD, đĩa cứng, rồi băng từ / đám mây dưới cùng. Sách vẽ ba bậc vì cái cần nhớ là ý tưởng chứ không phải con số.</li>
<li><strong>Những con số làm cho nó cụ thể</strong> — xem bảng: khoảng cách từ thanh ghi xuống đĩa cứng cỡ mười triệu lần. Bằng đúng tỷ lệ giữa một giây và bốn tháng.</li>
<li><strong>Trục còn lại là giá</strong> — SRAM tính bằng đô la mỗi megabyte, DRAM vài đô la mỗi gigabyte, còn đĩa cứng chừng hai xu mỗi gigabyte. Làm cả máy bằng mức trên cùng thì không ai mua nổi, làm cả máy bằng mức dưới cùng thì không ai chịu nổi.</li>
</ul>
<table>
<tr><th>Mức</th><th>Làm bằng</th><th>Dung lượng điển hình</th><th>Độ trễ (chu kỳ CPU)</th><th>Quy đổi nếu 1 chu kỳ = 1 giây</th></tr>
<tr><td>Thanh ghi</td><td>SRAM/flip-flop</td><td>vài trăm byte</td><td>~1</td><td>1 giây</td></tr>
<tr><td>Cache L1</td><td>SRAM</td><td>32–128 KB/lõi</td><td>~4</td><td>4 giây</td></tr>
<tr><td>Cache L2</td><td>SRAM</td><td>0,5–2 MB/lõi</td><td>~12</td><td>12 giây</td></tr>
<tr><td>Cache L3</td><td>SRAM</td><td>8–64 MB dùng chung</td><td>~40</td><td>40 giây</td></tr>
<tr><td>Bộ nhớ chính</td><td>DRAM</td><td>8–64 GB</td><td>~200</td><td>3 phút</td></tr>
<tr><td>SSD NVMe</td><td>NAND Flash</td><td>0,5–4 TB</td><td>~100.000</td><td>~1 ngày</td></tr>
<tr><td>Đĩa cứng HDD</td><td>đĩa từ quay</td><td>2–20 TB</td><td>~10.000.000</td><td>~4 tháng</td></tr>
</table>
<p class="meo">💡 Cách nhớ cả hình bằng một câu: <strong>lên thì NHANH – NHỎ – ĐẮT, xuống thì CHẬM – TO – RẺ</strong>. Ba cặp đối này luôn đi cùng chiều, và đề thi thường chỉ cho một vế rồi bắt suy ra hai vế còn lại.</p>`],

      [35, 'Cache memory',
        `<p class="y-chinh">🎯 Cache defined by its two neighbours: it is <strong>faster than main memory but slower than the CPU and its registers</strong>, it is <strong>small</strong>, and it is <strong>placed between the CPU and main memory</strong>. Figure 1.25 draws exactly that: the CPU box (ALU, registers, control unit) on the left, Memory on the right, and a small green Cache hanging off the bus in the middle.</p>
<ul>
<li><strong>Cache is not a fourth subsystem</strong> — it is an optimisation inside the memory path. Programs never address it; the hardware decides on its own what to keep there, which is why no instruction says "load from cache".</li>
<li><strong>How a read actually goes</strong> — CPU asks for address A. If A is in cache, that is a <em>hit</em> and the value comes back in a few cycles. If not, that is a <em>miss</em>: the value is fetched from DRAM, and a whole <em>line</em> around it (typically 64 bytes) is copied into the cache on the way.</li>
<li><strong>Why a whole line, not one byte</strong> — spatial locality. If you touched <code>a[0]</code>, you will almost certainly touch <code>a[1]</code> next, and it is already there. This is the reason a program that walks an array by rows can be several times faster than the same program walking it by columns.</li>
<li><strong>When the cache is full, something must go</strong> — a replacement policy (usually approximate LRU, "least recently used") throws out the line untouched for longest. And when the CPU writes, the change must eventually reach DRAM (write-through immediately, or write-back when the line is evicted).</li>
<li><strong>Real sizes today</strong> — on an Apple M-series or a modern x86-64 chip: L1 about 64–128 KB per core, L2 about 1–4 MB per core, L3 about 8–64 MB shared. Against 16 GB of DRAM that is roughly one part in a thousand, and it still absorbs the great majority of traffic.</li>
<li><strong>The 80/20 argument the textbook makes</strong> — Forouzan phrases it as: if 90% of the time the needed word is already in the cache, the effective access time approaches the cache's time, not DRAM's. Small and fast beats big and slow, provided the choice of what to keep is good.</li>
</ul>
<p class="dap-an">✅ Worked example of the payoff. Suppose cache access = 4 cycles, DRAM access = 200 cycles, hit rate = 95%. Average = 0.95 × 4 + 0.05 × (4 + 200) = 3.8 + 10.2 = <strong>14 cycles</strong>. Without any cache it would be 200 cycles — so a memory that holds one thousandth of the data makes the machine about <strong>14× faster</strong> on memory access. Drop the hit rate to 80% and the average becomes 0.8 × 4 + 0.2 × 204 = 44 cycles: the benefit collapses fast, which is why cache-friendly code matters.</p>
<p class="pitfall">⚠️ Do not write in an exam that "cache is part of RAM" or "cache stores the program". Cache is made of SRAM, sits outside main memory in the model, and stores <em>copies</em> of recently used lines — main memory always remains the authoritative copy.</p>`,
        `<p class="y-chinh">🎯 Cache được định nghĩa bằng hai người hàng xóm của nó: nó <strong>nhanh hơn bộ nhớ chính nhưng chậm hơn CPU và các thanh ghi</strong>, nó <strong>nhỏ</strong>, và nó <strong>nằm giữa CPU và bộ nhớ chính</strong>. Hình 1.25 vẽ đúng như vậy: khối CPU (ALU, thanh ghi, khối điều khiển) bên trái, Memory bên phải, và một khối Cache xanh nhỏ treo vào bus ở giữa.</p>
<ul>
<li><strong>Cache không phải hệ con thứ tư</strong> — nó là một phép tối ưu nằm trên đường đi tới bộ nhớ. Chương trình không bao giờ đánh địa chỉ vào nó; phần cứng tự quyết định giữ cái gì ở đó, nên không có lệnh máy nào ghi "nạp từ cache".</li>
<li><strong>Một lần đọc diễn ra thế nào</strong> — CPU hỏi địa chỉ A. Nếu A có trong cache thì đó là <em>trúng</em> (hit), giá trị về sau vài chu kỳ. Nếu không thì <em>trượt</em> (miss): giá trị được lấy từ DRAM, và cả một <em>dòng</em> quanh nó (thường 64 byte) được chép vào cache trên đường đi.</li>
<li><strong>Vì sao chép cả dòng chứ không chép một byte</strong> — cục bộ không gian. Vừa đụng <code>a[0]</code> thì gần như chắc chắn sắp đụng <code>a[1]</code>, mà nó đã nằm sẵn đó rồi. Đây chính là lý do một chương trình duyệt mảng theo dòng có thể nhanh hơn vài lần chính chương trình đó duyệt theo cột.</li>
<li><strong>Cache đầy thì phải bỏ bớt</strong> — chính sách thay thế (thường là LRU xấp xỉ, "ít dùng gần đây nhất") vứt đi dòng lâu chưa đụng tới nhất. Và khi CPU ghi, thay đổi rốt cuộc phải xuống tới DRAM (ghi xuyên ngay, hoặc ghi trễ khi dòng bị đuổi ra).</li>
<li><strong>Kích thước thật hôm nay</strong> — trên chip Apple M hoặc x86-64 đời mới: L1 chừng 64–128 KB mỗi lõi, L2 chừng 1–4 MB mỗi lõi, L3 chừng 8–64 MB dùng chung. So với 16 GB DRAM thì chỉ khoảng một phần nghìn, vậy mà nó hứng gần hết lưu lượng.</li>
<li><strong>Lý lẽ 80/20 mà sách nêu</strong> — Forouzan diễn đạt là: nếu 90% số lần từ cần dùng đã nằm sẵn trong cache thì thời gian truy cập hiệu dụng tiến về thời gian của cache chứ không phải của DRAM. Nhỏ mà nhanh thắng to mà chậm, với điều kiện chọn đúng thứ để giữ.</li>
</ul>
<p class="dap-an">✅ Ví dụ tính cụ thể cái lợi. Giả sử truy cập cache = 4 chu kỳ, truy cập DRAM = 200 chu kỳ, tỷ lệ trúng 95%. Trung bình = 0,95 × 4 + 0,05 × (4 + 200) = 3,8 + 10,2 = <strong>14 chu kỳ</strong>. Không có cache thì là 200 chu kỳ — nghĩa là một bộ nhớ chỉ chứa một phần nghìn dữ liệu đã làm máy nhanh gấp khoảng <strong>14 lần</strong> ở khâu truy cập. Hạ tỷ lệ trúng xuống 80% thì trung bình thành 0,8 × 4 + 0,2 × 204 = 44 chu kỳ: cái lợi sụp rất nhanh, và đó là lý do viết mã thân thiện với cache lại quan trọng.</p>
<p class="pitfall">⚠️ Đừng viết trong bài thi rằng "cache là một phần của RAM" hay "cache chứa chương trình". Cache làm bằng SRAM, trong mô hình nó nằm NGOÀI bộ nhớ chính, và nó chứa <em>bản sao</em> của những dòng vừa dùng — bản gốc có thẩm quyền luôn là bộ nhớ chính.</p>`],

      [36, '7 - INPUT/OUTPUT SUBSYSTEM',
        `<p class="y-chinh">🎯 The third and last of the three subsystems from slide 23 opens here. The CPU computes, main memory holds — and the I/O subsystem does the two things neither of them can: <strong>talk to the outside world</strong> and <strong>survive a power cut</strong>.</p>
<ul>
<li><strong>Why I/O is a subsystem and not an afterthought</strong> — without it a computer has no way to receive a program, show a result, or keep anything. The von Neumann model of slide 11 listed input and output as two of its four boxes for exactly this reason.</li>
<li><strong>The defining problem of this section</strong> — speed mismatch. A CPU runs at billions of operations per second; a keyboard produces a few characters per second; a disk head takes milliseconds to move. Section 8 exists because these worlds cannot be wired together naively.</li>
<li><strong>The two questions slides 37–40 answer</strong> — what kinds of I/O device exist (storage vs non-storage), and what storage devices are made of (magnetic, optical, solid-state).</li>
<li><strong>A vocabulary warning</strong> — in this course a hard disk is an <em>I/O device</em>, not memory. Casual speech says "my computer has 512 GB of memory" meaning the SSD; in the exam that sentence is wrong.</li>
<li><strong>Where the money goes today</strong> — for most users the visible difference between a fast and a slow computer is the I/O subsystem (SSD vs HDD), not the CPU. Sections 7 and 8 explain why.</li>
</ul>
<p class="meo">💡 One-line frame for the section: <em>CPU = brain, main memory = short-term memory, I/O = senses, hands and notebook.</em> The notebook part (storage) is what makes yesterday's work still exist this morning.</p>`,
        `<p class="y-chinh">🎯 Hệ con thứ ba và cuối cùng trong ba hệ con của slide 23 mở ra ở đây. CPU tính, bộ nhớ chính giữ — còn hệ con vào/ra làm hai việc mà cả hai cái kia đều không làm được: <strong>nói chuyện với thế giới bên ngoài</strong> và <strong>sống sót qua một lần mất điện</strong>.</p>
<ul>
<li><strong>Vì sao vào/ra là một hệ con chứ không phải phần phụ</strong> — không có nó thì máy tính chẳng có cách nào nhận chương trình, hiện kết quả, hay giữ lại bất cứ thứ gì. Mô hình von Neumann ở slide 11 liệt kê input và output là hai trong bốn ô chính vì lẽ đó.</li>
<li><strong>Bài toán định nghĩa cả mục này</strong> — lệch tốc độ. CPU chạy hàng tỷ thao tác mỗi giây; bàn phím sinh vài ký tự mỗi giây; đầu đọc đĩa mất vài mili giây để di chuyển. Mục 8 tồn tại là vì hai thế giới này không thể nối thẳng vào nhau được.</li>
<li><strong>Hai câu hỏi mà slide 37–40 trả lời</strong> — có những loại thiết bị vào/ra nào (lưu trữ và không lưu trữ), và thiết bị lưu trữ làm bằng gì (từ tính, quang học, bán dẫn).</li>
<li><strong>Một cảnh báo từ vựng</strong> — trong môn này, ổ cứng là <em>thiết bị vào/ra</em>, không phải bộ nhớ. Ngoài đời người ta nói "máy tôi có bộ nhớ 512 GB" để chỉ cái SSD; trong bài thi câu đó SAI.</li>
<li><strong>Tiền hôm nay đi về đâu</strong> — với đa số người dùng, khác biệt thấy được giữa máy nhanh và máy chậm nằm ở hệ con vào/ra (SSD hay HDD) chứ không phải ở CPU. Mục 7 và 8 giải thích vì sao.</li>
</ul>
<p class="meo">💡 Một câu khung cho cả mục: <em>CPU = bộ não, bộ nhớ chính = trí nhớ ngắn hạn, vào/ra = giác quan, đôi tay và cuốn sổ.</em> Phần "cuốn sổ" (lưu trữ) chính là thứ khiến việc làm hôm qua sáng nay vẫn còn.</p>`],

      [37, 'Introduction',
        `<p class="y-chinh">🎯 Three statements define the I/O subsystem: it is <strong>the collection of devices</strong>, it lets the computer <strong>communicate with the outside world and store programs and data even when the power is off</strong>, and it splits into <strong>two broad categories: non-storage and storage devices</strong>.</p>
<ul>
<li><strong>Note the typo in the slide</strong> — the first bullet ends "…is the collection of devices. T" and the next line starts "his subsystem allows…". A line break cut the word "This" in half. Read it as one sentence; nothing is missing.</li>
<li><strong>"Even when the power is off" is the load-bearing phrase</strong> — it is the property main memory does not have. Your unsaved document lives in volatile DRAM; saving it is literally the act of moving it into the I/O subsystem.</li>
<li><strong>Why storage counts as I/O and not as memory</strong> — the CPU cannot address a byte on a disk with an instruction. It must ask a controller (slide 44) to transfer a whole block into main memory first. Anything the CPU reaches only through a controller is I/O.</li>
<li><strong>The division is by capability, not by shape</strong> — a keyboard, a mouse, a screen and a printer are non-storage; a hard disk, an SSD, a CD and a USB stick are storage. A webcam is non-storage even though it is complex; a memory card is storage even though it is tiny.</li>
<li><strong>Where the outside world actually enters</strong> — every program you will ever write gets its input through this subsystem and delivers its output through it. <code>scanf</code> and <code>printf</code> are, from the hardware's point of view, requests to the I/O subsystem.</li>
</ul>
<p class="meo">💡 Quick test for the exam: ask "if I unplug the power for an hour, is the content still there?" Yes ⇒ storage device. No ⇒ either non-storage I/O or main memory — and then ask "does it carry information to or from a human or another machine?" to separate those two.</p>`,
        `<p class="y-chinh">🎯 Ba câu định nghĩa hệ con vào/ra: nó là <strong>tập hợp các thiết bị</strong>, nó cho máy tính <strong>giao tiếp với thế giới bên ngoài và lưu trữ chương trình cùng dữ liệu ngay cả khi mất điện</strong>, và nó chia làm <strong>hai nhóm lớn: thiết bị không lưu trữ và thiết bị lưu trữ</strong>.</p>
<ul>
<li><strong>Để ý lỗi đánh máy trên slide</strong> — gạch đầu dòng thứ nhất kết thúc bằng "…is the collection of devices. T" rồi dòng sau bắt đầu bằng "his subsystem allows…". Một chỗ xuống dòng đã cắt đôi chữ "This". Hãy đọc như một câu liền; không thiếu chữ nào.</li>
<li><strong>"Ngay cả khi mất điện" là cụm chịu lực</strong> — đó là tính chất mà bộ nhớ chính KHÔNG có. Tài liệu bạn chưa lưu đang nằm trong DRAM bay hơi; bấm Lưu đúng nghĩa đen là hành động chuyển nó sang hệ con vào/ra.</li>
<li><strong>Vì sao lưu trữ được tính là vào/ra chứ không phải bộ nhớ</strong> — CPU không đánh địa chỉ tới một byte trên đĩa bằng một lệnh máy được. Nó phải nhờ bộ điều khiển (slide 44) chuyển cả một khối vào bộ nhớ chính trước. Cái gì CPU chỉ với tới qua bộ điều khiển thì cái đó là vào/ra.</li>
<li><strong>Chia theo KHẢ NĂNG chứ không theo hình dáng</strong> — bàn phím, chuột, màn hình, máy in là không lưu trữ; ổ cứng, SSD, đĩa CD, USB là lưu trữ. Webcam là không lưu trữ dù nó phức tạp; thẻ nhớ là lưu trữ dù nó bé xíu.</li>
<li><strong>Thế giới bên ngoài đi vào từ đâu</strong> — mọi chương trình bạn sẽ viết đều nhận đầu vào qua hệ con này và trả đầu ra qua nó. Dưới mắt phần cứng, <code>scanf</code> và <code>printf</code> là những lời yêu cầu gửi tới hệ con vào/ra.</li>
</ul>
<p class="meo">💡 Phép thử nhanh khi thi: hỏi "rút điện một tiếng rồi cắm lại, nội dung còn không?" Còn ⇒ thiết bị lưu trữ. Không còn ⇒ hoặc là vào/ra không lưu trữ, hoặc là bộ nhớ chính — rồi hỏi tiếp "nó có chở thông tin tới/từ con người hay máy khác không?" để tách hai cái đó.</p>`],

      [38, 'Non-storage & Storage devices',
        `<p class="y-chinh">🎯 The two categories, defined properly. <strong>Non-storage devices</strong> let the CPU/memory communicate with the outside world <strong>but cannot store information</strong>. <strong>Storage devices</strong> hold large amounts to be retrieved later, are <strong>cheaper than main memory</strong>, are <strong>non-volatile</strong>, are also called <strong>auxiliary storage</strong>, and are categorised as <strong>magnetic or optical</strong>.</p>
<ul>
<li><strong>Four properties of storage, all examinable</strong> — large capacity, retrievable later, cheaper per byte than main memory, non-volatile. Miss "non-volatile" and the answer is incomplete; it is the one the slide defines in place ("not erased when the power is turned off").</li>
<li><strong>"Auxiliary" = "secondary"</strong> — main memory is <em>primary</em> storage, disks are <em>secondary</em> (auxiliary) storage. Both names appear in exam papers and mean the same thing.</li>
<li><strong>Cheaper is the reason it exists</strong> — real 2026 prices per gigabyte: DRAM roughly 2–3 USD, NVMe SSD roughly 0.05–0.08 USD, hard disk roughly 0.015–0.02 USD. That is about 40× between DRAM and SSD and about 150× between DRAM and HDD. You buy 16 GB of RAM and 1,000 GB of disk for similar money — the hierarchy again.</li>
<li><strong>The magnetic/optical split is the textbook's, and it is now incomplete</strong> — slide 40 adds the third family, solid state, which is neither. In 2026, most new machines have no magnetic and no optical device at all.</li>
<li><strong>Non-storage examples with their direction</strong> — input only: keyboard, mouse, microphone, scanner, camera. Output only: monitor, printer, speaker. Both: touch screen, network card, modem.</li>
<li><strong>Why "cannot store" is exactly right for a printer</strong> — a printer produces paper, which does hold information, but the <em>device</em> cannot give it back to the computer. Retrievability by the machine is the test, not permanence in the world.</li>
</ul>
<table>
<tr><th>Property</th><th>Main memory (DRAM)</th><th>Storage device (SSD/HDD)</th><th>Non-storage device</th></tr>
<tr><td>Keeps data with power off</td><td>❌</td><td>✅</td><td>❌</td></tr>
<tr><td>Reached by the CPU</td><td>directly, by address</td><td>through a controller, by block</td><td>through a controller</td></tr>
<tr><td>Typical capacity</td><td>8–64 GB</td><td>0.5–20 TB</td><td>none</td></tr>
<tr><td>Price per GB (2026)</td><td>~2–3 USD</td><td>~0.02–0.08 USD</td><td>—</td></tr>
<tr><td>Access time</td><td>~60 ns</td><td>~0.05 ms (SSD) / ~10 ms (HDD)</td><td>human speed</td></tr>
</table>
<p class="pitfall">⚠️ Common exam mistake: calling RAM a "storage device". RAM is <em>main memory</em>, the second subsystem — and it is volatile, which disqualifies it by this slide's own definition. Equally wrong is calling an SSD "memory" just because it is made of flash memory chips.</p>`,
        `<p class="y-chinh">🎯 Hai nhóm, định nghĩa cho tử tế. <strong>Thiết bị không lưu trữ</strong> cho CPU/bộ nhớ giao tiếp với thế giới bên ngoài <strong>nhưng không chứa được thông tin</strong>. <strong>Thiết bị lưu trữ</strong> giữ lượng lớn dữ liệu để lấy lại sau, <strong>rẻ hơn bộ nhớ chính</strong>, <strong>không bay hơi</strong>, còn gọi là <strong>bộ nhớ phụ trợ</strong>, và được xếp thành <strong>từ tính hoặc quang học</strong>.</p>
<ul>
<li><strong>Bốn tính chất của thiết bị lưu trữ, cái nào cũng ra thi</strong> — dung lượng lớn, lấy lại được sau, rẻ hơn bộ nhớ chính trên mỗi byte, không bay hơi. Thiếu chữ "không bay hơi" là câu trả lời chưa đủ; chính slide định nghĩa nó tại chỗ ("không bị xoá khi tắt nguồn").</li>
<li><strong>"Phụ trợ" (auxiliary) = "thứ cấp" (secondary)</strong> — bộ nhớ chính là bộ nhớ <em>sơ cấp</em>, đĩa là bộ nhớ <em>thứ cấp</em> (phụ trợ). Cả hai tên đều xuất hiện trong đề thi và đều chỉ một thứ.</li>
<li><strong>Rẻ hơn chính là lý do nó tồn tại</strong> — giá thật năm 2026 cho mỗi gigabyte: DRAM khoảng 2–3 USD, SSD NVMe khoảng 0,05–0,08 USD, đĩa cứng khoảng 0,015–0,02 USD. Tức khoảng 40 lần giữa DRAM và SSD, khoảng 150 lần giữa DRAM và HDD. Cùng số tiền ấy mua được 16 GB RAM hoặc 1.000 GB đĩa — lại là chuyện phân cấp.</li>
<li><strong>Cách chia từ tính / quang học là của sách, và nay đã thiếu</strong> — slide 40 bổ sung họ thứ ba, bán dẫn (solid state), không thuộc cả hai. Năm 2026, phần lớn máy mới không còn thiết bị từ tính lẫn quang học nào.</li>
<li><strong>Ví dụ thiết bị không lưu trữ, kèm chiều đi</strong> — chỉ vào: bàn phím, chuột, micro, máy quét, máy ảnh. Chỉ ra: màn hình, máy in, loa. Cả hai chiều: màn hình cảm ứng, card mạng, modem.</li>
<li><strong>Vì sao "không chứa được" lại đúng với máy in</strong> — máy in sinh ra tờ giấy, mà tờ giấy thì có chứa thông tin thật; nhưng <em>thiết bị</em> không trả lại được thông tin ấy cho máy tính. Tiêu chí là MÁY lấy lại được hay không, chứ không phải thông tin có bền trong đời thật hay không.</li>
</ul>
<table>
<tr><th>Tính chất</th><th>Bộ nhớ chính (DRAM)</th><th>Thiết bị lưu trữ (SSD/HDD)</th><th>Thiết bị không lưu trữ</th></tr>
<tr><td>Mất điện còn dữ liệu</td><td>❌</td><td>✅</td><td>❌</td></tr>
<tr><td>CPU với tới bằng cách</td><td>trực tiếp, theo địa chỉ</td><td>qua bộ điều khiển, theo khối</td><td>qua bộ điều khiển</td></tr>
<tr><td>Dung lượng điển hình</td><td>8–64 GB</td><td>0,5–20 TB</td><td>không có</td></tr>
<tr><td>Giá mỗi GB (2026)</td><td>~2–3 USD</td><td>~0,02–0,08 USD</td><td>—</td></tr>
<tr><td>Thời gian truy cập</td><td>~60 ns</td><td>~0,05 ms (SSD) / ~10 ms (HDD)</td><td>tốc độ con người</td></tr>
</table>
<p class="pitfall">⚠️ Lỗi thi rất hay gặp: gọi RAM là "thiết bị lưu trữ". RAM là <em>bộ nhớ chính</em>, hệ con thứ hai — và nó bay hơi, nên bị loại ngay bởi chính định nghĩa của slide này. Sai ngang bằng là gọi SSD là "bộ nhớ" chỉ vì nó làm bằng chip nhớ flash.</p>`],

      [39, 'Storage devices (Magnetic or Optical)',
        `<p class="y-chinh">🎯 One slide, two technologies side by side. On the left, an exploded drawing of an <strong>HDD</strong> (sealed chamber, disk platters, head arm, head actuator, read/write head, drive electronics PCB, anti-vibration mount). On the right, the three-stage manufacture and reading of a <strong>CD-ROM</strong> — master disc, mold, finished disc with laser source and laser detector.</p>
<ul>
<li><strong>Magnetic: how a bit is stored</strong> — the platter is coated with a magnetisable film; the read/write head flips the direction of magnetisation of a tiny region. Direction is the bit. Nothing is consumed, so the disk can be rewritten indefinitely.</li>
<li><strong>Why an HDD has a latency floor</strong> — to read a byte the platter must <em>rotate</em> until that sector is under the head, and the arm must <em>seek</em> to the right track. At 7,200 rpm one revolution is 8.3 ms, so average rotational latency is about 4.2 ms; seek adds another 4–9 ms. Total ≈ 10 ms per random access, and no firmware can cheat physics.</li>
<li><strong>Optical: how a bit is stored</strong> — the slide's own caption states the mechanism: <em>"It detects more light when the location is land and less light when the location is pit."</em> A pit scatters the laser, a land reflects it. The pattern of pits is pressed from a mold, which is why mass-producing a CD is stamping, not writing.</li>
<li><strong>Read the CD cross-section labels</strong> — from the top: label, protective layer, reflective layer, then the polycarbonate resin the laser shines through from below. The data layer is close to the <em>label</em> side, which is why scratching the top of a CD is more fatal than scratching the shiny side.</li>
<li><strong>Capacities, for scale</strong> — CD 700 MB, DVD 4.7 GB (single layer), Blu-ray 25 GB per layer. A single modern hard disk of 20 TB holds roughly 28,000 CDs.</li>
<li><strong>Both are sequential-ish, not random</strong> — unlike RAM, the time to reach a byte depends heavily on where the head currently is. This is the practical meaning of "random access memory" being a name reserved for memory.</li>
</ul>
<table>
<tr><th>Feature</th><th>Magnetic (HDD)</th><th>Optical (CD/DVD/Blu-ray)</th></tr>
<tr><td>A bit is</td><td>a direction of magnetisation</td><td>a pit or a land, read by reflected light</td></tr>
<tr><td>Rewritable</td><td>✅ unlimited</td><td>CD-ROM ❌ · CD-R once · CD-RW ~1,000×</td></tr>
<tr><td>Typical capacity</td><td>2–20 TB</td><td>700 MB – 100 GB</td></tr>
<tr><td>Random access time</td><td>~10 ms</td><td>~100–150 ms</td></tr>
<tr><td>Sequential speed</td><td>~150–250 MB/s</td><td>~7 MB/s (CD 48×) – 36 MB/s (BD)</td></tr>
<tr><td>Main weakness</td><td>moving parts, shock-sensitive</td><td>slow, scratches, near-obsolete</td></tr>
</table>
<p class="meo">💡 Remember the difference by what destroys the data: a <strong>magnet</strong> kills a magnetic disk, <strong>a scratch</strong> kills an optical disc, and <strong>time plus write cycles</strong> kill a flash SSD. Three technologies, three different enemies.</p>`,
        `<p class="y-chinh">🎯 Một slide, hai công nghệ đặt cạnh nhau. Bên trái là hình bổ đôi một <strong>ổ cứng HDD</strong> (buồng kín, các đĩa từ, cần đầu đọc, cơ cấu quay cần, đầu đọc-ghi, bo mạch điện tử, đế chống rung). Bên phải là ba giai đoạn chế tạo và đọc một <strong>đĩa CD-ROM</strong> — đĩa gốc, khuôn ép, và đĩa thành phẩm với nguồn laser cùng bộ dò laser.</p>
<ul>
<li><strong>Từ tính: một bit được ghi thế nào</strong> — mặt đĩa phủ một lớp phim nhiễm từ được; đầu đọc-ghi đảo chiều từ hoá của một vùng cực nhỏ. Chiều từ hoá chính là bit. Không có gì bị tiêu hao, nên đĩa ghi lại được vô số lần.</li>
<li><strong>Vì sao HDD có một sàn độ trễ không phá nổi</strong> — muốn đọc một byte thì đĩa phải <em>quay</em> cho tới khi cung đó nằm dưới đầu đọc, và cần phải <em>dịch</em> tới đúng rãnh. Ở 7.200 vòng/phút, một vòng mất 8,3 ms nên độ trễ quay trung bình khoảng 4,2 ms; thời gian dịch cần thêm 4–9 ms nữa. Tổng ≈ 10 ms cho một lần truy cập ngẫu nhiên, và không firmware nào lách được vật lý.</li>
<li><strong>Quang học: một bit được ghi thế nào</strong> — chính chú thích trên slide nêu cơ chế: <em>"Nó dò được nhiều ánh sáng hơn ở chỗ là land, và ít ánh sáng hơn ở chỗ là pit."</em> Hố (pit) làm tán xạ tia laser, mặt phẳng (land) phản xạ lại. Mẫu hố được ép ra từ khuôn, nên sản xuất hàng loạt đĩa CD là DẬP chứ không phải GHI.</li>
<li><strong>Đọc kỹ các nhãn ở lát cắt đĩa CD</strong> — từ trên xuống: nhãn giấy, lớp bảo vệ, lớp phản xạ, rồi lớp nhựa polycarbonate mà tia laser chiếu xuyên từ dưới lên. Lớp dữ liệu nằm sát phía <em>mặt nhãn</em>, nên xước mặt trên đĩa CD còn chí mạng hơn xước mặt bóng.</li>
<li><strong>Dung lượng, để có cỡ</strong> — CD 700 MB, DVD 4,7 GB (một lớp), Blu-ray 25 GB mỗi lớp. Một ổ cứng 20 TB hôm nay chứa bằng khoảng 28.000 đĩa CD.</li>
<li><strong>Cả hai đều na ná tuần tự chứ không ngẫu nhiên</strong> — khác RAM, thời gian với tới một byte phụ thuộc nặng vào chỗ đầu đọc đang đứng. Đó là ý nghĩa thực tế của việc cái tên "bộ nhớ truy cập ngẫu nhiên" chỉ dành riêng cho bộ nhớ.</li>
</ul>
<table>
<tr><th>Đặc điểm</th><th>Từ tính (HDD)</th><th>Quang học (CD/DVD/Blu-ray)</th></tr>
<tr><td>Một bit là</td><td>một chiều từ hoá</td><td>một hố hoặc mặt phẳng, đọc bằng ánh sáng phản xạ</td></tr>
<tr><td>Ghi lại được</td><td>✅ không giới hạn</td><td>CD-ROM ❌ · CD-R một lần · CD-RW ~1.000 lần</td></tr>
<tr><td>Dung lượng điển hình</td><td>2–20 TB</td><td>700 MB – 100 GB</td></tr>
<tr><td>Thời gian truy cập ngẫu nhiên</td><td>~10 ms</td><td>~100–150 ms</td></tr>
<tr><td>Tốc độ đọc tuần tự</td><td>~150–250 MB/s</td><td>~7 MB/s (CD 48×) – 36 MB/s (BD)</td></tr>
<tr><td>Điểm yếu chính</td><td>có bộ phận chuyển động, sợ va đập</td><td>chậm, dễ xước, gần như lỗi thời</td></tr>
</table>
<p class="meo">💡 Nhớ khác biệt bằng thứ giết chết dữ liệu: <strong>nam châm</strong> giết đĩa từ, <strong>vết xước</strong> giết đĩa quang, còn <strong>thời gian cộng số lần ghi</strong> giết SSD flash. Ba công nghệ, ba kẻ thù khác nhau.</p>`],

      [40, 'SSD – Solid State Disk',
        `<p class="y-chinh">🎯 The modern third family. An SSD <strong>uses NAND-based flash memory, which retains data without power</strong>; the slide is careful to say it <strong>contains no actual disk of any kind, nor motors to drive the disks</strong>; it <strong>uses electronic interfaces compatible with traditional block I/O hard disk drives</strong> so it can simply replace one; and the slide's price claim is that SSDs are <strong>about 7 to 8 times more expensive per unit of storage than HDDs</strong>.</p>
<ul>
<li><strong>"No moving parts" is the whole story</strong> — no platter to spin up, no arm to seek. Every consequence follows from it: access time drops from ~10 ms to ~0.05 ms (200×), the drive is silent, it survives being dropped, it uses less power, and it has no warm-up delay.</li>
<li><strong>Why the word "disk" survives in the name</strong> — the slide says it itself: the electrical interface pretends to be a hard disk (SATA, and the block-oriented command set), so operating systems, BIOS and file systems written for disks work unchanged. Compatibility kept a now-false word alive.</li>
<li><strong>Real speeds today</strong> — SATA SSD ≈ 550 MB/s, limited by the SATA-III cable itself; NVMe over PCIe 4.0 ≈ 7,000 MB/s; PCIe 5.0 ≈ 14,000 MB/s. A 7,200 rpm hard disk manages ≈ 150–250 MB/s sequential and collapses to about 1 MB/s on small random reads, where the SSD is roughly a thousand times faster.</li>
<li><strong>The one thing flash is worse at — wear</strong> — a NAND cell tolerates a limited number of erase/program cycles (roughly 1,000–3,000 for consumer TLC/QLC). The controller spreads writes across the chip ("wear levelling") so the drive still lasts many years, but unlike a magnetic platter the medium does age with use.</li>
<li><strong>Why an SSD cannot overwrite in place</strong> — flash is read and written in pages (a few KB) but erased only in whole blocks (megabytes). That mismatch is why SSDs need garbage collection and the TRIM command, and why a full SSD gets slower.</li>
<li><strong>Where it sits in the hierarchy of slide 34</strong> — between DRAM and the hard disk, and close enough to DRAM that operating systems now happily use it as swap space, which was unthinkable with a magnetic disk.</li>
</ul>
<p class="dap-an">✅ On the slide's price claim: <strong>"7 to 8 times more expensive per unit of storage" was true around 2014, and is not true in 2026.</strong> Measured retail prices today: a 2 TB NVMe SSD costs roughly 0.05–0.08 USD per GB, a 4 TB desktop hard disk roughly 0.015–0.02 USD per GB — a ratio of about <strong>3 to 4×</strong>, not 7 to 8×. The slide is not wrong about the direction (SSD is still dearer per byte); only the factor is out of date. Say so in an exam rather than repeating the number blindly — and note the practical consequence: SSD is now the default in laptops, and HDD survives mainly in bulk archive and NAS storage.</p>
<p class="pitfall">⚠️ Do not answer "an SSD is faster because flash memory is faster than magnetism". It is faster because there is <em>nothing to move</em>. On large sequential transfers a hard disk is only a few times slower; the thousand-fold gap appears only on <em>random</em> access, where the HDD pays its seek and rotation tax on every request.</p>`,
        `<p class="y-chinh">🎯 Họ thứ ba, họ hiện đại. SSD <strong>dùng bộ nhớ flash nền NAND, thứ giữ được dữ liệu khi không có điện</strong>; slide nói rất cẩn thận rằng nó <strong>không hề chứa cái "đĩa" nào, cũng không có động cơ nào quay đĩa</strong>; nó <strong>dùng giao tiếp điện tử tương thích với ổ cứng truyền thống kiểu khối</strong> nên thay thẳng vào chỗ ổ cứng được; và slide khẳng định về giá rằng SSD <strong>đắt hơn HDD khoảng 7 đến 8 lần trên mỗi đơn vị dung lượng</strong>.</p>
<ul>
<li><strong>"Không có bộ phận chuyển động" là toàn bộ câu chuyện</strong> — không có đĩa phải quay lên, không có cần phải dịch. Mọi hệ quả đều từ đó mà ra: thời gian truy cập tụt từ ~10 ms xuống ~0,05 ms (200 lần), ổ chạy im, rơi không hỏng, tốn ít điện hơn, và không có độ trễ khởi động.</li>
<li><strong>Vì sao chữ "đĩa" vẫn còn trong tên</strong> — chính slide nói: giao tiếp điện của nó GIẢ VỜ làm một ổ cứng (chuẩn SATA, và tập lệnh hướng khối), nhờ vậy hệ điều hành, BIOS và hệ thống tệp viết cho đĩa dùng lại được không cần sửa. Nhu cầu tương thích đã giữ sống một chữ nay đã sai.</li>
<li><strong>Tốc độ thật hôm nay</strong> — SSD SATA ≈ 550 MB/s, bị chính sợi cáp SATA-III chặn; NVMe qua PCIe 4.0 ≈ 7.000 MB/s; PCIe 5.0 ≈ 14.000 MB/s. Ổ cứng 7.200 vòng/phút đạt ≈ 150–250 MB/s khi đọc tuần tự và tụt xuống chừng 1 MB/s khi đọc ngẫu nhiên nhỏ — chỗ mà SSD nhanh hơn khoảng một nghìn lần.</li>
<li><strong>Điểm duy nhất flash thua — hao mòn</strong> — một ô NAND chỉ chịu được số lần xoá/ghi hữu hạn (cỡ 1.000–3.000 lần với TLC/QLC phổ thông). Bộ điều khiển rải đều lần ghi khắp chip ("cân bằng hao mòn") nên ổ vẫn sống nhiều năm, nhưng khác đĩa từ, vật liệu này CÓ già đi theo mức sử dụng.</li>
<li><strong>Vì sao SSD không ghi đè tại chỗ được</strong> — flash đọc và ghi theo trang (vài KB) nhưng chỉ xoá được theo nguyên khối (vài megabyte). Chính sự lệch đó khiến SSD cần thu gom rác và lệnh TRIM, và khiến một ổ SSD đầy thì chạy chậm đi.</li>
<li><strong>Chỗ của nó trong phân cấp ở slide 34</strong> — nằm giữa DRAM và đĩa cứng, và đủ gần DRAM tới mức hệ điều hành nay thoải mái dùng nó làm vùng tráo (swap), điều không tưởng thời đĩa từ.</li>
</ul>
<p class="dap-an">✅ Về con số giá của slide: <strong>"đắt hơn 7–8 lần trên mỗi đơn vị dung lượng" là đúng vào khoảng năm 2014, và KHÔNG còn đúng năm 2026.</strong> Giá bán lẻ đo được hôm nay: SSD NVMe 2 TB khoảng 0,05–0,08 USD mỗi GB, ổ cứng để bàn 4 TB khoảng 0,015–0,02 USD mỗi GB — tỷ lệ chừng <strong>3 đến 4 lần</strong>, không phải 7–8 lần. Slide không sai về CHIỀU (SSD vẫn đắt hơn trên mỗi byte); chỉ có hệ số là cũ. Hãy nói rõ điều đó trong bài thi thay vì chép lại con số một cách mù quáng — và để ý hệ quả thực tế: SSD nay là mặc định trên máy xách tay, còn HDD chủ yếu sống ở kho lưu trữ khối lượng lớn và máy chủ NAS.</p>
<p class="pitfall">⚠️ Đừng trả lời "SSD nhanh hơn vì bộ nhớ flash nhanh hơn từ tính". Nó nhanh hơn vì <em>không có gì phải di chuyển</em>. Khi chép tệp lớn liên tục, ổ cứng chỉ chậm hơn vài lần; khoảng cách nghìn lần chỉ hiện ra lúc truy cập <em>ngẫu nhiên</em>, nơi HDD phải trả thuế dịch cần và quay đĩa cho từng yêu cầu một.</p>`],

      [41, '8 - SUBSYSTEM INTERCONNECTION',
        `<p class="y-chinh">🎯 A divider slide that closes the loop. Sections 5, 6 and 7 described the three subsystems one at a time; section 8 asks the question they leave open — <strong>how are they wired to each other?</strong></p>
<ul>
<li><strong>Why this cannot be skipped</strong> — three perfect subsystems that cannot exchange a byte are three useless subsystems. Every instruction of the fetch-execute cycle on slide 13 crosses this wiring at least twice.</li>
<li><strong>What the next eight slides cover</strong> — the three buses between CPU and memory (43), why I/O cannot join those buses directly (44), three real controller standards SCSI / FireWire / USB (45–47), and the two ways of giving I/O devices addresses (48–49).</li>
<li><strong>The single design problem behind all of it</strong> — mismatched speed and mismatched nature. CPU and memory are electronic and fast; I/O devices are electromechanical, magnetic or optical, and slow. An intermediary is unavoidable.</li>
<li><strong>The word "bus" you are about to meet</strong> — a bus is a shared set of parallel wires that several units connect to. Shared is the important half: it is cheap, and it means only one transfer can be in flight at a time.</li>
<li><strong>Relevance today</strong> — the names have changed (PCI Express, DDR channels, USB4, Thunderbolt) but the picture has not: a processor, memory on its own fast path, and everything else behind controllers.</li>
</ul>
<p class="meo">💡 Think of section 8 as the <em>plumbing</em> chapter. Sections 5–7 sold you the appliances; this one shows the pipes, and explains why you cannot plug a garden hose straight into a fire main.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục, và nó khép vòng lại. Mục 5, 6 và 7 mô tả ba hệ con từng cái một; mục 8 đặt câu hỏi mà chúng bỏ ngỏ — <strong>ba cái đó nối với nhau bằng cách nào?</strong></p>
<ul>
<li><strong>Vì sao không bỏ qua được</strong> — ba hệ con hoàn hảo mà không trao đổi nổi một byte thì là ba hệ con vô dụng. Mỗi lệnh trong chu trình nạp–thi hành ở slide 13 đều đi qua đám dây này ít nhất hai lần.</li>
<li><strong>Tám slide tới bàn những gì</strong> — ba bus giữa CPU và bộ nhớ (43), vì sao vào/ra không cắm thẳng vào các bus đó được (44), ba chuẩn bộ điều khiển thật SCSI / FireWire / USB (45–47), và hai cách đánh địa chỉ cho thiết bị vào/ra (48–49).</li>
<li><strong>Một bài toán thiết kế nằm sau tất cả</strong> — lệch tốc độ và lệch bản chất. CPU với bộ nhớ là điện tử và nhanh; thiết bị vào/ra là cơ-điện, từ tính hoặc quang học, và chậm. Phải có khâu trung gian, không tránh được.</li>
<li><strong>Chữ "bus" sắp gặp</strong> — bus là một bó dây song song DÙNG CHUNG mà nhiều đơn vị cùng nối vào. Chữ "dùng chung" mới là nửa quan trọng: nó rẻ, và nó có nghĩa là tại một thời điểm chỉ một cuộc truyền được phép đi.</li>
<li><strong>Liên hệ hôm nay</strong> — tên gọi đã đổi (PCI Express, các kênh DDR, USB4, Thunderbolt) nhưng bức tranh thì không: một bộ xử lý, bộ nhớ đi đường riêng thật nhanh, và mọi thứ còn lại nấp sau các bộ điều khiển.</li>
</ul>
<p class="meo">💡 Hãy coi mục 8 là chương <em>đường ống</em>. Mục 5–7 bán cho bạn các thiết bị; mục này chỉ cho bạn hệ ống dẫn, và giải thích vì sao không thể cắm thẳng vòi tưới cây vào ống cứu hoả.</p>`],

      [42, 'Introduction',
        `<p class="y-chinh">🎯 Two short sentences that frame the section: we explore <strong>how the three subsystems (CPU, main memory and I/O) are interconnected</strong>, and the interconnection matters because <strong>information needs to be exchanged between the three</strong>.</p>
<ul>
<li><strong>Interconnection is a design decision, not a detail</strong> — the same three subsystems wired differently give a different machine. A single shared bus is cheap and slow; separate dedicated paths are fast and expensive. Every real computer is a choice on that scale.</li>
<li><strong>Which exchanges actually happen</strong> — CPU ↔ memory (fetch an instruction, read an operand, write a result), CPU ↔ I/O (read a key press, send a pixel buffer), and I/O ↔ memory directly, which real machines do via DMA (direct memory access) so the CPU is not copying every byte by hand.</li>
<li><strong>The traffic is dominated by one pair</strong> — CPU ↔ memory, by orders of magnitude, since every single instruction must at least be fetched. That is why slide 43's three buses get a slide of their own and I/O gets controllers.</li>
<li><strong>What "bus" buys and what it costs</strong> — one set of wires serves many devices, so adding a device costs almost nothing. The price is contention: two devices wanting the bus at the same moment must be arbitrated, and one waits.</li>
<li><strong>The modern echo of this slide</strong> — on today's chips the memory controller lives <em>inside</em> the CPU die and memory has its own channels, while everything else hangs off PCI Express. The textbook's three-bus picture is still the right mental model of what is being achieved.</li>
</ul>
<p class="meo">💡 When you read the next slides, keep asking one question of every picture: <em>who is allowed to talk, and who decides?</em> Interconnection design is mostly about answering that, and the CPU is almost always the one who decides.</p>`,
        `<p class="y-chinh">🎯 Hai câu ngắn đóng khung cả mục: ta sẽ tìm hiểu <strong>ba hệ con (CPU, bộ nhớ chính và vào/ra) được nối với nhau thế nào</strong>, và việc nối này quan trọng vì <strong>thông tin cần được trao đổi giữa ba hệ con ấy</strong>.</p>
<ul>
<li><strong>Cách nối là một quyết định thiết kế, không phải chi tiết vụn</strong> — cũng ba hệ con đó, nối kiểu khác là ra cái máy khác. Một bus dùng chung thì rẻ mà chậm; các đường riêng chuyên dụng thì nhanh mà đắt. Mọi máy tính thật đều là một lựa chọn trên cái thang đó.</li>
<li><strong>Thực tế có những cuộc trao đổi nào</strong> — CPU ↔ bộ nhớ (nạp lệnh, đọc toán hạng, ghi kết quả), CPU ↔ vào/ra (đọc phím vừa bấm, gửi khung ảnh ra màn hình), và vào/ra ↔ bộ nhớ trực tiếp, điều mà máy thật làm bằng DMA (truy cập bộ nhớ trực tiếp) để CPU khỏi phải bê từng byte bằng tay.</li>
<li><strong>Lưu lượng bị một cặp áp đảo</strong> — CPU ↔ bộ nhớ, hơn hẳn nhiều bậc, vì mỗi lệnh dù thế nào cũng phải được nạp. Vì thế ba bus ở slide 43 được dành hẳn một slide, còn vào/ra thì được giao cho các bộ điều khiển.</li>
<li><strong>Bus được gì và mất gì</strong> — một bó dây phục vụ nhiều thiết bị, nên thêm một thiết bị gần như không tốn gì. Cái giá là tranh chấp: hai thiết bị cùng muốn bus một lúc thì phải có trọng tài, và một bên phải chờ.</li>
<li><strong>Tiếng vọng hiện đại của slide này</strong> — trên chip hôm nay, bộ điều khiển bộ nhớ nằm NGAY TRONG đế CPU và bộ nhớ có kênh riêng, còn mọi thứ khác treo vào PCI Express. Bức tranh ba bus của sách vẫn là mô hình tư duy đúng về việc đang cần đạt được.</li>
</ul>
<p class="meo">💡 Khi đọc các slide sau, hãy hỏi mọi bức hình đúng một câu: <em>ai được phép nói, và ai quyết định?</em> Thiết kế cách nối chủ yếu là trả lời câu đó, và người quyết định gần như luôn là CPU.</p>`],

      [43, 'Connecting CPU and memory',
        `<p class="y-chinh">🎯 One rule to memorise: CPU and memory are connected by <strong>three groups of connections, each called a bus — the data bus, the address bus and the control bus</strong>. Figure 1.28 draws all three as parallel stripes running from the CPU box to the Memory column.</p>
<ul>
<li><strong>Address bus — "which location?"</strong> — carries the address the CPU wants. Its width <em>is</em> the address space: n wires ⇒ 2^n addressable locations, exactly the rule of slide 31. It is one-directional: only the CPU puts an address on it.</li>
<li><strong>Data bus — "what value?"</strong> — carries the contents. Its width is normally the word size: 8, 16, 32 or 64 wires, so a whole word moves in one go. It is bidirectional, because a read brings data in and a write sends data out.</li>
<li><strong>Control bus — "what operation, and when?"</strong> — carries signals such as READ, WRITE, the clock and the ready/acknowledge lines. Without it the other two buses would be meaningless: the same address plus the same data means "store this" or "fetch that" depending only on the control lines.</li>
<li><strong>A read, step by step</strong> — CPU puts an address on the address bus → asserts READ on the control bus → memory decodes the address and places the word on the data bus → memory signals ready → CPU latches the value into a register. That is one memory cycle.</li>
<li><strong>The two widths answer two different questions</strong> — address width answers <em>how much memory can exist</em>; data width answers <em>how much moves per access</em>. They are independent numbers, and confusing them is the classic slip: a machine can have a 16-bit data bus with a 24-bit address bus.</li>
<li><strong>Worked numbers</strong> — 32 address lines ⇒ 2^32 = 4,294,967,296 addressable bytes = 4 GiB. 64 data lines ⇒ 8 bytes per transfer. This is precisely why 32-bit operating systems topped out at 4 GB of RAM.</li>
</ul>
<table>
<tr><th>Bus</th><th>Question it answers</th><th>Direction</th><th>Width decides</th></tr>
<tr><td>Address</td><td>Which location?</td><td>CPU → memory only</td><td>Size of the address space (2^n)</td></tr>
<tr><td>Data</td><td>Which value?</td><td>Both ways</td><td>Bytes moved per access (word size)</td></tr>
<tr><td>Control</td><td>Read or write, and is it ready?</td><td>Mostly CPU → memory, plus replies</td><td>Which operations exist</td></tr>
</table>
<p class="meo">💡 Three questions, three buses: <strong>WHERE</strong> (address) · <strong>WHAT</strong> (data) · <strong>HOW/WHEN</strong> (control). If an exam asks for the buses and you can only remember two, you almost certainly forgot the control bus — it is the one with no obvious picture.</p>`,
        `<p class="y-chinh">🎯 Một quy tắc phải thuộc: CPU và bộ nhớ được nối bằng <strong>ba nhóm đường dây, mỗi nhóm gọi là một bus — bus dữ liệu, bus địa chỉ và bus điều khiển</strong>. Hình 1.28 vẽ cả ba thành những vệt song song chạy từ khối CPU sang cột Memory.</p>
<ul>
<li><strong>Bus địa chỉ — "ô nào?"</strong> — chở địa chỉ mà CPU muốn tới. Độ rộng của nó CHÍNH LÀ không gian địa chỉ: n sợi ⇒ 2^n ô địa chỉ hoá được, đúng quy tắc ở slide 31. Nó một chiều: chỉ CPU mới đặt địa chỉ lên đó.</li>
<li><strong>Bus dữ liệu — "giá trị nào?"</strong> — chở nội dung. Độ rộng của nó thường bằng kích thước từ: 8, 16, 32 hay 64 sợi, nên cả một từ đi trong một nhịp. Nó hai chiều, vì đọc thì dữ liệu đi vào còn ghi thì dữ liệu đi ra.</li>
<li><strong>Bus điều khiển — "thao tác gì, và lúc nào?"</strong> — chở các tín hiệu như ĐỌC, GHI, xung nhịp và các đường báo sẵn sàng. Thiếu nó thì hai bus kia vô nghĩa: cùng một địa chỉ với cùng một dữ liệu có nghĩa là "cất cái này" hay "lấy cái kia" hoàn toàn tuỳ vào đường điều khiển.</li>
<li><strong>Một lần đọc, từng bước</strong> — CPU đặt địa chỉ lên bus địa chỉ → bật tín hiệu ĐỌC trên bus điều khiển → bộ nhớ giải mã địa chỉ và đặt từ dữ liệu lên bus dữ liệu → bộ nhớ báo sẵn sàng → CPU chốt giá trị vào thanh ghi. Đó là một chu kỳ bộ nhớ.</li>
<li><strong>Hai độ rộng trả lời hai câu hỏi khác nhau</strong> — độ rộng địa chỉ trả lời <em>có thể có bao nhiêu bộ nhớ</em>; độ rộng dữ liệu trả lời <em>mỗi lần chuyển được bao nhiêu</em>. Đó là hai con số độc lập, và lẫn chúng là cái trượt kinh điển: một máy hoàn toàn có thể có bus dữ liệu 16 bit với bus địa chỉ 24 bit.</li>
<li><strong>Tính thử bằng số</strong> — 32 đường địa chỉ ⇒ 2^32 = 4.294.967.296 byte địa chỉ hoá được = 4 GiB. 64 đường dữ liệu ⇒ 8 byte mỗi lần chuyển. Đây chính xác là lý do hệ điều hành 32 bit chặn cứng ở 4 GB RAM.</li>
</ul>
<table>
<tr><th>Bus</th><th>Trả lời câu hỏi</th><th>Chiều</th><th>Độ rộng quyết định</th></tr>
<tr><td>Địa chỉ</td><td>Ô nào?</td><td>chỉ CPU → bộ nhớ</td><td>Cỡ không gian địa chỉ (2^n)</td></tr>
<tr><td>Dữ liệu</td><td>Giá trị nào?</td><td>hai chiều</td><td>Số byte mỗi lần truy cập (cỡ từ)</td></tr>
<tr><td>Điều khiển</td><td>Đọc hay ghi, đã sẵn sàng chưa?</td><td>chủ yếu CPU → bộ nhớ, kèm hồi đáp</td><td>Có những thao tác nào</td></tr>
</table>
<p class="meo">💡 Ba câu hỏi, ba bus: <strong>Ở ĐÂU</strong> (địa chỉ) · <strong>CÁI GÌ</strong> (dữ liệu) · <strong>THẾ NÀO/KHI NÀO</strong> (điều khiển). Nếu đề hỏi các bus mà bạn chỉ nhớ nổi hai, thì gần như chắc chắn bạn quên bus điều khiển — nó là cái không có hình ảnh trực quan nào để bám.</p>`],

      [44, 'Connecting I/O devices',
        `<p class="y-chinh">🎯 The reason I/O devices do not simply plug into the three buses of slide 43: they are <strong>electromechanical, magnetic or optical</strong> and <strong>operate at a much slower speed than the CPU/memory</strong>. So an intermediary is needed, and devices are attached to the buses <strong>through input/output controllers or interfaces</strong> — <strong>one specific controller for each device</strong>.</p>
<ul>
<li><strong>Read Figure 1.29</strong> — the same three bus stripes now run past four boxes labelled <em>Keyboard controller</em>, <em>Monitor controller</em>, <em>Printer controller</em>, … , <em>Disk controller</em>, each with its device drawn underneath. The controllers touch the buses; the devices never do.</li>
<li><strong>Why speed alone forces this</strong> — a bus held for the 10 ms a disk needs to seek would stall every instruction fetch for about 30 million CPU cycles. The controller absorbs the wait so the bus stays free.</li>
<li><strong>Why "electromechanical" also forces it</strong> — these devices do not speak in bus voltages at bus timing. A disk speaks magnetic flux, a screen speaks pixels, a keyboard speaks switch closures. The controller is a translator as much as a buffer.</li>
<li><strong>What a controller really contains</strong> — a buffer (so data can wait), status registers (busy / ready / error), command registers (what to do next), and the electronics specific to that device. Slides 48–49 are entirely about how the CPU addresses those registers.</li>
<li><strong>"One specific controller for each device"</strong> — that is the textbook's model and it is why the next three slides introduce standards that share one controller among many devices: SCSI, FireWire and USB all exist to break exactly this one-per-device rule.</li>
<li><strong>Today's names for the same boxes</strong> — the GPU is a display controller, the NVMe controller is a disk controller, the Wi-Fi chip is a network controller. "Driver" is the software half of the same idea: the piece of the operating system that knows one controller's language.</li>
</ul>
<p class="dap-an">✅ Put a number on the mismatch. A 3 GHz CPU executes one instruction in about 0.33 ns. A hard disk answers a random request in about 10 ms = 10,000,000 ns. Ratio ≈ <strong>30,000,000 : 1</strong>. If the CPU simply waited, it would sit idle for thirty million instruction slots per disk read — which is precisely why controllers, buffers and interrupts exist, and why the operating system runs another program while the disk works.</p>
<p class="meo">💡 Remember the chain of custody: <em>device → controller → bus → CPU/memory</em>. Every question about I/O speed, addressing or interrupts is a question about one link in that chain, so identify the link before you answer.</p>`,
        `<p class="y-chinh">🎯 Lý do thiết bị vào/ra không cắm thẳng vào ba bus của slide 43: chúng là thiết bị <strong>cơ-điện, từ tính hoặc quang học</strong> và <strong>chạy chậm hơn CPU/bộ nhớ rất nhiều</strong>. Nên cần một khâu trung gian, và thiết bị được gắn vào các bus <strong>thông qua bộ điều khiển vào/ra (controller) hay giao diện (interface)</strong> — <strong>mỗi thiết bị một bộ điều khiển riêng</strong>.</p>
<ul>
<li><strong>Đọc hình 1.29</strong> — vẫn ba vệt bus ấy, nay chạy ngang qua bốn hộp ghi <em>Keyboard controller</em>, <em>Monitor controller</em>, <em>Printer controller</em>, … , <em>Disk controller</em>, mỗi hộp có thiết bị của nó vẽ bên dưới. Bộ điều khiển chạm vào bus; thiết bị thì không bao giờ.</li>
<li><strong>Vì sao riêng tốc độ đã buộc phải làm thế</strong> — giữ bus suốt 10 ms mà đĩa cần để dịch cần sẽ làm nghẽn mọi lần nạp lệnh trong khoảng 30 triệu chu kỳ CPU. Bộ điều khiển hứng lấy cái chờ ấy để bus được rảnh.</li>
<li><strong>Vì sao chữ "cơ-điện" cũng buộc phải làm thế</strong> — mấy thiết bị này không nói bằng mức điện áp và nhịp thời gian của bus. Đĩa nói bằng từ thông, màn hình nói bằng điểm ảnh, bàn phím nói bằng tiếp điểm đóng. Bộ điều khiển vừa là bộ đệm vừa là người phiên dịch.</li>
<li><strong>Bên trong một bộ điều khiển thật sự có gì</strong> — một bộ đệm (để dữ liệu có chỗ chờ), các thanh ghi trạng thái (bận / sẵn sàng / lỗi), các thanh ghi lệnh (việc tiếp theo phải làm gì), và phần mạch riêng của đúng thiết bị đó. Slide 48–49 nói trọn về chuyện CPU đánh địa chỉ tới những thanh ghi ấy thế nào.</li>
<li><strong>"Mỗi thiết bị một bộ điều khiển riêng"</strong> — đó là mô hình của sách, và cũng là lý do ba slide tiếp theo giới thiệu những chuẩn cho NHIỀU thiết bị dùng CHUNG một bộ điều khiển: SCSI, FireWire và USB đều sinh ra để phá đúng cái luật một-đổi-một này.</li>
<li><strong>Tên hôm nay của chính những cái hộp đó</strong> — GPU là bộ điều khiển hiển thị, chip NVMe là bộ điều khiển đĩa, chip Wi-Fi là bộ điều khiển mạng. "Driver" là nửa phần mềm của cùng ý tưởng: mẩu hệ điều hành biết nói tiếng của một bộ điều khiển.</li>
</ul>
<p class="dap-an">✅ Đặt một con số cho độ lệch này. CPU 3 GHz làm xong một lệnh trong khoảng 0,33 ns. Ổ cứng trả lời một yêu cầu ngẫu nhiên trong khoảng 10 ms = 10.000.000 ns. Tỷ lệ ≈ <strong>30.000.000 : 1</strong>. Nếu CPU cứ ngồi chờ thì mỗi lần đọc đĩa nó bỏ không ba mươi triệu suất lệnh — chính xác vì thế mới có bộ điều khiển, bộ đệm và ngắt, và vì thế hệ điều hành mới chạy chương trình khác trong lúc đĩa làm việc.</p>
<p class="meo">💡 Nhớ chuỗi bàn giao: <em>thiết bị → bộ điều khiển → bus → CPU/bộ nhớ</em>. Mọi câu hỏi về tốc độ vào/ra, về đánh địa chỉ hay về ngắt đều là câu hỏi về một mắt xích trong chuỗi ấy, nên hãy xác định mắt xích trước khi trả lời.</p>`],

      [45, 'SCSI controller to connect I/O devices',
        `<p class="y-chinh">🎯 The first of three real interface standards. The slide states: <strong>Small Computer System Interface (SCSI is created in 1984): 32 components</strong>. Figure 1.30 shows the shape that matters — a <strong>daisy chain</strong>: one SCSI controller on the bus, then Disk (ID = 5), CD-ROM (ID = 3), Scanner (ID = 4), Tape (ID = 2) strung in a line, with a <strong>Terminator</strong> at each end.</p>
<ul>
<li><strong>Daisy chain is the idea to take away</strong> — instead of one controller per device (slide 44), many devices share one controller by being chained one after another. That is how a single card can serve a whole rack of drives.</li>
<li><strong>Each device carries an ID</strong> — the numbers in the figure (5, 3, 4, 2) are not positions, they are identities set by jumpers or switches. Two devices with the same ID break the bus, and that was a classic real-world failure.</li>
<li><strong>The terminators are not decoration</strong> — a SCSI chain is an electrical transmission line, and an unterminated end reflects the signal back, corrupting data. Both ends must be terminated. "Forgot the terminator" was the most common SCSI support call of the 1990s.</li>
<li><strong>Read the figure's wiring too</strong> — the SCSI controller sits on the same three buses of slide 43, exactly where the per-device controllers sat in Figure 1.29. Nothing about the CPU's view changes; the sharing happens beyond the controller.</li>
<li><strong>Where SCSI lives today</strong> — the connector is gone from consumer machines, but the <em>command set</em> survives everywhere: SAS drives in servers, USB mass storage and iSCSI over networks all speak SCSI commands. The plug died; the language did not.</li>
</ul>
<p class="dap-an">✅ On the slide's numbers, stated carefully. <strong>The "32 components" figure does not match any standard SCSI variant.</strong> Narrow SCSI (SCSI-1 and SCSI-2, an 8-bit bus) allows <strong>8</strong> IDs, one of which is the controller, so 7 devices; Wide SCSI (16-bit) allows <strong>16</strong> IDs, so 15 devices. The date is also usually given as <strong>1986</strong>, when ANSI ratified X3.131-1986, with the work starting from Shugart's SASI around 1979–1981; "1984" is the draft period. Answer with the 8/16 IDs and cite the ANSI year — and mention that the slide says 32 rather than silently contradicting it.</p>
<p class="pitfall">⚠️ Do not confuse <em>number of IDs</em> with <em>number of devices</em>: the controller itself occupies one ID (conventionally ID 7, the highest priority). 8 IDs means 7 usable peripherals, not 8 — that off-by-one is a favourite exam trick.</p>`,
        `<p class="y-chinh">🎯 Chuẩn giao tiếp thật đầu tiên trong ba chuẩn. Slide ghi: <strong>Small Computer System Interface (SCSI ra đời năm 1984): 32 thành phần</strong>. Hình 1.30 cho thấy cái hình dạng đáng nhớ — một <strong>chuỗi hoa cúc (daisy chain)</strong>: một bộ điều khiển SCSI gắn lên bus, rồi Disk (ID = 5), CD-ROM (ID = 3), Scanner (ID = 4), Tape (ID = 2) móc nối tiếp thành hàng, hai đầu có <strong>Terminator</strong> (điện trở kết cuối).</p>
<ul>
<li><strong>Chuỗi nối tiếp mới là ý cần mang về</strong> — thay vì mỗi thiết bị một bộ điều khiển (slide 44), nhiều thiết bị dùng chung một bộ điều khiển bằng cách móc nối đuôi nhau. Nhờ vậy một tấm card phục vụ được cả giá đầy ổ đĩa.</li>
<li><strong>Mỗi thiết bị mang một ID</strong> — các số trong hình (5, 3, 4, 2) không phải vị trí, chúng là danh tính do người dùng đặt bằng jumper hoặc công tắc. Hai thiết bị trùng ID là hỏng cả bus, và đó từng là sự cố kinh điển ngoài đời.</li>
<li><strong>Terminator không phải đồ trang trí</strong> — một chuỗi SCSI là một đường truyền về mặt điện, đầu nào không kết cuối thì phản xạ tín hiệu ngược lại và làm hỏng dữ liệu. Phải kết cuối cả hai đầu. "Quên terminator" là cuộc gọi hỗ trợ SCSI phổ biến nhất những năm 1990.</li>
<li><strong>Đọc cả phần dây trong hình</strong> — bộ điều khiển SCSI nằm trên đúng ba bus của slide 43, đúng chỗ mà các bộ điều khiển từng-thiết-bị đứng trong hình 1.29. Dưới mắt CPU không có gì đổi; việc dùng chung xảy ra ở phía bên kia bộ điều khiển.</li>
<li><strong>SCSI hôm nay sống ở đâu</strong> — cái đầu cắm đã biến khỏi máy phổ thông, nhưng <em>tập lệnh</em> của nó thì sống khắp nơi: ổ SAS trong máy chủ, thiết bị lưu trữ USB và iSCSI chạy qua mạng đều nói lệnh SCSI. Cái phích chết, còn thứ tiếng thì không.</li>
</ul>
<p class="dap-an">✅ Về các con số của slide, nói cho cẩn thận. <strong>Con số "32 thành phần" không khớp với biến thể SCSI chuẩn nào.</strong> SCSI hẹp (SCSI-1 và SCSI-2, bus 8 bit) cho phép <strong>8</strong> ID, trong đó một ID là của chính bộ điều khiển, nên còn 7 thiết bị; Wide SCSI (16 bit) cho phép <strong>16</strong> ID, tức 15 thiết bị. Năm ra đời cũng thường được ghi là <strong>1986</strong>, khi ANSI phê chuẩn X3.131-1986, còn công việc bắt đầu từ chuẩn SASI của Shugart khoảng 1979–1981; "1984" là giai đoạn bản thảo. Khi làm bài hãy trả lời theo 8/16 ID và dẫn năm của ANSI — và nhớ NÊU RA rằng slide ghi 32, chứ đừng im lặng nói ngược lại nó.</p>
<p class="pitfall">⚠️ Đừng lẫn <em>số ID</em> với <em>số thiết bị</em>: chính bộ điều khiển chiếm một ID (theo quy ước là ID 7, mức ưu tiên cao nhất). 8 ID nghĩa là 7 thiết bị ngoại vi dùng được, không phải 8 — cái lệch một đơn vị này là mẹo ra đề rất được ưa chuộng.</p>`],

      [46, 'FireWire controller to connect I/O devices',
        `<p class="y-chinh">🎯 The second standard, given in one line: <strong>IEEE Standard 1394: 400 Mbps and 63 devices</strong>. Figure 1.31 shows the difference from SCSI at a glance — the FireWire controller sits on the buses, and below it the devices (Scanner, Printer, Disk, Tape, CD-ROM, DVD, Camera) hang in a <strong>tree</strong>, not a single line.</p>
<ul>
<li><strong>Both slide numbers are correct</strong> — IEEE 1394a does run at 400 Mbps (the marketing name was "FireWire 400"), and the bus does address up to 63 nodes. Later 1394b reached 800 Mbps and 1394-2008 up to 3.2 Gbps.</li>
<li><strong>Tree instead of chain</strong> — a device may itself have extra ports, so the topology branches. Compare SCSI: one line with two terminated ends. A tree can be extended anywhere, and there is nothing to terminate.</li>
<li><strong>Hot-pluggable, and that is new</strong> — SCSI generally required powering the machine down to add a device. FireWire devices can be attached and removed while the system runs; the bus re-enumerates itself and reassigns node IDs automatically. No jumpers, no manual IDs.</li>
<li><strong>Peer-to-peer, its real distinguishing feature</strong> — two FireWire devices can transfer to each other without the CPU mediating. A camera could write straight to a disk. USB of the same era could not do this; everything had to pass through the host.</li>
<li><strong>Isochronous transfer</strong> — FireWire can reserve guaranteed bandwidth for a stream. That is why it dominated digital video (DV camcorders): dropped frames are unacceptable, and a guaranteed slice beats a higher average rate.</li>
<li><strong>Why it lost anyway</strong> — FireWire ports cost more (each node needs more logic), and USB was already on every machine. Apple kept it longest, then replaced it with Thunderbolt — which, interestingly, brought back the peer-to-peer and guaranteed-bandwidth ideas.</li>
</ul>
<p class="dap-an">✅ Sanity-check the two numbers against the exam's favourite conversion. 400 Mbps = 400 ÷ 8 = <strong>50 MB/s</strong> at best — so a 10 GB video file needs at least 10,000 ÷ 50 = <strong>200 seconds</strong>, over three minutes, on a perfect bus. Compare a modern NVMe SSD at 7,000 MB/s: under 2 seconds. And 63 devices means 63 <em>nodes</em>, addressed with 6 bits (2^6 = 64, one value reserved for broadcast) — which is exactly why the number is 63 and not 64.</p>
<p class="meo">💡 Remember the three standards by their shapes: <strong>SCSI = a line</strong> (chain, terminated), <strong>FireWire = a tree of peers</strong> (no host required), <strong>USB = a tree with a root</strong> (everything through the host). Draw the three shapes and you have answered most comparison questions.</p>`,
        `<p class="y-chinh">🎯 Chuẩn thứ hai, gói trong một dòng: <strong>Chuẩn IEEE 1394: 400 Mbps và 63 thiết bị</strong>. Hình 1.31 cho thấy khác biệt với SCSI ngay từ cái nhìn đầu — bộ điều khiển FireWire nằm trên các bus, và bên dưới nó các thiết bị (Scanner, Printer, Disk, Tape, CD-ROM, DVD, Camera) treo thành <strong>cây</strong>, không phải một hàng dọc.</p>
<ul>
<li><strong>Cả hai con số của slide đều đúng</strong> — IEEE 1394a quả thật chạy 400 Mbps (tên thương mại là "FireWire 400"), và bus này đánh địa chỉ được tới 63 nút. Bản 1394b sau đó đạt 800 Mbps và 1394-2008 lên tới 3,2 Gbps.</li>
<li><strong>Cây thay cho chuỗi</strong> — một thiết bị có thể tự mang thêm cổng, nên hình trạng phân nhánh được. So với SCSI: một hàng dọc với hai đầu phải kết cuối. Cây thì nối thêm ở đâu cũng được, và chẳng có gì phải kết cuối.</li>
<li><strong>Cắm nóng được, và đó là điều mới</strong> — SCSI thường bắt tắt máy mới gắn thêm thiết bị. Thiết bị FireWire cắm vào rút ra khi máy đang chạy; bus tự đếm lại và tự cấp lại số nút. Không jumper, không đặt ID bằng tay.</li>
<li><strong>Ngang hàng (peer-to-peer), nét riêng thật sự của nó</strong> — hai thiết bị FireWire chuyển dữ liệu thẳng cho nhau mà CPU không phải làm trung gian. Máy quay có thể ghi thẳng xuống ổ đĩa. USB cùng thời không làm được; mọi thứ phải đi qua máy chủ.</li>
<li><strong>Truyền đẳng thời (isochronous)</strong> — FireWire đặt trước được một phần băng thông bảo đảm cho một luồng. Vì thế nó thống trị mảng video số (máy quay DV): rơi khung hình là không chấp nhận được, và một lát bảo đảm quý hơn một tốc độ trung bình cao hơn.</li>
<li><strong>Vậy mà nó vẫn thua</strong> — cổng FireWire đắt hơn (mỗi nút cần nhiều mạch logic hơn), còn USB thì đã có sẵn trên mọi máy. Apple giữ nó lâu nhất, rồi thay bằng Thunderbolt — thứ mà thú vị thay, đã mang trả lại cả ý tưởng ngang hàng lẫn ý tưởng băng thông bảo đảm.</li>
</ul>
<p class="dap-an">✅ Kiểm chéo hai con số bằng phép đổi đơn vị mà đề thi rất thích. 400 Mbps = 400 ÷ 8 = <strong>50 MB/s</strong> ở mức lý tưởng — nên một tệp video 10 GB cần tối thiểu 10.000 ÷ 50 = <strong>200 giây</strong>, hơn ba phút, trên một cái bus hoàn hảo. Đem so SSD NVMe hôm nay ở 7.000 MB/s: chưa tới 2 giây. Còn 63 thiết bị nghĩa là 63 <em>nút</em>, đánh địa chỉ bằng 6 bit (2^6 = 64, một giá trị để dành cho phát quảng bá) — đó đúng là lý do con số là 63 chứ không phải 64.</p>
<p class="meo">💡 Nhớ ba chuẩn bằng HÌNH DẠNG của chúng: <strong>SCSI = một đường thẳng</strong> (chuỗi, có kết cuối), <strong>FireWire = cây các nút ngang hàng</strong> (không cần máy chủ), <strong>USB = cây có gốc</strong> (mọi thứ đi qua máy chủ). Vẽ được ba hình đó là trả lời được phần lớn câu hỏi so sánh.</p>`],

      [47, 'USB controller to connect I/O devices',
        `<p class="y-chinh">🎯 The standard that won. The headline inside Figure 1.32 reads <strong>Universal Serial Bus: 480 Mbps and 127 devices</strong>, and the picture shows the decisive structure: a <strong>USB Controller (Root hub)</strong> at the top, then Devices and <strong>Hubs</strong>, and hubs of hubs below them — a tree with exactly one root.</p>
<ul>
<li><strong>Both numbers are right, for USB 2.0</strong> — 480 Mbps is High-Speed USB 2.0 (2000). USB 1.1 was 12 Mbps, USB 3.0 is 5 Gbps, USB 3.2 Gen 2×2 is 20 Gbps, USB4 is 40 Gbps. If an exam says "USB is 480 Mbps", the unstated word is "2.0".</li>
<li><strong>127 devices, and where the number comes from</strong> — USB addresses are 7 bits, so 2^7 = 128 values, of which address 0 is reserved for a device that has just been plugged in and not yet configured. 128 − 1 = <strong>127</strong>.</li>
<li><strong>Read the hub hierarchy in the figure</strong> — the root hub is inside the controller; a hub can plug into another hub, which is why four ports on a laptop can become dozens. The spec allows five levels of hubs, so the tree is deep but not unlimited.</li>
<li><strong>Host-centric, unlike FireWire</strong> — in USB 2.0 the host starts every transfer; devices never speak spontaneously and never speak to each other. That makes devices cheaper and dumber, which is exactly why USB won on price. (USB On-The-Go and later USB-C partially lifted this.)</li>
<li><strong>It carries power, and that mattered more than anyone expected</strong> — a USB port supplies 5 V, which killed the separate power brick for mice, keyboards, sticks and external disks. USB-C Power Delivery now carries up to 240 W and charges laptops.</li>
<li><strong>"Universal" was a promise, and it was kept</strong> — before USB, every device had its own port: PS/2 for keyboard and mouse, DB-25 parallel for printers, DB-9 serial for modems, SCSI for disks, game port for joysticks. USB replaced all of them with one connector and hot-plugging.</li>
</ul>
<table>
<tr><th>Standard</th><th>Topology</th><th>Speed on the slide</th><th>Max devices</th><th>Alive in 2026?</th></tr>
<tr><td>SCSI (1984/1986)</td><td>daisy chain, terminated</td><td>5–320 MB/s by version</td><td>8 or 16 IDs</td><td>Only as a command set (SAS, iSCSI)</td></tr>
<tr><td>FireWire (IEEE 1394)</td><td>tree, peer-to-peer</td><td>400 Mbps</td><td>63 nodes</td><td>Practically dead; ideas live in Thunderbolt</td></tr>
<tr><td>USB (2.0)</td><td>tree with one root hub</td><td>480 Mbps</td><td>127 devices</td><td>Universal — USB4 at 40 Gbps</td></tr>
</table>
<p class="dap-an">✅ Why USB beat FireWire even while being slower on paper: 480 Mbps vs 400 Mbps is a 20% difference, but FireWire's peer-to-peer logic had to live in <em>every</em> device, while USB pushed all the intelligence into the host. Cheaper device, cheaper cable, already-present port. The practical lesson — and a good exam sentence — is that <strong>an interface standard wins on total system cost and ubiquity, not on peak bandwidth.</strong></p>`,
        `<p class="y-chinh">🎯 Chuẩn đã thắng cuộc. Dòng tiêu đề bên trong hình 1.32 ghi <strong>Universal Serial Bus: 480 Mbps và 127 thiết bị</strong>, và bức hình cho thấy cấu trúc quyết định: một <strong>USB Controller (Root hub — bộ chia gốc)</strong> ở trên, rồi tới các Device và các <strong>Hub</strong>, rồi hub của hub bên dưới nữa — một cái cây có đúng một gốc.</p>
<ul>
<li><strong>Cả hai con số đều đúng, với USB 2.0</strong> — 480 Mbps là USB 2.0 tốc độ cao (năm 2000). USB 1.1 là 12 Mbps, USB 3.0 là 5 Gbps, USB 3.2 Gen 2×2 là 20 Gbps, USB4 là 40 Gbps. Nếu đề nói "USB là 480 Mbps" thì chữ bị bỏ quên là "2.0".</li>
<li><strong>127 thiết bị, và con số ấy ở đâu ra</strong> — địa chỉ USB dài 7 bit, tức 2^7 = 128 giá trị, trong đó địa chỉ 0 để dành cho thiết bị vừa cắm vào mà chưa được cấu hình. 128 − 1 = <strong>127</strong>.</li>
<li><strong>Đọc tầng hub trong hình</strong> — hub gốc nằm bên trong bộ điều khiển; một hub cắm được vào hub khác, nên bốn cổng trên máy xách tay hoá thành hàng chục cổng. Đặc tả cho phép năm tầng hub, nên cây sâu nhưng không vô hạn.</li>
<li><strong>Lấy máy chủ làm trung tâm, khác FireWire</strong> — trong USB 2.0, máy chủ khởi xướng mọi cuộc truyền; thiết bị không bao giờ tự lên tiếng và không nói chuyện với nhau. Nhờ đó thiết bị rẻ hơn và "ngu" hơn, và đó đúng là lý do USB thắng về giá. (USB On-The-Go rồi USB-C về sau đã nới bớt điều này.)</li>
<li><strong>Nó tải cả điện, và điều đó quan trọng hơn mọi người tưởng</strong> — một cổng USB cấp 5 V, thứ đã khai tử cục nguồn rời cho chuột, bàn phím, USB và ổ cứng ngoài. USB-C Power Delivery nay tải tới 240 W và sạc được máy tính xách tay.</li>
<li><strong>Chữ "Universal" là một lời hứa, và nó đã được giữ</strong> — trước USB, mỗi thiết bị một cổng riêng: PS/2 cho bàn phím và chuột, cổng song song DB-25 cho máy in, cổng nối tiếp DB-9 cho modem, SCSI cho đĩa, cổng game cho cần điều khiển. USB thay tất cả bằng một đầu cắm và khả năng cắm nóng.</li>
</ul>
<table>
<tr><th>Chuẩn</th><th>Hình trạng</th><th>Tốc độ ghi trên slide</th><th>Số thiết bị tối đa</th><th>Còn sống năm 2026?</th></tr>
<tr><td>SCSI (1984/1986)</td><td>chuỗi nối tiếp, có kết cuối</td><td>5–320 MB/s tuỳ phiên bản</td><td>8 hoặc 16 ID</td><td>Chỉ còn ở dạng tập lệnh (SAS, iSCSI)</td></tr>
<tr><td>FireWire (IEEE 1394)</td><td>cây, ngang hàng</td><td>400 Mbps</td><td>63 nút</td><td>Gần như chết; ý tưởng sống trong Thunderbolt</td></tr>
<tr><td>USB (2.0)</td><td>cây với một hub gốc</td><td>480 Mbps</td><td>127 thiết bị</td><td>Phổ quát — USB4 đạt 40 Gbps</td></tr>
</table>
<p class="dap-an">✅ Vì sao USB hạ FireWire dù trên giấy chỉ nhanh hơn chút xíu: 480 Mbps so với 400 Mbps chỉ chênh 20%, nhưng phần logic ngang hàng của FireWire phải nằm trong <em>mọi</em> thiết bị, còn USB dồn hết phần thông minh về máy chủ. Thiết bị rẻ hơn, cáp rẻ hơn, cổng thì đã có sẵn. Bài học thực tế — và là một câu trả lời thi rất được điểm — là <strong>một chuẩn giao tiếp thắng nhờ tổng chi phí hệ thống và độ phổ biến, chứ không nhờ băng thông đỉnh.</strong></p>`],

      [48, 'Addressing input/output devices',
        `<p class="y-chinh">🎯 The CPU <strong>usually uses the same bus</strong> to reach main memory and I/O devices — <strong>the only difference is the instruction</strong>. If the instruction refers to a word in main memory the transfer is CPU ↔ memory; if it identifies an I/O device the transfer is CPU ↔ device. And there are <strong>two methods: isolated I/O and memory-mapped I/O</strong>.</p>
<ul>
<li><strong>What is actually being addressed</strong> — not the disk platter or the screen glass, but the <em>registers inside the controller</em> from slide 44: its data register, status register and command register. "Addressing an I/O device" always means addressing those.</li>
<li><strong>Isolated I/O — separate worlds</strong> — the device registers have their own address space, completely separate from memory addresses. Address 101 as an I/O address and address 101 as a memory address are different places, and the CPU tells them apart by using <em>different instructions</em> (typically <code>IN</code> and <code>OUT</code> versus <code>LOAD</code> and <code>STORE</code>).</li>
<li><strong>Memory-mapped I/O — one world</strong> — the device registers are given addresses carved out of the ordinary memory address space. No special instructions are needed: writing to address 64001 with an ordinary <code>STORE</code> sends a byte to the controller. The cost is that those addresses are no longer usable for real memory.</li>
<li><strong>The trade-off in one line</strong> — isolated I/O keeps all memory addresses for memory but needs extra instructions and an extra control line; memory-mapped I/O reuses every existing instruction but eats part of the address space.</li>
<li><strong>What real machines do</strong> — x86 has both: the <code>IN</code>/<code>OUT</code> instructions with a 16-bit isolated I/O space (a legacy that survives from the 8086), plus heavy use of memory-mapped I/O for anything modern. ARM has <em>only</em> memory-mapped I/O — there is no <code>IN</code> instruction at all, which is one concrete difference behind the CISC/RISC contrast of slides 52–53.</li>
<li><strong>Why memory-mapped won</strong> — with a 64-bit address space, giving up a region of addresses costs nothing, while every addressing mode, every pointer and every C structure suddenly works on device registers too. A driver can simply declare a pointer and assign to it.</li>
</ul>
<p class="meo">💡 Remember it as two buildings versus one: <em>isolated</em> = two separate buildings with their own room numbers, and you must say which building you mean (a different instruction); <em>memory-mapped</em> = one building where some rooms happen to be devices, so the room number alone is enough.</p>`,
        `<p class="y-chinh">🎯 CPU <strong>thường dùng chính cái bus ấy</strong> để với tới cả bộ nhớ chính lẫn thiết bị vào/ra — <strong>khác biệt duy nhất nằm ở lệnh</strong>. Nếu lệnh trỏ tới một từ trong bộ nhớ chính thì cuộc truyền là CPU ↔ bộ nhớ; nếu lệnh chỉ định một thiết bị vào/ra thì cuộc truyền là CPU ↔ thiết bị. Và có <strong>hai phương pháp: vào/ra cô lập (isolated I/O) và vào/ra ánh xạ bộ nhớ (memory-mapped I/O)</strong>.</p>
<ul>
<li><strong>Thứ thật sự bị đánh địa chỉ là gì</strong> — không phải mặt đĩa hay tấm kính màn hình, mà là <em>các thanh ghi bên trong bộ điều khiển</em> ở slide 44: thanh ghi dữ liệu, thanh ghi trạng thái và thanh ghi lệnh. "Đánh địa chỉ thiết bị vào/ra" luôn có nghĩa là đánh địa chỉ tới mấy cái đó.</li>
<li><strong>Vào/ra cô lập — hai thế giới riêng</strong> — thanh ghi thiết bị có không gian địa chỉ riêng, tách hẳn khỏi địa chỉ bộ nhớ. Địa chỉ 101 với tư cách địa chỉ vào/ra và địa chỉ 101 với tư cách địa chỉ bộ nhớ là hai nơi khác nhau, và CPU phân biệt chúng bằng cách dùng <em>lệnh khác nhau</em> (thường là <code>IN</code> và <code>OUT</code> so với <code>LOAD</code> và <code>STORE</code>).</li>
<li><strong>Vào/ra ánh xạ bộ nhớ — một thế giới chung</strong> — thanh ghi thiết bị được cấp địa chỉ cắt ra từ chính không gian địa chỉ bộ nhớ thông thường. Không cần lệnh đặc biệt nào: ghi vào địa chỉ 64001 bằng một lệnh <code>STORE</code> bình thường là gửi một byte tới bộ điều khiển. Cái giá là những địa chỉ ấy không còn dùng cho bộ nhớ thật được nữa.</li>
<li><strong>Đánh đổi gói trong một câu</strong> — vào/ra cô lập giữ nguyên toàn bộ địa chỉ cho bộ nhớ nhưng cần thêm lệnh và thêm một đường điều khiển; vào/ra ánh xạ bộ nhớ dùng lại được mọi lệnh sẵn có nhưng ăn mất một phần không gian địa chỉ.</li>
<li><strong>Máy thật làm thế nào</strong> — x86 có cả hai: cặp lệnh <code>IN</code>/<code>OUT</code> với không gian vào/ra cô lập 16 bit (di sản còn lại từ 8086), cộng với việc dùng ánh xạ bộ nhớ rất nhiều cho mọi thứ hiện đại. ARM thì <em>chỉ</em> có vào/ra ánh xạ bộ nhớ — không hề có lệnh <code>IN</code> nào, và đó là một khác biệt cụ thể nằm sau sự tương phản CISC/RISC ở slide 52–53.</li>
<li><strong>Vì sao ánh xạ bộ nhớ thắng</strong> — với không gian địa chỉ 64 bit, cho đi một vùng địa chỉ chẳng tốn gì, đổi lại mọi chế độ địa chỉ, mọi con trỏ và mọi struct trong C bỗng dùng được luôn với thanh ghi thiết bị. Trình điều khiển chỉ việc khai một con trỏ rồi gán vào đó.</li>
</ul>
<p class="meo">💡 Nhớ bằng hình ảnh hai toà nhà so với một toà: <em>cô lập</em> = hai toà nhà riêng, mỗi toà có hệ số phòng riêng, nên phải nói rõ bạn muốn toà nào (dùng lệnh khác); <em>ánh xạ bộ nhớ</em> = một toà nhà duy nhất mà vài căn phòng tình cờ là thiết bị, nên chỉ cần số phòng là đủ.</p>`],

      [49, 'Addressing input/output devices (cont)',
        `<p class="y-chinh">🎯 Figure 1.33 puts the two methods one above the other with the same worked numbers, and the numbers are the whole explanation. <strong>Isolated I/O:</strong> the CPU issues <em>Read 101</em> to memory and <em>Input 101</em> to the controller — same number 101, two different instructions. <strong>Memory-mapped I/O:</strong> the CPU issues <em>Read 101</em> to memory and <em>Read 64001</em> to the controller — same instruction, two different numbers.</p>
<ul>
<li><strong>Top diagram, read carefully</strong> — the controller's four registers are labelled 101, 102, 103, 104: a small address space of its own, starting from 1. Memory also has a location 101. No collision occurs, because the instruction word says which space is meant.</li>
<li><strong>Bottom diagram, read carefully</strong> — the controller's registers are now 64001, 64002, 64003, 64004, and memory is drawn as running up to 64000. The device addresses continue where memory stops: one single number line, split between real memory and devices.</li>
<li><strong>The figure is telling you the cost</strong> — in the bottom picture, addresses 64001 upwards can never hold data. That is the price of memory-mapped I/O, and the diagram makes it visible by drawing memory ending at exactly 64000.</li>
<li><strong>Which control lines change</strong> — isolated I/O needs an extra control signal saying "this address is an I/O address" (on the 8086 this is the M/IO line). Memory-mapped I/O needs no such line, and the address decoder alone routes the request.</li>
<li><strong>Consequences for programming</strong> — with isolated I/O, only privileged assembly instructions can touch a device, so a C program literally cannot. With memory-mapped I/O, a driver writes <code>*(volatile unsigned char *)0xFA000000 = 0x41;</code> — ordinary C, and the <code>volatile</code> keyword exists precisely to stop the compiler from optimising such device accesses away.</li>
<li><strong>Which to choose in an exam answer</strong> — say: isolated I/O preserves the full memory address space and cleanly separates the two kinds of access, but needs extra instructions and hardware; memory-mapped I/O needs no new instructions and gives full addressing power over devices, at the cost of address space. Then add that modern RISC machines use memory-mapped exclusively.</li>
</ul>
<table>
<tr><th>Criterion</th><th>Isolated I/O</th><th>Memory-mapped I/O</th></tr>
<tr><td>Address spaces</td><td>two, separate</td><td>one, shared</td></tr>
<tr><td>Instructions used</td><td>special (IN / OUT)</td><td>ordinary LOAD / STORE</td></tr>
<tr><td>Extra control line</td><td>needed (M/IO)</td><td>not needed</td></tr>
<tr><td>Memory address space lost</td><td>none</td><td>the region given to devices</td></tr>
<tr><td>Figure 1.33 example</td><td>Input 101</td><td>Read 64001</td></tr>
<tr><td>Real machines</td><td>x86 legacy ports</td><td>ARM, RISC-V, and all modern x86 devices</td></tr>
</table>
<p class="pitfall">⚠️ The trap in this figure is that <strong>101 appears in both diagrams</strong> and means something different each time. In the top picture 101 is an I/O port number; in the bottom picture 101 is a genuine memory address, and the device is at 64001. If you read "101" without reading the instruction next to it, you will answer the wrong method.</p>`,
        `<p class="y-chinh">🎯 Hình 1.33 đặt hai phương pháp chồng lên nhau với cùng bộ số minh hoạ, và chính bộ số ấy là toàn bộ lời giải thích. <strong>Vào/ra cô lập:</strong> CPU phát <em>Read 101</em> tới bộ nhớ và <em>Input 101</em> tới bộ điều khiển — cùng con số 101, hai lệnh khác nhau. <strong>Vào/ra ánh xạ bộ nhớ:</strong> CPU phát <em>Read 101</em> tới bộ nhớ và <em>Read 64001</em> tới bộ điều khiển — cùng một lệnh, hai con số khác nhau.</p>
<ul>
<li><strong>Đọc kỹ sơ đồ trên</strong> — bốn thanh ghi của bộ điều khiển được đánh 101, 102, 103, 104: một không gian địa chỉ nhỏ của riêng nó, bắt đầu từ 1. Bộ nhớ cũng có ô 101. Không hề va chạm, vì bản thân lệnh đã nói rõ đang muốn nói tới không gian nào.</li>
<li><strong>Đọc kỹ sơ đồ dưới</strong> — thanh ghi của bộ điều khiển giờ là 64001, 64002, 64003, 64004, còn bộ nhớ được vẽ chạy tới 64000. Địa chỉ thiết bị nối tiếp ngay chỗ bộ nhớ dừng lại: một trục số duy nhất, chia đôi giữa bộ nhớ thật và thiết bị.</li>
<li><strong>Bức hình đang chỉ cho bạn thấy cái giá</strong> — ở sơ đồ dưới, từ địa chỉ 64001 trở lên vĩnh viễn không chứa dữ liệu được. Đó là giá của vào/ra ánh xạ bộ nhớ, và hình vẽ làm nó hiện hình bằng cách cho bộ nhớ kết thúc đúng ở 64000.</li>
<li><strong>Đường điều khiển nào thay đổi</strong> — vào/ra cô lập cần thêm một tín hiệu điều khiển nói "địa chỉ này là địa chỉ vào/ra" (trên 8086 đó là chân M/IO). Vào/ra ánh xạ bộ nhớ không cần đường nào như thế, chỉ riêng bộ giải mã địa chỉ đã định tuyến được yêu cầu.</li>
<li><strong>Hệ quả với lập trình</strong> — với vào/ra cô lập, chỉ lệnh hợp ngữ có đặc quyền mới chạm được vào thiết bị, nên một chương trình C thì đúng nghĩa là chịu. Với ánh xạ bộ nhớ, trình điều khiển viết <code>*(volatile unsigned char *)0xFA000000 = 0x41;</code> — C thuần tuý, và từ khoá <code>volatile</code> tồn tại chính là để trình biên dịch đừng tối ưu mất những lần truy cập thiết bị như vậy.</li>
<li><strong>Trong bài thi nên chọn thế nào</strong> — hãy viết: vào/ra cô lập giữ nguyên trọn không gian địa chỉ bộ nhớ và tách bạch hai loại truy cập, nhưng cần thêm lệnh và thêm phần cứng; vào/ra ánh xạ bộ nhớ không cần lệnh mới và cho dùng trọn sức mạnh địa chỉ hoá với thiết bị, đổi lại mất một phần không gian địa chỉ. Rồi nói thêm rằng máy RISC hiện đại chỉ dùng ánh xạ bộ nhớ.</li>
</ul>
<table>
<tr><th>Tiêu chí</th><th>Vào/ra cô lập</th><th>Vào/ra ánh xạ bộ nhớ</th></tr>
<tr><td>Số không gian địa chỉ</td><td>hai, tách rời</td><td>một, dùng chung</td></tr>
<tr><td>Lệnh sử dụng</td><td>lệnh riêng (IN / OUT)</td><td>LOAD / STORE thông thường</td></tr>
<tr><td>Đường điều khiển thêm</td><td>cần (M/IO)</td><td>không cần</td></tr>
<tr><td>Mất không gian địa chỉ bộ nhớ</td><td>không mất</td><td>mất vùng cấp cho thiết bị</td></tr>
<tr><td>Ví dụ trong hình 1.33</td><td>Input 101</td><td>Read 64001</td></tr>
<tr><td>Máy thật</td><td>các cổng di sản của x86</td><td>ARM, RISC-V, và mọi thiết bị x86 hiện đại</td></tr>
</table>
<p class="pitfall">⚠️ Bẫy của bức hình này là <strong>số 101 xuất hiện ở CẢ HAI sơ đồ</strong> mà mỗi lần mang một nghĩa khác. Ở hình trên, 101 là số hiệu cổng vào/ra; ở hình dưới, 101 là địa chỉ bộ nhớ thật còn thiết bị nằm ở 64001. Đọc "101" mà không đọc cái lệnh đứng cạnh nó thì sẽ trả lời nhầm phương pháp.</p>`],

      [50, '9 - Different architectures',
        `<p class="y-chinh">🎯 The final section of the chapter. Everything so far described <em>one</em> simple computer; section 9 admits that real machines differ, and introduces the four ideas that separate them: <strong>CISC, RISC, pipelining and parallel processing</strong>.</p>
<ul>
<li><strong>Architecture versus organisation</strong> — <em>architecture</em> is what the programmer sees (the instruction set, the registers, the addressing modes); <em>organisation</em> is how it is built (pipelines, caches, how many ALUs). Two machines can share an architecture and have utterly different organisations — that is exactly how an Intel and an AMD chip both run Windows.</li>
<li><strong>What the next nine slides do</strong> — 52 and 53 contrast two instruction-set philosophies; 54 speeds up one instruction stream by overlapping stages; 55–59 multiply the hardware itself and classify the result.</li>
<li><strong>Two more architectures worth naming, though the deck does not</strong> — <em>von Neumann</em> (one memory holding both program and data, slide 12) and <em>Harvard</em> (separate program and data memories). Look back at Figures 1.34 and 1.35 on the next slides: both draw "Program Memory" and "Data Memory" as separate boxes, so both are drawn in Harvard style.</li>
<li><strong>Why Harvard exists</strong> — with one memory, the CPU cannot fetch an instruction and read data in the same cycle; with two, it can. Real CPUs get the best of both by being von Neumann in main memory and Harvard in the caches (a separate L1-instruction and L1-data cache) — the "modified Harvard" design.</li>
<li><strong>The theme that unifies the section</strong> — every idea here trades something for speed: CISC trades chip complexity for programmer convenience, RISC trades program length for simplicity, pipelining trades predictability for throughput, parallelism trades programming difficulty for raw power.</li>
</ul>
<p class="meo">💡 As you read slides 52–59, tag each idea with <em>what it multiplies</em>: RISC/CISC multiplies nothing (it reshapes the instruction set), pipelining multiplies <em>overlap in time</em>, parallel processing multiplies <em>hardware in space</em>. Those three answers cover most of the section's exam questions.</p>`,
        `<p class="y-chinh">🎯 Mục cuối của chương. Từ đầu tới giờ ta mô tả <em>một</em> máy tính đơn giản; mục 9 thừa nhận rằng máy thật thì khác nhau, và giới thiệu bốn ý tưởng phân biệt chúng: <strong>CISC, RISC, pipelining (ống dẫn lệnh) và xử lý song song</strong>.</p>
<ul>
<li><strong>Kiến trúc khác tổ chức</strong> — <em>kiến trúc</em> là thứ người lập trình nhìn thấy (tập lệnh, thanh ghi, các chế độ địa chỉ); <em>tổ chức</em> là cách nó được dựng nên (ống dẫn, cache, có bao nhiêu ALU). Hai máy có thể chung kiến trúc mà tổ chức khác hẳn nhau — đó đúng là cách một con chip Intel và một con AMD cùng chạy được Windows.</li>
<li><strong>Chín slide tới làm gì</strong> — 52 và 53 đối chiếu hai triết lý tập lệnh; 54 tăng tốc một dòng lệnh bằng cách chồng lấn các giai đoạn; 55–59 nhân bản chính phần cứng lên rồi phân loại kết quả.</li>
<li><strong>Còn hai kiến trúc đáng gọi tên nữa mà deck không nhắc</strong> — <em>von Neumann</em> (một bộ nhớ chứa cả chương trình lẫn dữ liệu, slide 12) và <em>Harvard</em> (bộ nhớ chương trình tách khỏi bộ nhớ dữ liệu). Hãy nhìn lại hình 1.34 và 1.35 ở hai slide sau: cả hai đều vẽ "Program Memory" và "Data Memory" thành hai hộp riêng, tức cả hai đều vẽ theo kiểu Harvard.</li>
<li><strong>Vì sao có Harvard</strong> — với một bộ nhớ, CPU không thể vừa nạp lệnh vừa đọc dữ liệu trong cùng một chu kỳ; với hai bộ nhớ thì được. CPU thật lấy được cái hay của cả hai bằng cách là von Neumann ở bộ nhớ chính và là Harvard ở tầng cache (tách riêng cache L1 lệnh và cache L1 dữ liệu) — thiết kế "Harvard cải biên".</li>
<li><strong>Sợi chỉ xuyên suốt cả mục</strong> — mọi ý tưởng ở đây đều đánh đổi một thứ gì đó lấy tốc độ: CISC đổi độ phức tạp của chip lấy sự tiện cho người lập trình, RISC đổi độ dài chương trình lấy sự đơn giản, pipelining đổi tính dễ đoán lấy thông lượng, song song đổi độ khó lập trình lấy sức mạnh thô.</li>
</ul>
<p class="meo">💡 Khi đọc slide 52–59, hãy dán nhãn cho mỗi ý tưởng theo <em>thứ mà nó nhân lên</em>: RISC/CISC không nhân gì cả (nó nắn lại tập lệnh), pipelining nhân <em>sự chồng lấn theo thời gian</em>, xử lý song song nhân <em>phần cứng theo không gian</em>. Ba câu trả lời đó phủ gần hết câu hỏi thi của mục này.</p>`],

      [51, 'Introduction',
        `<p class="y-chinh">🎯 Two sentences of framing: <strong>the architecture and organization of computers has gone through many changes in recent decades</strong>, and this section discusses <strong>common architectures that differ from the simple computer architecture discussed earlier</strong>.</p>
<ul>
<li><strong>Read "differ from the simple one" as a warning</strong> — everything you learned in sections 4–8 is still true, but it is the <em>model</em>, not any actual chip. The next slides say where reality departs from the model.</li>
<li><strong>What "recent decades" actually contains</strong> — CISC in the 1970s (VAX, x86), RISC in the early 1980s (MIPS, SPARC, ARM), pipelining going mainstream in the late 1980s, superscalar in the 1990s, and multicore from 2005 onwards when clock speeds stopped rising.</li>
<li><strong>Why clock speed stopped being the answer</strong> — power grows roughly with the cube of frequency, and the heat became unremovable at around 4 GHz. So the industry stopped making one core faster and started giving you more cores, which is why section 9 ends on parallel processing.</li>
<li><strong>Two measures you must not confuse</strong> — <em>latency</em> is how long one instruction takes; <em>throughput</em> is how many finish per second. Pipelining and parallelism both raise throughput without lowering latency at all, and slide 54 says so in the word "throughput".</li>
<li><strong>The architectures in your pocket</strong> — the phone in your hand is ARM (RISC), the MacBook is ARM too since the M1, most Windows laptops and all cloud servers are x86-64 (CISC on the surface, RISC inside). Slides 52–53 are about a distinction you carry around daily.</li>
</ul>
<p class="meo">💡 Keep one question ready for every architecture in this section: <em>does it make one instruction faster, or more instructions finish per second?</em> Almost everything modern does the second, and saying so explicitly is usually what earns the mark.</p>`,
        `<p class="y-chinh">🎯 Hai câu đóng khung: <strong>kiến trúc và tổ chức máy tính đã trải qua nhiều thay đổi trong vài thập niên gần đây</strong>, và mục này bàn về <strong>những kiến trúc phổ biến khác với kiến trúc máy tính đơn giản đã học ở trên</strong>.</p>
<ul>
<li><strong>Hãy đọc cụm "khác với cái đơn giản" như một lời cảnh báo</strong> — mọi thứ bạn học ở mục 4–8 vẫn đúng, nhưng đó là <em>mô hình</em>, không phải một con chip cụ thể nào. Các slide tới nói cho bạn biết thực tế rẽ khỏi mô hình ở chỗ nào.</li>
<li><strong>"Vài thập niên gần đây" thật ra gồm những gì</strong> — CISC thập niên 1970 (VAX, x86), RISC đầu thập niên 1980 (MIPS, SPARC, ARM), pipelining thành phổ thông cuối 1980, siêu vô hướng (superscalar) thập niên 1990, và đa lõi từ 2005 trở đi khi tốc độ xung nhịp thôi tăng.</li>
<li><strong>Vì sao xung nhịp thôi là câu trả lời</strong> — công suất tăng xấp xỉ theo luỹ thừa ba của tần số, và tới quanh 4 GHz thì nhiệt không tản đi đâu được nữa. Thế là ngành công nghiệp thôi làm một lõi nhanh hơn mà chuyển sang cho bạn nhiều lõi hơn — vì thế mục 9 mới kết thúc ở xử lý song song.</li>
<li><strong>Hai đại lượng tuyệt đối đừng lẫn</strong> — <em>độ trễ</em> (latency) là một lệnh mất bao lâu; <em>thông lượng</em> (throughput) là mỗi giây xong bao nhiêu lệnh. Pipelining và song song đều nâng thông lượng mà không hề hạ độ trễ, và slide 54 nói đúng điều đó qua chữ "throughput".</li>
<li><strong>Những kiến trúc đang nằm trong túi bạn</strong> — cái điện thoại trên tay là ARM (RISC), máy MacBook cũng là ARM kể từ đời M1, còn phần lớn máy Windows và toàn bộ máy chủ đám mây là x86-64 (bề ngoài CISC, bên trong RISC). Slide 52–53 nói về một sự phân biệt mà bạn mang theo người mỗi ngày.</li>
</ul>
<p class="meo">💡 Hãy giữ sẵn một câu hỏi cho mọi kiến trúc trong mục này: <em>nó làm MỘT lệnh chạy nhanh hơn, hay làm NHIỀU lệnh xong hơn mỗi giây?</em> Gần như mọi thứ hiện đại đều thuộc vế thứ hai, và nói thẳng ra điều đó thường chính là chỗ được điểm.</p>`],

      [52, 'CISC',
        `<p class="y-chinh">🎯 <strong>CISC = complex instruction set computer.</strong> The strategy: <strong>have a large set of instructions, including complex ones</strong>. The consequence the slide stresses: <strong>programming is easier, because a single instruction exists for both simple and complex tasks</strong>, so the programmer does not have to write a set of instructions for a complex job. Figure 1.34's caption spells out the mechanism: <em>"Complex instructions · One instruction = Several CW · PM Standard"</em>.</p>
<ul>
<li><strong>Decode the figure's boxes</strong> — PC (program counter) feeds Program Memory; from there a micro-program counter (mPC) indexes a micro-program memory (mPM), which emits a sequence of <em>control words</em> (CW) that drive the Data path, with Data Memory alongside. In short: one machine instruction expands into many micro-instructions inside the CPU.</li>
<li><strong>That expansion is called microprogramming</strong> — the control unit contains a tiny program of its own. It is what lets a single instruction do something as large as "copy a string until you hit a zero byte" (the x86 <code>REP MOVSB</code>).</li>
<li><strong>Why CISC made sense historically</strong> — in the 1970s memory was tiny and expensive and compilers were weak. A dense instruction set made programs short (saving precious memory) and made hand-written assembly bearable.</li>
<li><strong>The costs</strong> — instructions have different lengths and different durations, which makes them hard to pipeline; the control unit is large and complicated; and studies in the early 1980s found that compilers used only a small fraction of the available instructions anyway.</li>
<li><strong>The living example</strong> — x86-64 has well over a thousand instructions, some up to 15 bytes long, with addressing modes that can read memory, compute and write back in one instruction. Modern implementations survive this by translating each x86 instruction into RISC-like micro-operations in hardware.</li>
<li><strong>Read the trade-off as a slogan</strong> — CISC puts the complexity in the <em>hardware</em> so the software can be simple. RISC, next slide, does the exact opposite.</li>
</ul>
<p class="meo">💡 One image for the exam: CISC is a kitchen appliance with a "bake a cake" button; RISC is a set of knives, bowls and a plain oven. The first is easier to use once; the second is simpler to build, easier to speed up, and you can cook anything with it.</p>`,
        `<p class="y-chinh">🎯 <strong>CISC = máy tính với tập lệnh phức tạp.</strong> Chiến lược: <strong>có một tập lệnh lớn, bao gồm cả những lệnh phức tạp</strong>. Hệ quả mà slide nhấn mạnh: <strong>lập trình dễ hơn, vì có sẵn một lệnh duy nhất cho cả việc đơn giản lẫn việc phức tạp</strong>, nên người lập trình không phải viết cả một chuỗi lệnh cho một việc phức tạp. Chú thích hình 1.34 nói rõ cơ chế: <em>"Complex instructions · One instruction = Several CW · PM Standard"</em> (một lệnh = nhiều từ điều khiển).</p>
<ul>
<li><strong>Giải mã các hộp trong hình</strong> — PC (bộ đếm chương trình) nạp vào Program Memory; từ đó một bộ đếm vi chương trình (mPC) tra vào bộ nhớ vi chương trình (mPM), và bộ này phát ra một dãy <em>từ điều khiển</em> (CW) điều khiển Data path, bên cạnh là Data Memory. Nói gọn: một lệnh máy nở ra thành nhiều vi lệnh ngay trong CPU.</li>
<li><strong>Việc nở ra đó gọi là vi chương trình hoá (microprogramming)</strong> — khối điều khiển chứa một chương trình tí hon của riêng nó. Chính nó cho phép một lệnh duy nhất làm được việc lớn cỡ "chép một chuỗi cho tới khi gặp byte 0" (lệnh <code>REP MOVSB</code> của x86).</li>
<li><strong>Vì sao CISC từng hợp lý</strong> — thập niên 1970 bộ nhớ vừa bé vừa đắt còn trình biên dịch thì yếu. Tập lệnh cô đặc làm chương trình ngắn lại (tiết kiệm bộ nhớ quý giá) và làm việc viết hợp ngữ bằng tay chịu đựng nổi.</li>
<li><strong>Cái giá phải trả</strong> — các lệnh dài ngắn khác nhau và tốn thời gian khác nhau, nên rất khó đưa vào ống dẫn; khối điều khiển to và rối; và các nghiên cứu đầu thập niên 1980 phát hiện trình biên dịch thật ra chỉ dùng một phần nhỏ trong số lệnh có sẵn.</li>
<li><strong>Ví dụ còn sống</strong> — x86-64 có hơn một nghìn lệnh, có lệnh dài tới 15 byte, với những chế độ địa chỉ cho phép đọc bộ nhớ, tính toán rồi ghi ngược lại chỉ trong một lệnh. Các bản hiện thực hiện đại sống sót được là nhờ dịch mỗi lệnh x86 thành các vi thao tác kiểu RISC ngay trong phần cứng.</li>
<li><strong>Đọc sự đánh đổi như một khẩu hiệu</strong> — CISC nhét cái phức tạp vào <em>phần cứng</em> để phần mềm được đơn giản. RISC ở slide sau làm đúng điều ngược lại.</li>
</ul>
<p class="meo">💡 Một hình ảnh cho bài thi: CISC là cái máy làm bếp có sẵn nút "nướng bánh"; RISC là bộ dao, thố và một cái lò trơn. Cái thứ nhất dùng một lần thì tiện hơn; cái thứ hai dựng đơn giản hơn, tăng tốc dễ hơn, và nấu được mọi món.</p>`],

      [53, 'RISC',
        `<p class="y-chinh">🎯 <strong>RISC = reduced instruction set computer.</strong> The strategy: <strong>a small set of instructions that do a minimum number of simple operations</strong>. <strong>Complex instructions are simulated using a subset of simple instructions</strong>, which makes programming <strong>more difficult and time-consuming</strong>. Figure 1.35's caption is the exact mirror of the CISC one: <em>"Simple instructions · One instruction = One CW · PM longer"</em>.</p>
<ul>
<li><strong>Compare the two figures box by box</strong> — CISC had PC → Program Memory → mPC → mPM → CW. RISC has PC → Program Memory → IR (instruction register) → <strong>Decoder</strong> → CW. The whole micro-program layer is gone: one instruction produces one control word directly, in hardwired logic.</li>
<li><strong>"PM longer" is the honest cost</strong> — the program memory holds more instructions, because what CISC did in one instruction takes several here. RISC buys speed with program size, and that trade only became attractive once memory got cheap.</li>
<li><strong>Why fewer, simpler instructions run faster</strong> — every instruction is the same length and takes about the same time, so the pipeline of slide 54 never stalls on an oddly shaped instruction. Uniformity, not minimalism, is the real win.</li>
<li><strong>Load/store architecture</strong> — the defining RISC rule the slide does not spell out: only two instructions touch memory (<code>LOAD</code> and <code>STORE</code>); everything else works register-to-register. In x86, by contrast, an <code>ADD</code> can read memory directly.</li>
<li><strong>Is programming really harder?</strong> — for a human writing assembly, yes. For a compiler, no: simple regular instructions are much easier to generate good code for, and essentially nobody writes assembly by hand today. The slide's claim was written from the 1980s viewpoint.</li>
<li><strong>The verdict history delivered</strong> — RISC won. ARM ships in billions of phones, Apple's M-series is ARM, RISC-V is growing fast, and even x86 chips are RISC engines wearing a CISC decoder. The pure-CISC machine no longer exists.</li>
</ul>
<table>
<tr><th>Criterion</th><th>CISC</th><th>RISC</th></tr>
<tr><td>Number of instructions</td><td>many, hundreds to thousands</td><td>few, tens to a little over a hundred</td></tr>
<tr><td>Instruction length</td><td>variable (x86: 1–15 bytes)</td><td>fixed (ARM64/RISC-V: 4 bytes)</td></tr>
<tr><td>Control words per instruction</td><td>several (micro-programmed)</td><td>one (hardwired)</td></tr>
<tr><td>Memory access</td><td>from almost any instruction</td><td>only LOAD and STORE</td></tr>
<tr><td>Registers</td><td>few (original x86: 8)</td><td>many (ARM64: 31)</td></tr>
<tr><td>Program size</td><td>shorter</td><td>longer ("PM longer")</td></tr>
<tr><td>Easy to pipeline</td><td>hard</td><td>easy</td></tr>
<tr><td>Real examples</td><td>x86-64 (Intel, AMD)</td><td>ARM (iPhone, Apple M), RISC-V, MIPS</td></tr>
</table>
<p class="dap-an">✅ Worked comparison on one task — add the contents of two memory locations and store the result. <strong>CISC (x86):</strong> a single instruction can do it, e.g. <code>ADD [result], [value]</code> after one load: roughly 2 instructions. <strong>RISC (ARM64):</strong> <code>LDR x0, [addr1]</code> · <code>LDR x1, [addr2]</code> · <code>ADD x2, x0, x1</code> · <code>STR x2, [addr3]</code> — 4 instructions, but each one is 4 bytes, fixed length, single cycle and perfectly pipelineable. The RISC program is longer in bytes and often <em>faster</em> in time, and that sentence is the whole point of slides 52–53.</p>`,
        `<p class="y-chinh">🎯 <strong>RISC = máy tính với tập lệnh rút gọn.</strong> Chiến lược: <strong>một tập lệnh nhỏ, làm tối thiểu số thao tác đơn giản</strong>. <strong>Lệnh phức tạp được mô phỏng bằng một tập con các lệnh đơn giản</strong>, khiến việc lập trình <strong>khó hơn và tốn thời gian hơn</strong>. Chú thích hình 1.35 là tấm gương soi đúng của hình CISC: <em>"Simple instructions · One instruction = One CW · PM longer"</em>.</p>
<ul>
<li><strong>So hai bức hình theo từng hộp</strong> — CISC có PC → Program Memory → mPC → mPM → CW. RISC có PC → Program Memory → IR (thanh ghi lệnh) → <strong>Decoder</strong> (bộ giải mã) → CW. Cả tầng vi chương trình biến mất: một lệnh sinh thẳng ra một từ điều khiển, bằng mạch cứng.</li>
<li><strong>"PM longer" là cái giá được nói thật</strong> — bộ nhớ chương trình chứa nhiều lệnh hơn, vì việc mà CISC làm trong một lệnh thì ở đây tốn mấy lệnh. RISC mua tốc độ bằng kích thước chương trình, và cuộc đổi chác đó chỉ trở nên hấp dẫn khi bộ nhớ đã rẻ.</li>
<li><strong>Vì sao ít lệnh và lệnh đơn giản lại chạy nhanh hơn</strong> — mọi lệnh dài bằng nhau và tốn thời gian xấp xỉ nhau, nên ống dẫn ở slide 54 không bao giờ kẹt vì một cái lệnh hình thù kỳ dị. Cái thắng thật sự là TÍNH ĐỒNG ĐỀU, không phải sự tối giản.</li>
<li><strong>Kiến trúc nạp/lưu (load/store)</strong> — luật định nghĩa RISC mà slide không nói ra: chỉ hai lệnh được chạm vào bộ nhớ (<code>LOAD</code> và <code>STORE</code>), mọi lệnh khác làm việc thanh ghi với thanh ghi. Ngược lại, trong x86 một lệnh <code>ADD</code> đọc thẳng bộ nhớ được.</li>
<li><strong>Lập trình có thật sự khó hơn không?</strong> — với người viết hợp ngữ bằng tay thì có. Với trình biên dịch thì không: lệnh đơn giản và đều đặn dễ sinh mã tốt hơn nhiều, mà ngày nay gần như chẳng ai viết hợp ngữ bằng tay. Câu khẳng định của slide được viết theo góc nhìn thập niên 1980.</li>
<li><strong>Phán quyết mà lịch sử đã tuyên</strong> — RISC thắng. ARM nằm trong hàng tỷ chiếc điện thoại, chip M của Apple là ARM, RISC-V đang lớn rất nhanh, và ngay cả chip x86 cũng là cỗ máy RISC khoác bộ giải mã CISC bên ngoài. Máy CISC thuần tuý không còn tồn tại.</li>
</ul>
<table>
<tr><th>Tiêu chí</th><th>CISC</th><th>RISC</th></tr>
<tr><td>Số lệnh</td><td>nhiều, hàng trăm tới hàng nghìn</td><td>ít, vài chục tới trên trăm</td></tr>
<tr><td>Độ dài lệnh</td><td>thay đổi (x86: 1–15 byte)</td><td>cố định (ARM64/RISC-V: 4 byte)</td></tr>
<tr><td>Một lệnh = mấy CW</td><td>nhiều (vi chương trình)</td><td>một (mạch cứng)</td></tr>
<tr><td>Truy cập bộ nhớ</td><td>hầu như lệnh nào cũng được</td><td>chỉ LOAD và STORE</td></tr>
<tr><td>Số thanh ghi</td><td>ít (x86 gốc: 8)</td><td>nhiều (ARM64: 31)</td></tr>
<tr><td>Kích thước chương trình</td><td>ngắn hơn</td><td>dài hơn ("PM longer")</td></tr>
<tr><td>Dễ đưa vào ống dẫn</td><td>khó</td><td>dễ</td></tr>
<tr><td>Ví dụ thật</td><td>x86-64 (Intel, AMD)</td><td>ARM (iPhone, Apple M), RISC-V, MIPS</td></tr>
</table>
<p class="dap-an">✅ So sánh cụ thể trên một việc — cộng nội dung hai ô nhớ rồi cất kết quả. <strong>CISC (x86):</strong> một lệnh duy nhất làm được, ví dụ <code>ADD [ketqua], [gia_tri]</code> sau một lần nạp: cỡ 2 lệnh. <strong>RISC (ARM64):</strong> <code>LDR x0, [dc1]</code> · <code>LDR x1, [dc2]</code> · <code>ADD x2, x0, x1</code> · <code>STR x2, [dc3]</code> — 4 lệnh, nhưng mỗi lệnh đúng 4 byte, dài cố định, một chu kỳ và vào ống dẫn ngon lành. Chương trình RISC dài hơn tính theo byte mà thường <em>nhanh hơn</em> tính theo thời gian, và đúng một câu ấy là toàn bộ nội dung của slide 52–53.</p>`],

      [54, 'Pipelining',
        `<p class="y-chinh">🎯 <strong>Pipelining</strong> improves <strong>throughput — the total number of instructions performed in each period of time</strong>. The idea: if the control unit can do <strong>two or three of the phases simultaneously, the next instruction can start before the previous one is finished</strong>. Figure 1.36 shows the two timelines: <em>a. No pipelining</em> and <em>b. Pipelining</em>.</p>
<ul>
<li><strong>Read timeline (a)</strong> — Instruction 1 does Fetch, Decode, Execute; only then does Instruction 2 begin its Fetch. Three time slots per instruction, and two thirds of the hardware is idle at any moment.</li>
<li><strong>Read timeline (b)</strong> — the three rows are staggered by one slot each. While instruction 1 executes, instruction 2 decodes and instruction 3 fetches. All three units work every cycle, and after the pipeline is full one instruction <em>completes</em> per slot.</li>
<li><strong>The crucial distinction the slide's own wording makes</strong> — pipelining raises <em>throughput</em>, not speed per instruction. One instruction still takes three slots from start to finish; you just get three times as many finishing per unit time.</li>
<li><strong>The assembly-line analogy is exact</strong> — a car still takes 20 hours to build; a line that does 20 stages in parallel still delivers one car per hour. Henry Ford did not make cars faster, he made more of them per hour.</li>
<li><strong>Where it breaks — the three hazards</strong> — a <em>data hazard</em> (instruction 2 needs the result instruction 1 has not produced yet), a <em>control hazard</em> (a branch, so the instructions already fetched are the wrong ones), and a <em>structural hazard</em> (two stages want the same unit). Real CPUs answer these with forwarding, branch prediction and duplicated units.</li>
<li><strong>Real depths today</strong> — ARM Cortex cores use around 8–13 stages, Intel's recent cores around 14–20. Deeper pipelines allow higher clock speeds but pay more when a branch is mispredicted: everything already in flight must be thrown away.</li>
</ul>
<p class="dap-an">✅ Put numbers on Figure 1.36. Let each phase take one cycle, and run 100 instructions. <strong>Without pipelining:</strong> 100 × 3 = <strong>300 cycles</strong>. <strong>With a 3-stage pipeline:</strong> 3 cycles to fill the pipe, then one instruction completes per cycle: 3 + (100 − 1) = <strong>102 cycles</strong>. Speed-up ≈ 300 ÷ 102 ≈ <strong>2.94×</strong>, approaching but never reaching the ideal 3×. General formula: <em>cycles = k + (n − 1)</em> for k stages and n instructions, so the speed-up tends to k as n grows — which is exactly why designers kept making pipelines deeper.</p>
<p class="pitfall">⚠️ The classic wrong answer is "pipelining makes each instruction faster". It does not — latency per instruction is unchanged or even slightly worse (extra latches between stages). Use the slide's own word, <strong>throughput</strong>, and you will be right.</p>`,
        `<p class="y-chinh">🎯 <strong>Pipelining (ống dẫn lệnh)</strong> cải thiện <strong>thông lượng — tổng số lệnh hoàn thành trong mỗi khoảng thời gian</strong>. Ý tưởng: nếu khối điều khiển làm được <strong>hai hoặc ba giai đoạn cùng lúc thì lệnh kế tiếp bắt đầu được trước khi lệnh trước xong</strong>. Hình 1.36 cho hai trục thời gian: <em>a. Không dùng ống dẫn</em> và <em>b. Dùng ống dẫn</em>.</p>
<ul>
<li><strong>Đọc trục (a)</strong> — Lệnh 1 làm Fetch, Decode, Execute; xong hết rồi Lệnh 2 mới bắt đầu Fetch. Ba ô thời gian cho mỗi lệnh, và tại mỗi thời điểm có hai phần ba phần cứng ngồi chơi.</li>
<li><strong>Đọc trục (b)</strong> — ba hàng lệch nhau đúng một ô. Trong lúc lệnh 1 thi hành thì lệnh 2 giải mã và lệnh 3 đang nạp. Cả ba đơn vị đều làm việc mỗi chu kỳ, và khi ống đã đầy thì mỗi ô có một lệnh <em>hoàn thành</em>.</li>
<li><strong>Chỗ phân biệt then chốt mà chính chữ của slide đã nêu</strong> — pipelining nâng <em>thông lượng</em>, không nâng tốc độ của từng lệnh. Một lệnh vẫn mất ba ô từ đầu tới cuối; chỉ là mỗi đơn vị thời gian có gấp ba số lệnh xong việc.</li>
<li><strong>Phép ví dây chuyền lắp ráp là chính xác</strong> — một chiếc xe vẫn mất 20 giờ để lắp; một dây chuyền làm 20 công đoạn song song vẫn xuất xưởng một xe mỗi giờ. Henry Ford không làm cho xe được lắp nhanh hơn, ông làm ra nhiều xe hơn mỗi giờ.</li>
<li><strong>Chỗ nó gãy — ba loại xung đột (hazard)</strong> — <em>xung đột dữ liệu</em> (lệnh 2 cần kết quả mà lệnh 1 chưa kịp sinh ra), <em>xung đột điều khiển</em> (gặp lệnh rẽ nhánh nên những lệnh đã nạp sẵn là lệnh sai), và <em>xung đột cấu trúc</em> (hai giai đoạn cùng đòi một đơn vị phần cứng). CPU thật trả lời bằng chuyển tiếp kết quả, dự đoán rẽ nhánh và nhân đôi đơn vị.</li>
<li><strong>Độ sâu thật hôm nay</strong> — lõi ARM Cortex dùng khoảng 8–13 tầng, lõi Intel đời gần đây khoảng 14–20 tầng. Ống càng sâu càng đẩy được xung nhịp lên, nhưng trả giá nặng hơn khi đoán sai rẽ nhánh: tất cả những gì đang chạy dở phải vứt đi.</li>
</ul>
<p class="dap-an">✅ Đặt số vào hình 1.36. Cho mỗi giai đoạn tốn một chu kỳ, và chạy 100 lệnh. <strong>Không ống dẫn:</strong> 100 × 3 = <strong>300 chu kỳ</strong>. <strong>Có ống dẫn 3 tầng:</strong> mất 3 chu kỳ để đổ đầy ống, rồi mỗi chu kỳ xong một lệnh: 3 + (100 − 1) = <strong>102 chu kỳ</strong>. Tăng tốc ≈ 300 ÷ 102 ≈ <strong>2,94 lần</strong>, tiệm cận nhưng không bao giờ chạm mức lý tưởng 3 lần. Công thức tổng quát: <em>số chu kỳ = k + (n − 1)</em> với k tầng và n lệnh, nên hệ số tăng tốc tiến dần tới k khi n lớn — chính xác vì thế mà người thiết kế cứ đào ống ngày một sâu.</p>
<p class="pitfall">⚠️ Câu trả lời sai kinh điển là "pipelining làm mỗi lệnh chạy nhanh hơn". Không hề — độ trễ của từng lệnh giữ nguyên, thậm chí nhích lên chút ít (vì có thêm chốt giữa các tầng). Hãy dùng đúng chữ của slide, <strong>throughput / thông lượng</strong>, là trả lời đúng.</p>`],

      [55, 'Parallel processing',
        `<p class="y-chinh">🎯 The last idea of the chapter. <strong>Traditionally a computer had a single control unit, a single ALU and a single memory unit.</strong> With cheaper hardware, <strong>today a single computer can have multiple control units, multiple ALUs and multiple memory units</strong> — that is <strong>parallel processing</strong>, and <strong>like pipelining, it can improve throughput</strong>.</p>
<ul>
<li><strong>The key phrase is "a single computer"</strong> — this is not a network of machines. It is one machine with duplicated internal parts, which is exactly what a multicore processor is.</li>
<li><strong>Parallelism multiplies space, pipelining overlaps time</strong> — the slide pairs the two ideas deliberately ("like pipelining"). Both raise throughput; one does it by duplicating hardware, the other by keeping existing hardware busy. Real chips do both at once.</li>
<li><strong>What is being multiplied determines the category</strong> — slides 56–59 classify machines by how many <em>instruction streams</em> and how many <em>data streams</em> they have. That two-by-two table is Flynn's taxonomy (Michael Flynn, 1966), and it is what the next four slides walk through one cell at a time.</li>
<li><strong>Why it became necessary, not just possible</strong> — around 2005 clock speeds hit a thermal wall near 4 GHz. Manufacturers could still fit more transistors, so they added cores instead of megahertz. Parallelism stopped being exotic and became the only way forward.</li>
<li><strong>The catch the slide does not mention</strong> — Amdahl's law: if a fraction <em>s</em> of a program must run sequentially, the best possible speed-up is 1/s no matter how many cores you add. With 10% sequential code, a thousand cores give at most a 10× speed-up.</li>
<li><strong>Where you already use it</strong> — an 8-core phone chip, a GPU with thousands of tiny ALUs doing the same operation to different pixels, and every web browser running tabs on separate cores.</li>
</ul>
<table>
<tr><th>Flynn</th><th>Instruction streams</th><th>Data streams</th><th>Real example</th></tr>
<tr><td>SISD</td><td>1</td><td>1</td><td>The classic single-core CPU of slides 25–28</td></tr>
<tr><td>SIMD</td><td>1</td><td>many</td><td>GPU, and SSE/AVX/NEON vector instructions</td></tr>
<tr><td>MISD</td><td>many</td><td>1</td><td>Almost none — fault-tolerant flight computers</td></tr>
<tr><td>MIMD</td><td>many</td><td>many</td><td>Every multicore CPU; clusters; supercomputers</td></tr>
</table>
<p class="meo">💡 Decode the four names letter by letter and you never have to memorise them: <strong>S/M</strong> = Single or Multiple, <strong>I</strong> = Instruction stream, <strong>D</strong> = Data stream. SIMD = one instruction, many data — "one order, many soldiers". MIMD = many orders, many soldiers.</p>`,
        `<p class="y-chinh">🎯 Ý tưởng cuối của chương. <strong>Theo truyền thống, một máy tính có một khối điều khiển, một ALU và một khối nhớ.</strong> Khi phần cứng rẻ đi, <strong>ngày nay một máy tính đơn lẻ có thể có nhiều khối điều khiển, nhiều ALU và nhiều khối nhớ</strong> — đó là <strong>xử lý song song</strong>, và <strong>giống pipelining, nó cải thiện thông lượng</strong>.</p>
<ul>
<li><strong>Cụm chịu lực là "một máy tính đơn lẻ"</strong> — đây không phải một mạng nhiều máy. Đây là một cái máy có các bộ phận bên trong được nhân bản, tức đúng là con chip đa lõi.</li>
<li><strong>Song song nhân theo KHÔNG GIAN, ống dẫn chồng theo THỜI GIAN</strong> — slide cố ý ghép hai ý ("giống pipelining"). Cả hai đều nâng thông lượng; một bên nhân phần cứng lên, bên kia giữ cho phần cứng sẵn có không lúc nào rảnh. Chip thật làm cả hai cùng lúc.</li>
<li><strong>Thứ được nhân lên quyết định loại</strong> — slide 56–59 phân loại máy theo số <em>luồng lệnh</em> và số <em>luồng dữ liệu</em>. Bảng hai nhân hai đó là phân loại Flynn (Michael Flynn, 1966), và bốn slide tới đi qua từng ô một.</li>
<li><strong>Vì sao nó thành BẮT BUỘC chứ không chỉ là khả thi</strong> — khoảng năm 2005, xung nhịp đụng bức tường nhiệt quanh 4 GHz. Nhà sản xuất vẫn nhét thêm được transistor, nên họ thêm lõi thay vì thêm megahertz. Song song thôi là chuyện xa lạ và trở thành con đường duy nhất.</li>
<li><strong>Cái bẫy slide không nhắc</strong> — định luật Amdahl: nếu một tỷ lệ <em>s</em> của chương trình buộc phải chạy tuần tự thì mức tăng tốc tối đa là 1/s, thêm bao nhiêu lõi cũng vậy. Với 10% mã tuần tự, một nghìn lõi cũng chỉ cho tối đa 10 lần.</li>
<li><strong>Bạn đã dùng nó ở đâu rồi</strong> — con chip điện thoại 8 lõi, cái GPU có hàng nghìn ALU tí hon cùng làm một phép tính lên những điểm ảnh khác nhau, và mọi trình duyệt web chạy các thẻ trên những lõi khác nhau.</li>
</ul>
<table>
<tr><th>Flynn</th><th>Luồng lệnh</th><th>Luồng dữ liệu</th><th>Ví dụ thật</th></tr>
<tr><td>SISD</td><td>1</td><td>1</td><td>CPU một lõi kinh điển ở slide 25–28</td></tr>
<tr><td>SIMD</td><td>1</td><td>nhiều</td><td>GPU, và các lệnh vector SSE/AVX/NEON</td></tr>
<tr><td>MISD</td><td>nhiều</td><td>1</td><td>Gần như không có — máy tính hàng không chịu lỗi</td></tr>
<tr><td>MIMD</td><td>nhiều</td><td>nhiều</td><td>Mọi CPU đa lõi; cụm máy; siêu máy tính</td></tr>
</table>
<p class="meo">💡 Giải nghĩa bốn cái tên theo từng chữ cái thì khỏi phải học thuộc: <strong>S/M</strong> = Single hay Multiple (một hay nhiều), <strong>I</strong> = luồng lệnh (Instruction), <strong>D</strong> = luồng dữ liệu (Data). SIMD = một lệnh, nhiều dữ liệu — "một mệnh lệnh, nhiều người lính". MIMD = nhiều mệnh lệnh, nhiều người lính.</p>`],

      [56, 'Parallel processing (cont) — SISD organization',
        `<p class="y-chinh">🎯 The first cell of Flynn's table: <strong>SISD — Single Instruction stream, Single Data stream</strong>. Figure 1.36 gives it twice: <em>a. Concept</em> — one instruction stream box (<code>Load R1 40</code>, <code>Load R1 50</code>, …) feeding one data stream box (14, 22, …); and <em>b. Configuration</em> — one <strong>CU</strong> (control unit) → one <strong>PU</strong> (processing unit) → one <strong>MU</strong> (memory unit).</p>
<ul>
<li><strong>The abbreviations are printed on the slide</strong> — CU: Control unit · MU: Memory unit · PU: Processing unit. Learn these three; slides 57 and 59 reuse them with ALU added.</li>
<li><strong>This is the machine of sections 4–8</strong> — the whole chapter up to here described exactly this configuration. SISD is not a new architecture; it is the name for the one you already know.</li>
<li><strong>One stream of each is the definition</strong> — instructions are executed one after another, and each one works on one piece of data. Nothing is duplicated anywhere in the diagram.</li>
<li><strong>Pipelining does not change the category</strong> — a pipelined CPU still has one instruction stream and one data stream; the stages just overlap. This is a favourite exam question: a pipelined single-core machine is still SISD.</li>
<li><strong>The real-world examples</strong> — the Intel 8086, a single-core Pentium, and any microcontroller (an Arduino's ATmega328P) are SISD. Today you meet SISD mostly inside each individual core of a multicore chip.</li>
<li><strong>Its limit is the entire reason for slides 57–59</strong> — with one PU, the only way to go faster is a higher clock, and the clock stopped rising in 2005. The remaining three cells are the ways out.</li>
</ul>
<p class="meo">💡 Anchor the four diagrams by counting boxes: SISD has <strong>one</strong> of everything, SIMD has <strong>one CU and many ALUs</strong>, MISD has <strong>many instruction streams and one data stream</strong>, MIMD has <strong>many of everything</strong>. Count first, name second.</p>`,
        `<p class="y-chinh">🎯 Ô đầu tiên trong bảng Flynn: <strong>SISD — một luồng lệnh, một luồng dữ liệu</strong>. Hình 1.36 vẽ nó hai lần: <em>a. Concept</em> — một hộp luồng lệnh (<code>Load R1 40</code>, <code>Load R1 50</code>, …) chảy vào một hộp luồng dữ liệu (14, 22, …); và <em>b. Configuration</em> — một <strong>CU</strong> (khối điều khiển) → một <strong>PU</strong> (khối xử lý) → một <strong>MU</strong> (khối nhớ).</p>
<ul>
<li><strong>Các chữ viết tắt được in ngay trên slide</strong> — CU: Control unit · MU: Memory unit · PU: Processing unit. Hãy thuộc ba cái này; slide 57 và 59 dùng lại chúng, thêm ALU.</li>
<li><strong>Đây chính là cái máy của mục 4–8</strong> — cả chương từ đầu tới đây mô tả đúng cấu hình này. SISD không phải kiến trúc mới; nó là cái tên đặt cho thứ bạn đã biết.</li>
<li><strong>Mỗi thứ một luồng chính là định nghĩa</strong> — các lệnh được thi hành lần lượt, và mỗi lệnh làm việc trên một mẩu dữ liệu. Trong sơ đồ không có gì được nhân đôi cả.</li>
<li><strong>Pipelining KHÔNG làm đổi loại</strong> — một CPU có ống dẫn vẫn chỉ có một luồng lệnh và một luồng dữ liệu; các giai đoạn chỉ chồng lấn lên nhau. Đây là câu hỏi thi rất được ưa: máy một lõi có ống dẫn vẫn là SISD.</li>
<li><strong>Ví dụ đời thật</strong> — Intel 8086, một con Pentium đơn lõi, và mọi vi điều khiển (con ATmega328P trong Arduino) đều là SISD. Ngày nay bạn gặp SISD chủ yếu bên trong từng lõi riêng lẻ của một con chip đa lõi.</li>
<li><strong>Giới hạn của nó chính là toàn bộ lý do có slide 57–59</strong> — chỉ một PU thì cách duy nhất để nhanh hơn là tăng xung nhịp, mà xung nhịp đã thôi tăng từ 2005. Ba ô còn lại là các lối thoát.</li>
</ul>
<p class="meo">💡 Neo bốn sơ đồ lại bằng cách ĐẾM HỘP: SISD có <strong>một</strong> của mọi thứ, SIMD có <strong>một CU và nhiều ALU</strong>, MISD có <strong>nhiều luồng lệnh và một luồng dữ liệu</strong>, MIMD có <strong>nhiều của mọi thứ</strong>. Đếm trước, gọi tên sau.</p>`],

      [57, 'Parallel processing (cont) — SIMD organization',
        `<p class="y-chinh">🎯 The second cell: <strong>SIMD — Single Instruction stream, Multiple Data streams</strong>. In Figure 1.37 <em>a. Concept</em>, one instruction stream (<code>Load R1 40</code>, <code>Load R1 50</code>, …) fans out to <strong>three</strong> data streams (14/22, 25/32, 17/81). In <em>b. Implementation</em>, one <strong>CU</strong> drives three <strong>ALU</strong>s, each with its own <strong>MU</strong>.</p>
<ul>
<li><strong>One control unit is the whole point</strong> — there is exactly one CU in the diagram, and it broadcasts the same instruction to every ALU at the same instant. Each ALU applies it to different data. One order, many workers.</li>
<li><strong>Which problems fit</strong> — anything where the same operation must be applied to a large array: brightening every pixel of an image, adding two vectors, multiplying matrices, applying a filter to a sound sample, and the matrix multiplications at the heart of neural networks.</li>
<li><strong>Which problems do not fit</strong> — anything where different data needs different decisions. If some elements take the <code>if</code> branch and others the <code>else</code>, the hardware must run both branches and mask off the wrong results. This is called branch divergence, and it is why a GPU is terrible at general-purpose code.</li>
<li><strong>Where you own SIMD hardware right now</strong> — your GPU (thousands of ALUs), and the vector units inside your CPU: SSE and AVX on x86, NEON and SVE on ARM. A single AVX-512 instruction adds sixteen 32-bit numbers at once.</li>
<li><strong>Why it is so power-efficient</strong> — one instruction fetch and one decode serve many ALUs, so the expensive control logic is shared. That is exactly why GPUs deliver far more arithmetic per watt than CPUs, and why AI training runs on them.</li>
<li><strong>The programming model</strong> — you do not write SIMD instructions by hand; compilers vectorise loops automatically, or you use a framework (CUDA, Metal, NumPy) that hides them. The hardware is exotic, the code usually is not.</li>
</ul>
<p class="dap-an">✅ Make the gain concrete. Add two arrays of 1,024 numbers. <strong>SISD:</strong> 1,024 add instructions, one per element. <strong>SIMD with 8-wide vectors (AVX2):</strong> 1,024 ÷ 8 = <strong>128</strong> instructions — an 8× reduction, from one instruction fetch and decode per element to one per eight. On a GPU with 4,096 lanes the same job takes a single pass. This is the arithmetic behind "the GPU is faster at image and AI work": not a faster clock, but one instruction feeding thousands of data streams.</p>`,
        `<p class="y-chinh">🎯 Ô thứ hai: <strong>SIMD — một luồng lệnh, nhiều luồng dữ liệu</strong>. Trong hình 1.37 phần <em>a. Concept</em>, một luồng lệnh (<code>Load R1 40</code>, <code>Load R1 50</code>, …) toả ra <strong>ba</strong> luồng dữ liệu (14/22, 25/32, 17/81). Ở phần <em>b. Implementation</em>, một <strong>CU</strong> điều khiển ba <strong>ALU</strong>, mỗi ALU có <strong>MU</strong> riêng.</p>
<ul>
<li><strong>Chỉ MỘT khối điều khiển mới là điểm mấu chốt</strong> — trong sơ đồ có đúng một CU, và nó phát cùng một lệnh tới mọi ALU trong cùng một khoảnh khắc. Mỗi ALU đem lệnh đó áp lên dữ liệu khác nhau. Một mệnh lệnh, nhiều người làm.</li>
<li><strong>Bài toán nào hợp</strong> — mọi việc phải áp cùng một phép tính lên một mảng lớn: làm sáng mọi điểm ảnh của tấm hình, cộng hai vector, nhân ma trận, lọc một mẫu âm thanh, và những phép nhân ma trận nằm ở lõi của mạng nơ-ron.</li>
<li><strong>Bài toán nào không hợp</strong> — mọi việc mà dữ liệu khác nhau cần quyết định khác nhau. Nếu vài phần tử đi nhánh <code>if</code> còn vài phần tử đi nhánh <code>else</code> thì phần cứng buộc phải chạy CẢ HAI nhánh rồi che đi kết quả sai. Hiện tượng đó gọi là phân kỳ nhánh, và là lý do GPU rất tệ với mã đa dụng.</li>
<li><strong>Bạn đang sở hữu phần cứng SIMD ngay lúc này</strong> — cái GPU của bạn (hàng nghìn ALU), và các đơn vị vector bên trong CPU: SSE và AVX trên x86, NEON và SVE trên ARM. Một lệnh AVX-512 duy nhất cộng mười sáu số 32 bit cùng lúc.</li>
<li><strong>Vì sao nó tiết kiệm điện tới vậy</strong> — một lần nạp lệnh và một lần giải mã phục vụ cho nhiều ALU, nên phần logic điều khiển đắt đỏ được dùng chung. Chính xác vì thế GPU cho nhiều phép tính trên mỗi watt hơn hẳn CPU, và vì thế việc huấn luyện AI chạy trên chúng.</li>
<li><strong>Mô hình lập trình</strong> — bạn không viết lệnh SIMD bằng tay; trình biên dịch tự vector hoá vòng lặp, hoặc bạn dùng một khung (CUDA, Metal, NumPy) che chúng đi. Phần cứng thì lạ, còn mã thì thường không.</li>
</ul>
<p class="dap-an">✅ Làm cho cái lợi thành con số. Cộng hai mảng 1.024 số. <strong>SISD:</strong> 1.024 lệnh cộng, mỗi phần tử một lệnh. <strong>SIMD với vector rộng 8 (AVX2):</strong> 1.024 ÷ 8 = <strong>128</strong> lệnh — giảm 8 lần, từ một lần nạp-và-giải-mã lệnh cho mỗi phần tử xuống một lần cho tám phần tử. Trên GPU có 4.096 làn thì cùng việc ấy xong trong một lượt. Đó là phép tính nằm sau câu "GPU nhanh hơn ở việc xử lý ảnh và AI": không phải nhờ xung nhịp cao hơn, mà nhờ một lệnh nuôi hàng nghìn luồng dữ liệu.</p>`],

      [58, 'Parallel processing (cont) — MISD organization',
        `<p class="y-chinh">🎯 The third cell, and the odd one out: <strong>MISD — Multiple Instruction streams, Single Data stream</strong>. The figure shows three separate instruction streams (<code>Load R1 40 / Load R2 50</code>, <code>Load R3 80 / Load R4 81</code>, <code>Load R26 120 / Load R27 121</code>) all converging on <strong>one</strong> data stream box (14, 22, …).</p>
<ul>
<li><strong>A note about this slide's labelling</strong> — the extracted text for slide 58 reads only "Figure 1.38 Parallel processing", but the picture itself is clearly titled <em>MISD organization</em>. Slide 59 then carries the number "Figure 1.38" as well. The deck has duplicated a figure number; go by the title inside the picture, not by the caption.</li>
<li><strong>What MISD means literally</strong> — several different operations are applied to the same piece of data at the same time. Each instruction stream has its own control unit but they all look at one data stream.</li>
<li><strong>Why almost no machine is built this way</strong> — doing several different things to the same datum simultaneously is rarely what a program wants. Most textbooks, Flynn's included, describe MISD as the theoretically-complete but practically-empty cell of the table.</li>
<li><strong>The one accepted real use — fault tolerance</strong> — run the same input through several differently-designed processors and compare the answers. The Space Shuttle flew five computers voting on the same sensor data; modern fly-by-wire aircraft and some railway signalling systems do the same. A disagreement means one unit has failed.</li>
<li><strong>The other argued example — systolic arrays</strong> — a pipeline where each stage applies a different operation to data flowing past is sometimes classified MISD. This is debated: many authors call it pipelining instead, which is itself the reason MISD stays controversial.</li>
<li><strong>What to write in an exam</strong> — define it correctly (many instruction streams, one data stream), then say it is rare in practice, and give fault-tolerant redundant systems as the example. That answer is complete and honest.</li>
</ul>
<p class="meo">💡 Remember the four cells by how common they are: <strong>SISD</strong> = every simple CPU · <strong>SIMD</strong> = every GPU · <strong>MIMD</strong> = every multicore · <strong>MISD</strong> = almost nothing. If a question asks which class has essentially no commercial machines, the answer is always MISD.</p>`,
        `<p class="y-chinh">🎯 Ô thứ ba, và là ô lạc loài: <strong>MISD — nhiều luồng lệnh, một luồng dữ liệu</strong>. Hình vẽ ba luồng lệnh riêng biệt (<code>Load R1 40 / Load R2 50</code>, <code>Load R3 80 / Load R4 81</code>, <code>Load R26 120 / Load R27 121</code>) cùng đổ về <strong>một</strong> hộp luồng dữ liệu (14, 22, …).</p>
<ul>
<li><strong>Một ghi chú về nhãn của slide này</strong> — bản trích chữ của slide 58 chỉ còn dòng "Figure 1.38 Parallel processing", nhưng chính bức hình thì ghi rõ tiêu đề <em>MISD organization</em>. Rồi slide 59 lại cũng mang số "Figure 1.38". Deck đã đánh trùng số hình; hãy theo tiêu đề bên trong bức hình, đừng theo dòng chú thích.</li>
<li><strong>MISD nghĩa đen là gì</strong> — nhiều phép toán khác nhau được áp lên cùng một mẩu dữ liệu trong cùng một lúc. Mỗi luồng lệnh có khối điều khiển riêng nhưng tất cả cùng nhìn vào một luồng dữ liệu.</li>
<li><strong>Vì sao gần như không ai dựng máy kiểu này</strong> — làm nhiều việc khác nhau lên cùng một dữ liệu cùng lúc hiếm khi là thứ chương trình cần. Phần lớn sách giáo khoa, kể cả bài của Flynn, mô tả MISD là cái ô đầy đủ về lý thuyết nhưng trống rỗng trong thực tế.</li>
<li><strong>Một ứng dụng thật được công nhận — chịu lỗi</strong> — đưa cùng một đầu vào qua nhiều bộ xử lý thiết kế khác nhau rồi đối chiếu kết quả. Tàu con thoi bay với năm máy tính cùng bỏ phiếu trên cùng dữ liệu cảm biến; máy bay điều khiển điện tử hiện đại và một số hệ tín hiệu đường sắt cũng làm vậy. Có bất đồng nghĩa là một đơn vị đã hỏng.</li>
<li><strong>Ví dụ còn tranh cãi — mảng tâm thu (systolic array)</strong> — một ống dẫn mà mỗi tầng áp một phép toán khác nhau lên dòng dữ liệu chảy qua đôi khi bị xếp là MISD. Chuyện này còn cãi nhau: nhiều tác giả gọi đó là pipelining, và chính điều đó khiến MISD mãi gây tranh luận.</li>
<li><strong>Trong bài thi nên viết gì</strong> — định nghĩa cho đúng (nhiều luồng lệnh, một luồng dữ liệu), rồi nói rằng nó hiếm trong thực tế, và nêu hệ thống dư thừa chịu lỗi làm ví dụ. Câu trả lời đó vừa đủ vừa trung thực.</li>
</ul>
<p class="meo">💡 Nhớ bốn ô theo mức phổ biến: <strong>SISD</strong> = mọi CPU đơn giản · <strong>SIMD</strong> = mọi GPU · <strong>MIMD</strong> = mọi chip đa lõi · <strong>MISD</strong> = gần như không có gì. Nếu đề hỏi lớp nào hầu như không có máy thương mại nào, đáp án luôn là MISD.</p>`],

      [59, 'Parallel processing (cont) — MIMD organization',
        `<p class="y-chinh">🎯 The last cell, and the one that describes the machine you are reading this on: <strong>MIMD — Multiple Instruction streams, Multiple Data streams</strong>. Figure 1.38 shows three instruction streams each feeding its <em>own</em> data stream in <em>a. Concept</em>, and in <em>b. Implementation</em> three complete rows of <strong>CU → ALU → MU</strong> stacked one above the other.</p>
<ul>
<li><strong>Everything is duplicated</strong> — compare with SIMD, where there was one CU for three ALUs. Here each ALU has its own CU, so each unit executes a <em>different</em> program on <em>different</em> data. That independence is the definition.</li>
<li><strong>This is what "multicore" means</strong> — an 8-core processor is eight CU+ALU pairs on one die. Your browser on core 1, your music player on core 2, the compiler on core 3, all genuinely at the same instant.</li>
<li><strong>Two sub-families worth naming</strong> — <em>shared memory</em> (all cores see one address space; this is your laptop and any server) and <em>distributed memory</em> (each node has private memory and they exchange messages; this is a cluster or a supercomputer). Both are MIMD; only the memory picture differs.</li>
<li><strong>The hard part moves to the software</strong> — with independent units come race conditions, deadlocks and the need for locks and synchronisation. The hardware became parallel in 2005; teaching programs to use it is still the open problem.</li>
<li><strong>Real numbers for scale</strong> — a 2026 phone has 6–8 cores; a laptop 8–16; a server CPU 64–128; the fastest supercomputers pass ten million cores. All of them are MIMD, and all of them are bounded by Amdahl's law from slide 55.</li>
<li><strong>How the four slides fit together</strong> — 56 was the machine of the whole chapter, 57 multiplied data, 58 multiplied instructions over one datum (and practically does not exist), 59 multiplied both. Flynn's table is complete, and section 9 with it.</li>
</ul>
<table>
<tr><th>Class</th><th>Control units</th><th>ALUs</th><th>Runs</th><th>Where you meet it</th></tr>
<tr><td>SISD</td><td>1</td><td>1</td><td>one program, one datum at a time</td><td>Microcontroller, one core</td></tr>
<tr><td>SIMD</td><td>1</td><td>many</td><td>one program on a whole array</td><td>GPU, AVX/NEON vectors</td></tr>
<tr><td>MISD</td><td>many</td><td>many</td><td>several programs on the same datum</td><td>Redundant flight computers</td></tr>
<tr><td>MIMD</td><td>many</td><td>many</td><td>different programs on different data</td><td>Every multicore CPU, clusters</td></tr>
</table>
<p class="dap-an">✅ End-of-chapter check, using everything from slides 29–59. Take a 2026 laptop: an 8-core ARM CPU (<strong>RISC</strong>, slide 53) where each core is <strong>pipelined</strong> (slide 54) and <strong>SISD</strong> on its own (slide 56); the eight cores together make the machine <strong>MIMD</strong> (this slide); the integrated GPU is <strong>SIMD</strong> (slide 57); the cores read through <strong>L1/L2/L3 cache</strong> into <strong>DRAM</strong> (slides 34–35) over an <strong>address, data and control</strong> path (slide 43); its <strong>NVMe SSD</strong> (slide 40) and USB devices (slide 47) hang off controllers and are reached by <strong>memory-mapped I/O</strong> (slides 48–49). Every idea in this half of the chapter is present in one ordinary machine at once — which is exactly what the chapter set out to show.</p>`,
        `<p class="y-chinh">🎯 Ô cuối cùng, và là ô mô tả đúng cái máy bạn đang đọc dòng này: <strong>MIMD — nhiều luồng lệnh, nhiều luồng dữ liệu</strong>. Hình 1.38 cho thấy ở phần <em>a. Concept</em> ba luồng lệnh mỗi cái nuôi <em>luồng dữ liệu riêng</em> của nó, còn ở phần <em>b. Implementation</em> là ba hàng đầy đủ <strong>CU → ALU → MU</strong> xếp chồng lên nhau.</p>
<ul>
<li><strong>Mọi thứ đều được nhân bản</strong> — so với SIMD, nơi một CU điều khiển ba ALU. Ở đây mỗi ALU có CU riêng, nên mỗi đơn vị chạy một chương trình <em>khác nhau</em> trên dữ liệu <em>khác nhau</em>. Chính sự độc lập đó là định nghĩa.</li>
<li><strong>Đây chính là nghĩa của chữ "đa lõi"</strong> — bộ xử lý 8 lõi là tám cặp CU+ALU trên một đế chip. Trình duyệt ở lõi 1, trình phát nhạc ở lõi 2, trình biên dịch ở lõi 3, tất cả thật sự cùng một khoảnh khắc.</li>
<li><strong>Hai họ con đáng gọi tên</strong> — <em>bộ nhớ chia sẻ</em> (mọi lõi nhìn chung một không gian địa chỉ; đó là máy xách tay và mọi máy chủ) và <em>bộ nhớ phân tán</em> (mỗi nút có bộ nhớ riêng và chúng trao đổi bằng thông điệp; đó là cụm máy hay siêu máy tính). Cả hai đều là MIMD; chỉ bức tranh bộ nhớ là khác.</li>
<li><strong>Phần khó chuyển sang cho phần mềm</strong> — có các đơn vị độc lập là có tranh chấp dữ liệu, có bế tắc (deadlock), và phải dùng khoá cùng cơ chế đồng bộ. Phần cứng trở nên song song từ 2005; dạy chương trình biết dùng nó vẫn còn là bài toán mở.</li>
<li><strong>Con số thật để có cỡ</strong> — điện thoại năm 2026 có 6–8 lõi; máy xách tay 8–16; CPU máy chủ 64–128; siêu máy tính nhanh nhất vượt mười triệu lõi. Tất cả đều là MIMD, và tất cả đều bị định luật Amdahl ở slide 55 chặn lại.</li>
<li><strong>Bốn slide này khớp vào nhau thế nào</strong> — 56 là cái máy của cả chương, 57 nhân dữ liệu lên, 58 nhân lệnh lên trên cùng một dữ liệu (và thực tế gần như không tồn tại), 59 nhân cả hai. Bảng Flynn đã đủ ô, và mục 9 khép lại cùng nó.</li>
</ul>
<table>
<tr><th>Lớp</th><th>Khối điều khiển</th><th>ALU</th><th>Chạy</th><th>Gặp ở đâu</th></tr>
<tr><td>SISD</td><td>1</td><td>1</td><td>một chương trình, mỗi lúc một dữ liệu</td><td>Vi điều khiển, một lõi</td></tr>
<tr><td>SIMD</td><td>1</td><td>nhiều</td><td>một chương trình trên cả mảng</td><td>GPU, vector AVX/NEON</td></tr>
<tr><td>MISD</td><td>nhiều</td><td>nhiều</td><td>nhiều chương trình trên cùng một dữ liệu</td><td>Máy tính hàng không dư thừa</td></tr>
<tr><td>MIMD</td><td>nhiều</td><td>nhiều</td><td>chương trình khác nhau trên dữ liệu khác nhau</td><td>Mọi CPU đa lõi, cụm máy</td></tr>
</table>
<p class="dap-an">✅ Bài kiểm cuối chương, dùng lại tất cả từ slide 29–59. Lấy một máy xách tay năm 2026: CPU ARM 8 lõi (<strong>RISC</strong>, slide 53), mỗi lõi có <strong>ống dẫn lệnh</strong> (slide 54) và tự thân là <strong>SISD</strong> (slide 56); tám lõi gộp lại làm cả máy thành <strong>MIMD</strong> (slide này); GPU tích hợp là <strong>SIMD</strong> (slide 57); các lõi đọc qua <strong>cache L1/L2/L3</strong> xuống <strong>DRAM</strong> (slide 34–35) trên đường <strong>địa chỉ, dữ liệu và điều khiển</strong> (slide 43); cái <strong>SSD NVMe</strong> (slide 40) và các thiết bị USB (slide 47) treo sau bộ điều khiển và được với tới bằng <strong>vào/ra ánh xạ bộ nhớ</strong> (slide 48–49). Mọi ý tưởng của nửa sau chương này cùng hiện diện trong một cái máy bình thường — và đó đúng là điều chương 1 muốn cho bạn thấy.</p>`],

    ]),
  ].join('\n'),
};
