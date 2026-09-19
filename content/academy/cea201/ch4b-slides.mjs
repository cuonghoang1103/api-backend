/**
 * CEA201 · Chương 4 (phần b) — Cache Memory, học theo từng slide (slide 1–22 của deck cea5).
 * Deck 'cea5' (CEA5, CH05-COA11e.pptx), 43 slide, ảnh CDN images/academy/CEA201/v1/cea5/NNN.webp.
 *
 * ⚠️ Syllabus của trường đánh số theo bản 9th ed nên gọi cụm này là "Chapter 4: Cache Memory".
 * Bản 11e tách thành Ch.4 (phân cấp bộ nhớ — đã có bài riêng) và Ch.5 (cache). File đặt tên
 * ch4b theo cách môn trên web đánh số chương.
 *
 * Nội dung bám ĐÚNG chữ trích từ /tmp/cea201-text/cea5.txt. Các slide chỉ có tiêu đề + hình
 * (2, 4, 5, 6, 9, 11, 13, 14, 15, 17, 18, 19, 21, 22) đã đọc thẳng từ ảnh render để lấy đúng
 * từng nhãn trong sơ đồ.
 *
 * ⚠️ MỌI phép chia địa chỉ trong bài đã kiểm bằng python3 (tính số bit → tách trường → DỰNG
 * NGƯỢC lại để đối chiếu), trước khi viết:
 *   · Figure 5.8 (slide 15), toàn bộ 8 địa chỉ hiện trên hình: 0x000000→(00,0000,00);
 *     0x160000→(16,0000,00); 0x160004→(16,0001,00); 0x16339C→(16,0CE7,00);
 *     0x16FFFC→(16,3FFF,00); 0xFFFFF8→(FF,3FFE,00); 0xFFFFFC→(FF,3FFF,00). Khớp 100% với slide.
 *   · Figure 5.11 (slide 19), tag kết hợp = địa chỉ >> 2: 0x16339C→058CE7; 0xFFFFF4→3FFFFD;
 *     0xFFFFF8→3FFFFE; 0xFFFFFC→3FFFFF; 0x000000→000000. Khớp 100% với slide.
 *   · Bốn bài chia địa chỉ tự ra thêm (BT1–BT4) + một bài NGƯỢC (dựng lại dải địa chỉ từ
 *     dòng + tag): mỗi bài đều dựng ngược về đúng địa chỉ ban đầu.
 *
 * ⚠️ ĐO THẬT trên máy (Apple M1 Max, L1d 64 kB, line 128 B, L2 4 MB, Apple clang 17, `cc -O2`):
 *   · Thrashing ánh xạ trực tiếp — 24 luồng đọc cách nhau ĐÚNG 32768 B (bội số kích thước
 *     cache) so với cách nhau 32768+64 B: 3,24–3,59 ns/lần đọc so với 1,63–1,66 ns/lần đọc,
 *     tức CHẬM HƠN ~2,1 LẦN dù dữ liệu thật chỉ 24 × 4 B. Lặp lại 5 lượt, ổn định.
 *   · Duyệt ma trận 4096×4096 int theo HÀNG so với theo CỘT: 0,0012–0,0014 s so với
 *     0,055–0,064 s, tức chậm hơn ~45–55 lần. (Bài PRF192 "lập trình thân thiện với cache".)
 *
 * Những chỗ SLIDE GỐC SAI — đã nêu rõ trong bài, KHÔNG im lặng chép lại và KHÔNG tự ý sửa:
 *   · slide 11 (Table 5.2): cột "Year of Introduction" ghi **1968 ở CẢ 20 dòng**. Chỉ dòng
 *     IBM 360/85 là đúng; Intel Core i9-7900X ra 2017, IBM z13 ra 2015. Đã kiểm bằng ảnh
 *     render — lỗi nằm trên chính slide, không phải lỗi trích chữ.
 *   · slide 11: tên "Intel Core i0-7900X" phải là i9-7900X; "Workstaton" phải là Workstation.
 *   · slide 41 (ngoài phạm vi bài này) có dòng "T= = trl + tct" — lỗi gõ của bộ slide gốc.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea5';

export default {
  title: '4.0b — Slide by slide: Cache principles, design elements and the three mapping schemes (slides 1–22)|||4.0b — Slide bài giảng: Nguyên lý cache, yếu tố thiết kế & ba kiểu ánh xạ (slide 1–22)',
  slug: 'cea201-4-0b-slides-cache-anh-xa-truc-tiep',
  type: 'DOCUMENT',
  description: 'Nửa đầu chương Cache của CEA201 (slide 1–22 bộ slide chính hãng Stallings 11th Edition) — chương ĐƯỢC HỎI NHIỀU NHẤT trong đề thi. Đi từ nguyên lý cache và bốn từ khoá block/frame/line/tag, qua cấu trúc cache ↔ bộ nhớ chính, lưu đồ đọc cache, bảng bảy yếu tố thiết kế, cache logic so với cache vật lý, kích thước cache, tới phần trọng tâm: ÁNH XẠ TRỰC TIẾP và cách CHIA ĐỊA CHỈ thành Tag | Line | Word. Có công thức số bit từng trường, bốn bài chia địa chỉ giải trọn vẹn với tham số khác nhau, một bài NGƯỢC dựng lại dải địa chỉ từ dòng và tag, cùng phép đo THẬT bằng C cho hiện tượng thrashing (chậm 2,1 lần) và duyệt ma trận theo cột (chậm 50 lần). Khép lại bằng CAM, ánh xạ kết hợp toàn phần và ánh xạ kết hợp theo tập — hai cách sinh ra để chữa đúng điểm yếu của ánh xạ trực tiếp.',
  content: [
    walkHead(D, 1, 22),
    walk(D, [

      [1, 'Computer Organization and Architecture, 11th Edition — Chapter 5: Cache Memory',
        `<p class="y-chinh">🎯 The title slide of the chapter that pays for everything Chapter 4 promised. Chapter 4 proved that <em>locality</em> exists and that a hierarchy is therefore possible; Chapter 5 builds the one level of that hierarchy which is made entirely of hardware and is invisible to the programmer — the <strong>cache</strong>.</p>
<ul>
<li><strong>Why this chapter matters more than its page count suggests.</strong> In CEA201 exam papers, cache is the single most frequently examined topic, and the question is almost always the same shape: <em>split this address into Tag / Line / Word and say which cache line it lands in</em>. Everything else in the chapter is prose; that one skill is arithmetic, and arithmetic is what gets marked.</li>
<li><strong>The chapter has four movements.</strong> Slides 2–6: what a cache <em>is</em> (structure, read flow, wiring). Slides 7–11: the seven <strong>elements of cache design</strong>, with addresses and size treated first. Slides 12–24: the three <strong>mapping functions</strong> — direct, fully associative, set associative. Slides 25–43: replacement, write policy, line size, multilevel caches, real Intel/IBM organizations and a timing model.</li>
<li><strong>This walkthrough covers slides 1–22</strong>: principles, design elements, cache size, and the mapping functions up to the k-way set-associative organization. The later half (replacement algorithms, write policy, multilevel and split caches) is a separate lesson.</li>
<li><strong>The one sentence that generates the whole chapter.</strong> A cache is <em>small</em>, so many memory blocks must share few cache lines; deciding <em>which block may sit where</em> is the mapping function, and every design choice afterwards (replacement, line size, associativity) is a consequence of that one decision.</li>
<li><strong>What you must bring.</strong> Binary and hexadecimal (Ch.10), powers of two, and log<sub>2</sub>. If you can say instantly that 2<sup>14</sup> = 16384 and that 64 kB = 2<sup>16</sup> bytes, the arithmetic of this chapter is free.</li>
</ul>
<p class="meo">💡 Open a formula card on slide 1 with exactly three lines: <code>w = log<sub>2</sub>(block size in bytes)</code>, <code>r = log<sub>2</sub>(number of lines)</code>, <code>tag = address bits − w − r</code>. Those three lines answer the majority of the marks this chapter can carry.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề của chương trả nợ cho mọi lời hứa của Chương 4. Chương 4 chứng minh <em>tính cục bộ</em> có thật nên phân cấp bộ nhớ là khả thi; Chương 5 dựng ra đúng cái tầng của phân cấp đó được làm hoàn toàn bằng phần cứng và vô hình với lập trình viên — <strong>cache</strong>.</p>
<ul>
<li><strong>Vì sao chương này nặng hơn số trang của nó.</strong> Trong đề thi CEA201, cache là chủ đề bị hỏi NHIỀU NHẤT, và câu hỏi gần như luôn cùng một dáng: <em>chia địa chỉ này thành Tag / Line / Word và cho biết nó rơi vào dòng cache nào</em>. Mọi thứ khác trong chương là văn xuôi; đúng một kỹ năng đó là SỐ HỌC, mà số học mới là thứ được chấm điểm.</li>
<li><strong>Chương có bốn đoạn.</strong> Slide 2–6: cache <em>LÀ GÌ</em> (cấu trúc, lưu đồ đọc, cách đấu dây). Slide 7–11: bảy <strong>yếu tố thiết kế cache</strong>, xử lý địa chỉ và kích thước trước. Slide 12–24: ba <strong>hàm ánh xạ</strong> — trực tiếp, kết hợp toàn phần, kết hợp theo tập. Slide 25–43: thay thế, chính sách ghi, kích thước dòng, cache nhiều cấp, tổ chức thật của Intel/IBM và mô hình thời gian.</li>
<li><strong>Bài này đi slide 1–22</strong>: nguyên lý, yếu tố thiết kế, kích thước cache, và các hàm ánh xạ cho tới tổ chức kết hợp theo tập k đường. Nửa sau (thuật toán thay thế, chính sách ghi, cache nhiều cấp và cache tách) nằm ở bài riêng.</li>
<li><strong>Một câu sinh ra cả chương.</strong> Cache thì <em>NHỎ</em>, nên rất nhiều khối bộ nhớ phải dùng chung ít dòng cache; quyết định <em>khối nào được phép nằm ở đâu</em> chính là hàm ánh xạ, và mọi lựa chọn thiết kế sau đó (thay thế, kích thước dòng, độ kết hợp) đều là hệ quả của đúng quyết định đó.</li>
<li><strong>Bạn cần mang theo gì.</strong> Nhị phân và thập lục phân (Ch.10), luỹ thừa của 2, và log<sub>2</sub>. Nếu bạn nói ngay được 2<sup>14</sup> = 16384 và 64 kB = 2<sup>16</sup> byte thì phần số học của chương này là miễn phí.</li>
</ul>
<p class="meo">💡 Mở tờ công thức ngay ở slide 1, đúng ba dòng: <code>w = log<sub>2</sub>(kích thước khối tính theo byte)</code>, <code>r = log<sub>2</sub>(số dòng cache)</code>, <code>tag = tổng số bit địa chỉ − w − r</code>. Ba dòng đó gánh phần lớn số điểm mà chương này có thể mang lại.</p>`],

      [2, 'Figure 5.1 — Cache and Main Memory (single cache, and three-level cache organization)',
        `<p class="y-chinh">🎯 Two pictures, one idea: the cache sits <strong>between</strong> the CPU and main memory, and the two sides of it move data in <strong>different units</strong> — the CPU side moves a <em>word</em>, the memory side moves a <em>block</em>.</p>
<table>
<tr><th>Part of the figure</th><th>What it shows</th><th>Why it is drawn that way</th></tr>
<tr><td><strong>(a) Single cache</strong></td><td>CPU ↔ Cache labelled <em>Word Transfer</em> and <em>Fast</em>; Cache ↔ Main Memory labelled <em>Block Transfer</em> and <em>Slow</em></td><td>The whole trick of caching in one drawing: pay the slow trip once, then serve many fast words out of what you fetched</td></tr>
<tr><td><strong>(b) Three-level cache</strong></td><td>CPU → L1 → L2 → L3 → Main Memory, labelled <em>Fastest · Fast · Less fast · Slow</em></td><td>Each level is bigger and slower than the one before it; the same principle simply repeats</td></tr>
</table>
<ul>
<li><strong>Word in, block out — remember this asymmetry.</strong> The processor asks for one word (say 4 bytes). On a miss, the cache does not fetch 4 bytes; it fetches the whole block containing them (say 64 bytes). That is spatial locality being spent deliberately: the extra bytes are a bet that you will ask for them next.</li>
<li><strong>Why the arrows are bidirectional.</strong> Data flows both ways at every level, because writes must eventually reach main memory. <em>How</em> and <em>when</em> they do is the write policy — write through versus write back, slides 27–29.</li>
<li><strong>The three-level picture is the modern reality.</strong> Table 5.2 on slide 11 shows the progression: single L1 in the 1980s, L1+L2 by the mid-1990s, L1+L2+L3 from the Pentium 4 era, and on IBM mainframes even an L4.</li>
<li><strong>Each level obeys the same rule.</strong> There is nothing special about L1 versus L2: both are caches, both have lines, tags and a mapping function, both have a hit rate. The only differences are size, speed and who they serve.</li>
<li><strong>Connect to Chapter 4's formula.</strong> Average access time for two levels is <code>T = T<sub>1</sub> + (1 − H) × T<sub>2</sub></code>: you always pay the fast level's time, and you pay the slow level's time only on a miss. For three levels the same formula nests once more.</li>
</ul>
<p class="pitfall">⚠️ Trap: reading part (b) as "the CPU searches L1, L2 and L3 at the same time". It does not. It asks L1; only on an L1 miss does the request go to L2, and so on. That serial chain is why a miss at every level costs the sum of the levels, not the maximum.</p>`,
        `<p class="y-chinh">🎯 Hai bức hình, một ý: cache nằm <strong>GIỮA</strong> CPU và bộ nhớ chính, và hai phía của nó chuyển dữ liệu theo <strong>ĐƠN VỊ KHÁC NHAU</strong> — phía CPU chuyển một <em>từ</em> (word), phía bộ nhớ chuyển một <em>khối</em> (block).</p>
<table>
<tr><th>Phần của hình</th><th>Nó vẽ gì</th><th>Vì sao vẽ như vậy</th></tr>
<tr><td><strong>(a) Cache đơn</strong></td><td>CPU ↔ Cache ghi <em>Word Transfer</em> và <em>Fast</em>; Cache ↔ Main Memory ghi <em>Block Transfer</em> và <em>Slow</em></td><td>Toàn bộ mẹo của cache gói trong một hình: trả tiền cho chuyến đi chậm MỘT lần, rồi phục vụ nhiều từ nhanh từ thứ vừa lấy về</td></tr>
<tr><td><strong>(b) Cache ba cấp</strong></td><td>CPU → L1 → L2 → L3 → Bộ nhớ chính, ghi <em>Fastest · Fast · Less fast · Slow</em></td><td>Mỗi cấp to hơn và chậm hơn cấp trước; cùng một nguyên lý chỉ việc lặp lại</td></tr>
</table>
<ul>
<li><strong>Vào bằng TỪ, ra bằng KHỐI — nhớ sự bất đối xứng này.</strong> Bộ xử lý hỏi một từ (giả sử 4 byte). Khi trượt, cache KHÔNG nạp 4 byte; nó nạp nguyên khối chứa 4 byte đó (giả sử 64 byte). Đó là tính cục bộ không gian đang được TIÊU một cách cố ý: mấy chục byte thừa là một ván cược rằng ngay sau đây bạn sẽ hỏi tới chúng.</li>
<li><strong>Vì sao mũi tên hai chiều.</strong> Dữ liệu chảy cả hai chiều ở mọi cấp, vì thao tác ghi rốt cuộc phải xuống tới bộ nhớ chính. <em>Xuống bằng cách nào</em> và <em>xuống lúc nào</em> chính là chính sách ghi — write through so với write back, slide 27–29.</li>
<li><strong>Hình ba cấp là hiện thực ngày nay.</strong> Bảng 5.2 ở slide 11 cho thấy đường đi: chỉ L1 những năm 1980, L1+L2 giữa thập niên 1990, L1+L2+L3 từ thời Pentium 4, và trên máy lớn IBM còn có cả L4.</li>
<li><strong>Mọi cấp đều theo cùng một luật.</strong> L1 chẳng có gì đặc biệt hơn L2: cả hai đều là cache, đều có dòng, có tag, có hàm ánh xạ, đều có tỉ lệ trúng. Khác nhau chỉ ở kích thước, tốc độ và phục vụ ai.</li>
<li><strong>Nối với công thức Chương 4.</strong> Thời gian truy cập trung bình hai cấp là <code>T = T<sub>1</sub> + (1 − H) × T<sub>2</sub></code>: bạn LUÔN trả thời gian của tầng nhanh, và chỉ trả thêm thời gian tầng chậm KHI TRƯỢT. Ba cấp thì công thức đó lồng thêm một lần nữa.</li>
</ul>
<p class="pitfall">⚠️ Bẫy: đọc phần (b) thành "CPU tìm L1, L2 và L3 cùng lúc". KHÔNG. Nó hỏi L1; chỉ khi L1 trượt thì yêu cầu mới đi xuống L2, rồi cứ thế. Chính chuỗi NỐI TIẾP đó làm cho một lần trượt hết mọi cấp tốn bằng TỔNG các cấp, chứ không phải bằng cấp lớn nhất.</p>`],

      [3, 'Cache Memory Principles — Block, Frame, Line, Tag, Line size',
        `<p class="y-chinh">🎯 Five words, and the rest of the chapter is unreadable without them. Learn them as a pair of pairs: <strong>block ↔ line</strong> (the data and the place it sits), <strong>frame</strong> (the place in main memory), and <strong>tag</strong> (the label that says <em>which</em> block is currently in this line).</p>
<table>
<tr><th>Term</th><th>The slide's own definition</th><th>Say it in your own words</th></tr>
<tr><td><strong>Block</strong></td><td>The minimum unit of transfer between cache and main memory</td><td>The parcel. Nothing smaller ever crosses that boundary</td></tr>
<tr><td><strong>Frame</strong></td><td>To distinguish between the data transferred and the chunk of physical memory, the term frame, or block frame, is sometimes used with reference to caches</td><td>The shelf in main memory that a block occupies</td></tr>
<tr><td><strong>Line</strong></td><td>A portion of cache memory capable of holding one block, so-called because it is usually drawn as a horizontal object</td><td>The shelf in the cache. Named after how it looks in the diagram</td></tr>
<tr><td><strong>Tag</strong></td><td>A portion of a cache line that is used for addressing purposes</td><td>The label on the shelf saying which block is on it right now</td></tr>
<tr><td><strong>Line size</strong></td><td>The number of data bytes, or block size, contained in a line</td><td>How big the parcel is. This number sets the Word/Offset field width</td></tr>
</table>
<ul>
<li><strong>Block and line are the same size but not the same thing.</strong> A block is <em>content</em>; a line is <em>container</em>. Main memory has 2<sup>n</sup>/K blocks, the cache has C lines, and C is far smaller — that inequality is the entire reason a mapping function has to exist.</li>
<li><strong>Why the tag is unavoidable.</strong> A cache line can hold any one of many different blocks over its lifetime. Without a tag, the hardware would know <em>that</em> the line holds data but not <em>whose</em> data. The tag is the part of the address that the line number alone cannot recover.</li>
<li><strong>Line size is a design knob, not a fact of nature.</strong> Slide 31 is devoted to it. Bigger lines exploit spatial locality harder but waste bandwidth when locality is weak, and — critically — a fixed cache capacity divided by a bigger line means <em>fewer lines</em>, hence more blocks competing for each one.</li>
<li><strong>Cache capacity has two meanings; keep them apart.</strong> The <em>data</em> capacity is lines × line size. The <em>silicon</em> cost also includes every tag and valid bit. When a question says "a 64 kB cache", it means 64 kB of data; tags are extra.</li>
<li><strong>Where these words come back.</strong> "Block" is what the write-allocate policy fetches (slide 29); "line" is what a replacement algorithm evicts (slides 25–26); "tag" is what the comparator on slide 14 compares; "line size" is what sets <code>w</code> in every address split you will do.</li>
</ul>
<p class="meo">💡 One-line mnemonic: <em>a <strong>block</strong> of data lives in a <strong>frame</strong> of memory and visits a <strong>line</strong> of cache, wearing a <strong>tag</strong> so we know who it is.</em></p>`,
        `<p class="y-chinh">🎯 Năm từ, và thiếu chúng thì phần còn lại của chương không đọc nổi. Học theo cặp: <strong>block ↔ line</strong> (dữ liệu và chỗ nó nằm), <strong>frame</strong> (chỗ nó nằm trong bộ nhớ chính), và <strong>tag</strong> (cái nhãn nói dòng này ĐANG chứa khối NÀO).</p>
<table>
<tr><th>Thuật ngữ</th><th>Nguyên văn định nghĩa của slide</th><th>Nói bằng lời của bạn</th></tr>
<tr><td><strong>Block</strong> (khối)</td><td>Đơn vị chuyển NHỎ NHẤT giữa cache và bộ nhớ chính</td><td>Kiện hàng. Không có gì nhỏ hơn đi qua ranh giới đó</td></tr>
<tr><td><strong>Frame</strong> (khung)</td><td>Để phân biệt DỮ LIỆU được chuyển với MẢNH BỘ NHỚ VẬT LÝ, đôi khi người ta dùng chữ frame, hay block frame, khi nói về cache</td><td>Cái kệ TRONG BỘ NHỚ CHÍNH mà một khối chiếm chỗ</td></tr>
<tr><td><strong>Line</strong> (dòng)</td><td>Một phần bộ nhớ cache đủ chứa MỘT khối, gọi vậy vì nó thường được vẽ thành một vật nằm ngang</td><td>Cái kệ TRONG CACHE. Tên gọi đến từ hình vẽ</td></tr>
<tr><td><strong>Tag</strong> (thẻ)</td><td>Một phần của dòng cache dùng cho mục đích ĐỊA CHỈ HOÁ</td><td>Cái nhãn dán trên kệ, nói ngay lúc này kệ đang giữ khối nào</td></tr>
<tr><td><strong>Line size</strong></td><td>Số byte dữ liệu, tức kích thước khối, chứa trong một dòng</td><td>Kiện hàng to bao nhiêu. Chính con số này đặt độ rộng trường Word/Offset</td></tr>
</table>
<ul>
<li><strong>Khối và dòng BẰNG NHAU về kích thước nhưng KHÔNG phải một thứ.</strong> Khối là <em>NỘI DUNG</em>; dòng là <em>VẬT CHỨA</em>. Bộ nhớ chính có 2<sup>n</sup>/K khối, cache có C dòng, và C nhỏ hơn rất nhiều — chính bất đẳng thức đó là toàn bộ lý do bắt buộc phải có hàm ánh xạ.</li>
<li><strong>Vì sao không thể thiếu tag.</strong> Suốt đời mình, một dòng cache có thể lần lượt giữ nhiều khối khác nhau. Không có tag thì phần cứng biết dòng đó CÓ dữ liệu nhưng không biết là dữ liệu CỦA AI. Tag chính là phần địa chỉ mà riêng số hiệu dòng không khôi phục lại được.</li>
<li><strong>Kích thước dòng là một cái NÚM thiết kế, không phải hằng số của tự nhiên.</strong> Slide 31 dành riêng cho nó. Dòng to thì khai thác tính cục bộ không gian mạnh hơn nhưng phí băng thông khi tính cục bộ yếu, và — điểm chí mạng — cùng một dung lượng cache chia cho dòng to hơn nghĩa là <em>ÍT DÒNG HƠN</em>, tức nhiều khối tranh nhau mỗi dòng hơn.</li>
<li><strong>"Dung lượng cache" có hai nghĩa, phải tách bạch.</strong> Dung lượng <em>DỮ LIỆU</em> = số dòng × kích thước dòng. Chi phí <em>SILICON</em> còn cộng thêm mọi tag và bit hợp lệ. Khi đề nói "cache 64 kB" thì đó là 64 kB dữ liệu; tag tính riêng.</li>
<li><strong>Mấy từ này quay lại ở đâu.</strong> "Block" là thứ chính sách write-allocate nạp về (slide 29); "line" là thứ thuật toán thay thế đuổi đi (slide 25–26); "tag" là thứ bộ so sánh ở slide 14 đem đi so; "line size" là thứ đặt ra <code>w</code> trong mọi phép chia địa chỉ bạn sẽ làm.</li>
</ul>
<p class="meo">💡 Một câu để nhớ: <em>một <strong>khối</strong> dữ liệu sống trong một <strong>khung</strong> của bộ nhớ và ghé thăm một <strong>dòng</strong> của cache, đeo một <strong>thẻ</strong> để ta biết nó là ai.</em></p>`],

      [4, 'Figure 5.2 — Cache/Main Memory Structure',
        `<p class="y-chinh">🎯 The two-column picture that every address-splitting exercise secretly refers to. On the left: a cache of <strong>C lines</strong>, numbered 0 … C−1, each line being <em>Tag + Block</em>, with block length <strong>K words</strong>. On the right: main memory as <strong>2<sup>n</sup> addressable words</strong>, cut into blocks of K words each, numbered Block 0 … Block M−1.</p>
<table>
<tr><th>Symbol on the figure</th><th>Meaning</th><th>Relationship</th></tr>
<tr><td><strong>n</strong></td><td>Number of address bits</td><td>Main memory holds 2<sup>n</sup> addressable units, addresses 0 … 2<sup>n</sup>−1</td></tr>
<tr><td><strong>K</strong></td><td>Block length, in words</td><td>Sets the Word/Offset field: <code>w = log<sub>2</sub>K</code></td></tr>
<tr><td><strong>M</strong></td><td>Number of blocks in main memory</td><td><code>M = 2<sup>n</sup> / K</code></td></tr>
<tr><td><strong>C</strong></td><td>Number of lines in the cache</td><td><code>C &lt;&lt; M</code> — that is the whole problem</td></tr>
</table>
<ul>
<li><strong>Read the inequality, not the boxes.</strong> The figure's real content is <code>C</code> being tiny next to <code>M</code>. In the Figure 5.8 example on slide 15, C = 16 384 lines and M = 4 194 304 blocks — <strong>256 blocks compete for every single line</strong>. That ratio is exactly 2<sup>tag bits</sup>, and it is where the tag comes from.</li>
<li><strong>Note that only the cache side has a Tag column.</strong> Main memory needs no tag: an address <em>is</em> the identity there. The cache needs one precisely because its line number is a compressed, lossy version of the address.</li>
<li><strong>"Block 0 (K words)" is drawn as rows 0,1,2,3</strong> — i.e. K = 4 in the drawing. Those four consecutive addresses always travel together; you can never fetch just one of them into the cache.</li>
<li><strong>Consequence you will be examined on.</strong> Because blocks are aligned, the block containing address A starts at <code>A − (A mod K)</code>. That is why the offset field is simply the low bits of the address, and why clearing those bits gives the block's base address.</li>
<li><strong>Why bigger blocks eventually hurt.</strong> Fix the data capacity. Doubling K halves C. Each extra byte you pull in is a bet on spatial locality, but halving C doubles the number of blocks fighting over each line. Beyond some point the second effect wins and the hit ratio falls — that is the hump-shaped curve discussed on slide 31.</li>
</ul>
<p class="pitfall">⚠️ Careful with the word "word". Stallings draws memory in <em>words</em>, but every exam question gives block size in <strong>bytes</strong> and addresses that are byte addresses. Always convert to bytes first: <code>w = log<sub>2</sub>(block size in BYTES)</code>. Mixing the two units is the single most common way to lose these marks.</p>`,
        `<p class="y-chinh">🎯 Bức hình hai cột mà mọi bài chia địa chỉ đều ngầm quy chiếu về. Bên trái: một cache gồm <strong>C dòng</strong>, đánh số 0 … C−1, mỗi dòng là <em>Tag + Block</em>, chiều dài khối <strong>K từ</strong>. Bên phải: bộ nhớ chính gồm <strong>2<sup>n</sup> đơn vị địa chỉ hoá được</strong>, cắt thành các khối K từ, đánh số Block 0 … Block M−1.</p>
<table>
<tr><th>Ký hiệu trên hình</th><th>Nghĩa</th><th>Quan hệ</th></tr>
<tr><td><strong>n</strong></td><td>Số bit địa chỉ</td><td>Bộ nhớ chính có 2<sup>n</sup> đơn vị, địa chỉ 0 … 2<sup>n</sup>−1</td></tr>
<tr><td><strong>K</strong></td><td>Chiều dài khối, tính theo từ</td><td>Đặt ra trường Word/Offset: <code>w = log<sub>2</sub>K</code></td></tr>
<tr><td><strong>M</strong></td><td>Số khối trong bộ nhớ chính</td><td><code>M = 2<sup>n</sup> / K</code></td></tr>
<tr><td><strong>C</strong></td><td>Số dòng trong cache</td><td><code>C &lt;&lt; M</code> — đó chính là toàn bộ bài toán</td></tr>
</table>
<ul>
<li><strong>Hãy đọc BẤT ĐẲNG THỨC, đừng đọc mấy cái hộp.</strong> Nội dung thật của hình là <code>C</code> bé tí bên cạnh <code>M</code>. Trong ví dụ Figure 5.8 ở slide 15, C = 16 384 dòng còn M = 4 194 304 khối — <strong>256 khối tranh nhau MỖI một dòng</strong>. Tỉ số đó đúng bằng 2<sup>số bit tag</sup>, và đó là nơi cái tag sinh ra.</li>
<li><strong>Để ý chỉ phía cache mới có cột Tag.</strong> Bộ nhớ chính không cần tag: ở đó địa chỉ CHÍNH LÀ căn cước. Cache cần tag đúng vì số hiệu dòng của nó là một bản nén, có mất mát, của địa chỉ.</li>
<li><strong>"Block 0 (K words)" được vẽ thành hàng 0,1,2,3</strong> — tức K = 4 trong hình. Bốn địa chỉ liên tiếp đó luôn đi cùng nhau; không bao giờ nạp riêng lẻ một cái vào cache được.</li>
<li><strong>Hệ quả sẽ bị hỏi trong đề.</strong> Vì khối được CĂN LỀ, khối chứa địa chỉ A bắt đầu ở <code>A − (A mod K)</code>. Đó là lý do trường offset chỉ đơn giản là mấy bit thấp của địa chỉ, và xoá mấy bit đó đi thì được địa chỉ đầu khối.</li>
<li><strong>Vì sao khối to quá lại phản tác dụng.</strong> Cố định dung lượng dữ liệu. Nhân đôi K là chia đôi C. Mỗi byte thừa kéo về là một ván cược vào tính cục bộ không gian, nhưng chia đôi C thì nhân đôi số khối giành nhau mỗi dòng. Qua một điểm nào đó tác động thứ hai thắng và tỉ lệ trúng TỤT — đó là đường cong hình bướu bàn ở slide 31.</li>
</ul>
<p class="pitfall">⚠️ Cẩn thận với chữ "word" (từ). Stallings vẽ bộ nhớ theo <em>từ</em>, nhưng mọi câu hỏi thi đều cho kích thước khối theo <strong>BYTE</strong> và địa chỉ là địa chỉ byte. Luôn đổi về byte trước: <code>w = log<sub>2</sub>(kích thước khối theo BYTE)</code>. Trộn lẫn hai đơn vị là cách phổ biến nhất để mất điểm dạng bài này.</p>`],

      [5, 'Figure 5.3 — Cache Read Operation',
        `<p class="y-chinh">🎯 The flowchart that defines "hit" and "miss" operationally. Ten boxes, one decision, and the crucial detail hiding at the bottom: on a miss the two follow-up actions run <strong>in parallel</strong>, not one after the other.</p>
<table>
<tr><th>Step on the flowchart</th><th>What happens</th></tr>
<tr><td>START → <strong>Receive address RA from CPU</strong></td><td>RA = "read address", the address the processor wants</td></tr>
<tr><td><strong>Is block containing RA in cache?</strong></td><td>The only decision diamond. Answering it is the mapping function's job</td></tr>
<tr><td><em>Yes</em> → <strong>Fetch RA word and deliver to CPU</strong> → DONE</td><td>This is a <strong>hit</strong>. Short path, few cycles</td></tr>
<tr><td><em>No</em> → <strong>Access main memory for block containing RA</strong></td><td>This is a <strong>miss</strong>. The slow trip begins</td></tr>
<tr><td>→ <strong>Allocate cache line for main memory block</strong></td><td>Choose which line the block will occupy — trivially forced in direct mapping, a real decision otherwise (slides 25–26)</td></tr>
<tr><td>→ splits into <strong>Load main memory block into cache line</strong> <em>and</em> <strong>Deliver RA word to CPU</strong></td><td>Both branches then join at DONE</td></tr>
</table>
<ul>
<li><strong>The parallel split is the point of the figure.</strong> The processor does not wait for the whole block to land before receiving its word. Hardware delivers the requested word as soon as it arrives and finishes filling the line behind the scenes. In the literature this is <em>early restart</em> / <em>critical word first</em> — and Table 5.7 on slide 42 lists "Critical Word First" as a performance technique for exactly this reason.</li>
<li><strong>"Allocate cache line" is where the three mappings differ.</strong> Direct mapping: no choice, the line number is computed from the address. Fully associative: any line, so a replacement algorithm must pick. Set associative: any line within one set. That is the whole taxonomy of slides 12–24 compressed into one box.</li>
<li><strong>Everything on this chart is done by hardware.</strong> No instruction triggers it, no operating system is involved, no program can observe it except through timing. That is what "the cache is transparent to the programmer" means — and why cache effects feel like mysterious slowdowns rather than errors.</li>
<li><strong>The chart is for READS only.</strong> Writes are harder, because a write makes the cache copy and the memory copy disagree. That is why there is a separate section (slides 27–29) for write through, write back, write allocate and no write allocate.</li>
<li><strong>Cost accounting.</strong> If the hit path costs T<sub>1</sub> and the miss path costs T<sub>1</sub> + T<sub>2</sub>, then average time = T<sub>1</sub> + (1 − H) × T<sub>2</sub>. Read the chart once with that formula in hand and the formula stops being something to memorise.</li>
</ul>
<p class="meo">💡 Draw this flowchart from memory in about 30 seconds: <em>address in → in cache? → yes: give the word · no: fetch the block, pick a line, and give the word while filling</em>. If you can draw it, you can answer every "describe the cache read operation" question.</p>`,
        `<p class="y-chinh">🎯 Lưu đồ định nghĩa "trúng" và "trượt" bằng thao tác. Mười ô, một chỗ rẽ, và chi tiết mấu chốt nấp ở dưới cùng: khi trượt, hai việc tiếp theo chạy <strong>SONG SONG</strong>, không phải cái này xong mới tới cái kia.</p>
<table>
<tr><th>Bước trên lưu đồ</th><th>Chuyện gì xảy ra</th></tr>
<tr><td>START → <strong>Receive address RA from CPU</strong></td><td>RA = "read address", địa chỉ mà bộ xử lý muốn đọc</td></tr>
<tr><td><strong>Is block containing RA in cache?</strong></td><td>Ô rẽ DUY NHẤT. Trả lời được câu đó là việc của hàm ánh xạ</td></tr>
<tr><td><em>Yes</em> → <strong>Fetch RA word and deliver to CPU</strong> → DONE</td><td>Đây là TRÚNG (hit). Đường ngắn, vài chu kỳ</td></tr>
<tr><td><em>No</em> → <strong>Access main memory for block containing RA</strong></td><td>Đây là TRƯỢT (miss). Chuyến đi chậm bắt đầu</td></tr>
<tr><td>→ <strong>Allocate cache line for main memory block</strong></td><td>Chọn dòng nào sẽ chứa khối — ánh xạ trực tiếp thì bị ép sẵn, còn lại là một quyết định thật (slide 25–26)</td></tr>
<tr><td>→ tách thành <strong>Load main memory block into cache line</strong> <em>và</em> <strong>Deliver RA word to CPU</strong></td><td>Hai nhánh rồi gặp lại nhau ở DONE</td></tr>
</table>
<ul>
<li><strong>Chỗ tách song song mới là điểm của cả hình.</strong> Bộ xử lý KHÔNG chờ nguyên khối về rồi mới nhận từ của mình. Phần cứng giao từ được yêu cầu ngay khi nó tới, rồi lấp nốt dòng ở phía sau. Trong tài liệu chuyện này gọi là <em>early restart</em> / <em>critical word first</em> — và Bảng 5.7 ở slide 42 liệt kê "Critical Word First" như một kỹ thuật tăng hiệu năng đúng vì lẽ đó.</li>
<li><strong>"Allocate cache line" là nơi ba kiểu ánh xạ khác nhau.</strong> Ánh xạ trực tiếp: không có lựa chọn, số dòng tính thẳng từ địa chỉ. Kết hợp toàn phần: dòng nào cũng được, nên phải có thuật toán thay thế đứng ra chọn. Kết hợp theo tập: dòng nào cũng được nhưng TRONG MỘT TẬP. Đó là toàn bộ phân loại của slide 12–24 nén vào một cái ô.</li>
<li><strong>Mọi thứ trên lưu đồ này do PHẦN CỨNG làm.</strong> Không lệnh nào kích hoạt nó, không hệ điều hành nào tham gia, không chương trình nào quan sát được nó trừ qua thời gian chạy. Đó là ý nghĩa của câu "cache trong suốt với lập trình viên" — và cũng là vì sao hiệu ứng cache hiện ra như những cú chậm bí ẩn chứ không phải như lỗi.</li>
<li><strong>Lưu đồ này CHỈ cho việc ĐỌC.</strong> Việc ghi khó hơn, vì ghi làm bản trong cache và bản trong bộ nhớ lệch nhau. Đó là lý do có hẳn một mục riêng (slide 27–29) cho write through, write back, write allocate và no write allocate.</li>
<li><strong>Tính tiền.</strong> Nếu đường trúng tốn T<sub>1</sub> còn đường trượt tốn T<sub>1</sub> + T<sub>2</sub>, thì thời gian trung bình = T<sub>1</sub> + (1 − H) × T<sub>2</sub>. Đọc lưu đồ một lượt với công thức đó trong tay là công thức thôi làm phiền bạn phải học thuộc.</li>
</ul>
<p class="meo">💡 Vẽ lại lưu đồ này từ trí nhớ trong chừng 30 giây: <em>địa chỉ vào → có trong cache không? → có: đưa từ · không: nạp khối, chọn dòng, và vừa lấp vừa đưa từ</em>. Vẽ được là trả lời được mọi câu "mô tả thao tác đọc cache".</p>`],
      [6, 'Figure 5.4 — Typical Cache Organization (how the cache is wired to the system bus)',
        `<p class="y-chinh">🎯 The wiring diagram. The cache is not just a box of fast RAM: it is a device that sits on the <strong>address, data and control</strong> paths and can hold the processor's request while it talks to the system bus on its own.</p>
<table>
<tr><th>Element in the figure</th><th>What it does</th></tr>
<tr><td><strong>Processor → Address</strong>, going both to the cache and to the <strong>Address buffer</strong></td><td>Every address is offered to the cache <em>and</em> is ready to go out on the bus if the cache misses</td></tr>
<tr><td><strong>Control ↔ Cache ↔ Control</strong></td><td>Two control links: one to the processor (hit/wait), one to the system bus (read/write a block)</td></tr>
<tr><td><strong>Data ↔ Cache</strong> and <strong>Data buffer</strong></td><td>Data reaches the processor either from the cache or, via the buffer, from the bus</td></tr>
<tr><td><strong>Address buffer / Data buffer</strong> (tri-state drivers on the bus side)</td><td>They isolate the cache from the bus so the processor's local activity does not tie up the bus, and the bus's activity does not stall the cache</td></tr>
<tr><td><strong>System Bus</strong> (the thick vertical bar)</td><td>Shared by main memory and I/O modules — the reason cache coherency (slide 30) becomes a problem</td></tr>
</table>
<ul>
<li><strong>This is a "look-through" organization.</strong> The processor's address is presented to the cache first; the bus is used only when the cache cannot answer. Contrast with a "look-aside" cache, which would put the cache directly on the bus in parallel with memory.</li>
<li><strong>Why buffers rather than plain wires.</strong> Buffers are tri-state drivers: they let the cache <em>disconnect</em> from the bus. Without them, every processor access would drive the bus lines, blocking other bus masters (DMA controllers, other processors) for no reason.</li>
<li><strong>Read this figure together with Chapter 3.</strong> That is where the system bus, bus arbitration and bus masters were defined. Figure 5.4 is simply a cache dropped into the Chapter 3 picture — and slide 30's coherency problem is the direct consequence of sharing that bus.</li>
<li><strong>Note what the figure implies about timing.</strong> Because the address goes to cache and address buffer simultaneously, the bus transaction can start the instant the cache declares a miss — no extra cycle to re-present the address. That parallelism is a real design decision, not an artist's convenience.</li>
<li><strong>Connect to slide 40's timing model.</strong> The hit path in Figure 5.4 is processor → cache → processor; the miss path is processor → cache → bus → memory → buffer → cache → processor. Count the boxes and you have intuitively derived why a miss costs an order of magnitude more.</li>
</ul>
<p class="pitfall">⚠️ Do not say "the cache is part of main memory". It is a separate, faster memory whose contents are <em>copies</em> of parts of main memory. Main memory's address space is unchanged by adding a cache — which is precisely what makes the cache transparent.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ đấu dây. Cache không chỉ là một hộp RAM nhanh: nó là một thiết bị nằm trên đường <strong>địa chỉ, dữ liệu và điều khiển</strong>, và có thể tự mình nói chuyện với bus hệ thống trong khi giữ yêu cầu của bộ xử lý.</p>
<table>
<tr><th>Thành phần trong hình</th><th>Nó làm gì</th></tr>
<tr><td><strong>Processor → Address</strong>, đi ĐỒNG THỜI vào cache và vào <strong>Address buffer</strong></td><td>Mọi địa chỉ vừa được đưa cho cache, vừa sẵn sàng ra bus nếu cache trượt</td></tr>
<tr><td><strong>Control ↔ Cache ↔ Control</strong></td><td>Hai đường điều khiển: một về bộ xử lý (trúng/chờ), một ra bus hệ thống (đọc/ghi một khối)</td></tr>
<tr><td><strong>Data ↔ Cache</strong> và <strong>Data buffer</strong></td><td>Dữ liệu tới bộ xử lý hoặc từ cache, hoặc từ bus qua bộ đệm</td></tr>
<tr><td><strong>Address buffer / Data buffer</strong> (bộ đệm ba trạng thái phía bus)</td><td>Chúng CÁCH LY cache khỏi bus, để hoạt động cục bộ của bộ xử lý không chiếm bus, và hoạt động trên bus không làm nghẽn cache</td></tr>
<tr><td><strong>System Bus</strong> (thanh dọc đậm)</td><td>Dùng chung với bộ nhớ chính và các mô-đun I/O — chính là lý do bài toán nhất quán cache (slide 30) sinh ra</td></tr>
</table>
<ul>
<li><strong>Đây là tổ chức "look-through".</strong> Địa chỉ của bộ xử lý được đưa cho cache TRƯỚC; bus chỉ được dùng khi cache không trả lời nổi. Trái với cache "look-aside" — cắm thẳng lên bus song song với bộ nhớ.</li>
<li><strong>Vì sao phải có bộ đệm chứ không phải dây trần.</strong> Bộ đệm là bộ lái ba trạng thái: chúng cho phép cache NGẮT KẾT NỐI khỏi bus. Không có chúng thì mỗi lần bộ xử lý truy cập là lại lái các đường bus, chặn các bus master khác (bộ điều khiển DMA, các bộ xử lý khác) một cách vô cớ.</li>
<li><strong>Đọc hình này cùng với Chương 3.</strong> Bus hệ thống, phân xử bus và bus master được định nghĩa ở đó. Figure 5.4 chỉ là một cái cache thả vào bức tranh Chương 3 — và bài toán nhất quán ở slide 30 là hệ quả trực tiếp của việc dùng chung bus đó.</li>
<li><strong>Để ý hình này ngụ ý gì về thời gian.</strong> Vì địa chỉ đi vào cache và vào address buffer CÙNG LÚC, giao dịch bus có thể khởi động ngay khoảnh khắc cache tuyên bố trượt — không tốn thêm một chu kỳ để đưa lại địa chỉ. Sự song song đó là một quyết định thiết kế thật, không phải nét vẽ cho đẹp.</li>
<li><strong>Nối với mô hình thời gian ở slide 40.</strong> Đường trúng trong Figure 5.4 là bộ xử lý → cache → bộ xử lý; đường trượt là bộ xử lý → cache → bus → bộ nhớ → bộ đệm → cache → bộ xử lý. Đếm số ô là bạn đã tự suy ra bằng trực giác vì sao một lần trượt đắt hơn cả bậc độ lớn.</li>
</ul>
<p class="pitfall">⚠️ Đừng nói "cache là một phần của bộ nhớ chính". Nó là một bộ nhớ RIÊNG, nhanh hơn, mà nội dung là BẢN SAO của vài phần bộ nhớ chính. Thêm cache KHÔNG làm đổi không gian địa chỉ của bộ nhớ chính — và chính điều đó làm cache trong suốt.</p>`],

      [7, 'Table 5.1 — Elements of Cache Design (the seven design knobs)',
        `<p class="y-chinh">🎯 The map of the rest of the chapter. Seven headings; every remaining slide of Chapter 5 belongs under exactly one of them. If an exam asks you to "list the elements of cache design", this table <em>is</em> the answer.</p>
<table>
<tr><th>#</th><th>Element</th><th>Options listed on the slide</th><th>Where it is taught</th></tr>
<tr><td>1</td><td><strong>Cache Addresses</strong></td><td>Logical · Physical</td><td>Slides 8–9</td></tr>
<tr><td>2</td><td><strong>Cache Size</strong></td><td>(no sub-options — it is a number)</td><td>Slides 10–11</td></tr>
<tr><td>3</td><td><strong>Mapping Function</strong></td><td>Direct · Associative · Set associative</td><td>Slides 12–24</td></tr>
<tr><td>4</td><td><strong>Replacement Algorithm</strong></td><td>Least recently used (LRU) · First in first out (FIFO) · Least frequently used (LFU) · Random</td><td>Slides 25–26</td></tr>
<tr><td>5</td><td><strong>Write Policy</strong></td><td>Write through · Write back</td><td>Slides 27–29</td></tr>
<tr><td>6</td><td><strong>Line Size</strong></td><td>(a number again)</td><td>Slide 31</td></tr>
<tr><td>7</td><td><strong>Number of Caches</strong></td><td>Single or two level · Unified or split</td><td>Slides 32–35</td></tr>
</table>
<ul>
<li><strong>The seven are not independent.</strong> Choosing direct mapping (3) makes the replacement algorithm (4) vanish — there is nothing to choose. Choosing a bigger line (6) with a fixed size (2) reduces the number of lines and so worsens conflicts under direct mapping (3). A good answer in an exam names at least one such interaction.</li>
<li><strong>Two of the seven are plain numbers; five are policies.</strong> Cache size and line size are quantities you tune; the rest are structural decisions that change the hardware. That is why a question about size gets an answer with a trade-off curve, while a question about mapping gets an answer with a diagram.</li>
<li><strong>Element 3 carries the most exam weight by a wide margin.</strong> Thirteen of the chapter's slides (12–24) are about mapping, and the address-splitting arithmetic lives entirely there. Budget your study time in the same proportion.</li>
<li><strong>Element 4 exists <em>because</em> of element 3.</strong> Replacement is only a question when the mapping leaves a choice of line. Slide 25 says this explicitly: "For direct mapping there is only one possible line for any particular block and no choice is possible."</li>
<li><strong>Element 7 is why modern chips list "32 kB/32 kB" in spec sheets.</strong> A split cache is one for instructions and one for data at the same level; Table 5.2 on the next slide writes them with a slash.</li>
</ul>
<p class="meo">💡 Mnemonic in order — <strong>A·S·M·R·W·L·N</strong>: <em>Addresses, Size, Mapping, Replacement, Write policy, Line size, Number of caches</em>. Seven letters, seven marks.</p>`,
        `<p class="y-chinh">🎯 Tấm bản đồ của phần còn lại của chương. Bảy đầu mục; mọi slide còn lại của Chương 5 đều thuộc đúng MỘT trong bảy. Nếu đề bảo "kể các yếu tố thiết kế cache", bảng này CHÍNH LÀ đáp án.</p>
<table>
<tr><th>#</th><th>Yếu tố</th><th>Lựa chọn slide liệt kê</th><th>Dạy ở đâu</th></tr>
<tr><td>1</td><td><strong>Cache Addresses</strong> (địa chỉ cache)</td><td>Logical (logic) · Physical (vật lý)</td><td>Slide 8–9</td></tr>
<tr><td>2</td><td><strong>Cache Size</strong> (kích thước cache)</td><td>(không có lựa chọn con — nó là một con số)</td><td>Slide 10–11</td></tr>
<tr><td>3</td><td><strong>Mapping Function</strong> (hàm ánh xạ)</td><td>Direct (trực tiếp) · Associative (kết hợp) · Set associative (kết hợp theo tập)</td><td>Slide 12–24</td></tr>
<tr><td>4</td><td><strong>Replacement Algorithm</strong> (thuật toán thay thế)</td><td>LRU · FIFO · LFU · Random</td><td>Slide 25–26</td></tr>
<tr><td>5</td><td><strong>Write Policy</strong> (chính sách ghi)</td><td>Write through · Write back</td><td>Slide 27–29</td></tr>
<tr><td>6</td><td><strong>Line Size</strong> (kích thước dòng)</td><td>(lại là một con số)</td><td>Slide 31</td></tr>
<tr><td>7</td><td><strong>Number of Caches</strong> (số lượng cache)</td><td>Một cấp hay hai cấp · Hợp nhất hay tách</td><td>Slide 32–35</td></tr>
</table>
<ul>
<li><strong>Bảy yếu tố KHÔNG độc lập với nhau.</strong> Chọn ánh xạ trực tiếp (3) thì thuật toán thay thế (4) BIẾN MẤT — chẳng còn gì để chọn. Chọn dòng to hơn (6) với kích thước cố định (2) thì số dòng giảm, nên xung đột dưới ánh xạ trực tiếp (3) nặng thêm. Bài thi làm tốt là bài nêu được ít nhất một tương tác kiểu đó.</li>
<li><strong>Hai trong bảy là con số thuần, năm cái kia là CHÍNH SÁCH.</strong> Kích thước cache và kích thước dòng là đại lượng bạn chỉnh; phần còn lại là quyết định cấu trúc làm đổi phần cứng. Vì thế câu hỏi về kích thước được trả lời bằng đường cong đánh đổi, còn câu hỏi về ánh xạ được trả lời bằng sơ đồ.</li>
<li><strong>Yếu tố 3 gánh nhiều điểm thi hơn hẳn phần còn lại.</strong> Mười ba slide của chương (12–24) nói về ánh xạ, và toàn bộ số học chia địa chỉ nằm ở đó. Hãy chia thời gian ôn theo đúng tỉ lệ ấy.</li>
<li><strong>Yếu tố 4 tồn tại LÀ VÌ yếu tố 3.</strong> Thay thế chỉ thành câu hỏi khi hàm ánh xạ còn chừa lựa chọn dòng. Slide 25 nói thẳng: "Với ánh xạ trực tiếp chỉ có duy nhất một dòng khả dĩ cho một khối bất kỳ, và không có lựa chọn nào cả."</li>
<li><strong>Yếu tố 7 là lý do bảng thông số chip hiện đại ghi "32 kB/32 kB".</strong> Cache tách là một cái cho lệnh và một cái cho dữ liệu ở cùng một cấp; Bảng 5.2 ở slide sau viết chúng cách nhau bằng dấu gạch chéo.</li>
</ul>
<p class="meo">💡 Nhớ theo thứ tự — <strong>Đ·K·Á·T·G·D·S</strong>: <em>Địa chỉ, Kích thước, Ánh xạ, Thay thế, Ghi, Dòng, Số lượng</em>. Bảy chữ, bảy điểm.</p>`],

      [8, 'Cache Addresses — logical versus physical, and the role of the MMU',
        `<p class="y-chinh">🎯 Before you can index a cache you must decide <strong>which address</strong> you index it with: the one the program used (virtual/logical) or the one main memory understands (physical). The answer changes both the speed and the correctness problems of the cache.</p>
<ul>
<li><strong>Virtual memory, in the slide's own words</strong> — a "facility that allows programs to address memory from a logical point of view, without regard to the amount of main memory physically available". A program can use addresses that no RAM chip owns; the system supplies the illusion.</li>
<li><strong>Consequence stated on the slide:</strong> "when used, the address fields of machine instructions contain <strong>virtual addresses</strong>". So the address a LOAD instruction carries is <em>not</em> the address main memory will see.</li>
<li><strong>The translator is hardware, not software.</strong> "For reads to and writes from main memory, a hardware <strong>memory management unit (MMU)</strong> translates each virtual address into a physical address in main memory." Translation happens on every single memory reference, so it must be fast, so it is a dedicated unit — not a subroutine.</li>
<li><strong>Why this lands in a cache chapter.</strong> The cache can be placed <em>before</em> the MMU (indexed by logical address) or <em>after</em> it (indexed by physical address). That single placement choice is Figure 5.5 on the next slide, and it is design element #1 in Table 5.1.</li>
<li><strong>The trade-off in one sentence each.</strong> Logical cache: faster, because it answers without waiting for translation. Physical cache: simpler and safer, because one physical address always means one thing to everybody.</li>
<li><strong>Where this is taught properly.</strong> Virtual memory itself is Chapter 9 (Operating System Support) in the 11th edition — paging, page tables, the TLB. Chapter 5 borrows only as much of it as the placement question needs.</li>
</ul>
<p class="meo">💡 Keep three words straight: <em>virtual</em> = what the program says · <em>physical</em> = what the RAM hears · <em>MMU</em> = the translator between them. "Logical address" and "virtual address" are the same thing in this book.</p>
<p class="pitfall">⚠️ The MMU is not the cache and the cache is not the MMU. The MMU answers "where in RAM is this?"; the cache answers "do I already have it?". They are two different questions, and Figure 5.5 differs only in which one is asked first.</p>`,
        `<p class="y-chinh">🎯 Trước khi đánh chỉ số vào cache, phải quyết định đánh bằng <strong>ĐỊA CHỈ NÀO</strong>: cái mà chương trình dùng (ảo/logic) hay cái mà bộ nhớ chính hiểu (vật lý). Câu trả lời làm đổi cả tốc độ lẫn các vấn đề về tính đúng đắn của cache.</p>
<ul>
<li><strong>Bộ nhớ ảo, theo đúng lời slide</strong> — một "tiện ích cho phép chương trình địa chỉ hoá bộ nhớ theo góc nhìn logic, bất kể lượng bộ nhớ chính thực có". Chương trình được dùng những địa chỉ mà không con RAM nào sở hữu; hệ thống dựng ra ảo giác ấy.</li>
<li><strong>Hệ quả slide nêu thẳng:</strong> "khi dùng bộ nhớ ảo, trường địa chỉ của lệnh máy chứa <strong>ĐỊA CHỈ ẢO</strong>". Nghĩa là địa chỉ mà một lệnh LOAD mang theo KHÔNG phải địa chỉ mà bộ nhớ chính sẽ nhìn thấy.</li>
<li><strong>Bộ phiên dịch là PHẦN CỨNG, không phải phần mềm.</strong> "Với mọi lần đọc và ghi bộ nhớ chính, một <strong>khối quản lý bộ nhớ (MMU)</strong> bằng phần cứng dịch mỗi địa chỉ ảo sang một địa chỉ vật lý." Việc dịch xảy ra ở MỌI lần tham chiếu bộ nhớ, nên nó phải nhanh, nên nó là một khối chuyên dụng — chứ không phải một hàm con.</li>
<li><strong>Vì sao chuyện này rơi vào chương cache.</strong> Cache có thể đặt <em>TRƯỚC</em> MMU (đánh chỉ số bằng địa chỉ logic) hoặc <em>SAU</em> MMU (bằng địa chỉ vật lý). Đúng một lựa chọn vị trí đó là Figure 5.5 ở slide kế, và nó là yếu tố thiết kế số 1 trong Bảng 5.1.</li>
<li><strong>Đánh đổi, mỗi bên một câu.</strong> Cache logic: NHANH HƠN, vì nó trả lời mà không phải chờ dịch địa chỉ. Cache vật lý: ĐƠN GIẢN VÀ AN TOÀN HƠN, vì một địa chỉ vật lý luôn có nghĩa như nhau với tất cả mọi người.</li>
<li><strong>Chỗ dạy tử tế về nó.</strong> Bản thân bộ nhớ ảo là Chương 9 (Hỗ trợ của hệ điều hành) trong bản 11e — phân trang, bảng trang, TLB. Chương 5 chỉ mượn đúng phần đủ để trả lời câu hỏi đặt cache ở đâu.</li>
</ul>
<p class="meo">💡 Giữ đúng ba chữ: <em>ảo</em> = cái chương trình nói · <em>vật lý</em> = cái RAM nghe · <em>MMU</em> = người phiên dịch ở giữa. Trong sách này "địa chỉ logic" và "địa chỉ ảo" là MỘT.</p>
<p class="pitfall">⚠️ MMU không phải cache và cache không phải MMU. MMU trả lời "thứ này nằm ở đâu trong RAM?"; cache trả lời "tôi đã có sẵn nó chưa?". Hai câu hỏi khác nhau, và Figure 5.5 chỉ khác nhau ở chỗ hỏi câu nào trước.</p>`],

      [9, 'Figure 5.5 — Logical and Physical Caches',
        `<p class="y-chinh">🎯 One design question, two wirings. In <strong>(a) Logical cache</strong> the cache is tapped off the <em>logical address</em> line, before the MMU. In <strong>(b) Physical cache</strong> it hangs off the <em>physical address</em> line, after the MMU. Everything else in the two drawings is identical.</p>
<table>
<tr><th></th><th>(a) Logical (virtual) cache</th><th>(b) Physical cache</th></tr>
<tr><td>Indexed by</td><td>Logical address, straight from the processor</td><td>Physical address, produced by the MMU</td></tr>
<tr><td>Speed on a hit</td><td><strong>Faster</strong> — no translation on the critical path</td><td>Slower — must translate first</td></tr>
<tr><td>What happens when a new process runs</td><td>Same virtual address now means different data → the cache generally has to be <strong>flushed</strong>, or tags must carry a process id</td><td>Nothing. A physical address is a physical address</td></tr>
<tr><td>Aliasing (two virtual addresses for one physical location)</td><td>The same data can sit in <strong>two different lines</strong> — a correctness hazard</td><td>Impossible by construction</td></tr>
<tr><td>Used in practice</td><td>Rare on its own; the idea survives as "virtually indexed, physically tagged"</td><td>The normal choice</td></tr>
</table>
<ul>
<li><strong>Follow the arrows and the trade-off explains itself.</strong> In (a) the processor's address reaches the cache without passing through any box; in (b) it must cross the MMU rectangle first. Boxes cost time — that is the whole speed argument, drawn rather than written.</li>
<li><strong>The hidden cost of (a) is correctness, not speed.</strong> Two processes both use virtual address 0x400000 for entirely different data. A logical cache holding a line tagged 0x400000 cannot tell them apart, so a context switch must invalidate it — and frequent flushing can easily cost more than the translation it saved.</li>
<li><strong>Aliasing is the second hazard of (a).</strong> Shared memory means two virtual addresses map to one physical frame. In a logical cache they occupy two lines; write through one and the other goes stale. In a physical cache the question cannot even be asked.</li>
<li><strong>Note that Data flows straight between processor and main memory in both drawings.</strong> The cache is a side path off the address line, not a link the data must traverse — another way of saying it is transparent.</li>
<li><strong>Why real designs cheat.</strong> The industry's answer is to index with the virtual address (fast, starts immediately) while comparing tags against the physical address (safe), overlapping translation with lookup. You are not examined on this in CEA201, but it explains why the "slow" option won without being slow.</li>
</ul>
<p class="pitfall">⚠️ A very common exam slip: saying the logical cache is "better because it is faster". It is faster <em>per hit</em> and worse <em>per context switch</em>. Any answer that names only one side of that trade is half an answer.</p>`,
        `<p class="y-chinh">🎯 Một câu hỏi thiết kế, hai cách đấu dây. Ở <strong>(a) Logical cache</strong>, cache được trích ra từ đường <em>địa chỉ logic</em>, TRƯỚC MMU. Ở <strong>(b) Physical cache</strong>, nó treo trên đường <em>địa chỉ vật lý</em>, SAU MMU. Mọi thứ còn lại của hai hình y hệt nhau.</p>
<table>
<tr><th></th><th>(a) Cache logic (ảo)</th><th>(b) Cache vật lý</th></tr>
<tr><td>Đánh chỉ số bằng</td><td>Địa chỉ logic, thẳng từ bộ xử lý</td><td>Địa chỉ vật lý, do MMU sinh ra</td></tr>
<tr><td>Tốc độ khi trúng</td><td><strong>NHANH HƠN</strong> — không có phép dịch trên đường găng</td><td>Chậm hơn — phải dịch trước đã</td></tr>
<tr><td>Khi một tiến trình mới chạy</td><td>Cùng địa chỉ ảo giờ mang nghĩa dữ liệu khác → thường phải <strong>XOÁ SẠCH</strong> cache, hoặc tag phải mang thêm mã tiến trình</td><td>Không sao cả. Địa chỉ vật lý là địa chỉ vật lý</td></tr>
<tr><td>Trùng bí danh (hai địa chỉ ảo cho một ô vật lý)</td><td>Cùng một dữ liệu có thể nằm ở <strong>HAI DÒNG khác nhau</strong> — nguy cơ sai dữ liệu</td><td>Không thể xảy ra, theo cấu tạo</td></tr>
<tr><td>Dùng trong thực tế</td><td>Hiếm khi dùng một mình; ý tưởng sống tiếp dưới dạng "chỉ số ảo, tag vật lý"</td><td>Lựa chọn thông thường</td></tr>
</table>
<ul>
<li><strong>Nhìn theo mũi tên là đánh đổi tự giải thích.</strong> Ở (a) địa chỉ của bộ xử lý tới cache mà không đi qua cái hộp nào; ở (b) nó phải vượt qua hình chữ nhật MMU trước. Hộp thì tốn thời gian — đó là toàn bộ lập luận về tốc độ, được VẼ ra thay vì viết ra.</li>
<li><strong>Cái giá ẩn của (a) là TÍNH ĐÚNG, không phải tốc độ.</strong> Hai tiến trình cùng dùng địa chỉ ảo 0x400000 cho hai dữ liệu hoàn toàn khác nhau. Cache logic giữ một dòng gắn nhãn 0x400000 thì không phân biệt nổi, nên mỗi lần chuyển ngữ cảnh là phải vô hiệu hoá nó — và xoá sạch thường xuyên hoàn toàn có thể tốn hơn phép dịch mà nó vừa tiết kiệm.</li>
<li><strong>Bí danh là nguy cơ thứ hai của (a).</strong> Bộ nhớ dùng chung nghĩa là hai địa chỉ ảo trỏ về một khung vật lý. Trong cache logic chúng chiếm hai dòng; ghi qua dòng này thì dòng kia thành cũ. Trong cache vật lý câu hỏi ấy thậm chí không đặt ra được.</li>
<li><strong>Để ý ở CẢ HAI hình, Data chạy thẳng giữa bộ xử lý và bộ nhớ chính.</strong> Cache là một nhánh rẽ khỏi đường địa chỉ, không phải một mắt xích mà dữ liệu bắt buộc xuyên qua — một cách nói khác của chữ "trong suốt".</li>
<li><strong>Vì sao thiết kế thật đi đường tắt.</strong> Câu trả lời của ngành là đánh chỉ số bằng địa chỉ ẢO (nhanh, khởi động ngay) nhưng so tag với địa chỉ VẬT LÝ (an toàn), cho phép dịch và tra cứu chồng lên nhau. CEA201 không thi phần này, nhưng nó giải thích vì sao phương án "chậm" lại thắng mà không hề chậm.</li>
</ul>
<p class="pitfall">⚠️ Lỗi rất hay gặp trong thi: nói cache logic "tốt hơn vì nhanh hơn". Nó nhanh hơn <em>MỖI LẦN TRÚNG</em> và tệ hơn <em>MỖI LẦN CHUYỂN NGỮ CẢNH</em>. Đáp án chỉ nêu một vế của đánh đổi là đáp án nửa vời.</p>`],
      [10, 'Cache Size — the two-sided constraint, and three reasons to keep it small',
        `<p class="y-chinh">🎯 The only slide in the chapter that states a design goal as a <strong>sandwich</strong>: the cache must be small enough that cost per bit stays near main memory's, and large enough that average access time stays near the cache's own. Both conditions at once — that is the whole art.</p>
<table>
<tr><th>The slide's requirement</th><th>What it is really saying</th></tr>
<tr><td>"<strong>Small enough</strong> so that the overall average cost per bit is close to that of main memory alone"</td><td>SRAM costs far more per bit than DRAM. If the cache grows large, the <em>system's</em> average price per bit drifts towards SRAM's — you have effectively built an expensive main memory</td></tr>
<tr><td>"<strong>Large enough</strong> so that the overall average access time is close to that of the cache alone"</td><td>That is <code>T = T<sub>1</sub> + (1 − H) × T<sub>2</sub> ≈ T<sub>1</sub></code>, which requires the hit ratio H to be very close to 1 — and H rises with size</td></tr>
</table>
<ul>
<li><strong>Reason 1 to stay small — addressing logic.</strong> "The larger the cache, the larger the number of gates involved in addressing the cache, resulting in large caches being <strong>slightly slower</strong> than small ones." More lines means more address bits to decode and a longer comparison path. Growing the cache therefore raises H but also raises T<sub>1</sub>, and the two effects fight.</li>
<li><strong>Reason 2 — physical space.</strong> "The available chip and board area also limits cache size." Silicon spent on cache is silicon not spent on execution units. This is why L1 stays tiny (tens of kB) while L3 can be tens of MB: L1 must be close and fast, L3 only needs to be big.</li>
<li><strong>Reason 3 — there is no right answer.</strong> "Because the performance of the cache is <strong>very sensitive to the nature of the workload</strong>, it is impossible to arrive at a single 'optimum' cache size." A database server and a game do not want the same cache. Any exam answer claiming one optimal size contradicts the slide.</li>
<li><strong>Do the arithmetic once and the trade-off stops being abstract.</strong> Take T<sub>1</sub> = 1 ns, T<sub>2</sub> = 100 ns. At H = 0,90: T = 1 + 0,10 × 100 = <strong>11 ns</strong>. At H = 0,95: T = 1 + 0,05 × 100 = <strong>6 ns</strong>. At H = 0,99: T = 1 + 0,01 × 100 = <strong>2 ns</strong>. Halving the <em>miss</em> rate nearly halves the total time, every time — that is why designers chase the last percent of H so hard.</li>
<li><strong>Now the other half of the trade.</strong> Suppose doubling the cache lifts H from 0,95 to 0,97 but pushes T<sub>1</sub> from 1 ns to 1,3 ns. New T = 1,3 + 0,03 × 100 = <strong>4,3 ns</strong> versus the old 6 ns — still a win. Push once more to T<sub>1</sub> = 2 ns for H = 0,98 and T = 2 + 2 = <strong>4 ns</strong>: barely better. That flattening is exactly what "slightly slower than small ones" costs you.</li>
</ul>
<p class="meo">💡 Remember the shape, not a number: hit ratio climbs steeply at first and then flattens, while access time and cost climb steadily. The best size is where the curves cross — and it moves with the workload, which is precisely why the slide refuses to name it.</p>
<p class="pitfall">⚠️ "Bigger cache = faster computer" is only true up to a point, and the slide says so. In the exam, always give the three reasons for keeping it small: <strong>addressing gates, chip area, workload dependence</strong>.</p>`,
        `<p class="y-chinh">🎯 Slide duy nhất của chương phát biểu mục tiêu thiết kế theo kiểu <strong>KẸP HAI ĐẦU</strong>: cache phải đủ NHỎ để giá trên mỗi bit của cả hệ gần bằng bộ nhớ chính, và đủ LỚN để thời gian truy cập trung bình gần bằng chính cache. Cả hai điều kiện cùng lúc — đó là toàn bộ cái nghề.</p>
<table>
<tr><th>Yêu cầu slide nêu</th><th>Thực chất nó đang nói gì</th></tr>
<tr><td>"<strong>Đủ NHỎ</strong> để giá trung bình trên mỗi bit của toàn hệ gần bằng giá của riêng bộ nhớ chính"</td><td>SRAM đắt hơn DRAM rất nhiều trên mỗi bit. Cache phình to thì giá trung bình mỗi bit của <em>CẢ HỆ</em> trôi về phía SRAM — nghĩa là bạn vừa dựng ra một bộ nhớ chính đắt tiền</td></tr>
<tr><td>"<strong>Đủ LỚN</strong> để thời gian truy cập trung bình của toàn hệ gần bằng thời gian của riêng cache"</td><td>Chính là <code>T = T<sub>1</sub> + (1 − H) × T<sub>2</sub> ≈ T<sub>1</sub></code>, muốn vậy thì tỉ lệ trúng H phải rất sát 1 — mà H tăng theo kích thước</td></tr>
</table>
<ul>
<li><strong>Lý do 1 phải giữ nhỏ — mạch địa chỉ hoá.</strong> "Cache càng lớn thì số cổng tham gia việc địa chỉ hoá cache càng nhiều, nên cache lớn <strong>HƠI CHẬM HƠN</strong> cache nhỏ." Nhiều dòng hơn nghĩa là nhiều bit địa chỉ phải giải mã hơn và đường so sánh dài hơn. Nới cache ra vì thế nâng H nhưng cũng nâng T<sub>1</sub>, hai tác động đánh nhau.</li>
<li><strong>Lý do 2 — chỗ vật lý.</strong> "Diện tích chip và bo mạch sẵn có cũng giới hạn kích thước cache." Silicon dành cho cache là silicon không dành cho khối thi hành. Đó là vì sao L1 vẫn bé tí (vài chục kB) còn L3 có thể vài chục MB: L1 phải GẦN và NHANH, L3 chỉ cần TO.</li>
<li><strong>Lý do 3 — không có đáp án đúng.</strong> "Vì hiệu năng cache <strong>rất nhạy với bản chất của tải công việc</strong>, không thể đi tới một kích thước cache 'tối ưu' duy nhất." Máy chủ cơ sở dữ liệu và một trò chơi không muốn cùng một cache. Bài thi nào khẳng định có một kích thước tối ưu duy nhất là mâu thuẫn với slide.</li>
<li><strong>Làm số một lần là đánh đổi thôi trừu tượng.</strong> Lấy T<sub>1</sub> = 1 ns, T<sub>2</sub> = 100 ns. Ở H = 0,90: T = 1 + 0,10 × 100 = <strong>11 ns</strong>. Ở H = 0,95: T = 1 + 0,05 × 100 = <strong>6 ns</strong>. Ở H = 0,99: T = 1 + 0,01 × 100 = <strong>2 ns</strong>. Chia đôi tỉ lệ TRƯỢT là gần như chia đôi tổng thời gian, lần nào cũng vậy — nên người thiết kế mới săn tới từng phần trăm cuối của H.</li>
<li><strong>Giờ tới vế kia của phép đổi.</strong> Giả sử nhân đôi cache nâng H từ 0,95 lên 0,97 nhưng đẩy T<sub>1</sub> từ 1 ns lên 1,3 ns. T mới = 1,3 + 0,03 × 100 = <strong>4,3 ns</strong> so với 6 ns cũ — vẫn lời. Đẩy thêm lần nữa, T<sub>1</sub> = 2 ns để có H = 0,98 thì T = 2 + 2 = <strong>4 ns</strong>: gần như không hơn gì. Chỗ đường cong bẹt ra chính là cái giá của câu "hơi chậm hơn cache nhỏ".</li>
</ul>
<p class="meo">💡 Nhớ HÌNH DÁNG, đừng nhớ con số: tỉ lệ trúng leo dốc mạnh lúc đầu rồi bẹt dần, trong khi thời gian truy cập và giá tiền thì leo đều. Kích thước tốt nhất nằm ở chỗ hai đường cắt nhau — và nó DI CHUYỂN theo tải công việc, đúng lý do slide từ chối gọi tên nó.</p>
<p class="pitfall">⚠️ "Cache to hơn = máy nhanh hơn" chỉ đúng tới một điểm, và slide nói rõ vậy. Trong bài thi, luôn nêu đủ ba lý do phải giữ nhỏ: <strong>cổng địa chỉ hoá, diện tích chip, phụ thuộc tải công việc</strong>.</p>`],

      [11, 'Table 5.2 — Cache Sizes of Some Processors (and a column that is plainly wrong)',
        `<p class="y-chinh">🎯 Twenty real machines, from a 1968 mainframe to a modern workstation chip, showing how the cache hierarchy grew from "one small L1" to "L1/L2/L3 per core, plus an L4 on mainframes". It is a history slide, not a formula slide — but it contains an error you should notice.</p>
<table>
<tr><th>Processor</th><th>Type</th><th>L1</th><th>L2</th><th>L3</th></tr>
<tr><td>IBM 360/85</td><td>Mainframe</td><td>16 to 32 kB</td><td>–</td><td>–</td></tr>
<tr><td>PDP-11/70</td><td>Minicomputer</td><td>1 kB</td><td>–</td><td>–</td></tr>
<tr><td>Intel 80486</td><td>PC</td><td>8 kB</td><td>–</td><td>–</td></tr>
<tr><td>Pentium</td><td>PC</td><td>8 kB/8 kB</td><td>256 to 512 kB</td><td>–</td></tr>
<tr><td>Pentium 4</td><td>PC/server</td><td>8 kB/8 kB</td><td>256 kB</td><td>–</td></tr>
<tr><td>Itanium 2</td><td>PC/server</td><td>32 kB</td><td>256 kB</td><td>6 MB</td></tr>
<tr><td>IBM POWER6</td><td>PC/server</td><td>64 kB/64 kB</td><td>4 MB</td><td>32 MB</td></tr>
<tr><td>IBM z10</td><td>Mainframe</td><td>64 kB/128 kB</td><td>3 MB</td><td>24–48 MB</td></tr>
<tr><td>Intel Core i7 EE 990</td><td>Workstation/Server</td><td>6 × 32 kB/32 kB</td><td>6 × 1.5 MB</td><td>12 MB</td></tr>
<tr><td>IBM zEnterprise 196</td><td>Mainframe/Server</td><td>24 × 64 kB/128 kB</td><td>24 × 1.5 MB</td><td>24 MB L3, <strong>192 MB L4</strong></td></tr>
<tr><td>IBM z13</td><td>Mainframe/server</td><td>24 × 96 kB/128 kB</td><td>24 × 2 MB/2 MB</td><td>64 MB L3, <strong>480 MB L4</strong></td></tr>
<tr><td>Intel Core i9-7900X</td><td>Workstation/server</td><td>8 × 32 kB/32 kB</td><td>8 × 1 MB</td><td>14 MB</td></tr>
</table>
<ul>
<li><strong>Read the notation first.</strong> The footnote says it outright: "Two values separated by a slash refer to <strong>instruction and data caches</strong>." So "32 kB/32 kB" is a <em>split</em> L1 (design element #7, slide 34), and "24 × 64 kB/128 kB" means twenty-four cores each having that split pair.</li>
<li><strong>The trend in one line.</strong> L1 has hardly grown in thirty years — 8 kB on a 486, 32 kB on a Core i9 — while L2 and L3 exploded. L1 is limited by <em>latency</em> (slide 10's addressing-gates argument), L3 only by area and cost.</li>
<li><strong>The "×" notation is the multicore era.</strong> "6 × 32 kB" is per-core private cache; the single L3 figure is shared by all cores. That split between private and shared is what makes coherency (slide 30) a hardware necessity rather than an academic worry.</li>
<li><strong>IBM mainframes have a fourth level.</strong> The z13 line reads "64 MB L3, 480 MB L4" — half a gigabyte of cache. Mainframe workloads are transaction streams over huge working sets, so the hierarchy simply gets one more rung.</li>
</ul>
<p class="dap-an">✅ Đáp án — the slide is defective and you should say so, not copy it: the <strong>"Year of Introduction" column reads 1968 in all twenty rows</strong>. Only the first row can be right (the IBM 360/85's cache was indeed announced in 1968). The Intel Core i9-7900X shipped in 2017, the IBM z13 in 2015, the Pentium 4 in 2000. Verified by reading the rendered slide image, so this is an error on the slide itself, not a text-extraction artefact. The same row also misprints the processor's name as "Intel Core <strong>i0</strong>-7900X" (it is i9) and spells "Workstaton". The cache-size figures themselves are consistent with the textbook and are safe to use.</p>
<p class="pitfall">⚠️ Do not memorise this table. No CEA201 paper asks for the L2 size of an Itanium. What it can ask is the <em>pattern</em>: L1 small and split, L2 medium and per-core, L3 large and shared, all growing over time.</p>`,
        `<p class="y-chinh">🎯 Hai mươi cỗ máy thật, từ một máy lớn năm 1968 tới một chip máy trạm hiện đại, cho thấy phân cấp cache lớn lên từ "một L1 bé" thành "L1/L2/L3 cho mỗi lõi, cộng thêm L4 trên máy lớn". Đây là slide LỊCH SỬ, không phải slide công thức — nhưng nó chứa một lỗi bạn nên nhìn ra.</p>
<table>
<tr><th>Bộ xử lý</th><th>Loại</th><th>L1</th><th>L2</th><th>L3</th></tr>
<tr><td>IBM 360/85</td><td>Máy lớn</td><td>16–32 kB</td><td>–</td><td>–</td></tr>
<tr><td>PDP-11/70</td><td>Máy mini</td><td>1 kB</td><td>–</td><td>–</td></tr>
<tr><td>Intel 80486</td><td>PC</td><td>8 kB</td><td>–</td><td>–</td></tr>
<tr><td>Pentium</td><td>PC</td><td>8 kB/8 kB</td><td>256–512 kB</td><td>–</td></tr>
<tr><td>Pentium 4</td><td>PC/máy chủ</td><td>8 kB/8 kB</td><td>256 kB</td><td>–</td></tr>
<tr><td>Itanium 2</td><td>PC/máy chủ</td><td>32 kB</td><td>256 kB</td><td>6 MB</td></tr>
<tr><td>IBM POWER6</td><td>PC/máy chủ</td><td>64 kB/64 kB</td><td>4 MB</td><td>32 MB</td></tr>
<tr><td>IBM z10</td><td>Máy lớn</td><td>64 kB/128 kB</td><td>3 MB</td><td>24–48 MB</td></tr>
<tr><td>Intel Core i7 EE 990</td><td>Máy trạm/máy chủ</td><td>6 × 32 kB/32 kB</td><td>6 × 1,5 MB</td><td>12 MB</td></tr>
<tr><td>IBM zEnterprise 196</td><td>Máy lớn/máy chủ</td><td>24 × 64 kB/128 kB</td><td>24 × 1,5 MB</td><td>24 MB L3, <strong>192 MB L4</strong></td></tr>
<tr><td>IBM z13</td><td>Máy lớn/máy chủ</td><td>24 × 96 kB/128 kB</td><td>24 × 2 MB/2 MB</td><td>64 MB L3, <strong>480 MB L4</strong></td></tr>
<tr><td>Intel Core i9-7900X</td><td>Máy trạm/máy chủ</td><td>8 × 32 kB/32 kB</td><td>8 × 1 MB</td><td>14 MB</td></tr>
</table>
<ul>
<li><strong>Đọc quy ước ký hiệu trước đã.</strong> Chú thích nói thẳng: "Hai giá trị cách nhau bằng dấu gạch chéo là <strong>cache lệnh và cache dữ liệu</strong>." Vậy "32 kB/32 kB" là một L1 <em>TÁCH</em> (yếu tố thiết kế số 7, slide 34), còn "24 × 64 kB/128 kB" nghĩa là hai mươi bốn lõi, mỗi lõi có cặp tách đó.</li>
<li><strong>Xu hướng gói trong một dòng.</strong> L1 gần như KHÔNG lớn lên suốt ba mươi năm — 8 kB trên 486, 32 kB trên Core i9 — trong khi L2 và L3 bùng nổ. L1 bị chặn bởi <em>ĐỘ TRỄ</em> (đúng lập luận cổng địa chỉ hoá ở slide 10), còn L3 chỉ bị chặn bởi diện tích và tiền.</li>
<li><strong>Ký hiệu "×" là thời đa lõi.</strong> "6 × 32 kB" là cache riêng của từng lõi; con số L3 duy nhất là dùng chung cho mọi lõi. Chính ranh giới riêng/chung đó biến nhất quán cache (slide 30) thành nhu cầu phần cứng bắt buộc chứ không phải mối lo hàn lâm.</li>
<li><strong>Máy lớn IBM có tới CẤP THỨ TƯ.</strong> Dòng z13 ghi "64 MB L3, 480 MB L4" — gần nửa gigabyte cache. Tải của máy lớn là dòng giao dịch trên tập làm việc khổng lồ, nên phân cấp chỉ việc mọc thêm một bậc.</li>
</ul>
<p class="dap-an">✅ Đáp án — slide này CÓ LỖI và phải nói ra, không được chép im lặng: <strong>cột "Year of Introduction" ghi 1968 ở CẢ HAI MƯƠI dòng</strong>. Chỉ dòng đầu có thể đúng (cache của IBM 360/85 quả thật công bố năm 1968). Intel Core i9-7900X ra 2017, IBM z13 ra 2015, Pentium 4 ra 2000. Đã kiểm bằng cách đọc thẳng ảnh render, nên đây là lỗi trên CHÍNH SLIDE, không phải lỗi trích chữ. Cũng dòng đó in sai tên chip thành "Intel Core <strong>i0</strong>-7900X" (đúng ra là i9) và gõ sai "Workstaton". Riêng các con số kích thước cache thì khớp với giáo trình và dùng được.</p>
<p class="pitfall">⚠️ Đừng học thuộc bảng này. Không đề CEA201 nào hỏi L2 của Itanium to bao nhiêu. Thứ có thể bị hỏi là QUY LUẬT: L1 nhỏ và tách, L2 vừa và riêng từng lõi, L3 lớn và dùng chung, tất cả đều to dần theo thời gian.</p>`],

      [12, 'Table 5.3 — Cache Access Methods (direct, fully associative, set associative)',
        `<p class="y-chinh">🎯 The three mapping functions side by side, in the only three columns that matter: how the cache is <strong>organized</strong>, how main memory blocks <strong>map</strong> into it, and which <strong>fields of the address</strong> are used to reach the data. Memorise this table and slides 13–24 become illustrations of it.</p>
<table>
<tr><th>Method</th><th>Organization</th><th>Mapping of main memory blocks to cache</th><th>Access using main memory address</th></tr>
<tr><td><strong>Direct Mapped</strong></td><td>Sequence of <em>m</em> lines</td><td>Each block of main memory maps to <strong>one unique line</strong> of cache</td><td><strong>Line</strong> portion of address used to access the cache line; <strong>Tag</strong> portion used to check for a hit on <em>that</em> line</td></tr>
<tr><td><strong>Fully Associative</strong></td><td>Sequence of <em>m</em> lines</td><td>Each block of main memory can map to <strong>any line</strong> of cache</td><td><strong>Tag</strong> portion used to check <em>every</em> line for a hit</td></tr>
<tr><td><strong>Set Associative</strong></td><td>Sequence of <em>m</em> lines organized as <strong><em>v</em> sets of <em>k</em> lines each (m = v × k)</strong></td><td>Each block of main memory maps to <strong>one unique cache set</strong></td><td><strong>Line (set)</strong> portion used to access the cache set; <strong>Tag</strong> portion used to check <em>every line in that set</em></td></tr>
</table>
<ul>
<li><strong>The three rows form a spectrum, not three unrelated ideas.</strong> Set associative with k = 1 <em>is</em> direct mapping (v = m sets of one line). Set associative with v = 1 <em>is</em> fully associative (one set containing all m lines). Direct and fully associative are the two endpoints; everything real lives in between.</li>
<li><strong>Read the last column as "how many comparators do I need?"</strong> Direct: <strong>one</strong>. Set associative: <strong>k</strong>. Fully associative: <strong>m</strong> — one per line, which is why it needs content-addressable memory (slides 16–18) and why it is expensive.</li>
<li><strong>The address field pattern falls straight out of the table.</strong> Direct: <code>Tag | Line | Word</code>. Set associative: <code>Tag | Set | Word</code>. Fully associative: <code>Tag | Word</code> — there is no index field at all, because there is no index to compute.</li>
<li><strong>Each row's flaw predicts the next row.</strong> Direct mapping is cheap but two hot blocks mapping to one line thrash. Fully associative never thrashes but needs m comparators and a replacement algorithm. Set associative takes a few comparators and gets most of the benefit — which is why real caches are 4-, 8- or 16-way.</li>
<li><strong>Note that m is the number of lines, not bytes.</strong> Cache data capacity = m × line size. Confusing the two is the fastest way to compute the wrong number of index bits.</li>
</ul>
<p class="meo">💡 Three-word summary you can write on the margin of the exam paper: direct = <em>one place</em> · fully associative = <em>anywhere</em> · set associative = <em>anywhere within one group</em>.</p>`,
        `<p class="y-chinh">🎯 Ba hàm ánh xạ đặt cạnh nhau, đúng ba cột có ý nghĩa: cache được <strong>TỔ CHỨC</strong> ra sao, khối bộ nhớ chính <strong>ÁNH XẠ</strong> vào đó thế nào, và <strong>TRƯỜNG NÀO của địa chỉ</strong> được dùng để tới dữ liệu. Thuộc bảng này thì slide 13–24 chỉ còn là minh hoạ cho nó.</p>
<table>
<tr><th>Phương pháp</th><th>Tổ chức</th><th>Ánh xạ khối bộ nhớ chính vào cache</th><th>Truy cập bằng địa chỉ bộ nhớ chính</th></tr>
<tr><td><strong>Direct Mapped</strong> (trực tiếp)</td><td>Dãy <em>m</em> dòng</td><td>Mỗi khối bộ nhớ chính ánh xạ vào <strong>ĐÚNG MỘT dòng</strong> cache</td><td>Phần <strong>Line</strong> của địa chỉ dùng để tới dòng cache; phần <strong>Tag</strong> dùng để kiểm xem có trúng ở <em>chính dòng đó</em> không</td></tr>
<tr><td><strong>Fully Associative</strong> (kết hợp toàn phần)</td><td>Dãy <em>m</em> dòng</td><td>Mỗi khối bộ nhớ chính có thể ánh xạ vào <strong>BẤT KỲ dòng nào</strong></td><td>Phần <strong>Tag</strong> dùng để kiểm <em>MỌI</em> dòng xem có trúng không</td></tr>
<tr><td><strong>Set Associative</strong> (kết hợp theo tập)</td><td>Dãy <em>m</em> dòng, tổ chức thành <strong><em>v</em> tập, mỗi tập <em>k</em> dòng (m = v × k)</strong></td><td>Mỗi khối bộ nhớ chính ánh xạ vào <strong>ĐÚNG MỘT TẬP</strong> cache</td><td>Phần <strong>Line (Set)</strong> dùng để tới tập cache; phần <strong>Tag</strong> dùng để kiểm <em>MỌI dòng TRONG tập đó</em></td></tr>
</table>
<ul>
<li><strong>Ba hàng là một PHỔ LIÊN TỤC, không phải ba ý tưởng rời.</strong> Kết hợp theo tập với k = 1 CHÍNH LÀ ánh xạ trực tiếp (v = m tập, mỗi tập một dòng). Kết hợp theo tập với v = 1 CHÍNH LÀ kết hợp toàn phần (một tập chứa cả m dòng). Trực tiếp và toàn phần là hai đầu mút; mọi thứ có thật đều nằm ở giữa.</li>
<li><strong>Đọc cột cuối như câu hỏi "tôi cần bao nhiêu bộ so sánh?"</strong> Trực tiếp: <strong>MỘT</strong>. Theo tập: <strong>k</strong>. Toàn phần: <strong>m</strong> — mỗi dòng một cái, và đó là lý do nó cần bộ nhớ địa chỉ hoá theo nội dung (slide 16–18) và cũng là lý do nó đắt.</li>
<li><strong>Dáng trường địa chỉ rơi thẳng ra từ bảng.</strong> Trực tiếp: <code>Tag | Line | Word</code>. Theo tập: <code>Tag | Set | Word</code>. Toàn phần: <code>Tag | Word</code> — không có trường chỉ số nào cả, vì chẳng có chỉ số nào để tính.</li>
<li><strong>Khuyết điểm của mỗi hàng báo trước hàng kế tiếp.</strong> Ánh xạ trực tiếp rẻ nhưng hai khối "nóng" cùng rơi vào một dòng thì đá nhau liên tục. Kết hợp toàn phần không bao giờ đá nhau nhưng cần m bộ so sánh và cần thuật toán thay thế. Kết hợp theo tập chỉ lấy vài bộ so sánh mà ăn được gần hết cái lợi — nên cache thật đều là 4, 8 hoặc 16 đường.</li>
<li><strong>Để ý m là SỐ DÒNG, không phải số byte.</strong> Dung lượng dữ liệu cache = m × kích thước dòng. Lẫn hai cái là cách nhanh nhất để tính sai số bit chỉ số.</li>
</ul>
<p class="meo">💡 Tóm tắt ba chữ, ghi ngay lề giấy thi: trực tiếp = <em>MỘT chỗ</em> · toàn phần = <em>CHỖ NÀO CŨNG ĐƯỢC</em> · theo tập = <em>chỗ nào cũng được TRONG MỘT NHÓM</em>.</p>`],
      [13, 'Figure 5.6 — Mapping from Main Memory to Cache: Direct and Associative (and the thrashing that direct mapping causes)',
        `<p class="y-chinh">🎯 Two pictures that define the two endpoints. In <strong>(a) Direct mapping</strong> the arrows are <em>parallel</em>: the first <em>m</em> blocks of main memory (equal to the size of the cache) march straight across to lines L<sub>0</sub> … L<sub>m−1</sub>. In <strong>(b) Associative mapping</strong> the arrows <em>fan out</em>: one block of main memory points at every line at once.</p>
<ul>
<li><strong>The figure's own legend:</strong> <em>b</em> = length of block in bits, <em>t</em> = length of tag in bits, and the cache is <em>m</em> lines, each drawn as <code>tag | block</code>.</li>
<li><strong>The rule behind the parallel arrows.</strong> Direct mapping assigns block <em>j</em> of main memory to line <code>i = j mod m</code>. Blocks 0, m, 2m, 3m … all land on line 0; blocks 1, m+1, 2m+1 … all land on line 1. The caption "first <em>m</em> blocks of main memory (equal to size of cache)" is telling you that the pattern then repeats for the next m blocks, and the next, forever.</li>
<li><strong>Why <code>j mod m</code> is free in hardware.</strong> Because m is a power of two, <code>j mod m</code> is simply the low <code>log<sub>2</sub>m</code> bits of the block number — no divider, no arithmetic, just wires. That is the entire cost advantage of direct mapping.</li>
<li><strong>And that is also its fatal weakness.</strong> If a program repeatedly touches two blocks whose numbers differ by exactly a multiple of m, they collide on the same line forever, evicting each other on every reference. The cache can be 99% empty and still miss every time. This is called <strong>thrashing</strong>, or a <em>conflict miss</em>.</li>
</ul>
<p class="nhan">Ví dụ số cụ thể · A concrete numeric example</p>
<p>Take a direct-mapped cache of <strong>32 kB</strong> with <strong>64-byte lines</strong> on a 32-bit machine. Lines = 32768 / 64 = <strong>512</strong>, so the split is <code>tag 17 | line 9 | offset 6</code>. Now take two addresses exactly one cache-size apart:</p>
<table>
<tr><th>Address</th><th>Binary (tag · line · offset)</th><th>Tag</th><th>Line</th></tr>
<tr><td><code>0x00010000</code></td><td>00000000000000010 · 000000000 · 000000</td><td>0x02</td><td><strong>0</strong></td></tr>
<tr><td><code>0x00018000</code></td><td>00000000000000011 · 000000000 · 000000</td><td>0x03</td><td><strong>0</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án: the two addresses differ by 0x8000 = 32768 = exactly the cache size, so their <em>line</em> fields are identical (both 0) while their <em>tags</em> differ (0x02 versus 0x03). Alternating between them produces a miss <strong>every single access</strong>, on a cache that has 511 empty lines. Verified with python3 by splitting each address and rebuilding it from (tag, line, offset).</p>
<p class="nhan">Đo THẬT bằng C · Measured, not asserted</p>
<pre>/* 24 luồng đọc, cách nhau STRIDE byte. Dữ liệu thật chỉ 24 × 4 byte. */
for (long it = 0; it &lt; ITER; it++) {
    long off = (it &amp; 15) * 4;
    for (int k = 0; k &lt; 24; k++)
        acc += *(int *)(buf + k * STRIDE + off);
}</pre>
<p>Compiled with <code>cc -O2</code> and run five times on an Apple M1 Max (L1d 64 kB):</p>
<table>
<tr><th>STRIDE</th><th>Relation to cache size</th><th>Time per read</th></tr>
<tr><td>4096 B</td><td>not a multiple of 64 kB</td><td>1,62–1,66 ns</td></tr>
<tr><td>4160 B</td><td>4096 + one line</td><td>1,62–1,65 ns</td></tr>
<tr><td><strong>32768 B</strong></td><td><strong>32 kB — conflicts</strong></td><td><strong>3,24–3,59 ns</strong></td></tr>
<tr><td>32832 B</td><td>32768 + 64 B of padding</td><td>1,64–1,66 ns</td></tr>
</table>
<p class="dap-an">✅ Đáp án: adding <strong>64 bytes of padding</strong> — nothing else changed, same data, same number of reads — makes the loop <strong>2,1× faster</strong>. The working set is under 2 kB and fits in any cache; the only thing that hurt was that the addresses shared an index field.</p>
<p class="pitfall">⚠️ Exam trap: "a miss happens because the cache is full". Not necessarily. A <em>conflict</em> miss happens because the one line you are allowed to use is occupied, no matter how much of the rest of the cache is idle. Direct mapping is the only organization where this can happen with a single competing block.</p>`,
        `<p class="y-chinh">🎯 Hai bức hình định nghĩa hai đầu mút. Ở <strong>(a) Direct mapping</strong>, các mũi tên SONG SONG: <em>m</em> khối đầu tiên của bộ nhớ chính (bằng đúng kích thước cache) đi thẳng sang các dòng L<sub>0</sub> … L<sub>m−1</sub>. Ở <strong>(b) Associative mapping</strong>, mũi tên XOÈ RA: một khối bộ nhớ chính chỉ vào MỌI dòng cùng lúc.</p>
