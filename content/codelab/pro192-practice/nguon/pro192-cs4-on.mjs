/** PRO192 · ⭐ CS.4 — Hợp đồng đối tượng: equals/hashCode nhất quán, lớp bất biến bị tấn công 4 kiểu, VAT bằng BigDecimal, builder báo mọi lỗi một lần. Ý đề: gen/src/extra/cs4-on.txt + gen/java/cs4/Bt*.java. */
import { moDun, deJava, c, j } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-cs4-equals-hashcode',
  tieuDe: { en: 'Bug hunt: equals ignores case, hashCode does not', vi: 'Săn lỗi: equals bỏ qua hoa thường, hashCode thì không' },
  doKho: 'MEDIUM', phut: 20, java: 17,
  khaiNiem: ['equal objects must have equal hash codes', 'HashSet looks in the bucket of hashCode first', 'normalise once in the constructor', '@Override equals(Object)'],
  moTa: {
    en: `<p>A teammate wrote ${c('Course')} so that ${c('PRJ301')} and ${c('prj301')} are the same course: ${c('equals')} compares the codes ignoring case — but ${c('hashCode')} still hashes the code as typed. The given ${c('Main')} reads course codes, puts them into an ${c('ArrayList')}, a ${c('HashSet')} and a ${c('HashMap<Course, Integer>')} (how many times each course was typed), then answers lookups. With the bug, ${c('list.contains')} finds a course that ${c('set.contains')} misses, and the set keeps "duplicates". Fix ${c('Course')} so that both agree. The code is kept as first typed for printing (${c('toString')}), but compared ignoring case.</p>`,
    vi: `<p>Một bạn cùng nhóm viết ${c('Course')} để ${c('PRJ301')} và ${c('prj301')} là một môn: ${c('equals')} so mã không phân biệt hoa thường — nhưng ${c('hashCode')} vẫn băm mã như lúc gõ. ${c('Main')} cho sẵn đọc các mã môn, cho vào ${c('ArrayList')}, ${c('HashSet')} và ${c('HashMap<Course, Integer>')} (mỗi môn được gõ mấy lần), rồi trả lời các câu tra. Với lỗi này, ${c('list.contains')} tìm thấy một môn mà ${c('set.contains')} bỏ sót, và set giữ "bản trùng". Sửa ${c('Course')} để hai bên khớp. Mã giữ nguyên như lần gõ đầu để in (${c('toString')}), nhưng so không phân biệt hoa thường.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java.', 'Keep equals ignoring case; fix the contract on the hashCode side.'], vi: ['Không sửa Main.java.', 'Giữ equals không phân biệt hoa thường; sửa hợp đồng ở phía hashCode.'] },
  dauVao: { en: 'Line 1: course codes typed by students. Line 2: codes to look up.', vi: 'Dòng 1: mã môn sinh viên gõ. Dòng 2: các mã cần tra.' },
  dauRa: { en: 'Sizes, counts, then one line per lookup.', vi: 'Kích thước, số đếm, rồi mỗi câu tra một dòng.' },
  main: 'Main',
  tep: {
    'Main.java': j`
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.Set;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] typed = sc.nextLine().trim().split("\\s+");
        String[] asked = sc.hasNextLine() ? sc.nextLine().trim().split("\\s+") : new String[0];
        List<Course> list = new ArrayList<>();
        Set<Course> set = new HashSet<>();
        Map<Course, Integer> count = new HashMap<>();
        for (String t : typed) {
            Course c = new Course(t);
            list.add(c);
            set.add(c);
            count.merge(c, 1, Integer::sum);
        }
        System.out.println("typed " + list.size() + ", distinct in the set " + set.size() + ", keys in the map " + count.size());
        Map<String, Integer> shown = new LinkedHashMap<>();
        for (Course c : list) {
            if (!shown.containsKey(c.toString().toUpperCase())) {
                shown.put(c.toString().toUpperCase(), count.get(c));
            }
        }
        System.out.println("counts " + shown);
        for (String a : asked) {
            Course q = new Course(a);
            System.out.println(a + ": list " + list.contains(q) + ", set " + set.contains(q) + ", map " + count.getOrDefault(q, 0));
        }
    }
}
`,
    'Course.java': j`
