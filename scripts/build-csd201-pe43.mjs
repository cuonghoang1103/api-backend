/**
 * build-csd201-pe43.mjs — sinh content/exams/CSD201-PE43.mjs.
 *
 * Nguồn thật: Đề 43 (csd201pe_su23_685031.zip, "PaperNo_2", SU2023, 3 project
 * NetBeans: Q1=MyList<Boat> 4 method, Q2=BSTree<Boat> 4 method, Q3=Graph 2
 * method). ⚠️⚠️ KHÔNG có paper.pdf — archive này KHÔNG PHẢI given trắng, mà
 * là bản GIẢI SẴN HOÀN CHỈNH kèm bộ chấm điểm riêng (Marking.java,
 * MarkMain.java, zCopyToR_f_4.java — công cụ tự chấm dùng nội bộ, không phải
 * scaffolding phát cho sinh viên).
 *
 * Q2 CÓ SẴN 4 file R_f1.txt..R_f4.txt (đáp án CHÍNH THỨC dùng để tự chấm) —
 * đã compile lại đúng BSTree.java có sẵn và diff với R_f*.txt: KHỚP 100% cả
 * 4 câu, đây là bằng chứng xác thực mạnh nhất có thể có (không phải suy luận
 * lại, mà đối chiếu trực tiếp với đáp án chính thức của chính đề này).
 *
 * Q1 và Q3 KHÔNG có R_f*.txt/paper.pdf để đối chiếu — nhưng cùng tác giải
 * (cùng archive, cùng phong cách code rõ ràng, có cấu trúc hàm phụ trợ mạch
 * lạc) với Q2 đã verify 100% đúng, nên độ tin cậy cao. Đã kiểm bằng 2 cách:
 * (1) tính tay đối chiếu logic của chính các hàm phụ trợ given trong code
 * (max/searchf3/remove cho Q1.f3, sortf4 cho Q1.f4, dijkstra1/dijkstra3 cho
 * Q3.f2 — cùng công thức Dijkstra và cùng ma trận trọng số đã dùng ở
 * CSD201-PE39, kết quả trùng khớp), (2) compile+chạy thật để lấy
 * expectedOutput, không suy đoán mù.
 *
 * Vì không có paper.pdf, các đoạn "Câu N" dưới đây được VIẾT LẠI từ hành vi
 * code đã verify (không phải dịch nguyên văn đề — không có đề gốc để dịch).
 *
 * Đã dựng lại bản given TRẮNG đúng chuẩn (bỏ mọi helper method do người
 * giải tự thêm — addFirst/addAfter/insert-tại-vị-trí/max/searchf3/remove/
 * size/get/sortf4 ở Q1; breadth2/dijkstra1/dijkstra3 ở Q3 — chỉ giữ lại
 * đúng khung (1) không sửa + f1()-f4() rỗng theo đúng quy ước các đề khác).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE43.mjs --apply
 */
