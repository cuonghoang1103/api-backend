/** PRO192 · ⭐ CS.6 — Code dễ kiểm thử: kế thừa phá vỡ ⇒ bọc (composition), tiêm phụ thuộc (Clock, kho, nơi ghi), ngoại lệ có mã + dòng + nguyên nhân, bảng giá trị biên. Ý đề: gen/src/extra/cs6-on.txt + gen/java/cs6/Bt*.java. */
import { moDun, deJava, c, j } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-cs6-boc-thay-ke-thua',
  tieuDe: { en: 'A counting collection: inheritance breaks, a wrapper works for any Collection', vi: 'Collection biết đếm: kế thừa thì vỡ, lớp bọc chạy với mọi Collection' },
  doKho: 'MEDIUM', phut: 25, java: 17,
  khaiNiem: ['fragile base class: HashSet.addAll calls add', 'composition + forwarding', 'AbstractCollection: implement iterator() and size()', 'program to the interface'],
  moTa: {
    en: `<p>We want to know how many elements were <b>offered</b> to a collection (every ${c('add')} call, accepted or not). The first draft ${c('CountingCollection<E> extends HashSet<E>')} overrides ${c('add')} (count + 1) and ${c('addAll')} (count + size) — and counts 6 after adding 3 items, because ${c('HashSet.addAll')} calls ${c('add')} for each element. It also ignores the collection it is given: it is always a set.</p>
<p>Rewrite ${c('CountingCollection<E>')} as a <b>wrapper</b>: the constructor receives any ${c('Collection<E>')} that really stores the elements; extend ${c('AbstractCollection<E>')}, forward ${c('iterator()')} and ${c('size()')}, and override only ${c('add')}. ${c('addCount()')} returns the number of elements offered. The given ${c('Main')} wraps an ${c('ArrayList')} and a ${c('HashSet')}, feeds both the same items and prints both counts and sizes.</p>`,
    vi: `<p>Ta muốn biết bao nhiêu phần tử đã được <b>đưa vào</b> một collection (mọi lời gọi ${c('add')}, được nhận hay không). Bản nháp đầu ${c('CountingCollection<E> extends HashSet<E>')} ghi đè ${c('add')} (đếm + 1) và ${c('addAll')} (đếm + size) — và đếm ra 6 sau khi thêm 3 phần tử, vì ${c('HashSet.addAll')} gọi ${c('add')} cho từng phần tử. Nó còn bỏ qua collection được đưa: lúc nào cũng là set.</p>
<p>Viết lại ${c('CountingCollection<E>')} thành <b>lớp bọc</b>: constructor nhận một ${c('Collection<E>')} bất kỳ để thật sự giữ phần tử; extends ${c('AbstractCollection<E>')}, chuyển tiếp ${c('iterator()')} và ${c('size()')}, chỉ ghi đè ${c('add')}. ${c('addCount()')} trả số phần tử đã đưa vào. ${c('Main')} cho sẵn bọc một ${c('ArrayList')} và một ${c('HashSet')}, đưa cùng các phần tử vào cả hai rồi in số đếm và kích thước.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java.', 'CountingCollection must not extend a concrete collection (HashSet, ArrayList…).'], vi: ['Không sửa Main.java.', 'CountingCollection không được extends một collection cụ thể (HashSet, ArrayList…).'] },
  dauVao: { en: 'Line 1: items for addAll. Following lines: single items for add.', vi: 'Dòng 1: các phần tử cho addAll. Các dòng sau: từng phần tử cho add.' },
  dauRa: { en: 'Counts and sizes of the list wrapper and of the set wrapper.', vi: 'Số đếm và kích thước của lớp bọc list và lớp bọc set.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'no inheritance from a concrete collection', vi: 'không kế thừa collection cụ thể', re: String.raw`extends\s+(HashSet|ArrayList|LinkedList|TreeSet|LinkedHashSet|Vector)\b`, file: '^CountingCollection\\.java$' }],
  tep: {
    'Main.java': j`
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<String> batch = Arrays.asList(sc.nextLine().trim().split("\\s+"));
        CountingCollection<String> list = new CountingCollection<>(new ArrayList<>());
        CountingCollection<String> set = new CountingCollection<>(new HashSet<>());
        list.addAll(batch);
        set.addAll(batch);
        System.out.println("after addAll " + batch + ": list counted " + list.addCount() + ", set counted " + set.addCount());
        while (sc.hasNextLine()) {
            String item = sc.nextLine().trim();
            if (!item.isEmpty()) {
                list.add(item);
                set.add(item);
            }
        }
        System.out.println("list: counted " + list.addCount() + ", size " + list.size() + ", " + list);
        System.out.println("set:  counted " + set.addCount() + ", size " + set.size() + ", contains " + batch.get(0) + " " + set.contains(batch.get(0)));
    }
}
`,
    'CountingCollection.java': j`
