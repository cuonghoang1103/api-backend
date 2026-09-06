/**
 * build-csd201-pe37.mjs — sinh content/exams/CSD201-PE37.mjs.
 *
 * Nguồn thật: Đề 37 (Fall 2023, HCM Ca 2). Archive gốc CHỈ có paper.pdf,
 * KHÔNG có project NetBeans given nào — nhưng KHÁC hẳn PE6/PE7/PE9/PE14:
 * paper.pdf này viết đúng theo văn phong "given project" cổ điển (giống
 * PE29/40-44 đã làm) — "Open NetBeans, open the given Q1 project, then
 * edit the MyList.java file" — và mỗi trong 10 method con đều có ĐẦY ĐỦ ví
 * dụ before/after cụ thể ngay trong paper.pdf. Vì vậy đã tự DỰNG LẠI đúng
 * given project (Plane/MyListNode/MyList cho Q1; User/BSTNode/BSTree cho
 * Q2) rồi đóng gói given.zip tải lên R2, giống hệt quy trình các đề PE có
 * archive thật khác trong chiến dịch này.
 *
 * Toàn bộ 10 method (Q1: addLast+f2+f3+f4; Q2: insert+f2+f3+f4+f5+f6) đã
 * viết tay, COMPILE + CHẠY THẬT (javac/java), và đối chiếu với ĐÚNG ví dụ
 * before/after in trong paper.pdf — khớp 100% cả 10/10, không suy đoán mù.
 * Thứ tự chèn 10 User cho cây BST (Q2) được TỰ SUY NGƯỢC từ đối chiếu CHÉO
 * cả 4 kiểu duyệt khác nhau mà đề dùng làm "trạng thái trước" cho từng câu
 * (breadth ở f1/f3, preOrder ở f2/f4, inOrder ở f5/f6) — khớp cả 4 kiểu
 * cùng lúc là bằng chứng cấu trúc cây dựng lại đúng.
 *
 * Given.zip: 2 project riêng Q1/ và Q2/, mỗi cái có class dữ liệu (Plane/
 * Node hoặc User/Node, "DO NOT EDIT") + file method-cần-hoàn-thiện (blank,
 * có main() để tự test). Verify compile ĐỘC LẬP cả project trước khi zip.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE37.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE37.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE37-Given.zip';
const SRC = '/tmp/csd201-pe37-final';

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
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (Fall 2023, HCM Ca 2). Software: NetBeans IDE 8.x, Java JDK 1.8. Do not add new import statement(s) to given files. Avoid using accented Vietnamese in comments.</p>
   <p>Download the given materials above — it contains 2 separate NetBeans projects: Q1 (MyList) and Q2 (BSTree). Each project's file (MyList.java / BSTree.java) has several methods to complete — only edit inside the marked "You should write here" sections. Do not change any method signature.</p>
   <p><b>Note:</b> "Do not pay attention to the real meaning of objects, variables and their values in the questions below" (as this paper itself states) — the scenario data is arbitrary/illustrative.</p>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (Fall 2023, HCM Ca 2). Phần mềm: NetBeans IDE 8.x, Java JDK 1.8. Không thêm import mới vào file cho sẵn. Không dùng tiếng Việt có dấu trong comment.</p>
   <p>Tải given materials ở trên — gồm 2 project NetBeans riêng: Q1 (MyList) và Q2 (BSTree). Mỗi file (MyList.java / BSTree.java) có vài method cần hoàn thiện — chỉ sửa trong phần đánh dấu "You should write here". Không đổi chữ ký method.</p>
   <p><b>Lưu ý:</b> "Không cần để ý ý nghĩa thật của đối tượng/biến/giá trị trong các câu dưới đây" (đề gốc tự ghi vậy) — dữ liệu tình huống chỉ mang tính minh hoạ.</p>`,
);

const myListGiven = fs.readFileSync(path.join(SRC, 'MyList.given.java'), 'utf8');
const myListSolved = fs.readFileSync(path.join(SRC, 'MyList.solved.java'), 'utf8');
const bstGiven = fs.readFileSync(path.join(SRC, 'BSTree.given.java'), 'utf8');
const bstSolved = fs.readFileSync(path.join(SRC, 'BSTree.solved.java'), 'utf8');

const scenarioQ1 = B(
  `<p><strong>Scenario:</strong> the class Plane with 3 data members (type, capacity, price) is provided, unedited. The MyList class is a linked list of Plane objects. Each of the 4 methods below is graded independently against its own worked example.</p>`,
  `<p><strong>Bối cảnh:</strong> lớp Plane với 3 thành viên dữ liệu (type, capacity, price) cho sẵn, không sửa. Lớp MyList là danh sách liên kết các đối tượng Plane. Mỗi trong 4 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ.</p>`,
);

const q1_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ1 + `<p><strong>addLast() – 1 mark</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: <code>addLast(String xType, int xCapacity, int xPrice)</code></li><li>Task: if xPrice&lt;1000 then do nothing; otherwise add a new node with type=xType, capacity=xCapacity, price=xPrice to the end of the list.</li></ul>`,
    scenarioQ1 + `<p><strong>addLast() – 1 điểm</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: <code>addLast(String xType, int xCapacity, int xPrice)</code></li><li>Nhiệm vụ: nếu xPrice&lt;1000 thì không làm gì; ngược lại thêm node mới type=xType, capacity=xCapacity, price=xPrice vào CUỐI danh sách.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(A,9,1500) (B,5,3000) (C,6,5000) (E,7,9000) (F,4,7000)`,
  explanation: B(
    `<p>Verified by compiling and running the given project's f1() — matches this paper's own worked example exactly. Candidate "D" (price=500&lt;1000) is correctly skipped; every price≥1000 candidate is appended in order.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy f1() có sẵn của given project — khớp đúng ví dụ minh hoạ của đề. Candidate "D" (price=500&lt;1000) bị bỏ qua đúng; mọi candidate price≥1000 được nối vào cuối theo đúng thứ tự.</p>`,
  ),
  rubric: [
    { id: 'price_filter', criterion: B('Correctly does nothing when xPrice < 1000.', 'Không làm gì đúng khi xPrice < 1000.'), weight: 1, maxScore: 0.4 },
    { id: 'append', criterion: B('Correctly appends the new node at the end of the list, handling both empty and non-empty list cases.', 'Nối đúng node mới vào cuối danh sách, xử lý đúng cả trường hợp danh sách rỗng và không rỗng.'), weight: 1, maxScore: 0.6 },
  ],
};

const q1_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>f2() – 1 mark: Insert x as last, y as 2nd node</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: there are 2 given Plane objects x, y. Assuming the list contains at least 3 elements, write statements to insert x and y into the list so that y will be the 2nd node and x will be the last node.</li></ul>`,
    `<p><strong>f2() – 1 điểm: Chèn x làm node cuối, y làm node thứ 2</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: có 2 đối tượng Plane x, y cho sẵn. Giả sử danh sách có ít nhất 3 phần tử, viết lệnh chèn x và y vào danh sách sao cho y là node thứ 2, x là node cuối.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(F16,9,8000) (Mic20,6,3000) (SU30,8,5000) (B52,5,4000) (T30,4,9000)
(F16,9,8000) (AirbusA300,300,2000) (Mic20,6,3000) (SU30,8,5000) (B52,5,4000) (T30,4,9000) (Boeing747,400,1500)`,
  explanation: B(
    `<p>Verified by compiling and running — matches this paper's own worked example exactly. y (AirbusA300) is inserted right after the head, becoming the 2nd node; x (Boeing747) is appended at the end.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy — khớp đúng ví dụ minh hoạ của đề. y (AirbusA300) được chèn ngay sau head, thành node thứ 2; x (Boeing747) được nối vào cuối.</p>`,
  ),
  rubric: [
    { id: 'insert_y_2nd', criterion: B('Correctly inserts y so it becomes the 2nd node.', 'Chèn đúng y để nó thành node thứ 2.'), weight: 1, maxScore: 0.5 },
    { id: 'insert_x_last', criterion: B('Correctly inserts x so it becomes the last node.', 'Chèn đúng x để nó thành node cuối.'), weight: 1, maxScore: 0.5 },
  ],
};

const q1_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>f3() – 1 mark: Swap position 1 and position 4</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f3()</code>, right after the marked comment</li><li>Task: assume the list contains at least 5 elements. Swap the element at position 1 with the element at position 4 (the head's position is 0). Hint: you only need to swap the data between nodes, not necessarily swap nodes.</li></ul>`,
    `<p><strong>f3() – 1 điểm: Đổi chỗ vị trí 1 và vị trí 4</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f3()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: giả sử danh sách có ít nhất 5 phần tử. Đổi chỗ phần tử ở vị trí 1 với phần tử ở vị trí 4 (vị trí head là 0). Gợi ý: chỉ cần đổi dữ liệu giữa 2 node, không nhất thiết đổi node.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,9,2000) (D,2,5000) (E,8,7000) (F,1,6000) (G,5,9000) (H,6,4000)
(C,9,2000) (G,5,9000) (E,8,7000) (F,1,6000) (D,2,5000) (H,6,4000)`,
  explanation: B(
    `<p>Verified by compiling and running — matches this paper's own worked example exactly. Position 1 (D) and position 4 (G) swap data, leaving all other positions untouched.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy — khớp đúng ví dụ minh hoạ của đề. Vị trí 1 (D) và vị trí 4 (G) đổi dữ liệu cho nhau, giữ nguyên mọi vị trí khác.</p>`,
  ),
  rubric: [
    { id: 'correct_positions', criterion: B('Correctly locates the nodes at position 1 and position 4 (head = position 0).', 'Xác định đúng node ở vị trí 1 và vị trí 4 (head = vị trí 0).'), weight: 1, maxScore: 0.4 },
    { id: 'swap_data_only', criterion: B('Correctly swaps only the data between the two nodes, leaving every other node/position untouched.', 'Đổi đúng CHỈ dữ liệu giữa 2 node, giữ nguyên mọi node/vị trí khác.'), weight: 1, maxScore: 0.6 },
  ],
};

const q1_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>f4() – 1 mark: Reverse the last 4 elements</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f4()</code>, right after the marked comment</li><li>Task: assume the list contains at least 6 elements. Reverse the last 4 elements. Hint: you only need to swap the data between nodes, not necessarily swap nodes.</li></ul>`,
    `<p><strong>f4() – 1 điểm: Đảo ngược 4 phần tử cuối</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f4()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: giả sử danh sách có ít nhất 6 phần tử. Đảo ngược 4 phần tử cuối. Gợi ý: chỉ cần đổi dữ liệu giữa 2 node, không nhất thiết đổi node.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,7,6000) (D,12,5000) (E,6,1100) (F,5,4000) (I,4,3000) (J,3,2000) (K,2,1000)
(C,7,6000) (D,12,5000) (E,6,1100) (K,2,1000) (J,3,2000) (I,4,3000) (F,5,4000)`,
  explanation: B(
    `<p>Verified by compiling and running — matches this paper's own worked example exactly. The last 4 elements (F,I,J,K) become (K,J,I,F), while the first 3 (C,D,E) stay untouched.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy — khớp đúng ví dụ minh hoạ của đề. 4 phần tử cuối (F,I,J,K) thành (K,J,I,F), 3 phần tử đầu (C,D,E) giữ nguyên.</p>`,
  ),
  rubric: [
    { id: 'correct_range', criterion: B('Only reverses the last 4 elements, leaving every earlier element untouched.', 'Chỉ đảo ngược 4 phần tử cuối, giữ nguyên mọi phần tử trước đó.'), weight: 1, maxScore: 0.4 },
    { id: 'reverse_data_only', criterion: B('Correctly reverses by swapping data between node pairs (not necessarily swapping the nodes themselves).', 'Đảo ngược đúng bằng cách đổi dữ liệu giữa các cặp node (không nhất thiết đổi bản thân node).'), weight: 1, maxScore: 0.6 },
  ],
};

const scenarioQ2 = B(
  `<p><strong>Scenario:</strong> the class User with 3 data members (name, age, id) is provided, unedited. The BSTree class is a binary search tree of User objects, ordered by <b>id</b> (the key, must be unique). Each of the 6 methods below is graded independently against its own worked example.</p>`,
  `<p><strong>Bối cảnh:</strong> lớp User với 3 thành viên dữ liệu (name, age, id) cho sẵn, không sửa. Lớp BSTree là cây nhị phân tìm kiếm các đối tượng User, sắp theo <b>id</b> (khoá, phải duy nhất). Mỗi trong 6 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ.</p>`,
);

const q2_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ2 + `<p><strong>insert() – 1 mark</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: <code>insert(String xName, int xAge, int xId)</code></li><li>Task: insert a new User with name=xName, age=xAge, id=xId into the tree (age&gt;0).</li></ul>`,
    scenarioQ2 + `<p><strong>insert() – 1 điểm</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: <code>insert(String xName, int xAge, int xId)</code></li><li>Nhiệm vụ: chèn User mới name=xName, age=xAge, id=xId vào cây (age&gt;0).</li></ul>`,
  ),
  starterCode: bstGiven,
  sampleSolution: bstSolved,
  expectedOutput: `(A,50,8) (B,10,2) (E,30,10) (C,4,5) (F,14,9) (H,34,11) (D,25,4) (G,7,6) (J,19,3) (I,20,7)
(B,10,2) (J,19,3) (D,25,4) (C,4,5) (G,7,6) (I,20,7) (A,50,8) (F,14,9) (E,30,10) (H,34,11)`,
  explanation: B(
    `<p>Verified by compiling and running the given project's f1() — matches this paper's own breadth-order AND in-order worked examples exactly (both lines confirmed simultaneously, strong evidence the tree structure is correct).</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy f1() có sẵn của given project — khớp đúng CẢ ví dụ breadth-order lẫn in-order của đề (khớp đồng thời cả 2 dòng là bằng chứng mạnh cấu trúc cây đúng).</p>`,
  ),
  rubric: [
    { id: 'age_filter', criterion: B('Correctly rejects insertion when age <= 0.', 'Từ chối đúng khi age <= 0.'), weight: 1, maxScore: 0.2 },
    { id: 'bst_order', criterion: B('Correctly inserts respecting BST ordering by id.', 'Chèn đúng thứ tự BST theo id.'), weight: 1, maxScore: 0.5 },
    { id: 'unique_key', criterion: B('Correctly rejects insertion when the id already exists elsewhere in the tree.', 'Từ chối đúng khi id đã tồn tại ở nơi khác trong cây.'), weight: 1, maxScore: 0.3 },
  ],
};

const q2_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>f2() – 1 mark: Post-order filtered by age</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: perform the post-order traversal from the root but write to f2.txt only the nodes with age&lt;25. Hint: copy postOrder(...) to postOrder2(...) and modify it.</li></ul>`,
    `<p><strong>f2() – 1 điểm: Duyệt hậu thứ tự lọc theo age</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: duyệt hậu thứ tự (post-order) từ root nhưng chỉ ghi ra f2.txt các node có age&lt;25. Gợi ý: copy postOrder(...) thành postOrder2(...) rồi sửa.</li></ul>`,
  ),
  starterCode: bstGiven,
  sampleSolution: bstSolved,
  expectedOutput: `(A,50,8) (B,10,2) (C,4,5) (D,25,4) (J,19,3) (G,7,6) (I,20,7) (E,30,10) (F,14,9) (H,34,11)
(J,19,3) (I,20,7) (G,7,6) (C,4,5) (B,10,2) (F,14,9)`,
  explanation: B(
    `<p>Verified by compiling and running — matches this paper's own worked example exactly. D (age=25) is correctly excluded since 25 is not &lt; 25; H, E, A (all age≥30) are also excluded.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy — khớp đúng ví dụ minh hoạ của đề. D (age=25) bị loại đúng vì 25 không nhỏ hơn 25; H, E, A (age≥30) cũng bị loại.</p>`,
  ),
  rubric: [
    { id: 'postorder_copy', criterion: B('Correctly performs the same post-order traversal (left, right, node) as the given postOrder(...).', 'Duyệt đúng post-order (trái, phải, gốc) giống postOrder(...) có sẵn.'), weight: 1, maxScore: 0.4 },
    { id: 'age_filter', criterion: B('Only writes nodes with age < 25 (strictly less than).', 'Chỉ ghi ra node có age < 25 (nhỏ hơn nghiêm ngặt).'), weight: 1, maxScore: 0.6 },
  ],
};

const q2_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>f3() – 1 mark: Add 3 to single-child nodes' age</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f3()</code>, right after the marked comment</li><li>Task: add 3 to the age of all nodes that have only one child (age=age+3). Hint: such nodes will have either a left child or a right child, but not both.</li></ul>`,
    `<p><strong>f3() – 1 điểm: Tăng age của node chỉ có 1 con</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f3()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: tăng thêm 3 vào age của mọi node chỉ có ĐÚNG 1 con (age=age+3). Gợi ý: những node này chỉ có con trái HOẶC con phải, không có cả 2.</li></ul>`,
  ),
  starterCode: bstGiven,
  sampleSolution: bstSolved,
  expectedOutput: `(A,50,8) (B,10,2) (E,30,10) (C,4,5) (F,14,9) (H,34,11) (D,25,4) (G,7,6) (J,19,3) (I,20,7)
(A,50,8) (B,13,2) (E,30,10) (C,4,5) (F,14,9) (H,34,11) (D,28,4) (G,10,6) (J,19,3) (I,20,7)`,
  explanation: B(
    `<p>Verified by compiling and running — matches this paper's own worked example exactly. B (right child only), D (left child only), G (right child only) each get +3 (10→13, 25→28, 7→10); nodes with 0 or 2 children (A, C, E, F, H, I, J) stay unchanged.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy — khớp đúng ví dụ minh hoạ của đề. B (chỉ con phải), D (chỉ con trái), G (chỉ con phải) mỗi node +3 (10→13, 25→28, 7→10); node có 0 hoặc 2 con (A, C, E, F, H, I, J) giữ nguyên.</p>`,
  ),
  rubric: [
    { id: 'detect_single_child', criterion: B('Correctly identifies nodes with exactly one child (XOR of has-left and has-right), not zero or two.', 'Xác định đúng node có ĐÚNG 1 con (XOR giữa có-con-trái và có-con-phải), không phải 0 hay 2.'), weight: 1, maxScore: 0.6 },
    { id: 'apply_to_all', criterion: B('Applies the +3 update across the whole tree (not just one node), leaving other nodes unchanged.', 'Áp dụng +3 trên toàn cây (không chỉ 1 node), giữ nguyên các node khác.'), weight: 1, maxScore: 0.4 },
  ],
};

const q2_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>f4() – 1 mark: Height of the last postOrder node</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f4()</code>, right after the marked comment</li><li>Task: calculate the height of the last node in the postOrder traversal from the root. (Hint: the height of a node is the height of the subtree whose root is that node; a single node has height 1.)</li></ul>`,
    `<p><strong>f4() – 1 điểm: Chiều cao của node cuối trong postOrder</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f4()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: tính chiều cao của node CUỐI trong duyệt postOrder từ root. (Gợi ý: chiều cao của 1 node là chiều cao cây con có gốc là node đó; 1 node đơn có chiều cao 1.)</li></ul>`,
  ),
  starterCode: bstGiven,
  sampleSolution: bstSolved,
  expectedOutput: `(A,50,8) (B,10,2) (C,4,5) (D,25,4) (J,19,3) (G,7,6) (I,20,7) (E,30,10) (F,14,9) (H,34,11)
5`,
  explanation: B(
    `<p>Verified by compiling and running — matches this paper's own worked example exactly. Post-order traversal always visits the root last, so "the last node in postOrder" is the root (A); the height of the whole tree (root A) is 5.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy — khớp đúng ví dụ minh hoạ của đề. Duyệt postOrder luôn thăm root SAU CÙNG, nên "node cuối trong postOrder" chính là root (A); chiều cao cả cây (root A) là 5.</p>`,
  ),
  rubric: [
    { id: 'identify_last_node', criterion: B('Correctly recognizes the last node visited in a post-order traversal is the root.', 'Nhận ra đúng node cuối cùng thăm trong postOrder chính là root.'), weight: 1, maxScore: 0.3 },
    { id: 'height_calc', criterion: B('Correctly computes subtree height with a single node counted as height 1.', 'Tính đúng chiều cao cây con, quy ước 1 node đơn có chiều cao 1.'), weight: 1, maxScore: 0.7 },
  ],
};

const q2_5 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>f5() – 1 mark: Zero out the left branch of the 1st preOrder node</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f5()</code>, right after the marked comment</li><li>Task: set the age of all nodes located in the left branch of the 1st node in the preOrder traversal from the root to zero (age=0). Hint: traverse all nodes in the left branch of that node and set the age of each node to 0.</li></ul>`,
    `<p><strong>f5() – 1 điểm: Đặt age=0 nhánh trái của node đầu preOrder</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f5()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: đặt age về 0 cho mọi node nằm trong NHÁNH TRÁI của node đầu tiên trong duyệt preOrder từ root. Gợi ý: duyệt mọi node trong nhánh trái của node đó và đặt age=0 cho từng node.</li></ul>`,
  ),
  starterCode: bstGiven,
  sampleSolution: bstSolved,
  expectedOutput: `(B,10,2) (J,19,3) (D,25,4) (C,4,5) (G,7,6) (I,20,7) (A,50,8) (F,14,9) (E,30,10) (H,34,11)
(B,0,2) (J,0,3) (D,0,4) (C,0,5) (G,0,6) (I,0,7) (A,50,8) (F,14,9) (E,30,10) (H,34,11)`,
  explanation: B(
    `<p>Verified by compiling and running — matches this paper's own worked example exactly. The 1st preOrder node is the root itself (A); its entire left branch (B, J, D, C, G, I) gets age set to 0, while A and its right branch (F, E, H) stay unchanged.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy — khớp đúng ví dụ minh hoạ của đề. Node đầu tiên trong preOrder chính là root (A); toàn bộ nhánh trái của nó (B, J, D, C, G, I) được đặt age=0, còn A và nhánh phải (F, E, H) giữ nguyên.</p>`,
  ),
  rubric: [
    { id: 'identify_left_branch', criterion: B("Correctly identifies the 1st preOrder node's left branch as the entire left subtree of the root.", 'Xác định đúng nhánh trái của node đầu tiên trong preOrder là toàn bộ cây con trái của root.'), weight: 1, maxScore: 0.4 },
    { id: 'zero_out_all', criterion: B('Correctly sets age=0 for every node in that left branch, leaving the root and its right branch untouched.', 'Đặt đúng age=0 cho mọi node trong nhánh trái đó, giữ nguyên root và nhánh phải.'), weight: 1, maxScore: 0.6 },
  ],
};

const q2_6 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>f6() – 1 mark: Node with the biggest id</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f6()</code>, right after the marked comment</li><li>Task: find the node with the biggest id (the right-most node) in the tree.</li></ul>`,
    `<p><strong>f6() – 1 điểm: Node có id lớn nhất</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f6()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: tìm node có id LỚN NHẤT (node ngoài cùng bên phải) trong cây.</li></ul>`,
  ),
  starterCode: bstGiven,
  sampleSolution: bstSolved,
  expectedOutput: `(B,10,2) (J,19,3) (D,25,4) (C,4,5) (G,7,6) (I,20,7) (A,50,8) (F,14,9) (E,30,10) (H,34,11)
(H,34,11)`,
  explanation: B(
    `<p>Verified by compiling and running — matches this paper's own worked example exactly. Since the tree is a BST ordered by id, the biggest id is always the right-most node, reached by following .right pointers from the root until null — that node is H (id=11).</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy — khớp đúng ví dụ minh hoạ của đề. Vì cây là BST sắp theo id, id lớn nhất luôn là node ngoài cùng bên phải, tìm được bằng cách đi theo con trỏ .right từ root tới khi null — node đó là H (id=11).</p>`,
  ),
  rubric: [
    { id: 'rightmost_traversal', criterion: B('Correctly follows the right-child chain from the root until reaching a node with no right child.', 'Đi đúng theo chuỗi con phải từ root tới khi gặp node không còn con phải.'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE37',
    title: 'PE Đề 37 — Practical Exam (Fall 2023, HCM Ca 2)|||PE Đề 37 — Thi thực hành (Fall 2023, HCM Ca 2)',
    description: 'CSD201 PE (CODE): singly-linked-list (MyList<Plane>) + binary search tree (BSTree<User>), given project reconstructed from a complete worked-example paper (no original code archive), AI-graded.|||PE CSD201 (viết mã): danh sách liên kết đơn (MyList<Plane>) + cây nhị phân tìm kiếm (BSTree<User>), given project dựng lại từ đề có đủ ví dụ minh hoạ (không có archive mã gốc), chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE37-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1_1, q1_2, q1_3, q1_4, q2_1, q2_2, q2_3, q2_4, q2_5, q2_6],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(__biNormalize(spec), null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