// ⚠️ ĐỪNG sửa deck này theo PE45 — hai đề KHÁC NHAU, không phải PE43 sai.
// Nguồn PE43 là PaperNo_2 ("giải-không đề"), nguồn PE45 là PaperNo_4. Một agent
// dựng PE45 (07/09/2026) đã báo "PE43 đoán sai 6/10 câu" vì lấy đề mình đang làm
// làm chuẩn cho đề khác. Kiểm lại bằng chính output chuẩn của bộ chấm nằm trong
// nguồn PE43 (PaperNo_2/Q{1,2,3}/f*.txt): cả 10/10 expectedOutput của deck khớp
// TỪNG KÝ TỰ với các file f*.txt đó. Ví dụ Q1/f1.txt có mục (A,9,8) và không có
// mục nào bắt đầu bằng B — đúng với yêu cầu "lọc chữ B" mà deck đang ghi.
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE43.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE43-Given.zip';
const SRC = '/tmp/csd201-pe43-final';

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
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (reconstructed from the given project — this paper's exact wording was not available, see the note on each question).</p>
   <ol>
     <li>Software: NetBeans IDE 8.x, Java JDK 1.8. Download the given materials above — it contains 3 separate NetBeans projects: Q1 (MyList), Q2 (BSTree), Q3 (Graph).</li>
     <li>Each project's file (MyList.java / BSTree.java / Graph.java) has several methods to complete — only edit inside the marked "Student's code" sections. Do not change method signatures or add new import statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into each code box — it is graded by AI against the rubric. You can build &amp; run the real given projects on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dựng lại từ project given — đề gốc bằng văn bản của bài này không có sẵn, xem ghi chú ở từng câu).</p>
   <ol>
     <li>Phần mềm: NetBeans IDE 8.x, Java JDK 1.8. Tải given materials ở trên — gồm 3 project NetBeans riêng: Q1 (MyList), Q2 (BSTree), Q3 (Graph).</li>
     <li>Mỗi file (MyList.java / BSTree.java / Graph.java) có vài method cần hoàn thiện — chỉ sửa trong phần đánh dấu "Student's code". Không đổi chữ ký method hay thêm import mới.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

// ---------------------------------------------------------------------------
// Q1: MyList<Boat> — 4 method
// ---------------------------------------------------------------------------
const myListGiven = fs.readFileSync(path.join(SRC, 'MyList.given.java'), 'utf8');
const myListSolved = fs.readFileSync(path.join(SRC, 'MyList.solved.java'), 'utf8');

const noSourceNote = B(
  `<p><b>Note:</b> the original written exam paper for this deck could not be found — only the given NetBeans project was available (no PDF). The task below is written from the given project's own verified, working reference implementation (compiled and run to produce the sample output), not translated from an official prompt.</p>`,
  `<p><b>Lưu ý:</b> không tìm thấy đề bài gốc dạng văn bản cho đề này — chỉ có project NetBeans given (không có PDF). Yêu cầu dưới đây được viết lại từ chính lời giải mẫu đã verify của project given (đã compile và chạy thật để lấy ví dụ output), không phải dịch từ đề chính thức.</p>`,
);

const scenarioQ1En = `<p><strong>Scenario:</strong> Complete a Java singly-linked-list program of Boat objects (sea, sail, paddle). Each of the 4 methods below is graded independently against its own worked example.</p>` + noSourceNote;
const scenarioQ1Vi = `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java quản lý danh sách liên kết đơn các đối tượng Boat (sea, sail, paddle). Mỗi trong 4 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ.</p>` + noSourceNote;

const q1_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ1En + `<p><strong>Câu 1: addLast() – 1 mark</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: <code>addLast(String xSea, int xSail, int xPaddle)</code></li><li>Task: if <code>xSea.charAt(0) == 'B'</code>, do nothing; otherwise add a new node with sea=xSea, sail=xSail, paddle=xPaddle to the end of the list.</li></ul>`,
    scenarioQ1Vi + `<p><strong>Câu 1: addLast() – 1 điểm</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: <code>addLast(String xSea, int xSail, int xPaddle)</code></li><li>Nhiệm vụ: nếu <code>xSea.charAt(0) == 'B'</code> thì không làm gì; ngược lại thêm node mới sea=xSea, sail=xSail, paddle=xPaddle vào CUỐI danh sách.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(A,9,8) (C,6,5) (D,2,4) (E,7,9) (F,4,-7) (G,-3,2)`,
  explanation: B(
    `<p>Verified by compiling against the given project and running choice 1 (f1) — node B is correctly excluded. Skip when <code>xSea.charAt(0) == 'B'</code>; otherwise append after <code>tail</code> (or set <code>head=tail=node</code> if empty).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given và chạy lựa chọn 1 (f1) — node B bị loại đúng. Bỏ qua khi <code>xSea.charAt(0) == 'B'</code>; ngược lại nối node mới sau <code>tail</code> (hoặc gán <code>head=tail=node</code> nếu rỗng).</p>`,
  ),
  rubric: [
    { id: 'skip_b', criterion: B("Correctly skips insertion when sea starts with 'B'.", "Bỏ qua đúng khi sea bắt đầu bằng 'B'."), weight: 1, maxScore: 0.4 },
    { id: 'append', criterion: B('Correctly appends the new node at the end of the list, handling both empty and non-empty list cases.', 'Nối đúng node mới vào cuối danh sách, xử lý đúng cả trường hợp danh sách rỗng và không rỗng.'), weight: 1, maxScore: 0.6 },
  ],
};

