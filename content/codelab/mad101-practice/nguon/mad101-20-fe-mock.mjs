/** MAD101 · Luyện FE — hai đề thi thử (20 câu) theo dạng FE trắc nghiệm của trường. KHÔNG chép đề thật; số liệu tính bằng mã. */
import assert from 'node:assert/strict';
import { doiDau, KHOA, S, bi, tinh, q, tn, mcNum, V, N, A, O, I, Q, X } from './_md.mjs';

const T = (a, b) => [a, b];
const f2 = (x) => String(x);
const p = V('p'), qv = V('q'), r = V('r');
const trues = (f) => S.column(f).filter((x) => x === 'T').length;

/* ───────── Đề A ───────── */
const CA = [
  q('a1', T('The contrapositive of “If the server is down then the site is unreachable” is …', 'Mệnh đề phản đảo của “Nếu máy chủ hỏng thì trang không truy cập được” là …'), ['If the site is reachable then the server is not down.', 'If the site is unreachable then the server is down.', 'If the server is not down then the site is reachable.', 'The server is down and the site is reachable.'], T('¬q → ¬p.', '¬q → ¬p.')),
  q('a2', T('¬(p ∨ ¬q) is equivalent to …', '¬(p ∨ ¬q) tương đương với …'), ['¬p ∧ q', '¬p ∨ q', 'p ∧ ¬q', 'p ∨ ¬q'], T('De Morgan then double negation.', 'De Morgan rồi phủ định kép.')),
  q('a3', T('The negation of “every student passed the quiz” is …', 'Phủ định của “mọi sinh viên đều qua bài kiểm tra” là …'), ['some student did not pass the quiz', 'no student passed the quiz', 'every student failed the quiz', 'some student passed the quiz'], T('¬∀x P(x) ≡ ∃x ¬P(x).', '¬∀x P(x) ≡ ∃x ¬P(x).')),
  q('a4', T('A set with 6 elements has … subsets.', 'Tập 6 phần tử có … tập con.'), ['64', '36', '12', '720'], T('2⁶ = 64.', '2⁶ = 64.')),
  q('a5', T('A function f: A → B is onto if …', 'Hàm f: A → B là toàn ánh nếu …'), ['every element of B is the image of an element of A', 'different inputs give different outputs', 'f has an inverse only', 'A and B have the same number of elements'], T('Range = codomain.', 'Tập ảnh = miền đích.')),
  q('a6', T('3n² + n log n + 10 is …', '3n² + n log n + 10 là …'), ['O(n²)', 'O(n log n)', 'O(n)', 'O(2ⁿ) only'], T('The n² term dominates.', 'Số hạng n² trội hơn.')),
  q('a7', T('Two integers are relatively prime if …', 'Hai số nguyên nguyên tố cùng nhau nếu …'), ['their gcd is 1', 'both are prime', 'their lcm is 1', 'one divides the other'], T('gcd(a, b) = 1.', 'gcd(a, b) = 1.')),
  q('a8', T('The basis step of an induction proof of ∀n ≥ 1 P(n) verifies …', 'Bước cơ sở của chứng minh quy nạp ∀n ≥ 1 P(n) kiểm tra …'), ['P(1)', 'P(k) → P(k+1)', 'P(n) for all n', 'P(0) only'], T('The first case of the claim.', 'Trường hợp đầu của khẳng định.')),
  q('a9', T('Choosing a 3-person committee from 10 people (order irrelevant) uses …', 'Chọn uỷ ban 3 người từ 10 người (không kể thứ tự) dùng …'), ['C(10, 3)', 'P(10, 3)', '10³', '3¹⁰'], T('Unordered selection without repetition.', 'Chọn không thứ tự, không lặp.')),
  q('a10', T('A tree with 15 vertices has … edges.', 'Cây có 15 đỉnh có … cạnh.'), ['14', '15', '16', '30'], T('n − 1.', 'n − 1.')),
];
const fA = I(A(p, qv), O(r, N(p)));
const A11 = trues(fA), A12 = S.incExc3(60, 45, 40, 20, 18, 15, 8), A13 = Math.floor(-7.5) + Math.ceil(3.2), A14 = S.modPow(7, 222, 11), A15 = S.modInverse(5, 12);
const A16 = S.recurrence([2], [1], 6, () => 3), A17 = S.nCr(8, 3) * S.nCr(6, 2), DJ = [['A', 'B', 4], ['A', 'C', 2], ['B', 'C', 1], ['B', 'D', 5], ['C', 'D', 8], ['C', 'E', 10], ['D', 'E', 2], ['D', 'F', 6], ['E', 'F', 3]];
const A18 = S.dijkstra(DJ, 'A').dist.F, A19 = S.kruskal(DJ, ['A', 'B', 'C', 'D', 'E', 'F']).weight, A20 = (3 + 3 + 2 + 2 + 2 + 2 + 2) / 2;
assert.equal(A16, 2 ** 6 * 4 - 3 + 0 || A16);
CA.push(
  mcNum('a11', T(`How many rows of the truth table of ${'(p ∧ q) → (r ∨ ¬p)'} are TRUE (out of 8)?`, 'Bảng chân trị của (p ∧ q) → (r ∨ ¬p) có bao nhiêu dòng ĐÚNG (trong 8 dòng)?'), A11, [A11 - 1, 4, 8], f2, T(`Only p = q = T, r = F makes it false: ${A11} true rows.`, `Chỉ p = q = T, r = F làm nó sai: ${A11} dòng đúng.`)),
  mcNum('a12', T('|A| = 60, |B| = 45, |C| = 40, |A∩B| = 20, |A∩C| = 18, |B∩C| = 15, |A∩B∩C| = 8. Then |A ∪ B ∪ C| = …', '|A| = 60, |B| = 45, |C| = 40, |A∩B| = 20, |A∩C| = 18, |B∩C| = 15, |A∩B∩C| = 8. Khi đó |A ∪ B ∪ C| = …'), A12, [145, A12 - 8, A12 + 8], f2, T(`145 − 53 + 8 = ${A12}.`, `145 − 53 + 8 = ${A12}.`)),
  mcNum('a13', T('⌊−7.5⌋ + ⌈3.2⌉ = …', '⌊−7,5⌋ + ⌈3,2⌉ = …'), A13, [-3, -5, -12], f2, T(`⌊−7.5⌋ = −8, ⌈3.2⌉ = 4 ⇒ ${A13}.`, `⌊−7,5⌋ = −8, ⌈3,2⌉ = 4 ⇒ ${A13}.`)),
  mcNum('a14', T('7²²² mod 11 = …', '7²²² mod 11 = …'), A14, [1, 7, 4], f2, T('7¹⁰ ≡ 1 (mod 11) and 222 ≡ 2 (mod 10): 7² = 49 ≡ 5.', '7¹⁰ ≡ 1 (mod 11) và 222 ≡ 2 (mod 10): 49 ≡ 5.')),
  mcNum('a15', T('The inverse of 5 modulo 12 is …', 'Nghịch đảo của 5 theo mô-đun 12 là …'), A15, [7, 1, 11].map((x) => (x === A15 ? 3 : x)), f2, T(`5·${A15} = ${5 * A15} ≡ 1 (mod 12).`, `5·${A15} = ${5 * A15} ≡ 1 (mod 12).`)),
  mcNum('a16', T('a₀ = 1 and aₙ = 2aₙ₋₁ + 3. Then a₆ = …', 'a₀ = 1 và aₙ = 2aₙ₋₁ + 3. Khi đó a₆ = …'), A16, [A16 - 3, 2 ** 6 + 3, 2 ** 7], f2, T(`Sequence: 1, 5, 13, 29, 61, 125, ${A16}.`, `Dãy: 1, 5, 13, 29, 61, 125, ${A16}.`)),
  mcNum('a17', T('A team of 5 is chosen from 8 programmers and 6 testers with exactly 3 programmers. Number of teams: …', 'Chọn đội 5 người từ 8 lập trình viên và 6 tester với đúng 3 lập trình viên. Số đội: …'), A17, [S.nCr(14, 5), S.nCr(8, 3) + S.nCr(6, 2), S.nPr(8, 3) * S.nPr(6, 2)], f2, T(`C(8,3)·C(6,2) = 56·15 = ${A17}.`, `C(8,3)·C(6,2) = 56·15 = ${A17}.`)),
  mcNum('a18', T('In the weighted graph AB4, AC2, BC1, BD5, CD8, CE10, DE2, DF6, EF3, the shortest distance from A to F is …', 'Trong đồ thị có trọng số AB4, AC2, BC1, BD5, CD8, CE10, DE2, DF6, EF3, khoảng cách ngắn nhất từ A tới F là …'), A18, [A18 + 2, A18 - 2, 16], f2, T(`A–C–B–D–E–F = 2+1+5+2+3 = ${A18}.`, `A–C–B–D–E–F = ${A18}.`)),
  mcNum('a19', T('The same graph: the weight of a minimum spanning tree is …', 'Cùng đồ thị: trọng số cây khung nhỏ nhất là …'), A19, [A19 + 3, A19 - 2, 22], f2, T(`Kruskal: BC1, AC2, DE2, EF3, BD5 = ${A19}.`, `Kruskal: BC1, AC2, DE2, EF3, BD5 = ${A19}.`)),
  mcNum('a20', T('A graph has degrees 3, 3, 2, 2, 2, 2, 2. It has … edges.', 'Đồ thị có bậc 3, 3, 2, 2, 2, 2, 2. Nó có … cạnh.'), A20, [A20 * 2, 9, A20 - 1], f2, T('Handshake: sum 16, edges 8.', 'Bắt tay: tổng bậc 16, 8 cạnh.')),
);
assert.equal(A11, 7);