import java.util.Locale;

public class Course {
    private final String code;

    public Course(String code) {
        this.code = code.trim();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Course)) {
            return false;
        }
        return code.equalsIgnoreCase(((Course) o).code);
    }

    @Override
    public int hashCode() {
        //>> return code.hashCode(); // TODO: equal courses must have equal hash codes
        return code.toUpperCase(Locale.ROOT).hashCode();
        //<<
    }

    @Override
    public String toString() {
        return code;
    }
}
`,
  },
  ca: [
    { ten: { en: 'PRJ301 typed three ways', vi: 'PRJ301 gõ ba kiểu' }, vao: 'PRJ301 prj301 Prj301 SWE201 swe201\nPRJ301 pRJ301 MAD101\n' },
    { ten: { en: 'all distinct, lookups in other cases', vi: 'đều khác nhau, tra bằng kiểu chữ khác' }, vao: 'CSD201 DBI202 OSG202 MAE101\ncsd201 Dbi202 osg201\n', an: true },
    { ten: { en: 'one course typed many times', vi: 'một môn gõ nhiều lần' }, vao: 'jpd113 JPD113 Jpd113 jPD113 JPd113\nJPD113\n', an: true },
  ],
  goiY: [
    { en: 'Whatever equals ignores, hashCode must ignore too: hash the upper-cased code (Locale.ROOT avoids the Turkish-i surprise).', vi: 'equals bỏ qua điều gì thì hashCode cũng phải bỏ qua: băm mã đã viết hoa (Locale.ROOT tránh bất ngờ chữ i tiếng Thổ Nhĩ Kỳ).' },
    { en: 'A HashSet first jumps to the bucket of hashCode(); equals is only asked inside that bucket.', vi: 'HashSet nhảy tới ô của hashCode() trước; equals chỉ được hỏi bên trong ô đó.' },
  ],
  loiHayGap: [
    { en: 'Upper-casing the code in the constructor — it fixes the contract but changes what toString prints.', vi: 'Viết hoa mã ngay trong constructor — sửa được hợp đồng nhưng đổi thứ toString in ra.' },
    { en: 'return 1; as hashCode — legal, but every course lands in one bucket and the set becomes a slow list.', vi: 'return 1; làm hashCode — hợp lệ, nhưng mọi môn rơi vào một ô và set thành một list chậm.' },
  ],
  giaiThich: { en: '<p>The contract: a.equals(b) ⇒ a.hashCode() == b.hashCode(). ArrayList.contains only uses equals, so it "works"; HashSet and HashMap use hashCode first and look in the wrong bucket. Hash exactly what equals compares, normalised the same way.</p>', vi: '<p>Hợp đồng: a.equals(b) ⇒ a.hashCode() == b.hashCode(). ArrayList.contains chỉ dùng equals nên "chạy được"; HashSet và HashMap dùng hashCode trước nên tìm nhầm ô. Băm đúng thứ equals so, chuẩn hoá cùng một cách.</p>' },
});

const de2 = deJava({
  id: 'pro192-cs4-hoa-don-bat-bien',
  tieuDe: { en: 'An immutable invoice, attacked four ways', vi: 'Hoá đơn bất biến, bị tấn công bốn kiểu' },
  doKho: 'MEDIUM', phut: 30, java: 17,
  khaiNiem: ['final class, private final fields', 'defensive copy in the constructor', 'unmodifiable view in the getter', 'LocalDate is already immutable', '"with" method returns a new object'],
  moTa: {
    en: `<p>Write ${c('Invoice')} (number, a ${c('LocalDate')}, a list of ${c('Line(name, quantity, unitPrice)')} — ${c('Line')} is a record) so that <b>nothing can change an invoice after it is created</b>. An empty list or a null list is rejected with ${c('IllegalArgumentException("an invoice needs at least one line")')}. ${c('total()')} is the sum of quantity × unit price; ${c('withLine(line)')} returns a NEW invoice with one more line.</p>
