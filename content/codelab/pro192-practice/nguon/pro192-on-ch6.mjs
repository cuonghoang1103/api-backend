/** PRO192 · 6.2 🧪 — ngoại lệ kiểu PE: InvalidStudentException, Inputter LAB211, bọc ngoại lệ kèm nguyên nhân, ngoại lệ qua các tầng. */
import { moDun, deJava, c, j } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-on-ch6-invalid-student',
  tieuDe: { en: 'PE-ADV style: InvalidStudentException, Student, StudentManager', vi: 'Kiểu PE-ADV: InvalidStudentException, Student, StudentManager' },
  doKho: 'HARD', phut: 40,
  khaiNiem: ['custom checked exception', 'validation in the constructor', 'throws through a manager', 'catch in Main'],
  moTa: {
    en: `<p>Write three classes used by the given ${c('Main')}:</p>
<ul><li>${c('InvalidStudentException extends Exception')} (constructor with a message).</li>
<li>${c('Student(String id, String name, double mark) throws InvalidStudentException')}: id = ${c('"SE"')} + 4 digits, else ${c('"Invalid id: <id>"')}; name not blank, else ${c('"Name is required"')}; mark 0..10, else ${c('"Invalid mark: <mark>"')}. Name stored trimmed.</li>
<li>${c('StudentManager')}: ${c('add(Student s) throws InvalidStudentException')} (${c('"Duplicate id: <id>"')}), ${c('List<Student> byMarkDesc()')} (mark high→low, then id), ${c('double average()')} (0 when empty).</li></ul>
<p>Student’s ${c('toString()')} → ${c('"SE0001 | Nguyen An | 8.50"')}.</p>`,
    vi: `<p>Viết ba lớp mà ${c('Main')} cho sẵn dùng: ${c('InvalidStudentException extends Exception')}; ${c('Student(id, name, mark) throws InvalidStudentException')} (mã = ${c('"SE"')} + 4 chữ số; tên không trống; điểm 0..10; câu báo như bản tiếng Anh; tên lưu đã trim); ${c('StudentManager')} với ${c('add')} (mã trùng → ${c('"Duplicate id: <id>"')}), ${c('byMarkDesc()')} (điểm cao→thấp, rồi mã), ${c('average()')} (0 khi rỗng). ${c('toString()')} của Student → ${c('"SE0001 | Nguyen An | 8.50"')}.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java.', 'The exception is checked; Student and StudentManager declare it.'], vi: ['Không sửa Main.java.', 'Ngoại lệ là checked; Student và StudentManager khai báo nó.'] },
  dauVao: { en: 'Lines id;name;mark.', vi: 'Các dòng mã;tên;điểm.' },
  dauRa: { en: 'Added / error per line, then the ranking and the average.', vi: 'Mỗi dòng: đã thêm / lỗi, rồi bảng xếp hạng và điểm trung bình.' },
  main: 'Main', kiem: true,
  tep: {
    'Main.java': j`
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        System.out.println(Kiem.kieu("InvalidStudentException"));
        Scanner sc = new Scanner(System.in);
        StudentManager manager = new StudentManager();
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().split(";", -1);
            try {
                Student s = new Student(p[0].trim(), p[1], Double.parseDouble(p[2].trim()));
                manager.add(s);
                System.out.println("added " + s);
            } catch (InvalidStudentException e) {
                System.out.println("error: " + e.getMessage());
            }
        }
        for (Student s : manager.byMarkDesc()) {
            System.out.println(s);
        }
        System.out.println(String.format("average %.2f", manager.average()));
    }
}
`,
    'InvalidStudentException.java': j`
//>> public class InvalidStudentException extends Exception { // TODO ⏎     public InvalidStudentException(String message) { ⏎     } ⏎ }
public class InvalidStudentException extends Exception {
    public InvalidStudentException(String message) {
        super(message);
    }
}
//<<
`,
    'Student.java': j`
public class Student {
    private final String id;
    private final String name;
    private final double mark;

