/** 2.4 — Bộ luyện 2. Mọi mã/output đọc từ ../ma/ch02 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, moPhong, nguon, gap, baiNay } from '../_chung.mjs';
import { vetSortColors } from '../ma/ch02/sort-colors.vet.mjs';

const L977 = lc(977, 'squares-of-a-sorted-array', 'Squares of a Sorted Array', 'Easy');
const L680 = lc(680, 'valid-palindrome-ii', 'Valid Palindrome II', 'Easy');
const L234 = lc(234, 'palindrome-linked-list', 'Palindrome Linked List', 'Easy');
const L75 = lc(75, 'sort-colors', 'Sort Colors', 'Medium');
const L16 = lc(16, '3sum-closest', '3Sum Closest', 'Medium');
const L424 = lc(424, 'longest-repeating-character-replacement', 'Longest Repeating Character Replacement', 'Medium');
const L438 = lc(438, 'find-all-anagrams-in-a-string', 'Find All Anagrams in a String', 'Medium');
const L2302 = lc(2302, 'count-subarrays-with-score-less-than-k', 'Count Subarrays With Score Less Than K', 'Hard');

const THU_TU = [
  [L977, 'converging pointers, fill from the back', 'hai con trỏ đối đầu, điền từ cuối', '15′'],
  [L680, 'converging pointers + one branch', 'hai con trỏ đối đầu + một lần rẽ nhánh', '15′'],
  [L234, 'fast/slow (first middle) + reverse', 'nhanh/chậm (điểm giữa thứ nhất) + đảo danh sách', '15′'],
  [L75, 'three pointers (Dutch flag)', 'ba con trỏ (cờ Hà Lan)', '25′'],
  [L16, 'sort + fix one + two pointers', 'sắp xếp + cố định một + hai con trỏ', '25′'],
  [L424, 'variable window with a budget', 'cửa sổ co giãn có ngân sách', '25′'],
  [L438, 'fixed window + counts', 'cửa sổ cố định + bộ đếm', '25′'],
  [L2302, 'variable window, count subarrays', 'cửa sổ co giãn, đếm mảng con', '40′'],
];
const bangThuTu = (en) => `<table class="bang-de">\n<thead><tr><th>#</th><th>${en ? 'Problem' : 'Đề'}</th><th>${en ? 'Pattern' : 'Mẫu'}</th><th>${en ? 'Target time' : 'Thời gian mục tiêu'}</th></tr></thead>\n<tbody>\n` +
  THU_TU.map((d, i) => `<tr><td>${i + 1}</td><td>${d[0]}</td><td>${en ? d[1] : d[2]}</td><td>${d[3]}</td></tr>`).join('\n') + '\n</tbody></table>';

/* Bảng vết Sort Colors trên [1,2,0,2,1,0,1]. */
const SC = [1, 2, 0, 2, 1, 0, 1];
const BANG_SC = bangVet(['step', 'nums[mid]', 'action', 'array after the step', 'lo', 'mid', 'hi'],
  vetSortColors(SC).map((h, k) => [
    String(k + 1), String(h.x), h.viec,
    oMang(h.mang, {
      to: Object.fromEntries(h.mang.map((_, i) => [i, i < h.lo ? 'l' : i < h.mid ? 'cs' : i > h.hi ? 'r' : 'mo'])),
      nhan: { ...(h.mid <= h.hi ? { [h.mid]: 'm' } : {}) },
    }),
    String(h.lo), String(h.mid), String(h.hi),
  ]));

