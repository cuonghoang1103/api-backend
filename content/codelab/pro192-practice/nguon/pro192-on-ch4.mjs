/** PRO192 · 4.3 🧪 — kế thừa kiểu đề PE: lớp Spec (câu 2), sửa SpecCar của bạn, Ticket/VipTicket, is-a hay has-a. */
import { moDun, deJava, c, j, LOI_CHUNG } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-on-ch4-spec-laptop',
  tieuDe: { en: 'PE question 2: Laptop and SpecLaptop', vi: 'Câu 2 PE: Laptop và SpecLaptop' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['subclass from a UML box', 'super(...)', 'toString override', 'protected or getters/setters'],
  moTa: {
    en: `<p>Question 2 of a PE paper: a given parent and a subclass you write. ${c('Laptop')} is given. Write ${c('SpecLaptop extends Laptop')}:</p>
<pre>SpecLaptop
- ram : int
+ SpecLaptop()                                   // maker "", rate 0, ram 0
+ SpecLaptop(maker : String, rate : int, ram : int)
+ toString() : String   // "maker, rate, ram"  e.g. "Dell, 8, 16"
+ setData() : void      // maker becomes "Spec_" + maker
+ getValue() : int      // rate + ram when rate is below 5, otherwise rate * ram</pre>`,
    vi: `<p>Câu 2 của đề PE: lớp cha cho sẵn và lớp con bạn viết. ${c('Laptop')} cho sẵn. Viết ${c('SpecLaptop extends Laptop')} theo hộp UML: ${c('SpecLaptop()')} (maker "", rate 0, ram 0); ${c('SpecLaptop(maker, rate, ram)')}; ${c('toString()')} → ${c('"maker, rate, ram"')} (vd ${c('"Dell, 8, 16"')}); ${c('setData()')} đổi maker thành ${c('"Spec_" + maker')}; ${c('getValue()')} = rate + ram khi rate dưới 5, ngược lại rate * ram.</p>
<pre>SpecLaptop
- ram : int
+ SpecLaptop()
+ SpecLaptop(maker : String, rate : int, ram : int)
+ toString() : String
+ setData() : void
+ getValue() : int</pre>`,
  },
  yeuCau: { en: ['Do not change Laptop.java or Main.java.', 'Laptop’s fields are private: use its getters/setters.'], vi: ['Không sửa Laptop.java hay Main.java.', 'Trường của Laptop là private: dùng getter/setter của nó.'] },
  dauVao: { en: 'TC (1–3), maker, rate, ram — repeated.', vi: 'TC (1–3), maker, rate, ram — lặp lại.' },
  dauRa: { en: 'The given Main’s OUTPUT blocks.', vi: 'Các khối OUTPUT của Main đề cho.' },
  main: 'Main',
  tep: {
    'Laptop.java': j`
// GIVEN by the paper — do not change.
public class Laptop {
    private String maker;
    private int rate;

    public Laptop() {
        this("", 0);
    }

    public Laptop(String maker, int rate) {
        this.maker = maker;
        this.rate = rate;
    }

    public String getMaker() {
        return maker;
    }

    public void setMaker(String maker) {
        this.maker = maker;
    }

    public int getRate() {
        return rate;
    }

    @Override
    public String toString() {
        return maker + ", " + rate;
    }
}
`,
    'Main.java': j`
import java.util.Scanner;

// GIVEN by the paper — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (sc.hasNextLine()) {
            System.out.println("1. Test toString()");
            System.out.println("2. Test setData()");
            System.out.println("3. Test getValue()");
            System.out.print("Enter TC (1, 2 or 3): ");
            int tc = Integer.parseInt(sc.nextLine().trim());
            System.out.print("Enter maker, rate, ram: ");
            String maker = sc.nextLine().trim();
            int rate = Integer.parseInt(sc.nextLine().trim());
            int ram = Integer.parseInt(sc.nextLine().trim());
            SpecLaptop x = new SpecLaptop(maker, rate, ram);
            System.out.println("OUTPUT:");
            if (tc == 1) {
                System.out.println(x);
                System.out.println(new SpecLaptop());
            } else if (tc == 2) {
                x.setData();
                System.out.println(x);
            } else {
                System.out.println(x.getValue());
            }
        }
    }
}
`,
    'SpecLaptop.java': j`
public class SpecLaptop extends Laptop {
    private int ram;

    public SpecLaptop() {
        //>> // TODO
        this("", 0, 0);
        //<<
    }

    public SpecLaptop(String maker, int rate, int ram) {
        //>> // TODO: super(...) then ram
        super(maker, rate);
        this.ram = ram;
        //<<
    }

    //>> // TODO: toString(), setData(), getValue()
    @Override
    public String toString() {
        return super.toString() + ", " + ram;
    }

    public void setData() {
        setMaker("Spec_" + getMaker());
    }

    public int getValue() {
        return getRate() < 5 ? getRate() + ram : getRate() * ram;
    }
    //<<
}
`,
  },
  khoiDau: {
    'SpecLaptop.java': j`
public class SpecLaptop extends Laptop {
    private int ram;

    public SpecLaptop() {
        // TODO
    }

    public SpecLaptop(String maker, int rate, int ram) {
        // TODO: super(...) then ram
    }

    // TODO: toString() — "maker, rate, ram"

    public void setData() {
        // TODO: maker becomes "Spec_" + maker
    }

    public int getValue() {
        return 0; // TODO
    }
}
`,
  },
  ca: [
    { ten: { en: 'TC1 and TC2', vi: 'TC1 và TC2' }, vao: '1\nDell\n8\n16\n2\nAsus\n3\n8\n' },
    { ten: { en: 'TC3 on both sides of 5', vi: 'TC3 hai phía của 5' }, vao: '3\nHP\n4\n8\n3\nHP\n5\n8\n' },
    { ten: { en: 'more TC3 and TC2', vi: 'thêm TC3 và TC2' }, vao: '3\nAcer\n0\n0\n2\nSpec_X\n9\n32\n3\nMSI\n10\n64\n', an: true },
  ],
  goiY: [
    { en: 'toString: super.toString() already gives "maker, rate" — append ", " + ram.', vi: 'toString: super.toString() đã cho "maker, rate" — nối thêm ", " + ram.' },
    { en: 'setData cannot write maker directly (private in Laptop): setMaker("Spec_" + getMaker()).', vi: 'setData không gán thẳng maker được (private trong Laptop): setMaker("Spec_" + getMaker()).' },
  ],
  loiHayGap: [
    { en: 'Declaring maker and rate again in SpecLaptop — setData then changes the copy, and toString (from Laptop) prints the old maker.', vi: 'Khai báo lại maker và rate trong SpecLaptop — setData đổi bản sao, còn toString (của Laptop) in maker cũ.' },
    { en: 'rate <= 5 instead of rate < 5 — the boundary case 5 is computed with the wrong formula.', vi: 'rate <= 5 thay vì rate < 5 — ca biên 5 tính sai công thức.' },
    LOI_CHUNG.inThem,
  ],
  giaiThich: { en: '<p>The subclass adds one field and reaches the parent’s private data only through its public methods. toString extends the parent’s text, setData uses the setter, and getValue reads the rate through the getter.</p>', vi: '<p>Lớp con thêm một trường và chỉ chạm dữ liệu private của cha qua phương thức public của nó. toString nối tiếp chuỗi của cha, setData dùng setter, getValue đọc rate qua getter.</p>' },
});

