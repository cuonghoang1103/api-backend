/** PRO192 · 5.2 🧪 — interface và lớp trừu tượng kiểu PE: đề 10 điểm (IEmployee), câu 4 IWord, Comparator, interface hay abstract. */
import { moDun, deJava, c, j, LOI_CHUNG } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-on-ch5-iemployee',
  tieuDe: { en: 'A 10-mark PE paper: IEmployee, Staff, FullTime, PartTime', vi: 'Đề PE 10 điểm: IEmployee, Staff, FullTime, PartTime' },
  doKho: 'HARD', phut: 45,
  khaiNiem: ['interface', 'abstract class implementing an interface', 'concrete subclasses', 'polymorphic list'],
  moTa: {
    en: `<p>Write four types (the given ${c('Main')} drives them):</p>
<pre>interface IEmployee        double getSalary();  String getInfo();
abstract class Staff implements IEmployee
    - id : String, - name : String
    + Staff(id, name)
    + getInfo() : String      // "F01 | Nguyen An | 12,500,000.00"  (salary with %,.2f)
FullTime extends Staff      - base : double, - bonus : double     salary = base + bonus
PartTime extends Staff      - hours : int,   - rate : double      salary = hours * rate,
                                                                  hours above 160 paid 1.5 * rate</pre>
<p>${c('getInfo()')} is written <b>once</b>, in ${c('Staff')}, and calls the abstract ${c('getSalary()')}. Main reads the staff list then a test case: TC1 prints every ${c('getInfo()')}, TC2 the total salary, TC3 the best-paid employee (first on a tie).</p>`,
    vi: `<p>Viết bốn kiểu (Main cho sẵn điều khiển chúng) theo khung trên. ${c('getInfo()')} viết <b>một lần</b>, trong ${c('Staff')}, và gọi ${c('getSalary()')} trừu tượng. Main đọc danh sách nhân viên rồi một ca thử: TC1 in mọi ${c('getInfo()')}, TC2 tổng lương, TC3 người lương cao nhất (hoà lấy người đầu). PartTime: giờ vượt 160 trả 1.5 × rate.</p>
<pre>interface IEmployee        double getSalary();  String getInfo();
abstract class Staff implements IEmployee   (id, name; getInfo dùng %,.2f)
FullTime extends Staff      lương = base + bonus
PartTime extends Staff      lương = hours * rate, giờ trên 160 tính 1.5 * rate</pre>`,
  },
  yeuCau: { en: ['Do not change Main.java.', 'Staff is abstract and does not implement getSalary().'], vi: ['Không sửa Main.java.', 'Staff là abstract và không cài getSalary().'] },
  dauVao: { en: 'n, n lines F;id;name;base;bonus or P;id;name;hours;rate, then TC.', vi: 'n, n dòng F;id;tên;base;bonus hoặc P;id;tên;giờ;đơn giá, rồi TC.' },
  dauRa: { en: 'OUTPUT of the chosen TC.', vi: 'OUTPUT của TC đã chọn.' },
  main: 'Main', kiem: true,
  tep: {
    'Main.java': j`
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

// GIVEN by the paper — do not change.
public class Main {
    public static void main(String[] args) {
        System.out.println(Kiem.kieu("Staff") + " | " + Kiem.phuongThuc("Staff", "getSalary", 0));
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        List<IEmployee> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            String[] p = sc.nextLine().split(";");
            if (p[0].equals("F")) {
                list.add(new FullTime(p[1], p[2], Double.parseDouble(p[3]), Double.parseDouble(p[4])));
            } else {
                list.add(new PartTime(p[1], p[2], Integer.parseInt(p[3]), Double.parseDouble(p[4])));
            }
        }
        System.out.print("Enter TC (1, 2 or 3): ");
        int tc = Integer.parseInt(sc.nextLine().trim());
        System.out.println();
        System.out.println("OUTPUT:");
        if (tc == 1) {
            for (IEmployee e : list) {
                System.out.println(e.getInfo());
            }
        } else if (tc == 2) {
            double total = 0;
            for (IEmployee e : list) {
                total += e.getSalary();
            }
            System.out.println(String.format("%,.2f", total));
        } else {
            IEmployee best = null;
            for (IEmployee e : list) {
                if (best == null || e.getSalary() > best.getSalary()) {
                    best = e;
                }
            }
            System.out.println(best == null ? "No employee" : best.getInfo());
        }
    }
}
`,
    'IEmployee.java': j`
public interface IEmployee {
    //>> // TODO: double getSalary(); String getInfo();
    double getSalary();

    String getInfo();
    //<<
}
`,
    'Staff.java': j`
//>> public class Staff { // TODO: abstract, implements IEmployee, getInfo() written once ⏎     public Staff(String id, String name) { ⏎     } ⏎ }
public abstract class Staff implements IEmployee {
    private final String id;
    private final String name;

    public Staff(String id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public String getInfo() {
        return id + " | " + name + " | " + String.format("%,.2f", getSalary());
    }
}
//<<
`,
    'FullTime.java': j`
//>> public class FullTime extends Staff { // TODO ⏎     public FullTime(String id, String name, double base, double bonus) { ⏎         super(id, name); ⏎     } ⏎ }
public class FullTime extends Staff {
    private final double base;
    private final double bonus;

    public FullTime(String id, String name, double base, double bonus) {
        super(id, name);
        this.base = base;
        this.bonus = bonus;
    }

    @Override
    public double getSalary() {
        return base + bonus;
    }
}
//<<
`,
    'PartTime.java': j`
//>> public class PartTime extends Staff { // TODO ⏎     public PartTime(String id, String name, int hours, double rate) { ⏎         super(id, name); ⏎     } ⏎ }
public class PartTime extends Staff {
    private static final int NORMAL_HOURS = 160;
    private final int hours;
    private final double rate;

    public PartTime(String id, String name, int hours, double rate) {
        super(id, name);
        this.hours = hours;
        this.rate = rate;
    }

    @Override
    public double getSalary() {
        int normal = Math.min(hours, NORMAL_HOURS);
        int extra = hours - normal;
        return normal * rate + extra * rate * 1.5;
    }
}
//<<
`,
  },
  khoiDau: {
    'Staff.java': j`
public abstract class Staff implements IEmployee {
    // TODO: private id and name

    public Staff(String id, String name) {
        // TODO
    }

    // TODO: getInfo() — written ONCE here: "F01 | Nguyen An | 12,500,000.00"
    @Override
    public String getInfo() {
        return "";
    }
}
`,
    'FullTime.java': j`
public class FullTime extends Staff {
    // TODO: base and bonus

    public FullTime(String id, String name, double base, double bonus) {
        super(id, name);
    }

    @Override
    public double getSalary() {
        return 0; // TODO: base + bonus
    }
}
`,
    'PartTime.java': j`
public class PartTime extends Staff {
    // TODO: hours and rate

    public PartTime(String id, String name, int hours, double rate) {
        super(id, name);
    }

    @Override
    public double getSalary() {
        return 0; // TODO: hours above 160 are paid 1.5 * rate
    }
}
`,
    'IEmployee.java': j`
public interface IEmployee {
    // TODO: the contract — two methods
    double getSalary();

    String getInfo();
}
`,
  },
  ca: [
    { ten: { en: 'TC1: every employee', vi: 'TC1: mọi nhân viên' }, vao: '3\nF;F01;Nguyen An;10000000;2500000\nP;P01;Tran Binh;120;50000\nP;P02;Le Chi;170;40000\n1\n' },
    { ten: { en: 'TC2: total salary', vi: 'TC2: tổng lương' }, vao: '2\nF;F02;Pham Dung;8000000;0\nP;P03;Hoang Em;160;60000\n2\n' },
    { ten: { en: 'TC3: best paid, tie keeps the first', vi: 'TC3: lương cao nhất, hoà lấy người đầu' }, vao: '3\nF;F03;A;9600000;0\nP;P04;B;160;60000\nF;F04;C;1;2\n3\n', an: true },
    { ten: { en: 'TC3 on an empty list', vi: 'TC3 trên danh sách rỗng' }, vao: '0\n3\n', an: true },
  ],
  goiY: [
    { en: 'Staff implements IEmployee but leaves getSalary() unimplemented — that is allowed because Staff is abstract.', vi: 'Staff implements IEmployee nhưng để getSalary() chưa cài — được phép vì Staff là abstract.' },
    { en: 'String.format("%,.2f", 12500000.0) gives "12,500,000.00" (the grader runs with an English locale).', vi: 'String.format("%,.2f", 12500000.0) cho "12,500,000.00" (máy chấm chạy với locale tiếng Anh).' },
  ],
  loiHayGap: [
    { en: 'Writing getInfo() in both subclasses — two copies of the same format.', vi: 'Viết getInfo() ở cả hai lớp con — hai bản của cùng một định dạng.' },
    { en: 'Paying ALL hours at 1.5× once a part-timer passes 160.', vi: 'Trả 1.5× cho TẤT CẢ số giờ khi nhân viên bán thời gian vượt 160.' },
    { en: 'Running on a Vietnamese-locale PC in NetBeans prints "12.500.000,00" — the grader fixes the locale to English, the exam room’s Main does the same.', vi: 'Chạy trên máy locale tiếng Việt trong NetBeans in "12.500.000,00" — máy chấm cố định locale tiếng Anh, Main của phòng thi cũng vậy.' },
  ],
  giaiThich: { en: '<p>The interface states WHAT an employee offers; the abstract class supplies the shared part (fields + getInfo) and defers getSalary; each concrete class supplies only its own pay rule. Main works on <code>List&lt;IEmployee&gt;</code> and never asks which kind.</p>', vi: '<p>Interface nói nhân viên cung cấp GÌ; lớp trừu tượng cho phần chung (trường + getInfo) và để getSalary lại; mỗi lớp cụ thể chỉ cho luật lương của nó. Main làm việc trên <code>List&lt;IEmployee&gt;</code> và không hỏi loại nào.</p>' },
});