<ul>
<li><strong>Chú giải của chính hình:</strong> <em>b</em> = chiều dài khối tính theo bit, <em>t</em> = chiều dài tag tính theo bit, và cache có <em>m</em> dòng, mỗi dòng vẽ thành <code>tag | block</code>.</li>
<li><strong>Quy tắc nằm sau các mũi tên song song.</strong> Ánh xạ trực tiếp gán khối <em>j</em> của bộ nhớ chính vào dòng <code>i = j mod m</code>. Khối 0, m, 2m, 3m … đều rơi vào dòng 0; khối 1, m+1, 2m+1 … đều rơi vào dòng 1. Dòng chú thích "m khối đầu của bộ nhớ chính (bằng kích thước cache)" đang nói với bạn rằng mẫu đó LẶP LẠI cho m khối kế tiếp, rồi m khối kế nữa, mãi mãi.</li>
<li><strong>Vì sao <code>j mod m</code> là MIỄN PHÍ trong phần cứng.</strong> Vì m là luỹ thừa của 2, <code>j mod m</code> chỉ đơn giản là <code>log<sub>2</sub>m</code> bit thấp của số hiệu khối — không cần bộ chia, không cần phép tính, chỉ là dây nối. Đó là toàn bộ ưu thế chi phí của ánh xạ trực tiếp.</li>
<li><strong>Và đó cũng là điểm yếu CHÍ MẠNG của nó.</strong> Nếu chương trình đụng đi đụng lại hai khối có số hiệu chênh nhau đúng một bội số của m, chúng va nhau trên cùng một dòng mãi mãi, đá nhau ra ở MỖI lần tham chiếu. Cache có thể trống 99% mà vẫn trượt mọi lần. Hiện tượng này gọi là <strong>THRASHING</strong>, hay <em>trượt do xung đột</em> (conflict miss).</li>
</ul>
<p class="nhan">Ví dụ số cụ thể</p>
<p>Lấy một cache ánh xạ trực tiếp <strong>32 kB</strong>, <strong>dòng 64 byte</strong>, máy 32 bit. Số dòng = 32768 / 64 = <strong>512</strong>, nên cách chia là <code>tag 17 | line 9 | offset 6</code>. Lấy hai địa chỉ cách nhau đúng một kích thước cache:</p>
<table>
<tr><th>Địa chỉ</th><th>Nhị phân (tag · line · offset)</th><th>Tag</th><th>Dòng</th></tr>
<tr><td><code>0x00010000</code></td><td>00000000000000010 · 000000000 · 000000</td><td>0x02</td><td><strong>0</strong></td></tr>
<tr><td><code>0x00018000</code></td><td>00000000000000011 · 000000000 · 000000</td><td>0x03</td><td><strong>0</strong></td></tr>
</table>
<p class="dap-an">✅ Đáp án: hai địa chỉ chênh nhau 0x8000 = 32768 = đúng kích thước cache, nên trường <em>line</em> của chúng GIỐNG HỆT (đều bằng 0) còn <em>tag</em> thì KHÁC (0x02 so với 0x03). Đọc luân phiên hai chỗ đó sinh ra một lần trượt ở <strong>MỌI lần truy cập</strong>, trên một cache còn 511 dòng trống. Đã kiểm bằng python3: tách từng địa chỉ rồi dựng ngược lại từ (tag, line, offset).</p>
<p class="nhan">Đo THẬT bằng C — không phải nói suông</p>
<pre>/* 24 luồng đọc, cách nhau STRIDE byte. Dữ liệu thật chỉ 24 × 4 byte. */
for (long it = 0; it &lt; ITER; it++) {
    long off = (it &amp; 15) * 4;
    for (int k = 0; k &lt; 24; k++)
        acc += *(int *)(buf + k * STRIDE + off);
}</pre>
<p>Biên dịch bằng <code>cc -O2</code>, chạy 5 lượt trên Apple M1 Max (L1d 64 kB):</p>
<table>
<tr><th>STRIDE</th><th>Quan hệ với kích thước cache</th><th>Thời gian mỗi lần đọc</th></tr>
<tr><td>4096 B</td><td>không phải bội số của 64 kB</td><td>1,62–1,66 ns</td></tr>
<tr><td>4160 B</td><td>4096 + một dòng</td><td>1,62–1,65 ns</td></tr>
<tr><td><strong>32768 B</strong></td><td><strong>32 kB — gây xung đột</strong></td><td><strong>3,24–3,59 ns</strong></td></tr>
<tr><td>32832 B</td><td>32768 + đệm thêm 64 B</td><td>1,64–1,66 ns</td></tr>
</table>
<p class="dap-an">✅ Đáp án: thêm <strong>64 byte đệm</strong> — không đổi gì khác, vẫn từng ấy dữ liệu, vẫn từng ấy lần đọc — làm vòng lặp <strong>NHANH GẤP 2,1 LẦN</strong>. Tập làm việc chưa tới 2 kB, vừa mọi cache; thứ duy nhất gây hại là các địa chỉ dùng chung trường chỉ số.</p>
<p class="pitfall">⚠️ Bẫy thi: "trượt vì cache đã đầy". Không nhất thiết. Trượt do <em>XUNG ĐỘT</em> xảy ra vì đúng cái dòng mà bạn được phép dùng đang có người ngồi, bất kể phần còn lại của cache rảnh bao nhiêu. Ánh xạ trực tiếp là tổ chức DUY NHẤT mà chuyện này xảy ra được chỉ với MỘT khối cạnh tranh.</p>`],

      [14, 'Figure 5.7 — Direct-Mapping Cache Organization (Tag | Line number | Offset, and the bit formulas)',
        `<p class="y-chinh">🎯 <strong>This is the exam slide.</strong> The address from the CPU is drawn split into three fields — <code>Tag (s − r bits) | Line number (r bits) | Offset (w bits)</code> — and the hardware under it shows exactly what each field does: the Line field <em>selects</em> one line, the Tag field is <em>compared</em>, the Offset field <em>selects a byte</em> inside the block.</p>
