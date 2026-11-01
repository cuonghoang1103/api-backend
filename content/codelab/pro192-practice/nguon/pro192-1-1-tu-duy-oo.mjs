/** PRO192 · 1.1 — Why objects? Procedural vs OO: từ biến rời rạc sang đối tượng giữ trạng thái + hành vi. */
import { moDun, deJava, c, j, LOI_CHUNG } from './_chung.mjs';

const ACCOUNT_MAIN = j`
import java.util.Scanner;

// GIVEN — do not change. Reads the owner, then one command per line until END.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Account acc = new Account(sc.nextLine().trim());
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split("\\s+");
            if (p[0].equals("END")) {
                break;
            }
            if (p[0].equals("D")) {
                System.out.println(acc.deposit(Long.parseLong(p[1])) ? "Deposited " + p[1] : "Invalid amount");
            } else if (p[0].equals("W")) {
                System.out.println(acc.withdraw(Long.parseLong(p[1])) ? "Withdrew " + p[1] : "Rejected");
            } else if (p[0].equals("B")) {
                System.out.println(acc.getOwner() + ": " + acc.getBalance());
            } else {
                System.out.println("Unknown command " + p[0]);
            }
        }
        System.out.println("Transactions: " + acc.getCount());
    }
}
`;

const de1 = deJava({
  id: 'pro192-1-1-account',
  tieuDe: { en: 'From global variables to an object: a bank account', vi: 'Từ biến toàn cục sang một đối tượng: tài khoản ngân hàng' },
  doKho: 'EASY', phut: 15,
  khaiNiem: ['class', 'object', 'state + behaviour', 'constructor'],
  moTa: {
    en: `<p>In C (PRF192) a bank balance is a variable and the operations are functions that receive it. In Java the data and the operations that guard it live together in one <b>object</b>. ${c('Main')} is given and complete: it creates one ${c('Account')} and sends it the commands it reads. Write the class ${c('Account')} in ${c('src/Account.java')}.</p>
<ul><li>${c('Account(String owner)')} — balance starts at 0.</li>
<li>${c('boolean deposit(long amount)')} — only a positive amount is accepted; returns whether it was.</li>
<li>${c('boolean withdraw(long amount)')} — accepted when ${c('0 < amount <= balance')}.</li>
<li>${c('long getBalance()')}, ${c('String getOwner()')}, and ${c('int getCount()')} = the number of <b>accepted</b> deposits and withdrawals.</li></ul>`,
    vi: `<p>Trong C (PRF192) số dư là một biến, các thao tác là hàm nhận biến đó. Trong Java dữ liệu và các thao tác canh giữ nó nằm chung trong một <b>đối tượng</b>. ${c('Main')} cho sẵn và đầy đủ: nó tạo một ${c('Account')} và gửi cho nó các lệnh đọc được. Hãy viết lớp ${c('Account')} trong ${c('src/Account.java')}.</p>
<ul><li>${c('Account(String owner)')} — số dư ban đầu là 0.</li>
<li>${c('boolean deposit(long amount)')} — chỉ nhận số tiền dương; trả về có nhận hay không.</li>
<li>${c('boolean withdraw(long amount)')} — nhận khi ${c('0 < amount <= balance')}.</li>
<li>${c('long getBalance()')}, ${c('String getOwner()')}, và ${c('int getCount()')} = số lần nạp/rút <b>được chấp nhận</b>.</li></ul>`,
  },
  yeuCau: {
    en: ['Do not change <code>src/Main.java</code>.', 'Keep the state (owner, balance, count) in fields of <code>Account</code>, not in <code>Main</code>.', 'A rejected operation changes nothing and is not counted.'],
    vi: ['Không sửa <code>src/Main.java</code>.', 'Giữ trạng thái (chủ, số dư, đếm) trong các trường của <code>Account</code>, không để ở <code>Main</code>.', 'Thao tác bị từ chối không đổi gì và không được đếm.'],
  },
  dauVao: { en: 'Line 1: the owner. Then commands: D amount · W amount · B · END.', vi: 'Dòng 1: tên chủ. Sau đó các lệnh: D số · W số · B · END.' },
  dauRa: { en: 'One line per command, as printed by the given Main, then "Transactions: n".', vi: 'Mỗi lệnh một dòng như Main cho sẵn in, cuối cùng "Transactions: n".' },
  main: 'Main',
  tep: {
    'Main.java': ACCOUNT_MAIN,
    'Account.java': j`
// One bank account: the data (owner, balance) and the operations that keep it valid live together.
public class Account {
    private final String owner;
    private long balance;
    private int count;

    public Account(String owner) {
        //>> this.owner = owner; // TODO: keep the owner; the balance starts at 0
        this.owner = owner;
        this.balance = 0;
        //<<
    }

    public boolean deposit(long amount) {
        //>> // TODO: accept only a positive amount, update balance and count ⏎ return false;
        if (amount <= 0) {
            return false;
        }
        balance += amount;
        count++;
        return true;
        //<<
    }

    public boolean withdraw(long amount) {
        //>> // TODO: accept when 0 < amount <= balance ⏎ return false;
        if (amount <= 0 || amount > balance) {
            return false;
        }
        balance -= amount;
        count++;
        return true;
        //<<
    }

    public long getBalance() {
        return balance;
    }

    public String getOwner() {
        return owner;
    }

    public int getCount() {
        //>> return 0; // TODO
        return count;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'deposits, a withdrawal, the balance', vi: 'nạp, rút, xem số dư' }, vao: 'Lan Anh\nD 500\nD 250\nW 100\nB\nEND\n' },
    { ten: { en: 'rejected operations are not counted', vi: 'thao tác bị từ chối không được đếm' }, vao: 'Minh\nW 10\nD 0\nD -5\nD 100\nW 101\nW 100\nB\nEND\n' },
    { ten: { en: 'withdraw exactly the balance', vi: 'rút đúng bằng số dư' }, vao: 'Ha\nD 1000000000\nD 2000000000\nW 3000000000\nB\nW 1\nEND\n', an: true },
    { ten: { en: 'no command at all', vi: 'không có lệnh nào' }, vao: 'Empty Guy\nB\nEND\n', an: true },
  ],
  goiY: [
    { en: 'Three fields: owner, balance, count. deposit and withdraw first check the amount and return false early; only the accepted path changes balance and count.', vi: 'Ba trường: owner, balance, count. deposit và withdraw kiểm số tiền trước và return false sớm; chỉ nhánh được chấp nhận mới đổi balance và count.' },
    { en: 'withdraw: reject when amount <= 0 OR amount > balance. Use long: 1 000 000 000 + 2 000 000 000 overflows an int.', vi: 'withdraw: từ chối khi amount <= 0 HOẶC amount > balance. Dùng long: 1 000 000 000 + 2 000 000 000 tràn int.' },
  ],
  loiHayGap: [
    { en: 'Counting every call (count++ at the top) instead of only the accepted ones.', vi: 'Đếm mọi lần gọi (count++ ở đầu hàm) thay vì chỉ lần được chấp nhận.' },
    { en: 'Using int for the balance — the hidden case deposits three billion.', vi: 'Dùng int cho số dư — ca ẩn nạp ba tỉ.' },
    LOI_CHUNG.tenLop,
  ],
  giaiThich: {
    en: '<p>The object owns its state: <code>balance</code> can only change through <code>deposit</code>/<code>withdraw</code>, which check the amount first — the same rule cannot be forgotten in some other function as it can in C. <code>count</code> is incremented on the accepted path only.</p>',
    vi: '<p>Đối tượng tự giữ trạng thái của nó: <code>balance</code> chỉ đổi qua <code>deposit</code>/<code>withdraw</code>, hai hàm này kiểm số tiền trước — luật không thể bị quên ở một hàm khác như trong C. <code>count</code> chỉ tăng ở nhánh được chấp nhận.</p>',
  },
});

const de2 = deJava({
  id: 'pro192-1-1-rectangles',
  tieuDe: { en: 'One class, many objects: rectangles', vi: 'Một lớp, nhiều đối tượng: hình chữ nhật' },
  doKho: 'EASY', phut: 15,
  khaiNiem: ['class vs object', 'array of objects', 'methods'],
  moTa: {
    en: `<p>A <b>class</b> is the blueprint, an <b>object</b> is one thing built from it — each with its own width and height. Write ${c('src/Rectangle.java')} and finish ${c('src/Main.java')}.</p>
<ul><li>${c('Rectangle(int width, int height)')}, ${c('int area()')}, ${c('int perimeter()')}, ${c('boolean isSquare()')}.</li>
<li>${c('Main')} reads ${c('n')}, then ${c('n')} lines ${c('width height')}, stores the rectangles in a ${c('Rectangle[]')}, prints one line per rectangle and then the number (1-based) of the rectangle with the largest area — the first one on a tie.</li></ul>
<p>Line format: ${c('#1 3x4 area=12 perimeter=14')}, plus ${c(' square')} at the end for a square. Last line: ${c('Largest: #2')}. When ${c('n')} is 0 print only ${c('No rectangles')}.</p>`,
    vi: `<p><b>Lớp</b> là bản thiết kế, <b>đối tượng</b> là một vật dựng từ nó — mỗi cái có chiều rộng, chiều cao riêng. Viết ${c('src/Rectangle.java')} và hoàn thành ${c('src/Main.java')}.</p>
<ul><li>${c('Rectangle(int width, int height)')}, ${c('int area()')}, ${c('int perimeter()')}, ${c('boolean isSquare()')}.</li>
<li>${c('Main')} đọc ${c('n')}, rồi ${c('n')} dòng ${c('width height')}, cất các hình vào một ${c('Rectangle[]')}, in mỗi hình một dòng, cuối cùng in số thứ tự (từ 1) của hình có diện tích lớn nhất — hoà thì lấy hình đầu tiên.</li></ul>
<p>Dạng dòng: ${c('#1 3x4 area=12 perimeter=14')}, thêm ${c(' square')} ở cuối nếu là hình vuông. Dòng cuối: ${c('Largest: #2')}. Khi ${c('n')} bằng 0 chỉ in ${c('No rectangles')}.</p>`,
  },
  yeuCau: {
    en: ['Keep width/height inside <code>Rectangle</code>; Main only calls its methods.', 'Store the objects in an array before printing.'],
    vi: ['Giữ width/height trong <code>Rectangle</code>; Main chỉ gọi phương thức của nó.', 'Cất các đối tượng vào mảng trước khi in.'],
  },
  dauVao: { en: 'n, then n lines "width height" (positive integers).', vi: 'n, rồi n dòng "width height" (số nguyên dương).' },
  dauRa: { en: 'n lines "#i WxH area=… perimeter=…[ square]" then "Largest: #k".', vi: 'n dòng "#i WxH area=… perimeter=…[ square]" rồi "Largest: #k".' },
  main: 'Main',
  tep: {
    'Rectangle.java': j`
// The blueprint: every Rectangle object has its own width and height.
public class Rectangle {
    private final int width;
    private final int height;

    public Rectangle(int width, int height) {
        this.width = width;
        this.height = height;
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }

    public int area() {
        //>> return 0; // TODO
        return width * height;
        //<<
    }

    public int perimeter() {
        //>> return 0; // TODO
        return 2 * (width + height);
        //<<
    }

    public boolean isSquare() {
        //>> return false; // TODO
        return width == height;
        //<<
    }
}
`,
    'Main.java': j`
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        //>> // TODO: read n rectangles into an array, print each one, then the largest
        if (n == 0) {
            System.out.println("No rectangles");
            return;
        }
        Rectangle[] list = new Rectangle[n];
        for (int i = 0; i < n; i++) {
            String[] p = sc.nextLine().trim().split("\\s+");
            list[i] = new Rectangle(Integer.parseInt(p[0]), Integer.parseInt(p[1]));
        }
        int best = 0;
        for (int i = 0; i < n; i++) {
            Rectangle r = list[i];
            System.out.println("#" + (i + 1) + " " + r.getWidth() + "x" + r.getHeight() + " area=" + r.area()
                    + " perimeter=" + r.perimeter() + (r.isSquare() ? " square" : ""));
            if (r.area() > list[best].area()) {
                best = i;
            }
        }
        System.out.println("Largest: #" + (best + 1));
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'three rectangles, one square', vi: 'ba hình, một hình vuông' }, vao: '3\n3 4\n5 5\n2 10\n' },
    { ten: { en: 'no rectangle', vi: 'không có hình nào' }, vao: '0\n' },
    { ten: { en: 'tie on the largest area keeps the first', vi: 'hoà diện tích lớn nhất giữ hình đầu' }, vao: '4\n2 6\n4 3\n1 1\n12 1\n', an: true },
    { ten: { en: 'one rectangle', vi: 'một hình' }, vao: '1\n7 7\n', an: true },
  ],
  goiY: [
    { en: 'Rectangle[] list = new Rectangle[n]; then list[i] = new Rectangle(w, h) inside the loop — the array starts full of null.', vi: 'Rectangle[] list = new Rectangle[n]; rồi list[i] = new Rectangle(w, h) trong vòng lặp — mảng mới tạo toàn null.' },
    { en: 'Track the index of the best rectangle; update it only with a strictly greater area (>), so the first one wins a tie.', vi: 'Giữ chỉ số hình tốt nhất; chỉ cập nhật khi diện tích LỚN HƠN hẳn (>), nên hoà thì hình đầu thắng.' },
  ],
  loiHayGap: [
    { en: 'Using >= when looking for the largest area — the last of the tied rectangles wins and the hidden case fails.', vi: 'Dùng >= khi tìm diện tích lớn nhất — hình hoà cuối cùng thắng, ca ẩn trượt.' },
    { en: 'Forgetting n = 0 — printing "Largest: #1" with no rectangle (or an ArrayIndexOutOfBoundsException).', vi: 'Quên n = 0 — in "Largest: #1" khi không có hình (hoặc ArrayIndexOutOfBoundsException).' },
    LOI_CHUNG.inThem,
  ],
  giaiThich: {
    en: '<p>One class, <code>n</code> objects: every <code>new Rectangle(w, h)</code> creates its own pair of fields, and <code>r.area()</code> works on the fields of <code>r</code> only. The array holds references; the loop finds the index of the largest area with a strict comparison.</p>',
    vi: '<p>Một lớp, <code>n</code> đối tượng: mỗi <code>new Rectangle(w, h)</code> tạo một cặp trường riêng, và <code>r.area()</code> chỉ làm việc trên trường của <code>r</code>. Mảng giữ các tham chiếu; vòng lặp tìm chỉ số có diện tích lớn nhất bằng phép so sánh chặt.</p>',
  },
});

