/**
 * build-csd201-pe49.mjs — sinh content/exams/CSD201-PE49.mjs.
 *
 * Nguồn thật: Đề 49 (Spring 2023, "SP23 PE"). Archive gốc CHỈ có paper.pdf,
 * KHÔNG có project NetBeans given nào — cùng dạng "given project cổ điển"
 * như PE37 (paper.pdf viết đúng văn phong "Open NetBeans, open the given Q1
 * project", có ví dụ before/after cho từng method).
 *
 * ⚠️⚠️ Q1 (MyList<Bike>, 4 điểm) và Q3.f1 (Graph DFS, 1 điểm) đã VERIFY
 * KHỚP 100% với đúng ví dụ before/after in trong paper.pdf (COMPILE + CHẠY
 * THẬT javac/java). NHƯNG Q2 (BSTree<Bike>) và Q3.f2 (Dijkstra) KHÔNG dùng
 * được số liệu gốc của đề — lý do:
 *   - Q2: đối chiếu ví dụ f2 (post-order, ngầm cho biết cấu trúc cây qua
 *     thuật toán dựng-cây-từ-preorder) với ví dụ f3/f4 (breadth-first, cùng
 *     11 nhãn/giá trị) cho ra HAI CẤU TRÚC CÂY KHÁC NHAU và MÂU THUẪN NHAU
 *     (cây từ f2 chỉ có 1 node-2-con, không đủ cho yêu cầu "node THỨ HAI
 *     có 2 con" của f3) — đây là mâu thuẫn nội tại trong chính đề gốc,
 *     không phải do đọc sai.
 *   - Q3.f2: đề chỉ cho 3 dòng kết quả THIẾU (chỉ "3 đỉnh cuối được chọn"
 *     + "đỉnh 1st/3rd/last của đường đi") chứ KHÔNG cho đủ ma trận trọng số
 *     gốc hay đường đi đầy đủ — không đủ dữ kiện để dựng lại DUY NHẤT đúng
 *     ma trận trọng số gốc.
 * → Q2 và Q3.f2 dùng dữ liệu TỰ THIẾT KẾ (giữ đúng ngữ nghĩa spec: Bike
 * brand/color/weight, weight là khoá duy nhất, skip 'A'; Graph 9 đỉnh A-I
 * cùng cấu trúc cạnh dùng cho Q3.f1), verify bằng COMPILE + CHẠY THẬT +
 * TÍNH TAY ĐỘC LẬP — không suy đoán mù, chỉ là không khớp số của chính đề.
 *
 * Given.zip: 3 project Q1/Q2/Q3, mỗi cái có class dữ liệu (Bike/Node hoặc
 * Graph, "DO NOT EDIT") + file method-cần-hoàn-thiện (blank, có main() để
 * tự test). Verify compile ĐỘC LẬP cả 3 project trước khi zip.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE49.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE49.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE49-Given.zip';
const SRC = '/tmp/csd201-pe49-final';

// Một trường song ngữ hay được ghép từ những mảnh mà bản thân mảnh đó ĐÃ là
// chuỗi song ngữ — hoặc nhét vào trong B() (`B(scenario + task_en, ...)`), hoặc
// nối ở ngoài (`prompt: SCENARIO + B(task_en, task_vi)`). Cả hai kiểu đều làm
// một trường mang 2-5 dấu "|||", trong khi pickLang() (frontend/src/lib/utils.ts)
// chỉ tách ở dấu ĐẦU TIÊN — hậu quả: người đọc bản tiếng Việt lãnh nguyên cả
// đoạn tiếng Anh, kèm dấu "|||" hiện ra màn hình.
//
// KHÔNG tách được bằng "tiền tố chung của hai vế": phần mở đầu của task tiếng
// Anh và tiếng Việt cũng trùng nhau ("Câu 1: addLast() - 1 " rồi mới mark/điểm)
// nên tách kiểu đó sẽ cắt cụt vế Anh. Nên B() ghi nhớ mọi chuỗi song ngữ chính
// nó đã tạo; gặp lại chuỗi đó ở bất kỳ đâu thì thay bằng đúng vế cần dùng —
// ranh giới biết chính xác, không phải suy đoán. __biNormalize() quét lần cuối
// toàn bộ spec trước khi ghi, bắt nốt kiểu nối ở ngoài B().
const __biReg = [];
const __biResolve = (s, side) => {
  let out = s;
  for (let guard = 0; guard < 40; guard++) {
    const hit = __biReg
      .filter((r) => out.includes(r))
      .sort((a, b) => b.length - a.length)[0];
    if (!hit) return out;
    const k = hit.indexOf('|||');
    out = out.split(hit).join(side === 'en' ? hit.slice(0, k) : hit.slice(k + 3));
  }
  throw new Error('B(): gỡ ||| lồng nhau không hội tụ');
};
const B = (en, vi) => {
  const out = `${__biResolve(en, 'en')}|||${__biResolve(vi, 'vi')}`;
  if ((out.match(/\|\|\|/g) || []).length !== 1) {
    throw new Error('B(): còn dấu ||| lồng nhau chưa gỡ được — kiểm tay chỗ gọi B()');
  }
  __biReg.push(out);
  return out;
};
const __biNormalize = (v) => {
  if (typeof v === 'string') {
    if ((v.match(/\|\|\|/g) || []).length <= 1) return v;
    const out = `${__biResolve(v, 'en')}|||${__biResolve(v, 'vi')}`;
    if ((out.match(/\|\|\|/g) || []).length !== 1) {
      throw new Error('__biNormalize(): trường vẫn còn ||| lồng nhau: ' + v.slice(0, 120));
    }
    return out;
  }
  if (Array.isArray(v)) return v.map(__biNormalize);
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, __biNormalize(x)]));
  }
  return v;
};
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (Spring 2023). Software: NetBeans IDE 8.x, Java JDK 1.8. Do not add new import statement(s) to given files. Avoid accented Vietnamese in comments.</p>
   <p>Download the given materials above — it contains 3 separate NetBeans projects: Q1 (MyList), Q2 (BSTree), Q3 (Graph). Only edit inside the marked "You should write here" sections. Do not change any method signature.</p>
   <p><b>Note:</b> "Do not pay attention to the real meaning of objects, variables and their values in the questions below" (as this paper itself states).</p>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (Spring 2023). Phần mềm: NetBeans IDE 8.x, Java JDK 1.8. Không thêm import mới vào file cho sẵn. Không dùng tiếng Việt có dấu trong comment.</p>
   <p>Tải given materials ở trên — gồm 3 project NetBeans riêng: Q1 (MyList), Q2 (BSTree), Q3 (Graph). Chỉ sửa trong phần đánh dấu "You should write here". Không đổi chữ ký method.</p>
   <p><b>Lưu ý:</b> "Không cần để ý ý nghĩa thật của đối tượng/biến/giá trị trong các câu dưới đây" (đề gốc tự ghi vậy).</p>`,
);

const q2DataNote = B(
  `<p><b>Note on this question:</b> this deck's own paper.pdf gives worked examples for f2 (post-order) and f3/f4 (breadth-first) on "the same" 11 Bikes, but the tree structure implied by f2's example and the tree structure implied by f3/f4's example are mutually inconsistent (cross-checked: f2's implied tree has only one node with 2 children, but f3 requires finding a "second" such node — impossible in that tree). Since the original paper's own numbers can't be reconciled, this question uses a smaller, self-consistent 8-Bike dataset instead — verified by actually compiling and running a full reference solution, with every result independently hand-computed first. The method requirements and semantics (Bike brand/color/weight, weight as the unique BST key, skip brand starting with 'A') are unchanged from the original paper.</p>`,
  `<p><b>Lưu ý về câu này:</b> paper.pdf gốc của đề này cho ví dụ minh hoạ cho f2 (post-order) và f3/f4 (breadth-first) trên "cùng" 11 Bike, nhưng cấu trúc cây ngầm suy ra từ ví dụ f2 và cấu trúc cây ngầm suy ra từ ví dụ f3/f4 MÂU THUẪN NHAU (đã đối chiếu: cây suy từ f2 chỉ có 1 node có 2 con, nhưng f3 lại yêu cầu tìm node "thứ hai" như vậy — không thể xảy ra trong cây đó). Vì số liệu gốc của đề không thể dung hoà được, câu này dùng bộ dữ liệu 8 Bike nhỏ hơn, tự thiết kế và tự nhất quán — đã xác nhận bằng cách biên dịch và chạy thật lời giải tham chiếu đầy đủ, mọi kết quả đã tính tay độc lập trước. Yêu cầu và ngữ nghĩa method (Bike brand/color/weight, weight là khoá BST duy nhất, skip brand bắt đầu bằng 'A') giữ nguyên như đề gốc.</p>`,
);

const q3f2DataNote = B(
  `<p><b>Note on this question:</b> the original paper does not give the full weighted adjacency matrix — only 3 partial result lines (last 3 vertices selected, 1st/3rd/last of one path, and the other full path) — not enough information to uniquely reconstruct the original weighted graph. This question reuses the same 9-vertex graph structure as f1 (see that question), with self-chosen edge weights, verified by compiling and running a full reference solution (Dijkstra's algorithm), with every result independently hand-computed first.</p>`,
  `<p><b>Lưu ý về câu này:</b> đề gốc không cho đủ ma trận trọng số đầy đủ — chỉ cho 3 dòng kết quả cục bộ (3 đỉnh cuối được chọn, đỉnh 1st/3rd/last của 1 đường đi, và đường đi đầy đủ của cặp còn lại) — không đủ dữ kiện để dựng lại DUY NHẤT đúng đồ thị trọng số gốc. Câu này dùng lại đúng cấu trúc đồ thị 9 đỉnh của f1 (xem câu đó), tự chọn trọng số cạnh, đã xác nhận bằng cách biên dịch và chạy thật lời giải tham chiếu đầy đủ (thuật toán Dijkstra), mọi kết quả đã tính tay độc lập trước.</p>`,
);

const myListGiven = fs.readFileSync(path.join(SRC, 'MyList.given.java'), 'utf8');
const myListSolved = fs.readFileSync(path.join(SRC, 'MyList.solved.java'), 'utf8');
const bstGiven = fs.readFileSync(path.join(SRC, 'BSTree.given.java'), 'utf8');
const bstSolved = fs.readFileSync(path.join(SRC, 'BSTree.solved.java'), 'utf8');
const graphGiven = fs.readFileSync(path.join(SRC, 'Graph.given.java'), 'utf8');
const graphSolved = fs.readFileSync(path.join(SRC, 'Graph.solved.java'), 'utf8');

const scenarioQ1 = B(
  `<p><strong>Scenario:</strong> the class Bike with 3 data members (brand, color, weight) is provided, unedited. The MyList class is a linked list of Bike objects. Each of the 4 methods below is graded independently against its own worked example.</p>`,
  `<p><strong>Bối cảnh:</strong> lớp Bike với 3 thành viên dữ liệu (brand, color, weight) cho sẵn, không sửa. Lớp MyList là danh sách liên kết các đối tượng Bike. Mỗi trong 4 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ.</p>`,
);

const q1_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ1 + `<p><strong>addLast() – 1 mark</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: <code>addLast(String xBrand, int xColor, int xWeight)</code></li><li>Task: check if xBrand.charAt(0)=='B' then do nothing, otherwise add a new node with brand=xBrand, color=xColor, weight=xWeight to the end of the list. (color and weight can get arbitrary, even negative values.)</li></ul>`,
    scenarioQ1 + `<p><strong>addLast() – 1 điểm</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: <code>addLast(String xBrand, int xColor, int xWeight)</code></li><li>Nhiệm vụ: kiểm tra nếu xBrand.charAt(0)=='B' thì không làm gì; ngược lại thêm node mới brand=xBrand, color=xColor, weight=xWeight vào CUỐI danh sách. (color và weight có thể nhận giá trị bất kỳ, kể cả âm.)</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(A,9,8) (C,6,5) (D,2,4) (E,7,9) (F,4,-7) (G,-3,2)`,
  explanation: B(
    `<p>Verified by compiling and running — matches this paper's own worked example exactly. Candidate "B" (brand starts with 'B') is correctly skipped; every other candidate is appended in order.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy — khớp đúng ví dụ minh hoạ của đề. Candidate "B" (brand bắt đầu bằng 'B') bị bỏ qua đúng; mọi candidate khác được nối vào cuối theo đúng thứ tự.</p>`,
  ),
  rubric: [
    { id: 'brand_filter', criterion: B("Correctly does nothing when xBrand.charAt(0) == 'B'.", "Không làm gì đúng khi xBrand.charAt(0) == 'B'."), weight: 1, maxScore: 0.4 },
    { id: 'append', criterion: B('Correctly appends the new node at the end of the list, handling both empty and non-empty list cases.', 'Nối đúng node mới vào cuối danh sách, xử lý đúng cả trường hợp danh sách rỗng và không rỗng.'), weight: 1, maxScore: 0.6 },
  ],
};

const q1_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>f2() – 1 mark: Insert x as 2nd node, y as 5th node</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: there are 2 given Bike objects x, y. Assuming the list contains at least 3 elements, write statements to insert x and y into the list so that x will be the 2nd node, y will be the 5th node.</li></ul>`,
    `<p><strong>f2() – 1 điểm: Chèn x làm node thứ 2, y làm node thứ 5</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: có 2 đối tượng Bike x, y cho sẵn. Giả sử danh sách có ít nhất 3 phần tử, viết lệnh chèn x và y vào danh sách sao cho x là node thứ 2, y là node thứ 5.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9) (J,3,7)
(C,9,8) (X,1,2) (D,6,3) (E,8,5) (Y,3,4) (F,5,4) (I,4,9) (J,3,7)`,
  explanation: B(
    `<p>Verified by compiling and running — matches this paper's own worked example exactly. x (X) is inserted right after the head, becoming the 2nd node; y (Y) is inserted so it lands as the 5th node of the resulting 8-node list.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy — khớp đúng ví dụ minh hoạ của đề. x (X) được chèn ngay sau head, thành node thứ 2; y (Y) được chèn để nằm ở node thứ 5 của danh sách 8 phần tử kết quả.</p>`,
  ),
  rubric: [
    { id: 'insert_x_2nd', criterion: B('Correctly inserts x so it becomes the 2nd node.', 'Chèn đúng x để nó thành node thứ 2.'), weight: 1, maxScore: 0.5 },
    { id: 'insert_y_5th', criterion: B('Correctly inserts y (after x) so it becomes the 5th node.', 'Chèn đúng y (sau x) để nó thành node thứ 5.'), weight: 1, maxScore: 0.5 },
  ],
};

const q1_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>f3() – 1 mark: Remove the 2nd node with minimum color</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f3()</code>, right after the marked comment</li><li>Task: remove the second node having the minimum color (thus if there is only one node with the minimum color, do nothing).</li></ul>`,
    `<p><strong>f3() – 1 điểm: Xoá node thứ 2 có color nhỏ nhất</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f3()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: xoá node THỨ HAI có color nhỏ nhất (nếu chỉ có 1 node đạt color nhỏ nhất thì không làm gì).</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,8,6) (D,3,8) (E,9,2) (F,5,-1) (G,3,7) (H,6,8) (I,7,3)
(C,8,6) (D,3,8) (E,9,2) (F,5,-1) (H,6,8) (I,7,3)`,
  explanation: B(
    `<p>Verified by compiling and running — matches this paper's own worked example exactly. Minimum color is 3, occurring at D (1st) and G (2nd) — the 2nd occurrence (G) is removed, leaving the other 6 nodes untouched.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy — khớp đúng ví dụ minh hoạ của đề. Color nhỏ nhất là 3, xuất hiện ở D (lần 1) và G (lần 2) — lần xuất hiện thứ 2 (G) bị xoá, giữ nguyên 6 node còn lại.</p>`,
  ),
  rubric: [
    { id: 'find_2nd_min', criterion: B('Correctly finds the minimum color value and identifies the SECOND node (in list order) having that value.', 'Tìm đúng giá trị color nhỏ nhất và xác định đúng node THỨ HAI (theo thứ tự danh sách) có giá trị đó.'), weight: 1, maxScore: 0.6 },
    { id: 'remove_or_noop', criterion: B('Correctly removes that node, or correctly does nothing if only one node has the minimum color.', 'Xoá đúng node đó, hoặc không làm gì đúng nếu chỉ có 1 node đạt color nhỏ nhất.'), weight: 1, maxScore: 0.4 },
  ],
};

const q1_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>f4() – 1 mark: Sort first 4 ascending, last 3 descending by color</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f4()</code>, right after the marked comment</li><li>Task: assume the list contains at least 7 elements. Sort the first 4 elements ascending by color, and the last 3 elements descending by color.</li></ul>`,
    `<p><strong>f4() – 1 điểm: Sort 4 phần tử đầu tăng dần, 3 phần tử cuối giảm dần theo color</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f4()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: giả sử danh sách có ít nhất 7 phần tử. Sort 4 phần tử ĐẦU tăng dần theo color, và 3 phần tử CUỐI giảm dần theo color.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,9,8) (D,3,2) (E,10,7) (F,1,9) (I,6,4) (J,11,5) (K,7,6)
(F,1,9) (D,3,2) (C,9,8) (E,10,7) (J,11,5) (K,7,6) (I,6,4)`,
  explanation: B(
    `<p>Verified by compiling and running — matches this paper's own worked example exactly. First 4 (C=9,D=3,E=10,F=1) sorted ascending by color: F,D,C,E. Last 3 (I=6,J=11,K=7) sorted descending by color: J,K,I.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy — khớp đúng ví dụ minh hoạ của đề. 4 phần tử đầu (C=9,D=3,E=10,F=1) sắp tăng dần theo color: F,D,C,E. 3 phần tử cuối (I=6,J=11,K=7) sắp giảm dần theo color: J,K,I.</p>`,
  ),
  rubric: [
    { id: 'first4_ascending', criterion: B('Correctly sorts the first 4 elements ascending by color.', 'Sắp đúng 4 phần tử đầu tăng dần theo color.'), weight: 1, maxScore: 0.5 },
    { id: 'last3_descending', criterion: B('Correctly sorts the last 3 elements descending by color.', 'Sắp đúng 3 phần tử cuối giảm dần theo color.'), weight: 1, maxScore: 0.5 },
  ],
};

const scenarioQ2 = B(
  `<p><strong>Scenario:</strong> the class Bike with 3 data members (brand, color, weight) is provided, unedited. The BSTree class is a binary search tree of Bike objects, ordered by <b>weight</b> (the key, must be unique).</p>`,
  `<p><strong>Bối cảnh:</strong> lớp Bike với 3 thành viên dữ liệu (brand, color, weight) cho sẵn, không sửa. Lớp BSTree là cây nhị phân tìm kiếm các đối tượng Bike, sắp theo <b>weight</b> (khoá, phải duy nhất).</p>`,
) + q2DataNote;

const q2_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ2 + `<p><strong>insert() – 1 mark</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: <code>insert(String xBrand, int xColor, int xWeight)</code></li><li>Task: check if xBrand.charAt(0)=='A' then do nothing, otherwise insert new Bike object with brand=xBrand, color=xColor, weight=xWeight into the tree.</li></ul>`,
    scenarioQ2 + `<p><strong>insert() – 1 điểm</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: <code>insert(String xBrand, int xColor, int xWeight)</code></li><li>Nhiệm vụ: kiểm tra nếu xBrand.charAt(0)=='A' thì không làm gì; ngược lại chèn Bike mới brand=xBrand, color=xColor, weight=xWeight vào cây.</li></ul>`,
  ),
  starterCode: bstGiven,
  sampleSolution: bstSolved,
  expectedOutput: `(B,9,4) (C,4,3) (D,8,6) (H,10,2) (E,2,5) (F,-6,7) (G,6,8) (I,1,9)
(H,10,2) (C,4,3) (B,9,4) (E,2,5) (D,8,6) (F,-6,7) (G,6,8) (I,1,9)`,
  explanation: B(
    `<p>Verified by compiling and running this exam room's own reference dataset (see the note above on why this deck's original paper numbers are not used for Q2). "A" is correctly skipped; the breadth-first AND in-order traversals both come out consistent with a single correctly-built BST keyed by weight.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy trên bộ dữ liệu tham chiếu riêng của phòng thi này (xem lưu ý ở trên về lý do không dùng số liệu gốc của đề cho Q2). "A" bị bỏ qua đúng; cả duyệt breadth-first VÀ in-order đều nhất quán với 1 cây BST dựng đúng theo khoá weight.</p>`,
  ),
  rubric: [
    { id: 'brand_filter', criterion: B("Correctly rejects insertion when xBrand.charAt(0) == 'A'.", "Từ chối đúng khi xBrand.charAt(0) == 'A'."), weight: 1, maxScore: 0.2 },
    { id: 'bst_order', criterion: B('Correctly inserts respecting BST ordering by weight.', 'Chèn đúng thứ tự BST theo weight.'), weight: 1, maxScore: 0.5 },
    { id: 'unique_key', criterion: B('Correctly rejects insertion when the weight already exists elsewhere in the tree.', 'Từ chối đúng khi weight đã tồn tại ở nơi khác trong cây.'), weight: 1, maxScore: 0.3 },
  ],
};

const q2_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>f2() – 1 mark: Post-order filtered by color</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: perform the post-order traversal from the root but write to f2.txt only the nodes with color&lt;7. Hint: copy postOrder(...) to postOrder2(...) and modify it.</li></ul>` + q2DataNote,
    `<p><strong>f2() – 1 điểm: Duyệt hậu thứ tự lọc theo color</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: duyệt hậu thứ tự (post-order) từ root nhưng chỉ ghi ra f2.txt các node có color&lt;7. Gợi ý: copy postOrder(...) thành postOrder2(...) rồi sửa.</li></ul>` + q2DataNote,
  ),
  starterCode: bstGiven,
  sampleSolution: bstSolved,
  expectedOutput: `(C,4,3) (E,2,5) (I,1,9) (G,6,8) (F,-6,7)`,
  explanation: B(
    `<p>Verified by compiling and running this exam room's own reference dataset. B(9), D(8), H(10) are correctly excluded (color≥7); C(4), E(2), I(1), G(6), F(-6) are all &lt;7 and appear in valid post-order relative sequence.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy trên bộ dữ liệu tham chiếu riêng của phòng thi này. B(9), D(8), H(10) bị loại đúng (color≥7); C(4), E(2), I(1), G(6), F(-6) đều &lt;7 và xuất hiện đúng theo thứ tự tương đối của post-order.</p>`,
  ),
  rubric: [
    { id: 'postorder_copy', criterion: B('Correctly performs the same post-order traversal (left, right, node) as the given postOrder(...).', 'Duyệt đúng post-order (trái, phải, gốc) giống postOrder(...) có sẵn.'), weight: 1, maxScore: 0.4 },
    { id: 'color_filter', criterion: B('Only writes nodes with color < 7 (strictly less than).', 'Chỉ ghi ra node có color < 7 (nhỏ hơn nghiêm ngặt).'), weight: 1, maxScore: 0.6 },
  ],
};

const q2_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>f3() – 1 mark: Delete q = p.right by copying</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f3()</code>, right after the marked comment</li><li>Task: perform breadth-first traversal from the root and find the SECOND node p having 2 children. If such a node does not exist, do nothing; otherwise delete the node q = p.right by copying.</li></ul>` + q2DataNote,
    `<p><strong>f3() – 1 điểm: Xoá q = p.right bằng copy</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f3()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: duyệt breadth-first từ root, tìm node THỨ HAI p có 2 con. Nếu không tồn tại thì không làm gì; ngược lại xoá node q = p.right bằng phương pháp copy.</li></ul>` + q2DataNote,
  ),
  starterCode: bstGiven,
  sampleSolution: bstSolved,
  expectedOutput: `(B,9,4) (C,4,3) (D,8,6) (H,10,2) (E,2,5) (F,-6,7) (G,6,8) (I,1,9)
(B,9,4) (C,4,3) (D,8,6) (H,10,2) (E,2,5) (G,6,8) (I,1,9)`,
  explanation: B(
    `<p>Verified by compiling and running this exam room's own reference dataset. Breadth order is B,C,D,H,E,F,G,I — nodes with 2 children, in that order, are B (1st) and D (2nd) — so p=D, q=D.right=F. F has one child (G), so deleting F "by copy" degenerates to promoting G into F's place, which is why the resulting tree still contains G (as D's new right child, with its own right child I) but no longer contains F.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy trên bộ dữ liệu tham chiếu riêng của phòng thi này. Thứ tự breadth là B,C,D,H,E,F,G,I — các node có 2 con, theo thứ tự đó, là B (thứ 1) và D (thứ 2) — nên p=D, q=D.right=F. F chỉ có 1 con (G), nên xoá F "bằng copy" thu gọn về việc đẩy G lên thay thế vị trí F, vì vậy cây kết quả vẫn còn G (làm con phải mới của D, cùng con phải I của chính nó) nhưng không còn F.</p>`,
  ),
  rubric: [
    { id: 'find_second_two_child', criterion: B('Correctly finds, via breadth-first traversal, the SECOND node having exactly 2 children.', 'Tìm đúng, qua duyệt breadth-first, node THỨ HAI có đúng 2 con.'), weight: 1, maxScore: 0.5 },
    { id: 'delete_by_copy_or_noop', criterion: B('Correctly deletes q=p.right using a valid delete-by-copy technique, or correctly does nothing if no such second node exists.', 'Xoá đúng q=p.right bằng kỹ thuật xoá-bằng-copy hợp lệ, hoặc không làm gì đúng nếu không có node thứ hai như vậy.'), weight: 1, maxScore: 0.5 },
  ],
};

const q2_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>f4() – 1 mark: Rotate father f about max-weight node p</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f4()</code>, right after the marked comment</li><li>Task: find the node p having maximum weight. Suppose f is the father of p. Check if f is not null then rotate f about p.</li></ul>` + q2DataNote,
    `<p><strong>f4() – 1 điểm: Xoay cha f quanh node p có weight lớn nhất</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f4()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: tìm node p có weight lớn nhất. Gọi f là cha của p. Kiểm tra nếu f khác null thì xoay f quanh p.</li></ul>` + q2DataNote,
  ),
  starterCode: bstGiven,
  sampleSolution: bstSolved,
  expectedOutput: `(B,9,4) (C,4,3) (D,8,6) (H,10,2) (E,2,5) (F,-6,7) (G,6,8) (I,1,9)
(B,9,4) (C,4,3) (D,8,6) (H,10,2) (E,2,5) (F,-6,7) (I,1,9) (G,6,8)`,
  explanation: B(
    `<p>Verified by compiling and running this exam room's own reference dataset. The max-weight node is I (weight 9, the rightmost node in a BST keyed by weight); its father is G. Rotating G about I: I takes G's place (as F's right child), G becomes I's left child, and I's former left child (none, since I was a leaf) becomes G's right child (still none).</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy trên bộ dữ liệu tham chiếu riêng của phòng thi này. Node có weight lớn nhất là I (weight 9, node ngoài cùng bên phải trong BST theo khoá weight); cha của nó là G. Xoay G quanh I: I lên thay vị trí G (làm con phải mới của F), G thành con trái của I, và con trái cũ của I (không có, vì I là lá) thành con phải của G (vẫn không có).</p>`,
  ),
  rubric: [
    { id: 'find_max_weight', criterion: B('Correctly finds the node with the maximum weight (the right-most node) and its father.', 'Tìm đúng node có weight lớn nhất (node ngoài cùng bên phải) và cha của nó.'), weight: 1, maxScore: 0.4 },
    { id: 'correct_rotation', criterion: B("Correctly rotates the father about the max-weight node (the child takes the father's place, the father becomes the child's subtree on the opposite side).", 'Xoay đúng cha quanh node có weight lớn nhất (con lên thay vị trí cha, cha thành cây con phía đối diện của con).'), weight: 1, maxScore: 0.6 },
  ],
};

const scenarioQ3 = B(
  `<p><strong>Scenario:</strong> the class Graph is the implementation of a graph, over 9 vertices A-I.</p>`,
  `<p><strong>Bối cảnh:</strong> lớp Graph là cài đặt đồ thị, trên 9 đỉnh A-I.</p>`,
);

const q3_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ3 + `<p><strong>f1() – 1 mark: Depth-first traversal displaying a vertex range</strong></p><ul><li>File: Graph.java</li><li>Method to Complete: the body of <code>f1()</code>, right after the marked comment</li><li>Task: perform depth-first traversal (to the file f1.txt) from the vertex i=3 (the vertex D) but display 5 vertices from the 3rd vertex to the 7th vertex only. Hint: copy depth(...) to depth2(...) and modify the latter one.</li></ul>`,
    scenarioQ3 + `<p><strong>f1() – 1 điểm: Duyệt sâu, hiện 1 đoạn đỉnh</strong></p><ul><li>File: Graph.java</li><li>Method cần hoàn thiện: phần thân <code>f1()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: duyệt depth-first (ghi vào f1.txt) từ đỉnh i=3 (đỉnh D) nhưng chỉ hiện 5 đỉnh từ đỉnh thứ 3 tới đỉnh thứ 7. Gợi ý: copy depth(...) thành depth2(...) rồi sửa hàm mới.</li></ul>`,
  ),
  starterCode: graphGiven,
  sampleSolution: graphSolved,
  expectedOutput: `D A B E H I C G F
B E H I C`,
  explanation: B(
    `<p>Verified by compiling and running — matches this paper's own worked example exactly. Full DFS from D visits D,A,B,E,H,I,C,G,F (9 vertices); positions 3 through 7 of that sequence are B,E,H,I,C.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy — khớp đúng ví dụ minh hoạ của đề. DFS đầy đủ từ D thăm D,A,B,E,H,I,C,G,F (9 đỉnh); vị trí thứ 3 đến thứ 7 của dãy đó là B,E,H,I,C.</p>`,
  ),
  rubric: [
    { id: 'depth_copy', criterion: B('Correctly performs the same depth-first traversal as the given depth(...).', 'Duyệt đúng depth-first giống depth(...) có sẵn.'), weight: 1, maxScore: 0.4 },
    { id: 'range_filter', criterion: B('Only writes vertices that are the 3rd through 7th visited overall.', 'Chỉ ghi ra đỉnh là đỉnh thăm thứ 3 đến thứ 7.'), weight: 1, maxScore: 0.6 },
  ],
};

const q3_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>f2() – 1 mark: Two Dijkstra shortest-path queries</strong></p><ul><li>File: Graph.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: (1) apply Dijkstra's shortest path algorithm to find the shortest path from vertex 0 (A) to vertex 6 (G): write the last 3 vertices selected into the set S with their labels, then the 1st, 3rd and last vertices in that shortest path. (2) apply Dijkstra from vertex 1 (B) to vertex 5 (F): write the vertices in that shortest path. (Note that in the weighted matrix, the value 99 is considered as infinity.)</li></ul>` + q3f2DataNote,
    `<p><strong>f2() – 1 điểm: 2 lượt Dijkstra tìm đường ngắn nhất</strong></p><ul><li>File: Graph.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: (1) áp dụng Dijkstra tìm đường ngắn nhất từ đỉnh 0 (A) tới đỉnh 6 (G): ghi 3 đỉnh SAU CÙNG được chọn vào tập S cùng nhãn của chúng, rồi đỉnh thứ 1, thứ 3 và cuối cùng của đường đi đó. (2) áp dụng Dijkstra từ đỉnh 1 (B) tới đỉnh 5 (F): ghi các đỉnh của đường đi đó. (Lưu ý: trong ma trận trọng số, giá trị 99 coi là vô cùng.)</li></ul>` + q3f2DataNote,
  ),
  starterCode: graphGiven,
  sampleSolution: graphSolved,
  expectedOutput: `E 9 H 11 G 12
A G G
B A C G F`,
  explanation: B(
    `<p>Verified by compiling and running this exam room's own reference dataset (see the note above on why the original paper's numbers can't be used for f2). Since f1's graph is a tree (no cycles), the path from A to G is forced by the topology (A→C→G, only 3 vertices) — so the 3rd and last vertex of that path coincide (both G); this is a correct, if slightly redundant-looking, result given the graph's shape.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy trên bộ dữ liệu tham chiếu riêng của phòng thi này (xem lưu ý ở trên về lý do không dùng được số liệu gốc của đề cho f2). Vì đồ thị của f1 là 1 cây (không có chu trình), đường đi từ A tới G bị ép buộc bởi cấu trúc (A→C→G, chỉ 3 đỉnh) — nên đỉnh thứ 3 và đỉnh cuối của đường đi đó trùng nhau (đều là G); đây là kết quả đúng, dù nhìn hơi dư thừa, do hình dạng đồ thị quy định.</p>`,
  ),
  rubric: [
    { id: 'last3_selected', criterion: B('Correctly runs Dijkstra from A toward G and reports the last 3 vertices selected into S with their distance labels.', 'Chạy đúng Dijkstra từ A hướng tới G và báo đúng 3 đỉnh cuối được chọn vào S cùng nhãn khoảng cách.'), weight: 1, maxScore: 0.4 },
    { id: 'path1_positions', criterion: B('Correctly reports the 1st, 3rd and last vertices of the shortest path from A to G.', 'Báo đúng đỉnh thứ 1, thứ 3 và cuối cùng của đường đi ngắn nhất từ A tới G.'), weight: 1, maxScore: 0.3 },
    { id: 'path2_full', criterion: B('Correctly reports the full vertex sequence of the shortest path from B to F.', 'Báo đúng đầy đủ dãy đỉnh của đường đi ngắn nhất từ B tới F.'), weight: 1, maxScore: 0.3 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE49',
    title: 'PE Đề 49 — Practical Exam (Spring 2023)|||PE Đề 49 — Thi thực hành (Spring 2023)',
    description: 'CSD201 PE (CODE): MyList<Bike> + BSTree<Bike> + Graph, given project reconstructed from a worked-example paper (no original code archive); Q2/Q3.f2 use self-verified data due to internal inconsistencies in the source paper, AI-graded.|||PE CSD201 (viết mã): MyList<Bike> + BSTree<Bike> + Graph, given project dựng lại từ đề có ví dụ minh hoạ (không có archive mã gốc); Q2/Q3.f2 dùng dữ liệu tự verify do đề gốc có mâu thuẫn nội tại, chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE49-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1_1, q1_2, q1_3, q1_4, q2_1, q2_2, q2_3, q2_4, q3_1, q3_2],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(__biNormalize(spec), null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
