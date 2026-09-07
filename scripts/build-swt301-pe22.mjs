/**
 * build-swt301-pe22.mjs — sinh content/exams/SWT301-PE22.mjs
 *
 * Nguồn: "Đề 19 - Đề Thi FE SWT301 - SU 2024 - PE2" (6 ảnh webp + 2 rar).
 * ⚠️ Thư mục nằm trong FE/ nhưng nội dung là đề PE (3 câu, 10 điểm) — đã đọc
 *    đủ 6/6 ảnh, không có phụ lục lạ, ảnh cuối kết thúc ở "Page 3|3".
 *
 * Hai archive đi kèm:
 *   - swt301_su24_b10w_pe2_template.rar → 1 xlsx (sheet Q1/Q2/Q3) ĐÃ ĐIỀN
 *     lời giải cho ĐÚNG đề này, chữ MÀU ĐEN (không phải chữ xanh "sample").
 *     Dùng làm đối chiếu, KHÔNG chép: nó có lỗi thật (xem ghi chú dưới).
 *   - swt301_su24_pe2_965641.rar → cùng file xlsx nhưng là bản GỐC TRỐNG,
 *     chữ xanh FF0070C0, nội dung mẫu của môn (vicDiff / "Company" form) —
 *     KHÔNG liên quan tới đề này. Không dùng.
 *
 * Lỗi thật trong xlsx b10w (đã sửa trong đáp án mẫu của deck):
 *   - Q1: số dòng lệch 3–4 so với đánh số 1..23 của chính đề; và danh sách 6
 *     lỗi của nó BỎ SÓT lỗi biên dịch duy nhất (biến `remainder` chưa khai
 *     báo) — javac báo đúng 2 error ở dòng 15 và 16.
 *   - Q3 TC008: "10 MOD 3" ghi kết quả mong đợi là 12 (đúng phải là 1).
 *   - Q3 TC009: MOD với Y=0 ghi thông báo "Please provide a non-zero Y
 *     value!" — spec của MOD nói phải là "Please provide a positive integer
 *     as Y value!".
 *   - Q2: xlsx đặt tên hàm "funcLunarNewYearBonus" còn lưu đồ trong đề ghi
 *     "fncLunarNewYearBonus"; và chú thích lưu đồ gọi tham số thứ ba là
 *     "noy" trong khi chữ ký + các nút quyết định gọi là "nod".
 *
 * Đã kiểm bằng cách CHẠY THẬT (không đọc rồi đoán):
 *   - javac Armstrong.java → đúng 2 error "cannot find symbol: remainder".
 *   - Thêm mỗi khai báo `remainder` → biên dịch được, chạy 153 cho ra
 *     n = -3, result = 0 ⇒ in "153 is not an Armstrong number." (sai).
 *   - Bản sửa đủ 6 lỗi → 153/9474 Armstrong, 154/9475 không. Đúng.
 *   - Toàn bộ 10 ca UTCID trong xlsx được tính lại tay theo lưu đồ: khớp
 *     100% (1300/1500/1500/1000/1700/1800/1200/300/1100/800).
 *   - Lưu đồ Mermaid dựng lại đã `mermaid.parse()` PASS (mermaid 11.16).
 *
 *   node scripts/build-swt301-pe22.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'content', 'exams', 'SWT301-PE22.mjs');

const IMG = {
  1: 'https://media.cuongthai.com/images/exam-questions/SWT301/PE22/q1.png',
  2: 'https://media.cuongthai.com/images/exam-questions/SWT301/PE22/q2.png',
  3: 'https://media.cuongthai.com/images/exam-questions/SWT301/PE22/q3.png',
};

/* ────────────────────────────── Q1 — mã Java của đề ─────────────────────── */
// Giữ NGUYÊN cách đánh số dòng 1..23 của chính đề (ảnh 02).
const JAVA = [
  ' 1.  import java.util.Scanner;',
  ' 2.',
  ' 3.  class Armstrong {',
  ' 4.      public static void main(String[] args) {',
  ' 5.          int number, originalNumber, result = 0, n = 0;',
  ' 6.          System.out.print("Enter the number you need to check: ");',
  ' 7.          try (Scanner scanner = new Scanner(System.in)) {',
  ' 8.              number = scanner.nextInt();',
  ' 9.          }',
  '10.          originalNumber = number;',
  '11.          for (;originalNumber != 0; originalNumber /= 10, --n);',
  '12.          originalNumber = number/10;',
  '13.          for (;originalNumber == 0; originalNumber /= 10)',
  '14.          {',
  '15.              remainder = originalNumber * 10;',
  '16.              result -= Math.pow(remainder, n);',
  '17.          }',
  '18.          if(result == number)',
  '19.              System.out.println(number + " is an Armstrong number.");',
  '20.          else',
  '21.              System.out.println(number + " is not an Armstrong number.");',
  '22.      }',
  '23.  }',
].join('\n');

const JAVA_FIXED = [
  'import java.util.Scanner;',
  '',
  'public class Armstrong {',
  '    public static void main(String[] args) {',
  '        int number, originalNumber, remainder, result = 0, n = 0;',
  '        System.out.print("Enter the number you need to check: ");',
  '        try (Scanner scanner = new Scanner(System.in)) {',
  '            number = scanner.nextInt();',
  '        }',
  '        originalNumber = number;',
  '        for (; originalNumber != 0; originalNumber /= 10, ++n);',
  '        originalNumber = number;',
  '        for (; originalNumber != 0; originalNumber /= 10) {',
  '            remainder = originalNumber % 10;',
  '            result += (int) Math.pow(remainder, n);',
  '        }',
  '        if (result == number)',
  '            System.out.println(number + " is an Armstrong number.");',
  '        else',
  '            System.out.println(number + " is not an Armstrong number.");',
  '    }',
  '}',
].join('\n');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pre = (s) => `<pre><code>${esc(s)}</code></pre>`;

/* ────────────────────────────── Q2 — lưu đồ Mermaid ─────────────────────── */
// Dựng lại y hệt lưu đồ trong ảnh 03. Đã mermaid.parse() PASS.
const FLOW = esc(
  [
    'flowchart TD',
    '  S(["fncLunarNewYearBonus(float sal, char roe, float nod)"]) --> A{"roe = \'A\' ?"}',
    '  A -- Yes --> P1["plb := 100%"]',
    '  A -- No --> B{"roe = \'B\' ?"}',
    '  B -- Yes --> P2["plb := 80%"]',
    '  B -- No --> C{"roe = \'C\' ?"}',
    '  C -- Yes --> P3["plb := 50%"]',
    '  C -- No --> P4["plb := 0%"]',
    '  P1 --> D{"nod < 2 ?"}',
    '  P2 --> D',
    '  P3 --> D',
    '  P4 --> D',
    '  D -- Yes --> W1["pow := 30%"]',
    '  D -- No --> E{"nod < 5 ?"}',
    '  E -- Yes --> W2["pow := 70%"]',
    '  E -- No --> W3["pow := 100%"]',
    '  W1 --> R(["Return sal * (plb + pow)"])',
    '  W2 --> R',
    '  W3 --> R',
  ].join('\n'),
);
const MERMAID = `<pre class="mermaid">${FLOW}</pre>`;

/* ─────────────────────────────── tiện ích bảng ──────────────────────────── */
const row = (cells, head = false) =>
  `<tr>${cells.map((c) => `<td>${head ? `<b>${c}</b>` : c}</td>`).join('')}</tr>`;
const table = (header, rows) =>
  `<table>${row(header, true)}${rows.map((r) => row(r)).join('')}</table>`;

/* ══════════════════════════════════ Q1 ══════════════════════════════════ */

const Q1_PROMPT_EN =
  '<div class="pe-system"><b>System / Context:</b><br/>' +
  '<p>You are a Software Testing expert (SWT301 / ISTQB) sitting a real FPTU Practical Exam. ' +
  'This paper has three questions worth 3 + 3 + 4 = 10 points and is answered in a provided Excel ' +
  'template with one sheet per question (Q1 = issue list, Q2 = unit-test-case UTCID grid, ' +
  'Q3 = black-box test-case table). Answer in writing, in English.</p></div>' +
  '<p><b>Question 1 (3 points)</b></p>' +
  '<p>Review the following class and find <b>(at least) 6 issues</b> in the code (i.e. coding practice, ' +
  'compile errors, potential logical issue, etc.). <i>(Use question 1 template.)</i></p>' +
  '<p>An Armstrong number is a number that is equal to the sum of its digits each raised to the power of ' +
  'the number of digits. In other words, if you take each digit in the number, raise it to the power of the ' +
  'total count of digits in the number, and then sum them all together, the result is the original number ' +
  'itself. For example: 153 is an Armstrong number, 153 = 1*1*1 + 5*5*5 + 3*3*3. The code below checks the ' +
  'Armstrong number in Java.</p>' +
  pre(JAVA) +
  '<p><b>Answer format (Q1 sheet of the template):</b> one row per issue with the columns ' +
  '<i>Issue No</i>, <i>Description</i>, <i>Line</i>, <i>Detail</i> — where <i>Detail</i> is the corrected line of code.</p>';