const de2 = deJava({
  id: 'pro192-on-ch4-fix-speccar',
  tieuDe: { en: 'Fix a classmate’s SpecCar: four inheritance compile errors', vi: 'Sửa SpecCar của bạn cùng lớp: bốn lỗi biên dịch kế thừa' },
  doKho: 'MEDIUM', phut: 15,
  khaiNiem: ['implicit super()', 'private is not inherited for access', 'weaker access in override', 'override return type'],
  khoiDauLoi: true,
  moTa: {
    en: `<p>A classmate’s ${c('SpecCar.java')} does not compile. ${c('Car.java')} and ${c('Main.java')} are correct and must not change. Read each ${c('javac')} error, name the rule behind it, and fix ${c('SpecCar')} so the program prints the expected output:</p>
<ul><li>a constructor that never calls ${c('super(...)')} while ${c('Car')} has no no-argument constructor;</li>
<li>direct use of a ${c('private')} field of ${c('Car')};</li>
<li>an override that makes a ${c('public')} method ${c('protected')};</li>
<li>an override that changes the return type.</li></ul>
<p>Expected behaviour: ${c('getPrice()')} of a SpecCar = the car’s price + 15% (rounded down); ${c('describe()')} = Car’s text + ${c('" [sport]"')}.</p>`,
    vi: `<p>${c('SpecCar.java')} của một bạn không biên dịch được. ${c('Car.java')} và ${c('Main.java')} đúng và không được sửa. Đọc từng lỗi ${c('javac')}, gọi tên luật đứng sau nó, rồi sửa ${c('SpecCar')} để chương trình in đúng output:</p>
<ul><li>constructor không gọi ${c('super(...)')} trong khi ${c('Car')} không có constructor không tham số;</li>
<li>dùng thẳng trường ${c('private')} của ${c('Car')};</li>
<li>ghi đè làm phương thức ${c('public')} thành ${c('protected')};</li>
<li>ghi đè đổi kiểu trả về.</li></ul>
<p>Hành vi đúng: ${c('getPrice()')} của SpecCar = giá xe + 15% (làm tròn xuống); ${c('describe()')} = chuỗi của Car + ${c('" [sport]"')}.</p>`,
  },
  yeuCau: { en: ['Change only SpecCar.java.'], vi: ['Chỉ sửa SpecCar.java.'] },
  dauVao: { en: 'None.', vi: 'Không có.' },
  dauRa: { en: 'Prices and descriptions printed by Main.', vi: 'Giá và mô tả do Main in.' },
  main: 'Main',
  tep: {
    'Car.java': j`
// Correct — do not change.
public class Car {
    private final String model;
    private final long price;

    public Car(String model, long price) {
        this.model = model;
        this.price = price;
    }

    public long getPrice() {
        return price;
    }

    public String describe() {
        return model + " " + price;
    }
}
`,
    'Main.java': j`
// Correct — do not change.
public class Main {
    public static void main(String[] args) {
        Car[] cars = {new Car("Vios", 500_000_000L), new SpecCar("Mazda 3", 700_000_000L), new SpecCar("Kia K3", 1)};
        for (Car car : cars) {
            System.out.println(car.describe() + " -> " + car.getPrice());
        }
    }
}
`,
    'SpecCar.java': j`
public class SpecCar extends Car {
    //>> public SpecCar(String model, long price) { ⏎     } ⏎ ⏎     @Override ⏎     public long getPrice() { ⏎         return price + price * 15 / 100; ⏎     } ⏎ ⏎     @Override ⏎     protected String describe() { ⏎         return super.describe() + " [sport]"; ⏎     } ⏎ ⏎     @Override ⏎     public Integer hashCode() { ⏎         return 1; ⏎     }
    public SpecCar(String model, long price) {
        super(model, price);
    }

    @Override
    public long getPrice() {
        long base = super.getPrice();
        return base + base * 15 / 100;
    }

    @Override
    public String describe() {
        return super.describe() + " [sport]";
    }
    //<<
}
`,
  },
  ca: [{ ten: { en: 'the three cars', vi: 'ba chiếc xe' }, vao: '' }],
  goiY: [
    { en: 'Compile and read the errors from the top: "constructor Car in class Car cannot be applied", "price has private access in Car", "attempting to assign weaker access privileges", "return type Integer is not compatible with int".', vi: 'Biên dịch và đọc lỗi từ trên xuống: "constructor Car in class Car cannot be applied", "price has private access in Car", "attempting to assign weaker access privileges", "return type Integer is not compatible with int".' },
    { en: 'Private fields of the parent exist in the object but are not accessible from the subclass: use super.getPrice(). hashCode() must keep Object’s return type int — and SpecCar does not need it at all: delete it.', vi: 'Trường private của cha có trong đối tượng nhưng lớp con không truy cập được: dùng super.getPrice(). hashCode() phải giữ kiểu trả về int như Object — mà SpecCar cũng không cần nó: xoá đi.' },
  ],
  loiHayGap: [
    { en: 'Fixing "private access" by making Car.price public — Car must not change, and that breaks its encapsulation.', vi: 'Sửa lỗi "private access" bằng cách cho Car.price public — Car không được sửa, và làm thế phá đóng gói của nó.' },
    { en: 'Calling getPrice() instead of super.getPrice() inside the override — infinite recursion, StackOverflowError.', vi: 'Gọi getPrice() thay vì super.getPrice() trong bản ghi đè — đệ quy vô hạn, StackOverflowError.' },
  ],
  giaiThich: { en: '<p>Four rules: a subclass constructor must call an existing parent constructor; private members are not accessible from subclasses; an override cannot reduce visibility; an override keeps a compatible return type (or it is a different method, and @Override then fails). The fixed class reaches the price through super.getPrice().</p>', vi: '<p>Bốn luật: constructor lớp con phải gọi một constructor có thật của cha; thành phần private không truy cập được từ lớp con; ghi đè không được thu hẹp mức truy cập; ghi đè giữ kiểu trả về tương thích (không thì là phương thức khác, và @Override báo lỗi). Lớp đã sửa lấy giá qua super.getPrice().</p>' },
});

