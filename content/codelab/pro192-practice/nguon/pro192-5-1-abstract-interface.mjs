/** PRO192 · 5.1 — Abstract classes & interfaces: hợp đồng hành vi, lớp trừu tượng, Comparable, default method, chiến lược qua interface. */
import { moDun, deJava, c, j } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-5-1-abstract-shape',
  tieuDe: { en: 'An abstract Shape: one abstract method, one concrete', vi: 'Shape trừu tượng: một phương thức trừu tượng, một cụ thể' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['abstract class', 'abstract method', 'cannot instantiate', 'concrete method using an abstract one'],
  moTa: {
    en: `<p>"Shape" is not a real thing you can draw — only circles, rectangles and triangles are. Make ${c('Shape')} <b>abstract</b>:</p>
<ul><li>${c('abstract double area()')} and ${c('abstract double perimeter()')};</li>
<li>a concrete ${c('String describe()')} in Shape that uses them: ${c('"Circle area=12.57 perimeter=12.57"')} (2 decimals; the name comes from ${c('abstract String name()')}).</li></ul>
<p>Write ${c('Circle(double r)')}, ${c('Rectangle(double w, double h)')} and ${c('Triangle(double a, double b, double c)')} (Heron’s formula; an impossible triangle has area 0).</p>`,
    vi: `<p>"Hình" không phải thứ vẽ được — chỉ hình tròn, chữ nhật, tam giác mới vẽ được. Cho ${c('Shape')} thành <b>abstract</b>:</p>
<ul><li>${c('abstract double area()')} và ${c('abstract double perimeter()')};</li>
<li>một ${c('String describe()')} cụ thể ở Shape dùng hai cái trên: ${c('"Circle area=12.57 perimeter=12.57"')} (2 chữ số thập phân; tên lấy từ ${c('abstract String name()')}).</li></ul>
<p>Viết ${c('Circle(double r)')}, ${c('Rectangle(double w, double h)')} và ${c('Triangle(double a, double b, double c)')} (công thức Heron; tam giác không tồn tại có diện tích 0).</p>`,
  },
  yeuCau: { en: ['Shape is abstract; area, perimeter and name are abstract in it.', 'describe() is written once, in Shape.'], vi: ['Shape là abstract; area, perimeter và name trừu tượng trong nó.', 'describe() viết một lần, ở Shape.'] },
  dauVao: { en: 'Lines C r · R w h · T a b c.', vi: 'Các dòng C r · R w h · T a b c.' },
  dauRa: { en: 'Structure, then describe() of each shape and the total area.', vi: 'Cấu trúc, rồi describe() từng hình và tổng diện tích.' },
  main: 'KiemTra', kiem: true,
  harness: {
    'KiemTra.java': j`
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(Kiem.kieu("Shape"));
        for (String m : new String[] {"area", "perimeter", "name", "describe"}) {
            System.out.println(Kiem.phuongThuc("Shape", m, 0));
        }
        List<Shape> shapes = new ArrayList<>();
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split("\\s+");
            Object s = p[0].equals("C") ? Kiem.tao("Circle", Double.valueOf(p[1]))
                    : p[0].equals("R") ? Kiem.tao("Rectangle", Double.valueOf(p[1]), Double.valueOf(p[2]))
                    : Kiem.tao("Triangle", Double.valueOf(p[1]), Double.valueOf(p[2]), Double.valueOf(p[3]));
            if (s instanceof Shape) {
                shapes.add((Shape) s);
            }
        }
        double total = 0;
        for (Shape s : shapes) {
            System.out.println(s.describe());
            total += s.area();
        }
        System.out.printf("Total area: %.2f%n", total);
    }
}
`,
  },
  tep: {
    'Shape.java': j`
//>> public class Shape { // TODO: abstract class, abstract area/perimeter/name, concrete describe() ⏎     public double area() { ⏎         return 0; ⏎     } ⏎  ⏎     public String describe() { ⏎         return ""; ⏎     } ⏎ }
public abstract class Shape {
    public abstract double area();

    public abstract double perimeter();

    public abstract String name();

    public String describe() {
        return String.format("%s area=%.2f perimeter=%.2f", name(), area(), perimeter());
    }
}
//<<
`,
    'Circle.java': j`
public class Circle extends Shape {
    private final double r;

    public Circle(double r) {
        this.r = r;
    }
    //>> // TODO: area, perimeter, name

    @Override
    public double area() {
        return Math.PI * r * r;
    }

    @Override
    public double perimeter() {
        return 2 * Math.PI * r;
    }

    @Override
    public String name() {
        return "Circle";
    }
    //<<
}
`,
    'Rectangle.java': j`
public class Rectangle extends Shape {
    private final double w;
    private final double h;

    public Rectangle(double w, double h) {
        this.w = w;
        this.h = h;
    }
    //>> // TODO: area, perimeter, name

    @Override
    public double area() {
        return w * h;
    }

    @Override
    public double perimeter() {
        return 2 * (w + h);
    }

    @Override
    public String name() {
        return "Rectangle";
    }
    //<<
}
`,
    'Triangle.java': j`
public class Triangle extends Shape {
    private final double a;
    private final double b;
    private final double c;

    public Triangle(double a, double b, double c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
    //>> // TODO: area (Heron, 0 when impossible), perimeter, name

    @Override
    public double area() {
        if (a + b <= c || a + c <= b || b + c <= a) {
            return 0;
        }
        double s = (a + b + c) / 2;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }

    @Override
    public double perimeter() {
        return a + b + c;
    }

    @Override
    public String name() {
        return "Triangle";
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'one of each', vi: 'mỗi hình một' }, vao: 'C 2\nR 3 4\nT 3 4 5\n' },
    { ten: { en: 'impossible and flat triangles', vi: 'tam giác không tồn tại và dẹt' }, vao: 'T 1 2 10\nT 1 2 3\nC 0.5\n', an: true },
  ],
  goiY: [
    { en: 'Once a class has an abstract method the class itself must be declared abstract; subclasses that are not abstract must implement every abstract method.', vi: 'Lớp có phương thức trừu tượng thì chính lớp phải khai báo abstract; lớp con không trừu tượng phải cài đặt mọi phương thức trừu tượng.' },
    { en: 'describe() in Shape can call area() — it is abstract there, but at run time the subclass version runs.', vi: 'describe() trong Shape gọi được area() — ở đó nó trừu tượng, nhưng lúc chạy bản của lớp con sẽ chạy.' },
  ],
  loiHayGap: [
    { en: 'Giving Shape a dummy area() returning 0 instead of making it abstract — a subclass that forgets to override compiles and silently reports 0.', vi: 'Cho Shape một area() giả trả 0 thay vì abstract — lớp con quên ghi đè vẫn biên dịch và âm thầm báo 0.' },
    { en: 'Heron without the triangle inequality check — sqrt of a negative number is NaN.', vi: 'Heron mà không kiểm bất đẳng thức tam giác — căn của số âm là NaN.' },
  ],
  giaiThich: { en: '<p>An abstract class captures what all shapes share (describe) and forces every concrete shape to supply what differs (area, perimeter, name). The compiler now refuses both <code>new Shape()</code> and a subclass that forgets a method.</p>', vi: '<p>Lớp trừu tượng giữ phần mọi hình đều có (describe) và buộc mỗi hình cụ thể cung cấp phần khác nhau (area, perimeter, name). Trình biên dịch giờ từ chối cả <code>new Shape()</code> lẫn lớp con quên một phương thức.</p>' },
});

const de2 = deJava({
  id: 'pro192-5-1-comparable',
  tieuDe: { en: 'Comparable<Student>: a natural order for Arrays.sort', vi: 'Comparable<Student>: thứ tự tự nhiên cho Arrays.sort' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['interface', 'Comparable<T>', 'compareTo contract', 'Arrays.sort'],
  moTa: {
    en: `<p>Make ${c('Student')} implement ${c('Comparable<Student>')} so that ${c('Arrays.sort')} can sort students without being told how. The natural order: <b>higher GPA first</b>; on equal GPA the ${c('id')} in ascending order.</p>
<ul><li>${c('compareTo')} returns a negative number when ${c('this')} comes first, 0 when equal, positive otherwise — use ${c('Double.compare')} and ${c('String.compareTo')}, never subtraction of doubles.</li>
<li>${c('Main')} (given) reads students, sorts them and prints the ranking.</li></ul>`,
    vi: `<p>Cho ${c('Student')} cài đặt ${c('Comparable<Student>')} để ${c('Arrays.sort')} sắp được sinh viên mà không cần chỉ cách. Thứ tự tự nhiên: <b>GPA cao trước</b>; GPA bằng nhau thì ${c('id')} tăng dần.</p>
<ul><li>${c('compareTo')} trả số âm khi ${c('this')} đứng trước, 0 khi bằng, dương khi ngược lại — dùng ${c('Double.compare')} và ${c('String.compareTo')}, không trừ hai số double.</li>
<li>${c('Main')} (cho sẵn) đọc sinh viên, sắp xếp và in bảng xếp hạng.</li></ul>`,
  },
  yeuCau: { en: ['Do not change Main.java.', 'Student implements Comparable&lt;Student&gt; (generic, not raw Comparable).'], vi: ['Không sửa Main.java.', 'Student implements Comparable&lt;Student&gt; (có generic, không dùng Comparable thô).'] },
  dauVao: { en: 'n, then lines id;name;gpa.', vi: 'n, rồi các dòng id;tên;gpa.' },
  dauRa: { en: 'The ranking.', vi: 'Bảng xếp hạng.' },
  main: 'Main', kiem: true,
  tep: {
    'Main.java': j`
import java.util.Arrays;
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        System.out.println(Kiem.kieu("Student"));
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        Student[] list = new Student[n];
        for (int i = 0; i < n; i++) {
            String[] p = sc.nextLine().split(";");
            list[i] = new Student(p[0].trim(), p[1].trim(), Double.parseDouble(p[2].trim()));
        }
        Arrays.sort(list);
        for (int i = 0; i < n; i++) {
            System.out.println((i + 1) + ". " + list[i]);
        }
        if (n >= 2) {
            System.out.println("first vs second: " + Integer.signum(list[0].compareTo(list[1]))
                    + ", second vs first: " + Integer.signum(list[1].compareTo(list[0]))
                    + ", first vs itself: " + list[0].compareTo(list[0]));
        }
    }
}
`,
    'Student.java': j`
