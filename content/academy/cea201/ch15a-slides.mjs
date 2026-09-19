/**
 * CEA201 · Chương 15 trên web (deck 'cea20' = Ch.20 bản 11e — Parallel
 * Processing), học theo từng slide, phần slide 1–20 / 40.
 *
 * ⚠️ ĐÁNH SỐ BA ĐƯỜNG, đừng nhầm:
 *   · Slide gốc (Stallings 11th ed Global Edition) = Chapter 20.
 *   · Syllabus của trường (theo bản 9th ed) gọi là "Chapter 17: Parallel
 *     Processing".
 *   · Trên web Academy môn này đánh là "Chương 15 — Parallel Processing &
 *     Multicore", nên file tên ch15a.
 *
 * Nội dung bám ĐÚNG chữ trích từ CH20-COA11e.pptx (/tmp/cea201-text/cea20.txt).
 * Slide chỉ có tiêu đề + hình/bảng (3, 4, 5, 6, 7, 8, 14, 17, 19, 20) đã được
 * ĐỌC THẲNG TỪ ẢNH render để lấy đúng từng nhãn trên sơ đồ.
 *
 * ⚠️ MỌI con số trong bài đã chạy bằng MÁY trước khi viết:
 *   · MESI: viết mô phỏng python3 (3 CPU, một dòng cache, giao thức
 *     write-invalidate theo đúng Figure 20.6) rồi CHẠY để lấy bảng 8 bước ở
 *     slide 19. Không suy luận tay.
 *   · Amdahl (f = 0,95 song song / 5% tuần tự): 2→1,905 · 4→3,478 · 8→5,926 ·
 *     16→9,143 · 64→15,42 · 256→18,62 · 1024→19,64 · trần 20. Hiệu suất
 *     74,07% / 57,14% / 24,1% tại 8 / 16 / 64 lõi.
 *   · CHIA SẺ GIẢ — ĐO THẬT trên chính máy viết bài (Apple M1 Max, 10 nhân,
 *     hw.cachelinesize = 128 B, Apple clang, cc -O1, mã in nguyên trong bài):
 *     hai luồng tăng hai biến CÁCH NHAU 8 B → 0,356 / 0,317 / 0,325 s;
 *     CÁCH NHAU 136 B → 0,095 / 0,077 / 0,076 s ⇒ CHẬM HƠN 3,76 / 4,12 / 4,27
 *     lần. Ở -O0 chênh lệch TỤT còn 1,03–1,16 lần (chi phí vòng lặp nuốt mất
 *     hiệu ứng) — chuyện này được nói thẳng trong bài chứ không giấu.
 *   · MẤT CẬP NHẬT — ĐO THẬT: 2 luồng × 10 triệu lượt tăng một biến
 *     volatile long dùng chung, mong đợi 20.000.000, thực tế 10.461.091 /
 *     9.843.238 / 10.097.489 ⇒ MẤT 47,7% / 50,8% / 49,5% — và máy này CÓ MESI.
 *     Dùng để chứng minh: nhất quán cache ≠ đồng bộ hoá.
 *
 * Chỗ slide gốc SAI/THIẾU — nêu rõ trong bài, không im lặng chép, không tự sửa:
 *   · slide 3 (Figure 20.1): nhánh NUMA in SAI CHÍNH TẢ là "Nonumiform Memory
 *     Access" (đúng phải là "Nonuniform" — chính slide 36 viết đúng). Đã phóng
 *     to ảnh render để xác nhận, không phải lỗi đọc.
 *   · Chữ "Flynn" KHÔNG xuất hiện ở bất kỳ slide nào của deck. Slide chỉ gọi là
 *     "Multiple Processor Organization" và "A Taxonomy of Parallel Processor
 *     Architectures". Tên Flynn lấy từ sách/đề thi, bài này nói rõ.
 *   · Tiêu đề các slide hình bị DÍNH CHỮ trong bản trích ("Figure 20.2Alternative
 *     Computer Organizations", "Figure 20.3Multiprogramming…", 20.4, 20.5,
 *     20.6) — đó là lỗi xuống dòng của .pptx, không phải tên hình thật.
 *   · Công thức định luật Amdahl KHÔNG in trên slide nào của deck này; nó thuộc
 *     Chương 2. Bài này nói rõ chỗ nào là slide, chỗ nào là sách.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea20';

export default {
  title: '15.0a — Slide by slide: Flynn’s taxonomy, symmetric multiprocessors and cache coherence (slides 1–20)|||15.0a — Slide bài giảng: Phân loại Flynn, đa xử lý đối xứng & nhất quán cache (slide 1–20)',
  slug: 'cea201-15-0a-slides-flynn-smp-nhat-quan-cache',
  type: 'DOCUMENT',
  description: 'Nửa đầu chương Xử lý song song của CEA201 (slide 1–20 của deck Ch.20 bản 11e). Đi từ bảng phân loại bốn ô SISD/SIMD/MISD/MIMD (dạng bài thi số 1, có ví dụ máy thật và bài toán hợp với từng loại), qua kiến trúc đa xử lý đối xứng SMP trên bus dùng chung, tới vấn đề nhất quán cache và trọn giao thức MESI (dạng bài thi số 2) — kèm bảng chạy tay 8 bước trên 3 CPU do MÁY mô phỏng, phép đo THẬT về chia sẻ giả nhanh chậm 4,3 lần, phép đo THẬT về mất 50% cập nhật khi hai luồng cùng tăng một biến, và bảng Amdahl cho 8/16/64 lõi.',
  content: [
    walkHead(D, 1, 20),
    walk(D, [

      [1, 'Chapter 20 — Parallel Processing (title slide)',
        `<p class="y-chinh">🎯 The opening slide of the chapter that answers one question: <strong>once you cannot make a single processor go faster, what do you do?</strong> The answer for the last twenty years has been the same — stop making one processor faster and start making many processors work at once. This chapter is the vocabulary and the machinery of "many at once".</p>
<ul>
<li><strong>Numbering warning, read this first.</strong> Three different numbers name this same material. The slide deck (Stallings 11th edition, Global Edition) calls it <strong>Chapter 20</strong>. Your school syllabus follows the 9th edition and calls it <strong>Chapter 17: Parallel Processing</strong>. This website groups it as <strong>Chương 15 — Parallel Processing &amp; Multicore</strong>. Same content, three labels; do not panic when the exam paper says 17.</li>
<li><strong>The chapter has four movements.</strong> Slides 2–4: a <em>taxonomy</em> — four boxes into which every parallel machine ever built falls. Slides 5–11: <em>SMP</em>, the symmetric multiprocessor, and what it does to the operating system. Slides 12–27: <em>cache coherence</em> and the MESI protocol — the single biggest source of exam marks in the chapter. Slides 28–39: multithreading, chip multiprocessors, clusters and NUMA.</li>
<li><strong>This walkthrough covers slides 1–20</strong>, which is exactly the first three movements up to and including the MESI state transition diagram. Clusters, NUMA and multithreading are the second half of the deck.</li>
<li><strong>Why this chapter exists at all — the link back to Ch.14.</strong> Chapter 14 (superscalar, instruction-level parallelism) ended on a wall: however clever the hardware gets at finding independent instructions inside <em>one</em> instruction stream, the supply of independent instructions runs out. Add to that the power wall — dynamic power scales roughly with frequency times voltage squared, so pushing the clock up became thermally unaffordable. Both roads closed at once, around 2004. The industry turned sideways: more processors, not faster ones. That turn is what Chapter 20 documents.</li>
<li><strong>Where the exam marks are.</strong> Two question shapes, and they are both mechanical once you have the table. (1) <em>Classify this machine / this workload</em> into SISD, SIMD, MISD or MIMD. (2) <em>Given a sequence of reads and writes by several processors on one cache line, fill in the MESI state in every cache after every step.</em> This walkthrough drills both, the second with a table produced by an actual simulator rather than by hand-waving.</li>
</ul>
<p class="meo">💡 Hold one sentence for the whole chapter: <strong>parallelism is easy, sharing is hard.</strong> Bolting eight processors onto a bus takes a paragraph (slide 8). Keeping their eight caches telling the same story about one memory word takes the other twenty slides.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu chương trả lời đúng một câu hỏi: <strong>khi không thể làm một bộ xử lý chạy nhanh hơn nữa thì làm gì?</strong> Câu trả lời suốt hai mươi năm qua vẫn thế — thôi làm MỘT con nhanh hơn, quay sang cho NHIỀU con cùng chạy. Chương này là bộ từ vựng và bộ máy của chuyện "nhiều con cùng chạy".</p>
<ul>
<li><strong>Cảnh báo đánh số, đọc trước đã.</strong> Cùng một khối kiến thức mà có tới ba con số gọi tên. Bộ slide (Stallings 11th ed, Global Edition) gọi là <strong>Chapter 20</strong>. Syllabus của trường theo bản 9th ed nên gọi là <strong>Chapter 17: Parallel Processing</strong>. Trang web này xếp thành <strong>Chương 15 — Parallel Processing &amp; Multicore</strong>. Cùng một nội dung, ba cái nhãn; đừng hoảng khi đề thi ghi 17.</li>
<li><strong>Chương có bốn đoạn.</strong> Slide 2–4: một <em>BẢNG PHÂN LOẠI</em> — bốn cái ô mà mọi máy song song từng được chế tạo đều rơi vào. Slide 5–11: <em>SMP</em>, máy đa xử lý đối xứng, và nó bắt hệ điều hành phải đổi những gì. Slide 12–27: <em>NHẤT QUÁN CACHE</em> và giao thức MESI — ổ điểm thi lớn nhất của cả chương. Slide 28–39: đa luồng, đa xử lý trên một chip, cụm máy (cluster) và NUMA.</li>
<li><strong>Bài này đi slide 1–20</strong>, đúng ba đoạn đầu, tới hết sơ đồ chuyển trạng thái MESI. Cluster, NUMA và đa luồng nằm ở nửa sau của deck.</li>
<li><strong>Vì sao có chương này — mối nối ngược về Ch.14.</strong> Chương 14 (superscalar, song song mức lệnh) kết thúc ở một bức tường: phần cứng có khôn tới đâu trong việc moi ra các lệnh độc lập bên trong <em>MỘT</em> luồng lệnh, thì số lệnh độc lập cũng cạn. Cộng thêm bức tường CÔNG SUẤT — công suất động tỉ lệ đại khái với tần số nhân bình phương điện áp, nên đẩy xung nhịp lên trở thành không kham nổi về nhiệt. Hai con đường đóng lại cùng lúc, quãng 2004. Cả ngành rẽ ngang: nhiều bộ xử lý hơn, chứ không phải nhanh hơn. Cú rẽ đó chính là thứ Chương 20 ghi lại.</li>
<li><strong>Điểm thi nằm ở đâu.</strong> Hai dạng câu, và cả hai đều máy móc một khi đã có bảng. (1) <em>Xếp loại cỗ máy này / bài toán này</em> vào SISD, SIMD, MISD hay MIMD. (2) <em>Cho một chuỗi đọc/ghi của nhiều bộ xử lý trên MỘT dòng cache, điền trạng thái MESI trong TỪNG cache sau TỪNG bước.</em> Bài này luyện cả hai, và dạng thứ hai có bảng do một chương trình mô phỏng THẬT sinh ra chứ không phải suy đoán bằng miệng.</li>
</ul>
<p class="meo">💡 Giữ một câu cho cả chương: <strong>song song thì dễ, DÙNG CHUNG mới khó.</strong> Cắm tám bộ xử lý lên một cái bus chỉ tốn một đoạn văn (slide 8). Bắt tám cái cache của chúng kể cùng một câu chuyện về một từ nhớ thì tốn hai chục slide còn lại.</p>`],

      [2, 'Multiple Processor Organization — SISD, SIMD, MISD, MIMD',
        `<p class="y-chinh">🎯 The four-box classification that the whole field uses, given here word for word. It sorts machines on two independent yes/no questions: <strong>is there one instruction stream or many?</strong> and <strong>is there one data stream or many?</strong> Two questions, two answers each, four boxes.</p>
<table>
<tr><th>Class</th><th>The slide's own definition</th><th>Machines that fit</th><th>A problem it suits</th></tr>
<tr><td><strong>SISD</strong> —single instruction, single data</td><td>A single processor executes a single instruction stream to operate on data stored in a single memory</td><td><strong>Uniprocessors</strong> — every machine in Ch.1 through Ch.19 of this course</td><td>Anything sequential: parsing text, walking a linked list, a single-threaded sort</td></tr>
<tr><td><strong>SIMD</strong> —single instruction, multiple data</td><td>A single machine instruction controls the simultaneous execution of a number of processing elements on a <em>lockstep</em> basis</td><td><strong>Vector and array processors</strong>; today: SSE/AVX on x86, NEON on ARM, and every GPU</td><td>Same operation on a big regular block: add two arrays, scale an image, a dense matrix multiply</td></tr>
<tr><td><strong>MISD</strong> —multiple instruction, single data</td><td>A sequence of data is transmitted to a set of processors, each of which executes a <em>different</em> instruction sequence</td><td><strong>Not commercially implemented</strong> — the slide says so outright</td><td>The usual stretch is redundant fault-tolerant computing (several different programs checking the same data stream); it is an argument, not a product</td></tr>
<tr><td><strong>MIMD</strong> —multiple instruction, multiple data</td><td>A set of processors simultaneously execute <em>different</em> instruction sequences on <em>different</em> data sets</td><td><strong>SMPs, clusters and NUMA systems</strong> — i.e. every multicore laptop, phone and server rack</td><td>Independent jobs: a web server handling many requests, a compiler building many files, a database serving many queries</td></tr>
</table>
<ul>
<li><strong>The word "lockstep" is the whole of SIMD.</strong> All the processing elements execute <em>the same instruction at the same moment</em>, each on its own piece of data. There is exactly one program counter for the whole array. That is why SIMD is cheap: you pay for many arithmetic units but only one instruction fetch/decode path. It is also why SIMD is rigid: if half the elements need to take the <code>if</code> branch and half the <code>else</code>, the hardware has to run both branches and mask out the results.</li>
<li><strong>MIMD's cost is the mirror image.</strong> Every processor has its own control unit and its own program counter, so it costs far more silicon per unit of arithmetic — but it can run genuinely different programs. You are paying for flexibility.</li>
<li><strong>MISD is the honest empty box.</strong> It exists in the taxonomy because the two questions have four combinations, not because anyone shipped one. Do not invent a product for it in an exam; write "not commercially implemented", which is the slide's exact phrasing.</li>
<li><strong>Connect to the real world you already own.</strong> Your laptop is all three live classes at once: MIMD across its cores, SIMD inside each core (the AVX or NEON unit), and SISD from the point of view of one thread of your C program. The taxonomy classifies a <em>level of description</em>, not a box.</li>
</ul>
<p class="pitfall">⚠️ The word <strong>"Flynn" does not appear anywhere on this deck.</strong> The slide calls it "Multiple Processor Organization" and the figure calls it "A Taxonomy of Parallel Processor Architectures". The name comes from Michael Flynn's 1966/1972 papers and from your textbook's prose — the exam will still call it Flynn's taxonomy, so learn both names for the same table.</p>`,
        `<p class="y-chinh">🎯 Bảng phân loại bốn ô mà cả ngành dùng, ở đây chép đúng từng chữ. Nó xếp máy theo HAI câu hỏi có/không độc lập nhau: <strong>có MỘT luồng lệnh hay NHIỀU?</strong> và <strong>có MỘT luồng dữ liệu hay NHIỀU?</strong> Hai câu hỏi, mỗi câu hai đáp án, ra bốn ô.</p>
<table>
<tr><th>Loại</th><th>Định nghĩa của chính slide</th><th>Máy thật rơi vào ô đó</th><th>Bài toán hợp với nó</th></tr>
<tr><td><strong>SISD</strong> —một lệnh, một dữ liệu</td><td>Một bộ xử lý chạy MỘT luồng lệnh để thao tác trên dữ liệu nằm trong MỘT bộ nhớ</td><td><strong>Máy đơn xử lý</strong> — toàn bộ máy trong Ch.1 đến Ch.19 của môn này</td><td>Mọi thứ tuần tự: phân tích văn bản, duyệt danh sách liên kết, một phép sắp xếp đơn luồng</td></tr>
<tr><td><strong>SIMD</strong> —một lệnh, nhiều dữ liệu</td><td>MỘT lệnh máy điều khiển việc thực thi ĐỒNG THỜI của một loạt phần tử xử lý theo kiểu <em>KHỚP NHỊP (lockstep)</em></td><td><strong>Bộ xử lý vector và bộ xử lý mảng</strong>; ngày nay: SSE/AVX trên x86, NEON trên ARM, và MỌI GPU</td><td>Cùng một phép trên một khối lớn đều đặn: cộng hai mảng, chỉnh sáng cả tấm ảnh, nhân ma trận dày</td></tr>
<tr><td><strong>MISD</strong> —nhiều lệnh, một dữ liệu</td><td>Một dòng dữ liệu được truyền tới một tập bộ xử lý, mỗi con chạy một chuỗi lệnh <em>KHÁC NHAU</em></td><td><strong>Chưa từng được chế tạo thương mại</strong> — slide nói thẳng như vậy</td><td>Cách kéo thường gặp là tính toán dự phòng chịu lỗi (vài chương trình khác nhau cùng kiểm một dòng dữ liệu); đó là một lập luận, không phải một sản phẩm</td></tr>
<tr><td><strong>MIMD</strong> —nhiều lệnh, nhiều dữ liệu</td><td>Một tập bộ xử lý đồng thời chạy những chuỗi lệnh <em>KHÁC NHAU</em> trên những tập dữ liệu <em>KHÁC NHAU</em></td><td><strong>SMP, cluster và hệ NUMA</strong> — tức mọi laptop đa lõi, mọi điện thoại, mọi tủ máy chủ</td><td>Các công việc độc lập: máy chủ web phục vụ nhiều yêu cầu, trình biên dịch dựng nhiều file, CSDL trả nhiều truy vấn</td></tr>
</table>
<ul>
<li><strong>Chữ "lockstep" (khớp nhịp) chính là toàn bộ SIMD.</strong> Mọi phần tử xử lý chạy <em>CÙNG MỘT LỆNH TẠI CÙNG MỘT THỜI ĐIỂM</em>, mỗi con trên mẩu dữ liệu của mình. Cả dàn chỉ có ĐÚNG MỘT thanh đếm chương trình. Đó là lý do SIMD rẻ: bạn trả tiền cho nhiều khối tính toán nhưng chỉ một đường nạp/giải mã lệnh. Đó cũng là lý do SIMD CỨNG: nếu một nửa số phần tử phải rẽ nhánh <code>if</code> và nửa kia rẽ <code>else</code>, phần cứng buộc phải chạy CẢ HAI nhánh rồi che kết quả thừa đi.</li>
<li><strong>Cái giá của MIMD là hình ảnh soi gương.</strong> Mỗi bộ xử lý có khối điều khiển riêng và thanh đếm chương trình riêng, nên tốn nhiều silicon hơn hẳn trên mỗi đơn vị tính toán — đổi lại nó chạy được những chương trình thật sự khác nhau. Bạn đang trả tiền cho sự LINH HOẠT.</li>
<li><strong>MISD là cái ô rỗng trung thực.</strong> Nó có mặt trong bảng vì hai câu hỏi cho bốn tổ hợp, chứ không phải vì ai đó từng bán được một cái. Đừng bịa ra sản phẩm cho nó trong bài thi; hãy viết "chưa từng được chế tạo thương mại", đúng chữ của slide.</li>
<li><strong>Nối vào đời thật bạn đang cầm trong tay.</strong> Cái laptop của bạn là cả ba loại còn sống cùng lúc: MIMD giữa các lõi, SIMD bên trong mỗi lõi (khối AVX hoặc NEON), và SISD nếu nhìn từ một luồng trong chương trình C của bạn. Bảng này phân loại một <em>MỨC MÔ TẢ</em>, không phân loại một cái thùng máy.</li>
</ul>
<p class="pitfall">⚠️ Chữ <strong>"Flynn" KHÔNG xuất hiện ở bất kỳ chỗ nào trong deck này.</strong> Slide gọi là "Multiple Processor Organization" còn hình gọi là "A Taxonomy of Parallel Processor Architectures". Cái tên đến từ bài báo của Michael Flynn (1966/1972) và từ phần văn xuôi trong giáo trình — nhưng đề thi vẫn sẽ gọi nó là "phân loại Flynn", nên phải thuộc CẢ HAI tên cho cùng một bảng.</p>`],

      [3, 'Figure 20.1 — A Taxonomy of Parallel Processor Architectures',
        `<p class="y-chinh">🎯 The same four classes, redrawn as a tree so you can see what hangs <em>below</em> each one. The tree is the exam answer to "where does an SMP sit in the classification?" — you trace the path, you do not memorise a sentence.</p>
<table>
<tr><th>Level</th><th>What the figure draws</th></tr>
<tr><td>Root</td><td><strong>Processor Organizations</strong></td></tr>
<tr><td>Level 1 — four branches</td><td>Single Instruction, Single Data Stream (SISD) · Single Instruction, Multiple Data Stream (SIMD) · Multiple Instruction, Single Data Stream (MISD) · Multiple Instruction, Multiple Data Stream (MIMD)</td></tr>
<tr><td>Under SISD</td><td><strong>Uniprocessor</strong> — one leaf, nothing more</td></tr>
<tr><td>Under SIMD</td><td><strong>Vector Processor</strong> · <strong>Array Processor</strong></td></tr>
<tr><td>Under MISD</td><td><strong>nothing at all</strong> — the branch stops dead</td></tr>
<tr><td>Under MIMD</td><td><strong>Shared Memory (tightly coupled)</strong> and <strong>Distributed Memory (loosely coupled)</strong></td></tr>
<tr><td>Under Shared Memory</td><td><strong>Symmetric Multiprocessor (SMP)</strong> · <strong>Nonuniform Memory Access (NUMA)</strong></td></tr>
<tr><td>Under Distributed Memory</td><td><strong>Clusters</strong></td></tr>
</table>
<ul>
<li><strong>The empty MISD branch is the most eloquent thing on the slide.</strong> Every other branch grows leaves; MISD is drawn and then abandoned. Read it as the figure's own footnote to "not commercially implemented".</li>
<li><strong>The MIMD split is the split that matters commercially.</strong> "Tightly coupled" means the processors share one physical memory and talk by <em>writing to it</em>; "loosely coupled" means each has its own memory and they talk by <em>sending messages</em>. Everything difficult in the rest of this chapter — coherence, MESI, snooping — lives on the tightly coupled side. The loosely coupled side trades that difficulty for network latency instead.</li>
<li><strong>Vector versus array processor.</strong> A <em>vector</em> processor pipelines one operation deeply over a long stream of elements (one ALU, many elements flowing through). An <em>array</em> processor replicates the ALU many times and fires them in parallel (many ALUs, one element each). Both are SIMD; they differ in whether the parallelism is in time or in space.</li>
<li><strong>SIMD is not a museum piece — it is the instruction set you already use.</strong> Every <code>float</code> loop your compiler vectorises becomes SSE/AVX instructions on x86 or NEON on ARM: one instruction, 4/8/16 lanes of data. A GPU is the array processor branch grown to thousands of lanes. When a data-science library says "vectorised", this box of the taxonomy is what it means.</li>
</ul>
<p class="pitfall">⚠️ The original figure <strong>misspells NUMA as "Nonumiform Memory Access"</strong> (it should be "Nonun<em>i</em>form", and slide 36 of this very deck spells it correctly). This was confirmed by zooming into the rendered slide — it is a genuine typo in the Pearson artwork, not a reading error. Write "Nonuniform Memory Access" in your exam.</p>
<p class="meo">💡 Trace the path out loud and the classification questions answer themselves: <em>SMP → shared memory → MIMD</em>. <em>Cluster → distributed memory → MIMD</em>. <em>GPU → SIMD</em>. <em>Your old single-core Pentium → SISD</em>.</p>`,
        `<p class="y-chinh">🎯 Vẫn bốn loại đó, nhưng vẽ lại thành CÂY để thấy cái gì treo <em>BÊN DƯỚI</em> mỗi loại. Cái cây chính là đáp án thi cho câu "SMP nằm ở đâu trong bảng phân loại?" — bạn LẦN THEO ĐƯỜNG, chứ không thuộc lòng một câu văn.</p>
<table>
<tr><th>Tầng</th><th>Hình vẽ gì</th></tr>
<tr><td>Gốc</td><td><strong>Processor Organizations</strong> (các cách tổ chức bộ xử lý)</td></tr>
<tr><td>Tầng 1 — bốn nhánh</td><td>Single Instruction, Single Data Stream (SISD) · Single Instruction, Multiple Data Stream (SIMD) · Multiple Instruction, Single Data Stream (MISD) · Multiple Instruction, Multiple Data Stream (MIMD)</td></tr>
<tr><td>Dưới SISD</td><td><strong>Uniprocessor</strong> (đơn xử lý) — đúng một lá, hết</td></tr>
<tr><td>Dưới SIMD</td><td><strong>Vector Processor</strong> · <strong>Array Processor</strong></td></tr>
<tr><td>Dưới MISD</td><td><strong>KHÔNG CÓ GÌ</strong> — nhánh đứt ngang</td></tr>
<tr><td>Dưới MIMD</td><td><strong>Shared Memory (tightly coupled)</strong> — bộ nhớ dùng chung, ghép chặt; và <strong>Distributed Memory (loosely coupled)</strong> — bộ nhớ phân tán, ghép lỏng</td></tr>
<tr><td>Dưới Shared Memory</td><td><strong>Symmetric Multiprocessor (SMP)</strong> · <strong>Nonuniform Memory Access (NUMA)</strong></td></tr>
<tr><td>Dưới Distributed Memory</td><td><strong>Clusters</strong> (cụm máy)</td></tr>
</table>
<ul>
<li><strong>Cái nhánh MISD trống rỗng mới là thứ hùng hồn nhất trên slide.</strong> Mọi nhánh khác đều mọc lá; riêng MISD được vẽ ra rồi bỏ đó. Hãy đọc nó như chú thích của chính bức hình cho câu "chưa từng được chế tạo thương mại".</li>
<li><strong>Cú chẻ đôi của MIMD mới là cú chẻ có ý nghĩa thương mại.</strong> "Ghép chặt" nghĩa là các bộ xử lý dùng CHUNG một bộ nhớ vật lý và nói chuyện bằng cách <em>GHI VÀO ĐÓ</em>; "ghép lỏng" nghĩa là mỗi con có bộ nhớ riêng và nói chuyện bằng cách <em>GỬI THÔNG ĐIỆP</em>. Mọi thứ khó nhằn trong phần còn lại của chương — nhất quán, MESI, nghe lén bus — đều sống ở phía GHÉP CHẶT. Phía ghép lỏng đổi cái khó đó lấy độ trễ mạng.</li>
<li><strong>Vector khác array chỗ nào.</strong> Bộ xử lý <em>vector</em> dựng ống sâu cho MỘT phép trên một dòng dài phần tử (một ALU, nhiều phần tử chảy qua). Bộ xử lý <em>array</em> nhân bản ALU ra nhiều bản và bắn cùng lúc (nhiều ALU, mỗi con một phần tử). Cả hai đều là SIMD; chúng khác nhau ở chỗ song song nằm trong THỜI GIAN hay trong KHÔNG GIAN.</li>
<li><strong>SIMD không phải đồ cổ trong bảo tàng — nó là tập lệnh bạn đang dùng hằng ngày.</strong> Mỗi vòng lặp <code>float</code> mà trình biên dịch vector hoá đều biến thành lệnh SSE/AVX trên x86 hoặc NEON trên ARM: MỘT lệnh, 4/8/16 làn dữ liệu. GPU chính là nhánh array processor phình ra hàng nghìn làn. Khi một thư viện khoa học dữ liệu khoe "đã vector hoá", nó đang nói về đúng cái ô này trong bảng.</li>
</ul>
<p class="pitfall">⚠️ Bức hình gốc <strong>VIẾT SAI CHÍNH TẢ NUMA thành "Nonumiform Memory Access"</strong> (đúng phải là "Nonun<em>i</em>form", và chính slide 36 của deck này viết đúng). Đã phóng to ảnh render để xác nhận — đây là lỗi chính tả thật trong bản vẽ của Pearson, không phải đọc nhầm. Vào phòng thi bạn viết "Nonuniform Memory Access".</p>
<p class="meo">💡 Lần theo đường và đọc thành tiếng thì các câu hỏi phân loại tự trả lời: <em>SMP → bộ nhớ chung → MIMD</em>. <em>Cluster → bộ nhớ phân tán → MIMD</em>. <em>GPU → SIMD</em>. <em>Con Pentium một lõi cũ → SISD</em>.</p>`],

      [4, 'Figure 20.2 — Alternative Computer Organizations (SISD, SIMD, MIMD block diagrams)',
        `<p class="y-chinh">🎯 The taxonomy turned into wiring. Four little block diagrams, and the whole point is <strong>where the control units are</strong> — count the CUs and you have classified the machine.</p>
<table>
<tr><th>Panel</th><th>What is drawn</th><th>Read it as</th></tr>
<tr><td><strong>(a) SISD</strong></td><td>CU —IS→ PU ←DS→ MU</td><td>One control unit, one processing unit, one memory unit. One of everything.</td></tr>
<tr><td><strong>(b) SIMD</strong> (with distributed memory)</td><td>ONE CU fans its IS out to PU<sub>1</sub>…PU<sub>n</sub>, each PU ←DS→ its own LM<sub>1</sub>…LM<sub>n</sub></td><td><strong>One instruction stream, n data streams.</strong> The single CU is the visual definition of lockstep.</td></tr>
<tr><td><strong>(c) MIMD</strong> (with shared memory)</td><td>CU<sub>1</sub>…CU<sub>n</sub>, each —IS→ its own PU<sub>i</sub>, and every PU ←DS→ one tall <strong>Shared Memory</strong> block</td><td>n instruction streams, n data streams, <strong>one</strong> memory. This is the SMP of slide 8.</td></tr>
<tr><td><strong>(d) MIMD</strong> (with distributed memory)</td><td>CU<sub>i</sub> —IS→ PU<sub>i</sub> ←DS→ LM<sub>i</sub>, and every LM hangs off an <strong>Interconnection Network</strong></td><td>n of everything, joined by a network. This is the cluster / distributed-memory side.</td></tr>
</table>
<ul>
<li><strong>The legend, printed on the slide, is worth memorising.</strong> CU = control unit · IS = instruction stream · PU = processing unit · DS = data stream · MU = memory unit · LM = local memory. Exam diagrams are drawn with exactly these letters.</li>
<li><strong>Count control units — that is the trick.</strong> One CU feeding many PUs ⇒ SIMD. Many CUs ⇒ MIMD. The data side (one MU versus many LMs) is a <em>second</em>, independent question that separates shared memory from distributed memory, not SIMD from MIMD.</li>
<li><strong>Panel (c) versus panel (d) is the fork the rest of the chapter walks down.</strong> In (c) two processors communicate by one writing a variable and the other reading it — free, instantaneous, and the reason cache coherence exists. In (d) they must package a message and push it across the network — explicit, slow, and coherence never arises because nothing is shared.</li>
<li><strong>Notice what (b) implies about memory.</strong> The SIMD panel is labelled "with distributed memory": each processing element has its own local memory holding its own slice of the array. That is exactly how a GPU is built — thousands of lanes, each with its private registers and a slice of device memory, all driven by one instruction stream.</li>
</ul>
<p class="pitfall">⚠️ The extracted text of this slide reads "Figure 20.2Alternative Computer Organizations" with the space missing. That is a line-break artefact of the .pptx file, not the real figure name — the figure is "Figure 20.2 Alternative Computer Organizations". The same glitch affects slides 6, 7, 8 and 20.</p>`,
        `<p class="y-chinh">🎯 Bảng phân loại biến thành SƠ ĐỒ DÂY. Bốn sơ đồ khối nhỏ, và toàn bộ ý nghĩa nằm ở chỗ <strong>KHỐI ĐIỀU KHIỂN nằm ở đâu</strong> — đếm số CU là xếp loại được cỗ máy.</p>
<table>
<tr><th>Ô</th><th>Vẽ gì</th><th>Đọc thành</th></tr>
<tr><td><strong>(a) SISD</strong></td><td>CU —IS→ PU ←DS→ MU</td><td>Một khối điều khiển, một khối xử lý, một khối nhớ. Cái gì cũng đúng một cái.</td></tr>
<tr><td><strong>(b) SIMD</strong> (bộ nhớ phân tán)</td><td>MỘT CU toả IS ra PU<sub>1</sub>…PU<sub>n</sub>, mỗi PU ←DS→ bộ nhớ cục bộ riêng LM<sub>1</sub>…LM<sub>n</sub></td><td><strong>Một luồng lệnh, n luồng dữ liệu.</strong> Cái CU duy nhất chính là định nghĩa bằng HÌNH của chữ "khớp nhịp".</td></tr>
<tr><td><strong>(c) MIMD</strong> (bộ nhớ dùng chung)</td><td>CU<sub>1</sub>…CU<sub>n</sub>, mỗi con —IS→ PU<sub>i</sub> của mình, và mọi PU ←DS→ MỘT khối <strong>Shared Memory</strong> cao</td><td>n luồng lệnh, n luồng dữ liệu, <strong>MỘT</strong> bộ nhớ. Đây chính là SMP ở slide 8.</td></tr>
<tr><td><strong>(d) MIMD</strong> (bộ nhớ phân tán)</td><td>CU<sub>i</sub> —IS→ PU<sub>i</sub> ←DS→ LM<sub>i</sub>, và mọi LM đều móc vào một <strong>Interconnection Network</strong></td><td>Cái gì cũng n cái, nối với nhau bằng MẠNG. Đây là phía cluster / bộ nhớ phân tán.</td></tr>
</table>
<ul>
<li><strong>Phần chú giải in ngay trên slide, đáng thuộc.</strong> CU = control unit (khối điều khiển) · IS = instruction stream (luồng lệnh) · PU = processing unit (khối xử lý) · DS = data stream (luồng dữ liệu) · MU = memory unit (khối nhớ) · LM = local memory (bộ nhớ cục bộ). Hình trong đề thi vẽ đúng bằng bấy nhiêu chữ cái đó.</li>
<li><strong>ĐẾM KHỐI ĐIỀU KHIỂN — đó là mẹo.</strong> Một CU nuôi nhiều PU ⇒ SIMD. Nhiều CU ⇒ MIMD. Phía dữ liệu (một MU hay nhiều LM) là một câu hỏi <em>THỨ HAI</em> độc lập, nó tách bộ nhớ chung khỏi bộ nhớ phân tán, chứ không tách SIMD khỏi MIMD.</li>
<li><strong>Ô (c) so với ô (d) chính là ngã ba mà phần còn lại của chương đi vào.</strong> Ở (c), hai bộ xử lý nói chuyện bằng cách con này ghi một biến, con kia đọc nó — miễn phí, tức thì, và đó là lý do nhất quán cache tồn tại. Ở (d), chúng phải đóng gói một thông điệp và đẩy qua mạng — tường minh, chậm, và chuyện nhất quán không bao giờ phát sinh vì chẳng có gì dùng chung.</li>
<li><strong>Để ý ô (b) ngụ ý gì về bộ nhớ.</strong> Ô SIMD được ghi rõ "with distributed memory": mỗi phần tử xử lý có bộ nhớ cục bộ riêng giữ lát cắt mảng của chính nó. GPU được dựng đúng như vậy — hàng nghìn làn, mỗi làn có thanh ghi riêng và một lát bộ nhớ thiết bị, tất cả bị một luồng lệnh duy nhất điều khiển.</li>
</ul>
<p class="pitfall">⚠️ Bản trích chữ của slide này ra "Figure 20.2Alternative Computer Organizations", MẤT dấu cách. Đó là lỗi xuống dòng của file .pptx, không phải tên hình thật — tên đúng là "Figure 20.2 Alternative Computer Organizations". Lỗi y hệt xảy ra ở slide 6, 7, 8 và 20.</p>`],

      [5, 'Symmetric Multiprocessor (SMP) — the five defining characteristics',
        `<p class="y-chinh">🎯 The definition, laid out on the slide as one banner plus five columns: an SMP is <strong>a stand alone computer with the following characteristics</strong>. Learn the five as a checklist — exam questions are usually "which of these is NOT true of an SMP?".</p>
<table>
<tr><th>#</th><th>Characteristic (slide's wording)</th><th>The sub-points the slide adds</th></tr>
<tr><td>1</td><td><strong>Two or more similar processors of comparable capacity</strong></td><td>—</td></tr>
<tr><td>2</td><td><strong>Processors share same memory and I/O facilities</strong></td><td>Processors are connected by a bus or other internal connection; <strong>memory access time is approximately the same for each processor</strong></td></tr>
<tr><td>3</td><td><strong>All processors share access to I/O devices</strong></td><td>Either through the same channels or different channels giving paths to the same devices</td></tr>
<tr><td>4</td><td><strong>All processors can perform the same functions</strong> (hence "symmetric")</td><td>—</td></tr>
<tr><td>5</td><td><strong>System controlled by an integrated operating system</strong></td><td>Provides interaction between processors and their programs at job, task, file and data element levels</td></tr>
</table>
<ul>
<li><strong>"Symmetric" is characteristic 4, and it is the name of the whole thing.</strong> There is no master processor and no slave processors; any processor can run the OS kernel, handle an interrupt, or run a user thread. The asymmetric alternative — one boss CPU that owns the kernel and the devices — was tried, and it made the boss the bottleneck.</li>
<li><strong>"Approximately the same access time" is the sentence that defines the whole class.</strong> It is what makes SMP a <em>uniform</em> memory access machine, and it is exactly the property NUMA (slide 36) gives up in exchange for scale. If a question shows a machine where processor 1 reaches bank A in 60 ns and bank B in 140 ns, it is not an SMP.</li>
<li><strong>"Stand alone computer" quietly rules out a cluster.</strong> One box, one operating system image, one memory. A cluster is <em>several</em> stand-alone computers pretending to be one (slide 33) — the opposite construction.</li>
<li><strong>Why the OS must be "integrated" (characteristic 5).</strong> One kernel scheduling all the processors, one file system, one view of memory. Slide 11 spells out the five things that kernel has to get right; the short version is that every kernel data structure is now touched by several processors at once.</li>
<li><strong>Where you own one.</strong> Every multicore phone and laptop is an SMP in the sense of this slide — the "processors" are cores on one die rather than separate chips, which is Chapter 21's subject (multicore), but the five characteristics hold unchanged.</li>
</ul>
<p class="meo">💡 Five words to recall the five points: <strong>similar · shared memory · shared I/O · same functions · one OS</strong>.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa, được slide bày thành một băng lớn cộng năm cột: SMP là <strong>một máy tính ĐỘC LẬP có những đặc điểm sau</strong>. Học năm điểm này như một danh sách kiểm — đề thi thường hỏi "điều nào sau đây KHÔNG đúng với SMP?".</p>
<table>
<tr><th>#</th><th>Đặc điểm (đúng chữ slide)</th><th>Ý phụ slide ghi thêm</th></tr>
<tr><td>1</td><td><strong>Hai hoặc nhiều bộ xử lý TƯƠNG TỰ nhau, năng lực TƯƠNG ĐƯƠNG nhau</strong></td><td>—</td></tr>
<tr><td>2</td><td><strong>Các bộ xử lý dùng CHUNG bộ nhớ và phương tiện vào/ra</strong></td><td>Chúng nối với nhau bằng bus hoặc kết nối nội bộ khác; <strong>thời gian truy cập bộ nhớ XẤP XỈ NHƯ NHAU với mọi bộ xử lý</strong></td></tr>
<tr><td>3</td><td><strong>Mọi bộ xử lý đều truy cập chung các thiết bị vào/ra</strong></td><td>Qua cùng kênh, hoặc qua các kênh khác nhau nhưng dẫn tới cùng thiết bị</td></tr>
<tr><td>4</td><td><strong>Mọi bộ xử lý làm được cùng những chức năng</strong> (vì thế mới gọi là "đối xứng")</td><td>—</td></tr>
<tr><td>5</td><td><strong>Hệ thống do MỘT hệ điều hành tích hợp điều khiển</strong></td><td>Cung cấp tương tác giữa các bộ xử lý và chương trình của chúng ở mức job, task, file và phần tử dữ liệu</td></tr>
</table>
<ul>
<li><strong>"Đối xứng" là đặc điểm số 4, và nó là cái tên của cả kiến trúc.</strong> Không có bộ xử lý chủ, không có bộ xử lý tớ; con nào cũng chạy được nhân hệ điều hành, xử lý được ngắt, chạy được luồng người dùng. Phương án BẤT ĐỐI XỨNG — một CPU sếp nắm nhân và nắm thiết bị — từng được thử, và nó biến ông sếp thành nút thắt cổ chai.</li>
<li><strong>Câu "thời gian truy cập xấp xỉ như nhau" mới là câu định nghĩa cả lớp máy này.</strong> Chính nó làm SMP thành máy truy cập bộ nhớ ĐỀU (uniform), và cũng chính nó là thứ NUMA (slide 36) chịu vứt bỏ để đổi lấy quy mô. Nếu đề vẽ một cỗ máy mà bộ xử lý 1 với tới bank A mất 60 ns còn bank B mất 140 ns thì đó KHÔNG phải SMP.</li>
<li><strong>Chữ "máy tính độc lập" lặng lẽ loại cluster ra.</strong> Một thùng máy, một bản hệ điều hành, một bộ nhớ. Còn cluster là <em>NHIỀU</em> máy tính độc lập giả vờ làm một (slide 33) — cấu tạo ngược hẳn.</li>
<li><strong>Vì sao hệ điều hành phải "tích hợp" (đặc điểm 5).</strong> Một nhân lập lịch cho tất cả bộ xử lý, một hệ thống tệp, một cái nhìn về bộ nhớ. Slide 11 kể ra năm thứ mà cái nhân đó phải làm cho đúng; nói gọn thì mọi cấu trúc dữ liệu của nhân bây giờ đều bị nhiều bộ xử lý đụng vào cùng lúc.</li>
<li><strong>Bạn đang sở hữu một cái ở đâu.</strong> Mọi điện thoại và laptop đa lõi đều là SMP theo nghĩa của slide này — "bộ xử lý" ở đây là các LÕI trên cùng một miếng silicon chứ không phải các con chip rời, đó là đề tài của Chương 21 (đa lõi), nhưng năm đặc điểm trên vẫn đúng nguyên.</li>
</ul>
<p class="meo">💡 Năm chữ để nhớ năm ý: <strong>giống nhau · chung bộ nhớ · chung vào/ra · cùng chức năng · một hệ điều hành</strong>.</p>`],

      [6, 'Figure 20.3 — Multiprogramming and Multiprocessing',
        `<p class="y-chinh">🎯 The one picture that separates <strong>looking parallel</strong> from <strong>being parallel</strong>. Two timelines of the same three processes, one on a uniprocessor and one on a two-processor machine — and the difference is whether two green bars ever line up vertically.</p>
<table>
<tr><th></th><th>(a) Interleaving — multiprogramming, ONE processor</th><th>(b) Interleaving and overlapping — multiprocessing, TWO processors</th></tr>
<tr><td><strong>What the bars show</strong></td><td>Process 1, 2, 3 each alternate <em>Blocked</em> (dark) and <em>Running</em> (light) segments</td><td>The same three processes, same legend, but the light segments now overlap in time</td></tr>
<tr><td><strong>Vertical reading</strong></td><td>At any instant <strong>at most one</strong> process is Running — the others are Blocked</td><td>At many instants <strong>two</strong> processes are Running at the same moment</td></tr>
<tr><td><strong>Total elapsed time</strong></td><td>Longer — all three timelines stretch further right</td><td>Shorter — every process finishes earlier, process 3 finishes far earlier</td></tr>
<tr><td><strong>The illusion</strong></td><td>Concurrency (they <em>appear</em> simultaneous to a human)</td><td>True parallelism (they <em>are</em> simultaneous)</td></tr>
</table>
<ul>
<li><strong>Interleaving versus overlapping is the exact vocabulary to use.</strong> The figure's own captions give you the two words: panel (a) is "interleaving", panel (b) is "interleaving <em>and</em> overlapping". Multiprogramming interleaves; multiprocessing also overlaps. An exam answer that says "multiprogramming runs programs at the same time" has lost the mark on that one word.</li>
<li><strong>Why the dark "Blocked" segments exist at all.</strong> A process blocks waiting for I/O — a disk read, a network packet, a key press. That is the gap multiprogramming was invented to fill: while process 1 waits for its disk, put process 2 on the CPU. Chapter 9 (OS support) is where this was built.</li>
<li><strong>Read panel (b) as the payoff of this whole chapter.</strong> Adding the second processor did not make any single process faster — the individual light segments are the same length. It made the <em>set</em> of them finish sooner, because they stopped queueing for one CPU. Throughput improved, latency of one job did not.</li>
<li><strong>That last point is the seed of Amdahl's law (slide 9).</strong> Parallelism helps only the part of the work that can actually proceed simultaneously. Whatever in your workload must be done one-at-a-time keeps its original duration no matter how many processors you add.</li>
</ul>
<p class="meo">💡 One-line test for any exam scenario: <strong>draw a vertical line anywhere on the timeline and count how many bars are "Running" where it crosses.</strong> Always one ⇒ multiprogramming. Sometimes two or more ⇒ multiprocessing.</p>`,
        `<p class="y-chinh">🎯 Bức hình duy nhất tách bạch giữa <strong>TRÔNG NHƯ song song</strong> và <strong>SONG SONG THẬT</strong>. Hai trục thời gian của cùng ba tiến trình, một trên máy đơn xử lý và một trên máy hai bộ xử lý — và khác biệt nằm ở chỗ có bao giờ hai vạch xanh thẳng hàng theo chiều dọc hay không.</p>
<table>
<tr><th></th><th>(a) Interleaving — đa chương trình, MỘT bộ xử lý</th><th>(b) Interleaving and overlapping — đa xử lý, HAI bộ xử lý</th></tr>
<tr><td><strong>Các vạch thể hiện gì</strong></td><td>Process 1, 2, 3 mỗi con xen kẽ đoạn <em>Blocked</em> (xám đậm) và <em>Running</em> (xanh nhạt)</td><td>Vẫn ba tiến trình đó, vẫn chú giải đó, nhưng các đoạn xanh nay CHỒNG LÊN NHAU theo thời gian</td></tr>
<tr><td><strong>Đọc theo chiều DỌC</strong></td><td>Tại mọi thời điểm <strong>nhiều nhất MỘT</strong> tiến trình đang Running — số còn lại đang Blocked</td><td>Tại nhiều thời điểm có <strong>HAI</strong> tiến trình cùng Running một lúc</td></tr>
<tr><td><strong>Tổng thời gian trôi qua</strong></td><td>Dài hơn — cả ba trục đều kéo xa hơn về bên phải</td><td>Ngắn hơn — tiến trình nào cũng xong sớm hơn, riêng Process 3 xong sớm hẳn</td></tr>
<tr><td><strong>Cái ảo giác</strong></td><td>Đồng thời hình thức (con người <em>THẤY</em> như chúng chạy cùng lúc)</td><td>Song song thật (chúng <em>ĐANG</em> chạy cùng lúc)</td></tr>
</table>
<ul>
<li><strong>Xen kẽ (interleaving) khác chồng lấn (overlapping) — dùng đúng hai chữ này.</strong> Chú thích của chính bức hình cho bạn hai từ đó: ô (a) là "interleaving", ô (b) là "interleaving <em>VÀ</em> overlapping". Đa chương trình chỉ XEN KẼ; đa xử lý còn CHỒNG LẤN. Bài thi nào viết "đa chương trình chạy các chương trình cùng một lúc" là mất điểm đúng ở một chữ đó.</li>
<li><strong>Vì sao có những đoạn "Blocked" màu đậm.</strong> Tiến trình bị chặn khi chờ vào/ra — đọc đĩa, chờ gói mạng, chờ gõ phím. Đó chính là cái khe mà đa chương trình sinh ra để lấp: trong lúc tiến trình 1 chờ đĩa thì đẩy tiến trình 2 lên CPU. Chương 9 (hỗ trợ của hệ điều hành) là nơi dựng chuyện này.</li>
<li><strong>Đọc ô (b) như phần thưởng của cả chương này.</strong> Thêm bộ xử lý thứ hai KHÔNG làm tiến trình nào chạy nhanh hơn — từng đoạn xanh vẫn dài y như cũ. Nó làm CẢ TẬP tiến trình xong sớm hơn, vì chúng thôi phải xếp hàng chờ một CPU. Thông lượng tăng; độ trễ của một công việc thì không.</li>
<li><strong>Ý cuối đó chính là hạt giống của định luật Amdahl (slide 9).</strong> Song song chỉ giúp được phần công việc thật sự tiến hành đồng thời được. Phần nào trong khối lượng việc buộc phải làm lần lượt thì vẫn giữ nguyên thời lượng cũ, thêm bao nhiêu bộ xử lý cũng vậy.</li>
</ul>
<p class="meo">💡 Phép thử một dòng cho mọi tình huống đề ra: <strong>kẻ một đường thẳng đứng bất kỳ trên trục thời gian rồi đếm xem chỗ nó cắt có mấy vạch đang "Running".</strong> Luôn luôn một ⇒ đa chương trình. Có lúc hai trở lên ⇒ đa xử lý.</p>`],

      [7, 'Figure 20.4 — Generic Block Diagram of a Tightly Coupled Multiprocessor',
        `<p class="y-chinh">🎯 The abstract skeleton of every shared-memory machine, before you commit to how the middle is built: <strong>n processors on top, an Interconnection Network in the middle, Main Memory below, I/O modules on the side.</strong> Everything in the rest of this chapter is an argument about that middle box.</p>
<table>
<tr><th>Element in the figure</th><th>Wiring drawn</th><th>What it means</th></tr>
<tr><td><strong>Processor · Processor · … · Processor</strong> (top row)</td><td>Each has a <em>double-headed</em> arrow down into the network</td><td>Every processor is a peer; each can both issue requests and receive them (snooping, slide 15)</td></tr>
<tr><td><strong>Interconnection Network</strong> (the big central block)</td><td>The only path between processors, memory and I/O</td><td>Deliberately unspecified: it could be a single shared bus (slide 8), a crossbar, or a mesh. This is the design choice.</td></tr>
<tr><td><strong>Main Memory</strong> (bottom bar)</td><td>Four double-headed arrows up into the network</td><td>ONE memory, reachable by all — the "tightly coupled" in the title. Multiple arrows hint at interleaved banks for bandwidth.</td></tr>
<tr><td><strong>I/O · I/O · … · I/O</strong> (right side)</td><td>Double-headed arrows into the right face of the network</td><td>SMP characteristic 3 from slide 5: all processors share access to all I/O</td></tr>
</table>
<ul>
<li><strong>"Tightly coupled" is defined by this picture, not by a sentence.</strong> Processors that share <em>one main memory block</em> are tightly coupled. Take that block away, give each processor its own, and you have the loosely coupled machine of Figure 20.2(d) — a cluster.</li>
<li><strong>Every arrow is double-headed, and that is not decoration.</strong> Traffic goes both ways on every link: a processor issues a read, but it also has to <em>listen</em> to what other processors are doing to lines it holds. That listening is the whole snoopy-protocol idea of slide 15.</li>
<li><strong>Notice what is NOT drawn: caches.</strong> This is the generic, honest picture, and it has no coherence problem at all — with no caches there is exactly one copy of every word, in main memory. Slide 8 adds the caches and creates the problem the rest of the chapter solves. Read the two figures as a before-and-after pair.</li>
<li><strong>Connect to Chapter 3.</strong> You met the single system bus there (processor, memory, I/O all on one set of lines) and its arbitration problem with <em>one</em> master. This figure is that same structure with <em>n</em> masters, which is why bus arbitration stops being a footnote and becomes the performance ceiling on slide 10.</li>
</ul>
<p class="meo">💡 Keep this as the chapter's blank template. SMP = fill the middle with a shared bus. NUMA = fill it with a network and split main memory across the nodes. Cluster = delete the middle entirely and put a LAN between whole computers.</p>`,
        `<p class="y-chinh">🎯 Bộ xương trừu tượng của mọi máy dùng chung bộ nhớ, vẽ ra TRƯỚC khi chốt cách dựng phần giữa: <strong>n bộ xử lý ở trên, một Interconnection Network ở giữa, Main Memory ở dưới, các khối I/O ở bên cạnh.</strong> Mọi thứ còn lại của chương là một cuộc tranh luận về đúng cái hộp ở giữa đó.</p>
<table>
<tr><th>Thành phần trên hình</th><th>Dây vẽ ra sao</th><th>Nghĩa là gì</th></tr>
<tr><td><strong>Processor · Processor · … · Processor</strong> (hàng trên)</td><td>Mỗi con có một mũi tên <em>HAI ĐẦU</em> cắm xuống mạng</td><td>Mọi bộ xử lý đều ngang vai; con nào cũng vừa phát yêu cầu vừa nhận yêu cầu (nghe lén bus, slide 15)</td></tr>
<tr><td><strong>Interconnection Network</strong> (khối lớn ở giữa)</td><td>Con đường DUY NHẤT giữa bộ xử lý, bộ nhớ và vào/ra</td><td>Cố ý để mơ hồ: nó có thể là một bus dùng chung (slide 8), một crossbar, hay một lưới. Đây chính là chỗ phải chọn thiết kế.</td></tr>
<tr><td><strong>Main Memory</strong> (thanh dưới cùng)</td><td>Bốn mũi tên hai đầu chĩa lên mạng</td><td>MỘT bộ nhớ, ai cũng với tới — đúng chữ "ghép chặt" trong tiêu đề. Nhiều mũi tên ngụ ý bộ nhớ xen kẽ nhiều bank để tăng băng thông.</td></tr>
<tr><td><strong>I/O · I/O · … · I/O</strong> (cạnh phải)</td><td>Mũi tên hai đầu cắm vào mặt phải của mạng</td><td>Đúng đặc điểm SMP số 3 ở slide 5: mọi bộ xử lý đều dùng chung mọi thiết bị vào/ra</td></tr>
</table>
<ul>
<li><strong>"Ghép chặt" được định nghĩa bằng chính bức hình này, không phải bằng một câu văn.</strong> Những bộ xử lý dùng chung <em>MỘT khối bộ nhớ chính</em> thì gọi là ghép chặt. Bỏ khối đó đi, phát cho mỗi con một bộ nhớ riêng, là ra cỗ máy ghép lỏng của Figure 20.2(d) — một cluster.</li>
<li><strong>Mọi mũi tên đều hai đầu, và đó không phải trang trí.</strong> Dòng chảy đi cả hai chiều trên mọi đường: bộ xử lý phát ra một lệnh đọc, nhưng nó cũng phải <em>LẮNG NGHE</em> xem các bộ xử lý khác đang làm gì với những dòng mà nó đang giữ. Cái nghe đó chính là toàn bộ ý tưởng giao thức snoopy ở slide 15.</li>
<li><strong>Để ý thứ KHÔNG được vẽ: các cache.</strong> Đây là bức tranh tổng quát và trung thực, và nó CHƯA hề có vấn đề nhất quán nào — không cache thì mỗi từ nhớ có đúng MỘT bản, nằm ở bộ nhớ chính. Slide 8 mới thêm cache vào và đẻ ra cái vấn đề mà phần còn lại của chương đi giải. Hãy đọc hai bức hình như một cặp "trước và sau".</li>
<li><strong>Nối sang Chương 3.</strong> Ở đó bạn đã gặp bus hệ thống đơn (bộ xử lý, bộ nhớ, vào/ra cùng nằm trên một bộ đường dây) và bài toán trọng tài bus với <em>MỘT</em> chủ. Bức hình này là đúng cấu trúc ấy nhưng có <em>n</em> chủ, nên trọng tài bus thôi làm chú thích chân trang mà trở thành trần hiệu năng ở slide 10.</li>
</ul>
<p class="meo">💡 Giữ hình này làm khuôn trống của cả chương. SMP = lấp phần giữa bằng một bus dùng chung. NUMA = lấp bằng một mạng và chẻ bộ nhớ chính ra các nút. Cluster = xoá hẳn phần giữa và đặt một mạng LAN giữa các máy tính nguyên vẹn.</p>`],

      [8, 'Figure 20.5 — Symmetric Multiprocessor Organization',
        `<p class="y-chinh">🎯 The generic skeleton of slide 7 with the middle box filled in by the simplest thing possible — <strong>one shared bus</strong> — and, crucially, with <strong>caches added to every processor</strong>. This single picture creates the cache coherence problem and then spends the rest of the chapter apologising for it.</p>
<table>
<tr><th>Layer in the figure</th><th>Exactly what is drawn</th></tr>
<tr><td>Top</td><td><strong>Processor</strong> · <strong>Processor</strong> · … · <strong>Processor</strong>, and each processor box contains an <strong>L1 Cache</strong> inside it</td></tr>
<tr><td>Next</td><td>Below each processor, a separate <strong>L2 Cache</strong> box, wired up to its own processor only</td></tr>
<tr><td>Middle</td><td>A single thick horizontal line labelled <strong>shared bus</strong> — every L2 drops onto it</td></tr>
<tr><td>Bottom left</td><td><strong>Main Memory</strong>, hanging off the same bus</td></tr>
<tr><td>Bottom right</td><td><strong>I/O Subsystem</strong> on the bus, fanning out to <strong>I/O Adapter</strong> · <strong>I/O Adapter</strong> · <strong>I/O Adapter</strong></td></tr>
</table>
<ul>
<li><strong>Count the copies of one memory word and you have the whole problem.</strong> Word X lives in Main Memory. Processor 1 reads it: now there is a copy in P1's L2 and another in P1's L1. Processor 2 reads it: two more copies. On a four-processor machine one word can legitimately exist in <strong>nine</strong> places at once. Nothing in the picture stops those nine from disagreeing.</li>
<li><strong>The caches are private, and that is deliberate.</strong> Each L1 and L2 belongs to exactly one processor — there is no line from P1's L2 to P2's L2. They communicate only by what they can see on the shared bus. That constraint is what makes <em>snooping</em> (slide 15) the natural solution here: the bus is a broadcast medium, so every cache controller can watch every transaction for free.</li>
<li><strong>Why caches are not optional, even though they cause the trouble.</strong> Slide 10 says it outright: all memory references pass through the common bus, so performance is limited by bus cycle time. Without caches, n processors would generate n times the bus traffic and the bus would saturate at two or three processors. The caches are what make SMP possible; coherence is the bill.</li>
<li><strong>Connect to Chapter 5.</strong> Everything you learned about a single cache still applies to each box here — mapping, line size, replacement, write-back versus write-through. This chapter adds exactly one new axis: <em>other caches exist and they are watching.</em></li>
<li><strong>Connect to Chapter 21.</strong> In a modern multicore chip the picture is nearly identical, except that L1 (and often L2) are private per core while a large <strong>L3 is shared</strong> across all cores on the die, and the "shared bus" is an on-chip ring or mesh. The shared L3 is a coherence helper: it can answer many requests without going to DRAM.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: the problem is <em>not</em> that several caches hold a copy. Many readers are fine and perfectly consistent. The problem starts the instant <strong>one of them writes</strong>. Slide 10's sentence is the one to quote: "if a word is altered in one cache it could conceivably invalidate a word in another cache".</p>`,
        `<p class="y-chinh">🎯 Bộ xương tổng quát của slide 7, nhưng phần giữa được lấp bằng thứ đơn giản nhất có thể — <strong>MỘT bus dùng chung</strong> — và, quan trọng nhất, <strong>mỗi bộ xử lý được gắn thêm CACHE</strong>. Đúng một bức hình này đẻ ra bài toán nhất quán cache, rồi cả phần còn lại của chương đi xin lỗi vì nó.</p>
<table>
<tr><th>Tầng trên hình</th><th>Vẽ chính xác cái gì</th></tr>
<tr><td>Trên cùng</td><td><strong>Processor</strong> · <strong>Processor</strong> · … · <strong>Processor</strong>, và trong LÒNG mỗi hộp bộ xử lý có một hộp <strong>L1 Cache</strong></td></tr>
<tr><td>Kế dưới</td><td>Dưới mỗi bộ xử lý là một hộp <strong>L2 Cache</strong> riêng, chỉ nối lên đúng bộ xử lý của nó</td></tr>
<tr><td>Ở giữa</td><td>Một đường ngang đậm duy nhất ghi <strong>shared bus</strong> — mọi L2 đều thả xuống đó</td></tr>
<tr><td>Dưới trái</td><td><strong>Main Memory</strong>, móc vào chính cái bus ấy</td></tr>
<tr><td>Dưới phải</td><td><strong>I/O Subsystem</strong> trên bus, toả ra <strong>I/O Adapter</strong> · <strong>I/O Adapter</strong> · <strong>I/O Adapter</strong></td></tr>
</table>
<ul>
<li><strong>Đếm số bản sao của MỘT từ nhớ là thấy trọn vấn đề.</strong> Từ X nằm ở Main Memory. Bộ xử lý 1 đọc nó: giờ có thêm một bản trong L2 của P1 và một bản nữa trong L1 của P1. Bộ xử lý 2 đọc nó: thêm hai bản. Trên máy bốn bộ xử lý, một từ nhớ có thể tồn tại hợp lệ ở <strong>CHÍN</strong> chỗ cùng lúc. Không có gì trong bức hình ngăn chín chỗ đó nói khác nhau.</li>
<li><strong>Các cache là RIÊNG, và đó là chủ ý.</strong> Mỗi L1, L2 thuộc về đúng một bộ xử lý — không có sợi dây nào nối L2 của P1 sang L2 của P2. Chúng chỉ liên lạc được qua những gì nhìn thấy trên bus chung. Chính ràng buộc đó khiến <em>NGHE LÉN (snooping)</em> ở slide 15 thành lời giải tự nhiên ở đây: bus là môi trường quảng bá, nên mọi bộ điều khiển cache đều theo dõi được mọi giao dịch mà không tốn thêm gì.</li>
<li><strong>Vì sao cache không phải thứ tuỳ chọn, dù chính nó gây hoạ.</strong> Slide 10 nói thẳng: mọi tham chiếu bộ nhớ đều đi qua cái bus chung, nên hiệu năng bị chặn bởi chu kỳ bus. Không có cache thì n bộ xử lý sinh ra n lần lưu lượng bus và bus sẽ bão hoà ở hai, ba con là cùng. Cache là thứ làm SMP khả thi; nhất quán là cái hoá đơn phải trả.</li>
<li><strong>Nối sang Chương 5.</strong> Mọi thứ bạn học về MỘT cái cache vẫn đúng nguyên cho từng hộp ở đây — ánh xạ, kích thước dòng, thay thế, write-back hay write-through. Chương này chỉ thêm đúng một trục mới: <em>còn những cache khác, và chúng đang nhìn.</em></li>
<li><strong>Nối sang Chương 21.</strong> Trong một con chip đa lõi hiện đại bức tranh gần như y hệt, chỉ khác là L1 (và thường cả L2) riêng cho từng lõi còn một <strong>L3 lớn được DÙNG CHUNG</strong> cho mọi lõi trên cùng miếng silicon, và "bus dùng chung" là một vòng hoặc lưới trên chip. Cái L3 dùng chung là một trợ thủ cho nhất quán: nó trả lời được nhiều yêu cầu mà không phải xuống tận DRAM.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: vấn đề KHÔNG phải ở chỗ nhiều cache cùng giữ một bản sao. Nhiều người cùng ĐỌC thì hoàn toàn ổn và hoàn toàn nhất quán. Vấn đề bắt đầu đúng vào khoảnh khắc <strong>MỘT trong số đó GHI</strong>. Câu của slide 10 là câu nên trích: "nếu một từ bị sửa trong một cache thì nó có thể làm mất hiệu lực một từ trong cache khác".</p>`],

      [9, 'The bus organization has several attractive features — simplicity, flexibility, reliability',
        `<p class="y-chinh">🎯 Three reasons the humble shared bus beat cleverer interconnects for decades. The slide lists them as <strong>Simplicity · Flexibility · Reliability</strong>, each with one sentence of justification.</p>
<table>
<tr><th>Feature</th><th>The slide's justification</th><th>Why it actually matters</th></tr>
<tr><td><strong>Simplicity</strong></td><td>Simplest approach to multiprocessor organization</td><td>The bus is a structure you already have from the uniprocessor (Ch.3). Adding processors needs no new addressing scheme, no routing logic, no new memory model.</td></tr>
<tr><td><strong>Flexibility</strong></td><td>Generally easy to expand the system by attaching more processors to the bus</td><td>Expansion is physical, not architectural — plug in another module. No software rewrite, no re-partitioning of memory.</td></tr>
<tr><td><strong>Reliability</strong></td><td>The bus is essentially a <em>passive</em> medium and the failure of any attached device should not cause failure of the whole system</td><td>A passive medium has nothing to break. Compare a switched network, where the switch is an active component and a single point of failure.</td></tr>
</table>
<ul>
<li><strong>"Passive medium" is the load-bearing phrase of the reliability claim.</strong> The bus is wires plus arbitration; it does not compute or store, so it cannot crash. Lose a processor and the rest keep running — which is exactly the graceful degradation that slide 11 asks the OS to support.</li>
<li><strong>Read "flexibility" together with slide 10, because the two fight.</strong> It is <em>easy</em> to attach more processors — and each one you attach makes the shared bus more congested. Easy to do is not the same as profitable to do; the bus scales in convenience but not in bandwidth.</li>
<li><strong>Amdahl's law is the arithmetic of that ceiling — and it belongs to Chapter 2, not to this deck.</strong> Speedup on N processors is <strong>S = 1 / ((1 − f) + f/N)</strong>, where f is the fraction of the work that can run in parallel. Take a program that is 95% parallel and 5% strictly serial and put it on bigger and bigger machines:</li>
</ul>
<table>
<tr><th>Processors N</th><th>Speedup S</th><th>Efficiency S/N</th></tr>
<tr><td>2</td><td>1.905×</td><td>95.2%</td></tr>
<tr><td>4</td><td>3.478×</td><td>87.0%</td></tr>
<tr><td>8</td><td><strong>5.926×</strong></td><td>74.1%</td></tr>
<tr><td>16</td><td><strong>9.143×</strong></td><td>57.1%</td></tr>
<tr><td>64</td><td><strong>15.42×</strong></td><td>24.1%</td></tr>
<tr><td>256</td><td>18.62×</td><td>7.3%</td></tr>
<tr><td>∞</td><td><strong>20× and never more</strong></td><td>0%</td></tr>
</table>
<p class="dap-an">✅ Answer, all values computed on a machine, not estimated: with just <strong>5% serial code</strong>, 8 processors buy 5.93×, 16 buy 9.14×, and 64 buy only 15.42× — you paid 8× more hardware going from 8 to 64 cores and got 2.6× more speed. The hard ceiling is 1/(1 − f) = <strong>20×</strong>, no matter how many processors you buy. Raise the parallel fraction to 99% and 64 processors give 39.3×; drop it to 50% and 64 processors give 1.97×, barely better than 2 processors (1.33×→ in fact 8 cores already give 1.78×). <strong>The serial fraction, not the processor count, decides the answer.</strong></p>
<p class="meo">💡 Exam shortcut: compute the ceiling <strong>1/(1 − f)</strong> first. If the question asks "is it worth buying 64 cores?", the ceiling usually answers it before you do any division.</p>`,
        `<p class="y-chinh">🎯 Ba lý do khiến cái bus dùng chung khiêm tốn thắng những kiểu kết nối khôn ngoan hơn suốt mấy chục năm. Slide liệt kê thành <strong>Simplicity (đơn giản) · Flexibility (linh hoạt) · Reliability (tin cậy)</strong>, mỗi cái kèm một câu biện minh.</p>
<table>
<tr><th>Ưu điểm</th><th>Lý lẽ của slide</th><th>Vì sao nó thật sự quan trọng</th></tr>
<tr><td><strong>Đơn giản</strong></td><td>Cách tổ chức đa xử lý ĐƠN GIẢN NHẤT</td><td>Bus là cấu trúc bạn đã có sẵn từ máy đơn xử lý (Ch.3). Thêm bộ xử lý không cần sơ đồ địa chỉ mới, không cần logic định tuyến, không cần mô hình bộ nhớ mới.</td></tr>
<tr><td><strong>Linh hoạt</strong></td><td>Nhìn chung DỄ mở rộng hệ thống bằng cách gắn thêm bộ xử lý vào bus</td><td>Mở rộng là chuyện VẬT LÝ, không phải chuyện kiến trúc — cắm thêm một mô-đun. Không phải viết lại phần mềm, không phải chia lại bộ nhớ.</td></tr>
<tr><td><strong>Tin cậy</strong></td><td>Bus về bản chất là môi trường <em>THỤ ĐỘNG</em>, và hỏng một thiết bị gắn vào thì không làm hỏng cả hệ thống</td><td>Môi trường thụ động thì chẳng có gì để hỏng. So với mạng chuyển mạch, nơi con switch là thành phần chủ động và là một điểm chết duy nhất.</td></tr>
</table>
<ul>
<li><strong>Cụm "môi trường thụ động" mới là chỗ chịu lực của lý lẽ tin cậy.</strong> Bus chỉ là dây cộng với trọng tài; nó không tính toán, không lưu trữ, nên nó không sập được. Mất một bộ xử lý thì số còn lại vẫn chạy — đúng cái "suy giảm êm ái" mà slide 11 đòi hệ điều hành phải hỗ trợ.</li>
<li><strong>Phải đọc "linh hoạt" cùng với slide 10, vì hai điều này ĐÁNH NHAU.</strong> Gắn thêm bộ xử lý thì <em>DỄ</em> — và mỗi con gắn thêm lại làm cái bus chung tắc hơn. Dễ làm không có nghĩa là làm thì có lời; bus mở rộng tốt về mặt tiện lợi chứ không mở rộng về mặt băng thông.</li>
<li><strong>Định luật Amdahl là phép tính của cái trần đó — và nó thuộc Chương 2, KHÔNG in trên slide nào của deck này.</strong> Tăng tốc trên N bộ xử lý là <strong>S = 1 / ((1 − f) + f/N)</strong>, với f là phần công việc chạy song song được. Lấy một chương trình 95% song song, 5% tuần tự cứng, rồi đem lên những cỗ máy ngày một to:</li>
</ul>
<table>
<tr><th>Số bộ xử lý N</th><th>Tăng tốc S</th><th>Hiệu suất S/N</th></tr>
<tr><td>2</td><td>1,905 lần</td><td>95,2%</td></tr>
<tr><td>4</td><td>3,478 lần</td><td>87,0%</td></tr>
<tr><td>8</td><td><strong>5,926 lần</strong></td><td>74,1%</td></tr>
<tr><td>16</td><td><strong>9,143 lần</strong></td><td>57,1%</td></tr>
<tr><td>64</td><td><strong>15,42 lần</strong></td><td>24,1%</td></tr>
<tr><td>256</td><td>18,62 lần</td><td>7,3%</td></tr>
<tr><td>∞</td><td><strong>20 lần, và không bao giờ hơn</strong></td><td>0%</td></tr>
</table>
<p class="dap-an">✅ Đáp án, mọi con số đều do MÁY tính chứ không ước lượng: chỉ với <strong>5% mã tuần tự</strong>, 8 bộ xử lý mua được 5,93 lần, 16 con được 9,14 lần, còn 64 con chỉ được 15,42 lần — bạn trả gấp 8 lần tiền phần cứng khi đi từ 8 lên 64 lõi và nhận về thêm 2,6 lần tốc độ. Trần cứng là 1/(1 − f) = <strong>20 lần</strong>, mua bao nhiêu bộ xử lý cũng vậy. Nâng phần song song lên 99% thì 64 bộ xử lý cho 39,3 lần; tụt xuống 50% thì 64 bộ xử lý chỉ cho 1,97 lần, gần như không hơn gì 8 lõi (1,78 lần). <strong>PHẦN TUẦN TỰ quyết định đáp án, không phải SỐ LÕI.</strong></p>
<p class="meo">💡 Mẹo làm bài: tính cái trần <strong>1/(1 − f)</strong> TRƯỚC. Nếu đề hỏi "có đáng mua 64 lõi không?" thì thường cái trần đã trả lời xong trước khi bạn kịp chia phép nào.</p>`],

      [10, 'Disadvantages of the bus organization — performance, and the cache coherence problem it creates',
        `<p class="y-chinh">🎯 The bill for slide 9's three virtues, and the slide that <strong>states the cache coherence problem for the first time</strong>. Follow its chain of reasoning: bus is the bottleneck → therefore give every processor a cache → therefore copies can disagree → therefore you need a protocol.</p>
<table>
<tr><th>Step in the slide's chain</th><th>Exact wording</th></tr>
<tr><td>1. The drawback</td><td>Main drawback is <strong>performance</strong></td></tr>
<tr><td>2. Why</td><td>All memory references pass through the common bus; performance is limited by <strong>bus cycle time</strong></td></tr>
<tr><td>3. The fix</td><td>Each processor should have <strong>cache memory</strong> — reduces the number of bus accesses</td></tr>
<tr><td>4. The fix's cost</td><td>Leads to problems with <strong>cache coherence</strong></td></tr>
<tr><td>5. Precisely how</td><td>If a word is altered in one cache <strong>it could conceivably invalidate a word in another cache</strong></td></tr>
<tr><td>6. The requirement</td><td>To prevent this, the other processors <strong>must be alerted</strong> that an update has taken place</td></tr>
<tr><td>7. Where it is solved</td><td>Typically addressed in <strong>hardware rather than the operating system</strong></td></tr>
</table>
<ul>
<li><strong>Worked example of incoherence, with numbers.</strong> Memory holds <code>counter = 0</code>. Core A's cache loads it and, using write-back (Ch.5), performs 1000 increments entirely inside its own cache: A's copy now reads <strong>1000</strong> while main memory still reads <strong>0</strong>. Core B now loads <code>counter</code> — and with no coherence protocol it gets the stale <strong>0</strong> from memory, performs its own 1000 increments, and its copy reads <strong>1000</strong>. Both caches eventually write back. Final value in memory: <strong>1000</strong>, not the correct <strong>2000</strong>. Exactly half the work has vanished, silently, with no error anywhere.</li>
<li><strong>Write-through does not save you either.</strong> If A writes through, main memory is correct — but B's cache is still holding the old line and B keeps reading it out of its own cache, never consulting memory again. Write-through fixes memory; it does not fix <em>the other cache</em>. Only a protocol that <em>alerts the other processors</em> (step 6) does that.</li>
<li><strong>Measured on a real machine — and the surprise is the other direction.</strong> Two threads each incrementing one shared <code>volatile long</code> 10 million times, expected total 20,000,000. Actual results across three runs: <strong>10,461,091 · 9,843,238 · 10,097,489</strong> — roughly <strong>48–51% of all updates lost</strong>. And this machine has full MESI coherence in hardware.</li>
</ul>
<p class="dap-an">✅ Answer, and it is the point most students miss: <strong>coherence is not synchronisation.</strong> MESI guarantees that all caches agree on what the <em>current</em> value of the line is. It does <em>not</em> make <code>counter++</code> atomic — that is read, add, write as three separate steps, and two cores can both read 7, both compute 8, and both store 8. Half the increments disappear even though every cache was perfectly coherent at every instant. Coherence is a hardware property; atomicity needs a lock, a mutex, or an atomic instruction (<code>LOCK XADD</code> on x86).</p>
<p class="pitfall">⚠️ Trap that connects to PRF192: a global variable shared by two threads is exactly the <code>counter</code> above. If you write <code>x++</code> on a shared global without a mutex, the compiler and the hardware are both behaving correctly and your answer is still wrong. The bug is in your program, not in the cache.</p>`,
        `<p class="y-chinh">🎯 Cái hoá đơn cho ba ưu điểm ở slide 9, và cũng là slide <strong>lần đầu tiên nêu bài toán nhất quán cache</strong>. Hãy bám theo chuỗi lập luận của nó: bus là nút thắt → nên phát cho mỗi bộ xử lý một cache → nên các bản sao có thể nói khác nhau → nên phải có một giao thức.</p>
<table>
<tr><th>Mắt xích trong chuỗi của slide</th><th>Đúng chữ slide</th></tr>
<tr><td>1. Nhược điểm</td><td>Nhược điểm chính là <strong>HIỆU NĂNG</strong></td></tr>
<tr><td>2. Vì sao</td><td>Mọi tham chiếu bộ nhớ đều đi qua bus chung; hiệu năng bị giới hạn bởi <strong>chu kỳ bus</strong></td></tr>
<tr><td>3. Cách chữa</td><td>Mỗi bộ xử lý nên có <strong>bộ nhớ cache</strong> — giảm số lần truy cập bus</td></tr>
<tr><td>4. Giá của cách chữa</td><td>Dẫn tới vấn đề <strong>NHẤT QUÁN CACHE</strong></td></tr>
<tr><td>5. Cụ thể ra sao</td><td>Nếu một từ bị sửa trong một cache thì <strong>nó có thể làm mất hiệu lực một từ trong cache khác</strong></td></tr>
<tr><td>6. Yêu cầu đặt ra</td><td>Để ngăn chuyện đó, các bộ xử lý khác <strong>PHẢI ĐƯỢC BÁO</strong> rằng đã có một cập nhật</td></tr>
<tr><td>7. Giải ở đâu</td><td>Thường giải bằng <strong>PHẦN CỨNG chứ không phải hệ điều hành</strong></td></tr>
</table>
<ul>
<li><strong>Ví dụ mất nhất quán, có số hẳn hoi.</strong> Bộ nhớ giữ <code>counter = 0</code>. Cache của lõi A nạp nó về và, theo chế độ write-back (Ch.5), thực hiện 1000 lần tăng hoàn toàn bên trong cache của mình: bản của A giờ là <strong>1000</strong> trong khi bộ nhớ chính vẫn là <strong>0</strong>. Lõi B lúc này nạp <code>counter</code> — và vì không có giao thức nhất quán, nó nhận về số <strong>0</strong> đã ôi từ bộ nhớ, tự tăng 1000 lần của nó, bản của B thành <strong>1000</strong>. Rồi cả hai cache ghi ngược về. Giá trị cuối trong bộ nhớ: <strong>1000</strong>, chứ không phải <strong>2000</strong> đúng. Đúng một nửa khối lượng công việc bốc hơi, lặng lẽ, không một thông báo lỗi nào.</li>
<li><strong>Write-through cũng không cứu được bạn.</strong> Nếu A ghi xuyên thẳng, bộ nhớ chính đúng — nhưng cache của B vẫn đang ôm dòng cũ và B cứ đọc nó ra từ cache của chính mình, không bao giờ hỏi lại bộ nhớ nữa. Write-through sửa được BỘ NHỚ; nó không sửa được <em>CÁI CACHE KIA</em>. Chỉ một giao thức biết <em>BÁO CHO CÁC BỘ XỬ LÝ KHÁC</em> (mắt xích 6) mới làm được.</li>
<li><strong>Đo thật trên máy — và bất ngờ nằm ở hướng ngược lại.</strong> Hai luồng, mỗi luồng tăng một biến <code>volatile long</code> dùng chung 10 triệu lần, tổng mong đợi 20.000.000. Kết quả thật ba lượt chạy: <strong>10.461.091 · 9.843.238 · 10.097.489</strong> — tức <strong>mất khoảng 48–51% số lần cập nhật</strong>. Mà cái máy này CÓ đủ MESI trong phần cứng.</li>
</ul>
<p class="dap-an">✅ Đáp án, và đây là chỗ đa số sinh viên bỏ lỡ: <strong>NHẤT QUÁN KHÔNG PHẢI ĐỒNG BỘ HOÁ.</strong> MESI bảo đảm mọi cache thống nhất với nhau về giá trị <em>HIỆN TẠI</em> của dòng nhớ. Nó KHÔNG làm cho <code>counter++</code> trở thành nguyên tử — phép đó gồm đọc, cộng, ghi là ba bước tách rời, và hai lõi hoàn toàn có thể cùng đọc ra 7, cùng tính ra 8, rồi cùng ghi 8. Một nửa số lần tăng biến mất dù mọi cache đều nhất quán hoàn hảo tại mọi thời điểm. Nhất quán là tính chất của phần cứng; tính nguyên tử cần một khoá, một mutex, hoặc một lệnh nguyên tử (<code>LOCK XADD</code> trên x86).</p>
<p class="pitfall">⚠️ Bẫy nối thẳng sang PRF192: một biến toàn cục mà hai luồng cùng dùng chính là cái <code>counter</code> ở trên. Nếu bạn viết <code>x++</code> trên một biến toàn cục dùng chung mà không có mutex thì trình biên dịch đúng, phần cứng cũng đúng, và kết quả của bạn vẫn sai. Lỗi nằm trong chương trình của bạn, không nằm ở cache.</p>`],

      [11, 'Multiprocessor Operating System Design Considerations',
        `<p class="y-chinh">🎯 Five things a kernel must get right once more than one processor can be inside it at the same time. Every item is a place where a uniprocessor assumption quietly breaks.</p>
<table>
<tr><th>Consideration</th><th>What the slide requires</th></tr>
<tr><td><strong>Simultaneous concurrent processes</strong></td><td>OS routines need to be <strong>reentrant</strong> so several processors can execute the same code simultaneously; OS tables and management structures must be managed properly to avoid <strong>deadlock or invalid operations</strong></td></tr>
<tr><td><strong>Scheduling</strong></td><td><strong>Any</strong> processor may perform scheduling, so conflicts must be avoided; the scheduler must assign ready processes to available processors</td></tr>
<tr><td><strong>Synchronization</strong></td><td>With multiple active processes having potential access to shared address spaces or I/O resources, effective synchronization must be provided — a facility that enforces <strong>mutual exclusion and event ordering</strong></td></tr>
<tr><td><strong>Memory management</strong></td><td>Beyond the usual uniprocessor issues, the OS must exploit the available hardware parallelism; <strong>paging mechanisms on different processors must be coordinated</strong> to enforce consistency when several processors share a page or segment, and to decide on page replacement</td></tr>
<tr><td><strong>Reliability and fault tolerance</strong></td><td>The OS should provide <strong>graceful degradation</strong> in the face of processor failure; the scheduler and other parts must recognise the loss of a processor and restructure accordingly</td></tr>
</table>
<ul>
<li><strong>"Reentrant" is the word to be able to define.</strong> A reentrant routine can be entered again before a previous invocation has finished, because it keeps no modifiable state in fixed global locations — everything lives on the caller's stack or in registers. On a uniprocessor you needed reentrancy for interrupts; on an SMP you need it because two processors really are inside the function at the same microsecond.</li>
<li><strong>"Any processor may perform scheduling" is more radical than it sounds.</strong> The run queue is now a shared data structure that several processors mutate concurrently. Two processors picking the same ready process off the queue and both running it is a correctness bug, not a slowdown — hence the slide's "conflicts must be avoided".</li>
<li><strong>Synchronization is defined on the slide, and the definition is examinable.</strong> "A facility that enforces <strong>mutual exclusion and event ordering</strong>" — two duties, not one. Mutual exclusion = only one at a time inside the critical section. Event ordering = A definitely happens before B. Slide 10's lost-counter measurement is a mutual-exclusion failure.</li>
<li><strong>Memory management has a specifically multiprocessor twist.</strong> If P1 unmaps a page, P2's MMU may still hold a translation for it in its TLB. Real hardware needs a "TLB shootdown": an inter-processor interrupt telling every other processor to flush that entry. That is the concrete shape of "paging mechanisms must be coordinated". It is the same problem as cache coherence, one level up — a cached copy of a translation instead of a cached copy of data.</li>
<li><strong>Graceful degradation is the cash value of slide 9's "reliability".</strong> The passive bus survives a dead processor, but only if the OS notices and re-schedules its work. Hardware tolerance without software tolerance buys nothing.</li>
</ul>
<p class="meo">💡 Mnemonic for the five: <strong>re-enter · schedule · synchronise · page · survive</strong>.</p>`,
        `<p class="y-chinh">🎯 Năm thứ mà một nhân hệ điều hành phải làm cho đúng, một khi có nhiều hơn một bộ xử lý cùng nằm bên trong nó. Mỗi mục là một chỗ mà giả định của máy đơn xử lý lặng lẽ vỡ.</p>
<table>
<tr><th>Vấn đề cần cân nhắc</th><th>Slide đòi hỏi gì</th></tr>
<tr><td><strong>Tiến trình đồng thời cùng lúc</strong></td><td>Các thủ tục của hệ điều hành phải <strong>REENTRANT (vào lại được)</strong> để nhiều bộ xử lý cùng chạy một đoạn mã một lúc; các bảng và cấu trúc quản lý của hệ điều hành phải được quản lý đúng cách để tránh <strong>bế tắc (deadlock) hoặc thao tác không hợp lệ</strong></td></tr>
<tr><td><strong>Lập lịch</strong></td><td><strong>BẤT KỲ</strong> bộ xử lý nào cũng có thể thực hiện lập lịch, nên phải tránh xung đột; bộ lập lịch phải gán tiến trình sẵn sàng cho bộ xử lý đang rảnh</td></tr>
<tr><td><strong>Đồng bộ hoá</strong></td><td>Khi nhiều tiến trình đang hoạt động cùng có khả năng chạm vào không gian địa chỉ hoặc tài nguyên vào/ra dùng chung, phải có đồng bộ hoá hữu hiệu — một cơ chế cưỡng chế <strong>loại trừ tương hỗ và thứ tự sự kiện</strong></td></tr>
<tr><td><strong>Quản lý bộ nhớ</strong></td><td>Ngoài mọi vấn đề vốn có của máy đơn xử lý, hệ điều hành phải khai thác được phần song song mà phần cứng cho; <strong>cơ chế phân trang trên các bộ xử lý khác nhau phải được PHỐI HỢP</strong> để bảo đảm nhất quán khi nhiều bộ xử lý dùng chung một trang hoặc một đoạn, và để quyết định thay trang</td></tr>
<tr><td><strong>Độ tin cậy và chịu lỗi</strong></td><td>Hệ điều hành nên <strong>SUY GIẢM ÊM ÁI</strong> khi một bộ xử lý hỏng; bộ lập lịch và các phần khác phải nhận ra việc mất một bộ xử lý và tái cấu trúc theo</td></tr>
</table>
<ul>
<li><strong>"Reentrant" là chữ phải định nghĩa được.</strong> Một thủ tục vào lại được là thủ tục có thể được bước vào lần nữa trước khi lần gọi trước kết thúc, vì nó không giữ trạng thái sửa đổi được ở các ô toàn cục cố định — mọi thứ nằm trên ngăn xếp của người gọi hoặc trong thanh ghi. Trên máy đơn xử lý bạn cần tính vào lại được vì NGẮT; trên SMP bạn cần nó vì hai bộ xử lý thật sự đang ở bên trong hàm đó cùng một micro giây.</li>
<li><strong>"Bất kỳ bộ xử lý nào cũng lập lịch được" nghe nhẹ mà nặng hơn tưởng.</strong> Hàng đợi sẵn sàng bây giờ là một cấu trúc dữ liệu dùng chung bị nhiều bộ xử lý sửa đồng thời. Hai bộ xử lý cùng nhặt một tiến trình khỏi hàng đợi rồi cùng chạy nó là lỗi ĐÚNG SAI chứ không phải chuyện chậm — nên slide mới viết "phải tránh xung đột".</li>
<li><strong>Đồng bộ hoá được ĐỊNH NGHĨA ngay trên slide, và định nghĩa đó ra đề được.</strong> "Một cơ chế cưỡng chế <strong>loại trừ tương hỗ VÀ thứ tự sự kiện</strong>" — HAI nhiệm vụ, không phải một. Loại trừ tương hỗ = mỗi lúc chỉ một kẻ trong miền găng. Thứ tự sự kiện = A chắc chắn xảy ra trước B. Phép đo mất biến đếm ở slide 10 là một thất bại về loại trừ tương hỗ.</li>
<li><strong>Quản lý bộ nhớ có một nét riêng của máy đa xử lý.</strong> Nếu P1 gỡ ánh xạ một trang, MMU của P2 vẫn có thể đang giữ bản dịch địa chỉ của trang đó trong TLB của nó. Phần cứng thật cần một cú "TLB shootdown": một ngắt liên bộ xử lý bảo mọi con khác xoá mục đó đi. Đó là hình hài cụ thể của câu "cơ chế phân trang phải được phối hợp". Nó đúng là bài toán nhất quán cache, nâng lên một tầng — một bản sao được đệm của BẢN DỊCH ĐỊA CHỈ thay vì của dữ liệu.</li>
<li><strong>Suy giảm êm ái là giá trị tiền tươi của chữ "tin cậy" ở slide 9.</strong> Cái bus thụ động sống sót qua một bộ xử lý chết, nhưng chỉ khi hệ điều hành nhận ra và lập lịch lại phần việc của nó. Phần cứng chịu lỗi mà phần mềm không chịu lỗi thì chẳng mua được gì.</li>
</ul>
<p class="meo">💡 Mẹo nhớ năm mục: <strong>vào lại · lập lịch · đồng bộ · phân trang · sống sót</strong>.</p>`],

      [12, 'Cache Coherence (1 of 2) — Software Solutions',
        `<p class="y-chinh">🎯 The first of the two families of answers. Software solutions <strong>attempt to avoid the need for additional hardware circuitry and logic by relying on the compiler and operating system to deal with the problem</strong> — and the slide is even-handed: it gives one strong argument for and one strong argument against.</p>
<table>
<tr><th></th><th>The slide's claim</th><th>Unpacked</th></tr>
<tr><td><strong>The idea</strong></td><td>Rely on the compiler and the OS instead of extra circuitry</td><td>The compiler analyses the program, spots which variables could be shared and written, and marks those as <em>non-cacheable</em> — or inserts explicit flush/invalidate instructions.</td></tr>
<tr><td><strong>Argument for #1</strong></td><td>The overhead of detecting potential problems is transferred from <strong>run time to compile time</strong></td><td>You pay once, while building, instead of on every single memory access forever.</td></tr>
<tr><td><strong>Argument for #2</strong></td><td>Design complexity is transferred from <strong>hardware to software</strong></td><td>Cheaper chips, simpler cache controllers, no snooping logic, no extra bus lines.</td></tr>
<tr><td><strong>Argument against</strong></td><td>Compile-time approaches must make <strong>conservative decisions</strong>, leading to <strong>inefficient cache utilization</strong></td><td>This is the killer, and the next slide is the verdict.</td></tr>
</table>
<ul>
<li><strong>Why "conservative" is fatal, in one example.</strong> At compile time the compiler sees <code>*p = 5;</code> and cannot always prove where <code>p</code> points. It must assume the worst — that the target might be shared and written by another processor — so it marks the data non-cacheable. Every access to it then goes to main memory at full DRAM latency, even though at run time the sharing may never actually occur. You lose the cache for data that would have been perfectly safe to cache.</li>
<li><strong>The general principle is bigger than this chapter.</strong> Static analysis must be sound, so it must cover every possibility the program <em>could</em> exhibit; dynamic hardware only has to handle what actually happens. Whenever the two compete on something as data-dependent as sharing, the dynamic one wins on efficiency and the static one wins on cost.</li>
<li><strong>Software approaches are not extinct, just not the default.</strong> Explicit cache management is exactly how GPUs, DSPs and many embedded multicore chips work, because dropping the coherence hardware buys you a lot of silicon and power. In those systems the programmer, not the chip, is responsible for flushing.</li>
<li><strong>Do not confuse this with locks and mutexes.</strong> A software coherence solution is about <em>where copies are allowed to live</em>. A mutex is about <em>who may enter a critical section</em>. Slide 10's measurement showed you need the second even when the hardware gives you the first for free.</li>
</ul>
<p class="pitfall">⚠️ Exam wording trap: the slide never says software solutions do not work. It says they are <strong>conservative</strong> and therefore <strong>use the cache inefficiently</strong>. "Incorrect" and "inefficient" are different marks.</p>`,
        `<p class="y-chinh">🎯 Họ lời giải thứ nhất trong hai họ. Lời giải phần mềm <strong>cố tránh phải thêm mạch và logic phần cứng, bằng cách dựa vào trình biên dịch và hệ điều hành để lo vấn đề</strong> — và slide rất công bằng: nó đưa một lý lẽ ủng hộ mạnh và một lý lẽ phản đối mạnh.</p>
<table>
<tr><th></th><th>Slide nói gì</th><th>Mở ra thành</th></tr>
<tr><td><strong>Ý tưởng</strong></td><td>Dựa vào trình biên dịch và hệ điều hành thay vì thêm mạch</td><td>Trình biên dịch phân tích chương trình, chỉ ra biến nào có thể vừa dùng chung vừa bị ghi, rồi đánh dấu những biến đó là <em>KHÔNG ĐƯỢC ĐỆM</em> — hoặc chèn lệnh xả/vô hiệu hoá cache tường minh.</td></tr>
<tr><td><strong>Lý lẽ ủng hộ #1</strong></td><td>Chi phí phát hiện vấn đề tiềm tàng được chuyển từ <strong>lúc CHẠY sang lúc BIÊN DỊCH</strong></td><td>Bạn trả một lần, lúc dựng chương trình, thay vì trả trên từng lượt truy cập bộ nhớ, mãi mãi.</td></tr>
<tr><td><strong>Lý lẽ ủng hộ #2</strong></td><td>Độ phức tạp thiết kế chuyển từ <strong>PHẦN CỨNG sang PHẦN MỀM</strong></td><td>Chip rẻ hơn, bộ điều khiển cache đơn giản hơn, không cần logic nghe lén, không cần thêm đường bus.</td></tr>
<tr><td><strong>Lý lẽ phản đối</strong></td><td>Cách tiếp cận lúc biên dịch buộc phải ra <strong>QUYẾT ĐỊNH THẬN TRỌNG</strong>, dẫn tới <strong>dùng cache kém hiệu quả</strong></td><td>Đây là đòn chí mạng, và slide kế tiếp là bản án.</td></tr>
</table>
<ul>
<li><strong>Vì sao "thận trọng" lại là chết người, qua một ví dụ.</strong> Lúc biên dịch, trình biên dịch nhìn thấy <code>*p = 5;</code> và không phải lúc nào cũng chứng minh được <code>p</code> trỏ vào đâu. Nó buộc phải giả định trường hợp xấu nhất — rằng chỗ đó có thể đang được dùng chung và bị bộ xử lý khác ghi — nên nó đánh dấu dữ liệu đó là không được đệm. Từ đó mọi lượt truy cập vào nó đều xuống thẳng bộ nhớ chính với đủ độ trễ DRAM, dù lúc chạy thật có khi chẳng bao giờ có chuyện dùng chung. Bạn mất cache cho một dữ liệu lẽ ra đệm hoàn toàn an toàn.</li>
<li><strong>Nguyên lý chung ở đây lớn hơn chương này.</strong> Phân tích tĩnh phải ĐÚNG CHẮC, nên nó phải phủ mọi khả năng mà chương trình <em>CÓ THỂ</em> biểu hiện; phần cứng động thì chỉ phải lo những gì THẬT SỰ xảy ra. Hễ hai bên tranh nhau ở một thứ phụ thuộc dữ liệu nhiều như chuyện dùng chung, thì bên động thắng về hiệu quả và bên tĩnh thắng về giá.</li>
<li><strong>Lời giải phần mềm chưa tuyệt chủng, chỉ là không còn mặc định.</strong> Quản lý cache tường minh chính xác là cách GPU, DSP và rất nhiều chip đa lõi nhúng hoạt động, vì bỏ được phần cứng nhất quán là tiết kiệm được rất nhiều silicon và điện. Ở những hệ đó, người lập trình — chứ không phải con chip — chịu trách nhiệm xả cache.</li>
<li><strong>Đừng lẫn cái này với khoá và mutex.</strong> Lời giải nhất quán bằng phần mềm nói về chuyện <em>BẢN SAO ĐƯỢC PHÉP NẰM Ở ĐÂU</em>. Còn mutex nói về chuyện <em>AI ĐƯỢC VÀO MIỀN GĂNG</em>. Phép đo ở slide 10 cho thấy bạn vẫn cần cái thứ hai ngay cả khi phần cứng cho không bạn cái thứ nhất.</li>
</ul>
<p class="pitfall">⚠️ Bẫy câu chữ trong đề: slide KHÔNG hề nói lời giải phần mềm không chạy được. Nó nói chúng <strong>THẬN TRỌNG</strong> nên <strong>DÙNG CACHE KÉM HIỆU QUẢ</strong>. "Sai" và "kém hiệu quả" là hai điểm khác nhau.</p>`],

      [13, 'Cache Coherence (2 of 2) — Hardware-Based Solutions',
        `<p class="y-chinh">🎯 The family that actually shipped. Hardware solutions are <strong>generally referred to as cache coherence protocols</strong>, and the slide ends by splitting them into the two categories that slides 14 and 15 then take one at a time.</p>
<table>
<tr><th>The slide's point</th><th>What it buys you</th></tr>
<tr><td>Generally referred to as <strong>cache coherence protocols</strong></td><td>This is the name to use in an exam answer.</td></tr>
<tr><td>Provide <strong>dynamic recognition at run time</strong> of potential inconsistency conditions</td><td>The exact opposite of slide 12's compile-time analysis.</td></tr>
<tr><td>Because the problem is <strong>only dealt with when it actually arises</strong>, there is more effective use of caches, leading to improved performance over a software approach</td><td>This is the direct rebuttal of "conservative decisions". No sharing this run ⇒ no cost this run.</td></tr>
<tr><td><strong>Transparent to the programmer and the compiler</strong>, reducing the software development burden</td><td>You write ordinary C. You never mention coherence. It simply holds.</td></tr>
<tr><td>Can be divided into two categories: <strong>Directory protocols</strong> · <strong>Snoopy protocols</strong></td><td>Slide 14 and slide 15 respectively.</td></tr>
</table>
<ul>
<li><strong>"Transparent" is the reason this approach won, and it is worth a full sentence in an exam.</strong> Millions of existing programs, compiled years earlier, keep working correctly on a new multiprocessor without recompilation. No software solution can offer that, because a software solution by definition requires the software to be rebuilt with the new analysis.</li>
<li><strong>Dynamic versus static, one more time.</strong> Slide 12 pays a fixed cost on <em>all possibly-shared</em> data. Slide 13 pays a variable cost only on <em>actually-shared, actually-written</em> data. Most data in most programs is neither, which is why the dynamic scheme is far cheaper in practice.</li>
<li><strong>The two categories differ in one thing: where the bookkeeping lives.</strong> Directory = a <em>central</em> record in main memory saying which caches hold which line. Snoopy = the knowledge is <em>distributed</em> among the cache controllers, who learn it by watching the bus. Centralised versus distributed, with all the usual consequences.</li>
<li><strong>How to pick between them in an exam.</strong> A shared bus is a broadcast medium, so snooping is nearly free there ⇒ <strong>bus-based SMP takes snoopy</strong>. A large machine with a switched network has no cheap broadcast, so broadcasting would flood it ⇒ <strong>large-scale NUMA takes directory</strong>. The interconnect decides the protocol.</li>
</ul>
<p class="meo">💡 Two words: <strong>directory = a register of owners at the town hall; snoopy = neighbours listening at the fence.</strong> The town hall scales to a city but is a queue; the neighbours are instant but only work while everyone is within earshot.</p>`,
        `<p class="y-chinh">🎯 Cái họ thật sự được đem đi bán. Lời giải phần cứng <strong>thường được gọi là các GIAO THỨC NHẤT QUÁN CACHE</strong>, và slide kết bằng việc chẻ chúng thành hai loại mà slide 14 và 15 sẽ lần lượt mổ.</p>
<table>
<tr><th>Ý của slide</th><th>Nó mua được gì</th></tr>
<tr><td>Thường được gọi là <strong>giao thức nhất quán cache</strong></td><td>Đây là tên nên dùng khi làm bài.</td></tr>
<tr><td>Cung cấp khả năng <strong>NHẬN BIẾT ĐỘNG LÚC CHẠY</strong> các tình huống có thể mất nhất quán</td><td>Ngược hẳn với phân tích lúc biên dịch ở slide 12.</td></tr>
<tr><td>Vì vấn đề <strong>chỉ được xử lý khi nó THẬT SỰ phát sinh</strong>, cache được dùng hiệu quả hơn, dẫn tới hiệu năng tốt hơn cách làm bằng phần mềm</td><td>Đây là câu bác thẳng cái "quyết định thận trọng". Lượt chạy này không dùng chung ⇒ lượt chạy này không tốn gì.</td></tr>
<tr><td><strong>TRONG SUỐT với người lập trình và trình biên dịch</strong>, giảm gánh nặng phát triển phần mềm</td><td>Bạn viết C bình thường. Bạn chẳng bao giờ nhắc tới chữ nhất quán. Nó cứ đúng.</td></tr>
<tr><td>Chia thành hai loại: <strong>Directory protocols</strong> · <strong>Snoopy protocols</strong></td><td>Lần lượt là slide 14 và slide 15.</td></tr>
</table>
<ul>
<li><strong>"Trong suốt" là lý do cách này thắng, và đáng viết hẳn một câu trong bài thi.</strong> Hàng triệu chương trình đã có sẵn, biên dịch từ nhiều năm trước, vẫn chạy đúng trên một máy đa xử lý mới mà không phải biên dịch lại. Không lời giải phần mềm nào hứa được điều đó, vì lời giải phần mềm theo định nghĩa đòi phần mềm phải được dựng lại với phép phân tích mới.</li>
<li><strong>Động so với tĩnh, nhắc thêm một lần.</strong> Slide 12 trả một chi phí cố định trên <em>MỌI dữ liệu CÓ THỂ dùng chung</em>. Slide 13 trả một chi phí thay đổi chỉ trên <em>dữ liệu THẬT SỰ dùng chung và THẬT SỰ bị ghi</em>. Phần lớn dữ liệu trong phần lớn chương trình chẳng thuộc loại nào trong hai, nên trên thực tế cách động rẻ hơn hẳn.</li>
<li><strong>Hai loại khác nhau đúng một chuyện: SỔ SÁCH NẰM Ở ĐÂU.</strong> Directory = một bản ghi <em>TẬP TRUNG</em> trong bộ nhớ chính, nói cache nào đang giữ dòng nào. Snoopy = kiến thức đó <em>PHÂN TÁN</em> trong các bộ điều khiển cache, chúng tự học bằng cách nhìn bus. Tập trung so với phân tán, kèm mọi hệ quả quen thuộc.</li>
<li><strong>Cách chọn giữa hai loại khi làm bài.</strong> Bus dùng chung là môi trường quảng bá, nên nghe lén ở đó gần như miễn phí ⇒ <strong>SMP dùng bus thì chọn snoopy</strong>. Máy lớn dùng mạng chuyển mạch không có quảng bá rẻ, quảng bá sẽ làm ngập mạng ⇒ <strong>NUMA quy mô lớn thì chọn directory</strong>. Kiểu kết nối quyết định giao thức.</li>
</ul>
<p class="meo">💡 Hai hình ảnh: <strong>directory = cuốn sổ hộ khẩu ở uỷ ban phường; snoopy = hàng xóm đứng nghe qua hàng rào.</strong> Uỷ ban thì mở rộng được ra cả thành phố nhưng phải xếp hàng; hàng xóm thì tức thì nhưng chỉ ăn thua khi mọi người còn trong tầm nghe.</p>`],

      [14, 'Directory Protocols',
        `<p class="y-chinh">🎯 The centralised answer, drawn on the slide as six linked boxes. A single directory somewhere in main memory records <strong>who has a copy of what</strong>, and every request that could break coherence must consult it first.</p>
<table>
<tr><th>Box on the slide</th><th>What it tells you</th></tr>
<tr><td><strong>Collect and maintain information about copies of data in cache</strong></td><td>The directory's job: for every memory line, which caches hold it and in what state.</td></tr>
<tr><td><strong>Directory stored in main memory</strong></td><td>Where the bookkeeping physically lives — not in the caches.</td></tr>
<tr><td><strong>Requests are checked against directory</strong></td><td>A cache cannot act alone; it asks the directory (the memory controller) for permission.</td></tr>
<tr><td><strong>Appropriate transfers are performed</strong></td><td>The controller then sends <em>point-to-point</em> messages: invalidate this cache, fetch from that one.</td></tr>
<tr><td><strong>Effective in large scale systems with complex interconnection schemes</strong></td><td>The advantage — it needs no broadcast, so it survives a switched network or a mesh.</td></tr>
<tr><td><strong>Creates central bottleneck</strong></td><td>The disadvantage — every coherence action serialises through one structure.</td></tr>
</table>
<ul>
<li><strong>Why "no broadcast" is the entire selling point.</strong> Snooping requires every cache to see every transaction. On a 64-node machine with a mesh network, broadcasting each miss to all 63 others would consume the network completely. The directory instead knows that line X is held by exactly nodes 7 and 40, and sends exactly two messages. Traffic scales with the number of <em>actual sharers</em>, not with the number of processors.</li>
<li><strong>Why the bottleneck is real.</strong> The directory is a shared structure and coherence actions on the same line must be ordered. It also costs memory: the classic full bit-vector directory stores one presence bit per processor per memory line, so a 64-processor machine with 64-byte lines spends 64 bits of directory per 512 bits of data — a 12.5% memory overhead just for bookkeeping.</li>
<li><strong>The extra latency is structural, not incidental.</strong> A miss on a snoopy bus is one broadcast; a miss under a directory is often three hops — requester to directory, directory to current owner, owner back to requester. You trade bandwidth for latency, which is the right trade only when bandwidth is the scarce thing.</li>
<li><strong>Where you meet it.</strong> Slide 36's CC-NUMA is a directory machine, and so is every large multi-socket server. In practice big systems are hybrids: snooping inside a socket where a shared bus or ring exists, directory between sockets where it does not.</li>
</ul>
<p class="pitfall">⚠️ Do not write "the directory is stored in the cache". The slide is explicit: <strong>directory stored in main memory</strong>. Putting it in the caches would recreate the very problem it is meant to solve — a distributed, possibly disagreeing record.</p>`,
        `<p class="y-chinh">🎯 Lời giải TẬP TRUNG, được slide vẽ thành sáu ô nối nhau. Một cuốn sổ (directory) duy nhất nằm đâu đó trong bộ nhớ chính ghi lại <strong>AI đang giữ bản sao của CÁI GÌ</strong>, và mọi yêu cầu có khả năng phá nhất quán đều phải hỏi cuốn sổ đó trước.</p>
<table>
<tr><th>Ô trên slide</th><th>Nó cho bạn biết gì</th></tr>
<tr><td><strong>Collect and maintain information about copies of data in cache</strong> — thu thập và duy trì thông tin về các bản sao dữ liệu trong cache</td><td>Việc của cuốn sổ: với mỗi dòng nhớ, những cache nào đang giữ nó và ở trạng thái gì.</td></tr>
<tr><td><strong>Directory stored in main memory</strong> — sổ nằm trong bộ nhớ chính</td><td>Chỗ sổ sách nằm về mặt vật lý — KHÔNG nằm trong các cache.</td></tr>
<tr><td><strong>Requests are checked against directory</strong> — yêu cầu được đối chiếu với sổ</td><td>Một cache không được tự ý hành động; nó phải xin phép cuốn sổ (bộ điều khiển bộ nhớ).</td></tr>
<tr><td><strong>Appropriate transfers are performed</strong> — rồi thực hiện các phép chuyển thích hợp</td><td>Bộ điều khiển gửi các thông điệp <em>ĐIỂM–ĐIỂM</em>: vô hiệu hoá cache này, lấy dữ liệu từ cache kia.</td></tr>
<tr><td><strong>Effective in large scale systems with complex interconnection schemes</strong></td><td>Ưu điểm — nó không cần quảng bá, nên sống được trên mạng chuyển mạch hoặc mạng lưới.</td></tr>
<tr><td><strong>Creates central bottleneck</strong> — tạo ra nút thắt tập trung</td><td>Nhược điểm — mọi hành động nhất quán đều phải xếp hàng qua một cấu trúc duy nhất.</td></tr>
</table>
<ul>
<li><strong>Vì sao "không cần quảng bá" là toàn bộ điểm bán hàng.</strong> Nghe lén đòi mọi cache phải thấy mọi giao dịch. Trên một máy 64 nút dùng mạng lưới, quảng bá mỗi lần trượt cache tới 63 con còn lại sẽ ngốn sạch mạng. Cuốn sổ thì biết thừa rằng dòng X chỉ do nút 7 và nút 40 đang giữ, và gửi đúng hai thông điệp. Lưu lượng tỉ lệ với số kẻ <em>THẬT SỰ đang dùng chung</em>, không tỉ lệ với số bộ xử lý.</li>
<li><strong>Vì sao cái nút thắt là có thật.</strong> Cuốn sổ là cấu trúc dùng chung, và các hành động nhất quán trên cùng một dòng buộc phải được xếp thứ tự. Nó còn tốn bộ nhớ: cuốn sổ vector bit đầy đủ kiểu cổ điển lưu một bit hiện diện cho mỗi bộ xử lý trên mỗi dòng nhớ, nên máy 64 bộ xử lý với dòng 64 byte tốn 64 bit sổ cho mỗi 512 bit dữ liệu — 12,5% bộ nhớ chỉ để ghi sổ.</li>
<li><strong>Độ trễ tăng thêm là do cấu trúc, không phải rủi ro tình cờ.</strong> Một lần trượt trên bus snoopy là một cú quảng bá; một lần trượt dưới directory thường là ba chặng — kẻ hỏi tới sổ, sổ tới chủ hiện tại, chủ trả về kẻ hỏi. Bạn đổi BĂNG THÔNG lấy ĐỘ TRỄ, và đó là cú đổi đúng chỉ khi băng thông mới là thứ khan hiếm.</li>
<li><strong>Bạn gặp nó ở đâu.</strong> CC-NUMA ở slide 36 là máy dùng directory, và mọi máy chủ nhiều socket lớn cũng vậy. Thực tế các hệ lớn đều lai: nghe lén BÊN TRONG một socket nơi có bus hoặc vòng dùng chung, và dùng directory GIỮA các socket nơi không có.</li>
</ul>
<p class="pitfall">⚠️ Đừng viết "cuốn sổ được lưu trong cache". Slide nói rõ: <strong>directory stored in main memory</strong>. Đặt nó vào các cache là tái tạo đúng cái vấn đề mà nó sinh ra để giải — một bản ghi phân tán và có thể nói khác nhau.</p>`],

      [15, 'Snoopy Protocols — distributing coherence among the cache controllers',
        `<p class="y-chinh">🎯 The distributed answer, and the one your laptop uses. Snoopy protocols <strong>distribute the responsibility for maintaining cache coherence among all of the cache controllers</strong> — there is no central authority, only a roomful of controllers all listening to the same bus.</p>
<table>
<tr><th>The slide's requirement</th><th>What the hardware must therefore do</th></tr>
<tr><td>A cache must <strong>recognise when a line that it holds is shared</strong> with other caches</td><td>Keep extra state bits per line — this is exactly what the M/E/S/I bits of slide 18 are.</td></tr>
<tr><td>When updates are performed on a shared line it <strong>must be announced to other caches by a broadcast mechanism</strong></td><td>Put the address on the bus so everyone sees it.</td></tr>
<tr><td>Each cache controller is able to <strong>"snoop" on the network</strong> to observe these broadcast notifications and react accordingly</td><td>Every controller watches every transaction, all the time, in parallel with its own processor's requests.</td></tr>
<tr><td><strong>Suited to bus-based multiprocessor</strong>, because the shared bus provides a simple means for broadcasting and snooping</td><td>The bus was already a broadcast medium — snooping is free real estate.</td></tr>
<tr><td>Care must be taken that the <strong>increased bus traffic</strong> required for broadcasting and snooping <strong>does not cancel out the gains</strong> from using local caches</td><td>The honest caveat, and the reason snooping does not scale past a few dozen processors.</td></tr>
<tr><td>Two basic approaches: <strong>Write invalidate</strong> · <strong>Write update (or write broadcast)</strong></td><td>Slides 16 and 17.</td></tr>
</table>
<ul>
<li><strong>"Snoop" is a technical term here, not slang, and the slide quotes it.</strong> The controller listens to bus transactions it did not issue, compares each address against its own tags, and acts if it has that line. It is a passive tag lookup running continuously in the background.</li>
<li><strong>Hence every cache needs a second port into its tag array.</strong> One port serves its own processor's lookups, the other serves snoop lookups from the bus. Without it, snooping would stall the processor on every bus transaction anyone makes — a real hardware cost that the slide's "increased bus traffic" caveat hints at.</li>
<li><strong>The scaling limit, stated plainly.</strong> Snoop traffic grows with the number of processors <em>times</em> the miss rate, while the bus's bandwidth stays fixed. Past roughly a few dozen snoopers the bus saturates and adding processors makes the machine slower. That ceiling is precisely why directory protocols (slide 14) exist for larger machines.</li>
<li><strong>Why it still wins in practice.</strong> Almost every machine a student will ever touch has between 2 and 16 cores inside one chip, connected by a ring or mesh that still supports cheap broadcast. In that range snooping has lower latency and far less hardware than a directory. Slide 16 will tell you that x86 uses it.</li>
</ul>
<p class="meo">💡 The division of labour to remember: <strong>the bus broadcasts, each controller decides.</strong> Nobody is in charge, and yet all the caches end up agreeing — because they all heard the same announcements in the same order. That ordering, provided free by a single shared bus, is the hidden ingredient that makes snooping correct.</p>`,
        `<p class="y-chinh">🎯 Lời giải PHÂN TÁN, và cũng là cái laptop của bạn đang dùng. Giao thức snoopy <strong>phân chia trách nhiệm duy trì nhất quán cache cho TẤT CẢ các bộ điều khiển cache</strong> — không có nhà cầm quyền trung ương, chỉ có một phòng đầy bộ điều khiển cùng lắng nghe một cái bus.</p>
<table>
<tr><th>Slide đòi hỏi gì</th><th>Phần cứng do đó phải làm gì</th></tr>
<tr><td>Một cache phải <strong>NHẬN RA khi một dòng nó đang giữ bị dùng chung</strong> với cache khác</td><td>Giữ thêm bit trạng thái cho mỗi dòng — chính là các bit M/E/S/I ở slide 18.</td></tr>
<tr><td>Khi có cập nhật trên một dòng dùng chung, việc đó <strong>phải được thông báo tới các cache khác bằng cơ chế QUẢNG BÁ</strong></td><td>Đưa địa chỉ lên bus để ai cũng thấy.</td></tr>
<tr><td>Mỗi bộ điều khiển cache có khả năng <strong>"NGHE LÉN" (snoop) trên mạng</strong> để quan sát các thông báo quảng bá đó và phản ứng theo</td><td>Mọi bộ điều khiển theo dõi mọi giao dịch, liên tục, song song với các yêu cầu của bộ xử lý của chính nó.</td></tr>
<tr><td><strong>Hợp với máy đa xử lý dùng bus</strong>, vì bus dùng chung cho sẵn một cách quảng bá và nghe lén đơn giản</td><td>Bus vốn đã là môi trường quảng bá rồi — nghe lén coi như của trời cho.</td></tr>
<tr><td>Phải cẩn thận kẻo <strong>lưu lượng bus tăng thêm</strong> để quảng bá và nghe lén <strong>xoá sạch phần lợi</strong> thu được từ việc dùng cache cục bộ</td><td>Câu cảnh báo trung thực, và là lý do nghe lén không mở rộng quá vài chục bộ xử lý.</td></tr>
<tr><td>Hai cách cơ bản: <strong>Write invalidate</strong> (ghi thì vô hiệu hoá) · <strong>Write update / write broadcast</strong> (ghi thì cập nhật)</td><td>Slide 16 và 17.</td></tr>
</table>
<ul>
<li><strong>"Snoop" ở đây là thuật ngữ kỹ thuật chứ không phải tiếng lóng, và slide để trong ngoặc kép.</strong> Bộ điều khiển nghe các giao dịch bus mà nó KHÔNG phát ra, đối chiếu từng địa chỉ với các thẻ (tag) của chính mình, và ra tay nếu nó có dòng đó. Đó là một phép tra thẻ thụ động chạy liên tục ở nền.</li>
<li><strong>Vì thế mỗi cache cần thêm một CỔNG THỨ HAI vào mảng thẻ.</strong> Một cổng phục vụ các phép tra của bộ xử lý nhà, cổng kia phục vụ các phép tra do nghe lén từ bus. Không có nó thì nghe lén sẽ làm nghẽn bộ xử lý mỗi khi có bất kỳ ai phát một giao dịch bus — một cái giá phần cứng thật mà câu cảnh báo "lưu lượng bus tăng thêm" của slide đang ám chỉ.</li>
<li><strong>Giới hạn mở rộng, nói toạc ra.</strong> Lưu lượng nghe lén tăng theo số bộ xử lý <em>NHÂN VỚI</em> tỉ lệ trượt cache, trong khi băng thông bus thì đứng yên. Vượt quá quãng vài chục kẻ nghe lén là bus bão hoà và thêm bộ xử lý lại làm máy CHẬM ĐI. Đúng cái trần đó là lý do giao thức directory (slide 14) tồn tại cho máy lớn hơn.</li>
<li><strong>Vì sao trên thực tế nó vẫn thắng.</strong> Gần như mọi cỗ máy mà một sinh viên chạm vào đều có từ 2 đến 16 lõi trong một con chip, nối bằng vòng hoặc lưới vẫn hỗ trợ quảng bá rẻ. Trong khoảng đó, nghe lén có độ trễ thấp hơn và ít phần cứng hơn hẳn directory. Slide 16 sẽ nói cho bạn biết x86 dùng nó.</li>
</ul>
<p class="meo">💡 Cách chia việc cần nhớ: <strong>BUS quảng bá, TỪNG bộ điều khiển tự quyết.</strong> Không ai chỉ huy, vậy mà cuối cùng mọi cache đều đồng thuận — vì tất cả đều nghe cùng những thông báo ấy theo cùng một THỨ TỰ. Cái thứ tự đó, do một bus dùng chung cho không, chính là nguyên liệu ẩn khiến nghe lén trở nên ĐÚNG.</p>`],

      [16, 'Write Invalidate — one writer, many readers, and the name MESI appears',
        `<p class="y-chinh">🎯 The winning policy, and the slide where the four letters finally arrive. The rule is <strong>multiple readers, but only one writer at a time</strong>; when a write is required, <strong>all other caches of the line are invalidated</strong>.</p>
<table>
<tr><th>The slide's statement</th><th>Why it is built that way</th></tr>
<tr><td><strong>Multiple readers, but only one writer at a time</strong></td><td>The classic readers–writer discipline, enforced in silicon on every cache line independently.</td></tr>
<tr><td>When a write is required, <strong>all other caches of the line are invalidated</strong></td><td>Cheaper than updating them: send one address, not the data. Each other cache simply flips a bit to Invalid.</td></tr>
<tr><td>The writing processor then has <strong>exclusive (cheap) access until the line is required by another processor</strong></td><td>The payoff. After one invalidate, a burst of writes to that line costs nothing on the bus at all.</td></tr>
<tr><td><strong>Most widely used in commercial multiprocessor systems such as the x86 architecture</strong></td><td>The verdict of the market. This is what is in your machine.</td></tr>
<tr><td>State of every line is marked as <strong>modified, exclusive, shared or invalid</strong> — for this reason the write-invalidate protocol is called <strong>MESI</strong></td><td>The name is simply the four state names' initials.</td></tr>
</table>
<ul>
<li><strong>Why invalidate beats update, in one sentence.</strong> A typical write is followed by more writes to the same line by the same processor (temporal locality, Ch.4). Invalidate pays the bus cost <em>once</em> and then runs free; update pays a broadcast on <em>every single write</em>, forever. Invalidate optimises for the common case.</li>
<li><strong>The granularity is the LINE, not the variable — and that is where false sharing comes from.</strong> The hardware invalidates whole cache lines (64 bytes on x86, <strong>128 bytes on Apple silicon</strong>). If two cores write to two <em>different</em> variables that happen to sit in the same line, each write invalidates the other core's copy. The program shares nothing logically; the hardware sees them sharing everything.</li>
<li><strong>Measured for real on the machine this lesson was written on</strong> (Apple M1 Max, 10 cores, <code>hw.cachelinesize</code> = 128 bytes, Apple clang, <code>cc -O1 -pthread</code>). Two threads, each doing 200 million increments on its own counter; the only thing changed between runs is the distance between the two counters:</li>
</ul>
<pre>typedef struct { volatile long a; volatile long b; } Gan;                /* 8 B apart  */
typedef struct { volatile long a; char pad[128]; volatile long b; } Xa;  /* 136 B apart */</pre>
<table>
<tr><th>Run</th><th>Same cache line (8 B apart)</th><th>Different lines (136 B apart)</th><th>Slowdown</th></tr>
<tr><td>1</td><td>0.356 s</td><td>0.095 s</td><td><strong>3.76×</strong></td></tr>
<tr><td>2</td><td>0.317 s</td><td>0.077 s</td><td><strong>4.12×</strong></td></tr>
<tr><td>3</td><td>0.325 s</td><td>0.076 s</td><td><strong>4.27×</strong></td></tr>
</table>
<p class="dap-an">✅ Answer: inserting <strong>128 bytes of padding that nothing ever reads</strong> made the program <strong>3.8 to 4.3 times faster</strong>. Nothing about the algorithm changed. The two threads never touched each other's data even once; MESI was simply bouncing one shared line back and forth between two cores — each write invalidating the other's copy, each next write taking a miss. Honest caveat, because it matters: compiled at <code>-O0</code> the same program shows only <strong>1.03–1.16×</strong>, because the un-optimised loop overhead swamps the memory cost. A benchmark can hide a real effect entirely; always report the compiler flags.</p>
<p class="pitfall">⚠️ Exam-and-life trap: two variables being "different variables" is a fact about your <em>source code</em>. Coherence is a fact about <em>cache lines</em>. Per-thread counters in an array — <code>long count[NTHREADS]</code> — are the textbook way to hit this by accident.</p>`,
        `<p class="y-chinh">🎯 Chính sách chiến thắng, và cũng là slide mà bốn chữ cái cuối cùng xuất hiện. Luật là <strong>nhiều kẻ đọc, nhưng mỗi lúc chỉ MỘT kẻ ghi</strong>; khi cần ghi thì <strong>mọi cache khác đang giữ dòng đó đều bị vô hiệu hoá</strong>.</p>
