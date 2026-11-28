/**
 * Coding Interview Prep — Progress Test 3: Chương 7 → Chương 11 (đồ thị, quay lui, quy hoạch động & tham lam, thể hiện
 * trong phỏng vấn và bài test online, phỏng vấn thử). 24 câu trắc nghiệm + 2 câu lập trình JavaScript.
 *
 * Đề tự soạn, bám `content/courses/dsa-interview/s07…s11`; kết quả "in ra gì" và số đo lấy nguyên từ bài học.
 * Hai câu lập trình (BFS nhiều nguồn trên lưới; khoảng cách sửa — edit distance — hai hàng) đã đối chiếu với vét cạn
 * trên 300 đầu vào ngẫu nhiên (0 khác biệt); mỗi câu có ca lớn (lưới 1000 × 1000; hai chuỗi 3000 ký tự).
 * Phân bố: C7 ×6 · C8 ×5 · C9 ×6 · C10 ×4 · C11 ×3. Kiểm: node scripts/exam-check.mjs content/exams/DSA-INTERVIEW-PT3.mjs
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/DSA-INTERVIEW-PT3.mjs --apply
 */
import { B, c, Q, codeQ, starter, PARK, ptInstructions } from './_lib/dsa-exam-kit.mjs';

const C1_STARTER = starter({
  head: `
// Một khay mẫu thí nghiệm dạng lưới: 0 = ô trống, 1 = mẫu sạch, 2 = mẫu nhiễm. Mỗi phút, mọi mẫu nhiễm làm nhiễm các
// mẫu sạch kề cạnh (trên/dưới/trái/phải). Trả về số phút ít nhất để không còn mẫu sạch nào, hoặc -1 nếu có mẫu không
// bao giờ bị nhiễm. KHÔNG được sửa lưới nhận vào.  1 ≤ hàng, cột ≤ 1000`,
  stub: `
function minutesToInfectAll(grid) {
  throw new Error('chưa cài đặt');
}`,
  tail: `
${PARK}
const cases = [
  [[2, 1, 1], [1, 1, 0], [0, 1, 1]],
  [[2, 1, 1], [0, 1, 1], [1, 0, 1]],
  [[0, 2]],
  [[2, 1, 1, 1, 1, 1, 2]],
  [[0, 0], [0, 0]],
  [[1]],
];
for (const g of cases) {
  const before = JSON.stringify(g);
  const m = minutesToInfectAll(g);
  console.log(before + ' -> ' + m + (JSON.stringify(g) === before ? '' : '  (INPUT CHANGED!)'));
}
const N = 1000;
const big = Array.from({ length: N }, () => new Array(N).fill(1));
big[0][0] = 2;                                  // một nguồn ở góc: 1998 phút
console.log('large 1000x1000, one corner -> ' + minutesToInfectAll(big));
const r = park(994);
const big2 = Array.from({ length: N }, () => Array.from({ length: N }, () => (r() % 50 === 0 ? 2 : 1)));
console.log('large 1000x1000, ~2% sources -> ' + minutesToInfectAll(big2));`,
});
const C1_SOLUTION = `// O(hàng · cột) thời gian và bộ nhớ.
// BFS NHIỀU NGUỒN theo tầng: mọi mẫu nhiễm vào tầng 0 cùng lúc; mỗi tầng là một phút. Đánh dấu một ô ngay lúc cho vào
// tầng sau (không phải lúc lấy ra) để không ô nào vào hàng hai lần. Làm trên bản sao — đề cấm sửa lưới nhận vào.
// Dùng mảng theo tầng thay cho queue.shift() (O(n) mỗi lần — bài 3.2); không đệ quy (lưới 10⁶ ô).
function minutesToInfectAll(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const state = grid.map((row) => row.slice());
  let level = [];
  let clean = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (state[r][c] === 2) level.push(r * cols + c);
      else if (state[r][c] === 1) clean++;
    }
  }
  let minutes = 0;
  while (clean > 0 && level.length > 0) {
    const next = [];
    for (const cell of level) {
      const r = Math.floor(cell / cols);
      const c = cell % cols;
      for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && state[nr][nc] === 1) {
          state[nr][nc] = 2;
          clean--;
          next.push(nr * cols + nc);
        }
      }
    }
    if (next.length === 0) break;
    minutes++;
    level = next;
  }
  return clean > 0 ? -1 : minutes;
}`;

const C2_STARTER = starter({
  head: `
// Ô "Có phải ý bạn là…?" của trang tìm môn học cần khoảng cách sửa giữa hai chuỗi: số phép ít nhất (chèn, xoá, thay một
// ký tự) để biến a thành b.  0 ≤ độ dài ≤ 3000 · chỉ chữ thường a–z.`,
  stub: `
function editDistance(a, b) {
  throw new Error('chưa cài đặt');
}`,
  tail: `
${PARK}
const cases = [
  ['kitten', 'sitting'],
  ['horse', 'ros'],
  ['', 'abc'],
  ['abc', ''],
  ['same', 'same'],
  ['intention', 'execution'],
  ['csd201', 'csd210'],
];
for (const [a, b] of cases) console.log(JSON.stringify(a) + ' -> ' + JSON.stringify(b) + ' = ' + editDistance(a, b));
const r = park(72);
const word = (n) => Array.from({ length: n }, () => String.fromCharCode(97 + (r() % 4))).join('');
const x = word(3000);
const y = word(3000);
console.log('large 3000 x 3000 -> ' + editDistance(x, y));`,
});
const C2_SOLUTION = `// O(|a| · |b|) thời gian, O(|b|) bộ nhớ (chỉ giữ hai hàng của bảng).
// dp[i][j] = số phép ít nhất biến a[0..i) thành b[0..j). Ký tự cuối bằng nhau ⇒ dp[i-1][j-1]; khác ⇒
// 1 + min(thay: dp[i-1][j-1], xoá: dp[i-1][j], chèn: dp[i][j-1]). Hàng 0 = j (chèn j ký tự), cột 0 = i.
// Bảng đầy đủ 3001 × 3001 vẫn chạy nhưng tốn ~9·10⁶ ô; khoá memo dạng chuỗi "i,j" chậm hơn hàng chục lần (bài 9.4).
function editDistance(a, b) {
  let prev = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    const cur = new Array(b.length + 1);
    cur[0] = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = a[i - 1] === b[j - 1]
        ? prev[j - 1]
        : 1 + Math.min(prev[j - 1], prev[j], cur[j - 1]);
    }
    prev = cur;
  }
  return prev[b.length];
}`;

