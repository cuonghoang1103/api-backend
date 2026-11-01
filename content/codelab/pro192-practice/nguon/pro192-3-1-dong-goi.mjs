/** PRO192 · 3.1 — Encapsulation & abstraction: trường private + API công khai nhỏ nhất, mức truy cập qua package, ẩn luật bên trong. */
import { moDun, deJava, c, j, LOI_CHUNG } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-3-1-temperature',
  tieuDe: { en: 'One private field, three views: Temperature', vi: 'Một trường private, ba cách nhìn: Temperature' },
  doKho: 'EASY', phut: 15,
  khaiNiem: ['private field', 'getter computing a view', 'setter that refuses bad data'],
  moTa: {
    en: `<p>Encapsulation means the object decides what its data may be. ${c('Temperature')} stores <b>one</b> private value and offers three views:</p>
<ul><li>${c('Temperature(double celsius)')} — below absolute zero (−273.15 °C) the value is set to −273.15.</li>
<li>${c('double getCelsius()')}, ${c('double getFahrenheit()')} (C × 9/5 + 32), ${c('double getKelvin()')} (C + 273.15).</li>
<li>${c('boolean setCelsius(double c)')} and ${c('boolean setFahrenheit(double f)')} — refuse (return false, change nothing) a value below absolute zero.</li></ul>`,
    vi: `<p>Đóng gói nghĩa là đối tượng tự quyết dữ liệu của nó được phép là gì. ${c('Temperature')} lưu <b>một</b> giá trị private và cho ba cách nhìn:</p>
<ul><li>${c('Temperature(double celsius)')} — dưới độ không tuyệt đối (−273.15 °C) thì đặt là −273.15.</li>
<li>${c('double getCelsius()')}, ${c('double getFahrenheit()')} (C × 9/5 + 32), ${c('double getKelvin()')} (C + 273.15).</li>
<li>${c('boolean setCelsius(double c)')} và ${c('boolean setFahrenheit(double f)')} — từ chối (trả false, không đổi gì) giá trị dưới độ không tuyệt đối.</li></ul>`,
  },
  yeuCau: {
    en: ['Exactly one field (private). The other scales are computed, never stored.', 'The test class prints values with 2 decimals.'],
    vi: ['Đúng một trường (private). Các thang đo khác được tính, không lưu.', 'Lớp kiểm in giá trị với 2 chữ số thập phân.'],
  },
  dauVao: { en: 'Commands NEW;c · SETC;c · SETF;f.', vi: 'Lệnh NEW;c · SETC;c · SETF;f.' },
  dauRa: { en: 'The three views after each command.', vi: 'Ba cách nhìn sau mỗi lệnh.' },
  main: 'KiemTra', kiem: true,
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(Kiem.tatCaPrivate("Temperature"));
        System.out.println("instance fields: " + Kiem.truong("Temperature").replaceAll("fields of Temperature: ", "").split(", ").length);
        Object t = null;
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split(";");
            String r = "";
            if (p[0].equals("NEW")) {
                t = Kiem.tao("Temperature", Double.valueOf(p[1]));
            } else if (p[0].equals("SETC")) {
                r = " -> " + Kiem.goi(t, "setCelsius", Double.valueOf(p[1]));
            } else {
                r = " -> " + Kiem.goi(t, "setFahrenheit", Double.valueOf(p[1]));
            }
            Object c = Kiem.goiObj(t, "getCelsius");
            Object f = Kiem.goiObj(t, "getFahrenheit");
            Object k = Kiem.goiObj(t, "getKelvin");
            System.out.println(String.join(";", p) + r + String.format(" | C=%.2f F=%.2f K=%.2f", c, f, k));
        }
    }
}
`,
  },
  tep: {
    'Temperature.java': j`
// A temperature that can never be below absolute zero. Stored once, in Celsius.
public class Temperature {
    private static final double ABSOLUTE_ZERO = -273.15;
    private double celsius;

    public Temperature(double celsius) {
        //>> this.celsius = celsius; // TODO: never below ABSOLUTE_ZERO
        this.celsius = Math.max(ABSOLUTE_ZERO, celsius);
        //<<
    }

    public double getCelsius() {
        return celsius;
    }

    public double getFahrenheit() {
        //>> return 0; // TODO
        return celsius * 9 / 5 + 32;
        //<<
    }

    public double getKelvin() {
        //>> return 0; // TODO
        return celsius - ABSOLUTE_ZERO;
        //<<
    }