    public Student(String id, String name, double mark) throws InvalidStudentException {
        //>> // TODO: three checks, in this order
        if (id == null || !id.matches("SE\\d{4}")) {
            throw new InvalidStudentException("Invalid id: " + id);
        }
        if (name == null || name.trim().isEmpty()) {
            throw new InvalidStudentException("Name is required");
        }
        if (mark < 0 || mark > 10) {
            throw new InvalidStudentException("Invalid mark: " + mark);
        }
        //<<
        this.id = id;
        this.name = name.trim();
        this.mark = mark;
    }

    public String getId() {
        return id;
    }

    public double getMark() {
        return mark;
    }

    @Override
    public String toString() {
        return String.format("%s | %s | %.2f", id, name, mark);
    }
}
`,
    'StudentManager.java': j`
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class StudentManager {
    private final List<Student> studentList = new ArrayList<>();

    public void add(Student s) throws InvalidStudentException {
        //>> studentList.add(s); // TODO: refuse a duplicate id
        for (Student other : studentList) {
            if (other.getId().equals(s.getId())) {
                throw new InvalidStudentException("Duplicate id: " + s.getId());
            }
        }
        studentList.add(s);
        //<<
    }

    public List<Student> byMarkDesc() {
        //>> return new ArrayList<>(studentList); // TODO
        List<Student> copy = new ArrayList<>(studentList);
        Collections.sort(copy, new Comparator<Student>() {
            @Override
            public int compare(Student a, Student b) {
                int byMark = Double.compare(b.getMark(), a.getMark());
                return byMark != 0 ? byMark : a.getId().compareTo(b.getId());
            }
        });
        return copy;
        //<<
    }

    public double average() {
        //>> return 0; // TODO
        if (studentList.isEmpty()) {
            return 0;
        }
        double sum = 0;
        for (Student s : studentList) {
            sum += s.getMark();
        }
        return sum / studentList.size();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'valid students and each error', vi: 'sinh viên hợp lệ và từng lỗi' }, vao: 'SE0001;Nguyen An;8.5\nSE01;Tran Binh;7\nSE0002;   ;7\nSE0003;Le Chi;10.5\nSE0004;Pham Dung;9\nSE0001;Copy An;5\n' },
    { ten: { en: 'ties on mark, all invalid → average 0', vi: 'hoà điểm, toàn sai → trung bình 0' }, vao: 'se0001;x;1\nSE00011;y;1\n', an: true },
    { ten: { en: 'boundaries 0 and 10, tie sorted by id', vi: 'biên 0 và 10, hoà sắp theo mã' }, vao: 'SE0009; Zed ;10\nSE0005;Amy;0\nSE0007;Bo;10\nSE0006;Cy;-0.01\n', an: true },
  ],
  goiY: [
    { en: 'A constructor can declare throws; when it throws, the object is never created and add() is never reached.', vi: 'Constructor khai báo throws được; khi nó ném, đối tượng không được tạo và add() không được gọi tới.' },
    { en: 'super(message) in the exception’s constructor makes getMessage() return it.', vi: 'super(message) trong constructor của ngoại lệ làm getMessage() trả lại nó.' },
  ],
  loiHayGap: [
    { en: 'Forgetting super(message) — getMessage() returns null and Main prints "error: null".', vi: 'Quên super(message) — getMessage() trả null và Main in "error: null".' },
    { en: 'Validating in Main instead of the constructor — any other code can still build an invalid Student.', vi: 'Kiểm ở Main thay vì constructor — code khác vẫn tạo được Student sai.' },
    { en: 'Checking "SE" + 4 digits with startsWith + length — "SEab12" passes. Use matches("SE\\\\d{4}").', vi: 'Kiểm "SE" + 4 chữ số bằng startsWith + length — "SEab12" lọt. Dùng matches("SE\\\\d{4}").' },
  ],
  giaiThich: { en: '<p>The domain rules live where the data is created (Student) and where uniqueness is known (StudentManager); both signal failure with one checked exception type, so Main has a single catch that prints the reason and continues with the next line.</p>', vi: '<p>Luật nghiệp vụ nằm ở nơi dữ liệu được tạo (Student) và nơi biết tính duy nhất (StudentManager); cả hai báo thất bại bằng một kiểu ngoại lệ checked, nên Main chỉ cần một catch in lý do rồi xử lý dòng tiếp theo.</p>' },
});