<table>
<tr><th>Câu của slide</th><th>Vì sao dựng như vậy</th></tr>
<tr><td><strong>Nhiều kẻ đọc, mỗi lúc chỉ một kẻ ghi</strong></td><td>Đúng kỷ luật readers–writer kinh điển, được cưỡng chế bằng mạch trên TỪNG dòng cache một cách độc lập.</td></tr>
<tr><td>Khi cần ghi, <strong>mọi cache khác của dòng đó bị vô hiệu hoá</strong></td><td>Rẻ hơn là đi cập nhật chúng: chỉ gửi một địa chỉ, không gửi dữ liệu. Mỗi cache kia chỉ việc lật một bit sang Invalid.</td></tr>
<tr><td>Bộ xử lý đang ghi sau đó có <strong>quyền truy cập độc quyền (RẺ) cho tới khi dòng đó bị bộ xử lý khác đòi</strong></td><td>Phần thưởng. Sau MỘT lần vô hiệu hoá, cả một tràng lệnh ghi vào dòng ấy không tốn gì trên bus nữa.</td></tr>
<tr><td><strong>Được dùng rộng rãi nhất trong các hệ đa xử lý thương mại, chẳng hạn kiến trúc x86</strong></td><td>Phán quyết của thị trường. Đây là thứ nằm trong máy của bạn.</td></tr>
<tr><td>Trạng thái mỗi dòng được đánh dấu là <strong>modified, exclusive, shared hoặc invalid</strong> — vì thế giao thức write-invalidate được gọi là <strong>MESI</strong></td><td>Cái tên chỉ đơn giản là chữ cái đầu của bốn trạng thái.</td></tr>
</table>
<ul>
<li><strong>Vì sao vô hiệu hoá thắng cập nhật, gói trong một câu.</strong> Một lệnh ghi điển hình thường kéo theo nhiều lệnh ghi nữa vào cùng dòng, bởi cùng một bộ xử lý (tính cục bộ thời gian, Ch.4). Vô hiệu hoá trả phí bus <em>MỘT LẦN</em> rồi chạy miễn phí; cập nhật thì phải quảng bá trên <em>TỪNG lệnh ghi</em>, mãi mãi. Vô hiệu hoá tối ưu cho trường hợp phổ biến.</li>
<li><strong>Đơn vị là DÒNG chứ không phải BIẾN — và đó là chỗ đẻ ra "chia sẻ giả".</strong> Phần cứng vô hiệu hoá nguyên cả dòng cache (64 byte trên x86, <strong>128 byte trên chip Apple</strong>). Nếu hai lõi ghi vào hai biến <em>KHÁC NHAU</em> nhưng tình cờ nằm cùng một dòng, thì mỗi lệnh ghi lại vô hiệu hoá bản sao của lõi kia. Chương trình về mặt logic chẳng dùng chung gì; phần cứng thì thấy chúng dùng chung tất cả.</li>
<li><strong>ĐO THẬT trên chính cái máy viết bài này</strong> (Apple M1 Max, 10 nhân, <code>hw.cachelinesize</code> = 128 byte, Apple clang, <code>cc -O1 -pthread</code>). Hai luồng, mỗi luồng tăng biến đếm của riêng mình 200 triệu lần; thứ duy nhất thay đổi giữa các lượt là KHOẢNG CÁCH giữa hai biến đếm:</li>
</ul>
<pre>typedef struct { volatile long a; volatile long b; } Gan;                /* cách 8 B   */
typedef struct { volatile long a; char pad[128]; volatile long b; } Xa;  /* cách 136 B */</pre>
<table>
<tr><th>Lượt</th><th>CÙNG dòng cache (cách 8 B)</th><th>KHÁC dòng cache (cách 136 B)</th><th>Chậm hơn</th></tr>
<tr><td>1</td><td>0,356 s</td><td>0,095 s</td><td><strong>3,76 lần</strong></td></tr>
<tr><td>2</td><td>0,317 s</td><td>0,077 s</td><td><strong>4,12 lần</strong></td></tr>
<tr><td>3</td><td>0,325 s</td><td>0,076 s</td><td><strong>4,27 lần</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án: chèn thêm <strong>128 byte đệm mà không ai đọc tới bao giờ</strong> làm chương trình <strong>nhanh lên 3,8 đến 4,3 lần</strong>. Thuật toán không đổi một chữ. Hai luồng chưa từng chạm vào dữ liệu của nhau lấy một lần; MESI chỉ đang ném qua ném lại MỘT dòng dùng chung giữa hai lõi — mỗi lệnh ghi vô hiệu hoá bản của bên kia, mỗi lệnh ghi kế tiếp lại trượt cache. Lưu ý trung thực, vì nó quan trọng: biên dịch ở <code>-O0</code> thì cùng chương trình đó chỉ chênh <strong>1,03–1,16 lần</strong>, do chi phí vòng lặp chưa tối ưu nuốt mất phần chi phí bộ nhớ. Một phép đo có thể GIẤU BIỆT một hiệu ứng có thật; luôn luôn ghi rõ cờ biên dịch.</p>
<p class="pitfall">⚠️ Bẫy vừa trong đề vừa trong đời: chuyện hai biến là "hai biến khác nhau" là sự thật về <em>MÃ NGUỒN</em> của bạn. Còn nhất quán là sự thật về <em>DÒNG CACHE</em>. Mảng biến đếm theo luồng — <code>long count[NTHREADS]</code> — là cách kinh điển để dính bẫy này một cách vô tình.</p>`],

      [17, 'Write Update (write broadcast)',
        `<p class="y-chinh">🎯 The alternative policy, and the mirror image of slide 16. Instead of throwing the other copies away, you <strong>send them the new value</strong>. The slide states it in three lines, and the third line is the one people forget.</p>
