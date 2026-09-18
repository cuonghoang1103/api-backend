/**
 * CSI106 · Chương 10 — File structure, học theo từng slide: TOÀN BỘ 17 slide.
 * Deck 'csi10' (CSI10), 17 slide, ảnh đã render lên CDN images/academy/CSI106/v1/csi10/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ CSI_10.pptx của trường (/tmp/csi106-text/csi10.txt).
 * Các slide chỉ có tiêu đề + hình (5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17) đã được đọc
 * thẳng từ ảnh đã render để lấy đúng từng nhãn, từng khoá và từng con số trong sơ đồ.
 *
 * MỌI con số byte, mọi dãy hex, mọi kết quả băm và mọi mốc thời gian trong bài đều ĐO THẬT
 * trên máy (macOS arm64, Apple clang), bằng chương trình C biên dịch `cc -Wall` rồi chạy,
 * kèm `ls -l` và `xxd`:
 *   · 12345 dạng text = 5 byte "31 32 33 34 35"; dạng nhị phân = 4 byte "39 30 00 00"
 *   · 3.14 dạng text = 8 byte "3.140000"; dạng nhị phân = 8 byte "1f 85 eb 51 b8 1e 09 40"
 *   · struct {int; char[16]; double} → sizeof = 32 (có 4 byte đệm), 5 bản ghi = 160 byte
 *     nhị phân so với 132 byte text (nhị phân LỚN HƠN — trái trực giác, đã nêu trong bài)
 *   · 1.000.000 số nguyên: text 7.100.000 byte / 0,0759 s · nhị phân 4.000.000 byte / 0,0332 s
 *   · tệp 1.000.000 bản ghi (32 MB): quét tuần tự tới bản ghi 750.001 = 24,0 ms;
 *     fseek+fread = 49 µs → nhanh hơn ~490 lần
 *   · băm chia lấy dư k % 10 với 5 khoá 12345/67890/54321/90210/11115 → 2 va chạm thật,
 *     giải bằng dò tuyến tính và bằng móc xích, in ra từng bước
 *   · kiểm lại toàn bộ số của slide 11–12: key mod 307 + 1
 *   · lỗi kinh điển while (!feof(f)) chạy thừa một vòng — tái hiện thật, 6 vòng / 5 bản ghi
 *
 * Những chỗ SLIDE GỐC SAI, tự mâu thuẫn hoặc thiếu — đã nêu rõ trong bài, KHÔNG im lặng
 * chép lại và KHÔNG tự ý sửa slide:
 *   · slide 2 xếp thứ tự "10.1 Text versus Binary → 10.2 Access methods" nhưng thân bài
 *     dạy NGƯỢC LẠI: slide 4 mở "1 - Access methods", slide 13 mới "2 - Text versus Binary".
 *   · slide 6, 8, 14 vẫn còn trích "Figure 13.2", "Figure 13.5", "Figure 13.15" của Forouzan
 *     chương 13, trong khi hình dán trên slide lại đánh số 10.2, 10.3/10.4, 10.9.
 *   · slide 12 đặt cạnh nhau "Figure 13.11" và "Figure 10.8" — hai hệ đánh số trong CÙNG
 *     một slide.
 *   · slide 11 (Hình 10.7) xếp khoá 166702 ở địa chỉ 004, nhưng 166702 mod 307 + 1 = 2
 *     (đo thật). Đó là một VA CHẠM đã được giải bằng dò tuyến tính mà hình không hề chú thích.
 *   · slide 14 (Hình 10.9) đọc 01000001 01000010 thành 16706 — đúng, nhưng chỉ đúng với máy
 *     big-endian; máy little-endian (mọi PC x86 và Mac Apple Silicon) đọc ra 16961.
 *   · slide 17 ghi "Figure 10.12 Directories in Window" — thiếu chữ s (Windows).
 *   · slide 3 (Objectives) hứa "Understand the structure of sequential files and how they
 *     are UPDATED", nhưng không có slide nào trong 17 slide nói về cập nhật tệp tuần tự
 *     (tệp chủ cũ / tệp giao dịch / tệp chủ mới). Đã bổ sung trong bài.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'csi10';

export default {
  title: '10.0 — Slide by slide: Text vs binary files and file access methods (17 slides)|||10.0 — Slide bài giảng: Tệp văn bản vs tệp nhị phân & các phương thức truy cập (17 slide)',
  slug: 'csi106-10-0-slides-cau-truc-tep',
  type: 'DOCUMENT',
  description: 'Toàn bộ Chương 10 của CSI106 (17 slide) đi theo đúng bộ slide của trường: phân loại tệp theo cách truy cập (tuần tự, chỉ mục, băm), thuật toán xử lý tệp tuần tự, tệp chỉ mục và tệp băm, băm trực tiếp và băm chia lấy dư, xử lý va chạm bằng dò tuyến tính và móc xích, rồi phần tệp văn bản so với tệp nhị phân và thư mục. Mọi con số trong bài đều đo thật bằng chương trình C biên dịch cc -Wall: 12345 là 5 byte dạng text nhưng 4 byte "39 30 00 00" dạng nhị phân, quét tuần tự 750.001 bản ghi mất 24 ms còn fseek chỉ 49 µs, và năm khoá cụ thể được chèn vào bảng băm tạo ra hai va chạm thật rồi giải từng bước bằng cả hai phương pháp. Những chỗ slide gốc ghi sai số hình hoặc giấu một va chạm đều được chỉ ra thay vì chép lại.',
  content: [
    walkHead(D, 1, 17),
    walk(D, [

      [1, '10. File structure',
        `<p class="y-chinh">🎯 The title slide of Chapter 10. The chapter answers exactly two questions about a file: <strong>how are its bits interpreted</strong> (text or binary) and <strong>how do you reach record number k</strong> (sequential, indexed, hashed).</p>
<ul>
<li><strong>What a "file structure" is</strong> — not the bytes themselves, but the <em>organisation</em> imposed on them: how records are laid out, and what machinery sits between "I know a key" and "I have the record in memory". Chapter 9 gave you structures in RAM (arrays, linked lists, trees); this chapter gives you the same idea on disk, where the cost model is completely different.</li>
<li><strong>Why disk changes everything</strong> — in RAM a random access costs roughly 100 nanoseconds. On a spinning disk one random access costs about 10 milliseconds, i.e. <strong>100,000 times more</strong>. An algorithm that is fine in memory can be unusable on disk, and that single ratio is the reason indexes and hashing exist at all.</li>
<li><strong>The vocabulary you need from slide 1</strong> — a <em>file</em> is a named collection of related data on secondary storage; a <em>record</em> is one logical unit inside it (one customer, one student); a <em>field</em> is one item inside a record; a <em>key</em> is the field that identifies a record uniquely.</li>
<li><strong>Where it comes from</strong> — the textbook is Behrouz Forouzan, <em>Foundations of Computer Science</em>, <strong>Chapter 13 "File Structure"</strong>. The deck renumbers it to 10 but forgets in several places: slides 6, 8, 12 and 14 still quote "Figure 13.2", "Figure 13.5", "Figure 13.11", "Figure 13.15". Same pictures, old numbers.</li>
<li><strong>Where it connects</strong> — forward to Chapter 11 (Databases): a database index <em>is</em> the indexed file of slide 8, and a hash join <em>is</em> the hashed file of slide 9. Sideways to PRF192 Chapter 10 (Files): <code>fopen</code>, <code>fread</code>, <code>fseek</code> are the C-level names for the concepts here.</li>
</ul>
<p class="meo">💡 Carry one sentence through the whole chapter: <strong>every access method is a bet about how you will ask for the data.</strong> Sequential bets you will read everything; indexed bets you will ask by key; hashed bets you will ask by key and never want them in order.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề Chương 10. Cả chương trả lời đúng hai câu hỏi về một tệp: <strong>các bit của nó được diễn giải thế nào</strong> (văn bản hay nhị phân) và <strong>làm sao chạm tới bản ghi thứ k</strong> (tuần tự, chỉ mục, băm).</p>
<ul>
<li><strong>"Cấu trúc tệp" là cái gì</strong> — không phải bản thân các byte, mà là <em>cách tổ chức</em> áp lên chúng: bản ghi nằm theo trật tự nào, và bộ máy nào đứng giữa "tôi biết khoá" với "bản ghi đã nằm trong bộ nhớ". Chương 9 cho bạn cấu trúc trong RAM (mảng, danh sách liên kết, cây); chương này làm đúng ý đó trên đĩa, nơi mô hình chi phí khác hẳn.</li>
<li><strong>Vì sao đĩa làm đổi hết</strong> — trong RAM một lần truy cập ngẫu nhiên tốn cỡ 100 nanô giây. Trên đĩa cứng quay, một lần truy cập ngẫu nhiên tốn cỡ 10 mili giây, tức <strong>gấp 100.000 lần</strong>. Thuật toán chạy ngon trong bộ nhớ có thể vô dụng trên đĩa, và đúng cái tỷ số ấy là lý do tồn tại của chỉ mục và băm.</li>
<li><strong>Từ vựng cần thuộc ngay từ slide 1</strong> — <em>tệp</em> là một tập dữ liệu liên quan, có tên, nằm trên bộ nhớ ngoài; <em>bản ghi</em> (record) là một đơn vị logic bên trong (một khách hàng, một sinh viên); <em>trường</em> (field) là một mục trong bản ghi; <em>khoá</em> (key) là trường nhận dạng bản ghi một cách duy nhất.</li>
<li><strong>Nó lấy từ đâu</strong> — giáo trình là Behrouz Forouzan, <em>Foundations of Computer Science</em>, <strong>Chương 13 "File Structure"</strong>. Bộ slide đánh lại thành chương 10 nhưng quên ở nhiều chỗ: slide 6, 8, 12 và 14 vẫn còn trích "Figure 13.2", "Figure 13.5", "Figure 13.11", "Figure 13.15". Vẫn là những hình ấy, chỉ là số cũ.</li>
<li><strong>Nó nối đi đâu</strong> — về phía trước là Chương 11 (Cơ sở dữ liệu): chỉ mục của CSDL <em>chính là</em> tệp chỉ mục ở slide 8, và phép nối bằng băm <em>chính là</em> tệp băm ở slide 9. Về ngang là PRF192 Chương 10 (Tệp tin): <code>fopen</code>, <code>fread</code>, <code>fseek</code> là tên gọi ở mức C của những khái niệm tại đây.</li>
</ul>
<p class="meo">💡 Mang theo một câu suốt cả chương: <strong>mỗi phương thức truy cập là một lời cá cược về cách bạn sẽ hỏi dữ liệu.</strong> Tuần tự cược rằng bạn sẽ đọc hết; chỉ mục cược rằng bạn sẽ hỏi theo khoá; băm cược rằng bạn hỏi theo khoá và không bao giờ cần thứ tự.</p>`],

      [2, 'Content',
        `<p class="y-chinh">🎯 Two sections only — <strong>10.1 Text versus Binary</strong> and <strong>10.2 Access methods</strong>. A very small chapter by slide count, which means every slide is dense and every slide is examinable.</p>
<ul>
<li><strong>10.1 Text versus Binary</strong> — how the same sequence of bits becomes either characters or numbers depending on <em>which program opens it</em>. Slides 13–17 of this deck.</li>
<li><strong>10.2 Access methods</strong> — sequential files, indexed files, hashed files, collision resolution. Slides 4–12 of this deck.</li>
<li><strong>The deck teaches them in the opposite order to this list</strong> — look at slide 4: it says "1 - Access methods". And slide 13 says "2 - Text versus Binary". So the contents slide numbers text/binary as 10.1 but the body presents it second. Nothing is missing, the order is just inverted; do not waste time in the exam hunting for a section 10.1 before slide 13.</li>
<li><strong>Which half carries more marks</strong> — access methods, by a wide margin. Hashing with collision resolution (slides 11–12) is the only part of the chapter that produces a <em>calculation</em>, and calculations are what multiple-choice exams love.</li>
<li><strong>The map to keep in your head</strong> — three kinds of file (sequential, indexed, hashed) crossed with two kinds of content (text, binary). They are independent: an indexed file can be text, a sequential file can be binary. Students who merge the two axes lose easy marks.</li>
</ul>
<p class="pitfall">⚠️ Do not read "10.2 Access methods" as if it were a fourth kind of storage device. Access method is about <em>software organisation</em>, not hardware. The same physical disk holds sequential, indexed and hashed files side by side.</p>`,
        `<p class="y-chinh">🎯 Chỉ hai mục — <strong>10.1 Text versus Binary</strong> và <strong>10.2 Access methods</strong>. Một chương rất nhỏ nếu đếm slide, nghĩa là slide nào cũng đặc và slide nào cũng ra đề được.</p>
<ul>
<li><strong>10.1 Tệp văn bản và tệp nhị phân</strong> — cùng một dãy bit trở thành ký tự hay trở thành con số là tuỳ vào <em>chương trình nào mở nó</em>. Nằm ở slide 13–17 của deck này.</li>
<li><strong>10.2 Các phương thức truy cập</strong> — tệp tuần tự, tệp chỉ mục, tệp băm, xử lý va chạm. Nằm ở slide 4–12 của deck này.</li>
<li><strong>Deck dạy NGƯỢC thứ tự của chính danh sách này</strong> — nhìn slide 4: nó ghi "1 - Access methods". Và slide 13 mới ghi "2 - Text versus Binary". Tức là slide mục lục đánh text/binary là 10.1 nhưng thân bài lại trình bày nó sau. Không thiếu gì cả, chỉ là đảo thứ tự; đừng phí thì giờ trong phòng thi đi tìm một mục 10.1 nào đó trước slide 13.</li>
<li><strong>Nửa nào nhiều điểm hơn</strong> — các phương thức truy cập, hơn hẳn. Băm kèm xử lý va chạm (slide 11–12) là phần DUY NHẤT của chương sinh ra một <em>phép tính</em>, mà phép tính thì đề trắc nghiệm rất thích.</li>
<li><strong>Tấm bản đồ phải giữ trong đầu</strong> — ba loại tệp (tuần tự, chỉ mục, băm) nhân với hai loại nội dung (văn bản, nhị phân). Hai trục này ĐỘC LẬP: tệp chỉ mục có thể là văn bản, tệp tuần tự có thể là nhị phân. Sinh viên nào trộn hai trục vào nhau là mất điểm dễ.</li>
</ul>
<p class="pitfall">⚠️ Đừng đọc "10.2 Access methods" như thể nó là một loại thiết bị lưu trữ thứ tư. Phương thức truy cập nói về <em>cách tổ chức phần mềm</em>, không phải phần cứng. Cùng một cái đĩa vật lý chứa song song cả tệp tuần tự, tệp chỉ mục lẫn tệp băm.</p>`],

      [3, 'Objectives',
        `<p class="y-chinh">🎯 Seven objectives, and they read like seven exam questions. Six of them are about access methods and only one — the last — is about text versus binary, which tells you where the marks live.</p>
<ul>
<li><strong>"Define two categories of access methods: sequential access and random access"</strong> — the top-level split of Figure 10.1 on slide 5. Sequential = start at the front and walk; random = jump straight to an address.</li>
<li><strong>"Understand the structure of sequential files and how they are updated"</strong> — slides 6 and 7 cover the structure. <em>Updating</em> is never shown in these 17 slides, so learn it here: you cannot insert into the middle of a sequential file, so the classic solution is three files — an <em>old master</em> (sorted), a <em>transaction file</em> (sorted, holding add/change/delete requests) and a <em>new master</em> written from front to back by merging the two. That is why old banking systems ran "batch overnight".</li>
<li><strong>"Understand the structure of indexed files and the relation between the index and the data file"</strong> — slide 8. The key relation: the index is small, ordered and lives in RAM; the data file is large, unordered and lives on disk.</li>
<li><strong>"Understand the idea behind hashed files and describe some hashing methods"</strong> — slides 9, 10 and 11. Two named methods in this deck: direct hashing and modulo division hashing.</li>
<li><strong>"Describe address collisions and how they can be resolved"</strong> — slide 12. Two resolutions: open addressing (linear probing) and linked-list resolution (chaining).</li>
<li><strong>"Define directories and how they can be used to organize files"</strong> — slide 17.</li>
<li><strong>"Distinguish between text and binary files"</strong> — slides 14, 15, 16. Note the verb: <em>distinguish</em>, which means a comparison table is the expected answer, not a definition.</li>
</ul>
<p class="meo">💡 Turn each objective into a flashcard whose <em>question</em> is the objective sentence verbatim. Seven cards cover this chapter completely; there is no hidden eighth topic.</p>`,
        `<p class="y-chinh">🎯 Bảy mục tiêu, và chúng đọc lên y như bảy câu hỏi thi. Sáu mục nói về các phương thức truy cập, chỉ một — mục cuối — nói về văn bản/nhị phân; điều đó cho bạn biết điểm nằm ở đâu.</p>
<ul>
<li><strong>"Định nghĩa hai nhóm phương thức truy cập: tuần tự và ngẫu nhiên"</strong> — chính là phép chia tầng trên của Hình 10.1 ở slide 5. Tuần tự = đi từ đầu rồi bước dần; ngẫu nhiên = nhảy thẳng tới một địa chỉ.</li>
<li><strong>"Hiểu cấu trúc tệp tuần tự và cách nó được CẬP NHẬT"</strong> — slide 6 và 7 lo phần cấu trúc. Phần <em>cập nhật</em> thì cả 17 slide KHÔNG hề nói, nên học ngay ở đây: không chèn được vào giữa tệp tuần tự, nên lời giải kinh điển là ba tệp — <em>tệp chủ cũ</em> (đã sắp), <em>tệp giao dịch</em> (đã sắp, chứa các yêu cầu thêm/sửa/xoá) và <em>tệp chủ mới</em> được ghi từ đầu tới cuối bằng cách trộn hai tệp kia. Đó là lý do các hệ thống ngân hàng đời cũ "chạy lô ban đêm".</li>
<li><strong>"Hiểu cấu trúc tệp chỉ mục và quan hệ giữa chỉ mục với tệp dữ liệu"</strong> — slide 8. Quan hệ mấu chốt: chỉ mục thì NHỎ, có thứ tự và nằm trong RAM; tệp dữ liệu thì LỚN, không cần thứ tự và nằm trên đĩa.</li>
<li><strong>"Hiểu ý tưởng tệp băm và mô tả vài phương pháp băm"</strong> — slide 9, 10 và 11. Deck này nêu tên hai phương pháp: băm trực tiếp và băm chia lấy dư.</li>
<li><strong>"Mô tả va chạm địa chỉ và cách giải quyết"</strong> — slide 12. Hai cách: địa chỉ mở (dò tuyến tính) và móc xích bằng danh sách liên kết.</li>
<li><strong>"Định nghĩa thư mục và cách dùng nó để tổ chức tệp"</strong> — slide 17.</li>
<li><strong>"Phân biệt tệp văn bản và tệp nhị phân"</strong> — slide 14, 15, 16. Chú ý động từ: <em>phân biệt</em>, nghĩa là đáp án được chờ đợi là một BẢNG SO SÁNH, không phải một định nghĩa.</li>
</ul>
<p class="meo">💡 Biến mỗi mục tiêu thành một thẻ ghi nhớ mà <em>câu hỏi</em> là chính câu mục tiêu, nguyên văn. Bảy thẻ phủ trọn chương này; không có chủ đề thứ tám nào giấu ở đâu cả.</p>`],

      [4, '1 - Access methods',
        `<p class="y-chinh">🎯 A section divider. It opens the bigger and more examinable half of the chapter: <strong>given a key, how many disk reads does it take to get the record?</strong> That number is the whole subject.</p>
<ul>
<li><strong>The four methods you must be able to compare</strong> — sequential, direct/random, indexed and hashed. Slides 5 to 12 build them in that order, each one fixing a weakness of the one before.</li>
<li><strong>The story arc</strong> — sequential is simple but slow to search; direct access is fast but needs an address you usually do not have; an index gives you the address by lookup; hashing gives you the address by calculation, and pays for that with collisions.</li>
<li><strong>The measure that decides everything</strong> — <em>average number of accesses to find one record among n</em>. Sequential: n/2. Indexed: 1 read of the index (usually already in RAM) plus 1 read of the data. Hashed: 1 read if no collision, a few more if there is.</li>
<li><strong>Measured on a real machine for this lesson</strong> — a file of 1,000,000 records of 32 bytes (32 MB). Scanning sequentially to record 750,001 took <strong>24.0 ms</strong>; one <code>fseek</code> + one <code>fread</code> to the same record took <strong>49 µs</strong>. That is a factor of roughly <strong>490</strong>, on an SSD with the file already in the OS cache. On a cold spinning disk the gap is far larger.</li>
<li><strong>Why "access method" is not "file format"</strong> — the access method is chosen by whoever designs the application, not by the operating system. The OS only gives you bytes and an <em>offset</em>; everything above that is your design.</li>
</ul>
<p class="meo">💡 Before the slides start, write this sentence down: <strong>an index trades space for time; hashing trades order for time.</strong> Every advantage and disadvantage in the next eight slides is a consequence of one of those two trades.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục. Nó mở ra nửa lớn hơn và ra đề nhiều hơn của chương: <strong>cho một khoá, cần bao nhiêu lần đọc đĩa mới lấy được bản ghi?</strong> Con số ấy chính là toàn bộ nội dung.</p>
<ul>
<li><strong>Bốn phương thức bạn phải so sánh được</strong> — tuần tự, trực tiếp/ngẫu nhiên, chỉ mục và băm. Slide 5 tới 12 dựng chúng đúng theo thứ tự đó, cái sau vá đúng điểm yếu của cái trước.</li>
<li><strong>Mạch chuyện</strong> — tuần tự thì đơn giản nhưng tìm chậm; truy cập trực tiếp thì nhanh nhưng đòi một địa chỉ mà bạn thường không có; chỉ mục đưa địa chỉ cho bạn bằng cách TRA; băm đưa địa chỉ bằng cách TÍNH, và trả giá bằng va chạm.</li>
<li><strong>Thước đo quyết định mọi thứ</strong> — <em>số lần truy cập trung bình để tìm một bản ghi trong n bản ghi</em>. Tuần tự: n/2. Chỉ mục: 1 lần đọc chỉ mục (thường đã nằm sẵn trong RAM) cộng 1 lần đọc dữ liệu. Băm: 1 lần nếu không va chạm, thêm vài lần nếu có.</li>
<li><strong>Đo thật trên máy cho bài này</strong> — một tệp 1.000.000 bản ghi, mỗi bản ghi 32 byte (32 MB). Quét tuần tự tới bản ghi thứ 750.001 mất <strong>24,0 ms</strong>; một lệnh <code>fseek</code> cộng một <code>fread</code> tới đúng bản ghi ấy mất <strong>49 µs</strong>. Chênh nhau khoảng <strong>490 lần</strong>, mà đây là SSD với tệp đã nằm trong bộ đệm của hệ điều hành. Trên đĩa quay còn nguội thì khoảng cách lớn hơn nhiều.</li>
<li><strong>Vì sao "phương thức truy cập" không phải "định dạng tệp"</strong> — phương thức truy cập do người thiết kế ứng dụng chọn, không phải do hệ điều hành. Hệ điều hành chỉ đưa cho bạn byte và một <em>độ dời</em> (offset); mọi thứ ở trên là thiết kế của bạn.</li>
</ul>
<p class="meo">💡 Trước khi vào các slide, hãy chép câu này ra giấy: <strong>chỉ mục đổi KHÔNG GIAN lấy THỜI GIAN; băm đổi THỨ TỰ lấy THỜI GIAN.</strong> Mọi ưu điểm và nhược điểm trong tám slide tới đều là hệ quả của một trong hai phép đổi ấy.</p>`],

      [5, '1. Introduction — Figure 10.1 A taxonomy of file structures',
        `<p class="y-chinh">🎯 Two ideas on one slide: files live on <strong>secondary storage</strong> (disk, tape), and Figure 10.1 splits every file into exactly two access categories — <strong>sequential access</strong> (sequential file) and <strong>random access</strong> (indexed file, hashed file).</p>
<ul>
<li><strong>Read the taxonomy exactly as drawn</strong> — the root box "Files" has two children. Left: "Sequential access", under it one bullet "Sequential file". Right: "Random access", under it two bullets "Indexed file" and "Hashed file". So there are <em>two categories</em> and <em>three file types</em>. An exam question asking "how many access methods?" wants <strong>two</strong>; asking "name the file structures" wants <strong>three</strong>.</li>
<li><strong>"Disk and tape"</strong> — tape looks archaic but is not: LTO-9 cartridges hold 18 TB and are still the cheapest way to store cold archives. Tape is the purest sequential device in existence — to read the end you physically wind past everything before it, so <em>no index can save you</em>. That is why the taxonomy starts from the access question.</li>
<li><strong>"Can be both read from and written to"</strong> — contrasted with the slide's own examples of one-way files: the monitor is write-only, the keyboard is read-only and stores nothing. This is the Unix idea "<em>everything is a file</em>": in Linux the screen really is <code>/dev/stdout</code> and the keyboard really is <code>/dev/stdin</code>, and your C program talks to all of them with the same <code>fprintf</code>/<code>fscanf</code>.</li>
<li><strong>Why "the keyboard is a file although it cannot store data"</strong> — because "file" here means <em>a stream of bytes with a uniform interface</em>, not "a thing on a disk". That abstraction is the reason a program can be told to read from a file or from the keyboard without changing one line of its logic.</li>
<li><strong>The master table for the whole section</strong> — build it now, fill it in as the slides go by:</li>
</ul>
<table>
<tr><td><strong>Method</strong></td><td><strong>How you reach record k</strong></td><td><strong>Avg reads to find 1 of n</strong></td><td><strong>Strength</strong></td><td><strong>Weakness</strong></td><td><strong>Use when</strong></td></tr>
<tr><td>Sequential</td><td>Read records 1, 2, 3 … until the key matches or EOF</td><td>n/2 (miss: n)</td><td>Simplest; works on tape; no extra space</td><td>Unusable for single lookups in a big file; cannot insert in the middle</td><td>You process the whole file anyway: payroll, logs, batch reports</td></tr>
<tr><td>Direct / random</td><td>address = start + (k − 1) × record_size, then <code>fseek</code></td><td>1</td><td>Fastest possible; no extra structure</td><td>You must already KNOW k; needs fixed-length records</td><td>Record number is the key: slot k of an array on disk</td></tr>
<tr><td>Indexed</td><td>Search the small index for the key → get the address → 1 read of the data file</td><td>1 index probe (in RAM) + 1 disk read</td><td>Works for any key; keeps the data file order-free; supports ordered scans via the index</td><td>Index costs extra space and must be updated on every insert/delete</td><td>Lookups by an arbitrary key: bank accounts, student IDs</td></tr>
<tr><td>Hashed</td><td>address = hash(key), read that address</td><td>1 if no collision; 1 + a few probes if there is</td><td>No index to store or search; constant time</td><td>Collisions; no ordered traversal; file size fixed in advance</td><td>Very many equality lookups, no range queries</td></tr>
</table>
<p class="pitfall">⚠️ The taxonomy calls the right branch "random access", but the chapter's own text (slide 8) says "to access a record <em>randomly</em>, we need to know the address". "Random" here means "in any order you like", NOT "unpredictable". Students who read it as "arbitrary/chance" get the whole section backwards.</p>`,
        `<p class="y-chinh">🎯 Hai ý trên một slide: tệp nằm trên <strong>bộ nhớ ngoài</strong> (đĩa, băng từ), và Hình 10.1 chia MỌI tệp thành đúng hai nhóm truy cập — <strong>truy cập tuần tự</strong> (tệp tuần tự) và <strong>truy cập ngẫu nhiên</strong> (tệp chỉ mục, tệp băm).</p>
<ul>
<li><strong>Đọc sơ đồ đúng như nó vẽ</strong> — hộp gốc "Files" có hai con. Bên trái: "Sequential access", dưới nó một gạch đầu dòng "Sequential file". Bên phải: "Random access", dưới nó hai gạch "Indexed file" và "Hashed file". Vậy có <em>hai nhóm</em> và <em>ba loại tệp</em>. Đề hỏi "có mấy phương thức truy cập?" thì đáp án là <strong>hai</strong>; hỏi "kể tên các cấu trúc tệp" thì đáp án là <strong>ba</strong>.</li>
<li><strong>"Đĩa và băng từ"</strong> — băng từ nghe cổ lỗ nhưng không hề: băng LTO-9 chứa 18 TB và tới nay vẫn là cách rẻ nhất để lưu trữ nguội. Băng từ là thiết bị tuần tự thuần khiết nhất còn tồn tại — muốn đọc phần cuối thì phải quay vật lý qua toàn bộ phần trước, nên <em>không chỉ mục nào cứu nổi</em>. Chính vì thế sơ đồ phân loại bắt đầu từ câu hỏi truy cập.</li>
<li><strong>"Vừa đọc được vừa ghi được"</strong> — đối lập với chính ví dụ của slide về tệp một chiều: màn hình chỉ ghi được, bàn phím chỉ đọc được và không lưu gì. Đây chính là tư tưởng Unix "<em>mọi thứ đều là tệp</em>": trong Linux màn hình đúng là <code>/dev/stdout</code>, bàn phím đúng là <code>/dev/stdin</code>, và chương trình C của bạn nói chuyện với tất cả bằng cùng <code>fprintf</code>/<code>fscanf</code>.</li>
<li><strong>Vì sao "bàn phím là tệp dù không lưu được dữ liệu"</strong> — vì chữ "tệp" ở đây nghĩa là <em>một dòng byte với một giao diện thống nhất</em>, chứ không phải "một vật trên đĩa". Trừu tượng ấy là lý do ta bảo được chương trình đọc từ tệp hay đọc từ bàn phím mà không sửa một dòng logic nào.</li>
<li><strong>Bảng tổng cho cả mục</strong> — dựng ngay bây giờ, các slide sau sẽ điền dần:</li>
</ul>
<table>
<tr><td><strong>Phương thức</strong></td><td><strong>Cách chạm tới bản ghi thứ k</strong></td><td><strong>Số lần đọc TB để tìm 1 trong n</strong></td><td><strong>Ưu</strong></td><td><strong>Nhược</strong></td><td><strong>Dùng khi</strong></td></tr>
<tr><td>Tuần tự</td><td>Đọc bản ghi 1, 2, 3 … tới khi khớp khoá hoặc gặp EOF</td><td>n/2 (không có: n)</td><td>Đơn giản nhất; chạy được trên băng từ; không tốn chỗ phụ</td><td>Không dùng nổi để tra lẻ trong tệp lớn; không chèn được vào giữa</td><td>Dù sao cũng duyệt cả tệp: bảng lương, log, báo cáo theo lô</td></tr>
<tr><td>Trực tiếp / ngẫu nhiên</td><td>địa chỉ = đầu tệp + (k − 1) × cỡ bản ghi, rồi <code>fseek</code></td><td>1</td><td>Nhanh nhất có thể; không cần cấu trúc phụ</td><td>Phải BIẾT SẴN k; bản ghi phải cố định độ dài</td><td>Số hiệu bản ghi chính là khoá: ô thứ k của một mảng trên đĩa</td></tr>
<tr><td>Chỉ mục</td><td>Tra khoá trong chỉ mục nhỏ → lấy địa chỉ → 1 lần đọc tệp dữ liệu</td><td>1 lần tra chỉ mục (trong RAM) + 1 lần đọc đĩa</td><td>Dùng được với khoá bất kỳ; tệp dữ liệu không cần sắp; duyệt theo thứ tự nhờ chỉ mục</td><td>Chỉ mục tốn chỗ và phải cập nhật mỗi lần thêm/xoá</td><td>Tra theo khoá tuỳ ý: số tài khoản, mã sinh viên</td></tr>
<tr><td>Băm</td><td>địa chỉ = hàm_băm(khoá), đọc thẳng địa chỉ đó</td><td>1 nếu không va chạm; 1 + vài lần dò nếu có</td><td>Không phải lưu và không phải tra chỉ mục; thời gian hằng</td><td>Va chạm; không duyệt được theo thứ tự; cỡ tệp phải ấn định trước</td><td>Rất nhiều phép tra bằng-nhau, không có truy vấn khoảng</td></tr>
</table>
<p class="pitfall">⚠️ Sơ đồ gọi nhánh bên phải là "random access" (truy cập ngẫu nhiên), nhưng chính chữ của chương (slide 8) nói "để truy cập một bản ghi <em>một cách ngẫu nhiên</em>, ta cần biết địa chỉ". Chữ "ngẫu nhiên" ở đây nghĩa là "theo thứ tự tuỳ ý bạn muốn", KHÔNG phải "không đoán trước được". Ai hiểu thành "hên xui" thì hiểu ngược cả mục.</p>`],

      [6, '2. SEQUENTIAL FILES — Figure 10.2 A sequential file',
        `<p class="y-chinh">🎯 The definition to memorise word for word: <strong>"a sequential file is one in which records can only be accessed one after another from beginning to end"</strong>. Figure 10.2 draws it: Record · Record · Record · … · Record · <strong>EOF</strong>.</p>
<ul>
<li><strong>Read the figure precisely</strong> — a row of boxes each labelled "Record", then a black box marked <strong>EOF</strong> with a white triangle. The EOF marker is drawn as a real element of the file, because in the model it <em>is</em> one: it is how the program knows to stop, since a sequential file carries no record count in its header.</li>
<li><strong>"Only" is the operative word</strong> — it is a restriction, not a feature. Record 500 is unreachable without passing through records 1 to 499. On tape that is physically true; on disk the operating system could jump, but the <em>file structure</em> forbids it because records may have different lengths and nobody knows where record 500 begins.</li>
<li><strong>Cost, in numbers</strong> — searching n records costs n/2 reads on average when the record is present and n reads when it is not. For n = 1,000,000 that is 500,000 reads for a hit. Measured for this lesson on a 32 MB file of 1,000,000 records: reaching record 750,001 took <strong>24.0 ms</strong> and read 750,001 records; the same record by direct address took <strong>49 µs</strong> and read <strong>1</strong>.</li>
<li><strong>Updating a sequential file — the part the objectives promise and no slide delivers</strong> — you cannot insert into the middle, because there is no gap. The classic three-file batch update: sort the <em>transaction file</em> by the same key as the <em>old master</em>, then walk both in step, writing a <em>new master</em>. Every update rewrites the entire file, which is exactly why these jobs ran overnight.</li>
<li><strong>Where you still meet sequential files daily</strong> — log files, CSV exports, <code>.tar</code> archives, video streams. Anything you always consume from the start is better off sequential: no index to maintain, no wasted space, perfect locality on disk.</li>
</ul>
<p class="pitfall">⚠️ The slide's own text says "Figure 13.2 shows the layout" while the caption under the picture says "Figure 10.2". Same picture, two numbers — a leftover from Forouzan's Chapter 13. Expect the exam to quote either.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa phải thuộc nguyên văn: <strong>"tệp tuần tự là tệp mà các bản ghi CHỈ có thể được truy cập lần lượt từ đầu tới cuối"</strong>. Hình 10.2 vẽ đúng thế: Record · Record · Record · … · Record · <strong>EOF</strong>.</p>
<ul>
<li><strong>Đọc hình cho chính xác</strong> — một dãy hộp, mỗi hộp ghi "Record", rồi một hộp đen ghi <strong>EOF</strong> có hình tam giác trắng. Dấu EOF được vẽ như một phần tử thật của tệp, vì trong mô hình này nó <em>đúng là</em> một phần tử: đó là cách chương trình biết phải dừng, bởi tệp tuần tự không mang sẵn số lượng bản ghi ở đầu tệp.</li>
<li><strong>Chữ "chỉ" mới là chữ quan trọng</strong> — đó là một RÀNG BUỘC, không phải một tính năng. Bản ghi 500 không chạm tới được nếu không đi qua bản ghi 1 tới 499. Trên băng từ thì điều đó đúng về mặt vật lý; trên đĩa thì hệ điều hành nhảy được, nhưng <em>cấu trúc tệp</em> cấm, vì bản ghi có thể dài ngắn khác nhau và không ai biết bản ghi 500 bắt đầu ở đâu.</li>
<li><strong>Chi phí, bằng con số</strong> — tìm trong n bản ghi tốn trung bình n/2 lần đọc khi có, và n lần khi không có. Với n = 1.000.000 thì là 500.000 lần đọc cho một lần trúng. Đo thật cho bài này trên tệp 32 MB gồm 1.000.000 bản ghi: tới được bản ghi 750.001 mất <strong>24,0 ms</strong> và đã đọc 750.001 bản ghi; cũng bản ghi ấy nhưng đi bằng địa chỉ trực tiếp mất <strong>49 µs</strong> và đọc <strong>1</strong> bản ghi.</li>
<li><strong>Cập nhật tệp tuần tự — phần mà mục tiêu hứa mà không slide nào giao</strong> — không chèn được vào giữa, vì không có khe trống. Cách kinh điển là cập nhật theo lô bằng ba tệp: sắp <em>tệp giao dịch</em> theo đúng khoá của <em>tệp chủ cũ</em>, rồi duyệt song song cả hai, ghi ra <em>tệp chủ mới</em>. Mỗi lần cập nhật là ghi lại toàn bộ tệp, và đó chính là lý do những việc này chạy ban đêm.</li>
<li><strong>Bạn vẫn gặp tệp tuần tự hằng ngày ở đâu</strong> — tệp log, tệp CSV xuất ra, gói <code>.tar</code>, luồng video. Cái gì lúc nào cũng đọc từ đầu thì để tuần tự là tốt nhất: không phải nuôi chỉ mục, không phí chỗ, và đọc đĩa liền mạch tuyệt đối.</li>
</ul>
<p class="pitfall">⚠️ Chữ trên slide ghi "Figure 13.2 shows the layout" trong khi dòng chú thích dưới hình lại ghi "Figure 10.2". Cùng một hình, hai số — dấu vết còn sót của Chương 13 sách Forouzan. Đề thi có thể trích số nào cũng được, đừng hoang mang.</p>`],

      [7, 'Example — Algorithm 10.1 Pseudocode for processing records in a sequential file',
        `<p class="y-chinh">🎯 The canonical loop for a sequential file, in five lines of pseudocode: <em>while (Not EOF) { read the next record into memory; process the record }</em>. The whole structure is "read until the marker".</p>
<ul>
<li><strong>Read the algorithm box exactly</strong> — <code>Algorithm: SequentialFileProcessing (file)</code>, <code>Purpose: Process all records in a sequential file</code>, <code>Pre: Given the beginning address of the file on the auxiliary storage</code>, <code>Post: None</code>, <code>Return: None</code>. The <em>Pre</em> line is the one students skip and the one that carries the meaning: the only thing you are given is <strong>where the file starts</strong>. Not how many records, not where any of them is.</li>
<li><strong>Why there is no counter</strong> — a sequential file does not know its own length. That is what makes EOF necessary and what makes "read until it fails" the only correct loop shape.</li>
<li><strong>The same loop in C</strong> — compiled with <code>cc -Wall</code> and run for this lesson:</li>
</ul>
<pre>#include &lt;stdio.h&gt;
typedef struct { int key; char name[16]; double balance; } Rec;

int main(void) {
    Rec r;
    FILE *f = fopen("recs.bin", "rb");
    while (fread(&amp;r, sizeof r, 1, f) == 1)   /* "while (Not EOF)" */
        printf("%d %s %.2f\\n", r.key, r.name, r.balance);
    fclose(f);
    return 0;
}</pre>
<ul>
<li><strong>The trap that this pseudocode hides</strong> — translating "while (Not EOF)" literally into C gives <code>while (!feof(f))</code>, which is <strong>wrong</strong>. <code>feof()</code> only becomes true <em>after</em> a read has already failed, so the loop runs one extra time and processes the last record twice. Measured on a 5-record file: the <code>!feof</code> version printed <strong>6</strong> lines with record 5 repeated; the <code>fread(...) == 1</code> version printed <strong>5</strong>.</li>
</ul>
<p class="dap-an">✅ Đáp án: the correct C loop is driven by the <em>return value of the read</em>, never by <code>feof()</code>: <code>while (fread(&amp;r, sizeof r, 1, f) == 1)</code> for binary, <code>while (fscanf(f, "%d", &amp;x) == 1)</code> or <code>while (fgets(line, n, f) != NULL)</code> for text. Reserve <code>feof()</code> for <em>after</em> the loop, to tell "clean end of file" apart from "a read error happened" (<code>ferror()</code>).</p>
<p class="meo">💡 Three-word summary of this slide: <strong>read, then test.</strong> Every correct file loop in every language has that order. Test-then-read is the bug.</p>`,
        `<p class="y-chinh">🎯 Vòng lặp chuẩn mực cho tệp tuần tự, gói trong năm dòng mã giả: <em>while (Not EOF) { đọc bản ghi kế vào bộ nhớ; xử lý bản ghi }</em>. Toàn bộ cấu trúc là "đọc cho tới khi gặp dấu hiệu kết thúc".</p>