<table>
<tr><th>Field</th><th>Width on the slide</th><th>What the hardware does with it</th></tr>
<tr><td><strong>Tag</strong></td><td><code>s − r</code> bits</td><td>Goes to the <strong>Compare</strong> unit, against the tag stored in the selected line. Equal → <em>Hit (enable)</em>; not equal → <em>Miss → access main memory for data</em></td></tr>
<tr><td><strong>Line number</strong></td><td><code>r</code> bits</td><td>Indexes the line array — the green highlighted row in the figure. <strong>One</strong> line is read, never several</td></tr>
<tr><td><strong>Offset</strong></td><td><code>w</code> bits</td><td>Feeds the <strong>Select</strong> unit, picking the requested word out of the block → <em>Data to CPU</em></td></tr>
</table>
<p class="nhan">Ba công thức phải thuộc · The three formulas</p>
<table>
<tr><th>Field</th><th>Formula</th><th>Read it as</th></tr>
<tr><td>Offset (Word) = <em>w</em></td><td><code>w = log<sub>2</sub>(block size in BYTES)</code></td><td>How many bytes must I be able to point at inside one block?</td></tr>
<tr><td>Line (Index) = <em>r</em></td><td><code>r = log<sub>2</sub>(number of lines)</code>, and number of lines = <code>cache size ÷ block size</code></td><td>How many lines must I be able to point at?</td></tr>
<tr><td>Tag = <em>s − r</em></td><td><code>tag = total address bits − w − r</code></td><td>Whatever is left over — and it must be, because the three fields partition the address</td></tr>
</table>
<ul>
<li><strong>Always compute in that order: w, then r, then tag.</strong> The tag is never computed directly; it is the remainder. If your three numbers do not add up to the address width, you have made an arithmetic error — check before writing anything else.</li>
<li><strong>Why only ONE comparator appears in the figure.</strong> Because the Line field has already chosen the single line where this block is allowed to live. Compare Figure 5.10 (slide 18), where every line needs its own comparator, and the cost difference becomes visual.</li>
<li><strong>Note Stallings' symbols.</strong> He uses <em>s</em> for the number of bits identifying a <strong>block</strong> (so address = s + w bits) and <em>r</em> for the line bits, making the tag <em>s − r</em>. It is the same partition, just named from the block's point of view.</li>
</ul>
<p class="nhan">Bài tập 1 · Worked problem 1</p>
<p><em>24-bit address · 4-byte blocks · 16 kB direct-mapped cache. Split the address <code>0xAB1234</code>.</em></p>
<table>
<tr><th>Step</th><th>Working</th><th>Result</th></tr>
<tr><td>1. Offset</td><td>block = 4 B = 2<sup>2</sup></td><td><strong>w = 2</strong></td></tr>
<tr><td>2. Lines</td><td>16384 ÷ 4 = 4096 = 2<sup>12</sup></td><td><strong>r = 12</strong></td></tr>
<tr><td>3. Tag</td><td>24 − 2 − 12</td><td><strong>10 bits</strong></td></tr>
<tr><td>4. Binary</td><td colspan="2"><code>0xAB1234</code> = <code>1010 1011 0001 0010 0011 0100</code></td></tr>
<tr><td>5. Split 10 · 12 · 2</td><td colspan="2"><code>1010101100</code> | <code>010010001101</code> | <code>00</code></td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>Tag = 1010101100<sub>2</sub> = 0x2AC = 684 · Line = 010010001101<sub>2</sub> = 0x48D = 1165 · Offset = 0</strong>. The address lands in line 1165 of 4096, and the block it belongs to spans <code>0xAB1234</code>–<code>0xAB1237</code>. Checked with python3, including rebuilding <code>(684 &lt;&lt; 14) | (1165 &lt;&lt; 2) | 0 = 0xAB1234</code>.</p>
<p class="nhan">Bài tập 2 · Worked problem 2</p>
<p><em>32-bit address · 64-byte blocks · 32 kB direct-mapped cache. Split <code>0xDEADBEEF</code>.</em></p>
<table>
<tr><th>Step</th><th>Working</th><th>Result</th></tr>
<tr><td>1. Offset</td><td>64 B = 2<sup>6</sup></td><td><strong>w = 6</strong></td></tr>
<tr><td>2. Lines</td><td>32768 ÷ 64 = 512 = 2<sup>9</sup></td><td><strong>r = 9</strong></td></tr>
<tr><td>3. Tag</td><td>32 − 6 − 9</td><td><strong>17 bits</strong></td></tr>
<tr><td>4. Binary</td><td colspan="2"><code>1101 1110 1010 1101 1011 1110 1110 1111</code></td></tr>
<tr><td>5. Split 17 · 9 · 6</td><td colspan="2"><code>11011110101011011</code> | <code>011111011</code> | <code>101111</code></td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>Tag = 0x1BD5B = 114011 · Line = 011111011<sub>2</sub> = 0xFB = 251 · Offset = 101111<sub>2</sub> = 47</strong>. So the byte lives at offset 47 inside the block that occupies <code>0xDEADBEC0</code>–<code>0xDEADBEFF</code>, and that block is only ever allowed in line 251. Verified by rebuilding the address from the three fields.</p>
<p class="pitfall">⚠️ The two most common ways to lose these marks: (1) using the <strong>whole cache size</strong> instead of the <strong>number of lines</strong> for <code>r</code> — always divide by the block size first; (2) taking the tag from the <em>low</em> end. The tag is the <strong>high-order</strong> bits, always.</p>`,
        `<p class="y-chinh">🎯 <strong>ĐÂY LÀ SLIDE ĐI THI.</strong> Địa chỉ từ CPU được vẽ tách thành ba trường — <code>Tag (s − r bit) | Line number (r bit) | Offset (w bit)</code> — và phần cứng bên dưới cho thấy chính xác mỗi trường làm gì: trường Line <em>CHỌN</em> một dòng, trường Tag được <em>ĐEM SO</em>, trường Offset <em>CHỌN MỘT BYTE</em> bên trong khối.</p>
