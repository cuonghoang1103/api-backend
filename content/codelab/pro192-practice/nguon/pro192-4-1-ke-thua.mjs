/** PRO192 · 4.1 — Inheritance: extends, super(...), ghi đè gọi super.method(), chuỗi constructor nhiều tầng. */
import { moDun, deJava, c, j } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-4-1-person-student',
  tieuDe: { en: 'Person → Student: extends and super(...)', vi: 'Person → Student: extends và super(...)' },
  doKho: 'EASY', phut: 15,
  khaiNiem: ['extends', 'super(...)', 'inherited methods', 'super.toString()'],
  moTa: {
    en: `<p>${c('Person')} is given. Write ${c('Student extends Person')}:</p>
<ul><li>an extra private field ${c('double gpa')};</li>
<li>${c('Student(String name, int birthYear, double gpa)')} — the name and year go to the parent with ${c('super(name, birthYear)')} (Person’s fields are private: Student cannot touch them directly);</li>
<li>${c('double getGpa()')}; ${c('boolean isHonours()')} — GPA ≥ 8.0;</li>
<li>${c('toString()')} overrides Person’s and <b>reuses</b> it: ${c('super.toString() + ", GPA 8.50"')} (two decimals).</li></ul>`,
    vi: `<p>${c('Person')} cho sẵn. Viết ${c('Student extends Person')}:</p>
<ul><li>thêm trường private ${c('double gpa')};</li>
<li>${c('Student(String name, int birthYear, double gpa)')} — tên và năm sinh giao cho lớp cha bằng ${c('super(name, birthYear)')} (trường của Person là private: Student không chạm trực tiếp được);</li>
<li>${c('double getGpa()')}; ${c('boolean isHonours()')} — GPA ≥ 8.0;</li>
<li>${c('toString()')} ghi đè của Person và <b>dùng lại</b> nó: ${c('super.toString() + ", GPA 8.50"')} (hai chữ số thập phân).</li></ul>`,
  },
  yeuCau: { en: ['Do not change Person.java.', '@Override on toString().'], vi: ['Không sửa Person.java.', '@Override trên toString().'] },
  dauVao: { en: 'Lines name;birthYear;gpa.', vi: 'Các dòng tên;năm sinh;gpa.' },
  dauRa: { en: 'The structure seen by reflection, then each student.', vi: 'Cấu trúc soi bằng reflection, rồi từng sinh viên.' },
  main: 'KiemTra', kiem: true,
  quyTac: [{ id: 'R1', en: 'Student calls super(...) and super.toString()', vi: 'Student gọi super(...) và super.toString()', re: String.raw`super\s*\([\s\S]*super\s*\.\s*toString\s*\(`, file: 'Student', need: true }],
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(Kiem.kieu("Student"));
        System.out.println(Kiem.tatCaPrivate("Student"));
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split(";");
            Object s = Kiem.tao("Student", p[0], Integer.valueOf(p[1]), Double.valueOf(p[2]));
            System.out.println(Kiem.goi(s, "toString") + " | age in 2026: " + Kiem.goi(s, "ageIn", Integer.valueOf(2026))
                    + " | honours: " + Kiem.goi(s, "isHonours"));
        }
    }
}
`,
  },
  tep: {
    'Person.java': j`
// GIVEN — do not change.
public class Person {
    private final String name;
    private final int birthYear;

    public Person(String name, int birthYear) {
        this.name = name;
        this.birthYear = birthYear;
    }

    public String getName() {
        return name;
    }

    public int ageIn(int year) {
        return year - birthYear;
    }

    @Override
    public String toString() {
        return name + " (" + birthYear + ")";
    }
}
`,
    'Student.java': j`
//>> public class Student { // TODO: extends Person ⏎     public Student(String name, int birthYear, double gpa) { ⏎     } ⏎ }
public class Student extends Person {
    private final double gpa;

    public Student(String name, int birthYear, double gpa) {
        super(name, birthYear);
        this.gpa = gpa;
    }

    public double getGpa() {
        return gpa;
    }

    public boolean isHonours() {
        return gpa >= 8.0;
    }

