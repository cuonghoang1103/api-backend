/** PRO192 · 3.2 🧪 — đóng gói làm thật: BankAccount kiểu PE, varargs, rò dữ liệu qua getter, tự thiết kế bãi đỗ xe. */
import { moDun, deJava, c, j, LOI_CHUNG } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-on-ch3-bank-account',
  tieuDe: { en: 'PE question: an encapsulated BankAccount', vi: 'Câu PE: BankAccount được đóng gói' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['no setter for derived state', 'validation', 'return codes'],
  moTa: {
    en: `<p>A PE-style class whose balance can only change through business methods:</p>
<pre>BankAccount
- number  : String
- owner   : String
- balance : long
+ BankAccount(number : String, owner : String)
+ getNumber() : String
+ getOwner() : String          // each word capitalised: "nguyen van an" -> "Nguyen Van An"
+ getBalance() : long
+ deposit(amount : long) : boolean   // amount > 0
+ withdraw(amount : long) : boolean  // amount > 0 and the balance stays >= 50000 (minimum balance)
+ transferTo(other : BankAccount, amount : long) : boolean  // withdraw here + deposit there, all or nothing</pre>
<p>There is <b>no</b> ${c('setBalance')}. A new account has balance 0.</p>`,
    vi: `<p>Lớp kiểu PE mà số dư chỉ đổi qua phương thức nghiệp vụ:</p>
<pre>BankAccount
- number  : String
- owner   : String
- balance : long
+ BankAccount(number : String, owner : String)
+ getNumber() : String
+ getOwner() : String          // each word capitalised: "nguyen van an" -> "Nguyen Van An"
+ getBalance() : long
+ deposit(amount : long) : boolean   // amount > 0
+ withdraw(amount : long) : boolean  // amount > 0 and the balance stays >= 50000 (minimum balance)
+ transferTo(other : BankAccount, amount : long) : boolean  // withdraw here + deposit there, all or nothing</pre>
<p> <b>Không có</b> ${c('setBalance')}. Tài khoản mới có số dư 0. ${c('getOwner')} viết hoa chữ đầu mỗi từ; ${c('withdraw')} chỉ nhận khi số tiền dương và số dư còn lại ≥ 50 000 (số dư tối thiểu); ${c('transferTo')} rút ở đây + nạp bên kia, được cả hoặc không gì.</p>`,
  },
  yeuCau: {
    en: ['Private fields, no setter for the balance (the grader checks with reflection).', 'transferTo to itself or to null is refused.', 'Do not change Main.java.'],
    vi: ['Trường private, không có setter cho số dư (máy chấm soi bằng reflection).', 'transferTo cho chính nó hoặc null bị từ chối.', 'Không sửa Main.java.'],
  },
  dauVao: { en: 'Commands for the given Main: D;acc;amount · W;acc;amount · T;from;to;amount · S.', vi: 'Lệnh cho Main cho sẵn: D;tk;tiền · W;tk;tiền · T;từ;tới;tiền · S.' },
  dauRa: { en: 'One line per command.', vi: 'Mỗi lệnh một dòng.' },
  main: 'Main', kiem: true,
  tep: {
    'Main.java': j`
import java.util.Scanner;

// GIVEN — do not change. Two accounts (A, B); commands from the keyboard.
public class Main {
    public static void main(String[] args) {
        System.out.println(Kiem.tatCaPrivate("BankAccount") + " | " + Kiem.phuongThuc("BankAccount", "setBalance", 1));
        Scanner sc = new Scanner(System.in);
        BankAccount a = new BankAccount("ACC-1", "  nguyen   van an ");
        BankAccount b = new BankAccount("ACC-2", "TRAN THI BINH");
        System.out.println(a.getNumber() + " " + a.getOwner() + " / " + b.getNumber() + " " + b.getOwner());
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split(";");
            BankAccount x = p.length > 1 && p[1].equals("B") ? b : a;
            BankAccount y = p.length > 2 && p[2].equals("A") ? a : p.length > 2 && p[2].equals("B") ? b : null;
            if (p[0].equals("D")) {
                System.out.println("deposit " + p[2] + " -> " + x.deposit(Long.parseLong(p[2])));
            } else if (p[0].equals("W")) {
                System.out.println("withdraw " + p[2] + " -> " + x.withdraw(Long.parseLong(p[2])));
            } else if (p[0].equals("T")) {
                System.out.println("transfer " + p[1] + "->" + p[2] + " " + p[3] + " -> " + x.transferTo(y, Long.parseLong(p[3])));
            }
            System.out.println("  A=" + a.getBalance() + " B=" + b.getBalance());
        }
    }
}
`,
    'BankAccount.java': j`
public class BankAccount {
    private static final long MIN_BALANCE = 50_000;
    private final String number;
    private final String owner;
    private long balance;

    public BankAccount(String number, String owner) {
        this.number = number;
        this.owner = owner;
    }

    public String getNumber() {
        return number;
    }

    public String getOwner() {
        //>> return owner; // TODO: capitalise each word, one space between words
        StringBuilder sb = new StringBuilder();
        for (String w : owner.trim().toLowerCase().split("\\s+")) {
            if (sb.length() > 0) {
                sb.append(' ');
            }
            sb.append(Character.toUpperCase(w.charAt(0))).append(w.substring(1));
        }
        return sb.toString();
        //<<
    }

    public long getBalance() {
        return balance;
    }

    public boolean deposit(long amount) {
        //>> return false; // TODO
        if (amount <= 0) {
            return false;
        }
        balance += amount;
        return true;
        //<<
    }

    public boolean withdraw(long amount) {
        //>> return false; // TODO: amount > 0 and balance - amount >= MIN_BALANCE
        if (amount <= 0 || balance - amount < MIN_BALANCE) {
            return false;
        }
        balance -= amount;
        return true;
        //<<
    }

    public boolean transferTo(BankAccount other, long amount) {
        //>> return false; // TODO: all or nothing; refuse null and itself
        if (other == null || other == this || !withdraw(amount)) {
            return false;
        }
        other.deposit(amount);
        return true;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'deposit, withdraw down to the minimum', vi: 'nạp, rút tới mức tối thiểu' }, vao: 'D;A;200000\nW;A;150000\nW;A;1\nS\n' },
    { ten: { en: 'transfers', vi: 'chuyển khoản' }, vao: 'D;A;100000\nT;A;B;60000\nT;A;B;50000\nD;B;0\nT;B;A;50000\n' },
    { ten: { en: 'refused transfers: itself, null, negative', vi: 'chuyển bị từ chối: chính nó, null, số âm' }, vao: 'D;B;300000\nT;B;B;10\nT;B;X;10\nT;B;A;-5\nW;B;-1\nT;B;A;250000\n', an: true },
  ],
  goiY: [
    { en: 'transferTo reuses withdraw: if (!withdraw(amount)) return false; then other.deposit(amount). No rule is written twice.', vi: 'transferTo dùng lại withdraw: if (!withdraw(amount)) return false; rồi other.deposit(amount). Không luật nào viết hai lần.' },
    { en: 'Minimum balance: refuse when balance - amount < 50 000.', vi: 'Số dư tối thiểu: từ chối khi balance - amount < 50 000.' },
  ],
  loiHayGap: [
    { en: 'Checking the other account AFTER withdrawing — a transfer to null takes the money and then fails.', vi: 'Kiểm tài khoản đích SAU khi rút — chuyển cho null thì tiền mất rồi mới báo lỗi.' },
    { en: 'Adding setBalance for convenience — encapsulation is gone (the first line of the output shows it).', vi: 'Thêm setBalance cho tiện — mất đóng gói (dòng đầu output cho thấy).' },
    { en: 'getOwner on "  nguyen   van an " without trim/split("\\\\s+") — empty words crash charAt(0).', vi: 'getOwner trên "  nguyen   van an " mà không trim/split("\\\\s+") — từ rỗng làm charAt(0) sập.' },
  ],
  giaiThich: { en: '<p>The balance has exactly two doors, deposit and withdraw, each guarding the rules; transferTo is built from them and checks its preconditions before moving any money, so it is all or nothing. Reflection confirms there is no setter to bypass the doors.</p>', vi: '<p>Số dư có đúng hai cửa, deposit và withdraw, mỗi cửa canh luật; transferTo dựng từ hai cửa đó và kiểm điều kiện trước khi chuyển tiền, nên được cả hoặc không gì. Reflection xác nhận không có setter nào đi vòng qua hai cửa.</p>' },
});

const de2 = deJava({
  id: 'pro192-on-ch3-varargs',
  tieuDe: { en: 'Varargs utilities and their edge cases', vi: 'Hàm varargs và các ca biên' },
  doKho: 'MEDIUM', phut: 15,
  khaiNiem: ['varargs (T... args)', 'static utility class', 'private constructor'],
  moTa: {
    en: `<p>Write a utility class ${c('Utils')} — ${c('final')}, with a ${c('private')} constructor (nobody creates a Utils object) — and three static varargs methods:</p>
<ul><li>${c('int max(int first, int... rest)')} — the largest; the first value is mandatory, so ${c('max()')} does not compile.</li>
<li>${c('double average(double... values)')} — 0 for no value (and for a ${c('null')} array).</li>
<li>${c('String join(String sep, String... parts)')} — the non-null, non-blank parts, trimmed, joined with ${c('sep')}.</li></ul>`,
    vi: `<p>Viết lớp tiện ích ${c('Utils')} — ${c('final')}, constructor ${c('private')} (không ai tạo đối tượng Utils) — với ba phương thức static varargs:</p>
<ul><li>${c('int max(int first, int... rest)')} — số lớn nhất; số đầu là bắt buộc, nên ${c('max()')} không biên dịch được.</li>
<li>${c('double average(double... values)')} — 0 khi không có giá trị nào (và khi mảng là ${c('null')}).</li>
<li>${c('String join(String sep, String... parts)')} — các phần khác null, không trống, đã trim, nối bằng ${c('sep')}.</li></ul>`,
  },
  yeuCau: { en: ['Utils is final with a private no-argument constructor.', 'Do not use String.join or streams in join — write the loop.'], vi: ['Utils là final và có constructor private không tham số.', 'Không dùng String.join hay stream trong join — tự viết vòng lặp.'] },
  dauVao: { en: 'A scenario number.', vi: 'Số kịch bản.' },
  dauRa: { en: 'Results of the calls.', vi: 'Kết quả các lời gọi.' },
  main: 'KiemTra', kiem: true,
  quyTac: [{ id: 'R1', en: 'join does not use String.join / streams', vi: 'join không dùng String.join / stream', re: String.raw`String\s*\.\s*join|\.stream\s*\(|Collectors`, file: 'Utils' }],
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        String s = new Scanner(System.in).nextLine().trim();
        Class<?> k = Kiem.lop("Utils");
        System.out.println("final: " + java.lang.reflect.Modifier.isFinal(k.getModifiers()) + ", public constructors: " + k.getConstructors().length);
        if (s.equals("1")) {
            System.out.println("max(3) = " + Utils.max(3));
            System.out.println("max(3, 9, -2, 9) = " + Utils.max(3, 9, -2, 9));
            System.out.println("max(-5, -7) = " + Utils.max(-5, -7));
            System.out.printf("average(1, 2, 4) = %.3f%n", Utils.average(1, 2, 4));
            System.out.printf("average() = %.3f%n", Utils.average());
        } else if (s.equals("2")) {
            System.out.println("[" + Utils.join(", ", "an", " binh ", null, "   ", "chi") + "]");
            System.out.println("[" + Utils.join("-") + "]");
            System.out.println("[" + Utils.join("/", new String[] {"a", "b"}) + "]");
        } else {
            System.out.printf("average(null array) = %.3f%n", Utils.average((double[]) null));
            System.out.println("[" + Utils.join(" ", null, null) + "]");
            System.out.println("[" + Utils.join("", " x ", "y") + "]");
            int[] big = new int[1000];
            for (int i = 0; i < big.length; i++) {
                big[i] = (i * 37) % 1001;
            }
            System.out.println("max(0, big[]) = " + Utils.max(0, big));
        }
    }
}
`,
  },
  tep: {
    'Utils.java': j`
// A utility class: static methods only, no object.
public final class Utils {
    //>> // TODO: a private constructor
    private Utils() {
    }
    //<<

    public static int max(int first, int... rest) {
        //>> return first; // TODO
        int best = first;
        for (int x : rest) {
            best = Math.max(best, x);
        }
        return best;
        //<<
    }

    public static double average(double... values) {
        //>> return 0; // TODO: 0 for no value or a null array
        if (values == null || values.length == 0) {
            return 0;
        }
        double sum = 0;
        for (double v : values) {
            sum += v;
        }
        return sum / values.length;
        //<<
    }

    public static String join(String sep, String... parts) {
        //>> return ""; // TODO: skip null and blank parts, trim the others
        StringBuilder sb = new StringBuilder();
        if (parts == null) {
            return "";
        }
        for (String p : parts) {
            if (p == null || p.trim().isEmpty()) {
                continue;
            }
            if (sb.length() > 0) {
                sb.append(sep);
            }
            sb.append(p.trim());
        }
        return sb.toString();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'max and average', vi: 'max và average' }, vao: '1\n' },
    { ten: { en: 'join', vi: 'join' }, vao: '2\n' },
    { ten: { en: 'null arrays, empty separator, a big array', vi: 'mảng null, dấu nối rỗng, mảng lớn' }, vao: '3\n', an: true },
  ],
  goiY: [
    { en: 'Inside the method a varargs parameter IS an array: rest.length, for (int x : rest). It may be empty — or null when the caller passes (double[]) null.', vi: 'Trong phương thức, tham số varargs CHÍNH LÀ mảng: rest.length, for (int x : rest). Nó có thể rỗng — hoặc null khi nơi gọi truyền (double[]) null.' },
    { en: 'join: skip null/blank first, then add the separator before every kept part except the first.', vi: 'join: bỏ null/trống trước, rồi thêm dấu nối trước mỗi phần được giữ trừ phần đầu.' },
  ],
  loiHayGap: [
    { en: 'average dividing by values.length when it is 0 — NaN.', vi: 'average chia cho values.length khi nó bằng 0 — ra NaN.' },
    { en: 'Adding the separator before checking whether the part is blank — the result gets ", ," holes.', vi: 'Thêm dấu nối trước khi kiểm phần đó có trống không — kết quả có lỗ ", ,".' },
    { en: 'Forgetting the private constructor — Java then adds a public default constructor.', vi: 'Quên constructor private — Java tự thêm constructor mặc định public.' },
  ],
  giaiThich: { en: '<p>Varargs are arrays with call-site sugar, so the same edge cases apply: empty, null, large. A <code>final</code> class with a private constructor documents (and enforces) that Utils is a bag of static functions, like <code>java.lang.Math</code>.</p>', vi: '<p>Varargs là mảng có cú pháp gọi gọn, nên cùng các ca biên: rỗng, null, lớn. Lớp <code>final</code> với constructor private ghi rõ (và ép buộc) rằng Utils là túi hàm static, như <code>java.lang.Math</code>.</p>' },
});

const de3 = deJava({
  id: 'pro192-on-ch3-leak',
  tieuDe: { en: 'All fields private, data still leaking', vi: 'Trường đã private mà dữ liệu vẫn rò' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['defensive copy', 'unmodifiable view', 'mutable arrays and lists'],
  moTa: {
    en: `<p>${c('Course')} has only private fields, yet code outside can change its data: ${c('getScores()')} returns the internal ${c('int[]')}, ${c('getStudents()')} returns the internal ${c('List')}, and the constructor keeps the caller’s array. Fix the class so that the course can only change through ${c('addStudent')} and ${c('setScore')}:</p>
<ul><li>copy the array in the constructor (${c('Arrays.copyOf')}) and in ${c('getScores()')};</li>
<li>${c('getStudents()')} returns ${c('Collections.unmodifiableList(...)')} — a read-only view (trying to add throws ${c('UnsupportedOperationException')});</li>
<li>${c('setScore(int index, int score)')} accepts 0..10 only (returns false otherwise).</li></ul>`,
    vi: `<p>${c('Course')} chỉ có trường private, vậy mà code bên ngoài vẫn đổi được dữ liệu: ${c('getScores()')} trả về chính ${c('int[]')} bên trong, ${c('getStudents()')} trả về chính ${c('List')} bên trong, và constructor giữ mảng của người gọi. Sửa lớp để khoá học chỉ đổi được qua ${c('addStudent')} và ${c('setScore')}:</p>
<ul><li>sao chép mảng trong constructor (${c('Arrays.copyOf')}) và trong ${c('getScores()')};</li>
<li>${c('getStudents()')} trả ${c('Collections.unmodifiableList(...)')} — một view chỉ đọc (thử add là ném ${c('UnsupportedOperationException')});</li>
<li>${c('setScore(int index, int score)')} chỉ nhận 0..10 (khác thì trả false).</li></ul>`,
  },
  yeuCau: { en: ['Keep the public method signatures.', 'Do not change cham/KiemTra.java.'], vi: ['Giữ nguyên chữ ký các phương thức public.', 'Không sửa cham/KiemTra.java.'] },
  dauVao: { en: 'A scenario number.', vi: 'Số kịch bản.' },
  dauRa: { en: 'The course before and after attacks from outside.', vi: 'Khoá học trước và sau các lần tấn công từ bên ngoài.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': j`
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

// Grader test class (do not edit): tries to change a Course from outside.
public class KiemTra {
    public static void main(String[] args) {
        String s = new Scanner(System.in).nextLine().trim();
        int[] given = {7, 8, 9};
        Course course = new Course("PRO192", given);
        if (s.equals("1")) {
            given[0] = 0;
            System.out.println("after changing the caller's array: " + Arrays.toString(course.getScores()));
            course.getScores()[1] = 0;
            System.out.println("after changing the returned array: " + Arrays.toString(course.getScores()));
            System.out.println("setScore(2, 10): " + course.setScore(2, 10) + " -> " + Arrays.toString(course.getScores()));
            System.out.println("setScore(0, 11): " + course.setScore(0, 11) + ", setScore(5, 5): " + course.setScore(5, 5));
        } else {
            course.addStudent("An");
            course.addStudent("Binh");
            List<String> view = course.getStudents();
            try {
                view.add("Hacker");
                System.out.println("add through the getter: allowed (leak!)");
            } catch (UnsupportedOperationException e) {
                System.out.println("add through the getter: UnsupportedOperationException");
            }
            course.addStudent("Chi");
            System.out.println("students: " + course.getStudents() + " (the old view now shows " + view.size() + ")");
        }
    }
}
`,
  },
  tep: {
    'Course.java': j`
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

// A course: its data must change only through its own methods.
public class Course {
    private final String code;
    private final int[] scores;
    private final List<String> students = new ArrayList<>();

    public Course(String code, int[] scores) {
        this.code = code;
        //>> this.scores = scores; // TODO: copy
        this.scores = Arrays.copyOf(scores, scores.length);
        //<<
    }

    public String getCode() {
        return code;
    }

    public int[] getScores() {
        //>> return scores; // TODO: copy
        return Arrays.copyOf(scores, scores.length);
        //<<
    }

    public boolean setScore(int index, int score) {
        //>> scores[index] = score; ⏎ return true; // TODO: index in range, score 0..10
        if (index < 0 || index >= scores.length || score < 0 || score > 10) {
            return false;
        }
        scores[index] = score;
        return true;
        //<<
    }

    public void addStudent(String name) {
        students.add(name);
    }

    public List<String> getStudents() {
        //>> return students; // TODO: a read-only view
        return Collections.unmodifiableList(students);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'arrays in and out', vi: 'mảng vào và ra' }, vao: '1\n' },
    { ten: { en: 'the student list through the getter', vi: 'danh sách sinh viên qua getter' }, vao: '2\n', an: true },
  ],
  goiY: [
    { en: 'A private field holding a reference only protects the reference — the object it points to can still be changed by anyone who also holds it.', vi: 'Trường private giữ tham chiếu chỉ bảo vệ tham chiếu — đối tượng nó trỏ tới vẫn bị đổi bởi bất kỳ ai cũng giữ tham chiếu đó.' },
    { en: 'unmodifiableList is a VIEW: it reflects later changes made by the course itself, but refuses changes made through it.', vi: 'unmodifiableList là một VIEW: nó phản ánh thay đổi sau này do chính khoá học làm, nhưng từ chối thay đổi đi qua nó.' },
  ],
  loiHayGap: [
    { en: 'Copying in the getter but not in the constructor (or the other way round) — one door stays open.', vi: 'Sao chép ở getter mà không ở constructor (hoặc ngược lại) — một cửa vẫn mở.' },
    { en: 'setScore without an index check — setScore(5, 5) on 3 scores throws ArrayIndexOutOfBoundsException.', vi: 'setScore không kiểm chỉ số — setScore(5, 5) trên 3 điểm ném ArrayIndexOutOfBoundsException.' },
    { en: 'Returning new ArrayList<>(students) — safe, but then adding through it silently does nothing; the task asks for an exception (read-only view).', vi: 'Trả new ArrayList<>(students) — an toàn, nhưng add qua nó im lặng không có tác dụng; đề yêu cầu ném ngoại lệ (view chỉ đọc).' },
  ],
  giaiThich: { en: '<p>Encapsulation must cover the objects a field points to: arrays are copied on the way in and out, and the list is exposed as an unmodifiable view, so the only mutators left are the class’s own validated methods.</p>', vi: '<p>Đóng gói phải phủ cả đối tượng mà trường trỏ tới: mảng được sao chép ở chiều vào và ra, danh sách lộ ra dưới dạng view chỉ đọc, nên chỉ còn các phương thức có kiểm tra của chính lớp mới đổi được dữ liệu.</p>' },
});

