/**
 * build-csd201-pe21.mjs — sinh content/exams/CSD201-PE21.mjs.
 *
 * Nguồn thật: csd201_03_785320.rar (Đề "03") — MỘT project (Q1),
 * "Hotel Management": dataList (danh sách liên kết đơn phòng) +
 * requestQueue (hàng đợi yêu cầu thuê). 4 câu 2.5đ mỗi câu.
 *
 * LỜI GIẢI ĐÃ VERIFY THẬT: javac + java Main, cả 4 lựa chọn với
 * data.txt đi kèm — khớp BYTE-FOR-BYTE 100% với ví dụ trong đề (đề
 * này có phần GIẢI THÍCH chi tiết đi kèm mỗi ví dụ, đối chiếu khớp
 * từng bước).
 *
 * Phát hiện: data.txt có 6 phòng (thêm phòng 002, size=0) và 5 yêu
 * cầu thuê (thêm 1 yêu cầu size=0) nhưng đề chỉ hiển thị 5 phòng và 4
 * yêu cầu — vì đề ghi rõ ràng buộc "size (must be > 0)... price (must
 * be > 0)" cho cả Room lẫn request → addLast()/enQueue() phải LỌC bỏ
 * bản ghi vi phạm. Verify: lọc đúng phòng 002 và yêu cầu size=0 khớp
 * chính xác danh sách còn lại trong đề.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/CSD201-PE21.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/CSD201-PE21.mjs');
const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/CSD201/PE21-Given.zip';

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const instructions = ML(
  `<p><strong>CSD201 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "03").</p>
   <ol>
     <li>Software: NetBeans IDE 8.x, Java JDK 1.8. Download the given materials above.</li>
     <li>Do not use accented Vietnamese when writing comments in programs.</li>
     <li>Do not add new import statement(s) to given files.</li>
     <li>This exam room cannot run NetBeans/JDK in the browser, so type your code directly into the code box — it is graded by AI against the rubric. You can build &amp; run the real given project on your own machine and cross-check against the sample runs shown below.</li>
   </ol>`,
  `<p><strong>HƯỚNG DẪN PE CSD201</strong> (dịch nguyên văn từ đề thi thật, "03").</p>
   <ol>
     <li>Phần mềm: NetBeans IDE 8.x, Java JDK 1.8. Tải given materials ở trên.</li>
     <li>Không dùng tiếng Việt có dấu khi viết chú thích trong chương trình.</li>
     <li>Không thêm import mới vào các file đã cho.</li>
     <li>Phòng thi web không chạy được NetBeans/JDK trực tiếp nên gõ thẳng mã vào ô, được AI chấm theo tiêu chí — bạn có thể build &amp; chạy project given thật trên máy mình rồi đối chiếu với mẫu chạy bên dưới.</li>
   </ol>`,
);

const SCENARIO = B(
  `<p><strong>Scenario: Hotel Management.</strong></p>
   <p><strong>Class Structure:</strong> <code>Room</code> (code, status — 0 empty / 1 occupied, size — must be &gt; 0, price — must be &gt; 0) · <code>Node</code> — an info object (Room) plus a next pointer · <code>dataList</code> — a singly linked list managing all Room objects in the hotel · <code>requestQueue</code> — a queue (implemented as a linked list) whose nodes' info contains only size (number of people renting) and price (max amount the customer can pay); size &gt; 0 and price &gt; 0 · <code>Hotel</code> — the main class, holding a dataList (rooms) and a requestQueue (pending orders).</p>`,
  `<p><strong>Bối cảnh: Quản lý Khách sạn.</strong></p>
   <p><strong>Cấu trúc lớp:</strong> <code>Room</code> (code, status — 0 trống / 1 đang có khách, size — phải &gt; 0, price — phải &gt; 0) · <code>Node</code> — đối tượng info (Room) và con trỏ next · <code>dataList</code> — danh sách liên kết đơn quản lý toàn bộ phòng · <code>requestQueue</code> — hàng đợi (cài bằng danh sách liên kết) mà info của node chỉ chứa size (số người thuê) và price (số tiền tối đa khách trả được); size &gt; 0 và price &gt; 0 · <code>Hotel</code> — lớp chính, chứa 1 dataList (các phòng) và 1 requestQueue (các đơn chờ).</p>`,
);

const SOLVED = '/tmp/csd201-pe21-src/src/Hotel.java';
const ORIG = '/tmp/csd201-pe21-orig/a/CSD201_03_785320/PaperNo_1/Q1/src/Hotel.java';
const rd = (p) => fs.readFileSync(p, 'utf8');
const solved = rd(SOLVED);
const starter = rd(ORIG);

const q1 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>a. f1(): 2.5 marks – Load data</strong></p>
     <p>To finish f1(), students need to fulfill two specific tasks: implement the function <code>addLast()</code> in the dataList class and the function <code>enQueue()</code> (similar to addLast) in the requestQueue class.</p>`,
    `<p><strong>a. f1(): 2.5 điểm – Nạp dữ liệu</strong></p>
     <p>Để hoàn thành f1(), cần 2 việc: cài <code>addLast()</code> trong dataList và <code>enQueue()</code> (tương tự addLast) trong requestQueue.</p>`
  ),
  starterCode: starter,
  sampleSolution: solved,
  expectedOutput: `Data List: (001,0,10,200) (003,0,3,70) (004,0,4,100) (005,0,3,70) (VIP,0,10,80)\nRequest  : (1,100) (12,500) (4,50) (4,400)`,
  explanation: B(
    `<p>Verified by compiling against the real given project (Room.java/Node.java/Main.java/Lib.java unchanged) and running choice 1 — output matches the paper's expected example byte-for-byte. The bundled data.txt lists 6 rooms and 5 requests, but room "002" has size=0 and one request has size=0 — both violate the documented invariant ("size must be &gt; 0", "price must be &gt; 0"); <code>addLast()</code> and <code>enQueue()</code> both skip such invalid entries, matching the paper's shorter lists exactly.</p>`,
    `<p>Đã kiểm bằng cách biên dịch cùng project given thật (Room.java/Node.java/Main.java/Lib.java giữ nguyên) và chạy lựa chọn 1 — output khớp byte-for-byte với ví dụ trong đề. data.txt đi kèm liệt kê 6 phòng và 5 yêu cầu, nhưng phòng "002" có size=0 và 1 yêu cầu có size=0 — cả hai vi phạm ràng buộc đã ghi ("size phải &gt; 0", "price phải &gt; 0"); cả <code>addLast()</code> và <code>enQueue()</code> đều bỏ qua các bản ghi vi phạm này, khớp đúng danh sách ngắn hơn của đề.</p>`
  ),
  rubric: [
    { id: 'addlast', criterion: B('addLast() correctly appends valid rooms (size>0, price>0) to the dataList tail, rejecting invalid ones.', 'addLast() thêm đúng phòng hợp lệ (size>0, price>0) vào cuối dataList, loại bỏ bản ghi không hợp lệ.'), weight: 1, maxScore: 1.5 },
    { id: 'enqueue', criterion: B('enQueue() correctly appends valid requests (size>0, price>0) to the requestQueue rear.', 'enQueue() thêm đúng yêu cầu hợp lệ (size>0, price>0) vào cuối requestQueue.'), weight: 1, maxScore: 1 },
  ],
};

const q2 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>b. f2(): 2.5 marks – Serve the first request in the requestQueue</strong></p>
     <p>To complete f2(), students need to perform three specific tasks: (1) implement the <code>deQueue()</code> function of requestQueue, (2) use the result returned by deQueue() to perform the <code>rent()</code> function, then (3) use these two functions to serve the first request.</p>
     <p><strong>rent() logic — search for the best Room:</strong> An empty Room (status=0), size &gt;= the request's size, price &lt;= the request's price. If more than one Room satisfies these, choose the one with the LOWEST price. If still tied, choose the LAST such Room in the dataList. If found, update its status from 0 to 1.</p>`,
    `<p><strong>b. f2(): 2.5 điểm – Phục vụ yêu cầu đầu tiên trong requestQueue</strong></p>
     <p>Để hoàn thành f2(), cần 3 việc: (1) cài <code>deQueue()</code> của requestQueue, (2) dùng kết quả trả về của deQueue() để gọi <code>rent()</code>, rồi (3) dùng cả 2 hàm này để phục vụ yêu cầu đầu tiên.</p>
     <p><strong>Logic rent() — tìm phòng tốt nhất:</strong> Phòng trống (status=0), size &gt;= size của yêu cầu, price &lt;= price của yêu cầu. Nếu nhiều phòng thoả, chọn phòng có price THẤP NHẤT. Nếu vẫn hoà, chọn phòng CUỐI CÙNG (theo thứ tự dataList) thoả điều kiện đó. Nếu tìm được, cập nhật status từ 0 sang 1.</p>`
  ),
  starterCode: starter,
  sampleSolution: solved,
  expectedOutput: `Data List: (001,0,10,200) (003,0,3,70) (004,0,4,100) (005,0,3,70) (VIP,0,10,80)\nRequest  : (1,100) (12,500) (4,50) (4,400)\nData List: (001,0,10,200) (003,0,3,70) (004,0,4,100) (005,1,3,70) (VIP,0,10,80)\nRequest  : (12,500) (4,50) (4,400)`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 2 — output matches the paper's expected example byte-for-byte. Request (1,100): both room 003 and 005 qualify (size&gt;=1, price&lt;=100) at the tied-lowest price 70; since 005 appears later in the dataList, it is chosen (implemented by scanning front-to-back and updating "best" on <code>&lt;=</code>, so a later tie overwrites an earlier one) and its status set to 1.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 2 — khớp byte-for-byte với ví dụ trong đề. Yêu cầu (1,100): cả phòng 003 và 005 đều thoả (size&gt;=1, price&lt;=100) cùng giá thấp nhất 70; vì 005 đứng sau trong dataList nên được chọn (cài bằng cách quét từ đầu tới cuối, cập nhật "best" khi <code>&lt;=</code>, nên phòng hoà giá đứng sau ghi đè phòng đứng trước), status của nó đặt thành 1.</p>`
  ),
  rubric: [
    { id: 'dequeue', criterion: B('deQueue() correctly removes and returns the front request.', 'deQueue() gỡ và trả đúng yêu cầu ở đầu hàng đợi.'), weight: 1, maxScore: 0.75 },
    { id: 'rent_search', criterion: B('rent() correctly finds the best room (empty, size>=req, price<=req, lowest price, last on tie).', 'rent() tìm đúng phòng tốt nhất (trống, size đủ, price đủ, giá thấp nhất, hoà thì chọn phòng cuối).'), weight: 1, maxScore: 1.25 },
    { id: 'rent_update', criterion: B('rent() correctly updates the chosen room\'s status to 1.', 'rent() cập nhật đúng status phòng được chọn thành 1.'), weight: 1, maxScore: 0.5 },
  ],
};

const q3 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>c. f3(): 2.5 marks – Serve all requests in the requestQueue</strong></p>
     <p>Apply the pair of operations <code>deQueue()</code> and <code>rent()</code> to all elements in the requestQueue.</p>`,
    `<p><strong>c. f3(): 2.5 điểm – Phục vụ TOÀN BỘ yêu cầu trong requestQueue</strong></p>
     <p>Áp dụng cặp thao tác <code>deQueue()</code> và <code>rent()</code> cho mọi phần tử trong requestQueue.</p>`
  ),
  starterCode: starter,
  sampleSolution: solved,
  expectedOutput: `Data List: (001,0,10,200) (003,0,3,70) (004,0,4,100) (005,0,3,70) (VIP,0,10,80)\nRequest  : (1,100) (12,500) (4,50) (4,400)\nData List: (001,0,10,200) (003,0,3,70) (004,0,4,100) (005,1,3,70) (VIP,1,10,80)\nRequest  : Empty`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 3 — output matches the paper's expected example byte-for-byte. Request (1,100) rents 005. Request (12,500) finds no room (max available size is 10). Request (4,50) finds no room (cheapest remaining is 70&gt;50). Request (4,400) qualifies rooms 001(200), 004(100), VIP(80) — VIP has the lowest price and is rented.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 3 — khớp byte-for-byte với ví dụ trong đề. Yêu cầu (1,100) thuê 005. Yêu cầu (12,500) không tìm được phòng (size lớn nhất còn trống là 10). Yêu cầu (4,50) không tìm được phòng (rẻ nhất còn lại là 70&gt;50). Yêu cầu (4,400) đủ điều kiện với 001(200), 004(100), VIP(80) — VIP giá thấp nhất nên được thuê.</p>`
  ),
  rubric: [
    { id: 'serve_all', criterion: B('Correctly serves every request in the queue in order via deQueue()+rent(), leaving the queue empty.', 'Phục vụ đúng mọi yêu cầu trong hàng đợi theo thứ tự qua deQueue()+rent(), để hàng đợi rỗng.'), weight: 1, maxScore: 2.5 },
  ],
};

const q4 = {
  kind: 'CODE', points: 2.5, language: 'java',
  prompt: SCENARIO + B(
    `<p><strong>d. f4(): 2.5 marks – Compute total revenue after serving all requests</strong></p>
     <p>Apply the pair of operations deQueue() and rent() to all elements in the requestQueue (as f3), then compute the total revenue (sum of prices of all rented rooms).</p>`,
    `<p><strong>d. f4(): 2.5 điểm – Tính tổng doanh thu sau khi phục vụ hết yêu cầu</strong></p>
     <p>Áp dụng deQueue()+rent() cho mọi phần tử trong requestQueue (như f3), rồi tính tổng doanh thu (tổng price của mọi phòng đã thuê).</p>`
  ),
  starterCode: starter,
  sampleSolution: solved,
  expectedOutput: `Data List: (001,0,10,200) (003,0,3,70) (004,0,4,100) (005,0,3,70) (VIP,0,10,80)\nRequest  : (1,100) (12,500) (4,50) (4,400)\nData List: (001,0,10,200) (003,0,3,70) (004,0,4,100) (005,1,3,70) (VIP,1,10,80)\nRequest  : Empty\nTotal Revenue: 150`,
  explanation: B(
    `<p>Verified by compiling against the real given project and running choice 4 — output matches the paper's expected example byte-for-byte. Same serve-all logic as f3, then sums <code>getPrice()</code> over every room with <code>status==1</code>: 70 (005) + 80 (VIP) = 150.</p>`,
    `<p>Đã kiểm bằng biên dịch project given thật và chạy lựa chọn 4 — khớp byte-for-byte với ví dụ trong đề. Cùng logic phục vụ hết như f3, rồi cộng <code>getPrice()</code> của mọi phòng có <code>status==1</code>: 70 (005) + 80 (VIP) = 150.</p>`
  ),
  rubric: [
    { id: 'serve_all_again', criterion: B('Correctly repeats the serve-all-requests logic.', 'Lặp đúng logic phục vụ hết yêu cầu.'), weight: 1, maxScore: 1.5 },
    { id: 'total_revenue', criterion: B('Correctly sums the price of every room now occupied (status=1).', 'Cộng đúng price của mọi phòng đang có khách (status=1).'), weight: 1, maxScore: 1 },
  ],
};

const spec = {
  course: { courseCode: 'CSD201' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE21-03',
    title: 'PE Đề 21 — Practical Exam (03)|||PE Đề 21 — Thi thực hành (03)',
    description: 'CSD201 PE (CODE): singly linked list (hotel rooms) + queue (rental requests), AI-graded.|||PE CSD201 (viết mã): danh sách liên kết đơn (phòng khách sạn) + hàng đợi (yêu cầu thuê), chấm AI.',
    durationMinutes: 60,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: ATTACHMENT_URL,
    attachmentName: 'CSD201-PE21-Given.zip',
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
