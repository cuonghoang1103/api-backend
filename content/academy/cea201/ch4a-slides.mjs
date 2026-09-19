/**
 * CEA201 · Chương 4 (bản 11e) — The Memory Hierarchy: Locality and Performance,
 * học theo từng slide (slide 1–29, trọn deck 'cea4').
 *
 * ⚠️ ĐÁNH SỐ: syllabus của trường đánh theo bản 9th ed và gọi phần này là
 * "Chapter 4: Cache Memory". Bản 11th ed TÁCH đôi: Ch.4 = nền (phân cấp bộ nhớ,
 * tính cục bộ, mô hình hiệu năng), Ch.5 = cache thật sự. Deck này là Ch.4 —
 * KHÔNG có ánh xạ cache, không có thay thế dòng, không có write-back.
 * Đọc thêm: _slides.mjs, bảng quy đổi syllabus ↔ deck.
 *
 * Nội dung bám ĐÚNG chữ trích từ CH04-COA11e.pptx (/tmp/cea201-text/cea4.txt).
 * Slide chỉ có tiêu đề + hình/bảng (4, 5, 6, 7, 8, 9, 11, 12, 15, 16, 17, 18,
 * 19, 21, 22, 25, 26, 27, 28) đã được ĐỌC THẲNG TỪ ẢNH render để lấy đúng từng
 * nhãn trên sơ đồ.
 *
 * ⚠️ MỌI con số trong bài đã kiểm bằng python3 TRƯỚC khi viết:
 *   · T_s = T1 + (1−H)×T2 với T1 = 1 ns, T2 = 100 ns cho H = 0 · 0,5 · 0,9 ·
 *     0,95 · 0,99 · 0,999 · 1 → 101 · 51 · 11 · 6 · 2 · 1,1 · 1 ns. Kiểm cả hai
 *     dạng công thức (dạng gộp H×T1 + (1−H)×(T1+T2) cho cùng kết quả).
 *   · Bài ngược: T ≤ 2 ns ⇒ H ≥ 0,99;  T ≤ 1,5 ns ⇒ H ≥ 0,995.
 *   · Ba mức t1/t2/t3 = 1/10/100 ns, h1 = 0,90, h2 = 0,95 → 2,5 ns. Kiểm bằng
 *     HAI đường (lồng nhau và tổng xác suất toàn cục) — khớp.
 *   · Cs = (C1·S1 + C2·S2)/(S1+S2). ĐỐI CHIẾU CHÉO với Figure 4.11 (slide 25):
 *     tại S2/S1 = 8 → Cs/C2 = 112 · 12 · 2 cho C1/C2 = 1000 · 100 · 10;
 *     tại S2/S1 = 1000 → 1,998 · 1,099 · 1,009. Khớp đúng ba đường trên hình.
 *   · Hiệu suất truy cập 1/(1+r) tại H = 0 → 0,5 · 0,0909 · 0,0099 · 0,000999
 *     cho r = 1 · 10 · 100 · 1000 — khớp đúng bốn điểm cắt trục của Figure 4.12.
 *
 * ⚠️ PHÉP ĐO THẬT (chạy trên chính máy viết bài — Apple M1 Max, Apple clang 17,
 * biên dịch cc -O2; mã nguồn in nguyên trong bài):
 *   · Duyệt ma trận double 4096×4096 (128 MB): theo HÀNG 0,019–0,033 s, theo CỘT
 *     0,065–0,073 s → CỘT chậm hơn 2,2–3,5 lần. Với 8192×8192 (512 MB): 0,074 s
 *     so với 0,250 s → 3,4 lần. Lặp 5 lượt.
 *   · Đuổi con tro vòng ngẫu nhiên (bước 64 B, phụ thuộc chuỗi nên đo ĐÚNG độ
 *     trễ): 16 kB → 1,29 ns · 64 kB → 1,29 ns · 512 kB → 5,6–6,1 ns ·
 *     4 MB → 7,6–8,0 ns · 32 MB → 101–105 ns · 256 MB → 129 ns. Phân cấp bộ nhớ
 *     hiện ra thành số. Tỉ số RAM/L1 = 129,3/1,29 = 100,2 ⇒ máy này có r ≈ 100,
 *     ĐÚNG đường r = 100 của Figure 4.12.
 *   · Phép đo đầu tiên thử bằng cách CỘNG TUẦN TỰ mảng nhỏ so với mảng lớn thì
 *     KHÔNG thấy chênh (0,96 so với 0,99 ns/phép) — bộ nạp trước đoán đúng bước
 *     đều. Đã nêu thẳng chuyện này trong bài (slide 5) thay vì giấu đi.
 *
 * Chỗ slide gốc LẶP/THIẾU — nêu rõ, không im lặng chép, không tự sửa slide:
 *   · slide 3: dòng "Spatial locality" xuất hiện HAI LẦN liên tiếp trong bản
 *     trích (lỗi lặp của chính file .pptx), không phải hai loại khác nhau.
 *   · slide 12 tiêu đề cụt: "Capacity and Performance:" — vế sau nằm trong khối
 *     thân slide ("The two most important characteristics of memory").
 *   · slide 13 và slide 20 đều chỉ có tiêu đề "Memory" — hai slide khác hẳn nhau.
 *   · slide 19 (Table 4.2): ô "Unit of transfer" của dòng "Offline bulk memory"
 *     BỎ TRỐNG trên slide gốc.
 *   · Toàn bộ CÔNG THỨC của chương (T_s, Cs, mô hình nhiều mức) KHÔNG in trên
 *     slide nào — slide chỉ vẽ ĐỒ THỊ của chúng (Fig 4.8, 4.11, 4.12, 4.13).
 *     Công thức lấy từ sách, mục 4.3. Bài này nói rõ chỗ nào là slide, chỗ nào
 *     là sách.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea4';

export default {
  title: '4.0a — Slide by slide: Locality, memory system characteristics and the hierarchy (29 slides)|||4.0a — Slide bài giảng: Tính cục bộ, đặc tính hệ thống nhớ & phân cấp bộ nhớ (29 slide)',
  slug: 'cea201-4-0a-slides-phan-cap-bo-nho-locality',
  type: 'DOCUMENT',
  description: 'Trọn Chương 4 bản 11e của CEA201 (29 slide) — chương NỀN của cả khối bộ nhớ, học trước cache. Đi từ nguyên lý cục bộ (temporal và spatial, có mã C và PHÉP ĐO THẬT trên máy), qua bảy đặc tính của một hệ thống nhớ (vị trí, dung lượng, đơn vị truyền, phương pháp truy cập, hiệu năng, kiểu vật lý, tổ chức), tới ba trục đánh đổi dung lượng · tốc độ · giá và hình tháp phân cấp, rồi kết bằng bộ công thức đề thi hay hỏi nhất: thời gian truy cập trung bình hai mức T = T1 + (1−H)×T2, mở rộng ba mức, giá trung bình mỗi bit Cs = (C1·S1 + C2·S2)/(S1+S2), hiệu suất truy cập theo tỉ số r = T2/T1. Mọi con số đã kiểm bằng máy và đối chiếu chéo với chính đồ thị của sách.',
  content: [
    walkHead(D, 1, 29),
    walk(D, [

      [1, 'Chapter 4 — The Memory Hierarchy: Locality and Performance (title slide)',
        `<p class="y-chinh">🎯 The opening slide of the chapter that answers one question: <strong>why does a computer have five kinds of memory instead of one good one?</strong> The answer is a physical fact (no technology is fast, big and cheap at once) plus a behavioural fact (programs do not touch memory uniformly).</p>
<ul>
<li><strong>Numbering warning, read this first.</strong> Your syllabus follows the 9th edition and calls this block "Chapter 4: Cache Memory". The 11th edition <em>split</em> it: <strong>Ch.4 is the foundation</strong> — locality, memory characteristics, the hierarchy, the performance model — and <strong>Ch.5 is cache itself</strong> (mapping, replacement, write policy). Nothing about cache line mapping appears in this deck. Do not go looking for it here.</li>
<li><strong>The chapter has three movements.</strong> Slides 2–8: the <em>principle of locality</em>, with real measurements from web servers and SPEC. Slides 9–13: the <em>seven characteristics</em> by which any memory device is described (Table 4.1). Slides 14–29: the <em>hierarchy</em> itself and the arithmetic that says whether it is paying off.</li>
<li><strong>The one sentence the whole chapter rests on.</strong> A memory hierarchy works <em>only</em> because programs have locality. Feed a machine a perfectly random access pattern and every cache in it becomes dead weight — slide 27 (Figure 4.13) draws exactly that case as the straight diagonal "No Locality" line.</li>
<li><strong>Where the exam marks are.</strong> Two formulas, neither of which is printed on any slide in this deck: average access time of a two-level memory, and average cost per bit. Both come from the book (section 4.3); the slides only show their <em>graphs</em> (Figures 4.8, 4.11, 4.12, 4.13). This walkthrough writes both out and works them in full.</li>
<li><strong>What it connects to.</strong> Ch.2 gave you Amdahl's law — it explains why shaving memory stalls matters so much. Ch.3 gave you the bus that main memory sits on. Ch.5 builds the cache this chapter justifies. Ch.6/Ch.7 fill in the technologies (DRAM, disk, flash). CSI106 covered a memory hierarchy too, but only as a picture; this is the version with numbers.</li>
</ul>
<p class="meo">💡 Keep one image for the whole chapter: <strong>a desk and a filing cabinet</strong>. Slide 4 draws it literally. Everything else — registers versus cache, cache versus DRAM, DRAM versus disk — is the same desk-and-cabinet relationship repeated at a different scale.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu của chương trả lời đúng một câu hỏi: <strong>vì sao máy tính có tới năm loại bộ nhớ thay vì một loại thật tốt?</strong> Câu trả lời gồm một sự thật VẬT LÝ (không công nghệ nào vừa nhanh, vừa lớn, vừa rẻ) cộng một sự thật về HÀNH VI (chương trình không đụng vào bộ nhớ một cách đều đặn).</p>
<ul>
<li><strong>Cảnh báo đánh số, đọc trước đã.</strong> Syllabus của trường theo bản 9th ed nên gọi khối này là "Chapter 4: Cache Memory". Bản 11th ed đã <em>TÁCH ĐÔI</em>: <strong>Ch.4 là phần NỀN</strong> — tính cục bộ, đặc tính bộ nhớ, phân cấp, mô hình hiệu năng — còn <strong>Ch.5 mới là cache</strong> (ánh xạ, thay thế, chính sách ghi). Trong deck này KHÔNG có một chữ nào về ánh xạ dòng cache. Đừng tìm ở đây.</li>
<li><strong>Chương có ba đoạn.</strong> Slide 2–8: <em>NGUYÊN LÝ CỤC BỘ</em>, có số liệu đo thật từ máy chủ web và từ SPEC. Slide 9–13: <em>BẢY ĐẶC TÍNH</em> để mô tả bất kỳ thiết bị nhớ nào (Table 4.1). Slide 14–29: chính cái <em>PHÂN CẤP</em> và phép tính cho biết nó có đang lời hay không.</li>
<li><strong>Một câu mà cả chương đứng trên đó.</strong> Phân cấp bộ nhớ chạy được <em>CHỈ VÌ</em> chương trình có tính cục bộ. Cho máy một mẫu truy cập hoàn toàn ngẫu nhiên thì mọi cache trong nó thành cục sắt vô dụng — slide 27 (Figure 4.13) vẽ đúng ca đó thành đường chéo thẳng "No Locality".</li>
<li><strong>Điểm thi nằm ở đâu.</strong> Hai công thức, mà KHÔNG công thức nào được in trên bất kỳ slide nào của deck này: thời gian truy cập trung bình của bộ nhớ hai mức, và giá trung bình mỗi bit. Cả hai nằm trong SÁCH (mục 4.3); slide chỉ vẽ <em>ĐỒ THỊ</em> của chúng (Figure 4.8, 4.11, 4.12, 4.13). Bài này viết đủ cả hai và giải trọn.</li>
<li><strong>Nó nối vào đâu.</strong> Ch.2 cho bạn định luật Amdahl — nó giải thích vì sao cắt bớt thời gian chờ bộ nhớ lại ăn thua đến thế. Ch.3 cho bạn cái bus mà bộ nhớ chính cắm vào. Ch.5 xây cái cache mà chương này biện minh. Ch.6/Ch.7 lấp công nghệ vào (DRAM, đĩa, flash). CSI106 cũng có phân cấp bộ nhớ nhưng chỉ là một bức tranh; đây là bản có số.</li>
</ul>
<p class="meo">💡 Giữ một hình ảnh cho cả chương: <strong>cái bàn làm việc và cái tủ hồ sơ</strong>. Slide 4 vẽ đúng nghĩa đen như vậy. Mọi thứ còn lại — thanh ghi với cache, cache với DRAM, DRAM với đĩa — đều là cùng quan hệ bàn-với-tủ đó lặp lại ở một quy mô khác.</p>`],

      [2, 'Principle of Locality (1 of 2) — three assertions',
        `<p class="y-chinh">🎯 Locality (also called <strong>locality of reference</strong>) is the observation that during the course of execution of a program, <strong>memory references by the processor tend to cluster</strong>. The slide then pins that vague word "cluster" down to three precise assertions.</p>
<table>
<tr><th>#</th><th>The slide's assertion</th><th>What it rules out</th></tr>
<tr><td>1</td><td>During any interval of time, a program references memory locations <strong>non-uniformly</strong></td><td>Rules out "every address equally likely" — the case where caching is useless</td></tr>
<tr><td>2</td><td>As a function of time, the probability that a given unit of memory is referenced <strong>tends to change slowly</strong></td><td>Rules out a hot set that reshuffles every few instructions — you would never have time to copy it up</td></tr>
<tr><td>3</td><td>The <strong>correlation between immediate past and immediate future</strong> reference patterns is high, and tapers off as the time interval increases</td><td>Rules out unpredictability — this is what makes "keep what was just used" a winning strategy</td></tr>
</table>
<ul>
<li><strong>Read the three as one engineering argument, not three facts.</strong> (1) says a small hot set exists. (2) says it stays still long enough to be worth copying. (3) says you can identify it cheaply — by looking at what just happened. Take away any one and the hierarchy collapses: without (1) there is nothing to cache, without (2) the copy is stale on arrival, without (3) you would need a prophet instead of a cache.</li>
<li><strong>"Tapers off" is the important half of assertion 3.</strong> Correlation is high over microseconds, weak over seconds. That is exactly why a cache needs a <em>replacement</em> policy (Ch.5): what was hot ten milliseconds ago has no claim on space today.</li>
<li><strong>It is an empirical law, not a theorem.</strong> Nobody proved locality; it was measured, again and again, across every kind of program. Slides 7 and 8 show two of those measurements. A program <em>may</em> violate it — and then it runs at DRAM speed, which slide 17 will price for you.</li>
<li><strong>Why it exists at all.</strong> Programs are made of loops, procedures called repeatedly, and arrays/records walked in order. Those three constructs mechanically produce clustered references. Locality is a shadow cast by the way humans write code.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: locality is a property of the <strong>program's behaviour</strong>, not of the hardware. A question saying "the cache creates locality" is wrong — the cache <em>exploits</em> locality that the program already has.</p>`,
        `<p class="y-chinh">🎯 Tính cục bộ (còn gọi là <strong>locality of reference</strong> — cục bộ về tham chiếu) là nhận xét rằng trong quá trình chương trình chạy, <strong>các tham chiếu bộ nhớ của bộ xử lý có xu hướng CỤM LẠI</strong>. Rồi slide ghim cái chữ "cụm" mơ hồ đó xuống thành ba khẳng định chính xác.</p>
<table>
<tr><th>#</th><th>Khẳng định trên slide</th><th>Nó loại trừ điều gì</th></tr>
<tr><td>1</td><td>Trong bất kỳ khoảng thời gian nào, chương trình tham chiếu các ô nhớ một cách <strong>KHÔNG ĐỀU</strong></td><td>Loại ca "mọi địa chỉ xác suất như nhau" — ca mà cache trở nên vô dụng</td></tr>
<tr><td>2</td><td>Theo thời gian, xác suất một đơn vị bộ nhớ được tham chiếu <strong>thay đổi CHẬM</strong></td><td>Loại ca tập nóng cứ vài lệnh lại xáo lại — chép lên không kịp</td></tr>
<tr><td>3</td><td><strong>Tương quan giữa quá khứ gần và tương lai gần</strong> của mẫu tham chiếu là CAO, và nhạt dần khi khoảng thời gian dài ra</td><td>Loại ca không đoán nổi — đây chính là thứ khiến chiến lược "giữ lại cái vừa dùng" thắng</td></tr>
</table>
<ul>
<li><strong>Đọc ba câu như MỘT lập luận kỹ thuật, đừng đọc như ba sự kiện rời.</strong> (1) nói có một tập nóng nhỏ. (2) nói nó đứng yên đủ lâu để bõ công chép. (3) nói bạn nhận ra nó RẺ — chỉ cần nhìn cái vừa xảy ra. Bỏ bất kỳ câu nào là cả phân cấp sụp: thiếu (1) thì chẳng có gì để đệm, thiếu (2) thì chép xong đã ôi, thiếu (3) thì cần nhà tiên tri chứ không phải cái cache.</li>
<li><strong>"Nhạt dần" mới là nửa quan trọng của khẳng định 3.</strong> Tương quan cao trong vài micro giây, yếu trong vài giây. Đó chính xác là lý do cache cần một chính sách <em>THAY THẾ</em> (Ch.5): cái nóng cách đây mười mili giây không còn quyền giữ chỗ hôm nay.</li>
<li><strong>Đây là một định luật THỰC NGHIỆM, không phải định lý.</strong> Không ai chứng minh tính cục bộ; người ta ĐO nó, đo đi đo lại, trên đủ mọi loại chương trình. Slide 7 và 8 trưng ra hai phép đo như vậy. Một chương trình <em>CÓ THỂ</em> vi phạm nó — và khi đó nó chạy ở tốc độ DRAM, mà slide 17 sẽ báo giá cho bạn.</li>
<li><strong>Vì sao nó tồn tại.</strong> Chương trình được làm từ vòng lặp, hàm gọi đi gọi lại, và mảng/bản ghi duyệt theo thứ tự. Ba cấu trúc đó tự động sinh ra tham chiếu cụm. Tính cục bộ là cái bóng mà cách con người viết mã hắt ra.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: tính cục bộ là tính chất của <strong>HÀNH VI CHƯƠNG TRÌNH</strong>, không phải của phần cứng. Câu nào bảo "cache tạo ra tính cục bộ" là SAI — cache chỉ <em>KHAI THÁC</em> tính cục bộ mà chương trình vốn đã có.</p>`],

      [3, 'Principle of Locality (2 of 2) — temporal and spatial locality',
        `<p class="y-chinh">🎯 The two forms, and the whole of Chapter 4 hangs on telling them apart. <strong>Temporal</strong> = the same place again soon. <strong>Spatial</strong> = a nearby place soon.</p>
<table>
<tr><th></th><th>Temporal locality</th><th>Spatial locality</th></tr>
<tr><td><strong>Slide's definition</strong></td><td>The tendency of a program to reference in the <em>near future</em> those units of memory referenced in the <em>recent past</em></td><td>The tendency of a program to reference units of memory whose <em>addresses are near one another</em></td></tr>
<tr><td><strong>Slide's examples</strong></td><td>Constants, temporary variables, and working stacks</td><td>Accessing data locations <em>sequentially</em>, such as when processing a table of data</td></tr>
<tr><td><strong>The axis it lives on</strong></td><td>TIME</td><td>ADDRESS</td></tr>
<tr><td><strong>What the hardware does about it</strong></td><td><em>Keep</em> a copy after use (the cache retains the line)</td><td><em>Fetch more than asked</em> (a whole block/line, and prefetching)</td></tr>
<tr><td><strong>Drawn on which figure</strong></td><td>Figure 4.2 (slide 5)</td><td>Figure 4.3 (slide 6)</td></tr>
</table>
<ul>
<li><strong>Two C loops that isolate each form.</strong> Temporal: <code>for (int i = 0; i &lt; n; i++) total += x;</code> — <code>total</code> and <code>x</code> are touched every single iteration; that is time, not address. Spatial: <code>for (int i = 0; i &lt; n; i++) sum += a[i];</code> — every element is touched exactly once, so there is no temporal reuse of data at all, yet it runs fast because <code>a[i]</code> and <code>a[i+1]</code> share a cache line.</li>
<li><strong>A loop body gives you both at once, on different objects.</strong> The <em>instructions</em> of the loop are reused every iteration (temporal); the <em>array elements</em> are new each iteration but adjacent (spatial). That is why Figure 4.3 draws two separate humps — one for instruction addresses, one for data addresses.</li>
<li><strong>Why the slide lists "constants, temporary variables, working stacks".</strong> All three are small, long-lived and touched constantly — the purest temporal locality a program has. It is also why registers (the tiny top of the hierarchy) pay for themselves at all.</li>
<li><strong>Connect to PRF192.</strong> A C array is a single contiguous block of memory: <code>&amp;a[i+1] − &amp;a[i]</code> is exactly <code>sizeof(a[0])</code> bytes. Spatial locality is a direct consequence of that language guarantee, and slide 6 turns it into a measured speed difference. A linked list gives you the same elements with none of the adjacency — and none of the speed.</li>
</ul>
<p class="pitfall">⚠️ The extracted text of this slide prints the line "<strong>Spatial locality</strong>" <em>twice in a row</em> — that is a duplication in the original .pptx, not two different kinds of spatial locality. There are exactly <strong>two</strong> forms of locality in this course, not three.</p>
<p class="meo">💡 Memory hook in two words: <strong>temporal = "again"</strong>, <strong>spatial = "next door"</strong>. If the question mentions a loop counter, a running total or a repeatedly called function → temporal. If it mentions an array, a string, a struct or sequential instructions → spatial.</p>`,
        `<p class="y-chinh">🎯 Hai dạng, và cả Chương 4 treo vào việc phân biệt được chúng. <strong>Temporal (theo thời gian)</strong> = lại chính chỗ đó, sắp tới. <strong>Spatial (theo không gian)</strong> = chỗ KỀ BÊN, sắp tới.</p>
<table>
<tr><th></th><th>Temporal locality — cục bộ thời gian</th><th>Spatial locality — cục bộ không gian</th></tr>
<tr><td><strong>Định nghĩa của slide</strong></td><td>Xu hướng chương trình tham chiếu trong <em>TƯƠNG LAI GẦN</em> những đơn vị bộ nhớ đã tham chiếu trong <em>QUÁ KHỨ GẦN</em></td><td>Xu hướng chương trình tham chiếu những đơn vị bộ nhớ có <em>ĐỊA CHỈ NẰM GẦN NHAU</em></td></tr>
<tr><td><strong>Ví dụ slide nêu</strong></td><td>Hằng số, biến tạm, và ngăn xếp đang làm việc</td><td>Truy cập các ô dữ liệu <em>TUẦN TỰ</em>, như khi xử lý một bảng dữ liệu</td></tr>
<tr><td><strong>Nó sống trên trục nào</strong></td><td>THỜI GIAN</td><td>ĐỊA CHỈ</td></tr>
<tr><td><strong>Phần cứng đối phó ra sao</strong></td><td><em>GIỮ LẠI</em> bản sao sau khi dùng (cache giữ dòng đó)</td><td><em>LẤY NHIỀU HƠN YÊU CẦU</em> (nguyên một khối/dòng, và nạp trước)</td></tr>
<tr><td><strong>Vẽ ở hình nào</strong></td><td>Figure 4.2 (slide 5)</td><td>Figure 4.3 (slide 6)</td></tr>
</table>
<ul>
<li><strong>Hai vòng lặp C tách riêng từng dạng.</strong> Temporal: <code>for (int i = 0; i &lt; n; i++) total += x;</code> — <code>total</code> và <code>x</code> bị đụng vào MỖI vòng; đó là thời gian, không phải địa chỉ. Spatial: <code>for (int i = 0; i &lt; n; i++) sum += a[i];</code> — mỗi phần tử chỉ đụng ĐÚNG MỘT LẦN, tức không hề có dùng lại theo thời gian, vậy mà vẫn chạy nhanh vì <code>a[i]</code> và <code>a[i+1]</code> chung một dòng cache.</li>
<li><strong>Thân vòng lặp cho bạn CẢ HAI cùng lúc, trên hai đối tượng khác nhau.</strong> <em>LỆNH</em> của vòng lặp được dùng lại mỗi vòng (temporal); <em>PHẦN TỬ MẢNG</em> thì mỗi vòng một cái mới nhưng KỀ NHAU (spatial). Đó chính là lý do Figure 4.3 vẽ HAI cái bướu tách rời — một cho địa chỉ lệnh, một cho địa chỉ dữ liệu.</li>
<li><strong>Vì sao slide kể "hằng số, biến tạm, ngăn xếp".</strong> Cả ba đều nhỏ, sống lâu và bị đụng liên tục — dạng cục bộ thời gian thuần khiết nhất mà một chương trình có. Đó cũng là lý do thanh ghi (cái chóp tí hon của phân cấp) mới đáng đồng tiền.</li>
<li><strong>Nối sang PRF192.</strong> Mảng trong C là MỘT khối bộ nhớ liền kề: <code>&amp;a[i+1] − &amp;a[i]</code> đúng bằng <code>sizeof(a[0])</code> byte. Cục bộ không gian là hệ quả trực tiếp của bảo đảm đó trong ngôn ngữ, và slide 6 biến nó thành một chênh lệch tốc độ ĐO ĐƯỢC. Danh sách liên kết cho bạn đúng những phần tử ấy mà không có sự kề nhau — và cũng không có tốc độ.</li>
</ul>
<p class="pitfall">⚠️ Bản trích chữ của slide này in dòng "<strong>Spatial locality</strong>" <em>HAI LẦN liên tiếp</em> — đó là lỗi lặp trong chính file .pptx gốc, không phải hai loại cục bộ không gian khác nhau. Môn này có ĐÚNG <strong>HAI</strong> dạng locality, không phải ba.</p>
<p class="meo">💡 Mẹo nhớ hai chữ: <strong>temporal = "LẠI"</strong>, <strong>spatial = "KỀ"</strong>. Đề nhắc tới biến đếm vòng lặp, biến tổng, hàm gọi đi gọi lại → temporal. Đề nhắc tới mảng, chuỗi, struct, lệnh tuần tự → spatial.</p>`],

      [4, 'Figure 4.1 — Moving File Folders Between Smaller, Faster-Access Storage and Larger, Slower-Access Storage',
        `<p class="y-chinh">🎯 The whole hierarchy in one office picture: a small <strong>file organizer on Bob's desk</strong> on the left, a wall of <strong>filing cabinets in the next room</strong> on the right, and a double-headed arrow between them. That arrow is every cache fill and every eviction you will ever study.</p>
<ul>
<li><strong>Why the analogy is exact, not just cute.</strong> The desk organizer is <em>small</em> (a dozen folders), <em>fast</em> (arm's reach, no walking) and <em>expensive per folder</em> (desk space is scarce). The cabinet room is <em>huge</em>, <em>slow</em> (get up, walk, search) and <em>cheap per folder</em>. Those are precisely the three trade-off axes of slide 14.</li>
<li><strong>Bob's strategy is the cache algorithm.</strong> He keeps on the desk the folders he is working with (temporal locality), and when he walks to the cabinet he brings back the <em>whole</em> folder, not one sheet (spatial locality — the block transfer). If the desk is full, he returns the folder he has not touched in longest (replacement policy, Ch.5).</li>
<li><strong>Read the arrow in both directions.</strong> Right-to-left is a <em>miss being serviced</em>: the item was not on the desk, so it is fetched from the cabinet. Left-to-right is a <em>write-back or eviction</em>: a folder Bob edited must go back, or the desk needs the space.</li>
<li><strong>The hit ratio is "how often is it already on the desk".</strong> If Bob's desk holds the right dozen folders, he almost never walks. Slide 17 turns "almost never walks" into a number, and shows that 95% is not nearly good enough.</li>
<li><strong>The picture repeats at every level.</strong> Registers are Bob's hand, L1 is the desk, L2/L3 the shelf behind him, DRAM the cabinet, SSD/disk the archive in the basement, tape the off-site warehouse. Same relationship, six times over — which is exactly Figure 4.6 on slide 15.</li>
</ul>
<p class="meo">💡 If an exam question about cache confuses you, translate it to Bob. "What happens on a write hit?" → Bob edits a folder already on his desk: does he immediately walk it back to the cabinet (write-through) or edit now and return it later (write-back)? The answer usually becomes obvious.</p>`,
        `<p class="y-chinh">🎯 Cả cái phân cấp gói trong một bức tranh văn phòng: một <strong>khay đựng hồ sơ nhỏ trên bàn của Bob</strong> bên trái, một bức tường <strong>tủ hồ sơ ở phòng bên</strong> bên phải, và một mũi tên hai đầu nối giữa. Mũi tên đó chính là mọi lần nạp cache và mọi lần đuổi dòng mà bạn sẽ học.</p>
<ul>
<li><strong>Vì sao phép ví này CHÍNH XÁC chứ không chỉ cho vui.</strong> Khay trên bàn thì <em>NHỎ</em> (chục cặp hồ sơ), <em>NHANH</em> (với tay là tới, không phải đi), và <em>ĐẮT trên mỗi cặp</em> (mặt bàn là thứ hiếm). Phòng tủ thì <em>KHỔNG LỒ</em>, <em>CHẬM</em> (đứng dậy, đi, tìm), và <em>RẺ trên mỗi cặp</em>. Đó đúng là ba trục đánh đổi của slide 14.</li>
<li><strong>Chiến lược của Bob chính là thuật toán cache.</strong> Anh ta giữ trên bàn những cặp đang làm (cục bộ thời gian), và khi đi sang phòng tủ thì mang về NGUYÊN CẶP chứ không mang một tờ (cục bộ không gian — truyền theo KHỐI). Bàn đầy thì trả lại cặp lâu nhất chưa động tới (chính sách thay thế, Ch.5).</li>
<li><strong>Đọc mũi tên theo CẢ HAI chiều.</strong> Phải-sang-trái là <em>một lần trượt đang được phục vụ</em>: thứ cần không có trên bàn nên phải lấy từ tủ. Trái-sang-phải là <em>ghi trả hoặc đuổi ra</em>: cặp Bob vừa sửa phải trả về, hoặc bàn cần chỗ.</li>
<li><strong>Tỉ lệ trúng là "bao nhiêu phần trăm thời gian thứ cần đã có sẵn trên bàn".</strong> Nếu bàn Bob chứa đúng chục cặp cần thiết thì anh gần như không phải đi. Slide 17 biến "gần như không phải đi" thành con số, và cho thấy 95% CÒN LÂU mới đủ tốt.</li>
<li><strong>Bức tranh này lặp lại ở MỌI mức.</strong> Thanh ghi là bàn tay Bob, L1 là mặt bàn, L2/L3 là kệ sau lưng, DRAM là tủ hồ sơ, SSD/đĩa là kho dưới tầng hầm, băng từ là kho thuê ngoài. Cùng một quan hệ, lặp sáu lần — đúng là Figure 4.6 ở slide 15.</li>
</ul>
<p class="meo">💡 Câu hỏi thi về cache mà bí thì hãy dịch sang chuyện Bob. "Ghi trúng thì xảy ra gì?" → Bob sửa một cặp đã có sẵn trên bàn: anh mang trả tủ ngay (write-through) hay sửa rồi lát trả (write-back)? Đáp án thường tự hiện ra.</p>`],

      [5, 'Figure 4.2 — Idealized Temporal Locality Behavior: Probability Distribution for Time of Next Memory Access to Memory Unit Accessed at Time t',
        `<p class="y-chinh">🎯 One curve that says everything about <strong>temporal</strong> locality: the horizontal axis is <em>time</em>, the origin is the moment <em>t</em> at which some memory unit was just accessed, and the curve is the probability that the <em>next</em> access to that same unit happens at each later moment. It starts high and <strong>falls off a cliff</strong>.</p>
<ul>
<li><strong>Read the shape, there are no numbers on it.</strong> Flat-and-high immediately after <em>t</em>, then a steep drop, then a long flat tail near zero. Meaning: if a location is going to be used again, it will almost certainly be used again <em>very soon</em>; if it survives a while unused, it is probably finished.</li>
<li><strong>This is assertion 3 of slide 2, drawn.</strong> "Correlation between immediate past and immediate future is high and tapers off as the interval increases" — the cliff is the tapering. That is why the curve, not the formula, is the exam-relevant thing here.</li>
<li><strong>The design rule it hands you.</strong> <em>Keep the most recently used items.</em> That single sentence is the justification for LRU replacement (Ch.5), for register allocation by the compiler, for the OS's page replacement, and for the browser cache on your laptop. All four are the same bet on this curve.</li>
<li><strong>"Idealized" is doing real work in the title.</strong> A real program's curve is lumpier — it has bumps at the loop period, at the function call period. The idealization keeps only the monotone decay, which is the part every program shares.</li>
</ul>
<p class="nhan">📐 Measured on the machine this lesson was written on (Apple M1 Max, <code>cc -O2</code>), by chasing a randomly ordered pointer cycle with one node per 64-byte line — each step must wait for the previous one, so it measures <strong>latency</strong>, not bandwidth:</p>
<table>
<tr><th>Working set (how much you keep "recently used")</th><th>Time per access</th><th>Which level is answering</th></tr>
<tr><td>16 kB</td><td>1,29 ns</td><td>L1</td></tr>
<tr><td>64 kB</td><td>1,29 ns</td><td>L1</td></tr>
<tr><td>512 kB</td><td>5,6–6,1 ns</td><td>L2</td></tr>
<tr><td>4 MB</td><td>7,6–8,0 ns</td><td>L2</td></tr>
<tr><td>32 MB</td><td>101–105 ns</td><td>DRAM</td></tr>
<tr><td>256 MB</td><td>129 ns</td><td>DRAM</td></tr>
</table>
<p class="dap-an">✅ The memory hierarchy is <strong>visible in the numbers</strong>: 1,29 ns → 6 ns → 129 ns, two clean steps. And note the ratio <strong>129,3 ÷ 1,29 = 100,2</strong> — this machine has <em>r = T2/T1 ≈ 100</em>, exactly the middle curve of Figure 4.12 on slide 26. The numbers the textbook uses are not invented.</p>
<p class="pitfall">⚠️ Honest warning, because it nearly fooled the measurement. The first attempt compared <em>sequentially summing</em> a 32 kB array against a 256 MB array and found almost no difference (0,96 vs 0,99 ns per add) — the hardware prefetcher predicts a constant stride perfectly, so it hides the DRAM latency. <strong>Sequential access measures spatial locality, not temporal.</strong> To see temporal locality you must defeat prediction, which is why the table above chases a <em>random</em> pointer cycle.</p>`,
        `<p class="y-chinh">🎯 Một đường cong nói hết về cục bộ <strong>THỜI GIAN</strong>: trục ngang là <em>thời gian</em>, gốc toạ độ là thời điểm <em>t</em> mà một đơn vị bộ nhớ vừa được truy cập, và đường cong là xác suất lần truy cập <em>KẾ TIẾP</em> vào chính đơn vị đó rơi vào từng thời điểm sau đó. Nó bắt đầu cao rồi <strong>rơi thẳng đứng</strong>.</p>
<ul>
<li><strong>Đọc HÌNH DÁNG, hình này không có con số nào.</strong> Cao và phẳng ngay sau <em>t</em>, rồi sụt dốc đứng, rồi một cái đuôi dài sát không. Nghĩa là: nếu một ô còn được dùng lại thì gần như chắc chắn nó được dùng lại <em>RẤT SỚM</em>; còn nếu nó nằm im một lúc mà chưa ai đụng thì khả năng cao là xong việc rồi.</li>
<li><strong>Đây là khẳng định 3 của slide 2, vẽ ra.</strong> "Tương quan giữa quá khứ gần và tương lai gần là cao và nhạt dần khi khoảng thời gian dài ra" — vách đá chính là chỗ "nhạt dần". Vì thế ở đây thứ đáng nhớ để đi thi là ĐƯỜNG CONG, không phải công thức.</li>
<li><strong>Quy tắc thiết kế nó trao cho bạn.</strong> <em>GIỮ LẠI CÁI VỪA DÙNG GẦN NHẤT.</em> Một câu đó biện minh cho thay thế LRU (Ch.5), cho việc trình biên dịch cấp phát thanh ghi, cho thay trang của hệ điều hành, và cho cả cache của trình duyệt trên laptop bạn. Cả bốn đều là cùng một canh bạc đặt lên đường cong này.</li>
<li><strong>Chữ "Idealized" trong tiêu đề làm việc thật.</strong> Đường cong của chương trình thật gồ ghề hơn — có bướu ở đúng chu kỳ vòng lặp, ở chu kỳ gọi hàm. Bản lý tưởng hoá chỉ giữ phần suy giảm đơn điệu, tức phần mà MỌI chương trình đều có.</li>
</ul>
<p class="nhan">📐 Đo thật trên chính máy viết bài này (Apple M1 Max, <code>cc -O2</code>), bằng cách đuổi một vòng con trỏ xáo ngẫu nhiên, mỗi nút một dòng cache 64 byte — mỗi bước phải CHỜ bước trước xong, nên nó đo đúng <strong>ĐỘ TRỄ</strong>, không phải băng thông:</p>
<table>
<tr><th>Vùng làm việc (bạn giữ lại bao nhiêu "vừa dùng")</th><th>Thời gian mỗi lần truy cập</th><th>Mức nào đang trả lời</th></tr>
<tr><td>16 kB</td><td>1,29 ns</td><td>L1</td></tr>
<tr><td>64 kB</td><td>1,29 ns</td><td>L1</td></tr>
<tr><td>512 kB</td><td>5,6–6,1 ns</td><td>L2</td></tr>
<tr><td>4 MB</td><td>7,6–8,0 ns</td><td>L2</td></tr>
<tr><td>32 MB</td><td>101–105 ns</td><td>DRAM</td></tr>
<tr><td>256 MB</td><td>129 ns</td><td>DRAM</td></tr>
</table>
<p class="dap-an">✅ Phân cấp bộ nhớ <strong>HIỆN RA THÀNH SỐ</strong>: 1,29 ns → 6 ns → 129 ns, hai bậc rất sạch. Và để ý tỉ số <strong>129,3 ÷ 1,29 = 100,2</strong> — máy này có <em>r = T2/T1 ≈ 100</em>, đúng đường cong ở giữa của Figure 4.12 tại slide 26. Những con số sách dùng không phải bịa ra.</p>
<p class="pitfall">⚠️ Cảnh báo thành thật, vì nó suýt đánh lừa phép đo. Lần thử ĐẦU TIÊN đem <em>cộng TUẦN TỰ</em> một mảng 32 kB so với một mảng 256 MB và thấy gần như không chênh (0,96 so với 0,99 ns mỗi phép) — bộ nạp trước của phần cứng đoán bước đều chính xác tuyệt đối nên nó GIẤU luôn độ trễ DRAM. <strong>Truy cập tuần tự đo cục bộ KHÔNG GIAN, không đo cục bộ thời gian.</strong> Muốn thấy cục bộ thời gian thì phải đánh bại bộ đoán, nên bảng trên mới phải đuổi một vòng con trỏ <em>NGẪU NHIÊN</em>.</p>`],


      [6, 'Figure 4.3 — Idealized Spatial Locality Behavior: Probability Distribution for Next Memory Access (most recent data access at x, most recent instruction fetch at y)',
        `<p class="y-chinh">🎯 The companion curve for <strong>spatial</strong> locality. The axis is now <em>memory address</em>, running 0 to 2<sup>n−1</sup>, and the picture shows <strong>two humps</strong>: one centred on <em>y</em>, the address of the most recent instruction fetch, one centred on <em>x</em>, the address of the most recent data access.</p>
<ul>
<li><strong>Two humps, not one — that is the whole message.</strong> A program's next reference is near the last <em>instruction</em> OR near the last <em>data</em> item, and those two live far apart in the address space (code segment versus data/heap/stack). One cache trying to hold both fights itself; that is precisely why real processors have a <strong>split L1</strong> — a separate I-cache and D-cache. Look ahead to slide 21 (Figure 4.10): the IBM z13 has "L1 I-cache 96 kB" and "L1 D-cache 128 kB" as two separate boxes, per core.</li>
<li><strong>Each hump is fat, not a spike.</strong> A spike would mean "the same address again", which is temporal locality. The <em>width</em> of the hump is what spatial locality means, and it is what sets a sensible <strong>block size</strong>: transfer a block wide enough to cover the hump, no wider.</li>
<li><strong>The design rule it hands you.</strong> <em>When you fetch one word, fetch its neighbours too.</em> That is why Table 4.2 (slide 19) says the unit of transfer between cache and main memory is a 32-byte block, not a word, and between main memory and disk a 1 kB page, not a byte.</li>
<li><strong>Block size is a trade-off, not "bigger is better".</strong> Too small and you pay a fresh miss every few words. Too big and you drag in data you never touch and evict something you did need. Ch.5 returns to this; Figure 4.3 is where the tension is born.</li>
</ul>
<p class="nhan">📐 <strong>Measured, not asserted.</strong> The sharpest proof of spatial locality in the whole course is walking a matrix by rows versus by columns. Same array, same number of additions, same result — only the order changes:</p>
<pre>#include &lt;stdio.h&gt;
#define N 4096
static double a[N][N];          /* 128 MB, far bigger than any cache */