const de4 = deJava({
  id: 'pro192-on-ch3-parking-lot',
  tieuDe: { en: 'Design it yourself: a parking lot', vi: 'Tự thiết kế: bãi đỗ xe' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['design a class', 'array of slots', 'invariants', 'encapsulated state'],
  moTa: {
    en: `<p>Design ${c('ParkingLot')}: a fixed number of numbered slots (1..capacity). Public API:</p>
<ul><li>${c('ParkingLot(int capacity)')} (capacity 1..100; outside → 10).</li>
<li>${c('int park(String plate)')} — the plate is trimmed and upper-cased; the car takes the <b>lowest free</b> slot and the slot number is returned. Return ${c('-1')} when the lot is full, ${c('-2')} when the plate is already parked, ${c('-3')} for a blank plate.</li>
<li>${c('boolean leave(String plate)')}, ${c('int find(String plate)')} (slot or −1), ${c('int occupied()')}, ${c('String map()')} — one character per slot: ${c('X')} taken, ${c('.')} free (${c('"XX.X."')}).</li></ul>
<p>How you store the slots is your decision — but nothing outside may change them.</p>`,
    vi: `<p>Thiết kế ${c('ParkingLot')}: số chỗ cố định, đánh số 1..capacity. API công khai:</p>
<ul><li>${c('ParkingLot(int capacity)')} (capacity 1..100; ngoài khoảng → 10).</li>
<li>${c('int park(String plate)')} — biển số được trim và viết hoa; xe vào chỗ trống <b>nhỏ nhất</b> và trả số chỗ. Trả ${c('-1')} khi đầy, ${c('-2')} khi biển số đã đỗ, ${c('-3')} khi biển số trống.</li>
<li>${c('boolean leave(String plate)')}, ${c('int find(String plate)')} (số chỗ hoặc −1), ${c('int occupied()')}, ${c('String map()')} — mỗi chỗ một ký tự: ${c('X')} có xe, ${c('.')} trống (${c('"XX.X."')}).</li></ul>
<p>Lưu các chỗ thế nào là quyết định của bạn — nhưng bên ngoài không đổi được chúng.</p>`,
  },
  yeuCau: { en: ['All fields private; no method returns your internal array/list.', 'Plates are compared after trim + upper case.'], vi: ['Mọi trường private; không phương thức nào trả mảng/danh sách bên trong.', 'Biển số so sánh sau trim + viết hoa.'] },
  dauVao: { en: 'First line: capacity. Then P;plate · L;plate · F;plate.', vi: 'Dòng đầu: capacity. Rồi P;biển · L;biển · F;biển.' },
  dauRa: { en: 'Result and map after each command.', vi: 'Kết quả và bản đồ sau mỗi lệnh.' },
  main: 'KiemTra', kiem: true,
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(Kiem.tatCaPrivate("ParkingLot"));
        Object lot = Kiem.tao("ParkingLot", Integer.valueOf(sc.nextLine().trim()));
        System.out.println("empty: " + Kiem.goi(lot, "map") + " occupied=" + Kiem.goi(lot, "occupied"));
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().split(";", -1);
            String m = p[0].equals("P") ? "park" : p[0].equals("L") ? "leave" : "find";
            System.out.println(m + "(\"" + p[1] + "\") -> " + Kiem.goi(lot, m, p[1]) + " | " + Kiem.goi(lot, "map") + " occupied=" + Kiem.goi(lot, "occupied"));
        }
    }
}
`,
  },
  tep: {
    'ParkingLot.java': j`
