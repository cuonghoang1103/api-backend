/** PRO192 · 7.2 🧪 — mảng đối tượng kiểu PE: câu 3 với ILaptop (mảng), báo cáo một lượt đa hình, sắp + tìm nhị phân, quản lý sản phẩm LAB211 trên mảng. */
import { moDun, deJava, c, j, LOI_CHUNG } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-on-ch7-pe-q3',
  tieuDe: { en: 'PE question 3: an array of Laptop and the given ILaptop', vi: 'Câu 3 PE: mảng Laptop và ILaptop đề cho' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['array of objects', 'count / sort / remove on an array', 'returning a new array'],
  moTa: {
    en: `<p>${c('Laptop')} (maker, rate), ${c('ILaptop')} and ${c('Main')} are given. Write ${c('MyLaptop implements ILaptop')}:</p>
<ul><li>${c('int f1(Laptop[] a)')} — how many laptops have a rate <b>above the average</b> rate of the array (0 for an empty array).</li>
<li>${c('void f2(Laptop[] a)')} — sort the array in place: maker A–Z (ignoring case), equal makers by rate <b>descending</b>.</li>
<li>${c('Laptop[] f3(Laptop[] a)')} — a <b>new</b> array without the laptops whose maker starts with ${c('"A"')} (ignoring case); the order of the others is kept.</li></ul>`,
    vi: `<p>${c('Laptop')} (maker, rate), ${c('ILaptop')} và ${c('Main')} cho sẵn. Viết ${c('MyLaptop implements ILaptop')}: ${c('f1')} đếm số laptop có rate <b>cao hơn trung bình</b> của mảng (0 với mảng rỗng); ${c('f2')} sắp mảng tại chỗ: maker A–Z (không phân biệt hoa thường), cùng maker thì rate <b>giảm dần</b>; ${c('f3')} trả mảng <b>mới</b> bỏ các laptop có maker bắt đầu bằng ${c('"A"')} (không phân biệt hoa thường), giữ thứ tự các cái còn lại.</p>`,
  },
  yeuCau: { en: ['Do not change Laptop.java, ILaptop.java or Main.java.'], vi: ['Không sửa Laptop.java, ILaptop.java hay Main.java.'] },
  dauVao: { en: 'n, n lines maker;rate, then TC (1–3).', vi: 'n, n dòng maker;rate, rồi TC (1–3).' },
  dauRa: { en: 'OUTPUT of the TC.', vi: 'OUTPUT của TC.' },
  main: 'Main',
  tep: {
    'Laptop.java': j`
// GIVEN by the paper — do not change.
public class Laptop {
    private final String maker;
    private final int rate;

    public Laptop(String maker, int rate) {
        this.maker = maker;
        this.rate = rate;
    }

    public String getMaker() {
        return maker;
    }

    public int getRate() {
        return rate;
    }

    @Override
    public String toString() {
        return "(" + maker + ", " + rate + ")";
    }
}
`,
    'ILaptop.java': j`
// GIVEN by the paper — do not change.
public interface ILaptop {
    int f1(Laptop[] a);

    void f2(Laptop[] a);

    Laptop[] f3(Laptop[] a);
}
`,
    'Main.java': j`
import java.util.Arrays;
import java.util.Scanner;

// GIVEN by the paper — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        Laptop[] a = new Laptop[n];
        for (int i = 0; i < n; i++) {
            String[] p = sc.nextLine().split(";");
            a[i] = new Laptop(p[0].trim(), Integer.parseInt(p[1].trim()));
        }
        System.out.print("Enter TC (1, 2 or 3): ");
        int tc = Integer.parseInt(sc.nextLine().trim());
        ILaptop t = new MyLaptop();
        System.out.println();
        System.out.println("OUTPUT:");
        if (tc == 1) {
            System.out.println(t.f1(a));
        } else if (tc == 2) {
            t.f2(a);
            System.out.println(Arrays.toString(a));
        } else {
            Laptop[] b = t.f3(a);
            System.out.println(Arrays.toString(b) + " (original still " + a.length + ")");
        }
    }
}
`,
    'MyLaptop.java': j`
import java.util.Arrays;
import java.util.Comparator;

public class MyLaptop implements ILaptop {
    @Override
    public int f1(Laptop[] a) {
        //>> return 0; // TODO
        if (a.length == 0) {
            return 0;
        }
        double sum = 0;
        for (Laptop x : a) {
            sum += x.getRate();
        }
        double avg = sum / a.length;
        int count = 0;
        for (Laptop x : a) {
            if (x.getRate() > avg) {
                count++;
            }
        }
        return count;
        //<<
    }

    @Override
    public void f2(Laptop[] a) {
        //>> // TODO: Arrays.sort with a Comparator
        Arrays.sort(a, new Comparator<Laptop>() {
            @Override
            public int compare(Laptop x, Laptop y) {
                int byMaker = x.getMaker().compareToIgnoreCase(y.getMaker());
                return byMaker != 0 ? byMaker : Integer.compare(y.getRate(), x.getRate());
            }
        });
        //<<
    }

    @Override
    public Laptop[] f3(Laptop[] a) {
        //>> return a; // TODO: a NEW array without makers starting with A/a
        int keep = 0;
        for (Laptop x : a) {
            if (!x.getMaker().toUpperCase().startsWith("A")) {
                keep++;
            }
        }
        Laptop[] b = new Laptop[keep];
        int k = 0;
        for (Laptop x : a) {
            if (!x.getMaker().toUpperCase().startsWith("A")) {
                b[k++] = x;
            }
        }
        return b;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'TC1 above average', vi: 'TC1 trên trung bình' }, vao: '5\nDell;8\nAsus;5\nHP;7\nacer;3\nApple;9\n1\n' },
    { ten: { en: 'TC2 sort', vi: 'TC2 sắp xếp' }, vao: '5\ndell;3\nAsus;5\nDell;8\nacer;3\nApple;9\n2\n' },
    { ten: { en: 'TC3 remove A makers', vi: 'TC3 bỏ maker chữ A' }, vao: '4\nAsus;5\nDell;8\napple;1\nMSI;6\n3\n', an: true },
    { ten: { en: 'TC1 all equal, TC3 all removed', vi: 'TC1 bằng nhau hết, TC3 bỏ hết' }, vao: '2\nA;4\na;4\n1\n', an: true },
  ],
  goiY: [
    { en: 'f1: compute the average as a double first, then count rate > average (strictly).', vi: 'f1: tính trung bình kiểu double trước, rồi đếm rate > trung bình (lớn hơn hẳn).' },
    { en: 'f3: an array cannot shrink — count the kept laptops, create Laptop[count], then copy them in order.', vi: 'f3: mảng không co lại được — đếm số laptop giữ, tạo Laptop[count], rồi chép theo thứ tự.' },
  ],
  loiHayGap: [
    { en: 'Integer average (sum / n with ints) — 32 / 5 = 6 and a rate of 6.4 territory is miscounted.', vi: 'Trung bình nguyên (sum / n với int) — 32 / 5 = 6, đếm sai quanh 6.4.' },
    { en: 'f3 setting the removed slots to null instead of returning a shorter array — Arrays.toString prints "null".', vi: 'f3 gán null cho ô bị bỏ thay vì trả mảng ngắn hơn — Arrays.toString in "null".' },
    LOI_CHUNG.inThem,
  ],
  giaiThich: { en: '<p>Arrays have a fixed length, so "remove" means building a new array of the right size; sorting in place uses Arrays.sort with a two-key Comparator; the average-based count needs double arithmetic.</p>', vi: '<p>Mảng có độ dài cố định, nên "xoá" nghĩa là dựng mảng mới đúng cỡ; sắp tại chỗ dùng Arrays.sort với Comparator hai khoá; đếm theo trung bình cần số thực.</p>' },
});

const de2 = deJava({
  id: 'pro192-on-ch7-one-pass-report',
  tieuDe: { en: 'Reports in one pass over a polymorphic array', vi: 'Báo cáo trong một lượt duyệt mảng đa hình' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['single pass', 'polymorphic methods', 'counting per category with an array', 'max with ties'],
  moTa: {
    en: `<p>An ${c('Asset[]')} holds ${c('Laptop')}, ${c('Monitor')} and ${c('Printer')} objects (given; each overrides ${c('category()')} → ${c('0')}, ${c('1')} or ${c('2')}, and ${c('value()')}). Write ${c('Report.of(Asset[] assets)')} that walks the array <b>once</b> and returns the lines:</p>
<pre>count: laptops 2, monitors 1, printers 0
total value: 41000000
most valuable: L2 (25000000)
average value: 13666666</pre>
<p>The most valuable is the first one found on a tie; with no asset print ${c('most valuable: none')} and ${c('average value: 0')} (integer division).</p>`,
    vi: `<p>Một ${c('Asset[]')} chứa ${c('Laptop')}, ${c('Monitor')}, ${c('Printer')} (cho sẵn; mỗi lớp ghi đè ${c('category()')} → ${c('0')}, ${c('1')} hay ${c('2')}, và ${c('value()')}). Viết ${c('Report.of(Asset[] assets)')} duyệt mảng <b>một lần</b> và trả các dòng như mẫu. Món giá trị nhất là món gặp đầu tiên khi hoà; không có tài sản nào thì in ${c('most valuable: none')} và ${c('average value: 0')} (chia nguyên).</p>`,
  },
  yeuCau: { en: ['One loop over the array; no instanceof — use category() as an index into an int[3].'], vi: ['Một vòng lặp trên mảng; không instanceof — dùng category() làm chỉ số vào int[3].'] },
  dauVao: { en: 'Lines TYPE;code;value (L, M, P).', vi: 'Các dòng LOẠI;mã;giá trị (L, M, P).' },
  dauRa: { en: 'The four report lines.', vi: 'Bốn dòng báo cáo.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'no instanceof in Report', vi: 'không instanceof trong Report', re: String.raw`\binstanceof\b`, file: 'Report' }],
  tep: {
    'Asset.java': j`
// GIVEN — do not change.
public abstract class Asset {
    private final String code;
    private final long value;

    protected Asset(String code, long value) {
        this.code = code;
        this.value = value;
    }

    public String getCode() {
        return code;
    }

    public long value() {
        return value;
    }

    public abstract int category();
}
`,
    'Laptop.java': j`
// GIVEN — do not change.
public class Laptop extends Asset {
    public Laptop(String code, long value) {
        super(code, value);
    }

    @Override
    public int category() {
        return 0;
    }
}
`,
    'Monitor.java': j`
// GIVEN — do not change.
public class Monitor extends Asset {
    public Monitor(String code, long value) {
        super(code, value);
    }

    @Override
    public int category() {
        return 1;
    }
}
`,
    'Printer.java': j`
// GIVEN — do not change.
public class Printer extends Asset {
    public Printer(String code, long value) {
        super(code, value);
    }

    @Override
    public int category() {
        return 2;
    }

    @Override
    public long value() {
        return super.value() * 9 / 10;
    }
}
`,
    'Report.java': j`
import java.util.ArrayList;
import java.util.List;

public class Report {
    public static List<String> of(Asset[] assets) {
        List<String> lines = new ArrayList<>();
        //>> // TODO: one pass — counts per category, total, most valuable (first on a tie), average
        int[] count = new int[3];
        long total = 0;
        Asset best = null;
        for (Asset a : assets) {
            count[a.category()]++;
            total += a.value();
            if (best == null || a.value() > best.value()) {
                best = a;
            }
        }
        lines.add("count: laptops " + count[0] + ", monitors " + count[1] + ", printers " + count[2]);
        lines.add("total value: " + total);
        lines.add("most valuable: " + (best == null ? "none" : best.getCode() + " (" + best.value() + ")"));
        lines.add("average value: " + (assets.length == 0 ? 0 : total / assets.length));
        //<<
        return lines;
    }
}
`,
    'Main.java': j`
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Asset> list = new ArrayList<>();
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) {
                continue;
            }
            String[] p = line.split(";");
            long v = Long.parseLong(p[2]);
            list.add(p[0].equals("L") ? new Laptop(p[1], v) : p[0].equals("M") ? new Monitor(p[1], v) : new Printer(p[1], v));
        }
        for (String line : Report.of(list.toArray(new Asset[0]))) {
            System.out.println(line);
        }
    }
}
`,
  },
  ca: [
    { ten: { en: 'laptops and a monitor', vi: 'laptop và một màn hình' }, vao: 'L;L1;12000000\nL;L2;25000000\nM;M1;4000000\n' },
    { ten: { en: 'printers are valued at 90%, tie keeps the first', vi: 'máy in tính 90%, hoà giữ món đầu' }, vao: 'P;P1;10000000\nM;M2;9000000\nL;L3;9000000\nP;P2;3\n' },
    { ten: { en: 'no asset', vi: 'không có tài sản' }, vao: '\n', an: true },
  ],
  goiY: [
    { en: 'int[] count = new int[3]; count[a.category()]++ — the category IS the index, no if/else.', vi: 'int[] count = new int[3]; count[a.category()]++ — category CHÍNH LÀ chỉ số, không cần if/else.' },
    { en: 'Call a.value(), never read a field: Printer overrides value() and the report must use the overridden one.', vi: 'Gọi a.value(), đừng đọc trường: Printer ghi đè value() và báo cáo phải dùng bản ghi đè.' },
  ],
  loiHayGap: [
    { en: 'Three separate loops (one per figure) — correct output, but the task asks for one pass.', vi: 'Ba vòng lặp riêng (mỗi con số một vòng) — output đúng nhưng đề yêu cầu một lượt.' },
    { en: 'Dividing by zero for an empty array.', vi: 'Chia cho 0 khi mảng rỗng.' },
  ],
  giaiThich: { en: '<p>One pass gathers every figure: counts in an array indexed by the polymorphic category(), a running total and a running maximum. Using value() (not a field) lets Printer’s override apply everywhere.</p>', vi: '<p>Một lượt gom mọi con số: đếm trong mảng có chỉ số là category() đa hình, tổng cộng dồn và giá trị lớn nhất cập nhật dần. Dùng value() (không dùng trường) để bản ghi đè của Printer áp dụng ở mọi chỗ.</p>' },
});

const de3 = deJava({
  id: 'pro192-on-ch7-binary-search',
  tieuDe: { en: 'Sort by code, then binary search an array of objects', vi: 'Sắp theo mã, rồi tìm nhị phân trên mảng đối tượng' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['binary search by hand', 'sorted precondition', 'O(log n)', 'counting comparisons'],
  moTa: {
    en: `<p>Write ${c('Catalog')} over a ${c('Product[]')}:</p>