import java.util.AbstractCollection;
import java.util.Collection;
import java.util.HashSet;
import java.util.Iterator;

//>> public class CountingCollection<E> extends HashSet<E> { // TODO: a wrapper around any Collection ⏎     private int addCount; ⏎  ⏎     public CountingCollection(Collection<E> store) { ⏎     } ⏎  ⏎     @Override ⏎     public boolean add(E e) { ⏎         addCount++; ⏎         return super.add(e); ⏎     } ⏎  ⏎     @Override ⏎     public boolean addAll(Collection<? extends E> c) { ⏎         addCount += c.size(); ⏎         return super.addAll(c); ⏎     } ⏎  ⏎     public int addCount() { ⏎         return addCount; ⏎     } ⏎ }
public class CountingCollection<E> extends AbstractCollection<E> {
    private final Collection<E> store;
    private int addCount;

    public CountingCollection(Collection<E> store) {
        this.store = store;
    }

    @Override
    public boolean add(E e) {
        addCount++;
        return store.add(e);
    }

    @Override
    public Iterator<E> iterator() {
        return store.iterator();
    }

    @Override
    public int size() {
        return store.size();
    }

    public int addCount() {
        return addCount;
    }
}
//<<
`,
  },
  ca: [
    { ten: { en: 'three devices, then a duplicate and a new one', vi: 'ba thiết bị, rồi một bản trùng và một cái mới' }, vao: 'scope pi meter\npi\nlaptop\n' },
    { ten: { en: 'duplicates inside the batch', vi: 'trùng ngay trong lô' }, vao: 'a b a c a\nb\nb\n', an: true },
  ],
  goiY: [
    { en: 'AbstractCollection.addAll is written as "for each element: add(e)" — so counting in add() alone is right for every store.', vi: 'AbstractCollection.addAll viết là "với mỗi phần tử: add(e)" — nên chỉ đếm trong add() là đúng với mọi nơi chứa.' },
    { en: 'AbstractCollection also gives contains, toString, isEmpty… from iterator() and size().', vi: 'AbstractCollection cho sẵn contains, toString, isEmpty… từ iterator() và size().' },
  ],
  loiHayGap: [
    { en: 'Forwarding addAll to store.addAll AND counting in add — then nothing is counted for addAll on a store that does not call add.', vi: 'Chuyển tiếp addAll sang store.addAll VÀ đếm trong add — khi đó addAll không được đếm với nơi chứa không gọi add.' },
    { en: 'Fixing the subclass by removing addAll’s override — it then depends on HashSet’s private implementation, which may change in the next JDK.', vi: 'Sửa lớp con bằng cách bỏ ghi đè addAll — khi đó nó dựa vào cách cài đặt riêng của HashSet, có thể đổi ở JDK sau.' },
  ],
  giaiThich: { en: '<p>Inheritance couples you to how the parent implements its methods (Effective Java item 18). A forwarding wrapper only depends on the Collection interface, works for any implementation, and counts correctly whatever addAll does internally.</p>', vi: '<p>Kế thừa buộc bạn vào cách lớp cha cài đặt các hàm (Effective Java mục 18). Lớp bọc chuyển tiếp chỉ phụ thuộc interface Collection, chạy với mọi cài đặt, và đếm đúng dù addAll làm gì bên trong.</p>' },
});

const de2 = deJava({
  id: 'pro192-cs6-tiem-phu-thuoc',
  tieuDe: { en: 'An overdue report that read the clock by itself: inject Clock, repository and sink', vi: 'Báo cáo quá hạn tự đọc đồng hồ: tiêm Clock, kho và nơi ghi' },
  doKho: 'MEDIUM', phut: 30, java: 17,
  khaiNiem: ['constructor injection', 'java.time.Clock and LocalDate.now(clock)', 'interfaces as seams (LoanRepository, ReportSink)', 'a test double that remembers what was written'],
  moTa: {
    en: `<p>${c('OverdueReport')} used to call ${c('LocalDate.now()')} and ${c('System.out')} itself — impossible to test on a fixed day. It now receives three dependencies in its constructor: a ${c('LoanRepository')} (where the loans come from), a ${c('ReportSink')} (where the lines go) and a ${c('Clock')}. Write ${c('run()')}: today = ${c('LocalDate.now(clock)')}; write the header ${c('overdue on 2026-10-15')}, then one line per loan whose due date is <b>before</b> today, in the repository’s order: ${c('M007 Clean Code: 5 day(s) late, fine 10000')} (2000 per day), then ${c('total fine 10000')}; return the number of overdue loans. The given ${c('Main')} injects a fixed clock and a sink that remembers the lines, runs the report for several dates and prints what the sink received.</p>`,
    vi: `<p>${c('OverdueReport')} từng tự gọi ${c('LocalDate.now()')} và ${c('System.out')} — không thể kiểm vào một ngày cố định. Nay nó nhận ba phụ thuộc qua constructor: ${c('LoanRepository')} (phiếu mượn lấy từ đâu), ${c('ReportSink')} (dòng báo cáo đi đâu) và ${c('Clock')}. Viết ${c('run()')}: hôm nay = ${c('LocalDate.now(clock)')}; ghi tiêu đề ${c('overdue on 2026-10-15')}, rồi mỗi phiếu có hạn trả <b>trước</b> hôm nay một dòng, theo thứ tự của kho: ${c('M007 Clean Code: 5 day(s) late, fine 10000')} (2000 mỗi ngày), rồi ${c('total fine 10000')}; trả về số phiếu quá hạn. ${c('Main')} cho sẵn tiêm đồng hồ cố định và một nơi ghi nhớ lại các dòng, chạy báo cáo cho vài ngày rồi in những gì nơi ghi nhận được.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java, Loan.java, LoanRepository.java, ReportSink.java.', 'OverdueReport never calls LocalDate.now() without the clock, nor System.out.'], vi: ['Không sửa Main.java, Loan.java, LoanRepository.java, ReportSink.java.', 'OverdueReport không gọi LocalDate.now() không có clock, không dùng System.out.'] },
  dauVao: { en: 'Line 1: the dates to run the report on. Then loans member;title;dueDate.', vi: 'Dòng 1: các ngày chạy báo cáo. Rồi các phiếu member;title;dueDate.' },
  dauRa: { en: 'For each date: the lines the sink received and the returned count.', vi: 'Với mỗi ngày: các dòng nơi ghi nhận được và số trả về.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'no hidden dependency: no System.out and no LocalDate.now() without the clock in OverdueReport', vi: 'không phụ thuộc ẩn: OverdueReport không System.out và không LocalDate.now() thiếu clock', re: String.raw`System\s*\.\s*out|now\s*\(\s*\)`, file: '^OverdueReport\\.java$' }],
  tep: {
    'Loan.java': j`
import java.time.LocalDate;

// GIVEN — do not change.
public record Loan(String member, String title, LocalDate due) {
}
`,
    'LoanRepository.java': j`
import java.util.List;

// GIVEN — do not change.
public interface LoanRepository {
    List<Loan> openLoans();
}
`,
    'ReportSink.java': j`
// GIVEN — do not change.
public interface ReportSink {
    void write(String line);
}
`,
    'Main.java': j`
import java.time.Clock;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] days = sc.nextLine().trim().split("\\s+");
        List<Loan> loans = new ArrayList<>();
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().split(";");
            if (p.length == 3) {
                loans.add(new Loan(p[0].trim(), p[1].trim(), LocalDate.parse(p[2].trim())));
            }
        }
        LoanRepository repo = () -> loans;
        for (String d : days) {
            Clock fixed = Clock.fixed(LocalDate.parse(d).atStartOfDay().toInstant(ZoneOffset.UTC), ZoneOffset.UTC);
            List<String> received = new ArrayList<>();
            int n = new OverdueReport(repo, received::add, fixed).run();
            received.forEach(l -> System.out.println("  | " + l));
            System.out.println("  returned " + n);
        }
    }
}
`,
    'OverdueReport.java': j`
import java.time.Clock;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class OverdueReport {
    static final long FINE_PER_DAY = 2000;

    private final LoanRepository repository;
    private final ReportSink sink;
    private final Clock clock;

    public OverdueReport(LoanRepository repository, ReportSink sink, Clock clock) {
        this.repository = repository;
        this.sink = sink;
        this.clock = clock;
    }

    public int run() {
        //>> LocalDate today = LocalDate.now(); // TODO: use the injected clock, repository and sink ⏎ System.out.println("overdue on " + today); ⏎ return 0;
        LocalDate today = LocalDate.now(clock);
        sink.write("overdue on " + today);
        int count = 0;
        long total = 0;
        for (Loan l : repository.openLoans()) {
            if (l.due().isBefore(today)) {
                long late = ChronoUnit.DAYS.between(l.due(), today);
                long fine = late * FINE_PER_DAY;
                sink.write(l.member() + " " + l.title() + ": " + late + " day(s) late, fine " + fine);
                count++;
                total += fine;
            }
        }
        sink.write("total fine " + total);
        return count;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'three loans on two dates', vi: 'ba phiếu ở hai ngày' }, vao: '2026-10-15 2026-10-21\nM007;Clean Code;2026-10-10\nM012;Refactoring;2026-10-15\nM003;Head First Java;2026-10-18\n' },
    { ten: { en: 'a leap day, a year boundary, no loan overdue', vi: 'ngày nhuận, qua năm, không phiếu nào quá hạn' }, vao: '2024-03-01 2027-01-02 2020-01-01\nA1;Book A;2024-02-28\nA2;Book B;2026-12-31\n', an: true },
  ],
  goiY: [
    { en: 'LocalDate.now(clock) — with Clock.fixed the "today" of the report is whatever the test says.', vi: 'LocalDate.now(clock) — với Clock.fixed, "hôm nay" của báo cáo là ngày mà bài kiểm muốn.' },
    { en: 'A loan due today is not late; ChronoUnit.DAYS.between(due, today) counts the late days.', vi: 'Phiếu đến hạn đúng hôm nay chưa trễ; ChronoUnit.DAYS.between(due, today) đếm số ngày trễ.' },
  ],
  loiHayGap: [
    { en: 'Keeping a default constructor that creates a real database repository "for convenience" — the hidden dependency comes back.', vi: 'Giữ thêm constructor mặc định tự tạo kho cơ sở dữ liệu thật "cho tiện" — phụ thuộc ẩn quay lại.' },
    { en: 'Counting with isAfter(today) reversed — loans due tomorrow get a negative fine.', vi: 'Đảo ngược isAfter(today) — phiếu hạn ngày mai bị phạt âm.' },
  ],
  giaiThich: { en: '<p>Everything the report depends on — time, data, output — now comes through its constructor. Production wires Clock.systemDefaultZone(), a database repository and a file sink; a test wires a fixed clock, a list and a list::add sink. Same class, no change.</p>', vi: '<p>Mọi thứ báo cáo phụ thuộc — thời gian, dữ liệu, đầu ra — nay đi qua constructor. Bản chạy thật nối Clock.systemDefaultZone(), kho cơ sở dữ liệu và nơi ghi tệp; bài kiểm nối đồng hồ cố định, một list và nơi ghi list::add. Cùng một lớp, không sửa gì.</p>' },
});

const de3 = deJava({
  id: 'pro192-cs6-ngoai-le-co-ma',
  tieuDe: { en: 'Importing devices from CSV: one exception type with a code, a line number and the cause', vi: 'Nhập thiết bị từ CSV: một loại ngoại lệ có mã, số dòng và nguyên nhân' },
  doKho: 'MEDIUM', phut: 30, java: 17,
  khaiNiem: ['a domain exception with an error-code enum', 'exception chaining (cause)', 'translate low-level exceptions at the boundary', 'continue after a bad row'],
  moTa: {
    en: `<p>Each CSV row is ${c('code,name,quantity,price')}. ${c('Importer.parse(lineNo, row, seen)')} returns a ${c('Device')} or throws an ${c('ImportException')} carrying an ${c('ImportError')} code, the line number and — when a lower-level exception caused it — that exception as the <b>cause</b>:</p>
<ul><li>${c('IMP_01')} missing field: not exactly 4 fields, or a blank one;</li>
<li>${c('IMP_02')} bad number: quantity or price is not a number (cause: the ${c('NumberFormatException')});</li>
<li>${c('IMP_03')} duplicate code: the code (case-insensitive) was already imported (${c('seen')} holds the upper-cased codes);</li>
<li>${c('IMP_04')} non-positive price (or a negative quantity).</li></ul>
<p>The given ${c('Main')} prints ${c('line 3: IMP_02 bad number "1O" (cause: NumberFormatException)')} for each bad row and then the imported devices. ${c('ImportError')} and ${c('ImportException')} are given; write ${c('parse')}.</p>`,
    vi: `<p>Mỗi dòng CSV là ${c('code,name,quantity,price')}. ${c('Importer.parse(lineNo, row, seen)')} trả về một ${c('Device')} hoặc ném ${c('ImportException')} mang mã ${c('ImportError')}, số dòng và — khi do một ngoại lệ tầng dưới gây ra — ngoại lệ đó làm <b>cause</b>: ${c('IMP_01')} thiếu trường (không đúng 4 trường hoặc có trường trống); ${c('IMP_02')} số sai (số lượng hoặc giá không phải số, cause là ${c('NumberFormatException')}); ${c('IMP_03')} trùng mã (không phân biệt hoa thường, ${c('seen')} giữ các mã đã viết hoa); ${c('IMP_04')} giá không dương (hoặc số lượng âm). ${c('Main')} cho sẵn in mỗi dòng sai một dòng như mẫu rồi in các thiết bị đã nhập. ${c('ImportError')} và ${c('ImportException')} cho sẵn; bạn viết ${c('parse')}.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java, ImportError.java, ImportException.java, Device.java.', 'The NumberFormatException is passed as the cause, not swallowed.'], vi: ['Không sửa Main.java, ImportError.java, ImportException.java, Device.java.', 'NumberFormatException được truyền làm cause, không bị nuốt.'] },
  dauVao: { en: 'CSV rows.', vi: 'Các dòng CSV.' },
  dauRa: { en: 'Error lines, then the imported devices.', vi: 'Các dòng lỗi, rồi các thiết bị đã nhập.' },
  main: 'Main',
  tep: {
    'ImportError.java': j`
// GIVEN — do not change.
public enum ImportError {
    IMP_01("missing field"), IMP_02("bad number"), IMP_03("duplicate code"), IMP_04("non-positive value");

    private final String text;

    ImportError(String text) {
        this.text = text;
    }

    public String text() {
        return text;
    }
}
`,
    'ImportException.java': j`
// GIVEN — do not change.
public class ImportException extends Exception {
    private final ImportError error;
    private final int line;

    public ImportException(ImportError error, int line, String detail, Throwable cause) {
        super("line " + line + ": " + error + " " + error.text() + (detail.isEmpty() ? "" : " " + detail), cause);
        this.error = error;
        this.line = line;
    }

    public ImportError error() {
        return error;
    }

    public int line() {
        return line;
    }
}
`,
    'Device.java': j`
// GIVEN — do not change.
public record Device(String code, String name, int quantity, long price) {
}
`,
    'Main.java': j`
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Scanner;
import java.util.Set;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Device> ok = new ArrayList<>();
        Set<String> seen = new HashSet<>();
        int lineNo = 0;
        while (sc.hasNextLine()) {
            String row = sc.nextLine();
            lineNo++;
            try {
                ok.add(Importer.parse(lineNo, row, seen));
            } catch (ImportException e) {
                System.out.println(e.getMessage() + (e.getCause() == null ? "" : " (cause: " + e.getCause().getClass().getSimpleName() + ")"));
            }
        }
        System.out.println("imported " + ok.size() + ": " + ok);
    }
}
`,
    'Importer.java': j`
import java.util.Set;

public class Importer {
    public static Device parse(int lineNo, String row, Set<String> seen) throws ImportException {
        String[] f = row.split(",", -1);
        //>> // TODO: IMP_01..IMP_04 with the line number; NumberFormatException as the cause ⏎ try { ⏎     return new Device(f[0].trim(), f[1].trim(), Integer.parseInt(f[2].trim()), Long.parseLong(f[3].trim())); ⏎ } catch (RuntimeException e) { ⏎     throw new ImportException(ImportError.IMP_01, lineNo, "", null); ⏎ }
        if (f.length != 4) {
            throw new ImportException(ImportError.IMP_01, lineNo, "(" + f.length + " fields)", null);
        }
        for (String x : f) {
            if (x.trim().isEmpty()) {
                throw new ImportException(ImportError.IMP_01, lineNo, "", null);
            }
        }
        String code = f[0].trim();
        int quantity;
        long price;
        String current = f[2].trim();
        try {
            quantity = Integer.parseInt(current);
            current = f[3].trim();
            price = Long.parseLong(current);
        } catch (NumberFormatException e) {
            throw new ImportException(ImportError.IMP_02, lineNo, "\"" + current + "\"", e);
        }
        if (price <= 0 || quantity < 0) {
            throw new ImportException(ImportError.IMP_04, lineNo, "", null);
        }
        if (!seen.add(code.toUpperCase())) {
            throw new ImportException(ImportError.IMP_03, lineNo, code, null);
        }
        return new Device(code, f[1].trim(), quantity, price);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'six rows, four of them bad', vi: 'sáu dòng, bốn dòng sai' }, vao: 'D01,Oscilloscope,3,9500000\nD02,Raspberry Pi,10,1800000\nD03,Multimeter,1O,350000\nd01,Oscilloscope copy,1,9500000\nD04,Breadboard,20\nD05,Laptop,2,0\n' },
    { ten: { en: 'blank fields, negative quantity, a bad price, an empty line', vi: 'trường trống, số lượng âm, giá sai, dòng trống' }, vao: 'X1, ,1,100\nX2,Kit,-1,100\nX3,Kit,1,12.5\n\nX4,Kit,0,1\nx4,Dup,1,1\n', an: true },
  ],
  goiY: [
    { en: 'throw new ImportException(ImportError.IMP_02, lineNo, "\\"" + text + "\\"", e) — the 4th argument keeps the original exception as the cause.', vi: 'throw new ImportException(ImportError.IMP_02, lineNo, "\\"" + text + "\\"", e) — tham số thứ 4 giữ ngoại lệ gốc làm cause.' },
    { en: 'Check the duplicate LAST, so that a bad row does not reserve its code; seen.add returns false when the code is already there.', vi: 'Kiểm trùng CUỐI CÙNG để dòng sai không chiếm mã; seen.add trả false khi mã đã có.' },
  ],
  loiHayGap: [
    { en: 'catch (Exception e) { throw new ImportException(…, null); } — the stack trace of the real problem is lost.', vi: 'catch (Exception e) { throw new ImportException(…, null); } — mất dấu vết stack của lỗi thật.' },
    { en: 'split(",") without -1 — trailing empty fields disappear and "D04,Breadboard,20," looks like 3 fields.', vi: 'split(",") không có -1 — các trường trống cuối biến mất và "D04,Breadboard,20," trông như 3 trường.' },
  ],
  giaiThich: { en: '<p>One checked exception type with an error code keeps the caller simple (one catch) while each failure stays precise and machine-readable. Chaining the low-level cause keeps the evidence for whoever debugs it later.</p>', vi: '<p>Một loại ngoại lệ checked có mã lỗi giữ nơi gọi đơn giản (một catch) mà mỗi lỗi vẫn chính xác và máy đọc được. Nối nguyên nhân tầng dưới giữ lại bằng chứng cho người gỡ lỗi sau này.</p>' },
});

const de4 = deJava({
  id: 'pro192-cs6-bang-gia-tri-bien',
  tieuDe: { en: 'No JUnit in the exam room: a late fee checked on its boundaries', vi: 'Phòng thi không có JUnit: phí trễ hạn kiểm ở các giá trị biên' },
  doKho: 'EASY', phut: 20, java: 8,
  khaiNiem: ['boundary values: 0, 1, the cap, cap ± 1', 'IllegalArgumentException for an invalid argument', 'a tiny check(name, expected, actual) helper', 'Math.min for a cap'],
  moTa: {
    en: `<p>${c('Fee.lateFee(days, member)')}: 5000 per day for guests, 3000 per day for members, capped at 50000; negative days ⇒ ${c('IllegalArgumentException("days must be >= 0")')}. The first draft gives a "grace day" nobody asked for (${c('days - 1')}) and caps at the wrong place. In ${c('Fee.main')}, the ${c('check(name, expected, actual)')} helper prints ${c('PASS')} or ${c('FAIL')}: add the boundary table (0 and 1 day; guests: 10 days = exactly the cap, 11 days; members: 16 days = 48000, 17 days = the cap; −1 day is rejected) and fix ${c('lateFee')} until every line says PASS. The grader also asks ${c('lateFee')} for its own hidden list (the ${c('Main')} class).</p>`,
    vi: `<p>${c('Fee.lateFee(days, member)')}: khách 5000 mỗi ngày, thành viên 3000 mỗi ngày, trần 50000; số ngày âm ⇒ ${c('IllegalArgumentException("days must be >= 0")')}. Bản nháp đầu cho "một ngày ân hạn" không ai yêu cầu (${c('days - 1')}) và đặt trần sai chỗ. Trong ${c('Fee.main')}, hàm ${c('check(name, expected, actual)')} in ${c('PASS')} hoặc ${c('FAIL')}: thêm bảng giá trị biên (0 và 1 ngày; khách: 10 ngày = đúng trần, 11 ngày; thành viên: 16 ngày = 48000, 17 ngày = trần; −1 ngày bị từ chối) rồi sửa ${c('lateFee')} tới khi mọi dòng là PASS. Máy chấm còn hỏi ${c('lateFee')} theo danh sách ẩn của nó (lớp ${c('Main')}).</p>`,
  },
  yeuCau: { en: ['Java 8 only (the exam room).', 'Do not change Main.java.'], vi: ['Chỉ Java 8 (phòng thi).', 'Không sửa Main.java.'] },
  dauVao: { en: 'Lines "guest N" / "member N".', vi: 'Các dòng "guest N" / "member N".' },
  dauRa: { en: 'The fee or the error, one line each.', vi: 'Phí hoặc lỗi, mỗi dòng một kết quả.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'Fee.main has a boundary table of at least 7 check(...) calls', vi: 'Fee.main có bảng biên ít nhất 7 lời gọi check(...)', re: String.raw`(\bcheck\s*\([^;]*;[\s\S]*){7}`, file: '^Fee\\.java$', need: true }],
  tep: {
    'Main.java': j`
import java.util.Scanner;

// GIVEN — do not change. The grader's own list of questions.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split("\\s+");
            if (p.length < 2) {
                continue;
            }
            try {
                System.out.println(p[0] + " " + p[1] + " day(s): " + Fee.lateFee(Integer.parseInt(p[1]), p[0].equals("member")));
            } catch (IllegalArgumentException e) {
                System.out.println(p[0] + " " + p[1] + " day(s): rejected (" + e.getMessage() + ")");
            }
        }
    }
}
`,
    'Fee.java': j`
public class Fee {
    static final long GUEST_PER_DAY = 5000;
    static final long MEMBER_PER_DAY = 3000;
    static final long CAP = 50000;

    public static long lateFee(int days, boolean member) {
        //>> long fee = (days - 1) * (member ? MEMBER_PER_DAY : GUEST_PER_DAY); // first draft: a "grace day", no check ⏎ return fee > CAP + 1 ? CAP : fee;
        if (days < 0) {
            throw new IllegalArgumentException("days must be >= 0");
        }
        return Math.min(CAP, days * (member ? MEMBER_PER_DAY : GUEST_PER_DAY));
        //<<
    }

    static void check(String name, long expected, long actual) {
        System.out.println((expected == actual ? "PASS " : "FAIL ") + name + ": expected " + expected + ", got " + actual);
    }

    public static void main(String[] args) {
        //>> check("guest 1 day", 5000, lateFee(1, false)); // TODO: the whole boundary table
        check("guest 0 days", 0, lateFee(0, false));
        check("guest 1 day", 5000, lateFee(1, false));
        check("guest 10 days = cap", 50000, lateFee(10, false));
        check("guest 11 days", 50000, lateFee(11, false));
        check("member 1 day", 3000, lateFee(1, true));
        check("member 16 days", 48000, lateFee(16, true));
        check("member 17 days = cap", 50000, lateFee(17, true));
        try {
            lateFee(-1, false);
            check("-1 day rejected", 1, 0);
        } catch (IllegalArgumentException e) {
            check("-1 day rejected", 1, 1);
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the boundary table', vi: 'bảng giá trị biên' }, vao: 'guest 0\nguest 1\nguest 10\nguest 11\nmember 16\nmember 17\nguest -1\n' },
    { ten: { en: 'other boundaries', vi: 'các biên khác' }, vao: 'member 0\nmember 1\nguest 9\nmember 100\nmember -5\nguest 2147483\n', an: true },
  ],
  goiY: [
    { en: 'The boundaries of a cap are cap − 1 step, exactly the cap, cap + 1 step; of a range: just inside and just outside.', vi: 'Biên của một trần là trần − 1 bước, đúng trần, trần + 1 bước; của một khoảng: vừa trong và vừa ngoài.' },
    { en: 'Math.min(CAP, days * rate) — compute in long so a huge number of days does not overflow.', vi: 'Math.min(CAP, days * rate) — tính bằng long để số ngày rất lớn không tràn.' },
  ],
  loiHayGap: [
    { en: 'Testing only "typical" values (3 days, 5 days) — the grace day and the wrong cap both pass them.', vi: 'Chỉ thử giá trị "điển hình" (3 ngày, 5 ngày) — ngày ân hạn và trần sai đều qua được.' },
    { en: 'days * rate in int — 2147483 days × 5000 overflows before the cap is applied.', vi: 'days * rate bằng int — 2147483 ngày × 5000 tràn số trước khi áp trần.' },
  ],
  giaiThich: { en: '<p>Bugs live on the edges: the first day, the day the cap starts, the first invalid value. A seven-line boundary table in main() is the exam-room version of a parameterised JUnit test, and it caught both bugs of the first draft.</p>', vi: '<p>Lỗi sống ở mép: ngày đầu, ngày trần bắt đầu, giá trị sai đầu tiên. Bảng biên bảy dòng trong main() là phiên bản phòng thi của một bài kiểm JUnit có tham số, và nó bắt được cả hai lỗi của bản nháp.</p>' },
});

export default moDun({ slug: 'pro192-cs6-on', ten: '11.6 ⭐ CS.6 Testable code: composition, injection, exceptions, boundaries', de: [de1, de2, de3, de4] });