const de3 = deJava({
  id: 'pro192-on-ch4-ticket',
  tieuDe: { en: 'PE question 2 with numbers: Ticket and VipTicket', vi: 'Câu 2 PE có số: Ticket và VipTicket' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['override a computation', 'super.getPrice()', 'polymorphic total'],
  moTa: {
    en: `<p>${c('Ticket(String code, long price)')} with ${c('getPrice()')} and ${c('toString()')} → ${c('"T01 120000"')} is given. Write ${c('VipTicket extends Ticket')}:</p>
<ul><li>${c('VipTicket(String code, long price, boolean lounge)')};</li>
<li>${c('getPrice()')} = the base price × 1.5 (rounded down) + 200 000 when ${c('lounge')} is true;</li>
<li>${c('toString()')} = ${c('"VIP " + super.toString() + " lounge"')} (the word ${c('lounge')} only when true) — note that Ticket’s toString prints ${c('getPrice()')}, so the VIP price appears automatically.</li></ul>
<p>Then complete ${c('static long total(Ticket[] tickets)')} in ${c('Main')}.</p>`,
    vi: `<p>${c('Ticket(String code, long price)')} với ${c('getPrice()')} và ${c('toString()')} → ${c('"T01 120000"')} cho sẵn. Viết ${c('VipTicket extends Ticket')}:</p>
<ul><li>${c('VipTicket(String code, long price, boolean lounge)')};</li>
<li>${c('getPrice()')} = giá gốc × 1.5 (làm tròn xuống) + 200 000 khi ${c('lounge')} là true;</li>
<li>${c('toString()')} = ${c('"VIP " + super.toString() + " lounge"')} (chữ ${c('lounge')} chỉ khi true) — để ý toString của Ticket in ${c('getPrice()')}, nên giá VIP tự hiện ra.</li></ul>
<p>Rồi hoàn thành ${c('static long total(Ticket[] tickets)')} trong ${c('Main')}.</p>`,
  },
  yeuCau: { en: ['Do not change Ticket.java.'], vi: ['Không sửa Ticket.java.'] },
  dauVao: { en: 'n, then lines T code price or V code price lounge(true/false).', vi: 'n, rồi các dòng T mã giá hoặc V mã giá lounge(true/false).' },
  dauRa: { en: 'Each ticket, then "Total: …".', vi: 'Từng vé, rồi "Total: …".' },
  main: 'Main',
  tep: {
    'Ticket.java': j`
// GIVEN — do not change.
public class Ticket {
    private final String code;
    private final long price;

    public Ticket(String code, long price) {
        this.code = code;
        this.price = price;
    }

    public String getCode() {
        return code;
    }

    public long getPrice() {
        return price;
    }

    @Override
    public String toString() {
        return code + " " + getPrice();
    }
}
`,
    'VipTicket.java': j`
public class VipTicket extends Ticket {
    private final boolean lounge;

    public VipTicket(String code, long price, boolean lounge) {
        super(code, price);
        this.lounge = lounge;
    }
    //>> // TODO: getPrice() and toString()

    @Override
    public long getPrice() {
        long base = super.getPrice();
        return base * 3 / 2 + (lounge ? 200_000 : 0);
    }

    @Override
    public String toString() {
        return "VIP " + super.toString() + (lounge ? " lounge" : "");
    }
    //<<
}
`,
    'Main.java': j`
import java.util.Scanner;

public class Main {
    static long total(Ticket[] tickets) {
        //>> return 0; // TODO
        long sum = 0;
        for (Ticket t : tickets) {
            sum += t.getPrice();
        }
        return sum;
        //<<
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        Ticket[] tickets = new Ticket[n];
        for (int i = 0; i < n; i++) {
            String[] p = sc.nextLine().trim().split("\\s+");
            tickets[i] = p[0].equals("V") ? new VipTicket(p[1], Long.parseLong(p[2]), Boolean.parseBoolean(p[3]))
                    : new Ticket(p[1], Long.parseLong(p[2]));
            System.out.println(tickets[i]);
        }
        System.out.println("Total: " + total(tickets));
    }
}
`,
  },
  ca: [
    { ten: { en: 'normal and VIP tickets', vi: 'vé thường và vé VIP' }, vao: '3\nT T01 120000\nV V01 120000 true\nV V02 99999 false\n' },
    { ten: { en: 'odd prices round down', vi: 'giá lẻ làm tròn xuống' }, vao: '2\nV V03 1 true\nV V04 3 false\n', an: true },
    { ten: { en: 'no ticket', vi: 'không có vé' }, vao: '0\n', an: true },
  ],
  goiY: [
    { en: 'base * 3 / 2 is "× 1.5 rounded down" in integer arithmetic.', vi: 'base * 3 / 2 là "× 1.5 làm tròn xuống" bằng số nguyên.' },
    { en: 'Ticket.toString calls getPrice() — inside it, that call is dynamically bound to VipTicket.getPrice(), so you do not reprint the price yourself.', vi: 'Ticket.toString gọi getPrice() — trong đó lời gọi ràng buộc động tới VipTicket.getPrice(), nên không cần tự in lại giá.' },
  ],
  loiHayGap: [
    { en: 'base * 1.5 as double then (long) — fine here, but "× 1.5 + 200000" with doubles invites rounding surprises on money.', vi: 'base * 1.5 kiểu double rồi ép (long) — ở đây được, nhưng tiền tính bằng double dễ lệch làm tròn.' },
    { en: 'Printing "VIP V01 120000" with the base price because toString was rebuilt from the field instead of super.toString().', vi: 'In "VIP V01 120000" với giá gốc vì toString dựng lại từ trường thay vì super.toString().' },
  ],
  giaiThich: { en: '<p>Overriding getPrice changes every place that asks for the price — including the parent’s own toString and the polymorphic total — without touching them. That is the payoff of dynamic binding.</p>', vi: '<p>Ghi đè getPrice làm đổi mọi chỗ hỏi giá — kể cả toString của chính lớp cha và tổng đa hình — mà không phải sửa chúng. Đó là lợi ích của ràng buộc động.</p>' },
});

const de4 = deJava({
  id: 'pro192-on-ch4-has-a',
  tieuDe: { en: 'Is-a or has-a? Replace inheritance with composition', vi: 'Is-a hay has-a? Thay kế thừa bằng thành phần' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['composition', 'delegation', 'is-a test', 'design smell'],
  moTa: {
    en: `<p>${c('Car extends Engine')} compiles, but a car <b>is not</b> an engine — it <b>has</b> one. The inheritance leaks Engine’s methods into Car’s API (${c('car.setHorsePower(-5)')} works!) and makes it impossible to swap the engine. Refactor:</p>
<ul><li>${c('Car')} no longer extends ${c('Engine')}; it keeps a private ${c('Engine')} field (composition).</li>
<li>${c('Car(String model, Engine engine)')}; ${c('start()')} delegates to the engine and returns ${c('"Vios: " + engine.start()')}; ${c('int horsePower()')} delegates; ${c('void replaceEngine(Engine e)')}.</li>
<li>${c('Engine')} and ${c('ElectricEngine extends Engine')} stay as given — an electric engine really <b>is an</b> engine.</li></ul>`,
    vi: `<p>${c('Car extends Engine')} biên dịch được, nhưng xe <b>không phải là</b> động cơ — xe <b>có</b> động cơ. Kế thừa làm phương thức của Engine lọt vào API của Car (${c('car.setHorsePower(-5)')} chạy được!) và không thay được động cơ. Hãy tái cấu trúc:</p>
<ul><li>${c('Car')} không còn extends ${c('Engine')}; nó giữ một trường private kiểu ${c('Engine')} (thành phần).</li>
<li>${c('Car(String model, Engine engine)')}; ${c('start()')} uỷ quyền cho động cơ và trả ${c('"Vios: " + engine.start()')}; ${c('int horsePower()')} uỷ quyền; ${c('void replaceEngine(Engine e)')}.</li>
<li>${c('Engine')} và ${c('ElectricEngine extends Engine')} giữ nguyên — động cơ điện thật sự <b>là một</b> động cơ.</li></ul>`,
  },
  yeuCau: { en: ['Do not change Engine.java or ElectricEngine.java.'], vi: ['Không sửa Engine.java hay ElectricEngine.java.'] },
  dauVao: { en: 'A scenario number.', vi: 'Số kịch bản.' },
  dauRa: { en: 'Car’s structure by reflection, then start() before and after replacing the engine.', vi: 'Cấu trúc Car qua reflection, rồi start() trước và sau khi thay động cơ.' },
  main: 'KiemTra', kiem: true,
  harness: {
    'KiemTra.java': j`
import java.lang.reflect.Field;
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        new Scanner(System.in).nextLine();
        System.out.println(Kiem.kieu("Car"));
        boolean hasEngine = false;
        for (Field f : Kiem.lop("Car").getDeclaredFields()) {
            if (f.getType() == Engine.class && java.lang.reflect.Modifier.isPrivate(f.getModifiers())) {
                hasEngine = true;
            }
        }
        System.out.println("Car has a private Engine field: " + hasEngine);
        System.out.println("Car exposes setHorsePower: " + !Kiem.goi(Kiem.tao("Car", "X", new Engine(1)), "setHorsePower", Integer.valueOf(5)).startsWith("MISSING"));
        Object car = Kiem.tao("Car", "Vios", new Engine(107));
        System.out.println(Kiem.goi(car, "start") + " | hp " + Kiem.goi(car, "horsePower"));
        Kiem.goi(car, "replaceEngine", new ElectricEngine(150, 42));
        System.out.println(Kiem.goi(car, "start") + " | hp " + Kiem.goi(car, "horsePower"));
    }
}
`,
  },
  tep: {
    'Engine.java': j`
// GIVEN — do not change.
public class Engine {
    private int horsePower;

    public Engine(int horsePower) {
        this.horsePower = horsePower;
    }

    public int getHorsePower() {
        return horsePower;
    }

    public void setHorsePower(int horsePower) {
        this.horsePower = horsePower;
    }

    public String start() {
        return "vroom (" + horsePower + " hp)";
    }
}
`,
    'ElectricEngine.java': j`
// GIVEN — do not change. An electric engine IS an engine: inheritance is right here.
public class ElectricEngine extends Engine {
    private final int batteryKwh;

    public ElectricEngine(int horsePower, int batteryKwh) {
        super(horsePower);
        this.batteryKwh = batteryKwh;
    }

    @Override
    public String start() {
        return "hum (" + getHorsePower() + " hp, " + batteryKwh + " kWh)";
    }
}
`,
    'Car.java': j`
//>> public class Car extends Engine { // TODO: a car HAS an engine — refactor ⏎     private final String model; ⏎  ⏎     public Car(String model, Engine engine) { ⏎         super(engine.getHorsePower()); ⏎         this.model = model; ⏎     } ⏎  ⏎     @Override ⏎     public String start() { ⏎         return model + ": " + super.start(); ⏎     } ⏎  ⏎     public int horsePower() { ⏎         return getHorsePower(); ⏎     } ⏎  ⏎     public void replaceEngine(Engine e) { ⏎         setHorsePower(e.getHorsePower()); ⏎     } ⏎ }
public class Car {
    private final String model;
    private Engine engine;

    public Car(String model, Engine engine) {
        this.model = model;
        this.engine = engine;
    }

    public String start() {
        return model + ": " + engine.start();
    }

    public int horsePower() {
        return engine.getHorsePower();
    }

    public void replaceEngine(Engine e) {
        this.engine = e;
    }
}
//<<
`,
  },
  ca: [{ ten: { en: 'structure and engine swap', vi: 'cấu trúc và thay động cơ' }, vao: '1\n' }],
  goiY: [
    { en: 'The "is-a" test: can you say "every Car is an Engine" and mean it? No — so use a field, not extends.', vi: 'Phép thử "is-a": nói "mọi Car là một Engine" có đúng không? Không — vậy dùng trường, không dùng extends.' },
    { en: 'Delegation: Car’s start() calls engine.start(); replaceEngine just assigns a new Engine object (an ElectricEngine is accepted because it IS an Engine).', vi: 'Uỷ quyền: start() của Car gọi engine.start(); replaceEngine chỉ gán đối tượng Engine mới (ElectricEngine được nhận vì nó LÀ Engine).' },
  ],
  loiHayGap: [
    { en: 'Keeping extends Engine "and" adding a field — Car still exposes setHorsePower.', vi: 'Giữ extends Engine "và" thêm trường — Car vẫn lộ setHorsePower.' },
    { en: 'Copying the horse power into Car (an int field) instead of keeping the Engine object — the electric engine’s own start() text is lost.', vi: 'Chép mã lực vào Car (trường int) thay vì giữ đối tượng Engine — mất chuỗi start() riêng của động cơ điện.' },
  ],
  giaiThich: { en: '<p>Inheritance is for "is-a" (ElectricEngine is an Engine); composition is for "has-a" (Car has an Engine). With a field, Car exposes only what a car should do, and the engine can be replaced at run time — even by a subclass, thanks to polymorphism.</p>', vi: '<p>Kế thừa dành cho "is-a" (ElectricEngine là một Engine); thành phần dành cho "has-a" (Car có một Engine). Với một trường, Car chỉ lộ những gì xe nên làm, và động cơ thay được lúc chạy — kể cả bằng lớp con, nhờ đa hình.</p>' },
});

export default moDun({ slug: 'pro192-on-ch4', ten: '4.3 🧪 Practice — inheritance the PE way: Spec classes, fixing overrides, composition', de: [de1, de2, de3, de4] });