<ul><li>${c('Catalog(Product[] products)')} — keeps a <b>copy</b> sorted by code (case-insensitive);</li>
<li>${c('Product find(String code)')} — <b>binary search written by hand</b> (no ${c('Arrays.binarySearch')}); null when absent;</li>
<li>${c('int lastComparisons()')} — how many codes the last ${c('find')} compared (one per loop iteration).</li></ul>
<p>Use the classic loop ${c('lo = 0, hi = n - 1; while (lo <= hi) { mid = (lo + hi) >>> 1; … }')}.</p>`,
    vi: `<p>Viết ${c('Catalog')} trên ${c('Product[]')}: constructor giữ một <b>bản sao</b> đã sắp theo mã (không phân biệt hoa thường); ${c('find(String code)')} — <b>tìm nhị phân tự viết</b> (không dùng ${c('Arrays.binarySearch')}), null khi không có; ${c('lastComparisons()')} — lần ${c('find')} gần nhất đã so bao nhiêu mã (mỗi vòng lặp một lần). Dùng vòng lặp kinh điển ${c('lo = 0, hi = n - 1; while (lo <= hi) { mid = (lo + hi) >>> 1; … }')}.</p>`,
  },
  yeuCau: { en: ['No Arrays.binarySearch / Collections.binarySearch (rule R1).', 'The caller’s array keeps its order.'], vi: ['Không Arrays.binarySearch / Collections.binarySearch (luật R1).', 'Mảng của nơi gọi giữ nguyên thứ tự.'] },
  dauVao: { en: 'n products code;name, then the codes to find.', vi: 'n sản phẩm mã;tên, rồi các mã cần tìm.' },
  dauRa: { en: 'Each search with its result and number of comparisons.', vi: 'Mỗi lần tìm kèm kết quả và số lần so.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'binary search written by hand', vi: 'tìm nhị phân tự viết', re: String.raw`binarySearch`, file: 'Catalog' }],
  tep: {
    'Product.java': j`