<ul>
<li><strong>Đọc khung thuật toán cho đúng</strong> — <code>Algorithm: SequentialFileProcessing (file)</code>, <code>Purpose: Process all records in a sequential file</code>, <code>Pre: Given the beginning address of the file on the auxiliary storage</code>, <code>Post: None</code>, <code>Return: None</code>. Dòng <em>Pre</em> là dòng sinh viên hay bỏ qua và lại là dòng mang nghĩa: thứ duy nhất bạn được cho là <strong>chỗ tệp bắt đầu</strong>. Không phải số bản ghi, không phải vị trí của bất kỳ bản ghi nào.</li>
<li><strong>Vì sao không có biến đếm</strong> — tệp tuần tự không biết chiều dài của chính nó. Đó là lý do EOF là bắt buộc, và là lý do "đọc tới khi đọc hỏng" mới là hình dạng vòng lặp duy nhất đúng.</li>
<li><strong>Cũng vòng lặp ấy, viết bằng C</strong> — đã biên dịch bằng <code>cc -Wall</code> và chạy thật cho bài này:</li>
</ul>
<pre>#include &lt;stdio.h&gt;
typedef struct { int key; char name[16]; double balance; } Rec;

int main(void) {
    Rec r;
    FILE *f = fopen("recs.bin", "rb");
    while (fread(&amp;r, sizeof r, 1, f) == 1)   /* chính là "while (Not EOF)" */
        printf("%d %s %.2f\\n", r.key, r.name, r.balance);
    fclose(f);
    return 0;
}</pre>
<ul>
<li><strong>Cái bẫy mà mã giả này giấu đi</strong> — dịch "while (Not EOF)" sang C theo nghĩa đen sẽ ra <code>while (!feof(f))</code>, và nó <strong>SAI</strong>. <code>feof()</code> chỉ thành đúng <em>SAU KHI</em> một lệnh đọc đã hỏng, nên vòng lặp chạy thừa một lượt và xử lý bản ghi cuối hai lần. Đo thật trên tệp 5 bản ghi: bản dùng <code>!feof</code> in ra <strong>6</strong> dòng với bản ghi 5 lặp lại; bản dùng <code>fread(...) == 1</code> in ra đúng <strong>5</strong> dòng.</li>
</ul>
<p class="dap-an">✅ Đáp án: vòng lặp C đúng phải được điều khiển bởi <em>giá trị trả về của lệnh đọc</em>, không bao giờ bởi <code>feof()</code>: <code>while (fread(&amp;r, sizeof r, 1, f) == 1)</code> cho tệp nhị phân, <code>while (fscanf(f, "%d", &amp;x) == 1)</code> hoặc <code>while (fgets(line, n, f) != NULL)</code> cho tệp văn bản. Chỉ dùng <code>feof()</code> ở <em>SAU</em> vòng lặp, để phân biệt "hết tệp bình thường" với "gặp lỗi đọc" (<code>ferror()</code>).</p>
<p class="meo">💡 Tóm slide này trong ba chữ: <strong>đọc, rồi mới kiểm.</strong> Mọi vòng lặp tệp đúng đắn trong mọi ngôn ngữ đều theo thứ tự đó. Kiểm-rồi-mới-đọc chính là con bọ.</p>`],

      [8, '3. INDEXED FILES — Figures 10.3 and 10.4',
        `<p class="y-chinh">🎯 The problem in one sentence: <em>to reach a record randomly you need its address, and nobody knows the address — the customer only knows their account number</em>. An <strong>indexed file</strong> is the small table that turns key into address.</p>