//>> public class Student { // TODO: implements Comparable<Student>
public class Student implements Comparable<Student> {
//<<
    private final String id;
    private final String name;
    private final double gpa;

    public Student(String id, String name, double gpa) {
        this.id = id;
        this.name = name;
        this.gpa = gpa;
    }

    //>> public int compareTo(Student other) { ⏎     return 0; // TODO: GPA high to low, then id ⏎ }
    @Override
    public int compareTo(Student other) {
        int byGpa = Double.compare(other.gpa, gpa);
        return byGpa != 0 ? byGpa : id.compareTo(other.id);
    }
    //<<

    @Override
    public String toString() {
        return String.format("%s %s %.2f", id, name, gpa);
    }
}
`,
  },
  ca: [
    { ten: { en: 'distinct GPAs', vi: 'GPA khác nhau' }, vao: '3\nSE001;An;7.5\nSE002;Binh;9.1\nSE003;Chi;8\n' },
    { ten: { en: 'ties broken by id', vi: 'hoà thì xét mã' }, vao: '4\nSE009;Dung;8.5\nSE002;Em;8.5\nSE005;Giang;9\nSE001;Ha;8.5\n' },
    { ten: { en: 'GPAs that differ by less than 1', vi: 'GPA lệch nhau dưới 1' }, vao: '3\nHE3;X;7.25\nHE1;Y;7.75\nHE2;Z;7.5\n', an: true },
  ],
  goiY: [
    { en: 'Double.compare(other.gpa, this.gpa) — other first gives the DESCENDING order.', vi: 'Double.compare(other.gpa, this.gpa) — đặt other trước cho thứ tự GIẢM DẦN.' },
    { en: 'Return the id comparison only when the GPA comparison is 0.', vi: 'Chỉ trả phép so mã khi phép so GPA bằng 0.' },
  ],
  loiHayGap: [
    { en: 'return (int) (other.gpa - gpa); — 7.75 − 7.5 = 0.25 becomes 0, so different GPAs look equal (hidden case).', vi: 'return (int) (other.gpa - gpa); — 7.75 − 7.5 = 0.25 thành 0, hai GPA khác nhau bị coi là bằng (ca ẩn).' },
    { en: 'Implementing raw Comparable with compareTo(Object) — needs a cast and loses type checking.', vi: 'Cài Comparable thô với compareTo(Object) — phải ép kiểu và mất kiểm kiểu.' },
  ],
  giaiThich: { en: '<p>An interface is a contract: by implementing Comparable&lt;Student&gt;, Student promises a compareTo that Arrays.sort, Collections.sort, TreeSet and TreeMap all rely on. Double.compare avoids the truncation bug of casting a difference to int.</p>', vi: '<p>Interface là hợp đồng: cài Comparable&lt;Student&gt; thì Student hứa có compareTo mà Arrays.sort, Collections.sort, TreeSet và TreeMap đều dựa vào. Double.compare tránh lỗi cắt phần lẻ khi ép hiệu số sang int.</p>' },
});

const de3 = deJava({
  id: 'pro192-5-1-default-method',
  tieuDe: { en: 'An interface with a default method: Discountable', vi: 'Interface có default method: Discountable' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['interface', 'default method (Java 8)', 'constant in an interface', 'implements several interfaces'],
  moTa: {
    en: `<p>Write the interface ${c('Discountable')}:</p>