<table>
<tr><th>The slide's three statements</th><th>Consequence</th></tr>
<tr><td><strong>Can be multiple readers and writers</strong></td><td>Contrast with slide 16's "only one writer at a time". Nobody has to be invalidated, so several caches can hold a valid, up-to-date copy while writes are happening.</td></tr>
<tr><td>When a processor wishes to update a shared line, <strong>the word to be updated is distributed to all others</strong> and caches containing that line can update it</td><td>Note: the <em>word</em> travels on the bus, not just the address. More data per transaction than an invalidate.</td></tr>
<tr><td><strong>Some systems use an adaptive mixture of both</strong> write-invalidate and write-update mechanisms</td><td>Real hardware is not obliged to pick one forever — it can measure the sharing pattern per line and switch.</td></tr>
</table>
<table>
<tr><th></th><th>Write invalidate (slide 16)</th><th>Write update (slide 17)</th></tr>
<tr><td>On a write, the bus carries…</td><td>just the address</td><td>the address <em>and</em> the new data word</td></tr>
<tr><td>Other caches…</td><td>mark the line Invalid</td><td>overwrite their copy and stay valid</td></tr>
<tr><td>A burst of writes by one processor costs…</td><td>one transaction, then free</td><td>one transaction <em>per write</em></td></tr>
<tr><td>The other processor's next read costs…</td><td>a miss (it must re-fetch)</td><td>a hit (it already has the value)</td></tr>
<tr><td>Best when…</td><td>one processor writes repeatedly, others rarely read (<em>migratory</em> data)</td><td>one processor writes, others read the value promptly every time (<em>producer–consumer</em>)</td></tr>
</table>
<ul>
<li><strong>Neither policy is universally better, and that is the exam answer.</strong> It depends entirely on the sharing pattern. Invalidate wins on write-heavy private-ish data; update wins on a producer–consumer flag that a consumer is spinning on. Because the first pattern is far more common, invalidate is what shipped.</li>
<li><strong>The hidden cost of update is useless traffic.</strong> Update keeps broadcasting to caches that may never read that line again — a thread that has migrated away, a core that finished with the data. Every one of those broadcasts is bus bandwidth spent on nobody, and slide 15 already warned that bus traffic is what kills snooping.</li>
<li><strong>"Adaptive mixture" is how real chips resolve it.</strong> A controller can start in update mode and switch a line to invalidate after it notices n consecutive updates that nobody consumed. This is a run-time decision about a run-time property — exactly the argument slide 13 made for hardware over compile-time software.</li>
<li><strong>Note the naming.</strong> Write-update is also called <strong>write-broadcast</strong>, and protocols built on it have their own names (Firefly, Dragon). Only the write-invalidate family gets called MESI, so if a question mentions MESI it is by definition talking about invalidation.</li>
</ul>
<p class="meo">💡 One image: invalidate is <strong>"tear up your copy, come and ask me when you need it"</strong>; update is <strong>"here is the correction, paste it into your copy now"</strong>. Tearing up is cheap; posting corrections to everyone forever is not.</p>`,
        `<p class="y-chinh">🎯 Chính sách thay thế, là hình ảnh soi gương của slide 16. Thay vì vứt các bản sao kia đi, bạn <strong>GỬI CHO CHÚNG GIÁ TRỊ MỚI</strong>. Slide nói bằng ba dòng, và dòng thứ ba là dòng người ta hay quên.</p>
