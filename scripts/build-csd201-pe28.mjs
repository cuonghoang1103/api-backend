/**
 * build-csd201-pe28.mjs — sinh content/exams/CSD201-PE28.mjs.
 *
 * Nguồn thật: csd201_fa24_pe_785660.zip (Đề "FA 2024 - Đề số 10" —
 * cùng tên file với PE Đề 27 nhưng checksum khác, "PaperNo_10" thay
 * vì "PaperNo_3"), 3 project riêng, mỗi hàm f1-fN là 1 câu 1đ.
 * Q1=MyList (Cala) — DATA.TXT VÀ SOURCE GIỐNG HỆT PE Đề 27's Q1, đã
 * tái dùng lời giải đã verify ở đó thay vì làm lại từ đầu. Q2=BSTree
 * (Cala, khoá HORN thay vì color — dữ liệu số giống PE27 nhưng cột
 * khoá khác, cây kết quả trùng hình dạng cây của PE27's Q2 một cách
 * không cố ý). Q3=Graph — data.txt giống PE27's Q3 nhưng định dạng
 * output khác.
 *
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main mỗi project, đủ mọi lựa
 * chọn — TOÀN BỘ 10 câu khớp byte-for-byte 100% với ví dụ trong đề.
 *
 * ⚠️ PHÁT HIỆN QUAN TRỌNG: Q2-f4's "Rotate p to the right" ở ĐỀ NÀY
 * là phép XOAY CON TRỎ CHUẨN GIÁO TRÌNH (thật sự tái cấu trúc cây),
 * KHÔNG PHẢI chỉ đổi dữ liệu như quy ước đã xác nhận 5 lần ở các đề
 * khác trong phiên này (PE Đề 13,16,17,20,24,27). Đã thử cách đổi dữ
 * liệu trước — không khớp minh hoạ của đề này; đổi sang phép xoay
 * con trỏ chuẩn (p.left thành gốc mới, p thành con phải của nó,
 * subtree phải cũ của con trái chuyển sang dưới p) — khớp CHÍNH XÁC
 * cả 11 node, mọi tầng BFS. Kết luận: quy ước "rotate" KHÔNG đồng
 * nhất giữa mọi đề CSD201 — mỗi đề phải verify RIÊNG bằng cách so với
 * ví dụ thật của chính đề đó, không suy ra từ đề khác dù dùng chung
 * từ ngữ "rotate to right/left". Các đề khác đã verify bằng ví dụ
 * RIÊNG của chúng nên vẫn đúng, không cần sửa lại.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE28.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE28.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE28-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "FA 2024 - Đề số 10").</p>
   <ol>
     <li>Ignore the real meaning of objects, variables and their values in the questions below.</li>
     <li>Each of the f1()..f4() methods below is graded independently (1 mark each). Your job is to complete only the method bodies. Do not change method signatures or add new import statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "FA 2024 - Đề số 10").</p>
   <ol>
     <li>Không cần để ý ý nghĩa thực của đối tượng/biến/giá trị trong các câu dưới đây.</li>
     <li>Mỗi hàm f1()..f4() dưới đây được chấm ĐỘC LẬP (1 điểm mỗi hàm). Chỉ hoàn thiện phần thân method. Không đổi chữ ký method hay thêm import mới.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const rd = (p) => fs.readFileSync(p, 'utf8');
const SOLVED = '/tmp/csd201-pe28-src';
const ORIG = '/tmp/csd201-pe28-orig/CSD201_FA24_PE_785660/PaperNo_10';

const q1ListSolved = rd(path.join(SOLVED, 'Q1/src/MyList.java'));
const q1ListStarter = rd(path.join(ORIG, 'Q1/src/MyList.java'));
const q2TreeSolved = rd(path.join(SOLVED, 'Q2/src/BSTree.java'));
const q2TreeStarter = rd(path.join(ORIG, 'Q2/src/BSTree.java'));
const q3GraphSolved = rd(path.join(SOLVED, 'Q3/src/Graph.java'));
const q3GraphStarter = rd(path.join(ORIG, 'Q3/src/Graph.java'));

const Q1_SCENARIO = B(
  `<p><strong>Question 1 (4 marks, file MyList.java).</strong> The class <code>Cala</code> with 3 data members: owner, horn and color is given (do not edit it). <code>MyList</code> is a linked list of Cala objects.</p>`,
  `<p><strong>Câu 1 (4 điểm, file MyList.java).</strong> Lớp <code>Cala</code> (owner, horn, color) đã có sẵn (không sửa). <code>MyList</code> là danh sách liên kết các Cala.</p>`,
);
const Q2_SCENARIO = B(
  `<p><strong>Question 2 (4 marks, file BSTree.java).</strong> The class <code>Cala</code> with 3 data members: owner, horn and color is given (do not edit it). <code>BSTree</code> is a binary search tree of Cala objects. <strong>The variable horn is the key of the tree, thus it must be unique.</strong></p>`,
  `<p><strong>Câu 2 (4 điểm, file BSTree.java).</strong> Lớp <code>Cala</code> (owner, horn, color) đã có sẵn (không sửa). <code>BSTree</code> là cây BST các Cala. <strong>Biến horn là khoá của cây, phải duy nhất.</strong></p>`,
);
const Q3_SCENARIO = B(
  `<p><strong>Question 3 (2 marks, file Graph.java).</strong> The class <code>Graph</code> is the implementation of a graph (adjacency matrix, vertices labeled A..P via <code>v[]</code>).</p>`,
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
    `<p><strong>void addLast(String xOwner, int xHorn, int xColor)</strong> — check if <code>xOwner.charAt(0) == 'A'</code> then do nothing, otherwise add a new node to the end of the list.</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete addLast() above only.</p>`,
    `<p><strong>void addLast(String xOwner, int xHorn, int xColor)</strong> — nếu <code>xOwner.charAt(0) == 'A'</code> thì không làm gì, ngược lại thêm node mới vào cuối danh sách.</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện addLast() ở trên.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(B,5,3) (C,6,5) (D,2,4) (E,7,9) (F,4,-7) (G,-3,2)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte. This Q1 (source and data.txt) is byte-identical to a sibling CSD201 paper's Q1 this session, so the already-verified solution was reused directly and re-confirmed by compiling and running it here too.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề. Q1 này (source lẫn data.txt) giống hệt Q1 của 1 đề CSD201 anh em trong phiên này, nên đã tái dùng trực tiếp lời giải đã verify và xác nhận lại bằng cách biên dịch + chạy ở đây.</p>`),
  B('addLast() correctly skips owner starting with A and appends at tail otherwise.', 'addLast() bỏ qua đúng owner bắt đầu bằng A, ngược lại thêm vào cuối.'),
);

const q1f2 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f2()</strong> — 3 given Cala objects x, y, z. Insert x, y and z so they will be at positions 1, 4 and 6 (head's position is 0).</p>`,
    `<p><strong>void f2()</strong> — chèn x, y, z sao cho ở vị trí 1, 4, 6 (head là vị trí 0).</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9) (J,3,7)\n(C,9,8) (X,1,2) (D,6,3) (E,8,5) (Y,2,3) (F,5,4) (Z,3,4) (I,4,9) (J,3,7)`,
  B(`<p>Verified by compiling against the real given project — matches the paper's expected example byte-for-byte (same as the sibling paper's Q1f2 this session).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — khớp byte-for-byte với ví dụ trong đề (giống Q1f2 của đề anh em trong phiên này).</p>`),
  B('Correctly inserts x, y, z at positions 1, 4, 6 applied sequentially.', 'Chèn đúng x, y, z tại vị trí 1, 4, 6, áp dụng tuần tự.'),
);

const q1f3 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f3()</strong> — Suppose p is the first node having maximum color in the list. Swap the contents of tail and p (thus if p=tail then do nothing).</p>`,
    `<p><strong>void f3()</strong> — Gọi p là node đầu tiên có color lớn nhất trong danh sách. Hoán đổi TOÀN BỘ nội dung của tail và p (nếu p=tail thì không làm gì).</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,7,6) (D,6,7) (E,3,8) (F,7,9) (G,8,7) (H,4,9) (I,8,3)\n(C,7,6) (D,6,7) (E,3,8) (I,8,3) (G,8,7) (H,4,9) (F,7,9)`,
  B(`<p>Verified by compiling against the real given project — matches the paper's expected example byte-for-byte (same as the sibling paper this session).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — khớp byte-for-byte với ví dụ trong đề (giống đề anh em trong phiên này).</p>`),
  B('Correctly identifies p (first max-color node) and swaps its full contents with tail, no-op when p is already tail.', 'Xác định đúng p (node color lớn nhất đầu tiên) và hoán đổi đúng toàn bộ nội dung với tail, không làm gì khi p đã là tail.'),
);

const q1f4 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f4()</strong> — Suppose in the list there is only one node p having owner=D, and there are at least 6 nodes after p. Sort 6 elements after p ascendingly by color.</p>`,
    `<p><strong>void f4()</strong> — Giả sử chỉ có 1 node p có owner=D, và có ít nhất 6 node sau p. Sắp 6 phần tử sau p tăng dần theo color.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,9,8) (D,11,12) (E,8,7) (F,1,2) (I,7,9) (J,6,8) (K,5,6) (L,9,8) (M,3,4)\n(C,9,8) (D,11,12) (F,1,2) (K,5,6) (E,8,7) (J,6,8) (L,9,8) (I,7,9) (M,3,4)`,
  B(`<p>Verified by compiling against the real given project — matches the paper's expected example byte-for-byte (same as the sibling paper this session).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — khớp byte-for-byte với ví dụ trong đề (giống đề anh em trong phiên này).</p>`),
  B('Correctly finds the single D node and sorts exactly the 6 elements after it ascending by color.', 'Tìm đúng node D duy nhất, sắp đúng 6 phần tử sau nó tăng dần theo color.'),
);

const q2f1 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void insert(String xOwner, int xHorn, int xColor)</strong> — check if <code>xOwner.charAt(0) == 'B'</code> then do nothing, otherwise insert a new Cala object into the tree.</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete insert() above only.</p>`,
    `<p><strong>void insert(String xOwner, int xHorn, int xColor)</strong> — nếu <code>xOwner.charAt(0) == 'B'</code> thì không làm gì, ngược lại chèn Cala mới vào cây (khoá theo horn).</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện insert() ở trên.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(A,7,9) (C,4,3) (D,8,6) (E,2,5) (Y,6,-7) (F,-6,7)\n(F,-6,7) (E,2,5) (C,4,3) (Y,6,-7) (A,7,9) (D,8,6)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte on both the breadth-first AND the given, unmodified inOrder line. Standard recursive BST insert comparing <code>horn</code> (not color, unlike the sibling paper's Q2 this session — this deck keys the tree on a different field), skipping any owner starting with 'B'; a duplicate horn (from "X", horn=4, colliding with "C") is naturally excluded.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề ở CẢ dòng breadth-first VÀ dòng inOrder given không sửa. Chèn BST đệ quy chuẩn theo <code>horn</code> (không phải color như Q2 của đề anh em trong phiên này — đề này khoá cây theo trường khác), bỏ qua owner bắt đầu bằng 'B'; horn trùng (từ "X", horn=4, trùng "C") tự động bị loại.</p>`),
  B('Correctly inserts following BST rules keyed by horn, skipping owner B and duplicate horns.', 'Chèn đúng theo luật BST khoá theo horn, bỏ qua owner B và horn trùng.'),
);

const q2f2 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f2()</strong> — Perform a breadth-first traversal from the root, but write only the nodes with a non-empty RIGHT child to f2.txt. Hint: copy the function breadth(...) to breadth2(...) and modify it.</p>`,
    `<p><strong>void f2()</strong> — Duyệt BFS từ root nhưng chỉ ghi ra f2.txt các node có con PHẢI khác rỗng. Gợi ý: sao chép breadth(...) thành breadth2(...) rồi sửa.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)\n(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (J,3,9)`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte. <code>breadth2()</code> performs the same BFS as <code>breadth()</code> but only calls <code>fvisit()</code> when the node's <code>right</code> pointer is non-null (a structural filter, mirroring the sibling paper's "non-empty LEFT child" variant).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề. <code>breadth2()</code> BFS giống <code>breadth()</code> nhưng chỉ gọi <code>fvisit()</code> khi con trỏ <code>right</code> của node khác null (lọc theo cấu trúc, ảnh gương của biến thể "con trái khác rỗng" ở đề anh em).</p>`),
  B('Correctly performs BFS displaying only nodes with a non-empty right child.', 'Duyệt BFS đúng, chỉ hiển thị node có con phải khác rỗng.'),
);

const q2f3 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f3()</strong> — Suppose p is the 7th node obtained during the breadth-first traversal of the tree, and fa is p's father. Delete p by copying. You must use the statement <code>f.writeBytes(fa.info + "\\r\\n")</code> to display fa in line 2.</p>`,
    `<p><strong>void f3()</strong> — Gọi p là node thứ 7 theo duyệt BFS, fa là cha của p. Xoá p bằng kỹ thuật xoá-bằng-copy. Dùng <code>f.writeBytes(fa.info + "\\r\\n")</code> để in fa ở dòng 2.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)\n(F,2,-1)\n(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (K,-1,5) (J,3,9) (L,5,10) (M,4,6)`,
  B(`<p>Verified by compiling against the real given project and running choice 3 — matches the paper's expected example byte-for-byte. BFS order gives p=I (7th) with father F. I has only a left child (K), so deletion is the simple one-child case: F's left pointer is set directly to K (I's old left child), no predecessor search needed — deterministic, no ambiguity.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 3 — khớp byte-for-byte với ví dụ trong đề. Thứ tự BFS cho p=I (thứ 7), cha là F. I chỉ có con trái (K), nên xoá là trường hợp đơn giản 1-con: con trỏ trái của F được gán trực tiếp thành K (con trái cũ của I), không cần tìm phần tử liền trước — xác định, không mơ hồ.</p>`),
  B('Correctly identifies the 7th BFS node p, its father fa, and deletes p by copying.', 'Xác định đúng node thứ 7 theo BFS (p), cha của nó (fa), xoá đúng p bằng kỹ thuật xoá-bằng-copy.'),
);

const q2f4 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f4()</strong> — Suppose p is the 2nd node having a left-child during the pre-order traversal of the tree from the root. Rotate p to the right.</p>`,
    `<p><strong>void f4()</strong> — Gọi p là node thứ 2 có con TRÁI khi duyệt pre-order từ root. Xoay p sang PHẢI.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)\n(C,8,2) (F,2,-1) (E,9,4) (I,1,7) (D,6,1) (H,10,8) (K,-1,5) (J,3,9) (G,7,3) (L,5,10) (M,4,6)`,
  B(`<p>Verified by compiling against the real given project and running choice 4. Pre-order gives p=D (2nd node with a left child, after C). <strong>This is the key finding for this paper:</strong> unlike several sibling CSD201 papers this session where "rotate ... to right/left" verifiably meant swapping data with a child (tree shape unchanged), a shape-preserving data-swap was tried FIRST here and did NOT match the paper's illustrated result. A standard textbook pointer-based right rotation (p's left child F becomes the new subtree root; p becomes F's right child; F's original right child J moves under p as its new left child) was tried instead, and reproduces the paper's expected BFS exactly across all 11 nodes and every level. <strong>Conclusion: the "rotate" convention is NOT uniform across all CSD201 PE papers</strong> — each must be verified independently against its own concrete example rather than assumed from another paper using the same wording.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4. Pre-order cho p=D (node thứ 2 có con trái, sau C). <strong>Đây là phát hiện then chốt của đề này:</strong> khác với vài đề CSD201 anh em trong phiên này nơi "rotate ... to right/left" đã verify là đổi dữ liệu với con (giữ nguyên hình dạng cây), cách đổi dữ liệu được thử TRƯỚC ở đây và KHÔNG khớp kết quả minh hoạ của đề. Thay vào đó, phép xoay phải con trỏ chuẩn giáo trình (con trái F của p thành gốc cây con mới; p thành con phải của F; con phải cũ J của F chuyển xuống làm con trái mới của p) được thử và tái tạo đúng CHÍNH XÁC BFS mong đợi của đề trên cả 11 node, mọi tầng. <strong>Kết luận: quy ước "rotate" KHÔNG đồng nhất giữa mọi đề PE CSD201</strong> — mỗi đề phải verify độc lập bằng ví dụ cụ thể của chính nó, không suy ra từ đề khác dù dùng chung từ ngữ.</p>`),
  B('Correctly identifies the 2nd pre-order node with a left child and performs a real pointer-based right rotation (verified as the correct interpretation for THIS paper).', 'Xác định đúng node thứ 2 có con trái theo pre-order và thực hiện đúng phép xoay phải con trỏ thật (đã verify là cách hiểu đúng cho ĐÚNG đề này).'),
);

const q3f1 = mkQ(1,
  Q3_SCENARIO + B(
    `<p><strong>void f1()</strong> — Perform depth-first traversal (to f1.txt) from vertex i=4 (vertex E), and display 6 vertices with their degrees from the 2nd vertex to the 7th vertex. Hint: copy depth(...) to depth2(...) and modify it.</p>`,
    `<p><strong>void f1()</strong> — Duyệt DFS (ra f1.txt) từ đỉnh i=4 (đỉnh E), hiển thị 6 đỉnh kèm bậc từ vị trí thứ 2 tới thứ 7. Gợi ý: sao chép depth(...) thành depth2(...) rồi sửa.</p>`
  ),
  q3GraphStarter, q3GraphSolved,
  `E B A C F H I D G\nB(3) A(3) C(3) F(1) H(2) I(1)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte. Same DFS-from-E order as a sibling CSD201 paper this session (same data.txt), but this paper asks for 6 vertices (positions 2-7) rather than 5.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề. Cùng thứ tự DFS từ E như đề CSD201 anh em trong phiên này (cùng data.txt), nhưng đề này yêu cầu 6 đỉnh (vị trí 2-7) thay vì 5.</p>`),
  B('Correctly computes vertex degrees and the DFS-from-E order, printing positions 2-7 with degree.', 'Tính đúng bậc đỉnh và thứ tự DFS từ E, in đúng vị trí 2-7 kèm bậc.'),
);

const q3f2 = mkQ(1,
  Q3_SCENARIO + B(
    `<p><strong>void f2()</strong> — Apply Dijkstra's shortest path algorithm to find the shortest path from vertex 0 (A) to vertex 6 (G). Write 3 lines to f2.txt: line 1 contains the last 4 vertices selected into the set S, line 2 contains the labels of the vertices in line 1, line 3 contains the shortest distance and the 1st, 4th and last vertices in the shortest path. (99 = infinity in the weighted matrix.)</p>`,
    `<p><strong>void f2()</strong> — Áp dụng Dijkstra tìm đường đi ngắn nhất từ đỉnh 0 (A) tới đỉnh 6 (G). Ghi 3 dòng vào f2.txt: dòng 1 là 4 đỉnh CUỐI được chọn vào S, dòng 2 là nhãn của các đỉnh dòng 1, dòng 3 là khoảng cách ngắn nhất và đỉnh thứ 1, thứ 4, cuối trên đường đi ngắn nhất. (99 = vô cực trong ma trận trọng số.)</p>`
  ),
  q3GraphStarter, q3GraphSolved,
  `D H F G\n12 12 17 22\n22 A E G`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte on all 3 lines. Same graph and weighted matrix as a sibling CSD201 paper this session (independently hand-verified there): full selection order A,I,C,E,B,D,H,F,G — last 4 are D(12),H(12),F(17),G(22). Shortest path A→G is A,I,C,E,D,G — 1st=A, 4th=E, last=G, distance=22.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề ở cả 3 dòng. Cùng đồ thị và ma trận trọng số như đề CSD201 anh em trong phiên này (đã tự verify tay ở đó): thứ tự chọn đầy đủ A,I,C,E,B,D,H,F,G — 4 đỉnh cuối là D(12),H(12),F(17),G(22). Đường đi ngắn nhất A→G là A,I,C,E,D,G — thứ 1=A, thứ 4=E, cuối=G, khoảng cách=22.</p>`),
  B('Correct Dijkstra: last-4-selected labels, and correct distance + 1st/4th/last vertices of shortest path A→G.', 'Dijkstra đúng: nhãn 4 đỉnh cuối vào S, và đúng khoảng cách + đỉnh thứ 1/4/cuối trên đường đi ngắn nhất A→G.'),
);

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE28-FA24De10',
    title: 'PE Đề 28 — Practical Exam (FA 2024 - Đề số 10)|||PE Đề 28 — Thi thực hành (FA 2024 - Đề số 10)',
    description: 'CSD201 PE (CODE): linked list + BST (horn-keyed, real rotation) + Graph (DFS+degree, Dijkstra), AI-graded, 10 câu 1đ.|||PE CSD201 (viết mã): danh sách liên kết + BST (khoá horn, xoay cây thật) + Đồ thị (DFS+bậc, Dijkstra), chấm AI, 10 câu 1đ.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE28-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1f1, q1f2, q1f3, q1f4, q2f1, q2f2, q2f3, q2f4, q3f1, q3f2],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