<ul><li>${c('int MAX_RATE = 50;')} — a constant (every interface field is implicitly ${c('public static final')});</li>
<li>${c('int discountRate()')} — abstract, a percentage;</li>
<li>${c('default long apply(long price)')} — the price after the discount, using ${c('Math.min(discountRate(), MAX_RATE)')}, rounded down.</li></ul>
<p>Then ${c('StudentMember')} (rate 20), ${c('VipMember')} (rate 35, but it <b>overrides</b> ${c('apply')}: at most 300 000 off) and ${c('PromoCode(String code, int rate)')} (rate as given — the cap of 50 applies). All three also implement the given ${c('Named')} interface.</p>`,
    vi: `<p>Viết interface ${c('Discountable')}:</p>
<ul><li>${c('int MAX_RATE = 50;')} — hằng (mọi trường trong interface ngầm định là ${c('public static final')});</li>
<li>${c('int discountRate()')} — trừu tượng, phần trăm;</li>
<li>${c('default long apply(long price)')} — giá sau giảm, dùng ${c('Math.min(discountRate(), MAX_RATE)')}, làm tròn xuống.</li></ul>
<p>Rồi ${c('StudentMember')} (giảm 20), ${c('VipMember')} (giảm 35, nhưng <b>ghi đè</b> ${c('apply')}: giảm tối đa 300 000) và ${c('PromoCode(String code, int rate)')} (mức giảm như đã cho — trần 50 vẫn áp). Cả ba cũng cài interface ${c('Named')} cho sẵn.</p>`,
  },
  yeuCau: { en: ['Named.java and cham/ are given.'], vi: ['Named.java và cham/ cho sẵn.'] },
  dauVao: { en: 'Prices to test.', vi: 'Các mức giá để thử.' },
  dauRa: { en: 'Each discountable applied to each price.', vi: 'Từng đối tượng giảm giá áp lên từng mức giá.' },
  main: 'KiemTra', kiem: true,
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(Kiem.kieu("Discountable") + " | MAX_RATE = " + Discountable.MAX_RATE);
        System.out.println(Kiem.kieu("VipMember"));
        Discountable[] all = {new StudentMember(), new VipMember(), new PromoCode("SALE10", 10), new PromoCode("CRAZY", 90)};
        while (sc.hasNextLine()) {
            long price = Long.parseLong(sc.nextLine().trim());
            for (Discountable d : all) {
                System.out.println(((Named) d).name() + " on " + price + " -> " + d.apply(price));
            }
        }
    }
}
`,
  },
  tep: {
    'Named.java': j`
// GIVEN — do not change.
public interface Named {
    String name();
}
`,
    'Discountable.java': j`
public interface Discountable {
    //>> // TODO: MAX_RATE, discountRate(), default apply(long price)
    int MAX_RATE = 50;

    int discountRate();

    default long apply(long price) {
        int rate = Math.min(discountRate(), MAX_RATE);
        return price - price * rate / 100;
    }
    //<<
}
`,
    'StudentMember.java': j`
public class StudentMember implements Discountable, Named {
    @Override
    public int discountRate() {
        //>> return 0; // TODO
        return 20;
        //<<
    }

    @Override
    public String name() {
        return "Student";
    }
}
`,
    'VipMember.java': j`
public class VipMember implements Discountable, Named {
    private static final long MAX_OFF = 300_000;

    @Override
    public int discountRate() {
        //>> return 0; // TODO
        return 35;
        //<<
    }
    //>> // TODO: override apply(long price) — at most 300 000 off

    @Override
    public long apply(long price) {
        long normal = Discountable.super.apply(price);
        return Math.max(normal, price - MAX_OFF);
    }
    //<<

    @Override
    public String name() {
        return "VIP";
    }
}
`,
    'PromoCode.java': j`
public class PromoCode implements Discountable, Named {
    private final String code;
    private final int rate;

    public PromoCode(String code, int rate) {
        this.code = code;
        this.rate = rate;
    }

    @Override
    public int discountRate() {
        //>> return 0; // TODO
        return rate;
        //<<
    }

    @Override
    public String name() {
        return "Code " + code;
    }
}
`,
  },
  khoiDau: {
    'Discountable.java': j`
public interface Discountable {
    int MAX_RATE = 0; // TODO: 50

    int discountRate();

    default long apply(long price) {
        return price; // TODO: the price after min(discountRate(), MAX_RATE) percent off, rounded down
    }
}
`,
  },
  ca: [
    { ten: { en: 'small and large prices', vi: 'giá nhỏ và giá lớn' }, vao: '100000\n2000000\n' },
    { ten: { en: 'odd prices and the VIP cap boundary', vi: 'giá lẻ và biên trần VIP' }, vao: '999\n857143\n857142\n0\n', an: true },
  ],
  goiY: [
    { en: 'A default method has a body inside the interface; implementing classes inherit it and may override it.', vi: 'Default method có thân ngay trong interface; lớp cài đặt thừa hưởng nó và có thể ghi đè.' },
    { en: 'Inside VipMember.apply, Discountable.super.apply(price) calls the interface’s default version — then keep the larger of the two prices.', vi: 'Trong VipMember.apply, Discountable.super.apply(price) gọi bản default của interface — rồi giữ giá LỚN hơn trong hai giá.' },
  ],
  loiHayGap: [
    { en: 'Declaring MAX_RATE as private or non-final in the interface — interface fields are always public static final.', vi: 'Khai báo MAX_RATE private hay không final trong interface — trường của interface luôn là public static final.' },
    { en: 'Forgetting the 50% cap for PromoCode("CRAZY", 90) — the price drops to 10%.', vi: 'Quên trần 50% cho PromoCode("CRAZY", 90) — giá tụt còn 10%.' },
    { en: 'VipMember taking Math.min of the two prices — that is "at least 300 000 off", the opposite rule.', vi: 'VipMember lấy Math.min hai giá — thành "giảm ít nhất 300 000", ngược luật.' },
  ],
  giaiThich: { en: '<p>A default method lets an interface ship behaviour shared by every implementor while still allowing a class to override it (VipMember). A class can implement several interfaces — each one a separate contract (Discountable, Named).</p>', vi: '<p>Default method cho interface mang theo hành vi chung cho mọi lớp cài đặt mà vẫn cho phép một lớp ghi đè (VipMember). Một lớp cài được nhiều interface — mỗi cái là một hợp đồng riêng (Discountable, Named).</p>' },
});