const questions = [
  /* ══════════════ Chương 7 ══════════════ */
  Q(`n ≤ 10⁵ nodes, up to 2·10⁵ undirected edges, one query "is there a path from a to b?". Which plan fits?`,
    `n ≤ 10⁵ nút, tới 2·10⁵ cạnh vô hướng, một câu hỏi "có đường từ a tới b không?". Hướng nào hợp?`,
    [['An adjacency matrix for O(1) edge checks.', 'Ma trận kề để kiểm cạnh O(1).'],
     ['An adjacency list and an iterative traversal, O(V + E).', 'Danh sách kề và một phép duyệt không đệ quy, O(V + E).'],
     ['Floyd–Warshall for all pairs.', 'Floyd–Warshall cho mọi cặp.'],
     ['Recursive DFS on an edge list.', 'DFS đệ quy trên danh sách cạnh.']],
    1,
    `A list holds V + 2E entries and BFS/DFS over it is O(V + E) (lesson 7.1). The matrix would need 10¹⁰ cells and its traversal is O(V²); Floyd–Warshall is O(V³). Recursive DFS on 10⁵ nodes risks the stack.`,
    `Danh sách kề chứa V + 2E phần tử và BFS/DFS trên nó là O(V + E) (bài 7.1). Ma trận cần 10¹⁰ ô và phép duyệt trên nó là O(V²); Floyd–Warshall là O(V³). DFS đệ quy trên 10⁵ nút có nguy cơ tràn stack.`),

  Q(`Your BFS on an open 1000 × 1000 grid marks a cell visited when it is DEQUEUED (and skips cells already marked). Compared with marking on enqueue…`,
    `BFS của bạn trên lưới trống 1000 × 1000 đánh dấu ô đã thăm lúc LẤY RA khỏi hàng đợi (và bỏ qua ô đã đánh dấu). So với đánh dấu lúc cho vào…`,
    [['Wrong answers: cells are counted twice.', 'Sai đáp án: có ô bị đếm hai lần.'],
     ['Identical in every way.', 'Giống hệt về mọi mặt.'],
     ['It never terminates.', 'Nó không bao giờ dừng.'],
     ['Same answer, about twice as many enqueues.', 'Cùng đáp án, nhưng số lần cho vào gần gấp đôi.']],
    3,
    `Duplicate copies are skipped when dequeued, so the answer is the same, but the real run showed 1,998,001 enqueues and a peak queue of 1,999 instead of 1,000,000 and 1,000 (lesson 7.2). On a dense graph the duplicates can be far worse.`,
    `Các bản trùng bị bỏ qua lúc lấy ra, nên đáp án như nhau, nhưng lần chạy thật cho 1.998.001 lần cho vào và hàng đợi đỉnh 1.999 thay vì 1.000.000 và 1.000 (bài 7.2). Trên đồ thị dày, số bản trùng còn tệ hơn nhiều.`),

  Q(`On the real FPTU SE prerequisite chart (17 subjects), someone adds a wrong edge that closes the loop PRO192 → PRJ301 → SWP391 → PRO192. What does Kahn's algorithm report?`,
    `Trên sơ đồ tiên quyết thật của ngành SE FPTU (17 môn), có người thêm nhầm một cạnh tạo vòng PRO192 → PRJ301 → SWP391 → PRO192. Thuật toán Kahn báo gì?`,
    [['Only the 3 subjects on the loop are stuck.', 'Chỉ 3 môn trên vòng bị kẹt.'],
     ['8 placed, 9 stuck — including subjects not on the loop.', '8 môn xếp được, 9 môn kẹt — gồm cả môn không nằm trên vòng.'],
     ['All 17 placed, in a different order.', 'Cả 17 môn xếp được, theo thứ tự khác.'],
     ['It loops forever.', 'Nó lặp vô hạn.']],
    1,
    `Everything that depends on a node of the loop never reaches in-degree 0 either: the real run printed 8 placed and a stuck list of 9, including CSD201 and LAB211 (lesson 7.3). A cycle blocks its whole shadow — which is also how the error message should be read.`,
    `Mọi thứ phụ thuộc vào một nút trên vòng cũng không bao giờ về bậc vào 0: lần chạy thật in 8 môn xếp được và danh sách kẹt 9 môn, có cả CSD201 và LAB211 (bài 7.3). Một chu trình chặn cả "bóng" của nó — và thông báo lỗi cũng nên được đọc như vậy.`),

  Q(`Cheapest Flights Within K Stops: 0→1 (100), 1→2 (100), 0→2 (500), k = 0. A Bellman-Ford that relaxes in place returns 200. Fix?`,
    `Cheapest Flights Within K Stops: 0→1 (100), 1→2 (100), 0→2 (500), k = 0. Bellman-Ford cập nhật tại chỗ trả 200. Sửa thế nào?`,
    [['Run k + 2 rounds instead of k + 1.', 'Chạy k + 2 vòng thay vì k + 1.'],
     ['Use Dijkstra instead.', 'Dùng Dijkstra thay vào.'],
     ["Relax into a copy of last round's prices.", 'Cập nhật vào một bản sao giá của vòng trước.'],
     ['Sort the flights by price first.', 'Sắp xếp chuyến bay theo giá trước.']],
    2,
    `In place, the price of city 1 set earlier in the same round flows on to city 2, so a 2-flight route sneaks into round 1 — the correct answer is 500 (lesson 7.4). Copying makes round r mean "at most r + 1 flights". Plain Dijkstra ignores the stop limit.`,
    `Cập nhật tại chỗ thì giá của thành phố 1 vừa đặt trong cùng vòng chảy tiếp sang thành phố 2, nên đường 2 chuyến lọt vào vòng 1 — đáp án đúng là 500 (bài 7.4). Dùng bản sao khiến vòng r có nghĩa "tối đa r + 1 chuyến". Dijkstra thường bỏ qua giới hạn số điểm dừng.`),

  Q(`Union-find with NO union by size and NO path compression. Unions (0,1), (1,2), … build one chain; then find(0) is called n times. For n = 10,000, roughly how many parent hops?`,
    `Union-find KHÔNG hợp theo kích thước và KHÔNG nén đường. Các phép hợp (0,1), (1,2), … tạo một chuỗi; rồi gọi find(0) n lần. Với n = 10.000, khoảng bao nhiêu bước nhảy lên cha?`,
    [['About 10⁸', 'Khoảng 10⁸'],
     ['About 20,000', 'Khoảng 20.000'],
     ['About 10,000', 'Khoảng 10.000'],
     ['About 140,000', 'Khoảng 140.000']],
    0,
    `Each of the 10,000 finds climbs the whole 9,999-link chain: 99,990,000 hops in the real run (lesson 7.4). "Union-find is almost O(1)" is true only WITH the optimisations — with either of them the same workload collapses to near-linear.`,
    `Mỗi lần find trong 10.000 lần đều trèo cả chuỗi 9.999 mắt xích: 99.990.000 bước trong lần chạy thật (bài 7.4). "Union-find gần như O(1)" chỉ đúng KHI CÓ tối ưu — có một trong hai thì cùng khối việc đó gần như tuyến tính.`),

  Q(`Dijkstra with a binary heap on a graph with V nodes and E edges, all weights non-negative. Its time complexity is…`,
    `Dijkstra dùng heap nhị phân trên đồ thị V nút, E cạnh, mọi trọng số không âm. Độ phức tạp thời gian là…`,
    [['O(V · E)', 'O(V · E)'],
     ['O(V²) always', 'Luôn là O(V²)'],
     ['O(E + V)', 'O(E + V)'],
     ['O((V + E) log V)', 'O((V + E) log V)']],
    3,
    `Every edge may push one entry and every pop costs log of the heap size: O((V + E) log V) with the "skip stale entries" version of lesson 7.4. O(V · E) is Bellman-Ford; O(E + V) is BFS, valid only for unit weights.`,
    `Mỗi cạnh có thể đẩy một phần tử vào heap và mỗi lần lấy ra tốn log kích thước heap: O((V + E) log V) với bản "bỏ phần tử đã cũ" của bài 7.4. O(V · E) là Bellman-Ford; O(E + V) là BFS, chỉ đúng khi trọng số đều bằng 1.`),

  /* ══════════════ Chương 8 ══════════════ */
  Q(`Subsets on [1,2,3] outputs [[],[1],[1,2],[1,2,3],[1,2,3,3],[1,2,3,3,2],…]: right at first, then growing garbage. Which line is missing?`,
    `Subsets trên [1,2,3] in [[],[1],[1,2],[1,2,3],[1,2,3,3],[1,2,3,3,2],…]: đầu thì đúng, sau thành rác dài dần. Thiếu dòng nào?`,
    [['The copy when recording: [...path].', 'Bản sao khi ghi: [...path].'],
     ['The base case.', 'Trường hợp cơ sở.'],
     ['The unchoose after the call: path.pop().', 'Bước bỏ chọn sau lời gọi: path.pop().'],
     ['The sort at the start.', 'Bước sắp xếp ở đầu.']],
    2,
    `"Right at first, then garbage that keeps growing" is the signature of a missing undo: the 3 chosen deepest is never removed and leaks into the siblings (real run, lesson 8.1). A missing copy makes all answers identical instead.`,
    `"Đầu thì đúng, sau thành rác dài dần" là dấu hiệu thiếu bước hoàn tác: số 3 chọn ở tầng sâu nhất không bao giờ được gỡ ra và rò sang các nhánh anh em (lần chạy thật, bài 8.1). Thiếu bản sao thì mọi đáp án lại giống hệt nhau.`),

  Q(`Combination Sum (reuse allowed), sorted [2, 3, 6, 7], target 7. You recurse with ${c('bt(0, remain − a[i])')} instead of ${c('bt(i, …)')}. Result?`,
    `Combination Sum (được dùng lại), [2, 3, 6, 7] đã sắp, target 7. Bạn đệ quy bằng ${c('bt(0, remain − a[i])')} thay cho ${c('bt(i, …)')}. Kết quả?`,
    [['[[2,2,3],[7]]', '[[2,2,3],[7]]'],
     ['[[2,2,3],[2,3,2],[3,2,2],[7]]', '[[2,2,3],[2,3,2],[3,2,2],[7]]'],
     ['[[7]]', '[[7]]'],
     ['An infinite recursion.', 'Đệ quy vô hạn.']],
    1,
    `Starting every level at 0 lets a smaller number come after a bigger one, so each combination appears in every order (real run, lesson 8.2). bt(i) keeps the combination in non-decreasing order; remain still shrinks, so the recursion ends.`,
    `Bắt đầu mọi tầng từ 0 cho phép số nhỏ đứng sau số lớn, nên mỗi tổ hợp xuất hiện ở mọi thứ tự (lần chạy thật, bài 8.2). bt(i) giữ tổ hợp theo thứ tự không giảm; remain vẫn giảm dần nên đệ quy vẫn dừng.`),

  Q(`Word Search uses a boolean[][] visited, set to true before exploring and never cleared. A word that clearly exists returns false. Why?`,
    `Word Search dùng mảng boolean[][] visited, đặt true trước khi đi tiếp và không bao giờ gỡ. Một từ rõ ràng có trong lưới lại trả false. Vì sao?`,
    [['Cells used by a failed path stay blocked for later paths.', 'Ô của một đường đã thất bại bị chặn luôn cho các đường sau.'],
     ['The recursion is too deep.', 'Đệ quy quá sâu.'],
     ['visited must be a Set, not an array.', 'visited phải là Set, không phải mảng.'],
     ['The word must be searched backwards.', 'Phải tìm từ theo chiều ngược.']],
    0,
    `In a backtracking DFS, visited means "on my current path" and must be cleared on the way back; the chapter restores the cell and prints "board restored: true" (lesson 8.3). Never clearing turns it into "ever touched", the BFS meaning.`,
    `Trong DFS quay lui, visited nghĩa là "đang nằm trên đường hiện tại" và phải gỡ khi quay về; chương này trả ô về và in "board restored: true" (bài 8.3). Không bao giờ gỡ là biến nó thành "đã từng chạm", nghĩa của BFS.`),

  Q(`A server compares a 6-digit code digit by digit and returns at the first mismatch, so timing leaks how many leading digits are right. In the chapter's model, how many tries does a backtracking attacker need for 999999?`,
    `Một máy chủ so mã 6 chữ số từng chữ một và trả về ngay ở chữ sai đầu tiên, nên thời gian làm lộ số chữ đầu đúng. Theo mô hình của chương, kẻ tấn công quay lui cần bao nhiêu lần thử cho 999999?`,
    [['1,000,000', '1.000.000'],
     ['6', '6'],
     ['600', '600'],
     ['60', '60']],
    3,
    `A prefix signal is exactly what pruning needs: fix one position at a time, at most 10 digits each — the real run printed 60 tries for 999999, 6 for 000000 (lesson 8.3). Compare with a constant-time comparison such as crypto.timingSafeEqual.`,
    `Tín hiệu theo tiền tố chính là thứ cắt nhánh cần: chốt từng vị trí một, mỗi vị trí tối đa 10 chữ số — lần chạy thật in 60 lần thử cho 999999, 6 lần cho 000000 (bài 8.3). Hãy so bằng phép so thời gian hằng như crypto.timingSafeEqual.`),

  Q(`Permutations II on [1, 1, 2] (sorted, with used[]). Which skip condition builds each distinct permutation exactly once?`,
    `Permutations II trên [1, 1, 2] (đã sắp, có used[]). Điều kiện bỏ qua nào dựng mỗi hoán vị khác nhau đúng một lần?`,
    [[`${c('if (i > 0 && a[i] == a[i - 1]) continue')}`, `${c('if (i > 0 && a[i] == a[i - 1]) continue')}`],
     [`${c('if (used[i]) continue')} only`, `Chỉ ${c('if (used[i]) continue')}`],
     [`${c('if (i > 0 && a[i] == a[i - 1] && !used[i - 1]) continue')}`, `${c('if (i > 0 && a[i] == a[i - 1] && !used[i - 1]) continue')}`],
     [`${c('if (a[i] == a[0]) continue')}`, `${c('if (a[i] == a[0]) continue')}`]],
    2,
    `Allowing a twin only after the twin before it is used forces twins into index order, so each distinct permutation is built once (real run, lesson 8.2). Without the used check the second 1 can never be placed and the real run returned []; used[i] alone produces duplicates.`,
    `Chỉ cho bản sinh đôi vào khi bản đứng trước nó đã được dùng là buộc các bản sinh đôi theo thứ tự chỉ số, nên mỗi hoán vị khác nhau được dựng một lần (lần chạy thật, bài 8.2). Thiếu phần kiểm used thì số 1 thứ hai không bao giờ đặt được và lần chạy thật trả []; chỉ có used[i] thì sinh trùng.`),

  /* ══════════════ Chương 9 ══════════════ */
  Q(`A sign-up form checks names with ${c('/^(a+)+$/')} in Node. On ${c('"a".repeat(n) + "!"')}: n = 18 took 1.8 ms, n = 27 took 908.7 ms. Right reading?`,
    `Một form đăng ký kiểm tên bằng ${c('/^(a+)+$/')} trong Node. Với ${c('"a".repeat(n) + "!"')}: n = 18 mất 1,8 ms, n = 27 mất 908,7 ms. Đọc thế nào là đúng?`,
    [['Each extra character doubles the time; avoid nested quantifiers and cap the length.', 'Mỗi ký tự thêm làm thời gian gấp đôi; tránh lượng từ lồng nhau và giới hạn độ dài.'],
     ['The machine was busy during the second run.', 'Máy bận trong lần chạy thứ hai.'],
     ['Regular expressions are always linear.', 'Biểu thức chính quy luôn tuyến tính.'],
     ['Compile the regex once and it is fixed.', 'Biên dịch regex một lần là hết.']],
    0,
    `The run printed ×2.0 per +1 character — 9 more characters, about 2⁹ = 512× slower: exponential backtracking (ReDoS), the same disease as recursion without a memo (lesson 9.1). Compiling once does not change the backtracking.`,
    `Lần chạy in ×2,0 cho mỗi +1 ký tự — thêm 9 ký tự, chậm khoảng 2⁹ = 512 lần: quay lui hàm mũ (ReDoS), cùng bệnh với đệ quy không có ghi nhớ (bài 9.1). Biên dịch một lần không đổi được việc quay lui.`),

  Q(`Java Coin Change: ${c('dp[a] = Integer.MAX_VALUE')} for a ≥ 1 and ${c('dp[a] = Math.min(dp[a], dp[a - c] + 1)')}. For coins [2], amount 3 it prints…`,
    `Coin Change bằng Java: ${c('dp[a] = Integer.MAX_VALUE')} với a ≥ 1 và ${c('dp[a] = Math.min(dp[a], dp[a - c] + 1)')}. Với coins [2], amount 3 nó in…`,
    [['-1, as intended', '-1, đúng như ý'],
     ['2147483647, the sentinel', '2147483647, giá trị canh'],
     ['-2147483648', '-2147483648'],
     ['2, one coin too many', '2, thừa một đồng']],
    2,
    `dp[1] stays MAX_VALUE, then MAX_VALUE + 1 silently wraps to −2,147,483,648, which wins the min; the final "== MAX_VALUE ⇒ −1" no longer fires (real run, lesson 9.2). Use amount + 1 as "infinity", or skip unreachable states.`,
    `dp[1] vẫn là MAX_VALUE, rồi MAX_VALUE + 1 lặng lẽ quay vòng thành −2.147.483.648, thắng phép min; phép kiểm cuối "== MAX_VALUE ⇒ −1" không còn kích hoạt (lần chạy thật, bài 9.2). Hãy dùng amount + 1 làm "vô cực", hoặc bỏ qua trạng thái không tới được.`),

  Q(`Maximal Square: find the largest all-1 square in a 0/1 grid. Which state gives an O(1) transition?`,
    `Maximal Square: tìm hình vuông lớn nhất toàn số 1 trong lưới 0/1. Trạng thái nào cho bước chuyển O(1)?`,
    [['dp[r][c] = area of the largest square ending at (r, c).', 'dp[r][c] = diện tích hình vuông lớn nhất kết thúc tại (r, c).'],
     ['dp[r][c] = side of the largest square with bottom-right corner (r, c).', 'dp[r][c] = cạnh hình vuông lớn nhất có góc dưới phải tại (r, c).'],
     ['dp[r][c] = number of 1s above (r, c).', 'dp[r][c] = số ô 1 phía trên (r, c).'],
     ['dp[r][c] = best square anywhere in the top-left rectangle.', 'dp[r][c] = hình vuông tốt nhất ở bất kỳ đâu trong hình chữ nhật trên trái.']],
    1,
    `"Ending here" with the SIDE gives dp = 1 + min(up, left, up-left): three side-2 squares glue into a side-3 square (lesson 9.3). With areas, min(4, 4, 4) + 1 = 5 is not even a square; "best anywhere" has no transition.`,
    `"Kết thúc tại đây" với CẠNH cho dp = 1 + min(trên, trái, chéo trên trái): ba hình vuông cạnh 2 ghép thành hình vuông cạnh 3 (bài 9.3). Với diện tích, min(4, 4, 4) + 1 = 5 còn không phải hình vuông; "tốt nhất ở bất kỳ đâu" thì không có bước chuyển.`),

  Q(`Stock with Cooldown kept in two variables, hold and free, returns 4 on [1,2,3,0,2] where the answer is 3. Root cause?`,
    `Stock with Cooldown giữ hai biến hold và free trả 4 trên [1,2,3,0,2] trong khi đáp án là 3. Nguyên nhân gốc?`,
    [['An off-by-one in the loop.', 'Lệch một đơn vị ở vòng lặp.'],
     ['Integer overflow in the profit.', 'Tràn số nguyên ở phần lãi.'],
     ['The greedy choice is wrong.', 'Lựa chọn tham lam sai.'],
     ['The state cannot tell "sold today".', 'Trạng thái không phân biệt được "vừa bán hôm nay".']],
    3,
    `Profit 4 = sell on day 2 at 3, buy on day 3 at 0, sell at 2 — buying the day after a sale, which the rules forbid. The future depends on a fact the state does not record; adding a third state (hold / sold / rest) gives 3, matching a brute force (lesson 9.4).`,
    `Lãi 4 = bán ngày 2 giá 3, mua ngày 3 giá 0, bán giá 2 — mua ngay hôm sau ngày bán, điều luật cấm. Tương lai phụ thuộc một sự kiện mà trạng thái không ghi lại; thêm trạng thái thứ ba (giữ / vừa bán / nghỉ) cho 3, khớp vét cạn (bài 9.4).`),

  Q(`A login page shows "Did you mean …?" using edit distance ≤ 2 against every account name. Why is that dangerous?`,
    `Một trang đăng nhập hiện "Có phải ý bạn là …?" bằng khoảng cách sửa ≤ 2 trên mọi tên tài khoản. Vì sao nguy hiểm?`,
    [['It reveals which accounts exist (user enumeration).', 'Nó lộ ra tài khoản nào tồn tại (dò tên người dùng).'],
     ['Edit distance is O(n²), which allows a DoS.', 'Khoảng cách sửa là O(n²), cho phép tấn công từ chối dịch vụ.'],
     ['It stores passwords in plain text.', 'Nó lưu mật khẩu dạng chữ thường.'],
     ['It breaks for Vietnamese names.', 'Nó hỏng với tên tiếng Việt.']],
    0,
    `Each suggestion confirms a real username to an anonymous visitor — the first step of password guessing (lesson 9.3). The same algorithm is fine where the candidate list is only what the caller may already see, which is what the course's JQL suggestion does.`,
    `Mỗi gợi ý xác nhận một tên đăng nhập có thật với một khách vô danh — bước đầu của đoán mật khẩu (bài 9.3). Cùng thuật toán đó lại ổn khi danh sách ứng viên chỉ gồm thứ người gọi vốn đã được xem, đúng như phần gợi ý JQL mà khoá dẫn ra.`),

  Q(`Which signal most strongly suggests dynamic programming?`,
    `Tín hiệu nào gợi ý quy hoạch động mạnh nhất?`,
    [['The input array is already sorted.', 'Mảng đầu vào đã được sắp xếp sẵn.'],
     ['The problem asks for all permutations.', 'Đề bắt liệt kê mọi hoán vị.'],
     ['Count or optimise over choices, with repeated subproblems.', 'Đếm hoặc tối ưu trên các lựa chọn, có bài con lặp lại.'],
     ['The graph has negative edges.', 'Đồ thị có cạnh âm.']],
    2,
    `Lesson 9.4: optimum or count over a sequence of choices, where the same smaller question is asked again and again, is the DP signature — then say the state and the transition before coding. Listing all permutations is backtracking: the output itself is exponential.`,
    `Bài 9.4: tối ưu hoặc đếm trên một chuỗi lựa chọn, mà cùng một câu hỏi nhỏ hơn bị hỏi đi hỏi lại, là dấu hiệu của DP — rồi nói trạng thái và bước chuyển trước khi code. Liệt kê mọi hoán vị là quay lui: bản thân đầu ra đã là hàm mũ.`),

  /* ══════════════ Chương 10 ══════════════ */
  Q(`Node: input line 2 is "3  -1 4 1 5 " (two spaces after 3, trailing space, CRLF). The code splits on " " and maps Number, then sums the first n = 5. What did it print?`,
    `Node: dòng 2 của đầu vào là "3  -1 4 1 5 " (hai dấu cách sau 3, dấu cách cuối, CRLF). Code tách theo " " rồi map Number, cộng 5 số đầu. Nó in gì?`,
    [['sum=12, all correct', 'sum=12, đúng hết'],
     ['NaN, from the CR', 'NaN, do ký tự CR'],
     ['A SyntaxError.', 'SyntaxError.'],
     ['sum=7', 'sum=7']],
    3,
    `split(" ") on a double space yields an empty string, and Number("") is 0 — no error; the first five tokens are 3, 0, −1, 4, 1 (real run, lesson 10.4). A silent wrong answer is worse than a crash; split on /\\s+/ after trim(), or tokenise the whole input.`,
    `split(" ") trên hai dấu cách liền nhau cho một chuỗi rỗng, và Number("") là 0 — không có lỗi; năm token đầu là 3, 0, −1, 4, 1 (lần chạy thật, bài 10.4). Sai im lặng còn tệ hơn sập; hãy trim() rồi tách theo /\\s+/, hoặc tách token cả đầu vào.`),

  Q(`Your Java OA prints through ${c('new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out)))')} and you forgot ${c('out.flush()')}. The judge receives…`,
    `Bài OA Java của bạn in qua ${c('new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out)))')} và bạn quên ${c('out.flush()')}. Máy chấm nhận được…`,
    [['Everything — the JVM flushes on exit.', 'Đủ cả — JVM tự flush khi thoát.'],
     ['Nothing: empty output, exit code 0.', 'Không gì cả: đầu ra rỗng, mã thoát 0.'],
     ['Only the first line.', 'Chỉ dòng đầu tiên.'],
     ['An IOException.', 'Một IOException.']],
    1,
    `The real run printed "" with exit code 0: the buffered data dies with the program (lesson 10.4). System.out itself is flushed, but your writer's buffer sits in front of it. No exception either — every test becomes Wrong Answer.`,
    `Lần chạy thật in "" với mã thoát 0: dữ liệu trong bộ đệm chết cùng chương trình (bài 10.4). System.out thì được flush, nhưng bộ đệm của writer bạn tạo nằm trước nó. Cũng không có ngoại lệ nào — mọi test thành Wrong Answer.`),

  Q(`A differential-testing harness (fast "max sum of k consecutive" vs brute force, random inputs) reports seed 2: nums=[0,-4,4], k=2, fast=-4, brute=0. Most likely conclusion?`,
    `Bộ kiểm đối chiếu (bản nhanh "tổng lớn nhất của k số liên tiếp" so với vét cạn, đầu vào ngẫu nhiên) báo seed 2: nums=[0,-4,4], k=2, fast=-4, brute=0. Kết luận khả dĩ nhất?`,
    [['The brute force is wrong.', 'Bản vét cạn sai.'],
     ['Random tests are flaky; rerun.', 'Test ngẫu nhiên chập chờn; chạy lại.'],
     ['The fast version never looks at the last window.', 'Bản nhanh không bao giờ xét cửa sổ cuối.'],
     ['Negative numbers are not allowed.', 'Không được có số âm.']],
    2,
    `The windows are [0,−4] = −4 and [−4,4] = 0; returning −4 means the last window was skipped — the off-by-one "s &lt; n − k" (lesson 10.3). The brute force sums every window from scratch and is trusted by construction; a fixed seed makes it reproducible, not flaky.`,
    `Các cửa sổ là [0,−4] = −4 và [−4,4] = 0; trả −4 nghĩa là cửa sổ cuối bị bỏ qua — lỗi lệch một "s &lt; n − k" (bài 10.3). Bản vét cạn cộng lại mọi cửa sổ từ đầu nên đáng tin theo cách xây dựng; seed cố định khiến lỗi lặp lại được, không phải chập chờn.`),

  Q(`Summary Ranges, "dirty" version: the close-a-range code is copied inside and after the loop, and the start is ${c('x1 = a[0]')}. On [] the TypeScript version returns…`,
    `Summary Ranges, bản "bẩn": đoạn đóng một khoảng được chép cả trong lẫn sau vòng lặp, và điểm đầu là ${c('x1 = a[0]')}. Với [] bản TypeScript trả…`,
    [['["undefined"]', '["undefined"]'],
     ['[]', '[]'],
     ['A TypeError.', 'TypeError.'],
     ['[""]', '[""]']],
    0,
    `a[0] of an empty array is undefined in JS (no error), the loop does not run, and the duplicated block after it pushes "" + undefined = "undefined" (real run, lesson 10.2). The Java version throws ArrayIndexOutOfBoundsException; the clean version returns early.`,
    `a[0] của mảng rỗng là undefined trong JS (không lỗi), vòng lặp không chạy, và khối bị chép sau vòng đẩy vào "" + undefined = "undefined" (lần chạy thật, bài 10.2). Bản Java ném ArrayIndexOutOfBoundsException; bản sạch trả về sớm.`),

  /* ══════════════ Chương 11 ══════════════ */
  Q(`Distribute Coins in Binary Tree: your helper returns "the number of moves inside my subtree" to its parent. Why does it get stuck?`,
    `Distribute Coins in Binary Tree: hàm phụ của bạn trả "số bước di chuyển trong cây con của tôi" cho cha. Vì sao nó bế tắc?`,
    [['Moves can be negative.', 'Số bước có thể âm.'],
     ['The recursion is too deep.', 'Đệ quy quá sâu.'],
     ['It needs dynamic programming.', 'Nó cần quy hoạch động.'],
     ['The parent needs the subtree excess, not moves.', 'Cha cần phần dư của cây con, không phải số bước.']],
    3,
    `What crosses the edge above a subtree is |coins − nodes| of that subtree, so that is what the parent needs; accumulate the moves in an outer variable — on [0,0,0,0,0,0,7] the trace gives 16 moves (lesson 11.3). Same question as chapter 5: "what does the helper return to its parent?"`,
    `Thứ đi qua cạnh phía trên một cây con là |xu − số nút| của cây con đó, nên đó là thứ cha cần; cộng dồn số bước vào một biến bên ngoài — trên [0,0,0,0,0,0,7] vết chạy cho 16 bước (bài 11.3). Đúng câu hỏi của chương 5: "hàm phụ trả gì cho cha?"`),

  Q(`Majority Element follow-up: "a majority is no longer guaranteed". Boyer–Moore returns 3 for [1, 1, 2, 2, 3]. Correct fix?`,
    `Câu hỏi thêm của Majority Element: "không còn đảm bảo có phần tử chiếm đa số". Boyer–Moore trả 3 cho [1, 1, 2, 2, 3]. Cách sửa đúng?`,
    [['Initialise the candidate to −1.', 'Khởi đầu ứng viên bằng −1.'],
     ['Keep the vote, then count the candidate in a second pass.', 'Giữ phép bầu, rồi đếm ứng viên ở lượt thứ hai.'],
     ['Sort and return the middle element.', 'Sắp xếp rồi trả phần tử giữa.'],
     ['Use a heap of counts.', 'Dùng một heap các tần suất.']],
    1,
    `The vote always produces a candidate; it is the majority only IF one exists. A second O(n) pass with O(1) memory verifies it (real run, lesson 11.4). The middle element after sorting has the same problem — it exists whether or not it is a majority.`,
    `Phép bầu luôn cho ra một ứng viên; nó chỉ là đa số NẾU có đa số. Một lượt O(n) thứ hai với bộ nhớ O(1) sẽ kiểm (lần chạy thật, bài 11.4). Phần tử giữa sau khi sắp xếp có đúng vấn đề đó — nó luôn tồn tại dù có phải đa số hay không.`),

  Q(`Review ladder 1 · 3 · 7 · 14 days. LC 15 was first solved on 21 November and every review passes. Its last review before it graduates is on…`,
    `Thang ôn 1 · 3 · 7 · 14 ngày. LC 15 giải lần đầu ngày 21/11 và lần ôn nào cũng qua. Lần ôn cuối trước khi "tốt nghiệp" là ngày…`,
    [['5 December', '5/12'],
     ['28 November', '28/11'],
     ['16 December', '16/12'],
     ['21 December', '21/12']],
    2,
    `Each interval counts from the previous review: 22/11 (+1), 25/11 (+3), 2/12 (+7), 16/12 (+14) — the real run of the course's schedule script (lesson 11.1). 5 December is the common mistake of counting every interval from the first solve.`,
    `Mỗi khoảng tính từ lần ôn trước: 22/11 (+1), 25/11 (+3), 2/12 (+7), 16/12 (+14) — lần chạy thật của script lập lịch trong khoá (bài 11.1). 5/12 là lỗi hay gặp khi tính mọi khoảng từ lần giải đầu tiên.`),
];