// GIVEN — do not change.
public class Product {
    private final String code;
    private final String name;

    public Product(String code, String name) {
        this.code = code;
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    @Override
    public String toString() {
        return code + " " + name;
    }
}
`,
    'Catalog.java': j`
import java.util.Arrays;
import java.util.Comparator;

public class Catalog {
    private final Product[] sorted;
    private int comparisons;

    public Catalog(Product[] products) {
        //>> sorted = products; // TODO: a sorted COPY
        sorted = Arrays.copyOf(products, products.length);
        Arrays.sort(sorted, new Comparator<Product>() {
            @Override
            public int compare(Product a, Product b) {
                return a.getCode().compareToIgnoreCase(b.getCode());
            }
        });
        //<<
    }

    public Product find(String code) {
        //>> return null; // TODO: binary search by hand, count the comparisons
        comparisons = 0;
        int lo = 0;
        int hi = sorted.length - 1;
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            comparisons++;
            int cmp = sorted[mid].getCode().compareToIgnoreCase(code);
            if (cmp == 0) {
                return sorted[mid];
            }
            if (cmp < 0) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return null;
        //<<
    }

    public int lastComparisons() {
        return comparisons;
    }
}
`,
    'Main.java': j`
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        Product[] products = new Product[n];
        for (int i = 0; i < n; i++) {
            String[] p = sc.nextLine().split(";");
            products[i] = new Product(p[0], p[1]);
        }
        Catalog catalog = new Catalog(products);
        while (sc.hasNextLine()) {
            String code = sc.nextLine().trim();
            System.out.println("find " + code + " -> " + catalog.find(code) + " (" + catalog.lastComparisons() + " comparisons)");
        }
        System.out.println("caller's order kept: " + Arrays.toString(products));
    }
}
`,
  },
  ca: [
    { ten: { en: 'seven products', vi: 'bảy sản phẩm' }, vao: '7\nP40;Ink\nP10;Pen\nP70;Tape\nP20;Ruler\nP60;Stapler\nP30;Glue\nP50;Paper\nP40\np10\nP70\nP45\n' },
    { ten: { en: 'empty catalog and one product', vi: 'danh mục rỗng và một sản phẩm' }, vao: '0\nX1\n', an: true },
    { ten: { en: 'sixteen products', vi: 'mười sáu sản phẩm' }, vao: '16\n' + Array.from({ length: 16 }, (_, i) => `K${String(100 + i * 7)};item${i}`).join('\n') + '\nK100\nK205\nK149\nK999\nK000\n', an: true },
  ],
  goiY: [
    { en: 'Binary search only works on sorted data — sort the copy in the constructor with the SAME comparison you use in find (compareToIgnoreCase).', vi: 'Tìm nhị phân chỉ đúng trên dữ liệu đã sắp — sắp bản sao trong constructor bằng CÙNG phép so mà find dùng (compareToIgnoreCase).' },
    { en: '(lo + hi) >>> 1 avoids the int overflow of (lo + hi) / 2 on huge arrays.', vi: '(lo + hi) >>> 1 tránh tràn int của (lo + hi) / 2 trên mảng rất lớn.' },
  ],
  loiHayGap: [
    { en: 'while (lo < hi) — the last remaining candidate is never compared and a present code is reported missing.', vi: 'while (lo < hi) — ứng viên cuối cùng không bao giờ được so, mã có thật bị báo không có.' },
    { en: 'Sorting the caller’s array instead of a copy — the last line shows the changed order.', vi: 'Sắp mảng của nơi gọi thay vì bản sao — dòng cuối cho thấy thứ tự bị đổi.' },
    { en: 'Sorting with compareTo but searching with compareToIgnoreCase (or the reverse) — inconsistent orders break the search.', vi: 'Sắp bằng compareTo nhưng tìm bằng compareToIgnoreCase (hoặc ngược lại) — hai thứ tự không khớp làm hỏng phép tìm.' },
  ],
  giaiThich: { en: '<p>Each iteration halves the range [lo, hi], so a search costs at most ⌊log₂ n⌋ + 1 comparisons — 3 for 7 items, 5 for 16. The comparison used to sort and the one used to search must be the same order.</p>', vi: '<p>Mỗi vòng lặp chia đôi khoảng [lo, hi], nên một lần tìm tốn tối đa ⌊log₂ n⌋ + 1 phép so — 3 với 7 món, 5 với 16. Phép so dùng để sắp và phép so dùng để tìm phải cùng một thứ tự.</p>' },
});

const de4 = deJava({
  id: 'pro192-on-ch7-product-manager',
  tieuDe: { en: 'A LAB211 product manager on an array', vi: 'Quản lý sản phẩm kiểu LAB211 trên mảng' },
  doKho: 'HARD', phut: 60,
  khaiNiem: ['menu loop', 'array storage with size', 'validated input', 'update / delete with shifting'],
  moTa: {
    en: `<p>The array version of a LAB211 manager (no collections allowed in ${c('ProductStore')}). Menu:</p>