const q1_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 1 mark: Insert x, y, z at positions 2, 3, 5</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: there are 3 given Boat objects x, y, z. Insert x, y, z into the list one at a time (in that order) so that after each insertion, the object just inserted ends up at 0-indexed position 2, 3, and 5 respectively (the head's position is 0). Concretely: insert x right after the node currently at position 1; then insert y right after the node currently at position 2 (of the list as it stands after x was inserted); then insert z right after the node currently at position 4 (of the list as it stands after x and y were inserted).</li></ul>`,
    `<p><strong>Câu 2: f2() – 1 điểm: Chèn x, y, z vào vị trí 2, 3, 5</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: có 3 đối tượng Boat x, y, z. Chèn lần lượt x, y, z vào danh sách (theo đúng thứ tự đó) sao cho sau mỗi lần chèn, đối tượng vừa chèn nằm ở vị trí 0-based lần lượt là 2, 3, 5 (vị trí head là 0). Cụ thể: chèn x ngay sau node đang ở vị trí 1; rồi chèn y ngay sau node đang ở vị trí 2 (của danh sách sau khi đã chèn x); rồi chèn z ngay sau node đang ở vị trí 4 (của danh sách sau khi đã chèn x và y).</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,9,8) (D,6,3) (E,8,5) (F,5,4) (I,4,9) (J,3,7)
(C,9,8) (D,6,3) (X,1,2) (Y,2,3) (E,8,5) (Z,3,4) (F,5,4) (I,4,9) (J,3,7)`,
  explanation: B(
    `<p>Verified by compiling against the given project and running choice 2 (f2). Insert x after position 1 (D) → x lands at position 2; insert y after position 2 (now X) → y lands at position 3; insert z after position 4 (now E) → z lands at position 5. Final order: C,D,X,Y,E,Z,F,I,J.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given và chạy lựa chọn 2 (f2). Chèn x sau vị trí 1 (D) → x vào vị trí 2; chèn y sau vị trí 2 (nay là X) → y vào vị trí 3; chèn z sau vị trí 4 (nay là E) → z vào vị trí 5. Thứ tự cuối: C,D,X,Y,E,Z,F,I,J.</p>`,
  ),
  rubric: [
    { id: 'insert_x', criterion: B('Correctly inserts x so it ends up at position 2.', 'Chèn đúng x để nó nằm ở vị trí 2.'), weight: 1, maxScore: 0.35 },
    { id: 'insert_y', criterion: B('Correctly inserts y (after x) so it ends up at position 3.', 'Chèn đúng y (sau x) để nó nằm ở vị trí 3.'), weight: 1, maxScore: 0.3 },
    { id: 'insert_z', criterion: B('Correctly inserts z (after x and y) so it ends up at position 5.', 'Chèn đúng z (sau x và y) để nó nằm ở vị trí 5.'), weight: 1, maxScore: 0.35 },
  ],
};

const q1_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 3: f3() – 1 mark: Move the 2nd maximum-sail node to the front</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f3()</code>, right after the marked comment</li><li>Task: find the maximum sail value in the list, then find the SECOND node (scanning from head) whose sail equals that maximum. Remove that node from its current position and re-insert it as the new head (front) of the list.</li></ul>`,
    `<p><strong>Câu 3: f3() – 1 điểm: Chuyển node có sail lớn nhất thứ 2 lên đầu</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f3()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: tìm giá trị sail lớn nhất trong danh sách, rồi tìm node THỨ HAI (duyệt từ head) có sail bằng giá trị lớn nhất đó. Xoá node đó khỏi vị trí hiện tại và chèn lại nó thành head mới (đầu danh sách).</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,8,6) (D,3,9) (E,9,2) (F,5,9) (G,9,7) (H,6,8) (I,7,3)
