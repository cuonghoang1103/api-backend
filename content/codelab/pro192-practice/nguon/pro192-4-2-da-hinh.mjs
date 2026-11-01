/** PRO192 · 4.2 — Polymorphism: một vòng lặp nhiều hành vi, không instanceof; nạp chồng vs ghi đè; ép kiểu an toàn. */
import { moDun, deJava, c, j } from './_chung.mjs';

const KHONG_INSTANCEOF = { id: 'R1', en: 'no instanceof / getClass() in the computation — polymorphism decides', vi: 'không instanceof / getClass() trong phần tính — đa hình tự quyết', re: String.raw`\binstanceof\b|getClass\s*\(` };

const de1 = deJava({
  id: 'pro192-4-2-payments',
  tieuDe: { en: 'One loop, three behaviours: payment fees', vi: 'Một vòng lặp, ba hành vi: phí thanh toán' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['polymorphism', 'dynamic binding', 'overriding', 'array of the parent type'],
  moTa: {
    en: `<p>A shop takes three kinds of payment. ${c('Payment')} (amount in VND) has ${c('long fee()')} = 0 and ${c('String name()')} = ${c('"Payment"')}. Write three subclasses that override both:</p>
<ul><li>${c('Cash')}: fee 0, name ${c('"Cash"')}.</li>
<li>${c('Card')}: 1.5% of the amount (rounded down) but at least 2 000; name ${c('"Card"')}.</li>
<li>${c('EWallet')}: 1% of the amount (rounded down), at most 10 000; name ${c('"E-wallet"')}.</li></ul>
<p>${c('Main')} reads ${c('n')} lines ${c('TYPE AMOUNT')} (TYPE = CASH, CARD, WALLET) into one ${c('Payment[]')}, prints ${c('Card 150000 fee 2250')} for each and finally ${c('Total fees: 12345')}. The loop that prints and sums must not ask what type each payment is.</p>`,
    vi: `<p>Cửa hàng nhận ba kiểu thanh toán. ${c('Payment')} (số tiền VND) có ${c('long fee()')} = 0 và ${c('String name()')} = ${c('"Payment"')}. Viết ba lớp con ghi đè cả hai:</p>
<ul><li>${c('Cash')}: phí 0, tên ${c('"Cash"')}.</li>
<li>${c('Card')}: 1.5% số tiền (làm tròn xuống) nhưng tối thiểu 2 000; tên ${c('"Card"')}.</li>
<li>${c('EWallet')}: 1% số tiền (làm tròn xuống), tối đa 10 000; tên ${c('"E-wallet"')}.</li></ul>
<p>${c('Main')} đọc ${c('n')} dòng ${c('TYPE AMOUNT')} (TYPE = CASH, CARD, WALLET) vào một ${c('Payment[]')}, in ${c('Card 150000 fee 2250')} cho từng cái và cuối cùng ${c('Total fees: 12345')}. Vòng lặp in và cộng không được hỏi từng khoản là kiểu gì.</p>`,
  },
  yeuCau: { en: ['Payment.java is given — do not change it.', 'Only the place that CREATES the objects may look at TYPE.'], vi: ['Payment.java cho sẵn — không sửa.', 'Chỉ chỗ TẠO đối tượng mới được nhìn TYPE.'] },
  dauVao: { en: 'n, then n lines "TYPE AMOUNT".', vi: 'n, rồi n dòng "TYPE AMOUNT".' },
  dauRa: { en: 'One line per payment, then the total of fees.', vi: 'Mỗi khoản một dòng, rồi tổng phí.' },
  main: 'Main', quyTac: [KHONG_INSTANCEOF],
  tep: {
    'Payment.java': j`
// GIVEN — do not change.
public class Payment {
    private final long amount;

    public Payment(long amount) {
        this.amount = amount;
    }

    public long getAmount() {
        return amount;
    }

    public long fee() {
        return 0;
    }

    public String name() {
        return "Payment";
    }
}
`,
    'Cash.java': j`
public class Cash extends Payment {
    public Cash(long amount) {
        super(amount);
    }

    //>> // TODO: name()
    @Override
    public String name() {
        return "Cash";
    }
    //<<
}
`,
    'Card.java': j`
public class Card extends Payment {
    public Card(long amount) {
        super(amount);
    }

    //>> // TODO: fee() and name()
    @Override
    public long fee() {
        return Math.max(2000, getAmount() * 15 / 1000);
    }

    @Override
    public String name() {
        return "Card";
    }
    //<<
}
`,
    'EWallet.java': j`
public class EWallet extends Payment {
    public EWallet(long amount) {
        super(amount);
    }

    //>> // TODO: fee() and name()
    @Override
    public long fee() {
        return Math.min(10000, getAmount() / 100);
    }

    @Override
    public String name() {
        return "E-wallet";
    }
    //<<
}
`,
    'Main.java': j`
import java.util.Scanner;

public class Main {
    // the only place that looks at the type: it builds the right object
    static Payment create(String type, long amount) {
        if (type.equals("CARD")) {
            return new Card(amount);
        }
        if (type.equals("WALLET")) {
            return new EWallet(amount);
        }
        return new Cash(amount);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        Payment[] payments = new Payment[n];
        for (int i = 0; i < n; i++) {
            String[] p = sc.nextLine().trim().split("\\s+");
            payments[i] = create(p[0], Long.parseLong(p[1]));
        }
        //>> // TODO: one loop: print "<name> <amount> fee <fee>" and add up the fees; then "Total fees: …"
        long total = 0;
        for (Payment pay : payments) {
            System.out.println(pay.name() + " " + pay.getAmount() + " fee " + pay.fee());
            total += pay.fee();
        }
        System.out.println("Total fees: " + total);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'one payment of each kind', vi: 'mỗi kiểu một khoản' }, vao: '3\nCASH 50000\nCARD 150000\nWALLET 700000\n' },
    { ten: { en: 'card minimum and wallet cap', vi: 'mức tối thiểu của thẻ và trần của ví' }, vao: '4\nCARD 1000\nCARD 133334\nWALLET 5000000\nWALLET 999\n' },
    { ten: { en: 'no payment', vi: 'không có khoản nào' }, vao: '0\n', an: true },
    { ten: { en: 'large amounts', vi: 'số tiền lớn' }, vao: '2\nCARD 2000000000\nWALLET 99999\n', an: true },
  ],
  goiY: [
    { en: 'payments[i] has the static type Payment, but pay.fee() runs the version of the real object (Card, EWallet…) — dynamic binding.', vi: 'payments[i] có kiểu tĩnh Payment, nhưng pay.fee() chạy bản của đối tượng thật (Card, EWallet…) — ràng buộc động.' },
    { en: '1.5% rounded down = amount * 15 / 1000 in long arithmetic; avoid double for money.', vi: '1.5% làm tròn xuống = amount * 15 / 1000 bằng số long; tránh double cho tiền.' },
  ],
  loiHayGap: [
    { en: 'if (pay instanceof Card) … else if (pay instanceof EWallet) … in the loop — every new payment type means editing the loop (rule R1).', vi: 'if (pay instanceof Card) … else if (pay instanceof EWallet) … trong vòng lặp — thêm kiểu mới là phải sửa vòng lặp (luật R1).' },
    { en: 'amount * 0.015 as a double — 150000 * 0.015 can give 2249.9999… and (long) cuts it to 2249.', vi: 'amount * 0.015 kiểu double — 150000 * 0.015 có thể ra 2249.9999… và ép (long) cắt thành 2249.' },
    { en: 'Math.min where Math.max is needed (or the other way round) for the floor and the cap.', vi: 'Dùng Math.min chỗ cần Math.max (hoặc ngược lại) cho mức sàn và mức trần.' },
  ],
  giaiThich: { en: '<p>The decision "which fee rule?" is made once, when the object is created; afterwards every Payment answers fee() for itself. Adding a new payment type is a new subclass plus one line in create() — the loop never changes.</p>', vi: '<p>Quyết định "luật phí nào?" được đưa ra một lần, lúc tạo đối tượng; sau đó mỗi Payment tự trả lời fee(). Thêm kiểu thanh toán mới là thêm một lớp con và một dòng trong create() — vòng lặp không bao giờ đổi.</p>' },
});

const de2 = deJava({
  id: 'pro192-4-2-late-fees',
  tieuDe: { en: 'Late fees without instanceof', vi: 'Phí trả trễ không cần instanceof' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['overriding with different rules', 'template in the parent', 'polymorphic report'],
  moTa: {
    en: `<p>${c('LibraryItem')} has a title and a number of loan days, and computes ${c('lateFee(int daysLate)')} from two methods the subclasses override:</p>
<ul><li>${c('int loanDays()')} — Book 14, Magazine 7, Dvd 3;</li>
<li>${c('long feeFor(int daysOver)')} — Book 2 000/day; Magazine 1 000/day, at most 10 000; Dvd 5 000/day for the first 3 days, then 10 000/day.</li></ul>
<p>${c('lateFee(daysKept)')} (in the parent, already written) = ${c('feeFor(daysKept - loanDays())')} when positive, else 0. Write the three subclasses. The test class prints a report for a polymorphic list.</p>`,
    vi: `<p>${c('LibraryItem')} có tên và tính ${c('lateFee(int daysKept)')} từ hai phương thức mà lớp con ghi đè:</p>
<ul><li>${c('int loanDays()')} — Book 14, Magazine 7, Dvd 3;</li>
<li>${c('long feeFor(int daysOver)')} — Book 2 000/ngày; Magazine 1 000/ngày, tối đa 10 000; Dvd 5 000/ngày cho 3 ngày đầu, sau đó 10 000/ngày.</li></ul>
<p>${c('lateFee(daysKept)')} (ở lớp cha, đã viết) = ${c('feeFor(daysKept - loanDays())')} khi dương, ngược lại 0. Viết ba lớp con. Lớp kiểm in báo cáo cho một danh sách đa hình.</p>`,
  },
  yeuCau: { en: ['Do not change LibraryItem.java.', 'No instanceof anywhere in your classes.'], vi: ['Không sửa LibraryItem.java.', 'Không instanceof ở đâu trong các lớp của bạn.'] },
  dauVao: { en: 'Lines TYPE;title;daysKept.', vi: 'Các dòng TYPE;tên;số ngày giữ.' },
  dauRa: { en: 'Each item with its loan days and fee, then the total.', vi: 'Từng tài liệu kèm số ngày mượn và phí, rồi tổng.' },
  main: 'KiemTra', quyTac: [KHONG_INSTANCEOF],
  harness: {
    'KiemTra.java': j`
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<LibraryItem> items = new ArrayList<>();
        List<Integer> kept = new ArrayList<>();
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split(";");
            items.add(p[0].equals("BOOK") ? new Book(p[1]) : p[0].equals("MAG") ? new Magazine(p[1]) : new Dvd(p[1]));
            kept.add(Integer.parseInt(p[2]));
        }
        long total = 0;
        for (int i = 0; i < items.size(); i++) {
            LibraryItem it = items.get(i);
            long fee = it.lateFee(kept.get(i));
            System.out.println(it.getTitle() + " | loan " + it.loanDays() + " days | kept " + kept.get(i) + " | fee " + fee);
            total += fee;
        }
        System.out.println("Total: " + total);
    }
}
`,
  },
  tep: {
    'LibraryItem.java': j`
// GIVEN — do not change. The rule "fee only for the days over the loan period" lives here, once.
public class LibraryItem {
    private final String title;

    public LibraryItem(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public int loanDays() {
        return 14;
    }

    public long feeFor(int daysOver) {
        return 0;
    }

    public final long lateFee(int daysKept) {
        int over = daysKept - loanDays();
        return over > 0 ? feeFor(over) : 0;
    }
}
`,
    'Book.java': j`
public class Book extends LibraryItem {
    public Book(String title) {
        super(title);
    }
    //>> // TODO: loanDays() and feeFor()

    @Override
    public int loanDays() {
        return 14;
    }

    @Override
    public long feeFor(int daysOver) {
        return 2000L * daysOver;
    }
    //<<
}
`,
    'Magazine.java': j`
public class Magazine extends LibraryItem {
    public Magazine(String title) {
        super(title);
    }
    //>> // TODO: loanDays() and feeFor()

    @Override
    public int loanDays() {
        return 7;
    }

    @Override
    public long feeFor(int daysOver) {
        return Math.min(10000L, 1000L * daysOver);
    }
    //<<
}
`,
    'Dvd.java': j`
public class Dvd extends LibraryItem {
    public Dvd(String title) {
        super(title);
    }
    //>> // TODO: loanDays() and feeFor()

    @Override
    public int loanDays() {
        return 3;
    }

    @Override
    public long feeFor(int daysOver) {
        int first = Math.min(3, daysOver);
        return 5000L * first + 10000L * (daysOver - first);
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'one of each, all late', vi: 'mỗi loại một, đều trễ' }, vao: 'BOOK;Clean Code;20\nMAG;Tech Weekly;12\nDVD;The Matrix;8\n' },
    { ten: { en: 'on time and exactly on the last day', vi: 'đúng hạn và đúng ngày cuối' }, vao: 'BOOK;Refactoring;14\nMAG;Java Magazine;7\nDVD;Inception;3\nDVD;Up;4\n' },
    { ten: { en: 'magazine cap and long DVD delays', vi: 'trần tạp chí và DVD trễ lâu' }, vao: 'MAG;Old Issue;40\nDVD;Long;6\nDVD;Longer;7\nBOOK;Kept Forever;365\n', an: true },
  ],
  goiY: [
    { en: 'The parent’s lateFee calls loanDays() and feeFor() — inside it, those calls are dynamically bound to the subclass versions.', vi: 'lateFee của lớp cha gọi loanDays() và feeFor() — bên trong nó, các lời gọi đó ràng buộc động tới bản của lớp con.' },
    { en: 'Dvd: first = Math.min(3, daysOver); fee = 5000 * first + 10000 * (daysOver − first).', vi: 'Dvd: first = Math.min(3, daysOver); phí = 5000 * first + 10000 * (daysOver − first).' },
  ],
  loiHayGap: [
    { en: 'Overriding lateFee itself — it is final in the parent (a compile error), because the "only days over the loan period" rule must not be repeated.', vi: 'Ghi đè chính lateFee — nó final ở lớp cha (lỗi biên dịch), vì luật "chỉ tính ngày quá hạn" không được lặp lại.' },
    { en: 'Dvd charging 10 000 for every day once it passes 3 days late, instead of 5 000 for the first 3.', vi: 'Dvd tính 10 000 cho mọi ngày khi đã trễ quá 3 ngày, thay vì 5 000 cho 3 ngày đầu.' },
    { en: 'int arithmetic: 2000 * days is fine here, but 365 days of DVD fees in int still fit — use long for money anyway.', vi: 'Số int: 2000 * số ngày ở đây vẫn vừa, nhưng tiền thì luôn dùng long.' },
  ],
  giaiThich: { en: '<p>This is the Template Method idea: the parent fixes the algorithm (compute days over, fee only if positive) and asks the subclasses for the two variable parts. Through a <code>LibraryItem</code> reference each object supplies its own loan period and tariff.</p>', vi: '<p>Đây là ý tưởng Template Method: lớp cha cố định thuật toán (tính số ngày quá hạn, chỉ tính phí khi dương) và hỏi lớp con hai phần thay đổi. Qua tham chiếu <code>LibraryItem</code>, mỗi đối tượng tự đưa thời hạn mượn và biểu phí của nó.</p>' },
});