const Q1_PROMPT_VI =
  '<div class="pe-system"><b>Hệ thống / Bối cảnh:</b><br/>' +
  '<p>Bạn là chuyên gia Kiểm thử phần mềm (SWT301 / ISTQB) đang làm một đề thi thực hành (PE) thật của FPTU. ' +
  'Đề gồm ba câu, thang 3 + 3 + 4 = 10 điểm, làm bài trong file Excel mẫu được phát kèm, mỗi câu một sheet ' +
  '(Q1 = danh sách lỗi, Q2 = lưới ca kiểm thử đơn vị UTCID, Q3 = bảng test case hộp đen). Trả lời bằng chữ, ' +
  'tiếng Anh.</p></div>' +
  '<p><b>Câu 1 (3 điểm)</b></p>' +
  '<p>Rà soát class dưới đây và tìm <b>(ít nhất) 6 lỗi</b> trong mã (gồm lỗi phong cách lập trình, lỗi biên dịch, ' +
  'lỗi logic tiềm ẩn, v.v.). <i>(Dùng template câu 1.)</i></p>' +
  '<p>Số Armstrong là số bằng tổng các chữ số của chính nó, mỗi chữ số được nâng lên lũy thừa bằng số chữ số. ' +
  'Nói cách khác, lấy từng chữ số trong số đó, nâng lên lũy thừa bằng tổng số chữ số của số đó, rồi cộng tất cả ' +
  'lại, kết quả chính là số ban đầu. Ví dụ: 153 là số Armstrong, 153 = 1*1*1 + 5*5*5 + 3*3*3. Đoạn mã dưới đây ' +
  'kiểm tra số Armstrong bằng Java.</p>' +
  pre(JAVA) +
  '<p><b>Định dạng trả lời (sheet Q1 của template):</b> mỗi lỗi một dòng với các cột ' +
  '<i>Issue No</i>, <i>Description</i>, <i>Line</i>, <i>Detail</i> — trong đó <i>Detail</i> là dòng mã đã sửa đúng.</p>';

const Q1_ISSUES_EN = table(
  ['#', 'Line', 'Kind', 'Description', 'Detail (corrected line)'],
  [
    ['1', '5', 'Compile error', 'The variable <code>remainder</code> is never declared. This is the only genuine compile error in the class, and it is reported twice by <code>javac</code> ("cannot find symbol: variable remainder") — at line 15 where it is assigned and at line 16 where it is read.', '<code>int number, originalNumber, remainder, result = 0, n = 0;</code>'],
    ['2', '11', 'Logical', 'The digit-counting loop <i>decrements</i> the counter. Starting from <code>n = 0</code>, <code>--n</code> makes <code>n</code> end at minus the number of digits (measured: <code>n = -3</code> for input 153), so every digit is later raised to a negative exponent.', '<code>for (; originalNumber != 0; originalNumber /= 10, ++n);</code>'],
    ['3', '12', 'Logical', '<code>originalNumber</code> must be restored to the <i>full</i> original value before the summation loop. Dividing by 10 throws away the last digit, so that digit could never be added to the sum.', '<code>originalNumber = number;</code>'],
    ['4', '13', 'Logical', 'The second <code>for</code> condition is inverted. <code>originalNumber == 0</code> is false for every non-zero input, so the loop body never executes and <code>result</code> stays 0 — the program answers "is not an Armstrong number" for 153.', '<code>for (; originalNumber != 0; originalNumber /= 10)</code>'],
    ['5', '15', 'Logical', 'Extracting the last digit needs the modulus operator, not multiplication. <code>originalNumber * 10</code> appends a zero instead of returning the digit.', '<code>remainder = originalNumber % 10;</code>'],
    ['6', '16', 'Logical', 'The powers must be <i>accumulated</i>, not subtracted. <code>-=</code> drives <code>result</code> negative so it can never equal a positive input.', '<code>result += (int) Math.pow(remainder, n);</code>'],
    ['7', '16', 'Coding practice', '<code>Math.pow</code> returns a <code>double</code> but <code>result</code> is an <code>int</code>. The compound assignment hides an implicit narrowing cast, so floating-point rounding is silently truncated. Make the cast explicit, or compute the power with an integer loop.', '<code>result += (int) Math.pow(remainder, n);</code>'],
    ['8', '7-9', 'Coding practice', 'Try-with-resources on <code>new Scanner(System.in)</code> closes <code>System.in</code> for the rest of the JVM, and there is no <code>catch</code>, so a non-numeric entry dies with an uncaught <code>InputMismatchException</code> instead of a message.', '<code>catch (InputMismatchException e) { System.out.println("Please enter an integer."); return; }</code>'],
    ['9', '3', 'Coding practice', 'The class is package-private and has no Javadoc/package declaration; negative inputs and inputs above <code>Integer.MAX_VALUE</code> are not rejected, and the algorithm is not extracted into a testable method (everything sits in <code>main</code>, so it cannot be unit tested).', '<code>public class Armstrong { public static boolean isArmstrong(int number) { ... } }</code>'],
  ],
);

const Q1_ISSUES_VI = table(
  ['#', 'Dòng', 'Loại', 'Mô tả', 'Detail (dòng đã sửa)'],
  [
    ['1', '5', 'Lỗi biên dịch', 'Biến <code>remainder</code> chưa hề được khai báo. Đây là lỗi biên dịch thật sự DUY NHẤT của class, và <code>javac</code> báo hai lần ("cannot find symbol: variable remainder") — ở dòng 15 nơi gán và dòng 16 nơi đọc.', '<code>int number, originalNumber, remainder, result = 0, n = 0;</code>'],
    ['2', '11', 'Logic', 'Vòng lặp đếm chữ số lại <i>giảm</i> biến đếm. Bắt đầu từ <code>n = 0</code>, <code>--n</code> khiến <code>n</code> kết thúc bằng âm số chữ số (đo thật: <code>n = -3</code> với đầu vào 153), nên mọi chữ số sau đó bị nâng lên lũy thừa âm.', '<code>for (; originalNumber != 0; originalNumber /= 10, ++n);</code>'],
    ['3', '12', 'Logic', '<code>originalNumber</code> phải được khôi phục về giá trị gốc <i>đầy đủ</i> trước vòng lặp cộng dồn. Chia cho 10 làm mất chữ số cuối, nên chữ số đó không bao giờ được cộng vào tổng.', '<code>originalNumber = number;</code>'],
    ['4', '13', 'Logic', 'Điều kiện vòng <code>for</code> thứ hai bị đảo ngược. <code>originalNumber == 0</code> sai với mọi đầu vào khác 0, nên thân vòng lặp không bao giờ chạy và <code>result</code> giữ nguyên 0 — chương trình trả lời "is not an Armstrong number" cho cả 153.', '<code>for (; originalNumber != 0; originalNumber /= 10)</code>'],
    ['5', '15', 'Logic', 'Lấy chữ số cuối phải dùng toán tử chia lấy dư, không phải phép nhân. <code>originalNumber * 10</code> chỉ thêm một số 0 vào cuối chứ không trả về chữ số.', '<code>remainder = originalNumber % 10;</code>'],
    ['6', '16', 'Logic', 'Các lũy thừa phải được <i>cộng dồn</i>, không phải trừ đi. <code>-=</code> đẩy <code>result</code> xuống âm nên không bao giờ bằng một đầu vào dương.', '<code>result += (int) Math.pow(remainder, n);</code>'],
    ['7', '16', 'Phong cách lập trình', '<code>Math.pow</code> trả về <code>double</code> nhưng <code>result</code> là <code>int</code>. Phép gán rút gọn giấu một ép kiểu thu hẹp ngầm, làm sai số dấu phẩy động bị cắt âm thầm. Nên ép kiểu tường minh, hoặc tính lũy thừa bằng vòng lặp số nguyên.', '<code>result += (int) Math.pow(remainder, n);</code>'],
    ['8', '7-9', 'Phong cách lập trình', 'Try-with-resources trên <code>new Scanner(System.in)</code> sẽ đóng luôn <code>System.in</code> cho cả phần đời còn lại của JVM, và không có <code>catch</code> nào, nên nhập ký tự không phải số sẽ chết bằng <code>InputMismatchException</code> chưa bắt thay vì hiện thông báo.', '<code>catch (InputMismatchException e) { System.out.println("Please enter an integer."); return; }</code>'],
    ['9', '3', 'Phong cách lập trình', 'Class là package-private, không có Javadoc/khai báo package; số âm và số vượt <code>Integer.MAX_VALUE</code> không bị chặn; và thuật toán không được tách thành phương thức kiểm thử được (mọi thứ nằm trong <code>main</code> nên không unit test được).', '<code>public class Armstrong { public static boolean isArmstrong(int number) { ... } }</code>'],
  ],
);

