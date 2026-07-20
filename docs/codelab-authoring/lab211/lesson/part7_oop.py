# Part 7 — OOP: the four pillars, taught against the Shapes and Bees briefs.
from kit import h, p, ul, ol, table, code, out, mermaid, part, practice


def build():
    part(9, 'Object-oriented programming — the four pillars',
         'Lập trình hướng đối tượng — bốn tính chất',
         'Where the oral defence lives. Taught against the Shapes and Bees briefs',
         'Nơi diễn ra phần vấn đáp. Dạy bám vào chính đề Shapes và Bees')

    p('<p>This is where the oral defence lives. Eleven briefs use inheritance directly, and two of them '
      '— <em>Shapes</em> and <em>Bees</em> — exist for no other reason than to test whether you can '
      'build and explain a hierarchy.</p>'
      '<p>Learn the four pillars as a set. Examiners ask you to name them, then ask you to point at the '
      'line in <em>your</em> code where each one happens. The second question is the one that fails '
      'people.</p>',
      '<p>Đây chính là chỗ diễn ra phần vấn đáp. Mười một đề dùng kế thừa trực tiếp, và hai trong số đó — '
      '<em>Shapes</em> và <em>Bees</em> — sinh ra không vì lý do nào khác ngoài việc kiểm tra xem bạn có '
      'dựng và giải thích được một cây phân cấp lớp hay không.</p>'
      '<p>Hãy học bốn tính chất như một bộ. Giám khảo sẽ bảo bạn kể tên chúng, rồi bảo bạn chỉ vào dòng '
      'nào trong code <em>của bạn</em> thể hiện từng tính chất. Câu hỏi thứ hai mới là câu đánh trượt '
      'người ta.</p>')

    table(['Pillar', 'One sentence', 'In Java it looks like', 'Brief that tests it'],
          ['Tính chất', 'Một câu', 'Trong Java nhìn ra sao', 'Đề kiểm tra nó'],
          [['Encapsulation', 'state is private; the outside touches it only through methods',
            '<code>private</code> field + getter, no setter', 'Bees — health is read-only'],
           ['Inheritance', 'a subclass reuses a base class and adds to it',
            '<code>class Circle extends TwoDimensionalShape</code>', 'Shapes'],
           ['Polymorphism', 'one call, the right version runs at run time',
            '<code>@Override</code> + a base-typed variable', 'Shapes — array of Shape'],
           ['Abstraction', 'the base names what all of them do, without saying how',
            '<code>abstract</code> class or <code>interface</code>', 'Shapes, Bees']],
          [['Đóng gói (Encapsulation)', 'trạng thái để private; bên ngoài chỉ chạm qua phương thức',
            'trường <code>private</code> + getter, không có setter', 'Bees — health chỉ đọc'],
           ['Kế thừa (Inheritance)', 'lớp con dùng lại lớp cha rồi bổ sung thêm',
            '<code>class Circle extends TwoDimensionalShape</code>', 'Shapes'],
           ['Đa hình (Polymorphism)', 'một lời gọi, bản đúng được chạy lúc thực thi',
            '<code>@Override</code> + biến kiểu lớp cha', 'Shapes — mảng kiểu Shape'],
           ['Trừu tượng (Abstraction)', 'lớp cha nêu tên việc tất cả đều làm, không nói làm thế nào',
            'lớp <code>abstract</code> hoặc <code>interface</code>', 'Shapes, Bees']])

    h('Pillar 1 — Encapsulation', 'Tính chất 1 — Đóng gói')

    p('<p>The <em>Bees</em> brief states it precisely: health <em>"is not writable externally"</em>. '
      'That single sentence is a complete encapsulation exercise — a private field, a public getter, '
      'and <strong>no setter at all</strong>. Health changes only through <code>Damage()</code>, which '
      'is the rule of the simulation.</p>'
      '<p>The common mistake is to generate a getter <em>and</em> a setter for every field out of habit. '
      'A public setter for <code>health</code> destroys the very thing the brief is testing.</p>',
      '<p>Đề <em>Bees</em> nói rất chính xác: health <em>"is not writable externally"</em>. Chỉ một câu đó '
      'đã là một bài tập đóng gói hoàn chỉnh — trường private, getter public, và <strong>không có setter '
      'nào cả</strong>. Health chỉ thay đổi qua <code>Damage()</code>, đó là luật của mô phỏng.</p>'
      '<p>Sai lầm phổ biến là theo thói quen sinh cả getter <em>lẫn</em> setter cho mọi trường. Một setter '
      'public cho <code>health</code> phá huỷ đúng cái mà đề đang kiểm tra.</p>')

    code('Encapsulation done right — no setter, and the rule lives inside',
         'Đóng gói đúng cách — không setter, và luật nằm bên trong',
         """public abstract class Bee {

    private double health = 100;     // private: nothing outside can assign to it

    /** Read-only view. There is deliberately NO setHealth. */
    public double getHealth() {
        return health;
    }

    /** Each subclass decides the threshold at which it dies. */
    protected abstract double deathThreshold();

    public boolean isDead() {
        return health < deathThreshold();
    }

    /** The only way health can ever change. */
    public void damage(int percent) {
        if (percent < 0 || percent > 100) {
            throw new IllegalArgumentException("percent must be between 0 and 100");
        }
        if (isDead()) {
            return;              // brief: a dead bee records no further damage
        }
        health = health - health * percent / 100.0;
    }
}""")

    h('Pillars 2 and 4 — Inheritance and Abstraction',
      'Tính chất 2 và 4 — Kế thừa và Trừu tượng')

    p('<p><code>Bee</code> above is <code>abstract</code>: it says every bee <em>has</em> a death '
      'threshold without knowing what it is. You cannot write <code>new Bee()</code> — and that is the '
      'point, because "a bee" with no kind is not a thing in the problem.</p>',
      '<p>Lớp <code>Bee</code> ở trên là <code>abstract</code>: nó nói mọi con ong <em>đều có</em> một '
      'ngưỡng chết mà không cần biết ngưỡng đó là bao nhiêu. Bạn không thể viết <code>new Bee()</code> — và '
      'đó chính là ý đồ, vì "một con ong" không thuộc loại nào thì không tồn tại trong bài toán.</p>')

    code('Three subclasses, each supplying only what differs',
         'Ba lớp con, mỗi lớp chỉ cung cấp phần khác biệt',
         """import java.util.*;

class Worker extends Bee {
    @Override protected double deathThreshold() { return 70; }
    @Override public String toString() { return "Worker"; }
}

class Queen extends Bee {
    @Override protected double deathThreshold() { return 20; }
    @Override public String toString() { return "Queen"; }
}

class Drone extends Bee {
    @Override protected double deathThreshold() { return 50; }
    @Override public String toString() { return "Drone"; }
}

public class BeeDemo {
    public static void main(String[] args) {
        List<Bee> colony = new ArrayList<>();
        for (int i = 0; i < 2; i++) {
            colony.add(new Worker());
            colony.add(new Queen());
            colony.add(new Drone());
        }

        for (Bee b : colony) {
            b.damage(40);                 // ONE call - three different thresholds
        }

        for (Bee b : colony) {
            System.out.printf("%-7s health=%5.1f dead=%b%n",
                              b, b.getHealth(), b.isDead());
        }
    }
}""",
         deps=['Bee'])

    out('Real output', 'Kết quả chạy thật',
        """Worker  health= 60.0 dead=true
Queen   health= 60.0 dead=false
Drone   health= 60.0 dead=false
Worker  health= 60.0 dead=true
Queen   health= 60.0 dead=false
Drone   health= 60.0 dead=false""")

    p('<p>Read that output carefully — it is the whole lesson in six lines. Every bee took the same '
      'damage and every bee has the same health, yet only the workers are dead. Nothing in '
      '<code>main</code> knows about 70, 20 or 50. That is what "the subclass specialises only what '
      'differs" buys you.</p>',
      '<p>Hãy đọc kỹ kết quả đó — cả bài học nằm gọn trong sáu dòng. Mọi con ong chịu cùng lượng sát '
      'thương và có cùng mức health, vậy mà chỉ có ong thợ chết. Trong <code>main</code> không có chỗ nào '
      'biết đến các con số 70, 20 hay 50. Đó chính là thứ bạn nhận được từ "lớp con chỉ chuyên biệt hoá '
      'phần khác biệt".</p>')

    h('Pillar 3 — Polymorphism, and how to prove it',
      'Tính chất 3 — Đa hình, và cách chứng minh')

    p('<p>Polymorphism is the line <code>b.damage(40)</code> above. The variable is declared '
      '<code>Bee</code>; at run time the JVM calls the <code>deathThreshold()</code> of the actual '
      'object. The compiler does not decide this — the object does.</p>'
      '<p>The <em>Shapes</em> brief tests the same idea more visibly: one array of <code>Shape</code>, '
      'and the loop must decide per element whether it is 2-D or 3-D.</p>',
      '<p>Đa hình chính là dòng <code>b.damage(40)</code> ở trên. Biến được khai báo kiểu <code>Bee</code>; '
      'lúc chạy, JVM gọi <code>deathThreshold()</code> của đối tượng thật. Trình biên dịch không quyết định '
      'điều này — đối tượng quyết định.</p>'
      '<p>Đề <em>Shapes</em> kiểm tra đúng ý đó nhưng dễ thấy hơn: một mảng kiểu <code>Shape</code>, và '
      'vòng lặp phải tự xác định từng phần tử là hình 2 chiều hay 3 chiều.</p>')

    mermaid("""classDiagram
    class Shape {
      <<abstract>>
      +getArea() double
      +getName() String
    }
    class TwoDimensionalShape {
      <<abstract>>
    }
    class ThreeDimensionalShape {
      <<abstract>>
      +getVolume() double
    }
    Shape <|-- TwoDimensionalShape
    Shape <|-- ThreeDimensionalShape
    TwoDimensionalShape <|-- Circle
    TwoDimensionalShape <|-- Square
    ThreeDimensionalShape <|-- Sphere
    ThreeDimensionalShape <|-- Cube""")

    code('One array, two behaviours — the Shapes brief in miniature',
         'Một mảng, hai hành vi — bài Shapes thu nhỏ',
         """abstract class Shape {
    public abstract double getArea();
    public abstract String getName();
}

abstract class TwoDimensionalShape extends Shape { }

abstract class ThreeDimensionalShape extends Shape {
    public abstract double getVolume();
}

class Circle extends TwoDimensionalShape {
    private final double r;
    Circle(double r) { this.r = r; }
    @Override public double getArea() { return Math.PI * r * r; }
    @Override public String getName() { return "Circle"; }
}

class Cube extends ThreeDimensionalShape {
    private final double side;
    Cube(double side) { this.side = side; }
    @Override public double getArea()   { return 6 * side * side; }
    @Override public double getVolume() { return side * side * side; }
    @Override public String getName()   { return "Cube"; }
}

public class ShapeDemo {
    public static void main(String[] args) {
        Shape[] shapes = { new Circle(2), new Cube(3) };

        for (Shape s : shapes) {
            System.out.printf("%s area=%.2f", s.getName(), s.getArea());
            if (s instanceof ThreeDimensionalShape solid) {   // run-time type check
                System.out.printf(" volume=%.2f", solid.getVolume());
            }
            System.out.println();
        }
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        'Circle area=12.57\nCube area=54.00 volume=27.00')

    p('<p><code>instanceof ThreeDimensionalShape solid</code> tests the type and gives you a '
      'correctly-typed variable in one step. It is the modern replacement for testing and then casting, '
      'and it is exactly the "determine whether each shape is two-dimensional or three-dimensional" '
      'sentence in the brief.</p>',
      '<p><code>instanceof ThreeDimensionalShape solid</code> vừa kiểm tra kiểu vừa cho bạn luôn một biến '
      'đúng kiểu, gộp trong một bước. Đây là cách viết hiện đại thay cho việc kiểm tra rồi ép kiểu, và nó '
      'đúng bằng câu "xác định xem mỗi hình là 2 chiều hay 3 chiều" trong đề.</p>')

    h('abstract class or interface?', 'Chọn lớp abstract hay interface?')

    table(['Question', 'abstract class', 'interface'],
          ['Câu hỏi', 'lớp abstract', 'interface'],
          [['Relationship', '"is a kind of"', '"is able to"'],
           ['Shared fields', 'yes', 'no (constants only)'],
           ['How many can a class have', 'one', 'many'],
           ['In this track', '<code>Shape</code>, <code>Bee</code>',
            '<code>I_FunctionList</code> in the Long assignments']],
          [['Quan hệ diễn đạt', '"là một loại của"', '"có khả năng làm"'],
           ['Có trường dùng chung', 'có', 'không (chỉ hằng số)'],
           ['Một lớp có được bao nhiêu', 'một', 'nhiều'],
           ['Trong lộ trình này', '<code>Shape</code>, <code>Bee</code>',
            '<code>I_FunctionList</code> ở các bài Long']])

    p('<p>A <code>Circle</code> <em>is a</em> Shape, so <code>Shape</code> is an abstract class. A '
      'manager class <em>is able to</em> add, update and delete, so that contract is an interface. If '
      'you can say the relationship out loud with "is a" or "is able to", you have already justified '
      'your choice.</p>',
      '<p>Một <code>Circle</code> <em>là một</em> Shape, nên <code>Shape</code> là lớp abstract. Một lớp '
      'quản lý <em>có khả năng</em> thêm, sửa, xoá, nên hợp đồng đó là interface. Nếu bạn nói to được quan '
      'hệ đó bằng "là một" hay "có khả năng", tức là bạn đã biện minh xong cho lựa chọn của mình.</p>')

    h('toString, equals — the two overrides that pay off',
      'toString, equals — hai phương thức ghi đè đáng giá')

    code('Why your list prints Doctor@1b6d3586',
         'Vì sao danh sách của bạn in ra Doctor@1b6d3586',
         """import java.util.*;

class Doctor {
    private final String code;
    private final String name;

    Doctor(String code, String name) { this.code = code; this.name = name; }

    public String getCode() { return code; }

    @Override
    public String toString() {                    // without this you get Doctor@1b6d3586
        return String.format("%-6s %-15s", code, name);
    }

    @Override
    public boolean equals(Object o) {             // two doctors are the same if the code matches
        if (this == o) return true;
        if (!(o instanceof Doctor)) return false;
        return code.equals(((Doctor) o).code);
    }

    @Override
    public int hashCode() {                       // ALWAYS override together with equals
        return code.hashCode();
    }
}

public class DoctorDemo {
    public static void main(String[] args) {
        List<Doctor> list = new ArrayList<>();
        list.add(new Doctor("D001", "Tran Binh"));
        list.add(new Doctor("D002", "Le Hoa"));

        list.forEach(System.out::println);
        System.out.println(list.contains(new Doctor("D001", "anything")));
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        'D001   Tran Binh      \nD002   Le Hoa         \ntrue')

    p('<p>The <code>true</code> on the last line is <code>equals</code> doing its job: '
      '<code>contains</code> found the doctor by code even though the name was different. Override '
      '<code>hashCode</code> whenever you override <code>equals</code> — otherwise the object misbehaves '
      'inside a <code>HashMap</code>, and that is a favourite examiner question.</p>',
      '<p>Chữ <code>true</code> ở dòng cuối là <code>equals</code> đang làm việc: <code>contains</code> '
      'tìm ra bác sĩ theo mã dù tên khác hẳn. Hễ ghi đè <code>equals</code> thì phải ghi đè luôn '
      '<code>hashCode</code> — nếu không, đối tượng sẽ hoạt động sai bên trong <code>HashMap</code>, và '
      'đây là câu hỏi tủ của giám khảo.</p>')

    practice([
        (250, 'Inheritance, polymorphism, interfaces', 'Kế thừa, đa hình, interface',
         'Abstract classes, interfaces, overriding — the Shapes and Bees skills',
         'Lớp abstract, interface, ghi đè — đúng kỹ năng bài Shapes và Bees'),
        (249, 'OOP fundamentals', 'Nền tảng hướng đối tượng',
         'Encapsulation, toString, equals and hashCode — 10 exercises',
         'Đóng gói, toString, equals và hashCode — 10 bài'),
        ('build-a-shape-hierarchy-with-polymorphic-area-calculation',
         'Exercise: build a Shape hierarchy', 'Bài tập: dựng cây lớp Shape',
         'The same hierarchy as the Shapes brief, graded step by step',
         'Đúng cây phân cấp của đề Shapes, có chấm từng bước'),
        ('implement-a-polymorphic-payment-processing-system',
         'Exercise: polymorphic payments', 'Bài tập: đa hình với thanh toán',
         'One call, several implementations — polymorphism drilled again',
         'Một lời gọi, nhiều cách cài đặt — luyện lại đúng tính đa hình'),
    ])