    @Override
    public String toString() {
        return super.toString() + String.format(", GPA %.2f", gpa);
    }
}
//<<
`,
  },
  ca: [
    { ten: { en: 'two students', vi: 'hai sinh viên' }, vao: 'Nguyen An;2005;8.5\nTran Binh;2004;7.25\n' },
    { ten: { en: 'the 8.0 boundary', vi: 'biên 8.0' }, vao: 'Le Chi;2006;8\nPham Dung;2003;7.999\n', an: true },
  ],
  goiY: [
    { en: 'The first statement of the Student constructor is super(name, birthYear); then this.gpa = gpa.', vi: 'Câu đầu tiên trong constructor của Student là super(name, birthYear); rồi this.gpa = gpa.' },
    { en: 'ageIn and getName are inherited — Student gets them without writing anything.', vi: 'ageIn và getName được kế thừa — Student có chúng mà không phải viết gì.' },
  ],
  loiHayGap: [
    { en: 'Forgetting super(...) — Java inserts super() and Person has no no-argument constructor, so it does not compile.', vi: 'Quên super(...) — Java tự chèn super() mà Person không có constructor không tham số, nên không biên dịch được.' },
    { en: 'Re-declaring name and birthYear in Student — two copies of the same data; the parent’s stay empty.', vi: 'Khai báo lại name và birthYear trong Student — hai bản dữ liệu; bản của lớp cha vẫn rỗng.' },
    { en: 'Rebuilding the parent’s text by hand instead of super.toString() — the format drifts when Person changes.', vi: 'Tự dựng lại chuỗi của lớp cha thay vì super.toString() — định dạng lệch khi Person đổi.' },
  ],
  giaiThich: { en: '<p>A subclass extends both data and behaviour: Person keeps its private fields and its constructor initialises them (via super), Student adds gpa and refines toString by calling the parent’s version first.</p>', vi: '<p>Lớp con mở rộng cả dữ liệu lẫn hành vi: Person giữ trường private và constructor của nó khởi tạo chúng (qua super), Student thêm gpa và tinh chỉnh toString bằng cách gọi bản của lớp cha trước.</p>' },
});

const de2 = deJava({
  id: 'pro192-4-1-manager',
  tieuDe: { en: 'Employee → Manager: override and call the parent', vi: 'Employee → Manager: ghi đè và gọi lớp cha' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['method overriding', 'super.method()', '@Override', 'protected vs private'],
  moTa: {
    en: `<p>${c('Employee')} is given: ${c('getSalary()')} = base salary + 200 000 per year of service. Write ${c('Manager extends Employee')}:</p>
<ul><li>${c('Manager(String name, long baseSalary, int years, int teamSize)')};</li>
<li>${c('getSalary()')} <b>overrides</b> the parent: ${c('super.getSalary()')} + 500 000 per team member, + 10% of that total when the team has more than 10 people (rounded down);</li>
<li>${c('String role()')} overrides the parent and returns ${c('"Manager of 12"')}.</li></ul>
<p>The test class calls everything through an ${c('Employee')} variable — the overriding version must run.</p>`,
    vi: `<p>${c('Employee')} cho sẵn: ${c('getSalary()')} = lương cơ bản + 200 000 mỗi năm thâm niên. Viết ${c('Manager extends Employee')}:</p>
<ul><li>${c('Manager(String name, long baseSalary, int years, int teamSize)')};</li>
<li>${c('getSalary()')} <b>ghi đè</b> lớp cha: ${c('super.getSalary()')} + 500 000 mỗi thành viên nhóm, + 10% của tổng đó khi nhóm hơn 10 người (làm tròn xuống);</li>
<li>${c('String role()')} ghi đè lớp cha, trả ${c('"Manager of 12"')}.</li></ul>
<p>Lớp kiểm gọi mọi thứ qua biến kiểu ${c('Employee')} — bản ghi đè phải là bản chạy.</p>`,
  },
  yeuCau: { en: ['Do not change Employee.java.', 'getSalary reuses super.getSalary() (no copy of the seniority formula).'], vi: ['Không sửa Employee.java.', 'getSalary dùng lại super.getSalary() (không chép công thức thâm niên).'] },
  dauVao: { en: 'Lines E;name;base;years or M;name;base;years;team.', vi: 'Các dòng E;tên;lương;năm hoặc M;tên;lương;năm;nhóm.' },
  dauRa: { en: 'Each employee as seen through an Employee variable, then the total payroll.', vi: 'Từng nhân viên nhìn qua biến Employee, rồi tổng quỹ lương.' },
  main: 'KiemTra', kiem: true,
  quyTac: [
    { id: 'R1', en: 'Manager.getSalary uses super.getSalary()', vi: 'Manager.getSalary dùng super.getSalary()', re: String.raw`super\s*\.\s*getSalary\s*\(`, file: 'Manager', need: true },
    { id: 'R2', en: '@Override on every overriding method', vi: '@Override trên mọi phương thức ghi đè', re: String.raw`@Override\s+public\s+\w+\s+(getSalary|role)\s*\([\s\S]*@Override\s+public\s+\w+\s+(getSalary|role)\s*\(`, file: 'Manager', need: true },
  ],
  harness: {
    'KiemTra.java': j`
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(Kiem.kieu("Manager"));
        System.out.println(Kiem.phuongThuc("Manager", "getSalary", 0) + " | " + Kiem.phuongThuc("Manager", "role", 0));
        List<Employee> staff = new ArrayList<>();
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split(";");
            Object e = p[0].equals("E") ? new Employee(p[1], Long.parseLong(p[2]), Integer.parseInt(p[3]))
                    : Kiem.tao("Manager", p[1], Long.valueOf(p[2]), Integer.valueOf(p[3]), Integer.valueOf(p[4]));
            if (e instanceof Employee) {
                staff.add((Employee) e);
            }
        }
        long total = 0;
        for (Employee e : staff) {
            System.out.println(e.getName() + " | " + e.role() + " | " + e.getSalary());
            total += e.getSalary();
        }
        System.out.println("Total payroll: " + total);
    }
}
`,
  },
  tep: {
    'Employee.java': j`
