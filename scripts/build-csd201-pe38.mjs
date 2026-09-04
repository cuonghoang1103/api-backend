/**
 * build-csd201-pe38.mjs — sinh content/exams/CSD201-PE38.mjs.
 *
 * Nguồn thật: paperno_10.rar (Đề "SP 2024 Đề số 10"), 3 project:
 * Q1=MyList (Bottle: maker/volume/color, skip maker='A', 4 câu) +
 * Q2=BSTree (Bottle: maker/volume/color, khoá volume, skip maker=
 * 'A', convention CHUẨN, 4 câu) + Q3=Graph (BFS+vị trí, Dijkstra,
 * 2 câu) = 10 câu, 10 điểm. (Đề 37 bị SKIP vì không có given
 * materials — chỉ có paper.pdf, không compile-verify được.)
 *
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main mỗi project. Q1 khớp
 * byte-for-byte 4/4. Q3 khớp byte-for-byte 2/2.
 *
 * ⚠️ Q2 có 3/4 câu (f1, f3, f4) LỆCH minh hoạ của đề — nhưng được
 * xác nhận CHÉO rất vững: f2 và f4's dòng preOrder (toàn cây) đều
 * khớp TUYỆT ĐỐI với minh hoạ của chính đề, và cả hai dùng CHUNG
 * MỘT bộ dữ liệu (data.txt f2/f3/f4 giống hệt nhau) — nghĩa là hình
 * dạng cây đã được xác nhận đúng bởi 2 nguồn độc lập trong cùng đề.
 *   - f1 dùng data.txt RIÊNG (khác f2/f3/f4) — minh hoạ BFS+inOrder
 *     của đề không khớp cây suy ra từ chính data.txt đó dưới BẤT KỲ
 *     convention nào (đã thử cả chuẩn lẫn mirrored) — dùng số thật.
 *   - f3: minh hoạ postorder của đề KHÔNG PHẢI một postorder hợp lệ
 *     của cây đã xác nhận đúng (không chỉ lệch 1 phần tử — toàn bộ
 *     thứ tự khác, không thể là lỗi đánh máy nhỏ) — dùng số thật.
 *   - f4: minh hoạ đổi nhầm node H (vốn không có con phải, không đủ
 *     điều kiện "node có con phải") thay vì F (node THẬT SỰ là node
 *     thứ 3 có con phải theo pre-order) — nhưng trùng hợp cùng k=6
 *     (100+6=106) nên chỉ CÓ THỂ là chọn nhầm node p, không phải
 *     sai công thức. Dùng p=F (đã verify).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE38.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE38.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE38-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "SP 2024 Đề số 10").</p>
   <ol>
     <li>Ignore the real meaning of objects, variables and their values in the questions below.</li>
     <li>Each question below is graded independently (1 mark each). Your job is to complete only the method bodies. Do not change method signatures or add new import statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>
   <p><strong>Note on Q2:</strong> 3 of its 4 questions (f1, f3, f4) disagree with the source paper's own illustrated example, but are backed by strong cross-verification within the same paper: f2 and f4 both independently reproduce the paper's own pre-order line exactly, from the SAME shared data block used by f3 — confirming the tree shape from two independent angles. f1 uses a separate data block whose paper illustration cannot be reproduced under either standard or mirrored BST convention. f3's illustrated post-order is not a valid post-order of the confirmed tree at all (not a minor typo). f4's illustration edits the wrong node (one with no right child, which cannot be "the 3rd node having a right child") though it lands on the same numeric offset by coincidence. All three use our own verified compiled output instead.</p>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "SP 2024 Đề số 10").</p>
   <ol>
     <li>Không cần để ý ý nghĩa thực của đối tượng/biến/giá trị trong các câu dưới đây.</li>
     <li>Mỗi câu dưới đây được chấm ĐỘC LẬP (1 điểm mỗi câu). Chỉ hoàn thiện phần thân method. Không đổi chữ ký method hay thêm import mới.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>
   <p><strong>Lưu ý về Câu 2:</strong> 3/4 câu (f1, f3, f4) lệch minh hoạ của chính đề, nhưng được xác nhận CHÉO rất vững trong cùng đề: f2 và f4 đều tái tạo đúng tuyệt đối dòng pre-order minh hoạ của đề, từ CHUNG một khối dữ liệu mà f3 cũng dùng — xác nhận hình dạng cây đúng từ 2 góc độc lập. f1 dùng khối dữ liệu riêng mà minh hoạ của đề không thể tái tạo dưới bất kỳ convention nào (đã thử cả chuẩn lẫn mirrored). Minh hoạ postorder của f3 hoàn toàn không phải một postorder hợp lệ của cây đã xác nhận đúng (không phải lỗi đánh máy nhỏ). Minh hoạ f4 sửa nhầm node (một node không có con phải, không thể là "node thứ 3 có con phải") dù trùng hợp ra cùng con số — chỉ có thể là chọn nhầm node, không phải sai công thức. Cả 3 câu dùng kết quả biên dịch thật đã verify.</p>`,
);

const rd = (p) => fs.readFileSync(p, 'utf8');
const SOLVED = '/tmp/csd201-pe38b-src';
const ORIG = '/tmp/csd201-pe38-orig/PaperNo_10';

const q1ListSolved = rd(path.join(SOLVED, 'Q1/src/MyList.java'));
const q1ListStarter = rd(path.join(ORIG, 'Q1/src/MyList.java'));
const q2TreeSolved = rd(path.join(SOLVED, 'Q2/src/BSTree.java'));
const q2TreeStarter = rd(path.join(ORIG, 'Q2/src/BSTree.java'));
const q3GraphSolved = rd(path.join(SOLVED, 'Q3/src/Graph.java'));
const q3GraphStarter = rd(path.join(ORIG, 'Q3/src/Graph.java'));

const Q1_SCENARIO = B(
  `<p><strong>Question 1 (4 marks, file MyList.java).</strong> The class <code>Bottle</code> with 3 data members: maker, volume and color is given (do not edit it). <code>MyList</code> is a linked list of Bottle objects.</p>`,
  `<p><strong>Câu 1 (4 điểm, file MyList.java).</strong> Lớp <code>Bottle</code> (maker, volume, color) đã có sẵn (không sửa). <code>MyList</code> là danh sách liên kết các Bottle.</p>`,
);
const Q2_SCENARIO = B(
  `<p><strong>Question 2 (4 marks, file BSTree.java).</strong> The class <code>Bottle</code> with 3 data members: maker, volume and color is given (do not edit it). <code>BSTree</code> is a binary search tree of Bottle objects. <strong>The variable volume is the key of the tree, thus it must be unique.</strong></p>`,
  `<p><strong>Câu 2 (4 điểm, file BSTree.java).</strong> Lớp <code>Bottle</code> (maker, volume, color) đã có sẵn (không sửa). <code>BSTree</code> là cây BST các Bottle. <strong>Biến volume là khoá của cây, phải duy nhất.</strong></p>`,
);
const Q3_SCENARIO = B(
  `<p><strong>Question 3 (2 marks, file Graph.java).</strong> The class <code>Graph</code> implements a graph (adjacency matrix, vertices labeled A..P via <code>v[]</code>).</p>`,
  `<p><strong>Câu 3 (2 điểm, file Graph.java).</strong> Lớp <code>Graph</code> cài đặt đồ thị (ma trận kề, đỉnh gắn nhãn A..P qua <code>v[]</code>).</p>`,
);

function mkQ(points, prompt, starter, solved, expectedOutput, explanation, rubricCriterion) {
  return {
    kind: 'CODE', points, language: 'java', prompt, starterCode: starter, sampleSolution: solved,
    expectedOutput, explanation,
    rubric: [{ id: 'correct', criterion: rubricCriterion, weight: 1, maxScore: points }],
  };
}

const q1f1 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void addLast(String xMaker, int xVolume, int xColor)</strong> — check if xMaker.charAt(0) == 'A' then do nothing, otherwise add a new node to the end of the list.</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete addLast() above only.</p>`,
    `<p><strong>void addLast(String xMaker, int xVolume, int xColor)</strong> — nếu xMaker.charAt(0) == 'A' thì không làm gì, ngược lại thêm node mới vào cuối danh sách.</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện addLast() ở trên.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(B,5,3) (C,6,5) (D,2,4) (E,7,9) (F,4,-7) (G,-3,2)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte (A is correctly excluded).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề (A bị loại đúng).</p>`),
  B("addLast() correctly skips maker starting with 'A' and appends at tail otherwise.", "addLast() bỏ qua đúng maker bắt đầu bằng 'A', ngược lại thêm vào cuối."),
);

const q1f2 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f2()</strong> — Three Bottle objects x, y, z are given. Assume the list contains at least 3 elements. Write statements to insert x, y and z into the list so that x, y and z will be at positions 1, 2 and 4 (the head's position is 0).</p>`,
    `<p><strong>void f2()</strong> — Có sẵn 3 đối tượng Bottle x, y, z. Giả sử danh sách có ít nhất 3 phần tử. Chèn x, y, z sao cho ở vị trí 1, 2 và 4 (head là vị trí 0).</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9) (J,3,7)\n(C,9,8) (X,1,2) (Y,2,3) (D,6,3) (Z,3,4) (E,8,5) (F,5,4) (I,4,9) (J,3,7)`,
  B(`<p>Verified by compiling against the real given project — matches the paper's expected example byte-for-byte on both lines. Insert x at position 1, y at 2, z at 4, applied sequentially.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng. Chèn x tại vị trí 1, y tại 2, z tại 4, áp dụng tuần tự.</p>`),
  B('Correctly inserts x, y, z at positions 1, 2, 4 applied sequentially.', 'Chèn đúng x, y, z tại vị trí 1, 2, 4, áp dụng tuần tự.'),
);

const q1f3 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f3()</strong> — Assume the list contains at least 3 elements. Remove the FIRST node having the MAXIMUM color and insert it at position 1 (the head's position is 0).</p>`,
    `<p><strong>void f3()</strong> — Giả sử danh sách có ít nhất 3 phần tử. Gỡ node ĐẦU TIÊN có color LỚN NHẤT rồi chèn lại vào vị trí 1 (head là vị trí 0).</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,7,6) (D,6,7) (E,3,8) (F,7,9) (G,8,7) (H,4,9) (I,8,3)\n(C,7,6) (F,7,9) (D,6,7) (E,3,8) (G,8,7) (H,4,9) (I,8,3)`,
  B(`<p>Verified by compiling against the real given project — matches the paper's expected example byte-for-byte. Colors: C6,D7,E8,F9,G7,H9,I3 — max=9, tied between F and H, the FIRST (F) is removed and reinserted at position 1.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — khớp byte-for-byte với ví dụ trong đề. Color: C6,D7,E8,F9,G7,H9,I3 — max=9, trùng giữa F và H, gỡ node ĐẦU (F) rồi chèn lại vị trí 1.</p>`),
  B('Correctly finds the first node with maximum color, removes and reinserts it at position 1.', 'Tìm đúng node đầu tiên có color lớn nhất, gỡ và chèn lại đúng vị trí 1.'),
);

const q1f4 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f4()</strong> — Assume the list contains at least 6 elements and p is the 6th element in the list. Change the color of p to 88, then sort all elements before p in ascending order of color.</p>`,
    `<p><strong>void f4()</strong> — Giả sử danh sách có ít nhất 6 phần tử, p là phần tử thứ 6. Đổi color của p thành 88, rồi sắp mọi phần tử TRƯỚC p tăng dần theo color.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,9,8) (D,11,12) (E,8,7) (F,1,2) (I,7,9) (J,6,8) (K,5,6) (L,9,8) (M,3,4)\n(F,1,2) (E,8,7) (C,9,8) (I,7,9) (D,11,12) (J,6,88) (K,5,6) (L,9,8) (M,3,4)`,
  B(`<p>Verified by compiling against the real given project — matches the paper's expected example byte-for-byte. p is J (6th element); J's color becomes 88. The 5 elements before it (C,D,E,F,I) are sorted ascending by color: F(2),E(7),C(8),I(9),D(12).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — khớp byte-for-byte với ví dụ trong đề. p là J (phần tử thứ 6); color của J thành 88. 5 phần tử trước nó (C,D,E,F,I) sắp tăng dần theo color: F(2),E(7),C(8),I(9),D(12).</p>`),
  B('Correctly identifies the 6th element, sets its color to 88, and sorts exactly the elements before it ascending by color.', 'Xác định đúng phần tử thứ 6, đổi color thành 88, sắp đúng các phần tử trước nó tăng dần theo color.'),
);

const q2f1 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void insert(String xMaker, int xVolume, int xColor)</strong> — check if xMaker.charAt(0) == 'A' then do nothing, otherwise insert a new Bottle object into the tree.</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete insert() above only. Output (line 1: breadth first traversal, line 2: in-order traversal).</p>`,
    `<p><strong>void insert(String xMaker, int xVolume, int xColor)</strong> — nếu xMaker.charAt(0) == 'A' thì không làm gì, ngược lại chèn Bottle mới vào cây.</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện insert() ở trên. Kết quả (dòng 1: BFS, dòng 2: in-order).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(B,9,4) (C,4,3) (E,2,5) (D,8,6) (F,-6,7) (Y,6,-7)\n(F,-6,7) (E,2,5) (C,4,3) (Y,6,-7) (D,8,6) (B,9,4)`,
  B(`<p>Verified by compiling against the real given project and running choice 1. Standard recursive BST insert comparing <code>volume</code>, skipping maker starting with 'A' and X (volume=4, a duplicate of C's key, correctly excluded). <strong>Note:</strong> the paper's own illustration for this specific data block shows a different BFS/in-order arrangement that cannot be reproduced under either the standard or mirrored BST convention from the real bundled data — a likely stale/mismatched screenshot. This exam uses our own verified compiled output.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1. Chèn BST đệ quy chuẩn theo <code>volume</code>, bỏ qua maker bắt đầu bằng 'A' và X (volume=4, trùng khoá với C, bị loại đúng). <strong>Lưu ý:</strong> minh hoạ của chính đề cho khối dữ liệu này thể hiện thứ tự BFS/in-order khác, không thể tái tạo dưới convention chuẩn lẫn mirrored từ dữ liệu thật đi kèm — nhiều khả năng ảnh chụp cũ/lệch. Đề này dùng kết quả biên dịch thật đã verify.</p>`),
  B('Correctly inserts following standard BST rules keyed by volume, skipping maker A and the duplicate-key node.', 'Chèn đúng theo luật BST chuẩn khoá theo volume, bỏ qua maker A và node trùng khoá.'),
);

const q2f2 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f2()</strong> — Perform a pre-order traversal from the root but write to file f2.txt only nodes with volume&lt;7. Hint: copy the function preOrder(...) to function preOrder2(...) and modify it. Output (line 1: pre-order for whole tree, line 2: pre-order for f2 requirement).</p>`,
    `<p><strong>void f2()</strong> — Duyệt pre-order từ root, chỉ ghi ra f2.txt các node có volume&lt;7. Gợi ý: sao chép preOrder(...) thành preOrder2(...) rồi sửa. Kết quả (dòng 1: pre-order toàn cây, dòng 2: pre-order theo yêu cầu f2).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,8,2) (D,6,1) (F,2,-1) (I,1,7) (K,-1,5) (J,3,9) (L,5,10) (M,4,6) (G,7,3) (E,9,4) (H,10,8)\n(D,6,1) (F,2,-1) (I,1,7) (K,-1,5) (J,3,9) (L,5,10) (M,4,6)`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte on both lines, confirming this tree structure is correct (this dataset is shared verbatim by f2, f3 and f4).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng, xác nhận cấu trúc cây đúng (dữ liệu này dùng chung y hệt cho f2, f3, f4).</p>`),
  B('Correctly performs pre-order traversal displaying only nodes with volume < 7.', 'Duyệt pre-order đúng, chỉ hiển thị node có volume < 7.'),
);

const q2f3 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f3()</strong> — Assume p is the 6th node in the post-order traversal from the root. Delete node p by copying.</p>`,
    `<p><strong>void f3()</strong> — Gọi p là node thứ 6 trong duyệt post-order từ root. Xoá node p bằng kỹ thuật xoá-bằng-copy.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(K,-1,5) (I,1,7) (M,4,6) (L,5,10) (J,3,9) (F,2,-1) (G,7,3) (D,6,1) (H,10,8) (E,9,4) (C,8,2)\n(K,-1,5) (M,4,6) (L,5,10) (J,3,9) (I,1,7) (G,7,3) (D,6,1) (H,10,8) (E,9,4) (C,8,2)`,
  B(`<p>Verified by compiling against the real given project and running choice 3. The tree is the same one confirmed correct in f2/f4 (identical data block). Its real post-order is K,I,M,L,J,F,G,D,H,E,C — the 6th node is F. F has two children (I,J); delete-by-copy replaces F with its in-order predecessor (I, the rightmost node of F's left subtree), then removes I from its old position (K takes I's place). <strong>Note:</strong> the paper's own illustrated "before" line for f3 (F,D,G,M,K,I,L,J,H,E,C) is not a valid post-order of this confirmed tree at all — not a minor typo, a mismatched illustration. This exam uses our own verified compiled output.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 3. Cây giống hệt cây đã xác nhận đúng ở f2/f4 (cùng khối dữ liệu). Postorder thật: K,I,M,L,J,F,G,D,H,E,C — node thứ 6 là F. F có 2 con (I,J); xoá-bằng-copy thay F bằng tiền nhiệm in-order (I, node ngoài cùng bên phải của cây con trái F), rồi gỡ I khỏi vị trí cũ (K lên thay chỗ I). <strong>Lưu ý:</strong> dòng "trước" minh hoạ của chính đề cho f3 (F,D,G,M,K,I,L,J,H,E,C) hoàn toàn không phải một postorder hợp lệ của cây đã xác nhận đúng này — không phải lỗi đánh máy nhỏ, mà là minh hoạ lệch. Đề này dùng kết quả biên dịch thật đã verify.</p>`),
  B('Correctly identifies the 6th post-order node and deletes it by copying.', 'Xác định đúng node thứ 6 theo post-order và xoá đúng bằng kỹ thuật xoá-bằng-copy.'),
);

const q2f4 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f4()</strong> — Assume p is the 3rd node having a right child in the pre-order traversal from the root. Count the number of nodes in the sub-tree with root p. If this number is k, change p.info.volume to 100+k.</p>`,
    `<p><strong>void f4()</strong> — Gọi p là node thứ 3 có con phải khi duyệt pre-order từ root. Đếm số node trong cây con gốc p — gọi số đó là k. Đổi p.info.volume thành 100+k.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,8,2) (D,6,1) (F,2,-1) (I,1,7) (K,-1,5) (J,3,9) (L,5,10) (M,4,6) (G,7,3) (E,9,4) (H,10,8)\n(C,8,2) (D,6,1) (F,106,-1) (I,1,7) (K,-1,5) (J,3,9) (L,5,10) (M,4,6) (G,7,3) (E,9,4) (H,10,8)`,
  B(`<p>Verified by compiling against the real given project and running choice 4. Same confirmed tree as f2/f3. Pre-order nodes with a right child, in order: C(1st, right=E), D(2nd, right=G), F(3rd, right=J) — so p=F. F's subtree {F,I,K,J,L,M} has 6 nodes, so F.info.volume becomes 100+6=106. <strong>Note:</strong> the paper's own illustration instead edits H — but H is a pre-order leaf with NO right child at all, so it cannot possibly be "the 3rd node having a right child"; it only happens to land on the same final digits (106) by coincidence (k=6 either way), which is why this was caught as a wrong-node selection rather than a formula error. This exam uses our own verified compiled output (F, not H).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4. Cùng cây đã xác nhận ở f2/f3. Các node có con phải theo pre-order: C(1st, phải=E), D(2nd, phải=G), F(3rd, phải=J) — vậy p=F. Cây con của F {F,I,K,J,L,M} có 6 node, nên volume của F thành 100+6=106. <strong>Lưu ý:</strong> minh hoạ của chính đề lại sửa H — nhưng H là node lá theo pre-order, KHÔNG có con phải, nên không thể là "node thứ 3 có con phải"; nó chỉ trùng đúng con số cuối (106) một cách ngẫu nhiên (k=6 dù tính theo cách nào) — đây chính là lý do phát hiện ra là chọn NHẦM NODE chứ không phải sai công thức. Đề này dùng kết quả biên dịch thật đã verify (F, không phải H).</p>`),
  B('Correctly identifies the 3rd pre-order node with a right child (F, not H) and updates its volume to 100+k.', 'Xác định đúng node thứ 3 có con phải theo pre-order (F, không phải H) và đổi đúng volume thành 100+k.'),
);

const q3f1 = mkQ(1,
  Q3_SCENARIO + B(
    `<p><strong>void f1()</strong> — Perform a breadth-first traversal (to f1.txt) from vertex i=3 (vertex D), but display only 6 vertices, from the 3rd vertex to the 8th vertex. Hint: copy breadth(...) to breadth2(...) and modify it.</p>`,
    `<p><strong>void f1()</strong> — Duyệt BFS (ra f1.txt) từ đỉnh i=3 (đỉnh D), chỉ hiển thị 6 đỉnh, từ vị trí thứ 3 tới thứ 8. Gợi ý: sao chép breadth(...) thành breadth2(...) rồi sửa.</p>`
  ),
  q3GraphStarter, q3GraphSolved,
  `D A G B C E H I F\nG B C E H I`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte on both lines. BFS from D gives D,A,G,B,C,E,H,I,F; positions 3-8 (1-indexed) are G,B,C,E,H,I.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng. BFS từ D cho D,A,G,B,C,E,H,I,F; vị trí 3-8 (1-indexed) là G,B,C,E,H,I.</p>`),
  B('Correctly computes the BFS-from-D order and displays exactly positions 3-8.', 'Tính đúng thứ tự BFS từ D và hiển thị đúng vị trí 3-8.'),
);

const q3f2 = mkQ(1,
  Q3_SCENARIO + B(
    `<p><strong>void f2()</strong> — Apply Dijkstra's shortest path algorithm to find (1) the shortest path from vertex 1 (B) to vertex 5 (F), then (2) from vertex 0 (A) to vertex 6 (G). Write 3 lines to f2.txt: line 1 contains the vertices in the shortest path (1), line 2 contains the last 4 vertices selected into the set S in (2), line 3 contains the vertices with their labels in the shortest path (2). (99 = infinity.)</p>`,
    `<p><strong>void f2()</strong> — Áp dụng Dijkstra tìm (1) đường đi ngắn nhất từ đỉnh 1 (B) tới đỉnh 5 (F), rồi (2) từ đỉnh 0 (A) tới đỉnh 6 (G). Ghi 3 dòng vào f2.txt: dòng 1 là đường đi ngắn nhất (1), dòng 2 là 4 đỉnh CUỐI vào S trong (2), dòng 3 là đường đi ngắn nhất (2) kèm nhãn+khoảng cách. (99 = vô cực.)</p>`
  ),
  q3GraphStarter, q3GraphSolved,
  `B C E D F\nE D F G\nA|0 B|10 C|12 E|15 D|19 G|29`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte on all 3 lines. Reuses the standard vertex-index edge filter (<code>w != u</code>, not <code>wt > 0</code>) since this graph has a genuine 0-weight edge (H→A=0), same graph family as other CSD201 papers this batch.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề ở cả 3 dòng. Tái dùng cách lọc cạnh theo chỉ số đỉnh chuẩn (<code>w != u</code>, không phải <code>wt > 0</code>) vì đồ thị này có cạnh trọng số 0 thật (H→A=0), cùng gia đình đồ thị với các đề CSD201 khác trong đợt này.</p>`),
  B('Correct Dijkstra: correct shortest path (1) B→F, correct last-4-selected for (2), and correct shortest path (2) A→G with labels+distances.', 'Dijkstra đúng: đúng đường đi ngắn nhất (1) B→F, đúng 4 đỉnh cuối vào S của (2), và đúng đường đi ngắn nhất (2) A→G kèm nhãn+khoảng cách.'),
);

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE38-SP24D10',
    title: 'PE Đề 38 — Practical Exam (SP 2024, Đề số 10)|||PE Đề 38 — Thi thực hành (SP 2024, Đề số 10)',
    description: 'CSD201 PE (CODE): linked list (Bottle) + BST (Bottle, khoá volume, convention chuẩn) + Graph (BFS+vị trí, Dijkstra), AI-graded, 10 câu 1đ. Q2 có 3 câu ghi chú lỗi minh hoạ đề, xác nhận chéo vững.|||PE CSD201 (viết mã): danh sách liên kết (Bottle) + BST (Bottle, khoá volume, convention chuẩn) + Đồ thị (BFS+vị trí, Dijkstra), chấm AI, 10 câu 1đ. Q2 có 3 câu ghi chú lỗi minh hoạ đề, xác nhận chéo vững.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE38-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1f1, q1f2, q1f3, q1f4, q2f1, q2f2, q2f3, q2f4, q3f1, q3f2],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