const de2 = deJava({
  id: 'pro192-on-ch6-inputter',
  tieuDe: { en: 'An Inputter for every LAB211 program', vi: 'Inputter dùng cho mọi bài LAB211' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['reusable validated input', 'regex', 'strict date parsing', 'exceptions inside the loop'],
  moTa: {
    en: `<p>Write ${c('Inputter')}, a small class you can drop into every LAB211 assignment. It receives the ${c('Scanner')} in its constructor (no static Scanner) and offers:</p>
<ul><li>${c('int readInt(String prompt, int min, int max)')} — errors: ${c('Please enter an integer.')} / ${c('Please enter a number from <min> to <max>.')}</li>
<li>${c('double readDouble(String prompt, double min, double max)')} — same messages with ${c('a number')} instead of ${c('an integer')}; the range printed with ${c('String.valueOf')}.</li>
<li>${c('String readString(String prompt, String regex, String error)')} — trimmed, must match ${c('regex')}, else print ${c('error')}; blank → ${c('This field is required.')}</li>
<li>${c('String readDate(String prompt)')} — format ${c('dd/MM/yyyy')} and a <b>real</b> date (31/02/2026 is refused): ${c('Please enter a real date as dd/MM/yyyy.')}</li></ul>
<p>Each method prints the prompt, reads a whole line, and asks again until the value is valid. ${c('Main')} (given) uses it to register a borrower.</p>`,
    vi: `<p>Viết ${c('Inputter')}, lớp nhỏ thả vào được mọi bài LAB211. Nó nhận ${c('Scanner')} qua constructor (không Scanner static) và có: ${c('readInt')}, ${c('readDouble')} (khoảng in bằng ${c('String.valueOf')}), ${c('readString(prompt, regex, error)')}, ${c('readDate(prompt)')} (dd/MM/yyyy và là ngày CÓ THẬT — 31/02/2026 bị từ chối). Câu báo lỗi đúng như bản tiếng Anh. Mỗi phương thức in lời nhắc, đọc nguyên dòng và hỏi lại tới khi hợp lệ. ${c('Main')} cho sẵn dùng nó để đăng ký người mượn.</p>`,
  },
  yeuCau: { en: ['Only nextLine(); the LAB211 rules L1–L7 are checked.', 'Do not change Main.java.'], vi: ['Chỉ nextLine(); soát luật LAB211 L1–L7.', 'Không sửa Main.java.'] },
  dauVao: { en: 'Answers to the prompts, many of them wrong.', vi: 'Câu trả lời cho các lời nhắc, nhiều câu sai.' },
  dauRa: { en: 'Prompts, error messages and the registered borrower.', vi: 'Lời nhắc, câu báo lỗi và người mượn đã đăng ký.' },
  main: 'Main', lab211: true,
  tep: {
    'Main.java': j`
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Inputter inputter = new Inputter(new Scanner(System.in));
        String id = inputter.readString("Member ID (M + 3 digits): ", "M\\d{3}", "ID must be M followed by 3 digits, e.g. M007.");
        String name = inputter.readString("Full name: ", "[A-Za-z ]+", "Name may contain only letters and spaces.");
        int age = inputter.readInt("Age (16-80): ", 16, 80);
        double deposit = inputter.readDouble("Deposit (0-500.5): ", 0, 500.5);
        String date = inputter.readDate("Join date (dd/MM/yyyy): ");
        System.out.println("Registered " + id + " " + name + ", " + age + " years, deposit " + deposit + ", joined " + date);
    }
}
`,
    'Inputter.java': j`
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Scanner;

// Validated keyboard input for console programs. Reads whole lines only.
public class Inputter {
    private final Scanner scanner;

    public Inputter(Scanner scanner) {
        this.scanner = scanner;
    }

    public int readInt(String prompt, int min, int max) {
        //>> System.out.print(prompt); ⏎ return Integer.parseInt(scanner.nextLine().trim()); // TODO
        while (true) {
            System.out.print(prompt);
            try {
                int value = Integer.parseInt(scanner.nextLine().trim());
                if (value >= min && value <= max) {
                    return value;
                }
                System.out.println("Please enter a number from " + min + " to " + max + ".");
            } catch (NumberFormatException e) {
                System.out.println("Please enter an integer.");
            }
        }
        //<<
    }

    public double readDouble(String prompt, double min, double max) {
        //>> System.out.print(prompt); ⏎ return Double.parseDouble(scanner.nextLine().trim()); // TODO
        while (true) {
            System.out.print(prompt);
            try {
                double value = Double.parseDouble(scanner.nextLine().trim());
                if (value >= min && value <= max) {
                    return value;
                }
                System.out.println("Please enter a number from " + String.valueOf(min) + " to " + String.valueOf(max) + ".");
            } catch (NumberFormatException e) {
                System.out.println("Please enter a number.");
            }
        }
        //<<
    }

    public String readString(String prompt, String regex, String error) {
        //>> System.out.print(prompt); ⏎ return scanner.nextLine().trim(); // TODO
        while (true) {
            System.out.print(prompt);
            String line = scanner.nextLine().trim();
            if (line.isEmpty()) {
                System.out.println("This field is required.");
            } else if (!line.matches(regex)) {
                System.out.println(error);
            } else {
                return line;
            }
        }
        //<<
    }

    public String readDate(String prompt) {
        //>> System.out.print(prompt); ⏎ return scanner.nextLine().trim(); // TODO: dd/MM/yyyy and a real date
        SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
        format.setLenient(false);
        while (true) {
            System.out.print(prompt);
            String line = scanner.nextLine().trim();
            if (line.matches("\\d{2}/\\d{2}/\\d{4}")) {
                try {
                    format.parse(line);
                    return line;
                } catch (ParseException e) {
                    System.out.println("Please enter a real date as dd/MM/yyyy.");
                    continue;
                }
            }
            System.out.println("Please enter a real date as dd/MM/yyyy.");
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'every kind of wrong input', vi: 'đủ kiểu nhập sai' }, vao: '\nm007\nM007\nNguyen 4n\n  Nguyen An  \nabc\n15\n81\n18\nx\n-1\n500.6\n500.5\n31/02/2026\n1/2/2026\n29/02/2024\n' },
    { ten: { en: 'right first time', vi: 'đúng ngay lần đầu' }, vao: 'M123\nLe Chi\n80\n0\n01/01/2026\n' },
    { ten: { en: 'more date traps', vi: 'thêm bẫy ngày' }, vao: 'M001\nBo\n16\n10\n29/02/2026\n00/01/2026\n31/04/2026\n2026-01-01\n30/04/2026\n', an: true },
  ],
  goiY: [
    { en: 'SimpleDateFormat("dd/MM/yyyy") with setLenient(false) refuses 31/02; the regex \\\\d{2}/\\\\d{2}/\\\\d{4} first refuses 1/2/2026 and 2026-01-01.', vi: 'SimpleDateFormat("dd/MM/yyyy") với setLenient(false) từ chối 31/02; regex \\\\d{2}/\\\\d{2}/\\\\d{4} từ chối 1/2/2026 và 2026-01-01 trước.' },
    { en: 'Keep the Scanner in a private final field set by the constructor — rule L5 (private fields) and no static state.', vi: 'Giữ Scanner trong trường private final do constructor gán — luật L5 (trường private) và không trạng thái static.' },
  ],
  loiHayGap: [
    { en: 'A lenient date format: 31/02/2026 silently becomes 03/03/2026.', vi: 'Định dạng ngày "dễ dãi": 31/02/2026 âm thầm thành 03/03/2026.' },
    { en: 'Using sc.nextInt() for the age — "abc" throws InputMismatchException (rule L2).', vi: 'Dùng sc.nextInt() cho tuổi — "abc" ném InputMismatchException (luật L2).' },
    { en: 'Generic messages ("Invalid!") — the LAB211 reviewer wants what is wrong and how to type it.', vi: 'Câu báo chung chung ("Invalid!") — người chấm LAB211 muốn nói rõ sai gì và gõ thế nào.' },
  ],
  giaiThich: { en: '<p>Every reader follows the same loop: prompt, read a line, try to convert, check the range or pattern, return only a valid value, and print a specific message otherwise. The exceptions thrown by parseInt / parseDouble / parse are caught inside the loop — they are expected user mistakes, not program errors.</p>', vi: '<p>Mọi hàm đọc theo cùng một vòng: nhắc, đọc dòng, thử chuyển đổi, kiểm khoảng hoặc mẫu, chỉ trả giá trị hợp lệ, ngược lại in câu báo cụ thể. Ngoại lệ do parseInt / parseDouble / parse ném được bắt trong vòng lặp — đó là lỗi người dùng có thể đoán trước, không phải lỗi chương trình.</p>' },
});

const de3 = deJava({
  id: 'pro192-on-ch6-wrap-cause',
  tieuDe: { en: 'Wrap and rethrow with a cause: parsing order lines', vi: 'Bọc và ném lại kèm nguyên nhân: đọc dòng đơn hàng' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['exception chaining', 'getCause()', 'translating low-level exceptions', 'checked exception for a format error'],
  moTa: {
    en: `<p>${c('OrderParser.parse(String line, int lineNo)')} turns ${c('"SP001;3;15000"')} into an ${c('Order')}. Low-level failures (${c('NumberFormatException')}, ${c('ArrayIndexOutOfBoundsException')}) must not leak to the caller: wrap them in a checked ${c('OrderFormatException(int lineNo, String message, Throwable cause)')} whose message is ${c('"line 3: <message>"')}:</p>
<ul><li>fewer than 3 fields → message ${c('"expected code;quantity;price"')} (cause: the index exception, or none);</li>
<li>a field that is not a number → ${c('"not a number: <field>"')} (cause: the NumberFormatException);</li>
<li>quantity ≤ 0 or price &lt; 0 → ${c('"quantity must be > 0"')} / ${c('"price must be >= 0"')} (no cause).</li></ul>
<p>${c('Main')} (given) prints the valid orders, each error with the class of its cause, and the total value.</p>`,
    vi: `<p>${c('OrderParser.parse(String line, int lineNo)')} biến ${c('"SP001;3;15000"')} thành ${c('Order')}. Lỗi cấp thấp (${c('NumberFormatException')}, ${c('ArrayIndexOutOfBoundsException')}) không được lọt ra ngoài: bọc chúng trong ngoại lệ checked ${c('OrderFormatException(int lineNo, String message, Throwable cause)')} với câu ${c('"line 3: <message>"')} — thiếu trường → ${c('"expected code;quantity;price"')}; trường không phải số → ${c('"not a number: <trường>"')} (nguyên nhân: NumberFormatException); số lượng ≤ 0 hay giá &lt; 0 → ${c('"quantity must be > 0"')} / ${c('"price must be >= 0"')} (không có nguyên nhân). ${c('Main')} cho sẵn in đơn hợp lệ, từng lỗi kèm lớp nguyên nhân, và tổng giá trị.</p>`,
  },
  yeuCau: { en: ['OrderFormatException is checked and passes the cause to super(message, cause).', 'Do not change Order.java or Main.java.'], vi: ['OrderFormatException là checked và chuyển nguyên nhân cho super(message, cause).', 'Không sửa Order.java hay Main.java.'] },
  dauVao: { en: 'Order lines.', vi: 'Các dòng đơn hàng.' },
  dauRa: { en: 'Valid orders, errors with their causes, total.', vi: 'Đơn hợp lệ, lỗi kèm nguyên nhân, tổng.' },
  main: 'Main',
  tep: {
    'Order.java': j`
// GIVEN — do not change.
public class Order {
    private final String code;
    private final int quantity;
    private final long price;

    public Order(String code, int quantity, long price) {
        this.code = code;
        this.quantity = quantity;
        this.price = price;
    }

    public long value() {
        return quantity * price;
    }

    @Override
    public String toString() {
        return code + " x" + quantity + " @" + price;
    }
}
`,
    'Main.java': j`
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long total = 0;
        int lineNo = 0;
        while (sc.hasNextLine()) {
            String line = sc.nextLine();
            lineNo++;
            try {
                Order o = OrderParser.parse(line, lineNo);
                total += o.value();
                System.out.println("ok " + o);
            } catch (OrderFormatException e) {
                Throwable cause = e.getCause();
                System.out.println("skip " + e.getMessage() + " [line " + e.getLineNo() + ", cause: "
                        + (cause == null ? "none" : cause.getClass().getSimpleName()) + "]");
            }
        }
        System.out.println("total " + total);
    }
}
`,
    'OrderFormatException.java': j`
//>> public class OrderFormatException extends Exception { // TODO: lineNo, message "line N: …", cause ⏎     public OrderFormatException(int lineNo, String message, Throwable cause) { ⏎     } ⏎  ⏎     public int getLineNo() { ⏎         return 0; ⏎     } ⏎ }
public class OrderFormatException extends Exception {
    private final int lineNo;

    public OrderFormatException(int lineNo, String message, Throwable cause) {
        super("line " + lineNo + ": " + message, cause);
        this.lineNo = lineNo;
    }

    public int getLineNo() {
        return lineNo;
    }
}
//<<
`,
    'OrderParser.java': j`
public class OrderParser {
    public static Order parse(String line, int lineNo) throws OrderFormatException {
        //>> String[] p = line.split(";"); ⏎ return new Order(p[0].trim(), Integer.parseInt(p[1].trim()), Long.parseLong(p[2].trim())); // TODO: wrap the failures
        String[] p = line.split(";");
        String field = "";
        try {
            String code = p[0].trim();
            field = p[1].trim();
            int quantity = Integer.parseInt(field);
            field = p[2].trim();
            long price = Long.parseLong(field);
            if (quantity <= 0) {
                throw new OrderFormatException(lineNo, "quantity must be > 0", null);
            }
            if (price < 0) {
                throw new OrderFormatException(lineNo, "price must be >= 0", null);
            }
            return new Order(code, quantity, price);
        } catch (ArrayIndexOutOfBoundsException e) {
            throw new OrderFormatException(lineNo, "expected code;quantity;price", e);
        } catch (NumberFormatException e) {
            throw new OrderFormatException(lineNo, "not a number: " + field, e);
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'good lines and each error', vi: 'dòng đúng và từng lỗi' }, vao: 'SP001;3;15000\nSP002;two;5000\nSP003;1\nSP004;0;100\nSP005;2;-1\nSP006; 4 ; 2500 \n' },
    { ten: { en: 'empty line and a price that is too long', vi: 'dòng trống và giá quá dài' }, vao: '\nSP007;1;99999999999999999999\nSP008;1;0\n', an: true },
  ],
  goiY: [
    { en: 'super("line " + lineNo + ": " + message, cause) — Exception has a (String, Throwable) constructor; getCause() then returns the original exception.', vi: 'super("line " + lineNo + ": " + message, cause) — Exception có constructor (String, Throwable); getCause() khi đó trả ngoại lệ gốc.' },
    { en: 'Remember which field you were parsing (a local variable updated before each parse) so the message can name it.', vi: 'Nhớ trường đang parse (biến cục bộ cập nhật trước mỗi lần parse) để câu báo nêu được nó.' },
  ],
  loiHayGap: [
    { en: 'Throwing the new exception without the cause — the stack trace of the real problem is lost.', vi: 'Ném ngoại lệ mới mà không kèm nguyên nhân — mất stack trace của lỗi thật.' },
    { en: 'Catching OrderFormatException in a catch (Exception e) inside parse and re-wrapping it — the validation errors get a cause they should not have.', vi: 'Bắt OrderFormatException trong catch (Exception e) bên trong parse rồi bọc lại — lỗi kiểm tra bị gắn nguyên nhân không nên có.' },
    { en: '"".split(";") gives [""], so an empty line fails on p[1] — it is the index exception that must be wrapped.', vi: '"".split(";") cho [""], nên dòng trống hỏng ở p[1] — chính ngoại lệ chỉ số đó phải được bọc.' },
  ],
  giaiThich: { en: '<p>Exception translation: the parser speaks the caller’s language (OrderFormatException with a line number) while keeping the low-level exception as the cause for debugging. Validation errors that are not caused by another exception are thrown with a null cause.</p>', vi: '<p>Dịch ngoại lệ: bộ đọc nói ngôn ngữ của nơi gọi (OrderFormatException kèm số dòng) mà vẫn giữ ngoại lệ cấp thấp làm nguyên nhân để gỡ lỗi. Lỗi kiểm tra không do ngoại lệ khác gây ra thì ném với nguyên nhân null.</p>' },
});