/* by ROW — j runs innermost: a[i][j] and a[i][j+1] are 8 bytes apart */
for (int i = 0; i &lt; N; i++)
    for (int j = 0; j &lt; N; j++) s1 += a[i][j];

/* by COLUMN — i runs innermost: a[i][j] and a[i+1][j] are 32768 bytes apart */
for (int j = 0; j &lt; N; j++)
    for (int i = 0; i &lt; N; i++) s2 += a[i][j];</pre>
<table>
<tr><th>Array</th><th>By row</th><th>By column</th><th>Column ÷ row</th></tr>
<tr><td>4096×4096 double (128 MB)</td><td>0,019–0,033 s</td><td>0,065–0,073 s</td><td><strong>2,2–3,5×</strong></td></tr>
<tr><td>8192×8192 double (512 MB)</td><td>0,074 s</td><td>0,250 s</td><td><strong>3,4×</strong></td></tr>
</table>
<p class="dap-an">✅ Answer: <strong>walking by column costs about 3,4× more time for exactly the same work</strong> (Apple M1 Max, <code>cc -O2</code>, 5 runs). Why: C stores a 2-D array <em>row-major</em>, so one 64-byte cache line holds 64 ÷ 8 = <strong>8 consecutive doubles of one row</strong>. Going by row, one miss pays for 8 uses. Going by column, the stride is N × 8 = 32 768 bytes, so every single access lands on a different line — <strong>8× more misses</strong>.</p>
<p class="pitfall">⚠️ Note that the measured penalty is 3,4×, <em>not</em> the 8× that "8 doubles per line" predicts. Be honest about why: the hardware prefetcher recognises the constant 32 kB stride and starts fetching ahead, recovering part of the loss. A naive theoretical answer of "8× slower" would be marked as reasoning, but reality is kinder than the model — and only measurement tells you so.</p>`,
        `<p class="y-chinh">🎯 Đường cong song sinh, cho cục bộ <strong>KHÔNG GIAN</strong>. Trục bây giờ là <em>ĐỊA CHỈ</em> bộ nhớ, chạy từ 0 tới 2<sup>n−1</sup>, và hình vẽ <strong>HAI CÁI BƯỚU</strong>: một cái tâm ở <em>y</em> là địa chỉ lần nạp lệnh gần nhất, một cái tâm ở <em>x</em> là địa chỉ lần truy cập dữ liệu gần nhất.</p>
<ul>
<li><strong>HAI bướu chứ không phải một — đó mới là thông điệp.</strong> Tham chiếu kế tiếp của chương trình nằm gần <em>LỆNH</em> vừa rồi HOẶC gần <em>DỮ LIỆU</em> vừa rồi, mà hai thứ đó nằm cách xa nhau trong không gian địa chỉ (đoạn mã so với dữ liệu/heap/stack). Một cái cache ôm cả hai thì tự đánh nhau; đó chính xác là lý do vi xử lý thật có <strong>L1 TÁCH ĐÔI</strong> — I-cache riêng và D-cache riêng. Nhìn trước slide 21 (Figure 4.10): IBM z13 ghi "L1 I-cache 96 kB" và "L1 D-cache 128 kB" thành hai ô tách biệt, mỗi lõi một bộ.</li>
<li><strong>Mỗi bướu BÉO, không phải cái gai nhọn.</strong> Gai nhọn nghĩa là "lại đúng địa chỉ đó", tức cục bộ thời gian. <em>ĐỘ RỘNG</em> của bướu mới là ý nghĩa của cục bộ không gian, và nó quyết định <strong>KÍCH THƯỚC KHỐI</strong> hợp lý: truyền một khối đủ rộng để phủ cái bướu, đừng rộng hơn.</li>
<li><strong>Quy tắc thiết kế nó trao cho bạn.</strong> <em>LẤY MỘT TỪ THÌ LẤY LUÔN HÀNG XÓM.</em> Đó là lý do Table 4.2 (slide 19) ghi đơn vị truyền giữa cache và bộ nhớ chính là KHỐI 32 byte chứ không phải một từ, và giữa bộ nhớ chính với đĩa là TRANG 1 kB chứ không phải một byte.</li>
<li><strong>Kích thước khối là ĐÁNH ĐỔI, không phải "càng to càng tốt".</strong> Nhỏ quá thì cứ vài từ lại trượt một lần. To quá thì lôi về cả đống chẳng bao giờ đụng tới, lại đuổi mất thứ đang cần. Ch.5 quay lại chuyện này; Figure 4.3 là nơi mâu thuẫn ấy sinh ra.</li>
</ul>
<p class="nhan">📐 <strong>ĐO THẬT, không phán bừa.</strong> Bằng chứng sắc nhất về cục bộ không gian trong cả môn là duyệt ma trận theo HÀNG so với theo CỘT. Cùng một mảng, cùng số phép cộng, cùng kết quả — chỉ khác THỨ TỰ:</p>
<pre>#include &lt;stdio.h&gt;
#define N 4096
static double a[N][N];          /* 128 MB, lớn hơn mọi cache rất nhiều */

/* theo HÀNG — j chạy trong: a[i][j] và a[i][j+1] cách nhau 8 byte */
for (int i = 0; i &lt; N; i++)
    for (int j = 0; j &lt; N; j++) s1 += a[i][j];

/* theo CỘT — i chạy trong: a[i][j] và a[i+1][j] cách nhau 32768 byte */
for (int j = 0; j &lt; N; j++)
    for (int i = 0; i &lt; N; i++) s2 += a[i][j];</pre>
<table>
<tr><th>Mảng</th><th>Theo hàng</th><th>Theo cột</th><th>Cột ÷ hàng</th></tr>
<tr><td>4096×4096 double (128 MB)</td><td>0,019–0,033 s</td><td>0,065–0,073 s</td><td><strong>2,2–3,5 lần</strong></td></tr>
<tr><td>8192×8192 double (512 MB)</td><td>0,074 s</td><td>0,250 s</td><td><strong>3,4 lần</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>duyệt theo cột tốn khoảng 3,4 lần thời gian cho đúng cùng một khối lượng việc</strong> (Apple M1 Max, <code>cc -O2</code>, chạy 5 lượt). Vì sao: C lưu mảng hai chiều theo <em>HÀNG (row-major)</em>, nên một dòng cache 64 byte chứa 64 ÷ 8 = <strong>8 phần tử double liên tiếp CỦA CÙNG MỘT HÀNG</strong>. Đi theo hàng thì một lần trượt trả tiền cho 8 lần dùng. Đi theo cột thì bước nhảy là N × 8 = 32 768 byte, nên MỖI lần truy cập rơi vào một dòng khác — <strong>trượt nhiều gấp 8 lần</strong>.</p>
<p class="pitfall">⚠️ Để ý hình phạt ĐO ĐƯỢC là 3,4 lần, <em>KHÔNG</em> phải 8 lần như lý thuyết "8 double mỗi dòng" dự đoán. Hãy nói thẳng lý do: bộ nạp trước của phần cứng nhận ra bước nhảy đều 32 kB và bắt đầu lấy sẵn, gỡ lại được một phần. Trả lời lý thuyết "chậm 8 lần" vẫn được tính là lập luận đúng, nhưng thực tế nhẹ tay hơn mô hình — và chỉ có ĐO mới cho bạn biết điều đó.</p>`],

      [7, 'Figure 4.4 — Data Locality of Reference for Web-Based Document Access Application',
        `<p class="y-chinh">🎯 Locality is not a CPU curiosity — here it is measured on a <strong>web server</strong>. The x-axis lists web pages sorted by decreasing popularity (1 to 400); the y-axis counts references. The curve is a <strong>cliff</strong>: a handful of pages get 1 500–3 000 hits, and by page 50 the count has already collapsed to about 300.</p>
<ul>
<li><strong>Read the numbers off the slide.</strong> Page 1 is up at the 3 000 ceiling. By page ~10 the curve has fallen to roughly 500. By page 50 it is near 300, by page 150 near 150, and it trails to about 50 at page 400. The first 10 pages out of 400 (2,5% of the content) absorb a wildly disproportionate share of the traffic.</li>
<li><strong>This shape has a name: a heavy-tailed / Zipf-like distribution.</strong> You will meet it again everywhere — words in a language, files on a disk, products in a shop, keys in a database. Whenever you see it, a cache will work.</li>
<li><strong>Which locality is this?</strong> <strong>Temporal.</strong> The same document is requested again and again over time. There is no notion of "the next page's address" here, so spatial locality does not apply. It is slide 2's assertion 1 — "references are non-uniform" — measured in the wild.</li>
<li><strong>What it justifies.</strong> The disk cache and the page cache in the OS, the CDN in front of a website, the Redis layer in front of a database, the browser cache. All of them are two-level memories in the sense of slide 23–24, just with different M1 and M2.</li>
<li><strong>Why the textbook puts it here.</strong> To stop you believing locality is a hardware trick. It is a property of <em>demand</em>, and it repeats at every scale of computing — which is why the same arithmetic (slide 17) prices a cache hit ratio and a CDN hit ratio identically.</li>
</ul>
<p class="meo">💡 Practical reading of the curve: <strong>caching the top 2% buys you most of the win</strong>. That is also the honest answer to "how big should the cache be?" — big enough for the knee of the curve, and Figure 4.13 (slide 27) draws exactly that knee in the abstract.</p>`,
        `<p class="y-chinh">🎯 Tính cục bộ không phải chuyện lạ của riêng CPU — đây là nó được đo trên một <strong>MÁY CHỦ WEB</strong>. Trục hoành liệt kê các trang web sắp theo độ phổ biến giảm dần (1 đến 400); trục tung đếm số lượt tham chiếu. Đường cong là một <strong>VÁCH ĐÁ</strong>: một nhúm trang được 1 500–3 000 lượt, mà tới trang thứ 50 thì con số đã sụp còn khoảng 300.</p>
<ul>
<li><strong>Đọc số thẳng trên slide.</strong> Trang 1 đụng trần 3 000. Tới trang ~10 đường cong đã rơi xuống cỡ 500. Tới trang 50 còn gần 300, trang 150 còn gần 150, và lê tới khoảng 50 ở trang 400. Mười trang đầu trên 400 trang (2,5% nội dung) hút một phần lưu lượng lệch hẳn mọi tỉ lệ.</li>
<li><strong>Hình dáng này có tên: phân bố đuôi nặng / kiểu Zipf.</strong> Bạn sẽ gặp lại nó ở khắp nơi — tần suất từ trong một ngôn ngữ, file trên đĩa, mặt hàng trong cửa hàng, khoá trong cơ sở dữ liệu. Thấy hình này ở đâu là ở đó cache sẽ ăn tiền.</li>
<li><strong>Đây là loại cục bộ nào?</strong> <strong>THỜI GIAN.</strong> Cùng một tài liệu bị yêu cầu đi yêu cầu lại theo thời gian. Ở đây không có khái niệm "địa chỉ của trang kế bên", nên cục bộ không gian không áp dụng. Đây là khẳng định 1 của slide 2 — "tham chiếu không đều" — đo ngoài đời thật.</li>
<li><strong>Nó biện minh cho cái gì.</strong> Cho disk cache và page cache của hệ điều hành, cho CDN đặt trước một website, cho lớp Redis đặt trước cơ sở dữ liệu, cho cache của trình duyệt. Tất cả đều là bộ nhớ hai mức theo đúng nghĩa slide 23–24, chỉ khác M1 và M2 là cái gì.</li>
<li><strong>Vì sao sách đặt hình này ở đây.</strong> Để bạn thôi tin rằng tính cục bộ là mẹo của phần cứng. Nó là tính chất của <em>NHU CẦU</em>, và nó lặp lại ở mọi quy mô của máy tính — vì thế cùng một phép tính (slide 17) định giá được cả tỉ lệ trúng cache lẫn tỉ lệ trúng CDN y như nhau.</li>
</ul>
<p class="meo">💡 Cách đọc thực dụng: <strong>đệm lấy 2% đầu bảng là ăn gần hết phần lời</strong>. Đó cũng là câu trả lời thành thật cho "cache nên to bằng nào?" — to vừa đủ tới chỗ GẤP KHÚC của đường cong, và Figure 4.13 (slide 27) vẽ đúng chỗ gấp khúc đó ở dạng trừu tượng.</p>`],

      [8, 'Figure 4.5 — Instruction Locality Based on Code Reuse in Eleven Benchmark Programs in SPEC CPU2006',
        `<p class="y-chinh">🎯 The same cliff, now for <strong>instructions</strong>, measured on eleven real SPEC CPU2006 benchmarks. The x-axis is the cumulative number of <em>static</em> instructions (distinct instructions in the binary, ×10<sup>6</sup>); the y-axis is the cumulative percentage of <em>dynamic</em> instructions (instructions actually executed).</p>