<p>The given ${c('Main')} builds an invoice from the input and attacks it: (1) it changes the list it passed to the constructor, (2) it adds a line through ${c('getLines()')}, (3) it "moves" the date with ${c('getDate().plusDays(30)')}, (4) it adds a line the legal way. After each attack it prints the total and the date. A refused change prints ${c('refused')}.</p>`,
    vi: `<p>Viết ${c('Invoice')} (số hoá đơn, một ${c('LocalDate')}, danh sách ${c('Line(name, quantity, unitPrice)')} — ${c('Line')} là record) sao cho <b>không gì đổi được hoá đơn sau khi tạo</b>. Danh sách rỗng hoặc null bị từ chối bằng ${c('IllegalArgumentException("an invoice needs at least one line")')}. ${c('total()')} là tổng số lượng × đơn giá; ${c('withLine(line)')} trả về hoá đơn MỚI có thêm một dòng.</p>
<p>${c('Main')} cho sẵn dựng hoá đơn từ input rồi tấn công: (1) sửa list đã đưa vào constructor, (2) thêm dòng qua ${c('getLines()')}, (3) "dời" ngày bằng ${c('getDate().plusDays(30)')}, (4) thêm dòng đúng cách. Sau mỗi lần in tổng tiền và ngày. Thay đổi bị chặn thì in ${c('refused')}.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java and Line.java.', 'Use only Java 8 APIs inside Invoice (Collections.unmodifiableList, new ArrayList<>(…)).'], vi: ['Không sửa Main.java và Line.java.', 'Trong Invoice chỉ dùng API Java 8 (Collections.unmodifiableList, new ArrayList<>(…)).'] },
  dauVao: { en: 'Line 1: number;date (yyyy-MM-dd). Then lines name;quantity;unitPrice (possibly none).', vi: 'Dòng 1: số;ngày (yyyy-MM-dd). Rồi các dòng tên;số lượng;đơn giá (có thể không có).' },
  dauRa: { en: 'The invoice, then the result of each attack.', vi: 'Hoá đơn, rồi kết quả của từng lần tấn công.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'Invoice is a final class with private final fields', vi: 'Invoice là lớp final với các trường private final', re: String.raw`public\s+final\s+class\s+Invoice`, file: '^Invoice\\.java$', need: true }],
  tep: {
    'Main.java': j`
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    static void show(String step, Invoice inv) {
        System.out.println(step + ": total " + inv.total() + ", date " + inv.getDate() + ", lines " + inv.getLines().size());
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] head = sc.nextLine().trim().split(";");
        List<Line> lines = new ArrayList<>();
        while (sc.hasNextLine()) {
            String s = sc.nextLine().trim();
            if (!s.isEmpty()) {
                String[] p = s.split(";");
                lines.add(new Line(p[0].trim(), Integer.parseInt(p[1].trim()), Long.parseLong(p[2].trim())));
            }
        }
        Invoice inv;
        try {
            inv = new Invoice(head[0], LocalDate.parse(head[1].trim()), lines);
        } catch (IllegalArgumentException e) {
            System.out.println("rejected: " + e.getMessage());
            return;
        }
        show("created " + inv.getNumber(), inv);
        lines.add(new Line("Hack 1", 1, 1_000_000));
        show("(1) after changing the caller's list", inv);
        try {
            inv.getLines().add(new Line("Hack 2", 1, 2_000_000));
            System.out.println("(2) add through the getter: accepted");
        } catch (UnsupportedOperationException e) {
            System.out.println("(2) add through the getter: refused");
        }
        show("(2)", inv);
        LocalDate moved = inv.getDate().plusDays(30);
        System.out.println("(3) plusDays gave " + moved + " but the invoice says " + inv.getDate());
        Invoice more = inv.withLine(new Line("Extra cable", 2, 45_000));
        show("(4) new invoice", more);
        show("(4) old invoice", inv);
    }
}
`,
    'Line.java': j`
// GIVEN — do not change. A record is already immutable.
public record Line(String name, int quantity, long unitPrice) {
}
`,
    'Invoice.java': j`
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

//>> public class Invoice { // TODO: make it immutable
public final class Invoice {
//<<
    //>> private String number; ⏎ private LocalDate date; ⏎ private List<Line> lines;
    private final String number;
    private final LocalDate date;
    private final List<Line> lines;
    //<<

    public Invoice(String number, LocalDate date, List<Line> lines) {
        //>> this.number = number; ⏎ this.date = date; ⏎ this.lines = lines; // TODO: reject empty, copy defensively
        if (lines == null || lines.isEmpty()) {
            throw new IllegalArgumentException("an invoice needs at least one line");
        }
        this.number = number;
        this.date = date;
        this.lines = Collections.unmodifiableList(new ArrayList<>(lines));
        //<<
    }

    public String getNumber() {
        return number;
    }

    public LocalDate getDate() {
        return date;
    }

    public List<Line> getLines() {
        return lines;
    }

    public long total() {
        long sum = 0;
        for (Line l : lines) {
            sum += l.quantity() * l.unitPrice();
        }
        return sum;
    }

    public Invoice withLine(Line line) {
        //>> lines.add(line); ⏎ return this; // TODO: a NEW invoice
        List<Line> copy = new ArrayList<>(lines);
        copy.add(line);
        return new Invoice(number, date, copy);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'an invoice of three lines', vi: 'hoá đơn ba dòng' }, vao: 'HD-001;2026-11-01\nKeyboard;2;350000\nMouse;3;120000\nMonitor;1;2900000\n' },
    { ten: { en: 'an empty invoice is rejected', vi: 'hoá đơn rỗng bị từ chối' }, vao: 'HD-002;2026-12-31\n', an: true },
    { ten: { en: 'one line, a date at the end of a month', vi: 'một dòng, ngày cuối tháng' }, vao: 'HD-003;2026-01-31\nPen;10;5000\n', an: true },
  ],
  goiY: [
    { en: 'Constructor: this.lines = Collections.unmodifiableList(new ArrayList<>(lines)) — the copy cuts the link with the caller, the view refuses add().', vi: 'Constructor: this.lines = Collections.unmodifiableList(new ArrayList<>(lines)) — bản sao cắt liên kết với nơi gọi, view từ chối add().' },
    { en: 'LocalDate is immutable: plusDays returns a new date and never changes the invoice’s.', vi: 'LocalDate bất biến: plusDays trả ngày mới, không bao giờ đổi ngày của hoá đơn.' },
  ],
  loiHayGap: [
    { en: 'Only wrapping: Collections.unmodifiableList(lines) without the copy — attack (1) still changes the invoice through the caller’s list.', vi: 'Chỉ bọc: Collections.unmodifiableList(lines) không sao chép — tấn công (1) vẫn đổi hoá đơn qua list của nơi gọi.' },
    { en: 'Using java.util.Date: it has setTime(), so the getter would have to return a copy too.', vi: 'Dùng java.util.Date: nó có setTime(), nên getter cũng phải trả bản sao.' },
  ],
  giaiThich: { en: '<p>Immutability = final class (no subclass can add state) + private final fields + defensive copy IN + no way to change OUT (unmodifiable view or copy) + "with" methods that build a new object. Fields of immutable types (String, LocalDate, records of immutables) need nothing more.</p>', vi: '<p>Bất biến = lớp final (không lớp con thêm trạng thái) + trường private final + sao chép phòng thủ khi VÀO + không có đường đổi khi RA (view không sửa được hoặc bản sao) + hàm "with" dựng đối tượng mới. Trường kiểu bất biến (String, LocalDate, record của các kiểu bất biến) không cần gì thêm.</p>' },
});

const de3 = deJava({
  id: 'pro192-cs4-vat-bigdecimal',
  tieuDe: { en: 'VAT on a VND invoice: round each line or round the total?', vi: 'VAT trên hoá đơn đồng: làm tròn từng dòng hay làm tròn tổng?' },
  doKho: 'MEDIUM', phut: 25, java: 17,
  khaiNiem: ['new BigDecimal(String), never new BigDecimal(double)', 'setScale(0, RoundingMode.HALF_UP)', 'compareTo vs equals (2.0 vs 2.00)', 'stripTrailingZeros().toPlainString()'],
  moTa: {
    en: `<p>Line 1 is the VAT rate (e.g. ${c('0.08')}), then one amount in đồng per line. Compute with ${c('BigDecimal')}:</p>
<pre>exact VAT: 1811.6
rule A (round each line): 1811
rule B (round the total): 1812
A - B: -1
double: 1811.6000000000001</pre>
<p>${c('exact')} = total × rate printed with ${c('stripTrailingZeros().toPlainString()')}; rule A = the VAT of each line rounded to whole đồng with ${c('HALF_UP')}, then summed; rule B = the exact VAT rounded once; ${c('A - B')} the difference; ${c('double')} = the same exact VAT computed with ${c('double')} (sum of amount × rate, printed with ${c('String.valueOf')}) — to see why money never goes in a double.</p>`,
    vi: `<p>Dòng 1 là thuế suất VAT (ví dụ ${c('0.08')}), rồi mỗi dòng một số tiền (đồng). Tính bằng ${c('BigDecimal')} và in như mẫu: ${c('exact')} = tổng × thuế suất in bằng ${c('stripTrailingZeros().toPlainString()')}; quy tắc A = VAT từng dòng làm tròn tới đồng bằng ${c('HALF_UP')} rồi cộng; quy tắc B = VAT chính xác làm tròn một lần; ${c('A - B')} chênh lệch; ${c('double')} = cùng VAT chính xác tính bằng ${c('double')} (tổng số tiền × thuế suất, in bằng ${c('String.valueOf')}) — để thấy vì sao tiền không bao giờ để trong double.</p>`,
  },
  dauVao: { en: 'The rate, then amounts (integers), one per line.', vi: 'Thuế suất, rồi các số tiền (số nguyên), mỗi dòng một số.' },
  dauRa: { en: 'Five lines.', vi: 'Năm dòng.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'no new BigDecimal(double) / BigDecimal.valueOf(double) for the money', vi: 'không new BigDecimal(double) / BigDecimal.valueOf(double) cho tiền', re: String.raw`new\s+BigDecimal\s*\(\s*[\d.]+\s*\)|BigDecimal\s*\.\s*valueOf\s*\(\s*\w+\s*\*` }],
  tep: {
    'Main.java': j`
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String rateText = sc.nextLine().trim();
        List<String> amounts = new ArrayList<>();
        while (sc.hasNextLine()) {
            String s = sc.nextLine().trim();
            if (!s.isEmpty()) {
                amounts.add(s);
            }
        }
        //>> double rate = Double.parseDouble(rateText); // TODO: BigDecimal for exact, rule A, rule B, A - B ⏎ double sum = 0; ⏎ for (String a : amounts) { ⏎     sum += Double.parseDouble(a) * rate; ⏎ } ⏎ System.out.println("exact VAT: " + sum); ⏎ System.out.println("rule A (round each line): " + Math.round(sum)); ⏎ System.out.println("rule B (round the total): " + Math.round(sum)); ⏎ System.out.println("A - B: 0"); ⏎ System.out.println("double: " + sum);
        BigDecimal rate = new BigDecimal(rateText);
        BigDecimal total = BigDecimal.ZERO;
        BigDecimal ruleA = BigDecimal.ZERO;
        double dbl = 0;
        for (String a : amounts) {
            BigDecimal amount = new BigDecimal(a);
            total = total.add(amount);
            ruleA = ruleA.add(amount.multiply(rate).setScale(0, RoundingMode.HALF_UP));
            dbl += Double.parseDouble(a) * Double.parseDouble(rateText);
        }
        BigDecimal exact = total.multiply(rate);
        BigDecimal ruleB = exact.setScale(0, RoundingMode.HALF_UP);
        System.out.println("exact VAT: " + exact.stripTrailingZeros().toPlainString());
        System.out.println("rule A (round each line): " + ruleA);
        System.out.println("rule B (round the total): " + ruleB);
        System.out.println("A - B: " + ruleA.subtract(ruleB));
        System.out.println("double: " + dbl);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'four lines at 8%', vi: 'bốn dòng thuế 8%' }, vao: '0.08\n12345\n6789\n1005\n2506\n' },
    { ten: { en: 'lines that each round up (x.5) at 10%', vi: 'các dòng đều làm tròn lên (x,5) ở 10%' }, vao: '0.10\n15\n25\n35\n45\n5\n', an: true },
    { ten: { en: 'big amounts at 5%', vi: 'số tiền lớn ở 5%' }, vao: '0.05\n123456789\n987654321\n11\n', an: true },
  ],
  goiY: [
    { en: 'new BigDecimal("0.08") is exactly 0.08; new BigDecimal(0.08) is 0.0800000000000000016653345369377348…', vi: 'new BigDecimal("0.08") đúng bằng 0.08; new BigDecimal(0.08) là 0.0800000000000000016653345369377348…' },
    { en: 'Round a line: amount.multiply(rate).setScale(0, RoundingMode.HALF_UP).', vi: 'Làm tròn một dòng: amount.multiply(rate).setScale(0, RoundingMode.HALF_UP).' },
  ],
  loiHayGap: [
    { en: 'Comparing BigDecimals with equals: 1812 and 1812.00 are not equals (different scale) — use compareTo for amounts.', vi: 'So BigDecimal bằng equals: 1812 và 1812.00 không equals (khác scale) — dùng compareTo cho số tiền.' },
    { en: 'Printing exact with toString(): it may switch to scientific notation (1.8116E+3) — use toPlainString().', vi: 'In exact bằng toString(): có thể ra dạng khoa học (1.8116E+3) — dùng toPlainString().' },
  ],
  giaiThich: { en: '<p>Rounding each line and rounding the total can differ by a few đồng on a long invoice — a business rule must say which one the law or the company uses. BigDecimal makes that choice explicit (scale + RoundingMode); double makes it invisible and adds binary noise.</p>', vi: '<p>Làm tròn từng dòng và làm tròn tổng có thể lệch vài đồng trên hoá đơn dài — luật nghiệp vụ phải nói rõ luật hay công ty dùng cách nào. BigDecimal buộc lựa chọn đó tường minh (scale + RoundingMode); double làm nó vô hình và thêm nhiễu nhị phân.</p>' },
});