const de4 = deJava({
  id: 'pro192-on-ch6-layers',
  tieuDe: { en: 'Exceptions through the layers: throw low, catch high', vi: 'Ngoại lệ qua các tầng: ném ở dưới, bắt ở trên' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['propagation with throws', 'catch at the boundary', 'finally for auditing', 'business exceptions'],
  moTa: {
    en: `<p>A borrow request travels Controller → Service → Repository. Errors are <b>thrown</b> where they are discovered and <b>caught</b> only at the top, where a message can be shown:</p>
<ul><li>${c('BookRepository.find(String id) throws NotFoundException')} (${c('"book B009 not found"')}).</li>
<li>${c('LoanService.borrow(String bookId, String member) throws NotFoundException, NotAvailableException')}: finds the book, refuses when no copy is left (${c('"no copy of B002 left"')}), otherwise takes a copy. It catches nothing.</li>
<li>${c('LoanController.handle(String bookId, String member)')} returns ${c('"OK B001 -> An"')} or ${c('"ERROR <message>"')}, and in a ${c('finally')} block adds ${c('"audit B001 An"')} to the audit list (also for failures).</li></ul>`,
    vi: `<p>Một yêu cầu mượn đi Controller → Service → Repository. Lỗi được <b>ném</b> ở nơi phát hiện và chỉ <b>bắt</b> ở trên cùng, nơi hiện được thông báo: Repository.find ném NotFoundException; LoanService.borrow ném NotFoundException hoặc NotAvailableException và không bắt gì; LoanController.handle trả ${c('"OK B001 -> An"')} hoặc ${c('"ERROR <message>"')} và trong ${c('finally')} ghi ${c('"audit B001 An"')} vào danh sách kiểm toán (cả khi thất bại). Câu báo như bản tiếng Anh.</p>`,
  },
  yeuCau: { en: ['NotFoundException and NotAvailableException are checked.', 'Only the controller has try/catch.'], vi: ['NotFoundException và NotAvailableException là checked.', 'Chỉ controller có try/catch.'] },
  dauVao: { en: 'Lines bookId;member.', vi: 'Các dòng mã sách;thành viên.' },
  dauRa: { en: 'One result per request, then the audit list and the remaining copies.', vi: 'Mỗi yêu cầu một kết quả, rồi danh sách kiểm toán và số bản còn lại.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'only LoanController catches', vi: 'chỉ LoanController bắt ngoại lệ', re: String.raw`\bcatch\s*\(`, file: '^(BookRepository|LoanService)\\.java$' }],
  tep: {
    'NotFoundException.java': j`
public class NotFoundException extends Exception {
    public NotFoundException(String message) {
        super(message);
    }
}
`,
    'NotAvailableException.java': j`
public class NotAvailableException extends Exception {
    public NotAvailableException(String message) {
        super(message);
    }
}
`,
    'BookRepository.java': j`
import java.util.LinkedHashMap;
import java.util.Map;

public class BookRepository {
    private final Map<String, Integer> copies = new LinkedHashMap<>();

    public BookRepository() {
        copies.put("B001", 2);
        copies.put("B002", 1);
        copies.put("B003", 0);
    }

    public int find(String id) throws NotFoundException {
        //>> return copies.get(id); // TODO: unknown id -> NotFoundException
        Integer n = copies.get(id);
        if (n == null) {
            throw new NotFoundException("book " + id + " not found");
        }
        return n;
        //<<
    }

    public void setCopies(String id, int n) {
        copies.put(id, n);
    }

    @Override
    public String toString() {
        return copies.toString();
    }
}
`,
    'LoanService.java': j`
public class LoanService {
    private final BookRepository repository;

    public LoanService(BookRepository repository) {
        this.repository = repository;
    }

    //>> public void borrow(String bookId, String member) { ⏎     // TODO: find, refuse when 0 copies, else take one — throw, do not catch ⏎ }
    public void borrow(String bookId, String member) throws NotFoundException, NotAvailableException {
        int left = repository.find(bookId);
        if (left == 0) {
            throw new NotAvailableException("no copy of " + bookId + " left");
        }
        repository.setCopies(bookId, left - 1);
    }
    //<<
}
`,
    'LoanController.java': j`
import java.util.ArrayList;
import java.util.List;

public class LoanController {
    private final LoanService service;
    private final List<String> audit = new ArrayList<>();

    public LoanController(LoanService service) {
        this.service = service;
    }

    public String handle(String bookId, String member) {
        //>> return "OK"; // TODO: call the service, catch both exceptions, audit in finally
        try {
            service.borrow(bookId, member);
            return "OK " + bookId + " -> " + member;
        } catch (NotFoundException | NotAvailableException e) {
            return "ERROR " + e.getMessage();
        } finally {
            audit.add("audit " + bookId + " " + member);
        }
        //<<
    }

    public List<String> getAudit() {
        return audit;
    }
}
`,
    'Main.java': j`
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        BookRepository repository = new BookRepository();
        LoanController controller = new LoanController(new LoanService(repository));
        Scanner sc = new Scanner(System.in);
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().split(";");
            System.out.println(controller.handle(p[0].trim(), p[1].trim()));
        }
        System.out.println(controller.getAudit());
        System.out.println("copies " + repository);
    }
}
`,
  },
  ca: [
    { ten: { en: 'success, not found, none left', vi: 'thành công, không thấy, hết bản' }, vao: 'B001;An\nB009;Binh\nB003;Chi\nB002;Dung\nB002;Em\n' },
    { ten: { en: 'borrow until empty', vi: 'mượn tới hết' }, vao: 'B001;A\nB001;B\nB001;C\nb001;D\n', an: true },
  ],
  goiY: [
    { en: 'The service declares both exceptions in its throws clause and lets them pass through — no try/catch there.', vi: 'Service khai báo cả hai ngoại lệ trong throws và để chúng đi qua — không có try/catch ở đó.' },
    { en: 'A multi-catch (catch (NotFoundException | NotAvailableException e)) handles both with one message format; finally runs after the return value is computed.', vi: 'multi-catch (catch (NotFoundException | NotAvailableException e)) xử lý cả hai bằng một định dạng câu; finally chạy sau khi giá trị trả về đã được tính.' },
  ],
  loiHayGap: [
    { en: 'Catching in the service and returning null/false — the controller no longer knows WHY it failed (rule R1).', vi: 'Bắt ở service rồi trả null/false — controller không còn biết VÌ SAO thất bại (luật R1).' },
    { en: 'Auditing only on success — the audit must record every request, so it belongs in finally.', vi: 'Chỉ ghi kiểm toán khi thành công — kiểm toán phải ghi mọi yêu cầu, nên thuộc về finally.' },
    { en: 'copies.get(id) returning null unboxed into int — NullPointerException instead of NotFoundException.', vi: 'copies.get(id) trả null rồi tự mở hộp thành int — NullPointerException thay vì NotFoundException.' },
  ],
  giaiThich: { en: '<p>Throw where the problem is found (repository, service), catch where something meaningful can be done (the controller turns it into a message). Checked exceptions document the path in every signature; finally guarantees the audit line for both outcomes.</p>', vi: '<p>Ném ở nơi phát hiện vấn đề (repository, service), bắt ở nơi làm được điều có nghĩa (controller biến nó thành câu thông báo). Ngoại lệ checked ghi rõ đường đi trong mọi chữ ký; finally bảo đảm dòng kiểm toán cho cả hai kết quả.</p>' },
});

export default moDun({ slug: 'pro192-on-ch6', ten: '6.2 🧪 Practice — exceptions the PE way: custom exceptions, safe input, causes, layers', de: [de1, de2, de3, de4] });
