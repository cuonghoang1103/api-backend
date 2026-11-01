/** PRO192 · 6.1 — try, catch, finally & throw: bắt đúng loại, ném kèm lý do, ngoại lệ checked tự tạo, try-with-resources. */
import { moDun, deJava, c, j } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-6-1-safe-divide',
  tieuDe: { en: 'try/catch: a calculator that never crashes', vi: 'try/catch: máy tính không bao giờ sập' },
  doKho: 'EASY', phut: 15,
  khaiNiem: ['try / catch', 'NumberFormatException', 'ArithmeticException', 'finally'],
  moTa: {
    en: `<p>Read lines until the end of input. Each line should be two integers ${c('a b')}; print ${c('a / b')} (integer division) and ${c('a % b')}:</p>
<pre>17 / 5 = 3 remainder 2</pre>
<p>Never crash. Instead print exactly one of:</p>
<ul><li>${c('Line 3: "x 2" is not two integers')} — a part is not an integer, or the count of parts is not 2;</li>
<li>${c('Line 4: cannot divide by zero')}.</li></ul>
<p>Count every line in a ${c('finally')} block, and at the end print ${c('Processed 5 line(s), 2 error(s)')}. Blank lines count too (as "not two integers").</p>`,
    vi: `<p>Đọc các dòng tới hết input. Mỗi dòng phải là hai số nguyên ${c('a b')}; in ${c('a / b')} (chia nguyên) và ${c('a % b')} như mẫu. Không bao giờ sập; thay vào đó in đúng một trong hai: ${c('Line 3: "x 2" is not two integers')} (một phần không phải số nguyên, hoặc số phần khác 2) hoặc ${c('Line 4: cannot divide by zero')}. Đếm mọi dòng trong khối ${c('finally')}, cuối cùng in ${c('Processed 5 line(s), 2 error(s)')}. Dòng trống cũng tính (là "not two integers").</p>`,
  },
  yeuCau: { en: ['Catch the specific exceptions (NumberFormatException, ArithmeticException) — not Exception.', 'The line counter is incremented in finally.'], vi: ['Bắt đúng loại ngoại lệ (NumberFormatException, ArithmeticException) — không bắt Exception.', 'Bộ đếm dòng tăng trong finally.'] },
  dauVao: { en: 'Lines "a b".', vi: 'Các dòng "a b".' },
  dauRa: { en: 'One line per input line, then the summary.', vi: 'Mỗi dòng input một dòng, rồi dòng tổng kết.' },
  main: 'Main',
  quyTac: [
    { id: 'R1', en: 'catch the specific exceptions, not Exception/Throwable', vi: 'bắt đúng loại, không bắt Exception/Throwable', re: String.raw`catch\s*\(\s*(final\s+)?(Exception|Throwable|RuntimeException)\s+\w+\s*\)` },
    { id: 'R2', en: 'uses finally', vi: 'có dùng finally', re: String.raw`\bfinally\b`, need: true },
  ],
  tep: {
    'Main.java': j`
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int lines = 0;
        int errors = 0;
        while (sc.hasNextLine()) {
            String line = sc.nextLine();
            //>> String[] p = line.trim().split("\\s+"); ⏎ int a = Integer.parseInt(p[0]); ⏎ int b = Integer.parseInt(p[1]); ⏎ System.out.println(a + " / " + b + " = " + (a / b) + " remainder " + (a % b)); ⏎ lines++; // TODO: try / catch / finally
            try {
                String[] p = line.trim().split("\\s+");
                if (p.length != 2) {
                    throw new NumberFormatException("need two parts");
                }
                int a = Integer.parseInt(p[0]);
                int b = Integer.parseInt(p[1]);
                System.out.println(a + " / " + b + " = " + (a / b) + " remainder " + (a % b));
            } catch (NumberFormatException e) {
                errors++;
                System.out.println("Line " + (lines + 1) + ": \"" + line + "\" is not two integers");
            } catch (ArithmeticException e) {
                errors++;
                System.out.println("Line " + (lines + 1) + ": cannot divide by zero");
            } finally {
                lines++;
            }
            //<<
        }
        System.out.println("Processed " + lines + " line(s), " + errors + " error(s)");
    }
}
`,
  },
  ca: [
    { ten: { en: 'good lines and both kinds of error', vi: 'dòng đúng và hai kiểu lỗi' }, vao: '17 5\n-7 2\nx 2\n4 0\n100 7\n' },
    { ten: { en: 'wrong number of parts, blank line, overflowing number', vi: 'sai số phần, dòng trống, số tràn' }, vao: '1 2 3\n\n9999999999 1\n  8   -3  \n', an: true },
    { ten: { en: 'no input at all', vi: 'không có input' }, vao: '', an: true },
  ],
  goiY: [
    { en: 'Put the parsing AND the division inside try: a NumberFormatException comes from parseInt, an ArithmeticException from a / b.', vi: 'Đặt cả phần parse VÀ phép chia trong try: NumberFormatException đến từ parseInt, ArithmeticException từ a / b.' },
    { en: 'finally runs after the try block and after any catch — the ideal place for lines++.', vi: 'finally chạy sau khối try và sau mọi catch — chỗ lý tưởng cho lines++.' },
  ],
  loiHayGap: [
    { en: 'catch (Exception e) — it also hides bugs you did not expect (rule R1).', vi: 'catch (Exception e) — nó che luôn cả lỗi bạn không lường trước (luật R1).' },
    { en: '"1 2 3" accepted because only p[0] and p[1] are read — check the number of parts.', vi: '"1 2 3" được nhận vì chỉ đọc p[0] và p[1] — phải kiểm số phần.' },
    { en: 'Expecting 7 / 0.0 to throw — only INTEGER division by zero throws; doubles give Infinity.', vi: 'Tưởng 7 / 0.0 sẽ ném ngoại lệ — chỉ chia NGUYÊN cho 0 mới ném; số thực cho Infinity.' },
  ],
  giaiThich: { en: '<p>Each risky step sits inside one try; two catch blocks give two precise messages; finally counts the line whatever happened. Integer.parseInt throws NumberFormatException for letters, blanks and numbers too big for int.</p>', vi: '<p>Mọi bước rủi ro nằm trong một try; hai khối catch cho hai thông báo chính xác; finally đếm dòng dù chuyện gì xảy ra. Integer.parseInt ném NumberFormatException với chữ, chuỗi trống và số quá lớn cho int.</p>' },
});