const Q1_SOL_EN =
  '<p><b>How this answer was verified.</b> The class was compiled with <code>javac</code> and run. As written it produces exactly two compile errors, both "cannot find symbol: variable <code>remainder</code>". After adding only that missing declaration it compiles but is still wrong: for input 153 it ends with <code>n = -3</code> and <code>result = 0</code> and prints "153 is not an Armstrong number." Applying all six fixes below makes it correct — verified by running it: 153 and 9474 are reported as Armstrong numbers, 154 and 9475 are not.</p>' +
  '<p><b>Nine issues (the paper asks for at least six; issues 1&ndash;6 are the core set):</b></p>' +
  Q1_ISSUES_EN +
  '<p><b>Corrected program:</b></p>' +
  pre(JAVA_FIXED) +
  '<p><b>Note on the answer template shipped with this paper.</b> Its Q1 sheet lists six issues that match issues 2&ndash;6 above plus "missing logic to count the digits before the loop", but it <i>omits the undeclared</i> <code>remainder</code> &mdash; the only real compile error, even though the question explicitly asks for compile errors. Its <i>Line</i> column is also shifted by three to four rows relative to the paper\'s own 1&ndash;23 numbering, so use the numbering printed in the question, as done above.</p>';

const Q1_SOL_VI =
  '<p><b>Đáp án này được kiểm chứng thế nào.</b> Class đã được biên dịch bằng <code>javac</code> và chạy thật. Giữ nguyên như đề, nó sinh đúng hai lỗi biên dịch, cả hai là "cannot find symbol: variable <code>remainder</code>". Sau khi chỉ thêm mỗi khai báo còn thiếu đó, nó biên dịch được nhưng vẫn sai: với đầu vào 153 nó kết thúc với <code>n = -3</code> và <code>result = 0</code>, in ra "153 is not an Armstrong number." Áp dụng đủ sáu bản sửa dưới đây thì nó đúng — đã chạy để kiểm: 153 và 9474 được báo là số Armstrong, 154 và 9475 thì không.</p>' +
  '<p><b>Chín lỗi (đề yêu cầu ít nhất sáu; lỗi 1&ndash;6 là nhóm cốt lõi):</b></p>' +
  Q1_ISSUES_VI +
  '<p><b>Chương trình đã sửa:</b></p>' +
  pre(JAVA_FIXED) +
  '<p><b>Ghi chú về file template đi kèm đề này.</b> Sheet Q1 của nó liệt kê sáu lỗi trùng với lỗi 2&ndash;6 ở trên cộng thêm "thiếu logic đếm chữ số trước vòng lặp", nhưng nó <i>bỏ sót biến</i> <code>remainder</code> chưa khai báo &mdash; lỗi biên dịch thật sự duy nhất, dù câu hỏi nói rõ là tìm cả lỗi biên dịch. Cột <i>Line</i> của nó cũng lệch ba đến bốn dòng so với cách đánh số 1&ndash;23 in ngay trong đề, nên hãy dùng số dòng in trong đề như bảng trên.</p>';

/* ══════════════════════════════════ Q2 ══════════════════════════════════ */

const Q2_PROMPT_EN =
  '<p><b>Question 2 (3 points)</b></p>' +
  '<p>Assuming you are assigned to conduct the component test for the function below, please design and create ' +
  '<b>the minimum component test cases</b> (Unit Test case) needed to achieve <b>100% statement coverage and ' +
  '100% decision coverage</b>. <i>(Use question 2 template.)</i></p>' +
  '<p><b>Function under test:</b> <code>float fncLunarNewYearBonus(float sal, char roe, float nod)</code></p>' +
  '<ul><li><code>sal</code> = average salary, &gt; 0</li>' +
  '<li><code>roe</code> = result of evaluation, in {\'A\', \'B\', \'C\', \'D\'}</li>' +
  '<li><code>noy</code> = number of years of experience, &ge; 0</li></ul>' +
  MERMAID +
  '<p><b>Answer format (Q2 sheet of the template):</b> one column per test case (UTCID01, UTCID02, &hellip;), ' +
  'with rows for each input condition (<code>sal</code>, <code>roe</code>, <code>nod</code>), the confirmed ' +
  'return value, and the case type (N = Normal, A = Abnormal, B = Boundary).</p>' +
  '<p><i>Note on the paper as printed: the flowchart legend names the third parameter <code>noy</code>, while ' +
  'the signature and both decision nodes name it <code>nod</code>. They are the same parameter — the number of ' +
  'years of experience. The answer below uses <code>nod</code>, matching the signature.</i></p>';

const Q2_PROMPT_VI =
  '<p><b>Câu 2 (3 điểm)</b></p>' +
  '<p>Giả sử bạn được giao thực hiện kiểm thử thành phần cho hàm dưới đây, hãy thiết kế và lập ' +
  '<b>số ca kiểm thử thành phần tối thiểu</b> (Unit Test case) cần thiết để đạt <b>100% bao phủ câu lệnh và ' +
  '100% bao phủ quyết định</b>. <i>(Dùng template câu 2.)</i></p>' +
  '<p><b>Hàm cần kiểm thử:</b> <code>float fncLunarNewYearBonus(float sal, char roe, float nod)</code></p>' +
  '<ul><li><code>sal</code> = lương trung bình, &gt; 0</li>' +
  '<li><code>roe</code> = kết quả đánh giá, thuộc {\'A\', \'B\', \'C\', \'D\'}</li>' +
  '<li><code>noy</code> = số năm kinh nghiệm, &ge; 0</li></ul>' +
  MERMAID +
  '<p><b>Định dạng trả lời (sheet Q2 của template):</b> mỗi ca kiểm thử một cột (UTCID01, UTCID02, &hellip;), ' +
  'các dòng ghi từng điều kiện đầu vào (<code>sal</code>, <code>roe</code>, <code>nod</code>), giá trị trả về ' +
  'đã xác nhận, và loại ca (N = Normal, A = Abnormal, B = Boundary).</p>' +
  '<p><i>Ghi chú về đúng câu chữ của đề: chú thích lưu đồ gọi tham số thứ ba là <code>noy</code>, còn chữ ký hàm ' +
  'và cả hai nút quyết định gọi nó là <code>nod</code>. Đó là cùng một tham số — số năm kinh nghiệm. Đáp án dưới ' +
  'đây dùng <code>nod</code> cho khớp với chữ ký hàm.</i></p>';

const Q2_MIN_EN = table(
  ['UTCID', 'sal', 'roe', 'nod', 'plb', 'pow', 'Expected return<br/>sal * (plb + pow)', 'Type'],
  [
    ['UTCID01', '1000', "'A'", '1', '100%', '30%', '<b>1300</b>', 'N'],
    ['UTCID02', '1000', "'B'", '3', '80%', '70%', '<b>1500</b>', 'N'],
    ['UTCID03', '1000', "'C'", '5', '50%', '100%', '<b>1500</b>', 'N'],
    ['UTCID04', '1000', "'D'", '7', '0%', '100%', '<b>1000</b>', 'N'],
  ],
);

const Q2_MIN_VI = table(
  ['UTCID', 'sal', 'roe', 'nod', 'plb', 'pow', 'Giá trị trả về mong đợi<br/>sal * (plb + pow)', 'Loại'],
  [
    ['UTCID01', '1000', "'A'", '1', '100%', '30%', '<b>1300</b>', 'N'],
    ['UTCID02', '1000', "'B'", '3', '80%', '70%', '<b>1500</b>', 'N'],
    ['UTCID03', '1000', "'C'", '5', '50%', '100%', '<b>1500</b>', 'N'],
    ['UTCID04', '1000', "'D'", '7', '0%', '100%', '<b>1000</b>', 'N'],
  ],
);