<table>
<tr><th>Ba câu của slide</th><th>Hệ quả</th></tr>
<tr><td><strong>Có thể có NHIỀU kẻ đọc VÀ nhiều kẻ ghi</strong></td><td>Đối lập với "mỗi lúc chỉ một kẻ ghi" ở slide 16. Không ai phải bị vô hiệu hoá, nên nhiều cache cùng giữ bản sao hợp lệ và mới nhất trong lúc vẫn đang có lệnh ghi.</td></tr>
<tr><td>Khi một bộ xử lý muốn cập nhật một dòng dùng chung, <strong>TỪ cần cập nhật được phân phát tới mọi con khác</strong>, và cache nào đang chứa dòng đó thì cập nhật theo</td><td>Để ý: thứ chạy trên bus là <em>DỮ LIỆU</em>, chứ không chỉ địa chỉ. Mỗi giao dịch cõng nhiều dữ liệu hơn một lệnh vô hiệu hoá.</td></tr>
<tr><td><strong>Một số hệ dùng hỗn hợp THÍCH NGHI cả hai</strong> cơ chế write-invalidate và write-update</td><td>Phần cứng thật không bắt buộc phải chọn một cái mãi mãi — nó đo được kiểu dùng chung trên từng dòng rồi chuyển.</td></tr>
</table>
<table>
<tr><th></th><th>Write invalidate (slide 16)</th><th>Write update (slide 17)</th></tr>
<tr><td>Khi ghi, bus cõng theo…</td><td>chỉ địa chỉ</td><td>địa chỉ <em>VÀ</em> từ dữ liệu mới</td></tr>
<tr><td>Các cache khác…</td><td>đánh dấu dòng là Invalid</td><td>ghi đè bản của mình và vẫn hợp lệ</td></tr>
<tr><td>Một tràng lệnh ghi của một bộ xử lý tốn…</td><td>một giao dịch, rồi miễn phí</td><td>một giao dịch <em>MỖI LẦN GHI</em></td></tr>
<tr><td>Lần đọc kế tiếp của bộ xử lý kia tốn…</td><td>một lần trượt (phải nạp lại)</td><td>một lần trúng (đã có sẵn giá trị)</td></tr>
<tr><td>Hợp nhất khi…</td><td>một bộ xử lý ghi đi ghi lại, các con khác hiếm khi đọc (dữ liệu <em>DI TRÚ</em>)</td><td>một bộ xử lý ghi, các con khác đọc ngay giá trị đó mỗi lần (<em>sản xuất – tiêu thụ</em>)</td></tr>
</table>
<ul>
<li><strong>Không chính sách nào tốt hơn một cách phổ quát, và đó chính là đáp án thi.</strong> Nó phụ thuộc hoàn toàn vào KIỂU DÙNG CHUNG. Vô hiệu hoá thắng với dữ liệu ghi nhiều và gần như riêng tư; cập nhật thắng với một cờ sản xuất–tiêu thụ mà bên tiêu thụ đang quay vòng chờ. Vì kiểu thứ nhất phổ biến hơn hẳn nên vô hiệu hoá là thứ được đem đi bán.</li>
<li><strong>Chi phí ẩn của cập nhật là LƯU LƯỢNG VÔ ÍCH.</strong> Cập nhật cứ quảng bá tới những cache có khi chẳng bao giờ đọc dòng đó nữa — một luồng đã bị chuyển sang lõi khác, một lõi đã xong việc với dữ liệu đó. Mỗi cú quảng bá như vậy là băng thông bus tiêu cho hư không, mà slide 15 đã cảnh báo rằng lưu lượng bus chính là thứ giết chết nghe lén.</li>
<li><strong>"Hỗn hợp thích nghi" là cách chip thật xử lý.</strong> Bộ điều khiển có thể bắt đầu ở chế độ cập nhật rồi chuyển một dòng sang vô hiệu hoá sau khi thấy n lần cập nhật liên tiếp mà chẳng ai tiêu thụ. Đây là quyết định lúc CHẠY về một tính chất lúc CHẠY — đúng cái lý lẽ mà slide 13 đưa ra để chọn phần cứng thay vì phần mềm lúc biên dịch.</li>
<li><strong>Chú ý tên gọi.</strong> Write-update còn được gọi là <strong>write-broadcast</strong>, và các giao thức dựng trên nó có tên riêng (Firefly, Dragon). Chỉ họ write-invalidate mới được gọi là MESI, nên nếu đề nhắc MESI thì theo định nghĩa nó đang nói về vô hiệu hoá.</li>
</ul>
<p class="meo">💡 Một hình ảnh: vô hiệu hoá là <strong>"xé bản sao của anh đi, cần thì sang hỏi tôi"</strong>; cập nhật là <strong>"đây là bản đính chính, dán ngay vào bản sao của anh"</strong>. Xé thì rẻ; gửi đính chính cho tất cả mọi người mãi mãi thì không.</p>`],

      [18, 'MESI Protocol — the four states defined',
        `<p class="y-chinh">🎯 The definitions, in the slide's own words: <strong>to provide cache consistency on an SMP the data cache supports a protocol known as MESI</strong>. Every cache line carries <strong>two extra bits</strong> encoding which of these four states it is in.</p>