const de4 = deJava({
  id: 'pro192-5-1-fee-policy',
  tieuDe: { en: 'Swap the behaviour, keep the code: a FeePolicy interface', vi: 'Đổi hành vi, giữ nguyên code: interface FeePolicy' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['program to an interface', 'strategy', 'dependency passed in the constructor'],
  moTa: {
    en: `<p>The fine for a late return depends on who borrows. Instead of ${c('if (type == STUDENT) … else if …')} inside the calculator, define ${c('interface FeePolicy { long fee(int daysLate); String label(); }')} and give the calculator a policy:</p>
<ul><li>${c('StudentPolicy')}: 1 000/day, at most 20 000 — label ${c('"student"')}.</li>
<li>${c('StaffPolicy')}: the first 3 days free, then 2 000/day — label ${c('"staff"')}.</li>
<li>${c('NoFeePolicy')}: always 0 — label ${c('"guest of honour"')}.</li>
<li>${c('LoanDesk(FeePolicy policy)')} with ${c('String settle(String member, int daysLate)')} → ${c('"An (student): 5 days late, fee 5000"')} (or ${c('"…: on time"')} when daysLate ≤ 0) and ${c('long totalCollected()')}.</li></ul>`,
    vi: `<p>Tiền phạt trả trễ tuỳ người mượn. Thay vì ${c('if (type == STUDENT) … else if …')} trong bộ tính, định nghĩa ${c('interface FeePolicy { long fee(int daysLate); String label(); }')} và đưa cho bộ tính một chính sách:</p>
<ul><li>${c('StudentPolicy')}: 1 000/ngày, tối đa 20 000 — nhãn ${c('"student"')}.</li>
<li>${c('StaffPolicy')}: 3 ngày đầu miễn phí, sau đó 2 000/ngày — nhãn ${c('"staff"')}.</li>
<li>${c('NoFeePolicy')}: luôn 0 — nhãn ${c('"guest of honour"')}.</li>
<li>${c('LoanDesk(FeePolicy policy)')} với ${c('String settle(String member, int daysLate)')} → ${c('"An (student): 5 days late, fee 5000"')} (hoặc ${c('"…: on time"')} khi daysLate ≤ 0) và ${c('long totalCollected()')}.</li></ul>`,
  },
  yeuCau: { en: ['LoanDesk only knows the FeePolicy interface — it never names a concrete policy class.'], vi: ['LoanDesk chỉ biết interface FeePolicy — không bao giờ nhắc tên lớp chính sách cụ thể.'] },
  dauVao: { en: 'Lines POLICY;member;daysLate (POLICY = S, F, N).', vi: 'Các dòng POLICY;thành viên;số ngày trễ (POLICY = S, F, N).' },
  dauRa: { en: 'One settle() line per return, then the total collected per desk.', vi: 'Mỗi lần trả một dòng settle(), rồi tổng thu mỗi bàn.' },
  main: 'KiemTra', kiem: true,
  quyTac: [{ id: 'R1', en: 'LoanDesk does not name a concrete policy', vi: 'LoanDesk không nhắc tên chính sách cụ thể', re: String.raw`StudentPolicy|StaffPolicy|NoFeePolicy|instanceof`, file: 'LoanDesk' }],
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit): three desks, one per policy.
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(Kiem.kieu("FeePolicy") + " | " + Kiem.kieu("StaffPolicy"));
        LoanDesk s = new LoanDesk(new StudentPolicy());
        LoanDesk f = new LoanDesk(new StaffPolicy());
        LoanDesk n = new LoanDesk(new NoFeePolicy());
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split(";");
            LoanDesk d = p[0].equals("S") ? s : p[0].equals("F") ? f : n;
            System.out.println(d.settle(p[1], Integer.parseInt(p[2])));
        }
        System.out.println("collected: student " + s.totalCollected() + ", staff " + f.totalCollected() + ", guests " + n.totalCollected());
    }
}
`,
  },
  tep: {
    'FeePolicy.java': j`
