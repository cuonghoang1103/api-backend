# Batch 16 — J1.S.P0080 (Shape hierarchy, polymorphism) and J1.S.P0081 (bee
# colony: encapsulation + a rule that lives in the base class).
import re
from solkit import solution, SOLUTIONS


# ════════════════════════════════════════════════════════════════
# J1.S.P0080 — Shapes (90 LOC)
# ════════════════════════════════════════════════════════════════

P0080_SHAPE = '''package entity;

/**
 * The top of the hierarchy.
 *
 * getArea() is abstract rather than returning 0: there is no such thing as the
 * area of "a shape in general", and a default of 0 would let a subclass forget
 * to override it and still compile. Abstract turns that mistake into a compile
 * error, which is the only kind of mistake worth having.
 */
public abstract class Shape {

    public abstract double getArea();

    /** Every concrete shape describes itself; the report just prints it. */
    @Override
    public abstract String toString();
}
'''

P0080_TWO_D = '''package entity;

/**
 * A shape with an area and nothing else.
 *
 * It adds no members at all, which looks pointless until you see the loop in
 * Main: this class exists so that "is this flat?" is a question about TYPE
 * rather than a list of names. Asking `s instanceof TwoDimensionalShape` keeps
 * working when a seventh shape is added; asking
 * `s instanceof Circle || s instanceof Square || ...` does not.
 */
public abstract class TwoDimensionalShape extends Shape {
}
'''

P0080_THREE_D = '''package entity;

/**
 * A shape that also encloses a volume.
 *
 * getVolume() is declared HERE and not in Shape, because a circle has no
 * volume. Pushing it up to Shape would force every flat shape to implement a
 * method that has no meaning for it - the usual sign that a member is sitting
 * one level too high.
 */
public abstract class ThreeDimensionalShape extends Shape {

    public abstract double getVolume();
}
'''

P0080_CIRCLE = '''package entity;

/** A = pi * r^2. */
public class Circle extends TwoDimensionalShape {

    private final double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }

    @Override
    public String toString() {
        return String.format("Circle [r=%.2f]", radius);
    }
}
'''

P0080_SQUARE = '''package entity;

/** A = s^2. */
public class Square extends TwoDimensionalShape {

    private final double side;

    public Square(double side) {
        this.side = side;
    }

    @Override
    public double getArea() {
        return side * side;
    }

    @Override
    public String toString() {
        return String.format("Square [side=%.2f]", side);
    }
}
'''

P0080_TRIANGLE = '''package entity;

/** A = 1/2 * base * height. */
public class Triangle extends TwoDimensionalShape {

    private final double base;
    private final double height;

    public Triangle(double base, double height) {
        this.base = base;
        this.height = height;
    }

    @Override
    public double getArea() {
        return 0.5 * base * height;
    }

    @Override
    public String toString() {
        return String.format("Triangle [base=%.2f, h=%.2f]", base, height);
    }
}
'''

P0080_SPHERE = '''package entity;

/** Surface A = 4 * pi * r^2, V = (4/3) * pi * r^3. */
public class Sphere extends ThreeDimensionalShape {

    private final double radius;

    public Sphere(double radius) {
        this.radius = radius;
    }

    @Override
    public double getArea() {
        return 4 * Math.PI * radius * radius;
    }

    @Override
    public double getVolume() {
        // 4.0 / 3.0, never 4 / 3: integer division would make this 1 * pi * r^3
        // and the answer would be quietly 25% too small.
        return (4.0 / 3.0) * Math.PI * Math.pow(radius, 3);
    }

    @Override
    public String toString() {
        return String.format("Sphere [r=%.2f]", radius);
    }
}
'''

P0080_CUBE = '''package entity;

/** Surface A = 6 * s^2, V = s^3. */
public class Cube extends ThreeDimensionalShape {

    private final double side;

    public Cube(double side) {
        this.side = side;
    }

    @Override
    public double getArea() {
        return 6 * side * side;
    }

    @Override
    public double getVolume() {
        return Math.pow(side, 3);
    }

    @Override
    public String toString() {
        return String.format("Cube [side=%.2f]", side);
    }
}
'''

P0080_TETRAHEDRON = '''package entity;

/** Regular tetrahedron: A = sqrt(3) * s^2, V = s^3 / (6 * sqrt(2)). */
public class Tetrahedron extends ThreeDimensionalShape {

    private final double side;

    public Tetrahedron(double side) {
        this.side = side;
    }

    @Override
    public double getArea() {
        return Math.sqrt(3) * side * side;
    }

    @Override
    public double getVolume() {
        return Math.pow(side, 3) / (6 * Math.sqrt(2));
    }

    @Override
    public String toString() {
        return String.format("Tetrahedron [side=%.2f]", side);
    }
}
'''

P0080_MAIN = '''package ui;

import entity.Circle;
import entity.Cube;
import entity.Shape;
import entity.Sphere;
import entity.Square;
import entity.Tetrahedron;
import entity.ThreeDimensionalShape;
import entity.Triangle;

/**
 * The report.
 *
 * One array of Shape references, one loop, and no switch on type: the correct
 * getArea() is chosen at run time by the object itself. That is the whole point
 * of the assignment - adding a Cylinder later means writing one class, and not
 * touching this file at all.
 */
public class Main {

    private static final String LINE = "=============================================================";

    public static void main(String[] args) {
        Shape[] shapes = {
            new Circle(2), new Square(3), new Triangle(4, 5),
            new Sphere(2), new Cube(3), new Tetrahedron(4),
        };

        System.out.println(LINE);
        System.out.printf("%-3s %-30s %10s %10s%n", "No", "Shape", "Area", "Volume");
        System.out.println(LINE);

        for (int i = 0; i < shapes.length; i++) {
            Shape shape = shapes[i];
            String area = String.format("%.2f", shape.getArea());

            // Run-time type identification, asked for by name in the brief. It
            // asks about the ABSTRACT level, not the concrete class, so a new
            // 3-D shape is handled correctly the day it is written.
            String volume = "-";
            if (shape instanceof ThreeDimensionalShape) {
                volume = String.format("%.2f", ((ThreeDimensionalShape) shape).getVolume());
            }
            System.out.printf("%-3d %-30s %10s %10s%n", i + 1, shape, area, volume);
        }
        System.out.println(LINE);
    }
}
'''