const Q2_COV_EN = table(
  ['Decision', 'True outcome covered by', 'False outcome covered by'],
  [
    ["D1: roe = 'A' ?", 'UTCID01', 'UTCID02, 03, 04'],
    ["D2: roe = 'B' ?", 'UTCID02', 'UTCID03, 04'],
    ["D3: roe = 'C' ?", 'UTCID03', 'UTCID04'],
    ['D4: nod &lt; 2 ?', 'UTCID01', 'UTCID02, 03, 04'],
    ['D5: nod &lt; 5 ?', 'UTCID02', 'UTCID03, 04'],
  ],
);

const Q2_COV_VI = table(
  ['Quyết định', 'Nhánh True được phủ bởi', 'Nhánh False được phủ bởi'],
  [
    ["D1: roe = 'A' ?", 'UTCID01', 'UTCID02, 03, 04'],
    ["D2: roe = 'B' ?", 'UTCID02', 'UTCID03, 04'],
    ["D3: roe = 'C' ?", 'UTCID03', 'UTCID04'],
    ['D4: nod &lt; 2 ?', 'UTCID01', 'UTCID02, 03, 04'],
    ['D5: nod &lt; 5 ?', 'UTCID02', 'UTCID03, 04'],
  ],
);

const Q2_EXTRA_EN = table(
  ['UTCID', 'sal', 'roe', 'nod', 'Expected return', 'Type', 'Why'],
  [
    ['UTCID05', '1000', "'A'", '2', '1700', 'B', 'nod = 2 is the first value that makes <code>nod &lt; 2</code> false'],
    ['UTCID06', '1000', "'B'", '5', '1800', 'B', 'nod = 5 is the first value that makes <code>nod &lt; 5</code> false'],
    ['UTCID07', '1000', "'C'", '4', '1200', 'B', 'nod = 4 is the last value that keeps <code>nod &lt; 5</code> true'],
    ['UTCID08', '1000', "'D'", '1', '300', 'A', 'worst evaluation with the shortest service'],
    ['UTCID09', '1000', "'B'", '0', '1100', 'A', 'nod = 0, the lower boundary of the valid range'],
    ['UTCID10', '1000', "'C'", '-1', '800', 'A', 'nod = -1 violates <code>noy &ge; 0</code> — the function should reject it, but the flowchart has no such guard'],
  ],
);

const Q2_EXTRA_VI = table(
  ['UTCID', 'sal', 'roe', 'nod', 'Giá trị trả về mong đợi', 'Loại', 'Lý do'],
  [
    ['UTCID05', '1000', "'A'", '2', '1700', 'B', 'nod = 2 là giá trị đầu tiên làm <code>nod &lt; 2</code> sai'],
    ['UTCID06', '1000', "'B'", '5', '1800', 'B', 'nod = 5 là giá trị đầu tiên làm <code>nod &lt; 5</code> sai'],
    ['UTCID07', '1000', "'C'", '4', '1200', 'B', 'nod = 4 là giá trị cuối cùng còn giữ <code>nod &lt; 5</code> đúng'],
    ['UTCID08', '1000', "'D'", '1', '300', 'A', 'đánh giá kém nhất kèm thâm niên ngắn nhất'],
    ['UTCID09', '1000', "'B'", '0', '1100', 'A', 'nod = 0, biên dưới của khoảng hợp lệ'],
    ['UTCID10', '1000', "'C'", '-1', '800', 'A', 'nod = -1 vi phạm <code>noy &ge; 0</code> — hàm lẽ ra phải chặn, nhưng lưu đồ không có chốt nào cả'],
  ],
);

const Q2_SOL_EN =
  '<p><b>Assumptions.</b> <code>sal = 1000</code> is used in every case so the arithmetic is easy to check by eye; any positive <code>sal</code> works. <code>plb</code> and <code>pow</code> are percentages used as fractions, so the return is <code>sal * (plb + pow)</code>. The flowchart has no guard for values outside the stated ranges, so the return value for an out-of-range <code>nod</code> is whatever the chart computes.</p>' +
  '<p><b>Step 1 &mdash; what has to be covered.</b> Eight executable statements: <code>plb := 100%</code>, <code>plb := 80%</code>, <code>plb := 50%</code>, <code>plb := 0%</code>, <code>pow := 30%</code>, <code>pow := 70%</code>, <code>pow := 100%</code>, and the return. Five decisions, each needing a True and a False outcome: D1 <code>roe = \'A\'</code>, D2 <code>roe = \'B\'</code>, D3 <code>roe = \'C\'</code>, D4 <code>nod &lt; 2</code>, D5 <code>nod &lt; 5</code>.</p>' +
  '<p><b>Step 2 &mdash; why the minimum is exactly 4.</b> The four <code>plb</code> assignments sit on four mutually exclusive paths, and one test execution can take only one of them, so <b>at least 4</b> test cases are required. Four is also <b>enough</b>, because the <code>pow</code> chain has only three outcomes and they can be spread across those same four cases. Three cases can never work: whichever <code>plb</code> branch is left out is an uncovered statement, and its missing decision outcome is an uncovered branch.</p>' +
  '<p><b>Step 3 &mdash; the minimum set (4 test cases):</b></p>' +
  Q2_MIN_EN +
  '<p><b>Step 4 &mdash; coverage proof.</b> Statement coverage: UTCID01 executes <code>plb := 100%</code> and <code>pow := 30%</code>; UTCID02 executes <code>plb := 80%</code> and <code>pow := 70%</code>; UTCID03 executes <code>plb := 50%</code> and <code>pow := 100%</code>; UTCID04 executes <code>plb := 0%</code>; all four execute the return. That is 8 of 8 statements = <b>100%</b>. Decision coverage:</p>' +
  Q2_COV_EN +
  '<p>Every one of the five decisions is exercised both True and False, so decision coverage is <b>100%</b> as well. Note that UTCID04\'s <code>nod</code> only has to be &ge; 5; 7 is chosen so the case is clearly a normal one.</p>' +
  '<p><b>Beyond the minimum (not required by this question, but good practice).</b> Coverage says nothing about boundaries. The answer template shipped with this paper extends the grid to ten cases by adding boundary and abnormal data around <code>nod = 2</code> and <code>nod = 5</code>:</p>' +
  Q2_EXTRA_EN +
  '<p>These six add no new statement or decision coverage — they buy boundary confidence, which is a different and complementary goal. If the question had asked for "a thorough component test" rather than "the minimum", all ten would be the right answer.</p>';

const Q2_SOL_VI =
  '<p><b>Giả định.</b> Dùng <code>sal = 1000</code> cho mọi ca để nhẩm kết quả cho dễ; bất kỳ <code>sal</code> dương nào cũng được. <code>plb</code> và <code>pow</code> là phần trăm dùng như phân số, nên giá trị trả về là <code>sal * (plb + pow)</code>. Lưu đồ không có chốt nào chặn giá trị ngoài khoảng đã nêu, nên giá trị trả về với <code>nod</code> ngoài khoảng chính là thứ lưu đồ tính ra.</p>' +
  '<p><b>Bước 1 &mdash; phải phủ những gì.</b> Tám câu lệnh thực thi: <code>plb := 100%</code>, <code>plb := 80%</code>, <code>plb := 50%</code>, <code>plb := 0%</code>, <code>pow := 30%</code>, <code>pow := 70%</code>, <code>pow := 100%</code>, và câu lệnh return. Năm quyết định, mỗi cái cần cả nhánh True lẫn False: D1 <code>roe = \'A\'</code>, D2 <code>roe = \'B\'</code>, D3 <code>roe = \'C\'</code>, D4 <code>nod &lt; 2</code>, D5 <code>nod &lt; 5</code>.</p>' +
  '<p><b>Bước 2 &mdash; vì sao tối thiểu đúng bằng 4.</b> Bốn phép gán <code>plb</code> nằm trên bốn đường loại trừ lẫn nhau, mà một lần chạy test chỉ đi được một đường, nên cần <b>ít nhất 4</b> ca. Bốn cũng là <b>đủ</b>, vì chuỗi <code>pow</code> chỉ có ba nhánh và có thể rải đều vào chính bốn ca đó. Ba ca thì không bao giờ đủ: nhánh <code>plb</code> nào bị bỏ ra sẽ là một câu lệnh chưa phủ, và nhánh quyết định thiếu tương ứng là một nhánh chưa phủ.</p>' +
  '<p><b>Bước 3 &mdash; bộ tối thiểu (4 ca kiểm thử):</b></p>' +
  Q2_MIN_VI +
  '<p><b>Bước 4 &mdash; chứng minh độ bao phủ.</b> Bao phủ câu lệnh: UTCID01 chạy <code>plb := 100%</code> và <code>pow := 30%</code>; UTCID02 chạy <code>plb := 80%</code> và <code>pow := 70%</code>; UTCID03 chạy <code>plb := 50%</code> và <code>pow := 100%</code>; UTCID04 chạy <code>plb := 0%</code>; cả bốn đều chạy câu lệnh return. Vậy là 8/8 câu lệnh = <b>100%</b>. Bao phủ quyết định:</p>' +
  Q2_COV_VI +
  '<p>Cả năm quyết định đều được đi qua ở cả hai nhánh True và False, nên bao phủ quyết định cũng <b>100%</b>. Lưu ý <code>nod</code> của UTCID04 chỉ cần &ge; 5; chọn 7 để ca đó rõ ràng là ca bình thường.</p>' +
  '<p><b>Ngoài mức tối thiểu (câu này không yêu cầu, nhưng là thực hành tốt).</b> Độ bao phủ không nói gì về giá trị biên. File template đi kèm đề này mở rộng lưới lên mười ca bằng cách thêm dữ liệu biên và bất thường quanh <code>nod = 2</code> và <code>nod = 5</code>:</p>' +
  Q2_EXTRA_VI +
  '<p>Sáu ca này không thêm được câu lệnh hay quyết định mới nào — chúng mua sự tự tin về biên, một mục tiêu khác và bổ trợ. Nếu đề hỏi "kiểm thử thành phần kỹ lưỡng" thay vì "tối thiểu" thì cả mười ca mới là đáp án đúng.</p>';