<table>
<tr><th>Trường</th><th>Độ rộng trên slide</th><th>Phần cứng làm gì với nó</th></tr>
<tr><td><strong>Tag</strong></td><td><code>s − r</code> bit</td><td>Đi vào khối <strong>Compare</strong>, so với tag đang lưu trong dòng vừa chọn. Bằng nhau → <em>Hit (enable)</em>; khác → <em>Miss → xuống bộ nhớ chính lấy dữ liệu</em></td></tr>
<tr><td><strong>Line number</strong></td><td><code>r</code> bit</td><td>Đánh chỉ số vào mảng dòng — chính hàng tô xanh trong hình. Đọc ra <strong>MỘT</strong> dòng, không bao giờ nhiều hơn</td></tr>
<tr><td><strong>Offset</strong></td><td><code>w</code> bit</td><td>Nuôi khối <strong>Select</strong>, nhặt đúng từ được hỏi ra khỏi khối → <em>Data to CPU</em></td></tr>
</table>
<p class="nhan">Ba công thức phải thuộc</p>
<table>
<tr><th>Trường</th><th>Công thức</th><th>Đọc thành câu hỏi</th></tr>
<tr><td>Offset (Word) = <em>w</em></td><td><code>w = log<sub>2</sub>(kích thước khối tính theo BYTE)</code></td><td>Tôi phải trỏ được vào bao nhiêu byte bên trong một khối?</td></tr>
<tr><td>Line (chỉ số) = <em>r</em></td><td><code>r = log<sub>2</sub>(số dòng cache)</code>, với số dòng = <code>kích thước cache ÷ kích thước khối</code></td><td>Tôi phải trỏ được vào bao nhiêu dòng?</td></tr>
<tr><td>Tag = <em>s − r</em></td><td><code>tag = tổng số bit địa chỉ − w − r</code></td><td>Phần còn thừa lại — và bắt buộc phải vậy, vì ba trường PHÂN HOẠCH địa chỉ</td></tr>
</table>
<ul>
<li><strong>Luôn tính theo đúng thứ tự: w, rồi r, rồi tag.</strong> Tag KHÔNG BAO GIỜ tính trực tiếp; nó là phần dư. Nếu ba con số của bạn cộng lại không bằng độ rộng địa chỉ thì bạn đã tính sai — kiểm lại trước khi viết thêm bất cứ thứ gì.</li>
<li><strong>Vì sao trong hình chỉ có MỘT bộ so sánh.</strong> Vì trường Line đã chọn sẵn đúng cái dòng duy nhất mà khối này được phép ở. So với Figure 5.10 (slide 18), nơi MỌI dòng đều cần bộ so sánh riêng, thì chênh lệch chi phí hiện ra bằng mắt.</li>
<li><strong>Để ý ký hiệu của Stallings.</strong> Ông dùng <em>s</em> cho số bit định danh một <strong>KHỐI</strong> (nên địa chỉ = s + w bit) và <em>r</em> cho số bit dòng, khiến tag là <em>s − r</em>. Vẫn là cách phân hoạch đó, chỉ đặt tên theo góc nhìn của khối.</li>
</ul>
<p class="nhan">Bài tập 1</p>
<p><em>Địa chỉ 24 bit · khối 4 byte · cache ánh xạ trực tiếp 16 kB. Chia địa chỉ <code>0xAB1234</code>.</em></p>
<table>
<tr><th>Bước</th><th>Tính</th><th>Kết quả</th></tr>
<tr><td>1. Offset</td><td>khối = 4 B = 2<sup>2</sup></td><td><strong>w = 2</strong></td></tr>
<tr><td>2. Số dòng</td><td>16384 ÷ 4 = 4096 = 2<sup>12</sup></td><td><strong>r = 12</strong></td></tr>
<tr><td>3. Tag</td><td>24 − 2 − 12</td><td><strong>10 bit</strong></td></tr>
<tr><td>4. Nhị phân</td><td colspan="2"><code>0xAB1234</code> = <code>1010 1011 0001 0010 0011 0100</code></td></tr>
<tr><td>5. Tách 10 · 12 · 2</td><td colspan="2"><code>1010101100</code> | <code>010010001101</code> | <code>00</code></td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>Tag = 1010101100<sub>2</sub> = 0x2AC = 684 · Line = 010010001101<sub>2</sub> = 0x48D = 1165 · Offset = 0</strong>. Địa chỉ rơi vào dòng 1165 trong 4096 dòng, và khối chứa nó trải từ <code>0xAB1234</code> tới <code>0xAB1237</code>. Đã kiểm bằng python3, kể cả dựng ngược <code>(684 &lt;&lt; 14) | (1165 &lt;&lt; 2) | 0 = 0xAB1234</code>.</p>
<p class="nhan">Bài tập 2</p>
<p><em>Địa chỉ 32 bit · khối 64 byte · cache ánh xạ trực tiếp 32 kB. Chia <code>0xDEADBEEF</code>.</em></p>
<table>
<tr><th>Bước</th><th>Tính</th><th>Kết quả</th></tr>
<tr><td>1. Offset</td><td>64 B = 2<sup>6</sup></td><td><strong>w = 6</strong></td></tr>
<tr><td>2. Số dòng</td><td>32768 ÷ 64 = 512 = 2<sup>9</sup></td><td><strong>r = 9</strong></td></tr>
<tr><td>3. Tag</td><td>32 − 6 − 9</td><td><strong>17 bit</strong></td></tr>
<tr><td>4. Nhị phân</td><td colspan="2"><code>1101 1110 1010 1101 1011 1110 1110 1111</code></td></tr>
<tr><td>5. Tách 17 · 9 · 6</td><td colspan="2"><code>11011110101011011</code> | <code>011111011</code> | <code>101111</code></td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>Tag = 0x1BD5B = 114011 · Line = 011111011<sub>2</sub> = 0xFB = 251 · Offset = 101111<sub>2</sub> = 47</strong>. Vậy byte đó nằm ở vị trí thứ 47 bên trong khối chiếm dải <code>0xDEADBEC0</code>–<code>0xDEADBEFF</code>, và khối ấy chỉ được phép nằm ở dòng 251. Đã kiểm bằng cách dựng ngược địa chỉ từ ba trường.</p>
<p class="pitfall">⚠️ Hai cách mất điểm phổ biến nhất: (1) lấy <strong>TOÀN BỘ kích thước cache</strong> thay vì <strong>SỐ DÒNG</strong> để tính <code>r</code> — luôn chia cho kích thước khối trước đã; (2) lấy tag từ đầu THẤP. Tag luôn là các bit <strong>CAO NHẤT</strong>, không có ngoại lệ.</p>`],
      [15, 'Figure 5.8 — Direct Mapping Example (16 MB memory, 4-byte blocks, 16K-line cache)',
        `<p class="y-chinh">🎯 The textbook's own worked example, and the template for every exam question of this type. Its parameters are printed at the bottom of the figure: <strong>Main memory address = Tag (8 bits) | Line (14 bits) | Word (2 bits)</strong>, over a <strong>16 MByte main memory</strong> and a <strong>16 K-line cache</strong> whose data field is 32 bits wide.</p>
