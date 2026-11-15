/** 4.2 — Mảng xoay, tìm đỉnh, ma trận: nhị phân khi mảng KHÔNG sắp hẳn. Mã/output đọc từ ../ma/ch04 (chạy thật). */
import { ma, maHai, ketQua, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { vetFirstTrue } from '../ma/ch04/nhi-phan.vet.mjs';
import { bangFirstTrue } from './_rieng.mjs';

const R = [6, 8, 9, 12, 1, 3, 4];
const LAST = R[R.length - 1];
const BANG_MIN = bangFirstTrue(R, vetFirstTrue(0, R.length, (i) => R[i] <= LAST), { cotGt: `a[mid] ≤ ${LAST} ?` });
const BANG_TIM = bangFirstTrue(R, vetFirstTrue(4, R.length, (i) => R[i] >= 3), { cotGt: 'a[mid] ≥ 3 ?' });

const P = [2, 4, 3, 1, 5, 7, 6];
const BANG_DINH = bangFirstTrue(P, vetFirstTrue(0, P.length - 1, (i) => P[i] > P[i + 1]),
  { cotGt: 'a[mid] vs a[mid+1]', giaTri: (m) => `${P[m]} ${P[m] > P[m + 1] ? '&gt;' : '&lt;'} ${P[m + 1]}`, coLinh: false });

const DE = [
  [lc(153, 'find-minimum-in-rotated-sorted-array', 'Find Minimum in Rotated Sorted Array', 'Medium'), 'Row "a[i] ≤ last?" is F…F T…T; the first T is the minimum.', 'Hàng "a[i] ≤ phần tử cuối?" là F…F T…T; T đầu tiên là phần tử nhỏ nhất.'],
  [lc(33, 'search-in-rotated-sorted-array', 'Search in Rotated Sorted Array', 'Medium'), 'Pass 1 = LC 153, pass 2 = lowerBound in the half that can hold the target.', 'Lượt 1 = LC 153, lượt 2 = lowerBound trong nửa có thể chứa target.'],
  [lc(81, 'search-in-rotated-sorted-array-ii', 'Search in Rotated Sorted Array II', 'Medium'), 'Duplicates: trim the tail copies of a[0] first; worst case O(n), say why.', 'Có trùng: cắt các bản sao của a[0] ở cuối trước; xấu nhất O(n), nói được vì sao.'],
  [lc(154, 'find-minimum-in-rotated-sorted-array-ii', 'Find Minimum in Rotated Sorted Array II', 'Hard'), 'Same trim + LC 153. The "Hard" is only the O(n) argument.', 'Cùng phép cắt + LC 153. Cái "Hard" chỉ là lập luận O(n).'],
  [lc(162, 'find-peak-element', 'Find Peak Element', 'Medium'), 'Not monotone, yet the template returns a F→T boundary = a peak.', 'Không đơn điệu, nhưng khuôn vẫn trả về một ranh giới F→T = một đỉnh.'],
  [lc(852, 'peak-index-in-a-mountain-array', 'Peak Index in a Mountain Array', 'Medium'), 'A mountain makes the row truly F…F T…T: the same one-liner.', 'Mảng hình núi làm hàng thật sự F…F T…T: cùng một dòng code.'],
  [lc(74, 'search-a-2d-matrix', 'Search a 2D Matrix', 'Medium'), 'Row-major sorted ⇒ one virtual array of m·n cells; k ↔ (k / n, k % n).', 'Sắp theo hàng nối tiếp ⇒ một mảng ảo m·n ô; k ↔ (k / n, k % n).'],
  [lc(240, 'search-a-2d-matrix-ii', 'Search a 2D Matrix II', 'Medium'), 'Rows and columns sorted separately ⇒ staircase from the top-right, O(m + n).', 'Hàng và cột sắp riêng ⇒ đi bậc thang từ góc trên phải, O(m + n).'],
  [lc(1095, 'find-in-mountain-array', 'Find in Mountain Array', 'Hard'), 'Three searches: the peak, then lowerBound up the left slope, then down the right slope.', 'Ba lần tìm: đỉnh, rồi lowerBound sườn trái đi lên, rồi sườn phải đi xuống.'],
  [lc(1901, 'find-a-peak-element-ii', 'Find a Peak Element II', 'Medium'), 'Binary search on columns: the max of the middle column, then go uphill.', 'Nhị phân trên cột: lấy max của cột giữa, rồi đi về phía dốc lên.'],
];

export default {
  title: '4.2 — Rotated arrays, peaks and matrices: binary search without a sorted array|||4.2 — Mảng xoay, tìm đỉnh, ma trận: nhị phân khi mảng không sắp hẳn',
  slug: 'dsa-4-2-xoay',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cùng khuôn firstTrue cho mảng xoay (LC 153, 33), có trùng (LC 154, 81 — vì sao xấu nhất O(n), đo thật), tìm đỉnh khi hàng không đơn điệu (LC 162), ma trận 2D (LC 74 vs bậc thang LC 240) — kèm bảng vết, hai mô phỏng và bài toán chỉnh số luồng thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Rotated arrays, peaks and matrices: binary search without a sorted array</h2>
<p class="lead">Lesson 4.1 ended with a claim: binary search does not need a sorted array, it needs a <strong>yes/no question whose answers look like F…F T…T</strong>. This lesson cashes that claim. A rotated array is not sorted, a list of mountains and valleys is not sorted, a matrix is not even one-dimensional — and all of them are solved with the exact <code>firstTrue</code> loop from 4.1, unchanged. The work is entirely in <em>finding the right question</em>. You will also see where the idea breaks (duplicates force O(n), and we measure it), and one matrix problem where binary search is the wrong tool.</p>

<h3>The everyday picture</h3>
<p>A dashcam records onto a memory card in a circle: when the card is full, it overwrites the oldest clip. Look at the clip timestamps slot by slot and you see something like 10:05, 10:09, 10:12, 10:20, 09:40, 09:51, 09:57, 10:01 — sorted, but "cut and rotated". Where is the oldest clip? Not at slot 0. It is exactly where the times drop. You could scan all slots; with a card of a million slots you would rather ask a smarter question: "is the clip in this slot older than (or as old as) the clip in the LAST slot?" Every slot before the drop answers no, every slot from the drop on answers yes. F…F T…T — the drop is the first T.</p>
<p>Formally: a <strong>rotated sorted array</strong> is a sorted array cut at some index and the two pieces swapped, like <code>[6, 8, 9, 12, 1, 3, 4]</code> from <code>[1, 3, 4, 6, 8, 9, 12]</code>. The index of the minimum is the <strong>rotation point</strong> (pivot). Both pieces on either side of it are sorted.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Mảng xoay, tìm đỉnh, ma trận: nhị phân khi mảng không sắp hẳn</h2>
<p class="lead">Bài 4.1 khép lại bằng một khẳng định: tìm nhị phân không cần mảng đã sắp, nó cần <strong>một câu hỏi có/không mà các câu trả lời có dạng F…F T…T</strong>. Bài này "đổi" khẳng định đó ra tiền mặt. Mảng bị xoay thì không sắp, một dãy núi và thung lũng thì không sắp, ma trận còn chẳng phải một chiều — vậy mà tất cả đều được giải bằng đúng vòng <code>firstTrue</code> của bài 4.1, không sửa một chữ. Toàn bộ công sức nằm ở <em>tìm ra câu hỏi đúng</em>. Bạn cũng sẽ thấy chỗ ý tưởng này gãy (phần tử trùng buộc phải O(n), và ta đo thật), và một bài ma trận mà nhị phân là công cụ sai.</p>

<h3>Hình dung đời thường</h3>
<p>Camera hành trình ghi lên thẻ nhớ theo vòng tròn: thẻ đầy thì nó ghi đè đoạn clip cũ nhất. Nhìn giờ của các clip theo từng ô, bạn thấy kiểu như 10:05, 10:09, 10:12, 10:20, 09:40, 09:51, 09:57, 10:01 — có thứ tự, nhưng "bị cắt rồi xoay". Clip cũ nhất ở đâu? Không phải ô 0. Nó nằm đúng chỗ giờ tụt xuống. Bạn có thể quét hết các ô; với thẻ một triệu ô thì nên hỏi một câu khôn hơn: "clip ở ô này có cũ hơn (hoặc bằng) clip ở ô CUỐI CÙNG không?" Mọi ô trước chỗ tụt trả lời không, mọi ô từ chỗ tụt trở đi trả lời có. F…F T…T — chỗ tụt là T đầu tiên.</p>
<p>Nói cho chuẩn: <strong>mảng đã sắp bị xoay</strong> (rotated sorted array) là một mảng đã sắp bị cắt ở một vị trí rồi đổi chỗ hai mẩu, như <code>[6, 8, 9, 12, 1, 3, 4]</code> từ <code>[1, 3, 4, 6, 8, 9, 12]</code>. Chỉ số của phần tử nhỏ nhất là <strong>điểm xoay</strong> (rotation point / pivot). Hai mẩu ở hai bên điểm xoay đều đã sắp.</p>
${csd('csd201-slide-cs1-1', 'vi', '⭐ CS.1 — Tìm kiếm nhị phân (1): slide 11–12 mảng xoay', '<p>Slide 11–12 của CS.1 đã cho bạn mảng xoay: tìm nó và tìm điểm xoay trong O(log n). <strong>Ở đây đi sâu thêm:</strong> làm cả hai bằng ĐÚNG khuôn firstTrue (không học thêm bản "một lượt bốn nhánh"), chứng minh vì sao so với phần tử CUỐI chứ không phải phần tử đầu, đo thật vì sao có trùng thì không thể nhanh hơn O(n), và cách nói lời giải khi phỏng vấn.</p>')}
</div>

<div class="ml-en">
<h3>Signals</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"sorted, then rotated at an unknown pivot"</span><span class="v">Rotation point = first T of "a[i] ≤ last". Then everything is a normal sorted search.</span></div>
  <div class="kv"><span class="k">"must be O(log n)" but the array is not sorted</span><span class="v">Look for a local question whose answer tells you which half is safe: compare with the last element, or with the next element (slope).</span></div>
  <div class="kv"><span class="k">"peak", "local maximum", "mountain", "bitonic"</span><span class="v">Slope question "a[i] &gt; a[i + 1]?" — go uphill.</span></div>
  <div class="kv"><span class="k">matrix "each row sorted and the first of a row &gt; last of the previous"</span><span class="v">One virtual sorted array of m·n cells: index arithmetic, then lowerBound.</span></div>
  <div class="kv"><span class="k">matrix "rows sorted, columns sorted" (nothing more)</span><span class="v">Not one sorted array. Staircase walk O(m + n) from a corner.</span></div>
  <div class="kv"><span class="k">"may contain duplicates"</span><span class="v">Expect the worst case to become O(n) — and say so before the interviewer asks.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"đã sắp, rồi bị xoay ở một điểm không biết trước"</span><span class="v">Điểm xoay = T đầu tiên của "a[i] ≤ phần tử cuối". Sau đó mọi thứ là tìm trên mảng đã sắp bình thường.</span></div>
  <div class="kv"><span class="k">"phải O(log n)" mà mảng không sắp</span><span class="v">Tìm một câu hỏi cục bộ mà câu trả lời cho biết nửa nào an toàn: so với phần tử cuối, hoặc so với phần tử kế bên (độ dốc).</span></div>
  <div class="kv"><span class="k">"đỉnh" (peak), "cực đại địa phương", "hình núi" (mountain), "bitonic"</span><span class="v">Câu hỏi độ dốc "a[i] &gt; a[i + 1]?" — đi về phía dốc lên.</span></div>
  <div class="kv"><span class="k">ma trận "mỗi hàng đã sắp và đầu hàng sau &gt; cuối hàng trước"</span><span class="v">Một mảng ảo đã sắp gồm m·n ô: tính chỉ số, rồi lowerBound.</span></div>
  <div class="kv"><span class="k">ma trận "hàng đã sắp, cột đã sắp" (không hơn)</span><span class="v">Không phải một mảng đã sắp. Đi bậc thang O(m + n) từ một góc.</span></div>
  <div class="kv"><span class="k">"có thể có phần tử trùng"</span><span class="v">Chuẩn bị tinh thần xấu nhất thành O(n) — và nói ra trước khi người phỏng vấn hỏi.</span></div>
</div>
</div>

<div class="ml-en">
<h3>Worked example: Find Minimum (LC 153), then Search (LC 33)</h3>
<p><strong>Problems (in our words).</strong> LC 153: a sorted array of distinct numbers was rotated an unknown number of times; return its minimum in O(log n). LC 33: same kind of array plus a target; return its index or −1, in O(log n). Example: <code>[6, 8, 9, 12, 1, 3, 4]</code> → minimum 1 (index 4); target 3 → index 5; target 5 → −1.</p>
<p><strong>Brute force.</strong> Scan for the drop or for the target: O(n). Correct and fast to write — say it, then say "the O(log n) requirement means I need to discard half the array per step without it being sorted".</p>
<p><strong>The question.</strong> Compare each element with the <em>last</em> element. Everything in the left piece is bigger than everything in the right piece, and the last element belongs to the right piece. So "a[i] ≤ last?" is F on the whole left piece and T on the whole right piece: <code>F F F F T T T</code>. The first T is the minimum. If the array was not rotated at all (<code>[1, 2, 3]</code>), every element is ≤ last, the row is all T, and the first T is index 0 — still correct, with no special case.</p>
<p>Why not compare with the <em>first</em> element? "a[i] ≥ first?" is T T T T F F F on a rotated array, which you could negate, but on a non-rotated array it is all T, and the "first F" would be n — out of range. Comparing with the last element is the version with no special case; say this in the interview, it shows you tested the boundary in your head.</p>
<p><strong>Then LC 33 in two passes.</strong> Pass 1 finds the rotation point p. Now <code>[0, p)</code> and <code>[p, n)</code> are two sorted pieces, and the target can only be in one of them: if <code>target ≤ last</code> it can only be in the right piece (the left piece holds only values bigger than last), otherwise only in the left piece. Pass 2 is <code>lowerBound</code> on that piece — the same template with a different <code>[lo, hi)</code>.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Find Minimum (LC 153), rồi Search (LC 33)</h3>
<p><strong>Đề (diễn đạt lại).</strong> LC 153: một mảng đã sắp gồm các số khác nhau bị xoay một số lần không biết; trả về phần tử nhỏ nhất trong O(log n). LC 33: cùng kiểu mảng cộng một target; trả về chỉ số của nó hoặc −1, trong O(log n). Ví dụ: <code>[6, 8, 9, 12, 1, 3, 4]</code> → nhỏ nhất 1 (chỉ số 4); target 3 → chỉ số 5; target 5 → −1.</p>
<p><strong>Vét cạn.</strong> Quét tìm chỗ tụt hoặc tìm target: O(n). Đúng và viết nhanh — nói nó ra, rồi nói "yêu cầu O(log n) nghĩa là em phải bỏ được một nửa mảng mỗi bước dù mảng không sắp".</p>
<p><strong>Câu hỏi.</strong> So từng phần tử với phần tử <em>cuối cùng</em>. Mọi thứ trong mẩu trái đều lớn hơn mọi thứ trong mẩu phải, và phần tử cuối thuộc mẩu phải. Vậy "a[i] ≤ cuối?" là F trên toàn bộ mẩu trái và T trên toàn bộ mẩu phải: <code>F F F F T T T</code>. T đầu tiên là phần tử nhỏ nhất. Nếu mảng không hề bị xoay (<code>[1, 2, 3]</code>), mọi phần tử đều ≤ cuối, hàng toàn T, và T đầu tiên là chỉ số 0 — vẫn đúng, không cần trường hợp đặc biệt.</p>
<p>Sao không so với phần tử <em>đầu</em>? "a[i] ≥ đầu?" là T T T T F F F trên mảng xoay, phủ định thì dùng được, nhưng trên mảng không xoay nó toàn T, và "F đầu tiên" thành n — ra ngoài mảng. So với phần tử cuối là bản không cần trường hợp đặc biệt; hãy nói điều này khi phỏng vấn, nó cho thấy bạn đã thử ca biên trong đầu.</p>
<p><strong>Rồi LC 33 bằng hai lượt.</strong> Lượt 1 tìm điểm xoay p. Giờ <code>[0, p)</code> và <code>[p, n)</code> là hai mẩu đã sắp, và target chỉ có thể nằm trong một mẩu: nếu <code>target ≤ cuối</code> thì chỉ có thể ở mẩu phải (mẩu trái chỉ chứa giá trị lớn hơn phần tử cuối), ngược lại chỉ có thể ở mẩu trái. Lượt 2 là <code>lowerBound</code> trên mẩu đó — cùng khuôn với một <code>[lo, hi)</code> khác.</p>
</div>

${maHai('ch04/xoay.ts', 'ch04/Xoay.java', { vung: 'lc153' })}
${maHai('ch04/xoay.ts', 'ch04/Xoay.java', { vung: 'lc33' })}
${ketQua('ch04/xoay.ts')}
${ketQua('ch04/Xoay.java')}

<div class="ml-en">
<p>Read the output against the rules: the minimum is at index 4 (the array was rotated 4 places); every present value is found at its real index and the absent 5 and 13 give −1; the one-element, two-element, non-rotated and rotated-once arrays all work without a single <code>if</code> for them. The ring-buffer line is the dashcam: the oldest entry is at slot 4, the newest at slot 3, just before it. The self-test tries every rotation of 400 random arrays and every target from −1 to 31: 63,558 searches compared with <code>indexOf</code>, 0 mismatches.</p>
<h3>Watch it run: pass 1, then pass 2</h3>
<p>Pass 1 on <code>[6, 8, 9, 12, 1, 3, 4]</code>, row "a[i] ≤ 4":</p>
</div>
<div class="ml-vi">
<p>Đọc output theo luật: phần tử nhỏ nhất ở chỉ số 4 (mảng bị xoay 4 vị trí); mọi giá trị có mặt đều tìm ra đúng chỉ số thật, còn 5 và 13 không có thì ra −1; mảng một phần tử, hai phần tử, không xoay và xoay một lần đều chạy đúng mà không cần một câu <code>if</code> nào cho chúng. Dòng bộ đệm vòng (ring buffer) chính là camera hành trình: mục cũ nhất ở ô 4, mới nhất ở ô 3, ngay trước nó. Bộ tự kiểm thử mọi phép xoay của 400 mảng ngẫu nhiên và mọi target từ −1 tới 31: 63.558 lần tìm so với <code>indexOf</code>, 0 chỗ lệch.</p>
<h3>Xem nó chạy: lượt 1, rồi lượt 2</h3>
<p>Lượt 1 trên <code>[6, 8, 9, 12, 1, 3, 4]</code>, hàng "a[i] ≤ 4":</p>
</div>
${BANG_MIN}
<div class="ml-en">
<p>Three rounds, rotation point 4. Round 1 saw 12 &gt; 4 (still in the left piece, F) and moved lo past it; round 2 saw 3 ≤ 4 (right piece, T) and moved hi onto it. Now pass 2: target 3 ≤ last 4, so it can only be in <code>[4, 7)</code>; lowerBound there, row "a[i] ≥ 3":</p>
</div>
<div class="ml-vi">
<p>Ba vòng, điểm xoay 4. Vòng 1 thấy 12 &gt; 4 (vẫn ở mẩu trái, F) và dời lo qua nó; vòng 2 thấy 3 ≤ 4 (mẩu phải, T) và dời hi về nó. Giờ lượt 2: target 3 ≤ phần tử cuối 4, nên chỉ có thể ở <code>[4, 7)</code>; lowerBound trong đó, hàng "a[i] ≥ 3":</p>
</div>
${BANG_TIM}
<div class="ml-en">
<p>The search starts with <code>lo = 4</code>, not 0 — the cells left of it are drawn but never touched. Result 5, and <code>a[5] = 3</code> is the target. Five rounds in total for both passes, against up to 7 for a scan; at n = 10⁶ it would be about 40 against a million.</p>
${moPhong('ch04/xoay.sim.js', 'en', 'Rotated array: rotation point, then lowerBound — step by step', 'Both passes of LC 33 with the same template. Change A and TARGET (try a non-rotated array) and run again.')}
</div>
<div class="ml-vi">
<p>Lần tìm bắt đầu với <code>lo = 4</code>, không phải 0 — các ô bên trái vẫn được vẽ nhưng không bao giờ bị đụng tới. Kết quả 5, và <code>a[5] = 3</code> đúng là target. Tổng cộng năm vòng cho cả hai lượt, so với tới 7 nếu quét; ở n = 10⁶ sẽ là khoảng 40 so với một triệu.</p>
${moPhong('ch04/xoay.sim.js', 'vi', 'Mảng xoay: tìm điểm xoay, rồi lowerBound — chạy từng bước', 'Hai lượt của LC 33 bằng cùng một khuôn. Đổi A và TARGET (thử một mảng không xoay) rồi chạy lại.')}
</div>

<div class="ml-en">
<h3>Why two passes and not the famous one-pass version</h3>
<p>On NeetCode and in many editorials, LC 33 is solved in one loop with four branches: "is the left half sorted? is the target inside it? otherwise the right half…". It is also O(log n), and you should recognise it. But it has four comparisons where <code>&lt;</code> vs <code>&lt;=</code> matters, it is not the template you practised, and it is exactly the kind of code where an interview minute disappears into "why does [3, 1] with target 1 fail?". Two passes cost 2·log n instead of log n comparisons — the same O(log n) — and each pass is a template you have already proven. In an interview, say: "I'll do it in two binary searches because each one is simple to verify; if you want, I can merge them into one pass afterwards." That sentence usually earns more than the merged code.</p>
</div>
<div class="ml-vi">
<h3>Vì sao hai lượt mà không phải bản một lượt nổi tiếng</h3>
<p>Trên NeetCode và trong nhiều bài giải, LC 33 được giải bằng một vòng lặp bốn nhánh: "nửa trái đã sắp chưa? target có nằm trong nó không? nếu không thì nửa phải…". Nó cũng O(log n), và bạn nên nhận ra nó khi gặp. Nhưng nó có bốn phép so sánh mà <code>&lt;</code> hay <code>&lt;=</code> đều quan trọng, nó không phải khuôn bạn đã luyện, và nó đúng là loại code nuốt mất một phút phỏng vấn vào câu "sao [3, 1] với target 1 lại sai?". Hai lượt tốn 2·log n thay vì log n phép so sánh — vẫn là O(log n) — và mỗi lượt là một khuôn bạn đã chứng minh. Khi phỏng vấn hãy nói: "Em làm bằng hai lần tìm nhị phân vì mỗi lần đều dễ kiểm; nếu anh/chị muốn, em gộp thành một lượt sau." Câu đó thường được điểm hơn cả đoạn code đã gộp.</p>
</div>

<div class="ml-en">
<h3>Duplicates: where O(log n) becomes impossible</h3>
<div class="pitfall co-tieu-de"><p><strong>With duplicates, "a[i] ≤ last" is no longer F…F T…T.</strong></p><p>In <code>[1, 1, 1, 0, 1, 1]</code> the last element is 1, so every element is ≤ last: the row is T T T T T T and the template happily returns index 0 — value 1, while the minimum is 0. No crash, no infinite loop, just a wrong answer.</p></div>
<p>The fix keeps the template: while the last element equals the first, it carries no information (it could belong to either piece), so drop it from the range. When the ends differ, the row is F…F T…T again. LC 154 (minimum) and LC 81 (search, returns true/false) both use this trim:</p>
</div>
<div class="ml-vi">
<h3>Phần tử trùng: chỗ O(log n) trở thành không thể</h3>
<div class="pitfall co-tieu-de"><p><strong>Có phần tử trùng thì "a[i] ≤ cuối" không còn là F…F T…T.</strong></p><p>Trong <code>[1, 1, 1, 0, 1, 1]</code> phần tử cuối là 1, nên mọi phần tử đều ≤ cuối: hàng là T T T T T T và khuôn vui vẻ trả về chỉ số 0 — giá trị 1, trong khi nhỏ nhất là 0. Không sập, không treo, chỉ là đáp án sai.</p></div>
<p>Cách sửa giữ nguyên khuôn: khi phần tử cuối bằng phần tử đầu, nó không mang thông tin gì (nó có thể thuộc mẩu nào cũng được), nên bỏ nó khỏi đoạn. Khi hai đầu khác nhau, hàng lại là F…F T…T. LC 154 (tìm nhỏ nhất) và LC 81 (tìm, trả về true/false) đều dùng phép cắt này:</p>
</div>
${maHai('ch04/xoay-trung.ts', 'ch04/XoayTrung.java', { vung: 'lc154' })}
${ketQua('ch04/xoay-trung.ts')}
<div class="ml-en">
<p>The first line is the bug, shown as its F/T row: all T. After trimming, index 3 (value 0). The next four lines are edge cases — all equal, rotation inside equal values, the classic <code>[2, 5, 6, 0, 0, 1, 2]</code> shape. Then the cost: on <code>[1, 0, 1, 1, …, 1]</code> with n = 100,000 the trim takes about n steps (100,000) while a rotated array of distinct values needs 16. That is not a weakness of our code. It is a fact about the problem: in an array of all 1s with a single 0, every cell you did not look at could be the 0, so <strong>any</strong> algorithm must look at all of them in the worst case. Saying this proof in one sentence ("an adversary can hide the 0 anywhere among equal values") is what LC 154 is really testing.</p>
</div>
<div class="ml-vi">
<p>Dòng đầu là con bug, in ra bằng hàng F/T của nó: toàn T. Sau khi cắt: chỉ số 3 (giá trị 0). Bốn dòng tiếp là ca biên — toàn bằng nhau, điểm xoay nằm giữa các giá trị bằng nhau, hình dạng kinh điển <code>[2, 5, 6, 0, 0, 1, 2]</code>. Rồi tới cái giá: trên <code>[1, 0, 1, 1, …, 1]</code> với n = 100.000 phép cắt mất khoảng n bước (100.000) trong khi mảng xoay gồm các giá trị khác nhau chỉ cần 16. Đó không phải điểm yếu của code ta. Đó là sự thật về chính bài toán: trong một mảng toàn số 1 có đúng một số 0, mọi ô bạn chưa nhìn đều có thể là số 0, nên thuật toán <strong>nào</strong> cũng phải nhìn hết trong trường hợp xấu nhất. Nói được chứng minh này trong một câu ("đối thủ có thể giấu số 0 ở bất cứ đâu giữa các giá trị bằng nhau" — adversary argument, lập luận đối thủ) mới là thứ LC 154 thực sự kiểm tra.</p>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: whoever chooses the input chooses your worst case</h3>
<p>The duplicate case is a small instance of an <strong>algorithmic complexity attack</strong>: if an attacker controls the input and your algorithm has a slow worst case, they will send exactly that case. Lesson 1.1 showed the big version (HashDoS: colliding keys turn a hash map from O(1) into O(n)). Here, an endpoint that "binary searches" client-supplied data would degrade to a linear scan on a crafted array of equal values. The defences are the same: know the worst case of every algorithm that touches untrusted input, cap input sizes (<code>express.json({ limit })</code>), and never assume the "average case" of a public endpoint.</p>
${lienKet({ bai: 'dsa-1-1-hash-map', title: '1.1 — Hash maps and sets (HashDoS section)', sub: 'The same idea at full scale: colliding keys and a server at 100 % CPU', cta: 'Read' })}
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: ai chọn đầu vào thì người đó chọn trường hợp xấu nhất của bạn</h3>
<p>Ca phần tử trùng là một ví dụ nhỏ của <strong>tấn công độ phức tạp thuật toán</strong> (algorithmic complexity attack): nếu kẻ tấn công điều khiển được đầu vào và thuật toán của bạn có trường hợp xấu nhất chậm, chúng sẽ gửi đúng trường hợp đó. Bài 1.1 đã cho thấy bản lớn (HashDoS: các khoá va chạm biến hash map từ O(1) thành O(n)). Ở đây, một endpoint "tìm nhị phân" trên dữ liệu do client gửi sẽ suy biến thành quét tuyến tính với một mảng toàn giá trị bằng nhau được dựng sẵn. Cách phòng y như cũ: biết trường hợp xấu nhất của mọi thuật toán chạm vào đầu vào không tin cậy, giới hạn kích thước đầu vào (<code>express.json({ limit })</code>), và đừng bao giờ dựa vào "trường hợp trung bình" của một endpoint công khai.</p>
${lienKet({ bai: 'dsa-1-1-hash-map', title: '1.1 — Hash map và set (phần HashDoS)', sub: 'Cùng ý tưởng ở quy mô thật: khoá va chạm và máy chủ 100 % CPU', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>Peaks: the row is not monotone, and the template still works</h3>
<p><strong>Problem (LC 162, in our words).</strong> Neighbouring elements are never equal; return the index of any <strong>peak</strong> — an element strictly bigger than its neighbours (outside the array counts as −∞). Example: <code>[2, 4, 3, 1, 5, 7, 6]</code> has peaks at 1 (the 4) and 5 (the 7); either answer is accepted. O(log n) required.</p>
<p><strong>The question.</strong> "Is it going down after i?" — <code>ok(i) = a[i] &gt; a[i + 1]</code>, for i in <code>[0, n − 1)</code>. Here the row is <code>F T T F F T</code>: <em>not</em> monotone. So why does firstTrue work? Because the invariant from 4.1 has a stronger form that does not need monotonicity: <strong>after every round, either lo is the start or ok(lo − 1) is F, and either hi is the end or ok(hi) is T</strong>. Both updates preserve this (T ⇒ hi = mid makes ok(hi) T; F ⇒ lo = mid + 1 makes ok(lo − 1) F). When lo == hi = i, we came <em>up</em> into i (ok(i − 1) F means a[i − 1] &lt; a[i]) and we go <em>down</em> after it (ok(i) T means a[i] &gt; a[i + 1]), or i is at an end — that is a peak. On a monotone row this boundary is unique (the first T); on any row the template returns <em>some</em> F→T boundary. This is the fact to remember: <strong>firstTrue always returns a boundary; monotonicity only makes it the first one.</strong></p>
</div>
<div class="ml-vi">
<h3>Tìm đỉnh: hàng không đơn điệu, mà khuôn vẫn chạy</h3>
<p><strong>Đề (LC 162, diễn đạt lại).</strong> Hai phần tử kề nhau không bao giờ bằng nhau; trả về chỉ số của một <strong>đỉnh</strong> (peak) bất kỳ — phần tử lớn hơn hẳn hai bên (ngoài mảng coi như −∞). Ví dụ: <code>[2, 4, 3, 1, 5, 7, 6]</code> có đỉnh ở 1 (số 4) và 5 (số 7); trả cái nào cũng được. Yêu cầu O(log n).</p>
<p><strong>Câu hỏi.</strong> "Sau i có đi xuống không?" — <code>ok(i) = a[i] &gt; a[i + 1]</code>, với i trong <code>[0, n − 1)</code>. Ở đây hàng là <code>F T T F F T</code>: <em>không</em> đơn điệu. Vậy sao firstTrue vẫn đúng? Vì bất biến của bài 4.1 có một dạng mạnh hơn không cần tính đơn điệu: <strong>sau mỗi vòng, hoặc lo là điểm đầu hoặc ok(lo − 1) là F, và hoặc hi là điểm cuối hoặc ok(hi) là T</strong>. Cả hai phép cập nhật giữ điều này (T ⇒ hi = mid làm ok(hi) là T; F ⇒ lo = mid + 1 làm ok(lo − 1) là F). Khi lo == hi = i, ta đi <em>lên</em> vào i (ok(i − 1) F nghĩa là a[i − 1] &lt; a[i]) và đi <em>xuống</em> sau nó (ok(i) T nghĩa là a[i] &gt; a[i + 1]), hoặc i nằm ở đầu mút — đó là một đỉnh. Trên hàng đơn điệu ranh giới này là duy nhất (T đầu tiên); trên hàng bất kỳ khuôn trả về <em>một</em> ranh giới F→T nào đó. Đây là điều cần nhớ: <strong>firstTrue luôn trả về một ranh giới; tính đơn điệu chỉ làm nó thành ranh giới ĐẦU TIÊN.</strong></p>
${csd('csd201-slide-cs1-2', 'vi', '⭐ CS.1 — Tìm kiếm nhị phân (2): slide 13–14 đỉnh và ma trận', '<p>Slide 13–14 đã giải thích vì sao chia đôi vẫn đúng khi tìm đỉnh và trên ma trận đã sắp. <strong>Ở đây đi sâu thêm:</strong> dạng bất biến "ranh giới F→T" giải thích được cả đỉnh lẫn chuyện vì sao mảng xoay có trùng trả sai, một bài toán chỉnh hiệu năng thật dùng đúng lời giải LC 162, và khi nào trên ma trận KHÔNG nên dùng nhị phân.</p>')}
</div>

${maHai('ch04/dinh.ts', 'ch04/Dinh.java', { vung: 'lc162' })}
${BANG_DINH}
<div class="ml-en">
<p>Three rounds on <code>[2, 4, 3, 1, 5, 7, 6]</code>: at mid 3 the slope goes up (1 &lt; 5) so a peak must exist to the right — if you keep walking uphill you either meet a drop (a peak) or reach the end (also a peak, since outside is −∞). At mid 5 it goes down (7 &gt; 6) so a peak is at mid or left of it. Result 5, the 7. It did not find the peak at index 1, and it did not need to. Watch the bars:</p>
${moPhong('ch04/dinh.sim.js', 'en', 'Find a peak by walking uphill — bars, step by step', 'Each round compares a bar with its right neighbour and keeps the uphill side. Try a strictly increasing array.')}
</div>
<div class="ml-vi">
<p>Ba vòng trên <code>[2, 4, 3, 1, 5, 7, 6]</code>: ở mid 3 dốc đi lên (1 &lt; 5) nên chắc chắn có đỉnh bên phải — cứ đi lên dốc thì hoặc gặp chỗ đi xuống (một đỉnh) hoặc chạm cuối mảng (cũng là đỉnh, vì ngoài mảng là −∞). Ở mid 5 dốc đi xuống (7 &gt; 6) nên có đỉnh ở mid hoặc bên trái nó. Kết quả 5, số 7. Nó không tìm ra đỉnh ở chỉ số 1, và cũng không cần. Xem các cột:</p>
${moPhong('ch04/dinh.sim.js', 'vi', 'Tìm đỉnh bằng cách leo dốc — biểu đồ cột, từng bước', 'Mỗi vòng so một cột với cột bên phải rồi giữ phía dốc lên. Thử một mảng tăng dần ngặt.')}
</div>
${ketQua('ch04/dinh.ts')}
<div class="ml-en">
<p>The "ok row" column makes the non-monotone rows visible (<code>FTTFFT</code>, <code>FTFT</code>), and every returned index is in the list of real peaks. For a <em>mountain</em> (LC 852, <code>[0, 3, 8, 9, 6, 2]</code>) the row is <code>FFFTT</code> — truly monotone — and the same one-liner returns the unique summit. 3,000 random arrays: 0 non-peaks.</p>
<div class="pitfall co-tieu-de"><p><strong>"Find the maximum" is not "find a peak".</strong></p><p>The follow-up "does your solution return the largest element?" is a trap. No: on <code>[2, 4, 3, 1, 5, 7, 6]</code> both 4 and 7 are peaks; another array could make it return the smaller one. The global maximum of an arbitrary array needs O(n) — every unseen cell could be bigger. Only when the array is a mountain (one peak) are "a peak" and "the maximum" the same thing.</p></div>
</div>
<div class="ml-vi">
<p>Cột "ok row" làm lộ ra các hàng không đơn điệu (<code>FTTFFT</code>, <code>FTFT</code>), và chỉ số trả về luôn nằm trong danh sách đỉnh thật. Với mảng <em>hình núi</em> (LC 852, <code>[0, 3, 8, 9, 6, 2]</code>) hàng là <code>FFFTT</code> — đơn điệu thật sự — và cùng một dòng code trả về đỉnh núi duy nhất. 3.000 mảng ngẫu nhiên: 0 lần trả về thứ không phải đỉnh.</p>
<div class="pitfall co-tieu-de"><p><strong>"Tìm phần tử lớn nhất" không phải "tìm một đỉnh".</strong></p><p>Câu hỏi nối tiếp "lời giải của bạn có trả về phần tử lớn nhất không?" là một cái bẫy. Không: trong <code>[2, 4, 3, 1, 5, 7, 6]</code> cả 4 và 7 đều là đỉnh; một mảng khác có thể làm nó trả về đỉnh nhỏ hơn. Phần tử lớn nhất toàn cục của một mảng bất kỳ cần O(n) — mọi ô chưa nhìn đều có thể lớn hơn. Chỉ khi mảng hình núi (một đỉnh) thì "một đỉnh" và "lớn nhất" mới là một.</p></div>
</div>

<div class="ml-en">
<h3>In real systems: tuning a service is LC 162 on a function</h3>
<p>The throughput of a backend as you add worker threads (or database connections) usually rises, then falls: more workers help until they start fighting over locks, CPU caches and the connection pool. Each point on that curve costs a load test of a few minutes. "Find the best number of workers" is LC 162 where <code>a[i]</code> is a measurement: compare <code>f(mid)</code> with <code>f(mid + 1)</code> and keep the uphill side.</p>
</div>
<div class="ml-vi">
<h3>Trong hệ thống thật: chỉnh hiệu năng một dịch vụ chính là LC 162 trên một hàm</h3>
<p>Thông lượng (throughput — số request xử lý mỗi giây) của một backend khi bạn tăng số luồng xử lý (hoặc số kết nối CSDL) thường tăng lên rồi giảm xuống: thêm luồng có ích cho tới khi chúng bắt đầu tranh nhau khoá, bộ đệm CPU và connection pool (bể kết nối). Mỗi điểm trên đường cong đó tốn một lần chạy thử tải (load test) vài phút. "Tìm số luồng tốt nhất" chính là LC 162 với <code>a[i]</code> là một phép đo: so <code>f(mid)</code> với <code>f(mid + 1)</code> rồi giữ phía dốc lên.</p>
</div>
${maHai('ch04/dinh.ts', 'ch04/Dinh.java', { vung: 'tune' })}
<div class="ml-en">
<p>From the output above: best concurrency 16 (7,905 req/s) after 12 load tests instead of 64 — two measurements per round, six rounds — confirmed by trying all 64. Two honest warnings you should add when you tell this story: real measurements are <strong>noisy</strong> (two runs at the same setting differ by a few percent), and a noisy slope can send the search the wrong way, so engineers measure each point several times or search coarsely first; and real curves can have <strong>plateaus</strong> (equal neighbours), which break the slope question the same way duplicates broke the rotated array. The algorithm is the same; the data decides whether its assumption holds.</p>
</div>
<div class="ml-vi">
<p>Theo output ở trên: số luồng tốt nhất là 16 (7.905 req/s) sau 12 lần chạy thử tải thay vì 64 — mỗi vòng hai phép đo, sáu vòng — và được xác nhận bằng cách thử cả 64. Hai lời cảnh báo trung thực nên kèm khi kể chuyện này: phép đo thật có <strong>nhiễu</strong> (hai lần chạy cùng cấu hình lệch nhau vài phần trăm), và một độ dốc bị nhiễu có thể đẩy phép tìm đi sai hướng, nên kỹ sư đo mỗi điểm vài lần hoặc tìm thô trước; và đường cong thật có thể có <strong>vùng phẳng</strong> (plateau — hai điểm kề bằng nhau), làm hỏng câu hỏi độ dốc y như phần tử trùng làm hỏng mảng xoay. Thuật toán vẫn vậy; dữ liệu quyết định giả thiết của nó có đúng không.</p>
</div>

<div class="ml-en">
<h3>Matrices: one virtual array, or not binary search at all</h3>
<p><strong>LC 74 (in our words).</strong> Each row is sorted, and each row starts after the previous row ends. Read it row by row and you get one sorted list of m·n numbers. So there is nothing new: index k of that virtual list lives at row <code>k / n</code>, column <code>k % n</code> (integer division). It is exactly what pagination does — item k of a feed is on page <code>k / pageSize</code> at position <code>k % pageSize</code>. Run lowerBound over <code>[0, m·n)</code>.</p>
<p><strong>LC 240 (in our words).</strong> Rows are sorted left to right and columns top to bottom — and nothing else. Read row by row, the numbers are <em>not</em> sorted (the output shows it). Binary searching each row costs O(m log n). A better idea uses the corner: start at the top-right. Everything left of it in its row is smaller, everything below it in its column is bigger. If it is bigger than the target, the whole column below is even bigger — drop the column; if smaller, the whole row to the left is even smaller — drop the row. Each step drops a row or a column: O(m + n).</p>
</div>
<div class="ml-vi">
<h3>Ma trận: một mảng ảo, hoặc hoàn toàn không phải nhị phân</h3>
<p><strong>LC 74 (diễn đạt lại).</strong> Mỗi hàng đã sắp, và mỗi hàng bắt đầu sau khi hàng trước kết thúc. Đọc theo từng hàng là ra một danh sách đã sắp gồm m·n số. Vậy chẳng có gì mới: chỉ số k của danh sách ảo đó nằm ở hàng <code>k / n</code>, cột <code>k % n</code> (chia lấy nguyên). Đó đúng là việc phân trang (pagination) làm — mục thứ k của một bảng tin nằm ở trang <code>k / pageSize</code>, vị trí <code>k % pageSize</code>. Chạy lowerBound trên <code>[0, m·n)</code>.</p>
<p><strong>LC 240 (diễn đạt lại).</strong> Hàng sắp từ trái sang phải và cột sắp từ trên xuống — và không hơn. Đọc theo hàng thì các số <em>không</em> sắp (output cho thấy). Tìm nhị phân từng hàng tốn O(m log n). Một ý hay hơn dùng góc: bắt đầu ở góc trên bên phải. Mọi thứ bên trái nó trong cùng hàng đều nhỏ hơn, mọi thứ bên dưới nó trong cùng cột đều lớn hơn. Nếu nó lớn hơn target thì cả cột bên dưới còn lớn hơn — bỏ cột; nếu nhỏ hơn thì cả hàng bên trái còn nhỏ hơn — bỏ hàng. Mỗi bước bỏ một hàng hoặc một cột: O(m + n).</p>
</div>
${maHai('ch04/ma-tran.ts', 'ch04/MaTran.java', { vung: 'lc74' })}
${maHai('ch04/ma-tran.ts', 'ch04/MaTran.java', { vung: 'lc240' })}
${ketQua('ch04/ma-tran.ts')}
<div class="ml-en">
<p>LC 74: 3–4 probes for 12 cells (log₂ 12 ≈ 3.6). LC 240: 4–7 steps for 16 cells; the worst case is m + n − 1 = 7, reached for 12 (absent, the walk goes all the way across and down). The last line is the reason binary search over the whole LC 240 matrix fails: read row by row, 14 is followed by 3. Choosing the staircase here — and saying "this matrix is not one sorted array, so I will not binary search it" — is the kind of judgement interviewers score.</p>
</div>
<div class="ml-vi">
<p>LC 74: 3–4 lần dò cho 12 ô (log₂ 12 ≈ 3,6). LC 240: 4–7 bước cho 16 ô; xấu nhất là m + n − 1 = 7, xảy ra với 12 (không có, đường đi chạy hết ngang lẫn dọc). Dòng cuối là lý do tìm nhị phân trên cả ma trận LC 240 thất bại: đọc theo hàng thì sau 14 là 3. Chọn đi bậc thang ở đây — và nói "ma trận này không phải một mảng đã sắp, nên em không tìm nhị phân trên nó" — chính là kiểu phán đoán người phỏng vấn chấm điểm.</p>
</div>

<div class="ml-en">
<h3>Where rotated arrays and ring buffers live</h3>
<ul>
<li><strong>Ring buffers</strong> (circular buffers): a fixed array where the writer wraps around and overwrites the oldest entry. The Linux kernel log (<code>dmesg</code> reads the kernel ring buffer), network cards' receive rings, audio buffers, dashcams, "last N requests" debug panels. Finding the oldest entry from timestamps alone is LC 153.</li>
<li><strong>Logs rotated by size or date</strong>: <code>app.log</code>, <code>app.log.1</code>, … each file is sorted by time, the list of files is a rotation — the same two-pass idea finds a timestamp across them.</li>
<li><strong>Peaks</strong>: tuning thread pools, batch sizes, cache sizes; any "more helps, then hurts" curve.</li>
<li><strong>Index arithmetic</strong> (LC 74): pagination, 2D images stored as 1D pixel arrays (<code>y · width + x</code>), seats in an exam room numbered row by row.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Mảng xoay và bộ đệm vòng sống ở đâu</h3>
<ul>
<li><strong>Bộ đệm vòng</strong> (ring buffer / circular buffer): một mảng cố định mà bên ghi quay vòng và ghi đè mục cũ nhất. Log của nhân Linux (<code>dmesg</code> đọc bộ đệm vòng của kernel), vòng nhận gói của card mạng, bộ đệm âm thanh, camera hành trình, bảng gỡ lỗi "N request gần nhất". Tìm mục cũ nhất chỉ từ mốc thời gian chính là LC 153.</li>
<li><strong>Log xoay vòng theo dung lượng hoặc ngày</strong> (log rotation): <code>app.log</code>, <code>app.log.1</code>, … mỗi tệp sắp theo thời gian, danh sách tệp là một phép xoay — cùng ý hai lượt tìm ra một mốc thời gian xuyên các tệp.</li>
<li><strong>Đỉnh</strong>: chỉnh kích thước thread pool, batch size, cache; mọi đường cong "thêm thì tốt, rồi thêm nữa thì hại".</li>
<li><strong>Tính chỉ số</strong> (LC 74): phân trang, ảnh 2D lưu thành mảng điểm ảnh 1D (<code>y · width + x</code>), số ghế phòng thi đánh theo từng hàng.</li>
</ul>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: LC 33</h3>
${hoiThoai([
  ['I', 'A sorted array of distinct integers was rotated at an unknown index. Find a target in O(log n), or return −1.'],
  ['C', 'Just to confirm: all values are distinct, the array is non-empty, and it may also be not rotated at all?'],
  ['N', '"Distinct" matters enormously — with duplicates the best possible worst case is O(n). Asking shows you know.'],
  ['I', 'Yes, distinct, non-empty, possibly not rotated.'],
  ['C', 'A scan is O(n). For O(log n) I need a monotone question. If I compare each element with the last one, the left piece is all bigger and the right piece all smaller or equal, so "a[i] ≤ last" is false-false-…-true-true. The first true is the minimum, the rotation point. That is one binary search.'],
  ['C', 'Then the two sides of the rotation point are both sorted. If the target is ≤ last, it can only be in the right side; otherwise only in the left side. A second binary search — a plain lower bound — on that side. Two O(log n) searches, O(1) space.'],
  ['N', 'Two passes, each one the template. Mention the one-pass version exists, but choose clarity.'],
  ['I', 'Why compare with the last element and not the first?'],
  ['C', 'If it is not rotated, everything is ≤ last, the row is all true and the first true is index 0 — correct with no special case. Comparing with the first, the non-rotated array would have no false at all and I would need an extra branch.'],
  ['C', '(after coding) Trace [6, 8, 9, 12, 1, 3, 4], target 3: pass 1 gives 4; 3 ≤ 4 so I search [4, 7); lower bound gives 5, and a[5] is 3. Target 5: 5 &gt; 4, search [0, 4), lower bound gives 0, a[0] is 6, so −1. One element [1], target 2: p = 0; 2 &gt; 1, so the left piece [0, 0) — empty — and lower bound returns 0 = hi, so −1.'],
  ['I', 'What if duplicates were allowed?'],
  ['C', 'Then "a[i] ≤ last" can be all true, like [1, 1, 1, 0, 1, 1]. I would first trim trailing copies of a[0], then run the same thing. Worst case becomes O(n), and that is unavoidable: among equal values the one different element could be anywhere.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: LC 33</h3>
<p>Bản tiếng Anh ở khối EN; dưới đây là cùng mạch đó bằng tiếng Việt, kèm cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Một mảng đã sắp gồm số nguyên khác nhau bị xoay ở một vị trí không biết. Tìm target trong O(log n), không có thì −1.'],
  ['C', 'Em xác nhận lại: mọi giá trị khác nhau, mảng không rỗng, và có thể hoàn toàn không bị xoay đúng không ạ? <em>("Could it also be not rotated at all?")</em>'],
  ['N', '"Khác nhau" cực kỳ quan trọng — có trùng thì trường hợp xấu nhất tốt nhất có thể là O(n). Hỏi điều này cho thấy bạn biết.'],
  ['I', 'Đúng, khác nhau, không rỗng, có thể không xoay.'],
  ['C', 'Quét thì O(n). Để O(log n) em cần một câu hỏi đơn điệu. Nếu so từng phần tử với phần tử cuối, mẩu trái toàn lớn hơn và mẩu phải toàn nhỏ hơn hoặc bằng, nên "a[i] ≤ cuối" là sai-sai-…-đúng-đúng. Chỗ đúng đầu tiên là phần tử nhỏ nhất, tức điểm xoay. Đó là một lần tìm nhị phân. <em>("The first true is the rotation point.")</em>'],
  ['C', 'Hai bên điểm xoay đều đã sắp. Nếu target ≤ cuối thì nó chỉ có thể ở bên phải; ngược lại chỉ ở bên trái. Lần tìm nhị phân thứ hai — một lower bound thường — trên bên đó. Hai lần O(log n), bộ nhớ O(1).'],
  ['N', 'Hai lượt, mỗi lượt là đúng khuôn. Nhắc rằng có bản một lượt, nhưng chọn sự rõ ràng.'],
  ['I', 'Sao so với phần tử cuối mà không phải phần tử đầu?'],
  ['C', 'Nếu không xoay thì mọi thứ đều ≤ cuối, hàng toàn đúng và chỗ đúng đầu tiên là chỉ số 0 — đúng mà không cần trường hợp đặc biệt. So với phần tử đầu thì mảng không xoay sẽ chẳng có chỗ sai nào và em phải thêm một nhánh. <em>("No special case for the non-rotated array.")</em>'],
  ['C', '(sau khi code) Chạy tay [6, 8, 9, 12, 1, 3, 4], target 3: lượt 1 ra 4; 3 ≤ 4 nên tìm trong [4, 7); lower bound ra 5, và a[5] là 3. Target 5: 5 &gt; 4, tìm trong [0, 4), lower bound ra 0, a[0] là 6, nên −1. Một phần tử [1], target 2: p = 0; 2 &gt; 1 nên là mẩu trái [0, 0) — rỗng — và lower bound trả 0 = hi, nên −1.'],
  ['I', 'Nếu cho phép trùng thì sao?'],
  ['C', 'Khi đó "a[i] ≤ cuối" có thể toàn đúng, như [1, 1, 1, 0, 1, 1]. Em sẽ cắt các bản sao của a[0] ở cuối trước, rồi chạy y như cũ. Xấu nhất thành O(n), và không tránh được: giữa các giá trị bằng nhau, phần tử khác biệt có thể nằm ở bất cứ đâu. <em>("In the worst case it is O(n), and no algorithm can do better.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Comparing with <code>a[0]</code> and forgetting the non-rotated array.</li>
<li>Searching the wrong piece in pass 2: the rule is "target ≤ last ⇒ right piece <code>[p, n)</code>", and the right piece includes p itself.</li>
<li>Claiming O(log n) for LC 81/154 — with duplicates the honest answer is "O(log n) typical, O(n) worst case".</li>
<li>Reading <code>a[mid + 1]</code> in the peak search with <code>hi = n</code>: the range must be <code>[0, n − 1)</code> so mid + 1 ≤ n − 1.</li>
<li>Saying "find peak returns the maximum".</li>
<li>Binary searching an LC 240-style matrix row by row as if it were one sorted array.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>So với <code>a[0]</code> rồi quên mảng không bị xoay.</li>
<li>Tìm nhầm mẩu ở lượt 2: luật là "target ≤ cuối ⇒ mẩu phải <code>[p, n)</code>", và mẩu phải gồm cả chính p.</li>
<li>Khẳng định O(log n) cho LC 81/154 — có trùng thì câu trả lời trung thực là "thường O(log n), xấu nhất O(n)".</li>
<li>Đọc <code>a[mid + 1]</code> khi tìm đỉnh mà để <code>hi = n</code>: đoạn phải là <code>[0, n − 1)</code> để mid + 1 ≤ n − 1.</li>
<li>Nói "tìm đỉnh trả về phần tử lớn nhất".</li>
<li>Tìm nhị phân một ma trận kiểu LC 240 theo từng hàng như thể nó là một mảng đã sắp.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Lời giải từng bước của 8 đề tổng hợp nằm ở <a href="${baiNay('dsa-4-4-luyen')}">bài 4.4 (Bộ luyện 4)</a>.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Write the F/T row of "a[i] ≤ last" for <code>[15, 18, 2, 3, 6, 12]</code> and for <code>[2, 3, 6, 12, 15, 18]</code>. Predict the rotation point for both, then run your code.</li>
<li>Solve LC 153 and LC 33 with the template (two passes). Submit both.</li>
<li>Run your LC 153 on <code>[3, 3, 1, 3]</code>: write down the wrong answer, add the trim, and explain the O(n) worst case in one sentence.</li>
<li>Solve LC 162 and answer in writing: "why is a peak guaranteed on the uphill side?"</li>
</ol>
<p><strong>Done when:</strong> three accepted submissions (153, 33, 162) using the unchanged <code>firstTrue</code>, the duplicate bug reproduced and fixed, and the two one-sentence explanations in your notebook.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">rotated sorted array</span><span class="v">A sorted array cut once and the two pieces swapped.</span></div>
  <div class="kv"><span class="k">rotation point (pivot)</span><span class="v">Index of the minimum; both sides of it are sorted.</span></div>
  <div class="kv"><span class="k">peak (local maximum)</span><span class="v">An element strictly bigger than both neighbours.</span></div>
  <div class="kv"><span class="k">mountain / bitonic array</span><span class="v">Strictly increasing, then strictly decreasing: exactly one peak.</span></div>
  <div class="kv"><span class="k">ring buffer</span><span class="v">A fixed array written in a circle, overwriting the oldest entry.</span></div>
  <div class="kv"><span class="k">adversary argument</span><span class="v">A proof of a lower bound: "the input could hide the answer in any cell you did not read".</span></div>
  <div class="kv"><span class="k">row-major order</span><span class="v">Storing a matrix row after row; cell (r, c) is index r·n + c.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Binary search needs a question with a F→T boundary, not a sorted array.</li>
<li>Rotated array: first T of "a[i] ≤ last" = minimum; then lowerBound in the piece that can hold the target.</li>
<li>Duplicates make the worst case O(n) for every algorithm; trim, then reuse the template.</li>
<li>firstTrue always returns a F→T boundary — that is why it finds a peak on non-monotone rows.</li>
<li>Row-major sorted matrix = one virtual array; rows-and-columns-sorted matrix = staircase O(m + n).</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Binary Search', 'The standard order of the binary search problems, with video solutions', 'https://neetcode.io/roadmap')}
${nguon('🐧', 'dmesg(1) — Linux manual page', 'Reading the kernel ring buffer: a real circular log', 'https://man7.org/linux/man-pages/man1/dmesg.1.html')}
${nguon('📙', 'cp-algorithms — Ternary search', 'Finding the maximum of a unimodal function — the continuous cousin of "find peak"', 'https://cp-algorithms.com/num_methods/ternary_search.html')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết hàng F/T của "a[i] ≤ cuối" cho <code>[15, 18, 2, 3, 6, 12]</code> và cho <code>[2, 3, 6, 12, 15, 18]</code>. Đoán điểm xoay của cả hai, rồi chạy code của bạn.</li>
<li>Giải LC 153 và LC 33 bằng khuôn (hai lượt). Nộp cả hai.</li>
<li>Chạy LC 153 của bạn trên <code>[3, 3, 1, 3]</code>: ghi lại đáp án sai, thêm phép cắt, và giải thích trường hợp xấu nhất O(n) trong một câu.</li>
<li>Giải LC 162 và trả lời bằng chữ: "vì sao chắc chắn có đỉnh ở phía dốc lên?"</li>
</ol>
<p><strong>Đạt khi:</strong> ba lượt nộp Accepted (153, 33, 162) dùng <code>firstTrue</code> không sửa, tái hiện được và sửa được lỗi phần tử trùng, và hai câu giải thích nằm trong sổ.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">rotated sorted array (mảng đã sắp bị xoay)</span><span class="v">Mảng đã sắp bị cắt một lần rồi đổi chỗ hai mẩu.</span></div>
  <div class="kv"><span class="k">rotation point / pivot (điểm xoay)</span><span class="v">Chỉ số phần tử nhỏ nhất; hai bên nó đều đã sắp.</span></div>
  <div class="kv"><span class="k">peak / local maximum (đỉnh / cực đại địa phương)</span><span class="v">Phần tử lớn hơn hẳn cả hai phần tử kề.</span></div>
  <div class="kv"><span class="k">mountain / bitonic array (mảng hình núi)</span><span class="v">Tăng ngặt rồi giảm ngặt: đúng một đỉnh.</span></div>
  <div class="kv"><span class="k">ring buffer (bộ đệm vòng)</span><span class="v">Mảng cố định ghi theo vòng tròn, ghi đè mục cũ nhất.</span></div>
  <div class="kv"><span class="k">adversary argument (lập luận đối thủ)</span><span class="v">Chứng minh cận dưới: "đầu vào có thể giấu đáp án ở bất kỳ ô nào bạn chưa đọc".</span></div>
  <div class="kv"><span class="k">row-major order (thứ tự theo hàng)</span><span class="v">Lưu ma trận hết hàng này tới hàng kia; ô (r, c) là chỉ số r·n + c.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Tìm nhị phân cần một câu hỏi có ranh giới F→T, không cần mảng đã sắp.</li>
<li>Mảng xoay: T đầu tiên của "a[i] ≤ cuối" = phần tử nhỏ nhất; rồi lowerBound trong mẩu có thể chứa target.</li>
<li>Phần tử trùng làm xấu nhất thành O(n) với MỌI thuật toán; cắt rồi dùng lại khuôn.</li>
<li>firstTrue luôn trả về một ranh giới F→T — vì thế nó tìm được đỉnh trên hàng không đơn điệu.</li>
<li>Ma trận sắp theo hàng nối tiếp = một mảng ảo; ma trận hàng-và-cột-đều-sắp = đi bậc thang O(m + n).</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Binary Search', 'Thứ tự chuẩn các đề tìm nhị phân, có video lời giải (tiếng Anh)', 'https://neetcode.io/roadmap')}
${nguon('🐧', 'dmesg(1) — Linux manual page', 'Đọc bộ đệm vòng của nhân Linux: một log vòng tròn có thật', 'https://man7.org/linux/man-pages/man1/dmesg.1.html')}
${nguon('📙', 'cp-algorithms — Ternary search', 'Tìm cực đại của hàm một đỉnh — "anh em họ" liên tục của bài tìm đỉnh', 'https://cp-algorithms.com/num_methods/ternary_search.html')}
</div>
`,
};
