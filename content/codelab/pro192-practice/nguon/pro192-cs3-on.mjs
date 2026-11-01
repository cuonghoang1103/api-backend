/** PRO192 · ⭐ CS.3 — Java hiện đại 17: record có kiểm dữ liệu, enum + switch expression, sealed + instanceof pattern, text block, đưa code Java 17 về JDK 8 phòng thi. Ý đề: gen/src/extra/cs3-on.txt + gen/java/cs3/Bt*.java. */
import { moDun, deJava, c, j } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-cs3-record-sinh-vien',
  tieuDe: { en: 'The PE Student as a record that cannot hold bad data', vi: 'Student của đề PE thành record không chứa được dữ liệu sai' },
  doKho: 'MEDIUM', phut: 30, java: 17,
  khaiNiem: ['record', 'compact constructor (validate + normalise)', 'static factory parse', 'records give equals/hashCode ⇒ distinct for free'],
  moTa: {
    en: `<p>Write ${c('record Student(String code, String name, double mark)')} whose <b>compact constructor</b>: strips and upper-cases the code and requires two letters + four digits (${c('IllegalArgumentException("bad code: <code>")')}); rejects a blank name (${c('"blank name"')}) and collapses inner spaces (${c('"Nguyen  An"')} → ${c('"Nguyen An"')}); rejects a mark outside 0..10 (${c('"mark out of range: 11.0"')}). Add ${c('static Student parse(String line)')} for lines like ${c('se1001; Nguyen  An ; 8.5')} (not 3 fields ⇒ ${c('"expected 3 fields"')}, a mark that is not a number ⇒ ${c('"bad mark: <text>"')}) and ${c('boolean passed()')} (mark ≥ 5).</p>
<p>The given ${c('Main')} parses every line, prints ${c('line 3 skipped: bad code: SE10A1')} for the bad ones, keeps the distinct students in a ${c('LinkedHashSet')} (so two lines that normalise to the same student count once) and prints them by mark descending, then name.</p>`,
    vi: `<p>Viết ${c('record Student(String code, String name, double mark)')} có <b>compact constructor</b>: cắt khoảng trắng và viết hoa mã, mã phải là hai chữ + bốn số (${c('IllegalArgumentException("bad code: <mã>")')}); từ chối tên trống (${c('"blank name"')}) và gộp khoảng trắng bên trong (${c('"Nguyen  An"')} → ${c('"Nguyen An"')}); từ chối điểm ngoài 0..10 (${c('"mark out of range: 11.0"')}). Thêm ${c('static Student parse(String line)')} cho dòng kiểu ${c('se1001; Nguyen  An ; 8.5')} (không đủ 3 trường ⇒ ${c('"expected 3 fields"')}, điểm không phải số ⇒ ${c('"bad mark: <chữ>"')}) và ${c('boolean passed()')} (điểm ≥ 5).</p>
<p>${c('Main')} cho sẵn parse từng dòng, in ${c('line 3 skipped: bad code: SE10A1')} cho dòng sai, giữ sinh viên khác nhau trong ${c('LinkedHashSet')} (hai dòng chuẩn hoá ra cùng một sinh viên chỉ tính một) và in theo điểm giảm dần, rồi theo tên.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java.', 'All checks live in the compact constructor; parse only splits and converts.'], vi: ['Không sửa Main.java.', 'Mọi phép kiểm nằm trong compact constructor; parse chỉ tách và chuyển kiểu.'] },
  dauVao: { en: 'Lines code;name;mark.', vi: 'Các dòng code;name;mark.' },
  dauRa: { en: 'Skipped lines, then the distinct students.', vi: 'Các dòng bị bỏ, rồi các sinh viên khác nhau.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'Student is a record', vi: 'Student là record', re: String.raw`\brecord\s+Student\s*\(`, need: true }],
  tep: {
    'Main.java': j`
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Scanner;
import java.util.Set;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Set<Student> students = new LinkedHashSet<>();
        int n = 0;
        while (sc.hasNextLine()) {
            String line = sc.nextLine();
            n++;
            try {
                students.add(Student.parse(line));
            } catch (IllegalArgumentException e) {
                System.out.println("line " + n + " skipped: " + e.getMessage());
            }
        }
        List<Student> list = new ArrayList<>(students);
        list.sort(Comparator.comparingDouble(Student::mark).reversed().thenComparing(Student::name));
        System.out.println(list.size() + " distinct student(s):");
        for (Student s : list) {
            System.out.println("  " + s.code() + " | " + s.name() + " | " + s.mark() + (s.passed() ? " | passed" : " | failed"));
        }
    }
}
`,
    'Student.java': j`
public record Student(String code, String name, double mark) {

    public Student {
        //>> // TODO: normalise and check code, name, mark
        code = code == null ? "" : code.strip().toUpperCase();
        if (!code.matches("[A-Z]{2}\\d{4}")) {
            throw new IllegalArgumentException("bad code: " + code);
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("blank name");
        }
        name = name.strip().replaceAll("\\s+", " ");
        if (mark < 0 || mark > 10) {
            throw new IllegalArgumentException("mark out of range: " + mark);
        }
        //<<
    }

