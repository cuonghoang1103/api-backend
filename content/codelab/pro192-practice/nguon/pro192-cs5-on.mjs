/** PRO192 · ⭐ CS.5 — JVM nhìn từ code: rò bộ nhớ vì hashCode đổi theo trạng thái, đệ quy sâu ⇒ StackOverflowError, bộ nhớ đệm Integer -128..127, thứ tự khởi tạo static. Ý đề: gen/src/extra/cs5-on.txt (Bt2KhoiTao, Bt3SanRoRi, Bt4PhanLoaiLoi) + gen/java/cs5. */
import { moDun, deJava, c, j } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-cs5-ro-ri-hashset',
  tieuDe: { en: 'A leak: tickets that can never leave a HashSet', vi: 'Rò bộ nhớ: phiếu hỗ trợ không bao giờ ra khỏi HashSet' },
  doKho: 'MEDIUM', phut: 25, java: 17,
  khaiNiem: ['hashCode of a key must not change while it is in a hash collection', 'remove() looks in the bucket of the CURRENT hashCode', 'identity = immutable id', 'a "leak" in Java = objects still reachable'],
  moTa: {
    en: `<p>A help desk keeps the open tickets in a static ${c('Set<Ticket>')}. Every day it opens N tickets, then closes each one (${c('ticket.close()')} sets the status to ${c('CLOSED')}) and removes it from the set. ${c('Ticket.equals/hashCode')} use the id <b>and the status</b>. The given ${c('Main')} prints, after every day, how many tickets the set still holds and how many removals failed — and the number keeps growing: memory leaks although everything was "removed". Fix the <b>class</b>, not the loop: a ticket’s identity is its id.</p>`,
    vi: `<p>Bàn hỗ trợ giữ các phiếu đang mở trong một ${c('Set<Ticket>')} static. Mỗi ngày nó mở N phiếu, rồi đóng từng phiếu (${c('ticket.close()')} đặt trạng thái ${c('CLOSED')}) và xoá khỏi set. ${c('Ticket.equals/hashCode')} dùng id <b>và trạng thái</b>. ${c('Main')} cho sẵn in, sau mỗi ngày, set còn giữ bao nhiêu phiếu và bao nhiêu lần xoá thất bại — con số cứ tăng: bộ nhớ rò dù mọi thứ đã được "xoá". Sửa <b>lớp</b>, không sửa vòng lặp: danh tính của phiếu là id của nó.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java.', 'Keep close() — the status must still change.'], vi: ['Không sửa Main.java.', 'Giữ close() — trạng thái vẫn phải đổi.'] },
  dauVao: { en: 'Two numbers: days and tickets per day.', vi: 'Hai số: số ngày và số phiếu mỗi ngày.' },
  dauRa: { en: 'One line per day, then a summary.', vi: 'Mỗi ngày một dòng, rồi dòng tổng kết.' },
  main: 'Main',
  tep: {
    'Main.java': j`
import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

// GIVEN — do not change.
public class Main {
    static final Set<Ticket> OPEN = new HashSet<>();

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int days = sc.nextInt();
        int perDay = sc.nextInt();
        int nextId = 1;
        for (int d = 1; d <= days; d++) {
            Ticket[] today = new Ticket[perDay];
            for (int i = 0; i < perDay; i++) {
                today[i] = new Ticket(nextId++, "printer " + (i % 7));
                OPEN.add(today[i]);
            }
            int failed = 0;
            for (Ticket t : today) {
                t.close();
                if (!OPEN.remove(t)) {
                    failed++;
                }
            }
            System.out.println("day " + d + ": still in the set " + OPEN.size() + ", failed removals " + failed);
        }
        System.out.println(OPEN.isEmpty() ? "no leak" : "LEAK: " + OPEN.size() + " closed tickets are still reachable");
    }
}
`,
    'Ticket.java': j`
import java.util.Objects;

public class Ticket {
    private final int id;
    private final String subject;
    private String status = "OPEN";

    public Ticket(int id, String subject) {
        this.id = id;
        this.subject = subject;
    }