<pre>===== PRODUCT MANAGER =====
1. Add  2. List  3. Search by name  4. Update price  5. Delete  0. Exit
Choice: </pre>
<ul><li>Store: capacity 100; code ${c('P')} + 3 digits, unique; name not blank; price 1..1 000 000 000; quantity 0..10 000.</li>
<li>List: by code, ${c('String.format("%-6s %-20s %,15d %6d", code, name, price, quantity)')}; empty → ${c('Empty.')}</li>
<li>Search: name contains the keyword (ignore case); nothing → ${c('Not found.')}</li>
<li>Update price / Delete by code; unknown → ${c('Product <code> does not exist.')}</li></ul>
<p>The prompts and messages are in the given ${c('Main.java')}; your job is ${c('ProductStore')} and the missing parts of Main.</p>`,
    vi: `<p>Bản mảng của một bài quản lý LAB211 (${c('ProductStore')} không được dùng collection). Menu như trên. Kho: sức chứa 100; mã ${c('P')} + 3 chữ số, không trùng; tên không trống; giá 1..1 000 000 000; số lượng 0..10 000. Liệt kê theo mã với định dạng trên; rỗng → ${c('Empty.')} Tìm: tên chứa từ khoá (không phân biệt hoa thường); không có → ${c('Not found.')} Sửa giá / Xoá theo mã; mã lạ → ${c('Product <mã> does not exist.')} Lời nhắc và câu báo nằm trong ${c('Main.java')} cho sẵn; việc của bạn là ${c('ProductStore')} và các phần còn thiếu của Main.</p>`,
  },
  yeuCau: { en: ['ProductStore uses a Product[] + size — no List/ArrayList there (rule R1).', 'LAB211 rules L1–L7 apply (the L3 rule allows List elsewhere).'], vi: ['ProductStore dùng Product[] + size — không List/ArrayList ở đó (luật R1).', 'Áp luật LAB211 L1–L7.'] },
  dauVao: { en: 'Menu choices and values, one per line.', vi: 'Lựa chọn menu và giá trị, mỗi thứ một dòng.' },
  dauRa: { en: 'Menu, prompts, messages, tables.', vi: 'Menu, lời nhắc, thông báo, bảng.' },
  main: 'Main', lab211: true,
  quyTac: [{ id: 'R1', en: 'arrays only in ProductStore', vi: 'chỉ dùng mảng trong ProductStore', re: String.raw`\b(ArrayList|LinkedList|List|Vector|Collections)\b`, file: 'ProductStore' }],
  tep: {
    'Product.java': j`
