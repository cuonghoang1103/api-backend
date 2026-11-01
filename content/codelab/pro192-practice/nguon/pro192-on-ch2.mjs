/** PRO192 · 2.2 🧪 — bộ nhớ, lớp và constructor: câu 1 PE (Laptop), truyền tham trị/tham chiếu, luật trong một constructor, quản lý sinh viên kiểu LAB211. */
import { moDun, deJava, c, j, LOI_CHUNG } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-on-ch2-laptop',
  tieuDe: { en: 'PE question 1: the Laptop class', vi: 'Câu 1 PE: lớp Laptop' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['class from a UML box', 'default constructor', 'getter with a rule', 'setter with validation'],
  moTa: {
    en: `<p>Question 1 of a PE paper gives one UML box and a ${c('Main')} that tests it. Write ${c('Laptop')}:</p>
<pre>Laptop
- maker : String
- rate  : int
+ Laptop()
+ Laptop(maker : String, rate : int)
+ getMaker() : String       // the maker in UPPER CASE
+ getRate() : int
+ setRate(rate : int) : void // a negative rate is stored as 0
+ getLevel() : String       // "HIGH" when rate > 7, "MEDIUM" when rate >= 4, else "LOW"</pre>
<p>${c('Laptop()')} sets ${c('maker = "unknown"')} and ${c('rate = 0')}.</p>`,
    vi: `<p>Câu 1 của đề PE cho một hộp UML và một ${c('Main')} để kiểm. Viết ${c('Laptop')}:</p>
<pre>Laptop
- maker : String
- rate  : int
+ Laptop()
+ Laptop(maker : String, rate : int)
+ getMaker() : String       // hãng viết HOA
+ getRate() : int
+ setRate(rate : int) : void // rate âm được lưu thành 0
+ getLevel() : String       // "HIGH" khi rate > 7, "MEDIUM" khi rate >= 4, còn lại "LOW"</pre>
<p>${c('Laptop()')} đặt ${c('maker = "unknown"')} và ${c('rate = 0')}.</p>`,
  },
  yeuCau: {
    en: ['Fields exactly as in the box (private).', 'Do not change <code>Main.java</code>; do not print inside Laptop.'],
    vi: ['Trường đúng như hộp UML (private).', 'Không sửa <code>Main.java</code>; không in gì trong Laptop.'],
  },
  dauVao: { en: 'TC (1–3), maker, rate — one per line, repeated.', vi: 'TC (1–3), hãng, rate — mỗi thứ một dòng, lặp lại.' },
  dauRa: { en: 'The given Main’s menu, prompts and OUTPUT block.', vi: 'Menu, lời nhắc và khối OUTPUT của Main đề cho.' },
  main: 'Main',
  tep: {
    'Main.java': j`
import java.util.Scanner;

// GIVEN by the paper — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (sc.hasNextLine()) {
            System.out.println("1. Test getMaker()");
            System.out.println("2. Test setRate()");
            System.out.println("3. Test getLevel()");
            System.out.print("Enter TC (1, 2 or 3): ");
            int tc = Integer.parseInt(sc.nextLine().trim());
            System.out.print("Enter maker: ");
            String maker = sc.nextLine();
            System.out.print("Enter rate: ");
            int rate = Integer.parseInt(sc.nextLine().trim());
            Laptop x = new Laptop(maker, rate);
            System.out.println("OUTPUT:");
            if (tc == 1) {
                System.out.println(x.getMaker() + ", " + x.getRate());
                System.out.println(new Laptop().getMaker() + ", " + new Laptop().getRate());
            } else if (tc == 2) {
                x.setRate(rate - 5);
                System.out.println(x.getRate());
            } else {
                System.out.println(x.getLevel());
            }
        }
    }
}
`,
    'Laptop.java': j`
public class Laptop {
    private String maker;
    private int rate;

    public Laptop() {
        //>> // TODO: "unknown", 0
        this("unknown", 0);
        //<<
    }

    public Laptop(String maker, int rate) {
        this.maker = maker;
        //>> this.rate = rate; // TODO: a negative rate is stored as 0
        setRate(rate);
        //<<
    }

    public String getMaker() {
        //>> return maker; // TODO: upper case
        return maker.toUpperCase();
        //<<
    }

    public int getRate() {
        return rate;
    }

    public void setRate(int rate) {
        //>> this.rate = rate; // TODO
        this.rate = Math.max(0, rate);
        //<<
    }

    public String getLevel() {
        //>> return "LOW"; // TODO: HIGH > 7, MEDIUM >= 4
        if (rate > 7) {
            return "HIGH";
        }
        return rate >= 4 ? "MEDIUM" : "LOW";
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'TC1 and TC3', vi: 'TC1 và TC3' }, vao: '1\nDell\n8\n3\nAsus\n5\n' },
    { ten: { en: 'TC2 below zero', vi: 'TC2 xuống dưới 0' }, vao: '2\nlenovo\n3\n' },
    { ten: { en: 'boundaries 7, 4, 3 and a negative rate', vi: 'biên 7, 4, 3 và rate âm' }, vao: '3\nhp\n7\n3\nhp\n4\n3\nhp\n3\n1\nmsi\n-2\n', an: true },
    { ten: { en: 'TC2 stays positive', vi: 'TC2 vẫn dương' }, vao: '2\nApple\n10\n', an: true },
  ],
  goiY: [
    { en: 'Laptop() can be one line: this("unknown", 0). Let the 2-argument constructor call setRate so the rule "negative becomes 0" lives in one place.', vi: 'Laptop() viết một dòng: this("unknown", 0). Cho constructor 2 tham số gọi setRate để luật "âm thành 0" chỉ nằm một chỗ.' },
    { en: 'getMaker returns maker.toUpperCase() — the field itself keeps what was given.', vi: 'getMaker trả maker.toUpperCase() — trường vẫn giữ nguyên giá trị nhận vào.' },
  ],
  loiHayGap: [
    { en: 'Applying the "negative → 0" rule in setRate only — the constructor then stores −2 (hidden case).', vi: 'Chỉ áp luật "âm → 0" trong setRate — constructor vẫn lưu −2 (ca ẩn).' },
    { en: 'getLevel boundaries: rate > 7 is HIGH, so 7 is MEDIUM; rate >= 4 is MEDIUM, so 4 is MEDIUM.', vi: 'Biên của getLevel: rate > 7 mới là HIGH nên 7 là MEDIUM; rate >= 4 là MEDIUM nên 4 là MEDIUM.' },
    LOI_CHUNG.inThem,
  ],
  giaiThich: { en: '<p>The validation rule is written once in <code>setRate</code> and reused by the constructor; the default constructor delegates with <code>this(...)</code>. Getters may transform a value (upper case) without changing the stored field.</p>', vi: '<p>Luật kiểm tra viết một lần trong <code>setRate</code> và được constructor dùng lại; constructor mặc định gọi <code>this(...)</code>. Getter có thể biến đổi giá trị (viết hoa) mà không đổi trường đã lưu.</p>' },
});

const de2 = deJava({
  id: 'pro192-on-ch2-raise',
  tieuDe: { en: 'Four ways to give a 10% raise: what a method can change', vi: 'Bốn cách tăng lương 10%: một phương thức đổi được gì' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['pass by value', 'references as values', 'mutating vs reassigning', 'copy'],
  moTa: {
    en: `<p>Java passes <b>everything by value</b> — for an object the value is the reference. So a method can change the object a parameter points to, but it cannot make the caller’s variable point somewhere else. ${c('Employee')} is given. Write ${c('Payroll')} with four static methods:</p>
<ul><li>${c('void raise(Employee e, int percent)')} — changes that employee’s salary (rounded down to a whole number).</li>
<li>${c('Employee raisedCopy(Employee e, int percent)')} — returns a <b>new</b> employee with the raised salary; ${c('e')} is unchanged.</li>
<li>${c('void raiseAll(Employee[] list, int percent)')} — raises everybody in the array.</li>
<li>${c('void swapSalaries(Employee a, Employee b)')} — after the call ${c('a')} has ${c('b')}’s old salary and vice versa (swapping the parameters ${c('a')} and ${c('b')} themselves does nothing for the caller — why?).</li></ul>`,
    vi: `<p>Java truyền <b>mọi thứ theo giá trị</b> — với đối tượng, giá trị đó là tham chiếu. Nên một phương thức đổi được đối tượng mà tham số trỏ tới, nhưng không làm biến của nơi gọi trỏ sang chỗ khác được. ${c('Employee')} cho sẵn. Viết ${c('Payroll')} với bốn phương thức static:</p>
<ul><li>${c('void raise(Employee e, int percent)')} — đổi lương của chính nhân viên đó (làm tròn xuống số nguyên).</li>
<li>${c('Employee raisedCopy(Employee e, int percent)')} — trả một nhân viên <b>mới</b> với lương đã tăng; ${c('e')} không đổi.</li>
<li>${c('void raiseAll(Employee[] list, int percent)')} — tăng lương cả mảng.</li>
<li>${c('void swapSalaries(Employee a, Employee b)')} — sau lời gọi ${c('a')} mang lương cũ của ${c('b')} và ngược lại (đổi chỗ chính hai tham số ${c('a')}, ${c('b')} thì nơi gọi không thấy gì — vì sao?).</li></ul>`,
  },
  yeuCau: {
    en: ['New salary = salary + salary * percent / 100 using long arithmetic (integer division rounds down).', 'Do not change Employee.java.'],
    vi: ['Lương mới = lương + lương * percent / 100 tính bằng long (chia nguyên làm tròn xuống).', 'Không sửa Employee.java.'],
  },
  dauVao: { en: 'A scenario number.', vi: 'Số kịch bản.' },
  dauRa: { en: 'Salaries before and after each call.', vi: 'Lương trước và sau mỗi lời gọi.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        String s = new Scanner(System.in).nextLine().trim();
        Employee an = new Employee("An", 10_000_000);
        Employee binh = new Employee("Binh", 12_345_678);
        if (s.equals("1")) {
            Payroll.raise(an, 10);
            System.out.println("raise(an, 10): " + an);
            Employee c = Payroll.raisedCopy(binh, 10);
            System.out.println("raisedCopy(binh, 10): copy " + c + ", original " + binh + ", same object: " + (c == binh));
        } else if (s.equals("2")) {
            Employee[] list = {an, binh, new Employee("Chi", 999)};
            Payroll.raiseAll(list, 7);
            for (Employee e : list) {
                System.out.println("raiseAll 7%: " + e);
            }
            System.out.println("an is list[0] after raiseAll: " + an);
        } else {
            Payroll.swapSalaries(an, binh);
            System.out.println("swapSalaries: " + an + " / " + binh);
            Payroll.raise(an, 0);
            Payroll.raise(binh, 150);
            System.out.println("raise 0% and 150%: " + an + " / " + binh);
        }
    }
}
`,
  },
  tep: {
    'Employee.java': j`
// GIVEN — do not change.
public class Employee {
    private final String name;
    private long salary;

    public Employee(String name, long salary) {
        this.name = name;
        this.salary = salary;
    }

    public String getName() {
        return name;
    }

    public long getSalary() {
        return salary;
    }

    public void setSalary(long salary) {
        this.salary = salary;
    }

    @Override
    public String toString() {
        return name + "=" + salary;
    }
}
`,
    'Payroll.java': j`
public class Payroll {
    static long raised(long salary, int percent) {
        return salary + salary * percent / 100;
    }

    public static void raise(Employee e, int percent) {
        //>> // TODO: change the object e points to
        e.setSalary(raised(e.getSalary(), percent));
        //<<
    }

    public static Employee raisedCopy(Employee e, int percent) {
        //>> return e; // TODO: a NEW Employee
        return new Employee(e.getName(), raised(e.getSalary(), percent));
        //<<
    }

    public static void raiseAll(Employee[] list, int percent) {
        //>> // TODO
        for (Employee e : list) {
            raise(e, percent);
        }
        //<<
    }

    public static void swapSalaries(Employee a, Employee b) {
        //>> Employee t = a; ⏎ a = b; ⏎ b = t; // TODO: this swaps only the local copies of the references — fix it
        long t = a.getSalary();
        a.setSalary(b.getSalary());
        b.setSalary(t);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'raise vs raisedCopy', vi: 'raise và raisedCopy' }, vao: '1\n' },
    { ten: { en: 'raiseAll changes the objects in the array', vi: 'raiseAll đổi các đối tượng trong mảng' }, vao: '2\n' },
    { ten: { en: 'swapSalaries, 0% and 150%', vi: 'swapSalaries, 0% và 150%' }, vao: '3\n', an: true },
  ],
  goiY: [
    { en: 'A parameter is a copy of the caller’s reference: e.setSalary(…) reaches the caller’s object, e = new Employee(…) only changes the local copy.', vi: 'Tham số là bản sao tham chiếu của nơi gọi: e.setSalary(…) chạm tới đối tượng của nơi gọi, e = new Employee(…) chỉ đổi bản sao cục bộ.' },
    { en: 'swapSalaries swaps the VALUES through the setters, keeping one in a temporary variable.', vi: 'swapSalaries đổi GIÁ TRỊ qua setter, giữ một giá trị trong biến tạm.' },
  ],
  loiHayGap: [
    { en: 'salary * (percent / 100) — percent / 100 is 0 in integer division for every percent below 100.', vi: 'salary * (percent / 100) — percent / 100 bằng 0 (chia nguyên) với mọi percent dưới 100.' },
    { en: 'raisedCopy changing the original and returning it — the "same object" line prints true.', vi: 'raisedCopy đổi bản gốc rồi trả nó — dòng "same object" in true.' },
    { en: 'Swapping the parameters a and b — the caller sees nothing, as the starter shows.', vi: 'Đổi chỗ hai tham số a và b — nơi gọi không thấy gì, như code khởi đầu cho thấy.' },
  ],
  giaiThich: { en: '<p>Every call receives copies of the arguments. Copies of references still point to the caller’s objects, so mutating through them (setSalary) is visible; reassigning them (a = b) is not. A method that must not touch its argument builds and returns a new object.</p>', vi: '<p>Mỗi lời gọi nhận bản sao của đối số. Bản sao tham chiếu vẫn trỏ tới đối tượng của nơi gọi, nên đổi qua chúng (setSalary) thì thấy được; gán lại chúng (a = b) thì không. Phương thức không được đụng vào đối số thì dựng và trả về đối tượng mới.</p>' },
});

const de3 = deJava({
  id: 'pro192-on-ch2-product',
  tieuDe: { en: 'Three constructors, one place for the rules: Product', vi: 'Ba constructor, luật nằm một chỗ: Product' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['constructor chaining', 'normalisation', 'immutability (final fields)'],
  moTa: {
    en: `<p>Write an <b>immutable</b> ${c('Product')} (all fields ${c('private final')}, no setters) with three constructors that share one set of rules:</p>
<ul><li>${c('Product(String code, String name, long price)')} — the code is trimmed and upper-cased (${c('" sp01 "')} → ${c('"SP01"')}); a blank name becomes ${c('"(no name)"')}, otherwise trimmed; a negative price becomes 0.</li>
<li>${c('Product(String code, String name)')} — price 0. ${c('Product(String code)')} — name ${c('"(no name)"')}, price 0.</li>
<li>${c('Product withPrice(long newPrice)')} — a new product with the same code and name (the rules apply again); ${c('toString()')} → ${c('SP01 Pen 5000')}.</li></ul>`,
    vi: `<p>Viết ${c('Product')} <b>bất biến</b> (mọi trường ${c('private final')}, không setter) với ba constructor dùng chung một bộ luật:</p>
<ul><li>${c('Product(String code, String name, long price)')} — mã được trim và viết hoa (${c('" sp01 "')} → ${c('"SP01"')}); tên trống thành ${c('"(no name)"')}, còn lại trim; giá âm thành 0.</li>
<li>${c('Product(String code, String name)')} — giá 0. ${c('Product(String code)')} — tên ${c('"(no name)"')}, giá 0.</li>
<li>${c('Product withPrice(long newPrice)')} — sản phẩm mới cùng mã và tên (luật áp lại); ${c('toString()')} → ${c('SP01 Pen 5000')}.</li></ul>`,
  },
  yeuCau: {
    en: ['All fields private final; no setter.', 'Only the 3-argument constructor contains the rules; the other two call it with this(...).'],
    vi: ['Mọi trường private final; không setter.', 'Chỉ constructor 3 tham số chứa luật; hai cái kia gọi nó bằng this(...).'],
  },
  dauVao: { en: 'Lines code;name;price (some parts missing) for the test class.', vi: 'Các dòng code;name;price (có thể thiếu phần) cho lớp kiểm.' },
  dauRa: { en: 'Each product and the structure seen by reflection.', vi: 'Từng sản phẩm và cấu trúc soi bằng reflection.' },
  main: 'KiemTra', kiem: true,
  quyTac: [{ id: 'R1', en: 'two constructors are one line this(...)', vi: 'hai constructor chỉ là một dòng this(...)', re: String.raw`(Product\s*\([^)]*\)\s*\{\s*this\s*\([^;]*\);\s*\}[\s\S]*){2}`, need: true }],
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(Kiem.truong("Product").replace("private final", "pf"));
        System.out.println("setters: " + Kiem.phuongThuc("Product", "setPrice", 1) + " | " + Kiem.phuongThuc("Product", "setName", 1));
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().split(";", -1);
            Object x = p.length == 1 ? Kiem.tao("Product", p[0])
                    : p.length == 2 ? Kiem.tao("Product", p[0], p[1]) : Kiem.tao("Product", p[0], p[1], Long.valueOf(p[2]));
            System.out.println("[" + String.join("|", p) + "] -> " + Kiem.goi(x, "toString"));
            Object y = Kiem.goiObj(x, "withPrice", Long.valueOf(-1));
            System.out.println("  withPrice(-1) -> " + y + ", original still " + Kiem.goi(x, "toString") + ", new object: " + (y != x));
        }
    }
}
`,
  },
  tep: {
    'Product.java': j`
// An immutable product: once created it never changes; "changing" the price builds a new product.
public class Product {
    private final String code;
    private final String name;
    private final long price;

    public Product(String code, String name, long price) {
        //>> this.code = code; ⏎ this.name = name; ⏎ this.price = price; // TODO: the rules
        this.code = code.trim().toUpperCase();
        this.name = (name == null || name.trim().isEmpty()) ? "(no name)" : name.trim();
        this.price = Math.max(0, price);
        //<<
    }

    public Product(String code, String name) {
        //>> this(code, name, 0); // TODO check
        this(code, name, 0);
        //<<
    }

    public Product(String code) {
        //>> this(code, null, 0); // TODO check
        this(code, null);
        //<<
    }

    public Product withPrice(long newPrice) {
        //>> return this; // TODO: a new Product
        return new Product(code, name, newPrice);
        //<<
    }

    @Override
    public String toString() {
        return code + " " + name + " " + price;
    }
}
`,
  },
  ca: [
    { ten: { en: 'the three constructors', vi: 'ba constructor' }, vao: ' sp01 ;  Pen ;5000\nsp02;Notebook\nsp03\n' },
    { ten: { en: 'blank name and negative price', vi: 'tên trống và giá âm' }, vao: 'ab12;   ;-20\n' },
    { ten: { en: 'mixed-case codes, name with inner spaces', vi: 'mã hoa thường lẫn lộn, tên có dấu cách bên trong' }, vao: '  xY9 ; Blue  Pen  ;0\nzz;;7\n', an: true },
  ],
  goiY: [
    { en: 'A final field must be assigned exactly once in every constructor path — another reason for only ONE constructor to assign them.', vi: 'Trường final phải được gán đúng một lần trên mọi đường constructor — thêm một lý do để chỉ MỘT constructor gán chúng.' },
    { en: 'withPrice returns new Product(code, name, newPrice) — the rules run again, so a negative price becomes 0.', vi: 'withPrice trả new Product(code, name, newPrice) — luật chạy lại, nên giá âm thành 0.' },
  ],
  loiHayGap: [
    { en: 'Trimming only the code and forgetting the name (or the other way round).', vi: 'Chỉ trim mã mà quên tên (hoặc ngược lại).' },
    { en: 'name.isEmpty() on "   " is false — use trim().isEmpty() (isBlank() needs Java 11).', vi: 'name.isEmpty() với "   " là false — dùng trim().isEmpty() (isBlank() cần Java 11).' },
    { en: 'Adding a setPrice "for convenience" — the object is no longer immutable (the structure line shows it).', vi: 'Thêm setPrice "cho tiện" — đối tượng không còn bất biến (dòng cấu trúc cho thấy).' },
  ],
  giaiThich: { en: '<p>One constructor owns the rules and assigns the final fields; the others delegate. Because nothing can change after construction, "changing" the price means building a new object — the pattern of <code>String</code>, <code>LocalDate</code> and Java records.</p>', vi: '<p>Một constructor giữ luật và gán các trường final; các cái khác gọi nó. Vì không gì đổi được sau khi tạo, "đổi" giá nghĩa là dựng đối tượng mới — khuôn của <code>String</code>, <code>LocalDate</code> và record trong Java.</p>' },
});

