/**
 * build-pro192-pe5.mjs — sinh content/exams/PRO192-PE5.mjs.
 *
 * Đề 5 khác hẳn Đề 4/11-14: đây KHÔNG phải harness Main.class tương tác
 * qua stdin/stdout — nguồn thật (rar given materials) chỉ chứa MỘT thư mục
 * PaperNo_1/1/ với 1 file khung Q1.java (chưa cài đặt, các đoạn @STUDENT
 * còn trống) + 5 file input1..5.txt mẫu. Không có Main.class biên dịch sẵn,
 * không có project NetBeans (nbproject/build.xml) đi kèm. Đây là kiểu PE
 * "file I/O": chương trình đọc input.txt (dòng đầu là N, N dòng lệnh tiếp
 * theo) rồi ghi kết quả ra output.txt — học sinh tự viết toàn bộ main(),
 * không có driver ngoài để gọi vào lớp của mình.
 *
 * Toàn bộ 20 ảnh nguồn của thư mục Đề 5 chỉ là các lần chụp cuộn khác nhau
 * của CÙNG một tài liệu 4 trang duy nhất (footer luôn "Paper No: 1") mô tả
 * MỘT hệ thống quản lý task tích hợp (Task abstract, PersonalTask, WorkTask)
 * — không có trang nào cho "Question 2/3/4". Given materials rar cũng chỉ
 * có đúng 1 thư mục con "1". Kết luận: đề này CHỈ có 1 câu, trọn 10 điểm —
 * không phải 4 câu như các đề PE khác trong bộ.
 *
 * Nguồn đã verify: scratchpad pro192-pe/de5/work — Task.java, PersonalTask.java,
 * WorkTask.java, Q1.java (điền đầy đủ khung given) biên dịch bằng `javac`,
 * chạy `java Q1` với cả 5 input mẫu (input1..5.txt), output.txt khớp
 * BYTE-FOR-BYTE với OUTPUT transcribe từ ảnh đề cho cả 5 test case.
 *
 * Given materials sạch (attachment) = chính rar gốc đã sạch sẵn (chỉ có khung
 * Q1.java rỗng phần @STUDENT + 5 input mẫu, không có lời giải nào lẫn vào) —
 * đóng gói lại thành Q1/{Q1.java, input1..5.txt}, đã sanity-check: chép lời
 * giải đã verify đè lên khung rỗng, biên dịch + chạy lại TC3, output khớp.
 * Upload R2 PRO192/PE5-Given.zip, verify GET 200.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRO192-PE5.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/2c89fc57-9aa7-4c2e-8cc0-a484bfb4eb0f/scratchpad/pro192-pe/de5';
const OUT = path.resolve(import.meta.dirname, '../content/exams/PRO192-PE5.mjs');

const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8').trimEnd();

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/PRO192/PE5-Given.zip';

const instructions = ML(
  `<p><strong>PRO192 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "PE PRO192 - SU 2025").</p>
   <ol>
     <li>Students are ONLY allowed to use: NetBeans IDE 8.x and Java JDK 1.8; their own study materials (slides, notes, sample codes, program examples, e-books) stored on their own computer only; for distance learning, Google Meet/Hangout is used for exam monitoring only.</li>
     <li>Step 1: run "Clean and Build Project" (Shift+F11) to create the <strong>dist</strong> folder and <strong>.jar</strong> file.</li>
     <li>Step 2: prepare the submission — for the question (question 1) create two sub-folders <strong>run</strong> and <strong>src</strong>; copy the built <code>.jar</code> into <strong>run</strong>; compress the source code into a <strong>.zip</strong> and copy that zip into <strong>src</strong>.</li>
     <li>Step 3: in the PEA software choose question number 1 and attach the corresponding solution folder (1), then click Submit.</li>
     <li>Do NOT use accented Vietnamese when writing code comments. Solutions are marked by Automated Marking Software. If any of the above requirements is not followed, the exam gets ZERO.</li>
   </ol>
   <p><strong>Note on this paper's format:</strong> unlike other PRO192 PE papers, this one is a single 10-mark question graded by comparing the <code>output.txt</code> your program writes against an expected file — not an interactive <code>Main.class</code> you call into. The given materials download above is the REAL given skeleton (<code>Q1.java</code> with the exact fixed parts you must not edit, plus 5 sample <code>input.txt</code> files) so you can build &amp; run it for real on your own machine and diff your <code>output.txt</code> against the samples shown below. This exam room cannot run NetBeans/JDK in the browser, so you type your classes directly into the code box and it is graded by AI against the rubric.</p>`,
  `<p><strong>HƯỚNG DẪN PE PRO192</strong> (dịch nguyên văn từ đề thi thật "PE PRO192 - SU 2025").</p>
   <ol>
     <li>Sinh viên CHỈ được dùng: NetBeans IDE 8.x và Java JDK 1.8; tài liệu học tập của riêng mình (slide, ghi chú, mã mẫu, ví dụ chương trình, sách điện tử) lưu trên máy tính của mình; nếu học từ xa thì Google Meet/Hangout chỉ dùng để giám sát thi.</li>
     <li>Bước 1: chạy "Clean and Build Project" (Shift+F11) để tạo thư mục <strong>dist</strong> và file <strong>.jar</strong>.</li>
     <li>Bước 2: chuẩn bị nộp bài — với câu hỏi (question 1) tạo 2 thư mục con <strong>run</strong> và <strong>src</strong>; chép file <code>.jar</code> đã build vào <strong>run</strong>; nén mã nguồn thành <strong>.zip</strong> rồi chép zip đó vào <strong>src</strong>.</li>
     <li>Bước 3: trong phần mềm PEA chọn số câu 1 rồi đính kèm thư mục lời giải tương ứng (1), bấm Submit.</li>
     <li>KHÔNG gõ tiếng Việt có dấu trong comment code. Bài được chấm bởi phần mềm chấm tự động. Nếu vi phạm bất kỳ yêu cầu nào ở trên, bài thi sẽ bị ZERO.</li>
   </ol>
   <p><strong>Lưu ý định dạng đề này:</strong> khác các đề PE PRO192 khác, đề này chỉ có 1 câu duy nhất trọn 10 điểm, được chấm bằng cách so sánh file <code>output.txt</code> chương trình bạn ghi ra với file kết quả mong đợi — không phải gọi vào một <code>Main.class</code> tương tác có sẵn. File "given materials" tải ở trên là khung given THẬT (<code>Q1.java</code> với đúng các phần cố định không được sửa, kèm 5 file <code>input.txt</code> mẫu) để bạn build &amp; chạy thật trên máy mình, đối chiếu <code>output.txt</code> với các mẫu bên dưới. Phòng thi web không chạy được NetBeans/JDK trực tiếp nên bạn gõ thẳng class vào ô mã, được AI chấm theo tiêu chí.</p>`,
);

function table(rows) {
  return `<table class="uml-table"><tbody>${rows.map((r) => `<tr><td>${r}</td></tr>`).join('')}</tbody></table>`;
}

// ── Q1 (only question, 10 marks): Task (abstract) / PersonalTask / WorkTask + Q1 file I/O driver ──
const q1PromptEn = `<p><strong>(10 marks)</strong> You will implement a system that manages tasks (<strong>WorkTask</strong>, <strong>PersonalTask</strong>) using an abstract base class <strong>Task</strong>.</p>
<p><strong>1. Class: Task (Abstract)</strong></p>
${table([
  '-id: int<br/>-name: String<br/>-done: boolean',
  '+Task(int, String)<br/>+markDone(): void<br/>+isDone(): boolean<br/>+getId(): int<br/>+getName(): String<br/>+getInfo(): String {abstract}<br/>+getType(): String {abstract}',
])}
<ul>
  <li><code>markDone()</code> — marks the task as completed.</li>
  <li><code>isDone()</code> — returns the status of the task.</li>
  <li><code>getId()</code> — returns the task ID.</li>
  <li><code>getName()</code> — returns the task name.</li>
  <li><code>getInfo()</code> — <strong>abstract</strong>, return the information of the Task formatted as required when implementing this function in the subclasses.</li>
  <li><code>getType()</code> — <strong>abstract</strong>, returns type of the Task ("Work" or "Personal") when implementing this function in the subclasses.</li>
</ul>
<p><strong>2. Class: PersonalTask</strong> (extends Task)</p>
<ul>
  <li><code>getInfo()</code> → Example: <code>"Personal: [&lt;id&gt;] &lt;name&gt; (location) - &lt;status&gt;"</code></li>
  <li><code>getType()</code> → Returns <code>"Personal"</code></li>
</ul>
<p><strong>3. Class: WorkTask</strong> (extends Task)</p>
<ul>
  <li><code>getInfo()</code> → Example: <code>"Work: [&lt;id&gt;] &lt;name&gt; (project) - &lt;status&gt;"</code></li>
  <li><code>getType()</code> → Returns <code>"Work"</code></li>
</ul>
<p><strong>4. Class: Q1</strong> (the driver — reads commands from <code>input.txt</code>, writes results to <code>output.txt</code>, exactly per the fixed skeleton below):</p>
<ul>
  <li>First line of <code>input.txt</code>: an integer N — the number of commands to execute.</li>
  <li>Next N lines: each line is a command related to tasks, as in the table below.</li>
</ul>
${table([
  '<strong>Work &lt;id&gt; &lt;name&gt; &lt;project&gt;</strong> — adds a new WorkTask (status defaults to Not Done, id is unique across all tasks). Output: "Add new work: &lt;id&gt; &lt;name&gt;"',
  '<strong>Personal &lt;id&gt; &lt;name&gt; &lt;location&gt;</strong> — adds a new PersonalTask (status defaults to Not Done, id is unique across all tasks). Output: "Add new personal: &lt;id&gt; &lt;name&gt;"',
  '<strong>Done &lt;id&gt;</strong> — sets the status of the task (WorkTask or PersonalTask) with that ID to Done. Output: "&lt;id&gt; is done!"',
  '<strong>PrintAll</strong> — prints all tasks in the list using getInfo(), one per line, prefixed by a "--PrintAll--" header line.',
  '<strong>PrintByType &lt;type&gt;</strong> — prints only tasks of the specified type (<type> is "Work" or "Personal") using getInfo(), one per line, prefixed by a "--PrintByType: &lt;type&gt;--" header line.',
])}
<p>Constraints: <code>&lt;id&gt;</code> is an integer greater than 0. <code>&lt;name&gt;</code>, <code>&lt;project&gt;</code>, <code>&lt;location&gt;</code> are each a single word. All results must be printed into the <strong>output.txt</strong> file (one line per printed result, in the order the commands were executed).</p>
<p>The starter code below already includes the FIXED parts of <code>Q1</code> (do not change them: <code>setFile</code>, the try/catch skeleton in <code>read()</code>, the try/catch skeleton in <code>printResult()</code>, and <code>main()</code>) — you only fill in the <code>@STUDENT</code> sections plus write the <code>Task</code>/<code>PersonalTask</code>/<code>WorkTask</code> classes.</p>`;
const q1PromptVi = `<p><strong>(10 điểm)</strong> Bạn sẽ cài đặt một hệ thống quản lý task (<strong>WorkTask</strong>, <strong>PersonalTask</strong>) dùng lớp cơ sở trừu tượng <strong>Task</strong>.</p>
<p><strong>1. Lớp: Task (Abstract)</strong></p>
${table([
  '-id: int<br/>-name: String<br/>-done: boolean',
  '+Task(int, String)<br/>+markDone(): void<br/>+isDone(): boolean<br/>+getId(): int<br/>+getName(): String<br/>+getInfo(): String {abstract}<br/>+getType(): String {abstract}',
])}
<ul>
  <li><code>markDone()</code> — đánh dấu task đã hoàn thành.</li>
  <li><code>isDone()</code> — trả về trạng thái task.</li>
  <li><code>getId()</code> — trả về ID task.</li>
  <li><code>getName()</code> — trả về tên task.</li>
  <li><code>getInfo()</code> — <strong>abstract</strong>, trả về thông tin Task định dạng theo yêu cầu khi cài đặt ở lớp con.</li>
  <li><code>getType()</code> — <strong>abstract</strong>, trả về loại Task ("Work" hoặc "Personal") khi cài đặt ở lớp con.</li>
</ul>
<p><strong>2. Lớp: PersonalTask</strong> (kế thừa Task)</p>
<ul>
  <li><code>getInfo()</code> → Ví dụ: <code>"Personal: [&lt;id&gt;] &lt;name&gt; (location) - &lt;status&gt;"</code></li>
  <li><code>getType()</code> → Trả về <code>"Personal"</code></li>
</ul>
<p><strong>3. Lớp: WorkTask</strong> (kế thừa Task)</p>
<ul>
  <li><code>getInfo()</code> → Ví dụ: <code>"Work: [&lt;id&gt;] &lt;name&gt; (project) - &lt;status&gt;"</code></li>
  <li><code>getType()</code> → Trả về <code>"Work"</code></li>
</ul>
<p><strong>4. Lớp: Q1</strong> (driver — đọc lệnh từ <code>input.txt</code>, ghi kết quả ra <code>output.txt</code>, đúng theo khung cố định bên dưới):</p>
<ul>
  <li>Dòng đầu <code>input.txt</code>: số nguyên N — số lượng lệnh cần thực thi.</li>
  <li>N dòng tiếp theo: mỗi dòng là 1 lệnh liên quan đến task, theo bảng dưới.</li>
</ul>
${table([
  '<strong>Work &lt;id&gt; &lt;name&gt; &lt;project&gt;</strong> — thêm 1 WorkTask mới (mặc định Not Done, id là duy nhất trên toàn bộ task). Output: "Add new work: &lt;id&gt; &lt;name&gt;"',
  '<strong>Personal &lt;id&gt; &lt;name&gt; &lt;location&gt;</strong> — thêm 1 PersonalTask mới (mặc định Not Done, id là duy nhất trên toàn bộ task). Output: "Add new personal: &lt;id&gt; &lt;name&gt;"',
  '<strong>Done &lt;id&gt;</strong> — đặt trạng thái task (WorkTask hoặc PersonalTask) có ID đó thành Done. Output: "&lt;id&gt; is done!"',
  '<strong>PrintAll</strong> — in tất cả task trong danh sách bằng getInfo(), mỗi task 1 dòng, có dòng tiêu đề "--PrintAll--" ở đầu.',
  '<strong>PrintByType &lt;type&gt;</strong> — chỉ in các task đúng loại chỉ định (<type> là "Work" hoặc "Personal") bằng getInfo(), mỗi task 1 dòng, có dòng tiêu đề "--PrintByType: &lt;type&gt;--" ở đầu.',
])}
<p>Ràng buộc: <code>&lt;id&gt;</code> là số nguyên lớn hơn 0. <code>&lt;name&gt;</code>, <code>&lt;project&gt;</code>, <code>&lt;location&gt;</code> mỗi cái là 1 từ đơn. Toàn bộ kết quả phải được in ra file <strong>output.txt</strong> (mỗi kết quả in 1 dòng, theo đúng thứ tự lệnh được thực thi).</p>
<p>Code khởi tạo bên dưới đã có sẵn phần CỐ ĐỊNH của <code>Q1</code> (không được sửa: <code>setFile</code>, khung try/catch trong <code>read()</code>, khung try/catch trong <code>printResult()</code>, và <code>main()</code>) — bạn chỉ cần điền các phần <code>@STUDENT</code> và viết thêm lớp <code>Task</code>/<code>PersonalTask</code>/<code>WorkTask</code>.</p>`;

const q1ExplainEn = `<p>Two easy-to-miss format traps, both confirmed by running against all 5 official samples: (1) the "Add new ..." confirmation line only ever prints <code>&lt;id&gt; &lt;name&gt;</code> — it does <strong>not</strong> include the project/location even though that value is parsed and stored (e.g. <code>Work 1 ReportX ProjectA</code> → <code>Add new work: 1 ReportX</code>, "ProjectA" never appears on that line). (2) <code>Done &lt;id&gt;</code> must look the task up by ID across <strong>both</strong> WorkTask and PersonalTask — the spec explicitly says IDs are unique across all tasks, so a single list (e.g. <code>ArrayList&lt;Task&gt;</code>) searched by id is enough; there is no need (and no way) to know the type before finding it.</p>
<p><code>getInfo()</code>'s <status> text is exactly <code>"Done"</code> / <code>"Not Done"</code> (capital D, matches <code>isDone()</code>), and <code>PrintByType</code> compares <code>getType()</code> against the literal type string from the command (exact match, e.g. <code>"Work"</code>).</p>
<p>This whole paper is graded via file I/O — the given <code>Q1.java</code> skeleton (see the "given materials" download) already fixes <code>read()</code>/<code>printResult()</code>'s try/catch scaffolding and <code>setFile()</code>/<code>main()</code>; you only add the parsing/algorithm/output-building code in the marked <code>@STUDENT</code> sections, plus write <code>Task</code>, <code>PersonalTask</code>, <code>WorkTask</code> as separate classes. Verified by filling in the real given skeleton, compiling with <code>javac</code>, and running <code>java Q1</code> against all 5 sample <code>input.txt</code> files — output.txt matched every sample byte-for-byte:</p>
<pre>TC1 (Work 1 ReportX ProjectA):
Add new work: 1 ReportX

TC2 (Personal 2 Grocery Home; Done 2):
Add new personal: 2 Grocery
2 is done!

TC3 (Work+Personal+Done+PrintAll):
Add new work: 1 ReportX
Add new personal: 2 Grocery
1 is done!
--PrintAll--
Work: [1] ReportX (ProjectA) - Done
Personal: [2] Grocery (Home) - Not Done

TC4 (2 Work + 1 Personal, Done 2, PrintByType Work):
Add new work: 1 Design
Add new work: 2 Code
Add new personal: 3 Call
2 is done!
--PrintByType: Work--
Work: [1] Design (ProjectX) - Not Done
Work: [2] Code (ProjectX) - Done

TC5 (hard — mixed adds/dones/prints):
Add new personal: 1 Read
Add new work: 2 Submit
Add new personal: 3 Jog
3 is done!
--PrintAll--
Personal: [1] Read (Library) - Not Done
Work: [2] Submit (ProjectB) - Not Done
Personal: [3] Jog (Park) - Done
1 is done!
--PrintByType: Personal--
Personal: [1] Read (Library) - Done
Personal: [3] Jog (Park) - Done</pre>`;
const q1ExplainVi = `<p>Hai bẫy định dạng dễ bỏ sót, cả hai đều đã kiểm bằng cách chạy đủ 5 mẫu chính thức: (1) dòng xác nhận "Add new ..." CHỈ in <code>&lt;id&gt; &lt;name&gt;</code> — KHÔNG in project/location dù giá trị đó vẫn được đọc và lưu (vd <code>Work 1 ReportX ProjectA</code> → <code>Add new work: 1 ReportX</code>, "ProjectA" không xuất hiện ở dòng này). (2) <code>Done &lt;id&gt;</code> phải tìm task theo ID trên CẢ HAI loại WorkTask và PersonalTask — đề nói rõ id là duy nhất trên toàn bộ task, nên chỉ cần 1 danh sách chung (vd <code>ArrayList&lt;Task&gt;</code>) tìm theo id là đủ, không cần (và không thể) biết loại trước khi tìm ra nó.</p>
<p>Chuỗi <status> trong <code>getInfo()</code> đúng là <code>"Done"</code> / <code>"Not Done"</code> (D hoa, khớp <code>isDone()</code>), và <code>PrintByType</code> so sánh <code>getType()</code> với đúng chuỗi type lấy từ lệnh (khớp chính xác, vd <code>"Work"</code>).</p>
<p>Cả đề này được chấm qua file I/O — khung <code>Q1.java</code> given (xem file "given materials" tải ở trên) đã cố định sẵn khung try/catch của <code>read()</code>/<code>printResult()</code> và <code>setFile()</code>/<code>main()</code>; bạn chỉ thêm code phân tích lệnh/thuật toán/dựng chuỗi output vào đúng các đoạn <code>@STUDENT</code>, cộng với viết riêng 3 lớp <code>Task</code>, <code>PersonalTask</code>, <code>WorkTask</code>. Đã kiểm bằng cách điền đầy đủ khung given thật, biên dịch bằng <code>javac</code>, chạy <code>java Q1</code> với cả 5 file <code>input.txt</code> mẫu — output.txt khớp byte-for-byte với cả 5 mẫu:</p>
<pre>TC1 (Work 1 ReportX ProjectA):
Add new work: 1 ReportX

TC2 (Personal 2 Grocery Home; Done 2):
Add new personal: 2 Grocery
2 is done!

TC3 (Work+Personal+Done+PrintAll):
Add new work: 1 ReportX
Add new personal: 2 Grocery
1 is done!
--PrintAll--
Work: [1] ReportX (ProjectA) - Done
Personal: [2] Grocery (Home) - Not Done

TC4 (2 Work + 1 Personal, Done 2, PrintByType Work):
Add new work: 1 Design
Add new work: 2 Code
Add new personal: 3 Call
2 is done!
--PrintByType: Work--
Work: [1] Design (ProjectX) - Not Done
Work: [2] Code (ProjectX) - Done

TC5 (khó — pha trộn add/done/print):
Add new personal: 1 Read
Add new work: 2 Submit
Add new personal: 3 Jog
3 is done!
--PrintAll--
Personal: [1] Read (Library) - Not Done
Work: [2] Submit (ProjectB) - Not Done
Personal: [3] Jog (Park) - Done
1 is done!
--PrintByType: Personal--
Personal: [1] Read (Library) - Done
Personal: [3] Jog (Park) - Done</pre>`;

const q1StarterCode = `public abstract class Task {
    private int id;
    private String name;
    private boolean done;

    public Task(int id, String name) {
        // TODO: set fields, done starts false
    }

    public void markDone() {
        // TODO
    }

    public boolean isDone() {
        // TODO
        return false;
    }

    public int getId() {
        // TODO
        return 0;
    }

    public String getName() {
        // TODO
        return null;
    }

    public abstract String getInfo();

    public abstract String getType();
}

class PersonalTask extends Task {
    private String location;
    // TODO: constructor(id, name, location) -> super(id, name)
    // TODO: getInfo() -> "Personal: [<id>] <name> (<location>) - <status>"
    // TODO: getType() -> "Personal"
}

class WorkTask extends Task {
    private String project;
    // TODO: constructor(id, name, project) -> super(id, name)
    // TODO: getInfo() -> "Work: [<id>] <name> (<project>) - <status>"
    // TODO: getType() -> "Work"
}

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Scanner;

public class Q1 {
    String inputFile = "input.txt";
    String outputFile = "output.txt";

    //--VARIABLES - @STUDENT: DECLARE YOUR VARIABLES HERE:
    // TODO: e.g. int n; String[] lines; String result; ArrayList<Task> tasks;

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
    String fi, fo;

    public void setFile(String[] args) {
        fi = args.length >= 2 ? args[0] : inputFile;
        fo = args.length >= 2 ? args[1] : outputFile;
    }

    public void read() {
        try (Scanner sc = new Scanner(new File(fi))) {
    //--END FIXED PART----------------------------

            //INPUT - @STUDENT: ADD YOUR CODE FOR INPUT HERE:
            // TODO: read n, then n lines into your storage

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
            sc.close();
        } catch (FileNotFoundException ex) {
            System.out.println("Input Exception # " + ex);
        }
    }
    //--END FIXED PART----------------------------

    //ALGORITHM - @STUDENT: ADD YOUR OWN METHODS HERE (IF NEED):
    // TODO: e.g. a helper to find a Task by id

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
    public void solve() {
    //--END FIXED PART----------------------------

        //ALGORITHM - @STUDENT: ADD YOUR CODE HERE:
        // TODO: parse each line's command (Work/Personal/Done/PrintAll/PrintByType)
        // and build the result string

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
    }

    public void printResult() {
        try {
            FileWriter fw = new FileWriter(fo);
    //--END FIXED PART----------------------------

            //OUTPUT - @STUDENT: ADD YOUR CODE FOR OUTPUT HERE:
            fw.write(/* TODO: your result string */ "");

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
            fw.flush();
            fw.close();
        } catch (IOException ex) {
            System.out.println("Output Exception # " + ex);
        }
    }

    public static void main(String[] args) {
        Q1 q = new Q1();
        q.setFile(args);
        q.read();
        q.solve();
        q.printResult();
    }
    //--END FIXED PART----------------------------
}`;

const q1 = {
  kind: 'CODE', points: 10, language: 'java',
  prompt: B(q1PromptEn, q1PromptVi),
  starterCode: q1StarterCode,
  sampleSolution: `${read('q0/material_0/src/Task.java')}\n\n${read('q0/material_0/src/PersonalTask.java')}\n\n${read('q0/material_0/src/WorkTask.java')}\n\n${read('q0/material_0/src/Q1.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — add one WorkTask; input.txt: "1" / "Work 1 ReportX ProjectA"):
output.txt:
Add new work: 1 ReportX

Sample run 2 (TC 2 — add one PersonalTask and mark done; input.txt: "2" / "Personal 2 Grocery Home" / "Done 2"):
output.txt:
Add new personal: 2 Grocery
2 is done!

Sample run 3 (TC 3 — add Work + Personal, mark Work done, PrintAll):
output.txt:
Add new work: 1 ReportX
Add new personal: 2 Grocery
1 is done!
--PrintAll--
Work: [1] ReportX (ProjectA) - Done
Personal: [2] Grocery (Home) - Not Done

Sample run 4 (TC 4 — 2 WorkTask + 1 PersonalTask, mark id 2 done, PrintByType Work):
output.txt:
Add new work: 1 Design
Add new work: 2 Code
Add new personal: 3 Call
2 is done!
--PrintByType: Work--
Work: [1] Design (ProjectX) - Not Done
Work: [2] Code (ProjectX) - Done

Sample run 5 (TC 5 — hard, mixed operations: 2 PersonalTask + 1 WorkTask, Done 3, PrintAll, Done 1, PrintByType Personal):
output.txt:
Add new personal: 1 Read
Add new work: 2 Submit
Add new personal: 3 Jog
3 is done!
--PrintAll--
Personal: [1] Read (Library) - Not Done
Work: [2] Submit (ProjectB) - Not Done
Personal: [3] Jog (Park) - Done
1 is done!
--PrintByType: Personal--
Personal: [1] Read (Library) - Done
Personal: [3] Jog (Park) - Done`,
  explanation: B(q1ExplainEn, q1ExplainVi),
  rubric: [
    { id: 'task_abstract', criterion: B('Task correctly declares id/name/done, the (int,String) constructor, markDone/isDone/getId/getName, and getInfo/getType stay abstract.', 'Task khai báo đúng id/name/done, constructor (int,String), markDone/isDone/getId/getName, getInfo/getType vẫn abstract.'), weight: 1, maxScore: 2 },
    { id: 'subclasses', criterion: B('PersonalTask/WorkTask extend Task correctly and getInfo() matches the exact "Type: [id] name (extra) - status" format, getType() returns the right literal.', 'PersonalTask/WorkTask kế thừa Task đúng, getInfo() khớp CHÍNH XÁC định dạng "Type: [id] name (extra) - status", getType() trả đúng chuỗi.'), weight: 1, maxScore: 3 },
    { id: 'add_done', criterion: B('Work/Personal commands add the right subclass and print "Add new work/personal: <id> <name>" (no project/location on this line); Done <id> looks up across all tasks and prints "<id> is done!".', 'Lệnh Work/Personal thêm đúng lớp con và in "Add new work/personal: <id> <name>" (không có project/location ở dòng này); Done <id> tìm trên toàn bộ task và in "<id> is done!".'), weight: 1, maxScore: 3 },
    { id: 'print', criterion: B('PrintAll and PrintByType print the correct header line then each matching task via getInfo(), in insertion order, PrintByType filtering by exact type match.', 'PrintAll và PrintByType in đúng dòng tiêu đề rồi từng task khớp qua getInfo(), theo thứ tự thêm vào, PrintByType lọc đúng theo type.'), weight: 1, maxScore: 2 },
  ],
};

const spec = {
  course: { courseCode: 'PRO192' },
  exams: [
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE5-SU25-P1',
      title: B('PRO192 — Practical Exam Đề 5 (SU25, Paper 1)', 'PRO192 — Đề thi thực hành số 5 (SU25, Paper 1)'),
      description: B(
        'Real PRO192 PE paper (single 10-mark question, file-I/O grading) — abstract base class + 2 subclasses (WorkTask/PersonalTask), a command-driven task manager reading input.txt and writing output.txt. Solution written & verified by filling in the real given Q1.java skeleton, compiling, and running against all 5 official sample inputs.',
        'Đề PE PRO192 thật (1 câu duy nhất, 10 điểm, chấm qua file I/O) — lớp cơ sở abstract + 2 lớp con (WorkTask/PersonalTask), hệ quản lý task theo lệnh đọc input.txt và ghi output.txt. Lời giải đã viết và kiểm bằng cách điền khung Q1.java given thật, biên dịch, chạy với cả 5 input mẫu chính thức.',
      ),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      source: 'REAL',
      isPublished: true,
      instructions,
      attachmentUrl: ATTACHMENT_URL,
      attachmentName: B('Download given materials (Q1, real file-I/O skeleton + sample inputs)', 'Tải given materials (Q1, khung file-I/O thật + input mẫu)'),
      questions: [q1],
    },
  ],
};

fs.writeFileSync(
  OUT,
  `// AUTO-GENERATED by scripts/build-pro192-pe5.mjs — do not hand-edit, re-run the builder instead.\nexport default ${JSON.stringify(spec, null, 2)};\n`,
  'utf8',
);
console.log(`✓ wrote ${path.relative(process.cwd(), OUT)}`);