const de4 = deJava({
  id: 'pro192-cs4-builder-phieu-muon',
  tieuDe: { en: 'A borrow slip: static factory plus a builder that reports every problem at once', vi: 'Phiếu mượn: static factory cộng builder báo mọi lỗi một lần' },
  doKho: 'HARD', phut: 35, java: 17,
  khaiNiem: ['immutable object with many optional fields', 'static factory for the common case', 'builder with fluent setters', 'build() collects all violations'],
  moTa: {
    en: `<p>Write an immutable ${c('Slip')} (student id, device, quantity, borrow date, due date, note) with:</p>
<ul><li>${c('Slip.oneWeek(studentId, device, date)')} — the common case: quantity 1, due 7 days later, note ${c('""')};</li>
<li>${c('Slip.builder(studentId, device)')} with ${c('quantity(int)')}, ${c('borrowed(LocalDate)')}, ${c('due(LocalDate)')}, ${c('note(String)')} returning the builder, and ${c('build()')} that checks <b>all</b> rules and throws one ${c('IllegalStateException')} listing every violation, separated by ${c('"; "')}, in this order: ${c('quantity must be 1..10')}, ${c('borrow date missing')}, ${c('due date missing')}, ${c('due date must be after the borrow date')}, ${c('loan longer than 30 days')} (the last two only when both dates exist).</li></ul>
<p>${c('toString')}: ${c('SE1001 borrows 2 x Arduino Uno 2026-11-02 -> 2026-11-09 (note: lab 3)')} — without the note part when the note is empty. The given ${c('Main')} reads one slip per line.</p>`,
    vi: `<p>Viết ${c('Slip')} bất biến (mã sinh viên, thiết bị, số lượng, ngày mượn, hạn trả, ghi chú) với:</p>
<ul><li>${c('Slip.oneWeek(studentId, device, date)')} — trường hợp hay gặp: số lượng 1, hạn trả 7 ngày sau, ghi chú ${c('""')};</li>
<li>${c('Slip.builder(studentId, device)')} với ${c('quantity(int)')}, ${c('borrowed(LocalDate)')}, ${c('due(LocalDate)')}, ${c('note(String)')} trả lại builder, và ${c('build()')} kiểm <b>mọi</b> luật rồi ném một ${c('IllegalStateException')} liệt kê mọi vi phạm, ngăn bằng ${c('"; "')}, theo đúng thứ tự trên (hai luật cuối chỉ xét khi có đủ hai ngày).</li></ul>
<p>${c('toString')} như mẫu — bỏ phần note khi ghi chú trống. ${c('Main')} cho sẵn đọc mỗi dòng một phiếu.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java.', 'Slip has a private constructor, private final fields, no setter.'], vi: ['Không sửa Main.java.', 'Slip có constructor private, trường private final, không setter.'] },
  dauVao: { en: 'Lines "week id;device;date" or "build id;device;key=value;…" (keys q, from, to, note).', vi: 'Các dòng "week id;device;date" hoặc "build id;device;key=value;…" (khoá q, from, to, note).' },
  dauRa: { en: 'The slip or "invalid: …" per line.', vi: 'Mỗi dòng in phiếu hoặc "invalid: …".' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'Slip has no public constructor', vi: 'Slip không có constructor public', re: String.raw`public\s+Slip\s*\(`, file: '^Slip\\.java$' }],
  tep: {
    'Main.java': j`
import java.time.LocalDate;
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) {
                continue;
            }
            String kind = line.substring(0, line.indexOf(' '));
            String[] p = line.substring(line.indexOf(' ') + 1).split(";");
            try {
                if (kind.equals("week")) {
                    System.out.println(Slip.oneWeek(p[0], p[1], LocalDate.parse(p[2])));
                    continue;
                }
                Slip.Builder b = Slip.builder(p[0], p[1]);
                for (int i = 2; i < p.length; i++) {
                    String[] kv = p[i].split("=", 2);
                    switch (kv[0]) {
                        case "q" -> b.quantity(Integer.parseInt(kv[1]));
                        case "from" -> b.borrowed(LocalDate.parse(kv[1]));
                        case "to" -> b.due(LocalDate.parse(kv[1]));
                        case "note" -> b.note(kv[1]);
                        default -> {
                        }
                    }
                }
                System.out.println(b.build());
            } catch (IllegalStateException e) {
                System.out.println("invalid: " + e.getMessage());
            }
        }
    }
}
`,
    'Slip.java': j`
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

