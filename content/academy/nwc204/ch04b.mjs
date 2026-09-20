/**
 * NWC204 · Chapter 4B — Number Systems (CHƯƠNG BÙ, Cisco Module 5).
 *
 * ⛔ Kế hoạch 60 buổi của FPT KHÔNG xếp buổi nào cho phần này. Chương 5 của môn
 * dùng Cisco Module 6, chương 6 dùng Module 7 — lệch một đơn vị suốt phần còn
 * lại, và module bị nhảy qua chính là Module 5 (Number Systems). Buổi 30–33 dạy
 * IPv4 Addressing, chia subnet và VLSM, không đọc được nhị phân thì không làm
 * được. Vì vậy đây là chương WEB BỔ SUNG do cuongthai.com dựng, đặt trước chương
 * IPv4 Addressing. Mọi bài trong file này nói rõ điều đó.
 *
 * Slide: scripts/slides-src/nwc204-ch04b.mjs → deck 'nwc204-ch04b', 18 ảnh.
 *
 * ⚠️ MỌI phép tính trong file này đã được kiểm lại bằng python3 (114 phép kiểm).
 */
import { registerDeck, walk, walkHead, bi } from './_slides.mjs';

const D = registerDeck('nwc204-ch04b', {
  code: 'NWC204',
  en: 'Number Systems (added chapter)',
  vi: 'Hệ đếm (chương bổ sung)',
  total: 18,
});

/** Khối cảnh báo dùng lại ở đầu MỖI bài của chương này. */
const CANH_BAO = bi(
  `<div class="callout warn"><strong>This chapter is not in the FLM plan.</strong> FPT scheduled no session for Cisco Module 5 (Number Systems): the course jumps from Module 4 to Module 6, and every chapter after that runs one number behind Cisco. This is a supplementary web chapter, added because sessions 30–33 (IPv4 addressing, subnetting, VLSM) cannot be done without it.</div>`,
  `<div class="callout warn"><strong>Trường không xếp buổi nào cho phần này; đây là chương web bổ sung, vì không có nó thì không học được buổi 30–33.</strong> Kế hoạch 60 buổi nhảy thẳng từ Module 4 sang Module 6 của Cisco, bỏ hẳn Module 5 (Number Systems), và từ đó về sau mọi chương đều lệch một đơn vị so với Cisco. Chương này do cuongthai.com bổ sung, không phải nội dung của FLM.</div>`,
);

/* ──────────────────────────── Lesson 4B.1 ──────────────────────────── */