    public boolean setCelsius(double c) {
        //>> this.celsius = c; ⏎ return true; // TODO: refuse below ABSOLUTE_ZERO
        if (c < ABSOLUTE_ZERO) {
            return false;
        }
        celsius = c;
        return true;
        //<<
    }

    public boolean setFahrenheit(double f) {
        //>> return false; // TODO: convert, then reuse setCelsius
        return setCelsius((f - 32) * 5 / 9);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'create and convert', vi: 'tạo và đổi đơn vị' }, vao: 'NEW;100\nSETC;-40\nSETF;212\n' },
    { ten: { en: 'below absolute zero is refused', vi: 'dưới độ không tuyệt đối bị từ chối' }, vao: 'NEW;-500\nSETC;-273.16\nSETF;-460\nSETC;36.6\n' },
    { ten: { en: 'Fahrenheit boundary', vi: 'biên Fahrenheit' }, vao: 'NEW;20\nSETF;-459.67\nSETF;-459.68\n', an: true },
  ],
  goiY: [
    { en: 'Keep the constant ABSOLUTE_ZERO = -273.15 as private static final — a named rule, not a magic number.', vi: 'Giữ hằng ABSOLUTE_ZERO = -273.15 dạng private static final — luật có tên, không phải số ma thuật.' },
    { en: 'setFahrenheit converts and calls setCelsius — the rule exists once.', vi: 'setFahrenheit đổi đơn vị rồi gọi setCelsius — luật chỉ có một chỗ.' },
  ],
  loiHayGap: [
    { en: 'Storing celsius AND fahrenheit — the two fields drift apart after one setter forgets the other.', vi: 'Lưu cả celsius VÀ fahrenheit — hai trường lệch nhau ngay khi một setter quên cái kia.' },
    { en: 'C * 9 / 5 with an int C does integer division; here the value is a double, but 9 / 5 * C written that way is 1 * C.', vi: 'C * 9 / 5 với C kiểu int là chia nguyên; ở đây giá trị là double, nhưng viết 9 / 5 * C thì thành 1 * C.' },
    { en: 'Clamping in the setters instead of refusing — the task says a setter changes nothing and returns false.', vi: 'Kẹp giá trị trong setter thay vì từ chối — đề nói setter không đổi gì và trả false.' },
  ],
  giaiThich: { en: '<p>One stored value means the views can never disagree. The only ways in are the constructor (which clamps) and two setters (which refuse) — the same rule, written once in setCelsius and reused.</p>', vi: '<p>Một giá trị lưu nghĩa là các cách nhìn không bao giờ mâu thuẫn. Đường vào duy nhất là constructor (kẹp giá trị) và hai setter (từ chối) — cùng một luật, viết một lần trong setCelsius và dùng lại.</p>' },
});