// A parking lot with numbered slots 1..capacity. Slot i is plates[i - 1] (null = free).
public class ParkingLot {
    private static final int DEFAULT_CAPACITY = 10;
    private static final int MAX_CAPACITY = 100;
    //>> // TODO: your private state
    private final String[] plates;
    private int occupied;
    //<<

    public ParkingLot(int capacity) {
        //>> // TODO
        plates = new String[capacity < 1 || capacity > MAX_CAPACITY ? DEFAULT_CAPACITY : capacity];
        //<<
    }

    //>> // TODO: helper(s)
    private static String clean(String plate) {
        return plate == null ? "" : plate.trim().toUpperCase();
    }
    //<<

    public int park(String plate) {
        //>> return -1; // TODO: -3 blank, -2 already parked, -1 full, else the lowest free slot
        String p = clean(plate);
        if (p.isEmpty()) {
            return -3;
        }
        if (find(p) != -1) {
            return -2;
        }
        for (int i = 0; i < plates.length; i++) {
            if (plates[i] == null) {
                plates[i] = p;
                occupied++;
                return i + 1;
            }
        }
        return -1;
        //<<
    }

    public boolean leave(String plate) {
        //>> return false; // TODO
        int slot = find(plate);
        if (slot == -1) {
            return false;
        }
        plates[slot - 1] = null;
        occupied--;
        return true;
        //<<
    }

