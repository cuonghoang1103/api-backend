/** PRO192 · 2.1 — Fields, methods & constructors: lớp đầu tiên tự viết, this, constructor gọi nhau, static vs instance, tham chiếu. */
import { moDun, deJava, c, j, LOI_CHUNG } from './_chung.mjs';

const BOOK_HARNESS = j`
import java.util.Scanner;

// Grader test class (do not edit): looks at Book with reflection, then drives it with the commands of the case.
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Object book = null;
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) {
                continue;
            }
            String[] p = line.split(";");
            switch (p[0]) {
                case "STRUCTURE":
                    System.out.println(Kiem.kieu("Book"));
                    System.out.println(Kiem.truong("Book"));
                    for (String m : new String[] {"getId", "getTitle", "getYear", "getCopies", "borrow", "toString"}) {
                        System.out.println(Kiem.phuongThuc("Book", m, 0));
                    }
                    System.out.println(Kiem.phuongThuc("Book", "setCopies", 1));
                    break;
                case "NEW":
                    book = Kiem.tao("Book", p[1], p[2], Integer.valueOf(p[3]), Integer.valueOf(p[4]));
                    System.out.println("created: " + Kiem.goi(book, "toString"));
                    break;
                case "GET":
                    System.out.println("id=" + Kiem.goi(book, "getId") + " title=" + Kiem.goi(book, "getTitle")
                            + " year=" + Kiem.goi(book, "getYear") + " copies=" + Kiem.goi(book, "getCopies"));
                    break;
                case "BORROW":
                    System.out.println("borrow -> " + Kiem.goi(book, "borrow") + ", now " + Kiem.goi(book, "toString"));
                    break;
                case "SET":
                    Kiem.goi(book, "setCopies", Integer.valueOf(p[1]));
                    System.out.println("setCopies(" + p[1] + ") -> " + Kiem.goi(book, "toString"));
                    break;
                default:
                    System.out.println("? " + line);
            }
        }
    }
}
`;

