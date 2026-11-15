/** 4.1 — Tìm kiếm nhị phân: MỘT khuôn bất biến. Mọi mã/output đọc từ ../ma/ch04 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { vetFirstTrue, vetSai } from '../ma/ch04/nhi-phan.vet.mjs';
import { bangFirstTrue } from './_rieng.mjs';

const A = [1, 3, 3, 3, 5, 8, 8, 10];
const BANG_LB = bangFirstTrue(A, vetFirstTrue(0, A.length, (i) => A[i] >= 3), { cotGt: 'a[mid] ≥ 3 ?', giaTri: (m) => `${A[m]}` });
const BANG_UB = bangFirstTrue(A, vetFirstTrue(0, A.length, (i) => A[i] > 3), { cotGt: 'a[mid] &gt; 3 ?', giaTri: (m) => `${A[m]}` });

const B = [1, 3, 5, 6];
const sai = vetSai('lo=mid', 0, B.length, (i) => B[i] >= 7, 6);
const BANG_SAI = bangVet(['round', '[lo, hi) · mid', 'a[mid] ≥ 7 ?', 'update (BUG: lo = mid)', 'next [lo, hi)'],
  sai.map((h) => h.ket
    ? ['…', '', '', '⛔ lo never moves: hi − lo stays 1 forever', 'STUCK']
    : [String(h.vong), oMang([...B, '·'], { tu: h.lo, den: h.hi - 1, to: { [h.mid]: 'r' }, chiSo: true }), String(B[h.mid]),
      h.t ? 'T ⇒ hi = mid' : 'F ⇒ lo = mid', `[${h.loMoi}, ${h.hiMoi})`]));

const DE = [
  [lc(704, 'binary-search', 'Binary Search', 'Easy'), 'Warm-up: lowerBound, then check that the slot really holds the target.', 'Khởi động: lowerBound, rồi kiểm ô đó có đúng là target không.'],
  [lc(35, 'search-insert-position', 'Search Insert Position', 'Easy'), 'The answer IS lowerBound — note hi starts at n, not n − 1.', 'Đáp án CHÍNH LÀ lowerBound — để ý hi bắt đầu ở n chứ không phải n − 1.'],
  [lc(278, 'first-bad-version', 'First Bad Version', 'Easy'), 'Pure F…F T…T on 1..n; n can be 2³¹ − 1 ⇒ overflow trap.', 'Hàng F…F T…T thuần trên 1..n; n tới 2³¹ − 1 ⇒ bẫy tràn số.'],
  [lc(374, 'guess-number-higher-or-lower', 'Guess Number Higher or Lower', 'Easy'), 'The guessing game itself; turn the −1/0/1 answer into a yes/no question.', 'Chính trò đoán số; đổi câu trả lời −1/0/1 thành câu hỏi có/không.'],
  [lc(2529, 'maximum-count-of-positive-integer-and-negative-integer', 'Maximum Count of Positive Integer and Negative Integer', 'Easy'), 'Two bounds: first ≥ 0 and first &gt; 0. Counting with bounds, no loop over values.', 'Hai cận: phần tử đầu ≥ 0 và đầu &gt; 0. Đếm bằng cận, không duyệt giá trị.'],
  [lc(367, 'valid-perfect-square', 'Valid Perfect Square', 'Easy'), 'No array: search x in [1, num]; mid·mid overflows int ⇒ long.', 'Không có mảng: tìm x trong [1, num]; mid·mid tràn int ⇒ dùng long.'],
  [lc(1351, 'count-negative-numbers-in-a-sorted-matrix', 'Count Negative Numbers in a Sorted Matrix', 'Easy'), 'One upper bound per row (O(m log n)), then try the O(m + n) staircase.', 'Mỗi hàng một lần tìm cận (O(m log n)), rồi thử bậc thang O(m + n).'],
  [lc(34, 'find-first-and-last-position-of-element-in-sorted-array', 'Find First and Last Position of Element in Sorted Array', 'Medium'), 'lowerBound and upperBound − 1 — the worked example of this lesson.', 'lowerBound và upperBound − 1 — đề giải mẫu của bài này.'],
  [lc(981, 'time-based-key-value-store', 'Time Based Key-Value Store', 'Medium'), '"Latest value at time t" = last timestamp ≤ t = upperBound − 1.', '"Giá trị mới nhất tại thời điểm t" = mốc cuối ≤ t = upperBound − 1.'],
];

export default {
  title: '4.1 — Binary search: one invariant template for every variant|||4.1 — Tìm kiếm nhị phân: một khuôn bất biến cho mọi biến thể',
  slug: 'dsa-4-1-co-ban',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một khuôn firstTrue nửa mở [lo, hi) cho lower/upper bound, vị trí đầu/cuối, First Bad Version — bảng vết lo/mid/hi, bốn lỗi lệch một chạy thật, tràn số (lo + hi)/2 tái hiện đúng bug JDK 2006, đo 10³…10⁷ và git bisect thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Binary search: one invariant template for every variant</h2>
<p class="lead">Binary search is the algorithm everyone "knows" and almost nobody writes correctly under pressure: the idea fits in one sentence, but the details — <code>&lt;</code> or <code>&lt;=</code>, <code>mid</code> or <code>mid + 1</code>, <code>n</code> or <code>n − 1</code> — are where candidates lose ten minutes and the interviewer's confidence. This lesson gives you <strong>one</strong> template with a written invariant, used for every problem in this chapter, so that you never again "try <code>+1</code> and see if it passes". You will watch it run step by step, see four almost-correct versions fail in real runs, reproduce the famous 2006 JDK overflow bug on a real 1.1 GB array, measure linear vs binary from 10³ to 10⁷ elements, and use <code>git bisect</code> on a real repository.</p>

<h3>The everyday picture</h3>
<p>Your friend thinks of a number from 1 to 100 and only answers "higher" or "lower". Nobody guesses 1, 2, 3…; everyone starts at 50, then 25 or 75, and so on. Each question throws away <em>half</em> of what is left, so 100 → 50 → 25 → 13 → 7 → 4 → 2 → 1: at most 7 questions. With a million numbers it is 20 questions, with a billion it is 30. That is the entire power of binary search: the number of steps is the number of times you can halve n, written log₂ n.</p>
<p>The same thing happens when you look up a word in a paper dictionary, find your name in the class list sorted alphabetically outside the exam room, or find the page where chapter 7 starts. You open somewhere in the middle, decide "too far" or "not far enough", and keep only the half that can still contain the answer.</p>
<p>Formally: <strong>binary search</strong> works on a range whose elements answer a yes/no question in a <strong>monotone</strong> way — all "no" first, then all "yes" (we write it F…F T…T). It finds the boundary in O(log n) questions. A sorted array is the most common such range, but not the only one: versions of a program (good… good, bad… bad), possible answers to an optimisation problem (too small… too small, enough… enough) and commits in a Git history are all F…F T…T rows. Chapter 4 is about learning to <em>see</em> that row.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Tìm kiếm nhị phân: một khuôn bất biến cho mọi biến thể</h2>
<p class="lead">Tìm kiếm nhị phân (binary search) là thuật toán ai cũng "biết" nhưng hầu như không ai viết đúng ngay khi bị áp lực: ý tưởng gói trong một câu, còn chi tiết — <code>&lt;</code> hay <code>&lt;=</code>, <code>mid</code> hay <code>mid + 1</code>, <code>n</code> hay <code>n − 1</code> — là chỗ ứng viên mất mười phút và mất luôn niềm tin của người phỏng vấn. Bài này đưa bạn <strong>một</strong> khuôn duy nhất có ghi rõ bất biến (invariant — điều luôn đúng sau mỗi vòng lặp), dùng cho mọi đề trong chương, để bạn không bao giờ phải "thử thêm <code>+1</code> xem có qua không" nữa. Bạn sẽ xem nó chạy từng bước, thấy bốn bản "gần đúng" hỏng trong lần chạy thật, tái hiện đúng con bug tràn số nổi tiếng của JDK năm 2006 trên một mảng thật 1,1 GB, đo tuyến tính vs nhị phân từ 10³ tới 10⁷ phần tử, và dùng <code>git bisect</code> trên một kho Git thật.</p>

<h3>Hình dung đời thường</h3>
<p>Bạn của bạn nghĩ một số từ 1 đến 100 và chỉ trả lời "cao hơn" hoặc "thấp hơn". Không ai đoán 1, 2, 3…; ai cũng bắt đầu từ 50, rồi 25 hoặc 75, cứ thế. Mỗi câu hỏi vứt đi <em>một nửa</em> phần còn lại, nên 100 → 50 → 25 → 13 → 7 → 4 → 2 → 1: nhiều nhất 7 câu. Một triệu số thì 20 câu, một tỷ số thì 30 câu. Toàn bộ sức mạnh của tìm kiếm nhị phân nằm ở đó: số bước bằng số lần bạn chia đôi được n, viết là log₂ n.</p>
<p>Chuyện y hệt xảy ra khi bạn tra từ trong cuốn từ điển giấy, tìm tên mình trong danh sách lớp dán ngoài phòng thi (xếp theo vần A–Z), hay tìm trang bắt đầu chương 7. Bạn mở đâu đó ở giữa, quyết định "quá rồi" hay "chưa tới", và chỉ giữ lại nửa còn có thể chứa đáp án.</p>
<p>Nói cho chuẩn: <strong>tìm kiếm nhị phân</strong> chạy trên một dãy mà mỗi phần tử trả lời một câu hỏi có/không theo kiểu <strong>đơn điệu</strong> (monotone) — toàn "không" trước, rồi toàn "có" (ta viết là F…F T…T, F = false/sai, T = true/đúng). Nó tìm ra ranh giới sau O(log n) câu hỏi. Mảng đã sắp xếp là dãy kiểu này hay gặp nhất, nhưng không phải duy nhất: các phiên bản của một chương trình (tốt… tốt, lỗi… lỗi), các đáp án có thể của một bài tối ưu (chưa đủ… chưa đủ, đủ… đủ) và các commit trong lịch sử Git đều là hàng F…F T…T. Cả Chương 4 là học cách <em>nhìn ra</em> hàng đó.</p>
${csd('csd201-slide-cs1-1', 'vi', '⭐ CS.1 — Tìm kiếm nhị phân (1): bẫy, bất biến, lower/upper bound', '<p>Ở CSD201 bạn đã thấy vì sao nhị phân là O(log n), bản đoạn đóng <code>while (lo &lt;= hi)</code> quen thuộc, và khuôn "T đầu tiên" trên đoạn nửa mở. Khoá này dùng <strong>đúng khuôn đó</strong> (cùng tên <code>firstTrue</code>) để bạn không phải học hai kiểu. <strong>Ở đây đi sâu thêm:</strong> cách TRÌNH BÀY khi phỏng vấn, bốn lỗi lệch một chạy thật, đo thật 10³…10⁷, tái hiện bug JDK 2006 trên mảng thật, cả bản TypeScript (bẫy <code>&gt;&gt; 1</code> riêng của JavaScript), và git bisect.</p>')}
</div>

<div class="ml-en">
<h3>Signals: when an interviewer is asking for binary search</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"the array is sorted"</span><span class="v">If the input is sorted and you are about to scan it, stop: the sortedness is a hint worth O(n) → O(log n).</span></div>
  <div class="kv"><span class="k">"first / last position", "insert position", "how many equal to x"</span><span class="v">Boundaries between "smaller" and "not smaller": lower bound and upper bound.</span></div>
  <div class="kv"><span class="k">"must run in O(log n)"</span><span class="v">Almost always binary search (or a balanced tree / heap operation).</span></div>
  <div class="kv"><span class="k">"the smallest x such that…", "the largest x such that…"</span><span class="v">If "x works" implies "x + 1 works" (or the reverse), the answers form an F…F T…T row — binary search on the answer (lesson 4.3).</span></div>
  <div class="kv"><span class="k">the range is huge but there is no array (n ≤ 2³¹ − 1, values ≤ 10⁹)</span><span class="v">You cannot even loop over it: only O(log n) questions fit. Think "versions", "capacity", "speed".</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: khi người phỏng vấn đang chờ bạn dùng nhị phân</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"mảng đã được sắp xếp"</span><span class="v">Đầu vào đã sắp mà bạn sắp sửa quét từ đầu đến cuối thì dừng lại: việc đã sắp chính là gợi ý đáng giá O(n) → O(log n).</span></div>
  <div class="kv"><span class="k">"vị trí đầu / cuối", "vị trí chèn", "có bao nhiêu phần tử bằng x"</span><span class="v">Ranh giới giữa "nhỏ hơn" và "không nhỏ hơn": lower bound (cận dưới) và upper bound (cận trên).</span></div>
  <div class="kv"><span class="k">"yêu cầu O(log n)"</span><span class="v">Gần như chắc chắn là nhị phân (hoặc một thao tác trên cây cân bằng / heap).</span></div>
  <div class="kv"><span class="k">"x nhỏ nhất sao cho…", "x lớn nhất sao cho…"</span><span class="v">Nếu "x được" kéo theo "x + 1 cũng được" (hoặc ngược lại), các đáp án tạo thành hàng F…F T…T — tìm nhị phân trên đáp án (bài 4.3).</span></div>
  <div class="kv"><span class="k">khoảng cực lớn mà không có mảng (n ≤ 2³¹ − 1, giá trị ≤ 10⁹)</span><span class="v">Bạn không thể duyệt hết: chỉ vừa O(log n) câu hỏi. Hãy nghĩ tới "phiên bản", "sức chứa", "tốc độ".</span></div>
</div>
</div>

<div class="ml-en">
<h3>The one template: "first T" on a half-open range</h3>
<p>Every binary search in this course is the same function. You give it a range <code>[lo, hi)</code> — <strong>half-open</strong>: <code>lo</code> included, <code>hi</code> excluded — and a yes/no function <code>ok(i)</code> that is F…F T…T on that range. It returns the first index where <code>ok</code> is T, or <code>hi</code> if there is none.</p>
<p>The <strong>invariant</strong> (what is true before and after every round) is two sentences, and they are the whole proof:</p>
<ul>
<li>every index <strong>left of <code>lo</code></strong> is known to be F;</li>
<li>every index <strong>from <code>hi</code> onwards</strong> is known to be T (at the start nothing is known: <code>hi = n</code> is one past the end, an imaginary "T" slot).</li>
</ul>
<p>Only <code>[lo, hi)</code> is unknown. Each round looks at the middle: if <code>ok(mid)</code> is T, then mid and everything after it is T, so <code>hi = mid</code> keeps the invariant; if F, mid and everything before it is F, so <code>lo = mid + 1</code>. When <code>lo == hi</code> nothing is unknown: left of <code>lo</code> is all F, from <code>lo</code> on is all T, so <code>lo</code> <em>is</em> the first T. You never need an "if found, return" inside the loop.</p>
</div>
<div class="ml-vi">
<h3>Khuôn duy nhất: "T đầu tiên" trên đoạn nửa mở</h3>
<p>Mọi lần tìm nhị phân trong khoá này là cùng một hàm. Bạn đưa cho nó một đoạn <code>[lo, hi)</code> — <strong>nửa mở</strong> (half-open): có <code>lo</code>, không có <code>hi</code> — và một hàm có/không <code>ok(i)</code> có dạng F…F T…T trên đoạn đó. Nó trả về chỉ số đầu tiên mà <code>ok</code> là T, hoặc <code>hi</code> nếu không có.</p>
<p><strong>Bất biến</strong> (điều đúng trước và sau mỗi vòng) gồm hai câu, và hai câu này là toàn bộ chứng minh:</p>
<ul>
<li>mọi chỉ số <strong>bên trái <code>lo</code></strong> đã biết chắc là F;</li>
<li>mọi chỉ số <strong>từ <code>hi</code> trở đi</strong> đã biết chắc là T (lúc đầu chưa biết gì: <code>hi = n</code> là ô ngay sau phần tử cuối, một ô "T" tưởng tượng).</li>
</ul>
<p>Chỉ có <code>[lo, hi)</code> là chưa biết. Mỗi vòng nhìn vào giữa: nếu <code>ok(mid)</code> là T thì mid và mọi thứ sau nó đều T, nên <code>hi = mid</code> giữ nguyên bất biến; nếu F thì mid và mọi thứ trước nó đều F, nên <code>lo = mid + 1</code>. Khi <code>lo == hi</code> thì không còn gì chưa biết: bên trái <code>lo</code> toàn F, từ <code>lo</code> trở đi toàn T, nên <code>lo</code> <em>chính là</em> T đầu tiên. Bạn không bao giờ cần "nếu tìm thấy thì return" bên trong vòng lặp.</p>
</div>

<div class="ml-en">
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Write the F/T row</span><span class="lz-d">In words: "ok(i) = a[i] ≥ x". Check it is F…F T…T. If it is T…T F…F, negate it.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Choose [lo, hi)</span><span class="lz-d">lo = first candidate, hi = one past the last candidate (the "none" answer). For an array: [0, n).</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Loop while lo &lt; hi</span><span class="lz-d">mid = lo + (hi − lo) / 2 rounded down ⇒ lo ≤ mid &lt; hi. T ⇒ hi = mid; F ⇒ lo = mid + 1.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Return lo, then interpret</span><span class="lz-d">lo is the first T (or hi = "none"). The caller decides: check equality, subtract 1 for "last F", etc.</span></div>
</div>
</div>
<div class="ml-vi">
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Viết hàng F/T</span><span class="lz-d">Bằng lời: "ok(i) = a[i] ≥ x". Kiểm nó đúng dạng F…F T…T. Nếu là T…T F…F thì phủ định nó.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Chọn [lo, hi)</span><span class="lz-d">lo = ứng viên đầu tiên, hi = ngay sau ứng viên cuối (tức đáp án "không có"). Với mảng: [0, n).</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Lặp khi lo &lt; hi</span><span class="lz-d">mid = lo + (hi − lo) / 2 làm tròn xuống ⇒ lo ≤ mid &lt; hi. T ⇒ hi = mid; F ⇒ lo = mid + 1.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Trả lo, rồi diễn giải</span><span class="lz-d">lo là T đầu tiên (hoặc hi = "không có"). Nơi gọi tự quyết: kiểm bằng nhau, trừ 1 để lấy "F cuối cùng"…</span></div>
</div>
</div>

${maHai('ch04/lower-bound.ts', 'ch04/LowerBound.java', { vung: 'khuon' })}

<div class="ml-en">
<p>Why these exact choices, line by line — this is what you say out loud:</p>
<ul>
<li><code>while (lo &lt; hi)</code>: the loop runs while the unknown part <code>[lo, hi)</code> is non-empty. With a half-open range "empty" means <code>lo == hi</code>, so the condition is strict.</li>
<li><code>mid = lo + (hi − lo) / 2</code>, rounded down: guarantees <code>lo ≤ mid &lt; hi</code>. Because <code>mid &lt; hi</code>, we never read <code>a[n]</code>, and both updates make the range strictly smaller (<code>hi = mid &lt; hi</code>, <code>lo = mid + 1 &gt; lo</code>), so the loop always ends. Writing it as <code>lo + (hi − lo) / 2</code> instead of <code>(lo + hi) / 2</code> avoids integer overflow — the story is below.</li>
<li><code>hi = mid</code> on T, not <code>mid − 1</code>: mid itself could be the first T, and <code>hi</code> means "known T", so mid is allowed to become the new <code>hi</code>.</li>
<li><code>lo = mid + 1</code> on F: mid is known F, and <code>lo</code> means "everything left of me is F", so lo moves just past mid.</li>
</ul>
<p>Once this function exists, the classic questions are one-liners on top of it:</p>
</div>
<div class="ml-vi">
<p>Vì sao chọn chính xác như vậy, từng dòng — đây là điều bạn nói to khi phỏng vấn:</p>
<ul>
<li><code>while (lo &lt; hi)</code>: vòng chạy khi phần chưa biết <code>[lo, hi)</code> còn khác rỗng. Với đoạn nửa mở, "rỗng" nghĩa là <code>lo == hi</code>, nên điều kiện là dấu nhỏ hơn ngặt.</li>
<li><code>mid = lo + (hi − lo) / 2</code>, làm tròn xuống: đảm bảo <code>lo ≤ mid &lt; hi</code>. Vì <code>mid &lt; hi</code> nên không bao giờ đọc <code>a[n]</code>, và cả hai phép cập nhật đều làm đoạn nhỏ đi ngặt (<code>hi = mid &lt; hi</code>, <code>lo = mid + 1 &gt; lo</code>), nên vòng lặp luôn dừng. Viết <code>lo + (hi − lo) / 2</code> thay vì <code>(lo + hi) / 2</code> để tránh tràn số nguyên (integer overflow) — câu chuyện nằm ở phần dưới.</li>
<li>Gặp T thì <code>hi = mid</code>, không phải <code>mid − 1</code>: chính mid có thể là T đầu tiên, mà <code>hi</code> nghĩa là "đã biết là T", nên mid được phép thành <code>hi</code> mới.</li>
<li>Gặp F thì <code>lo = mid + 1</code>: mid đã biết là F, mà <code>lo</code> nghĩa là "mọi thứ bên trái tôi là F", nên lo nhảy qua ngay sau mid.</li>
</ul>
<p>Có hàm này rồi, các câu hỏi kinh điển chỉ còn là một dòng đặt lên trên nó:</p>
</div>

<div class="ml-en">
<h3>Worked example: LC 704, LC 35 and LC 34 from one function</h3>
<p><strong>Problem (in our words).</strong> You get a sorted array (duplicates allowed) and a target. Three questions interviewers ask about it: (a) any index of the target, or −1 (LC 704); (b) the index where the target is, or where it would be inserted to keep the order (LC 35); (c) the first and last index of the target, or <code>[−1, −1]</code> (LC 34). Example: <code>a = [1, 3, 3, 3, 5, 8, 8, 10]</code>, target 3 → (a) 1, (b) 1, (c) <code>[1, 3]</code>.</p>
<p><strong>Brute force, said first.</strong> Scan from the left until <code>a[i] ≥ target</code>; scan on while equal. O(n) time, O(1) space — correct, and it ignores the one thing the problem gives you for free: the order.</p>
<p><strong>The idea.</strong> Define two boundaries. <code>lowerBound(x)</code> = first index with <code>a[i] ≥ x</code> (the row "is a[i] ≥ x?" is F…F T…T because the array is sorted). <code>upperBound(x)</code> = first index with <code>a[i] &gt; x</code>. All copies of x live exactly in <code>[lowerBound, upperBound)</code> — another half-open range. Then: (a) <code>lowerBound</code> plus a check that the slot really holds x; (b) <code>lowerBound</code> itself; (c) <code>[lowerBound, upperBound − 1]</code> if x is present.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: LC 704, LC 35 và LC 34 từ cùng một hàm</h3>
<p><strong>Đề (diễn đạt lại).</strong> Bạn có một mảng đã sắp xếp (được phép trùng) và một target. Người phỏng vấn hay hỏi ba câu: (a) một chỉ số bất kỳ của target, không có thì −1 (LC 704); (b) chỉ số của target, hoặc chỗ phải chèn nó vào để mảng vẫn đúng thứ tự (LC 35); (c) chỉ số đầu và cuối của target, không có thì <code>[−1, −1]</code> (LC 34). Ví dụ: <code>a = [1, 3, 3, 3, 5, 8, 8, 10]</code>, target 3 → (a) 1, (b) 1, (c) <code>[1, 3]</code>.</p>
<p><strong>Vét cạn, nói trước.</strong> Quét từ trái tới khi <code>a[i] ≥ target</code>; quét tiếp khi còn bằng. O(n) thời gian, O(1) bộ nhớ — đúng, nhưng bỏ phí đúng thứ mà đề cho không: thứ tự.</p>
<p><strong>Ý chính.</strong> Định nghĩa hai ranh giới. <code>lowerBound(x)</code> = chỉ số đầu tiên có <code>a[i] ≥ x</code> (hàng "a[i] ≥ x không?" là F…F T…T vì mảng đã sắp). <code>upperBound(x)</code> = chỉ số đầu tiên có <code>a[i] &gt; x</code>. Mọi bản sao của x nằm đúng trong <code>[lowerBound, upperBound)</code> — lại một đoạn nửa mở. Khi đó: (a) <code>lowerBound</code> rồi kiểm ô đó có đúng là x; (b) chính <code>lowerBound</code>; (c) <code>[lowerBound, upperBound − 1]</code> nếu x có mặt.</p>
</div>

${maHai('ch04/lower-bound.ts', 'ch04/LowerBound.java', { vung: 'bounds' })}
${maHai('ch04/lower-bound.ts', 'ch04/LowerBound.java', { vung: 'lc34' })}
${ketQua('ch04/lower-bound.ts')}
${ketQua('ch04/LowerBound.java')}

<div class="ml-en">
<p>Read the output as a table of facts you should be able to predict before running: for <code>x = 4</code> (absent) both bounds are 4 — the slot where 4 would go, between the last 3 and the 5 — and the count is 0. For <code>x = 11</code> (bigger than everything) both bounds are 8 = n: "none is ≥ 11", which is exactly why <code>hi</code> must start at n. For <code>x = 0</code> both are 0. The last line is the safety net: 3,000 random small arrays (empty, one element, all equal, negatives) compared with a slow linear scan, 0 mismatches. In an interview you cannot run 3,000 cases, but you can say "I'd test empty, one element, target smaller than all, larger than all, and duplicates" — the same list.</p>
<p>The <code>first === nums.length || nums[first] !== target</code> check in LC 34 is in that order on purpose: when <code>first == n</code>, reading <code>nums[first]</code> would be out of bounds in Java (an exception) and <code>undefined</code> in TypeScript (silently wrong). Short-circuit evaluation (<code>||</code> stops at the first true) makes the order a safety feature.</p>
</div>
<div class="ml-vi">
<p>Đọc output như một bảng sự thật mà bạn phải đoán được TRƯỚC khi chạy: với <code>x = 4</code> (không có) hai cận đều là 4 — ô mà 4 sẽ được chèn vào, giữa số 3 cuối và số 5 — và số lượng là 0. Với <code>x = 11</code> (lớn hơn tất cả) hai cận đều là 8 = n: "không phần tử nào ≥ 11", đó chính là lý do <code>hi</code> phải bắt đầu ở n. Với <code>x = 0</code> cả hai là 0. Dòng cuối là lưới an toàn: 3.000 mảng nhỏ ngẫu nhiên (rỗng, một phần tử, toàn bằng nhau, số âm) so với một lần quét tuyến tính chậm, 0 chỗ lệch. Lúc phỏng vấn bạn không chạy được 3.000 ca, nhưng bạn nói được "em sẽ test mảng rỗng, một phần tử, target nhỏ hơn tất cả, lớn hơn tất cả, và có phần tử trùng" — đúng danh sách đó.</p>
<p>Phép kiểm <code>first === nums.length || nums[first] !== target</code> trong LC 34 cố tình viết theo thứ tự này: khi <code>first == n</code>, đọc <code>nums[first]</code> trong Java là ra ngoài mảng (ném ngoại lệ) còn trong TypeScript là <code>undefined</code> (sai lặng lẽ). Phép "hoặc" ngắn mạch (short-circuit — <code>||</code> dừng ngay ở vế đúng đầu tiên) biến thứ tự hai vế thành một lớp bảo vệ.</p>
</div>

<div class="ml-en">
<h3>Watch it run: lo, mid, hi after every round</h3>
<p>Below, the extra cell "·" at index 8 is position n — <em>outside</em> the array. It is drawn because <code>hi</code> starts there, and forgetting that slot is the most common off-by-one in binary search. Green = the unknown range <code>[lo, hi)</code>, orange = mid. Both tables were produced by running the template, not typed by hand. First <code>lowerBound(a, 3)</code>, the row "a[i] ≥ 3":</p>
</div>
<div class="ml-vi">
<h3>Xem nó chạy: lo, mid, hi sau từng vòng</h3>
<p>Dưới đây, ô thêm "·" ở chỉ số 8 là vị trí n — <em>ngoài</em> mảng. Nó được vẽ ra vì <code>hi</code> bắt đầu ở đó, và quên ô này là lỗi lệch một (off-by-one) hay gặp nhất của tìm nhị phân. Xanh lá = phần chưa biết <code>[lo, hi)</code>, cam = mid. Cả hai bảng đều do chạy khuôn thật sinh ra, không gõ tay. Trước hết là <code>lowerBound(a, 3)</code>, hàng "a[i] ≥ 3":</p>
</div>
${BANG_LB}
<div class="ml-en">
<p>Four rounds for 8 elements (log₂ 8 = 3, plus one because the range sizes were 8 → 4 → 2 → 1 → 0). Notice round 2 and 3: <code>a[mid] = 3</code> is already a 3, but the template does <em>not</em> stop — it keeps pushing <code>hi</code> left, because the question is "the FIRST T", and only the final <code>lo == hi</code> proves nothing to the left is also T. Now <code>upperBound(a, 3)</code>, the row "a[i] &gt; 3" — same loop, one character different in <code>ok</code>:</p>
</div>
<div class="ml-vi">
<p>Bốn vòng cho 8 phần tử (log₂ 8 = 3, cộng một vì kích thước đoạn đi 8 → 4 → 2 → 1 → 0). Để ý vòng 2 và 3: <code>a[mid] = 3</code> đã là số 3 rồi, nhưng khuôn KHÔNG dừng — nó tiếp tục đẩy <code>hi</code> sang trái, vì câu hỏi là "T ĐẦU TIÊN", và chỉ khi <code>lo == hi</code> mới chứng minh được bên trái không còn T nào. Giờ là <code>upperBound(a, 3)</code>, hàng "a[i] &gt; 3" — cùng vòng lặp, khác đúng một ký tự trong <code>ok</code>:</p>
</div>
${BANG_UB}
<div class="ml-en">
<p>Three rounds, answer 4: the three 3s occupy <code>[1, 4)</code>, count = 4 − 1 = 3, last = 4 − 1 = 3. The simulation plays both searches with the range shrinking on screen:</p>
${moPhong('ch04/lower-bound.sim.js', 'en', 'lowerBound and upperBound with one template — step by step', 'Opens /algorithms with this exact program: the highlighted block is [lo, hi), the red cell is mid. Change A and X and run again.')}
</div>
<div class="ml-vi">
<p>Ba vòng, đáp án 4: ba số 3 chiếm <code>[1, 4)</code>, số lượng = 4 − 1 = 3, vị trí cuối = 4 − 1 = 3. Mô phỏng chạy cả hai lần tìm, đoạn tô màu co lại ngay trên màn hình:</p>
${moPhong('ch04/lower-bound.sim.js', 'vi', 'lowerBound và upperBound bằng một khuôn — chạy từng bước', 'Mở trang /algorithms với đúng chương trình này: khối tô màu là [lo, hi), ô đỏ là mid. Đổi A và X rồi chạy lại.')}
</div>

<div class="ml-en">
<h3>The real cost, measured: linear vs binary from 10³ to 10⁷</h3>
<p>We search 200 present values in a sorted array of n even numbers, and <em>count</em> every comparison (exact numbers, not estimates), then time the whole batch of 200:</p>
</div>
<div class="ml-vi">
<h3>Cái giá thật, đo bằng số: tuyến tính vs nhị phân từ 10³ tới 10⁷</h3>
<p>Ta tìm 200 giá trị có mặt trong một mảng đã sắp gồm n số chẵn, <em>đếm</em> từng phép so sánh (số chính xác, không ước lượng), rồi bấm giờ cả lô 200 lần tìm:</p>
</div>
${ma('ch04/nhi-phan-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch04/nhi-phan-do.ts')}
${ketQua('ch04/NhiPhanDo.java')}
<div class="ml-en">
<p>Read the two comparison columns first — they do not depend on the machine. Linear: about n/2 per query (508 at n = 1,000; 5,073,343 at n = 10⁷), growing <strong>10×</strong> per row. Binary: 10.0, 13.3, 16.7, 20.0, 23.3 — it grows by <strong>+3.3</strong> per row, because log₂ 10 ≈ 3.32, and it matches the log₂(n) column to the decimal. At 10⁷ elements that is 5 million comparisons against 23. The clocks agree: in Node the 200 linear searches take 1,280 ms at n = 10⁷, the 200 binary searches 0.05 ms — about 25,000× less; Java has smaller constants but the same shape. The binary column barely moves from 10³ to 10⁷ — that is what "logarithmic" looks like on a real machine.</p>
<p>One honest caveat to say in interviews: binary search needs a sorted array. Sorting costs O(n log n), which is <em>more</em> than one O(n) scan. Sorting pays off only when you search many times (here, 200 queries) or when the data arrives sorted (timestamps, IDs, an index).</p>
</div>
<div class="ml-vi">
<p>Đọc hai cột số phép so sánh trước — chúng không phụ thuộc máy. Tuyến tính: khoảng n/2 mỗi lần tìm (508 ở n = 1.000; 5.073.343 ở n = 10⁷), tăng <strong>10 lần</strong> mỗi dòng. Nhị phân: 10,0; 13,3; 16,7; 20,0; 23,3 — tăng <strong>+3,3</strong> mỗi dòng, vì log₂ 10 ≈ 3,32, và khớp cột log₂(n) tới chữ số thập phân. Ở 10⁷ phần tử đó là 5 triệu phép so sánh đối đầu với 23. Đồng hồ nói cùng một điều: trên Node, 200 lần tìm tuyến tính mất 1.280 ms ở n = 10⁷, 200 lần tìm nhị phân mất 0,05 ms — ít hơn khoảng 25.000 lần; Java có hằng số nhỏ hơn nhưng hình dạng y hệt. Cột nhị phân gần như đứng yên từ 10³ tới 10⁷ — "logarit" trông như thế trên máy thật.</p>
<p>Một lưu ý trung thực nên nói khi phỏng vấn: nhị phân cần mảng đã sắp. Sắp xếp tốn O(n log n), <em>nhiều hơn</em> một lần quét O(n). Sắp xếp chỉ đáng khi bạn tìm nhiều lần (ở đây 200 lần) hoặc khi dữ liệu đến sẵn theo thứ tự (mốc thời gian, ID tăng dần, một chỉ mục).</p>
</div>

<div class="ml-en">
<h3>Four "almost right" versions, run for real</h3>
<div class="pitfall co-tieu-de"><p><strong>Off-by-one: each bug is ONE character away from the template.</strong></p><p>The program runs the template and four classic mistakes on <code>a = [1, 3, 5, 6]</code> with x = 5, 7, 0 (a loop cap of 100 turns "hangs forever" into a printable STUCK):</p></div>
</div>
<div class="ml-vi">
<h3>Bốn bản "gần đúng", chạy thật</h3>
<div class="pitfall co-tieu-de"><p><strong>Lệch một (off-by-one): mỗi lỗi chỉ cách khuôn đúng MỘT ký tự.</strong></p><p>Chương trình chạy khuôn đúng và bốn lỗi kinh điển trên <code>a = [1, 3, 5, 6]</code> với x = 5, 7, 0 (trần 100 vòng biến "treo mãi mãi" thành chữ STUCK in ra được):</p></div>
</div>
${ma('ch04/bay-lech-mot.ts', { vung: 'sai', nhan: 'TypeScript — four bugs' })}
${ketQua('ch04/bay-lech-mot.ts')}
<div class="ml-en">
<p>The dangerous part is not that they fail — it is that <strong>each one passes some tests</strong>. "mid rounds up" returns the right 2 for x = 5; "hi = n − 1" is right for x = 5 and x = 0 and only wrong (3 instead of 4) when the answer is "after the end"; "lo = mid" is right for x = 0. A candidate who tests one happy case ships all four. Here is the "lo = mid" bug for x = 7, round by round:</p>
</div>
<div class="ml-vi">
<p>Chỗ nguy hiểm không phải là chúng sai — mà là <strong>bản nào cũng qua được vài test</strong>. "mid làm tròn lên" trả đúng 2 khi x = 5; "hi = n − 1" đúng với x = 5 và x = 0, chỉ sai (3 thay vì 4) khi đáp án là "sau phần tử cuối"; "lo = mid" đúng với x = 0. Ứng viên chỉ test một ca đẹp sẽ nộp cả bốn. Đây là lỗi "lo = mid" với x = 7, từng vòng một:</p>
</div>
${BANG_SAI}
<div class="ml-en">
<p>From round 3 on, every row is identical: with <code>lo = 3, hi = 4</code>, mid rounds down to 3, <code>a[3] = 6</code> is F, and "lo = mid" sets lo to 3 again. The range never shrinks. The rule that prevents all four bugs is the one we proved: <strong>mid must satisfy lo ≤ mid &lt; hi, and both branches must strictly shrink [lo, hi)</strong>. If you ever write <code>lo = mid</code> (some "last T" templates do), mid must round <em>up</em> — a second template with its own rules. This course avoids it: "last F" is simply <code>firstTrue(…) − 1</code>.</p>
</div>
<div class="ml-vi">
<p>Từ vòng 3 trở đi, mọi dòng giống hệt nhau: với <code>lo = 3, hi = 4</code>, mid làm tròn xuống thành 3, <code>a[3] = 6</code> là F, và "lo = mid" lại gán lo bằng 3. Đoạn không bao giờ co lại. Quy tắc chặn được cả bốn lỗi chính là điều ta đã chứng minh: <strong>mid phải thoả lo ≤ mid &lt; hi, và cả hai nhánh phải làm [lo, hi) nhỏ đi ngặt</strong>. Nếu bạn từng viết <code>lo = mid</code> (vài khuôn "T cuối cùng" làm vậy) thì mid phải làm tròn <em>lên</em> — đó là khuôn thứ hai với luật riêng. Khoá này tránh nó: "F cuối cùng" đơn giản là <code>firstTrue(…) − 1</code>.</p>
</div>

<div class="ml-en">
<h3>The overflow trap: (lo + hi) / 2, the 2006 JDK bug, reproduced</h3>
<div class="pitfall co-tieu-de"><p><strong>Java: <code>(lo + hi) / 2</code> overflows when lo + hi &gt; 2³¹ − 1.</strong></p><p>An <code>int</code> holds at most 2,147,483,647. Two valid indices can add up to more than that, the sum wraps around to a negative number, and mid becomes negative.</p></div>
<p>In June 2006 Joshua Bloch (who wrote <code>java.util.Arrays.binarySearch</code>) published "Nearly All Binary Searches and Mergesorts are Broken" on the Google Research blog: the line <code>int mid = (low + high) / 2;</code> — copied from Jon Bentley's <em>Programming Pearls</em>, where it had gone unnoticed for two decades — had sat in the JDK for about nine years. It only fails for arrays of 2³⁰ (about a billion) elements or more, which nobody had in 1997, and it was fixed as JDK-6412541. Bloch proposed <code>low + ((high − low) / 2)</code> or <code>(low + high) &gt;&gt;&gt; 1</code>. Here is that exact old method on a real <code>byte[1_100_000_000]</code> (1.1 GB, more than 2³⁰ elements), next to today's <code>Arrays.binarySearch</code>:</p>
</div>
<div class="ml-vi">
<h3>Bẫy tràn số: (lo + hi) / 2, bug JDK năm 2006, tái hiện thật</h3>
<div class="pitfall co-tieu-de"><p><strong>Java: <code>(lo + hi) / 2</code> tràn số khi lo + hi &gt; 2³¹ − 1.</strong></p><p>Một <code>int</code> chứa tối đa 2.147.483.647. Hai chỉ số hợp lệ cộng lại có thể vượt con số đó, tổng quay vòng thành số âm, và mid thành số âm.</p></div>
<p>Tháng 6/2006, Joshua Bloch (người viết <code>java.util.Arrays.binarySearch</code>) đăng bài "Nearly All Binary Searches and Mergesorts are Broken" (Gần như mọi bản tìm nhị phân và mergesort đều hỏng) trên blog Google Research: dòng <code>int mid = (low + high) / 2;</code> — chép từ sách <em>Programming Pearls</em> của Jon Bentley, nơi nó nằm yên hai thập kỷ không ai thấy — đã ở trong JDK khoảng chín năm. Nó chỉ hỏng với mảng từ 2³⁰ (khoảng một tỷ) phần tử trở lên, thứ chẳng ai có năm 1997, và được sửa với mã lỗi JDK-6412541. Bloch đề xuất <code>low + ((high − low) / 2)</code> hoặc <code>(low + high) &gt;&gt;&gt; 1</code>. Dưới đây là đúng phương thức cũ đó chạy trên một <code>byte[1_100_000_000]</code> thật (1,1 GB, hơn 2³⁰ phần tử), đặt cạnh <code>Arrays.binarySearch</code> ngày nay:</p>
</div>
${ma('ch04/TranSo.java', { vung: 'jdk', nhan: 'Java — the pre-2006 JDK method' })}
${ma('ch04/TranSo.java', { vung: 'tran', nhan: 'Java — LC 278 with (lo + hi) / 2' })}
${ketQua('ch04/TranSo.java')}
<div class="ml-en">
<p>Three things to read. (1) <code>(lo + hi) / 2</code> with 1.5 and 2 billion is <strong>−397,483,648</strong>; both safe forms give 1,750,000,000. <code>&gt;&gt;&gt; 1</code> works because it reads the wrapped 32 bits as an <em>unsigned</em> number before halving. (2) LC 278 allows n = 2³¹ − 1: with the safe mid it takes 31 calls; with the overflowing mid, <code>lo</code> jumps between negative and positive values (−1,073,741,823, then 536,870,913, then −805,306,367…) and never converges — STUCK. On LeetCode that is "Time Limit Exceeded" on a correct-looking solution. (3) The old JDK method dies with <code>ArrayIndexOutOfBoundsException: Index −1064671148</code>, while the fixed library finds index 1,099,999,999.</p>
</div>
<div class="ml-vi">
<p>Ba điều cần đọc. (1) <code>(lo + hi) / 2</code> với 1,5 tỷ và 2 tỷ ra <strong>−397.483.648</strong>; hai cách an toàn đều ra 1.750.000.000. <code>&gt;&gt;&gt; 1</code> đúng vì nó đọc 32 bit đã quay vòng như một số <em>không dấu</em> (unsigned) rồi mới chia đôi. (2) LC 278 cho n tới 2³¹ − 1: với mid an toàn mất 31 lần gọi; với mid bị tràn, <code>lo</code> nhảy qua lại giữa số âm và số dương (−1.073.741.823, rồi 536.870.913, rồi −805.306.367…) và không bao giờ hội tụ — STUCK. Trên LeetCode đó là "Time Limit Exceeded" với một lời giải nhìn thì đúng. (3) Phương thức JDK cũ chết với <code>ArrayIndexOutOfBoundsException: Index −1064671148</code>, còn thư viện đã sửa tìm ra chỉ số 1.099.999.999.</p>
</div>
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>TypeScript/JavaScript: no int overflow… except in the bit operators.</strong></p><p>JS numbers are 64-bit doubles, so <code>(lo + hi) / 2</code> is exact up to 2⁵³. But <code>&gt;&gt;</code>, <code>|</code> and <code>&amp;</code> first convert to a 32-bit <em>signed</em> integer — and <code>(lo + hi) &gt;&gt; 1</code> is a very popular way to write "halve and floor".</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>TypeScript/JavaScript: không tràn int… trừ trong các toán tử bit.</strong></p><p>Số của JS là số thực 64 bit (double), nên <code>(lo + hi) / 2</code> chính xác tới 2⁵³. Nhưng <code>&gt;&gt;</code>, <code>|</code> và <code>&amp;</code> đổi số sang số nguyên 32 bit <em>có dấu</em> trước — mà <code>(lo + hi) &gt;&gt; 1</code> lại là cách viết "chia đôi làm tròn xuống" rất được ưa chuộng.</p></div>
</div>
${ketQua('ch04/tran-so.ts')}
<div class="ml-en">
<p>Same −397,483,648, same STUCK — in a language that "has no integer overflow". This codebase uses <code>(lo + hi) &gt;&gt; 1</code> in a few places (<code>frontend/src/app/phong-video/[lessonId]/BangPhuDe.tsx</code>, <code>frontend/src/components/simulation/layout.ts</code>), and there it is safe: they search arrays of subtitles and lookup-table samples, whose indices never come near 2³¹. The bug appears when you copy the same line into a search over <em>values</em> (versions, capacities up to 2·10⁹). The template in this course uses <code>lo + Math.floor((hi − lo) / 2)</code> in TS and <code>lo + (hi − lo) / 2</code> in Java, safe everywhere, so you never have to think about it.</p>
</div>
<div class="ml-vi">
<p>Cùng −397.483.648, cùng STUCK — trong một ngôn ngữ "không có tràn số nguyên". Chính kho mã của trang này dùng <code>(lo + hi) &gt;&gt; 1</code> ở vài chỗ (<code>frontend/src/app/phong-video/[lessonId]/BangPhuDe.tsx</code>, <code>frontend/src/components/simulation/layout.ts</code>), và ở đó an toàn: chúng tìm trong mảng phụ đề và mảng mẫu bảng tra, chỉ số không bao giờ tới gần 2³¹. Bug xuất hiện khi bạn chép đúng dòng đó sang một lần tìm trên <em>giá trị</em> (phiên bản, sức chứa tới 2·10⁹). Khuôn của khoá này dùng <code>lo + Math.floor((hi − lo) / 2)</code> trong TS và <code>lo + (hi − lo) / 2</code> trong Java, an toàn ở mọi nơi, để bạn khỏi phải nghĩ về nó.</p>
</div>

<div class="ml-en">
<h3>Variant 1 — First Bad Version (LC 278): no array at all</h3>
<p>Versions 1..n of a product; from some version on, every version is bad. You may call <code>isBadVersion(v)</code>; minimise the calls. There is no array — the "array" is the row isBadVersion(1), isBadVersion(2), … which is exactly F…F T…T. The range is <code>[1, n]</code>, and since version n is known to be bad, the "none" slot is not needed: <code>hi = n</code> is already a T. Same loop:</p>
</div>
<div class="ml-vi">
<h3>Biến thể 1 — First Bad Version (LC 278): không hề có mảng</h3>
<p>Các phiên bản 1..n của một sản phẩm; từ một phiên bản nào đó trở đi, mọi bản đều lỗi. Bạn được gọi <code>isBadVersion(v)</code>; hãy gọi ít nhất có thể. Không có mảng nào — "mảng" chính là hàng isBadVersion(1), isBadVersion(2), … đúng dạng F…F T…T. Khoảng là <code>[1, n]</code>, và vì đã biết bản n lỗi nên không cần ô "không có": <code>hi = n</code> sẵn là một T. Cùng vòng lặp:</p>
</div>
${maHai('ch04/first-bad-version.ts', 'ch04/FirstBadVersion.java', { vung: 'lc278' })}
${ketQua('ch04/first-bad-version.ts')}
<div class="ml-en">
<p>30–31 calls for two billion versions. Note <code>n = 1</code>: zero calls — the loop never runs because there is only one candidate, and that is correct. Edge cases you should mention: first version bad (10 → 1, 4 calls), last version bad, and n = 2³¹ − 1.</p>
</div>
<div class="ml-vi">
<p>30–31 lần gọi cho hai tỷ phiên bản. Để ý <code>n = 1</code>: không gọi lần nào — vòng lặp không chạy vì chỉ có một ứng viên, và như vậy là đúng. Ca biên nên nói ra: bản đầu tiên đã lỗi (10 → 1, 4 lần gọi), chỉ bản cuối lỗi, và n = 2³¹ − 1.</p>
</div>

<div class="ml-en">
<h3>Variant 2 — "the last element ≤ s": which subtitle is on screen?</h3>
<p>The video room of this website shows the subtitle line being spoken: given cue start times (sorted) and the current second s, find the <strong>last</strong> cue with <code>start ≤ s</code>. "Last F" questions do not need a second template: the row "start &gt; s" is F…F T…T, its first T is <code>upperBound</code>, and the last F is the cell just before it.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 2 — "phần tử cuối cùng ≤ s": câu phụ đề nào đang hiện?</h3>
<p>Phòng xem video của chính trang này tô câu phụ đề đang được đọc: cho các mốc bắt đầu của từng câu (đã sắp) và giây hiện tại s, tìm câu <strong>cuối cùng</strong> có <code>start ≤ s</code>. Câu hỏi "F cuối cùng" không cần khuôn thứ hai: hàng "start &gt; s" là F…F T…T, T đầu tiên của nó là <code>upperBound</code>, và F cuối cùng là ô ngay trước đó.</p>
</div>
${maHai('ch04/phu-de.ts', 'ch04/PhuDe.java', { vung: 'cue' })}
${ketQua('ch04/phu-de.ts')}
<div class="ml-en">
<p>At s = 2.4 we are still on cue 0; at exactly 2.5, cue 1 starts (≤, not &lt;); at s = 15 two cues start together and we get the later one, 5; before the first cue the answer is −1 ("nothing yet"). The real component, <code>BangPhuDe.tsx</code>, writes the same search as a closed-interval loop (<code>while (lo &lt;= hi)</code> with a separate <code>ra</code> variable); <code>src/services/work/sqlDesign/lexer.ts › posAt</code> (byte offset → line number in an SQL editor) writes it as a "last T" loop with <code>mid = (lo + hi + 1) &gt;&gt; 1</code>. Three styles, one question. In an interview, pick one style and stay in it — reading other people's styles is a skill for code review, not for the whiteboard.</p>
</div>
<div class="ml-vi">
<p>Ở s = 2,4 vẫn là câu 0; đúng 2,5 thì câu 1 bắt đầu (≤ chứ không phải &lt;); ở s = 15 có hai câu cùng bắt đầu và ta lấy câu sau, số 5; trước câu đầu tiên đáp án là −1 ("chưa có gì"). Component thật, <code>BangPhuDe.tsx</code>, viết đúng phép tìm này theo kiểu đoạn đóng (<code>while (lo &lt;= hi)</code> với một biến <code>ra</code> riêng); <code>src/services/work/sqlDesign/lexer.ts › posAt</code> (vị trí ký tự → số dòng trong trình soạn SQL) viết nó thành vòng "T cuối cùng" với <code>mid = (lo + hi + 1) &gt;&gt; 1</code>. Ba phong cách, một câu hỏi. Khi phỏng vấn, chọn một phong cách và ở yên trong nó — đọc phong cách của người khác là kỹ năng để review code, không phải để viết trên bảng.</p>
</div>

<div class="ml-en">
<h3>In real systems: git bisect, found in 7 test runs instead of 72</h3>
<p>Monday morning, a test that passed last month fails, and 100 commits landed since. <code>git bisect</code> is binary search over commits: you name one good commit and one bad commit, Git checks out the middle, you (or a script) say good or bad, and it halves again. With <code>git bisect run &lt;script&gt;</code> the script answers: exit code 0 = good, 1–127 (except 125) = bad, 125 = "cannot test this commit, skip it". The program below builds a real throw-away repository with 100 commits where commit #73 silently changes <code>timeout=30</code> to <code>timeout=3</code>, then runs bisect. Everything after a <code>$</code> line is Git's own output:</p>
</div>
<div class="ml-vi">
<h3>Trong hệ thống thật: git bisect, tìm ra sau 7 lần chạy test thay vì 72</h3>
<p>Sáng thứ Hai, một test tháng trước còn qua nay hỏng, và đã có 100 commit đổ vào từ đó. <code>git bisect</code> là tìm nhị phân trên các commit: bạn chỉ một commit tốt và một commit lỗi, Git checkout commit ở giữa, bạn (hoặc một script) nói tốt hay lỗi, và nó chia đôi tiếp. Với <code>git bisect run &lt;script&gt;</code> thì script trả lời: mã thoát 0 = tốt, 1–127 (trừ 125) = lỗi, 125 = "commit này không test được, bỏ qua". Chương trình dưới đây dựng một kho Git thật, dùng xong vứt, gồm 100 commit trong đó commit #73 lặng lẽ đổi <code>timeout=30</code> thành <code>timeout=3</code>, rồi chạy bisect. Mọi thứ sau một dòng <code>$</code> là output của chính Git:</p>
</div>
${ma('ch04/git-bisect.ts', { vung: 'lenh', nhan: 'TypeScript — the two commands' })}
${ketQua('ch04/git-bisect.ts')}
<div class="ml-en">
<p>Map it onto the template: commits #1…#100 are the indices; "test passes" is F and "test fails" is T; the row is F…F T…T because once the timeout became 3 it stayed 3. Git tested #50 (good ⇒ lo moves right), #75 (bad ⇒ hi = #75), #62, #68, #71 (good), #73 (bad ⇒ hi = #73), #72 (good ⇒ lo = #73 = hi) and printed "cd4a5fe… is the first bad commit" — <strong>lo == hi</strong>. "roughly 6 steps" at the start is Git computing log₂ of the 98 commits left. Seven test runs instead of 72; if each run is a 4-minute test suite, that is half an hour instead of five hours. The precondition is the same as for arrays: the row must be monotone. A bug that appears, disappears and reappears (a flaky test) breaks bisect exactly like an unsorted array breaks lowerBound.</p>
<p>More binary search that runs every day: PostgreSQL's B-tree index binary-searches the keys inside each page on the way down; the <code>BangPhuDe.tsx</code> component above runs once per second on a list of thousands of subtitle lines; <code>layout.ts › tAtDistance</code> in this site's simulations finds the curve parameter for a given distance with exactly our <code>lo &lt; hi</code> / <code>hi = mid</code> loop.</p>
</div>
<div class="ml-vi">
<p>Ánh xạ vào khuôn: commit #1…#100 là các chỉ số; "test qua" là F và "test hỏng" là T; hàng có dạng F…F T…T vì timeout đã thành 3 thì giữ nguyên 3. Git test #50 (tốt ⇒ lo dời sang phải), #75 (lỗi ⇒ hi = #75), #62, #68, #71 (tốt), #73 (lỗi ⇒ hi = #73), #72 (tốt ⇒ lo = #73 = hi) rồi in "cd4a5fe… is the first bad commit" — <strong>lo == hi</strong>. Dòng "roughly 6 steps" lúc đầu là Git tính log₂ của 98 commit còn lại. Bảy lần chạy test thay vì 72; nếu mỗi lần là bộ test 4 phút thì đó là nửa giờ thay vì năm giờ. Điều kiện tiên quyết y như với mảng: hàng phải đơn điệu. Một lỗi lúc có lúc không (test chập chờn — flaky) làm hỏng bisect y như mảng chưa sắp làm hỏng lowerBound.</p>
<p>Những chỗ khác tìm nhị phân chạy hằng ngày: chỉ mục B-tree của PostgreSQL tìm nhị phân các khoá trong từng trang khi đi xuống cây; component <code>BangPhuDe.tsx</code> ở trên chạy mỗi giây trên danh sách hàng nghìn câu phụ đề; <code>layout.ts › tAtDistance</code> trong các mô phỏng của trang này tìm tham số đường cong ứng với một quãng đường bằng đúng vòng <code>lo &lt; hi</code> / <code>hi = mid</code> của ta.</p>
${lienKet({ khoa: 'git', bai: 'git-2-4-bisect', title: 'Git 2.4 — git bisect: tìm nhị phân ra commit đã làm hỏng', sub: 'Bisect bằng tay, bisect run, skip, và các tình huống thật khi đi làm', cta: 'Đọc bài' })}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-9-1-chi-muc-la-gi', title: 'PostgreSQL 9.1 — Chỉ mục là gì: B-tree, Seq Scan vs Index Scan', sub: 'Thấy "tuyến tính vs nhị phân" ở quy mô một triệu dòng trong EXPLAIN', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: blind SQL injection is binary search</h3>
<p>When a vulnerable page does not print query results but behaves differently for true and false conditions (a "found"/"not found" message, or a delay), an attacker can still read the database — one yes/no question at a time. To read one character of a password hash, they inject conditions like <code>ASCII(SUBSTRING(hash, 1, 1)) &gt; 77</code>: the answers over the character codes form exactly an F…F T…T row, so about 7 requests reveal one byte instead of up to 95. Tools such as sqlmap automate this bisection. Binary search is what makes "only a yes/no leak" practical to exploit.</p>
<p>Defence: parameterised queries (Prisma, as this backend uses, never glues user text into SQL); identical responses and timing for "true" and "false" where possible; rate limits that make thousands of probing requests visible. The same logic applies to any yes/no oracle you expose: "does this username exist?" on a sign-up form, combined with prefix search, leaks user lists far faster than guessing.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: blind SQL injection chính là tìm nhị phân</h3>
<p>Khi một trang bị lỗi không in kết quả truy vấn nhưng phản ứng khác nhau với điều kiện đúng và sai (thông báo "tìm thấy"/"không tìm thấy", hoặc chậm đi), kẻ tấn công vẫn đọc được CSDL — mỗi lần một câu hỏi có/không (blind SQL injection — chèn SQL "mù"). Để đọc một ký tự của chuỗi băm mật khẩu, chúng chèn điều kiện kiểu <code>ASCII(SUBSTRING(hash, 1, 1)) &gt; 77</code>: các câu trả lời trên dãy mã ký tự tạo đúng hàng F…F T…T, nên khoảng 7 request là lộ một byte thay vì tới 95. Công cụ như sqlmap tự động hoá phép chia đôi này. Chính tìm nhị phân biến "chỉ rò rỉ có/không" thành thứ khai thác được trong thực tế.</p>
<p>Cách phòng: truy vấn tham số hoá (Prisma — thứ backend này dùng — không bao giờ ghép chữ người dùng vào câu SQL); phản hồi và thời gian giống nhau cho "đúng" và "sai" khi có thể; giới hạn tốc độ để hàng nghìn request dò thử lộ ra. Cùng lý lẽ áp dụng cho mọi "nhà tiên tri có/không" (oracle) bạn mở ra: "tên đăng nhập này đã tồn tại chưa?" ở form đăng ký, kết hợp với tìm theo tiền tố, làm lộ danh sách người dùng nhanh hơn đoán mò rất nhiều.</p>
${lienKet({ khoa: 'web-security', bai: 'sec-1-1-sql', title: 'Web Security 1.1 — SQL injection, thấy tận mắt và vá', sub: 'Tấn công thật trên một ứng dụng mẫu, rồi vá bằng truy vấn tham số hoá', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: LC 34</h3>
${hoiThoai([
  ['I', 'Given a sorted array that may contain duplicates, return the first and last index of a target, or [−1, −1].'],
  ['C', 'Can the array be empty? Can values be negative or very large? And do you expect O(log n)?'],
  ['N', 'Empty input and "expect O(log n)" both change the code. Large values tell you whether overflow matters.'],
  ['I', 'Could be empty, any int values, and yes, O(log n).'],
  ['C', 'A linear scan finds the first match and walks on — O(n). Since it is sorted, I will use two binary searches: lowerBound, the first index with a[i] ≥ target, and upperBound, the first index with a[i] &gt; target. If lowerBound is n or does not hold the target, the answer is [−1, −1]; otherwise [lowerBound, upperBound − 1]. O(log n) time, O(1) space.'],
  ['N', 'Name the two boundaries precisely — "first ≥" and "first &gt;" — instead of "find left, find right". Precision here prevents off-by-one later.'],
  ['C', 'I always write binary search the same way: half-open [lo, hi), loop while lo &lt; hi, mid = lo + (hi − lo) / 2, T means hi = mid, F means lo = mid + 1. The invariant: left of lo is false, from hi on is true, so lo is the first true.'],
  ['N', 'Stating the invariant before coding signals you are not guessing. It also gives the interviewer a reason to trust each line.'],
  ['C', '(after coding) Let me trace [2, 4, 4, 6, 6, 9] with 6: lowerBound is 3, upperBound is 5, answer [3, 4]. With 5: lowerBound is 3 but a[3] is 6, so [−1, −1]. Empty array: lowerBound returns 0 = n, so [−1, −1] without touching the array.'],
  ['I', 'Why lo + (hi − lo) / 2 and not (lo + hi) / 2?'],
  ['C', 'In Java, lo + hi can exceed 2³¹ − 1 and wrap negative — that was a real JDK bug in 2006. Here indices are small, but I write the safe form by habit, so it is right when I reuse it for a search over values.'],
  ['I', 'How would you count occurrences?'],
  ['C', 'upperBound − lowerBound — two binary searches, no extra loop.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: LC 34</h3>
<p>Bản tiếng Anh ở khối EN; dưới đây là cùng mạch đó bằng tiếng Việt, kèm cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Cho mảng đã sắp xếp có thể trùng, trả về chỉ số đầu và cuối của target, không có thì [−1, −1].'],
  ['C', 'Mảng có thể rỗng không ạ? Giá trị có âm hay rất lớn không? Và anh/chị có yêu cầu O(log n) không? <em>("Can the array be empty? Do you expect O(log n)?")</em>'],
  ['N', 'Đầu vào rỗng và "yêu cầu O(log n)" đều làm đổi code. Giá trị lớn cho biết có phải lo tràn số không.'],
  ['I', 'Có thể rỗng, giá trị int bất kỳ, và đúng, O(log n).'],
  ['C', 'Quét tuyến tính tìm chỗ khớp đầu tiên rồi đi tiếp — O(n). Vì mảng đã sắp, em dùng hai lần tìm nhị phân: lowerBound, chỉ số đầu tiên có a[i] ≥ target, và upperBound, chỉ số đầu tiên có a[i] &gt; target. Nếu lowerBound bằng n hoặc ô đó không phải target thì trả [−1, −1]; ngược lại trả [lowerBound, upperBound − 1]. O(log n) thời gian, O(1) bộ nhớ. <em>("first index greater than or equal to the target")</em>'],
  ['N', 'Gọi tên hai ranh giới thật chính xác — "đầu tiên ≥" và "đầu tiên &gt;" — thay vì "tìm bên trái, tìm bên phải". Chính xác ở đây chặn lỗi lệch một về sau.'],
  ['C', 'Em luôn viết nhị phân một kiểu: đoạn nửa mở [lo, hi), lặp khi lo &lt; hi, mid = lo + (hi − lo) / 2, T thì hi = mid, F thì lo = mid + 1. Bất biến: bên trái lo là sai, từ hi trở đi là đúng, nên lo là chỗ đúng đầu tiên. <em>("The invariant is: everything left of lo is false, everything from hi on is true.")</em>'],
  ['N', 'Nói bất biến trước khi code cho thấy bạn không đoán mò. Nó cũng cho người phỏng vấn lý do tin từng dòng.'],
  ['C', '(sau khi code) Em chạy tay [2, 4, 4, 6, 6, 9] với 6: lowerBound là 3, upperBound là 5, đáp án [3, 4]. Với 5: lowerBound là 3 nhưng a[3] là 6, nên [−1, −1]. Mảng rỗng: lowerBound trả 0 = n, nên [−1, −1] mà không đụng vào mảng.'],
  ['I', 'Sao lại lo + (hi − lo) / 2 mà không phải (lo + hi) / 2?'],
  ['C', 'Trong Java, lo + hi có thể vượt 2³¹ − 1 và quay thành số âm — đó là một bug thật của JDK năm 2006. Ở đây chỉ số nhỏ, nhưng em viết dạng an toàn thành thói quen, để nó vẫn đúng khi em dùng lại cho tìm trên giá trị. <em>("It avoids integer overflow.")</em>'],
  ['I', 'Đếm số lần xuất hiện thì sao?'],
  ['C', 'upperBound − lowerBound — hai lần tìm nhị phân, không cần vòng lặp thêm.'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Starting with <code>hi = n − 1</code> for a "first position / insert position" question: the answer "after the last element" becomes impossible (LC 35 with a target larger than everything).</li>
<li>Mixing two styles in one function — closed <code>while (lo &lt;= hi)</code> with half-open <code>hi = mid</code> — the loop runs one round too many and hangs or reads <code>a[n]</code>.</li>
<li>Stopping when <code>a[mid] == target</code> in a "first/last occurrence" problem: you found <em>an</em> occurrence, not the first.</li>
<li>Reading <code>a[lo]</code> after the loop without checking <code>lo &lt; n</code>.</li>
<li><code>(lo + hi) / 2</code> in Java and <code>(lo + hi) &gt;&gt; 1</code> in JS when the range is over values that can exceed 10⁹.</li>
<li>Binary searching an array that is not sorted by the key you compare (sorted by name, searched by score) — the row is not monotone and the answer is garbage, silently.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Bắt đầu với <code>hi = n − 1</code> cho câu hỏi "vị trí đầu / vị trí chèn": đáp án "sau phần tử cuối" trở thành không thể (LC 35 với target lớn hơn tất cả).</li>
<li>Trộn hai phong cách trong một hàm — đoạn đóng <code>while (lo &lt;= hi)</code> với nửa mở <code>hi = mid</code> — vòng chạy thừa một lượt rồi treo hoặc đọc <code>a[n]</code>.</li>
<li>Dừng khi <code>a[mid] == target</code> trong đề "vị trí xuất hiện đầu/cuối": bạn mới tìm được <em>một</em> lần xuất hiện, chưa phải lần đầu.</li>
<li>Đọc <code>a[lo]</code> sau vòng lặp mà không kiểm <code>lo &lt; n</code>.</li>
<li><code>(lo + hi) / 2</code> trong Java và <code>(lo + hi) &gt;&gt; 1</code> trong JS khi khoảng tìm là giá trị có thể vượt 10⁹.</li>
<li>Tìm nhị phân trên mảng không sắp theo đúng khoá đang so (sắp theo tên mà tìm theo điểm) — hàng không đơn điệu và đáp án là rác, lặng lẽ.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Tên đề giữ nguyên tiếng Anh để bạn tìm được trên LeetCode/NeetCode. Lời giải từng bước của 8 đề tổng hợp của chương nằm ở <a href="${baiNay('dsa-4-4-luyen')}">bài 4.4 (Bộ luyện 4)</a>.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Without looking, write <code>firstTrue(lo, hi, ok)</code> and the invariant comment above it. Then write <code>lowerBound</code> and <code>upperBound</code> as one-liners on top.</li>
<li>On paper, trace <code>lowerBound([2, 4, 4, 4, 9], 4)</code> and <code>upperBound</code> of the same: write lo, hi, mid for every round, including the slot n = 5.</li>
<li>Change <code>lo = mid + 1</code> to <code>lo = mid</code>, run on <code>[1, 3, 5, 6]</code> with 7, and explain in one sentence why it never stops.</li>
<li>Submit LC 35, LC 34 and LC 278 using the same template. For each, write one notebook line: <em>F/T row → [lo, hi) → what to do with lo</em>.</li>
</ol>
<p><strong>Done when:</strong> three accepted submissions with the identical loop, the hand trace matches the program, and you can say the invariant in one breath.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">binary search</span><span class="v">Halving a monotone yes/no row to find its boundary in O(log n) questions.</span></div>
  <div class="kv"><span class="k">invariant</span><span class="v">A statement true before and after every loop round; here: left of lo is F, from hi on is T.</span></div>
  <div class="kv"><span class="k">half-open range [lo, hi)</span><span class="v">lo included, hi excluded; empty when lo == hi; size hi − lo.</span></div>
  <div class="kv"><span class="k">lower bound / upper bound</span><span class="v">First index with a[i] ≥ x / first index with a[i] &gt; x.</span></div>
  <div class="kv"><span class="k">monotone predicate</span><span class="v">A yes/no function that switches from F to T once and never back.</span></div>
  <div class="kv"><span class="k">off-by-one error</span><span class="v">A bug where an index or bound is one too large or too small.</span></div>
  <div class="kv"><span class="k">integer overflow</span><span class="v">A result too large for the type wraps around (int: past 2³¹ − 1 becomes negative).</span></div>
  <div class="kv"><span class="k">git bisect</span><span class="v">Git's binary search over commits to find the first bad one.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Binary search finds the boundary of an F…F T…T row; a sorted array is just one such row.</li>
<li>One template: [lo, hi), <code>while (lo &lt; hi)</code>, <code>mid = lo + (hi − lo) / 2</code>, T ⇒ <code>hi = mid</code>, F ⇒ <code>lo = mid + 1</code>, return lo.</li>
<li>lowerBound = first ≥ x, upperBound = first &gt; x; copies of x live in [lowerBound, upperBound); "last ≤ x" = upperBound − 1.</li>
<li>Measured: 23 comparisons instead of 5 million at n = 10⁷.</li>
<li>Each off-by-one bug passes some tests; the rule "lo ≤ mid &lt; hi and the range always shrinks" prevents them all.</li>
<li><code>(lo + hi) / 2</code> overflows in Java (the 2006 JDK bug) and <code>(lo + hi) &gt;&gt; 1</code> overflows in JS.</li>
</ul>
${nguon('📰', 'Joshua Bloch — Nearly All Binary Searches and Mergesorts are Broken (2006)', 'The original post about the (low + high) / 2 bug in the JDK and Programming Pearls', 'https://research.google/blog/extra-extra-read-all-about-it-nearly-all-binary-searches-and-mergesorts-are-broken/')}
${nguon('📙', 'git-bisect — Git documentation', 'Official manual: start, good, bad, skip, run and its exit codes', 'https://git-scm.com/docs/git-bisect')}
${nguon('📗', 'cp-algorithms — Binary search', 'Lower bound, search on predicates and the monotonicity argument, with proofs', 'https://cp-algorithms.com/num_methods/binary_search.html')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Không nhìn bài, viết <code>firstTrue(lo, hi, ok)</code> và dòng chú thích bất biến phía trên. Rồi viết <code>lowerBound</code> và <code>upperBound</code> mỗi hàm một dòng đặt lên trên.</li>
<li>Trên giấy, chạy tay <code>lowerBound([2, 4, 4, 4, 9], 4)</code> và <code>upperBound</code> cùng mảng: ghi lo, hi, mid của từng vòng, kể cả ô n = 5.</li>
<li>Đổi <code>lo = mid + 1</code> thành <code>lo = mid</code>, chạy trên <code>[1, 3, 5, 6]</code> với 7, và giải thích trong một câu vì sao nó không dừng.</li>
<li>Nộp LC 35, LC 34 và LC 278 bằng cùng một khuôn. Mỗi đề ghi một dòng vào sổ: <em>hàng F/T → [lo, hi) → làm gì với lo</em>.</li>
</ol>
<p><strong>Đạt khi:</strong> ba lượt nộp Accepted với vòng lặp giống hệt nhau, bảng chạy tay khớp với chương trình, và bạn nói được bất biến trong một hơi.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">binary search (tìm kiếm nhị phân)</span><span class="v">Chia đôi một hàng có/không đơn điệu để tìm ranh giới sau O(log n) câu hỏi.</span></div>
  <div class="kv"><span class="k">invariant (bất biến)</span><span class="v">Điều đúng trước và sau mỗi vòng lặp; ở đây: trái lo là F, từ hi trở đi là T.</span></div>
  <div class="kv"><span class="k">half-open range (đoạn nửa mở) [lo, hi)</span><span class="v">Có lo, không có hi; rỗng khi lo == hi; kích thước hi − lo.</span></div>
  <div class="kv"><span class="k">lower bound / upper bound (cận dưới / cận trên)</span><span class="v">Chỉ số đầu tiên có a[i] ≥ x / chỉ số đầu tiên có a[i] &gt; x.</span></div>
  <div class="kv"><span class="k">monotone predicate (điều kiện đơn điệu)</span><span class="v">Hàm có/không đổi từ F sang T đúng một lần và không quay lại.</span></div>
  <div class="kv"><span class="k">off-by-one error (lỗi lệch một)</span><span class="v">Lỗi chỉ số hoặc cận lớn hơn hay nhỏ hơn đúng 1.</span></div>
  <div class="kv"><span class="k">integer overflow (tràn số nguyên)</span><span class="v">Kết quả quá lớn so với kiểu dữ liệu nên quay vòng (int: vượt 2³¹ − 1 thành số âm).</span></div>
  <div class="kv"><span class="k">git bisect (chia đôi lịch sử Git)</span><span class="v">Tìm nhị phân của Git trên các commit để ra commit lỗi đầu tiên.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Tìm nhị phân tìm ranh giới của một hàng F…F T…T; mảng đã sắp chỉ là một kiểu hàng như vậy.</li>
<li>Một khuôn: [lo, hi), <code>while (lo &lt; hi)</code>, <code>mid = lo + (hi − lo) / 2</code>, T ⇒ <code>hi = mid</code>, F ⇒ <code>lo = mid + 1</code>, trả lo.</li>
<li>lowerBound = đầu tiên ≥ x, upperBound = đầu tiên &gt; x; các bản sao của x nằm trong [lowerBound, upperBound); "cuối cùng ≤ x" = upperBound − 1.</li>
<li>Đo thật: 23 phép so sánh thay vì 5 triệu ở n = 10⁷.</li>
<li>Mỗi lỗi lệch một đều qua được vài test; quy tắc "lo ≤ mid &lt; hi và đoạn luôn co lại" chặn được tất cả.</li>
<li><code>(lo + hi) / 2</code> tràn số trong Java (bug JDK 2006) và <code>(lo + hi) &gt;&gt; 1</code> tràn số trong JS.</li>
</ul>
${nguon('📰', 'Joshua Bloch — Nearly All Binary Searches and Mergesorts are Broken (2006)', 'Bài gốc về bug (low + high) / 2 trong JDK và sách Programming Pearls (tiếng Anh)', 'https://research.google/blog/extra-extra-read-all-about-it-nearly-all-binary-searches-and-mergesorts-are-broken/')}
${nguon('📙', 'git-bisect — Git documentation', 'Tài liệu chính thức: start, good, bad, skip, run và các mã thoát', 'https://git-scm.com/docs/git-bisect')}
${nguon('📗', 'cp-algorithms — Binary search', 'Cận dưới, tìm trên điều kiện và lập luận tính đơn điệu, có chứng minh', 'https://cp-algorithms.com/num_methods/binary_search.html')}
</div>
`,
};
