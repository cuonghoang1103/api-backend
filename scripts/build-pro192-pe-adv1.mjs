/**
 * build-pro192-pe-adv1.mjs — sinh content/exams/PRO192-PE-ADV1.mjs.
 *
 * KHÁC các đề PE khác trong repo: đây KHÔNG phải đề thi thật được chép lại
 * (source: 'SAMPLE', không phải 'REAL'). Đây là đề LUYỆN TẬP NÂNG CAO tự soạn,
 * bổ sung cho 11 đề PE thật, đào sâu hơn về OOP để bắc cầu sang LAB211 (môn lab
 * Java OOP kỳ 3): lớp trừu tượng, đa hình, ngoại lệ checked tự định nghĩa ném
 * từ tầng nghiệp vụ, thiết kế phân tầng entity/validation, và tính đúng ở các
 * ca biên.
 *
 * Vì không có "đề gốc" để đối chiếu, phương pháp kiểm chứng là CHẠY THẬT:
 * mọi expectedOutput dưới đây được CHỤP LẠI từ stdout thật của `java Main`
 * (javac + java, JDK 21, --release 8 cho bytecode đóng gói), KHÔNG suy đoán
 * từ việc đọc code. Mỗi câu có >= 2 kịch bản (thành công + kích hoạt ngoại lệ).
 *
 * Hai cái bẫy Java đã kiểm bằng cách chạy CẢ bản sai lẫn bản đúng:
 *   1. Sai số dấu phẩy động: `getArea() * (1 - percent/100.0)` in ra
 *      6.000000000000001 trong khi `getArea() * (100 - percent) / 100.0`
 *      in ra 6.0 (rectangle 4x5, percent=70). Q1 TC2 in RAW double nên bẫy
 *      này NHÌN THẤY ĐƯỢC và chấm được (nếu bọc %.2f thì cả hai đều ra "6.00",
 *      đã sweep 1600 cặp (w,h,percent): 0 trường hợp lệch sau khi format).
 *   2. ConcurrentModificationException: xoá phần tử bằng list.remove(s) trong
 *      vòng for-each ném CME thật (đã chạy) — lời giải mẫu dùng Iterator.remove().
 *
 * Given materials: đóng gói từ scaffold NetBeans sạch, mỗi Qn CHỈ chứa .class
 * (Main.class + các lớp sinh viên KHÔNG phải viết), tuyệt đối không có .java.
 * Đã sanity-check: chép lời giải .java vào Qn/src rồi javac+java Main chạy
 * đúng y hệt bản chạy từ source, sau đó xoá đi trước khi zip.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRO192-PE-ADV1.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/PRO192-PE-ADV1.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const ATTACHMENT_URL = 'https://media.cuongthai.com/files/exam-attachments/PRO192/PE-ADV1-Given.zip';

function table(rows) {
  return `<table class="uml-table"><tbody>${rows.map((r) => `<tr><td>${r}</td></tr>`).join('')}</tbody></table>`;
}

// ───────────────────────── verified reference sources ─────────────────────────
// Mọi file dưới đây đã biên dịch + chạy thật; output chụp lại nằm ở expectedOutput.

const SRC_EXCEPTION = `public class InvalidShapeException extends Exception {

    public InvalidShapeException(String message) {
        super(message);
    }
}`;

const SRC_SHAPE = `public abstract class Shape {

    private String code;
    private String name;

    public Shape(String code, String name) throws InvalidShapeException {
        if (code == null || code.trim().isEmpty()) {
            throw new InvalidShapeException("Invalid Shape: code must not be blank");
        }
        this.code = code.trim().toUpperCase();
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public abstract double getArea();

    public abstract double getPerimeter();

    public String describe() {
        return getCode() + "|" + getName() + "|"
                + String.format("%.2f", getArea()) + "|"
                + String.format("%.2f", getPerimeter());
    }

    public double areaAfterShrink(int percent) {
        return getArea() * (100 - percent) / 100.0;
    }
}`;

const SRC_RECTANGLE = `public class Rectangle extends Shape {

    private double width;
    private double height;

    public Rectangle(String code, double width, double height) throws InvalidShapeException {
        super(code, "Rectangle");
        if (width <= 0 || height <= 0) {
            throw new InvalidShapeException("Invalid Rectangle [" + getCode() + "]: width and height must be > 0");
        }
        this.width = width;
        this.height = height;
    }

    public double getWidth() {
        return width;
    }

    public double getHeight() {
        return height;
    }

    @Override
    public double getArea() {
        return width * height;
    }

    @Override
    public double getPerimeter() {
        return 2 * (width + height);
    }
}`;

const SRC_CIRCLE = `public class Circle extends Shape {

    private double radius;

    public Circle(String code, double radius) throws InvalidShapeException {
        super(code, "Circle");
        if (radius <= 0) {
            throw new InvalidShapeException("Invalid Circle [" + getCode() + "]: radius must be > 0");
        }
        this.radius = radius;
    }

    public double getRadius() {
        return radius;
    }

    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }

    @Override
    public double getPerimeter() {
        return 2 * Math.PI * radius;
    }
}`;

const SRC_TRIANGLE = `public class Triangle extends Shape {

    private double a;
    private double b;
    private double c;

    public Triangle(String code, double a, double b, double c) throws InvalidShapeException {
        super(code, "Triangle");
        if (a <= 0 || b <= 0 || c <= 0) {
            throw new InvalidShapeException("Invalid Triangle [" + getCode() + "]: sides must be > 0");
        }
        if (a + b <= c || a + c <= b || b + c <= a) {
            throw new InvalidShapeException("Invalid Triangle [" + getCode() + "]: sides do not form a triangle");
        }
        this.a = a;
        this.b = b;
        this.c = c;
    }

    @Override
    public double getArea() {
        double s = (a + b + c) / 2.0;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }

    @Override
    public double getPerimeter() {
        return a + b + c;
    }
}`;

const SRC_MANAGER = `import java.util.ArrayList;
import java.util.List;

public class ShapeManager {

    private List<Shape> list;

    public ShapeManager() {
        list = new ArrayList<Shape>();
    }

    public List<Shape> getList() {
        return list;
    }

    public int size() {
        return list.size();
    }

    private Shape createShape(String kind, String code, double d1, double d2, double d3)
            throws InvalidShapeException {
        String k = (kind == null) ? "" : kind.trim().toUpperCase();
        if (k.equals("RECT")) {
            return new Rectangle(code, d1, d2);
        }
        if (k.equals("CIRCLE")) {
            return new Circle(code, d1);
        }
        if (k.equals("TRI")) {
            return new Triangle(code, d1, d2, d3);
        }
        throw new InvalidShapeException("Unknown kind: " + kind);
    }

    public String addShape(String kind, String code, double d1, double d2, double d3) {
        try {
            Shape s = createShape(kind, code, d1, d2, d3);
            list.add(s);
            return "ADDED " + s.getCode();
        } catch (InvalidShapeException e) {
            return "FAILED " + code + ": " + e.getMessage();
        }
    }

    public double getTotalArea() {
        double sum = 0;
        for (Shape s : list) {
            sum += s.getArea();
        }
        return sum;
    }

    public Shape getLargestByArea() {
        if (list.isEmpty()) {
            return null;
        }
        Shape max = list.get(0);
        for (Shape s : list) {
            if (s.getArea() > max.getArea()) {
                max = s;
            }
        }
        return max;
    }
}`;

const SRC_FILTER = `import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ShapeFilter {

    public static List<Shape> filterByMinArea(List<Shape> list, double minArea) {
        List<Shape> result = new ArrayList<Shape>();
        for (Shape s : list) {
            if (s.getArea() >= minArea) {
                result.add(s);
            }
        }
        return result;
    }

    public static int removeSmallerThan(List<Shape> list, double minArea) {
        int count = 0;
        Iterator<Shape> it = list.iterator();
        while (it.hasNext()) {
            Shape s = it.next();
            if (s.getArea() < minArea) {
                it.remove();
                count++;
            }
        }
        return count;
    }
}`;

// ───────────────────────────── instructions ─────────────────────────────
const instructions = ML(
  `<p><strong>PRO192 PE INSTRUCTIONS — ADVANCED PRACTICE PAPER</strong></p>
   <p><strong>Read this first:</strong> this is <em>not</em> a real FPTU exam paper. It is supplementary practice written in-house to go deeper into OOP than the standard PE papers do, aimed at students heading into <strong>LAB211</strong>. Treat it exactly like the real thing while you practise — same rules, same time pressure — but do not expect to meet these exact questions in an official PE.</p>
   <ol>
     <li>Software required: NetBeans 13 or later, JDK 8, Notepad, Command Prompt, WinRAR/WinZip. Students are ONLY allowed to use their own study materials (sample code, program examples) stored on their own computer.</li>
     <li>Create a folder to save the given projects (e.g. PRO_given), download the given materials into it. Open NetBeans, open the given Qx project, then complete it according to the exam requirements. Do NOT delete or edit given files, or create a java file with the same name as a given file.</li>
     <li>Before submission: run "Clean and Build Project" (Shift+F11); for each question create two sub-folders <strong>run</strong> and <strong>src</strong>, copy the built <code>Qx.jar</code> into <strong>run</strong> and the entire project source into <strong>src</strong>.</li>
     <li>Do NOT use accented Vietnamese in code comments. Do NOT change the names of the folders/files specified in the exam. All .java source files use the NetBeans default package.</li>
     <li><strong>Q2, Q3 and Q4 ship extra compiled classes</strong> (<code>Shape.class</code>, <code>InvalidShapeException.class</code>, and the subclasses) — reuse them as-is, do not re-create those files. Only write the class(es) each question asks for.</li>
   </ol>
   <p>This exam room cannot run NetBeans/JDK in the browser, so you type each class directly into the code box below and it is graded by AI against the rubric — but the "given materials" download above is a REAL NetBeans project set (with the compiled <code>Main.class</code> harness) so you can build &amp; run it for real on your own machine exactly like an actual PE, and cross-check your output against the samples shown.</p>`,
  `<p><strong>HƯỚNG DẪN PE PRO192 — ĐỀ LUYỆN TẬP NÂNG CAO</strong></p>
   <p><strong>Đọc kỹ trước:</strong> đây <em>không phải</em> đề thi thật của FPTU. Đây là đề luyện tập bổ sung do đội ngũ tự soạn, đào sâu OOP hơn các đề PE chuẩn, dành cho sinh viên chuẩn bị vào <strong>LAB211</strong>. Hãy làm nghiêm túc như thi thật — cùng luật, cùng áp lực thời gian — nhưng đừng kỳ vọng gặp đúng các câu này trong kỳ PE chính thức.</p>
   <ol>
     <li>Yêu cầu phần mềm: NetBeans 13 trở lên, JDK 8, Notepad, Command Prompt, WinRAR/WinZip. Sinh viên CHỈ được dùng tài liệu học tập (mã mẫu, ví dụ chương trình) lưu trên máy tính của mình.</li>
     <li>Tạo một thư mục chứa các project given (vd PRO_given), tải given materials vào đó. Mở NetBeans, mở project Qx tương ứng, hoàn thành theo yêu cầu đề bài. KHÔNG xoá/sửa file given, KHÔNG tạo file java trùng tên với file given.</li>
     <li>Trước khi nộp: chạy "Clean and Build Project" (Shift+F11); với mỗi câu tạo 2 thư mục con <strong>run</strong> và <strong>src</strong>, chép file <code>Qx.jar</code> đã build vào <strong>run</strong>, chép toàn bộ mã nguồn project vào <strong>src</strong>.</li>
     <li>KHÔNG gõ tiếng Việt có dấu trong comment code. KHÔNG đổi tên các thư mục/file đã quy định trong đề. Mọi file nguồn .java dùng package mặc định của NetBeans.</li>
     <li><strong>Q2, Q3, Q4 có kèm sẵn các lớp đã biên dịch</strong> (<code>Shape.class</code>, <code>InvalidShapeException.class</code> và các lớp con) — dùng lại nguyên trạng, KHÔNG tạo lại các file đó. Chỉ viết đúng (các) lớp mà đề yêu cầu.</li>
   </ol>
   <p>Phòng thi web không chạy được NetBeans/JDK trực tiếp trên trình duyệt, nên bạn gõ thẳng từng class vào ô mã bên dưới và được AI chấm theo tiêu chí — nhưng file "given materials" tải ở trên là bộ project NetBeans THẬT (kèm harness <code>Main.class</code> đã biên dịch sẵn) để bạn build &amp; chạy thật trên máy mình y hệt bài thi thật, và tự đối chiếu kết quả với các mẫu bên dưới.</p>`,
);

// ═══════════════════════════════ Q1 (2 marks) ═══════════════════════════════
const q1PromptEn = `<p><strong>(2 marks)</strong> Write <strong>three</strong> classes: a custom checked exception, an abstract base class, and one concrete subclass.</p>
<p>1. Class <strong>InvalidShapeException</strong> — a <strong>checked</strong> exception (it must extend <code>Exception</code>, NOT <code>RuntimeException</code>), with a constructor taking a message and passing it to the superclass.</p>
<p>2. Abstract class <strong>Shape</strong>:</p>
${table([
  '-code: String<br/>-name: String',
  '+Shape(code: String, name: String) throws InvalidShapeException<br/>+getCode(): String<br/>+getName(): String<br/>+getArea(): double {abstract}<br/>+getPerimeter(): double {abstract}<br/>+describe(): String<br/>+areaAfterShrink(percent: int): double',
])}
<ul>
  <li><code>Shape(code, name)</code> — if <code>code</code> is null, empty, or only spaces, <strong>throw</strong> <code>InvalidShapeException</code> with the message exactly: <code>Invalid Shape: code must not be blank</code>. Otherwise store <code>code</code> <strong>trimmed and in UPPERCASE</code>, and store <code>name</code> as given.</li>
  <li><code>getArea()</code>, <code>getPerimeter()</code> — <strong>abstract</strong>, no body here.</li>
  <li><code>describe()</code> — concrete, returns <code>code|name|area|perimeter</code> where area and perimeter are formatted to <strong>2 decimal places</strong>. Separator is the <code>|</code> character, no spaces. It must obtain area/perimeter by calling the abstract methods.</li>
  <li><code>areaAfterShrink(percent)</code> — concrete, returns the area reduced by <code>percent</code> per cent (e.g. percent=70 leaves 30% of the area). It must call <code>getArea()</code>. <em>Order your arithmetic so the result is exact for whole-number areas</em> — the test prints the raw <code>double</code>, not a rounded string.</li>
</ul>
<p>3. Class <strong>Rectangle</strong> extends <strong>Shape</strong>:</p>
${table([
  '-width: double<br/>-height: double',
  '+Rectangle(code: String, width: double, height: double) throws InvalidShapeException<br/>+getWidth(): double<br/>+getHeight(): double<br/>+getArea(): double<br/>+getPerimeter(): double',
])}
<ul>
  <li>The constructor calls the superclass constructor with name <code>"Rectangle"</code>, then, if <code>width</code> or <code>height</code> is <code>&lt;= 0</code>, throws <code>InvalidShapeException</code> with the message exactly: <code>Invalid Rectangle [CODE]: width and height must be &gt; 0</code> (CODE = the stored, uppercased code).</li>
  <li><code>getArea()</code> = width * height. <code>getPerimeter()</code> = 2 * (width + height).</li>
</ul>`;

const q1PromptVi = `<p><strong>(2 điểm)</strong> Viết <strong>ba</strong> lớp: một ngoại lệ checked tự định nghĩa, một lớp trừu tượng, và một lớp con cụ thể.</p>
<p>1. Lớp <strong>InvalidShapeException</strong> — ngoại lệ <strong>checked</strong> (BẮT BUỘC kế thừa <code>Exception</code>, KHÔNG phải <code>RuntimeException</code>), có constructor nhận message và truyền lên lớp cha.</p>
<p>2. Lớp trừu tượng <strong>Shape</strong>:</p>
${table([
  '-code: String<br/>-name: String',
  '+Shape(code: String, name: String) throws InvalidShapeException<br/>+getCode(): String<br/>+getName(): String<br/>+getArea(): double {abstract}<br/>+getPerimeter(): double {abstract}<br/>+describe(): String<br/>+areaAfterShrink(percent: int): double',
])}
<ul>
  <li><code>Shape(code, name)</code> — nếu <code>code</code> null, rỗng, hoặc chỉ toàn khoảng trắng thì <strong>ném</strong> <code>InvalidShapeException</code> với message đúng là: <code>Invalid Shape: code must not be blank</code>. Ngược lại lưu <code>code</code> đã <strong>cắt khoảng trắng và viết HOA</strong>, lưu <code>name</code> nguyên trạng.</li>
  <li><code>getArea()</code>, <code>getPerimeter()</code> — <strong>trừu tượng</strong>, không có thân hàm ở đây.</li>
  <li><code>describe()</code> — cụ thể, trả về <code>code|name|area|perimeter</code>, trong đó area và perimeter định dạng <strong>2 chữ số thập phân</strong>. Dấu phân tách là ký tự <code>|</code>, không có khoảng trắng. Bắt buộc lấy area/perimeter bằng cách gọi các hàm trừu tượng.</li>
  <li><code>areaAfterShrink(percent)</code> — cụ thể, trả về diện tích sau khi giảm <code>percent</code> phần trăm (vd percent=70 thì còn lại 30% diện tích). Bắt buộc gọi <code>getArea()</code>. <em>Hãy sắp xếp thứ tự phép tính sao cho kết quả chính xác tuyệt đối với diện tích là số nguyên</em> — bài test in ra <code>double</code> THÔ, không phải chuỗi đã làm tròn.</li>
</ul>
<p>3. Lớp <strong>Rectangle</strong> kế thừa <strong>Shape</strong>:</p>
${table([
  '-width: double<br/>-height: double',
  '+Rectangle(code: String, width: double, height: double) throws InvalidShapeException<br/>+getWidth(): double<br/>+getHeight(): double<br/>+getArea(): double<br/>+getPerimeter(): double',
])}
<ul>
  <li>Constructor gọi constructor lớp cha với name là <code>"Rectangle"</code>, sau đó nếu <code>width</code> hoặc <code>height</code> <code>&lt;= 0</code> thì ném <code>InvalidShapeException</code> với message đúng là: <code>Invalid Rectangle [CODE]: width and height must be &gt; 0</code> (CODE = code đã lưu, viết HOA).</li>
  <li><code>getArea()</code> = width * height. <code>getPerimeter()</code> = 2 * (width + height).</li>
</ul>`;

const q1ExplainEn = `<p><strong>Why <code>describe()</code> works at all.</strong> <code>Shape</code> has no idea how to compute an area — yet <code>describe()</code>, written once in the abstract class, prints the <em>right</em> area for every subclass ever written. That is the <strong>template method</strong> pattern: the superclass fixes the <em>algorithm</em> (the layout <code>code|name|area|perimeter</code>) and delegates the <em>varying step</em> to an abstract method. At runtime <code>getArea()</code> inside <code>describe()</code> is dispatched dynamically to the object's actual class. This is the single most important idea to carry into LAB211: write the shared skeleton once in the base class, and let subclasses fill in only what genuinely differs.</p>
<p><strong>Why the exception is checked.</strong> Extending <code>Exception</code> (not <code>RuntimeException</code>) forces every caller to acknowledge failure — the compiler will not let you ignore it. That is exactly what you want for <em>validation of external input</em>: bad data is an expected, recoverable business outcome, not a programming bug. Note the ripple effect: because <code>Shape</code>'s constructor declares <code>throws InvalidShapeException</code>, <code>Rectangle</code>'s constructor must declare it too, and the harness must wrap <code>new Rectangle(...)</code> in try/catch. A checked exception propagates through your whole design — that is a feature, not friction.</p>
<p><strong>The design decision: where does validation go?</strong> Note the ordering — <code>super(code, name)</code> must be the first statement, so the base class validates <code>code</code> <em>before</em> <code>Rectangle</code> validates its dimensions. If either check fails, the constructor never completes and the reference is never assigned: there is <strong>no partially-constructed Shape</strong> to leak into your list. Validating in a separate <code>validate()</code> method called after construction would break that guarantee — you would be able to create an invalid object and forget to check it. Constructor validation makes invalid objects <em>unrepresentable</em>.</p>
<p><strong>The floating-point trap in <code>areaAfterShrink()</code>.</strong> TC 2 prints the raw <code>double</code>, so arithmetic order is visible and graded. Both versions were compiled and run:</p>
<pre>getArea() * (100 - percent) / 100.0   -->  6.0                  (correct)
getArea() * (1 - percent / 100.0)     -->  6.000000000000001    (wrong)</pre>
<p>The second form computes <code>1 - 0.7 = 0.30000000000000004</code>, because 0.7 has no exact binary representation, then multiplies that error by 20. The first form keeps the numerator in exact integer-valued arithmetic (<code>20 * 30 = 600</code>) and divides only once, at the end. Rule of thumb: <strong>divide last, and divide once.</strong> (Had the harness printed <code>String.format("%.2f", ...)</code>, both forms would show <code>6.00</code> and the bug would hide — we swept 1600 width/height/percent combinations and found zero cases where rounding to 2 decimals exposes it. Rounding hides precision bugs; it does not fix them.)</p>
<p>Verified by compiling against the real given <code>Main.class</code> harness:</p>
<pre>Enter code: R01
Enter width: 4
Enter height: 5
Enter shrink percent: 70
Enter TC (1,2): 1
OUTPUT:
R01|Rectangle|20.00|18.00</pre>
<pre>Enter code: R01
Enter width: -4
Enter height: 5
Enter shrink percent: 70
Enter TC (1,2): 1
OUTPUT:
Invalid Rectangle [R01]: width and height must be &gt; 0</pre>`;

const q1ExplainVi = `<p><strong>Vì sao <code>describe()</code> chạy được.</strong> <code>Shape</code> hoàn toàn không biết tính diện tích thế nào — vậy mà <code>describe()</code>, chỉ viết MỘT lần ở lớp trừu tượng, lại in đúng diện tích cho MỌI lớp con sau này. Đó là mẫu <strong>template method</strong>: lớp cha cố định <em>thuật toán</em> (bố cục <code>code|name|area|perimeter</code>) và uỷ thác <em>bước thay đổi</em> cho hàm trừu tượng. Lúc chạy, lời gọi <code>getArea()</code> bên trong <code>describe()</code> được điều phối động tới đúng lớp thật của đối tượng. Đây là ý tưởng quan trọng nhất cần mang sang LAB211: viết bộ khung dùng chung MỘT lần ở lớp cha, để lớp con chỉ điền phần thực sự khác nhau.</p>
<p><strong>Vì sao ngoại lệ phải là checked.</strong> Kế thừa <code>Exception</code> (không phải <code>RuntimeException</code>) BUỘC mọi nơi gọi phải thừa nhận khả năng thất bại — trình biên dịch không cho bạn phớt lờ. Đó chính xác là điều bạn muốn khi <em>kiểm tra dữ liệu từ bên ngoài</em>: dữ liệu sai là kết quả nghiệp vụ có thể lường trước và khắc phục được, không phải lỗi lập trình. Chú ý hiệu ứng lan toả: vì constructor của <code>Shape</code> khai báo <code>throws InvalidShapeException</code> nên constructor của <code>Rectangle</code> cũng phải khai báo, và harness bắt buộc bọc <code>new Rectangle(...)</code> trong try/catch. Ngoại lệ checked lan khắp thiết kế của bạn — đó là tính năng, không phải phiền toái.</p>
<p><strong>Quyết định thiết kế: đặt phần kiểm tra ở đâu?</strong> Hãy để ý thứ tự — <code>super(code, name)</code> bắt buộc là câu lệnh đầu tiên, nên lớp cha kiểm tra <code>code</code> <em>trước</em> khi <code>Rectangle</code> kiểm tra kích thước. Nếu một trong hai phép kiểm thất bại, constructor không bao giờ hoàn tất và biến tham chiếu không bao giờ được gán: <strong>không tồn tại đối tượng Shape dựng dở</strong> để lọt vào danh sách của bạn. Nếu kiểm tra ở một hàm <code>validate()</code> riêng gọi sau khi dựng xong thì mất luôn bảo đảm đó — bạn sẽ tạo được đối tượng không hợp lệ rồi quên kiểm. Kiểm tra trong constructor khiến đối tượng sai <em>không thể tồn tại</em>.</p>
<p><strong>Bẫy dấu phẩy động trong <code>areaAfterShrink()</code>.</strong> TC 2 in <code>double</code> THÔ, nên thứ tự phép tính hiện ra và bị chấm. Cả hai bản đều đã biên dịch và chạy thật:</p>
<pre>getArea() * (100 - percent) / 100.0   --&gt;  6.0                  (đúng)
getArea() * (1 - percent / 100.0)     --&gt;  6.000000000000001    (sai)</pre>
<p>Bản thứ hai tính <code>1 - 0.7 = 0.30000000000000004</code> vì 0.7 không biểu diễn chính xác được ở hệ nhị phân, rồi nhân sai số đó với 20. Bản thứ nhất giữ tử số ở phép tính nguyên chính xác (<code>20 * 30 = 600</code>) và chỉ chia MỘT lần ở cuối. Quy tắc bỏ túi: <strong>chia sau cùng, và chỉ chia một lần.</strong> (Nếu harness in <code>String.format("%.2f", ...)</code> thì cả hai đều ra <code>6.00</code> và lỗi bị che mất — chúng tôi đã quét 1600 tổ hợp width/height/percent và KHÔNG có trường hợp nào làm tròn 2 chữ số lại lộ ra lỗi. Làm tròn CHE lỗi sai số, chứ không SỬA nó.)</p>
<p>Đã kiểm bằng cách biên dịch cùng harness <code>Main.class</code> given thật:</p>
<pre>Enter code: R01
Enter width: 4
Enter height: 5
Enter shrink percent: 70
Enter TC (1,2): 1
OUTPUT:
R01|Rectangle|20.00|18.00</pre>
<pre>Enter code: R01
Enter width: -4
Enter height: 5
Enter shrink percent: 70
Enter TC (1,2): 1
OUTPUT:
Invalid Rectangle [R01]: width and height must be &gt; 0</pre>`;

const q1 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q1PromptEn, q1PromptVi),
  starterCode: `public class InvalidShapeException extends Exception {
    // TODO: constructor taking a message
}

abstract class Shape {
    private String code;
    private String name;

    public Shape(String code, String name) throws InvalidShapeException {
        // TODO: reject blank code, else store trimmed UPPERCASE code + name
    }

    // TODO: getCode(), getName()

    // TODO: abstract getArea(), abstract getPerimeter()

    public String describe() {
        // TODO: code|name|area|perimeter  (2 decimals, no spaces)
        return null;
    }

    public double areaAfterShrink(int percent) {
        // TODO: area reduced by percent -- mind the arithmetic ORDER,
        // the test prints the raw double
        return 0;
    }
}

class Rectangle extends Shape {
    private double width;
    private double height;

    public Rectangle(String code, double width, double height) throws InvalidShapeException {
        // TODO: super(code, "Rectangle"); then validate width/height > 0
    }

    // TODO: getWidth(), getHeight(), getArea(), getPerimeter()
}`,
  sampleSolution: `${SRC_EXCEPTION}\n\n${SRC_SHAPE}\n\n${SRC_RECTANGLE}`,
  expectedOutput:
`Sample run 1 (TC 1 - describe(), code=R01 width=4 height=5 percent=70):
OUTPUT:
R01|Rectangle|20.00|18.00

Sample run 2 (TC 2 - areaAfterShrink(70), same shape, RAW double):
OUTPUT:
6.0

Sample run 3 (TC 1 - invalid width=-4, height=5):
OUTPUT:
Invalid Rectangle [R01]: width and height must be > 0

Sample run 4 (TC 1 - blank code "  ", width=4 height=5):
OUTPUT:
Invalid Shape: code must not be blank`,
  explanation: B(q1ExplainEn, q1ExplainVi),
  rubric: [
    { id: 'checked_exception', criterion: B('InvalidShapeException extends Exception (checked), NOT RuntimeException, and passes the message to super.', 'InvalidShapeException kế thừa Exception (checked), KHÔNG phải RuntimeException, và truyền message lên super.'), weight: 1, maxScore: 0.5 },
    { id: 'abstract_template', criterion: B('Shape is abstract, declares getArea()/getPerimeter() abstract, and describe() builds "code|name|area|perimeter" with 2 decimals by CALLING those abstract methods.', 'Shape là abstract, khai báo getArea()/getPerimeter() trừu tượng, và describe() dựng "code|name|area|perimeter" với 2 chữ số thập phân bằng cách GỌI các hàm trừu tượng đó.'), weight: 1, maxScore: 0.5 },
    { id: 'ctor_validation', criterion: B('Blank/null code throws with the exact message; Rectangle calls super first then rejects width/height <= 0 with the exact bracketed message using the uppercased code.', 'Code rỗng/null ném đúng message; Rectangle gọi super trước rồi từ chối width/height <= 0 với đúng message có ngoặc vuông và code viết HOA.'), weight: 1, maxScore: 0.6 },
    { id: 'shrink_precision', criterion: B('areaAfterShrink() calls getArea() and orders the arithmetic so a 4x5 rectangle at percent=70 prints exactly 6.0, not 6.000000000000001.', 'areaAfterShrink() gọi getArea() và sắp thứ tự phép tính sao cho hình 4x5 với percent=70 in đúng 6.0, không phải 6.000000000000001.'), weight: 1, maxScore: 0.4 },
  ],
};

// ═══════════════════════════════ Q2 (3 marks) ═══════════════════════════════
const q2GivenNote = `<p>The following classes are <strong>already compiled and supplied as byte code</strong> in the given project, so you use them directly and must NOT re-create these files:</p>
<pre>${SRC_EXCEPTION}

public abstract class Shape {
    public Shape(String code, String name) throws InvalidShapeException  // rejects blank code
    public String getCode()          // stored trimmed + UPPERCASE
    public String getName()
    public abstract double getArea()
    public abstract double getPerimeter()
    public String describe()                     // "code|name|area|perimeter", 2 decimals
    public double areaAfterShrink(int percent)   // area reduced by percent
}

public class Rectangle extends Shape { public Rectangle(String code, double width, double height) throws InvalidShapeException }</pre>`;

const q2PromptEn = `<p><strong>(3 marks)</strong> Write <strong>two</strong> concrete subclasses of the given abstract class <strong>Shape</strong>.</p>
${q2GivenNote}
<p>1. Class <strong>Circle</strong> extends <strong>Shape</strong>:</p>
${table([
  '-radius: double',
  '+Circle(code: String, radius: double) throws InvalidShapeException<br/>+getRadius(): double<br/>+getArea(): double<br/>+getPerimeter(): double',
])}
<ul>
  <li>Constructor passes name <code>"Circle"</code> to the superclass, then if <code>radius &lt;= 0</code> throws <code>InvalidShapeException</code> with the message exactly: <code>Invalid Circle [CODE]: radius must be &gt; 0</code>.</li>
  <li><code>getArea()</code> = &pi; * radius<sup>2</sup>, <code>getPerimeter()</code> = 2 * &pi; * radius. Use <code>Math.PI</code>.</li>
</ul>
<p>2. Class <strong>Triangle</strong> extends <strong>Shape</strong> (three sides):</p>
${table([
  '-a: double<br/>-b: double<br/>-c: double',
  '+Triangle(code: String, a: double, b: double, c: double) throws InvalidShapeException<br/>+getArea(): double<br/>+getPerimeter(): double',
])}
<ul>
  <li>Constructor passes name <code>"Triangle"</code> to the superclass, then validates <strong>in this order</strong>:
    <ol>
      <li>if any side is <code>&lt;= 0</code> → throw with message: <code>Invalid Triangle [CODE]: sides must be &gt; 0</code></li>
      <li>else if the sides violate the triangle inequality (the sum of any two sides is <code>&lt;=</code> the third) → throw with message: <code>Invalid Triangle [CODE]: sides do not form a triangle</code></li>
    </ol>
  </li>
  <li><code>getArea()</code> — use <strong>Heron's formula</strong>: with <code>s = (a+b+c)/2</code>, area = <code>sqrt(s(s-a)(s-b)(s-c))</code>.</li>
  <li><code>getPerimeter()</code> = a + b + c.</li>
</ul>
<p><em>The test harness stores your objects in a <code>Shape[]</code> array and calls <code>describe()</code> / <code>areaAfterShrink()</code> through the <strong>supertype reference</strong> — so you must genuinely OVERRIDE the abstract methods (same name, same parameter list, same return type), not overload them.</em></p>`;

const q2PromptVi = `<p><strong>(3 điểm)</strong> Viết <strong>hai</strong> lớp con cụ thể của lớp trừu tượng <strong>Shape</strong> đã cho.</p>
<p>Các lớp sau <strong>đã được biên dịch sẵn dạng byte code</strong> trong project given, bạn dùng thẳng và KHÔNG được tạo lại các file này:</p>
<pre>${SRC_EXCEPTION}

public abstract class Shape {
    public Shape(String code, String name) throws InvalidShapeException  // tu choi code rong
    public String getCode()          // luu dang trimmed + VIET HOA
    public String getName()
    public abstract double getArea()
    public abstract double getPerimeter()
    public String describe()                     // "code|name|area|perimeter", 2 chu so thap phan
    public double areaAfterShrink(int percent)   // dien tich sau khi giam percent
}

public class Rectangle extends Shape { public Rectangle(String code, double width, double height) throws InvalidShapeException }</pre>
<p>1. Lớp <strong>Circle</strong> kế thừa <strong>Shape</strong>:</p>
${table([
  '-radius: double',
  '+Circle(code: String, radius: double) throws InvalidShapeException<br/>+getRadius(): double<br/>+getArea(): double<br/>+getPerimeter(): double',
])}
<ul>
  <li>Constructor truyền name <code>"Circle"</code> lên lớp cha, sau đó nếu <code>radius &lt;= 0</code> thì ném <code>InvalidShapeException</code> với message đúng là: <code>Invalid Circle [CODE]: radius must be &gt; 0</code>.</li>
  <li><code>getArea()</code> = &pi; * radius<sup>2</sup>, <code>getPerimeter()</code> = 2 * &pi; * radius. Dùng <code>Math.PI</code>.</li>
</ul>
<p>2. Lớp <strong>Triangle</strong> kế thừa <strong>Shape</strong> (ba cạnh):</p>
${table([
  '-a: double<br/>-b: double<br/>-c: double',
  '+Triangle(code: String, a: double, b: double, c: double) throws InvalidShapeException<br/>+getArea(): double<br/>+getPerimeter(): double',
])}
<ul>
  <li>Constructor truyền name <code>"Triangle"</code> lên lớp cha, sau đó kiểm tra <strong>theo đúng thứ tự này</strong>:
    <ol>
      <li>nếu có cạnh nào <code>&lt;= 0</code> → ném với message: <code>Invalid Triangle [CODE]: sides must be &gt; 0</code></li>
      <li>ngược lại nếu các cạnh vi phạm bất đẳng thức tam giác (tổng hai cạnh bất kỳ <code>&lt;=</code> cạnh còn lại) → ném với message: <code>Invalid Triangle [CODE]: sides do not form a triangle</code></li>
    </ol>
  </li>
  <li><code>getArea()</code> — dùng <strong>công thức Heron</strong>: với <code>s = (a+b+c)/2</code>, diện tích = <code>sqrt(s(s-a)(s-b)(s-c))</code>.</li>
  <li><code>getPerimeter()</code> = a + b + c.</li>
</ul>
<p><em>Harness lưu các đối tượng của bạn trong mảng <code>Shape[]</code> và gọi <code>describe()</code> / <code>areaAfterShrink()</code> qua <strong>tham chiếu kiểu cha</strong> — nên bạn phải GHI ĐÈ (override) thật sự các hàm trừu tượng (trùng tên, trùng danh sách tham số, trùng kiểu trả về), không phải nạp chồng (overload).</em></p>`;

const q2ExplainEn = `<p><strong>What the <code>Shape[]</code> array proves.</strong> The harness declares <code>Shape[] arr</code> and fills it with a <code>Rectangle</code>, your <code>Circle</code> and your <code>Triangle</code>. The compiler only knows each slot is "some Shape"; it has no idea which. Yet <code>arr[i].describe()</code> prints a circle's area for the circle and Heron's area for the triangle. The method that runs is chosen at <strong>run time</strong> from the object's actual class, not at compile time from the reference type — this is <strong>dynamic dispatch</strong>, and it is what lets you add a fourth shape later without touching one line of the harness. That is the open/closed principle in practice, and it is the backbone of nearly every LAB211 assignment.</p>
<p><strong>Override vs overload — the trap.</strong> If you write <code>public double getArea(int precision)</code>, or misspell it <code>getarea()</code>, you have <em>overloaded</em> (or simply added) a method, not overridden the abstract one. The class then still has an unimplemented abstract method and <strong>will not compile</strong>. Always write <code>@Override</code>: it costs nothing and turns a silent logic error into a compile error. Overriding requires the same name, same parameter list, and a compatible return type — an overload differs in the parameter list and is resolved statically, so it would never be reached through a <code>Shape</code> reference anyway.</p>
<p><strong>Why validation order matters in Triangle.</strong> Sides <code>1, 2, 5</code> are all positive, so only the second check rejects them; sides <code>-1, 2, 5</code> fail the first check. Testing positivity first is not cosmetic — Heron's formula on a set that violates the inequality produces a negative value under the square root and <code>Math.sqrt</code> returns <code>NaN</code>, which silently poisons every later sum and comparison (<code>NaN</code> is not even equal to itself). <strong>Reject bad input at the boundary so the maths downstream can be trusted.</strong> Note also that 3-4-5 gives exactly <code>6.0</code> from <code>sqrt(36)</code> — an exact result you will rely on at the threshold boundary in Q4.</p>
<p>Verified by compiling against the real given <code>Main.class</code> harness (circle r=3, triangle 3-4-5, percent=25):</p>
<pre>OUTPUT:
R01|Rectangle|20.00|18.00
C01|Circle|28.27|18.85
T01|Triangle|6.00|12.00</pre>
<pre>OUTPUT:
Rectangle=15.00
Circle=21.21
Triangle=4.50</pre>
<p>and the two exception paths (radius <code>-2</code>, then sides <code>1 2 5</code>):</p>
<pre>OUTPUT:
Invalid Circle [C01]: radius must be &gt; 0</pre>
<pre>OUTPUT:
Invalid Triangle [T01]: sides do not form a triangle</pre>`;

const q2ExplainVi = `<p><strong>Mảng <code>Shape[]</code> chứng minh điều gì.</strong> Harness khai báo <code>Shape[] arr</code> rồi nhét vào đó một <code>Rectangle</code>, <code>Circle</code> và <code>Triangle</code> của bạn. Trình biên dịch chỉ biết mỗi ô là "một Shape nào đó", không hề biết là lớp nào. Vậy mà <code>arr[i].describe()</code> in ra diện tích hình tròn cho hình tròn và diện tích Heron cho tam giác. Hàm được chạy là hàm được chọn lúc <strong>chạy chương trình</strong> dựa trên lớp thật của đối tượng, chứ không phải lúc biên dịch dựa trên kiểu tham chiếu — đó là <strong>điều phối động</strong> (dynamic dispatch), và nhờ nó bạn có thể thêm hình thứ tư sau này mà KHÔNG sửa một dòng nào của harness. Đó là nguyên lý open/closed trong thực tế, và là xương sống của gần như mọi bài LAB211.</p>
<p><strong>Ghi đè và nạp chồng — cái bẫy.</strong> Nếu bạn viết <code>public double getArea(int precision)</code>, hoặc gõ nhầm thành <code>getarea()</code>, thì bạn đã <em>nạp chồng</em> (hoặc chỉ là thêm mới) một hàm, chứ không ghi đè hàm trừu tượng. Khi đó lớp vẫn còn hàm trừu tượng chưa cài đặt và <strong>sẽ không biên dịch được</strong>. Luôn viết <code>@Override</code>: không tốn gì cả mà biến một lỗi logic âm thầm thành lỗi biên dịch. Ghi đè đòi hỏi trùng tên, trùng danh sách tham số và kiểu trả về tương thích — nạp chồng thì khác danh sách tham số và được phân giải tĩnh, nên dù sao cũng không bao giờ được gọi tới qua tham chiếu <code>Shape</code>.</p>
<p><strong>Vì sao thứ tự kiểm tra trong Triangle lại quan trọng.</strong> Bộ cạnh <code>1, 2, 5</code> đều dương nên chỉ phép kiểm thứ hai loại được nó; bộ <code>-1, 2, 5</code> thì rớt ngay phép kiểm thứ nhất. Kiểm tính dương trước không phải để cho đẹp — công thức Heron áp lên bộ cạnh vi phạm bất đẳng thức sẽ cho giá trị ÂM dưới dấu căn, và <code>Math.sqrt</code> trả về <code>NaN</code>, thứ sẽ âm thầm đầu độc mọi phép cộng và so sánh về sau (<code>NaN</code> thậm chí không bằng chính nó). <strong>Hãy chặn dữ liệu sai ngay ở biên để phần tính toán phía sau đáng tin.</strong> Cũng lưu ý bộ 3-4-5 cho đúng <code>6.0</code> từ <code>sqrt(36)</code> — một kết quả chính xác tuyệt đối mà bạn sẽ dựa vào ở ca biên ngưỡng của Q4.</p>
<p>Đã kiểm bằng cách biên dịch cùng harness <code>Main.class</code> given thật (hình tròn r=3, tam giác 3-4-5, percent=25):</p>
<pre>OUTPUT:
R01|Rectangle|20.00|18.00
C01|Circle|28.27|18.85
T01|Triangle|6.00|12.00</pre>
<pre>OUTPUT:
Rectangle=15.00
Circle=21.21
Triangle=4.50</pre>
<p>và hai nhánh ngoại lệ (radius <code>-2</code>, rồi các cạnh <code>1 2 5</code>):</p>
<pre>OUTPUT:
Invalid Circle [C01]: radius must be &gt; 0</pre>
<pre>OUTPUT:
Invalid Triangle [T01]: sides do not form a triangle</pre>`;

const q2 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q2PromptEn, q2PromptVi),
  starterCode: `// GIVEN (already compiled in the project - do NOT re-create):
//   InvalidShapeException, Shape (abstract), Rectangle
// Shape API: getCode(), getName(), abstract getArea(), abstract getPerimeter(),
//            describe(), areaAfterShrink(int percent)
// Shape(String code, String name) throws InvalidShapeException

public class Circle extends Shape {
    private double radius;

    public Circle(String code, double radius) throws InvalidShapeException {
        // TODO: super(code, "Circle"); then reject radius <= 0
    }

    // TODO: getRadius()
    // TODO: @Override getArea()      -> Math.PI * radius * radius
    // TODO: @Override getPerimeter() -> 2 * Math.PI * radius
}

class Triangle extends Shape {
    private double a;
    private double b;
    private double c;

    public Triangle(String code, double a, double b, double c) throws InvalidShapeException {
        // TODO: super(code, "Triangle");
        // TODO: 1) any side <= 0        -> "sides must be > 0"
        // TODO: 2) triangle inequality  -> "sides do not form a triangle"
    }

    // TODO: @Override getArea()      -> Heron's formula
    // TODO: @Override getPerimeter() -> a + b + c
}`,
  sampleSolution: `${SRC_CIRCLE}\n\n${SRC_TRIANGLE}`,
  expectedOutput:
`Sample run 1 (TC 1 - describe() over Shape[], circle C01 r=3, triangle T01 3/4/5, percent=25):
OUTPUT:
R01|Rectangle|20.00|18.00
C01|Circle|28.27|18.85
T01|Triangle|6.00|12.00

Sample run 2 (TC 2 - areaAfterShrink(25) over Shape[], same data):
OUTPUT:
Rectangle=15.00
Circle=21.21
Triangle=4.50

Sample run 3 (TC 1 - invalid circle radius=-2):
OUTPUT:
Invalid Circle [C01]: radius must be > 0

Sample run 4 (TC 1 - invalid triangle sides 1/2/5):
OUTPUT:
Invalid Triangle [T01]: sides do not form a triangle`,
  explanation: B(q2ExplainEn, q2ExplainVi),
  rubric: [
    { id: 'circle', criterion: B('Circle extends Shape, passes "Circle" to super, rejects radius <= 0 with the exact message, and computes area/perimeter with Math.PI.', 'Circle kế thừa Shape, truyền "Circle" lên super, từ chối radius <= 0 với đúng message, tính area/perimeter bằng Math.PI.'), weight: 1, maxScore: 1 },
    { id: 'triangle', criterion: B("Triangle extends Shape, applies the two validations in the specified order with the exact messages, and uses Heron's formula for the area.", 'Triangle kế thừa Shape, áp dụng hai phép kiểm đúng thứ tự với đúng message, dùng công thức Heron cho diện tích.'), weight: 1, maxScore: 1.2 },
    { id: 'real_override', criterion: B('Both classes genuinely OVERRIDE getArea()/getPerimeter() (identical signatures, so calls through a Shape reference dispatch to them) rather than overloading, and re-declare throws InvalidShapeException on the constructors.', 'Cả hai lớp GHI ĐÈ thật sự getArea()/getPerimeter() (trùng chữ ký, nên gọi qua tham chiếu Shape sẽ điều phối đúng) chứ không nạp chồng, và khai báo lại throws InvalidShapeException ở constructor.'), weight: 1, maxScore: 0.8 },
  ],
};

// ═══════════════════════════════ Q3 (3 marks) ═══════════════════════════════
const q3PromptEn = `<p><strong>(3 marks)</strong> Write a manager class <strong>ShapeManager</strong> that owns a polymorphic list of shapes.</p>
<p><strong>Given (already compiled in the project, do NOT re-create):</strong> <code>InvalidShapeException</code>, <code>Shape</code> (abstract), <code>Rectangle(code, width, height)</code>, <code>Circle(code, radius)</code>, <code>Triangle(code, a, b, c)</code> — every constructor declares <code>throws InvalidShapeException</code>.</p>
${table([
  '-list: List&lt;Shape&gt;',
  '+ShapeManager()<br/>+getList(): List&lt;Shape&gt;<br/>+size(): int<br/>-createShape(kind: String, code: String, d1: double, d2: double, d3: double): Shape<br/>+addShape(kind: String, code: String, d1: double, d2: double, d3: double): String<br/>+getTotalArea(): double<br/>+getLargestByArea(): Shape',
])}
<ul>
  <li><code>ShapeManager()</code> — initialise the list to an empty <code>ArrayList&lt;Shape&gt;</code>.</li>
  <li><code>getList()</code> — return the list itself. <code>size()</code> — return the number of shapes stored.</li>
  <li><code>createShape(...)</code> — <strong>private factory</strong> that <strong>declares <code>throws InvalidShapeException</code></strong>. Compare <code>kind</code> ignoring case and surrounding spaces:
    <ul>
      <li><code>"RECT"</code> → <code>new Rectangle(code, d1, d2)</code></li>
      <li><code>"CIRCLE"</code> → <code>new Circle(code, d1)</code></li>
      <li><code>"TRI"</code> → <code>new Triangle(code, d1, d2, d3)</code></li>
      <li>anything else (including <code>null</code>) → <strong>throw</strong> <code>new InvalidShapeException("Unknown kind: " + kind)</code></li>
    </ul>
  </li>
  <li><code>addShape(...)</code> — calls <code>createShape(...)</code> inside a <strong>try/catch</strong>. It never propagates the exception:
    <ul>
      <li>on success: add the shape to the list and return <code>"ADDED " + shape.getCode()</code></li>
      <li>on <code>InvalidShapeException</code>: <strong>do not add anything</strong> (the list must not grow) and return <code>"FAILED " + code + ": " + e.getMessage()</code> — note this uses the <strong>raw</strong> <code>code</code> parameter, since no object exists to ask.</li>
    </ul>
  </li>
  <li><code>getTotalArea()</code> — iterate the list and return the sum of <code>getArea()</code> of every shape (called through the <code>Shape</code> supertype).</li>
  <li><code>getLargestByArea()</code> — return the shape with the greatest area, or <code>null</code> if the list is empty. Assume a single maximum.</li>
</ul>`;

const q3PromptVi = `<p><strong>(3 điểm)</strong> Viết lớp quản lý <strong>ShapeManager</strong> sở hữu một danh sách hình đa hình.</p>
<p><strong>Đã cho (biên dịch sẵn trong project, KHÔNG tạo lại):</strong> <code>InvalidShapeException</code>, <code>Shape</code> (trừu tượng), <code>Rectangle(code, width, height)</code>, <code>Circle(code, radius)</code>, <code>Triangle(code, a, b, c)</code> — mọi constructor đều khai báo <code>throws InvalidShapeException</code>.</p>
${table([
  '-list: List&lt;Shape&gt;',
  '+ShapeManager()<br/>+getList(): List&lt;Shape&gt;<br/>+size(): int<br/>-createShape(kind: String, code: String, d1: double, d2: double, d3: double): Shape<br/>+addShape(kind: String, code: String, d1: double, d2: double, d3: double): String<br/>+getTotalArea(): double<br/>+getLargestByArea(): Shape',
])}
<ul>
  <li><code>ShapeManager()</code> — khởi tạo list thành <code>ArrayList&lt;Shape&gt;</code> rỗng.</li>
  <li><code>getList()</code> — trả về chính list đó. <code>size()</code> — trả về số hình đang lưu.</li>
  <li><code>createShape(...)</code> — <strong>factory private</strong> có <strong>khai báo <code>throws InvalidShapeException</code></strong>. So sánh <code>kind</code> bỏ qua hoa/thường và khoảng trắng hai đầu:
    <ul>
      <li><code>"RECT"</code> → <code>new Rectangle(code, d1, d2)</code></li>
      <li><code>"CIRCLE"</code> → <code>new Circle(code, d1)</code></li>
      <li><code>"TRI"</code> → <code>new Triangle(code, d1, d2, d3)</code></li>
      <li>còn lại (kể cả <code>null</code>) → <strong>ném</strong> <code>new InvalidShapeException("Unknown kind: " + kind)</code></li>
    </ul>
  </li>
  <li><code>addShape(...)</code> — gọi <code>createShape(...)</code> bên trong <strong>try/catch</strong>. Hàm này KHÔNG bao giờ để ngoại lệ lan ra ngoài:
    <ul>
      <li>thành công: thêm hình vào list và trả về <code>"ADDED " + shape.getCode()</code></li>
      <li>gặp <code>InvalidShapeException</code>: <strong>không thêm gì cả</strong> (list không được phình ra) và trả về <code>"FAILED " + code + ": " + e.getMessage()</code> — chú ý dùng tham số <code>code</code> <strong>thô</strong>, vì không có đối tượng nào để hỏi.</li>
    </ul>
  </li>
  <li><code>getTotalArea()</code> — duyệt list và trả về tổng <code>getArea()</code> của mọi hình (gọi qua kiểu cha <code>Shape</code>).</li>
  <li><code>getLargestByArea()</code> — trả về hình có diện tích lớn nhất, hoặc <code>null</code> nếu list rỗng. Giả sử chỉ có một giá trị lớn nhất duy nhất.</li>
</ul>`;

const q3ExplainEn = `<p><strong>The design decision this question is really about: where do you catch?</strong> The exception is thrown by a <em>constructor</em>, which runs before any object exists — so the manager cannot "add the shape, then check it". The only place that can both build the object and decide what to do when building fails is a <strong>factory</strong>. That is why <code>createShape()</code> is separate from <code>addShape()</code>: <code>createShape()</code> is the <em>throwing</em> layer (it reports failure upward and stays ignorant of policy), and <code>addShape()</code> is the <em>handling</em> layer (it decides the policy: skip the bad item, keep going, report why). Splitting "detect" from "decide" is the layered design LAB211 grades you on.</p>
<p><strong>Why the list cannot grow on failure — and it is not because you were careful.</strong> <code>list.add(s)</code> sits <em>after</em> <code>createShape(...)</code> inside the <code>try</code>. When the constructor throws, control jumps straight to <code>catch</code> and the <code>add</code> line is never reached. The invariant "the list contains only valid shapes" is enforced by <em>control flow</em>, not by a promise. Contrast this with adding first and validating after: you would need a rollback, and rollbacks get forgotten. Sample run 2 proves it — five adds attempted, three succeed, <code>SIZE=3</code>.</p>
<p><strong>Why report the raw <code>code</code> parameter in the FAILED message.</strong> On the success path we use <code>shape.getCode()</code> (uppercased by <code>Shape</code>); on the failure path no object was ever constructed, so there is nothing to call <code>getCode()</code> on — the only identifier still available is the parameter you were handed. This is the everyday consequence of constructor validation, and the reason the manager must remember what it was <em>asked</em> to build, not just what it <em>did</em> build.</p>
<p><strong>Throwing your own exception from the business layer.</strong> The <code>"Unknown kind: HEXAGON"</code> path shows a checked exception raised by <em>your</em> logic rather than by a constructor, yet caught by the same <code>catch</code> block and reported in the same format. One exception type can represent a whole family of business failures — that uniformity is what makes the caller's error handling simple.</p>
<p><strong>On <code>getTotalArea()</code>.</strong> Accumulate into a <code>double</code> and let each <code>s.getArea()</code> dispatch polymorphically; the manager never asks what kind of shape it holds. Adding <code>20.0 + 28.274333882308138 + 6.0 + 6.0</code> gives <code>60.274333882308138</code>, printed by the harness as <code>60.27</code>. Note it never needs <code>instanceof</code> — if you find yourself writing <code>if (s instanceof Circle)</code> to compute an area, the abstraction has failed.</p>
<p>Verified by compiling against the real given <code>Main.class</code> harness. Seeded adds are R01 (4x5), C01 (r=3), T01 (3-4-5), an invalid C02 (r=-2), an unknown kind H01, then the shape you type in. With a valid <code>RECT R02 2 3</code>:</p>
<pre>OUTPUT:
ADDED R01
ADDED C01
ADDED T01
FAILED C02: Invalid Circle [C02]: radius must be &gt; 0
FAILED H01: Unknown kind: HEXAGON
ADDED R02
SIZE=4</pre>
<p>and with an invalid <code>TRI T02 1 2 5</code> — note <code>SIZE</code> drops to 3, the list did not grow:</p>
<pre>OUTPUT:
ADDED R01
ADDED C01
ADDED T01
FAILED C02: Invalid Circle [C02]: radius must be &gt; 0
FAILED H01: Unknown kind: HEXAGON
FAILED T02: Invalid Triangle [T02]: sides do not form a triangle
SIZE=3</pre>`;

const q3ExplainVi = `<p><strong>Quyết định thiết kế mà câu này thật sự nhắm tới: bắt ngoại lệ ở ĐÂU?</strong> Ngoại lệ được ném bởi <em>constructor</em>, tức chạy trước khi có bất kỳ đối tượng nào — nên manager không thể "thêm hình vào rồi kiểm tra sau". Nơi duy nhất vừa dựng được đối tượng vừa quyết định được phải làm gì khi dựng thất bại là một <strong>factory</strong>. Đó là lý do <code>createShape()</code> tách khỏi <code>addShape()</code>: <code>createShape()</code> là tầng <em>ném</em> (báo lỗi lên trên và không cần biết chính sách xử lý), còn <code>addShape()</code> là tầng <em>xử lý</em> (quyết định chính sách: bỏ qua món hỏng, chạy tiếp, báo lý do). Tách "phát hiện" khỏi "quyết định" chính là thiết kế phân tầng mà LAB211 chấm điểm.</p>
<p><strong>Vì sao list không thể phình ra khi lỗi — và không phải nhờ bạn cẩn thận.</strong> Dòng <code>list.add(s)</code> nằm <em>sau</em> <code>createShape(...)</code> bên trong khối <code>try</code>. Khi constructor ném, luồng điều khiển nhảy thẳng xuống <code>catch</code> và dòng <code>add</code> KHÔNG bao giờ được chạy tới. Bất biến "list chỉ chứa hình hợp lệ" được bảo đảm bằng <em>luồng điều khiển</em>, chứ không bằng lời hứa. Hãy so với cách thêm trước rồi kiểm tra sau: bạn sẽ phải rollback, mà rollback thì hay bị quên. Mẫu chạy số 2 chứng minh điều đó — thử thêm 5 lần, 3 lần thành công, <code>SIZE=3</code>.</p>
<p><strong>Vì sao message FAILED lại dùng tham số <code>code</code> thô.</strong> Ở nhánh thành công ta dùng <code>shape.getCode()</code> (đã được <code>Shape</code> viết hoa); ở nhánh thất bại thì chưa từng có đối tượng nào được dựng, nên không có gì để gọi <code>getCode()</code> lên cả — thứ định danh duy nhất còn lại là tham số bạn được truyền vào. Đây là hệ quả thường ngày của việc kiểm tra trong constructor, và là lý do manager phải nhớ nó được <em>yêu cầu</em> dựng cái gì, chứ không chỉ nhớ nó <em>đã dựng</em> được cái gì.</p>
<p><strong>Tự ném ngoại lệ của mình từ tầng nghiệp vụ.</strong> Nhánh <code>"Unknown kind: HEXAGON"</code> cho thấy một ngoại lệ checked được ném bởi logic của <em>bạn</em> chứ không phải bởi constructor, vậy mà vẫn được bắt bởi đúng khối <code>catch</code> đó và báo cáo theo đúng định dạng đó. Một kiểu ngoại lệ có thể đại diện cho cả một họ lỗi nghiệp vụ — chính sự đồng nhất ấy làm cho việc xử lý lỗi ở phía gọi trở nên đơn giản.</p>
<p><strong>Về <code>getTotalArea()</code>.</strong> Cộng dồn vào một biến <code>double</code> và để mỗi <code>s.getArea()</code> tự điều phối đa hình; manager không bao giờ hỏi nó đang giữ loại hình gì. Cộng <code>20.0 + 28.274333882308138 + 6.0 + 6.0</code> ra <code>60.274333882308138</code>, harness in thành <code>60.27</code>. Chú ý là hoàn toàn không cần <code>instanceof</code> — nếu bạn thấy mình đang viết <code>if (s instanceof Circle)</code> để tính diện tích thì lớp trừu tượng đã thất bại.</p>
<p>Đã kiểm bằng cách biên dịch cùng harness <code>Main.class</code> given thật. Các lần thêm sẵn là R01 (4x5), C01 (r=3), T01 (3-4-5), một C02 không hợp lệ (r=-2), một kind lạ H01, rồi tới hình bạn nhập vào. Với <code>RECT R02 2 3</code> hợp lệ:</p>
<pre>OUTPUT:
ADDED R01
ADDED C01
ADDED T01
FAILED C02: Invalid Circle [C02]: radius must be &gt; 0
FAILED H01: Unknown kind: HEXAGON
ADDED R02
SIZE=4</pre>
<p>và với <code>TRI T02 1 2 5</code> không hợp lệ — chú ý <code>SIZE</code> chỉ còn 3, list đã không phình ra:</p>
<pre>OUTPUT:
ADDED R01
ADDED C01
ADDED T01
FAILED C02: Invalid Circle [C02]: radius must be &gt; 0
FAILED H01: Unknown kind: HEXAGON
FAILED T02: Invalid Triangle [T02]: sides do not form a triangle
SIZE=3</pre>`;

const q3 = {
  kind: 'CODE', points: 3, language: 'java',
  prompt: B(q3PromptEn, q3PromptVi),
  starterCode: `import java.util.ArrayList;
import java.util.List;

// GIVEN (already compiled): InvalidShapeException, Shape (abstract),
//   Rectangle(code, width, height), Circle(code, radius), Triangle(code, a, b, c)
//   -- every constructor declares: throws InvalidShapeException

public class ShapeManager {

    private List<Shape> list;

    public ShapeManager() {
        // TODO: new ArrayList<Shape>()
    }

    public List<Shape> getList() {
        return null; // TODO
    }

    public int size() {
        return 0; // TODO
    }

    // TODO: private factory -- DECLARES throws InvalidShapeException.
    // "RECT"/"CIRCLE"/"TRI" (ignore case + spaces), anything else ->
    // throw new InvalidShapeException("Unknown kind: " + kind)
    private Shape createShape(String kind, String code, double d1, double d2, double d3)
            throws InvalidShapeException {
        return null;
    }

    // TODO: try { create + add + return "ADDED " + code }
    //       catch (InvalidShapeException e) { DO NOT add, return "FAILED ..." }
    public String addShape(String kind, String code, double d1, double d2, double d3) {
        return null;
    }

    public double getTotalArea() {
        return 0; // TODO: polymorphic sum of getArea()
    }

    public Shape getLargestByArea() {
        return null; // TODO: max by getArea(), null when empty
    }
}`,
  sampleSolution: SRC_MANAGER,
  expectedOutput:
`Sample run 1 (TC 1 - addShape() then size(), user adds a valid RECT R02 2 3):
OUTPUT:
ADDED R01
ADDED C01
ADDED T01
FAILED C02: Invalid Circle [C02]: radius must be > 0
FAILED H01: Unknown kind: HEXAGON
ADDED R02
SIZE=4

Sample run 2 (TC 1 - user adds an INVALID TRI T02 1 2 5; list must NOT grow):
OUTPUT:
ADDED R01
ADDED C01
ADDED T01
FAILED C02: Invalid Circle [C02]: radius must be > 0
FAILED H01: Unknown kind: HEXAGON
FAILED T02: Invalid Triangle [T02]: sides do not form a triangle
SIZE=3

Sample run 3 (TC 2 - getTotalArea() with R01, C01, T01, R02 in the list):
OUTPUT:
60.27

Sample run 4 (TC 3 - getLargestByArea() with the same four shapes):
OUTPUT:
C01|Circle|28.27|18.85`,
  explanation: B(q3ExplainEn, q3ExplainVi),
  rubric: [
    { id: 'factory_layer', criterion: B('A private createShape() that DECLARES throws InvalidShapeException maps kind (case-insensitive) to the right subclass and throws "Unknown kind: X" for anything else.', 'Hàm private createShape() có KHAI BÁO throws InvalidShapeException, ánh xạ kind (không phân biệt hoa/thường) sang đúng lớp con và ném "Unknown kind: X" cho phần còn lại.'), weight: 1, maxScore: 1 },
    { id: 'catch_no_growth', criterion: B('addShape() catches InvalidShapeException, returns "ADDED <CODE>" / "FAILED <code>: <message>", and the list does NOT grow on failure (add is inside try, after construction).', 'addShape() bắt InvalidShapeException, trả về "ADDED <CODE>" / "FAILED <code>: <message>", và list KHÔNG phình ra khi lỗi (lệnh add nằm trong try, sau khi dựng xong).'), weight: 1, maxScore: 1.2 },
    { id: 'polymorphic_aggregate', criterion: B('getTotalArea() sums getArea() through the Shape supertype and getLargestByArea() returns the max (null when empty) — no instanceof / type-checking.', 'getTotalArea() cộng getArea() qua kiểu cha Shape và getLargestByArea() trả về phần tử lớn nhất (null khi rỗng) — không dùng instanceof / kiểm tra kiểu.'), weight: 1, maxScore: 0.8 },
  ],
};

// ═══════════════════════════════ Q4 (2 marks) ═══════════════════════════════
const q4PromptEn = `<p><strong>(2 marks)</strong> Write a utility class <strong>ShapeFilter</strong> with two <strong>static</strong> methods that work on a polymorphic list.</p>
<p><strong>Given (already compiled in the project, do NOT re-create):</strong> <code>InvalidShapeException</code>, <code>Shape</code> (abstract), <code>Rectangle</code>, <code>Circle</code>, <code>Triangle</code>, <code>ShapeManager</code>.</p>
${table([
  '+filterByMinArea(list: List&lt;Shape&gt;, minArea: double): List&lt;Shape&gt; {static}<br/>+removeSmallerThan(list: List&lt;Shape&gt;, minArea: double): int {static}',
])}
<ul>
  <li><code>filterByMinArea(list, minArea)</code> — return a <strong>new</strong> <code>List&lt;Shape&gt;</code> holding every shape whose area is <strong>greater than or equal to</strong> <code>minArea</code>, keeping the original order. The shapes that qualify must be decided by calling <code>getArea()</code> through the <code>Shape</code> reference. <strong>The list passed in must not be modified.</strong></li>
  <li><code>removeSmallerThan(list, minArea)</code> — remove <strong>in place</strong>, from the list passed in, every shape whose area is <strong>strictly less than</strong> <code>minArea</code>, and return how many were removed. <em>Removing elements while iterating the same list is the trap here — do it in a way that cannot throw <code>ConcurrentModificationException</code>.</em></li>
</ul>
<p><em>Do not use <code>instanceof</code> or any type-checking: both methods must work for any future subclass of <code>Shape</code> without being changed.</em></p>`;

const q4PromptVi = `<p><strong>(2 điểm)</strong> Viết lớp tiện ích <strong>ShapeFilter</strong> gồm hai hàm <strong>static</strong> làm việc trên danh sách đa hình.</p>
<p><strong>Đã cho (biên dịch sẵn trong project, KHÔNG tạo lại):</strong> <code>InvalidShapeException</code>, <code>Shape</code> (trừu tượng), <code>Rectangle</code>, <code>Circle</code>, <code>Triangle</code>, <code>ShapeManager</code>.</p>
${table([
  '+filterByMinArea(list: List&lt;Shape&gt;, minArea: double): List&lt;Shape&gt; {static}<br/>+removeSmallerThan(list: List&lt;Shape&gt;, minArea: double): int {static}',
])}
<ul>
  <li><code>filterByMinArea(list, minArea)</code> — trả về một <code>List&lt;Shape&gt;</code> <strong>MỚI</strong> chứa mọi hình có diện tích <strong>lớn hơn hoặc bằng</strong> <code>minArea</code>, giữ nguyên thứ tự ban đầu. Việc hình nào được chọn phải quyết định bằng cách gọi <code>getArea()</code> qua tham chiếu <code>Shape</code>. <strong>Danh sách truyền vào KHÔNG được thay đổi.</strong></li>
  <li><code>removeSmallerThan(list, minArea)</code> — xoá <strong>tại chỗ</strong>, ngay trên danh sách truyền vào, mọi hình có diện tích <strong>nhỏ hơn hẳn</strong> <code>minArea</code>, và trả về số lượng đã xoá. <em>Xoá phần tử trong lúc đang duyệt chính danh sách đó là cái bẫy ở đây — hãy làm theo cách không thể ném <code>ConcurrentModificationException</code>.</em></li>
</ul>
<p><em>Không dùng <code>instanceof</code> hay bất kỳ phép kiểm tra kiểu nào: cả hai hàm phải chạy đúng với mọi lớp con của <code>Shape</code> trong tương lai mà không cần sửa lại.</em></p>`;

const q4ExplainEn = `<p><strong>Filtering without knowing the types.</strong> <code>filterByMinArea()</code> never asks what a shape <em>is</em>; it asks what its area <em>is</em>. Because <code>getArea()</code> is abstract on <code>Shape</code> and overridden by each subclass, one loop correctly filters rectangles, circles and triangles alike — and will filter a <code>Hexagon</code> written next year without a single edit. Had you written <code>if (s instanceof Circle) ... else if (s instanceof Rectangle) ...</code>, every new shape would force you back into this method. <strong>A chain of <code>instanceof</code> over a class hierarchy is almost always a polymorphism you failed to use.</strong> (<code>instanceof</code> is legitimate when you genuinely need something only one subtype offers — e.g. a report that prints radii — but never for behaviour the base type already declares.)</p>
<p><strong>Return a new list, or mutate in place — decide, then be consistent.</strong> The two methods deliberately sit on opposite sides of that choice. <code>filterByMinArea()</code> is a <em>query</em>: it builds a new <code>ArrayList</code> and leaves the caller's data untouched, which is why the harness prints <code>SOURCE SIZE=5</code> even after filtering down to 4. <code>removeSmallerThan()</code> is a <em>command</em>: it changes the caller's list and returns a count instead of a list. Mixing the two — a method that looks like a query but quietly mutates — is one of the most common sources of bugs in LAB211 assignments.</p>
<p><strong>The <code>ConcurrentModificationException</code> trap, confirmed by running it.</strong> The obvious way to write the second method is wrong:</p>
<pre>for (Shape s : list) {                 // WRONG - throws at run time
    if (s.getArea() &lt; minArea) list.remove(s);
}</pre>
<p>A for-each loop is a hidden <code>Iterator</code>. <code>ArrayList</code>'s iterator caches a <code>modCount</code> when it is created; <code>list.remove()</code> bumps that counter behind the iterator's back, so the very next <code>next()</code> detects the mismatch and throws. We compiled and ran exactly this version — it prints <code>EXCEPTION: java.util.ConcurrentModificationException</code> for both minArea=6 and minArea=20. It is a <em>fail-fast</em> guard, not bad luck: the iterator refuses to keep going rather than silently skip elements. The fix is to remove <em>through</em> the iterator, which updates its own bookkeeping:</p>
<pre>Iterator&lt;Shape&gt; it = list.iterator();
while (it.hasNext()) {
    Shape s = it.next();
    if (s.getArea() &lt; minArea) { it.remove(); count++; }   // safe
}</pre>
<p>(A downward-counting index loop, or <code>removeIf</code> on Java 8+, are equally correct. Iterating a <em>copy</em> while mutating the original also works. What never works is mutating the very list a for-each is walking.)</p>
<p><strong>Boundary behaviour is graded.</strong> <code>filterByMinArea</code> uses <code>&gt;=</code> and <code>removeSmallerThan</code> uses <code>&lt;</code>, so the two are exact complements: a shape whose area equals the threshold is kept by both. With minArea=6, T01 (Heron on 3-4-5 = exactly <code>6.0</code>) and R02 (2x3 = <code>6.0</code>) sit precisely on the boundary and are kept — a solution using <code>&gt;</code> would silently drop them. This only works because those areas are exact; had they arrived through sloppy floating-point arithmetic like the trap in Q1, the comparison could have flipped.</p>
<p>Verified by compiling against the real given <code>Main.class</code> harness. The fixed list is R01 (20.00), C01 (28.27), T01 (6.00), R02 (6.00), C02 (3.14). With minArea=6:</p>
<pre>OUTPUT:
R01|Rectangle|20.00|18.00
C01|Circle|28.27|18.85
T01|Triangle|6.00|12.00
R02|Rectangle|6.00|10.00
COUNT=4
SOURCE SIZE=5</pre>
<p>and the in-place removal at the same threshold (only C02 goes):</p>
<pre>OUTPUT:
REMOVED=1
R01|Rectangle|20.00|18.00
C01|Circle|28.27|18.85
T01|Triangle|6.00|12.00
R02|Rectangle|6.00|10.00
SIZE=4</pre>`;

const q4ExplainVi = `<p><strong>Lọc mà không cần biết kiểu.</strong> <code>filterByMinArea()</code> không bao giờ hỏi một hình <em>là gì</em>; nó hỏi diện tích của hình đó <em>là bao nhiêu</em>. Vì <code>getArea()</code> là hàm trừu tượng ở <code>Shape</code> và được mỗi lớp con ghi đè, chỉ một vòng lặp là lọc đúng cho cả chữ nhật, hình tròn lẫn tam giác — và sẽ lọc đúng cho cả lớp <code>Hexagon</code> viết vào năm sau mà không cần sửa một dòng. Nếu bạn viết <code>if (s instanceof Circle) ... else if (s instanceof Rectangle) ...</code> thì mỗi hình mới lại bắt bạn quay về sửa hàm này. <strong>Một dãy <code>instanceof</code> trên cây kế thừa gần như luôn là dấu hiệu bạn đã bỏ lỡ tính đa hình.</strong> (<code>instanceof</code> là hợp lệ khi bạn thật sự cần thứ chỉ một lớp con có — vd một báo cáo cần in bán kính — nhưng không bao giờ dùng cho hành vi mà lớp cha đã khai báo.)</p>
<p><strong>Trả về list mới, hay sửa tại chỗ — hãy chọn, rồi nhất quán.</strong> Hai hàm này cố tình nằm ở hai phía đối lập của lựa chọn đó. <code>filterByMinArea()</code> là một <em>truy vấn</em>: nó dựng một <code>ArrayList</code> mới và không đụng vào dữ liệu của người gọi, nên harness vẫn in <code>SOURCE SIZE=5</code> dù đã lọc xuống còn 4. <code>removeSmallerThan()</code> là một <em>mệnh lệnh</em>: nó thay đổi list của người gọi và trả về một con số thay vì một list. Trộn lẫn hai thứ — một hàm trông như truy vấn nhưng âm thầm sửa dữ liệu — là một trong những nguồn lỗi phổ biến nhất trong các bài LAB211.</p>
<p><strong>Bẫy <code>ConcurrentModificationException</code>, đã xác nhận bằng cách chạy thật.</strong> Cách viết hiển nhiên nhất cho hàm thứ hai lại là cách sai:</p>
<pre>for (Shape s : list) {                 // SAI - ném ngoại lệ lúc chạy
    if (s.getArea() &lt; minArea) list.remove(s);
}</pre>
<p>Vòng for-each thực chất là một <code>Iterator</code> ẩn. Iterator của <code>ArrayList</code> ghi nhớ giá trị <code>modCount</code> lúc nó được tạo; <code>list.remove()</code> lại tăng bộ đếm đó sau lưng iterator, nên ngay lần <code>next()</code> kế tiếp nó phát hiện lệch và ném ngoại lệ. Chúng tôi đã biên dịch và chạy đúng bản này — nó in ra <code>EXCEPTION: java.util.ConcurrentModificationException</code> với cả minArea=6 lẫn minArea=20. Đó là cơ chế <em>fail-fast</em> chứ không phải xui rủi: iterator thà dừng hẳn còn hơn âm thầm bỏ sót phần tử. Cách sửa là xoá <em>thông qua</em> iterator, để nó tự cập nhật sổ sách của mình:</p>
<pre>Iterator&lt;Shape&gt; it = list.iterator();
while (it.hasNext()) {
    Shape s = it.next();
    if (s.getArea() &lt; minArea) { it.remove(); count++; }   // an toan
}</pre>
<p>(Dùng vòng for chỉ số chạy LÙI, hoặc <code>removeIf</code> từ Java 8 trở lên, cũng đúng như vậy. Duyệt trên một BẢN SAO rồi sửa list gốc cũng được. Thứ không bao giờ được phép là sửa đúng cái list mà for-each đang duyệt.)</p>
<p><strong>Hành vi ở ca biên có tính điểm.</strong> <code>filterByMinArea</code> dùng <code>&gt;=</code> còn <code>removeSmallerThan</code> dùng <code>&lt;</code>, nên hai hàm bù trừ nhau chính xác: hình có diện tích đúng bằng ngưỡng thì cả hai đều GIỮ lại. Với minArea=6, T01 (Heron trên 3-4-5 = đúng <code>6.0</code>) và R02 (2x3 = <code>6.0</code>) nằm chính xác trên biên và được giữ — lời giải dùng <code>&gt;</code> sẽ âm thầm làm mất chúng. Điều này chỉ đúng vì các diện tích đó chính xác tuyệt đối; nếu chúng đến từ phép tính dấu phẩy động cẩu thả như cái bẫy ở Q1 thì phép so sánh đã có thể lật ngược.</p>
<p>Đã kiểm bằng cách biên dịch cùng harness <code>Main.class</code> given thật. Danh sách cố định là R01 (20.00), C01 (28.27), T01 (6.00), R02 (6.00), C02 (3.14). Với minArea=6:</p>
<pre>OUTPUT:
R01|Rectangle|20.00|18.00
C01|Circle|28.27|18.85
T01|Triangle|6.00|12.00
R02|Rectangle|6.00|10.00
COUNT=4
SOURCE SIZE=5</pre>
<p>và phép xoá tại chỗ ở cùng ngưỡng đó (chỉ C02 bị loại):</p>
<pre>OUTPUT:
REMOVED=1
R01|Rectangle|20.00|18.00
C01|Circle|28.27|18.85
T01|Triangle|6.00|12.00
R02|Rectangle|6.00|10.00
SIZE=4</pre>`;

const q4 = {
  kind: 'CODE', points: 2, language: 'java',
  prompt: B(q4PromptEn, q4PromptVi),
  starterCode: `import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

// GIVEN (already compiled): InvalidShapeException, Shape (abstract),
//   Rectangle, Circle, Triangle, ShapeManager

public class ShapeFilter {

    // TODO: return a NEW list of every shape with getArea() >= minArea,
    // original order kept, input list left untouched. No instanceof.
    public static List<Shape> filterByMinArea(List<Shape> list, double minArea) {
        return null;
    }

    // TODO: remove IN PLACE every shape with getArea() < minArea and return
    // how many were removed. Careful: removing while iterating the same list
    // throws ConcurrentModificationException.
    public static int removeSmallerThan(List<Shape> list, double minArea) {
        return 0;
    }
}`,
  sampleSolution: SRC_FILTER,
  expectedOutput:
`Sample run 1 (TC 1 - filterByMinArea(6), list = R01 20.00 / C01 28.27 / T01 6.00 / R02 6.00 / C02 3.14):
OUTPUT:
R01|Rectangle|20.00|18.00
C01|Circle|28.27|18.85
T01|Triangle|6.00|12.00
R02|Rectangle|6.00|10.00
COUNT=4
SOURCE SIZE=5

Sample run 2 (TC 2 - removeSmallerThan(6) on the same list, in place):
OUTPUT:
REMOVED=1
R01|Rectangle|20.00|18.00
C01|Circle|28.27|18.85
T01|Triangle|6.00|12.00
R02|Rectangle|6.00|10.00
SIZE=4

Sample run 3 (TC 1 - filterByMinArea(20); R01 is exactly on the boundary and is KEPT):
OUTPUT:
R01|Rectangle|20.00|18.00
C01|Circle|28.27|18.85
COUNT=2
SOURCE SIZE=5

Sample run 4 (TC 2 - removeSmallerThan(100) removes every shape):
OUTPUT:
REMOVED=5
SIZE=0`,
  explanation: B(q4ExplainEn, q4ExplainVi),
  rubric: [
    { id: 'filter_pure', criterion: B('filterByMinArea() returns a NEW list of shapes with getArea() >= minArea in the original order, and leaves the input list unmodified.', 'filterByMinArea() trả về list MỚI gồm các hình có getArea() >= minArea theo đúng thứ tự ban đầu, và không sửa list đầu vào.'), weight: 1, maxScore: 0.7 },
    { id: 'safe_removal', criterion: B('removeSmallerThan() removes in place without throwing ConcurrentModificationException (Iterator.remove(), removeIf, a downward index loop, or iterating a copy) and returns the correct count.', 'removeSmallerThan() xoá tại chỗ mà không ném ConcurrentModificationException (Iterator.remove(), removeIf, vòng for chỉ số chạy lùi, hoặc duyệt bản sao) và trả về đúng số lượng.'), weight: 1, maxScore: 0.8 },
    { id: 'boundary_no_instanceof', criterion: B('Boundary handled exactly (>= keeps a shape whose area equals minArea; < removes only strictly smaller) and neither method uses instanceof or type-checking.', 'Xử lý đúng ca biên (>= giữ lại hình có diện tích bằng minArea; < chỉ xoá hình nhỏ hơn hẳn) và cả hai hàm không dùng instanceof hay kiểm tra kiểu.'), weight: 1, maxScore: 0.5 },
  ],
};

// ═══════════════════════════════ spec ═══════════════════════════════
const spec = {
  course: { courseCode: 'PRO192' },
  exams: [
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-ADV1',
      title: B(
        'PRO192 — Advanced Practice 1: Abstract Classes & Exceptions (Nâng cao)',
        'PRO192 — Luyện tập Nâng cao 1: Lớp trừu tượng & Ngoại lệ',
      ),
      description: B(
        'Self-authored supplementary practice paper (4 questions, 10 marks) — NOT a real school exam. Every question is built around abstract classes, polymorphic dispatch and custom CHECKED exceptions, going deeper into OOP than the standard PE papers: template-method design, constructor validation that makes invalid objects unrepresentable, a factory/handler split so a business layer can throw and report failures without printing them, polymorphic aggregation and safe in-place filtering. Aimed at bridging into LAB211 (semester 3), which assumes strong command of abstract classes, exception design and layered entity/validation code. Includes two Java correctness traps (floating-point ordering and ConcurrentModificationException) proven by running both the wrong and the right version. Solutions and every sample output were verified by compiling and running against the given Main.class harness.',
        'Đề luyện tập bổ sung do đội ngũ tự soạn (4 câu, 10 điểm) — KHÔNG phải đề thi thật của trường. Mọi câu đều xoay quanh lớp trừu tượng, điều phối đa hình và ngoại lệ CHECKED tự định nghĩa, đào sâu OOP hơn các đề PE chuẩn: thiết kế template-method, kiểm tra trong constructor khiến đối tượng sai không thể tồn tại, tách factory/handler để tầng nghiệp vụ ném và báo lỗi mà không in ra, tổng hợp đa hình và lọc/xoá tại chỗ an toàn. Nhằm bắc cầu sang LAB211 (kỳ 3) — môn đòi hỏi nắm vững lớp trừu tượng, thiết kế ngoại lệ và mã phân tầng entity/validation. Có 2 cái bẫy đúng-sai của Java (thứ tự phép tính dấu phẩy động và ConcurrentModificationException) được chứng minh bằng cách chạy cả bản sai lẫn bản đúng. Lời giải và mọi output mẫu đều đã kiểm bằng cách biên dịch và chạy thật cùng harness Main.class given.',
      ),
      durationMinutes: 120,
      totalPoints: 10,
      passMark: 5,
      source: 'SAMPLE',
      isPublished: true,
      instructions,
      attachmentUrl: ATTACHMENT_URL,
      attachmentName: B(
        'Download given materials (Q1-Q4, NetBeans projects with compiled harness)',
        'Tải given materials (Q1-Q4, project NetBeans kèm harness đã biên dịch)',
      ),
      questions: [q1, q2, q3, q4],
    },
  ],
};

const totalPoints = spec.exams[0].questions.reduce((sum, q) => sum + q.points, 0);
if (totalPoints !== spec.exams[0].totalPoints) {
  throw new Error(`question points sum to ${totalPoints}, expected ${spec.exams[0].totalPoints}`);
}
for (const q of spec.exams[0].questions) {
  const rubricMax = q.rubric.reduce((sum, r) => sum + r.maxScore, 0);
  if (Math.abs(rubricMax - q.points) > 1e-9) {
    throw new Error(`rubric maxScore sums to ${rubricMax}, expected ${q.points}`);
  }
}

fs.writeFileSync(
  OUT,
  `// AUTO-GENERATED by scripts/build-pro192-pe-adv1.mjs — do not hand-edit, re-run the builder instead.\nexport default ${JSON.stringify(spec, null, 2)};\n`,
  'utf8',
);
console.log(`✓ wrote ${path.relative(process.cwd(), OUT)} (${totalPoints} points across ${spec.exams[0].questions.length} questions)`);