    public static Student parse(String line) {
        String[] p = line.split(";");
        //>> return new Student(p[0], p[1], Double.parseDouble(p[2])); // TODO: 3 fields, "bad mark: …"
        if (p.length != 3) {
            throw new IllegalArgumentException("expected 3 fields");
        }
        double mark;
        try {
            mark = Double.parseDouble(p[2].strip());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("bad mark: " + p[2].strip());
        }
        return new Student(p[0], p[1], mark);
        //<<
    }

    public boolean passed() {
        //>> return false; // TODO
        return mark >= 5;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'seven lines, three bad, one duplicate after normalising', vi: 'bảy dòng, ba dòng sai, một dòng trùng sau chuẩn hoá' }, vao: 'se1001; Nguyen  An ; 8.5\nSE1002;Tran Binh;4\nSE10A1;Le Chi;7\nSE1001;Nguyen An;8.5\nSE1003;   ;9\nse1004;Pham   Thi  Dung;11\nSE1005;Vo Em;7.5\n' },
    { ten: { en: 'missing field, bad mark, boundaries 0 and 10, equal marks', vi: 'thiếu trường, điểm sai, biên 0 và 10, điểm bằng nhau' }, vao: 'AB1234;Zed;10\nAB1235;Anh;10\nAB1236;Bao\nAB1237;Cuong;muoi\nab1238 ; Dat ; 0\nab12345;Long;5\n', an: true },
  ],
  goiY: [
    { en: 'In a compact constructor you assign the PARAMETERS (code = code.strip()…); the fields are set from them after the body.', vi: 'Trong compact constructor bạn gán cho THAM SỐ (code = code.strip()…); trường được gán từ chúng sau thân.' },
    { en: 'Records already implement equals/hashCode on all components — the LinkedHashSet removes the duplicate once the data is normalised.', vi: 'Record đã có equals/hashCode trên mọi thành phần — LinkedHashSet bỏ dòng trùng khi dữ liệu đã chuẩn hoá.' },
  ],
  loiHayGap: [
    { en: 'Normalising in parse instead of the constructor — new Student(" se1001 ", …) built elsewhere would still be dirty.', vi: 'Chuẩn hoá trong parse thay vì constructor — new Student(" se1001 ", …) tạo ở chỗ khác vẫn bẩn.' },
    { en: 'Writing this.code = … inside the compact constructor — a compile error: fields are assigned automatically at the end.', vi: 'Viết this.code = … trong compact constructor — lỗi biên dịch: trường được gán tự động ở cuối.' },
  ],
  giaiThich: { en: '<p>A record with a validating compact constructor is an always-valid value: no setter can break it, and equality is by value. The parse factory stays thin — conversion errors become the same IllegalArgumentException the constructor uses.</p>', vi: '<p>Record có compact constructor kiểm dữ liệu là một giá trị luôn hợp lệ: không setter nào phá được, và bằng nhau theo giá trị. Hàm parse giữ mỏng — lỗi chuyển kiểu thành cùng IllegalArgumentException mà constructor dùng.</p>' },
});

