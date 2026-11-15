/** 1.4 — Thao tác bit. Mọi mã/output đọc từ ../ma/ch01/bit-* và Bit*.java (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, gap, lienKet, baiNay } from '../_chung.mjs';
import { vetXor } from '../ma/ch01/bit-single.vet.mjs';
import { vetKernighan } from '../ma/ch01/bit-kernighan.vet.mjs';
import { vetTapCon } from '../ma/ch01/bit-tap-con.vet.mjs';

const NUMS = [5, 9, 3, 9, 5];
const vx = vetXor(NUMS);
const BANG_XOR = bangVet(['i', 'nums', 'x = nums[i]', 'acc (before)', 'acc ^ x (after)'],
  vx.map((h, k) => [
    String(h.i),
    oMang(NUMS, { to: { [h.i]: k === vx.length - 1 ? 'ok' : 'l' } }),
    `<code>${h.bx}</code> = ${h.x}`,
    `<code>${h.btruoc}</code> = ${h.truoc}`,
    k === vx.length - 1 ? `<strong><code>${h.bsau}</code> = ${h.sau}</strong> ✅` : `<code>${h.bsau}</code> = ${h.sau}`,
  ]));

const vk = vetKernighan(52);
const BANG_K = bangVet(['step', 'n', 'n − 1', 'n &amp; (n − 1)', '1-bits counted'],
  vk.map((h) => [String(h.buoc), `<code>${h.bn}</code> = ${h.n}`, `<code>${h.bn1}</code> = ${h.n1}`, `<code>${h.bm}</code> = ${h.m}`, String(h.buoc)]));

const vm = vetTapCon([1, 2, 3]);
const BANG_MASK = bangVet(['mask', 'binary (bit 2 · 1 · 0)', 'i with bit i = 1', 'subset'],
  vm.map((h) => [String(h.mask), `<code>${h.bin}</code>`, h.chon.length ? h.chon.join(', ') : '—', `[${h.tap.join(', ')}]`]));

const DE = [
  [lc(136, 'single-number', 'Single Number', 'Easy'), 'Everything appears twice except one, O(1) memory ⇒ XOR everything.', 'Mọi số xuất hiện hai lần trừ một, bộ nhớ O(1) ⇒ XOR tất cả.'],
  [lc(191, 'number-of-1-bits', 'Number of 1 Bits', 'Easy'), 'n &amp; (n − 1) drops one 1-bit per loop (Kernighan).', 'n &amp; (n − 1) xoá một bit 1 mỗi vòng (Kernighan).'],
  [lc(231, 'power-of-two', 'Power of Two', 'Easy'), 'Exactly one 1-bit ⇒ n &gt; 0 and n &amp; (n − 1) is 0. Do not forget n ≤ 0.', 'Đúng một bit 1 ⇒ n &gt; 0 và n &amp; (n − 1) bằng 0. Đừng quên n ≤ 0.'],
  [lc(338, 'counting-bits', 'Counting Bits', 'Easy'), 'Answers for 0..n: reuse ans[i &gt;&gt; 1] — a first taste of DP.', 'Đáp án cho 0..n: dùng lại ans[i &gt;&gt; 1] — nếm thử quy hoạch động.'],
  [lc(268, 'missing-number', 'Missing Number', 'Easy'), 'XOR indices with values; or the sum formula (watch int overflow in Java).', 'XOR chỉ số với giá trị; hoặc công thức tổng (coi chừng tràn int trong Java).'],
  [lc(190, 'reverse-bits', 'Reverse Bits', 'Easy'), '32 rounds of "take the last bit, push it in from the right"; Java needs &gt;&gt;&gt;.', '32 vòng "lấy bit cuối, đẩy vào từ bên phải"; Java phải dùng &gt;&gt;&gt;.'],
  [lc(78, 'subsets', 'Subsets', 'Medium'), 'n ≤ 10 ⇒ every mask 0..2ⁿ − 1 is one subset.', 'n ≤ 10 ⇒ mỗi mask 0..2ⁿ − 1 là một tập con.'],
  [lc(137, 'single-number-ii', 'Single Number II', 'Medium'), 'Everything appears three times: count each of the 32 bit positions mod 3.', 'Mọi số xuất hiện ba lần: đếm từng vị trí bit (32 vị trí) theo mod 3.'],
  [lc(260, 'single-number-iii', 'Single Number III', 'Medium'), 'XOR all gives a ^ b; its lowest 1-bit (x &amp; −x) splits the numbers into two groups.', 'XOR tất cả được a ^ b; bit 1 thấp nhất của nó (x &amp; −x) chia các số làm hai nhóm.'],
  [lc(371, 'sum-of-two-integers', 'Sum of Two Integers', 'Medium'), 'Add without +: XOR is the sum without carries, AND shifted left is the carry.', 'Cộng không dùng +: XOR là tổng chưa nhớ, AND dịch trái là phần nhớ.'],
];

export default {
  title: '1.4 — Bit manipulation: XOR, n & (n − 1) and bitmasks|||1.4 — Thao tác bit: XOR, n & (n − 1) và bitmask',
  slug: 'dsa-1-5-bit',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Sáu toán tử bit và bù hai, XOR giải Single Number với bộ nhớ O(1), n & (n − 1) đếm bit và kiểm luỹ thừa 2, bitmask liệt kê tập con — kèm bẫy 32-bit của JavaScript chạy thật và chỗ repo này dùng bit thật (chmod, CIDR, OTP, TOTP).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Bit manipulation: XOR, n &amp; (n − 1) and bitmasks</h2>
<p class="lead">Bit problems are a small, very predictable corner of the interview: maybe one question in fifteen, but when it comes, the candidate who knows three one-line tricks solves it in five minutes and the one who does not stares at it for twenty. This lesson gives you those tricks — XOR cancellation, <code>n &amp; (n − 1)</code>, and the bitmask as a set — together with the traps that make correct-looking JavaScript and Java code silently wrong, and the places where this very website uses bits in production.</p>

<h3>The everyday picture: a row of light switches</h3>
<p>Picture the switch panel by the door of a classroom: eight switches in a row, each one either down (off, 0) or up (on, 1). The whole panel can be described by one number: read the switches left to right as a binary number. "Lights 3 and 1 on, the rest off" is <code>00001010</code> = 10. Now the operations make physical sense. <strong>AND</strong> with a pattern asks "which of <em>these</em> lights are on?". <strong>OR</strong> with a pattern turns lights on without touching the others. <strong>XOR</strong> with a pattern <em>flips</em> those switches — and flipping the same switch twice puts it back where it was. That last sentence is the whole of the most famous bit problem.</p>
<p>Formally, an integer is stored as a fixed number of <strong>bits</strong> (binary digits). In Java an <code>int</code> is 32 bits and a <code>long</code> 64; in JavaScript a <code>number</code> is a 64-bit floating-point value, but <strong>every bitwise operator first converts it to a 32-bit signed integer</strong> — remember that sentence, it causes the traps later. Bit 0 is the rightmost (worth 1), bit k is worth 2ᵏ.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Thao tác bit: XOR, n &amp; (n − 1) và bitmask</h2>
<p class="lead">Đề về bit là một góc nhỏ và rất dễ đoán của vòng phỏng vấn: có lẽ cứ mười lăm câu thì có một, nhưng khi nó tới, người biết ba mẹo một dòng giải trong năm phút, còn người không biết thì ngồi nhìn hai mươi phút. Bài này trao cho bạn đúng mấy mẹo đó — XOR triệt tiêu, <code>n &amp; (n − 1)</code>, và bitmask dùng như một tập hợp — kèm những cái bẫy làm code JavaScript và Java trông đúng mà sai lặng lẽ, và những chỗ chính trang web này đang dùng bit ở production.</p>

<h3>Hình dung đời thường: một dãy công tắc đèn</h3>
<p>Hãy hình dung bảng công tắc cạnh cửa phòng học: tám công tắc xếp thành hàng, mỗi cái hoặc gạt xuống (tắt, 0) hoặc gạt lên (bật, 1). Cả bảng mô tả được bằng đúng một con số: đọc các công tắc từ trái sang phải như một số nhị phân. "Đèn 3 và đèn 1 bật, còn lại tắt" là <code>00001010</code> = 10. Giờ các phép toán có nghĩa vật lý hẳn hoi. <strong>AND</strong> với một mẫu là hỏi "trong <em>mấy</em> đèn này, đèn nào đang bật?". <strong>OR</strong> với một mẫu là bật thêm mấy đèn đó mà không đụng tới đèn khác. <strong>XOR</strong> với một mẫu là <em>gạt ngược</em> mấy công tắc đó — và gạt cùng một công tắc hai lần thì nó về đúng chỗ cũ. Câu cuối cùng này chính là toàn bộ lời giải của đề bit nổi tiếng nhất.</p>
<p>Nói cho chuẩn: một số nguyên được lưu bằng một số cố định <strong>bit</strong> (binary digit — chữ số nhị phân). Trong Java, <code>int</code> có 32 bit và <code>long</code> có 64 bit; trong JavaScript, <code>number</code> là số thực dấu phẩy động 64 bit, nhưng <strong>mọi toán tử bit đều đổi nó về số nguyên 32 bit CÓ DẤU trước khi tính</strong> — hãy nhớ câu này, nó là gốc của các cái bẫy phía sau. Bit 0 là bit ngoài cùng bên phải (giá trị 1), bit k có giá trị 2ᵏ.</p>
${csd('csd201-slide-cs9-2', 'vi', '⭐ CS.9 — Thao tác bit trong phỏng vấn', '<p>Phần ⭐ Chuyên sâu của CSD201 đã giới thiệu các toán tử bit và vài mẹo kinh điển trên slide. Ôn nhanh một câu: AND giữ bit chung, OR gộp bit, XOR giữ bit khác nhau, dịch trái nhân 2, dịch phải chia 2. <strong>Ở đây đi sâu thêm:</strong> nhận ra lúc nào đề "muốn" bit, chứng minh vì sao mẹo đúng bằng bảng vết chạy thật, bẫy 32-bit có dấu của JavaScript/Java chạy thật, và bit nằm ở đâu trong code production của repo này.</p>')}
</div>

<div class="ml-en">
<h3>The operators, on real numbers</h3>
<p>Run them once on two small numbers and read the bits column by column. Each line of the program is commented with the rule; the output is printed in 8-bit binary so you can check every column by eye.</p>
</div>
<div class="ml-vi">
<h3>Các toán tử, chạy trên số thật</h3>
<p>Chạy chúng một lần trên hai số nhỏ rồi đọc từng cột bit. Mỗi dòng chương trình có chú thích luật của nó; output in dạng nhị phân 8 bit để bạn soát từng cột bằng mắt.</p>
</div>
${maHai('ch01/bit-co-ban.ts', 'ch01/BitCoBan.java', { vung: 'toan-tu' })}
${ketQua('ch01/bit-co-ban.ts')}
<div class="ml-en">
<div class="kv-grid">
  <div class="kv"><span class="k">a &amp; b (AND)</span><span class="v">1 only where both bits are 1: 1100 &amp; 1010 = 1000 = 8. Use it to <em>test</em> or <em>keep</em> bits.</span></div>
  <div class="kv"><span class="k">a | b (OR)</span><span class="v">1 where at least one bit is 1: 1110 = 14. Use it to <em>set</em> bits.</span></div>
  <div class="kv"><span class="k">a ^ b (XOR, exclusive or)</span><span class="v">1 where the bits differ: 0110 = 6. Use it to <em>flip</em> bits and to cancel pairs.</span></div>
  <div class="kv"><span class="k">~a (NOT)</span><span class="v">Flips every bit. In two's complement ~a = −a − 1, so ~12 = −13.</span></div>
  <div class="kv"><span class="k">a &lt;&lt; k (left shift)</span><span class="v">Moves bits left, zeros come in on the right: multiply by 2ᵏ (12 &lt;&lt; 2 = 48) — until bits fall off the top.</span></div>
  <div class="kv"><span class="k">a &gt;&gt; k / a &gt;&gt;&gt; k (right shift)</span><span class="v"><code>&gt;&gt;</code> copies the sign bit in from the left (arithmetic shift: floor division by 2ᵏ); <code>&gt;&gt;&gt;</code> brings in zeros (logical shift: treats the bits as unsigned).</span></div>
</div>
</div>
<div class="ml-vi">
<div class="kv-grid">
  <div class="kv"><span class="k">a &amp; b (AND — "và")</span><span class="v">Ra 1 chỉ khi cả hai bit đều là 1: 1100 &amp; 1010 = 1000 = 8. Dùng để <em>kiểm</em> hoặc <em>giữ lại</em> một số bit.</span></div>
  <div class="kv"><span class="k">a | b (OR — "hoặc")</span><span class="v">Ra 1 khi ít nhất một bit là 1: 1110 = 14. Dùng để <em>bật</em> bit.</span></div>
  <div class="kv"><span class="k">a ^ b (XOR — "hoặc loại trừ")</span><span class="v">Ra 1 khi hai bit KHÁC nhau: 0110 = 6. Dùng để <em>lật</em> bit và để triệt tiêu từng cặp.</span></div>
  <div class="kv"><span class="k">~a (NOT — "phủ định")</span><span class="v">Lật mọi bit. Với bù hai thì ~a = −a − 1, nên ~12 = −13.</span></div>
  <div class="kv"><span class="k">a &lt;&lt; k (dịch trái)</span><span class="v">Đẩy các bit sang trái, số 0 chui vào bên phải: nhân 2ᵏ (12 &lt;&lt; 2 = 48) — cho tới khi bit rơi khỏi đầu bên trái.</span></div>
  <div class="kv"><span class="k">a &gt;&gt; k / a &gt;&gt;&gt; k (dịch phải)</span><span class="v"><code>&gt;&gt;</code> chép bit dấu vào từ bên trái (dịch số học — arithmetic shift: chia lấy phần nguyên dưới cho 2ᵏ); <code>&gt;&gt;&gt;</code> đưa số 0 vào (dịch logic — logical shift: coi các bit là số KHÔNG dấu).</span></div>
</div>
</div>

<div class="ml-en">
<h3>Negative numbers: two's complement in one paragraph</h3>
<p>How do 32 switches store −12? Not with a "minus switch" in front of 12. The rule used by every modern CPU, and by Java and JavaScript, is <strong>two's complement</strong>: to get −x, flip all the bits of x and add 1. That makes the leftmost bit the <strong>sign bit</strong> (1 = negative), makes −1 "all ones", and lets the hardware add negative and positive numbers with one ordinary adder. Read the second block of output: 12 is <code>…00001100</code>, −12 is <code>…11110100</code>. Two consequences you must know by heart: <code>-7 &gt;&gt; 1</code> is <strong>−4</strong> (floor of −3.5, because the sign bit is copied in), while Java's integer division <code>-7 / 2</code> is <strong>−3</strong> (it truncates toward zero) — so "shift right = divide by 2" is only true for non-negative numbers. And <code>-1 &gt;&gt;&gt; 28</code> is 15: the unsigned shift brought zeros in, so only the last four ones remain.</p>
</div>
<div class="ml-vi">
<h3>Số âm: bù hai trong một đoạn</h3>
<p>32 công tắc lưu −12 kiểu gì? Không phải bằng một "công tắc dấu trừ" đặt trước số 12. Luật mà mọi CPU hiện đại — và cả Java lẫn JavaScript — dùng là <strong>two's complement (bù hai)</strong>: muốn có −x thì lật mọi bit của x rồi cộng 1. Nhờ vậy bit ngoài cùng bên trái thành <strong>bit dấu</strong> (sign bit: 1 = âm), −1 là "toàn số 1", và phần cứng cộng số âm với số dương bằng đúng một mạch cộng bình thường. Đọc khối output thứ hai: 12 là <code>…00001100</code>, −12 là <code>…11110100</code>. Hai hệ quả phải thuộc lòng: <code>-7 &gt;&gt; 1</code> ra <strong>−4</strong> (làm tròn xuống của −3,5, vì bit dấu được chép vào), trong khi phép chia nguyên của Java <code>-7 / 2</code> ra <strong>−3</strong> (cắt phần lẻ về phía 0) — nên câu "dịch phải = chia 2" chỉ đúng với số không âm. Và <code>-1 &gt;&gt;&gt; 28</code> ra 15: phép dịch không dấu đưa số 0 vào, nên chỉ còn lại bốn số 1 cuối.</p>
</div>
${maHai('ch01/bit-co-ban.ts', 'ch01/BitCoBan.java', { vung: 'am' })}

<div class="ml-en">
<h3>Six one-liners worth memorising</h3>
<p>Almost every bit trick in interviews is a combination of these. The number 52 is <code>00110100</code>; check each result against the output below.</p>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">read bit k</span><span class="lz-d">(x &gt;&gt; k) &amp; 1 — or x &amp; (1 &lt;&lt; k) != 0. x &amp; 1 is "is x odd?"</span></div>
  <div class="lz-node"><span class="lz-t">set bit k</span><span class="lz-d">x | (1 &lt;&lt; k) — turn the switch on, leave the others</span></div>
  <div class="lz-node"><span class="lz-t">clear bit k</span><span class="lz-d">x &amp; ~(1 &lt;&lt; k) — a mask with a single 0 at position k</span></div>
  <div class="lz-node"><span class="lz-t">toggle bit k</span><span class="lz-d">x ^ (1 &lt;&lt; k) — flip one switch</span></div>
  <div class="lz-node"><span class="lz-t">drop the lowest 1-bit</span><span class="lz-d">x &amp; (x − 1) — counting bits, power of two</span></div>
  <div class="lz-node"><span class="lz-t">keep only the lowest 1-bit</span><span class="lz-d">x &amp; −x — splitting groups (LC 260), Fenwick trees</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Sáu câu một dòng đáng thuộc</h3>
<p>Gần như mọi mẹo bit khi phỏng vấn đều là tổ hợp của mấy câu này. Số 52 là <code>00110100</code>; soát từng kết quả với output bên dưới.</p>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">đọc bit k</span><span class="lz-d">(x &gt;&gt; k) &amp; 1 — hoặc x &amp; (1 &lt;&lt; k) != 0. x &amp; 1 nghĩa là "x lẻ không?"</span></div>
  <div class="lz-node"><span class="lz-t">bật bit k</span><span class="lz-d">x | (1 &lt;&lt; k) — gạt công tắc lên, không đụng cái khác</span></div>
  <div class="lz-node"><span class="lz-t">tắt bit k</span><span class="lz-d">x &amp; ~(1 &lt;&lt; k) — một mặt nạ chỉ có đúng một số 0 ở vị trí k</span></div>
  <div class="lz-node"><span class="lz-t">lật bit k</span><span class="lz-d">x ^ (1 &lt;&lt; k) — gạt ngược một công tắc</span></div>
  <div class="lz-node"><span class="lz-t">xoá bit 1 thấp nhất</span><span class="lz-d">x &amp; (x − 1) — đếm bit, kiểm luỹ thừa của 2</span></div>
  <div class="lz-node"><span class="lz-t">chỉ giữ bit 1 thấp nhất</span><span class="lz-d">x &amp; −x — chia nhóm (LC 260), cây Fenwick</span></div>
</div>
</div>
${maHai('ch01/bit-co-ban.ts', 'ch01/BitCoBan.java', { vung: 'meo' })}
${ketQua('ch01/BitCoBan.java')}

<div class="ml-en">
<h3>Signals: when the problem wants bits</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"every element appears twice except one"</span><span class="v">Pairs that should cancel ⇒ XOR. Three times instead of twice ⇒ count bits mod 3.</span></div>
  <div class="kv"><span class="k">"O(1) extra space" next to a counting problem</span><span class="v">The hash map from Lesson 1.1 is forbidden; an int holding 32 facts is not.</span></div>
  <div class="kv"><span class="k">"number of 1 bits", "power of two", "reverse bits", "binary representation"</span><span class="v">The problem says "bits" out loud. n &amp; (n − 1), shifts, masks.</span></div>
  <div class="kv"><span class="k">n ≤ 20 and "all subsets / every combination of choices"</span><span class="v">2²⁰ ≈ 10⁶ masks fit easily (Lesson 0.1's table): loop over masks.</span></div>
  <div class="kv"><span class="k">"without using + / * / division"</span><span class="v">The interviewer wants you to build arithmetic from XOR, AND and shifts (LC 371).</span></div>
  <div class="kv"><span class="k">a small set of on/off properties per item</span><span class="v">Permissions, flags, "which letters does this word contain" (26 bits) — a mask replaces a Set.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: khi nào đề "muốn" bit</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"mọi phần tử xuất hiện hai lần, trừ một phần tử"</span><span class="v">Những cặp phải triệt tiêu nhau ⇒ XOR. Ba lần thay vì hai ⇒ đếm từng bit theo mod 3.</span></div>
  <div class="kv"><span class="k">"bộ nhớ phụ O(1)" đi kèm một đề đếm</span><span class="v">Cấm dùng hash map của bài 1.1; nhưng một số int chứa được 32 sự thật thì không bị cấm.</span></div>
  <div class="kv"><span class="k">"số bit 1", "luỹ thừa của 2", "đảo bit", "biểu diễn nhị phân"</span><span class="v">Đề nói thẳng chữ "bit". Dùng n &amp; (n − 1), phép dịch, mặt nạ.</span></div>
  <div class="kv"><span class="k">n ≤ 20 và "mọi tập con / mọi cách chọn"</span><span class="v">2²⁰ ≈ 10⁶ mask chạy thoải mái (bảng ở bài 0.1): lặp qua các mask.</span></div>
  <div class="kv"><span class="k">"không được dùng + / * / phép chia"</span><span class="v">Người phỏng vấn muốn bạn dựng phép toán từ XOR, AND và phép dịch (LC 371).</span></div>
  <div class="kv"><span class="k">mỗi phần tử có vài tính chất bật/tắt</span><span class="v">Quyền truy cập, cờ tính năng, "từ này chứa những chữ cái nào" (26 bit) — một mask thay cho một Set.</span></div>
</div>
</div>

<div class="ml-en">
<h3>Worked example: Single Number (LC 136)</h3>
<p><strong>Problem (in our words).</strong> Every value in a non-empty integer array appears exactly twice, except one value that appears once. Return that value. The follow-up the interviewer will ask: linear time <em>and</em> constant extra memory. Example: <code>[5, 9, 3, 9, 5]</code> → 3.</p>
<p><strong>Step 1 — the honest first answers.</strong> (a) Count with a hash map (Lesson 1.1), return the key with count 1: O(n) time, but O(n) memory. (b) Sort, then the pairs sit side by side; walk in steps of two and return the first element whose neighbour differs: O(n log n) time, O(1) memory if you may sort in place. Say both. They are correct, and they show you know the trade-off the follow-up is about.</p>
<p><strong>Step 2 — what are we wasting?</strong> The map remembers <em>every</em> value, but we only need to know which value is left unpaired. Is there an operation that "forgets" a value when it sees it the second time? On the switch panel: flipping the same switches twice puts them back. In algebra, XOR has exactly the properties we need:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">x ^ x = 0</span><span class="lz-d">A value meets itself and disappears.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">x ^ 0 = x</span><span class="lz-d">Zero is the neutral starting point.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">order does not matter</span><span class="lz-d">XOR is commutative and associative, so 5 ^ 9 ^ 3 ^ 9 ^ 5 = (5 ^ 5) ^ (9 ^ 9) ^ 3 = 0 ^ 0 ^ 3 = 3, even though the pairs are not next to each other.</span></div>
</div>
<p><strong>Step 3 — the solution</strong> is one line in a loop: start with 0, XOR every element in. All three versions, in both languages:</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Single Number (LC 136)</h3>
<p><strong>Đề (diễn đạt lại).</strong> Trong một mảng số nguyên khác rỗng, mỗi giá trị xuất hiện đúng hai lần, trừ một giá trị xuất hiện một lần. Trả về giá trị đó. Câu hỏi nối tiếp người phỏng vấn chắc chắn sẽ hỏi: thời gian tuyến tính <em>và</em> bộ nhớ phụ hằng số. Ví dụ: <code>[5, 9, 3, 9, 5]</code> → 3.</p>
<p><strong>Bước 1 — những câu trả lời đầu tiên, thật thà.</strong> (a) Đếm bằng hash map (bài 1.1), trả về khoá có số đếm 1: thời gian O(n), nhưng bộ nhớ O(n). (b) Sắp xếp, khi đó các cặp nằm cạnh nhau; đi từng bước hai ô và trả về phần tử đầu tiên mà hàng xóm của nó khác nó: thời gian O(n log n), bộ nhớ O(1) nếu được sắp xếp tại chỗ. Nói ra cả hai. Chúng đúng, và chúng cho thấy bạn hiểu đúng cái đánh đổi mà câu hỏi nối tiếp nhắm vào.</p>
<p><strong>Bước 2 — ta đang phí cái gì?</strong> Cái map nhớ <em>mọi</em> giá trị, trong khi ta chỉ cần biết giá trị nào còn lẻ loi. Có phép toán nào "quên" một giá trị khi gặp nó lần thứ hai không? Trên bảng công tắc: gạt cùng mấy công tắc hai lần thì chúng về chỗ cũ. Về đại số, XOR có đúng những tính chất ta cần:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">x ^ x = 0</span><span class="lz-d">Một giá trị gặp chính nó thì biến mất.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">x ^ 0 = x</span><span class="lz-d">Số 0 là điểm xuất phát trung tính.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">thứ tự không quan trọng</span><span class="lz-d">XOR có tính giao hoán và kết hợp (commutative, associative), nên 5 ^ 9 ^ 3 ^ 9 ^ 5 = (5 ^ 5) ^ (9 ^ 9) ^ 3 = 0 ^ 0 ^ 3 = 3, dù các cặp không đứng cạnh nhau.</span></div>
</div>
<p><strong>Bước 3 — lời giải</strong> là một dòng trong vòng lặp: bắt đầu từ 0, XOR lần lượt mọi phần tử vào. Cả ba phiên bản, bằng cả hai ngôn ngữ:</p>
</div>
${maHai('ch01/bit-single.ts', 'ch01/BitSingle.java', { vung: 'xor' })}
${maHai('ch01/bit-single.ts', 'ch01/BitSingle.java', { vung: 'map' })}
${maHai('ch01/bit-single.ts', 'ch01/BitSingle.java', { vung: 'sort' })}
${ketQua('ch01/bit-single.ts')}
${ketQua('ch01/BitSingle.java')}
<div class="ml-en">
<p>Three answers agree on all five inputs, including <code>[-3, 7, -3]</code>: XOR works on negative numbers too, because it never interprets the bits as a value — it only compares them column by column, and −3 has the same 32 bits both times. Two small details in the sort version: the loop jumps by two, and the check <code>i + 1 === a.length</code> handles the single element sitting alone at the very end (<code>[1]</code>, or <code>[1, 1, 2]</code>).</p>
</div>
<div class="ml-vi">
<p>Ba lời giải khớp nhau trên cả năm đầu vào, kể cả <code>[-3, 7, -3]</code>: XOR chạy đúng với số âm, vì nó không bao giờ hiểu các bit là một giá trị — nó chỉ so từng cột, và −3 có cùng 32 bit ở cả hai lần xuất hiện. Hai chi tiết nhỏ ở bản sắp xếp: vòng lặp nhảy hai ô một lần, và phép kiểm <code>i + 1 === a.length</code> xử lý trường hợp phần tử lẻ loi nằm một mình ở tận cuối (<code>[1]</code>, hoặc <code>[1, 1, 2]</code>).</p>
</div>

<div class="ml-en">
<h3>Watch it run: the accumulator, bit by bit</h3>
<p>Input <code>[5, 9, 3, 9, 5]</code>, four bits are enough (values below 16). Read the last two columns: a 1 in <code>x</code> flips the same column of <code>acc</code>. The two 9s flip columns 8 and 1 on and then off again; the two 5s do the same with columns 4 and 1. Only 3 = <code>0011</code> is never flipped back. This table was produced by running the algorithm.</p>
</div>
<div class="ml-vi">
<h3>Xem nó chạy: biến dồn, từng bit một</h3>
<p>Đầu vào <code>[5, 9, 3, 9, 5]</code>, bốn bit là đủ (giá trị dưới 16). Đọc hai cột cuối: mỗi số 1 trong <code>x</code> lật đúng cột đó của <code>acc</code>. Hai số 9 bật cột 8 và cột 1 lên rồi lại tắt đi; hai số 5 làm y vậy với cột 4 và cột 1. Chỉ có 3 = <code>0011</code> là không bao giờ bị lật lại. Bảng này sinh ra bằng cách chạy thuật toán thật.</p>
</div>
${BANG_XOR}
<div class="ml-en">
<p>Notice row 3: after <code>5, 9, 3, 9</code> the accumulator is 6, a number that is not even in the array. The intermediate values mean nothing on their own — only the final one does. That is why XOR solutions feel like magic, and why you should <em>explain the three properties</em> rather than say "XOR cancels" and hope.</p>
${moPhong('ch01/bit-single.sim.js', 'en', 'Single Number with XOR — watch the bits flip', 'Opens /algorithms with this program: the array, the bits of nums[i], and the bits of acc flipping step by step.')}
</div>
<div class="ml-vi">
<p>Để ý dòng 3: sau <code>5, 9, 3, 9</code> biến dồn bằng 6, một số thậm chí không có trong mảng. Các giá trị trung gian tự chúng không mang nghĩa gì — chỉ giá trị cuối cùng có nghĩa. Đó là lý do lời giải XOR trông như ảo thuật, và là lý do bạn nên <em>giải thích ba tính chất</em> thay vì nói "XOR triệt tiêu" rồi cầu may.</p>
${moPhong('ch01/bit-single.sim.js', 'vi', 'Single Number bằng XOR — xem các bit lật', 'Mở trang /algorithms với chương trình này: mảng, các bit của nums[i], và các bit của acc lật qua từng bước.')}
</div>

<div class="ml-en">
<h3>Complexity, said precisely</h3>
<p>XOR version: <strong>O(n) time, O(1) extra memory</strong> — one integer, whatever the size of the array. Map version: O(n) time expected, O(n) memory. Sort version: O(n log n) time; memory depends on the sort (in place for Java's <code>int[]</code>, but our TypeScript version copies the array with <code>[...nums]</code> so as not to mutate the caller's data — say that out loud if you write it this way). The XOR solution only works because of the "exactly twice" guarantee; if a value could appear three times, three XORs leave it in. That is precisely LC 137, and the fix is in the practice table: count every bit position modulo 3.</p>
</div>
<div class="ml-vi">
<h3>Độ phức tạp, nói cho chính xác</h3>
<p>Bản XOR: <strong>thời gian O(n), bộ nhớ phụ O(1)</strong> — một số nguyên, mảng to bao nhiêu cũng vậy. Bản map: O(n) thời gian kỳ vọng, O(n) bộ nhớ. Bản sắp xếp: O(n log n) thời gian; bộ nhớ tuỳ hàm sort (tại chỗ với <code>int[]</code> của Java, nhưng bản TypeScript của ta chép mảng bằng <code>[...nums]</code> để không làm đổi dữ liệu của người gọi — viết kiểu này thì hãy nói ra). Lời giải XOR chỉ đúng nhờ cam kết "đúng hai lần"; nếu một giá trị có thể xuất hiện ba lần, ba lần XOR sẽ để nó lại. Đó chính là LC 137, và cách sửa nằm trong bảng đề luyện: đếm từng vị trí bit theo mod 3.</p>
</div>

<div class="ml-en">
<h3>Trick 2 — n &amp; (n − 1): Number of 1 Bits and Power of Two</h3>
<p>What does subtracting 1 do to the bits? It finds the lowest 1, turns it into 0, and turns all the 0s below it into 1s: <code>…0100</code> − 1 = <code>…0011</code>. Everything above the lowest 1 is untouched. So when you AND the two, the lowest 1 and the zeros below it all become 0, and the rest stays: <strong>n &amp; (n − 1) is n with its lowest 1-bit removed</strong>.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">n</span><span class="lz-t">0011 0100 (52)</span><span class="lz-d">lowest 1 is bit 2</span></div>
<div class="lz-step"><span class="lz-k">n − 1</span><span class="lz-t">0011 0011 (51)</span><span class="lz-d">bit 2 → 0, bits 1 and 0 → 1, the top is unchanged</span></div>
<div class="lz-step"><span class="lz-k">AND</span><span class="lz-t">0011 0000 (48)</span><span class="lz-d">one 1-bit fewer</span></div>
</div>
<p>Two problems fall out immediately. <strong>LC 191 Number of 1 Bits</strong> (also called the population count or Hamming weight): repeat <code>n &amp;= n − 1</code> until n is 0 and count the rounds — the loop runs once per 1-bit, not once per bit (this is Brian Kernighan's method). <strong>LC 231 Power of Two</strong>: a power of two has exactly one 1-bit, so removing it must give 0 — plus the guard <code>n &gt; 0</code>, because 0 and negative numbers are not powers of two (and <code>0 &amp; −1</code> is 0, which would wrongly say yes).</p>
</div>
<div class="ml-vi">
<h3>Mẹo 2 — n &amp; (n − 1): Number of 1 Bits và Power of Two</h3>
<p>Trừ 1 làm gì với các bit? Nó tìm bit 1 thấp nhất, biến nó thành 0, và biến mọi số 0 bên dưới nó thành 1: <code>…0100</code> − 1 = <code>…0011</code>. Mọi thứ phía trên bit 1 thấp nhất giữ nguyên. Nên khi AND hai số đó lại, bit 1 thấp nhất và các số 0 bên dưới đều thành 0, phần còn lại giữ nguyên: <strong>n &amp; (n − 1) chính là n bị xoá đi bit 1 thấp nhất</strong>.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">n</span><span class="lz-t">0011 0100 (52)</span><span class="lz-d">bit 1 thấp nhất là bit 2</span></div>
<div class="lz-step"><span class="lz-k">n − 1</span><span class="lz-t">0011 0011 (51)</span><span class="lz-d">bit 2 → 0, bit 1 và bit 0 → 1, phần trên không đổi</span></div>
<div class="lz-step"><span class="lz-k">AND</span><span class="lz-t">0011 0000 (48)</span><span class="lz-d">bớt đúng một bit 1</span></div>
</div>
<p>Hai đề rơi ra ngay lập tức. <strong>LC 191 Number of 1 Bits</strong> (đếm bit 1 — còn gọi là population count hay Hamming weight, "trọng số Hamming"): lặp <code>n &amp;= n − 1</code> tới khi n bằng 0 và đếm số vòng — vòng lặp chạy một lần cho mỗi bit 1, chứ không phải một lần cho mỗi bit (đây là cách của Brian Kernighan). <strong>LC 231 Power of Two</strong> (luỹ thừa của 2): luỹ thừa của 2 có đúng một bit 1, nên xoá nó đi phải ra 0 — cộng thêm điều kiện chặn <code>n &gt; 0</code>, vì 0 và số âm không phải luỹ thừa của 2 (và <code>0 &amp; −1</code> bằng 0, sẽ trả lời "có" một cách sai lầm).</p>
</div>
${maHai('ch01/bit-dem.ts', 'ch01/BitDem.java', { vung: 'kernighan' })}
${maHai('ch01/bit-dem.ts', 'ch01/BitDem.java', { vung: 'pow2' })}
<div class="ml-en">
<p>The state of every round for n = 52, generated by running the loop:</p>
</div>
<div class="ml-vi">
<p>Trạng thái của từng vòng với n = 52, sinh ra bằng cách chạy vòng lặp thật:</p>
</div>
${BANG_K}
<div class="ml-en">
<p>Three rounds for three 1-bits. The shift-by-one version (look at bit 0, shift right, repeat) would need six rounds for 52 — one per bit up to the highest 1. The program counts both: for 2³⁰ = 1,073,741,824 Kernighan needs 1 round and the shift loop 31; for 2,147,483,647 (thirty-one 1s) both need 31. Both are O(32) = O(1) for a fixed-width integer, so in an interview the honest phrasing is "O(number of set bits), at most 32".</p>
</div>
<div class="ml-vi">
<p>Ba vòng cho ba bit 1. Bản dịch từng bit (nhìn bit 0, dịch phải, lặp lại) cần sáu vòng với 52 — mỗi bit một vòng cho tới bit 1 cao nhất. Chương trình đếm cả hai: với 2³⁰ = 1.073.741.824 Kernighan cần 1 vòng còn vòng dịch cần 31; với 2.147.483.647 (ba mươi mốt số 1) cả hai đều cần 31. Với số nguyên độ rộng cố định thì cả hai đều là O(32) = O(1), nên khi phỏng vấn cách nói thật thà là "O(số bit 1), tối đa 32".</p>
</div>
${ketQua('ch01/bit-dem.ts')}
${ketQua('ch01/BitDem.java')}

<div class="ml-en">
<h3>Variant 1 — Counting Bits (LC 338): reuse the answer you already have</h3>
<p>Return the number of 1-bits of every integer from 0 to n. Calling LC 191 n + 1 times is O(n log n) — fine, but the problem asks for O(n). Look at <code>i &gt;&gt; 1</code>: it is i with its last bit chopped off, and it is smaller than i, so its answer is already in the array. Therefore <code>ans[i] = ans[i &gt;&gt; 1] + (i &amp; 1)</code>. Example: 13 = <code>1101</code>, 13 &gt;&gt; 1 = 6 = <code>110</code> with 2 ones, plus the chopped bit 1 ⇒ 3. This "answer for i built from the answer for a smaller i" is your first taste of dynamic programming (Chapter 9). An equally valid recurrence uses trick 2: <code>ans[i] = ans[i &amp; (i − 1)] + 1</code>.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 1 — Counting Bits (LC 338): dùng lại đáp án đã có</h3>
<p>Trả về số bit 1 của mọi số nguyên từ 0 tới n. Gọi LC 191 n + 1 lần là O(n log n) — được, nhưng đề đòi O(n). Nhìn vào <code>i &gt;&gt; 1</code>: đó là i bị chặt mất bit cuối, và nó nhỏ hơn i, nên đáp án của nó đã nằm sẵn trong mảng. Vậy <code>ans[i] = ans[i &gt;&gt; 1] + (i &amp; 1)</code>. Ví dụ: 13 = <code>1101</code>, 13 &gt;&gt; 1 = 6 = <code>110</code> có 2 số 1, cộng bit vừa chặt là 1 ⇒ 3. Kiểu "đáp án của i dựng từ đáp án của một số nhỏ hơn" này là lần đầu bạn nếm quy hoạch động (dynamic programming — Chương 9). Một công thức truy hồi khác cũng đúng dùng mẹo 2: <code>ans[i] = ans[i &amp; (i − 1)] + 1</code>.</p>
</div>
${maHai('ch01/bit-dem.ts', 'ch01/BitDem.java', { vung: 'count-bits' })}
<div class="ml-en">
<p>The output above shows <code>countBits(16)</code>: the pattern 0, 1, 1, 2, 1, 2, 2, 3 repeats with +1 in every new block of powers of two, and 16 starts again at 1. Spotting that pattern on paper is how most people find the recurrence.</p>
</div>
<div class="ml-vi">
<p>Output phía trên có <code>countBits(16)</code>: dãy 0, 1, 1, 2, 1, 2, 2, 3 lặp lại và cộng thêm 1 ở mỗi khối luỹ thừa của 2 mới, rồi tới 16 thì quay về 1. Nhìn ra quy luật này trên giấy là cách phần lớn mọi người tìm được công thức truy hồi.</p>
</div>

<div class="ml-en">
<h3>Variant 2 — Missing Number (LC 268): XOR as a checklist</h3>
<p>An array of length n contains n distinct numbers from the range 0..n, so exactly one number of that range is missing. Two O(n) time, O(1) memory solutions. <strong>Sum:</strong> the full range sums to n(n + 1)/2; subtract every element; what is left is the missing number. <strong>XOR:</strong> XOR every index 0..n − 1, the extra n, and every value; each value that is present meets its equal index and cancels, so only the missing number survives. It is LC 136 again in disguise: the indices are the "second copy" of each value.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 2 — Missing Number (LC 268): XOR như một bảng điểm danh</h3>
<p>Một mảng dài n chứa n số khác nhau lấy từ khoảng 0..n, nên đúng một số trong khoảng đó bị thiếu. Có hai lời giải thời gian O(n), bộ nhớ O(1). <strong>Tổng:</strong> cả khoảng cộng lại bằng n(n + 1)/2; trừ đi từng phần tử; phần còn lại là số bị thiếu. <strong>XOR:</strong> XOR mọi chỉ số 0..n − 1, thêm n, và mọi giá trị; giá trị nào có mặt sẽ gặp đúng chỉ số bằng nó và triệt tiêu, chỉ còn số bị thiếu sống sót. Đây lại chính là LC 136 đội lốt: các chỉ số đóng vai "bản sao thứ hai" của mỗi giá trị — giống điểm danh lớp: gọi đủ danh sách, ai không đáp là người vắng.</p>
</div>
${maHai('ch01/bit-missing.ts', 'ch01/BitMissing.java', { vung: 'xor' })}
${maHai('ch01/bit-missing.ts', 'ch01/BitMissing.java', { vung: 'sum' })}
${ketQua('ch01/bit-missing.ts')}
<div class="ml-en">
<p>Why do interviewers like the XOR version when the sum is simpler? Because the sum can <strong>overflow</strong>. In TypeScript numbers are doubles, exact up to 2⁵³, so the sum is safe here. In Java <code>n * (n + 1)</code> is computed in <code>int</code>: once n passes about 46,340 the product passes 2³¹ − 1 and wraps around. The trap section below prints exactly that: for n = 100,000 the <code>int</code> formula gives 705,082,704 instead of 5,000,050,000 — no exception, just a wrong number. Our Java version casts to <code>long</code> first; the XOR version never overflows at all.</p>
</div>
<div class="ml-vi">
<p>Vì sao người phỏng vấn thích bản XOR trong khi bản tổng đơn giản hơn? Vì phép tổng có thể <strong>tràn số</strong> (overflow). Trong TypeScript số là kiểu double, chính xác tới 2⁵³, nên ở đây tổng vẫn an toàn. Trong Java, <code>n * (n + 1)</code> được tính bằng <code>int</code>: khi n vượt khoảng 46.340 thì tích vượt 2³¹ − 1 và quay vòng. Phần bẫy bên dưới in đúng chuyện đó: với n = 100.000, công thức <code>int</code> ra 705.082.704 thay vì 5.000.050.000 — không ném lỗi gì, chỉ ra một con số sai. Bản Java của ta ép sang <code>long</code> trước; còn bản XOR thì không bao giờ tràn.</p>
</div>

<div class="ml-en">
<h3>Trick 3 — a bitmask is a set: listing every subset</h3>
<p>Take n items. A subset is a yes/no decision for each item — n switches — so it is exactly an n-bit number, and the numbers 0 to 2ⁿ − 1 are exactly all the subsets. "Is item i in subset <code>mask</code>?" is <code>mask &amp; (1 &lt;&lt; i)</code>. That gives the shortest correct solution of <strong>LC 78 Subsets</strong>: loop over every mask, and for each one collect the items whose bit is on.</p>
</div>
<div class="ml-vi">
<h3>Mẹo 3 — bitmask là một tập hợp: liệt kê mọi tập con</h3>
<p>Lấy n món. Một tập con là một quyết định có/không cho từng món — n công tắc — nên nó đúng là một số n bit, và các số từ 0 tới 2ⁿ − 1 đúng là mọi tập con. "Món i có nằm trong tập con <code>mask</code> không?" chính là <code>mask &amp; (1 &lt;&lt; i)</code>. Từ đó có lời giải đúng ngắn nhất của <strong>LC 78 Subsets</strong> (mọi tập con): lặp qua mọi mask, với mỗi mask gom những món có bit đang bật.</p>
</div>
${maHai('ch01/bit-tap-con.ts', 'ch01/BitTapCon.java', { vung: 'subsets' })}
${BANG_MASK}
<div class="ml-en">
<p>Read the table from mask 5 = <code>101</code>: bits 0 and 2 are on, so it is the subset of <code>nums[0]</code> and <code>nums[2]</code> = [1, 3]. The rightmost bit belongs to <code>nums[0]</code> — people often read binary left to right and get the order backwards; when you explain it, say "bit i means item i".</p>
<p>The cost: 2ⁿ masks times n bits to test = <strong>O(2ⁿ · n)</strong>. That is why the constraint matters so much: with n = 20 there are 1,048,576 masks (the program prints it), about 2·10⁷ steps — comfortably under a second by the table in <a href="${baiNay('dsa-0-1-big-o')}">Lesson 0.1</a>; with n = 30 it is a billion masks and hopeless. When you see "n ≤ 20" in a problem about choices, think of masks. Chapter 8 (backtracking) produces the same subsets with recursion, and lets you prune branches early, which masks cannot.</p>
<p>A realistic use: you may take some of five electives worth 3, 3, 2, 4 and 1 credits and want exactly 7 credits. 32 masks, each summed: 4 ways, the first being courses 0 and 3 (3 + 4).</p>
</div>
<div class="ml-vi">
<p>Đọc bảng từ mask 5 = <code>101</code>: bit 0 và bit 2 đang bật, nên đó là tập con gồm <code>nums[0]</code> và <code>nums[2]</code> = [1, 3]. Bit ngoài cùng bên phải thuộc về <code>nums[0]</code> — người ta hay đọc số nhị phân từ trái sang phải rồi đảo ngược thứ tự; khi giải thích, hãy nói "bit i nghĩa là món i".</p>
<p>Chi phí: 2ⁿ mask nhân n bit phải kiểm = <strong>O(2ⁿ · n)</strong>. Vì vậy ràng buộc quan trọng tới thế: với n = 20 có 1.048.576 mask (chương trình in ra số này), khoảng 2·10⁷ bước — dưới một giây thoải mái theo bảng ở <a href="${baiNay('dsa-0-1-big-o')}">bài 0.1</a>; với n = 30 là một tỉ mask và hết hy vọng. Thấy "n ≤ 20" trong một đề về các cách chọn thì nghĩ ngay tới mask. Chương 8 (quay lui — backtracking) sinh ra cùng các tập con đó bằng đệ quy, và cho phép cắt nhánh sớm, điều mà mask không làm được.</p>
<p>Một ứng dụng thực tế: kỳ này bạn được chọn vài trong năm môn tự chọn có 3, 3, 2, 4 và 1 tín chỉ, và muốn đúng 7 tín chỉ. 32 mask, mỗi mask cộng lại một lần: có 4 cách, cách đầu tiên là môn 0 và môn 3 (3 + 4).</p>
</div>
${maHai('ch01/bit-tap-con.ts', 'ch01/BitTapCon.java', { vung: 'tin-chi' })}
${ketQua('ch01/bit-tap-con.ts')}
${ketQua('ch01/BitTapCon.java')}

<div class="ml-en">
<h3>The traps: 32 bits, signs, and shift counts</h3>
<div class="pitfall co-tieu-de"><p><strong>JavaScript: bitwise operators silently cut numbers to 32-bit signed integers.</strong></p><p>A <code>number</code> can hold 2³¹ or 2³² exactly, but the moment it touches <code>|</code>, <code>&amp;</code>, <code>^</code>, <code>~</code>, <code>&lt;&lt;</code> or <code>&gt;&gt;</code> it is converted to 32 bits and read back as signed. Run it:</p></div>
</div>
<div class="ml-vi">
<h3>Những cái bẫy: 32 bit, dấu, và số bước dịch</h3>
<div class="pitfall co-tieu-de"><p><strong>JavaScript: toán tử bit lặng lẽ cắt số về số nguyên 32 bit có dấu.</strong></p><p>Một <code>number</code> giữ được 2³¹ hay 2³² chính xác, nhưng ngay khi nó đụng vào <code>|</code>, <code>&amp;</code>, <code>^</code>, <code>~</code>, <code>&lt;&lt;</code> hay <code>&gt;&gt;</code>, nó bị đổi về 32 bit rồi đọc lại như số có dấu. Chạy thử:</p></div>
</div>
${ma('ch01/bit-bay.ts', { vung: 'bay', nhan: 'TypeScript — the 32-bit conversion' })}
${ma('ch01/bit-bay.ts', { vung: 'vo-han', nhan: 'TypeScript — >> on a negative number never reaches 0' })}
${ma('ch01/bit-bay.ts', { vung: 'swap', nhan: 'TypeScript — the XOR swap and i === j' })}
${ketQua('ch01/bit-bay.ts')}
<div class="ml-en">
<ul>
<li><code>2 ** 31 | 0</code> is <strong>−2,147,483,648</strong>: 2³¹ sets exactly the sign bit. <code>(2 ** 32 + 5) | 0</code> is <strong>5</strong>: bit 32 does not exist, so it is thrown away. <code>| 0</code> is a popular "convert to integer" idiom — and it is wrong for anything outside ±2·10⁹.</li>
<li><code>1 &lt;&lt; 31</code> is negative; <code>1 &lt;&lt; 32</code> is <strong>1</strong>, not 2³², because the shift count is taken modulo 32. So <code>1 &lt;&lt; n</code> for n ≥ 31 is never what you want: use <code>2 ** n</code> in JavaScript, <code>1L &lt;&lt; n</code> in Java.</li>
<li><code>(2 ** 32 + 4) &gt;&gt; 1</code> is 2, not 2,147,483,650: "shift right to halve" breaks for large numbers in JavaScript. Use <code>Math.floor(x / 2)</code> when values can exceed 2³¹.</li>
<li>Counting bits with <code>while (n !== 0) n &gt;&gt;= 1</code> on a negative number never ends: <code>&gt;&gt;</code> keeps copying the sign bit, and −1 &gt;&gt; 1 is still −1. Our demo stopped itself after 100 rounds; on LeetCode it would be "Time Limit Exceeded". With <code>&gt;&gt;&gt;=</code> zeros come in and −1 finishes after 32 rounds with 32 ones. <code>-1 &gt;&gt;&gt; 0</code> = 4,294,967,295 is the same 32 bits read as unsigned — the standard JavaScript idiom to get an unsigned value.</li>
<li>The XOR swap <code>a ^= b; b ^= a; a ^= b</code> works for two different variables, but when both refer to the same slot (<code>swap(a, i, i)</code>) the first line XORs the value with itself and it becomes 0. A temporary variable is clearer and just as fast; mention the trick only if asked.</li>
</ul>
</div>
<div class="ml-vi">
<ul>
<li><code>2 ** 31 | 0</code> ra <strong>−2.147.483.648</strong>: 2³¹ bật đúng bit dấu. <code>(2 ** 32 + 5) | 0</code> ra <strong>5</strong>: bit 32 không tồn tại nên bị vứt đi. <code>| 0</code> là thành ngữ "đổi sang số nguyên" rất phổ biến — và nó sai với mọi số nằm ngoài ±2·10⁹.</li>
<li><code>1 &lt;&lt; 31</code> ra số âm; <code>1 &lt;&lt; 32</code> ra <strong>1</strong>, không phải 2³², vì số bước dịch được lấy theo mod 32. Nên <code>1 &lt;&lt; n</code> với n ≥ 31 không bao giờ là thứ bạn muốn: dùng <code>2 ** n</code> trong JavaScript, <code>1L &lt;&lt; n</code> trong Java.</li>
<li><code>(2 ** 32 + 4) &gt;&gt; 1</code> ra 2, không phải 2.147.483.650: "dịch phải để chia đôi" hỏng với số lớn trong JavaScript. Dùng <code>Math.floor(x / 2)</code> khi giá trị có thể vượt 2³¹.</li>
<li>Đếm bit bằng <code>while (n !== 0) n &gt;&gt;= 1</code> trên một số âm thì không bao giờ dừng: <code>&gt;&gt;</code> cứ chép bit dấu vào mãi, và −1 &gt;&gt; 1 vẫn là −1. Bản demo của ta tự dừng sau 100 vòng; trên LeetCode nó sẽ thành "Time Limit Exceeded" (quá thời gian). Dùng <code>&gt;&gt;&gt;=</code> thì số 0 chui vào và −1 kết thúc sau 32 vòng với 32 bit 1. <code>-1 &gt;&gt;&gt; 0</code> = 4.294.967.295 là cùng 32 bit đó đọc như số không dấu — thành ngữ chuẩn của JavaScript để lấy giá trị không dấu.</li>
<li>Mẹo hoán đổi bằng XOR <code>a ^= b; b ^= a; a ^= b</code> đúng với hai biến khác nhau, nhưng khi cả hai cùng trỏ vào một ô (<code>swap(a, i, i)</code>) thì dòng đầu XOR giá trị với chính nó và nó thành 0. Một biến tạm rõ ràng hơn mà nhanh y vậy; chỉ nhắc tới mẹo này khi được hỏi.</li>
</ul>
</div>
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Java: the same 32 bits, plus overflow that never throws.</strong></p><p>Java's <code>int</code> behaves like JavaScript's bitwise world: <code>1 &lt;&lt; 32</code> is 1, <code>1L &lt;&lt; 32</code> is 4,294,967,296 (a <code>long</code> shifts modulo 64). LeetCode's Java signature for LC 191 and LC 190 passes the bits in a <em>signed</em> <code>int</code>, so an input with the top bit set arrives as a negative number — use <code>&gt;&gt;&gt;</code>, or simply <code>Integer.bitCount(n)</code> (interviewers usually want the loop, but naming the library call earns credit).</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Java: cũng 32 bit đó, cộng thêm tràn số không bao giờ ném lỗi.</strong></p><p><code>int</code> của Java cư xử giống thế giới bit của JavaScript: <code>1 &lt;&lt; 32</code> ra 1, <code>1L &lt;&lt; 32</code> ra 4.294.967.296 (<code>long</code> dịch theo mod 64). Chữ ký hàm Java của LeetCode cho LC 191 và LC 190 truyền các bit vào một <code>int</code> <em>có dấu</em>, nên đầu vào có bit cao nhất bật sẽ tới tay bạn như một số âm — hãy dùng <code>&gt;&gt;&gt;</code>, hoặc đơn giản là <code>Integer.bitCount(n)</code> (người phỏng vấn thường muốn bạn viết vòng lặp, nhưng gọi đúng tên hàm thư viện vẫn được điểm).</p></div>
</div>
${ma('ch01/BitBay.java', { vung: 'bay', nhan: 'Java' })}
${ma('ch01/BitBay.java', { vung: 'lc191', nhan: 'Java — LC 191 with >> (wrong) and >>> (right)' })}
${ketQua('ch01/BitBay.java')}

<div class="ml-en">
<h3>Where bits live in real systems — including this repository</h3>
<ul>
<li><strong>Unix file permissions are a 9-bit mask.</strong> Owner, group and others each get three bits: read = 4, write = 2, execute = 1. <code>chmod 755</code> is octal for <code>111 101 101</code> = <code>rwxr-xr-x</code>. This website's local storage driver creates folders with <code>fs.mkdir(path.dirname(fullPath), { recursive: true, mode: 0o777 })</code> in <code>src/storage/StorageProvider.ts</code> — and the folder does <em>not</em> end up world-writable, because the operating system ANDs the requested mode with the complement of the process <strong>umask</strong> (usually <code>022</code>): <code>0o777 &amp; ~0o022 = 0o755</code>. "Clear the write bit for group and others" is trick "clear bit k", done by the kernel.</li>
<li><strong>Feature flags and permission sets.</strong> A user's options packed into one integer: turn on with <code>|=</code>, test with <code>&amp;</code>, turn off with <code>&amp;= ~</code>, toggle with <code>^=</code>. Databases and network protocols store them this way because one integer column is cheaper than many boolean ones.</li>
<li><strong>IP allow-lists: <code>src/utils/cidr.ts</code>.</strong> <code>isIpInCidr</code> decides whether a request really comes from VNPay’s servers (<code>src/middleware/vnpayIpnGuard.ts</code> calls it through <code>isIpInAnyCidr</code> before a payment notification is accepted). An address in <code>203.113.0.0/16</code> means "the first 16 bits match": build a mask of 16 ones with <code>(~0 &lt;&lt; (32 - bits)) &gt;&gt;&gt; 0</code>, AND it with the address, compare with the network. The file's own comment warns that without <code>&gt;&gt;&gt; 0</code> the AND returns a <em>signed</em> number and the comparison fails for every address in the upper half of the range. Our program reproduces it with 203.113.10.5: <code>ip &amp; mask</code> is −881,786,880, the network is 3,413,180,416, and <code>===</code> says false; after <code>&gt;&gt;&gt; 0</code> it says true.</li>
<li><strong>One-time codes.</strong> <code>src/services/mfa/totp.ts</code> implements the TOTP algorithm behind authenticator apps (RFC 4226 "dynamic truncation"): <code>h[h.length - 1] &amp; 0x0f</code> picks an offset from the last 4 bits of an HMAC, and <code>&amp; 0x7f</code> clears the sign bit so the 31-bit result is positive before taking <code>% 10 ** digits</code>.</li>
<li><strong>Checksums.</strong> <code>crc16</code> in <code>src/services/bankTransfer.service.ts</code> computes the CRC of a VietQR payment code with <code>^ 0x1021</code> and <code>&amp; 0xffff</code> — if one bit of the string changes, every banking app rejects the QR.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Bit sống ở đâu trong hệ thống thật — kể cả repo này</h3>
<ul>
<li><strong>Quyền tệp Unix là một mặt nạ 9 bit.</strong> Chủ sở hữu (owner), nhóm (group) và người khác (others) mỗi bên có ba bit: đọc = 4, ghi = 2, thực thi = 1. <code>chmod 755</code> là cách viết hệ bát phân (octal) của <code>111 101 101</code> = <code>rwxr-xr-x</code>. Bộ lưu trữ cục bộ của chính trang web này tạo thư mục bằng <code>fs.mkdir(path.dirname(fullPath), { recursive: true, mode: 0o777 })</code> trong <code>src/storage/StorageProvider.ts</code> — và thư mục đó KHÔNG thành ai-cũng-ghi-được, vì hệ điều hành AND quyền được xin với phần bù của <strong>umask</strong> của tiến trình (thường là <code>022</code>): <code>0o777 &amp; ~0o022 = 0o755</code>. "Tắt bit ghi của nhóm và người khác" chính là mẹo "tắt bit k", do nhân hệ điều hành làm hộ.</li>
<li><strong>Cờ tính năng (feature flags) và tập quyền.</strong> Các tuỳ chọn của một người dùng gói vào một số nguyên: bật bằng <code>|=</code>, kiểm bằng <code>&amp;</code>, tắt bằng <code>&amp;= ~</code>, lật bằng <code>^=</code>. CSDL và giao thức mạng lưu kiểu này vì một cột số nguyên rẻ hơn nhiều cột boolean.</li>
<li><strong>Danh sách IP được phép: <code>src/utils/cidr.ts</code>.</strong> <code>isIpInCidr</code> quyết định một request có thật sự đến từ máy chủ VNPay không (<code>src/middleware/vnpayIpnGuard.ts</code> gọi nó qua <code>isIpInAnyCidr</code> trước khi chấp nhận một thông báo thanh toán — IPN). Một địa chỉ thuộc <code>203.113.0.0/16</code> nghĩa là "16 bit đầu trùng khớp": dựng mặt nạ 16 số 1 bằng <code>(~0 &lt;&lt; (32 - bits)) &gt;&gt;&gt; 0</code>, AND nó với địa chỉ, rồi so với địa chỉ mạng. Chính chú thích trong tệp đó cảnh báo: thiếu <code>&gt;&gt;&gt; 0</code> thì phép AND trả về số <em>có dấu</em> và phép so sai với mọi địa chỉ ở nửa trên của dải. Chương trình của ta tái hiện điều đó với 203.113.10.5: <code>ip &amp; mask</code> ra −881.786.880, địa chỉ mạng là 3.413.180.416, và <code>===</code> nói false; sau <code>&gt;&gt;&gt; 0</code> thì nói true.</li>
<li><strong>Mã dùng một lần.</strong> <code>src/services/mfa/totp.ts</code> cài thuật toán TOTP đứng sau các app xác thực (bước "cắt động" — dynamic truncation — của RFC 4226): <code>h[h.length - 1] &amp; 0x0f</code> lấy vị trí bắt đầu từ 4 bit cuối của chuỗi HMAC, còn <code>&amp; 0x7f</code> xoá bit dấu để kết quả 31 bit là số dương trước khi lấy <code>% 10 ** digits</code>.</li>
<li><strong>Mã kiểm tra (checksum).</strong> <code>crc16</code> trong <code>src/services/bankTransfer.service.ts</code> tính CRC của mã thanh toán VietQR bằng <code>^ 0x1021</code> và <code>&amp; 0xffff</code> — đổi một bit trong chuỗi là mọi app ngân hàng từ chối mã QR.</li>
</ul>
${lienKet({ khoa: 'linux-bash', bai: 'lnx-4-2-chmod-chown-umask', title: 'Linux 4.2 — chmod, chown và umask', sub: 'Gõ thật chmod 755 / umask 022 trên terminal và đọc lại quyền bằng ls -l', cta: 'Đọc bài' })}
</div>
${ma('ch01/bit-quyen.ts', { vung: 'quyen', nhan: 'TypeScript — permissions and umask' })}
${ma('ch01/bit-quyen.ts', { vung: 'co', nhan: 'TypeScript — feature flags' })}
${ma('ch01/bit-quyen.ts', { vung: 'cidr', nhan: 'TypeScript — the CIDR check, with and without >>> 0' })}
${ketQua('ch01/bit-quyen.ts')}

<div class="ml-en">
<h3>🕵️ The attacker's view: timing attacks, and a sign bit in a payment guard</h3>
<p><strong>Comparing secrets.</strong> <code>a === b</code> on two strings stops at the first character that differs. If an attacker can measure how long your server takes to reject a guess, a guess with the right first digit takes slightly longer than one with the wrong first digit — so they can recover a secret one character at a time instead of trying all 10⁶ six-digit codes. This is a <strong>timing attack</strong>. The defence in <code>src/services/otp.service.ts</code> is a bit trick: <code>constantTimeEqual</code> ORs together the XOR of every pair of characters (<code>result |= a.charCodeAt(i) ^ b.charCodeAt(i)</code>). XOR is 0 only for equal characters, the OR remembers any difference, and the loop always runs to the end. The program below counts the work instead of the nanoseconds (real timings are too noisy to print reliably): the naive comparison costs 1, 2, 3, 4 steps for guesses that share 0, 1, 2, 3 leading digits with the secret — a leak — while the constant-time one costs 6 every time. In Node, <code>crypto.timingSafeEqual</code> does the same for buffers; use it for tokens, signatures and webhook secrets.</p>
<p><strong>A sign bit in a security check.</strong> The CIDR bug above is not cosmetic: an allow-list is an access-control decision. If the comparison is wrong, either genuine payment notifications are rejected (customers pay and the order never completes) or, with a different bug in the same few lines, forged ones are accepted. Bit code that guards money deserves tests with addresses in both halves of the range — which is exactly the kind of edge case step 6 of the framework asks for.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: tấn công thời gian, và một bit dấu trong chốt chặn thanh toán</h3>
<p><strong>So sánh bí mật.</strong> <code>a === b</code> trên hai chuỗi dừng ngay ở ký tự khác nhau đầu tiên. Nếu kẻ tấn công đo được máy chủ mất bao lâu để từ chối một lần đoán, thì lần đoán đúng chữ số đầu sẽ lâu hơn một chút so với lần đoán sai chữ số đầu — nên chúng dò ra bí mật từng ký tự một thay vì phải thử cả 10⁶ mã sáu chữ số. Đây là <strong>timing attack (tấn công đo thời gian)</strong>. Cách phòng trong <code>src/services/otp.service.ts</code> là một mẹo bit: <code>constantTimeEqual</code> OR dồn kết quả XOR của từng cặp ký tự (<code>result |= a.charCodeAt(i) ^ b.charCodeAt(i)</code>). XOR chỉ bằng 0 khi hai ký tự bằng nhau, phép OR nhớ lại bất kỳ chỗ khác nào, và vòng lặp luôn chạy hết. Chương trình bên dưới đếm khối lượng việc thay vì đếm nano giây (thời gian thật quá nhiễu để in ra ổn định): phép so ngây thơ tốn 1, 2, 3, 4 bước cho các lần đoán trùng 0, 1, 2, 3 chữ số đầu với bí mật — một chỗ rò rỉ thông tin — còn bản thời-gian-hằng-số lần nào cũng tốn 6. Trong Node, <code>crypto.timingSafeEqual</code> làm đúng việc này cho buffer; hãy dùng nó cho token, chữ ký và khoá bí mật của webhook.</p>
<p><strong>Một bit dấu trong phép kiểm bảo mật.</strong> Lỗi CIDR ở trên không phải chuyện thẩm mỹ: danh sách IP được phép là một quyết định kiểm soát truy cập. Nếu phép so sai, hoặc thông báo thanh toán thật bị từ chối (khách đã trả tiền mà đơn không bao giờ hoàn tất), hoặc — với một lỗi khác trong cùng mấy dòng đó — thông báo giả mạo được chấp nhận. Code bit canh giữ tiền xứng đáng có test với địa chỉ ở cả hai nửa của dải — đúng loại ca biên mà bước 6 của khung giải đề yêu cầu.</p>
</div>
${ma('ch01/bit-so-sanh.ts', { vung: 'so-sanh', nhan: 'TypeScript — early exit vs constant time' })}
${ketQua('ch01/bit-so-sanh.ts')}

<div class="ml-en">
<h3>🎤 Saying it out loud: a sample exchange</h3>
${hoiThoai([
  ['I', 'Every number in this array appears twice except one. Find the one that appears once.'],
  ['C', 'Can the numbers be negative? Is the array guaranteed non-empty, and does the single one appear exactly once while every other appears exactly twice?'],
  ['N', 'The exactly-twice guarantee is what makes XOR correct. Asking about it shows you already see where the trick could break.'],
  ['I', 'Yes, negatives are possible, non-empty, and exactly as you said.'],
  ['C', 'A hash map of counts gives O(n) time and O(n) space. Sorting puts the pairs side by side: O(n log n) time, O(1) space. Can I do better on memory? I think XOR works: x XOR x is zero, x XOR zero is x, and the order does not matter, so XOR-ing everything cancels every pair and leaves the single number. O(n) time, O(1) space.'],
  ['N', 'Two honest baselines, then the improvement with the three properties named — not just "XOR cancels".'],
  ['I', 'Go ahead.'],
  ['C', '(while coding) acc starts at zero… acc ^= x for every x… return acc. Quick trace on 4, 1, 2, 1, 2: 4, then 5, then 7, then 6, then 4. Correct. Negatives are fine because XOR compares bits, it never reads them as a value.'],
  ['N', 'A five-step trace takes ten seconds and catches typos. Mention negatives because you asked about them.'],
  ['I', 'What if every other number appeared three times?'],
  ['C', 'Then XOR leaves those in. I would count, for each of the 32 bit positions, how many numbers have that bit set; counts that are not a multiple of three belong to the single number. Still O(n) time and O(1) space — 32 counters. In Java I would rebuild the answer with an int so bit 31 gives the sign back.'],
  ['N', 'The follow-up is LC 137. Knowing the shape of the answer, and the sign-bit detail, is enough.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: một đoạn hội thoại mẫu</h3>
<p>Bản tiếng Anh ở khối EN; dưới đây là cùng mạch đó bằng tiếng Việt, kèm cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Mọi số trong mảng này xuất hiện hai lần trừ một số. Tìm số chỉ xuất hiện một lần.'],
  ['C', 'Số có thể âm không ạ? Mảng chắc chắn khác rỗng chứ, và số lẻ loi xuất hiện đúng một lần còn mọi số khác đúng hai lần phải không? <em>("Does every other number appear exactly twice?")</em>'],
  ['N', 'Cam kết "đúng hai lần" là thứ làm XOR đúng. Hỏi về nó cho thấy bạn đã thấy trước chỗ mẹo có thể gãy.'],
  ['I', 'Có thể có số âm, khác rỗng, và đúng như bạn nói.'],
  ['C', 'Hash map đếm số lần cho O(n) thời gian, O(n) bộ nhớ. Sắp xếp làm các cặp đứng cạnh nhau: O(n log n) thời gian, O(1) bộ nhớ. Bộ nhớ có tốt hơn được không? Em nghĩ XOR được: x XOR x bằng 0, x XOR 0 bằng x, và thứ tự không quan trọng, nên XOR tất cả sẽ triệt tiêu mọi cặp và để lại số lẻ loi. O(n) thời gian, O(1) bộ nhớ. <em>("XOR is commutative and associative, so every pair cancels out.")</em>'],
  ['N', 'Hai mốc thật thà, rồi cải tiến kèm tên ba tính chất — không chỉ nói "XOR triệt tiêu".'],
  ['I', 'Làm đi.'],
  ['C', '(vừa code vừa nói) acc bắt đầu bằng 0… acc ^= x với mọi x… trả về acc. Chạy tay nhanh 4, 1, 2, 1, 2: 4, rồi 5, rồi 7, rồi 6, rồi 4. Đúng. Số âm không sao vì XOR so từng bit, nó không bao giờ đọc chúng như một giá trị.'],
  ['N', 'Chạy tay năm bước mất mười giây và bắt được lỗi gõ. Nhắc tới số âm vì chính bạn đã hỏi về nó.'],
  ['I', 'Nếu mọi số khác xuất hiện ba lần thì sao?'],
  ['C', 'Khi đó XOR sẽ để chúng lại. Em sẽ đếm, với từng vị trí trong 32 vị trí bit, có bao nhiêu số bật bit đó; số đếm nào không chia hết cho ba thì bit đó thuộc về số lẻ loi. Vẫn O(n) thời gian và O(1) bộ nhớ — 32 bộ đếm. Trong Java em dựng lại đáp án bằng int để bit 31 trả lại dấu. <em>("I’d count each bit position modulo three.")</em>'],
  ['N', 'Câu hỏi nối tiếp chính là LC 137. Biết hình dạng lời giải, và chi tiết bit dấu, là đủ.'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Using <code>1 &lt;&lt; n</code> or <code>| 0</code> on values that can reach 2³¹ in JavaScript — the result wraps to a negative number or loses its high bits.</li>
<li><code>&gt;&gt;</code> instead of <code>&gt;&gt;&gt;</code> when looping over the bits of a possibly negative number ⇒ infinite loop.</li>
<li>Forgetting <code>n &gt; 0</code> in Power of Two (0 and negative numbers pass the AND test).</li>
<li>Operator precedence: <code>x &amp; 1 == 0</code> in Java does not compile and in JavaScript means <code>x &amp; (1 == 0)</code>. Always write <code>(x &amp; 1) === 0</code>.</li>
<li>Using the sum formula for Missing Number in Java with <code>int</code> — silent overflow past n ≈ 46,340.</li>
<li>Reaching for bits when a Set is clearer: bit tricks are for when the problem asks for O(1) memory or speaks in bits, not to look clever.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Dùng <code>1 &lt;&lt; n</code> hay <code>| 0</code> trên giá trị có thể chạm 2³¹ trong JavaScript — kết quả quay vòng thành số âm hoặc mất các bit cao.</li>
<li>Dùng <code>&gt;&gt;</code> thay vì <code>&gt;&gt;&gt;</code> khi lặp qua các bit của một số có thể âm ⇒ vòng lặp vô hạn.</li>
<li>Quên <code>n &gt; 0</code> trong Power of Two (số 0 và số âm lọt qua phép kiểm AND).</li>
<li>Độ ưu tiên toán tử: <code>x &amp; 1 == 0</code> trong Java không biên dịch được, còn trong JavaScript nghĩa là <code>x &amp; (1 == 0)</code>. Luôn viết <code>(x &amp; 1) === 0</code>.</li>
<li>Dùng công thức tổng cho Missing Number bằng <code>int</code> trong Java — tràn số lặng lẽ khi n vượt khoảng 46.340.</li>
<li>Vớ lấy bit khi một Set rõ ràng hơn: mẹo bit dành cho lúc đề đòi bộ nhớ O(1) hoặc nói bằng ngôn ngữ bit, không phải để trông thông minh.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
<p>The six Easy problems are one-line tricks — aim for under 10 minutes each. The four Medium ones reuse exactly the tricks of this lesson: LC 78 loops over masks, LC 137 counts bits modulo 3, LC 260 uses <code>x &amp; −x</code>, LC 371 builds addition from XOR and AND. The chapter's mixed practice set is <a href="${baiNay('dsa-1-4-luyen')}">Lesson 1.5</a>.</p>
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Sáu đề Easy đầu là "mẹo một dòng" — mục tiêu dưới 10 phút mỗi đề. Bốn đề Medium cuối dùng lại đúng các mẹo trong bài: LC 78 duyệt mask, LC 137 đếm bit theo mod 3, LC 260 dùng <code>x &amp; −x</code>, LC 371 dựng phép cộng từ XOR và AND. Bộ luyện tổng hợp của chương nằm ở <a href="${baiNay('dsa-1-4-luyen')}">bài 1.5</a>.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Without looking, write <code>singleNumber</code> (XOR) and <code>hammingWeight</code> (Kernighan) in your interview language. Trace <code>[4, 1, 2, 1, 2]</code> and n = 52 by hand on paper, writing the accumulator in binary at each step, then run the code and compare.</li>
<li>In JavaScript, write <code>popcount</code> with <code>&gt;&gt;=</code>, call it on −1 with a safety counter, watch it fail, then fix it with <code>&gt;&gt;&gt;=</code>. Write one sentence explaining why.</li>
<li>Compute by hand <code>0o750 &amp; ~0o027</code> and write it as <code>rwx</code> letters; check it with a one-line program.</li>
<li>Submit LC 136, LC 191, LC 231 and LC 338 on LeetCode. Notebook line for each: <em>signal → trick → complexity</em>.</li>
</ol>
<p><strong>Done when:</strong> your hand traces match the program (acc ends at 4; 52 takes 3 rounds), the −1 loop is fixed and explained, you got <code>rwxr-x---</code> (0o750), and four submissions are accepted.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">bit / bitwise operator</span><span class="v">A binary digit; an operator that works on each bit position independently (&amp; | ^ ~).</span></div>
  <div class="kv"><span class="k">XOR (exclusive or)</span><span class="v">1 where bits differ; x ^ x = 0, x ^ 0 = x; commutative and associative.</span></div>
  <div class="kv"><span class="k">two's complement</span><span class="v">How negative integers are stored: flip the bits and add 1; the top bit is the sign.</span></div>
  <div class="kv"><span class="k">arithmetic vs logical shift</span><span class="v">&gt;&gt; copies the sign bit in; &gt;&gt;&gt; brings in zeros.</span></div>
  <div class="kv"><span class="k">mask / bitmask</span><span class="v">An integer used as a set of on/off flags, or as a pattern to test, set or clear bits.</span></div>
  <div class="kv"><span class="k">population count (Hamming weight)</span><span class="v">The number of 1-bits in an integer.</span></div>
  <div class="kv"><span class="k">umask</span><span class="v">Permission bits the operating system removes from every new file or folder.</span></div>
  <div class="kv"><span class="k">timing attack</span><span class="v">Recovering a secret by measuring how long comparisons take.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>XOR cancels pairs: x ^ x = 0, x ^ 0 = x, order is irrelevant ⇒ Single Number in O(1) memory.</li>
<li>n &amp; (n − 1) removes the lowest 1-bit: count bits, test powers of two.</li>
<li>A mask from 0 to 2ⁿ − 1 is a subset; it is the right tool when n ≤ 20.</li>
<li>JavaScript bit operators work on 32-bit signed integers; use &gt;&gt;&gt; 0 for unsigned and 2 ** n for big powers.</li>
<li>Java: shift counts wrap (1 &lt;&lt; 32 = 1), int overflow never throws, use &gt;&gt;&gt; for unsigned bits.</li>
<li>Production uses bits for permissions, IP ranges, one-time codes, checksums — and constant-time comparison.</li>
</ul>
${nguon('📙', 'MDN — Bitwise operators (JavaScript)', 'Every operator, with the 32-bit conversion rule spelled out', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators#bitwise_shift_operators')}
${nguon('🧮', 'Bit Twiddling Hacks (Sean Eron Anderson, Stanford)', 'The classic collection: counting bits, powers of two, lowest set bit', 'https://graphics.stanford.edu/~seander/bithacks.html')}
${nguon('🔐', 'Node.js — crypto.timingSafeEqual', 'The built-in constant-time comparison for secrets', 'https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Không nhìn bài, viết <code>singleNumber</code> (XOR) và <code>hammingWeight</code> (Kernighan) bằng ngôn ngữ bạn sẽ dùng khi phỏng vấn. Chạy tay <code>[4, 1, 2, 1, 2]</code> và n = 52 trên giấy, ghi biến dồn dạng nhị phân ở từng bước, rồi chạy code và so.</li>
<li>Trong JavaScript, viết <code>popcount</code> bằng <code>&gt;&gt;=</code>, gọi nó với −1 kèm một bộ đếm an toàn, xem nó hỏng, rồi sửa bằng <code>&gt;&gt;&gt;=</code>. Viết một câu giải thích vì sao.</li>
<li>Tính tay <code>0o750 &amp; ~0o027</code> và viết ra dạng chữ <code>rwx</code>; kiểm lại bằng một chương trình một dòng.</li>
<li>Nộp LC 136, LC 191, LC 231 và LC 338 trên LeetCode. Mỗi đề một dòng trong sổ: <em>dấu hiệu → mẹo → độ phức tạp</em>.</li>
</ol>
<p><strong>Đạt khi:</strong> bản chạy tay khớp chương trình (acc kết thúc ở 4; 52 mất 3 vòng), vòng lặp với −1 đã sửa và giải thích được, bạn ra <code>rwxr-x---</code> (0o750), và bốn lượt nộp Accepted.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">bit / bitwise operator (bit / toán tử bit)</span><span class="v">Chữ số nhị phân; toán tử làm việc độc lập trên từng vị trí bit (&amp; | ^ ~).</span></div>
  <div class="kv"><span class="k">XOR — exclusive or (hoặc loại trừ)</span><span class="v">Ra 1 khi hai bit khác nhau; x ^ x = 0, x ^ 0 = x; giao hoán và kết hợp.</span></div>
  <div class="kv"><span class="k">two's complement (bù hai)</span><span class="v">Cách lưu số nguyên âm: lật bit rồi cộng 1; bit cao nhất là bit dấu.</span></div>
  <div class="kv"><span class="k">arithmetic / logical shift (dịch số học / dịch logic)</span><span class="v">&gt;&gt; chép bit dấu vào; &gt;&gt;&gt; đưa số 0 vào.</span></div>
  <div class="kv"><span class="k">mask / bitmask (mặt nạ bit)</span><span class="v">Số nguyên dùng như tập cờ bật/tắt, hoặc như mẫu để kiểm, bật, tắt bit.</span></div>
  <div class="kv"><span class="k">population count / Hamming weight (số bit 1)</span><span class="v">Số lượng bit 1 trong một số nguyên.</span></div>
  <div class="kv"><span class="k">umask (mặt nạ quyền mặc định)</span><span class="v">Các bit quyền mà hệ điều hành gỡ khỏi mọi tệp, thư mục mới tạo.</span></div>
  <div class="kv"><span class="k">timing attack (tấn công đo thời gian)</span><span class="v">Dò ra bí mật bằng cách đo phép so sánh mất bao lâu.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>XOR triệt tiêu từng cặp: x ^ x = 0, x ^ 0 = x, thứ tự không quan trọng ⇒ Single Number với bộ nhớ O(1).</li>
<li>n &amp; (n − 1) xoá bit 1 thấp nhất: đếm bit, kiểm luỹ thừa của 2.</li>
<li>Một mask từ 0 tới 2ⁿ − 1 là một tập con; đúng công cụ khi n ≤ 20.</li>
<li>Toán tử bit của JavaScript làm việc trên số nguyên 32 bit có dấu; dùng &gt;&gt;&gt; 0 để lấy số không dấu và 2 ** n cho luỹ thừa lớn.</li>
<li>Java: số bước dịch quay vòng (1 &lt;&lt; 32 = 1), tràn int không ném lỗi, dùng &gt;&gt;&gt; cho bit không dấu.</li>
<li>Production dùng bit cho quyền tệp, dải IP, mã dùng một lần, mã kiểm tra — và phép so sánh thời gian hằng số.</li>
</ul>
${nguon('📙', 'MDN — Toán tử bit (JavaScript)', 'Từng toán tử, có ghi rõ luật đổi về 32 bit (tiếng Anh)', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators#bitwise_shift_operators')}
${nguon('🧮', 'Bit Twiddling Hacks (Sean Eron Anderson, Stanford)', 'Bộ sưu tập kinh điển: đếm bit, luỹ thừa của 2, bit 1 thấp nhất (tiếng Anh)', 'https://graphics.stanford.edu/~seander/bithacks.html')}
${nguon('🔐', 'Node.js — crypto.timingSafeEqual', 'Hàm so sánh thời gian hằng số có sẵn cho dữ liệu bí mật (tiếng Anh)', 'https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b')}
</div>
`,
};
