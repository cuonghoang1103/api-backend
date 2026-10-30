/** MAD101 · Lab ch.5 — Recursion workshop: call counts, memoisation, Hanoi, lattice paths, balanced parentheses. */
import assert from 'node:assert/strict';
import { doiDau, KHOA, S, bi, tinh, jsDe, q, tn, ord, dat, bang1, mcNum } from './_md.mjs';

const f2 = (x) => String(x);
const NS = [5, 8, 10, 15, 20];
const W1 = tinh({
  tieuDe: 'Recursion lab 1 — Cost of naive recursion',
  doKho: 'EASY', phut: 12,
  moTa: bi('<p>The naive recursive Fibonacci recomputes the same sub-problems. Calls C(n) = C(n−1) + C(n−2) + 1 with C(0) = C(1) = 1 (counting every call, including the first). A memoised version makes only 2n − 1 calls for n ≥ 1. Fill in both columns.</p>', '<p>Fibonacci đệ quy ngây thơ tính lại các bài toán con. Số lời gọi C(n) = C(n−1) + C(n−2) + 1 với C(0) = C(1) = 1 (đếm mọi lời gọi, kể cả lời gọi đầu). Bản có ghi nhớ chỉ gọi 2n − 1 lần với n ≥ 1. Điền cả hai cột.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Call counts', 'Số lời gọi'], [{ ma: 'n', ten: 'n' }, { ma: 'fib', ten: 'fib(n)' }, { ma: 'naive', ten: 'naive calls' }, { ma: 'memo', ten: 'memoised calls (2n − 1)' }],
    NS.map((n) => ({ o: { n: String(n) }, a: { fib: String(S.fib(n)), naive: String(S.fibCalls(n)), memo: String(2 * n - 1) } })),
    [NS.map((n) => `n=${n}: fib ${S.fib(n)}, naive ${S.fibCalls(n)}, memo ${2 * n - 1}`).join('; ') + '. naive calls = 2·fib(n+1) − 1.', NS.map((n) => `n=${n}: fib ${S.fib(n)}, naive ${S.fibCalls(n)}, memo ${2 * n - 1}`).join('; ') + '.'])],
  goiY: ['Build C(n) row by row from C(0) = C(1) = 1.', 'Fibonacci numbers: 0, 1, 1, 2, 3, 5, 8, 13, …; fib(5) = 5, fib(10) = 55.'],
  loiHayGap: ['Forgetting the +1 for the call itself.', 'Starting the Fibonacci sequence from fib(0) = 1.'],
  thuatNgu: [tn('memoisation', 'ghi nhớ kết quả')],
  khaiNiem: ['recursion cost'],
});
for (const n of NS) assert.equal(S.fibCalls(n), 2 * S.fib(n + 1) - 1);

function fibMemo(n) {
  var memo = {};
  function f(k) {
    if (k < 2) return k;
    if (memo[k] !== undefined) return memo[k];
    memo[k] = f(k - 1) + f(k - 2);
    return memo[k];
  }
  return f(n);
}
const W2 = jsDe({
  tieuDe: 'Recursion lab 2 — Memoised Fibonacci',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>Write <code>fibMemo(n)</code> using recursion plus a cache so that each Fibonacci number is computed once. fib(0) = 0, fib(1) = 1. The tests call it with n up to 70 (a naive recursion would need centuries).</p>', '<p>Viết <code>fibMemo(n)</code> dùng đệ quy cộng bộ nhớ đệm để mỗi số Fibonacci chỉ tính một lần. fib(0) = 0, fib(1) = 1. Test gọi n tới 70 (đệ quy ngây thơ cần hàng thế kỷ).</p>'),
  yeuCau: [bi('Answers up to fib(70) = 190392490709135 are exact in a JavaScript number.', 'Đáp án đến fib(70) = 190392490709135 là chính xác trong số JavaScript.')],
  viDu: [{ input: 'fibMemo(10)', output: '55', explanation: '0 1 1 2 3 5 8 13 21 34 55.|||0 1 1 2 3 5 8 13 21 34 55.' }],
  goiY: ['Check the cache before recursing; store the result before returning.', 'Base cases: n < 2 returns n.'],
  loiHayGap: ['Creating a fresh cache inside the recursive function (no sharing across calls).', 'Writing the cache lookup as if (memo[k]) — wrong when the value could be 0.'],
  giaiThich: '<p>With a cache the call tree collapses to a path: linear time. This is the simplest instance of dynamic programming.</p>',
  khaiNiem: ['memoisation'],
  fn: 'fibMemo',
  dau: 'function fibMemo(n) {\n  return 0;\n}\n',
  giaiMa: dat(fibMemo, 'fibMemo'),
  ref: fibMemo,
  cases: [{ args: [0] }, { args: [1] }, { args: [10] }, { args: [30] }, { args: [70], an: true }, { args: [50], an: true }],
});