const DA = tinh({
  tieuDe: 'FE mock A — 20 questions across all chapters',
  doKho: 'HARD', phut: 40, diem: 40,
  moTa: bi('<p>A mock final exam in the style of a multiple-choice FE: 10 concept questions and 10 calculations covering logic, sets and functions, Big-O, number theory, induction and recurrences, counting, graphs and trees. Set a timer for 40 minutes; calculators are not needed.</p>', '<p>Đề thi thử theo kiểu FE trắc nghiệm: 10 câu khái niệm và 10 câu tính toán phủ logic, tập hợp và hàm, Big-O, số học, quy nạp và truy hồi, đếm, đồ thị và cây. Đặt đồng hồ 40 phút; không cần máy tính.</p>'),
  loai: 'choice',
  cauHoi: CA,
  goiY: ['Do the concept questions first (about 1 minute each), then the calculations.', 'Verify by substituting your answer back (modular inverse, recurrence terms).'],
  loiHayGap: ['Confusing the converse with the contrapositive.', 'Forgetting the triple-intersection term in inclusion–exclusion.'],
  thuatNgu: [tn('contrapositive', 'phản đảo'), tn('inclusion–exclusion', 'bao hàm–loại trừ')],
  khaiNiem: ['final exam practice'],
});

/* ───────── Đề B ───────── */
const CB = [
  q('b1', T('Which pair is logically equivalent?', 'Cặp nào tương đương logic?'), ['p → q and ¬q → ¬p', 'p → q and q → p', 'p → q and ¬p → ¬q', 'p ∧ q and p ∨ q'], T('Contrapositive.', 'Phản đảo.')),
  q('b2', T('From “p → q” and “¬q” we may conclude …', 'Từ “p → q” và “¬q” có thể kết luận …'), ['¬p', 'p', 'q', 'nothing'], T('Modus tollens.', 'Modus tollens.')),
  q('b3', T('A ⊕ B contains …', 'A ⊕ B chứa …'), ['elements in exactly one of A, B', 'elements in both A and B', 'all elements of A and none of B', 'elements that are in neither set'], T('Symmetric difference.', 'Hiệu đối xứng.')),
  q('b4', T('The composition (g∘f)(x) means …', 'Hàm hợp (g∘f)(x) nghĩa là …'), ['g(f(x))', 'f(g(x))', 'f(x)·g(x)', 'f(x) + g(x)'], T('Apply f first.', 'Áp f trước.')),
  q('b5', T('Which function grows fastest?', 'Hàm nào tăng nhanh nhất?'), ['2ⁿ', 'n¹⁰', 'n log n', '1000n'], T('Exponential beats polynomial.', 'Hàm mũ vượt đa thức.')),
  q('b6', T('If a ≡ b (mod m) then …', 'Nếu a ≡ b (mod m) thì …'), ['m | (a − b)', 'a = b', 'a | b', 'm | ab'], T('Definition of congruence.', 'Định nghĩa đồng dư.')),
  q('b7', T('Strong induction is useful when …', 'Quy nạp mạnh hữu ích khi …'), ['the step needs several earlier cases', 'the proof has no basis case at all', 'only the case n = 1 matters here', 'the claim is false for large n'], T('E.g. f(n) uses f(n−2) and f(n−3).', 'Vd f(n) dùng f(n−2) và f(n−3).')),
  q('b8', T('The pigeonhole principle guarantees …', 'Nguyên lý chuồng bồ câu đảm bảo …'), ['some box holds at least ⌈n/k⌉ objects', 'every box holds the same number of objects', 'no box is empty in the end', 'a box with exactly one object'], T('n objects in k boxes.', 'n vật vào k hộp.')),
  q('b9', T('A graph has an Euler circuit if and only if it is connected and …', 'Đồ thị có chu trình Euler khi và chỉ khi liên thông và …'), ['every vertex has even degree', 'every vertex has odd degree', 'it is bipartite', 'it has a cycle'], T('Euler’s theorem.', 'Định lý Euler.')),
  q('b10', T('Kruskal’s algorithm builds a minimum spanning tree by …', 'Thuật toán Kruskal xây cây khung nhỏ nhất bằng cách …'), ['adding the cheapest edge that does not create a cycle', 'adding the cheapest edge leaving the current vertex set', 'removing the heaviest edge of the graph once', 'running BFS from one vertex and keeping its tree edges'], T('Sort edges, skip cycle-making ones.', 'Sắp cạnh, bỏ cạnh tạo chu trình.')),
];
const fB = Q(I(p, qv), O(N(p), qv)), fB2 = A(O(p, qv), N(A(p, qv)));
const B11 = trues(fB2), B12 = (2 ** 7) - 2, B13 = S.gcd(1071, 462), B14 = S.crt([2, 3, 2], [3, 5, 7]), B15 = S.factor(360).reduce((a, [, e]) => a * (e + 1), 1);
const B16 = S.fib(12), B17 = S.nCr(10, 3) * S.factorial(3) / S.factorial(3), B18 = S.bfsOrder([['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D'], ['D', 'E']], 'A').indexOf('E') + 1, B19 = S.huffman({ a: 5, b: 9, c: 12, d: 13, e: 16, f: 45 }).cost, B20 = S.fullTree(3, 7).leaves;
assert.equal(S.classify(fB), 'tautology');
CB.push(
  mcNum('b11', T('How many of the 4 rows of the truth table of (p ∨ q) ∧ ¬(p ∧ q) are TRUE?', 'Bảng chân trị 4 dòng của (p ∨ q) ∧ ¬(p ∧ q) có bao nhiêu dòng ĐÚNG?'), B11, [1, 3, 4], f2, T('It is exclusive or: exactly 2 rows.', 'Đó là hoặc loại trừ: đúng 2 dòng.')),
  mcNum('b12', T('How many non-empty proper subsets does a 7-element set have?', 'Tập 7 phần tử có bao nhiêu tập con khác rỗng và khác chính nó?'), B12, [2 ** 7, 2 ** 7 - 1, 7 * 6], f2, T('2⁷ − 2 = 126.', '2⁷ − 2 = 126.')),
  mcNum('b13', T('gcd(1071, 462) = …', 'gcd(1071, 462) = …'), B13, [3, 7, 42], f2, T('1071 = 2·462 + 147; 462 = 3·147 + 21; 147 = 7·21 ⇒ 21.', '1071 = 2·462 + 147; 462 = 3·147 + 21; 147 = 7·21 ⇒ 21.')),
  mcNum('b14', T('The smallest positive x with x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7) is …', 'x dương nhỏ nhất với x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7) là …'), B14, [8, 37, 128], f2, T('The classic Sun Tzu answer 23.', 'Đáp án cổ điển của Tôn Tử: 23.')),
  mcNum('b15', T('The number of positive divisors of 360 is …', 'Số ước nguyên dương của 360 là …'), B15, [18, 12, 30], f2, T('360 = 2³·3²·5 ⇒ 4·3·2 = 24.', '360 = 2³·3²·5 ⇒ 4·3·2 = 24.')),
  mcNum('b16', T('The 12th Fibonacci number (F₁ = F₂ = 1) is …', 'Số Fibonacci thứ 12 (F₁ = F₂ = 1) là …'), B16, [89, 233, 143], f2, T('1 1 2 3 5 8 13 21 34 55 89 144.', '1 1 2 3 5 8 13 21 34 55 89 144.')),
  mcNum('b17', T('Number of ways to choose 3 books from 10 (order irrelevant): …', 'Số cách chọn 3 quyển từ 10 (không kể thứ tự): …'), B17, [S.nPr(10, 3), 10 ** 3, 30], f2, T('C(10, 3) = 120.', 'C(10, 3) = 120.')),
  mcNum('b18', T('BFS from A (neighbours in alphabetical order) on edges AB, AC, BD, CD, DE visits E as the … vertex.', 'BFS từ A (láng giềng theo thứ tự chữ cái) trên các cạnh AB, AC, BD, CD, DE thăm E là đỉnh thứ …'), B18, [3, 4, 6], f2, T('Order A, B, C, D, E.', 'Thứ tự A, B, C, D, E.')),
  mcNum('b19', T('Huffman coding of frequencies 5, 9, 12, 13, 16, 45 needs a total of … bits.', 'Mã Huffman cho tần số 5, 9, 12, 13, 16, 45 cần tổng cộng … bit.'), B19, [B19 + 6, 100 * 3, B19 - 2], f2, T('Merges 14, 25, 30, 55, 100 sum to 224.', 'Các lần gộp 14, 25, 30, 55, 100 cộng lại 224.')),
  mcNum('b20', T('A full ternary tree has 7 internal vertices. It has … leaves.', 'Cây tam phân đầy đủ có 7 đỉnh trong. Nó có … lá.'), B20, [21, 22, 8], f2, T('l = (m − 1)·i + 1 = 15.', 'l = (m − 1)·i + 1 = 15.')),
);
assert.equal(B13, 21); assert.equal(B19, 224); assert.equal(B20, 15); assert.equal(B11, 2);
void X;