/* ══════════════════════════════════ Q3 ══════════════════════════════════ */

const Q3_SPEC_EN =
  '<p><b>Function Description:</b> This function can be used to calculate the value of expressions based on X and Y.</p>' +
  '<p><b>Screen Layout:</b> a page titled "Number Calculator"; a green "Result" bar with the computed value shown ' +
  'underneath it (the example screenshot shows 12); a multi-line text box labelled <code>X =</code> (example value 7); ' +
  'a multi-line text box labelled <code>Y =</code> (example value 5); the caption "Click the buttons below to calculate"; ' +
  'and six buttons: <b>X + Y</b>, <b>X &minus; Y</b>, <b>X &times; Y</b>, <b>X / Y</b>, <b>X^Y</b>, <b>MOD</b>.</p>' +
  '<ul>' +
  '<li><i>X</i>: input field. Acceptable formats include: integers, decimal, or the E-notation form of scientific notation, i.e. 23E18, 3.5e19, etc.</li>' +
  '<li><i>Y</i>: input field. Acceptable formats include: integers, decimal, or the E-notation form of scientific notation, i.e. 23E18, 3.5e19, etc.</li>' +
  '<li>When the user clicks buttons:<ul>' +
  '<li>If "X" is invalid, Message Box will be shown "Please provide a valid X value!".</li>' +
  '<li>If "Y" is invalid, Message Box will be shown "Please provide a valid Y value!".</li>' +
  '<li>If the user clicks the "X + Y" button: the system displays the results of the ("X" + "Y") expression value in "Result".</li>' +
  '<li>If the user clicks the "X - Y" button: the system displays the results of the ("X" &minus; "Y") expression value in "Result".</li>' +
  '<li>If the user clicks the "X &times; Y" button: the system displays the results of the ("X" &times; "Y") expression value in "Result".</li>' +
  '<li>If the user clicks the "X / Y" button: if "Y" = 0, Message Box will be shown "Please provide a non-zero Y value!". Otherwise the system displays the results of the ("X" / "Y") expression value in "Result".</li>' +
  '<li>If the user clicks the "X ^ Y" button: if "Y" is not a integer, Message Box will be shown "Please provide a integer as Y value!". Otherwise the system displays the results of the ("X" ^ "Y") expression value in "Result".</li>' +
  '<li>If the user clicks the "MOD" button: if "X" is not a positive integer, Message Box will be shown "Please provide a positive integer as X value!". Similar validation for the "Y" text box. Otherwise the system displays the results of the ("X" MOD "Y") expression value in "Result".</li>' +
  '</ul></li></ul>';

const Q3_SPEC_VI =
  '<p><b>Mô tả chức năng:</b> Chức năng này dùng để tính giá trị của các biểu thức dựa trên X và Y.</p>' +
  '<p><b>Bố cục màn hình:</b> trang có tiêu đề "Number Calculator"; một thanh xanh lá "Result" với giá trị tính được ' +
  'hiện ngay bên dưới (ảnh minh họa trong đề hiện số 12); một ô nhập nhiều dòng nhãn <code>X =</code> (giá trị ví dụ 7); ' +
  'một ô nhập nhiều dòng nhãn <code>Y =</code> (giá trị ví dụ 5); dòng chú thích "Click the buttons below to calculate"; ' +
  'và sáu nút: <b>X + Y</b>, <b>X &minus; Y</b>, <b>X &times; Y</b>, <b>X / Y</b>, <b>X^Y</b>, <b>MOD</b>.</p>' +
  '<ul>' +
  '<li><i>X</i>: ô nhập. Định dạng chấp nhận gồm: số nguyên, số thập phân, hoặc dạng E của ký hiệu khoa học, ví dụ 23E18, 3.5e19, v.v.</li>' +
  '<li><i>Y</i>: ô nhập. Định dạng chấp nhận gồm: số nguyên, số thập phân, hoặc dạng E của ký hiệu khoa học, ví dụ 23E18, 3.5e19, v.v.</li>' +
  '<li>Khi người dùng bấm các nút:<ul>' +
  '<li>Nếu "X" không hợp lệ, hiện hộp thoại "Please provide a valid X value!".</li>' +
  '<li>Nếu "Y" không hợp lệ, hiện hộp thoại "Please provide a valid Y value!".</li>' +
  '<li>Nếu bấm nút "X + Y": hệ thống hiện giá trị của biểu thức ("X" + "Y") ở ô "Result".</li>' +
  '<li>Nếu bấm nút "X - Y": hệ thống hiện giá trị của biểu thức ("X" &minus; "Y") ở ô "Result".</li>' +
  '<li>Nếu bấm nút "X &times; Y": hệ thống hiện giá trị của biểu thức ("X" &times; "Y") ở ô "Result".</li>' +
  '<li>Nếu bấm nút "X / Y": nếu "Y" = 0, hiện hộp thoại "Please provide a non-zero Y value!". Ngược lại hệ thống hiện giá trị của biểu thức ("X" / "Y") ở ô "Result".</li>' +
  '<li>Nếu bấm nút "X ^ Y": nếu "Y" không phải số nguyên, hiện hộp thoại "Please provide a integer as Y value!". Ngược lại hệ thống hiện giá trị của biểu thức ("X" ^ "Y") ở ô "Result".</li>' +
  '<li>Nếu bấm nút "MOD": nếu "X" không phải số nguyên dương, hiện hộp thoại "Please provide a positive integer as X value!". Kiểm tra tương tự cho ô "Y". Ngược lại hệ thống hiện giá trị của biểu thức ("X" MOD "Y") ở ô "Result".</li>' +
  '</ul></li></ul>';

const Q3_PROMPT_EN =
  '<p><b>Question 3 (4 points)</b></p>' +
  '<p>You are assigned to do the functional (black-box) test for the <b>Number Calculator</b> function. Write test ' +
  'cases for this function with the content described below. <i>(Use question 3 template.)</i></p>' +
  Q3_SPEC_EN +
  '<p><b>Answer format (Q3 sheet of the template):</b> one row per test case with the columns <i>ID</i>, ' +
  '<i>Test Case Description</i>, <i>Pre-Condition</i>, <i>Test Case Procedure</i>, <i>Expected Output</i>, ' +
  '<i>Result</i>, <i>Test date</i>, <i>Note</i>.</p>';

const Q3_PROMPT_VI =
  '<p><b>Câu 3 (4 điểm)</b></p>' +
  '<p>Bạn được giao thực hiện kiểm thử chức năng (hộp đen) cho chức năng <b>Number Calculator</b>. Hãy viết các ' +
  'test case cho chức năng này với nội dung mô tả dưới đây. <i>(Dùng template câu 3.)</i></p>' +
  Q3_SPEC_VI +
  '<p><b>Định dạng trả lời (sheet Q3 của template):</b> mỗi test case một dòng với các cột <i>ID</i>, ' +
  '<i>Test Case Description</i>, <i>Pre-Condition</i>, <i>Test Case Procedure</i>, <i>Expected Output</i>, ' +
  '<i>Result</i>, <i>Test date</i>, <i>Note</i>.</p>';

// Mỗi ca: [id, mô tả EN, mô tả VI, X, Y, nút, kết quả mong đợi EN, kết quả mong đợi VI]
// Cột "các bước" được sinh riêng cho từng ngôn ngữ từ X/Y/nút.
const P = (lang, x, y, btn) =>
  lang === 'en'
    ? `1. Input X = ${x}<br/>2. Input Y = ${y}<br/>3. Click the ${btn} button`
    : `1. Nhập X = ${x}<br/>2. Nhập Y = ${y}<br/>3. Bấm nút ${btn}`;