function hanoi(n, from, to, via) {
  var moves = [];
  function go(k, a, b, c) {
    if (k === 0) return;
    go(k - 1, a, c, b);
    moves.push([a, b]);
    go(k - 1, c, b, a);
  }
  go(n, from, to, via);
  return moves;
}
const W3 = jsDe({
  tieuDe: 'Recursion lab 3 — Generate the Tower of Hanoi moves',
  doKho: 'HARD', phut: 20,
  moTa: bi('<p>Write <code>hanoi(n, from, to, via)</code> returning the list of moves, each move being <code>[source, destination]</code>, that transfers n discs from peg <code>from</code> to peg <code>to</code> using the spare peg <code>via</code> (pegs are strings, e.g. "A", "B", "C"). Use the classic recursion: move n−1 discs to the spare peg, move the largest disc, move the n−1 discs on top of it. The list has exactly 2ⁿ − 1 moves, and the order matters.</p>', '<p>Viết <code>hanoi(n, from, to, via)</code> trả danh sách các bước chuyển, mỗi bước là <code>[nguồn, đích]</code>, chuyển n đĩa từ cọc <code>from</code> sang cọc <code>to</code> dùng cọc phụ <code>via</code> (cọc là chuỗi, ví dụ "A", "B", "C"). Dùng đệ quy cổ điển: chuyển n−1 đĩa sang cọc phụ, chuyển đĩa lớn nhất, chuyển n−1 đĩa lên trên nó. Danh sách có đúng 2ⁿ − 1 bước và thứ tự quan trọng.</p>'),
  yeuCau: [bi('n = 0 gives an empty list.', 'n = 0 cho danh sách rỗng.')],
  viDu: [{ input: 'hanoi(2,"A","C","B")', output: JSON.stringify(hanoi(2, 'A', 'C', 'B')), explanation: 'Small disc to B, large disc to C, small disc onto C.|||Đĩa nhỏ sang B, đĩa lớn sang C, đĩa nhỏ lên C.' }],
  goiY: ['Use an inner recursive helper that pushes to a shared array.', 'The roles of the pegs swap in the two recursive calls.'],
  loiHayGap: ['Swapping the roles incorrectly in the second recursive call.', 'Returning the count instead of the list of moves.'],
  giaiThich: '<p>T(n) = 2T(n−1) + 1 ⇒ T(n) = 2ⁿ − 1. The recursion is a direct translation of the inductive proof that the puzzle is solvable.</p>',
  khaiNiem: ['recursion', 'Hanoi'],
  fn: 'hanoi',
  dau: 'function hanoi(n, from, to, via) {\n  return [];\n}\n',
  giaiMa: dat(hanoi, 'hanoi'),
  ref: hanoi,
  cases: [{ args: [1, 'A', 'C', 'B'] }, { args: [2, 'A', 'C', 'B'] }, { args: [3, 'A', 'C', 'B'] }, { args: [0, 'A', 'C', 'B'], an: true }, { args: [4, 'X', 'Z', 'Y'], an: true }, { args: [6, 'A', 'B', 'C'], an: true }],
});