const de2 = deJava({
  id: 'pro192-cs3-enum-switch',
  tieuDe: { en: 'Magic numbers to an enum, a fall-through bug to a switch expression', vi: 'Số ma thuật thành enum, lỗi rơi case thành switch expression' },
  doKho: 'MEDIUM', phut: 25, java: 17,
  khaiNiem: ['enum constants with fields', 'switch expression (->) without default', 'yield in a block', 'exhaustiveness checked by javac'],
  moTa: {
    en: `<p>The lab rents devices. ${c('DeviceType')} must carry, for each constant, the maximum loan days and the deposit: ${c('OSCILLOSCOPE')} 5 days / 200000, ${c('RASPBERRY_PI')} 14 / 100000, ${c('MULTIMETER')} 7 / 0, ${c('LAPTOP')} 3 / 500000. ${c('Fees.fee(type, days)')} is still the old ${c('switch')} with a forgotten ${c('break')}. Rewrite it as a <b>switch expression with no default</b>: oscilloscope 10000/day, Raspberry Pi 2000/day, multimeter free, laptop 30000/day with 10% off for a full 3-day loan (a block with ${c('yield')}); days outside ${c('1..maxDays')} ⇒ ${c('IllegalArgumentException("LAPTOP: 1..3 days")')}.</p>
<p>The given ${c('Main')} reads ${c('TYPE days')} lines and prints ${c('LAPTOP x 3 days: fee 81000, deposit 500000')} or the error (an unknown type prints the message of ${c('valueOf')}).</p>`,
    vi: `<p>Phòng lab cho mượn thiết bị. ${c('DeviceType')} phải mang theo, với mỗi hằng, số ngày mượn tối đa và tiền cọc: ${c('OSCILLOSCOPE')} 5 ngày / 200000, ${c('RASPBERRY_PI')} 14 / 100000, ${c('MULTIMETER')} 7 / 0, ${c('LAPTOP')} 3 / 500000. ${c('Fees.fee(type, days)')} vẫn là ${c('switch')} kiểu cũ quên một ${c('break')}. Viết lại thành <b>switch expression không default</b>: máy hiện sóng 10000/ngày, Raspberry Pi 2000/ngày, đồng hồ đo miễn phí, laptop 30000/ngày giảm 10% khi mượn đủ 3 ngày (khối có ${c('yield')}); số ngày ngoài ${c('1..maxDays')} ⇒ ${c('IllegalArgumentException("LAPTOP: 1..3 days")')}.</p>
<p>${c('Main')} cho sẵn đọc các dòng ${c('TYPE days')} và in ${c('LAPTOP x 3 days: fee 81000, deposit 500000')} hoặc lỗi (loại không tồn tại in thông điệp của ${c('valueOf')}).</p>`,
  },
  yeuCau: { en: ['Do not change Main.java.', 'Fees.fee: a switch expression, no default, no break.'], vi: ['Không sửa Main.java.', 'Fees.fee: switch expression, không default, không break.'] },
  dauVao: { en: 'Lines TYPE days.', vi: 'Các dòng TYPE days.' },
  dauRa: { en: 'One line per input line.', vi: 'Mỗi dòng input một dòng.' },
  main: 'Main',
  quyTac: [
    { id: 'R1', en: 'Fees uses yield (a switch expression with a block)', vi: 'Fees dùng yield (switch expression có khối)', re: String.raw`\byield\b`, file: '^Fees\\.java$', need: true },
    { id: 'R2', en: 'no default and no break in Fees — javac checks that every constant is handled', vi: 'không default và không break trong Fees — javac tự kiểm đủ mọi hằng', re: String.raw`\bdefault\b|\bbreak\b`, file: '^Fees\\.java$' },
  ],
  tep: {
    'Main.java': j`
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split("\\s+");
            if (p.length < 2) {
                continue;
            }
            try {
                DeviceType type = DeviceType.valueOf(p[0]);
                int days = Integer.parseInt(p[1]);
                System.out.println(type + " x " + days + " days: fee " + Fees.fee(type, days) + ", deposit " + type.deposit());
            } catch (IllegalArgumentException e) {
                System.out.println("error: " + e.getMessage());
            }
        }
    }
}
`,
    'DeviceType.java': j`
public enum DeviceType {
    //>> OSCILLOSCOPE, RASPBERRY_PI, MULTIMETER, LAPTOP; // TODO: max loan days + deposit for each constant ⏎  ⏎ public int maxDays() { ⏎     return 0; ⏎ } ⏎  ⏎ public long deposit() { ⏎     return 0; ⏎ }
    OSCILLOSCOPE(5, 200_000), RASPBERRY_PI(14, 100_000), MULTIMETER(7, 0), LAPTOP(3, 500_000);

    private final int maxDays;
    private final long deposit;

    DeviceType(int maxDays, long deposit) {
        this.maxDays = maxDays;
        this.deposit = deposit;
    }

    public int maxDays() {
        return maxDays;
    }

    public long deposit() {
        return deposit;
    }
    //<<
}
`,
    'Fees.java': j`
public class Fees {
    public static long fee(DeviceType type, int days) {
        //>> long fee = 0; ⏎ switch (type) { ⏎     case OSCILLOSCOPE: ⏎         fee = 10000L * days; ⏎     case RASPBERRY_PI: ⏎         fee = 2000L * days; ⏎         break; ⏎     case LAPTOP: ⏎         fee = 30000L * days; ⏎         break; ⏎     default: ⏎         fee = 0; ⏎ } ⏎ return fee; // TODO: a switch expression, no default; check 1..maxDays; laptop 10% off for 3 days
        if (days < 1 || days > type.maxDays()) {
            throw new IllegalArgumentException(type + ": 1.." + type.maxDays() + " days");
        }
        return switch (type) {
            case OSCILLOSCOPE -> 10_000L * days;
            case RASPBERRY_PI -> 2_000L * days;
            case MULTIMETER -> 0;
            case LAPTOP -> {
                long base = 30_000L * days;
                yield days == 3 ? base * 9 / 10 : base;
            }
        };
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'every type, a full laptop loan, too many days', vi: 'mọi loại, mượn laptop đủ 3 ngày, quá số ngày' }, vao: 'OSCILLOSCOPE 5\nRASPBERRY_PI 10\nMULTIMETER 7\nLAPTOP 3\nLAPTOP 2\nLAPTOP 4\n' },
    { ten: { en: 'zero days, the maximum of each type, an unknown type', vi: 'không ngày nào, tối đa từng loại, loại không tồn tại' }, vao: 'MULTIMETER 0\nOSCILLOSCOPE 1\nRASPBERRY_PI 14\nRASPBERRY_PI 15\nPRINTER 2\nLAPTOP 1\n', an: true },
  ],
  goiY: [
    { en: 'Enum constants with data: OSCILLOSCOPE(5, 200_000), … plus private final fields and a constructor.', vi: 'Hằng enum có dữ liệu: OSCILLOSCOPE(5, 200_000), … kèm trường private final và constructor.' },
    { en: 'case LAPTOP -> { long base = …; yield days == 3 ? base * 9 / 10 : base; }', vi: 'case LAPTOP -> { long base = …; yield days == 3 ? base * 9 / 10 : base; }' },
  ],
  loiHayGap: [
    { en: 'Adding a default "to be safe" — then a new constant compiles silently with the default price.', vi: 'Thêm default "cho chắc" — rồi một hằng mới biên dịch lặng lẽ với giá mặc định.' },
    { en: 'The old switch: OSCILLOSCOPE falls through into RASPBERRY_PI and is charged 2000/day.', vi: 'Switch cũ: OSCILLOSCOPE rơi xuống RASPBERRY_PI và bị tính 2000/ngày.' },
  ],
  giaiThich: { en: '<p>An exhaustive switch expression over an enum has no default: if someone adds a fifth device type, this method stops compiling until the price is decided. Arrows never fall through, and yield returns a value from a block.</p>', vi: '<p>Switch expression đủ mọi hằng của enum thì không có default: ai đó thêm loại thiết bị thứ năm, hàm này ngừng biên dịch tới khi giá được quyết định. Mũi tên không bao giờ rơi case, và yield trả giá trị từ một khối.</p>' },
});

const de3 = deJava({
  id: 'pro192-cs3-sealed-payment',
  tieuDe: { en: 'A sealed Payment and its fees with instanceof patterns', vi: 'Payment sealed và phí bằng instanceof pattern' },
  doKho: 'MEDIUM', phut: 30, java: 17,
  khaiNiem: ['sealed interface … permits', 'records implementing an interface', 'instanceof pattern (Java 16)', 'no getClass() / casts'],
  moTa: {
    en: `<p>Model a payment as ${c('sealed interface Payment permits Cash, Card, EWallet')} with three records: ${c('Cash(long amount)')}, ${c('Card(long amount, String network, boolean international)')}, ${c('EWallet(long amount, String provider)')}. Write in ${c('Payments')}:</p>
<ul><li>${c('fee(Payment p)')} (đồng, rounded with ${c('Math.round')}): cash 0; an international card 3%; a ${c('NAPAS')} card 1%; other domestic cards 1.5%; an e-wallet 0.5%, but a flat 50000 when the amount is above 10,000,000;</li>
<li>${c('describe(Payment p)')}: ${c('Cash 500000')}, ${c('Card VISA intl 2000000')} / ${c('Card NAPAS 1000000')}, ${c('EWallet MoMo 12000000')}.</li></ul>
<p>Use ${c('instanceof')} patterns (${c('if (p instanceof Card c && c.international())')}), no casts and no ${c('getClass()')}. (On Java 21 the same logic becomes a pattern ${c('switch')} with record patterns.) The given ${c('Main')} reads lines ${c('cash 500000')}, ${c('card 2000000 VISA intl')}, ${c('wallet 12000000 MoMo')}…</p>`,
    vi: `<p>Mô hình hoá thanh toán bằng ${c('sealed interface Payment permits Cash, Card, EWallet')} với ba record: ${c('Cash(long amount)')}, ${c('Card(long amount, String network, boolean international)')}, ${c('EWallet(long amount, String provider)')}. Viết trong ${c('Payments')}:</p>
<ul><li>${c('fee(Payment p)')} (đồng, làm tròn bằng ${c('Math.round')}): tiền mặt 0; thẻ quốc tế 3%; thẻ ${c('NAPAS')} 1%; thẻ nội địa khác 1,5%; ví điện tử 0,5%, nhưng cố định 50000 khi số tiền trên 10.000.000;</li>
<li>${c('describe(Payment p)')}: ${c('Cash 500000')}, ${c('Card VISA intl 2000000')} / ${c('Card NAPAS 1000000')}, ${c('EWallet MoMo 12000000')}.</li></ul>
<p>Dùng ${c('instanceof')} pattern (${c('if (p instanceof Card c && c.international())')}), không ép kiểu, không ${c('getClass()')}. (Trên Java 21 cùng logic thành ${c('switch')} pattern với record pattern.) ${c('Main')} cho sẵn đọc các dòng ${c('cash 500000')}, ${c('card 2000000 VISA intl')}, ${c('wallet 12000000 MoMo')}…</p>`,
  },
  yeuCau: { en: ['Do not change Main.java.', 'Payment is sealed and permits exactly the three records.'], vi: ['Không sửa Main.java.', 'Payment là sealed và chỉ cho phép đúng ba record.'] },
  dauVao: { en: 'Lines cash AMOUNT · card AMOUNT NETWORK [intl] · wallet AMOUNT PROVIDER.', vi: 'Các dòng cash SỐ_TIỀN · card SỐ_TIỀN MẠNG [intl] · wallet SỐ_TIỀN NHÀ_CUNG_CẤP.' },
  dauRa: { en: 'describe → fee, one line per payment, then the total of the fees.', vi: 'describe → phí, mỗi thanh toán một dòng, rồi tổng phí.' },
  main: 'Main',
  quyTac: [
    { id: 'R1', en: 'Payment is a sealed interface with permits', vi: 'Payment là sealed interface có permits', re: String.raw`sealed\s+interface\s+Payment\s+permits`, need: true },
    { id: 'R2', en: 'no getClass() and no cast to a payment type', vi: 'không getClass() và không ép kiểu sang loại thanh toán', re: String.raw`getClass\s*\(|\(\s*(Cash|Card|EWallet)\s*\)`, file: '^Payments\\.java$' },
  ],
  tep: {
    'Main.java': j`
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long total = 0;
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split("\\s+");
            Payment pay;
            switch (p[0]) {
                case "cash" -> pay = new Cash(Long.parseLong(p[1]));
                case "card" -> pay = new Card(Long.parseLong(p[1]), p[2], p.length > 3 && p[3].equals("intl"));
                case "wallet" -> pay = new EWallet(Long.parseLong(p[1]), p[2]);
                default -> {
                    continue;
                }
            }
            long fee = Payments.fee(pay);
            total += fee;
            System.out.println(Payments.describe(pay) + " -> fee " + fee);
        }
        System.out.println("total fees: " + total);
    }
}
`,
    'Payment.java': j`
//>> public interface Payment { // TODO: sealed, permits the three records
public sealed interface Payment permits Cash, Card, EWallet {
//<<
    long amount();
}
`,
    'Cash.java': j`
public record Cash(long amount) implements Payment {
}
`,
    'Card.java': j`
public record Card(long amount, String network, boolean international) implements Payment {
}
`,
    'EWallet.java': j`
public record EWallet(long amount, String provider) implements Payment {
}
`,
    'Payments.java': j`
public class Payments {
    public static long fee(Payment p) {
        //>> return 0; // TODO: instanceof patterns
        if (p instanceof Card c) {
            double rate = c.international() ? 0.03 : c.network().equals("NAPAS") ? 0.01 : 0.015;
            return Math.round(c.amount() * rate);
        }
        if (p instanceof EWallet w) {
            return w.amount() > 10_000_000 ? 50_000 : Math.round(w.amount() * 0.005);
        }
        return 0;
        //<<
    }

    public static String describe(Payment p) {
        //>> return "?"; // TODO
        if (p instanceof Cash c) {
            return "Cash " + c.amount();
        }
        if (p instanceof Card c) {
            return "Card " + c.network() + (c.international() ? " intl " : " ") + c.amount();
        }
        if (p instanceof EWallet w) {
            return "EWallet " + w.provider() + " " + w.amount();
        }
        throw new IllegalStateException("unknown payment");
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'one payment of each kind', vi: 'mỗi loại một thanh toán' }, vao: 'cash 500000\ncard 2000000 VISA intl\ncard 1000000 NAPAS\ncard 333333 JCB\nwallet 12000000 MoMo\nwallet 2000000 ZaloPay\n' },
    { ten: { en: 'the 10,000,000 boundary and rounding', vi: 'biên 10.000.000 và làm tròn' }, vao: 'wallet 10000000 MoMo\nwallet 10000001 MoMo\ncard 999 NAPAS\ncard 101 VISA intl\ncash 0\n', an: true },
  ],
  goiY: [
    { en: 'A pattern binds a typed variable only when the test succeeds: if (p instanceof EWallet w) { … w.provider() … }.', vi: 'Pattern gắn biến có kiểu chỉ khi phép thử đúng: if (p instanceof EWallet w) { … w.provider() … }.' },
    { en: 'sealed + permits: the compiler then knows Cash, Card and EWallet are the only payments.', vi: 'sealed + permits: trình biên dịch biết Cash, Card và EWallet là các loại thanh toán duy nhất.' },
  ],
  loiHayGap: [
    { en: 'c.network() == "NAPAS" — compares references; use equals.', vi: 'c.network() == "NAPAS" — so tham chiếu; dùng equals.' },
    { en: 'amount * 3 / 100 in long arithmetic — truncates instead of rounding.', vi: 'amount * 3 / 100 bằng số nguyên long — cắt bỏ thay vì làm tròn.' },
  ],
  giaiThich: { en: '<p>Sealed types close the hierarchy: a new BankTransfer must be added to permits, and on Java 21 every exhaustive pattern switch over Payment would then fail to compile until it handles the new case. With Java 17 instanceof chains the compiler cannot check that — one more reason the switch form is coming.</p>', vi: '<p>Kiểu sealed đóng cây kế thừa: thêm BankTransfer phải ghi vào permits, và trên Java 21 mọi switch pattern đủ trường hợp trên Payment sẽ ngừng biên dịch tới khi xử lý trường hợp mới. Chuỗi instanceof của Java 17 thì trình biên dịch không kiểm được điều đó — thêm một lý do dạng switch đang tới.</p>' },
});