export default {
  course: { slug: 'dsa-interview' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 7–11 (graphs, backtracking, DP, the interview itself)',
        'Kiểm tra tiến độ 3 — Chương 7–11 (đồ thị, quay lui, quy hoạch động, chính buổi phỏng vấn)',
      ),
      description: B(
        'The last third of Coding Interview Prep: graph representations, BFS/DFS, topological sort, Dijkstra, Bellman-Ford and union-find; the backtracking template, duplicates and pruning; dynamic programming states and transitions; online-assessment I/O, testing your own code, and lessons from the mock interviews. 24 multiple-choice questions plus 2 coding questions with a large generated test.',
        'Một phần ba cuối của khoá Coding Interview Prep: biểu diễn đồ thị, BFS/DFS, sắp xếp tô-pô, Dijkstra, Bellman-Ford và union-find; khuôn quay lui, đáp án trùng và cắt nhánh; trạng thái và bước chuyển của quy hoạch động; I/O của bài test online, tự test code của mình, và bài học từ các buổi phỏng vấn thử. 24 câu trắc nghiệm cùng 2 câu lập trình có ca kiểm cỡ lớn.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, 'Chapters 7–11', 'Chương 7–11'),
      questions: [
        ...questions,
        codeQ({
          points: 4,
          prompt: B(
            '<p><b>Q25 — Contamination on a sample tray (chapter 7).</b> ' + c('minutesToInfectAll(grid)') + ': 0 is an empty slot, 1 a clean sample, 2 a contaminated one. Every minute, each contaminated sample contaminates its clean neighbours (up, down, left, right). Return the minimum number of minutes until no clean sample is left, or <code>-1</code> if some sample is never reached. Do <b>not</b> modify the input grid.</p>' +
            '<p>This is Rotting Oranges — a multi-source BFS by levels (lesson 7.2). The large cases are 1000 × 1000 (10⁶ cells): a recursive flood fill overflows, and <code>queue.shift()</code> turns the BFS quadratic.</p>',
            '<p><b>Câu 25 — Nhiễm bẩn trên khay mẫu (chương 7).</b> ' + c('minutesToInfectAll(grid)') + ': 0 là ô trống, 1 là mẫu sạch, 2 là mẫu nhiễm. Mỗi phút, mỗi mẫu nhiễm làm nhiễm các mẫu sạch kề cạnh (trên, dưới, trái, phải). Trả về số phút ít nhất tới khi không còn mẫu sạch, hoặc <code>-1</code> nếu có mẫu không bao giờ bị chạm tới. <b>Không</b> được sửa lưới đầu vào.</p>' +
            '<p>Đây là Rotting Oranges — BFS nhiều nguồn theo tầng (bài 7.2). Ca lớn là 1000 × 1000 (10⁶ ô): loang đệ quy sẽ tràn stack, còn <code>queue.shift()</code> biến BFS thành bậc hai.</p>',
          ),
          starterCode: C1_STARTER,
          expectedOutput: "[[2,1,1],[1,1,0],[0,1,1]] -> 4\n[[2,1,1],[0,1,1],[1,0,1]] -> -1\n[[0,2]] -> 0\n[[2,1,1,1,1,1,2]] -> 3\n[[0,0],[0,0]] -> 0\n[[1]] -> -1\nlarge 1000x1000, one corner -> 1998\nlarge 1000x1000, ~2% sources -> 18",
          sampleSolution: C1_SOLUTION,
        }),
        codeQ({
          points: 4,
          prompt: B(
            '<p><b>Q26 — "Did you mean…?" for a course search (chapter 9).</b> ' + c('editDistance(a, b)') + ' returns the minimum number of single-character insertions, deletions and substitutions that turn <code>a</code> into <code>b</code> (Levenshtein distance; <code>kitten → sitting</code> is 3).</p>' +
            '<p>Say the state before coding: dp[i][j] is the answer for the first i characters of a and the first j of b. The large case is two strings of 3,000 characters — a bottom-up table is fine; keeping only two rows is better; a top-down memo keyed by the string <code>"i,j"</code> is the slow version chapter 9 measured.</p>',
            '<p><b>Câu 26 — "Có phải ý bạn là…?" cho ô tìm môn học (chương 9).</b> ' + c('editDistance(a, b)') + ' trả về số phép ít nhất — chèn, xoá, thay một ký tự — để biến <code>a</code> thành <code>b</code> (khoảng cách Levenshtein; <code>kitten → sitting</code> là 3).</p>' +
            '<p>Nói trạng thái trước khi code: dp[i][j] là đáp án cho i ký tự đầu của a và j ký tự đầu của b. Ca lớn là hai chuỗi 3.000 ký tự — bảng từ dưới lên là ổn; chỉ giữ hai hàng còn tốt hơn; memo từ trên xuống với khoá chuỗi <code>"i,j"</code> là đúng bản chậm mà chương 9 đã đo.</p>',
          ),
          starterCode: C2_STARTER,
          expectedOutput: "\"kitten\" -> \"sitting\" = 3\n\"horse\" -> \"ros\" = 3\n\"\" -> \"abc\" = 3\n\"abc\" -> \"\" = 3\n\"same\" -> \"same\" = 0\n\"intention\" -> \"execution\" = 5\n\"csd201\" -> \"csd210\" = 2\nlarge 3000 x 3000 -> 1573",
          sampleSolution: C2_SOLUTION,
        }),
      ],
    },
  ],
};
