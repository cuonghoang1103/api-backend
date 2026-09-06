/**
 * build-csd201-pe45.mjs — sinh content/exams/CSD201-PE45.mjs.
 *
 * Nguồn thật: Đề 45 — "Đề Thi PE CSD201 - PE - SU 2023 - 4 (Hola Slot 1)",
 * archive `csd201_pe_su23_4.rar`, thư mục `CSD201 Hola Slot1/`. Archive KHÔNG
 * có paper.pdf: đề nằm trong 5 ảnh chụp màn hình `1.jpg`..`5.jpg` (cửa sổ
 * "Question paper (build 07.05.20.19)"), kèm project given TRẮNG thật
 * `PaperNo_4/Q1|Q2|Q3` (build.xml + manifest.mf + nbproject + data.txt).
 *
 * ✅✅ 100% SỐ LIỆU GỐC — KHÔNG CÓ CHỖ NÀO TỰ THIẾT KẾ.
 * Cả 10 kết quả mong đợi trong deck này đều là output THẬT của việc
 * compile + chạy (javac/java) lời giải tham chiếu trên đúng `data.txt` given,
 * và cả 10 đều KHỚP TỪNG KÝ TỰ với ví dụ in trong ảnh đề:
 *   Q1.f1 (B,5,3) (C,6,5) (D,2,4) (E,7,9) (F,4,-7) (G,-3,2)            ✔ ảnh 2
 *   Q1.f2 chèn X,Y,Z vào vị trí 1,3,4                                   ✔ ảnh 2
 *   Q1.f3 đưa node paddle-max THỨ HAI về cuối → (F,5,9) ở cuối          ✔ ảnh 3
 *   Q1.f4 sort vị trí 2..6 tăng dần theo paddle → K,J,I,E,F             ✔ ảnh 3
 *   Q2.f1 breadth + inOrder (bỏ 'B', bỏ X vì sail=4 trùng C)            ✔ ảnh 3
 *   Q2.f2 breadth lọc paddle>5 → H,I,J,L,M                              ✔ ảnh 4
 *   Q2.f3 xoá q=p.left bằng copy (p=F node in-order thứ 2 có con trái)  ✔ ảnh 4
 *   Q2.f4 xoay p sang phải                                              ✔ ảnh 4
 *   Q3.f1 breadth từ E, hiện đỉnh thứ 2..6 → B H A I C                  ✔ ảnh 5
 *   Q3.f2 Dijkstra A→G (3 đỉnh cuối D F G, nhãn 19 24 29) + C→F         ✔ ảnh 5
 *
 * ⚠️⚠️ TRÙNG MỘT PHẦN VỚI PE43 — ĐÃ RÀ, CỐ Ý GIỮ:
 * `CSD201-PE43.mjs` dựng từ archive "PaperNo_2" của CÙNG kỳ SU2023 và CÙNG
 * bộ project given. Phần **Q2 (BSTree, tức câu 5-8 của deck này) TRÙNG NỘI
 * DUNG với câu 5-8 của PE43**: cùng `data.txt`, cùng 4 yêu cầu, cùng 4 output.
 * Đó là vì FPT dùng lại y nguyên phần BSTree giữa hai PaperNo, và PE43 (không
 * có đề giấy) đã dựng lại đúng phần đó nhờ đối chiếu `R_f*.txt` của bộ chấm.
 * Phần Q1 (MyList) và Q3 (Graph) thì KHÁC THẬT:
 *   - addLast: PE45 bỏ qua sea bắt đầu bằng 'A' (đề in rõ), PE43 đoán là 'B'
 *   - f2: PE45 chèn vào vị trí 1,3,4; PE43 là 2,3,5
 *   - f3: PE45 đưa node paddle-max thứ 2 về CUỐI; PE43 đưa node sail-max thứ 2 lên ĐẦU
 *   - f4: PE45 sort 5 phần tử vị trí 2..6 theo paddle; PE43 sort 4 phần tử theo sail
 *   - Q3.f1: PE45 hiện đỉnh thứ 2..6 (5 đỉnh); PE43 hiện 6 đỉnh
 *   - Q3.f2: PE45 lấy 3 đỉnh cuối vào S; PE43 lấy 4
 * Nói cách khác PE45 là bản CÓ ĐỀ GỐC, nên 6/10 câu của nó là chuẩn xác trong
 * khi PE43 chỉ suy lại từ mã đã giải. Giữ cả hai, nhưng biết là 4 câu BSTree
 * bị lặp.
 *
 * Given.zip: 3 project NetBeans Q1/Q2/Q3 nguyên trạng (mã given TRẮNG, chưa
 * giải) + data.txt + build.xml/manifest.mf/nbproject. ĐÃ BỎ các file của bộ
 * chấm nội bộ lẫn trong Q2/src (Marking.java, MarkMain.java,
 * zCopyToR_f_4.java, R_f*.txt, *.bat) — đó là công cụ của giám khảo, không
 * phải scaffolding phát cho sinh viên. Đã compile ĐỘC LẬP cả 3 project (bản
 * given trắng lẫn bản đã giải) và CHẠY hết mọi lựa chọn của Main trước khi zip.
 *
 * Nguồn Java cho script này: /tmp/csd201-pe45-final/{MyList,BSTree,Graph}.{given,solved}.java
 * (theo đúng quy ước của build-csd201-pe42/44/49.mjs).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE45.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE45.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE45-Given.zip';
const SRC = '/tmp/csd201-pe45-final';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const read = (f) => {
  const p = path.join(SRC, f);
  if (!fs.existsSync(p)) throw new Error(`Thiếu ${p} — xem chú thích đầu file về thư mục nguồn Java.`);
  return fs.readFileSync(p, 'utf8');
};

const myListGiven = read('MyList.given.java');
const myListSolved = read('MyList.solved.java');
const bsTreeGiven = read('BSTree.given.java');
const bsTreeSolved = read('BSTree.solved.java');
const graphGiven = read('Graph.given.java');
const graphSolved = read('Graph.solved.java');

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (Summer 2023, Hola Slot 1 — PaperNo_4). Read the instructions carefully before start coding.</p>
   <ol>
     <li>Software: NetBeans IDE 8.x, Java JDK 1.8. Create a folder to save the given projects, e.g. CSD_given. Download the given materials above into it — it contains 3 separate NetBeans projects: Q1 (MyList), Q2 (BSTree), Q3 (Graph).</li>
     <li>Steps for question 1 (do the same for questions 2 and 3): open NetBeans, open the given Q1 project, then edit MyList.java according to the requirements below (edit BSTree.java for Q2 and Graph.java for Q3).</li>
     <li>Before submission: run "Clean and Build Project" (Shift+F11) to ensure BUILD SUCCESSFUL — if not, the project gets 0 mark.</li>
     <li>Do not use accented Vietnamese when writing comments in programs. Do not add new import statement(s) to the given files.</li>
     <li>Do not pay attention to the real meaning of objects, variables and their values in the questions below.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into each code box — it is graded by AI against the rubric. You can build &amp; run the real given projects on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (Summer 2023, Hola Slot 1 — PaperNo_4). Đọc kỹ hướng dẫn trước khi bắt đầu viết mã.</p>
   <ol>
     <li>Phần mềm: NetBeans IDE 8.x, Java JDK 1.8. Tạo một thư mục để lưu project given, ví dụ CSD_given. Tải given materials ở trên vào đó — gồm 3 project NetBeans riêng: Q1 (MyList), Q2 (BSTree), Q3 (Graph).</li>
     <li>Các bước cho câu 1 (làm tương tự cho câu 2 và 3): mở NetBeans, mở project Q1 given, rồi sửa MyList.java theo yêu cầu bên dưới (sửa BSTree.java cho Q2 và Graph.java cho Q3).</li>
     <li>Trước khi nộp: chạy "Clean and Build Project" (Shift+F11) để chắc chắn BUILD SUCCESSFUL — nếu không, project bị 0 điểm.</li>
     <li>Không dùng tiếng Việt có dấu khi viết chú thích trong chương trình. Không thêm import mới vào các file cho sẵn.</li>
     <li>Không cần để ý ý nghĩa thật của đối tượng, biến và giá trị của chúng trong các câu dưới đây.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

// Các mảnh dùng chung: GIỮ RIÊNG bản Anh và bản Việt, chỉ ghép bằng B() ở
// bước cuối. KHÔNG nhét một chuỗi đã có "|||" vào trong B() — làm thế sẽ sinh
// ra 3-4 dấu phân cách trong một trường và khung song ngữ sẽ hiển thị sai
// (lỗi này có thật trong CSD201-PE44/PE49, ở đây cố ý không lặp lại).
const verifiedNoteEn = `<p><b>Note:</b> the expected output below is the real output of compiling and running the given project (javac/java) on its own <code>data.txt</code>, and it matches the worked example printed in the original exam paper character for character.</p>`;
const verifiedNoteVi = `<p><b>Lưu ý:</b> kết quả mong đợi dưới đây là output THẬT của việc biên dịch và chạy project given (javac/java) trên chính <code>data.txt</code> của nó, và khớp từng ký tự với ví dụ minh hoạ in trong đề gốc.</p>`;

// ===================== Question 1 (MyList<Boat>) — 4 marks =====================

const scenarioQ1En = `<p><strong>Question 1 (4 marks) — Scenario:</strong> in this question you should complete some methods in <code>MyList.java</code>. The class <code>Boat</code> with 3 data members (sea, sail, paddle) is given and you do not need to edit it. The <code>MyList</code> class is a linked list of Boat objects. Each of the 4 methods below is graded independently against its own worked example.</p>`;
const scenarioQ1Vi = `<p><strong>Câu 1 (4 điểm) — Bối cảnh:</strong> ở câu này bạn cần hoàn thiện một số method trong <code>MyList.java</code>. Lớp <code>Boat</code> với 3 thành viên dữ liệu (sea, sail, paddle) đã cho sẵn, không cần sửa. Lớp <code>MyList</code> là danh sách liên kết các đối tượng Boat. Mỗi trong 4 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ của nó.</p>`;

const q1_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ1En + `<p><strong>1.1 addLast() – 1 mark</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: <code>void addLast(String xSea, int xSail, int xPaddle)</code></li><li>Task: check if <code>xSea.charAt(0) == 'A'</code> then <b>do nothing</b>, otherwise add a new node with sea=xSea, sail=xSail, paddle=xPaddle to the end of the list. (sail and paddle can get arbitrary, even negative values.)</li><li><code>void f1()</code> — do not edit this method; your task is to complete <code>addLast(...)</code> only. Its result is written to f1.txt.</li></ul>` + verifiedNoteEn,
    scenarioQ1Vi + `<p><strong>1.1 addLast() – 1 điểm</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: <code>void addLast(String xSea, int xSail, int xPaddle)</code></li><li>Nhiệm vụ: kiểm tra nếu <code>xSea.charAt(0) == 'A'</code> thì <b>không làm gì</b>; ngược lại thêm node mới sea=xSea, sail=xSail, paddle=xPaddle vào CUỐI danh sách. (sail và paddle có thể nhận giá trị bất kỳ, kể cả âm.)</li><li><code>void f1()</code> — không sửa method này; nhiệm vụ của bạn chỉ là hoàn thiện <code>addLast(...)</code>. Kết quả được ghi ra f1.txt.</li></ul>` + verifiedNoteVi,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(B,5,3) (C,6,5) (D,2,4) (E,7,9) (F,4,-7) (G,-3,2)`,
  explanation: B(
    `<p>data.txt supplies sea = A B C D E F G, sail = 9 5 6 2 7 4 -3, paddle = 8 3 5 4 9 -7 2. Only the first candidate, "A", starts with 'A', so it is skipped; the remaining 6 are appended in the order they are read. Note that a negative sail or paddle is perfectly legal — (F,4,-7) and (G,-3,2) must still be inserted.</p>`,
    `<p>data.txt cho sea = A B C D E F G, sail = 9 5 6 2 7 4 -3, paddle = 8 3 5 4 9 -7 2. Chỉ ứng viên đầu tiên "A" bắt đầu bằng 'A' nên bị bỏ qua; 6 phần tử còn lại được nối vào cuối theo đúng thứ tự đọc. Lưu ý sail hay paddle âm vẫn hợp lệ — (F,4,-7) và (G,-3,2) vẫn phải được chèn.</p>`,
  ),
  rubric: [
    { id: 'sea_filter', criterion: B(`Correctly does nothing when xSea.charAt(0) == 'A' (and does NOT filter on sail/paddle sign).`, `Không làm gì đúng khi xSea.charAt(0) == 'A' (và KHÔNG lọc theo dấu của sail/paddle).`), weight: 1, maxScore: 0.4 },
    { id: 'append', criterion: B('Correctly appends the new node at the end of the list, updating head/tail for both the empty and non-empty cases.', 'Nối đúng node mới vào cuối danh sách, cập nhật head/tail đúng cho cả trường hợp danh sách rỗng và không rỗng.'), weight: 1, maxScore: 0.6 },
  ],
};

const q1_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>1.2 f2() – 1 mark: insert x, y, z at positions 1, 3 and 4</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>void f2()</code>, just after the marked comment (keep every pre-given statement)</li><li>Task: there are 3 given Boat objects x, y, z in this function. Suppose the list contains at least 3 elements. Write statements to insert x, y and z into the list so that x, y, z will be at positions 1, 3 and 4 (the head's position is 0).</li></ul>` + verifiedNoteEn,
    `<p><strong>1.2 f2() – 1 điểm: chèn x, y, z vào vị trí 1, 3 và 4</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>void f2()</code>, ngay sau chú thích đánh dấu (giữ nguyên mọi câu lệnh cho sẵn)</li><li>Nhiệm vụ: trong hàm này có 3 đối tượng Boat x, y, z cho sẵn. Giả sử danh sách có ít nhất 3 phần tử. Viết lệnh chèn x, y và z vào danh sách sao cho x, y, z nằm ở vị trí 1, 3 và 4 (vị trí của head là 0).</li></ul>` + verifiedNoteVi,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9) (J,3,7)
(C,9,8) (X,1,2) (D,6,3) (Y,2,3) (Z,3,4) (E,8,5) (F,5,4) (I,4,9) (J,3,7)`,
  explanation: B(
    `<p>Line 1 is the list before the insertions (written by the pre-given ftraverse call), line 2 is the list after. Insert one at a time, in the order x, y, z: X lands right after the head (position 1); with the list now C X D E F I J, inserting Y at position 3 gives C X D Y E F I J; inserting Z at position 4 gives C X D Y Z E F I J. Counting from 0 in the final list: position 1 = X, position 3 = Y, position 4 = Z — as required.</p>`,
    `<p>Dòng 1 là danh sách TRƯỚC khi chèn (do lệnh ftraverse cho sẵn ghi ra), dòng 2 là sau khi chèn. Chèn lần lượt theo thứ tự x, y, z: X vào ngay sau head (vị trí 1); lúc này danh sách là C X D E F I J, chèn Y vào vị trí 3 được C X D Y E F I J; chèn Z vào vị trí 4 được C X D Y Z E F I J. Đếm từ 0 trên danh sách cuối: vị trí 1 = X, vị trí 3 = Y, vị trí 4 = Z — đúng yêu cầu.</p>`,
  ),
  rubric: [
    { id: 'insert_x', criterion: B('Correctly inserts x so it ends up at position 1 (right after the head).', 'Chèn đúng x để nó nằm ở vị trí 1 (ngay sau head).'), weight: 1, maxScore: 0.3 },
    { id: 'insert_yz', criterion: B('Correctly inserts y and z so they end up at positions 3 and 4 of the final list.', 'Chèn đúng y và z để chúng nằm ở vị trí 3 và 4 của danh sách cuối cùng.'), weight: 1, maxScore: 0.5 },
    { id: 'links_intact', criterion: B('Keeps the list links (and tail) consistent, and does not remove or reorder any pre-existing node.', 'Giữ liên kết danh sách (và tail) nhất quán, không xoá hay đảo thứ tự node có sẵn nào.'), weight: 1, maxScore: 0.2 },
  ],
};

const q1_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>1.3 f3() – 1 mark: move the second maximum-paddle node to the tail</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>void f3()</code>, just after the marked comment (keep every pre-given statement)</li><li>Task: move the second node having maximum paddle to the tail (thus if there is only one maximum paddle then do nothing).</li></ul>` + verifiedNoteEn,
    `<p><strong>1.3 f3() – 1 điểm: đưa node có paddle lớn nhất THỨ HAI về cuối</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>void f3()</code>, ngay sau chú thích đánh dấu (giữ nguyên mọi câu lệnh cho sẵn)</li><li>Nhiệm vụ: chuyển node THỨ HAI có paddle lớn nhất về cuối danh sách (nếu chỉ có duy nhất một node đạt paddle lớn nhất thì không làm gì).</li></ul>` + verifiedNoteVi,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,8,6) (D,3,9) (E,9,2) (F,5,9) (G,9,7) (H,6,8) (I,7,3)
(C,8,6) (D,3,9) (E,9,2) (G,9,7) (H,6,8) (I,7,3) (F,5,9)`,
  explanation: B(
    `<p>The paddles are 6, 9, 2, 9, 7, 8, 3 so the maximum is 9, reached twice: at D (the 1st) and at F (the 2nd). The 2nd one, (F,5,9), is unlinked from its position and appended after (I,7,3); every other node keeps its relative order. Had 9 occurred only once, the method would have left the list untouched.</p>`,
    `<p>Các giá trị paddle là 6, 9, 2, 9, 7, 8, 3 nên lớn nhất là 9, xuất hiện hai lần: ở D (lần 1) và ở F (lần 2). Node thứ 2 là (F,5,9) được gỡ khỏi vị trí cũ và nối vào sau (I,7,3); mọi node khác giữ nguyên thứ tự tương đối. Nếu 9 chỉ xuất hiện một lần thì method phải để nguyên danh sách.</p>`,
  ),
  rubric: [
    { id: 'find_second_max', criterion: B('Correctly computes the maximum paddle and identifies the SECOND node (scanning from head) whose paddle equals it.', 'Tính đúng paddle lớn nhất và xác định đúng node THỨ HAI (quét từ head) có paddle bằng giá trị đó.'), weight: 1, maxScore: 0.5 },
    { id: 'move_to_tail', criterion: B('Correctly unlinks that node and re-attaches it as the new tail (tail.next and tail updated, previous node relinked).', 'Gỡ đúng node đó và nối lại làm tail mới (cập nhật tail.next và tail, nối lại node đứng trước).'), weight: 1, maxScore: 0.35 },
    { id: 'noop_case', criterion: B('Correctly does nothing when only one node has the maximum paddle (and does not crash on that case).', 'Không làm gì đúng khi chỉ có một node đạt paddle lớn nhất (và không lỗi ở trường hợp đó).'), weight: 1, maxScore: 0.15 },
  ],
};

const q1_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>1.4 f4() – 1 mark: sort positions 2..6 ascending by paddle</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>void f4()</code>, just after the marked comment (keep every pre-given statement)</li><li>Task: suppose the list contains at least 7 elements. Sort the 5 elements from position 2 to position 6 ascendingly by paddle (the head's position is 0). Every node outside that range must stay where it is.</li></ul>` + verifiedNoteEn,
    `<p><strong>1.4 f4() – 1 điểm: sắp xếp vị trí 2..6 tăng dần theo paddle</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>void f4()</code>, ngay sau chú thích đánh dấu (giữ nguyên mọi câu lệnh cho sẵn)</li><li>Nhiệm vụ: giả sử danh sách có ít nhất 7 phần tử. Sắp xếp 5 phần tử từ vị trí 2 đến vị trí 6 tăng dần theo paddle (vị trí của head là 0). Mọi node ngoài đoạn đó phải giữ nguyên vị trí.</li></ul>` + verifiedNoteVi,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,9,8) (D,11,12) (E,10,11) (F,1,19) (I,7,9) (J,6,8) (K,5,6) (L,4,5) (M,3,4)
(C,9,8) (D,11,12) (K,5,6) (J,6,8) (I,7,9) (E,10,11) (F,1,19) (L,4,5) (M,3,4)`,
  explanation: B(
    `<p>Positions 2..6 hold E(paddle 11), F(19), I(9), J(8), K(6). Sorted ascending by paddle they become K(6), J(8), I(9), E(11), F(19), and they are written back into those same 5 slots. Positions 0, 1 (C, D) and 7, 8 (L, M) are untouched. Swapping the node <i>info</i> values is the simplest correct approach — relinking the nodes themselves is equally acceptable as long as the result is identical.</p>`,
    `<p>Vị trí 2..6 chứa E(paddle 11), F(19), I(9), J(8), K(6). Sắp tăng dần theo paddle được K(6), J(8), I(9), E(11), F(19), rồi ghi ngược lại đúng 5 ô đó. Vị trí 0, 1 (C, D) và 7, 8 (L, M) giữ nguyên. Hoán đổi trường <i>info</i> của node là cách đơn giản mà đúng — nối lại chính các node cũng chấp nhận được miễn kết quả giống hệt.</p>`,
  ),
  rubric: [
    { id: 'range', criterion: B('Correctly targets exactly the 5 nodes at 0-indexed positions 2 through 6 and leaves every node outside that range untouched.', 'Nhắm đúng 5 node ở vị trí 2 đến 6 (đếm từ 0) và giữ nguyên mọi node ngoài đoạn đó.'), weight: 1, maxScore: 0.5 },
    { id: 'sort_asc_paddle', criterion: B('Correctly sorts those 5 elements ascending by paddle (not by sail, not descending).', 'Sắp đúng 5 phần tử đó tăng dần theo paddle (không phải theo sail, không phải giảm dần).'), weight: 1, maxScore: 0.5 },
  ],
};

// ===================== Question 2 (BSTree<Boat>) — 4 marks =====================

const scenarioQ2En = `<p><strong>Question 2 (4 marks) — Scenario:</strong> in this question you should complete some methods in <code>BSTree.java</code>. The class <code>Boat</code> with 3 data members (sea, sail, paddle) is given and you do not need to edit it. The <code>BSTree</code> class is a binary search tree of Boat objects. The variable <b>sail is the key of the tree, thus it must be unique</b>.</p>`;
const scenarioQ2Vi = `<p><strong>Câu 2 (4 điểm) — Bối cảnh:</strong> ở câu này bạn cần hoàn thiện một số method trong <code>BSTree.java</code>. Lớp <code>Boat</code> với 3 thành viên dữ liệu (sea, sail, paddle) đã cho sẵn, không cần sửa. Lớp <code>BSTree</code> là cây nhị phân tìm kiếm các đối tượng Boat. Biến <b>sail là khoá của cây, do đó nó phải duy nhất</b>.</p>`;

const q2_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ2En + `<p><strong>2.1 insert() – 1 mark</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: <code>void insert(String xSea, int xSail, int xPaddle)</code></li><li>Task: check if <code>xSea.charAt(0) == 'B'</code> then <b>do nothing</b>, otherwise insert a new Boat object with sea=xSea, sail=xSail, paddle=xPaddle into the tree (sail and paddle can get arbitrary, even negative values).</li><li><code>void f1()</code> — do not edit this method; your task is to complete <code>insert(...)</code> only. It writes the breadth-first traversal on line 1 and the in-order traversal on line 2 of f1.txt.</li></ul>` + verifiedNoteEn,
    scenarioQ2Vi + `<p><strong>2.1 insert() – 1 điểm</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: <code>void insert(String xSea, int xSail, int xPaddle)</code></li><li>Nhiệm vụ: kiểm tra nếu <code>xSea.charAt(0) == 'B'</code> thì <b>không làm gì</b>; ngược lại chèn đối tượng Boat mới sea=xSea, sail=xSail, paddle=xPaddle vào cây (sail và paddle có thể nhận giá trị bất kỳ, kể cả âm).</li><li><code>void f1()</code> — không sửa method này; nhiệm vụ của bạn chỉ là hoàn thiện <code>insert(...)</code>. Nó ghi duyệt breadth-first ở dòng 1 và duyệt in-order ở dòng 2 của f1.txt.</li></ul>` + verifiedNoteVi,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(A,7,9) (C,4,3) (D,8,6) (E,2,5) (Y,6,-7) (F,-6,7)
(F,-6,7) (E,2,5) (C,4,3) (Y,6,-7) (A,7,9) (D,8,6)`,
  explanation: B(
    `<p>data.txt supplies 8 candidates: A(7,9) B(9,4) C(4,3) D(8,6) E(2,5) F(-6,7) X(4,5) Y(6,-7). Two of them never make it into the tree, for two different reasons: B is rejected by the sea filter, and X is rejected because its key sail=4 already belongs to C — the key must be unique. The remaining 6 build the tree A(7) at the root, C(4) and D(8) as its children, E(2) and Y(6) under C, and F(-6) under E. That gives the breadth-first line 1 and the in-order line 2 shown above. Note that the in-order line is sorted by sail (-6, 2, 4, 6, 7, 8), which is the quickest way to sanity-check your own tree.</p>`,
    `<p>data.txt cho 8 ứng viên: A(7,9) B(9,4) C(4,3) D(8,6) E(2,5) F(-6,7) X(4,5) Y(6,-7). Hai trong số đó không bao giờ vào cây, vì hai lý do khác nhau: B bị lọc theo sea, còn X bị từ chối vì khoá sail=4 đã thuộc về C — khoá phải duy nhất. Sáu phần tử còn lại dựng nên cây gốc A(7), hai con C(4) và D(8), dưới C là E(2) và Y(6), dưới E là F(-6). Từ đó ra dòng 1 breadth-first và dòng 2 in-order như trên. Lưu ý dòng in-order được sắp theo sail (-6, 2, 4, 6, 7, 8) — đó là cách nhanh nhất để tự kiểm tra cây của mình.</p>`,
  ),
  rubric: [
    { id: 'sea_filter', criterion: B(`Correctly does nothing when xSea.charAt(0) == 'B'.`, `Không làm gì đúng khi xSea.charAt(0) == 'B'.`), weight: 1, maxScore: 0.25 },
    { id: 'bst_order', criterion: B('Correctly walks down the tree comparing sail and links the new node as a left/right child of the right father (empty-tree case handled).', 'Đi đúng xuống cây theo so sánh sail và nối node mới làm con trái/phải của đúng node cha (xử lý được trường hợp cây rỗng).'), weight: 1, maxScore: 0.45 },
    { id: 'unique_key', criterion: B('Correctly refuses the insertion when a node with the same sail already exists (unique key).', 'Từ chối đúng khi đã có node cùng sail (khoá duy nhất).'), weight: 1, maxScore: 0.3 },
  ],
};

const q2_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>2.2 f2() – 1 mark: breadth-first traversal filtered by paddle</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>void f2()</code>, just after the marked comment (keep every pre-given statement)</li><li>Task: perform the breadth-first traversal from the root but display to file f2.txt the nodes with <b>paddle &gt; 5</b> only. Hint: copy the function <code>breadth(...)</code> to a function <code>breadth2(...)</code> and modify it.</li></ul>` + verifiedNoteEn,
    `<p><strong>2.2 f2() – 1 điểm: duyệt breadth-first có lọc theo paddle</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>void f2()</code>, ngay sau chú thích đánh dấu (giữ nguyên mọi câu lệnh cho sẵn)</li><li>Nhiệm vụ: duyệt breadth-first từ gốc nhưng CHỈ ghi ra file f2.txt các node có <b>paddle &gt; 5</b>. Gợi ý: copy hàm <code>breadth(...)</code> thành hàm <code>breadth2(...)</code> rồi sửa nó.</li></ul>` + verifiedNoteVi,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)
(H,10,8) (I,1,7) (J,3,9) (L,5,10) (M,4,6)`,
  explanation: B(
    `<p>Line 1 is the full breadth-first traversal (written by the pre-given call), line 2 is your filtered one. The paddles in breadth order are 2, 1, 4, -1, 3, 8, 7, 9, 5, 10, 6; the ones strictly greater than 5 are H(8), I(7), J(9), L(10), M(6). Note K has paddle exactly 5 and is therefore excluded — the condition is &gt; 5, not ≥ 5. Crucially, the filter must only suppress the <i>writing</i>: the traversal itself must still descend into the children of a skipped node, otherwise L(10) and M(6) — which sit below J and L — would never be reached.</p>`,
    `<p>Dòng 1 là duyệt breadth-first đầy đủ (do lệnh cho sẵn ghi), dòng 2 là bản đã lọc của bạn. Các paddle theo thứ tự breadth là 2, 1, 4, -1, 3, 8, 7, 9, 5, 10, 6; những giá trị lớn hơn hẳn 5 là H(8), I(7), J(9), L(10), M(6). Lưu ý K có paddle đúng bằng 5 nên bị loại — điều kiện là &gt; 5 chứ không phải ≥ 5. Quan trọng nhất: bộ lọc chỉ được chặn việc GHI RA; phép duyệt vẫn phải đi xuống con của node bị bỏ qua, nếu không L(10) và M(6) — nằm dưới J và L — sẽ không bao giờ tới được.</p>`,
  ),
  rubric: [
    { id: 'breadth_copy', criterion: B('Correctly performs a full breadth-first (level-order, queue-based) traversal of the whole tree, still enqueuing the children of skipped nodes.', 'Duyệt đúng breadth-first đầy đủ (theo mức, dùng hàng đợi) trên toàn cây, vẫn đưa con của node bị bỏ qua vào hàng đợi.'), weight: 1, maxScore: 0.5 },
    { id: 'paddle_filter', criterion: B('Only writes nodes whose paddle is strictly greater than 5.', 'Chỉ ghi ra các node có paddle lớn hơn hẳn 5.'), weight: 1, maxScore: 0.5 },
  ],
};

const q2_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>2.3 f3() – 1 mark: delete q = p.left by copying</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>void f3()</code>, just after the marked comment (keep every pre-given statement)</li><li>Task: perform an in-order traversal from the root and find the <b>second node p having a left child</b>. If such a node does not exist then do nothing, otherwise delete the node <code>q = p.left</code> <b>by copying</b>.</li></ul>` + verifiedNoteEn,
    `<p><strong>2.3 f3() – 1 điểm: xoá q = p.left bằng phương pháp copy</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>void f3()</code>, ngay sau chú thích đánh dấu (giữ nguyên mọi câu lệnh cho sẵn)</li><li>Nhiệm vụ: duyệt in-order từ gốc và tìm <b>node p THỨ HAI có con trái</b>. Nếu không tồn tại node như vậy thì không làm gì; ngược lại xoá node <code>q = p.left</code> <b>bằng phương pháp copy</b>.</li></ul>` + verifiedNoteVi,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)
(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (K,-1,5) (J,3,9) (L,5,10) (M,4,6)`,
  explanation: B(
    `<p>Both lines are breadth-first traversals, before and after. The tree built from data.txt has C(8) at the root; D(6) and E(9) below it; F(2) and G(7) under D; H(10) under E; I(1) and J(3) under F; K(-1) under I; L(5) under J; M(4) under L. The in-order sequence by sail is K(-1), I(1), F(2), J(3), M(4), L(5), D(6), G(7), C(8), E(9), H(10). Scanning it, the nodes that have a left child are I (1st), F (2nd), L (3rd), D, C — so p = F and q = F.left = I. Deleting I by copying: I has a left subtree, so its in-order predecessor is the right-most node of that subtree, which is K itself; K's data is copied into I's node and K is unlinked. That is why the node in I's old position now reads (K,-1,5) and the tree has 10 nodes instead of 11.</p>`,
    `<p>Cả hai dòng đều là duyệt breadth-first, trước và sau. Cây dựng từ data.txt có C(8) ở gốc; dưới nó là D(6) và E(9); dưới D là F(2) và G(7); dưới E là H(10); dưới F là I(1) và J(3); dưới I là K(-1); dưới J là L(5); dưới L là M(4). Dãy in-order theo sail là K(-1), I(1), F(2), J(3), M(4), L(5), D(6), G(7), C(8), E(9), H(10). Quét dãy đó, các node có con trái là I (thứ 1), F (thứ 2), L (thứ 3), D, C — vậy p = F và q = F.left = I. Xoá I bằng copy: I có cây con trái nên node tiền nhiệm in-order là node phải nhất của cây con đó, chính là K; dữ liệu của K được chép vào node I rồi gỡ K ra. Vì thế node ở vị trí cũ của I giờ đọc là (K,-1,5) và cây còn 10 node thay vì 11.</p>`,
  ),
  rubric: [
    { id: 'find_p', criterion: B('Correctly walks the tree in in-order and picks the SECOND node that has a non-null left child (not the second node overall, not the second with two children).', 'Duyệt đúng in-order và chọn node THỨ HAI có con trái khác null (không phải node thứ hai nói chung, cũng không phải node thứ hai có 2 con).'), weight: 1, maxScore: 0.4 },
    { id: 'delete_by_copying', criterion: B("Correctly deletes q = p.left by copying: copy the in-order predecessor's (right-most node of q's left subtree) data into q, then unlink that predecessor — or bypass q with its only child when q has no left subtree.", 'Xoá đúng q = p.left bằng copy: chép dữ liệu của node tiền nhiệm in-order (node phải nhất trong cây con trái của q) vào q rồi gỡ node tiền nhiệm — hoặc thay q bằng con duy nhất của nó khi q không có cây con trái.'), weight: 1, maxScore: 0.45 },
    { id: 'noop_and_links', criterion: B('Keeps every other link intact and correctly does nothing when no such second node exists.', 'Giữ nguyên mọi liên kết khác và không làm gì đúng khi không tồn tại node thứ hai như vậy.'), weight: 1, maxScore: 0.15 },
  ],
};

const q2_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>2.4 f4() – 1 mark: rotate p to the right</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>void f4()</code>, just after the marked comment (keep every pre-given statement)</li><li>Task: perform an in-order traversal from the root and find the <b>second node p having a left child</b>. If such a node does not exist then do nothing, otherwise <b>rotate p to the right</b>.</li></ul>` + verifiedNoteEn,
    `<p><strong>2.4 f4() – 1 điểm: xoay p sang phải</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>void f4()</code>, ngay sau chú thích đánh dấu (giữ nguyên mọi câu lệnh cho sẵn)</li><li>Nhiệm vụ: duyệt in-order từ gốc và tìm <b>node p THỨ HAI có con trái</b>. Nếu không tồn tại node như vậy thì không làm gì; ngược lại <b>xoay p sang phải</b>.</li></ul>` + verifiedNoteVi,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)
(C,8,2) (D,6,1) (E,9,4) (I,1,7) (G,7,3) (H,10,8) (K,-1,5) (F,2,-1) (J,3,9) (L,5,10) (M,4,6)`,
  explanation: B(
    `<p>The tree and the search for p are exactly the same as in the previous question, so again p = F(2) with left child q = I(1). A right rotation about p makes q take p's place: F.left receives q's old right child (I had none, so null), q.right becomes F, and F's father D now points to I instead of F. Nothing is deleted — all 11 nodes are still there — but F has moved one level down and now appears after K in the breadth-first order. The in-order sequence is unchanged by a rotation, which is the standard way to check the result.</p>`,
    `<p>Cây và việc tìm p giống hệt câu trước, nên vẫn là p = F(2) với con trái q = I(1). Xoay phải quanh p khiến q lên thay chỗ p: F.left nhận con phải cũ của q (I không có nên là null), q.right thành F, và cha của F là D giờ trỏ tới I thay vì F. Không có gì bị xoá — vẫn đủ 11 node — nhưng F tụt xuống một mức và giờ xuất hiện sau K trong thứ tự breadth-first. Phép xoay không làm đổi dãy in-order, đó là cách chuẩn để kiểm tra kết quả.</p>`,
  ),
  rubric: [
    { id: 'find_p', criterion: B('Correctly finds, via in-order traversal, the SECOND node p having a left child, together with its father.', 'Tìm đúng, qua duyệt in-order, node p THỨ HAI có con trái, cùng với cha của nó.'), weight: 1, maxScore: 0.4 },
    { id: 'rotation', criterion: B("Correctly performs the right rotation: q = p.left takes p's place, p.left receives q's old right subtree, q.right becomes p.", 'Xoay phải đúng: q = p.left lên thay chỗ p, p.left nhận cây con phải cũ của q, q.right thành p.'), weight: 1, maxScore: 0.45 },
    { id: 'reattach_father', criterion: B("Correctly re-attaches q to p's father (or updates root when p was the root), and does nothing when no such node exists.", 'Nối lại q vào cha của p đúng (hoặc cập nhật root khi p là gốc), và không làm gì khi không có node như vậy.'), weight: 1, maxScore: 0.15 },
  ],
};

// ===================== Question 3 (Graph) — 2 marks =====================

const scenarioQ3En = `<p><strong>Question 3 (2 marks) — Scenario:</strong> in this question you should complete some methods in <code>Graph.java</code>. The class <code>Graph</code> is the implementation of a graph over 9 vertices A..I, stored as an adjacency matrix loaded from data.txt.</p>`;
const scenarioQ3Vi = `<p><strong>Câu 3 (2 điểm) — Bối cảnh:</strong> ở câu này bạn cần hoàn thiện một số method trong <code>Graph.java</code>. Lớp <code>Graph</code> là cài đặt một đồ thị trên 9 đỉnh A..I, lưu bằng ma trận kề nạp từ data.txt.</p>`;

const q3_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ3En + `<p><strong>3.1 f1() – 1 mark: breadth-first traversal displaying a vertex range</strong></p><ul><li>File: Graph.java</li><li>Method to Complete: the body of <code>void f1()</code>, just after the marked comment (keep every pre-given statement)</li><li>Task: perform the breadth-first traversal (to the file f1.txt) from the vertex i=4 (the vertex E) but display 5 vertices, <b>from the 2nd vertex to the 6th vertex only</b>. Hint: copy <code>breadth(...)</code> to <code>breadth2(...)</code> and modify the latter one.</li></ul>` + verifiedNoteEn,
    scenarioQ3Vi + `<p><strong>3.1 f1() – 1 điểm: duyệt breadth-first, chỉ hiện một đoạn đỉnh</strong></p><ul><li>File: Graph.java</li><li>Method cần hoàn thiện: phần thân <code>void f1()</code>, ngay sau chú thích đánh dấu (giữ nguyên mọi câu lệnh cho sẵn)</li><li>Nhiệm vụ: duyệt breadth-first (ghi vào file f1.txt) từ đỉnh i=4 (đỉnh E) nhưng chỉ hiện 5 đỉnh, <b>từ đỉnh thứ 2 đến đỉnh thứ 6</b>. Gợi ý: copy <code>breadth(...)</code> thành <code>breadth2(...)</code> rồi sửa hàm mới.</li></ul>` + verifiedNoteVi,
  ),
  starterCode: graphGiven,
  sampleSolution: graphSolved,
  expectedOutput: `E B H A I C D G F
B H A I C`,
  explanation: B(
    `<p>Line 1 is the full breadth-first traversal (written by the pre-given <code>breadth(4,f)</code> call), line 2 is your ranged one. Starting at E the queue visits E, then E's neighbours B and H, then A (from B), I (from H), then C and D (from A), then G (from D) — that is 8 vertices. F is unreachable from E, so the pre-given two-phase <code>breadth(int, ...)</code> restarts on it and it comes last. Your <code>breadth2</code> must keep that same two-phase structure and count vertices <b>globally across both phases</b>, then write only counts 2 through 6: B, H, A, I, C. Counting per-phase or forgetting the restart both give a wrong answer.</p>`,
    `<p>Dòng 1 là duyệt breadth-first đầy đủ (do lệnh <code>breadth(4,f)</code> cho sẵn ghi ra), dòng 2 là bản giới hạn của bạn. Bắt đầu từ E, hàng đợi thăm E, rồi hai láng giềng B và H của E, rồi A (từ B), I (từ H), rồi C và D (từ A), rồi G (từ D) — được 8 đỉnh. F không tới được từ E nên hàm <code>breadth(int, ...)</code> cho sẵn (hai pha) khởi động lại ở nó và nó nằm cuối. Hàm <code>breadth2</code> của bạn phải giữ nguyên cấu trúc hai pha đó và đếm đỉnh <b>chung cho cả hai pha</b>, rồi chỉ ghi các đỉnh thứ 2 đến thứ 6: B, H, A, I, C. Đếm riêng từng pha hoặc quên pha khởi động lại đều cho kết quả sai.</p>`,
  ),
  rubric: [
    { id: 'breadth_copy', criterion: B('Correctly reproduces the given two-phase breadth-first traversal (queue-based, then restarting on any still-unvisited vertex) starting from vertex 4.', 'Tái tạo đúng phép duyệt breadth-first hai pha cho sẵn (dùng hàng đợi, sau đó khởi động lại ở đỉnh chưa thăm) bắt đầu từ đỉnh 4.'), weight: 1, maxScore: 0.5 },
    { id: 'range_filter', criterion: B('Only writes the vertices that are the 2nd through 6th visited overall (5 vertices), counting across the whole traversal rather than per component.', 'Chỉ ghi ra các đỉnh được thăm thứ 2 đến thứ 6 tính chung toàn bộ phép duyệt (5 đỉnh), không đếm riêng theo từng thành phần.'), weight: 1, maxScore: 0.5 },
  ],
};

const q3_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>3.2 f2() – 1 mark: two Dijkstra shortest-path runs</strong></p><ul><li>File: Graph.java</li><li>Method to Complete: the body of <code>void f2()</code>, just after the marked comment (keep every pre-given statement)</li><li>Task: apply Dijkstra's shortest path algorithm to find (1) the shortest path from vertex 0 (A) to vertex 6 (G), then (2) from vertex 2 (C) to vertex 5 (F). Write 3 lines to the file f2.txt: line 1 contains the <b>last 3 vertices selected into the set S</b> for shortest path (1), line 2 contains the <b>labels</b> of the vertices in line 1 correspondingly, line 3 contains the <b>vertices in shortest path (2)</b>. (Note that in the weighted matrix, the value 99 is considered as infinity.)</li><li>You can use <code>fvisit(i,f)</code> to display the vertex i, and <code>f.writeBytes(" " + k)</code> to write the variable k.</li></ul>` + verifiedNoteEn,
    `<p><strong>3.2 f2() – 1 điểm: hai lượt Dijkstra tìm đường đi ngắn nhất</strong></p><ul><li>File: Graph.java</li><li>Method cần hoàn thiện: phần thân <code>void f2()</code>, ngay sau chú thích đánh dấu (giữ nguyên mọi câu lệnh cho sẵn)</li><li>Nhiệm vụ: áp dụng thuật toán Dijkstra để tìm (1) đường đi ngắn nhất từ đỉnh 0 (A) tới đỉnh 6 (G), rồi (2) từ đỉnh 2 (C) tới đỉnh 5 (F). Ghi 3 dòng vào file f2.txt: dòng 1 là <b>3 đỉnh cuối cùng được chọn vào tập S</b> của đường đi (1), dòng 2 là <b>nhãn</b> của các đỉnh ở dòng 1 tương ứng, dòng 3 là <b>các đỉnh trên đường đi ngắn nhất (2)</b>. (Lưu ý trong ma trận trọng số, giá trị 99 được coi là vô cùng.)</li><li>Có thể dùng <code>fvisit(i,f)</code> để hiện đỉnh i, và <code>f.writeBytes(" " + k)</code> để ghi biến k.</li></ul>` + verifiedNoteVi,
  ),
  starterCode: graphGiven,
  sampleSolution: graphSolved,
  expectedOutput: `D F G
19 24 29
C E D F`,
  explanation: B(
    `<p>Run (1), from A. Dijkstra selects vertices into S in this order, with these final labels: A(0), I(2), B(10), C(12), H(12), E(15), D(19), F(24), G(29). The last 3 selected are therefore D, F, G with labels 19, 24, 29 — lines 1 and 2. Two relaxations decide the answer: C lowers E from 25 to 15 (12+3), and E then lowers D from 20 to 19 (15+4), which in turn gives F = 24 and G = 29 through D. Run (2), from C: C(0), I(2), E(3), D(7), F(12); the predecessor chain of F is F←D←E←C, so the path printed on line 3 is C E D F. Note the graph is directed — a[i][j] is not a[j][i] — so you must follow the rows, and 99 must be treated as no edge at all.</p>`,
    `<p>Lượt (1), từ A. Dijkstra chọn các đỉnh vào S theo thứ tự này, với nhãn cuối cùng: A(0), I(2), B(10), C(12), H(12), E(15), D(19), F(24), G(29). Vậy 3 đỉnh cuối được chọn là D, F, G với nhãn 19, 24, 29 — chính là dòng 1 và dòng 2. Hai lần nới lỏng quyết định đáp án: C hạ E từ 25 xuống 15 (12+3), rồi E hạ D từ 20 xuống 19 (15+4), từ đó qua D mới ra F = 24 và G = 29. Lượt (2), từ C: C(0), I(2), E(3), D(7), F(12); chuỗi tiền nhiệm của F là F←D←E←C nên đường đi ghi ở dòng 3 là C E D F. Lưu ý đồ thị có hướng — a[i][j] khác a[j][i] — nên phải đi theo hàng, và 99 phải được coi là hoàn toàn không có cạnh.</p>`,
  ),
  rubric: [
    { id: 'dijkstra_core', criterion: B('Implements Dijkstra correctly on the directed weighted matrix: repeatedly select the unselected vertex with the smallest label, relax its out-edges, and treat 99 as infinity (no edge).', 'Cài đặt Dijkstra đúng trên ma trận trọng số có hướng: lặp lại việc chọn đỉnh chưa chọn có nhãn nhỏ nhất, nới lỏng các cung đi ra, và coi 99 là vô cùng (không có cạnh).'), weight: 1, maxScore: 0.4 },
    { id: 'last3_and_labels', criterion: B('Line 1 lists the last 3 vertices selected into S for run (1) in selection order, and line 2 lists their labels in the same order.', 'Dòng 1 liệt kê đúng 3 đỉnh cuối được chọn vào S ở lượt (1) theo thứ tự chọn, dòng 2 liệt kê nhãn của chúng theo đúng thứ tự đó.'), weight: 1, maxScore: 0.35 },
    { id: 'path2', criterion: B('Line 3 reconstructs the full shortest path of run (2) from C to F, printed from source to destination.', 'Dòng 3 dựng lại đầy đủ đường đi ngắn nhất của lượt (2) từ C tới F, in theo chiều từ nguồn tới đích.'), weight: 1, maxScore: 0.25 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE45',
    title: 'PE Đề 45 — Practical Exam (SU2023, Hola Slot 1)|||PE Đề 45 — Thi thực hành (SU2023, Hola Slot 1)',
    description: 'CSD201 PE (CODE): complete MyList<Boat> (4 marks) + BSTree<Boat> (4 marks) + Graph (2 marks) across 3 given NetBeans projects; every expected output verified against the original exam paper by compiling and running the real project, AI-graded.|||PE CSD201 (viết mã): hoàn thiện MyList<Boat> (4 điểm) + BSTree<Boat> (4 điểm) + Graph (2 điểm) trên 3 project NetBeans given; mọi kết quả mong đợi đã đối chiếu với đề gốc bằng cách biên dịch và chạy thật project, chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE45-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1_1, q1_2, q1_3, q1_4, q2_1, q2_2, q2_3, q2_4, q3_1, q3_2],
  }],
};

const total = spec.exams[0].questions.reduce((s, q) => s + q.points, 0);
if (total !== spec.exams[0].totalPoints) throw new Error(`Tổng điểm câu hỏi ${total} != totalPoints ${spec.exams[0].totalPoints}`);

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${total} điểm`);