const de2 = deJava({
  id: 'pro192-6-1-throw-iae',
  tieuDe: { en: 'throw with a reason: a constructor that refuses bad data', vi: 'throw kèm lý do: constructor từ chối dữ liệu sai' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['throw new IllegalArgumentException(msg)', 'fail fast', 'getMessage()'],
  moTa: {
    en: `<p>A ${c('Product')} that cannot exist in a bad state: the constructor checks its arguments and <b>throws</b> ${c('IllegalArgumentException')} with a message that says what is wrong:</p>
<ul><li>code: two upper-case letters + 3 digits (${c('"SP001"')}) → ${c('"code must look like SP001: <code>"')};</li>
<li>name: not blank → ${c('"name must not be blank"')};</li>
<li>price: ≥ 0 → ${c('"price must be >= 0: <price>"')};</li>
<li>quantity: 0..10 000 → ${c('"quantity must be 0..10000: <q>"')}.</li></ul>
<p>Check in that order (the first problem wins). ${c('setPrice')} applies the same price rule. The test class creates products and prints the message of each refusal.</p>`,
    vi: `<p>${c('Product')} không thể tồn tại ở trạng thái sai: constructor kiểm đối số và <b>ném</b> ${c('IllegalArgumentException')} kèm câu nói rõ sai gì — mã: hai chữ hoa + 3 chữ số; tên: không trống; giá: ≥ 0; số lượng: 0..10 000 (câu chữ đúng như bản tiếng Anh). Kiểm theo đúng thứ tự đó (lỗi đầu tiên thắng). ${c('setPrice')} áp cùng luật giá. Lớp kiểm tạo sản phẩm và in câu báo của mỗi lần bị từ chối.</p>`,
  },
  yeuCau: { en: ['Messages exactly as listed.', 'No object is created when a check fails (the exception leaves the constructor).'], vi: ['Câu báo đúng như danh sách.', 'Không đối tượng nào được tạo khi kiểm thất bại (ngoại lệ thoát khỏi constructor).'] },
  dauVao: { en: 'Lines code;name;price;quantity, or SETPRICE;value for the last product.', vi: 'Các dòng mã;tên;giá;số lượng, hoặc SETPRICE;giá trị cho sản phẩm cuối.' },
  dauRa: { en: 'OK + the product, or REFUSED + the message.', vi: 'OK + sản phẩm, hoặc REFUSED + câu báo.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Product last = null;
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().split(";", -1);
            try {
                if (p[0].equals("SETPRICE")) {
                    last.setPrice(Long.parseLong(p[1]));
                    System.out.println("OK " + last);
                } else {
                    last = new Product(p[0], p[1], Long.parseLong(p[2]), Integer.parseInt(p[3]));
                    System.out.println("OK " + last);
                }
            } catch (IllegalArgumentException e) {
                System.out.println("REFUSED " + e.getClass().getSimpleName() + ": " + e.getMessage());
            }
        }
    }
}
`,
  },
  tep: {
    'Product.java': j`
public class Product {
    private final String code;
    private final String name;
    private long price;
    private final int quantity;

    public Product(String code, String name, long price, int quantity) {
        //>> // TODO: check code, name, price, quantity in this order; throw IllegalArgumentException
        if (code == null || !code.matches("[A-Z]{2}\\d{3}")) {
            throw new IllegalArgumentException("code must look like SP001: " + code);
        }
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("name must not be blank");
        }
        checkPrice(price);
        if (quantity < 0 || quantity > 10_000) {
            throw new IllegalArgumentException("quantity must be 0..10000: " + quantity);
        }
        //<<
        this.code = code;
        this.name = name.trim();
        this.price = price;
        this.quantity = quantity;
    }

    //>> // TODO: one private checkPrice(long) used by the constructor and setPrice
    private static void checkPrice(long price) {
        if (price < 0) {
            throw new IllegalArgumentException("price must be >= 0: " + price);
        }
    }
    //<<

    public void setPrice(long price) {
        //>> this.price = price; // TODO
        checkPrice(price);
        this.price = price;
        //<<
    }

    @Override
    public String toString() {
        return code + " " + name + " " + price + " x" + quantity;
    }
}
`,
  },
  ca: [
    { ten: { en: 'valid product, each kind of refusal', vi: 'sản phẩm hợp lệ, từng kiểu bị từ chối' }, vao: 'SP001;Pen;5000;100\nsp002;Pen;5000;1\nSP003;   ;5000;1\nSP004;Ink;-1;1\nSP005;Box;0;10001\n' },
    { ten: { en: 'setPrice keeps the rule', vi: 'setPrice giữ luật' }, vao: 'AB123;Notebook;12000;0\nSETPRICE;-5\nSETPRICE;15000\n' },
    { ten: { en: 'several problems: the first one wins', vi: 'nhiều lỗi: lỗi đầu tiên thắng' }, vao: 'X1;;-1;-1\nXY999;;-1;-1\nXY999; Glue ;-1;-1\nXY999;Glue;7;10000\n', an: true },
  ],
  goiY: [
    { en: 'throw new IllegalArgumentException("…" + value) ends the constructor immediately — no half-built object escapes.', vi: 'throw new IllegalArgumentException("…" + giá trị) kết thúc constructor ngay — không đối tượng dở dang nào lọt ra.' },
    { en: 'Put the price rule in one private static method and call it from both the constructor and setPrice.', vi: 'Đặt luật giá vào một phương thức private static và gọi từ cả constructor lẫn setPrice.' },
  ],
  loiHayGap: [
    { en: 'Printing an error inside the constructor and carrying on — the object exists with bad data.', vi: 'In lỗi trong constructor rồi chạy tiếp — đối tượng vẫn tồn tại với dữ liệu sai.' },
    { en: 'Checking the price only in setPrice — new Product(…, -1, …) is accepted.', vi: 'Chỉ kiểm giá trong setPrice — new Product(…, -1, …) vẫn được nhận.' },
    { en: 'Assigning the fields BEFORE the checks — harmless here because the object is lost, but a habit that leaks half-initialised objects elsewhere.', vi: 'Gán trường TRƯỚC khi kiểm — ở đây vô hại vì đối tượng bị bỏ, nhưng là thói quen làm lộ đối tượng khởi tạo dở ở chỗ khác.' },
  ],
  giaiThich: { en: '<p>Fail fast: the constructor validates every argument before assigning anything and throws an unchecked IllegalArgumentException whose message names the rule and the bad value. The caller decides what to do with it — here, print and continue.</p>', vi: '<p>Thất bại sớm: constructor kiểm mọi đối số trước khi gán gì và ném IllegalArgumentException (unchecked) với câu báo nêu luật và giá trị sai. Nơi gọi quyết định làm gì — ở đây là in rồi chạy tiếp.</p>' },
});

const de3 = deJava({
  id: 'pro192-6-1-checked-exception',
  tieuDe: { en: 'A custom checked exception: InsufficientFundsException', vi: 'Ngoại lệ checked tự tạo: InsufficientFundsException' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['extends Exception (checked)', 'throws clause', 'extra data in an exception', 'catch in the caller'],
  moTa: {
    en: `<p>Withdrawing more than the balance is a <b>business</b> error the caller must handle, so it is a checked exception.</p>
