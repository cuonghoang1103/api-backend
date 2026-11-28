/**
 * Coding Interview Prep — Progress Test 2: Chương 4 → Chương 6 (tìm kiếm nhị phân, cây/BST/trie, heap và khoảng).
 * 24 câu trắc nghiệm + 2 câu lập trình JavaScript.
 *
 * Đề tự soạn, bám `content/courses/dsa-interview/s04…s06`; kết quả "in ra gì" và số đo lấy nguyên từ bài học.
 * Hai câu lập trình (lowerBound cho nhiều truy vấn khoảng; quét sự kiện tính số phòng với khoảng nửa mở) đã đối
 * chiếu với vét cạn trên 300 đầu vào ngẫu nhiên (0 khác biệt); mỗi câu có ca lớn 2·10⁵ (Park–Miller).
 * Phân bố: C4 ×8 · C5 ×8 · C6 ×8. Kiểm: node scripts/exam-check.mjs content/exams/DSA-INTERVIEW-PT2.mjs
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/DSA-INTERVIEW-PT2.mjs --apply
 */
import { B, c, Q, codeQ, starter, PARK, ptInstructions } from './_lib/dsa-exam-kit.mjs';

const C1_STARTER = starter({
  head: `
// Điểm thi của cả khối đã được SẮP XẾP tăng dần. Mỗi truy vấn [lo, hi] hỏi: có bao nhiêu điểm nằm trong [lo, hi]
// (tính cả hai đầu)? Trả về mảng kết quả theo thứ tự truy vấn.  n, q ≤ 2·10⁵ · điểm và lo ≤ hi là số nguyên.`,
  stub: `
function countInRanges(sorted, queries) {
  throw new Error('chưa cài đặt');
}`,
  tail: `
${PARK}
const scores = [1, 3, 3, 3, 5, 8, 8, 10];
const qs = [[3, 3], [4, 4], [0, 100], [8, 10], [11, 20], [-5, 0], [2, 7]];
console.log(JSON.stringify(qs) + ' -> ' + JSON.stringify(countInRanges(scores, qs)));
console.log('empty -> ' + JSON.stringify(countInRanges([], [[0, 10]])));
const r = park(1552);
const big = Array.from({ length: 200000 }, () => r() % 1000001).sort((a, b) => a - b);
const bigQ = Array.from({ length: 200000 }, () => { const a = r() % 1000001; return [a, a + (r() % 5000)]; });
const res = countInRanges(big, bigQ);
let sum = 0;
for (const x of res) sum += x;
console.log('large n=200000 q=200000 -> total=' + sum + ' first=' + res[0] + ' last=' + res[res.length - 1]);`,
});
const C1_SOLUTION = `// O((n + q) · log n) thời gian, O(q) bộ nhớ cho kết quả.
// Số phần tử trong [lo, hi] = lowerBound(hi + 1) − lowerBound(lo): vị trí đầu tiên ≥ hi + 1 trừ vị trí đầu tiên ≥ lo.
// Khuôn nửa mở của bài 4.1: [left, right), T ⇒ right = mid, F ⇒ left = mid + 1 — luôn dừng, không lệch một đơn vị.
// filter/indexOf cho mỗi truy vấn là O(n·q) = 4·10¹⁰ ở ca lớn.
function countInRanges(sorted, queries) {
  const lowerBound = (x) => {
    let left = 0;
    let right = sorted.length;
    while (left < right) {
      const mid = left + ((right - left) >> 1);
      if (sorted[mid] >= x) right = mid; else left = mid + 1;
    }
    return left;
  };
  return queries.map(([lo, hi]) => lowerBound(hi + 1) - lowerBound(lo));
}`;

const C2_STARTER = starter({
  head: `
// Các lượt đặt phòng lab dạng KHOẢNG NỬA MỞ [start, end) theo phút: lượt kết thúc lúc 10 và lượt bắt đầu lúc 10 dùng
// chung được một phòng. Trả về số phòng ÍT NHẤT để không phòng nào có hai lượt chồng nhau.
// 0 ≤ n ≤ 2·10⁵ · 0 ≤ start < end ≤ 10⁹`,
  stub: `
function minRooms(bookings) {
  throw new Error('chưa cài đặt');
}`,
  tail: `
${PARK}
const cases = [
  [[9, 11], [10, 12], [11, 13], [13, 14], [9, 10]],
  [[0, 30], [5, 10], [15, 20]],
  [[1, 2], [2, 3], [3, 4]],
  [[1, 5], [1, 5], [1, 5]],
  [],
  [[7, 8]],
];
for (const b of cases) console.log(JSON.stringify(b) + ' -> ' + minRooms(b));
const r = park(253);
const big = Array.from({ length: 200000 }, () => { const s = r() % 1000000; return [s, s + 1 + (r() % 3000)]; });
console.log('large n=200000 -> ' + minRooms(big));`,
});
const C2_SOLUTION = `// O(n log n) thời gian (sắp xếp 2n sự kiện), O(n) bộ nhớ.
// Quét sự kiện: +1 lúc bắt đầu, −1 lúc kết thúc; đáp án là đỉnh của bộ đếm. Với khoảng NỬA MỞ, sự kiện KẾT THÚC phải
// đứng trước sự kiện BẮT ĐẦU khi trùng thời điểm — ngược lại, lúc 10 trong ca đầu bộ đếm thoáng lên 3 (bài 6.3).
function minRooms(bookings) {
  const events = [];
  for (const [start, end] of bookings) {
    events.push([start, +1]);
    events.push([end, -1]);
  }
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);   // cùng thời điểm: −1 (kết thúc) trước +1
  let inUse = 0;
  let peak = 0;
  for (const [, delta] of events) {
    inUse += delta;
    if (inUse > peak) peak = inUse;
  }
  return peak;
}`;