<ul>
<li><strong>Figure 10.3 — the mapping</strong> — a two-column box labelled "Index" with columns <em>Key</em> and <em>Address</em>. A Key arrow enters it; an Address arrow leaves it and points into the File, whose slots are numbered 1, 2, …, k; a Record arrow leaves the file. Two structures, two steps: <strong>lookup, then read</strong>.</li>
<li><strong>Figure 10.4 — the same thing with real data</strong> — the Index holds pairs sorted by key: 045128→306, 070918→001, 121267→002, 160252→305, 166702→003, …, 378845→007, 379452→000. The Data file holds the records at those addresses: 000 Mary Dodd 1432.45, 001 Sarah Trapp 100.22, 002 Bryan Devaux 11.45, 003 Harry Eagle 14321.00, 007 John Carver 7234.01, 305 Tuan Ngo 15121.10, 306 Shouli Feldman 87922.05.</li>
<li><strong>Trace the figure's own example</strong> — the customer gives key <strong>166702</strong>. Step 1: find 166702 in the index (it is there, pointing at 003). Step 2: read data file address 003. Result: the extracted record <strong>166702 · Harry Eagle · 14321.00</strong>. Two accesses, and the first one is in RAM.</li>
<li><strong>The relation the objectives ask about, stated precisely</strong> — the index is <em>ordered by key</em>, the data file is <em>not ordered at all</em>. That is the whole trick: new records are appended wherever there is room, and only the tiny index has to be kept sorted. Notice in Figure 10.4 that key 045128 (the smallest) sits at address 306 (almost the last) — proof that the data file has no order.</li>
<li><strong>Why it is fast, with the arithmetic</strong> — take 1,000,000 records of 32 bytes: the data file is <strong>32 MB</strong>. The index needs only key + address, 4 + 4 = 8 bytes per entry, so <strong>8 MB</strong> — a quarter of the size, and it fits in RAM easily. Searching 1,000,000 sequentially costs 500,000 disk reads on average; searching a sorted in-memory index by binary search costs log₂(1,000,000) ≈ <strong>20 comparisons in RAM</strong>, then <strong>1</strong> disk read. Measured version of the same gap earlier in this lesson: 24.0 ms versus 49 µs.</li>
<li><strong>Inverted files — the bonus the index gives you free</strong> — build a second index on a non-key field (say, city) and you can answer "all customers in Hanoi" without touching the data file until you have the exact addresses. A database calls that a secondary index, and Chapter 11 will call it exactly that.</li>
</ul>
<p class="dap-an">✅ Đáp án — <em>how many accesses to find key 166702 in Figure 10.4?</em> One search of the index (no disk access if the index is resident in memory, otherwise 1 read) plus <strong>1</strong> read of the data file at address 003. So the standard exam answer is <strong>2 accesses, or 1 if the index is already in RAM</strong> — against 500,000 on average for a sequential scan of a million records.</p>
<p class="pitfall">⚠️ The slide's text ends with "(Figure 13.5)" but the two captions under the pictures say "Figure 10.3" and "Figure 10.4". Another Chapter-13 leftover. And do not say "the index sorts the data file" — it does not. It sorts <em>itself</em>; the data file stays in insertion order.</p>`,
        `<p class="y-chinh">🎯 Vấn đề gói trong một câu: <em>muốn chạm tới một bản ghi theo kiểu ngẫu nhiên thì phải có địa chỉ của nó, mà chẳng ai biết địa chỉ — khách hàng chỉ biết số tài khoản của mình</em>. <strong>Tệp chỉ mục</strong> chính là cái bảng nhỏ biến khoá thành địa chỉ.</p>
<ul>
<li><strong>Hình 10.3 — phép ánh xạ</strong> — một khung hai cột tên "Index" với hai cột <em>Key</em> và <em>Address</em>. Một mũi tên Key đi vào; một mũi tên Address đi ra và trỏ vào File, các ô của File đánh số 1, 2, …, k; một mũi tên Record đi ra khỏi file. Hai cấu trúc, hai bước: <strong>tra, rồi đọc</strong>.</li>
<li><strong>Hình 10.4 — vẫn thế nhưng có dữ liệu thật</strong> — Chỉ mục chứa các cặp đã sắp theo khoá: 045128→306, 070918→001, 121267→002, 160252→305, 166702→003, …, 378845→007, 379452→000. Tệp dữ liệu chứa bản ghi ở đúng những địa chỉ ấy: 000 Mary Dodd 1432.45, 001 Sarah Trapp 100.22, 002 Bryan Devaux 11.45, 003 Harry Eagle 14321.00, 007 John Carver 7234.01, 305 Tuan Ngo 15121.10, 306 Shouli Feldman 87922.05.</li>
<li><strong>Lần theo đúng ví dụ của hình</strong> — khách đưa khoá <strong>166702</strong>. Bước 1: tìm 166702 trong chỉ mục (có, trỏ tới 003). Bước 2: đọc tệp dữ liệu ở địa chỉ 003. Kết quả: bản ghi rút ra là <strong>166702 · Harry Eagle · 14321.00</strong>. Hai lần truy cập, mà lần đầu nằm trong RAM.</li>
<li><strong>Quan hệ mà đề mục tiêu hỏi, phát biểu cho chuẩn</strong> — chỉ mục thì <em>sắp theo khoá</em>, tệp dữ liệu thì <em>không sắp gì cả</em>. Đó là toàn bộ mẹo: bản ghi mới cứ nối vào chỗ nào còn trống, và chỉ cái chỉ mục bé tí mới phải giữ thứ tự. Để ý trong Hình 10.4: khoá 045128 (nhỏ nhất) lại nằm ở địa chỉ 306 (gần cuối) — bằng chứng rằng tệp dữ liệu không có thứ tự nào.</li>
<li><strong>Vì sao nó nhanh, tính ra bằng số</strong> — lấy 1.000.000 bản ghi, mỗi bản 32 byte: tệp dữ liệu nặng <strong>32 MB</strong>. Chỉ mục chỉ cần khoá + địa chỉ, 4 + 4 = 8 byte mỗi mục, tức <strong>8 MB</strong> — bằng một phần tư, và nằm gọn trong RAM. Tìm tuần tự trong 1.000.000 tốn trung bình 500.000 lần đọc đĩa; tìm nhị phân trong chỉ mục đã nằm sẵn trong bộ nhớ tốn log₂(1.000.000) ≈ <strong>20 phép so sánh trong RAM</strong>, rồi <strong>1</strong> lần đọc đĩa. Bản đo thật của đúng khoảng cách ấy ở phần trên bài: 24,0 ms so với 49 µs.</li>
<li><strong>Tệp đảo (inverted file) — món quà kèm theo của chỉ mục</strong> — dựng thêm một chỉ mục thứ hai trên một trường KHÔNG phải khoá (ví dụ: thành phố) là bạn trả lời được "tất cả khách ở Hà Nội" mà chưa cần đụng vào tệp dữ liệu cho tới khi đã có đúng danh sách địa chỉ. Cơ sở dữ liệu gọi đó là chỉ mục phụ, và Chương 11 sẽ gọi đúng bằng cái tên ấy.</li>
</ul>
<p class="dap-an">✅ Đáp án — <em>tìm khoá 166702 trong Hình 10.4 mất mấy lần truy cập?</em> Một lần tra chỉ mục (không tốn lần đọc đĩa nào nếu chỉ mục đã thường trú trong bộ nhớ, ngược lại là 1 lần) cộng <strong>1</strong> lần đọc tệp dữ liệu ở địa chỉ 003. Vậy đáp án chuẩn cho bài thi là <strong>2 lần truy cập, hoặc 1 nếu chỉ mục đã nằm trong RAM</strong> — so với trung bình 500.000 lần nếu quét tuần tự một triệu bản ghi.</p>
<p class="pitfall">⚠️ Chữ trên slide kết bằng "(Figure 13.5)" trong khi hai dòng chú thích dưới hình lại ghi "Figure 10.3" và "Figure 10.4". Lại một dấu vết Chương 13. Và đừng nói "chỉ mục sắp xếp tệp dữ liệu" — nó không hề. Nó sắp <em>chính nó</em>; tệp dữ liệu vẫn nằm theo thứ tự lúc chèn vào.</p>`],

      [9, '4. HASHED FILES — Figure 10.5 Mapping in a hashed file',
        `<p class="y-chinh">🎯 One sentence changes everything: <em>"in an indexed file the index maps the key to the address; a hashed file uses a <strong>mathematical function</strong> to accomplish this mapping"</strong></em>. Look the address up, or <strong>calculate</strong> it.</p>
<ul>
<li><strong>Read Figure 10.5</strong> — the Index box of Figure 10.3 has been replaced by a single red box reading <code>Address = HashFunction (Key)</code>, labelled "Mapping". Everything else is identical: Key in on the left, Address out, into the File with slots 1, 2, …, k, Record out on the right. The picture is deliberately the same picture; only the middle box changed.</li>
<li><strong>What the chapter means by "hash function"</strong> — any deterministic function from the set of keys to the set of addresses 1…k. Deterministic is the essential word: the same key must always produce the same address, otherwise you could store a record and never find it again.</li>
<li><strong>What you gain</strong> — the index disappears. No 8 MB table to store, keep sorted, search, and rewrite on every insert. Address computation is pure arithmetic, so it costs no disk access at all: you go from key to record in exactly <strong>one</strong> read.</li>
<li><strong>What you lose, and it is a lot</strong> — (1) <em>collisions</em>: two keys can map to one address, because there are far more possible keys than addresses (slide 12 handles it); (2) <em>no order</em>: hashing scatters keys on purpose, so "list all accounts between 100000 and 200000" degenerates into a full scan; (3) <em>fixed size</em>: the function depends on the file size, so growing the file changes every address and forces a full rehash.</li>
<li><strong>The comparison the exam wants:</strong></li>
</ul>
<table>
<tr><td><strong>Criterion</strong></td><td><strong>Indexed file</strong></td><td><strong>Hashed file</strong></td></tr>
<tr><td>Key → address</td><td>Looked up in a table</td><td>Computed by a function</td></tr>
<tr><td>Extra space</td><td>The index (≈ 8 bytes per record)</td><td>None, but empty slots are reserved</td></tr>
<tr><td>Accesses to find a record</td><td>1 index probe + 1 read</td><td>1 read (no collision), 1 + probes otherwise</td></tr>
<tr><td>Ordered / range scan</td><td>Yes — walk the index in key order</td><td>No — keys are scattered deliberately</td></tr>
<tr><td>Growing the file</td><td>Append the record, insert into the index</td><td>Changes the function ⇒ rehash everything</td></tr>
<tr><td>Collisions</td><td>Impossible</td><td>Unavoidable; must be resolved</td></tr>
</table>
<p class="meo">💡 One line to keep them apart: <strong>an index REMEMBERS where you put it; a hash function DECIDES where it goes.</strong></p>`,
        `<p class="y-chinh">🎯 Một câu đổi hết mọi thứ: <em>"trong tệp chỉ mục, chỉ mục ánh xạ khoá sang địa chỉ; tệp băm dùng một <strong>hàm toán học</strong> để làm phép ánh xạ ấy"</em>. Hoặc TRA ra địa chỉ, hoặc <strong>TÍNH</strong> ra địa chỉ.</p>
<ul>
<li><strong>Đọc Hình 10.5</strong> — cái khung Index của Hình 10.3 đã bị thay bằng một khung đỏ duy nhất ghi <code>Address = HashFunction (Key)</code>, dán nhãn "Mapping". Còn lại y hệt: Key vào bên trái, Address ra, đi vào File có các ô 1, 2, …, k, Record ra bên phải. Hình vẽ cố ý giữ nguyên; chỉ cái khung ở giữa đổi.</li>
<li><strong>Chương này hiểu "hàm băm" là gì</strong> — bất kỳ hàm TẤT ĐỊNH nào đi từ tập khoá sang tập địa chỉ 1…k. Chữ tất định là chữ sống còn: cùng một khoá phải luôn cho cùng một địa chỉ, nếu không thì cất bản ghi xong sẽ không bao giờ tìm lại được.</li>
<li><strong>Bạn được gì</strong> — chỉ mục biến mất. Không còn bảng 8 MB phải lưu, phải giữ sắp, phải tra, phải viết lại mỗi lần chèn. Tính địa chỉ là số học thuần tuý nên không tốn lần đọc đĩa nào: từ khoá tới bản ghi đúng <strong>một</strong> lần đọc.</li>
<li><strong>Bạn mất gì, và mất khá nhiều</strong> — (1) <em>va chạm</em>: hai khoá có thể ra cùng một địa chỉ, vì số khoá khả dĩ nhiều hơn số địa chỉ rất nhiều (slide 12 xử lý); (2) <em>mất thứ tự</em>: băm cố ý làm khoá văng tứ tung, nên "liệt kê mọi tài khoản từ 100000 tới 200000" thoái hoá thành quét toàn tệp; (3) <em>cỡ cố định</em>: hàm băm phụ thuộc vào cỡ tệp, nên phình tệp là đổi mọi địa chỉ và buộc phải băm lại từ đầu.</li>
<li><strong>Bảng so sánh mà đề thi muốn:</strong></li>
</ul>
<table>
<tr><td><strong>Tiêu chí</strong></td><td><strong>Tệp chỉ mục</strong></td><td><strong>Tệp băm</strong></td></tr>
<tr><td>Khoá → địa chỉ</td><td>Tra trong một bảng</td><td>Tính bằng một hàm</td></tr>
<tr><td>Chỗ tốn thêm</td><td>Cái chỉ mục (≈ 8 byte mỗi bản ghi)</td><td>Không có, nhưng phải chừa sẵn ô trống</td></tr>
<tr><td>Số lần truy cập để tìm 1 bản ghi</td><td>1 lần tra chỉ mục + 1 lần đọc</td><td>1 lần đọc (không va chạm), 1 + số lần dò nếu có</td></tr>
<tr><td>Duyệt theo thứ tự / theo khoảng</td><td>Được — đi dọc chỉ mục theo thứ tự khoá</td><td>Không — khoá bị làm cho văng tứ tung một cách cố ý</td></tr>
<tr><td>Cho tệp lớn thêm</td><td>Nối bản ghi vào, chèn một mục vào chỉ mục</td><td>Đổi hàm băm ⇒ băm lại toàn bộ</td></tr>
<tr><td>Va chạm</td><td>Không thể xảy ra</td><td>Không tránh khỏi; bắt buộc phải giải</td></tr>
</table>
<p class="meo">💡 Một dòng để không bao giờ lẫn: <strong>chỉ mục NHỚ bạn đã để nó ở đâu; hàm băm QUYẾT ĐỊNH nó phải nằm ở đâu.</strong></p>`],

      [10, 'Hashing methods — Direct hashing (Figure 10.6)',
        `<p class="y-chinh">🎯 The simplest hash function possible: <strong>none at all</strong>. In <em>direct hashing</em> the key <strong>is</strong> the address — no arithmetic, no manipulation. The price: the file must contain a slot for <em>every possible key</em>.</p>
<ul>
<li><strong>Read Figure 10.6 exactly</strong> — key <strong>025</strong> enters a red box labelled "Hash function" whose body reads <code>Addr. ← Key</code>; address <strong>025</strong> comes out and points into a Data file with addresses 001 Mary Dodd 1432.45, 002 Sarah Trapp 100.22, 003 Bryan Devaux 11.45, 004 Harry Eagle 14321.00, <strong>025 John Carver 7234.01</strong>, 099 Tuan Ngo 15121.10, 100 Shouli Feldman 87922.05. The extracted record is <strong>025 · John Carver · 7234.01</strong>. Notice the file goes from 001 to 100 and most of it is empty.</li>
<li><strong>The one unbeatable advantage</strong> — <em>"it guarantees that there are no synonyms or collisions"</em>. Because the mapping is the identity function, it is injective: two different keys can never land on the same address. That is the only hashing method in the chapter with a guarantee, and it is the reason the slide calls it "very powerful".</li>
<li><strong>The condition, and why it usually fails</strong> — "the file must contain a record for every possible key". In Figure 10.6 the keys are 3-digit employee numbers 001–100, so 100 slots is fine. Now make them real bank account numbers with 6 digits: you need <strong>1,000,000</strong> slots. At the 32-byte record measured in this lesson, that is <strong>32 MB reserved</strong>. If the bank has 5,000 customers the file is <strong>0.5 %</strong> full and 31.8 MB is empty air.</li>
<li><strong>Do the ratio yourself once</strong> — Vietnamese citizen ID (CCCD) is 12 digits. Direct hashing would need 10<sup>12</sup> slots × 32 bytes = <strong>32 terabytes</strong> to store however many records you actually have. That number is why "situations suitable for direct hashing are limited" — the slide's own words.</li>
<li><strong>When it genuinely is the right answer</strong> — when the key <em>is already</em> a small dense integer: the day of the year (1–366), the month (1–12), a seat number in a theatre, an ASCII code (0–255), the class period. In C this is simply an array, and <code>a[key]</code> is direct hashing by another name.</li>
</ul>
<p class="dap-an">✅ Đáp án — <em>why can direct hashing never collide?</em> Because the function is <code>address = key</code>, which is one-to-one by definition: distinct keys give distinct addresses. Every other hash function maps a <em>larger</em> set of keys onto a <em>smaller</em> set of addresses, and by the pigeonhole principle such a function cannot be one-to-one — which is exactly why slides 11 and 12 exist.</p>
<p class="meo">💡 Remember direct hashing as <strong>"an array on disk"</strong>. Instant, wasteful, and only usable when the keys are already the slot numbers.</p>`,
        `<p class="y-chinh">🎯 Hàm băm đơn giản nhất có thể: <strong>không có hàm nào cả</strong>. Trong <em>băm trực tiếp</em>, khoá <strong>chính là</strong> địa chỉ — không tính toán, không biến đổi gì. Cái giá: tệp phải chứa sẵn một ô cho <em>mọi khoá khả dĩ</em>.</p>
<ul>
<li><strong>Đọc Hình 10.6 cho chính xác</strong> — khoá <strong>025</strong> đi vào khung đỏ tên "Hash function" mà thân ghi <code>Addr. ← Key</code>; địa chỉ <strong>025</strong> đi ra và trỏ vào Data file có các địa chỉ 001 Mary Dodd 1432.45, 002 Sarah Trapp 100.22, 003 Bryan Devaux 11.45, 004 Harry Eagle 14321.00, <strong>025 John Carver 7234.01</strong>, 099 Tuan Ngo 15121.10, 100 Shouli Feldman 87922.05. Bản ghi rút ra là <strong>025 · John Carver · 7234.01</strong>. Để ý tệp chạy từ 001 tới 100 và phần lớn là ô trống.</li>
<li><strong>Ưu điểm không gì bì được</strong> — <em>"nó BẢO ĐẢM không có từ đồng nghĩa (synonym) và không có va chạm"</em>. Vì phép ánh xạ là hàm đồng nhất nên nó đơn ánh: hai khoá khác nhau không đời nào rơi vào cùng một địa chỉ. Đây là phương pháp băm DUY NHẤT trong chương có bảo đảm, và đó là lý do slide gọi nó là "rất mạnh".</li>
<li><strong>Điều kiện, và vì sao nó thường không thoả</strong> — "tệp phải chứa một bản ghi cho mọi khoá khả dĩ". Ở Hình 10.6 khoá là mã nhân viên 3 chữ số 001–100, nên 100 ô là ổn. Giờ đổi sang số tài khoản ngân hàng thật 6 chữ số: bạn cần <strong>1.000.000</strong> ô. Với bản ghi 32 byte như đã đo trong bài này, đó là <strong>32 MB đặt chỗ sẵn</strong>. Nếu ngân hàng có 5.000 khách thì tệp đầy <strong>0,5 %</strong> và 31,8 MB là không khí.</li>
<li><strong>Tự làm phép chia ấy một lần cho nhớ</strong> — số CCCD Việt Nam có 12 chữ số. Băm trực tiếp sẽ cần 10<sup>12</sup> ô × 32 byte = <strong>32 nghìn tỷ byte, tức 32 TB</strong>, để chứa dù bạn chỉ có vài bản ghi. Con số ấy giải thích vì sao "các tình huống hợp với băm trực tiếp là hạn chế" — nguyên văn slide.</li>
<li><strong>Khi nào nó thật sự là đáp án đúng</strong> — khi khoá <em>vốn đã là</em> một số nguyên nhỏ và dày đặc: ngày thứ mấy trong năm (1–366), tháng (1–12), số ghế trong rạp, mã ASCII (0–255), tiết học. Trong C thì đó chỉ là một cái mảng, và <code>a[key]</code> chính là băm trực tiếp mang tên khác.</li>
</ul>
<p class="dap-an">✅ Đáp án — <em>vì sao băm trực tiếp không bao giờ va chạm?</em> Vì hàm của nó là <code>địa chỉ = khoá</code>, tự thân đã là một-một: khoá khác nhau cho địa chỉ khác nhau. Mọi hàm băm khác đều ánh xạ một tập khoá <em>LỚN HƠN</em> xuống một tập địa chỉ <em>NHỎ HƠN</em>, và theo nguyên lý chuồng bồ câu thì hàm như thế không thể đơn ánh — chính vì vậy mới có slide 11 và 12.</p>
<p class="meo">💡 Nhớ băm trực tiếp là <strong>"một cái mảng đặt trên đĩa"</strong>. Tức thì, phí phạm, và chỉ dùng được khi khoá vốn đã là số thứ tự của ô.</p>`],

      [11, 'Hashing methods (cont) — Modulo division hashing (Figure 10.7)',
        `<p class="y-chinh">🎯 The method you will be asked to compute in the exam: <strong>address = key mod list_size + 1</strong>. Also called <em>division remainder hashing</em>. The <code>+ 1</code> exists only because this chapter numbers addresses from 1, not 0.</p>
<ul>
<li><strong>Read Figure 10.7 exactly</strong> — key <strong>121267</strong> enters a red box reading <code>Addr. ← Key mod 307 + 1</code>; address <strong>003</strong> comes out and points at the Data File, whose rows are 001 379452 Mary Dodd 1432.45, 002 070918 Sarah Trapp 100.22, <strong>003 121267 Bryan Devaux 11.45</strong>, 004 166702 Harry Eagle 14321.00, 008 378845 John Carver 7234.01, 306 160252 Tuan Ngo 15121.10, 307 045128 Shouli Feldman 87922.05. Extracted record: <strong>121267 · Bryan Devaux · 11.45</strong>.</li>
<li><strong>Every address in that figure, verified by running it</strong> — computed with a C program compiled by <code>cc -Wall</code>:</li>
</ul>
<table>
<tr><td><strong>Key</strong></td><td><strong>key mod 307 + 1</strong></td><td><strong>Address in Figure 10.7</strong></td><td><strong>Match?</strong></td></tr>
<tr><td>379452</td><td>1</td><td>001</td><td>✔</td></tr>
<tr><td>070918</td><td>2</td><td>002</td><td>✔</td></tr>
<tr><td>121267</td><td>3</td><td>003</td><td>✔</td></tr>
<tr><td>166702</td><td><strong>2</strong></td><td><strong>004</strong></td><td><strong>✘ — see below</strong></td></tr>
<tr><td>378845</td><td>8</td><td>008</td><td>✔</td></tr>
<tr><td>160252</td><td>306</td><td>306</td><td>✔</td></tr>
<tr><td>045128</td><td>307</td><td>307</td><td>✔</td></tr>
</table>
<ul>
<li><strong>Why list_size is 307 and not 300</strong> — 307 is <em>prime</em>. If the file size shares a factor with patterns in the keys (account numbers ending in 00, IDs stepping by 10) a composite modulus folds them all onto the same few addresses. A prime modulus has no common factor to exploit, so the remainders spread evenly. This is the single most useful practical fact about modulo hashing.</li>
<li><strong>The range check that catches sign errors</strong> — <code>key mod 307</code> yields 0…306, so <code>+ 1</code> yields 1…307. Exactly 307 addresses for a 307-slot file. If your computed address is 0 or 308, you made an arithmetic slip.</li>
</ul>
<p class="dap-an">✅ Đáp án — <strong>the figure contains an unlabelled collision.</strong> 166702 mod 307 = 1, so its home address is <strong>2</strong>, not 4. Address 2 is already taken by 070918, and address 3 by 121267, so the record was pushed on to the first free slot, <strong>004</strong> — that is open addressing with linear probing, exactly what slide 12 is about. The slide does not say a word about it. So the picture is <em>not</em> wrong, but it is silently showing you a resolved collision one slide before collisions are introduced. If an exam asks "what is the home address of 166702?", the answer is <strong>2</strong>; if it asks "where is the record stored in Figure 10.7?", the answer is <strong>4</strong>.</p>
<p class="pitfall">⚠️ Two traps. First: the textbook writes <code>+ 1</code> because its addresses start at 1; in C an array starts at 0 and the correct code is <code>address = key % SIZE;</code> with <strong>no</strong> <code>+ 1</code>. Write the formula the way the slide writes it only when the question is from this chapter. Second: <code>mod</code> is the <em>remainder</em>, not the quotient. 121267 mod 307 = 2, not 395.</p>`,
        `<p class="y-chinh">🎯 Phương pháp mà đề thi sẽ bắt bạn TÍNH: <strong>địa chỉ = khoá mod list_size + 1</strong>. Còn gọi là <em>băm chia lấy phần dư</em>. Cái <code>+ 1</code> chỉ tồn tại vì chương này đánh địa chỉ từ 1 chứ không từ 0.</p>
<ul>
<li><strong>Đọc Hình 10.7 cho chính xác</strong> — khoá <strong>121267</strong> đi vào khung đỏ ghi <code>Addr. ← Key mod 307 + 1</code>; địa chỉ <strong>003</strong> đi ra và trỏ vào Data File với các dòng 001 379452 Mary Dodd 1432.45, 002 070918 Sarah Trapp 100.22, <strong>003 121267 Bryan Devaux 11.45</strong>, 004 166702 Harry Eagle 14321.00, 008 378845 John Carver 7234.01, 306 160252 Tuan Ngo 15121.10, 307 045128 Shouli Feldman 87922.05. Bản ghi rút ra: <strong>121267 · Bryan Devaux · 11.45</strong>.</li>
<li><strong>Mọi địa chỉ trong hình ấy, đã kiểm lại bằng cách CHẠY</strong> — tính bằng chương trình C biên dịch với <code>cc -Wall</code>:</li>
</ul>
<table>
<tr><td><strong>Khoá</strong></td><td><strong>khoá mod 307 + 1</strong></td><td><strong>Địa chỉ trong Hình 10.7</strong></td><td><strong>Khớp?</strong></td></tr>
<tr><td>379452</td><td>1</td><td>001</td><td>✔</td></tr>
<tr><td>070918</td><td>2</td><td>002</td><td>✔</td></tr>
<tr><td>121267</td><td>3</td><td>003</td><td>✔</td></tr>
<tr><td>166702</td><td><strong>2</strong></td><td><strong>004</strong></td><td><strong>✘ — xem phần Đáp án</strong></td></tr>
<tr><td>378845</td><td>8</td><td>008</td><td>✔</td></tr>
<tr><td>160252</td><td>306</td><td>306</td><td>✔</td></tr>
<tr><td>045128</td><td>307</td><td>307</td><td>✔</td></tr>
</table>
<ul>
<li><strong>Vì sao list_size là 307 chứ không phải 300</strong> — 307 là số <em>nguyên tố</em>. Nếu cỡ tệp có ước chung với quy luật nào đó trong khoá (số tài khoản kết thúc bằng 00, mã nhảy từng 10) thì một mô-đun hợp số sẽ dồn tất cả về vài địa chỉ. Mô-đun nguyên tố không có ước chung nào để bị khai thác, nên phần dư trải đều. Đây là điều thực dụng hữu ích nhất cần nhớ về băm chia lấy dư.</li>
<li><strong>Phép kiểm khoảng để bắt lỗi tính</strong> — <code>khoá mod 307</code> cho 0…306, nên <code>+ 1</code> cho 1…307. Đúng 307 địa chỉ cho một tệp 307 ô. Nếu bạn tính ra 0 hay 308 thì chắc chắn đã sai số học ở đâu đó.</li>
</ul>
<p class="dap-an">✅ Đáp án — <strong>trong hình có một VA CHẠM không được chú thích.</strong> 166702 mod 307 = 1, nên địa chỉ nhà của nó là <strong>2</strong>, không phải 4. Địa chỉ 2 đã bị 070918 chiếm, địa chỉ 3 đã bị 121267 chiếm, nên bản ghi bị đẩy tới ô trống đầu tiên là <strong>004</strong> — đó chính là địa chỉ mở với dò tuyến tính, đúng nội dung slide 12. Slide không nói một chữ nào về việc này. Vậy bức hình KHÔNG sai, nhưng nó đang lặng lẽ cho bạn xem một va chạm đã được giải, trước khi va chạm được giới thiệu một slide. Nếu đề hỏi "địa chỉ nhà của 166702 là bao nhiêu?" thì đáp án là <strong>2</strong>; nếu hỏi "trong Hình 10.7 bản ghi nằm ở đâu?" thì đáp án là <strong>4</strong>.</p>
<p class="pitfall">⚠️ Hai cái bẫy. Một: giáo trình viết <code>+ 1</code> vì địa chỉ của nó bắt đầu từ 1; trong C thì mảng bắt đầu từ 0 và mã đúng là <code>address = key % SIZE;</code> <strong>KHÔNG</strong> có <code>+ 1</code>. Chỉ viết công thức y như slide khi câu hỏi là của chương này. Hai: <code>mod</code> là <em>phần dư</em>, không phải thương. 121267 mod 307 = 2, không phải 395.</p>`],

      [12, '5. Collision resolution — Figures 13.11 and 10.8',
        `<p class="y-chinh">🎯 <em>"When we hash a new key to an address, we may create a collision."</em> Two keys that hash to the same address are called <strong>synonyms</strong>. The chapter's second sentence is the one to underline: <strong>any hashing method can be combined with any collision resolution method</strong> — the two choices are independent.</p>
<ul>
<li><strong>Read the two figures</strong> — both feed keys <strong>123013</strong> and <strong>151564</strong> into the same yellow box <code>Addr. ← Key mod 307 + 1</code>, and both get address <strong>214</strong>. Verified by running it: 123013 mod 307 + 1 = 214 and 151564 mod 307 + 1 = 214. A genuine collision. Figure 13.11 (<em>open addressing</em>) then stores 123013 Duc Lee 1105.45 at 214 and pushes 151564 Rich White 708.22 to <strong>215</strong>, the next slot. Figure 10.8 (<em>linked list</em>) keeps 123013 at 214 as the <strong>Home</strong> record with a pointer, and puts 151564 in a separate <strong>Overflow area</strong> whose own pointer is null (the red X).</li>
<li><strong>Why collisions are inevitable</strong> — 6-digit keys give 1,000,000 possible values mapped onto 307 addresses. By the pigeonhole principle at least one address must receive more than 3,000 possible keys. Collisions are not a bug in the function, they are arithmetic.</li>
<li><strong>Worked example, computed and run for this lesson</strong> — take a 10-slot table (addresses 0–9, C-style) and <code>h(k) = k mod 10</code>, inserting the keys <strong>12345, 67890, 54321, 90210, 11115</strong> in that order. Home addresses: h(12345)=5, h(67890)=0, h(54321)=1, h(90210)=0, h(11115)=5. Two collisions: 90210 against 67890, and 11115 against 12345.</li>
<li><strong>Method 1 — open addressing (linear probing), step by step:</strong></li>
</ul>
<table>
<tr><td><strong>Step</strong></td><td><strong>Key</strong></td><td><strong>Home h(k)</strong></td><td><strong>What happens</strong></td><td><strong>Final slot</strong></td><td><strong>Probes</strong></td></tr>
<tr><td>1</td><td>12345</td><td>5</td><td>5 is empty</td><td>5</td><td>1</td></tr>
<tr><td>2</td><td>67890</td><td>0</td><td>0 is empty</td><td>0</td><td>1</td></tr>
<tr><td>3</td><td>54321</td><td>1</td><td>1 is empty</td><td>1</td><td>1</td></tr>
<tr><td>4</td><td>90210</td><td>0</td><td>0 taken by 67890 (synonym) → try 1, taken by 54321 (<em>not</em> a synonym!) → try 2, free</td><td>2</td><td>3</td></tr>
<tr><td>5</td><td>11115</td><td>5</td><td>5 taken by 12345 (synonym) → try 6, free</td><td>6</td><td>2</td></tr>
</table>
<ul>
<li><strong>Resulting table</strong> — <code>[0]=67890 [1]=54321 [2]=90210 [3]=— [4]=— [5]=12345 [6]=11115 [7]=— [8]=— [9]=—</code>. Total probes to insert 5 keys: <strong>8</strong>, average <strong>1.6</strong>. Searching for 11115 afterwards takes <strong>2</strong> reads (address 5, then 6).</li>
<li><strong>Method 2 — linked list resolution (chaining), same keys, same order:</strong></li>
</ul>
<table>
<tr><td><strong>Address</strong></td><td><strong>Chain</strong></td></tr>
<tr><td>0</td><td>67890 → 90210</td></tr>
<tr><td>1</td><td>54321</td></tr>
<tr><td>5</td><td>12345 → 11115</td></tr>
<tr><td>2, 3, 4, 6, 7, 8, 9</td><td>empty</td></tr>
</table>
<p class="dap-an">✅ Đáp án — <em>compare the two resolutions on this data.</em> Linear probing never leaves its 10 slots, so no extra storage, but it caused a <strong>secondary collision</strong>: 90210 was blocked at address 1 by 54321, a record that is <em>not</em> its synonym. That is <em>clustering</em>, and it makes later searches slower and slower as the table fills. Chaining has no clustering at all — 90210 sits in address 0's chain where it belongs, and every search touches only true synonyms — but it needs a pointer in every record plus an overflow area. Exam summary: <strong>open addressing = no extra space, suffers clustering, degrades badly above ~75 % load; chaining = extra pointers and an overflow area, no clustering, degrades gracefully.</strong></p>
<p class="pitfall">⚠️ Three traps. (1) Deleting from an open-addressed table by simply blanking the slot <strong>breaks every search that probed past it</strong>; you must write a "deleted" tombstone instead. (2) The two figures on this slide are captioned "Figure 13.11" and "Figure 10.8" — two numbering systems in one slide, another Chapter-13 leftover. (3) Synonyms are keys with the <em>same home address</em>; two records sitting next to each other after probing are not necessarily synonyms, as 54321 and 90210 demonstrate.</p>`,
        `<p class="y-chinh">🎯 <em>"Khi băm một khoá mới ra một địa chỉ, ta có thể tạo ra một va chạm."</em> Hai khoá băm ra cùng một địa chỉ gọi là <strong>từ đồng nghĩa (synonym)</strong>. Câu thứ hai của chương mới là câu phải gạch chân: <strong>bất kỳ phương pháp băm nào cũng ghép được với bất kỳ phương pháp giải va chạm nào</strong> — hai lựa chọn ấy ĐỘC LẬP với nhau.</p>
<ul>
<li><strong>Đọc hai bức hình</strong> — cả hai đều đẩy khoá <strong>123013</strong> và <strong>151564</strong> vào cùng một khung vàng <code>Addr. ← Key mod 307 + 1</code>, và cả hai đều ra địa chỉ <strong>214</strong>. Đã kiểm bằng cách chạy thật: 123013 mod 307 + 1 = 214 và 151564 mod 307 + 1 = 214. Va chạm thật. Hình 13.11 (<em>địa chỉ mở</em>) đặt 123013 Duc Lee 1105.45 vào 214 rồi đẩy 151564 Rich White 708.22 sang <strong>215</strong>, ô kế tiếp. Hình 10.8 (<em>danh sách liên kết</em>) giữ 123013 ở 214 làm bản ghi <strong>Home</strong> kèm một con trỏ, và đặt 151564 vào một <strong>vùng tràn (Overflow area)</strong> riêng mà con trỏ của nó là rỗng (dấu X đỏ).</li>
<li><strong>Vì sao va chạm là không tránh khỏi</strong> — khoá 6 chữ số cho 1.000.000 giá trị khả dĩ, ánh xạ xuống 307 địa chỉ. Theo nguyên lý chuồng bồ câu, ít nhất một địa chỉ phải nhận hơn 3.000 khoá khả dĩ. Va chạm không phải lỗi của hàm băm, nó là số học.</li>
<li><strong>Ví dụ giải từng bước, đã tính và CHẠY thật cho bài này</strong> — lấy bảng 10 ô (địa chỉ 0–9, kiểu C) với <code>h(k) = k mod 10</code>, chèn lần lượt các khoá <strong>12345, 67890, 54321, 90210, 11115</strong>. Địa chỉ nhà: h(12345)=5, h(67890)=0, h(54321)=1, h(90210)=0, h(11115)=5. Hai va chạm: 90210 đụng 67890, và 11115 đụng 12345.</li>
<li><strong>Cách 1 — địa chỉ mở (dò tuyến tính), từng bước:</strong></li>
</ul>
<table>
<tr><td><strong>Bước</strong></td><td><strong>Khoá</strong></td><td><strong>Địa chỉ nhà h(k)</strong></td><td><strong>Chuyện gì xảy ra</strong></td><td><strong>Ô cuối cùng</strong></td><td><strong>Số lần dò</strong></td></tr>
<tr><td>1</td><td>12345</td><td>5</td><td>ô 5 trống</td><td>5</td><td>1</td></tr>
<tr><td>2</td><td>67890</td><td>0</td><td>ô 0 trống</td><td>0</td><td>1</td></tr>
<tr><td>3</td><td>54321</td><td>1</td><td>ô 1 trống</td><td>1</td><td>1</td></tr>
<tr><td>4</td><td>90210</td><td>0</td><td>ô 0 đã có 67890 (đồng nghĩa) → thử 1, đã có 54321 (<em>KHÔNG</em> đồng nghĩa!) → thử 2, trống</td><td>2</td><td>3</td></tr>
<tr><td>5</td><td>11115</td><td>5</td><td>ô 5 đã có 12345 (đồng nghĩa) → thử 6, trống</td><td>6</td><td>2</td></tr>
</table>
<ul>
<li><strong>Bảng sau khi chèn xong</strong> — <code>[0]=67890 [1]=54321 [2]=90210 [3]=— [4]=— [5]=12345 [6]=11115 [7]=— [8]=— [9]=—</code>. Tổng số lần dò để chèn 5 khoá: <strong>8</strong>, trung bình <strong>1,6</strong>. Sau đó tìm 11115 mất <strong>2</strong> lần đọc (địa chỉ 5, rồi 6).</li>
<li><strong>Cách 2 — móc xích bằng danh sách liên kết, cùng khoá, cùng thứ tự:</strong></li>
</ul>
<table>
<tr><td><strong>Địa chỉ</strong></td><td><strong>Dây xích</strong></td></tr>
<tr><td>0</td><td>67890 → 90210</td></tr>
<tr><td>1</td><td>54321</td></tr>
<tr><td>5</td><td>12345 → 11115</td></tr>
<tr><td>2, 3, 4, 6, 7, 8, 9</td><td>rỗng</td></tr>
</table>
<p class="dap-an">✅ Đáp án — <em>so sánh hai cách giải trên đúng bộ dữ liệu này.</em> Dò tuyến tính không bước ra khỏi 10 ô nên không tốn chỗ phụ, nhưng nó đã gây ra một <strong>va chạm thứ cấp</strong>: 90210 bị chặn ở địa chỉ 1 bởi 54321, một bản ghi <em>không hề</em> đồng nghĩa với nó. Đó là hiện tượng <em>vón cục (clustering)</em>, và nó làm các lần tìm về sau càng lúc càng chậm khi bảng đầy dần. Móc xích thì hoàn toàn không vón cục — 90210 nằm đúng trong dây xích của địa chỉ 0, và mỗi lần tìm chỉ chạm vào những khoá đồng nghĩa thật sự — nhưng nó cần một con trỏ trong mỗi bản ghi cộng một vùng tràn. Câu tóm cho bài thi: <strong>địa chỉ mở = không tốn chỗ thêm, bị vón cục, xuống dốc nhanh khi bảng đầy quá ~75 %; móc xích = tốn con trỏ và vùng tràn, không vón cục, xuống dốc từ tốn.</strong></p>
<p class="pitfall">⚠️ Ba cái bẫy. (1) Xoá khỏi bảng địa chỉ mở bằng cách xoá trắng cái ô sẽ <strong>làm hỏng mọi phép tìm từng dò qua ô đó</strong>; phải ghi một dấu "đã xoá" (tombstone) thay vì để trống. (2) Hai hình trên slide này chú thích là "Figure 13.11" và "Figure 10.8" — hai hệ đánh số trong cùng một slide, lại một dấu vết Chương 13. (3) Đồng nghĩa là những khoá có <em>cùng địa chỉ nhà</em>; hai bản ghi nằm cạnh nhau sau khi dò thì chưa chắc đã đồng nghĩa, đúng như cặp 54321 và 90210 vừa chứng minh.</p>`],

      [13, '2 - Text versus Binary',
        `<p class="y-chinh">🎯 Section divider for the second half. The question changes from <em>"where is the record?"</em> to <em>"what do these bytes mean?"</em> — and the answer is the most quietly important sentence in the chapter: <strong>the bytes mean nothing on their own</strong>.</p>
<ul>
<li><strong>What is coming</strong> — slide 14 states the thesis (one bit sequence, two interpretations), slide 15 defines the text file, slide 16 defines the binary file, slide 17 adds directories.</li>
<li><strong>The thesis in advance</strong> — a file has no type. There is no field anywhere on disk saying "I am text". The type lives entirely in <em>the program that opens the file</em>, and in your own expectation. Renaming <code>photo.jpg</code> to <code>photo.txt</code> changes nothing about the bytes; it only changes which program Windows launches.</li>
<li><strong>Why this matters for the access half you just finished</strong> — the two halves are orthogonal. A hashed file is usually binary (fixed-length records, so <code>fseek</code> arithmetic works), a log file is usually sequential text, but any of the six combinations is legal.</li>
<li><strong>The measurement that decides it in practice</strong> — the same integer 12345 was written both ways for this lesson and inspected with <code>xxd</code>: as text it is <strong>5 bytes</strong> <code>31 32 33 34 35</code>; as binary it is <strong>4 bytes</strong> <code>39 30 00 00</code>. Two files, same number, no byte in common. Slides 15 and 16 unpack exactly that.</li>
<li><strong>Where the exam question comes from</strong> — objective seven: "distinguish between text and binary files". A comparison table earns full marks; a definition alone does not.</li>
</ul>
<p class="meo">💡 One sentence to carry into slides 14–16: <strong>a text file is a file of CHARACTERS; a binary file is a file of MEMORY IMAGES.</strong> Everything else — size, speed, portability, whether Notepad can open it — follows from that difference.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục cho nửa sau. Câu hỏi đổi từ <em>"bản ghi nằm ở đâu?"</em> sang <em>"mấy byte này NGHĨA LÀ GÌ?"</em> — và câu trả lời là câu quan trọng nhất mà chương nói khẽ nhất: <strong>tự thân các byte không có nghĩa gì cả</strong>.</p>
<ul>
<li><strong>Sắp tới là gì</strong> — slide 14 phát biểu luận điểm (một dãy bit, hai cách diễn giải), slide 15 định nghĩa tệp văn bản, slide 16 định nghĩa tệp nhị phân, slide 17 thêm phần thư mục.</li>
<li><strong>Luận điểm nói trước</strong> — một tệp KHÔNG có kiểu. Không có trường nào trên đĩa ghi "tôi là văn bản". Kiểu nằm hoàn toàn ở <em>chương trình mở tệp ấy</em>, và ở kỳ vọng của chính bạn. Đổi tên <code>photo.jpg</code> thành <code>photo.txt</code> chẳng đổi được byte nào; nó chỉ đổi việc Windows mở tệp bằng phần mềm nào.</li>
<li><strong>Vì sao điều này liên quan tới nửa truy cập vừa học xong</strong> — hai nửa VUÔNG GÓC với nhau. Tệp băm thường là nhị phân (bản ghi cố định độ dài nên phép tính địa chỉ cho <code>fseek</code> mới chạy), tệp log thường là văn bản tuần tự, nhưng cả sáu tổ hợp đều hợp lệ.</li>
<li><strong>Phép đo quyết định chuyện đó trong thực tế</strong> — cùng số nguyên 12345 được ghi theo hai cách cho bài này rồi soi bằng <code>xxd</code>: dạng văn bản là <strong>5 byte</strong> <code>31 32 33 34 35</code>; dạng nhị phân là <strong>4 byte</strong> <code>39 30 00 00</code>. Hai tệp, cùng một con số, không byte nào giống nhau. Slide 15 và 16 mổ xẻ đúng chuyện đó.</li>
<li><strong>Câu hỏi thi lấy từ đâu</strong> — mục tiêu số bảy: "phân biệt tệp văn bản và tệp nhị phân". Một bảng so sánh thì ăn trọn điểm; chỉ đưa định nghĩa thì không.</li>
</ul>
<p class="meo">💡 Một câu mang vào slide 14–16: <strong>tệp văn bản là tệp của các KÝ TỰ; tệp nhị phân là tệp của các ẢNH CHỤP BỘ NHỚ.</strong> Mọi thứ còn lại — kích thước, tốc độ, tính khả chuyển, Notepad mở được hay không — đều suy ra từ khác biệt ấy.</p>`],

      [14, '1. TEXT VERSUS BINARY — Figure 10.9 Text and binary interpretations of a file',
        `<p class="y-chinh">🎯 The whole idea in one picture: the identical two bytes <strong>01000001 01000010</strong> mean <em>"A" and "B"</em> when interpreted as a text file, and the single number <em>16706</em> when interpreted as a binary file. Same bits, two truths.</p>
<ul>
<li><strong>Do the arithmetic so it stops being magic</strong> — 01000001 is 65 decimal, 0x41, which is ASCII <code>'A'</code>. 01000010 is 66, 0x42, ASCII <code>'B'</code>. Now glue the two bytes into one 16-bit integer: 0x4142 = 4×4096 + 1×256 + 4×16 + 2 = <strong>16706</strong>. Verified by running it in C for this lesson.</li>
<li><strong>The sentence to memorise</strong> — <em>"a file stored on a storage device is a sequence of bits that can be interpreted by an application program as a text file or a binary file"</em>. Note <strong>"by an application program"</strong>: the interpretation is not in the file, it is in the reader.</li>
<li><strong>Why the drawing puts an EOF triangle on both</strong> — because storage-level structure is identical too. Both pictures show the same box, the same bits, the same end marker. Only the caption underneath differs, and the caption is the program.</li>
<li><strong>The real-life proof</strong> — a <code>.docx</code> is a ZIP archive, a <code>.jpg</code> starts with the bytes <code>FF D8 FF</code>, a <code>.class</code> file starts with <code>CA FE BA BE</code>. Those "magic numbers" exist precisely <em>because</em> the file itself does not declare its type: programs have to guess by peeking at the first few bytes.</li>
</ul>
<p class="dap-an">✅ Đáp án — <strong>the slide's 16706 is correct but incomplete.</strong> 16706 is the <em>big-endian</em> reading, i.e. the first byte is the most significant. Measured on this machine (Apple Silicon, little-endian) the same two bytes <code>41 42</code> read as a 16-bit integer give <strong>16961</strong> (0x4241). Both answers are right; which one you get depends on the CPU. If an exam asks for "the number", give <strong>16706</strong> and say "assuming big-endian" — that shows you understand why the question is ambiguous. Slide 16 returns to this as the main portability problem of binary files.</p>
<p class="pitfall">⚠️ Do not conclude from this slide that "text files store characters and binary files store numbers, so they are different kinds of storage". <em>Everything</em> on disk is bits. A text file also stores numbers — the numbers happen to be character codes. The difference is the <strong>agreed interpretation</strong>, nothing more.</p>
<p class="meo">💡 Test the idea in thirty seconds on your own machine: run <code>xxd yourfile.txt</code>. You will see the hex bytes on the left and the characters on the right — that is Figure 10.9, live, both interpretations printed side by side by one tool.</p>`,
        `<p class="y-chinh">🎯 Toàn bộ ý tưởng gói trong một bức hình: đúng hai byte <strong>01000001 01000010</strong> có nghĩa là <em>"A" và "B"</em> khi được diễn giải như tệp văn bản, và là một con số duy nhất <em>16706</em> khi được diễn giải như tệp nhị phân. Cùng bit, hai sự thật.</p>
<ul>
<li><strong>Làm phép tính cho nó hết huyền bí</strong> — 01000001 là 65 hệ mười, tức 0x41, chính là mã ASCII của <code>'A'</code>. 01000010 là 66, tức 0x42, mã ASCII của <code>'B'</code>. Giờ dán hai byte thành một số nguyên 16 bit: 0x4142 = 4×4096 + 1×256 + 4×16 + 2 = <strong>16706</strong>. Đã kiểm bằng cách chạy chương trình C cho bài này.</li>
<li><strong>Câu phải thuộc</strong> — <em>"một tệp lưu trên thiết bị lưu trữ là một dãy bit CÓ THỂ ĐƯỢC MỘT CHƯƠNG TRỈNH ỨNG DỤNG diễn giải thành tệp văn bản hoặc tệp nhị phân"</em>. Chú ý cụm <strong>"bởi một chương trình ứng dụng"</strong>: phép diễn giải không nằm trong tệp, nó nằm ở người đọc.</li>
<li><strong>Vì sao hình vẽ tam giác EOF ở cả hai bên</strong> — vì cấu trúc ở mức lưu trữ cũng y hệt nhau. Hai bức vẽ cùng một cái khung, cùng những bit ấy, cùng một dấu kết thúc. Chỉ dòng chú thích bên dưới là khác, và dòng chú thích ấy chính là chương trình.</li>
<li><strong>Bằng chứng ngoài đời</strong> — một tệp <code>.docx</code> thực ra là kho nén ZIP, một tệp <code>.jpg</code> mở đầu bằng các byte <code>FF D8 FF</code>, một tệp <code>.class</code> mở đầu bằng <code>CA FE BA BE</code>. Những "số thần" ấy tồn tại CHÍNH VÌ tệp không tự khai kiểu của mình: chương trình buộc phải đoán bằng cách hé nhìn vài byte đầu.</li>
</ul>
<p class="dap-an">✅ Đáp án — <strong>con số 16706 của slide là ĐÚNG nhưng THIẾU.</strong> 16706 là cách đọc <em>big-endian</em>, tức byte đầu là byte có trọng số lớn nhất. Đo thật trên máy này (Apple Silicon, little-endian), cũng hai byte <code>41 42</code> ấy đọc thành số nguyên 16 bit lại ra <strong>16961</strong> (0x4241). Cả hai đáp án đều đúng; ra số nào là do CPU. Nếu đề hỏi "con số là bao nhiêu" thì ghi <strong>16706</strong> và nói thêm "với giả thiết big-endian" — như thế mới cho thấy bạn hiểu vì sao câu hỏi mập mờ. Slide 16 sẽ quay lại đúng điểm này như vấn đề khả chuyển chính của tệp nhị phân.</p>
<p class="pitfall">⚠️ Đừng kết luận từ slide này rằng "tệp văn bản chứa ký tự còn tệp nhị phân chứa số, nên chúng là hai kiểu lưu trữ khác nhau". <em>Mọi thứ</em> trên đĩa đều là bit. Tệp văn bản cũng đang chứa số — chỉ là những con số ấy tình cờ là mã ký tự. Khác biệt nằm ở <strong>quy ước diễn giải</strong>, không có gì hơn.</p>
<p class="meo">💡 Thử ý này trong ba mươi giây trên máy của bạn: chạy <code>xxd tepcuaban.txt</code>. Bạn sẽ thấy byte dạng hex ở bên trái và ký tự ở bên phải — đó chính là Hình 10.9 phiên bản sống, một công cụ in ra cả hai cách diễn giải cạnh nhau.</p>`],

      [15, '2. Text File — Figure 10.10 Text file',
        `<p class="y-chinh">🎯 The definition, word for word: <em>"a text file is a file of <strong>characters</strong>. It cannot contain integers, floating-point numbers, or any other data structures in their internal memory format. To store these data types, they must be <strong>converted</strong> to their character equivalent formats."</em></p>
<ul>
<li><strong>Read Figure 10.10</strong> — a Notepad window titled <code>text_file.txt</code> showing six lines of ordinary Lorem ipsum. That is the whole point of the picture: a text file is the file you can <em>look at</em>. No decoder needed, the eye is the decoder.</li>
<li><strong>What "converted" costs, measured</strong> — for this lesson the integer 12345 was written with <code>fprintf(f, "%d", n)</code> and the result inspected with <code>xxd</code>: <strong>5 bytes</strong>, <code>31 32 33 34 35</code>. Those are the ASCII codes of '1','2','3','4','5' — one byte per <em>digit</em>. The double 3.14 written with <code>%f</code> became <code>3.140000</code>, <strong>8 bytes</strong>, <code>33 2e 31 34 30 30 30 30</code>.</li>
<li><strong>The conversion is not free in time either</strong> — writing 1,000,000 integers took <strong>0.0759 s</strong> as text against 0.0332 s as binary, i.e. text was <strong>2.3× slower</strong>, because every number has to be turned into digits by division and every number read back has to be parsed. Sizes measured with <code>ls -l</code>: <strong>7,100,000 bytes</strong> as text against 4,000,000 as binary.</li>
<li><strong>The invisible characters that cause real bugs</strong> — the end of a line is <code>0A</code> (LF) on Linux and macOS but <code>0D 0A</code> (CR+LF) on Windows, which is why the same text file can be 1 byte per line larger on Windows, and why a Linux file sometimes opens in old Notepad as one endless line. In C, <code>fopen(f, "r")</code> on Windows silently translates CR+LF into a single <code>\\n</code>; <code>fopen(f, "rb")</code> does not. That difference is the whole reason the <code>b</code> flag exists.</li>
<li><strong>Encoding is the other half</strong> — "character" only has a meaning once you fix an encoding. ASCII covers 128 characters in 1 byte; UTF-8 needs <strong>3 bytes</strong> for a Vietnamese letter like "ế" and 1 byte for "a". So a Vietnamese text file is not "one byte per character", and mixing UTF-8 with Windows-1258 is exactly how you get mojibake.</li>
</ul>
<table>
<tr><td><strong>Property</strong></td><td><strong>Text file</strong></td></tr>
<tr><td>Contents</td><td>Characters only, in some encoding (ASCII, UTF-8)</td></tr>
<tr><td>Integer 12345 occupies</td><td><strong>5 bytes</strong> — one per digit (measured)</td></tr>
<tr><td>Readable by eye</td><td>Yes — Notepad, <code>cat</code>, any editor</td></tr>
<tr><td>Editable in Notepad</td><td>Yes, safely</td></tr>
<tr><td>Portable across machines</td><td>Yes — endianness and padding are irrelevant; only encoding and line endings differ</td></tr>
<tr><td>Speed</td><td>Slower — conversion on every read and write (measured 2.3×)</td></tr>
<tr><td>C access</td><td><code>fopen("f.txt", "r")</code>, <code>fprintf</code>, <code>fscanf</code>, <code>fgets</code></td></tr>
</table>
<p class="meo">💡 Choose text whenever a human, a diff tool, or another organisation's program has to read the file: config files, CSV, JSON, source code, logs. The 2.3× speed and the extra bytes are a cheap price for being able to open it anywhere, forever.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa, nguyên văn: <em>"tệp văn bản là tệp của các <strong>KÝ TỰ</strong>. Nó KHÔNG thể chứa số nguyên, số thực dấu phẩy động hay bất kỳ cấu trúc dữ liệu nào ở dạng bên trong bộ nhớ. Muốn lưu những kiểu ấy thì phải <strong>CHUYỂN ĐỔI</strong> chúng sang dạng ký tự tương đương."</em></p>
<ul>
<li><strong>Đọc Hình 10.10</strong> — một cửa sổ Notepad tên <code>text_file.txt</code> hiện sáu dòng Lorem ipsum bình thường. Đó chính là ý của bức hình: tệp văn bản là tệp mà bạn <em>NHÌN</em> được. Không cần bộ giải mã nào, con mắt là bộ giải mã.</li>
<li><strong>Cái giá của "chuyển đổi", đo thật</strong> — cho bài này, số nguyên 12345 được ghi bằng <code>fprintf(f, "%d", n)</code> rồi soi bằng <code>xxd</code>: <strong>5 byte</strong>, <code>31 32 33 34 35</code>. Đó là mã ASCII của '1','2','3','4','5' — mỗi <em>chữ số</em> một byte. Số thực 3.14 ghi bằng <code>%f</code> thành <code>3.140000</code>, <strong>8 byte</strong>, <code>33 2e 31 34 30 30 30 30</code>.</li>
<li><strong>Chuyển đổi cũng không miễn phí về thời gian</strong> — ghi 1.000.000 số nguyên mất <strong>0,0759 s</strong> ở dạng văn bản so với 0,0332 s ở dạng nhị phân, tức văn bản <strong>chậm hơn 2,3 lần</strong>, vì mỗi số phải đem chia để biến thành chữ số, và mỗi số đọc lại phải phân tích cú pháp. Kích thước đo bằng <code>ls -l</code>: <strong>7.100.000 byte</strong> dạng văn bản so với 4.000.000 byte dạng nhị phân.</li>
<li><strong>Những ký tự vô hình gây lỗi thật</strong> — kết thúc dòng là <code>0A</code> (LF) trên Linux và macOS nhưng là <code>0D 0A</code> (CR+LF) trên Windows, nên cùng một tệp văn bản trên Windows lại lớn hơn 1 byte mỗi dòng, và đó là lý do một tệp từ Linux đôi khi mở ra trong Notepad cũ thành một dòng dài vô tận. Trong C, <code>fopen(f, "r")</code> trên Windows âm thầm dịch CR+LF thành một ký tự <code>\\n</code>; <code>fopen(f, "rb")</code> thì không. Đúng khác biệt ấy là toàn bộ lý do tồn tại của cờ <code>b</code>.</li>
<li><strong>Bảng mã là nửa còn lại</strong> — chữ "ký tự" chỉ có nghĩa khi đã chốt một bảng mã. ASCII phủ 128 ký tự trong 1 byte; UTF-8 cần <strong>3 byte</strong> cho một chữ tiếng Việt như "ế" và 1 byte cho "a". Nên tệp văn bản tiếng Việt KHÔNG phải "mỗi ký tự một byte", và trộn UTF-8 với Windows-1258 chính là cách sinh ra chữ loạn.</li>
</ul>
<table>
<tr><td><strong>Tính chất</strong></td><td><strong>Tệp văn bản</strong></td></tr>
<tr><td>Nội dung</td><td>Chỉ có ký tự, theo một bảng mã nào đó (ASCII, UTF-8)</td></tr>
<tr><td>Số nguyên 12345 chiếm</td><td><strong>5 byte</strong> — mỗi chữ số một byte (đo thật)</td></tr>
<tr><td>Đọc được bằng mắt</td><td>Có — Notepad, <code>cat</code>, mọi trình soạn thảo</td></tr>
<tr><td>Sửa bằng Notepad</td><td>Được, và an toàn</td></tr>
<tr><td>Chuyển máy được không</td><td>Được — endianness và byte đệm không liên quan; chỉ khác bảng mã và ký tự xuống dòng</td></tr>
<tr><td>Tốc độ</td><td>Chậm hơn — phải chuyển đổi ở mọi lần đọc và ghi (đo được 2,3 lần)</td></tr>
<tr><td>Truy cập trong C</td><td><code>fopen("f.txt", "r")</code>, <code>fprintf</code>, <code>fscanf</code>, <code>fgets</code></td></tr>
</table>
<p class="meo">💡 Chọn văn bản mỗi khi con người, công cụ so sánh diff, hay chương trình của một tổ chức khác phải đọc tệp: tệp cấu hình, CSV, JSON, mã nguồn, log. 2,3 lần tốc độ và mấy byte thừa là cái giá rẻ để đổi lấy việc mở được nó ở bất cứ đâu, mãi mãi.</p>`],

      [16, '3. Binary files — Figure 10.11 Binary file',
        `<p class="y-chinh">🎯 The mirror definition: <em>"a binary file is a collection of data stored in the <strong>internal format of the computer</strong>"</em> — integers, floating-point numbers, images, audio, video, or any structured data <em>except a file</em>. No conversion: what is in RAM is what goes on disk.</p>
<ul>
<li><strong>Read Figure 10.11</strong> — a hex-editor dump: addresses <code>00000270h</code> downwards, sixteen hex bytes per row, then a column of characters on the right where most positions are dots and a few spell <code>ifPhysAddress</code>, <code>ifAdminStatu s</code>, <code>ifOperStatu s</code>, <code>ifLastChange</code>, <code>ifInOctets</code>, <code>ifInUcastPkts</code>. Those are SNMP MIB names sitting inside a compiled binary. The dots are the confession: <strong>most bytes have no character meaning at all</strong>.</li>
<li><strong>The same number, measured both ways</strong> — 12345 written with <code>fwrite(&amp;n, sizeof(int), 1, f)</code> gives a file of exactly <strong>4 bytes</strong>: <code>39 30 00 00</code>. Check it: 0x3039 = 3×4096 + 0×256 + 3×16 + 9 = 12345. The bytes are reversed because the machine is little-endian — the least significant byte, 0x39, is written first. The double 3.14 gives <strong>8 bytes</strong> <code>1f 85 eb 51 b8 1e 09 40</code>, which is the IEEE 754 double from Chapter 3, stored raw.</li>
<li><strong>Structures carry invisible padding — measured</strong> — for this lesson, <code>struct { int key; char name[16]; double balance; }</code> reported <code>sizeof = 32</code>, not 4 + 16 + 8 = 28. The compiler inserted <strong>4 padding bytes</strong> after <code>name</code> so that the <code>double</code> starts on an 8-byte boundary; the dump shows them as <code>00 00 00 00</code> at offset 0x14. Those four bytes are written to the file and they are part of why a binary file is not portable.</li>
<li><strong>The surprise that kills the lazy rule "binary is always smaller"</strong> — the same 5 records were written both ways: binary <strong>160 bytes</strong> (5 × 32), text <strong>132 bytes</strong>. <em>Text won.</em> Fixed-length <code>char[16]</code> fields and 4 padding bytes per record cost more than the digits did. Binary is smaller for <em>numbers</em>; it can be larger for <em>short strings in fixed-length fields</em>.</li>
<li><strong>The reason binary exists at all: direct access</strong> — fixed-length records make the address arithmetic exact, and that is what makes slide 5's "direct access" row real C code:</li>
</ul>
<pre>Rec got;
FILE *f = fopen("recs.bin", "rb");          /* b = binary, no CR/LF translation */
fseek(f, 3L * (long)sizeof(Rec), SEEK_SET); /* jump to record #4, no reading */
fread(&amp;got, sizeof(Rec), 1, f);             /* one read, one record          */
fclose(f);</pre>
<p class="dap-an">✅ Đáp án — <em>run that code and it prints</em> <code>166702 Harry Eagle 14321.00</code>, the fourth record, after touching <strong>zero</strong> of the first three. That is the direct-access row of the master table, in nine lines of C. The same trick is impossible on a text file: lines have different lengths, so byte offset 3 × 32 lands in the middle of nowhere. <strong>Fixed-length binary records are the price of direct access, and direct access is the point.</strong></p>
<table>
<tr><td><strong>Criterion</strong></td><td><strong>Text file</strong></td><td><strong>Binary file</strong></td></tr>
<tr><td>Integer 12345 on disk</td><td>5 bytes <code>31 32 33 34 35</code></td><td>4 bytes <code>39 30 00 00</code></td></tr>
<tr><td>1,000,000 integers</td><td>7,100,000 bytes</td><td>4,000,000 bytes</td></tr>
<tr><td>Write time for those</td><td>0.0759 s</td><td>0.0332 s (2.3× faster)</td></tr>
<tr><td>Readable by eye</td><td>Yes</td><td>No — needs a hex editor or the right program</td></tr>
<tr><td>Safe to edit in Notepad</td><td>Yes</td><td><strong>No</strong> — Notepad will re-encode and corrupt it</td></tr>
<tr><td>Portable between machines</td><td>Yes (watch encoding and CR/LF)</td><td><strong>No</strong> — endianness, struct padding, <code>sizeof(long)</code>, float format all differ</td></tr>
<tr><td>Direct access to record k</td><td>No (variable-length lines)</td><td>Yes — <code>fseek(f, k*sizeof(Rec), SEEK_SET)</code></td></tr>
<tr><td>C access</td><td><code>"r"</code> / <code>"w"</code>, <code>fprintf</code>, <code>fscanf</code></td><td><code>"rb"</code> / <code>"wb"</code>, <code>fread</code>, <code>fwrite</code>, <code>fseek</code></td></tr>
</table>
<p class="pitfall">⚠️ The portability trap, measured: the 4 bytes <code>39 30 00 00</code> read back as a 32-bit integer give <strong>12345</strong> on a little-endian machine and <strong>959447040</strong> on a big-endian one. Nothing is corrupted, nothing raises an error — you just get a different number. That is why network protocols and file formats always fix a byte order (network order is big-endian) instead of dumping raw structs.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa đối xứng: <em>"tệp nhị phân là một tập dữ liệu được lưu ở <strong>ĐỊNH DẠNG BÊN TRONG CỦA MÁY TÍNH</strong>"</em> — số nguyên, số thực, ảnh, âm thanh, video, hoặc dữ liệu có cấu trúc bất kỳ <em>trừ một tệp khác</em>. Không chuyển đổi gì: cái gì trong RAM thì y nguyên ra đĩa.</p>
<ul>
<li><strong>Đọc Hình 10.11</strong> — một bản đổ hex: địa chỉ <code>00000270h</code> chạy xuống, mỗi dòng mười sáu byte hex, rồi một cột ký tự bên phải mà phần lớn vị trí là dấu chấm, chỉ vài chỗ ghép thành <code>ifPhysAddress</code>, <code>ifAdminStatu s</code>, <code>ifOperStatu s</code>, <code>ifLastChange</code>, <code>ifInOctets</code>, <code>ifInUcastPkts</code>. Đó là các tên MIB của SNMP nằm bên trong một tệp đã biên dịch. Những dấu chấm chính là lời thú nhận: <strong>đa số byte không có nghĩa ký tự nào cả</strong>.</li>
<li><strong>Cùng một con số, đo theo cả hai cách</strong> — 12345 ghi bằng <code>fwrite(&amp;n, sizeof(int), 1, f)</code> cho ra tệp đúng <strong>4 byte</strong>: <code>39 30 00 00</code>. Kiểm lại: 0x3039 = 3×4096 + 0×256 + 3×16 + 9 = 12345. Các byte bị đảo vì máy này là little-endian — byte nhẹ nhất, 0x39, được ghi ra trước. Số thực 3.14 cho <strong>8 byte</strong> <code>1f 85 eb 51 b8 1e 09 40</code>, chính là số double IEEE 754 của Chương 3, lưu thô.</li>
<li><strong>Cấu trúc mang theo byte đệm vô hình — đo thật</strong> — cho bài này, <code>struct { int key; char name[16]; double balance; }</code> báo <code>sizeof = 32</code> chứ không phải 4 + 16 + 8 = 28. Trình biên dịch chèn <strong>4 byte đệm</strong> sau <code>name</code> để <code>double</code> bắt đầu đúng bội số của 8; bản đổ hex cho thấy chúng là <code>00 00 00 00</code> ở độ dời 0x14. Bốn byte ấy ĐƯỢC GHI vào tệp, và đó là một phần lý do tệp nhị phân không khả chuyển.</li>
<li><strong>Bất ngờ giết chết cái quy tắc lười "nhị phân luôn nhỏ hơn"</strong> — cùng 5 bản ghi ghi theo hai cách: nhị phân <strong>160 byte</strong> (5 × 32), văn bản <strong>132 byte</strong>. <em>Văn bản thắng.</em> Trường <code>char[16]</code> cố định độ dài cộng 4 byte đệm mỗi bản ghi tốn hơn mấy chữ số. Nhị phân nhỏ hơn với <em>SỐ</em>; nó có thể LỚN HƠN với <em>chuỗi ngắn nằm trong trường cố định độ dài</em>.</li>
<li><strong>Lý do tệp nhị phân tồn tại: truy cập trực tiếp</strong> — bản ghi cố định độ dài làm phép tính địa chỉ thành chính xác, và đó là thứ biến dòng "truy cập trực tiếp" ở bảng slide 5 thành mã C thật:</li>
</ul>
<pre>Rec got;
FILE *f = fopen("recs.bin", "rb");          /* b = nhị phân, không dịch CR/LF */
fseek(f, 3L * (long)sizeof(Rec), SEEK_SET); /* nhảy tới bản ghi #4, không đọc gì */
fread(&amp;got, sizeof(Rec), 1, f);             /* một lần đọc, một bản ghi        */
fclose(f);</pre>
<p class="dap-an">✅ Đáp án — <em>chạy đoạn đó thì nó in ra</em> <code>166702 Harry Eagle 14321.00</code>, đúng bản ghi thứ tư, sau khi KHÔNG hề chạm vào ba bản ghi đầu. Đó là dòng "truy cập trực tiếp" của bảng tổng, viết bằng chín dòng C. Cũng mẹo ấy thì KHÔNG làm được trên tệp văn bản: các dòng dài ngắn khác nhau nên độ dời 3 × 32 byte rơi vào giữa hư không. <strong>Bản ghi nhị phân cố định độ dài là cái giá của truy cập trực tiếp, và truy cập trực tiếp mới là mục đích.</strong></p>
<table>
<tr><td><strong>Tiêu chí</strong></td><td><strong>Tệp văn bản</strong></td><td><strong>Tệp nhị phân</strong></td></tr>
<tr><td>Số nguyên 12345 trên đĩa</td><td>5 byte <code>31 32 33 34 35</code></td><td>4 byte <code>39 30 00 00</code></td></tr>
<tr><td>1.000.000 số nguyên</td><td>7.100.000 byte</td><td>4.000.000 byte</td></tr>
<tr><td>Thời gian ghi chỗ đó</td><td>0,0759 s</td><td>0,0332 s (nhanh hơn 2,3 lần)</td></tr>
<tr><td>Đọc được bằng mắt</td><td>Được</td><td>Không — cần trình soi hex hoặc đúng chương trình</td></tr>
<tr><td>Sửa bằng Notepad có an toàn</td><td>Có</td><td><strong>KHÔNG</strong> — Notepad sẽ mã hoá lại và làm hỏng tệp</td></tr>
<tr><td>Chuyển máy được không</td><td>Được (để ý bảng mã và CR/LF)</td><td><strong>KHÔNG</strong> — endianness, byte đệm của struct, <code>sizeof(long)</code>, định dạng số thực đều khác nhau</td></tr>
<tr><td>Truy cập trực tiếp bản ghi thứ k</td><td>Không (dòng dài ngắn khác nhau)</td><td>Được — <code>fseek(f, k*sizeof(Rec), SEEK_SET)</code></td></tr>
<tr><td>Truy cập trong C</td><td><code>"r"</code> / <code>"w"</code>, <code>fprintf</code>, <code>fscanf</code></td><td><code>"rb"</code> / <code>"wb"</code>, <code>fread</code>, <code>fwrite</code>, <code>fseek</code></td></tr>
</table>
<p class="pitfall">⚠️ Cái bẫy khả chuyển, đã đo: bốn byte <code>39 30 00 00</code> đọc lại thành số nguyên 32 bit cho <strong>12345</strong> trên máy little-endian và <strong>959447040</strong> trên máy big-endian. Không gì hỏng, không lỗi nào báo — chỉ là bạn nhận về một con số khác. Đó là lý do các giao thức mạng và các định dạng tệp luôn CHỐT một thứ tự byte (thứ tự mạng là big-endian) thay vì đổ thẳng struct ra đĩa.</p>`],

      [17, '4. DIRECTORIES — Figure 10.12 Directories in Windows',
        `<p class="y-chinh">🎯 The closing idea: <em>"a directory in most operating systems is represented as a <strong>special type of file</strong> that holds information about other files."</em> A directory is not a container — it is an index whose keys are names.</p>
<ul>
<li><strong>Read Figure 10.12</strong> — a tree rooted at <code>hard drive (c:)</code>. First level: <code>a</code>, <code>b</code>, <code>Users</code>, plus <code>file1</code> and <code>file2</code> sitting directly at the root. Second level under <code>b</code>: <code>c</code>, <code>d</code>, <code>file3</code>, <code>file4</code>; under <code>Users</code>: <code>user1</code>, <code>user2</code>. Third level: <code>e</code> and <code>file5</code> under <code>c</code>; <code>Documents</code>, <code>Downloads</code>, <code>Pictures</code>, <code>file6</code> under <code>user1</code>. Fourth: <code>file7</code>, <code>file8</code> under <code>e</code>; <code>file9</code>, <code>file10</code> under <code>Documents</code>. Files and directories are siblings at every level — that is the picture's real lesson.</li>
<li><strong>The two jobs of a directory, both named on the slide</strong> — (1) it is <em>"a kind of index that tells the operating system where files are located on an auxiliary storage device"</em>, and (2) it holds <em>metadata</em>: "who has access to each file, or the date when each file was created, accessed, or modified".</li>
<li><strong>The connection back to slide 8 — say this in the exam</strong> — a directory <strong>is</strong> an indexed file. The key is the file name, the address is the location on disk, and the extra columns are the metadata. Everything you learned about indexes applies: the directory is small, it is searched first, and the data file it points into is unordered.</li>
<li><strong>The metadata is real and you can print it</strong> — <code>ls -l recs.bin</code> produced <code>-rw-r--r--  1 admin  wheel  160 Sep 18 21:11 recs.bin</code> for this lesson. Read it as the slide's own list: <code>rw-r--r--</code> is "who has access", <code>admin wheel</code> is the owner, <code>160</code> is the size, <code>Sep 18 21:11</code> is the modification date. Every field the slide promises, on one line.</li>
<li><strong>How real systems implement it</strong> — Unix and Linux store the metadata in an <em>inode</em> and the directory holds only (name → inode number) pairs, which is why one file can have several names (hard links). Windows NTFS keeps the same information in the Master File Table. FAT32 used a flat 32-byte directory entry per file, which is where the old 8.3 filename limit came from.</li>
<li><strong>Why a tree, and not a flat list</strong> — a flat directory makes every name globally unique (two users could not both have <code>notes.txt</code>) and makes lookup linear in the number of files on the disk. A tree gives namespaces, per-branch permissions, and a search proportional to the <em>path depth</em>, not to the total file count.</li>
</ul>
<p class="dap-an">✅ Đáp án — <em>why is a directory called a special type of file?</em> Because it is stored on disk exactly like any other file — it occupies blocks, it has a size, it has its own metadata — but its <em>content</em> is a table of entries about other files, and only the operating system is allowed to write it. Try <code>cat</code> on a directory in Linux and you get "Is a directory": same storage, different rules. The slide's caption has a typo, "Directories in <strong>Window</strong>" — it means Windows.</p>
<p class="meo">💡 Chapter checklist before the exam: two access categories · three file structures · sequential = n/2 reads and no insert in the middle · index = key→address table, small, ordered, in RAM · hash = compute the address, address = key mod list_size + 1 · collisions resolved by open addressing or chaining · text = characters, portable, 5 bytes for 12345 · binary = memory image, 4 bytes for 12345, direct access via <code>fseek</code> · directory = an indexed file whose key is a name.</p>`,
        `<p class="y-chinh">🎯 Ý khép lại chương: <em>"thư mục trong hầu hết hệ điều hành được biểu diễn như một <strong>LOẠI TỆP ĐẶC BIỆT</strong> chứa thông tin về các tệp khác."</em> Thư mục không phải cái hộp đựng — nó là một CHỈ MỤC mà khoá là tên tệp.</p>
<ul>
<li><strong>Đọc Hình 10.12</strong> — một cái cây gốc là <code>hard drive (c:)</code>. Tầng một: <code>a</code>, <code>b</code>, <code>Users</code>, cộng <code>file1</code> và <code>file2</code> nằm thẳng ở gốc. Tầng hai dưới <code>b</code>: <code>c</code>, <code>d</code>, <code>file3</code>, <code>file4</code>; dưới <code>Users</code>: <code>user1</code>, <code>user2</code>. Tầng ba: <code>e</code> và <code>file5</code> dưới <code>c</code>; <code>Documents</code>, <code>Downloads</code>, <code>Pictures</code>, <code>file6</code> dưới <code>user1</code>. Tầng bốn: <code>file7</code>, <code>file8</code> dưới <code>e</code>; <code>file9</code>, <code>file10</code> dưới <code>Documents</code>. Tệp và thư mục là ANH EM ngang hàng ở mọi tầng — đó mới là bài học thật của bức hình.</li>
<li><strong>Hai nhiệm vụ của thư mục, slide gọi tên cả hai</strong> — (1) nó là <em>"một dạng chỉ mục nói cho hệ điều hành biết các tệp nằm ở đâu trên thiết bị lưu trữ ngoài"</em>, và (2) nó giữ <em>siêu dữ liệu</em>: "ai được quyền truy cập từng tệp, hoặc ngày tệp được tạo, được truy cập, được sửa".</li>
<li><strong>Mối nối ngược về slide 8 — hãy viết câu này vào bài thi</strong> — thư mục <strong>CHÍNH LÀ</strong> một tệp chỉ mục. Khoá là tên tệp, địa chỉ là vị trí trên đĩa, và các cột thêm là siêu dữ liệu. Mọi thứ bạn học về chỉ mục đều áp dụng được: thư mục thì nhỏ, được tra trước, và cái tệp dữ liệu mà nó trỏ tới thì không cần thứ tự.</li>
<li><strong>Siêu dữ liệu ấy có thật và in ra xem được</strong> — lệnh <code>ls -l recs.bin</code> cho ra <code>-rw-r--r--  1 admin  wheel  160 Sep 18 21:11 recs.bin</code> trong bài này. Đọc nó đúng theo danh sách của slide: <code>rw-r--r--</code> là "ai được quyền truy cập", <code>admin wheel</code> là chủ sở hữu, <code>160</code> là kích thước, <code>Sep 18 21:11</code> là ngày sửa. Đủ mọi trường slide hứa, gọn trong một dòng.</li>
<li><strong>Hệ thống thật cài đặt nó ra sao</strong> — Unix và Linux cất siêu dữ liệu trong một <em>inode</em>, còn thư mục chỉ giữ các cặp (tên → số inode), nên một tệp có thể mang nhiều tên (liên kết cứng). NTFS của Windows giữ cùng những thông tin ấy trong Master File Table. FAT32 dùng mục thư mục phẳng 32 byte cho mỗi tệp, và đó là nguồn gốc của giới hạn tên tệp 8.3 ngày xưa.</li>
<li><strong>Vì sao là CÂY chứ không phải danh sách phẳng</strong> — thư mục phẳng buộc mọi tên phải duy nhất toàn cục (hai người dùng không thể cùng có <code>notes.txt</code>) và làm phép tra tuyến tính theo tổng số tệp trên đĩa. Cây cho ta không gian tên riêng, quyền theo từng nhánh, và phép tìm tỷ lệ với <em>độ sâu đường dẫn</em> chứ không với tổng số tệp.</li>
</ul>
<p class="dap-an">✅ Đáp án — <em>vì sao thư mục được gọi là một loại tệp ĐẶC BIỆT?</em> Vì nó được lưu trên đĩa y hệt mọi tệp khác — chiếm khối, có kích thước, có siêu dữ liệu của riêng nó — nhưng <em>nội dung</em> của nó là một bảng các mục nói về những tệp khác, và chỉ hệ điều hành mới được phép ghi vào. Thử <code>cat</code> một thư mục trên Linux sẽ nhận "Is a directory": cùng cách lưu trữ, khác luật chơi. Dòng chú thích của slide có lỗi gõ, "Directories in <strong>Window</strong>" — ý là Windows.</p>
<p class="meo">💡 Bảng kiểm cả chương trước khi thi: hai nhóm truy cập · ba cấu trúc tệp · tuần tự = n/2 lần đọc và không chèn được vào giữa · chỉ mục = bảng khoá→địa chỉ, nhỏ, có thứ tự, nằm trong RAM · băm = tính ra địa chỉ, địa chỉ = khoá mod list_size + 1 · va chạm giải bằng địa chỉ mở hoặc móc xích · văn bản = ký tự, khả chuyển, 12345 tốn 5 byte · nhị phân = ảnh chụp bộ nhớ, 12345 tốn 4 byte, truy cập trực tiếp bằng <code>fseek</code> · thư mục = một tệp chỉ mục mà khoá là tên tệp.</p>`],

    ]),
  ].join('\n'),
};