const L1 = {
  title: '4B.1 — Binary, and converting 8 bits both ways (web-added chapter)|||4B.1 — Hệ nhị phân và chuyển đổi 8 bit cả hai chiều (chương web bổ sung)',
  slug: 'nwc204-4b-1-he-nhi-phan-va-chuyen-doi-8-bit',
  type: 'DOCUMENT',
  description: 'Chương bù (trường không xếp buổi): vì sao máy dùng hệ nhị phân, bảng vị trí 128-64-32-16-8-4-2-1, chuyển nhị phân sang thập phân và ngược lại bằng mẹo làm nhẩm, vì sao một octet chỉ chạy 0–255 và vì sao 192.168.1.256 không tồn tại. 12 bài tập có lời giải đầy đủ.',
  content: [
    CANH_BAO,

    bi(
      `<span class="eyebrow">NWC204 · Chapter 4B · Lesson 4B.1 · NO FLM session — added for this site · prepares sessions 30–33 · Cisco Module 5</span>
<h2>The chapter your course plan skipped</h2>
<p class="lead">Everything you will do from session 30 onwards — subnet masks, network addresses, VLSM — is bit arithmetic wearing a decimal costume. This lesson teaches the arithmetic, so that subnetting later is bookkeeping rather than magic.</p>
<p><strong>Opening question:</strong> your router refuses the address <code>192.168.1.256</code> and your colleague says "it must be a typo rule, 255 is just the convention". Prove them wrong in one sentence that mentions no convention at all.</p>`,
      `<span class="eyebrow">NWC204 · Chương 4B · Bài 4B.1 · KHÔNG có buổi nào của FLM — bổ sung cho web này · chuẩn bị cho buổi 30–33 · Cisco Module 5</span>
<h2>Chương mà kế hoạch môn học đã nhảy qua</h2>
<p class="lead">Mọi thứ bạn làm từ buổi 30 trở đi — mặt nạ mạng, địa chỉ mạng, VLSM — đều là phép tính trên bit khoác áo thập phân. Bài này dạy phần phép tính, để việc chia subnet về sau chỉ còn là ghi sổ chứ không phải phép màu.</p>
<p><strong>Câu hỏi mở đầu:</strong> router từ chối địa chỉ <code>192.168.1.256</code> và đồng nghiệp của bạn bảo "chắc là luật chống gõ nhầm thôi, 255 chỉ là quy ước". Hãy bác bỏ trong một câu mà không nhắc tới quy ước nào cả.</p>`,
    ),

    walkHead('nwc204-ch04b', 1, 11,
      'Slides 1–11 are the binary half of the added chapter: why binary, the position table, both conversion directions and the range of an octet.',
      'Slide 1–11 là nửa nhị phân của chương bổ sung: vì sao nhị phân, bảng vị trí, hai chiều chuyển đổi và miền giá trị của một octet.'),

    walk('nwc204-ch04b', [
      [1, 'Cover — Number Systems, the added chapter',
        `<p>This deck has no FLM session number, because FPT did not schedule one. It sits between chapter 4 (Physical Layer) and the IPv4 addressing work of sessions 30–33.</p>
<ul>
<li>Binary: what it is and why machines use it.</li>
<li>Converting 8 bits to decimal and decimal to 8 bits, both by hand.</li>
<li>Why an octet runs from 0 to 255 and no further.</li>
<li>Hexadecimal, and why MAC and IPv6 use it while IPv4 does not.</li>
<li>Bitwise AND, and why it is exactly what a router does with a subnet mask.</li>
</ul>
<p>Budget two to three hours. Nothing here is difficult; it only becomes difficult if you skip the practice and try to memorise the results instead.</p>`,
        `<p>Bộ slide này không có số buổi của FLM, vì trường không xếp buổi nào. Nó nằm giữa chương 4 (Tầng vật lý) và phần địa chỉ IPv4 của buổi 30–33.</p>
<ul>
<li>Hệ nhị phân: nó là gì và vì sao máy móc dùng nó.</li>
<li>Chuyển 8 bit sang thập phân và thập phân sang 8 bit, đều làm bằng tay.</li>
<li>Vì sao một octet chỉ chạy từ 0 tới 255 và không hơn.</li>
<li>Hệ thập lục phân, và vì sao MAC với IPv6 dùng nó còn IPv4 thì không.</li>
<li>Phép AND theo bit, và vì sao nó đúng là việc router làm với mặt nạ mạng.</li>
</ul>
<p>Hãy dành hai tới ba giờ. Ở đây không có gì khó; nó chỉ trở nên khó nếu bạn bỏ phần luyện tập và cố học thuộc kết quả.</p>`],

      [2, 'Why this chapter is here at all',
        `<p>The table is the evidence. Read the middle column and count.</p>
<ul>
<li>Chapter 3 of the course uses Cisco <strong>Module 3</strong>; chapter 4 uses <strong>Module 4</strong>. So far the numbers agree.</li>
<li>Chapter 5 of the course ("Data Link Layer") uses Cisco <strong>Module 6</strong>. Chapter 6 uses <strong>Module 7</strong>. From here on every chapter is one behind.</li>
<li>The module that was jumped over is <strong>Module 5 — Number Systems</strong>. No session in the 60-session plan covers it.</li>
<li>But sessions 30–33 teach IPv4 addressing, network segmentation and VLSM, all of which require reading binary.</li>
</ul>
<p>So this chapter is added, and it is honest about being added. It is not FLM content, and no examiner will ask you for "chapter 4B" by that name — they will ask you to subnet, which you cannot do without it.</p>`,
        `<p>Cái bảng chính là bằng chứng. Hãy đọc cột giữa và đếm.</p>
<ul>
<li>Chương 3 của môn dùng <strong>Module 3</strong> của Cisco; chương 4 dùng <strong>Module 4</strong>. Tới đây các con số còn khớp.</li>
<li>Chương 5 của môn ("Data Link Layer") lại dùng <strong>Module 6</strong>. Chương 6 dùng <strong>Module 7</strong>. Từ đây trở đi mọi chương đều lệch một đơn vị.</li>
<li>Module bị nhảy qua chính là <strong>Module 5 — Number Systems</strong>. Không buổi nào trong kế hoạch 60 buổi nhắc tới nó.</li>
<li>Nhưng buổi 30–33 dạy địa chỉ IPv4, chia mạng và VLSM, mà tất cả đều đòi đọc được nhị phân.</li>
</ul>
<p>Vậy nên chương này được bổ sung, và nó nói thẳng rằng mình là phần bổ sung. Đây không phải nội dung của FLM, và sẽ không giám khảo nào hỏi bạn về "chương 4B" theo tên đó — họ sẽ bắt bạn chia subnet, việc mà không có chương này thì không làm nổi.</p>`],

      [3, 'Why machines count in twos',
        `<p>The reason is physical, not mathematical: a medium can hold two states reliably, and ten states unreliably.</p>
<ul>
<li>On copper, a voltage is present or absent. On fibre, light is on or off. On radio, two phases are distinguishable.</li>
<li>Ten voltage levels on one wire would be ten times easier to misread after 90 metres of attenuation — which is chapter 4's whole subject.</li>
<li>So every address is <strong>really bits</strong>. The dotted decimal you type is a human costume that the machine removes immediately.</li>
<li>One octet is 8 bits. An <strong>IPv4 address is 4 octets = 32 bits</strong>. A <strong>MAC address is 48 bits</strong>. An <strong>IPv6 address is 128 bits</strong>.</li>
</ul>
<p>Hold on to those four numbers. Nearly every question in the rest of the course is "how do I split those 32 bits", and the answer is always arithmetic.</p>`,
        `<p>Lý do nằm ở vật lý chứ không phải toán học: một môi trường truyền giữ được hai trạng thái một cách đáng tin, còn mười trạng thái thì không.</p>
<ul>
<li>Trên cáp đồng, điện áp có hoặc không. Trên cáp quang, ánh sáng bật hoặc tắt. Trên sóng, hai pha phân biệt được.</li>
<li>Mười mức điện áp trên một sợi dây sẽ dễ đọc nhầm gấp mười lần sau 90 mét suy hao — mà đó đúng là chủ đề của cả chương 4.</li>
<li>Vậy mọi địa chỉ <strong>thực chất là các bit</strong>. Dạng thập phân có dấu chấm mà bạn gõ chỉ là bộ áo cho con người, máy cởi nó ra ngay lập tức.</li>
<li>Một octet là 8 bit. <strong>Địa chỉ IPv4 là 4 octet = 32 bit</strong>. <strong>Địa chỉ MAC là 48 bit</strong>. <strong>Địa chỉ IPv6 là 128 bit</strong>.</li>
</ul>
<p>Hãy nhớ kỹ bốn con số đó. Gần như mọi câu hỏi trong phần còn lại của môn đều là "chia 32 bit đó thế nào", và câu trả lời luôn là một phép tính.</p>`],

      [4, 'The position table is the whole trick',
        `<p>Eight columns, each half the one to its left. Memorise this row and you have memorised the chapter.</p>
<pre><code class="language-plaintext">128  64  32  16   8   4   2   1</code></pre>
<ul>
<li>A <strong>1</strong> in a column means: add that column's value.</li>
<li>A <strong>0</strong> means: skip it.</li>
<li>The leftmost bit is the <strong>most significant</strong>; the rightmost is the least significant.</li>
<li>128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = <strong>255</strong>, and that single sum explains the entire range of an octet.</li>
</ul>
<p>Write the row out by hand ten times. It is faster than any trick, and in an exam you will draw it in four seconds and then answer every conversion question mechanically.</p>`,
        `<p>Tám cột, mỗi cột bằng một nửa cột bên trái. Thuộc dòng này là thuộc cả chương.</p>
<pre><code class="language-plaintext">128  64  32  16   8   4   2   1</code></pre>
<ul>
<li>Bit <strong>1</strong> ở một cột nghĩa là: cộng giá trị của cột đó.</li>
<li>Bit <strong>0</strong> nghĩa là: bỏ qua.</li>
<li>Bit ngoài cùng bên trái là bit <strong>có trọng số lớn nhất</strong>; bit ngoài cùng bên phải có trọng số nhỏ nhất.</li>
<li>128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = <strong>255</strong>, và chỉ một phép cộng đó giải thích toàn bộ miền giá trị của một octet.</li>
</ul>
<p>Hãy chép tay dòng này mười lần. Nó nhanh hơn mọi mẹo, và trong phòng thi bạn vẽ nó ra trong bốn giây rồi trả lời mọi câu chuyển đổi một cách máy móc.</p>`],

      [5, 'Binary to decimal, worked: 11000000',
        `<p>Three steps, and they never change.</p>
<ul>
<li><strong>Step 1</strong> — write the position row above the bits.</li>
<li><strong>Step 2</strong> — keep only the columns holding a 1: here, 128 and 64.</li>
<li><strong>Step 3</strong> — add them: 128 + 64 = <strong>192</strong>.</li>
</ul>
<p>The mental shortcut worth having: a byte that starts <code>11</code> and then stops is always 192, and you will meet it every day — <code>255.255.255.192</code> is a /26 mask, and <code>192.168.x.x</code> begins with it too.</p>
<p>Check in one line: <code>python3 -c "print(int('11000000',2))"</code> prints 192.</p>`,
        `<p>Ba bước, và chúng không bao giờ đổi.</p>
<ul>
<li><strong>Bước 1</strong> — viết dòng vị trí lên phía trên các bit.</li>
<li><strong>Bước 2</strong> — chỉ giữ lại các cột có bit 1: ở đây là 128 và 64.</li>
<li><strong>Bước 3</strong> — cộng lại: 128 + 64 = <strong>192</strong>.</li>
</ul>
<p>Mẹo đáng thuộc: một byte bắt đầu bằng <code>11</code> rồi hết thì luôn là 192, và bạn sẽ gặp nó hằng ngày — <code>255.255.255.192</code> là mặt nạ /26, còn <code>192.168.x.x</code> cũng mở đầu bằng nó.</p>
<p>Kiểm trong một dòng: <code>python3 -c "print(int('11000000',2))"</code> in ra 192.</p>`],

      [6, 'Binary to decimal, worked: 10101100',
        `<p>The same three steps on a harder pattern.</p>
<ul>
<li>Columns holding a 1: <strong>128, 32, 8, 4</strong>.</li>
<li>128 + 32 = 160 · 160 + 8 = 168 · 168 + 4 = <strong>172</strong>.</li>
<li>Add the big numbers first. Fewer carries means fewer mistakes under exam pressure.</li>
<li>172 is the first octet of the private range <code>172.16.0.0</code> to <code>172.31.255.255</code>, so you will write this one often.</li>
</ul>
<p>Every worked example on these slides was verified with <code>python3</code> before it was printed. Do the same with yours: the point of checking is to catch <em>your method</em>, not to get the answer.</p>`,
        `<p>Vẫn ba bước đó, trên một mẫu bit khó hơn.</p>
<ul>
<li>Các cột có bit 1: <strong>128, 32, 8, 4</strong>.</li>
<li>128 + 32 = 160 · 160 + 8 = 168 · 168 + 4 = <strong>172</strong>.</li>
<li>Cộng các số lớn trước. Ít nhớ hơn thì ít sai hơn khi đang bị áp lực phòng thi.</li>
<li>172 là octet đầu của dải riêng <code>172.16.0.0</code> tới <code>172.31.255.255</code>, nên bạn sẽ viết con số này thường xuyên.</li>
</ul>
<p>Mọi ví dụ trên các slide này đều được kiểm lại bằng <code>python3</code> trước khi in ra. Hãy làm y như vậy với bài của bạn: mục đích của việc kiểm là bắt lỗi <em>phương pháp</em>, không phải để lấy đáp án.</p>`],

      [7, 'The two extremes decide the range',
        `<p>Two special patterns, and between them lies every value an octet can hold.</p>
<ul>
<li><code>00000000</code> — no column selected, so the value is <strong>0</strong>. The smallest.</li>
<li><code>11111111</code> — every column selected, so the value is <strong>255</strong>. The largest.</li>
<li>8 bits give <strong>2 to the power of 8 = 256</strong> different patterns.</li>
<li>Counting from zero, those 256 patterns are the values <strong>0 to 255</strong> — 256 values, not 255.</li>
</ul>
<p>That "256 patterns, 0 to 255" distinction is worth stating out loud once. It is the same off-by-one that makes a /24 network hold 256 addresses but only 254 usable hosts, and that appears in session 30.</p>`,
        `<p>Hai mẫu bit đặc biệt, và giữa chúng là mọi giá trị mà một octet có thể mang.</p>
<ul>
<li><code>00000000</code> — không chọn cột nào, nên giá trị là <strong>0</strong>. Nhỏ nhất.</li>
<li><code>11111111</code> — chọn hết mọi cột, nên giá trị là <strong>255</strong>. Lớn nhất.</li>
<li>8 bit cho <strong>2 mũ 8 = 256</strong> mẫu bit khác nhau.</li>
<li>Đếm từ số 0, 256 mẫu đó là các giá trị <strong>0 tới 255</strong> — tức 256 giá trị, không phải 255.</li>
</ul>
<p>Chỗ phân biệt "256 mẫu, từ 0 tới 255" đáng được nói thành lời một lần. Đó cũng chính là chỗ lệch một đơn vị khiến một mạng /24 chứa 256 địa chỉ nhưng chỉ 254 địa chỉ dùng được cho máy trạm, và nó xuất hiện ở buổi 30.</p>`],

      [8, 'Why 192.168.1.256 does not exist',
        `<p>Not a rule, not a convention: arithmetic.</p>
<ul>
<li><code>255</code> needs <code>11111111</code> — exactly 8 bits. It fits, and it is the broadcast address of a /24 network.</li>
<li><code>256</code> needs <code>100000000</code> — <strong>9 bits</strong>. An octet holds eight. The ninth bit has nowhere to live.</li>
<li><code>300</code> needs <code>100101100</code>, also 9 bits, and fails for exactly the same reason.</li>
<li>The router does not "reject a typo". It has nowhere to put the value you asked for.</li>
</ul>
<p>What you will actually see is <code>Invalid IP address</code>, or a configuration line the device silently refuses. Now you can say why in one sentence — which is the answer to this lesson's opening question.</p>`,
        `<p>Không phải luật, không phải quy ước: đó là số học.</p>
<ul>
<li><code>255</code> cần <code>11111111</code> — đúng 8 bit. Vừa khít, và nó là địa chỉ quảng bá của một mạng /24.</li>
<li><code>256</code> cần <code>100000000</code> — <strong>9 bit</strong>. Một octet chứa được tám. Bit thứ chín không có chỗ nào để ở.</li>
<li><code>300</code> cần <code>100101100</code>, cũng 9 bit, và hỏng vì đúng lý do đó.</li>
<li>Router không "từ chối một lỗi gõ nhầm". Nó không có chỗ để đặt cái giá trị bạn vừa yêu cầu.</li>
</ul>
<p>Thứ bạn thật sự nhìn thấy sẽ là <code>Invalid IP address</code>, hoặc một dòng cấu hình mà thiết bị lặng lẽ từ chối. Giờ bạn nói được lý do trong một câu — và đó chính là đáp án câu hỏi mở đầu của bài này.</p>`],

      [9, 'Decimal to binary: the subtraction ladder',
        `<p>Go down the position row from 128, and at each column ask one question: <em>is what is left at least this big?</em></p>
<ul>
<li>200 ≥ 128? Yes → write <strong>1</strong>, keep 200 − 128 = 72.</li>
<li>72 ≥ 64? Yes → write <strong>1</strong>, keep 72 − 64 = 8.</li>
<li>8 ≥ 32? No → <strong>0</strong>. 8 ≥ 16? No → <strong>0</strong>.</li>
<li>8 ≥ 8? Yes → write <strong>1</strong>, keep 0.</li>
<li>The remainder is 0, so every remaining column is <strong>0</strong>: the answer is <code>11001000</code>.</li>
</ul>
<p>Two habits that prevent nearly every error: always write all eight columns even when the remainder hits zero early, and always add the ones back up at the end to check you get your original number.</p>`,
        `<p>Đi xuống theo dòng vị trí từ 128, và ở mỗi cột hỏi đúng một câu: <em>phần còn lại có lớn hơn hoặc bằng cột này không?</em></p>
<ul>
<li>200 ≥ 128? Có → viết <strong>1</strong>, giữ lại 200 − 128 = 72.</li>
<li>72 ≥ 64? Có → viết <strong>1</strong>, giữ lại 72 − 64 = 8.</li>
<li>8 ≥ 32? Không → <strong>0</strong>. 8 ≥ 16? Không → <strong>0</strong>.</li>
<li>8 ≥ 8? Có → viết <strong>1</strong>, còn lại 0.</li>
<li>Phần còn lại là 0, nên mọi cột còn lại đều là <strong>0</strong>: đáp án là <code>11001000</code>.</li>
</ul>
<p>Hai thói quen chặn gần như mọi lỗi: luôn viết đủ tám cột kể cả khi phần còn lại về 0 sớm, và luôn cộng ngược các bit 1 ở cuối để kiểm xem có ra đúng số ban đầu không.</p>`],

      [10, 'Decimal to binary, second pass: 172',
        `<p>The same ladder, narrated once more so the pattern sticks.</p>
<ul>
<li>172 − 128 = 44, so the 128 bit is <strong>1</strong>.</li>
<li>44 &lt; 64, so the 64 bit is <strong>0</strong>. 44 − 32 = 12, so the 32 bit is <strong>1</strong>.</li>
<li>12 &lt; 16, so the 16 bit is <strong>0</strong>. 12 − 8 = 4, so the 8 bit is <strong>1</strong>.</li>
<li>4 − 4 = 0, so the 4 bit is <strong>1</strong>; the 2 and 1 bits are <strong>0</strong>.</li>
<li>Result <code>10101100</code>, and the check: 128 + 32 + 8 + 4 = 172. ✓</li>
</ul>
<p>If the check does not give back your starting number, you dropped a column — almost always by not writing the zeros. Write the zeros.</p>`,
        `<p>Vẫn cái thang đó, kể lại một lần nữa để cái mẫu ăn vào đầu.</p>
<ul>
<li>172 − 128 = 44, nên bit 128 là <strong>1</strong>.</li>
<li>44 &lt; 64, nên bit 64 là <strong>0</strong>. 44 − 32 = 12, nên bit 32 là <strong>1</strong>.</li>
<li>12 &lt; 16, nên bit 16 là <strong>0</strong>. 12 − 8 = 4, nên bit 8 là <strong>1</strong>.</li>
<li>4 − 4 = 0, nên bit 4 là <strong>1</strong>; bit 2 và bit 1 là <strong>0</strong>.</li>
<li>Kết quả <code>10101100</code>, và phép kiểm: 128 + 32 + 8 + 4 = 172. ✓</li>
</ul>
<p>Nếu phép kiểm không trả về đúng số ban đầu thì bạn đã đánh rơi một cột — gần như luôn là do không viết các bit 0. Hãy viết cả các bit 0.</p>`],

      [11, 'A whole IPv4 address, octet by octet',
        `<p>An address is not four numbers. It is one row of 32 bits that we print with dots so humans can read it aloud.</p>
<ul>
<li><code>192</code> = <code>11000000</code> (128+64)</li>
<li><code>168</code> = <code>10101000</code> (128+32+8)</li>
<li><code>10</code> = <code>00001010</code> (8+2)</li>
<li><code>10</code> = <code>00001010</code> (8+2)</li>
<li>So <code>192.168.10.10</code> is really <code>11000000 10101000 00001010 00001010</code>.</li>
</ul>
<p>Two addresses are in the same network when the bits covered by the mask are identical. That sentence is the whole of subnetting, and the next lessons turn it into an operation you can perform in ten seconds.</p>`,
        `<p>Một địa chỉ không phải bốn con số. Nó là một dãy 32 bit mà ta in kèm dấu chấm để con người đọc lên được.</p>
<ul>
<li><code>192</code> = <code>11000000</code> (128+64)</li>
<li><code>168</code> = <code>10101000</code> (128+32+8)</li>
<li><code>10</code> = <code>00001010</code> (8+2)</li>
<li><code>10</code> = <code>00001010</code> (8+2)</li>
<li>Vậy <code>192.168.10.10</code> thực chất là <code>11000000 10101000 00001010 00001010</code>.</li>
</ul>
<p>Hai địa chỉ nằm cùng một mạng khi các bit mà mặt nạ phủ lên là giống hệt nhau. Câu đó chính là toàn bộ việc chia subnet, và các bài sau sẽ biến nó thành một thao tác bạn làm xong trong mười giây.</p>`],
    ]),

    bi(
      `<h3>🔎 How to check this yourself</h3>
<p>Do the conversion on paper first, then mark it. Never the other way round.</p>
<pre><code class="language-bash"># The two directions, one line each
python3 -c "print(bin(192), int('11000000',2))"
#   0b11000000 192

# Decimal to binary, padded to 8 bits so the columns line up
python3 -c "print(format(172, '08b'))"
#   10101100

# A whole address, octet by octet
python3 -c "print('.'.join(f'{int(o):08b}' for o in '192.168.10.10'.split('.')))"
#   11000000.10101000.00001010.00001010

# Prove that 256 needs nine bits
python3 -c "print(bin(255), len(bin(255)[2:]), bin(256), len(bin(256)[2:]))"
#   0b11111111 8 0b100000000 9</code></pre>
<p>How to read the result:</p>
<pre><code class="language-plaintext">your answer matches                 -> the method worked; do the next one
your answer is short by 1, 2 or 4   -> you dropped a low column: write the zeros too
your answer is out by 128 or 64     -> you started the position row in the wrong place
python prints 9 digits              -> the value cannot fit in an octet at all</code></pre>`,
      `<h3>🔎 Cách tự kiểm</h3>
<p>Hãy làm trên giấy trước rồi mới chấm. Tuyệt đối đừng làm ngược lại.</p>
<pre><code class="language-bash"># Hai chiều, mỗi chiều một dòng
python3 -c "print(bin(192), int('11000000',2))"
#   0b11000000 192

# Thập phân sang nhị phân, đệm đủ 8 bit để các cột thẳng hàng
python3 -c "print(format(172, '08b'))"
#   10101100

# Cả một địa chỉ, từng octet một
python3 -c "print('.'.join(f'{int(o):08b}' for o in '192.168.10.10'.split('.')))"
#   11000000.10101000.00001010.00001010

# Chứng minh 256 cần tới chín bit
python3 -c "print(bin(255), len(bin(255)[2:]), bin(256), len(bin(256)[2:]))"
#   0b11111111 8 0b100000000 9</code></pre>
<p>Cách đọc kết quả:</p>
<pre><code class="language-plaintext">đáp án khớp                        -> phương pháp đúng; làm câu tiếp theo
đáp án thiếu 1, 2 hoặc 4           -> bạn đánh rơi một cột nhỏ: hãy viết cả các bit 0
đáp án lệch 128 hoặc 64            -> bạn đặt sai chỗ bắt đầu của dòng vị trí
python in ra 9 chữ số              -> giá trị đó hoàn toàn không nhét vào một octet được</code></pre>`,
    ),

    bi(
      `<h3>⚠️ Traps people actually fall into</h3>
<ol>
<li><strong>Dropping the leading zeros.</strong> <em>Symptom:</em> you write 10 as <code>1010</code> instead of <code>00001010</code>, and later your four octets do not line up as 32 bits, so every AND you do is silently wrong. Always pad to eight.</li>
<li><strong>Reading the position row right to left.</strong> <em>Symptom:</em> consistent answers that are the mirror image of the truth — 172 comes out as 53. The most significant bit is on the <em>left</em>. Write the row 128 64 32 16 8 4 2 1 before you write a single bit.</li>
<li><strong>Memorising results instead of the method.</strong> <em>Symptom:</em> you can convert 192, 224 and 255 instantly but freeze on 203. The mask octets repeat, so memorising feels like it works — until the exam gives you a host address, which is arbitrary.</li>
<li><strong>Checking before finishing.</strong> <em>Symptom:</em> every practice answer is right and the exam is a disaster. Running <code>python3</code> mid-problem teaches you to read the answer, not to produce it. Finish on paper, then check.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>Bỏ các bit 0 ở đầu.</strong> <em>Triệu chứng:</em> bạn viết 10 thành <code>1010</code> thay vì <code>00001010</code>, rồi về sau bốn octet không xếp thành 32 bit thẳng hàng, nên mọi phép AND đều sai trong im lặng. Luôn đệm cho đủ tám bit.</li>
<li><strong>Đọc dòng vị trí từ phải sang trái.</strong> <em>Triệu chứng:</em> đáp án sai một cách nhất quán theo kiểu soi gương — 172 ra thành 53. Bit có trọng số lớn nhất nằm bên <em>trái</em>. Hãy viết dòng 128 64 32 16 8 4 2 1 trước khi viết bất kỳ bit nào.</li>
<li><strong>Học thuộc kết quả thay vì học phương pháp.</strong> <em>Triệu chứng:</em> bạn đổi được 192, 224 và 255 tức thì nhưng đứng hình trước 203. Các octet của mặt nạ lặp đi lặp lại nên học thuộc có vẻ hiệu quả — cho tới khi đề thi đưa ra một địa chỉ máy trạm, vốn là con số bất kỳ.</li>
<li><strong>Kiểm trước khi làm xong.</strong> <em>Triệu chứng:</em> bài luyện nào cũng đúng mà đi thi thì thảm hoạ. Gõ <code>python3</code> giữa chừng chỉ dạy bạn đọc đáp án, không dạy bạn tạo ra đáp án. Làm xong trên giấy rồi hãy chấm.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — 12 conversions, with full answers</h3>
<p><strong>Binary to decimal.</strong> Convert each, showing the columns you added.</p>
<p>1. <code>11111110</code> &nbsp; 2. <code>10000001</code> &nbsp; 3. <code>00011111</code> &nbsp; 4. <code>11110000</code> &nbsp; 5. <code>01100100</code> &nbsp; 6. <code>10010110</code></p>
<p><strong>Decimal to binary.</strong> Convert each to 8 bits, showing the subtraction ladder.</p>
<p>7. 19 &nbsp; 8. 63 &nbsp; 9. 130 &nbsp; 10. 250 &nbsp; 11. 51 &nbsp; 12. 127</p>
<details><summary>Answers</summary>
<pre><code class="language-plaintext">1.  11111110 = 128+64+32+16+8+4+2            = 254
2.  10000001 = 128+1                          = 129
3.  00011111 = 16+8+4+2+1                     =  31
4.  11110000 = 128+64+32+16                   = 240
5.  01100100 = 64+32+4                        = 100
6.  10010110 = 128+16+4+2                     = 150

7.  19  = 16+2+1                  -> 00010011
8.  63  = 32+16+8+4+2+1           -> 00111111
9.  130 = 128+2                   -> 10000010
10. 250 = 128+64+32+16+8+2        -> 11111010
11. 51  = 32+16+2+1               -> 00110011
12. 127 = 64+32+16+8+4+2+1        -> 01111111</code></pre>
<p>Mark them all at once:</p>
<pre><code class="language-bash">python3 -c "
for b in ['11111110','10000001','00011111','11110000','01100100','10010110']:
    print(b, '=', int(b,2))
for d in [19,63,130,250,51,127]:
    print(d, '=', format(d,'08b'))
"</code></pre>
<p>Worth noticing: number 12, 127, is <code>01111111</code> — one less than 128 turns the top bit off and every other bit on. That pattern is why <code>127.0.0.1</code> and the /25 boundary both look the way they do.</p>
</details>`,
      `<h3>✍️ Bài tập — 12 câu chuyển đổi, có lời giải đầy đủ</h3>
<p><strong>Nhị phân sang thập phân.</strong> Chuyển từng câu, ghi rõ các cột đã cộng.</p>
<p>1. <code>11111110</code> &nbsp; 2. <code>10000001</code> &nbsp; 3. <code>00011111</code> &nbsp; 4. <code>11110000</code> &nbsp; 5. <code>01100100</code> &nbsp; 6. <code>10010110</code></p>
<p><strong>Thập phân sang nhị phân.</strong> Chuyển sang 8 bit, ghi rõ thang trừ dần.</p>
<p>7. 19 &nbsp; 8. 63 &nbsp; 9. 130 &nbsp; 10. 250 &nbsp; 11. 51 &nbsp; 12. 127</p>
<details><summary>Lời giải</summary>
<pre><code class="language-plaintext">1.  11111110 = 128+64+32+16+8+4+2            = 254
2.  10000001 = 128+1                          = 129
3.  00011111 = 16+8+4+2+1                     =  31
4.  11110000 = 128+64+32+16                   = 240
5.  01100100 = 64+32+4                        = 100
6.  10010110 = 128+16+4+2                     = 150

7.  19  = 16+2+1                  -> 00010011
8.  63  = 32+16+8+4+2+1           -> 00111111
9.  130 = 128+2                   -> 10000010
10. 250 = 128+64+32+16+8+2        -> 11111010
11. 51  = 32+16+2+1               -> 00110011
12. 127 = 64+32+16+8+4+2+1        -> 01111111</code></pre>
<p>Chấm cả loạt một lần:</p>
<pre><code class="language-bash">python3 -c "
for b in ['11111110','10000001','00011111','11110000','01100100','10010110']:
    print(b, '=', int(b,2))
for d in [19,63,130,250,51,127]:
    print(d, '=', format(d,'08b'))
"</code></pre>
<p>Đáng để ý: câu 12, số 127, là <code>01111111</code> — kém 128 đúng một đơn vị thì bit trên cùng tắt và mọi bit còn lại bật. Chính cái mẫu đó giải thích vì sao <code>127.0.0.1</code> và ranh giới /25 lại có hình dạng như vậy.</p>
</details>`,
    ),
  ].join('\n'),
};