public class Product {
    private final String code;
    private final String name;
    private long price;
    private final int quantity;

    public Product(String code, String name, long price, int quantity) {
        this.code = code;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public void setPrice(long price) {
        this.price = price;
    }

    @Override
    public String toString() {
        return String.format("%-6s %-20s %,15d %6d", code, name, price, quantity);
    }
}
`,
    'ProductStore.java': j`
import java.util.Arrays;
import java.util.Comparator;

// Products in a partly filled array. Never prints, never reads the keyboard.
public class ProductStore {
    private static final int CAPACITY = 100;
    private final Product[] products = new Product[CAPACITY];
    private int size;

    public Product find(String code) {
        //>> return null; // TODO
        int i = indexOf(code);
        return i < 0 ? null : products[i];
        //<<
    }

    //>> // TODO: private int indexOf(String code)
    private int indexOf(String code) {
        for (int i = 0; i < size; i++) {
            if (products[i].getCode().equals(code)) {
                return i;
            }
        }
        return -1;
    }
    //<<

    public boolean isFull() {
        return size == CAPACITY;
    }

    public void add(Product product) {
        //>> // TODO
        products[size++] = product;
        //<<
    }

    public Product[] sortedByCode() {
        //>> return new Product[0]; // TODO: a sorted copy of the used slots
        Product[] copy = Arrays.copyOf(products, size);
        Arrays.sort(copy, new Comparator<Product>() {
            @Override
            public int compare(Product a, Product b) {
                return a.getCode().compareTo(b.getCode());
            }
        });
        return copy;
        //<<
    }