(G,9,7) (C,8,6) (D,3,9) (E,9,2) (F,5,9) (H,6,8) (I,7,3)`,
  explanation: B(
    `<p>Verified by compiling against the given project and running choice 3 (f3). Max sail = 9, occurring at E (1st occurrence) and G (2nd occurrence) — the 2nd occurrence, G, is moved to the front.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given và chạy lựa chọn 3 (f3). Sail lớn nhất = 9, xuất hiện ở E (lần 1) và G (lần 2) — lần xuất hiện thứ 2, G, được chuyển lên đầu.</p>`,
  ),
  rubric: [
    { id: 'find_2nd_max', criterion: B('Correctly finds the maximum sail value and identifies the SECOND node (in list order) having that value.', 'Tìm đúng giá trị sail lớn nhất và xác định đúng node THỨ HAI (theo thứ tự danh sách) có giá trị đó.'), weight: 1, maxScore: 0.5 },
    { id: 'move_to_front', criterion: B('Correctly removes that node and re-inserts it as the new head.', 'Xoá đúng node đó và chèn lại thành head mới.'), weight: 1, maxScore: 0.5 },
  ],
};

const q1_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 4: f4() – 1 mark: Sort a sub-range ascending by sail</strong></p><ul><li>File: MyList.java</li><li>Method to Complete: the body of <code>f4()</code>, right after the marked comment</li><li>Task: sort only the nodes from 0-indexed position 2 up to (but not including) position 6 ascending by sail, leaving every node outside that range untouched.</li></ul>`,
    `<p><strong>Câu 4: f4() – 1 điểm: Sort 1 đoạn con tăng dần theo sail</strong></p><ul><li>File: MyList.java</li><li>Method cần hoàn thiện: phần thân <code>f4()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: chỉ sắp xếp các node từ vị trí 0-based 2 tới TRƯỚC vị trí 6 tăng dần theo sail, giữ nguyên mọi node ngoài đoạn đó.</li></ul>`,
  ),
  starterCode: myListGiven,
  sampleSolution: myListSolved,
  expectedOutput: `(C,9,8) (D,11,12) (E,10,11) (F,1,19) (I,7,9) (J,6,8) (K,5,6) (L,4,5) (M,3,4)
(C,9,8) (D,11,12) (F,1,19) (J,6,8) (I,7,9) (E,10,11) (K,5,6) (L,4,5) (M,3,4)`,
  explanation: B(
    `<p>Verified by compiling against the given project and running choice 4 (f4). Positions 0-1 (C, D) and 6-8 (K, L, M) stay untouched. Positions 2-5 (E,F,I,J with sail 10,1,7,6) are sorted ascending by sail: F(1), J(6), I(7), E(10).</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given và chạy lựa chọn 4 (f4). Vị trí 0-1 (C, D) và 6-8 (K, L, M) giữ nguyên. Vị trí 2-5 (E,F,I,J có sail 10,1,7,6) được sắp tăng dần theo sail: F(1), J(6), I(7), E(10).</p>`,
  ),
  rubric: [
    { id: 'sort_range', criterion: B('Correctly sorts only the nodes from position 2 to 5 (inclusive) ascending by sail.', 'Sắp xếp đúng chỉ các node từ vị trí 2 đến 5 (bao gồm cả 2 đầu) tăng dần theo sail.'), weight: 1, maxScore: 0.7 },
    { id: 'leave_rest', criterion: B('Leaves all nodes outside that range untouched, in their original positions.', 'Giữ nguyên mọi node ngoài đoạn đó, đúng vị trí gốc.'), weight: 1, maxScore: 0.3 },
  ],
};

// ---------------------------------------------------------------------------
// Q2: BSTree<Boat> — 4 method
// ---------------------------------------------------------------------------
const bsTreeGiven = fs.readFileSync(path.join(SRC, 'BSTree.given.java'), 'utf8');
const bsTreeSolved = fs.readFileSync(path.join(SRC, 'BSTree.solved.java'), 'utf8');

const scenarioQ2En = `<p><strong>Scenario:</strong> Complete a Java Binary Search Tree program of Boat objects (sea, sail, paddle). <b>sail is the key of the tree and must be unique</b>. Each of the 4 methods below is graded independently against its own worked example.</p>` + noSourceNote;
const scenarioQ2Vi = `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java cây nhị phân tìm kiếm (BST) các đối tượng Boat (sea, sail, paddle). <b>sail là khoá của cây và phải DUY NHẤT</b>. Mỗi trong 4 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ.</p>` + noSourceNote;

