/** 1.1 — Hash map và set. Mọi mã/output đọc từ ../ma/ch01 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, gap, lienKet } from '../_chung.mjs';
import { vetTwoSum } from '../ma/ch01/two-sum.vet.mjs';

const NUMS = [3, 8, 11, 2, 7, 15];
const vet = vetTwoSum(NUMS, 9);
const BANG = bangVet(['i', 'nums', 'need = 9 − nums[i]', 'seen (before)', 'result'],
  vet.map((h) => [
    String(h.i),
    oMang(NUMS, { to: h.hit ? { [h.i]: 'ok', [h.j]: 'ok' } : { [h.i]: 'l' } }),
    String(h.need),
    `<code>${h.truoc}</code>`,
    h.hit ? `✅ ${h.need} @ ${h.j} ⇒ [${h.j}, ${h.i}]` : `✗ ⇒ seen.set(${h.x}, ${h.i})`,
  ]));

const DE = [
  [lc(1, 'two-sum', 'Two Sum', 'Easy'), 'Pair with a given sum, unsorted ⇒ store what you have seen, look up the partner.', 'Tìm cặp có tổng cho trước, mảng KHÔNG sắp xếp ⇒ nhớ cái đã thấy, tra "người còn lại".'],
  [lc(217, 'contains-duplicate', 'Contains Duplicate', 'Easy'), '"Have I seen this before?" is the definition of a Set.', '"Đã thấy cái này chưa?" chính là định nghĩa của Set.'],
  [lc(242, 'valid-anagram', 'Valid Anagram', 'Easy'), 'Same letters, same counts ⇒ a count array of 26.', 'Cùng chữ, cùng số lần ⇒ mảng đếm 26 ô.'],
  [lc(383, 'ransom-note', 'Ransom Note', 'Easy'), 'Counts of one string must cover counts of another.', 'Số lần mỗi chữ của chuỗi này phải "đủ trả" cho chuỗi kia.'],
  [lc(205, 'isomorphic-strings', 'Isomorphic Strings', 'Easy'), 'Two maps (s→t and t→s) — one map is the classic bug.', 'Hai map (s→t và t→s) — chỉ dùng một map là lỗi kinh điển.'],
  [lc(49, 'group-anagrams', 'Group Anagrams', 'Medium'), 'Group by a KEY that is equal exactly for words that belong together.', 'Nhóm theo một KHOÁ bằng nhau đúng khi hai từ thuộc cùng nhóm.'],
  [lc(128, 'longest-consecutive-sequence', 'Longest Consecutive Sequence', 'Medium'), 'O(n) required, sorting is O(n log n) ⇒ Set + "only start at a run start".', 'Đề đòi O(n), sắp xếp là O(n log n) ⇒ Set + "chỉ bắt đầu đếm ở đầu dãy".'],
  [lc(36, 'valid-sudoku', 'Valid Sudoku', 'Medium'), 'Three families of Sets (rows, columns, boxes); the box index is (r/3)*3 + c/3.', 'Ba họ Set (hàng, cột, ô 3×3); chỉ số ô là (r/3)*3 + c/3.'],
  [lc(380, 'insert-delete-getrandom-o1', 'Insert Delete GetRandom O(1)', 'Medium'), 'A map value → index into an array; delete by swapping with the last element.', 'Map giá trị → vị trí trong mảng; xoá bằng cách đổi chỗ với phần tử cuối.'],
];

export default {
  title: '1.1 — Hash maps and sets: trading memory for time|||1.1 — Hash map và set: đổi bộ nhớ lấy thời gian',
  slug: 'dsa-1-1-hash-map',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Two Sum từ O(n²) xuống O(n), đếm tần suất, chọn khoá để nhóm anagram, dãy liên tiếp dài nhất — kèm đo thời gian thật và hai cái bẫy Map/HashMap.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Hash maps and sets: trading memory for time</h2>
<p class="lead">If you remember one sentence from this course, make it this one: <strong>"when a nested loop is searching for something, a hash map can usually remember it instead."</strong> Roughly a third of the easy and medium problems in an interview loop are solved by that single move. This lesson teaches the move, shows you its real cost with measured numbers, and shows you the two traps that make people fail with it.</p>

<h3>The everyday picture</h3>
<p>You are the cashier at the canteen and a classmate gives you a 50k note for a 41k lunch. You do not try every coin in the drawer against every other coin. You think "I need 9k" and look straight at the 9k slot. A hash map is exactly that drawer: you ask for a <em>value</em> ("9k") and it tells you in one step whether it has it and where. The price you pay is the drawer itself — memory.</p>
<p>Formally: a <strong>hash map</strong> stores key → value pairs; <code>get</code>, <code>set</code>, <code>has</code> and <code>delete</code> take <strong>O(1) on average</strong>. A <strong>hash set</strong> is the same thing with keys only. In TypeScript they are <code>Map</code> and <code>Set</code>; in Java <code>HashMap</code> and <code>HashSet</code>.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Hash map và set: đổi bộ nhớ lấy thời gian</h2>
<p class="lead">Nếu cả khoá này bạn chỉ nhớ được một câu, hãy nhớ câu này: <strong>"khi một vòng lặp lồng nhau đang đi TÌM một thứ, thường có thể dùng hash map để NHỚ thứ đó thay vì tìm lại."</strong> Khoảng một phần ba số đề dễ và vừa trong vòng phỏng vấn được giải chỉ bằng đúng một nước đi đó. Bài này dạy nước đi ấy, cho bạn thấy cái giá thật của nó bằng số đo, và chỉ ra hai cái bẫy khiến người ta trượt khi dùng nó.</p>

<h3>Hình dung đời thường</h3>
<p>Bạn đứng quầy thu ngân căng-tin, bạn cùng lớp đưa tờ 50k cho suất cơm 41k. Bạn không đem từng tờ trong ngăn kéo ghép thử với từng tờ khác. Bạn nghĩ "cần thối 9k" rồi nhìn thẳng vào ô 9k. Hash map chính là cái ngăn kéo chia ô đó: bạn hỏi một <em>giá trị</em> ("9k") và nó trả lời trong một bước là có hay không, nằm ở đâu. Cái giá phải trả là chính cái ngăn kéo — tức bộ nhớ.</p>
<p>Nói cho chuẩn: <strong>hash map</strong> (bảng băm dạng khoá → giá trị) lưu các cặp key → value; các thao tác <code>get</code> (lấy), <code>set</code> (ghi), <code>has</code> (có không), <code>delete</code> (xoá) tốn <strong>O(1) trung bình</strong>. <strong>Hash set</strong> (tập hợp băm) là cùng thứ đó nhưng chỉ có khoá. Trong TypeScript là <code>Map</code> và <code>Set</code>; trong Java là <code>HashMap</code> và <code>HashSet</code>.</p>
${csd('csd201-bam', 'vi', '7.1 Bảng băm & va chạm', '<p>Ở CSD201 bạn đã học bên TRONG bảng băm: hàm băm, va chạm, dây chuyền (chaining), địa chỉ mở, hệ số tải. Ôn nhanh một câu: khoá → hàm băm → chỉ số ô; hai khoá cùng ô thì xếp chung một danh sách. <strong>Ở đây đi sâu thêm:</strong> dùng bảng băm như một CÔNG CỤ giải đề — nhận ra lúc nào cần nó, chọn khoá thế nào, và trường hợp xấu nhất phá vỡ "O(1)" ra sao (kèm số đo thật).</p>')}
</div>

<div class="ml-en">
<h3>Signals: when to reach for a hash map</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"find a pair / partner"</span><span class="v">For each element you need <em>another</em> element with a known relation (sum = target, difference = k, complement). Store what you have seen; look up the partner.</span></div>
  <div class="kv"><span class="k">"have I seen this?"</span><span class="v">Duplicates, first repeating character, cycle detection by state, "visited". A Set.</span></div>
  <div class="kv"><span class="k">"how many times?"</span><span class="v">Frequencies, anagrams, majority, "at most k distinct". A count map — or an int[26] when keys are lowercase letters.</span></div>
  <div class="kv"><span class="k">"group things that are the same in some way"</span><span class="v">Group anagrams, group by domain, bucket by remainder. A map from a <em>canonical key</em> to a list.</span></div>
  <div class="kv"><span class="k">the constraint says n ≤ 10⁵ and your idea is two nested loops</span><span class="v">10¹⁰ steps will time out (lesson 0.3). You need roughly O(n) or O(n log n): a hash map is the first thing to try.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: khi nào cầm hash map lên</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"tìm một cặp / người còn lại"</span><span class="v">Với mỗi phần tử, bạn cần một phần tử <em>khác</em> có quan hệ biết trước (tổng = target, hiệu = k, phần bù). Lưu cái đã thấy, tra người còn lại.</span></div>
  <div class="kv"><span class="k">"cái này gặp rồi chưa?"</span><span class="v">Phần tử trùng, ký tự lặp đầu tiên, đánh dấu "đã thăm" (visited). Dùng Set.</span></div>
  <div class="kv"><span class="k">"xuất hiện bao nhiêu lần?"</span><span class="v">Tần suất, anagram (đảo chữ), phần tử chiếm đa số, "tối đa k loại khác nhau". Một map đếm — hoặc một mảng int[26] khi khoá chỉ là chữ thường.</span></div>
  <div class="kv"><span class="k">"gom những thứ giống nhau theo một nghĩa nào đó"</span><span class="v">Nhóm anagram, nhóm email theo tên miền, chia theo số dư. Một map từ <em>khoá chuẩn hoá</em> (canonical key) tới danh sách.</span></div>
  <div class="kv"><span class="k">đề ghi n ≤ 10⁵ mà ý tưởng của bạn là hai vòng lặp lồng</span><span class="v">10¹⁰ bước chắc chắn quá giờ (bài 0.3). Bạn cần khoảng O(n) hoặc O(n log n): hash map là thứ đầu tiên nên thử.</span></div>
</div>
</div>

<div class="ml-en">
<h3>Worked example: Two Sum, from O(n²) to O(n)</h3>
<p><strong>Problem (in our words).</strong> Given an array <code>nums</code> and a number <code>target</code>, return the indices of the two different elements whose sum is <code>target</code>. Exactly one answer exists. Example: <code>nums = [2, 7, 11, 15], target = 9</code> → <code>[0, 1]</code>.</p>
<p><strong>Step 1 — brute force, said out loud first.</strong> "Try every pair (i, j) with i &lt; j; return the first pair that sums to target." That is n(n−1)/2 pairs: O(n²) time, O(1) extra memory. Always say this version first in an interview — it proves you understood the problem and gives you a baseline to improve.</p>
<p><strong>Step 2 — find the repeated work.</strong> For a fixed <code>i</code>, the inner loop is asking one question: "is there an element equal to <code>target − nums[i]</code>?" It answers it by scanning. Scanning is the waste. If every element we have already passed were in a hash map (value → index), the question costs O(1).</p>
<p><strong>Step 3 — one pass.</strong> Walk left to right. For each <code>nums[i]</code>, compute <code>need = target − nums[i]</code>. If <code>need</code> is in the map, done. Otherwise put <code>nums[i] → i</code> into the map and continue. We only need to look <em>backwards</em>, because any pair (j, i) with j &lt; i is found when we reach i.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Two Sum, từ O(n²) xuống O(n)</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho mảng <code>nums</code> và số <code>target</code>, trả về chỉ số của hai phần tử KHÁC NHAU có tổng bằng <code>target</code>. Đề đảm bảo có đúng một đáp án. Ví dụ: <code>nums = [2, 7, 11, 15], target = 9</code> → <code>[0, 1]</code>.</p>
<p><strong>Bước 1 — vét cạn (brute force), và NÓI nó ra trước.</strong> "Thử mọi cặp (i, j) với i &lt; j; cặp đầu tiên có tổng bằng target thì trả về." Có n(n−1)/2 cặp: thời gian O(n²), bộ nhớ phụ O(1). Khi phỏng vấn luôn nói bản này trước — nó chứng minh bạn hiểu đề và cho bạn một mốc để cải tiến.</p>
<p><strong>Bước 2 — tìm phần việc bị làm lặp lại.</strong> Với một <code>i</code> cố định, vòng trong chỉ đang hỏi đúng một câu: "có phần tử nào bằng <code>target − nums[i]</code> không?" — và nó trả lời bằng cách quét từng phần tử. Quét chính là chỗ phí. Nếu mọi phần tử đã đi qua đều nằm sẵn trong một hash map (giá trị → chỉ số), câu hỏi đó chỉ tốn O(1).</p>
<p><strong>Bước 3 — một lượt duyệt.</strong> Đi từ trái sang phải. Với mỗi <code>nums[i]</code>, tính <code>need = target − nums[i]</code> (số cần tìm). Nếu <code>need</code> có trong map ⇒ xong. Không thì cất <code>nums[i] → i</code> vào map rồi đi tiếp. Ta chỉ cần nhìn <em>về phía sau</em>, vì mọi cặp (j, i) với j &lt; i đều được phát hiện đúng lúc ta tới i.</p>
</div>

${maHai('ch01/two-sum.ts', 'ch01/TwoSum.java', { vung: 'hash' })}
${ketQua('ch01/two-sum.ts')}
${ketQua('ch01/TwoSum.java')}

<div class="ml-en">
<h3>Watch it run: the state after every step</h3>
<p>Input <code>nums = [3, 8, 11, 2, 7, 15]</code>, <code>target = 9</code>. Blue = the element we are standing on; green = the answer. Read the "seen (before)" column: it is the map <em>before</em> step i looks anything up. This table was produced by running the algorithm, not typed by hand.</p>
</div>
<div class="ml-vi">
<h3>Xem nó chạy: trạng thái sau từng bước</h3>
<p>Đầu vào <code>nums = [3, 8, 11, 2, 7, 15]</code>, <code>target = 9</code>. Ô xanh dương = phần tử đang đứng; ô xanh lá = đáp án. Đọc cột "seen (before)": đó là map <em>trước khi</em> bước i tra cứu. Bảng này sinh ra bằng cách chạy thuật toán thật, không gõ tay.</p>
</div>
${BANG}
<div class="ml-en">
<p>Four steps instead of fifteen pairs. Notice step 3: <code>need = 7</code>, and 7 is <em>not yet</em> in the map — it appears later at index 4. That is fine: when we reach index 4, its partner 2 is already in the map. Every pair is caught at its <em>right</em> element.</p>
${moPhong('ch01/two-sum.sim.js', 'en', 'Two Sum with a hash map — step by step', 'Opens /algorithms with this exact program: play, pause, step, change the array and target and run again.')}
</div>
<div class="ml-vi">
<p>Bốn bước thay vì mười lăm cặp. Để ý bước 3: <code>need = 7</code>, mà 7 <em>chưa</em> có trong map — nó xuất hiện sau, ở chỉ số 4. Không sao: tới chỉ số 4 thì "người còn lại" của nó là 2 đã nằm sẵn trong map. Mọi cặp đều được bắt tại phần tử <em>bên phải</em> của cặp.</p>
${moPhong('ch01/two-sum.sim.js', 'vi', 'Two Sum bằng hash map — chạy từng bước', 'Mở trang /algorithms với đúng chương trình này: phát, dừng, đi từng bước, đổi mảng và target rồi chạy lại.')}
</div>

<div class="ml-en">
<h3>Why "check, then insert" — and not the other way round</h3>
<p>Look at <code>[3, 3], target 6</code>. If you inserted <code>nums[i]</code> first and then looked up <code>need</code>, at i = 0 you would find 3 → index 0 and return <code>[0, 0]</code>: the same element used twice. Checking first means the map only contains elements strictly to the left of i, so "two different elements" is guaranteed by the order of two lines. Interviewers love this detail; say it out loud.</p>
<h3>The real cost, measured</h3>
<p>Big-O is a promise about growth. Here is what that growth looks like on one machine (Apple M1 Max), worst case (the only pair is the last two numbers):</p>
</div>
<div class="ml-vi">
<h3>Vì sao "tra trước, cất sau" — mà không phải ngược lại</h3>
<p>Xét <code>[3, 3], target 6</code>. Nếu bạn cất <code>nums[i]</code> vào trước rồi mới tra <code>need</code>, ở i = 0 bạn sẽ thấy 3 → chỉ số 0 và trả về <code>[0, 0]</code>: một phần tử bị dùng hai lần. Tra trước nghĩa là map chỉ chứa các phần tử nằm hẳn bên trái i, nên điều kiện "hai phần tử khác nhau" được đảm bảo chỉ nhờ thứ tự của hai dòng code. Người phỏng vấn rất thích chi tiết này; hãy nói nó ra.</p>
<h3>Cái giá thật, đo bằng số</h3>
<p>Big-O là lời hứa về <em>tốc độ tăng</em>. Đây là hình hài của tốc độ tăng đó trên một máy thật (Apple M1 Max), trường hợp xấu nhất (cặp duy nhất là hai số cuối):</p>
</div>
${ma('ch01/two-sum-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch01/two-sum-do.ts')}
${ketQua('ch01/TwoSumDo.java')}
<div class="ml-en">
<p>Read it like an engineer: from 10,000 to 100,000 the input grew 10×, and the brute force grew about <strong>100×</strong> (26.7 → 2,659 ms in Node) — that is what "n²" means. The hash map grew about 10×, as "n" promises. At n = 10⁶ the brute force would need roughly 100× more again (several minutes), so it was not even run, while the hash map takes under 0.1 s. Java's numbers are smaller but the <em>shape</em> is identical: language choice changes the constant, never the curve. On LeetCode, where a typical limit is around a second, the brute force passes n = 10⁴ and fails n = 10⁵. That is why constraints matter.</p>
</div>
<div class="ml-vi">
<p>Đọc như một kỹ sư: từ 10.000 lên 100.000, đầu vào tăng 10 lần, còn vét cạn tăng khoảng <strong>100 lần</strong> (26,7 → 2.659 ms trên Node) — "n²" nghĩa là vậy. Hash map tăng khoảng 10 lần, đúng như "n" hứa. Ở n = 10⁶ vét cạn sẽ cần thêm khoảng 100 lần nữa (vài phút) nên không chạy luôn, trong khi hash map mất chưa tới 0,1 giây. Số của Java nhỏ hơn nhưng <em>hình dạng</em> y hệt: đổi ngôn ngữ chỉ đổi hằng số, không bao giờ đổi đường cong. Trên LeetCode, nơi giới hạn thường vào khoảng một giây, vét cạn qua được n = 10⁴ và trượt ở n = 10⁵. Đó là lý do phải đọc ràng buộc (constraints) của đề.</p>
</div>

<div class="ml-en">
<h3>Pattern 2 — counting: Contains Duplicate and Valid Anagram</h3>
<p>Two tiny problems that teach two tools. <em>Contains Duplicate</em>: "have I seen x?" is a Set — and in Java, <code>Set.add</code> already returns <code>false</code> when the element was there, so the check and the insert are one call. <em>Valid Anagram</em>: two strings are anagrams iff every letter appears the same number of times. When the alphabet is small and known (26 lowercase letters), an <code>int[26]</code> beats a map: no hashing, no boxing, and you can count "+1 for s, −1 for t" in the same loop so that all zeros means equal.</p>
</div>
<div class="ml-vi">
<h3>Mẫu 2 — đếm: Contains Duplicate và Valid Anagram</h3>
<p>Hai đề nhỏ dạy hai công cụ. <em>Contains Duplicate</em> (có phần tử trùng không): "đã thấy x chưa?" chính là một Set — và trong Java, <code>Set.add</code> đã tự trả về <code>false</code> khi phần tử có sẵn, nên phép kiểm và phép cất gộp làm một lời gọi. <em>Valid Anagram</em> (hai chuỗi có phải đảo chữ của nhau): đúng khi và chỉ khi mỗi chữ cái xuất hiện cùng số lần. Khi bảng chữ nhỏ và biết trước (26 chữ thường), mảng <code>int[26]</code> thắng map: không phải băm, không phải đóng hộp (boxing), và có thể đếm "+1 cho s, −1 cho t" trong cùng một vòng — cuối cùng toàn số 0 nghĩa là bằng nhau.</p>
</div>
${maHai('ch01/tan-suat.ts', 'ch01/TanSuat.java')}
${ketQua('ch01/tan-suat.ts')}

<div class="ml-en">
<h3>Pattern 3 — grouping: the whole problem is choosing the key</h3>
<p><em>Group Anagrams</em>: put words that are anagrams of each other into the same group. The insight is not about loops at all: find a <strong>canonical key</strong> — a value that is equal for two words <em>exactly when</em> they belong together. Two keys work:</p>
<ul>
<li><strong>Sorted letters</strong>: "eat", "tea", "ate" all become "aet". Cost per word: O(k log k) for a word of length k.</li>
<li><strong>Letter counts</strong>: 26 numbers joined with a separator. Cost per word: O(k + 26). The separator matters: without it, counts [1, 11] and [11, 1] would both print "111".</li>
</ul>
</div>
<div class="ml-vi">
<h3>Mẫu 3 — gom nhóm: cả bài nằm ở chỗ chọn KHOÁ</h3>
<p><em>Group Anagrams</em> (nhóm các từ đảo chữ): đưa các từ là đảo chữ của nhau vào cùng một nhóm. Ý chính không nằm ở vòng lặp: hãy tìm một <strong>khoá chuẩn hoá</strong> (canonical key) — một giá trị bằng nhau <em>đúng khi và chỉ khi</em> hai từ thuộc cùng nhóm. Có hai khoá dùng được:</p>
<ul>
<li><strong>Chữ cái đã sắp xếp</strong>: "eat", "tea", "ate" đều thành "aet". Tốn O(k log k) cho một từ dài k.</li>
<li><strong>Số lần của từng chữ</strong>: 26 con số nối bằng một dấu ngăn. Tốn O(k + 26) mỗi từ. Dấu ngăn là bắt buộc: thiếu nó, hai bộ đếm [1, 11] và [11, 1] đều in ra "111" và bị gom nhầm.</li>
</ul>
</div>
${maHai('ch01/group-anagrams.ts', 'ch01/GroupAnagrams.java')}
${ketQua('ch01/group-anagrams.ts')}
${ketQua('ch01/GroupAnagrams.java')}
<div class="ml-en">
<p>Java detail: we used <code>LinkedHashMap</code> only so the output order matches TypeScript's <code>Map</code> (which keeps insertion order). LeetCode accepts groups in any order, so a plain <code>HashMap</code> is fine there — but if you print and compare by eye in an interview, a stable order saves you a confusing minute.</p>
</div>
<div class="ml-vi">
<p>Chi tiết Java: ở đây dùng <code>LinkedHashMap</code> chỉ để thứ tự in ra giống <code>Map</code> của TypeScript (vốn giữ thứ tự chèn). LeetCode chấp nhận các nhóm theo thứ tự bất kỳ nên <code>HashMap</code> thường là đủ — nhưng khi phỏng vấn mà bạn in ra rồi so bằng mắt, một thứ tự ổn định giúp bạn khỏi mất một phút bối rối.</p>
</div>

<div class="ml-en">
<h3>Pattern 4 — a Set as a lookup structure: Longest Consecutive Sequence</h3>
<p>Given an unsorted array, return the length of the longest run of consecutive integers (in <code>[100, 4, 200, 1, 3, 2]</code> it is 1, 2, 3, 4 → 4). The problem demands O(n), so sorting (O(n log n)) is the "good first answer, now improve it" version. The trick: put everything in a Set, and <strong>only start counting from x when x − 1 is absent</strong> — that is, at the start of a run. Every number is then visited by at most one inner <code>while</code>, so the total work is O(n) even though there is a loop inside a loop. This "nested loop that is still linear" argument is a favourite follow-up question: be ready to explain it with the word <em>amortised</em> (each element is touched a constant number of times in total).</p>
</div>
<div class="ml-vi">
<h3>Mẫu 4 — Set làm cấu trúc tra cứu: Longest Consecutive Sequence</h3>
<p>Cho mảng không sắp xếp, trả về độ dài dãy số nguyên liên tiếp dài nhất (trong <code>[100, 4, 200, 1, 3, 2]</code> là 1, 2, 3, 4 → 4). Đề đòi O(n), nên sắp xếp (O(n log n)) là bản "trả lời đầu tiên ổn, giờ cải tiến đi". Mẹo: bỏ hết vào Set, và <strong>chỉ bắt đầu đếm từ x khi x − 1 KHÔNG có</strong> — tức là x đứng đầu một dãy. Khi đó mỗi số chỉ bị vòng <code>while</code> bên trong ghé tối đa một lần, nên tổng công việc là O(n) dù có vòng lặp trong vòng lặp. Lập luận "lặp lồng mà vẫn tuyến tính" này là câu hỏi phụ người phỏng vấn rất hay hỏi: hãy sẵn sàng giải thích bằng chữ <em>amortised</em> (khấu hao — tính tổng cả quá trình, mỗi phần tử chỉ bị đụng một số lần hằng số).</p>
</div>
${maHai('ch01/longest-consecutive.ts', 'ch01/LongestConsecutive.java')}
${ketQua('ch01/longest-consecutive.ts')}

<div class="ml-en">
<h3>"O(1)" is an average: what a bad key does</h3>
<p>A hash map is fast because keys spread over many buckets. If every key lands in the same bucket, every lookup has to search that one bucket. The Java program below inserts n keys whose <code>hashCode()</code> always returns 42, then looks them all up, and compares with a correct key class:</p>
</div>
<div class="ml-vi">
<h3>"O(1)" chỉ là trung bình: một khoá tồi gây ra chuyện gì</h3>
<p>Hash map nhanh vì các khoá trải đều ra nhiều ô (bucket). Nếu mọi khoá rơi vào cùng một ô, mỗi lần tra đều phải lục trong đúng ô đó. Chương trình Java dưới đây chèn n khoá có <code>hashCode()</code> luôn trả về 42 rồi tra lại tất cả, so với một lớp khoá viết đúng:</p>
</div>
${ma('ch01/VaChamBam.java', { vung: 'khoa', nhan: 'Java' })}
${ketQua('ch01/VaChamBam.java')}
<div class="ml-en">
<p>2.2 ms versus 24 seconds for 40,000 keys — the "O(1)" map became O(n) per operation, O(n²) overall. Since Java 8 (JEP 180) a crowded bucket is turned into a balanced tree, which rescues keys that are <code>Comparable</code>; our <code>BadKey</code> is not comparable, so the tree cannot order it and the search degrades. Two lessons for the interview: (1) when you write a key class in Java, override <code>equals</code> <em>and</em> <code>hashCode</code> together and base both on the same fields; (2) when asked "what is the complexity of your solution?", the precise answer is "O(n) expected, assuming a good hash function".</p>
</div>
<div class="ml-vi">
<p>2,2 ms so với 24 giây cho 40.000 khoá — cái map "O(1)" đã thành O(n) mỗi thao tác, O(n²) cả bài. Từ Java 8 (JEP 180), một ô quá đông được đổi thành cây cân bằng, cứu được các khoá <code>Comparable</code> (so sánh được); <code>BadKey</code> của ta không so sánh được nên cây không sắp được nó và việc tìm vẫn suy biến. Hai bài học khi phỏng vấn: (1) viết lớp khoá trong Java thì ghi đè <code>equals</code> <em>và</em> <code>hashCode</code> cùng lúc, dựa trên cùng các trường; (2) khi được hỏi "độ phức tạp lời giải của bạn?", câu trả lời chính xác là "O(n) kỳ vọng (expected), với giả định hàm băm tốt".</p>
${csd('csd201-ham-bam', 'vi', '7.2 Hàm băm & giao ước hashCode/equals', '<p>Bài CSD201 giải thích giao ước hashCode/equals và vì sao vi phạm nó làm HashMap "mất" phần tử. Ở đây ta thấy mặt còn lại: tuân thủ giao ước nhưng băm TỒI thì không mất dữ liệu — chỉ chậm đi hàng nghìn lần.</p>')}
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: hash flooding (HashDoS)</h3>
<p>The slow table above is not just a curiosity — it is a real attack. In December 2011, Alexander Klink and Julian Wälde showed that many web platforms (Java, PHP, Python, Ruby, Tomcat, Jetty, the V8 engine…) hashed request parameters with predictable functions. An attacker sends one POST request with tens of thousands of parameter names that all collide; the server builds a hash table from them and burns 100 % CPU for a long time (oCERT-2011-003). Node.js had its own variant: CVE-2017-11499, where the hash seed was constant for a given release because of V8 snapshots, so collisions could be precomputed.</p>
<p>Defences you can name in an interview or a design discussion: a <strong>random per-process seed</strong> (what V8, Python and Ruby do now); <strong>limits on the number of parameters / JSON keys</strong> a request may carry; tree bins for crowded buckets (Java 8+). In your own code: never let a client choose an unbounded number of keys in a structure you hash, and put a size limit on request bodies — <code>express.json({ limit })</code> exists for exactly this reason.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: tấn công làm ngập bảng băm (HashDoS)</h3>
<p>Cái bảng chậm ở trên không chỉ để tò mò — nó là một kiểu tấn công có thật. Tháng 12/2011, Alexander Klink và Julian Wälde chỉ ra rằng rất nhiều nền tảng web (Java, PHP, Python, Ruby, Tomcat, Jetty, engine V8…) băm tham số của request bằng hàm đoán trước được. Kẻ tấn công gửi MỘT request POST chứa hàng chục nghìn tên tham số va chạm nhau; máy chủ dựng bảng băm từ chúng và đốt 100 % CPU trong thời gian dài (thông báo oCERT-2011-003). Node.js cũng có biến thể riêng: CVE-2017-11499, khi "hạt giống" (seed) băm cố định cho cả một phiên bản phát hành vì cơ chế snapshot của V8, nên kẻ xấu tính trước được các khoá va chạm.</p>
<p>Cách phòng có thể kể ra khi phỏng vấn hay khi bàn thiết kế: <strong>seed ngẫu nhiên cho mỗi tiến trình</strong> (V8, Python, Ruby đều làm vậy hiện nay); <strong>giới hạn số tham số / số khoá JSON</strong> một request được mang; đổi ô quá đông thành cây (Java 8+). Trong code của bạn: đừng bao giờ để client tự chọn một số lượng khoá không giới hạn trong một cấu trúc bạn đem băm, và luôn đặt trần kích thước body — <code>express.json({ limit })</code> tồn tại chính vì lý do này.</p>
</div>

<div class="ml-en">
<h3>Two traps that fail real candidates</h3>
<div class="pitfall co-tieu-de"><p><strong>TypeScript/JavaScript: a plain object <code>{}</code> as a dictionary of user-controlled keys.</strong></p><p>Objects inherit keys from <code>Object.prototype</code>. Count words with <code>{}</code> and the words <code>__proto__</code>, <code>constructor</code>, <code>toString</code> break it:</p></div>
</div>
<div class="ml-vi">
<h3>Hai cái bẫy làm trượt ứng viên thật</h3>
<div class="pitfall co-tieu-de"><p><strong>TypeScript/JavaScript: dùng object thường <code>{}</code> làm từ điển với khoá do người dùng quyết định.</strong></p><p>Object thừa kế khoá từ <code>Object.prototype</code>. Đếm từ bằng <code>{}</code> thì các từ <code>__proto__</code>, <code>constructor</code>, <code>toString</code> làm hỏng nó:</p></div>
</div>
${ma('ch01/bay-object.ts', { vung: 'sai', nhan: 'TypeScript — wrong' })}
${ma('ch01/bay-object.ts', { vung: 'dung', nhan: 'TypeScript — right' })}
${ketQua('ch01/bay-object.ts')}
<div class="ml-en">
<p>The count for <code>__proto__</code> silently vanished, and "constructor" became the <em>string</em> <code>"function Object() { [native code] }1"</code>. On LeetCode the test data rarely contains these words, so the bug survives practice and appears in production — where writing to <code>__proto__</code> with attacker-chosen keys is the root of <strong>prototype pollution</strong> attacks. Rule: use <code>Map</code>/<code>Set</code> for dictionaries; if you must use an object, create it with <code>Object.create(null)</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Java: comparing two <code>Integer</code>s from a map with <code>==</code>.</strong></p><p><code>map.get(x)</code> returns an <code>Integer</code> object. <code>==</code> compares references. Java caches small Integers (−128…127), so the bug hides in small tests and appears with bigger numbers:</p></div>
</div>
<div class="ml-vi">
<p>Số đếm của <code>__proto__</code> lặng lẽ biến mất, còn "constructor" thành <em>chuỗi</em> <code>"function Object() { [native code] }1"</code>. Dữ liệu test trên LeetCode hiếm khi có các từ này, nên lỗi sống sót qua lúc luyện và lộ ra ở production — nơi việc ghi vào <code>__proto__</code> bằng khoá kẻ tấn công chọn chính là gốc của lỗ hổng <strong>prototype pollution</strong> (đầu độc nguyên mẫu). Quy tắc: từ điển thì dùng <code>Map</code>/<code>Set</code>; bắt buộc dùng object thì tạo bằng <code>Object.create(null)</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Java: so hai <code>Integer</code> lấy từ map bằng <code>==</code>.</strong></p><p><code>map.get(x)</code> trả về đối tượng <code>Integer</code>. <code>==</code> so <em>địa chỉ</em> (tham chiếu). Java lưu sẵn các Integer nhỏ (−128…127), nên lỗi trốn trong test nhỏ và lộ ra khi số lớn:</p></div>
</div>
${ma('ch01/JavaIntegerBay.java', { vung: 'bay', nhan: 'Java' })}
${ketQua('ch01/JavaIntegerBay.java')}
<div class="ml-en">
<p>Fix: <code>.equals()</code>, or unbox into <code>int</code> first. And note the last line: unboxing a missing key (<code>null</code>) into <code>int</code> throws <code>NullPointerException</code> — use <code>getOrDefault(key, 0)</code> when counting.</p>
</div>
<div class="ml-vi">
<p>Cách sửa: dùng <code>.equals()</code>, hoặc mở hộp (unbox) về <code>int</code> trước. Và để ý dòng cuối: mở hộp một khoá không có (<code>null</code>) vào <code>int</code> sẽ ném <code>NullPointerException</code> — khi đếm hãy dùng <code>getOrDefault(key, 0)</code>.</p>
</div>

<div class="ml-en">
<h3>Where this pattern lives in real systems</h3>
<ul>
<li><strong>Deduplication.</strong> This very website's music-history API keeps only the most recent play of each track with <code>const seen = new Set&lt;number&gt;()</code> + <code>filter</code>; the exam-question API removes duplicated PE questions by a <em>normalised prompt</em> key — Group Anagrams' "canonical key" idea in production.</li>
<li><strong>Caches.</strong> Redis, the browser HTTP cache, a CDN: all are giant key → value maps. "Cache by URL" is choosing the key; forgetting a header in the key is the classic cache bug.</li>
<li><strong>Database indexes and joins.</strong> PostgreSQL's <em>hash join</em> builds a hash table from the smaller table and probes it with the other — Two Sum's "store one side, look up the other" at the scale of millions of rows.</li>
<li><strong>Counting.</strong> Rate limiters count requests per user key (Chapter 2 turns this into a sliding window); analytics count events per day.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Mẫu này sống ở đâu trong hệ thống thật</h3>
<ul>
<li><strong>Khử trùng (deduplication).</strong> Chính API lịch sử nghe nhạc của trang này giữ lại lượt nghe gần nhất của mỗi bài bằng <code>const seen = new Set&lt;number&gt;()</code> + <code>filter</code>; API câu hỏi thi loại các câu PE bị trùng theo khoá "đề bài đã chuẩn hoá" — đúng ý tưởng "khoá chuẩn hoá" của Group Anagrams, chạy ở production.</li>
<li><strong>Cache.</strong> Redis, cache HTTP của trình duyệt, CDN: đều là những map khoá → giá trị khổng lồ. "Cache theo URL" là chọn khoá; quên đưa một header vào khoá là lỗi cache kinh điển (người này thấy dữ liệu của người kia).</li>
<li><strong>Chỉ mục và phép JOIN của CSDL.</strong> <em>Hash join</em> của PostgreSQL dựng bảng băm từ bảng nhỏ hơn rồi dò nó bằng từng dòng của bảng kia — chính là "cất một bên, tra bên kia" của Two Sum ở quy mô hàng triệu dòng.</li>
<li><strong>Đếm.</strong> Bộ giới hạn tốc độ (rate limiter) đếm request theo khoá người dùng (Chương 2 biến nó thành cửa sổ trượt); hệ thống thống kê đếm sự kiện theo ngày.</li>
</ul>
${lienKet({ khoa: 'postgresql', bai: 'postgresql-10-2-chien-luoc-join', title: 'PostgreSQL 10.2 — Chiến lược JOIN: Nested Loop, Hash &amp; Merge', sub: 'Thấy hash join trong EXPLAIN của một truy vấn thật', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: a sample exchange</h3>
${hoiThoai([
  ['I', 'Given an array and a target, return indices of two numbers that add up to the target.'],
  ['C', 'Before I start — can the array contain negatives or duplicates? Is there always exactly one answer, and can I use the same element twice?'],
  ['N', 'Clarifying questions first. Each answer changes the code: duplicates decide "check before insert", "exactly one answer" removes the not-found case.'],
  ['I', 'Negatives and duplicates are possible, exactly one answer, not the same element twice.'],
  ['C', 'The simplest approach checks every pair — O(n²) time, O(1) space. That works, but the inner loop is only searching for target minus the current value, so I can remember values I have seen in a hash map and find the partner in O(1). One pass, O(n) time, O(n) space. Shall I code that?'],
  ['N', 'Brute force in one sentence, then name the waste, then the improvement with both complexities. Ask before coding.'],
  ['I', 'Go ahead.'],
  ['C', '(while coding) I check the map before inserting, so an element can’t pair with itself… Let me trace [3, 3] with target 6: at index 0 the map is empty, I store 3→0; at index 1 need is 3, found at 0, return [0, 1]. Good.'],
  ['N', 'Narrate the one subtle decision, then test with the edge case that the decision exists for.'],
  ['I', 'What if the array were sorted?'],
  ['C', 'Then two pointers from both ends give O(n) time with O(1) extra space — that’s Chapter 2’s pattern, and it would be my choice if memory mattered.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: một đoạn hội thoại mẫu</h3>
<p>Phỏng vấn ở công ty nước ngoài thường bằng tiếng Anh — bản tiếng Anh nằm ở khối EN; dưới đây là cùng mạch đó bằng tiếng Việt, kèm cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Cho một mảng và một target, trả về chỉ số hai số có tổng bằng target.'],
  ['C', 'Trước khi làm em hỏi chút — mảng có số âm hay phần tử trùng không ạ? Luôn có đúng một đáp án chứ, và có được dùng một phần tử hai lần không? <em>("Can the array contain duplicates? Is there always exactly one answer?")</em>'],
  ['N', 'Hỏi làm rõ trước. Mỗi câu trả lời đổi code: có phần tử trùng ⇒ quyết định "tra trước, cất sau"; "đúng một đáp án" ⇒ bỏ được nhánh không tìm thấy.'],
  ['I', 'Có thể có số âm và trùng, đúng một đáp án, không dùng một phần tử hai lần.'],
  ['C', 'Cách đơn giản nhất là thử mọi cặp — O(n²) thời gian, O(1) bộ nhớ. Chạy đúng, nhưng vòng trong chỉ đang tìm target trừ giá trị hiện tại, nên em có thể nhớ các giá trị đã thấy trong một hash map và tìm "người còn lại" trong O(1). Một lượt, O(n) thời gian, O(n) bộ nhớ. Em code bản này nhé? <em>("Shall I code that?")</em>'],
  ['N', 'Vét cạn trong một câu, chỉ ra chỗ phí, rồi cách cải tiến kèm cả hai độ phức tạp. Hỏi trước khi code.'],
  ['I', 'Ừ, làm đi.'],
  ['C', '(vừa code vừa nói) Em tra map trước khi cất, nên một phần tử không tự ghép với chính nó… Em chạy tay [3, 3], target 6: ở chỉ số 0 map rỗng, cất 3→0; ở chỉ số 1 need là 3, có ở 0, trả về [0, 1]. Đúng.'],
  ['N', 'Thuật lại đúng MỘT quyết định tinh tế, rồi test bằng đúng trường hợp biên mà quyết định đó sinh ra để xử lý.'],
  ['I', 'Nếu mảng đã được sắp xếp thì sao?'],
  ['C', 'Khi đó hai con trỏ từ hai đầu cho O(n) thời gian và chỉ O(1) bộ nhớ phụ — đó là mẫu của Chương 2, và em sẽ chọn nó nếu bộ nhớ quan trọng.'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Inserting before checking ⇒ an element pairs with itself (<code>[3, 3]</code> vs <code>[3]</code> with target 6).</li>
<li>Storing index → value instead of value → index: the map must be keyed by what you <em>search for</em>.</li>
<li>Using an array as a key in TypeScript (<code>map.set([1,2], …)</code>) — arrays are compared by reference, the lookup never hits. Join them into a string key.</li>
<li>Saying "O(1)" without "on average", or forgetting that building the map costs O(n) <em>memory</em>.</li>
<li>Reaching for a map when the input is sorted or the alphabet is tiny — two pointers or <code>int[26]</code> are simpler and use less memory.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Cất trước rồi mới tra ⇒ một phần tử tự ghép với chính nó (<code>[3, 3]</code> khác hẳn <code>[3]</code> khi target 6).</li>
<li>Lưu chỉ số → giá trị thay vì giá trị → chỉ số: map phải dùng thứ bạn <em>đi tìm</em> làm khoá.</li>
<li>Dùng mảng làm khoá trong TypeScript (<code>map.set([1,2], …)</code>) — mảng so theo tham chiếu, tra không bao giờ trúng. Hãy nối thành chuỗi.</li>
<li>Nói "O(1)" mà thiếu chữ "trung bình", hoặc quên rằng dựng map tốn O(n) <em>bộ nhớ</em>.</li>
<li>Vớ ngay map khi đầu vào đã sắp xếp hay bảng chữ rất nhỏ — hai con trỏ hoặc <code>int[26]</code> đơn giản hơn và đỡ tốn bộ nhớ hơn.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Tên đề giữ nguyên tiếng Anh để bạn tìm được trên LeetCode/NeetCode. Lời giải từng bước của 8 đề tổng hợp nằm ở bài 1.5 (Bộ luyện 1).</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Without looking, write Two Sum (hash map version) in the language you will interview in. Run it on <code>[2,7,11,15], 9</code>, <code>[3,2,4], 6</code>, <code>[3,3], 6</code>.</li>
<li>Swap the two lines (insert first, then check) and run <code>[3], 6</code> on the one-element array: write down what goes wrong and why.</li>
<li>Submit LC 1, LC 217 and LC 242 on LeetCode. For each, write one line in your notebook: <em>signal → tool → complexity</em> (e.g. "pair with sum, unsorted → map value→index → O(n)/O(n)").</li>
<li>Bonus: solve LC 128 and explain to yourself, out loud, why it is O(n) despite the inner while.</li>
</ol>
<p><strong>Done when:</strong> three accepted submissions, the swapped-lines bug explained in one sentence, and three notebook lines.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">hash map / hash set</span><span class="v">Key → value store (or keys only) with O(1) average lookup, insert, delete.</span></div>
  <div class="kv"><span class="k">complement</span><span class="v">The partner you need: target − current value.</span></div>
  <div class="kv"><span class="k">canonical key</span><span class="v">A normalised value equal exactly for items that belong together (sorted letters, counts).</span></div>
  <div class="kv"><span class="k">expected / average O(1)</span><span class="v">Fast when keys spread over buckets; O(n) per operation in the worst case.</span></div>
  <div class="kv"><span class="k">collision</span><span class="v">Two different keys in the same bucket.</span></div>
  <div class="kv"><span class="k">hash flooding (HashDoS)</span><span class="v">An attack that sends many colliding keys so the server's hash table degrades.</span></div>
  <div class="kv"><span class="k">boxing / unboxing</span><span class="v">Java wrapping <code>int</code> into <code>Integer</code> and back; the source of the <code>==</code> trap.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>A nested loop that searches can usually be replaced by a map that remembers.</li>
<li>Two Sum: one pass, check <code>target − x</code> before inserting <code>x</code>; O(n) time, O(n) space.</li>
<li>Counting uses a map, or <code>int[26]</code> when the alphabet is small.</li>
<li>Grouping is choosing a canonical key; the rest is boilerplate.</li>
<li>O(1) is an average: bad hashes make it O(n), and attackers exploit that.</li>
<li>Use <code>Map</code>/<code>Set</code>, not <code>{}</code>; in Java compare <code>Integer</code> with <code>equals</code>.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Arrays &amp; Hashing', 'The standard order of the first 9 problems, with video solutions', 'https://neetcode.io/roadmap')}
${nguon('📙', 'Java HashMap (Java SE 21 API)', 'Official documentation: load factor, iteration order, getOrDefault, computeIfAbsent', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html')}
${nguon('🔐', 'oCERT-2011-003 — hash table collisions DoS', 'The original advisory of the 2011 hash flooding attack', 'https://ocert.org/advisories/ocert-2011-003.html')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Không nhìn bài, viết Two Sum (bản hash map) bằng ngôn ngữ bạn sẽ dùng khi phỏng vấn. Chạy với <code>[2,7,11,15], 9</code>, <code>[3,2,4], 6</code>, <code>[3,3], 6</code>.</li>
<li>Đảo hai dòng (cất trước, tra sau) rồi chạy mảng một phần tử <code>[3], 6</code>: ghi lại điều gì sai và vì sao.</li>
<li>Nộp LC 1, LC 217 và LC 242 trên LeetCode. Mỗi đề ghi một dòng vào sổ: <em>dấu hiệu → công cụ → độ phức tạp</em> (vd "cặp có tổng, chưa sắp xếp → map giá trị→chỉ số → O(n)/O(n)").</li>
<li>Thêm: giải LC 128 và tự giải thích to thành tiếng vì sao nó là O(n) dù có vòng while bên trong.</li>
</ol>
<p><strong>Đạt khi:</strong> ba lượt nộp Accepted, giải thích được lỗi đảo dòng trong một câu, và có ba dòng trong sổ.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">hash map / hash set (bảng băm / tập băm)</span><span class="v">Nơi lưu khoá → giá trị (hoặc chỉ khoá), tra/chèn/xoá O(1) trung bình.</span></div>
  <div class="kv"><span class="k">complement (phần bù)</span><span class="v">"Người còn lại" cần tìm: target − giá trị hiện tại.</span></div>
  <div class="kv"><span class="k">canonical key (khoá chuẩn hoá)</span><span class="v">Giá trị sau khi chuẩn hoá, bằng nhau đúng khi hai thứ thuộc cùng nhóm (chữ đã sắp xếp, bộ đếm).</span></div>
  <div class="kv"><span class="k">expected / average O(1) (O(1) kỳ vọng / trung bình)</span><span class="v">Nhanh khi khoá trải đều các ô; xấu nhất O(n) mỗi thao tác.</span></div>
  <div class="kv"><span class="k">collision (va chạm)</span><span class="v">Hai khoá khác nhau rơi vào cùng một ô.</span></div>
  <div class="kv"><span class="k">hash flooding / HashDoS (làm ngập bảng băm)</span><span class="v">Tấn công gửi thật nhiều khoá va chạm để bảng băm của máy chủ suy biến, CPU 100 %.</span></div>
  <div class="kv"><span class="k">boxing / unboxing (đóng hộp / mở hộp)</span><span class="v">Java bọc <code>int</code> thành <code>Integer</code> và ngược lại; gốc của bẫy <code>==</code>.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Vòng lặp lồng đi TÌM thường thay được bằng một map biết NHỚ.</li>
<li>Two Sum: một lượt, tra <code>target − x</code> trước khi cất <code>x</code>; O(n) thời gian, O(n) bộ nhớ.</li>
<li>Đếm thì dùng map, hoặc <code>int[26]</code> khi bảng chữ nhỏ.</li>
<li>Gom nhóm = chọn khoá chuẩn hoá; phần còn lại là thủ tục.</li>
<li>O(1) chỉ là trung bình: băm tồi biến nó thành O(n), và kẻ tấn công lợi dụng điều đó.</li>
<li>Dùng <code>Map</code>/<code>Set</code>, không dùng <code>{}</code>; trong Java so <code>Integer</code> bằng <code>equals</code>.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Arrays &amp; Hashing', 'Thứ tự chuẩn của 9 đề đầu tiên, có video lời giải (tiếng Anh)', 'https://neetcode.io/roadmap')}
${nguon('📙', 'Java HashMap (Java SE 21 API)', 'Tài liệu chính thức: hệ số tải, thứ tự duyệt, getOrDefault, computeIfAbsent', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/HashMap.html')}
${nguon('🔐', 'oCERT-2011-003 — hash table collisions DoS', 'Thông báo gốc về vụ tấn công làm ngập bảng băm năm 2011', 'https://ocert.org/advisories/ocert-2011-003.html')}
</div>
`,
};