public interface FeePolicy {
    //>> // TODO: long fee(int daysLate); String label();
    long fee(int daysLate);

    String label();
    //<<
}
`,
    'StudentPolicy.java': j`
public class StudentPolicy implements FeePolicy {
    //>> // TODO
    @Override
    public long fee(int daysLate) {
        return Math.min(20_000L, 1_000L * Math.max(0, daysLate));
    }

    @Override
    public String label() {
        return "student";
    }
    //<<
}
`,
    'StaffPolicy.java': j`
public class StaffPolicy implements FeePolicy {
    //>> // TODO
    @Override
    public long fee(int daysLate) {
        return 2_000L * Math.max(0, daysLate - 3);
    }

    @Override
    public String label() {
        return "staff";
    }
    //<<
}
`,
    'NoFeePolicy.java': j`
public class NoFeePolicy implements FeePolicy {
    //>> // TODO
    @Override
    public long fee(int daysLate) {
        return 0;
    }

    @Override
    public String label() {
        return "guest of honour";
    }
    //<<
}
`,
    'LoanDesk.java': j`
// Knows only the FeePolicy interface: the policy is chosen by whoever builds the desk.
public class LoanDesk {
    private final FeePolicy policy;
    private long collected;

    public LoanDesk(FeePolicy policy) {
        this.policy = policy;
    }