    public void close() {
        status = "CLOSED";
    }

    public String status() {
        return status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ticket)) {
            return false;
        }
        Ticket t = (Ticket) o;
        //>> return id == t.id && status.equals(t.status); // TODO: identity = the id only
        return id == t.id;
        //<<
    }

    @Override
    public int hashCode() {
        //>> return Objects.hash(id, status); // TODO
        return Objects.hash(id);
        //<<
    }

    @Override
    public String toString() {
        return "#" + id + " " + subject + " " + status;
    }
}
`,
  },
  ca: [
    { ten: { en: '3 days × 1000 tickets', vi: '3 ngày × 1000 phiếu' }, vao: '3 1000\n' },
    { ten: { en: '5 days × 7 tickets', vi: '5 ngày × 7 phiếu' }, vao: '5 7\n', an: true },
    { ten: { en: '1 day × 1 ticket', vi: '1 ngày × 1 phiếu' }, vao: '1 1\n', an: true },
  ],
  goiY: [
    { en: 'After close(), hashCode() changes ⇒ remove() searches another bucket and finds nothing, while the object sits in its old bucket forever.', vi: 'Sau close(), hashCode() đổi ⇒ remove() tìm ở ô khác và không thấy gì, còn đối tượng nằm mãi ở ô cũ.' },
    { en: 'In a real app: jcmd <pid> GC.class_histogram after each day shows Ticket instances growing — that is how you find this leak.', vi: 'Trong ứng dụng thật: jcmd <pid> GC.class_histogram sau mỗi ngày cho thấy số Ticket tăng — đó là cách tìm ra chỗ rò này.' },
  ],
  loiHayGap: [
    { en: 'Removing before closing in Main — hides the bug in one place, every other caller still leaks.', vi: 'Xoá trước rồi mới đóng trong Main — giấu lỗi ở một chỗ, mọi nơi gọi khác vẫn rò.' },
    { en: 'Making status final — then a ticket can no longer be closed.', vi: 'Cho status thành final — phiếu không đóng được nữa.' },
  ],
  giaiThich: { en: '<p>Hash collections remember where an element went by its hashCode at insertion time. Mutable fields in equals/hashCode make that address go stale. Base equality on the immutable identity (the id) and the leak disappears.</p>', vi: '<p>Collection băm nhớ phần tử nằm đâu theo hashCode lúc thêm vào. Trường thay đổi được trong equals/hashCode làm địa chỉ đó lỗi thời. Đặt equals trên danh tính bất biến (id) là hết rò.</p>' },
});

const de2 = deJava({
  id: 'pro192-cs5-de-quy-sau',
  tieuDe: { en: 'StackOverflowError: walk a chain of a million links without recursion', vi: 'StackOverflowError: đi qua chuỗi một triệu mắt xích không đệ quy' },
  doKho: 'MEDIUM', phut: 20, java: 17,
  khaiNiem: ['each call uses a stack frame (default thread stack ≈ 512 KB–1 MB)', 'StackOverflowError is an Error, not an Exception', 'recursion → loop', 'iterative depth-first with an explicit Deque'],
  moTa: {
    en: `<p>The library stores "book B was a replacement for book A" as a chain: each ${c('Copy')} has a ${c('previous')} link. ${c('Chains.length(copy)')} and ${c('Chains.totalPages(copy)')} are written recursively — fine for a chain of 10, a ${c('StackOverflowError')} for a chain of a million (the stack holds one frame per call). Rewrite both <b>without recursion</b>. The given ${c('Main')} builds chains of the lengths in the input (copy i has ${c('i % 300 + 1')} pages) and prints the results.</p>`,
    vi: `<p>Thư viện lưu "sách B thay cho sách A" thành một chuỗi: mỗi ${c('Copy')} có liên kết ${c('previous')}. ${c('Chains.length(copy)')} và ${c('Chains.totalPages(copy)')} viết đệ quy — ổn với chuỗi 10, ${c('StackOverflowError')} với chuỗi một triệu (stack giữ một khung cho mỗi lời gọi). Viết lại cả hai <b>không đệ quy</b>. ${c('Main')} cho sẵn dựng các chuỗi có độ dài trong input (bản i có ${c('i % 300 + 1')} trang) và in kết quả.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java and Copy.java.', 'No method of Chains calls itself.'], vi: ['Không sửa Main.java và Copy.java.', 'Không hàm nào của Chains tự gọi chính nó.'] },
  dauVao: { en: 'Chain lengths, one per line.', vi: 'Độ dài chuỗi, mỗi dòng một số.' },
  dauRa: { en: 'One line per chain.', vi: 'Mỗi chuỗi một dòng.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'no recursion in Chains', vi: 'không đệ quy trong Chains', re: String.raw`return\s+[^;]*\b(length|totalPages)\s*\(`, file: '^Chains\\.java$' }],
  tep: {
    'Copy.java': j`
// GIVEN — do not change.
public class Copy {
    final int pages;
    final Copy previous;

    Copy(int pages, Copy previous) {
        this.pages = pages;
        this.previous = previous;
    }
}
`,
    'Main.java': j`
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (sc.hasNextInt()) {
            int n = sc.nextInt();
            Copy last = null;
            for (int i = 1; i <= n; i++) {
                last = new Copy(i % 300 + 1, last);
            }
            System.out.println("chain of " + n + ": length " + Chains.length(last) + ", pages " + Chains.totalPages(last));
        }
    }
}
`,
    'Chains.java': j`
public class Chains {
    public static int length(Copy c) {
        //>> if (c == null) { ⏎     return 0; ⏎ } ⏎ return 1 + length(c.previous); // TODO: a loop
        int n = 0;
        for (Copy x = c; x != null; x = x.previous) {
            n++;
        }
        return n;
        //<<
    }

    public static long totalPages(Copy c) {
        //>> if (c == null) { ⏎     return 0; ⏎ } ⏎ return c.pages + totalPages(c.previous); // TODO: a loop
        long sum = 0;
        for (Copy x = c; x != null; x = x.previous) {
            sum += x.pages;
        }
        return sum;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'short chains and an empty one', vi: 'chuỗi ngắn và chuỗi rỗng' }, vao: '0\n1\n10\n' },
    { ten: { en: 'a chain of one million', vi: 'chuỗi một triệu mắt xích' }, vao: '1000000\n' },
    { ten: { en: 'two million, then 299 and 300', vi: 'hai triệu, rồi 299 và 300' }, vao: '2000000\n299\n300\n', an: true },
  ],
  timeoutMs: 20000,
  goiY: [
    { en: 'for (Copy x = c; x != null; x = x.previous) { … } visits every link with ONE frame.', vi: 'for (Copy x = c; x != null; x = x.previous) { … } đi qua mọi mắt xích với MỘT khung stack.' },
    { en: 'Pages: a million × 300 does not fit in an int — the sum is a long.', vi: 'Số trang: một triệu × 300 không vừa int — tổng là long.' },
  ],
  loiHayGap: [
    { en: 'Catching StackOverflowError — the result is still missing; and -Xss only moves the limit.', vi: 'Bắt StackOverflowError — kết quả vẫn không có; còn -Xss chỉ dời giới hạn.' },
    { en: 'Tail recursion "optimisation": the JVM does not eliminate tail calls, return f(x.previous) still uses a frame per call.', vi: '"Tối ưu" đệ quy đuôi: JVM không bỏ lời gọi đuôi, return f(x.previous) vẫn tốn một khung mỗi lần gọi.' },
  ],
  giaiThich: { en: '<p>Each Java call pushes a frame on the thread’s stack, whose size is fixed when the thread starts. Depth proportional to the data (a list, a deep tree) needs a loop or an explicit stack on the heap (ArrayDeque) — the heap is large, the stack is not.</p>', vi: '<p>Mỗi lời gọi Java đẩy một khung lên stack của luồng, mà kích thước stack cố định khi luồng khởi động. Độ sâu tỉ lệ với dữ liệu (một list, một cây sâu) cần vòng lặp hoặc stack tường minh trên heap (ArrayDeque) — heap lớn, stack thì không.</p>' },
});

const de3 = deJava({
  id: 'pro192-cs5-integer-cache',
  tieuDe: { en: 'Stock count reconciliation: Integer == works up to 127', vi: 'Đối soát tồn kho: Integer == chỉ đúng tới 127' },
  doKho: 'EASY', phut: 15, java: 17,
  khaiNiem: ['autoboxing', 'Integer.valueOf caches -128..127', '== on objects compares references', 'equals / intValue'],
  moTa: {
    en: `<p>The warehouse compares the stock in the system with the stock counted by hand: two ${c('Map<String, Integer>')}. ${c('Stock.differences(system, counted)')} must list, in the order of the system map, every item whose two counts differ (an item missing from the counted map counts as 0): ${c('USB-C cable: system 200, counted 198')}. The given version compares the ${c('Integer')} values with ${c('!=')} — it passes every test with small numbers and reports equal counts above 127 as "different". Fix it.</p>`,
    vi: `<p>Kho so tồn trên hệ thống với tồn đếm tay: hai ${c('Map<String, Integer>')}. ${c('Stock.differences(system, counted)')} phải liệt kê, theo thứ tự map hệ thống, mọi mặt hàng có hai số khác nhau (thiếu trong map đếm tay thì tính 0): ${c('USB-C cable: system 200, counted 198')}. Bản cho sẵn so hai giá trị ${c('Integer')} bằng ${c('!=')} — qua mọi bài thử với số nhỏ và báo số bằng nhau trên 127 là "khác". Sửa lại.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java.'], vi: ['Không sửa Main.java.'] },
  dauVao: { en: 'Lines "item;system;counted" (counted may be empty = missing).', vi: 'Các dòng "item;system;counted" (counted trống = thiếu).' },
  dauRa: { en: 'The differences, then their count.', vi: 'Các chênh lệch, rồi số lượng.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'no == / != between two Integer values from the maps', vi: 'không == / != giữa hai giá trị Integer lấy từ map', re: String.raw`(==|!=)\s*real\b|\breal\s*(==|!=)|getValue\s*\(\s*\)\s*(==|!=)`, file: '^Stock\\.java$' }],
  tep: {
    'Main.java': j`
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Map<String, Integer> system = new LinkedHashMap<>();
        Map<String, Integer> counted = new LinkedHashMap<>();
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().split(";", -1);
            if (p.length < 3) {
                continue;
            }
            system.put(p[0].trim(), Integer.valueOf(p[1].trim()));
            if (!p[2].trim().isEmpty()) {
                counted.put(p[0].trim(), Integer.valueOf(p[2].trim()));
            }
        }
        List<String> diff = Stock.differences(system, counted);
        diff.forEach(System.out::println);
        System.out.println(diff.size() + " difference(s)");
    }
}
`,
    'Stock.java': j`
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Stock {
    public static List<String> differences(Map<String, Integer> system, Map<String, Integer> counted) {
        List<String> out = new ArrayList<>();
        for (Map.Entry<String, Integer> e : system.entrySet()) {
            Integer real = counted.getOrDefault(e.getKey(), 0);
            //>> if (e.getValue() != real) { // TODO: compare the VALUES
            if (!e.getValue().equals(real)) {
            //<<
                out.add(e.getKey() + ": system " + e.getValue() + ", counted " + real);
            }
        }
        return out;
    }
}
`,
  },
  ca: [
    { ten: { en: 'small and large counts', vi: 'số nhỏ và số lớn' }, vao: 'Mouse;12;12\nKeyboard;7;6\nUSB-C cable;200;198\nHDMI cable;150;150\nMonitor;3;\n' },
    { ten: { en: 'only large equal counts and the 127/128 border', vi: 'chỉ số lớn bằng nhau và ranh giới 127/128' }, vao: 'A;127;127\nB;128;128\nC;1000;1000\nD;-128;-128\nE;-129;-129\nF;0;\n', an: true },
  ],
  goiY: [
    { en: 'Integer.valueOf(n) returns a cached object for -128..127 and a NEW object otherwise ⇒ == is true for 12 == 12, false for 150 == 150.', vi: 'Integer.valueOf(n) trả đối tượng có sẵn cho -128..127 và đối tượng MỚI ngoài khoảng đó ⇒ == đúng với 12 == 12, sai với 150 == 150.' },
    { en: 'Compare with equals, or unbox: e.getValue().intValue() != real.intValue().', vi: 'So bằng equals, hoặc mở hộp: e.getValue().intValue() != real.intValue().' },
  ],
  loiHayGap: [
    { en: 'Tests with small numbers only — the bug is invisible below 128.', vi: 'Chỉ thử với số nhỏ — lỗi vô hình dưới 128.' },
    { en: 'Fixing with -XX:AutoBoxCacheMax=… — changes the border, not the bug.', vi: 'Sửa bằng -XX:AutoBoxCacheMax=… — dời ranh giới, không sửa lỗi.' },
  ],
  giaiThich: { en: '<p>== on two Integer objects compares references. Autoboxing goes through Integer.valueOf, which shares objects for -128..127, so == "works" exactly in the range every quick test uses. Values from collections are objects — compare them with equals.</p>', vi: '<p>== trên hai đối tượng Integer so tham chiếu. Autoboxing đi qua Integer.valueOf, dùng chung đối tượng cho -128..127, nên == "đúng" đúng trong khoảng mà mọi bài thử nhanh dùng. Giá trị lấy từ collection là đối tượng — so bằng equals.</p>' },
});

const de4 = deJava({
  id: 'pro192-cs5-thu-tu-khoi-tao',
  tieuDe: { en: 'ExceptionInInitializerError: the order of static initialisation', vi: 'ExceptionInInitializerError: thứ tự khởi tạo static' },
  doKho: 'MEDIUM', phut: 20, java: 17,
  khaiNiem: ['static fields are initialised top to bottom', 'a field read before its initialiser sees 0 / null', 'ExceptionInInitializerError then NoClassDefFoundError', 'initialisation-on-demand holder'],
  moTa: {
    en: `<p>${c('PriceList')} is a singleton: ${c('INSTANCE')} is created in a static field, and its constructor loads the default prices into the static map ${c('TABLE')} and computes ${c('VAT_PERCENT')} from ${c('BASE_RATE')}. The class fails before ${c('main')} can use it — ${c('ExceptionInInitializerError')} caused by a ${c('NullPointerException')} — and when that is fixed the VAT shows ${c('0%')}. Static fields are initialised <b>top to bottom</b>: ${c('INSTANCE')} is built while ${c('TABLE')} is still ${c('null')} and ${c('BASE_RATE')} still ${c('0')}. Fix ${c('PriceList')} (reorder, or use a holder class) so that the given ${c('Main')} prints the prices of the requested items.</p>`,
    vi: `<p>${c('PriceList')} là singleton: ${c('INSTANCE')} tạo trong một trường static, constructor của nó nạp giá mặc định vào map static ${c('TABLE')} và tính ${c('VAT_PERCENT')} từ ${c('BASE_RATE')}. Lớp hỏng trước khi ${c('main')} kịp dùng — ${c('ExceptionInInitializerError')} do ${c('NullPointerException')} — và sửa xong thì VAT lại hiện ${c('0%')}. Trường static khởi tạo <b>từ trên xuống</b>: ${c('INSTANCE')} được dựng khi ${c('TABLE')} còn ${c('null')} và ${c('BASE_RATE')} còn ${c('0')}. Sửa ${c('PriceList')} (đổi thứ tự, hoặc dùng lớp holder) để ${c('Main')} cho sẵn in giá các mặt hàng được hỏi.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java.', 'Keep PriceList a singleton reached through PriceList.get().'], vi: ['Không sửa Main.java.', 'Giữ PriceList là singleton lấy qua PriceList.get().'] },
  dauVao: { en: 'Item names, one per line.', vi: 'Tên mặt hàng, mỗi dòng một tên.' },
  dauRa: { en: 'The VAT line, then one line per item.', vi: 'Dòng VAT, rồi mỗi mặt hàng một dòng.' },
  main: 'Main',
  tep: {
    'Main.java': j`
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        PriceList prices = PriceList.get();
        System.out.println("VAT " + prices.vatPercent() + "%");
        while (sc.hasNextLine()) {
            String item = sc.nextLine().trim();
            if (!item.isEmpty()) {
                System.out.println(item + ": " + prices.priceWithVat(item));
            }
        }
    }
}
`,
    'PriceList.java': j`
import java.util.HashMap;
import java.util.Map;

public final class PriceList {
    //>> private static final PriceList INSTANCE = new PriceList(); // TODO: this line runs FIRST — before TABLE and BASE_RATE exist ⏎ private static final Map<String, Long> TABLE = new HashMap<>(); ⏎ private static int BASE_RATE = 8;
    private static final Map<String, Long> TABLE = new HashMap<>();
    private static int BASE_RATE = 8;
    private static final PriceList INSTANCE = new PriceList();
    //<<

    private final int vatPercent;

    private PriceList() {
        TABLE.put("pen", 5_000L);
        TABLE.put("notebook", 18_000L);
        TABLE.put("calculator", 350_000L);
        vatPercent = BASE_RATE;
    }

    public static PriceList get() {
        return INSTANCE;
    }

    public int vatPercent() {
        return vatPercent;
    }

    public String priceWithVat(String item) {
        Long price = TABLE.get(item);
        if (price == null) {
            return "not sold here";
        }
        return String.valueOf(price + price * vatPercent / 100);
    }
}
`,
  },
  ca: [
    { ten: { en: 'three items and an unknown one', vi: 'ba mặt hàng và một mặt hàng lạ' }, vao: 'pen\ncalculator\nruler\nnotebook\n' },
    { ten: { en: 'no item', vi: 'không mặt hàng nào' }, vao: '', an: true },
  ],
  goiY: [
    { en: 'The JVM runs the static initialisers in source order, once, when the class is first used. A static field read before its own line still has its default value (null, 0).', vi: 'JVM chạy các khởi tạo static theo thứ tự trong mã, một lần, khi lớp được dùng lần đầu. Trường static đọc trước dòng của chính nó vẫn mang giá trị mặc định (null, 0).' },
    { en: 'A holder: private static class Holder { static final PriceList INSTANCE = new PriceList(); } — created only when get() is first called, after PriceList’s own statics.', vi: 'Holder: private static class Holder { static final PriceList INSTANCE = new PriceList(); } — chỉ tạo khi get() được gọi lần đầu, sau các static của PriceList.' },
  ],
  loiHayGap: [
    { en: 'Making BASE_RATE a compile-time constant (static final int BASE_RATE = 8) hides half of the bug — constants are inlined — while TABLE still crashes.', vi: 'Cho BASE_RATE thành hằng biên dịch (static final int BASE_RATE = 8) giấu được nửa lỗi — hằng được chép thẳng vào — còn TABLE vẫn sập.' },
    { en: 'Catching ExceptionInInitializerError — the class stays unusable: every later use throws NoClassDefFoundError.', vi: 'Bắt ExceptionInInitializerError — lớp vẫn không dùng được: mọi lần dùng sau ném NoClassDefFoundError.' },
  ],
  giaiThich: { en: '<p>Class initialisation is a single pass over the static initialisers in textual order. A static instance created at the top runs its constructor while later statics are still defaults. Put the instance last, or move it into a holder class whose initialisation is triggered by get().</p>', vi: '<p>Khởi tạo lớp là một lượt chạy qua các khởi tạo static theo thứ tự trong văn bản. Một thể hiện static tạo ở đầu chạy constructor khi các static phía sau còn mặc định. Đặt thể hiện xuống cuối, hoặc dời vào lớp holder mà get() mới kích hoạt khởi tạo.</p>' },
});

export default moDun({ slug: 'pro192-cs5-on', ten: '11.5 ⭐ CS.5 The JVM seen from your code: leaks, the stack, caches, initialisation', de: [de1, de2, de3, de4] });