const MSG = (m) => `Message Box displays "${m}"`;
const MSGV = (m) => `Hộp thoại hiện "${m}"`;
const RES = (v) => `"Result" displays <b>${v}</b>`;
const RESV = (v) => `Ô "Result" hiện <b>${v}</b>`;

const Q3_CASES = [
  ['TC001', 'Addition with valid integers', 'Phép cộng với hai số nguyên hợp lệ', '7', '5', 'X + Y', RES('12'), RESV('12')],
  ['TC002', 'Subtraction with valid integers', 'Phép trừ với hai số nguyên hợp lệ', '7', '5', 'X &minus; Y', RES('2'), RESV('2')],
  ['TC003', 'Multiplication with valid integers', 'Phép nhân với hai số nguyên hợp lệ', '7', '5', 'X &times; Y', RES('35'), RESV('35')],
  ['TC004', 'Division with an exact integer result', 'Phép chia hết, kết quả là số nguyên', '10', '2', 'X / Y', RES('5'), RESV('5')],
  ['TC005', 'Power with a valid integer exponent', 'Lũy thừa với số mũ nguyên dương hợp lệ', '2', '3', 'X^Y', RES('8'), RESV('8')],
  ['TC006', 'Modulus with two positive integers', 'Phép chia lấy dư với hai số nguyên dương', '10', '3', 'MOD', RES('1'), RESV('1')],
  ['TC007', 'Addition accepts the decimal format', 'Phép cộng chấp nhận định dạng số thập phân ở cả hai ô', '3.5', '1.25', 'X + Y', RES('4.75'), RESV('4.75')],
  ['TC008', 'Addition accepts the E-notation format', 'Phép cộng chấp nhận định dạng E (ký hiệu khoa học) ở cả hai ô', '23E18', '3.5e19', 'X + Y', RES('5.8e19 (= 2.3e19 + 3.5e19)'), RESV('5.8e19 (= 2.3e19 + 3.5e19)')],
  ['TC009', 'Multiplication mixing decimal and E-notation', 'Phép nhân trộn định dạng thập phân và dạng E trong cùng một phép tính', '2E3', '0.5', 'X &times; Y', RES('1000'), RESV('1000')],
  ['TC010', 'Subtraction producing a negative result', 'Phép trừ cho kết quả âm — phải hiển thị đúng, không bị coi là lỗi', '5', '7', 'X &minus; Y', RES('-2'), RESV('-2')],
  ['TC011', 'Division by zero is blocked', 'Chia cho 0 bị chặn — luật Y = 0 của nút X / Y', '7', '0', 'X / Y', `${MSG('Please provide a non-zero Y value!')}; "Result" is not updated`, `${MSGV('Please provide a non-zero Y value!')}; ô "Result" KHÔNG được cập nhật`],
  ['TC012', 'Division with a fractional result', 'Phép chia không hết, kết quả là số thập phân', '7', '2', 'X / Y', RES('3.5'), RESV('3.5')],
  ['TC013', 'Division with X = 0', 'Phép chia với X = 0 — chỉ Y mới bị cấm bằng 0', '0', '5', 'X / Y', RES('0'), RESV('0')],
  ['TC014', 'Power with a non-integer exponent is blocked', 'Lũy thừa với số mũ không nguyên bị chặn — luật của nút X^Y', '2', '3.5', 'X^Y', `${MSG('Please provide a integer as Y value!')}; "Result" is not updated`, `${MSGV('Please provide a integer as Y value!')}; ô "Result" KHÔNG được cập nhật`],
  ['TC015', 'Power with exponent 0', 'Lũy thừa với số mũ 0 — biên; 0 là số nguyên nên phải được chấp nhận', '7', '0', 'X^Y', RES('1'), RESV('1')],
  ['TC016', 'Power with a negative integer exponent', 'Lũy thừa với số mũ nguyên ÂM — vẫn là số nguyên nên phải được chấp nhận', '2', '-2', 'X^Y', RES('0.25'), RESV('0.25')],
  ['TC017', 'MOD rejects a negative X', 'MOD từ chối X âm — luật "X phải là số nguyên dương"', '-5', '3', 'MOD', `${MSG('Please provide a positive integer as X value!')}; "Result" is not updated`, `${MSGV('Please provide a positive integer as X value!')}; ô "Result" KHÔNG được cập nhật`],
  ['TC018', 'MOD rejects a decimal X', 'MOD từ chối X thập phân — giá trị này hợp lệ với các nút khác nhưng không hợp lệ với MOD', '10.5', '3', 'MOD', MSG('Please provide a positive integer as X value!'), MSGV('Please provide a positive integer as X value!')],
  ['TC019', 'MOD rejects X = 0', 'MOD từ chối X = 0 — biên; 0 là số nguyên nhưng KHÔNG dương', '0', '3', 'MOD', MSG('Please provide a positive integer as X value!'), MSGV('Please provide a positive integer as X value!')],
  ['TC020', 'MOD rejects Y = 0', 'MOD từ chối Y = 0 — luật "kiểm tra tương tự" áp lên ô Y', '10', '0', 'MOD', MSG('Please provide a positive integer as Y value!'), MSGV('Please provide a positive integer as Y value!')],
  ['TC021', 'MOD rejects a negative Y', 'MOD từ chối Y là số nguyên âm', '10', '-3', 'MOD', MSG('Please provide a positive integer as Y value!'), MSGV('Please provide a positive integer as Y value!')],
  ['TC022', 'MOD at the lowest valid boundary', 'MOD tại biên hợp lệ nhỏ nhất: X = 1, Y = 1', '1', '1', 'MOD', RES('0'), RESV('0')],
  ['TC023', 'Non-numeric X is rejected', 'Ô X chứa chữ, không phải số — bị từ chối', 'abc', '5', 'X + Y', MSG('Please provide a valid X value!'), MSGV('Please provide a valid X value!')],
  ['TC024', 'Empty X is rejected', 'Ô X bỏ trống — bị từ chối', '(empty)', '5', 'X &minus; Y', MSG('Please provide a valid X value!'), MSGV('Please provide a valid X value!')],
  ['TC025', 'Non-numeric Y is rejected', 'Ô Y chứa ký hiệu, không phải số — bị từ chối', '5', '#@!', 'X &times; Y', MSG('Please provide a valid Y value!'), MSGV('Please provide a valid Y value!')],
  ['TC026', 'Malformed E-notation is rejected', 'Chuỗi gần giống dạng E nhưng cụt số mũ — bị từ chối', '3.5e', '2', 'X + Y', MSG('Please provide a valid X value!'), MSGV('Please provide a valid X value!')],
  ['TC027', 'Both X and Y invalid — X is reported first', 'Cả hai ô đều sai — kiểm thứ tự báo lỗi (giả định: kiểm X trước)', 'abc', 'xyz', 'X + Y', `${MSG('Please provide a valid X value!')} first; the Y message appears only after X is corrected`, `${MSGV('Please provide a valid X value!')} trước; thông báo về Y chỉ xuất hiện sau khi X đã sửa đúng`],
];

const q3Table = (lang) =>
  table(
    lang === 'en'
      ? ['ID', 'Test Case Description', 'Pre-Condition', 'Test Case Procedure', 'Expected Output']
      : ['ID', 'Mô tả test case', 'Điều kiện trước', 'Các bước thực hiện', 'Kết quả mong đợi'],
    Q3_CASES.map((c) => [
      c[0],
      lang === 'en' ? c[1] : c[2],
      lang === 'en' ? 'The Number Calculator screen is open' : 'Màn hình Number Calculator đang mở',
      P(lang, c[3], c[4], c[5]),
      lang === 'en' ? c[6] : c[7],
    ]),
  );