const de3 = deJava({
  id: 'pro192-1-1-students',
  tieuDe: { en: 'Procedural vs OO: a student report', vi: 'Thủ tục hay đối tượng: bảng điểm sinh viên' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['class', 'methods computing from fields', 'String.format'],
  moTa: {
    en: `<p>The procedural version of this report keeps four parallel arrays (names, three marks) and one function per computation. Rewrite it with a ${c('Student')} class that knows its own average and grade.</p>
<ul><li>${c('Student(String name, double m1, double m2, double m3)')}; ${c('double average()')} = the mean of the three marks; ${c('String grade()')}: A when average ≥ 8.5, B ≥ 7.0, C ≥ 5.5, D ≥ 4.0, otherwise F.</li>
<li>${c('Main')} reads ${c('n')} then ${c('n')} lines ${c('name;m1;m2;m3')} (the name may contain spaces), prints a table and the best student (highest average, first on a tie).</li></ul>
<p>Row format: ${c('String.format("%-12s %5.2f %s", name, average, grade)')}. After the rows: ${c('Best: <name> (<average with 2 decimals>)')}.</p>`,
    vi: `<p>Bản thủ tục của bảng điểm này giữ bốn mảng song song (tên, ba điểm) và mỗi phép tính một hàm. Hãy viết lại với lớp ${c('Student')} tự biết điểm trung bình và xếp loại của nó.</p>
<ul><li>${c('Student(String name, double m1, double m2, double m3)')}; ${c('double average()')} = trung bình ba điểm; ${c('String grade()')}: A khi trung bình ≥ 8.5, B ≥ 7.0, C ≥ 5.5, D ≥ 4.0, còn lại F.</li>
<li>${c('Main')} đọc ${c('n')} rồi ${c('n')} dòng ${c('name;m1;m2;m3')} (tên có thể có dấu cách), in bảng và sinh viên giỏi nhất (trung bình cao nhất, hoà lấy người đầu).</li></ul>
<p>Dạng dòng: ${c('String.format("%-12s %5.2f %s", name, average, grade)')}. Sau các dòng: ${c('Best: <tên> (<trung bình 2 chữ số thập phân>)')}.</p>`,
  },
  yeuCau: {
    en: ['average() and grade() are methods of Student — Main does not compute marks.', 'Split each line on ";" so names with spaces survive.'],
    vi: ['average() và grade() là phương thức của Student — Main không tự tính điểm.', 'Tách mỗi dòng theo ";" để tên có dấu cách không bị vỡ.'],
  },
  dauVao: { en: 'n, then n lines "name;m1;m2;m3" (marks 0..10).', vi: 'n, rồi n dòng "name;m1;m2;m3" (điểm 0..10).' },
  dauRa: { en: 'n table rows, then "Best: …".', vi: 'n dòng bảng, rồi "Best: …".' },
  main: 'Main',
  tep: {
    'Student.java': j`
// A student knows its own marks, so it can compute its own average and grade.
public class Student {
    private final String name;
    private final double m1;
    private final double m2;
    private final double m3;

    public Student(String name, double m1, double m2, double m3) {
        this.name = name;
        this.m1 = m1;
        this.m2 = m2;
        this.m3 = m3;
    }

    public String getName() {
        return name;
    }

    public double average() {
        //>> return 0; // TODO
        return (m1 + m2 + m3) / 3;
        //<<
    }

    public String grade() {
        //>> return "?"; // TODO: A >= 8.5, B >= 7.0, C >= 5.5, D >= 4.0, else F
        double a = average();
        if (a >= 8.5) {
            return "A";
        } else if (a >= 7.0) {
            return "B";
        } else if (a >= 5.5) {
            return "C";
        } else if (a >= 4.0) {
            return "D";
        }
        return "F";
        //<<
    }
}
`,
    'Main.java': j`
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        Student[] list = new Student[n];
        for (int i = 0; i < n; i++) {
            String[] p = sc.nextLine().split(";");
            list[i] = new Student(p[0].trim(), Double.parseDouble(p[1].trim()), Double.parseDouble(p[2].trim()),
                    Double.parseDouble(p[3].trim()));
        }
        //>> // TODO: print one row per student, then "Best: name (avg)"
        Student best = null;
        for (Student s : list) {
            System.out.println(String.format("%-12s %5.2f %s", s.getName(), s.average(), s.grade()));
            if (best == null || s.average() > best.average()) {
                best = s;
            }
        }
        if (best != null) {
            System.out.println(String.format("Best: %s (%.2f)", best.getName(), best.average()));
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'four students, every grade boundary near', vi: 'bốn sinh viên, gần các mốc xếp loại' }, vao: '4\nNguyen Van An;9;8.5;8\nTran Thi Binh;7;7;7\nLe Hoa;5.5;5.5;5.6\nPham Quoc Huy;3;4;5\n' },
    { ten: { en: 'exact boundaries 8.5 and 4.0', vi: 'đúng mốc 8.5 và 4.0' }, vao: '2\nMai;8.5;8.5;8.5\nTuan;4;4;4\n' },
    { ten: { en: 'tie on the best average', vi: 'hoà trung bình cao nhất' }, vao: '3\nA;6;7;8\nB;8;7;6\nC;10;0;5\n', an: true },
    { ten: { en: 'below 4 is F', vi: 'dưới 4 là F' }, vao: '1\nKhanh;0;3.9;4\n', an: true },
  ],
  goiY: [
    { en: 'grade() can call average() — the object asks itself. Test the thresholds from the highest down: if (a >= 8.5) … else if (a >= 7.0) …', vi: 'grade() có thể gọi average() — đối tượng tự hỏi chính nó. Xét các mốc từ cao xuống: if (a >= 8.5) … else if (a >= 7.0) …' },
    { en: '"%-12s" pads the name to 12 characters on the left side; "%5.2f" prints the average in 5 characters with 2 decimals.', vi: '"%-12s" đệm tên thành 12 ký tự, căn trái; "%5.2f" in trung bình rộng 5 ký tự, 2 chữ số thập phân.' },
  ],
  loiHayGap: [
    { en: 'Splitting the line on spaces — "Nguyen Van An" becomes three tokens and the marks are read from the wrong positions.', vi: 'Tách dòng theo dấu cách — "Nguyen Van An" thành ba mảnh, điểm bị đọc sai vị trí.' },
    { en: 'Testing the grades from the lowest up (if a >= 4.0 → D first): every passing student becomes D.', vi: 'Xét xếp loại từ thấp lên (if a >= 4.0 → D trước): mọi sinh viên qua môn đều thành D.' },
    { en: 'Integer division: (m1 + m2 + m3) / 3 with int marks loses the decimals — the marks are double here.', vi: 'Chia nguyên: (m1 + m2 + m3) / 3 với điểm kiểu int mất phần lẻ — ở đây điểm là double.' },
  ],
  giaiThich: {
    en: '<p>Each <code>Student</code> carries its three marks, so <code>average()</code> and <code>grade()</code> need no parameters — compare with the procedural version where every function receives the arrays and an index. Main only reads, creates objects and prints.</p>',
    vi: '<p>Mỗi <code>Student</code> mang ba điểm của nó, nên <code>average()</code> và <code>grade()</code> không cần tham số — so với bản thủ tục, nơi mọi hàm nhận các mảng và một chỉ số. Main chỉ đọc, tạo đối tượng và in.</p>',
  },
});

export default moDun({ slug: 'pro192-1-1-tu-duy-oo', ten: '1.1 Why objects? Procedural vs OO', de: [de1, de2, de3] });