const questions = [
  /* ══════════════ Chương 4 ══════════════ */
  Q(`A classmate types ${c('else lo = mid')} instead of ${c('else lo = mid + 1')} in the template. On [1, 3, 5, 6], searching the first a[i] ≥ 7, what happens?`,
    `Một bạn gõ ${c('else lo = mid')} thay cho ${c('else lo = mid + 1')} trong khuôn tìm nhị phân. Trên [1, 3, 5, 6], tìm a[i] ≥ 7 đầu tiên, chuyện gì xảy ra?`,
    [['It returns 4, the length.', 'Nó trả 4, tức độ dài mảng.'],
     ['It returns −1 for not found.', 'Nó trả −1 nghĩa là không thấy.'],
     ['It never stops.', 'Nó không bao giờ dừng.'],
     ['It throws a RangeError.', 'Nó ném RangeError.']],
    2,
    `With lo = 3, hi = 4 the mid rounds down to 3, a[3] = 6 is F, and lo = mid sets lo to 3 again — the range never shrinks (real run: STUCK, lesson 4.1). "Returns 4" is tempting because the same bug happens to work for some targets.`,
    `Với lo = 3, hi = 4, mid làm tròn xuống thành 3, a[3] = 6 là F, và lo = mid lại đặt lo thành 3 — khoảng không bao giờ hẹp lại (lần chạy thật: STUCK, bài 4.1). "Trả 4" hấp dẫn vì cùng bug đó tình cờ đúng với vài giá trị cần tìm.`),

  Q(`Java First Bad Version uses ${c('mid = (lo + hi) / 2')}. It fails on n = 2,147,483,647. What does LeetCode most likely report?`,
    `First Bad Version bằng Java dùng ${c('mid = (lo + hi) / 2')}. Nó hỏng với n = 2.147.483.647. LeetCode nhiều khả năng báo gì?`,
    [['ArithmeticException: integer overflow.', 'ArithmeticException: tràn số nguyên.'],
     ['Time Limit Exceeded: lo jumps between negative and positive.', 'Time Limit Exceeded: lo nhảy giữa âm và dương.'],
     ['Wrong Answer with a negative version.', 'Wrong Answer với một phiên bản âm.'],
     ['Accepted — Java promotes to long.', 'Accepted — Java tự nâng lên long.']],
    1,
    `1 + 2,147,483,647 wraps to a negative sum, mid is negative, lo = mid + 1 becomes negative; the next sum is positive again… The real run printed STUCK after 100 loops (lesson 4.1). Java int arithmetic never throws; use lo + (hi − lo) / 2.`,
    `1 + 2.147.483.647 quay vòng thành tổng âm, mid âm, lo = mid + 1 thành âm; tổng kế tiếp lại dương… Lần chạy thật in STUCK sau 100 vòng (bài 4.1). Phép tính int của Java không bao giờ ném lỗi; hãy dùng lo + (hi − lo) / 2.`),

  Q(`You find the minimum of a rotated array with ${c('firstTrue(0, n, i => a[i] <= a[n - 1])')}. Input [1, 1, 1, 0, 1, 1]. It returns…`,
    `Bạn tìm phần tử nhỏ nhất của mảng xoay bằng ${c('firstTrue(0, n, i => a[i] <= a[n - 1])')}. Đầu vào [1, 1, 1, 0, 1, 1]. Nó trả…`,
    [['Index 3 (value 0).', 'Chỉ số 3 (giá trị 0).'],
     ['An infinite loop.', 'Một vòng lặp vô hạn.'],
     ['Index 5 (value 1).', 'Chỉ số 5 (giá trị 1).'],
     ['Index 0 (value 1): the whole row is T.', 'Chỉ số 0 (giá trị 1): cả hàng đều là T.']],
    3,
    `The last element is 1 and every element is ≤ 1, so the row is TTTTTT and the first T is index 0 — real run: "naive template → index 0, value 1 (WRONG, min is 0)" (lesson 4.2). Duplicates break the monotone predicate; the template still terminates, it just answers the wrong question.`,
    `Phần tử cuối là 1 và mọi phần tử ≤ 1, nên hàng T/F là TTTTTT và chữ T đầu tiên ở chỉ số 0 — lần chạy thật: "naive template → index 0, value 1 (WRONG, min is 0)" (bài 4.2). Phần tử trùng phá tính đơn điệu của vị từ; khuôn vẫn dừng, chỉ là trả lời sai câu hỏi.`),

  Q(`Your findPeakElement returns index 5 on [2, 4, 3, 1, 5, 7, 6]. The interviewer asks: "So it returns the maximum?" Best answer?`,
    `findPeakElement của bạn trả chỉ số 5 trên [2, 4, 3, 1, 5, 7, 6]. Người phỏng vấn hỏi: "Vậy nó trả phần tử lớn nhất?" Trả lời tốt nhất?`,
    [['No: it returns some peak; the global maximum needs O(n).', 'Không: nó trả một đỉnh nào đó; phần tử lớn nhất cần O(n).'],
     ['Yes — a peak is always the maximum.', 'Đúng — đỉnh luôn là phần tử lớn nhất.'],
     ['Yes, if the array has no duplicates.', 'Đúng, nếu mảng không có phần tử trùng.'],
     ['No: it returns the minimum.', 'Không: nó trả phần tử nhỏ nhất.']],
    0,
    `7 happens to be both a peak and the maximum here, but 4 at index 1 is also a peak; on another array the search can end on a smaller peak (lesson 4.2). Any cell you did not read could hold a bigger value, so the maximum of an arbitrary array needs O(n).`,
    `Ở đây 7 tình cờ vừa là đỉnh vừa là lớn nhất, nhưng 4 ở chỉ số 1 cũng là một đỉnh; trên mảng khác phép tìm có thể dừng ở một đỉnh nhỏ hơn (bài 4.2). Ô nào chưa đọc cũng có thể chứa giá trị lớn hơn, nên phần tử lớn nhất của một mảng bất kỳ cần O(n).`),

  Q(`A matrix has every row sorted left→right and every column sorted top→bottom, nothing more. Best way to search a target?`,
    `Một ma trận có mỗi hàng sắp tăng từ trái sang phải và mỗi cột sắp tăng từ trên xuống, chỉ vậy thôi. Cách tìm một giá trị tốt nhất?`,
    [['Treat it as one sorted array of m·n cells and binary search.', 'Coi nó là một mảng đã sắp m·n ô rồi tìm nhị phân.'],
     ['Binary search the first column, then that row.', 'Tìm nhị phân cột đầu, rồi tìm trong hàng đó.'],
     ['Staircase from the top-right corner: O(m + n).', 'Đi bậc thang từ góc trên phải: O(m + n).'],
     ['Scan every cell: O(m·n).', 'Duyệt mọi ô: O(m·n).']],
    2,
    `Read row by row the cells are not sorted (14 can be followed by 3), so the LC 74 trick searches a non-monotone sequence and can miss the target; the first-column trick fails for the same reason (lesson 4.2). From the top-right, each comparison drops a row or a column.`,
    `Đọc theo từng hàng thì các ô không được sắp (14 có thể đứng trước 3), nên mẹo của LC 74 tìm trên một dãy không đơn điệu và có thể bỏ sót; mẹo cột đầu hỏng cùng lý do (bài 4.2). Từ góc trên phải, mỗi phép so sánh loại được một hàng hoặc một cột.`),

  Q(`LC 1552 (maximise the minimum gap): ${c('canPlace(g)')} is true for small g and false for large g. With the firstTrue template, which expression returns the answer?`,
    `LC 1552 (cực đại hoá khoảng cách nhỏ nhất): ${c('canPlace(g)')} đúng với g nhỏ và sai với g lớn. Với khuôn firstTrue, biểu thức nào trả đáp án?`,
    [[`${c('firstTrue(1, span + 1, g => canPlace(g))')}`, `${c('firstTrue(1, span + 1, g => canPlace(g))')}`],
     [`${c('firstTrue(1, span + 1, g => !canPlace(g))')}`, `${c('firstTrue(1, span + 1, g => !canPlace(g))')}`],
     [`${c('firstTrue(1, span + 1, g => !canPlace(g)) + 1')}`, `${c('firstTrue(1, span + 1, g => !canPlace(g)) + 1')}`],
     [`${c('firstTrue(1, span + 1, g => !canPlace(g)) - 1')}`, `${c('firstTrue(1, span + 1, g => !canPlace(g)) - 1')}`]],
    3,
    `canPlace is T…T F…F, so ask the opposite ("is g impossible?") to get F…F T…T; its first T is the smallest impossible gap and the answer is one less — positions [2, 3, 5, 9, 10] with m = 3 gave 3 (lesson 4.3). Without "− 1" you return the first impossible gap.`,
    `canPlace có dạng T…T F…F, nên hãy hỏi điều ngược lại ("g có bất khả không?") để có F…F T…T; chữ T đầu tiên là khoảng bất khả nhỏ nhất và đáp án nhỏ hơn nó một — vị trí [2, 3, 5, 9, 10] với m = 3 cho 3 (bài 4.3). Thiếu "− 1" là trả về khoảng bất khả đầu tiên.`),

  Q(`Koko-style problem: n ≤ 10⁵ piles, eat speed X per hour, must finish within h hours. Which search space for X is right?`,
    `Bài kiểu Koko: n ≤ 10⁵ đống, tốc độ ăn X mỗi giờ, phải xong trong h giờ. Không gian tìm X nào đúng?`,
    [['1 to max(piles).', '1 tới max(piles).'],
     ['0 to sum(piles).', '0 tới sum(piles).'],
     ['min(piles) to max(piles).', 'min(piles) tới max(piles).'],
     ['1 to n.', '1 tới n.']],
    0,
    `Speed 1 is the slowest possible; at max(piles) every pile takes one hour, so a larger speed never helps — the answer is in [1, max] (lesson 4.3). 0 would divide by zero; min(piles) can be too fast when h is large; n has nothing to do with speed.`,
    `Tốc độ 1 là chậm nhất có thể; ở max(piles) mỗi đống mất đúng một giờ, nên nhanh hơn không giúp gì — đáp án nằm trong [1, max] (bài 4.3). 0 gây chia cho không; min(piles) có thể đã quá nhanh khi h lớn; n chẳng liên quan gì tới tốc độ.`),

  Q(`What is the loop invariant of the half-open template ${c('[lo, hi)')} with "T ⇒ hi = mid, F ⇒ lo = mid + 1"?`,
    `Bất biến vòng lặp của khuôn nửa mở ${c('[lo, hi)')} với "T ⇒ hi = mid, F ⇒ lo = mid + 1" là gì?`,
    [['a[lo] is always the answer.', 'a[lo] luôn là đáp án.'],
     ['Everything before lo is F; everything from hi on is T.', 'Mọi thứ trước lo là F; mọi thứ từ hi trở đi là T.'],
     ['lo and hi are always both T.', 'lo và hi luôn cùng là T.'],
     ['hi − lo halves exactly each step.', 'hi − lo giảm đúng một nửa mỗi bước.']],
    1,
    `Lesson 4.1's single template for every variant: indexes &lt; lo are known F, indexes ≥ hi are known T, and [lo, hi) is unknown. When lo == hi the first T is at lo — or lo = n when there is no T. That is why lowerBound, upperBound and "first bad" are one function.`,
    `Khuôn duy nhất của bài 4.1 cho mọi biến thể: các chỉ số &lt; lo đã biết là F, các chỉ số ≥ hi đã biết là T, còn [lo, hi) chưa biết. Khi lo == hi thì chữ T đầu tiên ở lo — hoặc lo = n khi không có T nào. Vì thế lowerBound, upperBound và "bản lỗi đầu tiên" chỉ là một hàm.`),

  /* ══════════════ Chương 5 ══════════════ */
  Q(`A level-order function uses ${c('for (let k = 0; k < queue.length; k++) { const node = queue.shift(); … }')}. For [1,2,3,4,5,null,6] it returns…`,
    `Một hàm duyệt theo tầng dùng ${c('for (let k = 0; k < queue.length; k++) { const node = queue.shift(); … }')}. Với [1,2,3,4,5,null,6] nó trả…`,
    [['[[1],[2,3],[4,5,6]]', '[[1],[2,3],[4,5,6]]'],
     ['[[1,2,3],[4,5],[6]]', '[[1,2,3],[4,5],[6]]'],
     ['[[1],[2],[3],[4],[5],[6]]', '[[1],[2],[3],[4],[5],[6]]'],
     ['[[1,2,3,4,5,6]]', '[[1,2,3,4,5,6]]']],
    1,
    `shift() shrinks the queue and pushing children grows it while the condition is re-read every round, so the loop runs into the next level (real run, lesson 5.1). Freeze the level size first: ${c('const size = queue.length')}.`,
    `shift() làm hàng đợi ngắn lại còn push con làm nó dài ra, trong khi điều kiện được đọc lại mỗi vòng, nên vòng lặp chạy lấn sang tầng sau (lần chạy thật, bài 5.1). Hãy chốt kích thước tầng trước: ${c('const size = queue.length')}.`),

  Q(`Java: ${c('ok(root, Integer.MIN_VALUE, Integer.MAX_VALUE)')} with ${c('n.val <= lo || n.val >= hi ⇒ false')}. For the single-node tree [2147483647] it returns…`,
    `Java: ${c('ok(root, Integer.MIN_VALUE, Integer.MAX_VALUE)')} với ${c('n.val <= lo || n.val >= hi ⇒ false')}. Với cây một nút [2147483647] nó trả…`,
    [['true — one node is always a BST.', 'true — một nút luôn là BST.'],
     ['A NullPointerException.', 'NullPointerException.'],
     ['false — the sentinel collides with a real value.', 'false — giá trị canh trùng với một giá trị thật.'],
     ['An overflow exception.', 'Ngoại lệ tràn số.']],
    2,
    `The value equals the "infinity" constant, so &gt;= rejects it — real run: int sentinels = false, long bounds = true (lesson 5.3). Use long bounds or nullable bounds; Java never throws on int overflow, and these are primitive ints.`,
    `Giá trị bằng đúng hằng "vô cực", nên &gt;= từ chối nó — lần chạy thật: int sentinels = false, long bounds = true (bài 5.3). Hãy dùng biên kiểu long hoặc biên có thể null; Java không bao giờ ném lỗi khi tràn int, và đây là int nguyên thuỷ.`),

  Q(`Inserting SORTED keys into a plain BST went from 91 ms at 10,000 keys to 2,109 ms at 50,000. Which complexity does that match?`,
    `Chèn các khoá ĐÃ SẮP vào một BST thường mất từ 91 ms ở 10.000 khoá lên 2.109 ms ở 50.000. Nó khớp độ phức tạp nào?`,
    [['O(n log n) — about ×6.', 'O(n log n) — khoảng ×6.'],
     ['O(n) — about ×5.', 'O(n) — khoảng ×5.'],
     ['O(2ⁿ) — exponential.', 'O(2ⁿ) — hàm mũ.'],
     ['O(n²) — about ×23.', 'O(n²) — khoảng ×23.']],
    3,
    `Sorted inserts make the height equal to n, so insert i walks i nodes: 1 + 2 + … + n = O(n²), and ×5 keys predicts ×25 (lesson 5.3). The shuffled run stayed near-linear (height 37 at 50,000), and Java's TreeMap took 4 ms because it rebalances.`,
    `Chèn theo thứ tự làm chiều cao bằng n, nên lần chèn thứ i đi qua i nút: 1 + 2 + … + n = O(n²), và ×5 khoá dự đoán ×25 thời gian (bài 5.3). Bản xáo trộn gần tuyến tính (cao 37 ở 50.000), còn TreeMap của Java mất 4 ms vì nó tự cân bằng.`),

  Q(`"Return all nodes exactly k edges away from a target node in a binary tree." Which approach fits?`,
    `"Trả về mọi nút cách nút target đúng k cạnh trong một cây nhị phân." Hướng nào hợp?`,
    [['Record parents, then BFS k levels from the target with a visited set.', 'Ghi lại nút cha, rồi BFS k tầng từ target với tập visited.'],
     ['DFS down from the target only.', 'Chỉ DFS đi xuống từ target.'],
     ['Level-order from the root, return level depth(target) + k.', 'Duyệt tầng từ gốc, trả tầng depth(target) + k.'],
     ['Sort the node values.', 'Sắp xếp giá trị các nút.']],
    0,
    `Distance can go UP through the parent and down another branch, so the tree becomes an undirected graph: parent links + BFS by levels, with visited because child → parent → child is a cycle (LC 863, lesson 5.2). Going only down misses half the answers.`,
    `Khoảng cách có thể đi LÊN qua nút cha rồi xuống nhánh khác, nên cây thành đồ thị vô hướng: liên kết cha + BFS theo tầng, có visited vì con → cha → con là một chu trình (LC 863, bài 5.2). Chỉ đi xuống thì sót nửa số đáp án.`),

  Q(`Java Diameter keeps the answer in ${c('static int best = 0')}, never reset. The judge runs [1,2,3,4,5] (answer 3) then [1,2] (answer 1) in one JVM. The second test returns…`,
    `Diameter bằng Java giữ đáp án trong ${c('static int best = 0')}, không bao giờ đặt lại. Máy chấm chạy [1,2,3,4,5] (đáp án 3) rồi [1,2] (đáp án 1) trong cùng một JVM. Test thứ hai trả…`,
    [['1', '1'],
     ['3', '3'],
     ['0', '0'],
     ['4', '4']],
    1,
    `A static field belongs to the class, not to the new Solution object, so best still holds 3 and Math.max never lowers it — real run: static field 3, fixed 1 (lesson 5.2). Use an instance field reset at the entry point, or return the value.`,
    `Trường static thuộc về lớp, không thuộc đối tượng Solution mới, nên best vẫn giữ 3 và Math.max không bao giờ hạ nó — lần chạy thật: static field 3, bản sửa 1 (bài 5.2). Hãy dùng trường của đối tượng được đặt lại ở hàm vào, hoặc trả giá trị về.`),

  Q(`Binary Tree Maximum Path Sum with a correct gain() recursion but ${c('best = 0')} at the start. On the tree [-3] it returns…`,
    `Binary Tree Maximum Path Sum với hàm gain() đúng nhưng khởi đầu ${c('best = 0')}. Trên cây [-3] nó trả…`,
    [['−3, correct.', '−3, đúng.'],
     ['−Infinity, the initial value.', '−Infinity, giá trị khởi đầu.'],
     ['A stack overflow.', 'Tràn stack.'],
     ['0, which is wrong.', '0, và như vậy là sai.']],
    3,
    `best = max(0, −3) stays 0, but a path must contain at least one node, so the answer is −3 (lesson 5.2). Start best at −Infinity (Integer.MIN_VALUE in Java); clamping the CHILD gains at 0 is right, clamping the answer is not.`,
    `best = max(0, −3) vẫn là 0, nhưng một đường đi phải có ít nhất một nút, nên đáp án là −3 (bài 5.2). Hãy khởi đầu best bằng −Infinity (Integer.MIN_VALUE trong Java); kẹp lợi ích của CON về 0 là đúng, kẹp đáp án thì sai.`),

  Q(`In-order traversal of a valid BST visits the values in which order?`,
    `Duyệt trung thứ tự (in-order) một BST hợp lệ sẽ thăm các giá trị theo thứ tự nào?`,
    [['Level by level.', 'Theo từng tầng.'],
     ['Descending.', 'Giảm dần.'],
     ['Ascending.', 'Tăng dần.'],
     ['Insertion order.', 'Thứ tự chèn.']],
    2,
    `Left subtree &lt; node &lt; right subtree, so left–node–right visits values in ascending order (lesson 5.3). That gives two classic solutions: "k-th smallest" stops at the k-th visit, and "is it a BST?" checks each value against the previous one.`,
    `Cây con trái &lt; nút &lt; cây con phải, nên trái – nút – phải thăm các giá trị theo thứ tự tăng dần (bài 5.3). Từ đó có hai lời giải kinh điển: "nhỏ thứ k" dừng ở lần thăm thứ k, và "có phải BST?" so mỗi giá trị với giá trị trước nó.`),

  Q(`A search box suggests words from a 50,000-word dictionary as the user types a prefix. Which structure does chapter 5 recommend?`,
    `Ô tìm kiếm gợi ý từ trong từ điển 50.000 từ khi người dùng gõ tiền tố. Chương 5 khuyên cấu trúc nào?`,
    [['A trie: walk the prefix, then collect below that node.', 'Trie: đi theo tiền tố, rồi gom các từ bên dưới nút đó.'],
     ['A hash set of whole words.', 'Một hash set chứa nguyên từ.'],
     ['A min-heap of words.', 'Một min-heap các từ.'],
     ['A linked list sorted by length.', 'Một danh sách liên kết sắp theo độ dài.']],
    0,
    `A trie answers "which words start with this prefix?" in time proportional to the prefix plus the output, independent of the dictionary size (lesson 5.4). A hash set only answers exact membership; you would have to scan every word for each keystroke.`,
    `Trie trả lời "những từ nào bắt đầu bằng tiền tố này?" trong thời gian tỉ lệ với độ dài tiền tố cộng số kết quả, không phụ thuộc kích thước từ điển (bài 5.4). Hash set chỉ trả lời có/không cho nguyên từ; bạn sẽ phải quét mọi từ sau mỗi lần gõ phím.`),

  /* ══════════════ Chương 6 ══════════════ */
  Q(`Java: ${c('new PriorityQueue<Integer>((a, b) -> a - b)')}; offer 5, 2_000_000_000, −7, −2_000_000_000, 0; poll everything. What order comes out?`,
    `Java: ${c('new PriorityQueue<Integer>((a, b) -> a - b)')}; offer 5, 2_000_000_000, −7, −2_000_000_000, 0; poll hết. Thứ tự ra là gì?`,
    [['[-2000000000, -7, 0, 5, 2000000000]', '[-2000000000, -7, 0, 5, 2000000000]'],
     ['[2000000000, 5, 0, -7, -2000000000]', '[2000000000, 5, 0, -7, -2000000000]'],
     ['[-7, 0, -2000000000, 5, 2000000000]', '[-7, 0, -2000000000, 5, 2000000000]'],
     ['An exception on the overflow.', 'Một ngoại lệ do tràn số.']],
    2,
    `2·10⁹ − (−2·10⁹) wraps to a negative int, so the comparator says 2·10⁹ is smaller than −2·10⁹; the real output puts the most negative value third (lesson 6.1). Use Integer.compare(a, b) — subtraction comparators are only safe for small ranges.`,
    `2·10⁹ − (−2·10⁹) quay vòng thành int âm, nên comparator nói 2·10⁹ nhỏ hơn −2·10⁹; kết quả chạy thật đặt số âm nhất ở vị trí thứ ba (bài 6.1). Hãy dùng Integer.compare(a, b) — comparator bằng phép trừ chỉ an toàn với miền giá trị nhỏ.`),

  Q(`A job queue orders by deadline (epoch ms, long) with ${c('(a, b) -> (int) (a.deadline() - b.deadline())')}. Jobs: due now, in 7 days, in 30 days. Which runs first?`,
    `Một hàng đợi việc xếp theo hạn chót (epoch ms, long) với ${c('(a, b) -> (int) (a.deadline() - b.deadline())')}. Các việc: hạn ngay bây giờ, sau 7 ngày, sau 30 ngày. Việc nào chạy trước?`,
    [['The job due now.', 'Việc có hạn ngay bây giờ.'],
     ['The job due in 7 days.', 'Việc có hạn sau 7 ngày.'],
     ['They run in insertion order.', 'Chúng chạy theo thứ tự chèn.'],
     ['The job due in 30 days.', 'Việc có hạn sau 30 ngày.']],
    3,
    `30 days = 2,592,000,000 ms does not fit in an int: the cast gives a negative number, so the 30-day job compares as EARLIER than the job due now — real run (lesson 6.1). 7 days fits. Long.compare is the fix; an attacker who can set deadlines can jump the queue.`,
    `30 ngày = 2.592.000.000 ms không vừa int: phép ép kiểu cho số âm, nên việc 30 ngày được so là SỚM hơn việc hạn ngay bây giờ — lần chạy thật (bài 6.1). 7 ngày thì vừa. Sửa bằng Long.compare; kẻ đặt được hạn chót có thể chen lên đầu hàng.`),

  Q(`MedianFinder: lo = max-heap, hi = min-heap; add x to lo if x ≤ top(lo), else to hi, then rebalance so |lo| = |hi| or |hi| + 1. After 5, 15, 1, 3?`,
    `MedianFinder: lo = max-heap, hi = min-heap; thêm x vào lo nếu x ≤ đỉnh(lo), ngược lại vào hi, rồi cân lại sao cho |lo| = |hi| hoặc |hi| + 1. Sau 5, 15, 1, 3?`,
    [['lo = {3, 1}, hi = {5, 15}, median 4.0', 'lo = {3, 1}, hi = {5, 15}, trung vị 4.0'],
     ['lo = {5, 3, 1}, hi = {15}, median 3.0', 'lo = {5, 3, 1}, hi = {15}, trung vị 3.0'],
     ['lo = {1, 5}, hi = {3, 15}, median 4.0', 'lo = {1, 5}, hi = {3, 15}, trung vị 4.0'],
     ['lo = {15, 5}, hi = {1, 3}, median 10.0', 'lo = {15, 5}, hi = {1, 3}, trung vị 10.0']],
    0,
    `5 → lo; 15 → hi; 1 → lo (2/1, allowed); 3 ≤ 5 → lo, now 3/1, so lo's top 5 moves to hi: lo {3, 1}, hi {5, 15}, median (3 + 5) / 2 (lesson 6.2's trace). The second option forgets to rebalance; the third breaks the order invariant.`,
    `5 → lo; 15 → hi; 1 → lo (2/1, được phép); 3 ≤ 5 → lo, giờ 3/1, nên đỉnh 5 của lo chuyển sang hi: lo {3, 1}, hi {5, 15}, trung vị (3 + 5) / 2 (bảng vết của bài 6.2). Lựa chọn thứ hai quên cân lại; lựa chọn thứ ba phá bất biến thứ tự.`),

  Q(`Java sliding window median: ${c('a = b = Integer.MAX_VALUE')} and you compute ${c('(a + b) / 2.0')}. Result?`,
    `Trung vị cửa sổ trượt bằng Java: ${c('a = b = Integer.MAX_VALUE')} và bạn tính ${c('(a + b) / 2.0')}. Kết quả?`,
    [['2.147483647E9', '2.147483647E9'],
     ['An ArithmeticException.', 'ArithmeticException.'],
     ['Infinity', 'Infinity'],
     ['-1.0', '-1.0']],
    3,
    `a + b is evaluated as int + int first and wraps to −2; only then is it divided by 2.0 (real run, lesson 6.2). Widen first — ((double) a + b) / 2.0 or a / 2.0 + b / 2.0 — to get 2.147483647E9. TypeScript would print the right value because numbers are doubles.`,
    `a + b được tính dạng int + int trước và quay vòng thành −2; chỉ sau đó mới chia cho 2.0 (lần chạy thật, bài 6.2). Hãy nới kiểu trước — ((double) a + b) / 2.0 hoặc a / 2.0 + b / 2.0 — để có 2.147483647E9. TypeScript sẽ in đúng vì số là double.`),

  Q(`Half-open meetings, sweep line with events (time, +1/−1). You sort ties so that START comes before END. On [[9,11],[10,12],[11,13],[13,14],[9,10]] the sweep reports…`,
    `Các cuộc họp nửa mở, quét sự kiện (thời điểm, +1/−1). Bạn sắp khi trùng thời điểm thì BẮT ĐẦU đứng trước KẾT THÚC. Trên [[9,11],[10,12],[11,13],[13,14],[9,10]] phép quét báo…`,
    [['2, the right count', '2, đúng số phòng'],
     ['3, one too many', '3, thừa một'],
     ['5, one per meeting', '5, mỗi cuộc một phòng'],
     ['1, they all chain', '1, chúng nối tiếp nhau']],
    1,
    `At t = 10 the start of [10,12) is counted before the end of [9,10), so for an instant three meetings look active; same at 11 (lesson 6.3). For half-open intervals ends must come first; start-first is exactly the closed-interval answer.`,
    `Lúc t = 10, điểm bắt đầu của [10,12) được tính trước điểm kết thúc của [9,10), nên trong một khoảnh khắc có ba cuộc họp trông như đang chạy; tương tự lúc 11 (bài 6.3). Với khoảng nửa mở, kết thúc phải đứng trước; bắt đầu trước chính là đáp án của khoảng đóng.`),

  Q(`Measured in Java at n = 10⁶, k = n/2: Arrays.sort(int[]) 59.4 ms, PriorityQueue<Integer> of size k 140.0 ms. Best explanation?`,
    `Đo bằng Java ở n = 10⁶, k = n/2: Arrays.sort(int[]) 59,4 ms, PriorityQueue<Integer> cỡ k 140,0 ms. Giải thích tốt nhất?`,
    [['PriorityQueue is O(n²) per insert.', 'PriorityQueue là O(n²) mỗi lần chèn.'],
     ['The JIT had not warmed up yet.', 'JIT chưa khởi động xong.'],
     ['log k ≈ log n here, and Integers are boxed.', 'Ở đây log k ≈ log n, và Integer bị đóng hộp.'],
     ['Arrays.sort uses multiple threads.', 'Arrays.sort dùng nhiều luồng.']],
    2,
    `When k is half of n, the heap's advantage (log k instead of log n) disappears, and PriorityQueue&lt;Integer&gt; stores boxed objects while Arrays.sort(int[]) works on raw ints (real numbers, measured after warm-up, lesson 6.1). The heap is still O(n log k).`,
    `Khi k bằng nửa n, lợi thế của heap (log k thay cho log n) biến mất, còn PriorityQueue&lt;Integer&gt; chứa đối tượng đóng hộp trong khi Arrays.sort(int[]) làm việc trên int thô (số đo thật, sau khi đã khởi động JIT, bài 6.1). Heap vẫn là O(n log k).`),

  Q(`Merge k sorted lists with N nodes in total using a min-heap that holds one head per list. What is the time complexity?`,
    `Trộn k danh sách đã sắp, tổng cộng N nút, bằng một min-heap giữ một nút đầu của mỗi danh sách. Độ phức tạp thời gian là gì?`,
    [['O(N log k)', 'O(N log k)'],
     ['O(N log N)', 'O(N log N)'],
     ['O(N · k)', 'O(N · k)'],
     ['O(k log N)', 'O(k log N)']],
    0,
    `Every one of the N nodes is pushed and popped once, and the heap never holds more than k items, so each operation is O(log k) (lesson 6.1). Scanning the k heads for the minimum each time is O(N · k); concatenating and sorting is O(N log N).`,
    `Mỗi nút trong N nút được đẩy vào và lấy ra đúng một lần, và heap không bao giờ chứa quá k phần tử, nên mỗi thao tác là O(log k) (bài 6.1). Quét k nút đầu để tìm nhỏ nhất mỗi lần là O(N · k); nối hết rồi sắp xếp là O(N log N).`),

  Q(`Merge Intervals: sort by start, then merge each interval into the last one when it overlaps. With CLOSED intervals, should [1, 4] and [4, 6] merge?`,
    `Merge Intervals: sắp theo điểm đầu, rồi gộp mỗi khoảng vào khoảng cuối khi chúng chồng nhau. Với khoảng ĐÓNG, [1, 4] và [4, 6] có gộp không?`,
    [['Yes — they share the point 4, so the test is start ≤ last end.', 'Có — chúng có chung điểm 4, nên phép thử là start ≤ last end.'],
     ['No — they only touch.', 'Không — chúng chỉ chạm nhau.'],
     ['Only if both have the same length.', 'Chỉ khi hai khoảng dài bằng nhau.'],
     ['It depends on the sort being stable.', 'Còn tuỳ phép sắp xếp có ổn định không.']],
    0,
    `Closed intervals that share an endpoint overlap at that point, so they merge into [1, 6] (LC 56 uses ≤). For half-open bookings [1, 4) and [4, 6) do NOT clash — the same boundary decision that changed 2 rooms into 3 in lesson 6.3. Always ask which kind of interval it is.`,
    `Khoảng đóng có chung đầu mút thì chồng nhau tại điểm đó, nên gộp thành [1, 6] (LC 56 dùng ≤). Với lượt đặt nửa mở, [1, 4) và [4, 6) KHÔNG xung đột — đúng quyết định ranh giới đã biến 2 phòng thành 3 ở bài 6.3. Luôn hỏi đó là loại khoảng nào.`),
];