const de1 = deJava({
  id: 'pro192-2-1-book',
  tieuDe: { en: 'Your first class: Book with fields, constructor, getters and toString', vi: 'Lớp đầu tiên: Book có trường, constructor, getter và toString' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['private fields', 'constructor', 'this', 'getter / setter', 'toString'],
  moTa: {
    en: `<p>Write ${c('src/Book.java')} for CT Library. The grader’s test class (${c('cham/KiemTra.java')}) inspects it with <b>reflection</b> (are the fields private? which methods exist?) and then calls it — so it is checked like a reviewer would, not only by printing.</p>
<ul><li>Four <b>private</b> fields: ${c('String id')}, ${c('String title')}, ${c('int year')}, ${c('int copies')}.</li>
<li>${c('public Book(String id, String title, int year, int copies)')} — use ${c('this.')} to tell fields from parameters; a negative ${c('copies')} is stored as 0.</li>
<li>Getters ${c('getId()')} ${c('getTitle()')} ${c('getYear()')} ${c('getCopies()')}; ${c('setCopies(int copies)')} ignores a negative value.</li>
<li>${c('boolean borrow()')} — when at least one copy is left, take one and return ${c('true')}; otherwise ${c('false')}.</li>
<li>${c('toString()')} returns ${c('B001 | Clean Code | 2008 | 3 copies')} — and ${c('1 copy')} (singular) when there is exactly one.</li></ul>`,
    vi: `<p>Viết ${c('src/Book.java')} cho CT Library. Lớp kiểm của máy chấm (${c('cham/KiemTra.java')}) soi nó bằng <b>reflection</b> (trường có private không? có những phương thức nào?) rồi mới gọi — nên được kiểm như người review, không chỉ qua chữ in ra.</p>
<ul><li>Bốn trường <b>private</b>: ${c('String id')}, ${c('String title')}, ${c('int year')}, ${c('int copies')}.</li>
<li>${c('public Book(String id, String title, int year, int copies)')} — dùng ${c('this.')} để phân biệt trường với tham số; ${c('copies')} âm được lưu thành 0.</li>
<li>Getter ${c('getId()')} ${c('getTitle()')} ${c('getYear()')} ${c('getCopies()')}; ${c('setCopies(int copies)')} bỏ qua giá trị âm.</li>
<li>${c('boolean borrow()')} — còn ít nhất một bản thì lấy đi một bản và trả ${c('true')}; hết thì ${c('false')}.</li>
<li>${c('toString()')} trả ${c('B001 | Clean Code | 2008 | 3 copies')} — và ${c('1 copy')} (số ít) khi còn đúng một bản.</li></ul>`,
  },
  yeuCau: {
    en: ['Every field is private; every method above is public.', 'Annotate toString() with @Override.', 'Do not edit anything under <code>cham/</code>.'],
    vi: ['Mọi trường private; mọi phương thức ở trên public.', 'Gắn @Override cho toString().', 'Không sửa gì trong <code>cham/</code>.'],
  },
  dauVao: { en: 'Commands for the test class: STRUCTURE, NEW;id;title;year;copies, GET, BORROW, SET;n.', vi: 'Lệnh cho lớp kiểm: STRUCTURE, NEW;id;title;year;copies, GET, BORROW, SET;n.' },
  dauRa: { en: 'What the test class prints about your Book.', vi: 'Những gì lớp kiểm in ra về Book của bạn.' },
  main: 'KiemTra', kiem: true,
  harness: { 'KiemTra.java': BOOK_HARNESS },
  quyTac: [{ id: 'R1', en: '@Override on toString()', vi: '@Override trên toString()', re: String.raw`@Override\s+public\s+String\s+toString\s*\(`, need: true }],
  tep: {
    'Book.java': j`
// One title of the CT Library catalogue.
public class Book {
    //>> // TODO: four private fields: id, title, year, copies
    private String id;
    private String title;
    private int year;
    private int copies;
    //<<

    public Book(String id, String title, int year, int copies) {
        //>> // TODO: store the parameters (this.x = x); a negative copies becomes 0
        this.id = id;
        this.title = title;
        this.year = year;
        this.copies = Math.max(0, copies);
        //<<
    }

    public String getId() {
        //>> return null; // TODO
        return id;
        //<<
    }

    public String getTitle() {
        //>> return null; // TODO
        return title;
        //<<
    }

    public int getYear() {
        //>> return 0; // TODO
        return year;
        //<<
    }

    public int getCopies() {
        //>> return 0; // TODO
        return copies;
        //<<
    }

    public void setCopies(int copies) {
        //>> // TODO: ignore a negative value
        if (copies >= 0) {
            this.copies = copies;
        }
        //<<
    }

    public boolean borrow() {
        //>> return false; // TODO
        if (copies == 0) {
            return false;
        }
        copies--;
        return true;
        //<<
    }

    //>> // TODO: toString() -> "B001 | Clean Code | 2008 | 3 copies" (1 copy)
    @Override
    public String toString() {
        return id + " | " + title + " | " + year + " | " + copies + (copies == 1 ? " copy" : " copies");
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'structure: private fields, public methods', vi: 'cấu trúc: trường private, phương thức public' }, vao: 'STRUCTURE\n' },
    { ten: { en: 'create, read, borrow down to zero', vi: 'tạo, đọc, mượn tới hết' }, vao: 'NEW;B001;Clean Code;2008;2\nGET\nBORROW\nBORROW\nBORROW\n' },
    { ten: { en: 'negative copies and setCopies', vi: 'số bản âm và setCopies' }, vao: 'NEW;B002;Head First Java;2005;-4\nGET\nSET;-1\nSET;1\nBORROW\n', an: true },
  ],
  goiY: [
    { en: 'Inside the constructor the parameter hides the field with the same name: title = title assigns the parameter to itself. Write this.title = title.', vi: 'Trong constructor tham số che trường cùng tên: title = title gán tham số cho chính nó. Viết this.title = title.' },
    { en: 'toString: build the string with + and choose " copy" or " copies" with a conditional expression (copies == 1 ? … : …).', vi: 'toString: nối chuỗi bằng + và chọn " copy" hay " copies" bằng biểu thức điều kiện (copies == 1 ? … : …).' },
  ],
  loiHayGap: [
    { en: 'Writing title = title in the constructor — the field stays null and toString prints "null".', vi: 'Viết title = title trong constructor — trường vẫn null và toString in "null".' },
    { en: 'Leaving a field public (or package-private, without a modifier) — the structure case lists it and fails.', vi: 'Để trường public (hoặc không ghi mức truy cập) — ca cấu trúc liệt kê ra và trượt.' },
    { en: 'Declaring toString() with a different name or signature (tostring(), toString(int)) — Java then calls Object.toString and prints Book@1b6d3586.', vi: 'Khai báo toString() sai tên/chữ ký (tostring(), toString(int)) — Java gọi Object.toString và in Book@1b6d3586.' },
  ],
  giaiThich: { en: '<p>Private fields + public methods is encapsulation in its smallest form: the only way to change <code>copies</code> is through <code>setCopies</code> and <code>borrow</code>, which keep it non-negative. <code>@Override</code> makes the compiler check that <code>toString()</code> really overrides <code>Object.toString()</code>.</p>', vi: '<p>Trường private + phương thức public là đóng gói ở dạng nhỏ nhất: cách duy nhất đổi <code>copies</code> là qua <code>setCopies</code> và <code>borrow</code>, hai hàm giữ nó không âm. <code>@Override</code> bắt trình biên dịch kiểm <code>toString()</code> thật sự ghi đè <code>Object.toString()</code>.</p>' },
});

const de2 = deJava({
  id: 'pro192-2-1-clock',
  tieuDe: { en: 'Three constructors, one rule: this(...) chaining', vi: 'Ba constructor, một luật: gọi nhau bằng this(...)' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['constructor overloading', 'this(...)', 'normalisation', 'String.format("%02d")'],
  moTa: {
    en: `<p>A ${c('Clock')} keeps a time of day. Write three constructors where only <b>one</b> contains the logic and the other two call it with ${c('this(...)')}:</p>
<ul><li>${c('Clock(int hours, int minutes)')} — normalises: the total number of minutes is reduced modulo 24 h, negative values wrap backwards (${c('Clock(25, 70)')} is 02:10, ${c('Clock(0, -1)')} is 23:59).</li>
<li>${c('Clock(int minutes)')} — minutes after midnight, same normalisation. ${c('Clock()')} — midnight.</li>
<li>${c('void addMinutes(int m)')} (may be negative), ${c('int getHours()')}, ${c('int getMinutes()')}, ${c('toString()')} → ${c('"02:10"')}.</li></ul>`,
    vi: `<p>${c('Clock')} giữ một thời điểm trong ngày. Viết ba constructor, trong đó chỉ <b>một</b> cái chứa logic, hai cái kia gọi nó bằng ${c('this(...)')}:</p>
<ul><li>${c('Clock(int hours, int minutes)')} — chuẩn hoá: tổng số phút lấy dư theo 24 giờ, giá trị âm quay ngược (${c('Clock(25, 70)')} là 02:10, ${c('Clock(0, -1)')} là 23:59).</li>
<li>${c('Clock(int minutes)')} — số phút sau nửa đêm, chuẩn hoá như trên. ${c('Clock()')} — nửa đêm.</li>
<li>${c('void addMinutes(int m)')} (có thể âm), ${c('int getHours()')}, ${c('int getMinutes()')}, ${c('toString()')} → ${c('"02:10"')}.</li></ul>`,
  },
  yeuCau: {
    en: ['Store a single private field (e.g. minutes after midnight, 0..1439).', 'Two constructors must be one line: <code>this(…);</code> (the grader checks).', 'Use Math.floorMod or ((x % n) + n) % n — Java’s % keeps the sign of the left operand.'],
    vi: ['Lưu một trường private duy nhất (vd số phút sau nửa đêm, 0..1439).', 'Hai constructor phải là một dòng: <code>this(…);</code> (máy chấm có kiểm).', 'Dùng Math.floorMod hoặc ((x % n) + n) % n — phép % của Java giữ dấu của số bị chia.'],
  },
  dauVao: { en: 'Commands: NEW0 · NEW1;m · NEW2;h;m · ADD;m · SHOW.', vi: 'Lệnh: NEW0 · NEW1;m · NEW2;h;m · ADD;m · SHOW.' },
  dauRa: { en: 'The clock after each command.', vi: 'Đồng hồ sau mỗi lệnh.' },
  main: 'KiemTra', kiem: true,
  quyTac: [{ id: 'R1', en: 'at least two constructors delegate with this(...)', vi: 'ít nhất hai constructor gọi this(...)', re: String.raw`(Clock\s*\([^)]*\)\s*\{\s*this\s*\([^;]*\);\s*\}[\s\S]*){2}`, need: true }],
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Object clock = null;
        System.out.println(Kiem.tatCaPrivate("Clock"));
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split(";");
            if (p[0].equals("NEW0")) {
                clock = Kiem.tao("Clock");
            } else if (p[0].equals("NEW1")) {
                clock = Kiem.tao("Clock", Integer.valueOf(p[1]));
            } else if (p[0].equals("NEW2")) {
                clock = Kiem.tao("Clock", Integer.valueOf(p[1]), Integer.valueOf(p[2]));
            } else if (p[0].equals("ADD")) {
                Kiem.goi(clock, "addMinutes", Integer.valueOf(p[1]));
            }
            System.out.println(String.join(";", p) + " -> " + Kiem.goi(clock, "toString") + " (h=" + Kiem.goi(clock, "getHours")
                    + ", m=" + Kiem.goi(clock, "getMinutes") + ")");
        }
    }
}
`,
  },
  tep: {
    'Clock.java': j`
// A time of day, always kept between 00:00 and 23:59.
public class Clock {
    private static final int DAY = 24 * 60;
    private int total;

    public Clock(int hours, int minutes) {
        //>> // TODO: the only constructor with logic — normalise hours * 60 + minutes into [0, DAY)
        total = Math.floorMod(hours * 60 + minutes, DAY);
        //<<
    }

    public Clock(int minutes) {
        //>> // TODO: one line, this(...)
        this(0, minutes);
        //<<
    }

    public Clock() {
        //>> // TODO: one line, this(...)
        this(0, 0);
        //<<
    }

    public void addMinutes(int m) {
        //>> // TODO
        total = Math.floorMod(total + m, DAY);
        //<<
    }

    public int getHours() {
        return total / 60;
    }

    public int getMinutes() {
        return total % 60;
    }

    @Override
    public String toString() {
        //>> return "00:00"; // TODO: two digits each, e.g. String.format("%02d:%02d", …)
        return String.format("%02d:%02d", getHours(), getMinutes());
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'three constructors', vi: 'ba constructor' }, vao: 'NEW0\nNEW1;75\nNEW2;25;70\n' },
    { ten: { en: 'adding and going back past midnight', vi: 'cộng và lùi qua nửa đêm' }, vao: 'NEW2;23;30\nADD;45\nADD;-90\nADD;-1440\n' },
    { ten: { en: 'negative minutes wrap backwards', vi: 'phút âm quay ngược' }, vao: 'NEW2;0;-1\nNEW1;-1441\nNEW2;-25;0\nADD;100000\n', an: true },
  ],
  goiY: [
    { en: 'Keep ONE number: the minutes after midnight. Hours and minutes are computed by the getters (total / 60, total % 60).', vi: 'Giữ MỘT số: số phút sau nửa đêm. Giờ và phút do getter tính (total / 60, total % 60).' },
    { en: 'Math.floorMod(-1, 1440) is 1439, while -1 % 1440 is -1.', vi: 'Math.floorMod(-1, 1440) là 1439, còn -1 % 1440 là -1.' },
  ],
  loiHayGap: [
    { en: 'Using % for negative numbers — Clock(0, -1) becomes "00:-1".', vi: 'Dùng % với số âm — Clock(0, -1) thành "00:-1".' },
    { en: 'Copying the normalisation into every constructor — the rule now lives in three places (and the grader’s this(...) rule fails).', vi: 'Chép phép chuẩn hoá vào mọi constructor — luật nằm ở ba chỗ (và luật this(...) của máy chấm trượt).' },
    { en: 'this(...) must be the FIRST statement of a constructor — anything before it does not compile.', vi: 'this(...) phải là câu lệnh ĐẦU TIÊN của constructor — đặt gì trước nó là không biên dịch được.' },
  ],
  giaiThich: { en: '<p>Storing one field (minutes after midnight) makes every invariant trivial: hours and minutes are derived, and one normalisation with <code>Math.floorMod</code> handles overflow and negative values. The two short constructors delegate with <code>this(...)</code>, so the rule exists once.</p>', vi: '<p>Lưu một trường (số phút sau nửa đêm) làm mọi bất biến trở nên hiển nhiên: giờ và phút được suy ra, và một phép chuẩn hoá bằng <code>Math.floorMod</code> lo cả tràn lẫn giá trị âm. Hai constructor ngắn gọi <code>this(...)</code>, nên luật chỉ có một chỗ.</p>' },
});

const de3 = deJava({
  id: 'pro192-2-1-alias',
  tieuDe: { en: 'Reference or copy? Fix the aliasing bug', vi: 'Tham chiếu hay bản sao? Sửa lỗi hai biến trỏ một đối tượng' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['reference', 'aliasing', 'copy constructor', 'defensive copy'],
  moTa: {
    en: `<p>${c('Member b2 = b1;')} does not copy a member — both variables point to the <b>same object</b> on the heap, so renaming through ${c('b2')} renames ${c('b1')} too. The class ${c('Team')} has this bug: ${c('getLeader()')} returns its own object and ${c('setLeader(m)')} stores the caller’s object, so code outside the team can change the leader without asking.</p>
<ul><li>Add a <b>copy constructor</b> ${c('public Member(Member other)')} to ${c('Member')}.</li>
<li>Fix ${c('Team')}: ${c('setLeader')} stores a copy, ${c('getLeader')} returns a copy, and the constructor copies too.</li></ul>
<p>The test class renames members after handing them to a team and checks that the team’s leader does not change, while two variables that really are aliases still behave as aliases.</p>`,
    vi: `<p>${c('Member b2 = b1;')} không sao chép thành viên — hai biến cùng trỏ <b>một đối tượng</b> trên heap, nên đổi tên qua ${c('b2')} là đổi luôn ${c('b1')}. Lớp ${c('Team')} dính lỗi này: ${c('getLeader()')} trả về chính đối tượng của nó và ${c('setLeader(m)')} giữ đối tượng của người gọi, nên code bên ngoài đổi được trưởng nhóm mà không hỏi ai.</p>
<ul><li>Thêm <b>constructor sao chép</b> ${c('public Member(Member other)')} vào ${c('Member')}.</li>
<li>Sửa ${c('Team')}: ${c('setLeader')} giữ một bản sao, ${c('getLeader')} trả một bản sao, constructor cũng sao chép.</li></ul>
<p>Lớp kiểm đổi tên các thành viên sau khi đã giao cho nhóm và kiểm trưởng nhóm không đổi, trong khi hai biến thật sự là bí danh vẫn cư xử như bí danh.</p>`,
  },
  yeuCau: {
    en: ['Keep every field private.', 'Team never keeps or returns a Member object that someone else also holds.'],
    vi: ['Giữ mọi trường private.', 'Team không bao giờ giữ hay trả ra một đối tượng Member mà người khác cũng đang giữ.'],
  },
  dauVao: { en: 'A scenario number for the test class.', vi: 'Số kịch bản cho lớp kiểm.' },
  dauRa: { en: 'Names printed after each step of the scenario.', vi: 'Các tên in ra sau mỗi bước của kịch bản.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        String s = new Scanner(System.in).nextLine().trim();
        Member a = new Member("M001", "An");
        if (s.equals("1")) {
            Member alias = a;
            alias.rename("An Nguyen");
            System.out.println("alias renamed -> a is " + a.getName() + " (same object: " + (alias == a) + ")");
            Member copy = new Member(a);
            copy.rename("Someone Else");
            System.out.println("copy renamed -> a is " + a.getName() + ", copy is " + copy.getName() + " (same object: " + (copy == a) + ")");
            System.out.println("copy keeps the id: " + copy.getId());
        } else if (s.equals("2")) {
            Team t = new Team("Readers", a);
            a.rename("Changed Outside");
            System.out.println("after renaming the argument: leader = " + t.getLeader().getName());
            t.getLeader().rename("Changed Through Getter");
            System.out.println("after renaming the returned leader: leader = " + t.getLeader().getName());
        } else {
            Team t = new Team("Writers", new Member("M009", "Ha"));
            Member b = new Member("M002", "Binh");
            t.setLeader(b);
            b.rename("Binh Tran");
            Member got = t.getLeader();
            System.out.println("leader = " + got.getId() + " " + got.getName() + "; getLeader twice same object: " + (t.getLeader() == got));
            System.out.println(t);
        }
    }
}
`,
  },
  tep: {
    'Member.java': j`
// A club member.
public class Member {
    private final String id;
    private String name;

    public Member(String id, String name) {
        this.id = id;
        this.name = name;
    }

    //>> // TODO: copy constructor Member(Member other)
    public Member(Member other) {
        this(other.id, other.name);
    }
    //<<

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void rename(String name) {
        this.name = name;
    }
}
`,
    'Team.java': j`
// A reading team with one leader. The team must own its leader object.
public class Team {
    private final String name;
    private Member leader;

    public Team(String name, Member leader) {
        this.name = name;
        //>> this.leader = leader; // TODO: defensive copy
        this.leader = new Member(leader);
        //<<
    }

    public Member getLeader() {
        //>> return leader; // TODO: return a copy
        return new Member(leader);
        //<<
    }

    public void setLeader(Member leader) {
        //>> this.leader = leader; // TODO: store a copy
        this.leader = new Member(leader);
        //<<
    }

    @Override
    public String toString() {
        return "Team " + name + " led by " + leader.getName();
    }
}
`,
  },
  khoiDau: {
    'Member.java': j`
// A club member.
public class Member {
    private final String id;
    private String name;

    public Member(String id, String name) {
        this.id = id;
        this.name = name;
    }

    // TODO: copy constructor Member(Member other) — this placeholder only keeps the project compiling
    public Member(Member other) {
        this(null, null);
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void rename(String name) {
        this.name = name;
    }
}
`,
  },
  ca: [
    { ten: { en: 'an alias versus a copy', vi: 'bí danh và bản sao' }, vao: '1\n' },
    { ten: { en: 'the team must not see outside renames', vi: 'nhóm không được thấy việc đổi tên bên ngoài' }, vao: '2\n' },
    { ten: { en: 'setLeader stores a copy, getLeader returns a fresh copy', vi: 'setLeader giữ bản sao, getLeader trả bản sao mới' }, vao: '3\n', an: true },
  ],
  goiY: [
    { en: 'The copy constructor copies the field values: this(other.id, other.name). Strings are immutable, so sharing them is safe.', vi: 'Constructor sao chép chép giá trị các trường: this(other.id, other.name). String bất biến nên dùng chung là an toàn.' },
    { en: 'Copy on the way IN (constructor, setter) and on the way OUT (getter): new Member(leader).', vi: 'Sao chép ở chiều VÀO (constructor, setter) và chiều RA (getter): new Member(leader).' },
  ],
  loiHayGap: [
    { en: 'Copying only in the setter — the constructor still keeps the caller’s object (scenario 2 fails).', vi: 'Chỉ sao chép trong setter — constructor vẫn giữ đối tượng của người gọi (kịch bản 2 trượt).' },
    { en: 'Thinking Member b2 = b1 makes a copy — it copies the reference, not the object.', vi: 'Tưởng Member b2 = b1 là sao chép — nó chép tham chiếu, không chép đối tượng.' },
    { en: 'A "copy constructor" that returns the same object (this.leader = other) — == still prints true.', vi: '"Constructor sao chép" mà vẫn trả cùng đối tượng (this.leader = other) — == vẫn in true.' },
  ],
  giaiThich: { en: '<p>Variables of class type hold references. A defensive copy on the way in and on the way out means no other code ever holds the team’s own <code>Member</code>, so the team’s state can only change through the team’s methods.</p>', vi: '<p>Biến kiểu lớp giữ tham chiếu. Sao chép phòng thủ ở chiều vào và chiều ra nghĩa là không code nào khác giữ được chính <code>Member</code> của nhóm, nên trạng thái nhóm chỉ đổi qua phương thức của nhóm.</p>' },
});

