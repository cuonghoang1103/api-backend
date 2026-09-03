/**
 * build-csd201-pe33.mjs — sinh content/exams/CSD201-PE33.mjs.
 *
 * Nguồn thật: csd201_pe_su24_b5_457162.zip (Đề "PE SU 2024 Block 5"),
 * 3 project: Q1=MyList (Boat: owner/color/size, 4 câu) + Q2=BSTree
 * (Bike: owner/price/color, khoá price, 4 câu) + Q3=Graph (DFS+bậc,
 * Dijkstra, 2 câu) = 10 câu, 10 điểm. Given materials ở đây là
 * project TRỐNG THẬT (chưa ai giải trước) — tự cài từ đầu, không
 * có sẵn lời giải như Đề 31/32.
 *
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main mỗi project, đủ mọi lựa
 * chọn. Q1 khớp byte-for-byte 4/4. Q3 khớp byte-for-byte 2/2.
 *
 * ⚠️ Q2 (BSTree, khoá price): paper.pdf mô tả "p là right-most node"
 * = "node có price lớn nhất", ngầm định convention CHUẨN (nhỏ→trái,
 * lớn→phải). Nhưng dò ngược bằng dữ liệu thật: convention CHUẨN cho
 * BFS SAI hoàn toàn so với minh hoạ paper ở f1, còn convention
 * MIRRORED (lớn→trái, nhỏ→phải — đã gặp ở đề khác trong đợt này)
 * cho BFS khớp CHÍNH XÁC 5/5 vị trí. f2's dòng lọc (price<7, dòng 2)
 * cũng khớp byte-for-byte 5/5 dưới mirrored. Hai xác nhận độc lập
 * này (không thể ngẫu nhiên trùng) khoá chặt: insert() của đề này
 * dùng mirrored convention, nghĩa là "right-most" ("theo p.right")
 * THỰC RA là node có price NHỎ NHẤT, không phải lớn nhất như văn
 * bản đề tự diễn giải — mô tả "(i.e. p is the right-most node)"
 * trong đề chỉ đúng dưới convention chuẩn, còn implementation thật
 * của đề lại là mirrored. f3/f4 dùng đúng "theo p.right" (structural,
 * không theo "lớn nhất") — kết quả khác node paper minh hoạ xoá
 * (paper minh hoạ dòng "trước" trông như thứ tự chữ cái, không phải
 * BFS thật, và xoá nhầm node G thay vì F) — tin code+convention đã
 * verify 2 lần độc lập hơn tin một minh hoạ có dấu hiệu lỗi transcribe.
 * f1's dòng in-order cũng lệch toàn bộ thứ tự so với minh hoạ paper
 * dù BFS khớp tuyệt đối — cùng kết luận: minh hoạ paper cho các dòng
 * này bị lỗi, dùng số thật đã biên dịch.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE33.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE33.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE33-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "PE SU 2024 Block 5").</p>
   <ol>
     <li>Ignore the real meaning of objects, variables and their values in the questions below.</li>
     <li>Each of the f1()..f4() methods below is graded independently (1 mark each). Your job is to complete only the method bodies. Do not change method signatures or add new import statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>
   <p><strong>Note on Q2 (BSTree):</strong> the source paper describes the "right-most node" as the node with the largest price, which assumes a standard (smaller→left, larger→right) BST convention. Verified by compiling: this specific paper's data only reproduces the paper's own f1 breadth-first example (matched exactly, all 5 positions) under a MIRRORED convention (larger→left, smaller→right) — confirmed a second, independent time by f2's price&lt;7 filtered line also matching exactly. Under that verified convention, the structurally "right-most" node (following the right-child pointer) is actually the SMALLEST price, not the largest. f3/f4 below follow the node that is genuinely right-most by pointer structure, per the verified code — this differs from the paper's own illustrated example for f3/f4, whose "before" line does not read as a real breadth-first traversal (it reads like plain alphabetical order) and appears to be a documentation error, not a property of the algorithm.</p>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "PE SU 2024 Block 5").</p>
   <ol>
     <li>Không cần để ý ý nghĩa thực của đối tượng/biến/giá trị trong các câu dưới đây.</li>
     <li>Mỗi hàm f1()..f4() dưới đây được chấm ĐỘC LẬP (1 điểm mỗi hàm). Chỉ hoàn thiện phần thân method. Không đổi chữ ký method hay thêm import mới.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>
   <p><strong>Lưu ý về Câu 2 (BSTree):</strong> đề gốc mô tả "node ngoài cùng bên phải" là node có price LỚN NHẤT, ngầm định convention chuẩn (nhỏ→trái, lớn→phải). Đã kiểm bằng biên dịch: dữ liệu của đề này chỉ tái tạo đúng minh hoạ BFS của chính đề ở f1 (khớp cả 5 vị trí) dưới convention MIRRORED (lớn→trái, nhỏ→phải) — được xác nhận lần 2 độc lập bởi dòng lọc price&lt;7 của f2 cũng khớp tuyệt đối. Dưới convention đã verify đó, node "ngoài cùng bên phải" (theo con trỏ phải) thực ra là node có price NHỎ NHẤT, không phải lớn nhất. f3/f4 dưới đây theo đúng node ngoài-cùng-bên-phải THẬT theo cấu trúc con trỏ, theo mã đã verify — khác với minh hoạ của chính đề cho f3/f4, mà dòng "trước" của minh hoạ đó không đọc như một BFS thật (trông như thứ tự chữ cái) và có vẻ là lỗi soạn đề, không phải tính chất thuật toán.</p>`,
);

const rd = (p) => fs.readFileSync(p, 'utf8');
const SOLVED = '/tmp/csd201-pe33-src';
const ORIG = '/tmp/csd201-pe33-orig/CSD201_PE_SU24_B5_457162/PaperNo_7';

const q1ListSolved = rd(path.join(SOLVED, 'Q1/src/MyList.java'));
const q1ListStarter = rd(path.join(ORIG, 'Q1/src/MyList.java'));
const q2TreeSolved = rd(path.join(SOLVED, 'Q2/src/BSTree.java'));
const q2TreeStarter = rd(path.join(ORIG, 'Q2/src/BSTree.java'));
const q3GraphSolved = rd(path.join(SOLVED, 'Q3/src/Graph.java'));
const q3GraphStarter = rd(path.join(ORIG, 'Q3/src/Graph.java'));

const Q1_SCENARIO = B(
  `<p><strong>Question 1 (4 marks, file MyList.java).</strong> The class <code>Boat</code> with 3 data members: owner, color and size is given (do not edit it; color and size can be arbitrary, even negative values). <code>MyList</code> is a linked list of Boat objects.</p>`,
  `<p><strong>Câu 1 (4 điểm, file MyList.java).</strong> Lớp <code>Boat</code> (owner, color, size) đã có sẵn (không sửa; color và size có thể là số bất kỳ, kể cả âm). <code>MyList</code> là danh sách liên kết các Boat.</p>`,
);
const Q2_SCENARIO = B(
  `<p><strong>Question 2 (4 marks, file BSTree.java).</strong> The class <code>Bike</code> with 3 data members: owner, price and color is given (do not edit it; price and color can be arbitrary, even negative values). <code>BSTree</code> is a binary search tree of Bike objects. <strong>The variable price is the key of the tree, thus it must be unique.</strong></p>`,
  `<p><strong>Câu 2 (4 điểm, file BSTree.java).</strong> Lớp <code>Bike</code> (owner, price, color) đã có sẵn (không sửa; price và color có thể là số bất kỳ, kể cả âm). <code>BSTree</code> là cây BST các Bike. <strong>Biến price là khoá của cây, phải duy nhất.</strong></p>`,
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
    `<p><strong>void addLast(String xOwner, int xColor, int xSize)</strong> — if xOwner.charAt(0) == 'B' then do nothing, otherwise add a new node with owner=xOwner, color=xColor, size=xSize to the end of the list.</p>
     <p><strong>void f1()</strong> — do not edit. Your task is to complete addLast() above only.</p>`,
    `<p><strong>void addLast(String xOwner, int xColor, int xSize)</strong> — nếu xOwner.charAt(0) == 'B' thì không làm gì, ngược lại thêm node mới owner=xOwner, color=xColor, size=xSize vào cuối danh sách.</p>
     <p><strong>void f1()</strong> — không sửa. Chỉ hoàn thiện addLast() ở trên.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(A,9,8) (C,6,5) (D,2,4) (E,7,9) (F,4,7)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte (B is correctly excluded).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề (B bị loại đúng).</p>`),
  B('addLast() correctly skips owner starting with B and appends at tail otherwise.', 'addLast() bỏ qua đúng owner bắt đầu bằng B, ngược lại thêm vào cuối.'),
);

const q1f2 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f2()</strong> — Two given Boat objects x, y. Assume the list contains at least 5 elements. Write statements to insert x and y into the list so that x becomes the first (head) and y becomes the third element.</p>`,
    `<p><strong>void f2()</strong> — Có sẵn 2 đối tượng Boat x, y. Giả sử danh sách có ít nhất 5 phần tử. Chèn x và y sao cho x thành phần tử ĐẦU (head) và y thành phần tử THỨ 3.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9)\n(X,1,2) (C,9,8) (Y,3,4) (D,6,3) (E,8,5) (F,5,4) (I,4,9)`,
  B(`<p>Verified by compiling against the real given project — matches the paper's expected example byte-for-byte on both lines. Insert x at position 0 (head), then insert y at position 2 (0-indexed) so it lands as the 3rd element.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng. Chèn x tại vị trí 0 (head), rồi chèn y tại vị trí 2 (0-indexed) để thành phần tử thứ 3.</p>`),
  B('Correctly inserts x at head and y at the 3rd position, applied in the right order.', 'Chèn đúng x ở đầu và y ở vị trí thứ 3, áp dụng đúng thứ tự.'),
);

const q1f3 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f3()</strong> — Assume the list contains at least 4 elements. Remove the SECOND node having color &lt; 6 (thus if only one node has color &lt; 6, do nothing).</p>`,
    `<p><strong>void f3()</strong> — Giả sử danh sách có ít nhất 4 phần tử. Xoá node THỨ 2 có color &lt; 6 (nếu chỉ có 1 node color &lt; 6 thì không làm gì).</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,8,6) (D,3,5) (E,9,2) (F,5,8) (G,9,7) (H,6,8) (I,7,3)\n(C,8,6) (D,3,5) (E,9,2) (G,9,7) (H,6,8) (I,7,3)`,
  B(`<p>Verified by compiling against the real given project — matches the paper's expected example byte-for-byte. Nodes with color&lt;6: D(3) and F(5) — the 1st is D, the 2nd is F, so F is removed.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật — khớp byte-for-byte với ví dụ trong đề. Node color&lt;6: D(3) và F(5) — thứ 1 là D, thứ 2 là F, nên xoá F.</p>`),
  B('Correctly finds and removes the 2nd node with color < 6, doing nothing if fewer than 2 such nodes exist.', 'Tìm và xoá đúng node thứ 2 có color < 6, không làm gì nếu có ít hơn 2 node như vậy.'),
);

const q1f4 = mkQ(1,
  Q1_SCENARIO + B(
    `<p><strong>void f4()</strong> — Assume the list contains at least 4 elements. Sort the LAST 4 elements ascending by color.</p>`,
    `<p><strong>void f4()</strong> — Giả sử danh sách có ít nhất 4 phần tử. Sắp 4 phần tử CUỐI tăng dần theo color.</p>`
  ),
  q1ListStarter, q1ListSolved,
  `(C,7,9) (D,6,7) (E,5,6) (F,4,5) (I,10,4) (J,3,11) (K,2,3)\n(C,7,9) (D,6,7) (E,5,6) (K,2,3) (J,3,11) (F,4,5) (I,10,4)`,
  B(`<p>Verified by compiling against the real given project and running choice 4 — matches the paper's expected example byte-for-byte. Last 4 (F,I,J,K) sorted ascending by color: K(2),J(3),F(4),I(10).</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4 — khớp byte-for-byte với ví dụ trong đề. 4 phần tử cuối (F,I,J,K) sắp tăng dần theo color: K(2),J(3),F(4),I(10).</p>`),
  B('Correctly sorts exactly the last 4 elements ascending by color, keeping earlier elements untouched.', 'Sắp đúng 4 phần tử cuối tăng dần theo color, giữ nguyên các phần tử trước đó.'),
);

const q2f1 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void insert(String xOwner, int xPrice, int xColor)</strong> — if xOwner.charAt(0) == 'A' then do nothing, otherwise insert a new Bike object with owner=xOwner, price=xPrice, color=xColor into the tree.</p>
     <p><strong>void f1()</strong> — Do not edit this method; you only need to complete the insert(...) method above. Output (line 1: breadth first traversal, line 2: in-order traversal).</p>`,
    `<p><strong>void insert(String xOwner, int xPrice, int xColor)</strong> — nếu xOwner.charAt(0) == 'A' thì không làm gì, ngược lại chèn Bike mới owner=xOwner, price=xPrice, color=xColor vào cây.</p>
     <p><strong>void f1()</strong> — Không sửa. Chỉ hoàn thiện insert() ở trên. Kết quả (dòng 1: BFS, dòng 2: in-order).</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(B,9,4) (C,4,3) (D,8,6) (E,2,5) (F,6,7)\n(B,9,4) (D,8,6) (F,6,7) (C,4,3) (E,2,5)`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — the BFS line matches the paper's expected example byte-for-byte, all 5 positions (confirming this deck's insert() uses a MIRRORED comparison: larger price → left child, smaller price → right child; A and the price-4 duplicate X are correctly excluded). <strong>Note:</strong> the paper's own in-order line reads "F,E,C,B,D", which cannot result from the given, unmodified inOrder() (left,root,right) applied to the tree shape that its own BFS line already confirms is correct — our compiled in-order (B,D,F,C,E) is the only value mathematically consistent with that verified shape; the paper's in-order line appears to be a transcription error.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — dòng BFS khớp byte-for-byte với ví dụ trong đề ở cả 5 vị trí (xác nhận insert() của đề này dùng so sánh MIRRORED: price lớn hơn → con trái, price nhỏ hơn → con phải; A và X (price trùng 4) bị loại đúng). <strong>Lưu ý:</strong> dòng in-order của chính đề ghi "F,E,C,B,D", điều này KHÔNG THỂ là kết quả của inOrder() (trái,gốc,phải) given không sửa áp lên đúng hình dạng cây mà chính dòng BFS của đề đã xác nhận đúng — in-order biên dịch của chúng tôi (B,D,F,C,E) là giá trị DUY NHẤT khớp về mặt toán học với hình dạng cây đã verify đó; dòng in-order của đề có vẻ là lỗi transcribe.</p>`),
  B('Correctly inserts following the mirrored BST rule keyed by price, skipping owner A and duplicate prices.', 'Chèn đúng theo luật BST mirrored khoá theo price, bỏ qua owner A và price trùng.'),
);

const q2f2 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f2()</strong> — Perform an in-order traversal from the root but write to file f2.txt only the nodes with price&lt;7. Hint: copy the function inOrder(...) into a new function inOrder2(...) and modify the latter one.</p>`,
    `<p><strong>void f2()</strong> — Duyệt in-order từ root nhưng chỉ ghi ra f2.txt các node có price&lt;7. Gợi ý: sao chép inOrder(...) thành inOrder2(...) rồi sửa.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(G,8,7) (D,7,2) (H,6,3) (I,5,4) (F,4,5) (C,3,6) (E,2,8)\n(H,6,3) (I,5,4) (F,4,5) (C,3,6) (E,2,8)`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — line 2 (the price&lt;7 filtered in-order) matches the paper's expected example byte-for-byte, all 5 elements: H,I,F,C,E — a second independent confirmation of the mirrored-insert tree shape. <strong>Note:</strong> the paper's line 1 shows G in the 6th position ("D,H,I,F,C,G,E") while our verified in-order places G first ("G,D,H,I,F,C,E") — every other element (D,H,I,F,C,E) is in the exact same relative order in both, so this reads as a single tuple misplaced when the paper's example was authored, not an algorithm difference.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — dòng 2 (in-order đã lọc price&lt;7) khớp byte-for-byte với ví dụ trong đề, đủ cả 5 phần tử: H,I,F,C,E — xác nhận độc lập lần 2 cho hình dạng cây mirrored. <strong>Lưu ý:</strong> dòng 1 của đề đặt G ở vị trí thứ 6 ("D,H,I,F,C,G,E") trong khi in-order đã verify của chúng tôi đặt G đầu tiên ("G,D,H,I,F,C,E") — mọi phần tử khác (D,H,I,F,C,E) giữ đúng thứ tự tương đối như nhau ở cả hai, nên đây đọc như một ô bị đặt sai vị trí khi soạn ví dụ của đề, không phải khác biệt thuật toán.</p>`),
  B('Correctly performs in-order traversal displaying only nodes with price < 7.', 'Duyệt in-order đúng, chỉ hiển thị node có price < 7.'),
);

const q2f3 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f3()</strong> — Assume the tree is not empty. Find the node p having the largest price in the tree (i.e. p is the right-most node), then delete p.</p>`,
    `<p><strong>void f3()</strong> — Giả sử cây không rỗng. Tìm node p ngoài cùng bên phải (theo con trỏ p.right), rồi xoá p.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,5,2) (E,6,5) (D,2,1) (G,4,6) (F,1,3) (H,3,4)\n(C,5,2) (E,6,5) (D,2,1) (G,4,6) (H,3,4)`,
  B(`<p>Verified by compiling against the real given project and running choice 3. As established in f1/f2 (two independent exact matches), this deck's insert() is mirrored, so the structurally right-most node (following p.right, per the literal method description) is F (price=1) here, not the largest-price node — the paper's own parenthetical "i.e. p is the right-most node" is the operative, code-accurate definition. F is a leaf, so deletion just unlinks it from its parent D. <strong>Note:</strong> the paper's own illustrated "before" line for f3/f4 reads "C,D,E,F,G,H" — plain alphabetical order, not a real breadth-first traversal (which is verified to be C,E,D,G,F,H from the same tree structure confirmed correct in f1/f2) — so the paper's shown deleted node (G) does not match our verified compiled result (F) and is treated as a documentation error.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 3. Như đã xác lập ở f1/f2 (2 lần khớp độc lập), insert() của đề này là mirrored, nên node ngoài-cùng-bên-phải THẬT theo cấu trúc (theo p.right, đúng mô tả chữ của đề) là F (price=1) ở đây, không phải node price lớn nhất — chú thích "(tức p là node ngoài cùng bên phải)" của đề mới là định nghĩa đúng với code. F là node lá nên xoá chỉ cần gỡ khỏi cha D. <strong>Lưu ý:</strong> dòng minh hoạ "trước" của chính đề cho f3/f4 ghi "C,D,E,F,G,H" — thứ tự chữ cái thuần tuý, không phải BFS thật (đã verify là C,E,D,G,F,H từ đúng cấu trúc cây đã xác nhận ở f1/f2) — nên node đề minh hoạ bị xoá (G) không khớp kết quả biên dịch đã verify (F), coi là lỗi soạn đề.</p>`),
  B('Correctly finds and deletes the structurally right-most node of the mirrored tree.', 'Tìm và xoá đúng node ngoài cùng bên phải theo đúng cấu trúc cây mirrored.'),
);

const q2f4 = mkQ(1,
  Q2_SCENARIO + B(
    `<p><strong>void f4()</strong> — Assume the tree is not empty. Find the node p having the largest price in the tree (i.e. p is the right-most node). If p has father f, then rotate f to left about p.</p>`,
    `<p><strong>void f4()</strong> — Giả sử cây không rỗng. Tìm node p ngoài cùng bên phải (theo p.right). Nếu p có cha f thì xoay f sang trái quanh p.</p>`
  ),
  q2TreeStarter, q2TreeSolved,
  `(C,5,2) (E,6,5) (D,2,1) (G,4,6) (F,1,3) (H,3,4)\n(C,5,2) (E,6,5) (F,1,3) (D,2,1) (G,4,6) (H,3,4)`,
  B(`<p>Verified by compiling against the real given project and running choice 4. Same right-most node as f3, F (price=1), with father D (D.right=F). Rotating D left about F: F takes D's position under C, D becomes F's left child, F's (empty) left subtree becomes D's new right child; D's own left child G is unaffected. See f3's explanation for why the paper's own "before" line and target node differ from this verified compiled result.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4. Node ngoài-cùng-bên-phải giống f3, là F (price=1), cha là D (D.right=F). Xoay D sang trái quanh F: F lên thay vị trí D dưới C, D thành con trái của F, con trái (rỗng) của F cũ thành con phải mới của D; con trái G của D không đổi. Xem giải thích ở f3 vì sao dòng "trước" và node mục tiêu của đề khác kết quả biên dịch đã verify này.</p>`),
  B('Correctly rotates the father of the structurally right-most node to the left about it.', 'Xoay đúng cha của node ngoài cùng bên phải sang trái quanh nó.'),
);

const q3f1 = mkQ(1,
  Q3_SCENARIO + B(
    `<p><strong>void f1()</strong> — Perform a depth-first traversal (to the file f1.txt) from the vertex i=0 (the vertex A) but display only 4 vertices, from the 2nd vertex to the 5th vertex. Hint: copy depth(...) to depth2(...) and modify the latter one.</p>`,
    `<p><strong>void f1()</strong> — Duyệt DFS (ra f1.txt) từ đỉnh i=0 (đỉnh A), chỉ hiển thị 4 đỉnh, từ vị trí thứ 2 tới thứ 5. Gợi ý: sao chép depth(...) thành depth2(...) rồi sửa.</p>`
  ),
  q3GraphStarter, q3GraphSolved,
  `A B E H I C D G F\nB E H I`,
  B(`<p>Verified by compiling against the real given project and running choice 1 — matches the paper's expected example byte-for-byte on both lines. Full DFS from A: A,B,E,H,I,C,D,G,F; positions 2-5 (1-indexed) are B,E,H,I.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 1 — khớp byte-for-byte với ví dụ trong đề ở cả 2 dòng. DFS đầy đủ từ A: A,B,E,H,I,C,D,G,F; vị trí 2-5 (1-indexed) là B,E,H,I.</p>`),
  B('Correctly computes DFS order from A and displays exactly positions 2-5.', 'Tính đúng thứ tự DFS từ A và hiển thị đúng vị trí 2-5.'),
);

const q3f2 = mkQ(1,
  Q3_SCENARIO + B(
    `<p><strong>void f2()</strong> — Apply Dijkstra's shortest path algorithm to find (1) the shortest path from vertex 1 (B) to vertex 5 (F), then (2) from vertex 0 (A) to vertex 6 (G). Write 3 lines to f2.txt: line 1 contains the vertices of the shortest path in (1), line 2 contains the vertices of the shortest path in (2), line 3 contains the last 3 vertices selected into the set S in (2) with their labels and distances. (99 = infinity.)</p>`,
    `<p><strong>void f2()</strong> — Áp dụng Dijkstra tìm (1) đường đi ngắn nhất từ đỉnh 1 (B) tới đỉnh 5 (F), rồi (2) từ đỉnh 0 (A) tới đỉnh 6 (G). Ghi 3 dòng vào f2.txt: dòng 1 là đường đi ngắn nhất (1), dòng 2 là đường đi ngắn nhất (2), dòng 3 là 3 đỉnh CUỐI vào S trong (2) kèm nhãn+khoảng cách. (99 = vô cực.)</p>`
  ),
  q3GraphStarter, q3GraphSolved,
  `B C E D F\nA B C E D G\nD-19 F-24 G-29`,
  B(`<p>Verified by compiling against the real given project and running choice 2 — matches the paper's expected example byte-for-byte on all 3 lines. Shortest path B→F: B,C,E,D,F. Shortest path A→G: A,B,C,E,D,G. Last 3 vertices selected into S for the A→G run, with distances: D-19, F-24, G-29.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề ở cả 3 dòng. Đường đi ngắn nhất B→F: B,C,E,D,F. Đường đi ngắn nhất A→G: A,B,C,E,D,G. 3 đỉnh cuối vào S của lượt A→G, kèm khoảng cách: D-19, F-24, G-29.</p>`),
  B('Correct Dijkstra: correct shortest path (1) B→F, correct shortest path (2) A→G, and correct last-3-selected-into-S with distances.', 'Dijkstra đúng: đúng đường đi ngắn nhất (1) B→F, đúng đường đi ngắn nhất (2) A→G, và đúng 3 đỉnh cuối vào S kèm khoảng cách.'),
);

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE33-SU24B5',
    title: 'PE Đề 33 — Practical Exam (SU 2024, Block 5)|||PE Đề 33 — Thi thực hành (SU 2024, Block 5)',
    description: 'CSD201 PE (CODE): linked list (Boat) + BST (Bike, khoá price, mirrored convention) + Graph (DFS+bậc, Dijkstra), AI-graded, 10 câu 1đ. Câu 2 có ghi chú convention/lỗi minh hoạ đề.|||PE CSD201 (viết mã): danh sách liên kết (Boat) + BST (Bike, khoá price, convention mirrored) + Đồ thị (DFS+bậc, Dijkstra), chấm AI, 10 câu 1đ. Câu 2 có ghi chú convention/lỗi minh hoạ đề.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE33-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1f1, q1f2, q1f3, q1f4, q2f1, q2f2, q2f3, q2f4, q3f1, q3f2],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