    public Product[] searchByName(String keyword) {
        //>> return new Product[0]; // TODO: insertion order
        Product[] found = new Product[size];
        int count = 0;
        for (int i = 0; i < size; i++) {
            if (products[i].getName().toLowerCase().contains(keyword.toLowerCase())) {
                found[count++] = products[i];
            }
        }
        return Arrays.copyOf(found, count);
        //<<
    }

    public boolean delete(String code) {
        //>> return false; // TODO: shift left, clear the last slot
        int i = indexOf(code);
        if (i < 0) {
            return false;
        }
        for (int k = i; k < size - 1; k++) {
            products[k] = products[k + 1];
        }
        products[--size] = null;
        return true;
        //<<
    }
}
`,
    'Main.java': j`
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        ProductStore productStore = new ProductStore();
        boolean isRunning = true;
        while (isRunning) {
            System.out.println("===== PRODUCT MANAGER =====");
            System.out.println("1. Add  2. List  3. Search by name  4. Update price  5. Delete  0. Exit");
            switch (readInt(scanner, "Choice: ", 0, 5)) {
                case 1:
                    addProduct(scanner, productStore);
                    break;
                case 2:
                    print(productStore.sortedByCode(), "Empty.");
                    break;
                case 3:
                    print(productStore.searchByName(readText(scanner, "Keyword: ")), "Not found.");
                    break;
                case 4:
                    String code = readCode(scanner);
                    Product product = productStore.find(code);
                    //>> System.out.println("TODO"); // TODO: unknown -> message; else read the price (1..1 000 000 000), set it, print "Price updated."
                    if (product == null) {
                        System.out.println("Product " + code + " does not exist.");
                    } else {
                        product.setPrice(readLong(scanner, "New price: ", 1, 1_000_000_000L));
                        System.out.println("Price updated.");
                    }
                    //<<
                    break;
                case 5:
                    String deleteCode = readCode(scanner);
                    System.out.println(productStore.delete(deleteCode) ? "Deleted." : "Product " + deleteCode + " does not exist.");
                    break;
                case 0:
                    System.out.println("Bye.");
                    isRunning = false;
                    break;
                default:
                    break;
            }
        }
    }

    private static void addProduct(Scanner scanner, ProductStore productStore) {
        if (productStore.isFull()) {
            System.out.println("The store is full.");
            return;
        }
        String code = readCode(scanner);
        //>> // TODO: refuse an existing code ("Product <code> already exists."); else read name, price (1..1 000 000 000), quantity (0..10 000), add, print "Added."
        if (productStore.find(code) != null) {
            System.out.println("Product " + code + " already exists.");
            return;
        }
        String name = readText(scanner, "Name: ");
        long price = readLong(scanner, "Price: ", 1, 1_000_000_000L);
        int quantity = readInt(scanner, "Quantity: ", 0, 10_000);
        productStore.add(new Product(code, name, price, quantity));
        System.out.println("Added.");
        //<<
    }

    private static void print(Product[] productArray, String emptyMessage) {
        if (productArray.length == 0) {
            System.out.println(emptyMessage);
            return;
        }
        for (Product product : productArray) {
            System.out.println(product);
        }
    }

    private static int readInt(Scanner scanner, String prompt, int min, int max) {
        return (int) readLong(scanner, prompt, min, max);
    }

    private static long readLong(Scanner scanner, String prompt, long min, long max) {
        while (true) {
            System.out.print(prompt);
            String line = scanner.nextLine().trim();
            try {
                long value = Long.parseLong(line);
                if (value >= min && value <= max) {
                    return value;
                }
                System.out.println("Enter a number from " + min + " to " + max + ".");
            } catch (NumberFormatException e) {
                System.out.println("\"" + line + "\" is not a whole number.");
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
            System.out.println("Cannot be empty.");
        }
    }

    private static String readCode(Scanner scanner) {
        while (true) {
            String code = readText(scanner, "Code (P + 3 digits): ").toUpperCase();
            if (code.matches("P\\d{3}")) {
                return code;
            }
            System.out.println("A code is P followed by 3 digits, e.g. P007.");
        }
    }
}
`,
  },
  ca: [
    { ten: { en: 'add with mistakes, list, search', vi: 'thêm có nhập sai, liệt kê, tìm' }, vao: '2\n1\nX1\np010\nBlue Pen\n0\n5000\nabc\n120\n1\nP002\nNotebook A5\n18000\n40\n1\nP010\n3\npen\n2\n0\n' },
    { ten: { en: 'update and delete', vi: 'sửa và xoá' }, vao: '1\nP001\nGlue\n7000\n5\n4\nP009\n4\nP001\n0\n7500\n5\nP001\n5\nP001\n2\n0\n' },
    { ten: { en: 'menu robustness', vi: 'menu chịu sai' }, vao: '\n9\n-1\nfive\n3\nzzz\n0\n', an: true },
  ],
  goiY: [
    { en: 'Write indexOf(code) once (a private helper); find, delete and the duplicate check all use it.', vi: 'Viết indexOf(code) một lần (hàm phụ private); find, delete và phép kiểm trùng đều dùng nó.' },
    { en: 'Return arrays of exactly the right length (Arrays.copyOf(found, count)) so Main can loop over them without null checks.', vi: 'Trả mảng đúng độ dài (Arrays.copyOf(found, count)) để Main lặp mà không cần kiểm null.' },
  ],
  loiHayGap: [
    { en: 'Sorting the store array itself for the list — afterwards the search is no longer in insertion order.', vi: 'Sắp chính mảng của kho khi liệt kê — sau đó phép tìm không còn theo thứ tự thêm.' },
    { en: 'Returning the internal array (with nulls after size) to Main — NullPointerException when printing.', vi: 'Trả mảng bên trong (có null sau size) cho Main — NullPointerException khi in.' },
  ],
  giaiThich: { en: '<p>The store keeps the partly-filled-array invariant and offers copies sized exactly to the result; Main owns all text and validation. This is the "antique shop" design of chapter 7 written to LAB211 standards.</p>', vi: '<p>Kho giữ bất biến mảng đầy một phần và trả các bản sao đúng cỡ kết quả; Main giữ mọi câu chữ và phép kiểm. Đây là thiết kế "cửa hàng đồ cổ" của chương 7 viết theo chuẩn LAB211.</p>' },
});

export default moDun({ slug: 'pro192-on-ch7', ten: '7.2 🧪 Practice — arrays of objects the PE way: Q3, one-pass reports, binary search, a LAB211 manager', de: [de1, de2, de3, de4] });