const q2_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ2En + `<p><strong>Câu 1: insert() – 1 mark</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: <code>insert(String xSea, int xSail, int xPaddle)</code></li><li>Task: if <code>xSea.charAt(0) == 'B'</code>, do nothing; otherwise insert a new Boat object (sail is the key, must be unique) into the tree.</li></ul>`,
    scenarioQ2Vi + `<p><strong>Câu 1: insert() – 1 điểm</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: <code>insert(String xSea, int xSail, int xPaddle)</code></li><li>Nhiệm vụ: nếu <code>xSea.charAt(0) == 'B'</code> thì không làm gì; ngược lại chèn 1 đối tượng Boat mới (sail là khoá, phải duy nhất) vào cây.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(A,7,9) (C,4,3) (D,8,6) (E,2,5) (Y,6,-7) (F,-6,7)
(F,-6,7) (E,2,5) (C,4,3) (Y,6,-7) (A,7,9) (D,8,6)`,
  explanation: B(
    `<p><b>Verified against the deck's own official reference output file (R_f1.txt)</b> — compiling the given project's own working insert() and running choice 1 (f1) produces output that matches R_f1.txt byte-for-byte (node B excluded; node X, sail=4 duplicating node C's sail, excluded by the uniqueness check).</p>`,
    `<p><b>Đã đối chiếu với file đáp án chính thức của chính đề này (R_f1.txt)</b> — biên dịch insert() có sẵn của project given và chạy lựa chọn 1 (f1) cho output khớp byte-for-byte với R_f1.txt (node B bị loại; node X, sail=4 trùng sail của node C, bị loại nhờ kiểm tra duy nhất).</p>`,
  ),
  rubric: [
    { id: 'skip_b', criterion: B("Correctly skips insertion when sea starts with 'B'.", "Bỏ qua đúng khi sea bắt đầu bằng 'B'."), weight: 1, maxScore: 0.3 },
    { id: 'bst_order', criterion: B('Correctly inserts respecting BST ordering by sail.', 'Chèn đúng thứ tự BST theo sail.'), weight: 1, maxScore: 0.4 },
    { id: 'unique_sail', criterion: B('Correctly rejects insertion when the sail already exists elsewhere in the tree.', 'Từ chối đúng khi sail đã tồn tại ở nơi khác trong cây.'), weight: 1, maxScore: 0.3 },
  ],
};

const q2_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 1 mark: Breadth-first traversal filtered by paddle</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: perform a breadth-first traversal from the root but write to file f2.txt only the nodes with <code>paddle &gt; 5</code>. Hint: copy the given <code>breadth(...)</code> to a new function (e.g. <code>breadth2(...)</code>) and modify it.</li></ul>`,
    `<p><strong>Câu 2: f2() – 1 điểm: Duyệt rộng lọc theo paddle</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: duyệt breadth-first từ root nhưng chỉ ghi ra file f2.txt các node có <code>paddle &gt; 5</code>. Gợi ý: copy <code>breadth(...)</code> có sẵn thành hàm mới (ví dụ <code>breadth2(...)</code>) rồi sửa hàm mới đó.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)