export default {
  course: { slug: 'dsa-interview' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 4–6 (binary search, trees, heaps and intervals)',
        'Kiểm tra tiến độ 2 — Chương 4–6 (tìm kiếm nhị phân, cây, heap và khoảng)',
      ),
      description: B(
        'The middle of Coding Interview Prep: one binary-search template for every variant, rotated arrays and search on the answer; tree traversals, "what does the helper return?", BSTs and tries; heaps, comparators that overflow, two-heap medians, and interval problems with half-open boundaries. 24 multiple-choice questions plus 2 coding questions with a large generated test.',
        'Phần giữa của khoá Coding Interview Prep: một khuôn tìm nhị phân cho mọi biến thể, mảng xoay và tìm trên không gian đáp án; duyệt cây, "hàm trả gì cho cha?", BST và trie; heap, comparator bị tràn số, trung vị hai heap, và bài toán khoảng với ranh giới nửa mở. 24 câu trắc nghiệm cùng 2 câu lập trình có ca kiểm cỡ lớn.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, 'Chapters 4–6', 'Chương 4–6'),
      questions: [
        ...questions,
        codeQ({
          points: 4,
          prompt: B(
            '<p><b>Q25 — Range counts on sorted scores (chapter 4).</b> ' + c('countInRanges(sorted, queries)') + ' answers, for each query <code>[lo, hi]</code>, how many scores lie in the inclusive range. Up to 2·10⁵ scores and 2·10⁵ queries — a filter per query is 4·10¹⁰ steps.</p>' +
            '<p>Reuse the one template of lesson 4.1: the count is the first index ≥ <code>hi + 1</code> minus the first index ≥ <code>lo</code>. Mind the edge cases in the samples: a value that is absent (<code>[4, 4]</code> → 0), a range below or above every score, and an empty array.</p>',
            '<p><b>Câu 25 — Đếm theo khoảng trên điểm đã sắp xếp (chương 4).</b> ' + c('countInRanges(sorted, queries)') + ' trả lời, với mỗi truy vấn <code>[lo, hi]</code>, có bao nhiêu điểm nằm trong khoảng (tính cả hai đầu). Tới 2·10⁵ điểm và 2·10⁵ truy vấn — mỗi truy vấn một lần filter là 4·10¹⁰ bước.</p>' +
            '<p>Dùng lại khuôn duy nhất của bài 4.1: số lượng là chỉ số đầu tiên ≥ <code>hi + 1</code> trừ chỉ số đầu tiên ≥ <code>lo</code>. Để ý các ca biên trong ví dụ: giá trị không có trong mảng (<code>[4, 4]</code> → 0), khoảng nằm dưới hoặc trên mọi điểm, và mảng rỗng.</p>',
          ),
          starterCode: C1_STARTER,
          expectedOutput: "[[3,3],[4,4],[0,100],[8,10],[11,20],[-5,0],[2,7]] -> [3,0,8,3,0,0,4]\nempty -> [0]\nlarge n=200000 q=200000 -> total=99638727 first=705 last=329",
          sampleSolution: C1_SOLUTION,
        }),
        codeQ({
          points: 4,
          prompt: B(
            '<p><b>Q26 — How many lab rooms? (chapter 6).</b> ' + c('minRooms(bookings)') + ' returns the minimum number of rooms so that no room holds two overlapping bookings. Bookings are <b>half-open</b> <code>[start, end)</code>: one that ends at 10 and one that starts at 10 can share a room.</p>' +
            '<p>Either sweep the 2n events (+1 at a start, −1 at an end) or keep a min-heap of end times. With a sweep, the order of ties decides the answer — the first sample is the lab-booking case of lesson 6.3, whose correct answer is 2, not 3.</p>',
            '<p><b>Câu 26 — Cần bao nhiêu phòng lab? (chương 6).</b> ' + c('minRooms(bookings)') + ' trả về số phòng ít nhất sao cho không phòng nào có hai lượt chồng nhau. Lượt đặt là khoảng <b>nửa mở</b> <code>[start, end)</code>: lượt kết thúc lúc 10 và lượt bắt đầu lúc 10 dùng chung một phòng được.</p>' +
            '<p>Hoặc quét 2n sự kiện (+1 khi bắt đầu, −1 khi kết thúc), hoặc giữ một min-heap thời điểm kết thúc. Với phép quét, thứ tự khi trùng thời điểm quyết định đáp án — ví dụ đầu tiên chính là ca đặt lab của bài 6.3, đáp án đúng là 2, không phải 3.</p>',
          ),
          starterCode: C2_STARTER,
          expectedOutput: "[[9,11],[10,12],[11,13],[13,14],[9,10]] -> 2\n[[0,30],[5,10],[15,20]] -> 2\n[[1,2],[2,3],[3,4]] -> 1\n[[1,5],[1,5],[1,5]] -> 3\n[] -> 0\n[[7,8]] -> 1\nlarge n=200000 -> 367",
          sampleSolution: C2_SOLUTION,
        }),
      ],
    },
  ],
};