<table>
<tr><th>State</th><th>The slide's definition, word for word</th></tr>
<tr><td><strong>M — Modified</strong></td><td>The line in the cache <strong>has been modified</strong> and is <strong>available only in this cache</strong></td></tr>
<tr><td><strong>E — Exclusive</strong></td><td>The line in the cache is <strong>the same as that in main memory</strong> and is <strong>not present in any other cache</strong></td></tr>
<tr><td><strong>S — Shared</strong></td><td>The line in the cache is <strong>the same as that in main memory</strong> and <strong>may be present in another cache</strong></td></tr>
<tr><td><strong>I — Invalid</strong></td><td>The line in the cache <strong>does not contain valid data</strong></td></tr>
</table>
<ul>
<li><strong>Read the four definitions as answers to two independent yes/no questions.</strong> Question A: <em>is my copy different from main memory?</em> Question B: <em>might anyone else have a copy?</em> M = dirty and alone. E = clean and alone. S = clean and possibly shared. I = nothing here. Once you see it as a 2×2 grid, the table of slide 19 writes itself.</li>
<li><strong>E is the state students always ask about — why bother?</strong> Because of what it makes cheap. If you read a line nobody else has, you get E; if you then write it, you go straight to M <strong>with no bus transaction at all</strong>, because there is provably nobody to invalidate. Without E you would have to conservatively call it S and pay for a pointless invalidate broadcast on your first write. E exists purely to make the common "private data" case free.</li>
<li><strong>Note the exact words "may" and "not present".</strong> E asserts <em>certainty</em> — not present in any other cache. S only says <em>may</em> be present in another cache. The protocol is allowed to be pessimistic about S (a line can stay S after the other sharer evicts it) but never about E, because E licenses a silent write.</li>
<li><strong>The two invariants worth memorising, both implied by these definitions.</strong> (1) At most one cache may hold a given line in <strong>M or E</strong> at any time. (2) If any cache holds it in M, then main memory is <strong>stale</strong> and no other cache holds it at all. Any answer to an exam MESI table that violates either invariant is wrong, and you can check your own work with them.</li>
<li><strong>Connect to Chapter 5's write policy.</strong> MESI is fundamentally a <strong>write-back</strong> design: state M means "I have the only correct copy and memory is out of date", which is precisely a dirty write-back line. The dirty bit you met in Ch.5 has been promoted to a two-bit state machine that also tracks other caches.</li>
</ul>
<p class="meo">💡 Four-word hook: <strong>M = mine and dirty · E = mine and clean · S = ours · I = nothing</strong>.</p>`,
        `<p class="y-chinh">🎯 Phần định nghĩa, đúng chữ của slide: <strong>để bảo đảm nhất quán cache trên một SMP, cache dữ liệu hỗ trợ một giao thức gọi là MESI</strong>. Mỗi dòng cache mang thêm <strong>HAI bit</strong> mã hoá xem nó đang ở trạng thái nào trong bốn trạng thái này.</p>