const de2 = deJava({
  id: 'pro192-3-1-packages',
  tieuDe: { en: 'Access modifiers across packages: make it compile, keep it private', vi: 'Mức truy cập qua package: cho biên dịch được, giữ kín nhất có thể' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['package', 'public / package-private / private', 'least privilege'],
  khoiDauLoi: true,
  moTa: {
    en: `<p>Two packages: ${c('lib')} (${c('Book')}, ${c('Inventory')}) and ${c('app')} (${c('Main')}). Every member of ${c('lib.Book')} is ${c('private')}, so <b>the starter does not compile</b> — that is the exercise. Change only the access modifiers in ${c('src/lib/Book.java')} so that everything compiles, choosing the <b>most restrictive</b> modifier that works:</p>
<ul><li>what ${c('app.Main')} uses must be ${c('public')};</li>
<li>what only ${c('lib.Inventory')} (same package) uses must stay <b>package-private</b> (no modifier);</li>
<li>what only ${c('Book')} itself uses stays ${c('private')}.</li></ul>
<p>The grader reads the modifiers with reflection, then runs ${c('app.Main')}.</p>`,
    vi: `<p>Hai package: ${c('lib')} (${c('Book')}, ${c('Inventory')}) và ${c('app')} (${c('Main')}). Mọi thành phần của ${c('lib.Book')} đang ${c('private')}, nên <b>code khởi đầu không biên dịch được</b> — đó chính là bài. Chỉ đổi mức truy cập trong ${c('src/lib/Book.java')} để mọi thứ biên dịch được, chọn mức <b>chặt nhất</b> còn chạy được:</p>
<ul><li>thứ ${c('app.Main')} dùng phải ${c('public')};</li>
<li>thứ chỉ ${c('lib.Inventory')} (cùng package) dùng giữ <b>package-private</b> (không ghi gì);</li>
<li>thứ chỉ chính ${c('Book')} dùng giữ ${c('private')}.</li></ul>
<p>Máy chấm đọc mức truy cập bằng reflection, rồi chạy ${c('app.Main')}.</p>`,
  },
  yeuCau: {
    en: ['Change only modifiers in lib/Book.java — no other edit.', 'Do not change Inventory.java or Main.java.'],
    vi: ['Chỉ đổi mức truy cập trong lib/Book.java — không sửa gì khác.', 'Không sửa Inventory.java hay Main.java.'],
  },
  dauVao: { en: 'None.', vi: 'Không có.' },
  dauRa: { en: 'Modifiers seen by reflection, then the output of app.Main.', vi: 'Mức truy cập đọc bằng reflection, rồi output của app.Main.' },
  main: 'KiemTra', kiem: true,
  harness: {
    'KiemTra.java': j`
// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        System.out.println(Kiem.kieu("lib.Book").replace("lib.Book", "Book"));
        System.out.println("class public: " + java.lang.reflect.Modifier.isPublic(Kiem.lop("lib.Book").getModifiers()));
        System.out.println(Kiem.truong("lib.Book"));
        for (String m : new String[] {"getTitle", "getCopies", "borrow", "markLost", "describe"}) {
            System.out.println(Kiem.phuongThuc("lib.Book", m, 0));
        }
        System.out.println(Kiem.phuongThuc("lib.Book", "clean", 1));
        try {
            System.out.println("constructor public: " + java.lang.reflect.Modifier.isPublic(
                    Kiem.lop("lib.Book").getDeclaredConstructor(String.class, int.class).getModifiers()));
        } catch (NoSuchMethodException e) {
            System.out.println("constructor MISSING");
        }
        System.out.println("--- app.Main ---");
        app.Main.main(new String[0]);
    }
}
`,
  },
  tep: {
    'lib/Book.java': j`
package lib;

//>> class Book { // TODO: choose the access modifiers
public class Book {
//<<
    //>> private static final int MAX_COPIES = 5;
    public static final int MAX_COPIES = 5;
    //<<
    private final String title;
    private int copies;

    //>> private Book(String title, int copies) {
    public Book(String title, int copies) {
    //<<
        this.title = clean(title);
        this.copies = Math.min(copies, MAX_COPIES);
    }

    // only Book uses it
    private static String clean(String s) {
        return s.trim().replaceAll("\\s+", " ");
    }

    //>> private String getTitle() {
    public String getTitle() {
    //<<
        return title;
    }

    //>> private int getCopies() {
    public int getCopies() {
    //<<
        return copies;
    }

    //>> private boolean borrow() {
    public boolean borrow() {
    //<<
        if (copies == 0) {
            return false;
        }
        copies--;
        return true;
    }

    // only lib.Inventory uses it
    //>> private void markLost() {
    void markLost() {
    //<<
        copies = Math.max(0, copies - 1);
    }

    // only lib.Inventory uses it
    //>> private String describe() {
    String describe() {
    //<<
        return title + " (" + copies + ")";
    }
}
`,
    'lib/Inventory.java': j`
package lib;

import java.util.ArrayList;
import java.util.List;

// GIVEN — do not change. Same package as Book.
public class Inventory {
    private final List<Book> books = new ArrayList<>();

    public void add(Book book) {
        books.add(book);
    }

    public void reportLost(int index) {
        books.get(index).markLost();
    }

    public String report() {
        StringBuilder sb = new StringBuilder();
        for (Book book : books) {
            sb.append(book.describe()).append('\n');
        }
        return sb.toString().trim();
    }
}
`,
    'app/Main.java': j`
package app;

import lib.Book;
import lib.Inventory;

// GIVEN — do not change. Another package: it can use only what is public.
public class Main {
    public static void main(String[] args) {
        Book a = new Book("  Clean    Code ", 9);
        Book b = new Book("Refactoring", 1);
        System.out.println(a.getTitle() + " / " + a.getCopies() + " (max " + Book.MAX_COPIES + ")");
        System.out.println("borrow b: " + b.borrow() + ", again: " + b.borrow());
        Inventory inv = new Inventory();
        inv.add(a);
        inv.add(b);
        inv.reportLost(0);
        System.out.println(inv.report());
    }
}
`,
  },
  ca: [{ ten: { en: 'modifiers and the run of app.Main', vi: 'mức truy cập và lần chạy app.Main' }, vao: '' }],
  goiY: [
    { en: 'Read app/Main.java first: every Book member it touches must be public — the class, the constructor, MAX_COPIES, getTitle, getCopies, borrow.', vi: 'Đọc app/Main.java trước: mọi thành phần Book mà nó chạm tới phải public — lớp, constructor, MAX_COPIES, getTitle, getCopies, borrow.' },
    { en: 'markLost and describe are called only from lib.Inventory: remove "private" and write no modifier at all (package-private).', vi: 'markLost và describe chỉ được gọi từ lib.Inventory: bỏ "private" và không ghi mức truy cập nào (package-private).' },
  ],
  loiHayGap: [
    { en: 'Making everything public "so it compiles" — markLost and describe then become part of the API that any package can call.', vi: 'Cho tất cả public "cho biên dịch được" — markLost và describe thành API mà package nào cũng gọi được.' },
    { en: 'Forgetting the class itself: a package-private class cannot be imported from app at all.', vi: 'Quên chính lớp: lớp package-private thì package app không import được.' },
    { en: 'Making the fields public instead of keeping the getters — the fields must stay private.', vi: 'Cho trường public thay vì giữ getter — trường phải private.' },
  ],
  giaiThich: { en: '<p>Least privilege: <code>public</code> only for the five things another package needs, package-private for the two helpers that <code>Inventory</code> uses, <code>private</code> for the fields and <code>clean</code>. The compiler enforces the boundary — no comment can.</p>', vi: '<p>Quyền tối thiểu: <code>public</code> chỉ cho năm thứ package khác cần, package-private cho hai hàm phụ <code>Inventory</code> dùng, <code>private</code> cho các trường và <code>clean</code>. Trình biên dịch giữ ranh giới đó — chú thích thì không giữ được.</p>' },
});

const de3 = deJava({
  id: 'pro192-3-1-parking-meter',
  tieuDe: { en: 'Abstraction: a parking meter that hides its rules', vi: 'Trừu tượng: đồng hồ đỗ xe giấu luật bên trong' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['abstraction', 'small public API', 'private helper', 'invariants'],
  moTa: {
    en: `<p>The user of a ${c('ParkingMeter')} sees four buttons; the tariff is hidden inside.</p>
<ul><li>${c('boolean insertCoin(int vnd)')} — accepts 1000, 2000 or 5000 VND only (anything else returns false). Each 1000 VND buys 15 minutes; the meter never holds more than 120 minutes (extra time is lost but the coin is accepted).</li>
<li>${c('void tick(int minutes)')} — time passes; remaining time never goes below 0.</li>
<li>${c('int remaining()')}, ${c('boolean isExpired()')} (remaining is 0), ${c('long collected()')} — total money accepted.</li></ul>
<p>Keep the tariff in private constants and a private helper ${c('minutesFor(int vnd)')}.</p>`,
    vi: `<p>Người dùng ${c('ParkingMeter')} chỉ thấy bốn nút; biểu giá giấu bên trong.</p>
<ul><li>${c('boolean insertCoin(int vnd)')} — chỉ nhận 1000, 2000 hoặc 5000 đồng (khác thì trả false). Mỗi 1000 đồng mua 15 phút; đồng hồ không giữ quá 120 phút (thời gian dư mất, đồng xu vẫn được nhận).</li>
<li>${c('void tick(int minutes)')} — thời gian trôi; thời gian còn lại không âm.</li>
<li>${c('int remaining()')}, ${c('boolean isExpired()')} (còn 0 phút), ${c('long collected()')} — tổng tiền đã nhận.</li></ul>
<p>Giữ biểu giá trong hằng private và hàm phụ private ${c('minutesFor(int vnd)')}.</p>`,
  },
  yeuCau: {
    en: ['No public field; minutesFor is private.', 'Public methods exactly as listed.'],
    vi: ['Không trường public; minutesFor là private.', 'Phương thức public đúng như danh sách.'],
  },
  dauVao: { en: 'Commands COIN;v · TICK;m.', vi: 'Lệnh COIN;v · TICK;m.' },
  dauRa: { en: 'State after each command.', vi: 'Trạng thái sau mỗi lệnh.' },
  main: 'KiemTra', kiem: true,
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(Kiem.tatCaPrivate("ParkingMeter"));
        System.out.println(Kiem.phuongThuc("ParkingMeter", "minutesFor", 1));
        Object m = Kiem.tao("ParkingMeter");
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split(";");
            String r = p[0].equals("COIN") ? Kiem.goi(m, "insertCoin", Integer.valueOf(p[1]))
                    : "tick " + Kiem.goi(m, "tick", Integer.valueOf(p[1]));
            System.out.println(String.join(";", p) + " -> " + r + " | remaining=" + Kiem.goi(m, "remaining")
                    + " expired=" + Kiem.goi(m, "isExpired") + " collected=" + Kiem.goi(m, "collected"));
        }
    }
}
`,
  },
  tep: {
    'ParkingMeter.java': j`
// A parking meter: the public API is four buttons, the tariff is a private detail.
public class ParkingMeter {
    private static final int MINUTES_PER_1000 = 15;
    private static final int MAX_MINUTES = 120;
    private int remaining;
    private long collected;

    public boolean insertCoin(int vnd) {
        //>> return false; // TODO: accept 1000/2000/5000, add time (max 120), count the money
        int minutes = minutesFor(vnd);
        if (minutes == 0) {
            return false;
        }
        remaining = Math.min(MAX_MINUTES, remaining + minutes);
        collected += vnd;
        return true;
        //<<
    }

    //>> // TODO: private int minutesFor(int vnd) — 0 for a coin that is not accepted
    private int minutesFor(int vnd) {
        if (vnd != 1000 && vnd != 2000 && vnd != 5000) {
            return 0;
        }
        return vnd / 1000 * MINUTES_PER_1000;
    }
    //<<

    public void tick(int minutes) {
        //>> // TODO
        remaining = Math.max(0, remaining - minutes);
        //<<
    }

    public int remaining() {
        return remaining;
    }

    public boolean isExpired() {
        //>> return false; // TODO
        return remaining == 0;
        //<<
    }

    public long collected() {
        return collected;
    }
}
`,
  },
  ca: [
    { ten: { en: 'coins, time passing, expiry', vi: 'bỏ xu, thời gian trôi, hết giờ' }, vao: 'COIN;2000\nTICK;10\nCOIN;500\nTICK;25\n' },
    { ten: { en: 'the 120-minute cap', vi: 'trần 120 phút' }, vao: 'COIN;5000\nCOIN;5000\nTICK;30\nCOIN;1000\n' },
    { ten: { en: 'wrong coins and a long wait', vi: 'xu sai và chờ lâu' }, vao: 'TICK;5\nCOIN;0\nCOIN;-1000\nCOIN;10000\nCOIN;1000\nTICK;1000\n', an: true },
  ],
  goiY: [
    { en: 'minutesFor returns 0 for an unknown coin; insertCoin refuses when it gets 0. One helper, one rule.', vi: 'minutesFor trả 0 cho đồng xu lạ; insertCoin từ chối khi nhận 0. Một hàm phụ, một luật.' },
    { en: 'Math.min(MAX, remaining + minutes) for the cap and Math.max(0, remaining - m) for the floor.', vi: 'Math.min(MAX, remaining + minutes) cho trần và Math.max(0, remaining - m) cho sàn.' },
  ],
  loiHayGap: [
    { en: 'Counting a refused coin in collected().', vi: 'Cộng đồng xu bị từ chối vào collected().' },
    { en: 'Refusing a coin because the meter is already full — the task says the coin is accepted and the extra time is lost.', vi: 'Từ chối đồng xu vì đồng hồ đã đầy — đề nói xu vẫn được nhận, thời gian dư bị mất.' },
    { en: 'Making minutesFor public "for testing" — the reflection line shows it.', vi: 'Cho minutesFor public "để test" — dòng reflection cho thấy.' },
  ],
  giaiThich: { en: '<p>Abstraction = the caller needs to know WHAT the meter does, not HOW the tariff works. Constants and a private helper hold the how; the four public methods keep the two invariants (0 ≤ remaining ≤ 120, collected counts only accepted coins).</p>', vi: '<p>Trừu tượng = người gọi cần biết đồng hồ làm GÌ, không cần biết biểu giá tính THẾ NÀO. Hằng và hàm phụ private giữ phần "thế nào"; bốn phương thức public giữ hai bất biến (0 ≤ remaining ≤ 120, collected chỉ tính xu được nhận).</p>' },
});

export default moDun({ slug: 'pro192-3-1-dong-goi', ten: '3.1 Encapsulation & abstraction', de: [de1, de2, de3] });
