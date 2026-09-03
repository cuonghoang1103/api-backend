/**
 * build-csd201-pe13.mjs — sinh content/exams/CSD201-PE13.mjs.
 *
 * Nguồn thật: given.rar (Đề "FA25 - Practice Exam") — 3 project riêng:
 * Q1=MyList (Canoe, danh sách liên kết đơn), Q2=BSTree (Canoe, khoá
 * theo rate), Q3=Graph (BFS+bậc, Dijkstra dừng sớm). MỖI hàm f1-fN là
 * MỘT câu 1 điểm riêng (khớp đúng "(1 mark)" ghi trong Main.java thật
 * của cả 3 project — không phải 2.5đ/4đ như các đề khác): Q1 có 4 câu
 * (4đ), Q2 có 4 câu (4đ), Q3 có 2 câu (2đ) = 10 câu, 10đ.
 *
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main mỗi project, đủ mọi lựa
 * chọn, so khớp ví dụ trong đề.
 *
 * Q1 f1/f2/f3 khớp byte-for-byte. Q1's "insert z before tail" hoá ra
 * KHÔNG phải nghĩa đen "ngay trước tail" (thử vậy cho Z lệch 1 vị
 * trí so với đề) — verify bằng thử nhiều cách đặt vị trí, cách khớp
 * 100% với đề là chèn Z ở vị trí (size-2) tức ngay trước node áp
 * chót (penultimate), không phải ngay trước tail thật sự.
 *
 * Q2 f2/f3/f4 khớp byte-for-byte 100% (đã tự dựng cây tay bằng
 * Python-style trước, xác nhận đúng qua breadth+leaf-filter+delete
 * -by-copying). Q2 f1's dòng in-order minh hoạ trong đề bị SAI (hoán
 * đổi 2 phần tử A,Y) — một cây BST đúng chuẩn thì in-order LUÔN đơn
 * điệu tăng theo khoá, mà minh hoạ đề lại không đơn điệu (-6,2,4,7,6,8)
 * trong khi breadth-first (dòng đầu, không tự viết) khớp hoàn hảo —
 * xác nhận cây đúng, chỉ dòng in-order của đề bị lỗi đánh máy. Đã
 * verify bằng chạy code chuẩn (không cách nào cho in-order không đơn
 * điệu) — tin theo tính chất toán học của BST hơn dòng minh hoạ.
 *
 * Q2 f4's "Rotate p to right" hoá ra KHÔNG phải phép xoay cây chuẩn
 * (đổi con trỏ) — thử phép xoay chuẩn cho kết quả khác đề. Khớp
 * 100% (cả 6 tầng BFS, 11 node) khi hiểu là ĐỔI DỮ LIỆU giữa p và
 * p.left, giữ nguyên hình dạng cây — một cách dùng từ "rotate" không
 * chuẩn giáo trình nhưng khớp chính xác ví dụ đề.
 *
 * Q3 f1/f2 khớp byte-for-byte 100%, đã tính tay BFS + Dijkstra
 * (dừng sớm tại đích) bằng Python trước khi viết Java.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE13.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE13.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE13-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "FA25 - Practice Exam").</p>
   <ol>
     <li>Do not pay attention to the real meaning of objects, variables and their values in the questions below.</li>
     <li>Each of the f1()..f4() methods below is graded independently (1 mark each). Your job is to complete only the method bodies. Do not change method signatures or add new import statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "FA25 - Practice Exam").</p>
   <ol>
     <li>Không cần để ý ý nghĩa thực của đối tượng/biến/giá trị trong các câu dưới đây.</li>
     <li>Mỗi hàm f1()..f4() dưới đây được chấm ĐỘC LẬP (1 điểm mỗi hàm). Chỉ hoàn thiện phần thân method. Không đổi chữ ký method hay thêm import mới.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const rd = (p) => fs.readFileSync(p, 'utf8');
const SOLVED = '/tmp/csd201-pe13-src';
const ORIG = '/tmp/csd201-pe13-orig/CSD201_FA25_PE_921411/PaperNo_1';

const q1ListSolved = rd(path.join(SOLVED, 'Q1/src/MyList.java'));
const q1ListStarter = rd(path.join(ORIG, 'Q1/src/MyList.java'));
const q2TreeSolved = rd(path.join(SOLVED, 'Q2/src/BSTree.java'));
const q2TreeStarter = rd(path.join(ORIG, 'Q2/src/BSTree.java'));
const q3GraphSolved = rd(path.join(SOLVED, 'Q3/src/Graph.java'));
const q3GraphStarter = rd(path.join(ORIG, 'Q3/src/Graph.java'));

const Q1_SCENARIO = B(
  `<p><strong>Question 1 (4 marks, file MyList.java).</strong> The class <code>Canoe</code> with 3 data members: driver, rate and color is given (do not edit it). <code>MyList</code> is a singly linked list of Canoe objects.</p>`,
  `<p><strong>Câu 1 (4 điểm, file MyList.java).</strong> Lớp <code>Canoe</code> (driver, rate, color) đã có sẵn (không sửa). <code>MyList</code> là danh sách liên kết đơn các Canoe.</p>`,
);
const Q2_SCENARIO = B(
  `<p><strong>Question 2 (4 marks, file BSTree.java).</strong> The class <code>Canoe</code> with 3 data members: driver, rate and color is given (do not edit it). <code>BSTree</code> is a binary search tree of Canoe objects. <strong>The variable rate is the key of the tree, thus it must be unique.</strong></p>`,
  `<p><strong>Câu 2 (4 điểm, file BSTree.java).</strong> Lớp <code>Canoe</code> (driver, rate, color) đã có sẵn (không sửa). <code>BSTree</code> là cây BST các Canoe. <strong>Biến rate là khoá của cây, phải duy nhất.</strong></p>`,
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
    `<p><strong>void addLast(String xDriver, int xRate, int xColor)</strong> — if <code>xDriver.charAt(0) == 'A'</code> do nothing, otherwise add a new node with driver=xDriver, rate=xRate, color=xColor to the end of the list (rate and color can be arbitrary, even negative values).</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete addLast() above only.</p>`,
    `<p><strong>void addLast(String xDriver, int xRate, int xColor)</strong> — nếu <code>xDriver.charAt(0) == 'A'</code> thì không làm gì, ngược lại thêm node mới (driver=xDriver, rate=xRate, color=xColor) vào cuối danh sách (rate/color có thể âm, tuỳ ý).</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện addLast() ở trên.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(B,5,3) (C,6,5) (D,2,4) (E,7,9) (F,4,-7) (G,-3,2)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte. Skips drivers starting with 'A', otherwise appends at <code>tail</code>.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề. Bỏ qua driver bắt đầu bằng 'A', ngược lại thêm vào <code>tail</code>.</p>`),
  B('addLast() correctly skips driver starting with A and appends at tail otherwise.', 'addLast() bỏ qua đúng driver bắt đầu bằng A, ngược lại thêm vào cuối.'),
);

const q1f2 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f2()</strong> — 3 given Canoe objects x, y, z. Insert statements so that x, y, z end up at positions 1, 2, and before tail (head's position is 0).</p>`,
    `<p><strong>void f2()</strong> — cho 3 đối tượng Canoe x, y, z. Chèn sao cho x, y, z ở vị trí 1, 2, và trước tail (head ở vị trí 0).</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9) (J,3,7)\n(C,9,8) (X,1,2) (Y,2,3) (D,6,3) (E,8,5) (F,5,4) (Z,3,4) (I,4,9) (J,3,7)`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte. x and y are inserted at fixed positions 1 and 2 sequentially. For z, a literal "insert immediately before the tail node" was tried first and produced a result one slot too late (Z landing between I and J instead of between F and I) — empirically, matching the paper requires inserting z at index (currentSize-2), i.e. immediately before the node that is second-to-last <em>before</em> the insertion (so it ends up third-from-end afterward). Implemented as <code>insertBeforeTail()</code>: walk to the node <code>p</code> such that <code>p.next.next == tail</code>, then insert between <code>p</code> and <code>p.next</code>.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề. x, y chèn ở vị trí cố định 1 và 2 tuần tự. Với z, thử nghĩa đen "chèn ngay trước tail" trước tiên nhưng cho kết quả lệch 1 vị trí (Z rơi giữa I và J thay vì giữa F và I) — thực nghiệm cho thấy khớp đề cần chèn z tại chỉ số (size hiện tại - 2), tức ngay trước node áp chót TRƯỚC KHI chèn (nên sau khi chèn nó trở thành phần tử thứ 3 từ cuối). Cài bằng <code>insertBeforeTail()</code>: đi tới node <code>p</code> sao cho <code>p.next.next == tail</code>, rồi chèn giữa <code>p</code> và <code>p.next</code>.</p>`),
  B('Correctly inserts x, y, z ending up in the exact order shown, matching the verified real given-code behavior of "before tail".', 'Chèn đúng x, y, z ra đúng thứ tự trong ví dụ, khớp hành vi "trước tail" đã verify bằng mã given thật.'),
);

const q1f3 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f3()</strong> — Remove the 3rd node having color &gt; minimum color. (If such node does not exist then do nothing.)</p>`,
    `<p><strong>void f3()</strong> — Xoá node thứ 3 có color &gt; color nhỏ nhất. (Nếu không có thì không làm gì.)</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,7,6) (D,6,7) (E,3,8) (F,7,9) (G,8,7) (H,4,9) (I,8,3) (J,5,4)\n(C,7,6) (D,6,7) (F,7,9) (G,8,7) (H,4,9) (I,8,3) (J,5,4)`,
  B(`<p>Verified by compiling against the real given project and running choice 3 — matches the paper's expected example byte-for-byte. Scans once to find the minimum color (I, color=3), then walks again counting nodes with color &gt; minimum (skipping I itself), unlinking the 3rd such node (E).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 3 — khớp byte-for-byte với ví dụ trong đề. Duyệt 1 lượt tìm color nhỏ nhất (I, color=3), duyệt lượt 2 đếm node có color &gt; nhỏ nhất (bỏ qua chính I), gỡ liên kết node thứ 3 thoả (E).</p>`),
  B('Correctly finds the minimum color, then removes the 3rd node with color strictly greater than it.', 'Tìm đúng color nhỏ nhất, xoá đúng node thứ 3 có color lớn hơn nó.'),
);

const q1f4 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f4()</strong> — Find the first node p having driver = "J". Reverse the elements before p.</p>`,
    `<p><strong>void f4()</strong> — Tìm node p đầu tiên có driver = "J". Đảo ngược các phần tử TRƯỚC p.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,9,8) (D,11,12) (E,8,7) (F,1,2) (I,7,9) (J,6,8) (K,5,6) (L,9,8) (M,3,4)\n(I,7,9) (F,1,2) (E,8,7) (D,11,12) (C,9,8) (J,6,8) (K,5,6) (L,9,8) (M,3,4)`,
  B(`<p>Verified by compiling against the real given project and running choice 4 — matches the paper's expected example byte-for-byte. Finds the first node with driver "J", collects all nodes before it into a list, reverses that list, relinks it, then reattaches at the found "J" node (and everything after is untouched).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4 — khớp byte-for-byte với ví dụ trong đề. Tìm node driver "J" đầu tiên, gom các node trước nó vào 1 danh sách, đảo ngược, nối lại, gắn vào node "J" tìm được (phần sau giữ nguyên).</p>`),
  B('Correctly finds the first "J" node and reverses exactly the elements before it, leaving J onward unchanged.', 'Tìm đúng node "J" đầu tiên, đảo ngược đúng các phần tử trước nó, giữ nguyên từ J trở đi.'),
);

const q2f1 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void insert(String xDriver, int xRate, int xColor)</strong> — if <code>xDriver.charAt(0) == 'B'</code> do nothing, otherwise insert a new Canoe object into the tree (rate and color can be arbitrary, even negative values).</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete insert() above only.</p>`,
    `<p><strong>void insert(String xDriver, int xRate, int xColor)</strong> — nếu <code>xDriver.charAt(0) == 'B'</code> thì không làm gì, ngược lại chèn Canoe mới vào cây (rate/color có thể âm).</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện insert() ở trên.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(A,7,9) (C,4,3) (D,8,6) (E,2,5) (Y,6,-7) (F,-6,7)\n[real given-code output: F,E,C,Y,A,D — the paper's own illustrative in-order line "(F,-6,7) (E,2,5) (C,4,3) (A,7,9) (Y,6,-7) (D,8,6)" is not monotonic by rate and cannot come from any correctly-ordered BST; see explanation]`,
  B(`<p>Verified by compiling against the real given project and running choice 1. Standard recursive BST insert comparing <code>rate</code>, skipping any driver starting with 'B'; a duplicate rate (from driver "X", rate=4, colliding with "C"'s rate=4) is naturally excluded since it goes into neither the &lt; nor &gt; branch. The breadth-first line (from the given, unmodified <code>breadth()</code>) matches the paper byte-for-byte: <code>A C D E Y F</code>, independently confirming this exact tree shape. But <code>inOrder()</code> is ALSO a given, unmodified function (standard left-root-right recursion) — for any correctly built BST it must print rate values in strictly ascending order. Running it against this confirmed tree yields <code>F(-6) E(2) C(4) Y(6) A(7) D(8)</code> — monotonic, as required. The paper's own printed example instead shows <code>F E C A Y D</code> (i.e. rate order -6,2,4,7,6,8), which is not ascending and therefore cannot be the output of this given inOrder() on any valid BST — a typo in the source paper (A and Y swapped), not a bug in the implementation.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1. Chèn BST đệ quy chuẩn theo <code>rate</code>, bỏ qua driver bắt đầu bằng 'B'; rate trùng (driver "X", rate=4, trùng với "C") tự động bị loại vì không rơi vào nhánh &lt; hay &gt; nào. Dòng breadth-first (từ <code>breadth()</code> given, không sửa) khớp byte-for-byte với đề: <code>A C D E Y F</code>, tự xác nhận đúng hình dạng cây này. Nhưng <code>inOrder()</code> CŨNG là hàm given không sửa (đệ quy trái-gốc-phải chuẩn) — với BST đúng, nó BẮT BUỘC in ra rate tăng dần nghiêm ngặt. Chạy trên cây đã xác nhận này cho ra <code>F(-6) E(2) C(4) Y(6) A(7) D(8)</code> — đơn điệu tăng, đúng yêu cầu. Ví dụ in trong đề lại là <code>F E C A Y D</code> (rate: -6,2,4,7,6,8), không tăng dần, nên KHÔNG THỂ là output thật của inOrder() given trên bất kỳ BST hợp lệ nào — đây là lỗi đánh máy của đề (hoán đổi A,Y), không phải lỗi cài đặt.</p>`),
  B('Correctly inserts following BST rules keyed by rate, skipping driver B and duplicate rates; breadth-first dump matches the paper exactly (verified independent of the discussed inOrder discrepancy).', 'Chèn đúng theo luật BST khoá theo rate, bỏ qua driver B và rate trùng; dòng breadth-first khớp đề chính xác (verify độc lập với vướng mắc inOrder đã nêu).'),
);

const q2f2 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f2()</strong> — Perform breadth-first traversal from the root but display to f2.txt LEAF NODES ONLY. Hint: copy breadth(...) to breadth2(...) and modify.</p>`,
    `<p><strong>void f2()</strong> — Duyệt breadth-first từ root nhưng chỉ hiển thị ra f2.txt các NODE LÁ. Gợi ý: sao chép breadth(...) thành breadth2(...) rồi sửa.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)\n(G,7,3) (H,10,8) (K,-1,5) (M,4,6)`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte. <code>breadth2()</code> performs the same BFS as <code>breadth()</code> but only calls <code>fvisit()</code> when the dequeued node has no left and no right child.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề. <code>breadth2()</code> BFS giống <code>breadth()</code> nhưng chỉ gọi <code>fvisit()</code> khi node lấy ra không có con trái lẫn con phải.</p>`),
  B('Correctly performs BFS displaying only leaf nodes, in BFS order.', 'Duyệt BFS đúng, chỉ hiển thị node lá, theo đúng thứ tự BFS.'),
);

const q2f3 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f3()</strong> — Suppose p is the 3rd node having 2 non-empty children when performing breadth-first traversal of the tree. Delete the node p by copying. The output in f3.txt must contain 3 lines: line 1 and line 3 are already given. If p has father fa then use <code>f.writeBytes(fa.info + "\\r\\n")</code> to display fa in line 2.</p>`,
    `<p><strong>void f3()</strong> — Gọi p là node thứ 3 có 2 con khác rỗng khi duyệt BFS. Xoá p bằng kỹ thuật xoá-bằng-copy. f3.txt có 3 dòng: dòng 1 và 3 đã cho sẵn. Nếu p có cha fa thì dùng <code>f.writeBytes(fa.info + "\\r\\n")</code> để in fa ở dòng 2.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)\n(D,6,1)\n(C,8,2) (D,6,1) (E,9,4) (I,1,7) (G,7,3) (H,10,8) (K,-1,5) (J,3,9) (L,5,10) (M,4,6)`,
  B(`<p>Verified by compiling against the real given project and running choice 3 — matches the paper's expected example byte-for-byte (including the middle "father" line). BFS order of 2-children nodes is C, D, F — so p=F, whose father is D. Deletes F using the standard delete-by-copying technique (copy the in-order predecessor's data into F's node, then recursively delete the predecessor).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 3 — khớp byte-for-byte với ví dụ trong đề (kể cả dòng "cha" ở giữa). Thứ tự BFS các node 2-con là C, D, F — nên p=F, cha là D. Xoá F bằng kỹ thuật xoá-bằng-copy chuẩn (chép dữ liệu phần tử liền trước theo in-order vào node F, rồi đệ quy xoá phần tử đó).</p>`),
  B('Correctly identifies the 3rd BFS 2-children node, reports its father if any, and deletes it via delete-by-copying.', 'Xác định đúng node 2-con thứ 3 theo BFS, báo đúng cha nếu có, xoá đúng bằng kỹ thuật xoá-bằng-copy.'),
);

const q2f4 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f4()</strong> — Suppose p is the 2nd node having 2 non-empty children when performing breadth-first traversal of the tree. Rotate p to right.</p>`,
    `<p><strong>void f4()</strong> — Gọi p là node thứ 2 có 2 con khác rỗng khi duyệt BFS. Xoay p sang PHẢI.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)\n(C,8,2) (F,2,-1) (E,9,4) (D,6,1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)`,
  B(`<p>Verified by compiling against the real given project and running choice 4. A standard pointer-based right rotation (p's left child becomes the new subtree root, p becomes its right child, and the old left-child's right subtree moves under p) was tried first — it produced a tree whose BFS did not match the paper (child subtrees moved along with the rotation, changing many downstream levels). Matching the paper exactly (all 11 nodes across every BFS level) required a much simpler operation: swap only the <code>Canoe</code> data between p and p.left, leaving every pointer/shape in the tree unchanged. This is not a textbook BST rotation, but it is what "rotate p to right" verifiably means in this specific paper — confirmed level-by-level against the given illustration, which is strong evidence (unlike the single-swap typo seen in f1's inOrder example) rather than a coincidence.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4. Thử phép xoay phải chuẩn theo con trỏ (con trái của p thành gốc mới, p thành con phải của nó, cây con phải cũ của con trái chuyển sang dưới p) trước tiên — cho ra cây có BFS KHÔNG khớp đề (các cây con dịch chuyển theo, đổi nhiều tầng phía sau). Khớp đề chính xác (đủ 11 node, mọi tầng BFS) cần một phép đơn giản hơn nhiều: chỉ ĐỔI dữ liệu <code>Canoe</code> giữa p và p.left, giữ nguyên toàn bộ con trỏ/hình dạng cây. Đây không phải phép xoay BST chuẩn giáo trình, nhưng đúng là nghĩa của "rotate p to right" trong đề cụ thể này — đã xác nhận từng tầng khớp với minh hoạ của đề, bằng chứng mạnh hơn nhiều (khác với lỗi hoán đổi đơn lẻ ở ví dụ inOrder của f1) so với trùng hợp ngẫu nhiên.</p>`),
  B('Correctly identifies the 2nd BFS 2-children node and swaps its data with its left child, matching the verified real given-code interpretation of "rotate right".', 'Xác định đúng node 2-con thứ 2 theo BFS và đổi đúng dữ liệu với con trái, khớp cách hiểu "xoay phải" đã verify bằng mã given thật.'),
);

const q3f1 = mkQ(1,
  Q3_SCENARIO + B(
    `<p><strong>void f1()</strong> — Perform breadth-first traversal (to f1.txt) from vertex i=1 (vertex B), but display only 6 vertices from the 2nd to the 7th vertex of that traversal. Of these, the first 3 vertices are displayed WITH their degrees. Hint: copy breadth(...) to breadth2(...) and modify. The array <code>int deg[]</code> is already declared — compute <code>d[i]</code> = degree of vertex i, and use <code>fvisitDeg(...)</code> to display a vertex with its degree.</p>`,
    `<p><strong>void f1()</strong> — Duyệt BFS (ra f1.txt) từ đỉnh i=1 (đỉnh B), nhưng chỉ hiển thị 6 đỉnh từ vị trí thứ 2 tới thứ 7 của lượt duyệt đó. Trong 6 đỉnh này, 3 đỉnh ĐẦU hiển thị KÈM bậc. Gợi ý: sao chép breadth(...) thành breadth2(...) rồi sửa. Mảng <code>int deg[]</code> đã khai sẵn — tính <code>d[i]</code> = bậc đỉnh i, dùng <code>fvisitDeg(...)</code> để hiển thị đỉnh kèm bậc.</p>`
  ),
  q3GraphStarter, q3GraphSolved,
  `B A D E C G H F I\nA(3) D(3) E(2) C G H`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte. Computed <code>deg[i]</code> as the row-sum of the 0/1 adjacency matrix; a second BFS (<code>breadth2</code>) from vertex 1 collects the visit order into a list, then prints positions 1..6 (0-indexed, i.e. the 2nd through 7th vertex), the first 3 of those with <code>fvisitDeg</code> and the rest with plain <code>fvisit</code>.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề. Tính <code>deg[i]</code> bằng tổng hàng của ma trận kề 0/1; BFS thứ 2 (<code>breadth2</code>) từ đỉnh 1 gom thứ tự duyệt vào danh sách, in vị trí 1..6 (0-indexed, tức đỉnh thứ 2 tới thứ 7), 3 đỉnh đầu dùng <code>fvisitDeg</code>, còn lại dùng <code>fvisit</code> thường.</p>`),
  B('Correctly computes vertex degrees and prints positions 2-7 of the BFS-from-B order, with the first 3 showing degree.', 'Tính đúng bậc đỉnh, in đúng vị trí 2-7 của thứ tự BFS từ B, 3 đỉnh đầu kèm bậc.'),
);

const q3f2 = mkQ(1,
  Q3_SCENARIO + B(
    `<p><strong>void f2()</strong> — Apply Dijkstra's shortest path algorithm to find (1) the shortest path from vertex 0 (A) to vertex 6 (G), then (2) from vertex 2 (C) to vertex 6 (G). Write 3 lines to f2.txt: line 1 contains the first 7 vertices selected into the set S in (1), of these the first 4 displayed with labels (shortest-distance so far). Line 2 contains the shortest path (1). Line 3 contains the shortest path (2). (99 = infinity in the weighted matrix; when a vertex v is selected into S, its label = shortest distance from the starting vertex to it.)</p>`,
    `<p><strong>void f2()</strong> — Áp dụng Dijkstra tìm (1) đường đi ngắn nhất từ đỉnh 0 (A) tới đỉnh 6 (G), rồi (2) từ đỉnh 2 (C) tới đỉnh 6 (G). Ghi 3 dòng vào f2.txt: dòng 1 là 7 đỉnh ĐẦU được chọn vào tập S trong (1), 4 đỉnh đầu kèm nhãn (khoảng cách ngắn nhất tính tới lúc đó). Dòng 2 là đường đi ngắn nhất (1). Dòng 3 là đường đi ngắn nhất (2). (99 = vô cực trong ma trận trọng số; khi đỉnh v được chọn vào S, nhãn = khoảng cách ngắn nhất từ đỉnh xuất phát tới nó.)</p>`
  ),
  q3GraphStarter, q3GraphSolved,
  `A(0) I(2) C(5) E(8) B D H\nA I C E D G\nC E D G`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte on all 3 lines. Standard Dijkstra with early termination once the target is finalized into S (needed so the "first 7 selected" list and the shortest-path parent chain are both exactly right); independently hand-computed both runs before writing Java, including the index-order tie-break (D selected before H when both have label 12, since the argmin loop uses strict "&lt;" scanning i=0..n-1).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề ở cả 3 dòng. Dijkstra chuẩn, dừng sớm ngay khi đích được chốt vào S (cần thiết để "7 đỉnh đầu được chọn" và chuỗi cha của đường đi đều đúng); đã tự tính tay cả 2 lượt trước khi viết Java, kể cả luật phá hoà theo thứ tự chỉ số (D được chọn trước H khi cả 2 cùng nhãn 12, vì vòng lặp tìm min dùng "&lt;" nghiêm ngặt, quét i=0..n-1).</p>`),
  B('Correct Dijkstra: first-7-selected labels for run (1), correct shortest path (1) A→G, and correct shortest path (2) C→G.', 'Dijkstra đúng: nhãn 7 đỉnh đầu vào S của lượt (1), đúng đường đi ngắn nhất (1) A→G, và đúng đường đi ngắn nhất (2) C→G.'),
);

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE13-FA25Practice',
    title: 'PE Đề 13 — Practical Exam (FA25 - Practice)|||PE Đề 13 — Thi thực hành (FA25 - Luyện tập)',
    description: 'CSD201 PE (CODE): singly linked list + BST (rate-keyed, custom "rotate") + Graph (BFS+degree, Dijkstra), AI-graded, 10 câu 1đ.|||PE CSD201 (viết mã): danh sách liên kết đơn + BST (khoá rate, "rotate" tự định nghĩa) + Đồ thị (BFS+bậc, Dijkstra), chấm AI, 10 câu 1đ.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE13-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1f1, q1f2, q1f3, q1f4, q2f1, q2f2, q2f3, q2f4, q3f1, q3f2],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