function latticePaths(grid) {
  var rows = grid.length, cols = grid[0].length, w = [], i, j;
  for (i = 0; i < rows; i++) { w.push([]); for (j = 0; j < cols; j++) w[i].push(0); }
  if (grid[0][0] === 1) return 0;
  w[0][0] = 1;
  for (i = 0; i < rows; i++) for (j = 0; j < cols; j++) {
    if (grid[i][j] === 1) { w[i][j] = 0; continue; }
    if (i === 0 && j === 0) continue;
    w[i][j] = (i > 0 ? w[i - 1][j] : 0) + (j > 0 ? w[i][j - 1] : 0);
  }
  return w[rows - 1][cols - 1];
}
const W4 = jsDe({
  tieuDe: 'Recursion lab 4 — Lattice paths with obstacles',
  doKho: 'MEDIUM', phut: 18,
  moTa: bi('<p>A robot starts at the top-left cell of a grid and may only move right or down. Cells with value 1 are blocked. Write <code>latticePaths(grid)</code> returning the number of different paths to the bottom-right cell (0 if the start or the goal is blocked). Without obstacles the answer is the binomial coefficient C(r + c − 2, r − 1).</p>', '<p>Robot xuất phát từ ô trên-trái của lưới và chỉ đi sang phải hoặc xuống. Ô có giá trị 1 bị chặn. Viết <code>latticePaths(grid)</code> trả số đường đi khác nhau tới ô dưới-phải (0 nếu ô đầu hoặc ô cuối bị chặn). Khi không có chướng ngại, đáp án là hệ số nhị thức C(r + c − 2, r − 1).</p>'),
  yeuCau: [bi('The grid has at most 15×15 cells.', 'Lưới có tối đa 15×15 ô.')],
  viDu: [{ input: 'latticePaths([[0,0,0],[0,1,0],[0,0,0]])', output: String(latticePaths([[0, 0, 0], [0, 1, 0], [0, 0, 0]])), explanation: 'The centre is blocked: only the two border paths remain.|||Ô giữa bị chặn: chỉ còn hai đường theo mép.' }],
  goiY: ['paths(i,j) = paths(i−1,j) + paths(i,j−1) for free cells; blocked cells contribute 0.', 'Fill row by row so the neighbours are ready.'],
  loiHayGap: ['Not zeroing blocked cells.', 'Forgetting that a blocked start gives 0 paths.'],
  giaiThich: '<p>The last move into a cell is from above or from the left, disjoint cases ⇒ the sum rule; blocked cells contribute zero.</p>',
  khaiNiem: ['dynamic programming', 'counting paths'],
  fn: 'latticePaths',
  dau: 'function latticePaths(grid) {\n  return 0;\n}\n',
  giaiMa: dat(latticePaths, 'latticePaths'),
  ref: latticePaths,
  cases: [{ args: [[[0, 0, 0], [0, 1, 0], [0, 0, 0]]] }, { args: [[[0, 0], [0, 0]]] }, { args: [[[1, 0], [0, 0]]] }, { args: [[[0, 1], [1, 0]]], an: true }, { args: [Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 0))], an: true }, { args: [[[0, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0]]], an: true }],
});
assert.equal(latticePaths(Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 0))), S.nCr(18, 9));

function balancedParens(n) {
  var out = [];
  function go(s, open, close) {
    if (s.length === 2 * n) { out.push(s); return; }
    if (open < n) go(s + '(', open + 1, close);
    if (close < open) go(s + ')', open, close + 1);
  }
  go('', 0, 0);
  return out;
}
const W5 = jsDe({
  tieuDe: 'Recursion lab 5 — Generate balanced parentheses',
  doKho: 'HARD', phut: 22,
  moTa: bi('<p>Write <code>balancedParens(n)</code> returning every string of n pairs of parentheses that is balanced (every prefix has at least as many "(" as ")", and the totals are equal). List them in alphabetical order, where "(" comes before ")". The count is the Catalan number C(2n, n)/(n + 1): 1, 1, 2, 5, 14, 42, …</p>', '<p>Viết <code>balancedParens(n)</code> trả mọi xâu gồm n cặp ngoặc cân bằng (mọi tiền tố có số "(" không ít hơn số ")" và tổng hai loại bằng nhau). Liệt kê theo thứ tự từ điển, "(" đứng trước ")". Số lượng là số Catalan C(2n, n)/(n + 1): 1, 1, 2, 5, 14, 42, …</p>'),
  yeuCau: [bi('n = 0 returns [""].', 'n = 0 trả [""].')],
  viDu: [{ input: 'balancedParens(2)', output: JSON.stringify(balancedParens(2)), explanation: 'Two strings, C(4,2)/3 = 2.|||Hai xâu, C(4,2)/3 = 2.' }, { input: 'balancedParens(3).length', output: '5', explanation: 'The fifth Catalan number is 5.|||Số Catalan thứ ba là 5.' }],
  goiY: ['Track how many "(" and ")" have been placed; add "(" while open < n, add ")" while close < open.', 'Trying "(" first yields alphabetical order automatically.'],
  loiHayGap: ['Allowing a ")" when there is no unmatched "(" (the string becomes invalid).', 'Generating all 2^(2n) strings and filtering — works but is far too slow for n = 10.'],
  giaiThich: '<p>Each valid string is a path from (0,0) that never goes below the diagonal; the recursion enumerates exactly those paths — Catalan many.</p>',
  khaiNiem: ['recursion', 'Catalan numbers'],
  fn: 'balancedParens',
  dau: 'function balancedParens(n) {\n  return [];\n}\n',
  giaiMa: dat(balancedParens, 'balancedParens'),
  ref: balancedParens,
  cases: [{ args: [0] }, { args: [1] }, { args: [2] }, { args: [3] }, { args: [4], an: true }, { args: [9], an: true }],
});
assert.equal(balancedParens(5).length, S.catalan(5));