    public String settle(String member, int daysLate) {
        //>> return ""; // TODO
        String who = member + " (" + policy.label() + ")";
        if (daysLate <= 0) {
            return who + ": on time";
        }
        long fee = policy.fee(daysLate);
        collected += fee;
        return who + ": " + daysLate + " days late, fee " + fee;
        //<<
    }

    public long totalCollected() {
        return collected;
    }
}
`,
  },
  khoiDau: {
    'StudentPolicy.java': j`
public class StudentPolicy implements FeePolicy {
    // TODO: 1 000/day, at most 20 000 — label "student"
    public long fee(int daysLate) {
        return 0;
    }

    public String label() {
        return "";
    }
}
`,
    'StaffPolicy.java': j`
public class StaffPolicy implements FeePolicy {
    // TODO: first 3 days free, then 2 000/day — label "staff"
    public long fee(int daysLate) {
        return 0;
    }

    public String label() {
        return "";
    }
}
`,
    'NoFeePolicy.java': j`
public class NoFeePolicy implements FeePolicy {
    // TODO: always 0 — label "guest of honour"
    public long fee(int daysLate) {
        return 0;
    }

    public String label() {
        return "";
    }
}
`,
    'FeePolicy.java': j`
public interface FeePolicy {
    // TODO: describe the contract — the classes already use these two methods
    long fee(int daysLate);