const Q3_SOL_EN =
  '<p><b>Assumptions.</b> (1) The three accepted input formats &mdash; integer, decimal and E-notation &mdash; are the equivalence class "valid"; anything else (letters, symbols, an empty box, a truncated exponent such as <code>3.5e</code>) is the class "invalid". (2) The paper does not say which box is validated first when both are wrong, so TC027 states the assumption that X is checked before Y; a candidate who assumes the opposite order is equally correct as long as the assumption is written down. (3) The paper does not specify rounding or display precision for decimal and E-notation results, so expected outputs are given as exact mathematical values. (4) The message strings are copied verbatim from the specification, including its own grammatical slip "a integer".</p>' +
  '<p><b>Design technique.</b> Equivalence Partitioning across the three valid formats and the invalid class, plus Boundary Value Analysis on every threshold the specification names: <code>Y = 0</code> for division, integer-vs-non-integer for the exponent, and the positive-integer boundary <code>X = 0</code> / <code>X = 1</code> for MOD. Every one of the six buttons gets at least one passing case, and every error rule in the specification gets its own case with the exact message text.</p>' +
  '<p><b>27 black-box test cases:</b></p>' +
  q3Table('en') +
  '<p><b>Coverage note.</b> TC001&ndash;TC006 cover the happy path of all six buttons. TC007&ndash;TC010 cover the accepted input formats (decimal, E-notation, mixed) and a negative result. TC011&ndash;TC013 cover the division rules, TC014&ndash;TC016 the exponent rule, TC017&ndash;TC022 the MOD positive-integer rule on both boxes including its <code>0</code> / <code>1</code> boundary, and TC023&ndash;TC027 the two generic "invalid value" messages. Every message string named in the specification is asserted at least once.</p>' +
  '<p><b>Two errors in the answer template shipped with this paper.</b> Its sample TC008 tests "10 MOD 3" and gives the expected output as 12; the correct value is <b>1</b>. Its sample TC009 tests MOD with Y = 0 and expects "Please provide a non-zero Y value!", but that message belongs to the <b>X / Y</b> button &mdash; the MOD button\'s own rule requires a positive integer, so the correct expected message is "Please provide a positive integer as Y value!". Both are corrected above (TC006 and TC020).</p>';

const Q3_SOL_VI =
  '<p><b>Giả định.</b> (1) Ba định dạng đầu vào được chấp nhận &mdash; số nguyên, số thập phân và dạng E &mdash; là lớp tương đương "hợp lệ"; mọi thứ khác (chữ cái, ký hiệu, ô trống, số mũ cụt như <code>3.5e</code>) thuộc lớp "không hợp lệ". (2) Đề không nói ô nào được kiểm trước khi cả hai đều sai, nên TC027 nêu rõ giả định là kiểm X trước Y; thí sinh giả định ngược lại cũng đúng, miễn là viết giả định ra. (3) Đề không quy định cách làm tròn hay số chữ số hiển thị cho kết quả thập phân và dạng E, nên kết quả mong đợi được ghi bằng giá trị toán học chính xác. (4) Các chuỗi thông báo được chép nguyên văn từ đề, kể cả lỗi ngữ pháp "a integer" của chính đề.</p>' +
  '<p><b>Kỹ thuật thiết kế.</b> Phân vùng tương đương (EP) trên ba định dạng hợp lệ và lớp không hợp lệ, cộng với Phân tích giá trị biên (BVA) trên mọi ngưỡng mà đề nêu tên: <code>Y = 0</code> cho phép chia, nguyên-hay-không-nguyên cho số mũ, và biên số nguyên dương <code>X = 0</code> / <code>X = 1</code> cho MOD. Cả sáu nút đều có ít nhất một ca chạy đúng, và mỗi luật báo lỗi trong đề đều có một ca riêng khẳng định đúng chuỗi thông báo.</p>' +
  '<p><b>27 test case hộp đen:</b></p>' +
  q3Table('vi') +
  '<p><b>Ghi chú độ bao phủ.</b> TC001&ndash;TC006 phủ đường thành công của cả sáu nút. TC007&ndash;TC010 phủ các định dạng đầu vào được chấp nhận (thập phân, dạng E, trộn) và kết quả âm. TC011&ndash;TC013 phủ luật của phép chia, TC014&ndash;TC016 phủ luật số mũ, TC017&ndash;TC022 phủ luật số nguyên dương của MOD trên cả hai ô kể cả biên <code>0</code> / <code>1</code>, còn TC023&ndash;TC027 phủ hai thông báo "giá trị không hợp lệ" chung. Mọi chuỗi thông báo mà đề nêu tên đều được khẳng định ít nhất một lần.</p>' +
  '<p><b>Hai lỗi trong file template đi kèm đề này.</b> Ca mẫu TC008 của nó kiểm "10 MOD 3" và ghi kết quả mong đợi là 12; giá trị đúng là <b>1</b>. Ca mẫu TC009 của nó kiểm MOD với Y = 0 và mong đợi "Please provide a non-zero Y value!", nhưng thông báo đó thuộc về nút <b>X / Y</b> &mdash; luật của riêng nút MOD đòi số nguyên dương, nên thông báo mong đợi đúng phải là "Please provide a positive integer as Y value!". Cả hai đã được sửa ở trên (TC006 và TC020).</p>';

/* ═══════════════════════════════ lắp deck ═══════════════════════════════ */

const ml = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const INSTRUCTIONS = ml(
  '<p><b>How to take this practical exam.</b></p><ol>' +
  '<li>This is a real FPTU <b>Practical Exam</b> for <b>Software Testing</b> (SU 2024, Block 10W, PE2). It has three questions worth 3 + 3 + 4 = 10 points.</li>' +
  '<li>Answer each question <b>in writing</b> (English) in the answer box. The original paper is answered in an Excel template with one sheet per question, so present your answer in the same shape: Q1 an issue list (Issue No / Description / Line / Detail), Q2 a UTCID grid of unit test cases, Q3 a test-case table (ID / Description / Pre-Condition / Procedure / Expected Output).</li>' +
  '<li>Question 2 shows the function as a flowchart. Read the decisions off the chart; you do not need to redraw it.</li>' +
  '<li>When you submit, AI grades each answer against a <b>rubric</b> and a reference solution, then shows a bilingual model answer.</li></ol>',
  '<p><b>Cách làm bài thi thực hành.</b></p><ol>' +
  '<li>Đây là đề <b>thi thực hành (PE)</b> thật của FPTU môn <b>Software Testing</b> (SU 2024, Block 10W, PE2). Đề gồm ba câu, thang 3 + 3 + 4 = 10 điểm.</li>' +
  '<li>Trả lời mỗi câu <b>bằng chữ</b> (tiếng Anh) trong ô trả lời. Đề gốc làm bài trong file Excel mẫu, mỗi câu một sheet, nên hãy trình bày theo đúng dạng đó: Câu 1 là danh sách lỗi (Issue No / Description / Line / Detail), Câu 2 là lưới UTCID các ca kiểm thử đơn vị, Câu 3 là bảng test case (ID / Mô tả / Điều kiện trước / Các bước / Kết quả mong đợi).</li>' +
  '<li>Câu 2 mô tả hàm bằng lưu đồ. Hãy đọc các quyết định từ lưu đồ; không cần vẽ lại.</li>' +
  '<li>Khi nộp, AI chấm từng câu theo <b>rubric</b> và một đáp án mẫu, rồi hiện đáp án mẫu song ngữ.</li></ol>',
);