const W6 = tinh({
  tieuDe: 'Recursion lab 6 — Recursion vs iteration: which statements are true?',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Concept check linking recursive definitions, code and induction.</p>', '<p>Kiểm tra khái niệm nối định nghĩa đệ quy, mã và quy nạp.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['A recursive function with no base case …', 'Hàm đệ quy không có trường hợp cơ sở …'], ['never terminates (stack overflow)', 'runs in O(1)', 'terminates after n calls', 'is always iterative'], ['Without the basis there is nothing to stop the chain of calls.', 'Không có cơ sở thì không gì dừng chuỗi lời gọi.']),
    q('c2', ['Proving that a recursive function returns the right value is naturally done by …', 'Chứng minh hàm đệ quy trả giá trị đúng tự nhiên bằng …'], ['induction on the argument', 'contradiction on the output', 'truth tables', 'Venn diagrams'], ['The recursive call is the inductive hypothesis.', 'Lời gọi đệ quy chính là giả thiết quy nạp.']),
    mcNum('c3', ['f(n) = 3f(n−1) − 2, f(0) = 5. What is f(4)?', 'f(n) = 3f(n−1) − 2, f(0) = 5. f(4) bằng?'], S.recurrence([3], [5], 4, () => -2), [S.recurrence([3], [5], 3, () => -2), 5 * 81, 3 * 4 - 2], f2, [`f: 5, 13, 37, 109, 325 ⇒ f(4) = ${S.recurrence([3], [5], 4, () => -2)}.`, `f: 5, 13, 37, 109, 325 ⇒ f(4) = ${S.recurrence([3], [5], 4, () => -2)}.`]),
    mcNum('c4', ['The Ackermann function A(2, 3) (A(0,n) = n+1; A(m,0) = A(m−1,1); A(m,n) = A(m−1, A(m,n−1))) equals …', 'Hàm Ackermann A(2, 3) (A(0,n) = n+1; A(m,0) = A(m−1,1); A(m,n) = A(m−1, A(m,n−1))) bằng …'], S.ackermann(2, 3), [S.ackermann(2, 2), S.ackermann(1, 3), 2 ** 3], f2, ['A(1, n) = n + 2 and A(2, n) = 2n + 3, so A(2, 3) = 9.', 'A(1, n) = n + 2 và A(2, n) = 2n + 3 nên A(2, 3) = 9.']),
    q('c5', ['Which problems have a natural recursive structure?', 'Bài toán nào có cấu trúc đệ quy tự nhiên?'], ['Tree traversal, Hanoi, merge sort', 'Adding two numbers', 'Printing a constant', 'Reading one array element'], ['Each can be reduced to smaller copies of itself.', 'Mỗi bài có thể quy về các bản nhỏ hơn của chính nó.']),
    q('c6', ['Tail recursion can be replaced by …', 'Đệ quy đuôi có thể thay bằng …'], ['a loop', 'a truth table', 'a set', 'induction'], ['The call is the last action, so the frame can be reused.', 'Lời gọi là hành động cuối nên có thể tái dùng khung.']),
  ],
  goiY: ['Compute small values first; then look for patterns or closed forms.', 'Ackermann grows extremely fast; evaluate by unfolding small m first.'],
  loiHayGap: ['Skipping the base case.', 'Confusing the order of arguments in A(m, n).'],
  thuatNgu: [tn('tail recursion', 'đệ quy đuôi')],
  khaiNiem: ['recursion'],
});
void ord;

export default doiDau({
  slug: 'mad101-5-lab-recursion-workshop',
  ten: '5.L Lab: recursion workshop',
  khoa: KHOA,
  baiHoc: 'mad101-5-1-quy-nap',
  de: [W1, W2, W3, W4, W5, W6],
});