public final class Slip {
    private final String studentId;
    private final String device;
    private final int quantity;
    private final LocalDate borrowed;
    private final LocalDate due;
    private final String note;

    private Slip(Builder b) {
        this.studentId = b.studentId;
        this.device = b.device;
        this.quantity = b.quantity;
        this.borrowed = b.borrowed;
        this.due = b.due;
        this.note = b.note;
    }

    public static Slip oneWeek(String studentId, String device, LocalDate date) {
        //>> return builder(studentId, device).build(); // TODO: 1 device, 7 days
        return builder(studentId, device).borrowed(date).due(date.plusDays(7)).build();
        //<<
    }

    public static Builder builder(String studentId, String device) {
        return new Builder(studentId, device);
    }

    @Override
    public String toString() {
        return studentId + " borrows " + quantity + " x " + device + " " + borrowed + " -> " + due + (note.isEmpty() ? "" : " (note: " + note + ")");
    }

    public static final class Builder {
        private final String studentId;
        private final String device;
        private int quantity = 1;
        private LocalDate borrowed;
        private LocalDate due;
        private String note = "";

        private Builder(String studentId, String device) {
            this.studentId = studentId;
            this.device = device;
        }

        public Builder quantity(int quantity) {
            this.quantity = quantity;
            return this;
        }