<ul>
<li><strong>Static versus dynamic is the whole trick of this figure.</strong> <em>Static</em> = how many distinct instructions exist in the program text. <em>Dynamic</em> = how many instructions the processor actually runs, counting every loop iteration separately. A three-instruction loop run a million times is 3 static, 3 000 000 dynamic.</li>
<li><strong>Read the leftmost curves.</strong> Several benchmarks shoot up the y-axis almost vertically: they reach <strong>90–100% of all executed instructions</strong> within a few tens of thousands of distinct instructions (the bunched curves at x ≈ 0). For those programs, a tiny slice of the binary <em>is</em> the program in practice.</li>
<li><strong>Read the worst curve.</strong> The bottom-right curve is still under 30% of dynamic instructions after 4 million static instructions. Code locality is <em>not</em> uniform across programs — some workloads genuinely stress the instruction cache. Eleven curves, eleven very different personalities.</li>
<li><strong>Why it matters for design.</strong> Even the bad cases are far above the straight diagonal you would see with no locality, which is why a small instruction cache (a few tens of kB, like the z13's 96 kB on slide 21) captures the bulk of instruction fetches. If code reuse were uniform, an I-cache would be pointless.</li>
<li><strong>Which locality is this?</strong> Mostly <strong>temporal</strong> — the same instruction executed again (loops, hot functions). Instructions also have strong spatial locality because execution is sequential, but that is not what this figure measures.</li>
</ul>
<p class="pitfall">⚠️ Trap: reading "cumulative static instruction count" as program size in bytes. It is a <em>count of distinct instructions</em>, and it is cumulative <em>after sorting by execution frequency</em> — the hottest instructions come first. That sorting is what makes the curves rise so steeply; on an unsorted axis they would be straight lines.</p>
<p class="meo">💡 One-line takeaway for the exam: <strong>the 90/10 rule</strong> — a program spends about 90% of its execution time in about 10% of its code. Figure 4.5 is the measured version of that folklore, and Figure 4.4 is its data-side twin.</p>`,
        `<p class="y-chinh">🎯 Vẫn vách đá đó, lần này cho <strong>LỆNH</strong>, đo trên mười một benchmark SPEC CPU2006 thật. Trục hoành là số lệnh <em>TĨNH</em> cộng dồn (số lệnh KHÁC NHAU trong file nhị phân, ×10<sup>6</sup>); trục tung là phần trăm cộng dồn của lệnh <em>ĐỘNG</em> (số lệnh thực sự được thi hành).</p>
<ul>
<li><strong>Tĩnh với động là toàn bộ mấu chốt của hình này.</strong> <em>TĨNH</em> = có bao nhiêu lệnh khác nhau nằm trong văn bản chương trình. <em>ĐỘNG</em> = bộ xử lý thực sự chạy bao nhiêu lệnh, đếm riêng từng vòng lặp. Một vòng lặp ba lệnh chạy một triệu lần là 3 lệnh tĩnh, 3 000 000 lệnh động.</li>
<li><strong>Đọc mấy đường bên trái.</strong> Vài benchmark vọt gần như thẳng đứng theo trục tung: chúng đạt <strong>90–100% TOÀN BỘ lệnh được thi hành</strong> chỉ trong vài chục nghìn lệnh khác nhau (cụm đường chụm ở x ≈ 0). Với những chương trình đó, một lát cực mỏng của file nhị phân THỰC CHẤT chính là cả chương trình.</li>
<li><strong>Đọc đường tệ nhất.</strong> Đường dưới cùng bên phải sau 4 triệu lệnh tĩnh vẫn chưa tới 30% lệnh động. Cục bộ mã KHÔNG đồng đều giữa các chương trình — có loại tải thật sự hành hạ cache lệnh. Mười một đường, mười một tính nết rất khác nhau.</li>
<li><strong>Vì sao điều này quan trọng với thiết kế.</strong> Ngay cả ca xấu cũng còn cao hơn nhiều so với đường chéo thẳng mà bạn sẽ thấy nếu không có tính cục bộ, nên một cache lệnh nhỏ (vài chục kB, như 96 kB của z13 ở slide 21) đã tóm được phần lớn số lần nạp lệnh. Nếu mã được dùng lại đều nhau thì I-cache đã vô nghĩa.</li>
<li><strong>Đây là loại cục bộ nào?</strong> Chủ yếu <strong>THỜI GIAN</strong> — cùng một lệnh thi hành lại (vòng lặp, hàm nóng). Lệnh cũng có cục bộ không gian rất mạnh vì thi hành tuần tự, nhưng hình này không đo cái đó.</li>
</ul>
<p class="pitfall">⚠️ Bẫy: đọc "cumulative static instruction count" thành kích thước chương trình tính bằng byte. Nó là <em>SỐ ĐẾM lệnh khác nhau</em>, và nó cộng dồn <em>SAU KHI đã sắp theo tần suất thi hành</em> — lệnh nóng nhất đứng trước. Chính phép sắp xếp đó làm các đường dựng đứng lên; nếu trục không sắp thì chúng sẽ là đường thẳng.</p>
<p class="meo">💡 Một câu mang đi thi: <strong>quy tắc 90/10</strong> — chương trình tiêu khoảng 90% thời gian thi hành trong khoảng 10% lượng mã. Figure 4.5 là bản ĐO ĐƯỢC của câu truyền miệng đó, còn Figure 4.4 là người anh em bên phía dữ liệu.</p>`],

      [9, 'Table 4.1 — Key Characteristics of Computer Memory Systems',
        `<p class="y-chinh">🎯 The checklist. Any memory device — a register, a cache, a DRAM stick, an SSD, a tape — is fully described by these <strong>seven</strong> headings. This table is a classic "fill in the blanks" exam question, so learn it as a list, not as prose.</p>
<table>
<tr><th>Characteristic</th><th>Its options (exactly as on the slide)</th></tr>
<tr><td><strong>Location</strong></td><td>Internal (e.g., processor registers, cache, main memory) · External (e.g., optical disks, magnetic disks, tapes)</td></tr>
<tr><td><strong>Capacity</strong></td><td>Number of words · Number of bytes</td></tr>
<tr><td><strong>Unit of Transfer</strong></td><td>Word · Block</td></tr>
<tr><td><strong>Access Method</strong></td><td>Sequential · Direct · Random · Associative</td></tr>
<tr><td><strong>Performance</strong></td><td>Access time · Cycle time · Transfer rate</td></tr>
<tr><td><strong>Physical Type</strong></td><td>Semiconductor · Magnetic · Optical · Magneto-optical</td></tr>
<tr><td><strong>Physical Characteristics</strong></td><td>Volatile/nonvolatile · Erasable/nonerasable</td></tr>
<tr><td><strong>Organization</strong></td><td>Memory modules</td></tr>
</table>
<ul>
<li><strong>Count carefully.</strong> The slide shows <strong>eight</strong> headings if you count "Organization" separately (Location, Capacity, Unit of Transfer, Access Method, Performance, Physical Type, Physical Characteristics, Organization). Different textbook editions group them as seven by folding Organization into Physical Characteristics. Answer whatever the list on the slide says, and name the items — that is what earns the mark, not the count.</li>
<li><strong>Two of the eight are pure performance, and they are where the arithmetic lives.</strong> "Performance" gives you access time, cycle time and transfer rate — slide 12 defines all three. Everything else on this table is classification.</li>
<li><strong>Location is not "where the chip physically sits".</strong> It means <em>how the processor reaches it</em>: internal memory is addressed directly by the processor, external memory is reached through an I/O controller (Ch.7/Ch.8). An SSD soldered onto the motherboard is still <em>external</em> memory by this definition.</li>
<li><strong>Use the table as a template for describing any device.</strong> Exam-style: describe a DVD → Location: external · Capacity: 4,7 GB · Unit of transfer: block (sector) · Access method: direct · Physical type: optical · Physical characteristics: nonvolatile, and erasable only for RW discs.</li>
</ul>
<p class="meo">💡 Mnemonic for the eight, in slide order: <strong>L-C-U-A-P-P-P-O</strong> — "Location, Capacity, Unit, Access, Performance, Physical type, Physical characteristics, Organization". The three P's in the middle are the easiest to drop; group them as "how fast · what it is made of · how it behaves when the power dies".</p>`,
        `<p class="y-chinh">🎯 Bảng kiểm. Bất kỳ thiết bị nhớ nào — thanh ghi, cache, thanh DRAM, SSD, băng từ — đều được mô tả ĐẦY ĐỦ bằng <strong>BẢY</strong> đề mục này. Bảng này là dạng câu hỏi "điền chỗ trống" kinh điển, nên học nó thành DANH SÁCH, đừng học thành văn xuôi.</p>
<table>
<tr><th>Đặc tính</th><th>Các lựa chọn (đúng như trên slide)</th></tr>
<tr><td><strong>Location</strong> — vị trí</td><td>Trong (vd: thanh ghi bộ xử lý, cache, bộ nhớ chính) · Ngoài (vd: đĩa quang, đĩa từ, băng từ)</td></tr>
<tr><td><strong>Capacity</strong> — dung lượng</td><td>Số từ · Số byte</td></tr>
<tr><td><strong>Unit of Transfer</strong> — đơn vị truyền</td><td>Từ (word) · Khối (block)</td></tr>
<tr><td><strong>Access Method</strong> — phương pháp truy cập</td><td>Tuần tự · Trực tiếp · Ngẫu nhiên · Liên kết nội dung</td></tr>
<tr><td><strong>Performance</strong> — hiệu năng</td><td>Thời gian truy cập · Thời gian chu kỳ · Tốc độ truyền</td></tr>
<tr><td><strong>Physical Type</strong> — kiểu vật lý</td><td>Bán dẫn · Từ · Quang · Từ-quang</td></tr>
<tr><td><strong>Physical Characteristics</strong> — tính chất vật lý</td><td>Bay hơi/không bay hơi · Xoá được/không xoá được</td></tr>
<tr><td><strong>Organization</strong> — tổ chức</td><td>Mô-đun nhớ</td></tr>
</table>
<ul>
<li><strong>Đếm cho cẩn thận.</strong> Slide trưng <strong>TÁM</strong> đề mục nếu tách "Organization" ra riêng (Location, Capacity, Unit of Transfer, Access Method, Performance, Physical Type, Physical Characteristics, Organization). Các bản giáo trình khác nhau có bản gộp thành bảy bằng cách nhét Organization vào Physical Characteristics. Cứ trả lời theo danh sách trên slide, và hãy KỂ TÊN từng mục — đó mới là chỗ ăn điểm, không phải con số đếm.</li>
<li><strong>Hai trong tám mục thuần về hiệu năng, và đó là nơi phép tính sống.</strong> Mục "Performance" cho bạn thời gian truy cập, thời gian chu kỳ và tốc độ truyền — slide 12 định nghĩa cả ba. Mọi mục còn lại của bảng này là phân loại.</li>
<li><strong>"Location" KHÔNG phải "con chip nằm ở đâu về mặt vật lý".</strong> Nó nghĩa là <em>bộ xử lý với tới nó BẰNG CÁCH NÀO</em>: bộ nhớ trong được bộ xử lý đánh địa chỉ trực tiếp, bộ nhớ ngoài phải đi qua bộ điều khiển I/O (Ch.7/Ch.8). Một ổ SSD hàn chết trên bo mạch chủ vẫn là bộ nhớ <em>NGOÀI</em> theo định nghĩa này.</li>
<li><strong>Dùng bảng này làm KHUÔN để mô tả bất kỳ thiết bị nào.</strong> Kiểu đề thi: mô tả một đĩa DVD → Vị trí: ngoài · Dung lượng: 4,7 GB · Đơn vị truyền: khối (sector) · Phương pháp truy cập: trực tiếp · Kiểu vật lý: quang · Tính chất: không bay hơi, và chỉ xoá được với đĩa RW.</li>
</ul>
<p class="meo">💡 Mẹo nhớ tám mục theo đúng thứ tự slide: <strong>V-D-Đ-T-H-K-T-T</strong> — "Vị trí, Dung lượng, Đơn vị truyền, Truy cập, Hiệu năng, Kiểu vật lý, Tính chất vật lý, Tổ chức". Ba mục giữa dễ rơi nhất; gom chúng thành "nhanh cỡ nào · làm bằng gì · mất điện thì sao".</p>`],

      [10, 'Characteristics of Memory Systems — Location, Capacity, Unit of transfer',
        `<p class="y-chinh">🎯 The first three entries of Table 4.1, spelled out. Nothing here is hard; the value is in the <em>precision</em> of the definitions, because the exam tests exactly these distinctions.</p>
<table>
<tr><th>Characteristic</th><th>What the slide says</th></tr>
<tr><td rowspan="5"><strong>Location</strong></td><td>Refers to whether memory is internal <em>and</em> external to the computer</td></tr>
<tr><td>Internal memory is often equated with main memory</td></tr>
<tr><td>Processor requires its own local memory, in the form of <strong>registers</strong></td></tr>
<tr><td><strong>Cache</strong> is another form of internal memory</td></tr>
<tr><td>External memory consists of peripheral storage devices accessible to the processor <strong>via I/O controllers</strong></td></tr>
<tr><td><strong>Capacity</strong></td><td>Memory is typically expressed in terms of <strong>bytes</strong></td></tr>
<tr><td><strong>Unit of transfer</strong></td><td>For internal memory it is equal to the <strong>number of electrical lines</strong> into and out of the memory module</td></tr>
</table>
<ul>
<li><strong>"Internal memory is often equated with main memory" — note "often", not "always".</strong> Internal memory properly includes registers, cache <em>and</em> main memory. The slide lists the three explicitly so you do not shrink "internal" down to DRAM alone.</li>
<li><strong>The definition of unit of transfer is physical, and that is the beautiful part.</strong> It equals the number of data lines on the module. 64 data lines → 64 bits move at a time. It is not a software choice; it is how many wires you paid for. This connects straight back to Ch.3, where the width of the data bus determined how much moved per bus cycle, and to Ch.2's "make DRAMs wider rather than deeper".</li>
<li><strong>Word versus block, the distinction Table 4.1 sets up.</strong> A <em>word</em> is the natural unit of organization — typically the register size or the instruction length. A <em>block</em> is a larger group of words transferred as a unit: for external memory, transfers are always by block (sectors on a disk), because seeking once per byte would be absurd. Slide 19 gives the typical sizes: 32-bit word, 32-byte cache block, 1 kB page, 512-byte disk sector.</li>
<li><strong>Why "addressable unit" also matters.</strong> The book adds a fourth idea not printed on this slide: the addressable unit, usually the byte, so the number of addresses <em>A</em> and the number of addressable units satisfy 2<sup>A</sup> = N. If an exam gives you a 32-bit address bus and byte addressing, the address space is 2<sup>32</sup> = 4 GiB — that is an arithmetic question, and it belongs here.</li>
</ul>
<p class="pitfall">⚠️ The slide's first bullet is printed as "whether memory is internal <em>and</em> external" — the sensible reading is "internal <em>or</em> external". Do not read it as a claim that memory must be both. Report the slide, but answer with the correct dichotomy.</p>`,
        `<p class="y-chinh">🎯 Ba mục đầu của Table 4.1, nói rõ ra. Ở đây không có gì khó; giá trị nằm ở sự <em>CHÍNH XÁC</em> của định nghĩa, vì đề thi kiểm tra đúng những chỗ phân biệt này.</p>
<table>
<tr><th>Đặc tính</th><th>Slide nói gì</th></tr>
<tr><td rowspan="5"><strong>Location — vị trí</strong></td><td>Chỉ việc bộ nhớ nằm TRONG hay NGOÀI máy tính</td></tr>
<tr><td>Bộ nhớ trong thường được đồng nhất với bộ nhớ chính</td></tr>
<tr><td>Bộ xử lý cần bộ nhớ cục bộ của riêng nó, dưới dạng <strong>THANH GHI</strong></td></tr>
<tr><td><strong>CACHE</strong> là một dạng bộ nhớ trong nữa</td></tr>
<tr><td>Bộ nhớ ngoài gồm các thiết bị lưu trữ ngoại vi mà bộ xử lý với tới <strong>QUA BỘ ĐIỀU KHIỂN I/O</strong></td></tr>
<tr><td><strong>Capacity — dung lượng</strong></td><td>Thường biểu diễn bằng <strong>BYTE</strong></td></tr>
<tr><td><strong>Unit of transfer — đơn vị truyền</strong></td><td>Với bộ nhớ trong, nó bằng <strong>SỐ ĐƯỜNG DÂY ĐIỆN</strong> ra/vào mô-đun nhớ</td></tr>
</table>
<ul>
<li><strong>"Bộ nhớ trong thường được đồng nhất với bộ nhớ chính" — chú ý chữ "THƯỜNG", không phải "LUÔN LUÔN".</strong> Bộ nhớ trong nói cho đúng gồm thanh ghi, cache <em>VÀ</em> bộ nhớ chính. Slide kể đủ ba thứ để bạn đừng thu nhỏ chữ "trong" lại còn mỗi DRAM.</li>
<li><strong>Định nghĩa đơn vị truyền là định nghĩa VẬT LÝ, và đó mới là chỗ hay.</strong> Nó bằng số đường dữ liệu trên mô-đun. 64 đường dữ liệu → mỗi lần chuyển 64 bit. Đây không phải lựa chọn phần mềm; nó là bạn đã trả tiền cho bao nhiêu sợi dây. Ý này nối thẳng về Ch.3, nơi bề rộng bus dữ liệu quyết định mỗi chu kỳ bus chuyển được bao nhiêu, và về câu "làm DRAM rộng hơn thay vì sâu hơn" của Ch.2.</li>
<li><strong>Từ (word) so với khối (block), chỗ phân biệt mà Table 4.1 dựng lên.</strong> <em>TỪ</em> là đơn vị tổ chức tự nhiên — thường bằng kích thước thanh ghi hoặc độ dài lệnh. <em>KHỐI</em> là một nhóm từ lớn hơn được truyền như một đơn vị: với bộ nhớ ngoài thì truyền LUÔN LUÔN theo khối (sector trên đĩa), vì tìm kiếm một lần cho mỗi byte thì vô lý. Slide 19 cho các kích thước điển hình: từ 32 bit, khối cache 32 byte, trang 1 kB, sector đĩa 512 byte.</li>
<li><strong>Vì sao "đơn vị đánh địa chỉ" cũng quan trọng.</strong> Sách thêm một ý thứ tư không in trên slide này: đơn vị đánh địa chỉ, thường là byte, nên số địa chỉ <em>A</em> và số đơn vị đánh địa chỉ thoả 2<sup>A</sup> = N. Đề cho bus địa chỉ 32 bit và đánh địa chỉ theo byte thì không gian địa chỉ là 2<sup>32</sup> = 4 GiB — đó là câu hỏi tính toán, và nó thuộc về đây.</li>
</ul>
<p class="pitfall">⚠️ Gạch đầu dòng đầu của slide in là "bộ nhớ nằm trong <em>VÀ</em> ngoài máy tính" — cách đọc hợp lý là "trong <em>HAY</em> ngoài". Đừng hiểu thành bộ nhớ phải vừa trong vừa ngoài. Cứ thuật lại slide, nhưng trả lời theo đúng cặp đối lập.</p>`],

      [11, 'Method of Accessing Units of Data — sequential, direct, random, associative',
        `<p class="y-chinh">🎯 Four access methods, four columns, and the exam loves making you place a device in the right column. The ordering is not random: each column is <strong>more flexible and more expensive</strong> than the one to its left.</p>
<table>
<tr><th>Method</th><th>What the slide says</th><th>Typical device</th></tr>
<tr><td><strong>Sequential access</strong></td><td>Memory is organized into units of data called <em>records</em> · Access must be made in a specific <strong>linear sequence</strong> · Access time is <strong>variable</strong></td><td>Magnetic tape</td></tr>
<tr><td><strong>Direct access</strong></td><td>Involves a <strong>shared read-write mechanism</strong> · Individual blocks or records have a unique address based on <strong>physical location</strong> · Access time is <strong>variable</strong></td><td>Magnetic disk</td></tr>
<tr><td><strong>Random access</strong></td><td>Each addressable location has a unique, <strong>physically wired-in</strong> addressing mechanism · Time to access a given location is <strong>independent of the sequence of prior accesses and is constant</strong> · Any location can be selected at random and directly addressed · <strong>Main memory and some cache systems</strong> are random access</td><td>DRAM, SRAM</td></tr>
<tr><td><strong>Associative</strong></td><td>A word is retrieved based on a <strong>portion of its CONTENTS</strong> rather than its address · Each location has its own addressing mechanism and retrieval time is constant, independent of location or prior access patterns · <strong>Cache memories may employ associative access</strong></td><td>Cache tag store, TLB</td></tr>
</table>
<ul>
<li><strong>The two words that separate the four: "variable" versus "constant".</strong> Sequential and direct both have <em>variable</em> access time, because a mechanism has to physically move. Random and associative are <em>constant</em>, because the addressing is wired in. Get this split right and you can rebuild the whole table.</li>
<li><strong>"Direct" is the halfway house.</strong> A disk jumps directly to the right track (that part is addressed), then waits and reads sequentially within it. Hence "shared read-write mechanism" — one head serves all tracks, so it must travel, so time varies with where it was before.</li>
<li><strong>Associative is the one people get wrong.</strong> It is <em>content-addressed</em>: you present a value, and the hardware compares it against <em>every</em> stored tag simultaneously and reports which one matched. This is why associative hardware is expensive (a comparator per entry) and why it is only used for small structures — a cache's tag array, a TLB. Ch.5's "set-associative cache" is named after exactly this.</li>
<li><strong>A subtlety worth a mark.</strong> "Random access" does <em>not</em> mean "accessed in a random order". It means <em>any</em> location costs the same. RAM is named for this property, not for randomness. The correct opposite of random access is sequential access, not "ordered access".</li>
<li><strong>Where this heads next.</strong> Ch.5 builds a cache by combining random access (an index picks a set) with associative access (tags in the set are compared in parallel). Knowing both definitions is a prerequisite for that chapter, which is exactly why they sit here in the foundation chapter.</li>
</ul>
<p class="meo">💡 Classification drill: tape → sequential · hard disk / DVD → direct · DRAM / SRAM → random · cache tag store / TLB → associative. Four devices, four columns, and it is very often a one-mark question.</p>`,
        `<p class="y-chinh">🎯 Bốn phương pháp truy cập, bốn cột, và đề thi rất thích bắt bạn xếp một thiết bị vào đúng cột. Thứ tự các cột không ngẫu nhiên: mỗi cột <strong>LINH HOẠT HƠN và ĐẮT HƠN</strong> cột bên trái nó.</p>
<table>
<tr><th>Phương pháp</th><th>Slide nói gì</th><th>Thiết bị tiêu biểu</th></tr>
<tr><td><strong>Sequential — tuần tự</strong></td><td>Bộ nhớ tổ chức thành các đơn vị gọi là <em>bản ghi</em> · Phải truy cập theo một <strong>TRÌNH TỰ TUYẾN TÍNH</strong> nhất định · Thời gian truy cập <strong>THAY ĐỔI</strong></td><td>Băng từ</td></tr>
<tr><td><strong>Direct — trực tiếp</strong></td><td>Có một <strong>CƠ CẤU ĐỌC-GHI DÙNG CHUNG</strong> · Từng khối/bản ghi có địa chỉ riêng dựa trên <strong>VỊ TRÍ VẬT LÝ</strong> · Thời gian truy cập <strong>THAY ĐỔI</strong></td><td>Đĩa từ</td></tr>
<tr><td><strong>Random — ngẫu nhiên</strong></td><td>Mỗi ô đánh địa chỉ được có cơ cấu địa chỉ riêng, <strong>ĐẤU DÂY CỨNG</strong> · Thời gian truy cập một ô <strong>KHÔNG phụ thuộc trình tự các lần trước và là HẰNG SỐ</strong> · Chọn ô nào cũng được, đánh địa chỉ thẳng · <strong>Bộ nhớ chính và một số hệ cache</strong> là truy cập ngẫu nhiên</td><td>DRAM, SRAM</td></tr>
<tr><td><strong>Associative — liên kết nội dung</strong></td><td>Một từ được lấy ra dựa trên <strong>MỘT PHẦN NỘI DUNG</strong> của nó chứ không phải địa chỉ · Mỗi ô có cơ cấu địa chỉ riêng, thời gian lấy ra là hằng số, không phụ thuộc vị trí hay các lần trước · <strong>Bộ nhớ cache có thể dùng truy cập liên kết</strong></td><td>Mảng tag của cache, TLB</td></tr>
</table>
<ul>
<li><strong>Hai chữ chia đôi bốn cột: "THAY ĐỔI" với "HẰNG SỐ".</strong> Tuần tự và trực tiếp đều có thời gian truy cập <em>THAY ĐỔI</em>, vì một cơ cấu phải di chuyển vật lý. Ngẫu nhiên và liên kết là <em>HẰNG SỐ</em>, vì địa chỉ đã đấu cứng vào mạch. Nhớ đúng chỗ chia này là dựng lại được cả bảng.</li>
<li><strong>"Trực tiếp" là trạm trung chuyển giữa hai bên.</strong> Đĩa nhảy thẳng tới đúng rãnh (phần đó là đánh địa chỉ), rồi chờ và đọc tuần tự bên trong rãnh. Vì thế mới có chữ "cơ cấu đọc-ghi dùng chung" — một cái đầu từ phục vụ mọi rãnh, nên nó phải đi lại, nên thời gian phụ thuộc vào trước đó nó đang ở đâu.</li>
<li><strong>Associative là chỗ người ta hay hiểu sai.</strong> Nó là <em>ĐÁNH ĐỊA CHỈ THEO NỘI DUNG</em>: bạn đưa ra một giá trị, phần cứng so nó với <em>MỌI</em> tag đang lưu CÙNG MỘT LÚC và báo cái nào khớp. Đó là lý do phần cứng liên kết rất đắt (mỗi mục một bộ so sánh) và chỉ dùng cho cấu trúc nhỏ — mảng tag của cache, TLB. Cái tên "cache liên kết theo tập" (set-associative) ở Ch.5 chính là từ đây mà ra.</li>
<li><strong>Một chỗ tinh tế đáng một điểm.</strong> "Truy cập ngẫu nhiên" KHÔNG có nghĩa "được truy cập theo thứ tự ngẫu nhiên". Nó nghĩa là <em>ô NÀO cũng tốn như nhau</em>. RAM mang tên đó vì tính chất này, không phải vì sự ngẫu nhiên. Đối lập đúng của truy cập ngẫu nhiên là truy cập TUẦN TỰ, không phải "truy cập có thứ tự".</li>
<li><strong>Chuyện này đi về đâu.</strong> Ch.5 dựng cache bằng cách ghép truy cập ngẫu nhiên (một chỉ số chọn ra tập) với truy cập liên kết (các tag trong tập được so song song). Nắm cả hai định nghĩa là điều kiện cần cho chương đó, nên chúng mới nằm ở đây, trong chương nền.</li>
</ul>
<p class="meo">💡 Bài tập phân loại: băng từ → tuần tự · ổ cứng / DVD → trực tiếp · DRAM / SRAM → ngẫu nhiên · mảng tag cache / TLB → liên kết. Bốn thiết bị, bốn cột, và rất hay là một câu một điểm.</p>`],

      [12, 'Capacity and Performance: the two most important characteristics of memory — three performance parameters',
        `<p class="y-chinh">🎯 Of the eight characteristics, <strong>capacity and performance are the two that matter most</strong>, and performance is measured by exactly three numbers: <strong>access time · memory cycle time · transfer rate</strong>. These are the definitions every later calculation depends on.</p>
<table>
<tr><th>Parameter</th><th>The slide's definition</th></tr>
<tr><td><strong>Access time (latency)</strong></td><td>For <em>random-access</em> memory: the time it takes to perform a read or write operation. · For <em>non-random-access</em> memory: the time it takes to <strong>position the read-write mechanism</strong> at the desired location.</td></tr>
<tr><td><strong>Memory cycle time</strong></td><td>Access time <strong>plus</strong> any additional time required before a second access can commence. Additional time may be needed for <em>transients to die out on signal lines</em>, or to <em>regenerate data if they are read destructively</em>. Concerned with the <strong>system bus</strong>, not the processor.</td></tr>
<tr><td><strong>Transfer rate</strong></td><td>The rate at which data can be transferred into or out of a memory unit. For random-access memory it equals <strong>1/(cycle time)</strong>.</td></tr>
</table>
<ul>
<li><strong>Access time ≠ cycle time, and the gap is the point.</strong> Cycle time ≥ access time, always. The slack is recovery: signal lines settling, and DRAM's <em>destructive read</em> — reading a DRAM cell drains its capacitor, so the controller must write the value back before the row can be used again. SRAM does not need this, which is one more reason SRAM is faster (Ch.6).</li>
<li><strong>Transfer rate = 1/(cycle time) only for random-access memory.</strong> The slide is explicit. For non-random devices the book's fuller formula is <em>T<sub>N</sub> = T<sub>A</sub> + N/R</em>: total time to read N bits = average access (seek) time + N divided by the transfer rate in bits per second. That formula is a favourite exam question and it does not appear on this slide.</li>
<li><strong>Worked example of T<sub>N</sub> = T<sub>A</sub> + N/R.</strong> A disk with average access time 10 ms and transfer rate 100 MB/s reading 4 kB: T = 0,010 s + 4096 ÷ (100 × 10<sup>6</sup>) = 0,010 + 0,0000410 = <strong>0,010041 s</strong>. Reading 4 MB instead: T = 0,010 + 4 194 304 ÷ 10<sup>8</sup> = 0,010 + 0,0419 = <strong>0,0519 s</strong>.</li>
<li class="dap-an">✅ Read the two results together: for 4 kB the access time is <strong>99,6% of the total</strong>; for 4 MB it is only 19%. That is the whole argument for transferring <em>large blocks</em> from slow devices, and it is why Table 4.2 pairs disk with a 512-byte sector and main memory with a 1 kB page rather than single bytes.</li>
<li><strong>The word "latency" in brackets matters.</strong> Access time and latency are the same thing in this course, and latency is <em>not</em> the inverse of transfer rate. A device can have huge transfer rate and awful latency (a disk); Chapter 2's I/O chart made the same point.</li>
</ul>
<p class="pitfall">⚠️ The slide's title is cut short — "Capacity and Performance:" — with the rest of the sentence sitting in the body box ("The two most important characteristics of memory"). Nothing is missing; it is a layout artefact of the original deck.</p>`,
        `<p class="y-chinh">🎯 Trong tám đặc tính, <strong>DUNG LƯỢNG và HIỆU NĂNG là hai cái quan trọng nhất</strong>, và hiệu năng được đo bằng đúng ba con số: <strong>thời gian truy cập · thời gian chu kỳ nhớ · tốc độ truyền</strong>. Đây là những định nghĩa mà mọi phép tính sau này dựa vào.</p>
<table>
<tr><th>Tham số</th><th>Định nghĩa của slide</th></tr>
<tr><td><strong>Access time — thời gian truy cập (độ trễ)</strong></td><td>Với bộ nhớ <em>truy cập ngẫu nhiên</em>: thời gian để thực hiện một thao tác đọc hoặc ghi. · Với bộ nhớ <em>KHÔNG truy cập ngẫu nhiên</em>: thời gian để <strong>ĐƯA CƠ CẤU ĐỌC-GHI</strong> tới đúng vị trí cần.</td></tr>
<tr><td><strong>Memory cycle time — thời gian chu kỳ nhớ</strong></td><td>Thời gian truy cập <strong>CỘNG THÊM</strong> phần thời gian phải chờ trước khi lần truy cập thứ hai bắt đầu được. Phần thêm có thể để <em>quá độ tắt hẳn trên đường tín hiệu</em>, hoặc để <em>tái sinh dữ liệu nếu đọc là phá huỷ</em>. Liên quan tới <strong>BUS HỆ THỐNG</strong>, không phải bộ xử lý.</td></tr>
<tr><td><strong>Transfer rate — tốc độ truyền</strong></td><td>Tốc độ dữ liệu vào/ra một đơn vị nhớ. Với bộ nhớ truy cập ngẫu nhiên nó bằng <strong>1/(thời gian chu kỳ)</strong>.</td></tr>
</table>
<ul>
<li><strong>Thời gian truy cập ≠ thời gian chu kỳ, và khoảng chênh mới là điểm mấu chốt.</strong> Chu kỳ ≥ truy cập, luôn luôn. Phần dư ra là để phục hồi: đường tín hiệu ổn định lại, và <em>ĐỌC PHÁ HUỶ</em> của DRAM — đọc một ô DRAM là làm cạn tụ điện của nó, nên bộ điều khiển phải ghi giá trị trở lại trước khi hàng đó dùng được tiếp. SRAM không cần việc này, thêm một lý do nữa để SRAM nhanh hơn (Ch.6).</li>
<li><strong>Tốc độ truyền = 1/(chu kỳ) CHỈ với bộ nhớ truy cập ngẫu nhiên.</strong> Slide nói rõ như vậy. Với thiết bị không ngẫu nhiên, công thức đầy đủ trong sách là <em>T<sub>N</sub> = T<sub>A</sub> + N/R</em>: tổng thời gian đọc N bit = thời gian truy cập (tìm kiếm) trung bình + N chia cho tốc độ truyền tính theo bit/giây. Công thức đó là món ruột của đề thi và nó KHÔNG có trên slide này.</li>
<li><strong>Bài giải mẫu cho T<sub>N</sub> = T<sub>A</sub> + N/R.</strong> Một ổ đĩa có thời gian truy cập trung bình 10 ms, tốc độ truyền 100 MB/s, đọc 4 kB: T = 0,010 s + 4096 ÷ (100 × 10<sup>6</sup>) = 0,010 + 0,0000410 = <strong>0,010041 s</strong>. Nếu đọc 4 MB: T = 0,010 + 4 194 304 ÷ 10<sup>8</sup> = 0,010 + 0,0419 = <strong>0,0519 s</strong>.</li>
<li class="dap-an">✅ Đọc hai kết quả cạnh nhau: với 4 kB thì thời gian truy cập chiếm <strong>99,6% tổng số</strong>; với 4 MB chỉ còn 19%. Đó là toàn bộ lý lẽ cho việc truyền <em>KHỐI LỚN</em> từ thiết bị chậm, và là lý do Table 4.2 ghép đĩa với sector 512 byte, ghép bộ nhớ chính với trang 1 kB, chứ không phải từng byte.</li>
<li><strong>Chữ "latency" trong ngoặc là có ý.</strong> Thời gian truy cập và độ trễ là cùng một thứ trong môn này, và độ trễ KHÔNG phải nghịch đảo của tốc độ truyền. Một thiết bị có thể vừa có tốc độ truyền khủng vừa có độ trễ tệ hại (cái đĩa cứng); biểu đồ I/O của Chương 2 cũng nói đúng ý đó.</li>
</ul>
<p class="pitfall">⚠️ Tiêu đề slide bị cụt — "Capacity and Performance:" — phần còn lại của câu nằm trong khối thân ("The two most important characteristics of memory"). Không thiếu gì cả; đó là lỗi bố cục của chính bộ slide gốc.</p>`],

      [13, 'Memory — physical types and physical characteristics of data storage',
        `<p class="y-chinh">🎯 Two more rows of Table 4.1 filled in: what memory is <strong>made of</strong>, and how it <strong>behaves when the power dies or when you try to change it</strong>.</p>
<table>
<tr><th>Group</th><th>The slide's list</th></tr>
<tr><td><strong>Most common physical types</strong></td><td>Semiconductor memory · Magnetic surface memory · Optical · Magneto-optical</td></tr>
<tr><td><strong>Volatile memory</strong></td><td>Information <strong>decays naturally</strong> or is lost when electrical power is switched off</td></tr>
<tr><td><strong>Nonvolatile memory</strong></td><td>Once recorded, information remains <strong>without deterioration</strong> until deliberately changed · <strong>No electrical power is needed</strong> to retain information</td></tr>
<tr><td><strong>Magnetic-surface memories</strong></td><td>Are <strong>nonvolatile</strong></td></tr>
<tr><td><strong>Semiconductor memory</strong></td><td>May be <strong>either</strong> volatile or nonvolatile</td></tr>
<tr><td><strong>Nonerasable memory</strong></td><td>Cannot be altered, except by <strong>destroying the storage unit</strong> · Semiconductor memory of this type is known as <strong>read-only memory (ROM)</strong></td></tr>
<tr><td><strong>Organization</strong></td><td>For random-access memory the organization is a key design issue · Organization = the <strong>physical arrangement of bits to form words</strong></td></tr>
</table>
<ul>
<li><strong>"Decays naturally" is not a throwaway phrase.</strong> DRAM loses charge even with the power on, which is why it must be <em>refreshed</em> thousands of times a second (Ch.6). Volatility has two faces: loss on power-off, and continuous decay while running. SRAM only has the first.</li>
<li><strong>The line worth memorising: semiconductor memory may be EITHER.</strong> SRAM and DRAM are volatile; ROM, EPROM and flash are semiconductor and nonvolatile. So "semiconductor ⇒ volatile" is a false inference, and it is a favourite trick in multiple-choice questions.</li>
<li><strong>Volatile and erasable are two independent axes.</strong> Flash is nonvolatile <em>and</em> erasable. Mask ROM is nonvolatile and nonerasable. DRAM is volatile and erasable. There is no fourth cell in normal use — volatile and nonerasable would be useless. Drawing the 2×2 grid once fixes the vocabulary.</li>
<li><strong>Why "organization is a key design issue" for random-access memory.</strong> The same number of bits can be wired as 1M × 8 or 4M × 2 or 8M × 1 — same capacity, different number of data pins, different cost, different board layout. This is exactly Ch.2's "wider rather than deeper", seen from the chip side, and Ch.6 will build memory modules out of these choices.</li>
<li><strong>Where each type actually lives today.</strong> Semiconductor: registers, cache, DRAM, SSD. Magnetic surface: hard disk, tape. Optical: CD/DVD/Blu-ray. Magneto-optical: essentially obsolete — it is in the list for completeness, and you should say so rather than pretend it is current.</li>
</ul>
<p class="meo">💡 Two-column check for any device: <em>does it survive a power cut?</em> (volatile/nonvolatile) and <em>can I rewrite it in place?</em> (erasable/nonerasable). Answer both and you have filled the "Physical Characteristics" row of Table 4.1 for that device.</p>`,
        `<p class="y-chinh">🎯 Thêm hai dòng nữa của Table 4.1 được điền: bộ nhớ <strong>LÀM BẰNG GÌ</strong>, và nó <strong>XỬ SỰ RA SAO khi mất điện hoặc khi bạn muốn thay đổi nó</strong>.</p>
<table>
<tr><th>Nhóm</th><th>Danh sách trên slide</th></tr>
<tr><td><strong>Các kiểu vật lý phổ biến nhất</strong></td><td>Bộ nhớ bán dẫn · Bộ nhớ bề mặt từ · Quang · Từ-quang</td></tr>
<tr><td><strong>Volatile — bay hơi</strong></td><td>Thông tin <strong>TỰ RÃ</strong> hoặc mất khi ngắt điện</td></tr>
<tr><td><strong>Nonvolatile — không bay hơi</strong></td><td>Ghi xong thì thông tin còn <strong>KHÔNG SUY GIẢM</strong> cho tới khi bị cố ý thay đổi · <strong>KHÔNG CẦN ĐIỆN</strong> để giữ thông tin</td></tr>
<tr><td><strong>Bộ nhớ bề mặt từ</strong></td><td>Là <strong>KHÔNG BAY HƠI</strong></td></tr>
<tr><td><strong>Bộ nhớ bán dẫn</strong></td><td>Có thể là <strong>MỘT TRONG HAI</strong> — bay hơi hoặc không</td></tr>
<tr><td><strong>Nonerasable — không xoá được</strong></td><td>Không sửa được, trừ khi <strong>PHÁ HUỶ ĐƠN VỊ LƯU TRỮ</strong> · Bộ nhớ bán dẫn loại này gọi là <strong>ROM (read-only memory)</strong></td></tr>
<tr><td><strong>Organization — tổ chức</strong></td><td>Với bộ nhớ truy cập ngẫu nhiên, tổ chức là vấn đề thiết kế then chốt · Tổ chức = <strong>CÁCH SẮP XẾP VẬT LÝ CÁC BIT THÀNH TỪ</strong></td></tr>
</table>
<ul>
<li><strong>"Tự rã" không phải câu nói cho có.</strong> DRAM mất điện tích NGAY CẢ KHI đang có nguồn, nên nó phải được <em>LÀM TƯƠI (refresh)</em> hàng nghìn lần mỗi giây (Ch.6). Tính bay hơi có hai mặt: mất khi cúp điện, và rã liên tục trong lúc chạy. SRAM chỉ dính mặt thứ nhất.</li>
<li><strong>Dòng đáng thuộc lòng: bộ nhớ bán dẫn có thể là MỘT TRONG HAI.</strong> SRAM và DRAM bay hơi; ROM, EPROM và flash là bán dẫn mà KHÔNG bay hơi. Vậy suy luận "bán dẫn ⇒ bay hơi" là SAI, và đó là mẹo ưa thích của câu trắc nghiệm.</li>
<li><strong>Bay hơi và xoá được là HAI TRỤC ĐỘC LẬP.</strong> Flash thì không bay hơi <em>VÀ</em> xoá được. ROM mặt nạ thì không bay hơi và không xoá được. DRAM thì bay hơi và xoá được. Ô thứ tư không dùng trong thực tế — bay hơi mà không xoá được thì vô dụng. Vẽ cái lưới 2×2 một lần là chốt xong từ vựng.</li>
<li><strong>Vì sao "tổ chức là vấn đề thiết kế then chốt" với bộ nhớ truy cập ngẫu nhiên.</strong> Cùng một số bit có thể đấu thành 1M × 8 hay 4M × 2 hay 8M × 1 — cùng dung lượng, khác số chân dữ liệu, khác giá, khác cách đi mạch. Đây đúng là câu "rộng hơn thay vì sâu hơn" của Ch.2 nhìn từ phía con chip, và Ch.6 sẽ dựng mô-đun nhớ từ chính những lựa chọn này.</li>
<li><strong>Mỗi kiểu ngày nay nằm ở đâu.</strong> Bán dẫn: thanh ghi, cache, DRAM, SSD. Bề mặt từ: ổ cứng, băng từ. Quang: CD/DVD/Blu-ray. Từ-quang: coi như đã tuyệt chủng — nó có trong danh sách cho đủ bộ, và bạn nên nói thẳng như vậy chứ đừng làm như nó còn thời sự.</li>
</ul>
<p class="meo">💡 Hai câu kiểm cho bất kỳ thiết bị nào: <em>mất điện có còn không?</em> (bay hơi / không bay hơi) và <em>ghi đè tại chỗ được không?</em> (xoá được / không xoá được). Trả lời xong hai câu là bạn đã điền đủ dòng "Physical Characteristics" của Table 4.1 cho thiết bị đó.</p>`],

      [14, 'Memory Hierarchy — how much, how fast, how expensive: the three-way trade-off',
        `<p class="y-chinh">🎯 The question that starts the whole chapter. Design constraints on a computer's memory reduce to <strong>three questions — how much, how fast, how expensive</strong> — and the slide's answer is that you cannot win all three at once.</p>
<table>
<tr><th>The slide's three relationships</th><th>Read it as</th></tr>
<tr><td>Faster access time, <strong>greater</strong> cost per bit</td><td>Speed is bought with money</td></tr>
<tr><td>Greater capacity, <strong>smaller</strong> cost per bit</td><td>Bulk is cheap per bit</td></tr>
<tr><td>Greater capacity, <strong>slower</strong> access time</td><td>Bulk is slow</td></tr>
</table>
<ul>
<li><strong>Chain the three and the dilemma appears.</strong> You want lots of memory (question 1) → so you want the cheap-per-bit technology → but that technology is slow (relationship 3) → and the processor needs fast (question 2) → which costs money (relationship 1) → which limits how much you can buy. The three constraints close a loop; there is no single technology that escapes it.</li>
<li><strong>Why no technology is good at all three — the physics in one line.</strong> Fast memory needs a cell that drives a long wire quickly and its own comparison/addressing logic per location; that means more transistors per bit (SRAM uses six per bit), more area, more money. Cheap memory uses one transistor and one capacitor (DRAM) or no transistor at all (magnetic surface), so it is dense and cheap — and slow, because a tiny charge or a moving head takes time to read. <em>Density and speed are enemies at the device level</em>, and no amount of engineering has ever broken that.</li>
<li><strong>The escape is not a better device, it is an ORGANIZATION.</strong> The hierarchy sidesteps the trade-off: build the machine out of <em>several</em> technologies, put a little of the fast-expensive one near the processor and a lot of the slow-cheap one behind it, and let locality make the combination behave, on average, like the fast one at nearly the price of the cheap one. Slides 25 and 26 prove both halves of that claim with arithmetic.</li>
<li><strong>The condition, spelled out.</strong> The hierarchy only pays if, as you go down the levels, all three of the following hold together: decreasing cost per bit, increasing capacity, increasing access time — <em>and</em> <strong>decreasing frequency of access by the processor</strong>. That fourth condition is the one supplied by locality, and it is the one that is not about hardware at all.</li>
<li><strong>Connect to Ch.2's Amdahl's law.</strong> If memory stalls occupy fraction <em>f</em> of run time, removing them entirely gives a speedup of 1/(1−f). For f = 0,4 that is 1/0,6 = <strong>1,667×</strong>; removing only 90% of them gives 1/(0,6 + 0,04) = <strong>1,5625×</strong>. This is why designers spend transistor budget on cache rather than on more ALUs: the memory term is usually the biggest single slice of <em>f</em>.</li>
</ul>
<p class="meo">💡 Three questions, three words: <strong>how much · how fast · how expensive</strong> — capacity, speed, cost. Whenever an exam asks "why is there a memory hierarchy", the expected answer is these three plus "locality makes the combination work". Two sentences, full marks.</p>`,
        `<p class="y-chinh">🎯 Câu hỏi mở màn cả chương. Ràng buộc thiết kế bộ nhớ của một máy tính rút gọn thành <strong>BA CÂU HỎI — bao nhiêu, nhanh cỡ nào, đắt bao nhiêu</strong> — và câu trả lời của slide là: bạn KHÔNG thắng được cả ba cùng lúc.</p>
<table>
<tr><th>Ba quan hệ trên slide</th><th>Đọc thành</th></tr>
<tr><td>Truy cập càng NHANH, giá mỗi bit càng <strong>CAO</strong></td><td>Tốc độ mua bằng tiền</td></tr>
<tr><td>Dung lượng càng LỚN, giá mỗi bit càng <strong>THẤP</strong></td><td>Hàng khối thì rẻ tính trên mỗi bit</td></tr>
<tr><td>Dung lượng càng LỚN, truy cập càng <strong>CHẬM</strong></td><td>Hàng khối thì chậm</td></tr>
</table>
<ul>
<li><strong>Nối ba quan hệ lại là thấy thế bí.</strong> Bạn muốn NHIỀU bộ nhớ (câu hỏi 1) → nên bạn muốn công nghệ rẻ-trên-mỗi-bit → nhưng công nghệ đó chậm (quan hệ 3) → mà bộ xử lý cần NHANH (câu hỏi 2) → cái đó tốn tiền (quan hệ 1) → tiền lại giới hạn bạn mua được bao nhiêu. Ba ràng buộc khép thành một vòng; không công nghệ đơn lẻ nào thoát ra được.</li>
<li><strong>Vì sao không công nghệ nào giỏi cả ba — vật lý gói trong một dòng.</strong> Bộ nhớ nhanh cần một ô có khả năng kéo dây dài thật nhanh và có mạch so sánh/đánh địa chỉ riêng cho từng vị trí; nghĩa là nhiều transistor hơn trên mỗi bit (SRAM dùng SÁU cái một bit), nhiều diện tích hơn, nhiều tiền hơn. Bộ nhớ rẻ dùng một transistor và một tụ (DRAM) hoặc không transistor nào (bề mặt từ), nên nó dày đặc và rẻ — và chậm, vì đọc một điện tích tí hon hay chờ một cái đầu từ chạy tới thì mất thời gian. <em>MẬT ĐỘ và TỐC ĐỘ là kẻ thù của nhau ngay ở mức linh kiện</em>, và chưa có kỹ thuật nào phá được điều đó.</li>
<li><strong>Lối thoát KHÔNG phải một linh kiện tốt hơn, mà là một CÁCH TỔ CHỨC.</strong> Phân cấp đi vòng qua thế bí: dựng máy bằng <em>NHIỀU</em> công nghệ, để một ít loại nhanh-đắt sát bộ xử lý và thật nhiều loại chậm-rẻ ở phía sau, rồi để tính cục bộ làm cho tổ hợp đó cư xử, TÍNH TRUNG BÌNH, gần như loại nhanh mà gần như giá của loại rẻ. Slide 25 và 26 chứng minh cả hai nửa của lời khẳng định đó bằng phép tính.</li>
<li><strong>Nói rõ điều kiện.</strong> Phân cấp chỉ có lời nếu khi đi xuống các mức, cả ba điều sau đồng thời đúng: giá mỗi bit GIẢM, dung lượng TĂNG, thời gian truy cập TĂNG — <em>VÀ</em> <strong>TẦN SUẤT bộ xử lý truy cập GIẢM</strong>. Điều kiện thứ tư ấy do tính cục bộ cung cấp, và nó hoàn toàn không phải chuyện phần cứng.</li>
<li><strong>Nối sang định luật Amdahl ở Ch.2.</strong> Nếu thời gian chờ bộ nhớ chiếm tỉ lệ <em>f</em> của tổng thời gian chạy, xoá sạch nó cho tăng tốc 1/(1−f). Với f = 0,4 thì đó là 1/0,6 = <strong>1,667 lần</strong>; xoá được 90% thôi thì 1/(0,6 + 0,04) = <strong>1,5625 lần</strong>. Đó là lý do người thiết kế đổ ngân sách transistor vào cache chứ không vào thêm ALU: phần bộ nhớ thường là lát lớn nhất trong <em>f</em>.</li>
</ul>
<p class="meo">💡 Ba câu hỏi, ba chữ: <strong>BAO NHIÊU · NHANH CỠ NÀO · ĐẮT BAO NHIÊU</strong> — dung lượng, tốc độ, giá. Đề nào hỏi "vì sao phải có phân cấp bộ nhớ" thì đáp án cần có ba thứ đó cộng thêm "tính cục bộ làm cho tổ hợp ấy chạy được". Hai câu, trọn điểm.</p>`],

      [15, 'Figure 4.6 — The Memory Hierarchy (the pyramid)',
        `<p class="y-chinh">🎯 The famous pyramid, read from the tip down. Six levels, four zones, and one rule: <strong>every step down is bigger, cheaper per bit and slower</strong>.</p>
<table>
<tr><th>Level (top → bottom)</th><th>Technology named on the slide</th><th>Zone</th></tr>
<tr><td>CPU → <strong>Registers</strong></td><td>—</td><td rowspan="2">On-chip storage</td></tr>
<tr><td><strong>Cache</strong></td><td>Multiple cache levels (SRAM, eDRAM)</td></tr>
<tr><td><strong>Main Memory</strong></td><td>DRAM, SDRAM, DDR-SDRAM, etc.</td><td>Inboard storage</td></tr>
<tr><td><strong>Solid-State Memory</strong></td><td>Flash Memory (SSD, flash drive)</td><td rowspan="2">Outboard storage</td></tr>
<tr><td><strong>Virtual Memory and File/Database Memory</strong></td><td>Magnetic Disk</td></tr>
<tr><td><strong>Offline Bulk Memory</strong></td><td>Magnetic Tape</td><td>Offline storage</td></tr>
</table>
<ul>
<li><strong>Why it is drawn as a triangle, not a ladder.</strong> The width encodes capacity. A few kB of registers at the tip, tens of MB of cache, tens of GB of DRAM, TB of disk, and effectively unlimited tape at the base. The picture is to scale in meaning even though it cannot be to scale in ink.</li>
<li><strong>The four zone labels on the right are the real structure.</strong> <em>On-chip</em> (registers + cache — inside the processor die) · <em>Inboard</em> (main memory — on the motherboard, directly addressed) · <em>Outboard</em> (SSD and disk — reached through I/O controllers) · <em>Offline</em> (tape — not even connected until someone loads it). The Location row of Table 4.1 (internal versus external) cuts exactly between "inboard" and "outboard".</li>
<li><strong>Note what the 11th edition changed.</strong> Solid-state (flash) now has its own level between DRAM and magnetic disk. Older editions of this pyramid went straight from main memory to disk. If you have seen a five-level version, it is the older one — and the SSD level exists because flash genuinely sits between DRAM and disk on <em>all three</em> axes.</li>
<li><strong>Who manages each level is not on this figure but is on Table 4.2 (slide 19).</strong> Registers: the compiler. Cache: processor hardware. Main memory: the OS. Secondary memory: OS/user. That column is the answer to "is this transparent to the programmer?" and it changes level by level.</li>
<li><strong>Read the pyramid as a sequence of two-level memories.</strong> Registers/cache, cache/DRAM, DRAM/disk, disk/tape — each adjacent pair is exactly the M1/M2 pair of slide 24, and each is priced by the same formula on slide 17. The hierarchy is not four different ideas; it is one idea applied four times.</li>
</ul>
<p class="pitfall">⚠️ Trap: calling flash "main memory" because an SSD is fast. Location in this pyramid is defined by <em>how the processor reaches it</em>, not by speed. Flash is reached through a controller, so it is outboard/external — even an NVMe drive on the PCIe bus.</p>`,
        `<p class="y-chinh">🎯 Kim tự tháp trứ danh, đọc từ chóp xuống. Sáu mức, bốn vùng, một quy tắc: <strong>mỗi bước đi xuống là to hơn, rẻ hơn trên mỗi bit, và chậm hơn</strong>.</p>
<table>
<tr><th>Mức (trên → dưới)</th><th>Công nghệ slide ghi</th><th>Vùng</th></tr>
<tr><td>CPU → <strong>Registers</strong> (thanh ghi)</td><td>—</td><td rowspan="2">On-chip storage — lưu trữ trên chip</td></tr>
<tr><td><strong>Cache</strong></td><td>Nhiều mức cache (SRAM, eDRAM)</td></tr>
<tr><td><strong>Main Memory</strong> (bộ nhớ chính)</td><td>DRAM, SDRAM, DDR-SDRAM, v.v.</td><td>Inboard storage — trên bo mạch</td></tr>
<tr><td><strong>Solid-State Memory</strong> (bộ nhớ thể rắn)</td><td>Bộ nhớ flash (SSD, USB flash)</td><td rowspan="2">Outboard storage — ngoài bo mạch</td></tr>
<tr><td><strong>Virtual Memory and File/Database Memory</strong></td><td>Đĩa từ</td></tr>
<tr><td><strong>Offline Bulk Memory</strong> (kho ngoại tuyến)</td><td>Băng từ</td><td>Offline storage — ngoại tuyến</td></tr>
</table>
<ul>
<li><strong>Vì sao vẽ thành tam giác chứ không phải cái thang.</strong> Bề rộng mã hoá DUNG LƯỢNG. Vài kB thanh ghi ở chóp, vài chục MB cache, vài chục GB DRAM, hàng TB đĩa, và băng từ thì coi như vô hạn ở đáy. Bức hình đúng tỉ lệ về Ý NGHĨA dù không thể đúng tỉ lệ về mực in.</li>
<li><strong>Bốn nhãn vùng bên phải mới là cấu trúc thật.</strong> <em>On-chip</em> (thanh ghi + cache — nằm trong chính đế chip bộ xử lý) · <em>Inboard</em> (bộ nhớ chính — trên bo mạch chủ, đánh địa chỉ trực tiếp) · <em>Outboard</em> (SSD và đĩa — với tới qua bộ điều khiển I/O) · <em>Offline</em> (băng từ — thậm chí chưa nối vào máy cho tới khi có người lắp). Dòng Location của Table 4.1 (trong hay ngoài) cắt đúng giữa "inboard" và "outboard".</li>
<li><strong>Để ý bản 11th ed đã đổi gì.</strong> Thể rắn (flash) nay có mức riêng nằm giữa DRAM và đĩa từ. Các bản cũ của kim tự tháp này đi thẳng từ bộ nhớ chính xuống đĩa. Nếu bạn từng thấy bản năm mức thì đó là bản cũ — và mức SSD tồn tại vì flash thật sự nằm giữa DRAM và đĩa trên <em>CẢ BA</em> trục.</li>
<li><strong>Ai quản lý mỗi mức thì không có trên hình này mà có trên Table 4.2 (slide 19).</strong> Thanh ghi: trình biên dịch. Cache: phần cứng bộ xử lý. Bộ nhớ chính: hệ điều hành. Bộ nhớ thứ cấp: hệ điều hành/người dùng. Cột đó chính là câu trả lời cho "cái này có trong suốt với lập trình viên không?" và nó thay đổi theo từng mức.</li>
<li><strong>Đọc kim tự tháp như một CHUỖI các bộ nhớ hai mức.</strong> Thanh ghi/cache, cache/DRAM, DRAM/đĩa, đĩa/băng — mỗi cặp kề nhau chính là cặp M1/M2 của slide 24, và mỗi cặp được định giá bằng đúng công thức ở slide 17. Phân cấp không phải bốn ý tưởng khác nhau; nó là MỘT ý tưởng áp bốn lần.</li>
</ul>
<p class="pitfall">⚠️ Bẫy: gọi flash là "bộ nhớ chính" vì SSD nhanh. Vị trí trong kim tự tháp này định nghĩa theo <em>BỘ XỬ LÝ VỚI TỚI NÓ BẰNG CÁCH NÀO</em>, không theo tốc độ. Flash phải qua bộ điều khiển nên nó thuộc outboard/ngoài — kể cả ổ NVMe cắm trên bus PCIe.</p>`],

      [16, 'Figure 4.7 — Relative Cost, Size, and Speed Characteristics Across the Memory Hierarchy',
        `<p class="y-chinh">🎯 The pyramid redrawn as a <strong>curve on three axes</strong>, which is the honest way to see the trade-off. Vertical: increasing cost per bit and increasing transfer rate. Horizontal: increasing access time, and underneath it a second arrow, increasing size.</p>
<table>
<tr><th>Position on the curve (top-left → bottom-right)</th><th>Meaning</th></tr>
<tr><td>Registers</td><td>Most expensive per bit, fastest, smallest</td></tr>
<tr><td>On-chip cache</td><td></td></tr>
<tr><td>Off-chip cache</td><td></td></tr>
<tr><td>Main Memory</td><td>The knee of the curve</td></tr>
<tr><td>Flash Memory</td><td></td></tr>
<tr><td>Disk</td><td></td></tr>
<tr><td>Off-line storage (tape)</td><td>Cheapest per bit, slowest, largest</td></tr>
</table>
<ul>
<li><strong>The single most important feature is that the curve is a HYPERBOLA, not a straight line.</strong> It plunges steeply at the top-left, then flattens along the bottom. Meaning: going from registers to cache to DRAM costs you enormous speed for modest capacity, but going from disk to tape buys almost no further price reduction. <em>The interesting engineering is all at the top-left.</em></li>
<li><strong>Two vertical labels, one axis — and that is deliberate.</strong> "Increasing cost per bit" and "increasing transfer rate" are drawn as the same direction. They are not the same quantity, but in practice they move together: the technology you pay more for is the one that hands over bits faster. That coupling <em>is</em> the trade-off of slide 14, drawn.</li>
<li><strong>Two horizontal labels, also one direction.</strong> "Increasing access time" and "increasing size" both point right. So the picture packs all four quantities (cost, rate, time, size) onto two axes, and the reason it can do that is that they are not independent — they are chained by the three relationships on slide 14.</li>
<li><strong>The gap the figure understates.</strong> Both axes are qualitative here, with no numbers. Put real numbers on them and the picture would be unreadable: from the measurement on slide 5, L1 is 1,29 ns and DRAM is 129 ns — a factor of 100 — and a disk seek is about 10 ms, another factor of 10<sup>5</sup>. On a linear axis registers and cache would be the same dot.</li>
<li><strong>"Off-chip cache" is worth noticing.</strong> It exists as a separate point because crossing the chip boundary costs real time — driving an external pin is far slower than an on-die wire. It is the same reason the z13 (slide 21) puts L1/L2/L3 on the PU chip and only L4 on a separate SC chip.</li>
</ul>
<p class="meo">💡 One sentence for the exam: <strong>as you go down the hierarchy — cost per bit decreases, capacity increases, access time increases, and frequency of access by the processor decreases.</strong> Four clauses. The first three are physics (this figure); the fourth is locality, and it is the one that makes the arrangement work.</p>`,
        `<p class="y-chinh">🎯 Kim tự tháp vẽ lại thành một <strong>ĐƯỜNG CONG trên BA TRỤC</strong>, và đó mới là cách nhìn thành thật về sự đánh đổi. Trục đứng: giá mỗi bit TĂNG và tốc độ truyền TĂNG. Trục ngang: thời gian truy cập TĂNG, và bên dưới nó một mũi tên thứ hai — kích thước TĂNG.</p>
<table>
<tr><th>Vị trí trên đường cong (trên-trái → dưới-phải)</th><th>Ý nghĩa</th></tr>
<tr><td>Registers — thanh ghi</td><td>Đắt nhất trên mỗi bit, nhanh nhất, nhỏ nhất</td></tr>
<tr><td>On-chip cache — cache trên chip</td><td></td></tr>
<tr><td>Off-chip cache — cache ngoài chip</td><td></td></tr>
<tr><td>Main Memory — bộ nhớ chính</td><td>Chỗ gấp khúc của đường cong</td></tr>
<tr><td>Flash Memory</td><td></td></tr>
<tr><td>Disk — đĩa</td><td></td></tr>
<tr><td>Off-line storage (tape) — băng từ</td><td>Rẻ nhất trên mỗi bit, chậm nhất, lớn nhất</td></tr>
</table>
<ul>
<li><strong>Đặc điểm quan trọng nhất là đường cong này là HYPERBOL, không phải đường thẳng.</strong> Nó lao dốc ở góc trên-trái rồi nằm bẹp dọc theo đáy. Nghĩa là: đi từ thanh ghi sang cache sang DRAM thì bạn mất tốc độ khủng khiếp mà chỉ được thêm dung lượng vừa phải, còn đi từ đĩa sang băng từ thì hầu như không giảm giá thêm được nữa. <em>Mọi chỗ kỹ thuật thú vị đều nằm ở góc trên-trái.</em></li>
<li><strong>Hai nhãn trên trục đứng, chung một trục — và đó là cố ý.</strong> "Giá mỗi bit tăng" và "tốc độ truyền tăng" được vẽ cùng một chiều. Chúng không phải cùng một đại lượng, nhưng trên thực tế chúng đi cùng nhau: công nghệ bạn trả nhiều tiền hơn cũng là công nghệ trao bit ra nhanh hơn. Sự gắn kết đó CHÍNH LÀ sự đánh đổi của slide 14, vẽ ra.</li>
<li><strong>Hai nhãn trên trục ngang, cũng một chiều.</strong> "Thời gian truy cập tăng" và "kích thước tăng" đều chỉ sang phải. Vậy bức hình nhồi cả bốn đại lượng (giá, tốc độ truyền, thời gian, kích thước) lên hai trục, và nó làm được vì chúng KHÔNG độc lập — chúng bị xích vào nhau bởi ba quan hệ ở slide 14.</li>
<li><strong>Chỗ hình này nói nhẹ đi.</strong> Cả hai trục ở đây đều định tính, không có số. Đặt số thật vào thì hình sẽ không đọc nổi: theo phép đo ở slide 5, L1 là 1,29 ns còn DRAM là 129 ns — chênh 100 lần — và một lần tìm kiếm trên đĩa cỡ 10 ms, chênh thêm 10<sup>5</sup> lần nữa. Trên trục tuyến tính thì thanh ghi và cache sẽ là cùng một chấm.</li>
<li><strong>"Off-chip cache" đáng để ý.</strong> Nó là một điểm riêng vì vượt qua ranh giới con chip tốn thời gian thật — kéo một chân ra ngoài chậm hơn nhiều so với một sợi dây trong đế. Cũng chính lý do đó khiến z13 (slide 21) để L1/L2/L3 trên chip PU và chỉ để L4 trên một chip SC riêng.</li>
</ul>
<p class="meo">💡 Một câu để đi thi: <strong>đi xuống theo phân cấp — giá mỗi bit GIẢM, dung lượng TĂNG, thời gian truy cập TĂNG, và tần suất bộ xử lý truy cập GIẢM.</strong> Bốn vế. Ba vế đầu là vật lý (hình này); vế thứ tư là tính cục bộ, và nó mới là vế làm cho cách sắp xếp này chạy được.</p>`],

      [17, 'Figure 4.8 — Performance of a Simple Two-Level Memory',
        `<p class="y-chinh">🎯 The most exam-relevant slide of the chapter. A straight line from <strong>T<sub>1</sub> + T<sub>2</sub></strong> at hit ratio 0 down to <strong>T<sub>1</sub></strong> at hit ratio 1. Read the two endpoints and you have reconstructed the formula — which is not printed anywhere on this deck.</p>
<p class="nhan">📐 The formula (from the book, section 4.3; the slide shows only its graph):</p>
<pre>T_s = H × T1 + (1 − H) × (T1 + T2)
    = T1 + (1 − H) × T2

T1 = access time of the FAST level (M1, e.g. cache)
T2 = access time of the SLOW level (M2, e.g. main memory)
H  = hit ratio = fraction of accesses found in M1
Ts = average access time seen by the processor</pre>
<ul>
<li><strong>Why the two forms are identical.</strong> Expand the first: H·T1 + T1 + T2 − H·T1 − H·T2 = T1 + (1 − H)·T2. The T1 terms cancel, which tells you something physical: <em>you always pay T1</em> — you look in the cache first, every time — and you additionally pay T2 only on the (1 − H) fraction that misses. Check against the figure: at H = 0 the formula gives T1 + T2 ✓, at H = 1 it gives T1 ✓. Both endpoints match the slide exactly.</li>
<li><strong>The line is STRAIGHT, and that matters.</strong> Average access time is <em>linear</em> in the hit ratio. There is no diminishing return in the formula itself — every extra percent of hit ratio buys the same absolute saving, 0,01 × T2. What is hard is <em>getting</em> that extra percent, which is Figure 4.13's problem, not this one's.</li>
</ul>
<p class="nhan">📐 <strong>Four worked cases with T1 = 1 ns (cache) and T2 = 100 ns (DRAM)</strong> — the ratio measured on a real machine in slide 5:</p>
<table>
<tr><th>H</th><th>T<sub>s</sub> = 1 + (1 − H) × 100</th><th>Result</th><th>How much slower than pure cache</th></tr>
<tr><td>0,90</td><td>1 + 0,10 × 100</td><td><strong>11 ns</strong></td><td>11×</td></tr>
<tr><td>0,95</td><td>1 + 0,05 × 100</td><td><strong>6 ns</strong></td><td>6×</td></tr>
<tr><td>0,99</td><td>1 + 0,01 × 100</td><td><strong>2 ns</strong></td><td>2×</td></tr>
<tr><td>0,999</td><td>1 + 0,001 × 100</td><td><strong>1,1 ns</strong></td><td>1,1×</td></tr>
</table>
<p class="dap-an">✅ Read the table as a shock, because it is one. A hit ratio of <strong>95% — which sounds excellent — still leaves the memory six times slower than the cache</strong>. Moving 90% → 95% halves the time (11 → 6); moving 95% → 99% cuts it by another factor of three (6 → 2); and only at 99,9% does the DRAM essentially disappear. <strong>The useful region of this formula starts at about 0,95 and the interesting part is above 0,99.</strong> Sanity check with the unexpanded form at H = 0,95: 0,95 × 1 + 0,05 × 101 = 0,95 + 5,05 = 6 ✓.</p>
<p class="nhan">📐 <strong>The reverse question, the one the exam actually asks: "what hit ratio do you need for an average access time of at most 2 ns?"</strong></p>
<pre>T1 + (1 − H) × T2   ≤ 2
1 + (1 − H) × 100   ≤ 2
    (1 − H) × 100   ≤ 1
         (1 − H)    ≤ 0,01
                H   ≥ 0,99</pre>
<p class="dap-an">✅ Answer: <strong>H ≥ 0,99 — at least 99%.</strong> Check: 1 + 0,01 × 100 = 2 ns exactly ✓. Same method for a 1,5 ns target: (1 − H) ≤ 0,5/100 = 0,005, so <strong>H ≥ 0,995</strong>. Notice the pattern — halving the excess over T1 requires halving the miss rate, so each extra nanosecond you shave doubles the demand on the cache.</p>
<p class="pitfall">⚠️ Two traps in one formula. (1) Some textbooks and lecturers use <strong>T<sub>s</sub> = H·T1 + (1 − H)·T2</strong> — <em>without</em> the T1 inside the miss term — meaning "on a miss you go straight to M2 and that is all it costs". Both conventions appear in exams; they differ by exactly (1 − H)·T1. Read the question: if it says "on a miss, the block is copied to M1 and then accessed from M1" (slide 24's wording), you must include T1, so use T1 + (1 − H)·T2. If unsure, state your convention in the answer — that is what earns the mark. (2) Never mix up hit ratio H with miss ratio (1 − H); a question giving "miss rate 5%" means H = 0,95.</p>`,
        `<p class="y-chinh">🎯 Slide sát đề thi nhất của cả chương. Một đường thẳng từ <strong>T<sub>1</sub> + T<sub>2</sub></strong> tại tỉ lệ trúng 0 xuống tới <strong>T<sub>1</sub></strong> tại tỉ lệ trúng 1. Đọc được hai đầu mút là dựng lại được công thức — mà công thức thì KHÔNG in ở bất cứ đâu trong deck này.</p>
<p class="nhan">📐 Công thức (lấy từ SÁCH, mục 4.3; slide chỉ vẽ đồ thị của nó):</p>
<pre>T_s = H × T1 + (1 − H) × (T1 + T2)
    = T1 + (1 − H) × T2

T1 = thời gian truy cập mức NHANH (M1, vd cache)
T2 = thời gian truy cập mức CHẬM (M2, vd bộ nhớ chính)
H  = tỉ lệ trúng = phần truy cập tìm thấy ngay ở M1
Ts = thời gian truy cập TRUNG BÌNH mà bộ xử lý nhìn thấy</pre>
<ul>
<li><strong>Vì sao hai dạng là một.</strong> Khai triển dạng đầu: H·T1 + T1 + T2 − H·T1 − H·T2 = T1 + (1 − H)·T2. Các số hạng T1 triệt tiêu, và điều đó nói lên một ý vật lý: <em>bạn LUÔN trả T1</em> — lần nào cũng phải ngó vào cache trước — và chỉ trả THÊM T2 trên phần (1 − H) bị trượt. Đối chiếu với hình: tại H = 0 công thức cho T1 + T2 ✓, tại H = 1 cho T1 ✓. Cả hai đầu mút khớp y hệt slide.</li>
<li><strong>Đường là THẲNG, và điều đó có ý nghĩa.</strong> Thời gian truy cập trung bình TUYẾN TÍNH theo tỉ lệ trúng. Bản thân công thức không hề có "lợi ích giảm dần" — thêm mỗi phần trăm tỉ lệ trúng đều tiết kiệm đúng bấy nhiêu, 0,01 × T2. Cái KHÓ là <em>KIẾM ĐƯỢC</em> thêm phần trăm đó, và đó là bài toán của Figure 4.13, không phải của hình này.</li>
</ul>
<p class="nhan">📐 <strong>Bốn ca giải trọn với T1 = 1 ns (cache) và T2 = 100 ns (DRAM)</strong> — đúng tỉ số đã đo trên máy thật ở slide 5:</p>
<table>
<tr><th>H</th><th>T<sub>s</sub> = 1 + (1 − H) × 100</th><th>Kết quả</th><th>Chậm hơn cache thuần bao nhiêu</th></tr>
<tr><td>0,90</td><td>1 + 0,10 × 100</td><td><strong>11 ns</strong></td><td>11 lần</td></tr>
<tr><td>0,95</td><td>1 + 0,05 × 100</td><td><strong>6 ns</strong></td><td>6 lần</td></tr>
<tr><td>0,99</td><td>1 + 0,01 × 100</td><td><strong>2 ns</strong></td><td>2 lần</td></tr>
<tr><td>0,999</td><td>1 + 0,001 × 100</td><td><strong>1,1 ns</strong></td><td>1,1 lần</td></tr>
</table>
<p class="dap-an">✅ Hãy đọc bảng này như một cú sốc, vì nó đúng là như vậy. Tỉ lệ trúng <strong>95% — nghe thì tuyệt vời — vẫn để bộ nhớ chậm hơn cache SÁU LẦN</strong>. Đi từ 90% lên 95% là giảm một nửa thời gian (11 → 6); từ 95% lên 99% giảm thêm ba lần nữa (6 → 2); và phải tới 99,9% thì DRAM mới coi như biến mất. <strong>Vùng có ích của công thức này bắt đầu từ khoảng 0,95 và phần thú vị nằm TRÊN 0,99.</strong> Kiểm chéo bằng dạng chưa khai triển tại H = 0,95: 0,95 × 1 + 0,05 × 101 = 0,95 + 5,05 = 6 ✓.</p>
<p class="nhan">📐 <strong>Bài NGƯỢC, đúng dạng đề thi hay ra: "muốn thời gian truy cập trung bình không quá 2 ns thì tỉ lệ trúng tối thiểu là bao nhiêu?"</strong></p>
<pre>T1 + (1 − H) × T2   ≤ 2
1 + (1 − H) × 100   ≤ 2
    (1 − H) × 100   ≤ 1
         (1 − H)    ≤ 0,01
                H   ≥ 0,99</pre>
<p class="dap-an">✅ Đáp án: <strong>H ≥ 0,99 — ít nhất 99%.</strong> Kiểm lại: 1 + 0,01 × 100 = 2 ns đúng bằng ✓. Cùng cách đó cho mục tiêu 1,5 ns: (1 − H) ≤ 0,5/100 = 0,005, vậy <strong>H ≥ 0,995</strong>. Để ý quy luật — muốn giảm một nửa phần vượt trên T1 thì phải giảm một nửa tỉ lệ trượt, nên mỗi nano giây gọt thêm là gấp đôi đòi hỏi đặt lên cache.</p>
<p class="pitfall">⚠️ Hai cái bẫy trong một công thức. (1) Một số giáo trình và thầy cô dùng <strong>T<sub>s</sub> = H·T1 + (1 − H)·T2</strong> — KHÔNG có T1 trong phần trượt — hiểu là "trượt thì đi thẳng xuống M2 và chỉ tốn có thế". Cả hai quy ước đều xuất hiện trong đề; chúng lệch nhau đúng (1 − H)·T1. Hãy ĐỌC KỸ ĐỀ: nếu đề nói "khi trượt, khối được chép lên M1 rồi mới truy cập qua M1" (đúng lời của slide 24) thì PHẢI có T1, tức dùng T1 + (1 − H)·T2. Không chắc thì hãy GHI RÕ quy ước mình dùng ngay trong bài — đó mới là chỗ ăn điểm. (2) Đừng bao giờ lẫn tỉ lệ TRÚNG H với tỉ lệ TRƯỢT (1 − H); đề cho "tỉ lệ trượt 5%" nghĩa là H = 0,95.</p>`],

      [18, 'Figure 4.9 — Exploiting Locality in the Memory Hierarchy (with typical transfer size)',
        `<p class="y-chinh">🎯 The pyramid again, but now the arrows between levels are labelled with <strong>what actually moves, and how big it is</strong>. This is where spatial locality becomes a concrete number.</p>
<table>
<tr><th>Between these two levels</th><th>Unit transferred</th><th>Typical size</th></tr>
<tr><td>Registers ↔ L1 cache</td><td><strong>Words</strong></td><td>32 bits</td></tr>
<tr><td>L1 cache ↔ … ↔ L<em>n</em> cache</td><td><strong>Cache blocks</strong></td><td>32 bytes</td></tr>
<tr><td>L<em>n</em> cache ↔ Main memory</td><td><strong>Cache blocks</strong></td><td>32 bytes</td></tr>
<tr><td>Main memory ↔ Virtual memory (disk)</td><td><strong>Virtual memory pages</strong></td><td>1 kB</td></tr>
</table>
<ul>
<li><strong>The transfer unit GROWS as you go down, and that is the diagram's whole message.</strong> 4 bytes → 32 bytes → 1 kB. Why: the slower the lower level, the more fixed cost (latency) you pay per trip, so the more you must carry per trip to amortise it. That is exactly the T<sub>N</sub> = T<sub>A</sub> + N/R arithmetic from slide 12, applied as a design rule.</li>
<li><strong>Only the top arrow moves a WORD.</strong> Registers ↔ cache transfers exactly what one instruction asked for, because the cache is fast enough that there is nothing to amortise. Every arrow below that moves a <em>block</em>, i.e. deliberately more than was asked for — <strong>that surplus IS the bet on spatial locality</strong>.</li>
<li><strong>The dots between L1 and L<em>n</em> mean "however many levels your machine happens to have".</strong> The book refuses to fix the number, because it is 2, 3 or 4 depending on the processor — and 4 on the z13 of slide 21. What is fixed is the <em>relationship</em> between adjacent levels, not the count.</li>
<li><strong>"1 kB" for a page is the book's illustrative figure, not today's number.</strong> Real systems use 4 kB as the standard page (x86-64, ARM64), with 2 MB and 1 GB huge pages available. Likewise, a real cache line today is 64 bytes, not 32. Learn the <em>pattern</em> (word &lt; block &lt; page) and quote the slide's numbers when asked for the slide's numbers.</li>
<li><strong>Cross-check with slide 6's measurement.</strong> On the machine measured there, a 64-byte line holds 8 doubles — which is why walking a matrix by row (8 uses per miss) beat walking by column (1 use per miss) by about 3,4×. Figure 4.9 is the design; slide 6 is the consequence.</li>
</ul>
<p class="meo">💡 Remember the ladder as <strong>word → block → page</strong>, managed respectively by the <strong>compiler → hardware → OS</strong> (Table 4.2, slide 19). Three names, three sizes, three managers — and they line up one-to-one.</p>`,
        `<p class="y-chinh">🎯 Lại kim tự tháp, nhưng lần này mũi tên giữa các mức được ghi rõ <strong>CÁI GÌ thực sự di chuyển, và nó to bằng nào</strong>. Đây là chỗ cục bộ không gian biến thành một con số cụ thể.</p>
<table>
<tr><th>Giữa hai mức này</th><th>Đơn vị được truyền</th><th>Kích thước điển hình</th></tr>
<tr><td>Thanh ghi ↔ L1 cache</td><td><strong>Từ (word)</strong></td><td>32 bit</td></tr>
<tr><td>L1 cache ↔ … ↔ L<em>n</em> cache</td><td><strong>Khối cache</strong></td><td>32 byte</td></tr>
<tr><td>L<em>n</em> cache ↔ Bộ nhớ chính</td><td><strong>Khối cache</strong></td><td>32 byte</td></tr>
<tr><td>Bộ nhớ chính ↔ Bộ nhớ ảo (đĩa)</td><td><strong>Trang bộ nhớ ảo</strong></td><td>1 kB</td></tr>
</table>
<ul>
<li><strong>Đơn vị truyền LỚN DẦN khi đi xuống, và đó là toàn bộ thông điệp của sơ đồ.</strong> 4 byte → 32 byte → 1 kB. Vì sao: mức dưới càng chậm thì chi phí CỐ ĐỊNH (độ trễ) trả cho mỗi chuyến càng lớn, nên mỗi chuyến càng phải chở nhiều để chia đều chi phí đó ra. Đúng là phép tính T<sub>N</sub> = T<sub>A</sub> + N/R của slide 12, áp thành quy tắc thiết kế.</li>
<li><strong>Chỉ mũi tên trên cùng chở một TỪ.</strong> Thanh ghi ↔ cache chở đúng cái mà một lệnh yêu cầu, vì cache đủ nhanh nên chẳng có gì để chia đều. Mọi mũi tên phía dưới đều chở một <em>KHỐI</em>, tức CỐ Ý chở nhiều hơn yêu cầu — <strong>phần dôi ra đó CHÍNH LÀ canh bạc đặt vào cục bộ không gian</strong>.</li>
<li><strong>Ba chấm giữa L1 và L<em>n</em> nghĩa là "máy của bạn có bao nhiêu mức thì bấy nhiêu".</strong> Sách cố tình không chốt con số, vì nó là 2, 3 hay 4 tuỳ bộ xử lý — và là 4 trên z13 ở slide 21. Thứ cố định là QUAN HỆ giữa hai mức kề nhau, không phải số lượng mức.</li>
<li><strong>"1 kB" cho một trang là con số minh hoạ của sách, không phải con số hôm nay.</strong> Hệ thống thật dùng trang chuẩn 4 kB (x86-64, ARM64), kèm trang lớn 2 MB và 1 GB. Tương tự, dòng cache thật ngày nay là 64 byte chứ không phải 32. Hãy học QUY LUẬT (từ &lt; khối &lt; trang) và trả về đúng số của slide khi đề hỏi số của slide.</li>
<li><strong>Đối chiếu với phép đo ở slide 6.</strong> Trên máy đo ở đó, một dòng 64 byte chứa 8 số double — và đó là lý do duyệt ma trận theo hàng (8 lần dùng cho mỗi lần trượt) thắng duyệt theo cột (1 lần dùng cho mỗi lần trượt) khoảng 3,4 lần. Figure 4.9 là thiết kế; slide 6 là hệ quả.</li>
</ul>
<p class="meo">💡 Nhớ cái thang là <strong>TỪ → KHỐI → TRANG</strong>, do lần lượt <strong>TRÌNH BIÊN DỊCH → PHẦN CỨNG → HỆ ĐIỀU HÀNH</strong> quản (Table 4.2, slide 19). Ba tên, ba kích thước, ba người quản — và chúng khớp một-một.</p>`],

      [19, 'Table 4.2 — Characteristics of Memory Devices in a Memory Architecture',
        `<p class="y-chinh">🎯 One table that tells you, for every level, <strong>what it is made of, what moves in and out of it, and WHO decides</strong>. The last column is the one students underuse and examiners love.</p>
<table>
<tr><th>Memory level</th><th>Typical technology</th><th>Unit of transfer with next larger level (typical size)</th><th>Managed by</th></tr>
<tr><td>Registers</td><td>CMOS</td><td>Word (32 bits)</td><td><strong>Compiler</strong></td></tr>
<tr><td>Cache</td><td>Static RAM (SRAM); Embedded dynamic RAM (eDRAM)</td><td>Cache block (32 bytes)</td><td><strong>Processor hardware</strong></td></tr>
<tr><td>Main memory</td><td>DRAM</td><td>Virtual memory page (1 kB)</td><td><strong>Operating system (OS)</strong></td></tr>
<tr><td>Secondary memory</td><td>Magnetic disk</td><td>Disk sector (512 bytes)</td><td><strong>OS/user</strong></td></tr>
<tr><td>Offline bulk memory</td><td>Magnetic tape</td><td><em>(blank on the slide)</em></td><td><strong>OS/User</strong></td></tr>
</table>
<ul>
<li><strong>The "Managed by" column is the real content.</strong> It answers "who moves the data, and is it visible to the programmer?" — Registers: the <em>compiler</em> chooses what lives in them, so register allocation is a compile-time decision you can influence by how you write code. Cache: <em>pure hardware</em>, completely invisible — you cannot address a cache line, only hope for it. Main memory ↔ disk: the <em>OS</em>, through virtual memory and page faults. Disk ↔ tape: <em>OS/user</em>, i.e. a human or a backup script decides.</li>
<li><strong>That column also explains the whole of Chapter 9.</strong> Virtual memory is "OS-managed two-level memory", which is why slide 23 lists it alongside cache as another instance of the same idea. Cache is invisible to the OS; virtual memory is not, because the OS has to handle the page fault.</li>
<li><strong>Read the "Unit of transfer" column as "with the NEXT LARGER level".</strong> So the 32-byte cache block on the Cache row is what moves between cache and main memory, and the 1 kB page on the Main memory row is what moves between main memory and disk. Mis-reading it as "what this level is internally made of" gets every row wrong.</li>
<li><strong>eDRAM in the Cache row is worth a note.</strong> Embedded DRAM is denser than SRAM (one transistor instead of six) so you can fit far more of it on a die, at the cost of speed and refresh. It is used for big last-level caches — the z13's 64 MB L3 and 480 MB L4 on slide 21 are both eDRAM, while its L1/L2 are SRAM. Table 4.2 and Figure 4.10 agree exactly.</li>
<li><strong>Cross-check with Table 4.1.</strong> "Typical technology" is Table 4.1's <em>Physical Type</em> row; "Unit of transfer" is Table 4.1's <em>Unit of Transfer</em> row. Table 4.2 is Table 4.1 filled in, level by level, for a real machine.</li>
</ul>
<p class="pitfall">⚠️ The "Unit of transfer" cell on the <strong>Offline bulk memory</strong> row is <em>blank on the original slide</em> — no size is given for tape. That is the slide, not an omission in this lesson. If an exam asks, the sensible answer is that tape transfers by <em>record</em> or <em>block</em> (sequential access, slide 11), but do not attribute a number to the slide that is not there.</p>`,
        `<p class="y-chinh">🎯 Một bảng cho biết, ở mỗi mức, <strong>nó làm bằng gì, cái gì ra vào nó, và AI quyết định</strong>. Cột cuối là cột sinh viên hay bỏ phí còn người ra đề thì rất thích.</p>
<table>
<tr><th>Mức bộ nhớ</th><th>Công nghệ điển hình</th><th>Đơn vị truyền với mức LỚN HƠN KẾ TIẾP (kích thước điển hình)</th><th>Do ai quản lý</th></tr>
<tr><td>Registers — thanh ghi</td><td>CMOS</td><td>Từ (32 bit)</td><td><strong>Trình biên dịch</strong></td></tr>
<tr><td>Cache</td><td>SRAM tĩnh; eDRAM (DRAM nhúng)</td><td>Khối cache (32 byte)</td><td><strong>Phần cứng bộ xử lý</strong></td></tr>
<tr><td>Main memory — bộ nhớ chính</td><td>DRAM</td><td>Trang bộ nhớ ảo (1 kB)</td><td><strong>Hệ điều hành (OS)</strong></td></tr>
<tr><td>Secondary memory — bộ nhớ thứ cấp</td><td>Đĩa từ</td><td>Sector đĩa (512 byte)</td><td><strong>OS/người dùng</strong></td></tr>
<tr><td>Offline bulk memory — kho ngoại tuyến</td><td>Băng từ</td><td><em>(BỎ TRỐNG trên slide)</em></td><td><strong>OS/người dùng</strong></td></tr>
</table>
<ul>
<li><strong>Cột "Do ai quản lý" mới là nội dung thật.</strong> Nó trả lời "ai chuyển dữ liệu, và lập trình viên có thấy không?" — Thanh ghi: <em>TRÌNH BIÊN DỊCH</em> chọn cái gì nằm trong đó, nên cấp phát thanh ghi là quyết định lúc biên dịch mà bạn tác động được qua cách viết mã. Cache: <em>THUẦN PHẦN CỨNG</em>, hoàn toàn vô hình — bạn không đánh địa chỉ được một dòng cache, chỉ có thể HY VỌNG. Bộ nhớ chính ↔ đĩa: <em>HỆ ĐIỀU HÀNH</em>, qua bộ nhớ ảo và lỗi trang. Đĩa ↔ băng: <em>OS/người dùng</em>, tức một con người hay một script sao lưu quyết định.</li>
<li><strong>Cột đó cũng giải thích trọn Chương 9.</strong> Bộ nhớ ảo là "bộ nhớ hai mức do OS quản", nên slide 23 mới xếp nó cạnh cache như một hiện thân khác của cùng một ý. Cache vô hình với OS; bộ nhớ ảo thì không, vì OS phải xử lý lỗi trang.</li>
<li><strong>Đọc cột "Đơn vị truyền" là "với mức LỚN HƠN KẾ TIẾP".</strong> Vậy khối cache 32 byte ở dòng Cache là thứ di chuyển giữa cache và bộ nhớ chính, còn trang 1 kB ở dòng Bộ nhớ chính là thứ di chuyển giữa bộ nhớ chính và đĩa. Đọc nhầm thành "mức này bên trong làm bằng gì" là sai cả bảng.</li>
<li><strong>Chữ eDRAM ở dòng Cache đáng ghi chú.</strong> DRAM nhúng đặc hơn SRAM (một transistor thay vì sáu) nên nhét được nhiều hơn hẳn trên một đế, đổi lại chậm hơn và phải làm tươi. Nó dùng cho cache mức cuối cỡ lớn — L3 64 MB và L4 480 MB của z13 ở slide 21 đều là eDRAM, còn L1/L2 của nó là SRAM. Table 4.2 và Figure 4.10 khớp nhau chằn chặn.</li>
<li><strong>Đối chiếu với Table 4.1.</strong> "Công nghệ điển hình" chính là dòng <em>Physical Type</em> của Table 4.1; "Đơn vị truyền" chính là dòng <em>Unit of Transfer</em>. Table 4.2 là Table 4.1 đã điền xong, từng mức một, cho một cỗ máy thật.</li>
</ul>
<p class="pitfall">⚠️ Ô "Đơn vị truyền" của dòng <strong>Offline bulk memory</strong> <em>BỎ TRỐNG trên slide gốc</em> — không có kích thước nào cho băng từ. Đó là slide chứ không phải bài này thiếu. Đề có hỏi thì câu trả lời hợp lý là băng truyền theo <em>bản ghi</em> hoặc <em>khối</em> (truy cập tuần tự, slide 11), nhưng đừng gán cho slide một con số nó không có.</p>`],

      [20, 'Memory — three levels of semiconductor memory, and external mass storage',
        `<p class="y-chinh">🎯 A short consolidating slide. Three bullets that close the loop between the pyramid (slide 15) and the technologies that fill it.</p>
<ul>
<li><strong>Bullet 1 — "the use of three levels exploits the fact that semiconductor memory comes in a variety of types which differ in speed and cost".</strong> The three levels meant here are <em>registers, cache, main memory</em> — all three made of semiconductors, all three inside the machine, and yet spread over orders of magnitude in speed and price. That variety within one material is what makes an on-chip hierarchy possible at all; you do not need a different physics for each level, only a different cell design (six-transistor SRAM versus one-transistor-one-capacitor DRAM, Ch.6).</li>
<li><strong>Bullet 2 — "data are stored more permanently on external mass storage devices".</strong> The word carrying the weight is <em>permanently</em>. The three semiconductor levels are volatile (slide 13): power off, contents gone. Persistence is the job of the levels below, and it is a <em>different</em> requirement from speed or capacity — it is the reason the hierarchy cannot stop at DRAM no matter how cheap DRAM gets.</li>
<li><strong>Bullet 3 — "external, nonvolatile memory is also referred to as SECONDARY memory or AUXILIARY memory".</strong> Three names for the same thing: external memory = secondary memory = auxiliary memory. Table 4.2 uses "secondary memory"; Figure 4.6 says "outboard storage"; exam questions use all of them interchangeably. Learn the synonyms, they are free marks.</li>
<li><strong>What "main" memory means, by contrast.</strong> Main memory is <em>primary</em> memory: the one the processor can address directly, the one programs actually run from. Secondary memory always has to be copied into primary memory before the processor can use it — which is precisely the M2 → M1 block transfer of slide 24.</li>
<li><strong>A modern footnote worth saying out loud.</strong> Non-volatile memory technologies (flash, and research classes like MRAM/PCM) are blurring this line — an SSD is semiconductor <em>and</em> nonvolatile <em>and</em> external. The book handles this by giving flash its own level in Figure 4.6 rather than forcing it into "main" or "disk". The taxonomy is older than the technology, and the pyramid was amended to fit.</li>
</ul>
<p class="meo">💡 Three-word summary of this slide: <strong>variety · permanence · synonyms</strong>. Semiconductors give you variety of speed, external devices give you permanence, and "external = secondary = auxiliary" is the vocabulary you must not lose marks on.</p>`,
        `<p class="y-chinh">🎯 Một slide chốt lại ngắn gọn. Ba gạch đầu dòng khép vòng giữa kim tự tháp (slide 15) và các công nghệ lấp vào đó.</p>
<ul>
<li><strong>Gạch 1 — "dùng ba mức là khai thác việc bộ nhớ bán dẫn có NHIỀU LOẠI khác nhau về tốc độ và giá".</strong> Ba mức nói ở đây là <em>thanh ghi, cache, bộ nhớ chính</em> — cả ba đều làm bằng bán dẫn, cả ba đều nằm trong máy, vậy mà trải ra hàng mấy bậc mười về tốc độ lẫn giá. Chính sự đa dạng TRONG CÙNG MỘT VẬT LIỆU ấy mới làm cho phân cấp trên chip khả thi; bạn không cần một nền vật lý khác cho mỗi mức, chỉ cần một thiết kế ô khác (SRAM sáu transistor so với DRAM một transistor một tụ, Ch.6).</li>
<li><strong>Gạch 2 — "dữ liệu được lưu LÂU BỀN hơn trên thiết bị lưu trữ khối lượng lớn bên ngoài".</strong> Chữ mang sức nặng là <em>LÂU BỀN</em>. Ba mức bán dẫn đều bay hơi (slide 13): cúp điện là mất sạch. Tính bền là việc của các mức dưới, và đó là một đòi hỏi <em>KHÁC</em> với tốc độ hay dung lượng — nó là lý do phân cấp không thể dừng ở DRAM dù DRAM có rẻ tới đâu.</li>
<li><strong>Gạch 3 — "bộ nhớ ngoài, không bay hơi còn được gọi là bộ nhớ THỨ CẤP (secondary) hay bộ nhớ PHỤ TRỢ (auxiliary)".</strong> Ba tên gọi cho cùng một thứ: bộ nhớ ngoài = bộ nhớ thứ cấp = bộ nhớ phụ trợ. Table 4.2 dùng "secondary memory"; Figure 4.6 nói "outboard storage"; đề thi dùng lẫn lộn cả ba. Học thuộc bộ từ đồng nghĩa này, đó là điểm cho không.</li>
<li><strong>Vậy "bộ nhớ chính" nghĩa là gì, để đối chiếu.</strong> Bộ nhớ chính là bộ nhớ <em>SƠ CẤP (primary)</em>: cái mà bộ xử lý đánh địa chỉ trực tiếp được, cái mà chương trình thật sự chạy trên đó. Bộ nhớ thứ cấp LUÔN phải được chép vào bộ nhớ sơ cấp trước khi bộ xử lý dùng được — đúng là phép chuyển khối M2 → M1 của slide 24.</li>
<li><strong>Một chú thích thời sự đáng nói thẳng.</strong> Các công nghệ nhớ không bay hơi (flash, và những lớp đang nghiên cứu như MRAM/PCM) đang làm nhoè ranh giới này — một ổ SSD vừa bán dẫn, vừa không bay hơi, vừa ở ngoài. Sách xử lý bằng cách cho flash hẳn một mức riêng trong Figure 4.6 thay vì ép nó vào "bộ nhớ chính" hay "đĩa". Bảng phân loại có tuổi đời già hơn công nghệ, nên kim tự tháp phải sửa lại cho vừa.</li>
</ul>
<p class="meo">💡 Ba chữ tóm slide này: <strong>ĐA DẠNG · BỀN · TỪ ĐỒNG NGHĨA</strong>. Bán dẫn cho bạn sự đa dạng về tốc độ, thiết bị ngoài cho bạn tính bền, và "ngoài = thứ cấp = phụ trợ" là bộ từ vựng không được để mất điểm.</p>`],

      [21, 'Figure 4.10 — IBM z13 Memory Hierarchy',
        `<p class="y-chinh">🎯 Everything abstract in this chapter, made concrete by one real machine: the IBM z13 mainframe. <strong>Four cache levels</strong>, split instruction/data at L1 and L2, and a 480 MB L4 — numbers that look absurd until you see why each one is there.</p>
<table>
<tr><th>Level</th><th>Size and technology</th><th>How many</th></tr>
<tr><td>L1 I-cache</td><td>96 kB SRAM</td><td rowspan="4">1 per core, 8 cores per PU chip → 8 per PU chip</td></tr>
<tr><td>L1 D-cache</td><td>128 kB SRAM</td></tr>
<tr><td>L2 I-cache</td><td>2 MB SRAM</td></tr>
<tr><td>L2 D-cache</td><td>2 MB SRAM</td></tr>
<tr><td>L3 cache</td><td>64 MB <strong>eDRAM</strong></td><td>1 per PU chip (shared by its 8 cores)</td></tr>
<tr><td>L4 cache</td><td>480 MB <strong>eDRAM</strong>, on a separate <strong>SC chip</strong></td><td>1 per node; 1 node = 3 PU chips; 2 nodes per drawer; up to 8 nodes = 4 drawers in a CPC</td></tr>
<tr><td>Main (physical) memory</td><td>2,5 TB DRAM per drawer → <strong>10 TB per CPC</strong></td><td>—</td></tr>
<tr><td>Secondary (virtual) memory</td><td>Disk array or storage network</td><td>—</td></tr>
</table>
<ul>
<li><strong>Do the arithmetic the slide invites.</strong> 8 cores per PU chip × 3 PU chips per node = <strong>24 cores per node</strong>; 2 nodes per drawer = 48 cores per drawer; 4 drawers per CPC = <strong>192 cores</strong>. Memory: 2,5 TB per drawer × 4 drawers = <strong>10 TB</strong> ✓ — which is exactly the figure printed on the slide, so the two numbers cross-check each other.</li>
<li><strong>L1 and L2 are SPLIT (I and D), L3 and L4 are UNIFIED. That is Figure 4.3 in silicon.</strong> Close to the core, instruction and data streams have separate address humps and separate bandwidth demands, so they get separate caches. Far from the core, the streams have merged and a single shared pool is more efficient. The split/unified boundary is not arbitrary — it is where the two humps stop mattering.</li>
<li><strong>SRAM up top, eDRAM below — read that as the cost axis of slide 16.</strong> SRAM is fast and needs six transistors per bit; eDRAM is slower and needs one transistor plus a capacitor. So the small, fast levels are SRAM and the huge ones (64 MB, 480 MB) are eDRAM. Table 4.2 named both technologies on the Cache row; here you see which is used where and why.</li>
<li><strong>Note the scope of each level, not just its size.</strong> L1/L2 are <em>private to a core</em>, L3 is <em>shared by 8 cores on a chip</em>, L4 is <em>shared by a whole node of 3 chips</em>. The hierarchy is not only about speed — it is also about how many cores have to agree on a value, which is exactly the <strong>coherence</strong> principle of slide 22 and the subject of Ch.20/Ch.21.</li>
<li><strong>Why a mainframe and not a laptop?</strong> Because the z13 exists to run transaction workloads with enormous working sets — databases and batch jobs where Figure 4.4's popularity cliff is measured in hundreds of gigabytes. A 480 MB L4 only pays for itself if the miss it prevents costs a DRAM trip across a node, which on a 192-core machine it does.</li>
</ul>
<p class="meo">💡 If you must memorise one thing from this slide, memorise the <em>shape</em>, not the sizes: <strong>96/128 kB → 2 MB → 64 MB → 480 MB → 10 TB</strong>. Each step is roughly 20–30× bigger than the one above it. That constant ratio between levels is the real design pattern, and it repeats on every modern processor.</p>`,
        `<p class="y-chinh">🎯 Mọi thứ trừu tượng của chương này được làm cho cụ thể bằng một cỗ máy thật: máy lớn IBM z13. <strong>BỐN mức cache</strong>, tách lệnh/dữ liệu ở L1 và L2, và một L4 480 MB — những con số nghe vô lý cho tới khi bạn hiểu vì sao từng cái có mặt.</p>
<table>
<tr><th>Mức</th><th>Kích thước và công nghệ</th><th>Có bao nhiêu</th></tr>
<tr><td>L1 I-cache (lệnh)</td><td>96 kB SRAM</td><td rowspan="4">1 cho mỗi lõi, 8 lõi mỗi chip PU → 8 bộ mỗi chip PU</td></tr>
<tr><td>L1 D-cache (dữ liệu)</td><td>128 kB SRAM</td></tr>
<tr><td>L2 I-cache</td><td>2 MB SRAM</td></tr>
<tr><td>L2 D-cache</td><td>2 MB SRAM</td></tr>
<tr><td>L3 cache</td><td>64 MB <strong>eDRAM</strong></td><td>1 cho mỗi chip PU (8 lõi dùng chung)</td></tr>
<tr><td>L4 cache</td><td>480 MB <strong>eDRAM</strong>, trên một <strong>chip SC</strong> riêng</td><td>1 cho mỗi node; 1 node = 3 chip PU; 2 node mỗi ngăn kéo; tối đa 8 node = 4 ngăn kéo trong một CPC</td></tr>
<tr><td>Bộ nhớ chính (vật lý)</td><td>2,5 TB DRAM mỗi ngăn kéo → <strong>10 TB mỗi CPC</strong></td><td>—</td></tr>
<tr><td>Bộ nhớ thứ cấp (ảo)</td><td>Dàn đĩa hoặc mạng lưu trữ</td><td>—</td></tr>
</table>
<ul>
<li><strong>Làm luôn phép tính mà slide mời gọi.</strong> 8 lõi mỗi chip PU × 3 chip PU mỗi node = <strong>24 lõi mỗi node</strong>; 2 node mỗi ngăn kéo = 48 lõi mỗi ngăn; 4 ngăn mỗi CPC = <strong>192 lõi</strong>. Bộ nhớ: 2,5 TB mỗi ngăn × 4 ngăn = <strong>10 TB</strong> ✓ — đúng bằng con số in trên slide, nên hai con số tự đối chiếu được cho nhau.</li>
<li><strong>L1 và L2 TÁCH (I và D), L3 và L4 GỘP. Đó là Figure 4.3 hiện hình trên silicon.</strong> Sát lõi thì dòng lệnh và dòng dữ liệu có hai bướu địa chỉ riêng và hai nhu cầu băng thông riêng, nên chúng được cache riêng. Xa lõi thì hai dòng đã trộn vào nhau và một bể dùng chung hiệu quả hơn. Ranh giới tách/gộp không tuỳ tiện — nó nằm đúng chỗ hai cái bướu thôi còn quan trọng.</li>
<li><strong>SRAM ở trên, eDRAM ở dưới — đọc đó chính là trục GIÁ của slide 16.</strong> SRAM nhanh và cần sáu transistor mỗi bit; eDRAM chậm hơn và cần một transistor cộng một tụ. Nên các mức nhỏ-nhanh là SRAM còn các mức khổng lồ (64 MB, 480 MB) là eDRAM. Table 4.2 đã kể cả hai công nghệ ở dòng Cache; ở đây bạn thấy cái nào dùng ở đâu và vì sao.</li>
<li><strong>Để ý PHẠM VI của mỗi mức, không chỉ kích thước.</strong> L1/L2 là <em>riêng của một lõi</em>, L3 <em>dùng chung cho 8 lõi trên một chip</em>, L4 <em>dùng chung cho cả một node gồm 3 chip</em>. Phân cấp không chỉ nói về tốc độ — nó còn nói về việc BAO NHIÊU LÕI phải thống nhất với nhau về một giá trị, đúng là nguyên lý <strong>COHERENCE</strong> của slide 22 và là đề tài của Ch.20/Ch.21.</li>
<li><strong>Sao lại lấy máy lớn mà không lấy laptop?</strong> Vì z13 sinh ra để chạy tải giao dịch với vùng làm việc khổng lồ — cơ sở dữ liệu và việc theo lô, nơi vách đá phổ biến của Figure 4.4 đo bằng hàng trăm gigabyte. Một L4 480 MB chỉ bõ tiền nếu lần trượt mà nó chặn được phải trả giá bằng một chuyến DRAM băng qua cả node, mà trên cỗ máy 192 lõi thì đúng là như vậy.</li>
</ul>
<p class="meo">💡 Nếu buộc phải thuộc một thứ từ slide này thì hãy thuộc <em>HÌNH DÁNG</em>, đừng thuộc kích thước: <strong>96/128 kB → 2 MB → 64 MB → 480 MB → 10 TB</strong>. Mỗi bậc to hơn bậc trên nó chừng 20–30 lần. Cái tỉ số gần như không đổi giữa các mức đó mới là mẫu thiết kế thật, và nó lặp lại trên mọi bộ xử lý hiện đại.</p>`],

      [22, 'Design Principles for a Memory Hierarchy — locality, inclusion, coherence',
        `<p class="y-chinh">🎯 Three principles, three arrows. Any memory hierarchy that violates one of them is broken — and each principle is a whole later topic in disguise.</p>
<table>
<tr><th>Principle</th><th>The slide's own definition</th></tr>
<tr><td><strong>Locality</strong></td><td>The principle that <strong>makes effective use of a memory hierarchy possible</strong></td></tr>
<tr><td><strong>Inclusion</strong></td><td>All information items are originally stored in level <strong>M<sub>n</sub></strong>, where <em>n</em> is the level <strong>most remote from the processor</strong></td></tr>
<tr><td><strong>Coherence</strong></td><td>Copies of the same data unit in <strong>adjacent</strong> memory levels must be <strong>consistent</strong> · If a word is modified in the cache, copies of that word must be updated <strong>immediately or eventually</strong> at all higher levels</td></tr>
</table>
<ul>
<li><strong>Locality is the ENABLING principle, not a rule the hardware obeys.</strong> The other two are obligations on the designer; this one is an observation about programs. Read the three as: locality says <em>it can work</em>, inclusion says <em>where the truth lives</em>, coherence says <em>keep the copies honest</em>.</li>
<li><strong>Inclusion, stated the useful way.</strong> Everything at level <em>i</em> is also present at level <em>i+1</em>. A cache never holds the <em>only</em> copy of something — main memory has it too (possibly stale), disk has it too. That is why you can simply discard a clean cache line with no bookkeeping, and why a cache miss is always serviceable: the data is guaranteed to be somewhere below.</li>
<li><strong>Coherence, and the two words that decide everything: "immediately or eventually".</strong> That phrase names the two cache write policies of Ch.5 — <strong>write-through</strong> (immediately: every write goes to memory as well, simple but slow) and <strong>write-back</strong> (eventually: mark the line dirty and write it out only when it is evicted, fast but you must track dirty bits). One slide bullet, two chapters of consequence.</li>
<li><strong>Coherence gets much harder with many cores.</strong> On the z13 of slide 21, eight cores each have private L1/L2 and share L3. If core 0 writes a word that core 5 holds in its L1, coherence demands that core 5 be told. That is the <em>cache coherence problem</em> and the MESI protocol of Ch.20/Ch.21 — and it is why multicore machines do not scale linearly.</li>
<li><strong>How the three interact.</strong> Inclusion makes coherence tractable (you always know where the authoritative copy should end up). Locality makes the whole arrangement profitable. Drop inclusion and a miss might find the data nowhere; drop coherence and a program reads a value it already overwrote; drop locality and the hierarchy still works <em>correctly</em> but gives you no speed at all — see Figure 4.13's "No Locality" diagonal.</li>
</ul>
<p class="meo">💡 Three words, three questions: <strong>Locality</strong> — <em>is it worth it?</em> · <strong>Inclusion</strong> — <em>where is the original?</em> · <strong>Coherence</strong> — <em>are the copies telling the same story?</em> If an exam asks for "the design principles of a memory hierarchy", these three names plus one line each is the full answer.</p>`,
        `<p class="y-chinh">🎯 Ba nguyên lý, ba mũi tên. Phân cấp bộ nhớ nào vi phạm một trong ba là hỏng — và mỗi nguyên lý là một chủ đề lớn phía sau đang cải trang.</p>
<table>
<tr><th>Nguyên lý</th><th>Định nghĩa nguyên văn của slide</th></tr>
<tr><td><strong>Locality — tính cục bộ</strong></td><td>Nguyên lý <strong>LÀM CHO việc dùng phân cấp bộ nhớ một cách hiệu quả trở nên KHẢ THI</strong></td></tr>
<tr><td><strong>Inclusion — tính bao hàm</strong></td><td>Mọi mục thông tin ban đầu đều được lưu ở mức <strong>M<sub>n</sub></strong>, với <em>n</em> là mức <strong>XA BỘ XỬ LÝ NHẤT</strong></td></tr>
<tr><td><strong>Coherence — tính nhất quán</strong></td><td>Các bản sao của cùng một đơn vị dữ liệu ở những mức <strong>KỀ NHAU</strong> phải <strong>NHẤT QUÁN</strong> · Nếu một từ bị sửa trong cache thì bản sao của từ đó phải được cập nhật <strong>NGAY hoặc SỚM MUỘN</strong> ở mọi mức cao hơn</td></tr>
</table>
<ul>
<li><strong>Locality là nguyên lý CHO PHÉP, không phải một luật mà phần cứng phải tuân.</strong> Hai cái kia là nghĩa vụ đặt lên người thiết kế; cái này là một QUAN SÁT về chương trình. Đọc ba cái thành: locality nói <em>làm được</em>, inclusion nói <em>sự thật nằm ở đâu</em>, coherence nói <em>giữ cho các bản sao thành thật</em>.</li>
<li><strong>Inclusion, phát biểu theo cách dùng được.</strong> Mọi thứ ở mức <em>i</em> đều CÓ MẶT ở mức <em>i+1</em>. Cache không bao giờ giữ bản sao <em>DUY NHẤT</em> của thứ gì — bộ nhớ chính cũng có (có thể cũ), đĩa cũng có. Nhờ vậy bạn có thể vứt thẳng một dòng cache sạch mà không cần sổ sách gì, và nhờ vậy mọi lần trượt đều phục vụ được: dữ liệu chắc chắn nằm đâu đó bên dưới.</li>
<li><strong>Coherence, và hai chữ quyết định tất cả: "NGAY hoặc SỚM MUỘN".</strong> Cụm đó gọi tên hai chính sách ghi cache của Ch.5 — <strong>write-through</strong> (ngay: mỗi lần ghi là ghi luôn xuống bộ nhớ, đơn giản nhưng chậm) và <strong>write-back</strong> (sớm muộn: đánh dấu dòng bẩn rồi chỉ ghi ra khi bị đuổi, nhanh nhưng phải theo dõi bit bẩn). Một gạch đầu dòng, hệ quả trải hai chương.</li>
<li><strong>Coherence khó lên rất nhiều khi có nhiều lõi.</strong> Trên z13 ở slide 21, tám lõi mỗi lõi có L1/L2 riêng và dùng chung L3. Nếu lõi 0 ghi một từ mà lõi 5 đang giữ trong L1 của nó thì coherence đòi phải báo cho lõi 5 biết. Đó là <em>bài toán nhất quán cache</em> và giao thức MESI của Ch.20/Ch.21 — và là lý do máy đa lõi không tăng tốc tuyến tính.</li>
<li><strong>Ba cái tương tác với nhau thế nào.</strong> Inclusion làm cho coherence xử lý được (bạn luôn biết bản sao có thẩm quyền rốt cuộc phải nằm ở đâu). Locality làm cho cả cách sắp xếp này có lời. Bỏ inclusion thì một lần trượt có thể chẳng tìm thấy dữ liệu ở đâu; bỏ coherence thì chương trình đọc lại một giá trị nó vừa ghi đè; bỏ locality thì phân cấp vẫn chạy ĐÚNG nhưng không cho bạn tốc độ nào cả — xem đường chéo "No Locality" của Figure 4.13.</li>
</ul>
<p class="meo">💡 Ba chữ, ba câu hỏi: <strong>Locality</strong> — <em>có bõ không?</em> · <strong>Inclusion</strong> — <em>bản gốc ở đâu?</em> · <strong>Coherence</strong> — <em>các bản sao có kể cùng một câu chuyện không?</em> Đề hỏi "các nguyên lý thiết kế của phân cấp bộ nhớ" thì ba cái tên này cộng mỗi cái một dòng là đáp án đầy đủ.</p>`],

      [23, 'Two-Level Memory Access — cache, virtual memory and disk cache',
        `<p class="y-chinh">🎯 The chapter now narrows from "a hierarchy" to "<strong>any two adjacent levels</strong>", because that is the unit the arithmetic works on. And the slide names <strong>three</strong> instances of the same pattern.</p>
<table>
<tr><th>Instance</th><th>M1 (fast, small)</th><th>M2 (slow, big)</th><th>Implemented in</th></tr>
<tr><td><strong>Cache</strong></td><td>Cache</td><td>Main memory</td><td>Hardware — part of the computer <em>architecture</em>, typically <strong>invisible to the operating system</strong></td></tr>
<tr><td><strong>Virtual memory</strong></td><td>Main memory</td><td>Disk</td><td>At least partially in the <strong>operating system</strong></td></tr>
<tr><td><strong>Disk cache</strong></td><td>Main memory buffer</td><td>Disk</td><td>At least partially in the <strong>operating system</strong></td></tr>
</table>
<ul>
<li><strong>The slide's own sentences, kept exact.</strong> "A cache acts as a buffer between main memory and processor, creating a two-level internal memory." · "Exploits locality to provide improved performance over a comparable one-level memory." · "The main memory cache mechanism is part of the computer architecture, implemented in hardware and typically invisible to the operating system." · "Two other instances of a two-level memory approach that also exploit locality and that are, at least partially, implemented in the operating system are virtual memory and the disk cache."</li>
<li><strong>Why "invisible to the operating system" is a strong claim, and worth a mark.</strong> There is no instruction to put a value in the cache, no way to ask which lines are resident. Software cannot see it — which is why cache is called <em>transparent</em>. Virtual memory is the opposite: a page fault is a trap the OS must handle, so the OS is very much aware of it.</li>
<li><strong>Cache is "part of the computer ARCHITECTURE" — note the word.</strong> By Ch.1's distinction, architecture is what is visible to the programmer and organization is how it is implemented. The book's phrasing here is loose; most treatments call cache an <em>organization</em> feature precisely because it is invisible. Report the slide's wording, but be ready to justify either reading — the safe answer is "hardware-implemented and transparent to software".</li>
<li><strong>Virtual memory versus disk cache — they are not the same thing.</strong> Virtual memory uses disk to <em>extend</em> main memory (address space bigger than RAM). A disk cache uses main memory to <em>speed up</em> disk (a buffer holding recently used sectors). Same two devices, opposite directions of the favour. Both exploit the same locality, and both are priced by the same formula.</li>
<li><strong>The pattern generalises far beyond this course.</strong> A CDN in front of a web server, a Redis cache in front of a database, a browser cache in front of the network — all are M1/M2 pairs, all are priced by slide 17's formula, and Figure 4.4 measured the hit ratio for exactly one of them.</li>
</ul>
<p class="meo">💡 Three instances, one table to memorise: <strong>cache = hardware, invisible; virtual memory = OS, extends capacity; disk cache = OS, improves speed.</strong> Being able to say what M1 and M2 are in each case is what turns a definition question into a full-mark answer.</p>`,
        `<p class="y-chinh">🎯 Chương giờ thu hẹp từ "một phân cấp" xuống "<strong>HAI MỨC KỀ NHAU BẤT KỲ</strong>", vì đó mới là đơn vị mà phép tính làm việc trên đó. Và slide gọi tên <strong>BA</strong> hiện thân của cùng một mẫu.</p>
<table>
<tr><th>Hiện thân</th><th>M1 (nhanh, nhỏ)</th><th>M2 (chậm, lớn)</th><th>Cài đặt ở đâu</th></tr>
<tr><td><strong>Cache</strong></td><td>Cache</td><td>Bộ nhớ chính</td><td>Phần cứng — thuộc <em>KIẾN TRÚC</em> máy tính, thường <strong>VÔ HÌNH với hệ điều hành</strong></td></tr>
<tr><td><strong>Bộ nhớ ảo</strong></td><td>Bộ nhớ chính</td><td>Đĩa</td><td>Ít nhất một phần nằm trong <strong>HỆ ĐIỀU HÀNH</strong></td></tr>
<tr><td><strong>Disk cache</strong></td><td>Vùng đệm trên bộ nhớ chính</td><td>Đĩa</td><td>Ít nhất một phần nằm trong <strong>HỆ ĐIỀU HÀNH</strong></td></tr>
</table>
<ul>
<li><strong>Nguyên văn các câu của slide, giữ đúng.</strong> "Cache đóng vai trò vùng đệm giữa bộ nhớ chính và bộ xử lý, tạo ra một bộ nhớ trong HAI MỨC." · "Khai thác tính cục bộ để cho hiệu năng tốt hơn một bộ nhớ một-mức tương đương." · "Cơ chế cache của bộ nhớ chính thuộc về kiến trúc máy tính, cài đặt bằng phần cứng và thường VÔ HÌNH với hệ điều hành." · "Hai hiện thân khác của cách tiếp cận hai-mức, cũng khai thác tính cục bộ và ít nhất một phần được cài trong hệ điều hành, là BỘ NHỚ ẢO và DISK CACHE."</li>
<li><strong>Vì sao "vô hình với hệ điều hành" là một khẳng định mạnh, và đáng một điểm.</strong> Không có lệnh nào để đặt một giá trị vào cache, không có cách nào hỏi xem dòng nào đang nằm trong đó. Phần mềm không thấy nó — vì thế cache mới gọi là <em>TRONG SUỐT</em>. Bộ nhớ ảo thì ngược lại: lỗi trang là một cái bẫy mà hệ điều hành phải xử lý, nên hệ điều hành biết rất rõ.</li>
<li><strong>Cache "thuộc về KIẾN TRÚC máy tính" — chú ý chữ này.</strong> Theo phân biệt ở Ch.1, kiến trúc là thứ lập trình viên NHÌN THẤY còn tổ chức là cách hiện thực. Cách diễn đạt của slide ở đây hơi lỏng; đa số tài liệu xếp cache vào <em>TỔ CHỨC</em> chính vì nó vô hình. Cứ thuật lại lời slide, nhưng hãy sẵn sàng biện minh cho cả hai cách đọc — câu trả lời an toàn là "cài bằng phần cứng và trong suốt với phần mềm".</li>
<li><strong>Bộ nhớ ảo với disk cache — KHÔNG phải một thứ.</strong> Bộ nhớ ảo dùng đĩa để <em>MỞ RỘNG</em> bộ nhớ chính (không gian địa chỉ lớn hơn RAM). Disk cache dùng bộ nhớ chính để <em>TĂNG TỐC</em> đĩa (một vùng đệm giữ các sector vừa dùng). Cùng hai thiết bị, ngược chiều ban ơn. Cả hai khai thác cùng một tính cục bộ, và cả hai được định giá bằng cùng một công thức.</li>
<li><strong>Mẫu này tổng quát hoá ra xa ngoài môn học.</strong> Một CDN đặt trước máy chủ web, một lớp Redis đặt trước cơ sở dữ liệu, cache trình duyệt đặt trước mạng — tất cả đều là cặp M1/M2, tất cả đều định giá bằng công thức slide 17, và Figure 4.4 đã đo tỉ lệ trúng cho đúng một trong số đó.</li>
</ul>
<p class="meo">💡 Ba hiện thân, một bảng phải thuộc: <strong>cache = phần cứng, vô hình; bộ nhớ ảo = OS, mở rộng dung lượng; disk cache = OS, tăng tốc độ.</strong> Nói được M1 và M2 là cái gì trong từng ca chính là thứ biến một câu hỏi định nghĩa thành câu trả lời trọn điểm.</p>`],

      [24, 'Operation of Two-Level Memory — how a hit and a miss actually work',
        `<p class="y-chinh">🎯 The mechanism, in the slide's own six steps. This is the sentence-by-sentence justification for the formula on slide 17, so read the two together.</p>
<table>
<tr><th>Step (the slide's wording)</th><th>What it implies for the arithmetic</th></tr>
<tr><td>The <strong>locality property</strong> can be exploited in the formation of a two-level memory</td><td>The whole thing is a bet on locality</td></tr>
<tr><td>The upper-level memory <strong>M1</strong> is <em>smaller, faster, and more expensive (per bit)</em> than the lower-level <strong>M2</strong></td><td>Defines T1 &lt; T2, S1 &lt; S2, C1 &gt; C2 — the three variables of slides 17 and 25</td></tr>
<tr><td>M1 is used as a <strong>temporary store</strong> for part of the contents of the larger M2</td><td>Inclusion (slide 22): M2 holds everything</td></tr>
<tr><td>When a memory reference is made, an attempt is made to access the item <strong>in M1</strong></td><td><strong>You always pay T1 first</strong> — this is why the formula is T1 + (1 − H)·T2</td></tr>
<tr><td>If this succeeds, a <strong>quick access</strong> is made</td><td>A hit costs T1 and nothing else. Probability H</td></tr>
<tr><td>If not, a <strong>block of memory locations is copied from M2 to M1</strong> and the access then <strong>takes place via M1</strong></td><td>A miss costs T1 + T2. Probability (1 − H). Note "a BLOCK", not a word — spatial locality</td></tr>
<tr><td>Because of locality, once a block is brought into M1, there should be a <strong>number of accesses to locations in that block</strong>, resulting in fast overall service</td><td>The bet paying off: one T2 amortised over many subsequent hits</td></tr>
</table>
<ul>
<li><strong>The single most useful sentence for the exam is "the access then takes place VIA M1".</strong> The processor never reads M2 directly — the block is copied up first and then read from M1. That is exactly why the miss path costs T1 + T2 and not just T2, and it settles which of the two formula conventions slide 17 warned you about applies to <em>this</em> book.</li>
<li><strong>"A block", not "the word" — that word choice is spatial locality in the mechanism.</strong> If a miss fetched only the requested word, the hierarchy would exploit temporal locality alone and the last bullet ("a number of accesses to locations in that block") would be false.</li>
<li><strong>The last bullet is the payoff and the whole justification.</strong> One expensive trip to M2 buys many cheap accesses in M1. If a program touched each block exactly once, H would collapse toward the block-fill rate and the two-level memory would be slower than a one-level one — you would pay T1 on top of T2 for nothing. <em>A hierarchy can be a net loss.</em> Slide 27 draws the boundary.</li>
<li><strong>Nothing here is specific to cache.</strong> Replace M1/M2 with main memory/disk and you have described demand paging; replace them with browser/network and you have described HTTP caching. The slide says "two-level memory" rather than "cache" deliberately.</li>
<li><strong>What the slide does NOT say, and Ch.5 will.</strong> Which block to evict when M1 is full (replacement policy), where in M1 the incoming block may be placed (mapping), and what happens to writes (write policy). Those three questions are the entirety of Chapter 5 — and they only arise <em>after</em> you accept this slide's mechanism.</li>
</ul>
<p class="pitfall">⚠️ Trap: assuming a miss always means "go to M2 and get the word". In this model a miss means "copy a <em>block</em> from M2 into M1, possibly evicting something, then read from M1". Three actions, not one — and each has a cost the formula on slide 17 folds into T2.</p>`,
        `<p class="y-chinh">🎯 Cơ chế, theo đúng sáu bước lời slide. Đây là phần biện minh từng câu cho công thức ở slide 17, nên hãy đọc hai slide cùng nhau.</p>
<table>
<tr><th>Bước (nguyên văn slide)</th><th>Nó hàm ý gì cho phép tính</th></tr>
<tr><td>Có thể khai thác <strong>tính cục bộ</strong> khi dựng một bộ nhớ hai mức</td><td>Toàn bộ chuyện này là một canh bạc đặt vào tính cục bộ</td></tr>
<tr><td>Mức trên <strong>M1</strong> thì <em>NHỎ HƠN, NHANH HƠN, ĐẮT HƠN (trên mỗi bit)</em> so với mức dưới <strong>M2</strong></td><td>Định nghĩa T1 &lt; T2, S1 &lt; S2, C1 &gt; C2 — ba biến của slide 17 và 25</td></tr>
<tr><td>M1 được dùng làm <strong>KHO TẠM</strong> cho một phần nội dung của M2 lớn hơn</td><td>Tính bao hàm (slide 22): M2 giữ tất cả</td></tr>
<tr><td>Khi có một tham chiếu bộ nhớ, máy thử truy cập mục đó <strong>Ở M1</strong></td><td><strong>LÚC NÀO CŨNG TRẢ T1 TRƯỚC</strong> — đây là lý do công thức là T1 + (1 − H)·T2</td></tr>
<tr><td>Nếu thành công thì đó là một lần <strong>TRUY CẬP NHANH</strong></td><td>Trúng thì tốn T1 và không gì nữa. Xác suất H</td></tr>
<tr><td>Nếu không, <strong>MỘT KHỐI các ô nhớ được chép từ M2 sang M1</strong>, rồi truy cập <strong>DIỄN RA QUA M1</strong></td><td>Trượt thì tốn T1 + T2. Xác suất (1 − H). Chú ý "MỘT KHỐI", không phải một từ — cục bộ không gian</td></tr>
<tr><td>Nhờ tính cục bộ, một khi khối đã nằm trong M1 thì sẽ có <strong>NHIỀU LẦN TRUY CẬP vào các ô trong khối đó</strong>, cho ra dịch vụ tổng thể nhanh</td><td>Canh bạc ăn tiền: một lần T2 được chia đều cho nhiều lần trúng sau đó</td></tr>
</table>
<ul>
<li><strong>Câu hữu ích nhất cho đề thi là "rồi truy cập DIỄN RA QUA M1".</strong> Bộ xử lý KHÔNG bao giờ đọc thẳng M2 — khối được chép lên trước rồi mới đọc từ M1. Đó chính xác là lý do đường trượt tốn T1 + T2 chứ không chỉ T2, và nó chốt xem trong hai quy ước công thức mà slide 17 cảnh báo thì cuốn sách NÀY dùng cái nào.</li>
<li><strong>"Một KHỐI", không phải "cái từ" — lựa chọn từ ngữ đó chính là cục bộ không gian nằm trong cơ chế.</strong> Nếu một lần trượt chỉ lấy đúng từ được yêu cầu thì phân cấp sẽ chỉ khai thác cục bộ thời gian, và gạch cuối ("nhiều lần truy cập vào các ô trong khối đó") sẽ sai.</li>
<li><strong>Gạch cuối là phần thu lời và là toàn bộ lý do tồn tại.</strong> Một chuyến đắt đỏ xuống M2 mua về nhiều lần truy cập rẻ ở M1. Nếu chương trình chỉ đụng mỗi khối đúng một lần thì H sẽ tụt xuống sát tỉ lệ nạp khối và bộ nhớ hai mức sẽ CHẬM HƠN bộ nhớ một mức — bạn trả thêm T1 chồng lên T2 mà chẳng được gì. <em>Phân cấp CÓ THỂ lỗ.</em> Slide 27 vẽ ra cái ranh giới đó.</li>
<li><strong>Không có gì ở đây riêng cho cache cả.</strong> Thay M1/M2 bằng bộ nhớ chính/đĩa là bạn đã mô tả phân trang theo yêu cầu; thay bằng trình duyệt/mạng là bạn đã mô tả HTTP caching. Slide cố ý nói "bộ nhớ hai mức" chứ không nói "cache".</li>
<li><strong>Điều slide KHÔNG nói, và Ch.5 sẽ nói.</strong> Đuổi khối nào khi M1 đầy (chính sách thay thế), khối mới được đặt vào chỗ nào trong M1 (ánh xạ), và ghi thì xử ra sao (chính sách ghi). Ba câu hỏi đó là toàn bộ Chương 5 — và chúng chỉ nảy sinh SAU KHI bạn chấp nhận cơ chế của slide này.</li>
</ul>
<p class="pitfall">⚠️ Bẫy: cho rằng trượt nghĩa là "xuống M2 lấy cái từ đó". Trong mô hình này, trượt nghĩa là "chép MỘT KHỐI từ M2 vào M1, có thể phải đuổi thứ khác ra, rồi đọc từ M1". BA hành động chứ không phải một — và mỗi hành động có một chi phí mà công thức ở slide 17 gói vào trong T2.</p>`],

      [25, 'Figure 4.11 — Relationship of Average Memory Cost to Relative Memory Size for a Two-Level Memory',
        `<p class="y-chinh">🎯 The <strong>cost</strong> half of the argument. Three curves, one per cost ratio C<sub>1</sub>/C<sub>2</sub> = 10, 100, 1000. Horizontal: relative size S<sub>2</sub>/S<sub>1</sub> (log, 5 to 1000). Vertical: relative combined cost C<sub>s</sub>/C<sub>2</sub> (log, 1 to 1000). Every curve falls towards 1.</p>
<p class="nhan">📐 The formula (from the book; not printed on the slide):</p>
<pre>Cs = (C1 × S1 + C2 × S2) / (S1 + S2)

C1, C2 = average cost per bit of M1 and M2
S1, S2 = size in bits of M1 and M2
Cs     = average cost per bit of the COMBINED two-level memory</pre>
<ul>
<li><strong>It is just a weighted average, and reading it that way makes it obvious.</strong> Total money spent ÷ total bits bought. Because S2 ≫ S1, the weight sits almost entirely on C2 — so C<sub>s</sub> is dragged down towards the cheap level, no matter how expensive M1 is per bit.</li>
<li><strong>The design goal the figure states.</strong> We want C<sub>s</sub> ≈ C<sub>2</sub> (pay roughly DRAM prices) while T<sub>s</sub> ≈ T<sub>1</sub> (get roughly cache speed). Those two wishes pull in opposite directions — C<sub>s</sub> ≈ C<sub>2</sub> wants S1 small, T<sub>s</sub> ≈ T<sub>1</sub> wants a high hit ratio, which usually wants S1 large. <strong>Figure 4.11 and Figure 4.12 are the two halves of that tug-of-war.</strong></li>
</ul>
<p class="nhan">📐 <strong>Reading exact points off the curves — and cross-checking them against the formula.</strong> Divide through by C2 to get C<sub>s</sub>/C<sub>2</sub> = (C1/C2 + S2/S1) ÷ (1 + S2/S1):</p>
<table>
<tr><th>S<sub>2</sub>/S<sub>1</sub></th><th>C<sub>1</sub>/C<sub>2</sub> = 1000</th><th>C<sub>1</sub>/C<sub>2</sub> = 100</th><th>C<sub>1</sub>/C<sub>2</sub> = 10</th></tr>
<tr><td>8 (left edge of the chart)</td><td>(1000 + 8)/9 = <strong>112</strong></td><td>(100 + 8)/9 = <strong>12</strong></td><td>(10 + 8)/9 = <strong>2,0</strong></td></tr>
<tr><td>1000 (right edge)</td><td>(1000 + 1000)/1001 = <strong>2,00</strong></td><td>(100 + 1000)/1001 = <strong>1,10</strong></td><td>(10 + 1000)/1001 = <strong>1,01</strong></td></tr>
</table>
<p class="dap-an">✅ All six computed values land exactly where the slide's three curves sit — 112, 12 and 2 at the left edge, and ≈2, ≈1,1 and ≈1,01 at the right. That is a <strong>cross-check between the formula and the printed figure</strong>, and it confirms both. The lesson the numbers teach: <strong>make M2 about 1000× bigger than M1 and the combined cost per bit is within 10% of the cheap memory's price</strong>, even when M1 costs 100× more per bit.</p>
<p class="nhan">📐 <strong>A money example with today's real prices.</strong> SRAM cache C<sub>1</sub> ≈ 5 $/MB, DRAM C<sub>2</sub> ≈ 0,002 $/MB (that is $2 per GB), with S<sub>1</sub> = 1 MB of cache and S<sub>2</sub> = 1024 MB of DRAM:</p>
<pre>total money = 5 × 1 + 0,002 × 1024 = 5 + 2,048 = 7,048 $
Cs          = 7,048 / (1 + 1024) = 7,048 / 1025 = 0,006876 $/MB
Cs / C2     = 0,006876 / 0,002    = 3,44</pre>
<p class="dap-an">✅ Answer: the combined memory costs <strong>3,44× as much per bit as plain DRAM</strong>. Why so much worse than the textbook's 1,1? Because the real cost ratio is C<sub>1</sub>/C<sub>2</sub> = 5 ÷ 0,002 = <strong>2500</strong>, far off the right of the slide's chart — and the formula agrees exactly: (2500 + 1024)/1025 = 3,438 ✓. <strong>This is precisely why real caches are megabytes and not gigabytes.</strong> Push it further: at S<sub>2</sub>/S<sub>1</sub> = 8 (a cache one eighth the size of RAM) the same ratio gives (2500 + 8)/9 = <strong>279× the price of DRAM</strong> — an unbuildable machine.</p>
<p class="pitfall">⚠️ Two traps. (1) Both axes are <strong>logarithmic</strong> — the curves look gently sloping but they cross two or three orders of magnitude. (2) C<sub>s</sub> can never go below C<sub>2</sub>; the curves approach 1 from above and never reach it. Any answer claiming the hierarchy is <em>cheaper</em> than pure M2 is wrong — the hierarchy buys <em>speed</em> at a small cost premium, it does not save money.</p>`,
        `<p class="y-chinh">🎯 Nửa lập luận về <strong>GIÁ</strong>. Ba đường cong, mỗi đường một tỉ số giá C<sub>1</sub>/C<sub>2</sub> = 10, 100, 1000. Trục ngang: kích thước tương đối S<sub>2</sub>/S<sub>1</sub> (thang log, 5 tới 1000). Trục đứng: giá gộp tương đối C<sub>s</sub>/C<sub>2</sub> (thang log, 1 tới 1000). Mọi đường đều rơi về phía 1.</p>
<p class="nhan">📐 Công thức (lấy từ SÁCH; không in trên slide):</p>
<pre>Cs = (C1 × S1 + C2 × S2) / (S1 + S2)

C1, C2 = giá trung bình mỗi bit của M1 và M2
S1, S2 = kích thước tính bằng bit của M1 và M2
Cs     = giá trung bình mỗi bit của bộ nhớ hai mức GỘP LẠI</pre>
<ul>
<li><strong>Nó chỉ là một TRUNG BÌNH CÓ TRỌNG SỐ, và đọc kiểu đó là thấy ngay.</strong> Tổng tiền bỏ ra ÷ tổng số bit mua được. Vì S2 ≫ S1 nên trọng số dồn gần hết vào C2 — thành ra C<sub>s</sub> bị kéo tụt về phía mức RẺ, bất kể M1 đắt tới đâu trên mỗi bit.</li>
<li><strong>Mục tiêu thiết kế mà hình này phát biểu.</strong> Ta muốn C<sub>s</sub> ≈ C<sub>2</sub> (trả xấp xỉ giá DRAM) mà T<sub>s</sub> ≈ T<sub>1</sub> (được xấp xỉ tốc độ cache). Hai điều ước ấy kéo ngược chiều nhau — C<sub>s</sub> ≈ C<sub>2</sub> đòi S1 NHỎ, còn T<sub>s</sub> ≈ T<sub>1</sub> đòi tỉ lệ trúng cao, mà thường thì lại đòi S1 LỚN. <strong>Figure 4.11 và Figure 4.12 là hai đầu của cuộc kéo co đó.</strong></li>
</ul>
<p class="nhan">📐 <strong>Đọc những điểm chính xác trên các đường cong — và ĐỐI CHIẾU CHÉO với công thức.</strong> Chia cả hai vế cho C2 được C<sub>s</sub>/C<sub>2</sub> = (C1/C2 + S2/S1) ÷ (1 + S2/S1):</p>
<table>
<tr><th>S<sub>2</sub>/S<sub>1</sub></th><th>C<sub>1</sub>/C<sub>2</sub> = 1000</th><th>C<sub>1</sub>/C<sub>2</sub> = 100</th><th>C<sub>1</sub>/C<sub>2</sub> = 10</th></tr>
<tr><td>8 (mép trái biểu đồ)</td><td>(1000 + 8)/9 = <strong>112</strong></td><td>(100 + 8)/9 = <strong>12</strong></td><td>(10 + 8)/9 = <strong>2,0</strong></td></tr>
<tr><td>1000 (mép phải)</td><td>(1000 + 1000)/1001 = <strong>2,00</strong></td><td>(100 + 1000)/1001 = <strong>1,10</strong></td><td>(10 + 1000)/1001 = <strong>1,01</strong></td></tr>
</table>
<p class="dap-an">✅ Cả sáu giá trị tính ra đều rơi ĐÚNG chỗ ba đường cong của slide nằm — 112, 12 và 2 ở mép trái, và ≈2, ≈1,1 và ≈1,01 ở mép phải. Đó là một phép <strong>ĐỐI CHIẾU CHÉO giữa công thức và hình in sẵn</strong>, và nó xác nhận cả hai. Bài học mà các con số dạy: <strong>làm M2 lớn gấp chừng 1000 lần M1 thì giá gộp mỗi bit chỉ cao hơn giá của bộ nhớ rẻ khoảng 10%</strong>, ngay cả khi M1 đắt gấp 100 lần trên mỗi bit.</p>
<p class="nhan">📐 <strong>Một ví dụ bằng TIỀN với giá thực tế hôm nay.</strong> Cache SRAM C<sub>1</sub> ≈ 5 $/MB, DRAM C<sub>2</sub> ≈ 0,002 $/MB (tức 2 $ mỗi GB), với S<sub>1</sub> = 1 MB cache và S<sub>2</sub> = 1024 MB DRAM:</p>
<pre>tổng tiền = 5 × 1 + 0,002 × 1024 = 5 + 2,048 = 7,048 $
Cs        = 7,048 / (1 + 1024) = 7,048 / 1025 = 0,006876 $/MB
Cs / C2   = 0,006876 / 0,002    = 3,44</pre>
<p class="dap-an">✅ Đáp án: bộ nhớ gộp lại tốn <strong>gấp 3,44 lần DRAM thuần trên mỗi bit</strong>. Vì sao tệ hơn con số 1,1 của sách nhiều thế? Vì tỉ số giá THẬT là C<sub>1</sub>/C<sub>2</sub> = 5 ÷ 0,002 = <strong>2500</strong>, nằm xa bên phải ngoài biểu đồ của slide — và công thức khớp đúng: (2500 + 1024)/1025 = 3,438 ✓. <strong>Đây chính xác là lý do cache thật chỉ tính bằng megabyte chứ không phải gigabyte.</strong> Đẩy thêm một bước: với S<sub>2</sub>/S<sub>1</sub> = 8 (cache bằng một phần tám RAM) thì cùng tỉ số đó cho (2500 + 8)/9 = <strong>279 lần giá DRAM</strong> — một cỗ máy không ai dựng nổi.</p>
<p class="pitfall">⚠️ Hai cái bẫy. (1) CẢ HAI trục đều <strong>THANG LOGARIT</strong> — các đường trông dốc thoai thoải nhưng chúng băng qua hai ba bậc mười. (2) C<sub>s</sub> KHÔNG BAO GIỜ xuống dưới C<sub>2</sub>; các đường tiến về 1 từ phía trên và không bao giờ chạm. Câu trả lời nào bảo phân cấp RẺ HƠN M2 thuần là sai — phân cấp mua <em>TỐC ĐỘ</em> với một khoản đội giá nhỏ, nó không tiết kiệm tiền.</p>`],

      [26, 'Figure 4.12 — Access Efficiency as a Function of Hit Ratio (r = T2/T1)',
        `<p class="y-chinh">🎯 The <strong>speed</strong> half. Access efficiency = <strong>T<sub>1</sub>/T<sub>s</sub></strong>, i.e. "what fraction of ideal cache speed am I actually getting?" Four curves, one per <strong>r = T<sub>2</sub>/T<sub>1</sub></strong> = 1, 10, 100, 1000. All four converge on 1 at H = 1, and all four are <strong>miserably low until H gets very close to 1</strong>.</p>
<p class="nhan">📐 The formula behind it — divide slide 17's formula by T1:</p>
<pre>Ts = T1 + (1 − H) × T2
Ts/T1 = 1 + (1 − H) × r          where r = T2/T1
efficiency = T1/Ts = 1 / (1 + (1 − H) × r)</pre>
<ul>
<li><strong>Verify the formula against the four points where the curves cut the left axis (H = 0).</strong> Efficiency there is 1/(1 + r): r = 1 → <strong>0,5</strong> · r = 10 → <strong>0,0909</strong> · r = 100 → <strong>0,0099</strong> · r = 1000 → <strong>0,000999</strong>. Read the slide: the four curves start at 0,5 · ≈0,09 · ≈0,01 · ≈0,001. <strong>Exact match on all four.</strong> The formula and the figure confirm each other.</li>
<li><strong>The shape is the message: efficiency is a HOCKEY STICK.</strong> For r = 1000 the curve is still near 0,01 at H = 0,9 and only lifts off in the last sliver before 1. The bigger the speed gap r, the later the lift-off — which is exactly why processors that got faster relative to DRAM had to keep <em>raising</em> their hit ratios just to stand still.</li>
</ul>
<p class="nhan">📐 <strong>Efficiency table for r = 100, the ratio measured on a real machine in slide 5 (129,3 ns ÷ 1,29 ns = 100,2):</strong></p>
<table>
<tr><th>H</th><th>T<sub>s</sub>/T<sub>1</sub> = 1 + (1 − H) × 100</th><th>Efficiency T<sub>1</sub>/T<sub>s</sub></th><th>In words</th></tr>
<tr><td>0</td><td>101</td><td>0,0099</td><td>1% of cache speed</td></tr>
<tr><td>0,50</td><td>51</td><td>0,0196</td><td>2%</td></tr>
<tr><td>0,90</td><td>11</td><td>0,0909</td><td>9%</td></tr>
<tr><td>0,95</td><td>6</td><td>0,1667</td><td>17%</td></tr>
<tr><td>0,99</td><td>2</td><td>0,5000</td><td><strong>50%</strong></td></tr>
<tr><td>0,999</td><td>1,1</td><td>0,9091</td><td><strong>91%</strong></td></tr>
</table>
<p class="dap-an">✅ Read the two rows that matter. Going from <strong>H = 0,50 to H = 0,90</strong> — forty percentage points of hard work — raises efficiency from 2% to only 9%. Going from <strong>H = 0,99 to H = 0,999</strong> — nine tenths of one percentage point — raises it from 50% to 91%. <strong>Almost all the benefit of a cache lives in the last 1% of hit ratio.</strong> That single fact explains why cache designers fight over fractions of a percent, and it is the answer to "why isn't a 90% hit ratio good enough?"</p>
<p class="nhan">📐 <strong>Practice: on this machine (r = 100), what hit ratio gives 80% access efficiency?</strong> 1/(1 + (1 − H) × 100) = 0,8 ⇒ 1 + (1 − H) × 100 = 1,25 ⇒ (1 − H) × 100 = 0,25 ⇒ (1 − H) = 0,0025.</p>
<p class="dap-an">✅ <strong>H = 0,9975</strong> — a miss rate of 1 in 400. Check: T<sub>s</sub>/T<sub>1</sub> = 1 + 0,0025 × 100 = 1,25, and 1/1,25 = 0,8 ✓.</p>
<p class="pitfall">⚠️ Two traps. (1) The vertical axis is <strong>logarithmic</strong> (0,001 to 1), so the curves look far better than they are; on a linear axis all four would hug the bottom until the very end. (2) Efficiency ≤ 1 always, and efficiency = 1 only when H = 1. Nothing in a two-level memory can ever be <em>faster</em> than the fast level alone — the hierarchy's job is to get <em>close</em> to it cheaply, never to beat it.</p>`,
        `<p class="y-chinh">🎯 Nửa về <strong>TỐC ĐỘ</strong>. Hiệu suất truy cập = <strong>T<sub>1</sub>/T<sub>s</sub></strong>, tức "tôi đang thật sự lấy được bao nhiêu phần của tốc độ cache lý tưởng?" Bốn đường cong, mỗi đường một giá trị <strong>r = T<sub>2</sub>/T<sub>1</sub></strong> = 1, 10, 100, 1000. Cả bốn hội tụ về 1 tại H = 1, và cả bốn đều <strong>THẢM HẠI cho tới khi H tiến rất sát 1</strong>.</p>
<p class="nhan">📐 Công thức đứng sau — chia công thức của slide 17 cho T1:</p>
<pre>Ts = T1 + (1 − H) × T2
Ts/T1 = 1 + (1 − H) × r          với r = T2/T1
hiệu suất = T1/Ts = 1 / (1 + (1 − H) × r)</pre>
<ul>
<li><strong>Kiểm công thức bằng bốn điểm các đường cắt trục trái (H = 0).</strong> Hiệu suất ở đó là 1/(1 + r): r = 1 → <strong>0,5</strong> · r = 10 → <strong>0,0909</strong> · r = 100 → <strong>0,0099</strong> · r = 1000 → <strong>0,000999</strong>. Đọc slide: bốn đường bắt đầu ở 0,5 · ≈0,09 · ≈0,01 · ≈0,001. <strong>Khớp chính xác cả bốn.</strong> Công thức và hình xác nhận lẫn nhau.</li>
<li><strong>Hình dáng mới là thông điệp: hiệu suất là một CÂY GẬY HOCKEY.</strong> Với r = 1000 thì đường cong vẫn còn quanh 0,01 tại H = 0,9 và chỉ ngóc lên ở lát cắt cuối cùng trước 1. Khoảng cách tốc độ r càng lớn thì chỗ ngóc lên càng muộn — đúng là lý do vì sao bộ xử lý ngày càng nhanh hơn DRAM thì càng phải <em>NÂNG</em> tỉ lệ trúng lên chỉ để giữ nguyên chỗ đứng.</li>
</ul>
<p class="nhan">📐 <strong>Bảng hiệu suất cho r = 100, đúng tỉ số đo được trên máy thật ở slide 5 (129,3 ns ÷ 1,29 ns = 100,2):</strong></p>
<table>
<tr><th>H</th><th>T<sub>s</sub>/T<sub>1</sub> = 1 + (1 − H) × 100</th><th>Hiệu suất T<sub>1</sub>/T<sub>s</sub></th><th>Nói bằng lời</th></tr>
<tr><td>0</td><td>101</td><td>0,0099</td><td>1% tốc độ cache</td></tr>
<tr><td>0,50</td><td>51</td><td>0,0196</td><td>2%</td></tr>
<tr><td>0,90</td><td>11</td><td>0,0909</td><td>9%</td></tr>
<tr><td>0,95</td><td>6</td><td>0,1667</td><td>17%</td></tr>
<tr><td>0,99</td><td>2</td><td>0,5000</td><td><strong>50%</strong></td></tr>
<tr><td>0,999</td><td>1,1</td><td>0,9091</td><td><strong>91%</strong></td></tr>
</table>
<p class="dap-an">✅ Hãy đọc hai dòng quan trọng. Đi từ <strong>H = 0,50 lên H = 0,90</strong> — bốn mươi điểm phần trăm đổ mồ hôi — chỉ nâng hiệu suất từ 2% lên 9%. Đi từ <strong>H = 0,99 lên H = 0,999</strong> — chín phần mười của MỘT điểm phần trăm — nâng nó từ 50% lên 91%. <strong>Gần như toàn bộ lợi ích của cache nằm trong 1% cuối cùng của tỉ lệ trúng.</strong> Chỉ một sự thật đó giải thích vì sao người thiết kế cache giành nhau từng phần nhỏ của một phần trăm, và nó là câu trả lời cho "tỉ lệ trúng 90% thì có gì mà chưa đủ tốt?"</p>
<p class="nhan">📐 <strong>Luyện tập: trên máy này (r = 100), tỉ lệ trúng bao nhiêu thì đạt hiệu suất truy cập 80%?</strong> 1/(1 + (1 − H) × 100) = 0,8 ⇒ 1 + (1 − H) × 100 = 1,25 ⇒ (1 − H) × 100 = 0,25 ⇒ (1 − H) = 0,0025.</p>
<p class="dap-an">✅ <strong>H = 0,9975</strong> — tỉ lệ trượt 1 trên 400. Kiểm lại: T<sub>s</sub>/T<sub>1</sub> = 1 + 0,0025 × 100 = 1,25, và 1/1,25 = 0,8 ✓.</p>
<p class="pitfall">⚠️ Hai cái bẫy. (1) Trục đứng là <strong>THANG LOGARIT</strong> (0,001 tới 1), nên các đường trông đẹp hơn thực tế rất nhiều; trên trục tuyến tính cả bốn sẽ bám sát đáy tới tận phút chót. (2) Hiệu suất LUÔN ≤ 1, và bằng 1 chỉ khi H = 1. Không gì trong một bộ nhớ hai mức có thể NHANH HƠN riêng mức nhanh — việc của phân cấp là tiến GẦN tới đó một cách rẻ tiền, không bao giờ là vượt qua nó.</p>`],

      [27, 'Figure 4.13 — Hit Ratio as a Function of Relative Memory Size',
        `<p class="y-chinh">🎯 The third graph, and the one that closes the argument. Horizontal: relative memory size <strong>S<sub>1</sub>/S<sub>2</sub></strong> (how big is the fast level compared with the slow one). Vertical: <strong>hit ratio</strong>. Three curves — <strong>Strong Locality · Moderate Locality · No Locality</strong> — and they tell three completely different stories.</p>
<table>
<tr><th>Curve</th><th>Shape</th><th>Reading at S<sub>1</sub>/S<sub>2</sub> ≈ 0,1</th><th>What it means</th></tr>
<tr><td><strong>Strong Locality</strong></td><td>Shoots almost vertically, then flat near 1,0</td><td>H ≈ <strong>0,9</strong> from just 10% of the size</td><td>A tiny fast memory captures nearly everything</td></tr>
<tr><td><strong>Moderate Locality</strong></td><td>Rises steeply, then curves over</td><td>H ≈ <strong>0,5</strong></td><td>You get real benefit, but you must buy more M1</td></tr>
<tr><td><strong>No Locality</strong></td><td>A perfectly straight diagonal</td><td>H = <strong>0,1</strong></td><td>Hit ratio = exactly the fraction of data you happened to copy up. Random access, no better than chance</td></tr>
</table>
<ul>
<li><strong>The straight diagonal is the most important line in this chapter.</strong> With no locality, H = S<sub>1</sub>/S<sub>2</sub> — hold 10% of the data and you hit 10% of the time, which is exactly what pure chance gives. <strong>A memory hierarchy adds nothing at all in that case</strong> — and it actually makes things worse, because slide 24's mechanism charges you T1 on every access <em>plus</em> T2 on almost all of them. This is the line every "why does caching work?" answer must contrast against.</li>
<li><strong>The knee is where you buy.</strong> On the strong-locality curve the hit ratio is already ≈0,9 at 10% relative size, and going from 10% to 100% of the size buys only the last 0,1. Beyond the knee you pay a lot of money (Figure 4.11) for almost nothing. <strong>Design point: stop at the knee.</strong> Figure 4.4's web-page cliff is the same knee, drawn from measured data.</li>
<li><strong>Put the three figures together and you have the full argument.</strong> Fig 4.13: locality gives you a high H from a small S1. Fig 4.12: a high H gives you T<sub>s</sub> ≈ T<sub>1</sub>. Fig 4.11: a small S1 gives you C<sub>s</sub> ≈ C<sub>2</sub>. <strong>Therefore: near-cache speed at near-DRAM price.</strong> That three-step chain is the thesis of Chapter 4 and it is a perfect exam answer.</li>
<li><strong>Which programs sit on which curve?</strong> Strong: a tight loop over a small array, a compiler's symbol table, a web server's hot pages. Moderate: most real applications. None: a hash table larger than memory probed with random keys, a database doing random-key lookups over a huge index, a linked list scattered across the heap. The pointer-chase benchmark on slide 5 was deliberately built to sit on the <em>No Locality</em> line — that is how it managed to expose the true DRAM latency.</li>
<li><strong>You can move a program between curves by rewriting it.</strong> That is the practical payoff of this chapter. Slide 6's matrix traversal is the same program on two different curves: by row it has strong spatial locality, by column almost none, and the measured difference was 3,4×. <strong>Loop interchange, blocking/tiling and array-of-structs versus struct-of-arrays are all techniques for climbing from the bottom curve to the top one.</strong></li>
</ul>
<p class="meo">💡 One sentence worth memorising verbatim: <strong>"Without locality, the hit ratio equals the relative size — and the hierarchy is worthless."</strong> Every justification of cache, virtual memory, disk cache and CDN in this course is a contrast with that sentence.</p>`,
        `<p class="y-chinh">🎯 Đồ thị thứ ba, và là cái khép lại lập luận. Trục ngang: kích thước tương đối <strong>S<sub>1</sub>/S<sub>2</sub></strong> (mức nhanh lớn bằng bao nhiêu so với mức chậm). Trục đứng: <strong>TỈ LỆ TRÚNG</strong>. Ba đường cong — <strong>Strong Locality (cục bộ mạnh) · Moderate Locality (vừa) · No Locality (không có)</strong> — và chúng kể ba câu chuyện hoàn toàn khác nhau.</p>
<table>
<tr><th>Đường</th><th>Hình dáng</th><th>Đọc tại S<sub>1</sub>/S<sub>2</sub> ≈ 0,1</th><th>Nghĩa là gì</th></tr>
<tr><td><strong>Cục bộ MẠNH</strong></td><td>Vọt gần như thẳng đứng rồi nằm phẳng sát 1,0</td><td>H ≈ <strong>0,9</strong> chỉ từ 10% kích thước</td><td>Một bộ nhớ nhanh tí hon tóm được gần như tất cả</td></tr>
<tr><td><strong>Cục bộ VỪA</strong></td><td>Lên dốc rồi cong dần</td><td>H ≈ <strong>0,5</strong></td><td>Có lợi thật, nhưng phải mua M1 nhiều hơn</td></tr>
<tr><td><strong>KHÔNG có cục bộ</strong></td><td>Một đường chéo THẲNG TẮP</td><td>H = <strong>0,1</strong></td><td>Tỉ lệ trúng = đúng bằng phần dữ liệu tình cờ đã chép lên. Truy cập ngẫu nhiên, không hơn gì may rủi</td></tr>
</table>
<ul>
<li><strong>Đường chéo thẳng là đường quan trọng nhất của cả chương này.</strong> Không có cục bộ thì H = S<sub>1</sub>/S<sub>2</sub> — giữ 10% dữ liệu thì trúng 10% số lần, đúng bằng cái mà thuần may rủi cho. <strong>Phân cấp bộ nhớ khi đó CHẲNG THÊM ĐƯỢC GÌ</strong> — mà thật ra còn làm tệ đi, vì cơ chế của slide 24 bắt bạn trả T1 ở MỌI lần truy cập <em>CỘNG THÊM</em> T2 ở gần như tất cả. Đây là đường mà mọi câu trả lời "vì sao caching ăn tiền?" phải lấy làm mốc đối chiếu.</li>
<li><strong>Chỗ GẤP KHÚC là chỗ nên mua.</strong> Trên đường cục bộ mạnh, tỉ lệ trúng đã ≈0,9 ở mức 10% kích thước tương đối, và đi từ 10% lên 100% kích thước chỉ mua thêm được 0,1 cuối cùng. Vượt qua chỗ gấp khúc là trả rất nhiều tiền (Figure 4.11) cho gần như không gì. <strong>Điểm thiết kế: DỪNG Ở CHỖ GẤP KHÚC.</strong> Vách đá trang web của Figure 4.4 chính là chỗ gấp khúc đó, vẽ từ số liệu đo thật.</li>
<li><strong>Ghép ba hình lại là có trọn lập luận.</strong> Fig 4.13: tính cục bộ cho bạn H cao từ một S1 nhỏ. Fig 4.12: H cao cho bạn T<sub>s</sub> ≈ T<sub>1</sub>. Fig 4.11: S1 nhỏ cho bạn C<sub>s</sub> ≈ C<sub>2</sub>. <strong>Vậy nên: tốc độ gần bằng cache với giá gần bằng DRAM.</strong> Chuỗi ba bước đó là luận đề của Chương 4 và là một câu trả lời thi hoàn hảo.</li>
<li><strong>Chương trình nào nằm trên đường nào?</strong> Mạnh: một vòng lặp chặt trên mảng nhỏ, bảng ký hiệu của trình biên dịch, các trang nóng của máy chủ web. Vừa: đa số ứng dụng thật. Không có: một bảng băm lớn hơn bộ nhớ được dò bằng khoá ngẫu nhiên, một cơ sở dữ liệu tra khoá ngẫu nhiên trên chỉ mục khổng lồ, một danh sách liên kết rải rác khắp heap. Phép đo đuổi con trỏ ở slide 5 được dựng CỐ Ý để nằm trên đường <em>No Locality</em> — nhờ vậy nó mới phơi ra được độ trễ DRAM thật.</li>
<li><strong>Bạn có thể CHUYỂN một chương trình từ đường này sang đường khác bằng cách viết lại nó.</strong> Đó là phần thu lời thực dụng của chương này. Phép duyệt ma trận ở slide 6 là cùng một chương trình nằm trên hai đường khác nhau: đi theo hàng thì cục bộ không gian rất mạnh, đi theo cột thì gần như không có, và chênh lệch đo được là 3,4 lần. <strong>Hoán đổi vòng lặp, chia ô (blocking/tiling), và chọn mảng-của-struct hay struct-của-mảng đều là kỹ thuật leo từ đường dưới cùng lên đường trên cùng.</strong></li>
</ul>
<p class="meo">💡 Một câu đáng thuộc nguyên văn: <strong>"Không có tính cục bộ thì tỉ lệ trúng bằng đúng kích thước tương đối — và phân cấp trở nên vô giá trị."</strong> Mọi biện minh cho cache, bộ nhớ ảo, disk cache và CDN trong môn này đều là một phép tương phản với câu đó.</p>`],

      [28, 'Figure 4.14 — Multilevel Memory Access Performance Model',
        `<p class="y-chinh">🎯 The two-level model generalised to <strong>n</strong> levels, drawn as a flowchart. Address from CPU → "Block in M<sub>1</sub>?" → hit with probability h<sub>1</sub>, cost t<sub>1</sub>, done. Miss with probability (1 − h<sub>1</sub>) → ask M<sub>2</sub> → … → and if even M<sub>n</sub> misses, the flow reaches a box marked <strong>Error</strong>.</p>
<ul>
<li><strong>Read the boxes that come back up, not just the ones that go down.</strong> On a hit in M<sub>2</sub> the diagram shows <em>"Move to M<sub>1</sub>"</em>; on a hit in M<sub>n</sub> it shows <em>"Move to M<sub>n−1</sub>"</em>. Data is promoted one level at a time on its way to the CPU — that is inclusion (slide 22) in motion, and it is why every level ends up holding a copy.</li>
<li><strong>The "Error" terminal is not decoration.</strong> Missing at the last level means the address is not anywhere in the system — an invalid address, a segmentation fault. It is the flowchart's way of saying M<sub>n</sub> is the level of last resort, which is exactly the <em>inclusion</em> principle: everything is originally stored at M<sub>n</sub>.</li>
<li><strong>The h<sub>i</sub> in this diagram are LOCAL hit ratios, and that is the single biggest source of exam errors.</strong> h<sub>2</sub> is "probability of hitting in M<sub>2</sub> <em>given that M<sub>1</sub> missed</em>", not "fraction of all accesses served by M<sub>2</sub>". The flowchart makes this visible: you only reach the h<sub>2</sub> diamond along the (1 − h<sub>1</sub>) branch.</li>
</ul>
<p class="nhan">📐 <strong>The formula, built straight off the flowchart (nested form — easiest and least error-prone):</strong></p>
<pre>T = t1 + (1 − h1) × [ t2 + (1 − h2) × [ t3 + … ] ]</pre>
<p class="nhan">📐 <strong>Worked three-level example.</strong> L1: t<sub>1</sub> = 1 ns, h<sub>1</sub> = 0,90. L2: t<sub>2</sub> = 10 ns, h<sub>2</sub> = 0,95. Main memory: t<sub>3</sub> = 100 ns (always hits).</p>
<pre>T = 1 + (1 − 0,90) × [ 10 + (1 − 0,95) × 100 ]
  = 1 + 0,10 × [ 10 + 0,05 × 100 ]
  = 1 + 0,10 × [ 10 + 5 ]
  = 1 + 0,10 × 15
  = 1 + 1,5
  = 2,5 ns</pre>
<p class="dap-an">✅ <strong>T = 2,5 ns.</strong> Checked a second way, by global probabilities: an access is served by L1 with probability 0,90 at cost 1 ns; by L2 with probability 0,10 × 0,95 = 0,095 at cost 1 + 10 = 11 ns; by RAM with probability 0,10 × 0,05 = 0,005 at cost 1 + 10 + 100 = 111 ns. Then 0,90 × 1 + 0,095 × 11 + 0,005 × 111 = 0,90 + 1,045 + 0,555 = <strong>2,5 ns</strong> ✓. Two independent routes, same answer — that is how you should check every one of these in an exam. Note also that the probabilities sum correctly: 0,90 + 0,095 + 0,005 = 1,000 ✓.</p>
<p class="nhan">📐 <strong>Which knob helps more?</strong> Raise h<sub>1</sub> from 0,90 to 0,95: T = 1 + 0,05 × 15 = <strong>1,75 ns</strong>. Instead raise h<sub>2</sub> from 0,95 to 0,99: T = 1 + 0,10 × (10 + 0,01 × 100) = 1 + 0,10 × 11 = <strong>2,1 ns</strong>.</p>
<p class="dap-an">✅ Improving <strong>L1</strong> wins (1,75 &lt; 2,1), even though the improvement in percentage points was smaller (5 points versus 4 points). Reason: every later term is multiplied by (1 − h<sub>1</sub>), so the topmost hit ratio gates everything below it. <strong>Always fix the top of the hierarchy first</strong> — which is Amdahl's law from Ch.2 restated for memory.</p>
<p class="nhan">📐 <strong>Four levels, same machinery.</strong> L1 1 ns/0,90 · L2 10 ns/0,95 · L3 40 ns/0,90 · RAM 100 ns: T = 1 + 0,10 × (10 + 0,05 × (40 + 0,10 × 100)) = 1 + 0,10 × (10 + 0,05 × 50) = 1 + 0,10 × 12,5 = <strong>2,25 ns</strong>. And with virtual memory added: main memory 100 ns with h = 0,98, page fault 10 ms = 10<sup>7</sup> ns → T = 1 + 0,02 × (100 + 0,001 × 10<sup>7</sup>) = 1 + 0,02 × 10 100 = <strong>203 ns</strong>.</p>
<p class="dap-an">✅ Look at what that last number says: a page-fault rate of 1 in 1000 turns a 1 ns machine into a 203 ns machine. <strong>The disk term dominates completely</strong> — because t is 10<sup>7</sup> times bigger than t<sub>1</sub>, even a vanishing probability is decisive. Cut the fault rate tenfold to 1 in 10 000 and T drops to 1 + 0,02 × (100 + 0,0001 × 10<sup>7</sup>) = <strong>23 ns</strong>. This is why thrashing is catastrophic rather than merely slow, and it is Ch.9's whole motivation.</p>
<p class="pitfall">⚠️ The classic error: multiplying local hit ratios as if they were global. The fraction of <em>all</em> accesses served by L2 is (1 − h<sub>1</sub>) × h<sub>2</sub> = 0,095, not h<sub>2</sub> = 0,95. Always check that your fractions sum to 1 before you trust the answer.</p>`,
        `<p class="y-chinh">🎯 Mô hình hai mức tổng quát hoá lên <strong>n</strong> mức, vẽ thành lưu đồ. Địa chỉ từ CPU → "Khối có ở M<sub>1</sub>?" → trúng với xác suất h<sub>1</sub>, tốn t<sub>1</sub>, xong. Trượt với xác suất (1 − h<sub>1</sub>) → hỏi M<sub>2</sub> → … → và nếu đến cả M<sub>n</sub> cũng trượt thì luồng chạy tới một ô ghi <strong>Error</strong>.</p>
<ul>
<li><strong>Đọc cả những ô CHẠY NGƯỢC LÊN, đừng chỉ đọc mấy ô đi xuống.</strong> Khi trúng ở M<sub>2</sub>, sơ đồ vẽ <em>"Move to M<sub>1</sub>"</em>; khi trúng ở M<sub>n</sub>, nó vẽ <em>"Move to M<sub>n−1</sub>"</em>. Dữ liệu được đẩy lên TỪNG MỨC MỘT trên đường về CPU — đó là tính bao hàm (slide 22) đang chuyển động, và là lý do rốt cuộc mức nào cũng giữ một bản sao.</li>
<li><strong>Ô "Error" ở cuối không phải trang trí.</strong> Trượt ở mức cuối nghĩa là địa chỉ đó không có ở đâu trong hệ thống — địa chỉ không hợp lệ, lỗi phân đoạn. Đó là cách lưu đồ nói M<sub>n</sub> là mức chốt hạ cuối cùng, đúng nguyên lý <em>bao hàm</em>: mọi thứ ban đầu đều được lưu ở M<sub>n</sub>.</li>
<li><strong>Các h<sub>i</sub> trong sơ đồ này là tỉ lệ trúng CỤC BỘ, và đây là nguồn sai lầm số một trong đề thi.</strong> h<sub>2</sub> là "xác suất trúng ở M<sub>2</sub> <em>VỚI ĐIỀU KIỆN M<sub>1</sub> đã trượt</em>", không phải "phần trong toàn bộ truy cập được M<sub>2</sub> phục vụ". Lưu đồ làm chuyện này hiện ra: bạn chỉ tới được ô hình thoi h<sub>2</sub> theo nhánh (1 − h<sub>1</sub>).</li>
</ul>
<p class="nhan">📐 <strong>Công thức, dựng thẳng từ lưu đồ (dạng LỒNG NHAU — dễ nhất và ít sai nhất):</strong></p>
<pre>T = t1 + (1 − h1) × [ t2 + (1 − h2) × [ t3 + … ] ]</pre>
<p class="nhan">📐 <strong>Ví dụ ba mức giải trọn.</strong> L1: t<sub>1</sub> = 1 ns, h<sub>1</sub> = 0,90. L2: t<sub>2</sub> = 10 ns, h<sub>2</sub> = 0,95. Bộ nhớ chính: t<sub>3</sub> = 100 ns (luôn trúng).</p>
<pre>T = 1 + (1 − 0,90) × [ 10 + (1 − 0,95) × 100 ]
  = 1 + 0,10 × [ 10 + 0,05 × 100 ]
  = 1 + 0,10 × [ 10 + 5 ]
  = 1 + 0,10 × 15
  = 1 + 1,5
  = 2,5 ns</pre>
<p class="dap-an">✅ <strong>T = 2,5 ns.</strong> Kiểm bằng đường thứ hai, theo xác suất TOÀN CỤC: một lần truy cập được L1 phục vụ với xác suất 0,90 tốn 1 ns; được L2 phục vụ với xác suất 0,10 × 0,95 = 0,095 tốn 1 + 10 = 11 ns; được RAM phục vụ với xác suất 0,10 × 0,05 = 0,005 tốn 1 + 10 + 100 = 111 ns. Vậy 0,90 × 1 + 0,095 × 11 + 0,005 × 111 = 0,90 + 1,045 + 0,555 = <strong>2,5 ns</strong> ✓. Hai đường độc lập, cùng một đáp số — đó là cách bạn nên kiểm mọi bài dạng này trong phòng thi. Cũng để ý tổng xác suất đúng bằng 1: 0,90 + 0,095 + 0,005 = 1,000 ✓.</p>
<p class="nhan">📐 <strong>Vặn cái núm nào lợi hơn?</strong> Nâng h<sub>1</sub> từ 0,90 lên 0,95: T = 1 + 0,05 × 15 = <strong>1,75 ns</strong>. Hoặc nâng h<sub>2</sub> từ 0,95 lên 0,99: T = 1 + 0,10 × (10 + 0,01 × 100) = 1 + 0,10 × 11 = <strong>2,1 ns</strong>.</p>
<p class="dap-an">✅ Cải thiện <strong>L1</strong> thắng (1,75 &lt; 2,1), dù mức cải thiện tính theo điểm phần trăm còn NHỎ HƠN (5 điểm so với 4 điểm). Lý do: mọi số hạng phía sau đều bị nhân với (1 − h<sub>1</sub>), nên tỉ lệ trúng ở mức trên cùng khoá cổng cho tất cả những gì nằm dưới. <strong>Luôn chữa từ đỉnh phân cấp trước</strong> — đó là định luật Amdahl của Ch.2 phát biểu lại cho bộ nhớ.</p>
<p class="nhan">📐 <strong>Bốn mức, vẫn bộ máy đó.</strong> L1 1 ns/0,90 · L2 10 ns/0,95 · L3 40 ns/0,90 · RAM 100 ns: T = 1 + 0,10 × (10 + 0,05 × (40 + 0,10 × 100)) = 1 + 0,10 × (10 + 0,05 × 50) = 1 + 0,10 × 12,5 = <strong>2,25 ns</strong>. Và khi thêm bộ nhớ ảo: bộ nhớ chính 100 ns với h = 0,98, lỗi trang 10 ms = 10<sup>7</sup> ns → T = 1 + 0,02 × (100 + 0,001 × 10<sup>7</sup>) = 1 + 0,02 × 10 100 = <strong>203 ns</strong>.</p>
<p class="dap-an">✅ Hãy nhìn xem con số cuối nói gì: tỉ lệ lỗi trang 1 trên 1000 biến một cỗ máy 1 ns thành cỗ máy 203 ns. <strong>Số hạng của đĩa nuốt trọn tất cả</strong> — vì t của nó lớn gấp 10<sup>7</sup> lần t<sub>1</sub>, nên một xác suất bé tí cũng đủ quyết định. Giảm tỉ lệ lỗi trang mười lần xuống 1 trên 10 000 thì T tụt còn 1 + 0,02 × (100 + 0,0001 × 10<sup>7</sup>) = <strong>23 ns</strong>. Đó là lý do hiện tượng thrashing là THẢM HOẠ chứ không đơn thuần là chậm, và là toàn bộ động cơ của Ch.9.</p>
<p class="pitfall">⚠️ Lỗi kinh điển: nhân các tỉ lệ trúng cục bộ như thể chúng là toàn cục. Phần trong <em>TOÀN BỘ</em> truy cập được L2 phục vụ là (1 − h<sub>1</sub>) × h<sub>2</sub> = 0,095, không phải h<sub>2</sub> = 0,95. Luôn kiểm tổng các phần có bằng 1 không trước khi tin vào đáp án.</p>`],

      [29, 'Summary — Chapter 4: The Memory Hierarchy: Locality and Performance',
        `<p class="y-chinh">🎯 The chapter's own contents list, which doubles as a revision checklist. Nine items across two columns — if you can say two sentences about each, you have the chapter.</p>
<table>
<tr><th>Summary item</th><th>Where it was</th><th>The one thing to remember</th></tr>
<tr><td>Principle of locality</td><td>Slides 2–8</td><td>Temporal = same place again · Spatial = nearby place. Empirical, not provable</td></tr>
<tr><td>Characteristics of memory systems</td><td>Slides 9–13 (Table 4.1)</td><td>Location · Capacity · Unit of transfer · Access method · Performance · Physical type · Physical characteristics · Organization</td></tr>
<tr><td>Performance modeling of a multilevel memory hierarchy</td><td>Slides 17, 28</td><td>T = T1 + (1 − H) × T2, nested for n levels</td></tr>
<tr><td>— Two-level memory access</td><td>Slides 23–24</td><td>Always pay T1; pay T2 only on the (1 − H) misses; a miss copies a BLOCK</td></tr>
<tr><td>— Multilevel memory access</td><td>Slide 28 (Figure 4.14)</td><td>h<sub>i</sub> are LOCAL (conditional) hit ratios</td></tr>
<tr><td>The memory hierarchy</td><td>Slides 14–15</td><td>Trade-off: capacity · speed · cost. No technology wins all three</td></tr>
<tr><td>— Cost and performance characteristics</td><td>Slides 16, 25, 26</td><td>C<sub>s</sub> = (C1·S1 + C2·S2)/(S1 + S2) · efficiency = 1/(1 + (1 − H)·r)</td></tr>
<tr><td>— Typical members of the memory hierarchy</td><td>Slides 15, 19 (Table 4.2)</td><td>Registers · cache · main memory · SSD · disk · tape, managed by compiler · hardware · OS · OS/user</td></tr>
<tr><td>— The IBM z13 memory hierarchy</td><td>Slide 21</td><td>Four cache levels, split I/D at L1–L2, SRAM up top and eDRAM below, 10 TB of DRAM</td></tr>
<tr><td>— Design principles for a memory hierarchy</td><td>Slide 22</td><td>Locality · Inclusion · Coherence</td></tr>
</table>
<ul>
<li><strong>The chapter in one paragraph, if you can only keep one.</strong> No single memory technology is simultaneously fast, large and cheap. But programs have <em>locality</em> — they reuse the same locations (temporal) and nearby locations (spatial). So build the machine from several technologies, keep the active working set in a small fast level, and the average access time approaches the fast level (Figure 4.12) while the average cost per bit approaches the slow one (Figure 4.11). The whole thing collapses when locality is absent (Figure 4.13's diagonal).</li>
<li><strong>The formula sheet — four lines, all of them derivable from Figure 4.8:</strong> (1) T<sub>s</sub> = T<sub>1</sub> + (1 − H)·T<sub>2</sub>. (2) Efficiency = T<sub>1</sub>/T<sub>s</sub> = 1/(1 + (1 − H)·r), r = T<sub>2</sub>/T<sub>1</sub>. (3) C<sub>s</sub> = (C<sub>1</sub>S<sub>1</sub> + C<sub>2</sub>S<sub>2</sub>)/(S<sub>1</sub> + S<sub>2</sub>). (4) Multilevel: T = t<sub>1</sub> + (1 − h<sub>1</sub>)[t<sub>2</sub> + (1 − h<sub>2</sub>)[t<sub>3</sub> + …]]. Plus T<sub>N</sub> = T<sub>A</sub> + N/R from slide 12 for non-random devices.</li>
<li><strong>The three numbers worth carrying into the exam.</strong> With T<sub>1</sub> = 1 ns and T<sub>2</sub> = 100 ns: H = 0,90 → 11 ns · H = 0,95 → 6 ns · H = 0,99 → 2 ns. If a question's answer is wildly outside that band for similar inputs, you have made an arithmetic slip.</li>
<li><strong>What comes next.</strong> <strong>Chapter 5 is this chapter made real</strong>: cache mapping (direct, associative, set-associative), replacement (LRU, FIFO, random), write policy (write-through, write-back) and block size are all the unanswered questions of slide 24. Chapter 6 supplies the technologies (SRAM, DRAM, ROM, flash); Chapter 7 the external memory; Chapter 9 the OS-managed layer (virtual memory). <strong>Chapter 2's Amdahl's law</strong> explains why fixing memory pays off more than anything else, and it is the same reason slide 28's h<sub>1</sub> mattered more than h<sub>2</sub>.</li>
<li><strong>What connects outside CEA201.</strong> <em>CSI106</em> showed you a memory hierarchy picture in its first chapter — this is that picture with the arithmetic attached, so do not treat them as different material. <em>PRF192</em>: a C array is contiguous in memory, which is why row-major traversal beat column-major by 3,4× on the measurement in slide 6 — the fastest optimisation in that course is usually a locality fix, not a cleverer algorithm.</li>
</ul>
<p class="meo">💡 Self-test before the exam, five questions: (1) Define temporal and spatial locality and give a C example of each. (2) With T1 = 2 ns, T2 = 80 ns and H = 0,96, find T<sub>s</sub>. (3) What H makes T<sub>s</sub> ≤ 4 ns for the same T1, T2? (4) Name the three design principles and what each guards against. (5) Why does the "No Locality" line make a hierarchy worthless? Answers: (2) 2 + 0,04 × 80 = <strong>5,2 ns</strong>; (3) (1 − H) ≤ 2/80 = 0,025, so <strong>H ≥ 0,975</strong>. If you can do 2 and 3 in your head, the numeric half of this chapter is done.</p>`,
        `<p class="y-chinh">🎯 Danh mục nội dung của chính chương, kiêm luôn bảng kiểm ôn tập. Chín mục trên hai cột — nói được hai câu về mỗi mục là bạn nắm cả chương.</p>
<table>
<tr><th>Mục tổng kết</th><th>Nằm ở đâu</th><th>Một thứ phải nhớ</th></tr>
<tr><td>Nguyên lý cục bộ</td><td>Slide 2–8</td><td>Temporal = lại chính chỗ đó · Spatial = chỗ kề bên. Là thực nghiệm, không chứng minh được</td></tr>
<tr><td>Đặc tính của hệ thống nhớ</td><td>Slide 9–13 (Table 4.1)</td><td>Vị trí · Dung lượng · Đơn vị truyền · Phương pháp truy cập · Hiệu năng · Kiểu vật lý · Tính chất vật lý · Tổ chức</td></tr>
<tr><td>Mô hình hoá hiệu năng phân cấp nhiều mức</td><td>Slide 17, 28</td><td>T = T1 + (1 − H) × T2, lồng nhau cho n mức</td></tr>
<tr><td>— Truy cập bộ nhớ hai mức</td><td>Slide 23–24</td><td>Luôn trả T1; chỉ trả T2 ở phần (1 − H) bị trượt; trượt thì chép một KHỐI</td></tr>
<tr><td>— Truy cập bộ nhớ nhiều mức</td><td>Slide 28 (Figure 4.14)</td><td>Các h<sub>i</sub> là tỉ lệ trúng CỤC BỘ (có điều kiện)</td></tr>
<tr><td>Phân cấp bộ nhớ</td><td>Slide 14–15</td><td>Đánh đổi: dung lượng · tốc độ · giá. Không công nghệ nào thắng cả ba</td></tr>
<tr><td>— Đặc tính giá và hiệu năng</td><td>Slide 16, 25, 26</td><td>C<sub>s</sub> = (C1·S1 + C2·S2)/(S1 + S2) · hiệu suất = 1/(1 + (1 − H)·r)</td></tr>
<tr><td>— Các thành viên tiêu biểu của phân cấp</td><td>Slide 15, 19 (Table 4.2)</td><td>Thanh ghi · cache · bộ nhớ chính · SSD · đĩa · băng từ, quản bởi trình biên dịch · phần cứng · OS · OS/người dùng</td></tr>
<tr><td>— Phân cấp bộ nhớ của IBM z13</td><td>Slide 21</td><td>Bốn mức cache, tách I/D ở L1–L2, SRAM ở trên và eDRAM ở dưới, 10 TB DRAM</td></tr>
<tr><td>— Nguyên lý thiết kế cho một phân cấp</td><td>Slide 22</td><td>Locality · Inclusion · Coherence</td></tr>
</table>
<ul>
<li><strong>Cả chương trong một đoạn, nếu chỉ được giữ lại một thứ.</strong> Không công nghệ nhớ đơn lẻ nào vừa nhanh, vừa lớn, vừa rẻ. Nhưng chương trình có <em>TÍNH CỤC BỘ</em> — chúng dùng lại chính những ô vừa dùng (thời gian) và những ô kề bên (không gian). Vậy nên hãy dựng máy từ NHIỀU công nghệ, giữ tập làm việc đang hoạt động trong một mức nhỏ và nhanh, khi đó thời gian truy cập trung bình tiến tới mức nhanh (Figure 4.12) còn giá trung bình mỗi bit tiến tới mức chậm (Figure 4.11). Toàn bộ chuyện đó sụp đổ khi không có tính cục bộ (đường chéo của Figure 4.13).</li>
<li><strong>Tờ công thức — bốn dòng, cả bốn đều suy ra được từ Figure 4.8:</strong> (1) T<sub>s</sub> = T<sub>1</sub> + (1 − H)·T<sub>2</sub>. (2) Hiệu suất = T<sub>1</sub>/T<sub>s</sub> = 1/(1 + (1 − H)·r), với r = T<sub>2</sub>/T<sub>1</sub>. (3) C<sub>s</sub> = (C<sub>1</sub>S<sub>1</sub> + C<sub>2</sub>S<sub>2</sub>)/(S<sub>1</sub> + S<sub>2</sub>). (4) Nhiều mức: T = t<sub>1</sub> + (1 − h<sub>1</sub>)[t<sub>2</sub> + (1 − h<sub>2</sub>)[t<sub>3</sub> + …]]. Cộng thêm T<sub>N</sub> = T<sub>A</sub> + N/R ở slide 12 cho thiết bị không truy cập ngẫu nhiên.</li>
<li><strong>Ba con số đáng mang vào phòng thi.</strong> Với T<sub>1</sub> = 1 ns và T<sub>2</sub> = 100 ns: H = 0,90 → 11 ns · H = 0,95 → 6 ns · H = 0,99 → 2 ns. Nếu đáp án của bạn với dữ liệu tương tự lệch xa khỏi dải đó thì bạn đã tính nhầm ở đâu đó.</li>
<li><strong>Tiếp theo là gì.</strong> <strong>Chương 5 là chương này được làm cho có thật</strong>: ánh xạ cache (trực tiếp, liên kết đầy đủ, liên kết theo tập), thay thế (LRU, FIFO, ngẫu nhiên), chính sách ghi (write-through, write-back) và kích thước khối đều là những câu hỏi mà slide 24 bỏ ngỏ. Chương 6 cung cấp công nghệ (SRAM, DRAM, ROM, flash); Chương 7 lo bộ nhớ ngoài; Chương 9 lo tầng do hệ điều hành quản (bộ nhớ ảo). <strong>Định luật Amdahl của Chương 2</strong> giải thích vì sao chữa bộ nhớ lại lời hơn mọi thứ khác, và đó cũng là lý do h<sub>1</sub> ở slide 28 quan trọng hơn h<sub>2</sub>.</li>
<li><strong>Nối ra ngoài CEA201.</strong> <em>CSI106</em> đã cho bạn xem bức tranh phân cấp bộ nhớ ngay chương đầu — đây chính là bức tranh đó kèm theo phần tính toán, nên đừng coi hai bên là hai mảng kiến thức khác nhau. <em>PRF192</em>: mảng trong C nằm liền kề trong bộ nhớ, và đó là lý do duyệt theo hàng thắng duyệt theo cột 3,4 lần trong phép đo ở slide 6 — tối ưu hiệu quả nhất trong môn đó thường là một phép sửa tính cục bộ chứ không phải một thuật toán khôn hơn.</li>
</ul>
<p class="meo">💡 Tự kiểm trước khi thi, năm câu: (1) Định nghĩa cục bộ thời gian và không gian, mỗi loại cho một ví dụ C. (2) Với T1 = 2 ns, T2 = 80 ns và H = 0,96, tính T<sub>s</sub>. (3) Với cùng T1, T2 đó thì H bằng bao nhiêu để T<sub>s</sub> ≤ 4 ns? (4) Kể ba nguyên lý thiết kế và mỗi cái phòng chuyện gì. (5) Vì sao đường "No Locality" làm cho phân cấp trở nên vô giá trị? Đáp án: (2) 2 + 0,04 × 80 = <strong>5,2 ns</strong>; (3) (1 − H) ≤ 2/80 = 0,025, vậy <strong>H ≥ 0,975</strong>. Làm được câu 2 và 3 trong đầu là bạn đã xong nửa tính toán của chương này.</p>`],
    ]),
  ].join('\n'),
};
