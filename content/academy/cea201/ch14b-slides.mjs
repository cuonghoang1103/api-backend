/**
 * CEA201 · Chương 14 trên web (= Chapter 18 bản 11e, syllabus 9th ed gọi là
 * "Chapter 16") — Instruction-Level Parallelism and Superscalar Processors,
 * học theo từng slide, PHẦN B: slide 21–40 của deck 'cea18' (tổng 40 slide).
 *
 * Nội dung bám ĐÚNG chữ trích từ CH18-COA11e.pptx (/tmp/cea201-text/cea18.txt).
 * Slide chỉ có tiêu đề + hình (22, 25, 27, 28, 31, 37, 38, 39) đã ĐỌC THẲNG TỪ
 * ẢNH render (/tmp/cea201-slides/cea18/NNN.webp) để lấy đúng từng nhãn khối.
 *
 * ⚠️ MỌI giản đồ phát lệnh và MỌI số chu kỳ trong bài đã kiểm bằng python3
 * TRƯỚC khi viết lời giảng (scratchpad sim.py + arm.py):
 *   · Ví dụ ĐỔI TÊN THANH GHI của slide 26 — 6 lệnh dùng lại R1 ba lần (3 cặp
 *     WAW + 2 cặp WAR + 3 cặp RAW). Bộ lập lịch superscalar (phát không theo
 *     thứ tự, RAW = issue+lat, WAR/WAW = issue+1, load lat 2, ALU lat 1):
 *       W=2 chưa đổi tên: phát ở chu kỳ 1·3·4·6·7·9  → 9 chu kỳ
 *       W=2 đã  đổi tên: phát ở chu kỳ 1·3·1·3·2·4  → 4 chu kỳ (tiết kiệm 5, 2,25×)
 *       W=4 chưa đổi tên: VẪN 9 chu kỳ (nới rộng máy KHÔNG mua được gì)
 *       W=4 đã  đổi tên: 3 chu kỳ (3,00×)
 *   · Cortex-A8: 2 (F1,F2) + 5 (D0–D4) + 6 (E0–E5) = 13 tầng, khớp nhãn
 *     "13-stage integer pipeline" trên Figure 18.10. NEON: 3 + 1 + 6 = 10 tầng,
 *     khớp nhãn "10-stage SIMD pipeline".
 *   · Intel Core: 128 thanh ghi vật lý ÷ 16 thanh ghi kiến trúc = 8 bản sao;
 *     126 micro-op trong ROB ÷ 3 micro-op mỗi chu kỳ ở allocator ≈ 42 chu kỳ
 *     công việc đang bay; 48 load + 24 store = 72 mục đệm bộ nhớ.
 *   · Table 18.5 (slide 36): 21 lệnh trong 19 chu kỳ → IPC = 1,105. Dual-issue
 *     ở chu kỳ 1·2·3·6·9; các chu kỳ 10·11·16 KHÔNG phát lệnh mới nào. Ba mốc
 *     9→12, 15→17, 4→5 và 7→8 đều tự tính lại khớp với chú thích của slide.
 *
 * Chỗ slide gốc CẦN NÓI RÕ — nêu thẳng, không im lặng chép, không tự sửa slide:
 *   · Slide 29 đánh nhãn ba tầng nạp lệnh là "F0 / F1 / F3", trong khi
 *     Figure 18.11 (slide 28) vẽ rõ ràng "F0 F1 F2". Bản trích không sai — chữ
 *     trên slide đúng là F3. Đây là lỗi đánh máy của chính bộ slide; sách in F2.
 *   · Slide 26 tên là "Register Renaming (2 of 2)" nhưng KHÔNG có một ví dụ đổi
 *     tên nào; nó chỉ nêu "16 kiến trúc → 128 vật lý" rồi chuyển sang lập lịch
 *     micro-op. Ví dụ WAR/WAW đầy đủ trong bài này là do bài dựng, đã nói rõ.
 *   · Slide 25 (ROB) nói "The address of the Pentium instruction that generated
 *     the micro-op" — chữ "Pentium" là di sản của bản sách cũ; hình đang mô tả
 *     Intel Core, không phải Pentium.
 *   · Toàn deck KHÔNG có slide nào nói chữ "speculative execution" ở dạng định
 *     nghĩa, cũng KHÔNG có slide nào nói "commit/retire in order" thành câu.
 *     Slide 21 nói "begin executing instructions long before the branch outcome
 *     is decided", slide 25 nói trạng thái "ready for retirement", slide 29 nói
 *     "Speculative (there is no guarantee that they are executed)". Bài này
 *     ghép ba mảnh đó lại và nói rõ chỗ nào là slide, chỗ nào là sách.
 *   · KHÔNG slide nào nhắc Spectre/Meltdown (deck 2022 vẫn im). Phần bảo mật
 *     trong bài là phần MỞ RỘNG, đã ghi nhãn, và chỉ ở mức khái niệm.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea18';

export default {
  title: '14.0b — Slide by slide: The Intel Core front end, reorder buffer, register renaming and the ARM Cortex-A8/M3 pipelines (slides 21–40)|||14.0b — Slide bài giảng: Front end của Intel Core, bộ đệm sắp xếp lại, đổi tên thanh ghi & đường ống ARM Cortex-A8/M3 (slide 21–40)',
  slug: 'cea201-14-0b-slides-intel-core-va-arm-cortex',
  type: 'DOCUMENT',
  description: 'Nửa sau Chương 18 bản 11e (slide 21–40) — phần biến lý thuyết superscalar thành hai con chip thật. Nửa Intel Core: khối dự đoán rẽ nhánh và BTB, nạp/tiền giải mã 16 byte, giải mã một lệnh x86 thành 1–4 micro-op rộng 118 bit, khối thực thi không theo thứ tự với bộ đệm sắp xếp lại 126 mục, và đổi tên 16 thanh ghi kiến trúc thành 128 thanh ghi vật lý — có ví dụ WAR/WAW giải trọn bằng máy, 9 chu kỳ xuống 4. Nửa ARM: Cortex-A8 phát đôi THEO THỨ TỰ 13 tầng (không đổi tên thanh ghi), bảng sự kiện replay, sáu luật cấm phát đôi, và một dãy 21 lệnh chạy tay từng chu kỳ; kết bằng Cortex-M3 ba tầng. Kèm hai phần mở rộng có ghi nhãn: thực thi suy đoán đẻ ra Spectre/Meltdown ra sao, và vì sao ILP đụng trần khiến cả ngành quay sang đa lõi.',
  content: [
    walkHead(D, 21, 40),
    walk(D, [

      [21, 'Branch Prediction Unit (Intel Core front end)',
        `<p class="y-chinh">🎯 The first block of the Intel Core front end. Its job is to help the instruction fetch unit fetch <strong>the most likely instruction to be executed</strong>, by predicting the branch before anyone knows the answer — and one line on this slide is the whole justification for the rest of the chapter: it <strong>enables the processor to begin executing instructions long before the branch outcome is decided</strong>.</p>
<table>
<tr><th>Branch type the slide names</th><th>What is hard about it</th><th>What has to be predicted</th></tr>
<tr><td><strong>Conditional</strong></td><td>The condition is not known yet</td><td>TAKEN or NOT TAKEN (direction)</td></tr>
<tr><td><strong>Indirect</strong></td><td>The target sits in a register — it can differ every time</td><td>The target ADDRESS</td></tr>
<tr><td><strong>Direct</strong></td><td>Easy: target is encoded in the instruction</td><td>Only that it is a branch, early enough to matter</td></tr>
<tr><td><strong>Call</strong></td><td>Pushes a return address</td><td>Target, plus remembering where to come back to</td></tr>
<tr><td><strong>Return</strong></td><td>Target depends on <em>who called</em> — different every call site</td><td>The return address, from a hardware return stack</td></tr>
</table>
<ul>
<li><strong>"Uses dedicated hardware for each branch type" is the point of the list.</strong> One general predictor would be bad at all five. A return is trivially predictable if you keep a small stack of return addresses, and nearly unpredictable otherwise. An indirect jump through a function-pointer table needs a target cache, not a direction bit. Real silicon spends five different structures here.</li>
<li><strong>The BTB is a cache, and you already know how caches work.</strong> The slide says a <strong>branch target buffer</strong> caches information about <em>recently encountered</em> branch instructions. That word "recently" is the principle of locality from Chương 4 applied to control flow: branches that just executed will execute again. Indexed by the branch's address, it returns the target — so the fetch unit can redirect itself in the <em>same</em> cycle it fetches the branch.</li>
<li><strong>Two different predictions, do not merge them.</strong> Direction ("will it be taken?") and target ("where to?"). A conditional branch needs both; an unconditional indirect jump needs only the target. Chương 12 (cấu trúc bộ xử lý) gave you the direction predictors — the 2-bit saturating counter and the history table; this slide is where they get plugged into a superscalar front end.</li>
<li><strong>Why a superscalar needs this more than a scalar machine does.</strong> Statistically one instruction in five or six is a branch. A 4-wide machine therefore meets a branch almost every cycle. If it stopped at each one, its four pipelines would be empty most of the time — the <em>procedural dependency</em> of slide 7 would eat the entire benefit. Prediction is not an optimisation here; it is what makes superscalar possible at all.</li>
<li><strong>The word "begin executing" is doing enormous work.</strong> Not "begin fetching" — <em>executing</em>. The processor runs real instructions whose right to exist has not been established. Slide 25 (the reorder buffer) is the machinery that makes that safe, and it is also, thirty years later, the machinery that leaked (see slide 25's security note).</li>
</ul>
<p class="meo">💡 Remember the five types as a staircase of difficulty: <strong>direct (address is printed on the instruction) → conditional (need a direction bit) → call (need a push) → return (need a stack) → indirect (need a whole target cache)</strong>. Predictability falls as you go down.</p>
<p class="pitfall">⚠️ Exam trap: "the BTB predicts whether a branch is taken." It caches the <strong>target</strong> of recently seen branches; direction comes from the predictor tables. A question that mixes the two is testing exactly this distinction.</p>`,
        `<p class="y-chinh">🎯 Khối đầu tiên của front end Intel Core. Việc của nó là giúp khối nạp lệnh nạp về <strong>lệnh KHẢ NĂNG CAO NHẤT sẽ được chạy</strong>, bằng cách đoán rẽ nhánh trước khi có ai biết đáp án — và một dòng trên slide này là toàn bộ biện minh cho phần còn lại của chương: nó <strong>cho phép bộ xử lý BẮT ĐẦU THỰC THI lệnh từ rất lâu trước khi kết quả rẽ nhánh được quyết định</strong>.</p>
<table>
<tr><th>Loại rẽ nhánh slide kể</th><th>Chỗ khó của nó</th><th>Phải đoán cái gì</th></tr>
<tr><td><strong>Conditional</strong> — có điều kiện</td><td>Điều kiện chưa tính xong</td><td>NHẢY hay KHÔNG NHẢY (hướng)</td></tr>
<tr><td><strong>Indirect</strong> — gián tiếp</td><td>Đích nằm trong thanh ghi, mỗi lần một khác</td><td>ĐỊA CHỈ đích</td></tr>
<tr><td><strong>Direct</strong> — trực tiếp</td><td>Dễ: đích mã hoá sẵn trong lệnh</td><td>Chỉ cần biết "đây là rẽ nhánh" đủ sớm</td></tr>
<tr><td><strong>Call</strong> — gọi hàm</td><td>Phải đẩy địa chỉ trở về</td><td>Đích, và nhớ chỗ để quay lại</td></tr>
<tr><td><strong>Return</strong> — trở về</td><td>Đích phụ thuộc <em>AI GỌI</em> — mỗi chỗ gọi một khác</td><td>Địa chỉ trở về, lấy từ ngăn xếp phần cứng</td></tr>
</table>
<ul>
<li><strong>Câu "dùng phần cứng RIÊNG cho từng loại rẽ nhánh" mới là ý của cái danh sách.</strong> Một bộ đoán chung sẽ dở đều cả năm loại. Lệnh <em>return</em> dễ đoán như bỡn NẾU giữ một ngăn xếp nhỏ chứa địa chỉ trở về, còn không thì gần như không đoán nổi. Lệnh nhảy gián tiếp qua bảng con trỏ hàm cần một cái cache ĐÍCH chứ không phải một bit hướng. Chip thật tiêu tốn NĂM cấu trúc khác nhau ở đây.</li>
<li><strong>BTB là một cái cache, mà cache thì bạn biết rồi.</strong> Slide ghi <strong>branch target buffer</strong> lưu đệm thông tin về những lệnh rẽ nhánh <em>GẶP GẦN ĐÂY</em>. Chữ "gần đây" chính là nguyên lý cục bộ của Chương 4 áp lên luồng điều khiển: nhánh vừa chạy thì sẽ chạy lại. Tra theo địa chỉ của chính lệnh rẽ nhánh, nó trả về đích — nên khối nạp tự bẻ lái được ngay trong <em>CHÍNH</em> chu kỳ nạp lệnh rẽ nhánh đó.</li>
<li><strong>HAI phép đoán khác nhau, đừng gộp.</strong> Hướng ("có nhảy không?") và đích ("nhảy đi đâu?"). Rẽ nhánh có điều kiện cần CẢ HAI; lệnh nhảy gián tiếp vô điều kiện chỉ cần đích. Chương 12 (cấu trúc bộ xử lý) đã cho bạn các bộ đoán hướng — bộ đếm bão hoà 2 bit và bảng lịch sử; slide này là chỗ chúng được cắm vào một front end superscalar.</li>
<li><strong>Vì sao superscalar cần thứ này hơn máy thường.</strong> Thống kê cho thấy cứ năm sáu lệnh thì có một lệnh rẽ nhánh. Máy rộng 4 vì thế gặp rẽ nhánh gần như MỖI CHU KỲ. Nếu nó dừng lại ở từng cái, bốn đường ống sẽ rỗng phần lớn thời gian — <em>phụ thuộc thủ tục</em> ở slide 7 sẽ nuốt sạch lợi ích. Ở đây dự đoán KHÔNG phải một tối ưu hoá; nó là thứ làm superscalar tồn tại được.</li>
<li><strong>Chữ "BẮT ĐẦU THỰC THI" gánh một khối lượng khổng lồ.</strong> Không phải "bắt đầu nạp" — mà là <em>THỰC THI</em>. Bộ xử lý chạy những lệnh thật mà quyền tồn tại của chúng chưa được xác lập. Slide 25 (bộ đệm sắp xếp lại) là bộ máy làm cho điều đó AN TOÀN, và ba mươi năm sau, cũng chính bộ máy đó là thứ bị rò (xem phần bảo mật ở slide 25).</li>
</ul>
<p class="meo">💡 Nhớ năm loại như một cầu thang độ khó: <strong>direct (đích in sẵn trên lệnh) → conditional (cần một bit hướng) → call (cần một lần đẩy) → return (cần một ngăn xếp) → indirect (cần hẳn một cache đích)</strong>. Càng xuống càng khó đoán.</p>
<p class="pitfall">⚠️ Bẫy đề thi: "BTB dự đoán một nhánh có được nhảy hay không". SAI — nó lưu <strong>ĐÍCH</strong> của những nhánh vừa gặp; HƯỚNG do các bảng dự đoán quyết định. Câu nào trộn hai thứ đó là đang kiểm đúng chỗ phân biệt này.</p>`],

      [22, 'Instruction Fetch and Predecode Unit — what it comprises and what predecode does',
        `<p class="y-chinh">🎯 The second front-end block, and it exists almost entirely because <strong>x86 instructions have no fixed length</strong>. Before you can decode four instructions in parallel you must first answer a question a RISC machine never asks: <em>where does each instruction start?</em></p>
<table>
<tr><th>The unit comprises (slide)</th><th>Its job</th></tr>
<tr><td><strong>Instruction translation lookaside buffer (ITLB)</strong></td><td>Turns the virtual instruction address into a physical one, fast — the instruction-side twin of the TLB from Chương 8</td></tr>
<tr><td><strong>An instruction prefetcher</strong></td><td>Pulls lines into the I-cache before they are asked for</td></tr>
<tr><td><strong>The instruction cache</strong></td><td>The L1 I-cache — separate from the D-cache, exactly as Chương 4 predicted</td></tr>
<tr><td><strong>The predecode logic</strong></td><td>The block below: finds instruction boundaries</td></tr>
</table>
<ul>
<li><strong>Predecode works on sixteen bytes at a time.</strong> The slide: the predecode unit <em>accepts the sixteen bytes from the instruction cache or prefetch buffers</em>. Sixteen bytes, not sixteen instructions — an x86 instruction is 1 to 15 bytes long, so a 16-byte block might hold one instruction or a dozen.</li>
<li><strong>Three tasks, in order of difficulty.</strong> (1) <em>Determine the length of the instructions</em> — the hard one, because length depends on prefixes, the opcode, the ModRM byte and the addressing mode. (2) <em>Decode all prefixes associated with instructions</em>. (3) <em>Mark various properties of instruction for the decoders</em> — flags on each byte saying "an instruction starts here", "this is an opcode byte", so the four parallel decoders downstream can grab their instruction without re-parsing.</li>
<li><strong>The rate limit: up to six instructions per cycle into the instruction queue.</strong> If a fetch contains more than six instructions, the predecoder <em>continues to decode up to six per cycle until all instructions in the fetch are written to the instruction queue</em>. And the sting in the tail: <strong>subsequent fetches can only enter predecoding after the current fetch completes</strong> — the predecoder is not pipelined across fetch blocks.</li>
<li><strong>Do the arithmetic and the trap appears.</strong> Average x86 instruction length in real code is roughly 3 bytes, so a 16-byte block usually holds about 5 instructions — under the limit of six, one cycle, fine. But a block of very short instructions (1-byte <code>push</code>, <code>inc</code>, <code>nop</code>) can hold up to 16, needing <strong>ceil(16 ÷ 6) = 3 cycles</strong>, and nothing else may start predecoding during them. Dense short-instruction code can throttle a 4-wide machine at its very first stage.</li>
<li><strong>The RISC contrast is the exam-worthy sentence.</strong> On ARM (Chương 13) every instruction is exactly 4 bytes, so instruction boundaries are free: byte 0, 4, 8, 12. There is no predecode unit because there is nothing to predecode. The x86 pays this whole block as rent on backward compatibility — and slide 23 shows it pays a second time, translating to micro-ops.</li>
</ul>
<p class="meo">💡 Picture a line of text with no spaces: <code>ADDR1R2SUBR3R4MOVR5R6</code>. Predecode is the stage that inserts the spaces. RISC ships the text with the spaces already in it.</p>
<p class="pitfall">⚠️ Careful: the ITLB is listed inside the <em>fetch</em> unit, not the memory unit. Instruction addresses and data addresses are translated by <strong>two different TLBs</strong> — the same split-by-purpose logic that gives you a split L1 cache.</p>`,
        `<p class="y-chinh">🎯 Khối front end thứ hai, và nó tồn tại gần như hoàn toàn vì <strong>lệnh x86 KHÔNG có độ dài cố định</strong>. Trước khi giải mã song song bốn lệnh, bạn phải trả lời một câu mà máy RISC không bao giờ phải hỏi: <em>mỗi lệnh BẮT ĐẦU ở đâu?</em></p>
<table>
<tr><th>Khối gồm những gì (theo slide)</th><th>Việc của nó</th></tr>
<tr><td><strong>Instruction translation lookaside buffer (ITLB)</strong></td><td>Dịch địa chỉ ảo của LỆNH sang địa chỉ vật lý, thật nhanh — bản song sinh phía lệnh của TLB trong Chương 8</td></tr>
<tr><td><strong>Bộ nạp trước lệnh (instruction prefetcher)</strong></td><td>Kéo sẵn các dòng vào I-cache trước khi có ai hỏi</td></tr>
<tr><td><strong>Bộ nhớ đệm lệnh (instruction cache)</strong></td><td>L1 I-cache — TÁCH RIÊNG khỏi D-cache, đúng như Chương 4 đã đoán</td></tr>
<tr><td><strong>Logic tiền giải mã (predecode)</strong></td><td>Khối bên dưới: tìm ranh giới giữa các lệnh</td></tr>
</table>
<ul>
<li><strong>Tiền giải mã làm việc trên MƯỜI SÁU BYTE mỗi lượt.</strong> Slide ghi: khối predecode <em>nhận mười sáu byte từ bộ nhớ đệm lệnh hoặc từ các đệm nạp trước</em>. Mười sáu BYTE chứ không phải mười sáu LỆNH — một lệnh x86 dài từ 1 tới 15 byte, nên một khối 16 byte có thể chứa một lệnh, cũng có thể chứa cả chục.</li>
<li><strong>Ba việc, xếp theo độ khó.</strong> (1) <em>Xác định ĐỘ DÀI của các lệnh</em> — việc khó nhất, vì độ dài phụ thuộc tiền tố, mã lệnh, byte ModRM và chế độ địa chỉ. (2) <em>Giải mã mọi tiền tố đi kèm lệnh</em>. (3) <em>Đánh dấu các thuộc tính của lệnh cho các bộ giải mã</em> — gắn cờ lên từng byte kiểu "một lệnh bắt đầu ở đây", "đây là byte opcode", để bốn bộ giải mã song song phía sau chộp đúng lệnh của mình mà không phải phân tích lại.</li>
<li><strong>Trần tốc độ: tối đa SÁU lệnh mỗi chu kỳ vào hàng đợi lệnh.</strong> Nếu một lượt nạp chứa hơn sáu lệnh, bộ tiền giải mã <em>tiếp tục giải mã tối đa sáu lệnh mỗi chu kỳ cho tới khi mọi lệnh trong lượt nạp đó được ghi vào hàng đợi</em>. Và cái đuôi có nọc: <strong>các lượt nạp sau CHỈ được vào tiền giải mã sau khi lượt hiện tại xong</strong> — khối này KHÔNG chạy gối đầu giữa các khối nạp.</li>
<li><strong>Làm phép tính là cái bẫy hiện ra.</strong> Độ dài lệnh x86 trung bình trong mã thật khoảng 3 byte, nên một khối 16 byte thường chứa chừng 5 lệnh — dưới trần sáu, một chu kỳ, êm. Nhưng một khối toàn lệnh ngắn (<code>push</code>, <code>inc</code>, <code>nop</code> 1 byte) có thể chứa tới 16 lệnh, cần <strong>trần(16 ÷ 6) = 3 chu kỳ</strong>, và trong ba chu kỳ đó không lượt nạp nào khác được vào. Mã dày đặc lệnh ngắn có thể bóp nghẹt một máy rộng 4 ngay từ tầng đầu tiên.</li>
<li><strong>Câu đối chiếu với RISC mới là câu đáng thi.</strong> Trên ARM (Chương 13) mọi lệnh đúng 4 byte, nên ranh giới lệnh là MIỄN PHÍ: byte 0, 4, 8, 12. Không có khối tiền giải mã vì chẳng có gì để tiền giải mã. x86 trả nguyên khối này như tiền thuê cho tính tương thích ngược — và slide 23 cho thấy nó còn trả LẦN NỮA, để dịch sang micro-op.</li>
</ul>
<p class="meo">💡 Hình dung một dòng chữ không có dấu cách: <code>ADDR1R2SUBR3R4MOVR5R6</code>. Tiền giải mã là tầng đi CHÈN DẤU CÁCH vào. RISC thì giao hàng với dấu cách sẵn có trong đó rồi.</p>
<p class="pitfall">⚠️ Để ý: ITLB nằm TRONG khối <em>NẠP LỆNH</em>, không nằm trong khối bộ nhớ. Địa chỉ lệnh và địa chỉ dữ liệu được dịch bằng <strong>HAI TLB khác nhau</strong> — cùng một logic tách-theo-mục-đích đã sinh ra L1 tách đôi.</p>`],

      [23, 'Instruction Queue and Decode Unit — from one x86 instruction to one to four 118-bit micro-ops',
        `<p class="y-chinh">🎯 This is the slide where a CISC machine turns into a RISC machine inside its own skin. The decoder <strong>translates each machine instruction from one to four micro-ops, each of which is a 118-bit RISC instruction</strong>. Everything after this point in the pipeline has never heard of x86.</p>
<table>
<tr><th>Stage on the slide</th><th>What happens</th></tr>
<tr><td>Fetched instructions are placed in an <strong>instruction queue</strong></td><td>A buffer that decouples fetch rate from decode rate — fetch can run ahead during a decode stall</td></tr>
<tr><td>The <strong>decode unit scans the bytes</strong> to determine instruction boundaries</td><td>Using the marks predecode left (slide 22)</td></tr>
<tr><td>Translate to <strong>1 to 4 micro-ops</strong>, each a <strong>118-bit RISC instruction</strong></td><td>The common case: simple x86 instructions become one or a few uniform internal operations</td></tr>
<tr><td>Instructions needing <strong>more than four</strong> go to <strong>microcode ROM</strong> (five or more micro-ops)</td><td>The escape hatch for genuinely complex instructions</td></tr>
<tr><td>The resulting micro-op sequence is delivered to the <strong>rename/allocator module</strong></td><td>Hands off to slide 24</td></tr>
</table>
<ul>
<li><strong>"CISC outside, RISC inside" — say it in the exam and you have the chapter.</strong> Chương 13 argued that RISC wins because uniform, fixed-length, register-to-register operations are what a pipeline can schedule. Intel could not abandon the x86 instruction set without abandoning every program ever compiled for it, so it did the next best thing: keep the CISC <em>interface</em> and build a RISC <em>engine</em> behind a translator. This one slide is the resolution of the RISC-versus-CISC debate that Chương 13 ended on.</li>
<li><strong>Why 118 bits — a suspiciously fat instruction.</strong> ARM encodes an instruction in 32 bits because those bits go into memory and memory costs money and bandwidth. A micro-op never leaves the chip: it is not fetched, not cached, not stored. So it can afford to be wide and completely regular — full register fields, full flag information, no clever packing, nothing to unpick. Width here is free; decode simplicity is not.</li>
<li><strong>The 1-to-4 split, with examples.</strong> <code>ADD EAX, EBX</code> → 1 micro-op. <code>ADD EAX, [mem]</code> → about 2 (load, then add). <code>ADD [mem], EAX</code> → about 3 (load, add, store). A string move or a far call → dozens, which is why they are exiled to microcode ROM. The instruction you write and the work the machine does have come apart.</li>
<li><strong>Microcode ROM is a speed cliff, not just a mechanism.</strong> The fast decoders handle the common cases in parallel; anything routed to microcode drops out of that fast path. This is precisely why compilers stopped emitting the fancy x86 instructions (<code>ENTER</code>, <code>LOOP</code>, string ops) decades ago: the simple ones are faster <em>because</em> they stay out of the ROM. Chương 13's argument, appearing as measured behaviour on a CISC chip.</li>
<li><strong>Connect back to Chương 12.</strong> The control unit chapter described microprogrammed control, where every instruction was interpreted by microcode. Here microcode has been demoted to an exception path — the common instructions are hardwired into fast decoders. That demotion <em>is</em> the RISC influence on CISC.</li>
</ul>
<p class="meo">💡 Mnemonic: <strong>1–4 fast, 5+ slow</strong>. Four is the boundary between the parallel hardware decoders and the microcode ROM, and the number of micro-ops is the honest measure of what an x86 instruction really costs.</p>
<p class="pitfall">⚠️ Trap: micro-ops are <strong>not</strong> part of the instruction set. No program can name one, no compiler emits them, and they change freely from one microarchitecture to the next. They are an <em>implementation</em> detail below the ISA line — exactly the line Chương 10 drew.</p>`,
        `<p class="y-chinh">🎯 Đây là slide mà một cỗ máy CISC biến thành máy RISC ngay bên trong lớp da của chính nó. Bộ giải mã <strong>dịch mỗi lệnh máy thành MỘT TỚI BỐN micro-op, mỗi micro-op là một lệnh RISC rộng 118 bit</strong>. Mọi thứ nằm sau điểm này trong đường ống chưa từng nghe tới chữ x86.</p>
<table>
<tr><th>Bước trên slide</th><th>Chuyện gì xảy ra</th></tr>
<tr><td>Lệnh nạp về được đặt vào <strong>hàng đợi lệnh</strong></td><td>Một vùng đệm tách nhịp NẠP khỏi nhịp GIẢI MÃ — nạp chạy trước được khi giải mã kẹt</td></tr>
<tr><td><strong>Khối giải mã quét các byte</strong> để xác định ranh giới lệnh</td><td>Dùng các dấu mà tiền giải mã để lại (slide 22)</td></tr>
<tr><td>Dịch thành <strong>1 tới 4 micro-op</strong>, mỗi cái là <strong>một lệnh RISC 118 bit</strong></td><td>Ca phổ biến: lệnh x86 đơn giản thành một hoặc vài thao tác nội bộ đồng dạng</td></tr>
<tr><td>Lệnh cần <strong>hơn bốn</strong> thì đẩy sang <strong>microcode ROM</strong> (từ năm micro-op trở lên)</td><td>Cửa thoát dành cho những lệnh phức tạp thật sự</td></tr>
<tr><td>Dãy micro-op kết quả được giao cho <strong>module rename/allocator</strong></td><td>Chuyển tay sang slide 24</td></tr>
</table>
<ul>
<li><strong>"CISC ở ngoài, RISC ở trong" — nói được câu này trong phòng thi là bạn nắm cả chương.</strong> Chương 13 lập luận rằng RISC thắng vì thao tác đồng dạng, dài cố định, thanh-ghi-sang-thanh-ghi là thứ mà đường ống lập lịch được. Intel không thể bỏ tập lệnh x86 mà không bỏ luôn mọi chương trình từng biên dịch cho nó, nên họ làm điều tốt thứ nhì: giữ <em>GIAO DIỆN</em> CISC và dựng một <em>ĐỘNG CƠ</em> RISC đằng sau một bộ phiên dịch. Slide này chính là lời kết cho cuộc tranh luận RISC–CISC mà Chương 13 khép lại.</li>
<li><strong>Vì sao tới 118 bit — một lệnh béo đáng ngờ.</strong> ARM mã hoá lệnh trong 32 bit vì những bit đó phải nằm trong bộ nhớ, mà bộ nhớ thì tốn tiền và tốn băng thông. Micro-op thì KHÔNG BAO GIỜ rời khỏi chip: không bị nạp, không bị đệm, không bị lưu. Nên nó tha hồ rộng và đều tăm tắp — trường thanh ghi đầy đủ, thông tin cờ đầy đủ, không nén khéo, không có gì phải gỡ. Ở đây độ rộng là miễn phí; sự đơn giản khi giải mã thì không.</li>
<li><strong>Tỉ lệ 1-tới-4, kèm ví dụ.</strong> <code>ADD EAX, EBX</code> → 1 micro-op. <code>ADD EAX, [mem]</code> → khoảng 2 (nạp, rồi cộng). <code>ADD [mem], EAX</code> → khoảng 3 (nạp, cộng, lưu). Một lệnh chuyển chuỗi hay một lệnh gọi xa → hàng chục, nên chúng bị đày sang microcode ROM. Lệnh bạn VIẾT và công việc máy LÀM đã tách rời nhau.</li>
<li><strong>Microcode ROM là một vách tốc độ, không chỉ là một cơ chế.</strong> Các bộ giải mã nhanh xử lý ca phổ biến song song; thứ gì bị đẩy sang microcode là rơi khỏi đường nhanh. Đây chính xác là lý do các trình biên dịch đã thôi sinh ra những lệnh x86 hoa mỹ (<code>ENTER</code>, <code>LOOP</code>, lệnh chuỗi) từ mấy chục năm trước: lệnh đơn giản nhanh hơn CHÍNH VÌ nó không phải vào ROM. Lập luận của Chương 13, hiện ra thành hành vi đo được trên một con chip CISC.</li>
<li><strong>Nối ngược về Chương 12.</strong> Chương khối điều khiển mô tả điều khiển vi chương trình, nơi mọi lệnh đều do microcode thông dịch. Ở đây microcode đã bị GIÁNG xuống thành đường ngoại lệ — lệnh thông dụng được nối cứng vào các bộ giải mã nhanh. Cú giáng đó CHÍNH LÀ ảnh hưởng của RISC lên CISC.</li>
</ul>
<p class="meo">💡 Mẹo nhớ: <strong>1–4 nhanh, 5 trở lên chậm</strong>. Bốn là ranh giới giữa các bộ giải mã phần cứng song song và microcode ROM, và SỐ MICRO-OP mới là thước đo thành thật cho biết một lệnh x86 thật sự đắt bao nhiêu.</p>
<p class="pitfall">⚠️ Bẫy: micro-op <strong>KHÔNG</strong> thuộc tập lệnh. Không chương trình nào gọi tên được một cái, không trình biên dịch nào sinh ra chúng, và chúng thay đổi thoải mái giữa các vi kiến trúc. Chúng là chi tiết <em>HIỆN THỰC</em> nằm dưới đường ranh ISA — đúng cái đường mà Chương 10 đã vạch.</p>`],

      [24, 'Out-of-Order Execution Logic — the allocate stage and the four resources it hands out',
        `<p class="y-chinh">🎯 The heart of the machine: this part of the processor <strong>reorders micro-ops to allow them to execute as quickly as their input operands are ready</strong>. That single sentence is out-of-order execution. The rest of the slide is the bookkeeping that makes it possible — the <strong>allocate stage</strong>, which hands each arriving micro-op the resources it will need.</p>
<table>
<tr><th>What the allocator does per micro-op</th><th>The number on the slide</th><th>Why that resource is needed</th></tr>
<tr><td>Allocate a <strong>reorder buffer (ROB) entry</strong></td><td>tracks one of <strong>126 micro-ops</strong> in process at any time</td><td>To remember program order so results can be committed in order (slide 25)</td></tr>
<tr><td>Allocate an <strong>integer or floating-point register entry</strong> for the result</td><td>one of <strong>128</strong></td><td>Register renaming — the destination gets a fresh physical register (slide 26)</td></tr>
<tr><td>Possibly a <strong>load or store buffer</strong></td><td>one of <strong>48 loads</strong> or <strong>24 stores</strong></td><td>Memory operations must be tracked separately; they can complete out of order too</td></tr>
<tr><td>Allocate an entry in one of the <strong>two micro-op queues</strong></td><td>in front of the instruction schedulers</td><td>A waiting room until a scheduler has room</td></tr>
<tr><td><strong>If a needed resource is unavailable</strong> for one of the three micro-ops arriving in a clock cycle</td><td>the allocator <strong>stalls the pipeline</strong></td><td>The in-order chokepoint inside an out-of-order machine</td></tr>
</table>
<ul>
<li><strong>Read the four allocations as four different ways to run out of room.</strong> A long dependent chain exhausts the ROB. A burst of results exhausts the 128 registers. A memory-heavy loop exhausts the 48 load buffers. Any of them stalls the front end, and the stall looks identical from outside: the machine simply stops accepting work.</li>
<li><strong>126 entries is not an arbitrary number — compute what it buys.</strong> The allocator handles <strong>3 micro-ops per clock cycle</strong>, so a full ROB represents about <strong>126 ÷ 3 = 42 cycles</strong> of work in flight. That is roughly the latency of an L2 miss going to DRAM (Chương 4 measured this order of magnitude). The window is sized so the machine can keep finding independent work <em>right through</em> a cache miss instead of freezing. Every out-of-order design is fundamentally a bet of "window size versus miss latency".</li>
<li><strong>"As quickly as their input operands are ready" is a complete inversion.</strong> In the pipeline of Chương 12, an instruction executes when its <em>turn</em> comes. Here it executes when its <em>data</em> arrives. Program order stops governing execution — and slide 25 is where program order is quietly preserved anyway, at commit time.</li>
<li><strong>Note the asymmetry: 48 loads but only 24 stores.</strong> That is a design statement about real code — programs read far more than they write, and loads are on the critical path (something is waiting for the value) while stores usually are not. The same asymmetry justified write buffers in Chương 4.</li>
<li><strong>The allocator is in order, and that matters.</strong> Micro-ops must be allocated in program order for the ROB to record program order at all. So the machine is: fetch in order → decode in order → <strong>allocate in order</strong> → execute out of order → commit in order. Only the middle is free.</li>
</ul>
<p class="meo">💡 Think of the allocator as the reception desk of a busy workshop: it gives every job a ticket (ROB entry), a workbench for the result (physical register), a loading-dock slot if it touches goods (load/store buffer), and a place in the waiting line (micro-op queue). No ticket, no entry — everyone behind you waits.</p>
<p class="pitfall">⚠️ Exam trap: "out-of-order execution means instructions complete in any order and that is fine." Half true. They <em>execute</em> and <em>complete</em> out of order, but they must <strong>retire in program order</strong>, or exceptions and interrupts would be impossible to report at the right instruction. The slide says "three micro-ops arriving at the allocator during a clock cycle" — note that this is narrower than the six instructions per cycle predecode can produce (slide 22): the narrowest stage sets the real rate.</p>`,
        `<p class="y-chinh">🎯 Trái tim của cỗ máy: phần này của bộ xử lý <strong>SẮP XẾP LẠI các micro-op để chúng được chạy NGAY KHI toán hạng vào của chúng sẵn sàng</strong>. Đúng một câu đó là thực thi không theo thứ tự. Phần còn lại của slide là công việc sổ sách làm cho điều đó khả thi — <strong>tầng allocate</strong>, nơi phát cho mỗi micro-op vừa tới những tài nguyên nó sẽ cần.</p>
<table>
<tr><th>Allocator làm gì cho mỗi micro-op</th><th>Con số trên slide</th><th>Vì sao cần tài nguyên đó</th></tr>
<tr><td>Cấp một <strong>mục trong bộ đệm sắp xếp lại (ROB)</strong></td><td>theo dõi một trong <strong>126 micro-op</strong> đang xử lý tại mỗi thời điểm</td><td>Để NHỚ thứ tự chương trình, nhờ đó kết quả được cam kết đúng thứ tự (slide 25)</td></tr>
<tr><td>Cấp một <strong>mục thanh ghi nguyên hoặc dấu chấm động</strong> cho kết quả</td><td>một trong <strong>128</strong></td><td>Đổi tên thanh ghi — đích nhận một thanh ghi vật lý MỚI TINH (slide 26)</td></tr>
<tr><td>Có thể cấp thêm một <strong>đệm load hoặc store</strong></td><td>một trong <strong>48 load</strong> hoặc <strong>24 store</strong></td><td>Thao tác bộ nhớ phải theo dõi riêng; chúng cũng hoàn thành không theo thứ tự được</td></tr>
<tr><td>Cấp một mục trong <strong>một trong HAI hàng đợi micro-op</strong></td><td>nằm trước các bộ lập lịch lệnh</td><td>Phòng chờ cho tới khi bộ lập lịch có chỗ</td></tr>
<tr><td><strong>Nếu một tài nguyên cần thiết không còn</strong> cho một trong ba micro-op tới trong một chu kỳ</td><td>allocator <strong>làm nghẽn cả đường ống</strong></td><td>Nút thắt ĐÚNG THỨ TỰ nằm bên trong một cỗ máy KHÔNG theo thứ tự</td></tr>
</table>
<ul>
<li><strong>Đọc bốn phép cấp phát như BỐN cách hết chỗ khác nhau.</strong> Một chuỗi phụ thuộc dài làm cạn ROB. Một loạt kết quả làm cạn 128 thanh ghi. Một vòng lặp nặng bộ nhớ làm cạn 48 đệm load. Cái nào cạn cũng làm nghẽn front end, và nhìn từ ngoài thì mọi cú nghẽn giống hệt nhau: máy đơn giản là ngừng nhận việc.</li>
<li><strong>126 mục KHÔNG phải con số tuỳ tiện — hãy tính xem nó mua được gì.</strong> Allocator xử lý <strong>3 micro-op mỗi chu kỳ</strong>, nên một ROB đầy tương đương khoảng <strong>126 ÷ 3 = 42 chu kỳ</strong> công việc đang bay. Đó xấp xỉ độ trễ của một lần trượt L2 phải đi xuống DRAM (Chương 4 đã đo đúng cỡ này). Cửa sổ được định cỡ để máy vẫn tìm ra việc độc lập mà làm <em>SUỐT</em> một lần trượt cache thay vì đứng hình. Mọi thiết kế không-theo-thứ-tự về căn bản là một canh bạc "kích thước cửa sổ so với độ trễ trượt".</li>
<li><strong>"Ngay khi toán hạng vào sẵn sàng" là một cú lộn ngược hoàn toàn.</strong> Trong đường ống của Chương 12, một lệnh chạy khi tới <em>LƯỢT</em> nó. Ở đây nó chạy khi <em>DỮ LIỆU</em> của nó tới. Thứ tự chương trình thôi cai quản việc thực thi — và slide 25 là nơi thứ tự chương trình vẫn được giữ, lặng lẽ, ở thời điểm cam kết.</li>
<li><strong>Để ý sự bất đối xứng: 48 load nhưng chỉ 24 store.</strong> Đó là một tuyên bố thiết kế về mã thật — chương trình ĐỌC nhiều hơn GHI rất nhiều, và load nằm trên đường găng (có kẻ đang chờ giá trị đó) còn store thì thường không. Cùng sự bất đối xứng đó đã biện minh cho đệm ghi ở Chương 4.</li>
<li><strong>Allocator chạy ĐÚNG THỨ TỰ, và điều đó quan trọng.</strong> Micro-op phải được cấp phát theo thứ tự chương trình thì ROB mới ghi lại được thứ tự chương trình. Nên cỗ máy là: nạp đúng thứ tự → giải mã đúng thứ tự → <strong>cấp phát đúng thứ tự</strong> → thực thi KHÔNG theo thứ tự → cam kết đúng thứ tự. Chỉ khúc giữa là tự do.</li>
</ul>
<p class="meo">💡 Hãy coi allocator như quầy tiếp nhận của một xưởng đông khách: nó phát cho mỗi việc một số phiếu (mục ROB), một mặt bàn để đặt kết quả (thanh ghi vật lý), một ô bốc dỡ nếu việc đó đụng tới hàng hoá (đệm load/store), và một chỗ trong hàng chờ (hàng đợi micro-op). Không có phiếu thì không vào — và cả hàng phía sau bạn cùng chờ.</p>
<p class="pitfall">⚠️ Bẫy đề thi: "thực thi không theo thứ tự nghĩa là lệnh hoàn thành theo thứ tự nào cũng được, không sao". Đúng một nửa. Chúng <em>THỰC THI</em> và <em>HOÀN THÀNH</em> không theo thứ tự, nhưng phải <strong>RÚT LỆNH (retire) ĐÚNG THỨ TỰ CHƯƠNG TRÌNH</strong>, nếu không thì không thể báo ngoại lệ và ngắt tại đúng lệnh được. Slide ghi "ba micro-op tới allocator trong một chu kỳ" — để ý con số này HẸP HƠN sáu lệnh mỗi chu kỳ mà tiền giải mã sinh ra được (slide 22): tầng HẸP NHẤT mới là tốc độ thật.</p>`],

      [25, 'Reorder Buffer (ROB) — the circular buffer that makes speculation safe',
        `<p class="y-chinh">🎯 A <strong>circular buffer that can hold up to 126 micro-ops and also contains the 128 hardware registers</strong>. This is the single most important structure in the chapter: it is what lets the machine execute instructions that may turn out to be wrong, and then <strong>erase them as if they never happened</strong>.</p>
<table>
<tr><th>Field in each ROB entry (slide)</th><th>What it holds</th><th>What breaks without it</th></tr>
<tr><td><strong>State</strong></td><td>Whether this micro-op is <em>scheduled for execution</em>, <em>has been dispatched for execution</em>, or <em>has completed execution and is ready for retirement</em></td><td>Nothing would know which results are finished and safe to commit</td></tr>
<tr><td><strong>Memory address</strong></td><td>The address of the <em>instruction that generated the micro-op</em></td><td>An exception could not be reported at the right instruction — no precise interrupts</td></tr>
<tr><td><strong>Micro-op</strong></td><td>The actual operation</td><td>There would be nothing to execute or re-issue</td></tr>
<tr><td><strong>Alias register</strong></td><td>If the micro-op references one of the <strong>16 architectural registers</strong>, this entry <em>redirects that reference to one of the 128 hardware registers</em></td><td>Register renaming — this field <em>is</em> the renaming table (slide 26)</td></tr>
</table>
<ul>
<li><strong>Circular buffer means a queue with two moving ends.</strong> The <em>tail</em> is where the allocator inserts new micro-ops, strictly in program order. The <em>head</em> is where finished micro-ops retire, also strictly in program order. In between, results can appear in any order at all. That geometry is the whole trick.</li>
<li><strong>The principle to memorise, because no slide states it in one line: EXECUTION may be out of order, but COMMIT must be in order.</strong> A micro-op that finishes early does not write its result to the architectural state; it parks the result in its ROB entry and waits its turn at the head. Only at retirement does the result become official. Until then the entire computation is provisional and revocable.</li>
<li><strong>How a mispredicted branch is cleaned up.</strong> When the branch of slide 21 finally resolves and the prediction was wrong, every ROB entry <em>behind</em> that branch is simply marked invalid and dropped — they never reached the head, so they never touched architectural state. The machine restarts fetching at the correct target. The cost is not correctness; the cost is the <em>time</em> those cycles wasted, which is why prediction accuracy matters so much.</li>
<li><strong>The same machinery gives precise exceptions.</strong> If micro-op number 40 divides by zero while micro-op 70 has already computed its result, the exception is taken only when 40 reaches the head — with 41 onwards discarded. From software's point of view the processor stopped exactly at instruction 40 and nothing after it ever ran. That illusion is what lets an operating system (Chương 8) resume a process at all.</li>
<li><strong>Read "State" as a life cycle.</strong> allocated → scheduled → dispatched → completed → ready for retirement → retired. Five of those six states are invisible to software. Only the last one is real.</li>
</ul>
<p class="nhan">🔐 <strong>Extension, not on any slide — where speculation leaked: Spectre and Meltdown (2018).</strong> The ROB can undo <em>architectural</em> state — registers and memory. It cannot undo <em>microarchitectural</em> state. A speculatively executed load that missed still <strong>pulled a line into the cache</strong>, and the squashed instruction leaves that line behind. An attacker who afterwards times his own accesses can tell which line arrived, and the arrival pattern depends on the secret value the speculative instruction read. The data is never written anywhere the program can read — it is inferred from <em>how long things take</em>. Conceptually: speculation is undone in the ledger but not in the furniture. This is why the Chương 4 cache chapter and this chapter are not separate subjects, and it is the hardware side of the security material in CSI106 chương 12. No exploit code here, and none is needed to understand the principle.</p>
<p class="meo">💡 Restaurant image: the kitchen cooks several orders at once in whatever order ingredients arrive (out-of-order execution), but the waiter serves the tables strictly in the order they ordered (in-order commit). A cancelled order is thrown away before it reaches the table — but the smell is still in the room, and that smell is Spectre.</p>
<p class="pitfall">⚠️ Slide wording to note: it says "the address of the <strong>Pentium</strong> instruction that generated the micro-op". This block diagram is the Intel <em>Core</em> microarchitecture; "Pentium" is carried over from an older edition of the book. The mechanism is identical — just do not conclude that the slide is describing a Pentium.</p>`,
        `<p class="y-chinh">🎯 Một <strong>bộ đệm VÒNG chứa được tới 126 micro-op và cũng chứa luôn 128 thanh ghi phần cứng</strong>. Đây là cấu trúc quan trọng bậc nhất của cả chương: nó là thứ cho phép cỗ máy chạy những lệnh có thể hoá ra là SAI, rồi <strong>xoá sạch chúng như thể chưa từng có</strong>.</p>
<table>
<tr><th>Trường trong mỗi mục ROB (theo slide)</th><th>Nó giữ gì</th><th>Thiếu nó thì hỏng gì</th></tr>
<tr><td><strong>State</strong> — trạng thái</td><td>Micro-op này đang <em>được lập lịch để chạy</em>, <em>đã được điều phối đi chạy</em>, hay <em>đã chạy xong và SẴN SÀNG RÚT LỆNH</em></td><td>Không ai biết kết quả nào đã xong và an toàn để cam kết</td></tr>
<tr><td><strong>Memory address</strong> — địa chỉ</td><td>Địa chỉ của <em>lệnh đã sinh ra micro-op này</em></td><td>Không báo được ngoại lệ tại ĐÚNG lệnh — mất ngắt chính xác</td></tr>
<tr><td><strong>Micro-op</strong></td><td>Chính thao tác cần làm</td><td>Chẳng có gì để chạy hay phát lại</td></tr>
<tr><td><strong>Alias register</strong> — thanh ghi bí danh</td><td>Nếu micro-op tham chiếu một trong <strong>16 thanh ghi kiến trúc</strong>, mục này <em>bẻ tham chiếu đó sang một trong 128 thanh ghi phần cứng</em></td><td>Đổi tên thanh ghi — trường này CHÍNH LÀ bảng đổi tên (slide 26)</td></tr>
</table>
<ul>
<li><strong>Bộ đệm VÒNG nghĩa là một hàng đợi có HAI đầu di động.</strong> <em>ĐUÔI</em> là chỗ allocator chèn micro-op mới vào, nghiêm ngặt theo thứ tự chương trình. <em>ĐẦU</em> là chỗ micro-op xong việc rút ra, cũng nghiêm ngặt theo thứ tự chương trình. Còn ở KHOẢNG GIỮA, kết quả muốn xuất hiện theo thứ tự nào cũng được. Chính hình học đó là toàn bộ mẹo.</li>
<li><strong>Nguyên tắc phải thuộc, vì không slide nào phát biểu thành một dòng: THỰC THI có thể SAI THỨ TỰ, nhưng CAM KẾT phải ĐÚNG THỨ TỰ.</strong> Một micro-op xong sớm KHÔNG ghi kết quả vào trạng thái kiến trúc; nó gửi kết quả nằm im trong mục ROB của mình và chờ tới lượt ở đầu hàng. Chỉ lúc rút lệnh thì kết quả mới thành CHÍNH THỨC. Trước đó, toàn bộ tính toán là tạm thời và có thể thu hồi.</li>
<li><strong>Đoán sai một nhánh thì dọn thế nào.</strong> Khi lệnh rẽ nhánh ở slide 21 cuối cùng cũng tính xong và hoá ra đoán sai, MỌI mục ROB nằm <em>SAU</em> nhánh đó đơn giản là bị đánh dấu vô hiệu rồi vứt đi — chúng chưa bao giờ tới được đầu hàng nên chưa bao giờ đụng vào trạng thái kiến trúc. Máy nạp lại từ đích đúng. Cái giá KHÔNG phải là tính đúng đắn; cái giá là <em>THỜI GIAN</em> mà những chu kỳ ấy đã phí, và đó là lý do độ chính xác của dự đoán quan trọng đến thế.</li>
<li><strong>Cũng bộ máy đó cho bạn NGOẠI LỆ CHÍNH XÁC.</strong> Nếu micro-op số 40 chia cho 0 trong khi micro-op số 70 đã tính xong kết quả, ngoại lệ chỉ được nhận khi số 40 tới đầu hàng — và từ 41 trở đi bị vứt. Nhìn từ phía phần mềm, bộ xử lý dừng ĐÚNG tại lệnh 40 và không gì sau đó từng chạy. Chính ảo giác ấy mới cho phép hệ điều hành (Chương 8) tiếp tục lại một tiến trình.</li>
<li><strong>Đọc trường "State" như một VÒNG ĐỜI.</strong> đã cấp phát → đã lập lịch → đã điều phối → đã chạy xong → sẵn sàng rút → đã rút. Năm trên sáu trạng thái đó phần mềm KHÔNG nhìn thấy. Chỉ trạng thái cuối cùng là có thật.</li>
</ul>
<p class="nhan">🔐 <strong>Phần MỞ RỘNG, không có trên slide nào — chỗ thực thi suy đoán bị rò: Spectre và Meltdown (2018).</strong> ROB huỷ được trạng thái <em>KIẾN TRÚC</em> — thanh ghi và bộ nhớ. Nó KHÔNG huỷ được trạng thái <em>VI KIẾN TRÚC</em>. Một lệnh load chạy suy đoán mà trượt cache thì vẫn đã <strong>kéo một dòng vào cache</strong>, và lệnh bị xoá kia để lại dòng đó nằm đấy. Kẻ tấn công sau đó ĐO THỜI GIAN các truy cập của chính mình là biết dòng nào đã về, mà kiểu dòng nào về lại phụ thuộc vào giá trị BÍ MẬT mà lệnh suy đoán vừa đọc. Dữ liệu không hề được ghi vào chỗ nào chương trình đọc được — nó được SUY RA từ <em>chuyện gì mất bao lâu</em>. Ở mức khái niệm: suy đoán bị xoá trong sổ sách nhưng không bị xoá trong đồ đạc. Đó là lý do chương cache (Chương 4) và chương này không phải hai môn tách rời, và đây là mặt phần cứng của phần an toàn thông tin ở CSI106 chương 12. Không có mã khai thác ở đây, và cũng không cần mã nào để hiểu nguyên lý.</p>
<p class="meo">💡 Hình ảnh nhà hàng: bếp nấu nhiều món một lúc theo thứ tự nguyên liệu về (thực thi không theo thứ tự), nhưng người phục vụ bưng ra theo ĐÚNG thứ tự các bàn đã gọi (cam kết đúng thứ tự). Món bị huỷ thì đổ đi trước khi ra tới bàn — nhưng MÙI vẫn còn trong phòng, và cái mùi đó là Spectre.</p>
<p class="pitfall">⚠️ Chữ trên slide cần nói rõ: nó ghi "địa chỉ của lệnh <strong>Pentium</strong> đã sinh ra micro-op". Sơ đồ khối này là vi kiến trúc Intel <em>Core</em>; chữ "Pentium" là di sản từ một bản sách cũ. Cơ chế y hệt — chỉ đừng kết luận rằng slide đang mô tả một con Pentium.</p>`],

      [26, 'Register Renaming (2 of 2) — 16 architectural registers remapped onto 128 physical ones',
        `<p class="y-chinh">🎯 The pay-off slide. <strong>The rename stage remaps references to the 16 architectural registers into a set of 128 physical registers.</strong> Eight physical copies per architectural name — and that surplus is what makes WAR and WAW dependencies disappear.</p>
<table>
<tr><th>The slide's four blocks</th><th>What each says</th></tr>
<tr><td><strong>Register renaming</strong></td><td>The rename stage remaps the 16 architectural registers into 128 physical registers</td></tr>
<tr><td><strong>Micro-op scheduling and dispatching</strong></td><td>Schedulers retrieve micro-ops from the micro-op queues and dispatch them for execution</td></tr>
<tr><td><strong>Micro-op queuing</strong></td><td>After resource allocation and renaming, micro-ops wait in one of two queues until there is room in the schedulers</td></tr>
<tr><td><strong>Integer and floating-point execution units</strong></td><td>They retrieve values from the register files as well as from the L1 data cache</td></tr>
</table>
<p class="nhan">📐 <strong>Worked example (built for this lesson — the slide gives none). Six instructions, an unrolled loop body that reuses R1 three times:</strong></p>
<table>
<tr><th></th><th>Original code</th><th>After renaming to physical registers</th></tr>
<tr><td>I1</td><td><code>R1 := MEM[R10]</code></td><td><code>p1 := MEM[R10]</code></td></tr>
<tr><td>I2</td><td><code>R2 := R1 + R3</code></td><td><code>p2 := p1 + R3</code></td></tr>
<tr><td>I3</td><td><code>R1 := MEM[R11]</code></td><td><code>p3 := MEM[R11]</code></td></tr>
<tr><td>I4</td><td><code>R4 := R1 + R5</code></td><td><code>p4 := p3 + R5</code></td></tr>
<tr><td>I5</td><td><code>R1 := MEM[R12]</code></td><td><code>p5 := MEM[R12]</code></td></tr>
<tr><td>I6</td><td><code>R6 := R1 + R7</code></td><td><code>p6 := p5 + R7</code></td></tr>
</table>
<table>
<tr><th>Dependency in the original</th><th>Type</th><th>Real or false?</th><th>After renaming</th></tr>
<tr><td>I1 → I2 on R1</td><td>RAW (true data dependency)</td><td><strong>REAL</strong> — I2 needs the value</td><td>Survives: p1</td></tr>
<tr><td>I1 → I3 on R1</td><td><strong>WAW</strong> (output dependency)</td><td>FALSE — only the name collides</td><td><strong>GONE</strong>: p1 vs p3</td></tr>
<tr><td>I2 → I3 on R1</td><td><strong>WAR</strong> (antidependency)</td><td>FALSE — only the name collides</td><td><strong>GONE</strong>: I2 reads p1, I3 writes p3</td></tr>
<tr><td>I3 → I4 on R1</td><td>RAW</td><td><strong>REAL</strong></td><td>Survives: p3</td></tr>
<tr><td>I3 → I5 on R1</td><td><strong>WAW</strong></td><td>FALSE</td><td><strong>GONE</strong>: p3 vs p5</td></tr>
<tr><td>I4 → I5 on R1</td><td><strong>WAR</strong></td><td>FALSE</td><td><strong>GONE</strong>: I4 reads p3, I5 writes p5</td></tr>
<tr><td>I5 → I6 on R1</td><td>RAW</td><td><strong>REAL</strong></td><td>Survives: p5</td></tr>
</table>
<p class="nhan">📐 <strong>Issue diagram, machine model stated explicitly:</strong> 2-wide out-of-order issue, unlimited functional units, load latency 2 cycles, ALU latency 1 cycle. RAW means the consumer issues at least <em>latency</em> cycles after the producer; WAR and WAW each force at least one cycle of separation.</p>
<table>
<tr><th>Cycle</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th></tr>
<tr><td><strong>Original</strong></td><td>I1</td><td>—</td><td>I2</td><td>I3</td><td>—</td><td>I4</td><td>I5</td><td>—</td><td>I6</td></tr>
<tr><td><strong>Renamed</strong></td><td>I1, I3</td><td>I5</td><td>I2, I4</td><td>I6</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
</table>
<p class="dap-an">✅ Answer, verified with a python3 scheduler rather than counted by hand: the original needs <strong>9 cycles</strong> (issues at 1, 3, 4, 6, 7, 9); after renaming it needs <strong>4 cycles</strong> (issues at 1, 1, 2, 3, 3, 4). <strong>5 cycles saved, a 2,25× speedup</strong> — and not one true dependency was removed. Every cycle saved came from deleting a <em>name collision</em>.</p>
<p class="dap-an">✅ The second, sharper result from the same simulator: widen the machine from 2-issue to <strong>4-issue without renaming and the original still takes 9 cycles — exactly zero improvement</strong>. With renaming, 4-issue finishes in <strong>3 cycles</strong> (3,00×). So false dependencies do not merely cost you time; they make <em>buying a wider processor pointless</em>. That is why renaming is not optional in any modern out-of-order design.</p>
<ul>
<li><strong>Why 16 → 128 and not 16 → 20.</strong> With 126 micro-ops possibly in flight (slide 25), the machine may need many simultaneous live versions of the same architectural name — one per unretired writer. Eight copies per name is the budget the designers chose; run out and the allocator stalls (slide 24).</li>
<li><strong>The architectural registers never physically exist as 16 fixed cells.</strong> "EAX" is a <em>name</em> that the alias-register field of a ROB entry (slide 25) resolves to whichever physical register currently holds the newest value. At retirement, that mapping becomes the official one. Renaming and the ROB are one mechanism seen from two sides.</li>
<li><strong>The compiler cannot do this for you.</strong> A compiler can reduce register reuse, but it only has 16 names to work with — the ISA fixes that. Only the hardware can see 128. This is the clearest case in the course of a job that <em>must</em> be done at run time.</li>
<li><strong>Connect to the front end.</strong> Renaming plus the ROB is what turns the speculation of slide 21 from reckless into safe: speculative results land in physical registers that are simply never committed if the branch was mispredicted.</li>
</ul>
<p class="meo">💡 One-line memory hook: <strong>RAW is about VALUES, WAR and WAW are about NAMES.</strong> You cannot conjure a value that has not been computed, but you can always invent a new name. Renaming is the hardware inventing names.</p>
<p class="pitfall">⚠️ Two traps in one. (1) Renaming <strong>never</strong> removes a RAW dependency — if a question claims a true data dependency was eliminated by renaming, it is wrong. (2) The slide is titled "Register Renaming (2 of 2)" but contains <em>no</em> renaming example at all; it lists rename, scheduling, queuing and execution units. The example above was built for this lesson and its numbers verified by machine — do not quote it as "from the slide".</p>`,
        `<p class="y-chinh">🎯 Slide ăn tiền. <strong>Tầng rename ánh xạ lại các tham chiếu tới 16 thanh ghi KIẾN TRÚC thành một tập 128 thanh ghi VẬT LÝ.</strong> Tám bản sao vật lý cho mỗi cái tên kiến trúc — và chính phần dư đó làm cho phụ thuộc WAR và WAW BIẾN MẤT.</p>
<table>
<tr><th>Bốn khối trên slide</th><th>Mỗi khối nói gì</th></tr>
<tr><td><strong>Register renaming</strong></td><td>Tầng rename ánh xạ 16 thanh ghi kiến trúc thành 128 thanh ghi vật lý</td></tr>
<tr><td><strong>Micro-op scheduling and dispatching</strong></td><td>Bộ lập lịch lấy micro-op từ các hàng đợi và điều phối chúng đi thực thi</td></tr>
<tr><td><strong>Micro-op queuing</strong></td><td>Sau khi cấp tài nguyên và đổi tên, micro-op nằm chờ ở một trong HAI hàng đợi cho tới khi bộ lập lịch có chỗ</td></tr>
<tr><td><strong>Integer and floating-point execution units</strong></td><td>Các khối thực thi lấy giá trị từ tệp thanh ghi VÀ từ bộ nhớ đệm dữ liệu L1</td></tr>
</table>
<p class="nhan">📐 <strong>Ví dụ giải trọn (bài này dựng — slide KHÔNG có ví dụ nào). Sáu lệnh, thân một vòng lặp đã bóc, DÙNG LẠI R1 ba lần:</strong></p>
<table>
<tr><th></th><th>Mã gốc</th><th>Sau khi đổi tên sang thanh ghi vật lý</th></tr>
<tr><td>I1</td><td><code>R1 := MEM[R10]</code></td><td><code>p1 := MEM[R10]</code></td></tr>
<tr><td>I2</td><td><code>R2 := R1 + R3</code></td><td><code>p2 := p1 + R3</code></td></tr>
<tr><td>I3</td><td><code>R1 := MEM[R11]</code></td><td><code>p3 := MEM[R11]</code></td></tr>
<tr><td>I4</td><td><code>R4 := R1 + R5</code></td><td><code>p4 := p3 + R5</code></td></tr>
<tr><td>I5</td><td><code>R1 := MEM[R12]</code></td><td><code>p5 := MEM[R12]</code></td></tr>
<tr><td>I6</td><td><code>R6 := R1 + R7</code></td><td><code>p6 := p5 + R7</code></td></tr>
</table>
<table>
<tr><th>Phụ thuộc trong mã gốc</th><th>Loại</th><th>Thật hay GIẢ?</th><th>Sau khi đổi tên</th></tr>
<tr><td>I1 → I2 trên R1</td><td>RAW (phụ thuộc dữ liệu thật)</td><td><strong>THẬT</strong> — I2 cần chính giá trị đó</td><td>Còn nguyên: p1</td></tr>
<tr><td>I1 → I3 trên R1</td><td><strong>WAW</strong> (phụ thuộc đầu ra)</td><td>GIẢ — chỉ đụng nhau ở CÁI TÊN</td><td><strong>BIẾN MẤT</strong>: p1 với p3</td></tr>
<tr><td>I2 → I3 trên R1</td><td><strong>WAR</strong> (phản phụ thuộc)</td><td>GIẢ — chỉ đụng nhau ở CÁI TÊN</td><td><strong>BIẾN MẤT</strong>: I2 đọc p1, I3 ghi p3</td></tr>
<tr><td>I3 → I4 trên R1</td><td>RAW</td><td><strong>THẬT</strong></td><td>Còn nguyên: p3</td></tr>
<tr><td>I3 → I5 trên R1</td><td><strong>WAW</strong></td><td>GIẢ</td><td><strong>BIẾN MẤT</strong>: p3 với p5</td></tr>
<tr><td>I4 → I5 trên R1</td><td><strong>WAR</strong></td><td>GIẢ</td><td><strong>BIẾN MẤT</strong>: I4 đọc p3, I5 ghi p5</td></tr>
<tr><td>I5 → I6 trên R1</td><td>RAW</td><td><strong>THẬT</strong></td><td>Còn nguyên: p5</td></tr>
</table>
<p class="nhan">📐 <strong>Giản đồ phát lệnh, mô hình máy nói rõ ra:</strong> phát 2 lệnh/chu kỳ, không theo thứ tự, vô hạn đơn vị chức năng, load trễ 2 chu kỳ, ALU trễ 1 chu kỳ. RAW nghĩa là bên tiêu thụ phát sau bên sản xuất ít nhất <em>độ trễ</em> chu kỳ; WAR và WAW mỗi cái buộc cách nhau ít nhất một chu kỳ.</p>
<table>
<tr><th>Chu kỳ</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th></tr>
<tr><td><strong>Mã gốc</strong></td><td>I1</td><td>—</td><td>I2</td><td>I3</td><td>—</td><td>I4</td><td>I5</td><td>—</td><td>I6</td></tr>
<tr><td><strong>Đã đổi tên</strong></td><td>I1, I3</td><td>I5</td><td>I2, I4</td><td>I6</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>
</table>
<p class="dap-an">✅ Đáp án, KIỂM BẰNG bộ lập lịch python3 chứ không đếm tay: mã gốc cần <strong>9 chu kỳ</strong> (phát ở 1, 3, 4, 6, 7, 9); sau khi đổi tên chỉ cần <strong>4 chu kỳ</strong> (phát ở 1, 1, 2, 3, 3, 4). <strong>Tiết kiệm 5 chu kỳ, nhanh gấp 2,25 lần</strong> — mà KHÔNG một phụ thuộc thật nào bị gỡ bỏ. Từng chu kỳ tiết kiệm được đều đến từ việc xoá một cú <em>ĐỤNG TÊN</em>.</p>
<p class="dap-an">✅ Kết quả thứ hai, sắc hơn, từ cùng bộ mô phỏng: nới máy từ phát 2 lên <strong>phát 4 mà KHÔNG đổi tên thì mã gốc VẪN mất 9 chu kỳ — cải thiện đúng bằng KHÔNG</strong>. Có đổi tên thì máy phát 4 xong trong <strong>3 chu kỳ</strong> (3,00×). Tức là phụ thuộc giả không chỉ làm bạn mất thời gian; nó khiến việc <em>MUA một bộ xử lý rộng hơn trở nên vô nghĩa</em>. Đó là lý do đổi tên thanh ghi không phải tuỳ chọn trong bất kỳ thiết kế không-theo-thứ-tự hiện đại nào.</p>
<ul>
<li><strong>Vì sao 16 → 128 chứ không phải 16 → 20.</strong> Với 126 micro-op có thể đang bay (slide 25), máy có lúc cần rất nhiều phiên bản sống cùng lúc của cùng một cái tên kiến trúc — mỗi lệnh ghi chưa rút lệnh một phiên bản. Tám bản sao cho mỗi tên là ngân sách mà người thiết kế chọn; cạn là allocator nghẽn (slide 24).</li>
<li><strong>Thanh ghi kiến trúc KHÔNG hề tồn tại vật lý dưới dạng 16 ô cố định.</strong> "EAX" là một <em>CÁI TÊN</em> mà trường alias register trong mục ROB (slide 25) phân giải sang thanh ghi vật lý nào đang giữ giá trị mới nhất. Tới lúc rút lệnh, ánh xạ đó mới thành chính thức. Đổi tên và ROB là MỘT cơ chế nhìn từ hai phía.</li>
<li><strong>Trình biên dịch KHÔNG làm hộ bạn được.</strong> Trình biên dịch giảm bớt việc dùng lại thanh ghi thì được, nhưng nó chỉ có 16 cái tên để xoay — ISA đã chốt cứng. Chỉ phần cứng mới nhìn thấy 128. Đây là ca rõ nhất trong cả môn về một việc <em>BẮT BUỘC</em> phải làm lúc chạy.</li>
<li><strong>Nối về front end.</strong> Đổi tên cộng với ROB là thứ biến sự suy đoán ở slide 21 từ liều lĩnh thành AN TOÀN: kết quả suy đoán rơi vào những thanh ghi vật lý mà đơn giản là sẽ không bao giờ được cam kết nếu nhánh đoán sai.</li>
</ul>
<p class="meo">💡 Mẹo nhớ một dòng: <strong>RAW là chuyện GIÁ TRỊ, WAR và WAW là chuyện CÁI TÊN.</strong> Bạn không hô ra được một giá trị chưa tính, nhưng bạn LÚC NÀO cũng bịa thêm được một cái tên. Đổi tên thanh ghi chính là phần cứng đi bịa tên.</p>
<p class="pitfall">⚠️ Hai bẫy trong một. (1) Đổi tên <strong>KHÔNG BAO GIỜ</strong> gỡ được phụ thuộc RAW — câu nào bảo phụ thuộc dữ liệu thật bị đổi tên xoá đi là SAI. (2) Slide mang tên "Register Renaming (2 of 2)" nhưng <em>KHÔNG</em> có một ví dụ đổi tên nào; nó chỉ liệt kê rename, lập lịch, hàng đợi và khối thực thi. Ví dụ phía trên là do bài này dựng và mọi con số đã kiểm bằng máy — đừng trích nó như là "lấy từ slide".</p>`],

      [27, 'Figure 18.10 — Architectural Block Diagram of ARM Cortex-A8',
        `<p class="y-chinh">🎯 The second real chip of the chapter, and a deliberately different design point: the Cortex-A8 is a <strong>dual-issue, IN-ORDER superscalar</strong> — no reorder buffer, no register renaming — sized for phones rather than servers. The braces across the top read <strong>13-stage integer pipeline = 2 stages + 5 stages + 6 stages</strong>.</p>
<table>
<tr><th>Block on the diagram</th><th>What is inside it</th></tr>
<tr><td><strong>Instruction fetch</strong> (2 stages)</td><td>I-side L1 RAM · L1 cache interface · TLB · Prefetch and branch prediction</td></tr>
<tr><td><strong>Instruction decode</strong> (5 stages)</td><td>Decode &amp; sequencer · Dependency check and issue</td></tr>
<tr><td><strong>Instruction execute and Load/Store</strong> (6 stages)</td><td>Architectural register file · ALU pipe · MUL pipe 0 · ALU pipe 1 · Load/store pipe 0 or 1 · L1 cache interface · TLB · D-side L1 RAM</td></tr>
<tr><td><strong>L2 cache</strong></td><td>Instruction, data, NEON and preload engine buffers · Arbitration · L2 cache pipeline control · Fill and eviction queue · Bus interface unit (BIU) · Write buffer · L2 cache data RAM · L2 cache tag RAM</td></tr>
<tr><td><strong>NEON unit</strong> (10-stage SIMD pipeline = 3 + 1 + 6)</td><td>NEON instruction decode · NEON register file · Integer ALU pipe · Integer MUL pipe · Integer shift pipe · non-IEEE FP ADD pipe · non-IEEE FP MUL pipe · IEEE floating-point engine · Load/store permute pipe · Load and store data queue</td></tr>
</table>
<p class="dap-an">✅ Check the arithmetic on the diagram yourself: <strong>2 + 5 + 6 = 13</strong>, matching the label "13-stage integer pipeline", and <strong>3 + 1 + 6 = 10</strong>, matching "10-stage SIMD pipeline". Both add up — the figure is internally consistent, and these two sums are the fastest way to prove you have read it.</p>
<ul>
<li><strong>Follow the two feedback arrows — they are the whole story of a mistake.</strong> <em>Branch mispredict</em> runs from the execute block all the way back to instruction fetch: the prediction was wrong, throw away what is in flight, refill. <em>Replay</em> runs from execute back to decode: an instruction that was issued optimistically (assuming a cache hit, say) must be re-issued. Slide 32 prices those replays in cycles.</li>
<li><strong>Count the execution pipes: ALU pipe, MUL pipe 0, ALU pipe 1, Load/store pipe 0 or 1.</strong> Two symmetric ALUs, but <strong>only one multiplier and only one load/store unit</strong>. That asymmetry is not a detail — it is exactly what generates the dual-issue restrictions in Table 18.4 (slide 33). Read the block diagram and you can predict the restriction table.</li>
<li><strong>"Dependency check and issue" in the decode block is where a Cortex-A8 differs most from an Intel Core.</strong> Dependencies are resolved <em>before</em> issue by a scoreboard, in program order. The Intel Core resolves them <em>after</em> issue, out of order, with a ROB. Same problem, two philosophies: ARM spends less silicon and less power; Intel extracts more ILP.</li>
<li><strong>Two separate register files, and that is a design decision.</strong> An architectural register file for integer work, a NEON register file for SIMD. Keeping them apart lets the NEON unit be a physically separate 10-stage pipeline with its own decode — the SIMD side runs almost like a coprocessor.</li>
<li><strong>The L2 block is bigger than the core blocks on this diagram, and that is honest.</strong> Arbitration, pipeline control, fill and eviction queues, write buffer, separate tag and data RAMs — everything Chương 4 described, drawn to scale. On a real chip, cache is most of the area.</li>
</ul>
<p class="meo">💡 Read any processor block diagram in this order: (1) count the <em>execution pipes</em> — that gives the issue width and the resource conflicts; (2) find the <em>feedback arrows</em> — those are the mistakes the design expects to make; (3) find the <em>register files</em> — that tells you whether renaming exists. Three passes, and you know the machine.</p>
<p class="pitfall">⚠️ Do not call the A8 "out-of-order" because the diagram looks complex. It has more pipelines than a scalar machine, but slide 30 states flatly that all issued instructions progress <strong>in order</strong>. Width and ordering are independent properties.</p>`,
        `<p class="y-chinh">🎯 Con chip thật thứ hai của chương, và là một điểm thiết kế KHÁC HẲN một cách có chủ ý: Cortex-A8 là <strong>superscalar phát ĐÔI, ĐÚNG THỨ TỰ</strong> — không có bộ đệm sắp xếp lại, không có đổi tên thanh ghi — định cỡ cho điện thoại chứ không phải máy chủ. Các dấu ngoặc trên đỉnh hình đọc là <strong>đường ống nguyên 13 tầng = 2 tầng + 5 tầng + 6 tầng</strong>.</p>
<table>
<tr><th>Khối trên sơ đồ</th><th>Bên trong có gì</th></tr>
<tr><td><strong>Instruction fetch</strong> — nạp lệnh (2 tầng)</td><td>I-side L1 RAM · L1 cache interface · TLB · Prefetch and branch prediction</td></tr>
<tr><td><strong>Instruction decode</strong> — giải mã (5 tầng)</td><td>Decode &amp; sequencer · Dependency check and issue</td></tr>
<tr><td><strong>Instruction execute and Load/Store</strong> — thực thi (6 tầng)</td><td>Architectural register file · ALU pipe · MUL pipe 0 · ALU pipe 1 · Load/store pipe 0 or 1 · L1 cache interface · TLB · D-side L1 RAM</td></tr>
<tr><td><strong>L2 cache</strong></td><td>Instruction, data, NEON and preload engine buffers · Arbitration · L2 cache pipeline control · Fill and eviction queue · Bus interface unit (BIU) · Write buffer · L2 cache data RAM · L2 cache tag RAM</td></tr>
<tr><td><strong>NEON unit</strong> (đường ống SIMD 10 tầng = 3 + 1 + 6)</td><td>NEON instruction decode · NEON register file · Integer ALU pipe · Integer MUL pipe · Integer shift pipe · non-IEEE FP ADD pipe · non-IEEE FP MUL pipe · IEEE floating-point engine · Load/store permute pipe · Load and store data queue</td></tr>
</table>
<p class="dap-an">✅ Tự kiểm phép cộng ngay trên hình: <strong>2 + 5 + 6 = 13</strong>, khớp nhãn "13-stage integer pipeline", và <strong>3 + 1 + 6 = 10</strong>, khớp nhãn "10-stage SIMD pipeline". Cả hai đều cộng đúng — hình nhất quán bên trong, và hai phép cộng này là cách nhanh nhất để chứng minh bạn đã THẬT SỰ đọc nó.</p>
<ul>
<li><strong>Bám theo HAI mũi tên hồi tiếp — chúng là toàn bộ câu chuyện về một sai lầm.</strong> <em>Branch mispredict</em> chạy từ khối thực thi ngược hẳn về khối nạp lệnh: đoán sai rồi, vứt hết thứ đang bay, nạp lại. <em>Replay</em> chạy từ thực thi ngược về giải mã: một lệnh đã phát đi một cách lạc quan (chẳng hạn giả định trúng cache) phải được PHÁT LẠI. Slide 32 báo giá những lần replay đó bằng chu kỳ.</li>
<li><strong>Đếm số ống thực thi: ALU pipe, MUL pipe 0, ALU pipe 1, Load/store pipe 0 or 1.</strong> Hai ALU đối xứng, nhưng <strong>chỉ MỘT bộ nhân và chỉ MỘT khối load/store</strong>. Sự bất đối xứng đó không phải chi tiết vụn — nó chính là thứ đẻ ra các luật cấm phát đôi ở Table 18.4 (slide 33). Đọc sơ đồ khối là bạn ĐOÁN TRƯỚC được bảng cấm.</li>
<li><strong>"Dependency check and issue" nằm trong khối giải mã là chỗ Cortex-A8 khác Intel Core nhiều nhất.</strong> Phụ thuộc được giải quyết <em>TRƯỚC</em> khi phát, bằng một bảng scoreboard, theo đúng thứ tự chương trình. Intel Core giải quyết chúng <em>SAU</em> khi phát, không theo thứ tự, bằng ROB. Cùng một bài toán, hai triết lý: ARM tốn ít silicon và ít điện hơn; Intel vắt ra nhiều ILP hơn.</li>
<li><strong>HAI tệp thanh ghi tách rời, và đó là một quyết định thiết kế.</strong> Một tệp thanh ghi kiến trúc cho việc số nguyên, một tệp NEON cho SIMD. Để chúng riêng ra thì khối NEON mới thành một đường ống 10 tầng tách bạch về mặt vật lý với bộ giải mã riêng — phía SIMD chạy gần như một đồng xử lý.</li>
<li><strong>Khối L2 trên hình TO hơn các khối lõi, và điều đó là thành thật.</strong> Trọng tài, điều khiển đường ống, hàng đợi nạp và đuổi dòng, đệm ghi, RAM tag và RAM dữ liệu riêng — mọi thứ Chương 4 mô tả, vẽ đúng tỉ lệ. Trên chip thật, cache chiếm phần lớn diện tích.</li>
</ul>
<p class="meo">💡 Đọc bất kỳ sơ đồ khối bộ xử lý nào theo thứ tự này: (1) đếm <em>số ống thực thi</em> — ra được độ rộng phát lệnh và các xung đột tài nguyên; (2) tìm <em>các mũi tên hồi tiếp</em> — đó là những sai lầm mà thiết kế đã lường trước là sẽ mắc; (3) tìm <em>các tệp thanh ghi</em> — biết được có đổi tên hay không. Ba lượt quét, và bạn hiểu cỗ máy.</p>
<p class="pitfall">⚠️ Đừng gọi A8 là "không theo thứ tự" chỉ vì sơ đồ trông phức tạp. Nó có nhiều đường ống hơn máy thường, nhưng slide 30 nói thẳng rằng mọi lệnh đã phát đều tiến <strong>ĐÚNG THỨ TỰ</strong>. Độ RỘNG và THỨ TỰ là hai tính chất độc lập.</p>`],

      [28, 'Figure 18.11 — ARM Cortex-A8 Integer Pipeline (fetch, decode and execute in three panels)',
        `<p class="y-chinh">🎯 The 13 stages of slide 27, opened up and named one by one. Three panels: <strong>(a) instruction fetch pipeline — F0 F1 F2</strong>, <strong>(b) instruction decode pipeline — D0 D1 D2 D3 D4</strong>, <strong>(c) instruction execute and load/store pipeline — E0 E1 E2 E3 E4 E5</strong>.</p>
<table>
<tr><th>Panel</th><th>Stage</th><th>Blocks drawn in it</th></tr>
<tr><td rowspan="3">(a) Fetch</td><td><strong>F0</strong> (drawn as a <em>dashed</em> box)</td><td>AGU — and a "branch mispredict" arrow entering here</td></tr>
<tr><td><strong>F1</strong></td><td>RAM + TLB, with BTB / GHB / RS hanging off it</td></tr>
<tr><td><strong>F2</strong></td><td>12-entry fetch queue</td></tr>
<tr><td rowspan="5">(b) Decode</td><td><strong>D0</strong></td><td>Early decode (two of them, one per pipeline)</td></tr>
<tr><td><strong>D1</strong></td><td>Decode/seq and Decode</td></tr>
<tr><td><strong>D2</strong></td><td>Dec queue read/write — with the "replay" arrow arriving and a Pending and replay queue below</td></tr>
<tr><td><strong>D3</strong></td><td>Scoreboard + issue logic</td></tr>
<tr><td><strong>D4</strong></td><td>Final decode</td></tr>
<tr><td rowspan="6">(c) Execute</td><td><strong>E0</strong></td><td>Architectural register file (one tall block feeding all three pipes)</td></tr>
<tr><td><strong>E1</strong></td><td>Shift / MUL1 (pipe 0) · Shift (pipe 1) · AGU (load-store pipe)</td></tr>
<tr><td><strong>E2</strong></td><td>ALU / MUL2 · ALU · RAM + TLB</td></tr>
<tr><td><strong>E3</strong></td><td>SAT / MUL3 · SAT · Format forward</td></tr>
<tr><td><strong>E4</strong></td><td>BP / ACC · BP · L2 update — "branch mispredict" and "replay" leave from here</td></tr>
<tr><td><strong>E5</strong></td><td>WB (write back) on all three pipes</td></tr>
</table>
<p class="dap-an">✅ Count again and it holds: F1 and F2 are counted (F0 is drawn dashed because it is <em>not</em> counted, as slide 29 states outright), plus D0–D4 = 5, plus E0–E5 = 6. <strong>2 + 5 + 6 = 13.</strong> The dashed box is not decoration — it is the visual mark of a stage excluded from the official count.</p>
<ul>
<li><strong>Three prediction structures in stage F1, and each maps to a branch type.</strong> <strong>BTB</strong> = branch target buffer (where does this branch go?), <strong>GHB</strong> = global history buffer (which way do branches tend to go in this context?), <strong>RS</strong> = return stack (where does this <em>return</em> go?). Compare with slide 21's list of five branch types on the Intel side: different vendor, identical shopping list.</li>
<li><strong>The 12-entry fetch queue at F2 is the shock absorber.</strong> Fetch runs ahead and parks instructions there; decode drains it. When decode stalls for a cycle, fetch does not have to stop, and when fetch misses in the I-cache, decode still has work. A queue between two stages always means "these two stages are allowed to run at different speeds for a while".</li>
<li><strong>The scoreboard lives at D3, before issue — and that is the ARM philosophy in one box.</strong> Slide 31 says the scoreboard <em>predicts register availability using static scheduling</em>. It decides in advance which cycle a result will be ready, then refuses to issue anything that would arrive too early. No renaming, no reorder buffer, no rollback machinery — just a table of arrival times and a gate.</li>
<li><strong>Notice where the two exception arrows originate: E4, not E5.</strong> Branch resolution and replay detection happen one stage before write-back, so a wrong path is killed <em>before</em> anything reaches the register file. That is how an in-order machine can speculate at all without a reorder buffer — it simply never lets a speculative result be written.</li>
<li><strong>Three execute pipes, and the multiplier occupies E1-E2-E3 of pipe 0 only.</strong> MUL1, MUL2, MUL3 in successive stages means a multiply is a three-stage operation, and it exists only in pipe 0. That single fact is Table 18.4's "multiply resource hazard" (slide 33) — you can read the restriction straight off this figure.</li>
</ul>
<p class="meo">💡 Memorise the three letters with their stage counts: <strong>F = 2, D = 5, E = 6</strong>. Then remember that the decode section is the <em>longest</em> — five stages just to check dependencies and issue. In an in-order machine, the work that Intel spends a reorder buffer on, ARM spends pipeline stages on.</p>
<p class="pitfall">⚠️ The stage labels here are <strong>F0 F1 F2</strong>. Slide 29 writes the same three as <strong>F0 F1 F3</strong>. The figure and the book agree on F2; the bullet slide has a typo. Trust the figure, and if an exam asks, the fetch stages are F0 (uncounted), F1, F2.</p>`,
        `<p class="y-chinh">🎯 13 tầng của slide 27, mở banh ra và gọi tên từng cái. Ba ô: <strong>(a) đường ống nạp lệnh — F0 F1 F2</strong>, <strong>(b) đường ống giải mã — D0 D1 D2 D3 D4</strong>, <strong>(c) đường ống thực thi và load/store — E0 E1 E2 E3 E4 E5</strong>.</p>
<table>
<tr><th>Ô</th><th>Tầng</th><th>Các khối vẽ trong đó</th></tr>
<tr><td rowspan="3">(a) Nạp lệnh</td><td><strong>F0</strong> (vẽ bằng khung <em>NÉT ĐỨT</em>)</td><td>AGU — và một mũi tên "branch mispredict" đi vào đây</td></tr>
<tr><td><strong>F1</strong></td><td>RAM + TLB, có BTB / GHB / RS treo bên dưới</td></tr>
<tr><td><strong>F2</strong></td><td>Hàng đợi nạp 12 mục (12-entry fetch queue)</td></tr>
<tr><td rowspan="5">(b) Giải mã</td><td><strong>D0</strong></td><td>Early decode (hai cái, mỗi đường ống một cái)</td></tr>
<tr><td><strong>D1</strong></td><td>Decode/seq và Decode</td></tr>
<tr><td><strong>D2</strong></td><td>Dec queue read/write — mũi tên "replay" đi vào đây, bên dưới là Pending and replay queue</td></tr>
<tr><td><strong>D3</strong></td><td>Scoreboard + issue logic</td></tr>
<tr><td><strong>D4</strong></td><td>Final decode</td></tr>
<tr><td rowspan="6">(c) Thực thi</td><td><strong>E0</strong></td><td>Architectural register file (một khối cao nuôi cả ba ống)</td></tr>
<tr><td><strong>E1</strong></td><td>Shift / MUL1 (ống 0) · Shift (ống 1) · AGU (ống load-store)</td></tr>
<tr><td><strong>E2</strong></td><td>ALU / MUL2 · ALU · RAM + TLB</td></tr>
<tr><td><strong>E3</strong></td><td>SAT / MUL3 · SAT · Format forward</td></tr>
<tr><td><strong>E4</strong></td><td>BP / ACC · BP · L2 update — "branch mispredict" và "replay" đi RA từ đây</td></tr>
<tr><td><strong>E5</strong></td><td>WB (ghi ngược) trên cả ba ống</td></tr>
</table>
<p class="dap-an">✅ Đếm lại vẫn khớp: F1 và F2 được tính (F0 vẽ nét đứt vì nó <em>KHÔNG</em> được tính, đúng như slide 29 nói thẳng), cộng D0–D4 = 5, cộng E0–E5 = 6. <strong>2 + 5 + 6 = 13.</strong> Cái khung nét đứt không phải trang trí — nó là dấu hiệu THỊ GIÁC cho một tầng bị loại khỏi con số chính thức.</p>
<ul>
<li><strong>Ba cấu trúc dự đoán nằm ở tầng F1, mỗi cái ứng một loại rẽ nhánh.</strong> <strong>BTB</strong> = branch target buffer (nhánh này nhảy đi đâu?), <strong>GHB</strong> = global history buffer (trong ngữ cảnh này các nhánh có xu hướng đi lối nào?), <strong>RS</strong> = return stack (lệnh <em>return</em> này về đâu?). So với danh sách năm loại rẽ nhánh phía Intel ở slide 21: khác hãng, giống y hệt danh sách đi chợ.</li>
<li><strong>Hàng đợi nạp 12 mục ở F2 là bộ giảm xóc.</strong> Khối nạp chạy trước và gửi lệnh vào đó; khối giải mã rút ra. Giải mã kẹt một chu kỳ thì nạp không phải dừng, và nạp trượt I-cache thì giải mã vẫn còn việc. Một hàng đợi giữa hai tầng LÚC NÀO cũng có nghĩa là "hai tầng này được phép chạy lệch tốc độ nhau trong một lúc".</li>
<li><strong>Scoreboard nằm ở D3, TRƯỚC khi phát — và đó là triết lý ARM gói trong một cái ô.</strong> Slide 31 ghi scoreboard <em>dự đoán độ sẵn sàng của thanh ghi bằng lập lịch TĨNH</em>. Nó quyết định trước là kết quả sẽ có ở chu kỳ nào, rồi từ chối phát bất cứ lệnh nào sẽ tới quá sớm. Không đổi tên, không bộ đệm sắp xếp lại, không bộ máy quay lui — chỉ một bảng giờ tới và một cái cổng.</li>
<li><strong>Để ý hai mũi tên ngoại lệ đi ra từ E4, không phải E5.</strong> Rẽ nhánh được phân giải và replay được phát hiện trước tầng ghi ngược MỘT tầng, nên đường đi sai bị giết <em>TRƯỚC KHI</em> có gì chạm tới tệp thanh ghi. Đó là cách một máy đúng-thứ-tự vẫn suy đoán được mà không cần ROB — nó đơn giản là KHÔNG BAO GIỜ để một kết quả suy đoán được ghi xuống.</li>
<li><strong>Ba ống thực thi, và bộ nhân chiếm E1-E2-E3 CHỈ của ống 0.</strong> MUL1, MUL2, MUL3 nằm ở ba tầng liên tiếp nghĩa là phép nhân là thao tác ba tầng, và nó chỉ tồn tại ở ống 0. Riêng sự thật đó chính là "multiply resource hazard" của Table 18.4 (slide 33) — bạn đọc được luật cấm thẳng từ hình này.</li>
</ul>
<p class="meo">💡 Thuộc ba chữ cái kèm số tầng: <strong>F = 2, D = 5, E = 6</strong>. Rồi nhớ rằng khúc GIẢI MÃ là DÀI NHẤT — năm tầng chỉ để kiểm phụ thuộc và phát lệnh. Trong máy đúng-thứ-tự, cái việc mà Intel bỏ ra một bộ đệm sắp xếp lại để làm thì ARM bỏ ra các tầng đường ống để làm.</p>
<p class="pitfall">⚠️ Nhãn tầng ở đây là <strong>F0 F1 F2</strong>. Slide 29 viết đúng ba tầng đó thành <strong>F0 F1 F3</strong>. Hình và sách đều thống nhất là F2; slide chữ bị lỗi đánh máy. Tin cái hình, và nếu đề hỏi thì ba tầng nạp là F0 (không tính), F1, F2.</p>`],

      [29, 'Instruction Fetch Unit — speculative fetch, four instructions per cycle, and the F0/F1/F3 stages',
        `<p class="y-chinh">🎯 The Cortex-A8 fetch unit in the slide's own words: it <strong>predicts instruction stream</strong>, <strong>fetches instructions from the L1 instruction cache</strong>, and <strong>places the fetched instructions into a buffer for consumption by the decode pipeline</strong>. The crucial admission is one word: this whole unit is <strong>speculative — there is no guarantee that they are executed</strong>.</p>
<table>
<tr><th>Stage</th><th>What the slide says happens</th></tr>
<tr><td><strong>F0</strong></td><td>The address generation unit (AGU) generates a new virtual address. <strong>Not counted as part of the 13-stage pipeline</strong></td></tr>
<tr><td><strong>F1</strong></td><td>The calculated address is used to fetch instructions from the L1 instruction cache. <em>In parallel</em>, the fetch address is used to access the branch prediction arrays</td></tr>
<tr><td><strong>F3</strong> (the slide's label; the figure says F2)</td><td>Instruction data are placed in the instruction queue. If an instruction results in branch prediction, the new target address is sent to the address generation unit</td></tr>
</table>
<ul>
<li><strong>"In parallel" in F1 is the timing trick that makes prediction free.</strong> Reading the I-cache and reading the branch prediction arrays happen in the <em>same</em> cycle, using the <em>same</em> address. If you had to fetch first and then look up the prediction, you would lose a cycle on every branch. Doing both at once means the prediction is ready at exactly the moment you discover you fetched a branch.</li>
<li><strong>The loop F3 → F0 is the machine steering itself.</strong> A predicted-taken branch sends a new target address back to the AGU, which starts the next fetch there. Fetch is a closed control loop running ahead of everything else, guided entirely by guesses.</li>
<li><strong>"Speculative (there is no guarantee that they are executed)" — read this next to slide 21.</strong> Intel says the processor "begins executing instructions long before the branch outcome is decided"; ARM says fetched instructions are not guaranteed to execute. Same idea from two ends: speculation is the normal state of a modern pipeline, not an exceptional mode.</li>
<li><strong>"Branch or exceptional instruction in the code stream can cause a pipeline flush."</strong> A flush is the bill for a wrong guess. On a 13-stage pipeline the bill is roughly the number of stages between fetch and branch resolution at E4 — about a dozen instruction slots thrown away. That is why a modern processor invests so much silicon in being right.</li>
<li><strong>"Can fetch up to four instructions per cycle" — but the machine only issues two.</strong> Fetch is deliberately <em>wider</em> than issue. Why: fetch is the stage most likely to stall (cache miss, mispredict), so it must be able to run ahead and build up a cushion in the 12-entry queue. Over-provisioning the front end is a standard superscalar move; the same logic explains why the Intel Core predecodes six instructions per cycle (slide 22) but allocates only three micro-ops (slide 24).</li>
</ul>
<p class="dap-an">✅ Do the ratio: <strong>4 fetched ÷ 2 issued = 2× over-provisioning</strong> at the front. Combined with a 12-entry queue, the fetch unit can be stalled for roughly six issue-cycles before decode starves. That buffer is exactly what an L1 instruction-cache miss costs on this class of chip.</p>
<p class="meo">💡 The three fetch stages are easy to keep straight as <strong>address → memory → queue</strong>. Every fetch unit in the course does those three things; only the stage names change.</p>
<p class="pitfall">⚠️ Two things to state honestly. (1) The slide labels the stages <strong>F0, F1, F3</strong> — there is no F2 in the bullet list, while Figure 18.11 on slide 28 clearly draws F0, F1, F2. This is an error in the slide deck, not in your reading of it; the textbook uses F2. (2) F0 is <strong>not counted</strong> in the 13 stages, which is why 2 + 5 + 6 works out. Counting F0 gives 14 and no figure in the chapter says 14.</p>`,
        `<p class="y-chinh">🎯 Khối nạp lệnh của Cortex-A8, bằng chính chữ của slide: nó <strong>dự đoán luồng lệnh</strong>, <strong>nạp lệnh từ bộ nhớ đệm lệnh L1</strong>, và <strong>đặt lệnh đã nạp vào một vùng đệm cho đường ống giải mã tiêu thụ</strong>. Lời thú nhận then chốt gói trong một chữ: cả khối này là <strong>SUY ĐOÁN — không có gì bảo đảm những lệnh đó sẽ được chạy</strong>.</p>
<table>
<tr><th>Tầng</th><th>Slide nói xảy ra chuyện gì</th></tr>
<tr><td><strong>F0</strong></td><td>Khối sinh địa chỉ (AGU) sinh ra một địa chỉ ảo mới. <strong>KHÔNG được tính vào 13 tầng của đường ống</strong></td></tr>
<tr><td><strong>F1</strong></td><td>Địa chỉ vừa tính được dùng để nạp lệnh từ bộ nhớ đệm lệnh L1. <em>SONG SONG</em>, chính địa chỉ nạp đó được dùng để tra các mảng dự đoán rẽ nhánh</td></tr>
<tr><td><strong>F3</strong> (nhãn của slide; hình ghi F2)</td><td>Dữ liệu lệnh được đặt vào hàng đợi lệnh. Nếu một lệnh dẫn tới dự đoán rẽ nhánh, địa chỉ đích mới được gửi ngược về khối sinh địa chỉ</td></tr>
</table>
<ul>
<li><strong>Chữ "SONG SONG" ở F1 là mẹo định thời khiến dự đoán trở nên MIỄN PHÍ.</strong> Đọc I-cache và đọc các mảng dự đoán rẽ nhánh diễn ra trong <em>CÙNG</em> một chu kỳ, dùng <em>CÙNG</em> một địa chỉ. Nếu phải nạp trước rồi mới tra dự đoán thì bạn mất một chu kỳ ở MỌI lệnh rẽ nhánh. Làm cả hai một lúc nghĩa là dự đoán sẵn sàng đúng vào khoảnh khắc bạn phát hiện mình vừa nạp một lệnh rẽ nhánh.</li>
<li><strong>Vòng F3 → F0 là cỗ máy tự bẻ lái.</strong> Một nhánh được đoán là nhảy sẽ gửi địa chỉ đích mới ngược về AGU, và AGU bắt đầu lượt nạp tiếp theo ở đó. Khối nạp là một vòng điều khiển KÍN chạy trước mọi thứ khác, hoàn toàn do những phỏng đoán dẫn đường.</li>
<li><strong>"Speculative (không bảo đảm chúng được chạy)" — đọc câu này cạnh slide 21.</strong> Intel nói bộ xử lý "bắt đầu thực thi lệnh từ rất lâu trước khi kết quả rẽ nhánh được quyết định"; ARM nói lệnh đã nạp không bảo đảm sẽ chạy. Cùng một ý nhìn từ hai đầu: SUY ĐOÁN là trạng thái BÌNH THƯỜNG của đường ống hiện đại, không phải một chế độ ngoại lệ.</li>
<li><strong>"Một lệnh rẽ nhánh hoặc lệnh gây ngoại lệ trong luồng mã có thể làm XẢ SẠCH đường ống."</strong> Xả ống là hoá đơn cho một cú đoán sai. Trên đường ống 13 tầng, hoá đơn xấp xỉ số tầng từ nạp lệnh tới chỗ rẽ nhánh được phân giải ở E4 — khoảng một tá ô lệnh bị ném đi. Đó là lý do bộ xử lý hiện đại đổ nhiều silicon đến thế vào việc ĐOÁN TRÚNG.</li>
<li><strong>"Nạp được tới BỐN lệnh mỗi chu kỳ" — nhưng máy chỉ phát HAI.</strong> Khối nạp được làm RỘNG HƠN khối phát một cách có chủ ý. Vì sao: nạp là tầng dễ kẹt nhất (trượt cache, đoán sai), nên nó phải chạy trước được để tích một cái đệm trong hàng đợi 12 mục. Cấp dư cho front end là một nước đi chuẩn của superscalar; cùng logic đó giải thích vì sao Intel Core tiền giải mã sáu lệnh mỗi chu kỳ (slide 22) mà chỉ cấp phát ba micro-op (slide 24).</li>
</ul>
<p class="dap-an">✅ Làm phép chia: <strong>4 lệnh nạp ÷ 2 lệnh phát = cấp dư gấp 2 lần</strong> ở đầu vào. Cộng với hàng đợi 12 mục, khối nạp có thể đứng hình chừng sáu chu kỳ phát lệnh trước khi khối giải mã đói. Cái đệm đó đúng bằng giá của một lần trượt bộ nhớ đệm lệnh L1 trên lớp chip này.</p>
<p class="meo">💡 Ba tầng nạp dễ nhớ theo mạch <strong>địa chỉ → bộ nhớ → hàng đợi</strong>. Mọi khối nạp lệnh trong cả môn đều làm đúng ba việc đó; chỉ tên tầng là đổi.</p>
<p class="pitfall">⚠️ Hai điều phải nói thật. (1) Slide đánh nhãn ba tầng là <strong>F0, F1, F3</strong> — trong danh sách gạch đầu dòng KHÔNG có F2, trong khi Figure 18.11 ở slide 28 vẽ rõ ràng F0, F1, F2. Đây là LỖI của bộ slide chứ không phải bạn đọc nhầm; sách in F2. (2) F0 <strong>KHÔNG được tính</strong> vào 13 tầng, nhờ vậy phép cộng 2 + 5 + 6 mới ra. Tính cả F0 thì thành 14, và không hình nào trong chương nói 14.</p>`],

      [30, 'Instruction Decode Unit — dual pipeline, in-order issue, and why WAR hazards simply cannot happen',
        `<p class="y-chinh">🎯 The slide that tells you what kind of superscalar the Cortex-A8 really is. It has a <strong>dual pipeline structure, pipe0 and pipe1</strong>, so <strong>two instructions can progress at a time</strong> — but <strong>all issued instructions progress in order</strong>. Two tracks, one queue discipline.</p>
<table>
<tr><th>Rule on the slide</th><th>Consequence</th></tr>
<tr><td>Decodes and sequences all <strong>ARM and Thumb</strong> instructions</td><td>Two instruction encodings, one decoder — Thumb is the 16-bit compressed form</td></tr>
<tr><td><strong>Pipe0 contains the older instruction in program order</strong></td><td>Program order is physically encoded in <em>which pipe you are in</em></td></tr>
<tr><td><strong>If instruction in pipe0 cannot issue, instruction in pipe1 will not issue</strong></td><td>Strict in-order issue: the younger instruction can never overtake the older one</td></tr>
<tr><td><strong>Results written back to register file at end of execution pipeline</strong></td><td>All writes happen at E5, in order</td></tr>
<tr><td>This <strong>prevents WAR hazards</strong></td><td>A later write cannot possibly land before an earlier read — the ordering makes it impossible</td></tr>
<tr><td>Keeps track of <strong>WAW hazards</strong>, and recovery from flush conditions is straightforward</td><td>Tracked, not eliminated — but cheap to track when everything is ordered</td></tr>
<tr><td><strong>Main concern of the decode pipeline is prevention of RAW hazards</strong></td><td>The only <em>real</em> dependency is the only one left to worry about</td></tr>
</table>
<ul>
<li><strong>This is the exam-critical contrast of the whole chapter.</strong> Put the two designs side by side:</li>
</ul>
<table>
<tr><th></th><th>Intel Core (slides 21–26)</th><th>ARM Cortex-A8 (slides 27–36)</th></tr>
<tr><td>Issue order</td><td>Out of order</td><td><strong>In order</strong></td></tr>
<tr><td>Register renaming</td><td>Yes — 16 → 128</td><td><strong>No</strong> — architectural register file only</td></tr>
<tr><td>Reorder buffer</td><td>Yes — 126 entries</td><td><strong>No</strong> — pending/replay queue instead</td></tr>
<tr><td>How WAR is handled</td><td>Renamed away</td><td><strong>Made impossible by ordering</strong></td></tr>
<tr><td>How WAW is handled</td><td>Renamed away</td><td>Tracked by the scoreboard</td></tr>
<tr><td>Issue width</td><td>Wider (3 micro-ops allocated per cycle)</td><td>2 instructions per cycle</td></tr>
<tr><td>Cost paid</td><td>Silicon area and power</td><td>Lost ILP when a stall occurs</td></tr>
</table>
<ul>
<li><strong>Why in-order issue kills WAR for free.</strong> A WAR hazard needs a <em>later</em> write to complete before an <em>earlier</em> read. If every instruction reads its operands at E0 in program order and writes at E5 in program order, the later write is at least one stage behind the earlier read, always. The hazard is not detected and fixed; the pipeline geometry makes it unrepresentable. Compare with renaming (slide 26), which solves the same problem by spending 112 extra registers.</li>
<li><strong>"If pipe0 cannot issue, pipe1 will not issue" is where the A8 loses performance.</strong> One stalled instruction blocks its partner even if the partner is completely independent. The Intel Core would simply have run the independent one first. That single sentence is the price of in-order design, and Table 18.4 (slide 33) counts it in cycles.</li>
<li><strong>Thumb decoding in the same unit matters for embedded work.</strong> Thumb instructions are 16 bits, halving code size and therefore I-cache pressure — the Chương 4 argument applied to instructions. Slide 31 shows the decompression happens at D0.</li>
<li><strong>"Recovery from flush conditions is straightforward" is the hidden reward.</strong> Because nothing was written out of order, a flush is just "stop and refill" — no rollback of committed state, no ROB to unwind. An in-order machine pays every cycle in lost parallelism, but it pays nothing when it is wrong.</li>
</ul>
<p class="meo">💡 One sentence to hold the two chips apart: <strong>Intel spends transistors to remove false dependencies; ARM spends ordering rules to make them impossible.</strong> Both end up worrying only about RAW — which is the one dependency nobody can remove.</p>
<p class="pitfall">⚠️ A very common exam error: writing "the Cortex-A8 uses register renaming to avoid WAR hazards". It does <strong>not</strong>. The slide's own words are that writing results back at the end of the execution pipeline <em>prevents</em> WAR hazards. No renaming appears anywhere in the A8 slides.</p>`,
        `<p class="y-chinh">🎯 Slide cho bạn biết Cortex-A8 THẬT RA là loại superscalar nào. Nó có <strong>cấu trúc đường ống ĐÔI, pipe0 và pipe1</strong>, nên <strong>hai lệnh tiến được cùng lúc</strong> — nhưng <strong>mọi lệnh đã phát đều tiến ĐÚNG THỨ TỰ</strong>. Hai làn, một kỷ luật xếp hàng.</p>
<table>
<tr><th>Luật trên slide</th><th>Hệ quả</th></tr>
<tr><td>Giải mã và tuần tự hoá mọi lệnh <strong>ARM và Thumb</strong></td><td>Hai kiểu mã hoá lệnh, một bộ giải mã — Thumb là dạng nén 16 bit</td></tr>
<tr><td><strong>Pipe0 chứa lệnh CŨ HƠN theo thứ tự chương trình</strong></td><td>Thứ tự chương trình được mã hoá VẬT LÝ vào chuyện <em>bạn đang ở ống nào</em></td></tr>
<tr><td><strong>Nếu lệnh ở pipe0 không phát được thì lệnh ở pipe1 cũng KHÔNG phát</strong></td><td>Phát lệnh đúng thứ tự nghiêm ngặt: lệnh trẻ không bao giờ vượt mặt lệnh già</td></tr>
<tr><td><strong>Kết quả ghi ngược vào tệp thanh ghi ở CUỐI đường ống thực thi</strong></td><td>Mọi lần ghi đều xảy ra ở E5, đúng thứ tự</td></tr>
<tr><td>Điều này <strong>NGĂN được hazard WAR</strong></td><td>Một lần ghi sau không thể nào đáp xuống trước một lần đọc trước — chính THỨ TỰ làm điều đó bất khả</td></tr>
<tr><td>Vẫn <strong>theo dõi hazard WAW</strong>, và phục hồi sau các tình huống xả ống là chuyện đơn giản</td><td>THEO DÕI, không phải loại bỏ — nhưng theo dõi rẻ khi mọi thứ đã có thứ tự</td></tr>
<tr><td><strong>Mối lo chính của đường ống giải mã là NGĂN hazard RAW</strong></td><td>Phụ thuộc <em>THẬT</em> duy nhất cũng là thứ duy nhất còn phải lo</td></tr>
</table>
<ul>
<li><strong>Đây là phép đối chiếu quan trọng nhất cho bài thi của cả chương.</strong> Đặt hai thiết kế cạnh nhau:</li>
</ul>
<table>
<tr><th></th><th>Intel Core (slide 21–26)</th><th>ARM Cortex-A8 (slide 27–36)</th></tr>
<tr><td>Thứ tự phát lệnh</td><td>KHÔNG theo thứ tự</td><td><strong>ĐÚNG thứ tự</strong></td></tr>
<tr><td>Đổi tên thanh ghi</td><td>Có — 16 → 128</td><td><strong>KHÔNG</strong> — chỉ có tệp thanh ghi kiến trúc</td></tr>
<tr><td>Bộ đệm sắp xếp lại (ROB)</td><td>Có — 126 mục</td><td><strong>KHÔNG</strong> — thay bằng hàng đợi pending/replay</td></tr>
<tr><td>Xử lý WAR bằng cách nào</td><td>Đổi tên cho biến mất</td><td><strong>Làm cho nó BẤT KHẢ nhờ thứ tự</strong></td></tr>
<tr><td>Xử lý WAW bằng cách nào</td><td>Đổi tên cho biến mất</td><td>Scoreboard theo dõi</td></tr>
<tr><td>Độ rộng phát lệnh</td><td>Rộng hơn (cấp phát 3 micro-op mỗi chu kỳ)</td><td>2 lệnh mỗi chu kỳ</td></tr>
<tr><td>Cái giá phải trả</td><td>Diện tích silicon và điện năng</td><td>Mất ILP mỗi khi có một cú kẹt</td></tr>
</table>
<ul>
<li><strong>Vì sao phát đúng thứ tự giết WAR miễn phí.</strong> Hazard WAR cần một lần ghi <em>SAU</em> hoàn thành trước một lần đọc <em>TRƯỚC</em>. Nếu mọi lệnh đều đọc toán hạng ở E0 theo thứ tự chương trình và ghi ở E5 theo thứ tự chương trình, thì lần ghi sau LUÔN chậm hơn lần đọc trước ít nhất một tầng. Hazard không hề được phát hiện rồi sửa; chính HÌNH HỌC của đường ống làm nó không biểu diễn được. So với đổi tên (slide 26) — giải cùng bài toán ấy bằng cách chi thêm 112 thanh ghi.</li>
<li><strong>"Pipe0 không phát được thì pipe1 cũng không" là chỗ A8 MẤT hiệu năng.</strong> Một lệnh kẹt chặn luôn bạn đồng hành của nó, kể cả khi bạn đó hoàn toàn độc lập. Intel Core thì đơn giản là chạy cái độc lập trước. Riêng câu đó là cái giá của thiết kế đúng-thứ-tự, và Table 18.4 (slide 33) đếm nó ra thành chu kỳ.</li>
<li><strong>Giải mã Thumb trong cùng khối là chuyện đáng kể với đồ nhúng.</strong> Lệnh Thumb dài 16 bit, giảm một nửa kích thước mã và do đó giảm áp lực lên I-cache — lập luận của Chương 4 áp lên phía LỆNH. Slide 31 cho thấy việc giải nén xảy ra ở D0.</li>
<li><strong>"Phục hồi sau xả ống là chuyện đơn giản" là phần thưởng giấu kín.</strong> Vì không có gì bị ghi sai thứ tự, nên xả ống chỉ là "dừng và nạp lại" — không phải quay lui trạng thái đã cam kết, không có ROB nào phải tháo. Máy đúng-thứ-tự trả giá MỖI CHU KỲ bằng song song bị mất, nhưng nó KHÔNG trả gì khi đoán sai.</li>
</ul>
<p class="meo">💡 Một câu để giữ hai con chip tách bạch: <strong>Intel chi TRANSISTOR để xoá phụ thuộc giả; ARM chi LUẬT THỨ TỰ để phụ thuộc giả không thể xảy ra.</strong> Cả hai cuối cùng chỉ còn phải lo RAW — phụ thuộc duy nhất mà không ai xoá được.</p>
<p class="pitfall">⚠️ Lỗi thi rất hay gặp: viết "Cortex-A8 dùng đổi tên thanh ghi để tránh hazard WAR". KHÔNG hề. Chữ của chính slide là việc ghi kết quả ngược vào tệp thanh ghi ở cuối đường ống thực thi <em>NGĂN</em> hazard WAR. Không một slide nào của phần A8 nhắc tới đổi tên thanh ghi.</p>`],

      [31, 'Instruction Processing Stages — the five decode stages D0 to D4',
        `<p class="y-chinh">🎯 Five circles, one per decode stage, and together they are the five stages that slide 27 counted between fetch and execute. This is where an in-order superscalar does <em>all</em> of its thinking.</p>
<table>
<tr><th>Stage</th><th>What the circle says</th><th>Why it needs a stage of its own</th></tr>
<tr><td><strong>D0</strong></td><td>Thumb instructions decompressed and preliminary decode is performed</td><td>16-bit Thumb must be expanded to the internal form before anything else can look at it</td></tr>
<tr><td><strong>D1</strong></td><td>Instruction decode is completed</td><td>Opcode, operands and register numbers are now known</td></tr>
<tr><td><strong>D2</strong></td><td>Writes instructions into and reads instructions from pending/replay queue</td><td>The buffer that holds instructions which must be re-issued (slide 32's replay events)</td></tr>
<tr><td><strong>D3</strong></td><td>Contains the instruction scheduling logic · <strong>Scoreboard predicts register availability using static scheduling</strong> · Hazard checking is done</td><td>The decision stage: may these two instructions go together this cycle?</td></tr>
<tr><td><strong>D4</strong></td><td>Final decode for control signals for integer execute load/store units</td><td>Turns the decision into the actual control wires</td></tr>
</table>
<ul>
<li><strong>The single most important word on this slide is "static".</strong> The scoreboard <em>predicts register availability using static scheduling</em> — it knows, from a fixed table, that an ALU result appears at E2 and a load result at E3, and it computes in advance when each operand will be ready. It is not watching for results to arrive dynamically the way an out-of-order scheduler does. Predictable latencies are what make an in-order machine possible; unpredictable ones (a cache miss) are exactly what forces a <em>replay</em>.</li>
<li><strong>D2 is the stage that exists because prediction can be wrong.</strong> The pending/replay queue holds instructions issued on an assumption — most often "this load will hit in the L1 data cache". When the assumption fails, the instruction is pulled back out of this queue and re-issued. Slide 32 is nothing but the price list for that event.</li>
<li><strong>Hazard checking at D3 is checking for RAW, and only RAW.</strong> Slide 30 already told you why: WAR is impossible by construction, WAW is bookkeeping. So the entire dependency machinery of an A8 boils down to one question asked at D3 — "will this operand actually be there when I need it?"</li>
<li><strong>Five stages of decode looks extravagant until you compare it with the alternative.</strong> The Intel Core replaces these with allocate, rename, reorder buffer, two micro-op queues and two schedulers — much more hardware, running out of order. ARM's five stages are the cheap way to solve the same problem, and the whole of the A8 pipeline is 13 stages, versus a Core's much deeper one.</li>
<li><strong>Connect to Chương 12.</strong> There you drew a 6-stage pipeline where "decode" was one box. Here that one box has become five stages, because deciding whether <em>two</em> instructions may proceed together is far harder than decoding one. Superscalar cost shows up in the decode stage first.</li>
</ul>
<p class="meo">💡 Remember D0–D4 as a sentence: <strong>uncompress → decode → queue → decide → wire up</strong>. The only stage that is genuinely about superscalar issue is D3; the other four are plumbing.</p>
<p class="pitfall">⚠️ Do not confuse the <strong>scoreboard</strong> here with a reorder buffer. A scoreboard is a <em>predictive table of when results will be ready</em>, consulted <em>before</em> issue to prevent a hazard. A reorder buffer is a <em>record of work in flight</em>, used <em>after</em> issue to commit or cancel it. Opposite ends of the pipeline, opposite philosophies.</p>`,
        `<p class="y-chinh">🎯 Năm vòng tròn, mỗi vòng một tầng giải mã, và gộp lại chúng chính là năm tầng mà slide 27 đã đếm giữa nạp lệnh và thực thi. Đây là chỗ một superscalar đúng-thứ-tự làm <em>TOÀN BỘ</em> phần suy nghĩ của nó.</p>
<table>
<tr><th>Tầng</th><th>Vòng tròn ghi gì</th><th>Vì sao nó cần hẳn một tầng riêng</th></tr>
<tr><td><strong>D0</strong></td><td>Lệnh Thumb được GIẢI NÉN và thực hiện giải mã sơ bộ</td><td>Thumb 16 bit phải được nở ra thành dạng nội bộ trước khi bất cứ ai nhìn vào nó</td></tr>
<tr><td><strong>D1</strong></td><td>Giải mã lệnh HOÀN TẤT</td><td>Tới đây đã biết mã lệnh, toán hạng và số hiệu thanh ghi</td></tr>
<tr><td><strong>D2</strong></td><td>Ghi lệnh vào và đọc lệnh ra từ hàng đợi pending/replay</td><td>Vùng đệm giữ những lệnh sẽ phải PHÁT LẠI (các sự kiện replay ở slide 32)</td></tr>
<tr><td><strong>D3</strong></td><td>Chứa logic lập lịch lệnh · <strong>Scoreboard DỰ ĐOÁN độ sẵn sàng của thanh ghi bằng lập lịch TĨNH</strong> · Kiểm hazard làm ở đây</td><td>Tầng RA QUYẾT ĐỊNH: hai lệnh này có được đi cùng nhau chu kỳ này không?</td></tr>
<tr><td><strong>D4</strong></td><td>Giải mã cuối để tạo tín hiệu điều khiển cho khối thực thi nguyên và khối load/store</td><td>Biến quyết định thành những sợi dây điều khiển thật</td></tr>
</table>
<ul>
<li><strong>Chữ quan trọng nhất trên slide này là "TĨNH".</strong> Scoreboard <em>dự đoán độ sẵn sàng của thanh ghi bằng lập lịch TĨNH</em> — nó biết, từ một bảng cố định, rằng kết quả ALU xuất hiện ở E2 còn kết quả load ở E3, rồi tính TRƯỚC xem mỗi toán hạng sẽ sẵn sàng lúc nào. Nó KHÔNG ngồi rình kết quả về theo kiểu động như bộ lập lịch không-theo-thứ-tự. Độ trễ ĐOÁN ĐƯỢC là thứ làm cho máy đúng-thứ-tự khả thi; độ trễ KHÔNG đoán được (một lần trượt cache) chính là thứ buộc phải <em>REPLAY</em>.</li>
<li><strong>D2 tồn tại chính vì dự đoán có thể sai.</strong> Hàng đợi pending/replay giữ những lệnh đã phát dựa trên một giả định — hay gặp nhất là "lệnh load này sẽ trúng cache dữ liệu L1". Giả định hỏng thì lệnh bị lôi ngược ra khỏi hàng đợi này và phát lại. Slide 32 chẳng qua là bảng giá cho sự kiện đó.</li>
<li><strong>Kiểm hazard ở D3 là kiểm RAW, và CHỈ RAW.</strong> Slide 30 đã nói lý do: WAR bất khả do cấu trúc, WAW chỉ là sổ sách. Nên toàn bộ bộ máy phụ thuộc của A8 rút gọn thành một câu hỏi đặt ra ở D3 — "toán hạng này có thật sự nằm đó lúc tôi cần không?"</li>
<li><strong>Năm tầng chỉ để giải mã nghe xa xỉ, cho tới khi bạn so với phương án còn lại.</strong> Intel Core thay năm tầng này bằng allocate, rename, bộ đệm sắp xếp lại, hai hàng đợi micro-op và hai bộ lập lịch — nhiều phần cứng hơn hẳn, chạy không theo thứ tự. Năm tầng của ARM là cách RẺ để giải cùng bài toán, và cả đường ống A8 chỉ 13 tầng, so với đường ống sâu hơn nhiều của Core.</li>
<li><strong>Nối về Chương 12.</strong> Ở đó bạn vẽ đường ống 6 tầng, trong đó "giải mã" là MỘT cái ô. Ở đây một cái ô ấy đã thành NĂM tầng, vì quyết định xem <em>HAI</em> lệnh có được đi cùng nhau hay không khó hơn nhiều so với giải mã MỘT lệnh. Cái giá của superscalar hiện ra ở tầng giải mã trước tiên.</li>
</ul>
<p class="meo">💡 Nhớ D0–D4 thành một câu: <strong>giải nén → giải mã → xếp hàng → quyết định → nối dây</strong>. Tầng duy nhất thật sự nói về chuyện phát lệnh superscalar là D3; bốn tầng còn lại là đường ống nước.</p>
<p class="pitfall">⚠️ Đừng lẫn <strong>scoreboard</strong> ở đây với bộ đệm sắp xếp lại. Scoreboard là <em>bảng DỰ ĐOÁN khi nào kết quả sẵn sàng</em>, tra <em>TRƯỚC</em> khi phát để NGĂN hazard. Bộ đệm sắp xếp lại là <em>sổ ghi việc đang bay</em>, dùng <em>SAU</em> khi phát để cam kết hoặc huỷ. Hai đầu ngược nhau của đường ống, hai triết lý ngược nhau.</p>`],

      [32, 'Table 18.3 — Cortex-A8 Memory System Effects on Instruction Timings (the four replay events)',
        `<p class="y-chinh">🎯 The price list for being wrong about memory. An in-order machine issues optimistically — it assumes the load will hit — and when it does not, the instruction is <strong>replayed</strong>. This table says what each kind of wrong assumption costs.</p>
<table>
<tr><th>Replay event</th><th>Delay</th><th>What actually happens (slide's description)</th></tr>
<tr><td><strong>Load data miss</strong></td><td><strong>8 cycles</strong></td><td>1. A load instruction misses in the L1 data cache. 2. A request is then made to the L2 data cache. 3. If a miss also occurs in the L2 data cache, a <em>second</em> replay occurs; the number of stall cycles depends on external system memory timing. The minimum time to receive the critical word for an L2 miss is approximately <strong>25 cycles</strong>, but can be much longer because of L3 memory latencies</td></tr>
<tr><td><strong>Data TLB miss</strong></td><td><strong>24 cycles</strong></td><td>1. A table walk because of a miss in the L1 TLB causes a 24-cycle delay, <em>assuming the translation table entries are found in the L2 cache</em>. 2. If they are not in L2, the stall depends on external system memory timing</td></tr>
<tr><td><strong>Store buffer full</strong></td><td><strong>8 cycles plus latency to drain fill buffer</strong></td><td>1. A store miss does <em>not</em> stall at all unless the store buffer is full. 2. When it is full, the delay is at least eight cycles, and more if draining takes longer</td></tr>
<tr><td><strong>Unaligned load or store request</strong></td><td><strong>8 cycles</strong></td><td>1. A load whose full access is not contained within a <strong>128-bit</strong> boundary costs 8 cycles. 2. A store whose full access is not contained within a <strong>64-bit</strong> boundary costs 8 cycles</td></tr>
</table>
<p class="dap-an">✅ Put the numbers in proportion, because that is what the table is for. An L1 load miss costs <strong>8 cycles</strong>; an L2 miss costs at least <strong>25 ≈ 3,1×</strong> more; a data TLB miss costs <strong>24 cycles = 3×</strong> an L1 load miss. The most expensive single event in the table is <em>not</em> a data miss at all — it is a <strong>translation</strong> miss, because a table walk is itself a chain of memory accesses. Chương 8 called that a page-table walk; here is its price in cycles.</p>
<ul>
<li><strong>Why "replay" and not "stall" — the distinction is the exam point.</strong> A stall freezes the pipeline where it is. A <em>replay</em> means the instruction was already issued on a wrong assumption and must be sent through again. The pending/replay queue at D2 (slide 31) exists exactly for this, and the "replay" arrow on Figures 18.10 and 18.11 goes from E4 back to D2.</li>
<li><strong>Read the store row backwards and it tells you something reassuring.</strong> "A store instruction miss does not result in any stalls <em>unless</em> the store buffer is full." Stores are fire-and-forget: the processor drops the value into a buffer and moves on. This is the write buffer of Chương 4, and the table proves it works — stores are free right up to the moment the buffer overflows.</li>
<li><strong>The alignment penalty is 8 cycles, and the two boundaries differ: 128 bits for loads, 64 bits for stores.</strong> Cross the boundary and one access becomes two, plus fix-up. Practical consequence for PRF192-style code: a <code>struct</code> whose fields are packed without padding can turn ordinary field accesses into 8-cycle events. This is why compilers align by default and why <code>#pragma pack</code> is a performance decision, not a formatting one.</li>
<li><strong>Every number here is a <em>minimum</em>.</strong> Two rows say explicitly that the real delay "depends on external system memory timing", and the L2-miss line says 25 cycles "can be much longer because of L3 memory latencies". A table of latencies on a real chip is always a floor.</li>
<li><strong>This table is the memory hierarchy of Chương 4 stated in a processor's own units.</strong> There you measured L1, L2 and DRAM in nanoseconds; here the same hierarchy appears in cycles, as a penalty on instruction timing. Same hierarchy, two vocabularies.</li>
</ul>
<p class="meo">💡 Keep three numbers: <strong>8 · 24 · 25</strong>. Eight cycles is the standard replay penalty, 24 is a TLB table walk, 25 is the <em>floor</em> for going out to memory. Any exam question about A8 memory timing is built from those three.</p>
<p class="pitfall">⚠️ Trap: reading "load data miss = 8 cycles" as the cost of a cache miss. It is the cost of the <em>replay</em> when the L1 misses and L2 hits. If L2 also misses, a <em>second</em> replay is triggered and the cost jumps to 25 cycles or far worse. The table's first column names events, not totals.</p>`,
        `<p class="y-chinh">🎯 Bảng giá cho việc đoán sai về bộ nhớ. Máy đúng-thứ-tự phát lệnh một cách LẠC QUAN — nó giả định lệnh load sẽ trúng — và khi không trúng thì lệnh bị <strong>REPLAY (phát lại)</strong>. Bảng này nói mỗi kiểu giả định sai tốn bao nhiêu.</p>
<table>
<tr><th>Sự kiện replay</th><th>Độ trễ</th><th>Thật ra chuyện gì xảy ra (theo mô tả của slide)</th></tr>
<tr><td><strong>Load data miss</strong> — load trượt dữ liệu</td><td><strong>8 chu kỳ</strong></td><td>1. Một lệnh load trượt ở cache dữ liệu L1. 2. Một yêu cầu được gửi tới cache dữ liệu L2. 3. Nếu L2 cũng trượt thì xảy ra replay <em>LẦN HAI</em>; số chu kỳ kẹt phụ thuộc định thời bộ nhớ hệ thống bên ngoài. Thời gian TỐI THIỂU để nhận được từ quan trọng khi trượt L2 là khoảng <strong>25 chu kỳ</strong>, nhưng có thể lâu hơn nhiều vì độ trễ bộ nhớ L3</td></tr>
<tr><td><strong>Data TLB miss</strong> — trượt TLB dữ liệu</td><td><strong>24 chu kỳ</strong></td><td>1. Một lượt duyệt bảng do trượt TLB L1 gây trễ 24 chu kỳ, <em>với giả định các mục bảng dịch địa chỉ được tìm thấy trong cache L2</em>. 2. Nếu chúng không có trong L2, độ kẹt phụ thuộc định thời bộ nhớ hệ thống bên ngoài</td></tr>
<tr><td><strong>Store buffer full</strong> — đầy đệm ghi</td><td><strong>8 chu kỳ cộng thời gian xả đệm fill</strong></td><td>1. Một lệnh store trượt <em>KHÔNG</em> gây kẹt gì cả, trừ khi đệm store đã đầy. 2. Khi nó đầy, độ trễ ít nhất tám chu kỳ, và nhiều hơn nếu xả bớt mục mất lâu hơn</td></tr>
<tr><td><strong>Unaligned load hoặc store</strong> — truy cập lệch biên</td><td><strong>8 chu kỳ</strong></td><td>1. Một lệnh load mà toàn bộ truy cập không nằm gọn trong một biên <strong>128 bit</strong> thì phạt 8 chu kỳ. 2. Một lệnh store mà toàn bộ truy cập không nằm gọn trong một biên <strong>64 bit</strong> thì phạt 8 chu kỳ</td></tr>
</table>
<p class="dap-an">✅ Đặt các con số vào tỉ lệ, vì đó mới là công dụng của bảng. Một lần trượt load ở L1 tốn <strong>8 chu kỳ</strong>; một lần trượt L2 tốn ít nhất <strong>25 ≈ gấp 3,1 lần</strong>; một lần trượt TLB dữ liệu tốn <strong>24 chu kỳ = gấp 3 lần</strong> trượt load L1. Sự kiện ĐẮT NHẤT trong bảng hoá ra <em>KHÔNG</em> phải là trượt dữ liệu — mà là trượt <strong>DỊCH ĐỊA CHỈ</strong>, vì một lượt duyệt bảng bản thân nó là cả một chuỗi truy cập bộ nhớ. Chương 8 gọi đó là duyệt bảng trang; đây là giá của nó tính bằng chu kỳ.</p>
<ul>
<li><strong>Vì sao gọi là "replay" chứ không phải "stall" — chỗ phân biệt này là điểm thi.</strong> Stall là đóng băng đường ống tại chỗ. <em>Replay</em> nghĩa là lệnh ĐÃ được phát đi dựa trên một giả định sai và phải đẩy qua lần nữa. Hàng đợi pending/replay ở D2 (slide 31) tồn tại đúng vì chuyện này, và mũi tên "replay" trên Figure 18.10 và 18.11 chạy từ E4 ngược về D2.</li>
<li><strong>Đọc ngược dòng store thì nó nói một điều đáng yên tâm.</strong> "Một lệnh store trượt KHÔNG gây kẹt nào, <em>TRỪ KHI</em> đệm store đã đầy." Store là kiểu bắn-rồi-quên: bộ xử lý thả giá trị vào một vùng đệm rồi đi tiếp. Đây chính là đệm ghi của Chương 4, và bảng này chứng minh nó chạy được — store miễn phí cho tới đúng khoảnh khắc vùng đệm tràn.</li>
<li><strong>Phạt lệch biên là 8 chu kỳ, và hai cái biên KHÁC nhau: 128 bit cho load, 64 bit cho store.</strong> Vượt biên thì một truy cập thành hai, cộng công ghép lại. Hệ quả thực tế cho mã kiểu PRF192: một <code>struct</code> bị nén sát không đệm có thể biến những lần đọc trường bình thường thành sự kiện 8 chu kỳ. Đó là lý do trình biên dịch mặc định căn biên, và <code>#pragma pack</code> là một quyết định về HIỆU NĂNG chứ không phải về định dạng.</li>
<li><strong>Mọi con số ở đây đều là con số TỐI THIỂU.</strong> Hai dòng nói thẳng rằng độ trễ thật "phụ thuộc định thời bộ nhớ hệ thống bên ngoài", và dòng trượt L2 ghi 25 chu kỳ "có thể lâu hơn nhiều vì độ trễ bộ nhớ L3". Bảng độ trễ trên chip thật lúc nào cũng là SÀN.</li>
<li><strong>Bảng này chính là phân cấp bộ nhớ của Chương 4 phát biểu bằng đơn vị của bộ xử lý.</strong> Ở đó bạn đo L1, L2 và DRAM bằng nano giây; ở đây cùng phân cấp ấy hiện ra bằng CHU KỲ, dưới dạng tiền phạt lên thời gian chạy lệnh. Cùng một phân cấp, hai thứ tiếng.</li>
</ul>
<p class="meo">💡 Giữ ba con số: <strong>8 · 24 · 25</strong>. Tám chu kỳ là mức phạt replay chuẩn, 24 là một lượt duyệt bảng TLB, 25 là SÀN cho việc phải đi ra bộ nhớ. Mọi câu hỏi thi về định thời bộ nhớ của A8 đều dựng từ ba con số đó.</p>
<p class="pitfall">⚠️ Bẫy: hiểu "load data miss = 8 chu kỳ" là giá của MỘT lần trượt cache. Không — đó là giá của lần <em>REPLAY</em> khi L1 trượt mà L2 trúng. Nếu L2 cũng trượt thì kích hoạt replay <em>LẦN HAI</em> và giá nhảy lên 25 chu kỳ hoặc tệ hơn nhiều. Cột đầu của bảng đặt tên SỰ KIỆN, không phải TỔNG.</p>`],

      [33, 'Table 18.4 — Cortex-A8 Dual-Issue Restrictions (six reasons two instructions cannot go together)',
        `<p class="y-chinh">🎯 The most exam-heavy table in the chapter. Dual issue is the A8's whole claim to being superscalar — and this table lists the six situations in which it silently fails and you get one instruction per cycle instead of two.</p>
<table>
<tr><th>Restriction</th><th>Description (slide)</th><th>Example</th><th>Cycle</th><th>Why</th></tr>
<tr><td rowspan="3"><strong>Load/store resource hazard</strong></td><td rowspan="3">There is only one LS pipeline. Only one LS instruction can be issued per cycle. It can be in pipeline 0 or pipeline 1</td><td><code>LDR r5, [r6]</code></td><td>1</td><td>—</td></tr>
<tr><td><code>STR r7, [r8]</code></td><td>2</td><td>Wait for LS unit</td></tr>
<tr><td><code>MOV r9, r10</code></td><td>2</td><td>Dual issue possible</td></tr>
<tr><td rowspan="3"><strong>Multiply resource hazard</strong></td><td rowspan="3">There is only one multiply pipeline, and it is only available in pipeline 0</td><td><code>ADD r1, r2, r3</code></td><td>1</td><td>—</td></tr>
<tr><td><code>MUL r4, r5, r6</code></td><td>2</td><td>Wait for pipeline 0</td></tr>
<tr><td><code>MUL r7, r8, r9</code></td><td>3</td><td>Wait for multiply unit</td></tr>
<tr><td rowspan="3"><strong>Branch resource hazard</strong></td><td rowspan="3">There can be only one branch per cycle. It can be in pipeline 0 or pipeline 1. A branch is <em>any instruction that changes the PC</em></td><td><code>BX r1</code></td><td>1</td><td>—</td></tr>
<tr><td><code>BEQ 0x1000</code></td><td>2</td><td>Wait for branch</td></tr>
<tr><td><code>ADD r1, r2, r3</code></td><td>2</td><td>Dual issue possible</td></tr>
<tr><td rowspan="3"><strong>Data output hazard (WAW)</strong></td><td rowspan="3">Instructions with the same destination cannot be issued in the same cycle. This can happen with conditional code</td><td><code>MOVEQ r1, r2</code></td><td>1</td><td>—</td></tr>
<tr><td><code>MOVNE r1, r3</code></td><td>2</td><td>Wait because of output dependency</td></tr>
<tr><td><code>LDR r5, [r6]</code></td><td>2</td><td>Dual issue possible</td></tr>
<tr><td rowspan="3"><strong>Data source hazard (RAW)</strong></td><td rowspan="3">Instructions cannot be issued if their data is not available. See the scheduling tables for source requirements and stages results</td><td><code>ADD r1, r2, r3</code></td><td>1</td><td>—</td></tr>
<tr><td><code>ADD r4, r1, r6</code></td><td>2</td><td>Wait for r1</td></tr>
<tr><td><code>LDR r7, [r4]</code></td><td>4</td><td>Wait <em>two</em> cycles for r4</td></tr>
<tr><td rowspan="5"><strong>Multi-cycle instructions</strong></td><td rowspan="5">Multi-cycle instructions must issue in pipeline 0 and can only dual issue in their last iteration</td><td><code>MOV r1, r2</code></td><td>1</td><td>—</td></tr>
<tr><td><code>LDM r3, {r4-r7}</code></td><td>2</td><td>Wait for pipeline 0, transfer r4</td></tr>
<tr><td>LDM (cycle 2)</td><td>3</td><td>Transfer r5, r6</td></tr>
<tr><td>LDM (cycle 3)</td><td>4</td><td>Transfer r7</td></tr>
<tr><td><code>ADD r8, r9, r10</code></td><td>4</td><td>Dual issue possible on last transfer</td></tr>
</table>
<ul>
<li><strong>Sort the six into two families and the table stops being a list to memorise.</strong> Three are <em>resource</em> conflicts (load/store, multiply, branch) — there is only one of that unit, so two such instructions cannot go together. Two are <em>data</em> conflicts (output = WAW, source = RAW). One is <em>structural</em> (a multi-cycle instruction occupies pipe 0 for several cycles). Slide 7 of this chapter named exactly these categories; here they are on a real chip.</li>
<li><strong>You could have predicted the first three from Figure 18.11 alone.</strong> That figure draws <em>one</em> load/store pipe, <em>one</em> multiplier (MUL1/MUL2/MUL3, in pipe 0 only), and one branch resolution point. Count the boxes, get the restrictions. This is the most transferable skill in the chapter: a block diagram <em>is</em> a restriction table.</li>
<li><strong>The data source example rewards careful reading.</strong> <code>ADD r4, r1, r6</code> waits one cycle for <code>r1</code>, but <code>LDR r7, [r4]</code> waits <em>two</em> cycles for <code>r4</code> — issuing at cycle 4, not 3. Why the difference: an address operand is needed earlier in the pipeline (at the AGU in E1) than an ALU operand (E2). <strong>The same result, consumed by a different stage, costs a different number of stall cycles.</strong> Slide 36 uses exactly this fact twice.</li>
<li><strong>"Data output hazard ... can happen with conditional code" is a very ARM remark.</strong> <code>MOVEQ r1, r2</code> and <code>MOVNE r1, r3</code> are the two halves of an if/else written without a branch — ARM's predicated execution, which Chương 13 introduced as a way to avoid branches. The table shows the cost: predication dodges a branch but creates a WAW, so the two halves cannot dual-issue anyway. An honest trade-off, not a free win.</li>
<li><strong>Note what would fix five of these six: register renaming and out-of-order issue.</strong> The Intel Core would rename away the output hazard and simply issue an independent instruction while waiting for <code>r1</code>. The A8 cannot, and this table is exactly the bill for that decision (slide 30).</li>
</ul>
<p class="dap-an">✅ Read the "Cycle" column as a scoreboard verdict, not as wall-clock arithmetic: every time a cycle number <em>repeats</em> (1,2,<strong>2</strong> or 1,2,3,4,<strong>4</strong>), two instructions issued together; every time it <em>advances</em>, dual issue failed. In the six examples, dual issue succeeds in only <strong>3</strong> of the 6 cases — a blunt reminder that a "2-issue" machine does not average 2.</p>
<p class="meo">💡 Memorise as <strong>one LS unit · one multiplier (pipe 0 only) · one branch · no same destination · no missing data · multi-cycle owns pipe 0</strong>. Six items, and three of them are just "there is only one of these".</p>
<p class="pitfall">⚠️ Trap in the branch row: the slide defines a branch as <strong>any instruction that changes the PC</strong>. On ARM, <code>MOV pc, lr</code> and <code>LDR pc, [r13], #4</code> are branches even though they are spelled as a move and a load. Slide 36 issues exactly such an <code>LDR pc</code> and pays a cycle for it.</p>`,
        `<p class="y-chinh">🎯 Bảng nặng điểm thi nhất của chương. Phát đôi là toàn bộ danh nghĩa superscalar của A8 — và bảng này liệt kê SÁU tình huống mà nó lặng lẽ hỏng, để bạn nhận một lệnh mỗi chu kỳ thay vì hai.</p>
<table>
<tr><th>Luật cấm</th><th>Mô tả (theo slide)</th><th>Ví dụ</th><th>Chu kỳ</th><th>Vì sao</th></tr>
<tr><td rowspan="3"><strong>Xung đột tài nguyên load/store</strong></td><td rowspan="3">Chỉ có MỘT đường ống LS. Mỗi chu kỳ chỉ phát được MỘT lệnh LS. Nó nằm ở ống 0 hay ống 1 đều được</td><td><code>LDR r5, [r6]</code></td><td>1</td><td>—</td></tr>
<tr><td><code>STR r7, [r8]</code></td><td>2</td><td>Chờ khối LS</td></tr>
<tr><td><code>MOV r9, r10</code></td><td>2</td><td>Phát đôi được</td></tr>
<tr><td rowspan="3"><strong>Xung đột tài nguyên nhân</strong></td><td rowspan="3">Chỉ có MỘT đường ống nhân, và nó chỉ có ở ống 0</td><td><code>ADD r1, r2, r3</code></td><td>1</td><td>—</td></tr>
<tr><td><code>MUL r4, r5, r6</code></td><td>2</td><td>Chờ ống 0</td></tr>
<tr><td><code>MUL r7, r8, r9</code></td><td>3</td><td>Chờ khối nhân</td></tr>
<tr><td rowspan="3"><strong>Xung đột tài nguyên rẽ nhánh</strong></td><td rowspan="3">Mỗi chu kỳ chỉ được MỘT lệnh rẽ nhánh. Ở ống 0 hay ống 1 đều được. Rẽ nhánh là <em>BẤT KỲ lệnh nào làm thay đổi PC</em></td><td><code>BX r1</code></td><td>1</td><td>—</td></tr>
<tr><td><code>BEQ 0x1000</code></td><td>2</td><td>Chờ khối rẽ nhánh</td></tr>
<tr><td><code>ADD r1, r2, r3</code></td><td>2</td><td>Phát đôi được</td></tr>
<tr><td rowspan="3"><strong>Hazard đầu ra (WAW)</strong></td><td rowspan="3">Các lệnh có cùng ĐÍCH không được phát trong cùng một chu kỳ. Chuyện này hay xảy ra với mã có điều kiện</td><td><code>MOVEQ r1, r2</code></td><td>1</td><td>—</td></tr>
<tr><td><code>MOVNE r1, r3</code></td><td>2</td><td>Chờ vì phụ thuộc đầu ra</td></tr>
<tr><td><code>LDR r5, [r6]</code></td><td>2</td><td>Phát đôi được</td></tr>
<tr><td rowspan="3"><strong>Hazard nguồn dữ liệu (RAW)</strong></td><td rowspan="3">Không phát được lệnh nếu dữ liệu của nó chưa có. Xem các bảng lập lịch để biết yêu cầu nguồn và tầng cho kết quả</td><td><code>ADD r1, r2, r3</code></td><td>1</td><td>—</td></tr>
<tr><td><code>ADD r4, r1, r6</code></td><td>2</td><td>Chờ r1</td></tr>
<tr><td><code>LDR r7, [r4]</code></td><td>4</td><td>Chờ r4 <em>HAI</em> chu kỳ</td></tr>
<tr><td rowspan="5"><strong>Lệnh nhiều chu kỳ</strong></td><td rowspan="5">Lệnh nhiều chu kỳ phải phát ở ống 0 và chỉ phát đôi được ở vòng CUỐI của nó</td><td><code>MOV r1, r2</code></td><td>1</td><td>—</td></tr>
<tr><td><code>LDM r3, {r4-r7}</code></td><td>2</td><td>Chờ ống 0, chuyển r4</td></tr>
<tr><td>LDM (chu kỳ 2)</td><td>3</td><td>Chuyển r5, r6</td></tr>
<tr><td>LDM (chu kỳ 3)</td><td>4</td><td>Chuyển r7</td></tr>
<tr><td><code>ADD r8, r9, r10</code></td><td>4</td><td>Phát đôi được ở lượt chuyển cuối</td></tr>
</table>
<ul>
<li><strong>Xếp sáu luật thành hai họ là bảng thôi còn là danh sách phải học thuộc.</strong> Ba cái là xung đột <em>TÀI NGUYÊN</em> (load/store, nhân, rẽ nhánh) — khối đó chỉ có một, nên hai lệnh loại ấy không đi cùng nhau được. Hai cái là xung đột <em>DỮ LIỆU</em> (đầu ra = WAW, nguồn = RAW). Một cái là <em>CẤU TRÚC</em> (lệnh nhiều chu kỳ chiếm ống 0 vài chu kỳ liền). Slide 7 của chính chương này đã gọi tên đúng những nhóm đó; đây là chúng trên một con chip thật.</li>
<li><strong>Ba luật đầu bạn ĐOÁN được chỉ từ Figure 18.11.</strong> Hình đó vẽ <em>MỘT</em> ống load/store, <em>MỘT</em> bộ nhân (MUL1/MUL2/MUL3, chỉ ở ống 0), và một điểm phân giải rẽ nhánh. Đếm ô là ra luật cấm. Đây là kỹ năng chuyển giao được nhất của cả chương: một sơ đồ khối CHÍNH LÀ một bảng luật cấm.</li>
<li><strong>Ví dụ hazard nguồn thưởng cho người đọc kỹ.</strong> <code>ADD r4, r1, r6</code> chờ MỘT chu kỳ cho <code>r1</code>, nhưng <code>LDR r7, [r4]</code> chờ <em>HAI</em> chu kỳ cho <code>r4</code> — phát ở chu kỳ 4 chứ không phải 3. Vì sao khác: toán hạng ĐỊA CHỈ cần sớm hơn trong đường ống (ở AGU, tầng E1) so với toán hạng ALU (E2). <strong>Cùng một kết quả, do tầng khác tiêu thụ, thì tốn số chu kỳ kẹt khác nhau.</strong> Slide 36 dùng đúng sự thật này hai lần.</li>
<li><strong>Câu "hazard đầu ra ... hay xảy ra với mã có điều kiện" là một nhận xét rất ARM.</strong> <code>MOVEQ r1, r2</code> và <code>MOVNE r1, r3</code> là hai nửa của một if/else viết mà KHÔNG dùng rẽ nhánh — thực thi có vị từ của ARM, mà Chương 13 giới thiệu như một cách né rẽ nhánh. Bảng này chỉ ra cái giá: vị từ né được rẽ nhánh nhưng đẻ ra một WAW, nên hai nửa đó rốt cuộc vẫn không phát đôi được. Một đánh đổi thành thật, không phải món hời miễn phí.</li>
<li><strong>Để ý thứ gì sẽ sửa được năm trong sáu luật này: đổi tên thanh ghi và phát lệnh không theo thứ tự.</strong> Intel Core sẽ đổi tên cho hazard đầu ra biến mất và cứ việc phát một lệnh độc lập trong lúc chờ <code>r1</code>. A8 thì không thể, và bảng này đúng là hoá đơn cho quyết định đó (slide 30).</li>
</ul>
<p class="dap-an">✅ Đọc cột "Chu kỳ" như một PHÁN QUYẾT của scoreboard, đừng đọc như phép cộng thời gian: mỗi lần số chu kỳ <em>LẶP LẠI</em> (1,2,<strong>2</strong> hoặc 1,2,3,4,<strong>4</strong>) là hai lệnh đã phát cùng nhau; mỗi lần nó <em>TĂNG</em> là phát đôi đã hỏng. Trong sáu ví dụ, phát đôi chỉ thành công ở <strong>3</strong> trong 6 ca — một lời nhắc phũ phàng rằng máy "phát 2" KHÔNG đạt trung bình 2.</p>
<p class="meo">💡 Học thuộc theo mạch <strong>một khối LS · một bộ nhân (chỉ ống 0) · một rẽ nhánh · không trùng đích · không thiếu dữ liệu · lệnh nhiều chu kỳ chiếm ống 0</strong>. Sáu mục, mà ba trong số đó chỉ là "thứ này chỉ có một cái".</p>
<p class="pitfall">⚠️ Bẫy ở dòng rẽ nhánh: slide định nghĩa rẽ nhánh là <strong>BẤT KỲ lệnh nào làm đổi PC</strong>. Trên ARM, <code>MOV pc, lr</code> và <code>LDR pc, [r13], #4</code> đều là rẽ nhánh dù chúng được viết như một lệnh chuyển và một lệnh nạp. Slide 36 phát đúng một lệnh <code>LDR pc</code> như vậy và phải trả thêm một chu kỳ cho nó.</p>`],

      [34, 'Integer Execute Unit — two symmetric ALU pipelines and the six stages E0 to E5',
        `<p class="y-chinh">🎯 The business end of the Cortex-A8. The unit <strong>consists of two symmetric ALU pipelines, an address generator for load and store instructions, and the multiply pipeline</strong> — and the slide then names what happens in each of the six execute stages.</p>
<table>
<tr><th>The execute unit's four jobs (slide)</th><th>Note</th></tr>
<tr><td>Executes all integer ALU and multiply operations, <strong>including flag generation</strong></td><td>Condition flags matter enormously on ARM because of predication</td></tr>
<tr><td>Generates the <strong>virtual addresses</strong> for loads and stores, and the base write-back value when required</td><td>"Base write-back" = the auto-increment forms such as <code>LDR r0, [r1], #4</code></td></tr>
<tr><td>Supplies <strong>formatted data for stores</strong> and forwards data and flags</td><td>Forwarding is the hazard cure from Chương 12, alive here</td></tr>
<tr><td>Processes <strong>branches</strong> and other changes of instruction stream, and <strong>evaluates instruction condition codes</strong></td><td>Where a prediction is finally confirmed or killed</td></tr>
</table>
<table>
<tr><th>Stage</th><th>What the slide says happens (ALU instructions, either pipeline)</th></tr>
<tr><td><strong>E0</strong></td><td>Access register file — <strong>up to six registers for two instructions</strong></td></tr>
<tr><td><strong>E1</strong></td><td>Barrel shifter, if needed</td></tr>
<tr><td><strong>E2</strong></td><td>ALU function</td></tr>
<tr><td><strong>E3</strong></td><td>If needed, completes saturation arithmetic</td></tr>
<tr><td><strong>E4</strong></td><td>Change in control flow prioritized and processed</td></tr>
<tr><td><strong>E5</strong></td><td>Results written back to register file</td></tr>
</table>
<p class="dap-an">✅ "Up to six registers for two instructions" is worth a moment: two instructions × three register operands each (two sources plus one destination) = <strong>6 ports needed on the register file in one cycle</strong>. That is the hidden cost of dual issue. A 4-wide machine would need 12; an 8-wide machine 24. Register-file port count grows linearly with issue width while the wiring and multiplexers grow roughly with its <em>square</em> — this is one concrete reason ILP cannot be widened forever (slide 40).</p>
<ul>
<li><strong>"Either pipeline can be used" for ALU instructions — that is what "symmetric" means.</strong> Two identical ALU pipes, so a pair of plain arithmetic instructions dual-issues without argument. Every restriction in Table 18.4 comes from the <em>non</em>-symmetric units: one multiplier, one load/store pipe, one branch.</li>
<li><strong>The barrel shifter gets a stage of its own, and that is very ARM.</strong> The ARM instruction set lets almost any data-processing instruction shift one operand for free — <code>ADD r0, r1, r2, LSL #2</code>. "Free" at the ISA level costs a pipeline stage at the hardware level. Chương 11 (addressing modes and formats) showed you the encoding; here is the silicon that pays for it.</li>
<li><strong>E4 is where speculation is settled.</strong> "Change in control flow prioritized and processed" means: the branch condition is now known, and if the prediction was wrong, the mispredict signal fires from here back to F0 (Figure 18.11). One stage before write-back — just in time to prevent a wrong result from becoming architectural state.</li>
<li><strong>Trace one result through the pipe and Table 18.4 explains itself.</strong> An ALU result exists at the end of <strong>E2</strong>. A consumer that needs it as an ALU operand also wants it at E2 → one cycle apart is enough. A consumer that needs it as an <em>address</em> wants it at E1, one stage earlier → two cycles apart. That is precisely the "wait two cycles for r4" line in Table 18.4 and the "+2 cycle stall" in Table 18.5.</li>
<li><strong>Saturation arithmetic at E3 is a signal-processing feature.</strong> Saturating operations clamp at the maximum instead of wrapping — essential for audio and video, where wrapping would turn a loud sample into a loud <em>noise</em>. It is in the integer unit, not just NEON, because the A8 was designed for phones.</li>
</ul>
<p class="meo">💡 Remember the execute stages as <strong>read → shift → compute → saturate → branch → write</strong>. Six verbs, in order, and every timing question about the A8 is answered by asking "at which of these six does the value exist, and at which does the consumer need it?"</p>
<p class="pitfall">⚠️ Trap: assuming a result is available at E5 because that is where it is "written back". It is available for <strong>forwarding</strong> as soon as it is computed — E2 for ALU, E3 for a load. Write-back at E5 is when it becomes visible in the register file, not when it becomes usable. Answering a scheduling question with E5 will be wrong almost every time.</p>`,
        `<p class="y-chinh">🎯 Đầu ra tay của Cortex-A8. Khối này <strong>gồm hai đường ống ALU ĐỐI XỨNG, một bộ sinh địa chỉ cho lệnh load/store, và đường ống nhân</strong> — rồi slide gọi tên chuyện xảy ra ở từng tầng trong sáu tầng thực thi.</p>
<table>
<tr><th>Bốn việc của khối thực thi (theo slide)</th><th>Ghi chú</th></tr>
<tr><td>Chạy mọi phép ALU nguyên và phép nhân, <strong>kể cả sinh cờ</strong></td><td>Cờ điều kiện cực kỳ quan trọng trên ARM vì có thực thi theo vị từ</td></tr>
<tr><td>Sinh <strong>địa chỉ ảo</strong> cho load và store, và giá trị ghi ngược cho thanh ghi nền khi cần</td><td>"Base write-back" = các dạng tự tăng như <code>LDR r0, [r1], #4</code></td></tr>
<tr><td>Cung cấp <strong>dữ liệu đã định dạng cho lệnh store</strong>, và chuyển tiếp dữ liệu lẫn cờ</td><td>Chuyển tiếp (forwarding) là bài thuốc chữa hazard của Chương 12, vẫn sống ở đây</td></tr>
<tr><td>Xử lý <strong>rẽ nhánh</strong> và các thay đổi luồng lệnh khác, <strong>đánh giá mã điều kiện của lệnh</strong></td><td>Chỗ một phép dự đoán cuối cùng được xác nhận hoặc bị giết</td></tr>
</table>
<table>
<tr><th>Tầng</th><th>Slide nói xảy ra gì (lệnh ALU, ở ống nào cũng được)</th></tr>
<tr><td><strong>E0</strong></td><td>Truy cập tệp thanh ghi — <strong>tới SÁU thanh ghi cho HAI lệnh</strong></td></tr>
<tr><td><strong>E1</strong></td><td>Bộ dịch thùng (barrel shifter), nếu cần</td></tr>
<tr><td><strong>E2</strong></td><td>Hàm ALU</td></tr>
<tr><td><strong>E3</strong></td><td>Nếu cần, hoàn tất số học bão hoà</td></tr>
<tr><td><strong>E4</strong></td><td>Thay đổi luồng điều khiển được xếp ưu tiên và xử lý</td></tr>
<tr><td><strong>E5</strong></td><td>Kết quả ghi ngược vào tệp thanh ghi</td></tr>
</table>
<p class="dap-an">✅ Câu "tới sáu thanh ghi cho hai lệnh" đáng dừng lại một nhịp: hai lệnh × ba toán hạng thanh ghi mỗi lệnh (hai nguồn cộng một đích) = <strong>cần 6 cổng trên tệp thanh ghi trong MỘT chu kỳ</strong>. Đó là cái giá GIẤU của phát đôi. Máy rộng 4 cần 12 cổng; máy rộng 8 cần 24. Số cổng tệp thanh ghi tăng TUYẾN TÍNH theo độ rộng phát lệnh, trong khi dây nối và bộ ghép kênh tăng xấp xỉ theo BÌNH PHƯƠNG của nó — đây là một lý do rất cụ thể khiến ILP không thể nới rộng mãi (slide 40).</p>
<ul>
<li><strong>"Ống nào cũng dùng được" cho lệnh ALU — đó là nghĩa của chữ "đối xứng".</strong> Hai ống ALU giống hệt nhau, nên một cặp lệnh số học thường phát đôi không phải cãi cọ gì. Mọi luật cấm trong Table 18.4 đều đến từ những khối <em>KHÔNG</em> đối xứng: một bộ nhân, một ống load/store, một khối rẽ nhánh.</li>
<li><strong>Bộ dịch thùng được cấp hẳn một tầng, và đó là rất ARM.</strong> Tập lệnh ARM cho phép hầu như mọi lệnh xử lý dữ liệu dịch MIỄN PHÍ một toán hạng — <code>ADD r0, r1, r2, LSL #2</code>. "Miễn phí" ở mức ISA thì tốn một TẦNG đường ống ở mức phần cứng. Chương 11 (chế độ địa chỉ và khuôn dạng) đã cho bạn phần mã hoá; đây là phần silicon trả tiền cho nó.</li>
<li><strong>E4 là nơi chuyện suy đoán được phân xử.</strong> "Thay đổi luồng điều khiển được xếp ưu tiên và xử lý" nghĩa là: điều kiện rẽ nhánh giờ đã biết, và nếu đoán sai thì tín hiệu mispredict bắn từ đây ngược về F0 (Figure 18.11). Trước tầng ghi ngược đúng MỘT tầng — vừa kịp để một kết quả sai không trở thành trạng thái kiến trúc.</li>
<li><strong>Lần theo một kết quả đi qua ống là Table 18.4 tự giải thích.</strong> Kết quả ALU tồn tại vào cuối tầng <strong>E2</strong>. Bên tiêu thụ cần nó làm toán hạng ALU thì cũng cần ở E2 → cách nhau một chu kỳ là đủ. Bên tiêu thụ cần nó làm <em>ĐỊA CHỈ</em> thì cần ở E1, sớm hơn một tầng → phải cách nhau HAI chu kỳ. Đó chính xác là dòng "chờ r4 hai chu kỳ" ở Table 18.4 và dòng "+2 cycle stall" ở Table 18.5.</li>
<li><strong>Số học bão hoà ở E3 là một tính năng xử lý tín hiệu.</strong> Phép bão hoà kẹp lại ở giá trị lớn nhất thay vì tràn vòng — thiết yếu cho âm thanh và video, nơi tràn vòng sẽ biến một mẫu ÂM TO thành một mẫu TIẾNG NỔ. Nó nằm trong khối số nguyên chứ không chỉ trong NEON, vì A8 sinh ra cho điện thoại.</li>
</ul>
<p class="meo">💡 Nhớ sáu tầng thực thi theo mạch <strong>đọc → dịch → tính → bão hoà → rẽ nhánh → ghi</strong>. Sáu động từ, đúng thứ tự, và mọi câu hỏi định thời về A8 đều trả lời được bằng cách hỏi "giá trị TỒN TẠI ở tầng nào trong sáu tầng này, và bên tiêu thụ CẦN nó ở tầng nào?"</p>
<p class="pitfall">⚠️ Bẫy: tưởng kết quả chỉ có ở E5 vì đó là nơi nó "được ghi ngược". Nó dùng được để <strong>CHUYỂN TIẾP</strong> ngay khi tính xong — E2 với ALU, E3 với load. Ghi ngược ở E5 là lúc nó hiện ra trong tệp thanh ghi, không phải lúc nó dùng được. Trả lời câu hỏi lập lịch bằng E5 thì gần như chắc chắn sai.</p>`],

      [35, 'Load/Store Pipeline — five stages running parallel to the integer pipeline',
        `<p class="y-chinh">🎯 The third pipe of Figure 18.11, written out stage by stage. It <strong>runs parallel to the integer pipeline</strong>, sharing E0 (the register file) with it and then going its own way from E1 onwards.</p>
<table>
<tr><th>Stage</th><th>What the slide says happens</th><th>What the figure draws there</th></tr>
<tr><td><strong>E1</strong></td><td>Memory address generated from <strong>base and index register</strong></td><td>AGU</td></tr>
<tr><td><strong>E2</strong></td><td>Address applied to <strong>cache arrays</strong></td><td>RAM + TLB</td></tr>
<tr><td><strong>E3</strong></td><td><strong>Load</strong> — data are returned and formatted. <strong>Store</strong> — data are formatted and ready to be written to cache</td><td>Format forward</td></tr>
<tr><td><strong>E4</strong></td><td>Updates <strong>L2 cache</strong>, if required</td><td>L2 update</td></tr>
<tr><td><strong>E5</strong></td><td>Results are written back into the register file</td><td>WB</td></tr>
</table>
<ul>
<li><strong>Compare E1–E3 here with E1–E3 in the ALU pipe and the whole timing model falls out.</strong> An ALU result exists after <strong>E2</strong>; a load result exists after <strong>E3</strong> — one stage later, because the load spent E2 in the cache arrays. That one-stage difference is the source of every "+1" and "+2" in Table 18.5 (slide 36). Loads are late producers; addresses are early consumers; when a late producer feeds an early consumer you get the worst case, two lost cycles.</li>
<li><strong>Address translation happens in the same stage as the cache lookup (E2, "RAM + TLB").</strong> That is the virtually-indexed, physically-tagged trick from Chương 4: start the cache lookup with the virtual address while the TLB translates in parallel, then compare tags. If you serialised them the load would need an extra stage, and everything above would slip by one.</li>
<li><strong>"Address generated from base and index register" at E1 connects straight to Chương 11.</strong> Base-plus-index is one of the addressing modes you studied there. Here is its cost in silicon: a whole pipeline stage with its own adder, before memory is even touched.</li>
<li><strong>E4 "updates L2 cache, if required" is the write path of Chương 4 in one line.</strong> Write-through, write-allocate, eviction — all the policy you learned about lives behind that conditional "if required". And when the L1 misses, this is where the request leaves for L2 and the 8-cycle replay of Table 18.3 begins.</li>
<li><strong>Only one of these pipes exists, and everything about the A8's dual issue follows from that.</strong> Figure 18.11 labels it "Load/store pipe 0 or 1" — meaning it can be fed from either issue slot, but there is <em>one</em> of it. That single fact is the first row of Table 18.4 and the reason cycles 13 and 14 of Table 18.5 are single-issue.</li>
</ul>
<p class="dap-an">✅ Stage-by-stage comparison, the single most useful thing on this slide:</p>
<table>
<tr><th>Stage</th><th>ALU pipe</th><th>Load/store pipe</th></tr>
<tr><td>E0</td><td>Read register file</td><td>Read register file (shared)</td></tr>
<tr><td>E1</td><td>Shift</td><td>Generate address (AGU)</td></tr>
<tr><td>E2</td><td><strong>ALU result exists</strong></td><td>Cache array access</td></tr>
<tr><td>E3</td><td>Saturate</td><td><strong>Load result exists</strong></td></tr>
<tr><td>E4</td><td>Resolve control flow</td><td>Update L2 if needed</td></tr>
<tr><td>E5</td><td>Write back</td><td>Write back</td></tr>
</table>
<p class="meo">💡 One line to carry into the exam: <strong>ALU produces at E2, load produces at E3, and an address is consumed at E1.</strong> Every stall count in the A8 tables is a subtraction between two of those three numbers.</p>
<p class="pitfall">⚠️ Note that a <em>store</em> does not produce a register result at all — E3 formats data ready for the cache, and there is nothing for a later instruction to wait on. This is why stores never appear as the cause of a data-source hazard in Table 18.4, and why Table 18.3 says a store miss costs nothing unless the store buffer is full.</p>`,
        `<p class="y-chinh">🎯 Ống thứ ba của Figure 18.11, viết ra từng tầng. Nó <strong>chạy SONG SONG với đường ống số nguyên</strong>, dùng chung E0 (tệp thanh ghi) rồi từ E1 trở đi đi đường riêng.</p>
<table>
<tr><th>Tầng</th><th>Slide nói xảy ra gì</th><th>Hình vẽ gì ở đó</th></tr>
<tr><td><strong>E1</strong></td><td>Sinh địa chỉ bộ nhớ từ <strong>thanh ghi nền và thanh ghi chỉ số</strong></td><td>AGU</td></tr>
<tr><td><strong>E2</strong></td><td>Đưa địa chỉ vào <strong>các mảng cache</strong></td><td>RAM + TLB</td></tr>
<tr><td><strong>E3</strong></td><td><strong>Load</strong> — dữ liệu trả về và được định dạng. <strong>Store</strong> — dữ liệu được định dạng và sẵn sàng ghi vào cache</td><td>Format forward</td></tr>
<tr><td><strong>E4</strong></td><td>Cập nhật <strong>cache L2</strong>, nếu cần</td><td>L2 update</td></tr>
<tr><td><strong>E5</strong></td><td>Kết quả được ghi ngược vào tệp thanh ghi</td><td>WB</td></tr>
</table>
<ul>
<li><strong>So E1–E3 ở đây với E1–E3 của ống ALU là cả mô hình định thời rơi ra.</strong> Kết quả ALU tồn tại sau <strong>E2</strong>; kết quả load tồn tại sau <strong>E3</strong> — chậm hơn MỘT tầng, vì lệnh load đã tiêu tầng E2 trong các mảng cache. Đúng một tầng chênh đó là nguồn gốc của mọi cái "+1" và "+2" trong Table 18.5 (slide 36). Load là kẻ sản xuất MUỘN; địa chỉ là kẻ tiêu thụ SỚM; khi kẻ sản xuất muộn nuôi kẻ tiêu thụ sớm thì bạn có ca xấu nhất, mất hai chu kỳ.</li>
<li><strong>Dịch địa chỉ xảy ra CÙNG tầng với tra cache (E2, "RAM + TLB").</strong> Đó là mẹo đánh chỉ số bằng địa chỉ ảo, gắn tag bằng địa chỉ vật lý của Chương 4: khởi động tra cache bằng địa chỉ ảo trong khi TLB dịch SONG SONG, rồi mới so tag. Nếu làm tuần tự thì lệnh load cần thêm một tầng, và mọi thứ phía trên trượt đi một nhịp.</li>
<li><strong>"Địa chỉ sinh từ thanh ghi nền và thanh ghi chỉ số" ở E1 nối thẳng về Chương 11.</strong> Nền-cộng-chỉ-số là một trong các chế độ địa chỉ bạn đã học ở đó. Đây là giá của nó tính bằng silicon: nguyên một tầng đường ống với bộ cộng riêng, trước cả khi chạm tới bộ nhớ.</li>
<li><strong>E4 "cập nhật cache L2 nếu cần" là đường GHI của Chương 4 gói trong một dòng.</strong> Ghi xuyên, cấp phát khi ghi, đuổi dòng — mọi chính sách bạn đã học đều nằm sau cái mệnh đề "nếu cần" đó. Và khi L1 trượt, đây là chỗ yêu cầu lên đường sang L2 và cú replay 8 chu kỳ của Table 18.3 bắt đầu.</li>
<li><strong>Ống này chỉ có MỘT cái, và mọi chuyện về phát đôi của A8 đều suy ra từ đó.</strong> Figure 18.11 ghi nhãn "Load/store pipe 0 or 1" — nghĩa là nó nhận được lệnh từ ô phát nào cũng được, nhưng nó chỉ có <em>MỘT</em>. Riêng sự thật đó là dòng đầu của Table 18.4 và là lý do chu kỳ 13 và 14 của Table 18.5 chỉ phát được một lệnh.</li>
</ul>
<p class="dap-an">✅ So sánh từng tầng, thứ hữu ích nhất trên slide này:</p>
<table>
<tr><th>Tầng</th><th>Ống ALU</th><th>Ống load/store</th></tr>
<tr><td>E0</td><td>Đọc tệp thanh ghi</td><td>Đọc tệp thanh ghi (dùng chung)</td></tr>
<tr><td>E1</td><td>Dịch bit</td><td>Sinh địa chỉ (AGU)</td></tr>
<tr><td>E2</td><td><strong>Kết quả ALU TỒN TẠI</strong></td><td>Truy cập mảng cache</td></tr>
<tr><td>E3</td><td>Bão hoà</td><td><strong>Kết quả load TỒN TẠI</strong></td></tr>
<tr><td>E4</td><td>Phân giải luồng điều khiển</td><td>Cập nhật L2 nếu cần</td></tr>
<tr><td>E5</td><td>Ghi ngược</td><td>Ghi ngược</td></tr>
</table>
<p class="meo">💡 Một dòng mang vào phòng thi: <strong>ALU sinh ra ở E2, load sinh ra ở E3, và ĐỊA CHỈ bị tiêu thụ ở E1.</strong> Mọi số chu kỳ kẹt trong các bảng của A8 đều là một phép TRỪ giữa hai trong ba con số đó.</p>
<p class="pitfall">⚠️ Để ý lệnh <em>store</em> hoàn toàn KHÔNG sinh ra kết quả thanh ghi nào — E3 chỉ định dạng dữ liệu cho sẵn sàng vào cache, và chẳng có gì để lệnh sau phải chờ. Đó là lý do store không bao giờ xuất hiện như nguyên nhân của hazard nguồn dữ liệu trong Table 18.4, và là lý do Table 18.3 nói store trượt không tốn gì trừ khi đệm store đầy.</p>`],

      [36, 'Table 18.5 — Cortex-A8 Example Dual Issue Instruction Sequence for Integer Pipeline',
        `<p class="y-chinh">🎯 The chapter's capstone exercise: <strong>21 real ARM instructions, with the exact cycle each one issues in, and a one-line reason for every number</strong>. Everything from slides 30 to 35 is used here at once. Work through it and the chapter is finished.</p>
<table>
<tr><th>Cycle</th><th>PC</th><th>Instruction</th><th>Timing description (slide)</th></tr>
<tr><td>1</td><td>0x00000ed0</td><td><code>BX r14</code></td><td>Dual issue pipeline 0</td></tr>
<tr><td>1</td><td>0x00000ee4</td><td><code>CMP r0,#0</code></td><td>Dual issue in pipeline 1</td></tr>
<tr><td>2</td><td>0x00000ee8</td><td><code>MOV r3,#3</code></td><td>Dual issue pipeline 0</td></tr>
<tr><td>2</td><td>0x00000eec</td><td><code>MOV r0,#0</code></td><td>Dual issue in pipeline 1</td></tr>
<tr><td>3</td><td>0x00000ef0</td><td><code>STREQ r3,[r1,#0]</code></td><td>Dual issue in pipeline 0, r3 not needed until E3</td></tr>
<tr><td>3</td><td>0x00000ef4</td><td><code>CMP r2,#4</code></td><td>Dual issue in pipeline 1</td></tr>
<tr><td>4</td><td>0x00000ef8</td><td><code>LDRLS pc,[pc,r2,LSL #2]</code></td><td>Single issue pipeline 0, +1 cycle for load to pc, no extra cycle for shift since LSL #2</td></tr>
<tr><td>5</td><td>0x00000f2c</td><td><code>MOV r0,#1</code></td><td>Dual issue with 2nd iteration of load in pipeline 1</td></tr>
<tr><td>6</td><td>0x00000f30</td><td><code>B {pc} + 8</code></td><td>#0xf38 dual issue pipeline 0</td></tr>
<tr><td>6</td><td>0x00000f38</td><td><code>STR r0,[r1,#0]</code></td><td>Dual issue pipeline 1</td></tr>
<tr><td>7</td><td>0x00000f3c</td><td><code>LDR pc,[r13],#4</code></td><td>Single issue pipeline 0, +1 cycle for load to pc</td></tr>
<tr><td>8</td><td>0x0000017c</td><td><code>ADD r2,r4,#0xc</code></td><td>Dual issue with 2nd iteration of load in pipeline 1</td></tr>
<tr><td>9</td><td>0x00000180</td><td><code>LDR r0,[r6,#4]</code></td><td>Dual issue pipeline 0</td></tr>
<tr><td>9</td><td>0x00000184</td><td><code>MOV r1,#0xa</code></td><td>Dual issue pipeline 1</td></tr>
<tr><td><strong>12</strong></td><td>0x00000188</td><td><code>LDR r0,[r0,#0]</code></td><td>Single issue pipeline 0: <strong>r0 produced in E3, required in E1, so +2 cycle stall</strong></td></tr>
<tr><td>13</td><td>0x0000018c</td><td><code>STR r0,[r4,#0]</code></td><td>Single issue pipeline 0 due to LS resource hazard, no extra delay for r0 since produced in E3 and consumed in E3</td></tr>
<tr><td>14</td><td>0x00000190</td><td><code>LDR r0,[r4,#0xc]</code></td><td>Single issue pipeline 0 due to LS resource hazard</td></tr>
<tr><td>15</td><td>0x00000194</td><td><code>LDMFD r13!,{r4-r6,r14}</code></td><td>Load multiple: loads r4 in 1st cycle, r5 and r6 in 2nd cycle, r14 in 3rd cycle, 3 cycles total</td></tr>
<tr><td>17</td><td>0x00000198</td><td><code>B {pc} + 0xda8</code></td><td>#0xf40 dual issue in pipeline 1 with 3rd cycle of LDM</td></tr>
<tr><td>18</td><td>0x00000f40</td><td><code>ADD r0,r0,#2</code> ARM</td><td>Single issue in pipeline 0</td></tr>
<tr><td>19</td><td>0x00000f44</td><td><code>ADD r0,r1,r0</code> ARM</td><td>Single issue in pipeline 0, no dual issue due to hazard on r0 produced in E2 and required in E2</td></tr>
</table>
<p class="dap-an">✅ <strong>Counted by machine, not by eye: 21 instructions issued over 19 cycles → IPC = 1,105.</strong> Dual issue succeeded in only <strong>5 cycles</strong> (1, 2, 3, 6, 9); cycles <strong>10, 11 and 16 issued nothing new at all</strong> (10 and 11 are the two stall cycles before the load at 12; 16 is the second cycle of the LDM). A machine advertised as "2-issue" delivered <strong>1,105</strong> — 55% of its peak. Remember that number the next time a specification sheet quotes an issue width.</p>
<p class="nhan">📐 Three of the trickier jumps, re-derived independently rather than taken on trust:</p>
<table>
<tr><th>Jump</th><th>Derivation</th><th>Matches slide?</th></tr>
<tr><td>9 → 12</td><td><code>LDR r0,[r6,#4]</code> issues at 9; a load produces its result at <strong>E3</strong> (slide 35). The next instruction needs <code>r0</code> as an <em>address</em>, consumed at <strong>E1</strong> (slide 35). E3 vs E1 = 2 stages late. Earliest issue without the hazard would be 10, so 10 + 2 = <strong>12</strong></td><td>✅</td></tr>
<tr><td>15 → 17</td><td><code>LDMFD</code> with four registers takes 3 cycles: 15, 16, 17. A multi-cycle instruction may dual issue only on its <em>last</em> iteration (Table 18.4), so the branch pairs with cycle 15 + 2 = <strong>17</strong></td><td>✅</td></tr>
<tr><td>4 → 5 and 7 → 8</td><td>A load into <code>pc</code> is a branch (Table 18.4: "any instruction that changes the PC") and costs +1 cycle. 4 + 1 = <strong>5</strong>; 7 + 1 = <strong>8</strong></td><td>✅</td></tr>
</table>
<ul>
<li><strong>Row 12 versus row 13 is the single most instructive pair in the chapter.</strong> Both consume an <code>r0</code> produced by a load at E3. Row 12 needs it as an <em>address</em> (E1) → 2 stall cycles. Row 13 is a store that needs it as <em>data</em> (E3) → <strong>zero</strong> stall cycles, as the slide says explicitly. Identical dependency, identical producer, and the penalty differs by two cycles purely because of <em>which stage consumes it</em>. This is the fact slides 34 and 35 were building towards.</li>
<li><strong>Cycles 13 and 14 are single-issue for a reason that has nothing to do with data.</strong> Two consecutive memory instructions, one load/store pipe — Table 18.4's first restriction, visible in the wild. Reordering the code to put an ALU instruction between them would recover a cycle, and an out-of-order machine would have done that by itself.</li>
<li><strong>Row 5 and row 8 both say "dual issue with 2nd iteration of load in pipeline 1".</strong> A load-to-pc is a multi-cycle operation; its second cycle occupies pipe 0, leaving pipe 1 free for an independent instruction. Idle capacity being scavenged — exactly what superscalar hardware is for.</li>
<li><strong>The last row is a one-cycle penalty you would not guess.</strong> <code>ADD r0,r0,#2</code> then <code>ADD r0,r1,r0</code>: r0 is produced at E2 and required at E2, so they cannot issue in the <em>same</em> cycle, but one cycle apart is enough. Compare with row 12's two-cycle gap and the pattern is complete: <strong>E2→E2 costs 1, E3→E3 costs 0 (after the natural gap), E3→E1 costs 2.</strong></li>
<li><strong>Read the PC column too — it tells the control-flow story.</strong> The addresses jump from 0xef8 to 0xf2c (the LDR into pc — a jump-table dispatch), then from 0xf3c to 0x17c (a function return via <code>LDR pc,[r13],#4</code>, i.e. popping the return address off the stack), then 0x198 to 0xf40. Four changes of flow in 21 instructions. Slide 21's "one instruction in five is a branch" is visible right here in real code.</li>
</ul>
<p class="meo">💡 Method for any question of this shape: for each pair of consecutive instructions ask three questions in order — (1) <em>resource</em>: do they need the same single unit? (2) <em>data</em>: is a result available in time, given produce-stage and consume-stage? (3) <em>multi-cycle</em>: is either one still occupying pipe 0? If all three say no, they dual-issue.</p>
<p class="pitfall">⚠️ Trap that catches almost everyone: treating the Cycle column as a list of consecutive numbers. It is not — 10, 11 and 16 are missing, and 1, 2, 3, 6 and 9 appear twice. The column gives the cycle in which each instruction <strong>issues</strong>, and the gaps are where the stalls live. Reading it as "instruction number" makes every answer wrong.</p>`,
        `<p class="y-chinh">🎯 Bài tập tổng kết của chương: <strong>21 lệnh ARM thật, kèm ĐÚNG chu kỳ mà mỗi lệnh được phát, và một dòng lý do cho từng con số</strong>. Mọi thứ từ slide 30 tới 35 được dùng ở đây cùng một lúc. Chạy hết bảng này là xong chương.</p>
<table>
<tr><th>Chu kỳ</th><th>PC</th><th>Lệnh</th><th>Mô tả định thời (theo slide)</th></tr>
<tr><td>1</td><td>0x00000ed0</td><td><code>BX r14</code></td><td>Phát đôi, ống 0</td></tr>
<tr><td>1</td><td>0x00000ee4</td><td><code>CMP r0,#0</code></td><td>Phát đôi, ống 1</td></tr>
<tr><td>2</td><td>0x00000ee8</td><td><code>MOV r3,#3</code></td><td>Phát đôi, ống 0</td></tr>
<tr><td>2</td><td>0x00000eec</td><td><code>MOV r0,#0</code></td><td>Phát đôi, ống 1</td></tr>
<tr><td>3</td><td>0x00000ef0</td><td><code>STREQ r3,[r1,#0]</code></td><td>Phát đôi ống 0, r3 mãi tới E3 mới cần</td></tr>
<tr><td>3</td><td>0x00000ef4</td><td><code>CMP r2,#4</code></td><td>Phát đôi, ống 1</td></tr>
<tr><td>4</td><td>0x00000ef8</td><td><code>LDRLS pc,[pc,r2,LSL #2]</code></td><td>Phát đơn ống 0, +1 chu kỳ vì load vào pc, không thêm chu kỳ cho phép dịch vì là LSL #2</td></tr>
<tr><td>5</td><td>0x00000f2c</td><td><code>MOV r0,#1</code></td><td>Phát đôi với vòng thứ 2 của lệnh load, ở ống 1</td></tr>
<tr><td>6</td><td>0x00000f30</td><td><code>B {pc} + 8</code></td><td>#0xf38 phát đôi ống 0</td></tr>
<tr><td>6</td><td>0x00000f38</td><td><code>STR r0,[r1,#0]</code></td><td>Phát đôi ống 1</td></tr>
<tr><td>7</td><td>0x00000f3c</td><td><code>LDR pc,[r13],#4</code></td><td>Phát đơn ống 0, +1 chu kỳ vì load vào pc</td></tr>
<tr><td>8</td><td>0x0000017c</td><td><code>ADD r2,r4,#0xc</code></td><td>Phát đôi với vòng thứ 2 của lệnh load, ở ống 1</td></tr>
<tr><td>9</td><td>0x00000180</td><td><code>LDR r0,[r6,#4]</code></td><td>Phát đôi ống 0</td></tr>
<tr><td>9</td><td>0x00000184</td><td><code>MOV r1,#0xa</code></td><td>Phát đôi ống 1</td></tr>
<tr><td><strong>12</strong></td><td>0x00000188</td><td><code>LDR r0,[r0,#0]</code></td><td>Phát đơn ống 0: <strong>r0 sinh ra ở E3, lại cần ở E1, nên kẹt +2 chu kỳ</strong></td></tr>
<tr><td>13</td><td>0x0000018c</td><td><code>STR r0,[r4,#0]</code></td><td>Phát đơn ống 0 do xung đột tài nguyên LS, KHÔNG trễ thêm vì r0 sinh ở E3 và cũng bị tiêu thụ ở E3</td></tr>
<tr><td>14</td><td>0x00000190</td><td><code>LDR r0,[r4,#0xc]</code></td><td>Phát đơn ống 0 do xung đột tài nguyên LS</td></tr>
<tr><td>15</td><td>0x00000194</td><td><code>LDMFD r13!,{r4-r6,r14}</code></td><td>Load nhiều thanh ghi: nạp r4 ở chu kỳ 1, r5 và r6 ở chu kỳ 2, r14 ở chu kỳ 3, tổng 3 chu kỳ</td></tr>
<tr><td>17</td><td>0x00000198</td><td><code>B {pc} + 0xda8</code></td><td>#0xf40 phát đôi ở ống 1 cùng với chu kỳ thứ 3 của LDM</td></tr>
<tr><td>18</td><td>0x00000f40</td><td><code>ADD r0,r0,#2</code> ARM</td><td>Phát đơn ở ống 0</td></tr>
<tr><td>19</td><td>0x00000f44</td><td><code>ADD r0,r1,r0</code> ARM</td><td>Phát đơn ống 0, không phát đôi được do hazard trên r0 sinh ở E2 và cần ở E2</td></tr>
</table>
<p class="dap-an">✅ <strong>Đếm bằng MÁY chứ không bằng mắt: 21 lệnh phát trong 19 chu kỳ → IPC = 1,105.</strong> Phát đôi chỉ thành công ở <strong>5 chu kỳ</strong> (1, 2, 3, 6, 9); các chu kỳ <strong>10, 11 và 16 KHÔNG phát lệnh mới nào</strong> (10 và 11 là hai chu kỳ kẹt trước lệnh load ở 12; 16 là chu kỳ thứ hai của LDM). Một cỗ máy quảng cáo là "phát 2" giao ra <strong>1,105</strong> — 55% đỉnh của nó. Nhớ con số đó lần tới khi một tờ thông số ghi độ rộng phát lệnh.</p>
<p class="nhan">📐 Ba cú nhảy hóc nhất, TỰ suy lại độc lập chứ không tin sẵn:</p>
<table>
<tr><th>Cú nhảy</th><th>Cách suy ra</th><th>Khớp slide?</th></tr>
<tr><td>9 → 12</td><td><code>LDR r0,[r6,#4]</code> phát ở 9; lệnh load sinh kết quả ở <strong>E3</strong> (slide 35). Lệnh sau cần <code>r0</code> làm <em>ĐỊA CHỈ</em>, bị tiêu thụ ở <strong>E1</strong> (slide 35). E3 so với E1 = muộn 2 tầng. Nếu không có hazard thì sớm nhất phát ở 10, vậy 10 + 2 = <strong>12</strong></td><td>✅</td></tr>
<tr><td>15 → 17</td><td><code>LDMFD</code> bốn thanh ghi mất 3 chu kỳ: 15, 16, 17. Lệnh nhiều chu kỳ chỉ phát đôi được ở vòng <em>CUỐI</em> (Table 18.4), nên lệnh rẽ nhánh ghép cặp ở 15 + 2 = <strong>17</strong></td><td>✅</td></tr>
<tr><td>4 → 5 và 7 → 8</td><td>Một lệnh load vào <code>pc</code> LÀ một lệnh rẽ nhánh (Table 18.4: "bất kỳ lệnh nào làm đổi PC") và tốn +1 chu kỳ. 4 + 1 = <strong>5</strong>; 7 + 1 = <strong>8</strong></td><td>✅</td></tr>
</table>
<ul>
<li><strong>Dòng 12 đặt cạnh dòng 13 là cặp dạy được nhiều nhất trong cả chương.</strong> Cả hai đều tiêu thụ một <code>r0</code> do lệnh load sinh ra ở E3. Dòng 12 cần nó làm <em>ĐỊA CHỈ</em> (E1) → kẹt 2 chu kỳ. Dòng 13 là lệnh store cần nó làm <em>DỮ LIỆU</em> (E3) → kẹt <strong>KHÔNG</strong> chu kỳ nào, đúng như slide nói thẳng. Cùng một phụ thuộc, cùng một kẻ sản xuất, mà mức phạt lệch nhau hai chu kỳ thuần tuý vì <em>TẦNG NÀO tiêu thụ nó</em>. Đây chính là sự thật mà slide 34 và 35 đã dọn đường tới.</li>
<li><strong>Chu kỳ 13 và 14 phát đơn vì một lý do chẳng liên quan gì tới dữ liệu.</strong> Hai lệnh bộ nhớ liên tiếp, mà chỉ có một ống load/store — luật cấm đầu tiên của Table 18.4, hiện ra ngoài đời. Sắp lại mã để chèn một lệnh ALU vào giữa là gỡ được một chu kỳ, và một máy không-theo-thứ-tự đã tự làm điều đó rồi.</li>
<li><strong>Dòng 5 và dòng 8 đều ghi "phát đôi với vòng thứ 2 của lệnh load ở ống 1".</strong> Load vào pc là thao tác nhiều chu kỳ; chu kỳ thứ hai của nó chiếm ống 0, để trống ống 1 cho một lệnh độc lập. Năng lực nhàn rỗi được nhặt nhạnh — đúng công dụng của phần cứng superscalar.</li>
<li><strong>Dòng cuối là một chu kỳ phạt mà bạn sẽ không đoán ra.</strong> <code>ADD r0,r0,#2</code> rồi <code>ADD r0,r1,r0</code>: r0 sinh ở E2 và cần ở E2, nên chúng không phát được trong <em>CÙNG</em> một chu kỳ, nhưng cách nhau một chu kỳ là đủ. Đặt cạnh khoảng cách hai chu kỳ ở dòng 12 là ra trọn quy luật: <strong>E2→E2 tốn 1, E3→E3 tốn 0 (sau khoảng cách tự nhiên), E3→E1 tốn 2.</strong></li>
<li><strong>Đọc cả cột PC — nó kể câu chuyện luồng điều khiển.</strong> Địa chỉ nhảy từ 0xef8 sang 0xf2c (lệnh LDR vào pc — một cú phân nhánh qua bảng nhảy), rồi từ 0xf3c sang 0x17c (một lần trở về hàm qua <code>LDR pc,[r13],#4</code>, tức lấy địa chỉ trở về ra khỏi ngăn xếp), rồi 0x198 sang 0xf40. BỐN lần đổi luồng trong 21 lệnh. Câu "cứ năm lệnh có một lệnh rẽ nhánh" ở slide 21 nhìn thấy được ngay tại đây, trên mã thật.</li>
</ul>
<p class="meo">💡 Phương pháp cho mọi câu hỏi dạng này: với mỗi cặp lệnh liên tiếp, hỏi ba câu theo thứ tự — (1) <em>TÀI NGUYÊN</em>: chúng có cần cùng một khối độc nhất không? (2) <em>DỮ LIỆU</em>: kết quả có kịp không, xét tầng SINH RA và tầng TIÊU THỤ? (3) <em>NHIỀU CHU KỲ</em>: có cái nào còn đang chiếm ống 0 không? Cả ba đều KHÔNG thì chúng phát đôi.</p>
<p class="pitfall">⚠️ Bẫy tóm được gần như tất cả mọi người: coi cột Chu kỳ là một dãy số liên tiếp. KHÔNG phải — thiếu 10, 11 và 16, còn 1, 2, 3, 6 và 9 xuất hiện HAI lần. Cột đó cho biết chu kỳ mà mỗi lệnh được <strong>PHÁT</strong>, và các khoảng trống là chỗ những cú kẹt nằm. Đọc nó như "số thứ tự lệnh" là mọi đáp án đều sai.</p>`],

      [37, 'Figure 18.12 — ARM Cortex-A8 NEON and Floating-Point Pipeline',
        `<p class="y-chinh">🎯 The SIMD half of the chip, drawn in full. This is the <strong>10-stage pipeline</strong> that slide 27 labelled "10-stage SIMD pipeline", and it is a near-complete second processor with its own decode, its own register file and its own set of execution pipes.</p>
<table>
<tr><th>Section of the figure</th><th>Blocks drawn</th></tr>
<tr><td><strong>Instruction decode</strong> (3 stages)</td><td>16-entry Inst queue + Inst Dec · Dec queue + Rd/Wr check · Scoreboard + Issue logic</td></tr>
<tr><td><strong>Register read</strong> (1 stage)</td><td>Reg read + M3 fwding muxes — fed by the "NEON register writeback" bus looping back from the end</td></tr>
<tr><td><strong>Integer ALU / MAC / SHIFT pipes</strong> (6 stages)</td><td>DUP → MUL1 → MUL2 → ACC1 → ACC2 → WB · Shift1 → Shift2 → Shift3 → WB · FMT → ALU → ABS → WB</td></tr>
<tr><td><strong>Non-IEEE FMUL pipe</strong></td><td>FDUP → FMUL1 → FMUL2 → FMUL3 → FMUL4 → WB</td></tr>
<tr><td><strong>Non-IEEE FADD pipe</strong></td><td>FFMT → FADD1 → FADD2 → FADD3 → FADD4 → WB</td></tr>
<tr><td><strong>IEEE single/double precision VFP</strong></td><td>VFP → WB</td></tr>
<tr><td><strong>Load/store and permute</strong></td><td>Mux L1/MCR → 8-entry store queue → Load Align → Mux with NRF, feeding PERM1 → PERM2 → Store Align → 8-entry store queue → WB</td></tr>
</table>
<p class="dap-an">✅ The arithmetic again: <strong>3 (decode) + 1 (register read) + 6 (execute) = 10</strong>, exactly the "10-stage SIMD pipeline" brace on Figure 18.10. Two figures, drawn independently, agreeing — that is how you verify you have read a block diagram correctly.</p>
<ul>
<li><strong>Notice the structure is a copy of the integer side, not something new.</strong> Instruction queue → decode → scoreboard and issue logic → register read → parallel execution pipes → write-back. Same skeleton as Figure 18.11. Once you can read one processor pipeline you can read them all; only the names in the boxes change.</li>
<li><strong>Count the pipes and you know the SIMD dual-issue rules without a table.</strong> There is one MUL/MAC chain, one shift chain, one ALU chain, one FMUL, one FADD, one VFP, one permute path. Any two NEON instructions needing the same chain in the same cycle conflict — the identical reasoning that produced Table 18.4 for the integer side.</li>
<li><strong>"Non-IEEE" on two of the pipes is a deliberate, and important, compromise.</strong> The fast FMUL and FADD pipes do <em>not</em> implement full IEEE 754 semantics (denormals, all rounding modes, exact exception behaviour). Strict IEEE work is shunted to the single VFP block, which is far slower. Media code — audio, video, graphics — does not care about the last bit; scientific code does. The chip offers both and lets the compiler choose. Chương 11 (computer arithmetic) is the chapter that explains what is being given up.</li>
<li><strong>Four-stage multiply and four-stage add, and that sets the SIMD latency.</strong> FMUL1–FMUL4, FADD1–FADD4: floating-point is genuinely harder than integer work and takes twice as many stages as the integer ALU. Deep pipelines give throughput, not latency — one result per cycle once flowing, but each individual result is four cycles behind.</li>
<li><strong>The permute pipe is the quiet essential.</strong> SIMD only pays off when data is laid out right, and PERM1/PERM2 plus Load Align and Store Align are what rearrange it. In practice, a large share of the work in hand-written SIMD code is shuffling data into place — the arithmetic is the easy part.</li>
</ul>
<p class="meo">💡 The whole NEON unit is one sentence: <strong>a second, narrower processor bolted on to share the same L1/L2, with its own register file and a deliberately sloppier (but faster) floating-point unit.</strong> That is also, structurally, what a GPU is.</p>
<p class="pitfall">⚠️ Do not add the 10 SIMD stages to the 13 integer stages. They are <em>parallel</em> pipelines, not sequential ones — an instruction goes down one or the other, never both. The chip is 13 stages deep for integer work and 10 for SIMD work, not 23 for anything.</p>`,
        `<p class="y-chinh">🎯 Nửa SIMD của con chip, vẽ đầy đủ. Đây là <strong>đường ống 10 tầng</strong> mà slide 27 dán nhãn "10-stage SIMD pipeline", và nó gần như là một bộ xử lý THỨ HAI với bộ giải mã riêng, tệp thanh ghi riêng và bộ ống thực thi riêng.</p>
<table>
<tr><th>Phần của hình</th><th>Các khối được vẽ</th></tr>
<tr><td><strong>Instruction decode</strong> — giải mã (3 tầng)</td><td>16-entry Inst queue + Inst Dec · Dec queue + Rd/Wr check · Scoreboard + Issue logic</td></tr>
<tr><td><strong>Đọc thanh ghi</strong> (1 tầng)</td><td>Reg read + M3 fwding muxes — được nuôi bởi bus "NEON register writeback" vòng ngược từ cuối về</td></tr>
<tr><td><strong>Ống Integer ALU / MAC / SHIFT</strong> (6 tầng)</td><td>DUP → MUL1 → MUL2 → ACC1 → ACC2 → WB · Shift1 → Shift2 → Shift3 → WB · FMT → ALU → ABS → WB</td></tr>
<tr><td><strong>Ống FMUL không theo IEEE</strong></td><td>FDUP → FMUL1 → FMUL2 → FMUL3 → FMUL4 → WB</td></tr>
<tr><td><strong>Ống FADD không theo IEEE</strong></td><td>FFMT → FADD1 → FADD2 → FADD3 → FADD4 → WB</td></tr>
<tr><td><strong>VFP chính xác đơn/kép theo IEEE</strong></td><td>VFP → WB</td></tr>
<tr><td><strong>Load/store và hoán vị</strong></td><td>Mux L1/MCR → hàng đợi store 8 mục → Load Align → Mux with NRF, dẫn vào PERM1 → PERM2 → Store Align → hàng đợi store 8 mục → WB</td></tr>
</table>
<p class="dap-an">✅ Lại phép cộng: <strong>3 (giải mã) + 1 (đọc thanh ghi) + 6 (thực thi) = 10</strong>, đúng cái dấu ngoặc "10-stage SIMD pipeline" trên Figure 18.10. Hai hình vẽ độc lập nhau mà khớp — đó là cách bạn NGHIỆM THU rằng mình đã đọc đúng một sơ đồ khối.</p>
<ul>
<li><strong>Để ý cấu trúc này là một BẢN SAO của phía số nguyên, không phải thứ gì mới.</strong> Hàng đợi lệnh → giải mã → scoreboard và logic phát → đọc thanh ghi → các ống thực thi song song → ghi ngược. Cùng bộ xương với Figure 18.11. Đọc được một đường ống bộ xử lý là đọc được tất cả; chỉ tên trong các ô là đổi.</li>
<li><strong>Đếm số ống là biết luật phát đôi của SIMD mà không cần bảng nào.</strong> Có một chuỗi MUL/MAC, một chuỗi dịch, một chuỗi ALU, một FMUL, một FADD, một VFP, một đường hoán vị. Hai lệnh NEON cần cùng một chuỗi trong cùng một chu kỳ là xung đột — đúng lối suy luận đã sinh ra Table 18.4 cho phía số nguyên.</li>
<li><strong>Chữ "non-IEEE" trên hai cái ống là một sự thoả hiệp CÓ CHỦ Ý, và quan trọng.</strong> Ống FMUL và FADD nhanh <em>KHÔNG</em> hiện thực đầy đủ ngữ nghĩa IEEE 754 (số cận chuẩn, mọi chế độ làm tròn, hành vi ngoại lệ chính xác). Việc cần IEEE nghiêm ngặt bị đẩy sang khối VFP đơn lẻ, vốn chậm hơn nhiều. Mã đa phương tiện — âm thanh, video, đồ hoạ — không quan tâm tới bit cuối; mã khoa học thì có. Con chip cho cả hai và để trình biên dịch chọn. Chương 11 (số học máy tính) là chương giải thích thứ đang bị đánh đổi.</li>
<li><strong>Nhân bốn tầng và cộng bốn tầng — đó là độ trễ SIMD.</strong> FMUL1–FMUL4, FADD1–FADD4: dấu chấm động thật sự khó hơn việc số nguyên và tốn gấp đôi số tầng so với ALU nguyên. Ống sâu cho THÔNG LƯỢNG, không cho ĐỘ TRỄ — một kết quả mỗi chu kỳ khi đã chảy đều, nhưng từng kết quả riêng lẻ thì trễ bốn chu kỳ.</li>
<li><strong>Ống hoán vị là thứ thiết yếu lặng lẽ.</strong> SIMD chỉ có lời khi dữ liệu nằm đúng chỗ, và PERM1/PERM2 cộng Load Align, Store Align là thứ sắp xếp lại. Trên thực tế, một phần lớn công việc trong mã SIMD viết tay là XÁO DỮ LIỆU vào đúng vị trí — phần số học mới là phần dễ.</li>
</ul>
<p class="meo">💡 Cả khối NEON gói trong một câu: <strong>một bộ xử lý thứ hai, hẹp hơn, bắt vít vào để dùng chung L1/L2, có tệp thanh ghi riêng và một khối dấu chấm động cố ý CẨU THẢ hơn (nhưng nhanh hơn).</strong> Về mặt cấu trúc, đó cũng chính là một GPU.</p>
<p class="pitfall">⚠️ Đừng cộng 10 tầng SIMD vào 13 tầng số nguyên. Chúng là hai đường ống <em>SONG SONG</em>, không nối tiếp — một lệnh đi xuống cái này hoặc cái kia, không bao giờ cả hai. Con chip sâu 13 tầng cho việc số nguyên và 10 tầng cho việc SIMD, chứ không 23 tầng cho bất cứ thứ gì.</p>`],

      [38, 'Figure 18.13 — ARM Cortex-M3 Block Diagram',
        `<p class="y-chinh">🎯 The third chip, and the point of showing it is the <strong>contrast</strong>. The Cortex-M3 is a microcontroller core — no superscalar issue, no NEON, no L2, not even a cache on this diagram. Everything the chapter has been adding, this design deliberately leaves out.</p>
<table>
<tr><th>Block in the figure</th><th>What it is for</th><th>Optional (‡)?</th></tr>
<tr><td><strong>Cortex-M3 Processor Core</strong>: Fetch · Decode · Execute · Register Bank · Memory Interface</td><td>The entire processor — a <strong>three-stage</strong> pipeline and a register bank</td><td>No</td></tr>
<tr><td><strong>Nested Vectored Interrupt Controller</strong></td><td>Prioritised, nested interrupt handling with low, deterministic latency</td><td>No</td></tr>
<tr><td><strong>Wake-up Interrupt Controller</strong></td><td>Wakes the core from a low-power sleep state</td><td>‡ Optional</td></tr>
<tr><td><strong>Memory Protection Unit</strong></td><td>Region-based protection — Chương 8's protection without full paging</td><td>‡ Optional</td></tr>
<tr><td><strong>Embedded Trace Macrocell</strong> · <strong>Debug Access Port</strong> · <strong>Flash patch and breakpoint</strong> · <strong>Data watchpoint and trace</strong> · <strong>Serial Wire viewer</strong></td><td>Five separate debug and trace facilities</td><td>‡ All optional</td></tr>
<tr><td><strong>Bus Matrix</strong>, with <strong>Code interface</strong> and <strong>SRAM and peripheral interface</strong></td><td>Two separate buses — a Harvard-style split of code and data paths</td><td>No</td></tr>
</table>
<ul>
<li><strong>Count the optional blocks: five of the eleven are marked ‡.</strong> This is not one chip but a <em>kit</em>. A silicon vendor buys the core and chooses whether to pay area and power for the MPU, the trace macrocell, the wake-up controller. A phone processor cannot be configured away like this; an embedded core must be, because the customer may be building a toothbrush or a pacemaker.</li>
<li><strong>Interrupt hardware occupies more of the diagram than the processor core does, and that is the whole design philosophy.</strong> A microcontroller spends its life responding to events, so what matters is not instructions per cycle but the <em>worst-case</em> time from an interrupt to the first instruction of its handler. "Nested vectored" means interrupts have priorities and a higher one can pre-empt a lower one without software help. Chương 7 (input/output) described interrupt-driven I/O; this is the silicon built for nothing else.</li>
<li><strong>No cache appears on this diagram at all.</strong> Memory is small, close and predictable — typically on-chip flash and SRAM. Remove the cache and you remove the single biggest source of timing variability, which is exactly what a real-time system wants. Chương 4's whole argument only applies when memory is far away.</li>
<li><strong>Five debug blocks is not indulgence.</strong> An embedded core is soldered inside a device with no screen, no keyboard and no operating system. If you cannot trace it over a two-wire link, you cannot develop for it at all. The Serial Wire viewer streams program activity out over a single pin.</li>
<li><strong>The bus matrix with separate code and SRAM interfaces is a Harvard split.</strong> Instructions and data travel on different paths, so a fetch and a load do not contend. It buys the same thing a split L1 cache buys on a big core (Chương 4), without any cache.</li>
</ul>
<p class="meo">💡 Hold the three chips of this chapter as three points on one axis: <strong>Intel Core = maximum ILP at any cost · Cortex-A8 = balanced ILP per watt · Cortex-M3 = no ILP, minimum area and predictable latency.</strong> Same instruction set family for the last two, completely different answers, because "fast" means different things.</p>
<p class="pitfall">⚠️ Do not read this diagram as a cut-down A8. It is a different architecture profile: the M-profile implements only the Thumb instruction set and is not intended to run a general-purpose operating system. Comparing its clock speed or IPC with an A8's is meaningless — they are not competing for the same job.</p>`,
        `<p class="y-chinh">🎯 Con chip thứ ba, và mục đích trưng nó ra là để <strong>ĐỐI CHIẾU</strong>. Cortex-M3 là lõi vi điều khiển — không phát superscalar, không NEON, không L2, trên sơ đồ này thậm chí không có cache. Mọi thứ mà cả chương này cộng thêm vào, thiết kế đó CỐ Ý bỏ đi.</p>
<table>
<tr><th>Khối trên hình</th><th>Nó để làm gì</th><th>Tuỳ chọn (‡)?</th></tr>
<tr><td><strong>Cortex-M3 Processor Core</strong>: Fetch · Decode · Execute · Register Bank · Memory Interface</td><td>Toàn bộ bộ xử lý — một đường ống <strong>BA TẦNG</strong> và một dãy thanh ghi</td><td>Không</td></tr>
<tr><td><strong>Nested Vectored Interrupt Controller</strong></td><td>Xử lý ngắt có ưu tiên, lồng nhau, độ trễ thấp và TIÊN ĐOÁN ĐƯỢC</td><td>Không</td></tr>
<tr><td><strong>Wake-up Interrupt Controller</strong></td><td>Đánh thức lõi khỏi trạng thái ngủ tiết kiệm điện</td><td>‡ Tuỳ chọn</td></tr>
<tr><td><strong>Memory Protection Unit</strong></td><td>Bảo vệ theo vùng — sự bảo vệ của Chương 8 mà không cần phân trang đầy đủ</td><td>‡ Tuỳ chọn</td></tr>
<tr><td><strong>Embedded Trace Macrocell</strong> · <strong>Debug Access Port</strong> · <strong>Flash patch and breakpoint</strong> · <strong>Data watchpoint and trace</strong> · <strong>Serial Wire viewer</strong></td><td>Năm tiện ích gỡ lỗi và truy vết riêng biệt</td><td>‡ Tuỳ chọn cả năm</td></tr>
<tr><td><strong>Bus Matrix</strong>, với <strong>Code interface</strong> và <strong>SRAM and peripheral interface</strong></td><td>Hai bus tách rời — một cú tách kiểu Harvard giữa đường mã và đường dữ liệu</td><td>Không</td></tr>
</table>
<ul>
<li><strong>Đếm số khối tuỳ chọn: năm trên mười một khối có dấu ‡.</strong> Đây không phải một con chip mà là một <em>BỘ LẮP GHÉP</em>. Hãng làm silicon mua cái lõi rồi chọn có trả diện tích và điện cho MPU, cho khối truy vết, cho bộ đánh thức hay không. Bộ xử lý điện thoại không cấu hình bớt kiểu này được; lõi nhúng thì BẮT BUỘC phải được, vì khách hàng có thể đang làm một cái bàn chải đánh răng hoặc một máy tạo nhịp tim.</li>
<li><strong>Phần cứng ngắt chiếm nhiều diện tích hình hơn cả lõi xử lý, và đó là toàn bộ triết lý thiết kế.</strong> Vi điều khiển sống cả đời để phản ứng với sự kiện, nên thứ quan trọng không phải số lệnh mỗi chu kỳ mà là thời gian <em>XẤU NHẤT</em> từ lúc có ngắt tới lệnh đầu tiên của trình xử lý ngắt. "Nested vectored" nghĩa là các ngắt có mức ưu tiên và ngắt cao có thể chen ngang ngắt thấp mà không cần phần mềm trợ giúp. Chương 7 (vào/ra) mô tả vào/ra điều khiển bằng ngắt; đây là silicon dựng ra chỉ để làm đúng việc đó.</li>
<li><strong>Trên sơ đồ này KHÔNG hề có cache.</strong> Bộ nhớ nhỏ, gần và tiên đoán được — thường là flash và SRAM ngay trên chip. Bỏ cache là bỏ nguồn gây biến thiên định thời lớn nhất, và đó chính xác là thứ một hệ thống thời gian thực mong muốn. Toàn bộ lập luận của Chương 4 chỉ áp dụng khi bộ nhớ ở XA.</li>
<li><strong>Năm khối gỡ lỗi không phải sự xa xỉ.</strong> Một lõi nhúng bị hàn chết bên trong một thiết bị không màn hình, không bàn phím, không hệ điều hành. Nếu không truy vết được nó qua một đường hai dây thì bạn không phát triển gì được cả. Serial Wire viewer đẩy hoạt động của chương trình ra ngoài qua ĐÚNG MỘT chân.</li>
<li><strong>Bus matrix với giao diện mã và giao diện SRAM tách rời là một cú tách Harvard.</strong> Lệnh và dữ liệu đi trên hai đường khác nhau, nên một lần nạp lệnh và một lệnh load không tranh nhau. Nó mua đúng cái mà L1 tách đôi mua được trên lõi lớn (Chương 4), mà không cần cache nào.</li>
</ul>
<p class="meo">💡 Giữ ba con chip của chương này như ba điểm trên một trục: <strong>Intel Core = tối đa ILP bằng mọi giá · Cortex-A8 = ILP cân bằng trên mỗi watt · Cortex-M3 = KHÔNG ILP, diện tích nhỏ nhất và độ trễ tiên đoán được.</strong> Hai cái sau cùng một họ tập lệnh, mà đáp án khác hẳn nhau, vì chữ "nhanh" mang nghĩa khác nhau.</p>
<p class="pitfall">⚠️ Đừng đọc sơ đồ này như một A8 bị cắt gọt. Nó là một hồ sơ kiến trúc KHÁC: dòng M chỉ hiện thực tập lệnh Thumb và không nhằm chạy một hệ điều hành đa dụng. So xung nhịp hay IPC của nó với A8 là vô nghĩa — chúng không tranh nhau cùng một việc.</p>`],

      [39, 'Figure 18.14 — ARM Cortex-M3 Pipeline (three stages, and the branch story)',
        `<p class="y-chinh">🎯 The last figure of the chapter, and the smallest pipeline in it: <strong>Fetch · Decode · Execute</strong>. Three stages, and three separate feedback paths at the bottom for dealing with branches. After thirteen stages and reorder buffers, this is what the same problem looks like when you refuse to spend anything on it.</p>
<table>
<tr><th>Stage</th><th>Blocks drawn inside it</th></tr>
<tr><td><strong>Fetch</strong></td><td>Fetch (a single tall block)</td></tr>
<tr><td><strong>Decode</strong></td><td>Instruction decode and register read · AGU (above it) · Branch (below it)</td></tr>
<tr><td><strong>Execute</strong></td><td>Address phase and writeback → Data phase load/store and branch · Multiply and divide · Shift → ALU and branch · then WR (write) collecting all three</td></tr>
</table>
<table>
<tr><th>Feedback path at the bottom</th><th>Where it comes from</th><th>What it means</th></tr>
<tr><td><strong>Branch forwarding and speculation</strong></td><td>From the Branch block in <em>Decode</em></td><td>The cheapest case: a simple branch is spotted at decode and the fetch is redirected immediately</td></tr>
<tr><td><strong>ALU branch not forwarded/speculated</strong></td><td>From <em>ALU and branch</em> in Execute</td><td>A branch whose condition depends on an ALU result cannot be resolved early — it costs the full pipeline refill</td></tr>
<tr><td><strong>LSU branch result</strong></td><td>From the load/store data phase</td><td>A branch through a loaded value (<code>LDR pc, ...</code>) is resolved latest of all</td></tr>
</table>
<ul>
<li><strong>Three resolution points, three different prices — that is the entire branch design of this chip.</strong> Resolve at decode and you lose almost nothing; resolve at the ALU and you lose the stages in between; resolve after a load and you lose more still. A big core hides all three behind a predictor; the M3 exposes them, and embedded programmers count them.</li>
<li><strong>Why a 3-stage pipeline is the <em>right</em> answer here.</strong> Mispredict cost grows with depth. A 13-stage A8 throws away about a dozen slots on a wrong guess; a 3-stage M3 throws away two. Short pipelines are bad for clock frequency and excellent for predictability — and predictability is the product a microcontroller sells.</li>
<li><strong>"Speculation" appears even here, on the cheapest core in the chapter.</strong> The label reads "Branch forwarding and <em>speculation</em>". Even a three-stage pipeline guesses, because even two wasted cycles per branch is worth avoiding. Speculation is not a big-core luxury; it is what any pipeline does as soon as it is longer than one stage.</li>
<li><strong>Compare the execute stage with the A8's six.</strong> Here everything — address phase, data phase, multiply, divide, shift, ALU, branch, write — is crammed into <em>one</em> stage. That is why the M3 cannot clock as high as an A8: the longest combinational path through that stage sets the cycle time. Depth versus frequency, the trade-off from Chương 12, laid bare.</li>
<li><strong>Multiply and divide share a single block, and divide is genuinely multi-cycle.</strong> On a core this small, an instruction that takes many cycles simply stalls the pipeline — no scoreboard, no replay queue, no out-of-order work to fill the gap. Simplicity has a running cost, paid every time.</li>
</ul>
<p class="meo">💡 The three ARM pipelines of this chapter, as a single memorable line: <strong>M3 = 3 stages · A8 integer = 13 stages · A8 NEON = 10 stages.</strong> If you remember only three numbers from the ARM half of the chapter, make it those.</p>
<p class="pitfall">⚠️ Do not conclude that a shorter pipeline is "worse". Depth buys clock frequency and costs mispredict penalty; it is a trade, not a ranking. The M3 is optimised for <em>worst-case</em> latency, the A8 for average throughput — two different objective functions, and the chapter shows both being optimised correctly.</p>`,
        `<p class="y-chinh">🎯 Hình cuối cùng của chương, và là đường ống nhỏ nhất trong đó: <strong>Fetch · Decode · Execute</strong>. Ba tầng, và ba đường hồi tiếp riêng biệt ở dưới đáy để xử lý rẽ nhánh. Sau mười ba tầng và các bộ đệm sắp xếp lại, đây là hình dạng của CÙNG bài toán đó khi bạn từ chối chi bất cứ thứ gì cho nó.</p>
<table>
<tr><th>Tầng</th><th>Các khối vẽ bên trong</th></tr>
<tr><td><strong>Fetch</strong></td><td>Fetch (một khối cao duy nhất)</td></tr>
<tr><td><strong>Decode</strong></td><td>Instruction decode and register read · AGU (bên trên) · Branch (bên dưới)</td></tr>
<tr><td><strong>Execute</strong></td><td>Address phase and writeback → Data phase load/store and branch · Multiply and divide · Shift → ALU and branch · rồi WR (ghi) gom cả ba lại</td></tr>
</table>
<table>
<tr><th>Đường hồi tiếp dưới đáy</th><th>Xuất phát từ đâu</th><th>Nghĩa là gì</th></tr>
<tr><td><strong>Branch forwarding and speculation</strong></td><td>Từ khối Branch trong tầng <em>Decode</em></td><td>Ca rẻ nhất: một lệnh rẽ nhánh đơn giản bị phát hiện ngay ở giải mã và việc nạp được bẻ hướng lập tức</td></tr>
<tr><td><strong>ALU branch not forwarded/speculated</strong></td><td>Từ <em>ALU and branch</em> trong Execute</td><td>Một nhánh mà điều kiện phụ thuộc kết quả ALU thì không phân giải sớm được — tốn nguyên một lần nạp lại đường ống</td></tr>
<tr><td><strong>LSU branch result</strong></td><td>Từ pha dữ liệu của load/store</td><td>Một nhánh đi qua giá trị vừa nạp (<code>LDR pc, ...</code>) được phân giải MUỘN NHẤT</td></tr>
</table>
<ul>
<li><strong>Ba điểm phân giải, ba mức giá khác nhau — đó là toàn bộ thiết kế rẽ nhánh của con chip này.</strong> Phân giải ở giải mã thì gần như không mất gì; phân giải ở ALU thì mất các tầng ở giữa; phân giải sau một lệnh load thì mất nhiều hơn nữa. Lõi lớn giấu cả ba đằng sau một bộ dự đoán; M3 phơi chúng ra, và lập trình viên nhúng ĐẾM chúng.</li>
<li><strong>Vì sao đường ống 3 tầng là đáp án ĐÚNG ở đây.</strong> Giá của đoán sai tăng theo ĐỘ SÂU. A8 13 tầng vứt đi khoảng một tá ô lệnh cho một cú đoán sai; M3 3 tầng vứt đi HAI. Ống ngắn thì dở cho tần số xung nhịp và tuyệt vời cho tính tiên đoán được — mà tính tiên đoán được chính là món hàng mà vi điều khiển đem bán.</li>
<li><strong>Chữ "suy đoán" xuất hiện ngay cả ở đây, trên cái lõi rẻ nhất của chương.</strong> Nhãn ghi "Branch forwarding and <em>speculation</em>". Ngay cả đường ống ba tầng cũng ĐOÁN, vì ngay cả hai chu kỳ phí mỗi lần rẽ nhánh cũng đáng tránh. Suy đoán không phải xa xỉ phẩm của lõi lớn; nó là thứ mà MỌI đường ống làm ngay khi nó dài hơn một tầng.</li>
<li><strong>So tầng thực thi ở đây với sáu tầng của A8.</strong> Ở đây mọi thứ — pha địa chỉ, pha dữ liệu, nhân, chia, dịch, ALU, rẽ nhánh, ghi — bị nhét vào <em>MỘT</em> tầng. Đó là lý do M3 không chạy được xung nhịp cao như A8: đường tổ hợp dài nhất xuyên qua tầng đó quyết định chu kỳ đồng hồ. Độ sâu đổi lấy tần số, cú đánh đổi của Chương 12, phơi trần ra.</li>
<li><strong>Nhân và chia dùng chung một khối, và chia thì thật sự nhiều chu kỳ.</strong> Trên một lõi bé thế này, một lệnh tốn nhiều chu kỳ đơn giản là làm KẸT cả đường ống — không scoreboard, không hàng đợi replay, không việc không-theo-thứ-tự nào để lấp chỗ trống. Sự đơn giản có chi phí vận hành, trả mỗi lần.</li>
</ul>
<p class="meo">💡 Ba đường ống ARM của chương này, gói thành một dòng dễ nhớ: <strong>M3 = 3 tầng · A8 số nguyên = 13 tầng · A8 NEON = 10 tầng.</strong> Nếu chỉ nhớ được ba con số từ nửa ARM của chương, hãy nhớ ba con số đó.</p>
<p class="pitfall">⚠️ Đừng kết luận rằng ống ngắn hơn thì "tệ hơn". Độ sâu mua tần số xung nhịp và tốn tiền phạt đoán sai; đó là một cuộc ĐÁNH ĐỔI, không phải một bảng xếp hạng. M3 tối ưu cho độ trễ <em>XẤU NHẤT</em>, A8 tối ưu cho thông lượng trung bình — hai hàm mục tiêu khác nhau, và chương này cho thấy CẢ HAI đều đang được tối ưu đúng.</p>`],

      [40, 'Summary — Chapter 18: Instruction-Level Parallelism and Superscalar Processors',
        `<p class="y-chinh">🎯 The closing checklist. Read it as a self-test: for every line you cannot explain in two sentences, go back to the slide it came from.</p>
<table>
<tr><th>Summary heading (slide)</th><th>Sub-points listed</th><th>Where it was taught</th></tr>
<tr><td><strong>Superscalar versus Superpipelined</strong></td><td>—</td><td>Slides 2–6 (part A)</td></tr>
<tr><td><strong>Constraints</strong></td><td>—</td><td>Slides 7–8 (part A): true data dependency, procedural dependency, resource conflicts, output dependency, antidependency</td></tr>
<tr><td><strong>Design issues</strong></td><td>Instruction-level parallelism · Machine parallelism · Instruction issue policy · Register renaming · Branch prediction · Superscalar execution · Superscalar implementation</td><td>Slides 9–17 (part A), plus slide 26 here</td></tr>
<tr><td><strong>Intel core microarchitecture</strong></td><td>Front end · Out-of-order execution logic · Integer and floating-point execution units</td><td><strong>Slides 18–26</strong></td></tr>
<tr><td><strong>ARM Cortex-A8</strong></td><td>Instruction fetch unit · Instruction decode unit · Integer execute unit · SIMD and floating-point pipeline</td><td><strong>Slides 27–37</strong></td></tr>
<tr><td><strong>ARM Cortex-M3</strong></td><td>Pipeline structure · Dealing with branches</td><td><strong>Slides 38–39</strong></td></tr>
</table>
<p class="nhan">📐 <strong>Extension, not on the slide but the natural next question: why not simply keep widening?</strong> If 2-issue is good and 4-issue better, why did nobody ship a 32-issue processor? Model it: suppose a branch every 5 instructions, a mispredict costing 12 cycles of refill, and issue width W. Cycles per 5 instructions ≈ 5/W + (1−p)×12.</p>
<table>
<tr><th>Prediction accuracy</th><th>W = 2</th><th>W = 4</th><th>W = 8</th><th>W = 16</th><th>Ceiling as W → ∞</th></tr>
<tr><td>90%</td><td>IPC 1,35</td><td>2,04</td><td>2,74</td><td>3,31</td><td><strong>4,17</strong></td></tr>
<tr><td>95%</td><td>1,61</td><td>2,70</td><td>4,08</td><td>5,48</td><td><strong>8,33</strong></td></tr>
<tr><td>98%</td><td>1,82</td><td>3,36</td><td>5,78</td><td>9,05</td><td><strong>20,83</strong></td></tr>
</table>
<p class="dap-an">✅ Computed, not asserted. At 95% accuracy, doubling from W = 4 to W = 8 buys only <strong>1,51×</strong>, and from 8 to 16 only <strong>1,34×</strong> — and no width whatsoever passes IPC 8,33. Four forces cap ILP: <strong>(1) true data dependencies</strong>, which no renaming can remove (slide 26); <strong>(2) branch prediction accuracy</strong>, which sets the hard ceiling above; <strong>(3) instruction window size</strong> — a 126-entry window needs 126×125÷2 = <strong>7 875</strong> pairwise dependency comparisons, and that grows with the <em>square</em> of the window; <strong>(4) power</strong>, because issue and bypass logic also grows roughly as W<sup>2</sup> (W = 2 → 4 units of logic, W = 16 → 256). Diminishing returns on the benefit, quadratic growth in the cost.</p>
<ul>
<li><strong>That arithmetic is the reason this course has a Chương 15 and Chương 16.</strong> Around 2005 the industry stopped widening single cores and started replicating them. The transistors were still arriving on schedule; there was simply nothing profitable left to spend them on inside one instruction stream. Multicore is not a better idea than ILP — it is what you do <em>after</em> ILP stops paying. Parallelism moves from one the hardware finds by itself (this chapter) to one the programmer must expose (the next).</li>
<li><strong>The three chips are the chapter's real argument.</strong> Intel Core spends a reorder buffer, 128 physical registers and five branch predictors to extract ILP out of order. Cortex-A8 gets two-issue in order for a fraction of the power — and Table 18.5 measured what that costs: <strong>IPC 1,105 on a 2-issue machine</strong>. Cortex-M3 declines ILP entirely and sells predictability instead. Three correct answers to three different questions.</li>
<li><strong>The five constraints of slide 7 are the skeleton of everything since.</strong> True data dependency → the only one that is irreducible. Procedural dependency → branch prediction (slide 21) and speculation. Resource conflict → Table 18.4 (slide 33). Output dependency and antidependency → register renaming (slide 26), or in-order write-back (slide 30). Every mechanism in the second half of this chapter is an answer to one of those five.</li>
<li><strong>The one principle to carry out of the chapter:</strong> <strong>execution may be out of order, but commit must be in order.</strong> That sentence is what makes speculation safe, exceptions precise and out-of-order machines correct — and its one leak, the microarchitectural trace left in the cache, is Spectre (slide 25).</li>
<li><strong>What to revise if time is short:</strong> the four dependency types and how to spot them in code; the three issue policies and their diagrams; a renaming example with WAR and WAW (slide 26); the six dual-issue restrictions (slide 33); and the method for reading a cycle table (slide 36). Those five carry almost all the marks.</li>
</ul>
<p class="meo">💡 The whole chapter in one sentence: <strong>a superscalar processor buys speed by executing instructions in the wrong order, and buys correctness back by committing them in the right one.</strong></p>
<p class="pitfall">⚠️ Note what the summary does <em>not</em> list: no mention of speculative execution as a named topic, no mention of the reorder buffer, no mention of commit or retirement. Those concepts are present in the chapter (slides 21, 25, 29) but never named in the summary — so do not take this list as a complete revision guide. Take it as the slide deck's table of contents.</p>`,
        `<p class="y-chinh">🎯 Danh sách kiểm cuối chương. Hãy đọc nó như một bài tự kiểm: dòng nào bạn không giải thích nổi trong hai câu thì quay lại đúng slide sinh ra nó.</p>
<table>
<tr><th>Đề mục tổng kết (theo slide)</th><th>Các ý con được liệt kê</th><th>Dạy ở đâu</th></tr>
<tr><td><strong>Superscalar versus Superpipelined</strong></td><td>—</td><td>Slide 2–6 (phần A)</td></tr>
<tr><td><strong>Constraints</strong> — các ràng buộc</td><td>—</td><td>Slide 7–8 (phần A): phụ thuộc dữ liệu thật, phụ thuộc thủ tục, xung đột tài nguyên, phụ thuộc đầu ra, phản phụ thuộc</td></tr>
<tr><td><strong>Design issues</strong> — vấn đề thiết kế</td><td>Song song mức lệnh · Song song của máy · Chính sách phát lệnh · Đổi tên thanh ghi · Dự đoán rẽ nhánh · Thực thi superscalar · Hiện thực superscalar</td><td>Slide 9–17 (phần A), cộng slide 26 ở đây</td></tr>
<tr><td><strong>Intel core microarchitecture</strong></td><td>Front end · Khối thực thi không theo thứ tự · Khối thực thi nguyên và dấu chấm động</td><td><strong>Slide 18–26</strong></td></tr>
<tr><td><strong>ARM Cortex-A8</strong></td><td>Khối nạp lệnh · Khối giải mã lệnh · Khối thực thi nguyên · Đường ống SIMD và dấu chấm động</td><td><strong>Slide 27–37</strong></td></tr>
<tr><td><strong>ARM Cortex-M3</strong></td><td>Cấu trúc đường ống · Xử lý rẽ nhánh</td><td><strong>Slide 38–39</strong></td></tr>
</table>
<p class="nhan">📐 <strong>Phần MỞ RỘNG, không có trên slide nhưng là câu hỏi kế tiếp tự nhiên: sao không cứ nới rộng mãi?</strong> Nếu phát 2 đã tốt và phát 4 tốt hơn, sao không ai bán bộ xử lý phát 32? Hãy mô hình hoá: giả sử cứ 5 lệnh có một rẽ nhánh, đoán sai tốn 12 chu kỳ nạp lại ống, và độ rộng phát là W. Số chu kỳ cho 5 lệnh ≈ 5/W + (1−p)×12.</p>
<table>
<tr><th>Độ chính xác dự đoán</th><th>W = 2</th><th>W = 4</th><th>W = 8</th><th>W = 16</th><th>Trần khi W → vô cùng</th></tr>
<tr><td>90%</td><td>IPC 1,35</td><td>2,04</td><td>2,74</td><td>3,31</td><td><strong>4,17</strong></td></tr>
<tr><td>95%</td><td>1,61</td><td>2,70</td><td>4,08</td><td>5,48</td><td><strong>8,33</strong></td></tr>
<tr><td>98%</td><td>1,82</td><td>3,36</td><td>5,78</td><td>9,05</td><td><strong>20,83</strong></td></tr>
</table>
<p class="dap-an">✅ TÍNH ra, không phán bừa. Ở độ chính xác 95%, nhân đôi từ W = 4 lên W = 8 chỉ mua được <strong>1,51×</strong>, và từ 8 lên 16 chỉ còn <strong>1,34×</strong> — và KHÔNG độ rộng nào vượt qua nổi IPC 8,33. Bốn lực chặn ILP lại: <strong>(1) phụ thuộc dữ liệu THẬT</strong>, thứ mà không phép đổi tên nào gỡ được (slide 26); <strong>(2) độ chính xác dự đoán rẽ nhánh</strong>, thứ đặt ra cái trần cứng phía trên; <strong>(3) kích thước cửa sổ lệnh</strong> — cửa sổ 126 mục cần 126×125÷2 = <strong>7 875</strong> phép so sánh phụ thuộc từng cặp, và con số đó tăng theo BÌNH PHƯƠNG của cửa sổ; <strong>(4) ĐIỆN NĂNG</strong>, vì logic phát lệnh và logic chuyển tiếp cũng tăng xấp xỉ theo W<sup>2</sup> (W = 2 → 4 đơn vị logic, W = 16 → 256). Lợi ích giảm dần, chi phí tăng bình phương.</p>
<ul>
<li><strong>Chính phép tính đó là lý do môn này có Chương 15 và Chương 16.</strong> Khoảng năm 2005 cả ngành thôi nới rộng lõi đơn và bắt đầu NHÂN BẢN chúng. Transistor vẫn về đúng hẹn; chỉ là đơn giản không còn chỗ nào sinh lời để tiêu chúng bên trong MỘT luồng lệnh. Đa lõi không phải một ý tưởng HAY HƠN ILP — nó là thứ bạn làm <em>SAU KHI</em> ILP thôi sinh lời. Song song chuyển từ loại mà phần cứng tự tìm ra (chương này) sang loại mà lập trình viên phải phơi ra (chương sau).</li>
<li><strong>Ba con chip mới là lập luận thật của chương.</strong> Intel Core chi một bộ đệm sắp xếp lại, 128 thanh ghi vật lý và năm bộ dự đoán rẽ nhánh để vắt ILP không theo thứ tự. Cortex-A8 lấy phát đôi đúng thứ tự với một phần nhỏ điện năng — và Table 18.5 đã ĐO cái giá đó: <strong>IPC 1,105 trên một máy phát 2</strong>. Cortex-M3 từ chối ILP hoàn toàn và bán tính tiên đoán được thay vào đó. Ba đáp án ĐÚNG cho ba câu hỏi khác nhau.</li>
<li><strong>Năm ràng buộc của slide 7 là bộ xương của mọi thứ từ đó tới nay.</strong> Phụ thuộc dữ liệu thật → cái duy nhất không rút gọn được. Phụ thuộc thủ tục → dự đoán rẽ nhánh (slide 21) và suy đoán. Xung đột tài nguyên → Table 18.4 (slide 33). Phụ thuộc đầu ra và phản phụ thuộc → đổi tên thanh ghi (slide 26), hoặc ghi ngược đúng thứ tự (slide 30). MỌI cơ chế trong nửa sau của chương đều là câu trả lời cho một trong năm cái đó.</li>
<li><strong>Một nguyên tắc mang ra khỏi chương:</strong> <strong>THỰC THI có thể sai thứ tự, nhưng CAM KẾT phải đúng thứ tự.</strong> Câu đó là thứ làm cho suy đoán an toàn, ngoại lệ chính xác và máy không-theo-thứ-tự vẫn đúng — và chỗ rò duy nhất của nó, cái dấu vết vi kiến trúc để lại trong cache, chính là Spectre (slide 25).</li>
<li><strong>Nếu ít thời gian thì ôn gì:</strong> bốn loại phụ thuộc và cách nhận ra chúng trong mã; ba chính sách phát lệnh và giản đồ của chúng; một ví dụ đổi tên có đủ WAR và WAW (slide 26); sáu luật cấm phát đôi (slide 33); và phương pháp đọc một bảng chu kỳ (slide 36). Năm thứ đó gánh gần hết điểm.</li>
</ul>
<p class="meo">💡 Cả chương trong một câu: <strong>bộ xử lý superscalar mua tốc độ bằng cách chạy lệnh SAI THỨ TỰ, rồi mua lại tính đúng đắn bằng cách cam kết chúng ĐÚNG THỨ TỰ.</strong></p>
<p class="pitfall">⚠️ Để ý thứ mà bảng tổng kết <em>KHÔNG</em> liệt kê: không nhắc thực thi suy đoán như một đề mục có tên, không nhắc bộ đệm sắp xếp lại, không nhắc cam kết hay rút lệnh. Những khái niệm đó CÓ trong chương (slide 21, 25, 29) nhưng không hề được gọi tên trong phần tổng kết — nên đừng coi danh sách này là bản hướng dẫn ôn tập đầy đủ. Hãy coi nó là MỤC LỤC của bộ slide.</p>`],

    ]),
  ].join('\n'),
};