const deck = {
  course: { courseCode: 'SWT301' },
  exams: [
    {
      kind: 'PE',
      peType: 'WRITE',
      code: 'PE22-SU2024B10W',
      title:
        'SWT301 — Practical Exam PE22 (SU2024 Block 10W PE2)|||SWT301 — Thi thực hành PE22 (SU2024 Block 10W PE2)',
      description:
        'Software Testing PE (WRITE): Java code review, minimum unit tests for 100% statement + decision coverage, and black-box test design. AI-graded.|||Đề PE Kiểm thử (viết): review code Java, thiết kế bộ unit test tối thiểu đạt 100% bao phủ câu lệnh + quyết định, và thiết kế test hộp đen. Chấm bằng AI.',
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 5,
      source: 'FUOverflow',
      instructions: INSTRUCTIONS,
      isPublished: true,
      questions: [
        {
          kind: 'WRITE',
          points: 3,
          prompt: ml(Q1_PROMPT_EN, Q1_PROMPT_VI),
          sampleSolution: ml(Q1_SOL_EN, Q1_SOL_VI),
          rubric: [
            {
              id: 'c1',
              criterion:
                'Finds at least six distinct, real issues, each with a correct line number (using the paper\'s own 1-23 numbering) and a description that says what is wrong, not just what the line contains.|||Tìm được ít nhất sáu lỗi khác nhau và có thật, mỗi lỗi kèm số dòng đúng (theo cách đánh số 1-23 của chính đề) và mô tả nói rõ SAI Ở ĐÂU, không chỉ chép lại nội dung dòng đó.',
              weight: 1,
              maxScore: 1.5,
            },
            {
              id: 'c2',
              criterion:
                'Correctly separates the compile error from the logical defects: the undeclared variable `remainder` (line 5) is identified as a compile error, and the four logic bugs on lines 11, 12, 13, 15 and 16 (wrong counter direction, originalNumber not restored, inverted loop condition, * instead of %, -= instead of +=) are all found.|||Phân biệt đúng lỗi biên dịch với lỗi logic: biến `remainder` chưa khai báo (dòng 5) được chỉ ra là lỗi biên dịch, và tìm đủ các lỗi logic ở dòng 11, 12, 13, 15 và 16 (đếm sai chiều, không khôi phục originalNumber, điều kiện vòng lặp bị đảo, dùng * thay vì %, dùng -= thay vì +=).',
              weight: 1,
              maxScore: 1,
            },
            {
              id: 'c3',
              criterion:
                'Supplies the corrected line (the "Detail" column) for each issue, and the set of fixes together actually produces a working Armstrong check rather than a partial repair.|||Đưa ra dòng mã đã sửa (cột "Detail") cho từng lỗi, và toàn bộ các bản sửa gộp lại thật sự cho ra một chương trình kiểm tra số Armstrong chạy đúng, chứ không phải chỉ vá một phần.',
              weight: 1,
              maxScore: 0.5,
            },
          ],
          imageUrl: IMG[1],
        },
        {
          kind: 'WRITE',
          points: 3,
          prompt: ml(Q2_PROMPT_EN, Q2_PROMPT_VI),
          sampleSolution: ml(Q2_SOL_EN, Q2_SOL_VI),
          rubric: [
            {
              id: 'c1',
              criterion:
                'Reads the flowchart correctly and states that the minimum is FOUR test cases, with a justification: the four mutually exclusive plb assignments force at least four, and the three-way pow chain fits inside those same four.|||Đọc đúng lưu đồ và khẳng định số ca tối thiểu là BỐN, kèm lập luận: bốn phép gán plb loại trừ lẫn nhau buộc phải có ít nhất bốn ca, còn chuỗi pow ba nhánh nhét vừa vào đúng bốn ca đó.',
              weight: 1,
              maxScore: 1,
            },
            {
              id: 'c2',
              criterion:
                'Gives four concrete test cases with values for sal, roe and nod, and the correct expected return value for each, computed as sal * (plb + pow) — e.g. with sal = 1000: 1300, 1500, 1500, 1000. Equivalent data (any positive sal, any nod >= 5 for the roe = D case) is accepted.|||Đưa ra bốn ca cụ thể với giá trị sal, roe, nod, và giá trị trả về mong đợi đúng cho từng ca, tính theo sal * (plb + pow) — ví dụ với sal = 1000: 1300, 1500, 1500, 1000. Chấp nhận dữ liệu tương đương (sal dương bất kỳ, nod >= 5 bất kỳ cho ca roe = D).',
              weight: 1,
              maxScore: 1.5,
            },
            {
              id: 'c3',
              criterion:
                'Proves the coverage rather than asserting it: shows all eight statements executed and shows each of the five decisions (roe = A, roe = B, roe = C, nod < 2, nod < 5) taking BOTH the true and the false outcome.|||Chứng minh độ bao phủ chứ không chỉ tuyên bố suông: chỉ ra cả tám câu lệnh đều được chạy, và cả năm quyết định (roe = A, roe = B, roe = C, nod < 2, nod < 5) đều đi qua CẢ hai nhánh đúng và sai.',
              weight: 1,
              maxScore: 0.5,
            },
          ],
          imageUrl: IMG[2],
        },
        {
          kind: 'WRITE',
          points: 4,
          prompt: ml(Q3_PROMPT_EN, Q3_PROMPT_VI),
          sampleSolution: ml(Q3_SOL_EN, Q3_SOL_VI),
          rubric: [
            {
              id: 'c1',
              criterion:
                'Covers the happy path of all six buttons (X+Y, X-Y, X*Y, X/Y, X^Y, MOD) with concrete input data and arithmetically correct expected results in the "Result" area.|||Phủ đường thành công của cả sáu nút (X+Y, X-Y, X*Y, X/Y, X^Y, MOD) với dữ liệu đầu vào cụ thể và kết quả mong đợi đúng về số học ở vùng "Result".',
              weight: 1,
              maxScore: 1.5,
            },
            {
              id: 'c2',
              criterion:
                'Covers every validation rule in the specification with the exact message text: invalid X, invalid Y, division by zero, non-integer exponent, and the MOD positive-integer rule applied to BOTH X and Y (not the division message).|||Phủ mọi luật kiểm tra trong đề với đúng nguyên văn thông báo: X không hợp lệ, Y không hợp lệ, chia cho 0, số mũ không nguyên, và luật số nguyên dương của MOD áp cho CẢ X lẫn Y (không phải thông báo của phép chia).',
              weight: 1,
              maxScore: 1.5,
            },
            {
              id: 'c3',
              criterion:
                'Applies black-box design visibly: equivalence partitioning across the three accepted formats (integer, decimal, E-notation) versus invalid input, and boundary values (Y = 0 for division, exponent 0 and negative integers, X = 0 and X = 1 for MOD). Each case has an ID, a pre-condition, reproducible steps and a single unambiguous expected output.|||Áp dụng kỹ thuật hộp đen thấy rõ: phân vùng tương đương trên ba định dạng được chấp nhận (số nguyên, thập phân, dạng E) so với đầu vào không hợp lệ, và giá trị biên (Y = 0 cho phép chia, số mũ 0 và số mũ nguyên âm, X = 0 và X = 1 cho MOD). Mỗi ca có ID, điều kiện trước, các bước lặp lại được và một kết quả mong đợi duy nhất, không mơ hồ.',
              weight: 1,
              maxScore: 1,
            },
          ],
          imageUrl: IMG[3],
        },
      ],
    },
  ],
};

/* ─────────────────────────────── tự kiểm tra ────────────────────────────── */
const errs = [];
const ex = deck.exams[0];
const sum = ex.questions.reduce((a, q) => a + q.points, 0);
if (sum !== ex.totalPoints) errs.push(`tổng points ${sum} ≠ totalPoints ${ex.totalPoints}`);
ex.questions.forEach((q, i) => {
  const r = q.rubric.reduce((a, c) => a + c.maxScore, 0);
  if (Math.abs(r - q.points) > 1e-9) errs.push(`Q${i + 1}: rubric ${r} ≠ points ${q.points}`);
});
// mỗi trường song ngữ đúng MỘT dấu ||| — instructions/prompt/sampleSolution dùng
// ml-en/ml-vi nên phải có ĐÚNG KHÔNG dấu nào.
const one = (label, s) => {
  const n = (s.match(/\|\|\|/g) || []).length;
  if (n !== 1) errs.push(`${label}: có ${n} dấu ||| (phải đúng 1)`);
};
const none = (label, s) => {
  const n = (s.match(/\|\|\|/g) || []).length;
  if (n !== 0) errs.push(`${label}: có ${n} dấu ||| (phải 0, dùng ml-en/ml-vi)`);
};
one('title', ex.title);
one('description', ex.description);
none('instructions', ex.instructions);
ex.questions.forEach((q, i) => {
  none(`Q${i + 1}.prompt`, q.prompt);
  none(`Q${i + 1}.sampleSolution`, q.sampleSolution);
  q.rubric.forEach((c) => one(`Q${i + 1}.rubric.${c.id}`, c.criterion));
  for (const [f, v] of [['prompt', q.prompt], ['sampleSolution', q.sampleSolution]]) {
    if (!v.includes('<div class="ml-en">') || !v.includes('<div class="ml-vi">'))
      errs.push(`Q${i + 1}.${f}: thiếu khối ml-en/ml-vi`);
  }
});
// cấm markdown trong mọi trường text
const MD = /(^|[^\w`])(\*\*|##+\s|```|^\s*[-*]\s)/m;
const walk = (o, p = '') => {
  if (typeof o === 'string') { if (MD.test(o)) errs.push(`${p}: nghi có markdown`); return; }
  if (Array.isArray(o)) return o.forEach((v, i) => walk(v, `${p}[${i}]`));
  if (o && typeof o === 'object') return Object.entries(o).forEach(([k, v]) => walk(v, p ? `${p}.${k}` : k));
};
walk(deck);
if (errs.length) { console.error('✗ tự kiểm tra HỎNG:\n  - ' + errs.join('\n  - ')); process.exit(1); }

fs.writeFileSync(OUT, `export default ${JSON.stringify(deck, null, 2)};\n`, 'utf8');
console.log(`✓ ${path.relative(process.cwd(), OUT)}`);
console.log(`  ${ex.questions.length} câu · ${ex.questions.map((q) => q.points).join(' + ')} = ${sum}/${ex.totalPoints} điểm`);
console.log(`  ảnh: ${ex.questions.filter((q) => q.imageUrl).length}/${ex.questions.length}`);