<ul><li>${c('InsufficientFundsException extends Exception')} with ${c('getShortfall()')} (how much is missing) and the message ${c('"need 300000 more"')}.</li>
<li>${c('Wallet.pay(long amount) throws InsufficientFundsException')} — a non-positive amount throws ${c('IllegalArgumentException("amount must be positive")')} (unchecked: a programming error).</li>
<li>${c('Checkout.buy(Wallet w, String item, long price)')} returns ${c('"bought Pen"')} or catches the checked exception and returns ${c('"cannot buy Pen: need 300000 more (balance 200000)"')}.</li></ul>`,
    vi: `<p>Rút nhiều hơn số dư là lỗi <b>nghiệp vụ</b> mà nơi gọi buộc phải xử lý, nên là ngoại lệ checked.</p>
<ul><li>${c('InsufficientFundsException extends Exception')} có ${c('getShortfall()')} (thiếu bao nhiêu) và câu báo ${c('"need 300000 more"')}.</li>
<li>${c('Wallet.pay(long amount) throws InsufficientFundsException')} — số tiền không dương ném ${c('IllegalArgumentException("amount must be positive")')} (unchecked: lỗi lập trình).</li>
<li>${c('Checkout.buy(Wallet w, String item, long price)')} trả ${c('"bought Pen"')} hoặc bắt ngoại lệ checked và trả ${c('"cannot buy Pen: need 300000 more (balance 200000)"')}.</li></ul>`,
  },
  yeuCau: { en: ['The exception is checked (extends Exception, not RuntimeException).', 'pay declares throws InsufficientFundsException.'], vi: ['Ngoại lệ là checked (extends Exception, không phải RuntimeException).', 'pay khai báo throws InsufficientFundsException.'] },
  dauVao: { en: 'First line: the balance. Then item;price lines.', vi: 'Dòng đầu: số dư. Rồi các dòng món;giá.' },
  dauRa: { en: 'Structure, then one line per purchase and the final balance.', vi: 'Cấu trúc, rồi mỗi lần mua một dòng và số dư cuối.' },
  main: 'KiemTra', kiem: true,
  quyTac: [{ id: 'R1', en: 'pay declares throws InsufficientFundsException', vi: 'pay khai báo throws InsufficientFundsException', re: String.raw`pay\s*\([^)]*\)\s*throws\s+InsufficientFundsException`, file: 'Wallet', need: true }],
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(Kiem.kieu("InsufficientFundsException"));
        Wallet w = new Wallet(Long.parseLong(sc.nextLine().trim()));
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().split(";");
            try {
                System.out.println(Checkout.buy(w, p[0], Long.parseLong(p[1])));
            } catch (IllegalArgumentException e) {
                System.out.println("programming error: " + e.getMessage());
            }
        }
        System.out.println("balance " + w.getBalance());
    }
}
`,
  },
  tep: {
    'InsufficientFundsException.java': j`
//>> public class InsufficientFundsException extends RuntimeException { // TODO: a CHECKED exception with getShortfall() ⏎     public InsufficientFundsException(long shortfall) { ⏎         super("need " + shortfall + " more"); ⏎     } ⏎ }
public class InsufficientFundsException extends Exception {
    private final long shortfall;

    public InsufficientFundsException(long shortfall) {
        super("need " + shortfall + " more");
        this.shortfall = shortfall;
    }

    public long getShortfall() {
        return shortfall;
    }
}
//<<
`,
    'Wallet.java': j`
public class Wallet {
    private long balance;

    public Wallet(long balance) {
        this.balance = balance;
    }

    public long getBalance() {
        return balance;
    }

    //>> public void pay(long amount) { ⏎     balance -= amount; // TODO: validate, throw InsufficientFundsException ⏎ }
    public void pay(long amount) throws InsufficientFundsException {
        if (amount <= 0) {
            throw new IllegalArgumentException("amount must be positive");
        }
        if (amount > balance) {
            throw new InsufficientFundsException(amount - balance);
        }
        balance -= amount;
    }
    //<<
}
`,
    'Checkout.java': j`
public class Checkout {
    public static String buy(Wallet w, String item, long price) {
        //>> w.pay(price); ⏎ return "bought " + item; // TODO: catch the checked exception
        try {
            w.pay(price);
            return "bought " + item;
        } catch (InsufficientFundsException e) {
            return "cannot buy " + item + ": " + e.getMessage() + " (balance " + w.getBalance() + ")";
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'enough, then not enough', vi: 'đủ tiền, rồi không đủ' }, vao: '500000\nPen;300000\nBook;500000\nInk;200000\n' },
    { ten: { en: 'zero and negative prices are programming errors', vi: 'giá 0 và âm là lỗi lập trình' }, vao: '1000\nFree;0\nRefund;-50\nGum;1001\nGum;1000\nAir;1\n', an: true },
  ],
  goiY: [
    { en: 'extends Exception makes it checked: the compiler then forces pay to declare it and every caller to catch or declare it.', vi: 'extends Exception làm nó thành checked: trình biên dịch buộc pay khai báo và mọi nơi gọi phải bắt hoặc khai báo tiếp.' },
    { en: 'Store the shortfall in a final field and pass the message to super(...).', vi: 'Lưu số tiền thiếu trong trường final và đưa câu báo cho super(...).' },
  ],
  loiHayGap: [
    { en: 'extends RuntimeException — it compiles without try/catch, and a forgotten case crashes at run time.', vi: 'extends RuntimeException — biên dịch được mà không cần try/catch, và chỗ quên bắt sẽ sập lúc chạy.' },
    { en: 'Subtracting before checking — the balance goes negative and then the exception is thrown.', vi: 'Trừ tiền trước khi kiểm — số dư âm rồi mới ném ngoại lệ.' },
    { en: 'Catching IllegalArgumentException in Checkout too — a programming error should not be turned into a normal message.', vi: 'Bắt cả IllegalArgumentException trong Checkout — lỗi lập trình không nên bị biến thành thông báo bình thường.' },
  ],
  giaiThich: { en: '<p>Checked exceptions are for expected business failures the caller must handle (not enough money); unchecked ones for programming errors (a non-positive amount). The exception carries data (the shortfall) so the caller can build a precise message.</p>', vi: '<p>Ngoại lệ checked dành cho thất bại nghiệp vụ có thể đoán trước mà nơi gọi phải xử lý (không đủ tiền); unchecked dành cho lỗi lập trình (số tiền không dương). Ngoại lệ mang dữ liệu (số tiền thiếu) để nơi gọi dựng câu báo chính xác.</p>' },
});

const de4 = deJava({
  id: 'pro192-6-1-try-with-resources',
  tieuDe: { en: 'finally and try-with-resources: close it no matter what', vi: 'finally và try-with-resources: đóng dù có chuyện gì' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['AutoCloseable', 'try-with-resources', 'closing order', 'exception after close'],
  moTa: {
    en: `<p>${c('Resource')} is given: it implements ${c('AutoCloseable')} and logs ${c('open A')} / ${c('close A')}. Write ${c('Job.run(String[] steps)')}:</p>
<ul><li>open two resources ${c('"DB"')} and ${c('"FILE"')} in one <b>try-with-resources</b>;</li>
<li>for each step call ${c('db.use(step)')} — a step named ${c('"boom"')} throws ${c('IllegalStateException')};</li>
<li>catch it <b>after</b> the resources are closed and log ${c('"failed: <message>"')}; finally log ${c('"done"')}.</li></ul>
<p>The log must show that both resources are closed — in reverse order (FILE, then DB) — even when a step fails.</p>`,
    vi: `<p>${c('Resource')} cho sẵn: cài ${c('AutoCloseable')} và ghi log ${c('open A')} / ${c('close A')}. Viết ${c('Job.run(String[] steps)')}: mở hai tài nguyên ${c('"DB"')} và ${c('"FILE"')} trong một <b>try-with-resources</b>; với mỗi bước gọi ${c('db.use(step)')} — bước tên ${c('"boom"')} ném ${c('IllegalStateException')}; bắt nó <b>sau</b> khi tài nguyên đã đóng và ghi ${c('"failed: <message>"')}; cuối cùng ghi ${c('"done"')}. Log phải cho thấy cả hai tài nguyên được đóng — theo thứ tự ngược (FILE rồi DB) — kể cả khi một bước lỗi.</p>`,
  },
  yeuCau: { en: ['Use try-with-resources (no manual close()).', 'Do not change Resource.java.'], vi: ['Dùng try-with-resources (không tự gọi close()).', 'Không sửa Resource.java.'] },
  dauVao: { en: 'Steps on one line, separated by spaces.', vi: 'Các bước trên một dòng, cách nhau bằng dấu cách.' },
  dauRa: { en: 'The log.', vi: 'Log.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'try-with-resources, no manual close()', vi: 'try-with-resources, không tự gọi close()', re: String.raw`try\s*\(\s*Resource`, file: 'Job', need: true }],
  tep: {
    'Resource.java': j`
import java.util.List;

// GIVEN — do not change.
public class Resource implements AutoCloseable {
    private final String name;
    private final List<String> log;

    public Resource(String name, List<String> log) {
        this.name = name;
        this.log = log;
        log.add("open " + name);
    }

    public void use(String step) {
        if (step.equals("boom")) {
            throw new IllegalStateException(name + " broke at " + step);
        }
        log.add(name + " " + step);
    }

    @Override
    public void close() {
        log.add("close " + name);
    }
}
`,
    'Job.java': j`
import java.util.ArrayList;
import java.util.List;

public class Job {
    public static List<String> run(String[] steps) {
        List<String> log = new ArrayList<>();
        //>> Resource db = new Resource("DB", log); ⏎ Resource file = new Resource("FILE", log); ⏎ for (String step : steps) { ⏎     db.use(step); ⏎ } ⏎ log.add("done"); // TODO: try-with-resources + catch + finally
        try (Resource db = new Resource("DB", log); Resource file = new Resource("FILE", log)) {
            for (String step : steps) {
                db.use(step);
            }
        } catch (IllegalStateException e) {
            log.add("failed: " + e.getMessage());
        } finally {
            log.add("done");
        }
        //<<
        return log;
    }
}
`,
    'Main.java': j`
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            String[] steps = line.isEmpty() ? new String[0] : line.split("\\s+");
            System.out.println("run " + java.util.Arrays.toString(steps) + ": " + Job.run(steps));
        }
    }
}
`,
  },
  ca: [
    { ten: { en: 'all steps succeed', vi: 'mọi bước thành công' }, vao: 'read write\n' },
    { ten: { en: 'a step fails in the middle', vi: 'một bước lỗi ở giữa' }, vao: 'read boom write\n' },
    { ten: { en: 'no step, and failing first', vi: 'không bước nào, và lỗi ngay đầu' }, vao: '\nboom\n', an: true },
  ],
  goiY: [
    { en: 'try (Resource db = …; Resource file = …) { … } — Java calls close() on both automatically, in reverse order of opening.', vi: 'try (Resource db = …; Resource file = …) { … } — Java tự gọi close() cho cả hai, theo thứ tự ngược với lúc mở.' },
    { en: 'A catch attached to a try-with-resources runs AFTER the resources are closed — look at the order in the log.', vi: 'catch gắn với try-with-resources chạy SAU khi tài nguyên đã đóng — nhìn thứ tự trong log.' },
  ],
  loiHayGap: [
    { en: 'Closing manually at the end of the try block — when a step throws, close() is never reached.', vi: 'Tự đóng ở cuối khối try — khi một bước ném ngoại lệ, close() không bao giờ được gọi.' },
    { en: 'Opening the resources outside the try parentheses — then they are not closed automatically.', vi: 'Mở tài nguyên bên ngoài ngoặc của try — khi đó chúng không được đóng tự động.' },
  ],
  giaiThich: { en: '<p>try-with-resources guarantees close() for every resource declared in its header, in reverse order, before any catch or finally of the same statement runs. It replaces the error-prone try/finally { close } pattern (and the Scanner/BufferedReader leaks it causes).</p>', vi: '<p>try-with-resources bảo đảm gọi close() cho mọi tài nguyên khai báo ở phần đầu, theo thứ tự ngược, trước khi catch hay finally của cùng câu lệnh chạy. Nó thay khuôn try/finally { close } dễ sai (và các vụ rò Scanner/BufferedReader mà khuôn đó gây ra).</p>' },
});

export default moDun({ slug: 'pro192-6-1-ngoai-le', ten: '6.1 try, catch, finally & throw', de: [de1, de2, de3, de4] });
