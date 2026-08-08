/**
 * build-pro192-pe3.mjs — sinh content/exams/PRO192-PE3.mjs.
 *
 * Giống Đề 5: nguồn thật (rar given materials, `material_0.zip`) chỉ có MỘT
 * thư mục câu hỏi với khung Q1.java rỗng (@STUDENT chưa điền) + 2 file
 * input/output mẫu. Không có Main.class biên dịch sẵn, không có project
 * NetBeans đi kèm — kiểu PE "file I/O": đọc input.txt (dòng đầu T, T dòng
 * lệnh tiếp theo) rồi ghi kết quả ra output.txt, học sinh tự viết toàn bộ.
 *
 * Nguồn ảnh đề (`_attachments_page_1-jpg...`, 2000×22626px) là MỘT trang
 * Question 1 lặp lại 2 lần liên tiếp (cuộn dài) — không có trang nào cho
 * Question 2/3/4. Đã tự đọc lại ảnh (crop theo chiều dọc, đọc bằng mắt) xác
 * nhận UML (ISmartDevice/Device/SmartPhone) + đặc tả 6 lệnh add/print/search/
 * check/sort/clear khớp 100% với lời giải đã có sẵn trong scratchpad phiên
 * trước — không transcribe lại, chỉ đối chiếu. Kết luận: đề này CHỈ có 1 câu,
 * trọn 10 điểm.
 *
 * Nguồn đã verify: scratchpad pro192-pe/de3/q0/material_0/src —
 * ISmartDevice.java, Device.java, SmartPhone.java, Q1.java (điền đầy đủ khung
 * given) biên dịch bằng `javac`, chạy `java q1.Q1` với cả 2 input mẫu
 * (input1/2.txt), output khớp BYTE-FOR-BYTE với output1/2.txt gốc.
 *
 * Given materials sạch (attachment) = chính zip gốc `material_0.zip` (chỉ có
 * khung Q1.java rỗng phần @STUDENT + 2 input/output mẫu, không có lời giải
 * nào lẫn vào) — upload thẳng lên R2 PRO192/PE3-Given.zip, verify GET 200.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRO192-PE3.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = '/private/tmp/claude-501/-Users-admin-Downloads-api-backend/2c89fc57-9aa7-4c2e-8cc0-a484bfb4eb0f/scratchpad/pro192-pe/de3';
const OUT = path.resolve(import.meta.dirname, '../content/exams/PRO192-PE3.mjs');

const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8').trimEnd();

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/PRO192/PE3-Given.zip';

const instructions = ML(
  `<p><strong>PRO192 PE INSTRUCTIONS</strong> (transcribed from the real exam paper, "Đề 3 PRO192 - SP26 - B5 - PE").</p>
   <ol>
     <li>Students are ONLY allowed to use: NetBeans IDE 8.x and Java JDK 1.8; their own study materials (slides, notes, sample codes, program examples, e-books) stored on their own computer only; for distance learning, Google Meet/Hangout is used for exam monitoring only.</li>
     <li>Step 1: run "Clean and Build Project" (Shift+F11) to create the <strong>dist</strong> folder and <strong>.jar</strong> file.</li>
     <li>Step 2: prepare the submission — for the question (question 1) create two sub-folders <strong>run</strong> and <strong>src</strong>; copy the built <code>.jar</code> into <strong>run</strong>; compress the source code into a <strong>.zip</strong> and copy that zip into <strong>src</strong>.</li>
     <li>Step 3: in the PEA software choose question number 1 and attach the corresponding solution folder (1), then click Submit.</li>
     <li>Do NOT use accented Vietnamese when writing code comments. Solutions are marked by Automated Marking Software. If any of the above requirements is not followed, the exam gets ZERO.</li>
   </ol>
   <p><strong>Note on this paper's format:</strong> unlike the interactive-<code>Main.class</code> PRO192 PE papers, this one is a single 10-mark question graded by comparing the <code>output.txt</code> your program writes against an expected file. The given materials download above is the REAL given skeleton (<code>Q1.java</code> with the exact fixed parts you must not edit, plus 2 sample <code>input.txt</code>/<code>output.txt</code> pairs) so you can build &amp; run it for real on your own machine. This exam room cannot run NetBeans/JDK in the browser, so you type your classes directly into the code box and it is graded by AI against the rubric.</p>`,
  `<p><strong>HƯỚNG DẪN PE PRO192</strong> (dịch nguyên văn từ đề thi thật "Đề 3 PRO192 - SP26 - B5 - PE").</p>
   <ol>
     <li>Sinh viên CHỈ được dùng: NetBeans IDE 8.x và Java JDK 1.8; tài liệu học tập của riêng mình (slide, ghi chú, mã mẫu, ví dụ chương trình, sách điện tử) lưu trên máy tính của mình; nếu học từ xa thì Google Meet/Hangout chỉ dùng để giám sát thi.</li>
     <li>Bước 1: chạy "Clean and Build Project" (Shift+F11) để tạo thư mục <strong>dist</strong> và file <strong>.jar</strong>.</li>
     <li>Bước 2: chuẩn bị nộp bài — với câu hỏi (question 1) tạo 2 thư mục con <strong>run</strong> và <strong>src</strong>; chép file <code>.jar</code> đã build vào <strong>run</strong>; nén mã nguồn thành <strong>.zip</strong> rồi chép zip đó vào <strong>src</strong>.</li>
     <li>Bước 3: trong phần mềm PEA chọn số câu 1 rồi đính kèm thư mục lời giải tương ứng (1), bấm Submit.</li>
     <li>KHÔNG gõ tiếng Việt có dấu trong comment code. Bài được chấm bởi phần mềm chấm tự động. Nếu vi phạm bất kỳ yêu cầu nào ở trên, bài thi sẽ bị ZERO.</li>
   </ol>
   <p><strong>Lưu ý định dạng đề này:</strong> khác các đề PE PRO192 gọi Main.class tương tác, đề này chỉ có 1 câu duy nhất trọn 10 điểm, được chấm bằng cách so sánh file <code>output.txt</code> chương trình bạn ghi ra với file kết quả mong đợi. File "given materials" tải ở trên là khung given THẬT (<code>Q1.java</code> với đúng các phần cố định không được sửa, kèm 2 cặp <code>input.txt</code>/<code>output.txt</code> mẫu) để bạn build &amp; chạy thật trên máy mình. Phòng thi web không chạy được NetBeans/JDK trực tiếp nên bạn gõ thẳng class vào ô mã, được AI chấm theo tiêu chí.</p>`,
);

function table(rows) {
  return `<table class="uml-table"><tbody>${rows.map((r) => `<tr><td>${r}</td></tr>`).join('')}</tbody></table>`;
}

// ── Q1 (only question, 10 marks): ISmartDevice / Device (abstract) / SmartPhone + Q1 file I/O driver ──
const q1PromptEn = `<p><strong>(10 marks)</strong> Create 1 Interface, 1 Abstract Class and 2 classes as below.</p>
<p><strong>1. Interface: ISmartDevice</strong></p>
${table([
  '+getDeviceInfo(): String<br/>+checkStatus(): String',
])}
<p><strong>2. Abstract Class: Device</strong></p>
${table([
  '-deviceId: String<br/>-modelName: String',
  '+Device()<br/>+Device(String, String)<br/>+setDeviceId(deviceId: String): void<br/>+setModelName(modelName: String): void<br/>+getDeviceId(): String<br/>+getModelName(): String<br/>+addData(): String {abstract}',
])}
<ul>
  <li>Constructor <code>Device(String deviceId, String modelName)</code>: set <code>deviceId</code> = value of deviceId, <code>modelName</code> = value of modelName.</li>
  <li>Get/set methods for <code>deviceId</code> and <code>modelName</code>.</li>
  <li><code>addData()</code>: <strong>abstract</strong> method.</li>
</ul>
<p><strong>3. Class: SmartPhone</strong> extends <strong>Device</strong>, implements <strong>ISmartDevice</strong></p>
${table([
  '-storage: int<br/>-isOn: boolean',
  '+SmartPhone()<br/>+SmartPhone(String, String, int, boolean)<br/>+setStorage(storage: int): void<br/>+setIsOn(isOn: boolean): void<br/>+getStorage(): int<br/>+isIsOn(): boolean',
])}
<ul>
  <li>Constructor <code>SmartPhone(String deviceId, String modelName, int storage, boolean isOn)</code>: set deviceId = value of deviceId, modelName = value of modelName, storage = value of storage, isOn = value of isOn.</li>
  <li>Get/set methods for <code>storage</code>, <code>isOn</code>.</li>
  <li><code>addData()</code> override: return a string with format <code>SmartPhone(deviceId,modelName,storage GB,isOn)</code>, where <code>isOn = true</code> displays "On", otherwise "Off". Example: <code>SmartPhone(SP001,iPhone 15 Pro,256 GB,On) is added</code>.</li>
  <li><code>getDeviceInfo()</code> override: return a string that contains SmartPhone information, format <code>SmartPhone(deviceId,modelName,storage GB,isOn)</code> (same rule for isOn), example <code>SmartPhone(SP001,iPhone 15 Pro,256 GB,On)</code>.</li>
  <li><code>checkStatus()</code> override: returns a string indicating the current power status of the device — <strong>"Device is On"</strong> if isOn is true, otherwise <strong>"Device is Off"</strong>.</li>
</ul>
<p><strong>4. Class: Q1</strong> — build a program that reads the input file and prints out the result into the output file:</p>
<p><strong>The input</strong>: stored in <code>input.txt</code>:</p>
<ul>
  <li>The first line contains a positive integer T (1 ≤ T ≤ 100), the number of test cases.</li>
  <li>The next T lines each contain one of 6 command types:</li>
</ul>
${table([
  '<strong>add,deviceId,modelName,storage,isOn</strong> — add a new SmartPhone(deviceId, modelName, storage, isOn) to the list and print the string with format "SmartPhone(deviceId,modelName,storage GB,isOn) is added"',
  '<strong>print</strong> — if the list is not empty, print out the list of smartphones with format string "SmartPhone(deviceId,modelName,storage GB,isOn)", else print "Empty".',
  '<strong>search,deviceId</strong> — search the smartphone in the list. If it exists, print out the string "SmartPhone(deviceId,modelName,storage GB,isOn)", else print "Not found".',
  '<strong>check,deviceId</strong> — retrieve and display the status of the smartphone that has the specified deviceId: "Device is On" / "Device is Off". If not found, print "Not found".',
  '<strong>sort</strong> — sort smartphones in descending order of storage and print out information of all SmartPhone as the print sample. If empty, print "Empty".',
  '<strong>clear</strong> — remove all smartphones that were added and print out the string "* Remove all SmartPhone".',
])}
<p>Each command block above (except add/search/check) is preceded by its own header line: <code>---Print---</code>, <code>---Search Result---</code>, <code>---Check Result---</code>, <code>---Sort---</code>.</p>
<p><strong>The output</strong>: all result must be printed out into the <strong>output.txt</strong> file.</p>
<p>The starter code below already includes the FIXED parts of <code>Q1</code> (do not change them: <code>setFile</code>, the try/catch skeleton in <code>read()</code>, the try/catch skeleton in <code>printResult()</code>, and <code>main()</code>) — you only fill in the <code>@STUDENT</code> sections plus write the <code>ISmartDevice</code>, <code>Device</code>, <code>SmartPhone</code> classes.</p>`;
const q1PromptVi = `<p><strong>(10 điểm)</strong> Tạo 1 Interface, 1 Abstract Class và 2 lớp như bên dưới.</p>
<p><strong>1. Interface: ISmartDevice</strong></p>
${table([
  '+getDeviceInfo(): String<br/>+checkStatus(): String',
])}
<p><strong>2. Abstract Class: Device</strong></p>
${table([
  '-deviceId: String<br/>-modelName: String',
  '+Device()<br/>+Device(String, String)<br/>+setDeviceId(deviceId: String): void<br/>+setModelName(modelName: String): void<br/>+getDeviceId(): String<br/>+getModelName(): String<br/>+addData(): String {abstract}',
])}
<ul>
  <li>Constructor <code>Device(String deviceId, String modelName)</code>: gán deviceId = giá trị deviceId, modelName = giá trị modelName.</li>
  <li>Phương thức get/set cho <code>deviceId</code> và <code>modelName</code>.</li>
  <li><code>addData()</code>: phương thức <strong>abstract</strong>.</li>
</ul>
<p><strong>3. Lớp: SmartPhone</strong> kế thừa <strong>Device</strong>, implements <strong>ISmartDevice</strong></p>
${table([
  '-storage: int<br/>-isOn: boolean',
  '+SmartPhone()<br/>+SmartPhone(String, String, int, boolean)<br/>+setStorage(storage: int): void<br/>+setIsOn(isOn: boolean): void<br/>+getStorage(): int<br/>+isIsOn(): boolean',
])}
<ul>
  <li>Constructor <code>SmartPhone(String deviceId, String modelName, int storage, boolean isOn)</code>: gán deviceId = giá trị deviceId, modelName = giá trị modelName, storage = giá trị storage, isOn = giá trị isOn.</li>
  <li>Phương thức get/set cho <code>storage</code>, <code>isOn</code>.</li>
  <li><code>addData()</code> override: trả về chuỗi định dạng <code>SmartPhone(deviceId,modelName,storage GB,isOn)</code>, trong đó isOn = true hiển thị "On", ngược lại "Off". Ví dụ: <code>SmartPhone(SP001,iPhone 15 Pro,256 GB,On) is added</code>.</li>
  <li><code>getDeviceInfo()</code> override: trả về chuỗi chứa thông tin SmartPhone, định dạng <code>SmartPhone(deviceId,modelName,storage GB,isOn)</code> (cùng quy tắc isOn), ví dụ <code>SmartPhone(SP001,iPhone 15 Pro,256 GB,On)</code>.</li>
  <li><code>checkStatus()</code> override: trả về chuỗi thể hiện trạng thái nguồn hiện tại — <strong>"Device is On"</strong> nếu isOn true, ngược lại <strong>"Device is Off"</strong>.</li>
</ul>
<p><strong>4. Lớp: Q1</strong> — xây dựng chương trình đọc file input và in kết quả ra file output:</p>
<p><strong>Input</strong>: lưu trong <code>input.txt</code>:</p>
<ul>
  <li>Dòng đầu là số nguyên dương T (1 ≤ T ≤ 100), số lượng test case.</li>
  <li>T dòng tiếp theo, mỗi dòng là 1 trong 6 loại lệnh:</li>
</ul>
${table([
  '<strong>add,deviceId,modelName,storage,isOn</strong> — thêm 1 SmartPhone(deviceId, modelName, storage, isOn) mới vào danh sách và in chuỗi định dạng "SmartPhone(deviceId,modelName,storage GB,isOn) is added"',
  '<strong>print</strong> — nếu danh sách không rỗng, in danh sách smartphone với định dạng "SmartPhone(deviceId,modelName,storage GB,isOn)", ngược lại in "Empty".',
  '<strong>search,deviceId</strong> — tìm smartphone trong danh sách. Nếu có, in chuỗi "SmartPhone(deviceId,modelName,storage GB,isOn)", ngược lại in "Not found".',
  '<strong>check,deviceId</strong> — lấy và hiển thị trạng thái của smartphone có deviceId chỉ định: "Device is On" / "Device is Off". Nếu không tìm thấy, in "Not found".',
  '<strong>sort</strong> — sắp xếp smartphone giảm dần theo storage rồi in thông tin tất cả SmartPhone như mẫu print. Nếu rỗng, in "Empty".',
  '<strong>clear</strong> — xoá hết smartphone đã thêm và in chuỗi "* Remove all SmartPhone".',
])}
<p>Mỗi khối lệnh trên (trừ add/search/check) có dòng tiêu đề riêng phía trước: <code>---Print---</code>, <code>---Search Result---</code>, <code>---Check Result---</code>, <code>---Sort---</code>.</p>
<p><strong>Output</strong>: toàn bộ kết quả phải được in ra file <strong>output.txt</strong>.</p>
<p>Code khởi tạo bên dưới đã có sẵn phần CỐ ĐỊNH của <code>Q1</code> (không được sửa: <code>setFile</code>, khung try/catch trong <code>read()</code>, khung try/catch trong <code>printResult()</code>, và <code>main()</code>) — bạn chỉ cần điền các phần <code>@STUDENT</code> và viết thêm lớp <code>ISmartDevice</code>, <code>Device</code>, <code>SmartPhone</code>.</p>`;

const q1ExplainEn = `<p>Two easy-to-miss format traps, both confirmed by running against both official samples: (1) <code>check,deviceId</code> and <code>search,deviceId</code> must print their own "Not found" (no crash) when the device doesn't exist — TC1 exercises both empty-list and not-found paths in the same run. (2) <code>sort</code> sorts a COPY in descending storage order without mutating the original insertion-order list used by <code>print</code>/<code>search</code> afterward — though in these 2 samples <code>sort</code> always runs last or is followed by <code>clear</code>, so this only matters if a future test interleaves sort with print/search.</p>
<p>Every "empty" case (<code>print</code>/<code>sort</code> on an empty list) prints just the single word <strong>"Empty"</strong> under its own header line — not "List is empty" or similar. <code>checkStatus()</code>/the <code>check</code> command's true/false wording is exactly <strong>"Device is On"</strong> / <strong>"Device is Off"</strong> (capital D, matches the UML spec verbatim).</p>
<p>This whole paper is graded via file I/O — the given <code>Q1.java</code> skeleton (see the "given materials" download) already fixes <code>read()</code>/<code>printResult()</code>'s try/catch scaffolding and <code>setFile()</code>/<code>main()</code>; you only add the parsing/algorithm/output-building code in the marked <code>@STUDENT</code> sections, plus write <code>ISmartDevice</code>, <code>Device</code>, <code>SmartPhone</code> as separate classes. Verified by filling in the real given skeleton, compiling with <code>javac</code>, and running <code>java q1.Q1</code> against both sample <code>input.txt</code> files — output matched both samples byte-for-byte:</p>
<pre>TC1 (print/clear/search/check on empty list, then sort):
---Print---
Empty
* Remove all SmartPhone
---Search Result---
Not found
---Check Result---
Not found
---Sort---
Empty

TC2 (add 2 phones, print, search, check×2, sort, clear):
SmartPhone(SP001,iPhone 15 Pro,256 GB,On) is added
SmartPhone(SP002,Samsung S23 Ultra,512 GB,Off) is added
---Print---
SmartPhone(SP001,iPhone 15 Pro,256 GB,On)
SmartPhone(SP002,Samsung S23 Ultra,512 GB,Off)
---Search Result---
SmartPhone(SP002,Samsung S23 Ultra,512 GB,Off)
---Check Result---
Device is On
---Check Result---
Device is Off
---Sort---
SmartPhone(SP002,Samsung S23 Ultra,512 GB,Off)
SmartPhone(SP001,iPhone 15 Pro,256 GB,On)
* Remove all SmartPhone</pre>`;
const q1ExplainVi = `<p>Hai bẫy định dạng dễ bỏ sót, cả hai đều đã kiểm bằng cách chạy đủ 2 mẫu chính thức: (1) <code>check,deviceId</code> và <code>search,deviceId</code> phải tự in "Not found" (không crash) khi thiết bị không tồn tại — TC1 kiểm cả 2 nhánh danh sách rỗng lẫn không tìm thấy trong cùng 1 lần chạy. (2) <code>sort</code> sắp xếp trên 1 BẢN SAO giảm dần theo storage, không làm thay đổi danh sách gốc theo thứ tự thêm vào mà <code>print</code>/<code>search</code> vẫn dùng sau đó — dù trong 2 mẫu này <code>sort</code> luôn chạy cuối hoặc theo sau là <code>clear</code>, nên chỉ thật sự quan trọng nếu có test khác xen kẽ sort với print/search.</p>
<p>Mọi trường hợp "rỗng" (<code>print</code>/<code>sort</code> trên danh sách rỗng) chỉ in đúng 1 từ <strong>"Empty"</strong> dưới dòng tiêu đề riêng — không phải "List is empty" hay tương tự. Câu chữ true/false của <code>checkStatus()</code>/lệnh <code>check</code> đúng nguyên văn là <strong>"Device is On"</strong> / <strong>"Device is Off"</strong> (D hoa, khớp đúng đặc tả UML).</p>
<p>Cả đề này được chấm qua file I/O — khung <code>Q1.java</code> given (xem file "given materials" tải ở trên) đã cố định sẵn khung try/catch của <code>read()</code>/<code>printResult()</code> và <code>setFile()</code>/<code>main()</code>; bạn chỉ thêm code phân tích lệnh/thuật toán/dựng chuỗi output vào đúng các đoạn <code>@STUDENT</code>, cộng với viết riêng 3 lớp <code>ISmartDevice</code>, <code>Device</code>, <code>SmartPhone</code>. Đã kiểm bằng cách điền đầy đủ khung given thật, biên dịch bằng <code>javac</code>, chạy <code>java q1.Q1</code> với cả 2 file <code>input.txt</code> mẫu — output khớp byte-for-byte với cả 2 mẫu:</p>
<pre>TC1 (print/clear/search/check trên danh sách rỗng, rồi sort):
---Print---
Empty
* Remove all SmartPhone
---Search Result---
Not found
---Check Result---
Not found
---Sort---
Empty

TC2 (thêm 2 phone, print, search, check×2, sort, clear):
SmartPhone(SP001,iPhone 15 Pro,256 GB,On) is added
SmartPhone(SP002,Samsung S23 Ultra,512 GB,Off) is added
---Print---
SmartPhone(SP001,iPhone 15 Pro,256 GB,On)
SmartPhone(SP002,Samsung S23 Ultra,512 GB,Off)
---Search Result---
SmartPhone(SP002,Samsung S23 Ultra,512 GB,Off)
---Check Result---
Device is On
---Check Result---
Device is Off
---Sort---
SmartPhone(SP002,Samsung S23 Ultra,512 GB,Off)
SmartPhone(SP001,iPhone 15 Pro,256 GB,On)
* Remove all SmartPhone</pre>`;

const q1StarterCode = `public interface ISmartDevice {
    // TODO: getDeviceInfo(): String
    // TODO: checkStatus(): String
}

abstract class Device {
    private String deviceId;
    private String modelName;

    public Device() {
    }

    public Device(String deviceId, String modelName) {
        // TODO: set deviceId, modelName
    }

    // TODO: setDeviceId(String), setModelName(String)
    // TODO: getDeviceId(), getModelName()

    public abstract String addData();
}

class SmartPhone extends Device implements ISmartDevice {
    private int storage;
    private boolean isOn;

    public SmartPhone() {
        super();
    }

    public SmartPhone(String deviceId, String modelName, int storage, boolean isOn) {
        // TODO: call super(deviceId, modelName), set storage, isOn
    }

    // TODO: setStorage(int), setIsOn(boolean), getStorage(), isIsOn()

    // TODO: addData() override -> "SmartPhone(deviceId,modelName,storage GB,isOn) is added"
    // TODO: getDeviceInfo() override -> "SmartPhone(deviceId,modelName,storage GB,isOn)"
    // TODO: checkStatus() override -> "Device is On" / "Device is Off"
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
    // TODO: e.g. int T; ArrayList<String> listInput; String ketqua; ArrayList<SmartPhone> phones;

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
            // TODO: read T, then T lines into your storage

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
            sc.close();
        } catch (FileNotFoundException ex) {
            System.out.println("Input Exception # " + ex);
        }
    }
    //--END FIXED PART----------------------------

    //ALGORITHM - @STUDENT: ADD YOUR OWN METHODS HERE (IF NEED):
    // TODO: e.g. a helper to find a SmartPhone by deviceId

    //--FIXED PART - DO NOT EDIT ANY THINGS HERE--
    //--START FIXED PART--------------------------
    public void solve() {
    //--END FIXED PART----------------------------

        //ALGORITHM - @STUDENT: ADD YOUR CODE HERE:
        // TODO: parse each line's command (add/print/search/check/sort/clear)
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
  sampleSolution: `${read('q0/material_0/src/ISmartDevice.java')}\n\n${read('q0/material_0/src/Device.java')}\n\n${read('q0/material_0/src/SmartPhone.java')}\n\n${read('q0/material_0/src/Q1.java')}`,
  expectedOutput:
`Sample run 1 (TC 1 — print/clear/search/check on empty list, then sort; input.txt: "5" / "print" / "clear" / "search,SP002" / "check,SP003" / "sort"):
output.txt:
---Print---
Empty
* Remove all SmartPhone
---Search Result---
Not found
---Check Result---
Not found
---Sort---
Empty

Sample run 2 (TC 2 — add 2 phones, print, search, check×2, sort, clear; input.txt: "8" / "add,SP001,iPhone 15 Pro,256,true" / "add,SP002,Samsung S23 Ultra,512,false" / "print" / "search,SP002" / "check,SP001" / "check,SP002" / "sort" / "clear"):
output.txt:
SmartPhone(SP001,iPhone 15 Pro,256 GB,On) is added
SmartPhone(SP002,Samsung S23 Ultra,512 GB,Off) is added
---Print---
SmartPhone(SP001,iPhone 15 Pro,256 GB,On)
SmartPhone(SP002,Samsung S23 Ultra,512 GB,Off)
---Search Result---
SmartPhone(SP002,Samsung S23 Ultra,512 GB,Off)
---Check Result---
Device is On
---Check Result---
Device is Off
---Sort---
SmartPhone(SP002,Samsung S23 Ultra,512 GB,Off)
SmartPhone(SP001,iPhone 15 Pro,256 GB,On)
* Remove all SmartPhone`,
  explanation: B(q1ExplainEn, q1ExplainVi),
  rubric: [
    { id: 'interface_abstract', criterion: B('ISmartDevice declares getDeviceInfo/checkStatus; Device correctly declares deviceId/modelName, both constructors, get/set methods, and addData stays abstract.', 'ISmartDevice khai báo getDeviceInfo/checkStatus; Device khai báo đúng deviceId/modelName, cả 2 constructor, get/set, addData vẫn abstract.'), weight: 1, maxScore: 2 },
    { id: 'smartphone', criterion: B('SmartPhone extends Device implements ISmartDevice correctly; addData/getDeviceInfo/checkStatus match the exact format and On/Off wording.', 'SmartPhone kế thừa Device, implements ISmartDevice đúng; addData/getDeviceInfo/checkStatus khớp CHÍNH XÁC định dạng và chữ On/Off.'), weight: 1, maxScore: 3 },
    { id: 'add_search_check', criterion: B('add/search/check commands work correctly and print the exact confirmation/"Not found" strings.', 'Lệnh add/search/check hoạt động đúng, in đúng chuỗi xác nhận/"Not found".'), weight: 1, maxScore: 3 },
    { id: 'print_sort_clear', criterion: B('print/sort/clear print the correct header line then correct content (or "Empty"), sort orders descending by storage.', 'print/sort/clear in đúng dòng tiêu đề rồi đúng nội dung (hoặc "Empty"), sort đúng thứ tự giảm dần theo storage.'), weight: 1, maxScore: 2 },
  ],
};

const spec = {
  course: { courseCode: 'PRO192' },
  exams: [
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE3-SP26-B5',
      title: B('PRO192 — Practical Exam Đề 3 (SP26, Block 5)', 'PRO192 — Đề thi thực hành số 3 (SP26, Block 5)'),
      description: B(
        'Real PRO192 PE paper (single 10-mark question, file-I/O grading) — interface + abstract base class + 1 subclass (SmartPhone), a command-driven device manager reading input.txt and writing output.txt. Solution written & verified by filling in the real given Q1.java skeleton, compiling, and running against both official sample inputs.',
        'Đề PE PRO192 thật (1 câu duy nhất, 10 điểm, chấm qua file I/O) — interface + lớp cơ sở abstract + 1 lớp con (SmartPhone), hệ quản lý thiết bị theo lệnh đọc input.txt và ghi output.txt. Lời giải đã viết và kiểm bằng cách điền khung Q1.java given thật, biên dịch, chạy với cả 2 input mẫu chính thức.',
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
  `// AUTO-GENERATED by scripts/build-pro192-pe3.mjs — do not hand-edit, re-run the builder instead.\nexport default ${JSON.stringify(spec, null, 2)};\n`,
  'utf8',
);
console.log(`✓ wrote ${path.relative(process.cwd(), OUT)}`);