// GIVEN — do not change.
public class Employee {
    private final String name;
    private final long baseSalary;
    private final int years;

    public Employee(String name, long baseSalary, int years) {
        this.name = name;
        this.baseSalary = baseSalary;
        this.years = years;
    }

    public String getName() {
        return name;
    }

    public long getSalary() {
        return baseSalary + 200_000L * years;
    }

    public String role() {
        return "Staff";
    }
}
`,
    'Manager.java': j`
public class Manager extends Employee {
    private final int teamSize;

    public Manager(String name, long baseSalary, int years, int teamSize) {
        super(name, baseSalary, years);
        this.teamSize = teamSize;
    }

    //>> // TODO: override getSalary() and role()
    @Override
    public long getSalary() {
        long total = super.getSalary() + 500_000L * teamSize;
        return teamSize > 10 ? total + total / 10 : total;
    }

    @Override
    public String role() {
        return "Manager of " + teamSize;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'staff and two managers', vi: 'nhân viên và hai quản lý' }, vao: 'E;An;10000000;3\nM;Binh;20000000;5;4\nM;Chi;25000000;10;12\n' },
    { ten: { en: 'team of exactly 10 and of 11', vi: 'nhóm đúng 10 và 11 người' }, vao: 'M;Dung;10000000;0;10\nM;Em;10000000;0;11\nE;Giang;0;0\n', an: true },
  ],
  goiY: [
    { en: 'super.getSalary() runs the PARENT’s version even though this object is a Manager — that is how you reuse the seniority rule.', vi: 'super.getSalary() chạy bản của LỚP CHA dù đối tượng là Manager — đó là cách dùng lại luật thâm niên.' },
    { en: 'Calling getSalary() (without super) inside getSalary() calls itself forever — StackOverflowError.', vi: 'Gọi getSalary() (không có super) bên trong getSalary() là tự gọi mãi — StackOverflowError.' },
  ],
  loiHayGap: [
    { en: 'Copying baseSalary + 200000 * years into Manager — impossible anyway (private fields) and a second copy of the rule.', vi: 'Chép baseSalary + 200000 * years sang Manager — vốn không làm được (trường private) và là bản thứ hai của luật.' },
    { en: 'teamSize >= 10 instead of > 10 — a team of exactly 10 gets the bonus.', vi: 'teamSize >= 10 thay vì > 10 — nhóm đúng 10 người cũng được thưởng.' },
    { en: 'Overloading by mistake (getSalary(int) or a different return type) — the parent version still runs through an Employee variable. @Override catches it at compile time.', vi: 'Vô tình nạp chồng (getSalary(int) hay kiểu trả về khác) — qua biến Employee vẫn chạy bản cha. @Override bắt lỗi này lúc biên dịch.' },
  ],
  giaiThich: { en: '<p>Overriding replaces the behaviour for Manager objects; <code>super.getSalary()</code> lets the override build on the parent’s rule instead of duplicating it. Through an <code>Employee</code> variable Java still picks the object’s own version — dynamic binding.</p>', vi: '<p>Ghi đè thay hành vi cho đối tượng Manager; <code>super.getSalary()</code> cho bản ghi đè xây trên luật của lớp cha thay vì chép lại. Qua biến <code>Employee</code>, Java vẫn chọn bản của chính đối tượng — ràng buộc động.</p>' },
});

