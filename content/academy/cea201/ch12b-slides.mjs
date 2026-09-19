/**
 * CEA201 · Chương 12 trên web (= Ch.16 bản 11e) — Processor Structure and
 * Function, học theo từng slide, PHẦN B: slide 29–56 của deck 'cea16'.
 *
 * ⚠️ ĐÁNH SỐ: syllabus của trường theo bản 9th ed gọi phần này là "Chapter 14:
 * Processor Structure and Function"; web đánh là "Chương 12". Deck slide là bản
 * 11th ed nên in "Chapter 16". Ba con số, một nội dung. Xem _slides.mjs.
 *
 * Nội dung bám ĐÚNG chữ trích từ CH16-COA11e.pptx (/tmp/cea201-text/cea16.txt).
 * Slide chỉ có tiêu đề + hình/bảng (30, 33, 35, 36, 37, 38, 39, 40, 41, 42, 43,
 * 44, 45, 46, 50, 51, 52, 53, 54, 56) đã ĐỌC THẲNG TỪ ẢNH render để lấy đúng
 * từng nhãn trên sơ đồ.
 *
 * ⚠️ MỌI con số dự đoán rẽ nhánh trong bài lấy từ CHƯƠNG TRÌNH MÔ PHỎNG chạy
 * thật (python3), không đếm tay:
 *   · Máy trạng thái 2 bit lấy ĐÚNG Figure 16.19: ST{T→ST,N→WT} · WT{T→ST,N→SN}
 *     · SN{N→SN,T→WN} · WN{N→SN,T→ST}. Lưu ý đây KHÔNG phải bộ đếm bão hoà
 *     (saturating counter) thường gặp trong sách khác — WT gặp N nhảy thẳng
 *     xuống SN, và WN gặp T nhảy thẳng lên ST. Đã mô phỏng CẢ HAI để đối chiếu.
 *   · Dãy T,T,T,N,T,T,N,N,T,T (bắt đầu "đoán không rẽ"): 1 bit SAI 5/10,
 *     2 bit Stallings SAI 7/10, 2 bit bão hoà SAI 6/10. Bắt đầu từ trạng thái
 *     "đoán có rẽ": 4/10 · 5/10 · 4/10. ⇒ TRÊN DÃY THẤT THƯỜNG NÀY 2 BIT THUA.
 *     Bài nói thẳng điều đó thay vì chép câu "2 bit luôn tốt hơn".
 *   · Dãy xen kẽ T,N,T,N,…: 1 bit SAI 10/10 (100%), 2 bit SAI 5/10.
 *   · Vòng lặp lồng (trong 10 vòng, ngoài 100 lần = 1000 lần rẽ nhánh):
 *     1 bit SAI 200 (đúng 80,00%) — đúng 2 lần sai mỗi vòng ngoài;
 *     2 bit SAI 102 (đúng 89,80%) — 1,02 lần sai mỗi vòng ngoài.
 *     inner=4 → 50,00% so với 74,50%; inner=100 → 98,00% so với 98,98%.
 *   · CPI = 1 + 0,20 × (1 − acc) × (k − 1): k=6 → 1,100/1,050/1,010;
 *     k=14 → 1,260/1,130/1,026; k=20 → 1,380/1,190/1,038 (acc 90/95/99%).
 *     Không dự đoán gì (acc=0): 2,00 · 3,60 · 4,80.
 *
 * ⚠️ PHÉP ĐO THẬT trên máy viết bài (Apple M1 Max, Apple clang, cc -O2):
 *   · Lọc mảng 32768 số 0..255 với điều kiện >= 128, lặp 5000 lượt:
 *     mảng CHƯA sắp xếp 0,516 s — mảng ĐÃ sắp xếp 0,053 s ⇒ chênh 9,7–10,1 lần.
 *     Quy ra: 3,149 ns/phần tử so với 0,323 ns ⇒ 2,826 ns phụ trội mỗi phần tử;
 *     dữ liệu ngẫu nhiên nên ~50% lần đoán sai ⇒ ~5,65 ns mỗi lần đoán sai
 *     ≈ 17–20 chu kỳ ở 3,0–3,5 GHz. KHỚP đúng hàng k = 20 của bảng CPI.
 *   · Lần đo ĐẦU cho tỉ số 1,00× — trình biên dịch đã đổi nhánh thành lệnh chọn
 *     có điều kiện (csel/cmov) nên KHÔNG CÒN nhánh nào để đoán sai. Phải chèn
 *     asm volatile chặn if-conversion mới đo được. Chuyện này ghi thẳng vào bài
 *     (slide 29) thay vì giấu đi.
 *
 * Chỗ slide gốc SAI / THIẾU — nêu rõ, không im lặng chép, không tự sửa slide:
 *   · slide 29 liệt kê 5 cách xử lý rẽ nhánh, trong đó có "Delayed branch",
 *     nhưng deck KHÔNG có slide nào dành riêng cho trì hoãn rẽ nhánh. Bài bù
 *     phần đó ở slide 34 và 37, và nói rõ là bù.
 *   · slide 43 (Table 16.2b) ghi thanh ghi General ở chế độ 64 bit là
 *     "16 × 32 bit" — SAI, phải là 16 × 64 bit (RAX…R15). RFLAGS/RIP cùng bảng
 *     đã ghi đúng 64. Đây là lỗi in của chính bảng gốc.
 *   · slide 40–42 (Figure 16.22–16.24: reservation station, issue/dispatch/
 *     finish/complete) là nội dung SUPERSCALAR, đặt trong chương này như phần
 *     "nâng cấp tổ chức pipeline"; Chương 14 trên web (cea18) mới khai triển.
 *   · Bản trích chữ slide 48 và 55 vỡ dòng giữa câu (một ô bảng thành nhiều
 *     dòng) — đã ghép lại theo ảnh.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea16';

export default {
  title: '12.0b — Slide by slide: Dealing with branches, branch prediction and real processor organisation (slides 29–56)|||12.0b — Slide bài giảng: Xử lý rẽ nhánh, dự đoán rẽ nhánh & tổ chức bộ xử lý thực tế (slide 29–56)',
  slug: 'cea201-12-0b-slides-re-nhanh-du-doan-to-chuc-cpu',
  type: 'DOCUMENT',
  description: 'Nửa sau Chương 12 (Ch.16 bản 11e) của CEA201, 28 slide. Bắt đầu từ HIỂM HOẠ ĐIỀU KHIỂN — thứ đắt nhất trong một pipeline — rồi đi hết năm cách đối phó: nhiều luồng, tiền nạp đích rẽ nhánh, bộ đệm vòng, DỰ ĐOÁN RẼ NHÁNH (tĩnh và động, máy trạng thái 2 bit, bảng lịch sử rẽ nhánh) và trì hoãn rẽ nhánh. Máy trạng thái 2 bit được chạy tay đủ 4 trạng thái, mô phỏng bằng python3 trên nhiều dãy kết quả và so trực tiếp với bộ dự đoán 1 bit; chi phí đoán sai quy thành CPI cho pipeline 6/14/20 tầng; kèm một phép đo thật trên máy cho thấy vì sao lọc mảng ĐÃ SẮP XẾP nhanh gấp 10 lần mảng chưa sắp xếp. Nửa cuối là tổ chức bộ xử lý THẬT: pipeline 5 tầng của Intel 80486, trạm đặt chỗ, tập thanh ghi x86 (EFLAGS, CR0–CR4, MMX) với bảng vector ngắt, và bộ xử lý ARM (7 chế độ, thanh ghi ngân hàng, CPSR/SPSR, bảng vector ngoại lệ).',
  content: [
    walkHead(D, 29, 56),
    walk(D, [

      [29, 'Control Hazard — also known as a branch hazard',
        `<p class="y-chinh">🎯 The third and <strong>most expensive</strong> hazard. The slide defines it in one line: a control hazard <strong>occurs when the pipeline makes the wrong decision on a branch prediction</strong>, and so <strong>brings instructions into the pipeline that must subsequently be discarded</strong>.</p>
<ul>
<li><strong>Why it is worse than the other two.</strong> A resource hazard (slide 26) costs <em>one</em> bubble; a data hazard (slides 27–28) costs one to three. A control hazard throws away <em>everything already in flight</em> — the deeper the pipeline, the more you burn. Depth is the thing that makes pipelining fast, and it is the same thing that makes a misprediction ruinous.</li>
<li><strong>The root cause is a timing gap.</strong> The branch condition is only known at the <strong>EI</strong> stage, but the address of the next instruction is needed at <strong>FI</strong> — five stages earlier in the six-stage pipeline of slide 22. The processor must guess for five cycles. Everything in the rest of this section is about making the guess cheap or making it right.</li>
<li><strong>The slide's five remedies, in the order it lists them:</strong> <em>Multiple streams</em> (slide 30) · <em>Prefetch branch target</em> (31) · <em>Loop buffer</em> (32–33) · <em>Branch prediction</em> (34–37) · <em>Delayed branch</em>. Note that the deck gives no dedicated slide to delayed branch — this walkthrough fills that gap on slides 34 and 37 and says so.</li>
<li><strong>Cost in cycles, written out.</strong> If a misprediction is detected at stage <em>k</em> of a <em>k</em>-stage pipeline, the <em>k − 1</em> instructions behind it are wrong-path and must be flushed. So the penalty is <strong>k − 1 cycles</strong>, and it scales with depth.</li>
</ul>
<table>
<tr><th>Pipeline depth k</th><th>Misprediction penalty</th><th>CPI at 90% accuracy</th><th>at 95%</th><th>at 99%</th><th>with no prediction at all</th></tr>
<tr><td>6 stages (Fig 16.12)</td><td>5 cycles</td><td>1.100</td><td>1.050</td><td>1.010</td><td>2.00</td></tr>
<tr><td>14 stages</td><td>13 cycles</td><td>1.260</td><td>1.130</td><td>1.026</td><td>3.60</td></tr>
<tr><td>20 stages</td><td>19 cycles</td><td>1.380</td><td>1.190</td><td>1.038</td><td>4.80</td></tr>
</table>
<p class="dap-an">✅ Formula and answer: <strong>CPI = 1 + f<sub>branch</sub> × (1 − accuracy) × (k − 1)</strong>, with f<sub>branch</sub> = 0.20 (one instruction in five is a conditional branch). Computed by program, not by hand. Read the table as a <em>demand</em>, not a description: on a 20-stage machine, 90% accuracy still throws away <strong>38% of your performance</strong>, and 95% throws away 19%. That is why real processors spend enormous silicon budgets reaching <strong>99%+</strong>. This is the exact CPI equation from Chapter 2 — branch misprediction is just another term added to the ideal CPI of 1.</p>
<p class="nhan">📐 Measured on the machine this lesson was written on (Apple M1 Max, <code>cc -O2</code>): filtering 32768 random bytes with <code>if (v[i] &gt;= 128) s += v[i];</code>, 5000 repetitions. <strong>Unsorted array: 0.516 s. The same array sorted first: 0.053 s.</strong> A <strong>9.7–10.1× difference</strong> for identical work and an identical answer. Per element that is 3.149 ns versus 0.323 ns; the 2.826 ns of extra time, spread over roughly 50% mispredicted branches, works out at <strong>≈ 5.65 ns ≈ 17–20 cycles per misprediction</strong> — which lands exactly on the k = 20 row of the table above.</p>
<p class="pitfall">⚠️ Honest warning about that measurement, because the first attempt returned <strong>1.00×</strong> — no difference at all. The compiler had turned the <code>if</code> into a conditional-select instruction (<code>csel</code>/<code>cmov</code>), so there was no branch left to mispredict. Only after inserting an <code>asm volatile</code> barrier to block if-conversion did the real 10× appear. Lesson: <em>if-conversion is itself one of the answers to control hazards</em> — the cheapest branch is the one the compiler deletes.</p>`,
        `<p class="y-chinh">🎯 Hiểm hoạ thứ ba, và là loại <strong>ĐẮT NHẤT</strong>. Slide định nghĩa gọn một dòng: hiểm hoạ điều khiển <strong>xảy ra khi pipeline quyết định SAI ở một dự đoán rẽ nhánh</strong>, do đó <strong>kéo vào pipeline những lệnh mà sau đó phải VỨT BỎ</strong>.</p>
<ul>
<li><strong>Vì sao nó tệ hơn hai loại kia.</strong> Hiểm hoạ tài nguyên (slide 26) tốn <em>MỘT</em> bong bóng; hiểm hoạ dữ liệu (slide 27–28) tốn một tới ba. Hiểm hoạ điều khiển vứt bỏ <em>TẤT CẢ những gì đang bay trong ống</em> — ống càng sâu càng cháy nhiều. Độ sâu chính là thứ làm pipeline nhanh, và cũng chính nó làm một lần đoán sai thành thảm hoạ.</li>
<li><strong>Gốc rễ là một KHOẢNG LỆCH THỜI GIAN.</strong> Điều kiện rẽ nhánh chỉ biết ở tầng <strong>EI</strong>, nhưng địa chỉ lệnh kế tiếp lại cần ngay ở tầng <strong>FI</strong> — sớm hơn năm tầng trong ống sáu tầng của slide 22. Bộ xử lý buộc phải ĐOÁN suốt năm chu kỳ đó. Toàn bộ phần còn lại của mục này chỉ nhằm làm cho cú đoán ấy rẻ đi hoặc đúng lên.</li>
<li><strong>Năm cách chữa mà slide liệt kê, đúng thứ tự:</strong> <em>Nhiều luồng</em> (slide 30) · <em>Tiền nạp đích rẽ nhánh</em> (31) · <em>Bộ đệm vòng</em> (32–33) · <em>Dự đoán rẽ nhánh</em> (34–37) · <em>Trì hoãn rẽ nhánh</em>. Để ý: deck KHÔNG có slide riêng nào cho trì hoãn rẽ nhánh — bài này bù phần đó ở slide 34 và 37, và nói rõ là bù.</li>
<li><strong>Chi phí quy ra chu kỳ, viết thẳng.</strong> Nếu phát hiện đoán sai ở tầng thứ <em>k</em> của ống <em>k</em> tầng thì <em>k − 1</em> lệnh đứng sau nó đều đi nhầm đường và phải xả. Vậy hình phạt là <strong>k − 1 chu kỳ</strong>, và nó tăng theo độ sâu.</li>
</ul>
<table>
<tr><th>Độ sâu ống k</th><th>Phạt mỗi lần đoán sai</th><th>CPI khi đúng 90%</th><th>khi 95%</th><th>khi 99%</th><th>không dự đoán gì</th></tr>
<tr><td>6 tầng (Fig 16.12)</td><td>5 chu kỳ</td><td>1,100</td><td>1,050</td><td>1,010</td><td>2,00</td></tr>
<tr><td>14 tầng</td><td>13 chu kỳ</td><td>1,260</td><td>1,130</td><td>1,026</td><td>3,60</td></tr>
<tr><td>20 tầng</td><td>19 chu kỳ</td><td>1,380</td><td>1,190</td><td>1,038</td><td>4,80</td></tr>
</table>
<p class="dap-an">✅ Công thức và đáp án: <strong>CPI = 1 + f<sub>rẽ nhánh</sub> × (1 − độ chính xác) × (k − 1)</strong>, với f<sub>rẽ nhánh</sub> = 0,20 (cứ năm lệnh có một lệnh rẽ nhánh có điều kiện). Tính bằng chương trình, không đếm tay. Hãy đọc bảng này như một <em>YÊU SÁCH</em> chứ không phải một mô tả: trên máy 20 tầng, đúng 90% vẫn vứt đi <strong>38% hiệu năng</strong>, đúng 95% vứt 19%. Đó là lý do vi xử lý thật đổ hàng núi transistor để đạt <strong>99% trở lên</strong>. Đây đúng là phương trình CPI của Chương 2 — đoán sai rẽ nhánh chỉ là thêm một số hạng vào CPI lý tưởng bằng 1.</p>
<p class="nhan">📐 Đo thật trên chính máy viết bài (Apple M1 Max, <code>cc -O2</code>): lọc 32768 byte ngẫu nhiên bằng <code>if (v[i] &gt;= 128) s += v[i];</code>, lặp 5000 lượt. <strong>Mảng chưa sắp xếp: 0,516 s. Vẫn mảng đó nhưng sắp xếp trước: 0,053 s.</strong> Chênh <strong>9,7–10,1 LẦN</strong> cho cùng một khối lượng việc và cùng một đáp số. Quy ra mỗi phần tử là 3,149 ns so với 0,323 ns; 2,826 ns phụ trội ấy trải trên khoảng 50% số lần đoán sai, cho ra <strong>≈ 5,65 ns ≈ 17–20 chu kỳ mỗi lần đoán sai</strong> — rơi đúng vào hàng k = 20 của bảng trên.</p>
<p class="pitfall">⚠️ Cảnh báo thành thật về phép đo đó, vì lần thử ĐẦU TIÊN trả về <strong>1,00×</strong> — không chênh gì cả. Trình biên dịch đã biến cái <code>if</code> thành lệnh chọn có điều kiện (<code>csel</code>/<code>cmov</code>), tức KHÔNG CÒN nhánh nào để mà đoán sai. Phải chèn một rào <code>asm volatile</code> chặn if-conversion thì cái 10× thật mới hiện ra. Bài học: <em>if-conversion tự nó đã là một cách chữa hiểm hoạ điều khiển</em> — cái nhánh rẻ nhất là cái nhánh bị trình biên dịch xoá mất.</p>`],

      [30, 'Multiple Streams — the brute-force answer',
        `<p class="y-chinh">🎯 The slide's own words: a simple pipeline <strong>suffers a penalty for a branch instruction because it must choose one of two instructions to fetch next and may make the wrong choice</strong>. The brute-force answer is to <strong>replicate the initial portions of the pipeline and allow the pipeline to fetch both instructions, making use of two streams</strong>.</p>
<ul>
<li><strong>Refuse to guess — do both.</strong> Instead of predicting, build two front-ends: one follows the fall-through path, one follows the branch target. When the condition resolves at EI, keep the correct stream and discard the other. Accuracy becomes 100% by construction, which is exactly why it is called brute force: you buy correctness with hardware instead of cleverness.</li>
<li><strong>The slide lists two drawbacks, and both are about contention.</strong> (1) <em>With multiple pipelines there are contention delays for access to the registers and to memory</em> — two streams fetching at once means two demands on the instruction cache and the register file every cycle. (2) <em>Additional branch instructions may enter the pipeline before the original branch decision is resolved</em> — and each of those needs two streams of its own.</li>
<li><strong>Do the arithmetic on drawback 2, it is the killer.</strong> One branch needs 2 streams. A second branch arriving before the first resolves needs 2 × 2 = 4. A third needs 8. With branches about every fifth instruction and a five-cycle window to resolve, you are already in the territory of <strong>2<sup>n</sup></strong> hardware. It does not scale, and that single fact is why prediction won.</li>
<li><strong>It was really built.</strong> The IBM 370/168 and the IBM 3033 used this approach. Read it as history that explains a design pressure, not as something in your phone.</li>
</ul>
<table>
<tr><th></th><th>Multiple streams</th><th>Branch prediction (slide 34)</th></tr>
<tr><td>How it decides</td><td>Does not decide — executes both</td><td>Guesses, then repairs if wrong</td></tr>
<tr><td>Hardware cost</td><td>Duplicate front-end, 2<sup>n</sup> for n nested branches</td><td>A few kB of table</td></tr>
<tr><td>Wasted work</td><td>Always ~50% (one stream is always thrown away)</td><td>Only on a misprediction (~1–10%)</td></tr>
<tr><td>Used today</td><td>No, in this form</td><td>Yes, universally</td></tr>
</table>
<p class="meo">💡 Remember it as <strong>"hedging your bet"</strong>: you place money on both horses so you cannot lose — but you also cannot win much, because half of every stake is burnt. Prediction is betting on one horse and getting very good at picking.</p>`,
        `<p class="y-chinh">🎯 Nguyên văn slide: một pipeline đơn giản <strong>chịu hình phạt ở lệnh rẽ nhánh vì nó phải CHỌN một trong hai lệnh để nạp tiếp và có thể chọn SAI</strong>. Cách chữa thô bạo là <strong>nhân đôi phần đầu của pipeline và cho nó nạp CẢ HAI lệnh, dùng hai luồng</strong>.</p>
<ul>
<li><strong>Không thèm đoán — làm cả hai.</strong> Thay vì dự đoán, dựng hai đầu vào: một đi theo đường rơi xuống, một đi theo đích rẽ nhánh. Khi điều kiện ngã ngũ ở EI thì giữ luồng đúng, vứt luồng kia. Độ chính xác thành 100% do cấu tạo, và đó đúng là lý do nó bị gọi là THÔ BẠO: bạn mua sự đúng đắn bằng phần cứng thay vì bằng sự khôn ngoan.</li>
<li><strong>Slide nêu hai nhược điểm, cả hai đều là TRANH CHẤP.</strong> (1) <em>Với nhiều pipeline sẽ có độ trễ do tranh chấp truy cập thanh ghi và bộ nhớ</em> — hai luồng cùng nạp nghĩa là hai đòi hỏi lên cache lệnh và tập thanh ghi mỗi chu kỳ. (2) <em>Các lệnh rẽ nhánh KHÁC có thể lọt vào pipeline trước khi quyết định của lệnh rẽ nhánh đầu tiên được giải quyết</em> — và mỗi lệnh đó lại cần hai luồng của riêng nó.</li>
<li><strong>Làm phép tính cho nhược điểm 2, đây mới là đòn chí mạng.</strong> Một lệnh rẽ nhánh cần 2 luồng. Lệnh thứ hai đến trước khi lệnh đầu ngã ngũ cần 2 × 2 = 4. Lệnh thứ ba cần 8. Với mật độ rẽ nhánh khoảng một phần năm số lệnh và cửa sổ năm chu kỳ để giải quyết, bạn đã ở vùng phần cứng <strong>2<sup>n</sup></strong>. Nó không mở rộng được, và đúng một sự thật đó khiến dự đoán thắng.</li>
<li><strong>Nó từng được dựng thật.</strong> IBM 370/168 và IBM 3033 dùng cách này. Hãy đọc như lịch sử giải thích một áp lực thiết kế, chứ không phải thứ nằm trong điện thoại bạn.</li>
</ul>
<table>
<tr><th></th><th>Nhiều luồng</th><th>Dự đoán rẽ nhánh (slide 34)</th></tr>
<tr><td>Cách quyết định</td><td>Không quyết định — chạy cả hai</td><td>Đoán, sai thì sửa</td></tr>
<tr><td>Giá phần cứng</td><td>Nhân đôi đầu ống, 2<sup>n</sup> với n nhánh lồng</td><td>Vài kB bảng</td></tr>
<tr><td>Công phí phạm</td><td>LUÔN ~50% (một luồng luôn bị vứt)</td><td>Chỉ khi đoán sai (~1–10%)</td></tr>
<tr><td>Còn dùng nay</td><td>Không, ở dạng này</td><td>Có, khắp nơi</td></tr>
</table>
<p class="meo">💡 Nhớ nó là <strong>"đặt cược cả hai cửa"</strong>: bạn đặt tiền lên cả hai con ngựa nên không thể thua — nhưng cũng không thể ăn nhiều, vì một nửa mỗi lần cược đều cháy. Dự đoán là đặt một cửa rồi tập cho giỏi nghề chọn.</p>`],

      [31, 'Prefetch Branch Target',
        `<p class="y-chinh">🎯 A cheaper cousin of multiple streams. The slide: <strong>when a conditional branch is recognized, the target of the branch is prefetched, in addition to the instruction following the branch</strong>. The <strong>target is then saved until the branch instruction is executed</strong>; <strong>if the branch is taken, the target has already been prefetched</strong>. <strong>The IBM 360/91 uses this approach.</strong></p>
<ul>
<li><strong>Duplicate the fetch, not the pipeline.</strong> Multiple streams replicates whole front-end stages; this replicates only the <em>fetch</em> and a small holding buffer. You still execute one stream — you just have the other stream's first instruction(s) sitting ready in case you guessed wrong. Much less silicon, most of the benefit on the common case.</li>
<li><strong>What it actually saves.</strong> On a taken branch, the expensive part is the memory/cache round trip for the target — that is the tens of cycles, not the pipeline flush itself. Having the target already in a buffer removes exactly that part. The flush still happens; the refill is instant.</li>
<li><strong>Read "recognized" carefully.</strong> The target can only be prefetched once the instruction has been <em>decoded</em> far enough to know it is a branch and to compute its target address. For PC-relative branches (Ch.14 addressing modes) the target is a simple add and is known early; for register-indirect branches it is not, and prefetch cannot help.</li>
<li><strong>The ancestor of today's BTB.</strong> Modern processors carry a <strong>Branch Target Buffer</strong> which caches branch targets so the fetcher can redirect before decode. Same instinct as the 360/91, one generation later; slide 37's branch history table adds the <em>target address</em> column for exactly this reason.</li>
</ul>
<table>
<tr><th>Case</th><th>Without prefetch</th><th>With prefetch of target</th></tr>
<tr><td>Branch not taken</td><td>Fall-through already fetched — no cost</td><td>Same, and the buffered target is discarded</td></tr>
<tr><td>Branch taken</td><td>Flush + full fetch of target from cache/memory</td><td>Flush only; target is already in the buffer</td></tr>
</table>
<p class="pitfall">⚠️ Exam trap: prefetching the target <strong>does not make the prediction correct</strong>, and it does not avoid the flush. It only shortens the recovery. A question that says "prefetch branch target eliminates the branch penalty" is wrong — it <em>reduces</em> it.</p>
<p class="meo">💡 Analogy: you do not know which of two rooms the meeting is in, so you walk to one and <em>send someone ahead</em> to unlock the other. If you guessed wrong you still have to walk — but the door is already open.</p>`,
        `<p class="y-chinh">🎯 Một người em rẻ tiền hơn của nhiều luồng. Slide ghi: <strong>khi nhận ra một lệnh rẽ nhánh có điều kiện, ĐÍCH của nhánh được tiền nạp, BÊN CẠNH lệnh nằm ngay sau lệnh rẽ nhánh</strong>. <strong>Đích đó được cất giữ cho tới khi lệnh rẽ nhánh được thực thi</strong>; <strong>nếu nhánh thực sự rẽ thì đích đã được nạp sẵn rồi</strong>. <strong>IBM 360/91 dùng cách này.</strong></p>
<ul>
<li><strong>Nhân đôi phép NẠP, không nhân đôi cả ống.</strong> Nhiều luồng nhân cả loạt tầng đầu; cách này chỉ nhân mỗi khâu <em>NẠP</em> cộng một bộ đệm giữ nhỏ. Bạn vẫn chỉ thực thi một luồng — chỉ là lệnh đầu tiên của luồng kia đã nằm sẵn phòng khi đoán trượt. Ít silicon hơn nhiều, mà ăn được gần hết phần lợi ở ca thường gặp.</li>
<li><strong>Nó tiết kiệm CÁI GÌ.</strong> Khi nhánh thực sự rẽ, phần đắt là chuyến đi về bộ nhớ/cache để lấy đích — đó mới là hàng chục chu kỳ, chứ không phải bản thân việc xả ống. Có sẵn đích trong bộ đệm thì bỏ đúng phần đó. Xả ống vẫn xảy ra; nạp lại thì tức thì.</li>
<li><strong>Đọc kỹ chữ "nhận ra".</strong> Chỉ tiền nạp được đích khi lệnh đã <em>GIẢI MÃ</em> đủ xa để biết nó là lệnh rẽ nhánh và tính được địa chỉ đích. Với nhánh tương đối theo PC (chế độ địa chỉ Ch.14) thì đích chỉ là một phép cộng, biết rất sớm; với nhánh gián tiếp qua thanh ghi thì không, và tiền nạp bó tay.</li>
<li><strong>Tổ tiên của BTB ngày nay.</strong> Vi xử lý hiện đại mang một <strong>Branch Target Buffer</strong> đệm sẵn địa chỉ đích để khâu nạp chuyển hướng được TRƯỚC khi giải mã. Cùng bản năng với 360/91, chậm hơn một thế hệ; bảng lịch sử rẽ nhánh ở slide 37 có thêm cột <em>địa chỉ đích</em> chính vì lý do này.</li>
</ul>
<table>
<tr><th>Tình huống</th><th>Không tiền nạp</th><th>Có tiền nạp đích</th></tr>
<tr><td>Nhánh KHÔNG rẽ</td><td>Đường rơi xuống đã nạp sẵn — không tốn gì</td><td>Như trên, và bỏ cái đích đã đệm</td></tr>
<tr><td>Nhánh CÓ rẽ</td><td>Xả ống + nạp đầy đủ đích từ cache/bộ nhớ</td><td>Chỉ xả ống; đích đã nằm trong đệm</td></tr>
</table>
<p class="pitfall">⚠️ Bẫy đề thi: tiền nạp đích <strong>KHÔNG làm cho dự đoán trở nên đúng</strong>, và cũng không tránh được việc xả ống. Nó chỉ RÚT NGẮN quá trình hồi phục. Câu nào bảo "tiền nạp đích rẽ nhánh triệt tiêu hình phạt rẽ nhánh" là SAI — nó chỉ <em>GIẢM</em> hình phạt.</p>
<p class="meo">💡 Phép ví: bạn không biết cuộc họp ở phòng nào trong hai phòng, nên bạn đi tới một phòng và <em>cho người chạy trước mở khoá</em> phòng kia. Đoán trượt thì vẫn phải đi bộ — nhưng cửa đã mở sẵn.</p>`],

      [32, 'Loop Buffer',
        `<p class="y-chinh">🎯 The slide defines it as a <strong>small, very-high-speed memory maintained by the instruction fetch stage of the pipeline and containing the n most recently fetched instructions, in sequence</strong>. It is the answer aimed squarely at the one branch that dominates every real program: <strong>the backward branch of a loop</strong>.</p>
<ul>
<li><strong>The slide's three benefits, in its own order.</strong> (1) <em>Instructions fetched in sequence will be available without the usual memory access time.</em> (2) <em>If a branch occurs to a target just a few locations ahead of the address of the branch instruction, the target will already be in the buffer.</em> (3) <em>This strategy is particularly well suited to dealing with loops.</em></li>
<li><strong>Benefit 2 is the sneaky one.</strong> Notice it covers <em>forward</em> short branches too — the classic <code>if (x) { ... }</code> skipping a handful of instructions. Because the buffer holds a contiguous window, a short jump in either direction lands inside it.</li>
<li><strong>Why loops are the jackpot.</strong> A loop whose entire body fits in the buffer is fetched from memory <em>once</em> and then served from the buffer for every remaining iteration. The backward branch, which would otherwise cause a flush and a refetch every single iteration, costs nothing. This is temporal locality (Ch.4) applied to instructions, with dedicated hardware.</li>
<li><strong>The slide compares it to a cache, then lists the differences.</strong> It is <em>similar in principle to a cache dedicated to instructions</em>, but: <em>the loop buffer only retains instructions in sequence</em>, and it <em>is much smaller in size and hence lower in cost</em>. "In sequence" is the key word — no tags per line, no associativity, no replacement policy. It is a sliding window, not an index.</li>
</ul>
<table>
<tr><th></th><th>Loop buffer</th><th>Instruction cache (Ch.5)</th></tr>
<tr><td>What it holds</td><td>The n most recent instructions, <strong>in sequence</strong></td><td>Any lines, scattered, by mapping function</td></tr>
<tr><td>Structure</td><td>One contiguous window</td><td>Sets, lines, tags, valid bits</td></tr>
<tr><td>Replacement policy</td><td>None — it just slides</td><td>LRU / FIFO / random</td></tr>
<tr><td>Size</td><td>Very small (256 bytes on slide 33)</td><td>Tens to hundreds of kB</td></tr>
<tr><td>Owned by</td><td>The instruction fetch <em>stage</em></td><td>The memory hierarchy</td></tr>
</table>
<p class="meo">💡 Mnemonic: the loop buffer is a <strong>tape loop</strong>, the cache is a <strong>filing cabinet</strong>. The tape only ever plays what comes next in order; the cabinet can produce any folder from anywhere.</p>
<p class="pitfall">⚠️ Trap: "the loop buffer is a small cache" is only half right, and exams like to punish the other half. It has <strong>no mapping function and no replacement algorithm</strong>, so none of the Ch.5 machinery (direct-mapped, set-associative, LRU) applies to it.</p>`,
        `<p class="y-chinh">🎯 Slide định nghĩa nó là một <strong>bộ nhớ NHỎ, TỐC ĐỘ RẤT CAO do tầng nạp lệnh của pipeline quản lý, chứa n lệnh vừa nạp gần nhất, THEO ĐÚNG TRÌNH TỰ</strong>. Đây là lời đáp nhắm thẳng vào cái lệnh rẽ nhánh áp đảo mọi chương trình thật: <strong>nhánh lùi của vòng lặp</strong>.</p>
<ul>
<li><strong>Ba cái lợi slide nêu, đúng thứ tự của nó.</strong> (1) <em>Các lệnh nạp theo trình tự sẽ có sẵn mà không phải chịu thời gian truy cập bộ nhớ thông thường.</em> (2) <em>Nếu có một nhánh nhảy tới đích chỉ cách địa chỉ lệnh rẽ nhánh vài ô, thì đích đó ĐÃ nằm sẵn trong bộ đệm.</em> (3) <em>Chiến lược này đặc biệt hợp để xử lý vòng lặp.</em></li>
<li><strong>Cái lợi số 2 là cái ranh mãnh.</strong> Để ý nó phủ luôn cả nhánh <em>TIẾN</em> ngắn — đúng kiểu <code>if (x) { ... }</code> nhảy qua dăm lệnh. Vì bộ đệm giữ một cửa sổ liền mạch nên cú nhảy ngắn theo chiều nào cũng rơi vào trong đó.</li>
<li><strong>Vì sao vòng lặp là mỏ vàng.</strong> Một vòng lặp có thân nằm lọt trong bộ đệm thì chỉ phải nạp từ bộ nhớ <em>MỘT LẦN</em>, rồi mọi vòng còn lại đều lấy từ bộ đệm. Cái nhánh lùi vốn sẽ gây xả ống và nạp lại ở MỖI vòng, nay không tốn gì. Đây là tính cục bộ thời gian (Ch.4) áp lên LỆNH, có phần cứng riêng phục vụ.</li>
<li><strong>Slide so nó với cache, rồi liệt kê khác biệt.</strong> Nó <em>giống cache dành riêng cho lệnh về nguyên lý</em>, nhưng: <em>bộ đệm vòng chỉ giữ lệnh theo TRÌNH TỰ</em>, và nó <em>nhỏ hơn nhiều nên rẻ hơn</em>. Chữ "theo trình tự" là chìa khoá — không nhãn cho từng dòng, không kết hợp tập, không chính sách thay thế. Nó là một CỬA SỔ TRƯỢT, không phải một bảng tra.</li>
</ul>
<table>
<tr><th></th><th>Bộ đệm vòng</th><th>Cache lệnh (Ch.5)</th></tr>
<tr><td>Chứa gì</td><td>n lệnh gần nhất, <strong>theo trình tự</strong></td><td>Dòng bất kỳ, rải rác, theo hàm ánh xạ</td></tr>
<tr><td>Cấu trúc</td><td>Một cửa sổ liền mạch</td><td>Tập, dòng, nhãn, bit hợp lệ</td></tr>
<tr><td>Chính sách thay thế</td><td>Không có — nó chỉ trượt</td><td>LRU / FIFO / ngẫu nhiên</td></tr>
<tr><td>Kích thước</td><td>Rất nhỏ (256 byte ở slide 33)</td><td>Hàng chục tới hàng trăm kB</td></tr>
<tr><td>Thuộc về</td><td><em>TẦNG</em> nạp lệnh</td><td>Phân cấp bộ nhớ</td></tr>
</table>
<p class="meo">💡 Mẹo nhớ: bộ đệm vòng là một <strong>CUỘN BĂNG</strong>, cache là một <strong>TỦ HỒ SƠ</strong>. Cuộn băng chỉ phát được cái kế tiếp theo thứ tự; tủ hồ sơ rút được cặp bất kỳ ở bất kỳ đâu.</p>
<p class="pitfall">⚠️ Bẫy: nói "bộ đệm vòng là một cache nhỏ" mới đúng một nửa, và đề thi thích phạt cái nửa còn lại. Nó <strong>KHÔNG có hàm ánh xạ và KHÔNG có thuật toán thay thế</strong>, nên toàn bộ bộ máy của Ch.5 (ánh xạ trực tiếp, kết hợp tập, LRU) không áp dụng được cho nó.</p>`],

      [33, 'Figure 16.17 — Loop Buffer',
        `<p class="y-chinh">🎯 The loop buffer drawn as hardware. A <strong>Branch address</strong> arrives on the left and splits in two: the <strong>low 8 bits</strong> go into a <strong>Loop Buffer (256 bytes)</strong> as an index, while the <strong>most significant address bits are compared to determine a hit</strong>. On a hit the box emits the <strong>instruction to be decoded</strong>; on a miss the fetch goes to memory as usual.</p>
<ul>
<li><strong>Read the "8" on the slanted line.</strong> That tick mark with a number is the standard notation for <em>bus width</em>: eight wires. Eight bits address 2<sup>8</sup> = <strong>256</strong> distinct bytes, which is exactly the buffer size printed in the box. The figure is internally consistent — and that consistency is the whole trick.</li>
<li><strong>Why split the address at all?</strong> Because the buffer is a contiguous 256-byte window of memory. The <em>low</em> 8 bits say <em>where inside the window</em>, and the <em>high</em> bits say <em>which window</em>. If the high bits match the window currently loaded, every low-bit offset is valid — one comparison validates the whole buffer instead of one comparison per line as a cache would need.</li>
<li><strong>That single comparator is the cost saving of slide 32.</strong> A 256-byte direct-mapped cache with 8-byte lines needs 32 tags and 32 comparators. This needs <strong>one</strong>. That is what "much smaller in size and hence lower in cost" means in gates.</li>
</ul>
<p class="nhan">📐 Worked example. Suppose instructions are 4 bytes and a loop body is 24 instructions long, starting at address 0x00401080.</p>
<ul>
<li>Body size = 24 × 4 = <strong>96 bytes</strong>, which is ≤ 256, so the whole loop <strong>fits</strong>.</li>
<li>The buffer covers the aligned 256-byte window whose high bits match: addresses 0x00401000–0x004010FF. The body 0x00401080–0x004010DF lies inside it.</li>
<li>First iteration: 24 fetches go to the I-cache/memory and fill the buffer. Iterations 2..N: 24 fetches per iteration, <strong>all hits</strong>, zero memory traffic, and the backward branch at the bottom also hits.</li>
</ul>
<p class="dap-an">✅ Answer: for a loop executed <strong>N = 1000</strong> times, memory is touched for <strong>24 fetches</strong> instead of 24 000 — a reduction of <strong>99.9%</strong>. And the backward branch, which on a 6-stage pipeline would cost 5 flushed cycles per iteration without any help, costs nothing here because its target is already inside the window. Total saved ≈ 999 × 5 = <strong>4 995 cycles</strong> of branch penalty on this one loop.</p>
<p class="pitfall">⚠️ The catch that exams love: the moment the loop body <em>exceeds</em> 256 bytes (65 instructions at 4 bytes each), the buffer thrashes — the window has to slide every iteration and you lose nearly all of the benefit at once. It is a cliff, not a slope. This is exactly why compilers care about loop body size, and why "unroll the loop" can make code slower.</p>
<p class="meo">💡 The number to carry into the exam: <strong>8 address bits ⇔ 256 bytes</strong>. If a question changes the buffer to 1 kB, the index becomes 10 bits. Same arithmetic as cache index bits in Ch.5.</p>`,
        `<p class="y-chinh">🎯 Bộ đệm vòng vẽ thành phần cứng. Một <strong>địa chỉ rẽ nhánh (Branch address)</strong> đi vào từ trái rồi tách làm hai: <strong>8 bit thấp</strong> đi vào <strong>Loop Buffer (256 byte)</strong> làm chỉ số, còn <strong>các bit địa chỉ có nghĩa lớn nhất được đem SO SÁNH để xác định trúng (hit)</strong>. Trúng thì hộp nhả ra <strong>lệnh để giải mã</strong>; trượt thì khâu nạp đi ra bộ nhớ như thường.</p>
<ul>
<li><strong>Đọc con số "8" trên vạch chéo.</strong> Vạch gạch kèm một con số là ký hiệu chuẩn cho <em>ĐỘ RỘNG BUS</em>: tám sợi dây. Tám bit đánh địa chỉ được 2<sup>8</sup> = <strong>256</strong> byte khác nhau, đúng bằng kích thước in trong hộp. Hình tự nhất quán với chính nó — và sự nhất quán đó chính là toàn bộ mẹo.</li>
<li><strong>Vì sao phải tách đôi địa chỉ?</strong> Vì bộ đệm là một cửa sổ 256 byte LIỀN MẠCH của bộ nhớ. Phần <em>THẤP</em> 8 bit nói <em>nằm ở đâu trong cửa sổ</em>, phần <em>CAO</em> nói <em>cửa sổ nào</em>. Nếu phần cao khớp với cửa sổ đang nạp thì MỌI độ lệch ở phần thấp đều hợp lệ — một phép so xác nhận cả bộ đệm, thay vì mỗi dòng một phép so như cache phải làm.</li>
<li><strong>Đúng một bộ so sánh ấy là khoản tiết kiệm mà slide 32 nói tới.</strong> Một cache ánh xạ trực tiếp 256 byte với dòng 8 byte cần 32 nhãn và 32 bộ so sánh. Cái này cần <strong>MỘT</strong>. Đó là ý nghĩa của câu "nhỏ hơn nhiều nên rẻ hơn" khi quy ra cổng logic.</li>
</ul>
<p class="nhan">📐 Ví dụ giải tay. Giả sử lệnh dài 4 byte và thân vòng lặp có 24 lệnh, bắt đầu ở địa chỉ 0x00401080.</p>
<ul>
<li>Cỡ thân = 24 × 4 = <strong>96 byte</strong>, nhỏ hơn hoặc bằng 256, nên cả vòng lặp <strong>LỌT</strong>.</li>
<li>Bộ đệm phủ cửa sổ 256 byte có phần bit cao khớp: địa chỉ 0x00401000–0x004010FF. Thân 0x00401080–0x004010DF nằm gọn bên trong.</li>
<li>Vòng thứ nhất: 24 lần nạp đi ra cache lệnh/bộ nhớ và đổ đầy bộ đệm. Vòng 2..N: mỗi vòng 24 lần nạp, <strong>TRÚNG HẾT</strong>, không chạm bộ nhớ, và cái nhánh lùi ở cuối thân cũng trúng.</li>
</ul>
<p class="dap-an">✅ Đáp án: với vòng lặp chạy <strong>N = 1000</strong> lần, bộ nhớ chỉ bị chạm <strong>24 lần nạp</strong> thay vì 24 000 — giảm <strong>99,9%</strong>. Và cái nhánh lùi vốn tốn 5 chu kỳ xả ống mỗi vòng trên pipeline 6 tầng nếu không có trợ giúp, ở đây tốn 0 vì đích của nó đã nằm trong cửa sổ. Tổng tiết kiệm ≈ 999 × 5 = <strong>4 995 chu kỳ</strong> hình phạt rẽ nhánh chỉ trên một vòng lặp này.</p>
<p class="pitfall">⚠️ Cái bẫy mà đề thi rất thích: ngay khi thân vòng lặp <em>VƯỢT</em> 256 byte (65 lệnh nếu mỗi lệnh 4 byte), bộ đệm giật liên tục — cửa sổ phải trượt mỗi vòng và bạn mất gần như toàn bộ phần lợi CÙNG MỘT LÚC. Đó là một VÁCH ĐÁ, không phải cái dốc. Chính vì thế trình biên dịch mới quan tâm tới cỡ thân vòng lặp, và cũng vì thế "trải phẳng vòng lặp" đôi khi làm mã CHẬM ĐI.</p>
<p class="meo">💡 Con số mang đi thi: <strong>8 bit địa chỉ ⇔ 256 byte</strong>. Đề đổi bộ đệm thành 1 kB thì chỉ số thành 10 bit. Cùng một phép tính với số bit chỉ số của cache ở Ch.5.</p>`],

      [34, 'Branch Prediction — static approaches versus dynamic approaches',
        `<p class="y-chinh">🎯 The slide lists five techniques and splits them into two families. <strong>Static:</strong> predict never taken · predict always taken · predict by opcode. <strong>Dynamic:</strong> taken/not taken switch · branch history table. The dividing line is printed on the slide itself: static approaches <strong>do not depend on the execution history up to the time of the conditional branch instruction</strong>; dynamic approaches <strong>depend on the execution history</strong>.</p>
<table>
<tr><th>Technique</th><th>Family</th><th>How it decides</th><th>Typical accuracy</th><th>Cost</th></tr>
<tr><td>Predict never taken</td><td>Static</td><td>Always assume fall-through</td><td>~40% (branches are taken more often than not)</td><td>Zero — it is the default fetch behaviour</td></tr>
<tr><td>Predict always taken</td><td>Static</td><td>Always assume the target</td><td>~60%</td><td>Needs the target early, so a target adder</td></tr>
<tr><td>Predict by opcode</td><td>Static</td><td>Some opcodes are usually taken, some are not</td><td>~75%</td><td>A few gates in decode</td></tr>
<tr><td>Taken/not taken switch</td><td>Dynamic</td><td>1 or 2 history bits per branch, in the processor</td><td>~80–90%</td><td>Bits attached to the instruction cache</td></tr>
<tr><td>Branch history table</td><td>Dynamic</td><td>A small cache of branch address · target · state</td><td>~90–98%</td><td>A real table plus lookup logic (slide 37)</td></tr>
</table>
<ul>
<li><strong>Why "predict always taken" beats "never taken".</strong> Loops. Every loop back-edge is taken on every iteration except the last, so across a whole program a clear majority of conditional branches are taken. A one-line static rule already gets you past 50% for free.</li>
<li><strong>"Predict by opcode" is the compiler's hint in hardware.</strong> Branch-on-negative at the bottom of a loop behaves differently from branch-on-error. The designer bakes per-opcode tendencies into the decoder. It is static because it never looks at what <em>this</em> branch did last time.</li>
<li><strong>The dynamic ones are what slides 35–37 are about.</strong> The taken/not taken switch is the state machine of Figure 16.19; the branch history table is Figure 16.20(b). Everything that follows in this chapter elaborates these two rows.</li>
<li><strong>Delayed branch — the fifth remedy from slide 29 that gets no slide of its own.</strong> The idea: the instruction <em>after</em> the branch (the "delay slot") is executed regardless of the outcome, so the slot is never wasted. The compiler fills it with useful work moved from before the branch. It was a hallmark of early RISC (MIPS, SPARC — see Ch.17/cea17) and is now <strong>obsolete</strong>: it only hides one cycle, which is nothing in a 14–20 stage pipeline, and it freezes a micro-architectural detail into the instruction set forever.</li>
</ul>
<p class="pitfall">⚠️ Exam trap on the word "static". Static does <strong>not</strong> mean "decided by the compiler" — it means "does not use runtime history". Predict-by-opcode is a hardware decision and is still static. Conversely, a compiler-supplied hint bit is also static even though software chose it.</p>
<p class="meo">💡 Sort them by <strong>what they look at</strong>: nothing (never/always taken) → the instruction itself (by opcode) → what this instruction did before (switch, history table). Accuracy rises in exactly that order, and so does cost.</p>`,
        `<p class="y-chinh">🎯 Slide liệt kê năm kỹ thuật rồi tách thành hai họ. <strong>TĨNH:</strong> đoán không bao giờ rẽ · đoán luôn luôn rẽ · đoán theo mã lệnh. <strong>ĐỘNG:</strong> công tắc rẽ/không rẽ · bảng lịch sử rẽ nhánh. Ranh giới in ngay trên slide: cách tĩnh <strong>KHÔNG phụ thuộc vào lịch sử thực thi tính tới thời điểm gặp lệnh rẽ nhánh có điều kiện</strong>; cách động thì <strong>PHỤ THUỘC vào lịch sử thực thi</strong>.</p>
<table>
<tr><th>Kỹ thuật</th><th>Họ</th><th>Quyết định kiểu gì</th><th>Độ chính xác điển hình</th><th>Giá</th></tr>
<tr><td>Đoán không bao giờ rẽ</td><td>Tĩnh</td><td>Luôn giả định rơi xuống lệnh kế</td><td>~40% (nhánh có rẽ nhiều hơn không rẽ)</td><td>Bằng 0 — đó là hành vi nạp mặc định</td></tr>
<tr><td>Đoán luôn luôn rẽ</td><td>Tĩnh</td><td>Luôn giả định đi tới đích</td><td>~60%</td><td>Cần biết đích sớm, nên cần bộ cộng địa chỉ đích</td></tr>
<tr><td>Đoán theo mã lệnh</td><td>Tĩnh</td><td>Có mã lệnh thường rẽ, có mã lệnh thường không</td><td>~75%</td><td>Vài cổng logic trong khâu giải mã</td></tr>
<tr><td>Công tắc rẽ/không rẽ</td><td>Động</td><td>1 hoặc 2 bit lịch sử cho mỗi nhánh, nằm trong CPU</td><td>~80–90%</td><td>Các bit gắn kèm cache lệnh</td></tr>
<tr><td>Bảng lịch sử rẽ nhánh</td><td>Động</td><td>Một cache nhỏ: địa chỉ nhánh · đích · trạng thái</td><td>~90–98%</td><td>Bảng thật cộng logic tra cứu (slide 37)</td></tr>
</table>
<ul>
<li><strong>Vì sao "luôn rẽ" thắng "không bao giờ rẽ".</strong> Vòng lặp. Mọi cạnh lùi của vòng lặp đều RẼ ở mọi vòng trừ vòng cuối, nên tính trên cả chương trình thì đa số rõ rệt các nhánh có điều kiện là có rẽ. Một quy tắc tĩnh một dòng đã đưa bạn vượt mốc 50% mà không tốn gì.</li>
<li><strong>"Đoán theo mã lệnh" là gợi ý của người thiết kế đúc vào phần cứng.</strong> Lệnh nhảy khi âm ở cuối vòng lặp hành xử khác hẳn lệnh nhảy khi có lỗi. Nhà thiết kế nướng khuynh hướng của từng mã lệnh vào bộ giải mã. Nó vẫn là TĨNH vì nó không bao giờ nhìn xem <em>chính lệnh này</em> lần trước đã làm gì.</li>
<li><strong>Hai cách ĐỘNG là nội dung của slide 35–37.</strong> Công tắc rẽ/không rẽ chính là máy trạng thái của Figure 16.19; bảng lịch sử rẽ nhánh là Figure 16.20(b). Mọi thứ còn lại của chương này chỉ khai triển hai hàng đó.</li>
<li><strong>Trì hoãn rẽ nhánh — cách chữa thứ năm của slide 29 mà deck KHÔNG dành slide nào.</strong> Ý tưởng: lệnh nằm <em>NGAY SAU</em> lệnh rẽ nhánh (gọi là "ô trì hoãn") được thực thi bất kể nhánh có rẽ hay không, nên ô đó không bao giờ bị phí. Trình biên dịch nhét vào đó một việc có ích dời từ trước lệnh rẽ nhánh xuống. Đây là dấu ấn của RISC thời đầu (MIPS, SPARC — xem Ch.17/cea17) và nay đã <strong>LỖI THỜI</strong>: nó chỉ giấu được MỘT chu kỳ, chẳng là gì với ống 14–20 tầng, lại còn đóng băng vĩnh viễn một chi tiết vi kiến trúc vào trong tập lệnh.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi ở chữ "tĩnh". Tĩnh <strong>KHÔNG</strong> có nghĩa là "do trình biên dịch quyết" — nó có nghĩa là "không dùng lịch sử lúc chạy". Đoán theo mã lệnh là quyết định của phần cứng mà vẫn TĨNH. Ngược lại, một bit gợi ý do trình biên dịch đặt cũng là tĩnh dù phần mềm chọn nó.</p>
<p class="meo">💡 Sắp chúng theo <strong>chúng NHÌN VÀO CÁI GÌ</strong>: không nhìn gì (không rẽ/luôn rẽ) → nhìn chính lệnh đó (theo mã lệnh) → nhìn xem chính lệnh đó lần trước làm gì (công tắc, bảng lịch sử). Độ chính xác tăng đúng theo thứ tự ấy, và giá cũng vậy.</p>`],

      [35, 'Figure 16.18 — Branch Prediction Flowchart',
        `<p class="y-chinh">🎯 The same predictor as slide 36, drawn as a flowchart instead of a state graph. Two columns run in parallel: the left column is the <strong>Predict taken</strong> half, the right column is the <strong>Predict not taken</strong> half. Each box reads the next conditional branch, makes its prediction, then asks <strong>"Branch taken?"</strong> — and the answer decides whether you stay in that column or cross to the other.</p>
<ul>
<li><strong>The crucial structural fact: each column has TWO levels.</strong> In the left (predict-taken) column, a first wrong answer ("Branch taken? No") does not send you to the other column — it drops you to a second "Predict taken" box. Only a <em>second</em> consecutive wrong answer crosses over. Same on the right.</li>
<li><strong>That is the whole point of two bits.</strong> One wrong guess is treated as noise; two in a row is treated as a change of behaviour. The flowchart makes the hysteresis visible without any state names, which is why the book draws it twice.</li>
<li><strong>Walk the left column once.</strong> Read branch → Predict taken → taken? <em>Yes</em> → loop back to the top of the same column (stay confidently taken). Read branch → Predict taken → taken? <em>No</em> → fall to the second Predict-taken box. Read branch → Predict taken → taken? <em>No</em> again → arrow crosses to the right column: from now on, predict not taken.</li>
<li><strong>And the recovery path.</strong> From the second box of the right column, a <em>Yes</em> ("branch taken") sends you back into the left column. The machine is symmetric; it forgives one surprise on each side.</li>
</ul>
<p class="nhan">📐 The sharpest demonstration of why the extra level matters, computed by simulation. Take the pathological alternating sequence <strong>T, N, T, N, T, N, T, N, T, N</strong>:</p>
<table>
<tr><th>Predictor</th><th>Mispredictions out of 10</th><th>Accuracy</th></tr>
<tr><td>1-bit (predict what happened last time)</td><td><strong>10</strong></td><td><strong>0%</strong></td></tr>
<tr><td>2-bit, started in "predict not taken"</td><td>5</td><td>50%</td></tr>
<tr><td>2-bit, started in "predict taken"</td><td>5</td><td>50%</td></tr>
</table>
<p class="dap-an">✅ Answer: the 1-bit predictor is <strong>wrong every single time</strong> — it is always one step behind, so on a perfectly alternating pattern it achieves 0%, worse than flipping a coin. The two-level machine of this flowchart never lets one surprise flip it, so it stays put half the time and scores 50%. Numbers produced by a <code>python3</code> simulation of both machines, not counted by hand.</p>
<p class="pitfall">⚠️ Do not read the two columns as "two different predictors". They are two <em>halves of one</em> predictor, and the arrows between them are what makes it work. A common exam mistake is answering "this figure shows predict-always-taken and predict-never-taken" — those are the <em>static</em> schemes of slide 34 and have no arrows at all.</p>`,
        `<p class="y-chinh">🎯 Vẫn là bộ dự đoán của slide 36, nhưng vẽ thành LƯU ĐỒ thay vì đồ thị trạng thái. Hai cột chạy song song: cột trái là nửa <strong>Đoán CÓ rẽ</strong>, cột phải là nửa <strong>Đoán KHÔNG rẽ</strong>. Mỗi hộp đọc lệnh rẽ nhánh có điều kiện kế tiếp, đưa ra dự đoán, rồi hỏi <strong>"Nhánh có rẽ không?"</strong> — và câu trả lời quyết định bạn ở lại cột đó hay nhảy sang cột kia.</p>
<ul>
<li><strong>Sự thật cấu trúc then chốt: mỗi cột có HAI TẦNG.</strong> Ở cột trái (đoán có rẽ), một câu trả lời sai đầu tiên ("Nhánh có rẽ? Không") KHÔNG đẩy bạn sang cột kia — nó thả bạn xuống hộp "Đoán có rẽ" thứ hai. Phải tới câu trả lời sai thứ <em>HAI LIÊN TIẾP</em> mới sang cột kia. Cột phải y hệt.</li>
<li><strong>Đó chính là toàn bộ ý nghĩa của hai bit.</strong> Một lần đoán trượt bị coi là nhiễu; hai lần liên tiếp mới bị coi là hành vi đã đổi. Lưu đồ làm cho tính TRỄ (hysteresis) ấy nhìn thấy được mà không cần đặt tên trạng thái nào — nên sách mới vẽ nó hai kiểu.</li>
<li><strong>Đi thử cột trái một lượt.</strong> Đọc nhánh → Đoán có rẽ → có rẽ? <em>CÓ</em> → quay vòng lên đầu chính cột đó (yên tâm giữ "có rẽ"). Đọc nhánh → Đoán có rẽ → có rẽ? <em>KHÔNG</em> → rơi xuống hộp "Đoán có rẽ" thứ hai. Đọc nhánh → Đoán có rẽ → có rẽ? <em>KHÔNG</em> lần nữa → mũi tên bắc sang cột phải: từ giờ đoán là KHÔNG rẽ.</li>
<li><strong>Và đường hồi phục.</strong> Từ hộp thứ hai của cột phải, một câu <em>CÓ</em> ("nhánh có rẽ") đưa bạn trở lại cột trái. Máy này đối xứng; mỗi bên đều tha thứ đúng một lần bất ngờ.</li>
</ul>
<p class="nhan">📐 Bằng chứng sắc nhất cho thấy vì sao cái tầng thứ hai lại quan trọng, tính bằng mô phỏng. Lấy dãy bệnh lý xen kẽ <strong>T, N, T, N, T, N, T, N, T, N</strong>:</p>
<table>
<tr><th>Bộ dự đoán</th><th>Số lần đoán SAI trên 10</th><th>Độ chính xác</th></tr>
<tr><td>1 bit (đoán y như lần trước)</td><td><strong>10</strong></td><td><strong>0%</strong></td></tr>
<tr><td>2 bit, bắt đầu ở "đoán không rẽ"</td><td>5</td><td>50%</td></tr>
<tr><td>2 bit, bắt đầu ở "đoán có rẽ"</td><td>5</td><td>50%</td></tr>
</table>
<p class="dap-an">✅ Đáp án: bộ 1 bit <strong>SAI TOÀN BỘ</strong> — nó luôn chậm một nhịp, nên trên mẫu xen kẽ hoàn hảo nó đạt 0%, tệ hơn cả tung đồng xu. Máy hai tầng của lưu đồ này không cho một lần bất ngờ lật được nó, nên nó đứng yên một nửa số lần và ghi được 50%. Số liệu do chương trình <code>python3</code> mô phỏng cả hai máy sinh ra, không đếm tay.</p>
<p class="pitfall">⚠️ Đừng đọc hai cột như "hai bộ dự đoán khác nhau". Chúng là hai <em>NỬA CỦA MỘT</em> bộ dự đoán, và chính các mũi tên nối giữa mới làm nó chạy được. Lỗi thi thường gặp là trả lời "hình này vẽ đoán-luôn-rẽ và đoán-không-bao-giờ-rẽ" — đó là hai cách <em>TĨNH</em> ở slide 34 và chúng không có mũi tên nào cả.</p>`],

      [36, 'Figure 16.19 — Branch Prediction State Diagram (the 2-bit predictor)',
        `<p class="y-chinh">🎯 <strong>The single most examined diagram of this chapter.</strong> Four circles: two on top labelled <strong>Predict Taken</strong>, two on the bottom labelled <strong>Predict Not Taken</strong>. Every arc is labelled with the <em>actual outcome</em> of the branch. Give the four states their standard names — top-left <strong>ST</strong> (strongly taken), top-right <strong>WT</strong> (weakly taken), bottom-left <strong>WN</strong> (weakly not taken), bottom-right <strong>SN</strong> (strongly not taken) — and read every arc off the slide:</p>
<table>
<tr><th>Current state</th><th>Prediction it makes</th><th>Actual = Taken → next state</th><th>Actual = Not taken → next state</th></tr>
<tr><td><strong>ST</strong> — top-left, strongly taken</td><td>Taken</td><td><strong>ST</strong> (self-loop, labelled "Taken")</td><td><strong>WT</strong> (arrow right, "Not Taken")</td></tr>
<tr><td><strong>WT</strong> — top-right, weakly taken</td><td>Taken</td><td><strong>ST</strong> (arrow left, "Taken")</td><td><strong>SN</strong> (arrow down, "Not Taken")</td></tr>
<tr><td><strong>WN</strong> — bottom-left, weakly not taken</td><td>Not taken</td><td><strong>ST</strong> (arrow up, "Taken")</td><td><strong>SN</strong> (arrow right, "Not Taken")</td></tr>
<tr><td><strong>SN</strong> — bottom-right, strongly not taken</td><td>Not taken</td><td><strong>WN</strong> (arrow left, "Taken")</td><td><strong>SN</strong> (self-loop, "Not Taken")</td></tr>
</table>
<ul>
<li><strong>Two wrong guesses to change your mind.</strong> From ST you need N twice (ST → WT → SN) before the prediction flips. From SN you need T twice (SN → WN → ST). That hysteresis is the entire value of the second bit.</li>
<li><strong>⚠️ This is NOT the saturating counter you may have seen elsewhere.</strong> In Stallings' machine, <strong>WT on "not taken" jumps straight to SN</strong> (skipping WN), and <strong>WN on "taken" jumps straight to ST</strong> (skipping WT). A textbook saturating 2-bit counter would step one level at a time. Both need two wrong guesses to flip, but they behave differently afterwards — and the simulation below shows the difference is real, not cosmetic.</li>
<li><strong>Where the two bits live.</strong> The slide does not say, but in practice they are attached to the instruction in the instruction cache, or held in the branch history table of slide 37. That is why the two bits are lost whenever the cache line is evicted — a real effect that makes cold code predict badly.</li>
</ul>
<p class="nhan">📐 <strong>Hand-run the exam sequence T, T, T, N, T, T, N, N, T, T</strong> through both predictors, both started cold in "predict not taken" (the usual exam convention). Every row below was produced by a <code>python3</code> simulation of the two machines, then printed:</p>
<table>
<tr><th>#</th><th>Actual</th><th>1-bit state</th><th>1-bit predicts</th><th>1-bit result</th><th>2-bit state</th><th>2-bit predicts</th><th>2-bit result</th></tr>
<tr><td>1</td><td>T</td><td>N</td><td>N</td><td>✗</td><td>SN</td><td>N</td><td>✗</td></tr>
<tr><td>2</td><td>T</td><td>T</td><td>T</td><td>✓</td><td>WN</td><td>N</td><td>✗</td></tr>
<tr><td>3</td><td>T</td><td>T</td><td>T</td><td>✓</td><td>ST</td><td>T</td><td>✓</td></tr>
<tr><td>4</td><td>N</td><td>T</td><td>T</td><td>✗</td><td>ST</td><td>T</td><td>✗</td></tr>
<tr><td>5</td><td>T</td><td>N</td><td>N</td><td>✗</td><td>WT</td><td>T</td><td>✓</td></tr>
<tr><td>6</td><td>T</td><td>T</td><td>T</td><td>✓</td><td>ST</td><td>T</td><td>✓</td></tr>
<tr><td>7</td><td>N</td><td>T</td><td>T</td><td>✗</td><td>ST</td><td>T</td><td>✗</td></tr>
<tr><td>8</td><td>N</td><td>N</td><td>N</td><td>✓</td><td>WT</td><td>T</td><td>✗</td></tr>
<tr><td>9</td><td>T</td><td>N</td><td>N</td><td>✗</td><td>SN</td><td>N</td><td>✗</td></tr>
<tr><td>10</td><td>T</td><td>T</td><td>T</td><td>✓</td><td>WN</td><td>N</td><td>✗</td></tr>
</table>
<p class="dap-an">✅ Answer, and it is <strong>not</strong> the answer most textbooks lead you to expect. On this sequence the <strong>1-bit predictor is wrong 5 times out of 10 (50%)</strong> and the <strong>2-bit predictor of Figure 16.19 is wrong 7 times out of 10 (70%)</strong>. The 2-bit machine <em>loses</em> here. Cross-checks, all from the same simulation: the textbook <em>saturating</em> 2-bit counter gets 6/10; starting both predictors warm in "predict taken" instead gives 4/10 for 1-bit, 5/10 for 2-bit (saturating: 4/10). So the conclusion holds under every starting condition tried. <strong>Two bits are not magic — they are a bet that behaviour is stable, and this deliberately erratic 10-branch sequence is exactly the case where that bet loses.</strong> Slide 37 shows the case it was built for, where it wins by a mile.</p>
<p class="pitfall">⚠️ If an exam asks you to trace this machine, the answer depends on <strong>the initial state</strong> — and many questions forget to give it. Always write down the assumption ("starting in strongly-not-taken") before the first row. And use the arcs <em>printed on Figure 16.19</em>, not the saturating counter from another book: on this very sequence the two differ by one misprediction.</p>`,
        `<p class="y-chinh">🎯 <strong>Sơ đồ bị hỏi thi nhiều nhất của cả chương.</strong> Bốn vòng tròn: hai cái trên ghi <strong>Predict Taken</strong> (đoán CÓ rẽ), hai cái dưới ghi <strong>Predict Not Taken</strong> (đoán KHÔNG rẽ). Mỗi cung được dán nhãn bằng <em>KẾT QUẢ THẬT</em> của lệnh rẽ nhánh. Đặt tên chuẩn cho bốn trạng thái — trên-trái <strong>ST</strong> (chắc chắn rẽ), trên-phải <strong>WT</strong> (yếu ớt rẽ), dưới-trái <strong>WN</strong> (yếu ớt không rẽ), dưới-phải <strong>SN</strong> (chắc chắn không rẽ) — rồi đọc từng cung khỏi slide:</p>
<table>
<tr><th>Trạng thái hiện tại</th><th>Dự đoán nó đưa ra</th><th>Thực tế = CÓ RẼ → trạng thái kế</th><th>Thực tế = KHÔNG RẼ → trạng thái kế</th></tr>
<tr><td><strong>ST</strong> — trên-trái, chắc chắn rẽ</td><td>Có rẽ</td><td><strong>ST</strong> (cung tự vòng, nhãn "Taken")</td><td><strong>WT</strong> (mũi tên sang phải, "Not Taken")</td></tr>
<tr><td><strong>WT</strong> — trên-phải, yếu ớt rẽ</td><td>Có rẽ</td><td><strong>ST</strong> (mũi tên sang trái, "Taken")</td><td><strong>SN</strong> (mũi tên xuống, "Not Taken")</td></tr>
<tr><td><strong>WN</strong> — dưới-trái, yếu ớt không rẽ</td><td>Không rẽ</td><td><strong>ST</strong> (mũi tên đi lên, "Taken")</td><td><strong>SN</strong> (mũi tên sang phải, "Not Taken")</td></tr>
<tr><td><strong>SN</strong> — dưới-phải, chắc chắn không rẽ</td><td>Không rẽ</td><td><strong>WN</strong> (mũi tên sang trái, "Taken")</td><td><strong>SN</strong> (cung tự vòng, "Not Taken")</td></tr>
</table>
<ul>
<li><strong>Phải đoán sai HAI lần mới đổi ý.</strong> Từ ST cần N hai lần (ST → WT → SN) thì dự đoán mới lật. Từ SN cần T hai lần (SN → WN → ST). Chính tính TRỄ đó là toàn bộ giá trị của cái bit thứ hai.</li>
<li><strong>⚠️ Đây KHÔNG phải bộ đếm bão hoà mà bạn có thể đã gặp ở chỗ khác.</strong> Trong máy của Stallings, <strong>WT gặp "không rẽ" NHẢY THẲNG xuống SN</strong> (bỏ qua WN), và <strong>WN gặp "có rẽ" NHẢY THẲNG lên ST</strong> (bỏ qua WT). Một bộ đếm bão hoà 2 bit trong sách giáo khoa sẽ đi từng nấc một. Cả hai đều cần hai lần đoán sai để lật, nhưng sau đó hành xử khác nhau — và mô phỏng dưới đây cho thấy khác biệt ấy là THẬT chứ không phải trang trí.</li>
<li><strong>Hai bit ấy nằm ở đâu.</strong> Slide không nói, nhưng trên thực tế chúng gắn kèm lệnh trong cache lệnh, hoặc nằm trong bảng lịch sử rẽ nhánh của slide 37. Đó là lý do hai bit này MẤT mỗi khi dòng cache bị đuổi — một hiệu ứng có thật khiến mã nguội đoán rất tệ.</li>
</ul>
<p class="nhan">📐 <strong>Chạy tay dãy đề thi T, T, T, N, T, T, N, N, T, T</strong> qua cả hai bộ dự đoán, cả hai cùng khởi động nguội ở "đoán không rẽ" (quy ước thường dùng trong đề). Mọi hàng dưới đây do chương trình <code>python3</code> mô phỏng hai máy sinh ra rồi in:</p>
<table>
<tr><th>#</th><th>Thực tế</th><th>Trạng thái 1 bit</th><th>1 bit đoán</th><th>Kết quả</th><th>Trạng thái 2 bit</th><th>2 bit đoán</th><th>Kết quả</th></tr>
<tr><td>1</td><td>T</td><td>N</td><td>N</td><td>✗</td><td>SN</td><td>N</td><td>✗</td></tr>
<tr><td>2</td><td>T</td><td>T</td><td>T</td><td>✓</td><td>WN</td><td>N</td><td>✗</td></tr>
<tr><td>3</td><td>T</td><td>T</td><td>T</td><td>✓</td><td>ST</td><td>T</td><td>✓</td></tr>
<tr><td>4</td><td>N</td><td>T</td><td>T</td><td>✗</td><td>ST</td><td>T</td><td>✗</td></tr>
<tr><td>5</td><td>T</td><td>N</td><td>N</td><td>✗</td><td>WT</td><td>T</td><td>✓</td></tr>
<tr><td>6</td><td>T</td><td>T</td><td>T</td><td>✓</td><td>ST</td><td>T</td><td>✓</td></tr>
<tr><td>7</td><td>N</td><td>T</td><td>T</td><td>✗</td><td>ST</td><td>T</td><td>✗</td></tr>
<tr><td>8</td><td>N</td><td>N</td><td>N</td><td>✓</td><td>WT</td><td>T</td><td>✗</td></tr>
<tr><td>9</td><td>T</td><td>N</td><td>N</td><td>✗</td><td>SN</td><td>N</td><td>✗</td></tr>
<tr><td>10</td><td>T</td><td>T</td><td>T</td><td>✓</td><td>WN</td><td>N</td><td>✗</td></tr>
</table>
<p class="dap-an">✅ Đáp án, và nó <strong>KHÔNG</strong> phải cái đáp án mà đa số sách dẫn bạn tới. Trên dãy này bộ <strong>1 bit sai 5/10 lần (50%)</strong> còn bộ <strong>2 bit của Figure 16.19 sai 7/10 lần (70%)</strong>. Máy 2 bit <em>THUA</em> ở đây. Các phép kiểm chéo, cùng từ một chương trình mô phỏng: bộ đếm <em>bão hoà</em> 2 bit trong sách giáo khoa được 6/10; nếu cho cả hai khởi động ẤM ở "đoán có rẽ" thì 1 bit được 4/10, 2 bit được 5/10 (bão hoà: 4/10). Vậy kết luận đứng vững với mọi điều kiện khởi đầu đã thử. <strong>Hai bit không phải phép màu — nó là một CANH BẠC đặt cược rằng hành vi ổn định, và cái dãy 10 lần rẽ nhánh cố tình thất thường này đúng là ca mà canh bạc ấy thua.</strong> Slide 37 sẽ cho thấy cái ca mà nó được sinh ra để phục vụ, và ở đó nó thắng rất xa.</p>
<p class="pitfall">⚠️ Nếu đề bắt bạn chạy tay máy này thì đáp án phụ thuộc vào <strong>TRẠNG THÁI BAN ĐẦU</strong> — và nhiều đề quên cho. Luôn viết giả định ra trước hàng đầu tiên ("bắt đầu ở chắc-chắn-không-rẽ"). Và hãy dùng đúng các cung <em>IN TRÊN FIGURE 16.19</em>, đừng dùng bộ đếm bão hoà lấy từ sách khác: ngay trên dãy này hai máy đã lệch nhau một lần đoán sai.</p>`],

      [37, 'Figure 16.20 — Dealing with Branches: (a) predict never taken, (b) branch history table',
        `<p class="y-chinh">🎯 The two extremes of the chapter side by side. Part <strong>(a) Predict never taken strategy</strong> is four boxes: <em>Next sequential address</em> → <strong>Select</strong> → <strong>Memory</strong>, with an <strong>E</strong> (execute) stage feeding <strong>Branch Miss Handling</strong> into the same Select. Part <strong>(b) Branch history table strategy</strong> adds a whole table between them.</p>
<ul>
<li><strong>Read (a) first — it is the baseline, and it is almost free.</strong> The fetcher always takes the next sequential address. Only when the branch resolves in E does <em>Branch Miss Handling</em> override the Select and redirect Memory. No prediction, no table, no state. Every taken branch costs a full flush.</li>
<li><strong>Now read (b) box by box.</strong> The <strong>IPFAR</strong> (<em>instruction prefix address register</em>, expanded on the slide itself) holds the address being fetched. It does a <strong>Lookup</strong> into a table with three columns: <strong>Branch instruction address · Target address · State</strong>. A hit supplies the target; the Select chooses between that target and the <em>next sequential address</em>. When E resolves, two arrows run back: <strong>Update state</strong> (adjust the 2 bits of slide 36) and <strong>Redirect</strong> via Branch Miss Handling. A branch not yet in the table causes <strong>Add new entry</strong>.</li>
<li><strong>Three columns, three jobs.</strong> The <em>branch instruction address</em> is the tag — it answers "is this branch the one I recorded?". The <em>target address</em> removes the need to wait for decode and address calculation (this is the prefetch idea of slide 31, cached). The <em>state</em> is the 2-bit machine of Figure 16.19. Drop any column and the table stops working.</li>
<li><strong>It is a cache, and it behaves like one.</strong> Finite size, so branches evict each other; two different branches can collide on the same entry (<em>aliasing</em>) and corrupt each other's history. Everything you learned in Ch.5 about capacity and conflict misses applies here, one level up.</li>
</ul>
<p class="nhan">📐 <strong>The case the 2-bit predictor was built for: a nested loop.</strong> Inner loop of 10 iterations (so the loop branch goes T nine times then N once), outer loop executed 100 times — 1000 conditional branches in total. Simulated in <code>python3</code>, both predictors started cold:</p>
<table>
<tr><th>Predictor</th><th>Mispredictions / 1000</th><th>Accuracy</th><th>Mispredictions per outer iteration</th></tr>
<tr><td>1-bit</td><td><strong>200</strong></td><td>80.00%</td><td><strong>2.00</strong></td></tr>
<tr><td>2-bit (Figure 16.19)</td><td><strong>102</strong></td><td>89.80%</td><td><strong>1.02</strong></td></tr>
<tr><td>2-bit saturating counter</td><td>102</td><td>89.80%</td><td>1.02</td></tr>
</table>
<p class="dap-an">✅ Answer, and this is the classic result. The 1-bit predictor is wrong <strong>exactly twice per pass through the inner loop</strong>: once on the loop exit (it predicted T, the branch was N) and once more on the first iteration of the next pass (it now predicts N, but the branch is T). The 2-bit predictor is wrong <strong>only once</strong> — on the exit — because a single N takes it from ST to WT, which still predicts taken, so the re-entry is correct. Halving the mispredictions for one extra bit per branch is why every processor since the 1990s carries two. Scaling check from the same simulation: with an inner loop of 4 the accuracies are 50.00% vs <strong>74.50%</strong>; with an inner loop of 100 they converge to 98.00% vs <strong>98.98%</strong>. <em>The shorter the loop, the more the second bit is worth.</em></p>
<table>
<tr><th>Technique (slide 29 list)</th><th>Hardware cost</th><th>Effectiveness</th><th>Still used today?</th></tr>
<tr><td>Multiple streams</td><td>Very high — duplicated front-end, 2<sup>n</sup> for nested branches</td><td>Perfect but wastes ~50% of fetch work</td><td>No (IBM 370/168, 3033)</td></tr>
<tr><td>Prefetch branch target</td><td>Low — one extra fetch path + buffer</td><td>Shortens recovery, does not prevent the flush</td><td>Yes, evolved into the Branch Target Buffer</td></tr>
<tr><td>Loop buffer</td><td>Low — 256 bytes + one comparator</td><td>Excellent for short loops, useless beyond its size</td><td>Yes, as the micro-op loop buffer / LSD in modern x86</td></tr>
<tr><td>Branch prediction (2-bit + BHT)</td><td>Moderate — a few kB of table</td><td>90–98%, and it is the only one that scales</td><td><strong>Yes, universal</strong> — modern versions add global history and neural predictors</td></tr>
<tr><td>Delayed branch</td><td>Almost none — it is an ISA rule</td><td>Hides exactly one cycle</td><td>No — worthless in a 14–20 stage pipeline, and it pollutes the ISA forever</td></tr>
</table>
<p class="meo">💡 One sentence to carry out of this whole section: <strong>the four older techniques attack the COST of a wrong guess; prediction attacks the PROBABILITY of one.</strong> Only the second approach keeps paying as pipelines get deeper — look back at the k = 20 row of slide 29 to see why.</p>`,
        `<p class="y-chinh">🎯 Hai thái cực của chương đặt cạnh nhau. Phần <strong>(a) Chiến lược đoán không bao giờ rẽ</strong> chỉ có bốn hộp: <em>Địa chỉ tuần tự kế tiếp</em> → <strong>Select</strong> → <strong>Memory</strong>, với tầng <strong>E</strong> (thực thi) đổ vào <strong>Branch Miss Handling</strong> rồi cũng vào Select. Phần <strong>(b) Chiến lược bảng lịch sử rẽ nhánh</strong> chèn hẳn một cái bảng vào giữa.</p>
<ul>
<li><strong>Đọc (a) trước — đó là mốc nền, và gần như miễn phí.</strong> Khâu nạp luôn lấy địa chỉ tuần tự kế tiếp. Chỉ khi lệnh rẽ nhánh ngã ngũ ở E thì <em>Branch Miss Handling</em> mới đè lên Select và bẻ hướng Memory. Không dự đoán, không bảng, không trạng thái. Mọi lệnh rẽ nhánh CÓ rẽ đều phải trả trọn một lần xả ống.</li>
<li><strong>Giờ đọc (b) từng hộp.</strong> <strong>IPFAR</strong> (<em>instruction prefix address register</em>, chú giải in ngay trên slide) giữ địa chỉ đang nạp. Nó <strong>Lookup</strong> (tra) vào một bảng ba cột: <strong>Địa chỉ lệnh rẽ nhánh · Địa chỉ đích · Trạng thái</strong>. Tra trúng thì bảng cấp đích; Select chọn giữa cái đích đó và <em>địa chỉ tuần tự kế tiếp</em>. Khi E ngã ngũ, hai mũi tên chạy ngược về: <strong>Update state</strong> (chỉnh 2 bit của slide 36) và <strong>Redirect</strong> qua Branch Miss Handling. Lệnh rẽ nhánh chưa có trong bảng thì <strong>Add new entry</strong>.</li>
<li><strong>Ba cột, ba nhiệm vụ.</strong> <em>Địa chỉ lệnh rẽ nhánh</em> là NHÃN — nó trả lời "cái nhánh này có phải cái mình đã ghi không?". <em>Địa chỉ đích</em> gỡ bỏ việc phải chờ giải mã và tính địa chỉ (đúng là ý tưởng tiền nạp của slide 31, đem đi đệm lại). <em>Trạng thái</em> chính là máy 2 bit của Figure 16.19. Bỏ cột nào thì bảng cũng hỏng.</li>
<li><strong>Nó LÀ một cái cache, và nó hành xử y như cache.</strong> Kích thước hữu hạn nên các lệnh rẽ nhánh đuổi lẫn nhau; hai nhánh khác nhau có thể đụng cùng một ô (<em>aliasing</em>) và phá lịch sử của nhau. Mọi thứ bạn học ở Ch.5 về trượt do dung lượng và trượt do xung đột đều áp dụng ở đây, chỉ ở một tầng cao hơn.</li>
</ul>
<p class="nhan">📐 <strong>Cái ca mà bộ 2 bit được sinh ra để phục vụ: VÒNG LẶP LỒNG.</strong> Vòng trong 10 lượt (nên nhánh của vòng lặp ra T chín lần rồi N một lần), vòng ngoài chạy 100 lần — tổng cộng 1000 lần rẽ nhánh có điều kiện. Mô phỏng bằng <code>python3</code>, cả hai bộ dự đoán khởi động nguội:</p>
<table>
<tr><th>Bộ dự đoán</th><th>Số lần đoán SAI / 1000</th><th>Độ chính xác</th><th>Số lần sai mỗi vòng NGOÀI</th></tr>
<tr><td>1 bit</td><td><strong>200</strong></td><td>80,00%</td><td><strong>2,00</strong></td></tr>
<tr><td>2 bit (Figure 16.19)</td><td><strong>102</strong></td><td>89,80%</td><td><strong>1,02</strong></td></tr>
<tr><td>2 bit bộ đếm bão hoà</td><td>102</td><td>89,80%</td><td>1,02</td></tr>
</table>
<p class="dap-an">✅ Đáp án, và đây mới là kết quả kinh điển. Bộ 1 bit sai <strong>ĐÚNG HAI LẦN mỗi lượt đi qua vòng trong</strong>: một lần ở lúc THOÁT vòng (nó đoán T, nhánh ra N) và một lần nữa ở vòng đầu tiên của lượt kế (giờ nó đoán N, nhưng nhánh ra T). Bộ 2 bit chỉ sai <strong>MỘT lần</strong> — ở lúc thoát — vì một chữ N đơn lẻ chỉ đưa nó từ ST sang WT, mà WT vẫn đoán "có rẽ", nên lần vào lại là ĐÚNG. Cắt một nửa số lần đoán sai chỉ bằng một bit phụ cho mỗi nhánh: đó là lý do mọi vi xử lý từ thập niên 1990 đều mang hai bit. Kiểm theo quy mô, cùng từ mô phỏng đó: vòng trong 4 lượt thì độ chính xác là 50,00% so với <strong>74,50%</strong>; vòng trong 100 lượt thì hai bên hội tụ về 98,00% so với <strong>98,98%</strong>. <em>Vòng lặp càng NGẮN thì cái bit thứ hai càng đáng giá.</em></p>
<table>
<tr><th>Kỹ thuật (danh sách slide 29)</th><th>Giá phần cứng</th><th>Hiệu quả</th><th>Nay còn dùng?</th></tr>
<tr><td>Nhiều luồng</td><td>Rất cao — nhân đôi đầu ống, 2<sup>n</sup> với nhánh lồng</td><td>Đúng tuyệt đối nhưng phí ~50% công nạp</td><td>Không (IBM 370/168, 3033)</td></tr>
<tr><td>Tiền nạp đích rẽ nhánh</td><td>Thấp — thêm một đường nạp + bộ đệm</td><td>Rút ngắn hồi phục, không ngăn được xả ống</td><td>Có, đã tiến hoá thành Branch Target Buffer</td></tr>
<tr><td>Bộ đệm vòng</td><td>Thấp — 256 byte + một bộ so sánh</td><td>Tuyệt vời với vòng ngắn, vô dụng khi vượt cỡ</td><td>Có, dưới dạng bộ đệm vi lệnh / LSD trong x86 hiện đại</td></tr>
<tr><td>Dự đoán rẽ nhánh (2 bit + BHT)</td><td>Vừa — vài kB bảng</td><td>90–98%, và là cách DUY NHẤT mở rộng được</td><td><strong>Có, khắp nơi</strong> — bản hiện đại thêm lịch sử toàn cục và bộ dự đoán kiểu mạng nơ-ron</td></tr>
<tr><td>Trì hoãn rẽ nhánh</td><td>Gần như bằng 0 — nó là một luật của tập lệnh</td><td>Giấu được đúng một chu kỳ</td><td>Không — vô nghĩa với ống 14–20 tầng, lại làm bẩn tập lệnh vĩnh viễn</td></tr>
</table>
<p class="meo">💡 Một câu mang ra khỏi cả mục này: <strong>bốn kỹ thuật cũ đánh vào GIÁ của một cú đoán sai; dự đoán đánh vào XÁC SUẤT xảy ra cú đoán sai đó.</strong> Chỉ cách thứ hai còn sinh lời khi pipeline ngày càng sâu — nhìn lại hàng k = 20 ở slide 29 sẽ thấy vì sao.</p>`],

      [38, 'Intel 80486 Pipelining — the five stages',
        `<p class="y-chinh">🎯 From theory to a real chip. The 80486 implements a <strong>five-stage</strong> pipeline: <strong>Fetch → Decode stage 1 (D1) → Decode stage 2 (D2) → Execute (EX) → Write back (WB)</strong>. The slide gives each stage its job description, word for word.</p>
<table>
<tr><th>Stage</th><th>What the slide says it does</th></tr>
<tr><td><strong>Fetch</strong></td><td><em>Objective is to fill the prefetch buffers with new data as soon as the old data have been consumed by the instruction decoder.</em> · <em>Operates independently of the other stages to keep the prefetch buffers full.</em></td></tr>
<tr><td><strong>Decode stage 1</strong></td><td><em>All opcode and addressing-mode information is decoded in the D1 stage.</em> · <em>3 bytes of instruction are passed to the D1 stage from the prefetch buffers.</em> · <em>D1 decoder can then direct the D2 stage to capture the rest of the instruction.</em></td></tr>
<tr><td><strong>Decode stage 2</strong></td><td><em>Expands each opcode into control signals for the ALU.</em> · <em>Also controls the computation of the more complex addressing modes.</em></td></tr>
<tr><td><strong>Execute</strong></td><td><em>Stage includes ALU operations, cache access, and register update.</em></td></tr>
<tr><td><strong>Write back</strong></td><td><em>Updates registers and status flags modified during the preceding execute stage.</em></td></tr>
</table>
<ul>
<li><strong>Why decode needs TWO stages here and one stage in the textbook pipeline.</strong> Because x86 instructions are <em>variable length</em> (Ch.14). D1 reads only the first 3 bytes — enough to identify the opcode and the addressing mode — and from that it can tell D2 how many more bytes to grab. A fixed-length RISC instruction (Ch.17) needs no such two-step dance.</li>
<li><strong>Fetch "operates independently" is the loop-buffer idea again.</strong> The prefetch buffers decouple the fetcher from the rest of the pipe, so a cache hit that arrives early is stored rather than wasted. Compare slide 32.</li>
<li><strong>Execute does a lot of work for one stage.</strong> "ALU operations, cache access, and register update" in one stage means the clock period must be long enough for the slowest of the three. This is precisely the balance problem of slide 19 — a pipeline is only as fast as its slowest stage.</li>
<li><strong>Write back exists so that flags are committed in order.</strong> Status flags (EFLAGS, slide 44) are read by the very next conditional branch, so their update must be at a well-defined point. Committing them in WB is what makes the CMP-then-Jcc pattern of slide 39(c) predictable.</li>
</ul>
<p class="meo">💡 Map the 80486's five stages onto the textbook six of slide 22: FI→Fetch, DI→D1, CO→D2, FO+EI→EX, WO→WB. The 486 folds operand fetch into execute because its cache access <em>is</em> part of EX.</p>
<p class="pitfall">⚠️ Trap: the 80486 pipeline is <strong>not superscalar</strong> — it is a single pipeline issuing at most one instruction per cycle. The Pentium added a second pipe. Do not confuse "five stages" with "five instructions at once"; five stages means five instructions <em>in flight at different stages</em>.</p>`,
        `<p class="y-chinh">🎯 Từ lý thuyết bước sang một con chip thật. 80486 cài đặt pipeline <strong>NĂM TẦNG</strong>: <strong>Fetch → Decode stage 1 (D1) → Decode stage 2 (D2) → Execute (EX) → Write back (WB)</strong>. Slide ghi mô tả công việc của từng tầng, nguyên văn.</p>
<table>
<tr><th>Tầng</th><th>Slide nói nó làm gì</th></tr>
<tr><td><strong>Fetch</strong></td><td><em>Mục tiêu là đổ đầy các bộ đệm tiền nạp bằng dữ liệu mới ngay khi dữ liệu cũ đã bị bộ giải mã lệnh tiêu thụ hết.</em> · <em>Hoạt động ĐỘC LẬP với các tầng khác để giữ bộ đệm tiền nạp luôn đầy.</em></td></tr>
<tr><td><strong>Decode stage 1</strong></td><td><em>Mọi thông tin về mã lệnh và chế độ địa chỉ được giải mã ở tầng D1.</em> · <em>3 byte của lệnh được chuyển từ bộ đệm tiền nạp sang D1.</em> · <em>Bộ giải mã D1 sau đó chỉ đạo tầng D2 tóm nốt phần còn lại của lệnh.</em></td></tr>
<tr><td><strong>Decode stage 2</strong></td><td><em>Bung mỗi mã lệnh thành các tín hiệu điều khiển cho ALU.</em> · <em>Đồng thời điều khiển việc tính các chế độ địa chỉ phức tạp hơn.</em></td></tr>
<tr><td><strong>Execute</strong></td><td><em>Tầng này gồm các phép ALU, truy cập cache, và cập nhật thanh ghi.</em></td></tr>
<tr><td><strong>Write back</strong></td><td><em>Cập nhật các thanh ghi và cờ trạng thái đã bị tầng execute ngay trước đó sửa đổi.</em></td></tr>
</table>
<ul>
<li><strong>Vì sao ở đây giải mã cần HAI tầng còn pipeline sách giáo khoa chỉ một.</strong> Vì lệnh x86 có <em>ĐỘ DÀI THAY ĐỔI</em> (Ch.14). D1 chỉ đọc 3 byte đầu — đủ để nhận ra mã lệnh và chế độ địa chỉ — và từ đó nó nói cho D2 biết còn phải lấy thêm mấy byte nữa. Lệnh RISC dài cố định (Ch.17) không cần điệu nhảy hai bước này.</li>
<li><strong>Câu "Fetch hoạt động độc lập" chính là ý tưởng bộ đệm vòng lặp lại.</strong> Các bộ đệm tiền nạp tách rời khâu nạp khỏi phần còn lại của ống, nên một lần trúng cache về sớm sẽ được CẤT lại chứ không bị phí. So với slide 32.</li>
<li><strong>Tầng Execute ôm quá nhiều việc cho một tầng.</strong> "Phép ALU, truy cập cache, và cập nhật thanh ghi" trong một tầng nghĩa là chu kỳ đồng hồ phải dài bằng cái chậm nhất trong ba thứ đó. Đây đúng là bài toán cân bằng của slide 19 — pipeline chỉ nhanh bằng cái tầng chậm nhất của nó.</li>
<li><strong>Write back tồn tại để cờ được chốt ĐÚNG THỨ TỰ.</strong> Cờ trạng thái (EFLAGS, slide 44) bị chính lệnh rẽ nhánh có điều kiện ngay sau đó đọc, nên việc cập nhật chúng phải xảy ra ở một điểm xác định rõ. Chốt ở WB chính là thứ làm cho mẫu CMP-rồi-Jcc ở slide 39(c) trở nên đoán được.</li>
</ul>
<p class="meo">💡 Ánh xạ năm tầng của 80486 lên sáu tầng sách giáo khoa ở slide 22: FI→Fetch, DI→D1, CO→D2, FO+EI→EX, WO→WB. 486 gộp khâu lấy toán hạng vào execute vì với nó, truy cập cache <em>CHÍNH LÀ</em> một phần của EX.</p>
<p class="pitfall">⚠️ Bẫy: pipeline 80486 <strong>KHÔNG phải superscalar</strong> — nó là một ống đơn, mỗi chu kỳ phát ra nhiều nhất một lệnh. Pentium mới thêm ống thứ hai. Đừng nhầm "năm tầng" với "năm lệnh cùng lúc"; năm tầng nghĩa là năm lệnh <em>đang bay ở năm tầng khác nhau</em>.</p>`],

      [39, 'Figure 16.21 — 80486 Instruction Pipeline Examples',
        `<p class="y-chinh">🎯 Three timing diagrams that turn slide 38 into cycle counts: <strong>(a) No Data Load Delay in the Pipeline</strong>, <strong>(b) Pointer Load Delay</strong>, <strong>(c) Branch Instruction Timing</strong>. Read them as tables — columns are clock cycles, rows are instructions, cells are stages.</p>
<p class="nhan">📐 <strong>(a) No data load delay</strong> — three independent MOVs, perfect flow, one instruction finishing per cycle:</p>
<table>
<tr><th>Instruction</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th></tr>
<tr><td>MOV Reg1, Mem1</td><td>Fetch</td><td>D1</td><td>D2</td><td>EX</td><td>WB</td><td></td><td></td></tr>
<tr><td>MOV Reg1, Reg2</td><td></td><td>Fetch</td><td>D1</td><td>D2</td><td>EX</td><td>WB</td><td></td></tr>
<tr><td>MOV Mem2, Reg1</td><td></td><td></td><td>Fetch</td><td>D1</td><td>D2</td><td>EX</td><td>WB</td></tr>
</table>
<p class="nhan">📐 <strong>(b) Pointer load delay</strong> — the second instruction dereferences the register the first is still loading:</p>
<table>
<tr><th>Instruction</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
<tr><td>MOV Reg1, Mem1</td><td>Fetch</td><td>D1</td><td>D2</td><td>EX</td><td>WB</td><td></td></tr>
<tr><td>MOV Reg2, (Reg1)</td><td></td><td>Fetch</td><td>D1</td><td><strong>— stall —</strong></td><td>D2</td><td>EX</td></tr>
</table>
<p class="dap-an">✅ Answer for (b): <strong>one cycle of stall</strong>. D2 of the second instruction has to compute the effective address <code>(Reg1)</code>, but Reg1 is only produced by the first instruction's EX in cycle 4. So D2 cannot run in cycle 4; it waits and runs in cycle 5. This is a <strong>RAW (true dependency) data hazard</strong> from slide 28 — and note it is an <em>address</em> dependency, which is why it bites at D2 rather than at EX.</p>
<p class="nhan">📐 <strong>(c) Branch instruction timing</strong> — the classic compare-then-jump pair:</p>
<table>
<tr><th>Instruction</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
<tr><td>CMP Reg1, Imm</td><td>Fetch</td><td>D1</td><td>D2</td><td>EX</td><td>WB</td><td></td><td></td><td></td></tr>
<tr><td>Jcc Target</td><td></td><td>Fetch</td><td>D1</td><td>D2</td><td>EX</td><td></td><td></td><td></td></tr>
<tr><td>Target</td><td></td><td></td><td></td><td></td><td>Fetch</td><td>D1</td><td>D2</td><td>EX</td></tr>
</table>
<p class="dap-an">✅ Answer for (c): the target instruction's Fetch happens in cycle <strong>5</strong> — the same cycle in which the branch executes. Without a branch, the third instruction would have been fetched in cycle <strong>3</strong>. The taken branch therefore costs <strong>2 lost fetch slots</strong>, and the first useful result from the target arrives at cycle 8 instead of 6. On this 5-stage pipe the branch penalty is small; put the same code on a 20-stage pipe and re-read slide 29.</p>
<ul>
<li><strong>Diagram (a) is the sales pitch, (b) and (c) are the fine print.</strong> Every pipeline picture in every textbook shows the (a) case. Real code is full of (b) and (c).</li>
<li><strong>Connect to PRF192.</strong> Case (b) is literally <code>int *p = arr; int x = *p;</code> written back-to-back. Give the compiler an independent statement to slot between them and the stall disappears — that is what instruction scheduling does, and why <code>-O2</code> reorders your code.</li>
</ul>`,
        `<p class="y-chinh">🎯 Ba giản đồ thời gian biến slide 38 thành số chu kỳ: <strong>(a) Không có trễ nạp dữ liệu</strong>, <strong>(b) Trễ do nạp con trỏ</strong>, <strong>(c) Định thời lệnh rẽ nhánh</strong>. Đọc chúng dưới dạng bảng — cột là chu kỳ đồng hồ, hàng là lệnh, ô là tầng.</p>
<p class="nhan">📐 <strong>(a) Không trễ nạp dữ liệu</strong> — ba lệnh MOV độc lập, dòng chảy hoàn hảo, mỗi chu kỳ xong một lệnh:</p>
<table>
<tr><th>Lệnh</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th></tr>
<tr><td>MOV Reg1, Mem1</td><td>Fetch</td><td>D1</td><td>D2</td><td>EX</td><td>WB</td><td></td><td></td></tr>
<tr><td>MOV Reg1, Reg2</td><td></td><td>Fetch</td><td>D1</td><td>D2</td><td>EX</td><td>WB</td><td></td></tr>
<tr><td>MOV Mem2, Reg1</td><td></td><td></td><td>Fetch</td><td>D1</td><td>D2</td><td>EX</td><td>WB</td></tr>
</table>
<p class="nhan">📐 <strong>(b) Trễ do nạp con trỏ</strong> — lệnh thứ hai giải tham chiếu đúng thanh ghi mà lệnh thứ nhất còn đang nạp:</p>
<table>
<tr><th>Lệnh</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
<tr><td>MOV Reg1, Mem1</td><td>Fetch</td><td>D1</td><td>D2</td><td>EX</td><td>WB</td><td></td></tr>
<tr><td>MOV Reg2, (Reg1)</td><td></td><td>Fetch</td><td>D1</td><td><strong>— kẹt —</strong></td><td>D2</td><td>EX</td></tr>
</table>
<p class="dap-an">✅ Đáp án cho (b): <strong>KẸT MỘT CHU KỲ</strong>. Tầng D2 của lệnh thứ hai phải tính địa chỉ hiệu dụng <code>(Reg1)</code>, nhưng Reg1 chỉ được lệnh thứ nhất sinh ra ở tầng EX của chu kỳ 4. Vậy D2 không chạy được ở chu kỳ 4; nó chờ và chạy ở chu kỳ 5. Đây là <strong>hiểm hoạ dữ liệu RAW (phụ thuộc thật)</strong> của slide 28 — và để ý đây là phụ thuộc về <em>ĐỊA CHỈ</em>, nên nó cắn ở D2 chứ không phải ở EX.</p>
<p class="nhan">📐 <strong>(c) Định thời lệnh rẽ nhánh</strong> — cặp so-sánh-rồi-nhảy kinh điển:</p>
<table>
<tr><th>Lệnh</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
<tr><td>CMP Reg1, Imm</td><td>Fetch</td><td>D1</td><td>D2</td><td>EX</td><td>WB</td><td></td><td></td><td></td></tr>
<tr><td>Jcc Target</td><td></td><td>Fetch</td><td>D1</td><td>D2</td><td>EX</td><td></td><td></td><td></td></tr>
<tr><td>Target</td><td></td><td></td><td></td><td></td><td>Fetch</td><td>D1</td><td>D2</td><td>EX</td></tr>
</table>
<p class="dap-an">✅ Đáp án cho (c): lệnh ở ĐÍCH được Fetch ở chu kỳ <strong>5</strong> — đúng chu kỳ mà lệnh rẽ nhánh thực thi. Nếu không có lệnh rẽ nhánh thì lệnh thứ ba đã được nạp ở chu kỳ <strong>3</strong>. Vậy lệnh rẽ nhánh CÓ rẽ tốn <strong>2 khe nạp bị mất</strong>, và kết quả có ích đầu tiên từ đích về ở chu kỳ 8 thay vì 6. Trên ống 5 tầng này hình phạt rẽ nhánh còn nhỏ; đặt cùng đoạn mã ấy lên ống 20 tầng rồi đọc lại slide 29.</p>
<ul>
<li><strong>Giản đồ (a) là lời quảng cáo, (b) và (c) là dòng chữ nhỏ trong hợp đồng.</strong> Mọi bức tranh pipeline trong mọi sách đều vẽ ca (a). Mã thật thì đầy ca (b) và (c).</li>
<li><strong>Nối sang PRF192.</strong> Ca (b) đúng là <code>int *p = arr; int x = *p;</code> viết sát nhau. Cho trình biên dịch một câu lệnh độc lập để nhét vào giữa thì cái kẹt biến mất — đó chính là việc mà xếp lịch lệnh làm, và là lý do <code>-O2</code> đảo thứ tự mã của bạn.</li>
</ul>`],

      [40, 'Figure 16.22 — Approaches to Pipeline Organization',
        `<p class="y-chinh">🎯 Two block diagrams side by side. <strong>(a) Simple Pipeline Organization:</strong> one row of five stages <strong>IF · ID · OF · EX · WB</strong>, a <strong>Register File</strong> above it (one arrow down into OF, one arrow up from WB), and a single <strong>L1 Cache</strong> below feeding IF and exchanging data with EX. <strong>(b) Performance Enhancements:</strong> the same five stages, but now <strong>two</strong> arrows from the Register File into OF, and the single L1 cache is split into a separate <strong>I Cache</strong> (feeding IF) and <strong>D Cache</strong> (exchanging with EX).</p>
<ul>
<li><strong>Change 1 — split the cache.</strong> In (a), IF and EX both go to one L1 cache, so an instruction fetch and a data access <em>compete for the same port every cycle</em>. That is precisely the <strong>resource hazard</strong> of slide 26. Splitting into I-cache and D-cache removes the competition by duplicating the resource. This is the Harvard-style split L1 that Ch.4/Ch.5 justified from the two humps of spatial locality.</li>
<li><strong>Change 2 — a second register file read port.</strong> Two arrows into OF instead of one means the register file can deliver <strong>two source operands in the same cycle</strong>. Almost every real instruction has two sources (<code>ADD R1, R2, R3</code>), so with one port the OF stage needs two cycles and the whole pipeline runs at half rate.</li>
<li><strong>Both changes attack the same thing: STRUCTURAL contention, not logic.</strong> Neither makes any instruction smarter. They simply stop two stages from needing the same wire at the same instant. Notice how cheap the fix is relative to the gain — duplicating a port or a cache is far less work than the out-of-order machinery of slide 41.</li>
<li><strong>Read the arrow directions carefully, exams ask about them.</strong> Register File → OF is a <em>read</em>; WB → Register File is a <em>write</em>; EX ↔ D Cache is bidirectional because EX both loads and stores; IF ← I Cache is one-way because instructions are only read.</li>
</ul>
<table>
<tr><th></th><th>(a) Simple organization</th><th>(b) With enhancements</th></tr>
<tr><td>Cache</td><td>One unified L1 for instructions and data</td><td>Separate I Cache and D Cache</td></tr>
<tr><td>Register file ports (read)</td><td>1</td><td>2</td></tr>
<tr><td>Hazard it removes</td><td>—</td><td>Resource hazard at IF/EX and at OF</td></tr>
<tr><td>Ideal throughput</td><td>Below 1 instruction/cycle in practice</td><td>Approaches 1 instruction/cycle</td></tr>
</table>
<p class="meo">💡 Mnemonic for the whole figure: <strong>"two mouths, two hands"</strong>. Two caches so fetch and data never queue behind each other; two register read ports so a two-operand instruction is served in one go.</p>
<p class="pitfall">⚠️ Trap: neither diagram is superscalar. Both issue <strong>one instruction per cycle</strong>; (b) simply removes the stalls that stopped (a) from actually achieving that. The jump to more than one per cycle is Figure 16.23 on the next slide.</p>`,
        `<p class="y-chinh">🎯 Hai sơ đồ khối đặt cạnh nhau. <strong>(a) Tổ chức pipeline đơn giản:</strong> một hàng năm tầng <strong>IF · ID · OF · EX · WB</strong>, một <strong>Register File</strong> (tập thanh ghi) ở trên (một mũi tên đi xuống vào OF, một mũi tên đi lên từ WB), và một <strong>L1 Cache</strong> duy nhất ở dưới vừa nuôi IF vừa trao đổi dữ liệu với EX. <strong>(b) Các cải tiến hiệu năng:</strong> vẫn năm tầng đó, nhưng nay có <strong>HAI</strong> mũi tên từ Register File vào OF, và cái L1 đơn nhất được tách thành <strong>I Cache</strong> riêng (nuôi IF) và <strong>D Cache</strong> riêng (trao đổi với EX).</p>
<ul>
<li><strong>Thay đổi 1 — TÁCH CACHE.</strong> Ở (a), IF và EX cùng đi vào một cache L1, nên một lần nạp lệnh và một lần truy cập dữ liệu <em>tranh nhau cùng một cổng ở mỗi chu kỳ</em>. Đó đúng là <strong>hiểm hoạ tài nguyên</strong> của slide 26. Tách thành I-cache và D-cache xoá bỏ cuộc tranh chấp bằng cách nhân đôi tài nguyên. Đây chính là L1 tách kiểu Harvard mà Ch.4/Ch.5 đã biện minh từ hai cái bướu của tính cục bộ không gian.</li>
<li><strong>Thay đổi 2 — THÊM MỘT CỔNG ĐỌC tập thanh ghi.</strong> Hai mũi tên vào OF thay vì một nghĩa là tập thanh ghi có thể giao <strong>hai toán hạng nguồn trong cùng một chu kỳ</strong>. Gần như mọi lệnh thật đều có hai nguồn (<code>ADD R1, R2, R3</code>), nên với một cổng thì tầng OF cần hai chu kỳ và cả pipeline chạy còn nửa tốc độ.</li>
<li><strong>Cả hai thay đổi đều đánh vào một thứ: TRANH CHẤP CẤU TRÚC, không phải logic.</strong> Không cái nào làm lệnh nào thông minh hơn. Chúng chỉ chặn việc hai tầng cùng cần một sợi dây ở cùng một khoảnh khắc. Để ý cách sửa RẺ đến mức nào so với phần lợi — nhân một cổng hay một cache nhẹ hơn rất nhiều so với bộ máy thực thi ngoài thứ tự ở slide 41.</li>
<li><strong>Đọc kỹ CHIỀU mũi tên, đề thi có hỏi.</strong> Register File → OF là <em>ĐỌC</em>; WB → Register File là <em>GHI</em>; EX ↔ D Cache hai chiều vì EX vừa nạp vừa lưu; IF ← I Cache một chiều vì lệnh chỉ được đọc.</li>
</ul>
<table>
<tr><th></th><th>(a) Tổ chức đơn giản</th><th>(b) Có cải tiến</th></tr>
<tr><td>Cache</td><td>Một L1 hợp nhất cho cả lệnh và dữ liệu</td><td>I Cache và D Cache tách riêng</td></tr>
<tr><td>Số cổng đọc tập thanh ghi</td><td>1</td><td>2</td></tr>
<tr><td>Hiểm hoạ nó gỡ bỏ</td><td>—</td><td>Hiểm hoạ tài nguyên ở IF/EX và ở OF</td></tr>
<tr><td>Thông lượng lý tưởng</td><td>Thực tế dưới 1 lệnh/chu kỳ</td><td>Tiệm cận 1 lệnh/chu kỳ</td></tr>
</table>
<p class="meo">💡 Mẹo nhớ cả hình: <strong>"hai miệng, hai tay"</strong>. Hai cache để nạp lệnh và lấy dữ liệu không bao giờ phải xếp hàng sau nhau; hai cổng đọc thanh ghi để lệnh hai toán hạng được phục vụ trong một nhát.</p>
<p class="pitfall">⚠️ Bẫy: KHÔNG sơ đồ nào trong hai cái này là superscalar. Cả hai đều phát <strong>một lệnh mỗi chu kỳ</strong>; (b) chỉ gỡ bỏ những cái kẹt khiến (a) không đạt nổi con số đó. Bước nhảy lên hơn một lệnh mỗi chu kỳ là Figure 16.23 ở slide sau.</p>`],

      [41, 'Figure 16.23 — Improved Pipeline Organization (reservation station and multiple execution units)',
        `<p class="y-chinh">🎯 The pipeline breaks open. The front end shrinks to three stages <strong>IF · ID · OF</strong>, which then feed a <strong>Reservation station</strong>. From there instructions are sent to <strong>four independent execution units</strong> — <strong>MUL</strong> (drawn as three chained boxes, i.e. itself pipelined), <strong>ALU</strong>, <strong>CTU</strong>, <strong>LSU</strong> — and their outputs converge on a single <strong>WB</strong> stage that writes the <strong>Register File</strong>. The slide labels four green arrows: <strong>Issue · Dispatch · Finish · Complete</strong>.</p>
<table>
<tr><th>Label on the slide</th><th>Where the arrow is</th><th>What happens there</th></tr>
<tr><td><strong>Issue</strong></td><td>OF → Reservation station</td><td>The instruction leaves the in-order front end and enters the waiting pool</td></tr>
<tr><td><strong>Dispatch</strong></td><td>Reservation station → an execution unit</td><td>When its operands are ready AND a unit is free, it is sent — <em>possibly out of order</em></td></tr>
<tr><td><strong>Finish</strong></td><td>Execution units → WB</td><td>The unit has produced a result</td></tr>
<tr><td><strong>Complete</strong></td><td>WB → Register File</td><td>The result is committed to architectural state, <em>in program order</em></td></tr>
</table>
<ul>
<li><strong>The four unit names, expanded on the slide itself:</strong> ALU = arithmetic/logic unit · CTU = control/transfer unit · LSU = load/store unit · MUL = multiply unit. Also ID = instruction decode, IF = instruction fetch, OF = operand fetch, WB = write back.</li>
<li><strong>Why MUL is drawn as three boxes.</strong> Multiplication takes several cycles, so it is itself pipelined into stages. That is the deep reason a single monolithic EX stage (slide 40) is wasteful: a 3-cycle multiply would force every instruction's EX to be 3 cycles long. Splitting execution into units of different depths lets each operation take the time it needs.</li>
<li><strong>The reservation station is where the pipeline stops being a queue.</strong> In slide 40 an instruction that is stalled blocks everything behind it. Here, a stalled instruction simply sits in the station while others go around it. That single change is what turns a stall into a delay for <em>one</em> instruction rather than for <em>all</em> of them.</li>
<li><strong>The green arrow from the station up to the Register File matters.</strong> It is the path by which a waiting instruction receives an operand the moment it is produced — operand forwarding, generalised. Look back at slide 27's data hazard: this is the hardware answer to it.</li>
<li><strong>The memory side is now three deep.</strong> I-cache feeds IF; D-cache exchanges with LSU; both sit on an <strong>L2 Cache</strong> at the bottom. Ch.4's hierarchy drawn into the processor diagram.</li>
</ul>
<p class="pitfall">⚠️ Notice the asymmetry that exams probe: <strong>Dispatch may be out of order, Complete must be in order.</strong> Results are written to the architectural register file in program order so that an interrupt or exception (slide 47) sees a clean, well-defined machine state. Out-of-order execution with in-order completion is the whole contract.</p>
<p class="meo">💡 This figure is really a preview of Chapter 14 on the web (superscalar, deck cea18). Learn the four verbs now — Issue, Dispatch, Finish, Complete — and that chapter will cost you half the effort.</p>`,
        `<p class="y-chinh">🎯 Pipeline vỡ tung ra. Phần đầu co lại còn ba tầng <strong>IF · ID · OF</strong>, rồi đổ vào một <strong>Reservation station</strong> (trạm đặt chỗ). Từ đó lệnh được gửi tới <strong>BỐN đơn vị thực thi độc lập</strong> — <strong>MUL</strong> (vẽ thành ba hộp nối nhau, tức bản thân nó cũng có pipeline), <strong>ALU</strong>, <strong>CTU</strong>, <strong>LSU</strong> — và đầu ra của chúng hội tụ về một tầng <strong>WB</strong> duy nhất ghi vào <strong>Register File</strong>. Slide dán nhãn bốn mũi tên xanh: <strong>Issue · Dispatch · Finish · Complete</strong>.</p>
<table>
<tr><th>Nhãn trên slide</th><th>Mũi tên nằm ở đâu</th><th>Ở đó xảy ra chuyện gì</th></tr>
<tr><td><strong>Issue</strong> (phát)</td><td>OF → Reservation station</td><td>Lệnh rời phần đầu chạy đúng thứ tự và bước vào bể chờ</td></tr>
<tr><td><strong>Dispatch</strong> (điều phối)</td><td>Reservation station → một đơn vị thực thi</td><td>Khi toán hạng đã sẵn VÀ có đơn vị rảnh thì lệnh được gửi đi — <em>có thể SAI thứ tự</em></td></tr>
<tr><td><strong>Finish</strong> (xong việc)</td><td>Các đơn vị thực thi → WB</td><td>Đơn vị đã sinh ra kết quả</td></tr>
<tr><td><strong>Complete</strong> (hoàn tất)</td><td>WB → Register File</td><td>Kết quả được chốt vào trạng thái kiến trúc, <em>ĐÚNG thứ tự chương trình</em></td></tr>
</table>
<ul>
<li><strong>Tên bốn đơn vị, chú giải in ngay trên slide:</strong> ALU = đơn vị số học/logic · CTU = đơn vị điều khiển/chuyển · LSU = đơn vị nạp/lưu · MUL = đơn vị nhân. Kèm ID = giải mã lệnh, IF = nạp lệnh, OF = lấy toán hạng, WB = ghi trả.</li>
<li><strong>Vì sao MUL vẽ thành ba hộp.</strong> Phép nhân tốn vài chu kỳ nên bản thân nó được chia tầng. Đó là lý do sâu xa khiến một tầng EX đơn khối (slide 40) trở nên lãng phí: một phép nhân 3 chu kỳ sẽ buộc EX của MỌI lệnh phải dài 3 chu kỳ. Tách thực thi thành các đơn vị có độ sâu khác nhau cho phép mỗi phép toán lấy đúng thời gian nó cần.</li>
<li><strong>Trạm đặt chỗ là nơi pipeline thôi làm một HÀNG ĐỢI.</strong> Ở slide 40, một lệnh bị kẹt chặn hết mọi lệnh đứng sau. Ở đây, lệnh bị kẹt cứ ngồi trong trạm còn các lệnh khác đi vòng qua nó. Đúng thay đổi đó biến một cái kẹt từ chỗ làm chậm <em>TẤT CẢ</em> thành chỉ làm chậm <em>MỘT</em> lệnh.</li>
<li><strong>Mũi tên xanh chạy từ trạm lên Register File rất quan trọng.</strong> Đó là đường mà một lệnh đang chờ nhận được toán hạng ngay khoảnh khắc nó được sinh ra — chuyển tiếp toán hạng, dạng tổng quát. Nhìn lại hiểm hoạ dữ liệu ở slide 27: đây là câu trả lời bằng phần cứng cho nó.</li>
<li><strong>Phía bộ nhớ nay sâu ba tầng.</strong> I-cache nuôi IF; D-cache trao đổi với LSU; cả hai ngồi trên một <strong>L2 Cache</strong> ở dưới cùng. Phân cấp của Ch.4 vẽ thẳng vào sơ đồ bộ xử lý.</li>
</ul>
<p class="pitfall">⚠️ Để ý cái bất đối xứng mà đề thi hay xoáy: <strong>Dispatch CÓ THỂ sai thứ tự, Complete BẮT BUỘC đúng thứ tự.</strong> Kết quả được ghi vào tập thanh ghi kiến trúc theo đúng thứ tự chương trình để một ngắt hay ngoại lệ (slide 47) nhìn thấy một trạng thái máy sạch sẽ, xác định rõ. Thực thi ngoài thứ tự nhưng hoàn tất đúng thứ tự — đó là toàn bộ bản giao kèo.</p>
<p class="meo">💡 Hình này thực chất là bản xem trước của Chương 14 trên web (superscalar, deck cea18). Học thuộc bốn động từ ngay bây giờ — Issue, Dispatch, Finish, Complete — thì chương đó chỉ còn tốn nửa công sức.</p>`],

      [42, 'Figure 16.24 — Reservation Station Contents',
        `<p class="y-chinh">🎯 A zoom into the waiting pool of slide 41. The station is a row of <strong>slots</strong> (four drawn), and each slot holds five fields stacked vertically: <strong>OP · Value1 · Tag1 · Value2 · Tag2</strong>. On the left, <em>registers</em> supply <strong>data</strong> into Value1 and Value2; <em>From ID</em> supplies the <strong>operation command</strong> into OP. On the right, the slot feeds the <strong>Real EX units</strong>.</p>
<table>
<tr><th>Field in one slot</th><th>What it holds</th><th>Why it must be there</th></tr>
<tr><td><strong>OP</strong></td><td>The operation, delivered from the ID stage</td><td>The slot must remember <em>what to do</em> after decode has moved on</td></tr>
<tr><td><strong>Value1 / Value2</strong></td><td>The two source operand values, when they are available</td><td>Once copied here the instruction no longer depends on the register — the register may even be overwritten</td></tr>
<tr><td><strong>Tag1 / Tag2</strong></td><td>The identity of the instruction that will produce the missing operand</td><td>Tells the slot <em>which result to listen for</em> when the value is not ready yet</td></tr>
</table>
<ul>
<li><strong>The value/tag pair is the entire mechanism.</strong> Each operand is either a <em>value</em> (ready, just wait for a free unit) or a <em>tag</em> (not ready, wait for the producer). When a unit finishes, it broadcasts its tag together with its result; every slot compares and captures. A slot whose two operands are both values is eligible for dispatch.</li>
<li><strong>Why the value is COPIED rather than re-read later.</strong> Because copying breaks WAR and WAW dependencies (slide 28) for free. Once instruction A has copied R3's value into its slot, a later instruction may overwrite R3 immediately — A no longer cares. That is register renaming in embryo.</li>
<li><strong>"Real EX units" on the right is the slide's own phrasing</strong> and it is pointed: the reservation station is a <em>virtual</em> execution resource. The instruction appears to have started, while the real hardware has not been assigned yet.</li>
<li><strong>Count the slots to see the design trade-off.</strong> Four slots means at most four instructions can be waiting on operands. Add slots and you tolerate longer stalls but pay in comparators — every slot must compare every broadcast tag, so the cost grows with slots × broadcast buses.</li>
</ul>
<p class="dap-an">✅ Worked trace. Take <code>MUL R1, R2, R3</code> followed by <code>ADD R4, R1, R5</code>. The MUL issues into slot 0 with OP = multiply, Value1 = contents of R2, Value2 = contents of R3, both tags empty → dispatched at once. The ADD issues into slot 1 with OP = add, Value2 = contents of R5, but <strong>Value1 is missing</strong>, so <strong>Tag1 = "the MUL in slot 0"</strong>. Three cycles later MUL finishes and broadcasts (tag 0, result). Slot 1 matches the tag, writes the result into Value1, clears Tag1 → now both operands are values → the ADD dispatches. <strong>The RAW hazard was resolved without a single stall cycle in the front end</strong>; only the ADD waited, and only for as long as it truly had to.</p>
<p class="pitfall">⚠️ Trap: a reservation station does <strong>not</strong> make dependent instructions faster. The ADD still cannot start before the MUL result exists — physics is untouched. What it removes is the <em>collateral damage</em>: the instructions behind the ADD are no longer blocked by it.</p>`,
        `<p class="y-chinh">🎯 Phóng to cái bể chờ của slide 41. Trạm là một dãy <strong>khe (slot)</strong> — hình vẽ bốn khe — và mỗi khe chứa năm trường xếp chồng theo chiều dọc: <strong>OP · Value1 · Tag1 · Value2 · Tag2</strong>. Bên trái, <em>các thanh ghi</em> cấp <strong>dữ liệu</strong> vào Value1 và Value2; <em>From ID</em> cấp <strong>lệnh thao tác</strong> vào OP. Bên phải, khe này nuôi các <strong>Real EX units</strong> (đơn vị thực thi THẬT).</p>
<table>
<tr><th>Trường trong một khe</th><th>Nó giữ gì</th><th>Vì sao bắt buộc phải có</th></tr>
<tr><td><strong>OP</strong></td><td>Phép toán, chuyển tới từ tầng ID</td><td>Khe phải NHỚ <em>làm gì</em> sau khi khâu giải mã đã đi tiếp</td></tr>
<tr><td><strong>Value1 / Value2</strong></td><td>Hai GIÁ TRỊ toán hạng nguồn, khi đã có</td><td>Chép vào đây rồi thì lệnh không còn phụ thuộc vào thanh ghi nữa — thanh ghi ấy thậm chí bị ghi đè cũng được</td></tr>
<tr><td><strong>Tag1 / Tag2</strong></td><td>Danh tính của lệnh sẽ sinh ra toán hạng còn thiếu</td><td>Nói cho khe biết <em>phải lắng nghe kết quả nào</em> khi giá trị chưa sẵn sàng</td></tr>
</table>
<ul>
<li><strong>Cặp giá-trị/nhãn chính là toàn bộ cơ chế.</strong> Mỗi toán hạng hoặc là một <em>GIÁ TRỊ</em> (đã sẵn, chỉ chờ đơn vị rảnh) hoặc là một <em>NHÃN</em> (chưa sẵn, chờ kẻ sản xuất). Khi một đơn vị làm xong, nó phát quảng bá nhãn của mình kèm kết quả; mọi khe so sánh và chộp lấy. Khe nào có cả hai toán hạng đều là giá trị thì đủ điều kiện được điều phối.</li>
<li><strong>Vì sao giá trị được CHÉP chứ không đọc lại sau.</strong> Vì việc chép phá vỡ các phụ thuộc WAR và WAW (slide 28) một cách miễn phí. Khi lệnh A đã chép giá trị của R3 vào khe của nó thì một lệnh sau đó có thể ghi đè R3 ngay lập tức — A không còn quan tâm. Đó là hình hài phôi thai của việc ĐỔI TÊN THANH GHI.</li>
<li><strong>Chữ "Real EX units" bên phải là cách nói của chính slide</strong> và nó có ý: trạm đặt chỗ là một tài nguyên thực thi <em>ẢO</em>. Lệnh trông như đã bắt đầu, trong khi phần cứng thật còn chưa được phân công.</li>
<li><strong>Đếm số khe để thấy sự đánh đổi trong thiết kế.</strong> Bốn khe nghĩa là nhiều nhất bốn lệnh được phép ngồi chờ toán hạng. Thêm khe thì chịu được cái kẹt dài hơn nhưng trả giá bằng bộ so sánh — mỗi khe phải so với mọi nhãn quảng bá, nên chi phí tăng theo tích số khe × số bus quảng bá.</li>
</ul>
<p class="dap-an">✅ Chạy tay một ví dụ. Lấy <code>MUL R1, R2, R3</code> rồi tới <code>ADD R4, R1, R5</code>. Lệnh MUL được phát vào khe 0 với OP = nhân, Value1 = nội dung R2, Value2 = nội dung R3, hai nhãn đều rỗng → được điều phối đi ngay. Lệnh ADD phát vào khe 1 với OP = cộng, Value2 = nội dung R5, nhưng <strong>Value1 còn THIẾU</strong>, nên <strong>Tag1 = "lệnh MUL ở khe 0"</strong>. Ba chu kỳ sau MUL xong và quảng bá (nhãn 0, kết quả). Khe 1 khớp nhãn, ghi kết quả vào Value1, xoá Tag1 → giờ cả hai toán hạng đều là giá trị → ADD được điều phối. <strong>Hiểm hoạ RAW đã được giải quyết mà KHÔNG tốn một chu kỳ kẹt nào ở phần đầu ống</strong>; chỉ mình lệnh ADD phải chờ, và chỉ chờ đúng khoảng nó thật sự phải chờ.</p>
<p class="pitfall">⚠️ Bẫy: trạm đặt chỗ <strong>KHÔNG</strong> làm cho các lệnh phụ thuộc nhau chạy nhanh hơn. Lệnh ADD vẫn không thể bắt đầu trước khi kết quả của MUL tồn tại — vật lý không đổi. Thứ nó gỡ bỏ là <em>THIỆT HẠI DÂY CHUYỀN</em>: các lệnh đứng sau ADD không còn bị ADD chặn nữa.</p>`],

      [43, 'Table 16.2 — x86 Processor Registers',
        `<p class="y-chinh">🎯 The x86 register set in three tables: <strong>(a) Integer Unit in 32-bit Mode</strong>, <strong>(b) Integer Unit in 64-bit Mode</strong>, <strong>(c) Floating-Point Unit</strong>. Each row gives Type · Number · Length (bits) · Purpose.</p>
<table>
<tr><th>Unit</th><th>Type</th><th>Number</th><th>Length (bits)</th><th>Purpose (slide's wording)</th></tr>
<tr><td rowspan="4">(a) Integer, 32-bit mode</td><td>General</td><td>8</td><td>32</td><td>General-purpose user registers</td></tr>
<tr><td>Segment</td><td>6</td><td>16</td><td>Contain segment selectors</td></tr>
<tr><td>EFLAGS</td><td>1</td><td>32</td><td>Status and control bits</td></tr>
<tr><td>Instruction Pointer</td><td>1</td><td>32</td><td>Instruction pointer</td></tr>
<tr><td rowspan="4">(b) Integer, 64-bit mode</td><td>General</td><td><strong>16</strong></td><td><strong>32 ⚠️</strong></td><td>General-purpose user registers</td></tr>
<tr><td>Segment</td><td>6</td><td>16</td><td>Contain segment selectors</td></tr>
<tr><td>RFLAGS</td><td>1</td><td>64</td><td>Status and control bits</td></tr>
<tr><td>Instruction Pointer</td><td>1</td><td>64</td><td>Instruction pointer</td></tr>
<tr><td rowspan="6">(c) Floating-point unit</td><td>Numeric</td><td>8</td><td>80</td><td>Hold floating-point numbers</td></tr>
<tr><td>Control</td><td>1</td><td>16</td><td>Control bits</td></tr>
<tr><td>Status</td><td>1</td><td>16</td><td>Status bits</td></tr>
<tr><td>Tag Word</td><td>1</td><td>16</td><td>Specifies contents of numeric registers</td></tr>
<tr><td>Instruction Pointer</td><td>1</td><td>48</td><td>Points to instruction interrupted by exception</td></tr>
<tr><td>Data Pointer</td><td>1</td><td>48</td><td>Points to operand interrupted by exception</td></tr>
</table>
<p class="pitfall">⚠️⚠️ <strong>The slide contains an error, and you should know it rather than memorise it.</strong> Table (b) says the general registers in 64-bit mode are <strong>16 × 32 bits</strong>. The <em>count</em> is right (RAX, RBX, RCX, RDX, RSI, RDI, RBP, RSP plus R8–R15 = 16) but the <em>length</em> must be <strong>64</strong>. The same table already gives RFLAGS and the instruction pointer as 64 bits, so it contradicts itself two rows later. This walkthrough reports the error; it does not silently rewrite the slide. If an exam reproduces the table as printed, answer what the table says and note the discrepancy.</p>
<ul>
<li><strong>Read the 32 → 64 bit transition as a story about compatibility.</strong> Going to 64-bit mode <em>doubled</em> the number of general registers (8 → 16) and doubled their width. The number of segment registers did not change at all — segmentation was effectively retired in 64-bit mode but the registers could not be removed without breaking the architecture.</li>
<li><strong>Why 80-bit floating-point registers.</strong> The x87 unit computes internally in <em>extended precision</em> (80 bits) so that a chain of operations on 64-bit doubles accumulates less rounding error. This is a direct link to Ch.11 (computer arithmetic) and it is the reason the same C program can give slightly different results on x87 versus SSE.</li>
<li><strong>Two pointers of 48 bits in the FPU.</strong> Both exist purely for <em>exception reporting</em> — when a floating-point exception fires, software needs to know which instruction and which operand caused it. That is the same requirement as in-order completion on slide 41: a precise, reconstructible machine state.</li>
<li><strong>Connect to Ch.13/Ch.14.</strong> "General-purpose" here is a claim the x86 only half honours: some instructions still require specific registers (the shift count in CL, the string operations in SI/DI). A true general-purpose file, as RISC defines it (Ch.17), has no such exceptions.</li>
</ul>`,
        `<p class="y-chinh">🎯 Tập thanh ghi x86 trong ba bảng: <strong>(a) Đơn vị số nguyên ở chế độ 32 bit</strong>, <strong>(b) Đơn vị số nguyên ở chế độ 64 bit</strong>, <strong>(c) Đơn vị dấu chấm động</strong>. Mỗi dòng cho Loại · Số lượng · Độ dài (bit) · Mục đích.</p>
<table>
<tr><th>Đơn vị</th><th>Loại</th><th>Số lượng</th><th>Độ dài (bit)</th><th>Mục đích (theo chữ của slide)</th></tr>
<tr><td rowspan="4">(a) Số nguyên, 32 bit</td><td>General</td><td>8</td><td>32</td><td>Thanh ghi đa dụng cho người dùng</td></tr>
<tr><td>Segment</td><td>6</td><td>16</td><td>Chứa bộ chọn đoạn</td></tr>
<tr><td>EFLAGS</td><td>1</td><td>32</td><td>Bit trạng thái và điều khiển</td></tr>
<tr><td>Instruction Pointer</td><td>1</td><td>32</td><td>Con trỏ lệnh</td></tr>
<tr><td rowspan="4">(b) Số nguyên, 64 bit</td><td>General</td><td><strong>16</strong></td><td><strong>32 ⚠️</strong></td><td>Thanh ghi đa dụng cho người dùng</td></tr>
<tr><td>Segment</td><td>6</td><td>16</td><td>Chứa bộ chọn đoạn</td></tr>
<tr><td>RFLAGS</td><td>1</td><td>64</td><td>Bit trạng thái và điều khiển</td></tr>
<tr><td>Instruction Pointer</td><td>1</td><td>64</td><td>Con trỏ lệnh</td></tr>
<tr><td rowspan="6">(c) Đơn vị dấu chấm động</td><td>Numeric</td><td>8</td><td>80</td><td>Giữ các số dấu chấm động</td></tr>
<tr><td>Control</td><td>1</td><td>16</td><td>Bit điều khiển</td></tr>
<tr><td>Status</td><td>1</td><td>16</td><td>Bit trạng thái</td></tr>
<tr><td>Tag Word</td><td>1</td><td>16</td><td>Cho biết nội dung các thanh ghi numeric</td></tr>
<tr><td>Instruction Pointer</td><td>1</td><td>48</td><td>Trỏ tới lệnh bị ngoại lệ làm gián đoạn</td></tr>
<tr><td>Data Pointer</td><td>1</td><td>48</td><td>Trỏ tới toán hạng bị ngoại lệ làm gián đoạn</td></tr>
</table>
<p class="pitfall">⚠️⚠️ <strong>Slide này có một chỗ SAI, và bạn nên BIẾT nó thay vì học thuộc nó.</strong> Bảng (b) ghi thanh ghi General ở chế độ 64 bit là <strong>16 × 32 bit</strong>. <em>Số lượng</em> thì đúng (RAX, RBX, RCX, RDX, RSI, RDI, RBP, RSP cộng R8–R15 = 16) nhưng <em>độ dài</em> phải là <strong>64</strong>. Chính bảng ấy hai dòng sau đã ghi RFLAGS và con trỏ lệnh là 64 bit, tức nó tự mâu thuẫn với chính mình. Bài này BÁO LẠI lỗi chứ không lẳng lặng viết lại slide. Nếu đề thi chép nguyên bảng, hãy trả lời theo bảng và ghi chú chỗ vênh.</p>
<ul>
<li><strong>Đọc bước chuyển 32 → 64 bit như một câu chuyện về tương thích.</strong> Lên chế độ 64 bit thì số thanh ghi đa dụng <em>TĂNG GẤP ĐÔI</em> (8 → 16) và độ rộng cũng gấp đôi. Số thanh ghi đoạn thì không đổi tí nào — phân đoạn thực tế đã bị cho về hưu ở chế độ 64 bit nhưng không thể xoá các thanh ghi đó mà không làm gãy kiến trúc.</li>
<li><strong>Vì sao thanh ghi dấu chấm động dài 80 bit.</strong> Đơn vị x87 tính bên trong ở <em>ĐỘ CHÍNH XÁC MỞ RỘNG</em> (80 bit) để một chuỗi phép toán trên số double 64 bit tích luỹ ít sai số làm tròn hơn. Đây là mối nối thẳng sang Ch.11 (số học máy tính), và cũng là lý do cùng một chương trình C có thể ra kết quả hơi khác nhau giữa x87 và SSE.</li>
<li><strong>Hai con trỏ 48 bit trong FPU.</strong> Cả hai tồn tại thuần tuý để <em>BÁO CÁO NGOẠI LỆ</em> — khi một ngoại lệ dấu chấm động nổ ra, phần mềm cần biết lệnh nào và toán hạng nào gây ra. Đó đúng là yêu cầu "hoàn tất đúng thứ tự" ở slide 41: một trạng thái máy chính xác, dựng lại được.</li>
<li><strong>Nối sang Ch.13/Ch.14.</strong> Chữ "đa dụng" ở đây là một lời tuyên bố mà x86 chỉ giữ được một nửa: một số lệnh vẫn bắt buộc dùng thanh ghi cụ thể (số bit dịch phải nằm ở CL, các lệnh chuỗi phải dùng SI/DI). Một tập thanh ghi đa dụng THẬT, theo định nghĩa của RISC (Ch.17), không có ngoại lệ nào như vậy.</li>
</ul>`],

      [44, 'Figure 16.25 — x86 EFLAGS Register',
        `<p class="y-chinh">🎯 The 32-bit EFLAGS register drawn bit by bit, numbered 31 down to 0, with every flag named and classified. The legend on the slide sorts them into three kinds: <strong>S = status flag</strong>, <strong>C = control flag</strong>, <strong>X = system flag</strong>, and <em>shaded bits are reserved</em>.</p>
<table>
<tr><th>Kind</th><th>Flags (slide's own list)</th><th>Who reads them</th></tr>
<tr><td><strong>S — Status</strong></td><td>OF overflow · SF sign · ZF zero · AF auxiliary carry · PF parity · CF carry</td><td>The very next conditional branch (Jcc) — this is the CMP→Jcc pair of slide 39(c)</td></tr>
<tr><td><strong>C — Control</strong></td><td>DF direction flag</td><td>String instructions, to decide whether to auto-increment or auto-decrement</td></tr>
<tr><td><strong>X — System</strong></td><td>ID · VIP virtual interrupt pending · VIF virtual interrupt flag · AC alignment check · VM virtual 8086 mode · RF resume · NT nested task · IOPL I/O privilege level · IF interrupt enable · TF trap</td><td>The operating system — mostly unavailable to user code</td></tr>
</table>
<ul>
<li><strong>Six status flags, and they are the ones that matter for this chapter.</strong> They are written by arithmetic and logic instructions in the WB stage (slide 38) and read by the branch that follows. Every control hazard in an x86 program begins here.</li>
<li><strong>Look at the fixed bits in the picture.</strong> Bit 1 is hard-wired to <strong>1</strong>, bits 3, 5 and 15 are <strong>0</strong>, and everything from 22 upward is 0. Those are reserved, and software must not rely on them — a classic source of "worked on this chip, crashed on the next one".</li>
<li><strong>IOPL is two bits wide, not one.</strong> It occupies bits 13–12 and holds a privilege <em>level</em> 0–3, not a yes/no. That is why the figure draws it as one wide box straddling two bit columns.</li>
<li><strong>IF (bit 9) is the link to slide 47.</strong> Clearing IF masks <em>maskable</em> interrupts; a non-maskable interrupt ignores it completely. That single bit is the whole meaning of the word "maskable" on the next interrupt slide.</li>
<li><strong>Connect to Ch.13 and to the CPU-design argument.</strong> Condition codes were weighed up on slide 6 of this same deck: they shorten code but, as that slide's disadvantages column said, <em>in a pipelined implementation condition codes require special synchronization to avoid conflicts</em>. EFLAGS is exactly that shared, implicitly-written resource — an extra dependency between every arithmetic instruction and every branch.</li>
</ul>
<p class="meo">💡 Learn six status flags as three pairs: <strong>ZF/SF</strong> (what the result <em>is</em>), <strong>CF/OF</strong> (what the result <em>overflowed</em> — CF for unsigned, OF for signed), <strong>PF/AF</strong> (legacy: parity and BCD carry). Exams love "which flag detects signed overflow?" — <strong>OF</strong>, never CF.</p>`,
        `<p class="y-chinh">🎯 Thanh ghi EFLAGS 32 bit vẽ ra từng bit, đánh số từ 31 xuống 0, mọi cờ đều có tên và có phân loại. Chú giải trên slide xếp chúng thành ba kiểu: <strong>S = cờ trạng thái</strong>, <strong>C = cờ điều khiển</strong>, <strong>X = cờ hệ thống</strong>, và <em>các bit tô xám là bit dành riêng</em>.</p>
<table>
<tr><th>Kiểu</th><th>Các cờ (đúng danh sách slide)</th><th>Ai đọc chúng</th></tr>
<tr><td><strong>S — Trạng thái</strong></td><td>OF tràn · SF dấu · ZF không · AF nhớ phụ · PF chẵn lẻ · CF nhớ</td><td>Chính lệnh rẽ nhánh có điều kiện ngay sau đó (Jcc) — đúng cặp CMP→Jcc ở slide 39(c)</td></tr>
<tr><td><strong>C — Điều khiển</strong></td><td>DF cờ hướng</td><td>Các lệnh chuỗi, để quyết định tự tăng hay tự giảm</td></tr>
<tr><td><strong>X — Hệ thống</strong></td><td>ID · VIP ngắt ảo đang chờ · VIF cờ ngắt ảo · AC kiểm tra căn lề · VM chế độ 8086 ảo · RF tiếp tục · NT tác vụ lồng · IOPL mức đặc quyền vào/ra · IF cho phép ngắt · TF bẫy</td><td>Hệ điều hành — phần lớn mã người dùng không đụng được</td></tr>
</table>
<ul>
<li><strong>Sáu cờ trạng thái, và đó mới là nhóm quan trọng với chương này.</strong> Chúng bị các lệnh số học và logic GHI ở tầng WB (slide 38) và bị lệnh rẽ nhánh đứng sau ĐỌC. Mọi hiểm hoạ điều khiển trong một chương trình x86 đều bắt đầu từ đây.</li>
<li><strong>Nhìn kỹ các bit cố định trong hình.</strong> Bit 1 nối cứng bằng <strong>1</strong>, các bit 3, 5 và 15 bằng <strong>0</strong>, và mọi thứ từ bit 22 trở lên đều bằng 0. Đó là các bit dành riêng, phần mềm không được dựa vào chúng — nguồn cổ điển của kiểu lỗi "chạy tốt trên con chip này, sập trên con kế tiếp".</li>
<li><strong>IOPL rộng HAI bit, không phải một.</strong> Nó chiếm bit 13–12 và giữ một <em>MỨC</em> đặc quyền 0–3 chứ không phải có/không. Vì thế hình mới vẽ nó thành một ô rộng bắc qua hai cột bit.</li>
<li><strong>IF (bit 9) là mối nối sang slide 47.</strong> Xoá IF sẽ CHE các ngắt <em>che được</em> (maskable); ngắt không che được thì phớt lờ nó hoàn toàn. Đúng một bit đó là toàn bộ ý nghĩa của chữ "maskable" ở slide ngắt kế tiếp.</li>
<li><strong>Nối sang Ch.13 và sang cuộc tranh luận về thiết kế CPU.</strong> Mã điều kiện đã được cân đo ở slide 6 của chính deck này: chúng làm mã ngắn lại nhưng, như cột nhược điểm của slide đó ghi, <em>trong một cài đặt có pipeline, mã điều kiện đòi hỏi đồng bộ đặc biệt để tránh xung đột</em>. EFLAGS chính là cái tài nguyên dùng chung, bị GHI NGẦM ấy — một phụ thuộc phụ trội giữa mọi lệnh số học và mọi lệnh rẽ nhánh.</li>
</ul>
<p class="meo">💡 Học sáu cờ trạng thái theo ba cặp: <strong>ZF/SF</strong> (kết quả LÀ gì), <strong>CF/OF</strong> (kết quả TRÀN kiểu nào — CF cho không dấu, OF cho có dấu), <strong>PF/AF</strong> (di sản: chẵn lẻ và nhớ BCD). Đề thi rất thích hỏi "cờ nào phát hiện tràn có dấu?" — <strong>OF</strong>, không bao giờ là CF.</p>`],

      [45, 'Figure 16.26 — x86 Control Registers',
        `<p class="y-chinh">🎯 Four control registers stacked: <strong>CR4</strong>, <strong>CR3 (PDBR)</strong>, <strong>CR2</strong> and <strong>CR0</strong>, each 32 bits wide (with "(63)" marked on CR4 to show the 64-bit extension), shaded areas being reserved. These are the switches that turn the whole machine's major features on and off.</p>
<table>
<tr><th>Register</th><th>What the figure shows in it</th><th>Its job in one line</th></tr>
<tr><td><strong>CR0</strong></td><td>PG · CD · NW · AM · WP · NE · ET · TS · EM · MP · PE</td><td>The master switches: paging (PG), cache disable (CD), protection enable (PE)</td></tr>
<tr><td><strong>CR2</strong></td><td>One field: <em>Page-Fault Linear Address</em></td><td>After a page fault, holds the address that caused it</td></tr>
<tr><td><strong>CR3 (PDBR)</strong></td><td><em>Page-Directory Base</em> plus PCD and PWT</td><td>Points at the page directory — the root of the page tables</td></tr>
<tr><td><strong>CR4</strong></td><td>SMEP · SMXE · VMXE · PCE · PGE · MCE · PAE · PSE · DE · TSD · PVI · VME, plus OSXSAVE, PCIDE, FSGSBASE, OSXMMEXCPT, OSFXSR called out with leader lines</td><td>Feature enables added over three decades of extensions</td></tr>
</table>
<ul>
<li><strong>CR0 bit PE and bit PG are the two most consequential bits in the architecture.</strong> PE (Protection Enable) moves the processor from real mode into protected mode; PG turns paging on. Every operating system executes exactly this sequence during boot, and until it does, an x86 behaves like a 1978 8086.</li>
<li><strong>CR2 is a pure reporting register, like the FPU pointers on slide 43.</strong> Hardware writes the faulting linear address; the OS page-fault handler reads it to decide which page to bring in. Note how the same design pattern keeps returning: <em>when the hardware raises an event, it must leave behind enough state for software to act precisely.</em></li>
<li><strong>CR3 is the connection to Ch.9 (OS support) and Ch.8.</strong> Switching processes = writing a new value into CR3. That single write invalidates the TLB and changes the entire address space — the most powerful store instruction on the machine.</li>
<li><strong>CR4 is an archaeological record.</strong> VME and PVI date from the early 1990s, PAE from the 36-bit address extension, PGE/PCE from performance work, SMEP/SMXE/VMXE from security and virtualisation in the 2000s. The reserved shaded gaps are slots left for the next decade.</li>
<li><strong>CD and NW in CR0 connect straight to Ch.4/Ch.5.</strong> Cache Disable and Not Write-through let system software turn off caching for particular situations — for example when writing to memory-mapped device registers, where a cached write would be catastrophic.</li>
</ul>
<p class="pitfall">⚠️ Trap: control registers are <strong>not user-visible registers</strong> (slide 4's distinction). Reading or writing CR0–CR4 requires privilege level 0. A question listing CR3 among "user-visible registers" is wrong — they sit firmly in the "control and status" half of slide 4.</p>`,
        `<p class="y-chinh">🎯 Bốn thanh ghi điều khiển xếp chồng: <strong>CR4</strong>, <strong>CR3 (PDBR)</strong>, <strong>CR2</strong> và <strong>CR0</strong>, mỗi cái rộng 32 bit (có ghi "(63)" ở CR4 để chỉ phần mở rộng 64 bit), vùng tô xám là dành riêng. Đây là những cái công tắc bật/tắt các tính năng lớn của cả cỗ máy.</p>
<table>
<tr><th>Thanh ghi</th><th>Hình vẽ những gì trong nó</th><th>Nhiệm vụ gói một dòng</th></tr>
<tr><td><strong>CR0</strong></td><td>PG · CD · NW · AM · WP · NE · ET · TS · EM · MP · PE</td><td>Các công tắc tổng: phân trang (PG), tắt cache (CD), bật bảo vệ (PE)</td></tr>
<tr><td><strong>CR2</strong></td><td>Một trường duy nhất: <em>Page-Fault Linear Address</em></td><td>Sau một lỗi trang, giữ địa chỉ đã gây ra lỗi đó</td></tr>
<tr><td><strong>CR3 (PDBR)</strong></td><td><em>Page-Directory Base</em> cộng PCD và PWT</td><td>Trỏ tới thư mục trang — gốc của cây bảng trang</td></tr>
<tr><td><strong>CR4</strong></td><td>SMEP · SMXE · VMXE · PCE · PGE · MCE · PAE · PSE · DE · TSD · PVI · VME, cộng OSXSAVE, PCIDE, FSGSBASE, OSXMMEXCPT, OSFXSR chỉ bằng đường dẫn</td><td>Các bit bật tính năng tích tụ qua ba thập kỷ mở rộng</td></tr>
</table>
<ul>
<li><strong>Bit PE và bit PG của CR0 là hai bit có hệ quả lớn nhất trong cả kiến trúc.</strong> PE (Protection Enable) đưa bộ xử lý từ chế độ thực sang chế độ bảo vệ; PG bật phân trang. Mọi hệ điều hành đều thực thi đúng trình tự này lúc khởi động, và chừng nào chưa làm thì một con x86 vẫn hành xử như con 8086 năm 1978.</li>
<li><strong>CR2 là thanh ghi BÁO CÁO thuần tuý, giống hai con trỏ của FPU ở slide 43.</strong> Phần cứng ghi địa chỉ tuyến tính gây lỗi; trình xử lý lỗi trang của hệ điều hành đọc nó để quyết định nạp trang nào về. Để ý cùng một khuôn mẫu thiết kế cứ quay lại: <em>khi phần cứng dựng lên một sự kiện, nó phải để lại đủ trạng thái cho phần mềm hành động chính xác.</em></li>
<li><strong>CR3 là mối nối sang Ch.9 (hỗ trợ của hệ điều hành) và Ch.8.</strong> Chuyển tiến trình = ghi một giá trị mới vào CR3. Đúng một lệnh ghi đó vô hiệu hoá TLB và thay đổi TOÀN BỘ không gian địa chỉ — lệnh lưu mạnh nhất trên cỗ máy này.</li>
<li><strong>CR4 là một lớp trầm tích khảo cổ.</strong> VME và PVI có từ đầu thập niên 1990, PAE từ phần mở rộng địa chỉ 36 bit, PGE/PCE từ công việc tối ưu hiệu năng, SMEP/SMXE/VMXE từ bảo mật và ảo hoá những năm 2000. Các khoảng xám dành riêng là chỗ để trống cho thập kỷ tới.</li>
<li><strong>CD và NW trong CR0 nối thẳng sang Ch.4/Ch.5.</strong> Cache Disable và Not Write-through cho phép phần mềm hệ thống TẮT việc đệm trong những tình huống cụ thể — ví dụ khi ghi vào thanh ghi thiết bị ánh xạ bộ nhớ, nơi một lần ghi bị đệm lại sẽ là thảm hoạ.</li>
</ul>
<p class="pitfall">⚠️ Bẫy: thanh ghi điều khiển <strong>KHÔNG phải thanh ghi người dùng thấy được</strong> (sự phân biệt ở slide 4). Đọc hay ghi CR0–CR4 đòi mức đặc quyền 0. Câu nào xếp CR3 vào nhóm "thanh ghi người dùng thấy được" là SAI — chúng nằm chắc trong nửa "điều khiển và trạng thái" của slide 4.</p>`],

      [46, 'Figure 16.27 — Mapping of MMX Registers to Floating-Point Registers',
        `<p class="y-chinh">🎯 A three-dimensional drawing showing that <strong>MMX registers are not new hardware</strong>. Eight <strong>Floating-Point Registers</strong> of 80 bits (numbered 79 down to 0) sit at the back; the eight <strong>MMX Registers MM0–MM7</strong> of 64 bits (numbered 63 down to 0) are drawn in front, aliased onto the <em>low 64 bits</em> of the same physical registers. A separate column of <strong>Floating-Point Tag</strong> entries, all showing <strong>00</strong>, stands to the left.</p>
<ul>
<li><strong>Read the geometry, it is the whole message.</strong> 80 − 64 = <strong>16 bits</strong> of each FP register are <em>not</em> covered by its MMX view. Those are the sign and exponent field of the extended-precision format; the 64-bit MMX value occupies exactly the significand.</li>
<li><strong>Why Intel did this, and what it cost.</strong> Aliasing meant MMX needed <em>no new architectural state</em> — so no operating system change was required to save and restore it on a context switch, and MMX code ran on day one. The price: <strong>you cannot use MMX and x87 floating-point at the same time</strong>. Software must execute <code>EMMS</code> to leave MMX mode before touching floating point again.</li>
<li><strong>The tag word full of 00 is the trap made visible.</strong> The tag word (Table 16.2c, slide 43) says what each numeric register contains. Entering MMX forces every tag to <strong>00 = valid</strong>, which deliberately lies to the x87 unit about the stack. Forget the <code>EMMS</code> and the next floating-point instruction reads garbage — a famously hard bug to find, because nothing faults.</li>
<li><strong>Connect it to the register-organization discussion of slide 4.</strong> This is a user-visible register file being <em>reinterpreted</em> rather than extended. Compare with the clean solution used later: SSE introduced genuinely new XMM registers (128-bit), accepting the OS change in return for removing the mode problem.</li>
<li><strong>Connect it to Ch.13.</strong> MMX is a SIMD extension: one 64-bit register holds eight bytes, four words or two doublewords, and one instruction operates on all of them. That is a data-type decision inside the instruction set, exactly the subject matter of Chapter 13.</li>
</ul>
<table>
<tr><th></th><th>x87 FP registers</th><th>MMX registers</th></tr>
<tr><td>Width</td><td>80 bits</td><td>64 bits (the low part of the same register)</td></tr>
<tr><td>Count</td><td>8</td><td>8 (MM0–MM7)</td></tr>
<tr><td>Access style</td><td>A stack (ST0 relative)</td><td>Flat, directly addressable</td></tr>
<tr><td>Physical hardware</td><td colspan="2"><strong>The same eight registers</strong> — this is the point of the figure</td></tr>
</table>
<p class="meo">💡 One sentence to remember: <strong>MMX borrowed the FPU's registers instead of asking for new ones, and paid for the loan with the EMMS instruction.</strong></p>`,
        `<p class="y-chinh">🎯 Một hình vẽ ba chiều cho thấy <strong>thanh ghi MMX KHÔNG phải phần cứng mới</strong>. Tám <strong>thanh ghi dấu chấm động</strong> 80 bit (đánh số 79 xuống 0) nằm phía sau; tám <strong>thanh ghi MMX MM0–MM7</strong> 64 bit (đánh số 63 xuống 0) vẽ phía trước, chồng lên <em>64 bit THẤP</em> của chính những thanh ghi vật lý đó. Một cột <strong>Floating-Point Tag</strong> riêng, tất cả đều hiện <strong>00</strong>, đứng bên trái.</p>
<ul>
<li><strong>Đọc hình học của hình vẽ, đó là toàn bộ thông điệp.</strong> 80 − 64 = <strong>16 bit</strong> của mỗi thanh ghi FP <em>KHÔNG</em> bị khung nhìn MMX phủ tới. Đó là trường dấu và số mũ của định dạng mở rộng; giá trị MMX 64 bit chiếm đúng phần định trị.</li>
<li><strong>Vì sao Intel làm vậy, và cái giá là gì.</strong> Chồng lấn nghĩa là MMX <em>KHÔNG cần thêm trạng thái kiến trúc nào</em> — nên không phải sửa hệ điều hành để lưu/khôi phục nó khi chuyển ngữ cảnh, và mã MMX chạy được ngay ngày đầu. Cái giá: <strong>không dùng được MMX và dấu chấm động x87 cùng lúc</strong>. Phần mềm phải chạy lệnh <code>EMMS</code> để rời chế độ MMX trước khi đụng lại dấu chấm động.</li>
<li><strong>Cột tag toàn số 00 chính là cái bẫy được vẽ ra.</strong> Từ tag (Table 16.2c, slide 43) cho biết mỗi thanh ghi numeric đang chứa gì. Bước vào MMX ép mọi tag về <strong>00 = hợp lệ</strong>, tức cố tình NÓI DỐI với đơn vị x87 về ngăn xếp. Quên <code>EMMS</code> thì lệnh dấu chấm động kế tiếp đọc phải rác — một lỗi nổi tiếng khó tìm, vì không có gì báo lỗi cả.</li>
<li><strong>Nối với phần bàn về tổ chức thanh ghi ở slide 4.</strong> Đây là một tập thanh ghi người dùng thấy được bị <em>DIỄN GIẢI LẠI</em> chứ không phải được mở rộng. So với lời giải sạch sẽ dùng về sau: SSE đưa ra hẳn các thanh ghi XMM mới (128 bit), chịu sửa hệ điều hành để đổi lấy việc xoá bỏ vấn đề chế độ.</li>
<li><strong>Nối với Ch.13.</strong> MMX là một mở rộng SIMD: một thanh ghi 64 bit chứa được tám byte, bốn word hoặc hai doubleword, và một lệnh thao tác lên tất cả cùng lúc. Đó là quyết định về KIỂU DỮ LIỆU bên trong tập lệnh, đúng đề tài của Chương 13.</li>
</ul>
<table>
<tr><th></th><th>Thanh ghi FP của x87</th><th>Thanh ghi MMX</th></tr>
<tr><td>Độ rộng</td><td>80 bit</td><td>64 bit (phần thấp của chính thanh ghi đó)</td></tr>
<tr><td>Số lượng</td><td>8</td><td>8 (MM0–MM7)</td></tr>
<tr><td>Kiểu truy cập</td><td>Ngăn xếp (tương đối theo ST0)</td><td>Phẳng, đánh địa chỉ trực tiếp</td></tr>
<tr><td>Phần cứng vật lý</td><td colspan="2"><strong>CÙNG tám thanh ghi</strong> — đó chính là điều hình này muốn nói</td></tr>
</table>
<p class="meo">💡 Một câu để nhớ: <strong>MMX đi MƯỢN thanh ghi của FPU thay vì xin thanh ghi mới, và trả lãi bằng lệnh EMMS.</strong></p>`],

      [47, 'Interrupt Processing — interrupts and exceptions on the x86',
        `<p class="y-chinh">🎯 The slide draws the line that students most often blur. <strong>Interrupts are generated by a signal from hardware and may occur at random times during the execution of a program</strong> — they are <em>maskable</em> or <em>nonmaskable</em>. <strong>Exceptions are generated from software and are provoked by the execution of an instruction</strong> — they are <em>processor detected</em> or <em>programmed</em>. Both are dispatched through an <strong>interrupt vector table</strong>: <strong>every type of interrupt is assigned a number, and the number is used to index into the table</strong>.</p>
<table>
<tr><th></th><th>Interrupt</th><th>Exception</th></tr>
<tr><td>Source</td><td>A signal from <strong>hardware</strong></td><td><strong>Software</strong> — the execution of an instruction</td></tr>
<tr><td>Timing</td><td><strong>Random</strong> with respect to the program</td><td><strong>Synchronous</strong> — always the same instruction</td></tr>
<tr><td>Two kinds</td><td>Maskable · Nonmaskable</td><td>Processor detected · Programmed</td></tr>
<tr><td>Reproducible?</td><td>No — run the program again and it lands elsewhere</td><td>Yes — same input, same instruction, same exception</td></tr>
<tr><td>Example</td><td>Disk finished a transfer; timer tick</td><td>Divide by zero; page fault; <code>INT 3</code></td></tr>
</table>
<ul>
<li><strong>Maskable versus nonmaskable is one bit, and you met it on slide 44.</strong> A maskable interrupt is ignored while <strong>IF = 0</strong> in EFLAGS; a nonmaskable interrupt (the NMI pin, vector 2 on slide 48) arrives regardless. NMI is reserved for things you must never ignore — memory parity failure, imminent power loss.</li>
<li><strong>"Processor detected" versus "programmed" is the exception split.</strong> Processor-detected means the hardware noticed something wrong (divide error, invalid opcode, page fault). Programmed means the software <em>asked</em> for it — the <code>INT n</code> instruction, the classic doorway into the operating system.</li>
<li><strong>Why the vector table exists at all.</strong> Without it, every cause would need its own wire to its own handler address. Assigning each cause a <em>number</em> turns dispatch into one table lookup, so adding a new device costs a table entry rather than a redesign. Table 16.3 on the next slide is that table.</li>
<li><strong>Tie it back to the instruction cycle.</strong> Slide 12's state diagram had an interrupt check at the end of every instruction cycle — that is where all of this is tested. And tie it to slide 41: an interrupt is precisely why results must <em>complete in program order</em>. An imprecise interrupt would leave the OS unable to say which instructions had happened.</li>
<li><strong>Tie it to the pipeline.</strong> An exception is, from the pipeline's point of view, a control hazard that nobody predicted: the pipe must be flushed and refilled from the handler. All the costs of slide 29 apply — which is why a page-fault storm destroys performance far beyond the cost of the disk I/O itself.</li>
</ul>
<p class="pitfall">⚠️ Exam trap in one line: <strong>an interrupt is asynchronous and comes from outside; an exception is synchronous and comes from the instruction being executed.</strong> "Division by zero is an interrupt" is wrong — it is a processor-detected exception, vector 0.</p>`,
        `<p class="y-chinh">🎯 Slide vạch ra cái ranh giới mà sinh viên hay làm nhoè nhất. <strong>NGẮT (interrupt) do một tín hiệu từ PHẦN CỨNG sinh ra và có thể xảy ra ở những thời điểm NGẪU NHIÊN trong lúc chương trình chạy</strong> — chúng hoặc <em>che được</em> hoặc <em>không che được</em>. <strong>NGOẠI LỆ (exception) sinh ra từ PHẦN MỀM và bị khiêu khích bởi việc thực thi một lệnh</strong> — chúng hoặc do <em>bộ xử lý phát hiện</em> hoặc do <em>lập trình</em>. Cả hai đều được điều phối qua một <strong>bảng vector ngắt</strong>: <strong>mỗi loại ngắt được gán một CON SỐ, và con số đó dùng làm chỉ số tra vào bảng</strong>.</p>
<table>
<tr><th></th><th>Ngắt (interrupt)</th><th>Ngoại lệ (exception)</th></tr>
<tr><td>Nguồn gốc</td><td>Tín hiệu từ <strong>phần cứng</strong></td><td><strong>Phần mềm</strong> — việc thực thi một lệnh</td></tr>
<tr><td>Thời điểm</td><td><strong>NGẪU NHIÊN</strong> so với chương trình</td><td><strong>ĐỒNG BỘ</strong> — luôn đúng một lệnh đó</td></tr>
<tr><td>Hai loại con</td><td>Che được · Không che được</td><td>Bộ xử lý phát hiện · Do lập trình</td></tr>
<tr><td>Tái hiện được?</td><td>Không — chạy lại là nó rơi vào chỗ khác</td><td>Có — cùng đầu vào, cùng lệnh, cùng ngoại lệ</td></tr>
<tr><td>Ví dụ</td><td>Đĩa chuyển xong dữ liệu; nhịp đồng hồ</td><td>Chia cho 0; lỗi trang; <code>INT 3</code></td></tr>
</table>
<ul>
<li><strong>Che được và không che được chỉ khác nhau MỘT BIT, và bạn đã gặp nó ở slide 44.</strong> Ngắt che được bị bỏ qua khi <strong>IF = 0</strong> trong EFLAGS; ngắt không che được (chân NMI, vector 2 ở slide 48) vẫn cứ tới bất kể. NMI để dành cho những thứ không bao giờ được phép phớt lờ — lỗi chẵn lẻ bộ nhớ, sắp mất điện.</li>
<li><strong>"Bộ xử lý phát hiện" và "do lập trình" là cách chẻ đôi ngoại lệ.</strong> Bộ xử lý phát hiện nghĩa là phần cứng nhận ra có gì đó sai (lỗi chia, mã lệnh không hợp lệ, lỗi trang). Do lập trình nghĩa là phần mềm <em>CHỦ ĐỘNG XIN</em> — lệnh <code>INT n</code>, cánh cửa kinh điển để gọi vào hệ điều hành.</li>
<li><strong>Vì sao phải có bảng vector.</strong> Không có nó thì mỗi nguyên nhân phải có dây riêng dẫn tới địa chỉ trình xử lý riêng. Gán cho mỗi nguyên nhân một <em>CON SỐ</em> biến việc điều phối thành một phép tra bảng, nên thêm một thiết bị mới chỉ tốn một dòng trong bảng chứ không phải thiết kế lại. Table 16.3 ở slide sau chính là cái bảng đó.</li>
<li><strong>Buộc ngược về chu kỳ lệnh.</strong> Sơ đồ trạng thái ở slide 12 có một bước kiểm tra ngắt ở CUỐI mỗi chu kỳ lệnh — đó là nơi tất cả chuyện này được kiểm. Và buộc sang slide 41: ngắt chính là lý do vì sao kết quả phải <em>HOÀN TẤT ĐÚNG THỨ TỰ CHƯƠNG TRÌNH</em>. Một cái ngắt không chính xác sẽ khiến hệ điều hành không nói được lệnh nào đã xảy ra, lệnh nào chưa.</li>
<li><strong>Buộc sang pipeline.</strong> Dưới góc nhìn của pipeline, một ngoại lệ là một hiểm hoạ điều khiển mà KHÔNG AI dự đoán được: ống phải bị xả và nạp lại từ trình xử lý. Mọi chi phí của slide 29 đều áp dụng — đó là lý do một cơn bão lỗi trang phá hiệu năng vượt xa cái giá của bản thân việc vào/ra đĩa.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi gói một dòng: <strong>ngắt là BẤT ĐỒNG BỘ và đến từ BÊN NGOÀI; ngoại lệ là ĐỒNG BỘ và đến từ chính lệnh đang thực thi.</strong> "Chia cho 0 là một ngắt" là SAI — đó là ngoại lệ do bộ xử lý phát hiện, vector 0.</p>`],

      [48, 'Table 16.3 — x86 Exception and Interrupt Vector Table',
        `<p class="y-chinh">🎯 The actual table the numbers of slide 47 index into. Vectors <strong>0–18</strong> are defined causes, <strong>9, 15 and 19–31</strong> are reserved, and <strong>32–255</strong> are <em>user interrupt vectors, provided when the INTR signal is activated</em>. The legend says <strong>unshaded = exceptions, shaded = interrupts</strong> — and look how few are shaded.</p>
<table>
<tr><th>Vector</th><th>Description (slide's wording, condensed)</th><th>Kind</th></tr>
<tr><td>0</td><td>Divide error; division overflow or division by zero</td><td>Exception</td></tr>
<tr><td>1</td><td>Debug exception; various faults and traps related to debugging</td><td>Exception</td></tr>
<tr><td><strong>2</strong></td><td><strong>NMI pin interrupt; signal on NMI pin</strong></td><td><strong>Interrupt</strong></td></tr>
<tr><td>3</td><td>Breakpoint; caused by INT 3, a 1-byte instruction useful for debugging</td><td>Exception (programmed)</td></tr>
<tr><td>4</td><td>INTO-detected overflow; occurs when INTO executes with the OF flag set</td><td>Exception (programmed)</td></tr>
<tr><td>5</td><td>BOUND range exceeded; BOUND compares a register with boundaries stored in memory</td><td>Exception</td></tr>
<tr><td>6</td><td>Undefined opcode</td><td>Exception</td></tr>
<tr><td>7</td><td>Device not available; ESC or WAIT fails due to lack of external device</td><td>Exception</td></tr>
<tr><td>8</td><td>Double fault; two interrupts in the same instruction, cannot be handled serially</td><td>Exception</td></tr>
<tr><td>10–12</td><td>Invalid task state segment · Segment not present · Stack fault</td><td>Exception</td></tr>
<tr><td>13</td><td>General protection; a protection violation that causes no other exception</td><td>Exception</td></tr>
<tr><td>14</td><td>Page fault</td><td>Exception</td></tr>
<tr><td>16–18</td><td>Floating-point error · Alignment check · Machine check (model specific)</td><td>Exception</td></tr>
<tr><td>9, 15, 19–31</td><td>Reserved</td><td>—</td></tr>
<tr><td><strong>32–255</strong></td><td><strong>User interrupt vectors; provided when the INTR signal is activated</strong></td><td><strong>Interrupt</strong></td></tr>
</table>
<ul>
<li><strong>Count them and the design becomes obvious.</strong> Of 256 vectors, the architecture claims only the first 32, and almost all of those are <em>exceptions</em>. Real hardware interrupts live in 32–255 and are handed out by the system. Intel reserved the low end for itself precisely so that future processors could add causes without colliding with a device.</li>
<li><strong>Vector 14, page fault, is the one that runs constantly.</strong> Every demand-paged program produces them by the thousand; CR2 (slide 45) carries the faulting address to the handler. Ch.9 builds the whole of virtual memory on top of this single row.</li>
<li><strong>Vector 8, double fault, is the safety net.</strong> "Two interrupts occur during the same instruction and cannot be handled serially" — for example, a page fault while trying to deliver a page fault. If a <em>third</em> failure occurs during a double fault, the processor gives up and shuts down (triple fault), which on a PC is a reboot.</li>
<li><strong>Vectors 3 and 4 are the only deliberately-invoked ones in the low range.</strong> <code>INT 3</code> is one byte long precisely so a debugger can overwrite <em>any</em> instruction with it without changing the layout of the code. That one-byte design decision is why software breakpoints work at all.</li>
<li><strong>Vector 17, alignment check, links straight to Ch.13.</strong> "Access to a word stored at an odd byte address or a doubleword stored at an address not a multiple of 4" — that is the alignment rule, enforced by hardware when enabled by the AC flag of slide 44.</li>
</ul>
<p class="pitfall">⚠️ Note how the table punishes the slide-47 confusion: <strong>only vectors 2 and 32–255 are interrupts.</strong> Everything else you can think of — divide error, page fault, general protection — is an <em>exception</em>. Do not call them interrupts in an exam.</p>`,
        `<p class="y-chinh">🎯 Chính cái bảng mà các con số ở slide 47 tra vào. Vector <strong>0–18</strong> là những nguyên nhân đã định nghĩa, <strong>9, 15 và 19–31</strong> là dành riêng, còn <strong>32–255</strong> là <em>vector ngắt của người dùng, cấp phát khi tín hiệu INTR được kích hoạt</em>. Chú giải ghi <strong>không tô = ngoại lệ, tô xám = ngắt</strong> — và hãy để ý có RẤT ÍT ô được tô.</p>
<table>
<tr><th>Vector</th><th>Mô tả (theo chữ slide, rút gọn)</th><th>Loại</th></tr>
<tr><td>0</td><td>Lỗi chia; tràn khi chia hoặc chia cho 0</td><td>Ngoại lệ</td></tr>
<tr><td>1</td><td>Ngoại lệ gỡ lỗi; gồm nhiều fault và trap liên quan tới gỡ lỗi</td><td>Ngoại lệ</td></tr>
<tr><td><strong>2</strong></td><td><strong>Ngắt chân NMI; có tín hiệu trên chân NMI</strong></td><td><strong>NGẮT</strong></td></tr>
<tr><td>3</td><td>Điểm dừng; do lệnh INT 3 gây ra, lệnh dài 1 byte rất tiện cho gỡ lỗi</td><td>Ngoại lệ (do lập trình)</td></tr>
<tr><td>4</td><td>Tràn do INTO phát hiện; xảy ra khi thực thi INTO lúc cờ OF đang bật</td><td>Ngoại lệ (do lập trình)</td></tr>
<tr><td>5</td><td>Vượt khoảng BOUND; lệnh BOUND so một thanh ghi với biên lưu trong bộ nhớ</td><td>Ngoại lệ</td></tr>
<tr><td>6</td><td>Mã lệnh không xác định</td><td>Ngoại lệ</td></tr>
<tr><td>7</td><td>Thiết bị không sẵn sàng; ESC hoặc WAIT thất bại vì thiếu thiết bị ngoài</td><td>Ngoại lệ</td></tr>
<tr><td>8</td><td>Lỗi kép; hai ngắt xảy ra trong cùng một lệnh và không xử lý tuần tự được</td><td>Ngoại lệ</td></tr>
<tr><td>10–12</td><td>Đoạn trạng thái tác vụ không hợp lệ · Đoạn không hiện diện · Lỗi ngăn xếp</td><td>Ngoại lệ</td></tr>
<tr><td>13</td><td>Bảo vệ chung; vi phạm bảo vệ mà không gây ra ngoại lệ nào khác</td><td>Ngoại lệ</td></tr>
<tr><td>14</td><td>Lỗi trang</td><td>Ngoại lệ</td></tr>
<tr><td>16–18</td><td>Lỗi dấu chấm động · Kiểm tra căn lề · Machine check (tuỳ đời máy)</td><td>Ngoại lệ</td></tr>
<tr><td>9, 15, 19–31</td><td>Dành riêng</td><td>—</td></tr>
<tr><td><strong>32–255</strong></td><td><strong>Vector ngắt của người dùng; cấp khi tín hiệu INTR được kích hoạt</strong></td><td><strong>NGẮT</strong></td></tr>
</table>
<ul>
<li><strong>Đếm chúng ra thì thiết kế hiện rõ.</strong> Trong 256 vector, kiến trúc chỉ giành lấy 32 cái đầu, mà gần như tất cả trong số đó là <em>NGOẠI LỆ</em>. Ngắt phần cứng thật sống ở 32–255 và do hệ thống phân phát. Intel giữ riêng phần đầu chính là để các đời chip sau thêm nguyên nhân mới mà không đụng phải một thiết bị nào.</li>
<li><strong>Vector 14, lỗi trang, là cái chạy liên tục.</strong> Mọi chương trình phân trang theo yêu cầu đều đẻ ra hàng ngàn cái; CR2 (slide 45) mang địa chỉ gây lỗi tới cho trình xử lý. Ch.9 dựng toàn bộ bộ nhớ ảo trên đúng một hàng này.</li>
<li><strong>Vector 8, lỗi kép, là lưới an toàn.</strong> "Hai ngắt xảy ra trong cùng một lệnh và không xử lý tuần tự được" — ví dụ lỗi trang xảy ra ngay trong lúc đang cố chuyển giao một lỗi trang. Nếu có lỗi thứ <em>BA</em> trong lúc xử lý lỗi kép thì bộ xử lý bỏ cuộc và tắt (triple fault), mà trên PC nghĩa là khởi động lại.</li>
<li><strong>Vector 3 và 4 là hai cái duy nhất trong vùng thấp được gọi CHỦ ĐỘNG.</strong> Lệnh <code>INT 3</code> dài đúng MỘT byte chính là để trình gỡ lỗi có thể ghi đè lên <em>BẤT KỲ</em> lệnh nào mà không làm xê dịch bố cục mã. Quyết định thiết kế một byte ấy là lý do điểm dừng phần mềm chạy được.</li>
<li><strong>Vector 17, kiểm tra căn lề, nối thẳng sang Ch.13.</strong> "Truy cập một word lưu ở địa chỉ byte lẻ, hoặc một doubleword ở địa chỉ không chia hết cho 4" — đó là quy tắc căn lề, được phần cứng cưỡng chế khi cờ AC của slide 44 bật.</li>
</ul>
<p class="pitfall">⚠️ Để ý cách cái bảng này trừng phạt sự nhầm lẫn ở slide 47: <strong>CHỈ vector 2 và 32–255 là NGẮT.</strong> Mọi thứ khác bạn nghĩ ra được — lỗi chia, lỗi trang, bảo vệ chung — đều là <em>NGOẠI LỆ</em>. Đừng gọi chúng là ngắt trong bài thi.</p>`],

      [49, 'The ARM Processor — RISC attributes',
        `<p class="y-chinh">🎯 The chapter's second real-world case study. The slide states that <strong>ARM is primarily a RISC system</strong> and then lists the attributes that make it one. Read this list as the design contract that everything on slides 50–55 has to honour.</p>
<table>
<tr><th>#</th><th>Attribute (slide's own wording, condensed)</th><th>What it buys the pipeline</th></tr>
<tr><td>1</td><td>A <strong>moderate array of uniform registers</strong></td><td>Enough registers to keep operands out of memory, all behaving the same — no special-purpose exceptions like x86's CL</td></tr>
<tr><td>2</td><td>A <strong>load/store model</strong> in which operations only work on operands <em>in registers</em>, never directly in memory</td><td>Only two instructions ever touch memory, so only they can stall on a cache miss</td></tr>
<tr><td>3</td><td>A <strong>uniform fixed-length instruction of 32 bits</strong> for the standard set and <strong>16 bits</strong> for Thumb</td><td>Fetch and decode become trivial — no two-stage D1/D2 dance like the 80486 of slide 38</td></tr>
<tr><td>4</td><td><strong>Separate ALU and shifter units</strong></td><td>A shift and an arithmetic operation can be combined in one instruction without lengthening the critical path</td></tr>
<tr><td>5</td><td>A <strong>small number of addressing modes</strong>, all load/store addresses coming from registers and instruction fields</td><td>Address calculation is a fixed, short, predictable step</td></tr>
<tr><td>6</td><td><strong>Auto-increment and auto-decrement</strong> addressing modes, used <em>to improve the operation of program loops</em></td><td>The pointer bump is free — fewer instructions in the hottest code there is</td></tr>
<tr><td>7</td><td><strong>Conditional execution of instructions</strong>, which <em>minimizes the need for conditional branch instructions, thereby improving pipeline efficiency, because pipeline flushing is reduced</em></td><td><strong>Attacks the control hazard at its source</strong></td></tr>
</table>
<ul>
<li><strong>Attribute 7 is the one this chapter has been building towards.</strong> Nearly every ARM instruction carries a 4-bit condition field, so <code>if (x == 0) y = 1;</code> compiles to a single <em>conditionally executed</em> MOV rather than a branch around a MOV. No branch means <strong>nothing to predict and nothing to flush</strong> — read slide 29 again with this in mind.</li>
<li><strong>And this is precisely the <code>csel</code> that broke the first measurement on slide 29.</strong> When the compiler turned the sorted-array <code>if</code> into a conditional select, it was doing exactly what attribute 7 exists for — and the 10× penalty vanished because the branch vanished.</li>
<li><strong>Attribute 3 explains why a RISC pipeline is easier to build.</strong> With a fixed 32-bit instruction, the fetch stage always knows where the next instruction starts. The 80486 needed D1 to read 3 bytes and then tell D2 how much more to take; ARM needs none of that.</li>
<li><strong>Attribute 2 is the reason data hazards are manageable.</strong> If only LDR and STR touch memory, the long-latency operations are isolated in one place. Compare slide 39(b), where an x86 MOV that dereferences a pointer stalls the address-calculation stage.</li>
<li><strong>"Primarily a RISC system" — the word "primarily" is doing work.</strong> ARM breaks pure-RISC orthodoxy with the barrel shifter fused into data-processing instructions and with load/store-multiple. It is a pragmatic RISC, not a doctrinal one. Chapter 15 on the web (deck cea17) argues the whole RISC-versus-CISC case properly.</li>
</ul>
<p class="meo">💡 Compress the seven attributes into one sentence: <strong>fixed-size instructions, register-only arithmetic, few addressing modes, and conditional execution instead of branches.</strong> Those four clauses are worth full marks on "list the RISC characteristics of ARM".</p>`,
        `<p class="y-chinh">🎯 Ca nghiên cứu thực tế thứ hai của chương. Slide tuyên bố <strong>ARM về cơ bản là một hệ RISC</strong> rồi liệt kê các thuộc tính làm nên điều đó. Hãy đọc danh sách này như bản giao kèo thiết kế mà mọi thứ ở slide 50–55 phải tôn trọng.</p>
<table>
<tr><th>#</th><th>Thuộc tính (nguyên chữ slide, rút gọn)</th><th>Nó mang lại gì cho pipeline</th></tr>
<tr><td>1</td><td><strong>Một dãy thanh ghi ĐỒNG NHẤT với số lượng vừa phải</strong></td><td>Đủ thanh ghi để giữ toán hạng khỏi phải ra bộ nhớ, và tất cả hành xử như nhau — không có ngoại lệ chuyên dụng kiểu CL của x86</td></tr>
<tr><td>2</td><td>Mô hình <strong>nạp/lưu (load/store)</strong>: phép toán chỉ làm việc trên toán hạng <em>NẰM TRONG THANH GHI</em>, không bao giờ trực tiếp trong bộ nhớ</td><td>Chỉ đúng hai lệnh chạm tới bộ nhớ, nên chỉ chúng mới có thể kẹt vì trượt cache</td></tr>
<tr><td>3</td><td><strong>Lệnh dài CỐ ĐỊNH 32 bit</strong> cho tập chuẩn và <strong>16 bit</strong> cho tập Thumb</td><td>Nạp và giải mã thành chuyện vặt — không phải điệu nhảy hai tầng D1/D2 như 80486 ở slide 38</td></tr>
<tr><td>4</td><td><strong>Đơn vị ALU và đơn vị DỊCH tách riêng</strong></td><td>Một phép dịch và một phép số học gộp được trong một lệnh mà không kéo dài đường tới hạn</td></tr>
<tr><td>5</td><td><strong>Ít chế độ địa chỉ</strong>, mọi địa chỉ nạp/lưu đều lấy từ thanh ghi và trường lệnh</td><td>Việc tính địa chỉ thành một bước cố định, ngắn, đoán được</td></tr>
<tr><td>6</td><td>Chế độ địa chỉ <strong>tự tăng và tự giảm</strong>, dùng <em>để cải thiện hoạt động của vòng lặp</em></td><td>Việc nhích con trỏ thành miễn phí — bớt lệnh trong đúng đoạn mã nóng nhất</td></tr>
<tr><td>7</td><td><strong>THỰC THI CÓ ĐIỀU KIỆN</strong> cho các lệnh, điều này <em>giảm thiểu nhu cầu dùng lệnh rẽ nhánh có điều kiện, nhờ đó cải thiện hiệu suất pipeline, vì việc xả ống giảm đi</em></td><td><strong>Đánh thẳng vào GỐC của hiểm hoạ điều khiển</strong></td></tr>
</table>
<ul>
<li><strong>Thuộc tính 7 chính là thứ mà cả chương này dẫn tới.</strong> Gần như mọi lệnh ARM đều mang một trường điều kiện 4 bit, nên <code>if (x == 0) y = 1;</code> biên dịch thành MỘT lệnh MOV <em>thực thi có điều kiện</em> chứ không phải một lệnh nhảy vòng qua lệnh MOV. Không có nhánh nghĩa là <strong>không có gì để dự đoán và không có gì để xả</strong> — đọc lại slide 29 với ý này trong đầu.</li>
<li><strong>Và đây đúng là cái <code>csel</code> đã phá hỏng phép đo đầu tiên ở slide 29.</strong> Khi trình biên dịch biến cái <code>if</code> của bài mảng-đã-sắp-xếp thành một lệnh chọn có điều kiện, nó đang làm đúng cái việc mà thuộc tính 7 sinh ra để làm — và hình phạt 10× biến mất vì cái nhánh đã biến mất.</li>
<li><strong>Thuộc tính 3 giải thích vì sao pipeline RISC dễ dựng hơn.</strong> Với lệnh cố định 32 bit, tầng nạp LUÔN biết lệnh kế tiếp bắt đầu ở đâu. 80486 cần D1 đọc 3 byte rồi mới nói cho D2 biết phải lấy thêm bao nhiêu; ARM không cần chút nào.</li>
<li><strong>Thuộc tính 2 là lý do hiểm hoạ dữ liệu trở nên kiểm soát được.</strong> Nếu chỉ LDR và STR chạm tới bộ nhớ thì các phép có độ trễ dài bị cô lập vào một chỗ. So với slide 39(b), nơi một lệnh MOV của x86 giải tham chiếu con trỏ làm kẹt cả tầng tính địa chỉ.</li>
<li><strong>"Về cơ bản là RISC" — chữ "về cơ bản" đang làm việc thật.</strong> ARM phá giáo điều RISC thuần tuý ở chỗ nhét bộ dịch vòng vào thẳng lệnh xử lý dữ liệu, và ở lệnh nạp/lưu nhiều thanh ghi. Nó là RISC thực dụng, không phải RISC giáo điều. Chương 15 trên web (deck cea17) tranh luận trọn vẹn vụ RISC đấu CISC.</li>
</ul>
<p class="meo">💡 Nén bảy thuộc tính thành một câu: <strong>lệnh dài cố định, số học chỉ trên thanh ghi, ít chế độ địa chỉ, và THỰC THI CÓ ĐIỀU KIỆN thay cho rẽ nhánh.</strong> Bốn mệnh đề đó đủ trọn điểm cho câu "hãy kể các đặc điểm RISC của ARM".</p>`],

      [50, 'Figure 16.28 — Simplified ARM Organization',
        `<p class="y-chinh">🎯 The datapath of slide 49's contract, drawn out. <strong>External memory (cache, main memory)</strong> sits on top, connected to the <strong>Memory address register</strong> and the <strong>Memory buffer register</strong>. Between them and the <strong>User Register File (R0–R15)</strong> sit an <strong>Incrementer</strong> and a <strong>Sign extend</strong> unit. Below the register file, three operand paths labelled <em>Rn</em>, <em>Rm</em> and <em>Acc</em> feed a <strong>Barrel shifter</strong>, an <strong>ALU</strong> and a <strong>Multiply/accumulate</strong> unit, with the result returning on the <em>Rd</em> path. On the right, the <strong>Instruction register → Instruction decoder → Control unit</strong>, and inside the control unit a small box marked <strong>CPSR</strong>.</p>
<ul>
<li><strong>MAR and MBR are the same two registers as slide 7.</strong> This figure is the generic CPU of Figure 16.1 instantiated for a real chip — proof that the abstract structure of the first half of the chapter was not invented for teaching.</li>
<li><strong>Follow the Rm path and you find the fusion that makes ARM ARM.</strong> Rm goes <em>through the barrel shifter</em> and only then into the ALU. That is why one ARM instruction can say "add R1 to R2 shifted left by 3" in a single cycle — attribute 4 of slide 49, drawn as a wire.</li>
<li><strong>R15 is labelled (PC) inside the user register file — that is a deliberate ARM oddity.</strong> The program counter is not a separate special register; it is one of the sixteen general registers. So an ordinary data-processing instruction writing R15 <em>is</em> a branch, and <code>MOV PC, LR</code> is how you return from a subroutine.</li>
<li><strong>The Incrementer exists to advance the address without occupying the ALU.</strong> Sequential fetching must not compete with arithmetic — another resource hazard removed by duplication, exactly the lesson of slide 40(b).</li>
<li><strong>Sign extend sits on the path from the memory buffer.</strong> A byte or halfword loaded from memory has to become a full 32-bit value before it can enter the register file, and signed values must be extended, not zero-filled. This is Ch.11 arithmetic wired into the datapath.</li>
<li><strong>CPSR drawn inside the control unit is the visual argument of slide 54.</strong> The status register is not user data; it steers the control unit, which is what makes conditional execution possible on every instruction.</li>
</ul>
<p class="meo">💡 Trace one LDR instruction through the picture as revision: PC (R15) → MAR → memory → MBR → sign extend → register file, while the Incrementer prepares PC+4 in parallel. If you can narrate that path, you understand the figure.</p>
<p class="pitfall">⚠️ Trap: the three labels <em>Rn</em>, <em>Rm</em>, <em>Rd</em> are not three particular registers — they are the <strong>instruction fields</strong> naming which register plays which role (first source, second source, destination). Do not answer "R<sub>n</sub> is register number n".</p>`,
        `<p class="y-chinh">🎯 Đường dữ liệu của bản giao kèo ở slide 49, vẽ ra thành hình. <strong>External memory (cache, bộ nhớ chính)</strong> nằm trên cùng, nối tới <strong>Memory address register</strong> và <strong>Memory buffer register</strong>. Giữa chúng và <strong>User Register File (R0–R15)</strong> có một <strong>Incrementer</strong> (bộ tăng) và một khối <strong>Sign extend</strong> (mở rộng dấu). Dưới tập thanh ghi, ba đường toán hạng dán nhãn <em>Rn</em>, <em>Rm</em> và <em>Acc</em> nuôi một <strong>Barrel shifter</strong>, một <strong>ALU</strong> và một khối <strong>Multiply/accumulate</strong>, kết quả quay về theo đường <em>Rd</em>. Bên phải là <strong>Instruction register → Instruction decoder → Control unit</strong>, và trong khối điều khiển có một ô nhỏ ghi <strong>CPSR</strong>.</p>
<ul>
<li><strong>MAR và MBR đúng là hai thanh ghi của slide 7.</strong> Hình này là cái CPU tổng quát của Figure 16.1 được hiện thực hoá cho một con chip thật — bằng chứng rằng cấu trúc trừu tượng ở nửa đầu chương không phải bịa ra để dạy học.</li>
<li><strong>Đi theo đường Rm sẽ thấy cái hợp nhất làm nên bản sắc ARM.</strong> Rm đi <em>XUYÊN QUA bộ dịch vòng</em> rồi mới vào ALU. Đó là lý do một lệnh ARM nói được "cộng R1 với R2 đã dịch trái 3 bit" trong một chu kỳ — thuộc tính 4 của slide 49, vẽ thành một sợi dây.</li>
<li><strong>R15 ghi kèm (PC) ngay trong tập thanh ghi người dùng — đó là nét lạ CÓ CHỦ Ý của ARM.</strong> Bộ đếm chương trình không phải một thanh ghi đặc biệt riêng; nó là một trong mười sáu thanh ghi đa dụng. Nên một lệnh xử lý dữ liệu bình thường ghi vào R15 <em>CHÍNH LÀ</em> một lệnh rẽ nhánh, và <code>MOV PC, LR</code> là cách trở về từ chương trình con.</li>
<li><strong>Bộ Incrementer tồn tại để tăng địa chỉ mà KHÔNG chiếm ALU.</strong> Việc nạp tuần tự không được phép tranh chấp với số học — lại một hiểm hoạ tài nguyên bị xoá bằng cách nhân đôi, đúng bài học của slide 40(b).</li>
<li><strong>Khối Sign extend nằm trên đường từ bộ đệm bộ nhớ.</strong> Một byte hay nửa từ nạp từ bộ nhớ phải trở thành giá trị 32 bit đầy đủ trước khi vào tập thanh ghi, và giá trị CÓ DẤU phải được mở rộng dấu chứ không phải điền 0. Đây là số học Ch.11 nối thẳng vào đường dữ liệu.</li>
<li><strong>Việc vẽ CPSR NẰM TRONG khối điều khiển chính là lập luận bằng hình của slide 54.</strong> Thanh ghi trạng thái không phải dữ liệu người dùng; nó LÁI khối điều khiển, và đó là thứ làm cho mọi lệnh đều có thể thực thi có điều kiện.</li>
</ul>
<p class="meo">💡 Ôn bài bằng cách lần một lệnh LDR qua hình: PC (R15) → MAR → bộ nhớ → MBR → mở rộng dấu → tập thanh ghi, trong khi bộ Incrementer chuẩn bị PC+4 song song. Kể lại được đường đó là bạn đã hiểu hình.</p>
<p class="pitfall">⚠️ Bẫy: ba nhãn <em>Rn</em>, <em>Rm</em>, <em>Rd</em> KHÔNG phải ba thanh ghi cụ thể — chúng là các <strong>TRƯỜNG TRONG LỆNH</strong> chỉ ra thanh ghi nào đóng vai trò nào (nguồn thứ nhất, nguồn thứ hai, đích). Đừng trả lời "R<sub>n</sub> là thanh ghi số n".</p>`],

      [51, 'Processor Modes — ARM supports seven execution modes',
        `<p class="y-chinh">🎯 Four quadrants around a cross. Top-left: <strong>ARM architecture supports seven execution modes</strong>. Top-right: <strong>most application programs execute in user mode</strong>, and <em>while the processor is in user mode the program being executed is unable to access protected system resources or to change mode, other than by causing an exception to occur</em>. Bottom-left: the <strong>remaining six execution modes are referred to as privileged modes</strong>, <em>used to run system software</em>. Bottom-right: the <strong>advantages to defining so many different privileged modes</strong>.</p>
<ul>
<li><strong>Count it: 1 user mode + 6 privileged modes = 7.</strong> That number is exam-sized and easy to lose marks on. Slide 52 names the six.</li>
<li><strong>Read the top-right box as a security statement.</strong> User mode cannot reach protected resources <em>and cannot change its own mode</em> — except by causing an exception. That exception-only doorway is the entire basis of operating-system protection: the only way up is through a gate the OS controls (the SWI instruction of Table 16.4, slide 55).</li>
<li><strong>The slide's two stated advantages, verbatim in meaning.</strong> (1) <em>The OS can tailor the use of system software to a variety of circumstances.</em> (2) <em>Certain registers are dedicated for use for each of the privileged modes, allowing swifter changes in context.</em></li>
<li><strong>Advantage 2 is the one with hardware behind it, and slide 53 draws it.</strong> Each privileged mode gets its own <em>banked</em> copies of some registers. Because the handler already owns private registers, it does not have to push the interrupted program's registers onto a stack before doing anything. That is why ARM interrupt latency is low — and it is the reason for having <em>many</em> modes instead of one.</li>
<li><strong>Compare with x86 to see the design choice.</strong> x86 uses four <em>privilege levels</em> (rings 0–3, the IOPL field of slide 44) but a single register set, so every ring transition must save state to memory. ARM uses seven <em>modes</em> with partly-duplicated register sets. Same goal — isolation — two very different costs.</li>
</ul>
<table>
<tr><th></th><th>ARM</th><th>x86</th></tr>
<tr><td>Mechanism</td><td>7 execution modes</td><td>4 privilege rings</td></tr>
<tr><td>Registers</td><td>Partly <strong>banked</strong> per mode</td><td>One shared set</td></tr>
<tr><td>Cost of entering the handler</td><td>Low — private registers are already there</td><td>Higher — state must be saved</td></tr>
<tr><td>Route from unprivileged code</td><td>Only by causing an exception</td><td>Only through a gate / <code>INT n</code></td></tr>
</table>
<p class="pitfall">⚠️ Trap: "seven modes" is <strong>not</strong> "seven privilege levels". ARM has essentially two levels of privilege here — user, and everything else — spread over seven modes that differ in <em>which registers they see</em>, not in how much authority they hold.</p>`,
        `<p class="y-chinh">🎯 Bốn góc phần tư quanh một dấu cộng. Trên-trái: <strong>kiến trúc ARM hỗ trợ BẢY chế độ thực thi</strong>. Trên-phải: <strong>phần lớn chương trình ứng dụng chạy ở chế độ người dùng</strong>, và <em>khi bộ xử lý ở chế độ người dùng, chương trình đang chạy KHÔNG thể truy cập tài nguyên hệ thống được bảo vệ, cũng không thể đổi chế độ, trừ phi gây ra một ngoại lệ</em>. Dưới-trái: <strong>sáu chế độ thực thi còn lại được gọi là chế độ ĐẶC QUYỀN</strong>, <em>dùng để chạy phần mềm hệ thống</em>. Dưới-phải: <strong>các lợi thế của việc định nghĩa nhiều chế độ đặc quyền đến thế</strong>.</p>
<ul>
<li><strong>Đếm cho rõ: 1 chế độ người dùng + 6 chế độ đặc quyền = 7.</strong> Con số đó đúng cỡ một câu hỏi thi và rất dễ mất điểm. Slide 52 sẽ gọi tên sáu chế độ kia.</li>
<li><strong>Đọc ô trên-phải như một tuyên bố về BẢO MẬT.</strong> Chế độ người dùng không với tới được tài nguyên được bảo vệ <em>và không tự đổi chế độ của chính mình được</em> — trừ phi gây ra một ngoại lệ. Cái cửa duy-nhất-qua-ngoại-lệ ấy là toàn bộ nền móng của việc bảo vệ do hệ điều hành thực hiện: đường duy nhất đi lên là qua một cánh cổng do hệ điều hành kiểm soát (lệnh SWI trong Table 16.4, slide 55).</li>
<li><strong>Hai lợi thế slide nêu, giữ nguyên nghĩa.</strong> (1) <em>Hệ điều hành có thể may đo cách dùng phần mềm hệ thống cho nhiều hoàn cảnh khác nhau.</em> (2) <em>Một số thanh ghi được DÀNH RIÊNG cho từng chế độ đặc quyền, cho phép chuyển ngữ cảnh nhanh hơn.</em></li>
<li><strong>Lợi thế 2 mới là cái có phần cứng đứng sau, và slide 53 vẽ nó ra.</strong> Mỗi chế độ đặc quyền có bản sao <em>NGÂN HÀNG</em> (banked) riêng của một số thanh ghi. Vì trình xử lý đã sở hữu sẵn thanh ghi riêng nên nó không phải đẩy thanh ghi của chương trình bị gián đoạn lên ngăn xếp trước khi làm bất cứ việc gì. Đó là lý do độ trễ ngắt của ARM thấp — và là lý do phải có NHIỀU chế độ thay vì một.</li>
<li><strong>So với x86 để thấy lựa chọn thiết kế.</strong> x86 dùng bốn <em>MỨC ĐẶC QUYỀN</em> (vòng 0–3, trường IOPL của slide 44) nhưng chỉ MỘT tập thanh ghi, nên mọi lần chuyển vòng đều phải cất trạng thái ra bộ nhớ. ARM dùng bảy <em>CHẾ ĐỘ</em> với tập thanh ghi nhân đôi một phần. Cùng mục tiêu — cô lập — hai cái giá rất khác nhau.</li>
</ul>
<table>
<tr><th></th><th>ARM</th><th>x86</th></tr>
<tr><td>Cơ chế</td><td>7 chế độ thực thi</td><td>4 vòng đặc quyền</td></tr>
<tr><td>Thanh ghi</td><td>Nhân bản (<strong>banked</strong>) một phần theo chế độ</td><td>Một tập dùng chung</td></tr>
<tr><td>Giá của việc vào trình xử lý</td><td>Thấp — thanh ghi riêng đã có sẵn</td><td>Cao hơn — phải cất trạng thái</td></tr>
<tr><td>Đường đi từ mã không đặc quyền</td><td>Chỉ bằng cách gây ngoại lệ</td><td>Chỉ qua cổng / <code>INT n</code></td></tr>
</table>
<p class="pitfall">⚠️ Bẫy: "bảy chế độ" <strong>KHÔNG</strong> phải "bảy mức đặc quyền". Ở đây ARM về bản chất có hai mức đặc quyền — người dùng, và mọi thứ còn lại — trải ra thành bảy chế độ khác nhau ở chỗ <em>chúng NHÌN THẤY những thanh ghi nào</em>, chứ không khác nhau về lượng quyền hành.</p>`],

      [52, 'Exception Modes — the five exception modes plus system mode',
        `<p class="y-chinh">🎯 Four quadrants again, naming the six privileged modes of slide 51. Top-left: they <strong>have full access to system resources and can change modes freely</strong>. Top-right: they are <strong>entered when specific exceptions occur</strong>. Bottom-left, the list of <strong>Exception modes</strong>: <strong>Supervisor mode · Abort mode · Undefined mode · Fast interrupt mode · Interrupt mode</strong>. Bottom-right, the odd one out: <strong>System mode</strong>.</p>
<table>
<tr><th>Mode</th><th>Entered when…</th><th>Which exception (Table 16.4, slide 55)</th></tr>
<tr><td><strong>Supervisor</strong></td><td>Reset, or a software interrupt</td><td>Reset (0x00000000) · Software interrupt (0x00000008)</td></tr>
<tr><td><strong>Abort</strong></td><td>A memory access fails</td><td>Data abort (0x00000010) · Prefetch abort (0x0000000C)</td></tr>
<tr><td><strong>Undefined</strong></td><td>An instruction not in the instruction set reaches execute</td><td>Undefined instruction (0x00000004)</td></tr>
<tr><td><strong>Fast interrupt (FIQ)</strong></td><td>An external device asserts the FIQ pin</td><td>FIQ (0x0000001C)</td></tr>
<tr><td><strong>Interrupt (IRQ)</strong></td><td>An external device asserts the IRQ pin</td><td>IRQ (0x00000018)</td></tr>
<tr><td><strong>System</strong></td><td><strong>Never by an exception</strong> — software switches into it deliberately</td><td>— none —</td></tr>
</table>
<ul>
<li><strong>System mode is the exception to the exceptions, and the slide says so explicitly:</strong> it is <em>not entered by any exception and uses the same registers available in User mode</em>, it <em>is used for running certain privileged operating system tasks</em>, and it <em>may be interrupted by any of the five exception categories</em>.</li>
<li><strong>Why System mode has to exist at all.</strong> A supervisor handler that wants to run a long privileged task has a problem: it is using the banked SP and LR of Supervisor mode, so a nested exception would overwrite them. Switching to System mode gives it <em>privilege with the User register set</em>, so it can be safely re-entered. It is the mode invented to make re-entrancy possible.</li>
<li><strong>Five exception modes, and the five arrivals map one-to-one onto hardware events.</strong> Two come from pins (FIQ, IRQ), two from memory faults (the two aborts share Abort mode), one from the decoder (undefined), and one from software asking (SWI → Supervisor). Compare this clean five-way split with the 32-entry x86 table on slide 48 — the same job, a very different granularity.</li>
<li><strong>FIQ deserves its own mode because it gets the most banked registers.</strong> Slide 53 shows FIQ banking R8–R14, not just R13/R14 like the others. That is the design saying "this handler must start work with zero setup cost".</li>
<li><strong>Connect to Ch.9 and to slide 47.</strong> The x86 divided causes into <em>interrupts versus exceptions</em>; ARM divides them into <em>modes</em>, each with its own register bank and its own fixed entry address. Two architectures, the same underlying requirement: get to the right handler fast, with the machine state intact.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: the slide lists <strong>five</strong> exception modes, but Table 16.4 on slide 55 lists <strong>seven</strong> exception <em>types</em>. There is no contradiction — Supervisor mode covers both Reset and Software interrupt, and Abort mode covers both Data abort and Prefetch abort. Count modes and types separately.</p>`,
        `<p class="y-chinh">🎯 Lại bốn góc phần tư, lần này gọi tên sáu chế độ đặc quyền của slide 51. Trên-trái: chúng <strong>có toàn quyền truy cập tài nguyên hệ thống và đổi chế độ tự do</strong>. Trên-phải: chúng <strong>được bước vào khi những ngoại lệ cụ thể xảy ra</strong>. Dưới-trái là danh sách <strong>chế độ ngoại lệ</strong>: <strong>Supervisor · Abort · Undefined · Fast interrupt · Interrupt</strong>. Dưới-phải là kẻ lạc loài: <strong>System mode</strong>.</p>
<table>
<tr><th>Chế độ</th><th>Bước vào khi…</th><th>Ngoại lệ nào (Table 16.4, slide 55)</th></tr>
<tr><td><strong>Supervisor</strong></td><td>Reset, hoặc một ngắt phần mềm</td><td>Reset (0x00000000) · Software interrupt (0x00000008)</td></tr>
<tr><td><strong>Abort</strong></td><td>Một lần truy cập bộ nhớ thất bại</td><td>Data abort (0x00000010) · Prefetch abort (0x0000000C)</td></tr>
<tr><td><strong>Undefined</strong></td><td>Một lệnh không có trong tập lệnh đi tới tầng thực thi</td><td>Undefined instruction (0x00000004)</td></tr>
<tr><td><strong>Fast interrupt (FIQ)</strong></td><td>Thiết bị ngoài kéo chân FIQ</td><td>FIQ (0x0000001C)</td></tr>
<tr><td><strong>Interrupt (IRQ)</strong></td><td>Thiết bị ngoài kéo chân IRQ</td><td>IRQ (0x00000018)</td></tr>
<tr><td><strong>System</strong></td><td><strong>KHÔNG BAO GIỜ do ngoại lệ</strong> — phần mềm tự chủ động chuyển vào</td><td>— không có —</td></tr>
</table>
<ul>
<li><strong>System mode là ngoại lệ của các chế độ ngoại lệ, và slide nói thẳng như vậy:</strong> nó <em>không được bước vào bởi bất kỳ ngoại lệ nào và dùng đúng những thanh ghi có ở chế độ User</em>, nó <em>dùng để chạy một số tác vụ đặc quyền của hệ điều hành</em>, và nó <em>có thể bị gián đoạn bởi bất kỳ ngoại lệ nào trong năm nhóm kia</em>.</li>
<li><strong>Vì sao phải có System mode.</strong> Một trình xử lý ở Supervisor muốn chạy một tác vụ đặc quyền dài sẽ gặp vấn đề: nó đang dùng SP và LR nhân bản của chế độ Supervisor, nên một ngoại lệ lồng vào sẽ ghi đè mất chúng. Chuyển sang System mode cho nó <em>ĐẶC QUYỀN nhưng dùng tập thanh ghi của User</em>, nên vào lại được an toàn. Đây là chế độ được phát minh ra để làm cho việc TÁI NHẬP trở nên khả thi.</li>
<li><strong>Năm chế độ ngoại lệ, và năm lối vào ánh xạ một-một lên các sự kiện phần cứng.</strong> Hai cái đến từ chân cắm (FIQ, IRQ), hai cái từ lỗi bộ nhớ (hai kiểu abort chung một chế độ Abort), một từ bộ giải mã (undefined), và một từ phần mềm chủ động xin (SWI → Supervisor). So cách chẻ năm đường gọn gàng này với bảng 32 mục của x86 ở slide 48 — cùng một việc, độ mịn rất khác.</li>
<li><strong>FIQ xứng đáng có chế độ riêng vì nó được nhân bản NHIỀU thanh ghi nhất.</strong> Slide 53 cho thấy FIQ nhân bản R8–R14, chứ không chỉ R13/R14 như các chế độ khác. Đó là lời thiết kế nói rằng "trình xử lý này phải bắt đầu làm việc với chi phí chuẩn bị bằng KHÔNG".</li>
<li><strong>Nối sang Ch.9 và slide 47.</strong> x86 chia các nguyên nhân thành <em>ngắt và ngoại lệ</em>; ARM chia chúng thành <em>CHẾ ĐỘ</em>, mỗi chế độ có ngân hàng thanh ghi riêng và địa chỉ vào cố định riêng. Hai kiến trúc, cùng một đòi hỏi nền: tới đúng trình xử lý thật nhanh, với trạng thái máy còn nguyên vẹn.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: slide liệt kê <strong>NĂM</strong> chế độ ngoại lệ, nhưng Table 16.4 ở slide 55 liệt kê <strong>BẢY</strong> <em>LOẠI</em> ngoại lệ. Không hề mâu thuẫn — chế độ Supervisor phủ cả Reset lẫn Software interrupt, và chế độ Abort phủ cả Data abort lẫn Prefetch abort. Đếm CHẾ ĐỘ và đếm LOẠI là hai việc khác nhau.</p>`],

      [53, 'Figure 16.29 — ARM Register Organization',
        `<p class="y-chinh">🎯 The banking of slide 51 shown as a grid: seven columns (<strong>User · System · Supervisor · Abort · Undefined · Interrupt · Fast Interrupt</strong>) and seventeen rows (R0–R15 plus the status registers). <strong>Shading indicates that the normal register used by User or System mode has been replaced by an alternative register specific to the exception mode.</strong></p>
<table>
<tr><th>Registers</th><th>User</th><th>System</th><th>Supervisor</th><th>Abort</th><th>Undefined</th><th>IRQ</th><th>FIQ</th></tr>
<tr><td>R0–R7</td><td colspan="7">Shared by every mode — never banked</td></tr>
<tr><td>R8–R12</td><td colspan="6">Shared</td><td><strong>R8_fiq … R12_fiq</strong></td></tr>
<tr><td>R13 (SP)</td><td>R13</td><td>R13</td><td><strong>R13_svc</strong></td><td><strong>R13_abt</strong></td><td><strong>R13_und</strong></td><td><strong>R13_irq</strong></td><td><strong>R13_fiq</strong></td></tr>
<tr><td>R14 (LR)</td><td>R14</td><td>R14</td><td><strong>R14_svc</strong></td><td><strong>R14_abt</strong></td><td><strong>R14_und</strong></td><td><strong>R14_irq</strong></td><td><strong>R14_fiq</strong></td></tr>
<tr><td>R15 (PC)</td><td colspan="7">Shared — there is only one program counter</td></tr>
<tr><td>Status</td><td>CPSR</td><td>CPSR</td><td>CPSR + <strong>SPSR_svc</strong></td><td>CPSR + <strong>SPSR_abt</strong></td><td>CPSR + <strong>SPSR_und</strong></td><td>CPSR + <strong>SPSR_irq</strong></td><td>CPSR + <strong>SPSR_fiq</strong></td></tr>
</table>
<ul>
<li><strong>Count the banked registers and the design intent falls out.</strong> Each of the five exception modes banks <strong>R13 (SP) and R14 (LR)</strong> plus an <strong>SPSR</strong> — the bare minimum a handler needs: its own stack, its own return address, and a place to keep the caller's status. FIQ banks <strong>seven</strong> registers (R8–R14), so an FIQ handler has five free working registers on entry and can do real work without saving anything.</li>
<li><strong>SPSR = saved program status register, and it is the reason return works.</strong> On taking an exception the hardware copies CPSR into the mode's SPSR; on return it copies it back. There is <em>one CPSR</em> (the machine has one current status) but a private SPSR per mode, so nested exceptions in different modes do not destroy each other's saved state. Note the legend: User and System mode have <strong>no SPSR</strong> — they were never entered by an exception, so there is nothing to restore.</li>
<li><strong>User and System share <em>everything</em>.</strong> Their two columns are identical and unshaded. That is exactly the point of System mode on slide 52: privilege without a private register bank.</li>
<li><strong>R15 is not banked, and it cannot be.</strong> There is one instruction stream, so one program counter. The return address is kept in the banked <strong>R14 (LR)</strong> instead — which is why "return from exception" on ARM is essentially "move LR back into PC".</li>
<li><strong>Compare the cost with x86.</strong> Handling an IRQ here needs zero stores to memory before the handler starts. On x86, the same transition must push state. The whole figure is the hardware price ARM paid for low interrupt latency — and, per Ch.2, latency is what matters for real-time and embedded work, which is where ARM grew up.</li>
</ul>
<p class="meo">💡 Memory hook: <strong>"everybody shares the low registers, everybody gets their own stack and return address, and FIQ gets pocket money too."</strong></p>`,
        `<p class="y-chinh">🎯 Việc nhân bản thanh ghi của slide 51 trình bày thành lưới: bảy cột (<strong>User · System · Supervisor · Abort · Undefined · Interrupt · Fast Interrupt</strong>) và mười bảy hàng (R0–R15 cộng các thanh ghi trạng thái). <strong>Phần tô xám cho biết thanh ghi thông thường mà chế độ User hoặc System dùng đã bị thay bằng một thanh ghi thay thế riêng của chế độ ngoại lệ đó.</strong></p>
<table>
<tr><th>Thanh ghi</th><th>User</th><th>System</th><th>Supervisor</th><th>Abort</th><th>Undefined</th><th>IRQ</th><th>FIQ</th></tr>
<tr><td>R0–R7</td><td colspan="7">Dùng chung ở MỌI chế độ — không bao giờ nhân bản</td></tr>
<tr><td>R8–R12</td><td colspan="6">Dùng chung</td><td><strong>R8_fiq … R12_fiq</strong></td></tr>
<tr><td>R13 (SP)</td><td>R13</td><td>R13</td><td><strong>R13_svc</strong></td><td><strong>R13_abt</strong></td><td><strong>R13_und</strong></td><td><strong>R13_irq</strong></td><td><strong>R13_fiq</strong></td></tr>
<tr><td>R14 (LR)</td><td>R14</td><td>R14</td><td><strong>R14_svc</strong></td><td><strong>R14_abt</strong></td><td><strong>R14_und</strong></td><td><strong>R14_irq</strong></td><td><strong>R14_fiq</strong></td></tr>
<tr><td>R15 (PC)</td><td colspan="7">Dùng chung — chỉ có MỘT bộ đếm chương trình</td></tr>
<tr><td>Trạng thái</td><td>CPSR</td><td>CPSR</td><td>CPSR + <strong>SPSR_svc</strong></td><td>CPSR + <strong>SPSR_abt</strong></td><td>CPSR + <strong>SPSR_und</strong></td><td>CPSR + <strong>SPSR_irq</strong></td><td>CPSR + <strong>SPSR_fiq</strong></td></tr>
</table>
<ul>
<li><strong>Đếm số thanh ghi được nhân bản là ý đồ thiết kế tự rơi ra.</strong> Mỗi chế độ trong năm chế độ ngoại lệ nhân bản <strong>R13 (SP) và R14 (LR)</strong> cộng một <strong>SPSR</strong> — đúng mức tối thiểu mà một trình xử lý cần: ngăn xếp riêng, địa chỉ trở về riêng, và một chỗ giữ trạng thái của kẻ bị gián đoạn. Riêng FIQ nhân bản <strong>BẢY</strong> thanh ghi (R8–R14), nên trình xử lý FIQ vừa vào đã có năm thanh ghi làm việc rảnh và làm được việc thật mà không phải cất gì cả.</li>
<li><strong>SPSR = saved program status register, và nó là lý do việc TRỞ VỀ chạy được.</strong> Khi nhận ngoại lệ, phần cứng chép CPSR vào SPSR của chế độ đó; lúc trở về thì chép ngược lại. Chỉ có <em>MỘT CPSR</em> (máy chỉ có một trạng thái hiện hành) nhưng mỗi chế độ có SPSR riêng, nên các ngoại lệ lồng nhau ở những chế độ khác nhau không phá trạng thái đã cất của nhau. Để ý chú giải: chế độ User và System <strong>KHÔNG có SPSR</strong> — chúng chưa bao giờ được bước vào bằng ngoại lệ nên chẳng có gì để khôi phục.</li>
<li><strong>User và System dùng chung <em>MỌI THỨ</em>.</strong> Hai cột của chúng giống hệt nhau và không tô xám ô nào. Đó đúng là ý nghĩa của System mode ở slide 52: có đặc quyền mà không có ngân hàng thanh ghi riêng.</li>
<li><strong>R15 không được nhân bản, và không thể nhân bản.</strong> Chỉ có một dòng lệnh nên chỉ có một bộ đếm chương trình. Địa chỉ trở về được giữ trong <strong>R14 (LR)</strong> đã nhân bản — nên "trở về từ ngoại lệ" trên ARM về bản chất là "chuyển LR trở lại PC".</li>
<li><strong>So cái giá với x86.</strong> Xử lý một IRQ ở đây cần KHÔNG lần ghi nào ra bộ nhớ trước khi trình xử lý bắt đầu. Trên x86, cùng bước chuyển đó phải đẩy trạng thái đi cất. Cả cái hình này là cái giá phần cứng mà ARM trả để có độ trễ ngắt thấp — và theo Ch.2, độ trễ mới là thứ quan trọng với công việc thời gian thực và nhúng, tức đúng mảnh đất ARM lớn lên.</li>
</ul>
<p class="meo">💡 Mẹo nhớ: <strong>"ai cũng dùng chung mấy thanh ghi thấp, ai cũng có ngăn xếp và địa chỉ về của riêng mình, còn FIQ thì được phát thêm tiền tiêu vặt."</strong></p>`],

      [54, 'Figure 16.30 — Format of ARM CPSR and SPSR',
        `<p class="y-chinh">🎯 One 32-bit register, bits 31 down to 0, split by two big braces into <strong>User flags</strong> on the left and <strong>System control flags</strong> on the right. The fields, read straight off the figure: <strong>N Z C V Q</strong> · Res · <strong>J</strong> · Reserved · <strong>GE[3:0]</strong> · Reserved · <strong>E A I F T</strong> · <strong>M[4:0]</strong>.</p>
<table>
<tr><th>Bits</th><th>Field</th><th>What it is for</th></tr>
<tr><td>31–28</td><td><strong>N Z C V</strong></td><td>The four condition flags: Negative · Zero · Carry · oVerflow — the ARM equivalent of x86's SF/ZF/CF/OF (slide 44)</td></tr>
<tr><td>27</td><td><strong>Q</strong></td><td>Sticky overflow for saturating (DSP) arithmetic — once set it stays set until cleared explicitly</td></tr>
<tr><td>24</td><td><strong>J</strong></td><td>Jazelle state (direct execution of Java bytecode)</td></tr>
<tr><td>19–16</td><td><strong>GE[3:0]</strong></td><td>Greater-or-equal flags, one per byte lane, for SIMD instructions</td></tr>
<tr><td>9</td><td><strong>E</strong></td><td>Endianness for data accesses — big or little (Ch.13)</td></tr>
<tr><td>8, 7, 6</td><td><strong>A · I · F</strong></td><td>Disable imprecise aborts · disable IRQ · disable FIQ</td></tr>
<tr><td>5</td><td><strong>T</strong></td><td>Thumb state — 16-bit instructions instead of 32-bit (attribute 3 of slide 49)</td></tr>
<tr><td>4–0</td><td><strong>M[4:0]</strong></td><td><strong>The current processor mode</strong> — five bits selecting one of the seven modes of slides 51–53</td></tr>
</table>
<ul>
<li><strong>M[4:0] is the single most important field on this slide.</strong> Those five bits <em>are</em> the mode. Change them and the register bank of slide 53 changes underneath the program. That is why user mode "cannot change mode" — it simply cannot write the low bits of CPSR.</li>
<li><strong>The brace labels are the security boundary drawn as geometry.</strong> Everything on the left (N Z C V Q, GE) is ordinary program state a user program may read and write. Everything on the right (E, A, I, F, T, M) steers the machine and is privileged. One register, two worlds.</li>
<li><strong>I and F are ARM's version of the x86 IF flag.</strong> But note ARM has <em>two</em> — IRQ and FIQ can be masked independently, so a fast interrupt can be left enabled while ordinary interrupts are blocked. That is the ARM interrupt priority scheme, and it needs no external controller to express.</li>
<li><strong>N Z C V is where conditional execution reads from.</strong> Every ARM instruction's 4-bit condition field is evaluated against exactly these four bits. Attribute 7 of slide 49 — the whole anti-branch strategy — lives or dies on this nibble.</li>
<li><strong>The T bit shows a mode switch hiding in a status register.</strong> Setting T changes how the fetch stage interprets memory: 16-bit Thumb instructions instead of 32-bit ARM. A single bit that changes the meaning of every subsequent byte — an instruction-set decision (Ch.13) expressed as processor state.</li>
</ul>
<p class="pitfall">⚠️ Trap: CPSR and SPSR have <strong>the same format</strong> — that is why the figure is titled "Format of ARM CPSR <em>and</em> SPSR" and draws only one picture. They differ in role, not in layout: CPSR is the live status, SPSR is a frozen copy of the CPSR from the moment the exception was taken.</p>`,
        `<p class="y-chinh">🎯 Một thanh ghi 32 bit, bit 31 xuống 0, chia bằng hai dấu ngoặc lớn thành <strong>User flags</strong> (cờ người dùng) bên trái và <strong>System control flags</strong> (cờ điều khiển hệ thống) bên phải. Các trường, đọc thẳng khỏi hình: <strong>N Z C V Q</strong> · Res · <strong>J</strong> · Reserved · <strong>GE[3:0]</strong> · Reserved · <strong>E A I F T</strong> · <strong>M[4:0]</strong>.</p>
<table>
<tr><th>Bit</th><th>Trường</th><th>Dùng làm gì</th></tr>
<tr><td>31–28</td><td><strong>N Z C V</strong></td><td>Bốn cờ điều kiện: Negative (âm) · Zero (không) · Carry (nhớ) · oVerflow (tràn) — tương đương SF/ZF/CF/OF của x86 (slide 44)</td></tr>
<tr><td>27</td><td><strong>Q</strong></td><td>Cờ tràn DÍNH cho số học bão hoà (DSP) — đã bật thì giữ nguyên tới khi bị xoá tường minh</td></tr>
<tr><td>24</td><td><strong>J</strong></td><td>Trạng thái Jazelle (thực thi thẳng mã byte Java)</td></tr>
<tr><td>19–16</td><td><strong>GE[3:0]</strong></td><td>Cờ lớn-hơn-hoặc-bằng, mỗi làn byte một cờ, dùng cho lệnh SIMD</td></tr>
<tr><td>9</td><td><strong>E</strong></td><td>Thứ tự byte khi truy cập dữ liệu — đầu to hay đầu nhỏ (Ch.13)</td></tr>
<tr><td>8, 7, 6</td><td><strong>A · I · F</strong></td><td>Cấm abort không chính xác · cấm IRQ · cấm FIQ</td></tr>
<tr><td>5</td><td><strong>T</strong></td><td>Trạng thái Thumb — lệnh 16 bit thay cho 32 bit (thuộc tính 3 của slide 49)</td></tr>
<tr><td>4–0</td><td><strong>M[4:0]</strong></td><td><strong>CHẾ ĐỘ hiện hành của bộ xử lý</strong> — năm bit chọn một trong bảy chế độ ở slide 51–53</td></tr>
</table>
<ul>
<li><strong>M[4:0] là trường quan trọng nhất trên slide này.</strong> Năm bit đó <em>CHÍNH LÀ</em> chế độ. Đổi chúng thì ngân hàng thanh ghi của slide 53 đổi theo ngay dưới chân chương trình. Đó là lý do chế độ người dùng "không đổi chế độ được" — đơn giản vì nó không ghi được mấy bit thấp của CPSR.</li>
<li><strong>Hai dấu ngoặc trên hình chính là ranh giới bảo mật vẽ thành hình học.</strong> Mọi thứ bên trái (N Z C V Q, GE) là trạng thái chương trình bình thường mà mã người dùng được đọc và ghi. Mọi thứ bên phải (E, A, I, F, T, M) lái cỗ máy và là đặc quyền. Một thanh ghi, hai thế giới.</li>
<li><strong>I và F là bản ARM của cờ IF trên x86.</strong> Nhưng để ý ARM có tới <em>HAI</em> — IRQ và FIQ che được độc lập nhau, nên có thể để ngắt nhanh vẫn bật trong khi chặn ngắt thường. Đó là sơ đồ ưu tiên ngắt của ARM, và nó không cần bộ điều khiển ngoài nào để diễn đạt.</li>
<li><strong>N Z C V là nơi thực thi-có-điều-kiện ĐỌC VÀO.</strong> Trường điều kiện 4 bit của mọi lệnh ARM đều được đánh giá dựa đúng trên bốn bit này. Thuộc tính 7 của slide 49 — toàn bộ chiến lược chống rẽ nhánh — sống chết nhờ bốn bit ấy.</li>
<li><strong>Bit T cho thấy một cú chuyển chế độ nấp trong thanh ghi trạng thái.</strong> Bật T là đổi cách tầng nạp DIỄN GIẢI bộ nhớ: lệnh Thumb 16 bit thay cho lệnh ARM 32 bit. Một bit đơn lẻ làm đổi ý nghĩa của mọi byte phía sau — một quyết định thuộc tập lệnh (Ch.13) được diễn đạt thành trạng thái bộ xử lý.</li>
</ul>
<p class="pitfall">⚠️ Bẫy: CPSR và SPSR có <strong>CÙNG một khuôn dạng</strong> — vì thế hình mới đặt tên "Format of ARM CPSR <em>and</em> SPSR" mà chỉ vẽ một bức. Chúng khác nhau ở VAI TRÒ, không khác ở bố cục: CPSR là trạng thái đang sống, SPSR là bản sao đông cứng của CPSR tại khoảnh khắc ngoại lệ được nhận.</p>`],

      [55, 'Table 16.4 — ARM Interrupt Vector',
        `<p class="y-chinh">🎯 The ARM counterpart of the x86 table on slide 48, and notice how much smaller it is: <strong>seven exception types</strong>, each with its <strong>mode</strong>, its <strong>normal entry address</strong> and a description. The entry addresses are not indices into a table of pointers — they are <em>actual instruction addresses</em> the processor jumps to.</p>
<table>
<tr><th>Exception type</th><th>Mode</th><th>Normal entry address</th><th>Occurs when (slide's wording, condensed)</th></tr>
<tr><td>Reset</td><td>Supervisor</td><td><strong>0x00000000</strong></td><td>The system is initialized</td></tr>
<tr><td>Undefined instructions</td><td>Undefined</td><td><strong>0x00000004</strong></td><td>An instruction not in the instruction set reaches the execute stage of the pipeline</td></tr>
<tr><td>Software interrupt</td><td>Supervisor</td><td><strong>0x00000008</strong></td><td>Generally used to allow user mode programs to call the OS; the program executes SWI with an argument identifying the function wanted</td></tr>
<tr><td>Prefetch abort</td><td>Abort</td><td><strong>0x0000000C</strong></td><td>An attempt to fetch an instruction results in a memory fault; raised when the instruction enters the execute stage</td></tr>
<tr><td>Data abort</td><td>Abort</td><td><strong>0x00000010</strong></td><td>An invalid memory address has been accessed — no physical memory for the address, or the access permission is lacking</td></tr>
<tr><td>IRQ (interrupt)</td><td>IRQ</td><td><strong>0x00000018</strong></td><td>An external device asserts the IRQ pin; cannot be interrupted except by an FIQ</td></tr>
<tr><td>FIQ (fast interrupt)</td><td>FIQ</td><td><strong>0x0000001C</strong></td><td>An external device asserts the FIQ pin; has sufficient private registers to remove the need for register saving, minimizing context-switch overhead; a fast interrupt cannot be interrupted</td></tr>
</table>
<p class="dap-an">✅ Read the addresses as arithmetic and the design appears. They run <strong>0x00, 0x04, 0x08, 0x0C, 0x10, 0x14, 0x18, 0x1C</strong> — eight slots, <strong>4 bytes apart</strong>, which is exactly <em>one 32-bit instruction each</em> (attribute 3 of slide 49). So the vector table is not a table of addresses at all; it is a table of <strong>instructions</strong>, and each slot holds a single branch to the real handler. Note that <strong>0x00000014 is missing from the table</strong> — that slot is reserved (it once held Address Exception on the 26-bit ARM). And note <strong>FIQ sits last, at 0x1C</strong>: because it is at the very end of the vector area, the FIQ handler can be written <em>in place</em> starting at 0x1C with nothing after it to overwrite — saving even the one branch instruction the other six must execute.</p>
<ul>
<li><strong>That last point is the whole FIQ philosophy in one address.</strong> Seven banked registers (slide 53) so nothing must be saved, plus the last vector slot so not even a branch is needed. Every cycle of interrupt latency was designed out on purpose.</li>
<li><strong>"Prefetch abort ... raised when the instruction enters the execute stage" is a pipeline sentence.</strong> The fault happened at fetch, but it is not reported until the offending instruction actually reaches execute — because instructions after a branch get fetched speculatively and must be allowed to fail silently. This is precisely the wrong-path fetch of slide 29, and the rule that stops it from causing spurious exceptions.</li>
<li><strong>Software interrupt is the door in the wall of slide 51.</strong> User mode cannot change mode "other than by causing an exception" — SWI <em>is</em> that deliberate exception, and the argument encoded in it is the system-call number. Every Linux or Android system call on a 32-bit ARM went through this row.</li>
<li><strong>"An interrupt cannot be interrupted except by an FIQ" appears in the IRQ description and is a two-level priority scheme expressed in one sentence</strong> — implemented by the I and F bits of CPSR (slide 54), not by an external priority controller.</li>
</ul>
<p class="pitfall">⚠️ Trap: the addresses are <strong>where execution jumps to</strong>, not pointers stored in memory. x86's Table 16.3 gives you <em>vector numbers</em> that index a table of handler addresses; ARM gives you <em>the addresses themselves</em>. Confusing the two mechanisms is a favourite exam question.</p>`,
        `<p class="y-chinh">🎯 Bản đối ứng của ARM với bảng x86 ở slide 48, và hãy để ý nó NHỎ hơn nhiều: <strong>bảy loại ngoại lệ</strong>, mỗi loại kèm <strong>chế độ</strong>, <strong>địa chỉ vào chuẩn</strong> và mô tả. Các địa chỉ vào này KHÔNG phải chỉ số tra vào một bảng con trỏ — chúng là <em>ĐỊA CHỈ LỆNH THẬT</em> mà bộ xử lý nhảy tới.</p>
<table>
<tr><th>Loại ngoại lệ</th><th>Chế độ</th><th>Địa chỉ vào chuẩn</th><th>Xảy ra khi (chữ slide, rút gọn)</th></tr>
<tr><td>Reset</td><td>Supervisor</td><td><strong>0x00000000</strong></td><td>Hệ thống được khởi tạo</td></tr>
<tr><td>Undefined instructions</td><td>Undefined</td><td><strong>0x00000004</strong></td><td>Một lệnh không có trong tập lệnh đi tới tầng thực thi của pipeline</td></tr>
<tr><td>Software interrupt</td><td>Supervisor</td><td><strong>0x00000008</strong></td><td>Thường dùng để chương trình ở chế độ người dùng gọi vào hệ điều hành; chương trình chạy lệnh SWI kèm một đối số chỉ ra chức năng nó muốn</td></tr>
<tr><td>Prefetch abort</td><td>Abort</td><td><strong>0x0000000C</strong></td><td>Một lần nạp lệnh gặp lỗi bộ nhớ; ngoại lệ chỉ được dựng lên khi lệnh đó đi vào tầng thực thi</td></tr>
<tr><td>Data abort</td><td>Abort</td><td><strong>0x00000010</strong></td><td>Truy cập một địa chỉ bộ nhớ không hợp lệ — không có bộ nhớ vật lý cho địa chỉ đó, hoặc thiếu quyền truy cập</td></tr>
<tr><td>IRQ (ngắt)</td><td>IRQ</td><td><strong>0x00000018</strong></td><td>Thiết bị ngoài kéo chân IRQ; không thể bị gián đoạn, trừ bởi một FIQ</td></tr>
<tr><td>FIQ (ngắt nhanh)</td><td>FIQ</td><td><strong>0x0000001C</strong></td><td>Thiết bị ngoài kéo chân FIQ; có đủ thanh ghi riêng để khỏi phải cất thanh ghi, nhờ đó tối thiểu hoá chi phí chuyển ngữ cảnh; ngắt nhanh không thể bị gián đoạn</td></tr>
</table>
<p class="dap-an">✅ Đọc các địa chỉ như một phép tính thì thiết kế hiện ra. Chúng chạy <strong>0x00, 0x04, 0x08, 0x0C, 0x10, 0x14, 0x18, 0x1C</strong> — tám khe, cách nhau <strong>4 byte</strong>, tức đúng <em>MỖI KHE MỘT LỆNH 32 bit</em> (thuộc tính 3 của slide 49). Vậy bảng vector này hoàn toàn không phải bảng địa chỉ; nó là một bảng <strong>LỆNH</strong>, mỗi khe chứa một lệnh nhảy tới trình xử lý thật. Để ý <strong>0x00000014 KHÔNG có trong bảng</strong> — khe đó được để dành (xưa nó giữ Address Exception trên ARM 26 bit). Và để ý <strong>FIQ nằm CUỐI CÙNG, ở 0x1C</strong>: vì nó nằm ở tận cuối vùng vector nên trình xử lý FIQ viết được <em>NGAY TẠI CHỖ</em> bắt đầu từ 0x1C mà không có gì phía sau để ghi đè lên — tiết kiệm luôn cả cái lệnh nhảy mà sáu khe kia phải chạy.</p>
<ul>
<li><strong>Ý cuối đó chính là toàn bộ triết lý FIQ gói trong một địa chỉ.</strong> Bảy thanh ghi nhân bản (slide 53) nên không phải cất gì, cộng với khe vector cuối cùng nên không cần cả một lệnh nhảy. Từng chu kỳ độ trễ ngắt đều bị thiết kế cho biến mất một cách CÓ CHỦ Ý.</li>
<li><strong>Câu "Prefetch abort ... chỉ dựng lên khi lệnh đi vào tầng thực thi" là một câu về PIPELINE.</strong> Lỗi xảy ra ở khâu nạp, nhưng không được báo cho tới khi chính lệnh phạm lỗi thật sự tới tầng thực thi — vì các lệnh sau một nhánh bị nạp theo phỏng đoán và phải được phép thất bại trong im lặng. Đây đúng là chuyện nạp-nhầm-đường của slide 29, và là quy tắc chặn không cho nó đẻ ra ngoại lệ giả.</li>
<li><strong>Software interrupt là CÁNH CỬA trên bức tường của slide 51.</strong> Chế độ người dùng không đổi chế độ được "trừ phi gây ra một ngoại lệ" — SWI <em>CHÍNH LÀ</em> cái ngoại lệ cố ý ấy, và đối số mã hoá trong nó là số hiệu lời gọi hệ thống. Mọi lời gọi hệ thống của Linux hay Android trên ARM 32 bit đều đi qua đúng hàng này.</li>
<li><strong>Câu "một ngắt không thể bị gián đoạn, trừ bởi một FIQ" nằm trong mô tả IRQ và là một sơ đồ ưu tiên hai mức diễn đạt trong một câu</strong> — được cài đặt bằng hai bit I và F của CPSR (slide 54), chứ không phải bằng một bộ điều khiển ưu tiên bên ngoài.</li>
</ul>
<p class="pitfall">⚠️ Bẫy: các địa chỉ này là <strong>NƠI ĐỂ NHẢY TỚI</strong>, không phải con trỏ cất trong bộ nhớ. Table 16.3 của x86 cho bạn <em>SỐ VECTOR</em> để tra vào một bảng chứa địa chỉ trình xử lý; ARM cho bạn <em>CHÍNH ĐỊA CHỈ ĐÓ</em>. Lẫn lộn hai cơ chế này là câu hỏi thi ưa thích.</p>`],

      [56, 'Summary — Chapter 16: Processor Structure and Function',
        `<p class="y-chinh">🎯 The closing map of the whole chapter. Left column: <strong>Processor organization · Register organization</strong> (user-visible registers, control and status registers) <strong>· Instruction cycle</strong> (the indirect cycle, data flow) <strong>· The x86 processor family</strong> (register organization, interrupt processing). Right column: <strong>Instruction pipelining</strong> (pipelining strategy, pipeline performance, pipeline hazards, dealing with branches, Intel 80486 pipelining) <strong>· The Arm processor</strong> (processor organization, processor modes, register organization, interrupt processing).</p>
<table>
<tr><th>Summary line</th><th>Slides</th><th>The one thing to take from it</th></tr>
<tr><td>Processor organization</td><td>2–3</td><td>Fetch · interpret · fetch data · process · write, plus a small internal memory</td></tr>
<tr><td>Register organization</td><td>4–9</td><td>User-visible vs control/status; PC, IR, MAR, MBR are the four essential ones</td></tr>
<tr><td>Instruction cycle</td><td>10–15</td><td>The state diagram, the indirect cycle, and the three data-flow figures</td></tr>
<tr><td>Instruction pipelining</td><td>16–24</td><td>Six stages; speedup is bounded by the slowest stage and by branches</td></tr>
<tr><td>Pipeline hazards</td><td>25–28</td><td>Resource · data (RAW, WAR, WAW) · control</td></tr>
<tr><td><strong>Dealing with branches</strong></td><td><strong>29–37</strong></td><td><strong>Five techniques; only prediction scales, and 2 bits beat 1 bit on loops</strong></td></tr>
<tr><td>Intel 80486 pipelining</td><td>38–42</td><td>Five stages, plus the reservation-station preview of superscalar</td></tr>
<tr><td>The x86 processor family</td><td>43–48</td><td>Registers, EFLAGS, control registers, MMX aliasing, the 256-entry vector table</td></tr>
<tr><td>The Arm processor</td><td>49–55</td><td>RISC attributes, seven modes, banked registers, CPSR, eight 4-byte vector slots</td></tr>
</table>
<ul>
<li><strong>The chapter has exactly one argument, and it is worth stating plainly.</strong> A processor goes faster by overlapping instructions; overlapping instructions creates hazards; the most expensive hazard is the branch; therefore an enormous amount of a modern CPU exists to guess branches correctly. Everything from slide 16 to slide 37 is that sentence unfolded.</li>
<li><strong>The two case studies are not decoration — they are the two answers.</strong> x86 answers "how do we keep a 1978 instruction set fast?" with deep pipelines, split decode and prediction. ARM answers "how do we avoid the problem?" with fixed-length instructions and conditional execution. Read slide 43–48 against 49–55 as a debate, and Ch.15 on the web (cea17) is the judgement.</li>
<li><strong>What to revise first if time is short.</strong> (1) The 2-bit state machine of Figure 16.19 and a hand trace. (2) CPI = 1 + f × (1 − accuracy) × (k − 1). (3) The three hazard types with one example each. (4) The 80486 timing diagrams of Figure 16.21. Those four carry most of the marks.</li>
<li><strong>Where the course goes next.</strong> Ch.13/14 on the web (cea17, cea18) take the reservation station of slide 41 and build a superscalar processor on it, where a misprediction wastes not k − 1 <em>cycles</em> but k − 1 cycles × the issue width. Every number in slide 29's table gets multiplied. Ch.17/18 (cea20, cea21) then go parallel across whole cores.</li>
<li><strong>And the one link back to programming.</strong> The 10× measurement on slide 29 was not a curiosity: unpredictable data-dependent branches are one of the few places where a PRF192-level change to your code (sort first, or restructure the condition) changes the runtime by an order of magnitude. That is this chapter paying rent.</li>
</ul>
<p class="meo">💡 If you remember one sentence from the whole of Chapter 12/16: <strong>"A pipeline is a promise of one instruction per cycle, and a branch is the thing that breaks the promise."</strong></p>`,
        `<p class="y-chinh">🎯 Tấm bản đồ khép lại cả chương. Cột trái: <strong>Tổ chức bộ xử lý · Tổ chức thanh ghi</strong> (thanh ghi người dùng thấy được, thanh ghi điều khiển và trạng thái) <strong>· Chu kỳ lệnh</strong> (chu kỳ gián tiếp, luồng dữ liệu) <strong>· Họ bộ xử lý x86</strong> (tổ chức thanh ghi, xử lý ngắt). Cột phải: <strong>Pipeline lệnh</strong> (chiến lược, hiệu năng, hiểm hoạ, xử lý rẽ nhánh, pipeline Intel 80486) <strong>· Bộ xử lý Arm</strong> (tổ chức, chế độ, tổ chức thanh ghi, xử lý ngắt).</p>
<table>
<tr><th>Dòng trong tóm tắt</th><th>Slide</th><th>Điều duy nhất cần mang đi</th></tr>
<tr><td>Tổ chức bộ xử lý</td><td>2–3</td><td>Nạp · diễn giải · lấy dữ liệu · xử lý · ghi, cộng một bộ nhớ trong nhỏ</td></tr>
<tr><td>Tổ chức thanh ghi</td><td>4–9</td><td>Người dùng thấy được so với điều khiển/trạng thái; PC, IR, MAR, MBR là bốn cái thiết yếu</td></tr>
<tr><td>Chu kỳ lệnh</td><td>10–15</td><td>Sơ đồ trạng thái, chu kỳ gián tiếp, và ba hình luồng dữ liệu</td></tr>
<tr><td>Pipeline lệnh</td><td>16–24</td><td>Sáu tầng; tăng tốc bị chặn bởi tầng chậm nhất và bởi rẽ nhánh</td></tr>
<tr><td>Hiểm hoạ pipeline</td><td>25–28</td><td>Tài nguyên · dữ liệu (RAW, WAR, WAW) · điều khiển</td></tr>
<tr><td><strong>Xử lý rẽ nhánh</strong></td><td><strong>29–37</strong></td><td><strong>Năm kỹ thuật; chỉ dự đoán là mở rộng được, và 2 bit thắng 1 bit trên vòng lặp</strong></td></tr>
<tr><td>Pipeline Intel 80486</td><td>38–42</td><td>Năm tầng, cộng bản xem trước superscalar bằng trạm đặt chỗ</td></tr>
<tr><td>Họ bộ xử lý x86</td><td>43–48</td><td>Thanh ghi, EFLAGS, thanh ghi điều khiển, MMX chồng lấn, bảng vector 256 mục</td></tr>
<tr><td>Bộ xử lý Arm</td><td>49–55</td><td>Thuộc tính RISC, bảy chế độ, thanh ghi nhân bản, CPSR, tám khe vector 4 byte</td></tr>
</table>
<ul>
<li><strong>Cả chương chỉ có ĐÚNG MỘT lập luận, và nên nói thẳng ra.</strong> Bộ xử lý chạy nhanh hơn nhờ chồng lấn các lệnh; chồng lấn sinh ra hiểm hoạ; hiểm hoạ đắt nhất là rẽ nhánh; do đó một phần khổng lồ của một CPU hiện đại tồn tại chỉ để ĐOÁN ĐÚNG các lệnh rẽ nhánh. Mọi thứ từ slide 16 tới slide 37 là câu đó trải ra.</li>
<li><strong>Hai ca nghiên cứu không phải trang trí — chúng là HAI LỜI ĐÁP.</strong> x86 trả lời câu "làm sao giữ cho một tập lệnh từ 1978 vẫn nhanh?" bằng ống sâu, giải mã tách tầng và dự đoán. ARM trả lời câu "làm sao TRÁNH hẳn vấn đề đó?" bằng lệnh dài cố định và thực thi có điều kiện. Hãy đọc slide 43–48 đối chiếu với 49–55 như một cuộc tranh luận, và Chương 15 trên web (cea17) là lời phân xử.</li>
<li><strong>Ôn cái gì trước nếu ít thời gian.</strong> (1) Máy trạng thái 2 bit của Figure 16.19 và một lượt chạy tay. (2) CPI = 1 + f × (1 − độ chính xác) × (k − 1). (3) Ba loại hiểm hoạ, mỗi loại một ví dụ. (4) Ba giản đồ thời gian 80486 của Figure 16.21. Bốn thứ đó gánh phần lớn số điểm.</li>
<li><strong>Môn học đi tiếp về đâu.</strong> Chương 13/14 trên web (cea17, cea18) lấy cái trạm đặt chỗ của slide 41 và dựng lên một bộ xử lý superscalar, nơi một lần đoán sai phí không phải k − 1 <em>chu kỳ</em> mà là k − 1 chu kỳ × độ rộng phát lệnh. Mọi con số trong bảng của slide 29 đều bị nhân lên. Rồi Ch.17/18 (cea20, cea21) mở ra song song trên nhiều lõi.</li>
<li><strong>Và mối nối duy nhất trở về chuyện lập trình.</strong> Phép đo 10× ở slide 29 không phải chuyện lạ cho vui: nhánh phụ thuộc dữ liệu mà không đoán được là một trong số RẤT ÍT chỗ mà một thay đổi ở tầm PRF192 trong mã của bạn (sắp xếp trước, hoặc viết lại điều kiện) làm thời gian chạy đổi cả một bậc độ lớn. Đó là lúc chương này trả tiền thuê nhà.</li>
</ul>
<p class="meo">💡 Nếu chỉ nhớ được một câu từ toàn bộ Chương 12/16: <strong>"Pipeline là một lời hứa mỗi chu kỳ một lệnh, và rẽ nhánh là thứ làm gãy lời hứa đó."</strong></p>`],

    ]),
  ].join('\n'),
};
