/**
 * build-csd201-pe25.mjs — sinh content/exams/CSD201-PE25.mjs.
 *
 * Nguồn thật: Đề 25 (CSD201_T1_111287, "PaperNo_1", chỉ 1 project Q1 —
 * KHÔNG có Q2/BSTree, khác các đề khác). Hệ thống quản lý khách sạn:
 * dataList (danh sách phòng Room), requestQueue (hàng đợi yêu cầu thuê),
 * MyStore (lớp chính). 4 method: addLast, enQueue+deQueue+rent (dùng chung
 * ở f2/f3/f4). Paper.pdf lần này có GIẢI THÍCH CHI TIẾT từng ví dụ (hiếm có),
 * giúp verify dễ hơn hẳn — dù vậy vẫn tự compile+chạy thật để xác nhận,
 * không chỉ tin lời giải thích suông.
 *
 * CẢ 4/4 method khớp CHÍNH XÁC — không có sai lệch nào. Phát hiện quan
 * trọng (không nói rõ trong yêu cầu method, chỉ suy ra được từ chính ví
 * dụ số liệu): addLast/enQueue phải từ chối phần tử có size<=0 hoặc
 * price<=0 (khớp đúng ràng buộc "must be > 0" nêu trong mô tả lớp Room ở
 * đầu đề, nhưng không lặp lại tường minh trong đặc tả riêng của addLast()).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE25.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE25.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE25-Given.zip';
const SRC = '/tmp/csd201-pe25-final';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper).</p>
   <ol>
     <li>Software: NetBeans IDE 8.x, Java JDK 1.8. Download the given materials above — a single NetBeans project (a Hotel management system: Room, dataList, requestQueue, MyStore).</li>
     <li>The file MyStore.java has several methods to complete — only edit inside the marked "Student's code" sections. Do not change method signatures or add new import statements.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into each code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật).</p>
   <ol>
     <li>Phần mềm: NetBeans IDE 8.x, Java JDK 1.8. Tải given materials ở trên — 1 project NetBeans duy nhất (hệ thống quản lý khách sạn: Room, dataList, requestQueue, MyStore).</li>
     <li>File MyStore.java có vài method cần hoàn thiện — chỉ sửa trong phần đánh dấu "Student's code". Không đổi chữ ký method hay thêm import mới.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const myStoreGiven = fs.readFileSync(path.join(SRC, 'MyStore.given.java'), 'utf8');
const myStoreSolved = fs.readFileSync(path.join(SRC, 'MyStore.solved.java'), 'utf8');

const scenarioEn = `<p><strong>Scenario:</strong> A Hotel management program. <code>Room</code> stores code, status (0=empty, 1=occupied), size (must be &gt; 0), price (must be &gt; 0). <code>dataList</code> is a singly-linked list of all Rooms. <code>requestQueue</code> is a queue of requests, where each request's Room object only carries size (people count) and price (max budget). Each of the 4 methods below is graded independently against its own worked example from the real exam paper.</p>`;
const scenarioVi = `<p><strong>Bối cảnh:</strong> Chương trình quản lý khách sạn. <code>Room</code> lưu code, status (0=trống, 1=đã thuê), size (phải &gt; 0), price (phải &gt; 0). <code>dataList</code> là danh sách liên kết đơn toàn bộ Room. <code>requestQueue</code> là hàng đợi yêu cầu, mỗi yêu cầu chỉ mang size (số người) và price (ngân sách tối đa). Mỗi trong 4 method dưới đây được chấm độc lập theo đúng ví dụ minh hoạ trong đề thi thật.</p>`;

const q1 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: B(
    scenarioEn + `<p><strong>Câu 1: f1() – 2.5 marks: Load data</strong></p><ul><li>File: MyStore.java</li><li>Method to Complete: <code>addLast(String code, int status, int size, int price)</code> in class <code>dataList</code> (implement it similar to a standard linked-list addLast).</li></ul>`,
    scenarioVi + `<p><strong>Câu 1: f1() – 2.5 điểm: Nạp dữ liệu</strong></p><ul><li>File: MyStore.java</li><li>Method cần hoàn thiện: <code>addLast(String code, int status, int size, int price)</code> trong lớp <code>dataList</code> (cài đặt tương tự addLast danh sách liên kết chuẩn).</li></ul>`,
  ),
  starterCode: myStoreGiven,
  sampleSolution: myStoreSolved,
  expectedOutput: `Data List: (001,0,10,200) (003,0,3,70) (004,0,4,100) (005,0,3,70)
Request  : (1,100) (12,500) (4,50) (4,400)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 1 (f1) — output matches the paper's expected example exactly. Room 002 (size=0) and one request (size=0) are both correctly excluded — even though not spelled out again inside addLast()'s own one-line spec, the Room class description at the top of the paper states size and price "must be &gt; 0", and the worked example only makes sense if addLast() (and enQueue(), by the same reasoning) rejects any entry violating that. Append a new node after <code>tail</code> (or set <code>head=tail=node</code> if empty) once validated.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 1 (f1) — output khớp chính xác ví dụ trong đề. Room 002 (size=0) và 1 request (size=0) đều bị loại đúng — dù không lặp lại tường minh trong đặc tả riêng của addLast(), phần mô tả lớp Room ở đầu đề ghi rõ size và price "phải &gt; 0", và ví dụ minh hoạ chỉ khớp nếu addLast() (và enQueue(), theo cùng lý lẽ) từ chối mọi mục vi phạm điều đó. Nối node mới sau <code>tail</code> (hoặc gán <code>head=tail=node</code> nếu rỗng) sau khi đã kiểm hợp lệ.</p>`,
  ),
  rubric: [
    { id: 'validate', criterion: B('Correctly rejects a Room when size <= 0 or price <= 0.', 'Từ chối đúng khi size <= 0 hoặc price <= 0.'), weight: 1, maxScore: 0.9 },
    { id: 'append', criterion: B('Correctly appends the new node at the end of the list, handling both empty and non-empty list cases.', 'Nối đúng node mới vào cuối danh sách, xử lý đúng cả trường hợp danh sách rỗng và không rỗng.'), weight: 1, maxScore: 1.6 },
  ],
};

const q2 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: B(
    `<p><strong>Câu 2: f2() – 2.5 marks: Serve the first request in the requestQueue</strong></p><ul><li>File: MyStore.java</li><li>Methods to complete: <code>enQueue(int size, int price)</code>, <code>deQueue()</code>, <code>rent(Room t)</code>, and the body of <code>f2()</code>.</li><li><code>rent(Room t)</code>: search for the best Room — empty (status=0), size &gt;= t's size, price &lt;= t's price; among candidates choose the lowest price, and on a further tie choose the one appearing first in dataList. If found, set its status to 1 (rented).</li><li><code>f2()</code>: dequeue exactly ONE request from requestQueue and call rent() with it.</li></ul>`,
    `<p><strong>Câu 2: f2() – 2.5 điểm: Phục vụ yêu cầu đầu tiên trong requestQueue</strong></p><ul><li>File: MyStore.java</li><li>Method cần hoàn thiện: <code>enQueue(int size, int price)</code>, <code>deQueue()</code>, <code>rent(Room t)</code>, và phần thân <code>f2()</code>.</li><li><code>rent(Room t)</code>: tìm Room tốt nhất — trống (status=0), size &gt;= size của t, price &lt;= price của t; trong các ứng viên chọn price thấp nhất, nếu vẫn bằng nhau chọn Room xuất hiện trước trong dataList. Nếu tìm thấy, đặt status=1 (đã thuê).</li><li><code>f2()</code>: lấy ra đúng 1 yêu cầu từ requestQueue và gọi rent() với yêu cầu đó.</li></ul>`,
  ),
  starterCode: myStoreGiven,
  sampleSolution: myStoreSolved,
  expectedOutput: `Data List: (001,0,10,200) (003,0,3,70) (004,0,4,100) (005,0,3,70)
Request  : (1,100) (12,500) (4,50) (4,400)
Data List: (001,0,10,200) (003,1,3,70) (004,0,4,100) (005,0,3,70)
Request  : (12,500) (4,50) (4,400)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 (f2) — output matches the paper's expected example exactly. Request (1,100) is served: rooms 003 and 005 both qualify (empty, size&gt;=1, price&lt;=100, both priced 70), and 003 wins the tie by appearing first in dataList; its status becomes 1. <code>enQueue</code>/<code>deQueue</code> implement standard linked-queue behavior (append at <code>rear</code>, remove from <code>front</code>), and <code>enQueue</code> applies the same size&gt;0/price&gt;0 validation as addLast.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 2 (f2) — output khớp chính xác ví dụ trong đề. Yêu cầu (1,100) được phục vụ: cả room 003 và 005 đều đủ điều kiện (trống, size&gt;=1, price&lt;=100, cùng giá 70), và 003 thắng vì xuất hiện trước trong dataList; status của nó thành 1. <code>enQueue</code>/<code>deQueue</code> cài đặt hàng đợi liên kết chuẩn (thêm ở <code>rear</code>, lấy ra ở <code>front</code>), và <code>enQueue</code> áp cùng luật kiểm size&gt;0/price&gt;0 như addLast.</p>`,
  ),
  rubric: [
    { id: 'queue_ops', criterion: B('Correctly implements enQueue (with validation) and deQueue as a standard linked queue.', 'Cài đặt đúng enQueue (có kiểm hợp lệ) và deQueue theo hàng đợi liên kết chuẩn.'), weight: 1, maxScore: 0.8 },
    { id: 'rent_logic', criterion: B('Correctly implements rent(): finds the cheapest qualifying room, breaking ties by list order, and marks it rented.', 'Cài đặt đúng rent(): tìm room đủ điều kiện rẻ nhất, hoà thì chọn theo thứ tự danh sách, đánh dấu đã thuê.'), weight: 1, maxScore: 1.2 },
    { id: 'f2_serves_one', criterion: B('f2() serves exactly the first (single) request in the queue.', 'f2() phục vụ đúng 1 yêu cầu đầu tiên trong hàng đợi.'), weight: 1, maxScore: 0.5 },
  ],
};

const q3 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: B(
    `<p><strong>Câu 3: f3() – 2.5 marks: Serve all requests in the requestQueue</strong></p><ul><li>File: MyStore.java</li><li>Method to complete: the body of <code>f3()</code>, right after the given traversal call.</li><li>Task: perform the pair of operations deQueue() and rent() for ALL elements in the requestQueue (reusing the same rent() from câu 2), until the queue is empty.</li></ul>`,
    `<p><strong>Câu 3: f3() – 2.5 điểm: Phục vụ tất cả yêu cầu trong requestQueue</strong></p><ul><li>File: MyStore.java</li><li>Method cần hoàn thiện: phần thân <code>f3()</code>, ngay sau lệnh duyệt đã có sẵn.</li><li>Nhiệm vụ: thực hiện cặp thao tác deQueue() và rent() cho TẤT CẢ phần tử trong requestQueue (dùng lại đúng rent() ở câu 2), cho tới khi hàng đợi rỗng.</li></ul>`,
  ),
  starterCode: myStoreGiven,
  sampleSolution: myStoreSolved,
  expectedOutput: `Data List: (001,0,10,200) (003,0,3,70) (004,0,4,100) (005,0,3,70)
Request  : (1,100) (12,500) (4,50) (4,400)
Data List: (001,0,10,200) (003,1,3,70) (004,1,4,100) (005,0,3,70)
Request  : Empty`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 3 (f3) — output matches the paper's expected example exactly. (1,100)→room 003; (12,500)→no room has size&gt;=12, unserved; (4,50)→no room priced &lt;=50 among the remaining, unserved; (4,400)→rooms 001(price=200) and 004(price=100) both qualify, 004 wins (lower price). Final state: 003 and 004 rented, queue empty.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 3 (f3) — output khớp chính xác ví dụ trong đề. (1,100)→room 003; (12,500)→không room nào size&gt;=12, không phục vụ được; (4,50)→không room nào giá &lt;=50 trong số còn lại, không phục vụ được; (4,400)→room 001(giá=200) và 004(giá=100) đều đủ điều kiện, 004 thắng (giá thấp hơn). Trạng thái cuối: 003 và 004 đã thuê, hàng đợi rỗng.</p>`,
  ),
  rubric: [
    { id: 'serve_all', criterion: B('Correctly dequeues and calls rent() for every request until the queue is empty, without skipping or double-processing any.', 'Lấy ra và gọi rent() đúng cho mọi yêu cầu tới khi hàng đợi rỗng, không bỏ sót hay xử lý trùng.'), weight: 1, maxScore: 2.5 },
  ],
};

const q4 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: B(
    `<p><strong>Câu 4: f4() – 2.5 marks: Count the available Rooms after serving all requests</strong></p><ul><li>File: MyStore.java</li><li>Method to complete: the body of <code>f4()</code>, right after the given traversal call (a local variable <code>count</code> is already declared).</li><li>Task: (1) perform the pair of operations deQueue() and rent() for all elements in requestQueue (same as câu 3), then (2) count the available Rooms whose status = 0, storing the result in <code>count</code>.</li></ul>`,
    `<p><strong>Câu 4: f4() – 2.5 điểm: Đếm số Room còn trống sau khi phục vụ hết yêu cầu</strong></p><ul><li>File: MyStore.java</li><li>Method cần hoàn thiện: phần thân <code>f4()</code>, ngay sau lệnh duyệt đã có sẵn (biến cục bộ <code>count</code> đã khai báo sẵn).</li><li>Nhiệm vụ: (1) thực hiện cặp thao tác deQueue() và rent() cho mọi phần tử trong requestQueue (giống câu 3), rồi (2) đếm số Room còn trống có status = 0, lưu kết quả vào <code>count</code>.</li></ul>`,
  ),
  starterCode: myStoreGiven,
  sampleSolution: myStoreSolved,
  expectedOutput: `Data List: (001,0,10,200) (003,0,3,70) (004,0,4,100) (005,0,3,70)
Request  : (1,100) (12,500) (4,50) (4,400)
Data List: (001,0,10,200) (003,1,3,70) (004,1,4,100) (005,0,3,70)
Request  : Empty
Available Room(s): 2`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 4 (f4) — output matches the paper's expected example exactly. As in câu 3, rooms 003 and 004 end up rented, leaving 001 and 005 available — count = 2.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật và chạy lựa chọn 4 (f4) — output khớp chính xác ví dụ trong đề. Như câu 3, room 003 và 004 cuối cùng đã thuê, còn lại 001 và 005 trống — count = 2.</p>`,
  ),
  rubric: [
    { id: 'serve_all_again', criterion: B('Correctly serves all requests first (same logic as câu 3).', 'Phục vụ đúng hết mọi yêu cầu trước (cùng logic câu 3).'), weight: 1, maxScore: 1.2 },
    { id: 'count_available', criterion: B('Correctly counts the rooms with status = 0 after serving, storing the result in count.', 'Đếm đúng số room có status = 0 sau khi phục vụ, lưu vào count.'), weight: 1, maxScore: 1.3 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE25',
    title: 'PE Đề 25 — Practical Exam (Hotel Management)|||PE Đề 25 — Thi thực hành (Quản lý khách sạn)',
    description: 'CSD201 PE (CODE): complete a hotel-room linked list + request queue system in one given NetBeans project, AI-graded.|||PE CSD201 (viết mã): hoàn thiện hệ thống danh sách phòng + hàng đợi yêu cầu khách sạn trong 1 project NetBeans given, chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE25-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