<table>
<tr><th>Trạng thái</th><th>Định nghĩa của slide, từng chữ</th></tr>
<tr><td><strong>M — Modified</strong> (đã sửa)</td><td>Dòng trong cache <strong>ĐÃ BỊ SỬA</strong> và <strong>chỉ có mặt ở CACHE NÀY</strong></td></tr>
<tr><td><strong>E — Exclusive</strong> (độc quyền)</td><td>Dòng trong cache <strong>GIỐNG HỆT bản trong bộ nhớ chính</strong> và <strong>KHÔNG có mặt ở bất kỳ cache nào khác</strong></td></tr>
<tr><td><strong>S — Shared</strong> (dùng chung)</td><td>Dòng trong cache <strong>GIỐNG HỆT bản trong bộ nhớ chính</strong> và <strong>CÓ THỂ có mặt ở một cache khác</strong></td></tr>
<tr><td><strong>I — Invalid</strong> (vô hiệu)</td><td>Dòng trong cache <strong>KHÔNG chứa dữ liệu hợp lệ</strong></td></tr>
</table>
<ul>
<li><strong>Hãy đọc bốn định nghĩa như đáp án cho HAI câu hỏi có/không độc lập.</strong> Câu A: <em>bản của tôi có khác bộ nhớ chính không?</em> Câu B: <em>liệu có ai khác đang giữ bản sao không?</em> M = bẩn và một mình. E = sạch và một mình. S = sạch và có thể có bạn. I = ở đây chẳng có gì. Một khi nhìn ra nó là lưới 2×2 thì bảng ở slide 19 tự viết ra.</li>
<li><strong>E là trạng thái sinh viên luôn thắc mắc — bày ra làm gì?</strong> Vì thứ nó làm cho RẺ. Nếu bạn đọc một dòng mà chẳng ai khác có, bạn nhận E; rồi nếu bạn ghi vào nó, bạn nhảy thẳng sang M <strong>mà KHÔNG tốn một giao dịch bus nào</strong>, vì chứng minh được là chẳng có ai để mà vô hiệu hoá. Không có E thì bạn buộc phải thận trọng gọi nó là S và trả tiền cho một cú quảng bá vô hiệu hoá vô nghĩa ở lần ghi đầu tiên. E sinh ra thuần tuý để làm trường hợp phổ biến "dữ liệu riêng" thành miễn phí.</li>
<li><strong>Để ý đúng hai chữ "CÓ THỂ" và "KHÔNG có mặt".</strong> E khẳng định <em>CHẮC CHẮN</em> — không có mặt ở bất kỳ cache nào khác. Còn S chỉ nói <em>CÓ THỂ</em> có mặt ở cache khác. Giao thức được phép bi quan về S (một dòng vẫn có thể ở S sau khi kẻ dùng chung kia đã đẩy nó ra) nhưng không bao giờ được bi quan về E, vì E cấp phép cho một lệnh ghi im lặng.</li>
<li><strong>Hai bất biến đáng thuộc, cả hai đều suy ra từ mấy định nghĩa này.</strong> (1) Tại mọi thời điểm, nhiều nhất MỘT cache được giữ một dòng ở trạng thái <strong>M hoặc E</strong>. (2) Nếu có cache nào giữ nó ở M thì bộ nhớ chính đang <strong>LỖI THỜI</strong> và không cache nào khác giữ nó cả. Bài thi nào điền bảng MESI mà vi phạm một trong hai bất biến này là sai, và bạn có thể tự soát bài mình bằng chúng.</li>
<li><strong>Nối sang chính sách ghi của Chương 5.</strong> MESI về căn bản là một thiết kế <strong>WRITE-BACK</strong>: trạng thái M nghĩa là "tôi giữ bản đúng duy nhất và bộ nhớ đã lỗi thời", chính xác là một dòng write-back bẩn. Cái bit dirty bạn gặp ở Ch.5 nay được thăng cấp thành một máy trạng thái hai bit, biết theo dõi cả những cache khác.</li>
</ul>
<p class="meo">💡 Móc nhớ bốn chữ: <strong>M = của tôi và bẩn · E = của tôi và sạch · S = của chúng ta · I = không có gì</strong>.</p>`],

      [19, 'Table 20.1 — MESI Cache Line States (and a full worked three-processor trace)',
        `<p class="y-chinh">🎯 The single most examinable object in the chapter: four states × four questions. Learn this table and you can answer any MESI question by lookup instead of by reasoning.</p>