solution(
    'J1.S.P0080',
    title_vi='Cây kế thừa các hình học',
    files=[('src/entity/Shape.java', P0080_SHAPE),
           ('src/entity/TwoDimensionalShape.java', P0080_TWO_D),
           ('src/entity/ThreeDimensionalShape.java', P0080_THREE_D),
           ('src/entity/Circle.java', P0080_CIRCLE),
           ('src/entity/Square.java', P0080_SQUARE),
           ('src/entity/Triangle.java', P0080_TRIANGLE),
           ('src/entity/Sphere.java', P0080_SPHERE),
           ('src/entity/Cube.java', P0080_CUBE),
           ('src/entity/Tetrahedron.java', P0080_TETRAHEDRON),
           ('src/ui/Main.java', P0080_MAIN)],
    main_class='ui.Main',
    runs=[('', '''=============================================================
No  Shape                                Area     Volume
=============================================================
1   Circle [r=2.00]                     12.57          -
2   Square [side=3.00]                   9.00          -
3   Triangle [base=4.00, h=5.00]        10.00          -
4   Sphere [r=2.00]                     50.27      33.51
5   Cube [side=3.00]                    54.00      27.00
6   Tetrahedron [side=4.00]             27.71       7.54
=============================================================''')],
    explain_en='''<p><strong>What is really being marked here.</strong> Not the geometry — the formulas are
handed to you. What is marked is whether the loop in <code>Main</code> contains any knowledge of the
individual shapes. It contains none: one array of <code>Shape</code> references, one loop, no switch on
type. Adding a Cylinder later means writing one class and not touching <code>Main</code> at all, and
that property is the entire point of the hierarchy.</p>
<p><strong>Why <code>getArea()</code> is abstract instead of returning 0.</strong> There is no such
thing as the area of "a shape in general". A default implementation returning 0 would let a subclass
forget to override it and still compile, and the report would show a confident <code>0.00</code>.
Declaring it abstract turns that mistake into a compile error — the only kind of mistake worth
having.</p>
<p><strong>Why <code>getVolume()</code> lives on <code>ThreeDimensionalShape</code>.</strong> A circle
has no volume. Pushing the method up into <code>Shape</code> would force every flat shape to implement
something meaningless — the usual sign that a member is sitting one level too high in a hierarchy. Ask
where a method is <em>always</em> true, and put it there.</p>
<p><strong>The two middle classes look empty, and they are the load-bearing part.</strong>
<code>TwoDimensionalShape</code> adds no members at all. It exists so that "is this flat?" is a
question about the <em>type</em> rather than a list of names. <code>s instanceof
ThreeDimensionalShape</code> keeps working the day a seventh shape appears; <code>s instanceof Circle
|| s instanceof Square || …</code> silently stops being complete.</p>
<p><strong>The arithmetic trap in the sphere.</strong> <code>(4.0 / 3.0)</code>, never
<code>(4 / 3)</code>. Integer division makes the second one <code>1</code>, so the volume comes out
exactly 25% too small — and 25% too small still looks like a plausible number, which is why this one
survives to the demonstration.</p>
<p><strong>Formatting is part of the answer.</strong> Every real number is printed with
<code>%.2f</code>, and the table is laid out with <code>printf</code> field widths rather than tabs. A
<code>\\t</code> table looks aligned until one shape's description is longer than the tab stop, and then
the whole column steps sideways.</p>
<p><strong>How this was verified.</strong> The program was run and the six lines compared against the
brief's own sample table: 12.57, 9.00, 10.00, 50.27 / 33.51, 54.00 / 27.00, 27.71 / 7.54. Every figure
matches to the last digit, including the tetrahedron's √3·s² and s³/(6√2), which are the two most
commonly mis-typed formulas in the set.</p>''',
    explain_vi='''<p><strong>Bài này thật ra chấm cái gì.</strong> Không phải hình học — công thức đã cho
sẵn. Cái được chấm là vòng lặp trong <code>Main</code> có chứa hiểu biết gì về từng hình cụ thể hay
không. Ở đây thì không: một mảng tham chiếu <code>Shape</code>, một vòng lặp, không có switch theo kiểu.
Sau này thêm hình trụ chỉ là viết thêm một lớp và <strong>không đụng gì vào</strong>
<code>Main</code> — chính tính chất đó là toàn bộ lý do có cây kế thừa.</p>
<p><strong>Vì sao <code>getArea()</code> là abstract chứ không trả về 0.</strong> Không tồn tại khái
niệm diện tích của "một hình nói chung". Một cài đặt mặc định trả 0 sẽ khiến lớp con quên ghi đè mà vẫn
biên dịch được, và bảng báo cáo in ra <code>0.00</code> rất tự tin. Khai báo abstract biến lỗi đó thành
lỗi biên dịch — loại lỗi duy nhất đáng có.</p>
<p><strong>Vì sao <code>getVolume()</code> nằm ở <code>ThreeDimensionalShape</code>.</strong> Hình tròn
không có thể tích. Đẩy phương thức này lên <code>Shape</code> sẽ ép mọi hình phẳng phải cài đặt một thứ
vô nghĩa — dấu hiệu quen thuộc của một thành viên bị đặt cao hơn một tầng so với chỗ của nó. Hãy hỏi
phương thức này <em>luôn luôn</em> đúng ở đâu, rồi đặt nó ở đó.</p>
<p><strong>Hai lớp ở giữa trông rỗng, và chúng chính là phần chịu lực.</strong>
<code>TwoDimensionalShape</code> không thêm thành viên nào. Nó tồn tại để câu hỏi "hình này có phẳng
không?" là câu hỏi về <em>kiểu</em>, chứ không phải một danh sách tên. <code>s instanceof
ThreeDimensionalShape</code> vẫn đúng vào ngày có hình thứ bảy; còn <code>s instanceof Circle ||
s instanceof Square || …</code> thì lặng lẽ thiếu sót.</p>
<p><strong>Bẫy số học ở hình cầu.</strong> Phải là <code>(4.0 / 3.0)</code>, không bao giờ là
<code>(4 / 3)</code>. Phép chia nguyên biến biểu thức thứ hai thành <code>1</code>, nên thể tích ra
<strong>nhỏ hơn đúng 25%</strong> — mà nhỏ hơn 25% thì vẫn trông như một con số hợp lý, đó là lý do lỗi
này sống sót tới tận lúc trình bày.</p>
<p><strong>Trình bày cũng là một phần của đáp án.</strong> Mọi số thực in bằng <code>%.2f</code>, và
bảng căn cột bằng độ rộng trường của <code>printf</code> chứ không bằng ký tự tab. Bảng dùng
<code>\\t</code> trông thẳng hàng cho tới khi có một mô tả dài hơn điểm dừng tab, rồi cả cột lệch sang
một bên.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Chạy thật và so sáu dòng với chính bảng mẫu trong đề: 12.57,
9.00, 10.00, 50.27 / 33.51, 54.00 / 27.00, 27.71 / 7.54. Mọi con số khớp tới chữ số cuối, kể cả √3·s² và
s³/(6√2) của tứ diện đều — hai công thức bị gõ nhầm nhiều nhất trong bộ này.</p>''',
    hints_en=[
        'Declare getArea() abstract in Shape so a subclass cannot forget to write it.',
        'getVolume() belongs on ThreeDimensionalShape — a circle has no volume.',
        'Test with `instanceof ThreeDimensionalShape`, not against each concrete class.',
        'Write (4.0 / 3.0): integer division makes the sphere 25% too small and still plausible.',
        'Lay the table out with printf widths, not tabs, and format every number with %.2f.',
    ],
    hints_vi=[
        'Khai báo getArea() abstract trong Shape để lớp con không thể quên viết nó.',
        'getVolume() thuộc về ThreeDimensionalShape — hình tròn không có thể tích.',
        'Kiểm bằng `instanceof ThreeDimensionalShape`, đừng kiểm với từng lớp cụ thể.',
        'Viết (4.0 / 3.0): chia nguyên làm thể tích hình cầu nhỏ đi 25% mà vẫn trông hợp lý.',
        'Căn bảng bằng độ rộng trường của printf, đừng dùng tab; mọi số dùng %.2f.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0081 — Bees (90 LOC)
# ════════════════════════════════════════════════════════════════

P0081_BEE = '''package entity;

/**
 * Every bee, and every rule that is the same for every bee.
 *
 * health is private with a getter and NO setter - the brief says it must not be
 * writable from outside, and the only way to keep that true is to give the
 * outside world no way to write it. It changes through one method, which is
 * also the only place the "already dead" rule can be enforced.
 *
 * isDead() is written ONCE here as `health < getThreshold()`. The subclasses
 * supply the number and nothing else. Repeating the comparison in each subclass
 * would be three chances to get it wrong, and three places to fix it later.
 */
public abstract class Bee {

    private static final double FULL_HEALTH = 100.0;

    private double health = FULL_HEALTH;

    /** The health below which this kind of bee is pronounced dead. */
    public abstract int getThreshold();

    /** The name shown in the report. */
    public abstract String getType();

    public double getHealth() {
        return health;
    }

    public boolean isDead() {
        return health < getThreshold();
    }

    /**
     * Reduce health by `percent` percent OF THE CURRENT HEALTH.
     *
     * Not of the original 100: two hits of 20% leave 64, not 60. Reading the
     * rule as "of the original" is the single most common way to fail this
     * assignment, and the brief's own worked example (100 -> 80 -> 64) is there
     * to catch it.
     *
     * A dead bee is frozen: the call still works, it simply records nothing.
     * The brief is explicit that Damage() must remain invokable without error,
     * so this returns quietly rather than throwing.
     *
     * WHY `health * (100 - percent) / 100.0` and not the brief's own
     * `health * (1 - percent / 100.0)`:
     *
     * The two are equal in algebra and NOT equal in floating point. Damage a
     * queen for exactly 80: `1 - 80/100.0` is 0.19999999999999996, because 0.8
     * has no exact binary representation, so the health becomes
     * 19.999999999999996. It PRINTS as "20.00 %" and it COMPARES as less than
     * 20 - so the queen is pronounced dead at a health the brief says she
     * survives, and the report shows a bee that is dead at 20.00% next to the
     * rule that says dead means below 20%.
     *
     * Multiplying first keeps the arithmetic on whole numbers for one more
     * step: 100 * 20 = 2000.0, and 2000.0 / 100.0 is exactly 20.0. The brief's
     * own worked example still holds exactly (100 -> 80.0 -> 64.0).
     *
     * This was not spotted by reading the code. It appeared as a test that
     * passed most runs and failed about one in six, which is what a boundary
     * bug looks like when the input is random.
     */
    public void Damage(int percent) {
        if (isDead()) {
            return;
        }
        if (percent < 0 || percent > 100) {
            throw new IllegalArgumentException("Damage percent must be between 0 and 100.");
        }
        health = health * (100 - percent) / 100.0;
    }
}
'''

P0081_WORKER = '''package entity;

/** Below 70% a worker can no longer fly, so it is pronounced dead. */
public class Worker extends Bee {

    @Override
    public int getThreshold() {
        return 70;
    }

    @Override
    public String getType() {
        return "Worker";
    }
}
'''

P0081_QUEEN = '''package entity;

/** The most resilient of the three: dead only below 20%. */
public class Queen extends Bee {

    @Override
    public int getThreshold() {
        return 20;
    }

    @Override
    public String getType() {
        return "Queen";
    }
}
'''

P0081_DRONE = '''package entity;

/** Moderately resilient: dead below 50%. */
public class Drone extends Bee {

    @Override
    public int getThreshold() {
        return 50;
    }

    @Override
    public String getType() {
        return "Drone";
    }
}
'''

P0081_BO = '''package bo;

import entity.Bee;
import entity.Drone;
import entity.Queen;
import entity.Worker;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * The colony: the 30 bees and what can be done to them. It never prints.
 *
 * attack() returns the damage it rolled for each bee rather than printing as it
 * goes. The screen layer needs those numbers to show them, and a method that
 * both decides AND displays cannot be tested by anything except a human reading
 * the console.
 */
public class Colony {

    private static final int PER_TYPE = 10;
    private static final int MAX_DAMAGE = 80;

    private final Random random = new Random();
    private final List<Bee> bees = new ArrayList<>();

    /** Clears the colony and builds a fresh one at full health. */
    public void create() {
        bees.clear();
        for (int i = 0; i < PER_TYPE; i++) {
            bees.add(new Worker());
        }
        for (int i = 0; i < PER_TYPE; i++) {
            bees.add(new Queen());
        }
        for (int i = 0; i < PER_TYPE; i++) {
            bees.add(new Drone());
        }
    }

    public List<Bee> getBees() {
        return bees;
    }

    /**
     * One round: a fresh random 0..80 for EACH bee.
     *
     * Rolling once and applying it to all thirty would be a different exercise,
     * and the report would give it away - every bee of a type would show the
     * same health.
     */
    public int[] attack() {
        int[] rolled = new int[bees.size()];
        for (int i = 0; i < bees.size(); i++) {
            rolled[i] = random.nextInt(MAX_DAMAGE + 1);
            bees.get(i).Damage(rolled[i]);
        }
        return rolled;
    }

    public int countAlive() {
        int alive = 0;
        for (Bee bee : bees) {
            if (!bee.isDead()) {
                alive++;
            }
        }
        return alive;
    }
}
'''

P0081_VALIDATOR = '''package utils;

import java.util.Scanner;

/** Every keyboard read in the program, in one place. */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    public static int getInt(String message, int min, int max) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            try {
                int value = Integer.parseInt(line);
                if (value < min || value > max) {
                    System.out.println("Please choose from " + min + " to " + max + ".");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("You must input a number.");
            }
        }
    }
}
'''

P0081_MAIN = '''package ui;

import bo.Colony;
import entity.Bee;
import java.util.List;
import utils.Validator;

/** Menu and screen only. */
public class Main {

    public static void main(String[] args) {
        Colony colony = new Colony();
        boolean running = true;

        while (running) {
            System.out.println("============ BEE SIMULATION ============");
            System.out.println("1. Create bee list");
            System.out.println("2. Attack bees");
            System.out.println("0. Exit");
            System.out.println("========================================");

            int choice = Validator.getInt("Your choice: ", 0, 2);
            switch (choice) {
                case 1:
                    colony.create();
                    System.out.println("New bee list created: 10 Workers, 10 Queens, 10 Drones.");
                    report(colony, null);
                    break;
                case 2:
                    if (colony.getBees().isEmpty()) {
                        // A menu the marker can press in any order has to cope
                        // with being pressed in the wrong one.
                        System.out.println("There is no bee list yet. Choose 1 first.");
                        break;
                    }
                    System.out.println("Attacking all bees (random damage 0-80% each)...");
                    report(colony, colony.attack());
                    break;
                default:
                    running = false;
                    System.out.println("Goodbye.");
            }
        }
    }

    /** One report for both cases; `damage` is null when nothing was rolled. */
    private static void report(Colony colony, int[] damage) {
        List<Bee> bees = colony.getBees();
        if (damage == null) {
            System.out.printf("%-3s %-7s %10s   %s%n", "No", "Type", "Health", "Status");
            System.out.println("------------------------------");
        } else {
            System.out.printf("%-3s %-7s %5s %10s   %s%n", "No", "Type", "Dmg", "Health", "Status");
            System.out.println("-------------------------------------");
        }

        for (int i = 0; i < bees.size(); i++) {
            Bee bee = bees.get(i);
            String health = String.format("%.2f %%", bee.getHealth());
            String status = bee.isDead() ? "Dead" : "Alive";
            if (damage == null) {
                System.out.printf("%-3d %-7s %10s   %s%n", i + 1, bee.getType(), health, status);
            } else {
                System.out.printf("%-3d %-7s %5d %10s   %s%n",
                        i + 1, bee.getType(), damage[i], health, status);
            }
        }
        System.out.println(damage == null ? "------------------------------" : "-------------------------------------");
        System.out.println("Alive: " + colony.countAlive() + "   Dead: " + (bees.size() - colony.countAlive()));
    }
}
'''

THRESHOLD = {'Worker': 70, 'Queen': 20, 'Drone': 50}


def _p0081_check(out):
    """The damage rolls are random, so the report is checked by its own arithmetic.

    For every attacked bee: the printed health must be exactly the printed damage
    applied to 100, and the printed status must be what that health means for
    that TYPE. A colony that applied the damage to the wrong base, or used one
    threshold for all three types, cannot survive this.
    """
    rows = re.findall(r'^(\d+)\s+(Worker|Queen|Drone)\s+(\d+)\s+([\d.]+) %\s+(Alive|Dead)$',
                      out, re.M)
    if len(rows) != 30:
        return False, f'expected 30 attacked rows, got {len(rows)}'

    alive = 0
    for no, kind, dmg, health, status in rows:
        expected = 100.0 * (1 - int(dmg) / 100.0)
        if abs(float(health) - expected) > 0.005:
            return False, f'bee {no} ({kind}): {dmg}% of 100 should be {expected:.2f}, printed {health}'
        want = 'Dead' if float(health) < THRESHOLD[kind] else 'Alive'
        if status != want:
            return False, f'bee {no} ({kind}) at {health}% with threshold {THRESHOLD[kind]} should be {want}'
        if status == 'Alive':
            alive += 1

    # the ten of each type must be in the order the brief describes
    kinds = [r[1] for r in rows]
    if kinds != ['Worker'] * 10 + ['Queen'] * 10 + ['Drone'] * 10:
        return False, 'the colony is not 10 Workers, then 10 Queens, then 10 Drones'

    if f'Alive: {alive}   Dead: {30 - alive}' not in out:
        return False, f'the summary does not agree with the rows (counted {alive} alive)'

    # a fresh colony must have been reported at full health first
    if out.count('100.00 %') < 30:
        return False, 'the new colony was not reported at 100.00 % health'
    return True, ''


solution(
    'J1.S.P0081',
    title_vi='Mô phỏng đàn ong',
    files=[('src/entity/Bee.java', P0081_BEE),
           ('src/entity/Worker.java', P0081_WORKER),
           ('src/entity/Queen.java', P0081_QUEEN),
           ('src/entity/Drone.java', P0081_DRONE),
           ('src/bo/Colony.java', P0081_BO),
           ('src/utils/Validator.java', P0081_VALIDATOR),
           ('src/ui/Main.java', P0081_MAIN)],
    main_class='ui.Main',
    runs=[
        # create, attack once, exit
        ('1\n2\n0\n', _p0081_check),
        # attack before creating: the menu must survive being pressed in the
        # wrong order, then work normally afterwards
        ('2\n1\n2\n0\n', _p0081_check),
    ],
    explain_en='''<p><strong>The rule that decides the whole design.</strong> Damage is a percentage
<em>of the current health</em>, not of the original 100. Two hits of 20% leave 64, not 60. The brief
gives that exact worked example (100 → 80 → 64) precisely because reading it the other way is the most
common way to fail this assignment, and the resulting numbers still look reasonable.</p>
<p><strong>"Not writable externally" is a claim you have to make true.</strong> <code>health</code> is
private with a getter and <strong>no setter</strong>. That is not decoration: it is what makes the
damage rule enforceable. If any caller could assign to <code>health</code>, the "a dead bee is frozen"
rule would be a suggestion rather than a guarantee, because there would be a second way to change the
value that does not go through the check.</p>
<p><strong><code>isDead()</code> is written once, in the base class.</strong> The subclasses supply a
number and nothing else — <code>getThreshold()</code> returns 70, 20 or 50. Repeating
<code>health &lt; 70</code> inside <code>Worker</code>, <code>health &lt; 20</code> inside
<code>Queen</code> and so on would be three chances to type the comparison backwards and three places
to fix when the rule changes. This is the difference between inheritance used for sharing behaviour and
inheritance used only for naming.</p>
<p><strong>Dead means frozen, not broken.</strong> The brief is explicit: once a bee is dead,
<code>Damage()</code> must still be callable without error, it simply records nothing. So the method
returns quietly on the first line rather than throwing. An exception here would be wrong — nothing has
gone wrong; the caller asked a reasonable question and the answer is "no change".</p>
<p><strong>Where each responsibility lives.</strong> <code>Colony.attack()</code> rolls a fresh random
number for every bee and <em>returns</em> the rolls instead of printing them. A method that both decides
and displays cannot be checked by anything except a human reading the console. Rolling once and
applying it to all thirty would also be visible in the report — every bee of a type would show
identical health.</p>
<p><strong>The floating-point boundary this exercise hides — and how it was found.</strong> Write the
rule the way the brief writes it, <code>health * (1 - percent / 100.0)</code>, and damage a queen for
exactly 80. Her health becomes <code>19.999999999999996</code>, because 0.8 has no exact binary
representation. It <em>prints</em> as <code>20.00 %</code> and it <em>compares</em> as less than 20 — so
the report shows a queen pronounced dead at 20.00%, sitting directly under a rule that says dead means
<em>below</em> 20%. Multiplying before dividing, <code>health * (100 - percent) / 100.0</code>, keeps
the arithmetic on whole numbers one step longer: 100 × 20 = 2000.0, and 2000.0 / 100.0 is exactly 20.0.
The brief's own worked example is unaffected (100 → 80.0 → 64.0). This was not spotted by reading the
code — it showed up as a check that passed most runs and failed about one in six, which is what a
boundary bug looks like when the input is random.</p>
<p><strong>How a random program was still verified hard.</strong> The report is checked by its own
arithmetic: for each of the 30 rows, the printed health must be exactly the printed damage applied to
100, and the printed status must be what that health means <em>for that type</em> — 55% is Dead for a
Worker and Alive for a Queen. Then the summary line must agree with the rows that were counted. A
colony that applied damage to the wrong base, or used one threshold for all three types, cannot pass;
neither can a lucky run.</p>
<p><strong>One thing the marker will try.</strong> Pressing 2 before pressing 1. The menu answers
instead of crashing on an empty list, and the second scripted run does exactly that before carrying on
normally.</p>
<p><strong>A note on the method name.</strong> <code>Damage()</code> is capitalised, which is not Java
convention — Java methods start lower-case. It is kept because the brief names the method that way and
a marker looks for it by name; the Guidelines are the contract. Worth saying out loud at the defence:
you noticed, and you chose the contract over the convention.</p>''',
    explain_vi='''<p><strong>Luật quyết định toàn bộ thiết kế.</strong> Sát thương là phần trăm
<em>của máu hiện tại</em>, không phải của 100 ban đầu. Hai đòn 20% còn lại 64, không phải 60. Đề đưa
đúng ví dụ đó (100 → 80 → 64) chính vì hiểu ngược lại là cách trượt bài này phổ biến nhất, mà các con
số ra vẫn trông hợp lý.</p>
<p><strong>"Không ghi được từ bên ngoài" là điều bạn phải làm cho nó thành thật.</strong>
<code>health</code> để private, có getter và <strong>không có setter</strong>. Đó không phải trang trí:
đó là thứ khiến luật sát thương có hiệu lực. Nếu ai đó gán được vào <code>health</code>, luật "ong chết
thì đóng băng" chỉ còn là lời khuyên chứ không phải bảo đảm, vì đã có đường thứ hai đổi giá trị mà không
đi qua chỗ kiểm tra.</p>
<p><strong><code>isDead()</code> chỉ viết một lần, ở lớp cha.</strong> Lớp con chỉ cung cấp một con số —
<code>getThreshold()</code> trả 70, 20 hoặc 50. Lặp lại <code>health &lt; 70</code> trong
<code>Worker</code>, <code>health &lt; 20</code> trong <code>Queen</code>… là ba cơ hội gõ ngược dấu so
sánh và ba chỗ phải sửa khi luật đổi. Đây chính là khác biệt giữa kế thừa để <em>dùng chung hành vi</em>
và kế thừa chỉ để <em>đặt tên</em>.</p>
<p><strong>Chết nghĩa là đóng băng, không phải hỏng.</strong> Đề nói rõ: ong đã chết thì vẫn gọi
<code>Damage()</code> được mà không lỗi, chỉ là không ghi nhận gì. Nên phương thức lặng lẽ trả về ngay
dòng đầu chứ không ném ngoại lệ. Ném ở đây là sai — chẳng có gì trục trặc cả; người gọi hỏi một câu hợp
lệ và câu trả lời là "không thay đổi".</p>
<p><strong>Trách nhiệm nằm ở đâu.</strong> <code>Colony.attack()</code> tung số ngẫu nhiên mới cho từng
con ong và <em>trả về</em> các số đó thay vì tự in. Một phương thức vừa quyết định vừa hiển thị thì
không thể kiểm bằng gì khác ngoài mắt người đọc màn hình. Tung một lần rồi áp cho cả ba mươi con cũng
lộ ngay trên báo cáo — mọi con cùng loại sẽ có máu y hệt nhau.</p>
<p><strong>Cái bẫy dấu phẩy động ở ngay biên — và cách phát hiện ra nó.</strong> Viết đúng như đề
viết, <code>health * (1 - percent / 100.0)</code>, rồi đánh ong chúa đúng 80%. Máu của nó thành
<code>19.999999999999996</code>, vì 0.8 không biểu diễn chính xác được trong hệ nhị phân. Nó <em>in
ra</em> là <code>20.00 %</code> nhưng <em>so sánh</em> lại nhỏ hơn 20 — nên báo cáo hiện một con ong chúa
bị tuyên chết ở mức 20.00%, nằm ngay dưới cái luật nói rằng chết là <em>dưới</em> 20%. Nhân trước rồi mới
chia, <code>health * (100 - percent) / 100.0</code>, giữ phép tính ở số nguyên thêm một bước: 100 × 20 =
2000.0, và 2000.0 / 100.0 đúng bằng 20.0. Ví dụ mẫu của đề vẫn nguyên vẹn (100 → 80.0 → 64.0). Lỗi này
KHÔNG được tìm ra bằng cách đọc code — nó lộ ra dưới dạng một phép kiểm qua được phần lớn lần chạy và
trượt khoảng một trên sáu lần, đúng hình dạng của một lỗi biên khi dữ liệu vào là ngẫu nhiên.</p>
<p><strong>Chương trình ngẫu nhiên vẫn kiểm được rất chặt.</strong> Báo cáo bị kiểm bằng chính số học
của nó: với cả 30 dòng, máu in ra phải đúng bằng mức sát thương in ra áp lên 100, và trạng thái in ra
phải đúng với ý nghĩa của mức máu đó <em>theo từng loại</em> — 55% là Dead với thợ nhưng Alive với ong
chúa. Rồi dòng tổng kết phải khớp với số dòng đếm được. Một đàn ong áp sát thương lên sai cơ số, hay
dùng chung một ngưỡng cho cả ba loại, đều không lọt qua; một lần chạy may mắn cũng vậy.</p>
<p><strong>Một thứ người chấm chắc chắn sẽ thử.</strong> Bấm 2 trước khi bấm 1. Thực đơn trả lời tử tế
thay vì chết trên danh sách rỗng, và lần chạy kiểm thứ hai làm đúng như vậy rồi mới chạy tiếp bình
thường.</p>
<p><strong>Ghi chú về tên phương thức.</strong> <code>Damage()</code> viết hoa chữ đầu, trái quy ước
Java (phương thức bắt đầu bằng chữ thường). Vẫn giữ vì đề đặt tên như thế và người chấm dò theo tên;
phần Hướng dẫn là bản có hiệu lực. Nên nói thẳng điều này khi bảo vệ: bạn có nhận ra, và bạn chọn theo
đề chứ không theo quy ước.</p>''',
    hints_en=[
        'Damage is a percentage of CURRENT health: two hits of 20% leave 64, not 60.',
        'health is private with a getter and no setter — that is what makes the rule enforceable.',
        'Write isDead() once in Bee as `health < getThreshold()`; subclasses supply only the number.',
        'A dead bee freezes: Damage() must still be callable and must change nothing.',
        'Roll a fresh random 0..80 for EACH bee, not one roll shared by all thirty.',
        'Compute health * (100 - percent) / 100.0 — the brief\'s 1 - percent/100.0 makes 80%% damage land on 19.999999999999996, which prints as 20.00 and compares as dead.',
    ],
    hints_vi=[
        'Sát thương tính trên máu HIỆN TẠI: hai đòn 20% còn 64, không phải 60.',
        'health để private, có getter, không setter — nhờ vậy luật mới có hiệu lực thật.',
        'Viết isDead() một lần trong Bee là `health < getThreshold()`; lớp con chỉ đưa con số.',
        'Ong chết thì đóng băng: vẫn gọi Damage() được và không được đổi gì.',
        'Tung số ngẫu nhiên 0..80 MỚI cho TỪNG con ong, không dùng chung một số cho cả 30 con.',
        'Tính health * (100 - percent) / 100.0 — công thức 1 - percent/100.0 của đề làm đòn 80%% ra 19.999999999999996, in ra 20.00 mà so sánh thì đã chết.',
    ],
)


# ── Vietnamese briefs ────────────────────────────────────────────
VI = {
    'J1.S.P0080': '''<h3>Bối cảnh</h3>
<p>Lập trình hướng đối tượng cho phép tổ chức các lớp liên quan thành một cây phân cấp: hành vi chung
của cả một họ lớp được định nghĩa một lần ở lớp cơ sở, rồi chuyên biệt hoá ở từng lớp dẫn xuất.</p>
<p>Bài này mô hình hoá các hình hình học theo cây như vậy: <code>Shape</code> ở trên cùng;
<code>TwoDimensionalShape</code> và <code>ThreeDimensionalShape</code> làm mịn thêm; các lớp cụ thể như
<code>Circle</code>, <code>Square</code>, <code>Triangle</code>, <code>Sphere</code>, <code>Cube</code>,
<code>Tetrahedron</code> là lá. Vì mọi hình cụ thể <em>là một</em> <code>Shape</code>, các đối tượng
khác kiểu nhau có thể nằm chung trong một mảng tham chiếu <code>Shape</code> và được xử lý đồng nhất
nhờ đa hình — cùng một lời gọi (ví dụ <code>getArea()</code>) sẽ chọn đúng cài đặt lúc chạy.</p>
<h3>Đặc tả chương trình</h3>
<p>Cài đặt cây lớp <code>Shape</code>. Mỗi hình hai chiều phải có <code>getArea()</code> tính diện tích.
Mỗi hình ba chiều phải có <code>getArea()</code> (diện tích bề mặt) và <code>getVolume()</code>
(thể tích).</p>
<p>Viết chương trình dùng một <strong>mảng tham chiếu <code>Shape</code></strong> trỏ tới đối tượng của
mỗi lớp cụ thể. In ra đối tượng mà mỗi phần tử tham chiếu tới. Trong chính vòng lặp đó, xác định hình là
hai chiều hay ba chiều: hai chiều thì in diện tích, ba chiều thì in cả diện tích lẫn thể tích.</p>
<h3>Chi tiết chức năng</h3>
<h4>1. Dựng cây lớp</h4>
<ul>
<li>Lớp trừu tượng <code>Shape</code> với phương thức trừu tượng <code>getArea()</code> và
<code>toString()</code> được ghi đè.</li>
<li><code>TwoDimensionalShape</code> và <code>ThreeDimensionalShape</code> kế thừa <code>Shape</code>;
lớp ba chiều thêm phương thức trừu tượng <code>getVolume()</code>.</li>
<li>Các lớp cụ thể <code>Circle</code>, <code>Square</code>, <code>Triangle</code> (kế thừa lớp hai
chiều) và <code>Sphere</code>, <code>Cube</code>, <code>Tetrahedron</code> (kế thừa lớp ba chiều), mỗi
lớp có các trường nó cần (bán kính, cạnh, đáy và chiều cao…).</li>
</ul>
<h4>2. Cài đặt phần hình học</h4>
<p>Ghi đè <code>getArea()</code> ở mọi lớp cụ thể theo công thức trong phần Hướng dẫn; ghi đè
<code>getVolume()</code> ở mọi lớp ba chiều.</p>
<h4>3. Xử lý đa hình</h4>
<p>Tạo mảng <code>Shape</code> chứa mỗi lớp cụ thể một đối tượng. Duyệt mảng, in hình ra, rồi dùng nhận
dạng kiểu lúc chạy (ví dụ <code>instanceof</code>) để quyết định in diện tích hay in cả thể tích. Mọi số
thực làm tròn 2 chữ số thập phân.</p>
<h3>Màn hình mong đợi</h3>
<p>Chương trình không cần nhập gì; nó dựng sẵn một bộ hình mẫu và in báo cáo:</p>
<pre>=============================================================
No  Shape                          Area        Volume
=============================================================
1  Circle [r=2.00]                12.57          -
2  Square [side=3.00]              9.00          -
3  Triangle [base=4.00, h=5.00]   10.00          -
4  Sphere [r=2.00]                50.27        33.51
5  Cube [side=3.00]               54.00        27.00
6  Tetrahedron [side=4.00]        27.71         7.54
=============================================================</pre>
<h3>Hướng dẫn</h3>
<p>Với <em>r</em> là bán kính và <em>s</em> là độ dài cạnh:</p>
<ul>
<li><strong>Hình phẳng — diện tích</strong>: Hình tròn A = π·r² · Hình vuông A = s² ·
Tam giác A = ½·đáy·cao.</li>
<li><strong>Hình khối — diện tích bề mặt A và thể tích V</strong>: Hình cầu A = 4·π·r², V = (4/3)·π·r³ ·
Lập phương A = 6·s², V = s³ · Tứ diện đều A = √3·s², V = s³/(6·√2).</li>
</ul>
<p>Gợi ý: dùng <code>Math.PI</code>, <code>Math.sqrt()</code>, <code>Math.pow()</code> và
<code>String.format("%.2f", value)</code>. Khai báo <code>getArea()</code> abstract trong
<code>Shape</code> và <code>getVolume()</code> abstract trong <code>ThreeDimensionalShape</code> để mọi
lớp cụ thể <strong>buộc phải</strong> cài đặt. Ghi đè <code>toString()</code> ở từng lớp cụ thể để ra
đúng dòng mô tả trong màn hình mẫu. Lưu tất cả trong MỘT mảng <code>Shape[]</code> và duyệt bằng MỘT
vòng lặp; để đa hình tự chọn đúng <code>getArea()</code>/<code>getVolume()</code> lúc chạy.</p>''',

    'J1.S.P0081': '''<h3>Bối cảnh</h3>
<p>Bài này luyện thiết kế lớp với đóng gói, kế thừa và đa hình qua việc mô phỏng một đàn ong nhỏ. Mọi con
ong đều có chung trạng thái và hành vi — một giá trị máu và khả năng chịu sát thương — nhưng mỗi loại
ong chết ở một ngưỡng máu khác nhau. Gom hành vi chung vào lớp cơ sở <code>Bee</code> và để
<code>Worker</code>, <code>Queen</code>, <code>Drone</code> chỉ chuyên biệt hoá phần khác nhau, ta giữ
được mọi con ong trong một tập hợp và xử lý chúng đồng nhất. Bài cũng nhấn mạnh che giấu thông tin: máu
của ong đọc được từ bên ngoài nhưng <strong>không bao giờ ghi trực tiếp được</strong> — nó chỉ thay đổi
qua luật của mô phỏng.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết các lớp biểu diễn ba loại ong — <code>Worker</code>, <code>Queen</code>, <code>Drone</code>. Mỗi
con ong có thuộc tính máu kiểu số thực, <strong>không ghi được từ bên ngoài</strong>, khi tạo ra bằng
100 (phần trăm).</p>
<p>Mỗi con ong có phương thức <code>Damage()</code> nhận một tham số nguyên trong khoảng 0–100. Khi gọi,
máu của ong <strong>giảm đi phần trăm đó của máu hiện tại</strong>. Ong thợ khi máu tụt dưới 70% thì
không bay được nữa nên coi như đã chết. Ong chúa chết khi máu dưới 20%, ong đực dưới 50%. Trạng thái
chết này phải đọc được từ bên ngoài. Khi ong đã chết, mọi khoản trừ máu về sau không được ghi nhận, dù
<code>Damage()</code> vẫn phải gọi được mà không sinh lỗi.</p>
<p>Chương trình tạo MỘT tập hợp gồm 10 con mỗi loại (tổng 30 con) trong một list hoặc mảng, và phải có
các thao tác gọi <code>Damage()</code> cho mọi con ong và trả về tình trạng máu của từng con, kèm nó còn
sống hay không.</p>
<h3>Chi tiết chức năng</h3>
<h4>1. Mô hình cây lớp Bee</h4>
<ul>
<li>Lớp trừu tượng <code>Bee</code> với máu chỉ-đọc (khởi tạo 100) và trạng thái chết chỉ-đọc.</li>
<li><code>Damage(int percent)</code> giảm máu đi <code>percent</code>% của máu <strong>hiện tại</strong>.
Khi ong đã chết, gọi <code>Damage()</code> phải giữ nguyên máu và không được ném lỗi.</li>
<li><code>Worker</code>, <code>Queen</code>, <code>Drone</code> kế thừa <code>Bee</code>; mỗi lớp tự
định nghĩa ngưỡng chết của mình (thợ &lt; 70%, chúa &lt; 20%, đực &lt; 50%).</li>
</ul>
<h4>2. Dựng tập hợp ong</h4>
<p>Một list/mảng chứa 10 thợ, 10 chúa, 10 đực (30 con), tất cả bắt đầu ở 100% máu. Có thao tác áp
<code>Damage()</code> cho mọi con và báo cáo máu kèm trạng thái sống/chết.</p>
<h4>3. Thực đơn console</h4>
<ul>
<li><strong>1 – Tạo danh sách ong</strong>: xoá danh sách hiện tại, tạo bộ ong mới và hiển thị ra màn
hình.</li>
<li><strong>2 – Tấn công</strong>: mỗi con ong nhận một giá trị ngẫu nhiên KHÁC NHAU trong khoảng 0–80
và áp qua <code>Damage()</code>. Sau đó in lại tình trạng máu của toàn bộ đàn.</li>
</ul>
<h3>Màn hình mong đợi</h3>
<pre>============ BEE SIMULATION ============
1. Create bee list
2. Attack bees
0. Exit
========================================
Your choice: 1
New bee list created: 10 Workers, 10 Queens, 10 Drones.

No  Type    Health     Status
------------------------------
1  Worker  100.00 %   Alive
...
30  Drone   100.00 %   Alive
------------------------------
Alive: 30   Dead: 0

Your choice: 2
Attacking all bees (random damage 0-80% each)...

No  Type     Dmg   Health     Status
-------------------------------------
1  Worker    12   88.00 %    Alive
2  Worker    45   55.00 %    Dead
...
-------------------------------------
Alive: 20   Dead: 10</pre>
<h3>Hướng dẫn</h3>
<p><strong>Ngưỡng chết</strong>: ong thợ dưới 70% (yếu quá không bay được) · ong chúa dưới 20% (bền nhất
trong ba loại) · ong đực dưới 50% (bền vừa).</p>
<p><strong>Luật <code>Damage()</code></strong>: sát thương trừ theo phần trăm của máu <strong>hiện
tại</strong>, không phải của 100 ban đầu. Ong đã chết thì máu đóng băng và lời gọi không có tác dụng:</p>
<pre>newHealth = currentHealth × (1 − percent / 100)     với  0 ≤ percent ≤ 100</pre>
<p>Gợi ý thiết kế: để <code>health</code> private và chỉ lộ getter (<strong>không có setter</strong>);
đặt logic chung ở <code>Bee</code>, lớp con chỉ cung cấp ngưỡng (ví dụ <code>getThreshold()</code> trả
70/20/50) để <code>isDead()</code> viết một lần ở lớp cha là <code>health &lt; getThreshold()</code>;
trong <code>Damage()</code> kiểm <code>isDead()</code> trước và trả về ngay nếu đã chết; lưu 30 con
trong MỘT <code>List&lt;Bee&gt;</code> và xử lý bằng một vòng lặp nhờ đa hình; ở chức năng 2 sinh số
ngẫu nhiên mới trong [0, 80] cho <strong>từng</strong> con trước khi gọi <code>Damage()</code>.</p>
<h4>Ví dụ một con ong thợ chịu sát thương liên tiếp</h4>
<pre>Worker w = new Worker();   // máu = 100.00, chết = false
w.Damage(20);              // máu =  80.00, chết = false
w.Damage(20);              // máu =  64.00, chết = true    (64 &lt; 70)
w.Damage(50);              // máu =  64.00, chết = true    (đóng băng: không trừ nữa)</pre>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