const de2 = deJava({
  id: 'pro192-on-ch5-iword',
  tieuDe: { en: 'PE question 4: implement the given IWord', vi: 'Câu 4 PE: cài đặt IWord đề cho' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['implements a given interface', 'palindrome', 'sorting words with a Comparator'],
  moTa: {
    en: `<p>${c('IWord')} and ${c('Main')} are given. Write ${c('MyWord implements IWord')}:</p>
<ul><li>${c('int f1(String str)')} — the number of words that are palindromes of length ≥ 2, ignoring case (${c('"Anna"')}, ${c('"level"')}, ${c('"Noon"')}).</li>
<li>${c('String f2(String str)')} — the words sorted by length (shortest first), equal lengths in alphabetical order (case-insensitive), joined by one space.</li></ul>`,
    vi: `<p>${c('IWord')} và ${c('Main')} cho sẵn. Viết ${c('MyWord implements IWord')}:</p>
<ul><li>${c('int f1(String str)')} — số từ là palindrome dài ≥ 2, không phân biệt hoa thường (${c('"Anna"')}, ${c('"level"')}, ${c('"Noon"')}).</li>
<li>${c('String f2(String str)')} — các từ sắp theo độ dài (ngắn trước), cùng độ dài thì theo bảng chữ cái (không phân biệt hoa thường), nối bằng một dấu cách.</li></ul>`,
  },
  yeuCau: { en: ['Do not change IWord.java or Main.java.', 'Words are separated by one or more spaces; a blank string gives 0 and "".'], vi: ['Không sửa IWord.java hay Main.java.', 'Các từ cách nhau một hoặc nhiều dấu cách; chuỗi trống cho 0 và "".'] },
  dauVao: { en: 'Pairs: TC and a string.', vi: 'Từng cặp: TC và một chuỗi.' },
  dauRa: { en: 'OUTPUT blocks.', vi: 'Các khối OUTPUT.' },
  main: 'Main',
  tep: {
    'IWord.java': j`
// GIVEN by the paper — do not change.
public interface IWord {
    int f1(String str);

    String f2(String str);
}
`,
    'Main.java': j`
import java.util.Scanner;

// GIVEN by the paper — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        IWord t = new MyWord();
        while (sc.hasNextLine()) {
            System.out.print("Enter TC (1 or 2): ");
            int tc = Integer.parseInt(sc.nextLine().trim());
            System.out.print("Enter a string: ");
            String s = sc.nextLine();
            System.out.println();
            System.out.println("OUTPUT:");
            System.out.println(tc == 1 ? String.valueOf(t.f1(s)) : t.f2(s));
        }
    }
}
`,
    'MyWord.java': j`
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class MyWord implements IWord {
    private static String[] words(String str) {
        return str == null || str.trim().isEmpty() ? new String[0] : str.trim().split("\\s+");
    }

    @Override
    public int f1(String str) {
        //>> return 0; // TODO
        int count = 0;
        for (String w : words(str)) {
            String lower = w.toLowerCase();
            if (w.length() >= 2 && new StringBuilder(lower).reverse().toString().equals(lower)) {
                count++;
            }
        }
        return count;
        //<<
    }

    @Override
    public String f2(String str) {
        //>> return str; // TODO
        List<String> list = new ArrayList<>(Arrays.asList(words(str)));
        Collections.sort(list, new Comparator<String>() {
            @Override
            public int compare(String a, String b) {
                int byLength = Integer.compare(a.length(), b.length());
                return byLength != 0 ? byLength : a.compareToIgnoreCase(b);
            }
        });
        StringBuilder sb = new StringBuilder();
        for (String w : list) {
            if (sb.length() > 0) {
                sb.append(' ');
            }
            sb.append(w);
        }
        return sb.toString();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'palindromes', vi: 'palindrome' }, vao: '1\nAnna saw a level racecar at Noon\n' },
    { ten: { en: 'sort by length then alphabet', vi: 'sắp theo độ dài rồi chữ cái' }, vao: '2\npear fig Apple kiwi banana Date\n' },
    { ten: { en: 'blank and single letters', vi: 'chuỗi trống và chữ đơn' }, vao: '1\n   \n2\n\n1\na b c aa\n', an: true },
    { ten: { en: 'mixed case ties', vi: 'hoà khi lẫn hoa thường' }, vao: '2\n  bb   Ab aB  c B a \n', an: true },
  ],
  goiY: [
    { en: 'Palindrome: compare the lower-cased word with its reverse (new StringBuilder(w).reverse().toString()).', vi: 'Palindrome: so từ đã viết thường với bản đảo của nó (new StringBuilder(w).reverse().toString()).' },
    { en: 'A Comparator with two keys: Integer.compare of the lengths, then compareToIgnoreCase.', vi: 'Comparator hai khoá: Integer.compare độ dài, rồi compareToIgnoreCase.' },
  ],
  loiHayGap: [
    { en: 'Counting one-letter words ("a") as palindromes — the task says length ≥ 2.', vi: 'Đếm từ một chữ ("a") là palindrome — đề nói độ dài ≥ 2.' },
    { en: 'Sorting with compareTo (case-sensitive): "Apple" goes before "Date" correctly, but "aB" vs "Ab" order changes.', vi: 'Sắp bằng compareTo (phân biệt hoa thường): thứ tự "aB" và "Ab" bị đổi.' },
    LOI_CHUNG.inThem,
  ],
  giaiThich: { en: '<p>The paper fixes the interface; you only supply the class. A private helper does the tokenisation once (with the blank guard), f1 tests each word against its reverse, f2 sorts with a two-key Comparator and joins with single spaces.</p>', vi: '<p>Đề cố định interface; bạn chỉ cung cấp lớp. Một hàm phụ private tách từ một lần (kèm chặn chuỗi trống), f1 so mỗi từ với bản đảo của nó, f2 sắp bằng Comparator hai khoá và nối bằng một dấu cách.</p>' },
});

const de3 = deJava({
  id: 'pro192-on-ch5-comparator',
  tieuDe: { en: 'Sorting with interfaces you did not write: Comparator classes', vi: 'Sắp xếp bằng interface của người khác: các lớp Comparator' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['Comparator<T>', 'several orders for one class', 'Collections.sort(list, comparator)', 'reversed order'],
  moTa: {
    en: `<p>${c('Book')} has no natural order — the library needs several. Write three classes implementing ${c('java.util.Comparator<Book>')}:</p>
<ul><li>${c('ByYearDesc')} — newest first; same year → title A–Z (case-insensitive).</li>
<li>${c('ByAuthorLastName')} — by the <b>last word</b> of the author’s name (A–Z, case-insensitive), then title.</li>
<li>${c('ByTitleLength')} — shortest title first; equal lengths keep their original order (Collections.sort is stable — return 0).</li></ul>
<p>The given ${c('Main')} reads books and prints the list in each order.</p>`,
    vi: `<p>${c('Book')} không có thứ tự tự nhiên — thư viện cần nhiều thứ tự. Viết ba lớp cài ${c('java.util.Comparator<Book>')}:</p>
<ul><li>${c('ByYearDesc')} — mới nhất trước; cùng năm → tên A–Z (không phân biệt hoa thường).</li>
<li>${c('ByAuthorLastName')} — theo <b>từ cuối</b> của tên tác giả (A–Z, không phân biệt hoa thường), rồi tên sách.</li>
<li>${c('ByTitleLength')} — tên ngắn trước; dài bằng nhau giữ thứ tự ban đầu (Collections.sort ổn định — trả 0).</li></ul>
<p>${c('Main')} cho sẵn đọc sách và in danh sách theo từng thứ tự.</p>`,
  },
  yeuCau: { en: ['Do not change Book.java or Main.java.'], vi: ['Không sửa Book.java hay Main.java.'] },
  dauVao: { en: 'Lines title;author;year.', vi: 'Các dòng tên;tác giả;năm.' },
  dauRa: { en: 'Three sorted lists.', vi: 'Ba danh sách đã sắp.' },
  main: 'Main',
  tep: {
    'Book.java': j`
// GIVEN — do not change.
public class Book {
    private final String title;
    private final String author;
    private final int year;

    public Book(String title, String author, int year) {
        this.title = title;
        this.author = author;
        this.year = year;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public int getYear() {
        return year;
    }

    @Override
    public String toString() {
        return title + " / " + author + " / " + year;
    }
}
`,
    'Main.java': j`
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Book> books = new ArrayList<>();
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().split(";");
            books.add(new Book(p[0].trim(), p[1].trim(), Integer.parseInt(p[2].trim())));
        }
        List<Comparator<Book>> orders = new ArrayList<>();
        orders.add(new ByYearDesc());
        orders.add(new ByAuthorLastName());
        orders.add(new ByTitleLength());
        for (Comparator<Book> order : orders) {
            List<Book> copy = new ArrayList<>(books);
            Collections.sort(copy, order);
            System.out.println("== " + order.getClass().getSimpleName());
            for (Book b : copy) {
                System.out.println(b);
            }
        }
    }
}
`,
    'ByYearDesc.java': j`
import java.util.Comparator;

public class ByYearDesc implements Comparator<Book> {
    @Override
    public int compare(Book a, Book b) {
        //>> return 0; // TODO
        int byYear = Integer.compare(b.getYear(), a.getYear());
        return byYear != 0 ? byYear : a.getTitle().compareToIgnoreCase(b.getTitle());
        //<<
    }
}
`,
    'ByAuthorLastName.java': j`
import java.util.Comparator;

public class ByAuthorLastName implements Comparator<Book> {
    //>> // TODO: a private helper lastName(String author)
    private static String lastName(String author) {
        String[] parts = author.trim().split("\\s+");
        return parts[parts.length - 1];
    }
    //<<

    @Override
    public int compare(Book a, Book b) {
        //>> return 0; // TODO
        int byLast = lastName(a.getAuthor()).compareToIgnoreCase(lastName(b.getAuthor()));
        return byLast != 0 ? byLast : a.getTitle().compareToIgnoreCase(b.getTitle());
        //<<
    }
}
`,
    'ByTitleLength.java': j`
import java.util.Comparator;

public class ByTitleLength implements Comparator<Book> {
    @Override
    public int compare(Book a, Book b) {
        //>> return 0; // TODO
        return Integer.compare(a.getTitle().length(), b.getTitle().length());
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'five books', vi: 'năm cuốn sách' }, vao: 'Clean Code;Robert C. Martin;2008\nRefactoring;Martin Fowler;2018\nEffective Java;Joshua Bloch;2018\nThe Pragmatic Programmer;David Thomas;2019\nJava Puzzlers;Joshua Bloch;2005\n' },
    { ten: { en: 'same last names, same lengths, same years', vi: 'cùng họ, cùng độ dài, cùng năm' }, vao: 'beta;Anna Smith;2000\nAlpha;john smith;2000\nGamma;Zed Adams;2000\nDelta;Bob  Smith ;1999\n', an: true },
  ],
  goiY: [
    { en: 'A Comparator returns negative / 0 / positive like compareTo; Integer.compare(b.getYear(), a.getYear()) gives newest first.', vi: 'Comparator trả âm / 0 / dương như compareTo; Integer.compare(b.getYear(), a.getYear()) cho mới nhất trước.' },
    { en: 'Last name: author.trim().split("\\\\s+") and take the last element.', vi: 'Họ (từ cuối): author.trim().split("\\\\s+") rồi lấy phần tử cuối.' },
  ],
  loiHayGap: [
    { en: 'Breaking the tie in ByTitleLength by title — the task asks to keep the original order (return 0 and rely on the stable sort).', vi: 'Phá hoà trong ByTitleLength bằng tên — đề yêu cầu giữ thứ tự ban đầu (trả 0 và dựa vào sắp xếp ổn định).' },
    { en: 'Splitting the author on " " — "Bob  Smith " gives an empty last part.', vi: 'Tách tên tác giả theo " " — "Bob  Smith " cho phần cuối rỗng.' },
  ],
  giaiThich: { en: '<p>Comparable gives a class ONE natural order; Comparator objects let callers choose any number of orders without changing the class. Each comparator is a tiny strategy object, passed to Collections.sort.</p>', vi: '<p>Comparable cho lớp MỘT thứ tự tự nhiên; các đối tượng Comparator cho nơi gọi chọn bao nhiêu thứ tự cũng được mà không sửa lớp. Mỗi comparator là một đối tượng chiến lược nhỏ, đưa cho Collections.sort.</p>' },
});

