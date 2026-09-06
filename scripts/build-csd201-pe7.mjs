/**
 * build-csd201-pe7.mjs — sinh content/exams/CSD201-PE7.mjs.
 *
 * Nguồn thật: Đề 7 (csd201_pe1_fa25_382952.rar, "PaperNo_1", FALL 2025).
 * ⚠️ KHÁC HẲN mọi đề CSD201 PE khác đã làm trong chiến dịch này: đề này
 * KHÔNG PHÁT project NetBeans given có sẵn để điền vào chỗ trống — archive
 * chỉ chứa lại chính văn bản đề (.docx, không có mã nguồn nào). Đây là dạng
 * "viết toàn bộ từ đầu, nộp đúng 1 file Java" (paper.pdf tự ghi rõ: "Submit
 * only one Java file! You may use your own lab exercises and course notes,
 * but NOT Internet access").
 *
 * Đề bài TỰ NÓ đã hoàn chỉnh, có mảng test cụ thể P = [(5,500),(3,300),
 * (2,200),(4,400),(7,700),(6,600),(8,800),(1,100),(9,900)] — không cần suy
 * đoán gì thêm. Toàn bộ lời giải (Product/Node/T/Sorting/Main) đã được viết
 * tay, COMPILE + CHẠY THẬT (javac/java), và đối chiếu TÍNH TAY từng giá trị
 * level/bal_factor/count/height-balanced/sort — khớp 100%, không suy đoán mù.
 *
 * Không có given.zip để tải (đề gốc không phát mã nguồn nào) — mỗi câu cho
 * sẵn khung `T.java`/`Sorting.java` do TỰ THIẾT KẾ (không phải nguyên bản từ
 * trường) với đúng method signature + chú thích chỗ cần viết, theo cùng quy
 * ước "//You should write here..." như mọi đề CSD201 PE khác trong hệ thống.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE7.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE7.mjs');
const SRC = '/tmp/csd201-pe7-final';

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
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (Fall 2025, Practical Exam). Time allowed: 85 minutes. Submit only ONE Java file per part — you may use your own lab exercises and course notes, but NOT internet access.</p>
   <p>Write a Java program that manages information of products. Each product has two fields: <code>code: int</code> (a unique product code) and <code>price: int</code>.</p>
   <p>Implement a <code>Product</code> class (code, price) and a <code>Node</code> class, then, for a binary search tree <code>T</code> whose nodes are ordered by <code>code</code>, implement the functions asked in each question below. This exam room's code boxes are graded by AI against the rubric shown per question.</p>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (Fall 2025, Thi thực hành). Thời gian: 85 phút. Chỉ nộp ĐÚNG 1 file Java mỗi phần — được dùng lại bài lab và ghi chú môn học của bạn, KHÔNG được dùng Internet.</p>
   <p>Viết chương trình Java quản lý thông tin sản phẩm. Mỗi sản phẩm có 2 trường: <code>code: int</code> (mã sản phẩm, duy nhất) và <code>price: int</code>.</p>
   <p>Cài đặt lớp <code>Product</code> (code, price) và lớp <code>Node</code>, sau đó với cây nhị phân tìm kiếm <code>T</code> có các node sắp theo <code>code</code>, cài đặt các hàm được hỏi ở mỗi câu dưới đây. Các ô mã trong phòng thi web này được AI chấm theo tiêu chí ghi ở từng câu.</p>`,
);

const noGivenNote = B(
  `<p><b>Note:</b> the original exam paper for this deck does not distribute any starter/given project — students write the entire solution from scratch in one Java file, using only the classes described here (<code>Product</code>: code, price; <code>Node</code>: info, left, right, level, bal_factor). The skeleton below (method signatures + "write here" markers) was authored to match that paper's exact requirements, not copied from a professor-provided template. All sample output has been verified by actually compiling and running a full reference solution.</p>`,
  `<p><b>Lưu ý:</b> đề gốc của đề này KHÔNG phát project mẫu nào — sinh viên viết toàn bộ lời giải từ đầu trong 1 file Java, chỉ dùng các lớp mô tả ở đây (<code>Product</code>: code, price; <code>Node</code>: info, left, right, level, bal_factor). Khung bên dưới (chữ ký method + chỗ đánh dấu "viết ở đây") được soạn đúng theo yêu cầu của đề gốc, không sao chép từ mẫu của trường. Mọi output mẫu đã được xác nhận bằng cách biên dịch và chạy thật 1 lời giải tham chiếu đầy đủ.</p>`,
);

const classContext = B(
  `<p><strong>Classes (given, do not edit):</strong></p>
   <pre><code class="language-java">class Product {
    int code;   // unique product code
    int price;
}
class Node {
    Product info;
    Node left, right;
    int level;      // I.3
    int bal_factor; // I.4
}</code></pre>
   <p><strong>Test array used by Main:</strong> P = [(5,500), (3,300), (2,200), (4,400), (7,700), (6,600), (8,800), (1,100), (9,900)]</p>`,
  `<p><strong>Các lớp (cho sẵn, không sửa):</strong></p>
   <pre><code class="language-java">class Product {
    int code;   // mã sản phẩm, duy nhất
    int price;
}
class Node {
    Product info;
    Node left, right;
    int level;      // Câu I.3
    int bal_factor; // Câu I.4
}</code></pre>
   <p><strong>Mảng test dùng trong Main:</strong> P = [(5,500), (3,300), (2,200), (4,400), (7,700), (6,600), (8,800), (1,100), (9,900)]</p>`,
) + noGivenNote;

const pnGiven = fs.readFileSync(path.join(SRC, 'ProductNode.given.java'), 'utf8');
const pnSolved = fs.readFileSync(path.join(SRC, 'ProductNode.solved.java'), 'utf8');
const tGiven = fs.readFileSync(path.join(SRC, 'T.given.java'), 'utf8');
const tSolved = fs.readFileSync(path.join(SRC, 'T.solved.java'), 'utf8');
const sortGiven = fs.readFileSync(path.join(SRC, 'Sorting.given.java'), 'utf8');
const sortSolved = fs.readFileSync(path.join(SRC, 'Sorting.solved.java'), 'utf8');
const mainGiven = fs.readFileSync(path.join(SRC, 'Main.given.java'), 'utf8');
const mainSolved = fs.readFileSync(path.join(SRC, 'Main.solved.java'), 'utf8');

const q0 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    classContext + `<p><strong>Implement Product and Node classes – 1 mark</strong></p><ul><li>File: Product.java / Node.java</li><li>Task: implement the <code>Product</code> class (fields <code>code: int</code> — a unique product code, <code>price: int</code>) and the <code>Node</code> class for the binary search tree (holds a <code>Product</code>, a <code>left</code> and <code>right</code> child, plus the <code>level</code> and <code>bal_factor</code> fields used by later parts of this exam).</li></ul>`,
    classContext + `<p><strong>Cài đặt lớp Product và Node – 1 điểm</strong></p><ul><li>File: Product.java / Node.java</li><li>Nhiệm vụ: cài đặt lớp <code>Product</code> (trường <code>code: int</code> — mã sản phẩm duy nhất, <code>price: int</code>) và lớp <code>Node</code> cho cây nhị phân tìm kiếm (chứa 1 <code>Product</code>, con <code>left</code> và <code>right</code>, cùng trường <code>level</code> và <code>bal_factor</code> dùng ở các phần sau của đề).</li></ul>`,
  ),
  starterCode: pnGiven,
  sampleSolution: pnSolved,
  expectedOutput: `(No runnable output on its own — correctness verified structurally: Product has code/price with a constructor and toString "(code,price)"; Node has info/left/right/level/bal_factor and a constructor taking a Product.)`,
  explanation: B(
    `<p>Verified by compiling this file together with the rest of the reference solution (T.java, Sorting.java, Main.java) and running the full program end-to-end successfully — confirming these two classes expose exactly the fields/constructors every other part of the exam depends on.</p>`,
    `<p>Đã kiểm bằng cách biên dịch file này cùng toàn bộ lời giải tham chiếu (T.java, Sorting.java, Main.java) và chạy thành công trọn chương trình — xác nhận 2 lớp này có đúng các trường/constructor mà mọi phần khác của đề phụ thuộc vào.</p>`,
  ),
  rubric: [
    { id: 'product_fields', criterion: B('Product has both code and price fields (int), with a constructor to set them.', 'Product có đủ 2 trường code và price (int), có constructor gán giá trị.'), weight: 1, maxScore: 0.4 },
    { id: 'node_fields', criterion: B('Node holds a Product plus left/right child references and level/bal_factor fields.', 'Node chứa 1 Product cùng tham chiếu con left/right và trường level/bal_factor.'), weight: 1, maxScore: 0.6 },
  ],
};

const q1 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(
    classContext + `<p><strong>Câu I.1: buildFromArray() – 2 marks</strong></p><ul><li>File: T.java</li><li>Method to Complete: <code>buildFromArray(int[][] P)</code></li><li>Task: construct the binary search tree T from the given product array P (P[i] = {code, price}), inserting nodes ordered by code (standard BST insert — no explicit balancing required at this step).</li></ul>`,
    classContext + `<p><strong>Câu I.1: buildFromArray() – 2 điểm</strong></p><ul><li>File: T.java</li><li>Method cần hoàn thiện: <code>buildFromArray(int[][] P)</code></li><li>Nhiệm vụ: dựng cây nhị phân tìm kiếm T từ mảng sản phẩm P cho trước (P[i] = {code, price}), chèn node theo đúng thứ tự code (BST insert chuẩn — chưa cần cân bằng ở bước này).</li></ul>`,
  ),
  starterCode: tGiven,
  sampleSolution: tSolved,
  expectedOutput: `I.1 Build BST from P: done.`,
  explanation: B(
    `<p>Verified by compiling the full reference solution and running Main — standard BST insert with P inserted in order (5,3,2,4,7,6,8,1,9) produces a valid tree ordered by code (verified by in-order traversal giving ascending codes 1-9, see Câu I.2's reverse traversal).</p>`,
    `<p>Đã kiểm bằng cách biên dịch lời giải tham chiếu đầy đủ và chạy Main — BST insert chuẩn với P chèn theo thứ tự (5,3,2,4,7,6,8,1,9) tạo ra cây hợp lệ sắp theo code (kiểm bằng duyệt in-order cho ra code tăng dần 1-9, xem duyệt ngược ở Câu I.2).</p>`,
  ),
  rubric: [
    { id: 'bst_insert', criterion: B('Correctly inserts every product from P into the tree respecting BST ordering by code.', 'Chèn đúng mọi sản phẩm từ P vào cây đúng thứ tự BST theo code.'), weight: 1, maxScore: 1.5 },
    { id: 'no_dupes', criterion: B('Tree ends up with exactly 9 nodes (no product lost or duplicated).', 'Cây có đúng 9 node (không mất hay nhân đôi sản phẩm nào).'), weight: 1, maxScore: 0.5 },
  ],
};

const q2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu I.2: printDescending() – 1 mark</strong></p><ul><li>File: T.java</li><li>Method to Complete: <code>printDescending()</code></li><li>Task: print all products in T in descending order of their code.</li></ul>`,
    `<p><strong>Câu I.2: printDescending() – 1 điểm</strong></p><ul><li>File: T.java</li><li>Method cần hoàn thiện: <code>printDescending()</code></li><li>Nhiệm vụ: in ra mọi sản phẩm trong T theo thứ tự GIẢM DẦN của code.</li></ul>`,
  ),
  starterCode: tGiven,
  sampleSolution: tSolved,
  expectedOutput: `(9,900) (8,800) (7,700) (6,600) (5,500) (4,400) (3,300) (2,200) (1,100)`,
  explanation: B(
    `<p>Verified by compiling and running Main. A reverse in-order traversal (right, node, left) visits nodes ordered by descending code directly, with no need to sort or reverse a collected list.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy Main. Duyệt in-order NGƯỢC (phải, gốc, trái) cho ra đúng thứ tự code giảm dần trực tiếp, không cần sort hay đảo ngược danh sách đã thu thập.</p>`,
  ),
  rubric: [
    { id: 'reverse_inorder', criterion: B('Correctly performs a reverse in-order (right-root-left) traversal printing all 9 products.', 'Duyệt đúng in-order NGƯỢC (phải-gốc-trái) in ra đủ 9 sản phẩm.'), weight: 1, maxScore: 0.7 },
    { id: 'descending_order', criterion: B('Output is in strictly descending order of code.', 'Output đúng thứ tự giảm dần nghiêm ngặt theo code.'), weight: 1, maxScore: 0.3 },
  ],
};

const q3 = {
  kind: 'CODE', points: 0.5, language: 'java',
  prompt: B(
    `<p><strong>Câu I.3: computeLevels() – 0.5 mark</strong></p><ul><li>File: T.java</li><li>Method to Complete: <code>computeLevels()</code></li><li>Task: compute and store the <code>level</code> field for every node — the root has level 0, and each child node has a level equal to its parent's level plus 1.</li></ul>`,
    `<p><strong>Câu I.3: computeLevels() – 0.5 điểm</strong></p><ul><li>File: T.java</li><li>Method cần hoàn thiện: <code>computeLevels()</code></li><li>Nhiệm vụ: tính và lưu trường <code>level</code> cho mọi node — root có level 0, mỗi node con có level bằng level của cha cộng 1.</li></ul>`,
  ),
  starterCode: tGiven,
  sampleSolution: tSolved,
  expectedOutput: `(1,100)[lvl=3,...] (2,200)[lvl=2,...] (3,300)[lvl=1,...] (4,400)[lvl=2,...] (5,500)[lvl=0,...] (6,600)[lvl=2,...] (7,700)[lvl=1,...] (8,800)[lvl=2,...] (9,900)[lvl=3,...]`,
  explanation: B(
    `<p>Verified by compiling and running Main, and by hand-tracing the tree shape from the insertion order (5,3,2,4,7,6,8,1,9): root=5 (level 0); 3 and 7 are 5's direct children (level 1); 2,4 (children of 3) and 6,8 (children of 7) are level 2; 1 (child of 2) and 9 (child of 8) are level 3. A simple pre-order pass setting <code>p.level = parentLevel + 1</code> reproduces this exactly.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy Main, và bằng cách tính tay hình dạng cây từ thứ tự chèn (5,3,2,4,7,6,8,1,9): root=5 (level 0); 3 và 7 là con trực tiếp của 5 (level 1); 2,4 (con của 3) và 6,8 (con của 7) là level 2; 1 (con của 2) và 9 (con của 8) là level 3. Một lượt duyệt pre-order đơn giản gán <code>p.level = parentLevel + 1</code> cho ra đúng kết quả này.</p>`,
  ),
  rubric: [
    { id: 'root_zero', criterion: B('Root node gets level 0.', 'Node root có level 0.'), weight: 1, maxScore: 0.15 },
    { id: 'propagate', criterion: B("Every child node's level is correctly set to its parent's level + 1, for the whole tree.", 'Level của mọi node con được gán đúng bằng level của cha cộng 1, cho toàn cây.'), weight: 1, maxScore: 0.35 },
  ],
};

const q4 = {
  kind: 'CODE', points: 0.5, language: 'java',
  prompt: B(
    `<p><strong>Câu I.4: computeBalFactors() – 0.5 mark</strong></p><ul><li>File: T.java</li><li>Method to Complete: <code>computeBalFactors()</code></li><li>Task: compute and store the <code>bal_factor</code> field for every node, defined as the height of its left subtree minus the height of its right subtree. (Define the height of an empty subtree as -1, so a leaf node has height 0.)</li></ul>`,
    `<p><strong>Câu I.4: computeBalFactors() – 0.5 điểm</strong></p><ul><li>File: T.java</li><li>Method cần hoàn thiện: <code>computeBalFactors()</code></li><li>Nhiệm vụ: tính và lưu trường <code>bal_factor</code> cho mọi node, định nghĩa là chiều cao cây con trái trừ chiều cao cây con phải. (Quy ước chiều cao cây con rỗng là -1, nên node lá có chiều cao 0.)</li></ul>`,
  ),
  starterCode: tGiven,
  sampleSolution: tSolved,
  expectedOutput: `(1,100)[...,bal=0] (2,200)[...,bal=1] (3,300)[...,bal=1] (4,400)[...,bal=0] (5,500)[...,bal=0] (6,600)[...,bal=0] (7,700)[...,bal=-1] (8,800)[...,bal=-1] (9,900)[...,bal=0]`,
  explanation: B(
    `<p>Verified by compiling and running Main, and by hand-computing each node's bal_factor bottom-up: leaves (1,4,6,9) get bal=0. Node 2 (left=1 h=0, right=null h=-1) → bal=1. Node 8 (left=null h=-1, right=9 h=0) → bal=-1. Node 3 (left=2 h=1, right=4 h=0) → bal=1. Node 7 (left=6 h=0, right=8 h=1) → bal=-1. Root 5 (left=3 h=2, right=7 h=2) → bal=0. A single post-order pass computing height while assigning bal_factor on the way up reproduces all of this.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy Main, và bằng cách tính tay bal_factor từng node từ dưới lên: lá (1,4,6,9) có bal=0. Node 2 (trái=1 cao0, phải=null cao-1) → bal=1. Node 8 (trái=null cao-1, phải=9 cao0) → bal=-1. Node 3 (trái=2 cao1, phải=4 cao0) → bal=1. Node 7 (trái=6 cao0, phải=8 cao1) → bal=-1. Root 5 (trái=3 cao2, phải=7 cao2) → bal=0. Một lượt duyệt post-order tính chiều cao và gán bal_factor trên đường đi lên cho ra đúng kết quả này.</p>`,
  ),
  rubric: [
    { id: 'height_calc', criterion: B('Correctly computes subtree height bottom-up, treating an empty subtree as height -1.', 'Tính đúng chiều cao cây con từ dưới lên, coi cây con rỗng có chiều cao -1.'), weight: 1, maxScore: 0.25 },
    { id: 'bal_assign', criterion: B('Correctly assigns bal_factor = height(left) - height(right) for every node.', 'Gán đúng bal_factor = chiều cao(trái) - chiều cao(phải) cho mọi node.'), weight: 1, maxScore: 0.25 },
  ],
};

const q5 = {
  kind: 'CODE', points: 0.5, language: 'java',
  prompt: B(
    `<p><strong>Câu I.5: countNodesIterative() – 0.5 mark</strong></p><ul><li>File: T.java</li><li>Method to Complete: <code>countNodesIterative()</code></li><li>Task: count the total number of nodes of T, using an ITERATIVE traversal with an explicit stack — recursion is not allowed for this method.</li></ul>`,
    `<p><strong>Câu I.5: countNodesIterative() – 0.5 điểm</strong></p><ul><li>File: T.java</li><li>Method cần hoàn thiện: <code>countNodesIterative()</code></li><li>Nhiệm vụ: đếm tổng số node của T, dùng duyệt LẶP (iterative) với 1 stack tường minh — KHÔNG được dùng đệ quy cho method này.</li></ul>`,
  ),
  starterCode: tGiven,
  sampleSolution: tSolved,
  expectedOutput: `I.5 Total node count (iterative, stack): 9`,
  explanation: B(
    `<p>Verified by compiling and running Main. Push the root, then repeatedly pop a node, increment the counter, and push its non-null children — this visits and counts all 9 nodes exactly once each, with no recursion.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy Main. Đẩy root vào stack, rồi lặp lại: lấy 1 node ra, tăng biến đếm, đẩy các con không rỗng của nó vào — cách này thăm và đếm đúng 9 node, mỗi node đúng 1 lần, không dùng đệ quy.</p>`,
  ),
  rubric: [
    { id: 'iterative_stack', criterion: B('Uses an explicit stack (not recursion) to traverse the tree.', 'Dùng stack tường minh (không đệ quy) để duyệt cây.'), weight: 1, maxScore: 0.3 },
    { id: 'correct_count', criterion: B('Returns the correct total node count (9).', 'Trả về đúng tổng số node (9).'), weight: 1, maxScore: 0.2 },
  ],
};

const q6 = {
  kind: 'CODE', points: 0.75, language: 'java',
  prompt: B(
    `<p><strong>Câu I.6: isHeightBalanced() – 0.75 mark</strong></p><ul><li>File: T.java</li><li>Method to Complete: <code>isHeightBalanced()</code></li><li>Task: check whether T is height-balanced — every node's <code>bal_factor</code> (already computed by <code>computeBalFactors()</code>, called beforehand) must be in the range [-1, 1].</li></ul>`,
    `<p><strong>Câu I.6: isHeightBalanced() – 0.75 điểm</strong></p><ul><li>File: T.java</li><li>Method cần hoàn thiện: <code>isHeightBalanced()</code></li><li>Nhiệm vụ: kiểm tra T có cân bằng chiều cao không — <code>bal_factor</code> của mọi node (đã tính sẵn bởi <code>computeBalFactors()</code>, gọi trước đó) phải nằm trong khoảng [-1, 1].</li></ul>`,
  ),
  starterCode: tGiven,
  sampleSolution: tSolved,
  expectedOutput: `I.6 Is T height-balanced? true`,
  explanation: B(
    `<p>Verified by compiling and running Main. Every node's bal_factor computed in Câu I.4 is in {-1, 0, 1} (max magnitude 1, at nodes 2, 3, 7, 8) — so the tree is height-balanced, matching a full traversal check that no node exceeds the [-1, 1] range.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy Main. Mọi bal_factor tính ở Câu I.4 đều thuộc {-1, 0, 1} (lớn nhất về độ lớn là 1, ở các node 2, 3, 7, 8) — nên cây cân bằng chiều cao, khớp với việc duyệt toàn cây không thấy node nào vượt khoảng [-1, 1].</p>`,
  ),
  rubric: [
    { id: 'full_traversal', criterion: B('Checks the bal_factor condition across every node in the tree, not just the root.', 'Kiểm tra điều kiện bal_factor trên MỌI node trong cây, không chỉ root.'), weight: 1, maxScore: 0.5 },
    { id: 'correct_verdict', criterion: B('Returns the correct boolean verdict (true for this tree).', 'Trả về đúng kết quả boolean (true với cây này).'), weight: 1, maxScore: 0.25 },
  ],
};

const q7 = {
  kind: 'CODE', points: 1.5, language: 'java',
  prompt: B(
    `<p><strong>Câu II.1: sortDescendingByPrice() – 1.5 marks</strong></p><ul><li>File: Sorting.java</li><li>Method to Complete: <code>sortDescendingByPrice(Product[] a)</code></li><li>Task: sort a given product array in descending order of price, using an algorithm with the LOWEST POSSIBLE average-case time complexity.</li></ul>`,
    `<p><strong>Câu II.1: sortDescendingByPrice() – 1.5 điểm</strong></p><ul><li>File: Sorting.java</li><li>Method cần hoàn thiện: <code>sortDescendingByPrice(Product[] a)</code></li><li>Nhiệm vụ: sắp xếp mảng sản phẩm GIẢM DẦN theo price, dùng thuật toán có độ phức tạp thời gian trung bình (average-case) THẤP NHẤT CÓ THỂ.</li></ul>`,
  ),
  starterCode: sortGiven,
  sampleSolution: sortSolved,
  expectedOutput: `(9,900) (8,800) (7,700) (6,600) (5,500) (4,400) (3,300) (2,200) (1,100)`,
  explanation: B(
    `<p>Verified by compiling and running Main. Quicksort (average-case O(n log n), the best average complexity achievable by a comparison-based sort) with the partition comparison flipped to descending order correctly sorts P — and since price = 100×code in this dataset, the result matches Câu I.2's descending-by-code order exactly.</p>`,
    `<p>Đã kiểm bằng cách biên dịch và chạy Main. Quicksort (trung bình O(n log n), độ phức tạp trung bình tốt nhất có thể với sort dựa trên so sánh) với phép so sánh trong partition đảo ngược thành giảm dần sắp đúng P — và vì price = 100×code trong dữ liệu này, kết quả khớp chính xác thứ tự giảm dần theo code của Câu I.2.</p>`,
  ),
  rubric: [
    { id: 'correct_sort', criterion: B('Correctly sorts the array in descending order of price.', 'Sắp xếp đúng mảng giảm dần theo price.'), weight: 1, maxScore: 0.9 },
    { id: 'lowest_avg_complexity', criterion: B('Uses an algorithm with average-case O(n log n) time complexity (e.g. quicksort, merge sort, or heap sort) rather than an O(n²) algorithm.', 'Dùng thuật toán có độ phức tạp trung bình O(n log n) (ví dụ quicksort, merge sort, heap sort) thay vì thuật toán O(n²).'), weight: 1, maxScore: 0.6 },
  ],
};

const q8 = {
  kind: 'WRITE', points: 0.5,
  prompt: B(
    `<p><strong>Câu II.2: – 0.5 mark</strong></p><p>Briefly explain why you chose the sorting algorithm used in Câu II.1.</p>`,
    `<p><strong>Câu II.2: – 0.5 điểm</strong></p><p>Giải thích ngắn gọn vì sao bạn chọn thuật toán sắp xếp đã dùng ở Câu II.1.</p>`,
  ),
  sampleSolution: B(
    `<p>Quicksort was chosen because its average-case time complexity is O(n log n) — the best average performance achievable among comparison-based sorting algorithms, shared with merge sort and heap sort. Compared to those alternatives, quicksort sorts in-place (only O(log n) auxiliary space from recursion, versus O(n) extra array for merge sort) and has smaller constant factors in practice, since it works directly on the array with simple index swaps rather than allocating/merging auxiliary arrays or maintaining a heap-order invariant.</p>`,
    `<p>Chọn Quicksort vì độ phức tạp thời gian trung bình là O(n log n) — hiệu năng trung bình tốt nhất có thể đạt được trong số các thuật toán sắp xếp dựa trên so sánh, ngang với merge sort và heap sort. So với hai lựa chọn đó, quicksort sắp xếp tại chỗ (in-place, chỉ tốn O(log n) bộ nhớ phụ từ đệ quy, so với O(n) mảng phụ của merge sort) và có hằng số thực tế nhỏ hơn, vì nó thao tác trực tiếp trên mảng bằng phép hoán đổi chỉ số đơn giản thay vì phải cấp phát/gộp mảng phụ hay duy trì tính chất heap.</p>`,
  ),
  rubric: [
    { id: 'complexity_reason', criterion: B('States that the chosen algorithm has average-case O(n log n) complexity, the best achievable for a comparison-based sort.', 'Nêu được thuật toán đã chọn có độ phức tạp trung bình O(n log n), tốt nhất có thể với sort dựa trên so sánh.'), weight: 1, maxScore: 0.35 },
    { id: 'practical_reason', criterion: B('Gives at least one concrete practical reason (space, constant factors, in-place) supporting the choice.', 'Nêu được ít nhất 1 lý do thực tế cụ thể (bộ nhớ, hằng số, in-place) ủng hộ lựa chọn.'), weight: 1, maxScore: 0.15 },
  ],
};

const q9 = {
  kind: 'CODE', points: 1.75, language: 'java',
  prompt: B(
    `<p><strong>Câu III: Main Function – 1.75 marks</strong></p><ul><li>File: Main.java</li><li>Task: (III.1) build the BST T from the given array P; (III.2) call and test all functions implemented in Part I and Part II; (III.3) display the output results for each step.</li></ul>`,
    `<p><strong>Câu III: Hàm Main – 1.75 điểm</strong></p><ul><li>File: Main.java</li><li>Nhiệm vụ: (III.1) dựng cây BST T từ mảng P cho trước; (III.2) gọi và kiểm thử mọi hàm đã cài đặt ở Phần I và Phần II; (III.3) hiển thị kết quả output cho từng bước.</li></ul>`,
  ),
  starterCode: mainGiven,
  sampleSolution: mainSolved,
  expectedOutput: `I.1 Build BST from P: done.
I.2 Products in descending order of code:
(9,900) (8,800) (7,700) (6,600) (5,500) (4,400) (3,300) (2,200) (1,100)
I.3/I.4 Products with level and bal_factor (in-order):
(1,100)[lvl=3,bal=0] (2,200)[lvl=2,bal=1] (3,300)[lvl=1,bal=1] (4,400)[lvl=2,bal=0] (5,500)[lvl=0,bal=0] (6,600)[lvl=2,bal=0] (7,700)[lvl=1,bal=-1] (8,800)[lvl=2,bal=-1] (9,900)[lvl=3,bal=0]
I.5 Total node count (iterative, stack): 9
I.6 Is T height-balanced? true
II.1 Products sorted descending by price: (9,900) (8,800) (7,700) (6,600) (5,500) (4,400) (3,300) (2,200) (1,100)`,
  explanation: B(
    `<p>Verified by compiling the full reference solution end-to-end and running it — this is the actual console output produced. Main builds T from P, calls every Part I/II function in order, and prints the result of each one.</p>`,
    `<p>Đã kiểm bằng cách biên dịch toàn bộ lời giải tham chiếu và chạy thật — đây là output console thực tế. Main dựng T từ P, gọi mọi hàm Phần I/II theo thứ tự, và in ra kết quả từng bước.</p>`,
  ),
  rubric: [
    { id: 'build_t', criterion: B('Correctly builds T from the given array P.', 'Dựng đúng T từ mảng P cho trước.'), weight: 1, maxScore: 0.5 },
    { id: 'call_all', criterion: B('Calls every function from Part I (buildFromArray, printDescending, computeLevels, computeBalFactors, countNodesIterative, isHeightBalanced) and Part II (sortDescendingByPrice).', 'Gọi đủ mọi hàm ở Phần I (buildFromArray, printDescending, computeLevels, computeBalFactors, countNodesIterative, isHeightBalanced) và Phần II (sortDescendingByPrice).'), weight: 1, maxScore: 0.75 },
    { id: 'display_results', criterion: B('Displays the output/result of each step so it is visible when the program runs.', 'Hiển thị output/kết quả của từng bước để thấy được khi chạy chương trình.'), weight: 1, maxScore: 0.5 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE7',
    title: 'PE Đề 7 — Practical Exam (Fall 2025, PaperNo_1)|||PE Đề 7 — Thi thực hành (Fall 2025, PaperNo_1)',
    description: 'CSD201 PE (CODE): build a BST from scratch (no given project) — construction, traversal, level/balance-factor, iterative count, height-balance check, plus a descending sort, AI-graded.|||PE CSD201 (viết mã): tự dựng BST từ đầu (không có project given) — dựng cây, duyệt, level/bal_factor, đếm lặp, kiểm cân bằng chiều cao, kèm sắp xếp giảm dần, chấm AI.',
    durationMinutes: 85,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions: [q0, q1, q2, q3, q4, q5, q6, q7, q8, q9],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(__biNormalize(spec), null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