const de3 = deJava({
  id: 'pro192-4-2-overload',
  tieuDe: { en: 'Overloading vs overriding: which method runs?', vi: 'Nạp chồng hay ghi đè: phương thức nào chạy?' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['overloading (compile time)', 'overriding (run time)', 'static vs dynamic type', 'safe downcast'],
  moTa: {
    en: `<p>Two different mechanisms with similar names. ${c('Printer')} overloads ${c('print')} — the version is chosen by the <b>declared</b> type of the argument at compile time. ${c('Shape')} subclasses override ${c('area()')} — the version is chosen by the <b>real</b> object at run time.</p>
<ul><li>Write ${c('Printer')} with ${c('String print(Shape s)')} → ${c('"shape area=12.57"')}, ${c('String print(Circle c)')} → ${c('"circle r=2.0 area=12.57"')}, ${c('String print(Object o)')} → ${c('"object " + o')} (areas with 2 decimals).</li>
<li>Write ${c('Circle extends Shape')} (radius, area πr²) and ${c('Square extends Shape')} (side, area side²), both with ${c('toString()')} → ${c('"Circle(2.0)"')} / ${c('"Square(3.0)"')}.</li>
<li>Write ${c('static double totalCircleArea(Shape[] shapes)')} in ${c('Printer')} — the area of the circles only; here you <b>may</b> test ${c('instanceof Circle')} (a legitimate use: you need Circle-only data, the radius) and must cast safely.</li></ul>`,
    vi: `<p>Hai cơ chế khác nhau có tên na ná. ${c('Printer')} nạp chồng ${c('print')} — phiên bản được chọn theo kiểu <b>khai báo</b> của đối số lúc biên dịch. Các lớp con của ${c('Shape')} ghi đè ${c('area()')} — phiên bản được chọn theo đối tượng <b>thật</b> lúc chạy.</p>
<ul><li>Viết ${c('Printer')} với ${c('String print(Shape s)')} → ${c('"shape area=12.57"')}, ${c('String print(Circle c)')} → ${c('"circle r=2.0 area=12.57"')}, ${c('String print(Object o)')} → ${c('"object " + o')} (diện tích 2 chữ số thập phân).</li>
<li>Viết ${c('Circle extends Shape')} (bán kính, diện tích πr²) và ${c('Square extends Shape')} (cạnh, diện tích cạnh²), cả hai có ${c('toString()')} → ${c('"Circle(2.0)"')} / ${c('"Square(3.0)"')}.</li>
<li>Viết ${c('static double totalCircleArea(Shape[] shapes)')} trong ${c('Printer')} — chỉ cộng diện tích hình tròn; ở đây <b>được</b> dùng ${c('instanceof Circle')} (dùng chính đáng: cần dữ liệu riêng của Circle) và phải ép kiểu an toàn.</li></ul>`,
  },
  yeuCau: { en: ['Shape.java and cham/ are given.', 'Three print methods, same name, different parameter types.'], vi: ['Shape.java và cham/ cho sẵn.', 'Ba phương thức print cùng tên, khác kiểu tham số.'] },
  dauVao: { en: 'A scenario number.', vi: 'Số kịch bản.' },
  dauRa: { en: 'Which print/area ran for each call.', vi: 'print/area nào đã chạy ở mỗi lời gọi.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        String s = new Scanner(System.in).nextLine().trim();
        Printer p = new Printer();
        Circle c = new Circle(2);
        Shape asShape = c;
        Object asObject = c;
        if (s.equals("1")) {
            System.out.println("print(c)        -> " + p.print(c));
            System.out.println("print(asShape)  -> " + p.print(asShape));
            System.out.println("print(asObject) -> " + p.print(asObject));
            System.out.println("print(square)   -> " + p.print(new Square(3)));
        } else {
            Shape[] shapes = {new Square(1), new Circle(1), new Circle(0.5), new Square(10)};
            for (Shape sh : shapes) {
                System.out.printf("%s area %.2f%n", sh, sh.area());
            }
            System.out.printf("totalCircleArea = %.4f%n", Printer.totalCircleArea(shapes));
            System.out.printf("no circle: %.4f%n", Printer.totalCircleArea(new Shape[] {new Square(2)}));
        }
    }
}
`,
  },
  tep: {
    'Shape.java': j`
// GIVEN — do not change.
public class Shape {
    public double area() {
        return 0;
    }
}
`,
    'Circle.java': j`
public class Circle extends Shape {
    private final double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    public double getRadius() {
        return radius;
    }
    //>> // TODO: area() and toString()

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }

    @Override
    public String toString() {
        return "Circle(" + radius + ")";
    }
    //<<
}
`,
    'Square.java': j`
public class Square extends Shape {
    private final double side;

    public Square(double side) {
        this.side = side;
    }
    //>> // TODO: area() and toString()

    @Override
    public double area() {
        return side * side;
    }

    @Override
    public String toString() {
        return "Square(" + side + ")";
    }
    //<<
}
`,
    'Printer.java': j`
public class Printer {
    public String print(Shape s) {
        //>> return ""; // TODO
        return String.format("shape area=%.2f", s.area());
        //<<
    }

    public String print(Circle c) {
        //>> return ""; // TODO
        return String.format("circle r=%s area=%.2f", c.getRadius(), c.area());
        //<<
    }

    public String print(Object o) {
        //>> return ""; // TODO
        return "object " + o;
        //<<
    }

    public static double totalCircleArea(Shape[] shapes) {
        //>> return 0; // TODO: instanceof Circle, then cast
        double total = 0;
        for (Shape s : shapes) {
            if (s instanceof Circle) {
                total += ((Circle) s).area();
            }
        }
        return total;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'overloading picks by declared type', vi: 'nạp chồng chọn theo kiểu khai báo' }, vao: '1\n' },
    { ten: { en: 'overriding picks by real object; safe downcast', vi: 'ghi đè chọn theo đối tượng thật; ép kiểu an toàn' }, vao: '2\n', an: true },
  ],
  goiY: [
    { en: 'p.print(asShape) calls print(Shape) even though the object is a Circle: the compiler chose the overload from the declared type Shape. Inside, s.area() still runs Circle’s area — overriding.', vi: 'p.print(asShape) gọi print(Shape) dù đối tượng là Circle: trình biên dịch chọn bản nạp chồng theo kiểu khai báo Shape. Bên trong, s.area() vẫn chạy area của Circle — ghi đè.' },
    { en: 'Downcast only after the test: if (s instanceof Circle) { Circle c = (Circle) s; … }', vi: 'Chỉ ép kiểu xuống sau khi kiểm: if (s instanceof Circle) { Circle c = (Circle) s; … }' },
  ],
  loiHayGap: [
    { en: 'Casting every Shape to Circle — the first Square throws ClassCastException.', vi: 'Ép mọi Shape sang Circle — Square đầu tiên ném ClassCastException.' },
    { en: 'Expecting print(asObject) to print "circle…" — overload resolution never looks at the runtime type.', vi: 'Tưởng print(asObject) sẽ in "circle…" — chọn bản nạp chồng không bao giờ nhìn kiểu lúc chạy.' },
    { en: 'Writing area(Circle c) in Circle instead of area() — that is an overload, not an override, and Shape.area() (0) still runs.', vi: 'Viết area(Circle c) trong Circle thay vì area() — đó là nạp chồng, không phải ghi đè, và Shape.area() (0) vẫn chạy.' },
  ],
  giaiThich: { en: '<p>Overloading is resolved by the compiler from the declared argument types; overriding is resolved by the JVM from the object’s class. So print(asShape) runs print(Shape), whose s.area() runs Circle.area(). instanceof + cast is right when you truly need a subclass-only member.</p>', vi: '<p>Nạp chồng do trình biên dịch giải theo kiểu khai báo của đối số; ghi đè do JVM giải theo lớp của đối tượng. Nên print(asShape) chạy print(Shape), trong đó s.area() chạy Circle.area(). instanceof + ép kiểu là đúng khi thật sự cần thành phần riêng của lớp con.</p>' },
});

export default moDun({ slug: 'pro192-4-2-da-hinh', ten: '4.2 Polymorphism', de: [de1, de2, de3] });