const de4 = deJava({
  id: 'pro192-on-ch5-payable',
  tieuDe: { en: 'Interface or abstract class? A payroll that also pays invoices', vi: 'Interface hay lớp trừu tượng? Bảng lương trả cả hoá đơn' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['interface across unrelated classes', 'abstract class for a family', 'one loop over a contract'],
  moTa: {
    en: `<p>The club pays employees <b>and</b> suppliers’ invoices. Employees share data and code (an abstract class is right); an invoice is not an employee at all — what they share is only "can be paid" (an interface is right).</p>
<ul><li>${c('interface Payable { long amountDue(); String payee(); }')}</li>
<li>${c('abstract class Employee implements Payable')} (name; ${c('payee()')} returns the name) with ${c('Salaried(name, monthly)')} and ${c('Hourly(name, hours, rate)')}.</li>
<li>${c('Invoice(String supplier, int quantity, long unitPrice)')} implements ${c('Payable')} directly: amount = quantity × unitPrice, payee = ${c('"supplier " + supplier')}.</li>
<li>${c('PayRun.run(Payable[] items)')} returns the lines ${c('"Pay 1500000 to An"')} in input order plus a last line ${c('"TOTAL 9999"')}.</li></ul>`,
    vi: `<p>CLB trả lương nhân viên <b>và</b> hoá đơn nhà cung cấp. Nhân viên có dữ liệu và code chung (lớp trừu tượng là đúng); hoá đơn hoàn toàn không phải nhân viên — thứ chung duy nhất là "trả tiền được" (interface là đúng).</p>
<ul><li>${c('interface Payable { long amountDue(); String payee(); }')}</li>
<li>${c('abstract class Employee implements Payable')} (tên; ${c('payee()')} trả tên) với ${c('Salaried(name, monthly)')} và ${c('Hourly(name, hours, rate)')}.</li>
<li>${c('Invoice(String supplier, int quantity, long unitPrice)')} cài thẳng ${c('Payable')}: số tiền = số lượng × đơn giá, payee = ${c('"supplier " + supplier')}.</li>
<li>${c('PayRun.run(Payable[] items)')} trả các dòng ${c('"Pay 1500000 to An"')} theo thứ tự đầu vào, cộng dòng cuối ${c('"TOTAL 9999"')}.</li></ul>`,
  },
  yeuCau: { en: ['PayRun knows only Payable.', 'Invoice does not extend Employee.'], vi: ['PayRun chỉ biết Payable.', 'Invoice không extends Employee.'] },
  dauVao: { en: 'Lines S;name;monthly · H;name;hours;rate · I;supplier;qty;unit.', vi: 'Các dòng S;tên;lương tháng · H;tên;giờ;đơn giá · I;nhà cc;số lượng;đơn giá.' },
  dauRa: { en: 'Structure, then the pay run.', vi: 'Cấu trúc, rồi lượt trả tiền.' },
  main: 'KiemTra', kiem: true,
  quyTac: [{ id: 'R1', en: 'PayRun only knows Payable', vi: 'PayRun chỉ biết Payable', re: String.raw`Salaried|Hourly|Invoice|Employee|instanceof`, file: 'PayRun' }],
  harness: {
    'KiemTra.java': j`
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        for (String k : new String[] {"Payable", "Employee", "Salaried", "Hourly", "Invoice"}) {
            System.out.println(Kiem.kieu(k));
        }
        List<Payable> items = new ArrayList<>();
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) {
                continue;
            }
            String[] p = line.split(";");
            if (p[0].equals("S")) {
                items.add(new Salaried(p[1], Long.parseLong(p[2])));
            } else if (p[0].equals("H")) {
                items.add(new Hourly(p[1], Integer.parseInt(p[2]), Long.parseLong(p[3])));
            } else {
                items.add(new Invoice(p[1], Integer.parseInt(p[2]), Long.parseLong(p[3])));
            }
        }
        for (String line : PayRun.run(items.toArray(new Payable[0]))) {
            System.out.println(line);
        }
    }
}
`,
  },
  tep: {
    'Payable.java': j`
public interface Payable {
    long amountDue();

    String payee();
}
`,
    'Employee.java': j`
//>> public abstract class Employee implements Payable { // TODO: the name and payee() ⏎     public Employee(String name) { ⏎     } ⏎  ⏎     public String payee() { ⏎         return ""; ⏎     } ⏎ }
public abstract class Employee implements Payable {
    private final String name;

    public Employee(String name) {
        this.name = name;
    }

    @Override
    public String payee() {
        return name;
    }
}
//<<
`,
    'Salaried.java': j`
public class Salaried extends Employee {
    private final long monthly;

    public Salaried(String name, long monthly) {
        super(name);
        this.monthly = monthly;
    }

    @Override
    public long amountDue() {
        //>> return 0; // TODO
        return monthly;
        //<<
    }
}
`,
    'Hourly.java': j`
public class Hourly extends Employee {
    private final int hours;
    private final long rate;

    public Hourly(String name, int hours, long rate) {
        super(name);
        this.hours = hours;
        this.rate = rate;
    }

    @Override
    public long amountDue() {
        //>> return 0; // TODO
        return hours * rate;
        //<<
    }
}
`,
    'Invoice.java': j`
//>> public class Invoice implements Payable { // TODO ⏎     public Invoice(String supplier, int quantity, long unitPrice) { ⏎     } ⏎  ⏎     public long amountDue() { ⏎         return 0; ⏎     } ⏎  ⏎     public String payee() { ⏎         return ""; ⏎     } ⏎ }
public class Invoice implements Payable {
    private final String supplier;
    private final int quantity;
    private final long unitPrice;

    public Invoice(String supplier, int quantity, long unitPrice) {
        this.supplier = supplier;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    @Override
    public long amountDue() {
        return quantity * unitPrice;
    }

    @Override
    public String payee() {
        return "supplier " + supplier;
    }
}
//<<
`,
    'PayRun.java': j`
import java.util.ArrayList;
import java.util.List;

public class PayRun {
    public static List<String> run(Payable[] items) {
        List<String> lines = new ArrayList<>();
        //>> // TODO: one line per item, then "TOTAL …"
        long total = 0;
        for (Payable item : items) {
            lines.add("Pay " + item.amountDue() + " to " + item.payee());
            total += item.amountDue();
        }
        lines.add("TOTAL " + total);
        //<<
        return lines;
    }
}
`,
  },
  ca: [
    { ten: { en: 'employees and invoices mixed', vi: 'nhân viên và hoá đơn lẫn nhau' }, vao: 'S;An;15000000\nI;Paper Co;20;35000\nH;Binh;48;50000\nI;Ink Ltd;3;120000\n' },
    { ten: { en: 'nothing to pay', vi: 'không có gì để trả' }, vao: '', an: true },
  ],
  goiY: [
    { en: 'Ask "is an Invoice a kind of Employee?" — no. So it implements Payable directly instead of extending Employee.', vi: 'Hỏi "Invoice có phải một loại Employee không?" — không. Nên nó cài thẳng Payable thay vì extends Employee.' },
    { en: 'Employee implements payee() once for every employee and leaves amountDue() abstract.', vi: 'Employee cài payee() một lần cho mọi nhân viên và để amountDue() trừu tượng.' },
  ],
  loiHayGap: [
    { en: 'Making Invoice extend Employee to "reuse" the loop — an invoice would then have a name, a seniority… nonsense data.', vi: 'Cho Invoice extends Employee để "dùng lại" vòng lặp — hoá đơn khi đó có tên, thâm niên… dữ liệu vô nghĩa.' },
    { en: 'PayRun with separate loops per type — every new payable type means another loop (rule R1).', vi: 'PayRun có vòng lặp riêng cho từng kiểu — thêm kiểu mới là thêm vòng lặp (luật R1).' },
  ],
  giaiThich: { en: '<p>Abstract class for a family that shares state and code (employees), interface for a capability shared by unrelated classes (payable). PayRun depends only on the capability, so it pays employees and invoices in one loop.</p>', vi: '<p>Lớp trừu tượng cho một họ có chung trạng thái và code (nhân viên), interface cho một năng lực mà các lớp không liên quan cùng có (trả tiền được). PayRun chỉ phụ thuộc năng lực đó, nên trả cả nhân viên lẫn hoá đơn trong một vòng lặp.</p>' },
});

export default moDun({ slug: 'pro192-on-ch5', ten: '5.2 🧪 Practice — interfaces and abstract classes the PE way', de: [de1, de2, de3, de4] });