        public Builder borrowed(LocalDate date) {
            this.borrowed = date;
            return this;
        }

        public Builder due(LocalDate date) {
            this.due = date;
            return this;
        }

        public Builder note(String note) {
            this.note = note == null ? "" : note.trim();
            return this;
        }

        public Slip build() {
            //>> return new Slip(this); // TODO: collect EVERY violation, then throw one IllegalStateException
            List<String> errors = new ArrayList<>();
            if (quantity < 1 || quantity > 10) {
                errors.add("quantity must be 1..10");
            }
            if (borrowed == null) {
                errors.add("borrow date missing");
            }
            if (due == null) {
                errors.add("due date missing");
            }
            if (borrowed != null && due != null) {
                if (!due.isAfter(borrowed)) {
                    errors.add("due date must be after the borrow date");
                } else if (ChronoUnit.DAYS.between(borrowed, due) > 30) {
                    errors.add("loan longer than 30 days");
                }
            }
            if (!errors.isEmpty()) {
                throw new IllegalStateException(String.join("; ", errors));
            }
            return new Slip(this);
            //<<
        }
    }
}
`,
  },
  ca: [
    { ten: { en: 'a one-week slip, a full builder, several violations at once', vi: 'phiếu một tuần, builder đủ trường, nhiều vi phạm một lúc' }, vao: 'week SE1001;Arduino Uno;2026-11-02\nbuild SE1002;Raspberry Pi;q=2;from=2026-11-02;to=2026-11-20;note=lab 3\nbuild SE1003;Laptop;q=0;to=2026-11-05\nbuild SE1004;Multimeter;q=11;from=2026-11-10;to=2026-11-10\n' },
    { ten: { en: 'exactly 30 days, 31 days, nothing set, a month boundary', vi: 'đúng 30 ngày, 31 ngày, không đặt gì, qua tháng' }, vao: 'build A1;Scope;from=2026-01-01;to=2026-01-31\nbuild A2;Scope;from=2026-01-01;to=2026-02-01\nbuild A3;Kit\nweek A4;Breadboard;2026-12-28\nbuild A5;Kit;q=10;from=2026-03-05;to=2026-03-01;note=  late  \n', an: true },
  ],
  goiY: [
    { en: 'Collect messages in a List<String>, then throw new IllegalStateException(String.join("; ", errors)) once.', vi: 'Gom thông điệp vào List<String>, rồi ném new IllegalStateException(String.join("; ", errors)) một lần.' },
    { en: 'ChronoUnit.DAYS.between(borrowed, due) counts the days of the loan.', vi: 'ChronoUnit.DAYS.between(borrowed, due) đếm số ngày mượn.' },
  ],
  loiHayGap: [
    { en: 'Throwing at the first problem — the person filling the form fixes one error, submits, and gets the next.', vi: 'Ném ở lỗi đầu tiên — người điền form sửa một lỗi, gửi lại, rồi nhận lỗi kế tiếp.' },
    { en: 'Checking "due after borrow" when a date is null — NullPointerException instead of a message.', vi: 'Kiểm "hạn trả sau ngày mượn" khi một ngày null — NullPointerException thay vì thông điệp.' },
  ],
  giaiThich: { en: '<p>A static factory names the common case; a builder handles the many optional fields without telescoping constructors; validation happens once, in build(), on the complete state — and the object that comes out is immutable and always valid.</p>', vi: '<p>Static factory đặt tên cho trường hợp hay gặp; builder lo nhiều trường tuỳ chọn mà không cần chuỗi constructor; kiểm dữ liệu diễn ra một lần, trong build(), trên trạng thái đầy đủ — và đối tượng tạo ra bất biến, luôn hợp lệ.</p>' },
});

export default moDun({ slug: 'pro192-cs4-on', ten: '11.4 ⭐ CS.4 Object contracts: equals/hashCode, immutability, BigDecimal, builders', de: [de1, de2, de3, de4] });