/* ──────────────────────────── Lesson 4B.2 ──────────────────────────── */

const L2 = {
  title: '4B.2 — Hexadecimal, and why MAC and IPv6 use it (web-added chapter)|||4B.2 — Hệ thập lục phân, và vì sao MAC với IPv6 dùng nó (chương web bổ sung)',
  slug: 'nwc204-4b-2-he-thap-luc-phan-mac-va-ipv6',
  type: 'DOCUMENT',
  description: 'Chương bù: 4 bit bằng một chữ số hex, bảng 0–F, vì sao MAC 48 bit và IPv6 128 bit viết bằng hex còn IPv4 dùng thập phân, và cách đọc một địa chỉ MAC ra nhị phân — kèm bài tập có lời giải.',
  content: [
    CANH_BAO,

    bi(
      `<span class="eyebrow">NWC204 · Chapter 4B · Lesson 4B.2 · NO FLM session — added for this site · Cisco Module 5</span>
<h2>Why one address is written in decimal and the next in hex</h2>
<p class="lead">IPv4 uses decimal. MAC and IPv6 use hexadecimal. It looks arbitrary and it is not — the difference tells you something about what each address is <em>for</em>.</p>
<p><strong>Opening question:</strong> an IPv6 address has 128 bits. Written in decimal that is a 39-digit number. Written in hex it is 32 characters. Why does hex win so completely here, when IPv4 kept decimal?</p>`,
      `<span class="eyebrow">NWC204 · Chương 4B · Bài 4B.2 · KHÔNG có buổi nào của FLM — bổ sung cho web này · Cisco Module 5</span>
<h2>Vì sao địa chỉ này viết thập phân còn địa chỉ kia viết hex</h2>
<p class="lead">IPv4 dùng thập phân. MAC và IPv6 dùng thập lục phân. Trông có vẻ tuỳ tiện nhưng không phải — chỗ khác nhau đó nói cho bạn biết mỗi loại địa chỉ <em>dùng để làm gì</em>.</p>
<p><strong>Câu hỏi mở đầu:</strong> một địa chỉ IPv6 có 128 bit. Viết ra hệ thập phân thì đó là một con số 39 chữ số. Viết bằng hex thì chỉ 32 ký tự. Vì sao hex thắng tuyệt đối ở đây, trong khi IPv4 vẫn giữ thập phân?</p>`,
    ),

    walkHead('nwc204-ch04b', 12, 14,
      'Slides 12–14 are the hexadecimal half: the nibble table, the comparison with IPv4, and a MAC address read out in binary.',
      'Slide 12–14 là nửa thập lục phân: bảng nibble, bảng so sánh với IPv4, và một địa chỉ MAC đọc ra nhị phân.'),

    walk('nwc204-ch04b', [
      [12, 'Hexadecimal: four bits, one symbol',
        `<p>Hexadecimal is base 16: the digits 0–9 followed by the letters A–F for ten to fifteen.</p>
<ul>
<li>Four bits have <strong>2 to the power of 4 = 16</strong> possible patterns.</li>
<li>Hex has exactly <strong>16 symbols</strong>.</li>
<li>Therefore one hex digit maps to one group of four bits (a <strong>nibble</strong>) with <em>no arithmetic at all</em> — it is a lookup, not a calculation.</li>
<li><code>A</code> = 1010 = 10 · <code>B</code> = 1011 = 11 · <code>C</code> = 1100 = 12 · <code>D</code> = 1101 = 13 · <code>E</code> = 1110 = 14 · <code>F</code> = 1111 = 15.</li>
</ul>
<p>That "no arithmetic" property is the entire reason hex exists. Decimal has ten symbols, which does not divide the binary world evenly, so every decimal-to-binary step costs you a subtraction. Hex costs you a glance.</p>`,
        `<p>Hệ thập lục phân là hệ cơ số 16: các chữ số 0–9 rồi tới các chữ cái A–F cho mười tới mười lăm.</p>
<ul>
<li>Bốn bit có <strong>2 mũ 4 = 16</strong> mẫu bit khả dĩ.</li>
<li>Hex có đúng <strong>16 ký hiệu</strong>.</li>
<li>Vì vậy một chữ số hex ứng với một nhóm bốn bit (một <strong>nibble</strong>) mà <em>không cần phép tính nào</em> — đây là tra bảng, không phải tính toán.</li>
<li><code>A</code> = 1010 = 10 · <code>B</code> = 1011 = 11 · <code>C</code> = 1100 = 12 · <code>D</code> = 1101 = 13 · <code>E</code> = 1110 = 14 · <code>F</code> = 1111 = 15.</li>
</ul>
<p>Chính tính chất "không cần tính" đó là toàn bộ lý do hệ hex tồn tại. Thập phân có mười ký hiệu, con số không chia chẵn thế giới nhị phân, nên mỗi bước từ thập phân sang nhị phân đều tốn một phép trừ. Hex thì chỉ tốn một cái liếc mắt.</p>`],

      [13, 'Why MAC and IPv6 use hex, IPv4 does not',
        `<p>Compare the three address types by length, and the choice explains itself.</p>
<ul>
<li><strong>IPv4</strong> — 32 bits, written as 4 decimal octets: <code>192.168.10.10</code>. Short enough for humans to read aloud and type from memory.</li>
<li><strong>MAC</strong> — 48 bits, written as 12 hex digits: <code>00:1B:44:11:3A:B7</code>. In decimal that would be <code>0.27.68.17.58.183</code>, which nobody wants.</li>
<li><strong>IPv6</strong> — 128 bits, written as 32 hex digits. In decimal it is a 39-digit number with no internal structure you could see.</li>
<li>Decimal <em>hides</em> the bits: <code>255</code> tells you nothing at a glance about where a prefix boundary falls.</li>
<li>Hex <em>shows</em> the bits: each digit is four bits, so a /48 or /64 boundary lands on a digit boundary and is visible by eye.</li>
</ul>
<p>IPv4 kept decimal purely for historical reasons — it was designed when addresses were read off paper. That accident is also why subnetting IPv4 feels harder than subnetting IPv6.</p>`,
        `<p>So ba loại địa chỉ theo độ dài, và lựa chọn tự nó giải thích.</p>
<ul>
<li><strong>IPv4</strong> — 32 bit, viết thành 4 octet thập phân: <code>192.168.10.10</code>. Đủ ngắn để người đọc lên được và gõ từ trí nhớ.</li>
<li><strong>MAC</strong> — 48 bit, viết thành 12 chữ số hex: <code>00:1B:44:11:3A:B7</code>. Viết thập phân sẽ là <code>0.27.68.17.58.183</code>, thứ không ai muốn.</li>
<li><strong>IPv6</strong> — 128 bit, viết thành 32 chữ số hex. Viết thập phân thì đó là một con số 39 chữ số, không hé lộ chút cấu trúc nào.</li>
<li>Thập phân <em>che</em> các bit đi: nhìn <code>255</code> bạn không đoán được ranh giới tiền tố rơi vào đâu.</li>
<li>Hex <em>phơi bày</em> các bit: mỗi chữ số là bốn bit, nên ranh giới /48 hay /64 rơi đúng vào ranh giới chữ số và nhìn bằng mắt là thấy.</li>
</ul>
<p>IPv4 giữ thập phân hoàn toàn vì lý do lịch sử — nó được thiết kế khi người ta còn đọc địa chỉ trên giấy. Cái tình cờ đó cũng là lý do chia subnet IPv4 cảm thấy khó hơn chia subnet IPv6.</p>`],

      [14, 'Reading a MAC address in binary',
        `<p>Take <code>00:1B:44:11:3A:B7</code> and expand it. Each hex pair is one byte, so each pair becomes eight bits.</p>
<ul>
<li><code>00</code> → <code>00000000</code> = 0 &nbsp;·&nbsp; <code>1B</code> → <code>00011011</code> = 27 (1 is 0001, B is 1011)</li>
<li><code>44</code> → <code>01000100</code> = 68 &nbsp;·&nbsp; <code>11</code> → <code>00010001</code> = 17</li>
<li><code>3A</code> → <code>00111010</code> = 58 &nbsp;·&nbsp; <code>B7</code> → <code>10110111</code> = 183</li>
<li>The first three bytes, <code>00:1B:44</code>, are the <strong>OUI</strong> — the block assigned to one manufacturer.</li>
<li>The last three, <code>11:3A:B7</code>, are the serial that manufacturer assigned.</li>
</ul>
<p>48 bits give about 281 thousand billion possible addresses, which is why a globally unique burned-in address was a workable idea at all.</p>`,
        `<p>Lấy <code>00:1B:44:11:3A:B7</code> và trải nó ra. Mỗi cặp hex là một byte, nên mỗi cặp thành tám bit.</p>
<ul>
<li><code>00</code> → <code>00000000</code> = 0 &nbsp;·&nbsp; <code>1B</code> → <code>00011011</code> = 27 (1 là 0001, B là 1011)</li>
<li><code>44</code> → <code>01000100</code> = 68 &nbsp;·&nbsp; <code>11</code> → <code>00010001</code> = 17</li>
<li><code>3A</code> → <code>00111010</code> = 58 &nbsp;·&nbsp; <code>B7</code> → <code>10110111</code> = 183</li>
<li>Ba byte đầu, <code>00:1B:44</code>, là <strong>OUI</strong> — khối địa chỉ cấp cho một nhà sản xuất.</li>
<li>Ba byte cuối, <code>11:3A:B7</code>, là số hiệu do chính nhà sản xuất đó gán.</li>
</ul>
<p>48 bit cho khoảng 281 nghìn tỷ địa chỉ khả dĩ, và đó là lý do việc nung sẵn một địa chỉ duy nhất toàn cầu vào card mới là một ý tưởng khả thi.</p>`],
    ]),

    bi(
      `<h3>🔎 How to check this yourself</h3>
<pre><code class="language-bash"># Hex to binary and to decimal
python3 -c "print(format(0x1B,'08b'), int('1B',16))"
#   00011011 27

# A whole MAC, expanded
python3 -c "
mac='00:1B:44:11:3A:B7'
print(' '.join(format(int(p,16),'08b') for p in mac.split(':')))
print(' '.join(str(int(p,16)) for p in mac.split(':')))
"
#   00000000 00011011 01000100 00010001 00111010 10110111
#   0 27 68 17 58 183

# An IPv6 hextet, four nibbles at a time
python3 -c "print(' '.join(format(0x2001,'016b')[i:i+4] for i in range(0,16,4)))"
#   0010 0000 0000 0001

# Your own MAC addresses
ip -br link            # Linux
ifconfig | grep ether  # macOS</code></pre>
<pre><code class="language-plaintext">each hex digit gives exactly 4 bits   -> correct; this is the whole point of hex
your binary is 7 bits for a digit     -> you dropped a leading zero inside the nibble
02:00:00:... on a laptop Wi-Fi NIC    -> a randomised MAC, not the burned-in one
first three bytes repeat across your  -> same manufacturer (the OUI), different serials
  devices from one vendor</code></pre>
<p>That also answers the opening question: hex wins for long addresses because <strong>one digit is exactly four bits</strong>, so the written form keeps the bit structure visible. IPv4 is short enough that decimal stays readable, and it was chosen before anyone needed to see prefix boundaries by eye.</p>`,
      `<h3>🔎 Cách tự kiểm</h3>
<pre><code class="language-bash"># Hex sang nhị phân và sang thập phân
python3 -c "print(format(0x1B,'08b'), int('1B',16))"
#   00011011 27

# Cả một địa chỉ MAC, trải ra
python3 -c "
mac='00:1B:44:11:3A:B7'
print(' '.join(format(int(p,16),'08b') for p in mac.split(':')))
print(' '.join(str(int(p,16)) for p in mac.split(':')))
"
#   00000000 00011011 01000100 00010001 00111010 10110111
#   0 27 68 17 58 183

# Một hextet của IPv6, tách bốn bit một
python3 -c "print(' '.join(format(0x2001,'016b')[i:i+4] for i in range(0,16,4)))"
#   0010 0000 0000 0001

# Xem địa chỉ MAC của chính bạn
ip -br link            # Linux
ifconfig | grep ether  # macOS</code></pre>
<pre><code class="language-plaintext">mỗi chữ số hex cho đúng 4 bit        -> đúng; đây chính là toàn bộ ý nghĩa của hex
nhị phân của bạn chỉ có 7 bit        -> bạn đánh rơi một bit 0 ở đầu nibble
card Wi-Fi laptop hiện 02:00:00:...  -> MAC ngẫu nhiên hoá, không phải MAC nung sẵn
ba byte đầu giống nhau trên nhiều    -> cùng một nhà sản xuất (OUI), khác số hiệu
  thiết bị cùng hãng</code></pre>
<p>Đó cũng là đáp án câu hỏi mở đầu: hex thắng với các địa chỉ dài vì <strong>một chữ số đúng bằng bốn bit</strong>, nên dạng viết ra vẫn giữ được cấu trúc bit nhìn thấy được. IPv4 đủ ngắn để thập phân còn dễ đọc, và nó được chọn từ trước khi ai cần nhìn ranh giới tiền tố bằng mắt.</p>`,
    ),

    bi(
      `<h3>⚠️ Traps people actually fall into</h3>
<ol>
<li><strong>Converting a hex pair through decimal.</strong> <em>Symptom:</em> slow, error-prone work — <code>3A</code> becomes 58, then 58 goes through the subtraction ladder. Do it as two nibbles instead: 3 is 0011, A is 1010, so <code>3A</code> is <code>00111010</code>. No arithmetic.</li>
<li><strong>Dropping a leading zero inside a nibble.</strong> <em>Symptom:</em> your MAC expands to 47 bits and every field after it shifts. <code>1</code> is <code>0001</code>, not <code>1</code>. Every nibble is four characters, always.</li>
<li><strong>Assuming a MAC is permanent.</strong> <em>Symptom:</em> a DHCP reservation that stops working after a phone update. Modern phones and laptops randomise the wireless MAC per SSID for privacy; the burned-in address is still there, but it is not what appears on the network.</li>
<li><strong>Reading <code>::</code> in IPv6 as a separator.</strong> <em>Symptom:</em> counting <code>2001:db8::1</code> as three hextets. The double colon is a placeholder for one or more all-zero hextets, and it may appear only once in an address.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>Đổi một cặp hex thông qua thập phân.</strong> <em>Triệu chứng:</em> làm chậm và dễ sai — <code>3A</code> thành 58, rồi 58 lại phải qua thang trừ dần. Hãy làm theo hai nibble: 3 là 0011, A là 1010, vậy <code>3A</code> là <code>00111010</code>. Không cần phép tính nào.</li>
<li><strong>Đánh rơi bit 0 ở đầu một nibble.</strong> <em>Triệu chứng:</em> địa chỉ MAC của bạn trải ra chỉ còn 47 bit và mọi trường sau đó đều xê dịch. <code>1</code> là <code>0001</code>, không phải <code>1</code>. Mỗi nibble luôn là bốn ký tự.</li>
<li><strong>Tưởng MAC là vĩnh viễn.</strong> <em>Triệu chứng:</em> một mục đặt trước DHCP ngừng chạy sau khi điện thoại cập nhật. Điện thoại và laptop đời mới ngẫu nhiên hoá MAC không dây theo từng SSID để bảo vệ riêng tư; địa chỉ nung sẵn vẫn còn đó nhưng không phải thứ xuất hiện trên mạng.</li>
<li><strong>Đọc <code>::</code> trong IPv6 như một dấu phân cách.</strong> <em>Triệu chứng:</em> đếm <code>2001:db8::1</code> thành ba hextet. Hai dấu hai chấm là chỗ thay cho một hoặc nhiều hextet toàn số 0, và nó chỉ được xuất hiện đúng một lần trong một địa chỉ.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — with full answers</h3>
<p><strong>1.</strong> Expand these hex bytes to 8 bits each, without going through decimal: <code>C0</code>, <code>A8</code>, <code>0A</code>, <code>FE</code>, <code>80</code>.</p>
<p><strong>2.</strong> <code>C0:A8:0A:0A</code> is an IPv4 address written in hex. What is it in dotted decimal, and why will you recognise it?</p>
<p><strong>3.</strong> The IPv6 hextet <code>FE80</code> opens every link-local address. Write it as 16 bits and say how many of the leading bits are 1.</p>
<details><summary>Answers</summary>
<pre><code class="language-plaintext">1.  C0 -> 1100 0000 = 11000000   (C=1100, 0=0000)
    A8 -> 1010 1000 = 10101000   (A=1010, 8=1000)
    0A -> 0000 1010 = 00001010
    FE -> 1111 1110 = 11111110
    80 -> 1000 0000 = 10000000</code></pre>
<p><strong>2.</strong> C0 = 192, A8 = 168, 0A = 10, 0A = 10, so it is <code>192.168.10.10</code> — the private address used throughout this chapter. Seeing <code>C0A8</code> at the start of a hex dump is a reliable sign that you are looking at a 192.168 address.</p>
<p><strong>3.</strong> <code>FE80</code> = <code>1111 1110 1000 0000</code>. The <strong>first seven</strong> bits are 1, then bit 8 is 0, bit 9 is 1 and bit 10 is 0. Link-local is the /10 prefix <code>FE80::/10</code>, so the ten fixed bits are <code>1111111010</code> — and the written form <code>FE80</code> also pins the six bits after them to zero, which is why every link-local address you see begins exactly <code>fe80::</code>.</p>
<pre><code class="language-bash">python3 -c "
for h in ['C0','A8','0A','FE','80']: print(h, format(int(h,16),'08b'), int(h,16))
print(' '.join(format(0xFE80,'016b')[i:i+4] for i in range(0,16,4)))
"</code></pre>
</details>`,
      `<h3>✍️ Bài tập — có lời giải đầy đủ</h3>
<p><strong>1.</strong> Trải các byte hex sau thành 8 bit, không đi vòng qua thập phân: <code>C0</code>, <code>A8</code>, <code>0A</code>, <code>FE</code>, <code>80</code>.</p>
<p><strong>2.</strong> <code>C0:A8:0A:0A</code> là một địa chỉ IPv4 viết bằng hex. Nó là gì ở dạng thập phân có dấu chấm, và vì sao bạn sẽ nhận ra nó?</p>
<p><strong>3.</strong> Hextet <code>FE80</code> của IPv6 mở đầu mọi địa chỉ link-local. Hãy viết nó thành 16 bit và cho biết có bao nhiêu bit 1 ở đầu.</p>
<details><summary>Lời giải</summary>
<pre><code class="language-plaintext">1.  C0 -> 1100 0000 = 11000000   (C=1100, 0=0000)
    A8 -> 1010 1000 = 10101000   (A=1010, 8=1000)
    0A -> 0000 1010 = 00001010
    FE -> 1111 1110 = 11111110
    80 -> 1000 0000 = 10000000</code></pre>
<p><strong>2.</strong> C0 = 192, A8 = 168, 0A = 10, 0A = 10, vậy đó là <code>192.168.10.10</code> — chính địa chỉ riêng dùng suốt chương này. Thấy <code>C0A8</code> ở đầu một bản đổ hex là dấu hiệu đáng tin rằng bạn đang nhìn một địa chỉ 192.168.</p>
<p><strong>3.</strong> <code>FE80</code> = <code>1111 1110 1000 0000</code>. <strong>Bảy bit đầu</strong> đều là 1, rồi bit thứ 8 là 0, bit thứ 9 là 1 và bit thứ 10 là 0. Link-local là tiền tố /10 <code>FE80::/10</code>, nên mười bit cố định là <code>1111111010</code> — và dạng viết <code>FE80</code> còn ghim luôn sáu bit tiếp theo bằng 0, vì vậy mọi địa chỉ link-local bạn thấy đều bắt đầu đúng bằng <code>fe80::</code>.</p>
<pre><code class="language-bash">python3 -c "
for h in ['C0','A8','0A','FE','80']: print(h, format(int(h,16),'08b'), int(h,16))
print(' '.join(format(0xFE80,'016b')[i:i+4] for i in range(0,16,4)))
"</code></pre>
</details>`,
    ),
  ].join('\n'),
};