const de4 = deJava({
  id: 'pro192-cs3-text-block',
  tieuDe: { en: 'An SQL query and a JSON body as text blocks, checked character by character', vi: 'Câu SQL và thân JSON bằng text block, kiểm từng ký tự' },
  doKho: 'MEDIUM', phut: 25, java: 17,
  khaiNiem: ['text block """', 'incidental indentation is removed', 'a closing """ on the last line ⇒ no trailing newline', 'String.formatted', 'escaping " and \\ in JSON'],
  moTa: {
    en: `<p>In ${c('Report')}, write the constant ${c('SQL')} as a text block equal to exactly these four lines — no trailing newline, the first line at column 0, the keywords aligned:</p>
<pre>SELECT s.code, s.name, COUNT(*) AS loans
FROM   loan l JOIN student s ON s.id = l.student_id
WHERE  l.returned_at IS NULL
GROUP  BY s.code, s.name</pre>
<p>and ${c('json(name, id, device)')} returning, with a text block and ${c('formatted')}, a JSON object of three fields indented by two spaces and ending with a newline after ${c('}')} — the name may contain ${c('"')} and ${c('\\')}, which must be escaped (${c('\\"')}, ${c('\\\\')}). The given ${c('Main')} prints the query, its line count and whether it ends with a newline, then the JSON of each input line.</p>`,
    vi: `<p>Trong ${c('Report')}, viết hằng ${c('SQL')} bằng text block đúng bốn dòng trên — không xuống dòng ở cuối, dòng đầu ở cột 0, các từ khoá thẳng hàng; và ${c('json(name, id, device)')} trả về, bằng text block và ${c('formatted')}, một đối tượng JSON ba trường thụt hai dấu cách, kết thúc bằng xuống dòng sau ${c('}')} — tên có thể chứa ${c('"')} và ${c('\\')}, phải được thoát (${c('\\"')}, ${c('\\\\')}). ${c('Main')} cho sẵn in câu truy vấn, số dòng và có kết thúc bằng xuống dòng không, rồi JSON của từng dòng input.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java.', 'Both strings are text blocks.'], vi: ['Không sửa Main.java.', 'Cả hai chuỗi đều là text block.'] },
  dauVao: { en: 'Lines name;id;device.', vi: 'Các dòng name;id;device.' },
  dauRa: { en: 'The query block, then one JSON object per line.', vi: 'Khối câu truy vấn, rồi mỗi dòng một đối tượng JSON.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'text blocks are used', vi: 'có dùng text block', re: String.raw`""[ \t]*\r?\n`, file: '^Report\\.java$', need: true }],
  tep: {
    'Main.java': j`
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        System.out.println(Report.SQL);
        System.out.println("-- lines: " + Report.SQL.lines().count() + ", ends with newline: " + Report.SQL.endsWith("\n"));
        Scanner sc = new Scanner(System.in);
        while (sc.hasNextLine()) {
            String line = sc.nextLine();
            if (line.isBlank()) {
                continue;
            }
            String[] p = line.split(";");
            String body = Report.json(p[0], Integer.parseInt(p[1].trim()), p[2].trim());
            System.out.print(body);
            System.out.println("-- 2-space fields: " + body.lines().filter(l -> l.startsWith("  \"")).count() + ", ends with newline: " + body.endsWith("\n"));
        }
    }
}
`,
    'Report.java': j`
public class Report {
    //>> public static final String SQL = ""; // TODO: a text block, four lines, no trailing newline
    public static final String SQL = """
            SELECT s.code, s.name, COUNT(*) AS loans
            FROM   loan l JOIN student s ON s.id = l.student_id
            WHERE  l.returned_at IS NULL
            GROUP  BY s.code, s.name""";
    //<<

    static String escape(String s) {
        //>> return s; // TODO: escape \ then "
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
        //<<
    }

    public static String json(String name, int id, String device) {
        //>> return "{\"name\": \"" + name + "\"}"; // TODO: a text block + formatted, fields indented by 2 spaces
        return """
                {
                  "name": "%s",
                  "id": %d,
                  "device": "%s"
                }
                """.formatted(escape(name), id, escape(device));
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'plain names and a name with quotes', vi: 'tên thường và tên có ngoặc kép' }, vao: 'Nguyen An;7;Oscilloscope\nTran "Bin" Binh;12;Raspberry Pi 4\n' },
    { ten: { en: 'a backslash in the name and in the device', vi: 'dấu gạch ngược trong tên và tên thiết bị' }, vao: 'C:\\Users\\An;1;Lab\\PC-03\nX;0;"quoted"\n', an: true },
  ],
  goiY: [
    { en: 'The indentation removed from a text block is set by the least-indented line INCLUDING the line of the closing """. Put """ right after GROUP BY … to have no trailing newline.', vi: 'Phần thụt bị bỏ của text block tính theo dòng thụt ít nhất KỂ CẢ dòng chứa """ đóng. Đặt """ ngay sau GROUP BY … để không có xuống dòng cuối.' },
    { en: 'Escape the backslash first, then the quote — the other order doubles the backslashes you just added.', vi: 'Thoát gạch ngược trước, rồi ngoặc kép — làm ngược thì nhân đôi các gạch ngược vừa thêm.' },
  ],
  loiHayGap: [
    { en: 'Closing """ on its own line for SQL — the string then ends with \\n and "lines" stays 4 but "ends with newline" becomes true.', vi: 'Đóng """ ở dòng riêng cho SQL — chuỗi kết thúc bằng \\n, "lines" vẫn 4 nhưng "ends with newline" thành true.' },
    { en: 'Indenting the closing """ less than the content — the content gets extra leading spaces.', vi: 'Thụt """ đóng ít hơn nội dung — nội dung bị thêm dấu cách đầu dòng.' },
  ],
  giaiThich: { en: '<p>Text blocks keep the code readable while producing an exact string: incidental indentation goes, trailing spaces go, line terminators become \\n on every OS. Measuring the result (lines, endsWith) beats trusting your eyes.</p>', vi: '<p>Text block giữ code dễ đọc mà vẫn ra chuỗi chính xác: phần thụt ngẫu nhiên bị bỏ, dấu cách cuối dòng bị bỏ, xuống dòng thành \\n trên mọi hệ điều hành. Đo kết quả (số dòng, endsWith) tốt hơn tin vào mắt.</p>' },
});