(H,10,8) (I,1,7) (J,3,9) (L,5,10) (M,4,6)`,
  explanation: B(
    `<p><b>Verified against R_f2.txt</b> — matches byte-for-byte. Standard breadth-first traversal (queue-based, left-then-right enqueue), only writing a node when <code>paddle &gt; 5</code>.</p>`,
    `<p><b>Đã đối chiếu với R_f2.txt</b> — khớp byte-for-byte. Duyệt breadth-first chuẩn (dùng hàng đợi, enqueue trái rồi phải), chỉ ghi ra node khi <code>paddle &gt; 5</code>.</p>`,
  ),
  rubric: [
    { id: 'breadth_copy', criterion: B('Correctly performs the same breadth-first traversal as the given breadth(...).', 'Duyệt đúng breadth-first giống breadth(...) có sẵn.'), weight: 1, maxScore: 0.4 },
    { id: 'filter_paddle', criterion: B('Only writes nodes with paddle > 5.', 'Chỉ ghi ra node có paddle > 5.'), weight: 1, maxScore: 0.6 },
  ],
};

const q2_3 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 3: f3() – 1 mark: Delete the left child of the 2nd such node (in-order)</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f3()</code>, right after the marked comment</li><li>Task: perform an in-order traversal. Among the nodes that have a non-empty LEFT child, find the 2nd such node (call it p) — then delete p's LEFT CHILD (not p itself) by copying (standard in-order predecessor copy: replace the deleted node with the rightmost node of its own left subtree, or its only child if it has just one).</li></ul>`,
    `<p><strong>Câu 3: f3() – 1 điểm: Xoá con trái của node có-con-trái thứ 2 (in-order)</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f3()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: duyệt in-order. Trong số các node CÓ con trái, tìm node thứ 2 như vậy (gọi là p) — rồi xoá CON TRÁI của p (không phải bản thân p) bằng cách copy (predecessor in-order chuẩn: thay node bị xoá bằng node ngoài cùng bên phải của cây con trái nó, hoặc con duy nhất nếu chỉ có 1 con).</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)
(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (K,-1,5) (J,3,9) (L,5,10) (M,4,6)`,
  explanation: B(
    `<p><b>Verified against R_f3.txt</b> — matches byte-for-byte. In-order, the nodes with a non-empty left child are (in order): C (1st), I (2nd) — so p=I, and I's left child, K, is the one deleted by copying. K has no children, so it's simply unlinked (I.left becomes null).</p>`,
    `<p><b>Đã đối chiếu với R_f3.txt</b> — khớp byte-for-byte. Theo in-order, các node có con trái không rỗng là (theo thứ tự): C (thứ 1), I (thứ 2) — nên p=I, và con trái của I, là K, bị xoá bằng cách copy. K không có con nào nên chỉ đơn giản gỡ liên kết (I.left thành null).</p>`,
  ),
  rubric: [
    { id: 'find_target', criterion: B('Correctly finds, via in-order traversal, the 2nd node having a non-empty left child, and identifies its left child as the node to delete.', 'Tìm đúng, qua duyệt in-order, node thứ 2 có con trái không rỗng, và xác định đúng con trái của nó là node cần xoá.'), weight: 1, maxScore: 0.5 },
    { id: 'delete_by_copy', criterion: B('Correctly deletes that node using a valid "delete by copying" technique, leaving a tree with exactly one fewer node.', 'Xoá đúng node đó bằng kỹ thuật "xoá bằng copy" hợp lệ, cây còn lại đúng ít hơn 1 node.'), weight: 1, maxScore: 0.5 },
  ],
};

const q2_4 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 4: f4() – 1 mark: Restructure around the left child of the 2nd such node (in-order)</strong></p><ul><li>File: BSTree.java</li><li>Method to Complete: the body of <code>f4()</code>, right after the marked comment</li><li>Task: perform an in-order traversal. Among the nodes that have a non-empty LEFT child, find the 2nd such node (call it p, with left child q). Perform a right-rotation-style restructuring at p: p's parent now points directly to q in p's place; q's own former right subtree becomes p's new left subtree; p becomes q's right child.</li></ul>`,
    `<p><strong>Câu 4: f4() – 1 điểm: Xoay quanh con trái của node có-con-trái thứ 2 (in-order)</strong></p><ul><li>File: BSTree.java</li><li>Method cần hoàn thiện: phần thân <code>f4()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: duyệt in-order. Trong số các node có con trái, tìm node thứ 2 như vậy (gọi là p, con trái là q). Thực hiện tái cấu trúc kiểu xoay phải tại p: cha của p giờ trỏ thẳng vào q thay cho p; cây con phải cũ của q trở thành cây con trái mới của p; p trở thành con phải của q.</li></ul>`,
  ),
  starterCode: bsTreeGiven,
  sampleSolution: bsTreeSolved,
  expectedOutput: `(C,8,2) (D,6,1) (E,9,4) (F,2,-1) (G,7,3) (H,10,8) (I,1,7) (J,3,9) (K,-1,5) (L,5,10) (M,4,6)
(C,8,2) (D,6,1) (E,9,4) (I,1,7) (G,7,3) (H,10,8) (K,-1,5) (F,2,-1) (J,3,9) (L,5,10) (M,4,6)`,
  explanation: B(
    `<p><b>Verified against R_f4.txt</b> — matches byte-for-byte. As in câu 3, p=I (the 2nd in-order node with a left child), q=K (I's left child). K has no right subtree, so after the rotation-style restructuring, I's parent (F) now points to K, K's right becomes I, and I's left becomes null.</p>`,
    `<p><b>Đã đối chiếu với R_f4.txt</b> — khớp byte-for-byte. Như câu 3, p=I (node thứ 2 in-order có con trái), q=K (con trái của I). K không có cây con phải, nên sau khi xoay, cha của I (là F) giờ trỏ vào K, con phải của K thành I, và con trái của I thành null.</p>`,
  ),
  rubric: [
    { id: 'find_target', criterion: B('Correctly finds, via in-order traversal, the 2nd node having a non-empty left child (p) and its left child (q).', 'Tìm đúng, qua duyệt in-order, node thứ 2 có con trái không rỗng (p) và con trái của nó (q).'), weight: 1, maxScore: 0.4 },
    { id: 'restructure', criterion: B("Correctly performs the rotation-style restructuring: p's parent now points to q, q's old right subtree becomes p's left, and p becomes q's right child.", 'Tái cấu trúc đúng kiểu xoay: cha của p giờ trỏ vào q, cây con phải cũ của q thành con trái của p, và p thành con phải của q.'), weight: 1, maxScore: 0.6 },
  ],
};