const de4 = deJava({
  id: 'pro192-on-ch2-student-manager',
  tieuDe: { en: 'LAB211 style: a student manager with a menu', vi: 'Kiểu LAB211: quản lý sinh viên có menu' },
  doKho: 'HARD', phut: 45,
  khaiNiem: ['menu loop', 'validated input', 'List<Student>', 'separation: model / manager / main'],
  moTa: {
    en: `<p>Three files, three jobs: ${c('Student')} holds data, ${c('StudentManager')} keeps the list and the rules, ${c('Main')} talks to the user. Menu:</p>
<pre>===== STUDENT MANAGER =====
1. Add student
2. List students (GPA high to low)
3. Search by name
4. Update GPA
5. Delete student
0. Exit
Your choice: </pre>
<ul><li>ID: two upper-case letters + 6 digits (${c('HE123456')}); must not exist yet. Name: not blank, stored trimmed. GPA: a number 0..10.</li>
<li>List: GPA descending, then ID ascending, format ${c('String.format("%-10s %-20s %5.2f", id, name, gpa)')}; empty list → ${c('No student.')}</li>
<li>Search: names containing the keyword, ignoring case, same row format, in insertion order; nothing → ${c('No student matches "<keyword>".')}</li>
<li>Update/Delete by ID; unknown ID → ${c('Student <ID> does not exist.')}</li></ul>
<p>Every wrong input prints a message that says what is wrong and asks again — the exact texts are in ${c('Main.java')} of the starter (the menu, prompts and messages are given; the logic is yours).</p>`,
    vi: `<p>Ba tệp, ba việc: ${c('Student')} giữ dữ liệu, ${c('StudentManager')} giữ danh sách và luật, ${c('Main')} nói chuyện với người dùng. Menu như trên.</p>
<ul><li>Mã: hai chữ hoa + 6 chữ số (${c('HE123456')}); chưa tồn tại. Tên: không trống, lưu đã trim. GPA: số 0..10.</li>
<li>Liệt kê: GPA giảm dần, rồi mã tăng dần, dạng ${c('String.format("%-10s %-20s %5.2f", id, name, gpa)')}; danh sách rỗng → ${c('No student.')}</li>
<li>Tìm: tên chứa từ khoá, không phân biệt hoa thường, cùng dạng dòng, theo thứ tự thêm; không có → ${c('No student matches "<từ khoá>".')}</li>
<li>Sửa/Xoá theo mã; mã không có → ${c('Student <MÃ> does not exist.')}</li></ul>
<p>Mỗi lần nhập sai in thông báo nói SAI GÌ và hỏi lại — câu chữ chính xác nằm trong ${c('Main.java')} của code khởi đầu (menu, lời nhắc và thông báo cho sẵn; logic là của bạn).</p>`,
  },
  yeuCau: {
    en: ['Only Main reads the keyboard and prints; StudentManager returns values.', 'The LAB211 rules L1–L7 are checked (nextLine only, List declarations, private fields, switch default…).', 'The program never crashes and returns to the menu after every function.'],
    vi: ['Chỉ Main đọc bàn phím và in; StudentManager trả về giá trị.', 'Soát luật LAB211 L1–L7 (chỉ nextLine, khai báo List, trường private, switch có default…).', 'Chương trình không bao giờ sập và quay về menu sau mỗi chức năng.'],
  },
  dauVao: { en: 'Menu choices and values, one per line.', vi: 'Lựa chọn menu và giá trị, mỗi thứ một dòng.' },
  dauRa: { en: 'Menu, prompts, messages and tables.', vi: 'Menu, lời nhắc, thông báo và bảng.' },
  main: 'Main', lab211: true,
  tep: {
    'Student.java': j`
// One student: data only.
public class Student {
    private final String id;
    private final String name;
    private double gpa;

    public Student(String id, String name, double gpa) {
        this.id = id;
        this.name = name;
        this.gpa = gpa;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getGpa() {
        return gpa;
    }

    public void setGpa(double gpa) {
        this.gpa = gpa;
    }

    @Override
    public String toString() {
        return String.format("%-10s %-20s %5.2f", id, name, gpa);
    }
}
`,
    'StudentManager.java': j`
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

// Keeps the list and the rules. Never reads the keyboard, never prints.
public class StudentManager {
    private final List<Student> studentList = new ArrayList<>();

    public Student findById(String id) {
        //>> return null; // TODO
        for (Student student : studentList) {
            if (student.getId().equals(id)) {
                return student;
            }
        }
        return null;
        //<<
    }

    public boolean add(Student student) {
        //>> return false; // TODO: refuse a duplicate ID
        if (findById(student.getId()) != null) {
            return false;
        }
        studentList.add(student);
        return true;
        //<<
    }

    public List<Student> sortedByGpa() {
        //>> return new ArrayList<>(studentList); // TODO: a sorted COPY — GPA high to low, then ID
        List<Student> copy = new ArrayList<>(studentList);
        Collections.sort(copy, new Comparator<Student>() {
            @Override
            public int compare(Student a, Student b) {
                int byGpa = Double.compare(b.getGpa(), a.getGpa());
                return byGpa != 0 ? byGpa : a.getId().compareTo(b.getId());
            }
        });
        return copy;
        //<<
    }

    public List<Student> searchByName(String keyword) {
        //>> return new ArrayList<>(); // TODO: contains, ignoring case, insertion order
        List<Student> found = new ArrayList<>();
        for (Student student : studentList) {
            if (student.getName().toLowerCase().contains(keyword.toLowerCase())) {
                found.add(student);
            }
        }
        return found;
        //<<
    }

    public boolean updateGpa(String id, double gpa) {
        //>> return false; // TODO
        Student student = findById(id);
        if (student == null) {
            return false;
        }
        student.setGpa(gpa);
        return true;
        //<<
    }

    public boolean delete(String id) {
        //>> return false; // TODO
        Student student = findById(id);
        return student != null && studentList.remove(student);
        //<<
    }
}
`,
    'Main.java': j`
import java.util.List;
import java.util.Scanner;

// Talks to the user: menu, prompts, validated input, messages. Logic lives in StudentManager.
public class Main {
    private static final String ID_PATTERN = "[A-Z]{2}\\d{6}";

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        StudentManager studentManager = new StudentManager();
        boolean isRunning = true;
        while (isRunning) {
            System.out.println("===== STUDENT MANAGER =====");
            System.out.println("1. Add student");
            System.out.println("2. List students (GPA high to low)");
            System.out.println("3. Search by name");
            System.out.println("4. Update GPA");
            System.out.println("5. Delete student");
            System.out.println("0. Exit");
            switch (readInt(scanner, "Your choice: ", 0, 5)) {
                case 1:
                    addStudent(scanner, studentManager);
                    break;
                case 2:
                    printList(studentManager.sortedByGpa(), "No student.");
                    break;
                case 3:
                    String keyword = readText(scanner, "Keyword: ");
                    printList(studentManager.searchByName(keyword), "No student matches \"" + keyword + "\".");
                    break;
                case 4:
                    String updateId = readId(scanner);
                    //>> System.out.println("TODO"); // TODO: read the GPA, update, print "GPA of <ID> updated." or the "does not exist" message
                    if (studentManager.findById(updateId) == null) {
                        System.out.println("Student " + updateId + " does not exist.");
                    } else {
                        studentManager.updateGpa(updateId, readGpa(scanner));
                        System.out.println("GPA of " + updateId + " updated.");
                    }
                    //<<
                    break;
                case 5:
                    String deleteId = readId(scanner);
                    //>> System.out.println("TODO"); // TODO: "Deleted <ID>." or the "does not exist" message
                    System.out.println(studentManager.delete(deleteId) ? "Deleted " + deleteId + "."
                            : "Student " + deleteId + " does not exist.");
                    //<<
                    break;
                case 0:
                    System.out.println("Goodbye.");
                    isRunning = false;
                    break;
                default:
                    break;
            }
        }
    }

    private static void addStudent(Scanner scanner, StudentManager studentManager) {
        String id = readId(scanner);
        //>> // TODO: refuse an existing ID ("Student <ID> already exists."), else read name + GPA, add, print "Added <ID>."
        if (studentManager.findById(id) != null) {
            System.out.println("Student " + id + " already exists.");
            return;
        }
        String name = readText(scanner, "Name: ");
        double gpa = readGpa(scanner);
        studentManager.add(new Student(id, name, gpa));
        System.out.println("Added " + id + ".");
        //<<
    }

    private static void printList(List<Student> studentList, String emptyMessage) {
        if (studentList.isEmpty()) {
            System.out.println(emptyMessage);
            return;
        }
        for (Student student : studentList) {
            System.out.println(student);
        }
    }

    private static int readInt(Scanner scanner, String prompt, int min, int max) {
        while (true) {
            System.out.print(prompt);
            String line = scanner.nextLine().trim();
            try {
                int value = Integer.parseInt(line);
                if (value >= min && value <= max) {
                    return value;
                }
                System.out.println("Choose a number from " + min + " to " + max + ".");
            } catch (NumberFormatException e) {
                System.out.println("\"" + line + "\" is not a number. Type a number from " + min + " to " + max + ".");
            }
        }
    }

    private static String readText(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String line = scanner.nextLine().trim();
            if (!line.isEmpty()) {
                return line;
            }
            System.out.println("This field cannot be empty. Type it again.");
        }
    }

    private static String readId(Scanner scanner) {
        //>> return readText(scanner, "Student ID: ").toUpperCase(); // TODO: keep asking until it matches ID_PATTERN ("ID must be 2 upper-case letters + 6 digits, e.g. HE123456.")
        while (true) {
            String id = readText(scanner, "Student ID: ");
            if (id.matches(ID_PATTERN)) {
                return id;
            }
            System.out.println("ID must be 2 upper-case letters + 6 digits, e.g. HE123456.");
        }
        //<<
    }

    private static double readGpa(Scanner scanner) {
        //>> return Double.parseDouble(readText(scanner, "GPA (0-10): ")); // TODO: not a number -> "GPA must be a number, e.g. 7.5."; outside 0..10 -> "GPA must be between 0 and 10."
        while (true) {
            String line = readText(scanner, "GPA (0-10): ");
            try {
                double gpa = Double.parseDouble(line);
                if (gpa >= 0 && gpa <= 10) {
                    return gpa;
                }
                System.out.println("GPA must be between 0 and 10.");
            } catch (NumberFormatException e) {
                System.out.println("GPA must be a number, e.g. 7.5.");
            }
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'add with wrong inputs, list, search', vi: 'thêm có nhập sai, liệt kê, tìm' }, vao: 'abc\n9\n2\n1\nhe123456\nHE123456\n  Nguyen Van An  \nten\n11\n8.5\n1\nHE200001\nTran Binh\n9\n1\nHE123456\n3\nan\n3\nzzz\n0\n' },
    { ten: { en: 'update, delete, unknown IDs', vi: 'sửa, xoá, mã không có' }, vao: '1\nSE000001\nLe Hoa\n7\n1\nSE000002\nPham Huy\n7\n4\nSE000009\n4\nSE000002\n-1\n6.25\n2\n5\nSE000001\n5\nSE000001\n2\n0\n' },
    { ten: { en: 'ties on GPA sorted by ID, empty list, blank inputs', vi: 'hoà GPA sắp theo mã, danh sách rỗng, nhập trống' }, vao: '2\n\n1\n\nHE000003\n\nCa\n10\n1\nHE000001\nAn Ca\n10\n1\nHE000002\nBao\n0\n2\n3\nCA\n0\n', an: true },
    { ten: { en: 'delete everything then list', vi: 'xoá hết rồi liệt kê' }, vao: '1\nAB111111\nX\n5\n5\nAB111111\n2\n3\nx\n0\n', an: true },
  ],
  goiY: [
    { en: 'StudentManager returns data or true/false; Main decides the message. findById is the one helper the other methods reuse.', vi: 'StudentManager trả dữ liệu hoặc true/false; Main quyết định câu thông báo. findById là hàm phụ duy nhất mà các hàm khác dùng lại.' },
    { en: 'Sort a COPY with a Comparator: Double.compare(b.getGpa(), a.getGpa()) for "high to low", then a.getId().compareTo(b.getId()).', vi: 'Sắp một BẢN SAO bằng Comparator: Double.compare(b.getGpa(), a.getGpa()) cho "cao xuống thấp", rồi a.getId().compareTo(b.getId()).' },
  ],
  loiHayGap: [
    { en: 'Sorting studentList itself — the search afterwards is no longer in insertion order.', vi: 'Sắp chính studentList — lần tìm sau đó không còn theo thứ tự thêm.' },
    { en: 'Reading the name and GPA before checking the duplicate ID — the user types everything and is then refused.', vi: 'Đọc tên và GPA trước khi kiểm mã trùng — người dùng gõ hết rồi mới bị từ chối.' },
    { en: 'A static Scanner or static list field in Main (rule L5) — pass them as parameters, as the given helpers do.', vi: 'Trường static Scanner hay danh sách static trong Main (luật L5) — truyền chúng qua tham số như các hàm cho sẵn.' },
  ],
  giaiThich: { en: '<p>The manager keeps one private List and never prints; Main owns every sentence and every validation loop. Search and list both return lists (a filtered copy, a sorted copy), so Main prints them with the same helper and the stored order never changes.</p>', vi: '<p>Manager giữ một List private và không bao giờ in; Main giữ mọi câu chữ và mọi vòng kiểm tra. Tìm và liệt kê đều trả danh sách (bản sao đã lọc, bản sao đã sắp), nên Main in bằng cùng một hàm và thứ tự lưu trữ không bao giờ đổi.</p>' },
});

export default moDun({ slug: 'pro192-on-ch2', ten: '2.2 🧪 Practice — memory, classes and constructors: PE and LAB211-style', de: [de1, de2, de3, de4] });
