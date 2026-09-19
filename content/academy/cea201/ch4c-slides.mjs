/**
 * CEA201 · Chương 4 (theo syllabus trường) — Cache Memory, NỬA SAU của deck cea5: slide 23–43.
 * Deck 'cea5' (CEA5 = CH05-COA11e.pptx), 43 slide, ảnh đã render lên CDN
 * images/academy/CEA201/v1/cea5/NNN.webp.
 *
 * Bộ slide CHÍNH HÃNG đi kèm Stallings, "Computer Organization and Architecture:
 * Designing for Performance", 11th Edition Global Edition (Pearson, 2022), tỉ lệ 4:3.
 * Môn trên web gom Ch.4 + Ch.5 (11e) thành "Chương 4 — Cache Memory" theo cách đánh số
 * của syllabus trường (bản 9th ed) — nên file đặt tên ch4c.
 *
 * Nội dung bám ĐÚNG chữ trích từ /tmp/cea201-text/cea5.txt. Các slide chỉ có tiêu đề +
 * hình/bảng (23, 24, 27, 31, 33, 37, 39, 41, 42, 43) đã được ĐỌC THẲNG TỪ ẢNH RENDER
 * để lấy đúng từng nhãn, từng con số trong sơ đồ.
 *
 * ⚠️ MỌI con số trong bài đã được KIỂM BẰNG CHƯƠNG TRÌNH CHẠY THẬT (python3) trước khi viết:
 *   · Figure 5.14 (slide 23): tách nhị phân 7 địa chỉ của hình (000000, 160000, 160004,
 *     16339C, 167FFC, FFFFF8, FFFFFC) ra Tag|Set|Word 9|13|2 — khớp 100% với mọi nhãn hex
 *     trên hình, kể cả set 0CE7 và hai set 1FFE/1FFF.
 *   · Bài 2 (4 GB · 64 KB · line 16 B · 4 đường · 0xABCD1234) và ba biến thể trực tiếp /
 *     liên kết hoàn toàn của cùng cache đó — tính lại toàn bộ số bit và tổng bit tag.
 *   · Bài 3 (16 MB · 8 KB · line 32 B · 8 đường · 0x9A2C7F).
 *   · Bài 4 NGƯỢC (1 MB · 4 KB · line 8 B · 2 đường; cho set 0x0C1 + tag 0x5B → dựng lại
 *     dải địa chỉ 0x2DE08–0x2DE0F) — kiểm hai chiều: dựng lên rồi tách lại.
 *   · Thuật toán thay thế (slide 26): chạy MÔ PHỎNG thật trên dãy
 *     0,2,5,0,4,1,5,0,3,1,0,5,2,1,3,2 với cache 4 đường. Kết quả đo:
 *     LRU 8 trượt · LFU 9 · FIFO 10 · NGẪU NHIÊN trung bình 9,4586 trượt trên
 *     1.000.000 lượt chạy · OPT (Belady, chỉ để đối chiếu) 7. Mọi ô trong ba bảng
 *     chạy tay đều là output của chương trình, KHÔNG tính nhẩm.
 *   · Số liệu cache của máy đang viết bài: đo bằng `sysctl` trên chính máy (Apple M1 Max) —
 *     xem slide 32 và 34.
 *
 * Những chỗ SLIDE GỐC SAI hoặc dễ gây hiểu nhầm — đã nêu rõ trong bài, KHÔNG im lặng chép
 * lại và KHÔNG tự ý sửa slide:
 *   · slide 41 (Table 5.6), dòng cuối "Set-Associative with Way Prediction": ô cột "Time for
 *     miss" in là "T= = t_rl + t_ct". Ký hiệu "T=" là LỖI GÕ, phải là t_miss.
 *   · slide 42 (Table 5.7): bảng DÀI HƠN khung slide — dòng cuối "Wider Busses" (có trong
 *     file .pptx) bị cắt mất khỏi vùng nhìn thấy, và dòng "Victim Cache" bị cắt một nửa.
 *   · slide 42, nhãn hàng "Cache Unity" là cách gọi lạ; ý của nó là cache THỐNG NHẤT hay
 *     TÁCH RỜI (unified/split), không phải "tính đồng nhất".
 *   · slide 36 (Table 5.4): hai dòng cuối cùng của mỗi cụm có ô "Problem" TRỐNG — đó là dòng
 *     nối tiếp của vấn đề ngay phía trên, không phải ô bị mất dữ liệu.
 *   · slide 23 (Figure 5.14): nhãn "16 kline Cache" nghĩa là 16 K DÒNG (16384 dòng), KHÔNG
 *     phải 16 kB. Dung lượng dữ liệu thật của cache trong hình là 16384 × 4 B = 64 kB.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea5';

export default {
  title: '4.0c — Slide by slide: Associative and set-associative mapping, replacement and write policies (slides 23–43)|||4.0c — Slide bài giảng: Ánh xạ liên kết & liên kết theo tập, thuật toán thay thế và chính sách ghi (slide 23–43)',
  slug: 'cea201-4-0c-slides-set-associative-thay-the-ghi',
  type: 'DOCUMENT',
  description: 'Nửa sau chương Cache Memory của CEA201 (slide 23–43 bộ slide chính hãng Stallings 11th Edition) — phần ĐƯỢC HỎI NHIỀU NHẤT trong đề thi. Đi từ ví dụ ánh xạ liên kết theo tập hai đường của Figure 5.14, dựng bảng so sánh trọn vẹn ba kiểu ánh xạ (trực tiếp · liên kết hoàn toàn · liên kết theo tập k đường), giải bốn bài chia địa chỉ Tag|Set|Word bằng nhị phân kể cả một bài NGƯỢC, chạy tay bốn thuật toán thay thế (LRU · FIFO · LFU · ngẫu nhiên) trên cùng một dãy truy cập bằng bảng từng bước, rồi tới chính sách ghi (write-through/write-back, write-allocate/no-write-allocate), vấn đề nhất quán cache khi nhiều lõi, kích thước dòng, cache nhiều mức và cache tách rời lệnh/dữ liệu, chính sách bao hàm, cho tới mô hình thời gian cache và bảng kỹ thuật cải thiện hiệu năng. Mọi con số đã được kiểm bằng chương trình chạy thật, kể cả ba chỗ slide gốc in sai.',
  content: [
    walkHead(D, 23, 43),
    walk(D, [

      [23, 'Figure 5.14 — Two-Way Set-Associative Mapping Example',
        `<p class="y-chinh">🎯 The single most exam-relevant figure in the whole chapter. A 16 MB main memory and a 16 K-line, two-way set-associative cache, and the address split it forces: <strong>Tag 9 bits | Set 13 bits | Word 2 bits</strong>. Every set-associative question you will ever be asked is this figure with different numbers.</p>
<p class="nhan">Step 1 — where every field width comes from</p>
<table>
<tr><th>Quantity</th><th>Given / derived</th><th>Bits</th></tr>
<tr><td>Main memory</td><td>16 MB = 2<sup>24</sup> bytes</td><td>address = <strong>24 bits</strong></td></tr>
<tr><td>Line (block) size</td><td>4 bytes = one 32-bit word</td><td>Word = log<sub>2</sub>4 = <strong>2 bits</strong></td></tr>
<tr><td>Cache lines</td><td>16 K lines = 16384 = 2<sup>14</sup></td><td>—</td></tr>
<tr><td>Associativity</td><td><em>k</em> = 2 lines per set</td><td>—</td></tr>
<tr><td><strong>Number of SETS</strong></td><td><em>v</em> = 16384 ÷ 2 = 8192 = 2<sup>13</sup></td><td>Set = <strong>13 bits</strong></td></tr>
<tr><td>Tag</td><td>24 − 13 − 2</td><td><strong>9 bits</strong></td></tr>
</table>
<p class="nhan">Step 2 — the figure's own addresses, split by machine</p>
<table>
<tr><th>Address (hex)</th><th>Address (binary, 24 bits)</th><th>Tag</th><th>Set</th><th>Word</th><th>Data on the slide</th></tr>
<tr><td>000000</td><td>000000000 0000000000000 00</td><td>000</td><td>0000</td><td>00</td><td>13579246</td></tr>
<tr><td>160000</td><td>000101100 0000000000000 00</td><td>02C</td><td>0000</td><td>00</td><td>77777777</td></tr>
<tr><td>160004</td><td>000101100 0000000000001 00</td><td>02C</td><td>0001</td><td>00</td><td>11235813</td></tr>
<tr><td>16339C</td><td>000101100 0110011100111 00</td><td>02C</td><td>0CE7</td><td>00</td><td>FEDCBA98</td></tr>
<tr><td>167FFC</td><td>000101100 1111111111111 00</td><td>02C</td><td>1FFF</td><td>00</td><td>12345678</td></tr>
<tr><td>FFFFF8</td><td>111111111 1111111111110 00</td><td>1FF</td><td>1FFE</td><td>00</td><td>11223344</td></tr>
<tr><td>FFFFFC</td><td>111111111 1111111111111 00</td><td>1FF</td><td>1FFF</td><td>00</td><td>24682468</td></tr>
</table>
<ul>
<li><strong>Look at set 0000 and set 1FFF.</strong> Set 0000 holds two blocks at once — tag 000 (13579246) and tag 02C (77777777). Under <em>direct</em> mapping those two would have fought over one line and one of them would have been evicted. Two ways = two tenants per set. That is the entire point of set-associative mapping in one picture.</li>
<li><strong>Set 1FFF is the same story with different tags</strong> — tag 02C (12345678) beside tag 1FF (24682468). Notice the tags in one set need not be related in any way.</li>
<li><strong>Why the tag grew from 8 bits (direct) to 9.</strong> Halving the number of "buckets" (16384 lines → 8192 sets) costs one bit of Set, and that bit has to be stored somewhere — it moves into the Tag. Associativity is literally paid for in tag bits.</li>
<li><strong>Comparators.</strong> On a lookup the hardware indexes the set with the 13 Set bits, then compares the 9 Tag bits against <strong>both</strong> tags in that set, in parallel. Two comparators, not 16384.</li>
<li><strong>Read the figure's own footnote:</strong> "Memory address values are in binary representation; other values are in hexadecimal." The left column is binary, everything else is hex — mixing them up is the fastest way to get a wrong answer.</li>
</ul>
<p class="nhan">The three mapping functions, side by side (Table 5.3 turned into numbers)</p>
<table>
<tr><th></th><th>Direct</th><th>Fully associative</th><th>Set-associative, k-way</th></tr>
<tr><td>Address split</td><td>Tag | <strong>Line</strong> | Word</td><td>Tag | Word (no index)</td><td>Tag | <strong>Set</strong> | Word</td></tr>
<tr><td>Index bits</td><td>log<sub>2</sub>(number of LINES)</td><td>0</td><td>log<sub>2</sub>(number of SETS) = log<sub>2</sub>(m/k)</td></tr>
<tr><td>A block may live in…</td><td>exactly 1 line</td><td>any line</td><td>any of the k lines of 1 set</td></tr>
<tr><td>Comparators needed</td><td><strong>1</strong></td><td><strong>m</strong> (all lines, needs CAM)</td><td><strong>k</strong></td></tr>
<tr><td>Hardware cost</td><td>lowest</td><td>highest (CAM ≈ 60% larger than SRAM — slide 16)</td><td>tunable by k</td></tr>
<tr><td>Conflict misses</td><td>worst — two hot blocks with the same index thrash</td><td>none (only capacity misses)</td><td>rare once k ≥ 4</td></tr>
<tr><td>Replacement algorithm</td><td>not needed — no choice</td><td>needed, over all m lines</td><td>needed, within one set of k</td></tr>
<tr><td>Where it is used in a real CPU</td><td>a few large L3 slices; historic L1s</td><td>TLBs, victim caches, small fully-associative buffers</td><td><strong>almost every L1/L2/L3 today</strong> (typically 4–16 way)</td></tr>
</table>
<p class="nhan">Worked problem 1 — verify the figure yourself</p>
<p>Address <code>16339C</code>, 16 MB memory, 16 K-line 2-way cache, 4-byte lines. Which set, which tag?</p>
<p>16339C<sub>16</sub> = 0001 0110 0011 0011 1001 1100<sub>2</sub>. Peel from the RIGHT: last 2 bits <code>00</code> = Word. Next 13 bits <code>0110011100111</code> = 0CE7<sub>16</sub> = Set. The remaining 9 bits on the left <code>000101100</code> = 02C<sub>16</sub> = Tag.</p>
<p class="dap-an">✅ Answer: Set = <strong>0CE7</strong>, Tag = <strong>02C</strong>, Word = 0 — exactly the row the slide draws for FEDCBA98. Verified by program against all seven addresses in the figure.</p>
<p class="nhan">Worked problem 2 — a 32-bit machine (the standard exam shape)</p>
<p>4 GB main memory, 64 kB cache, 16-byte lines, <strong>4-way</strong> set-associative. Split address <code>0xABCD1234</code>.</p>
<ul>
<li>4 GB = 2<sup>32</sup> → address = 32 bits. Line = 16 B = 2<sup>4</sup> → <strong>Word = 4 bits</strong>.</li>
<li>Lines = 64 kB ÷ 16 B = 4096. Sets = 4096 ÷ 4 = <strong>1024</strong> = 2<sup>10</sup> → <strong>Set = 10 bits</strong>.</li>
<li>Tag = 32 − 10 − 4 = <strong>18 bits</strong>.</li>
<li>0xABCD1234 = 1010 1011 1100 1101 0001 0010 0011 0100.</li>
</ul>
<table>
<tr><th>Field</th><th>Bits (from the binary above)</th><th>Value</th></tr>
<tr><td>Tag (18)</td><td>101010111100110100</td><td>0x2AF34 = 175924</td></tr>
<tr><td>Set (10)</td><td>0100100011</td><td>0x123 = 291</td></tr>
<tr><td>Word (4)</td><td>0100</td><td>4</td></tr>
</table>
<p class="dap-an">✅ Answer: <strong>Set 291 (0x123), Tag 0x2AF34, byte 4 inside the line.</strong> The same 64 kB cache organised the other two ways: <em>direct</em> → Tag 16 | Line 12 | Word 4, tag 0xABCD, line 0x123, only 1 comparator, 4096×16 = 65 536 tag bits stored. <em>Fully associative</em> → Tag 28 | Word 4, tag 0xABCD123, 4096 comparators, 4096×28 = 114 688 tag bits. The 4-way version sits between: 4 comparators, 4096×18 = 73 728 tag bits. All four figures computed by program.</p>
<p class="meo">💡 Memorise the peeling order, not the formulas: <strong>Word from the right, Set next, Tag is whatever is left.</strong> And Set bits = log<sub>2</sub>(number of SETS) = log<sub>2</sub>(lines ÷ k).</p>
<p class="pitfall">⚠️⚠️ The number-one mistake in CEA201 exams: computing Set bits as log<sub>2</sub>(number of <em>lines</em>). That is the DIRECT-mapped rule. In a k-way cache you must divide by k first. In problem 2, log<sub>2</sub>(4096) = 12 is wrong; log<sub>2</sub>(4096/4) = log<sub>2</sub>(1024) = 10 is right — and the two answers differ in the tag by 2 bits, so every subsequent number is wrong too.</p>
<p class="pitfall">⚠️ Second trap, straight off this slide: the label "16 kline Cache" means <strong>16 K LINES</strong>, not 16 kB. Data capacity here is 16384 × 4 B = <strong>64 kB</strong>. Read "line" as a unit of count, never of bytes.</p>`,
        `<p class="y-chinh">🎯 Hình quan trọng nhất cả chương đối với đề thi. Bộ nhớ chính 16 MB, cache 16 K dòng liên kết theo tập HAI ĐƯỜNG, và cách chia địa chỉ mà nó bắt buộc: <strong>Tag 9 bit | Set 13 bit | Word 2 bit</strong>. Mọi câu hỏi set-associative bạn từng gặp đều là hình này với con số khác.</p>
<p class="nhan">Bước 1 — từng độ rộng trường ở đâu ra</p>
<table>
<tr><th>Đại lượng</th><th>Cho / suy ra</th><th>Số bit</th></tr>
<tr><td>Bộ nhớ chính</td><td>16 MB = 2<sup>24</sup> byte</td><td>địa chỉ = <strong>24 bit</strong></td></tr>
<tr><td>Kích thước dòng (khối)</td><td>4 byte = một từ 32 bit</td><td>Word = log<sub>2</sub>4 = <strong>2 bit</strong></td></tr>
<tr><td>Số dòng cache</td><td>16 K dòng = 16384 = 2<sup>14</sup></td><td>—</td></tr>
<tr><td>Độ liên kết</td><td><em>k</em> = 2 dòng mỗi tập</td><td>—</td></tr>
<tr><td><strong>SỐ TẬP</strong></td><td><em>v</em> = 16384 ÷ 2 = 8192 = 2<sup>13</sup></td><td>Set = <strong>13 bit</strong></td></tr>
<tr><td>Tag</td><td>24 − 13 − 2</td><td><strong>9 bit</strong></td></tr>
</table>
<p class="nhan">Bước 2 — chính những địa chỉ trong hình, tách bằng máy</p>
<table>
<tr><th>Địa chỉ (hex)</th><th>Nhị phân (24 bit)</th><th>Tag</th><th>Set</th><th>Word</th><th>Dữ liệu trên slide</th></tr>
<tr><td>000000</td><td>000000000 0000000000000 00</td><td>000</td><td>0000</td><td>00</td><td>13579246</td></tr>
<tr><td>160000</td><td>000101100 0000000000000 00</td><td>02C</td><td>0000</td><td>00</td><td>77777777</td></tr>
<tr><td>160004</td><td>000101100 0000000000001 00</td><td>02C</td><td>0001</td><td>00</td><td>11235813</td></tr>
<tr><td>16339C</td><td>000101100 0110011100111 00</td><td>02C</td><td>0CE7</td><td>00</td><td>FEDCBA98</td></tr>
<tr><td>167FFC</td><td>000101100 1111111111111 00</td><td>02C</td><td>1FFF</td><td>00</td><td>12345678</td></tr>
<tr><td>FFFFF8</td><td>111111111 1111111111110 00</td><td>1FF</td><td>1FFE</td><td>00</td><td>11223344</td></tr>
<tr><td>FFFFFC</td><td>111111111 1111111111111 00</td><td>1FF</td><td>1FFF</td><td>00</td><td>24682468</td></tr>
</table>
<ul>
<li><strong>Nhìn tập 0000 và tập 1FFF.</strong> Tập 0000 chứa CÙNG LÚC hai khối — tag 000 (13579246) và tag 02C (77777777). Với ánh xạ TRỰC TIẾP thì hai khối đó đã tranh nhau một dòng và một đứa bị đuổi. Hai đường = hai chỗ trong một tập. Toàn bộ lý do tồn tại của ánh xạ liên kết theo tập nằm gọn trong bức ảnh này.</li>
<li><strong>Tập 1FFF cũng chuyện đó với tag khác</strong> — tag 02C (12345678) nằm cạnh tag 1FF (24682468). Để ý: các tag trong cùng một tập KHÔNG cần liên quan gì đến nhau.</li>
<li><strong>Vì sao tag phình từ 8 bit (trực tiếp) lên 9.</strong> Giảm nửa số "ngăn" (16384 dòng → 8192 tập) làm mất một bit Set, mà bit đó phải nằm đâu đó — nó dời sang Tag. Độ liên kết được TRẢ GIÁ đúng bằng số bit tag.</li>
<li><strong>Bộ so sánh.</strong> Khi tra, phần cứng dùng 13 bit Set để chọn tập, rồi so 9 bit Tag với <strong>CẢ HAI</strong> tag trong tập đó, song song. Hai bộ so sánh, không phải 16384.</li>
<li><strong>Đọc kỹ ghi chú của chính hình:</strong> "Giá trị địa chỉ bộ nhớ ở dạng nhị phân; các giá trị khác ở dạng thập lục phân". Cột trái là nhị phân, còn lại là hex — lẫn hai thứ đó là cách sai nhanh nhất.</li>
</ul>
<p class="nhan">Ba kiểu ánh xạ đặt cạnh nhau (Table 5.3 quy thành con số)</p>
<table>
<tr><th></th><th>Trực tiếp</th><th>Liên kết hoàn toàn</th><th>Liên kết theo tập, k đường</th></tr>
<tr><td>Cách chia địa chỉ</td><td>Tag | <strong>Line</strong> | Word</td><td>Tag | Word (không có chỉ số)</td><td>Tag | <strong>Set</strong> | Word</td></tr>
<tr><td>Số bit chỉ số</td><td>log<sub>2</sub>(số DÒNG)</td><td>0</td><td>log<sub>2</sub>(số TẬP) = log<sub>2</sub>(m/k)</td></tr>
<tr><td>Một khối được nằm ở…</td><td>đúng 1 dòng</td><td>bất kỳ dòng nào</td><td>bất kỳ dòng nào trong k dòng của 1 tập</td></tr>
<tr><td>Số bộ so sánh</td><td><strong>1</strong></td><td><strong>m</strong> (mọi dòng, cần CAM)</td><td><strong>k</strong></td></tr>
<tr><td>Chi phí phần cứng</td><td>thấp nhất</td><td>cao nhất (CAM lớn hơn SRAM ≈ 60% — slide 16)</td><td>chỉnh được bằng k</td></tr>
<tr><td>Đụng độ (conflict miss)</td><td>tệ nhất — hai khối nóng cùng chỉ số là giẫm nhau liên tục</td><td>không có (chỉ còn trượt do hết chỗ)</td><td>hiếm khi k ≥ 4</td></tr>
<tr><td>Thuật toán thay thế</td><td>KHÔNG cần — không có lựa chọn</td><td>cần, trên toàn bộ m dòng</td><td>cần, trong phạm vi 1 tập k dòng</td></tr>
<tr><td>Dùng ở đâu trong CPU thật</td><td>vài lát L3 lớn; L1 thời xưa</td><td>TLB, victim cache, các bộ đệm nhỏ liên kết hoàn toàn</td><td><strong>gần như MỌI L1/L2/L3 ngày nay</strong> (thường 4–16 đường)</td></tr>
</table>
<p class="nhan">Bài 1 — tự kiểm lại chính hình này</p>
<p>Địa chỉ <code>16339C</code>, bộ nhớ 16 MB, cache 16 K dòng 2 đường, dòng 4 byte. Tập nào, tag nào?</p>
<p>16339C<sub>16</sub> = 0001 0110 0011 0011 1001 1100<sub>2</sub>. Bóc từ PHẢI sang: 2 bit cuối <code>00</code> = Word. 13 bit tiếp <code>0110011100111</code> = 0CE7<sub>16</sub> = Set. Còn lại 9 bit bên trái <code>000101100</code> = 02C<sub>16</sub> = Tag.</p>
<p class="dap-an">✅ Đáp án: Set = <strong>0CE7</strong>, Tag = <strong>02C</strong>, Word = 0 — đúng y dòng mà slide vẽ cho FEDCBA98. Đã kiểm bằng chương trình trên cả bảy địa chỉ của hình.</p>
<p class="nhan">Bài 2 — máy 32 bit (dạng đề chuẩn)</p>
<p>Bộ nhớ chính 4 GB, cache 64 kB, dòng 16 byte, liên kết theo tập <strong>4 đường</strong>. Tách địa chỉ <code>0xABCD1234</code>.</p>
<ul>
<li>4 GB = 2<sup>32</sup> → địa chỉ 32 bit. Dòng 16 B = 2<sup>4</sup> → <strong>Word = 4 bit</strong>.</li>
<li>Số dòng = 64 kB ÷ 16 B = 4096. Số tập = 4096 ÷ 4 = <strong>1024</strong> = 2<sup>10</sup> → <strong>Set = 10 bit</strong>.</li>
<li>Tag = 32 − 10 − 4 = <strong>18 bit</strong>.</li>
<li>0xABCD1234 = 1010 1011 1100 1101 0001 0010 0011 0100.</li>
</ul>
<table>
<tr><th>Trường</th><th>Bit (lấy từ chuỗi nhị phân trên)</th><th>Giá trị</th></tr>
<tr><td>Tag (18)</td><td>101010111100110100</td><td>0x2AF34 = 175924</td></tr>
<tr><td>Set (10)</td><td>0100100011</td><td>0x123 = 291</td></tr>
<tr><td>Word (4)</td><td>0100</td><td>4</td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>Tập 291 (0x123), Tag 0x2AF34, byte thứ 4 trong dòng.</strong> Cũng cache 64 kB đó nếu tổ chức hai kiểu kia: <em>trực tiếp</em> → Tag 16 | Line 12 | Word 4, tag 0xABCD, dòng 0x123, chỉ 1 bộ so sánh, lưu 4096×16 = 65 536 bit tag. <em>Liên kết hoàn toàn</em> → Tag 28 | Word 4, tag 0xABCD123, 4096 bộ so sánh, lưu 4096×28 = 114 688 bit tag. Bản 4 đường nằm giữa: 4 bộ so sánh, 4096×18 = 73 728 bit tag. Cả bốn con số đều do chương trình tính.</p>
<p class="meo">💡 Thuộc THỨ TỰ BÓC chứ đừng thuộc công thức: <strong>Word bóc từ phải, rồi tới Set, còn lại bao nhiêu là Tag.</strong> Và số bit Set = log<sub>2</sub>(số TẬP) = log<sub>2</sub>(số dòng ÷ k).</p>
<p class="pitfall">⚠️⚠️ Lỗi số một trong đề CEA201: tính số bit Set bằng log<sub>2</sub>(số DÒNG). Đó là luật của ánh xạ TRỰC TIẾP. Với cache k đường phải CHIA CHO k trước. Ở bài 2, log<sub>2</sub>(4096) = 12 là SAI; log<sub>2</sub>(4096/4) = log<sub>2</sub>(1024) = 10 mới đúng — và hai đáp án lệch nhau 2 bit ở tag, nên mọi con số sau đó cũng sai theo.</p>
<p class="pitfall">⚠️ Bẫy thứ hai, ngay trên slide này: nhãn "16 kline Cache" nghĩa là <strong>16 K DÒNG</strong>, không phải 16 kB. Dung lượng dữ liệu ở đây là 16384 × 4 B = <strong>64 kB</strong>. Đọc chữ "line" là ĐƠN VỊ ĐẾM, đừng bao giờ đọc thành byte.</p>`],

      [24, 'Figure 5.15 — Varying Associativity over Cache Size',
        `<p class="y-chinh">🎯 The experiment that tells you how much associativity to buy. Hit ratio is plotted against cache size for direct, 2-, 4-, 8- and 16-way. Two facts jump out: <strong>associativity helps a lot when the cache is small, and almost nothing when the cache is large</strong>.</p>
<table>
<tr><th>Cache size</th><th>direct</th><th>2-way</th><th>4-way</th><th>8-way</th><th>16-way</th><th>Gain, direct → 16-way</th></tr>
<tr><td>1 k</td><td>≈ 0.46</td><td>≈ 0.49</td><td>≈ 0.50</td><td>≈ 0.50</td><td>≈ 0.50</td><td><strong>+0.04</strong></td></tr>
<tr><td>2 k</td><td>≈ 0.55</td><td>≈ 0.59</td><td>≈ 0.60</td><td>≈ 0.60</td><td>≈ 0.60</td><td>+0.05</td></tr>
<tr><td>8 k</td><td>≈ 0.76</td><td>≈ 0.81</td><td>≈ 0.83</td><td>≈ 0.84</td><td>≈ 0.84</td><td><strong>+0.08</strong></td></tr>
<tr><td>16 k</td><td>≈ 0.85</td><td>≈ 0.90</td><td>≈ 0.92</td><td>≈ 0.92</td><td>≈ 0.93</td><td>+0.08</td></tr>
<tr><td>64 k</td><td>≈ 0.93</td><td>≈ 0.95</td><td>≈ 0.95</td><td>≈ 0.95</td><td>≈ 0.95</td><td>+0.02</td></tr>
<tr><td>1 M</td><td>≈ 0.96</td><td>≈ 0.96</td><td>≈ 0.96</td><td>≈ 0.96</td><td>≈ 0.96</td><td><strong>≈ 0.00</strong></td></tr>
</table>
<p class="nhan">(Values read off the plotted bars and rounded — the slide gives no numeric table.)</p>
<ul>
<li><strong>The curve flattens twice.</strong> Horizontally: past 64 kB, adding capacity buys almost nothing. Vertically: past 4-way, adding ways buys almost nothing. Designers therefore land on the corner — a few tens of kB at 4–8 way for L1 — and that is exactly what real CPUs do.</li>
<li><strong>Why associativity matters more when the cache is small.</strong> A small cache has few sets, so many hot blocks collide on the same index — those are <em>conflict misses</em>, and extra ways remove them directly. A big cache has many sets; collisions are already rare, so the remaining misses are <em>capacity</em> and <em>compulsory</em> misses, which associativity cannot touch.</li>
<li><strong>The biggest single jump is direct → 2-way.</strong> Going from 1 comparator to 2 recovers most of the available benefit; 2 → 4 recovers some; 4 → 16 recovers a sliver while quadrupling comparator count and lengthening the hit path. Diminishing returns in a picture.</li>
<li><strong>Cost does not flatten.</strong> Every doubling of k doubles the comparators and the parallel tag reads in a set, and it raises the tag width by one bit per line (slide 23). The benefit curve flattens; the cost curve keeps climbing. That gap is why nobody builds a 512-way L1.</li>
<li><strong>Connect back to Chapter 4.</strong> The hit ratio <em>h</em> on this y-axis is the same <em>h</em> that goes into average access time T<sub>a</sub> = h·T<sub>1</sub> + (1−h)·(T<sub>1</sub>+T<sub>2</sub>). Moving h from 0.85 to 0.92 at 16 kB nearly halves the miss traffic — that is why the small-cache end of this chart is where the money is.</li>
</ul>
<p class="nhan">Worked problem 3 — an 8-way cache on a 24-bit machine</p>
<p>Main memory 16 MB, cache 8 kB, line 32 bytes, <strong>8-way</strong> set-associative. Split <code>0x9A2C7F</code>.</p>
<ul>
<li>16 MB = 2<sup>24</sup> → 24-bit address. Line 32 B = 2<sup>5</sup> → <strong>Word = 5 bits</strong>.</li>
<li>Lines = 8192 ÷ 32 = 256. Sets = 256 ÷ 8 = <strong>32</strong> = 2<sup>5</sup> → <strong>Set = 5 bits</strong>.</li>
<li>Tag = 24 − 5 − 5 = <strong>14 bits</strong>.</li>
<li>0x9A2C7F = 1001 1010 0010 1100 0111 1111.</li>
</ul>
<table>
<tr><th>Field</th><th>Bits</th><th>Value</th></tr>
<tr><td>Tag (14)</td><td>10011010001011</td><td>0x268B = 9867</td></tr>
<tr><td>Set (5)</td><td>00011</td><td>3</td></tr>
<tr><td>Word (5)</td><td>11111</td><td>31 (the last byte of the line)</td></tr>
</table>
<p class="dap-an">✅ Answer: <strong>Set 3, Tag 0x268B, byte 31 of the line.</strong> Sanity checks that catch arithmetic slips: Word and Set happen to be equal here (5 bits each) purely because 256/8 = 32 = line size in bytes — a coincidence, not a rule. Tag storage overhead = 256 lines × 14 bits = 3584 bits = 448 bytes, i.e. ≈ 5.5% on top of 8 kB of data. Computed by program.</p>
<p class="meo">💡 Sentence for the exam: "<strong>Associativity buys hit ratio only while the cache is small; after 4-way it is mostly paying for comparators.</strong>" One line, and it answers both "why 4-way?" and "why not 64-way?".</p>
<p class="pitfall">⚠️ Do not read this chart as "bigger cache is always better". It plots hit ratio only — it says nothing about <em>hit time</em>. A 1 MB L1 would have a magnificent hit ratio and a hit latency so long that the whole pipeline would stall on every load. That trade-off is what slide 32's multilevel hierarchy exists to resolve.</p>`,
        `<p class="y-chinh">🎯 Thí nghiệm cho biết nên mua bao nhiêu độ liên kết. Tỉ lệ trúng vẽ theo kích thước cache, cho trực tiếp, 2, 4, 8 và 16 đường. Hai điều đập vào mắt: <strong>độ liên kết giúp RẤT NHIỀU khi cache nhỏ, và gần như KHÔNG giúp gì khi cache lớn</strong>.</p>
<table>
<tr><th>Kích thước cache</th><th>trực tiếp</th><th>2 đường</th><th>4 đường</th><th>8 đường</th><th>16 đường</th><th>Chênh trực tiếp → 16 đường</th></tr>
<tr><td>1 k</td><td>≈ 0,46</td><td>≈ 0,49</td><td>≈ 0,50</td><td>≈ 0,50</td><td>≈ 0,50</td><td><strong>+0,04</strong></td></tr>
<tr><td>2 k</td><td>≈ 0,55</td><td>≈ 0,59</td><td>≈ 0,60</td><td>≈ 0,60</td><td>≈ 0,60</td><td>+0,05</td></tr>
<tr><td>8 k</td><td>≈ 0,76</td><td>≈ 0,81</td><td>≈ 0,83</td><td>≈ 0,84</td><td>≈ 0,84</td><td><strong>+0,08</strong></td></tr>
<tr><td>16 k</td><td>≈ 0,85</td><td>≈ 0,90</td><td>≈ 0,92</td><td>≈ 0,92</td><td>≈ 0,93</td><td>+0,08</td></tr>
<tr><td>64 k</td><td>≈ 0,93</td><td>≈ 0,95</td><td>≈ 0,95</td><td>≈ 0,95</td><td>≈ 0,95</td><td>+0,02</td></tr>
<tr><td>1 M</td><td>≈ 0,96</td><td>≈ 0,96</td><td>≈ 0,96</td><td>≈ 0,96</td><td>≈ 0,96</td><td><strong>≈ 0,00</strong></td></tr>
</table>
<p class="nhan">(Số đọc từ chiều cao cột trên biểu đồ và làm tròn — slide KHÔNG cho bảng số.)</p>
<ul>
<li><strong>Đường cong phẳng ra theo HAI chiều.</strong> Chiều ngang: quá 64 kB thì tăng dung lượng gần như vô ích. Chiều dọc: quá 4 đường thì tăng số đường gần như vô ích. Vậy người thiết kế dừng ở đúng góc gấp — vài chục kB, 4–8 đường cho L1 — và CPU thật đúng là làm thế.</li>
<li><strong>Vì sao độ liên kết quan trọng hơn khi cache nhỏ.</strong> Cache nhỏ có ít tập, nên nhiều khối nóng đụng cùng một chỉ số — đó là <em>trượt do đụng độ</em>, và thêm đường xoá thẳng loại trượt này. Cache lớn có nhiều tập, đụng độ vốn đã hiếm, phần trượt còn lại là <em>hết chỗ</em> và <em>bắt buộc</em>, mà độ liên kết không đụng tới được.</li>
<li><strong>Bước nhảy lớn nhất là trực tiếp → 2 đường.</strong> Từ 1 bộ so sánh lên 2 đã lấy được phần lớn lợi ích; 2 → 4 lấy thêm một ít; 4 → 16 lấy được một mẩu trong khi số bộ so sánh gấp bốn và đường tra tag dài ra. Quy luật lợi ích giảm dần, vẽ thành hình.</li>
<li><strong>Chi phí thì KHÔNG phẳng.</strong> Mỗi lần nhân đôi k là nhân đôi số bộ so sánh và số lần đọc tag song song trong một tập, đồng thời tag rộng thêm một bit mỗi dòng (slide 23). Đường lợi ích phẳng dần, đường chi phí vẫn leo. Khoảng cách đó là lý do không ai làm L1 512 đường.</li>
<li><strong>Nối ngược về Chương 4.</strong> Tỉ lệ trúng <em>h</em> ở trục tung chính là <em>h</em> trong thời gian truy cập trung bình T<sub>a</sub> = h·T<sub>1</sub> + (1−h)·(T<sub>1</sub>+T<sub>2</sub>). Kéo h từ 0,85 lên 0,92 ở mốc 16 kB là giảm gần một nửa lưu lượng trượt — nên đầu NHỎ của biểu đồ này mới là chỗ ra tiền.</li>
</ul>
<p class="nhan">Bài 3 — cache 8 đường trên máy 24 bit</p>
<p>Bộ nhớ chính 16 MB, cache 8 kB, dòng 32 byte, liên kết theo tập <strong>8 đường</strong>. Tách <code>0x9A2C7F</code>.</p>
<ul>
<li>16 MB = 2<sup>24</sup> → địa chỉ 24 bit. Dòng 32 B = 2<sup>5</sup> → <strong>Word = 5 bit</strong>.</li>
<li>Số dòng = 8192 ÷ 32 = 256. Số tập = 256 ÷ 8 = <strong>32</strong> = 2<sup>5</sup> → <strong>Set = 5 bit</strong>.</li>
<li>Tag = 24 − 5 − 5 = <strong>14 bit</strong>.</li>
<li>0x9A2C7F = 1001 1010 0010 1100 0111 1111.</li>
</ul>
<table>
<tr><th>Trường</th><th>Bit</th><th>Giá trị</th></tr>
<tr><td>Tag (14)</td><td>10011010001011</td><td>0x268B = 9867</td></tr>
<tr><td>Set (5)</td><td>00011</td><td>3</td></tr>
<tr><td>Word (5)</td><td>11111</td><td>31 (byte cuối cùng của dòng)</td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>Tập 3, Tag 0x268B, byte thứ 31 trong dòng.</strong> Vài phép thử để bắt lỗi tính: Word và Set ở đây TÌNH CỜ bằng nhau (đều 5 bit) chỉ vì 256/8 = 32 đúng bằng số byte một dòng — trùng hợp, không phải quy luật. Chi phí lưu tag = 256 dòng × 14 bit = 3584 bit = 448 byte, tức ≈ 5,5% cộng thêm trên 8 kB dữ liệu. Chương trình tính.</p>
<p class="meo">💡 Một câu để đi thi: "<strong>Độ liên kết chỉ mua được tỉ lệ trúng khi cache còn nhỏ; quá 4 đường thì chủ yếu là trả tiền cho bộ so sánh.</strong>" Một dòng, trả lời được cả "vì sao 4 đường?" lẫn "vì sao không 64 đường?".</p>
<p class="pitfall">⚠️ Đừng đọc biểu đồ này thành "cache càng lớn càng tốt". Nó chỉ vẽ TỈ LỆ TRÚNG — không nói gì về THỜI GIAN TRÚNG. Một L1 1 MB sẽ có tỉ lệ trúng rất đẹp và độ trễ trúng dài tới mức cả pipeline nghẽn ở mỗi lệnh nạp. Chính mâu thuẫn đó là lý do tồn tại của phân cấp nhiều mức ở slide 32.</p>`],

      [25, 'Replacement Algorithms — why direct mapping needs none',
        `<p class="y-chinh">🎯 Once the cache is full, admitting a new block means evicting an old one. The slide's key asymmetry: <strong>direct mapping needs no replacement algorithm at all</strong> — there is only one possible line — while associative and set-associative mapping must choose, and the choice must be made in hardware.</p>
<ul>
<li><strong>The slide's four statements, in order.</strong> (1) Once the cache has been filled, when a new block is brought in, one of the existing blocks must be replaced. (2) For direct mapping there is only one possible line for any particular block and <em>no choice is possible</em>. (3) For the associative and set-associative techniques a replacement algorithm is needed. (4) To achieve high speed, an algorithm must be implemented <strong>in hardware</strong>.</li>
<li><strong>"No choice is possible" is a feature, not a limitation.</strong> Direct mapping's whole design is that the index picks the line deterministically. It removes a decision from the critical path — which is why direct-mapped caches have the shortest hit time (Table 5.6, slide 41).</li>
<li><strong>The scope of the decision differs.</strong> Fully associative: choose 1 victim out of <em>all m</em> lines. k-way set-associative: choose 1 victim out of the <em>k</em> lines of one set — and k is typically 4 or 8, so the hardware is small. Narrowing the choice is the second gift of set-associative mapping, after the comparator count.</li>
<li><strong>"In hardware" rules out everything clever.</strong> The decision must complete inside the miss-handling path, at clock speed, with no memory of the future and no software involvement. Anything needing sorting, counting over long histories, or a table lookup in RAM is disqualified. That single constraint is why the four candidates on slide 26 are as crude as they are.</li>
<li><strong>The theoretical best is unbuildable.</strong> The optimal policy (Belady's OPT) evicts the block whose next use is furthest in the future — it needs to see the future, so it exists only as a yardstick. On the trace used on slide 26, OPT scores 7 misses where the best real policy scores 8: measured, not asserted.</li>
</ul>
<p class="meo">💡 One-line answer to the standard exam question "which mapping needs a replacement algorithm?": <strong>every mapping except direct</strong> — because direct mapping already made the decision for you when it chose the index bits.</p>
<p class="pitfall">⚠️ A trap in multiple-choice papers: "a direct-mapped cache uses LRU". False — it cannot, there is nothing to choose between. If a question offers LRU as an option for a direct-mapped cache, that option is wrong by construction.</p>`,
        `<p class="y-chinh">🎯 Cache đầy rồi thì nhận khối mới nghĩa là phải ĐUỔI một khối cũ. Điểm bất đối xứng mấu chốt của slide: <strong>ánh xạ trực tiếp KHÔNG cần thuật toán thay thế nào cả</strong> — chỉ có đúng một dòng khả dĩ — còn liên kết hoàn toàn và liên kết theo tập thì phải CHỌN, và việc chọn phải làm bằng phần cứng.</p>
<ul>
<li><strong>Bốn câu của slide, theo thứ tự.</strong> (1) Cache đầy rồi, đưa khối mới vào thì một khối cũ phải bị thay. (2) Với ánh xạ trực tiếp chỉ có một dòng khả dĩ cho mỗi khối và <em>không có lựa chọn nào</em>. (3) Với kỹ thuật liên kết và liên kết theo tập thì CẦN thuật toán thay thế. (4) Muốn nhanh thì thuật toán phải cài bằng <strong>PHẦN CỨNG</strong>.</li>
<li><strong>"Không có lựa chọn" là ƯU ĐIỂM, không phải hạn chế.</strong> Toàn bộ thiết kế của ánh xạ trực tiếp là chỉ số quyết định dòng một cách tất định. Nó rút một quyết định ra khỏi đường găng — nên cache trực tiếp có thời gian trúng ngắn nhất (Table 5.6, slide 41).</li>
<li><strong>Phạm vi quyết định khác nhau.</strong> Liên kết hoàn toàn: chọn 1 nạn nhân trong <em>toàn bộ m</em> dòng. Liên kết theo tập k đường: chọn 1 nạn nhân trong <em>k</em> dòng của MỘT tập — mà k thường là 4 hay 8, nên mạch rất nhỏ. Thu hẹp phạm vi chọn là món quà thứ hai của ánh xạ theo tập, sau số bộ so sánh.</li>
<li><strong>"Bằng phần cứng" loại bỏ mọi thứ khôn ngoan.</strong> Quyết định phải xong ngay trong đường xử lý trượt, ở tốc độ xung nhịp, không biết trước tương lai và không có phần mềm tham gia. Cái gì cần sắp xếp, cần đếm trên lịch sử dài, hay cần tra bảng trong RAM đều bị loại. Đúng một ràng buộc đó giải thích vì sao bốn ứng viên ở slide 26 thô sơ đến thế.</li>
<li><strong>Cái tốt nhất về lý thuyết thì không dựng được.</strong> Chính sách tối ưu (OPT của Belady) đuổi khối mà lần dùng kế tiếp XA NHẤT trong tương lai — nó cần nhìn thấy tương lai, nên chỉ tồn tại như một cây thước. Trên dãy truy cập dùng ở slide 26, OPT được 7 lần trượt trong khi chính sách thật tốt nhất được 8: đo thật, không phải nói suông.</li>
</ul>
<p class="meo">💡 Câu trả lời một dòng cho câu hỏi kinh điển "kiểu ánh xạ nào cần thuật toán thay thế?": <strong>mọi kiểu TRỪ trực tiếp</strong> — vì ánh xạ trực tiếp đã quyết hộ bạn ngay lúc nó chọn các bit chỉ số.</p>
<p class="pitfall">⚠️ Bẫy trong đề trắc nghiệm: "cache ánh xạ trực tiếp dùng LRU". SAI — nó không thể, vì chẳng có gì để chọn. Nếu đề đưa LRU làm phương án cho cache trực tiếp thì phương án đó sai ngay từ cấu tạo.</p>`],

      [26, 'The most common replacement algorithms: LRU, FIFO, LFU (and random)',
        `<p class="y-chinh">🎯 Four policies, one job: pick the victim inside a set. The slide ranks <strong>LRU as "most effective"</strong> and notes it is also "the most popular replacement algorithm" because of its simplicity of implementation. Below, all four are run by machine on one concrete trace so you can see <em>why</em>.</p>
<table>
<tr><th>Policy</th><th>The slide's rule</th><th>What the hardware stores</th><th>Weakness</th></tr>
<tr><td><strong>LRU</strong> — least recently used</td><td>Replace that block in the set that has been in the cache longest <em>with no reference to it</em></td><td>Order of last use. For 2-way: <strong>one USE bit per line</strong>. For k-way: a small age counter or a matrix of bits</td><td>Cost grows fast with k; a single sweep through a big array evicts everything useful</td></tr>
<tr><td><strong>FIFO</strong> — first in first out</td><td>Replace that block in the set that has been in the cache longest</td><td>Easily implemented as a <em>round-robin or circular buffer</em> technique — one pointer per set</td><td>Ignores usage entirely: a block used on every single access still gets evicted when its turn comes</td></tr>
<tr><td><strong>LFU</strong> — least frequently used</td><td>Replace that block in the set that has experienced the fewest references</td><td>Could be implemented by associating a <strong>counter with each line</strong></td><td>Old popularity never fades — a block that was hot once squats forever while new blocks thrash</td></tr>
<tr><td><strong>Random</strong></td><td>(listed in Table 5.1 on slide 7; no rule to store)</td><td>nothing — a free-running counter or LFSR</td><td>no guarantee on any single run</td></tr>
</table>
<p class="nhan">Hand-run: cache 4-way, ONE set, initially empty. Access sequence of block numbers (all map to this same set):</p>
<p><code>0, 2, 5, 0, 4, 1, 5, 0, 3, 1, 0, 5, 2, 1, 3, 2</code> — 16 accesses.</p>
<p class="nhan">LRU — 8 misses, 8 hits</p>
<table>
<tr><th>#</th><th>Block</th><th>Result</th><th>Cache after (4 ways)</th><th>Evicted</th></tr>
<tr><td>1</td><td>0</td><td>MISS</td><td>0, –, –, –</td><td>—</td></tr>
<tr><td>2</td><td>2</td><td>MISS</td><td>0, 2, –, –</td><td>—</td></tr>
<tr><td>3</td><td>5</td><td>MISS</td><td>0, 2, 5, –</td><td>—</td></tr>
<tr><td>4</td><td>0</td><td><strong>HIT</strong></td><td>0, 2, 5, –</td><td>—</td></tr>
<tr><td>5</td><td>4</td><td>MISS</td><td>0, 2, 5, 4</td><td>— (last free way)</td></tr>
<tr><td>6</td><td>1</td><td>MISS</td><td>0, 1, 5, 4</td><td><strong>2</strong> (unused since #2)</td></tr>
<tr><td>7</td><td>5</td><td><strong>HIT</strong></td><td>0, 1, 5, 4</td><td>—</td></tr>
<tr><td>8</td><td>0</td><td><strong>HIT</strong></td><td>0, 1, 5, 4</td><td>—</td></tr>
<tr><td>9</td><td>3</td><td>MISS</td><td>0, 1, 5, 3</td><td><strong>4</strong> (unused since #5)</td></tr>
<tr><td>10</td><td>1</td><td><strong>HIT</strong></td><td>0, 1, 5, 3</td><td>—</td></tr>
<tr><td>11</td><td>0</td><td><strong>HIT</strong></td><td>0, 1, 5, 3</td><td>—</td></tr>
<tr><td>12</td><td>5</td><td><strong>HIT</strong></td><td>0, 1, 5, 3</td><td>—</td></tr>
<tr><td>13</td><td>2</td><td>MISS</td><td>0, 1, 5, 2</td><td><strong>3</strong></td></tr>
<tr><td>14</td><td>1</td><td><strong>HIT</strong></td><td>0, 1, 5, 2</td><td>—</td></tr>
<tr><td>15</td><td>3</td><td>MISS</td><td>3, 1, 5, 2</td><td><strong>0</strong></td></tr>
<tr><td>16</td><td>2</td><td><strong>HIT</strong></td><td>3, 1, 5, 2</td><td>—</td></tr>
</table>
<p class="nhan">FIFO — 10 misses, 6 hits (same sequence)</p>
<table>
<tr><th>#</th><th>Block</th><th>Result</th><th>Cache after</th><th>Evicted</th></tr>
<tr><td>1–5</td><td>0, 2, 5, 0, 4</td><td>MISS, MISS, MISS, <strong>HIT</strong>, MISS</td><td>0, 2, 5, 4</td><td>—</td></tr>
<tr><td>6</td><td>1</td><td>MISS</td><td>1, 2, 5, 4</td><td><strong>0</strong> — oldest arrival, even though it was just used at #4</td></tr>
<tr><td>7</td><td>5</td><td><strong>HIT</strong></td><td>1, 2, 5, 4</td><td>—</td></tr>
<tr><td>8</td><td>0</td><td>MISS</td><td>1, 0, 5, 4</td><td><strong>2</strong></td></tr>
<tr><td>9</td><td>3</td><td>MISS</td><td>1, 0, 3, 4</td><td><strong>5</strong></td></tr>
<tr><td>10</td><td>1</td><td><strong>HIT</strong></td><td>1, 0, 3, 4</td><td>—</td></tr>
<tr><td>11</td><td>0</td><td><strong>HIT</strong></td><td>1, 0, 3, 4</td><td>—</td></tr>
<tr><td>12</td><td>5</td><td>MISS</td><td>1, 0, 3, 5</td><td><strong>4</strong></td></tr>
<tr><td>13</td><td>2</td><td>MISS</td><td>2, 0, 3, 5</td><td><strong>1</strong></td></tr>
<tr><td>14</td><td>1</td><td>MISS</td><td>2, 1, 3, 5</td><td><strong>0</strong></td></tr>
<tr><td>15</td><td>3</td><td><strong>HIT</strong></td><td>2, 1, 3, 5</td><td>—</td></tr>
<tr><td>16</td><td>2</td><td><strong>HIT</strong></td><td>2, 1, 3, 5</td><td>—</td></tr>
</table>
<p class="nhan">LFU — 9 misses, 7 hits (ties broken by oldest arrival)</p>
<table>
<tr><th>#</th><th>Block</th><th>Result</th><th>Cache after</th><th>Evicted (its count)</th></tr>
<tr><td>1–12</td><td>0, 2, 5, 0, 4, 1, 5, 0, 3, 1, 0, 5</td><td>MISS×6, HIT×6 — identical to LRU here</td><td>0, 1, 5, 3</td><td>2 at #6, 4 at #9</td></tr>
<tr><td>13</td><td>2</td><td>MISS</td><td>0, 1, 5, 2</td><td><strong>3</strong> (count 1)</td></tr>
<tr><td>14</td><td>1</td><td><strong>HIT</strong></td><td>0, 1, 5, 2</td><td>—</td></tr>
<tr><td>15</td><td>3</td><td>MISS</td><td>0, 1, 5, 3</td><td><strong>2</strong> (count 1)</td></tr>
<tr><td>16</td><td>2</td><td>MISS</td><td>0, 1, 5, 2</td><td><strong>3</strong> (count 1) — thrashing</td></tr>
</table>
<p class="nhan">Scoreboard — measured, not estimated</p>
<table>
<tr><th>Policy</th><th>Misses / 16</th><th>Hit ratio</th><th>Comment</th></tr>
<tr><td><strong>OPT (Belady)</strong></td><td>7</td><td>0.5625</td><td>unbuildable yardstick — needs the future</td></tr>
<tr><td><strong>LRU</strong></td><td><strong>8</strong></td><td><strong>0.5000</strong></td><td>best of the real policies — 1 miss from optimal</td></tr>
<tr><td><strong>LFU</strong></td><td>9</td><td>0.4375</td><td>blocks 0, 1, 5 hoard counts; 2 and 3 thrash at #13–16</td></tr>
<tr><td><strong>Random</strong></td><td>9.4586 <em>(average)</em></td><td>0.4088</td><td>average over <strong>1 000 000</strong> simulated runs; spread 7–15</td></tr>
<tr><td><strong>FIFO</strong></td><td>10</td><td>0.3750</td><td>worst — throws out block 0 at #6 right after using it at #4</td></tr>
</table>
<p class="nhan">The simulator (Python) — run it and reproduce every table above</p>
<pre>import random
K, SEQ = 4, [0,2,5,0,4,1,5,0,3,1,0,5,2,1,3,2]

def run(policy, seq, k=K, seed=None):
    rng = random.Random(seed)
    lines = [None]*k
    load, use, cnt = {}, {}, {}      # nap / dung gan nhat / so lan dung
    miss = 0
    for t, b in enumerate(seq, 1):
        if b in lines:
            use[b] = t; cnt[b] = cnt.get(b, 0) + 1
            continue
        miss += 1
        if None in lines:
            i = lines.index(None)
        else:
            if   policy == 'LRU':  v = min(lines, key=lambda x: use[x])
            elif policy == 'FIFO': v = min(lines, key=lambda x: load[x])
            elif policy == 'LFU':  v = min(lines, key=lambda x: (cnt[x], load[x]))
            else:                  v = rng.choice(lines)
            i = lines.index(v)
            for d in (load, use, cnt): d.pop(v, None)
        lines[i] = b; load[b] = use[b] = t; cnt[b] = 1
    return miss

for p in ('LRU', 'FIFO', 'LFU'):
    print(p, run(p, SEQ))
print('RANDOM', sum(run('RAND', SEQ, seed=i) for i in range(1000000)) / 1000000)</pre>
<ul>
<li><strong>Why FIFO loses here — look at access #6.</strong> Block 0 was used one step earlier (#4) yet FIFO evicts it because it arrived first. LRU keeps it and collects hits at #8 and #11. FIFO's blind spot is that <em>arrival order is not usage order</em>.</li>
<li><strong>Why LFU loses — look at accesses #13 to #16.</strong> Blocks 0, 1 and 5 have accumulated counts of 3–4, so they can never be evicted. Blocks 2 and 3, each with count 1, take turns kicking each other out: miss, hit, miss, miss. That is <em>cache pollution by stale popularity</em>, and it is the classic reason real hardware does not use pure LFU.</li>
<li><strong>Random is not as bad as it looks.</strong> 9.46 average beats FIFO's 10 on this trace, with <em>zero</em> state stored per line. That is why random (or pseudo-LRU, its cheap cousin) appears in real L2/L3 caches where full LRU for 16 ways would cost too much.</li>
<li><strong>What 2-way LRU costs in gates: one bit.</strong> Set the USE bit of the line you touched to 1 and its partner's to 0; on a miss, replace the line whose USE bit is 0. That is the whole implementation, and it is why LRU is called "simple to implement" on the slide.</li>
<li><strong>Beyond 2-way, exact LRU gets expensive fast</strong> — k-way LRU needs roughly k(k−1)/2 order bits per set (6 bits for 4-way, 28 for 8-way, 120 for 16-way). Real chips therefore use <em>pseudo-LRU</em>: a tree of k−1 bits (3 bits for 4-way) that approximates LRU well enough.</li>
</ul>
<p class="meo">💡 Remember the three by what they measure: <strong>FIFO measures AGE, LFU measures COUNT, LRU measures RECENCY</strong> — and recency is the one that matches temporal locality, which is exactly the property caches exist to exploit (Chapter 4). That single sentence explains the slide's ranking.</p>
<p class="pitfall">⚠️ LRU beats FIFO <em>on average</em>, not always. Build a trace that walks a big array once and LRU, FIFO, LFU all miss on every access alike. When an exam asks "which is best", the defensible answer is "LRU, because it tracks temporal locality" — not "LRU always gives fewer misses".</p>
<p class="pitfall">⚠️ When hand-running LRU, update the recency stamp on a <strong>HIT</strong> too, not only on a miss. Forgetting that is the single most common way students get a different table from the machine — it is exactly what saves block 0 at step #6 above.</p>`,
        `<p class="y-chinh">🎯 Bốn chính sách, một việc: chọn nạn nhân TRONG MỘT TẬP. Slide xếp <strong>LRU là "hiệu quả nhất"</strong> và ghi thêm nó cũng là "thuật toán thay thế phổ biến nhất" nhờ đơn giản khi cài đặt. Dưới đây cả bốn được CHẠY BẰNG MÁY trên một dãy truy cập cụ thể để bạn thấy <em>vì sao</em>.</p>
<table>
<tr><th>Chính sách</th><th>Luật theo slide</th><th>Phần cứng lưu gì</th><th>Điểm yếu</th></tr>
<tr><td><strong>LRU</strong> — ít dùng gần đây nhất</td><td>Thay khối trong tập đã nằm trong cache lâu nhất <em>mà không được tham chiếu tới</em></td><td>Thứ tự dùng lần cuối. Với 2 đường: <strong>một bit USE mỗi dòng</strong>. Với k đường: bộ đếm tuổi nhỏ hoặc một ma trận bit</td><td>Chi phí tăng nhanh theo k; một lượt quét qua mảng lớn là đuổi sạch mọi thứ còn hữu ích</td></tr>
<tr><td><strong>FIFO</strong> — vào trước ra trước</td><td>Thay khối trong tập đã nằm trong cache lâu nhất</td><td>Cài dễ bằng kỹ thuật <em>vòng tròn (round-robin / circular buffer)</em> — một con trỏ mỗi tập</td><td>Bỏ qua hoàn toàn mức độ dùng: khối dùng ở mọi lượt vẫn bị đuổi khi tới lượt nó</td></tr>
<tr><td><strong>LFU</strong> — ít được tham chiếu nhất</td><td>Thay khối trong tập có số lần tham chiếu ít nhất</td><td>Có thể cài bằng cách gắn <strong>một bộ đếm cho mỗi dòng</strong></td><td>Danh tiếng cũ không bao giờ phai — khối từng nóng một lần cứ ngồi lì trong khi khối mới giẫm nhau</td></tr>
<tr><td><strong>Ngẫu nhiên</strong></td><td>(có trong Table 5.1 ở slide 7; không có gì để lưu)</td><td>không lưu gì — một bộ đếm tự chạy hoặc LFSR</td><td>không bảo đảm gì cho một lượt chạy cụ thể</td></tr>
</table>
<p class="nhan">Chạy tay: cache 4 đường, MỘT tập, ban đầu rỗng. Dãy truy cập theo số hiệu khối (mọi khối đều rơi vào tập này):</p>
<p><code>0, 2, 5, 0, 4, 1, 5, 0, 3, 1, 0, 5, 2, 1, 3, 2</code> — 16 lượt.</p>
<p class="nhan">LRU — 8 trượt, 8 trúng</p>
<table>
<tr><th>#</th><th>Khối</th><th>Kết quả</th><th>Cache sau đó (4 đường)</th><th>Khối bị đuổi</th></tr>
<tr><td>1</td><td>0</td><td>TRƯỢT</td><td>0, –, –, –</td><td>—</td></tr>
<tr><td>2</td><td>2</td><td>TRƯỢT</td><td>0, 2, –, –</td><td>—</td></tr>
<tr><td>3</td><td>5</td><td>TRƯỢT</td><td>0, 2, 5, –</td><td>—</td></tr>
<tr><td>4</td><td>0</td><td><strong>TRÚNG</strong></td><td>0, 2, 5, –</td><td>—</td></tr>
<tr><td>5</td><td>4</td><td>TRƯỢT</td><td>0, 2, 5, 4</td><td>— (đường trống cuối cùng)</td></tr>
<tr><td>6</td><td>1</td><td>TRƯỢT</td><td>0, 1, 5, 4</td><td><strong>2</strong> (không dùng từ #2)</td></tr>
<tr><td>7</td><td>5</td><td><strong>TRÚNG</strong></td><td>0, 1, 5, 4</td><td>—</td></tr>
<tr><td>8</td><td>0</td><td><strong>TRÚNG</strong></td><td>0, 1, 5, 4</td><td>—</td></tr>
<tr><td>9</td><td>3</td><td>TRƯỢT</td><td>0, 1, 5, 3</td><td><strong>4</strong> (không dùng từ #5)</td></tr>
<tr><td>10</td><td>1</td><td><strong>TRÚNG</strong></td><td>0, 1, 5, 3</td><td>—</td></tr>
<tr><td>11</td><td>0</td><td><strong>TRÚNG</strong></td><td>0, 1, 5, 3</td><td>—</td></tr>
<tr><td>12</td><td>5</td><td><strong>TRÚNG</strong></td><td>0, 1, 5, 3</td><td>—</td></tr>
<tr><td>13</td><td>2</td><td>TRƯỢT</td><td>0, 1, 5, 2</td><td><strong>3</strong></td></tr>
<tr><td>14</td><td>1</td><td><strong>TRÚNG</strong></td><td>0, 1, 5, 2</td><td>—</td></tr>
<tr><td>15</td><td>3</td><td>TRƯỢT</td><td>3, 1, 5, 2</td><td><strong>0</strong></td></tr>
<tr><td>16</td><td>2</td><td><strong>TRÚNG</strong></td><td>3, 1, 5, 2</td><td>—</td></tr>
</table>
<p class="nhan">FIFO — 10 trượt, 6 trúng (cùng dãy)</p>
<table>
<tr><th>#</th><th>Khối</th><th>Kết quả</th><th>Cache sau đó</th><th>Khối bị đuổi</th></tr>
<tr><td>1–5</td><td>0, 2, 5, 0, 4</td><td>TRƯỢT, TRƯỢT, TRƯỢT, <strong>TRÚNG</strong>, TRƯỢT</td><td>0, 2, 5, 4</td><td>—</td></tr>
<tr><td>6</td><td>1</td><td>TRƯỢT</td><td>1, 2, 5, 4</td><td><strong>0</strong> — vào sớm nhất, dù vừa dùng ở #4</td></tr>
<tr><td>7</td><td>5</td><td><strong>TRÚNG</strong></td><td>1, 2, 5, 4</td><td>—</td></tr>
<tr><td>8</td><td>0</td><td>TRƯỢT</td><td>1, 0, 5, 4</td><td><strong>2</strong></td></tr>
<tr><td>9</td><td>3</td><td>TRƯỢT</td><td>1, 0, 3, 4</td><td><strong>5</strong></td></tr>
<tr><td>10</td><td>1</td><td><strong>TRÚNG</strong></td><td>1, 0, 3, 4</td><td>—</td></tr>
<tr><td>11</td><td>0</td><td><strong>TRÚNG</strong></td><td>1, 0, 3, 4</td><td>—</td></tr>
<tr><td>12</td><td>5</td><td>TRƯỢT</td><td>1, 0, 3, 5</td><td><strong>4</strong></td></tr>
<tr><td>13</td><td>2</td><td>TRƯỢT</td><td>2, 0, 3, 5</td><td><strong>1</strong></td></tr>
<tr><td>14</td><td>1</td><td>TRƯỢT</td><td>2, 1, 3, 5</td><td><strong>0</strong></td></tr>
<tr><td>15</td><td>3</td><td><strong>TRÚNG</strong></td><td>2, 1, 3, 5</td><td>—</td></tr>
<tr><td>16</td><td>2</td><td><strong>TRÚNG</strong></td><td>2, 1, 3, 5</td><td>—</td></tr>
</table>
<p class="nhan">LFU — 9 trượt, 7 trúng (hoà thì đuổi khối vào sớm hơn)</p>
<table>
<tr><th>#</th><th>Khối</th><th>Kết quả</th><th>Cache sau đó</th><th>Khối bị đuổi (số đếm)</th></tr>
<tr><td>1–12</td><td>0, 2, 5, 0, 4, 1, 5, 0, 3, 1, 0, 5</td><td>TRƯỢT×6, TRÚNG×6 — tới đây giống hệt LRU</td><td>0, 1, 5, 3</td><td>2 ở #6, 4 ở #9</td></tr>
<tr><td>13</td><td>2</td><td>TRƯỢT</td><td>0, 1, 5, 2</td><td><strong>3</strong> (đếm 1)</td></tr>
<tr><td>14</td><td>1</td><td><strong>TRÚNG</strong></td><td>0, 1, 5, 2</td><td>—</td></tr>
<tr><td>15</td><td>3</td><td>TRƯỢT</td><td>0, 1, 5, 3</td><td><strong>2</strong> (đếm 1)</td></tr>
<tr><td>16</td><td>2</td><td>TRƯỢT</td><td>0, 1, 5, 2</td><td><strong>3</strong> (đếm 1) — giẫm nhau</td></tr>
</table>
<p class="nhan">Bảng điểm — ĐO THẬT, không ước lượng</p>
<table>
<tr><th>Chính sách</th><th>Trượt / 16</th><th>Tỉ lệ trúng</th><th>Nhận xét</th></tr>
<tr><td><strong>OPT (Belady)</strong></td><td>7</td><td>0,5625</td><td>cây thước không dựng được — cần biết tương lai</td></tr>
<tr><td><strong>LRU</strong></td><td><strong>8</strong></td><td><strong>0,5000</strong></td><td>tốt nhất trong các chính sách THẬT — chỉ kém tối ưu 1 lần trượt</td></tr>
<tr><td><strong>LFU</strong></td><td>9</td><td>0,4375</td><td>khối 0, 1, 5 ôm hết số đếm; khối 2 và 3 giẫm nhau ở #13–16</td></tr>
<tr><td><strong>Ngẫu nhiên</strong></td><td>9,4586 <em>(trung bình)</em></td><td>0,4088</td><td>trung bình trên <strong>1.000.000</strong> lượt mô phỏng; trải từ 7 tới 15</td></tr>
<tr><td><strong>FIFO</strong></td><td>10</td><td>0,3750</td><td>tệ nhất — vứt khối 0 ở #6 ngay sau khi vừa dùng nó ở #4</td></tr>
</table>
<p class="nhan">Chương trình mô phỏng (Python) — chạy đi, dựng lại được mọi bảng ở trên</p>
<pre>import random
K, SEQ = 4, [0,2,5,0,4,1,5,0,3,1,0,5,2,1,3,2]

def run(policy, seq, k=K, seed=None):
    rng = random.Random(seed)
    lines = [None]*k
    load, use, cnt = {}, {}, {}      # nap / dung gan nhat / so lan dung
    miss = 0
    for t, b in enumerate(seq, 1):
        if b in lines:
            use[b] = t; cnt[b] = cnt.get(b, 0) + 1
            continue
        miss += 1
        if None in lines:
            i = lines.index(None)
        else:
            if   policy == 'LRU':  v = min(lines, key=lambda x: use[x])
            elif policy == 'FIFO': v = min(lines, key=lambda x: load[x])
            elif policy == 'LFU':  v = min(lines, key=lambda x: (cnt[x], load[x]))
            else:                  v = rng.choice(lines)
            i = lines.index(v)
            for d in (load, use, cnt): d.pop(v, None)
        lines[i] = b; load[b] = use[b] = t; cnt[b] = 1
    return miss

for p in ('LRU', 'FIFO', 'LFU'):
    print(p, run(p, SEQ))
print('RANDOM', sum(run('RAND', SEQ, seed=i) for i in range(1000000)) / 1000000)</pre>
<ul>
<li><strong>Vì sao FIFO thua ở đây — nhìn lượt #6.</strong> Khối 0 vừa được dùng ngay bước trước (#4) mà FIFO vẫn đuổi nó vì nó vào sớm nhất. LRU giữ lại và thu về hai lần trúng ở #8 và #11. Điểm mù của FIFO là <em>thứ tự vào KHÔNG phải thứ tự dùng</em>.</li>
<li><strong>Vì sao LFU thua — nhìn các lượt #13 tới #16.</strong> Khối 0, 1, 5 đã tích số đếm 3–4 nên không bao giờ bị đuổi được nữa. Khối 2 và 3, mỗi đứa đếm 1, thay nhau hất nhau ra: trượt, trúng, trượt, trượt. Đó là <em>ô nhiễm cache bởi danh tiếng cũ</em>, và là lý do kinh điển khiến phần cứng thật không dùng LFU thuần.</li>
<li><strong>Ngẫu nhiên không tệ như vẻ ngoài.</strong> Trung bình 9,46 vẫn thắng FIFO (10) trên dãy này, mà KHÔNG lưu một bit trạng thái nào cho mỗi dòng. Nên ngẫu nhiên (hoặc pseudo-LRU, người em rẻ tiền của LRU) xuất hiện trong L2/L3 thật, nơi LRU đầy đủ cho 16 đường quá đắt.</li>
<li><strong>LRU 2 đường tốn bao nhiêu cổng: ĐÚNG MỘT BIT.</strong> Chạm vào dòng nào thì đặt bit USE của nó bằng 1 và của dòng kia bằng 0; khi trượt thì thay dòng có bit USE = 0. Đó là toàn bộ phần cài đặt, và là lý do slide gọi LRU là "đơn giản khi cài đặt".</li>
<li><strong>Quá 2 đường thì LRU chính xác đắt lên rất nhanh</strong> — LRU k đường cần cỡ k(k−1)/2 bit thứ tự mỗi tập (6 bit cho 4 đường, 28 bit cho 8 đường, 120 bit cho 16 đường). Nên chip thật dùng <em>pseudo-LRU</em>: một cây k−1 bit (3 bit cho 4 đường) xấp xỉ LRU đủ tốt.</li>
</ul>
<p class="meo">💡 Nhớ ba cái bằng thứ CHÚNG ĐO: <strong>FIFO đo TUỔI, LFU đo SỐ LẦN, LRU đo ĐỘ GẦN ĐÂY</strong> — và độ gần đây mới là thứ khớp với tính cục bộ thời gian, đúng cái mà cache sinh ra để khai thác (Chương 4). Một câu đó giải thích trọn thứ hạng của slide.</p>
<p class="pitfall">⚠️ LRU thắng FIFO <em>tính trung bình</em>, không phải luôn luôn. Dựng một dãy quét một mảng lớn đúng một lượt thì LRU, FIFO, LFU trượt như nhau ở mọi lượt. Khi đề hỏi "cái nào tốt nhất", câu trả lời bảo vệ được là "LRU, vì nó bám theo tính cục bộ thời gian" — chứ không phải "LRU luôn cho ít trượt hơn".</p>
<p class="pitfall">⚠️ Khi chạy tay LRU, phải cập nhật mốc thời gian cả khi <strong>TRÚNG</strong>, không chỉ khi trượt. Quên điều đó là cách phổ biến nhất khiến sinh viên ra bảng khác với máy — nó chính là thứ cứu khối 0 ở bước #6 ở trên.</p>`],

      [27, 'Write Policy — the two cases on eviction and the two problems to contend with',
        `<p class="y-chinh">🎯 The section opener, and it frames the whole topic as two questions. <strong>Left half: when a resident block is replaced, must we write it back?</strong> <strong>Right half: who else might be looking at that same word?</strong> Everything on slides 28–30 answers one of those two.</p>
<table>
<tr><th>The slide's left column — two cases on replacement</th><th>The slide's right column — two problems</th></tr>
<tr><td><strong>Case 1:</strong> if the old block in the cache <em>has not been altered</em>, it may be overwritten with a new block <strong>without first writing out the old block</strong></td><td><strong>Problem 1:</strong> more than one device may have access to main memory</td></tr>
<tr><td><strong>Case 2:</strong> if <em>at least one write operation</em> has been performed on a word in that line, main memory <strong>must be updated</strong> by writing the line of cache out to the block of memory before bringing in the new block</td><td><strong>Problem 2:</strong> a more complex problem occurs when multiple processors are attached to the same bus and each has its own local cache — if a word is altered in one cache it could conceivably <strong>invalidate a word in other caches</strong></td></tr>
</table>
<ul>
<li><strong>Case 1 versus Case 2 is exactly one bit of hardware.</strong> "Has it been altered?" is stored as the <strong>dirty bit</strong> (also called the modify bit) attached to each cache line. Clean line → drop it, free. Dirty line → pay for a write-back first. The dirty bit is the smallest, highest-leverage bit in the entire cache.</li>
<li><strong>The cost asymmetry is the reason write policy matters.</strong> Evicting a clean line costs nothing extra. Evicting a dirty line costs one full block write to memory <em>before</em> the miss can even be serviced — so a miss on a dirty line is roughly twice as expensive as a miss on a clean one.</li>
<li><strong>Problem 1 — "more than one device" — means DMA</strong> (Chapter 8). An I/O module writing straight into main memory does not know the processor's cache exists. If the processor holds a stale copy of that memory, it will happily compute on obsolete data.</li>
<li><strong>Problem 2 is the multiprocessor version</strong> and it is strictly harder, because now there are several <em>writers</em>, each with a private cache. It gets a slide of its own (slide 30) and a whole chapter of its own later (Chapter 21, multicore — Ch.18 in the school's syllabus numbering).</li>
<li><strong>Note what the slide is quietly saying about correctness.</strong> Everything else in this chapter has been about <em>speed</em>: mapping, associativity, replacement. Write policy is the first topic where getting it wrong does not make the machine slow — it makes the machine <strong>wrong</strong>. That is why it is treated separately.</li>
</ul>
<p class="meo">💡 Two columns, two questions, one mnemonic: <strong>"Do I owe memory a write? Does anyone else hold this word?"</strong> Answer the first with the dirty bit (slide 28), the second with a coherence protocol (slide 30).</p>
<p class="pitfall">⚠️ Careful with the phrase "has not been altered". It refers to writes <em>by the processor into the cache line</em>, not to whether the line was read. Reading a line a million times leaves it clean; a single byte store makes it dirty.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu phần, và nó đóng khung cả chủ đề thành hai câu hỏi. <strong>Nửa trái: khi một khối đang nằm trong cache bị thay, có phải ghi ngược nó về không?</strong> <strong>Nửa phải: còn ai khác đang nhìn vào chính từ nhớ đó?</strong> Mọi thứ ở slide 28–30 đều trả lời một trong hai câu ấy.</p>
<table>
<tr><th>Cột trái của slide — hai trường hợp khi thay khối</th><th>Cột phải của slide — hai vấn đề phải đối phó</th></tr>
<tr><td><strong>Trường hợp 1:</strong> nếu khối cũ trong cache <em>CHƯA bị sửa</em>, có thể ghi đè khối mới lên nó <strong>mà không cần ghi khối cũ ra trước</strong></td><td><strong>Vấn đề 1:</strong> có thể có NHIỀU HƠN MỘT thiết bị truy cập được bộ nhớ chính</td></tr>
<tr><td><strong>Trường hợp 2:</strong> nếu đã có <em>ít nhất một thao tác ghi</em> lên một từ trong dòng đó, bộ nhớ chính <strong>BẮT BUỘC phải được cập nhật</strong> bằng cách ghi dòng cache ra khối bộ nhớ, TRƯỚC khi nạp khối mới vào</td><td><strong>Vấn đề 2:</strong> vấn đề phức tạp hơn xảy ra khi nhiều bộ xử lý cùng gắn vào một bus và mỗi bộ có cache cục bộ riêng — sửa một từ trong cache này có thể <strong>làm mất hiệu lực một từ ở các cache khác</strong></td></tr>
</table>
<ul>
<li><strong>Trường hợp 1 khác trường hợp 2 đúng bằng MỘT BIT phần cứng.</strong> Câu "đã bị sửa chưa?" được lưu thành <strong>bit dirty</strong> (còn gọi là bit modify) gắn vào mỗi dòng cache. Dòng sạch → vứt, miễn phí. Dòng bẩn → phải trả một lần ghi ngược trước. Bit dirty là bit nhỏ nhất mà có đòn bẩy lớn nhất trong cả cái cache.</li>
<li><strong>Chênh lệch chi phí đó là lý do chính sách ghi quan trọng.</strong> Đuổi một dòng sạch không tốn thêm gì. Đuổi một dòng bẩn tốn nguyên một lần ghi cả khối ra bộ nhớ <em>trước khi</em> lần trượt kia mới bắt đầu được phục vụ — nên trượt trúng dòng bẩn đắt cỡ gấp đôi trượt trúng dòng sạch.</li>
<li><strong>Vấn đề 1 — "nhiều hơn một thiết bị" — chính là DMA</strong> (Chương 8). Một mô-đun I/O ghi thẳng vào bộ nhớ chính không hề biết cache của bộ xử lý tồn tại. Nếu bộ xử lý đang giữ bản sao cũ của vùng nhớ đó, nó sẽ vui vẻ tính toán trên dữ liệu đã lỗi thời.</li>
<li><strong>Vấn đề 2 là phiên bản đa bộ xử lý</strong> và nó khó hơn hẳn, vì giờ có NHIỀU NGƯỜI GHI, mỗi người một cache riêng. Nó được dành hẳn một slide (slide 30) và sau này cả một chương riêng (Chương 21, máy tính đa lõi — Ch.18 theo cách đánh số của syllabus trường).</li>
<li><strong>Để ý điều slide đang lặng lẽ nói về TÍNH ĐÚNG.</strong> Mọi thứ khác trong chương này là về <em>tốc độ</em>: ánh xạ, độ liên kết, thay thế. Chính sách ghi là chủ đề ĐẦU TIÊN mà làm sai không khiến máy chậm — nó khiến máy <strong>SAI</strong>. Đó là lý do nó được tách riêng ra.</li>
</ul>
<p class="meo">💡 Hai cột, hai câu hỏi, một câu nhớ: <strong>"Tôi có nợ bộ nhớ một lần ghi không? Có ai khác đang giữ từ nhớ này không?"</strong> Câu đầu trả lời bằng bit dirty (slide 28), câu sau bằng giao thức nhất quán (slide 30).</p>
<p class="pitfall">⚠️ Cẩn thận với cụm "chưa bị sửa". Nó nói về việc BỘ XỬ LÝ GHI VÀO dòng cache, không nói về việc dòng đó có được ĐỌC hay không. Đọc một dòng cả triệu lần thì nó vẫn SẠCH; ghi đúng một byte là nó thành BẨN.</p>`],

      [28, 'Write Through and Write Back',
        `<p class="y-chinh">🎯 The two policies, and the slide is blunt about the cost of each: write through is <strong>"the simplest technique"</strong> but <strong>"generates substantial memory traffic and may create a bottleneck"</strong>; write back <strong>"minimizes memory writes"</strong> but <strong>"makes for complex circuitry and a potential bottleneck"</strong>.</p>
<table>
<tr><th></th><th>Write through</th><th>Write back</th></tr>
<tr><td>What happens on a write hit</td><td>all write operations are made to main memory <strong>as well as</strong> to the cache</td><td>updates are made <strong>only in the cache</strong></td></tr>
<tr><td>Dirty bit needed?</td><td><strong>no</strong> — memory is never stale</td><td><strong>yes</strong> — one per line, set on the first write</td></tr>
<tr><td>Cost on eviction</td><td>free — just drop the line</td><td>write the line out first, but <strong>only if the dirty bit is set</strong></td></tr>
<tr><td>Memory traffic</td><td>one bus write per <em>store instruction</em></td><td>one bus write per <em>dirty eviction</em>, no matter how many stores hit that line</td></tr>
<tr><td>State of main memory</td><td>always valid — an exact copy</td><td>"portions of main memory are <strong>invalid</strong>"; I/O module accesses can be allowed <strong>only through the cache</strong></td></tr>
<tr><td>Complexity</td><td>simplest</td><td>complex circuitry; a potential bottleneck</td></tr>
<tr><td>Typical use today</td><td>small L1s, and as "write-through to L2" inside a hierarchy</td><td>essentially every L2/L3, and most modern L1s</td></tr>
</table>
<ul>
<li><strong>Do the arithmetic that decides it.</strong> A loop that stores to the same line 100 times: write through issues <strong>100</strong> memory writes; write back issues <strong>1</strong>, at eviction. That 100:1 is why write back wins wherever bandwidth is scarce — and bandwidth is always scarce (slide 4 of Chapter 2, performance balance).</li>
<li><strong>When write through wins.</strong> Memory (or the next level) is always up to date, so any other agent — a DMA controller, another core — can read memory directly and get the truth. Coherence becomes far easier, which is why slide 30's first coherence approach ("bus watching") <em>depends on the use of a write-through policy by all cache controllers</em>.</li>
<li><strong>The slide's sharpest sentence is about write back:</strong> "portions of main memory are invalid and hence accesses by I/O modules can be allowed <strong>only through the cache</strong>." With write back, main memory is no longer the source of truth — the cache is. Every other device must go through the cache or be told to.</li>
<li><strong>A write buffer hides most of write-through's pain.</strong> Real designs put a small FIFO between cache and memory so the processor does not stall on each store; the writes drain in the background. It softens the bottleneck, it does not remove the traffic.</li>
<li><strong>Write through is not "safer" in the crash sense.</strong> Both policies are correct; write back simply defers. What write through buys is <em>simplicity of reasoning about other observers</em>, not durability.</li>
</ul>
<p class="nhan">Worked mini-problem — count the bus writes</p>
<p>A program executes 1000 stores. 900 of them hit lines already in the cache; the 100 misses each evict a line, and 40 of those evicted lines are dirty. How many block writes to memory under each policy?</p>
<ul>
<li><strong>Write through (with no-write-allocate):</strong> every store goes to memory → <strong>1000</strong> writes. Evictions cost nothing.</li>
<li><strong>Write back:</strong> stores go only to the cache → 0 writes from stores; evictions of dirty lines → <strong>40</strong> block writes.</li>
</ul>
<p class="dap-an">✅ Answer: <strong>1000 versus 40 — a factor of 25.</strong> Note the units differ: write-through writes are word-sized, write-back writes are block-sized. If the line is 16 words, write back moves 40 × 16 = 640 words against write through's 1000 — still a win, but a factor of 1.6, not 25. Always ask whether the question counts <em>transactions</em> or <em>bytes</em>.</p>
<p class="meo">💡 Slogan: <strong>write through = memory always right, bus always busy. Write back = bus quiet, memory often wrong (and the dirty bit is the only thing that remembers).</strong></p>
<p class="pitfall">⚠️ Do not say "write back writes the line out on every eviction". It writes out only when the dirty bit is set. Evicting a clean line under write back is exactly as cheap as under write through — that is Case 1 on slide 27.</p>`,
        `<p class="y-chinh">🎯 Hai chính sách, và slide nói thẳng cái giá của từng cái: write through là <strong>"kỹ thuật đơn giản nhất"</strong> nhưng <strong>"sinh ra lưu lượng bộ nhớ rất lớn và có thể tạo nút cổ chai"</strong>; write back thì <strong>"giảm thiểu số lần ghi bộ nhớ"</strong> nhưng <strong>"làm mạch phức tạp và cũng là một nút cổ chai tiềm tàng"</strong>.</p>
<table>
<tr><th></th><th>Write through (ghi xuyên)</th><th>Write back (ghi trả sau)</th></tr>
<tr><td>Khi ghi TRÚNG thì sao</td><td>mọi thao tác ghi đều thực hiện lên bộ nhớ chính <strong>ĐỒNG THỜI với</strong> cache</td><td>cập nhật <strong>CHỈ trong cache</strong></td></tr>
<tr><td>Cần bit dirty không?</td><td><strong>không</strong> — bộ nhớ không bao giờ cũ</td><td><strong>có</strong> — mỗi dòng một bit, bật lên ở lần ghi đầu tiên</td></tr>
<tr><td>Chi phí khi bị đuổi</td><td>miễn phí — chỉ việc vứt dòng đi</td><td>phải ghi dòng ra trước, nhưng <strong>CHỈ KHI bit dirty đang bật</strong></td></tr>
<tr><td>Lưu lượng bộ nhớ</td><td>một lần ghi bus cho MỖI <em>lệnh store</em></td><td>một lần ghi bus cho MỖI <em>lần đuổi dòng bẩn</em>, bất kể dòng đó đã bị ghi bao nhiêu lần</td></tr>
<tr><td>Trạng thái bộ nhớ chính</td><td>luôn hợp lệ — một bản sao chính xác</td><td>"một phần bộ nhớ chính KHÔNG còn hợp lệ"; mô-đun I/O <strong>chỉ được truy cập THÔNG QUA cache</strong></td></tr>
<tr><td>Độ phức tạp</td><td>đơn giản nhất</td><td>mạch phức tạp; cũng là nút cổ chai tiềm tàng</td></tr>
<tr><td>Dùng ở đâu ngày nay</td><td>L1 nhỏ, và kiểu "ghi xuyên xuống L2" trong phân cấp</td><td>gần như mọi L2/L3, và phần lớn L1 hiện đại</td></tr>
</table>
<ul>
<li><strong>Làm phép tính quyết định vấn đề.</strong> Một vòng lặp ghi vào CÙNG một dòng 100 lần: write through phát ra <strong>100</strong> lần ghi bộ nhớ; write back phát ra <strong>1</strong>, lúc bị đuổi. Tỉ lệ 100:1 đó là lý do write back thắng ở mọi nơi băng thông khan hiếm — mà băng thông thì luôn khan hiếm (slide 4 của Chương 2, cân bằng hiệu năng).</li>
<li><strong>Khi nào write through thắng.</strong> Bộ nhớ (hoặc mức kế tiếp) luôn mới nhất, nên mọi tác nhân khác — bộ điều khiển DMA, một lõi khác — đọc thẳng bộ nhớ là được sự thật. Việc giữ nhất quán dễ hơn hẳn, và đó là lý do cách nhất quán đầu tiên ở slide 30 ("theo dõi bus") <em>phụ thuộc vào việc MỌI bộ điều khiển cache đều dùng write through</em>.</li>
<li><strong>Câu sắc nhất của slide là về write back:</strong> "một phần bộ nhớ chính không còn hợp lệ, do đó truy cập của các mô-đun I/O <strong>chỉ được cho phép thông qua cache</strong>". Với write back, bộ nhớ chính KHÔNG còn là nguồn sự thật — cache mới là. Mọi thiết bị khác phải đi qua cache, hoặc phải được báo.</li>
<li><strong>Bộ đệm ghi (write buffer) che gần hết cái đau của write through.</strong> Thiết kế thật đặt một FIFO nhỏ giữa cache và bộ nhớ để bộ xử lý không phải dừng ở mỗi lệnh store; các lần ghi rút dần ở hậu trường. Nó làm dịu nút cổ chai, KHÔNG xoá được lưu lượng.</li>
<li><strong>Write through KHÔNG "an toàn hơn" theo nghĩa mất điện.</strong> Cả hai chính sách đều đúng; write back chỉ là hoãn lại. Cái write through mua được là <em>sự dễ suy luận với những người quan sát khác</em>, không phải tính bền vững.</li>
</ul>
<p class="nhan">Bài nhỏ — đếm số lần ghi ra bus</p>
<p>Một chương trình thi hành 1000 lệnh ghi. 900 lệnh ghi trúng dòng đã có trong cache; 100 lần trượt, mỗi lần đuổi một dòng, và 40 trong số dòng bị đuổi đó là dòng BẨN. Mỗi chính sách phát ra bao nhiêu lần ghi khối xuống bộ nhớ?</p>
<ul>
<li><strong>Write through (kèm no-write-allocate):</strong> mọi lệnh ghi đều xuống bộ nhớ → <strong>1000</strong> lần ghi. Việc đuổi dòng không tốn gì.</li>
<li><strong>Write back:</strong> lệnh ghi chỉ vào cache → 0 lần ghi từ lệnh store; đuổi dòng bẩn → <strong>40</strong> lần ghi khối.</li>
</ul>
<p class="dap-an">✅ Đáp án: <strong>1000 so với 40 — chênh 25 lần.</strong> Nhưng chú ý ĐƠN VỊ khác nhau: ghi của write through cỡ một TỪ, ghi của write back cỡ một KHỐI. Nếu dòng dài 16 từ thì write back chuyển 40 × 16 = 640 từ so với 1000 từ của write through — vẫn thắng, nhưng chỉ 1,6 lần chứ không phải 25. Luôn hỏi đề đang đếm <em>số giao dịch</em> hay <em>số byte</em>.</p>
<p class="meo">💡 Khẩu quyết: <strong>write through = bộ nhớ luôn đúng, bus luôn bận. Write back = bus yên tĩnh, bộ nhớ thường sai (và bit dirty là thứ duy nhất còn nhớ điều đó).</strong></p>
<p class="pitfall">⚠️ Đừng nói "write back ghi dòng ra ở MỌI lần đuổi". Nó chỉ ghi ra khi bit dirty đang bật. Đuổi một dòng SẠCH dưới write back rẻ y hệt dưới write through — đó chính là Trường hợp 1 ở slide 27.</p>`],

      [29, 'Write Miss Alternatives — write allocate versus no write allocate',
        `<p class="y-chinh">🎯 A different question from slide 28. Slide 28 asked "on a write <em>hit</em>, where does the data go?" This slide asks: <strong>on a write MISS, do we bring the block into the cache at all?</strong> Two answers, and the slide states which pairs with which.</p>
<table>
<tr><th></th><th>Write allocate</th><th>No write allocate</th></tr>
<tr><td>The slide's definition</td><td>the block containing the word to be written is <strong>fetched from main memory (or next level cache) into the cache</strong>, and the processor proceeds with the write cycle</td><td>the block containing the word to be written is <strong>modified in the main memory and not loaded into the cache</strong></td></tr>
<tr><td>Cost of the miss itself</td><td>one block read, then the write</td><td>one word write, no block read</td></tr>
<tr><td>Pays off when…</td><td>the program will read or write that line again soon (spatial + temporal locality)</td><td>the program writes once and walks away (e.g. initialising a huge array, streaming output)</td></tr>
<tr><td>Usually paired with</td><td><strong>write back</strong></td><td><strong>write through</strong></td></tr>
</table>
<ul>
<li><strong>Read the slide's last two lines carefully — they are exam gold.</strong> "Either of these policies can be used with either write through or write back." Then: "<strong>No write allocate</strong> is most commonly used with <strong>write through</strong>"; "<strong>Write allocate</strong> is most commonly used with <strong>write back</strong>." All four combinations are legal; two are usual.</li>
<li><strong>Why write-back pairs with write-allocate.</strong> Write back only makes sense if the line lives in the cache — that is where the updates accumulate. Refusing to allocate would mean writing straight to memory, which is write-through behaviour. The pairing is almost forced by the logic.</li>
<li><strong>Why write-through pairs with no-write-allocate.</strong> Under write through the word goes to memory anyway, so pulling the whole block into the cache buys nothing immediately — it only pays off if a later access hits. Skipping the fetch saves a block read on every write miss.</li>
<li><strong>The array-initialisation case shows the stakes.</strong> <code>for (i = 0; i &lt; N; i++) a[i] = 0;</code> writes every byte and reads none. With write allocate the cache dutifully fetches each block from memory <em>just to overwrite all of it</em> — pure wasted bandwidth. Real hardware fixes this with "write allocate without fetch" (allocate the line, mark all bytes written) or with non-temporal store instructions.</li>
<li><strong>Four policy knobs, one line of cache.</strong> Counting slides 28 and 29 together, a cache line's write behaviour is fully described by two independent choices: hit → through / back, miss → allocate / no-allocate. An exam can ask about any of the four combinations, so learn them as a 2×2, not as a list.</li>
</ul>
<p class="nhan">Worked mini-problem — the 2×2 in numbers</p>
<p>A write miss on a cache with 16-byte lines. Count the bytes moved on the bus for each combination (assume the word being written is 4 bytes).</p>
<table>
<tr><th>Combination</th><th>Block read in?</th><th>Word written to memory now?</th><th>Bytes on the bus now</th></tr>
<tr><td>Write through + no write allocate</td><td>no</td><td>yes</td><td><strong>4</strong></td></tr>
<tr><td>Write through + write allocate</td><td>yes (16)</td><td>yes (4)</td><td><strong>20</strong></td></tr>
<tr><td>Write back + write allocate</td><td>yes (16)</td><td>no (deferred)</td><td><strong>16</strong></td></tr>
<tr><td>Write back + no write allocate</td><td>no</td><td>yes</td><td><strong>4</strong> (but then the cache never caches writes — rare)</td></tr>
</table>
<p class="dap-an">✅ Answer: the cheapest single write miss is <strong>write-through + no-write-allocate (4 bytes)</strong>; the most expensive is <strong>write-through + write-allocate (20 bytes)</strong> — which is precisely why that combination is the one nobody uses. But "cheapest now" is not "cheapest overall": write back + write allocate costs 16 bytes now and then serves an unlimited number of subsequent writes to that line for free.</p>
<p class="meo">💡 Two questions, two answers, and they are independent: <strong>"WHERE does a hit go?" → through/back. "DO we fetch on a miss?" → allocate/no-allocate.</strong> Do not let the four names blur into one list.</p>
<p class="pitfall">⚠️ Common confusion: write-allocate is sometimes called "fetch-on-write" and no-write-allocate "write-around". If an exam uses those names it is asking about this slide — do not treat them as a fifth and sixth policy.</p>`,
        `<p class="y-chinh">🎯 Một câu hỏi KHÁC với slide 28. Slide 28 hỏi "khi ghi TRÚNG thì dữ liệu đi đâu?". Slide này hỏi: <strong>khi ghi TRƯỢT, có nạp khối vào cache không?</strong> Hai câu trả lời, và slide nói rõ cái nào đi với cái nào.</p>
<table>
<tr><th></th><th>Write allocate (nạp khi ghi)</th><th>No write allocate (không nạp khi ghi)</th></tr>
<tr><td>Định nghĩa của slide</td><td>khối chứa từ cần ghi được <strong>nạp từ bộ nhớ chính (hoặc cache mức kế tiếp) vào cache</strong>, rồi bộ xử lý mới tiến hành chu kỳ ghi</td><td>khối chứa từ cần ghi được <strong>sửa ngay trong bộ nhớ chính và KHÔNG nạp vào cache</strong></td></tr>
<tr><td>Chi phí của chính lần trượt đó</td><td>một lần đọc khối, rồi mới ghi</td><td>một lần ghi từ, không đọc khối</td></tr>
<tr><td>Có lời khi…</td><td>chương trình sắp đọc hoặc ghi lại dòng đó (cục bộ không gian + thời gian)</td><td>chương trình ghi một lần rồi đi luôn (ví dụ khởi tạo mảng khổng lồ, ghi dòng dữ liệu ra)</td></tr>
<tr><td>Thường đi kèm</td><td><strong>write back</strong></td><td><strong>write through</strong></td></tr>
</table>
<ul>
<li><strong>Đọc kỹ hai dòng cuối của slide — đó là vàng cho đề thi.</strong> "Cả hai chính sách này đều dùng được với cả write through lẫn write back." Rồi: "<strong>No write allocate</strong> thường dùng nhất với <strong>write through</strong>"; "<strong>Write allocate</strong> thường dùng nhất với <strong>write back</strong>." Cả BỐN tổ hợp đều hợp lệ; HAI tổ hợp là thông dụng.</li>
<li><strong>Vì sao write back đi với write allocate.</strong> Write back chỉ có nghĩa nếu dòng NẰM TRONG cache — đó là chỗ các lần cập nhật tích lại. Không nạp thì hoá ra ghi thẳng xuống bộ nhớ, mà đó là hành vi của write through. Cặp đôi này gần như bị chính logic ép buộc.</li>
<li><strong>Vì sao write through đi với no write allocate.</strong> Dưới write through thì từ nhớ dù sao cũng xuống bộ nhớ, nên kéo cả khối vào cache chẳng lợi gì ngay lúc đó — nó chỉ có lời nếu về sau có lần truy cập trúng. Bỏ bước nạp là tiết kiệm một lần đọc khối ở MỌI lần ghi trượt.</li>
<li><strong>Trường hợp khởi tạo mảng cho thấy mức độ nghiêm trọng.</strong> <code>for (i = 0; i &lt; N; i++) a[i] = 0;</code> ghi mọi byte và không đọc byte nào. Với write allocate, cache ngoan ngoãn nạp từng khối từ bộ nhớ về <em>chỉ để ghi đè lên toàn bộ nó</em> — băng thông vứt đi hoàn toàn. Phần cứng thật vá bằng "write allocate không nạp" (cấp dòng, đánh dấu mọi byte đã ghi) hoặc bằng lệnh store non-temporal.</li>
<li><strong>Bốn núm vặn, một dòng cache.</strong> Gộp slide 28 và 29 lại, hành vi ghi của một dòng cache được mô tả trọn vẹn bằng HAI lựa chọn độc lập: trúng → through/back, trượt → allocate/no-allocate. Đề có thể hỏi bất kỳ tổ hợp nào trong bốn, nên hãy học nó như một BẢNG 2×2, đừng học như một danh sách.</li>
</ul>
<p class="nhan">Bài nhỏ — bảng 2×2 quy ra số</p>
<p>Một lần ghi TRƯỢT trên cache có dòng 16 byte. Đếm số byte đi trên bus cho từng tổ hợp (giả sử từ cần ghi dài 4 byte).</p>
<table>
<tr><th>Tổ hợp</th><th>Có nạp khối vào?</th><th>Có ghi từ xuống bộ nhớ ngay?</th><th>Số byte trên bus lúc này</th></tr>
<tr><td>Write through + no write allocate</td><td>không</td><td>có</td><td><strong>4</strong></td></tr>
<tr><td>Write through + write allocate</td><td>có (16)</td><td>có (4)</td><td><strong>20</strong></td></tr>
<tr><td>Write back + write allocate</td><td>có (16)</td><td>không (hoãn lại)</td><td><strong>16</strong></td></tr>
<tr><td>Write back + no write allocate</td><td>không</td><td>có</td><td><strong>4</strong> (nhưng rồi cache chẳng bao giờ giữ lần ghi nào — hiếm dùng)</td></tr>
</table>
<p class="dap-an">✅ Đáp án: một lần ghi trượt RẺ NHẤT là <strong>write through + no write allocate (4 byte)</strong>; ĐẮT NHẤT là <strong>write through + write allocate (20 byte)</strong> — chính xác là lý do không ai dùng tổ hợp đó. Nhưng "rẻ nhất lúc này" không phải "rẻ nhất tổng thể": write back + write allocate tốn 16 byte bây giờ rồi phục vụ MIỄN PHÍ vô số lần ghi tiếp theo vào dòng đó.</p>
<p class="meo">💡 Hai câu hỏi, hai câu trả lời, và chúng ĐỘC LẬP: <strong>"Khi TRÚNG thì dữ liệu ĐI ĐÂU?" → through/back. "Khi TRƯỢT thì CÓ NẠP không?" → allocate/no-allocate.</strong> Đừng để bốn cái tên nhoè thành một danh sách.</p>
<p class="pitfall">⚠️ Chỗ hay lẫn: write-allocate đôi khi được gọi là "fetch-on-write", còn no-write-allocate gọi là "write-around". Nếu đề dùng hai tên đó thì nó vẫn đang hỏi slide này — đừng coi chúng là chính sách thứ năm, thứ sáu.</p>`],

      [30, 'Cache Coherency — the problem write policy cannot solve alone',
        `<p class="y-chinh">🎯 The moment a second cache exists, "is my copy correct?" stops being a local question. The slide's framing: <strong>if data in one cache are altered, this invalidates not only the corresponding word in main memory, but also that same word in other caches</strong> — and it adds the killer line: <strong>even if a write-through policy is used, the other caches may contain invalid data</strong>.</p>
<table>
<tr><th>Approach on the slide</th><th>How it works</th><th>What it depends on / costs</th></tr>
<tr><td><strong>Bus watching with write through</strong> (bus snooping)</td><td>Each cache controller monitors the address lines to detect write operations to memory by other bus masters. If another master writes to a location in shared memory that also resides in this cache, the controller <strong>invalidates that cache entry</strong></td><td>"This strategy <strong>depends on the use of a write-through policy by all cache controllers</strong>" — every write must be visible on the bus</td></tr>
<tr><td><strong>Hardware transparency</strong></td><td>Additional hardware ensures that all updates to main memory via cache are reflected in all caches. If one processor modifies a word in its cache, this update is written to main memory <em>and</em> propagated</td><td>extra hardware; scales badly as processor count rises</td></tr>
<tr><td><strong>Noncacheable memory</strong></td><td>Only a portion of main memory is shared by more than one processor, and that portion is designated <strong>noncacheable</strong>. All accesses to shared memory are cache misses, because it is never copied into any cache</td><td>identified using <strong>chip-select logic or high-address bits</strong>; correct but slow — the shared data never gets cached at all</td></tr>
</table>
<ul>
<li><strong>Why write-through alone is not enough — this is the sentence to memorise.</strong> Write through guarantees <em>main memory</em> is up to date. It guarantees nothing about the private cache of another processor, which may still hold the old value and will never notice. Freshness at the destination does not imply freshness at every other copy.</li>
<li><strong>Snooping is the one that survived.</strong> Every modern multicore does a descendant of "bus watching": the MESI protocol, where each line carries a state — <strong>M</strong>odified, <strong>E</strong>xclusive, <strong>S</strong>hared, <strong>I</strong>nvalid — and caches broadcast/observe transactions to move lines between states. That is the direct continuation of this slide, taught in <strong>Chapter 21, Multicore Computers</strong> (Ch.18 in the school's syllabus numbering).</li>
<li><strong>Noncacheable memory is the "give up and be correct" option</strong>, and it is still used today — memory-mapped I/O registers are marked uncacheable for exactly this reason. You would never mark ordinary shared data uncacheable; the performance loss would be total.</li>
<li><strong>Coherence is about <em>values</em>, consistency is about <em>order</em>.</strong> Coherence asks "do all caches eventually agree on the value of address X?" Memory consistency asks "in what order do writes to <em>different</em> addresses become visible?" This slide is only about the first. The second is a harder topic and belongs to the multicore chapter.</li>
<li><strong>Notice how this closes the chapter's arc.</strong> Cache exists because one processor is faster than memory (Ch.4). The moment you have many processors, the private copy that made each one fast becomes the thing that can make them all wrong. Every optimisation in this chapter has a correctness bill, and this slide is where it arrives.</li>
</ul>
<p class="meo">💡 Three approaches, three attitudes: <strong>watch (snoop) · propagate (hardware transparency) · refuse (noncacheable)</strong>. Modern hardware picked "watch"; modern operating systems still use "refuse" for device registers.</p>
<p class="pitfall">⚠️ Exam trap built straight into this slide: "write-through solves cache coherency." <strong>False</strong>, and the slide says so explicitly. Write-through is a <em>prerequisite</em> for the bus-watching scheme, not a solution by itself.</p>`,
        `<p class="y-chinh">🎯 Ngay khi có cache thứ hai, câu "bản sao của tôi có đúng không?" thôi là câu hỏi cục bộ. Cách slide đóng khung: <strong>nếu dữ liệu trong một cache bị sửa, nó làm mất hiệu lực không chỉ từ nhớ tương ứng trong bộ nhớ chính, mà cả CHÍNH TỪ ĐÓ trong các cache khác</strong> — và slide bồi thêm câu chí mạng: <strong>ngay cả khi dùng chính sách write through, các cache khác vẫn có thể chứa dữ liệu không hợp lệ</strong>.</p>
<table>
<tr><th>Cách tiếp cận trên slide</th><th>Hoạt động thế nào</th><th>Phụ thuộc gì / giá phải trả</th></tr>
<tr><td><strong>Theo dõi bus với write through</strong> (bus snooping)</td><td>Mỗi bộ điều khiển cache canh các đường địa chỉ để phát hiện thao tác ghi xuống bộ nhớ của các bus master khác. Nếu một master khác ghi vào vị trí trong vùng nhớ dùng chung mà vị trí đó cũng đang nằm trong cache này, bộ điều khiển <strong>làm mất hiệu lực mục cache đó</strong></td><td>"Chiến lược này <strong>phụ thuộc vào việc MỌI bộ điều khiển cache đều dùng write through</strong>" — mọi lần ghi phải hiện ra trên bus</td></tr>
<tr><td><strong>Trong suốt bằng phần cứng</strong></td><td>Thêm phần cứng để bảo đảm mọi cập nhật xuống bộ nhớ chính qua cache đều được phản ánh ở TẤT CẢ các cache. Một bộ xử lý sửa một từ trong cache của nó thì cập nhật đó được ghi xuống bộ nhớ chính <em>và</em> lan ra</td><td>tốn phần cứng thêm; càng nhiều bộ xử lý càng khó mở rộng</td></tr>
<tr><td><strong>Bộ nhớ không cache được</strong></td><td>Chỉ một phần bộ nhớ chính là dùng chung giữa nhiều bộ xử lý, và phần đó được khai là <strong>không cache được</strong>. Mọi truy cập vào vùng dùng chung đều là trượt cache, vì nó không bao giờ được chép vào cache</td><td>nhận diện bằng <strong>logic chip-select hoặc các bit địa chỉ cao</strong>; đúng nhưng chậm — dữ liệu dùng chung không bao giờ được cache</td></tr>
</table>
<ul>
<li><strong>Vì sao chỉ write through là chưa đủ — đây là câu phải thuộc.</strong> Write through bảo đảm <em>bộ nhớ chính</em> luôn mới. Nó KHÔNG bảo đảm gì về cache riêng của bộ xử lý khác, nơi vẫn có thể đang giữ giá trị cũ và sẽ không bao giờ tự biết. Tươi ở ĐÍCH không suy ra tươi ở MỌI BẢN SAO KHÁC.</li>
<li><strong>Snooping mới là cái sống sót.</strong> Mọi chip đa lõi hiện đại đều dùng hậu duệ của "theo dõi bus": giao thức MESI, mỗi dòng mang một trạng thái — <strong>M</strong>odified, <strong>E</strong>xclusive, <strong>S</strong>hared, <strong>I</strong>nvalid — và các cache phát/nghe các giao dịch để chuyển dòng giữa các trạng thái. Đó là phần tiếp nối trực tiếp của slide này, dạy ở <strong>Chương 21, Máy tính đa lõi</strong> (Ch.18 theo cách đánh số của syllabus trường).</li>
<li><strong>Bộ nhớ không cache được là phương án "chịu thua để đúng"</strong>, và nó vẫn dùng tới hôm nay — các thanh ghi I/O ánh xạ bộ nhớ được đánh dấu uncacheable đúng vì lý do này. Nhưng sẽ không ai đánh dấu dữ liệu dùng chung thông thường là không cache được; mất hiệu năng sẽ là toàn phần.</li>
<li><strong>Nhất quán (coherence) nói về GIÁ TRỊ, còn consistency nói về THỨ TỰ.</strong> Coherence hỏi "mọi cache rốt cuộc có đồng ý về giá trị của địa chỉ X không?". Memory consistency hỏi "các lần ghi vào những địa chỉ KHÁC NHAU trở nên thấy được theo thứ tự nào?". Slide này chỉ nói cái thứ nhất. Cái thứ hai khó hơn và thuộc chương đa lõi.</li>
<li><strong>Để ý cách nó khép vòng cung của cả chương.</strong> Cache tồn tại vì một bộ xử lý nhanh hơn bộ nhớ (Ch.4). Ngay khi có nhiều bộ xử lý, chính cái bản sao riêng làm mỗi con nhanh lên lại trở thành thứ có thể làm tất cả cùng SAI. Mọi tối ưu trong chương này đều có một hoá đơn về tính đúng, và slide này là lúc hoá đơn tới.</li>
</ul>
<p class="meo">💡 Ba cách, ba thái độ: <strong>RÌNH (snoop) · LAN TRUYỀN (trong suốt bằng phần cứng) · TỪ CHỐI (không cache được)</strong>. Phần cứng hiện đại chọn "rình"; hệ điều hành hiện đại vẫn dùng "từ chối" cho thanh ghi thiết bị.</p>
<p class="pitfall">⚠️ Bẫy đề thi gài sẵn trong slide này: "write through giải quyết được vấn đề nhất quán cache". <strong>SAI</strong>, và slide nói thẳng điều đó. Write through là ĐIỀU KIỆN CẦN cho cơ chế theo dõi bus, không phải lời giải tự thân.</p>`],

      [31, 'Line Size — the U-shaped curve nobody draws',
        `<p class="y-chinh">🎯 Block size has an <strong>optimum, not a direction</strong>. The slide walks the argument in five steps along an arrow: bigger lines help because of locality — until they stop helping, and then they hurt.</p>
<table>
<tr><th>Step on the arrow</th><th>The slide's words</th></tr>
<tr><td>1</td><td>When a block of data is retrieved and placed in the cache, not only the desired word but also <strong>some number of adjacent words</strong> are retrieved</td></tr>
<tr><td>2</td><td>As the block size increases, the hit ratio will <strong>at first increase</strong> because of the principle of locality</td></tr>
<tr><td>3</td><td>As the block size increases, <strong>more useful data</strong> are brought into the cache</td></tr>
<tr><td>4</td><td>The hit ratio will <strong>begin to decrease</strong> as the block becomes bigger and the probability of using the newly fetched information becomes <em>less than</em> the probability of reusing the information that has to be replaced</td></tr>
<tr><td>5</td><td>Two specific effects come into play: <strong>(a)</strong> larger blocks reduce the number of blocks that fit into a cache; <strong>(b)</strong> as a block becomes larger, each additional word is <strong>farther from the requested word</strong></td></tr>
</table>
<ul>
<li><strong>Step 4 is the whole slide in one sentence.</strong> Every byte you prefetch into a line is a bet on spatial locality. Small bets usually pay. Past some size, the bet is worse than the thing it displaces — and the hit ratio turns downward. The curve is U-shaped (inverted-U in hit ratio), and the minimum is what designers hunt.</li>
<li><strong>Effect (a) — fewer blocks fit.</strong> A fixed 32 kB cache holds 512 lines of 64 B or 256 lines of 128 B. Doubling the line size halves the number of <em>distinct</em> memory regions the cache can track at once, which raises conflict and capacity misses.</li>
<li><strong>Effect (b) — distance weakens the bet.</strong> Spatial locality is strong for the next few words and fades with distance. The 60th word of a 64-word line is very unlikely to be used before the line is evicted, yet the whole line had to be read from memory. That is wasted bandwidth and a longer miss penalty.</li>
<li><strong>Line size also sets the Word field.</strong> Everything you learned on slide 23 depends on it: Word bits = log<sub>2</sub>(line size in bytes). Double the line size and you take a bit from the Tag+Set budget — with the number of sets fixed, that bit comes out of the Tag.</li>
<li><strong>Real numbers, measured on the machine this lesson was written on:</strong> <code>sysctl hw.cachelinesize</code> on an Apple M1 Max returns <strong>128</strong> bytes. Intel and AMD x86 have used <strong>64</strong> bytes for two decades. Stallings notes 8 to 64 bytes as "reasonably close to optimum" — the industry converged on the upper end of that range and stayed.</li>
</ul>
<p class="nhan">Worked mini-problem — what doubling the line does to the address split</p>
<p>32 kB cache, 4-way, 32-bit address. Compare 64-byte lines with 128-byte lines.</p>
<table>
<tr><th></th><th>64-byte lines</th><th>128-byte lines</th></tr>
<tr><td>Lines</td><td>32768/64 = 512</td><td>32768/128 = 256</td></tr>
<tr><td>Sets (÷4)</td><td>128 = 2<sup>7</sup></td><td>64 = 2<sup>6</sup></td></tr>
<tr><td>Word bits</td><td>log<sub>2</sub>64 = <strong>6</strong></td><td>log<sub>2</sub>128 = <strong>7</strong></td></tr>
<tr><td>Set bits</td><td><strong>7</strong></td><td><strong>6</strong></td></tr>
<tr><td>Tag bits</td><td>32−7−6 = <strong>19</strong></td><td>32−6−7 = <strong>19</strong></td></tr>
<tr><td>Total tag storage</td><td>512 × 19 = 9728 bits</td><td>256 × 19 = 4864 bits</td></tr>
</table>
<p class="dap-an">✅ Answer: the Tag stays 19 bits (Word gains the bit that Set loses), but the <strong>number of lines halves, so total tag storage halves too</strong> — a real hardware saving of 4864 bits. That saving is exactly why designers like big lines, and effects (a) and (b) are exactly why they stop at 64 or 128 bytes.</p>
<p class="meo">💡 Remember it as a bet: <strong>a cache line is a wager that the neighbours will be needed. Longer lines = a bigger wager on weaker odds.</strong></p>
<p class="pitfall">⚠️ Do not confuse line size with cache size. Line size affects <em>spatial</em> locality exploitation and the Word field; cache size affects <em>capacity</em> and the Set field. An exam question that changes one and asks about the other is testing precisely this distinction.</p>`,
        `<p class="y-chinh">🎯 Kích thước khối có <strong>một ĐIỂM TỐI ƯU, không phải một chiều "càng lớn càng tốt"</strong>. Slide đi năm bước dọc theo một mũi tên: dòng dài hơn thì có lợi nhờ tính cục bộ — cho tới lúc hết lợi, rồi thành hại.</p>
<table>
<tr><th>Bước trên mũi tên</th><th>Nguyên văn của slide</th></tr>
<tr><td>1</td><td>Khi một khối dữ liệu được lấy về và đặt vào cache, không chỉ từ cần dùng mà cả <strong>một số từ LÂN CẬN</strong> cũng được lấy về</td></tr>
<tr><td>2</td><td>Khi kích thước khối tăng, tỉ lệ trúng <strong>BAN ĐẦU sẽ TĂNG</strong> nhờ nguyên lý cục bộ</td></tr>
<tr><td>3</td><td>Khối càng lớn thì <strong>càng nhiều dữ liệu hữu ích</strong> được đưa vào cache</td></tr>
<tr><td>4</td><td>Tỉ lệ trúng sẽ <strong>BẮT ĐẦU GIẢM</strong> khi khối lớn dần và xác suất dùng thông tin vừa nạp về trở nên <em>NHỎ HƠN</em> xác suất dùng lại thông tin vừa bị thay ra</td></tr>
<tr><td>5</td><td>Hai hiệu ứng cụ thể phát huy tác dụng: <strong>(a)</strong> khối lớn hơn làm GIẢM số khối chứa vừa trong cache; <strong>(b)</strong> khối càng lớn thì mỗi từ thêm vào càng <strong>XA từ được yêu cầu</strong></td></tr>
</table>
<ul>
<li><strong>Bước 4 là toàn bộ slide gói trong một câu.</strong> Mỗi byte bạn nạp trước vào một dòng là một VÁN CƯỢC vào tính cục bộ không gian. Cược nhỏ thì thường thắng. Quá một cỡ nào đó, ván cược tệ hơn cái mà nó hất ra — và tỉ lệ trúng quay đầu đi xuống. Đường cong hình chữ U (chữ U ngược nếu vẽ tỉ lệ trúng), và người thiết kế đi săn cái đáy đó.</li>
<li><strong>Hiệu ứng (a) — chứa được ít khối hơn.</strong> Một cache 32 kB cố định chứa 512 dòng 64 B hoặc 256 dòng 128 B. Nhân đôi kích thước dòng là giảm nửa số VÙNG NHỚ RIÊNG BIỆT mà cache theo dõi được cùng lúc, làm tăng trượt do đụng độ và do hết chỗ.</li>
<li><strong>Hiệu ứng (b) — càng xa thì cược càng kém.</strong> Tính cục bộ không gian mạnh với vài từ kế tiếp rồi nhạt dần theo khoảng cách. Từ thứ 60 của một dòng 64 từ rất khó được dùng trước khi dòng bị đuổi, vậy mà cả dòng vẫn phải đọc từ bộ nhớ về. Đó là băng thông vứt đi và hình phạt trượt dài ra.</li>
<li><strong>Kích thước dòng còn quyết định trường Word.</strong> Mọi thứ bạn học ở slide 23 phụ thuộc vào nó: số bit Word = log<sub>2</sub>(số byte một dòng). Nhân đôi kích thước dòng là lấy đi một bit khỏi ngân sách Tag+Set — nếu giữ nguyên số tập thì bit đó bị trừ vào Tag.</li>
<li><strong>Số thật, đo trên chính cái máy viết bài này:</strong> <code>sysctl hw.cachelinesize</code> trên Apple M1 Max trả về <strong>128</strong> byte. Intel và AMD x86 dùng <strong>64</strong> byte suốt hai chục năm. Stallings ghi 8 tới 64 byte là "khá gần tối ưu" — ngành công nghiệp hội tụ về đầu trên của dải đó rồi dừng lại.</li>
</ul>
<p class="nhan">Bài nhỏ — nhân đôi kích thước dòng thì cách chia địa chỉ đổi thế nào</p>
<p>Cache 32 kB, 4 đường, địa chỉ 32 bit. So dòng 64 byte với dòng 128 byte.</p>
<table>
<tr><th></th><th>Dòng 64 byte</th><th>Dòng 128 byte</th></tr>
<tr><td>Số dòng</td><td>32768/64 = 512</td><td>32768/128 = 256</td></tr>
<tr><td>Số tập (÷4)</td><td>128 = 2<sup>7</sup></td><td>64 = 2<sup>6</sup></td></tr>
<tr><td>Bit Word</td><td>log<sub>2</sub>64 = <strong>6</strong></td><td>log<sub>2</sub>128 = <strong>7</strong></td></tr>
<tr><td>Bit Set</td><td><strong>7</strong></td><td><strong>6</strong></td></tr>
<tr><td>Bit Tag</td><td>32−7−6 = <strong>19</strong></td><td>32−6−7 = <strong>19</strong></td></tr>
<tr><td>Tổng bit tag phải lưu</td><td>512 × 19 = 9728 bit</td><td>256 × 19 = 4864 bit</td></tr>
</table>
<p class="dap-an">✅ Đáp án: Tag vẫn 19 bit (Word ăn đúng cái bit mà Set mất), nhưng <strong>số dòng giảm một nửa nên tổng bit tag cũng giảm một nửa</strong> — tiết kiệm thật 4864 bit phần cứng. Khoản tiết kiệm đó chính là lý do người thiết kế thích dòng dài, còn hiệu ứng (a) và (b) chính là lý do họ dừng ở 64 hoặc 128 byte.</p>
<p class="meo">💡 Nhớ nó như một ván cược: <strong>một dòng cache là lời cá rằng hàng xóm sẽ được dùng tới. Dòng càng dài = cược càng lớn vào tỉ lệ càng thấp.</strong></p>
<p class="pitfall">⚠️ Đừng lẫn kích thước DÒNG với kích thước CACHE. Kích thước dòng ảnh hưởng tới việc khai thác cục bộ KHÔNG GIAN và trường Word; kích thước cache ảnh hưởng tới SỨC CHỨA và trường Set. Câu hỏi đổi cái này rồi hỏi cái kia là đang kiểm tra đúng chỗ phân biệt đó.</p>`],

      [32, 'Multilevel Caches — why L1 is small and L2/L3 are big',
        `<p class="y-chinh">🎯 Logic density made it possible to put cache <strong>on the same chip as the processor</strong>, and that single fact forced the hierarchy we still use: a tiny, brutally fast L1 next to the core, backed by progressively larger and slower levels.</p>
<table>
<tr><th>The slide's claim</th><th>Why it follows</th></tr>
<tr><td>The on-chip cache <strong>reduces the processor's external bus activity</strong> and speeds up execution time</td><td>a hit never leaves the die — no bus arbitration, no chip-crossing delay</td></tr>
<tr><td>When the requested instruction or data is found in the on-chip cache, <strong>the bus access is eliminated</strong></td><td>and "during this period the bus is <strong>free to support other transfers</strong>" — which is what lets DMA and other masters proceed in parallel</td></tr>
<tr><td>On-chip cache accesses complete <strong>appreciably faster</strong> than even zero-wait-state bus cycles</td><td>the bus protocol itself has a floor; on-die SRAM does not pay it</td></tr>
<tr><td>Two-level cache: internal = <strong>L1</strong>, external = <strong>L2</strong></td><td>the historical split; today L2 and L3 are also on-die</td></tr>
<tr><td>Potential savings from L2 <strong>depend on the hit rates in BOTH L1 and L2</strong></td><td>quantified on slide 33</td></tr>
<tr><td>Multilevel caches <strong>complicate all design issues</strong> — size, replacement algorithm, write policy</td><td>every choice from slides 23–31 must now be made once per level, and the levels interact</td></tr>
</table>
<ul>
<li><strong>Why L1 must be small — this is the question exams ask.</strong> Hit time grows with size: more lines means a longer index decode, longer word lines, more capacitance, and a longer tag-compare path. L1 sits inside the load-use path of the pipeline, so its latency is measured in <em>single cycles</em>. The only way to be that fast is to be that small. Slide 10 said the same thing from the other side: "the larger the cache, the larger the number of gates involved in addressing it, resulting in large caches being slightly slower than small ones."</li>
<li><strong>Why L2/L3 may be large.</strong> They are only consulted on an L1 miss, which is rare (h<sub>1</sub> ≈ 0.95). A level that is consulted 5% of the time can afford to take 12–40 cycles, so it may trade latency for capacity and higher associativity.</li>
<li><strong>The hierarchy is an application of Chapter 4's average-access-time formula.</strong> T<sub>a</sub> = t<sub>1</sub> + (1−h<sub>1</sub>)·[t<sub>2</sub> + (1−h<sub>2</sub>)·t<sub>mem</sub>]. Each extra level multiplies the penalty term by another small miss rate — so L3 shrinks the memory penalty even though L3 itself is slow.</li>
<li><strong>Real measurement — the machine this lesson was written on.</strong> <code>sysctl hw.perflevel0.*</code> on an <strong>Apple M1 Max</strong> reports, per performance core: <strong>L1 instruction 192 kB, L1 data 128 kB</strong>, and an <strong>L2 of 12 MB shared by each cluster of 4 P-cores</strong>. The 2 efficiency cores report L1i 128 kB, L1d 64 kB and a 4 MB shared L2. Cache line: 128 bytes. Those are measured values, not quoted ones.</li>
<li><strong>Read that measurement against the slide's era.</strong> Table 5.2 (slide 11) lists 8 kB L1 for a Pentium and 8 × 32 kB/32 kB for a Core i7. The M1 Max's 192 kB L1i is an order of magnitude larger than the Pentium's — yet still tiny beside its own 12 MB L2. The <em>ratio</em> between levels has been remarkably stable for thirty years even as absolute sizes exploded.</li>
</ul>
<p class="nhan">Worked mini-problem — what a second level actually buys</p>
<p>L1 hit time 1 cycle, h<sub>1</sub> = 0.95. Main memory 100 cycles. Now add an L2 with hit time 10 cycles and h<sub>2</sub> = 0.80 (of the accesses that reach it).</p>
<ul>
<li><strong>Without L2:</strong> T<sub>a</sub> = 1 + 0.05 × 100 = <strong>6.0 cycles</strong>.</li>
<li><strong>With L2:</strong> T<sub>a</sub> = 1 + 0.05 × [10 + 0.20 × 100] = 1 + 0.05 × 30 = <strong>2.5 cycles</strong>.</li>
</ul>
<p class="dap-an">✅ Answer: average access time drops from 6.0 to <strong>2.5 cycles — a 2.4× improvement</strong> from a level that is ten times slower than L1 and is consulted only 5% of the time. That is the whole argument for a hierarchy in one calculation: a slow level is cheap when it is rarely visited.</p>
<p class="meo">💡 One sentence: <strong>L1 is sized by LATENCY, L2/L3 are sized by CAPACITY.</strong> Anything that must answer in one cycle must be small; anything consulted 5% of the time may be enormous.</p>
<p class="pitfall">⚠️ Watch the definition of h<sub>2</sub>. It is almost always the <em>local</em> hit rate — hits in L2 divided by accesses that <em>reach</em> L2 — not hits divided by all processor accesses. Using the wrong one turns 2.5 cycles into a badly wrong number. If a question does not say, state the assumption you used.</p>`,
        `<p class="y-chinh">🎯 Mật độ logic tăng làm cho việc đặt cache <strong>NGAY TRÊN CÙNG CHIP với bộ xử lý</strong> trở nên khả thi, và đúng sự kiện đó ép ra cái phân cấp ta còn dùng tới hôm nay: một L1 tí hon nhanh tàn bạo sát lõi, phía sau là các mức lớn dần và chậm dần.</p>
<table>
<tr><th>Khẳng định của slide</th><th>Vì sao nó đúng</th></tr>
<tr><td>Cache trên chip <strong>giảm hoạt động bus ngoài</strong> của bộ xử lý và tăng tốc thời gian thi hành</td><td>một lần trúng không hề rời khỏi miếng silicon — không tranh bus, không trễ vượt chip</td></tr>
<tr><td>Khi lệnh hay dữ liệu cần tìm nằm trong cache trên chip thì <strong>lần truy cập bus bị loại bỏ</strong></td><td>và "trong khoảng đó bus <strong>rảnh để phục vụ các luồng truyền khác</strong>" — chính điều này cho DMA và các master khác chạy song song</td></tr>
<tr><td>Truy cập cache trên chip xong <strong>nhanh hơn ĐÁNG KỂ</strong> so với cả chu kỳ bus không có trạng thái chờ</td><td>bản thân giao thức bus có một sàn thời gian; SRAM trên chip không phải trả cái sàn đó</td></tr>
<tr><td>Cache hai mức: bên trong = <strong>L1</strong>, bên ngoài = <strong>L2</strong></td><td>cách chia lịch sử; ngày nay L2 và L3 cũng nằm trên chip</td></tr>
<tr><td>Khoản tiết kiệm nhờ L2 <strong>phụ thuộc tỉ lệ trúng của CẢ L1 LẪN L2</strong></td><td>được định lượng ở slide 33</td></tr>
<tr><td>Cache nhiều mức <strong>làm phức tạp MỌI vấn đề thiết kế</strong> — kích thước, thuật toán thay thế, chính sách ghi</td><td>mọi lựa chọn từ slide 23–31 giờ phải làm lại MỘT LẦN CHO MỖI MỨC, mà các mức lại tương tác với nhau</td></tr>
</table>
<ul>
<li><strong>Vì sao L1 buộc phải NHỎ — đây là câu đề hay hỏi.</strong> Thời gian trúng tăng theo kích thước: nhiều dòng hơn nghĩa là giải mã chỉ số dài hơn, đường từ dài hơn, điện dung lớn hơn, đường so tag dài hơn. L1 nằm ngay trong đường nạp-dùng của pipeline nên độ trễ của nó đo bằng <em>vài chu kỳ đơn</em>. Cách duy nhất để nhanh đến thế là phải nhỏ đến thế. Slide 10 nói đúng điều đó từ phía kia: "cache càng lớn thì số cổng tham gia việc định địa chỉ càng nhiều, khiến cache lớn hơi chậm hơn cache nhỏ".</li>
<li><strong>Vì sao L2/L3 được phép LỚN.</strong> Chúng chỉ bị hỏi tới khi L1 trượt, mà chuyện đó hiếm (h<sub>1</sub> ≈ 0,95). Một mức chỉ bị hỏi 5% số lần thì có quyền tốn 12–40 chu kỳ, nên nó đổi độ trễ lấy dung lượng và độ liên kết cao hơn.</li>
<li><strong>Phân cấp chính là áp dụng công thức thời gian trung bình của Chương 4.</strong> T<sub>a</sub> = t<sub>1</sub> + (1−h<sub>1</sub>)·[t<sub>2</sub> + (1−h<sub>2</sub>)·t<sub>bộ nhớ</sub>]. Mỗi mức thêm vào lại nhân số hạng phạt với một tỉ lệ trượt nhỏ nữa — nên L3 rút được hình phạt bộ nhớ dù bản thân L3 chậm.</li>
<li><strong>Đo thật — chính cái máy viết bài này.</strong> <code>sysctl hw.perflevel0.*</code> trên một <strong>Apple M1 Max</strong> báo, cho mỗi lõi hiệu năng: <strong>L1 lệnh 192 kB, L1 dữ liệu 128 kB</strong>, và một <strong>L2 12 MB dùng chung cho mỗi cụm 4 lõi P</strong>. Hai lõi tiết kiệm báo L1i 128 kB, L1d 64 kB và L2 4 MB dùng chung. Kích thước dòng: 128 byte. Đây là số ĐO ĐƯỢC, không phải số trích dẫn.</li>
<li><strong>Đọc con số đo đó bên cạnh thời của slide.</strong> Table 5.2 (slide 11) ghi L1 8 kB cho Pentium và 6 × 32 kB/32 kB cho Core i7. L1i 192 kB của M1 Max lớn hơn của Pentium cả một bậc — mà vẫn tí hon bên cạnh chính L2 12 MB của nó. <em>TỈ LỆ</em> giữa các mức thì ổn định đến kinh ngạc suốt ba chục năm dù kích thước tuyệt đối nổ tung.</li>
</ul>
<p class="nhan">Bài nhỏ — mức thứ hai thực sự mua được gì</p>
<p>L1 trúng mất 1 chu kỳ, h<sub>1</sub> = 0,95. Bộ nhớ chính 100 chu kỳ. Giờ thêm L2 trúng mất 10 chu kỳ với h<sub>2</sub> = 0,80 (trên số lần truy cập ĐẾN ĐƯỢC nó).</p>
<ul>
<li><strong>Không có L2:</strong> T<sub>a</sub> = 1 + 0,05 × 100 = <strong>6,0 chu kỳ</strong>.</li>
<li><strong>Có L2:</strong> T<sub>a</sub> = 1 + 0,05 × [10 + 0,20 × 100] = 1 + 0,05 × 30 = <strong>2,5 chu kỳ</strong>.</li>
</ul>
<p class="dap-an">✅ Đáp án: thời gian truy cập trung bình tụt từ 6,0 xuống <strong>2,5 chu kỳ — nhanh gấp 2,4 lần</strong>, nhờ một mức chậm gấp mười lần L1 và chỉ bị hỏi tới 5% số lần. Đó là toàn bộ lý lẽ của phân cấp gói trong một phép tính: một mức CHẬM thì RẺ khi nó ÍT bị ghé.</p>
<p class="meo">💡 Một câu: <strong>L1 được định cỡ bởi ĐỘ TRỄ, L2/L3 được định cỡ bởi DUNG LƯỢNG.</strong> Cái gì phải trả lời trong một chu kỳ thì phải nhỏ; cái gì chỉ bị hỏi 5% số lần thì được phép khổng lồ.</p>
<p class="pitfall">⚠️ Coi chừng định nghĩa của h<sub>2</sub>. Nó gần như luôn là tỉ lệ trúng <em>CỤC BỘ</em> — số lần trúng L2 chia cho số lần truy cập ĐẾN ĐƯỢC L2 — chứ không phải chia cho tổng số truy cập của bộ xử lý. Dùng nhầm cái kia là biến 2,5 chu kỳ thành một con số sai hẳn. Nếu đề không nói rõ thì hãy GHI RA giả thiết bạn dùng.</p>`],

      [33, 'Figure 5.16 — Total Hit Ratio (L1 and L2) for 8-kB and 16-kB L1',
        `<p class="y-chinh">🎯 The measurement behind slide 32's last claim. Two curves — an 8 kB L1 and a 16 kB L1 — with total hit ratio plotted against L2 size. The shape tells you <strong>when a second level is worth building, and when a bigger L1 makes it pointless</strong>.</p>
<table>
<tr><th>L2 size</th><th>L1 = 8 kB (solid)</th><th>L1 = 16 kB (dotted)</th><th>Gap</th></tr>
<tr><td>1 k – 8 k</td><td>≈ 0.850 → 0.857</td><td>≈ 0.916 → 0.918</td><td><strong>≈ 0.06</strong> — L2 is doing almost nothing</td></tr>
<tr><td>16 k</td><td>≈ 0.918 (steep climb)</td><td>≈ 0.921</td><td>≈ 0.003</td></tr>
<tr><td>32 k</td><td>≈ 0.932</td><td>≈ 0.934</td><td>≈ 0.002</td></tr>
<tr><td>128 k</td><td>≈ 0.950</td><td>≈ 0.952</td><td>≈ 0.002</td></tr>
<tr><td>1 M – 2 M</td><td>≈ 0.959</td><td>≈ 0.959</td><td><strong>≈ 0.000</strong> — the curves merge</td></tr>
</table>
<p class="nhan">(Values read off the plotted curves and rounded — the slide gives no numeric table.)</p>
<ul>
<li><strong>The flat left end is the headline.</strong> While L2 is smaller than or equal to L1, the second level adds essentially nothing: anything L2 holds, L1 already holds. The solid curve crawls from 0.850 to 0.857 across four doublings of L2 — that is four doublings of silicon for +0.007 hit ratio.</li>
<li><strong>The cliff at 16 k–32 k is where L2 starts earning its keep.</strong> Once L2 is meaningfully larger than L1, it begins catching the working set that L1 cannot hold, and the solid curve leaps from 0.857 to ≈ 0.932. <strong>Design rule: L2 must be several times L1 or it is decoration.</strong> Real hierarchies keep a ratio of roughly 8× to 64× between levels, and the M1 Max measured on slide 32 (128 kB L1d → 12 MB L2) sits at about 94×.</li>
<li><strong>The curves merging at the right is the second lesson.</strong> With a large enough L2, it no longer matters whether L1 is 8 kB or 16 kB — both land on ≈ 0.959. Doubling L1 is only valuable while L2 is small or absent. This is why designers stopped enlarging L1 and started adding levels instead.</li>
<li><strong>Total hit ratio, not L2 hit ratio.</strong> The y-axis is the fraction of <em>all</em> processor accesses satisfied by L1 <em>or</em> L2. That is the number that goes into the average-access-time formula; an "L2 hit ratio" on its own would be meaningless without knowing how many accesses reach L2.</li>
<li><strong>What the chart does not show — and it matters.</strong> Latency. An enormous L2 has a long hit time, so past some size the rising hit ratio is cancelled by the slower hits. That unshown cost is precisely why a third level exists: L3 absorbs the capacity role so L2 can stay fast.</li>
</ul>
<p class="nhan">Worked mini-problem — reading a design decision off this chart</p>
<p>You may spend transistors either on doubling L1 from 8 kB to 16 kB, or on giving the 8 kB L1 a 32 kB L2. Using the curve values, which wins?</p>
<ul>
<li>Double L1, no L2 (leftmost dotted point): total hit ratio ≈ <strong>0.916</strong>.</li>
<li>Keep 8 kB L1, add 32 kB L2 (solid curve at 32 k): ≈ <strong>0.932</strong>.</li>
<li>Miss rates: 0.084 versus 0.068 — the L2 option removes about <strong>19% of the remaining misses</strong>.</li>
</ul>
<p class="dap-an">✅ Answer: <strong>adding L2 wins</strong>, and it wins twice over — the hit ratio is higher <em>and</em> L1 stays 8 kB, so L1 hit time does not grow. That double benefit (better ratio, unchanged L1 latency) is the real reason the industry went multilevel rather than building ever-larger L1s.</p>
<p class="meo">💡 Read the chart as one rule: <strong>a second level only pays when it is much bigger than the first.</strong> Same-size L2 = wasted silicon.</p>
<p class="pitfall">⚠️ Do not quote these as modern numbers. The trace and sizes are from the study the textbook cites; a 2 MB L2 was exotic then and is small now. What transfers is the <em>shape</em> — flat, cliff, plateau, merge — not the absolute hit ratios.</p>`,
        `<p class="y-chinh">🎯 Phép đo đứng sau khẳng định cuối của slide 32. Hai đường cong — L1 8 kB và L1 16 kB — vẽ tỉ lệ trúng TỔNG theo kích thước L2. Hình dáng của nó cho biết <strong>khi nào đáng dựng mức thứ hai, và khi nào một L1 to hơn làm mức thứ hai thành vô nghĩa</strong>.</p>
<table>
<tr><th>Kích thước L2</th><th>L1 = 8 kB (nét liền)</th><th>L1 = 16 kB (nét đứt)</th><th>Khoảng cách</th></tr>
<tr><td>1 k – 8 k</td><td>≈ 0,850 → 0,857</td><td>≈ 0,916 → 0,918</td><td><strong>≈ 0,06</strong> — L2 gần như không làm gì</td></tr>
<tr><td>16 k</td><td>≈ 0,918 (leo dốc đứng)</td><td>≈ 0,921</td><td>≈ 0,003</td></tr>
<tr><td>32 k</td><td>≈ 0,932</td><td>≈ 0,934</td><td>≈ 0,002</td></tr>
<tr><td>128 k</td><td>≈ 0,950</td><td>≈ 0,952</td><td>≈ 0,002</td></tr>
<tr><td>1 M – 2 M</td><td>≈ 0,959</td><td>≈ 0,959</td><td><strong>≈ 0,000</strong> — hai đường nhập một</td></tr>
</table>
<p class="nhan">(Số đọc từ đường cong và làm tròn — slide KHÔNG cho bảng số.)</p>
<ul>
<li><strong>Đoạn PHẲNG bên trái mới là tin chính.</strong> Chừng nào L2 còn nhỏ hơn hoặc bằng L1 thì mức thứ hai gần như không thêm được gì: cái gì L2 giữ thì L1 đã giữ rồi. Đường nét liền bò từ 0,850 lên 0,857 qua BỐN lần nhân đôi L2 — bốn lần nhân đôi silicon để được +0,007 tỉ lệ trúng.</li>
<li><strong>Vách dốc ở 16 k–32 k là lúc L2 bắt đầu đáng đồng tiền.</strong> Khi L2 đã lớn hơn L1 một cách có nghĩa, nó bắt đầu hứng phần tập làm việc mà L1 chứa không nổi, và đường nét liền nhảy từ 0,857 lên ≈ 0,932. <strong>Quy tắc thiết kế: L2 phải LỚN GẤP NHIỀU LẦN L1, không thì chỉ là đồ trang trí.</strong> Phân cấp thật giữ tỉ lệ cỡ 8× tới 64× giữa các mức, và con M1 Max đo ở slide 32 (L1d 128 kB → L2 12 MB) ở mức khoảng 94×.</li>
<li><strong>Hai đường nhập một ở bên phải là bài học thứ hai.</strong> Với L2 đủ lớn thì L1 là 8 kB hay 16 kB không còn quan trọng — cả hai đều đáp xuống ≈ 0,959. Nhân đôi L1 chỉ có giá trị khi L2 còn nhỏ hoặc chưa có. Đó là lý do người thiết kế ngừng phình L1 và chuyển sang THÊM MỨC.</li>
<li><strong>Là tỉ lệ trúng TỔNG, không phải tỉ lệ trúng của L2.</strong> Trục tung là phần trong <em>TOÀN BỘ</em> truy cập của bộ xử lý được L1 <em>hoặc</em> L2 phục vụ. Đó mới là con số đi vào công thức thời gian trung bình; một "tỉ lệ trúng L2" đứng một mình thì vô nghĩa nếu không biết bao nhiêu lần truy cập đến được L2.</li>
<li><strong>Điều biểu đồ KHÔNG vẽ — và nó quan trọng.</strong> ĐỘ TRỄ. Một L2 khổng lồ có thời gian trúng dài, nên quá một cỡ nào đó thì tỉ lệ trúng tăng lên bị chính các lần trúng chậm đi triệt tiêu. Cái giá không vẽ ra đó chính là lý do có mức thứ BA: L3 gánh vai trò dung lượng để L2 được ở lại nhanh.</li>
</ul>
<p class="nhan">Bài nhỏ — đọc một quyết định thiết kế từ biểu đồ này</p>
<p>Bạn được tiêu số transistor hoặc để nhân đôi L1 từ 8 kB lên 16 kB, hoặc để cho cái L1 8 kB đó một L2 32 kB. Dùng giá trị đọc từ đường cong, cái nào thắng?</p>
<ul>
<li>Nhân đôi L1, không có L2 (điểm nét đứt ngoài cùng trái): tỉ lệ trúng tổng ≈ <strong>0,916</strong>.</li>
<li>Giữ L1 8 kB, thêm L2 32 kB (nét liền tại mốc 32 k): ≈ <strong>0,932</strong>.</li>
<li>Tỉ lệ trượt: 0,084 so với 0,068 — phương án L2 xoá được khoảng <strong>19% số lần trượt còn lại</strong>.</li>
</ul>
<p class="dap-an">✅ Đáp án: <strong>thêm L2 thắng</strong>, và thắng kép — tỉ lệ trúng cao hơn <em>đồng thời</em> L1 vẫn 8 kB nên thời gian trúng L1 không phình ra. Lợi ích kép đó (tỉ lệ tốt hơn, độ trễ L1 không đổi) mới là lý do thật khiến ngành đi theo hướng NHIỀU MỨC thay vì xây L1 ngày một to.</p>
<p class="meo">💡 Đọc cả biểu đồ thành một quy tắc: <strong>mức thứ hai chỉ có lời khi nó LỚN HƠN NHIỀU mức thứ nhất.</strong> L2 cùng cỡ L1 = silicon vứt đi.</p>
<p class="pitfall">⚠️ Đừng trích các con số này như số liệu hiện đại. Vết truy cập và kích thước lấy từ nghiên cứu mà sách dẫn; L2 2 MB khi đó là xa xỉ, bây giờ là nhỏ. Thứ mang đi được là <em>HÌNH DÁNG</em> — phẳng, vách dốc, cao nguyên, nhập một — chứ không phải giá trị tuyệt đối.</p>`],

      [34, 'Unified Versus Split Caches — and why pipelining forces the split',
        `<p class="y-chinh">🎯 One cache holding both instructions and data, or two separate caches at the same level? The slide gives both sides fairly, then states the verdict: <strong>the trend is toward split caches at L1 and unified caches for higher levels</strong> — and the reason is one word: <em>pipelining</em>.</p>
<table>
<tr><th>Advantages of a UNIFIED cache (the slide's list)</th><th>Advantages of a SPLIT cache (the slide's list)</th></tr>
<tr><td><strong>Higher hit rate</strong> — it balances the load of instruction and data fetches automatically</td><td><strong>Eliminates cache contention</strong> between the instruction fetch/decode unit and the execution unit</td></tr>
<tr><td>Only <strong>one cache</strong> needs to be designed and implemented</td><td><strong>Important in pipelining</strong></td></tr>
</table>
<ul>
<li><strong>"Balances the load automatically" is the real unified argument.</strong> If a program is instruction-heavy, a unified cache lets instructions occupy more of it; if it is data-heavy, data take over. A split cache fixes the partition in silicon and cannot adapt — an 8 kB I-cache stays 8 kB even for a program with a tiny instruction footprint.</li>
<li><strong>"Contention" is the real split argument, and it is a structural hazard.</strong> In a pipelined processor the <em>fetch</em> stage wants an instruction at the same moment the <em>memory</em> stage wants a data word — in the <strong>same clock cycle</strong>. A single-ported unified cache can serve only one of them, so one stage must stall. Two separate caches serve both simultaneously. The slide's own history confirms it: Table 5.4 (slide 36) records "Contention occurs when both the Instruction Prefetcher and the Execution Unit simultaneously require access to the cache… Create separate data and instruction caches" and the fix first appeared on the <strong>Pentium</strong>.</li>
<li><strong>This is a direct bridge to the pipeline chapter.</strong> A classic five-stage pipeline (IF · ID · EX · MEM · WB) has IF and MEM active in the same cycle on different instructions. With one memory port that is an unavoidable structural hazard on every load and store. Split L1 caches remove it entirely — which is why the pipeline chapter (Chapter 16, processor structure and function) assumes separate I and D caches from the start.</li>
<li><strong>Why the split stops at L1.</strong> L2 and L3 are consulted rarely and are not in the fetch path, so contention is not a problem there; the flexibility of a unified pool is worth more. Hence the rule: <strong>split at L1, unified above</strong>.</li>
<li><strong>Split caches also let you specialise.</strong> An instruction cache is read-only in normal operation — no dirty bits, no write policy, no write buffer — so it is simpler and can be made faster or denser. Some designs go further and cache <em>decoded</em> instructions rather than raw bytes; the Pentium 4 on slide 37 does exactly that with its "L1 instruction cache (12 K µops)".</li>
<li><strong>Measured on the machine this lesson was written on.</strong> The Apple M1 Max reports <em>separate</em> L1 sizes — <code>hw.perflevel0.l1icachesize</code> = 196608 (192 kB) and <code>hw.perflevel0.l1dcachesize</code> = 131072 (128 kB) — and a <em>single</em> <code>l2cachesize</code> of 12 MB. Split at L1, unified at L2: the slide's trend, visible in a shell command thirty years later.</li>
</ul>
<p class="nhan">Worked mini-problem — counting the stalls the split removes</p>
<p>A 5-stage pipeline runs 1000 instructions; 30% are loads or stores. With a single-ported unified L1, every load/store causes a one-cycle structural stall because IF and MEM collide. What does splitting the cache save?</p>
<ul>
<li>Colliding instructions = 30% × 1000 = <strong>300</strong>.</li>
<li>Unified: 1000 + 300 = <strong>1300</strong> cycles (ignoring other hazards and fill).</li>
<li>Split: <strong>1000</strong> cycles — IF hits the I-cache while MEM hits the D-cache.</li>
</ul>
<p class="dap-an">✅ Answer: <strong>300 cycles saved, a 23% reduction</strong> — and note that <em>no cache got bigger and no hit ratio changed</em>. The split buys throughput purely by removing a port conflict. That is why the slide files "important in pipelining" as an advantage in its own right, separate from hit rate.</p>
<p class="meo">💡 Two words each: <strong>unified = flexible, split = simultaneous.</strong> Flexibility is worth more where accesses are rare (L2/L3); simultaneity is worth more where two stages collide every cycle (L1).</p>
<p class="pitfall">⚠️ Careful with the phrase "split cache has a higher hit rate". It is the <strong>unified</strong> cache that has the higher hit rate — the slide lists that under unified. The split cache wins on <em>bandwidth and contention</em>, and accepts a slightly worse hit rate to get it.</p>`,
        `<p class="y-chinh">🎯 Một cache chứa cả lệnh lẫn dữ liệu, hay hai cache riêng ở cùng một mức? Slide nêu công bằng cả hai phía rồi chốt: <strong>xu hướng là TÁCH ở L1 và THỐNG NHẤT ở các mức cao hơn</strong> — và lý do gói trong một từ: <em>pipeline</em>.</p>
<table>
<tr><th>Ưu điểm của cache THỐNG NHẤT (theo slide)</th><th>Ưu điểm của cache TÁCH RỜI (theo slide)</th></tr>
<tr><td><strong>Tỉ lệ trúng cao hơn</strong> — nó TỰ ĐỘNG cân bằng tải giữa việc nạp lệnh và nạp dữ liệu</td><td><strong>Xoá bỏ tranh chấp cache</strong> giữa khối nạp/giải mã lệnh và khối thi hành</td></tr>
<tr><td>Chỉ phải thiết kế và cài đặt <strong>MỘT cache</strong></td><td><strong>Quan trọng trong pipeline</strong></td></tr>
</table>
<ul>
<li><strong>"Tự động cân bằng tải" mới là lý lẽ thật của phe thống nhất.</strong> Chương trình nặng về lệnh thì cache thống nhất cho lệnh chiếm nhiều chỗ hơn; nặng về dữ liệu thì dữ liệu chiếm. Cache tách rời chốt cứng ranh giới ngay trong silicon và không thích nghi được — I-cache 8 kB vẫn là 8 kB kể cả với chương trình có phần lệnh tí xíu.</li>
<li><strong>"Tranh chấp" mới là lý lẽ thật của phe tách rời, và nó là một XUNG ĐỘT CẤU TRÚC.</strong> Trong bộ xử lý có pipeline, tầng <em>nạp lệnh</em> cần một lệnh đúng lúc tầng <em>truy cập bộ nhớ</em> cần một từ dữ liệu — trong <strong>CÙNG MỘT CHU KỲ</strong>. Một cache thống nhất một cổng chỉ phục vụ được một bên, nên một tầng phải dừng. Hai cache riêng phục vụ cả hai cùng lúc. Chính lịch sử trong slide xác nhận: Table 5.4 (slide 36) chép "Tranh chấp xảy ra khi cả khối nạp trước lệnh lẫn khối thi hành cùng cần truy cập cache… Tạo cache dữ liệu và cache lệnh riêng biệt", và bản vá xuất hiện lần đầu trên <strong>Pentium</strong>.</li>
<li><strong>Đây là cây cầu nối thẳng sang chương pipeline.</strong> Một pipeline năm tầng kinh điển (IF · ID · EX · MEM · WB) có IF và MEM cùng hoạt động trong một chu kỳ trên hai lệnh khác nhau. Với một cổng bộ nhớ duy nhất thì đó là xung đột cấu trúc không tránh được ở MỌI lệnh load và store. Cache L1 tách rời xoá nó hoàn toàn — nên chương pipeline (Chương 16, cấu trúc và hoạt động của bộ xử lý) mặc định có I-cache và D-cache riêng ngay từ đầu.</li>
<li><strong>Vì sao việc tách dừng lại ở L1.</strong> L2 và L3 ít bị hỏi tới và không nằm trong đường nạp lệnh, nên tranh chấp không phải vấn đề ở đó; tính linh hoạt của một bể chung đáng giá hơn. Do đó quy tắc: <strong>tách ở L1, thống nhất từ L2 trở lên</strong>.</li>
<li><strong>Tách rời còn cho phép CHUYÊN BIỆT HOÁ.</strong> Cache lệnh trong hoạt động bình thường là CHỈ ĐỌC — không bit dirty, không chính sách ghi, không bộ đệm ghi — nên nó đơn giản hơn và làm nhanh hơn hoặc dày hơn được. Vài thiết kế còn đi xa hơn: cache <em>lệnh ĐÃ GIẢI MÃ</em> thay vì byte thô; con Pentium 4 ở slide 37 làm đúng thế với "L1 instruction cache (12 K µops)".</li>
<li><strong>Đo thật trên cái máy viết bài này.</strong> Apple M1 Max báo hai kích thước L1 <em>RIÊNG</em> — <code>hw.perflevel0.l1icachesize</code> = 196608 (192 kB) và <code>hw.perflevel0.l1dcachesize</code> = 131072 (128 kB) — và <em>MỘT</em> <code>l2cachesize</code> 12 MB. Tách ở L1, thống nhất ở L2: đúng xu hướng của slide, nhìn thấy bằng một dòng lệnh shell ba mươi năm sau.</li>
</ul>
<p class="nhan">Bài nhỏ — đếm số chu kỳ dừng mà việc tách xoá đi</p>
<p>Một pipeline 5 tầng chạy 1000 lệnh; 30% là load hoặc store. Với L1 thống nhất một cổng, mỗi lệnh load/store gây một chu kỳ dừng do IF và MEM đụng nhau. Tách cache tiết kiệm được gì?</p>
<ul>
<li>Số lệnh gây đụng = 30% × 1000 = <strong>300</strong>.</li>
<li>Thống nhất: 1000 + 300 = <strong>1300</strong> chu kỳ (bỏ qua các xung đột khác và thời gian nạp đầy ống).</li>
<li>Tách rời: <strong>1000</strong> chu kỳ — IF tra I-cache trong khi MEM tra D-cache.</li>
</ul>
<p class="dap-an">✅ Đáp án: <strong>tiết kiệm 300 chu kỳ, giảm 23%</strong> — và chú ý là <em>không cache nào to ra và không tỉ lệ trúng nào thay đổi</em>. Việc tách mua thông lượng THUẦN TUÝ bằng cách xoá một xung đột cổng. Đó là lý do slide xếp "quan trọng trong pipeline" thành một ưu điểm ĐỘC LẬP, tách khỏi tỉ lệ trúng.</p>
<p class="meo">💡 Mỗi bên hai chữ: <strong>thống nhất = LINH HOẠT, tách rời = ĐỒNG THỜI.</strong> Linh hoạt đáng giá hơn ở nơi truy cập thưa (L2/L3); đồng thời đáng giá hơn ở nơi hai tầng đụng nhau mỗi chu kỳ (L1).</p>
<p class="pitfall">⚠️ Cẩn thận với câu "cache tách rời có tỉ lệ trúng cao hơn". Chính cache <strong>THỐNG NHẤT</strong> mới có tỉ lệ trúng cao hơn — slide xếp ý đó dưới phe thống nhất. Cache tách rời thắng ở <em>băng thông và tranh chấp</em>, và CHẤP NHẬN tỉ lệ trúng hơi tệ hơn để đổi lấy điều đó.</p>`],

      [35, 'Inclusion Policy — inclusive, exclusive, noninclusive',
        `<p class="y-chinh">🎯 With more than one level, a new question appears that single-level caches never face: <strong>if a block sits in L1, must it also sit in L2?</strong> Three answers, and each one trades cache capacity against search cost.</p>
<table>
<tr><th>Policy</th><th>The rule</th><th>Advantage</th><th>Disadvantage</th></tr>
<tr><td><strong>Inclusive</strong></td><td>a piece of data in one cache is <strong>guaranteed to be also found</strong> in all lower levels</td><td>simplifies searching for data when there are multiple processors; <strong>useful in enforcing cache coherence</strong></td><td>wastes capacity — the same bytes are stored at every level</td></tr>
<tr><td><strong>Exclusive</strong></td><td>a piece of data in one cache is <strong>guaranteed NOT to be found</strong> in all lower levels</td><td><strong>does not waste cache capacity</strong> — no multiple copies</td><td>must search multiple levels when invalidating or updating a block; mitigated by <strong>duplicating the highest-level tag sets at the lowest cache level to centralize searching</strong></td></tr>
<tr><td><strong>Noninclusive</strong></td><td>a piece of data in one cache <strong>may or may not</strong> be found in lower levels</td><td>fewest constraints on the replacement logic of each level</td><td>as with exclusive, generally maintains all higher-level cache sets at the lowest cache level</td></tr>
</table>
<ul>
<li><strong>Inclusive is the coherence-friendly choice, and that is why big server chips use it.</strong> A snooping request from another core only has to ask the <em>last</em> level: if the block is not in L3, inclusion guarantees it is not in any L1 or L2 behind that L3 either. One lookup rules out a whole core's private caches — this is called a <em>snoop filter</em>, and it is exactly the property the slide means by "useful in enforcing cache coherence".</li>
<li><strong>Inclusive costs real capacity.</strong> If L1 is 128 kB and L2 is 12 MB, inclusion means 128 kB of that 12 MB is a duplicate of L1 — about 1%, which is tolerable. If L1 were 2 MB and L2 8 MB, inclusion would burn a quarter of L2. The policy is affordable exactly when the level ratio is large, which is another reason for the rule "L2 must be much bigger than L1" from slide 33.</li>
<li><strong>Inclusive has a second, subtler cost: back-invalidation.</strong> When L3 evicts a line, inclusion forces it to also evict that line from every L1 and L2 that might hold it — even if the core was using it every cycle. A distant, large cache can therefore reach in and destroy a hot line in a small, near one.</li>
<li><strong>Exclusive maximises effective capacity.</strong> With exclusion, an L1 of 128 kB plus an L2 of 12 MB holds 12.128 MB of <em>distinct</em> data instead of 12 MB. AMD has favoured this approach for years. The price is that a lookup must consult more levels, which is why the slide notes that tag sets get duplicated at the lowest level "to centralize searching".</li>
<li><strong>Noninclusive is the pragmatic middle.</strong> Nothing is enforced either way: a fill puts the line in both levels, but an eviction at one level does not force an eviction at the other. Most Intel client chips since Skylake-X use a noninclusive L3. It avoids back-invalidation without paying exclusion's search cost — and pays for it by needing a separate snoop filter structure.</li>
</ul>
<p class="nhan">Worked mini-problem — effective capacity under each policy</p>
<p>A core has L1 = 128 kB, L2 = 512 kB, L3 = 8 MB. How much <em>distinct</em> data can the hierarchy hold?</p>
<ul>
<li><strong>Strictly inclusive:</strong> everything in L1 is in L2 and L3; everything in L2 is in L3. Distinct total = size of the largest level = <strong>8 MB</strong>.</li>
<li><strong>Strictly exclusive:</strong> no duplicates anywhere. Distinct total = 128 kB + 512 kB + 8 MB = <strong>8.625 MB</strong>.</li>
<li><strong>Difference:</strong> 0.625 MB, i.e. <strong>+7.8%</strong> effective capacity for free.</li>
</ul>
<p class="dap-an">✅ Answer: <strong>8 MB inclusive versus 8.625 MB exclusive — exclusion buys 7.8% more usable cache with no extra transistors.</strong> Whether that is worth the extra search complexity depends on how many cores are snooping; with 2 cores exclusion usually wins, with 32 cores the snoop-filter value of inclusion usually wins.</p>
<p class="meo">💡 Three words: <strong>inclusive = copy, exclusive = move, noninclusive = whatever.</strong> On an L1 miss, inclusive <em>copies</em> the line down from L2 and keeps it in both; exclusive <em>moves</em> it and deletes the L2 copy; noninclusive makes no promise.</p>
<p class="pitfall">⚠️ Inclusion is a property of the <strong>pair of levels</strong>, not of the whole chip. A machine can be inclusive between L2 and L3 while being noninclusive between L1 and L2. An exam answer saying "this CPU is inclusive" without naming the pair is incomplete.</p>`,
        `<p class="y-chinh">🎯 Có nhiều hơn một mức là nảy ra một câu hỏi mà cache một mức không bao giờ gặp: <strong>nếu một khối đang nằm ở L1 thì nó có BẮT BUỘC phải nằm cả ở L2 không?</strong> Ba câu trả lời, mỗi cái đánh đổi dung lượng lấy chi phí tìm kiếm.</p>
<table>
<tr><th>Chính sách</th><th>Luật</th><th>Ưu điểm</th><th>Nhược điểm</th></tr>
<tr><td><strong>Bao hàm (inclusive)</strong></td><td>một mẩu dữ liệu ở cache này <strong>BẢO ĐẢM cũng có</strong> ở mọi mức thấp hơn</td><td>đơn giản hoá việc tìm dữ liệu khi hệ có nhiều bộ xử lý; <strong>hữu ích để thực thi nhất quán cache</strong></td><td>phí dung lượng — cùng một số byte được lưu ở mọi mức</td></tr>
<tr><td><strong>Loại trừ (exclusive)</strong></td><td>một mẩu dữ liệu ở cache này <strong>BẢO ĐẢM KHÔNG có</strong> ở mọi mức thấp hơn</td><td><strong>không phí dung lượng cache</strong> — không có bản sao trùng</td><td>phải tìm qua nhiều mức khi làm mất hiệu lực hoặc cập nhật một khối; giảm nhẹ bằng cách <strong>nhân bản tập tag của mức cao nhất xuống mức cache thấp nhất để tập trung việc tìm kiếm</strong></td></tr>
<tr><td><strong>Không bao hàm (noninclusive)</strong></td><td>một mẩu dữ liệu ở cache này <strong>CÓ THỂ CÓ hoặc KHÔNG</strong> ở các mức thấp hơn</td><td>ít ràng buộc nhất lên logic thay thế của từng mức</td><td>như loại trừ, nói chung vẫn phải giữ toàn bộ tập cache mức cao ở mức cache thấp nhất</td></tr>
</table>
<ul>
<li><strong>Bao hàm là lựa chọn thân thiện với nhất quán, nên chip máy chủ lớn dùng nó.</strong> Một yêu cầu snoop từ lõi khác chỉ cần hỏi mức <em>CUỐI</em>: nếu khối không có trong L3 thì tính bao hàm bảo đảm nó cũng không có trong bất kỳ L1 hay L2 nào đứng sau L3 đó. Một lần tra loại trừ được toàn bộ cache riêng của một lõi — cơ chế này gọi là <em>bộ lọc snoop</em>, và đúng là tính chất mà slide gọi là "hữu ích để thực thi nhất quán cache".</li>
<li><strong>Bao hàm ăn dung lượng thật.</strong> Nếu L1 là 128 kB và L2 là 12 MB thì bao hàm nghĩa là 128 kB trong 12 MB đó là bản sao của L1 — khoảng 1%, chịu được. Nhưng nếu L1 là 2 MB và L2 là 8 MB thì bao hàm đốt mất một phần tư L2. Chính sách này chỉ trả nổi khi TỈ LỆ giữa hai mức lớn, thêm một lý do nữa cho quy tắc "L2 phải lớn hơn L1 nhiều" ở slide 33.</li>
<li><strong>Bao hàm còn một cái giá thứ hai, tinh vi hơn: back-invalidation (làm mất hiệu lực ngược).</strong> Khi L3 đuổi một dòng, tính bao hàm buộc nó cũng phải đuổi dòng đó khỏi mọi L1 và L2 có thể đang giữ — kể cả khi lõi đang dùng dòng đó ở mỗi chu kỳ. Một cache lớn ở xa vì thế có thể thò tay vào phá một dòng đang nóng ở cache nhỏ ở gần.</li>
<li><strong>Loại trừ tối đa hoá dung lượng hữu dụng.</strong> Với loại trừ, L1 128 kB cộng L2 12 MB chứa 12,128 MB dữ liệu <em>RIÊNG BIỆT</em> thay vì 12 MB. AMD chuộng hướng này nhiều năm. Cái giá là mỗi lần tra phải hỏi nhiều mức hơn, nên slide ghi rõ tập tag được nhân bản xuống mức thấp nhất "để tập trung việc tìm kiếm".</li>
<li><strong>Không bao hàm là lối giữa thực dụng.</strong> Không ép buộc theo chiều nào: khi nạp thì dòng vào cả hai mức, nhưng khi một mức đuổi dòng thì không ép mức kia phải đuổi theo. Phần lớn chip Intel từ Skylake-X trở đi dùng L3 không bao hàm. Nó tránh được back-invalidation mà không phải trả chi phí tìm kiếm của loại trừ — đổi lại phải có một cấu trúc lọc snoop riêng.</li>
</ul>
<p class="nhan">Bài nhỏ — dung lượng hữu dụng theo từng chính sách</p>
<p>Một lõi có L1 = 128 kB, L2 = 512 kB, L3 = 8 MB. Cả phân cấp chứa được bao nhiêu dữ liệu <em>RIÊNG BIỆT</em>?</p>
<ul>
<li><strong>Bao hàm chặt:</strong> mọi thứ ở L1 đều có ở L2 và L3; mọi thứ ở L2 đều có ở L3. Tổng riêng biệt = kích thước mức LỚN NHẤT = <strong>8 MB</strong>.</li>
<li><strong>Loại trừ chặt:</strong> không trùng chỗ nào. Tổng riêng biệt = 128 kB + 512 kB + 8 MB = <strong>8,625 MB</strong>.</li>
<li><strong>Chênh lệch:</strong> 0,625 MB, tức <strong>+7,8%</strong> dung lượng hữu dụng, miễn phí.</li>
</ul>
<p class="dap-an">✅ Đáp án: <strong>8 MB (bao hàm) so với 8,625 MB (loại trừ) — loại trừ mua thêm 7,8% cache dùng được mà không tốn thêm một transistor nào.</strong> Có đáng đổi lấy độ phức tạp tìm kiếm hay không thì tuỳ số lõi đang snoop; với 2 lõi thì loại trừ thường thắng, với 32 lõi thì giá trị bộ lọc snoop của bao hàm thường thắng.</p>
<p class="meo">💡 Ba chữ: <strong>bao hàm = CHÉP, loại trừ = CHUYỂN, không bao hàm = TUỲ.</strong> Khi L1 trượt: bao hàm <em>chép</em> dòng từ L2 xuống và giữ ở cả hai; loại trừ <em>chuyển</em> nó xuống rồi xoá bản ở L2; không bao hàm thì không hứa gì.</p>
<p class="pitfall">⚠️ Tính bao hàm là tính chất của một <strong>CẶP MỨC</strong>, không phải của cả con chip. Một máy có thể bao hàm giữa L2 và L3 mà lại không bao hàm giữa L1 và L2. Câu trả lời "CPU này là inclusive" mà không nói rõ cặp mức nào là chưa đủ.</p>`],

      [36, 'Table 5.4 — Intel Cache Evolution: every problem and the chip that fixed it',
        `<p class="y-chinh">🎯 Twenty years of cache design read as a <strong>problem → solution → first processor</strong> log. Every row is a bottleneck that moved somewhere else, and every fix in this table is a concept taught on slides 23–35.</p>
<table>
<tr><th>Problem</th><th>Solution</th><th>First appears on</th></tr>
<tr><td>External memory slower than the system bus</td><td>Add external cache using faster memory technology</td><td><strong>386</strong></td></tr>
<tr><td>Increased processor speed results in external bus becoming a bottleneck for cache access</td><td>Move external cache on-chip, operating at the same speed as the processor</td><td><strong>486</strong></td></tr>
<tr><td>Internal cache is rather small, due to limited space on chip</td><td>Add external L2 cache using faster technology than main memory</td><td><strong>486</strong></td></tr>
<tr><td>Contention occurs when both the Instruction Prefetcher and the Execution Unit simultaneously require access to the cache — the Prefetcher is stalled while the Execution Unit's data access takes place</td><td><strong>Create separate data and instruction caches</strong></td><td><strong>Pentium</strong></td></tr>
<tr><td>Increased processor speed results in external bus becoming a bottleneck for L2 cache access</td><td>Create a separate <strong>back-side bus</strong> (BSB) that runs at higher speed than the main (front-side) external bus; the BSB is dedicated to the L2 cache</td><td><strong>Pentium Pro</strong></td></tr>
<tr><td><em>(same problem, continued)</em></td><td>Move L2 cache on to the processor chip</td><td><strong>Pentium II</strong></td></tr>
<tr><td>Some applications deal with massive databases and must have rapid access to large amounts of data; the on-chip caches are too small</td><td>Add external L3 cache</td><td><strong>Pentium III</strong></td></tr>
<tr><td><em>(same problem, continued)</em></td><td>Move L3 cache on-chip</td><td><strong>Pentium 4</strong></td></tr>
</table>
<ul>
<li><strong>The table has one repeating shape: "it is off-chip and therefore slow" → "put it on-chip".</strong> It happens three separate times — for L1 (486), for L2 (Pentium II) and for L3 (Pentium 4). The same fix keeps working because the thing that is slow is never the memory cells, it is <em>crossing the package boundary</em>.</li>
<li><strong>The Pentium row is slide 34 in historical form.</strong> "Contention… the Prefetcher is stalled while the Execution Unit's data access takes place" is a textbook structural hazard, and the fix — separate I and D caches — is exactly the split-cache argument. Note the date: this was solved in 1993 and every processor since has kept it.</li>
<li><strong>The back-side bus is an underrated idea.</strong> Rather than making one bus faster, the Pentium Pro gave L2 a private road so that L2 traffic and main-memory traffic stopped competing. That is "performance balance" from Chapter 2, applied to wiring instead of to components.</li>
<li><strong>Two rows have an empty Problem cell</strong> — they continue the problem stated directly above. That is a formatting convention in the table, not missing data. Read the pairs as "first they tried X, then they went further and did Y".</li>
<li><strong>The whole table is Table 5.1's design space being explored one decision at a time</strong> — cache size, number of caches (levels), unified vs split. It is the best single-slide evidence that cache design is driven by <em>moving bottlenecks</em>, not by a search for one optimal configuration.</li>
</ul>
<p class="meo">💡 Learn the four milestone chips by their one contribution each: <strong>386 = first cache · 486 = cache on-chip · Pentium = split I/D · Pentium 4 = L3 on-chip.</strong> That covers most of what an exam can ask from this table.</p>
<p class="pitfall">⚠️ Do not read "External memory slower than the system bus" as a typo for the reverse. It means the DRAM could not keep up with the bus's cycle rate, so a faster cache was inserted between them. Reading it backwards inverts the whole motivation of row one.</p>`,
        `<p class="y-chinh">🎯 Hai chục năm thiết kế cache đọc như một nhật ký <strong>vấn đề → lời giải → con chip đầu tiên có nó</strong>. Mỗi hàng là một chỗ nghẽn dời đi chỗ khác, và mọi lời giải trong bảng này đều là một khái niệm đã dạy ở slide 23–35.</p>
<table>
<tr><th>Vấn đề</th><th>Lời giải</th><th>Xuất hiện đầu tiên trên</th></tr>
<tr><td>Bộ nhớ ngoài chậm hơn bus hệ thống</td><td>Thêm cache ngoài dùng công nghệ bộ nhớ nhanh hơn</td><td><strong>386</strong></td></tr>
<tr><td>Bộ xử lý nhanh lên khiến bus ngoài thành chỗ nghẽn cho việc truy cập cache</td><td>Dời cache ngoài vào trong chip, chạy cùng tốc độ với bộ xử lý</td><td><strong>486</strong></td></tr>
<tr><td>Cache trong khá nhỏ vì chỗ trên chip có hạn</td><td>Thêm cache L2 ngoài dùng công nghệ nhanh hơn bộ nhớ chính</td><td><strong>486</strong></td></tr>
<tr><td>Tranh chấp xảy ra khi cả khối nạp trước lệnh lẫn khối thi hành cùng cần truy cập cache — khối nạp trước phải dừng trong lúc khối thi hành truy cập dữ liệu</td><td><strong>Tạo cache dữ liệu và cache lệnh RIÊNG BIỆT</strong></td><td><strong>Pentium</strong></td></tr>
<tr><td>Bộ xử lý nhanh lên khiến bus ngoài thành chỗ nghẽn cho việc truy cập cache L2</td><td>Tạo một <strong>bus mặt sau (back-side bus, BSB)</strong> chạy nhanh hơn bus ngoài chính (mặt trước); BSB dành riêng cho cache L2</td><td><strong>Pentium Pro</strong></td></tr>
<tr><td><em>(cùng vấn đề, nối tiếp)</em></td><td>Dời cache L2 vào trong chip bộ xử lý</td><td><strong>Pentium II</strong></td></tr>
<tr><td>Một số ứng dụng làm việc với cơ sở dữ liệu khổng lồ và cần truy cập nhanh lượng dữ liệu lớn; cache trên chip quá nhỏ</td><td>Thêm cache L3 ngoài</td><td><strong>Pentium III</strong></td></tr>
<tr><td><em>(cùng vấn đề, nối tiếp)</em></td><td>Dời cache L3 vào trong chip</td><td><strong>Pentium 4</strong></td></tr>
</table>
<ul>
<li><strong>Bảng này có một hình dáng lặp đi lặp lại: "nó ở ngoài chip nên chậm" → "đưa vào trong chip".</strong> Chuyện đó xảy ra BA lần riêng biệt — với L1 (486), với L2 (Pentium II) và với L3 (Pentium 4). Cùng một cách vá vẫn hiệu nghiệm vì thứ chậm không bao giờ là ô nhớ, mà là <em>việc vượt qua ranh giới của gói chip</em>.</li>
<li><strong>Hàng Pentium chính là slide 34 dưới dạng lịch sử.</strong> "Tranh chấp… khối nạp trước phải dừng trong lúc khối thi hành truy cập dữ liệu" là một xung đột cấu trúc sách giáo khoa, và bản vá — tách I-cache và D-cache — đúng là lý lẽ của cache tách rời. Để ý mốc thời gian: giải quyết xong năm 1993 và mọi bộ xử lý từ đó tới nay đều giữ nguyên.</li>
<li><strong>Bus mặt sau là một ý tưởng bị đánh giá thấp.</strong> Thay vì làm một cái bus nhanh hơn, Pentium Pro cho L2 một con đường riêng để lưu lượng L2 và lưu lượng bộ nhớ chính thôi tranh nhau. Đó là "cân bằng hiệu năng" của Chương 2, áp dụng cho DÂY chứ không phải cho linh kiện.</li>
<li><strong>Hai hàng có ô "Vấn đề" TRỐNG</strong> — chúng nối tiếp vấn đề ghi ngay ở trên. Đó là quy ước trình bày của bảng, không phải dữ liệu bị mất. Đọc từng cặp là "đầu tiên họ thử X, rồi họ đi xa hơn và làm Y".</li>
<li><strong>Cả bảng là không gian thiết kế của Table 5.1 đang được khám phá từng quyết định một</strong> — kích thước cache, số cache (số mức), thống nhất hay tách rời. Đây là bằng chứng một-slide tốt nhất cho thấy thiết kế cache bị dẫn dắt bởi <em>các chỗ nghẽn biết đi</em>, chứ không phải bởi cuộc truy tìm một cấu hình tối ưu duy nhất.</li>
</ul>
<p class="meo">💡 Nhớ bốn con chip cột mốc bằng đúng một đóng góp mỗi con: <strong>386 = có cache đầu tiên · 486 = cache vào trong chip · Pentium = tách I/D · Pentium 4 = L3 vào trong chip.</strong> Bấy nhiêu phủ gần hết những gì đề có thể hỏi từ bảng này.</p>
<p class="pitfall">⚠️ Đừng đọc "Bộ nhớ ngoài chậm hơn bus hệ thống" thành câu ngược lại vì tưởng in nhầm. Nó nghĩa là DRAM không theo kịp nhịp của bus, nên người ta chèn một cache nhanh hơn vào giữa. Đọc ngược là lật ngược toàn bộ động cơ của hàng thứ nhất.</p>`],

      [37, 'Figure 5.17 — Pentium 4 Block Diagram: three cache levels in one picture',
        `<p class="y-chinh">🎯 Everything from slides 32–36 drawn as one chip. Note what the figure shows: a <strong>split L1</strong> (an instruction cache holding µops, a separate 16 kB data cache), a <strong>unified L2</strong>, a <strong>unified L3</strong>, and progressively wider paths between them.</p>
<table>
<tr><th>Element in the figure</th><th>Label on the slide</th><th>Which concept it illustrates</th></tr>
<tr><td>L1 instruction cache</td><td><strong>12 K µops</strong> — fed by the Instruction fetch/decode unit, feeding the Out-of-order execution logic</td><td>split cache (slide 34); and note it caches <em>decoded</em> micro-operations, not raw bytes</td></tr>
<tr><td>L1 data cache</td><td><strong>16 kB</strong> — sits under all the execution units</td><td>split cache; the D side</td></tr>
<tr><td>L2 cache</td><td><strong>512 kB</strong>, connected to L1 data by a <strong>256-bit</strong> path</td><td>multilevel (slide 32); 32× larger than L1d</td></tr>
<tr><td>L3 cache</td><td><strong>1 MB</strong>, connected to L2 by another <strong>256-bit</strong> path, and to the System Bus</td><td>the "Move L3 cache on-chip / Pentium 4" row of Table 5.4</td></tr>
<tr><td>Path to the fetch/decode unit</td><td><strong>64 bits</strong></td><td>the instruction side needs less width than the data side</td></tr>
<tr><td>Execution units</td><td>Load address unit · Store address unit · two Simple integer ALUs · Complex integer ALU · FP/MMX unit · FP move unit</td><td>superscalar (Ch.18) — several units want memory in the same cycle, which is why L1 is split</td></tr>
</table>
<ul>
<li><strong>The size ratios are the lesson.</strong> 16 kB L1d → 512 kB L2 → 1 MB L3: ratios of 32× and 2×. Compare that to slide 33's rule — L2 is comfortably larger than L1, but this L3 is only twice its L2, which is why the Pentium 4's L3 was a server-only option and helped only database-scale working sets.</li>
<li><strong>The widening buses are not decoration.</strong> 64 bits to the fetch unit, 256 bits between L1d↔L2 and L2↔L3. Wider paths lower the <em>transfer</em> part of the miss penalty: a 64-byte line crosses a 256-bit path in 2 beats instead of 8. This is Chapter 2's "make DRAMs wider rather than deeper" applied inside the chip.</li>
<li><strong>The µop cache is a genuinely different idea.</strong> A normal I-cache stores instruction bytes that must be decoded on every fetch. The Pentium 4's trace cache stores <em>already-decoded</em> µops, so a hit skips decoding entirely. It is a cache of <em>work</em>, not of <em>data</em> — the only place in this course where that trick appears.</li>
<li><strong>Follow the arrow from L3 back up the right-hand side.</strong> It returns to the Instruction fetch/decode unit, i.e. an instruction miss in L1 is served by L2/L3 just like a data miss. The two L1s are split, but everything below them is shared — the slide-34 rule made visible.</li>
<li><strong>Put this beside the M1 Max measured on slide 32.</strong> Pentium 4: 16 kB L1d, 512 kB L2, 1 MB L3. M1 Max: 128 kB L1d, 12 MB L2 per cluster, plus a large system-level cache. Twenty years multiplied every level by roughly 8–24×, yet the <em>structure</em> of the picture — split L1, unified larger levels, wide internal paths — is unchanged.</li>
</ul>
<p class="meo">💡 Trace one load instruction through the picture top to bottom: execution unit → L1 data (16 kB) → 256-bit path → L2 (512 kB) → 256-bit path → L3 (1 MB) → system bus → DRAM. Five stops, each roughly an order of magnitude bigger and slower than the last. That walk <em>is</em> the memory hierarchy of Chapter 4.</p>
<p class="pitfall">⚠️ "12 K µops" is a count of micro-operations, not kilobytes. It is the only capacity on this diagram not expressed in bytes, and a question asking "what is the size of the Pentium 4 L1 instruction cache in kB?" has no clean answer from this slide — say 12 K µops and explain why.</p>`,
        `<p class="y-chinh">🎯 Mọi thứ từ slide 32–36 vẽ thành một con chip. Chú ý hình cho thấy gì: <strong>L1 TÁCH RỜI</strong> (một cache lệnh chứa µop, một cache dữ liệu 16 kB riêng), <strong>L2 THỐNG NHẤT</strong>, <strong>L3 THỐNG NHẤT</strong>, và các đường nối rộng dần giữa chúng.</p>
<table>
<tr><th>Thành phần trong hình</th><th>Nhãn trên slide</th><th>Minh hoạ khái niệm nào</th></tr>
<tr><td>Cache lệnh L1</td><td><strong>12 K µop</strong> — được khối nạp/giải mã lệnh nạp vào, và cấp cho logic thi hành không theo thứ tự</td><td>cache tách rời (slide 34); và chú ý nó cache <em>vi lệnh ĐÃ GIẢI MÃ</em>, không phải byte thô</td></tr>
<tr><td>Cache dữ liệu L1</td><td><strong>16 kB</strong> — nằm dưới toàn bộ các khối thi hành</td><td>cache tách rời; phía D</td></tr>
<tr><td>Cache L2</td><td><strong>512 kB</strong>, nối với L1 dữ liệu bằng đường <strong>256 bit</strong></td><td>nhiều mức (slide 32); lớn gấp 32 lần L1d</td></tr>
<tr><td>Cache L3</td><td><strong>1 MB</strong>, nối với L2 bằng một đường <strong>256 bit</strong> nữa, và nối ra System Bus</td><td>hàng "Dời cache L3 vào trong chip / Pentium 4" của Table 5.4</td></tr>
<tr><td>Đường tới khối nạp/giải mã</td><td><strong>64 bit</strong></td><td>phía lệnh cần ít bề rộng hơn phía dữ liệu</td></tr>
<tr><td>Các khối thi hành</td><td>Khối địa chỉ Load · khối địa chỉ Store · hai ALU nguyên đơn giản · ALU nguyên phức tạp · khối FP/MMX · khối FP move</td><td>superscalar (Ch.18) — nhiều khối cùng muốn bộ nhớ trong một chu kỳ, chính là lý do L1 phải tách</td></tr>
</table>
<ul>
<li><strong>Các TỈ LỆ kích thước mới là bài học.</strong> 16 kB L1d → 512 kB L2 → 1 MB L3: tỉ lệ 32× rồi 2×. Đối chiếu với quy tắc ở slide 33 — L2 lớn hơn L1 rất thoải mái, nhưng L3 ở đây chỉ gấp đôi L2, và đó là lý do L3 của Pentium 4 chỉ là tuỳ chọn cho máy chủ và chỉ giúp được những tập làm việc cỡ cơ sở dữ liệu.</li>
<li><strong>Các bus rộng dần không phải để trang trí.</strong> 64 bit tới khối nạp lệnh, 256 bit giữa L1d↔L2 và L2↔L3. Đường rộng hơn làm giảm phần <em>TRUYỀN</em> trong hình phạt trượt: một dòng 64 byte vượt đường 256 bit trong 2 nhịp thay vì 8. Đây là "làm DRAM rộng hơn thay vì sâu hơn" của Chương 2, áp dụng ngay trong lòng chip.</li>
<li><strong>Cache µop là một ý tưởng thật sự khác biệt.</strong> Một I-cache thường lưu byte lệnh, mà byte thì lần nạp nào cũng phải giải mã. Trace cache của Pentium 4 lưu µop <em>ĐÃ GIẢI MÃ</em>, nên trúng là bỏ qua luôn khâu giải mã. Nó là cache của <em>CÔNG VIỆC</em>, không phải cache của <em>DỮ LIỆU</em> — chỗ duy nhất trong môn này mẹo đó xuất hiện.</li>
<li><strong>Đi theo mũi tên từ L3 vòng ngược lên cạnh phải.</strong> Nó quay về khối nạp/giải mã lệnh, tức là một lần trượt LỆNH ở L1 cũng được L2/L3 phục vụ y như trượt dữ liệu. Hai cái L1 thì tách, còn mọi thứ bên dưới chúng thì dùng chung — đúng quy tắc slide 34, nhìn thấy được.</li>
<li><strong>Đặt cạnh con M1 Max đo ở slide 32.</strong> Pentium 4: L1d 16 kB, L2 512 kB, L3 1 MB. M1 Max: L1d 128 kB, L2 12 MB mỗi cụm, cộng thêm một cache mức hệ thống lớn. Hai chục năm nhân mỗi mức lên cỡ 8–24 lần, vậy mà <em>CẤU TRÚC</em> của bức hình — L1 tách, các mức lớn hơn thống nhất, đường nội bộ rộng — không hề đổi.</li>
</ul>
<p class="meo">💡 Lần theo MỘT lệnh load xuyên bức hình từ trên xuống: khối thi hành → L1 dữ liệu (16 kB) → đường 256 bit → L2 (512 kB) → đường 256 bit → L3 (1 MB) → system bus → DRAM. Năm trạm, mỗi trạm lớn hơn và chậm hơn trạm trước cỡ một bậc. Đường đi đó CHÍNH LÀ phân cấp bộ nhớ của Chương 4.</p>
<p class="pitfall">⚠️ "12 K µop" là số ĐẾM vi lệnh, không phải kilobyte. Đó là dung lượng duy nhất trên sơ đồ này không tính bằng byte, nên câu hỏi "cache lệnh L1 của Pentium 4 lớn bao nhiêu kB?" không có đáp án sạch từ slide này — hãy trả lời 12 K µop và giải thích vì sao.</p>`],

      [38, 'Table 5.5 — Pentium 4 Cache Operating Modes: two bits that turn the cache off',
        `<p class="y-chinh">🎯 Two control bits, <strong>CD (cache disable)</strong> and <strong>NW (not write-through)</strong>, select three legal operating modes — and the slide's footnote names the fourth combination as <strong>invalid</strong>. This is write policy from slide 28 exposed as software-visible hardware.</p>
<table>
<tr><th>CD</th><th>NW</th><th>Cache fills</th><th>Write throughs</th><th>Invalidates</th><th>What it means in practice</th></tr>
<tr><td>0</td><td>0</td><td>Enabled</td><td>Enabled</td><td>Enabled</td><td><strong>Normal operation.</strong> The cache fills on misses, writes propagate to memory, and snooped invalidates are honoured</td></tr>
<tr><td>1</td><td>0</td><td>Disabled</td><td>Enabled</td><td>Enabled</td><td><strong>No new lines admitted</strong>, but existing lines still work, writes still reach memory, coherence still enforced. The mode used while <em>draining</em> a cache</td></tr>
<tr><td>1</td><td>1</td><td>Disabled</td><td>Disabled</td><td>Disabled</td><td><strong>Cache effectively off.</strong> Nothing new enters, nothing is written through, and the cache stops listening to the bus</td></tr>
<tr><td>0</td><td>1</td><td colspan="4"><strong>Invalid combination</strong> — the slide's note says so explicitly</td></tr>
</table>
<ul>
<li><strong>Why CD = 0, NW = 1 must be forbidden.</strong> It would mean "keep filling the cache with new lines, but never write anything through and never honour invalidates" — the cache would accumulate modified data that main memory never learns about and that no other agent can invalidate. That is a guaranteed coherence violation (slide 30), so the architecture refuses to allow it.</li>
<li><strong>The three legal modes form a shutdown sequence, not a menu.</strong> Go 00 → 10 (stop admitting lines while the existing ones still behave correctly) → flush the cache in software → 11 (fully off). Jumping straight from 00 to 11 would strand dirty lines that memory never receives.</li>
<li><strong>"Invalidates" is the coherence column.</strong> With invalidates enabled, the cache watches the bus and drops lines another master has written — exactly the "bus watching with write through" approach on slide 30. Disabling it is only safe once the cache is no longer participating at all.</li>
<li><strong>Why an operating system would ever want this.</strong> Before setting up memory-mapped devices, during early boot when the memory controller is not yet configured, or when running self-modifying or DMA-shared buffers, the OS needs regions or the whole cache disabled. The mechanism the hardware gives it is these two bits.</li>
<li><strong>Read the table as evidence for a bigger claim.</strong> Every policy decision in this chapter — fill or not, write through or not, snoop or not — is a real, switchable piece of hardware, not an abstraction invented by the textbook. Two bits in a control register expose three of them at once.</li>
</ul>
<p class="meo">💡 Read the bit names as negations and the table becomes obvious: <strong>CD = Cache Disable (1 = off), NW = Not Write-through (1 = do not write through).</strong> Both bits are "active high for the bad thing", which is why 0,0 is the normal mode.</p>
<p class="pitfall">⚠️ Do not answer "CD = 1 means the cache is turned off". With CD = 1 and NW = 0 the cache is still serving hits, still writing through and still honouring invalidates — only <em>fills</em> are disabled. Only CD = 1, NW = 1 is genuinely "off".</p>`,
        `<p class="y-chinh">🎯 Hai bit điều khiển, <strong>CD (cache disable)</strong> và <strong>NW (not write-through)</strong>, chọn ra ba chế độ hoạt động hợp lệ — và ghi chú của slide nêu tổ hợp thứ tư là <strong>KHÔNG HỢP LỆ</strong>. Đây là chính sách ghi của slide 28 lộ ra thành phần cứng mà phần mềm nhìn thấy được.</p>
<table>
<tr><th>CD</th><th>NW</th><th>Nạp vào cache</th><th>Ghi xuyên</th><th>Làm mất hiệu lực</th><th>Nghĩa thực tế</th></tr>
<tr><td>0</td><td>0</td><td>Bật</td><td>Bật</td><td>Bật</td><td><strong>Hoạt động bình thường.</strong> Cache nạp khi trượt, lệnh ghi lan xuống bộ nhớ, và các lệnh làm mất hiệu lực nghe được từ bus đều được tuân thủ</td></tr>
<tr><td>1</td><td>0</td><td>Tắt</td><td>Bật</td><td>Bật</td><td><strong>Không nhận dòng mới nữa</strong>, nhưng các dòng đang có vẫn chạy, lệnh ghi vẫn xuống bộ nhớ, nhất quán vẫn được giữ. Đây là chế độ dùng khi đang <em>rút cạn</em> cache</td></tr>
<tr><td>1</td><td>1</td><td>Tắt</td><td>Tắt</td><td>Tắt</td><td><strong>Cache coi như tắt hẳn.</strong> Không có gì mới vào, không ghi xuyên, và cache thôi nghe bus</td></tr>
<tr><td>0</td><td>1</td><td colspan="4"><strong>Tổ hợp KHÔNG HỢP LỆ</strong> — ghi chú của slide nói thẳng như vậy</td></tr>
</table>
<ul>
<li><strong>Vì sao CD = 0, NW = 1 phải bị cấm.</strong> Nó có nghĩa "cứ nạp dòng mới vào cache, nhưng không bao giờ ghi xuyên gì cả và không bao giờ tuân thủ lệnh làm mất hiệu lực" — cache sẽ tích dồn dữ liệu đã sửa mà bộ nhớ chính không hề hay biết và không tác nhân nào làm mất hiệu lực được. Đó là vi phạm nhất quán chắc chắn (slide 30), nên kiến trúc từ chối cho phép.</li>
<li><strong>Ba chế độ hợp lệ tạo thành một TRÌNH TỰ TẮT, không phải một thực đơn.</strong> Đi 00 → 10 (ngừng nhận dòng mới trong khi các dòng đang có vẫn hành xử đúng) → xả cache bằng phần mềm → 11 (tắt hẳn). Nhảy thẳng từ 00 sang 11 là bỏ mắc kẹt các dòng bẩn mà bộ nhớ không bao giờ nhận được.</li>
<li><strong>Cột "làm mất hiệu lực" là cột NHẤT QUÁN.</strong> Khi nó bật, cache canh bus và vứt những dòng mà một master khác vừa ghi — đúng cách "theo dõi bus với write through" ở slide 30. Tắt nó chỉ an toàn khi cache đã hoàn toàn không còn tham gia nữa.</li>
<li><strong>Vì sao một hệ điều hành lại cần tới việc này.</strong> Trước khi cài đặt các thiết bị ánh xạ bộ nhớ, trong giai đoạn khởi động sớm khi bộ điều khiển bộ nhớ chưa cấu hình xong, hoặc khi chạy mã tự sửa chính mình hay dùng vùng đệm chia sẻ với DMA — hệ điều hành cần tắt cache theo vùng hoặc tắt toàn bộ. Cơ chế phần cứng đưa cho nó chính là hai bit này.</li>
<li><strong>Đọc bảng này như bằng chứng cho một khẳng định lớn hơn.</strong> Mọi quyết định chính sách trong chương — nạp hay không, ghi xuyên hay không, rình bus hay không — đều là một mẩu phần cứng THẬT, bật tắt được, chứ không phải khái niệm do sách bịa ra. Hai bit trong một thanh ghi điều khiển phơi ra ba trong số đó cùng lúc.</li>
</ul>
<p class="meo">💡 Đọc tên hai bit như PHỦ ĐỊNH là bảng trở nên hiển nhiên: <strong>CD = Cache Disable (1 = tắt), NW = Not Write-through (1 = ĐỪNG ghi xuyên).</strong> Cả hai bit đều "mức cao là điều xấu", nên 0,0 mới là chế độ bình thường.</p>
<p class="pitfall">⚠️ Đừng trả lời "CD = 1 nghĩa là cache bị tắt". Với CD = 1 và NW = 0 thì cache vẫn phục vụ các lần trúng, vẫn ghi xuyên và vẫn tuân thủ lệnh làm mất hiệu lực — chỉ có việc <em>NẠP</em> bị tắt. Chỉ CD = 1, NW = 1 mới thật sự là "tắt".</p>`],

      [39, 'Figure 5.18 — IBM z13 CPC Drawer Logical Structure: a hierarchy with four levels',
        `<p class="y-chinh">🎯 What the same ideas look like at mainframe scale. One CPC drawer, two processor nodes, and a cache hierarchy that goes all the way to <strong>L4</strong> — a level that exists purely to keep a large number of cores coherent.</p>
<table>
<tr><th>Element in the figure</th><th>What the slide labels it</th><th>Note</th></tr>
<tr><td>Processor Node 0 and Node 1</td><td>each node contains <strong>3 PU chips + 1 SC chip</strong></td><td>the drawer is the packaging unit; several drawers make a machine</td></tr>
<tr><td>Each PU (processor unit) chip</td><td><strong>8 × 224 kB L1</strong>, <strong>8 × 4 MB L2</strong>, <strong>64 MB L3</strong></td><td>8 cores per chip; L1 and L2 are <em>private per core</em>, L3 is <em>shared by the chip</em></td></tr>
<tr><td>SC (system controller) chip</td><td><strong>480 MB L4</strong></td><td>one per node — the shared level and the coherence point</td></tr>
<tr><td>X-Bus</td><td>connects the PU chips and the SC within a node</td><td>intra-node traffic</td></tr>
<tr><td>S-Bus</td><td>connects the SC of Node 1 to the SC of Node 0</td><td>inter-node traffic, SC to SC</td></tr>
<tr><td>A-Bus</td><td>runs from each SC "<strong>To other drawers</strong>"</td><td>scales the machine beyond one drawer</td></tr>
</table>
<ul>
<li><strong>Read the "8 ×" prefixes carefully — they are per-core, not totals.</strong> "8 × 224 kB L1" means each of the 8 cores has its own 224 kB L1 (split into instruction and data parts), so the chip has 1.75 MB of L1 in total. Same for "8 × 4 MB L2" = 32 MB of private L2 per chip. The L3, by contrast, is a single shared 64 MB pool.</li>
<li><strong>The shape is private-then-shared, exactly as on a desktop.</strong> L1 and L2 private per core → L3 shared per chip → L4 shared per node. Each step outward is larger, slower, and serves more cores. It is the same picture as slide 32, just with one more storey.</li>
<li><strong>Why L4 exists at all.</strong> With 24 cores per drawer and multiple drawers, the coherence traffic between chips would swamp the buses. A 480 MB L4 on the SC chip catches that traffic: a line requested by one chip and already fetched by another is served from L4 instead of from memory. L4 is less a cache than a <strong>coherence hub with storage</strong>.</li>
<li><strong>Three named buses, three scopes.</strong> X-Bus inside a node, S-Bus between the two nodes of a drawer, A-Bus out to other drawers. That is a <em>hierarchy of buses</em> — precisely the technique Chapter 2 listed under performance balance: "increase the interconnect bandwidth… using higher-speed buses and a hierarchy of buses to buffer and structure data flow".</li>
<li><strong>Compare with Table 5.2 on slide 11.</strong> It lists the z13 as "24 × 96 kB/128 kB L1, 24 × 2 MB/2 MB L2, 64 MB L3, 480 MB L4". The 96/128 split confirms the L1 here is a <em>split</em> I/D cache (96 kB instructions + 128 kB data = 224 kB, the number in this figure), and 24 = 3 PU chips × 8 cores. The two slides agree once you decode the notation.</li>
</ul>
<p class="meo">💡 Remember the z13 by one line: <strong>private L1+L2 per core, shared L3 per chip, shared L4 per node — and the L4 lives on a separate controller chip whose real job is coherence.</strong></p>
<p class="pitfall">⚠️ Do not add the numbers as if they were a single core's hierarchy. A z13 core does <em>not</em> see 224 kB + 4 MB + 64 MB + 480 MB "of its own". It has 224 kB and 4 MB privately; the 64 MB and 480 MB are shared with 7 and 23 other cores respectively. Confusing per-core with per-chip totals is the classic misreading of this figure.</p>`,
        `<p class="y-chinh">🎯 Cũng những ý tưởng đó trông thế nào ở quy mô máy lớn (mainframe). Một ngăn CPC, hai nút bộ xử lý, và một phân cấp cache đi tới tận <strong>L4</strong> — một mức tồn tại thuần tuý để giữ nhất quán cho một số lượng lớn lõi.</p>
<table>
<tr><th>Thành phần trong hình</th><th>Nhãn trên slide</th><th>Ghi chú</th></tr>
<tr><td>Processor Node 0 và Node 1</td><td>mỗi nút có <strong>3 chip PU + 1 chip SC</strong></td><td>ngăn (drawer) là đơn vị đóng gói; vài ngăn ghép thành một cỗ máy</td></tr>
<tr><td>Mỗi chip PU (processor unit)</td><td><strong>8 × 224 kB L1</strong>, <strong>8 × 4 MB L2</strong>, <strong>64 MB L3</strong></td><td>8 lõi mỗi chip; L1 và L2 là <em>riêng của từng lõi</em>, L3 <em>dùng chung trong chip</em></td></tr>
<tr><td>Chip SC (system controller)</td><td><strong>480 MB L4</strong></td><td>mỗi nút một cái — mức dùng chung và là điểm giữ nhất quán</td></tr>
<tr><td>X-Bus</td><td>nối các chip PU với chip SC trong cùng một nút</td><td>lưu lượng trong nút</td></tr>
<tr><td>S-Bus</td><td>nối SC của Node 1 với SC của Node 0</td><td>lưu lượng giữa hai nút, SC tới SC</td></tr>
<tr><td>A-Bus</td><td>từ mỗi SC chạy "<strong>To other drawers</strong>" (tới các ngăn khác)</td><td>mở rộng cỗ máy ra ngoài một ngăn</td></tr>
</table>
<ul>
<li><strong>Đọc kỹ tiền tố "8 ×" — nó là MỖI LÕI, không phải tổng.</strong> "8 × 224 kB L1" nghĩa là mỗi lõi trong 8 lõi có riêng 224 kB L1 (chia thành phần lệnh và phần dữ liệu), nên cả chip có tổng 1,75 MB L1. Tương tự "8 × 4 MB L2" = 32 MB L2 riêng mỗi chip. Ngược lại, L3 là MỘT bể 64 MB dùng chung.</li>
<li><strong>Hình dáng là RIÊNG rồi CHUNG, y hệt máy để bàn.</strong> L1 và L2 riêng từng lõi → L3 chung trong chip → L4 chung trong nút. Mỗi bước đi ra là lớn hơn, chậm hơn, và phục vụ nhiều lõi hơn. Vẫn đúng bức hình của slide 32, chỉ thêm một tầng lầu.</li>
<li><strong>Vì sao lại có L4.</strong> Với 24 lõi mỗi ngăn và nhiều ngăn, lưu lượng giữ nhất quán giữa các chip sẽ nhấn chìm các bus. Cái L4 480 MB trên chip SC hứng lấy lưu lượng đó: một dòng mà chip này xin và chip kia đã lấy về rồi thì được phục vụ từ L4 thay vì từ bộ nhớ. L4 ít giống một cache hơn là một <strong>trung tâm nhất quán có kho</strong>.</li>
<li><strong>Ba bus có tên, ba phạm vi.</strong> X-Bus trong một nút, S-Bus giữa hai nút của một ngăn, A-Bus ra các ngăn khác. Đó là một <em>PHÂN CẤP BUS</em> — đúng kỹ thuật mà Chương 2 liệt kê dưới mục cân bằng hiệu năng: "tăng băng thông liên kết… bằng bus tốc độ cao hơn và một phân cấp bus để đệm và định hình dòng dữ liệu".</li>
<li><strong>Đối chiếu với Table 5.2 ở slide 11.</strong> Bảng đó ghi z13 là "24 × 96 kB/128 kB L1, 24 × 2 MB/2 MB L2, 64 MB L3, 480 MB L4". Cách ghi 96/128 xác nhận L1 ở đây là cache I/D <em>TÁCH RỜI</em> (96 kB lệnh + 128 kB dữ liệu = 224 kB, đúng con số trong hình này), và 24 = 3 chip PU × 8 lõi. Hai slide khớp nhau ngay khi bạn giải mã được ký hiệu.</li>
</ul>
<p class="meo">💡 Nhớ z13 bằng một dòng: <strong>L1+L2 riêng từng lõi, L3 chung trong chip, L4 chung trong nút — và L4 nằm trên một chip điều khiển riêng mà việc thật của nó là giữ NHẤT QUÁN.</strong></p>
<p class="pitfall">⚠️ Đừng cộng các con số như thể đó là phân cấp của MỘT lõi. Một lõi z13 <em>KHÔNG</em> nhìn thấy 224 kB + 4 MB + 64 MB + 480 MB "của riêng nó". Nó có riêng 224 kB và 4 MB; còn 64 MB và 480 MB là dùng chung với lần lượt 7 và 23 lõi khác. Lẫn "mỗi lõi" với "tổng cả chip" là cách đọc sai kinh điển của hình này.</p>`],

      [40, 'Cache Timing Model — where the time actually goes on a hit and on a miss',
        `<p class="y-chinh">🎯 The chapter's last conceptual idea: <strong>the mapping function does not only change the hit ratio, it changes the shape of the access itself</strong>. The slide walks the three organisations and shows that they differ in <em>what can be done in parallel</em>.</p>
<table>
<tr><th>Organisation</th><th>The slide's description of the access</th></tr>
<tr><td><strong>Direct-mapped</strong></td><td>First check the Tag field of the address against the tag value in the line designated by the Line field. If there is <strong>no match (miss)</strong>, the operation is complete. If there is a <strong>match (hit)</strong>, the hardware reads the data block from the line and then fetches the byte or word indicated by the Offset field. <strong>An advantage is that it allows simple and fast speculation</strong></td></tr>
<tr><td><strong>Fully associative</strong></td><td>The line number <strong>is not known until the tag comparison is completed</strong>. The hit time is the same as for direct-mapped. Because this is a content-addressable memory, the <strong>miss time is simply the tag comparison time</strong></td></tr>
<tr><td><strong>Set-associative</strong></td><td>It is <strong>not possible to transmit bytes and compare tags in parallel</strong> as can be done with direct-mapped with speculative access. However, the circuitry can be designed so that the data block from each line in a set can be <strong>loaded and then transmitted once the tag check is made</strong></td></tr>
</table>
<ul>
<li><strong>"Simple and fast speculation" is the direct-mapped superpower.</strong> Because the index picks exactly one line, the cache can start reading that line's data <em>before</em> it knows whether the tag matches. If the tag matches, the data is already on its way — the tag compare cost vanished from the hit path. If not, the speculative read is discarded. No other organisation can do this, because no other organisation knows which line to read in advance.</li>
<li><strong>Fully associative inverts the cost.</strong> It is the only organisation with a <em>cheap miss</em>: a CAM reports "no match anywhere" in one comparison step, so there is no line read at all (slide 16: "this process takes only one clock cycle"). Its hit is no faster than direct-mapped, and its area cost is brutal — which is why it is used only for small structures like TLBs.</li>
<li><strong>Set-associative is the compromise <em>in timing</em> too, not only in area.</strong> It cannot speculate on one line, but it can read <strong>all k lines of the set in parallel</strong> and then use the tag comparison result to select which of the k data words to forward. The tag compare and the data read overlap; only the final multiplexer waits. That is why the extra ways cost far less time than they look like they should.</li>
<li><strong>This slide explains why L1 caches are rarely more than 8-way.</strong> The k-way select multiplexer sits at the very end of the hit path, and it grows with k. Beyond 8 ways, that multiplexer starts adding a cycle to the load-use latency — which costs far more than the tiny hit-ratio gain shown on slide 24.</li>
<li><strong>Way prediction is the trick that gets speculation back.</strong> Predict which way will hit, speculatively read that way alone, and verify with the tag check. On a correct prediction the set-associative cache behaves like a direct-mapped one; on a miss-prediction you pay the tag compare after all. That is the last row of Table 5.6 on slide 41, and its formula makes the trade explicit.</li>
</ul>
<p class="meo">💡 One sentence per organisation: <strong>direct = guess the line and be right by construction; fully associative = ask everyone at once; set-associative = ask k at once and pick the winner afterwards.</strong></p>
<p class="pitfall">⚠️ The sentence "the hit time is the same as for direct-mapped" applies to <em>plain</em> direct-mapped, not to direct-mapped <strong>with speculation</strong>. Speculation is what makes direct-mapped strictly faster on a hit — which the table on slide 41 shows by dropping the t<sub>ct</sub> term from its hit equation.</p>`,
        `<p class="y-chinh">🎯 Ý niệm khái quát cuối cùng của chương: <strong>hàm ánh xạ không chỉ đổi tỉ lệ trúng, nó đổi HÌNH DÁNG của chính lần truy cập</strong>. Slide đi qua ba kiểu tổ chức và cho thấy chúng khác nhau ở chỗ <em>cái gì làm song song được</em>.</p>
<table>
<tr><th>Kiểu tổ chức</th><th>Slide mô tả lần truy cập thế nào</th></tr>
<tr><td><strong>Ánh xạ trực tiếp</strong></td><td>Trước hết so trường Tag của địa chỉ với giá trị tag ở dòng mà trường Line chỉ tới. Nếu <strong>không khớp (trượt)</strong> thì thao tác kết thúc. Nếu <strong>khớp (trúng)</strong> thì phần cứng đọc khối dữ liệu từ dòng đó rồi lấy byte hay từ mà trường Offset chỉ ra. <strong>Một ưu điểm là nó cho phép TIÊN ĐOÁN đơn giản và nhanh</strong></td></tr>
<tr><td><strong>Liên kết hoàn toàn</strong></td><td>Số hiệu dòng <strong>không biết được cho tới khi so tag xong</strong>. Thời gian trúng giống ánh xạ trực tiếp. Vì đây là bộ nhớ định địa chỉ theo nội dung (CAM), <strong>thời gian TRƯỢT chỉ đúng bằng thời gian so tag</strong></td></tr>
<tr><td><strong>Liên kết theo tập</strong></td><td><strong>KHÔNG thể vừa truyền byte vừa so tag song song</strong> như cách ánh xạ trực tiếp có tiên đoán làm được. Tuy nhiên mạch có thể thiết kế sao cho khối dữ liệu của từng dòng trong một tập được <strong>nạp sẵn rồi mới truyền đi sau khi việc kiểm tra tag hoàn tất</strong></td></tr>
</table>
<ul>
<li><strong>"Tiên đoán đơn giản và nhanh" là siêu năng lực của ánh xạ trực tiếp.</strong> Vì chỉ số chọn ra ĐÚNG MỘT dòng, cache có thể bắt đầu đọc dữ liệu của dòng đó <em>TRƯỚC KHI</em> biết tag có khớp không. Tag khớp thì dữ liệu đã trên đường rồi — chi phí so tag biến mất khỏi đường trúng. Không khớp thì vứt kết quả đọc tiên đoán đi. Không kiểu tổ chức nào khác làm được, vì không kiểu nào khác biết trước phải đọc dòng nào.</li>
<li><strong>Liên kết hoàn toàn đảo ngược cái giá.</strong> Nó là kiểu duy nhất có <em>LẦN TRƯỢT RẺ</em>: một CAM báo "không khớp ở đâu cả" chỉ trong một bước so sánh, nên không hề đọc dòng nào (slide 16: "quá trình này chỉ mất một chu kỳ xung nhịp"). Lần TRÚNG của nó không nhanh hơn ánh xạ trực tiếp, còn giá diện tích thì tàn bạo — nên nó chỉ dùng cho cấu trúc nhỏ như TLB.</li>
<li><strong>Liên kết theo tập cũng là lối dung hoà VỀ THỜI GIAN, không chỉ về diện tích.</strong> Nó không tiên đoán được một dòng, nhưng nó đọc được <strong>cả k dòng của tập SONG SONG</strong> rồi dùng kết quả so tag để chọn lấy một trong k từ dữ liệu mà chuyển đi. Việc so tag và việc đọc dữ liệu CHỒNG LÊN NHAU; chỉ có bộ chọn cuối cùng là phải chờ. Đó là lý do các đường phụ tốn ít thời gian hơn nhiều so với vẻ ngoài của nó.</li>
<li><strong>Slide này giải thích vì sao cache L1 hiếm khi quá 8 đường.</strong> Bộ chọn k đường nằm ở đúng cuối đường trúng, và nó to ra theo k. Quá 8 đường thì bộ chọn đó bắt đầu cộng thêm một chu kỳ vào độ trễ nạp-dùng — đắt hơn nhiều so với khoản tỉ lệ trúng tí xíu mà slide 24 cho thấy.</li>
<li><strong>Dự đoán đường (way prediction) là mẹo lấy lại được khả năng tiên đoán.</strong> Đoán xem đường nào sẽ trúng, chỉ đọc tiên đoán đúng đường đó, rồi kiểm lại bằng so tag. Đoán đúng thì cache liên kết theo tập hành xử như cache trực tiếp; đoán sai thì rốt cuộc vẫn phải trả tiền so tag. Đó chính là hàng cuối của Table 5.6 ở slide 41, và công thức của nó nói thẳng phép đánh đổi.</li>
</ul>
<p class="meo">💡 Mỗi kiểu một câu: <strong>trực tiếp = đoán dòng và đoán trúng do cấu tạo; liên kết hoàn toàn = hỏi tất cả cùng lúc; liên kết theo tập = hỏi k đứa cùng lúc rồi chọn đứa thắng sau.</strong></p>
<p class="pitfall">⚠️ Câu "thời gian trúng giống ánh xạ trực tiếp" áp cho ánh xạ trực tiếp <em>THUẦN</em>, không phải ánh xạ trực tiếp <strong>CÓ TIÊN ĐOÁN</strong>. Chính tiên đoán mới làm ánh xạ trực tiếp nhanh hơn hẳn khi trúng — và bảng ở slide 41 thể hiện điều đó bằng cách bỏ số hạng t<sub>ct</sub> khỏi phương trình trúng của nó.</p>`],

      [41, 'Table 5.6 — Cache Timing Equations',
        `<p class="y-chinh">🎯 Slide 40's prose turned into five pairs of equations. Three symbols carry everything: <strong>t<sub>rl</sub></strong> = time to read the line, <strong>t<sub>xb</sub></strong> = time to transmit the byte/word, <strong>t<sub>ct</sub></strong> = time to compare the tags.</p>
<table>
<tr><th>Organisation</th><th>Time for hit</th><th>Time for miss</th></tr>
<tr><td>Direct-Mapped</td><td>t<sub>hit</sub> = t<sub>rl</sub> + t<sub>xb</sub> + t<sub>ct</sub></td><td>t<sub>miss</sub> = t<sub>rl</sub> + t<sub>ct</sub></td></tr>
<tr><td><strong>Direct-Mapped with Speculation</strong></td><td>t<sub>hit</sub> = t<sub>rl</sub> + t<sub>xb</sub> &nbsp;<em>(no t<sub>ct</sub>)</em></td><td>t<sub>miss</sub> = t<sub>rl</sub> + t<sub>ct</sub></td></tr>
<tr><td><strong>Fully Associative</strong></td><td>t<sub>hit</sub> = t<sub>rl</sub> + t<sub>xb</sub> + t<sub>ct</sub></td><td>t<sub>miss</sub> = t<sub>ct</sub> &nbsp;<em>(no t<sub>rl</sub>)</em></td></tr>
<tr><td>Set-Associative</td><td>t<sub>hit</sub> = t<sub>rl</sub> + t<sub>xb</sub> + t<sub>ct</sub></td><td>t<sub>miss</sub> = t<sub>rl</sub> + t<sub>ct</sub></td></tr>
<tr><td>Set-Associative with Way Prediction</td><td>t<sub>hit</sub> = t<sub>rl</sub> + t<sub>xb</sub> + (1 − F<sub>p</sub>)·t<sub>ct</sub></td><td>t<sub>miss</sub> = t<sub>rl</sub> + t<sub>ct</sub></td></tr>
</table>
<ul>
<li><strong>Read the table by looking for the MISSING term.</strong> Four of the five hit equations are identical; the differences are the absences. Direct-mapped with speculation loses <strong>t<sub>ct</sub></strong> from the hit path (the tag compare happened in parallel with the data read). Fully associative loses <strong>t<sub>rl</sub></strong> from the miss path (a CAM never reads a line to discover there is no match).</li>
<li><strong>The way-prediction row is the only one with a variable in it.</strong> F<sub>p</sub> is the fraction of correct predictions. At F<sub>p</sub> = 1 the equation collapses to t<sub>rl</sub> + t<sub>xb</sub> — identical to direct-mapped with speculation. At F<sub>p</sub> = 0 it becomes t<sub>rl</sub> + t<sub>xb</sub> + t<sub>ct</sub>, i.e. plain set-associative. The row is a slider between the other two rows.</li>
<li><strong>Worked example.</strong> Let t<sub>rl</sub> = 2 ns, t<sub>xb</sub> = 1 ns, t<sub>ct</sub> = 1 ns, and way prediction accuracy F<sub>p</sub> = 0.85. Plain set-associative hit = 2 + 1 + 1 = <strong>4 ns</strong>. With way prediction = 2 + 1 + 0.15 × 1 = <strong>3.15 ns</strong>. Direct-mapped with speculation = <strong>3 ns</strong>.</li>
<li><p class="dap-an">✅ Answer: way prediction recovers <strong>0.85 ns of the 1 ns gap</strong> — it delivers 85% of direct mapping's speed advantage while keeping set-associative's hit ratio. That is precisely why the technique appears as the first row of Table 5.7 on the next slide, under "Reduce t<sub>1</sub>".</p></li>
<li><strong>Notice what the equations do NOT include:</strong> the cost of going to the next level. t<sub>miss</sub> here is only the time to <em>discover</em> the miss, not the time to service it. The service cost is the t<sub>penalty</sub> column of Table 5.7, and it is one to two orders of magnitude larger than anything in this table.</li>
</ul>
<p class="meo">💡 Three letters, three actions: <strong>rl = read the Line, xb = transmit the Byte, ct = Compare the Tag.</strong> Once you can expand the abbreviations, every row of the table reads itself.</p>
<p class="pitfall">⚠️⚠️ <strong>The slide has a typographical error.</strong> The last row's "Time for miss" cell is printed as "<em>T= = t<sub>rl</sub> + t<sub>ct</sub></em>". The "T=" is a typo for <strong>t<sub>miss</sub></strong> — the miss equation for way prediction is the same as for plain set-associative, because a wrong way prediction still has to fall back on the full tag compare. Reported here, not silently copied and not corrected on the slide.</p>
<p class="pitfall">⚠️ Do not conclude from "fully associative has the cheapest miss" that fully associative is the fastest organisation. Misses are rare (5%) and hits are common (95%); an organisation is judged mostly by its hit time and its area, both of which fully associative loses badly.</p>`,
        `<p class="y-chinh">🎯 Phần lời của slide 40 quy thành năm cặp phương trình. Ba ký hiệu gánh hết: <strong>t<sub>rl</sub></strong> = thời gian đọc dòng, <strong>t<sub>xb</sub></strong> = thời gian truyền byte/từ, <strong>t<sub>ct</sub></strong> = thời gian so tag.</p>
<table>
<tr><th>Kiểu tổ chức</th><th>Thời gian khi TRÚNG</th><th>Thời gian khi TRƯỢT</th></tr>
<tr><td>Ánh xạ trực tiếp</td><td>t<sub>hit</sub> = t<sub>rl</sub> + t<sub>xb</sub> + t<sub>ct</sub></td><td>t<sub>miss</sub> = t<sub>rl</sub> + t<sub>ct</sub></td></tr>
<tr><td><strong>Trực tiếp CÓ TIÊN ĐOÁN</strong></td><td>t<sub>hit</sub> = t<sub>rl</sub> + t<sub>xb</sub> &nbsp;<em>(mất t<sub>ct</sub>)</em></td><td>t<sub>miss</sub> = t<sub>rl</sub> + t<sub>ct</sub></td></tr>
<tr><td><strong>Liên kết hoàn toàn</strong></td><td>t<sub>hit</sub> = t<sub>rl</sub> + t<sub>xb</sub> + t<sub>ct</sub></td><td>t<sub>miss</sub> = t<sub>ct</sub> &nbsp;<em>(mất t<sub>rl</sub>)</em></td></tr>
<tr><td>Liên kết theo tập</td><td>t<sub>hit</sub> = t<sub>rl</sub> + t<sub>xb</sub> + t<sub>ct</sub></td><td>t<sub>miss</sub> = t<sub>rl</sub> + t<sub>ct</sub></td></tr>
<tr><td>Liên kết theo tập CÓ DỰ ĐOÁN ĐƯỜNG</td><td>t<sub>hit</sub> = t<sub>rl</sub> + t<sub>xb</sub> + (1 − F<sub>p</sub>)·t<sub>ct</sub></td><td>t<sub>miss</sub> = t<sub>rl</sub> + t<sub>ct</sub></td></tr>
</table>
<ul>
<li><strong>Đọc bảng bằng cách tìm số hạng BỊ THIẾU.</strong> Bốn trong năm phương trình trúng giống hệt nhau; khác biệt nằm ở những chỗ VẮNG MẶT. Trực tiếp có tiên đoán mất <strong>t<sub>ct</sub></strong> khỏi đường trúng (việc so tag đã chạy song song với việc đọc dữ liệu). Liên kết hoàn toàn mất <strong>t<sub>rl</sub></strong> khỏi đường trượt (CAM không bao giờ phải đọc một dòng để biết là không khớp).</li>
<li><strong>Hàng dự đoán đường là hàng DUY NHẤT có biến số.</strong> F<sub>p</sub> là tỉ lệ đoán đúng. Với F<sub>p</sub> = 1 thì phương trình co lại thành t<sub>rl</sub> + t<sub>xb</sub> — giống hệt trực tiếp có tiên đoán. Với F<sub>p</sub> = 0 thì thành t<sub>rl</sub> + t<sub>xb</sub> + t<sub>ct</sub>, tức liên kết theo tập thuần. Hàng này là một cái CẦN GẠT trượt giữa hai hàng kia.</li>
<li><strong>Ví dụ có lời giải.</strong> Cho t<sub>rl</sub> = 2 ns, t<sub>xb</sub> = 1 ns, t<sub>ct</sub> = 1 ns, độ chính xác dự đoán đường F<sub>p</sub> = 0,85. Liên kết theo tập thuần, khi trúng = 2 + 1 + 1 = <strong>4 ns</strong>. Có dự đoán đường = 2 + 1 + 0,15 × 1 = <strong>3,15 ns</strong>. Trực tiếp có tiên đoán = <strong>3 ns</strong>.</li>
<li><p class="dap-an">✅ Đáp án: dự đoán đường lấy lại được <strong>0,85 ns trong khoảng cách 1 ns</strong> — nó cho 85% lợi thế tốc độ của ánh xạ trực tiếp trong khi vẫn giữ tỉ lệ trúng của liên kết theo tập. Chính xác là lý do kỹ thuật này đứng ở hàng ĐẦU TIÊN của Table 5.7 slide sau, dưới cột "Giảm t<sub>1</sub>".</p></li>
<li><strong>Để ý thứ các phương trình KHÔNG bao gồm:</strong> chi phí đi xuống mức kế tiếp. t<sub>miss</sub> ở đây chỉ là thời gian để <em>PHÁT HIỆN</em> ra lần trượt, không phải thời gian PHỤC VỤ nó. Chi phí phục vụ là cột t<sub>penalty</sub> của Table 5.7, và nó lớn hơn mọi thứ trong bảng này một tới hai bậc.</li>
</ul>
<p class="meo">💡 Ba chữ, ba hành động: <strong>rl = Read the Line (đọc dòng), xb = transmit the Byte (truyền byte), ct = Compare the Tag (so tag).</strong> Giải được ba chữ viết tắt là mọi hàng của bảng tự đọc lấy.</p>
<p class="pitfall">⚠️⚠️ <strong>Slide có LỖI GÕ.</strong> Ô "Time for miss" của hàng cuối in là "<em>T= = t<sub>rl</sub> + t<sub>ct</sub></em>". Cái "T=" là lỗi gõ của <strong>t<sub>miss</sub></strong> — phương trình trượt của dự đoán đường giống hệt liên kết theo tập thuần, vì đoán sai đường thì rốt cuộc vẫn phải lùi về so tag đầy đủ. Nêu ra ở đây, không im lặng chép lại và cũng không tự sửa slide.</p>
<p class="pitfall">⚠️ Đừng từ câu "liên kết hoàn toàn có lần trượt rẻ nhất" mà kết luận nó là kiểu tổ chức nhanh nhất. Trượt thì hiếm (5%) còn trúng thì thường xuyên (95%); một kiểu tổ chức được chấm chủ yếu bằng thời gian TRÚNG và DIỆN TÍCH, mà liên kết hoàn toàn thua đậm ở cả hai.</p>`],

      [42, 'Table 5.7 — Cache Performance Improvement Techniques',
        `<p class="y-chinh">🎯 The chapter's summary sheet, organised by <strong>which term of the average-access-time equation each technique attacks</strong>: reduce t<sub>1</sub> (hit time), reduce (1 − h<sub>1</sub>) (miss rate), or reduce t<sub>penalty</sub> (cost of a miss). Several rows pull in opposite directions — that is the point.</p>
<table>
<tr><th>Technique</th><th>Reduce t<sub>1</sub></th><th>Reduce (1 − h<sub>1</sub>)</th><th>Reduce t<sub>penalty</sub></th></tr>
<tr><td>Way Prediction</td><td>✓</td><td></td><td></td></tr>
<tr><td><strong>Cache Capacity</strong></td><td>Small</td><td>Large</td><td></td></tr>
<tr><td><strong>Line Size</strong></td><td>Small</td><td>Large</td><td></td></tr>
<tr><td><strong>Degree of Associativity</strong></td><td>Decrease</td><td>Increase</td><td></td></tr>
<tr><td>More Flexible Replacement Policies</td><td></td><td>✓</td><td></td></tr>
<tr><td><strong>Cache Unity</strong> (unified vs split)</td><td>Split I-cache and D-cache</td><td>Unified cache</td><td></td></tr>
<tr><td>Prefetching</td><td></td><td>✓</td><td></td></tr>
<tr><td><strong>Write Through</strong></td><td></td><td>Write allocate</td><td>No write allocate</td></tr>
<tr><td>Critical Word First</td><td></td><td></td><td>✓</td></tr>
<tr><td>Victim Cache</td><td></td><td></td><td>✓</td></tr>
<tr><td>Wider Busses</td><td></td><td></td><td>✓</td></tr>
</table>
<ul>
<li><strong>The four rows with words instead of ticks are the heart of the table.</strong> Capacity, line size, associativity and unity each have <em>opposite</em> answers in the first two columns. Small/large, small/large, decrease/increase, split/unified — every one of these is a direct conflict between hit time and hit rate, and the whole chapter has been about navigating it.</li>
<li><strong>Three techniques you have not met yet, and what they do.</strong> <em>Critical word first</em>: on a miss, fetch and forward the <strong>requested</strong> word before the rest of the line, so the processor restarts immediately instead of waiting for the whole block. <em>Victim cache</em>: a tiny fully-associative buffer holding recently evicted lines, so a conflict miss that would have gone to memory is caught locally. <em>Wider busses</em>: fewer beats to move a line — Chapter 2's "wider rather than deeper", applied to the miss penalty.</li>
<li><strong>Prefetching is the only technique that lowers the miss rate without spending capacity.</strong> It guesses what will be needed and fetches early. It costs bandwidth and, if the guess is wrong, cache pollution — and note it is the one row whose benefit depends entirely on the quality of the prediction, like way prediction in the first row.</li>
<li><strong>The "Write Through" row is oddly named but says something real:</strong> under a write-through cache, choosing <strong>write allocate</strong> lowers the miss rate (the line is now cached for later) while <strong>no write allocate</strong> lowers the miss penalty (no block fetch on a write miss). That is slide 29's 2×2, placed into this framework.</li>
<li><strong>Use this table as the revision checklist for the whole chapter.</strong> Each row maps to a slide: way prediction → 40/41, capacity → 10 and 24, line size → 31, associativity → 20–24, replacement → 25/26, unity → 34, write policy → 28/29. If you can say which slide each row came from, you have the chapter.</li>
</ul>
<p class="meo">💡 Learn the equation the table is organised around: <strong>T<sub>a</sub> = t<sub>1</sub> + (1 − h<sub>1</sub>) × t<sub>penalty</sub></strong>. Three terms, three columns. Any exam question of the form "how would you make this cache faster?" is asking you to name a term first and a technique second.</p>
<p class="pitfall">⚠️ <strong>The slide is visually broken:</strong> the table is taller than the slide frame, so the last row ("Wider Busses") falls off the bottom edge and "Victim Cache" is clipped in half. The full table exists in the .pptx file and in the textbook — the row is listed above so you do not learn an incomplete table. Reported, not silently omitted.</p>
<p class="pitfall">⚠️ The row label "<strong>Cache Unity</strong>" is unusual phrasing; it means <em>unified versus split</em> (slide 34), not "uniformity" or "unity of design". Read it as "cache unification".</p>`,
        `<p class="y-chinh">🎯 Tờ tổng kết của cả chương, sắp xếp theo <strong>kỹ thuật đó đánh vào SỐ HẠNG NÀO của phương trình thời gian truy cập trung bình</strong>: giảm t<sub>1</sub> (thời gian trúng), giảm (1 − h<sub>1</sub>) (tỉ lệ trượt), hay giảm t<sub>penalty</sub> (giá của một lần trượt). Nhiều hàng kéo về HAI HƯỚNG NGƯỢC NHAU — và đó chính là điều đáng nói.</p>
<table>
<tr><th>Kỹ thuật</th><th>Giảm t<sub>1</sub></th><th>Giảm (1 − h<sub>1</sub>)</th><th>Giảm t<sub>penalty</sub></th></tr>
<tr><td>Dự đoán đường (Way Prediction)</td><td>✓</td><td></td><td></td></tr>
<tr><td><strong>Dung lượng cache</strong></td><td>Nhỏ</td><td>Lớn</td><td></td></tr>
<tr><td><strong>Kích thước dòng</strong></td><td>Nhỏ</td><td>Lớn</td><td></td></tr>
<tr><td><strong>Độ liên kết</strong></td><td>Giảm</td><td>Tăng</td><td></td></tr>
<tr><td>Chính sách thay thế linh hoạt hơn</td><td></td><td>✓</td><td></td></tr>
<tr><td><strong>Cache Unity</strong> (thống nhất hay tách rời)</td><td>Tách I-cache và D-cache</td><td>Cache thống nhất</td><td></td></tr>
<tr><td>Nạp trước (Prefetching)</td><td></td><td>✓</td><td></td></tr>
<tr><td><strong>Write Through</strong></td><td></td><td>Write allocate</td><td>No write allocate</td></tr>
<tr><td>Ưu tiên từ then chốt (Critical Word First)</td><td></td><td></td><td>✓</td></tr>
<tr><td>Victim Cache</td><td></td><td></td><td>✓</td></tr>
<tr><td>Bus rộng hơn (Wider Busses)</td><td></td><td></td><td>✓</td></tr>
</table>
<ul>
<li><strong>Bốn hàng có CHỮ thay vì dấu tích mới là trái tim của bảng.</strong> Dung lượng, kích thước dòng, độ liên kết và tính thống nhất — mỗi cái đều có câu trả lời <em>NGƯỢC NHAU</em> ở hai cột đầu. Nhỏ/lớn, nhỏ/lớn, giảm/tăng, tách/thống nhất — từng cái một là một xung đột trực diện giữa thời gian trúng và tỉ lệ trúng, và cả chương này là chuyện đi tìm đường giữa hai bờ đó.</li>
<li><strong>Ba kỹ thuật bạn chưa gặp, và chúng làm gì.</strong> <em>Critical word first</em>: khi trượt, lấy và chuyển đi <strong>ĐÚNG TỪ ĐƯỢC YÊU CẦU</strong> trước phần còn lại của dòng, để bộ xử lý chạy tiếp ngay chứ không chờ cả khối. <em>Victim cache</em>: một bộ đệm liên kết hoàn toàn tí hon giữ các dòng vừa bị đuổi, để một lần trượt do đụng độ lẽ ra phải xuống bộ nhớ thì được bắt lại ngay tại chỗ. <em>Bus rộng hơn</em>: ít nhịp hơn để chuyển một dòng — "rộng hơn thay vì sâu hơn" của Chương 2, áp cho hình phạt trượt.</li>
<li><strong>Nạp trước là kỹ thuật DUY NHẤT hạ được tỉ lệ trượt mà không tốn dung lượng.</strong> Nó đoán xem sắp cần gì rồi lấy sớm. Cái giá là băng thông, và nếu đoán sai thì là ô nhiễm cache — để ý đây là hàng mà lợi ích phụ thuộc HOÀN TOÀN vào chất lượng dự đoán, giống dự đoán đường ở hàng đầu.</li>
<li><strong>Hàng "Write Through" đặt tên hơi lạ nhưng nói điều có thật:</strong> dưới cache ghi xuyên, chọn <strong>write allocate</strong> làm hạ TỈ LỆ TRƯỢT (dòng giờ đã nằm trong cache cho lần sau) còn <strong>no write allocate</strong> làm hạ HÌNH PHẠT TRƯỢT (không phải nạp khối khi ghi trượt). Đó chính là bảng 2×2 của slide 29, đặt vào khung này.</li>
<li><strong>Dùng bảng này làm danh mục ôn cho cả chương.</strong> Mỗi hàng ứng một slide: dự đoán đường → 40/41, dung lượng → 10 và 24, kích thước dòng → 31, độ liên kết → 20–24, thay thế → 25/26, thống nhất/tách rời → 34, chính sách ghi → 28/29. Nói được mỗi hàng đến từ slide nào là bạn đã nắm cả chương.</li>
</ul>
<p class="meo">💡 Học thuộc phương trình mà cả bảng xoay quanh: <strong>T<sub>a</sub> = t<sub>1</sub> + (1 − h<sub>1</sub>) × t<sub>penalty</sub></strong>. Ba số hạng, ba cột. Mọi câu hỏi kiểu "làm sao cho cache này nhanh hơn?" thực chất là bắt bạn gọi tên MỘT SỐ HẠNG trước, rồi mới tới kỹ thuật.</p>
<p class="pitfall">⚠️ <strong>Slide bị vỡ về hình:</strong> bảng CAO HƠN khung slide, nên hàng cuối ("Wider Busses") rơi khỏi mép dưới và hàng "Victim Cache" bị cắt mất một nửa. Bảng đầy đủ có trong file .pptx và trong giáo trình — hàng đó đã được liệt kê ở trên để bạn không học phải một bảng thiếu. Nêu ra, không im lặng bỏ qua.</p>
<p class="pitfall">⚠️ Nhãn hàng "<strong>Cache Unity</strong>" là cách gọi lạ; nó nghĩa là <em>thống nhất hay tách rời</em> (slide 34), chứ không phải "tính đồng nhất" hay "sự thống nhất trong thiết kế". Đọc nó là "cache unification".</p>`],

      [43, 'Summary — Chapter 5, Cache Memory',
        `<p class="y-chinh">🎯 The closing checklist. Tick every line and you have the chapter; the exam draws from exactly this list, and the heaviest-weighted items are the ones with arithmetic behind them.</p>
<table>
<tr><th>Summary line on the slide</th><th>Slides</th><th>What you must be able to DO, not just define</th></tr>
<tr><td>Cache memory principles</td><td>2–6</td><td>draw the read-operation flow; explain block/line/tag/frame</td></tr>
<tr><td>Cache addresses (logical / physical)</td><td>7–9</td><td>say where the MMU sits relative to the cache</td></tr>
<tr><td>Cache size</td><td>10–11</td><td>argue both directions: why not bigger, why not smaller</td></tr>
<tr><td><strong>Logical cache organization</strong> (mapping)</td><td>12–24</td><td><strong>split any address into Tag | Set | Word, both directions</strong></td></tr>
<tr><td><strong>Replacement algorithms</strong></td><td>25–26</td><td><strong>hand-run LRU, FIFO, LFU on a given trace and count misses</strong></td></tr>
<tr><td><strong>Write policy</strong></td><td>27–30</td><td>choose through/back and allocate/no-allocate, and justify it</td></tr>
<tr><td>Line size</td><td>31</td><td>explain the inverted-U and the two effects behind it</td></tr>
<tr><td>Number of caches (levels, unified/split)</td><td>32–34</td><td>compute average access time across levels</td></tr>
<tr><td>Inclusion policy</td><td>35</td><td>compare inclusive/exclusive/noninclusive by capacity and coherence</td></tr>
<tr><td>Intel x86 cache organization</td><td>36–38</td><td>read Table 5.4 as problem→solution; decode the CD/NW modes</td></tr>
<tr><td>The IBM z13 cache organization</td><td>39</td><td>read "8 ×" as per-core; explain why L4 exists</td></tr>
<tr><td>Cache performance modules — timing model, design options</td><td>40–42</td><td>expand t<sub>rl</sub>/t<sub>xb</sub>/t<sub>ct</sub>; place a technique in the right column</td></tr>
</table>
<p class="nhan">Worked problem 4 — the REVERSE direction (the one most students have never practised)</p>
<p>Main memory 1 MB, cache 4 kB, line 8 bytes, <strong>2-way</strong> set-associative. A block is found in <strong>set 0x0C1</strong> with <strong>tag 0x5B</strong>. Which range of main-memory addresses does it hold? And how many different memory blocks compete for that set?</p>
<ul>
<li>1 MB = 2<sup>20</sup> → address = 20 bits. Line 8 B = 2<sup>3</sup> → <strong>Word = 3 bits</strong>.</li>
<li>Lines = 4096 ÷ 8 = 512. Sets = 512 ÷ 2 = <strong>256</strong> = 2<sup>8</sup> → <strong>Set = 8 bits</strong>.</li>
<li>Tag = 20 − 8 − 3 = <strong>9 bits</strong>.</li>
<li>Now rebuild the address instead of taking it apart: place tag 0x5B = <code>001011011</code> in the top 9 bits, set 0xC1 = <code>11000001</code> in the next 8, and the Word field spans 000 to 111.</li>
</ul>
<table>
<tr><th>Tag (9 bits)</th><th>Set (8 bits)</th><th>Word (3 bits)</th><th>Full 20-bit address</th></tr>
<tr><td>001011011 (0x5B)</td><td>11000001 (0xC1)</td><td>000 (lowest)</td><td>00101101111000001000 = <strong>0x2DE08</strong></td></tr>
<tr><td>001011011</td><td>11000001</td><td>111 (highest)</td><td>00101101111000001111 = <strong>0x2DE0F</strong></td></tr>
</table>
<p class="dap-an">✅ Answer: the line holds main memory addresses <strong>0x2DE08 through 0x2DE0F</strong> — exactly 8 bytes, as it must be. Verified both ways by program: building the address from (tag, set, word) and then splitting it again returns tag 0x5B, set 0xC1. Second part: the number of distinct memory blocks that map to any one set equals 2<sup>tag bits</sup> = 2<sup>9</sup> = <strong>512</strong>. Cross-check: total memory blocks = 2<sup>20</sup>/8 = 131 072; divided by 256 sets = 512 blocks per set. Two independent routes, same number.</p>
<p class="nhan">Five questions this chapter's exam will ask, and where the answer lives</p>
<table>
<tr><th>Question shape</th><th>Method</th></tr>
<tr><td>"Split this address for a k-way cache"</td><td>Word = log<sub>2</sub>(line bytes); Set = log<sub>2</sub>(lines ÷ k); Tag = rest. Slide 23</td></tr>
<tr><td>"Which block is evicted under LRU/FIFO/LFU?"</td><td>tabulate every access, update recency on hits too. Slide 26</td></tr>
<tr><td>"Write-through or write-back — justify"</td><td>count bus transactions; mention the dirty bit. Slide 28</td></tr>
<tr><td>"Compute average access time with L1 and L2"</td><td>T<sub>a</sub> = t<sub>1</sub> + (1−h<sub>1</sub>)[t<sub>2</sub> + (1−h<sub>2</sub>)t<sub>mem</sub>]; state whether h<sub>2</sub> is local. Slide 32</td></tr>
<tr><td>"Why split L1 but unified L2?"</td><td>contention between IF and MEM in the pipeline. Slide 34</td></tr>
</table>
<p class="meo">💡 If you revise only one thing, revise the address split — and practise it <strong>in both directions</strong>. Forward (address → fields) is what most students drill; backward (fields → address range) is what separates full marks from partial marks, and it takes ten minutes to learn once you see that you are simply concatenating bit fields.</p>
<p class="pitfall">⚠️ The single most expensive mistake in this chapter remains the same one from slide 23: <strong>Set bits = log<sub>2</sub>(number of SETS), not log<sub>2</sub>(number of lines)</strong>. Divide by k first. Every reverse problem, every forward problem, every tag-storage calculation collapses if you get that one division wrong.</p>`,
        `<p class="y-chinh">🎯 Danh mục khép lại chương. Đánh dấu hết mọi dòng là bạn có cả chương; đề thi rút đúng từ danh sách này, và những mục nặng điểm nhất là những mục có PHÉP TÍNH đứng sau.</p>
<table>
<tr><th>Dòng tổng kết trên slide</th><th>Slide</th><th>Bạn phải LÀM ĐƯỢC gì, không chỉ định nghĩa</th></tr>
<tr><td>Nguyên lý bộ nhớ cache</td><td>2–6</td><td>vẽ được lưu đồ thao tác đọc; giải thích block/line/tag/frame</td></tr>
<tr><td>Địa chỉ cache (logic / vật lý)</td><td>7–9</td><td>nói được MMU đứng ở đâu so với cache</td></tr>
<tr><td>Kích thước cache</td><td>10–11</td><td>lập luận được CẢ HAI CHIỀU: vì sao không lớn hơn, vì sao không nhỏ hơn</td></tr>
<tr><td><strong>Tổ chức logic của cache</strong> (ánh xạ)</td><td>12–24</td><td><strong>tách được mọi địa chỉ ra Tag | Set | Word, CẢ HAI CHIỀU</strong></td></tr>
<tr><td><strong>Thuật toán thay thế</strong></td><td>25–26</td><td><strong>chạy tay được LRU, FIFO, LFU trên một dãy cho trước và đếm số trượt</strong></td></tr>
<tr><td><strong>Chính sách ghi</strong></td><td>27–30</td><td>chọn được through/back và allocate/no-allocate, và biện minh được</td></tr>
<tr><td>Kích thước dòng</td><td>31</td><td>giải thích được chữ U ngược và hai hiệu ứng đứng sau</td></tr>
<tr><td>Số lượng cache (số mức, thống nhất/tách rời)</td><td>32–34</td><td>tính được thời gian truy cập trung bình qua các mức</td></tr>
<tr><td>Chính sách bao hàm</td><td>35</td><td>so được inclusive/exclusive/noninclusive theo dung lượng và nhất quán</td></tr>
<tr><td>Tổ chức cache Intel x86</td><td>36–38</td><td>đọc Table 5.4 theo lối vấn đề→lời giải; giải mã được chế độ CD/NW</td></tr>
<tr><td>Tổ chức cache IBM z13</td><td>39</td><td>đọc "8 ×" là MỖI LÕI; giải thích được vì sao có L4</td></tr>
<tr><td>Mô-đun hiệu năng cache — mô hình thời gian, các lựa chọn thiết kế</td><td>40–42</td><td>khai triển được t<sub>rl</sub>/t<sub>xb</sub>/t<sub>ct</sub>; đặt được một kỹ thuật vào đúng cột</td></tr>
</table>
<p class="nhan">Bài 4 — chiều NGƯỢC (chiều mà phần lớn sinh viên chưa bao giờ luyện)</p>
<p>Bộ nhớ chính 1 MB, cache 4 kB, dòng 8 byte, liên kết theo tập <strong>2 đường</strong>. Một khối được tìm thấy ở <strong>tập 0x0C1</strong> với <strong>tag 0x5B</strong>. Nó giữ DẢI địa chỉ bộ nhớ chính nào? Và có bao nhiêu khối bộ nhớ khác nhau tranh nhau cái tập đó?</p>
<ul>
<li>1 MB = 2<sup>20</sup> → địa chỉ 20 bit. Dòng 8 B = 2<sup>3</sup> → <strong>Word = 3 bit</strong>.</li>
<li>Số dòng = 4096 ÷ 8 = 512. Số tập = 512 ÷ 2 = <strong>256</strong> = 2<sup>8</sup> → <strong>Set = 8 bit</strong>.</li>
<li>Tag = 20 − 8 − 3 = <strong>9 bit</strong>.</li>
<li>Giờ DỰNG LẠI địa chỉ thay vì bóc nó ra: đặt tag 0x5B = <code>001011011</code> vào 9 bit cao nhất, set 0xC1 = <code>11000001</code> vào 8 bit kế, và trường Word chạy từ 000 tới 111.</li>
</ul>
<table>
<tr><th>Tag (9 bit)</th><th>Set (8 bit)</th><th>Word (3 bit)</th><th>Địa chỉ 20 bit đầy đủ</th></tr>
<tr><td>001011011 (0x5B)</td><td>11000001 (0xC1)</td><td>000 (thấp nhất)</td><td>00101101111000001000 = <strong>0x2DE08</strong></td></tr>
<tr><td>001011011</td><td>11000001</td><td>111 (cao nhất)</td><td>00101101111000001111 = <strong>0x2DE0F</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án: dòng đó giữ các địa chỉ bộ nhớ chính <strong>0x2DE08 tới 0x2DE0F</strong> — đúng 8 byte, như bắt buộc phải thế. Đã kiểm HAI CHIỀU bằng chương trình: dựng địa chỉ từ (tag, set, word) rồi tách lại ra thì được đúng tag 0x5B, set 0xC1. Phần hai: số khối bộ nhớ khác nhau cùng ánh xạ vào MỘT tập bằng 2<sup>số bit tag</sup> = 2<sup>9</sup> = <strong>512</strong>. Kiểm chéo: tổng số khối bộ nhớ = 2<sup>20</sup>/8 = 131 072; chia cho 256 tập = 512 khối mỗi tập. Hai đường độc lập, cùng một con số.</p>
<p class="nhan">Năm dạng câu hỏi đề chương này sẽ hỏi, và đáp án nằm ở đâu</p>
<table>
<tr><th>Dạng câu hỏi</th><th>Cách làm</th></tr>
<tr><td>"Tách địa chỉ này cho cache k đường"</td><td>Word = log<sub>2</sub>(số byte một dòng); Set = log<sub>2</sub>(số dòng ÷ k); Tag = phần còn lại. Slide 23</td></tr>
<tr><td>"Khối nào bị đuổi theo LRU/FIFO/LFU?"</td><td>lập bảng cho MỌI lượt truy cập, nhớ cập nhật mốc thời gian cả khi TRÚNG. Slide 26</td></tr>
<tr><td>"Write-through hay write-back — biện minh"</td><td>đếm số giao dịch bus; nhắc tới bit dirty. Slide 28</td></tr>
<tr><td>"Tính thời gian truy cập trung bình với L1 và L2"</td><td>T<sub>a</sub> = t<sub>1</sub> + (1−h<sub>1</sub>)[t<sub>2</sub> + (1−h<sub>2</sub>)t<sub>bộ nhớ</sub>]; ghi rõ h<sub>2</sub> là cục bộ hay không. Slide 32</td></tr>
<tr><td>"Vì sao L1 tách mà L2 thống nhất?"</td><td>tranh chấp giữa tầng IF và tầng MEM trong pipeline. Slide 34</td></tr>
</table>
<p class="meo">💡 Nếu chỉ ôn được một thứ, hãy ôn phép tách địa chỉ — và luyện nó <strong>THEO CẢ HAI CHIỀU</strong>. Chiều xuôi (địa chỉ → các trường) là thứ hầu hết sinh viên luyện; chiều ngược (các trường → dải địa chỉ) mới là thứ phân biệt điểm tối đa với điểm một phần, mà nó chỉ mất mười phút để học một khi bạn thấy rằng bản chất chỉ là GHÉP các trường bit lại.</p>
<p class="pitfall">⚠️ Lỗi đắt nhất của cả chương vẫn là đúng lỗi ở slide 23: <strong>số bit Set = log<sub>2</sub>(số TẬP), không phải log<sub>2</sub>(số dòng)</strong>. Chia cho k TRƯỚC. Mọi bài chiều ngược, mọi bài chiều xuôi, mọi phép tính dung lượng tag đều sụp đổ nếu bạn làm sai đúng một phép chia đó.</p>`],

    ]),
  ].join('\n'),
};