export default {
  title: '2.4 — Practice set 2: eight problems with step-by-step solutions|||2.4 — Bộ luyện 2: tám đề có lời giải từng bước',
  slug: 'dsa-2-4-luyen',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tám đề từ dễ tới khó phủ cả chương: bình phương mảng đã sắp, palindrome xoá một ký tự, danh sách liên kết đối xứng, cờ Hà Lan, 3Sum gần nhất, thay ký tự lặp dài nhất, tìm mọi anagram, đếm mảng con có điểm nhỏ hơn k — mỗi đề có gợi ý gập, lời giải TS + Java chạy thật và ca biên.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Practice set 2: eight problems with step-by-step solutions</h2>
<p class="lead">Eight problems, easy to hard, chosen so that every pattern of the chapter appears at least once: converging pointers, read/write and three-way partition, fast and slow, fixed and variable windows, and counting with a window. None of them is one of the worked examples of lessons 2.1–2.3, so this is where you find out whether you learned the <em>pattern</em> or only the problem.</p>

<h3>How to use this set</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Restate and classify (2 min)</span><span class="lz-d">Say the problem in your own words, then name the pattern and the variant ("longest window, shrink while invalid") before any code.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Start a timer</span><span class="lz-d">Easy 15′, Medium 25′, Hard 40′. Stuck halfway through the time? Open hint 1. Still stuck at the end? Hint 2, then a fresh 10 minutes.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Talk while you code</span><span class="lz-d">Out loud, as in the interview: invariant, why each pointer may move, complexity. Record yourself once a week.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Submit, then compare</span><span class="lz-d">Submit on LeetCode, then read the step-by-step solution even if you passed. Log: pattern → mistake → fix.</span></div>
</div>
${bangThuTu(true)}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Bộ luyện 2: tám đề có lời giải từng bước</h2>
<p class="lead">Tám đề, từ dễ tới khó, chọn sao cho mọi mẫu của chương đều xuất hiện ít nhất một lần: hai con trỏ đối đầu, đọc/ghi và phân hoạch ba phần, nhanh và chậm, cửa sổ cố định và co giãn, và đếm bằng cửa sổ. Không đề nào trùng với ví dụ giải mẫu của các bài 2.1–2.3, nên đây là nơi bạn biết mình đã học được <em>mẫu</em> hay chỉ học thuộc <em>đề</em>.</p>

<h3>Cách dùng bộ luyện này</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Diễn đạt lại và phân loại (2 phút)</span><span class="lz-d">Nói lại đề bằng lời của bạn, rồi gọi tên mẫu và biến thể ("cửa sổ dài nhất, co khi vi phạm") trước khi viết một dòng code.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Bấm giờ</span><span class="lz-d">Easy 15′, Medium 25′, Hard 40′. Hết nửa thời gian mà còn bí? Mở gợi ý 1. Hết giờ vẫn bí? Gợi ý 2, rồi cho mình thêm 10 phút mới.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Vừa code vừa nói</span><span class="lz-d">Nói to như lúc phỏng vấn: bất biến, vì sao từng con trỏ được dời, độ phức tạp. Mỗi tuần tự ghi âm một lần.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nộp rồi đối chiếu</span><span class="lz-d">Nộp trên LeetCode, rồi đọc lời giải từng bước kể cả khi đã qua. Ghi sổ: mẫu → lỗi mắc → cách sửa.</span></div>
</div>
${bangThuTu(false)}
<p>Chưa chắc phần nào thì quay lại bài gốc: <a href="${baiNay('dsa-2-1-hai-con-tro')}">2.1 Hai con trỏ</a> · <a href="${baiNay('dsa-2-2-cua-so')}">2.2 Cửa sổ trượt</a> · <a href="${baiNay('dsa-2-3-nhanh-cham')}">2.3 Nhanh chậm</a>. Khung 6 bước chung cho mọi đề nằm ở <a href="${baiNay('dsa-0-2-khung')}">bài 0.2</a>.</p>
</div>

<div class="ml-en">
<h3>1 · Squares of a Sorted Array — ${L977}</h3>
<p><strong>Problem.</strong> <code>nums</code> is sorted (it may contain negatives). Return the squares of all numbers, also sorted. <code>[-4, -1, 0, 3, 10]</code> → <code>[0, 1, 9, 16, 100]</code>. Follow-up: O(n), not "square then sort".</p>
<p><strong>Recognising the pattern.</strong> Sorted input + "O(n)" + the trouble is at <em>both</em> ends (big negatives and big positives both give big squares) ⇒ converging pointers.</p>
${gap('💡 Hint 1', '<p>Where in the input can the <em>largest</em> square be? Only at index 0 or index n − 1.</p>')}
${gap('💡 Hint 2', '<p>So fill the answer from the back: compare <code>|nums[l]|</code> and <code>|nums[r]|</code>, write the bigger square at position w, move that pointer, w−−.</p>')}
${gap('✅ Step-by-step solution', '<p>Squaring then sorting is O(n log n) — a fine first answer. To get O(n): the sequence of squares is "decreasing, then increasing" (a valley around 0), so its maximum is at one of the ends. Keep <code>l = 0</code>, <code>r = n − 1</code> and a write index <code>w</code> starting at the back; each step writes the larger of the two end squares and discards that end. Each element is written once: O(n) time, O(n) for the output (O(1) extra). Edge cases tried: all negative, all positive, a single 0, a tie of absolute values (<code>-3</code> and <code>3</code>: either order is fine because the squares are equal).</p>')}
</div>
<div class="ml-vi">
<h3>1 · Squares of a Sorted Array — ${L977}</h3>
<p><strong>Đề.</strong> <code>nums</code> đã sắp xếp (có thể có số âm). Trả về bình phương của mọi số, cũng đã sắp xếp. <code>[-4, -1, 0, 3, 10]</code> → <code>[0, 1, 9, 16, 100]</code>. Câu hỏi nối tiếp: O(n), không phải "bình phương rồi sắp xếp".</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Đầu vào đã sắp + "O(n)" + rắc rối nằm ở <em>cả hai</em> đầu (số âm lớn và số dương lớn đều cho bình phương lớn) ⇒ hai con trỏ đối đầu.</p>
${gap('💡 Gợi ý 1', '<p>Bình phương <em>lớn nhất</em> có thể nằm ở đâu trong đầu vào? Chỉ ở chỉ số 0 hoặc n − 1.</p>')}
${gap('💡 Gợi ý 2', '<p>Vậy điền đáp án từ cuối lên: so <code>|nums[l]|</code> với <code>|nums[r]|</code>, ghi bình phương lớn hơn vào vị trí w, dời con trỏ đó, w−−.</p>')}
${gap('✅ Lời giải từng bước', '<p>Bình phương rồi sắp xếp là O(n log n) — câu trả lời đầu tiên ổn. Muốn O(n): dãy bình phương có dạng "giảm rồi tăng" (một thung lũng quanh số 0), nên giá trị lớn nhất nằm ở một trong hai đầu. Giữ <code>l = 0</code>, <code>r = n − 1</code> và chỉ số ghi <code>w</code> bắt đầu từ cuối; mỗi bước ghi bình phương lớn hơn trong hai đầu rồi bỏ đầu đó. Mỗi phần tử được ghi một lần: O(n) thời gian, O(n) cho mảng kết quả (O(1) bộ nhớ phụ). Ca biên đã thử: toàn số âm, toàn số dương, một số 0, hai trị tuyệt đối bằng nhau (<code>-3</code> và <code>3</code>: thứ tự nào cũng được vì hai bình phương bằng nhau).</p>')}
</div>
${maHai('ch02/sorted-squares.ts', 'ch02/SortedSquares.java', { vung: 'giai' })}
${ketQua('ch02/sorted-squares.ts')}

<div class="ml-en">
<h3>2 · Valid Palindrome II — ${L680}</h3>
<p><strong>Problem.</strong> Can <code>s</code> become a palindrome after deleting <em>at most one</em> character? <code>"abca"</code> → true (delete b or c), <code>"abc"</code> → false.</p>
<p><strong>Recognising the pattern.</strong> "Palindrome" ⇒ compare from both ends. "At most one deletion" ⇒ the first mismatch is the only place where a choice exists.</p>
${gap('💡 Hint 1', '<p>Walk inward while the ends match. Nothing before the first mismatch needs to change.</p>')}
${gap('💡 Hint 2', '<p>At the first mismatch (l, r) you must delete either <code>s[l]</code> or <code>s[r]</code>. Check both remaining ranges with a plain palindrome check. Do not try to guess which one.</p>')}
${gap('✅ Step-by-step solution', '<p>Brute force deletes each of the n characters and checks: O(n²). Better: matching outer pairs never need a deletion, so walk inward to the first mismatch. There, the deleted character must be <code>s[l]</code> or <code>s[r]</code> — any other deletion leaves this mismatching pair in place. Check <code>s[l+1..r]</code> and <code>s[l..r−1]</code>; if either is a palindrome, answer true. Each check is O(n) and there are at most two: O(n) time, O(1) memory. Edge cases: one character, already a palindrome, <code>"cbbcc"</code> (only deleting the RIGHT side works — see the trap below).</p>')}
<div class="pitfall co-tieu-de"><p><strong>Trying only one side.</strong></p><p>A "greedy" version that always deletes the left character passes most examples and fails <code>"cbbcc"</code>: at the mismatch (b, c), deleting b leaves <code>"bc"</code>, deleting c leaves <code>"bb"</code>. The output below has both versions side by side.</p></div>
</div>
<div class="ml-vi">
<h3>2 · Valid Palindrome II — ${L680}</h3>
<p><strong>Đề.</strong> <code>s</code> có thành palindrome (chuỗi đối xứng) sau khi xoá <em>tối đa một</em> ký tự không? <code>"abca"</code> → true (xoá b hoặc c), <code>"abc"</code> → false.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Palindrome" ⇒ so từ hai đầu. "Xoá tối đa một" ⇒ chỗ lệch đầu tiên là nơi duy nhất có lựa chọn.</p>
${gap('💡 Gợi ý 1', '<p>Đi vào trong chừng nào hai đầu còn khớp. Mọi thứ trước chỗ lệch đầu tiên không cần thay đổi.</p>')}
${gap('💡 Gợi ý 2', '<p>Ở chỗ lệch đầu tiên (l, r) bạn buộc phải xoá <code>s[l]</code> hoặc <code>s[r]</code>. Kiểm cả hai đoạn còn lại bằng một phép kiểm palindrome thường. Đừng cố đoán xoá bên nào.</p>')}
${gap('✅ Lời giải từng bước', '<p>Vét cạn xoá thử từng ký tự trong n ký tự rồi kiểm: O(n²). Tốt hơn: các cặp ngoài cùng đã khớp thì không bao giờ cần xoá, nên đi vào tới chỗ lệch đầu tiên. Ở đó, ký tự bị xoá phải là <code>s[l]</code> hoặc <code>s[r]</code> — xoá ký tự nào khác thì cặp lệch này vẫn còn nguyên. Kiểm <code>s[l+1..r]</code> và <code>s[l..r−1]</code>; đoạn nào là palindrome thì trả true. Mỗi phép kiểm O(n) và có tối đa hai phép: O(n) thời gian, O(1) bộ nhớ. Ca biên: một ký tự, vốn đã đối xứng, <code>"cbbcc"</code> (chỉ xoá bên PHẢI mới được — xem bẫy dưới).</p>')}
<div class="pitfall co-tieu-de"><p><strong>Chỉ thử một bên.</strong></p><p>Bản "tham lam" luôn xoá ký tự bên trái qua được hầu hết ví dụ và trượt ở <code>"cbbcc"</code>: tại chỗ lệch (b, c), xoá b còn <code>"bc"</code>, xoá c còn <code>"bb"</code>. Output dưới đây để hai bản cạnh nhau.</p></div>
</div>
${maHai('ch02/valid-palindrome-ii.ts', 'ch02/ValidPalindromeII.java', { vung: 'giai' })}
${ma('ch02/valid-palindrome-ii.ts', { vung: 'sai', nhan: 'TypeScript — wrong (left side only)' })}
${ketQua('ch02/valid-palindrome-ii.ts')}

<div class="ml-en">
<h3>3 · Palindrome Linked List — ${L234}</h3>
<p><strong>Problem.</strong> Is a singly linked list a palindrome? <code>1 → 2 → 2 → 1</code> → true. Follow-up: O(n) time and O(1) extra memory.</p>
<p><strong>Recognising the pattern.</strong> You cannot walk a singly linked list backwards, so "compare from both ends" needs a trick: find the middle with fast/slow, reverse the second half, then walk both halves forward.</p>
${gap('💡 Hint 1', '<p>Copying the values into an array and using two pointers is O(n) memory — a fine first answer. For O(1), which half could you turn around?</p>')}
${gap('💡 Hint 2', '<p>Use the <em>first</em> middle (<code>fast.next &amp;&amp; fast.next.next</code>), reverse <code>slow.next …</code>, compare from head and from the reversed half until the reversed half ends. Then reverse it back.</p>')}
${gap('✅ Step-by-step solution', '<p>Three building blocks you already know. (1) Fast/slow to the first middle: for odd length it is the exact middle, for even length the end of the left half, so the right half is never longer than the left. (2) Reverse the right half in place (three pointers: prev, current, next — lesson 3.3 goes deeper). (3) Compare node by node while the reversed half has nodes. Finally restore the list: an interviewer will ask "did you just destroy my input?", and the good answer is "no, I reversed it back". O(n) time, O(1) memory. Edge cases: one node, two different nodes, odd length, a list whose first and last values match but whose middle does not (<code>1, 2, 3, 1</code>).</p>')}
</div>
<div class="ml-vi">
<h3>3 · Palindrome Linked List — ${L234}</h3>
<p><strong>Đề.</strong> Một danh sách liên kết đơn có đối xứng không? <code>1 → 2 → 2 → 1</code> → true. Câu hỏi nối tiếp: O(n) thời gian và O(1) bộ nhớ phụ.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Danh sách liên kết đơn không đi lùi được, nên "so từ hai đầu" cần một mẹo: tìm điểm giữa bằng nhanh/chậm, đảo nửa sau, rồi đi tới trên cả hai nửa.</p>
${gap('💡 Gợi ý 1', '<p>Chép các giá trị ra một mảng rồi dùng hai con trỏ tốn O(n) bộ nhớ — câu trả lời đầu tiên ổn. Muốn O(1), bạn có thể quay đầu nửa nào?</p>')}
${gap('💡 Gợi ý 2', '<p>Dùng điểm giữa <em>thứ nhất</em> (<code>fast.next &amp;&amp; fast.next.next</code>), đảo <code>slow.next …</code>, so từ head và từ nửa đã đảo cho tới khi nửa đã đảo hết. Rồi đảo nó lại như cũ.</p>')}
${gap('✅ Lời giải từng bước', '<p>Ba viên gạch bạn đã biết. (1) Nhanh/chậm tới điểm giữa thứ nhất: độ dài lẻ thì đúng chính giữa, độ dài chẵn thì là cuối nửa trái, nên nửa phải không bao giờ dài hơn nửa trái. (2) Đảo nửa phải tại chỗ (ba con trỏ: prev, current, next — bài 3.3 đi sâu hơn). (3) So từng nút chừng nào nửa đã đảo còn nút. Cuối cùng trả danh sách về như cũ: người phỏng vấn sẽ hỏi "em vừa phá đầu vào của anh à?", câu trả lời tốt là "không, em đã đảo lại". O(n) thời gian, O(1) bộ nhớ. Ca biên: một nút, hai nút khác nhau, độ dài lẻ, danh sách có giá trị đầu và cuối khớp nhưng phần giữa lệch (<code>1, 2, 3, 1</code>).</p>')}
</div>
${maHai('ch02/palindrome-list.ts', 'ch02/PalindromeList.java', { vung: 'giai' })}
${ketQua('ch02/palindrome-list.ts')}

<div class="ml-en">
<h3>4 · Sort Colors — ${L75}</h3>
<p><strong>Problem.</strong> An array of 0s, 1s and 2s (red, white, blue). Sort it in place, in one pass, without a library sort. <code>[2, 0, 2, 1, 1, 0]</code> → <code>[0, 0, 1, 1, 2, 2]</code>.</p>
<p><strong>Recognising the pattern.</strong> "In place, one pass, three groups" ⇒ the read/write idea with <em>two</em> write boundaries: Dijkstra’s Dutch national flag partition.</p>
${gap('💡 Hint 1', '<p>Counting (how many 0s, 1s, 2s, then overwrite) is two passes. For one pass, keep the 0s growing from the left and the 2s growing from the right.</p>')}
${gap('💡 Hint 2', '<p>Three pointers: <code>[0, lo)</code> = 0s, <code>[lo, mid)</code> = 1s, <code>[mid, hi]</code> = unseen, <code>(hi, end]</code> = 2s. Look at <code>nums[mid]</code> and decide which zone it joins.</p>')}
${gap('✅ Step-by-step solution', '<p>Write the invariant first — that is what makes the code obvious. <code>nums[mid] = 0</code>: swap it to <code>lo</code>, grow both lo and mid (the value that comes back from lo is a 1, already seen). <code>= 1</code>: just <code>mid++</code>. <code>= 2</code>: swap it to <code>hi</code> and <code>hi−−</code>, but do <strong>not</strong> move mid: the value that came from hi has not been looked at yet. Loop while <code>mid &lt;= hi</code> (the unseen zone is not empty). Each step shrinks the unseen zone by one: O(n) time, O(1) memory. Edge cases: one element, no 1s at all, all the same color.</p>')}
</div>
<div class="ml-vi">
<h3>4 · Sort Colors — ${L75}</h3>
<p><strong>Đề.</strong> Một mảng chỉ có 0, 1 và 2 (đỏ, trắng, xanh). Sắp xếp tại chỗ, trong một lượt, không dùng hàm sort của thư viện. <code>[2, 0, 2, 1, 1, 0]</code> → <code>[0, 0, 1, 1, 2, 2]</code>.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Tại chỗ, một lượt, ba nhóm" ⇒ ý tưởng đọc/ghi nhưng có <em>hai</em> ranh giới ghi: phân hoạch cờ Hà Lan (Dutch national flag) của Dijkstra.</p>
${gap('💡 Gợi ý 1', '<p>Đếm (bao nhiêu số 0, 1, 2 rồi ghi đè) là hai lượt. Muốn một lượt, cho vùng số 0 lớn dần từ trái và vùng số 2 lớn dần từ phải.</p>')}
${gap('💡 Gợi ý 2', '<p>Ba con trỏ: <code>[0, lo)</code> = số 0, <code>[lo, mid)</code> = số 1, <code>[mid, hi]</code> = chưa xem, <code>(hi, end]</code> = số 2. Nhìn <code>nums[mid]</code> rồi quyết định nó vào vùng nào.</p>')}
${gap('✅ Lời giải từng bước', '<p>Viết bất biến trước — chính nó làm code trở nên hiển nhiên. <code>nums[mid] = 0</code>: đổi nó về <code>lo</code>, tăng cả lo lẫn mid (giá trị từ lo đổi sang là số 1, đã xem rồi). <code>= 1</code>: chỉ <code>mid++</code>. <code>= 2</code>: đổi nó sang <code>hi</code> rồi <code>hi−−</code>, nhưng <strong>không</strong> tăng mid: giá trị vừa từ hi đổi sang chưa được xem. Lặp khi <code>mid &lt;= hi</code> (vùng chưa xem còn phần tử). Mỗi bước vùng chưa xem nhỏ đi một: O(n) thời gian, O(1) bộ nhớ. Ca biên: một phần tử, không có số 1 nào, toàn một màu.</p>')}
</div>
${maHai('ch02/sort-colors.ts', 'ch02/SortColors.java', { vung: 'giai' })}
${ketQua('ch02/sort-colors.ts')}
<div class="ml-en">
<p>The trace on <code>[1, 2, 0, 2, 1, 0, 1]</code>: blue = the 0s zone, light green = the 1s zone, grey = unseen (m marks <code>mid</code>), orange = the 2s zone. Step 2 is the one to watch: a 2 is swapped to the back and a 1 comes in, and <code>mid</code> stays put so that step 3 can look at it.</p>
${moPhong('ch02/sort-colors.sim.js', 'en', 'Sort Colors — the Dutch national flag partition', 'Watch lo, mid and hi split the array into 0s | 1s | unseen | 2s in a single pass.')}
</div>
<div class="ml-vi">
<p>Vết chạy trên <code>[1, 2, 0, 2, 1, 0, 1]</code>: xanh dương = vùng số 0, xanh nhạt = vùng số 1, xám = chưa xem (m đánh dấu <code>mid</code>), cam = vùng số 2. Bước 2 là bước đáng nhìn: một số 2 bị đổi ra cuối và một số 1 đi vào, còn <code>mid</code> đứng yên để bước 3 xem nó.</p>
${moPhong('ch02/sort-colors.sim.js', 'vi', 'Sort Colors — phân hoạch cờ Hà Lan', 'Xem lo, mid và hi chia mảng thành số 0 | số 1 | chưa xem | số 2 trong đúng một lượt.')}
</div>
${BANG_SC}

<div class="ml-en">
<h3>5 · 3Sum Closest — ${L16}</h3>
<p><strong>Problem.</strong> Return the sum of three numbers (different positions) that is closest to <code>target</code>; exactly one closest sum exists. <code>[-1, 2, 1, -4]</code>, target 1 → 2 (−1 + 2 + 1).</p>
<p><strong>Recognising the pattern.</strong> It is 3Sum from lesson 2.1 with "equal" replaced by "as close as possible".</p>
${gap('💡 Hint 1', '<p>Sort, fix <code>a[i]</code>, and run two pointers on the rest. What do you do with a sum that is not equal to the target?</p>')}
${gap('💡 Hint 2', '<p>Update the best answer when <code>|sum − target|</code> improves; then move exactly like Two Sum II (sum too small ⇒ l++, too big ⇒ r−−). If the sum equals the target, return it immediately.</p>')}
${gap('✅ Step-by-step solution', '<p>The elimination argument still holds: with a fixed <code>a[i]</code>, if the sum is below target, pairing <code>a[l]</code> with anything smaller than <code>a[r]</code> only moves further below, so <code>a[l]</code> is done. So we still see every candidate that could be closest. Initialise <code>best</code> with a real triple (the first three), never with <code>Infinity</code> — <code>Math.abs(Infinity − target)</code> works in JS, but in Java <code>Integer.MAX_VALUE − target</code> overflows for negative targets. Deduplication is not needed: the answer is a number, not a list of triples. O(n²) time, O(1) extra memory (plus the sort). Edge cases: exactly three numbers, a target far below every sum (−100), the target reachable exactly (early return).</p>')}
</div>
<div class="ml-vi">
<h3>5 · 3Sum Closest — ${L16}</h3>
<p><strong>Đề.</strong> Trả về tổng của ba số (ở ba vị trí khác nhau) gần <code>target</code> nhất; đề đảm bảo có đúng một tổng gần nhất. <code>[-1, 2, 1, -4]</code>, target 1 → 2 (−1 + 2 + 1).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Đây là 3Sum của bài 2.1, chỉ thay "bằng" bằng "càng gần càng tốt".</p>
${gap('💡 Gợi ý 1', '<p>Sắp xếp, cố định <code>a[i]</code>, rồi chạy hai con trỏ trên phần còn lại. Gặp một tổng không bằng target thì làm gì?</p>')}
${gap('💡 Gợi ý 2', '<p>Cập nhật đáp án tốt nhất khi <code>|sum − target|</code> nhỏ đi; rồi dời y như Two Sum II (tổng nhỏ quá ⇒ l++, lớn quá ⇒ r−−). Tổng bằng đúng target thì trả về ngay.</p>')}
${gap('✅ Lời giải từng bước', '<p>Lập luận loại trừ vẫn đúng: với <code>a[i]</code> cố định, nếu tổng dưới target thì ghép <code>a[l]</code> với số nào nhỏ hơn <code>a[r]</code> cũng chỉ càng xa xuống dưới, nên <code>a[l]</code> đã xong. Vậy ta vẫn gặp đủ mọi ứng viên có thể là gần nhất. Khởi tạo <code>best</code> bằng một bộ ba thật (ba số đầu), đừng bằng <code>Infinity</code> — <code>Math.abs(Infinity − target)</code> chạy được trong JS, nhưng trong Java <code>Integer.MAX_VALUE − target</code> tràn số khi target âm. Không cần khử trùng: đáp án là một con số, không phải danh sách bộ ba. O(n²) thời gian, O(1) bộ nhớ phụ (cộng phần sắp xếp). Ca biên: đúng ba số, target thấp hơn mọi tổng rất xa (−100), target đạt được đúng (trả về sớm).</p>')}
</div>
${maHai('ch02/three-sum-closest.ts', 'ch02/ThreeSumClosest.java', { vung: 'giai' })}
${ketQua('ch02/three-sum-closest.ts')}

<div class="ml-en">
<h3>6 · Longest Repeating Character Replacement — ${L424}</h3>
<p><strong>Problem.</strong> Uppercase string <code>s</code> and an integer k. You may replace at most k characters. Return the length of the longest substring that can be made of one repeated letter. <code>"AABABBA"</code>, k = 1 → 4 (<code>"AABA"</code> → <code>"AAAA"</code>).</p>
<p><strong>Recognising the pattern.</strong> "Longest substring such that…" + "at most k" ⇒ variable window, shrink while invalid. The only question is how to state "valid".</p>
${gap('💡 Hint 1', '<p>In a window, which letter would you keep, and how many characters would you have to replace?</p>')}
${gap('💡 Hint 2', '<p>Keep the most frequent letter; replacements needed = <code>length − maxFreq</code>. Valid ⇔ <code>length − maxFreq ≤ k</code>. Keep 26 counts and a running <code>maxf</code>.</p>')}
${gap('✅ Step-by-step solution', '<p>Grow r and update <code>cnt</code> and <code>maxf</code>; while <code>(r − l + 1) − maxf &gt; k</code>, shrink. The subtle point that interviewers ask about: when we shrink we never <em>decrease</em> <code>maxf</code>, so it can be stale (larger than the true maximum of the current window). That is still correct for the <em>answer</em>: the best length only improves when some letter reaches a new, higher frequency, and a stale <code>maxf</code> only lets the window keep its size instead of shrinking — it never records a length that was not achieved earlier. O(n) time (O(26n) if you recompute the maximum honestly), O(26) memory. Edge cases: k = 0 (longest run of one letter), k ≥ length (the whole string), all different letters.</p>')}
</div>
<div class="ml-vi">
<h3>6 · Longest Repeating Character Replacement — ${L424}</h3>
<p><strong>Đề.</strong> Chuỗi chữ in hoa <code>s</code> và số nguyên k. Bạn được thay tối đa k ký tự. Trả về độ dài chuỗi con dài nhất có thể biến thành toàn một chữ cái lặp lại. <code>"AABABBA"</code>, k = 1 → 4 (<code>"AABA"</code> → <code>"AAAA"</code>).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Chuỗi con dài nhất sao cho…" + "tối đa k" ⇒ cửa sổ co giãn, co khi vi phạm. Câu hỏi duy nhất là viết điều kiện "hợp lệ" thế nào.</p>
${gap('💡 Gợi ý 1', '<p>Trong một cửa sổ, bạn sẽ giữ chữ nào, và phải thay bao nhiêu ký tự?</p>')}
${gap('💡 Gợi ý 2', '<p>Giữ chữ xuất hiện nhiều nhất; số lần thay cần = <code>độ dài − maxFreq</code>. Hợp lệ ⇔ <code>độ dài − maxFreq ≤ k</code>. Giữ 26 bộ đếm và một biến <code>maxf</code>.</p>')}
${gap('✅ Lời giải từng bước', '<p>Tăng r, cập nhật <code>cnt</code> và <code>maxf</code>; chừng nào <code>(r − l + 1) − maxf &gt; k</code> thì co. Điểm tinh tế người phỏng vấn hay hỏi: khi co ta không bao giờ <em>giảm</em> <code>maxf</code>, nên nó có thể "cũ" (lớn hơn giá trị lớn nhất thật của cửa sổ hiện tại). Vẫn đúng cho <em>đáp án</em>: độ dài tốt nhất chỉ tăng khi có một chữ đạt tần suất mới cao hơn, còn <code>maxf</code> cũ chỉ khiến cửa sổ giữ nguyên kích thước thay vì co lại — nó không bao giờ ghi nhận một độ dài chưa từng đạt được. O(n) thời gian (O(26n) nếu tính lại giá trị lớn nhất cho thật đúng), O(26) bộ nhớ. Ca biên: k = 0 (đoạn một chữ dài nhất), k ≥ độ dài (cả chuỗi), toàn chữ khác nhau.</p>')}
</div>
${maHai('ch02/char-replacement.ts', 'ch02/CharReplacement.java', { vung: 'giai' })}
${ketQua('ch02/char-replacement.ts')}

<div class="ml-en">
<h3>7 · Find All Anagrams in a String — ${L438}</h3>
<p><strong>Problem.</strong> Return every start index i such that <code>s[i .. i + |p| − 1]</code> is an anagram of <code>p</code>. <code>s = "cbaebabacd"</code>, <code>p = "abc"</code> → <code>[0, 6]</code>.</p>
<p><strong>Recognising the pattern.</strong> Every candidate has the same length |p| ⇒ fixed window; "anagram" ⇒ letter counts (lesson 1.1).</p>
${gap('💡 Hint 1', '<p>Sorting each window is O(n · m log m). What changes between two neighbouring windows?</p>')}
${gap('💡 Hint 2', '<p>One letter enters, one leaves. Keep 26 counts for the window, compare with the 26 counts of p after each step.</p>')}
${gap('✅ Step-by-step solution', '<p>Count p once. Slide: add <code>s[r]</code>; when <code>r ≥ m</code> remove <code>s[r − m]</code> (the element leaving is exactly m positions behind); when the window is full (<code>r ≥ m − 1</code>) and the counts are equal, record its start <code>r − m + 1</code>. Comparing two arrays of 26 is O(26) per step ⇒ O(26·n) time, O(1) memory. (The "budget" window from Permutation in String, lesson 2.2, also works: collect l every time the length reaches m.) Edge cases: p longer than s, overlapping answers (<code>"abab"</code>, <code>"ab"</code> → 0, 1, 2), repeated letters (<code>"aaaaa"</code>, <code>"aa"</code>).</p>')}
</div>
<div class="ml-vi">
<h3>7 · Find All Anagrams in a String — ${L438}</h3>
<p><strong>Đề.</strong> Trả về mọi chỉ số bắt đầu i sao cho <code>s[i .. i + |p| − 1]</code> là anagram (đảo chữ) của <code>p</code>. <code>s = "cbaebabacd"</code>, <code>p = "abc"</code> → <code>[0, 6]</code>.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Mọi ứng viên đều dài đúng |p| ⇒ cửa sổ cố định; "anagram" ⇒ đếm chữ cái (bài 1.1).</p>
${gap('💡 Gợi ý 1', '<p>Sắp xếp từng cửa sổ tốn O(n · m log m). Giữa hai cửa sổ liền nhau, thứ gì thay đổi?</p>')}
${gap('💡 Gợi ý 2', '<p>Một chữ vào, một chữ ra. Giữ 26 bộ đếm cho cửa sổ, so với 26 bộ đếm của p sau mỗi bước.</p>')}
${gap('✅ Lời giải từng bước', '<p>Đếm p một lần. Trượt: thêm <code>s[r]</code>; khi <code>r ≥ m</code> thì bỏ <code>s[r − m]</code> (phần tử ra nằm đúng m vị trí phía sau); khi cửa sổ đã đủ (<code>r ≥ m − 1</code>) và hai bộ đếm bằng nhau thì ghi điểm đầu <code>r − m + 1</code>. So hai mảng 26 ô tốn O(26) mỗi bước ⇒ O(26·n) thời gian, O(1) bộ nhớ. (Cửa sổ "ngân sách" của Permutation in String ở bài 2.2 cũng dùng được: ghi l mỗi lần độ dài chạm m.) Ca biên: p dài hơn s, các đáp án chồng nhau (<code>"abab"</code>, <code>"ab"</code> → 0, 1, 2), chữ lặp (<code>"aaaaa"</code>, <code>"aa"</code>).</p>')}
</div>
${maHai('ch02/find-anagrams.ts', 'ch02/FindAnagrams.java', { vung: 'giai' })}
${ketQua('ch02/find-anagrams.ts')}

<div class="ml-en">
<h3>8 · Count Subarrays With Score Less Than K — ${L2302}</h3>
<p><strong>Problem.</strong> Positive integers <code>nums</code>; the score of a subarray is (its sum) × (its length). Count the non-empty subarrays with score strictly less than k. <code>[2, 1, 4, 3, 5]</code>, k = 10 → 6. Constraints: n up to 10⁵, values up to 10⁵, k up to 10¹⁵.</p>
<p><strong>Recognising the pattern.</strong> "Number of subarrays with …" + positive numbers (so the score only grows when the window grows) ⇒ variable window + "count the windows ending at r".</p>
${gap('💡 Hint 1', '<p>Fix the right end r. If <code>[l..r]</code> has score &lt; k, what about <code>[l+1..r]</code>? (Shorter and smaller sum.)</p>')}
${gap('💡 Hint 2', '<p>So for each r there is a smallest valid l, and all <code>r − l + 1</code> starts from l to r are valid. Maintain l with a window; shrink while <code>sum × length ≥ k</code>.</p>')}
${gap('✅ Step-by-step solution', '<p>Monotonicity first: removing an element from the left makes both the sum and the length smaller, so the score drops — valid windows are closed under shrinking from the left, and invalid ones stay invalid when they grow. That is exactly the condition for the "at most" window. For each r: add <code>nums[r]</code>, shrink while the score is ≥ k, then add <code>r − l + 1</code> to the total (the subarrays <code>[l..r]</code>, <code>[l+1..r]</code>, …, <code>[r..r]</code>). The overflow check is part of the answer: sum ≤ 10⁵ × 10⁵ = 10¹⁰ and the length ≤ 10⁵, so the product reaches 10¹⁵ — fine for a JS number (below 2⁵³ ≈ 9·10¹⁵) and for a Java <code>long</code>, an overflow for <code>int</code>; the total count itself can reach about 5·10⁹, also more than <code>int</code>. O(n) time, O(1) memory. Edge cases: a single element ≥ k (answer 0), k larger than every score (n(n+1)/2 = 10 for n = 4).</p>')}
</div>
<div class="ml-vi">
<h3>8 · Count Subarrays With Score Less Than K — ${L2302}</h3>
<p><strong>Đề.</strong> Mảng số nguyên dương <code>nums</code>; điểm (score) của một mảng con là (tổng) × (độ dài). Đếm số mảng con khác rỗng có điểm nhỏ hơn hẳn k. <code>[2, 1, 4, 3, 5]</code>, k = 10 → 6. Ràng buộc: n tới 10⁵, giá trị tới 10⁵, k tới 10¹⁵.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Số mảng con có …" + toàn số dương (nên cửa sổ lớn lên thì điểm chỉ tăng) ⇒ cửa sổ co giãn + "đếm các cửa sổ kết thúc tại r".</p>
${gap('💡 Gợi ý 1', '<p>Cố định đầu phải r. Nếu <code>[l..r]</code> có điểm &lt; k thì <code>[l+1..r]</code> thế nào? (Ngắn hơn và tổng nhỏ hơn.)</p>')}
${gap('💡 Gợi ý 2', '<p>Vậy với mỗi r có một l nhỏ nhất còn hợp lệ, và cả <code>r − l + 1</code> điểm đầu từ l tới r đều hợp lệ. Giữ l bằng một cửa sổ; co khi <code>tổng × độ dài ≥ k</code>.</p>')}
${gap('✅ Lời giải từng bước', '<p>Tính đơn điệu trước đã: bỏ một phần tử bên trái làm cả tổng lẫn độ dài nhỏ đi, nên điểm giảm — cửa sổ hợp lệ thì co từ trái vẫn hợp lệ, còn cửa sổ vi phạm thì nới ra vẫn vi phạm. Đó đúng là điều kiện để dùng cửa sổ "tối đa". Với mỗi r: thêm <code>nums[r]</code>, co khi điểm ≥ k, rồi cộng <code>r − l + 1</code> vào tổng (các mảng con <code>[l..r]</code>, <code>[l+1..r]</code>, …, <code>[r..r]</code>). Kiểm tràn số là một phần của đáp án: tổng ≤ 10⁵ × 10⁵ = 10¹⁰ và độ dài ≤ 10⁵, nên tích chạm 10¹⁵ — ổn với số của JS (dưới 2⁵³ ≈ 9·10¹⁵) và với <code>long</code> của Java, tràn với <code>int</code>; bản thân số đếm cũng lên tới khoảng 5·10⁹, cũng quá <code>int</code>. O(n) thời gian, O(1) bộ nhớ. Ca biên: một phần tử ≥ k (đáp án 0), k lớn hơn mọi điểm (n(n+1)/2 = 10 với n = 4).</p>')}
</div>
${maHai('ch02/score-less-than-k.ts', 'ch02/ScoreLessThanK.java', { vung: 'giai' })}
${ketQua('ch02/score-less-than-k.ts')}
${ketQua('ch02/ScoreLessThanK.java')}

<div class="ml-en">
<h3>🧪 Practice (15–20 min, after the set)</h3>
<div class="callout ok"><ol>
<li>Pick the two problems that took you longest. Close this page and solve each again from a blank file, timer on.</li>
<li>For each of the eight, write one notebook line: <em>signal → pattern/variant → complexity → the one detail that breaks it</em> (e.g. "Sort Colors → three pointers → O(n)/O(1) → don’t mid++ after swapping with hi").</li>
<li>Explain out loud, in under a minute, why a stale <code>maxf</code> in LC 424 still gives the right answer.</li>
</ol>
<p><strong>Done when:</strong> all eight accepted on LeetCode, the two hardest re-solved under the target time, eight notebook lines written. Then take the <a href="${baiNay('dsa-2-5-quiz')}">chapter quiz (2.5)</a>.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dutch national flag</span><span class="v">One-pass, in-place partition into three groups with lo / mid / hi.</span></div>
  <div class="kv"><span class="k">fill from the back</span><span class="v">Writing the largest results first when they come from the ends.</span></div>
  <div class="kv"><span class="k">one deletion branch</span><span class="v">At the first mismatch, try both deletions — the only place a choice exists.</span></div>
  <div class="kv"><span class="k">stale maximum</span><span class="v">A running max that is never decreased; safe when only improvements of the answer matter.</span></div>
  <div class="kv"><span class="k">count windows ending at r</span><span class="v">Add <code>r − l + 1</code> per step to count all valid subarrays.</span></div>
  <div class="kv"><span class="k">overflow check</span><span class="v">Multiply the bounds before choosing int or long.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Classify first: converging, read/write, fast/slow, fixed window, variable window (longest/shortest/count).</li>
<li>Write the invariant before the code (Sort Colors, windows); the moves follow from it.</li>
<li>At a single decision point, try both branches instead of guessing (Valid Palindrome II).</li>
<li>Restore inputs you modified (Palindrome Linked List) and say so.</li>
<li>Do the overflow arithmetic out loud (2302: 10¹⁵ needs <code>long</code>).</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Two Pointers &amp; Sliding Window', 'More problems in the same order, with video solutions', 'https://neetcode.io/roadmap')}
${nguon('📖', 'Wikipedia — Dutch national flag problem', 'Dijkstra’s three-way partition and its use in quicksort', 'https://en.wikipedia.org/wiki/Dutch_national_flag_problem')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút, sau khi làm xong bộ)</h3>
<div class="callout ok"><ol>
<li>Chọn hai đề làm bạn lâu nhất. Đóng trang này và giải lại từng đề từ tệp trắng, có bấm giờ.</li>
<li>Với cả tám đề, ghi một dòng vào sổ: <em>dấu hiệu → mẫu/biến thể → độ phức tạp → một chi tiết làm hỏng nó</em> (vd "Sort Colors → ba con trỏ → O(n)/O(1) → đừng mid++ sau khi đổi với hi").</li>
<li>Giải thích to thành tiếng, dưới một phút, vì sao <code>maxf</code> "cũ" ở LC 424 vẫn cho đáp án đúng.</li>
</ol>
<p><strong>Đạt khi:</strong> cả tám đề Accepted trên LeetCode, hai đề khó nhất giải lại kịp thời gian mục tiêu, có tám dòng trong sổ. Rồi làm <a href="${baiNay('dsa-2-5-quiz')}">quiz chương (2.5)</a>.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dutch national flag (cờ Hà Lan)</span><span class="v">Phân hoạch một lượt, tại chỗ, thành ba nhóm bằng lo / mid / hi.</span></div>
  <div class="kv"><span class="k">fill from the back (điền từ cuối)</span><span class="v">Ghi các kết quả lớn nhất trước khi chúng đến từ hai đầu.</span></div>
  <div class="kv"><span class="k">one deletion branch (một lần rẽ nhánh xoá)</span><span class="v">Ở chỗ lệch đầu tiên, thử cả hai cách xoá — nơi duy nhất có lựa chọn.</span></div>
  <div class="kv"><span class="k">stale maximum (giá trị lớn nhất "cũ")</span><span class="v">Biến max chạy không bao giờ giảm; an toàn khi chỉ cần ghi nhận lúc đáp án tốt lên.</span></div>
  <div class="kv"><span class="k">count windows ending at r (đếm cửa sổ kết thúc tại r)</span><span class="v">Mỗi bước cộng <code>r − l + 1</code> để đếm mọi mảng con hợp lệ.</span></div>
  <div class="kv"><span class="k">overflow check (kiểm tràn số)</span><span class="v">Nhân các cận trên ra trước khi chọn int hay long.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Phân loại trước: đối đầu, đọc/ghi, nhanh/chậm, cửa sổ cố định, cửa sổ co giãn (dài nhất/ngắn nhất/đếm).</li>
<li>Viết bất biến trước khi viết code (Sort Colors, các cửa sổ); các bước dời tự suy ra từ nó.</li>
<li>Ở điểm quyết định duy nhất, thử cả hai nhánh thay vì đoán (Valid Palindrome II).</li>
<li>Trả lại nguyên trạng đầu vào bạn đã sửa (Palindrome Linked List), và nói ra điều đó.</li>
<li>Tính tràn số thành tiếng (2302: 10¹⁵ cần <code>long</code>).</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Two Pointers &amp; Sliding Window', 'Thêm đề cùng thứ tự, có video lời giải (tiếng Anh)', 'https://neetcode.io/roadmap')}
${nguon('📖', 'Wikipedia — Dutch national flag problem', 'Phân hoạch ba phần của Dijkstra và cách quicksort dùng nó', 'https://en.wikipedia.org/wiki/Dutch_national_flag_problem')}
</div>
`,
};