const DB = tinh({
  tieuDe: 'FE mock B — 20 questions (more calculations)',
  doKho: 'HARD', phut: 40, diem: 40,
  moTa: bi('<p>A second mock final exam with the same layout but different numbers: equivalences and inference, sets, functions, congruences, the Chinese Remainder Theorem, divisor counts, Fibonacci, binomials, BFS, Huffman and m-ary trees.</p>', '<p>Đề thi thử thứ hai cùng bố cục nhưng số liệu khác: tương đương và suy luận, tập hợp, hàm, đồng dư, định lý số dư Trung Hoa, đếm ước, Fibonacci, nhị thức, BFS, Huffman và cây m-phân.</p>'),
  loai: 'choice',
  cauHoi: CB,
  goiY: ['Leave long calculations for a second pass.', 'Check units and special cases (empty set, n = 0) in the concept questions.'],
  loiHayGap: ['Counting all subsets when “proper non-empty” are asked.', 'Using ordered selections (permutations) for committees.'],
  thuatNgu: [tn('modus tollens', 'modus tollens'), tn('Huffman coding', 'mã hoá Huffman')],
  khaiNiem: ['final exam practice'],
});

export default doiDau({
  slug: 'mad101-20-fe-mock',
  ten: '20 FE practice: two mock final exams',
  khoa: KHOA,
  baiHoc: 'mad101-final-exam-fe',
  de: [DA, DB],
});
void q; void S;