<table>
<tr><th></th><th><strong>M</strong> Modified</th><th><strong>E</strong> Exclusive</th><th><strong>S</strong> Shared</th><th><strong>I</strong> Invalid</th></tr>
<tr><td><strong>This cache line valid?</strong></td><td>Yes</td><td>Yes</td><td>Yes</td><td><strong>No</strong></td></tr>
<tr><td><strong>The memory copy is …</strong></td><td><strong>out of date</strong></td><td>valid</td><td>valid</td><td>–</td></tr>
<tr><td><strong>Copies exist in other caches?</strong></td><td>No</td><td>No</td><td>Maybe</td><td>Maybe</td></tr>
<tr><td><strong>A write to this line …</strong></td><td>does not go to bus</td><td>does not go to bus</td><td>goes to bus and updates cache</td><td>goes directly to bus</td></tr>
</table>
<ul>
<li><strong>Row 2 has exactly one interesting cell.</strong> Only under M is main memory out of date. That single fact is why a snooping cache in state M must intervene on somebody else's read — memory alone would hand out a stale value.</li>
<li><strong>Row 4 is the row the exam actually tests.</strong> Writing costs a bus transaction in exactly two states — S (must invalidate the others first) and I (a write miss, RWITM). In M and E it is free, which is the entire economic argument for having E at all.</li>
<li><strong>Row 3 explains the "Maybe" for I.</strong> An invalid line holds no data, so this cache genuinely does not know and does not care whether others have it. Do not mark that cell "No".</li>
</ul>
<p class="nhan">📌 Worked trace — the classic exam question. Three processors P1, P2, P3, all caches initially Invalid for one line X. Sequence: <strong>P1 reads · P2 reads · P1 writes · P3 reads · P3 writes · P2 reads · P2 writes · P1 reads</strong>. The table below was produced by <strong>running a MESI simulator written for this lesson</strong>, not by hand reasoning.</p>
<table>
<tr><th>Step</th><th>Operation</th><th>P1</th><th>P2</th><th>P3</th><th>What happens on the bus</th></tr>
<tr><td>0</td><td>initial state</td><td>I</td><td>I</td><td>I</td><td>—</td></tr>
<tr><td>1</td><td>P1 reads X</td><td><strong>E</strong></td><td>I</td><td>I</td><td>Read miss; no other cache responds ⇒ RME, P1 gets it Exclusive</td></tr>
<tr><td>2</td><td>P2 reads X</td><td>S</td><td><strong>S</strong></td><td>I</td><td>Read miss; P1 snoop-hits on read (SHR) and drops E→S; P2 loads as Shared (RMS)</td></tr>
<tr><td>3</td><td>P1 writes X</td><td><strong>M</strong></td><td>I</td><td>I</td><td>Write hit on S ⇒ P1 broadcasts an invalidate; P2 goes S→I; P1 goes S→M</td></tr>
<tr><td>4</td><td>P3 reads X</td><td>S</td><td>I</td><td><strong>S</strong></td><td>Read miss; P1 holds M, so it <strong>copies back</strong> the dirty line and goes M→S; P3 loads Shared</td></tr>
<tr><td>5</td><td>P3 writes X</td><td>I</td><td>I</td><td><strong>M</strong></td><td>Write hit on S ⇒ invalidate; P1 goes S→I; P3 goes S→M</td></tr>
<tr><td>6</td><td>P2 reads X</td><td>I</td><td><strong>S</strong></td><td>S</td><td>Read miss; P3 holds M ⇒ copyback, P3 goes M→S; P2 loads Shared</td></tr>
<tr><td>7</td><td>P2 writes X</td><td>I</td><td><strong>M</strong></td><td>I</td><td>Write hit on S ⇒ invalidate; P3 goes S→I; P2 goes S→M</td></tr>
<tr><td>8</td><td>P1 reads X</td><td><strong>S</strong></td><td>S</td><td>I</td><td>Read miss; P2 holds M ⇒ copyback, P2 goes M→S; P1 loads Shared</td></tr>
</table>
<p class="dap-an">✅ Answer, and how to check it without trusting anybody: apply the two invariants of slide 18 to every single row. (1) <strong>At most one M or E in any row</strong> — true at every step. (2) <strong>Whenever some cache is M, every other cache is I</strong> — check rows 3, 5, 7: yes, yes, yes. Also note the recurring pattern: a write by a processor holding S always costs an invalidate, and a read by anyone while another cache is M always forces a dirty copyback. Steps 4, 6 and 8 are three instances of the same event, which is what makes this question mechanical once you spot it.</p>
<p class="pitfall">⚠️ The three mistakes that lose marks. (1) Leaving a cache in <strong>S while another is M</strong> — impossible. (2) Giving a processor <strong>E after a second processor has read the line</strong> — the first reader must drop to S. (3) Forgetting the <strong>copyback</strong> at steps 4, 6 and 8: the M holder does not just change state, it must write the dirty line out, otherwise the reader would get a stale value from memory.</p>`,
        `<p class="y-chinh">🎯 Vật thể ra đề nhiều nhất của cả chương: bốn trạng thái × bốn câu hỏi. Thuộc cái bảng này là bạn trả lời được mọi câu MESI bằng cách TRA BẢNG thay vì ngồi suy luận.</p>