    String label();
}
`,
  },
  ca: [
    { ten: { en: 'three policies', vi: 'ba chính sách' }, vao: 'S;An;5\nF;Binh;5\nN;Chi;5\nS;Dung;0\n' },
    { ten: { en: 'caps and the free days', vi: 'trần và ngày miễn phí' }, vao: 'S;Em;30\nF;Giang;3\nF;Ha;4\nS;Khoa;-2\nF;Lan;40\n', an: true },
  ],
  goiY: [
    { en: 'The desk stores a FeePolicy field and calls policy.fee(…) and policy.label() — which class answers is decided when the desk is created.', vi: 'Bàn mượn giữ một trường FeePolicy và gọi policy.fee(…), policy.label() — lớp nào trả lời được quyết định lúc tạo bàn.' },
    { en: 'StaffPolicy: Math.max(0, daysLate − 3) days are charged.', vi: 'StaffPolicy: tính tiền cho Math.max(0, daysLate − 3) ngày.' },
  ],
  loiHayGap: [
    { en: 'A switch on a "type" string inside LoanDesk — a new policy means editing the desk (rule R1).', vi: 'switch theo chuỗi "loại" trong LoanDesk — thêm chính sách là phải sửa bàn (luật R1).' },
    { en: 'Charging StaffPolicy for the first 3 days once the member is late more than 3 days.', vi: 'StaffPolicy tính tiền cả 3 ngày đầu khi đã trễ hơn 3 ngày.' },
    { en: 'Adding the fee to the total when the book is returned on time (fee 0 is fine, but "on time" must not call fee with a negative number).', vi: 'Cộng phí vào tổng khi trả đúng hạn (phí 0 thì không sao, nhưng "on time" không được gọi fee với số âm).' },
  ],
  giaiThich: { en: '<p>Programming to an interface: LoanDesk depends on the FeePolicy contract, not on any implementation, so new policies plug in without touching it — the Strategy pattern, and the same shape as Spring injecting an interface into a service.</p>', vi: '<p>Lập trình theo interface: LoanDesk phụ thuộc hợp đồng FeePolicy, không phụ thuộc lớp cài đặt nào, nên chính sách mới cắm vào mà không sửa nó — mẫu Strategy, cùng hình dạng với việc Spring tiêm một interface vào service.</p>' },
});

export default moDun({ slug: 'pro192-5-1-abstract-interface', ten: '5.1 Abstract classes & interfaces', de: [de1, de2, de3, de4] });