// ---------------------------------------------------------------------------
// Q3: Graph — 2 method
// ---------------------------------------------------------------------------
const graphGiven = fs.readFileSync(path.join(SRC, 'Graph.given.java'), 'utf8');
const graphSolved = fs.readFileSync(path.join(SRC, 'Graph.solved.java'), 'utf8');

const scenarioQ3En = `<p><strong>Scenario:</strong> Complete a Java program on a directed/weighted graph represented by an adjacency matrix. Each of the 2 methods below is graded independently against its own worked example.</p>` + noSourceNote;
const scenarioQ3Vi = `<p><strong>Bối cảnh:</strong> Hoàn thiện chương trình Java trên đồ thị (có hướng/có trọng số) biểu diễn bằng ma trận kề. Mỗi trong 2 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ.</p>` + noSourceNote;

const q3_1 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    scenarioQ3En + `<p><strong>Câu 1: f1() – 1 mark: Breadth-first traversal displaying a vertex range</strong></p><ul><li>File: Graph.java</li><li>Method to Complete: the body of <code>f1()</code>, right after the marked comment</li><li>Task: perform breadth-first traversal (to file f1.txt) from vertex i=4 (vertex E) but display only the 2nd through 7th visited vertices. Hint: copy <code>breadth(...)</code> to a new function (e.g. <code>breadth2(...)</code>) and modify it.</li></ul>`,
    scenarioQ3Vi + `<p><strong>Câu 1: f1() – 1 điểm: Duyệt rộng, hiện 1 đoạn đỉnh</strong></p><ul><li>File: Graph.java</li><li>Method cần hoàn thiện: phần thân <code>f1()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: duyệt theo chiều rộng (ghi vào f1.txt) từ đỉnh i=4 (đỉnh E) nhưng chỉ hiện đỉnh thăm thứ 2 tới thứ 7. Gợi ý: copy <code>breadth(...)</code> thành hàm mới (ví dụ <code>breadth2(...)</code>) rồi sửa hàm mới đó.</li></ul>`,
  ),
  starterCode: graphGiven,
  sampleSolution: graphSolved,
  expectedOutput: `E B H A I C D G F
B H A I C D`,
  explanation: B(
    `<p>Verified by compiling against the given project and running choice 1 (f1). This is a directed graph, so vertex F (reachable only via an edge INTO C, not out of it) is unreached by the main BFS from E and only appears at the end via the given fallback loop.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given và chạy lựa chọn 1 (f1). Đây là đồ thị CÓ HƯỚNG, nên đỉnh F (chỉ có cạnh ĐI VÀO từ C, không có cạnh đi ra) không được BFS chính từ E chạm tới, chỉ xuất hiện ở cuối nhờ vòng lặp dự phòng có sẵn.</p>`,
  ),
  rubric: [
    { id: 'breadth_copy', criterion: B('Correctly performs the same breadth-first traversal (including the disconnected-component fallback) as the given breadth(...).', 'Duyệt đúng theo chiều rộng (kể cả phần dự phòng cho thành phần không liên thông) giống breadth(...) có sẵn.'), weight: 1, maxScore: 0.4 },
    { id: 'range_filter', criterion: B('Only writes vertices that are the 2nd through 7th visited overall.', 'Chỉ ghi ra đỉnh là đỉnh thăm thứ 2 đến thứ 7.'), weight: 1, maxScore: 0.6 },
  ],
};

