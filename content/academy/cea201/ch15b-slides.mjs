/**
 * CEA201 · Chương 15 trên web (deck 'cea20' = Ch.20 bản 11e — Parallel
 * Processing), học theo từng slide, PHẦN B: slide 21–40.
 *
 * Nội dung bám ĐÚNG chữ trích từ CH20-COA11e.pptx (/tmp/cea201-text/cea20.txt).
 * Slide chỉ có tiêu đề + hình (21, 22, 23, 26, 27, 29, 32, 34, 37, 38) đã được
 * ĐỌC THẲNG TỪ ẢNH render trong /tmp/cea201-slides/cea20/NNN.webp.
 *
 * ⚠️ NỘI DUNG THẬT của slide 21–40 KHÔNG hoàn toàn trùng mô tả "cụm máy +
 * NUMA + đa luồng + vector/SIMD":
 *   · 21–27 vẫn là phần ĐUÔI của MESI / cache coherence (Fig 20.7, Read Miss,
 *     Read Hit, Write Miss, Write Hit, Fig 20.8, Fig 20.9).
 *   · 28–32 đa luồng phần cứng + chip multiprocessor (Fig 20.10).
 *   · 33–35 cụm máy tính (Fig 20.11, Table 20.2).
 *   · 36–39 NUMA / CC-NUMA (Fig 20.12).
 *   · 40 tổng kết chương.
 *   · KHÔNG có một slide nào về vector/SIMD trong dải 21–40. SIMD chỉ xuất hiện
 *     ở slide 2 (bảng phân loại Flynn), tức thuộc phần A.
 * Vì thế tiêu đề bài đã sửa cho khớp nội dung thật; slug giữ nguyên theo yêu cầu.
 *
 * ⚠️ MỌI con số đã kiểm bằng python3 TRƯỚC khi viết:
 *   · NUMA T = p×100 + (1−p)×300 ns cho p = 1 · 0,95 · 0,9 · 0,8 · 0,7 · 0,5 ·
 *     0,3 · 0 → 100 · 110 · 120 · 140 · 160 · 200 · 240 · 300 ns. Ngưỡng
 *     T = 150 ns ⇔ p = 0,75.
 *   · Amdahl S(N) = 1/(f + (1−f)/N). f = 5%: N = 8/16/64/256 → 5,93 · 9,14 ·
 *     15,42 · 18,62 (trần 20). f = 1%: → 7,48 · 13,91 · 39,26 · 72,11 (trần 100).
 *   · Khe phát lệnh (4 khe × 8 chu kỳ = 32 khe): superscalar 1 luồng 13/32 =
 *     40,6% · xen kẽ 18/32 = 56,2% · theo khối 13/32 = 40,6% · SMT 29/32 = 90,6%.
 *
 * ⚠️ PHÉP ĐO THẬT (chạy trên chính máy viết bài — Apple M1 Max, Apple clang,
 *    cc -O2, pthreads):
 *   · sysctl hw.physicalcpu = 10, hw.logicalcpu = 10 ⇒ máy này KHÔNG có SMT.
 *     Chia tiếp: perflevel0 (P-core) 8 nhân, perflevel1 (E-core) 2 nhân.
 *   · Tổng chuỗi Leibniz 2 tỉ số hạng, chia đều theo luồng:
 *     1 luồng 1,986 s · 2 → 1,056 s (1,88×) · 4 → 0,506 s (3,93×) ·
 *     8 → 0,295 s (6,73×) · 10 → 0,287 s (6,92×) · 16 → 0,260 s (7,64×).
 *     10 luồng chỉ được 6,92× vì 2 trong 10 nhân là E-core chậm hơn hẳn mà
 *     chương trình chia đều phần việc — bài học cân tải, nêu thẳng trong bài.
 *
 * Chỗ slide gốc GHI SAI / THIẾU — nêu rõ, không im lặng chép, không tự sửa:
 *   · slide 22 in "Wen a read miss occurs" (thiếu chữ h của "When").
 *   · slide 22 hứa "a number of possible outcomes" rồi KHÔNG liệt kê outcome nào.
 *   · slide 35 (Table 20.2) bị vỡ chữ khi trích: "Servers Connected toDisks",
 *     "simul-taneously".
 *   · slide 40 tổng kết KHÔNG nhắc "Multithreading" đúng chỗ theo thứ tự bài
 *     giảng và chèn hai dòng "Parallel"/"Processing" (chữ trang trí của slide).
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea20';

export default {
  title: '15.0b — Slide by slide: MESI transactions, hardware multithreading, clusters and NUMA (slides 21–40)|||15.0b — Slide bài giảng: Giao dịch MESI, đa luồng phần cứng, cụm máy tính & NUMA (slide 21–40)',
  slug: 'cea201-15-0b-slides-mesi-da-luong-cum-may-numa',
  type: 'DOCUMENT',
  description: 'Nửa sau Chương 20 bản 11e (slide 21–40) — phần đóng lại toàn bộ khối xử lý song song của CEA201. Đi từ đuôi giao thức MESI (bảng trạng thái cho phép giữa các cache, bốn giao dịch Read Miss · Read Hit · Write Miss · Write Hit, hai giản đồ luồng Figure 20.8/20.9), sang đa luồng phần cứng (MIPS = f × IPC, xen kẽ · theo khối · SMT · chip multiprocessor, có bảng khe phát lệnh dựng lại từ Figure 20.10), rồi cụm máy tính (năm phương pháp gom cụm của Table 20.2) và khép lại bằng NUMA/CC-NUMA. Có bảng so ba kiến trúc SMP · Cluster · NUMA, bài tính thời gian truy cập trung bình NUMA theo tỉ lệ truy cập cục bộ, bảng Amdahl cho 8/16/64/256 nút, và số đo THẬT về số lõi cùng tăng tốc đa luồng trên máy viết bài.',
  content: [
    walkHead(D, 21, 40),
    walk(D, [

      [21, 'Figure 20.7 — Relationship Between Cache Lines in Cooperating Caches',
        `<p class="y-chinh">🎯 A four-row table that answers one question for each MESI state: <strong>if MY cache holds block <em>i</em> in state X, what states are other caches allowed to hold it in?</strong> It is the compatibility matrix that makes MESI a <em>protocol</em> rather than four disconnected labels.</p>
<table>
<tr><th>State of the line in MY (local) cache</th><th>Allowable states in OTHER caches mapping to the same memory block <em>i</em></th></tr>
<tr><td><strong>Modified</strong></td><td>Invalid — and nothing else</td></tr>
<tr><td><strong>Exclusive</strong></td><td>Invalid — and nothing else</td></tr>
<tr><td><strong>Shared</strong></td><td>Shared or Invalid</td></tr>
<tr><td><strong>Invalid</strong></td><td>Modified, Exclusive, Shared or Invalid — anything at all</td></tr>
</table>
<ul>
<li><strong>The invariant in one line.</strong> At most one cache may be in M or E for a given block. That single rule is what the whole snooping machinery on slides 22–27 exists to enforce, and it is why a write to an M or E line needs no bus traffic at all (Table 20.1 on slide 19: "does not go to bus").</li>
<li><strong>Why M and E share a row.</strong> Both mean <em>I am the only holder</em>. They differ only in whether memory is up to date — M says memory is stale, E says memory is valid. So they impose the same constraint on everyone else (Invalid) but different obligations on me (M must write back before giving the line up; E may simply drop it).</li>
<li><strong>Why Shared is symmetric.</strong> Many readers are allowed at once — that is the whole point of S. Every holder has the same clean copy, memory is valid, and nobody may write without first kicking the others out (the write hit on S, slide 25).</li>
<li><strong>Why the Invalid row is unrestricted.</strong> "I hold nothing" constrains nobody. This row is not a rule; it is the absence of one, and it is why a cache can always silently drop a clean line.</li>
<li><strong>Read it as a checklist for exam questions.</strong> Any state combination an exam offers you that is NOT in this table is illegal — for example "cache 1 = Modified, cache 2 = Shared" can never happen, and "cache 1 = Exclusive, cache 2 = Exclusive" can never happen either.</li>
</ul>
<p class="meo">💡 Compress it to: <strong>M and E are lonely, S is sociable, I is nobody's business.</strong></p>
<p class="pitfall">⚠️ Trap: students read the Shared row as "all other caches must be Shared". It says <em>Shared OR Invalid</em>. A block can be S in my cache while every other cache has already evicted it — the protocol never forces anyone to keep a copy, it only forbids illegal combinations.</p>`,
        `<p class="y-chinh">🎯 Một bảng bốn dòng trả lời đúng một câu hỏi cho từng trạng thái MESI: <strong>nếu cache CỦA TÔI đang giữ khối <em>i</em> ở trạng thái X, thì các cache khác được phép giữ nó ở những trạng thái nào?</strong> Đây là ma trận tương thích biến MESI thành một <em>GIAO THỨC</em> chứ không phải bốn cái nhãn rời rạc.</p>
<table>
<tr><th>Trạng thái dòng trong cache CỦA TÔI</th><th>Trạng thái được phép ở các cache KHÁC cùng ánh xạ khối <em>i</em></th></tr>
<tr><td><strong>Modified (đã sửa)</strong></td><td>Chỉ Invalid — không gì khác</td></tr>
<tr><td><strong>Exclusive (độc quyền)</strong></td><td>Chỉ Invalid — không gì khác</td></tr>
<tr><td><strong>Shared (chia sẻ)</strong></td><td>Shared hoặc Invalid</td></tr>
<tr><td><strong>Invalid (vô hiệu)</strong></td><td>Modified, Exclusive, Shared hoặc Invalid — bất cứ thứ gì</td></tr>
</table>
<ul>
<li><strong>Bất biến gói trong một câu.</strong> Với một khối, NHIỀU NHẤT một cache được ở M hoặc E. Đúng một luật đó là thứ mà toàn bộ bộ máy snooping ở slide 22–27 tồn tại để bảo vệ, và là lý do ghi vào dòng M hay E <em>không cần một chút lưu lượng bus nào</em> (Table 20.1 ở slide 19: "does not go to bus").</li>
<li><strong>Vì sao M và E chung một luật.</strong> Cả hai đều nghĩa là <em>chỉ mình tôi giữ</em>. Chúng chỉ khác nhau ở chỗ bộ nhớ chính còn đúng hay không — M nói bộ nhớ đã cũ, E nói bộ nhớ vẫn đúng. Nên chúng áp cùng một ràng buộc lên người khác (Invalid) nhưng khác nghĩa vụ với tôi (M phải ghi trả trước khi nhả dòng; E thì vứt đi là xong).</li>
<li><strong>Vì sao Shared đối xứng.</strong> Nhiều người ĐỌC cùng lúc là được phép — đó chính là mục đích của S. Mọi người giữ cùng một bản sạch, bộ nhớ vẫn đúng, và không ai được GHI nếu chưa đuổi hết những người kia ra (ca ghi trúng dòng S, slide 25).</li>
<li><strong>Vì sao dòng Invalid không ràng buộc gì.</strong> "Tôi chẳng giữ gì" thì chẳng ràng buộc ai. Dòng này không phải một luật; nó là SỰ VẮNG MẶT của luật, và là lý do một cache luôn được âm thầm vứt bỏ dòng sạch.</li>
<li><strong>Đọc nó như một bảng đối chiếu khi đi thi.</strong> Bất kỳ tổ hợp trạng thái nào đề đưa ra mà KHÔNG có trong bảng này đều là bất hợp lệ — ví dụ "cache 1 = Modified, cache 2 = Shared" không bao giờ xảy ra được, và "cache 1 = Exclusive, cache 2 = Exclusive" cũng vậy.</li>
</ul>
<p class="meo">💡 Nén lại: <strong>M và E là kẻ cô độc, S thích tụ tập, I thì chẳng liên quan tới ai.</strong></p>
<p class="pitfall">⚠️ Bẫy: sinh viên đọc dòng Shared thành "mọi cache khác PHẢI là Shared". Bảng ghi <em>Shared HOẶC Invalid</em>. Một khối có thể đang S trong cache tôi trong khi mọi cache khác đã đuổi nó đi từ lâu — giao thức không bao giờ bắt ai phải GIỮ bản sao, nó chỉ CẤM những tổ hợp bất hợp lệ.</p>`],

      [22, 'Read Miss',
        `<p class="y-chinh">🎯 The first of the four MESI transactions. A read miss means the line is <strong>Invalid (or absent) in my cache</strong>, so the processor issues a memory read on the bus — and, crucially, <strong>alerts every other processor/cache unit to snoop the transaction</strong>.</p>
<ul>
<li><strong>The slide's three bullets, exactly.</strong> (1) On a read miss in the local cache, the processor initiates a memory read for the line of main memory containing the missing address. (2) It inserts a signal on the bus that alerts all other processor/cache units to <em>snoop</em> the transaction. (3) "There are a number of possible outcomes resulting from this process."</li>
<li><strong>What those outcomes are</strong> (from the book, since the slide stops before listing them). If <em>one other cache has the line Modified</em>: that cache blocks the memory read, writes its line back to main memory, and both copies end up <strong>Shared</strong>. If <em>one or more caches have it Shared</em>: they signal "shared" and my copy becomes <strong>Shared</strong>. If <em>one other cache has it Exclusive</em>: it signals shared and downgrades itself to <strong>Shared</strong>, and so do I. If <em>no other cache holds it</em>: no signal comes back, and my copy becomes <strong>Exclusive</strong>.</li>
<li><strong>Notice what is doing the work: the snoop signal.</strong> Without it, my cache would have to guess whether the line is elsewhere, and it would always have to assume the worst (Shared), giving up the cheap silent writes that E makes possible. One extra wire buys back a whole optimisation.</li>
<li><strong>This is why E exists at all.</strong> A protocol with only M, S and I would work correctly; E is purely a performance state, born exactly here, at the "no other cache answered" outcome of a read miss.</li>
<li><strong>Cost, in Ch.4/Ch.5 terms.</strong> A read miss on an SMP costs a DRAM access <em>plus</em> a bus arbitration <em>plus</em> a snoop round — worse than the uniprocessor miss you priced with T = T1 + (1 − H) × T2, and it is why slide 10 said "performance is limited by bus cycle time".</li>
</ul>
<p class="pitfall">⚠️ Two honest defects in this slide. First, the original .pptx prints "<strong>Wen</strong> a read miss occurs" — a typo for "When"; do not memorise it as a technical term. Second, the slide promises "a number of possible outcomes" and then <strong>never lists them</strong>; the four outcomes above come from the textbook, not from the slide. Exams have asked for them, so learn them anyway.</p>`,
        `<p class="y-chinh">🎯 Giao dịch MESI thứ nhất trong bốn. Đọc trượt nghĩa là dòng đó đang <strong>Invalid (hoặc không có) trong cache của tôi</strong>, nên bộ xử lý phát một lệnh đọc bộ nhớ lên bus — và, quan trọng nhất, <strong>báo cho MỌI khối bộ xử lý/cache khác cùng snoop giao dịch này</strong>.</p>
<ul>
<li><strong>Đúng ba gạch đầu dòng của slide.</strong> (1) Khi đọc trượt ở cache cục bộ, bộ xử lý khởi động một lệnh đọc bộ nhớ để lấy dòng của bộ nhớ chính chứa địa chỉ bị thiếu. (2) Nó đặt một tín hiệu lên bus báo cho tất cả các khối bộ xử lý/cache khác <em>snoop</em> (nghe lén) giao dịch. (3) "Có một số kết cục có thể xảy ra từ quá trình này."</li>
<li><strong>Những kết cục đó là gì</strong> (lấy từ SÁCH, vì slide dừng trước khi liệt kê). Nếu <em>một cache khác đang giữ dòng ở Modified</em>: cache đó chặn lệnh đọc, ghi trả dòng về bộ nhớ chính, rồi cả hai bản cùng thành <strong>Shared</strong>. Nếu <em>một hoặc nhiều cache đang giữ ở Shared</em>: chúng báo tín hiệu "shared" và bản của tôi thành <strong>Shared</strong>. Nếu <em>một cache khác đang giữ ở Exclusive</em>: nó báo shared rồi tự hạ xuống <strong>Shared</strong>, tôi cũng vào Shared. Nếu <em>không cache nào giữ</em>: không có tín hiệu nào vọng lại, bản của tôi thành <strong>Exclusive</strong>.</li>
<li><strong>Để ý thứ đang làm việc ở đây: TÍN HIỆU SNOOP.</strong> Không có nó, cache tôi phải ĐOÁN xem dòng này có ở chỗ khác không, và luôn phải đoán theo hướng xấu nhất (Shared), tức vứt bỏ luôn cái lợi ghi im lặng mà E mang lại. Thêm một sợi dây mua lại được cả một phép tối ưu.</li>
<li><strong>Đây chính là lý do E tồn tại.</strong> Một giao thức chỉ có M, S, I vẫn chạy ĐÚNG; E thuần tuý là trạng thái vì HIỆU NĂNG, và nó sinh ra đúng tại đây — ở kết cục "không cache nào trả lời" của một lần đọc trượt.</li>
<li><strong>Giá phải trả, quy về ngôn ngữ Ch.4/Ch.5.</strong> Một lần đọc trượt trên SMP tốn một lần truy cập DRAM <em>cộng</em> một lần tranh bus <em>cộng</em> một vòng snoop — đắt hơn lần trượt trên máy một bộ xử lý mà bạn tính bằng T = T1 + (1 − H) × T2, và đó là lý do slide 10 nói "hiệu năng bị giới hạn bởi thời gian chu kỳ bus".</li>
</ul>
<p class="pitfall">⚠️ Hai khiếm khuyết có thật của slide này. Thứ nhất, file .pptx gốc in "<strong>Wen</strong> a read miss occurs" — gõ thiếu chữ h của "When"; đừng học thuộc nó như một thuật ngữ. Thứ hai, slide hứa "a number of possible outcomes" rồi <strong>KHÔNG liệt kê cái nào cả</strong>; bốn kết cục ở trên lấy từ giáo trình, không phải từ slide. Đề thi từng hỏi đúng chỗ này nên vẫn phải học.</p>`],

      [23, 'Read Hit',
        `<p class="y-chinh">🎯 The shortest slide of the chapter, and deliberately so. Read as rendered, the three panels say: "When a read hit occurs on a line currently in the local cache, <strong>the processor simply reads the required item</strong>" · "<strong>There is no state change</strong>" · "The state remains <strong>modified, shared, or exclusive</strong>".</p>
<ul>
<li><strong>Why this case is free.</strong> Reading never invalidates anyone else's copy, so no other cache needs to be told anything. No bus transaction, no snoop, no state transition — the common case costs exactly what an uniprocessor read costs.</li>
<li><strong>That is the entire economic argument for caches on an SMP.</strong> Slide 10 warned that every memory reference passing through the shared bus would throttle the machine. Read hits are the majority of all references (Ch.4 locality), and this slide says they generate <em>zero</em> bus traffic. Coherence overhead is paid only on the minority of operations.</li>
<li><strong>Read the list of surviving states carefully: M, S, E — but not I.</strong> Of course: a hit on an Invalid line is a contradiction in terms. If the line is I, you are in the Read Miss case of slide 22.</li>
<li><strong>A read hit on M is legitimate and stays M.</strong> Students often expect the dirty line to be written back on a read. It is not — the line is mine alone, memory being stale is nobody's problem until someone else asks for the block (which is exactly the Figure 20.8 scenario on slide 26).</li>
<li><strong>Connect to Ch.5.</strong> In uniprocessor terms this is the plain "cache hit, read": tag matches, line is valid, word is delivered in T1. MESI adds nothing to that path; the protocol only wakes up when sharing is threatened.</li>
</ul>
<p class="meo">💡 Remember the four transactions by how much noise they make: <strong>Read Hit = silence</strong> · Write Hit = silence unless the line is Shared · Read Miss = one bus read + snoop · Write Miss = one RWITM + snoop. Noise grows exactly with how much damage the operation could do to other caches.</p>`,
        `<p class="y-chinh">🎯 Slide ngắn nhất chương, và cố ý ngắn. Đọc thẳng từ ảnh, ba khung nói: "Khi đọc TRÚNG một dòng đang có trong cache cục bộ, <strong>bộ xử lý chỉ việc đọc mục cần đọc</strong>" · "<strong>Không có thay đổi trạng thái nào</strong>" · "Trạng thái vẫn là <strong>modified, shared, hoặc exclusive</strong>".</p>
<ul>
<li><strong>Vì sao ca này MIỄN PHÍ.</strong> Đọc không bao giờ làm hỏng bản sao của ai, nên chẳng cần báo cho cache nào cả. Không giao dịch bus, không snoop, không chuyển trạng thái — ca phổ biến nhất tốn đúng bằng một lần đọc trên máy đơn bộ xử lý.</li>
<li><strong>Đó là toàn bộ lập luận kinh tế cho việc gắn cache vào SMP.</strong> Slide 10 cảnh báo rằng mọi tham chiếu bộ nhớ đi qua bus dùng chung sẽ bóp nghẹt cả máy. Đọc trúng chiếm đa số mọi tham chiếu (tính cục bộ, Ch.4), và slide này nói chúng sinh ra <em>KHÔNG</em> lưu lượng bus nào. Chi phí đồng bộ chỉ trả trên phần thiểu số.</li>
<li><strong>Đọc kỹ danh sách trạng thái còn lại: M, S, E — KHÔNG có I.</strong> Tất nhiên: "trúng" một dòng Invalid là mâu thuẫn về mặt định nghĩa. Dòng đang I thì bạn đang ở ca Read Miss của slide 22.</li>
<li><strong>Đọc trúng dòng M là hợp lệ và VẪN Ở M.</strong> Sinh viên hay tưởng dòng bẩn sẽ bị ghi trả khi đọc. Không hề — dòng đó là của riêng tôi, chuyện bộ nhớ chính đang cũ chẳng làm phiền ai cho tới khi có người khác hỏi tới khối này (đúng kịch bản Figure 20.8 ở slide 26).</li>
<li><strong>Nối về Ch.5.</strong> Theo ngôn ngữ máy đơn, đây là ca "cache hit, đọc" trần trụi: tag khớp, dòng hợp lệ, từ được trả về trong T1. MESI không thêm gì vào đường này; giao thức chỉ thức dậy khi chuyện chia sẻ bị đe doạ.</li>
</ul>
<p class="meo">💡 Nhớ bốn giao dịch theo mức độ "ồn ào": <strong>Đọc trúng = im lặng</strong> · Ghi trúng = im lặng trừ khi dòng đang Shared · Đọc trượt = một lệnh đọc bus + snoop · Ghi trượt = một RWITM + snoop. Độ ồn tăng đúng theo mức thiệt hại mà thao tác đó có thể gây cho cache của người khác.</p>`],

      [24, 'Write Miss',
        `<p class="y-chinh">🎯 The most expensive of the four transactions. A write miss cannot be served by a plain memory read, because the moment the line arrives it will be dirtied — so the processor issues a special bus signal: <strong>RWITM, read-with-intent-to-modify</strong>.</p>
<ul>
<li><strong>The slide, point by point.</strong> On a write miss the processor initiates a memory read for the line containing the missing address; it issues a signal on the bus meaning <strong>read-with-intent-to-modify (RWITM)</strong>; when the line is loaded it is <strong>immediately marked Modified</strong>; and two scenarios can precede that load — <em>some other cache may have a modified copy</em>, or <em>no other cache has a modified copy</em>.</li>
<li><strong>Why RWITM instead of a normal read.</strong> A normal read leaves other copies alive in Shared. A write must leave <em>no</em> other copies at all (Figure 20.7, slide 21: M allows only Invalid elsewhere). RWITM says "give me the line <em>and</em> everybody else drop yours" in a single bus transaction instead of two.</li>
<li><strong>Scenario 1 — another cache holds it Modified.</strong> That cache must intervene: it signals the initiator to retry, writes its modified line back to main memory, and sets its own copy to Invalid. The initiator then reads the (now current) line from memory, marks it Modified, and is the sole owner. This is Figure 20.9 on slide 27, the right-hand "Participant" branch labelled "WB modified line → Set I".</li>
<li><strong>Scenario 2 — no modified copy anywhere.</strong> No write-back is needed. Every cache holding the line in S or E simply sets it Invalid; the initiator loads from memory and marks Modified.</li>
<li><strong>Cost, honestly.</strong> Scenario 1 costs <em>two</em> memory transfers (the other cache's write-back, then my read) plus the retry — the worst single event in MESI. This is exactly why false sharing hurts so much: two cores writing different variables that land on <em>the same line</em> ping-pong through this path forever, and the profiler shows nothing wrong with either thread.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: "after a write miss the line is Exclusive". <strong>Wrong.</strong> The slide says explicitly it is marked <em>Modified</em> immediately — the processor is about to write, so memory is stale from the very first instant. E is only reachable from a read miss with no sharers.</p>`,
        `<p class="y-chinh">🎯 Giao dịch đắt nhất trong bốn. Ghi trượt không thể phục vụ bằng một lệnh đọc bộ nhớ thường, vì dòng vừa về tới là sẽ bị làm bẩn ngay — nên bộ xử lý phát một tín hiệu bus đặc biệt: <strong>RWITM, read-with-intent-to-modify (đọc với ý định sửa)</strong>.</p>
<ul>
<li><strong>Slide, từng ý một.</strong> Khi ghi trượt, bộ xử lý khởi động một lệnh đọc bộ nhớ để lấy dòng chứa địa chỉ bị thiếu; nó phát lên bus một tín hiệu nghĩa là <strong>read-with-intent-to-modify (RWITM)</strong>; khi dòng được nạp thì nó <strong>được đánh dấu Modified NGAY LẬP TỨC</strong>; và có hai kịch bản đi trước lần nạp đó — <em>một cache khác có thể đang giữ bản đã sửa</em>, hoặc <em>không cache nào giữ bản đã sửa</em>.</li>
<li><strong>Vì sao phải RWITM chứ không phải đọc thường.</strong> Đọc thường để các bản sao khác sống tiếp ở Shared. Nhưng ghi thì phải <em>KHÔNG</em> còn bản sao nào khác (Figure 20.7, slide 21: M chỉ cho phép Invalid ở nơi khác). RWITM nói "đưa tôi dòng này <em>và</em> mọi người vứt bản của mình đi" trong MỘT giao dịch bus thay vì hai.</li>
<li><strong>Kịch bản 1 — một cache khác đang giữ ở Modified.</strong> Cache đó phải can thiệp: nó báo bên khởi xướng thử lại, ghi trả dòng đã sửa về bộ nhớ chính, rồi đặt bản của mình thành Invalid. Bên khởi xướng đọc dòng (giờ đã mới) từ bộ nhớ, đánh dấu Modified, và thành chủ sở hữu duy nhất. Đây đúng là Figure 20.9 ở slide 27, nhánh "Participant" bên phải ghi "WB modified line → Set I".</li>
<li><strong>Kịch bản 2 — không đâu có bản đã sửa.</strong> Không cần ghi trả. Mọi cache đang giữ dòng ở S hay E chỉ việc đặt Invalid; bên khởi xướng nạp từ bộ nhớ và đánh dấu Modified.</li>
<li><strong>Giá thật, nói thẳng.</strong> Kịch bản 1 tốn <em>HAI</em> lần chuyển bộ nhớ (cache kia ghi trả, rồi tôi đọc) cộng lần thử lại — sự kiện đơn lẻ tệ nhất trong MESI. Đó chính xác là lý do "chia sẻ giả" (false sharing) đau đến thế: hai lõi ghi hai biến KHÁC NHAU nhưng rơi vào <em>CÙNG MỘT DÒNG</em> sẽ đánh bóng bàn qua đường này mãi mãi, mà bộ đo hiệu năng nhìn từng luồng thì chẳng thấy gì sai.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: "sau khi ghi trượt thì dòng ở trạng thái Exclusive". <strong>SAI.</strong> Slide ghi rõ nó được đánh dấu <em>Modified</em> ngay lập tức — bộ xử lý sắp ghi, nên bộ nhớ chính đã cũ ngay từ giây đầu tiên. E chỉ tới được từ một lần ĐỌC trượt mà không có ai chia sẻ.</p>`],

      [25, 'Write Hit',
        `<p class="y-chinh">🎯 The transaction whose cost depends entirely on the current state. A write hit on <strong>Modified or Exclusive is free</strong>; a write hit on <strong>Shared requires a bus transaction</strong> to evict everyone else first. This is the single most exam-relevant slide of the MESI block.</p>
<table>
<tr><th>State of the line before the write</th><th>What the processor must do</th><th>Bus traffic?</th><th>State after</th></tr>
<tr><td><strong>Shared</strong></td><td>Gain exclusive ownership first: signal intent on the bus; every processor holding a shared copy transitions its sector from <strong>shared to invalid</strong>; then perform the update</td><td><strong>Yes</strong> — one invalidation broadcast</td><td>Modified</td></tr>
<tr><td><strong>Exclusive</strong></td><td>It already has exclusive control — simply perform the update</td><td>No</td><td>Modified</td></tr>
<tr><td><strong>Modified</strong></td><td>It already has exclusive control and the line is already marked modified — simply perform the update</td><td>No</td><td>Modified (unchanged)</td></tr>
</table>
<ul>
<li><strong>All three roads end at Modified.</strong> That is the mechanical summary of the slide: after any write hit, the line is M. Only the toll differs.</li>
<li><strong>The S row is the whole reason write-invalidate is called write-invalidate.</strong> "Multiple readers, but only one writer at a time" (slide 16). Turning a reader into a writer means demoting every other reader to Invalid, and that demotion is a broadcast the other caches snoop.</li>
<li><strong>The E row is the payoff for having an E state at all.</strong> Read a variable nobody else touches → E. Write it → free, no bus. Without E, that same write would have found the line in S and paid for a broadcast that invalidates nobody. In a loop, that difference is enormous.</li>
<li><strong>Why "sector" appears in the slide's wording.</strong> Some designs split a cache line into sectors with independent state bits; the sentence is written to cover them. For this course, read "sector" as "line".</li>
<li><strong>Where the performance bug lives.</strong> Two threads alternately writing the same shared variable put that line into a Shared→Modified→Invalid→Shared cycle on every single write. The code looks correct and runs an order of magnitude slower than one thread. Chapter 21 (multicore) returns to this under the name <em>coherence traffic</em>.</li>
</ul>
<p class="meo">💡 Three-word rule for write hits: <strong>"S pays, E and M don't."</strong></p>`,
        `<p class="y-chinh">🎯 Giao dịch mà giá của nó phụ thuộc HOÀN TOÀN vào trạng thái đang có. Ghi trúng dòng <strong>Modified hoặc Exclusive thì MIỄN PHÍ</strong>; ghi trúng dòng <strong>Shared thì phải có một giao dịch bus</strong> để đuổi hết người khác ra trước. Đây là slide dễ ra thi nhất của cả khối MESI.</p>
<table>
<tr><th>Trạng thái dòng TRƯỚC khi ghi</th><th>Bộ xử lý phải làm gì</th><th>Có lưu lượng bus?</th><th>Trạng thái SAU</th></tr>
<tr><td><strong>Shared</strong></td><td>Phải giành quyền sở hữu độc quyền trước: phát tín hiệu ý định lên bus; MỌI bộ xử lý đang giữ bản chia sẻ chuyển sector của nó từ <strong>shared sang invalid</strong>; rồi mới thực hiện cập nhật</td><td><strong>CÓ</strong> — một lần phát quảng bá vô hiệu hoá</td><td>Modified</td></tr>
<tr><td><strong>Exclusive</strong></td><td>Nó vốn đã độc quyền — chỉ việc cập nhật</td><td>Không</td><td>Modified</td></tr>
<tr><td><strong>Modified</strong></td><td>Nó vốn đã độc quyền và dòng đã được đánh dấu modified — chỉ việc cập nhật</td><td>Không</td><td>Modified (không đổi)</td></tr>
</table>
<ul>
<li><strong>Cả ba con đường đều kết thúc ở Modified.</strong> Đó là bản tóm tắt cơ học của slide: sau bất kỳ lần ghi trúng nào, dòng ở M. Chỉ khác nhau ở tiền phí đường.</li>
<li><strong>Dòng S chính là lý do write-invalidate mang tên "vô hiệu hoá khi ghi".</strong> "Nhiều người đọc, nhưng mỗi lúc chỉ một người ghi" (slide 16). Biến một người đọc thành người ghi nghĩa là hạ mọi người đọc khác xuống Invalid, và cú hạ cấp đó là một lần phát quảng bá mà các cache kia snoop được.</li>
<li><strong>Dòng E là phần thưởng cho việc có trạng thái E.</strong> Đọc một biến không ai khác đụng tới → E. Ghi nó → miễn phí, không đụng bus. Không có E thì chính lần ghi đó sẽ thấy dòng đang ở S và phải trả tiền cho một lần quảng bá chẳng vô hiệu hoá được ai. Trong một vòng lặp, chênh lệch đó là khổng lồ.</li>
<li><strong>Vì sao slide dùng chữ "sector".</strong> Một số thiết kế chia dòng cache thành các sector có bit trạng thái riêng; câu văn viết để phủ cả trường hợp đó. Trong môn này cứ đọc "sector" là "dòng".</li>
<li><strong>Con bọ hiệu năng nằm ở đâu.</strong> Hai luồng thay phiên ghi cùng một biến chia sẻ sẽ đẩy dòng đó vào vòng Shared→Modified→Invalid→Shared ở MỖI lần ghi. Mã trông vẫn đúng và chạy chậm hơn một luồng cả chục lần. Chương 21 (đa lõi) quay lại chuyện này dưới cái tên <em>coherence traffic</em> (lưu lượng đồng bộ cache).</li>
</ul>
<p class="meo">💡 Luật ba chữ cho ghi trúng: <strong>"S phải trả, E và M thì không."</strong></p>`],

      [26, 'Figure 20.8 — Initiator Reads from Writeback Cache',
        `<p class="y-chinh">🎯 The read-miss story of slide 22 drawn as <strong>two flowcharts running side by side</strong>: the <em>Initiator</em> (the cache that missed) on the left in green, the <em>Participant</em> (every snooping cache) on the right in pink, with red dashed arrows showing the signals crossing between them.</p>
<p class="nhan">📐 Walk the left column, exactly as the figure is drawn:</p>
<table>
<tr><th>Step (Initiator)</th><th>What happens</th></tr>
<tr><td><strong>CPU Read</strong> → <strong>Hit?</strong></td><td>Branch <em>hit</em> (states M, E, S) goes straight to <strong>To CPU</strong> — that is the free read hit of slide 23</td></tr>
<tr><td>Branch <em>miss</em> (state I)</td><td><strong>Signal RM</strong> (read miss) onto the bus — the red arrow carries it to the Participant</td></tr>
<tr><td><strong>WB victim</strong></td><td>If the line being evicted to make room is dirty, write it back first</td></tr>
<tr><td><strong>await signal</strong></td><td>The initiator <em>stalls</em> on a synchronisation bar until the snoopers answer</td></tr>
<tr><td><strong>Signal?</strong></td><td><em>null</em> → <strong>Set E</strong> · <em>S</em> → <strong>Set S</strong> · <em>M</em> → <strong>await WB</strong>, then Set S</td></tr>
<tr><td><strong>Load target line</strong> → <strong>To CPU</strong></td><td>The word is finally delivered</td></tr>
</table>
<p class="nhan">📐 And the right column, the Participant:</p>
<table>
<tr><th>Its state when it snoops the RM</th><th>What it does</th><th>Its state after</th></tr>
<tr><td><strong>M</strong></td><td><strong>Signal M</strong>, then <strong>WB modified line</strong> (write it back to memory)</td><td><strong>Set S</strong></td></tr>
<tr><td><strong>E or S</strong></td><td><strong>Signal S</strong> — no write-back needed, memory is already valid</td><td><strong>Set S</strong></td></tr>
<tr><td><strong>I</strong></td><td><strong>Signal null</strong> — it holds nothing, it has nothing to say</td><td>stays I (goes straight to <strong>Done</strong>)</td></tr>
</table>
<ul>
<li><strong>The two synchronisation bars are the point of the whole figure.</strong> "await signal" and "await WB" are <em>stalls</em>: the reading processor is frozen until other caches have spoken and, in the M case, until the dirty line has physically reached memory. Coherence is not free — it is measured in stalled cycles.</li>
<li><strong>Notice the E branch, and how cheap it is.</strong> All snoopers answer "null" ⇒ nobody else has the block ⇒ Set E. No write-back, no downgrade. Compare with slide 25: that E is what makes the next write to this line free.</li>
<li><strong>Notice that E and S give the same answer.</strong> A participant in E must downgrade to S, because the initiator is about to hold a second copy — and Figure 20.7 forbids E to coexist with anything but I.</li>
<li><strong>"WB victim" is a Ch.5 idea, not a coherence idea.</strong> Making room for an incoming line may require evicting a dirty one; that is write-back policy, and it happens here before any coherence question is settled.</li>
<li><strong>Read the red dashed arrows as the bus.</strong> Every one of them is a bus transaction: an address+command going out, or a status signal coming back. Count them and you have counted the coherence cost of one read miss.</li>
</ul>
<p class="meo">💡 One sentence for the exam: <strong>a read miss ends in E if nobody answers, and in S if anybody answers</strong> — and if the answerer was in M, it must write back first.</p>`,
        `<p class="y-chinh">🎯 Câu chuyện đọc trượt của slide 22 vẽ thành <strong>HAI giản đồ luồng chạy song song</strong>: bên trái màu xanh là <em>Initiator</em> (cache vừa trượt), bên phải màu hồng là <em>Participant</em> (mọi cache đang snoop), và các mũi tên đứt màu đỏ là tín hiệu qua lại giữa hai bên.</p>
<p class="nhan">📐 Đi theo cột TRÁI, đúng như hình vẽ:</p>
<table>
<tr><th>Bước (Initiator)</th><th>Xảy ra gì</th></tr>
<tr><td><strong>CPU Read</strong> → <strong>Hit?</strong></td><td>Nhánh <em>hit</em> (trạng thái M, E, S) đi thẳng tới <strong>To CPU</strong> — chính là ca đọc trúng miễn phí của slide 23</td></tr>
<tr><td>Nhánh <em>miss</em> (trạng thái I)</td><td><strong>Signal RM</strong> (read miss) lên bus — mũi tên đỏ mang nó sang Participant</td></tr>
<tr><td><strong>WB victim</strong></td><td>Nếu dòng bị đuổi ra để lấy chỗ đang bẩn thì phải ghi trả nó trước</td></tr>
<tr><td><strong>await signal</strong></td><td>Bên khởi xướng <em>ĐỨNG CHỜ</em> ở một vạch đồng bộ cho tới khi các cache snoop trả lời</td></tr>
<tr><td><strong>Signal?</strong></td><td><em>null</em> → <strong>Set E</strong> · <em>S</em> → <strong>Set S</strong> · <em>M</em> → <strong>await WB</strong>, rồi Set S</td></tr>
<tr><td><strong>Load target line</strong> → <strong>To CPU</strong></td><td>Từ dữ liệu cuối cùng cũng được trả về</td></tr>
</table>
<p class="nhan">📐 Và cột PHẢI, bên Participant:</p>
<table>
<tr><th>Trạng thái của nó khi snoop thấy RM</th><th>Nó làm gì</th><th>Trạng thái sau đó</th></tr>
<tr><td><strong>M</strong></td><td><strong>Signal M</strong>, rồi <strong>WB modified line</strong> (ghi trả dòng đã sửa về bộ nhớ)</td><td><strong>Set S</strong></td></tr>
<tr><td><strong>E hoặc S</strong></td><td><strong>Signal S</strong> — không cần ghi trả, bộ nhớ vốn đã đúng</td><td><strong>Set S</strong></td></tr>
<tr><td><strong>I</strong></td><td><strong>Signal null</strong> — nó chẳng giữ gì nên chẳng có gì để nói</td><td>vẫn I (đi thẳng tới <strong>Done</strong>)</td></tr>
</table>
<ul>
<li><strong>Hai cái vạch đồng bộ mới là điểm mấu chốt của cả hình.</strong> "await signal" và "await WB" là những lần <em>ĐỨNG CHỜ</em>: bộ xử lý đang đọc bị đóng băng cho tới khi các cache khác lên tiếng và, ở ca M, cho tới khi dòng bẩn thực sự về tới bộ nhớ. Đồng bộ cache KHÔNG miễn phí — nó được đo bằng số chu kỳ đứng chờ.</li>
<li><strong>Để ý nhánh E, và nó rẻ thế nào.</strong> Mọi cache snoop đều trả lời "null" ⇒ không ai giữ khối này ⇒ Set E. Không ghi trả, không hạ cấp. So với slide 25: chính cái E đó làm cho lần GHI kế tiếp vào dòng này thành miễn phí.</li>
<li><strong>Để ý E và S cho cùng một câu trả lời.</strong> Một participant đang ở E buộc phải hạ xuống S, vì bên khởi xướng sắp giữ bản sao thứ hai — mà Figure 20.7 cấm E tồn tại cùng bất cứ thứ gì ngoài I.</li>
<li><strong>"WB victim" là chuyện của Ch.5, không phải chuyện đồng bộ.</strong> Dọn chỗ cho dòng sắp về có thể phải đuổi một dòng bẩn ra; đó là chính sách ghi trả, và nó xảy ra ở đây TRƯỚC khi mọi câu hỏi về đồng bộ được giải quyết.</li>
<li><strong>Đọc các mũi tên đứt đỏ như chính cái bus.</strong> Mỗi cái là một giao dịch bus: một địa chỉ+lệnh đi ra, hoặc một tín hiệu trạng thái vọng về. Đếm chúng là bạn đã đếm được chi phí đồng bộ của một lần đọc trượt.</li>
</ul>
<p class="meo">💡 Một câu để đi thi: <strong>đọc trượt kết thúc ở E nếu KHÔNG ai trả lời, và ở S nếu CÓ ai trả lời</strong> — và nếu người trả lời đang ở M thì nó phải ghi trả trước.</p>`],

      [27, 'Figure 20.9 — Initiator Writes to Writeback Cache',
        `<p class="y-chinh">🎯 The same two-column drawing, now for a <strong>write</strong>. Two things change versus Figure 20.8, and both matter: the miss signal is <strong>WM</strong> (write miss, i.e. RWITM), and every participant ends at <strong>Set I</strong> — nobody is allowed to survive a write.</p>
<p class="nhan">📐 The Initiator column, as drawn:</p>
<table>
<tr><th>Step</th><th>What happens</th></tr>
<tr><td><strong>CPU Write</strong> → <strong>Hit?</strong></td><td><em>hit</em> (M, E, S) → <strong>Signal WH</strong> (write hit) → <strong>Write to line</strong> → <strong>Set M</strong> → Done</td></tr>
<tr><td><em>miss</em> (I)</td><td><strong>Signal WM</strong> onto the bus (this is the RWITM of slide 24)</td></tr>
<tr><td><strong>WB victim</strong> → <strong>await signal</strong></td><td>Evict/write back the victim line, then stall for the snoopers' answer</td></tr>
<tr><td><strong>Signal?</strong></td><td><em>null</em> → <strong>Load target line</strong> · <em>M</em> → <strong>await WB</strong> first, then load</td></tr>
<tr><td><strong>Write to line</strong> → <strong>Set M</strong></td><td>Both paths converge here — the line is Modified from the first instant</td></tr>
</table>
<p class="nhan">📐 The Participant column — note how much simpler it is than Figure 20.8:</p>
<table>
<tr><th>Its state when it snoops</th><th>What it does</th><th>Final state</th></tr>
<tr><td><strong>M</strong></td><td><strong>Signal M</strong>, then <strong>WB modified line</strong></td><td><strong>Set I</strong></td></tr>
<tr><td><strong>E, S or I</strong></td><td><strong>Signal null</strong> — no write-back needed</td><td><strong>Set I</strong></td></tr>
</table>
<ul>
<li><strong>The one difference that explains everything: every branch ends at I.</strong> In Figure 20.8 (read) participants ended at S, keeping their copies. Here they are all invalidated. That is write-invalidate (slide 16) in picture form, and it is the mechanism that enforces "only one writer at a time".</li>
<li><strong>Look at the Signal WH branch on the far left.</strong> The figure sends a write <em>hit</em> out onto the bus too. That is the Shared case of slide 25: the hit is a hit, but ownership still has to be won by invalidating the other sharers. On E and M that signal carries no work for anyone.</li>
<li><strong>"await WB" is still there, and it is the expensive path.</strong> If some other cache held the line Modified, the initiator cannot load until that cache's dirty data has reached memory — two memory transfers for one store instruction, exactly as slide 24 warned.</li>
<li><strong>Why the participant's E, S and I collapse into one branch.</strong> None of them holds data that memory lacks, so nothing needs to be saved; all three can simply be thrown away. Only M carries unique data and therefore work.</li>
<li><strong>The engineering lesson, carried into Ch.21.</strong> Reads scale (many caches can share a line forever); writes serialise (each write empties every other cache). A parallel program's scalability is decided by its <em>write</em> sharing, not its read sharing — which is exactly why read-mostly data structures parallelise so well.</li>
</ul>
<p class="pitfall">⚠️ Do not confuse Figure 20.8's "Set S" with Figure 20.9's "Set I" in the participant column. Getting them backwards is the most common mistake when an exam asks you to trace a sequence of reads and writes across two caches.</p>`,
        `<p class="y-chinh">🎯 Vẫn bức vẽ hai cột đó, nhưng cho thao tác <strong>GHI</strong>. Có hai thứ đổi so với Figure 20.8, và cả hai đều quan trọng: tín hiệu trượt là <strong>WM</strong> (write miss, tức RWITM), và mọi participant đều kết thúc ở <strong>Set I</strong> — không ai được phép sống sót qua một lần ghi.</p>
<p class="nhan">📐 Cột Initiator, đúng như hình:</p>
<table>
<tr><th>Bước</th><th>Xảy ra gì</th></tr>
<tr><td><strong>CPU Write</strong> → <strong>Hit?</strong></td><td><em>hit</em> (M, E, S) → <strong>Signal WH</strong> (write hit) → <strong>Write to line</strong> → <strong>Set M</strong> → Done</td></tr>
<tr><td><em>miss</em> (I)</td><td><strong>Signal WM</strong> lên bus (đây chính là RWITM của slide 24)</td></tr>
<tr><td><strong>WB victim</strong> → <strong>await signal</strong></td><td>Đuổi/ghi trả dòng nạn nhân, rồi đứng chờ câu trả lời của các cache snoop</td></tr>
<tr><td><strong>Signal?</strong></td><td><em>null</em> → <strong>Load target line</strong> · <em>M</em> → phải <strong>await WB</strong> trước, rồi mới nạp</td></tr>
<tr><td><strong>Write to line</strong> → <strong>Set M</strong></td><td>Hai đường gặp nhau ở đây — dòng ở Modified ngay từ giây đầu</td></tr>
</table>
<p class="nhan">📐 Cột Participant — để ý nó đơn giản hơn hẳn Figure 20.8:</p>
<table>
<tr><th>Trạng thái của nó khi snoop</th><th>Nó làm gì</th><th>Trạng thái cuối</th></tr>
<tr><td><strong>M</strong></td><td><strong>Signal M</strong>, rồi <strong>WB modified line</strong></td><td><strong>Set I</strong></td></tr>
<tr><td><strong>E, S hoặc I</strong></td><td><strong>Signal null</strong> — không cần ghi trả</td><td><strong>Set I</strong></td></tr>
</table>
<ul>
<li><strong>Khác biệt duy nhất mà giải thích được tất cả: mọi nhánh đều kết ở I.</strong> Ở Figure 20.8 (đọc), các participant kết ở S và giữ lại bản sao. Ở đây chúng bị vô hiệu hoá sạch. Đó là write-invalidate (slide 16) vẽ thành hình, và là cơ chế thực thi luật "mỗi lúc chỉ một người ghi".</li>
<li><strong>Nhìn nhánh Signal WH ở góc trái.</strong> Hình này phát cả lần ghi <em>TRÚNG</em> lên bus. Đó là ca Shared của slide 25: trúng thì vẫn là trúng, nhưng quyền sở hữu vẫn phải giành bằng cách vô hiệu hoá những người đang chia sẻ. Với E và M thì tín hiệu ấy chẳng bắt ai làm gì.</li>
<li><strong>"await WB" vẫn còn đó, và đó là đường đắt.</strong> Nếu một cache khác đang giữ dòng ở Modified thì bên khởi xướng không nạp được cho tới khi dữ liệu bẩn của cache kia về tới bộ nhớ — HAI lần chuyển bộ nhớ cho MỘT lệnh store, đúng như slide 24 cảnh báo.</li>
<li><strong>Vì sao E, S, I của participant gộp chung một nhánh.</strong> Không cái nào giữ dữ liệu mà bộ nhớ chính đang thiếu, nên chẳng có gì phải cứu; cả ba cứ việc vứt đi. Chỉ M mang dữ liệu độc nhất nên mới sinh việc.</li>
<li><strong>Bài học kỹ thuật, mang sang Ch.21.</strong> ĐỌC thì mở rộng được (nhiều cache chia sẻ một dòng mãi mãi); GHI thì bắt xếp hàng (mỗi lần ghi làm rỗng mọi cache khác). Khả năng mở rộng của một chương trình song song do chuyện chia sẻ <em>GHI</em> quyết định, không phải chia sẻ đọc — chính vì thế các cấu trúc dữ liệu "đọc là chính" song song hoá cực tốt.</li>
</ul>
<p class="pitfall">⚠️ Đừng lẫn "Set S" của Figure 20.8 với "Set I" của Figure 20.9 ở cột participant. Nhớ ngược hai cái này là lỗi phổ biến nhất khi đề bắt truy vết một chuỗi đọc/ghi qua hai cache.</p>`],

      [28, 'Multithreading and Chip Multiprocessors',
        `<p class="y-chinh">🎯 The chapter turns a corner here. Processor performance is measured by the rate at which it executes instructions, and the slide gives the equation that governs everything after it: <strong>MIPS rate = f × IPC</strong>, where <em>f</em> is the clock frequency in MHz and <em>IPC</em> the average instructions per cycle.</p>
<ul>
<li><strong>Two knobs, and only two.</strong> Increase performance by increasing the <em>clock frequency</em>, or by increasing the <em>instructions that complete during a cycle</em>. Everything in Chapters 14–21 is one of these two moves; nothing else exists.</li>
<li><strong>The first knob has jammed.</strong> Frequency scaling stalled in the mid-2000s at the power wall — power grows roughly with f × V<sup>2</sup>, and the heat becomes unremovable. That is why this chapter exists at all: the industry was forced onto the IPC side of the equation, and then onto replicating whole processors.</li>
<li><strong>The second knob has a ceiling too.</strong> Chapter 14 (ILP and superscalar) showed that a single instruction stream simply does not contain enough independent instructions to fill four, six or eight issue slots every cycle. Data dependencies, branches and cache misses leave slots empty. That measured emptiness is the opening for this slide's answer.</li>
<li><strong>The answer: multithreading.</strong> The slide says it "allows for a high degree of instruction-level parallelism <em>without increasing circuit complexity or power consumption</em>". The instruction stream is divided into several smaller streams, known as <strong>threads</strong>, that can be executed in parallel.</li>
<li><strong>Read that middle clause as the whole economic argument.</strong> Widening a superscalar core is quadratically expensive (bypass networks, register ports, wakeup logic). Adding a second thread context is cheap — mostly a second register file and program counter. Instructions from an <em>independent</em> thread are guaranteed not to depend on mine, so they fill my empty slots for free.</li>
</ul>
<p class="nhan">📐 Worked example on MIPS = f × IPC. A 3 GHz core sustaining IPC = 1,2 executes 3 000 × 1,2 = <strong>3 600 MIPS</strong>. Doubling frequency to 6 GHz is thermally impossible; raising IPC from 1,2 to 2,4 by widening the core needs roughly 4× the issue logic; but running two threads that each sustain IPC 1,2 on shared hardware can reach an aggregate near 2,0–2,4 with a few percent more silicon.</p>
<p class="pitfall">⚠️ MIPS as an absolute number is a poor metric (Ch.2 hammered this: different ISAs need different instruction counts for the same job). It is used here only <em>relatively</em> — to show which of the two factors you can still move.</p>`,
        `<p class="y-chinh">🎯 Chương rẽ hướng ở đây. Hiệu năng bộ xử lý đo bằng TỐC ĐỘ THỰC THI LỆNH, và slide đưa ra phương trình chi phối mọi thứ phía sau: <strong>MIPS rate = f × IPC</strong>, với <em>f</em> là tần số xung nhịp tính bằng MHz và <em>IPC</em> là số lệnh trung bình trên mỗi chu kỳ.</p>
<ul>
<li><strong>Hai cái núm, và chỉ hai.</strong> Tăng hiệu năng bằng cách tăng <em>tần số xung nhịp</em>, hoặc tăng <em>số lệnh hoàn thành trong một chu kỳ</em>. Mọi thứ trong các chương 14–21 đều là một trong hai nước đi này; không có nước thứ ba.</li>
<li><strong>Núm thứ nhất đã KẸT.</strong> Việc tăng tần số khựng lại từ giữa những năm 2000 ở bức tường công suất — công suất tăng xấp xỉ theo f × V<sup>2</sup>, và nhiệt trở nên không tài nào thoát nổi. Đó là lý do chương này tồn tại: cả ngành bị đẩy sang vế IPC của phương trình, rồi sang chuyện nhân bản nguyên cả bộ xử lý.</li>
<li><strong>Núm thứ hai cũng có trần.</strong> Chương 14 (ILP và superscalar) đã cho thấy MỘT luồng lệnh đơn giản là không chứa đủ lệnh độc lập để lấp đầy bốn, sáu hay tám khe phát mỗi chu kỳ. Phụ thuộc dữ liệu, rẽ nhánh và trượt cache để lại các khe TRỐNG. Chính chỗ trống đo được đó là cửa vào cho câu trả lời của slide này.</li>
<li><strong>Câu trả lời: ĐA LUỒNG.</strong> Slide nói nó "cho phép đạt mức song song mức lệnh cao <em>mà không làm tăng độ phức tạp mạch hay mức tiêu thụ điện</em>". Luồng lệnh được chia thành nhiều luồng nhỏ hơn, gọi là <strong>thread</strong>, và chúng chạy song song được.</li>
<li><strong>Đọc mệnh đề giữa đó như toàn bộ lập luận kinh tế.</strong> Nới rộng một lõi superscalar thì đắt theo bình phương (mạng chuyển tiếp, cổng tệp thanh ghi, logic đánh thức). Thêm một ngữ cảnh luồng thứ hai thì rẻ — chủ yếu là thêm một tệp thanh ghi và một bộ đếm chương trình. Lệnh từ một luồng <em>ĐỘC LẬP</em> thì chắc chắn không phụ thuộc lệnh của tôi, nên chúng lấp chỗ trống của tôi gần như miễn phí.</li>
</ul>
<p class="nhan">📐 Ví dụ giải tay với MIPS = f × IPC. Một lõi 3 GHz giữ được IPC = 1,2 thì thực thi 3 000 × 1,2 = <strong>3 600 MIPS</strong>. Nhân đôi tần số lên 6 GHz là bất khả về nhiệt; nâng IPC từ 1,2 lên 2,4 bằng cách nới lõi thì cần cỡ 4× lượng logic phát lệnh; nhưng cho HAI luồng, mỗi luồng giữ IPC 1,2, chạy trên cùng phần cứng thì tổng cộng có thể đạt gần 2,0–2,4 chỉ với vài phần trăm silic thêm vào.</p>
<p class="pitfall">⚠️ MIPS dùng làm con số TUYỆT ĐỐI là một thước đo tồi (Ch.2 đã nện chuyện này: ISA khác nhau cần số lệnh khác nhau cho cùng một việc). Ở đây nó chỉ được dùng một cách <em>TƯƠNG ĐỐI</em> — để chỉ ra trong hai thừa số thì bạn còn lay chuyển được cái nào.</p>`],

      [29, 'Definitions of Threads and Processes',
        `<p class="y-chinh">🎯 Before the hardware, the vocabulary — and the slide opens with the warning that matters most: <strong>a "thread" in a multithreaded processor may or may not be the same as a software thread</strong> in a multiprogrammed operating system. Same word, two layers.</p>
<table>
<tr><th>Term (as defined on the slide)</th><th>Definition</th></tr>
<tr><td><strong>Process</strong></td><td>An instance of a program running on a computer. Two key characteristics: <strong>resource ownership</strong> and <strong>scheduling/execution</strong></td></tr>
<tr><td><strong>Thread</strong></td><td>A dispatchable unit of work within a process. Includes the processor context (which includes the program counter and stack pointer) and a data area for the stack. Executes sequentially and is interruptible, so the processor can turn to another thread</td></tr>
<tr><td><strong>Process switch</strong></td><td>Switches the processor from one process to another by saving all the process control data, registers and other information for the first and replacing them with the process information for the second</td></tr>
<tr><td><strong>Thread switch</strong></td><td>Switching processor control between threads <em>within the same process</em>. Typically <strong>less costly</strong> than a process switch</td></tr>
</table>
<ul>
<li><strong>The whole distinction in one line:</strong> a thread is concerned with <em>scheduling and execution</em>, whereas a process is concerned with <em>both scheduling/execution and resource ownership</em>. Ownership (address space, open files, I/O) belongs to the process; the ability to be dispatched belongs to the thread.</li>
<li><strong>Why a thread switch is cheaper.</strong> Threads in one process share the address space, so the page tables, the TLB and (largely) the cache contents stay valid. A process switch invalidates all three. This is the same argument CEA201 made in Ch.9 (OS support) about the cost of context switching.</li>
<li><strong>Why the opening warning is not pedantry.</strong> A hardware thread is a <em>register set plus a program counter</em> that the pipeline can draw instructions from. The OS's thread is a software abstraction. In SMT they are usually mapped one-to-one, but a processor can also multiplex hardware threads over streams the compiler extracted from one sequential program — implicit multithreading, slide 30, where no OS thread exists at all.</li>
<li><strong>What the hardware must replicate per thread.</strong> Exactly what the slide calls the processor context: program counter, register file, stack pointer, and the status flags. Everything else — ALUs, caches, the branch predictor, the TLB — is <em>shared</em>. That asymmetry is why SMT is cheap and why SMT threads interfere with each other.</li>
<li><strong>Link forward.</strong> Slide 31's four approaches differ only in <em>when</em> the processor switches between these contexts: every cycle (interleaved), on a stalling event (blocked), or never — issuing from several at once (SMT).</li>
</ul>
<p class="pitfall">⚠️ Exam trap: "a thread has its own address space". <strong>No</strong> — that is a process. Threads within a process share the address space, which is precisely why thread switching is cheap and why data races are possible.</p>`,
        `<p class="y-chinh">🎯 Trước phần cứng là phần TỪ VỰNG — và slide mở đầu bằng đúng cảnh báo quan trọng nhất: <strong>"thread" trong bộ xử lý đa luồng CÓ THỂ giống mà cũng có thể KHÁC thread phần mềm</strong> trong một hệ điều hành đa chương. Cùng một chữ, hai tầng khác nhau.</p>
<table>
<tr><th>Thuật ngữ (theo đúng slide)</th><th>Định nghĩa</th></tr>
<tr><td><strong>Process (tiến trình)</strong></td><td>Một thể hiện của chương trình đang chạy trên máy tính. Hai đặc trưng cốt lõi: <strong>sở hữu tài nguyên</strong> và <strong>lập lịch/thực thi</strong></td></tr>
<tr><td><strong>Thread (luồng)</strong></td><td>Đơn vị công việc có thể ĐIỀU PHỐI được bên trong một tiến trình. Gồm ngữ cảnh bộ xử lý (trong đó có bộ đếm chương trình và con trỏ ngăn xếp) cùng một vùng dữ liệu cho ngăn xếp. Thực thi TUẦN TỰ và NGẮT ĐƯỢC, nhờ vậy bộ xử lý có thể quay sang luồng khác</td></tr>
<tr><td><strong>Process switch (chuyển tiến trình)</strong></td><td>Chuyển bộ xử lý từ tiến trình này sang tiến trình khác bằng cách lưu toàn bộ dữ liệu điều khiển tiến trình, thanh ghi và các thông tin khác của cái thứ nhất rồi thay bằng thông tin của cái thứ hai</td></tr>
<tr><td><strong>Thread switch (chuyển luồng)</strong></td><td>Chuyển quyền điều khiển bộ xử lý giữa các luồng <em>TRONG CÙNG MỘT tiến trình</em>. Thường <strong>RẺ HƠN</strong> chuyển tiến trình</td></tr>
</table>
<ul>
<li><strong>Toàn bộ sự phân biệt gói trong một câu:</strong> luồng lo chuyện <em>lập lịch và thực thi</em>, còn tiến trình lo <em>cả lập lịch/thực thi LẪN sở hữu tài nguyên</em>. Quyền sở hữu (không gian địa chỉ, file đang mở, vào/ra) thuộc về tiến trình; khả năng được điều phối thuộc về luồng.</li>
<li><strong>Vì sao chuyển luồng rẻ hơn.</strong> Các luồng trong một tiến trình DÙNG CHUNG không gian địa chỉ, nên bảng trang, TLB và (phần lớn) nội dung cache vẫn còn giá trị. Chuyển tiến trình thì làm hỏng cả ba. Đây đúng là lập luận CEA201 đã nêu ở Ch.9 (hỗ trợ của hệ điều hành) về giá của chuyển ngữ cảnh.</li>
<li><strong>Vì sao cảnh báo mở đầu không phải chuyện chẻ sợi tóc.</strong> Một luồng PHẦN CỨNG là <em>một bộ thanh ghi cộng một bộ đếm chương trình</em> mà đường ống có thể rút lệnh ra. Luồng của hệ điều hành là một trừu tượng phần mềm. Trong SMT hai thứ thường ánh xạ một-một, nhưng bộ xử lý cũng có thể ghép nhiều luồng phần cứng lên những dòng lệnh mà trình biên dịch tách ra từ MỘT chương trình tuần tự — đa luồng NGẦM, slide 30, nơi chẳng có luồng hệ điều hành nào tồn tại.</li>
<li><strong>Phần cứng phải NHÂN BẢN những gì cho mỗi luồng.</strong> Đúng cái mà slide gọi là ngữ cảnh bộ xử lý: bộ đếm chương trình, tệp thanh ghi, con trỏ ngăn xếp, cờ trạng thái. Mọi thứ còn lại — ALU, cache, bộ dự đoán rẽ nhánh, TLB — đều DÙNG CHUNG. Chính sự bất đối xứng đó làm SMT rẻ, và cũng làm các luồng SMT giẫm chân nhau.</li>
<li><strong>Nối về phía trước.</strong> Bốn cách tiếp cận ở slide 31 chỉ khác nhau ở chỗ bộ xử lý chuyển giữa các ngữ cảnh này <em>KHI NÀO</em>: mỗi chu kỳ (xen kẽ), khi gặp sự kiện gây trễ (theo khối), hoặc không bao giờ — mà phát lệnh từ nhiều ngữ cảnh CÙNG LÚC (SMT).</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: "luồng có không gian địa chỉ riêng". <strong>KHÔNG</strong> — đó là tiến trình. Các luồng trong một tiến trình DÙNG CHUNG không gian địa chỉ, và chính vì thế chuyển luồng mới rẻ, mà tranh chấp dữ liệu (data race) mới xảy ra được.</p>`],

      [30, 'Implicit and Explicit Multithreading',
        `<p class="y-chinh">🎯 A two-way split of the whole idea. <strong>Explicit</strong> multithreading concurrently executes instructions from different <em>explicit</em> threads; <strong>implicit</strong> multithreading is concurrent execution of multiple threads extracted from a <em>single sequential program</em>. And the slide states the score: <strong>all commercial processors and most experimental ones use explicit multithreading</strong>.</p>
<table>
<tr><th></th><th>Explicit multithreading</th><th>Implicit multithreading</th></tr>
<tr><td><strong>Where the threads come from</strong></td><td>Different explicit threads — written by the programmer or created by the OS</td><td>Extracted from a single sequential program</td></tr>
<tr><td><strong>Who defines them</strong></td><td>Programmer / OS</td><td>Statically by the <strong>compiler</strong>, or dynamically by the <strong>hardware</strong></td></tr>
<tr><td><strong>How they are executed</strong></td><td>Interleave instructions from different threads on shared pipelines, or execute in parallel on parallel pipelines</td><td>Speculatively, on threads the machine hopes are independent</td></tr>
<tr><td><strong>Commercial status</strong></td><td><strong>All</strong> commercial processors</td><td>Experimental — "most experimental ones" also use explicit</td></tr>
</table>
<ul>
<li><strong>Read the slide's two execution styles carefully, they are different hardware.</strong> "Interleave instructions from different threads on <em>shared</em> pipelines" is SMT and interleaved/blocked multithreading — one pipeline, several contexts. "Parallel execution on <em>parallel</em> pipelines" is chip multiprocessing — several pipelines, one context each.</li>
<li><strong>Why implicit multithreading stayed in the lab.</strong> Slicing a sequential program into threads that <em>might</em> be independent requires speculation, and speculation requires a rollback mechanism for when the guess is wrong. The hardware cost of recovering from a mis-speculated <em>thread</em> (not just a branch) has never paid for itself.</li>
<li><strong>Why explicit multithreading won.</strong> It puts the burden on software, which is where the knowledge is: the programmer knows the two loops are independent; the hardware would have to prove it. Chapter 21 makes the same argument about multicore — the hardware is easy, the parallel programming is the hard part.</li>
<li><strong>A useful mental test.</strong> If you have to <em>write</em> the threads (pthreads, Java threads, OpenMP, a web server's request handlers), it is explicit. If your single-threaded C program magically ran on four contexts, that would be implicit — and it does not happen on any processor you can buy.</li>
<li><strong>Connect to Ch.14.</strong> Implicit multithreading is the logical extension of superscalar's search for ILP: when a window of tens of instructions runs dry, widen the window to whole thread-sized chunks. The fact that industry refused this path and took explicit threads instead is the clearest evidence that ILP really had hit a wall.</li>
</ul>
<p class="meo">💡 Mnemonic: <strong>explicit = the threads already exist</strong>; <strong>implicit = somebody has to invent them for you</strong>, and inventing them is speculation.</p>`,
        `<p class="y-chinh">🎯 Một phép chia đôi cho toàn bộ ý tưởng. Đa luồng <strong>TƯỜNG MINH (explicit)</strong> là thực thi đồng thời các lệnh đến từ những luồng <em>tường minh</em> khác nhau; đa luồng <strong>NGẦM (implicit)</strong> là thực thi đồng thời nhiều luồng được TRÍCH RA từ <em>một chương trình tuần tự duy nhất</em>. Và slide công bố tỉ số: <strong>mọi bộ xử lý thương mại và hầu hết bộ xử lý thử nghiệm đều dùng đa luồng TƯỜNG MINH</strong>.</p>
<table>
<tr><th></th><th>Đa luồng tường minh</th><th>Đa luồng ngầm</th></tr>
<tr><td><strong>Luồng từ đâu ra</strong></td><td>Từ những luồng tường minh khác nhau — người lập trình viết ra hoặc hệ điều hành tạo ra</td><td>Trích ra từ MỘT chương trình tuần tự</td></tr>
<tr><td><strong>Ai định nghĩa chúng</strong></td><td>Người lập trình / hệ điều hành</td><td>TĨNH bởi <strong>trình biên dịch</strong>, hoặc ĐỘNG bởi <strong>phần cứng</strong></td></tr>
<tr><td><strong>Thực thi ra sao</strong></td><td>Xen kẽ lệnh của các luồng khác nhau trên đường ống DÙNG CHUNG, hoặc chạy song song trên các đường ống song song</td><td>Suy đoán, trên những luồng mà máy HY VỌNG là độc lập</td></tr>
<tr><td><strong>Tình trạng thương mại</strong></td><td><strong>TẤT CẢ</strong> bộ xử lý thương mại</td><td>Thử nghiệm — "hầu hết bộ thử nghiệm" cũng dùng tường minh</td></tr>
</table>
<ul>
<li><strong>Đọc kỹ hai kiểu thực thi slide nêu, chúng là hai loại phần cứng khác nhau.</strong> "Xen kẽ lệnh của các luồng khác nhau trên đường ống <em>DÙNG CHUNG</em>" là SMT và đa luồng xen kẽ/theo khối — MỘT đường ống, nhiều ngữ cảnh. "Chạy song song trên các đường ống <em>SONG SONG</em>" là chip multiprocessing — NHIỀU đường ống, mỗi cái một ngữ cảnh.</li>
<li><strong>Vì sao đa luồng ngầm nằm mãi trong phòng thí nghiệm.</strong> Cắt một chương trình tuần tự thành các luồng <em>CÓ THỂ</em> độc lập đòi hỏi SUY ĐOÁN, mà suy đoán thì đòi hỏi cơ chế quay lui khi đoán sai. Giá phần cứng để khôi phục sau một lần đoán sai cả một <em>LUỒNG</em> (chứ không phải chỉ một rẽ nhánh) chưa bao giờ bù nổi.</li>
<li><strong>Vì sao đa luồng tường minh thắng.</strong> Nó đẩy gánh nặng sang phần mềm, tức sang nơi có TRI THỨC: người lập trình BIẾT hai vòng lặp đó độc lập; phần cứng thì phải CHỨNG MINH điều đó. Chương 21 lặp lại đúng lập luận này cho đa lõi — phần cứng thì dễ, lập trình song song mới là phần khó.</li>
<li><strong>Một phép thử trong đầu rất tiện.</strong> Nếu bạn phải TỰ VIẾT ra các luồng (pthreads, thread của Java, OpenMP, các bộ xử lý yêu cầu của máy chủ web) thì đó là tường minh. Nếu chương trình C một luồng của bạn tự nhiên chạy được trên bốn ngữ cảnh thì đó là ngầm — và chuyện đó không xảy ra trên bất kỳ bộ xử lý nào bạn mua được.</li>
<li><strong>Nối về Ch.14.</strong> Đa luồng ngầm là phần mở rộng logic của việc superscalar đi săn ILP: khi một cửa sổ vài chục lệnh đã cạn, thì nới cửa sổ ra thành từng mảng to bằng cả luồng. Việc cả ngành TỪ CHỐI con đường này để đi theo luồng tường minh là bằng chứng rõ nhất rằng ILP thật sự đã đụng tường.</li>
</ul>
<p class="meo">💡 Mẹo nhớ: <strong>tường minh = luồng VỐN ĐÃ CÓ SẴN</strong>; <strong>ngầm = phải có ai đó BỊA RA luồng cho bạn</strong>, mà bịa ra thì là suy đoán.</p>`],

      [31, 'Approaches to Explicit Multithreading',
        `<p class="y-chinh">🎯 The four approaches, and this is the slide the exam draws its comparison question from. Three of them share one pipeline; the fourth replicates the whole processor.</p>
<table>
<tr><th>Approach</th><th>The slide's words</th><th>When does it switch thread?</th><th>Extra hardware</th></tr>
<tr><td><strong>Interleaved</strong> (fine-grained)</td><td>Processor deals with two or more thread contexts at a time, <strong>switching thread at each clock cycle</strong>. If a thread is blocked it is skipped</td><td>Every single cycle, unconditionally</td><td>N register sets + a fast context selector</td></tr>
<tr><td><strong>Blocked</strong> (coarse-grained)</td><td>Thread executed <strong>until an event causes delay</strong>. Effective on in-order processors. <strong>Avoids pipeline stall</strong></td><td>Only on a long-latency event (typically a cache miss)</td><td>N register sets + switch-on-event logic</td></tr>
<tr><td><strong>Simultaneous (SMT)</strong></td><td>Instructions are <strong>simultaneously issued from multiple threads</strong> to the execution units of a superscalar processor</td><td>Never — several threads issue in the <em>same</em> cycle</td><td>N register sets + thread tags throughout the pipeline</td></tr>
<tr><td><strong>Chip multiprocessing</strong></td><td>The <strong>processor is replicated on a single chip</strong>; each processor handles separate threads. Advantage: the available logic area on a chip is used effectively</td><td>Not applicable — the threads never share a pipeline</td><td>A whole extra core</td></tr>
</table>
<ul>
<li><strong>Fine-grained versus coarse-grained in one sentence.</strong> Fine-grained switches on a <em>clock</em>; coarse-grained switches on an <em>event</em>. Fine-grained therefore hides even short stalls but slows every individual thread; coarse-grained leaves each thread at full speed and only reacts when something goes badly wrong.</li>
<li><strong>Why the slide says coarse-grained is "effective on in-order processors".</strong> An in-order pipeline has no way to work around a cache miss — it simply freezes. Switching to another thread is the only recovery available, and a cache miss is long enough (hundreds of cycles, Ch.4) to pay for the switch. An out-of-order core already hides short stalls itself, so it gains less.</li>
<li><strong>Why fine-grained "skips a blocked thread".</strong> Rotating blindly through contexts would waste slots on threads that cannot issue. Skipping is what makes the round-robin worth doing.</li>
<li><strong>SMT is the only one of the three that increases per-cycle issue width usage.</strong> Interleaved and blocked still issue from <em>one</em> thread in any given cycle — they fill cycles, not slots. SMT fills the empty <em>slots inside a cycle</em>. That distinction is the single most examined point of this chapter, and slide 32 draws it.</li>
</ul>
<p class="nhan">📐 The scalar case (one issue slot per cycle), drawn as Figure 20.10(a)(b)(c) does — each cell is which thread issues in that cycle, a dash is a wasted cycle:</p>
<table>
<tr><th>Cycle</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>Used</th></tr>
<tr><td>(a) single-threaded scalar</td><td>A</td><td>A</td><td>–</td><td>–</td><td>–</td><td>A</td><td>A</td><td>–</td><td>4/8 = 50%</td></tr>
<tr><td>(b) interleaved MT scalar</td><td>A</td><td>B</td><td>C</td><td>D</td><td>A</td><td>B</td><td>C</td><td>D</td><td><strong>8/8 = 100%</strong></td></tr>
<tr><td>(c) blocked MT scalar</td><td>A</td><td>A</td><td>A</td><td>A</td><td>B</td><td>B</td><td>B</td><td>B</td><td><strong>8/8 = 100%</strong></td></tr>
</table>
<p class="dap-an">✅ On a <em>scalar</em> processor both interleaved and blocked multithreading can reach full utilisation, because there is only ever one slot to fill and some thread can usually fill it. The interesting failure only appears when the processor is <strong>superscalar</strong> and there are four slots per cycle — that is slide 32.</p>
<p class="nhan">📐 <strong>Measured on the machine this lesson was written on</strong> (macOS, Apple M1 Max): <code>sysctl hw.physicalcpu hw.logicalcpu</code> returns <strong>10 and 10</strong>. Physical = logical means this chip has <strong>no SMT at all</strong> — 10 real cores, 10 threads. Splitting further: <code>hw.perflevel0.physicalcpu</code> = 8 performance cores, <code>hw.perflevel1.physicalcpu</code> = 2 efficiency cores. On a machine with SMT the numbers differ (a 6-core Intel laptop reports 6 and 12).</p>
<p class="pitfall">⚠️ Trap: "chip multiprocessing is a kind of multithreading". The slide lists it alongside the other three, but it is a different animal — it adds <em>execution resources</em>, while the other three share existing ones. That is why <code>hw.logicalcpu &gt; hw.physicalcpu</code> means SMT, while a bigger <code>hw.physicalcpu</code> means more cores.</p>`,
        `<p class="y-chinh">🎯 Bốn cách tiếp cận, và đây là slide mà đề thi rút câu so sánh ra. Ba cái dùng chung MỘT đường ống; cái thứ tư nhân bản nguyên cả bộ xử lý.</p>
<table>
<tr><th>Cách tiếp cận</th><th>Đúng chữ của slide</th><th>Chuyển luồng KHI NÀO?</th><th>Phần cứng thêm</th></tr>
<tr><td><strong>Xen kẽ (Interleaved)</strong> — fine-grained</td><td>Bộ xử lý xử lý hai hoặc nhiều ngữ cảnh luồng cùng lúc, <strong>chuyển luồng ở MỖI chu kỳ xung nhịp</strong>. Luồng nào đang bị chặn thì BỎ QUA</td><td>Mỗi chu kỳ, vô điều kiện</td><td>N bộ thanh ghi + bộ chọn ngữ cảnh nhanh</td></tr>
<tr><td><strong>Theo khối (Blocked)</strong> — coarse-grained</td><td>Luồng chạy <strong>cho tới khi một sự kiện gây trễ</strong>. Hiệu quả trên bộ xử lý thực thi đúng thứ tự. <strong>Tránh được nghẽn đường ống</strong></td><td>Chỉ khi gặp sự kiện trễ dài (thường là trượt cache)</td><td>N bộ thanh ghi + logic chuyển-khi-có-sự-kiện</td></tr>
<tr><td><strong>Đồng thời (SMT)</strong></td><td>Lệnh được <strong>phát ĐỒNG THỜI từ NHIỀU luồng</strong> tới các đơn vị thực thi của một bộ xử lý superscalar</td><td>Không bao giờ chuyển — nhiều luồng cùng phát trong <em>CÙNG MỘT</em> chu kỳ</td><td>N bộ thanh ghi + nhãn luồng suốt đường ống</td></tr>
<tr><td><strong>Chip multiprocessing</strong></td><td><strong>Bộ xử lý được nhân bản trên cùng một chip</strong>; mỗi bộ xử lý lo các luồng riêng. Lợi thế: dùng hiệu quả diện tích logic có sẵn trên chip</td><td>Không áp dụng — các luồng không hề dùng chung đường ống</td><td>Nguyên một lõi nữa</td></tr>
</table>
<ul>
<li><strong>Fine-grained so với coarse-grained trong một câu.</strong> Fine-grained chuyển theo <em>XUNG NHỊP</em>; coarse-grained chuyển theo <em>SỰ KIỆN</em>. Vì thế fine-grained giấu được cả những lần nghẽn ngắn nhưng làm chậm TỪNG luồng riêng lẻ; coarse-grained để mỗi luồng chạy hết tốc và chỉ phản ứng khi có chuyện lớn.</li>
<li><strong>Vì sao slide nói coarse-grained "hiệu quả trên bộ xử lý in-order".</strong> Đường ống thực thi đúng thứ tự KHÔNG có cách nào lách quanh một lần trượt cache — nó đơn giản là đóng băng. Chuyển sang luồng khác là cách cứu duy nhất, và một lần trượt cache đủ dài (hàng trăm chu kỳ, Ch.4) để bù cho cái giá của lần chuyển. Lõi out-of-order vốn đã tự giấu được nghẽn ngắn nên lợi ít hơn.</li>
<li><strong>Vì sao fine-grained "bỏ qua luồng đang bị chặn".</strong> Quay vòng một cách mù quáng sẽ phí khe vào những luồng không phát được lệnh. Chính việc BỎ QUA mới làm cho vòng quay tròn đó bõ công.</li>
<li><strong>SMT là cái DUY NHẤT trong ba cái làm tăng mức dùng bề rộng phát lệnh TRONG một chu kỳ.</strong> Xen kẽ và theo khối vẫn chỉ phát từ <em>MỘT</em> luồng trong bất kỳ chu kỳ nào — chúng lấp CHU KỲ, không lấp KHE. SMT lấp những <em>KHE TRỐNG BÊN TRONG một chu kỳ</em>. Phân biệt đó là điểm bị hỏi nhiều nhất của cả chương, và slide 32 vẽ ra nó.</li>
</ul>
<p class="nhan">📐 Ca vô hướng (scalar — mỗi chu kỳ một khe phát), vẽ như Figure 20.10(a)(b)(c) — mỗi ô là luồng nào phát lệnh ở chu kỳ đó, dấu gạch là một chu kỳ bị phí:</p>
<table>
<tr><th>Chu kỳ</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>Dùng được</th></tr>
<tr><td>(a) vô hướng, một luồng</td><td>A</td><td>A</td><td>–</td><td>–</td><td>–</td><td>A</td><td>A</td><td>–</td><td>4/8 = 50%</td></tr>
<tr><td>(b) đa luồng XEN KẼ, vô hướng</td><td>A</td><td>B</td><td>C</td><td>D</td><td>A</td><td>B</td><td>C</td><td>D</td><td><strong>8/8 = 100%</strong></td></tr>
<tr><td>(c) đa luồng THEO KHỐI, vô hướng</td><td>A</td><td>A</td><td>A</td><td>A</td><td>B</td><td>B</td><td>B</td><td>B</td><td><strong>8/8 = 100%</strong></td></tr>
</table>
<p class="dap-an">✅ Trên bộ xử lý <em>VÔ HƯỚNG</em>, cả đa luồng xen kẽ lẫn theo khối đều có thể đạt mức dùng tối đa, vì mỗi lúc chỉ có MỘT khe cần lấp và thường luôn có luồng nào đó lấp được. Chỗ HỎNG thú vị chỉ lộ ra khi bộ xử lý là <strong>SUPERSCALAR</strong> và mỗi chu kỳ có bốn khe — đó là slide 32.</p>
<p class="nhan">📐 <strong>ĐO THẬT trên chính máy viết bài này</strong> (macOS, Apple M1 Max): <code>sysctl hw.physicalcpu hw.logicalcpu</code> trả về <strong>10 và 10</strong>. Vật lý = logic nghĩa là con chip này <strong>KHÔNG có SMT</strong> — 10 lõi thật, 10 luồng. Chia nhỏ hơn: <code>hw.perflevel0.physicalcpu</code> = 8 lõi hiệu năng, <code>hw.perflevel1.physicalcpu</code> = 2 lõi tiết kiệm điện. Trên máy CÓ SMT thì hai số lệch nhau (laptop Intel 6 nhân báo 6 và 12).</p>
<p class="pitfall">⚠️ Bẫy: "chip multiprocessing là một kiểu đa luồng". Slide có xếp nó cạnh ba cái kia, nhưng nó là giống khác hẳn — nó THÊM <em>tài nguyên thực thi</em>, còn ba cái kia DÙNG CHUNG tài nguyên có sẵn. Vì thế <code>hw.logicalcpu &gt; hw.physicalcpu</code> nghĩa là có SMT, còn <code>hw.physicalcpu</code> lớn nghĩa là nhiều lõi.</p>`],

      [32, 'Figure 20.10 — Approaches to Executing Multiple Threads',
        `<p class="y-chinh">🎯 Eleven small issue-slot diagrams in one figure — the picture the whole multithreading section builds to. In every panel a <strong>column is an issue slot, a row is a clock cycle</strong> (time runs downward), a letter is the thread that occupies that slot, and a <strong>blank grey cell is a wasted issue opportunity</strong>. Panels: (a) single-threaded scalar · (b) interleaved MT scalar · (c) blocked MT scalar · (d) superscalar · (e) interleaved MT superscalar · (f) blocked MT superscalar · (g) VLIW · (h) interleaved MT VLIW · (i) blocked MT VLIW · (j) <strong>simultaneous multithreading (SMT)</strong> · (k) <strong>chip multiprocessor (multicore)</strong>.</p>
<p class="nhan">📐 The superscalar case worked out — <strong>4 issue slots per cycle, 8 cycles = 32 slots total</strong>. This is the arithmetic the figure implies but does not print:</p>
<table>
<tr><th>Cycle</th><th colspan="4">(d) superscalar, ONE thread</th><th colspan="4">(e) interleaved MT superscalar</th></tr>
<tr><td>1</td><td>A</td><td>A</td><td>–</td><td>–</td><td>A</td><td>A</td><td>–</td><td>–</td></tr>
<tr><td>2</td><td>A</td><td>–</td><td>–</td><td>–</td><td>B</td><td>B</td><td>B</td><td>–</td></tr>
<tr><td>3</td><td>A</td><td>A</td><td>A</td><td>A</td><td>C</td><td>–</td><td>–</td><td>–</td></tr>
<tr><td>4</td><td>–</td><td>–</td><td>–</td><td>–</td><td>D</td><td>D</td><td>D</td><td>D</td></tr>
<tr><td>5</td><td>A</td><td>A</td><td>–</td><td>A</td><td>A</td><td>A</td><td>–</td><td>–</td></tr>
<tr><td>6</td><td>A</td><td>–</td><td>–</td><td>–</td><td>B</td><td>–</td><td>–</td><td>–</td></tr>
<tr><td>7</td><td>A</td><td>A</td><td>–</td><td>–</td><td>C</td><td>C</td><td>–</td><td>–</td></tr>
<tr><td>8</td><td>–</td><td>–</td><td>–</td><td>–</td><td>D</td><td>D</td><td>D</td><td>–</td></tr>
<tr><td><strong>Slots used</strong></td><td colspan="4"><strong>13 / 32 = 40,6%</strong></td><td colspan="4"><strong>18 / 32 = 56,2%</strong></td></tr>
</table>
<table>
<tr><th>Cycle</th><th colspan="4">(f) blocked MT superscalar</th><th colspan="4">(j) SMT</th></tr>
<tr><td>1</td><td>A</td><td>A</td><td>–</td><td>–</td><td>A</td><td>A</td><td>B</td><td>B</td></tr>
<tr><td>2</td><td>A</td><td>A</td><td>–</td><td>–</td><td>A</td><td>B</td><td>B</td><td>C</td></tr>
<tr><td>3</td><td>A</td><td>–</td><td>–</td><td>–</td><td>A</td><td>A</td><td>A</td><td>A</td></tr>
<tr><td>4</td><td>B</td><td>B</td><td>B</td><td>–</td><td>D</td><td>D</td><td>C</td><td>C</td></tr>
<tr><td>5</td><td>B</td><td>–</td><td>–</td><td>–</td><td>A</td><td>A</td><td>B</td><td>D</td></tr>
<tr><td>6</td><td>B</td><td>–</td><td>–</td><td>–</td><td>B</td><td>C</td><td>C</td><td>–</td></tr>
<tr><td>7</td><td>C</td><td>C</td><td>–</td><td>–</td><td>A</td><td>A</td><td>B</td><td>B</td></tr>
<tr><td>8</td><td>C</td><td>–</td><td>–</td><td>–</td><td>D</td><td>D</td><td>–</td><td>–</td></tr>
<tr><td><strong>Slots used</strong></td><td colspan="4"><strong>13 / 32 = 40,6%</strong></td><td colspan="4"><strong>29 / 32 = 90,6%</strong></td></tr>
</table>
<p class="dap-an">✅ Answer, and it is the whole message of the figure: on a superscalar machine, interleaved and blocked multithreading raise utilisation only from <strong>40,6% to 56,2% / 40,6%</strong>, because in any one cycle they still issue from a <em>single</em> thread and that thread still has limited ILP. <strong>SMT reaches 90,6%</strong> because it draws from several threads <em>in the same cycle</em> and can therefore fill the holes <em>across</em> a row, not just down a column.</p>
<ul>
<li><strong>Why SMT does not double performance.</strong> It only fills slots that were <em>already there and empty</em>. Its ceiling is the issue width — 4 instructions per cycle in this example, no matter how many threads you add. Going from 40,6% to 90,6% is about 2,2× here, but a real core with 70% utilisation has only 30% to recover, and Intel's measured figure for Hyper-Threading is typically <strong>15–30%</strong>, not 100%.</li>
<li><strong>How it differs from real multicore — panel (k).</strong> A chip multiprocessor <em>adds</em> issue slots: two cores of 4 slots give 8 slots per cycle, so the ceiling doubles. SMT redistributes 4 slots; multicore buys 8. That is why an SMT "thread" is not a core, and why a 4-core/8-thread CPU is nowhere near an 8-core CPU.</li>
<li><strong>Why SMT is still worth it.</strong> The extra slots cost almost nothing: a second register file and some thread tags, roughly 5% more die area for 15–30% more throughput. Multicore costs 100% more die area per core. Per square millimetre, SMT is the better deal — which is why big server chips do <em>both</em>.</li>
<li><strong>The VLIW panels (g)(h)(i) in one line.</strong> VLIW packs independent operations into one long instruction at <em>compile</em> time; where the compiler cannot find enough, it writes <strong>N</strong> (no-operation) — those are the letter-N cells in the figure. Multithreading a VLIW replaces some of those Ns with another thread's work, which is the same medicine for the same disease.</li>
<li><strong>Where the empty slots come from in the first place.</strong> Ch.14: true data dependencies, branch mispredictions, and long-latency cache misses (Ch.4). A thread cannot fill a slot it has no independent instruction for — but another thread always can, because it is independent by construction.</li>
</ul>
<p class="pitfall">⚠️ The numbers in the two tables above are <strong>worked in the spirit of the figure, not copied off it</strong> — Stallings prints the grids without totals. The <em>shape</em> of the conclusion (single &lt; interleaved &lt; SMT, SMT nearly full) is exactly what the figure shows; treat the percentages as a teaching model, not as a measurement of any real processor.</p>`,
        `<p class="y-chinh">🎯 Mười một sơ đồ khe phát lệnh nhỏ trong một hình — bức tranh mà cả phần đa luồng hướng tới. Trong mọi ô: <strong>một CỘT là một khe phát lệnh, một HÀNG là một chu kỳ xung nhịp</strong> (thời gian chảy xuống dưới), chữ cái là luồng chiếm khe đó, và <strong>ô xám trống là một cơ hội phát lệnh bị PHÍ</strong>. Các ô: (a) vô hướng một luồng · (b) đa luồng xen kẽ vô hướng · (c) đa luồng theo khối vô hướng · (d) superscalar · (e) xen kẽ superscalar · (f) theo khối superscalar · (g) VLIW · (h) xen kẽ VLIW · (i) theo khối VLIW · (j) <strong>đa luồng ĐỒNG THỜI (SMT)</strong> · (k) <strong>chip multiprocessor (đa lõi)</strong>.</p>
<p class="nhan">📐 Giải tay ca superscalar — <strong>4 khe phát mỗi chu kỳ, 8 chu kỳ = 32 khe</strong>. Đây là phép tính mà hình ngụ ý nhưng không in ra:</p>
<table>
<tr><th>Chu kỳ</th><th colspan="4">(d) superscalar, MỘT luồng</th><th colspan="4">(e) đa luồng XEN KẼ superscalar</th></tr>
<tr><td>1</td><td>A</td><td>A</td><td>–</td><td>–</td><td>A</td><td>A</td><td>–</td><td>–</td></tr>
<tr><td>2</td><td>A</td><td>–</td><td>–</td><td>–</td><td>B</td><td>B</td><td>B</td><td>–</td></tr>
<tr><td>3</td><td>A</td><td>A</td><td>A</td><td>A</td><td>C</td><td>–</td><td>–</td><td>–</td></tr>
<tr><td>4</td><td>–</td><td>–</td><td>–</td><td>–</td><td>D</td><td>D</td><td>D</td><td>D</td></tr>
<tr><td>5</td><td>A</td><td>A</td><td>–</td><td>A</td><td>A</td><td>A</td><td>–</td><td>–</td></tr>
<tr><td>6</td><td>A</td><td>–</td><td>–</td><td>–</td><td>B</td><td>–</td><td>–</td><td>–</td></tr>
<tr><td>7</td><td>A</td><td>A</td><td>–</td><td>–</td><td>C</td><td>C</td><td>–</td><td>–</td></tr>
<tr><td>8</td><td>–</td><td>–</td><td>–</td><td>–</td><td>D</td><td>D</td><td>D</td><td>–</td></tr>
<tr><td><strong>Khe dùng được</strong></td><td colspan="4"><strong>13 / 32 = 40,6%</strong></td><td colspan="4"><strong>18 / 32 = 56,2%</strong></td></tr>
</table>
<table>
<tr><th>Chu kỳ</th><th colspan="4">(f) đa luồng THEO KHỐI superscalar</th><th colspan="4">(j) SMT</th></tr>
<tr><td>1</td><td>A</td><td>A</td><td>–</td><td>–</td><td>A</td><td>A</td><td>B</td><td>B</td></tr>
<tr><td>2</td><td>A</td><td>A</td><td>–</td><td>–</td><td>A</td><td>B</td><td>B</td><td>C</td></tr>
<tr><td>3</td><td>A</td><td>–</td><td>–</td><td>–</td><td>A</td><td>A</td><td>A</td><td>A</td></tr>
<tr><td>4</td><td>B</td><td>B</td><td>B</td><td>–</td><td>D</td><td>D</td><td>C</td><td>C</td></tr>
<tr><td>5</td><td>B</td><td>–</td><td>–</td><td>–</td><td>A</td><td>A</td><td>B</td><td>D</td></tr>
<tr><td>6</td><td>B</td><td>–</td><td>–</td><td>–</td><td>B</td><td>C</td><td>C</td><td>–</td></tr>
<tr><td>7</td><td>C</td><td>C</td><td>–</td><td>–</td><td>A</td><td>A</td><td>B</td><td>B</td></tr>
<tr><td>8</td><td>C</td><td>–</td><td>–</td><td>–</td><td>D</td><td>D</td><td>–</td><td>–</td></tr>
<tr><td><strong>Khe dùng được</strong></td><td colspan="4"><strong>13 / 32 = 40,6%</strong></td><td colspan="4"><strong>29 / 32 = 90,6%</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án, và đó là toàn bộ thông điệp của hình: trên máy superscalar, đa luồng xen kẽ và theo khối chỉ nâng mức dùng từ <strong>40,6% lên 56,2% / 40,6%</strong>, vì trong bất kỳ chu kỳ nào chúng vẫn chỉ phát từ <em>MỘT</em> luồng, mà luồng đó vẫn có ILP hữu hạn. <strong>SMT đạt 90,6%</strong> vì nó rút lệnh từ nhiều luồng <em>TRONG CÙNG MỘT chu kỳ</em>, nên lấp được lỗ theo chiều NGANG của hàng chứ không chỉ theo chiều dọc của cột.</p>
<ul>
<li><strong>Vì sao SMT KHÔNG nhân đôi hiệu năng.</strong> Nó chỉ lấp những khe <em>VỐN ĐÃ CÓ SẴN VÀ ĐANG TRỐNG</em>. Trần của nó là bề rộng phát lệnh — 4 lệnh mỗi chu kỳ trong ví dụ này, thêm bao nhiêu luồng cũng vậy. Đi từ 40,6% lên 90,6% ở đây là cỡ 2,2 lần, nhưng một lõi thật đã dùng 70% thì chỉ còn 30% để vớt, và con số Intel đo cho Hyper-Threading thường là <strong>15–30%</strong>, không phải 100%.</li>
<li><strong>Nó khác đa lõi THẬT ở chỗ nào — ô (k).</strong> Chip multiprocessor <em>THÊM</em> khe phát: hai lõi mỗi lõi 4 khe thành 8 khe mỗi chu kỳ, tức TRẦN nhân đôi. SMT phân phối lại 4 khe; đa lõi MUA thêm 8 khe. Vì thế một "thread" của SMT KHÔNG phải một lõi, và CPU 4 nhân/8 luồng còn xa mới bằng CPU 8 nhân.</li>
<li><strong>Vậy vì sao vẫn đáng làm SMT.</strong> Mấy khe thêm đó gần như không tốn gì: một tệp thanh ghi thứ hai và ít nhãn luồng, cỡ 5% diện tích đế để lấy 15–30% thông lượng. Đa lõi thì tốn 100% diện tích cho mỗi lõi. Tính trên mỗi mi-li-mét vuông, SMT lời hơn — nên chip máy chủ cỡ lớn làm <em>CẢ HAI</em>.</li>
<li><strong>Ba ô VLIW (g)(h)(i) gói trong một dòng.</strong> VLIW nhồi các phép toán độc lập vào một lệnh dài ngay lúc <em>BIÊN DỊCH</em>; chỗ nào trình biên dịch không tìm đủ thì nó ghi <strong>N</strong> (no-operation) — đó chính là những ô chữ N trên hình. Cho VLIW chạy đa luồng là thay một số chữ N đó bằng việc của luồng khác, cùng một liều thuốc cho cùng một căn bệnh.</li>
<li><strong>Mấy khe trống đó ở đâu ra.</strong> Ch.14: phụ thuộc dữ liệu thật, dự đoán rẽ nhánh sai, và trượt cache độ trễ dài (Ch.4). Một luồng không thể lấp khe mà nó không có lệnh độc lập nào để bỏ vào — nhưng luồng KHÁC thì luôn lấp được, vì nó độc lập ngay từ trong thiết kế.</li>
</ul>
<p class="pitfall">⚠️ Các con số trong hai bảng trên là <strong>tôi giải tay THEO TINH THẦN của hình, không chép từ hình</strong> — Stallings in các lưới ô mà không in tổng. <em>HÌNH DẠNG</em> của kết luận (một luồng &lt; xen kẽ &lt; SMT, SMT gần đầy) đúng y như hình cho thấy; hãy coi các phần trăm là mô hình để học, đừng coi là số đo của một bộ xử lý có thật.</p>`],

      [33, 'Clusters',
        `<p class="y-chinh">🎯 The third parallel architecture, and the slide defines it precisely: <strong>a group of interconnected WHOLE computers working together as a unified computing resource that can create the illusion of being one machine</strong>. "Whole computer" means a system that can run on its own, apart from the cluster. Each computer in a cluster is called a <strong>node</strong>.</p>
<ul>
<li><strong>The slide's framing: an alternative to SMP</strong> for providing high performance and high availability, "particularly attractive for server applications". Read the two goals separately — performance (more work per second) and availability (the service survives a dead node) are different problems, and clusters are the first architecture in this chapter that addresses the second at all.</li>
<li><strong>Four benefits, exactly as listed.</strong> <em>Absolute scalability</em> — a cluster can be far larger than any single machine (hundreds or thousands of nodes). <em>Incremental scalability</em> — grow it a node at a time, without replacing what you have. <em>High availability</em> — each node is a standalone computer, so losing one loses a fraction of the service, not all of it. <em>Superior price/performance</em> — built from commodity boxes, so a cluster reaches a given capacity far more cheaply than a large single machine.</li>
<li><strong>"Whole computer" is the load-bearing phrase.</strong> It is what separates a cluster from an SMP or a NUMA machine: each node has its own processors, its own <em>private</em> main memory, its own OS instance and its own copy of the application. Nothing is shared by hardware; everything crosses a network.</li>
</ul>
<p class="nhan">📐 <strong>The comparison table the exam asks for</strong> — SMP versus Cluster versus NUMA, the single most examinable content of this chapter:</p>
<table>
<tr><th></th><th>SMP</th><th>Cluster</th><th>NUMA (CC-NUMA)</th></tr>
<tr><td><strong>Main memory</strong></td><td><strong>Shared</strong>, one physical memory, uniform access time for every processor</td><td><strong>Private</strong> to each node — no globally shared memory at all</td><td><strong>Shared address space</strong>, but physically distributed: each node owns a slice</td></tr>
<tr><td><strong>How processors exchange data</strong></td><td>Ordinary loads and stores to shared addresses; coherence in hardware (MESI)</td><td><strong>Message passing</strong> over a high-speed network link (MPI, sockets)</td><td>Ordinary loads and stores; remote lines fetched over the interconnect, coherence via <strong>directory</strong></td></tr>
<tr><td><strong>Memory access time</strong></td><td>Uniform (UMA)</td><td>Local memory only; a remote datum is a network message, microseconds</td><td><strong>Non-uniform</strong> — local fast, remote several times slower</td></tr>
<tr><td><strong>Practical scale</strong></td><td>Bus traffic limits it to roughly <strong>16–64 processors</strong> (slide 37)</td><td><strong>Hundreds to thousands</strong> of nodes</td><td><strong>Tens to a few hundred</strong> processors — between the other two</td></tr>
<tr><td><strong>Operating system</strong></td><td><strong>ONE</strong> OS, managing all processors</td><td><strong>ONE PER NODE</strong> — N independent OS instances plus cluster middleware</td><td><strong>ONE</strong> OS over the whole machine (but it must be NUMA-aware)</td></tr>
<tr><td><strong>Cost</strong></td><td>Moderate; a single large box</td><td><strong>Lowest per unit of capacity</strong> — commodity hardware, commodity network</td><td>Highest — custom interconnect and directory hardware</td></tr>
<tr><td><strong>Availability</strong></td><td>One machine; a processor failure may take the system down</td><td><strong>Best</strong> — a dead node removes a fraction of capacity</td><td>A concern (slide 39 says so explicitly)</td></tr>
<tr><td><strong>Programming model</strong></td><td>Threads + shared variables + locks</td><td>Explicit messages; the program must be <em>rewritten</em></td><td>Threads + shared variables, but performance demands data placement</td></tr>
<tr><td><strong>Use it when</strong></td><td>A modest number of processors, one machine, unmodified shared-memory software</td><td>Web/database servers, HPC, anything needing scale or uptime beyond one box</td><td>Large shared-memory workloads that must stay one machine and outgrow SMP</td></tr>
</table>
<p class="meo">💡 One sentence each: <strong>SMP shares memory and cannot grow; a cluster grows without limit and shares nothing; NUMA shares memory and grows, but not all memory is equally near.</strong></p>
<p class="pitfall">⚠️ Trap: "a cluster is a multiprocessor". In Flynn's taxonomy (slide 2) both are MIMD, but a cluster is a <em>distributed-memory</em> MIMD while SMP and NUMA are <em>shared-memory</em> MIMD. The distinction that decides every exam question is: <strong>can node A read node B's memory with a load instruction?</strong> SMP yes, NUMA yes (slowly), cluster no.</p>`,
        `<p class="y-chinh">🎯 Kiến trúc song song thứ ba, và slide định nghĩa rất chặt: <strong>một nhóm MÁY TÍNH HOÀN CHỈNH nối với nhau, làm việc cùng nhau như MỘT tài nguyên tính toán thống nhất, tạo ra ảo giác rằng đó là một cỗ máy duy nhất</strong>. "Máy tính hoàn chỉnh" nghĩa là một hệ thống tự chạy được một mình, tách khỏi cụm. Mỗi máy tính trong cụm gọi là một <strong>nút (node)</strong>.</p>
<ul>
<li><strong>Khung nhìn của slide: một LỰA CHỌN THAY THẾ cho SMP</strong> để đạt hiệu năng cao và tính sẵn sàng cao, "đặc biệt hấp dẫn cho ứng dụng máy chủ". Hãy đọc hai mục tiêu đó TÁCH RỜI — hiệu năng (làm được nhiều việc hơn mỗi giây) và tính sẵn sàng (dịch vụ sống sót khi một nút chết) là hai bài toán khác nhau, và cụm máy là kiến trúc đầu tiên trong chương này đụng tới bài toán thứ hai.</li>
<li><strong>Bốn lợi ích, đúng như slide liệt kê.</strong> <em>Absolute scalability</em> (mở rộng tuyệt đối) — cụm có thể lớn hơn hẳn bất kỳ cỗ máy đơn lẻ nào (hàng trăm, hàng nghìn nút). <em>Incremental scalability</em> (mở rộng dần) — lớn lên từng nút một, không phải thay cái đang có. <em>High availability</em> (sẵn sàng cao) — mỗi nút là một máy tính độc lập, nên mất một nút là mất một PHẦN dịch vụ, không phải mất hết. <em>Superior price/performance</em> (giá/hiệu năng vượt trội) — dựng từ máy phổ thông nên đạt một dung lượng cho trước rẻ hơn hẳn máy đơn lớn.</li>
<li><strong>Cụm từ "máy tính HOÀN CHỈNH" mới là chỗ chịu lực.</strong> Nó là thứ tách cụm máy khỏi SMP hay NUMA: mỗi nút có bộ xử lý riêng, bộ nhớ chính <em>RIÊNG TƯ</em> của nó, bản hệ điều hành riêng và bản ứng dụng riêng. Phần cứng không chia sẻ gì cả; mọi thứ phải đi qua MẠNG.</li>
</ul>
<p class="nhan">📐 <strong>Bảng so sánh mà đề thi hay hỏi nhất</strong> — SMP · Cluster · NUMA, nội dung dễ ra thi nhất của cả chương:</p>
<table>
<tr><th></th><th>SMP</th><th>Cluster (cụm máy)</th><th>NUMA (CC-NUMA)</th></tr>
<tr><td><strong>Bộ nhớ chính</strong></td><td><strong>DÙNG CHUNG</strong>, một bộ nhớ vật lý, thời gian truy cập như nhau với mọi bộ xử lý</td><td><strong>RIÊNG</strong> của từng nút — hoàn toàn không có bộ nhớ chung toàn cục</td><td><strong>Chung KHÔNG GIAN ĐỊA CHỈ</strong> nhưng phân tán về vật lý: mỗi nút sở hữu một phần</td></tr>
<tr><td><strong>Trao đổi dữ liệu bằng gì</strong></td><td>Lệnh load/store thông thường tới địa chỉ chung; đồng bộ bằng phần cứng (MESI)</td><td><strong>Truyền THÔNG ĐIỆP</strong> qua liên kết mạng tốc độ cao (MPI, socket)</td><td>Lệnh load/store thông thường; dòng ở xa được lấy qua interconnect, đồng bộ bằng <strong>directory</strong></td></tr>
<tr><td><strong>Thời gian truy cập bộ nhớ</strong></td><td>ĐỒNG NHẤT (UMA)</td><td>Chỉ có bộ nhớ cục bộ; dữ liệu ở xa là một thông điệp mạng, cỡ micro giây</td><td><strong>KHÔNG ĐỒNG NHẤT</strong> — gần thì nhanh, xa thì chậm gấp mấy lần</td></tr>
<tr><td><strong>Quy mô thực tế</strong></td><td>Lưu lượng bus giới hạn ở khoảng <strong>16–64 bộ xử lý</strong> (slide 37)</td><td><strong>Hàng trăm tới hàng nghìn</strong> nút</td><td><strong>Vài chục tới vài trăm</strong> bộ xử lý — nằm giữa hai cái kia</td></tr>
<tr><td><strong>Hệ điều hành</strong></td><td><strong>MỘT</strong> hệ, quản mọi bộ xử lý</td><td><strong>MỖI NÚT MỘT</strong> — N bản hệ điều hành độc lập cộng phần mềm trung gian của cụm</td><td><strong>MỘT</strong> hệ cho cả máy (nhưng phải "biết" NUMA)</td></tr>
<tr><td><strong>Giá</strong></td><td>Vừa phải; một thùng máy lớn</td><td><strong>Rẻ nhất trên mỗi đơn vị năng lực</strong> — phần cứng và mạng phổ thông</td><td>Đắt nhất — interconnect và phần cứng directory làm riêng</td></tr>
<tr><td><strong>Tính sẵn sàng</strong></td><td>Một cỗ máy; hỏng một bộ xử lý có thể sập cả hệ</td><td><strong>Tốt nhất</strong> — một nút chết chỉ mất một phần năng lực</td><td>Là một MỐI LO (slide 39 nói thẳng điều này)</td></tr>
<tr><td><strong>Mô hình lập trình</strong></td><td>Luồng + biến chung + khoá</td><td>Thông điệp tường minh; chương trình phải <em>VIẾT LẠI</em></td><td>Luồng + biến chung, nhưng muốn nhanh thì phải lo ĐẶT DỮ LIỆU ở đâu</td></tr>
<tr><td><strong>Dùng khi nào</strong></td><td>Số bộ xử lý vừa phải, một cỗ máy, phần mềm bộ nhớ chung không phải sửa</td><td>Máy chủ web/CSDL, tính toán hiệu năng cao, mọi thứ cần quy mô hoặc thời gian sống vượt quá một thùng máy</td><td>Tải bộ nhớ chung lớn, buộc phải nằm trong MỘT cỗ máy và đã vượt quá tầm SMP</td></tr>
</table>
<p class="meo">💡 Mỗi cái một câu: <strong>SMP dùng chung bộ nhớ nhưng không lớn lên được; cụm máy lớn lên vô hạn nhưng chẳng chung gì; NUMA vừa chung bộ nhớ vừa lớn lên được, nhưng không phải chỗ nhớ nào cũng gần như nhau.</strong></p>
<p class="pitfall">⚠️ Bẫy: "cụm máy là một hệ đa xử lý (multiprocessor)". Theo phân loại Flynn (slide 2) thì cả hai đều là MIMD, nhưng cụm máy là MIMD <em>BỘ NHỚ PHÂN TÁN</em>, còn SMP và NUMA là MIMD <em>BỘ NHỚ CHUNG</em>. Câu hỏi quyết định mọi bài thi là: <strong>nút A có đọc được bộ nhớ của nút B bằng một lệnh load không?</strong> SMP có, NUMA có (nhưng chậm), cụm máy KHÔNG.</p>`],

      [34, 'Figure 20.11 — Cluster Configurations',
        `<p class="y-chinh">🎯 Two cluster layouts drawn as boxes of <strong>P (processors), M (memory) and I/O</strong> joined by a bold <strong>high-speed message link</strong>. Panel (a) <em>standby server with no shared disk</em>: each node has its own disk, nothing in common but the link. Panel (b) <em>shared disk</em>: the same two nodes, plus a <strong>RAID</strong> array cabled to both, in addition to their own private disks.</p>
<ul>
<li><strong>Read the picture for what is NOT there.</strong> There is no shared memory box. Each node's M belongs to that node alone. The only thing crossing between nodes is a message link — which is exactly the definition on slide 33 and the row that separates clusters from NUMA in the table above.</li>
<li><strong>Panel (a), the cheapest cluster.</strong> Two whole computers, a link, and no shared storage. Data must be copied from primary to secondary over the link if the secondary is to be able to take over — which is the "Separate Servers" row of Table 20.2 (slide 35), with its high network overhead.</li>
<li><strong>Panel (b), and why RAID appears.</strong> Once several servers share one disk subsystem, that subsystem becomes the single point of failure the cluster was built to avoid. RAID restores redundancy at the disk level. Table 20.2 says exactly this: shared-disk methods "usually require disk mirroring or RAID technology".</li>
<li><strong>The link is the whole performance story.</strong> A load from local memory is ~100 ns; a message to another node is measured in microseconds even on a fast fabric. That is a factor of tens to thousands, which is why cluster programs are written to compute a lot per message — and why fine-grained sharing that works fine on an SMP collapses on a cluster.</li>
<li><strong>Connect to CSI106, Chapter 4 (networks).</strong> That "high-speed message link" is a real network: an interconnect with a topology, a protocol stack, latency and bandwidth. Everything CSI106 taught about latency, throughput and protocol overhead applies here directly — a cluster is a distributed system that happens to be in one room.</li>
</ul>
<p class="nhan">📐 <strong>How big is a cluster worth building? Amdahl's law from Ch.2</strong>, S(N) = 1 / (f + (1 − f)/N), where <em>f</em> is the serial fraction and N the number of nodes. Verified with <code>python3</code>:</p>
<table>
<tr><th>Nodes N</th><th>Speed-up, serial fraction f = 5%</th><th>Efficiency</th><th>Speed-up, f = 1%</th><th>Efficiency</th></tr>
<tr><td>8</td><td>5,93×</td><td>74,1%</td><td>7,48×</td><td>93,5%</td></tr>
<tr><td>16</td><td>9,14×</td><td>57,1%</td><td>13,91×</td><td>87,0%</td></tr>
<tr><td>64</td><td>15,42×</td><td>24,1%</td><td>39,26×</td><td>61,4%</td></tr>
<tr><td>256</td><td>18,62×</td><td>7,3%</td><td>72,11×</td><td>28,2%</td></tr>
<tr><td>∞</td><td><strong>20× (hard ceiling = 1/f)</strong></td><td>0%</td><td><strong>100× (hard ceiling = 1/f)</strong></td><td>0%</td></tr>
</table>
<p class="dap-an">✅ Answer: with a serial fraction of just <strong>5%</strong>, a 256-node cluster delivers <strong>18,6×</strong> — it can never beat <strong>20×</strong>, so 248 of the 256 nodes are producing almost nothing. At <strong>1%</strong> the ceiling rises to <strong>100×</strong> and 256 nodes reach 72,1×. Conclusion: a thousand-node cluster is only meaningful for problems that are <em>almost perfectly parallel</em> — which is exactly what web serving, rendering and most HPC kernels are, and exactly what a database with a global lock is not.</p>
<p class="nhan">📐 <strong>Measured, not asserted</strong> (Apple M1 Max, <code>cc -O2</code>, pthreads, summing a 2-billion-term Leibniz series split evenly across threads):</p>
<table>
<tr><th>Threads</th><th>Time</th><th>Speed-up</th><th>Efficiency</th></tr>
<tr><td>1</td><td>1,986 s</td><td>1,00×</td><td>100%</td></tr>
<tr><td>2</td><td>1,056 s</td><td>1,88×</td><td>94%</td></tr>
<tr><td>4</td><td>0,506 s</td><td>3,93×</td><td>98%</td></tr>
<tr><td>8</td><td>0,295 s</td><td>6,73×</td><td>84%</td></tr>
<tr><td>10 (= all cores)</td><td>0,287 s</td><td>6,92×</td><td><strong>69%</strong></td></tr>
<tr><td>16 (oversubscribed)</td><td>0,260 s</td><td>7,64×</td><td>—</td></tr>
</table>
<p class="dap-an">✅ The workload is embarrassingly parallel (no locks, no sharing) yet 10 cores gave only <strong>6,92×</strong>, not 10×. The reason is not Amdahl: this machine's 10 cores are <strong>8 performance + 2 efficiency cores</strong>, and the program handed every thread an equal chunk — so the 8 fast cores finished and waited for the 2 slow ones. Oversubscribing to 16 threads actually improved things (7,64×) because the extra chunks let fast cores pick up slack. <strong>Load balancing is a second ceiling, independent of Amdahl's, and it is the one that bites first on heterogeneous hardware.</strong></p>`,
        `<p class="y-chinh">🎯 Hai cách bố trí cụm máy vẽ thành các ô <strong>P (bộ xử lý), M (bộ nhớ) và I/O</strong> nối bằng một <strong>liên kết thông điệp tốc độ cao</strong> in đậm. Ô (a) <em>máy chủ dự phòng, không dùng chung đĩa</em>: mỗi nút có đĩa riêng, chẳng chung gì ngoài sợi liên kết. Ô (b) <em>dùng chung đĩa</em>: vẫn hai nút đó, cộng thêm một dàn <strong>RAID</strong> đấu dây vào CẢ HAI, bên cạnh đĩa riêng của từng nút.</p>
<ul>
<li><strong>Hãy đọc bức tranh bằng thứ KHÔNG có trong đó.</strong> Không có ô bộ nhớ dùng chung nào cả. Chữ M của mỗi nút thuộc riêng nút đó. Thứ duy nhất đi qua lại giữa các nút là một liên kết thông điệp — đúng định nghĩa ở slide 33 và đúng cái dòng tách cụm máy khỏi NUMA trong bảng phía trên.</li>
<li><strong>Ô (a), cụm máy rẻ nhất.</strong> Hai máy tính hoàn chỉnh, một sợi liên kết, không có kho lưu trữ chung. Muốn máy phụ tiếp quản được thì dữ liệu phải CHÉP từ máy chính sang qua sợi liên kết — chính là dòng "Separate Servers" của Table 20.2 (slide 35), với chi phí mạng cao của nó.</li>
<li><strong>Ô (b), và vì sao RAID xuất hiện.</strong> Khi nhiều máy chủ dùng chung một hệ đĩa thì hệ đĩa đó trở thành điểm hỏng đơn lẻ mà cụm máy sinh ra để tránh. RAID khôi phục lại tính dư thừa ở tầng đĩa. Table 20.2 nói đúng điều này: các phương pháp dùng chung đĩa "thường đòi hỏi soi gương đĩa hoặc công nghệ RAID".</li>
<li><strong>Sợi liên kết đó là toàn bộ câu chuyện hiệu năng.</strong> Một lệnh load vào bộ nhớ cục bộ tốn ~100 ns; một thông điệp sang nút khác đo bằng MICRO giây, kể cả trên mạng nhanh. Chênh hàng chục tới hàng nghìn lần, nên chương trình cho cụm máy phải viết sao cho mỗi thông điệp gánh thật nhiều tính toán — và vì thế kiểu chia sẻ mịn chạy ngon trên SMP sẽ sụp trên cụm máy.</li>
<li><strong>Nối sang CSI106, chương 4 (mạng).</strong> Cái "liên kết thông điệp tốc độ cao" đó là một MẠNG thật: có topo, có chồng giao thức, có độ trễ và băng thông. Mọi thứ CSI106 dạy về độ trễ, thông lượng và chi phí giao thức áp thẳng vào đây — cụm máy là một hệ phân tán, chỉ khác là nó nằm gọn trong một căn phòng.</li>
</ul>
<p class="nhan">📐 <strong>Dựng cụm to tới đâu thì còn bõ? Định luật Amdahl của Ch.2</strong>, S(N) = 1 / (f + (1 − f)/N), với <em>f</em> là phần TUẦN TỰ và N là số nút. Đã kiểm bằng <code>python3</code>:</p>
<table>
<tr><th>Số nút N</th><th>Tăng tốc khi phần tuần tự f = 5%</th><th>Hiệu suất</th><th>Tăng tốc khi f = 1%</th><th>Hiệu suất</th></tr>
<tr><td>8</td><td>5,93×</td><td>74,1%</td><td>7,48×</td><td>93,5%</td></tr>
<tr><td>16</td><td>9,14×</td><td>57,1%</td><td>13,91×</td><td>87,0%</td></tr>
<tr><td>64</td><td>15,42×</td><td>24,1%</td><td>39,26×</td><td>61,4%</td></tr>
<tr><td>256</td><td>18,62×</td><td>7,3%</td><td>72,11×</td><td>28,2%</td></tr>
<tr><td>∞</td><td><strong>20× (trần CỨNG = 1/f)</strong></td><td>0%</td><td><strong>100× (trần CỨNG = 1/f)</strong></td><td>0%</td></tr>
</table>
<p class="dap-an">✅ Đáp án: chỉ với phần tuần tự <strong>5%</strong>, một cụm 256 nút cho <strong>18,6×</strong> — và vĩnh viễn không vượt nổi <strong>20×</strong>, tức 248 trong 256 nút hầu như không sản xuất ra gì. Ở mức <strong>1%</strong>, trần nâng lên <strong>100×</strong> và 256 nút đạt 72,1×. Kết luận: cụm nghìn nút chỉ có nghĩa với bài toán <em>gần như song song hoàn toàn</em> — đúng là web, kết xuất đồ hoạ và phần lớn nhân tính toán HPC, và đúng KHÔNG PHẢI là một cơ sở dữ liệu có khoá toàn cục.</p>
<p class="nhan">📐 <strong>ĐO THẬT, không phán bừa</strong> (Apple M1 Max, <code>cc -O2</code>, pthreads, cộng chuỗi Leibniz 2 tỉ số hạng chia đều cho các luồng):</p>
<table>
<tr><th>Số luồng</th><th>Thời gian</th><th>Tăng tốc</th><th>Hiệu suất</th></tr>
<tr><td>1</td><td>1,986 s</td><td>1,00×</td><td>100%</td></tr>
<tr><td>2</td><td>1,056 s</td><td>1,88×</td><td>94%</td></tr>
<tr><td>4</td><td>0,506 s</td><td>3,93×</td><td>98%</td></tr>
<tr><td>8</td><td>0,295 s</td><td>6,73×</td><td>84%</td></tr>
<tr><td>10 (= hết số lõi)</td><td>0,287 s</td><td>6,92×</td><td><strong>69%</strong></td></tr>
<tr><td>16 (nhiều hơn số lõi)</td><td>0,260 s</td><td>7,64×</td><td>—</td></tr>
</table>
<p class="dap-an">✅ Bài toán này song song "đến mức xấu hổ" (không khoá, không chia sẻ) vậy mà 10 lõi chỉ cho <strong>6,92×</strong> chứ không phải 10×. Lý do KHÔNG phải Amdahl: 10 lõi của máy này là <strong>8 lõi hiệu năng + 2 lõi tiết kiệm điện</strong>, mà chương trình chia cho mỗi luồng một phần BẰNG NHAU — nên 8 lõi nhanh làm xong rồi ngồi chờ 2 lõi chậm. Cho chạy 16 luồng (nhiều hơn số lõi) lại còn nhanh hơn (7,64×) vì các mẩu việc dư cho phép lõi nhanh gánh đỡ. <strong>Cân tải là cái trần THỨ HAI, độc lập với trần Amdahl, và trên phần cứng không đồng nhất thì nó cắn trước.</strong></p>`],

      [35, 'Table 20.2 — Clustering Methods: Benefits and Limitations',
        `<p class="y-chinh">🎯 Five ways to build a cluster, ordered from cheapest-and-dumbest to most-capable, each with what you gain and what you pay. This table is a favourite source of "match the method to its limitation" exam questions.</p>
<table>
<tr><th>Clustering method</th><th>Description</th><th>Benefits</th><th>Limitations</th></tr>
<tr><td><strong>Passive Standby</strong></td><td>A secondary server takes over in case of primary server failure</td><td>Easy to implement</td><td>High cost, because the secondary server is unavailable for other processing tasks</td></tr>
<tr><td><strong>Active Secondary</strong></td><td>The secondary server is also used for processing tasks</td><td>Reduced cost, because secondary servers can be used for processing</td><td>Increased complexity</td></tr>
<tr><td><strong>Separate Servers</strong></td><td>Separate servers have their own disks. Data is continuously copied from primary to secondary server</td><td>High availability</td><td>High network and server overhead due to copying operations</td></tr>
<tr><td><strong>Servers Connected to Disks</strong></td><td>Servers are cabled to the same disks, but each server owns its disks. If one server fails, its disks are taken over by the other server</td><td>Reduced network and server overhead due to elimination of copying operations</td><td>Usually requires disk mirroring or RAID technology to compensate for risk of disk failure</td></tr>
<tr><td><strong>Servers Share Disks</strong></td><td>Multiple servers simultaneously share access to disks</td><td>Low network and server overhead. Reduced risk of downtime caused by disk failure</td><td>Requires lock manager software. Usually used with disk mirroring or RAID technology</td></tr>
</table>
<ul>
<li><strong>Read the table as one continuous trade-off, not five unrelated rows.</strong> Going down the table, <em>data moves less</em> (from copying everything over the network, to cabling, to genuine sharing) and therefore <em>overhead falls</em> — but <em>coordination gets harder</em> (from nothing, to disk takeover, to a full lock manager).</li>
<li><strong>The first two rows are about the SECONDARY's idleness, not about disks.</strong> Passive standby pays for a whole machine that does nothing; active secondary uses it, and immediately inherits the problem of keeping two active servers consistent. That is the "increased complexity" the table charges it.</li>
<li><strong>Why "Separate Servers" has high overhead.</strong> Continuous copying means every write travels twice: once to local disk, once across the network. Availability is bought with bandwidth. This is exactly panel (a) of Figure 20.11.</li>
<li><strong>Why a lock manager appears only in the last row.</strong> When several servers write the same blocks <em>at the same time</em>, hardware cannot arbitrate — it is the same coherence problem as MESI, but across a network where no bus exists to snoop. The answer is software: a distributed lock manager. This is why shared-disk clusters (Oracle RAC is the classic) are powerful and notoriously delicate.</li>
<li><strong>Connect to Ch.7 (external memory).</strong> "Disk mirroring" is RAID 1 and RAID in general is Ch.7 material. Notice that two <em>different</em> reliability mechanisms are stacked here: RAID protects against a dead <em>disk</em>, clustering protects against a dead <em>server</em>. Neither substitutes for the other.</li>
</ul>
<p class="pitfall">⚠️ The extracted text of this slide is <strong>broken in two places by the .pptx line-wrapping</strong>: "Servers Connected to<em>Disks</em>" (missing space) and "simul-taneously" (a hyphenated line break read as part of the word). These are rendering artefacts, not terminology. The method names are <em>Servers Connected to Disks</em> and the word is <em>simultaneously</em>.</p>`,
        `<p class="y-chinh">🎯 Năm cách dựng cụm máy, xếp từ rẻ-và-ngờ-nghệch nhất tới mạnh nhất, mỗi cách kèm cái được và cái phải trả. Bảng này là nguồn ưa thích của dạng đề "nối phương pháp với hạn chế của nó".</p>
<table>
<tr><th>Phương pháp gom cụm</th><th>Mô tả</th><th>Lợi ích</th><th>Hạn chế</th></tr>
<tr><td><strong>Passive Standby</strong> (dự phòng thụ động)</td><td>Một máy chủ phụ tiếp quản khi máy chủ chính hỏng</td><td>Dễ triển khai</td><td>Giá cao, vì máy chủ phụ không dùng được vào việc xử lý nào khác</td></tr>
<tr><td><strong>Active Secondary</strong> (máy phụ có làm việc)</td><td>Máy chủ phụ cũng được dùng để xử lý công việc</td><td>Giảm chi phí, vì máy phụ dùng được vào việc xử lý</td><td>Tăng độ phức tạp</td></tr>
<tr><td><strong>Separate Servers</strong> (máy chủ tách rời)</td><td>Các máy chủ tách rời có đĩa riêng. Dữ liệu được chép liên tục từ máy chính sang máy phụ</td><td>Tính sẵn sàng cao</td><td>Chi phí mạng và máy chủ cao do phải chép liên tục</td></tr>
<tr><td><strong>Servers Connected to Disks</strong> (máy chủ đấu vào cùng đĩa)</td><td>Các máy chủ đấu dây vào cùng những đĩa đó, nhưng mỗi máy SỞ HỮU đĩa của mình. Một máy hỏng thì đĩa của nó được máy kia tiếp quản</td><td>Giảm chi phí mạng và máy chủ vì bỏ được thao tác chép</td><td>Thường đòi hỏi soi gương đĩa hoặc công nghệ RAID để bù rủi ro hỏng đĩa</td></tr>
<tr><td><strong>Servers Share Disks</strong> (máy chủ dùng chung đĩa)</td><td>Nhiều máy chủ ĐỒNG THỜI dùng chung quyền truy cập các đĩa</td><td>Chi phí mạng và máy chủ thấp. Giảm rủi ro ngừng dịch vụ do hỏng đĩa</td><td>Cần phần mềm quản lý khoá (lock manager). Thường dùng kèm soi gương đĩa hoặc RAID</td></tr>
</table>
<ul>
<li><strong>Đọc bảng như MỘT chuỗi đánh đổi liên tục, đừng đọc thành năm dòng rời.</strong> Đi từ trên xuống, <em>dữ liệu phải di chuyển ít dần</em> (từ chép mọi thứ qua mạng, sang đấu dây, sang dùng chung thật sự) nên <em>chi phí phụ giảm dần</em> — nhưng <em>việc phối hợp khó dần</em> (từ không cần gì, sang tiếp quản đĩa, sang cả một bộ quản lý khoá).</li>
<li><strong>Hai dòng đầu nói về việc máy PHỤ có ngồi không hay không, chứ chưa phải chuyện đĩa.</strong> Dự phòng thụ động phải nuôi nguyên một cỗ máy chẳng làm gì; máy phụ chủ động thì dùng nó, và lập tức thừa hưởng bài toán giữ hai máy chủ đang chạy nhất quán với nhau. Đó là cái "tăng độ phức tạp" mà bảng tính vào.</li>
<li><strong>Vì sao "Separate Servers" tốn kém.</strong> Chép liên tục nghĩa là mỗi lần ghi phải đi hai lần: một lần xuống đĩa cục bộ, một lần qua mạng. Tính sẵn sàng được mua bằng băng thông. Đây đúng là ô (a) của Figure 20.11.</li>
<li><strong>Vì sao lock manager chỉ xuất hiện ở dòng cuối.</strong> Khi nhiều máy chủ ghi cùng những khối dữ liệu <em>CÙNG MỘT LÚC</em>, phần cứng không phân xử nổi — vẫn là bài toán đồng bộ kiểu MESI, nhưng qua một mạng nơi không có bus nào để snoop. Lời giải là PHẦN MỀM: một bộ quản lý khoá phân tán. Vì thế cụm dùng chung đĩa (điển hình là Oracle RAC) vừa mạnh vừa nổi tiếng là mong manh.</li>
<li><strong>Nối về Ch.7 (bộ nhớ ngoài).</strong> "Soi gương đĩa" chính là RAID 1, và RAID nói chung là nội dung Ch.7. Để ý ở đây có HAI cơ chế tin cậy KHÁC NHAU chồng lên nhau: RAID chống hỏng <em>ĐĨA</em>, gom cụm chống hỏng <em>MÁY CHỦ</em>. Cái này không thay được cái kia.</li>
</ul>
<p class="pitfall">⚠️ Bản trích chữ của slide này <strong>vỡ ở hai chỗ do cách xuống dòng của .pptx</strong>: "Servers Connected to<em>Disks</em>" (mất dấu cách) và "simul-taneously" (dấu gạch xuống dòng bị đọc thành một phần của từ). Đó là lỗi kết xuất, không phải thuật ngữ. Tên phương pháp là <em>Servers Connected to Disks</em> và từ đó là <em>simultaneously</em>.</p>`],

      [36, 'Nonuniform Memory Access (NUMA)',
        `<p class="y-chinh">🎯 Three definitions that must be kept apart, and the slide gives all three on one page. NUMA is presented as "an alternative to SMP and clustering" — the architecture that tries to keep SMP's programming model while escaping SMP's size limit.</p>
<table>
<tr><th>Term</th><th>The slide's definition</th></tr>
<tr><td><strong>UMA</strong> Uniform Memory Access</td><td>All processors have access to all parts of main memory <strong>using loads and stores</strong>. Access time to <em>all regions</em> of memory is the same. Access time to memory for <em>different processors</em> is the same</td></tr>
<tr><td><strong>NUMA</strong> Nonuniform Memory Access</td><td>All processors have access to all parts of main memory <strong>using loads and stores</strong>. Access time of a processor <strong>differs depending on which region</strong> of main memory is being accessed. Different processors access different regions at different speeds</td></tr>
<tr><td><strong>CC-NUMA</strong> Cache-Coherent NUMA</td><td>A NUMA system in which <strong>cache coherence is maintained</strong> among the caches of the various processors</td></tr>
</table>
<ul>
<li><strong>The phrase repeated in both definitions is the important one: "using loads and stores".</strong> UMA and NUMA are both <em>shared-memory</em> machines — a processor reaches any address with an ordinary instruction, no message, no API. That is what makes NUMA an evolution of SMP and not a kind of cluster. Compare slide 33: in a cluster, remote data is unreachable by any load instruction.</li>
<li><strong>SMP is UMA; that is the connection back.</strong> Everything in slides 5–20 assumed uniform access over a shared bus. NUMA keeps the shared address space but admits that memory is physically distributed, so "how far away is this address" starts to matter.</li>
<li><strong>Two sentences of the NUMA definition, two different statements.</strong> (1) <em>One</em> processor sees different times for different regions. (2) <em>Different</em> processors see different times for the <em>same</em> region. Both follow from the same fact: memory is attached to nodes, and a reference is either local or remote.</li>
<li><strong>Why CC-NUMA needs its own name.</strong> Plain NUMA could be built without caches, or with caches the hardware does not keep coherent (leaving the problem to software). CC-NUMA is the commercially useful version: caches everywhere, hardware keeps them consistent, so existing SMP software still runs correctly. Every NUMA machine you will meet is CC-NUMA.</li>
<li><strong>Why snooping cannot be the answer here.</strong> Snooping (slide 15) requires a shared broadcast medium; a NUMA interconnect has no single bus every node can listen to. So CC-NUMA uses the <em>other</em> family from slide 13: <strong>directory protocols</strong> — the Directory boxes visible on each node in Figure 20.12.</li>
</ul>
<p class="meo">💡 Keep the three straight by asking two questions in order: <strong>can I use a load instruction?</strong> (no → cluster) and then <strong>is every address equally far?</strong> (yes → UMA/SMP, no → NUMA). Then: <strong>does hardware keep the caches coherent?</strong> (yes → CC-NUMA).</p>`,
        `<p class="y-chinh">🎯 Ba định nghĩa phải giữ tách bạch, và slide đưa cả ba trong một trang. NUMA được giới thiệu như "một lựa chọn thay thế cho SMP và cụm máy" — kiến trúc cố giữ mô hình lập trình của SMP trong khi thoát khỏi giới hạn quy mô của SMP.</p>
<table>
<tr><th>Thuật ngữ</th><th>Định nghĩa của slide</th></tr>
<tr><td><strong>UMA</strong> Uniform Memory Access (truy cập bộ nhớ ĐỒNG NHẤT)</td><td>Mọi bộ xử lý truy cập được mọi phần của bộ nhớ chính <strong>bằng lệnh load và store</strong>. Thời gian truy cập tới <em>MỌI VÙNG</em> bộ nhớ là NHƯ NHAU. Thời gian truy cập bộ nhớ của <em>CÁC BỘ XỬ LÝ KHÁC NHAU</em> cũng như nhau</td></tr>
<tr><td><strong>NUMA</strong> Nonuniform Memory Access (truy cập KHÔNG đồng nhất)</td><td>Mọi bộ xử lý truy cập được mọi phần của bộ nhớ chính <strong>bằng lệnh load và store</strong>. Thời gian truy cập của một bộ xử lý <strong>KHÁC NHAU tuỳ theo vùng nào</strong> của bộ nhớ chính đang được truy cập. Các bộ xử lý khác nhau truy cập các vùng khác nhau ở tốc độ khác nhau</td></tr>
<tr><td><strong>CC-NUMA</strong> Cache-Coherent NUMA</td><td>Một hệ NUMA trong đó <strong>tính nhất quán cache được duy trì</strong> giữa các cache của những bộ xử lý khác nhau</td></tr>
</table>
<ul>
<li><strong>Cụm từ lặp lại trong cả hai định nghĩa mới là chỗ quan trọng: "bằng lệnh load và store".</strong> UMA và NUMA đều là máy <em>BỘ NHỚ CHUNG</em> — bộ xử lý với tới địa chỉ bất kỳ bằng một lệnh thông thường, không thông điệp, không API. Chính điều đó làm NUMA là bước tiến hoá của SMP chứ không phải một loại cụm máy. So với slide 33: trong cụm máy, dữ liệu ở xa KHÔNG lệnh load nào với tới được.</li>
<li><strong>SMP chính là UMA; đó là mối nối ngược về.</strong> Mọi thứ ở slide 5–20 đều giả định truy cập đồng nhất qua một bus chung. NUMA giữ lại không gian địa chỉ chung nhưng thừa nhận rằng bộ nhớ phân tán về mặt vật lý, nên câu hỏi "địa chỉ này nằm xa tới đâu" bắt đầu có nghĩa.</li>
<li><strong>Hai câu trong định nghĩa NUMA là hai khẳng định KHÁC NHAU.</strong> (1) <em>MỘT</em> bộ xử lý thấy thời gian khác nhau với các vùng khác nhau. (2) <em>CÁC</em> bộ xử lý khác nhau thấy thời gian khác nhau với <em>CÙNG MỘT</em> vùng. Cả hai đều suy từ một sự thật: bộ nhớ gắn vào từng nút, và một tham chiếu thì hoặc là CỤC BỘ hoặc là Ở XA.</li>
<li><strong>Vì sao CC-NUMA cần một cái tên riêng.</strong> NUMA trần có thể dựng mà không có cache, hoặc có cache nhưng phần cứng không giữ nhất quán (đẩy việc đó cho phần mềm). CC-NUMA là phiên bản dùng được về mặt thương mại: cache ở khắp nơi, phần cứng giữ chúng nhất quán, nên phần mềm SMP sẵn có vẫn chạy ĐÚNG. Mọi máy NUMA bạn gặp trên đời đều là CC-NUMA.</li>
<li><strong>Vì sao snooping không thể là lời giải ở đây.</strong> Snooping (slide 15) đòi hỏi một môi trường quảng bá dùng chung; interconnect của NUMA không có một cái bus duy nhất mà mọi nút đều nghe được. Nên CC-NUMA dùng họ <em>CÒN LẠI</em> ở slide 13: <strong>giao thức DIRECTORY</strong> — chính mấy ô Directory thấy được trên từng nút ở Figure 20.12.</li>
</ul>
<p class="meo">💡 Giữ ba thứ này khỏi lẫn bằng hai câu hỏi theo thứ tự: <strong>tôi có dùng được lệnh load không?</strong> (không → cụm máy) rồi <strong>mọi địa chỉ có xa như nhau không?</strong> (có → UMA/SMP, không → NUMA). Rồi: <strong>phần cứng có tự giữ nhất quán cache không?</strong> (có → CC-NUMA).</p>`],

      [37, 'Motivation (why NUMA exists)',
        `<p class="y-chinh">🎯 Four coloured panels that together form one argument: <strong>SMP cannot grow, clusters do not look like one memory, so build something in between.</strong> Read them in the order they are laid out.</p>
<table>
<tr><th>Panel</th><th>What it says (verbatim from the slide)</th></tr>
<tr><td>Top-left</td><td><strong>SMP has a practical limit to the number of processors that can be used</strong> — bus traffic limits it to between <strong>16 and 64 processors</strong></td></tr>
<tr><td>Top-right</td><td><strong>In clusters each node has its own private main memory</strong> — applications do not see a large global memory, and <strong>coherency is maintained by software rather than hardware</strong></td></tr>
<tr><td>Bottom-left</td><td><strong>NUMA retains SMP flavor while giving large scale multiprocessing</strong></td></tr>
<tr><td>Bottom-right</td><td>The objective with NUMA is to <strong>maintain a transparent system-wide memory</strong> while permitting multiple multiprocessor nodes, each with its own bus or internal interconnect system</td></tr>
</table>
<ul>
<li><strong>The number to memorise: 16 to 64.</strong> This is the one hard figure in the entire NUMA section, and it is exactly the kind of thing an exam asks for. It is not a law of physics — it is the point at which shared-bus traffic (every miss, every invalidation, every snoop from slides 22–27) saturates the bus and adding processors stops helping.</li>
<li><strong>The top-right panel is the cluster's real cost, stated plainly.</strong> Not speed — <em>visibility</em>. "Applications do not see a large global memory" means every existing shared-memory program must be rewritten around messages. And "coherency is maintained by software" means the burden MESI carried in hardware lands on the programmer.</li>
<li><strong>"Retains SMP flavor" is the design goal in three words.</strong> Same instructions, same shared address space, same threads-and-locks programming — but assembled out of several multiprocessor nodes rather than one bus.</li>
<li><strong>Read the bottom-right panel as the architecture itself.</strong> "Multiple multiprocessor nodes, each with its own bus" — so a NUMA machine is literally <em>a cluster of SMPs glued together by an interconnect that carries loads and stores</em> instead of messages. That one sentence explains Figure 20.12 before you even see it.</li>
<li><strong>Where the word "transparent" is doing too much work.</strong> The memory is transparent for <em>correctness</em> — any address works from anywhere. It is emphatically <em>not</em> transparent for <em>performance</em>, and slide 39 admits as much: "does not transparently look like an SMP".</li>
</ul>
<p class="pitfall">⚠️ Trap: reading "16 to 64" as a limit on cores in any multiprocessor. It is specifically the limit on a <strong>shared-bus SMP</strong>. Modern chips exceed it by not using a single bus (ring, mesh and crossbar interconnects — Ch.21), which is another way of saying that they have quietly become NUMA machines on a single die.</p>`,
        `<p class="y-chinh">🎯 Bốn khung màu ghép lại thành MỘT lập luận: <strong>SMP không lớn lên được, cụm máy thì không trông giống một bộ nhớ duy nhất, vậy hãy dựng thứ nằm giữa.</strong> Đọc theo đúng thứ tự bố trí.</p>
<table>
<tr><th>Khung</th><th>Nó nói gì (nguyên văn trên slide)</th></tr>
<tr><td>Trên-trái</td><td><strong>SMP có giới hạn thực tế về số bộ xử lý dùng được</strong> — lưu lượng bus chặn nó trong khoảng <strong>16 tới 64 bộ xử lý</strong></td></tr>
<tr><td>Trên-phải</td><td><strong>Trong cụm máy, mỗi nút có bộ nhớ chính RIÊNG của nó</strong> — ứng dụng KHÔNG nhìn thấy một bộ nhớ toàn cục lớn, và <strong>tính nhất quán do PHẦN MỀM duy trì chứ không phải phần cứng</strong></td></tr>
<tr><td>Dưới-trái</td><td><strong>NUMA giữ được "chất" SMP trong khi cho phép đa xử lý ở quy mô lớn</strong></td></tr>
<tr><td>Dưới-phải</td><td>Mục tiêu của NUMA là <strong>duy trì một bộ nhớ toàn hệ thống TRONG SUỐT</strong> trong khi vẫn cho phép nhiều nút đa xử lý, mỗi nút có bus hoặc hệ liên kết nội bộ riêng</td></tr>
</table>
<ul>
<li><strong>Con số phải thuộc: 16 tới 64.</strong> Đây là con số CỨNG duy nhất trong cả phần NUMA, và đúng là loại chi tiết đề thi hay hỏi. Nó không phải định luật vật lý — nó là điểm mà lưu lượng bus dùng chung (mỗi lần trượt, mỗi lần vô hiệu hoá, mỗi lần snoop ở slide 22–27) bão hoà cái bus, và thêm bộ xử lý nữa thì hết tác dụng.</li>
<li><strong>Khung trên-phải nói thẳng cái giá THẬT của cụm máy.</strong> Không phải tốc độ — mà là <em>TẦM NHÌN</em>. "Ứng dụng không nhìn thấy một bộ nhớ toàn cục lớn" nghĩa là mọi chương trình bộ nhớ chung có sẵn đều phải VIẾT LẠI quanh cơ chế thông điệp. Và "tính nhất quán do phần mềm duy trì" nghĩa là gánh nặng mà MESI gánh bằng phần cứng nay rơi xuống vai người lập trình.</li>
<li><strong>"Retains SMP flavor" là mục tiêu thiết kế gói trong ba chữ.</strong> Cùng bộ lệnh, cùng không gian địa chỉ chung, cùng kiểu lập trình luồng-và-khoá — nhưng ráp lại từ nhiều nút đa xử lý chứ không phải từ một cái bus.</li>
<li><strong>Đọc khung dưới-phải như chính bản vẽ kiến trúc.</strong> "Nhiều nút đa xử lý, mỗi nút một bus riêng" — vậy máy NUMA đúng nghĩa đen là <em>một cụm các SMP dán lại bằng một interconnect chuyên chở lệnh load/store</em> thay vì chuyên chở thông điệp. Một câu đó giải thích xong Figure 20.12 trước cả khi bạn nhìn thấy hình.</li>
<li><strong>Chữ "trong suốt" ở đây gánh hơi quá sức.</strong> Bộ nhớ trong suốt về mặt <em>ĐÚNG SAI</em> — địa chỉ nào cũng dùng được từ chỗ nào cũng được. Nhưng nó dứt khoát <em>KHÔNG</em> trong suốt về mặt <em>HIỆU NĂNG</em>, và slide 39 thừa nhận đúng điều đó: "không trông giống SMP một cách trong suốt".</li>
</ul>
<p class="pitfall">⚠️ Bẫy: đọc "16 tới 64" thành giới hạn số nhân của mọi hệ đa xử lý. Nó là giới hạn riêng của <strong>SMP dùng BUS CHUNG</strong>. Chip hiện đại vượt qua con số đó bằng cách KHÔNG dùng một cái bus duy nhất (interconnect kiểu vòng, lưới, crossbar — Ch.21), mà nói cách khác là chúng đã lặng lẽ trở thành máy NUMA ngay trên một con đế.</p>`],

      [38, 'Figure 20.12 — CC-NUMA Organization',
        `<p class="y-chinh">🎯 The architecture drawn. <strong>N nodes</strong>, each one a complete little SMP: processors <em>1-1 … 1-m</em> each with an L1 Cache, each behind an L2 Cache, all hanging off that node's own bus, together with <strong>Main Memory 1</strong>, an <strong>I/O</strong> module and — the new box — a <strong>Directory</strong>. All N node buses meet at a central <strong>Interconnect Network</strong>.</p>
<ul>
<li><strong>Read the picture top-down and the definition falls out.</strong> A load to <em>Main Memory 1</em> issued by <em>Processor 1-1</em> never leaves its node bus: that is a <strong>local</strong> access. The same load issued by <em>Processor 2-1</em> must cross the interconnect: that is a <strong>remote</strong> access. Same instruction, same address, two very different times — which is precisely the NUMA definition of slide 36.</li>
<li><strong>The Directory box is where coherence lives.</strong> Per slide 13 there are two families; snooping needs a broadcast bus and there isn't one here, so CC-NUMA uses a <strong>directory protocol</strong>: for each memory block that a node owns, its directory records which remote nodes hold a copy and in what state. A write then sends point-to-point invalidations to exactly those nodes instead of broadcasting to all.</li>
<li><strong>Why directories scale and snooping does not.</strong> Snoop traffic grows with the number of caches × the number of transactions — every cache must inspect every transaction. Directory traffic grows with the number of <em>actual sharers</em> of the block being touched, which is typically one or two. The cost is memory: the directory itself occupies a few percent of DRAM.</li>
<li><strong>Two levels of memory hierarchy are now visible at once.</strong> L1 → L2 → local main memory is Chapter 4's hierarchy; local main memory → remote main memory is a <em>new</em> level added by the topology. The same formula that priced the first prices the second.</li>
</ul>
<p class="nhan">📐 <strong>The exam calculation.</strong> Local (near) access 100 ns, remote (far) access 300 ns, and <em>p</em> = the fraction of accesses that are local. Then the average access time is <strong>T = p × 100 + (1 − p) × 300 ns</strong> — the same shape as Chapter 4's T = T1 + (1 − H) × T2, with "hit ratio" replaced by "locality ratio". Verified with <code>python3</code>:</p>
<table>
<tr><th>Local access ratio <em>p</em></th><th>T = p×100 + (1−p)×300</th><th>Slow-down vs an ideal all-local machine</th><th>Verdict</th></tr>
<tr><td>100%</td><td>100 ns</td><td>1,00×</td><td>Perfect placement — as fast as SMP</td></tr>
<tr><td><strong>90%</strong></td><td><strong>120 ns</strong></td><td>1,20×</td><td>Healthy — this is what a NUMA-aware OS aims for</td></tr>
<tr><td>80%</td><td>140 ns</td><td>1,40×</td><td>Noticeable</td></tr>
<tr><td><strong>70%</strong></td><td><strong>160 ns</strong></td><td>1,60×</td><td>Hurting — threads are drifting off their memory</td></tr>
<tr><td><strong>50%</strong></td><td><strong>200 ns</strong></td><td>2,00×</td><td>Half the memory system's advantage is gone</td></tr>
<tr><td>0%</td><td>300 ns</td><td>3,00×</td><td>Worst case: every reference is remote</td></tr>
</table>
<p class="dap-an">✅ Answer: <strong>90% local → 120 ns · 70% local → 160 ns · 50% local → 200 ns.</strong> Going from 90% to 50% locality makes the memory system <strong>1,67× slower</strong> without changing a single line of code or a single piece of hardware — only <em>where the data sits relative to the thread</em>. Solving p × 100 + (1 − p) × 300 = 150 gives <strong>p = 0,75</strong>, so 75% locality is the break-even point for "at most 50% worse than ideal".</p>
<ul>
<li><strong>That is why NUMA performance is a placement problem, not a hardware problem.</strong> The OS must allocate a thread's pages on the node where the thread runs (Linux calls the policy <em>first-touch</em>) and must avoid migrating threads away from their memory. Get that wrong and you have bought expensive hardware that runs at remote speed.</li>
<li><strong>Connect it back to Ch.4 one more time.</strong> Both formulas are a weighted average over two outcomes, near and far. Cache: 99% near is achievable because hardware manages placement. NUMA: 90% near requires <em>software</em> to manage placement — and that is the whole difficulty.</li>
</ul>
<p class="pitfall">⚠️ 100 ns / 300 ns are teaching numbers, not a specification; real remote/local ratios run about 1,5× to 3×. What is not arbitrary is the <em>shape</em> of the result: the penalty is linear in the remote fraction, so locality below about 70% degrades the machine fast.</p>`,
        `<p class="y-chinh">🎯 Kiến trúc vẽ ra thành hình. <strong>N nút</strong>, mỗi nút là một cái SMP con hoàn chỉnh: các bộ xử lý <em>1-1 … 1-m</em> mỗi cái có L1 Cache, mỗi cái nằm sau một L2 Cache, tất cả treo vào cái bus riêng của nút đó, cùng với <strong>Main Memory 1</strong>, một khối <strong>I/O</strong> và — cái ô MỚI — một <strong>Directory</strong>. Cả N cái bus của N nút gặp nhau tại một <strong>Interconnect Network</strong> ở giữa.</p>
<ul>
<li><strong>Đọc hình từ trên xuống là định nghĩa tự rơi ra.</strong> Một lệnh load tới <em>Main Memory 1</em> do <em>Processor 1-1</em> phát ra không hề rời khỏi bus của nút: đó là truy cập <strong>CỤC BỘ</strong>. Cũng lệnh đó do <em>Processor 2-1</em> phát thì phải vượt qua interconnect: đó là truy cập <strong>Ở XA</strong>. Cùng một lệnh, cùng một địa chỉ, hai thời gian khác hẳn nhau — đúng y định nghĩa NUMA ở slide 36.</li>
<li><strong>Ô Directory là nơi tính nhất quán trú ngụ.</strong> Theo slide 13 có hai họ giao thức; snooping cần một cái bus quảng bá mà ở đây không có, nên CC-NUMA dùng <strong>giao thức directory</strong>: với mỗi khối bộ nhớ mà nút sở hữu, directory của nó GHI LẠI những nút xa nào đang giữ bản sao và ở trạng thái gì. Một lần ghi khi đó gửi lệnh vô hiệu hoá ĐIỂM-TỚI-ĐIỂM đúng tới những nút ấy, thay vì quảng bá cho tất cả.</li>
<li><strong>Vì sao directory mở rộng được còn snooping thì không.</strong> Lưu lượng snoop tăng theo số cache × số giao dịch — mọi cache phải soi mọi giao dịch. Lưu lượng directory tăng theo số NGƯỜI CHIA SẺ THẬT của khối đang bị đụng, mà con số đó thường là một hoặc hai. Cái giá phải trả là bộ nhớ: bản thân directory chiếm vài phần trăm DRAM.</li>
<li><strong>Bây giờ có HAI tầng phân cấp bộ nhớ hiện ra cùng lúc.</strong> L1 → L2 → bộ nhớ chính cục bộ là phân cấp của Chương 4; bộ nhớ chính cục bộ → bộ nhớ chính ở xa là một tầng <em>MỚI</em> do chính topo sinh ra. Cùng một công thức định giá tầng thứ nhất thì định giá luôn tầng thứ hai.</li>
</ul>
<p class="nhan">📐 <strong>Bài tính đi thi.</strong> Truy cập cục bộ (gần) 100 ns, truy cập ở xa 300 ns, và <em>p</em> = tỉ lệ truy cập là cục bộ. Khi đó thời gian truy cập trung bình là <strong>T = p × 100 + (1 − p) × 300 ns</strong> — cùng DẠNG với công thức T = T1 + (1 − H) × T2 của Chương 4, chỉ thay "tỉ lệ trúng" bằng "tỉ lệ truy cập cục bộ". Đã kiểm bằng <code>python3</code>:</p>
<table>
<tr><th>Tỉ lệ truy cập cục bộ <em>p</em></th><th>T = p×100 + (1−p)×300</th><th>Chậm hơn máy lý tưởng toàn cục bộ</th><th>Nhận xét</th></tr>
<tr><td>100%</td><td>100 ns</td><td>1,00×</td><td>Đặt dữ liệu hoàn hảo — nhanh ngang SMP</td></tr>
<tr><td><strong>90%</strong></td><td><strong>120 ns</strong></td><td>1,20×</td><td>Khoẻ mạnh — đây là mức mà một hệ điều hành "biết NUMA" nhắm tới</td></tr>
<tr><td>80%</td><td>140 ns</td><td>1,40×</td><td>Đã thấy rõ</td></tr>
<tr><td><strong>70%</strong></td><td><strong>160 ns</strong></td><td>1,60×</td><td>Đau rồi — luồng đang trôi dạt khỏi bộ nhớ của nó</td></tr>
<tr><td><strong>50%</strong></td><td><strong>200 ns</strong></td><td>2,00×</td><td>Mất một nửa lợi thế của cả hệ thống nhớ</td></tr>
<tr><td>0%</td><td>300 ns</td><td>3,00×</td><td>Ca xấu nhất: mọi tham chiếu đều ở xa</td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>90% cục bộ → 120 ns · 70% cục bộ → 160 ns · 50% cục bộ → 200 ns.</strong> Tụt từ 90% xuống 50% làm hệ thống nhớ <strong>chậm đi 1,67 lần</strong> mà không đổi một dòng mã nào, không đổi một mẩu phần cứng nào — chỉ đổi <em>chỗ dữ liệu nằm so với luồng đang chạy</em>. Giải p × 100 + (1 − p) × 300 = 150 cho <strong>p = 0,75</strong>, tức 75% cục bộ là điểm hoà vốn của mức "tệ hơn lý tưởng nhiều nhất 50%".</p>
<ul>
<li><strong>Vì thế hiệu năng NUMA là bài toán ĐẶT DỮ LIỆU, không phải bài toán phần cứng.</strong> Hệ điều hành phải cấp phát trang của một luồng ngay trên nút mà luồng đó chạy (Linux gọi chính sách này là <em>first-touch</em>) và phải tránh di dời luồng ra xa bộ nhớ của nó. Làm sai chỗ này là bạn đã mua phần cứng đắt tiền để chạy ở tốc độ "ở xa".</li>
<li><strong>Nối về Ch.4 thêm một lần nữa.</strong> Cả hai công thức đều là trung bình có trọng số trên hai kết cục, gần và xa. Với cache: 99% gần là đạt được, vì PHẦN CỨNG lo việc đặt dữ liệu. Với NUMA: 90% gần đòi hỏi <em>PHẦN MỀM</em> lo việc đặt dữ liệu — và đó chính là chỗ khó.</li>
</ul>
<p class="pitfall">⚠️ 100 ns / 300 ns là số để DẠY, không phải thông số kỹ thuật; tỉ lệ xa/gần thật thường cỡ 1,5 tới 3 lần. Thứ KHÔNG tuỳ tiện là <em>HÌNH DẠNG</em> của kết quả: hình phạt tuyến tính theo tỉ lệ truy cập xa, nên tính cục bộ tụt dưới khoảng 70% là cỗ máy xuống dốc rất nhanh.</p>`],

      [39, 'NUMA Pros and Cons',
        `<p class="y-chinh">🎯 The honest closing assessment. The main advantage is that CC-NUMA <strong>can deliver effective performance at higher levels of parallelism than SMP without requiring major software changes</strong> — and every disadvantage on the slide is a qualification of that same sentence.</p>
<table>
<tr><th>Pros (from the slide)</th><th>Cons (from the slide)</th></tr>
<tr><td>Effective performance at <strong>higher levels of parallelism than SMP</strong></td><td><strong>If many of the memory accesses are to remote nodes, performance begins to break down</strong></td></tr>
<tr><td><strong>Without requiring major software changes</strong></td><td><strong>Does not transparently look like an SMP</strong> — software changes will be required to move an OS and applications from SMP to CC-NUMA</td></tr>
<tr><td><strong>Bus traffic on any individual node is limited to a demand that the bus can handle</strong></td><td><strong>Concern with availability</strong></td></tr>
</table>
<ul>
<li><strong>The third "pro" is the engineering trick of the whole architecture.</strong> SMP died at 16–64 processors because one bus carried everyone's traffic (slide 37). NUMA gives each node its own bus, so each bus sees only its own node's demand; only the (rarer) remote traffic crosses the interconnect. The bottleneck is not removed — it is <em>partitioned</em>.</li>
<li><strong>Put the first "con" next to the arithmetic of slide 38 and it becomes precise.</strong> "Performance begins to break down" is T = p×100 + (1−p)×300 climbing toward 300 ns: 90% local costs 20%, 50% local costs 100%. The slide's qualitative warning and the formula are the same statement.</li>
<li><strong>The second "con" contradicts the headline advantage, deliberately.</strong> "No major software changes" means the code still <em>runs</em>; "does not transparently look like an SMP" means it may not run <em>fast</em>. Correctness is transparent; performance is not. Moving an OS across requires it to become NUMA-aware — node-local page allocation, NUMA-aware scheduling, node-local locks.</li>
<li><strong>Why availability is a concern, and why clusters win that round.</strong> A CC-NUMA machine is <em>one</em> system with <em>one</em> OS image over a shared address space. A failed node takes down memory that other nodes' programs are actively addressing, so it is hard to contain. In a cluster (slide 33) a dead node loses only its own share — which is exactly why "high availability" is a cluster benefit and an <em>issue</em> here.</li>
<li><strong>Where this leaves the three architectures.</strong> SMP: simplest, smallest. Cluster: largest and most available, but the program must be rewritten around messages. CC-NUMA: keeps the shared-memory program, scales past SMP, and hands you a performance problem (data placement) plus an availability problem in exchange.</li>
</ul>
<p class="meo">💡 One line for the exam: <strong>CC-NUMA buys scale with the programmer's ignorance of distance — and charges for it whenever the data is far away.</strong></p>`,
        `<p class="y-chinh">🎯 Lời đánh giá kết thúc, rất thành thật. Ưu điểm chính là CC-NUMA <strong>đạt hiệu năng hiệu quả ở mức song song CAO HƠN SMP mà không đòi hỏi thay đổi phần mềm lớn</strong> — và mọi nhược điểm trên slide đều là một lời "nhưng mà" cho đúng câu đó.</p>
<table>
<tr><th>Ưu (theo slide)</th><th>Nhược (theo slide)</th></tr>
<tr><td>Hiệu năng hiệu quả ở <strong>mức song song cao hơn SMP</strong></td><td><strong>Nếu NHIỀU truy cập bộ nhớ rơi vào nút ở XA thì hiệu năng bắt đầu SỤP</strong></td></tr>
<tr><td><strong>Không đòi hỏi thay đổi phần mềm lớn</strong></td><td><strong>KHÔNG trông giống SMP một cách trong suốt</strong> — vẫn phải sửa phần mềm khi chuyển hệ điều hành và ứng dụng từ SMP sang CC-NUMA</td></tr>
<tr><td><strong>Lưu lượng bus trên từng nút riêng lẻ bị giới hạn ở mức mà cái bus đó gánh nổi</strong></td><td><strong>Đáng lo về tính SẴN SÀNG</strong></td></tr>
</table>
<ul>
<li><strong>Cái "ưu" thứ ba mới là mẹo kỹ thuật của cả kiến trúc.</strong> SMP chết ở mức 16–64 bộ xử lý vì MỘT cái bus phải chở lưu lượng của tất cả (slide 37). NUMA cho mỗi nút một cái bus riêng, nên mỗi bus chỉ thấy nhu cầu của chính nút mình; chỉ phần lưu lượng ở xa (hiếm hơn) mới phải vượt interconnect. Nút thắt cổ chai KHÔNG bị xoá bỏ — nó bị <em>CHIA NHỎ</em>.</li>
<li><strong>Đặt cái "nhược" thứ nhất cạnh phép tính của slide 38 là nó thành con số.</strong> "Hiệu năng bắt đầu sụp" chính là T = p×100 + (1−p)×300 leo dần về phía 300 ns: 90% cục bộ tốn thêm 20%, 50% cục bộ tốn thêm 100%. Lời cảnh báo định tính của slide và công thức là CÙNG MỘT khẳng định.</li>
<li><strong>Cái "nhược" thứ hai mâu thuẫn với chính ưu điểm tiêu đề, một cách CỐ Ý.</strong> "Không phải sửa phần mềm lớn" nghĩa là mã vẫn <em>CHẠY</em>; "không trông giống SMP một cách trong suốt" nghĩa là nó có thể không chạy <em>NHANH</em>. Tính ĐÚNG thì trong suốt; HIỆU NĂNG thì không. Chuyển một hệ điều hành sang đây đòi hỏi nó phải "biết NUMA" — cấp phát trang theo nút, lập lịch theo nút, khoá cục bộ theo nút.</li>
<li><strong>Vì sao tính sẵn sàng đáng lo, và vì sao cụm máy thắng ván này.</strong> Máy CC-NUMA là <em>MỘT</em> hệ thống với <em>MỘT</em> bản hệ điều hành trải trên một không gian địa chỉ chung. Một nút chết sẽ kéo theo phần bộ nhớ mà chương trình của các nút khác đang tích cực dùng, rất khó khoanh vùng. Trong cụm máy (slide 33), một nút chết chỉ mất phần của chính nó — chính vì thế "tính sẵn sàng cao" là LỢI ÍCH của cụm máy còn ở đây lại là một <em>MỐI LO</em>.</li>
<li><strong>Ba kiến trúc rốt cuộc đứng ở đâu.</strong> SMP: đơn giản nhất, nhỏ nhất. Cụm máy: lớn nhất và sẵn sàng nhất, nhưng chương trình phải viết lại quanh thông điệp. CC-NUMA: giữ nguyên chương trình bộ nhớ chung, mở rộng vượt SMP, và đổi lại trao cho bạn một bài toán hiệu năng (đặt dữ liệu ở đâu) cộng một bài toán sẵn sàng.</li>
</ul>
<p class="meo">💡 Một dòng để đi thi: <strong>CC-NUMA mua quy mô bằng việc cho người lập trình quyền không cần biết khoảng cách — và thu tiền mỗi khi dữ liệu nằm xa.</strong></p>`],

      [40, 'Summary — Chapter 20: Parallel Processing',
        `<p class="y-chinh">🎯 The chapter's own contents list, and the best 60-second revision sheet you will get. Every line is a heading you should be able to say two sentences about; if one is blank, go back to the slide that owns it.</p>
<table>
<tr><th>Summary heading (verbatim)</th><th>Slides</th><th>The one thing to be able to say</th></tr>
<tr><td><strong>Multiple processor organizations</strong> — types of parallel processor systems, parallel organizations</td><td>2–4</td><td>Flynn: SISD · SIMD · MISD (never built commercially) · MIMD; SMP, clusters and NUMA are all MIMD</td></tr>
<tr><td><strong>Symmetric multiprocessors</strong> — organization, multiprocessor OS design considerations</td><td>5–11</td><td>Shared bus, uniform access; simple, flexible, reliable — but bus-limited, hence 16–64 processors</td></tr>
<tr><td><strong>Cache coherence and the MESI protocol</strong> — software solutions, hardware solutions, the MESI protocol</td><td>12–27</td><td>Snoopy versus directory; write-invalidate; M/E are exclusive, S is shared, I is nothing; four transactions</td></tr>
<tr><td><strong>Multithreading and chip multiprocessors</strong> — implicit and explicit multithreading, approaches to explicit multithreading</td><td>28–32</td><td>MIPS = f × IPC; interleaved / blocked / SMT fill existing slots, chip multiprocessing adds slots</td></tr>
<tr><td><strong>Clusters</strong> — cluster configurations</td><td>33–35</td><td>Whole computers, private memory, message link; four benefits; five clustering methods</td></tr>
<tr><td><strong>Nonuniform memory access</strong> — motivation, organization, NUMA pros and cons</td><td>36–39</td><td>Shared address space, distributed memory, directory coherence; performance = locality ratio</td></tr>
</table>
<ul>
<li><strong>The one-sentence arc of the chapter.</strong> A single processor ran out of clock and out of ILP (Ch.14), so the answer became <em>more processors</em> — and the rest of the chapter is the three ways to arrange them (SMP, cluster, NUMA) plus the one problem all three create (keeping copies of data consistent).</li>
<li><strong>The three questions that unlock any exam question in this chapter.</strong> (1) Is memory shared or private? (2) Is access uniform or not? (3) Who maintains coherence — hardware snooping, hardware directory, or software? Answer those three and you have identified the architecture.</li>
<li><strong>What to revise first if time is short.</strong> Table 20.1 (MESI states, slide 19) and Figure 20.7 (legal state combinations, slide 21); the four transactions (22–25); the SMP/cluster/NUMA comparison (slide 33); the 16–64 figure (slide 37); and the average-access-time calculation (slide 38).</li>
<li><strong>Where the course goes next.</strong> Chapter 21 (Multicore Computers) takes "chip multiprocessing" from slide 31 and makes it the whole subject: how many cores, how much cache, shared or private L2/L3, and the software problem that Amdahl's law (slide 34) guarantees you will hit.</li>
</ul>
<p class="pitfall">⚠️ Two quirks of this summary slide, so you are not confused by them. It prints the words "<strong>Parallel</strong>" and "<strong>Processing</strong>" as two standalone lines in the middle of the list — that is the slide's decorative chapter title, not a topic. And "multithreading" is listed <em>after</em> the MESI block, which is the order the deck presents it, but many syllabi teach multithreading before coherence; follow your lecturer's order, not the slide's.</p>`,
        `<p class="y-chinh">🎯 Chính mục lục của chương, và là tờ ôn tập 60 giây tốt nhất bạn có. Mỗi dòng là một đề mục mà bạn phải nói được hai câu về nó; chỗ nào trống thì quay lại đúng slide làm chủ nó.</p>
<table>
<tr><th>Đề mục tổng kết (nguyên văn)</th><th>Slide</th><th>Một điều phải nói được</th></tr>
<tr><td><strong>Multiple processor organizations</strong> — các loại hệ xử lý song song, các tổ chức song song</td><td>2–4</td><td>Flynn: SISD · SIMD · MISD (chưa từng có sản phẩm thương mại) · MIMD; SMP, cụm máy và NUMA đều là MIMD</td></tr>
<tr><td><strong>Symmetric multiprocessors</strong> — tổ chức, các cân nhắc thiết kế hệ điều hành đa xử lý</td><td>5–11</td><td>Bus chung, truy cập đồng nhất; đơn giản, linh hoạt, tin cậy — nhưng bị bus chặn, nên chỉ 16–64 bộ xử lý</td></tr>
<tr><td><strong>Cache coherence và giao thức MESI</strong> — giải pháp phần mềm, giải pháp phần cứng, giao thức MESI</td><td>12–27</td><td>Snoopy so với directory; write-invalidate; M/E là độc quyền, S là chia sẻ, I là không có gì; bốn giao dịch</td></tr>
<tr><td><strong>Multithreading và chip multiprocessors</strong> — đa luồng ngầm và tường minh, các cách đa luồng tường minh</td><td>28–32</td><td>MIPS = f × IPC; xen kẽ / theo khối / SMT lấp khe SẴN CÓ, chip multiprocessing THÊM khe</td></tr>
<tr><td><strong>Clusters</strong> — các cấu hình cụm máy</td><td>33–35</td><td>Máy tính hoàn chỉnh, bộ nhớ riêng, liên kết thông điệp; bốn lợi ích; năm phương pháp gom cụm</td></tr>
<tr><td><strong>Nonuniform memory access</strong> — động cơ, tổ chức, ưu nhược điểm NUMA</td><td>36–39</td><td>Chung không gian địa chỉ, bộ nhớ phân tán, đồng bộ bằng directory; hiệu năng = tỉ lệ truy cập cục bộ</td></tr>
</table>
<ul>
<li><strong>Mạch của cả chương trong một câu.</strong> Một bộ xử lý đã cạn xung nhịp và cạn ILP (Ch.14), nên câu trả lời trở thành <em>NHIỀU BỘ XỬ LÝ HƠN</em> — và phần còn lại của chương là ba cách sắp xếp chúng (SMP, cụm máy, NUMA) cộng một bài toán mà cả ba đều đẻ ra (giữ cho các bản sao dữ liệu nhất quán).</li>
<li><strong>Ba câu hỏi mở được mọi đề thi của chương này.</strong> (1) Bộ nhớ là CHUNG hay RIÊNG? (2) Truy cập ĐỒNG NHẤT hay không? (3) AI giữ tính nhất quán — phần cứng snooping, phần cứng directory, hay phần mềm? Trả lời xong ba câu đó là bạn đã nhận diện được kiến trúc.</li>
<li><strong>Thiếu thời gian thì ôn cái gì trước.</strong> Table 20.1 (trạng thái MESI, slide 19) và Figure 20.7 (tổ hợp trạng thái hợp lệ, slide 21); bốn giao dịch (22–25); bảng so SMP/cụm máy/NUMA (slide 33); con số 16–64 (slide 37); và phép tính thời gian truy cập trung bình (slide 38).</li>
<li><strong>Môn học đi tiếp về đâu.</strong> Chương 21 (Máy tính đa lõi) lấy "chip multiprocessing" từ slide 31 rồi biến nó thành cả một chủ đề: bao nhiêu lõi, cache bao nhiêu, L2/L3 chung hay riêng, và bài toán phần mềm mà định luật Amdahl (slide 34) bảo đảm rằng bạn sẽ đâm vào.</li>
</ul>
<p class="pitfall">⚠️ Hai chỗ kỳ quặc của slide tổng kết này, để bạn khỏi rối. Nó in hai chữ "<strong>Parallel</strong>" và "<strong>Processing</strong>" thành hai dòng đứng riêng giữa danh sách — đó là tiêu đề chương trang trí của slide, không phải một chủ đề. Và "multithreading" được xếp <em>SAU</em> khối MESI, đúng thứ tự của bộ slide, nhưng nhiều đề cương lại dạy đa luồng TRƯỚC phần nhất quán cache; hãy theo thứ tự của giảng viên, đừng theo thứ tự của slide.</p>`],

    ]),
  ].join('\n'),
};