<table>
<tr><th></th><th><strong>M</strong> Modified</th><th><strong>E</strong> Exclusive</th><th><strong>S</strong> Shared</th><th><strong>I</strong> Invalid</th></tr>
<tr><td><strong>Dòng cache này có hợp lệ không?</strong></td><td>Có</td><td>Có</td><td>Có</td><td><strong>Không</strong></td></tr>
<tr><td><strong>Bản trong bộ nhớ thì …</strong></td><td><strong>đã lỗi thời</strong></td><td>hợp lệ</td><td>hợp lệ</td><td>–</td></tr>
<tr><td><strong>Có bản sao ở cache khác không?</strong></td><td>Không</td><td>Không</td><td>Có thể</td><td>Có thể</td></tr>
<tr><td><strong>Một lệnh GHI vào dòng này thì …</strong></td><td>KHÔNG lên bus</td><td>KHÔNG lên bus</td><td>lên bus và cập nhật cache</td><td>đi thẳng lên bus</td></tr>
</table>
<ul>
<li><strong>Hàng 2 chỉ có đúng MỘT ô đáng chú ý.</strong> Chỉ dưới trạng thái M thì bộ nhớ chính mới lỗi thời. Đúng một sự thật đó là lý do một cache đang nghe lén ở trạng thái M buộc phải CAN THIỆP khi kẻ khác đọc — để mặc bộ nhớ trả lời thì nó sẽ phát ra một giá trị ôi.</li>
<li><strong>Hàng 4 mới là hàng đề thi thật sự hỏi.</strong> Ghi tốn một giao dịch bus ở đúng hai trạng thái — S (phải vô hiệu hoá bọn kia trước) và I (trượt khi ghi, RWITM). Ở M và E thì miễn phí, và đó là toàn bộ lý lẽ kinh tế cho việc bày ra trạng thái E.</li>
<li><strong>Hàng 3 giải thích chữ "Có thể" ở cột I.</strong> Một dòng vô hiệu thì không chứa dữ liệu, nên cache này thật sự KHÔNG BIẾT và cũng không quan tâm kẻ khác có hay không. Đừng điền ô đó là "Không".</li>
</ul>
<p class="nhan">📌 Bài chạy tay — đúng dạng câu hỏi thi. Ba bộ xử lý P1, P2, P3, mọi cache ban đầu đều Invalid với một dòng X. Chuỗi thao tác: <strong>P1 đọc · P2 đọc · P1 ghi · P3 đọc · P3 ghi · P2 đọc · P2 ghi · P1 đọc</strong>. Bảng dưới đây do <strong>một chương trình mô phỏng MESI viết riêng cho bài này CHẠY RA</strong>, không phải suy luận bằng tay.</p>
<table>
<tr><th>Bước</th><th>Thao tác</th><th>P1</th><th>P2</th><th>P3</th><th>Trên bus xảy ra gì</th></tr>
<tr><td>0</td><td>trạng thái đầu</td><td>I</td><td>I</td><td>I</td><td>—</td></tr>
<tr><td>1</td><td>P1 đọc X</td><td><strong>E</strong></td><td>I</td><td>I</td><td>Trượt khi đọc; không cache nào đáp ⇒ RME, P1 nhận về trạng thái Exclusive</td></tr>
<tr><td>2</td><td>P2 đọc X</td><td>S</td><td><strong>S</strong></td><td>I</td><td>Trượt khi đọc; P1 nghe lén trúng lệnh đọc (SHR) nên tụt E→S; P2 nạp về ở Shared (RMS)</td></tr>
<tr><td>3</td><td>P1 ghi X</td><td><strong>M</strong></td><td>I</td><td>I</td><td>Ghi trúng trên S ⇒ P1 quảng bá lệnh vô hiệu hoá; P2 chuyển S→I; P1 chuyển S→M</td></tr>
<tr><td>4</td><td>P3 đọc X</td><td>S</td><td>I</td><td><strong>S</strong></td><td>Trượt khi đọc; P1 đang giữ M nên phải <strong>GHI NGƯỢC (copyback)</strong> dòng bẩn ra rồi tụt M→S; P3 nạp về Shared</td></tr>
<tr><td>5</td><td>P3 ghi X</td><td>I</td><td>I</td><td><strong>M</strong></td><td>Ghi trúng trên S ⇒ vô hiệu hoá; P1 chuyển S→I; P3 chuyển S→M</td></tr>
<tr><td>6</td><td>P2 đọc X</td><td>I</td><td><strong>S</strong></td><td>S</td><td>Trượt khi đọc; P3 đang M ⇒ ghi ngược, P3 tụt M→S; P2 nạp về Shared</td></tr>
<tr><td>7</td><td>P2 ghi X</td><td>I</td><td><strong>M</strong></td><td>I</td><td>Ghi trúng trên S ⇒ vô hiệu hoá; P3 chuyển S→I; P2 chuyển S→M</td></tr>
<tr><td>8</td><td>P1 đọc X</td><td><strong>S</strong></td><td>S</td><td>I</td><td>Trượt khi đọc; P2 đang M ⇒ ghi ngược, P2 tụt M→S; P1 nạp về Shared</td></tr>
</table>
<p class="dap-an">✅ Đáp án, và cách tự soát mà không phải tin ai: đem hai bất biến ở slide 18 áp vào TỪNG hàng. (1) <strong>Mỗi hàng nhiều nhất MỘT ô M hoặc E</strong> — đúng ở mọi bước. (2) <strong>Hễ có cache nào ở M thì mọi cache khác đều phải là I</strong> — soát hàng 3, 5, 7: đúng, đúng, đúng. Cũng để ý cái khuôn lặp lại: một lệnh GHI của bộ xử lý đang giữ S luôn tốn một cú vô hiệu hoá, còn một lệnh ĐỌC của bất kỳ ai trong lúc cache khác đang M thì luôn ép ra một cú ghi ngược dòng bẩn. Bước 4, 6 và 8 là ba lần lặp của cùng một sự kiện — nhận ra điều đó là câu hỏi này thành máy móc.</p>
<p class="pitfall">⚠️ Ba lỗi làm mất điểm. (1) Để một cache ở <strong>S trong khi cache khác đang M</strong> — bất khả. (2) Cho một bộ xử lý giữ <strong>E sau khi bộ xử lý thứ hai đã đọc dòng đó</strong> — kẻ đọc đầu tiên buộc phải tụt xuống S. (3) Quên mất cú <strong>GHI NGƯỢC</strong> ở bước 4, 6 và 8: kẻ đang giữ M không chỉ đổi trạng thái, nó phải ghi dòng bẩn ra ngoài, nếu không kẻ đọc sẽ nhận giá trị ôi từ bộ nhớ.</p>`],

      [20, 'Figure 20.6 — MESI State Transition Diagram',
        `<p class="y-chinh">🎯 The protocol drawn as two state machines side by side, and the split is the whole point: <strong>(a) the line in the cache at the initiating processor</strong> — the one whose CPU made the request — and <strong>(b) the line in a snooping cache</strong> — one that merely overheard it. Same four states, different arrows, because doing something and being told about something are different events.</p>
<table>
<tr><th>Label on the figure</th><th>Meaning (from the figure's own legend)</th><th>Which machine</th></tr>
<tr><td><strong>RH</strong></td><td>Read hit</td><td>(a) initiator — self-loops on M, E and S</td></tr>
<tr><td><strong>RMS</strong></td><td>Read miss, shared</td><td>(a) I → S</td></tr>
<tr><td><strong>RME</strong></td><td>Read miss, exclusive</td><td>(a) I → E</td></tr>
<tr><td><strong>WH</strong></td><td>Write hit</td><td>(a) S → M, E → M, and a self-loop on M</td></tr>
<tr><td><strong>WM</strong></td><td>Write miss</td><td>(a) I → M</td></tr>
<tr><td><strong>SHR</strong></td><td>Snoop hit on read</td><td>(b) M → S, E → S, self-loop on S</td></tr>
<tr><td><strong>SHW</strong></td><td>Snoop hit on write, or read-with-intent-to-modify</td><td>(b) M → I, E → I, S → I</td></tr>
</table>
<p class="nhan">📌 The four circled symbols on the arrows say what the bus actually carries: <strong>⊕ invalidate transaction</strong> · <strong>⊗ read-with-intent-to-modify (RWITM)</strong> · <strong>⬆ cache line fill</strong> · <strong>⬇ dirty line copyback</strong>.</p>
<ul>
<li><strong>Panel (a) in one sentence: the initiator only ever moves "up" in privilege.</strong> Reads bring I to S or E; writes bring anything to M. Nothing in (a) ever demotes you, because your own processor's activity never takes rights away from you.</li>
<li><strong>Panel (b) in one sentence: the snooper only ever moves "down".</strong> SHR demotes M or E to S — somebody else wants to read, so you can no longer claim to be alone. SHW demotes everything to I — somebody else is writing, so your copy is dead. Being overheard costs you rights; it never grants any.</li>
<li><strong>The two most important arrows are the ones with the ⬇ copyback symbol</strong>, both leaving <strong>Modified</strong> in panel (b): M →(SHR) S and M →(SHW) I. They encode the rule that steps 4, 6 and 8 of the slide-19 trace kept hitting — if you are the only correct copy, you cannot silently step aside; you must first write the data back.</li>
<li><strong>Why I → E and I → S are two different arrows (RME versus RMS).</strong> On a read miss the cache must be <em>told</em> which one applies, and it learns this from a dedicated bus signal that other caches assert if they hold the line. No sharer speaks up ⇒ RME ⇒ E. Somebody does ⇒ RMS ⇒ S. Without that shared-line signal the E state could not exist at all.</li>
<li><strong>Where the two machines meet.</strong> Every arrow in (a) that puts a transaction on the bus is simultaneously an arrow in (b) for every other cache. P1's WH on a shared line is an ⊕ invalidate in (a), which is an SHW in (b) at P2 and P3. Reading the two diagrams together, one event at a time, is exactly the trace table of slide 19.</li>
</ul>
<p class="pitfall">⚠️ Exam trap that catches almost everyone: this is <strong>two</strong> diagrams, not one big one. If a question asks "what happens to processor 2's copy when processor 1 writes?", the answer must be read off panel <strong>(b)</strong> — P2 is the snooper in that sentence, not the initiator. Reading panel (a) gives you P1's side and a wrong answer.</p>`,
        `<p class="y-chinh">🎯 Giao thức được vẽ thành HAI máy trạng thái đặt cạnh nhau, và cú tách đôi đó chính là toàn bộ ý nghĩa: <strong>(a) dòng nằm trong cache của bộ xử lý KHỞI XƯỚNG</strong> — con vừa phát ra yêu cầu — và <strong>(b) dòng nằm trong cache ĐANG NGHE LÉN</strong> — con chỉ tình cờ nghe thấy. Vẫn bốn trạng thái ấy, nhưng mũi tên khác nhau, vì TỰ MÌNH LÀM và BỊ NGƯỜI KHÁC BÁO là hai loại sự kiện khác nhau.</p>
<table>
<tr><th>Nhãn trên hình</th><th>Nghĩa (theo đúng chú giải của hình)</th><th>Thuộc máy nào</th></tr>
<tr><td><strong>RH</strong></td><td>Read hit — đọc trúng</td><td>(a) khởi xướng — vòng lặp tại chỗ ở M, E và S</td></tr>
<tr><td><strong>RMS</strong></td><td>Read miss, shared — trượt khi đọc, có kẻ dùng chung</td><td>(a) I → S</td></tr>
<tr><td><strong>RME</strong></td><td>Read miss, exclusive — trượt khi đọc, độc quyền</td><td>(a) I → E</td></tr>
<tr><td><strong>WH</strong></td><td>Write hit — ghi trúng</td><td>(a) S → M, E → M, và vòng lặp tại chỗ ở M</td></tr>
<tr><td><strong>WM</strong></td><td>Write miss — trượt khi ghi</td><td>(a) I → M</td></tr>
<tr><td><strong>SHR</strong></td><td>Snoop hit on read — nghe lén trúng một lệnh đọc</td><td>(b) M → S, E → S, vòng lặp tại chỗ ở S</td></tr>
<tr><td><strong>SHW</strong></td><td>Snoop hit on write, hoặc read-with-intent-to-modify</td><td>(b) M → I, E → I, S → I</td></tr>
</table>
<p class="nhan">📌 Bốn ký hiệu khoanh tròn trên các mũi tên cho biết bus thật sự cõng cái gì: <strong>⊕ giao dịch vô hiệu hoá</strong> · <strong>⊗ đọc-với-ý-định-sửa (RWITM)</strong> · <strong>⬆ nạp đầy dòng cache</strong> · <strong>⬇ ghi ngược dòng bẩn</strong>.</p>
<ul>
<li><strong>Ô (a) gói trong một câu: kẻ khởi xướng chỉ đi LÊN về quyền.</strong> Lệnh đọc đưa I lên S hoặc E; lệnh ghi đưa mọi thứ lên M. Trong (a) không có gì hạ cấp bạn, vì hoạt động của chính bộ xử lý nhà không bao giờ tước quyền của bạn.</li>
<li><strong>Ô (b) gói trong một câu: kẻ nghe lén chỉ đi XUỐNG.</strong> SHR hạ M hoặc E xuống S — có kẻ khác muốn đọc, nên bạn hết quyền vỗ ngực là mình một mình. SHW hạ mọi thứ xuống I — có kẻ khác đang ghi, nên bản sao của bạn chết. Bị nghe thấy thì chỉ MẤT quyền, không bao giờ được thêm quyền nào.</li>
<li><strong>Hai mũi tên quan trọng nhất là hai mũi tên mang ký hiệu ⬇ ghi ngược</strong>, cả hai đều rời khỏi <strong>Modified</strong> trong ô (b): M →(SHR) S và M →(SHW) I. Chúng mã hoá đúng cái luật mà bước 4, 6 và 8 của bảng chạy tay ở slide 19 cứ va vào — nếu bạn là bản đúng duy nhất thì bạn không được lặng lẽ tránh sang bên; bạn phải ghi dữ liệu ra trước đã.</li>
<li><strong>Vì sao I → E và I → S là HAI mũi tên khác nhau (RME so với RMS).</strong> Khi trượt cache lúc đọc, cache phải được <em>BÁO CHO BIẾT</em> rơi vào ca nào, và nó biết nhờ một đường tín hiệu bus riêng mà các cache khác kéo lên nếu chúng đang giữ dòng đó. Không ai lên tiếng ⇒ RME ⇒ E. Có kẻ lên tiếng ⇒ RMS ⇒ S. Không có cái tín hiệu "dòng này đang dùng chung" đó thì trạng thái E không thể tồn tại.</li>
<li><strong>Hai cái máy gặp nhau ở đâu.</strong> Mọi mũi tên trong (a) mà đẩy một giao dịch lên bus thì đồng thời là một mũi tên trong (b) của MỌI cache khác. Cú WH của P1 trên một dòng đang Shared là một ⊕ vô hiệu hoá trong (a), và chính nó là một SHW trong (b) tại P2 và P3. Đọc hai sơ đồ CÙNG LÚC, mỗi lần một sự kiện, thì ra đúng cái bảng chạy tay ở slide 19.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi tóm được gần như tất cả mọi người: đây là <strong>HAI</strong> sơ đồ chứ không phải một sơ đồ to. Nếu đề hỏi "bản sao của bộ xử lý 2 ra sao khi bộ xử lý 1 ghi?", đáp án phải đọc ở ô <strong>(b)</strong> — trong câu đó P2 là kẻ NGHE LÉN, không phải kẻ khởi xướng. Đọc ở ô (a) là bạn đang lấy phía của P1 và trả lời sai.</p>`],

    ]),
  ].join('\n'),
};