const q3_2 = {
  kind: 'CODE', points: 1, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 1 mark: Two Dijkstra shortest-path runs</strong></p><ul><li>File: Graph.java</li><li>Method to Complete: the body of <code>f2()</code>, right after the marked comment</li><li>Task: (1) apply Dijkstra from vertex 0 (A) to vertex 6 (G): write the last 4 vertices selected into the set S on line 1, then their labels (shortest distance from A) on line 2. (2) apply Dijkstra from vertex 2 (C) to vertex 5 (F): write every vertex of the actual shortest path on line 3. (Note: in the weighted matrix, value 99 is considered as infinity.)</li></ul>`,
    `<p><strong>Câu 2: f2() – 1 điểm: 2 lượt Dijkstra tìm đường ngắn nhất</strong></p><ul><li>File: Graph.java</li><li>Method cần hoàn thiện: phần thân <code>f2()</code>, ngay sau chú thích đánh dấu</li><li>Nhiệm vụ: (1) áp dụng Dijkstra từ đỉnh 0 (A) tới đỉnh 6 (G): ghi 4 đỉnh SAU CÙNG được chọn vào tập S ra dòng 1, rồi nhãn của chúng (khoảng cách ngắn nhất từ A) ra dòng 2. (2) áp dụng Dijkstra từ đỉnh 2 (C) tới đỉnh 5 (F): ghi mọi đỉnh trên đường đi ngắn nhất thật ra dòng 3. (Lưu ý: trong ma trận trọng số, giá trị 99 coi là vô cùng.)</li></ul>`,
  ),
  starterCode: graphGiven,
  sampleSolution: graphSolved,
  expectedOutput: `E D F G
15 19 24 29
C E D F`,
  explanation: B(
    `<p>Verified by compiling against the given project and running choice 2 (f2). Dijkstra's full selection order from A is A,I,B,C,H,E,D,F,G — the last 4 are E,D,F,G with distances 15,19,24,29. The shortest path from C to F is C→E→D→F.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given và chạy lựa chọn 2 (f2). Thứ tự chọn đầy đủ của Dijkstra từ A là A,I,B,C,H,E,D,F,G — 4 đỉnh cuối là E,D,F,G với khoảng cách 15,19,24,29. Đường ngắn nhất từ C tới F là C→E→D→F.</p>`,
  ),
  rubric: [
    { id: 'last4_selected', criterion: B('Correctly runs Dijkstra from A to G and reports the last 4 vertices selected into S together with their distance labels.', 'Chạy đúng Dijkstra từ A tới G và báo đúng 4 đỉnh cuối được chọn vào S cùng nhãn khoảng cách.'), weight: 1, maxScore: 0.6 },
    { id: 'path_c_to_f', criterion: B('Correctly runs Dijkstra from C to F and reports the actual vertex sequence of the shortest path.', 'Chạy đúng Dijkstra từ C tới F và báo đúng dãy đỉnh của đường đi ngắn nhất.'), weight: 1, maxScore: 0.4 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE43',
    title: 'PE Đề 43 — Practical Exam (SU2023, Đề số 2)|||PE Đề 43 — Thi thực hành (SU2023, Đề số 2)',
    description: 'CSD201 PE (CODE): complete singly-linked-list + BST + Graph methods across 3 given NetBeans projects, AI-graded.|||PE CSD201 (viết mã): hoàn thiện method danh sách liên kết đơn + BST + Graph trên 3 project NetBeans given, chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE43-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1_1, q1_2, q1_3, q1_4, q2_1, q2_2, q2_3, q2_4, q3_1, q3_2],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(__biNormalize(spec), null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