const de5 = deJava({
  id: 'pro192-cs3-ve-jdk8',
  tieuDe: { en: 'Bring Java 17 code back to the JDK 8 exam room — identical output', vi: 'Đưa code Java 17 về phòng thi JDK 8 — output y hệt' },
  doKho: 'MEDIUM', phut: 30, java: 8, release: 8, khoiDauLoi: true,
  khaiNiem: ['record → final class with equals/hashCode/toString', 'switch expression → if/else or classic switch', 'var, List.of, isBlank, strip, repeat → Java 8', 'instanceof pattern → instanceof + cast'],
  moTa: {
    en: `<p>This program was written with Java 17 habits: a ${c('record')} with validation, a switch expression with several labels, ${c('var')}, ${c('List.of')}, ${c('isBlank')}, ${c('strip')}, ${c('repeat')} and an ${c('instanceof')} pattern. The exam room has JDK 8 and the grader compiles it like that room (${c('javac --release 8')}), so it does not compile. Rewrite it so that it compiles on Java 8 and prints <b>exactly</b> the same lines (the expected output is the Java 17 version’s output). Keep ${c('Mark')} a value class: private final fields, getters ${c('code()')} / ${c('mark()')}, the same validation, and ${c('equals')}/${c('hashCode')}/${c('toString')} like the record’s (${c('Mark[code=SE1, mark=8.5]')}).</p>`,
    vi: `<p>Chương trình này viết theo thói quen Java 17: ${c('record')} có kiểm dữ liệu, switch expression nhiều nhãn, ${c('var')}, ${c('List.of')}, ${c('isBlank')}, ${c('strip')}, ${c('repeat')} và ${c('instanceof')} pattern. Phòng thi có JDK 8 và máy chấm biên dịch như phòng đó (${c('javac --release 8')}), nên nó không biên dịch. Viết lại để biên dịch được trên Java 8 và in <b>đúng</b> các dòng như cũ (output mong đợi là output của bản Java 17). Giữ ${c('Mark')} là lớp giá trị: trường private final, getter ${c('code()')} / ${c('mark()')}, cùng phép kiểm, và ${c('equals')}/${c('hashCode')}/${c('toString')} giống record (${c('Mark[code=SE1, mark=8.5]')}).</p>`,
  },
  dauVao: { en: 'Lines code;mark.', vi: 'Các dòng code;mark.' },
  dauRa: { en: 'The same report as the Java 17 version.', vi: 'Cùng báo cáo như bản Java 17.' },
  main: 'Main',
  tep: {
    'Main.java': j`
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Scanner;
import java.util.Set;

public class Main {
    //>> record Mark(String code, double mark) { ⏎     Mark { ⏎         if (code.isBlank()) throw new IllegalArgumentException("blank code"); ⏎         if (mark < 0 || mark > 10) throw new IllegalArgumentException("bad mark " + mark); ⏎     } ⏎ }
    static final class Mark {
        private final String code;
        private final double mark;

        Mark(String code, double mark) {
            if (code.trim().isEmpty()) {
                throw new IllegalArgumentException("blank code");
            }
            if (mark < 0 || mark > 10) {
                throw new IllegalArgumentException("bad mark " + mark);
            }
            this.code = code;
            this.mark = mark;
        }

        String code() {
            return code;
        }

        double mark() {
            return mark;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) {
                return true;
            }
            if (!(o instanceof Mark)) {
                return false;
            }
            Mark m = (Mark) o;
            return Double.compare(mark, m.mark) == 0 && code.equals(m.code);
        }

        @Override
        public int hashCode() {
            return Objects.hash(code, mark);
        }

        @Override
        public String toString() {
            return "Mark[code=" + code + ", mark=" + mark + "]";
        }
    }
    //<<

    static String grade(double m) {
        //>> return switch ((int) m) { ⏎     case 10, 9 -> "A"; ⏎     case 8, 7 -> "B"; ⏎     case 6, 5 -> "C"; ⏎     default -> "F"; ⏎ };
        int k = (int) m;
        if (k >= 9) {
            return "A";
        }
        if (k >= 7) {
            return "B";
        }
        if (k >= 5) {
            return "C";
        }
        return "F";
        //<<
    }

    static String describe(Object o) {
        //>> if (o instanceof Mark m && m.mark() >= 5) { ⏎     return m.code() + " passed"; ⏎ } ⏎ return o + " ignored";
        if (o instanceof Mark && ((Mark) o).mark() >= 5) {
            return ((Mark) o).code() + " passed";
        }
        return o + " ignored";
        //<<
    }

    public static void main(String[] args) {
        //>> var sc = new Scanner(System.in); ⏎ var marks = new ArrayList<Mark>();
        Scanner sc = new Scanner(System.in);
        List<Mark> marks = new ArrayList<>();
        //<<
        while (sc.hasNextLine()) {
            //>> var line = sc.nextLine().strip(); ⏎ if (line.isBlank()) continue;
            String line = sc.nextLine().trim();
            if (line.isEmpty()) {
                continue;
            }
            //<<
            String[] p = line.split(";");
            try {
                //>> marks.add(new Mark(p[0].strip(), Double.parseDouble(p[1].strip())));
                marks.add(new Mark(p[0].trim(), Double.parseDouble(p[1].trim())));
                //<<
            } catch (IllegalArgumentException e) {
                System.out.println("skip: " + e.getMessage());
            }
        }
        //>> System.out.println("=".repeat(20));
        System.out.println(new String(new char[20]).replace('\0', '='));
        //<<
        for (Mark m : marks) {
            System.out.println(m + " " + grade(m.mark()));
        }
        //>> List<Object> things = List.of(marks.isEmpty() ? "none" : marks.get(0), "text", 42);
        List<Object> things = Arrays.asList(marks.isEmpty() ? "none" : marks.get(0), "text", 42);
        //<<
        for (Object o : things) {
            System.out.println(describe(o));
        }
        Set<Mark> unique = new LinkedHashSet<>(marks);
        System.out.println("unique marks: " + unique.size());
    }
}
`,
  },
  ca: [
    { ten: { en: 'five lines, a duplicate, a bad mark', vi: 'năm dòng, một dòng trùng, một điểm sai' }, vao: 'SE1;8.5\nSE2;4\nSE1;8.5\n  ;7\nSE3;10.5\nSE4;9\n' },
    { ten: { en: 'only failing marks, a mark of exactly 5 and 0', vi: 'chỉ điểm trượt, đúng 5 và 0' }, vao: 'A;3\nB;5\nC;0\n', an: true },
    { ten: { en: 'no valid line', vi: 'không dòng nào hợp lệ' }, vao: ' ;1\nX;-1\n', an: true },
  ],
  goiY: [
    { en: 'record → static final class with private final fields, the same accessor names, and equals/hashCode/toString written by hand (toString like Mark[code=SE1, mark=8.5]).', vi: 'record → static final class với trường private final, cùng tên accessor, và equals/hashCode/toString tự viết (toString như Mark[code=SE1, mark=8.5]).' },
    { en: 'isBlank → trim().isEmpty(); strip → trim (same for ASCII spaces); "=".repeat(20) → a loop or new String(new char[20]).replace(\'\\0\', \'=\'); List.of → Arrays.asList.', vi: 'isBlank → trim().isEmpty(); strip → trim (như nhau với dấu cách ASCII); "=".repeat(20) → vòng lặp hoặc new String(new char[20]).replace(\'\\0\', \'=\'); List.of → Arrays.asList.' },
  ],
  loiHayGap: [
    { en: 'Forgetting equals/hashCode in the class version — the LinkedHashSet then keeps the duplicate and "unique marks" changes.', vi: 'Quên equals/hashCode ở bản class — LinkedHashSet giữ cả dòng trùng và "unique marks" đổi.' },
    { en: 'Testing only on JDK 17/21 without --release 8 — everything compiles at home.', vi: 'Chỉ chạy thử trên JDK 17/21 không --release 8 — ở nhà cái gì cũng biên dịch được.' },
  ],
  giaiThich: { en: '<p>Each Java 9–17 convenience has a Java 8 spelling; the one that changes behaviour if forgotten is the record’s generated equals/hashCode/toString. --release 8 checks both the syntax and the API (List.of, isBlank, repeat do not exist in Java 8’s library).</p>', vi: '<p>Mỗi tiện ích Java 9–17 đều có cách viết Java 8; thứ đổi hành vi nếu quên là equals/hashCode/toString do record sinh ra. --release 8 kiểm cả cú pháp lẫn API (List.of, isBlank, repeat không có trong thư viện Java 8).</p>' },
});

export default moDun({ slug: 'pro192-cs3-on', ten: '⭐ CS.3 Modern Java 17: records, enums, sealed, text blocks', de: [de1, de2, de3, de4, de5] });
