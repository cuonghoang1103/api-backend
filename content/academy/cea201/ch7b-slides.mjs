/**
 * CEA201 · Chương 7 theo syllabus (= Chapter 8 bản 11e) — Input/Output,
 * học theo từng slide, PHẦN B: slide 26–50 của deck 'cea8' (deck có 50 slide).
 *
 * ⚠️ ĐÁNH SỐ: syllabus của trường theo bản 9th ed và gọi phần này là
 * "Chapter 7: Input/Output"; bộ slide là bản 11th ed nên in "Chapter 8".
 * Cùng một nội dung, khác số. Xem bảng quy đổi trong _slides.mjs.
 * Phần A (slide 1–25) nằm ở ch7a-slides.mjs.
 *
 * Nội dung bám ĐÚNG chữ trích từ CH08-COA11e.pptx (/tmp/cea201-text/cea8.txt).
 * Những slide chỉ có tiêu đề + hình/bảng (26, 27, 28, 29, 30, 32, 33, 34, 35,
 * 36, 37, 38, 39, 45, 48, 49, 50) đã được ĐỌC THẲNG TỪ ẢNH render
 * (/tmp/cea201-slides/cea8/NNN.webp) để lấy đúng từng nhãn trên sơ đồ.
 *
 * ⚠️ MỌI con số trong bài đã kiểm bằng python3 TRƯỚC khi viết:
 *   · Cycle stealing, bài 1: 50 MB/s · 4 B mỗi chu kỳ · 100 MHz → băng thông bus
 *     400 MB/s; DMA ăn 12,5 triệu chu kỳ/s = 12,5 %; CPU còn 87,5 %.
 *   · Bài 2: 20 MB/s · 2 B · 50 MHz → bus 100 MB/s; DMA 10 triệu chu kỳ/s = 20 %;
 *     CPU còn 80 %.
 *   · Bài 3: 100 MB/s · 4 B · 100 MHz → 25 triệu chu kỳ/s = 25 %; CPU còn 75 %.
 *   · Bài 4 (bẫy): 500 MB/s · 4 B · 100 MHz → cần 125 triệu chu kỳ/s trên một bus
 *     chỉ có 100 triệu ⇒ 125 % — BẤT KHẢ THI, không phải "CPU còn −25 %".
 *   · Ngắt so với DMA, khối 4 KB, từ 4 byte → 1024 từ ⇒ 1024 lần ngắt so với 1;
 *     với 500 chu kỳ mỗi ngắt: 512.000 chu kỳ so với ~550 chu kỳ = 931 lần;
 *     ở 3 GHz là 170,7 µs so với 0,18 µs. Từ 1 B → 4096 lần; từ 8 B → 512 lần.
 *   · Ba cấu hình DMA, cùng khối 4 KB (1024 từ): (a) 2 chu kỳ bus mỗi từ = 2048;
 *     (b) và (c) 1 chu kỳ bus HỆ THỐNG mỗi từ = 1024.
 *   · USB: 5 Gbps × 8b/10b = 4,0 Gbps đúng bằng con số slide ghi; 10 Gbps ×
 *     128b/132b = 9,697 ≈ 9,7 Gbps — cũng khớp. Đổi byte: 1,5 Mbps = 0,1875 MB/s ·
 *     12 Mbps = 1,5 MB/s · 480 Mbps = 60 MB/s · 4 Gbps = 500 MB/s ·
 *     9,7 Gbps = 1.212 MB/s. USB 3.1 nhanh gấp 6.667 lần USB 1.0 Low Speed.
 *   · Ethernet 10 Gbps với khung nhỏ nhất (64 B + 20 B khoảng cách) = 14,881
 *     triệu gói/s ⇒ ở 3 GHz chỉ còn 201,6 chu kỳ cho mỗi gói; 100 Gbps →
 *     148,81 triệu gói/s ⇒ 20,2 chu kỳ/gói. Đây là lý do DCA phải ra đời.
 *   · LLC của Xeon E5-2600 = 8 × 2,5 MB = 20 MB; luồng 10 Gbps (1,25 GB/s) quét
 *     hết 20 MB trong 16 ms.
 *   · FireWire: 63 = 2^6 − 1 thiết bị/cổng, 1022 bus qua cầu nối.
 *   · Ethernet 3 Mbps → 100 Gbps = gấp 33.333 lần. SCSI 5 → 160 = gấp 32 lần.
 *   · SATA 6 Gbps = 750 MB/s lý thuyết (≈600 MB/s sau mã 8b/10b).
 *   · z13: 6 channel subsystem × 4 subchannel set × 64k = 1.572.864 kênh;
 *     6 × 15 = 90 phân vùng nhưng trần hệ thống là 85.
 *
 * Chỗ slide gốc SAI / CŨ / CẦN LƯU Ý — nêu rõ trong bài, không im lặng chép,
 * cũng không tự ý sửa slide:
 *   · slide 30 (Table 8.2): cột Status in "Channel 0 request" ở CẢ BỐN bit
 *     D4–D7. Datasheet 8237A thật là kênh 0/1/2/3 — lỗi sao chép của slide.
 *   · slide 38: danh sách đánh số 1, 2, 3, rồi "4, 4, 4" — ba mục cuối đều mang
 *     số 4. Đúng ra phải là 4, 5, 6 (sáu bước tiến hoá).
 *   · slide 42 (SCSI): ghi tốc độ "5 Mbps … 160 Mbps". Đơn vị thật của SCSI là
 *     MB/s (5 MB/s → 160 MB/s). Sách/slide dùng nhầm bps.
 *   · slide 45 (SATA): "data rates of up to 6 Gbps, with a maximum per device of
 *     300 Mbps" — 300 Mbps = 37,5 MB/s, vô lý với đĩa. Con số hợp lý là
 *     300 MB/s (đúng bằng SATA 3 Gbps sau mã 8b/10b).
 *   · slide 45: cột PCI Express chỉ có ĐÚNG MỘT gạch đầu dòng, trống gần hết
 *     nửa slide — không phải lỗi render.
 *   · slide 47 (Wi-Fi): "Current version is 802.11ac (2014) … 3.2 Gbps" — đã cũ
 *     ngay cả với sách in 2022 (802.11ax/Wi-Fi 6 ra 2019).
 *   · slide 43 (Thunderbolt): "10 Gbps … most recent and fastest" mô tả
 *     Thunderbolt 1 (2011); Thunderbolt 3/4 đã là 40 Gbps.
 *   · slide 40 (USB): dừng ở USB 3.1 (10 Gbps). Không có USB 3.2 (20 Gbps) và
 *     USB4 (40 Gbps) dù sách in 2022.
 *   · slide 48 (Figure 8.19): nhãn in "d 15 partitions" và "d 85 partitions" —
 *     chữ "d" là ký hiệu ≤ bị hỏng font khi xuất slide.
 *   · slide 50 (Summary): liệt kê "IBM zEnterprise EC12 I/O structure" trong khi
 *     hai hình 8.19/8.20 của chính chương vẽ IBM **z13** — slide tóm tắt còn sót
 *     tên máy của bản sách cũ.
 *   · Chương KHÔNG có slide nào về "điểm-điểm so với nhiều điểm" (point-to-point
 *     vs multipoint) — phần giao diện ngoài của bản 11e đi thẳng vào từng chuẩn
 *     cụ thể (USB, FireWire, SCSI, Thunderbolt, InfiniBand, PCIe/SATA, Ethernet,
 *     Wi-Fi). Bài này bám theo slide.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea8';

export default {
  title: '7.0b — Slide by slide: DMA, Direct Cache Access, I/O channels and external interface standards (slides 26–50)|||7.0b — Slide bài giảng: DMA, Direct Cache Access, kênh I/O & chuẩn ghép nối ngoài (slide 26–50)',
  slug: 'cea201-7-0b-slides-dma-dca-kenh-io-chuan-ghep-noi',
  type: 'DOCUMENT',
  description: 'Nửa sau chương Input/Output của CEA201 (slide 26–50 của bộ slide Stallings 11e), và là phần đề thi hỏi nhiều nhất. Đi trọn DMA: điểm dừng trong chu trình lệnh và cơ chế "ăn trộm chu kỳ" (có bốn bài tính phần trăm băng thông bus, kể cả một bài BẤT KHẢ THI), ba cấu hình DMA đếm theo số chu kỳ bus, chip 8237A và kiểu fly-by. Rồi tới Direct Cache Access và DDIO — vì sao DMA hụt hơi trước Ethernet 10/100 Gbps khi mỗi gói chỉ còn 20 chu kỳ CPU. Khép lại bằng sáu bước tiến hoá của chức năng I/O, kênh I/O selector và multiplexor, tám chuẩn ghép nối ngoài (USB, FireWire, SCSI, Thunderbolt, InfiniBand, PCIe/SATA, Ethernet, Wi-Fi) và cấu trúc kênh của IBM z13. Mọi con số đã kiểm bằng python3, và những chỗ slide gốc ghi sai đơn vị hay đã lỗi thời đều được chỉ ra thay vì chép lại.',
  content: [
    walkHead(D, 26, 50),
    walk(D, [

      [26, 'Figure 8.13 — DMA and Interrupt Breakpoints during an Instruction Cycle',
        `<p class="y-chinh">🎯 The single most important picture for understanding <strong>cycle stealing</strong>. One instruction cycle is drawn as six processor cycles — <em>Fetch Instruction · Decode Instruction · Fetch Operand · Execute Instruction · Store Result · Process Interrupt</em> — with <strong>three arrows labelled "DMA Breakpoints"</strong> pointing into the gaps <em>between</em> the early cycles, and <strong>one arrow labelled "Interrupt Breakpoint"</strong> pointing only at the very end, just before Process Interrupt.</p>
<ul>
<li><strong>Read the difference in arrow positions — that is the whole slide.</strong> An interrupt can only be taken at <em>one</em> place: after the current instruction has completely finished. DMA can slip in at <em>several</em> places, wherever the processor is not actually using the bus. Many breakpoints versus one breakpoint.</li>
<li><strong>Why DMA gets more breakpoints.</strong> An interrupt forces the processor to <em>save state and change what it is doing</em> — that is only safe at an instruction boundary. DMA asks for nothing of the sort: it only wants the <strong>system bus</strong> for one cycle. The processor's registers, PC and flags are untouched, so there is nothing to save and nothing to restore.</li>
<li><strong>"Steal" is the exactly right verb.</strong> The DMA module makes the processor <em>pause one bus cycle</em>, uses the bus, and hands it back. The processor is <em>suspended</em>, not <em>interrupted</em>. Stallings' own sentence: DMA "steals" a bus cycle; the effect is to cause the processor to execute more slowly, but it is still far more efficient than having the processor move each word itself.</li>
<li><strong>The cost model this implies.</strong> Interrupt cost is <em>per event</em> and expensive (save context, dispatch, restore — hundreds of cycles). Cycle-stealing cost is <em>per word</em> and cheap (one bus cycle, no context change). That asymmetry is why DMA wins on big blocks even though it touches the bus for every single word.</li>
<li><strong>Connect back to Ch.3.</strong> The bus arbitration you learned there is exactly the machinery that makes this possible: the DMA module raises a bus request, becomes bus master for one cycle, then releases. Figure 8.15 on slide 28 names the actual wires (HRQ/HLDA).</li>
</ul>
<p class="nhan">📐 <strong>The complete three-technique table</strong>, finishing the one begun at Table 8.1 (slide 9 of part A):</p>
<table>
<tr><th></th><th>Programmed I/O</th><th>Interrupt-driven I/O</th><th>DMA</th></tr>
<tr><td><strong>Who moves each word</strong></td><td>The CPU</td><td>The CPU</td><td>The DMA controller</td></tr>
<tr><td><strong>CPU work per word</strong></td><td>Poll loop + read + store ≈ 5–10 instructions</td><td>Read + store inside an ISR, plus the interrupt overhead ≈ hundreds of cycles</td><td><strong>Zero instructions</strong> — only 1 stolen bus cycle</td></tr>
<tr><td><strong>CPU work per block</strong></td><td>Nothing extra</td><td>Nothing extra</td><td>Set up the controller once + handle <strong>one</strong> completion interrupt</td></tr>
<tr><td><strong>Where the CPU is blocked</strong></td><td>Blocked <em>the whole time</em>, spinning in the status-test loop</td><td>Not blocked waiting, but <em>stopped dead</em> during every ISR</td><td>Never blocked; only <em>slowed</em> while bus cycles are stolen</td></tr>
<tr><td><strong>Data path (Table 8.1 row)</strong></td><td>device → CPU register → memory (bus crossed twice)</td><td>device → CPU register → memory (bus crossed twice)</td><td>device → memory directly (bus crossed once)</td></tr>
<tr><td><strong>Interrupts used?</strong></td><td>No</td><td>Yes, one per word/event</td><td>Yes, <strong>one per block</strong></td></tr>
<tr><td><strong>Use it when</strong></td><td>Tiny transfers, simple/embedded systems, boot code before interrupts exist</td><td>Slow or unpredictable devices — keyboard, mouse, serial line</td><td><strong>Large volumes of data</strong> — disk, network, graphics, audio</td></tr>
</table>
<p class="nhan">📐 <strong>Worked problem 1 (the standard exam form).</strong> A device transfers at <strong>50 MB/s</strong>. The bus carries <strong>4 bytes per bus cycle</strong> at <strong>100 MHz</strong>. What fraction of bus bandwidth does DMA steal, and how much is left for the processor?</p>
<p class="dap-an">✅ Bus bandwidth = 4 B × 100 × 10<sup>6</sup> = <strong>400 MB/s</strong>. Cycles the device needs = 50 × 10<sup>6</sup> ÷ 4 = <strong>12,5 × 10<sup>6</sup> cycles per second</strong>. As a fraction of the 100 × 10<sup>6</sup> cycles available: 12,5 ÷ 100 = <strong>12,5 %</strong> stolen, so the processor still gets <strong>87,5 %</strong> of the bus. Shortcut: the answer is simply <em>device rate ÷ bus bandwidth</em> = 50 ÷ 400.</p>
<p class="nhan">📐 <strong>Worked problem 2 (different numbers).</strong> Device 20 MB/s, bus 2 bytes per cycle at 50 MHz.</p>
<p class="dap-an">✅ Bus bandwidth = 2 × 50 × 10<sup>6</sup> = <strong>100 MB/s</strong>. Needed = 20 × 10<sup>6</sup> ÷ 2 = <strong>10 × 10<sup>6</sup> cycles/s</strong> out of 50 × 10<sup>6</sup> ⇒ <strong>20 %</strong> stolen, <strong>80 %</strong> left. Same shortcut: 20 ÷ 100 = 20 %.</p>
<p class="nhan">📐 <strong>Worked problem 3.</strong> Device 100 MB/s, bus 4 bytes per cycle at 100 MHz.</p>
<p class="dap-an">✅ Bandwidth is still 400 MB/s, so 100 ÷ 400 = <strong>25 %</strong> stolen, <strong>75 %</strong> left. Doubling the device rate doubles the theft — the relationship is strictly linear, which is exactly why a 10-Gbps NIC breaks this model (slide 31).</p>
<p class="pitfall">⚠️ <strong>Worked problem 4 — the trap.</strong> Device 500 MB/s, same 400 MB/s bus. Needed = 500 × 10<sup>6</sup> ÷ 4 = <strong>125 × 10<sup>6</sup> cycles/s</strong> on a bus that only has 100 × 10<sup>6</sup> ⇒ <strong>125 %</strong>. The right answer is <strong>not</strong> "the CPU gets −25 %"; it is "<strong>this configuration is impossible</strong> — the device overruns the bus and data will be lost." Always sanity-check whether your percentage exceeds 100.</p>
<p class="pitfall">⚠️ Classic confusion: <em>cycle stealing is NOT an interrupt.</em> No context is saved, no ISR runs, the program counter does not move, and the running instruction is not abandoned. Writing "DMA interrupts the CPU for each word" loses the mark — DMA interrupts the CPU <strong>once, at the end of the whole block</strong>.</p>`,
        `<p class="y-chinh">🎯 Bức hình quan trọng nhất để hiểu <strong>cycle stealing — "ăn trộm chu kỳ"</strong>. Một chu trình lệnh được vẽ thành sáu chu kỳ bộ xử lý — <em>Fetch Instruction · Decode Instruction · Fetch Operand · Execute Instruction · Store Result · Process Interrupt</em> — với <strong>BA mũi tên ghi "DMA Breakpoints"</strong> chỉ vào các khe <em>GIỮA</em> mấy chu kỳ đầu, và <strong>ĐÚNG MỘT mũi tên ghi "Interrupt Breakpoint"</strong> chỉ vào tận cuối, ngay trước Process Interrupt.</p>
<ul>
<li><strong>Đọc sự khác nhau ở VỊ TRÍ mũi tên — đó là toàn bộ slide.</strong> Ngắt chỉ được nhận ở ĐÚNG MỘT chỗ: sau khi lệnh hiện hành đã chạy xong hoàn toàn. Còn DMA thì chen vào được ở NHIỀU chỗ, hễ chỗ nào bộ xử lý không thật sự đang dùng bus. Nhiều điểm dừng so với một điểm dừng.</li>
<li><strong>Vì sao DMA được nhiều điểm dừng hơn.</strong> Ngắt bắt bộ xử lý <em>cất trạng thái và ĐỔI việc đang làm</em> — chuyện đó chỉ an toàn ở ranh giới lệnh. DMA thì chẳng đòi hỏi gì như vậy: nó chỉ mượn <strong>bus hệ thống</strong> đúng một chu kỳ. Thanh ghi, PC, cờ trạng thái của bộ xử lý không bị đụng, nên không có gì để cất và không có gì để phục hồi.</li>
<li><strong>Chữ "ăn trộm" là động từ chính xác.</strong> Module DMA bắt bộ xử lý <em>dừng một nhịp bus</em>, dùng bus, rồi trả lại. Bộ xử lý bị <em>TẠM DỪNG</em>, chứ không bị <em>NGẮT</em>. Nguyên văn Stallings: DMA "steals" một chu kỳ bus; hệ quả là bộ xử lý chạy chậm hơn, nhưng vẫn hiệu quả hơn nhiều so với để chính nó đi chuyển từng từ.</li>
<li><strong>Mô hình chi phí suy ra từ đó.</strong> Chi phí ngắt tính <em>THEO SỰ KIỆN</em> và đắt (cất ngữ cảnh, phân phối, khôi phục — hàng trăm chu kỳ). Chi phí ăn trộm chu kỳ tính <em>THEO TỪ</em> và rẻ (một chu kỳ bus, không đổi ngữ cảnh). Chính sự lệch pha đó khiến DMA thắng trên khối lớn, dù nó đụng vào bus cho từng từ một.</li>
<li><strong>Nối ngược về Ch.3.</strong> Cơ chế trọng tài bus (bus arbitration) bạn học ở đó chính là bộ máy làm chuyện này khả thi: module DMA phát yêu cầu, giành quyền làm chủ bus một chu kỳ, rồi nhả ra. Figure 8.15 ở slide 28 gọi tên đúng những sợi dây đó (HRQ/HLDA).</li>
</ul>
<p class="nhan">📐 <strong>BẢNG SO BA KỸ THUẬT I/O — bản hoàn chỉnh</strong>, nối tiếp cái bảng đã mở ở Table 8.1 (slide 9, phần A):</p>
<table>
<tr><th></th><th>I/O bằng chương trình</th><th>I/O bằng ngắt</th><th>DMA</th></tr>
<tr><td><strong>Ai chuyển từng từ</strong></td><td>CPU</td><td>CPU</td><td>Bộ điều khiển DMA</td></tr>
<tr><td><strong>CPU tốn bao nhiêu công MỖI TỪ</strong></td><td>Vòng hỏi + đọc + cất ≈ 5–10 lệnh</td><td>Đọc + cất trong ISR, cộng chi phí ngắt ≈ hàng trăm chu kỳ</td><td><strong>KHÔNG lệnh nào</strong> — chỉ 1 chu kỳ bus bị ăn trộm</td></tr>
<tr><td><strong>CPU tốn bao nhiêu công MỖI KHỐI</strong></td><td>Không thêm gì</td><td>Không thêm gì</td><td>Nạp cấu hình một lần + xử lý <strong>MỘT</strong> ngắt báo xong</td></tr>
<tr><td><strong>CPU bị chặn ở đâu</strong></td><td>Bị chặn <em>SUỐT</em>, quay trong vòng kiểm trạng thái</td><td>Không phải chờ, nhưng <em>đứng hình</em> trong mỗi lần chạy ISR</td><td>Không bao giờ bị chặn; chỉ bị <em>CHẬM LẠI</em> khi bị lấy mất nhịp bus</td></tr>
<tr><td><strong>Đường đi dữ liệu (hàng của Table 8.1)</strong></td><td>thiết bị → thanh ghi CPU → bộ nhớ (qua bus 2 lần)</td><td>thiết bị → thanh ghi CPU → bộ nhớ (qua bus 2 lần)</td><td>thiết bị → bộ nhớ thẳng (qua bus 1 lần)</td></tr>
<tr><td><strong>Có dùng ngắt không?</strong></td><td>Không</td><td>Có, mỗi từ/sự kiện một lần</td><td>Có, <strong>mỗi KHỐI một lần</strong></td></tr>
<tr><td><strong>Dùng khi nào</strong></td><td>Truyền rất nhỏ, hệ nhúng đơn giản, mã khởi động khi chưa có ngắt</td><td>Thiết bị chậm hoặc bất thường — bàn phím, chuột, cổng nối tiếp</td><td><strong>Dữ liệu KHỐI LỚN</strong> — đĩa, mạng, đồ hoạ, âm thanh</td></tr>
</table>
<p class="nhan">📐 <strong>Bài tính 1 (dạng chuẩn hay ra thi).</strong> Thiết bị truyền <strong>50 MB/s</strong>. Bus chuyển <strong>4 byte mỗi chu kỳ</strong>, tần số <strong>100 MHz</strong>. DMA chiếm bao nhiêu phần trăm băng thông bus, CPU còn lại bao nhiêu?</p>
<p class="dap-an">✅ Băng thông bus = 4 B × 100 × 10<sup>6</sup> = <strong>400 MB/s</strong>. Số chu kỳ thiết bị cần = 50 × 10<sup>6</sup> ÷ 4 = <strong>12,5 × 10<sup>6</sup> chu kỳ mỗi giây</strong>. So với 100 × 10<sup>6</sup> chu kỳ sẵn có: 12,5 ÷ 100 = <strong>12,5 %</strong> bị ăn trộm, bộ xử lý vẫn còn <strong>87,5 %</strong> bus. Đường tắt: đáp án chính là <em>tốc độ thiết bị ÷ băng thông bus</em> = 50 ÷ 400.</p>
<p class="nhan">📐 <strong>Bài tính 2 (số khác).</strong> Thiết bị 20 MB/s, bus 2 byte mỗi chu kỳ ở 50 MHz.</p>
<p class="dap-an">✅ Băng thông bus = 2 × 50 × 10<sup>6</sup> = <strong>100 MB/s</strong>. Cần = 20 × 10<sup>6</sup> ÷ 2 = <strong>10 × 10<sup>6</sup> chu kỳ/s</strong> trên 50 × 10<sup>6</sup> ⇒ ăn trộm <strong>20 %</strong>, còn <strong>80 %</strong>. Vẫn đường tắt đó: 20 ÷ 100 = 20 %.</p>
<p class="nhan">📐 <strong>Bài tính 3.</strong> Thiết bị 100 MB/s, bus 4 byte mỗi chu kỳ ở 100 MHz.</p>
<p class="dap-an">✅ Băng thông vẫn 400 MB/s, nên 100 ÷ 400 = ăn trộm <strong>25 %</strong>, còn <strong>75 %</strong>. Nhân đôi tốc độ thiết bị thì nhân đôi phần bị lấy — quan hệ TUYẾN TÍNH nghiêm ngặt, và chính vì vậy một card mạng 10 Gbps làm vỡ mô hình này (slide 31).</p>
<p class="pitfall">⚠️ <strong>Bài tính 4 — cái bẫy.</strong> Thiết bị 500 MB/s, vẫn bus 400 MB/s. Cần = 500 × 10<sup>6</sup> ÷ 4 = <strong>125 × 10<sup>6</sup> chu kỳ/s</strong> trên một bus chỉ có 100 × 10<sup>6</sup> ⇒ <strong>125 %</strong>. Đáp án đúng KHÔNG phải "CPU còn −25 %", mà là "<strong>cấu hình này BẤT KHẢ THI</strong> — thiết bị tràn bus, dữ liệu sẽ mất". Luôn kiểm lại xem phần trăm của bạn có vượt 100 không.</p>
<p class="pitfall">⚠️ Nhầm lẫn kinh điển: <em>ăn trộm chu kỳ KHÔNG PHẢI là ngắt.</em> Không cất ngữ cảnh, không chạy ISR nào, con trỏ lệnh không nhúc nhích, lệnh đang chạy không bị bỏ dở. Viết "DMA ngắt CPU cho mỗi từ" là mất điểm — DMA ngắt CPU <strong>ĐÚNG MỘT LẦN, ở cuối cả khối</strong>.</p>`],

      [27, 'Figure 8.14 — Alternative DMA Configurations',
        `<p class="y-chinh">🎯 Three ways to wire a DMA module into a system, drawn one above the other: <strong>(a) Single-bus, detached DMA</strong> · <strong>(b) Single-bus, Integrated DMA-I/O</strong> · <strong>(c) I/O bus</strong>. They differ in exactly one thing that matters — <em>how many times each word has to cross the system bus</em>.</p>
<table>
<tr><th>Config</th><th>What the figure shows</th><th>System-bus cycles <em>per word</em></th><th>Why</th></tr>
<tr><td><strong>(a) Single-bus, detached DMA</strong></td><td>Processor · DMA · I/O · … · I/O · Memory, all hanging off <em>one</em> bus as separate boxes</td><td><strong>2</strong></td><td>Word travels I/O module → DMA over the bus, then DMA → memory over the bus. Two separate transfers.</td></tr>
<tr><td><strong>(b) Single-bus, Integrated DMA-I/O</strong></td><td>One box holding "DMA" stacked on "I/O"; and a second DMA box with <em>two</em> I/O modules drawn hanging below it, off the bus</td><td><strong>1</strong></td><td>The DMA module and the I/O module(s) it serves are joined by a <em>private</em> path that is not the system bus. Only the DMA → memory leg uses the bus.</td></tr>
<tr><td><strong>(c) I/O bus</strong></td><td>Two horizontal lines: a "System bus" carrying Processor · DMA · Memory on top, and an "I/O bus" carrying three I/O modules below, with DMA bridging the two</td><td><strong>1</strong></td><td>Same saving as (b), but generalised: one DMA controller serves an entire bus full of devices instead of one or two.</td></tr>
</table>
<ul>
<li><strong>The real progression is "reduce bus crossings, then scale up".</strong> (a) → (b) halves the system-bus traffic. (b) → (c) keeps that halving and adds <em>expandability</em>: you can plug more devices onto the I/O bus without adding DMA modules or extra system-bus boxes.</li>
<li><strong>Config (a) is the naive one and Stallings says so.</strong> All modules share the system bus, so the DMA module, acting as surrogate processor, uses programmed I/O to exchange data between memory and an I/O module. It works, but it is "inexpensive but clearly inefficient".</li>
<li><strong>Look carefully at (b) in the figure: there are TWO DMA boxes.</strong> One is fused with a single I/O module; the other sits alone and has <em>two</em> I/O modules attached beneath it. That is the slide showing that "integrated" can mean one DMA per device, or one DMA shared by a small group.</li>
<li><strong>Config (c) is what your laptop actually is.</strong> The "I/O bus" of Figure 8.14(c) is PCI Express in a modern machine; the DMA function lives in the root complex and in every device's own controller. Slide 32 (Figure 8.16) shows the same shape on a real Xeon die, with PCIe as the doorway to I/O devices.</li>
</ul>
<p class="nhan">📐 <strong>Worked comparison.</strong> Move a <strong>4 KB</strong> block with a <strong>4-byte</strong> word — that is 4096 ÷ 4 = <strong>1024 words</strong>. Count system-bus cycles:</p>
<table>
<tr><th>Config</th><th>Cycles per word</th><th>System-bus cycles for the 4 KB block</th></tr>
<tr><td>(a) detached DMA</td><td>2</td><td><strong>2048</strong></td></tr>
<tr><td>(b) integrated DMA-I/O</td><td>1</td><td><strong>1024</strong></td></tr>
<tr><td>(c) I/O bus</td><td>1 (system bus) + 1 (separate I/O bus)</td><td><strong>1024</strong> on the system bus</td></tr>
</table>
<p class="dap-an">✅ Answer: (b) and (c) cut system-bus occupancy <strong>exactly in half</strong> versus (a) — 1024 cycles instead of 2048 for the same 4 KB. Note carefully that (c) still moves 1024 words across the I/O bus too; the win is that those cycles no longer compete with the processor, because they happen on a <em>different</em> bus.</p>
<p class="meo">💡 Remember the three by counting boxes on the bus: <strong>(a) everything separate → 2 crossings. (b) DMA glued to I/O → 1 crossing. (c) a whole second bus for I/O → 1 crossing and unlimited devices.</strong></p>
<p class="pitfall">⚠️ Trap: config (c) is <em>not</em> "faster per word" than (b) — both are one system-bus cycle. What (c) buys is <strong>scalability and isolation</strong>, not raw speed. An exam answer that says (c) halves the traffic again is wrong.</p>`,
        `<p class="y-chinh">🎯 Ba cách cắm module DMA vào hệ thống, vẽ chồng lên nhau: <strong>(a) Single-bus, detached DMA</strong> (một bus, DMA rời) · <strong>(b) Single-bus, Integrated DMA-I/O</strong> (một bus, DMA tích hợp với I/O) · <strong>(c) I/O bus</strong> (có bus I/O riêng). Chúng khác nhau đúng một thứ đáng kể — <em>mỗi từ dữ liệu phải BĂNG QUA BUS HỆ THỐNG bao nhiêu lần</em>.</p>
<table>
<tr><th>Cấu hình</th><th>Hình vẽ gì</th><th>Số chu kỳ bus hệ thống <em>MỖI TỪ</em></th><th>Vì sao</th></tr>
<tr><td><strong>(a) Một bus, DMA rời</strong></td><td>Processor · DMA · I/O · … · I/O · Memory, tất cả treo trên <em>MỘT</em> bus như những hộp riêng biệt</td><td><strong>2</strong></td><td>Từ dữ liệu đi module I/O → DMA qua bus, rồi DMA → bộ nhớ qua bus. Hai lần truyền tách rời.</td></tr>
<tr><td><strong>(b) Một bus, DMA tích hợp I/O</strong></td><td>Một hộp "DMA" chồng lên "I/O"; và một hộp DMA thứ hai có <em>HAI</em> module I/O vẽ treo bên dưới, nằm ngoài bus</td><td><strong>1</strong></td><td>Module DMA và (các) module I/O nó phục vụ nối với nhau bằng đường <em>RIÊNG</em>, không phải bus hệ thống. Chỉ chặng DMA → bộ nhớ mới dùng bus.</td></tr>
<tr><td><strong>(c) Bus I/O riêng</strong></td><td>Hai đường ngang: "System bus" ở trên mang Processor · DMA · Memory, và "I/O bus" ở dưới mang ba module I/O, DMA bắc cầu giữa hai đường</td><td><strong>1</strong></td><td>Tiết kiệm y như (b), nhưng tổng quát hoá: một bộ điều khiển DMA phục vụ nguyên một bus đầy thiết bị thay vì một hai cái.</td></tr>
</table>
<ul>
<li><strong>Mạch tiến hoá thật là "giảm số lần băng qua bus, rồi mở rộng quy mô".</strong> (a) → (b) cắt một nửa lưu lượng trên bus hệ thống. (b) → (c) giữ nguyên phần cắt đó và thêm <em>KHẢ NĂNG MỞ RỘNG</em>: cắm thêm thiết bị vào bus I/O mà không phải thêm module DMA hay thêm hộp trên bus hệ thống.</li>
<li><strong>Cấu hình (a) là bản ngây thơ, và Stallings nói thẳng như vậy.</strong> Mọi module dùng chung bus hệ thống, nên module DMA đóng vai bộ xử lý thay thế, dùng đúng kiểu I/O bằng chương trình để trao đổi dữ liệu giữa bộ nhớ và module I/O. Chạy được, nhưng "rẻ mà rõ ràng kém hiệu quả".</li>
<li><strong>Nhìn kỹ hình (b): có tới HAI hộp DMA.</strong> Một hộp dính liền với một module I/O; hộp kia đứng riêng và có <em>HAI</em> module I/O gắn bên dưới. Đó là cách slide cho thấy "tích hợp" có thể là mỗi thiết bị một DMA, hoặc một DMA dùng chung cho một nhóm nhỏ.</li>
<li><strong>Cấu hình (c) chính là cái laptop của bạn.</strong> Cái "I/O bus" của Figure 8.14(c) trong máy hiện đại là PCI Express; chức năng DMA nằm trong root complex và trong bộ điều khiển của từng thiết bị. Slide 32 (Figure 8.16) vẽ đúng hình dạng đó trên một con Xeon thật, với PCIe là cánh cửa đi ra thiết bị I/O.</li>
</ul>
<p class="nhan">📐 <strong>So sánh có số.</strong> Chuyển một khối <strong>4 KB</strong> với từ <strong>4 byte</strong> — tức 4096 ÷ 4 = <strong>1024 từ</strong>. Đếm chu kỳ bus hệ thống:</p>
<table>
<tr><th>Cấu hình</th><th>Chu kỳ mỗi từ</th><th>Chu kỳ bus hệ thống cho cả khối 4 KB</th></tr>
<tr><td>(a) DMA rời</td><td>2</td><td><strong>2048</strong></td></tr>
<tr><td>(b) DMA tích hợp I/O</td><td>1</td><td><strong>1024</strong></td></tr>
<tr><td>(c) Bus I/O riêng</td><td>1 (bus hệ thống) + 1 (bus I/O riêng)</td><td><strong>1024</strong> trên bus hệ thống</td></tr>
</table>
<p class="dap-an">✅ Đáp án: (b) và (c) cắt thời gian chiếm bus hệ thống <strong>ĐÚNG MỘT NỬA</strong> so với (a) — 1024 chu kỳ thay vì 2048 cho cùng 4 KB. Để ý kỹ: (c) vẫn chuyển 1024 từ qua bus I/O; cái lợi là những chu kỳ đó KHÔNG còn tranh với bộ xử lý nữa, vì chúng xảy ra trên một bus <em>KHÁC</em>.</p>
<p class="meo">💡 Nhớ ba cấu hình bằng cách đếm hộp trên bus: <strong>(a) mọi thứ tách rời → 2 lần băng qua. (b) DMA dán vào I/O → 1 lần. (c) hẳn một bus thứ hai cho I/O → 1 lần và vô số thiết bị.</strong></p>
<p class="pitfall">⚠️ Bẫy: cấu hình (c) KHÔNG "nhanh hơn mỗi từ" so với (b) — cả hai đều một chu kỳ bus hệ thống. Thứ (c) mua được là <strong>KHẢ NĂNG MỞ RỘNG và CÁCH LY</strong>, không phải tốc độ thô. Bài thi trả lời rằng (c) lại cắt đôi lưu lượng lần nữa là SAI.</p>`],

      [28, 'Figure 8.15 — 8237 DMA Usage of System Bus',
        `<p class="y-chinh">🎯 The handshake, drawn with real wires. A <strong>CPU</strong> box on the left, an <strong>8237 DMA chip</strong> in the middle, <strong>Main memory</strong> and a <strong>Disk controller</strong> on the right, with three horizontal buses — <em>Data bus</em>, <em>Address bus</em>, <em>Control bus (IOR, IOW, MEMR, MEMW)</em> — and, crucially, <strong>switch symbols</strong> on the CPU's connections showing that the CPU can be <em>disconnected</em> from all three buses.</p>
<table>
<tr><th>Signal</th><th>Full name (from the slide's legend)</th><th>Direction</th><th>Meaning</th></tr>
<tr><td><strong>DREQ</strong></td><td>DMA request</td><td>Disk controller → 8237</td><td>"I have data ready / I need data"</td></tr>
<tr><td><strong>HRQ</strong></td><td>HOLD request</td><td>8237 → CPU</td><td>"Give me the buses"</td></tr>
<tr><td><strong>HLDA</strong></td><td>HOLD acknowledge</td><td>CPU → 8237</td><td>"Taken — buses are yours"</td></tr>
<tr><td><strong>DACK</strong></td><td>DMA acknowledge</td><td>8237 → disk controller</td><td>"Go ahead, transfer now"</td></tr>
</table>
<ul>
<li><strong>Follow the four signals in order and you have the whole protocol.</strong> DREQ → HRQ → HLDA → DACK, then the word moves, then everything releases. Learn that chain as a sentence: <em>device asks DMA, DMA asks CPU, CPU agrees, DMA tells device to go.</em></li>
<li><strong>The switch symbols are the visual heart of the slide.</strong> They are drawn on the CPU's data, address and control connections, and they show something important: while DMA holds the bus, the processor's bus drivers are electrically <strong>tri-stated</strong> — disconnected, not merely idle. This is what makes two bus masters on one bus possible without them shouting over each other.</li>
<li><strong>IOR, IOW, MEMR, MEMW are the trick that makes fly-by work.</strong> To move a word from disk to memory, the 8237 asserts <strong>IOR and MEMW at the same time</strong>: the disk controller drives the data bus, memory latches it. One bus cycle, one crossing, and the data never enters the 8237. Slide 29 gives this its name.</li>
<li><strong>Notice who supplies the address.</strong> The 8237 drives the <em>address bus</em> (memory address), while the device is selected by DACK rather than by an address. That is why the DMA controller holds an address register and a count register — it is generating memory addresses on the processor's behalf.</li>
<li><strong>Connect to Ch.3.</strong> This is bus arbitration with only two contenders and a fixed priority. In Ch.3's vocabulary: the DMA chip becomes <em>bus master</em>; HRQ/HLDA is a centralised arbitration handshake.</li>
</ul>
<p class="nhan">📐 <strong>Worked problem: how much CPU work does DMA actually save?</strong> Move a <strong>4 KB</strong> block, word size 4 bytes = <strong>1024 words</strong>. Assume an interrupt costs about <strong>500 cycles</strong> of processor time (save context, dispatch, ISR body, restore), and that interrupt-driven I/O interrupts <em>once per word</em>.</p>
<table>
<tr><th></th><th>Interrupt-driven I/O</th><th>DMA</th></tr>
<tr><td>Number of interrupts</td><td><strong>1024</strong> (one per word)</td><td><strong>1</strong> (one per block)</td></tr>
<tr><td>Processor cycles spent</td><td>1024 × 500 = <strong>512 000</strong></td><td>~50 (set-up) + 500 (one interrupt) = <strong>~550</strong></td></tr>
<tr><td>At 3 GHz, in real time</td><td><strong>170,7 µs</strong></td><td><strong>0,18 µs</strong></td></tr>
</table>
<p class="dap-an">✅ Answer: for the same 4 KB, interrupt-driven I/O costs the processor about <strong>931 times</strong> more work than DMA — 512 000 cycles against roughly 550. And the gap grows with word size: with a 1-byte word it is 4096 interrupts instead of one (<strong>4096×</strong> the interrupt count); with an 8-byte word, 512 interrupts. DMA's cost is <em>per block</em> and stays flat; interrupt cost is <em>per word</em> and scales with the data.</p>
<p class="meo">💡 Mnemonic for the handshake: <strong>"Device Requests, Hold Requested, Hold Granted, Device Acknowledged"</strong> — DREQ, HRQ, HLDA, DACK. The two with H are between DMA and CPU; the two with D are between DMA and device.</p>
<p class="pitfall">⚠️ The 500 cycles per interrupt is a <em>realistic estimate</em>, not a number printed on this slide — state your assumption when you use it in an exam. What <em>is</em> guaranteed by the material is the count: 1024 interrupts versus 1. Even with a generous 50-cycle interrupt, DMA still wins by a factor of about 90.</p>`,
        `<p class="y-chinh">🎯 Cái bắt tay, vẽ bằng dây thật. Hộp <strong>CPU</strong> bên trái, chip <strong>8237 DMA</strong> ở giữa, <strong>Main memory</strong> và <strong>Disk controller</strong> bên phải, cùng ba bus nằm ngang — <em>Data bus</em>, <em>Address bus</em>, <em>Control bus (IOR, IOW, MEMR, MEMW)</em> — và quan trọng nhất là những <strong>ký hiệu CÔNG TẮC</strong> trên các đường nối của CPU, cho thấy CPU có thể bị <em>NGẮT RỜI</em> khỏi cả ba bus.</p>
<table>
<tr><th>Tín hiệu</th><th>Tên đầy đủ (theo chú giải trên slide)</th><th>Chiều</th><th>Ý nghĩa</th></tr>
<tr><td><strong>DREQ</strong></td><td>DMA request — yêu cầu DMA</td><td>Disk controller → 8237</td><td>"Tôi có dữ liệu sẵn / tôi cần dữ liệu"</td></tr>
<tr><td><strong>HRQ</strong></td><td>HOLD request — xin giữ bus</td><td>8237 → CPU</td><td>"Nhường bus cho tôi"</td></tr>
<tr><td><strong>HLDA</strong></td><td>HOLD acknowledge — chấp nhận nhường</td><td>CPU → 8237</td><td>"Nhận đi — bus là của anh"</td></tr>
<tr><td><strong>DACK</strong></td><td>DMA acknowledge — báo cho thiết bị</td><td>8237 → disk controller</td><td>"Chuyển đi, ngay bây giờ"</td></tr>
</table>
<ul>
<li><strong>Đi theo bốn tín hiệu đúng thứ tự là nắm trọn giao thức.</strong> DREQ → HRQ → HLDA → DACK, rồi từ dữ liệu chạy, rồi mọi thứ nhả ra. Học chuỗi đó thành một câu: <em>thiết bị xin DMA, DMA xin CPU, CPU đồng ý, DMA bảo thiết bị chạy.</em></li>
<li><strong>Mấy ký hiệu công tắc là trái tim thị giác của slide.</strong> Chúng vẽ trên đường nối dữ liệu, địa chỉ và điều khiển của CPU, và chúng nói một điều quan trọng: trong lúc DMA giữ bus, các mạch lái bus của bộ xử lý bị đưa về trạng thái <strong>tổng trở cao (tri-state)</strong> — NGẮT RỜI hẳn, chứ không chỉ là "đang rảnh". Nhờ vậy hai bus master mới cùng tồn tại trên một bus mà không giẫm lên nhau.</li>
<li><strong>IOR, IOW, MEMR, MEMW là mẹo làm nên kiểu fly-by.</strong> Để chuyển một từ từ đĩa vào bộ nhớ, 8237 kéo <strong>IOR và MEMW CÙNG LÚC</strong>: bộ điều khiển đĩa đẩy dữ liệu lên bus, bộ nhớ chốt lấy. Một chu kỳ bus, một lần băng qua, và dữ liệu KHÔNG hề đi vào trong 8237. Slide 29 gọi tên chuyện này.</li>
<li><strong>Để ý AI cấp địa chỉ.</strong> 8237 lái <em>bus địa chỉ</em> (địa chỉ bộ nhớ), còn thiết bị được chọn bằng DACK chứ không bằng địa chỉ. Đó là lý do bộ điều khiển DMA phải có thanh ghi địa chỉ và thanh ghi đếm — nó đang sinh địa chỉ bộ nhớ thay cho bộ xử lý.</li>
<li><strong>Nối về Ch.3.</strong> Đây chính là trọng tài bus với đúng hai bên tranh và ưu tiên cố định. Theo từ vựng Ch.3: chip DMA trở thành <em>bus master</em>; cặp HRQ/HLDA là một cái bắt tay trọng tài tập trung.</li>
</ul>
<p class="nhan">📐 <strong>Bài tính: DMA thật sự tiết kiệm cho CPU bao nhiêu?</strong> Chuyển khối <strong>4 KB</strong>, từ 4 byte = <strong>1024 từ</strong>. Giả sử một lần ngắt tốn khoảng <strong>500 chu kỳ</strong> thời gian bộ xử lý (cất ngữ cảnh, phân phối, thân ISR, khôi phục), và I/O bằng ngắt thì ngắt <em>MỖI TỪ MỘT LẦN</em>.</p>
<table>
<tr><th></th><th>I/O bằng ngắt</th><th>DMA</th></tr>
<tr><td>Số lần ngắt</td><td><strong>1024</strong> (mỗi từ một lần)</td><td><strong>1</strong> (mỗi khối một lần)</td></tr>
<tr><td>Số chu kỳ bộ xử lý bỏ ra</td><td>1024 × 500 = <strong>512.000</strong></td><td>~50 (nạp cấu hình) + 500 (một lần ngắt) = <strong>~550</strong></td></tr>
<tr><td>Ở 3 GHz, quy ra thời gian thật</td><td><strong>170,7 µs</strong></td><td><strong>0,18 µs</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án: cùng 4 KB, I/O bằng ngắt bắt bộ xử lý làm nhiều gấp khoảng <strong>931 lần</strong> so với DMA — 512.000 chu kỳ so với chừng 550. Và khoảng cách còn giãn theo kích thước từ: từ 1 byte thì thành 4096 lần ngắt thay vì một (<strong>gấp 4096 lần</strong> số ngắt); từ 8 byte thì 512 lần. Chi phí DMA tính <em>THEO KHỐI</em> nên đứng yên; chi phí ngắt tính <em>THEO TỪ</em> nên phình theo dữ liệu.</p>
<p class="meo">💡 Mẹo nhớ cái bắt tay: <strong>"Thiết bị xin, Xin giữ bus, Cho giữ bus, Báo thiết bị"</strong> — DREQ, HRQ, HLDA, DACK. Hai cái có chữ H là giữa DMA và CPU; hai cái có chữ D là giữa DMA và thiết bị.</p>
<p class="pitfall">⚠️ Con số 500 chu kỳ mỗi lần ngắt là <em>ƯỚC LƯỢNG HỢP LÝ</em>, không phải số in trên slide này — đi thi thì phải nêu rõ giả thiết. Thứ mà tài liệu BẢO ĐẢM là SỐ ĐẾM: 1024 lần ngắt so với 1. Kể cả nếu rộng rãi cho ngắt chỉ 50 chu kỳ, DMA vẫn thắng khoảng 90 lần.</p>`],

      [29, 'Fly-By DMA Controller',
        `<p class="y-chinh">🎯 Three panels naming the defining property of the classic DMA controller: <strong>"Data does not pass through and is not stored in DMA chip."</strong> The data flies <em>by</em> the controller, not <em>through</em> it — hence "fly-by".</p>
<table>
<tr><th>Panel</th><th>What the slide says</th></tr>
<tr><td><strong>1</strong></td><td><strong>Data does not pass through and is not stored in DMA chip.</strong> · DMA can only transfer data between an I/O port and a memory address · <em>Not</em> between two I/O ports or two memory locations</td></tr>
<tr><td><strong>2</strong></td><td><strong>Can do memory to memory via register</strong></td></tr>
<tr><td><strong>3</strong></td><td><strong>8237 contains four DMA channels</strong> · Can be programmed independently · Any one of the channels may be active at any moment · These channels are numbered 0, 1, 2, and 3</td></tr>
</table>
<ul>
<li><strong>Why fly-by is fast: one bus cycle instead of two.</strong> The controller asserts the I/O read line and the memory write line in the same cycle, so the device drives the data bus and memory latches it directly. If data <em>did</em> pass through the DMA chip, every word would need a read cycle then a write cycle — the "2 bus cycles per word" of Figure 8.14(a).</li>
<li><strong>The restriction is the price of the trick.</strong> Because the controller never <em>holds</em> the data, it cannot originate it either — so a straight port-to-port or memory-to-memory move is impossible in fly-by mode. You cannot write a value you do not have.</li>
<li><strong>Panel 2 is the exception, and it is the one students misread.</strong> The 8237 <em>can</em> do memory-to-memory — but only "<strong>via register</strong>", i.e. by giving up fly-by and using a temporary register inside the chip, which costs two bus cycles per word. So the slide is not contradicting itself: fly-by forbids it, register mode allows it at double the cost.</li>
<li><strong>Four independent channels, one active at a time.</strong> Each channel has its own address register, count register and mode register, so four devices can each be "set up and waiting". But the chip serves only one at any moment, because there is only one bus to steal cycles from. Channels are 0–3, and Table 8.2 on the next slide shows exactly those four in its status and mask bits.</li>
<li><strong>Where you meet this today.</strong> The 8237's descendants are in every disk and network controller as "bus-master DMA" or "scatter-gather DMA". The vocabulary changed; the fly-by idea did not.</li>
</ul>
<p class="meo">💡 Picture a relay race baton pass where the baton never stops moving: fly-by DMA is the referee who blows the whistle and points, but never touches the baton. The moment he has to <em>hold</em> it (memory-to-memory), the race takes twice as long.</p>
<p class="pitfall">⚠️ Common exam mistake: "DMA copies data into the DMA controller and then into memory." That describes a <em>buffered</em> (flow-through) controller, not the fly-by controller this slide describes. If a question asks why fly-by DMA cannot do memory-to-memory transfers directly, the answer is precisely that the data never enters the chip.</p>`,
        `<p class="y-chinh">🎯 Ba khối chữ gọi tên tính chất định nghĩa của bộ điều khiển DMA kinh điển: <strong>"Data does not pass through and is not stored in DMA chip"</strong> — dữ liệu KHÔNG đi qua và KHÔNG được lưu trong chip DMA. Dữ liệu bay <em>NGANG QUA</em> bộ điều khiển chứ không <em>XUYÊN QUA</em> nó — nên mới gọi là "fly-by".</p>
<table>
<tr><th>Khối</th><th>Slide nói gì</th></tr>
<tr><td><strong>1</strong></td><td><strong>Dữ liệu không đi qua và không lưu trong chip DMA.</strong> · DMA chỉ chuyển được dữ liệu giữa một CỔNG I/O và một ĐỊA CHỈ BỘ NHỚ · <em>KHÔNG</em> chuyển được giữa hai cổng I/O hay giữa hai ô nhớ</td></tr>
<tr><td><strong>2</strong></td><td><strong>Làm được bộ nhớ sang bộ nhớ, nhưng QUA THANH GHI</strong></td></tr>
<tr><td><strong>3</strong></td><td><strong>8237 có bốn kênh DMA</strong> · Lập trình độc lập được · Tại một thời điểm chỉ một kênh bất kỳ hoạt động · Các kênh đánh số 0, 1, 2, 3</td></tr>
</table>
<ul>
<li><strong>Vì sao fly-by nhanh: MỘT chu kỳ bus thay vì hai.</strong> Bộ điều khiển kéo đường đọc I/O và đường ghi bộ nhớ trong CÙNG một chu kỳ, nên thiết bị đẩy dữ liệu lên bus và bộ nhớ chốt thẳng. Nếu dữ liệu <em>CÓ</em> đi xuyên qua chip DMA thì mỗi từ phải một chu kỳ đọc rồi một chu kỳ ghi — đúng cái "2 chu kỳ bus mỗi từ" của Figure 8.14(a).</li>
<li><strong>Hạn chế chính là cái giá của mẹo đó.</strong> Vì bộ điều khiển không bao giờ <em>GIỮ</em> dữ liệu, nó cũng không thể <em>SINH RA</em> dữ liệu — nên chuyển thẳng cổng-sang-cổng hay bộ nhớ-sang-bộ nhớ là bất khả trong chế độ fly-by. Không thể ghi ra một giá trị mà mình không cầm.</li>
<li><strong>Khối 2 là ngoại lệ, và đây là chỗ sinh viên hay đọc nhầm.</strong> 8237 <em>CÓ</em> làm được bộ nhớ-sang-bộ nhớ — nhưng chỉ "<strong>qua thanh ghi</strong>", tức là bỏ chế độ fly-by và dùng một thanh ghi tạm bên trong chip, tốn hai chu kỳ bus mỗi từ. Vậy slide không tự mâu thuẫn: fly-by CẤM, chế độ thanh ghi CHO PHÉP với giá gấp đôi.</li>
<li><strong>Bốn kênh độc lập, mỗi lúc một kênh chạy.</strong> Mỗi kênh có thanh ghi địa chỉ, thanh ghi đếm và thanh ghi chế độ riêng, nên bốn thiết bị đều có thể "đã nạp xong và đang chờ". Nhưng chip chỉ phục vụ MỘT kênh tại một thời điểm, vì chỉ có một cái bus để mà ăn trộm chu kỳ. Kênh đánh số 0–3, và Table 8.2 ở slide sau hiện đúng bốn kênh đó trong các bit trạng thái và bit mặt nạ.</li>
<li><strong>Hôm nay bạn gặp nó ở đâu.</strong> Con cháu của 8237 nằm trong mọi bộ điều khiển đĩa và card mạng dưới tên "bus-master DMA" hay "scatter-gather DMA". Từ vựng đổi, ý tưởng fly-by thì không.</li>
</ul>
<p class="meo">💡 Hình dung cuộc chạy tiếp sức mà cây gậy không bao giờ dừng: DMA fly-by là ông trọng tài thổi còi và chỉ tay, nhưng không bao giờ CẦM cây gậy. Đúng lúc ông phải <em>cầm</em> nó (bộ nhớ sang bộ nhớ) thì cuộc đua dài gấp đôi.</p>
<p class="pitfall">⚠️ Lỗi thi hay gặp: "DMA chép dữ liệu vào bộ điều khiển DMA rồi mới chép vào bộ nhớ". Câu đó mô tả bộ điều khiển có <em>ĐỆM</em> (flow-through), không phải bộ điều khiển fly-by mà slide này nói tới. Đề hỏi vì sao DMA fly-by không chuyển thẳng bộ nhớ sang bộ nhớ được thì đáp án đúng chính là: dữ liệu không bao giờ đi vào trong chip.</p>`],

      [30, 'Table 8.2 — Intel 8237A Registers',
        `<p class="y-chinh">🎯 A bit-by-bit map of the five control/status registers of a real DMA chip, with <strong>D0…D7 down the left</strong> and five columns across: <strong>Command · Status · Mode · Single Mask · All Mask</strong>. Two footnotes define the abbreviations: <strong>E/D = enable/disable</strong>, <strong>TC = terminal count</strong>.</p>
<table>
<tr><th>Bit</th><th>Command</th><th>Status</th><th>Mode</th><th>Single Mask</th><th>All Mask</th></tr>
<tr><td>D0</td><td>Memory-to-memory E/D</td><td>Channel 0 has reached TC</td><td rowspan="2">Channel select</td><td rowspan="2">Select channel mask bit</td><td>Clear/set channel 0 mask bit</td></tr>
<tr><td>D1</td><td>Channel 0 address hold E/D</td><td>Channel 1 has reached TC</td><td>Clear/set channel 1 mask bit</td></tr>
<tr><td>D2</td><td>Controller E/D</td><td>Channel 2 has reached TC</td><td>Verify/write/read transfer</td><td>Clear/set mask bit</td><td>Clear/set channel 2 mask bit</td></tr>
<tr><td>D3</td><td>Normal/compressed timing</td><td>Channel 3 has reached TC</td><td><em>(blank)</em></td><td><em>(blank)</em></td><td>Clear/set channel 3 mask bit</td></tr>
<tr><td>D4</td><td>Fixed/rotating priority</td><td>Channel 0 request</td><td>Auto-initialization E/D</td><td><em>(blank)</em></td><td><em>(blank)</em></td></tr>
<tr><td>D5</td><td>Late/extended write selection</td><td>Channel 0 request</td><td>Address increment/decrement select</td><td><em>(blank)</em></td><td><em>(blank)</em></td></tr>
<tr><td>D6</td><td>DREQ sense active high/low</td><td>Channel 0 request</td><td><em>(blank)</em></td><td><em>(blank)</em></td><td><em>(blank)</em></td></tr>
<tr><td>D7</td><td>DACK sense active high/low</td><td>Channel 0 request</td><td>Demand/single/block/cascade mode select</td><td><em>(blank)</em></td><td><em>(blank)</em></td></tr>
</table>
<ul>
<li><strong>Read the table by columns, not rows — each column is one 8-bit register with a different job.</strong> <em>Command</em> configures the whole chip. <em>Status</em> is read-only and reports what happened. <em>Mode</em> configures one channel. <em>Single Mask</em> enables/disables one channel; <em>All Mask</em> does all four at once.</li>
<li><strong>"Terminal count" (TC) is the finish line.</strong> Each channel counts words down; reaching zero is TC, and that is precisely the event that raises the <em>one</em> completion interrupt of the whole block transfer. Status bits D0–D3 latch "this channel has reached TC" for channels 0–3.</li>
<li><strong>Mode D7 names the four transfer styles</strong> — <em>demand / single / block / cascade</em>. "Single" transfers one word per bus acquisition (classic cycle stealing); "block" holds the bus for the whole block (faster, but starves the CPU); "demand" transfers as long as the device asserts DREQ; "cascade" chains a second 8237 to get more channels.</li>
<li><strong>Mode D5, "address increment/decrement", is not decoration.</strong> It lets DMA walk memory backwards, which is what you need for a memory-to-memory copy where source and destination regions overlap — the same reason C has <code>memmove</code> as well as <code>memcpy</code>.</li>
<li><strong>Command D0 and D2 tie back to slide 29.</strong> D0 enables the memory-to-memory mode that fly-by cannot do directly; D2 is the master enable for the whole controller.</li>
</ul>
<p class="pitfall">⚠️ <strong>The slide has a copy error and you should see it.</strong> The Status column prints "<strong>Channel 0 request</strong>" for <em>all four</em> of D4, D5, D6 and D7. In the real 8237A datasheet those bits report the pending request of channels <strong>0, 1, 2 and 3</strong> respectively — exactly parallel to D0–D3 reporting TC for channels 0–3. The pattern of the table makes the intent obvious; the slide simply repeats one label. Do not memorise it as printed.</p>
<p class="meo">💡 Do not try to learn all 40 cells. Learn the <em>column headings</em> (which register does what), the two footnotes (E/D, TC), and three facts: TC ends a transfer, D7 of Mode picks the transfer style, and masks turn channels on and off. That is all an exam on this table can reasonably ask.</p>`,
        `<p class="y-chinh">🎯 Bản đồ từng bit của năm thanh ghi điều khiển/trạng thái trong một chip DMA có thật, với <strong>D0…D7 chạy dọc bên trái</strong> và năm cột ngang: <strong>Command · Status · Mode · Single Mask · All Mask</strong>. Hai chú thích chân bảng định nghĩa viết tắt: <strong>E/D = enable/disable (bật/tắt)</strong>, <strong>TC = terminal count (đếm về đích)</strong>.</p>
<table>
<tr><th>Bit</th><th>Command</th><th>Status</th><th>Mode</th><th>Single Mask</th><th>All Mask</th></tr>
<tr><td>D0</td><td>Bật/tắt chế độ bộ nhớ↔bộ nhớ</td><td>Kênh 0 đã tới TC</td><td rowspan="2">Chọn kênh</td><td rowspan="2">Chọn bit mặt nạ của kênh</td><td>Xoá/đặt bit mặt nạ kênh 0</td></tr>
<tr><td>D1</td><td>Bật/tắt giữ địa chỉ kênh 0</td><td>Kênh 1 đã tới TC</td><td>Xoá/đặt bit mặt nạ kênh 1</td></tr>
<tr><td>D2</td><td>Bật/tắt cả bộ điều khiển</td><td>Kênh 2 đã tới TC</td><td>Kiểu truyền: kiểm tra/ghi/đọc</td><td>Xoá/đặt bit mặt nạ</td><td>Xoá/đặt bit mặt nạ kênh 2</td></tr>
<tr><td>D3</td><td>Nhịp thường/nhịp nén</td><td>Kênh 3 đã tới TC</td><td><em>(trống)</em></td><td><em>(trống)</em></td><td>Xoá/đặt bit mặt nạ kênh 3</td></tr>
<tr><td>D4</td><td>Ưu tiên cố định/xoay vòng</td><td>Kênh 0 có yêu cầu</td><td>Bật/tắt tự khởi tạo lại</td><td><em>(trống)</em></td><td><em>(trống)</em></td></tr>
<tr><td>D5</td><td>Chọn kiểu ghi trễ/ghi kéo dài</td><td>Kênh 0 có yêu cầu</td><td>Chọn tăng/giảm địa chỉ</td><td><em>(trống)</em></td><td><em>(trống)</em></td></tr>
<tr><td>D6</td><td>DREQ tích cực mức cao/thấp</td><td>Kênh 0 có yêu cầu</td><td><em>(trống)</em></td><td><em>(trống)</em></td><td><em>(trống)</em></td></tr>
<tr><td>D7</td><td>DACK tích cực mức cao/thấp</td><td>Kênh 0 có yêu cầu</td><td>Chọn chế độ demand/single/block/cascade</td><td><em>(trống)</em></td><td><em>(trống)</em></td></tr>
</table>
<ul>
<li><strong>Đọc bảng THEO CỘT, đừng đọc theo hàng — mỗi cột là một thanh ghi 8 bit với một nhiệm vụ khác nhau.</strong> <em>Command</em> cấu hình cả chip. <em>Status</em> chỉ đọc, báo lại chuyện đã xảy ra. <em>Mode</em> cấu hình một kênh. <em>Single Mask</em> bật/tắt một kênh; <em>All Mask</em> làm cả bốn cùng lúc.</li>
<li><strong>"Terminal count" (TC) là vạch đích.</strong> Mỗi kênh đếm lùi số từ; đếm về 0 là TC, và đó chính xác là sự kiện làm phát <em>MỘT</em> cái ngắt báo xong cho cả khối. Bit trạng thái D0–D3 chốt lại "kênh này đã tới TC" cho kênh 0–3.</li>
<li><strong>Mode D7 gọi tên bốn kiểu truyền</strong> — <em>demand / single / block / cascade</em>. "Single" chuyển một từ mỗi lần giành được bus (ăn trộm chu kỳ kinh điển); "block" giữ bus suốt cả khối (nhanh hơn, nhưng bỏ đói CPU); "demand" chuyển chừng nào thiết bị còn kéo DREQ; "cascade" nối thêm một con 8237 nữa để có nhiều kênh hơn.</li>
<li><strong>Mode D5 "tăng/giảm địa chỉ" không phải đồ trang trí.</strong> Nó cho DMA duyệt bộ nhớ theo chiều NGƯỢC, đúng thứ bạn cần khi chép bộ nhớ sang bộ nhớ mà vùng nguồn và vùng đích chồng lấn — cùng lý do khiến C phải có <code>memmove</code> bên cạnh <code>memcpy</code>.</li>
<li><strong>Command D0 và D2 nối ngược về slide 29.</strong> D0 bật chế độ bộ nhớ↔bộ nhớ mà fly-by không làm thẳng được; D2 là công tắc tổng của cả bộ điều khiển.</li>
</ul>
<p class="pitfall">⚠️ <strong>Slide có LỖI CHÉP và bạn nên nhìn ra.</strong> Cột Status in "<strong>Channel 0 request</strong>" ở CẢ BỐN bit D4, D5, D6, D7. Trong datasheet 8237A thật, bốn bit đó báo yêu cầu đang treo của kênh <strong>0, 1, 2 và 3</strong> theo thứ tự — song song hoàn hảo với D0–D3 báo TC cho kênh 0–3. Nhìn quy luật của bảng là thấy ngay ý định; slide chỉ đơn giản lặp lại một nhãn. Đừng học thuộc y như in.</p>
<p class="meo">💡 Đừng cố học thuộc cả 40 ô. Học <em>TIÊU ĐỀ CỘT</em> (thanh ghi nào làm gì), hai chú thích (E/D, TC), và ba sự thật: TC kết thúc một lần truyền, D7 của Mode chọn kiểu truyền, và mặt nạ bật/tắt kênh. Đề thi về bảng này hỏi được nhiều nhất cũng chỉ tới đó.</p>`],

      [31, 'Direct Cache Access (DCA) — why DMA stops scaling',
        `<p class="y-chinh">🎯 The turning point of the chapter: <strong>"DMA is not able to scale to meet the increased demand due to dramatic increases in data rates for network I/O."</strong> Everything from slide 24 to 30 sold you DMA; this slide tells you where DMA now falls short, and why Intel had to invent something past it.</p>
<table>
<tr><th>The slide's four statements</th><th>What it means in practice</th></tr>
<tr><td>DMA cannot scale to meet demand, because network I/O data rates have risen dramatically</td><td>The per-word cost of DMA is small, but at 10 Gbps there are so many words that "small × enormous" is large again</td></tr>
<tr><td>Demand comes primarily from the widespread deployment of <strong>10-Gbps and 100-Gbps Ethernet switches</strong></td><td>Data centre links, not desktop ones — the pressure point is the server</td></tr>
<tr><td>…to handle massive data transfer to and from <strong>database servers and other high-performance systems</strong></td><td>These machines do nothing but move packets in and out of memory all day</td></tr>
<tr><td>Another source is <strong>Wi-Fi in the gigabit range</strong> — devices handling <strong>3,2 Gbps and 6,76 Gbps</strong> are becoming widely available</td><td>Even the wireless edge now feeds the server faster than DMA was designed for</td></tr>
</table>
<ul>
<li><strong>The real bottleneck is no longer the bus — it is the cache and the interrupt rate.</strong> DMA solved "the CPU must copy every word". It did <em>not</em> solve "the CPU must still touch every packet's headers, and every one of those touches is a cache miss because DMA wrote the data to <em>main memory</em>, not to cache".</li>
<li><strong>That is the whole motivation for DCA in one line.</strong> If the data is going to be read by a core almost immediately, why park it in DRAM first? Put it where the core will look — the cache. Slides 33–37 build that argument step by step.</li>
<li><strong>Note the two demand sources are different in kind.</strong> 10/100-Gbps Ethernet is about raw aggregate volume. Gigabit Wi-Fi is about <em>many</em> moderately fast clients arriving at one enterprise system. Both end at the same place: a server whose cores spend their time on packet headers.</li>
<li><strong>Connects to Ch.4 and Ch.5.</strong> This is a cache problem wearing an I/O costume. DMA writing into main memory behind the cores' backs is exactly the <em>cache coherence</em> situation you met in the memory chapters — the copy in cache may now be stale, so hardware must invalidate it, and the core must miss.</li>
</ul>
<p class="nhan">📐 <strong>Worked problem: how much time does a core actually have per packet?</strong> Ethernet's smallest frame is 64 bytes plus 20 bytes of inter-frame gap and preamble = 84 bytes on the wire.</p>
<table>
<tr><th>Link</th><th>Packets per second (minimum size)</th><th>CPU cycles available per packet at 3 GHz</th></tr>
<tr><td>10 Gbps</td><td>10 × 10<sup>9</sup> ÷ (84 × 8) = <strong>14,88 million</strong></td><td>3 × 10<sup>9</sup> ÷ 14,88 × 10<sup>6</sup> = <strong>201,6 cycles</strong></td></tr>
<tr><td>100 Gbps</td><td><strong>148,81 million</strong></td><td><strong>20,2 cycles</strong></td></tr>
</table>
<p class="dap-an">✅ Answer: at 100-Gbps line rate a core gets about <strong>20 cycles per packet</strong> — and a single last-level-cache miss costs <em>hundreds</em>. That one comparison is the entire case for DCA: you cannot afford even one cache miss per packet, so the data must already be in cache when the core looks. (With ordinary 1500-byte packets, 10 Gbps is a gentler 833 000 packets/s, but servers are sized for the worst case.)</p>
<p class="pitfall">⚠️ Do not read this slide as "DMA is obsolete". DMA is still how the bytes move; DCA changes only <strong>where they are deposited</strong>. Figure 8.17 on slide 37 shows DDIO as a modified DMA path, not a replacement for it.</p>`,
        `<p class="y-chinh">🎯 Bước ngoặt của chương: <strong>"DMA không mở rộng nổi để đáp ứng nhu cầu, vì tốc độ dữ liệu của I/O mạng đã tăng chóng mặt."</strong> Từ slide 24 tới 30 bài đang bán cho bạn DMA; slide này nói cho bạn biết DMA hụt hơi ở đâu, và vì sao Intel phải nghĩ ra thứ đi xa hơn nó.</p>
<table>
<tr><th>Bốn câu của slide</th><th>Nghĩa thực tế</th></tr>
<tr><td>DMA không mở rộng nổi theo nhu cầu, vì tốc độ dữ liệu I/O mạng tăng vọt</td><td>Chi phí MỖI TỪ của DMA thì nhỏ, nhưng ở 10 Gbps số từ nhiều tới mức "nhỏ × khổng lồ" lại thành to</td></tr>
<tr><td>Nhu cầu chủ yếu đến từ việc triển khai rộng rãi <strong>switch Ethernet 10 Gbps và 100 Gbps</strong></td><td>Là đường trong trung tâm dữ liệu chứ không phải máy bàn — điểm chịu lực là MÁY CHỦ</td></tr>
<tr><td>…để cõng khối lượng dữ liệu khổng lồ ra vào <strong>máy chủ cơ sở dữ liệu và các hệ hiệu năng cao</strong></td><td>Những máy này cả ngày không làm gì ngoài đẩy gói tin ra vào bộ nhớ</td></tr>
<tr><td>Một nguồn nữa là <strong>Wi-Fi ở mức gigabit</strong> — thiết bị chạy <strong>3,2 Gbps và 6,76 Gbps</strong> đang phổ biến dần</td><td>Ngay cả biên không dây giờ cũng bơm vào máy chủ nhanh hơn mức DMA được thiết kế để chịu</td></tr>
</table>
<ul>
<li><strong>Nút thắt thật sự không còn là BUS nữa — mà là CACHE và tần suất ngắt.</strong> DMA đã giải xong bài "CPU phải chép từng từ". Nó <em>KHÔNG</em> giải bài "CPU vẫn phải sờ vào phần tiêu đề của MỌI gói, và mỗi lần sờ là một lần trượt cache, vì DMA đã ghi dữ liệu vào <em>BỘ NHỚ CHÍNH</em> chứ không vào cache".</li>
<li><strong>Đó là toàn bộ động cơ của DCA gói trong một dòng.</strong> Nếu dữ liệu sắp được một lõi đọc gần như ngay lập tức, cớ gì phải đỗ nó ở DRAM trước? Hãy đặt nó vào đúng chỗ lõi sẽ nhìn — tức cache. Slide 33–37 dựng lập luận đó từng bước.</li>
<li><strong>Để ý hai nguồn nhu cầu khác BẢN CHẤT.</strong> Ethernet 10/100 Gbps là chuyện KHỐI LƯỢNG thô gộp lại. Wi-Fi gigabit là chuyện RẤT NHIỀU máy khách tốc độ vừa cùng đổ về một hệ thống doanh nghiệp. Cả hai kết thúc ở cùng một chỗ: một máy chủ mà các lõi dành hết thời gian cho tiêu đề gói tin.</li>
<li><strong>Nối sang Ch.4 và Ch.5.</strong> Đây là một bài toán CACHE khoác áo I/O. DMA ghi thẳng vào bộ nhớ chính sau lưng các lõi chính là tình huống <em>NHẤT QUÁN CACHE</em> mà bạn đã gặp ở các chương bộ nhớ — bản sao trong cache có thể đã ôi, nên phần cứng phải vô hiệu hoá nó, và lõi bắt buộc phải trượt.</li>
</ul>
<p class="nhan">📐 <strong>Bài tính: một lõi thật sự có bao nhiêu thời gian cho MỖI GÓI?</strong> Khung Ethernet nhỏ nhất là 64 byte cộng 20 byte khoảng cách khung và preamble = 84 byte trên dây.</p>
<table>
<tr><th>Đường truyền</th><th>Số gói mỗi giây (gói nhỏ nhất)</th><th>Số chu kỳ CPU còn cho mỗi gói ở 3 GHz</th></tr>
<tr><td>10 Gbps</td><td>10 × 10<sup>9</sup> ÷ (84 × 8) = <strong>14,88 triệu</strong></td><td>3 × 10<sup>9</sup> ÷ 14,88 × 10<sup>6</sup> = <strong>201,6 chu kỳ</strong></td></tr>
<tr><td>100 Gbps</td><td><strong>148,81 triệu</strong></td><td><strong>20,2 chu kỳ</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án: ở tốc độ đường truyền 100 Gbps, mỗi lõi chỉ còn khoảng <strong>20 chu kỳ cho một gói</strong> — trong khi MỘT lần trượt cache mức cuối tốn tới <em>HÀNG TRĂM</em> chu kỳ. Chỉ một phép so đó thôi là đủ biện minh cho DCA: bạn không kham nổi dù chỉ một lần trượt cache mỗi gói, nên dữ liệu phải NẰM SẴN trong cache lúc lõi nhìn tới. (Với gói 1500 byte thông thường thì 10 Gbps nhẹ nhàng hơn, 833.000 gói/s, nhưng máy chủ phải thiết kế cho trường hợp xấu nhất.)</p>
<p class="pitfall">⚠️ Đừng đọc slide này thành "DMA đã lỗi thời". DMA vẫn là cách các byte di chuyển; DCA chỉ đổi <strong>CHỖ ĐỔ DỮ LIỆU XUỐNG</strong>. Figure 8.17 ở slide 37 vẽ DDIO như một đường DMA được sửa, chứ không phải thứ thay thế DMA.</p>`],

      [32, 'Figure 8.16 — Xeon E5-2600/4600 Chip Architecture',
        `<p class="y-chinh">🎯 A real multicore die, drawn so you can see <em>where I/O data lands</em>. Inside the dashed "Chip boundary": <strong>eight cores</strong> (Core 0–3 down the left, Core 7–4 down the right), each with its own <strong>L1 (64 KB)</strong> and <strong>L2 (256 KB)</strong>; in the centre <strong>eight L3 cache slices of 2,5 MB each</strong>; at the top a <strong>QPI</strong> port "To other processor chip" and a <strong>PCIe</strong> port "To I/O devices"; at the bottom a <strong>Memory Controller Hub</strong> going "To DDR3 memory". Cores, caches, PCIe and the memory hub are all strung on a <strong>ring interconnect</strong> (the thick loop with ⊕ stops).</p>
<ul>
<li><strong>The one detail that matters for this chapter: PCIe is ON the ring.</strong> The I/O port is a first-class participant in the on-chip network, sitting next to the L3 slices. That is what makes DCA physically possible — an incoming packet can be steered into L3 without a detour through DRAM, because the wire to L3 already exists.</li>
<li><strong>Count the last-level cache.</strong> Eight slices × 2,5 MB = <strong>20 MB of L3</strong>, shared by all eight cores. Hold that number: it is what DDIO must fit network buffers into without evicting the application's working set.</li>
<li><strong>Three-level hierarchy, exactly as Ch.5 described.</strong> L1 64 KB private per core → L2 256 KB private per core → L3 20 MB shared. The private/shared boundary is where coherence traffic lives, and where a DMA write has to announce itself.</li>
<li><strong>QPI versus PCIe is worth separating.</strong> QPI goes to <em>another processor chip</em> (this is a multi-socket server), PCIe goes to <em>I/O devices</em>. Both are point-to-point serial links, not the shared parallel bus of Ch.3 — this die is the picture of why buses became links.</li>
<li><strong>The ring is the modern answer to "one shared bus".</strong> Ch.3's single system bus could not feed eight cores; a ring gives many simultaneous transfers. Ch.21 (Multicore) returns to exactly this figure's family of designs.</li>
</ul>
<p class="nhan">📐 <strong>Worked check.</strong> Total on-chip cache, and how fast a network link can wash it away:</p>
<table>
<tr><th>Level</th><th>Per core</th><th>Total on the die</th></tr>
<tr><td>L1</td><td>64 KB</td><td>8 × 64 KB = 512 KB</td></tr>
<tr><td>L2</td><td>256 KB</td><td>8 × 256 KB = 2 MB</td></tr>
<tr><td>L3 (shared)</td><td>—</td><td>8 × 2,5 MB = <strong>20 MB</strong></td></tr>
</table>
<p class="dap-an">✅ A 10-Gbps link delivers 10 ÷ 8 = <strong>1,25 GB/s</strong>. Dividing 20 MB by 1,25 GB/s gives <strong>16 ms</strong> — that is how long a single 10-Gbps stream takes to write as many bytes as the <em>entire</em> 20 MB L3 holds. On a server with several such links, the last-level cache is completely overwritten many times a second. This is why DDIO must be <em>limited</em> to a portion of L3 rather than allowed to use all of it.</p>
<p class="meo">💡 When you look at any modern die photo, find three things in this order: the cores, the shared last-level cache, and <em>the I/O port</em>. Chapter 8's whole second half is about how close those last two are to each other.</p>`,
        `<p class="y-chinh">🎯 Một con chip đa lõi có thật, vẽ ra để bạn thấy <em>dữ liệu I/O rơi xuống chỗ nào</em>. Bên trong khung nét đứt "Chip boundary": <strong>tám lõi</strong> (Core 0–3 chạy dọc bên trái, Core 7–4 dọc bên phải), mỗi lõi có <strong>L1 (64 KB)</strong> và <strong>L2 (256 KB)</strong> riêng; ở giữa là <strong>tám lát L3, mỗi lát 2,5 MB</strong>; phía trên có cổng <strong>QPI</strong> đi "To other processor chip" và cổng <strong>PCIe</strong> đi "To I/O devices"; phía dưới là <strong>Memory Controller Hub</strong> đi "To DDR3 memory". Lõi, cache, PCIe và bộ điều khiển nhớ đều xâu trên một <strong>vòng liên kết (ring)</strong> — cái vòng dày có những chấm ⊕.</p>
<ul>
<li><strong>Chi tiết duy nhất quan trọng cho chương này: PCIe NẰM NGAY TRÊN VÒNG.</strong> Cổng I/O là một thành viên chính thức của mạng trong chip, ngồi sát các lát L3. Đó chính là thứ làm DCA khả thi về mặt vật lý — một gói tin vào có thể lái thẳng vào L3 mà không phải vòng qua DRAM, vì sợi dây tới L3 vốn đã có sẵn.</li>
<li><strong>Đếm cache mức cuối.</strong> Tám lát × 2,5 MB = <strong>20 MB L3</strong>, dùng chung cho cả tám lõi. Giữ con số đó: nó là chỗ mà DDIO phải nhét vừa các bộ đệm mạng vào mà không đuổi mất vùng làm việc của ứng dụng.</li>
<li><strong>Ba mức cache, đúng như Ch.5 mô tả.</strong> L1 64 KB riêng mỗi lõi → L2 256 KB riêng mỗi lõi → L3 20 MB dùng chung. Ranh giới riêng/chung chính là nơi lưu lượng nhất quán cache sinh sống, và là nơi một lệnh ghi DMA buộc phải "lên tiếng".</li>
<li><strong>Tách bạch QPI với PCIe.</strong> QPI đi sang <em>con chip xử lý khác</em> (đây là máy chủ nhiều socket), PCIe đi ra <em>thiết bị I/O</em>. Cả hai đều là liên kết nối tiếp điểm-điểm, không phải bus song song dùng chung của Ch.3 — con chip này chính là bức tranh giải thích vì sao bus đã nhường chỗ cho liên kết.</li>
<li><strong>Cái vòng là câu trả lời hiện đại cho "một bus dùng chung".</strong> Bus hệ thống đơn của Ch.3 không nuôi nổi tám lõi; vòng cho phép nhiều lần truyền diễn ra đồng thời. Ch.21 (Máy tính đa lõi) quay lại đúng họ thiết kế của hình này.</li>
</ul>
<p class="nhan">📐 <strong>Kiểm bằng số.</strong> Tổng cache trên chip, và một đường mạng rửa sạch nó nhanh cỡ nào:</p>
<table>
<tr><th>Mức</th><th>Mỗi lõi</th><th>Tổng trên chip</th></tr>
<tr><td>L1</td><td>64 KB</td><td>8 × 64 KB = 512 KB</td></tr>
<tr><td>L2</td><td>256 KB</td><td>8 × 256 KB = 2 MB</td></tr>
<tr><td>L3 (dùng chung)</td><td>—</td><td>8 × 2,5 MB = <strong>20 MB</strong></td></tr>
</table>
<p class="dap-an">✅ Một đường 10 Gbps đưa về 10 ÷ 8 = <strong>1,25 GB/s</strong>. Lấy 20 MB chia 1,25 GB/s được <strong>16 ms</strong> — tức là chỉ một luồng 10 Gbps ghi đủ số byte bằng <em>TOÀN BỘ</em> 20 MB L3 trong vỏn vẹn 16 mili giây. Trên máy chủ có vài đường như thế, cache mức cuối bị ghi đè sạch vài chục lần mỗi giây. Đó là lý do DDIO phải bị <em>GIỚI HẠN</em> trong một phần của L3 chứ không được dùng cả.</p>
<p class="meo">💡 Nhìn bất kỳ ảnh chụp die hiện đại nào thì hãy tìm ba thứ theo thứ tự: các lõi, cache mức cuối dùng chung, và <em>cổng I/O</em>. Cả nửa sau Chương 8 nói về chuyện hai thứ sau cùng nằm gần nhau tới mức nào.</p>`],

      [33, 'Cache-Related Performance Issues (1 of 2) — how a packet is really shaped',
        `<p class="y-chinh">🎯 Six bands of text that set up the DCA argument by describing <strong>what a network packet actually is</strong> and <strong>who touches which part of it</strong>. Nothing here is about caches yet — it is the groundwork.</p>
<table>
<tr><th>#</th><th>The slide's statement</th></tr>
<tr><td>1</td><td>Network traffic is transmitted in the form of a sequence of protocol blocks called <strong>packets</strong> or <strong>protocol data units</strong></td></tr>
<tr><td>2</td><td>The lowest, or <strong>link</strong>, level protocol is typically <strong>Ethernet</strong>, so each arriving and departing block consists of an Ethernet packet containing as payload the higher-level protocol packet</td></tr>
<tr><td>3</td><td>The higher-level protocols are usually <strong>IP</strong>, operating on top of Ethernet, and <strong>TCP</strong>, operating on top of IP</td></tr>
<tr><td>4</td><td>The Ethernet payload consists of a block of data with a <strong>TCP header</strong> and an <strong>IP header</strong></td></tr>
<tr><td>5</td><td>For <strong>outgoing</strong> data, Ethernet packets are formed in a peripheral component, such as an I/O controller or <strong>network interface controller (NIC)</strong></td></tr>
<tr><td>6</td><td>For <strong>incoming</strong> traffic, the I/O controller strips off the Ethernet information and delivers the TCP/IP packet to the host CPU</td></tr>
</table>
<ul>
<li><strong>The key structural fact is nesting.</strong> An Ethernet frame carries an IP packet, which carries a TCP segment, which carries the application's data. Draw it as boxes inside boxes: [Ethernet [IP header][TCP header][payload]]. Each layer adds a header at the front.</li>
<li><strong>Why this matters for cache: headers and payload have completely different access patterns.</strong> The <em>headers</em> (tens of bytes) are read and written by the CPU on every single packet. The <em>payload</em> (up to 1500 bytes) is usually just handed on to the application, untouched by the protocol code. One is hot, one is cold — and DMA treats them identically.</li>
<li><strong>Statements 5 and 6 divide the labour.</strong> The NIC handles the Ethernet layer in hardware; the <em>host CPU</em> handles TCP/IP in software. So every packet's TCP and IP headers are a mandatory CPU touch — and, if the packet was DMA'd to DRAM, a mandatory cache miss.</li>
<li><strong>Multiply by the packet rate from slide 31 and you have the crisis.</strong> 14,88 million mandatory header touches per second on a 10-Gbps link, each risking a several-hundred-cycle miss, on a budget of 201 cycles per packet.</li>
<li><strong>Connect to CSI106 and to networking.</strong> This is the classic protocol stack — link, network, transport — seen from the hardware side. What CSI106 drew as layers, this chapter counts as cache misses.</li>
</ul>
<p class="meo">💡 Remember the nesting with an envelope image: Ethernet is the envelope, IP is the address label, TCP is the tracking slip, the payload is the letter. The post office (CPU) reads the label and the slip on <em>every</em> envelope, but never opens the letter.</p>
<p class="pitfall">⚠️ Careful with statement 6: the controller strips the <em>Ethernet</em> information, not the TCP/IP headers. Those still arrive at the CPU and still have to be parsed in software. A slide-reading question may test exactly this distinction.</p>`,
        `<p class="y-chinh">🎯 Sáu dải chữ dựng nền cho lập luận DCA, bằng cách mô tả <strong>một gói tin mạng thật ra là cái gì</strong> và <strong>ai sờ vào phần nào của nó</strong>. Chỗ này chưa nói gì về cache — nó là phần móng.</p>
<table>
<tr><th>#</th><th>Câu trên slide</th></tr>
<tr><td>1</td><td>Lưu lượng mạng được truyền dưới dạng một chuỗi khối giao thức gọi là <strong>gói tin (packet)</strong> hay <strong>đơn vị dữ liệu giao thức (PDU)</strong></td></tr>
<tr><td>2</td><td>Giao thức mức thấp nhất, mức <strong>liên kết</strong>, thường là <strong>Ethernet</strong>, nên mỗi khối đến và đi là một gói Ethernet mang phần tải là gói của giao thức mức cao hơn</td></tr>
<tr><td>3</td><td>Giao thức mức cao hơn thường là <strong>IP</strong> chạy trên Ethernet, và <strong>TCP</strong> chạy trên IP</td></tr>
<tr><td>4</td><td>Phần tải của Ethernet gồm một khối dữ liệu cùng với một <strong>tiêu đề TCP</strong> và một <strong>tiêu đề IP</strong></td></tr>
<tr><td>5</td><td>Với dữ liệu <strong>ĐI RA</strong>, gói Ethernet được tạo trong một bộ phận ngoại vi, như bộ điều khiển I/O hay <strong>card mạng (NIC)</strong></td></tr>
<tr><td>6</td><td>Với lưu lượng <strong>ĐI VÀO</strong>, bộ điều khiển I/O bóc bỏ phần Ethernet và giao gói TCP/IP cho CPU chủ</td></tr>
</table>
<ul>
<li><strong>Sự thật cấu trúc then chốt là LỒNG NHAU.</strong> Khung Ethernet cõng một gói IP, gói IP cõng một đoạn TCP, đoạn TCP cõng dữ liệu ứng dụng. Vẽ thành hộp trong hộp: [Ethernet [tiêu đề IP][tiêu đề TCP][phần tải]]. Mỗi tầng thêm một tiêu đề ở đầu.</li>
<li><strong>Vì sao chuyện này quan trọng với cache: TIÊU ĐỀ và PHẦN TẢI có kiểu truy cập hoàn toàn khác nhau.</strong> <em>Tiêu đề</em> (vài chục byte) bị CPU đọc và ghi ở MỌI gói. <em>Phần tải</em> (tới 1500 byte) thường chỉ được chuyển tiếp cho ứng dụng, mã giao thức không hề đụng tới. Một bên nóng, một bên nguội — mà DMA thì đối xử với cả hai y hệt nhau.</li>
<li><strong>Câu 5 và 6 chia việc.</strong> NIC lo tầng Ethernet bằng phần cứng; <em>CPU chủ</em> lo TCP/IP bằng phần mềm. Nên tiêu đề TCP và IP của mọi gói đều là một lần CPU BẮT BUỘC phải sờ vào — và nếu gói đó đã bị DMA đổ vào DRAM thì đó là một lần trượt cache BẮT BUỘC.</li>
<li><strong>Nhân với số gói mỗi giây ở slide 31 là ra khủng hoảng.</strong> 14,88 triệu lần bắt buộc sờ tiêu đề mỗi giây trên đường 10 Gbps, mỗi lần đều có nguy cơ trượt vài trăm chu kỳ, trong khi ngân sách chỉ 201 chu kỳ mỗi gói.</li>
<li><strong>Nối sang CSI106 và mạng máy tính.</strong> Đây chính là chồng giao thức kinh điển — liên kết, mạng, giao vận — nhìn từ phía phần cứng. Thứ CSI106 vẽ thành các tầng thì chương này ĐẾM thành số lần trượt cache.</li>
</ul>
<p class="meo">💡 Nhớ kiểu lồng nhau bằng hình cái phong bì: Ethernet là phong bì, IP là nhãn địa chỉ, TCP là phiếu theo dõi, phần tải là lá thư. Bưu điện (CPU) đọc nhãn và phiếu ở <em>MỌI</em> phong bì, nhưng không bao giờ mở lá thư ra.</p>
<p class="pitfall">⚠️ Cẩn thận với câu 6: bộ điều khiển bóc phần <em>ETHERNET</em>, chứ KHÔNG bóc tiêu đề TCP/IP. Hai tiêu đề đó vẫn tới CPU và vẫn phải phân tích bằng phần mềm. Câu hỏi đọc-hiểu-slide có thể kiểm đúng chỗ phân biệt này.</p>`],

      [34, 'Cache-Related Performance Issues (2 of 2) — the buffer copies DMA cannot avoid',
        `<p class="y-chinh">🎯 The slide that finally names the problem. Big left panel: <strong>"For both outgoing and incoming traffic the core, main memory, and cache are all involved."</strong> Right panel walks through a DMA transmit, and every step adds a memory touch.</p>
<table>
<tr><th>Step (outgoing, the slide's own sequence)</th><th>Where the data sits afterwards</th></tr>
<tr><td>The application places the data in an <strong>application-assigned buffer in main memory</strong></td><td>Application buffer</td></tr>
<tr><td>The core transfers this to a <strong>system buffer</strong> in main memory and creates the necessary <strong>TCP and IP headers</strong>, which are also buffered in system memory</td><td>System buffer (a full copy!)</td></tr>
<tr><td>The packet is then <strong>picked up via DMA</strong> for transfer via the NIC</td><td>On the wire</td></tr>
<tr><td>"This activity engages <strong>not only main memory but also the cache</strong>"</td><td>Both — and they must be kept coherent</td></tr>
<tr><td>"<strong>Similar transfers</strong> between system and application buffers are required for <strong>incoming</strong> traffic"</td><td>Same cost again, mirrored</td></tr>
</table>
<ul>
<li><strong>Count the copies and you see the waste.</strong> Application buffer → system buffer is a <em>full copy of the payload made by the core</em>, before DMA has done anything at all. DMA removed the copy between memory and device; it did nothing about the copy between two places in memory.</li>
<li><strong>The cache is dragged in whether you want it or not.</strong> The core's copy loop pulls both buffers into cache; then the DMA write to memory must invalidate or update those lines. So one packet can cost cache fills, cache evictions <em>and</em> coherence traffic — for bytes the protocol code never even reads.</li>
<li><strong>Now the two panels connect.</strong> Left panel says core + memory + cache are all involved; right panel shows why: because the data is written and read several times in memory before it ever reaches the NIC. That is the inefficiency DCA attacks.</li>
<li><strong>Incoming is the mirror image and just as expensive.</strong> NIC DMAs into a system buffer; the core reads headers (miss), processes them, then copies the payload into the application buffer (more misses, more evictions).</li>
<li><strong>Connect to Ch.5's write policy.</strong> Whether the DMA write invalidates the cached line or updates it is precisely a coherence-policy decision. Chapter 8 does not rework that theory — it shows you the workload that makes the theory expensive.</li>
</ul>
<p class="nhan">📐 <strong>Worked count for one 1500-byte packet, transmit path:</strong></p>
<table>
<tr><th>Operation</th><th>Bytes moved</th><th>Done by</th></tr>
<tr><td>Application buffer → system buffer</td><td>1500 read + 1500 written = 3000</td><td>The core (real instructions)</td></tr>
<tr><td>Build TCP + IP headers</td><td>~40 written</td><td>The core</td></tr>
<tr><td>System buffer → NIC</td><td>1540</td><td>DMA (no core instructions)</td></tr>
</table>
<p class="dap-an">✅ Answer: of roughly <strong>4540 bytes</strong> of memory traffic per packet, DMA only removed the <em>last</em> 1540. The core still touches about <strong>3040 bytes per packet</strong> — and at 833 000 packets/s (10 Gbps, 1500-byte frames) that is 2,5 GB/s of pure copying. Removing the copy, not just the device transfer, is what "avoiding the system buffer altogether" on slide 36 means.</p>
<p class="pitfall">⚠️ Do not confuse the two buffers. The <strong>application buffer</strong> belongs to the user process; the <strong>system buffer</strong> belongs to the kernel/driver. They exist for good reasons (protection, asynchrony, retransmission), which is why you cannot simply delete the copy — you need hardware help, and that is DDIO.</p>`,
        `<p class="y-chinh">🎯 Slide cuối cùng gọi tên được vấn đề. Khối lớn bên trái: <strong>"Với cả lưu lượng đi ra lẫn đi vào, LÕI, BỘ NHỚ CHÍNH và CACHE đều bị lôi vào cuộc."</strong> Khối bên phải đi từng bước một lần truyền DMA, và bước nào cũng thêm một lần đụng bộ nhớ.</p>
<table>
<tr><th>Bước (chiều đi ra, đúng trình tự slide)</th><th>Sau đó dữ liệu nằm ở đâu</th></tr>
<tr><td>Ứng dụng đặt dữ liệu vào <strong>bộ đệm do ứng dụng cấp, trong bộ nhớ chính</strong></td><td>Bộ đệm ứng dụng</td></tr>
<tr><td>Lõi chuyển nó sang <strong>bộ đệm hệ thống</strong> trong bộ nhớ chính và tạo <strong>tiêu đề TCP và IP</strong> cần thiết, cũng nằm trong bộ đệm hệ thống</td><td>Bộ đệm hệ thống (một bản chép ĐẦY ĐỦ!)</td></tr>
<tr><td>Gói tin sau đó được <strong>DMA nhặt đi</strong> để truyền qua NIC</td><td>Trên dây</td></tr>
<tr><td>"Hoạt động này huy động <strong>không chỉ bộ nhớ chính mà cả cache</strong>"</td><td>Cả hai — và phải giữ chúng nhất quán</td></tr>
<tr><td>"<strong>Những lần chuyển tương tự</strong> giữa bộ đệm hệ thống và bộ đệm ứng dụng cũng cần cho lưu lượng <strong>ĐI VÀO</strong>"</td><td>Tốn y như vậy, soi gương lại</td></tr>
</table>
<ul>
<li><strong>Đếm số lần chép là thấy chỗ lãng phí.</strong> Bộ đệm ứng dụng → bộ đệm hệ thống là <em>MỘT BẢN CHÉP ĐẦY ĐỦ phần tải, do chính lõi làm</em>, trước khi DMA kịp làm gì. DMA đã xoá lần chép giữa bộ nhớ và thiết bị; nó không xoá được lần chép giữa hai chỗ TRONG bộ nhớ.</li>
<li><strong>Cache bị lôi vào dù bạn có muốn hay không.</strong> Vòng chép của lõi kéo cả hai bộ đệm vào cache; rồi lệnh ghi DMA vào bộ nhớ lại buộc phải vô hiệu hoá hoặc cập nhật những dòng đó. Vậy là một gói tin có thể tốn cả nạp cache, đuổi cache <em>VÀ</em> lưu lượng nhất quán — cho những byte mà mã giao thức thậm chí không đọc.</li>
<li><strong>Đến đây hai khối mới nối được vào nhau.</strong> Khối trái nói lõi + bộ nhớ + cache đều dính; khối phải cho thấy vì sao: vì dữ liệu bị ghi và đọc mấy lượt trong bộ nhớ trước khi tới được NIC. Đó là chỗ kém hiệu quả mà DCA nhắm vào.</li>
<li><strong>Chiều đi vào là ảnh gương và cũng đắt y hệt.</strong> NIC DMA vào bộ đệm hệ thống; lõi đọc tiêu đề (trượt), xử lý, rồi chép phần tải sang bộ đệm ứng dụng (lại trượt, lại đuổi dòng).</li>
<li><strong>Nối về chính sách ghi ở Ch.5.</strong> Chuyện lệnh ghi DMA nên vô hiệu hoá hay cập nhật dòng cache chính là một quyết định về chính sách nhất quán. Chương 8 không làm lại lý thuyết đó — nó chỉ cho bạn thấy cái tải công việc khiến lý thuyết đó trở nên đắt đỏ.</li>
</ul>
<p class="nhan">📐 <strong>Đếm cụ thể cho một gói 1500 byte, chiều gửi đi:</strong></p>
<table>
<tr><th>Thao tác</th><th>Số byte di chuyển</th><th>Ai làm</th></tr>
<tr><td>Bộ đệm ứng dụng → bộ đệm hệ thống</td><td>đọc 1500 + ghi 1500 = 3000</td><td>Lõi (lệnh thật)</td></tr>
<tr><td>Dựng tiêu đề TCP + IP</td><td>ghi ~40</td><td>Lõi</td></tr>
<tr><td>Bộ đệm hệ thống → NIC</td><td>1540</td><td>DMA (không tốn lệnh của lõi)</td></tr>
</table>
<p class="dap-an">✅ Đáp án: trong khoảng <strong>4540 byte</strong> lưu lượng bộ nhớ mỗi gói, DMA chỉ bỏ đi được <em>1540 byte CUỐI</em>. Lõi vẫn phải sờ vào chừng <strong>3040 byte mỗi gói</strong> — và với 833.000 gói/s (10 Gbps, khung 1500 byte) thì đó là 2,5 GB/s chép thuần tuý. Bỏ được lần CHÉP, chứ không chỉ bỏ lần truyền tới thiết bị, mới là ý nghĩa của câu "bỏ hẳn bộ đệm hệ thống" ở slide 36.</p>
<p class="pitfall">⚠️ Đừng lẫn hai bộ đệm. <strong>Bộ đệm ứng dụng</strong> thuộc về tiến trình người dùng; <strong>bộ đệm hệ thống</strong> thuộc về nhân/trình điều khiển. Chúng tồn tại vì lý do chính đáng (bảo vệ, bất đồng bộ, truyền lại), nên bạn không thể xoá phăng lần chép đó — phải có phần cứng giúp, và thứ đó là DDIO.</p>`],

      [35, 'Packet Traffic Steps: Incoming and Outgoing',
        `<p class="y-chinh">🎯 Two step-by-step lists side by side that turn everything so far into a sequence you can recite. <strong>Incoming</strong> on the left (seven steps), <strong>Outgoing</strong> on the right (six steps). One step in the incoming list is the villain of the chapter.</p>
<table>
<tr><th>#</th><th>Incoming</th><th>Outgoing</th></tr>
<tr><td>1</td><td>Packet arrives</td><td>Packet transfer requested</td></tr>
<tr><td>2</td><td><strong>DMA</strong></td><td>Packet created</td></tr>
<tr><td>3</td><td>NIC interrupts host</td><td>Output operation invoked</td></tr>
<tr><td>4</td><td>Retrieve descriptors and headers</td><td><strong>DMA transfer</strong></td></tr>
<tr><td>5</td><td><strong>Cache miss occurs</strong></td><td>NIC signals completion</td></tr>
<tr><td>6</td><td>Header is processed</td><td>Driver frees buffer</td></tr>
<tr><td>7</td><td>Payload transferred</td><td>—</td></tr>
</table>
<ul>
<li><strong>Step 5 of the incoming list is printed as a step of normal operation, and that is the point.</strong> "Cache miss occurs" is not an error condition here — it is the <em>expected</em> outcome, every single packet, because step 2 (DMA) put the data in main memory where no cache line holds it.</li>
<li><strong>Trace the incoming path as a story.</strong> A packet lands on the wire (1); the NIC DMAs it into a system buffer in DRAM (2); the NIC raises an interrupt (3); the driver reads the descriptor ring and the headers (4); those reads miss in cache (5); the core parses TCP/IP (6); finally the payload is copied to the application (7).</li>
<li><strong>Outgoing mirrors it with one useful extra: step 6, "driver frees buffer".</strong> Buffers must be recycled or the system runs dry. That recycling is itself memory traffic and is why NICs use <em>descriptor rings</em> rather than one-shot buffers.</li>
<li><strong>Notice where the interrupt sits in each list.</strong> Incoming: the interrupt is step 3, <em>before</em> the work. Outgoing: it is step 5, <em>after</em> the work ("NIC signals completion"). Same mechanism, opposite role — a request for attention versus a report of completion.</li>
<li><strong>Connect to CSI106 device drivers.</strong> Steps 4, 6, 7 on the left and 3, 6 on the right are all driver code. What CSI106 taught as "the driver mediates between OS and device", this list shows as a cycle with a cache miss baked into the middle of it.</li>
</ul>
<p class="nhan">📐 <strong>Worked estimate.</strong> Suppose the miss at step 5 costs <strong>200 cycles</strong> (a last-level-cache miss to DRAM) and the packet rate is 833 000 packets/s (10 Gbps with 1500-byte frames).</p>
<p class="dap-an">✅ 833 000 × 200 = <strong>166,6 million cycles per second</strong> spent on nothing but that one mandatory miss — about <strong>5,6 %</strong> of a 3 GHz core, burned before any protocol work begins. At minimum-size frames (14,88 million packets/s) the same arithmetic gives 2,98 billion cycles/s, i.e. <em>an entire core does nothing but miss</em>. That is what DCA removes.</p>
<p class="meo">💡 Learn the incoming list as four verbs plus the villain: <em>arrives → DMA → interrupt → fetch → <strong>MISS</strong> → process → deliver</em>. If you can say where the miss is and why it is there, you can explain DCA without memorising anything else.</p>`,
        `<p class="y-chinh">🎯 Hai danh sách từng bước đặt cạnh nhau, biến mọi thứ nãy giờ thành một trình tự đọc thuộc được. <strong>Incoming</strong> (đi vào) bên trái bảy bước, <strong>Outgoing</strong> (đi ra) bên phải sáu bước. Có ĐÚNG MỘT bước trong danh sách đi vào là kẻ phản diện của cả chương.</p>
<table>
<tr><th>#</th><th>Đi vào (Incoming)</th><th>Đi ra (Outgoing)</th></tr>
<tr><td>1</td><td>Gói tin tới nơi</td><td>Có yêu cầu truyền gói</td></tr>
<tr><td>2</td><td><strong>DMA</strong></td><td>Gói tin được tạo</td></tr>
<tr><td>3</td><td>NIC ngắt máy chủ</td><td>Thao tác xuất được gọi</td></tr>
<tr><td>4</td><td>Lấy descriptor và tiêu đề</td><td><strong>Truyền bằng DMA</strong></td></tr>
<tr><td>5</td><td><strong>XẢY RA TRƯỢT CACHE</strong></td><td>NIC báo đã xong</td></tr>
<tr><td>6</td><td>Xử lý tiêu đề</td><td>Trình điều khiển giải phóng bộ đệm</td></tr>
<tr><td>7</td><td>Chuyển phần tải</td><td>—</td></tr>
</table>
<ul>
<li><strong>Bước 5 của danh sách đi vào được in như một bước HOẠT ĐỘNG BÌNH THƯỜNG, và đó mới là điểm nhấn.</strong> "Cache miss occurs" ở đây không phải tình huống lỗi — nó là kết quả <em>ĐƯỢC TRÔNG ĐỢI</em>, ở từng gói một, vì bước 2 (DMA) đã đặt dữ liệu vào bộ nhớ chính, nơi không dòng cache nào đang giữ.</li>
<li><strong>Đọc đường đi vào như một câu chuyện.</strong> Gói tin đáp xuống dây (1); NIC DMA nó vào bộ đệm hệ thống trong DRAM (2); NIC phát ngắt (3); trình điều khiển đọc vòng descriptor và tiêu đề (4); những lần đọc đó trượt cache (5); lõi phân tích TCP/IP (6); cuối cùng phần tải được chép sang ứng dụng (7).</li>
<li><strong>Chiều đi ra soi gương lại, thêm một bước có ích: bước 6 "giải phóng bộ đệm".</strong> Bộ đệm phải được tái sử dụng, không thì hệ thống cạn. Việc tái sử dụng đó bản thân nó cũng là lưu lượng bộ nhớ, và đó là lý do NIC dùng <em>vòng descriptor</em> chứ không dùng bộ đệm dùng một lần.</li>
<li><strong>Để ý CÁI NGẮT nằm ở đâu trong mỗi danh sách.</strong> Đi vào: ngắt là bước 3, <em>TRƯỚC</em> phần việc. Đi ra: ngắt là bước 5, <em>SAU</em> phần việc ("NIC báo đã xong"). Cùng một cơ chế, vai trò ngược nhau — một bên là xin chú ý, một bên là báo cáo hoàn thành.</li>
<li><strong>Nối sang trình điều khiển thiết bị của CSI106.</strong> Bước 4, 6, 7 bên trái và bước 3, 6 bên phải đều là mã của trình điều khiển. Thứ CSI106 dạy là "driver làm trung gian giữa hệ điều hành và thiết bị", danh sách này cho thấy nó là một chu trình có một lần trượt cache nướng sẵn ở giữa.</li>
</ul>
<p class="nhan">📐 <strong>Ước lượng có số.</strong> Giả sử lần trượt ở bước 5 tốn <strong>200 chu kỳ</strong> (trượt cache mức cuối xuống DRAM) và tốc độ là 833.000 gói/s (10 Gbps, khung 1500 byte).</p>
<p class="dap-an">✅ 833.000 × 200 = <strong>166,6 triệu chu kỳ mỗi giây</strong> tiêu vào đúng một lần trượt bắt buộc đó — chừng <strong>5,6 %</strong> một lõi 3 GHz, đốt sạch trước khi bắt đầu bất kỳ việc giao thức nào. Với khung nhỏ nhất (14,88 triệu gói/s), cùng phép tính cho 2,98 tỉ chu kỳ/s, tức là <em>một lõi nguyên vẹn chẳng làm gì ngoài trượt cache</em>. Đó chính là thứ DCA xoá đi.</p>
<p class="meo">💡 Học danh sách đi vào thành bốn động từ cộng kẻ phản diện: <em>tới → DMA → ngắt → lấy → <strong>TRƯỢT</strong> → xử lý → giao</em>. Nói được chỗ trượt nằm ở đâu và vì sao nó ở đó là bạn giải thích được DCA mà chẳng cần thuộc gì thêm.</p>`],

      [36, 'Direct Cache Access Strategies',
        `<p class="y-chinh">🎯 Two generations of DCA, drawn as an upper block and a lower block with a big arrow between them. Upper: the <strong>prefetch-hint</strong> prototype. Lower: <strong>"Much more substantial gains can be realized by avoiding the system buffer in main memory altogether"</strong> — which Intel ships as <strong>Direct Data I/O (DDIO)</strong>.</p>
<table>
<tr><th></th><th>Strategy 1 — prefetch hint (2006–2010 prototype)</th><th>Strategy 2 — avoid the system buffer (DDIO, shipping)</th></tr>
<tr><td><strong>The slide's words</strong></td><td>"Simplest strategy was implemented as a prototype on a number of Intel Xeon processors between 2006 and 2010"</td><td>"Much more substantial gains can be realized by avoiding the system buffer in main memory altogether"</td></tr>
<tr><td><strong>Scope</strong></td><td>"This form of DCA applies <strong>only to incoming network traffic</strong>"</td><td>Incoming <em>and</em> outgoing</td></tr>
<tr><td><strong>Mechanism</strong></td><td>"The DCA function in the memory controller sends a <strong>prefetch hint</strong> to the core as soon as the data is available in system memory"</td><td>"The packet and packet descriptor information are accessed <strong>only once</strong> in the system buffer by the core"; "for incoming packets, the core reads the data from the buffer and transfers the packet payload to an <strong>application buffer</strong>"</td></tr>
<tr><td><strong>Effect</strong></td><td>"This enables the core to <strong>prefetch the data packet from the system buffer</strong>"</td><td>"It has <strong>no need to access that data in the system buffer again</strong>" — the slide's name for this is <strong>cache injection</strong></td></tr>
<tr><td><strong>Where it lives</strong></td><td>Prototype only</td><td>"Implemented in Intel's Xeon processor line, referred to as <strong>Direct Data I/O</strong>"</td></tr>
</table>
<ul>
<li><strong>Strategy 1 does not move the data — it moves the warning.</strong> The data still goes to main memory; the core is merely told early so it can prefetch. The miss of slide 35 step 5 is <em>hidden</em>, not removed. That is why the gain is modest.</li>
<li><strong>Strategy 2 changes the destination.</strong> "Cache injection" means the I/O controller writes into the last-level cache directly. Nothing has to be prefetched because nothing went to DRAM in the first place.</li>
<li><strong>The phrase "accessed only once" is the measurable win.</strong> Slide 34 counted the core touching the system buffer, then copying, then the NIC re-reading it. DDIO collapses that to one visit.</li>
<li><strong>Why it took until the Xeon line to ship.</strong> Cache injection needs the I/O port to sit <em>on the same on-chip interconnect as the LLC</em> — exactly the ring of Figure 8.16 with PCIe on it. Without that topology the idea is not implementable.</li>
<li><strong>The catch the slide does not state.</strong> Injected packets occupy LLC capacity that the application wanted. As computed on slide 32, a 10-Gbps stream writes 20 MB in 16 ms, so DDIO must be restricted to a slice of L3 — otherwise you have cured a cache miss by causing thousands of others.</li>
</ul>
<p class="meo">💡 One sentence for each: <strong>strategy 1 = "tell the core early"</strong> (prefetch hint); <strong>strategy 2 = "do not use DRAM at all"</strong> (cache injection / DDIO). Hint versus injection.</p>
<p class="pitfall">⚠️ Careful with the dates: "2006 and 2010" describes the <em>prototype</em> of strategy 1, not DDIO. Writing "DDIO was prototyped in 2006" misreads the slide — the upper block and the lower block are different technologies, separated by that arrow.</p>`,
        `<p class="y-chinh">🎯 Hai thế hệ DCA, vẽ thành khối trên và khối dưới với một mũi tên to ở giữa. Khối trên: bản thử nghiệm kiểu <strong>gợi ý nạp trước (prefetch hint)</strong>. Khối dưới: <strong>"Lợi ích lớn hơn nhiều đạt được bằng cách BỎ HẲN bộ đệm hệ thống trong bộ nhớ chính"</strong> — thứ Intel bán ra dưới tên <strong>Direct Data I/O (DDIO)</strong>.</p>
<table>
<tr><th></th><th>Chiến lược 1 — gợi ý nạp trước (bản thử 2006–2010)</th><th>Chiến lược 2 — bỏ bộ đệm hệ thống (DDIO, đã bán ra)</th></tr>
<tr><td><strong>Nguyên văn slide</strong></td><td>"Chiến lược đơn giản nhất được cài như bản thử nghiệm trên một số bộ xử lý Intel Xeon giữa 2006 và 2010"</td><td>"Lợi ích lớn hơn nhiều đạt được bằng cách bỏ hẳn bộ đệm hệ thống trong bộ nhớ chính"</td></tr>
<tr><td><strong>Phạm vi</strong></td><td>"Dạng DCA này <strong>CHỈ áp dụng cho lưu lượng mạng ĐI VÀO</strong>"</td><td>Cả đi vào <em>lẫn</em> đi ra</td></tr>
<tr><td><strong>Cơ chế</strong></td><td>"Chức năng DCA trong bộ điều khiển nhớ gửi một <strong>gợi ý nạp trước</strong> tới lõi ngay khi dữ liệu đã có trong bộ nhớ hệ thống"</td><td>"Gói tin và thông tin descriptor chỉ được lõi truy cập <strong>ĐÚNG MỘT LẦN</strong> trong bộ đệm hệ thống"; "với gói đi vào, lõi đọc dữ liệu từ bộ đệm và chuyển phần tải sang <strong>bộ đệm ứng dụng</strong>"</td></tr>
<tr><td><strong>Hiệu quả</strong></td><td>"Nhờ đó lõi <strong>nạp trước được gói dữ liệu từ bộ đệm hệ thống</strong>"</td><td>"Nó <strong>không cần truy cập lại dữ liệu đó trong bộ đệm hệ thống nữa</strong>" — slide gọi tên chuyện này là <strong>cache injection (tiêm thẳng vào cache)</strong></td></tr>
<tr><td><strong>Sống ở đâu</strong></td><td>Chỉ là bản thử nghiệm</td><td>"Đã cài trong dòng bộ xử lý Xeon của Intel, gọi là <strong>Direct Data I/O</strong>"</td></tr>
</table>
<ul>
<li><strong>Chiến lược 1 không dời dữ liệu — nó dời LỜI BÁO.</strong> Dữ liệu vẫn đi vào bộ nhớ chính; lõi chỉ được báo sớm để kịp nạp trước. Lần trượt ở bước 5 slide 35 bị <em>GIẤU ĐI</em>, chứ không bị xoá. Vì thế lợi ích chỉ vừa phải.</li>
<li><strong>Chiến lược 2 đổi hẳn ĐIỂM ĐẾN.</strong> "Tiêm thẳng vào cache" nghĩa là bộ điều khiển I/O ghi thẳng vào cache mức cuối. Chẳng phải nạp trước gì cả, vì ngay từ đầu đã không có gì xuống DRAM.</li>
<li><strong>Cụm "chỉ truy cập ĐÚNG MỘT LẦN" mới là cái lợi đo được.</strong> Slide 34 đã đếm: lõi sờ vào bộ đệm hệ thống, rồi chép, rồi NIC đọc lại. DDIO gom tất cả lại còn một lần ghé.</li>
<li><strong>Vì sao phải đợi tới dòng Xeon mới ra được.</strong> Tiêm vào cache đòi cổng I/O phải nằm <em>TRÊN CÙNG MẠNG LIÊN KẾT TRONG CHIP với LLC</em> — đúng cái vòng của Figure 8.16 có PCIe treo trên đó. Không có hình dạng ấy thì ý tưởng này không cài được.</li>
<li><strong>Cái giá mà slide không nói.</strong> Gói tin được tiêm vào chiếm dung lượng LLC mà ứng dụng đang cần. Như đã tính ở slide 32, luồng 10 Gbps ghi 20 MB trong 16 ms, nên DDIO buộc phải bị giới hạn trong một phần của L3 — không thì bạn chữa được một lần trượt cache bằng cách gây ra hàng nghìn lần khác.</li>
</ul>
<p class="meo">💡 Mỗi chiến lược một câu: <strong>chiến lược 1 = "báo cho lõi sớm"</strong> (gợi ý nạp trước); <strong>chiến lược 2 = "không dùng DRAM nữa"</strong> (tiêm vào cache / DDIO). Gợi ý so với tiêm thẳng.</p>
<p class="pitfall">⚠️ Cẩn thận với mốc thời gian: "2006 và 2010" mô tả bản <em>THỬ NGHIỆM của chiến lược 1</em>, không phải DDIO. Viết "DDIO được thử nghiệm năm 2006" là đọc sai slide — khối trên và khối dưới là hai công nghệ khác nhau, ngăn bởi đúng cái mũi tên đó.</p>`],

      [37, 'Figure 8.17 — Comparison of DMA and DDIO',
        `<p class="y-chinh">🎯 Four small diagrams, each with <strong>Core 1 · Core 2 · … · Core N</strong>, a <strong>Last level cache</strong>, an <strong>I/O controller</strong> and <strong>Main memory</strong>, and numbered green arrows showing the order of movements. Left column = normal DMA; right column = DDIO. Top row = data coming in; bottom row = data going out. <strong>Count the numbered arrows and the whole slide is answered.</strong></p>
<table>
<tr><th>Panel</th><th>Arrow sequence on the figure</th><th>Steps</th></tr>
<tr><td><strong>(a) Normal DMA transfer to memory</strong></td><td>① at the I/O controller → ② controller up to last level cache → ③ controller out to main memory → ④ from memory across to Core N</td><td><strong>4</strong></td></tr>
<tr><td><strong>(b) DDIO transfer to cache</strong></td><td>① at the I/O controller → ② controller up to last level cache → ③ cache to Core N</td><td><strong>3</strong></td></tr>
<tr><td><strong>(c) Normal DMA transfer to I/O</strong></td><td>① at main memory → ② cache down through the controller → ③ controller out</td><td><strong>3</strong></td></tr>
<tr><td><strong>(d) DDIO transfer to I/O</strong></td><td>① at Core N → ② cache down and out through the controller</td><td><strong>2</strong></td></tr>
</table>
<ul>
<li><strong>Read (a) against (b): main memory disappears.</strong> In (a) the green path visibly reaches the "Main memory" box; in (b) the Main memory box is still drawn but <em>no arrow touches it</em>. That empty box is the picture of "avoiding the system buffer altogether".</li>
<li><strong>Read (c) against (d): the core's own data never goes down to DRAM.</strong> On transmit, DDIO takes the packet straight from the last level cache out through the I/O controller — one fewer hop, and no write-back pressure on the memory controller.</li>
<li><strong>Every panel keeps the I/O controller.</strong> DDIO is still DMA in the sense that the controller, not the core, moves the bytes. What changed is only the <em>endpoint</em>: last-level cache instead of main memory. Slide 31's warning applies here — do not say DDIO "replaces DMA".</li>
<li><strong>Why the saving is worth more than one arrow suggests.</strong> The removed hop is a DRAM round trip — hundreds of cycles of latency, plus memory-controller bandwidth, plus the cache invalidation that a DMA write to memory forces. One arrow on the diagram, three costs in reality.</li>
<li><strong>Link back to Ch.4/Ch.5 one last time.</strong> DDIO is, in cache vocabulary, a write that <em>allocates in the LLC</em> performed by a non-core agent. All the coherence machinery you studied is what makes it safe for the core to then read that line as an ordinary hit.</li>
</ul>
<p class="nhan">📐 <strong>Worked count over a whole packet's life (in + out), using the figure's own arrows:</strong></p>
<table>
<tr><th></th><th>Normal DMA</th><th>DDIO</th><th>Saving</th></tr>
<tr><td>Incoming</td><td>4 steps</td><td>3 steps</td><td>1 step (25 %)</td></tr>
<tr><td>Outgoing</td><td>3 steps</td><td>2 steps</td><td>1 step (33 %)</td></tr>
<tr><td><strong>Round trip</strong></td><td><strong>7</strong></td><td><strong>5</strong></td><td><strong>2 steps = 28,6 %</strong></td></tr>
</table>
<p class="dap-an">✅ Answer: DDIO removes <strong>one main-memory visit in each direction</strong>, cutting the diagrammed step count from 7 to 5 for a full round trip — about <strong>28,6 %</strong> fewer data movements, and each removed movement is the <em>slowest</em> kind (DRAM). Be precise in an exam: this is a count of steps in Figure 8.17, not a measured throughput gain.</p>
<p class="meo">💡 Memorise the figure as "<strong>4-3-3-2</strong>" reading (a), (b), (c), (d). If you can produce those four numbers and say which box vanished from the path, you have understood the slide.</p>`,
        `<p class="y-chinh">🎯 Bốn sơ đồ nhỏ, mỗi cái đều có <strong>Core 1 · Core 2 · … · Core N</strong>, một <strong>Last level cache</strong>, một <strong>I/O controller</strong> và <strong>Main memory</strong>, cùng những mũi tên xanh ĐÁNH SỐ chỉ thứ tự di chuyển. Cột trái = DMA thường; cột phải = DDIO. Hàng trên = dữ liệu đi vào; hàng dưới = dữ liệu đi ra. <strong>Đếm số mũi tên là trả lời xong cả slide.</strong></p>
<table>
<tr><th>Ô</th><th>Chuỗi mũi tên trên hình</th><th>Số bước</th></tr>
<tr><td><strong>(a) DMA thường, chuyển vào bộ nhớ</strong></td><td>① ở bộ điều khiển I/O → ② từ bộ điều khiển lên cache mức cuối → ③ từ bộ điều khiển ra bộ nhớ chính → ④ từ bộ nhớ chạy sang Core N</td><td><strong>4</strong></td></tr>
<tr><td><strong>(b) DDIO, chuyển vào cache</strong></td><td>① ở bộ điều khiển I/O → ② từ bộ điều khiển lên cache mức cuối → ③ từ cache sang Core N</td><td><strong>3</strong></td></tr>
<tr><td><strong>(c) DMA thường, chuyển ra I/O</strong></td><td>① ở bộ nhớ chính → ② từ cache xuống qua bộ điều khiển → ③ bộ điều khiển đẩy ra ngoài</td><td><strong>3</strong></td></tr>
<tr><td><strong>(d) DDIO, chuyển ra I/O</strong></td><td>① ở Core N → ② từ cache xuống và ra thẳng qua bộ điều khiển</td><td><strong>2</strong></td></tr>
</table>
<ul>
<li><strong>Đặt (a) cạnh (b): BỘ NHỚ CHÍNH BIẾN MẤT.</strong> Ở (a), đường xanh chạm rõ vào hộp "Main memory"; ở (b), hộp Main memory vẫn được vẽ nhưng <em>KHÔNG mũi tên nào chạm vào</em>. Cái hộp bị bỏ trống đó chính là bức tranh của câu "bỏ hẳn bộ đệm hệ thống".</li>
<li><strong>Đặt (c) cạnh (d): dữ liệu của chính lõi không bao giờ phải xuống DRAM.</strong> Ở chiều gửi, DDIO lấy gói tin thẳng từ cache mức cuối ra qua bộ điều khiển I/O — bớt một chặng, và bộ điều khiển nhớ không phải chịu áp lực ghi trả.</li>
<li><strong>Ô nào cũng còn bộ điều khiển I/O.</strong> DDIO vẫn là DMA theo nghĩa: bộ điều khiển, chứ không phải lõi, là thứ chuyển byte. Cái đổi chỉ là <em>ĐIỂM ĐẾN</em>: cache mức cuối thay cho bộ nhớ chính. Lời cảnh báo ở slide 31 áp dụng đúng chỗ này — đừng nói DDIO "thay thế DMA".</li>
<li><strong>Vì sao khoản tiết kiệm đáng giá hơn vẻ ngoài của một mũi tên.</strong> Chặng bị bỏ là một vòng đi-về DRAM — hàng trăm chu kỳ độ trễ, cộng băng thông bộ điều khiển nhớ, cộng lần vô hiệu hoá cache mà một lệnh ghi DMA vào bộ nhớ bắt buộc phải gây ra. Một mũi tên trên hình, ba khoản chi phí ngoài đời.</li>
<li><strong>Nối lại Ch.4/Ch.5 lần cuối.</strong> Theo từ vựng cache, DDIO là một lệnh ghi có <em>CẤP CHỖ TRONG LLC</em> do một tác nhân không phải lõi thực hiện. Toàn bộ bộ máy nhất quán mà bạn đã học chính là thứ khiến việc lõi đọc dòng đó như một lần trúng bình thường trở nên an toàn.</li>
</ul>
<p class="nhan">📐 <strong>Đếm cho trọn vòng đời một gói (vào + ra), dùng chính mũi tên của hình:</strong></p>
<table>
<tr><th></th><th>DMA thường</th><th>DDIO</th><th>Tiết kiệm</th></tr>
<tr><td>Đi vào</td><td>4 bước</td><td>3 bước</td><td>1 bước (25 %)</td></tr>
<tr><td>Đi ra</td><td>3 bước</td><td>2 bước</td><td>1 bước (33 %)</td></tr>
<tr><td><strong>Trọn vòng</strong></td><td><strong>7</strong></td><td><strong>5</strong></td><td><strong>2 bước = 28,6 %</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án: DDIO bỏ đi <strong>một lần ghé bộ nhớ chính ở MỖI chiều</strong>, kéo số bước trên sơ đồ từ 7 xuống 5 cho trọn một vòng — ít hơn khoảng <strong>28,6 %</strong> số lần di chuyển dữ liệu, mà mỗi lần bị bỏ lại đúng là loại <em>CHẬM NHẤT</em> (DRAM). Đi thi phải nói chính xác: đây là đếm BƯỚC trên Figure 8.17, không phải mức tăng thông lượng đo được.</p>
<p class="meo">💡 Nhớ cả hình bằng chuỗi "<strong>4-3-3-2</strong>" đọc theo (a), (b), (c), (d). Đọc ra được bốn con số đó và nói được cái hộp nào biến mất khỏi đường đi là bạn đã hiểu slide.</p>`],

      [38, 'Evolution of the I/O Function — six steps',
        `<p class="y-chinh">🎯 The chapter's spine laid out as history: six stages by which I/O moved from "the CPU does absolutely everything" to "the I/O module is a computer in its own right". Every technique you have learned appears here as one rung of the ladder.</p>
<table>
<tr><th>Step</th><th>The slide's text</th><th>Which technique it is</th></tr>
<tr><td>1</td><td>The CPU <strong>directly controls</strong> a peripheral device.</td><td>No I/O module at all — the CPU toggles device wires itself</td></tr>
<tr><td>2</td><td>A controller or <strong>I/O module is added</strong>. The CPU uses <strong>programmed I/O without interrupts</strong>.</td><td>Programmed I/O (slides 8–14)</td></tr>
<tr><td>3</td><td>Same configuration as step 2, but now <strong>interrupts are employed</strong>. The CPU need not spend time waiting for an I/O operation to be performed, thus increasing efficiency.</td><td>Interrupt-driven I/O (slides 15–23)</td></tr>
<tr><td>4</td><td>The I/O module is given <strong>direct access to memory via DMA</strong>. It can now move a block of data to or from memory <strong>without involving the CPU, except at the beginning and end</strong> of the transfer.</td><td>DMA (slides 24–30)</td></tr>
<tr><td>5</td><td>The I/O module is enhanced to become a <strong>processor in its own right</strong>, with a <strong>specialized instruction set tailored for I/O</strong>.</td><td>I/O channel (slide 39)</td></tr>
<tr><td>6</td><td>The I/O module has a <strong>local memory of its own</strong> and is, in fact, <strong>a computer in its own right</strong>. With this architecture a large set of I/O devices can be controlled with minimal CPU involvement.</td><td>I/O processor</td></tr>
</table>
<ul>
<li><strong>Read the six as one monotone trend: intelligence migrates outward.</strong> Step by step the CPU is relieved of work — first the wire-level detail (2), then the waiting (3), then the data movement (4), then the <em>control logic</em> (5), then even the memory the control logic needs (6).</li>
<li><strong>The jump from 4 to 5 is the one students underrate.</strong> DMA still needs the CPU to say "move N bytes from here to there". A channel executes a <em>program</em> — a chain of I/O instructions in main memory — so the CPU says "run this channel program" and walks away. That is a qualitative change, not a faster DMA.</li>
<li><strong>Steps 5 and 6 differ by one thing: local memory.</strong> A channel fetches its instructions from main memory; an I/O processor has its own. That is the boundary between "specialised processor" and "computer in its own right".</li>
<li><strong>The phrase in step 4 is the exam-quotable one.</strong> "Without involving the CPU, <strong>except at the beginning and end</strong> of the transfer" — beginning = programming the controller, end = the completion interrupt. That single clause is the whole cost model of DMA.</li>
<li><strong>Where today's hardware sits.</strong> Your laptop is mostly step 4–5; your phone's modem and your GPU are step 6. The IBM z13 of slides 48–49 is step 6 taken to its limit.</li>
</ul>
<p class="nhan">📐 <strong>Worked comparison across steps 3, 4 and 5, for one 4 KB block with 4-byte words (1024 words):</strong></p>
<table>
<tr><th>Step</th><th>CPU actions for the block</th><th>Interrupts</th></tr>
<tr><td>2 (programmed I/O)</td><td>1024 × (test + read + store) ≈ 5 000–10 000 instructions, and it blocks</td><td>0</td></tr>
<tr><td>3 (interrupt-driven)</td><td>1024 ISR entries ≈ <strong>512 000 cycles</strong></td><td><strong>1024</strong></td></tr>
<tr><td>4 (DMA)</td><td>1 set-up + 1 ISR ≈ <strong>550 cycles</strong></td><td><strong>1</strong></td></tr>
<tr><td>5 (channel)</td><td>1 "start channel program" — and that program may move <em>many</em> blocks</td><td><strong>1 per program</strong>, not per block</td></tr>
</table>
<p class="dap-an">✅ Answer: step 3 → step 4 is the <strong>931×</strong> saving computed on slide 28. Step 4 → step 5 saves again on a different axis: the interrupt count stops being per <em>block</em> and becomes per <em>job</em>, so a channel program moving ten blocks costs one interrupt instead of ten.</p>
<p class="pitfall">⚠️ <strong>The slide's numbering is broken:</strong> the list runs 1, 2, 3, then prints "<strong>4</strong>" three times for the last three items. They are steps <strong>4, 5 and 6</strong> — the textbook explicitly describes six evolutionary stages. Count the paragraphs, not the digits.</p>`,
        `<p class="y-chinh">🎯 Xương sống của cả chương bày ra dưới dạng lịch sử: sáu chặng mà I/O đi từ "CPU làm tuốt" tới "module I/O là một máy tính hoàn chỉnh". Mọi kỹ thuật bạn đã học đều xuất hiện ở đây như một nấc thang.</p>
<table>
<tr><th>Bước</th><th>Chữ trên slide</th><th>Đó là kỹ thuật nào</th></tr>
<tr><td>1</td><td>CPU <strong>điều khiển TRỰC TIẾP</strong> một thiết bị ngoại vi.</td><td>Không có module I/O nào — CPU tự bật tắt dây của thiết bị</td></tr>
<tr><td>2</td><td><strong>Thêm một bộ điều khiển / module I/O</strong>. CPU dùng <strong>I/O bằng chương trình, không ngắt</strong>.</td><td>I/O bằng chương trình (slide 8–14)</td></tr>
<tr><td>3</td><td>Cấu hình y như bước 2, nhưng giờ <strong>có dùng ngắt</strong>. CPU không phải ngồi chờ thao tác I/O hoàn tất nữa, nên hiệu quả tăng lên.</td><td>I/O bằng ngắt (slide 15–23)</td></tr>
<tr><td>4</td><td>Module I/O được cho <strong>truy cập bộ nhớ trực tiếp bằng DMA</strong>. Nó chuyển được nguyên khối dữ liệu vào/ra bộ nhớ <strong>mà không cần CPU, trừ lúc BẮT ĐẦU và lúc KẾT THÚC</strong> của lần truyền.</td><td>DMA (slide 24–30)</td></tr>
<tr><td>5</td><td>Module I/O được nâng cấp thành <strong>một bộ xử lý thực thụ</strong>, với <strong>tập lệnh chuyên dụng may đo cho I/O</strong>.</td><td>Kênh I/O (slide 39)</td></tr>
<tr><td>6</td><td>Module I/O có <strong>bộ nhớ cục bộ của riêng nó</strong> và thật ra <strong>là một máy tính hoàn chỉnh</strong>. Với kiến trúc này, một tập lớn thiết bị I/O được điều khiển với sự tham gia tối thiểu của CPU.</td><td>Bộ xử lý I/O</td></tr>
</table>
<ul>
<li><strong>Đọc sáu bước như một xu hướng đơn điệu: TRÍ THÔNG MINH DI CƯ RA NGOÀI.</strong> Từng bước một, CPU được gỡ bớt việc — trước hết là chi tiết mức dây (2), rồi việc chờ (3), rồi việc chuyển dữ liệu (4), rồi <em>LOGIC ĐIỀU KHIỂN</em> (5), rồi tới cả bộ nhớ mà logic điều khiển đó cần (6).</li>
<li><strong>Bước nhảy 4 → 5 là chỗ sinh viên hay coi nhẹ.</strong> DMA vẫn cần CPU nói "chuyển N byte từ đây sang kia". Còn kênh thì THI HÀNH MỘT <em>CHƯƠNG TRÌNH</em> — một chuỗi lệnh I/O nằm trong bộ nhớ chính — nên CPU chỉ nói "chạy chương trình kênh này" rồi bỏ đi. Đó là thay đổi về CHẤT, không phải một cái DMA nhanh hơn.</li>
<li><strong>Bước 5 và 6 khác nhau đúng một thứ: BỘ NHỚ CỤC BỘ.</strong> Kênh nạp lệnh của nó từ bộ nhớ chính; bộ xử lý I/O có bộ nhớ riêng. Đó là ranh giới giữa "bộ xử lý chuyên dụng" và "máy tính hoàn chỉnh".</li>
<li><strong>Câu ở bước 4 là câu đáng thuộc để đi thi.</strong> "Không cần CPU, <strong>trừ lúc bắt đầu và lúc kết thúc</strong> của lần truyền" — bắt đầu = nạp cấu hình cho bộ điều khiển, kết thúc = cái ngắt báo xong. Đúng một mệnh đề đó là toàn bộ mô hình chi phí của DMA.</li>
<li><strong>Phần cứng hôm nay nằm ở đâu.</strong> Laptop của bạn phần lớn ở bước 4–5; modem trong điện thoại và GPU thì ở bước 6. Con IBM z13 ở slide 48–49 là bước 6 đẩy tới cực hạn.</li>
</ul>
<p class="nhan">📐 <strong>So bước 3, 4, 5 trên cùng một khối 4 KB với từ 4 byte (1024 từ):</strong></p>
<table>
<tr><th>Bước</th><th>CPU phải làm gì cho cả khối</th><th>Số lần ngắt</th></tr>
<tr><td>2 (I/O bằng chương trình)</td><td>1024 × (kiểm + đọc + cất) ≈ 5.000–10.000 lệnh, và bị chặn suốt</td><td>0</td></tr>
<tr><td>3 (bằng ngắt)</td><td>1024 lần vào ISR ≈ <strong>512.000 chu kỳ</strong></td><td><strong>1024</strong></td></tr>
<tr><td>4 (DMA)</td><td>1 lần nạp cấu hình + 1 ISR ≈ <strong>550 chu kỳ</strong></td><td><strong>1</strong></td></tr>
<tr><td>5 (kênh)</td><td>1 lệnh "khởi động chương trình kênh" — và chương trình đó có thể chuyển <em>NHIỀU</em> khối</td><td><strong>1 mỗi CHƯƠNG TRÌNH</strong>, không phải mỗi khối</td></tr>
</table>
<p class="dap-an">✅ Đáp án: bước 3 → bước 4 là khoản tiết kiệm <strong>931 lần</strong> đã tính ở slide 28. Bước 4 → bước 5 tiết kiệm tiếp trên một TRỤC KHÁC: số lần ngắt thôi tính theo <em>KHỐI</em> mà tính theo <em>CÔNG VIỆC</em>, nên một chương trình kênh chuyển mười khối chỉ tốn một lần ngắt thay vì mười.</p>
<p class="pitfall">⚠️ <strong>Slide đánh số HỎNG:</strong> danh sách chạy 1, 2, 3 rồi in "<strong>4</strong>" tới BA LẦN cho ba mục cuối. Chúng là bước <strong>4, 5 và 6</strong> — sách nói rõ có sáu chặng tiến hoá. Hãy đếm ĐOẠN VĂN, đừng đếm chữ số.</p>`],

      [39, 'Figure 8.18 — I/O Channel Architecture',
        `<p class="y-chinh">🎯 The two kinds of I/O channel, drawn one above the other. Both receive a <strong>"Data and address channel to main memory"</strong> and a <strong>"Control signal path to CPU"</strong>, but they fan out to devices in opposite styles: <strong>(a) Selector</strong> — a single thick bus to a row of I/O controllers; <strong>(b) Multiplexor</strong> — a vertical trunk with each I/O controller on its own branch.</p>
<table>
<tr><th></th><th>(a) Selector channel</th><th>(b) Multiplexor channel</th></tr>
<tr><td><strong>What the figure draws</strong></td><td>One horizontal bus; several I/O controllers hang from it; each controller may drive one or two devices (the circles)</td><td>A vertical trunk from the channel box; four I/O controllers branch off it at different heights, each with one or two devices</td></tr>
<tr><td><strong>How it serves devices</strong></td><td><strong>One high-speed device at a time</strong>, for the duration of a whole transfer</td><td><strong>Many devices interleaved</strong>, taking turns byte by byte or block by block</td></tr>
<tr><td><strong>Best for</strong></td><td>Fast devices — tape, disk</td><td>Many slow devices — terminals, printers, card readers</td></tr>
<tr><td><strong>Analogy</strong></td><td>A dedicated lane: one truck uses it end to end</td><td>A roundabout: everybody gets a slot in rotation</td></tr>
</table>
<ul>
<li><strong>The single design question behind both is "concentrate or spread?"</strong> A selector concentrates all the channel's bandwidth on one device so a fast device never waits. A multiplexor spreads it so that many slow devices are all making progress at once. Neither is better; they answer different workloads.</li>
<li><strong>Both draw two paths out of the channel, and that is deliberate.</strong> The wide arrow is <em>data and addresses</em> going to main memory — the channel does its own DMA. The thin arrow is a <em>control signal path to the CPU</em> — used to start the channel and to report completion. Data goes to memory; control goes to the CPU. Do not mix them up.</li>
<li><strong>This is step 5 of slide 38 made concrete.</strong> The channel holds and executes a <em>channel program</em>; the CPU issues one instruction to start it. That is why there is no data path from the channel to the CPU at all.</li>
<li><strong>Multiplexors come in two grains (from the book, not the figure).</strong> A <em>byte multiplexor</em> interleaves one byte at a time for very slow devices; a <em>block multiplexor</em> interleaves whole blocks, for medium-speed ones. The figure shows the topology; the grain is a mode of operation.</li>
<li><strong>Where you see this today.</strong> A modern SAS/NVMe host bus adapter behaves like a selector for a fast SSD; a USB host controller behaves like a multiplexor, time-slicing a tree of slow devices. The mainframe vocabulary died, the two shapes did not.</li>
</ul>
<p class="nhan">📐 <strong>Worked reasoning.</strong> Suppose a channel has 100 MB/s of capacity. Case A: one tape drive that streams at 90 MB/s. Case B: 50 terminals at 1 MB/s each.</p>
<p class="dap-an">✅ Case A must use a <strong>selector</strong>: the single device needs 90 % of the channel continuously, and interleaving would only add switching overhead to a device that cannot pause. Case B must use a <strong>multiplexor</strong>: 50 × 1 = 50 MB/s total, well within capacity, but no single device could ever fill the channel, so dedicating it to one at a time would leave 99 MB/s idle and 49 terminals frozen. Rule of thumb: <strong>if one device can saturate the channel, select; if it takes a crowd to fill it, multiplex.</strong></p>
<p class="meo">💡 Mnemonic from the names themselves: a <strong>selector</strong> <em>selects one</em> device and sticks with it; a <strong>multiplexor</strong> <em>multiplexes many</em> onto one path. The words tell you the answer.</p>`,
        `<p class="y-chinh">🎯 Hai loại kênh I/O, vẽ chồng lên nhau. Cả hai đều nhận một <strong>"Data and address channel to main memory"</strong> (đường dữ liệu và địa chỉ về bộ nhớ chính) và một <strong>"Control signal path to CPU"</strong> (đường tín hiệu điều khiển tới CPU), nhưng toả ra thiết bị theo hai kiểu ngược nhau: <strong>(a) Selector</strong> — một bus dày duy nhất tới một hàng bộ điều khiển I/O; <strong>(b) Multiplexor</strong> — một thân dọc mà mỗi bộ điều khiển I/O rẽ ra một nhánh riêng.</p>
<table>
<tr><th></th><th>(a) Kênh selector (chọn một)</th><th>(b) Kênh multiplexor (ghép nhiều)</th></tr>
<tr><td><strong>Hình vẽ gì</strong></td><td>Một bus nằm ngang; vài bộ điều khiển I/O treo lên đó; mỗi bộ có thể lái một hoặc hai thiết bị (các hình tròn)</td><td>Một thân dọc chạy ra từ hộp kênh; bốn bộ điều khiển I/O rẽ ra ở các độ cao khác nhau, mỗi bộ một hoặc hai thiết bị</td></tr>
<tr><td><strong>Phục vụ thiết bị ra sao</strong></td><td><strong>MỘT thiết bị tốc độ cao tại một thời điểm</strong>, suốt cả lần truyền</td><td><strong>NHIỀU thiết bị xen kẽ nhau</strong>, thay phiên theo từng byte hoặc từng khối</td></tr>
<tr><td><strong>Hợp với</strong></td><td>Thiết bị nhanh — băng từ, đĩa</td><td>Nhiều thiết bị chậm — thiết bị đầu cuối, máy in, máy đọc bìa</td></tr>
<tr><td><strong>Ví von</strong></td><td>Làn đường riêng: một xe tải dùng từ đầu tới cuối</td><td>Vòng xuyến: ai cũng có suất, quay vòng</td></tr>
</table>
<ul>
<li><strong>Câu hỏi thiết kế duy nhất đằng sau cả hai là "DỒN hay TRẢI?"</strong> Selector DỒN toàn bộ băng thông của kênh vào một thiết bị để thiết bị nhanh không bao giờ phải chờ. Multiplexor TRẢI ra để nhiều thiết bị chậm cùng tiến được một lúc. Không cái nào hơn cái nào; chúng trả lời hai loại tải công việc khác nhau.</li>
<li><strong>Cả hai đều vẽ HAI đường ra khỏi kênh, và đó là có chủ ý.</strong> Mũi tên to là <em>dữ liệu và địa chỉ</em> đi tới bộ nhớ chính — kênh tự làm DMA của nó. Mũi tên mảnh là <em>đường tín hiệu điều khiển tới CPU</em> — dùng để khởi động kênh và báo cáo hoàn tất. Dữ liệu đi về bộ nhớ; điều khiển đi về CPU. Đừng trộn hai đường đó.</li>
<li><strong>Đây là bước 5 của slide 38 hiện ra cụ thể.</strong> Kênh giữ và thi hành một <em>chương trình kênh</em>; CPU chỉ ra một lệnh để khởi động nó. Vì vậy mà giữa kênh và CPU KHÔNG hề có đường dữ liệu nào.</li>
<li><strong>Multiplexor có hai độ mịn (lấy từ sách, không có trên hình).</strong> <em>Byte multiplexor</em> xen kẽ từng byte cho thiết bị rất chậm; <em>block multiplexor</em> xen kẽ nguyên khối, cho thiết bị tốc độ vừa. Hình chỉ vẽ hình dạng; độ mịn là một chế độ vận hành.</li>
<li><strong>Hôm nay bạn thấy nó ở đâu.</strong> Một card HBA SAS/NVMe hiện đại hành xử như selector với một ổ SSD nhanh; một bộ điều khiển chủ USB hành xử như multiplexor, chia lát thời gian cho cả cây thiết bị chậm. Từ vựng máy lớn đã chết, hai hình dạng thì không.</li>
</ul>
<p class="nhan">📐 <strong>Lập luận có số.</strong> Giả sử kênh có năng lực 100 MB/s. Ca A: một ổ băng từ chảy đều 90 MB/s. Ca B: 50 thiết bị đầu cuối, mỗi cái 1 MB/s.</p>
<p class="dap-an">✅ Ca A bắt buộc dùng <strong>selector</strong>: một thiết bị duy nhất cần 90 % kênh liên tục, mà xen kẽ chỉ thêm chi phí chuyển đổi cho một thiết bị không thể dừng giữa chừng. Ca B bắt buộc dùng <strong>multiplexor</strong>: tổng 50 × 1 = 50 MB/s, thừa sức trong năng lực, nhưng không thiết bị nào một mình lấp nổi kênh, nên dành riêng cho từng cái sẽ để phí 99 MB/s và làm 49 thiết bị đứng hình. Quy tắc bỏ túi: <strong>một thiết bị lấp đầy được kênh thì SELECT; phải cả đám mới lấp đầy thì MULTIPLEX.</strong></p>
<p class="meo">💡 Mẹo nhớ nằm ngay trong tên: <strong>selector</strong> thì <em>CHỌN MỘT</em> thiết bị rồi bám lấy nó; <strong>multiplexor</strong> thì <em>GHÉP NHIỀU</em> cái lên một đường. Chính cái tên đã trả lời.</p>`],

      [40, 'Universal Serial Bus (USB)',
        `<p class="y-chinh">🎯 The interface you use every day, and the chapter's main example of an <strong>external interconnection standard</strong>. The slide's framing: USB is "widely used for peripheral connections", "is the <strong>default interface for slower speed devices</strong>", is "commonly used high-speed I/O", and "has gone through multiple generations".</p>
<table>
<tr><th>Generation</th><th>The slide's figures</th><th>In bytes per second</th></tr>
<tr><td><strong>USB 1.0</strong></td><td>Low Speed <strong>1,5 Mbps</strong>; Full Speed <strong>12 Mbps</strong></td><td>0,1875 MB/s; 1,5 MB/s</td></tr>
<tr><td><strong>USB 2.0</strong></td><td><strong>480 Mbps</strong></td><td>60 MB/s</td></tr>
<tr><td><strong>USB 3.0</strong></td><td>"SuperSpeed" bus <em>in parallel with</em> the USB 2.0 bus; signalling <strong>5 Gbps</strong>, usable data rate up to <strong>4 Gbps</strong> due to signalling overhead</td><td>500 MB/s usable</td></tr>
<tr><td><strong>USB 3.1</strong></td><td>"SuperSpeed+" mode: signalling <strong>10 Gbps</strong>, theoretical usable <strong>9,7 Gbps</strong></td><td>1 212 MB/s usable</td></tr>
</table>
<ul>
<li><strong>Check the overhead numbers — they are not arbitrary.</strong> 5 Gbps × 8/10 = exactly <strong>4,0 Gbps</strong>: USB 3.0 uses <strong>8b/10b</strong> line coding, spending 2 bits in every 10 on clock recovery and DC balance. 10 Gbps × 128/132 = <strong>9,697 ≈ 9,7 Gbps</strong>: USB 3.1 switched to <strong>128b/132b</strong>, cutting the overhead from 20 % to 3 %. Both of the slide's "usable" figures fall straight out of the coding scheme.</li>
<li><strong>"In parallel with the USB 2.0 bus" is a literal statement about the cable.</strong> A USB 3.0 connector carries the old D+/D− pair <em>and</em> two new SuperSpeed differential pairs. That is why a USB 3 port still works with a USB 1 mouse: the two buses coexist physically.</li>
<li><strong>The last line is the topology.</strong> USB "is controlled by a <strong>root host controller</strong> which attaches to devices to create a local network with a <strong>hierarchical tree topology</strong>". One master at the root; hubs form the branches; devices are leaves. Devices never talk to each other — every transfer is host-initiated.</li>
<li><strong>Why tiered hubs, and what they cost.</strong> A tree lets one host port fan out to many devices (the standard allows up to 127 addresses and 7 tiers), but every hub adds latency and, crucially, <em>shares the same bandwidth</em>. Plugging four disks into one hub does not give you four times the throughput.</li>
<li><strong>Why a SERIAL interface beats a parallel one — connect this to Ch.3.</strong> A parallel bus sends 8, 16 or 32 bits on separate wires that must all arrive within the same clock window. As the clock rises, tiny differences in wire length and capacitance make bits arrive at different times — <strong>skew</strong> — and the whole bus must slow to the worst wire. A serial link has <em>one</em> pair per direction, so there is no skew to equalise; it embeds the clock in the data and can be pushed to gigahertz. That is why USB replaced the parallel printer port, SATA replaced parallel ATA, and PCIe replaced PCI.</li>
</ul>
<p class="dap-an">✅ Worked ratio: USB 3.1 SuperSpeed+ at 10 Gbps against USB 1.0 Low Speed at 1,5 Mbps is a factor of <strong>6 667</strong> — over roughly two decades of the same connector family. And note 480 Mbps ÷ 12 Mbps = exactly <strong>40×</strong> from Full Speed to USB 2.0, the single biggest jump in the list.</p>
<p class="pitfall">⚠️ <strong>The slide stops at USB 3.1 (10 Gbps).</strong> It omits <strong>USB 3.2</strong> (20 Gbps, by using two lanes) and <strong>USB4</strong> (40 Gbps, built on the Thunderbolt 3 protocol) — both of which existed before this 11th edition went to press in 2022. Cite the slide's figures in an exam on this course, but know they are not the current state of the standard.</p>
<p class="meo">💡 Remember the generations as a ladder of roughly 40× then 10× then 2×: <strong>12 Mbps → 480 Mbps → 5 Gbps → 10 Gbps</strong>. And remember the rule of thumb for the marketing numbers: divide by 8 for MB/s, then knock off the line-coding overhead.</p>`,
        `<p class="y-chinh">🎯 Cái giao diện bạn dùng hằng ngày, và là ví dụ chính của chương về một <strong>chuẩn ghép nối ngoài</strong>. Cách slide đặt vấn đề: USB "được dùng rộng rãi để nối ngoại vi", "là <strong>giao diện MẶC ĐỊNH cho thiết bị tốc độ thấp</strong>", "cũng thường dùng cho I/O tốc độ cao", và "đã trải qua nhiều thế hệ".</p>
<table>
<tr><th>Thế hệ</th><th>Con số trên slide</th><th>Quy ra byte mỗi giây</th></tr>
<tr><td><strong>USB 1.0</strong></td><td>Low Speed <strong>1,5 Mbps</strong>; Full Speed <strong>12 Mbps</strong></td><td>0,1875 MB/s; 1,5 MB/s</td></tr>
<tr><td><strong>USB 2.0</strong></td><td><strong>480 Mbps</strong></td><td>60 MB/s</td></tr>
<tr><td><strong>USB 3.0</strong></td><td>Bus "SuperSpeed" chạy <em>SONG SONG VỚI</em> bus USB 2.0; tốc độ tín hiệu <strong>5 Gbps</strong>, tốc độ dữ liệu dùng được tới <strong>4 Gbps</strong> do chi phí báo hiệu</td><td>500 MB/s dùng được</td></tr>
<tr><td><strong>USB 3.1</strong></td><td>Chế độ "SuperSpeed+": tín hiệu <strong>10 Gbps</strong>, lý thuyết dùng được <strong>9,7 Gbps</strong></td><td>1.212 MB/s dùng được</td></tr>
</table>
<ul>
<li><strong>Kiểm lại con số hao phí — chúng không tuỳ tiện.</strong> 5 Gbps × 8/10 = đúng <strong>4,0 Gbps</strong>: USB 3.0 dùng mã đường truyền <strong>8b/10b</strong>, tiêu 2 bit trong mỗi 10 bit cho khôi phục xung nhịp và cân bằng DC. 10 Gbps × 128/132 = <strong>9,697 ≈ 9,7 Gbps</strong>: USB 3.1 đổi sang <strong>128b/132b</strong>, kéo hao phí từ 20 % xuống 3 %. Cả hai con số "dùng được" của slide đều rơi thẳng ra từ sơ đồ mã hoá.</li>
<li><strong>Câu "song song với bus USB 2.0" nói về CÁP theo nghĩa đen.</strong> Đầu nối USB 3.0 mang cặp D+/D− cũ <em>VÀ</em> hai cặp vi sai SuperSpeed mới. Đó là lý do cổng USB 3 vẫn cắm được chuột USB 1: hai cái bus cùng tồn tại về mặt vật lý.</li>
<li><strong>Dòng cuối nói về HÌNH DẠNG MẠNG.</strong> USB "được điều khiển bởi một <strong>root host controller</strong>, cái này gắn với các thiết bị để tạo thành một mạng cục bộ có <strong>hình cây phân tầng</strong>". Một ông chủ ở gốc; các hub làm cành; thiết bị là lá. Thiết bị KHÔNG bao giờ nói chuyện với nhau — mọi lần truyền đều do máy chủ khởi xướng.</li>
<li><strong>Vì sao có hub phân tầng, và cái giá của nó.</strong> Hình cây cho một cổng máy chủ toả ra nhiều thiết bị (chuẩn cho tới 127 địa chỉ và 7 tầng), nhưng mỗi hub thêm độ trễ và, quan trọng nhất, <em>DÙNG CHUNG cùng một băng thông</em>. Cắm bốn ổ cứng vào một hub KHÔNG cho bạn thông lượng gấp bốn.</li>
<li><strong>Vì sao giao diện NỐI TIẾP lại thắng song song — nối chỗ này với Ch.3.</strong> Bus song song gửi 8, 16 hay 32 bit trên các sợi dây riêng, mà tất cả phải tới nơi trong cùng một cửa sổ xung nhịp. Xung nhịp càng cao thì chênh lệch tí xíu về chiều dài dây và điện dung càng khiến các bit tới lệch giờ nhau — gọi là <strong>skew (lệch pha)</strong> — và cả bus phải chậm lại theo sợi dây tệ nhất. Liên kết nối tiếp chỉ có <em>MỘT</em> cặp dây mỗi chiều, nên chẳng có skew nào để mà cân; nó nhúng luôn xung nhịp vào dữ liệu và đẩy được lên hàng gigahertz. Đó là lý do USB thay cổng máy in song song, SATA thay ATA song song, và PCIe thay PCI.</li>
</ul>
<p class="dap-an">✅ Tỉ số tính thật: USB 3.1 SuperSpeed+ 10 Gbps so với USB 1.0 Low Speed 1,5 Mbps là gấp <strong>6.667 lần</strong> — qua chừng hai thập kỷ của cùng một họ đầu nối. Và để ý 480 Mbps ÷ 12 Mbps = đúng <strong>40 lần</strong> từ Full Speed lên USB 2.0, bước nhảy lớn nhất trong cả danh sách.</p>
<p class="pitfall">⚠️ <strong>Slide dừng ở USB 3.1 (10 Gbps).</strong> Nó bỏ sót <strong>USB 3.2</strong> (20 Gbps, bằng cách dùng hai làn) và <strong>USB4</strong> (40 Gbps, xây trên giao thức Thunderbolt 3) — cả hai đều đã có trước khi bản 11e này in năm 2022. Đi thi môn này thì trích số của slide, nhưng phải biết đó không còn là hiện trạng của chuẩn.</p>
<p class="meo">💡 Nhớ các thế hệ như một cái thang gấp 40 rồi gấp 10 rồi gấp 2: <strong>12 Mbps → 480 Mbps → 5 Gbps → 10 Gbps</strong>. Và nhớ quy tắc bỏ túi cho mấy con số quảng cáo: chia 8 ra MB/s, rồi trừ tiếp phần hao phí của mã đường truyền.</p>`],

      [41, 'FireWire Serial Bus (IEEE 1394)',
        `<p class="y-chinh">🎯 The high-performance serial bus that was <strong>"developed as an alternative to small computer system interface (SCSI)"</strong> for smaller systems — personal computers, workstations and servers. Its goal, in the slide's words: meet increasing demands for high I/O rates <strong>"while avoiding the bulky and expensive I/O channel technologies developed for mainframe and supercomputer systems"</strong>.</p>
<table>
<tr><th>Property (as the slide states it)</th><th>Figure / detail</th><th>Why it matters</th></tr>
<tr><td>Standard</td><td><strong>IEEE 1394</strong>, "High Performance Serial Bus"</td><td>An open standard, not one vendor's cable</td></tr>
<tr><td>Topology</td><td><strong>Daisy chain</strong>, up to <strong>63 devices</strong> off a single port</td><td>No hub needed — devices chain through one another</td></tr>
<tr><td>Scale-out</td><td><strong>1022 FireWire buses</strong> can be interconnected using <strong>bridges</strong></td><td>63 × 1022 addressable devices in one system</td></tr>
<tr><td>Hot plugging</td><td>Connect and disconnect peripherals <strong>without powering down or reconfiguring</strong></td><td>The feature users notice; SCSI usually required a reboot</td></tr>
<tr><td>Automatic configuration</td><td><strong>No terminations</strong>; the system automatically performs a configuration function <strong>to assign addresses</strong></td><td>Removes the two worst SCSI chores: terminator resistors and manual device IDs</td></tr>
</table>
<ul>
<li><strong>Read the whole slide as "SCSI's benefits without SCSI's pain".</strong> SCSI gave high throughput but demanded terminators at both ends of the chain and a hand-set ID per device. FireWire kept the chain and deleted both requirements — that is precisely what "no terminations" and "automatically assign addresses" mean.</li>
<li><strong>Check the magic numbers: they are address-field sizes.</strong> 63 = 2<sup>6</sup> − 1 (six bits of node ID, one value reserved for broadcast) and 1022 = 2<sup>10</sup> − 2 (ten bits of bus ID, with values reserved). Whenever a standard quotes a limit just under a power of two, it is telling you how wide a field is.</li>
<li><strong>Daisy chain versus USB's tree is a genuine architectural difference.</strong> FireWire devices can forward traffic for each other and, unlike USB, can transfer <em>peer to peer</em> without the host mediating — which is why it dominated camcorders and audio gear.</li>
<li><strong>Hot plugging is harder than it sounds.</strong> It requires the bus to re-enumerate on the fly, reassign addresses, and keep existing transfers alive. The "automatic configuration function" the slide mentions is that re-enumeration, and it is the same idea as USB's device enumeration.</li>
<li><strong>Why you rarely see it now.</strong> USB 3 matched its speed at lower cost, and Thunderbolt (slide 43) took the high end. FireWire matters on this course as the clean illustration of daisy chain + hot plug + auto-configuration.</li>
</ul>
<p class="dap-an">✅ Worked capacity: 63 devices per bus × 1022 buses = <strong>64 386</strong> addressable devices in one interconnected system — the same order of magnitude as InfiniBand's 64 000 on slide 44, which is not a coincidence: both are 16-bit-ish address spaces (2<sup>16</sup> = 65 536).</p>
<p class="meo">💡 Three words hold this slide: <strong>chain</strong> (daisy chain, 63 devices), <strong>hot</strong> (hot plugging), <strong>auto</strong> (no terminations, automatic address assignment). If a question lists FireWire features, those three cover it.</p>`,
        `<p class="y-chinh">🎯 Bus nối tiếp hiệu năng cao được <strong>"phát triển như một lựa chọn thay thế cho SCSI"</strong> trên các hệ thống nhỏ hơn — máy cá nhân, workstation và máy chủ. Mục tiêu, theo nguyên văn slide: đáp ứng nhu cầu tốc độ I/O ngày càng cao <strong>"mà tránh được công nghệ kênh I/O cồng kềnh và đắt đỏ vốn làm cho máy lớn và siêu máy tính"</strong>.</p>
<table>
<tr><th>Tính chất (theo lời slide)</th><th>Con số / chi tiết</th><th>Vì sao đáng kể</th></tr>
<tr><td>Chuẩn</td><td><strong>IEEE 1394</strong>, "High Performance Serial Bus"</td><td>Chuẩn mở, không phải cáp riêng của một hãng</td></tr>
<tr><td>Hình dạng nối</td><td><strong>Nối chuỗi (daisy chain)</strong>, tới <strong>63 thiết bị</strong> từ một cổng</td><td>Không cần hub — thiết bị xâu chuỗi qua nhau</td></tr>
<tr><td>Mở rộng</td><td>Nối được <strong>1022 bus FireWire</strong> với nhau qua <strong>cầu nối (bridge)</strong></td><td>63 × 1022 thiết bị đánh địa chỉ được trong một hệ thống</td></tr>
<tr><td>Cắm nóng</td><td>Cắm và rút ngoại vi <strong>mà không phải tắt máy hay cấu hình lại</strong></td><td>Tính năng người dùng nhận ra ngay; SCSI thường phải khởi động lại</td></tr>
<tr><td>Tự cấu hình</td><td><strong>Không cần điện trở kết cuối</strong>; hệ thống tự chạy một hàm cấu hình <strong>để gán địa chỉ</strong></td><td>Xoá đúng hai việc khổ nhất của SCSI: gắn terminator và đặt ID tay từng thiết bị</td></tr>
</table>
<ul>
<li><strong>Đọc cả slide theo tinh thần "cái lợi của SCSI mà không có cái khổ của SCSI".</strong> SCSI cho thông lượng cao nhưng đòi terminator ở hai đầu chuỗi và một ID đặt tay cho từng thiết bị. FireWire giữ cái chuỗi và xoá cả hai đòi hỏi đó — chính là ý nghĩa của "không cần kết cuối" và "tự động gán địa chỉ".</li>
<li><strong>Kiểm mấy con số kỳ lạ: chúng là ĐỘ RỘNG TRƯỜNG ĐỊA CHỈ.</strong> 63 = 2<sup>6</sup> − 1 (sáu bit mã nút, một giá trị dành cho quảng bá) và 1022 = 2<sup>10</sup> − 2 (mười bit mã bus, có giá trị dành riêng). Hễ một chuẩn nêu giới hạn ngay dưới một luỹ thừa của 2 là nó đang nói cho bạn biết trường đó rộng bao nhiêu bit.</li>
<li><strong>Nối chuỗi so với hình cây của USB là khác biệt kiến trúc thật sự.</strong> Thiết bị FireWire chuyển tiếp lưu lượng giúp nhau được và, khác USB, truyền được <em>NGANG HÀNG</em> mà không cần máy chủ làm trung gian — nên nó từng thống trị máy quay và thiết bị âm thanh.</li>
<li><strong>Cắm nóng khó hơn vẻ ngoài của nó.</strong> Nó đòi bus phải dò lại danh sách thiết bị ngay khi đang chạy, gán lại địa chỉ, và giữ cho những lần truyền đang dở không chết. Cái "hàm cấu hình tự động" mà slide nhắc chính là lần dò lại đó, và cùng ý tưởng với enumeration của USB.</li>
<li><strong>Vì sao giờ hiếm thấy.</strong> USB 3 đuổi kịp tốc độ với giá rẻ hơn, còn Thunderbolt (slide 43) chiếm đầu cao cấp. FireWire đáng học trong môn này vì nó minh hoạ sạch sẽ bộ ba: nối chuỗi + cắm nóng + tự cấu hình.</li>
</ul>
<p class="dap-an">✅ Sức chứa tính thật: 63 thiết bị mỗi bus × 1022 bus = <strong>64.386</strong> thiết bị đánh địa chỉ được trong một hệ thống liên kết — cùng bậc độ lớn với con số 64.000 của InfiniBand ở slide 44, và đó không phải trùng hợp: cả hai đều là không gian địa chỉ cỡ 16 bit (2<sup>16</sup> = 65.536).</p>
<p class="meo">💡 Ba chữ giữ trọn slide này: <strong>CHUỖI</strong> (daisy chain, 63 thiết bị), <strong>NÓNG</strong> (cắm nóng), <strong>TỰ</strong> (không kết cuối, tự gán địa chỉ). Đề liệt kê đặc điểm FireWire thì ba chữ đó phủ hết.</p>`],

      [42, 'SCSI — Small Computer System Interface',
        `<p class="y-chinh">🎯 The old guard. SCSI was <strong>"a once common standard for connecting peripheral devices to small and medium-sized computers"</strong> that <strong>"has lost popularity to USB and FireWire in smaller systems"</strong>, while <strong>"high-speed versions remain popular for mass memory support on enterprise systems"</strong>.</p>
<table>
<tr><th>Property (as the slide states it)</th><th>Detail</th></tr>
<tr><td>Physical organisation</td><td>A <strong>shared bus</strong>, supporting up to <strong>16 or 32 devices</strong> depending on the generation</td></tr>
<tr><td>Transmission</td><td><strong>Parallel, not serial</strong> — bus width <strong>16 bits</strong> on earlier generations, <strong>32 bits</strong> on later ones</td></tr>
<tr><td>Speeds</td><td>From <strong>5</strong> on the original SCSI-1 specification to <strong>160</strong> on SCSI-3 U3</td></tr>
<tr><td>Status</td><td>Displaced by USB/FireWire on small machines; alive at the high end for storage</td></tr>
</table>
<ul>
<li><strong>This slide is here as the contrast case, and you should read it that way.</strong> SCSI is a <em>shared parallel bus</em>; USB, FireWire, SATA, PCIe and Thunderbolt are all <em>serial links</em>. Chapter 8 lines them up so you can see the industry-wide swing from parallel to serial.</li>
<li><strong>Why the parallel bus lost — the skew argument again.</strong> Sixteen or thirty-two data wires must all settle within one clock window. Push the clock up and differences in wire length, capacitance and crosstalk make bits arrive at different instants; the bus must slow to its worst wire. Add the need for terminators at both ends and manual device IDs, and the practical ceiling arrives quickly. That ceiling is visible right in the slide's own numbers.</li>
<li><strong>"Shared bus" also means shared bandwidth and arbitration.</strong> All 16 devices contend for one bus, exactly like Ch.3's system bus. A serial point-to-point link gives each device its own path and sidesteps arbitration entirely.</li>
<li><strong>The enterprise survivors are not this bus.</strong> What lives on today is <strong>SAS (Serial Attached SCSI)</strong> — the SCSI <em>command set</em> carried over a serial link. The commands were worth keeping; the parallel cable was not. That is an unusually clean example of a protocol outliving its physical layer.</li>
<li><strong>Connect to Ch.7 (External Memory).</strong> The disks you studied there are exactly what SCSI/SAS attaches. The interface standard and the storage device are two halves of one system.</li>
</ul>
<p class="dap-an">✅ Worked ratio: 5 → 160 is a <strong>32×</strong> improvement across the SCSI generations. For comparison, USB went 1,5 Mbps → 10 Gbps, a factor of 6 667 (slide 40). The parallel bus improved by one-and-a-half orders of magnitude; the serial links improved by nearly four. That gap <em>is</em> the reason the industry switched.</p>
<p class="pitfall">⚠️ <strong>Unit error on the slide.</strong> It writes "5 Mbps … 160 Mbps", but SCSI transfer rates have always been quoted in <strong>megabytes</strong> per second: SCSI-1 was 5 MB/s and Ultra3 (U3) was 160 MB/s. Written as Mbps the numbers are eight times too small — 160 Mbps = 20 MB/s, which would be slower than USB 2.0 and could never have been an enterprise storage interface. Quote the slide if the exam asks what the slide says, but know the unit is wrong.</p>
<p class="meo">💡 Keep one sentence: <strong>SCSI = shared, parallel, terminated, manually addressed — everything the serial standards were invented to stop being.</strong></p>`,
        `<p class="y-chinh">🎯 Lớp cựu binh. SCSI từng là <strong>"một chuẩn phổ biến để nối thiết bị ngoại vi vào máy tính cỡ nhỏ và vừa"</strong>, nhưng <strong>"đã mất chỗ vào tay USB và FireWire ở các hệ nhỏ"</strong>, trong khi <strong>"các phiên bản tốc độ cao vẫn phổ biến cho lưu trữ khối lượng lớn trên hệ thống doanh nghiệp"</strong>.</p>
<table>
<tr><th>Tính chất (theo lời slide)</th><th>Chi tiết</th></tr>
<tr><td>Tổ chức vật lý</td><td>Một <strong>bus dùng chung</strong>, đỡ được tới <strong>16 hoặc 32 thiết bị</strong> tuỳ thế hệ</td></tr>
<tr><td>Cách truyền</td><td><strong>SONG SONG, không phải nối tiếp</strong> — bus rộng <strong>16 bit</strong> ở thế hệ đầu, <strong>32 bit</strong> ở thế hệ sau</td></tr>
<tr><td>Tốc độ</td><td>Từ <strong>5</strong> ở đặc tả SCSI-1 gốc tới <strong>160</strong> ở SCSI-3 U3</td></tr>
<tr><td>Hiện trạng</td><td>Bị USB/FireWire hất khỏi máy nhỏ; vẫn sống ở phân khúc lưu trữ cao cấp</td></tr>
</table>
<ul>
<li><strong>Slide này đứng đây làm CA ĐỐI CHỨNG, và nên đọc nó theo hướng đó.</strong> SCSI là một <em>bus SONG SONG DÙNG CHUNG</em>; còn USB, FireWire, SATA, PCIe và Thunderbolt đều là <em>liên kết NỐI TIẾP</em>. Chương 8 xếp chúng cạnh nhau để bạn thấy cú xoay trục của cả ngành từ song song sang nối tiếp.</li>
<li><strong>Vì sao bus song song thua — lại là chuyện lệch pha.</strong> Mười sáu hay ba mươi hai sợi dữ liệu phải cùng ổn định trong một cửa sổ xung nhịp. Đẩy xung nhịp lên thì chênh lệch chiều dài dây, điện dung và nhiễu xuyên âm khiến các bit tới lệch thời điểm; cả bus phải chậm theo sợi tệ nhất. Cộng thêm nhu cầu gắn terminator hai đầu và đặt ID tay, cái trần thực tế tới rất nhanh. Cái trần đó hiện rõ ngay trong chính con số của slide.</li>
<li><strong>"Bus dùng chung" còn nghĩa là BĂNG THÔNG DÙNG CHUNG và phải có trọng tài.</strong> Cả 16 thiết bị tranh nhau một bus, y hệt bus hệ thống của Ch.3. Liên kết nối tiếp điểm-điểm cho mỗi thiết bị một đường riêng và né hẳn chuyện trọng tài.</li>
<li><strong>Thứ sống sót trong doanh nghiệp KHÔNG phải cái bus này.</strong> Thứ còn sống hôm nay là <strong>SAS (Serial Attached SCSI)</strong> — <em>TẬP LỆNH</em> SCSI chạy trên một liên kết nối tiếp. Tập lệnh đáng giữ; sợi cáp song song thì không. Đây là ví dụ hiếm khi thấy rõ đến vậy về một giao thức sống lâu hơn tầng vật lý của chính nó.</li>
<li><strong>Nối sang Ch.7 (Bộ nhớ ngoài).</strong> Những cái đĩa bạn học ở đó chính là thứ mà SCSI/SAS gắn vào. Chuẩn giao diện và thiết bị lưu trữ là hai nửa của cùng một hệ thống.</li>
</ul>
<p class="dap-an">✅ Tỉ số tính thật: 5 → 160 là cải thiện <strong>32 lần</strong> qua các thế hệ SCSI. Để so sánh, USB đi từ 1,5 Mbps lên 10 Gbps, tức gấp 6.667 lần (slide 40). Bus song song khá lên được một bậc rưỡi độ lớn; liên kết nối tiếp khá lên gần bốn bậc. Chính khoảng cách đó <em>LÀ</em> lý do cả ngành đổi hướng.</p>
<p class="pitfall">⚠️ <strong>Slide SAI ĐƠN VỊ.</strong> Nó ghi "5 Mbps … 160 Mbps", nhưng tốc độ truyền của SCSI xưa nay luôn tính bằng <strong>megabyte</strong> mỗi giây: SCSI-1 là 5 MB/s và Ultra3 (U3) là 160 MB/s. Viết thành Mbps thì con số nhỏ đi tám lần — 160 Mbps = 20 MB/s, tức chậm hơn cả USB 2.0, không đời nào làm nổi giao diện lưu trữ doanh nghiệp. Đề hỏi "slide ghi gì" thì cứ trích, nhưng phải biết đơn vị đó sai.</p>
<p class="meo">💡 Giữ một câu: <strong>SCSI = dùng chung, song song, phải kết cuối, đặt địa chỉ bằng tay — đúng tất cả những thứ mà các chuẩn nối tiếp sinh ra để thôi phải làm.</strong></p>`],

      [43, 'Thunderbolt',
        `<p class="y-chinh">🎯 The convergence interface: <strong>"the technology combines data, video, audio, and power into a single high-speed connection"</strong>. Developed by <strong>Intel with collaboration from Apple</strong>, and described by the slide as <strong>"the most recent and fastest peripheral connection technology to become available for general-purpose use"</strong>.</p>
<table>
<tr><th>Property (as the slide states it)</th><th>Figure</th><th>What it replaces</th></tr>
<tr><td>Throughput</td><td>Up to <strong>10 Gbps in each direction</strong> (full duplex)</td><td>USB 3.0 / FireWire 800 for data</td></tr>
<tr><td>Power delivery</td><td>Up to <strong>10 Watts</strong> to connected peripherals</td><td>A separate power brick for bus-powered drives</td></tr>
<tr><td>What travels on it</td><td><strong>Data, video, audio and power</strong> on one connection</td><td>Four separate cables: USB + DisplayPort + audio + power</td></tr>
<tr><td>Typical peripherals</td><td>Hard drives, <strong>RAID arrays</strong>, video-capture boxes, <strong>network interfaces</strong></td><td>—</td></tr>
</table>
<ul>
<li><strong>"In each direction" is the detail to notice.</strong> 10 Gbps each way is <em>full duplex</em> — a device can upload and download at full rate simultaneously, unlike a shared bus where every byte competes with every other. Aggregate 20 Gbps, but never quote it as a single-direction figure.</li>
<li><strong>The list of peripherals tells you what Thunderbolt really is.</strong> RAID arrays and network interfaces are <em>expansion cards</em>, not ordinary peripherals. Thunderbolt carries PCI Express over a cable, which is why a laptop can drive an external GPU or a 10-GbE adapter through it. That is a qualitatively bigger claim than "a fast USB".</li>
<li><strong>Combining video and data on one connector is a real design win.</strong> DisplayPort packets and PCIe packets are multiplexed on the same link, so one port serves a monitor <em>and</em> a disk <em>and</em> charges the laptop. This convergence is exactly what USB4 later adopted.</li>
<li><strong>Power changes the shape of the desk, not just the speed.</strong> 10 W runs a bus-powered SSD or a small hub. USB Power Delivery went much further (up to 100 W and beyond), which is why modern laptops charge over USB-C.</li>
<li><strong>Connect to Ch.3 and Ch.7.</strong> Thunderbolt is a cable-length extension of the internal PCIe interconnect of Figure 8.16. Ch.7's external drives get plugged into it; Ch.3's bus concepts explain why point-to-point links win.</li>
</ul>
<p class="dap-an">✅ Worked conversion: 10 Gbps ÷ 8 = <strong>1 250 MB/s in each direction</strong>, i.e. about 2,5 GB/s aggregate. Compare with the same slide set's other numbers: USB 3.0 usable 500 MB/s, SATA 6 Gbps = 750 MB/s theoretical. At the time of writing, Thunderbolt genuinely was the fastest of the three.</p>
<p class="pitfall">⚠️ <strong>"Most recent and fastest" has expired.</strong> The 10 Gbps figure describes <strong>Thunderbolt 1 (2011)</strong>. Thunderbolt 2 reached 20 Gbps, and Thunderbolt 3 and 4 reach <strong>40 Gbps</strong> over USB-C — four times what this slide claims, and already standard years before this edition was printed. Treat the slide's number as a historical data point, not as today's ceiling.</p>
<p class="meo">💡 One-line summary: <strong>Thunderbolt = PCIe + DisplayPort + power, in one cable.</strong> That sentence explains every item on the slide, including why RAID arrays and network cards appear in the peripheral list.</p>`,
        `<p class="y-chinh">🎯 Giao diện hội tụ: <strong>"công nghệ này gộp dữ liệu, video, âm thanh và nguồn điện vào một kết nối tốc độ cao duy nhất"</strong>. Do <strong>Intel phát triển với sự hợp tác của Apple</strong>, và được slide mô tả là <strong>"công nghệ kết nối ngoại vi mới nhất và nhanh nhất hiện có cho mục đích phổ thông"</strong>.</p>
<table>
<tr><th>Tính chất (theo lời slide)</th><th>Con số</th><th>Nó thay thế cái gì</th></tr>
<tr><td>Thông lượng</td><td>Tới <strong>10 Gbps MỖI CHIỀU</strong> (song công)</td><td>USB 3.0 / FireWire 800 về mặt dữ liệu</td></tr>
<tr><td>Cấp nguồn</td><td>Tới <strong>10 Watt</strong> cho ngoại vi cắm vào</td><td>Cục nguồn rời cho ổ cứng ăn điện từ bus</td></tr>
<tr><td>Cái gì chạy trên nó</td><td><strong>Dữ liệu, video, âm thanh và nguồn</strong> trên một kết nối</td><td>Bốn sợi cáp riêng: USB + DisplayPort + âm thanh + nguồn</td></tr>
<tr><td>Ngoại vi tiêu biểu</td><td>Ổ cứng, <strong>mảng RAID</strong>, hộp thu hình, <strong>card mạng</strong></td><td>—</td></tr>
</table>
<ul>
<li><strong>Cụm "mỗi chiều" mới là chi tiết cần để ý.</strong> 10 Gbps mỗi chiều là <em>SONG CÔNG</em> — một thiết bị có thể tải lên và tải xuống cùng tốc độ tối đa đồng thời, khác hẳn bus dùng chung nơi mọi byte tranh nhau. Cộng lại là 20 Gbps, nhưng đừng bao giờ trích nó như con số một chiều.</li>
<li><strong>Danh sách ngoại vi nói cho bạn biết Thunderbolt thật ra là gì.</strong> Mảng RAID và card mạng là <em>CARD MỞ RỘNG</em>, không phải ngoại vi thông thường. Thunderbolt cõng PCI Express qua sợi cáp, nên một cái laptop mới lái được GPU ngoài hay bộ chuyển 10-GbE qua nó. Đó là tuyên bố lớn hơn hẳn "một cái USB nhanh".</li>
<li><strong>Gộp video với dữ liệu trên một đầu nối là thắng lợi thiết kế thật.</strong> Gói DisplayPort và gói PCIe được ghép kênh trên cùng một liên kết, nên một cổng phục vụ được màn hình <em>VÀ</em> ổ đĩa <em>VÀ</em> sạc luôn laptop. Chính sự hội tụ này về sau được USB4 tiếp nhận.</li>
<li><strong>Nguồn điện đổi hình dạng cái bàn làm việc, chứ không chỉ đổi tốc độ.</strong> 10 W nuôi được một ổ SSD ăn điện từ bus hoặc một hub nhỏ. USB Power Delivery còn đi xa hơn nhiều (tới 100 W và hơn), nên laptop hiện đại mới sạc qua USB-C.</li>
<li><strong>Nối sang Ch.3 và Ch.7.</strong> Thunderbolt là phần nối dài bằng cáp của chính mạng PCIe trong chip ở Figure 8.16. Ổ cứng ngoài của Ch.7 cắm vào đó; khái niệm bus của Ch.3 giải thích vì sao liên kết điểm-điểm thắng.</li>
</ul>
<p class="dap-an">✅ Quy đổi: 10 Gbps ÷ 8 = <strong>1.250 MB/s mỗi chiều</strong>, tức khoảng 2,5 GB/s cộng lại. So với những con số khác trong cùng bộ slide: USB 3.0 dùng được 500 MB/s, SATA 6 Gbps = 750 MB/s lý thuyết. Vào thời điểm viết sách, Thunderbolt đúng là nhanh nhất trong ba.</p>
<p class="pitfall">⚠️ <strong>Câu "mới nhất và nhanh nhất" đã hết hạn.</strong> Con số 10 Gbps mô tả <strong>Thunderbolt 1 (2011)</strong>. Thunderbolt 2 đạt 20 Gbps, còn Thunderbolt 3 và 4 đạt <strong>40 Gbps</strong> qua cổng USB-C — gấp bốn lần slide nói, và đã phổ biến nhiều năm trước khi bản này in ra. Hãy coi con số của slide là một mốc lịch sử, không phải trần của hôm nay.</p>
<p class="meo">💡 Tóm một dòng: <strong>Thunderbolt = PCIe + DisplayPort + nguồn điện, trong một sợi cáp.</strong> Câu đó giải thích mọi mục trên slide, kể cả vì sao mảng RAID và card mạng lại nằm trong danh sách ngoại vi.</p>`],

      [44, 'InfiniBand',
        `<p class="y-chinh">🎯 The interconnect for the top of the market: <strong>"an I/O specification aimed at the high-end server market"</strong>, first released <strong>in early 2001</strong>, and <strong>"heavily relied on by IBM zEnterprise series of mainframes"</strong>. This is the slide that bridges "peripheral cables" and "machine-room fabrics".</p>
<table>
<tr><th>Property (as the slide states it)</th><th>Detail</th></tr>
<tr><td>Target</td><td>The <strong>high-end server</strong> market; heavily used by IBM zEnterprise mainframes</td></tr>
<tr><td>First release</td><td><strong>Early 2001</strong></td></tr>
<tr><td>What the standard describes</td><td>An architecture and specifications for <strong>data flow among processors and intelligent I/O devices</strong></td></tr>
<tr><td>Where it won</td><td>A popular interface for <strong>storage area networking</strong> and other large storage configurations</td></tr>
<tr><td>Topology</td><td>Servers, remote storage and other network devices attached in a <strong>central fabric of switches and links</strong></td></tr>
<tr><td>Scale</td><td>The switch-based architecture can connect up to <strong>64 000</strong> servers, storage systems and networking devices</td></tr>
</table>
<ul>
<li><strong>The key phrase is "central fabric of switches and links".</strong> Not a bus, not a tree, not a daisy chain — a <em>switched fabric</em>, where any node can reach any other through switches, and many pairs communicate simultaneously. This is the last step of the whole progression: bus → point-to-point link → tree → fabric.</li>
<li><strong>"Data flow among processors and intelligent I/O devices" quietly removes the CPU from the middle.</strong> In a fabric, an I/O device can talk to <em>another</em> I/O device or directly into a remote machine's memory without a host CPU relaying. That is the idea behind RDMA (remote direct memory access), and it is DMA's concept stretched across a machine room.</li>
<li><strong>Why mainframes love it.</strong> Slide 48–49's IBM z13 is exactly the machine the slide names: masses of I/O, many logical partitions, and a requirement that adding I/O capacity must not touch the processors. A fabric scales in a way a bus never can.</li>
<li><strong>64 000 is an address-space number again.</strong> It sits just under 2<sup>16</sup> = 65 536, exactly like FireWire's 63 and 1022 on slide 41. When a specification quotes a limit near a power of two, you are reading the width of an identifier field.</li>
<li><strong>Contrast with USB in one line.</strong> USB: one host, hierarchical tree, host-initiated, metres of cable. InfiniBand: many peers, switched fabric, any-to-any, a whole data centre. Same chapter, opposite ends of the scale.</li>
</ul>
<p class="dap-an">✅ Worked comparison of maximum device counts across this chapter's standards: SCSI <strong>16–32</strong> · FireWire <strong>63</strong> per bus (64 386 across bridged buses) · USB <strong>127</strong> per host controller · InfiniBand <strong>64 000</strong>. Reading down that list is reading the progression from a cable, to a bus, to a tree, to a fabric — a factor of roughly <strong>2000×</strong> from SCSI to InfiniBand in how many things one interconnect can address.</p>
<p class="meo">💡 Remember InfiniBand by its three nouns: <strong>fabric, switches, links</strong>. If a question describes an interconnect where every device reaches every other through switches rather than sharing one medium, that is a fabric — and on this course, InfiniBand.</p>`,
        `<p class="y-chinh">🎯 Mạng liên kết cho phân khúc cao nhất: <strong>"một đặc tả I/O nhắm tới thị trường máy chủ cao cấp"</strong>, phát hành lần đầu <strong>đầu năm 2001</strong>, và <strong>"được dòng máy lớn IBM zEnterprise dựa vào rất nhiều"</strong>. Đây là slide bắc cầu giữa "cáp ngoại vi" và "mạng liên kết cả phòng máy".</p>
<table>
<tr><th>Tính chất (theo lời slide)</th><th>Chi tiết</th></tr>
<tr><td>Nhắm vào</td><td>Thị trường <strong>máy chủ cao cấp</strong>; máy lớn IBM zEnterprise dùng rất nhiều</td></tr>
<tr><td>Phát hành đầu tiên</td><td><strong>Đầu năm 2001</strong></td></tr>
<tr><td>Chuẩn mô tả cái gì</td><td>Một kiến trúc và đặc tả cho <strong>dòng dữ liệu giữa các bộ xử lý và các thiết bị I/O thông minh</strong></td></tr>
<tr><td>Nó thắng ở đâu</td><td>Trở thành giao diện phổ biến cho <strong>mạng vùng lưu trữ (SAN)</strong> và các cấu hình lưu trữ lớn khác</td></tr>
<tr><td>Hình dạng</td><td>Máy chủ, lưu trữ từ xa và thiết bị mạng khác cắm vào một <strong>fabric trung tâm gồm switch và liên kết</strong></td></tr>
<tr><td>Quy mô</td><td>Kiến trúc dựa trên switch nối được tới <strong>64.000</strong> máy chủ, hệ lưu trữ và thiết bị mạng</td></tr>
</table>
<ul>
<li><strong>Cụm then chốt là "fabric trung tâm gồm switch và liên kết".</strong> Không phải bus, không phải cây, không phải chuỗi — mà là một <em>MẠNG CHUYỂN MẠCH (switched fabric)</em>, nơi nút nào cũng tới được nút nào qua các switch, và nhiều cặp giao tiếp đồng thời. Đây là chặng cuối của cả mạch tiến hoá: bus → liên kết điểm-điểm → cây → fabric.</li>
<li><strong>Câu "dòng dữ liệu giữa bộ xử lý và thiết bị I/O thông minh" lặng lẽ GẠT CPU ra khỏi giữa.</strong> Trong một fabric, một thiết bị I/O nói chuyện được với <em>MỘT</em> thiết bị I/O khác, hoặc ghi thẳng vào bộ nhớ của một máy ở xa, mà không cần CPU chủ chuyển tiếp. Đó là ý tưởng của RDMA (truy cập bộ nhớ trực tiếp từ xa), và nó chính là khái niệm DMA kéo dài ra khắp phòng máy.</li>
<li><strong>Vì sao máy lớn mê nó.</strong> Con IBM z13 ở slide 48–49 đúng là cái máy mà slide này gọi tên: I/O khối lượng khổng lồ, rất nhiều phân vùng logic, và yêu cầu là thêm năng lực I/O không được đụng tới các bộ xử lý. Fabric mở rộng theo cách mà bus không bao giờ làm nổi.</li>
<li><strong>64.000 lại là một con số của KHÔNG GIAN ĐỊA CHỈ.</strong> Nó nằm ngay dưới 2<sup>16</sup> = 65.536, đúng kiểu 63 và 1022 của FireWire ở slide 41. Hễ một đặc tả nêu giới hạn sát một luỹ thừa của 2 là bạn đang đọc độ rộng của một trường định danh.</li>
<li><strong>Đối chiếu với USB trong một dòng.</strong> USB: một máy chủ, hình cây phân tầng, mọi thứ do máy chủ khởi xướng, cáp dài vài mét. InfiniBand: nhiều bên ngang hàng, mạng chuyển mạch, ai tới ai cũng được, phạm vi cả trung tâm dữ liệu. Cùng một chương, hai đầu ngược nhau của thang quy mô.</li>
</ul>
<p class="dap-an">✅ So số thiết bị tối đa của các chuẩn trong chương này: SCSI <strong>16–32</strong> · FireWire <strong>63</strong> mỗi bus (64.386 khi nối cầu) · USB <strong>127</strong> mỗi bộ điều khiển chủ · InfiniBand <strong>64.000</strong>. Đọc dọc danh sách đó là đọc đúng mạch tiến hoá từ sợi cáp, tới cái bus, tới hình cây, tới fabric — chênh nhau khoảng <strong>2000 lần</strong> giữa SCSI và InfiniBand về số thứ mà một mạng liên kết đánh địa chỉ được.</p>
<p class="meo">💡 Nhớ InfiniBand bằng ba danh từ: <strong>fabric, switch, liên kết</strong>. Đề mô tả một mạng liên kết mà mọi thiết bị tới được nhau qua switch chứ không dùng chung một môi trường, thì đó là fabric — và trong môn này, đó là InfiniBand.</p>`],

      [45, 'PCI Express and SATA',
        `<p class="y-chinh">🎯 Two standards on one slide, though very unequally treated: <strong>PCI Express</strong> gets a single line — <em>"high-speed bus system for connecting peripherals of a wide variety of types and speeds"</em> — while <strong>SATA</strong> gets four.</p>
<table>
<tr><th></th><th>PCI Express</th><th>SATA</th></tr>
<tr><td><strong>Full name</strong></td><td>Peripheral Component Interconnect Express</td><td><strong>Serial Advanced Technology Attachment</strong></td></tr>
<tr><td><strong>The slide's description</strong></td><td>"High-speed bus system for connecting peripherals of a wide variety of types and speeds"</td><td>"An interface for <strong>disk storage systems</strong>"</td></tr>
<tr><td><strong>Rates given</strong></td><td><em>(none printed)</em></td><td>"Up to <strong>6 Gbps</strong>, with a maximum per device of <strong>300 Mbps</strong>"</td></tr>
<tr><td><strong>Where used</strong></td><td><em>(not stated)</em></td><td>"Widely used in <strong>desktop computers</strong> and in <strong>industrial and embedded applications</strong>"</td></tr>
</table>
<ul>
<li><strong>PCIe is the internal one, SATA the storage one — that is the division to hold on to.</strong> PCIe connects cards and chips <em>inside</em> the box (and, via Thunderbolt, just outside it); SATA connects <em>disks</em>. Figure 8.16 on slide 32 already showed PCIe as the chip's doorway "To I/O devices".</li>
<li><strong>Calling PCIe a "bus system" is historically accurate and technically misleading.</strong> Its ancestor PCI genuinely was a shared parallel bus. PCIe is <em>point-to-point serial lanes</em> through a switch; it keeps the PCI programming model (configuration space, enumeration) while throwing away the physical bus. The name survived; the topology did not — exactly the same pattern as SCSI → SAS on slide 42.</li>
<li><strong>SATA's "serial" is the whole point of its name.</strong> It replaced parallel ATA (a 40-wire ribbon cable) for the reason given on slide 40: at high clock rates, parallel wires skew. Serial gave thinner cables, longer runs, better airflow and higher speed simultaneously.</li>
<li><strong>Why SATA still matters when NVMe exists.</strong> Cheap bulk storage and embedded systems keep using it, exactly as the slide's last line says. NVMe SSDs speak PCIe instead — which is why both standards appear on the same slide.</li>
<li><strong>Connect to Ch.7 (External Memory).</strong> The disk geometry and RAID levels you studied there sit behind a SATA or SAS port. This slide is the cable; Ch.7 was the device.</li>
</ul>
<p class="dap-an">✅ Worked conversion of the SATA figure: 6 Gbps ÷ 8 = <strong>750 MB/s</strong> raw, and after 8b/10b line coding (20 % overhead) about <strong>600 MB/s</strong> usable — which is exactly the number quoted for SATA III in practice. The line coding check works here just as it did for USB on slide 40.</p>
<p class="pitfall">⚠️ <strong>Two problems on this slide, name both.</strong> (1) <em>Unit error:</em> "a maximum per device of 300 Mbps" would be 37,5 MB/s — slower than a USB 2.0 flash drive and impossible for a disk interface. The intended figure is <strong>300 MB/s</strong> (the usable rate of the 3 Gbps SATA II generation after 8b/10b). (2) <em>The PCI Express column is nearly empty</em> — one bullet against SATA's four, with no data rates at all. That is the original slide, not a rendering fault; if you need PCIe's numbers you must take them from elsewhere in the book.</p>
<p class="meo">💡 Keep the pairing straight with one sentence: <strong>"PCIe carries cards, SATA carries disks, and both are serial links wearing the names of the parallel buses they replaced."</strong></p>`,
        `<p class="y-chinh">🎯 Hai chuẩn trên một slide, nhưng được đối xử rất không cân: <strong>PCI Express</strong> chỉ được đúng một dòng — <em>"hệ bus tốc độ cao để nối các ngoại vi đủ mọi chủng loại và tốc độ"</em> — còn <strong>SATA</strong> được bốn dòng.</p>
<table>
<tr><th></th><th>PCI Express</th><th>SATA</th></tr>
<tr><td><strong>Tên đầy đủ</strong></td><td>Peripheral Component Interconnect Express</td><td><strong>Serial Advanced Technology Attachment</strong></td></tr>
<tr><td><strong>Slide mô tả</strong></td><td>"Hệ bus tốc độ cao để nối ngoại vi đủ mọi chủng loại và tốc độ"</td><td>"Giao diện cho <strong>hệ lưu trữ đĩa</strong>"</td></tr>
<tr><td><strong>Tốc độ được nêu</strong></td><td><em>(không in con số nào)</em></td><td>"Tới <strong>6 Gbps</strong>, tối đa mỗi thiết bị là <strong>300 Mbps</strong>"</td></tr>
<tr><td><strong>Dùng ở đâu</strong></td><td><em>(không nói)</em></td><td>"Dùng rộng rãi trong <strong>máy tính để bàn</strong> và trong <strong>ứng dụng công nghiệp, nhúng</strong>"</td></tr>
</table>
<ul>
<li><strong>PCIe là cái BÊN TRONG, SATA là cái cho LƯU TRỮ — đó là ranh giới cần giữ.</strong> PCIe nối card và chip <em>BÊN TRONG</em> thùng máy (và, qua Thunderbolt, ngay bên ngoài nó); SATA nối <em>ĐĨA</em>. Figure 8.16 ở slide 32 đã vẽ PCIe là cánh cửa của chip đi "To I/O devices".</li>
<li><strong>Gọi PCIe là "hệ bus" thì đúng về lịch sử nhưng dễ gây hiểu sai về kỹ thuật.</strong> Ông tổ PCI của nó đúng là một bus song song dùng chung. Còn PCIe là <em>CÁC LÀN NỐI TIẾP ĐIỂM-ĐIỂM</em> qua switch; nó giữ mô hình lập trình của PCI (không gian cấu hình, enumeration) nhưng vứt bỏ cái bus vật lý. Cái tên sống sót; hình dạng thì không — đúng y khuôn mẫu SCSI → SAS ở slide 42.</li>
<li><strong>Chữ "Serial" trong SATA chính là điểm mấu chốt của cái tên.</strong> Nó thay ATA song song (cáp dẹt 40 sợi) vì đúng lý do nêu ở slide 40: ở xung nhịp cao, dây song song bị lệch pha. Nối tiếp cho cáp mảnh hơn, đi xa hơn, thoáng gió hơn và nhanh hơn — cùng một lúc.</li>
<li><strong>Vì sao SATA vẫn còn ý nghĩa khi đã có NVMe.</strong> Lưu trữ dung lượng lớn giá rẻ và hệ nhúng vẫn dùng nó, đúng như dòng cuối của slide. Ổ SSD NVMe thì nói tiếng PCIe — đó là lý do hai chuẩn này xuất hiện trên cùng một slide.</li>
<li><strong>Nối sang Ch.7 (Bộ nhớ ngoài).</strong> Hình học đĩa và các mức RAID bạn học ở đó nằm sau một cổng SATA hoặc SAS. Slide này là sợi cáp; Ch.7 là thiết bị.</li>
</ul>
<p class="dap-an">✅ Quy đổi con số SATA: 6 Gbps ÷ 8 = <strong>750 MB/s</strong> thô, và sau mã đường truyền 8b/10b (hao 20 %) còn khoảng <strong>600 MB/s</strong> dùng được — đúng bằng con số thực tế người ta nêu cho SATA III. Phép kiểm mã đường truyền hoạt động ở đây y như với USB ở slide 40.</p>
<p class="pitfall">⚠️ <strong>Hai vấn đề trên slide này, gọi tên cả hai.</strong> (1) <em>Sai đơn vị:</em> "tối đa mỗi thiết bị 300 Mbps" thì bằng 37,5 MB/s — chậm hơn cả USB 2.0 và bất khả với một giao diện đĩa. Con số đúng ý là <strong>300 MB/s</strong> (tốc độ dùng được của thế hệ SATA II 3 Gbps sau mã 8b/10b). (2) <em>Cột PCI Express gần như TRỐNG</em> — một gạch đầu dòng so với bốn của SATA, không có con số tốc độ nào. Đó là slide gốc như vậy, không phải lỗi render; cần số của PCIe thì phải lấy ở chỗ khác trong sách.</p>
<p class="meo">💡 Giữ cặp đôi này thẳng hàng bằng một câu: <strong>"PCIe cõng CARD, SATA cõng ĐĨA, và cả hai đều là liên kết nối tiếp đeo tên của những cái bus song song mà chúng đã thay thế."</strong></p>`],

      [46, 'Ethernet',
        `<p class="y-chinh">🎯 <strong>"The predominant wired networking technology"</strong> — and the reason the second half of this chapter exists at all, since it is Ethernet's data rates that made DMA insufficient on slide 31.</p>
<table>
<tr><th>The slide's statement</th><th>What to take from it</th></tr>
<tr><td>Has evolved to support data rates up to <strong>100 Gbps</strong>, and distances from <strong>a few metres to tens of km</strong></td><td>One technology spans a desk cable and a metropolitan link</td></tr>
<tr><td>Essential for supporting personal computers, workstations, servers and <strong>massive data storage devices</strong></td><td>Storage now runs over Ethernet too (iSCSI, NVMe-over-Fabrics)</td></tr>
<tr><td>Began as an experimental <strong>bus-based 3-Mbps</strong> system</td><td>It started as a literal shared bus — one coaxial cable, everyone tapped into it</td></tr>
<tr><td>Has moved from <strong>bus-based to switch-based</strong>; there is <strong>a central switch with all of the devices connected directly to it</strong></td><td>The same bus → switched-fabric arc as InfiniBand on slide 44</td></tr>
<tr><td>Data rate has periodically increased <strong>by an order of magnitude</strong></td><td>3 → 10 → 100 → 1000 Mbps → 10 → 40 → 100 Gbps</td></tr>
</table>
<ul>
<li><strong>The bus-to-switch move is the same lesson as the rest of the chapter.</strong> Original Ethernet was a shared medium with collisions and CSMA/CD arbitration — conceptually Ch.3's bus, stretched down a corridor. Modern Ethernet gives every device its own point-to-point link into a switch, so collisions simply cannot occur. Bus → link → switch, once more.</li>
<li><strong>"Order of magnitude" jumps are why the standard survived 40 years.</strong> Each generation was ten times faster while keeping the same frame format, so software and drivers carried straight over. Compatibility, not speed, is Ethernet's real achievement.</li>
<li><strong>The distance range matters as much as the speed.</strong> A few metres (a patch cable) to tens of kilometres (single-mode fibre between buildings) with one frame format is why data centres, campuses and carriers all speak the same protocol.</li>
<li><strong>This slide is the direct cause of slides 31–37.</strong> Go back: DCA exists because 10-Gbps and 100-Gbps Ethernet switches produce more packets per second than a DMA-plus-cache-miss pipeline can absorb. Ethernet is the workload; DDIO is the response.</li>
<li><strong>Connect to the packet anatomy of slide 33.</strong> That slide's "the lowest, or link, level protocol is typically Ethernet" is this technology. Every DCA argument in the chapter is about Ethernet frames.</li>
</ul>
<p class="dap-an">✅ Worked progression: from the experimental <strong>3 Mbps</strong> to today's <strong>100 Gbps</strong> is a factor of 100 × 10<sup>9</sup> ÷ 3 × 10<sup>6</sup> = <strong>33 333×</strong>. Put beside the chapter's other standards, that is the widest span of any: USB managed 6 667× (slide 40), SCSI only 32× (slide 42). And 100 Gbps = 12,5 GB/s — more than the 10 GB/s that a single DDR3 channel of Figure 8.16 could sustain, which is precisely why a packet must not make a round trip to DRAM.</p>
<p class="meo">💡 Remember the arc in four words: <strong>coax bus → switched star</strong>. Everything else about Ethernet — no more collisions, full duplex, per-port bandwidth — follows from that single topological change.</p>`,
        `<p class="y-chinh">🎯 <strong>"Công nghệ mạng có dây chiếm ưu thế"</strong> — và là lý do tồn tại của cả nửa sau chương này, bởi chính tốc độ dữ liệu của Ethernet đã làm DMA hụt hơi ở slide 31.</p>
<table>
<tr><th>Câu trên slide</th><th>Điều cần rút ra</th></tr>
<tr><td>Đã tiến hoá lên tới <strong>100 Gbps</strong>, và khoảng cách từ <strong>vài mét tới hàng chục km</strong></td><td>Một công nghệ trải từ sợi cáp trên bàn tới đường nối liên đô thị</td></tr>
<tr><td>Thiết yếu cho máy cá nhân, workstation, máy chủ và <strong>thiết bị lưu trữ dữ liệu khổng lồ</strong></td><td>Lưu trữ nay cũng chạy trên Ethernet (iSCSI, NVMe-over-Fabrics)</td></tr>
<tr><td>Khởi đầu là một hệ thử nghiệm <strong>dựa trên bus, 3 Mbps</strong></td><td>Nó bắt đầu đúng nghĩa là một bus dùng chung — một sợi cáp đồng trục, ai cũng chọc vào đó</td></tr>
<tr><td>Đã chuyển từ <strong>dựa trên bus sang dựa trên switch</strong>; có <strong>một switch trung tâm mà mọi thiết bị nối thẳng vào</strong></td><td>Cùng cung đường bus → mạng chuyển mạch như InfiniBand ở slide 44</td></tr>
<tr><td>Tốc độ dữ liệu cứ định kỳ lại tăng <strong>một bậc độ lớn</strong></td><td>3 → 10 → 100 → 1000 Mbps → 10 → 40 → 100 Gbps</td></tr>
</table>
<ul>
<li><strong>Cú chuyển bus-sang-switch là đúng bài học của cả chương.</strong> Ethernet nguyên thuỷ là môi trường dùng chung có va chạm và trọng tài CSMA/CD — về khái niệm chính là cái bus của Ch.3, kéo dài dọc hành lang. Ethernet hiện đại cho mỗi thiết bị một liên kết điểm-điểm riêng vào switch, nên va chạm đơn giản là không thể xảy ra. Bus → liên kết → switch, một lần nữa.</li>
<li><strong>Những cú nhảy "một bậc độ lớn" là lý do chuẩn này sống được 40 năm.</strong> Mỗi thế hệ nhanh gấp mười mà vẫn giữ nguyên khuôn dạng khung, nên phần mềm và trình điều khiển đi thẳng sang được. Thành tựu thật của Ethernet là TƯƠNG THÍCH, không phải tốc độ.</li>
<li><strong>Dải khoảng cách quan trọng ngang với tốc độ.</strong> Từ vài mét (dây nhảy) tới hàng chục kilômét (sợi quang đơn mode giữa các toà nhà) mà chỉ một khuôn dạng khung — nên trung tâm dữ liệu, khuôn viên trường và nhà mạng đều nói cùng một giao thức.</li>
<li><strong>Slide này là nguyên nhân trực tiếp của slide 31–37.</strong> Quay lại mà xem: DCA tồn tại vì switch Ethernet 10 Gbps và 100 Gbps sinh ra nhiều gói mỗi giây hơn mức mà đường ống DMA-cộng-trượt-cache nuốt nổi. Ethernet là TẢI CÔNG VIỆC; DDIO là CÂU TRẢ LỜI.</li>
<li><strong>Nối với giải phẫu gói tin ở slide 33.</strong> Câu "giao thức mức thấp nhất, mức liên kết, thường là Ethernet" ở slide đó chính là công nghệ này. Mọi lập luận về DCA trong chương đều nói về khung Ethernet.</li>
</ul>
<p class="dap-an">✅ Mạch tiến hoá tính thật: từ bản thử nghiệm <strong>3 Mbps</strong> tới <strong>100 Gbps</strong> hôm nay là gấp 100 × 10<sup>9</sup> ÷ 3 × 10<sup>6</sup> = <strong>33.333 lần</strong>. Đặt cạnh các chuẩn khác trong chương thì đó là biên độ rộng nhất: USB được 6.667 lần (slide 40), SCSI chỉ 32 lần (slide 42). Và 100 Gbps = 12,5 GB/s — nhiều hơn mức 10 GB/s mà một kênh DDR3 của Figure 8.16 gánh nổi, đúng là lý do vì sao một gói tin KHÔNG được phép đi một vòng xuống DRAM.</p>
<p class="meo">💡 Nhớ cung đường bằng bốn chữ: <strong>bus đồng trục → sao chuyển mạch</strong>. Mọi thứ còn lại của Ethernet — hết va chạm, song công, băng thông riêng mỗi cổng — đều suy ra từ đúng một thay đổi hình dạng đó.</p>`],

      [47, 'Wi-Fi',
        `<p class="y-chinh">🎯 The wireless counterpart, and the last of the external interconnection standards: <strong>"the predominant wireless Internet access technology"</strong>, which now connects <em>"computers, tablets, smart phones, and other electronic devices such as video cameras, TVs and thermostats"</em>.</p>
<table>
<tr><th>The slide's statement</th><th>Why it is in this chapter</th></tr>
<tr><td>Predominant wireless Internet access technology</td><td>It is the other half of slide 31's demand: gigabit Wi-Fi feeding enterprise servers</td></tr>
<tr><td>Connects computers, tablets, smart phones, video cameras, TVs, <strong>thermostats</strong></td><td>The thermostat is the IoT hint — the number of endpoints, not just their speed, is growing</td></tr>
<tr><td>In the enterprise, "an essential means of <strong>enhancing worker productivity and network effectiveness</strong>"</td><td>Explains why the server-side load matters, not just the client experience</td></tr>
<tr><td>"<strong>Public hotspots</strong> have expanded dramatically to provide free Internet access in most public places"</td><td>Scale of deployment</td></tr>
<tr><td>As antennas, transmission techniques and protocol design evolved, the <strong>IEEE 802.11</strong> committee introduced standards for new versions at higher speeds</td><td>Same order-of-magnitude ladder as Ethernet on slide 46</td></tr>
<tr><td>"Current version is <strong>802.11ac (2014)</strong> with a maximum data rate of <strong>3,2 Gbps</strong>"</td><td>The figure quoted back on slide 31</td></tr>
</table>
<ul>
<li><strong>Read this slide together with slide 31 — they are two halves of one argument.</strong> Slide 31 listed "Wi-Fi in the gigabit range, devices that handle 3,2 Gbps and 6,76 Gbps" as a driver of DCA. This slide is where that 3,2 Gbps comes from. Wireless is no longer the slow edge of the network.</li>
<li><strong>The shared-medium point is worth making explicitly.</strong> Wi-Fi is the one standard in this whole chapter that is still a genuine <em>shared medium</em> with contention — like the original coaxial Ethernet of slide 46. Radio cannot be switched into point-to-point lanes, so the arbitration problem that wired standards solved by topology has to be solved by protocol (CSMA/CA) instead.</li>
<li><strong>"Enhancing worker productivity" is not filler.</strong> It explains the load pattern: hundreds of enterprise clients, each moderately fast, all funnelling into the same servers — exactly the packets-per-second pressure that slides 33–37 attack.</li>
<li><strong>The named quantities are all radio-layer maxima.</strong> 3,2 Gbps is the aggregate PHY rate of an 802.11ac access point using multiple spatial streams, not what one laptop gets. The same caution applies as with USB's "signalling versus usable" distinction on slide 40.</li>
<li><strong>Connect to the chapter's arc.</strong> This closes the external-interface sequence: wired short-range (USB, FireWire, Thunderbolt), wired storage (SCSI, SATA), wired internal (PCIe), wired network (Ethernet), wireless network (Wi-Fi). Slides 48–49 then show a machine where all of it lands.</li>
</ul>
<p class="dap-an">✅ Worked conversion of the slide's figure: 3,2 Gbps ÷ 8 = <strong>400 MB/s</strong>, and slide 31's 6,76 Gbps = <strong>845 MB/s</strong>. Compare with SATA's usable 600 MB/s (slide 45): a top-end Wi-Fi access point can now push more data than a SATA disk can absorb. That single comparison explains why "wireless" stopped being the bottleneck and started being a source of server-side load.</p>
<p class="pitfall">⚠️ <strong>"Current version is 802.11ac (2014)" was already out of date when this edition was printed in 2022.</strong> <strong>802.11ax (Wi-Fi 6)</strong> was ratified in 2019 and Wi-Fi 6E followed; Wi-Fi 7 (802.11be) came after. Cite 802.11ac and 3,2 Gbps if the exam asks what the slide says, but do not claim it is the current standard.</p>
<p class="meo">💡 Keep the contrast in one line: <strong>Ethernet solved contention by changing the topology (switches); Wi-Fi cannot change the air, so it solves contention by protocol.</strong> That is the whole difference between the last two slides.</p>`,
        `<p class="y-chinh">🎯 Người anh em không dây, và là chuẩn ghép nối ngoài cuối cùng: <strong>"công nghệ truy cập Internet không dây chiếm ưu thế"</strong>, hiện nối <em>"máy tính, máy tính bảng, điện thoại thông minh, và các thiết bị điện tử khác như máy quay, TV và bộ điều nhiệt"</em>.</p>
<table>
<tr><th>Câu trên slide</th><th>Vì sao nó nằm trong chương này</th></tr>
<tr><td>Công nghệ truy cập Internet không dây chiếm ưu thế</td><td>Đây là nửa còn lại của nhu cầu ở slide 31: Wi-Fi gigabit bơm vào máy chủ doanh nghiệp</td></tr>
<tr><td>Nối máy tính, máy tính bảng, điện thoại, máy quay, TV, <strong>bộ điều nhiệt</strong></td><td>Cái bộ điều nhiệt là ám chỉ IoT — SỐ LƯỢNG điểm cuối, chứ không chỉ tốc độ, đang tăng</td></tr>
<tr><td>Trong doanh nghiệp, "một phương tiện thiết yếu để <strong>nâng năng suất người lao động và hiệu quả mạng</strong>"</td><td>Giải thích vì sao TẢI PHÍA MÁY CHỦ mới đáng nói, chứ không chỉ trải nghiệm máy khách</td></tr>
<tr><td>"<strong>Điểm phát công cộng</strong> đã mở rộng mạnh mẽ, cho Internet miễn phí ở hầu hết nơi công cộng"</td><td>Quy mô triển khai</td></tr>
<tr><td>Khi ăng-ten, kỹ thuật truyền và thiết kế giao thức tiến hoá, uỷ ban <strong>IEEE 802.11</strong> lại ra chuẩn mới tốc độ cao hơn</td><td>Cùng cái thang "một bậc độ lớn" như Ethernet ở slide 46</td></tr>
<tr><td>"Phiên bản hiện tại là <strong>802.11ac (2014)</strong> với tốc độ dữ liệu tối đa <strong>3,2 Gbps</strong>"</td><td>Đúng con số được trích lại ở slide 31</td></tr>
</table>
<ul>
<li><strong>Đọc slide này cùng slide 31 — chúng là hai nửa của một lập luận.</strong> Slide 31 liệt kê "Wi-Fi ở mức gigabit, thiết bị chạy 3,2 Gbps và 6,76 Gbps" như một động lực của DCA. Slide này là nơi con số 3,2 Gbps đó sinh ra. Không dây thôi làm cái biên chậm chạp của mạng rồi.</li>
<li><strong>Điểm "môi trường dùng chung" đáng nói thẳng ra.</strong> Wi-Fi là chuẩn DUY NHẤT trong cả chương này vẫn thật sự là <em>MÔI TRƯỜNG DÙNG CHUNG</em> có tranh chấp — giống hệt Ethernet đồng trục nguyên thuỷ ở slide 46. Không thể chuyển mạch sóng vô tuyến thành các làn điểm-điểm, nên bài toán trọng tài mà các chuẩn có dây giải bằng HÌNH DẠNG thì Wi-Fi buộc phải giải bằng GIAO THỨC (CSMA/CA).</li>
<li><strong>Câu "nâng năng suất người lao động" không phải chữ độn.</strong> Nó giải thích kiểu tải: hàng trăm máy khách doanh nghiệp, mỗi cái tốc độ vừa, tất cả dồn về cùng những máy chủ — đúng cái áp lực số gói mỗi giây mà slide 33–37 tấn công.</li>
<li><strong>Những con số nêu ra đều là cực đại của TẦNG VÔ TUYẾN.</strong> 3,2 Gbps là tốc độ PHY gộp của một điểm truy cập 802.11ac dùng nhiều luồng không gian, không phải thứ một cái laptop nhận được. Áp dụng đúng sự thận trọng như với phân biệt "tốc độ tín hiệu so với tốc độ dùng được" của USB ở slide 40.</li>
<li><strong>Nối vào mạch của chương.</strong> Nó khép lại chuỗi giao diện ngoài: có dây tầm ngắn (USB, FireWire, Thunderbolt), có dây cho lưu trữ (SCSI, SATA), có dây bên trong (PCIe), có dây cho mạng (Ethernet), không dây cho mạng (Wi-Fi). Rồi slide 48–49 cho thấy một cỗ máy mà tất cả những thứ đó đổ về.</li>
</ul>
<p class="dap-an">✅ Quy đổi con số của slide: 3,2 Gbps ÷ 8 = <strong>400 MB/s</strong>, và con số 6,76 Gbps ở slide 31 = <strong>845 MB/s</strong>. So với 600 MB/s dùng được của SATA (slide 45): một điểm truy cập Wi-Fi cao cấp giờ đẩy được nhiều dữ liệu hơn mức một cái đĩa SATA nuốt nổi. Chỉ phép so đó thôi cũng đủ giải thích vì sao "không dây" thôi làm nút thắt cổ chai và bắt đầu trở thành nguồn tải cho phía máy chủ.</p>
<p class="pitfall">⚠️ <strong>Câu "phiên bản hiện tại là 802.11ac (2014)" đã cũ ngay từ lúc bản này in năm 2022.</strong> <strong>802.11ax (Wi-Fi 6)</strong> được chuẩn hoá năm 2019 rồi tới Wi-Fi 6E; Wi-Fi 7 (802.11be) đến sau đó. Đề hỏi "slide ghi gì" thì cứ trích 802.11ac và 3,2 Gbps, nhưng đừng khẳng định đó là chuẩn hiện hành.</p>
<p class="meo">💡 Giữ điểm đối lập trong một dòng: <strong>Ethernet giải bài tranh chấp bằng cách đổi HÌNH DẠNG (switch); Wi-Fi không đổi được không khí, nên giải bằng GIAO THỨC.</strong> Đó là toàn bộ khác biệt giữa hai slide cuối này.</p>`],

      [48, 'Figure 8.19 — IBM z13 I/O Channel Structure',
        `<p class="y-chinh">🎯 A four-level tree showing how one mainframe organises its I/O. From the top down: <strong>Logical partitions</strong> → <strong>Channel Subsystems</strong> → <strong>Subchannel Sets</strong> → <strong>channels</strong>. The braces on the figure carry the numbers, and those numbers <em>are</em> the slide.</p>
<table>
<tr><th>Level</th><th>The figure's annotation</th><th>What it is</th></tr>
<tr><td>Logical partition</td><td>"≤ 85 partitions per system"; "≤ 15 partitions per channel subsystem"</td><td>An independent virtual machine, each running its own operating system</td></tr>
<tr><td>Channel Subsystem</td><td>"<strong>6 channel subsystems</strong>"</td><td>Step 6 of slide 38 made real: a complete I/O computer, with its own processors and memory</td></tr>
<tr><td>Subchannel Set</td><td>"<strong>4 subchannel sets</strong> per channel subsystem"</td><td>A grouping layer that multiplies the addressable channel space</td></tr>
<tr><td>Channels</td><td>"up to <strong>64k channels</strong> per subchannel set"</td><td>The actual I/O paths to controllers and devices</td></tr>
</table>
<ul>
<li><strong>Why a mainframe needs four levels where your laptop needs none.</strong> Each level solves a different problem: partitions isolate <em>tenants</em>, channel subsystems isolate <em>I/O capacity</em>, subchannel sets extend the <em>address space</em>, channels are the <em>paths</em>. A laptop has one operating system and a handful of devices, so all four collapse into "the PCIe tree".</li>
<li><strong>Look at the partition numbers carefully — they do not multiply.</strong> 6 channel subsystems × 15 partitions each would be 90, but the system ceiling is 85. So the two limits are independent constraints, and a partition can be attached to a channel subsystem in a flexible mapping rather than owning one outright.</li>
<li><strong>This figure is the answer to "what does step 6 of slide 38 look like?"</strong> "The I/O module has a local memory of its own and is, in fact, a computer in its own right" — here that module is drawn six times over, each serving up to fifteen operating systems.</li>
<li><strong>Channel subsystems are why a mainframe's I/O does not steal CPU.</strong> All the device-level work — path selection, retry, error recovery, protocol — runs on the channel subsystem's own processors, not the PUs that run customer workloads. That is the ultimate expression of the chapter's trend: intelligence migrating outward.</li>
<li><strong>Connect to virtualisation.</strong> Logical partitions are hardware-enforced virtual machines, and the reason they scale is that each one gets its own I/O paths rather than sharing a driver stack. CSI106's operating-system view of virtualisation is this figure's software side.</li>
</ul>
<p class="dap-an">✅ Worked capacity: 6 channel subsystems × 4 subchannel sets × 64k channels = 6 × 4 × 65 536 = <strong>1 572 864 channels</strong>, well over one and a half million I/O paths in one machine. Set that against USB's 127 devices per host controller (slide 40) — a factor of about <strong>12 400</strong>. This is what "I/O designed for the machine room" actually means.</p>
<p class="pitfall">⚠️ <strong>Font glitch on the figure:</strong> the braces read "<strong>d</strong> 15 partitions" and "<strong>d</strong> 85 partitions". That "d" is a broken <strong>≤</strong> (less-than-or-equal) symbol, mangled when the slide was exported. Read them as "≤ 15" and "≤ 85"; "d" is not a unit or a variable.</p>`,
        `<p class="y-chinh">🎯 Một cây bốn tầng cho thấy một cỗ máy lớn tổ chức I/O của nó ra sao. Từ trên xuống: <strong>Logical partition</strong> (phân vùng logic) → <strong>Channel Subsystem</strong> (phân hệ kênh) → <strong>Subchannel Set</strong> (tập kênh con) → <strong>kênh</strong>. Mấy cái ngoặc ôm trên hình mang những con số, và chính những con số đó <em>LÀ</em> nội dung slide.</p>
<table>
<tr><th>Tầng</th><th>Chú thích trên hình</th><th>Nó là cái gì</th></tr>
<tr><td>Phân vùng logic</td><td>"≤ 85 phân vùng mỗi hệ thống"; "≤ 15 phân vùng mỗi phân hệ kênh"</td><td>Một máy ảo độc lập, mỗi cái chạy hệ điều hành riêng</td></tr>
<tr><td>Phân hệ kênh</td><td>"<strong>6 phân hệ kênh</strong>"</td><td>Bước 6 của slide 38 hiện thành hình: một máy tính I/O hoàn chỉnh, có bộ xử lý và bộ nhớ riêng</td></tr>
<tr><td>Tập kênh con</td><td>"<strong>4 tập kênh con</strong> mỗi phân hệ kênh"</td><td>Một tầng gộp nhóm để nhân rộng không gian địa chỉ kênh</td></tr>
<tr><td>Kênh</td><td>"tới <strong>64k kênh</strong> mỗi tập kênh con"</td><td>Đường I/O thật sự tới các bộ điều khiển và thiết bị</td></tr>
</table>
<ul>
<li><strong>Vì sao máy lớn cần bốn tầng trong khi laptop của bạn chẳng cần tầng nào.</strong> Mỗi tầng giải một bài khác: phân vùng cách ly <em>KHÁCH THUÊ</em>, phân hệ kênh cách ly <em>NĂNG LỰC I/O</em>, tập kênh con mở rộng <em>KHÔNG GIAN ĐỊA CHỈ</em>, kênh là <em>ĐƯỜNG ĐI</em>. Laptop chỉ có một hệ điều hành và dăm thiết bị, nên cả bốn co lại thành "cái cây PCIe".</li>
<li><strong>Nhìn kỹ con số phân vùng — chúng KHÔNG nhân với nhau.</strong> 6 phân hệ kênh × 15 phân vùng mỗi cái sẽ là 90, nhưng trần hệ thống là 85. Vậy hai giới hạn đó là hai ràng buộc ĐỘC LẬP, và một phân vùng được gán vào phân hệ kênh theo một ánh xạ linh hoạt chứ không sở hữu trọn một cái.</li>
<li><strong>Hình này là lời đáp cho câu "bước 6 của slide 38 trông như thế nào?"</strong> "Module I/O có bộ nhớ cục bộ riêng và thật ra là một máy tính hoàn chỉnh" — ở đây cái module đó được vẽ tới sáu lần, mỗi cái phục vụ tới mười lăm hệ điều hành.</li>
<li><strong>Phân hệ kênh là lý do I/O của máy lớn không ăn CPU.</strong> Toàn bộ việc ở mức thiết bị — chọn đường, thử lại, khôi phục lỗi, giao thức — đều chạy trên bộ xử lý riêng của phân hệ kênh, không phải trên các PU đang chạy tải công việc của khách hàng. Đó là biểu hiện tột cùng của xu hướng cả chương: trí thông minh di cư ra ngoài.</li>
<li><strong>Nối sang ảo hoá.</strong> Phân vùng logic là máy ảo được phần cứng cưỡng chế, và lý do chúng mở rộng được là mỗi cái có đường I/O riêng chứ không dùng chung một chồng trình điều khiển. Góc nhìn ảo hoá từ phía hệ điều hành của CSI106 chính là mặt phần mềm của hình này.</li>
</ul>
<p class="dap-an">✅ Sức chứa tính thật: 6 phân hệ kênh × 4 tập kênh con × 64k kênh = 6 × 4 × 65.536 = <strong>1.572.864 kênh</strong>, tức hơn một triệu rưỡi đường I/O trong một cỗ máy. Đặt cạnh 127 thiết bị mỗi bộ điều khiển chủ của USB (slide 40) — chênh khoảng <strong>12.400 lần</strong>. Đó mới là nghĩa thật của cụm "I/O thiết kế cho phòng máy".</p>
<p class="pitfall">⚠️ <strong>Lỗi font trên hình:</strong> mấy cái ngoặc ghi "<strong>d</strong> 15 partitions" và "<strong>d</strong> 85 partitions". Chữ "d" đó là ký hiệu <strong>≤</strong> (nhỏ hơn hoặc bằng) bị hỏng khi xuất slide. Hãy đọc là "≤ 15" và "≤ 85"; "d" không phải đơn vị cũng không phải biến số.</p>`],

      [49, 'Figure 8.20 — IBM z13 I/O System Structure',
        `<p class="y-chinh">🎯 The physical build behind slide 48's logical tree. Two <strong>Drawers</strong> at the top, each holding <strong>Memory</strong>, six <strong>PU</strong> (processor unit) boxes, two <strong>SC</strong> (system controller) boxes joined by <strong>SMP cables</strong>, and a <strong>PCIe Gen3</strong> block. Below them, a <strong>PCIe I/O drawer</strong> containing four <strong>PCIe Gen3 interconnect</strong> blocks feeding <strong>PCIe switches</strong>, and finally <strong>Fiber Channel controllers</strong> and <strong>OSA Express controllers</strong>. The bandwidths are labelled at each level.</p>
<table>
<tr><th>Level in the figure</th><th>Labelled bandwidth</th><th>Function</th></tr>
<tr><td>Drawer → PCIe I/O drawer</td><td><strong>16 GB/s, PCIe Gen3 ×16</strong></td><td>The trunk out of the compute drawer</td></tr>
<tr><td>Interconnect → switch</td><td><strong>4 GB/s, PCIe Gen2 ×8</strong></td><td>First fan-out stage</td></tr>
<tr><td>Switch → controller</td><td><strong>2 GB/s, PCIe Gen2 ×4</strong></td><td>Second fan-out stage</td></tr>
<tr><td>Controller → device level</td><td><strong>1 GB/s, PCIe Gen1 ×4</strong></td><td>The leaves</td></tr>
<tr><td>Endpoints</td><td>—</td><td><strong>Fiber Channel</strong> (storage) and <strong>OSA Express</strong> (networking) controllers</td></tr>
</table>
<ul>
<li><strong>Read the bandwidth ladder: 16 → 4 → 2 → 1 GB/s.</strong> Each level fans out and each link gets narrower, exactly like the memory hierarchy of Ch.4 but for I/O. The ratios (÷4, ÷2, ÷2) tell you the designers expected devices to be only partly busy — classic statistical multiplexing.</li>
<li><strong>Two drawers means the machine is built to grow and to survive.</strong> The SMP cables between the SC blocks join drawers into one coherent system. Both drawers reach the same PCIe I/O drawer, so a failed path is not a failed machine — availability is designed in, not added.</li>
<li><strong>The two controller types are the two workloads of the whole chapter.</strong> Fiber Channel is <em>storage</em> I/O (Ch.7's disks, at the end of a fabric); OSA Express is <em>network</em> I/O (slide 46's Ethernet). The mainframe does not blend them — it gives each its own controller type.</li>
<li><strong>Notice PCIe appears at every single level.</strong> The same standard that slide 45 dismissed in one line is the entire backbone here, in three generations at once (Gen3 for the trunk, Gen2 mid-tier, Gen1 at the leaves). Mixing generations is normal: a link runs at the speed of its slower end.</li>
<li><strong>Together with slide 48 this is the chapter's conclusion in hardware.</strong> Slide 48 was the logical model (partitions, channels); slide 49 is the metal. Both say the same thing: at the high end, I/O is a computer of its own, attached to the compute complex by a fabric.</li>
</ul>
<p class="dap-an">✅ Worked check of the fan-out. One 16 GB/s Gen3 ×16 trunk feeds interconnects that hand out 4 GB/s Gen2 ×8 links: 16 ÷ 4 = <strong>4 such links per trunk at full rate</strong>. Each 4 GB/s link splits into 2 GB/s ×4 links (2 per link), and each of those into 1 GB/s Gen1 ×4 (2 per link). So one trunk can sustain 4 × 2 × 2 = <strong>16 leaf links at 1 GB/s</strong> with no oversubscription — and far more if you accept that not every device transmits at once, which is the normal design assumption.</p>
<p class="meo">💡 Remember the pair as "<strong>48 is the map, 49 is the machine</strong>". If an exam asks about partitions, channel subsystems or subchannel sets, that is Figure 8.19; if it asks about drawers, PCIe generations or controller types, that is Figure 8.20.</p>`,
        `<p class="y-chinh">🎯 Phần lắp ráp vật lý nằm sau cái cây logic của slide 48. Trên cùng là hai <strong>Drawer</strong> (ngăn kéo), mỗi cái chứa <strong>Memory</strong>, sáu hộp <strong>PU</strong> (processor unit — đơn vị xử lý), hai hộp <strong>SC</strong> (system controller) nối nhau bằng <strong>cáp SMP</strong>, và một khối <strong>PCIe Gen3</strong>. Bên dưới là một <strong>PCIe I/O drawer</strong> chứa bốn khối <strong>PCIe Gen3 interconnect</strong> dẫn xuống các <strong>PCIe switch</strong>, và cuối cùng là các <strong>bộ điều khiển Fiber Channel</strong> và <strong>OSA Express</strong>. Băng thông được ghi nhãn ở từng tầng.</p>
<table>
<tr><th>Tầng trên hình</th><th>Băng thông ghi nhãn</th><th>Chức năng</th></tr>
<tr><td>Drawer → PCIe I/O drawer</td><td><strong>16 GB/s, PCIe Gen3 ×16</strong></td><td>Thân chính chạy ra khỏi ngăn tính toán</td></tr>
<tr><td>Interconnect → switch</td><td><strong>4 GB/s, PCIe Gen2 ×8</strong></td><td>Tầng toả ra thứ nhất</td></tr>
<tr><td>Switch → bộ điều khiển</td><td><strong>2 GB/s, PCIe Gen2 ×4</strong></td><td>Tầng toả ra thứ hai</td></tr>
<tr><td>Bộ điều khiển → mức thiết bị</td><td><strong>1 GB/s, PCIe Gen1 ×4</strong></td><td>Các lá</td></tr>
<tr><td>Điểm cuối</td><td>—</td><td>Bộ điều khiển <strong>Fiber Channel</strong> (lưu trữ) và <strong>OSA Express</strong> (mạng)</td></tr>
</table>
<ul>
<li><strong>Đọc cái thang băng thông: 16 → 4 → 2 → 1 GB/s.</strong> Mỗi tầng toả rộng ra và mỗi liên kết hẹp lại, y hệt phân cấp bộ nhớ của Ch.4 nhưng dành cho I/O. Các tỉ số (÷4, ÷2, ÷2) cho biết người thiết kế đoán rằng thiết bị chỉ bận một phần thời gian — ghép kênh theo thống kê kinh điển.</li>
<li><strong>Hai ngăn kéo nghĩa là cỗ máy được dựng để LỚN LÊN và để SỐNG SÓT.</strong> Cáp SMP giữa các khối SC gộp các ngăn thành một hệ thống nhất quán. Cả hai ngăn đều với tới cùng một PCIe I/O drawer, nên một đường hỏng không làm hỏng cả máy — tính sẵn sàng được thiết kế vào, chứ không phải gắn thêm.</li>
<li><strong>Hai loại bộ điều khiển chính là hai tải công việc của cả chương.</strong> Fiber Channel là I/O <em>LƯU TRỮ</em> (những cái đĩa của Ch.7, ở cuối một fabric); OSA Express là I/O <em>MẠNG</em> (Ethernet của slide 46). Máy lớn không trộn chúng lại — nó cho mỗi loại một kiểu bộ điều khiển riêng.</li>
<li><strong>Để ý PCIe xuất hiện ở TỪNG tầng một.</strong> Chính cái chuẩn bị slide 45 gạt đi bằng một dòng lại là xương sống của cả hình này, với ba thế hệ cùng lúc (Gen3 cho thân, Gen2 cho tầng giữa, Gen1 ở lá). Trộn các thế hệ là bình thường: một liên kết chạy theo tốc độ của đầu chậm hơn.</li>
<li><strong>Cùng với slide 48, đây là kết luận của chương bằng phần cứng.</strong> Slide 48 là mô hình logic (phân vùng, kênh); slide 49 là sắt thép. Cả hai nói cùng một điều: ở phân khúc cao cấp, I/O là một máy tính của riêng nó, gắn vào khối tính toán qua một fabric.</li>
</ul>
<p class="dap-an">✅ Kiểm phép toả ra. Một thân Gen3 ×16 16 GB/s nuôi các interconnect phát ra liên kết Gen2 ×8 4 GB/s: 16 ÷ 4 = <strong>4 liên kết như vậy mỗi thân nếu chạy hết tốc độ</strong>. Mỗi liên kết 4 GB/s tách thành các liên kết ×4 2 GB/s (2 cái mỗi liên kết), và mỗi cái đó lại tách thành Gen1 ×4 1 GB/s (2 cái mỗi liên kết). Vậy một thân gánh nổi 4 × 2 × 2 = <strong>16 liên kết lá ở 1 GB/s</strong> mà không hề bán vượt — và gánh được nhiều hơn nữa nếu chấp nhận rằng không phải thiết bị nào cũng truyền cùng lúc, vốn là giả định thiết kế bình thường.</p>
<p class="meo">💡 Nhớ cặp đôi này là "<strong>48 là BẢN ĐỒ, 49 là CỖ MÁY</strong>". Đề hỏi về phân vùng, phân hệ kênh hay tập kênh con thì đó là Figure 8.19; hỏi về ngăn kéo, thế hệ PCIe hay loại bộ điều khiển thì đó là Figure 8.20.</p>`],

      [50, 'Summary — Chapter 8, Input/Output',
        `<p class="y-chinh">🎯 The chapter's own checklist, in two columns. Left, under "Chapter 8": <strong>External devices · I/O modules · Programmed I/O · Interrupt-driven I/O · Direct memory access</strong>. Right, under "Input/Output": <strong>Direct Cache Access · I/O channels and processors · External interconnection standards · IBM zEnterprise EC12 I/O structure</strong>. Nine items; if you can speak for two minutes on each, you know the chapter.</p>
<table>
<tr><th>Summary item</th><th>Slides</th><th>The one thing to be able to say</th></tr>
<tr><td>External devices</td><td>3–5</td><td>Three categories: human readable, machine readable, communication</td></tr>
<tr><td>I/O modules</td><td>2, 6–7</td><td>They exist because devices differ from the CPU in speed, format and timing</td></tr>
<tr><td>Programmed I/O</td><td>8–14</td><td>CPU copies and CPU waits; memory-mapped versus isolated addressing</td></tr>
<tr><td>Interrupt-driven I/O</td><td>15–23</td><td>CPU copies but does not wait; four ways to identify the interrupting device</td></tr>
<tr><td>Direct memory access</td><td>24–30</td><td>CPU neither copies nor waits; <strong>cycle stealing</strong>, one interrupt per block, three configurations</td></tr>
<tr><td>Direct Cache Access</td><td>31–37</td><td>DMA delivers to DRAM and forces a cache miss per packet; DDIO delivers into the LLC instead</td></tr>
<tr><td>I/O channels and processors</td><td>38–39</td><td>Steps 5 and 6 of the evolution; selector versus multiplexor</td></tr>
<tr><td>External interconnection standards</td><td>40–47</td><td>USB, FireWire, SCSI, Thunderbolt, InfiniBand, PCIe/SATA, Ethernet, Wi-Fi — and the industry-wide swing from parallel buses to serial links</td></tr>
<tr><td>IBM z-series I/O structure</td><td>48–49</td><td>Partitions → channel subsystems → subchannel sets → channels; and the PCIe drawer that implements it</td></tr>
</table>
<ul>
<li><strong>The chapter has one spine and everything hangs on it: who moves the data, and does the CPU wait?</strong> Programmed I/O (CPU moves, CPU waits) → interrupt-driven (CPU moves, does not wait) → DMA (controller moves) → channel (controller runs a program) → I/O processor (controller is a computer). Five answers, one question.</li>
<li><strong>The three exam-proof numbers from this half.</strong> Cycle stealing = device rate ÷ bus bandwidth (12,5 % for the worked case on slide 26). DMA versus interrupts on 4 KB = <strong>1024 interrupts against 1</strong>, roughly <strong>931×</strong> less CPU work. DMA configurations = <strong>2 bus cycles per word</strong> for detached, <strong>1</strong> for integrated and for the I/O-bus form.</li>
<li><strong>The one conceptual trap.</strong> Cycle stealing suspends the processor for a bus cycle; it does <em>not</em> interrupt it. Everything else about DMA follows from that distinction.</li>
<li><strong>Where the chapter connects outward.</strong> Ch.3 gave the bus and the interrupt mechanism that DMA arbitrates for. Ch.4 and Ch.5 supply the cache coherence that DCA both exploits and complicates. Ch.7's disks and this chapter's SATA/SAS ports are two halves of storage. CSI106's device drivers are the software on top of every one of these slides.</li>
<li><strong>What to revise first if time is short.</strong> Table 8.1 with the full three-technique comparison (slide 26), Figure 8.13's breakpoints, Figure 8.14's three configurations, and the six evolution steps. Those four carry most of the marks.</li>
</ul>
<p class="pitfall">⚠️ <strong>The summary names the wrong machine.</strong> It lists "IBM <strong>zEnterprise EC12</strong> I/O structure", but Figures 8.19 and 8.20 in this very chapter are both labelled <strong>IBM z13</strong>. The summary slide was carried over from an earlier edition and not updated with the figures. The material you are responsible for is the <strong>z13</strong> structure of slides 48–49.</p>
<p class="meo">💡 Self-test before the exam: cover this slide and try to name the nine items yourself. Then for each one, state a number — three device categories, four I/O commands, four device-identification techniques, three DMA configurations, six evolution steps, two channel types, eight interconnect standards. If the numbers come back, the content comes with them.</p>`,
        `<p class="y-chinh">🎯 Danh sách kiểm của chính chương, chia hai cột. Bên trái, dưới tiêu đề "Chapter 8": <strong>External devices · I/O modules · Programmed I/O · Interrupt-driven I/O · Direct memory access</strong>. Bên phải, dưới "Input/Output": <strong>Direct Cache Access · I/O channels and processors · External interconnection standards · IBM zEnterprise EC12 I/O structure</strong>. Chín mục; nói được hai phút về mỗi mục là bạn nắm chương này.</p>
<table>
<tr><th>Mục tóm tắt</th><th>Slide</th><th>Một điều phải nói ra được</th></tr>
<tr><td>Thiết bị ngoài</td><td>3–5</td><td>Ba nhóm: người đọc được, máy đọc được, truyền thông</td></tr>
<tr><td>Module I/O</td><td>2, 6–7</td><td>Chúng tồn tại vì thiết bị khác CPU về tốc độ, khuôn dạng và nhịp thời gian</td></tr>
<tr><td>I/O bằng chương trình</td><td>8–14</td><td>CPU chép và CPU chờ; đánh địa chỉ kiểu ánh xạ bộ nhớ so với kiểu tách riêng</td></tr>
<tr><td>I/O bằng ngắt</td><td>15–23</td><td>CPU chép nhưng không chờ; bốn cách xác định thiết bị nào gây ngắt</td></tr>
<tr><td>DMA</td><td>24–30</td><td>CPU không chép cũng không chờ; <strong>ăn trộm chu kỳ</strong>, một ngắt mỗi khối, ba cấu hình</td></tr>
<tr><td>Direct Cache Access</td><td>31–37</td><td>DMA đổ vào DRAM nên ép mỗi gói một lần trượt cache; DDIO đổ thẳng vào LLC</td></tr>
<tr><td>Kênh I/O và bộ xử lý I/O</td><td>38–39</td><td>Bước 5 và 6 của tiến hoá; selector so với multiplexor</td></tr>
<tr><td>Chuẩn ghép nối ngoài</td><td>40–47</td><td>USB, FireWire, SCSI, Thunderbolt, InfiniBand, PCIe/SATA, Ethernet, Wi-Fi — và cú xoay trục của cả ngành từ bus song song sang liên kết nối tiếp</td></tr>
<tr><td>Cấu trúc I/O dòng IBM z</td><td>48–49</td><td>Phân vùng → phân hệ kênh → tập kênh con → kênh; và cái ngăn PCIe hiện thực hoá nó</td></tr>
</table>
<ul>
<li><strong>Chương có MỘT xương sống và mọi thứ treo lên đó: ai chuyển dữ liệu, và CPU có phải chờ không?</strong> I/O bằng chương trình (CPU chuyển, CPU chờ) → bằng ngắt (CPU chuyển, không chờ) → DMA (bộ điều khiển chuyển) → kênh (bộ điều khiển chạy hẳn một chương trình) → bộ xử lý I/O (bộ điều khiển là một máy tính). Năm câu trả lời, một câu hỏi.</li>
<li><strong>Ba con số chắc điểm của nửa sau này.</strong> Ăn trộm chu kỳ = tốc độ thiết bị ÷ băng thông bus (12,5 % cho ca đã giải ở slide 26). DMA so với ngắt trên 4 KB = <strong>1024 lần ngắt so với 1</strong>, CPU làm ít đi khoảng <strong>931 lần</strong>. Ba cấu hình DMA = <strong>2 chu kỳ bus mỗi từ</strong> cho kiểu rời, <strong>1</strong> cho kiểu tích hợp và kiểu có bus I/O riêng.</li>
<li><strong>Một cái bẫy về khái niệm.</strong> Ăn trộm chu kỳ TẠM DỪNG bộ xử lý một nhịp bus; nó <em>KHÔNG</em> ngắt bộ xử lý. Mọi thứ còn lại của DMA đều suy ra từ phân biệt đó.</li>
<li><strong>Chương nối ra ngoài ở đâu.</strong> Ch.3 cho cái bus và cơ chế ngắt mà DMA phải tranh quyền. Ch.4 và Ch.5 cung cấp phần nhất quán cache mà DCA vừa khai thác vừa làm phức tạp thêm. Đĩa của Ch.7 và cổng SATA/SAS của chương này là hai nửa của lưu trữ. Trình điều khiển thiết bị của CSI106 là phần mềm nằm trên mọi slide này.</li>
<li><strong>Thiếu thời gian thì ôn gì trước.</strong> Table 8.1 cùng bảng so ba kỹ thuật đầy đủ (slide 26), các điểm dừng của Figure 8.13, ba cấu hình của Figure 8.14, và sáu bước tiến hoá. Bốn thứ đó cõng phần lớn số điểm.</li>
</ul>
<p class="pitfall">⚠️ <strong>Slide tóm tắt GỌI SAI TÊN MÁY.</strong> Nó liệt kê "cấu trúc I/O của IBM <strong>zEnterprise EC12</strong>", trong khi Figure 8.19 và 8.20 của chính chương này đều ghi <strong>IBM z13</strong>. Slide tóm tắt được bê từ bản sách cũ sang mà không cập nhật theo hình. Phần bạn phải chịu trách nhiệm là cấu trúc <strong>z13</strong> ở slide 48–49.</p>
<p class="meo">💡 Tự kiểm trước khi thi: che slide này lại và tự gọi tên chín mục. Rồi với mỗi mục, nêu một CON SỐ — ba nhóm thiết bị, bốn loại lệnh I/O, bốn cách xác định thiết bị, ba cấu hình DMA, sáu bước tiến hoá, hai loại kênh, tám chuẩn ghép nối. Con số quay lại được thì nội dung theo về cùng.</p>`],

    ]),
  ].join('\n'),
};