/* ──────────────────────────── Lesson 4B.3 ──────────────────────────── */

const L3 = {
  title: '4B.3 — Bitwise AND: how a router decides same network or different (web-added chapter)|||4B.3 — Phép AND theo bit: cách router quyết định cùng mạng hay khác mạng (chương web bổ sung)',
  slug: 'nwc204-4b-3-phep-and-theo-bit-va-mat-na-mang',
  type: 'DOCUMENT',
  description: 'Chương bù: bảng chân trị AND, AND trên một octet rồi trên đủ bốn octet, vì sao đó chính là cách router so địa chỉ với mặt nạ, và cùng hai máy chỉ đổi mặt nạ là đã khác mạng. 6 bài tập AND có lời giải từng bước.',
  content: [
    CANH_BAO,

    bi(
      `<span class="eyebrow">NWC204 · Chapter 4B · Lesson 4B.3 · NO FLM session — added for this site · prepares sessions 30–33 · Cisco Module 5</span>
<h2>The one operation behind every routing decision</h2>
<p class="lead">This is the payoff of the whole added chapter. Bitwise AND is a three-line truth table, and it is <em>exactly</em> what your machine does, thousands of times a second, to decide whether to send a frame to a neighbour or to the gateway.</p>
<p><strong>Opening question:</strong> two PCs are plugged into the same switch, on the same cable run, in the same room: <code>192.168.10.10</code> and <code>192.168.10.200</code>. With mask <code>255.255.255.0</code> they can ping each other. Change both masks to <code>255.255.255.192</code> and they cannot. Nothing physical changed. Why?</p>`,
      `<span class="eyebrow">NWC204 · Chương 4B · Bài 4B.3 · KHÔNG có buổi nào của FLM — bổ sung cho web này · chuẩn bị cho buổi 30–33 · Cisco Module 5</span>
<h2>Phép toán duy nhất nằm sau mọi quyết định định tuyến</h2>
<p class="lead">Đây là phần thu hoạch của cả chương bổ sung. AND theo bit chỉ là một bảng chân trị ba dòng, và nó <em>đúng là</em> thứ máy của bạn làm, hàng nghìn lần mỗi giây, để quyết định gửi khung cho hàng xóm hay cho cổng ra.</p>
<p><strong>Câu hỏi mở đầu:</strong> hai máy cắm vào cùng một switch, cùng một đường cáp, trong cùng một phòng: <code>192.168.10.10</code> và <code>192.168.10.200</code>. Với mặt nạ <code>255.255.255.0</code> chúng ping được nhau. Đổi cả hai mặt nạ thành <code>255.255.255.192</code> thì không ping được nữa. Không có gì về vật lý thay đổi. Vì sao?</p>`,
    ),

    walkHead('nwc204-ch04b', 15, 18,
      'Slides 15–18 are the AND half of the added chapter: the truth table, one octet, all four octets, and the same-or-different verdict.',
      'Slide 15–18 là nửa AND của chương bổ sung: bảng chân trị, một octet, đủ bốn octet, và phán quyết cùng mạng hay khác mạng.'),

    walk('nwc204-ch04b', [
      [15, 'Bitwise AND — the operation a router runs',
        `<p>The truth table has four rows and only one of them produces a 1.</p>
<ul>
<li>0 AND 0 = 0 · 0 AND 1 = 0 · 1 AND 0 = 0 · <strong>1 AND 1 = 1</strong>.</li>
<li>Read it as a filter: a mask bit of <strong>1 keeps</strong> the address bit, a mask bit of <strong>0 erases</strong> it to zero.</li>
<li>The worked octet is <code>11001000</code> (200) AND <code>11000000</code> (192) = <code>11000000</code> = <strong>192</strong>.</li>
<li>What happened: the top two bits survived, the host part was wiped out, and what is left is the <em>network part</em>.</li>
</ul>
<p>That is all a subnet mask is: a row of 1s marking "these bits are the network", followed by 0s marking "these bits identify the host, and I do not care about them when deciding where to send".</p>`,
        `<p>Bảng chân trị có bốn dòng và chỉ đúng một dòng cho ra bit 1.</p>
<ul>
<li>0 AND 0 = 0 · 0 AND 1 = 0 · 1 AND 0 = 0 · <strong>1 AND 1 = 1</strong>.</li>
<li>Hãy đọc nó như một bộ lọc: bit mặt nạ bằng <strong>1 thì GIỮ</strong> bit địa chỉ, bit mặt nạ bằng <strong>0 thì XOÁ</strong> bit đó về 0.</li>
<li>Octet làm mẫu là <code>11001000</code> (200) AND <code>11000000</code> (192) = <code>11000000</code> = <strong>192</strong>.</li>
<li>Chuyện vừa xảy ra: hai bit trên cùng sống sót, phần dành cho máy trạm bị xoá sạch, và thứ còn lại chính là <em>phần mạng</em>.</li>
</ul>
<p>Mặt nạ mạng chỉ có thế: một dãy bit 1 đánh dấu "những bit này là phần mạng", theo sau là các bit 0 đánh dấu "những bit này nhận diện máy trạm, và tôi không quan tâm tới chúng khi quyết định gửi đi đâu".</p>`],

      [16, 'AND across all four octets',
        `<p>The full operation on <code>192.168.10.200</code> with mask <code>255.255.255.192</code>, one octet at a time.</p>
<ul>
<li>Octet 1: <code>11000000</code> AND <code>11111111</code> = <code>11000000</code> = 192.</li>
<li>Octet 2: <code>10101000</code> AND <code>11111111</code> = <code>10101000</code> = 168.</li>
<li>Octet 3: <code>00001010</code> AND <code>11111111</code> = <code>00001010</code> = 10.</li>
<li>Octet 4: <code>11001000</code> AND <code>11000000</code> = <code>11000000</code> = 192.</li>
<li>Network address: <strong>192.168.10.192</strong>.</li>
</ul>
<p>Notice the shortcut you can now take honestly: wherever the mask octet is 255, the result octet is the address octet unchanged, so you only ever do real work on the octet where the mask is neither 255 nor 0. That is usually exactly one octet.</p>`,
        `<p>Phép tính đầy đủ trên <code>192.168.10.200</code> với mặt nạ <code>255.255.255.192</code>, từng octet một.</p>
<ul>
<li>Octet 1: <code>11000000</code> AND <code>11111111</code> = <code>11000000</code> = 192.</li>
<li>Octet 2: <code>10101000</code> AND <code>11111111</code> = <code>10101000</code> = 168.</li>
<li>Octet 3: <code>00001010</code> AND <code>11111111</code> = <code>00001010</code> = 10.</li>
<li>Octet 4: <code>11001000</code> AND <code>11000000</code> = <code>11000000</code> = 192.</li>
<li>Địa chỉ mạng: <strong>192.168.10.192</strong>.</li>
</ul>
<p>Để ý mẹo mà giờ bạn dùng được một cách đường hoàng: chỗ nào octet mặt nạ bằng 255 thì octet kết quả chính là octet địa chỉ giữ nguyên, nên bạn chỉ thật sự phải tính ở octet mà mặt nạ không phải 255 cũng không phải 0. Thường thì đó đúng là một octet.</p>`],

      [17, 'Same network or different? Ask AND twice',
        `<p>The decision procedure, in full, for any two addresses.</p>
<ul>
<li>AND the <strong>first</strong> address with the mask. AND the <strong>second</strong> address with the same mask.</li>
<li>If the two results are <strong>identical</strong>, the hosts are on the same network: send the frame directly, using the destination's own MAC.</li>
<li>If they <strong>differ</strong>, they are on different networks: send the frame to the default gateway, leaving the destination IP unchanged.</li>
<li>With <code>255.255.255.0</code>: 192.168.10.10 → 192.168.10.0 and 192.168.10.200 → 192.168.10.0. Identical, so <strong>same network</strong>.</li>
<li>With <code>255.255.255.192</code>: 192.168.10.10 → 192.168.10.0 and 192.168.10.200 → 192.168.10.192. Different, so <strong>a router is required</strong>.</li>
</ul>
<p>Same two hosts, same cable, same switch. Only the mask changed. This is the single most common "the network is broken" that is not broken — and it is also the answer to this lesson's opening question.</p>`,
        `<p>Toàn bộ thủ tục quyết định, áp dụng cho hai địa chỉ bất kỳ.</p>
<ul>
<li>Lấy địa chỉ <strong>thứ nhất</strong> AND với mặt nạ. Lấy địa chỉ <strong>thứ hai</strong> AND với đúng mặt nạ đó.</li>
<li>Nếu hai kết quả <strong>giống hệt nhau</strong>, hai máy cùng mạng: gửi khung thẳng tới nơi, dùng chính MAC của máy đích.</li>
<li>Nếu hai kết quả <strong>khác nhau</strong>, chúng khác mạng: gửi khung tới cổng ra mặc định, còn địa chỉ IP đích giữ nguyên.</li>
<li>Với <code>255.255.255.0</code>: 192.168.10.10 → 192.168.10.0 và 192.168.10.200 → 192.168.10.0. Giống nhau, nên <strong>cùng mạng</strong>.</li>
<li>Với <code>255.255.255.192</code>: 192.168.10.10 → 192.168.10.0 và 192.168.10.200 → 192.168.10.192. Khác nhau, nên <strong>bắt buộc phải có router</strong>.</li>
</ul>
<p>Vẫn hai máy đó, vẫn sợi cáp đó, vẫn cái switch đó. Chỉ mặt nạ thay đổi. Đây là kiểu "mạng hỏng rồi" phổ biến nhất mà thật ra không hỏng gì — và cũng chính là đáp án câu hỏi mở đầu của bài này.</p>`],

      [18, 'Mark your own homework with python3',
        `<p>Three one-liners that cover everything in this chapter.</p>
<ul>
<li><code>print(bin(192), int('11000000',2))</code> — both directions at once.</li>
<li>The f-string version pads each octet to eight bits so the columns line up for an AND.</li>
<li><code>ipaddress.ip_network(..., strict=False)</code> does the whole AND for you and prints the network in CIDR form.</li>
</ul>
<p><strong>The discipline that matters:</strong> do every exercise on paper first, then check. If you check before you finish, you train yourself to <em>read</em> an answer instead of producing one — and sessions 30–33 will hurt, because the exam has no python prompt.</p>
<p>Every number printed on these slides was produced by running exactly these commands before the slide was drawn.</p>`,
        `<p>Ba dòng lệnh phủ hết nội dung của cả chương này.</p>
<ul>
<li><code>print(bin(192), int('11000000',2))</code> — cả hai chiều trong một lần.</li>
<li>Bản dùng f-string đệm mỗi octet đủ tám bit để các cột thẳng hàng khi làm phép AND.</li>
<li><code>ipaddress.ip_network(..., strict=False)</code> làm trọn phép AND giúp bạn và in ra mạng theo dạng CIDR.</li>
</ul>
<p><strong>Kỷ luật quan trọng nhất:</strong> làm mọi bài tập trên giấy trước, rồi mới chấm. Chấm trước khi làm xong là tự luyện cho mình cách <em>đọc</em> đáp án thay vì tạo ra đáp án — và buổi 30–33 sẽ rất đau, vì phòng thi không có dấu nhắc python.</p>
<p>Mọi con số in trên các slide này đều được tạo ra bằng cách chạy đúng những lệnh đó, trước khi slide được vẽ.</p>`],
    ]),

    bi(
      `<h3>🧭 The host's decision, as a flow chart</h3>
<pre class="mermaid">
flowchart TD
  A["I want to send to<br/>destination IP D"] --> B["my address AND my mask<br/>= my network N1"]
  B --> C["D AND my mask<br/>= network N2"]
  C --> D{"N1 equals N2?"}
  D -->|"yes - same network"| E["ARP for D itself<br/>frame goes straight to D"]
  D -->|"no - different network"| F["ARP for the default gateway<br/>frame goes to the router<br/>destination IP stays D"]
  F --> G["no default gateway set?<br/>the packet is dropped here"]
</pre>`,
      `<h3>🧭 Quyết định của máy gửi, vẽ thành lưu đồ</h3>
<pre class="mermaid">
flowchart TD
  A["Tôi muốn gửi tới<br/>địa chỉ đích D"] --> B["địa chỉ của tôi AND mặt nạ của tôi<br/>= mạng N1"]
  B --> C["D AND mặt nạ của tôi<br/>= mạng N2"]
  C --> D{"N1 có bằng N2 không?"}
  D -->|"có - cùng mạng"| E["ARP tìm chính D<br/>khung đi thẳng tới D"]
  D -->|"không - khác mạng"| F["ARP tìm cổng ra mặc định<br/>khung đi tới router<br/>IP đích vẫn là D"]
  F --> G["chưa đặt cổng ra mặc định?<br/>gói tin bị vứt ngay tại đây"]
</pre>`,
    ),

    bi(
      `<h3>🔎 How to check this yourself</h3>
<pre><code class="language-bash"># The AND, spelled out octet by octet - do this AFTER you did it on paper
python3 -c "
ip, mask = '192.168.10.200', '255.255.255.192'
a = [int(x) for x in ip.split('.')]
m = [int(x) for x in mask.split('.')]
for i,(x,y) in enumerate(zip(a,m), 1):
    print(f'octet{i}: {x:08b} AND {y:08b} = {x&y:08b} = {x&y}')
print('network =', '.'.join(str(x&y) for x,y in zip(a,m)))
"

# The same thing in one call
python3 -c "import ipaddress as i; print(i.ip_network('192.168.10.200/26', strict=False))"

# On a real machine: what does MY host think its network is?
ip route show | head -3
ip -br addr</code></pre>
<pre><code class="language-plaintext">network = 192.168.10.192          -> matches your paper answer: the method is right
your answer differs in octet 4    -> re-check the mask octet: 192 is 11000000, not 11100000
ip route shows 192.168.10.0/24    -> this host believes the whole /24 is local
ip route shows 192.168.10.192/26  -> this host will use the gateway for .10, and direct for .200
no "default via ..." line         -> no gateway: every off-network packet is dropped locally</code></pre>
<p>That last line is worth remembering for the rest of the course: a host with the wrong mask does not report an error. It quietly makes the wrong routing decision, and the symptom appears somewhere else entirely.</p>`,
      `<h3>🔎 Cách tự kiểm</h3>
<pre><code class="language-bash"># Phép AND, viết rõ từng octet - chỉ chạy SAU khi đã làm trên giấy
python3 -c "
ip, mask = '192.168.10.200', '255.255.255.192'
a = [int(x) for x in ip.split('.')]
m = [int(x) for x in mask.split('.')]
for i,(x,y) in enumerate(zip(a,m), 1):
    print(f'octet{i}: {x:08b} AND {y:08b} = {x&y:08b} = {x&y}')
print('network =', '.'.join(str(x&y) for x,y in zip(a,m)))
"

# Vẫn việc đó, gói trong một lời gọi
python3 -c "import ipaddress as i; print(i.ip_network('192.168.10.200/26', strict=False))"

# Trên máy thật: MÁY CỦA TÔI nghĩ mạng của nó là gì?
ip route show | head -3
ip -br addr</code></pre>
<pre><code class="language-plaintext">network = 192.168.10.192          -> khớp đáp án trên giấy: phương pháp đúng
đáp án lệch ở octet 4             -> kiểm lại octet mặt nạ: 192 là 11000000, không phải 11100000
ip route hiện 192.168.10.0/24     -> máy này tin cả dải /24 là nội bộ
ip route hiện 192.168.10.192/26   -> máy này sẽ đi qua cổng ra để tới .10, và đi thẳng tới .200
không có dòng "default via ..."   -> không có cổng ra: mọi gói ra ngoài mạng đều bị vứt tại chỗ</code></pre>
<p>Dòng cuối đáng nhớ cho cả phần còn lại của môn: một máy đặt sai mặt nạ không báo lỗi gì. Nó lặng lẽ ra quyết định định tuyến sai, và triệu chứng lại nổi lên ở một chỗ hoàn toàn khác.</p>`,
    ),

    bi(
      `<h3>⚠️ Traps people actually fall into</h3>
<ol>
<li><strong>ANDing with the wrong mask octet.</strong> <em>Symptom:</em> your network address is out by 32 or 64 and every following subnet calculation is wrong. 192 is <code>11000000</code>, 224 is <code>11100000</code>, 240 is <code>11110000</code>. Write the mask in binary before you AND, every single time.</li>
<li><strong>Believing a mask is a global setting.</strong> <em>Symptom:</em> "I fixed the mask on the server, why is the laptop still failing?" The AND is performed by <em>each host with its own mask</em>. Two hosts can disagree about whether they are neighbours, and then traffic works in one direction only.</li>
<li><strong>Expecting an error message from a wrong mask.</strong> <em>Symptom:</em> a machine that pings some local addresses and not others, with nothing in any log. The host is doing exactly what it was told; it has simply been told a different network boundary than its neighbours.</li>
<li><strong>Forgetting the gateway after narrowing the mask.</strong> <em>Symptom:</em> you change a /24 to a /26 to split a network, and half the hosts lose everything, not just each other. Once a destination becomes "different network", the host needs a default gateway — and if the router has no interface in the new subnet, nothing routes.</li>
</ol>`,
      `<h3>⚠️ Bẫy hay mắc</h3>
<ol>
<li><strong>AND nhầm octet của mặt nạ.</strong> <em>Triệu chứng:</em> địa chỉ mạng lệch 32 hoặc 64, và mọi phép chia subnet sau đó đều sai. 192 là <code>11000000</code>, 224 là <code>11100000</code>, 240 là <code>11110000</code>. Hãy viết mặt nạ ra nhị phân trước khi AND, lần nào cũng vậy.</li>
<li><strong>Tưởng mặt nạ là một thiết lập chung toàn mạng.</strong> <em>Triệu chứng:</em> "tôi sửa mặt nạ trên máy chủ rồi, sao laptop vẫn hỏng?" Phép AND do <em>từng máy tự làm với mặt nạ của chính nó</em>. Hai máy có thể bất đồng về việc chúng có phải hàng xóm hay không, và khi đó lưu lượng chỉ chạy được một chiều.</li>
<li><strong>Chờ đợi một thông báo lỗi từ mặt nạ sai.</strong> <em>Triệu chứng:</em> một máy ping được vài địa chỉ nội bộ và không ping được vài địa chỉ khác, log không có gì. Máy đó đang làm đúng y những gì nó được bảo; chỉ là nó được bảo một ranh giới mạng khác với hàng xóm.</li>
<li><strong>Quên cổng ra sau khi thu hẹp mặt nạ.</strong> <em>Triệu chứng:</em> bạn đổi /24 thành /26 để chia mạng, và một nửa số máy mất hết mọi kết nối chứ không chỉ mất liên lạc với nhau. Một khi máy đích trở thành "khác mạng", máy gửi cần một cổng ra mặc định — và nếu router không có giao diện nào trong subnet mới thì không gì định tuyến được.</li>
</ol>`,
    ),

    bi(
      `<h3>✍️ Exercises — 6 AND problems, worked in full</h3>
<p>For each, AND the address with the mask, octet by octet, and state the network address. Then answer the question attached.</p>
<p><strong>1.</strong> <code>10.1.1.1</code> with <code>255.0.0.0</code></p>
<p><strong>2.</strong> <code>172.16.5.33</code> with <code>255.255.0.0</code></p>
<p><strong>3.</strong> <code>203.0.113.77</code> with <code>255.255.255.224</code></p>
<p><strong>4.</strong> <code>192.168.1.130</code> and <code>192.168.1.100</code>, both with <code>255.255.255.128</code>. Same network or different?</p>
<p><strong>5.</strong> <code>198.51.100.99</code> with <code>255.255.255.240</code></p>
<p><strong>6.</strong> <code>172.16.20.200</code> with <code>255.255.240.0</code>. Which octet did the real work?</p>
<details><summary>Answers</summary>
<pre><code class="language-plaintext">1.  10.1.1.1 AND 255.0.0.0
    octet1: 00001010 AND 11111111 = 00001010 = 10
    octet2: 00000001 AND 00000000 = 00000000 = 0
    octet3: 00000001 AND 00000000 = 00000000 = 0
    octet4: 00000001 AND 00000000 = 00000000 = 0
    network = 10.0.0.0                       (/8)

2.  172.16.5.33 AND 255.255.0.0
    octet1: 10101100 AND 11111111 = 10101100 = 172
    octet2: 00010000 AND 11111111 = 00010000 = 16
    octet3: 00000101 AND 00000000 = 00000000 = 0
    octet4: 00100001 AND 00000000 = 00000000 = 0
    network = 172.16.0.0                     (/16)

3.  203.0.113.77 AND 255.255.255.224
    octet1: 11001011 AND 11111111 = 11001011 = 203
    octet2: 00000000 AND 11111111 = 00000000 = 0
    octet3: 01110001 AND 11111111 = 01110001 = 113
    octet4: 01001101 AND 11100000 = 01000000 = 64
    network = 203.0.113.64                   (/27)

4.  192.168.1.130 AND 255.255.255.128
    octet4: 10000010 AND 10000000 = 10000000 = 128  -> 192.168.1.128
    192.168.1.100 AND 255.255.255.128
    octet4: 01100100 AND 10000000 = 00000000 = 0    -> 192.168.1.0
    DIFFERENT networks: a router is required, even on the same switch.

5.  198.51.100.99 AND 255.255.255.240
    octet1: 11000110 AND 11111111 = 11000110 = 198
    octet2: 00110011 AND 11111111 = 00110011 = 51
    octet3: 01100100 AND 11111111 = 01100100 = 100
    octet4: 01100011 AND 11110000 = 01100000 = 96
    network = 198.51.100.96                  (/28)

6.  172.16.20.200 AND 255.255.240.0
    octet1: 10101100 AND 11111111 = 10101100 = 172
    octet2: 00010000 AND 11111111 = 00010000 = 16
    octet3: 00010100 AND 11110000 = 00010000 = 16   <- the only octet that changed
    octet4: 11001000 AND 00000000 = 00000000 = 0
    network = 172.16.16.0                    (/20)
    The THIRD octet did the real work: it is the only one where the mask
    is neither 255 nor 0. Everywhere else the answer was copy or zero.</code></pre>
<p>Mark all six at once:</p>
<pre><code class="language-bash">python3 -c "
cases=[('10.1.1.1','255.0.0.0'),('172.16.5.33','255.255.0.0'),
       ('203.0.113.77','255.255.255.224'),('192.168.1.130','255.255.255.128'),
       ('192.168.1.100','255.255.255.128'),('198.51.100.99','255.255.255.240'),
       ('172.16.20.200','255.255.240.0')]
for ip,mk in cases:
    a=[int(x) for x in ip.split('.')]; m=[int(x) for x in mk.split('.')]
    print(ip,'AND',mk,'=', '.'.join(str(x&y) for x,y in zip(a,m)))
"</code></pre>
</details>`,
      `<h3>✍️ Bài tập — 6 câu AND, giải đầy đủ từng bước</h3>
<p>Với mỗi câu, hãy AND địa chỉ với mặt nạ theo từng octet và nêu địa chỉ mạng. Rồi trả lời câu hỏi kèm theo.</p>
<p><strong>1.</strong> <code>10.1.1.1</code> với <code>255.0.0.0</code></p>
<p><strong>2.</strong> <code>172.16.5.33</code> với <code>255.255.0.0</code></p>
<p><strong>3.</strong> <code>203.0.113.77</code> với <code>255.255.255.224</code></p>
<p><strong>4.</strong> <code>192.168.1.130</code> và <code>192.168.1.100</code>, cùng mặt nạ <code>255.255.255.128</code>. Cùng mạng hay khác mạng?</p>
<p><strong>5.</strong> <code>198.51.100.99</code> với <code>255.255.255.240</code></p>
<p><strong>6.</strong> <code>172.16.20.200</code> với <code>255.255.240.0</code>. Octet nào mới thật sự phải tính?</p>
<details><summary>Lời giải</summary>
<pre><code class="language-plaintext">1.  10.1.1.1 AND 255.0.0.0
    octet1: 00001010 AND 11111111 = 00001010 = 10
    octet2: 00000001 AND 00000000 = 00000000 = 0
    octet3: 00000001 AND 00000000 = 00000000 = 0
    octet4: 00000001 AND 00000000 = 00000000 = 0
    mạng = 10.0.0.0                          (/8)

2.  172.16.5.33 AND 255.255.0.0
    octet1: 10101100 AND 11111111 = 10101100 = 172
    octet2: 00010000 AND 11111111 = 00010000 = 16
    octet3: 00000101 AND 00000000 = 00000000 = 0
    octet4: 00100001 AND 00000000 = 00000000 = 0
    mạng = 172.16.0.0                        (/16)

3.  203.0.113.77 AND 255.255.255.224
    octet1: 11001011 AND 11111111 = 11001011 = 203
    octet2: 00000000 AND 11111111 = 00000000 = 0
    octet3: 01110001 AND 11111111 = 01110001 = 113
    octet4: 01001101 AND 11100000 = 01000000 = 64
    mạng = 203.0.113.64                      (/27)

4.  192.168.1.130 AND 255.255.255.128
    octet4: 10000010 AND 10000000 = 10000000 = 128  -> 192.168.1.128
    192.168.1.100 AND 255.255.255.128
    octet4: 01100100 AND 10000000 = 00000000 = 0    -> 192.168.1.0
    KHÁC mạng: phải có router, dù hai máy cắm chung một switch.

5.  198.51.100.99 AND 255.255.255.240
    octet1: 11000110 AND 11111111 = 11000110 = 198
    octet2: 00110011 AND 11111111 = 00110011 = 51
    octet3: 01100100 AND 11111111 = 01100100 = 100
    octet4: 01100011 AND 11110000 = 01100000 = 96
    mạng = 198.51.100.96                     (/28)

6.  172.16.20.200 AND 255.255.240.0
    octet1: 10101100 AND 11111111 = 10101100 = 172
    octet2: 00010000 AND 11111111 = 00010000 = 16
    octet3: 00010100 AND 11110000 = 00010000 = 16   <- octet duy nhất bị đổi
    octet4: 11001000 AND 00000000 = 00000000 = 0
    mạng = 172.16.16.0                       (/20)
    Octet THỨ BA mới thật sự phải tính: đó là octet duy nhất mà mặt nạ
    không phải 255 cũng không phải 0. Các chỗ còn lại chỉ là chép lại hoặc về 0.</code></pre>
<p>Chấm cả sáu câu một lần:</p>
<pre><code class="language-bash">python3 -c "
cases=[('10.1.1.1','255.0.0.0'),('172.16.5.33','255.255.0.0'),
       ('203.0.113.77','255.255.255.224'),('192.168.1.130','255.255.255.128'),
       ('192.168.1.100','255.255.255.128'),('198.51.100.99','255.255.255.240'),
       ('172.16.20.200','255.255.240.0')]
for ip,mk in cases:
    a=[int(x) for x in ip.split('.')]; m=[int(x) for x in mk.split('.')]
    print(ip,'AND',mk,'=', '.'.join(str(x&y) for x,y in zip(a,m)))
"</code></pre>
</details>`,
    ),

    bi(
      `<h3>➡️ What this unlocks</h3>
<p>You can now do, by hand, the operation that sessions 30–33 are built on. When the course reaches IPv4 addressing, network segmentation and VLSM, the only new ideas will be <em>how many bits to borrow</em> and <em>how to lay the subnets out</em> — the arithmetic itself is already behind you.</p>
<ul>
<li>A mask of <code>255.255.255.0</code> is <strong>/24</strong>: 24 one-bits. 256 addresses, 254 usable hosts.</li>
<li>A mask of <code>255.255.255.192</code> is <strong>/26</strong>: 26 one-bits. 64 addresses, 62 usable hosts, four such subnets inside one /24.</li>
<li>The "minus 2" is the network address itself and the broadcast address — the same off-by-one you met on slide 7.</li>
</ul>`,
      `<h3>➡️ Chương này mở khoá cho cái gì</h3>
<p>Giờ bạn làm được bằng tay đúng cái phép toán mà buổi 30–33 dựng lên trên đó. Khi môn học tới phần địa chỉ IPv4, chia mạng và VLSM, ý tưởng mới duy nhất sẽ là <em>mượn bao nhiêu bit</em> và <em>bố trí các subnet ra sao</em> — còn phần số học thì bạn đã qua rồi.</p>
<ul>
<li>Mặt nạ <code>255.255.255.0</code> là <strong>/24</strong>: 24 bit 1. 256 địa chỉ, 254 địa chỉ dùng được cho máy trạm.</li>
<li>Mặt nạ <code>255.255.255.192</code> là <strong>/26</strong>: 26 bit 1. 64 địa chỉ, 62 địa chỉ dùng được, và một mạng /24 chứa vừa bốn subnet như vậy.</li>
<li>Phần "trừ 2" chính là địa chỉ mạng và địa chỉ quảng bá — vẫn đúng chỗ lệch một đơn vị bạn đã gặp ở slide 7.</li>
</ul>`,
    ),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz ──────────────────────────────── */

const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

const QUIZ = {
  title: 'Quiz Chapter 4B — Number Systems (web-added chapter)|||Quiz Chương 4B — Hệ đếm (chương web bổ sung)',
  slug: 'nwc204-ch4b-quiz',
  type: 'QUIZ',
  description: '10 câu song ngữ, nặng về chuyển đổi số: nhị phân sang thập phân và ngược lại, miền giá trị của octet, hệ hex, và phép AND theo bit với mặt nạ mạng. Mọi đáp án đã kiểm lại bằng python3.',
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      q('What is 11000000 in decimal?|||11000000 trong hệ thập phân là bao nhiêu?',
        ['128', '192', '224', '240'],
        1,
        'Only the 128 and 64 columns hold a 1, so the value is 128 + 64 = 192. For comparison: 224 is 11100000 (128+64+32) and 240 is 11110000 (128+64+32+16). Checked with python3: int("11000000",2) = 192.|||Chỉ cột 128 và cột 64 có bit 1, nên giá trị là 128 + 64 = 192. Để so sánh: 224 là 11100000 (128+64+32) và 240 là 11110000 (128+64+32+16). Đã kiểm bằng python3: int("11000000",2) = 192.'),

      q('What is 172 in 8-bit binary?|||172 viết dưới dạng 8 bit nhị phân là gì?',
        ['10101100', '11001010', '10110010', '01101100'],
        0,
        '172 - 128 = 44, 44 - 32 = 12, 12 - 8 = 4, 4 - 4 = 0, so the 128, 32, 8 and 4 columns are set: 10101100. Check by adding back: 128 + 32 + 8 + 4 = 172. Checked with python3: format(172, "08b") = 10101100.|||172 - 128 = 44, 44 - 32 = 12, 12 - 8 = 4, 4 - 4 = 0, nên các cột 128, 32, 8 và 4 được bật: 10101100. Kiểm bằng cách cộng ngược: 128 + 32 + 8 + 4 = 172. Đã kiểm bằng python3: format(172, "08b") = 10101100.'),

      q('Why can an octet never hold 256?|||Vì sao một octet không bao giờ chứa được 256?',
        ['Because 255 is a reserved broadcast value|||Vì 255 là giá trị quảng bá đã được dành riêng', 'Because 256 needs nine bits and an octet holds eight|||Vì 256 cần chín bit mà một octet chỉ chứa tám', 'Because IPv4 was designed before 256-bit numbers existed|||Vì IPv4 ra đời trước khi có số 256 bit', 'Because routers reject even numbers above 254|||Vì router từ chối mọi số chẵn lớn hơn 254'],
        1,
        '255 is 11111111, exactly eight bits. 256 is 100000000 - nine bits - and the ninth has nowhere to live in an eight-bit field. It is arithmetic, not a convention or a typo rule, and the same reasoning rules out 300 as well.|||255 là 11111111, đúng tám bit. 256 là 100000000 — chín bit — và bit thứ chín không có chỗ nào để ở trong một trường tám bit. Đây là số học, không phải quy ước hay luật chống gõ nhầm, và cùng lý lẽ đó cũng loại luôn số 300.'),

      q('How many bits does one hexadecimal digit represent?|||Một chữ số thập lục phân biểu diễn bao nhiêu bit?',
        ['2', '4', '8', '16'],
        1,
        'Four bits have 2 to the power of 4 = 16 patterns and hex has exactly 16 symbols (0-9 then A-F), so one digit is one nibble with no arithmetic at all. That exact fit is the whole reason hex is used for MAC and IPv6 addresses.|||Bốn bit cho 2 mũ 4 = 16 mẫu và hex có đúng 16 ký hiệu (0-9 rồi A-F), nên một chữ số là một nibble mà không cần phép tính nào. Chính sự khớp khít đó là toàn bộ lý do hex được dùng cho địa chỉ MAC và IPv6.'),

      q('What is the hex byte 1B in binary and decimal?|||Byte hex 1B ở dạng nhị phân và thập phân là gì?',
        ['00011011 = 27', '00011010 = 26', '00101011 = 43', '10110001 = 177'],
        0,
        'Split it into nibbles: 1 is 0001 and B is 1011, so 1B is 00011011. Adding the columns gives 16 + 8 + 2 + 1 = 27. Doing it as two nibbles is a lookup, not a calculation - going through decimal first is slower and more error-prone.|||Tách thành hai nibble: 1 là 0001 và B là 1011, nên 1B là 00011011. Cộng các cột được 16 + 8 + 2 + 1 = 27. Làm theo hai nibble là tra bảng chứ không phải tính - đi vòng qua thập phân vừa chậm vừa dễ sai.'),

      q('Which address family does NOT use hexadecimal notation?|||Loại địa chỉ nào KHÔNG dùng cách viết thập lục phân?',
        ['MAC (48 bits)', 'IPv6 (128 bits)', 'IPv4 (32 bits)', 'All three use hex|||Cả ba đều dùng hex'],
        2,
        'IPv4 is written as four decimal octets, for historical reasons: it is short enough to read aloud. MAC and IPv6 are far longer, and hex keeps the bit structure visible because each digit is exactly four bits. In decimal an IPv6 address would be a 39-digit number.|||IPv4 viết thành bốn octet thập phân, vì lý do lịch sử: nó đủ ngắn để đọc lên được. MAC và IPv6 dài hơn nhiều, và hex giữ được cấu trúc bit nhìn thấy được vì mỗi chữ số đúng bằng bốn bit. Viết thập phân thì một địa chỉ IPv6 là con số 39 chữ số.'),

      q('In a bitwise AND, what does a mask bit of 0 do to the address bit?|||Trong phép AND theo bit, bit mặt nạ bằng 0 làm gì với bit địa chỉ?',
        ['Keeps it unchanged|||Giữ nguyên bit đó', 'Erases it to 0|||Xoá nó về 0', 'Inverts it|||Đảo ngược nó', 'Sets it to 1|||Đặt nó thành 1'],
        1,
        'Only 1 AND 1 produces a 1, so anything ANDed with 0 becomes 0. A mask of 1 keeps the address bit and a mask of 0 erases it - which is precisely how a subnet mask separates the network part from the host part.|||Chỉ 1 AND 1 mới cho ra 1, nên bất cứ thứ gì AND với 0 đều thành 0. Bit mặt nạ bằng 1 thì giữ bit địa chỉ, bằng 0 thì xoá nó - và đó chính là cách mặt nạ mạng tách phần mạng khỏi phần máy trạm.'),

      q('What is 192.168.10.200 AND 255.255.255.192?|||192.168.10.200 AND 255.255.255.192 bằng bao nhiêu?',
        ['192.168.10.0', '192.168.10.192', '192.168.10.200', '192.168.10.255'],
        1,
        'The first three mask octets are 255, so those octets pass through unchanged. In the fourth: 11001000 (200) AND 11000000 (192) = 11000000 = 192. The network is 192.168.10.192, a /26. Verified with python3 and with ipaddress.ip_network("192.168.10.200/26", strict=False).|||Ba octet đầu của mặt nạ là 255 nên các octet đó đi qua nguyên vẹn. Ở octet thứ tư: 11001000 (200) AND 11000000 (192) = 11000000 = 192. Mạng là 192.168.10.192, tức /26. Đã kiểm bằng python3 và bằng ipaddress.ip_network("192.168.10.200/26", strict=False).'),

      q('Two PCs on the same switch: 192.168.10.10 and 192.168.10.200, both with mask 255.255.255.192. Can they talk directly?|||Hai máy trên cùng một switch: 192.168.10.10 và 192.168.10.200, cùng mặt nạ 255.255.255.192. Chúng có nói chuyện trực tiếp được không?',
        ['Yes, they are on the same cable|||Có, chúng chung một đường cáp', 'No - the ANDs give 192.168.10.0 and 192.168.10.192, two different networks|||Không - hai phép AND cho 192.168.10.0 và 192.168.10.192, tức hai mạng khác nhau', 'Yes, because the first three octets match|||Có, vì ba octet đầu giống nhau', 'Only if a switch VLAN is configured|||Chỉ khi cấu hình VLAN trên switch'],
        1,
        '10 AND 192 gives 0 and 200 AND 192 gives 192, so the two network addresses differ and each host will send to its default gateway instead of to its neighbour. Matching first octets prove nothing: the mask decides where the boundary falls, and here it falls inside the fourth octet.|||10 AND 192 ra 0 còn 200 AND 192 ra 192, nên hai địa chỉ mạng khác nhau và mỗi máy sẽ gửi tới cổng ra mặc định thay vì gửi cho hàng xóm. Ba octet đầu giống nhau không chứng minh điều gì: mặt nạ mới quyết định ranh giới rơi vào đâu, và ở đây nó rơi vào giữa octet thứ tư.'),

      q('Why does this chapter exist even though FLM schedules no session for it?|||Vì sao chương này tồn tại dù FLM không xếp buổi nào cho nó?',
        ['Because the exam covers it directly|||Vì đề thi hỏi thẳng vào nó', 'Because the 60-session plan skips Cisco Module 5, and sessions 30-33 (subnetting, VLSM) cannot be done without binary|||Vì kế hoạch 60 buổi bỏ hẳn Cisco Module 5, mà buổi 30-33 (chia subnet, VLSM) không làm được nếu không đọc được nhị phân', 'Because Cisco requires it for certification|||Vì Cisco bắt buộc phải có để lấy chứng chỉ', 'Because it replaces chapter 4|||Vì nó thay thế chương 4'],
        1,
        'The course chapters run one behind the Cisco modules from chapter 5 onward (chapter 5 uses Module 6, chapter 6 uses Module 7), and the module that was skipped is Module 5, Number Systems. This is a supplementary web chapter, not FLM content - but sessions 30-33 assume the skill it teaches.|||Từ chương 5 trở đi, chương của môn lệch một đơn vị so với module Cisco (chương 5 dùng Module 6, chương 6 dùng Module 7), và module bị nhảy qua chính là Module 5, Number Systems. Đây là chương web bổ sung, không phải nội dung của FLM - nhưng buổi 30-33 mặc định là bạn đã có kỹ năng mà nó dạy.'),
    ],
  },
};

export default [
  {
    title: 'Chapter 4B — Number Systems (added chapter, no FLM session)|||Chương 4B — Hệ đếm (chương bổ sung, trường không xếp buổi)',
    slug: 'nwc204-chuong-4b-he-dem-bo-sung',
    description: 'CHƯƠNG BÙ do cuongthai.com dựng vì kế hoạch 60 buổi bỏ hẳn Cisco Module 5: hệ nhị phân và bảng vị trí 128-64-32-16-8-4-2-1, chuyển đổi 8 bit cả hai chiều, miền 0–255 của một octet, hệ thập lục phân với MAC và IPv6, và phép AND theo bit — nền bắt buộc cho buổi 30–33 (chia subnet và VLSM). Mọi phép tính đã kiểm bằng python3.',
    lessons: [L1, L2, L3, QUIZ],
  },
];