<p class="nhan">Đọc ra tham số từ hình · Recovering the parameters</p>
<table>
<tr><th>Given on the figure</th><th>Derivation</th><th>Value</th></tr>
<tr><td>16 MB main memory</td><td>2<sup>24</sup> bytes</td><td><strong>24-bit address</strong> (8 + 14 + 2 ✓)</td></tr>
<tr><td>Word field = 2 bits</td><td>2<sup>2</sup> bytes per block</td><td><strong>block = 4 bytes</strong> (the "32 bits" data width)</td></tr>
<tr><td>Line field = 14 bits</td><td>2<sup>14</sup></td><td><strong>16384 lines</strong> — the "16-Kline cache"</td></tr>
<tr><td>Cache data capacity</td><td>16384 × 4 B</td><td><strong>64 kB</strong></td></tr>
<tr><td>Blocks in main memory</td><td>2<sup>24</sup> ÷ 4</td><td><strong>4 194 304</strong> — i.e. 256 blocks per line, and 2<sup>8</sup> = 256 ✓ matches the 8-bit tag</td></tr>
</table>
<p class="nhan">Kiểm từng địa chỉ trên hình · Every address on the figure, checked</p>
<table>
<tr><th>Address (binary on the slide)</th><th>Hex</th><th>Tag</th><th>Line</th><th>Word</th><th>Data on the slide</th></tr>
<tr><td>0000 0000 0000 0000 0000 0000</td><td>0x000000</td><td>00</td><td>0000</td><td>00</td><td>13579246</td></tr>
<tr><td>0001 0110 0000 0000 0000 0000</td><td>0x160000</td><td>16</td><td>0000</td><td>00</td><td>77777777</td></tr>
<tr><td>0001 0110 0000 0000 0000 0100</td><td>0x160004</td><td>16</td><td>0001</td><td>00</td><td>11235813</td></tr>
<tr><td>0001 0110 0011 0011 1001 1100</td><td>0x16339C</td><td>16</td><td>0CE7</td><td>00</td><td>FEDCBA98</td></tr>
<tr><td>0001 0110 1111 1111 1111 1100</td><td>0x16FFFC</td><td>16</td><td>3FFF</td><td>00</td><td>12345678</td></tr>
<tr><td>1111 1111 1111 1111 1111 1000</td><td>0xFFFFF8</td><td>FF</td><td>3FFE</td><td>00</td><td>11223344</td></tr>
<tr><td>1111 1111 1111 1111 1111 1100</td><td>0xFFFFFC</td><td>FF</td><td>3FFF</td><td>00</td><td>24682468</td></tr>
</table>
<p class="dap-an">✅ Đáp án: every line number and tag printed on the slide is correct. Checked with python3 by splitting each address into 8/14/2 and rebuilding it as <code>(tag &lt;&lt; 16) | (line &lt;&lt; 2) | word</code>. The cache snapshot on the right is consistent too: line 0000 holds tag <strong>00</strong> (data 13579246), line 0001 holds tag <strong>16</strong>, line 0CE7 holds tag <strong>16</strong>, line 3FFE holds tag <strong>FF</strong>, line 3FFF holds tag <strong>16</strong>.</p>
<p class="nhan">Chỗ hay nhất của hình — hai khối đá nhau · The collision hidden in the figure</p>
<ul>
<li><strong>0x000000 and 0x160000 both have line = 0000.</strong> The figure shows line 0 currently holding tag <strong>00</strong>, so the block at 0x160000 (data 77777777) is <em>not</em> in the cache even though its data is drawn right there in main memory. The two addresses differ by 0x160000 = 1 441 792 = <strong>22 × 64 kB</strong> — an exact multiple of the cache size, which is exactly the thrashing condition from slide 13.</li>
<li><strong>0x16FFFC and 0xFFFFFC both have line = 3FFF.</strong> The cache is currently holding tag 16 there, so 0xFFFFFC (24682468) would miss. Same story, at the other end of memory.</li>
</ul>
<p class="nhan">Bài tập 3 — số nhỏ, làm nhẩm được · Small numbers, do it in your head</p>
<p><em>16-bit address · 8-byte blocks · 2 kB direct-mapped cache. Split <code>0x5A7C</code>.</em></p>
<table>
<tr><th>Step</th><th>Working</th><th>Result</th></tr>
<tr><td>Offset</td><td>8 B = 2<sup>3</sup></td><td>w = 3</td></tr>
<tr><td>Lines</td><td>2048 ÷ 8 = 256 = 2<sup>8</sup></td><td>r = 8</td></tr>
<tr><td>Tag</td><td>16 − 3 − 8</td><td>5 bits</td></tr>
<tr><td>Binary</td><td colspan="2"><code>0x5A7C</code> = <code>0101 1010 0111 1100</code></td></tr>
<tr><td>Split 5 · 8 · 3</td><td colspan="2"><code>01011</code> | <code>01001111</code> | <code>100</code></td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>Tag = 01011<sub>2</sub> = 11 = 0x0B · Line = 01001111<sub>2</sub> = 79 = 0x4F · Offset = 4</strong>. The byte is the 5th byte (index 4) of the block spanning <code>0x5A78</code>–<code>0x5A7F</code>, and that block may only sit in line 79 of 256. Rebuilt as <code>(11 &lt;&lt; 11) | (79 &lt;&lt; 3) | 4 = 0x5A7C</code> ✓.</p>
<p class="nhan">Bài tập 4 · Worked problem 4</p>
<p><em>32-bit address · 16-byte blocks · 8 kB direct-mapped cache. Split <code>0x00C0FFEE</code>.</em></p>
<table>
<tr><th>Step</th><th>Working</th><th>Result</th></tr>
<tr><td>Offset</td><td>16 B = 2<sup>4</sup></td><td>w = 4</td></tr>
<tr><td>Lines</td><td>8192 ÷ 16 = 512 = 2<sup>9</sup></td><td>r = 9</td></tr>
<tr><td>Tag</td><td>32 − 4 − 9</td><td>19 bits</td></tr>
<tr><td>Binary</td><td colspan="2"><code>0000 0000 1100 0000 1111 1111 1110 1110</code></td></tr>
<tr><td>Split 19 · 9 · 4</td><td colspan="2"><code>0000000011000000111</code> | <code>111111110</code> | <code>1110</code></td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>Tag = 0x607 = 1543 · Line = 111111110<sub>2</sub> = 0x1FE = 510 · Offset = 1110<sub>2</sub> = 14</strong>. Block range <code>0x00C0FFE0</code>–<code>0x00C0FFEF</code>, line 510 of 512. Verified by rebuilding.</p>
<p class="nhan">Bài NGƯỢC — cho dòng và tag, dựng lại dải địa chỉ · The reverse question</p>
<p><em>32-bit address · 64-byte blocks · 32 kB direct-mapped cache (so w = 6, r = 9, tag = 17). A cache line numbered <code>0x1A3</code> currently stores tag <code>0x0C5</code>. Which addresses does it hold?</em></p>
<table>
<tr><th>Step</th><th>Working</th></tr>
<tr><td>1. Put the tag back in the high 17 bits</td><td>0x0C5 = 197, shift left by (9 + 6) = 15 → 197 × 32768 = 6 455 296</td></tr>
<tr><td>2. Put the line back in the next 9 bits</td><td>0x1A3 = 419, shift left by 6 → 419 × 64 = 26 816</td></tr>
<tr><td>3. Offset runs 0 … 63</td><td>base = 6 455 296 + 26 816 = 6 482 112 = <code>0x0062E8C0</code></td></tr>
</table>
<p class="dap-an">✅ Đáp án: the line holds the 64 bytes from <strong><code>0x0062E8C0</code> to <code>0x0062E8FF</code></strong>. Checked both ways with python3: splitting <code>0x0062E8C0</code> back into 17/9/6 gives tag 0x0C5, line 0x1A3, offset 0 ✓.</p>
<p class="meo">💡 The reverse question is just the forward one run backwards: <code>address = (tag &lt;&lt; (r + w)) | (line &lt;&lt; w) | offset</code>. Write that one line on your formula card and both directions are covered.</p>
<p class="pitfall">⚠️ Note the figure's caption: "Memory address values are in <strong>binary</strong> representation; other values are in <strong>hexadecimal</strong>." Mixing the two bases while reading this figure is the classic way to get a wrong tag — the left column already gives you the tag in hex, so use it to check your binary work.</p>`,
        `<p class="y-chinh">🎯 Ví dụ giải mẫu của chính giáo trình, và là khuôn cho mọi câu thi dạng này. Tham số in ngay dưới hình: <strong>Địa chỉ bộ nhớ chính = Tag (8 bit) | Line (14 bit) | Word (2 bit)</strong>, trên một <strong>bộ nhớ chính 16 MByte</strong> và một <strong>cache 16 K dòng</strong> có trường dữ liệu rộng 32 bit.</p>
<p class="nhan">Đọc ra tham số từ hình</p>
<table>
<tr><th>Hình cho sẵn</th><th>Suy ra</th><th>Giá trị</th></tr>
<tr><td>Bộ nhớ chính 16 MB</td><td>2<sup>24</sup> byte</td><td><strong>địa chỉ 24 bit</strong> (8 + 14 + 2 ✓)</td></tr>
<tr><td>Trường Word = 2 bit</td><td>2<sup>2</sup> byte mỗi khối</td><td><strong>khối = 4 byte</strong> (đúng bề rộng "32 bits")</td></tr>
<tr><td>Trường Line = 14 bit</td><td>2<sup>14</sup></td><td><strong>16384 dòng</strong> — đúng chữ "16-Kline cache"</td></tr>
<tr><td>Dung lượng dữ liệu cache</td><td>16384 × 4 B</td><td><strong>64 kB</strong></td></tr>
<tr><td>Số khối trong bộ nhớ chính</td><td>2<sup>24</sup> ÷ 4</td><td><strong>4 194 304</strong> — tức 256 khối trên mỗi dòng, và 2<sup>8</sup> = 256 ✓ khớp tag 8 bit</td></tr>
</table>
<p class="nhan">Kiểm từng địa chỉ trên hình</p>
<table>
<tr><th>Địa chỉ (nhị phân trên slide)</th><th>Hex</th><th>Tag</th><th>Line</th><th>Word</th><th>Dữ liệu trên slide</th></tr>
<tr><td>0000 0000 0000 0000 0000 0000</td><td>0x000000</td><td>00</td><td>0000</td><td>00</td><td>13579246</td></tr>
<tr><td>0001 0110 0000 0000 0000 0000</td><td>0x160000</td><td>16</td><td>0000</td><td>00</td><td>77777777</td></tr>
<tr><td>0001 0110 0000 0000 0000 0100</td><td>0x160004</td><td>16</td><td>0001</td><td>00</td><td>11235813</td></tr>
<tr><td>0001 0110 0011 0011 1001 1100</td><td>0x16339C</td><td>16</td><td>0CE7</td><td>00</td><td>FEDCBA98</td></tr>
<tr><td>0001 0110 1111 1111 1111 1100</td><td>0x16FFFC</td><td>16</td><td>3FFF</td><td>00</td><td>12345678</td></tr>
<tr><td>1111 1111 1111 1111 1111 1000</td><td>0xFFFFF8</td><td>FF</td><td>3FFE</td><td>00</td><td>11223344</td></tr>
<tr><td>1111 1111 1111 1111 1111 1100</td><td>0xFFFFFC</td><td>FF</td><td>3FFF</td><td>00</td><td>24682468</td></tr>
</table>
<p class="dap-an">✅ Đáp án: mọi số hiệu dòng và tag in trên slide đều ĐÚNG. Đã kiểm bằng python3: tách từng địa chỉ theo 8/14/2 rồi dựng ngược <code>(tag &lt;&lt; 16) | (line &lt;&lt; 2) | word</code>. Ảnh chụp cache bên phải cũng nhất quán: dòng 0000 giữ tag <strong>00</strong> (dữ liệu 13579246), dòng 0001 giữ tag <strong>16</strong>, dòng 0CE7 giữ tag <strong>16</strong>, dòng 3FFE giữ tag <strong>FF</strong>, dòng 3FFF giữ tag <strong>16</strong>.</p>
<p class="nhan">Chỗ hay nhất của hình — hai khối đá nhau</p>
<ul>
<li><strong>0x000000 và 0x160000 CÙNG có line = 0000.</strong> Hình cho thấy dòng 0 đang giữ tag <strong>00</strong>, nên khối ở 0x160000 (dữ liệu 77777777) KHÔNG nằm trong cache, dù dữ liệu của nó được vẽ ngay đó trong bộ nhớ chính. Hai địa chỉ chênh nhau 0x160000 = 1 441 792 = <strong>22 × 64 kB</strong> — đúng một bội số của kích thước cache, tức đúng điều kiện thrashing ở slide 13.</li>
<li><strong>0x16FFFC và 0xFFFFFC CÙNG có line = 3FFF.</strong> Cache hiện giữ tag 16 ở đó, nên 0xFFFFFC (24682468) sẽ trượt. Cùng một câu chuyện, ở đầu kia của bộ nhớ.</li>
</ul>
<p class="nhan">Bài tập 3 — số nhỏ, làm nhẩm được</p>
<p><em>Địa chỉ 16 bit · khối 8 byte · cache ánh xạ trực tiếp 2 kB. Chia <code>0x5A7C</code>.</em></p>
<table>
<tr><th>Bước</th><th>Tính</th><th>Kết quả</th></tr>
<tr><td>Offset</td><td>8 B = 2<sup>3</sup></td><td>w = 3</td></tr>
<tr><td>Số dòng</td><td>2048 ÷ 8 = 256 = 2<sup>8</sup></td><td>r = 8</td></tr>
<tr><td>Tag</td><td>16 − 3 − 8</td><td>5 bit</td></tr>
<tr><td>Nhị phân</td><td colspan="2"><code>0x5A7C</code> = <code>0101 1010 0111 1100</code></td></tr>
<tr><td>Tách 5 · 8 · 3</td><td colspan="2"><code>01011</code> | <code>01001111</code> | <code>100</code></td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>Tag = 01011<sub>2</sub> = 11 = 0x0B · Line = 01001111<sub>2</sub> = 79 = 0x4F · Offset = 4</strong>. Byte đó là byte thứ 5 (chỉ số 4) của khối trải từ <code>0x5A78</code> tới <code>0x5A7F</code>, và khối ấy chỉ được nằm ở dòng 79 trong 256 dòng. Dựng ngược <code>(11 &lt;&lt; 11) | (79 &lt;&lt; 3) | 4 = 0x5A7C</code> ✓.</p>
<p class="nhan">Bài tập 4</p>
<p><em>Địa chỉ 32 bit · khối 16 byte · cache ánh xạ trực tiếp 8 kB. Chia <code>0x00C0FFEE</code>.</em></p>
<table>
<tr><th>Bước</th><th>Tính</th><th>Kết quả</th></tr>
<tr><td>Offset</td><td>16 B = 2<sup>4</sup></td><td>w = 4</td></tr>
<tr><td>Số dòng</td><td>8192 ÷ 16 = 512 = 2<sup>9</sup></td><td>r = 9</td></tr>
<tr><td>Tag</td><td>32 − 4 − 9</td><td>19 bit</td></tr>
<tr><td>Nhị phân</td><td colspan="2"><code>0000 0000 1100 0000 1111 1111 1110 1110</code></td></tr>
<tr><td>Tách 19 · 9 · 4</td><td colspan="2"><code>0000000011000000111</code> | <code>111111110</code> | <code>1110</code></td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>Tag = 0x607 = 1543 · Line = 111111110<sub>2</sub> = 0x1FE = 510 · Offset = 1110<sub>2</sub> = 14</strong>. Dải khối <code>0x00C0FFE0</code>–<code>0x00C0FFEF</code>, dòng 510 trong 512. Đã kiểm bằng dựng ngược.</p>
<p class="nhan">Bài NGƯỢC — cho dòng và tag, dựng lại dải địa chỉ</p>
<p><em>Địa chỉ 32 bit · khối 64 byte · cache ánh xạ trực tiếp 32 kB (nên w = 6, r = 9, tag = 17). Dòng cache số <code>0x1A3</code> đang lưu tag <code>0x0C5</code>. Nó chứa những địa chỉ nào?</em></p>
<table>
<tr><th>Bước</th><th>Tính</th></tr>
<tr><td>1. Trả tag về 17 bit cao</td><td>0x0C5 = 197, dịch trái (9 + 6) = 15 → 197 × 32768 = 6 455 296</td></tr>
<tr><td>2. Trả số dòng về 9 bit kế</td><td>0x1A3 = 419, dịch trái 6 → 419 × 64 = 26 816</td></tr>
<tr><td>3. Offset chạy 0 … 63</td><td>đầu khối = 6 455 296 + 26 816 = 6 482 112 = <code>0x0062E8C0</code></td></tr>
</table>
<p class="dap-an">✅ Đáp án: dòng đó chứa 64 byte từ <strong><code>0x0062E8C0</code> tới <code>0x0062E8FF</code></strong>. Đã kiểm CẢ HAI CHIỀU bằng python3: tách ngược <code>0x0062E8C0</code> theo 17/9/6 cho ra tag 0x0C5, line 0x1A3, offset 0 ✓.</p>
<p class="meo">💡 Bài ngược chỉ là bài xuôi chạy giật lùi: <code>địa chỉ = (tag &lt;&lt; (r + w)) | (line &lt;&lt; w) | offset</code>. Ghi đúng một dòng đó lên tờ công thức là bao trọn cả hai chiều.</p>
<p class="pitfall">⚠️ Để ý chú thích của hình: "Giá trị địa chỉ bộ nhớ ở dạng <strong>NHỊ PHÂN</strong>; các giá trị khác ở dạng <strong>THẬP LỤC PHÂN</strong>." Trộn hai hệ đếm khi đọc hình này là cách kinh điển để ra sai tag — cột trái đã cho sẵn tag dạng hex, hãy dùng nó để đối chiếu phần nhị phân bạn vừa làm.</p>`],
      [16, 'Content-Addressable Memory (CAM) — the hardware that makes associative lookup possible',
        `<p class="y-chinh">🎯 Fully associative mapping requires comparing the tag against <em>every</em> line at once. Ordinary SRAM cannot do that — so a different kind of memory exists: <strong>content-addressable memory</strong>, which you hand a value and it hands back an address.</p>
<ul>
<li><strong>Also known as associative storage.</strong> Normal memory: give it an address, it returns content. CAM: give it <em>content</em>, it returns the <em>address</em> where that content sits. The name is the definition, read backwards.</li>
<li><strong>How it is built and what it costs.</strong> "Content-addressable memory is constructed of <strong>static RAM (SRAM) cells</strong> but is considerably more expensive and holds much less data than regular SRAM chips" — and the slide gives the number: "a CAM with the same data capacity as a regular SRAM is about <strong>60% larger</strong>."</li>
<li><strong>What it actually does.</strong> "A CAM is designed such that when a bit string is supplied, the CAM <strong>searches its entire memory in parallel</strong> for a match." Every cell compares itself against the search value simultaneously — that is the extra circuitry the 60% pays for.</li>
<li><strong>What it returns.</strong> "If the content is found, the CAM returns the <strong>address where the match is found</strong> and, in some architectures, also returns the associated data word."</li>
<li><strong>The headline number.</strong> "This process takes only <strong>one clock cycle</strong>." A linear search through m lines would take m cycles; the CAM does it in one, at the price of area and power.</li>
</ul>
<p class="nhan">Vì sao mục này nằm đúng chỗ này · Why this slide sits here</p>
<table>
<tr><th>Mapping</th><th>What must be compared</th><th>Memory technology needed</th></tr>
<tr><td>Direct</td><td>1 tag</td><td>Plain SRAM + one comparator</td></tr>
<tr><td>Set associative (k-way)</td><td>k tags</td><td>SRAM + k comparators (small CAM per set)</td></tr>
<tr><td>Fully associative</td><td>all m tags</td><td><strong>CAM for the whole tag array</strong></td></tr>
</table>
<ul>
<li><strong>This is the economic argument against fully associative caches, made concrete.</strong> It is not "associative is slow" — it is one cycle, same as direct. It is that the tag store costs ~60% more area and much more power, and that cost scales with every line you add. Hence real L1 caches are 4- or 8-way, not fully associative.</li>
<li><strong>Where else you meet CAM.</strong> TLBs (Chapter 9) are small fully associative structures built exactly this way, and network routers use CAM for routing-table lookup. Whenever "search everything at once" is the requirement, this is the answer.</li>
</ul>
<p class="meo">💡 One sentence to remember: <em>RAM turns an address into data; CAM turns data into an address — in one cycle, for about 60% more silicon.</em></p>`,
        `<p class="y-chinh">🎯 Ánh xạ kết hợp toàn phần đòi phải so tag với <em>MỌI</em> dòng cùng lúc. SRAM thường không làm được — nên tồn tại một loại bộ nhớ khác: <strong>bộ nhớ địa chỉ hoá theo nội dung (CAM)</strong>, bạn đưa cho nó một GIÁ TRỊ và nó trả lại một ĐỊA CHỈ.</p>
<ul>
<li><strong>Còn gọi là associative storage (bộ nhớ kết hợp).</strong> Bộ nhớ thường: đưa địa chỉ, nhận nội dung. CAM: đưa <em>NỘI DUNG</em>, nhận <em>ĐỊA CHỈ</em> nơi nội dung đó nằm. Cái tên chính là định nghĩa, đọc ngược lại.</li>
<li><strong>Nó dựng bằng gì và tốn bao nhiêu.</strong> "CAM được dựng từ các ô <strong>SRAM tĩnh</strong> nhưng đắt hơn đáng kể và chứa được ít dữ liệu hơn nhiều so với chip SRAM thường" — và slide cho luôn con số: "một CAM có cùng dung lượng dữ liệu với một SRAM thường thì <strong>lớn hơn khoảng 60%</strong>."</li>
<li><strong>Nó làm gì.</strong> "CAM được thiết kế sao cho khi nhận một chuỗi bit, nó <strong>tìm khắp toàn bộ bộ nhớ của mình SONG SONG</strong> để tìm chỗ khớp." Mọi ô tự so mình với giá trị tìm kiếm cùng một lúc — đó chính là phần mạch phụ mà 60% kia trả tiền cho.</li>
<li><strong>Nó trả về gì.</strong> "Nếu tìm thấy nội dung, CAM trả về <strong>ĐỊA CHỈ nơi khớp</strong> và, ở một số kiến trúc, trả về luôn cả từ dữ liệu đi kèm."</li>
<li><strong>Con số đáng nhớ nhất.</strong> "Quá trình này chỉ tốn <strong>MỘT chu kỳ xung nhịp</strong>." Tìm tuyến tính qua m dòng sẽ tốn m chu kỳ; CAM làm xong trong một, đổi lại bằng diện tích và điện năng.</li>
</ul>
<p class="nhan">Vì sao mục này nằm đúng chỗ này</p>
<table>
<tr><th>Kiểu ánh xạ</th><th>Phải so bao nhiêu tag</th><th>Công nghệ bộ nhớ cần tới</th></tr>
<tr><td>Trực tiếp</td><td>1 tag</td><td>SRAM thường + một bộ so sánh</td></tr>
<tr><td>Kết hợp theo tập (k đường)</td><td>k tag</td><td>SRAM + k bộ so sánh (CAM nhỏ cho mỗi tập)</td></tr>
<tr><td>Kết hợp toàn phần</td><td>cả m tag</td><td><strong>CAM cho toàn bộ mảng tag</strong></td></tr>
</table>
<ul>
<li><strong>Đây là lập luận KINH TẾ chống lại cache kết hợp toàn phần, nói bằng con số.</strong> Vấn đề KHÔNG phải "kết hợp thì chậm" — nó vẫn một chu kỳ, y như trực tiếp. Vấn đề là kho tag tốn thêm ~60% diện tích và nhiều điện hơn hẳn, và cái giá đó tăng theo từng dòng bạn thêm vào. Vì thế cache L1 thật là 4 hay 8 đường, chứ không kết hợp toàn phần.</li>
<li><strong>Bạn còn gặp CAM ở đâu.</strong> TLB (Chương 9) là những cấu trúc kết hợp toàn phần cỡ nhỏ, dựng đúng theo kiểu này, và bộ định tuyến mạng dùng CAM để tra bảng định tuyến. Hễ yêu cầu là "tìm mọi thứ cùng một lúc" thì đáp án là nó.</li>
</ul>
<p class="meo">💡 Một câu để nhớ: <em>RAM biến ĐỊA CHỈ thành DỮ LIỆU; CAM biến DỮ LIỆU thành ĐỊA CHỈ — trong một chu kỳ, đổi lấy khoảng 60% silicon thêm.</em></p>`],

      [17, 'Figure 5.9 — Content-Addressable Memory (the circuit, and the logical organization)',
        `<p class="y-chinh">🎯 Two views of the CAM. <strong>(a) Simplified CAM circuitry</strong> shows four stored words being searched for the pattern <code>01101</code>; exactly one match line goes high and an encoder turns it into an address. <strong>(b) Logical organization of CAM</strong> shows the same thing as a block diagram.</p>
<table>
<tr><th>Element in part (a)</th><th>What it is</th></tr>
<tr><td><strong>Search data = 01101</strong></td><td>The value being looked for — a tag, in cache terms</td></tr>
<tr><td><strong>Search line drivers</strong> feeding SL<sub>0</sub>, S̄L<sub>0</sub>, SL<sub>1</sub>, S̄L<sub>1</sub> …</td><td>Each bit is broadcast to every row, in true <em>and</em> complement form, so each cell can compare itself</td></tr>
<tr><td><strong>ML<sub>0</sub> … ML<sub>3</sub></strong> (match lines), labelled <em>mismatch · match · mismatch · mismatch</em></td><td>One line per stored word. It stays high only if <strong>every</strong> bit of that word matched</td></tr>
<tr><td><strong>Encoder</strong> with outputs 00, 01, 10, 11</td><td>Converts "which match line fired" into a binary address — here <strong>Match address = 01</strong></td></tr>
</table>
<table>
<tr><th>Element in part (b)</th><th>Role</th></tr>
<tr><td><strong>Search data register</strong> (n bits in)</td><td>Holds the pattern and drives the search lines</td></tr>
<tr><td><strong>CAM cell array</strong> — <em>m words, n bits/word</em></td><td>The storage itself; also has Data Input, Write Enable, Read Enable, Search Enable and an Output Data path for ordinary reads</td></tr>
<tr><td><strong>Match detection/encoder &amp; sense amplifiers</strong> → <strong>Address encoder</strong></td><td>Turns m match lines into one match address</td></tr>
</table>
<ul>
<li><strong>Read part (a) row by row and the "one cycle" claim becomes obvious.</strong> No row waits for another; all four comparisons happen simultaneously as soon as the search lines settle. Search time does not grow with m — only the wiring and power do.</li>
<li><strong>Why both SL and its complement are wired.</strong> A cell must be able to detect "I hold 1 but you asked for 0" and "I hold 0 but you asked for 1". With true and complement lines a single transistor pair per cell can pull the match line down on either kind of mismatch — the classic CAM cell.</li>
<li><strong>The match line is a wired-AND.</strong> Any one mismatching bit pulls the whole line low. That is why the labels read "mismatch" on three rows: it takes a perfect match to survive.</li>
<li><strong>Map it onto the cache.</strong> Search data = the tag field of the address. CAM cell array = the tag store. Match address = the cache line number. That is literally Figure 5.10 on the next slide, drawn at the transistor level here.</li>
<li><strong>Part (b) shows CAM is still a memory.</strong> It has Write Enable and Read Enable like any RAM — the search path is an <em>extra</em> capability bolted onto an ordinary array, which is exactly why it costs about 60% more area.</li>
</ul>
<p class="pitfall">⚠️ Do not confuse the <em>match address</em> with a memory address. In part (a) the answer "01" means "the match was found in stored word number 1" — it is an index into the CAM, not a main-memory address. In a cache, that index is the cache line number.</p>`,
        `<p class="y-chinh">🎯 Hai góc nhìn về CAM. <strong>(a) Simplified CAM circuitry</strong> vẽ bốn từ đang lưu bị tìm theo mẫu <code>01101</code>; đúng MỘT đường match lên mức cao và một bộ mã hoá biến nó thành địa chỉ. <strong>(b) Logical organization of CAM</strong> vẽ đúng thứ đó dưới dạng sơ đồ khối.</p>
<table>
<tr><th>Thành phần ở phần (a)</th><th>Nó là gì</th></tr>
<tr><td><strong>Search data = 01101</strong></td><td>Giá trị cần tìm — theo ngôn ngữ cache thì đây là một cái tag</td></tr>
<tr><td><strong>Search line drivers</strong> nuôi SL<sub>0</sub>, S̄L<sub>0</sub>, SL<sub>1</sub>, S̄L<sub>1</sub> …</td><td>Mỗi bit được phát tới MỌI hàng, ở cả dạng thuận và dạng bù, để từng ô tự so được</td></tr>
<tr><td><strong>ML<sub>0</sub> … ML<sub>3</sub></strong> (đường match), ghi <em>mismatch · match · mismatch · mismatch</em></td><td>Mỗi từ đã lưu một đường. Nó chỉ giữ mức cao nếu <strong>MỌI</strong> bit của từ đó đều khớp</td></tr>
<tr><td><strong>Encoder</strong> với đầu ra 00, 01, 10, 11</td><td>Biến "đường match nào nổ" thành địa chỉ nhị phân — ở đây <strong>Match address = 01</strong></td></tr>
</table>
<table>
<tr><th>Thành phần ở phần (b)</th><th>Vai trò</th></tr>
<tr><td><strong>Search data register</strong> (n bit vào)</td><td>Giữ mẫu tìm kiếm và lái các đường search</td></tr>
<tr><td><strong>CAM cell array</strong> — <em>m từ, n bit mỗi từ</em></td><td>Chính phần lưu trữ; còn có Data Input, Write Enable, Read Enable, Search Enable và một đường Output Data cho việc đọc thông thường</td></tr>
<tr><td><strong>Match detection/encoder &amp; sense amplifiers</strong> → <strong>Address encoder</strong></td><td>Biến m đường match thành một địa chỉ khớp</td></tr>
</table>
<ul>
<li><strong>Đọc phần (a) theo từng hàng là lời khẳng định "một chu kỳ" trở nên hiển nhiên.</strong> Không hàng nào chờ hàng nào; cả bốn phép so xảy ra đồng thời ngay khi các đường search ổn định. Thời gian tìm KHÔNG tăng theo m — chỉ có dây nối và điện năng tăng.</li>
<li><strong>Vì sao phải nối cả SL lẫn bù của nó.</strong> Một ô phải phát hiện được cả "tôi giữ 1 mà anh hỏi 0" lẫn "tôi giữ 0 mà anh hỏi 1". Có cả đường thuận và đường bù thì mỗi ô chỉ cần một cặp transistor là kéo được đường match xuống với cả hai kiểu lệch — đúng ô CAM kinh điển.</li>
<li><strong>Đường match là một phép AND nối dây.</strong> Chỉ cần MỘT bit lệch là cả đường bị kéo xuống thấp. Đó là lý do ba hàng ghi "mismatch": phải khớp hoàn hảo mới sống sót.</li>
<li><strong>Đem nó ánh xạ sang cache.</strong> Search data = trường tag của địa chỉ. CAM cell array = kho tag. Match address = số hiệu dòng cache. Đó đúng là Figure 5.10 ở slide kế, chỉ có điều ở đây được vẽ tới mức transistor.</li>
<li><strong>Phần (b) cho thấy CAM VẪN là một bộ nhớ.</strong> Nó có Write Enable và Read Enable như mọi RAM — đường tìm kiếm là một khả năng <em>THÊM VÀO</em> một mảng bình thường, và chính vì thế nó tốn thêm khoảng 60% diện tích.</li>
</ul>
<p class="pitfall">⚠️ Đừng lẫn <em>match address</em> với địa chỉ bộ nhớ. Ở phần (a), đáp án "01" nghĩa là "chỗ khớp nằm ở từ đã lưu số 1" — nó là chỉ số TRONG CAM, không phải địa chỉ bộ nhớ chính. Trong một cache, chỉ số đó chính là số hiệu dòng cache.</p>`],
      [18, 'Figure 5.10 — Fully Associative Cache Organization (Tag | Offset, and m comparators)',
        `<p class="y-chinh">🎯 The same drawing as Figure 5.7, with one field deleted and one comparator multiplied. The address is now just <strong>Tag (s bits) | Offset (w bits)</strong> — <em>no line-number field at all</em> — and a column of "=?" diamonds compares the tag against every stored tag simultaneously.</p>
<table>
<tr><th>Figure 5.7 (direct)</th><th>Figure 5.10 (fully associative)</th></tr>
<tr><td>Address = <code>Tag (s−r) | Line (r) | Offset (w)</code></td><td>Address = <code>Tag (s) | Offset (w)</code></td></tr>
<tr><td>Line field indexes one row</td><td>Nothing indexes anything — every row is examined</td></tr>
<tr><td>One <strong>Compare</strong> unit</td><td>One "<strong>=?</strong>" comparator <em>per line</em>, feeding <strong>Check for hit</strong></td></tr>
<tr><td>Tags stored in ordinary SRAM</td><td>Tags stored in <strong>CAM</strong>; blocks still in <strong>SRAM</strong> (labelled on the figure)</td></tr>
<tr><td>Hit signal enables Select</td><td><strong>Line number (enable)</strong> — produced by the comparison — drives Select</td></tr>
</table>
<ul>
<li><strong>Read the arrow direction to see the fundamental difference.</strong> In direct mapping the line number is an <em>input</em>, computed from the address. Here the line number is an <em>output</em>, produced by whichever comparator matched. That reversal is the whole idea of associative lookup.</li>
<li><strong>The tag got bigger, and that is not free.</strong> With no line field, every bit that used to identify a line now has to live in the tag. In the Figure 5.11 example (next slide) the tag grows from <strong>8 bits to 22 bits</strong> — and you must store that wider tag in <em>every one</em> of the 16384 lines.</li>
<li><strong>Cost, quantified.</strong> Direct: 16384 × 8 = 131 072 tag bits and one comparator. Fully associative: 16384 × 22 = 360 448 tag bits in CAM (≈60% more area per bit) and 16384 comparators. Roughly <strong>2,75× the tag bits</strong>, on a technology that is itself 60% larger. That is why nobody builds a fully associative L1.</li>
<li><strong>What you buy for that price.</strong> Zero conflict misses. A block can go anywhere, so the thrashing of slide 13 is impossible; a miss now means the cache is genuinely full (a <em>capacity</em> miss) or the data was never fetched (a <em>compulsory</em> miss).</li>
<li><strong>And what you now owe.</strong> Because any line may be chosen, something must choose — a <strong>replacement algorithm</strong> (LRU, FIFO, LFU, Random; slides 25–26). Direct mapping never needed one. Freedom of placement and the need for a replacement policy are the same coin.</li>
</ul>
<p class="meo">💡 Compare the two figures side by side and say it in one line: <em>direct mapping spends address bits to avoid comparators; fully associative spends comparators to avoid conflicts.</em></p>
<p class="pitfall">⚠️ A frequent exam error: writing three fields for fully associative mapping. There are only <strong>two</strong> — Tag and Word/Offset. If your answer has a "line" field, you have described set-associative or direct mapping by mistake.</p>`,
        `<p class="y-chinh">🎯 Vẫn bức hình của Figure 5.7, chỉ xoá đi một trường và nhân bộ so sánh lên. Địa chỉ giờ chỉ còn <strong>Tag (s bit) | Offset (w bit)</strong> — <em>KHÔNG có trường số hiệu dòng nào cả</em> — và một cột các hình thoi "=?" so tag với mọi tag đang lưu cùng lúc.</p>
<table>
<tr><th>Figure 5.7 (trực tiếp)</th><th>Figure 5.10 (kết hợp toàn phần)</th></tr>
<tr><td>Địa chỉ = <code>Tag (s−r) | Line (r) | Offset (w)</code></td><td>Địa chỉ = <code>Tag (s) | Offset (w)</code></td></tr>
<tr><td>Trường Line đánh chỉ số vào một hàng</td><td>Không có gì đánh chỉ số vào đâu — MỌI hàng đều bị soi</td></tr>
<tr><td>MỘT khối <strong>Compare</strong></td><td>MỖI DÒNG một bộ so sánh "<strong>=?</strong>", cùng đổ về <strong>Check for hit</strong></td></tr>
<tr><td>Tag lưu trong SRAM thường</td><td>Tag lưu trong <strong>CAM</strong>; khối dữ liệu vẫn ở <strong>SRAM</strong> (hình ghi rõ)</td></tr>
<tr><td>Tín hiệu Hit mở cổng Select</td><td><strong>Line number (enable)</strong> — do phép so sinh ra — mới lái Select</td></tr>
</table>
<ul>
<li><strong>Nhìn chiều mũi tên là thấy khác biệt gốc rễ.</strong> Ở ánh xạ trực tiếp, số hiệu dòng là ĐẦU VÀO, tính ra từ địa chỉ. Ở đây, số hiệu dòng là ĐẦU RA, do bộ so sánh nào khớp thì sinh ra. Chính sự ĐẢO CHIỀU đó là toàn bộ ý tưởng của tra cứu kết hợp.</li>
<li><strong>Tag phình to ra, và nó không miễn phí.</strong> Không còn trường line thì mọi bit từng dùng để định danh dòng nay phải chui vào tag. Trong ví dụ Figure 5.11 (slide kế), tag phình từ <strong>8 bit lên 22 bit</strong> — và bạn phải lưu cái tag rộng đó ở <em>MỖI MỘT</em> trong 16384 dòng.</li>
<li><strong>Chi phí, tính bằng số.</strong> Trực tiếp: 16384 × 8 = 131 072 bit tag và MỘT bộ so sánh. Toàn phần: 16384 × 22 = 360 448 bit tag nằm trong CAM (mỗi bit lại tốn thêm ~60% diện tích) và 16384 bộ so sánh. Xấp xỉ <strong>gấp 2,75 lần số bit tag</strong>, trên một công nghệ tự nó đã to hơn 60%. Đó là lý do không ai dựng L1 kết hợp toàn phần.</li>
<li><strong>Cái giá đó mua được gì.</strong> KHÔNG CÒN trượt do xung đột. Khối nào cũng đi đâu cũng được, nên hiện tượng thrashing ở slide 13 là bất khả; trượt giờ chỉ có nghĩa cache ĐÃ ĐẦY THẬT (trượt do <em>dung lượng</em>) hoặc dữ liệu chưa từng được nạp (trượt <em>bắt buộc</em>).</li>
<li><strong>Và bạn nợ lại cái gì.</strong> Vì dòng nào cũng có thể được chọn nên phải có kẻ đứng ra chọn — một <strong>THUẬT TOÁN THAY THẾ</strong> (LRU, FIFO, LFU, Random; slide 25–26). Ánh xạ trực tiếp chưa bao giờ cần tới nó. Tự do đặt chỗ và nhu cầu có chính sách thay thế là hai mặt của cùng một đồng xu.</li>
</ul>
<p class="meo">💡 Đặt hai hình cạnh nhau rồi nói một câu: <em>ánh xạ trực tiếp TIÊU BIT ĐỊA CHỈ để khỏi tốn bộ so sánh; kết hợp toàn phần TIÊU BỘ SO SÁNH để khỏi bị xung đột.</em></p>
<p class="pitfall">⚠️ Lỗi hay gặp trong đề: viết BA trường cho ánh xạ kết hợp toàn phần. Chỉ có <strong>HAI</strong> — Tag và Word/Offset. Nếu đáp án của bạn có trường "line" thì bạn đã mô tả nhầm sang ánh xạ theo tập hoặc ánh xạ trực tiếp.</p>`],

      [19, 'Figure 5.11 — Associative Mapping Example (the same memory, now with a 22-bit tag)',
        `<p class="y-chinh">🎯 The deliberate twin of Figure 5.8. Same 16 MByte main memory, same 16 K-line cache, same data values — only the address split changes, from <code>8 | 14 | 2</code> to <strong><code>Tag (22 bits) | Word (2 bits)</code></strong>. Comparing the two figures is the fastest way to understand what associativity actually costs and buys.</p>
<table>
<tr><th></th><th>Figure 5.8 (direct)</th><th>Figure 5.11 (associative)</th></tr>
<tr><td>Address split</td><td>Tag 8 | Line 14 | Word 2</td><td><strong>Tag 22 | Word 2</strong></td></tr>
<tr><td>Tag stored per line</td><td>8 bits</td><td><strong>22 bits</strong></td></tr>
<tr><td>Where a block may sit</td><td>Exactly one line</td><td><strong>Any of the 16384 lines</strong></td></tr>
<tr><td>Tag of address 0x16339C</td><td>16 (line 0CE7)</td><td><strong>058CE7</strong></td></tr>
</table>
<p class="nhan">Cách tính tag kết hợp · How the associative tag is computed</p>
<p>With no line field, the tag is simply <strong>the address with the word bits removed</strong> — i.e. the block number: <code>tag = address &gt;&gt; w</code>. Checked with python3 against every value printed on the slide:</p>
<table>
<tr><th>Address</th><th>address &gt;&gt; 2</th><th>Tag printed on the slide</th><th>Data</th></tr>
<tr><td>0x000000</td><td>0x000000</td><td>000000</td><td>13579246</td></tr>
<tr><td>0x16339C</td><td>0x058CE7</td><td>058CE7</td><td>FEDCBA98</td></tr>
<tr><td>0xFFFFF4</td><td>0x3FFFFD</td><td>3FFFFD</td><td>33333333</td></tr>
<tr><td>0xFFFFF8</td><td>0x3FFFFE</td><td>3FFFFE</td><td>11223344</td></tr>
<tr><td>0xFFFFFC</td><td>0x3FFFFF</td><td>3FFFFF</td><td>24682468</td></tr>
</table>
<p class="dap-an">✅ Đáp án: all five tags on the slide are correct, and the relationship is exactly <code>tag = address ÷ 4</code> because the block size is 4 bytes. Sanity check on the width: 22 bits gives 2<sup>22</sup> = 4 194 304 distinct tags, which is precisely the number of 4-byte blocks in a 16 MB memory — so the tag identifies the block <em>uniquely</em>, with nothing left over. That is the definition of a fully associative tag.</p>
<p class="nhan">Điều hình này chứng minh mà Figure 5.8 không làm được · What this figure proves</p>
<ul>
<li><strong>Look at the cache snapshot on the right.</strong> Line 0000 holds tag 3FFFFE, line 0001 holds tag 058CE7, line 3FFD holds 3FFFFD, line 3FFE holds 000000, line 3FFF holds 3FFFFF. The tags are in no particular order — because there <em>is</em> no order. A block went wherever there was room.</li>
<li><strong>Compare that with Figure 5.8, where line 0CE7 could only ever hold a block whose line field was 0CE7.</strong> Here the block with tag 058CE7 sits in line 0001 and would have been equally happy in line 9999.</li>
<li><strong>The collision of slide 15 cannot happen here.</strong> Addresses 0x000000 and 0x160000 have different tags (000000 and 058000) and no shared index, so both can be resident at once. That is the conflict-miss problem solved outright.</li>
<li><strong>But now something must decide.</strong> When all 16384 lines are occupied and a new block arrives, hardware picks a victim — LRU, FIFO, LFU or Random (slides 25–26). Figure 5.8 never faced that question.</li>
<li><strong>Counting the cost once more.</strong> 16384 lines × 22 tag bits = 360 448 bits of CAM here, versus 16384 × 8 = 131 072 bits of ordinary SRAM in Figure 5.8. Same data capacity, roughly 2,75× the tag storage, in a technology about 60% larger per bit.</li>
</ul>
<p class="pitfall">⚠️ The "Line Number" column on the right of this figure is <strong>not part of the address</strong>. It is just the row number of the picture, telling you where the block happened to land. Reading it as an address field is the most common misreading of Figure 5.11.</p>`,
        `<p class="y-chinh">🎯 Bản sinh đôi cố ý của Figure 5.8. Vẫn bộ nhớ chính 16 MByte đó, vẫn cache 16 K dòng đó, vẫn những giá trị dữ liệu đó — chỉ đổi cách chia địa chỉ, từ <code>8 | 14 | 2</code> thành <strong><code>Tag (22 bit) | Word (2 bit)</code></strong>. Đặt hai hình cạnh nhau là cách nhanh nhất để hiểu tính kết hợp thật sự tốn gì và mua được gì.</p>
<table>
<tr><th></th><th>Figure 5.8 (trực tiếp)</th><th>Figure 5.11 (kết hợp)</th></tr>
<tr><td>Cách chia địa chỉ</td><td>Tag 8 | Line 14 | Word 2</td><td><strong>Tag 22 | Word 2</strong></td></tr>
<tr><td>Tag lưu ở mỗi dòng</td><td>8 bit</td><td><strong>22 bit</strong></td></tr>
<tr><td>Khối được phép nằm đâu</td><td>Đúng một dòng</td><td><strong>Bất kỳ dòng nào trong 16384 dòng</strong></td></tr>
<tr><td>Tag của địa chỉ 0x16339C</td><td>16 (dòng 0CE7)</td><td><strong>058CE7</strong></td></tr>
</table>
<p class="nhan">Cách tính tag kết hợp</p>
<p>Không có trường line thì tag chỉ đơn giản là <strong>địa chỉ bỏ đi mấy bit word</strong> — tức chính SỐ HIỆU KHỐI: <code>tag = địa chỉ &gt;&gt; w</code>. Đã kiểm bằng python3 với mọi giá trị in trên slide:</p>
<table>
<tr><th>Địa chỉ</th><th>địa chỉ &gt;&gt; 2</th><th>Tag in trên slide</th><th>Dữ liệu</th></tr>
<tr><td>0x000000</td><td>0x000000</td><td>000000</td><td>13579246</td></tr>
<tr><td>0x16339C</td><td>0x058CE7</td><td>058CE7</td><td>FEDCBA98</td></tr>
<tr><td>0xFFFFF4</td><td>0x3FFFFD</td><td>3FFFFD</td><td>33333333</td></tr>
<tr><td>0xFFFFF8</td><td>0x3FFFFE</td><td>3FFFFE</td><td>11223344</td></tr>
<tr><td>0xFFFFFC</td><td>0x3FFFFF</td><td>3FFFFF</td><td>24682468</td></tr>
</table>
<p class="dap-an">✅ Đáp án: cả năm tag trên slide đều ĐÚNG, và quan hệ đúng bằng <code>tag = địa chỉ ÷ 4</code> vì kích thước khối là 4 byte. Kiểm lại độ rộng cho chắc: 22 bit cho 2<sup>22</sup> = 4 194 304 tag khác nhau, đúng bằng số khối 4 byte trong một bộ nhớ 16 MB — nên tag định danh khối một cách <em>DUY NHẤT</em>, không thừa không thiếu. Đó chính là định nghĩa của tag kết hợp toàn phần.</p>
<p class="nhan">Điều hình này chứng minh mà Figure 5.8 không làm được</p>
<ul>
<li><strong>Nhìn ảnh chụp cache bên phải.</strong> Dòng 0000 giữ tag 3FFFFE, dòng 0001 giữ 058CE7, dòng 3FFD giữ 3FFFFD, dòng 3FFE giữ 000000, dòng 3FFF giữ 3FFFFF. Các tag chẳng theo thứ tự nào — vì làm gì <em>CÓ</em> thứ tự. Khối rơi vào bất cứ chỗ nào còn trống.</li>
<li><strong>So với Figure 5.8, nơi dòng 0CE7 vĩnh viễn chỉ chứa nổi khối nào có trường line bằng 0CE7.</strong> Ở đây khối mang tag 058CE7 ngồi ở dòng 0001, và nó cũng vui vẻ y như vậy nếu ngồi ở dòng 9999.</li>
<li><strong>Cú va chạm ở slide 15 KHÔNG thể xảy ra ở đây.</strong> Địa chỉ 0x000000 và 0x160000 có tag khác nhau (000000 và 058000) và không dùng chung chỉ số nào, nên cả hai cùng nằm trong cache được. Bài toán trượt do xung đột được giải dứt điểm.</li>
<li><strong>Nhưng giờ phải có kẻ QUYẾT ĐỊNH.</strong> Khi cả 16384 dòng đã kín mà có khối mới tới, phần cứng phải chọn một nạn nhân — LRU, FIFO, LFU hay Random (slide 25–26). Figure 5.8 chưa bao giờ phải đối mặt câu hỏi đó.</li>
<li><strong>Tính lại cái giá một lần nữa.</strong> 16384 dòng × 22 bit tag = 360 448 bit CAM ở đây, so với 16384 × 8 = 131 072 bit SRAM thường ở Figure 5.8. Cùng dung lượng dữ liệu, gấp khoảng 2,75 lần kho tag, trên một công nghệ tốn thêm chừng 60% diện tích mỗi bit.</li>
</ul>
<p class="pitfall">⚠️ Cột "Line Number" bên phải hình này <strong>KHÔNG phải một phần của địa chỉ</strong>. Nó chỉ là số thứ tự hàng trong bức tranh, cho bạn biết khối tình cờ rơi vào đâu. Đọc nó thành một trường địa chỉ là cách đọc sai phổ biến nhất của Figure 5.11.</p>`],
      [20, 'Set Associative Mapping — the compromise that real caches actually use',
        `<p class="y-chinh">🎯 The slide states it as a deal: a "<strong>compromise that exhibits the strengths of both the direct and associative approaches while reducing their disadvantages</strong>". Keep the cheap index of direct mapping, but let a block choose among a handful of lines instead of exactly one.</p>
<ul>
<li><strong>The structure, in the slide's own four lines.</strong> "Cache consists of a number of <strong>sets</strong>" · "Each set contains a number of <strong>lines</strong>" · "A given block maps to <strong>any line in a given set</strong>" · example: "e.g. 2 lines per set → <strong>2-way associative mapping</strong>; a given block can be in one of 2 lines in only one set".</li>
<li><strong>Read the address split straight off that description.</strong> <code>Tag | Set | Word</code>. The Set field is computed exactly like the Line field of direct mapping — <code>set = block number mod v</code> — and then the tag is compared against all <em>k</em> lines of that one set.</li>
<li><strong>The formulas, adapted.</strong> Number of sets <code>v = cache size ÷ (block size × k)</code>, so the set field is <code>d = log<sub>2</sub>v</code> bits, and <code>tag = address bits − w − d</code>. Compared with direct mapping at the same capacity, going k-way <em>shrinks</em> the index by log<sub>2</sub>k bits and <em>grows</em> the tag by the same log<sub>2</sub>k bits.</li>
<li><strong>Worked micro-example.</strong> 32-bit address, 64-byte blocks, 32 kB cache, <strong>4-way</strong>. Lines = 512, sets = 512 ÷ 4 = 128 = 2<sup>7</sup>. So <code>w = 6</code>, <code>d = 7</code>, <code>tag = 32 − 6 − 7 = 19</code>. The same cache as direct-mapped had <code>tag 17 | line 9 | offset 6</code> — two bits moved from index to tag, exactly log<sub>2</sub>4 = 2.</li>
<li><strong>Why k = 2 already buys most of the benefit.</strong> Direct mapping fails when <em>two</em> hot blocks share an index — the commonest case by far. A 2-way set holds both. Going 4-way and 8-way keeps helping, but with sharply diminishing returns, which is why Figure 5.15 (slide 24) plots hit ratio against associativity and the curves converge.</li>
<li><strong>The two endpoints are special cases, and saying so is worth marks.</strong> <code>k = 1</code> → v = m sets of one line → <strong>direct mapping</strong>. <code>v = 1</code> → one set of m lines → <strong>fully associative</strong>. Set associative is the general case containing both.</li>
</ul>
<p class="dap-an">✅ Đáp án — re-run the thrashing test from slide 13 mentally under 2-way associativity: addresses 0x00010000 and 0x00018000 still land in the same set, but the set now has two lines, so both blocks stay resident and the alternating loop hits every time instead of missing every time. One extra comparator removed a 2,1× slowdown — which is precisely the trade this slide is selling.</p>
<p class="pitfall">⚠️ Terminology trap. "<strong>k-way</strong>" counts the lines <em>per set</em>, not the number of sets. A 4-way 32 kB cache with 64-byte lines has 512 lines and <strong>128 sets</strong>, not 4 sets. Get that backwards and every bit count in the question comes out wrong.</p>`,
        `<p class="y-chinh">🎯 Slide phát biểu nó như một phi vụ đổi chác: "<strong>một thoả hiệp phát huy điểm mạnh của cả cách trực tiếp lẫn cách kết hợp trong khi giảm bớt nhược điểm của cả hai</strong>". Giữ lại phép đánh chỉ số rẻ tiền của ánh xạ trực tiếp, nhưng cho một khối được chọn giữa dăm ba dòng thay vì đúng một dòng.</p>
<ul>
<li><strong>Cấu trúc, theo đúng bốn dòng của slide.</strong> "Cache gồm một số <strong>TẬP</strong>" · "Mỗi tập chứa một số <strong>DÒNG</strong>" · "Một khối cho trước ánh xạ vào <strong>BẤT KỲ DÒNG NÀO TRONG MỘT TẬP cho trước</strong>" · ví dụ: "2 dòng mỗi tập → <strong>ánh xạ kết hợp 2 đường</strong>; một khối cho trước có thể nằm ở một trong 2 dòng, và chỉ trong một tập".</li>
<li><strong>Đọc thẳng cách chia địa chỉ ra từ mô tả đó.</strong> <code>Tag | Set | Word</code>. Trường Set tính y hệt trường Line của ánh xạ trực tiếp — <code>set = số hiệu khối mod v</code> — rồi tag được đem so với cả <em>k</em> dòng của đúng tập đó.</li>
<li><strong>Công thức, chỉnh lại cho hợp.</strong> Số tập <code>v = kích thước cache ÷ (kích thước khối × k)</code>, nên trường set rộng <code>d = log<sub>2</sub>v</code> bit, và <code>tag = số bit địa chỉ − w − d</code>. So với ánh xạ trực tiếp cùng dung lượng, chuyển sang k đường làm chỉ số <em>NGẮN ĐI</em> log<sub>2</sub>k bit và tag <em>DÀI RA</em> đúng log<sub>2</sub>k bit ấy.</li>
<li><strong>Ví dụ nhỏ giải luôn.</strong> Địa chỉ 32 bit, khối 64 byte, cache 32 kB, <strong>4 đường</strong>. Số dòng = 512, số tập = 512 ÷ 4 = 128 = 2<sup>7</sup>. Vậy <code>w = 6</code>, <code>d = 7</code>, <code>tag = 32 − 6 − 7 = 19</code>. Cũng cache đó khi ánh xạ trực tiếp là <code>tag 17 | line 9 | offset 6</code> — hai bit đã chuyển từ chỉ số sang tag, đúng bằng log<sub>2</sub>4 = 2.</li>
<li><strong>Vì sao k = 2 đã ăn được phần lớn cái lợi.</strong> Ánh xạ trực tiếp hỏng khi <em>HAI</em> khối nóng dùng chung một chỉ số — trường hợp phổ biến hơn hẳn mọi trường hợp khác. Một tập 2 dòng chứa được cả hai. Lên 4 rồi 8 đường vẫn còn tốt lên, nhưng lợi ích giảm dần rất nhanh, và đó là lý do Figure 5.15 (slide 24) vẽ tỉ lệ trúng theo độ kết hợp rồi thấy các đường cong chụm lại.</li>
<li><strong>Hai đầu mút là trường hợp đặc biệt, và nói được điều đó là có điểm.</strong> <code>k = 1</code> → v = m tập, mỗi tập một dòng → <strong>ánh xạ trực tiếp</strong>. <code>v = 1</code> → một tập gồm m dòng → <strong>kết hợp toàn phần</strong>. Kết hợp theo tập là trường hợp TỔNG QUÁT chứa cả hai.</li>
</ul>
<p class="dap-an">✅ Đáp án — chạy lại phép thử thrashing ở slide 13 trong đầu, lần này với độ kết hợp 2 đường: địa chỉ 0x00010000 và 0x00018000 vẫn rơi vào cùng một TẬP, nhưng tập ấy giờ có HAI dòng, nên cả hai khối cùng nằm lại và vòng lặp luân phiên TRÚNG mọi lần thay vì TRƯỢT mọi lần. Một bộ so sánh thêm vào đã xoá đi cú chậm 2,1 lần — đúng cái phi vụ mà slide này đang chào bán.</p>
<p class="pitfall">⚠️ Bẫy thuật ngữ. "<strong>k đường</strong>" đếm số DÒNG TRONG MỘT TẬP, không phải số tập. Một cache 32 kB, dòng 64 byte, 4 đường thì có 512 dòng và <strong>128 TẬP</strong>, không phải 4 tập. Lộn ngược chỗ này là mọi phép đếm bit trong bài ra sai hết.</p>`],

      [21, 'Figure 5.12 — Mapping from Main Memory to Cache: k-Way Set Associative (two equivalent readings)',
        `<p class="y-chinh">🎯 One organization drawn twice, because there are two correct ways to picture it — and being able to switch between them is what makes set-associative questions easy.</p>
<table>
<tr><th>View</th><th>What the figure shows</th><th>Useful for</th></tr>
<tr><td><strong>(a) v associative-mapped caches</strong></td><td>The first <em>v</em> blocks of main memory (equal to the <strong>number of sets</strong>) fan out into "Cache memory - set 0" … "Cache memory - set v−1", each set being <em>k</em> lines L<sub>0</sub> … L<sub>k−1</sub></td><td>Understanding the <em>rule</em>: pick the set by index, then search inside it associatively</td></tr>
<tr><td><strong>(b) k direct-mapped caches</strong></td><td>The same v blocks map straight across into "Cache memory - way 1" … "Cache memory - way k", each of <em>v</em> lines; one horizontal slice across all ways is "one set"</td><td>Understanding the <em>hardware</em>: k independent direct-mapped arrays read in parallel</td></tr>
</table>
<ul>
<li><strong>The two drawings describe the same cache.</strong> View (a) groups by set; view (b) groups by way. In (a) a set is a column of k lines; in (b) a set is a row across k arrays. Nothing about the machine changes — only how you slice the picture.</li>
<li><strong>Why view (b) is how it is actually built.</strong> Each "way" is an ordinary direct-mapped cache with its own tag array and its own comparator. Feed the same set index to all k of them, read all k tags at once, and compare. That is exactly Figure 5.13 on the next slide.</li>
<li><strong>Why view (a) is how it is taught.</strong> It makes the rule obvious: "each block of main memory maps to <em>one unique cache set</em>" (Table 5.3), and within that set the block may go anywhere. It also makes the two degenerate cases visible — collapse k to 1 and you have Figure 5.6(a); collapse v to 1 and you have Figure 5.6(b).</li>
<li><strong>Note the caption on both halves:</strong> "First <em>v</em> blocks of main memory (equal to <strong>number of sets</strong>)". In Figure 5.6 the equivalent caption said "equal to <strong>size of cache</strong>". That one-word difference is the whole change: the index now selects a set, not a line, so the repeating period is v rather than m.</li>
<li><strong>Consequence for the arithmetic.</strong> Blocks whose numbers differ by a multiple of <em>v</em> (not m) collide — but now a collision is harmless up to k blocks deep. Multiply k by 2 and you halve the number of address bits used as index while doubling the depth of forgiveness.</li>
</ul>
<p class="meo">💡 Learn to say both sentences: "<em>k-way set associative = v associative caches of k lines each</em>" and "<em>k-way set associative = k direct-mapped caches of v lines each</em>". Different exam questions reward different halves of that pair.</p>`,
        `<p class="y-chinh">🎯 Một tổ chức được vẽ HAI LẦN, vì có hai cách hình dung đều đúng — và chuyển qua lại được giữa hai cách là thứ làm cho câu hỏi về kết hợp theo tập trở nên dễ.</p>
<table>
<tr><th>Góc nhìn</th><th>Hình vẽ gì</th><th>Dùng để hiểu gì</th></tr>
<tr><td><strong>(a) v associative-mapped caches</strong></td><td><em>v</em> khối đầu của bộ nhớ chính (bằng <strong>SỐ TẬP</strong>) xoè ra vào "Cache memory - set 0" … "Cache memory - set v−1", mỗi tập gồm <em>k</em> dòng L<sub>0</sub> … L<sub>k−1</sub></td><td>Hiểu <em>QUY TẮC</em>: chọn tập bằng chỉ số, rồi tìm kết hợp BÊN TRONG tập đó</td></tr>
<tr><td><strong>(b) k direct-mapped caches</strong></td><td>Vẫn v khối đó ánh xạ thẳng sang "Cache memory - way 1" … "Cache memory - way k", mỗi đường <em>v</em> dòng; một lát cắt NGANG qua mọi đường chính là "một tập"</td><td>Hiểu <em>PHẦN CỨNG</em>: k mảng ánh xạ trực tiếp độc lập, đọc song song</td></tr>
</table>
<ul>
<li><strong>Hai hình mô tả CÙNG một cache.</strong> Góc nhìn (a) gom theo TẬP; góc nhìn (b) gom theo ĐƯỜNG. Ở (a) một tập là một cột k dòng; ở (b) một tập là một hàng cắt ngang k mảng. Cỗ máy không đổi gì cả — chỉ đổi cách bạn cắt bức tranh.</li>
<li><strong>Vì sao (b) mới là cách dựng thật.</strong> Mỗi "đường" là một cache ánh xạ trực tiếp bình thường, có mảng tag riêng và bộ so sánh riêng. Đưa cùng một chỉ số tập cho cả k cái, đọc cả k tag một lượt, rồi so. Đó đúng là Figure 5.13 ở slide kế.</li>
<li><strong>Vì sao (a) mới là cách dạy.</strong> Nó làm quy tắc hiện rõ: "mỗi khối bộ nhớ chính ánh xạ vào <em>ĐÚNG MỘT TẬP</em>" (Bảng 5.3), và trong tập đó khối muốn nằm đâu cũng được. Nó cũng làm hai trường hợp suy biến hiện ra — bóp k về 1 là được Figure 5.6(a); bóp v về 1 là được Figure 5.6(b).</li>
<li><strong>Để ý chú thích ở cả hai nửa:</strong> "v khối đầu của bộ nhớ chính (bằng <strong>SỐ TẬP</strong>)". Ở Figure 5.6, câu tương ứng nói "bằng <strong>KÍCH THƯỚC CACHE</strong>". Đúng một chữ khác nhau đó là toàn bộ sự thay đổi: chỉ số giờ chọn một TẬP chứ không chọn một DÒNG, nên chu kỳ lặp lại là v chứ không phải m.</li>
<li><strong>Hệ quả cho phần số học.</strong> Các khối có số hiệu chênh nhau một bội của <em>v</em> (không phải m) thì va nhau — nhưng giờ va nhau vô hại cho tới độ sâu k khối. Nhân k lên gấp đôi là chia đôi số bit địa chỉ dùng làm chỉ số, đồng thời nhân đôi độ "tha thứ".</li>
</ul>
<p class="meo">💡 Tập nói được CẢ HAI câu: "<em>kết hợp theo tập k đường = v cache kết hợp, mỗi cái k dòng</em>" và "<em>kết hợp theo tập k đường = k cache ánh xạ trực tiếp, mỗi cái v dòng</em>". Mỗi kiểu câu hỏi thi thưởng cho một nửa khác nhau của cặp đó.</p>`],

      [22, 'Figure 5.13 — k-Way Set Associative Cache Organization (Tag | Set number | Offset)',
        `<p class="y-chinh">🎯 The third and last of the three organization diagrams, and the one that describes essentially every cache in a real processor today. The address splits into <strong><code>Tag (s − d bits) | Set number (d bits) | Offset (w bits)</code></strong>, the set number is broadcast to all k ways, and k Compare/Select pairs work in parallel.</p>
<table>
<tr><th>Element</th><th>What it does</th></tr>
<tr><td><strong>Set number (d bits)</strong></td><td>Sent <em>simultaneously</em> to "Lines for Way 0" … "Lines for Way k−1", selecting the same row in every way (the green highlighted line)</td></tr>
<tr><td><strong>Tag (s − d bits)</strong></td><td>Sent to every <strong>Compare</strong> unit — k comparisons, one per way, all at once</td></tr>
<tr><td><strong>Offset (w bits)</strong></td><td>Feeds every <strong>Select</strong> unit, extracting the requested word from whichever block wins</td></tr>
<tr><td><strong>Data to CPU</strong> (one per way)</td><td>Only the way whose Compare succeeded actually drives data out</td></tr>
<tr><td><strong>AND</strong> gate at the bottom, fed by every way's <em>Miss</em> line → <strong>Access main memory for data</strong></td><td>The cache misses only if <strong>ALL</strong> ways miss. One way hitting is a hit</td></tr>
</table>
<ul>
<li><strong>The AND gate is the most instructive part of the figure.</strong> In Figure 5.7 a single Compare decided everything. Here "miss" is a conjunction: every one of the k comparators must have failed. Read it aloud — "miss AND miss AND … AND miss" — and the definition of set-associative lookup is complete.</li>
<li><strong>Compare the three diagrams and the pattern is one moving boundary.</strong> Figure 5.7: index 9 bits, tag 17, one comparator. Figure 5.13 at 4-way on the same cache: index 7 bits, tag 19, four comparators. Figure 5.10: index 0 bits, tag 26, m comparators. Associativity simply slides bits from the index into the tag and pays for it in comparators.</li>
<li><strong>Why this shape won.</strong> It keeps a single fast index decode (so lookup stays one cycle), needs only k comparators instead of m, tolerates the two-hot-blocks case that kills direct mapping, and needs a replacement algorithm over just k candidates instead of thousands. Every point of Table 5.3 lands in its favour.</li>
<li><strong>Bits, on the standard example.</strong> 32-bit address, 64 B lines, 32 kB: direct = <code>17 | 9 | 6</code>; 2-way = <code>18 | 8 | 6</code>; 4-way = <code>19 | 7 | 6</code>; 8-way = <code>20 | 6 | 6</code>; fully associative = <code>26 | – | 6</code>. Every doubling of k moves exactly one bit from the middle field to the left field.</li>
<li><strong>What comes next in the chapter.</strong> Slide 23 works a two-way example numerically, slide 24 plots hit ratio against associativity and cache size, and slide 25 finally asks the question this organization created: when a set is full, <em>which of the k lines do you evict?</em></li>
</ul>
<p class="meo">💡 Three sentences, three diagrams, the whole mapping story: <em>direct = compute the line · fully associative = search every line · set associative = compute the set, then search inside it.</em></p>
<p class="pitfall">⚠️ When a problem says "4-way set associative", do <strong>not</strong> compute the index from the number of lines. Compute it from the number of <strong>sets</strong>: <code>sets = cache size ÷ (block size × k)</code>. Forgetting to divide by k is the single most common error in set-associative address splitting — it costs you log<sub>2</sub>k bits in both the index and the tag at once.</p>`,
        `<p class="y-chinh">🎯 Cái thứ ba và cũng là cuối cùng trong ba sơ đồ tổ chức, và là cái mô tả gần như MỌI cache trong bộ xử lý thật ngày nay. Địa chỉ tách thành <strong><code>Tag (s − d bit) | Set number (d bit) | Offset (w bit)</code></strong>, số hiệu tập được phát tới cả k đường, và k cặp Compare/Select làm việc song song.</p>
<table>
<tr><th>Thành phần</th><th>Nó làm gì</th></tr>
<tr><td><strong>Set number (d bit)</strong></td><td>Gửi <em>ĐỒNG THỜI</em> tới "Lines for Way 0" … "Lines for Way k−1", chọn CÙNG một hàng ở mọi đường (dòng tô xanh)</td></tr>
<tr><td><strong>Tag (s − d bit)</strong></td><td>Gửi tới MỌI khối <strong>Compare</strong> — k phép so, mỗi đường một phép, tất cả cùng lúc</td></tr>
<tr><td><strong>Offset (w bit)</strong></td><td>Nuôi mọi khối <strong>Select</strong>, rút đúng từ được hỏi ra khỏi khối nào thắng</td></tr>
<tr><td><strong>Data to CPU</strong> (mỗi đường một đường ra)</td><td>Chỉ đường nào có Compare thành công mới thực sự đẩy dữ liệu ra</td></tr>
<tr><td>Cổng <strong>AND</strong> dưới cùng, nhận đường <em>Miss</em> của MỌI đường → <strong>Access main memory for data</strong></td><td>Cache chỉ TRƯỢT nếu <strong>TẤT CẢ</strong> các đường đều trượt. Một đường trúng là trúng</td></tr>
</table>
<ul>
<li><strong>Cổng AND là phần dạy được nhiều nhất của hình.</strong> Ở Figure 5.7 một khối Compare duy nhất quyết tất. Ở đây "trượt" là một phép HỘI: cả k bộ so sánh đều phải thất bại. Đọc to lên — "trượt VÀ trượt VÀ … VÀ trượt" — là xong định nghĩa của tra cứu kết hợp theo tập.</li>
<li><strong>So ba sơ đồ thì thấy quy luật chỉ là một đường biên DI CHUYỂN.</strong> Figure 5.7: chỉ số 9 bit, tag 17, một bộ so sánh. Figure 5.13 ở 4 đường trên cùng cache đó: chỉ số 7 bit, tag 19, bốn bộ so sánh. Figure 5.10: chỉ số 0 bit, tag 26, m bộ so sánh. Độ kết hợp chỉ đơn giản là ĐẨY BIT từ chỉ số sang tag và trả tiền bằng bộ so sánh.</li>
<li><strong>Vì sao dáng này thắng.</strong> Nó giữ được một phép giải mã chỉ số nhanh duy nhất (nên tra cứu vẫn một chu kỳ), chỉ cần k bộ so sánh thay vì m, chịu được ca "hai khối nóng" vốn giết ánh xạ trực tiếp, và chỉ cần thuật toán thay thế trên k ứng viên thay vì hàng nghìn. Mọi mục của Bảng 5.3 đều nghiêng về nó.</li>
<li><strong>Đếm bit, trên ví dụ chuẩn.</strong> Địa chỉ 32 bit, dòng 64 B, cache 32 kB: trực tiếp = <code>17 | 9 | 6</code>; 2 đường = <code>18 | 8 | 6</code>; 4 đường = <code>19 | 7 | 6</code>; 8 đường = <code>20 | 6 | 6</code>; kết hợp toàn phần = <code>26 | – | 6</code>. Mỗi lần nhân đôi k là đúng MỘT bit rời trường giữa sang trường trái.</li>
<li><strong>Chương đi tiếp tới đâu.</strong> Slide 23 giải bằng số một ví dụ hai đường, slide 24 vẽ tỉ lệ trúng theo độ kết hợp và kích thước cache, còn slide 25 rốt cuộc đặt ra đúng câu hỏi mà tổ chức này sinh ra: khi một tập đã đầy thì <em>đuổi dòng nào trong k dòng?</em></li>
</ul>
<p class="meo">💡 Ba câu, ba sơ đồ, trọn câu chuyện ánh xạ: <em>trực tiếp = TÍNH ra dòng · kết hợp toàn phần = TÌM mọi dòng · kết hợp theo tập = TÍNH ra tập rồi TÌM bên trong nó.</em></p>
<p class="pitfall">⚠️ Khi đề nói "kết hợp theo tập 4 đường", <strong>ĐỪNG</strong> tính chỉ số từ SỐ DÒNG. Hãy tính từ SỐ <strong>TẬP</strong>: <code>số tập = kích thước cache ÷ (kích thước khối × k)</code>. Quên chia cho k là lỗi phổ biến nhất khi chia địa chỉ cho ánh xạ theo tập — nó làm bạn sai log<sub>2</sub>k bit ở CẢ chỉ số lẫn tag cùng lúc.</p>`],

    ]),
  ].join('\n'),
};