const de4 = deJava({
  id: 'pro192-2-1-static',
  tieuDe: { en: 'static versus instance: automatic ticket numbers', vi: 'static và instance: số vé tự cấp' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['static field', 'static method', 'instance field', 'String.format("%03d")'],
  moTa: {
    en: `<p>Every borrow slip gets the next number automatically: ${c('S001')}, ${c('S002')}, … The counter belongs to the <b>class</b> (one for all slips), the number belongs to each <b>object</b>.</p>
<ul><li>${c('Slip(String memberId, String bookId)')} — takes the next number.</li>
<li>${c('String getCode()')} → ${c('"S007"')} (3 digits, more when needed: ${c('S1000')}).</li>
<li>${c('static int issued()')} — how many slips were created so far; ${c('static void resetCounter()')} — back to zero (used between test scenarios).</li>
<li>${c('toString()')} → ${c('S001 M01->B07')}.</li></ul>`,
    vi: `<p>Mỗi phiếu mượn tự nhận số kế tiếp: ${c('S001')}, ${c('S002')}, … Bộ đếm thuộc về <b>lớp</b> (một cái cho mọi phiếu), còn số phiếu thuộc về từng <b>đối tượng</b>.</p>
<ul><li>${c('Slip(String memberId, String bookId)')} — nhận số kế tiếp.</li>
<li>${c('String getCode()')} → ${c('"S007"')} (3 chữ số, cần thì nhiều hơn: ${c('S1000')}).</li>
<li>${c('static int issued()')} — đã tạo bao nhiêu phiếu; ${c('static void resetCounter()')} — về 0 (dùng giữa các kịch bản kiểm).</li>
<li>${c('toString()')} → ${c('S001 M01->B07')}.</li></ul>`,
  },
  yeuCau: {
    en: ['The counter is a private static field; the code is a private instance field.', 'issued() and resetCounter() are static (the test class calls them on the class).'],
    vi: ['Bộ đếm là trường private static; mã phiếu là trường private của đối tượng.', 'issued() và resetCounter() là static (lớp kiểm gọi chúng trên lớp).'],
  },
  dauVao: { en: 'How many slips to create, then which ones to print.', vi: 'Tạo bao nhiêu phiếu, rồi in những phiếu nào.' },
  dauRa: { en: 'Codes, the static counter, and the structure seen by reflection.', vi: 'Các mã phiếu, bộ đếm static, và cấu trúc soi bằng reflection.' },
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
        System.out.println(Kiem.phuongThuc("Slip", "issued", 0));
        System.out.println(Kiem.phuongThuc("Slip", "resetCounter", 0));
        System.out.println(Kiem.tatCaPrivate("Slip"));
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split(";");
            int n = Integer.parseInt(p[0]);
            Kiem.goiObj(Kiem.lop("Slip"), "resetCounter");
            List<Object> slips = new ArrayList<>();
            for (int i = 1; i <= n; i++) {
                slips.add(Kiem.tao("Slip", "M" + (i % 7), "B" + i));
            }
            System.out.println("created " + n + ", issued() = " + Kiem.goi(Kiem.lop("Slip"), "issued"));
            for (int i = 1; i < p.length; i++) {
                Object s = slips.get(Integer.parseInt(p[i]) - 1);
                System.out.println("  #" + p[i] + ": " + Kiem.goi(s, "getCode") + " / " + Kiem.goi(s, "toString"));
            }
        }
    }
}
`,
  },
  tep: {
    'Slip.java': j`