const de3 = deJava({
  id: 'pro192-4-1-vehicle-chain',
  tieuDe: { en: 'Three levels: Vehicle → Car → ElectricCar', vi: 'Ba tầng: Vehicle → Car → ElectricCar' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['multi-level inheritance', 'constructor chaining up the hierarchy', 'super.describe()', 'protected getter'],
  moTa: {
    en: `<p>Write three classes, each adding one thing and reusing the level above:</p>
<ul><li>${c('Vehicle(String plate, int maxSpeed)')} — ${c('describe()')} → ${c('"29A-12345, max 180 km/h"')}; ${c('int range()')} → 0 (unknown).</li>
<li>${c('Car extends Vehicle')}: ${c('Car(String plate, int maxSpeed, int seats)')} — ${c('describe()')} = parent text + ${c('", 5 seats"')}.</li>
<li>${c('ElectricCar extends Car')}: ${c('ElectricCar(String plate, int maxSpeed, int seats, int batteryKwh)')} — ${c('describe()')} = parent text + ${c('", 75 kWh"')}; ${c('range()')} = ${c('batteryKwh * 6')} km.</li></ul>
<p>Every constructor passes the common values up with ${c('super(...)')}; every ${c('describe()')} starts with ${c('super.describe()')}. The plate is stored upper-case.</p>`,
    vi: `<p>Viết ba lớp, mỗi lớp thêm một thứ và dùng lại tầng trên:</p>
<ul><li>${c('Vehicle(String plate, int maxSpeed)')} — ${c('describe()')} → ${c('"29A-12345, max 180 km/h"')}; ${c('int range()')} → 0 (chưa biết).</li>
<li>${c('Car extends Vehicle')}: ${c('Car(String plate, int maxSpeed, int seats)')} — ${c('describe()')} = chuỗi của cha + ${c('", 5 seats"')}.</li>
<li>${c('ElectricCar extends Car')}: ${c('ElectricCar(String plate, int maxSpeed, int seats, int batteryKwh)')} — ${c('describe()')} = chuỗi của cha + ${c('", 75 kWh"')}; ${c('range()')} = ${c('batteryKwh * 6')} km.</li></ul>
<p>Mỗi constructor đẩy các giá trị chung lên bằng ${c('super(...)')}; mỗi ${c('describe()')} bắt đầu bằng ${c('super.describe()')}. Biển số lưu viết hoa.</p>`,
  },
  yeuCau: { en: ['All fields private.', 'Each subclass declares only its own new field.'], vi: ['Mọi trường private.', 'Mỗi lớp con chỉ khai báo trường mới của chính nó.'] },
  dauVao: { en: 'Lines V;plate;speed · C;plate;speed;seats · E;plate;speed;seats;kwh.', vi: 'Các dòng V;biển;tốc độ · C;…;ghế · E;…;ghế;kWh.' },
  dauRa: { en: 'Structure, then describe() and range() through a Vehicle variable.', vi: 'Cấu trúc, rồi describe() và range() qua biến Vehicle.' },
  main: 'KiemTra', kiem: true,
  quyTac: [{ id: 'R1', en: 'Car and ElectricCar reuse super.describe()', vi: 'Car và ElectricCar dùng lại super.describe()', re: String.raw`super\s*\.\s*describe\s*\(`, file: '^(Car|ElectricCar)\\.java$', need: true }],
  harness: {
    'KiemTra.java': j`
import java.util.Scanner;

// Grader test class (do not edit).
public class KiemTra {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        for (String k : new String[] {"Vehicle", "Car", "ElectricCar"}) {
            System.out.println(Kiem.kieu(k) + " | " + Kiem.tatCaPrivate(k));
        }
        System.out.println(Kiem.truong("Car") + " / " + Kiem.truong("ElectricCar"));
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split(";");
            Object v = p[0].equals("V") ? Kiem.tao("Vehicle", p[1], Integer.valueOf(p[2]))
                    : p[0].equals("C") ? Kiem.tao("Car", p[1], Integer.valueOf(p[2]), Integer.valueOf(p[3]))
                    : Kiem.tao("ElectricCar", p[1], Integer.valueOf(p[2]), Integer.valueOf(p[3]), Integer.valueOf(p[4]));
            System.out.println(Kiem.goi(v, "describe") + " | range " + Kiem.goi(v, "range"));
        }
    }
}
`,
  },
  tep: {
    'Vehicle.java': j`
public class Vehicle {
    private final String plate;
    private final int maxSpeed;

    public Vehicle(String plate, int maxSpeed) {
        //>> this.plate = plate; ⏎ this.maxSpeed = maxSpeed; // TODO: upper case
        this.plate = plate.trim().toUpperCase();
        this.maxSpeed = maxSpeed;
        //<<
    }

    public String describe() {
        return plate + ", max " + maxSpeed + " km/h";
    }

    public int range() {
        return 0;
    }
}
`,
    'Car.java': j`
//>> public class Car extends Vehicle { // TODO ⏎     public Car(String plate, int maxSpeed, int seats) { ⏎         super(plate, maxSpeed); ⏎     } ⏎ }
public class Car extends Vehicle {
    private final int seats;

    public Car(String plate, int maxSpeed, int seats) {
        super(plate, maxSpeed);
        this.seats = seats;
    }

    @Override
    public String describe() {
        return super.describe() + ", " + seats + " seats";
    }
}
//<<
`,
    'ElectricCar.java': j`
//>> public class ElectricCar extends Car { // TODO ⏎     public ElectricCar(String plate, int maxSpeed, int seats, int batteryKwh) { ⏎         super(plate, maxSpeed, seats); ⏎     } ⏎ }
public class ElectricCar extends Car {
    private final int batteryKwh;

    public ElectricCar(String plate, int maxSpeed, int seats, int batteryKwh) {
        super(plate, maxSpeed, seats);
        this.batteryKwh = batteryKwh;
    }

    @Override
    public String describe() {
        return super.describe() + ", " + batteryKwh + " kWh";
    }

    @Override
    public int range() {
        return batteryKwh * 6;
    }
}
//<<
`,
  },
  ca: [
    { ten: { en: 'one of each', vi: 'mỗi loại một xe' }, vao: 'V;29a-12345;180\nC;30B-67890;200;5\nE;51k-00001;225;5;75\n' },
    { ten: { en: 'lower-case plates with spaces', vi: 'biển số chữ thường có dấu cách' }, vao: 'E; 43c-11111 ;160;7;0\nC;  ha-1 ;90;2\n', an: true },
  ],
  goiY: [
    { en: 'ElectricCar’s constructor calls super(plate, maxSpeed, seats) — Car’s constructor — which calls Vehicle’s. Constructors run from the top down.', vi: 'Constructor của ElectricCar gọi super(plate, maxSpeed, seats) — constructor của Car — rồi Car gọi của Vehicle. Constructor chạy từ trên xuống.' },
    { en: 'ElectricCar.describe() → super.describe() is Car’s describe(), which itself starts with Vehicle’s. Each level adds one piece.', vi: 'ElectricCar.describe() → super.describe() là describe() của Car, mà nó lại bắt đầu bằng của Vehicle. Mỗi tầng thêm một mẩu.' },
  ],
  loiHayGap: [
    { en: 'Declaring plate/seats again in a subclass — the structure line shows the duplicate fields.', vi: 'Khai báo lại plate/seats ở lớp con — dòng cấu trúc cho thấy trường bị lặp.' },
    { en: 'Upper-casing the plate in every subclass instead of once in Vehicle.', vi: 'Viết hoa biển số ở mọi lớp con thay vì một lần ở Vehicle.' },
    { en: 'ElectricCar.describe() calling Vehicle’s text directly (impossible — super.super does not exist) and losing the seats.', vi: 'ElectricCar.describe() muốn gọi thẳng chuỗi của Vehicle (không được — không có super.super) và làm mất số ghế.' },
  ],
  giaiThich: { en: '<p>Each level owns exactly its own field, receives the rest through <code>super(...)</code>, and extends the text of the level above with <code>super.describe()</code>. Only ElectricCar knows a range, so only it overrides <code>range()</code>.</p>', vi: '<p>Mỗi tầng giữ đúng trường của mình, nhận phần còn lại qua <code>super(...)</code>, và nối thêm vào chuỗi của tầng trên bằng <code>super.describe()</code>. Chỉ ElectricCar biết quãng đường, nên chỉ nó ghi đè <code>range()</code>.</p>' },
});

export default moDun({ slug: 'pro192-4-1-ke-thua', ten: '4.1 Inheritance', de: [de1, de2, de3] });