    public int find(String plate) {
        //>> return -1; // TODO
        String p = clean(plate);
        for (int i = 0; i < plates.length; i++) {
            if (p.equals(plates[i])) {
                return i + 1;
            }
        }
        return -1;
        //<<
    }

    public int occupied() {
        //>> return 0; // TODO
        return occupied;
        //<<
    }

    public String map() {
        //>> return ""; // TODO
        StringBuilder sb = new StringBuilder();
        for (String p : plates) {
            sb.append(p == null ? '.' : 'X');
        }
        return sb.toString();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'park, leave, reuse the lowest free slot', vi: 'đỗ, rời, dùng lại chỗ trống nhỏ nhất' }, vao: '4\nP;29a-123.45\nP;30B-999.99\nP;51c-000.01\nL;30b-999.99\nP;88D-111.11\nF;29A-123.45\n' },
    { ten: { en: 'full lot, duplicates, blanks', vi: 'bãi đầy, trùng biển, biển trống' }, vao: '2\nP;A1\nP; a1 \nP;B2\nP;C3\nP;   \nL;Z9\nF;Z9\n' },
    { ten: { en: 'capacity out of range', vi: 'capacity ngoài khoảng' }, vao: '0\nP;X\nL;x\nL;X\nP;Y\n', an: true },
    { ten: { en: 'capacity 101 falls back to 10', vi: 'capacity 101 lùi về 10' }, vao: '101\nP;Q\n', an: true },
  ],
  goiY: [
    { en: 'A String[] of size capacity where null means free gives you "lowest free slot" with one loop and the map with another.', vi: 'Một String[] cỡ capacity, null là chỗ trống, cho ra "chỗ trống nhỏ nhất" bằng một vòng lặp và bản đồ bằng vòng khác.' },
    { en: 'Normalise the plate ONCE in a private helper and use it in park, leave and find.', vi: 'Chuẩn hoá biển số MỘT lần trong hàm phụ private và dùng ở park, leave và find.' },
  ],
  loiHayGap: [
    { en: 'Appending cars to the end instead of filling the lowest free slot — after a car leaves, the next one gets the wrong slot.', vi: 'Thêm xe vào cuối thay vì lấp chỗ trống nhỏ nhất — sau khi một xe rời đi, xe tiếp theo vào sai chỗ.' },
    { en: 'Checking "full" before "already parked" — a plate that is already inside a full lot must give -2, not -1. The order is: blank (-3), duplicate (-2), full (-1).', vi: 'Kiểm "đầy" trước "đã đỗ" — biển số đã ở trong một bãi đầy phải cho -2, không phải -1. Thứ tự: trống (-3), trùng (-2), đầy (-1).' },
    { en: 'Comparing plates with == — " a1 " and "A1" are the same car after normalising, and == compares references anyway.', vi: 'So biển số bằng == — " a1 " và "A1" là cùng một xe sau chuẩn hoá, và == vốn so tham chiếu.' },
  ],
  giaiThich: { en: '<p>The state (an array of plates and a counter) is private and only the five methods touch it, so the invariants hold: occupied equals the number of non-null slots, a plate appears at most once, and slots are filled from the lowest number.</p>', vi: '<p>Trạng thái (mảng biển số và bộ đếm) là private và chỉ năm phương thức chạm tới, nên các bất biến luôn đúng: occupied bằng số chỗ khác null, mỗi biển số xuất hiện tối đa một lần, và chỗ được lấp từ số nhỏ nhất.</p>' },
});

export default moDun({ slug: 'pro192-on-ch3', ten: '3.2 🧪 Practice — encapsulation for real: access, varargs, leaks, design', de: [de1, de2, de3, de4] });