// A borrow slip. The counter is shared by the class; each slip keeps its own code.
public class Slip {
    //>> // TODO: a private static counter
    private static int counter = 0;
    //<<
    private final String code;
    private final String memberId;
    private final String bookId;

    public Slip(String memberId, String bookId) {
        this.memberId = memberId;
        this.bookId = bookId;
        //>> this.code = "S000"; // TODO: take the next number
        counter++;
        this.code = String.format("S%03d", counter);
        //<<
    }

    public String getCode() {
        return code;
    }

    //>> // TODO: static int issued() and static void resetCounter()
    public static int issued() {
        return counter;
    }

    public static void resetCounter() {
        counter = 0;
    }
    //<<

    @Override
    public String toString() {
        return code + " " + memberId + "->" + bookId;
    }
}
`,
  },
  ca: [
    { ten: { en: 'three slips', vi: 'ba phiếu' }, vao: '3;1;2;3\n' },
    { ten: { en: 'the counter is reset between scenarios', vi: 'bộ đếm về 0 giữa các kịch bản' }, vao: '2;2\n5;1;5\n' },
    { ten: { en: 'more than 999 slips', vi: 'hơn 999 phiếu' }, vao: '1001;9;99;999;1000;1001\n', an: true },
  ],
  goiY: [
    { en: 'private static int counter = 0; — one variable for the whole class. In the constructor: counter++ then build the code from it.', vi: 'private static int counter = 0; — một biến cho cả lớp. Trong constructor: counter++ rồi dựng mã từ nó.' },
    { en: 'String.format("S%03d", 7) gives "S007"; with 1000 it gives "S1000" — %03d is a minimum width.', vi: 'String.format("S%03d", 7) cho "S007"; với 1000 cho "S1000" — %03d là độ rộng TỐI THIỂU.' },
  ],
  loiHayGap: [
    { en: 'A non-static counter — every slip has its own counter, so every code is S001.', vi: 'Bộ đếm không static — mỗi phiếu có bộ đếm riêng, nên mã nào cũng là S001.' },
    { en: 'Computing the code in getCode() from the counter — every slip then shows the LATEST number.', vi: 'Tính mã trong getCode() từ bộ đếm — phiếu nào cũng hiện số MỚI NHẤT.' },
    { en: 'Making the static field public so tests can reset it — use a static method and keep the field private.', vi: 'Để trường static public cho tiện reset — dùng phương thức static và giữ trường private.' },
  ],
  giaiThich: { en: '<p>A static field exists once per class, an instance field once per object. The constructor reads the shared counter at the moment of creation and freezes it in the slip’s own final field, so later slips do not change earlier codes.</p>', vi: '<p>Trường static tồn tại một lần cho mỗi lớp, trường instance một lần cho mỗi đối tượng. Constructor đọc bộ đếm dùng chung đúng lúc tạo và đóng băng nó vào trường final riêng của phiếu, nên phiếu sau không làm đổi mã phiếu trước.</p>' },
});

export default moDun({ slug: 'pro192-2-1-lop-doi-tuong', ten: '2.1 Fields, methods & constructors', de: [de1, de2, de3, de4] });
