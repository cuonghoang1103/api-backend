/**
 * PRO192 · Progress Test 2 viết lại — 20 câu (CLO3,4,8,9).
 * Quiz viết lại (20 câu, giữ slug pro192-progress-test-2).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/PRO192/gen/gen.mjs từ gen/src/**, gen/java/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node PRO192/gen/gen.mjs`.
 */

/* ───────── Quiz (pro192-progress-test-2) — 20 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 1500,
  questions: [
    { id: 'q1',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Đoạn code in ra gì?',
      code: `class Employee {
    private String id;
    private double salary;
    public void setSalary(double s) { salary = s; }
    public double getSalary() { return salary; }
    public String getId() { return id; }
}
public class Q1 {
    public static void main(String[] args) {
        Employee e = new Employee();
        e.setSalary(1000);
        try {
            if (e.getSalary() > 500 && e.getId().equals("NV001")) {
                System.out.println("This is a manager");
            } else {
                System.out.println("Not a manager");
            }
        } catch (Exception ex) {
            System.out.println("Some error occurred!");
        }
    }
}`,
      codeLang: 'java',
      options: ['This is a manager|||This is a manager', 'Some error occurred!|||Some error occurred!', 'Not a manager|||Not a manager', 'Compile error: id might not have been initialized|||Lỗi biên dịch: id might not have been initialized'],
      correctIndex: 1,
      points: 1,
      explanation: 'Output of the real program: "Some error occurred!". The left side (1000 > 500) is true, so && must evaluate the right side: getId() returns null — a FIELD that was never set has the default null (fields, unlike local variables, are initialised automatically, so it compiles) — and null.equals(...) throws a NullPointerException, caught by catch (Exception ex). Safer: "NV001".equals(e.getId()) returns false on null. Lesson 6.A.|||Output của chương trình thật: "Some error occurred!". Vế trái (1000 > 500) đúng, nên && phải tính vế phải: getId() trả về null — một TRƯỜNG chưa từng được gán có giá trị mặc định null (khác biến cục bộ, trường được khởi tạo tự động, nên biên dịch được) — và null.equals(...) ném NullPointerException, bị catch (Exception ex) bắt. Cách an toàn: "NV001".equals(e.getId()) trả false khi gặp null. Bài 6.A.' },
    { id: 'q2',
      question: '(FE question type) What is the result of compiling and running this code?|||(Dạng câu FE) Biên dịch và chạy đoạn code này cho kết quả gì?',
      code: `import java.io.*;
class Loader {
    void load() throws IOException { }
}
class FileLoader extends Loader {
    @Override
    void load() throws Exception { }
}
public class Main {
    public static void main(String[] args) throws Exception {
        new FileLoader().load();
        System.out.println("done");
    }
}`,
      codeLang: 'java',
      options: ['done|||done', 'Compile error: unreported exception Exception in main|||Lỗi biên dịch: unreported exception Exception trong main', 'An IOException at run time|||Một IOException lúc chạy', 'Compile error: load() in FileLoader cannot override load() in Loader|||Lỗi biên dịch: load() in FileLoader cannot override load() in Loader'],
      correctIndex: 3,
      points: 1,
      explanation: 'Measured with the real JDK 8 javac: "load() in FileLoader cannot override load() in Loader", with the extra line "overridden method does not throw Exception". Code written for a Loader is only prepared for IOException; a subclass may not surprise it with a broader checked exception. An override may declare the SAME exception, a SUBCLASS of it (FileNotFoundException) or none at all; unchecked exceptions are free. main is not the problem — it already declares throws Exception. Lesson 6.A.|||Đo bằng javac JDK 8 thật: "load() in FileLoader cannot override load() in Loader", kèm dòng phụ "overridden method does not throw Exception". Code viết cho một Loader chỉ chuẩn bị cho IOException; lớp con không được làm nó bất ngờ bằng một ngoại lệ checked rộng hơn. Bản ghi đè được khai báo CÙNG ngoại lệ, một LỚP CON của nó (FileNotFoundException) hoặc không khai báo gì; ngoại lệ unchecked thì tự do. main không phải chỗ lỗi — nó đã khai báo throws Exception. Bài 6.A.' },
    { id: 'q3',
      question: 'What is the result of compiling this code (Java 7 or later)?|||Biên dịch đoạn code này (Java 7 trở lên) cho kết quả gì?',
      code: `import java.io.*;
public class Main {
    public static void main(String[] args) {
        try {
            new FileReader("data.txt").close();
        } catch (FileNotFoundException | IOException e) {
            System.out.println("cannot read");
        }
    }
}`,
      codeLang: 'java',
      options: ['Compile error: Alternatives in a multi-catch statement cannot be related by subclassing|||Lỗi biên dịch: Alternatives in a multi-catch statement cannot be related by subclassing', 'It compiles; when data.txt is missing it prints cannot read|||Biên dịch được; khi thiếu data.txt thì in cannot read', 'Compile error: exception FileNotFoundException has already been caught|||Lỗi biên dịch: exception FileNotFoundException has already been caught', 'It compiles but the catch block can never run|||Biên dịch được nhưng khối catch không bao giờ chạy'],
      correctIndex: 0,
      points: 1,
      explanation: 'Measured with the real JDK 8 javac: "Alternatives in a multi-catch statement cannot be related by subclassing". FileNotFoundException IS-A IOException, so listing both in one catch (A | B) is pointless and javac forbids it — catch (IOException e) alone already covers both. Multi-catch is for UNRELATED types, e.g. catch (NumberFormatException | IOException e). C is the message for two separate catch blocks with the parent first (Chapter 6 quiz). Lesson 6.A.|||Đo bằng javac JDK 8 thật: "Alternatives in a multi-catch statement cannot be related by subclassing". FileNotFoundException LÀ MỘT IOException, nên liệt kê cả hai trong một catch (A | B) là vô nghĩa và javac cấm — một mình catch (IOException e) đã bao cả hai. Multi-catch dành cho các kiểu KHÔNG liên quan, vd catch (NumberFormatException | IOException e). C là thông báo của hai khối catch riêng với lớp cha đứng trước (quiz Chương 6). Bài 6.A.' },
    { id: 'q4',
      question: "(FE question type) When should you pass a cause to an exception's constructor? What does this program print?|||(Dạng câu FE) Khi nào nên truyền nguyên nhân (cause) vào constructor của ngoại lệ? Chương trình in ra gì?",
      code: `public class Q4 {
    static int parseAge(String s) {
        try {
            return Integer.parseInt(s);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("bad age: " + s, e);
        }
    }

    public static void main(String[] args) {
        try {
            parseAge("2O");
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage() + " / cause: " + e.getCause().getClass().getSimpleName());
        }
    }
}`,
      codeLang: 'java',
      options: ['bad age: 2O / cause: null|||bad age: 2O / cause: null', 'For input string: "2O" / cause: NumberFormatException|||For input string: "2O" / cause: NumberFormatException', 'bad age: 2O / cause: NumberFormatException|||bad age: 2O / cause: NumberFormatException', 'Compile error: IllegalArgumentException must be declared with throws|||Lỗi biên dịch: IllegalArgumentException phải khai báo bằng throws'],
      correctIndex: 2,
      points: 1,
      explanation: 'Output of the real program: "bad age: 2O / cause: NumberFormatException" (the input has a letter O, not a zero). You pass a cause when you throw a new exception IN RESPONSE to catching another one: the caller gets a business-level message, and getCause() — plus the "Caused by:" part of the stack trace — still shows the original error. Without the second argument getCause() would be null (A). IllegalArgumentException is unchecked, so no throws is needed. Lesson 6.A.|||Output của chương trình thật: "bad age: 2O / cause: NumberFormatException" (dữ liệu có chữ O, không phải số 0). Truyền cause khi bạn ném một ngoại lệ mới ĐỂ ĐÁP LẠI việc bắt được một ngoại lệ khác: bên gọi nhận thông báo ở mức nghiệp vụ, còn getCause() — và phần "Caused by:" của stack trace — vẫn cho thấy lỗi gốc. Thiếu đối số thứ hai thì getCause() là null (A). IllegalArgumentException là unchecked nên không cần throws. Bài 6.A.' },
    { id: 'q5',
      question: 'What is printed?|||Đoạn code in ra gì?',
      code: `class Res implements AutoCloseable {
    String name;
    Res(String name) { this.name = name; System.out.print("open " + name + " "); }
    public void close() { System.out.print("close " + name + " "); }
}
public class Q5 {
    public static void main(String[] args) {
        try (Res a = new Res("A"); Res b = new Res("B")) {
            System.out.print("body ");
            throw new RuntimeException("x");
        } catch (RuntimeException e) {
            System.out.print("catch ");
        } finally {
            System.out.print("finally");
        }
    }
}`,
      codeLang: 'java',
      options: ['open A open B body catch close B close A finally|||open A open B body catch close B close A finally', 'open A open B body close A close B catch finally|||open A open B body close A close B catch finally', 'open A open B body close B close A catch finally|||open A open B body close B close A catch finally', 'open A open B body catch finally|||open A open B body catch finally'],
      correctIndex: 2,
      points: 1,
      explanation: 'Output of the real program: "open A open B body close B close A catch finally". try-with-resources (Java 7, so allowed on the JDK 8 exam machine) closes every resource automatically when the block ends — normally or by an exception — in REVERSE order of opening (B was opened last, so it closes first), and it does so BEFORE catch and finally run. That is why it replaced the old pattern of closing files by hand in finally. Any class that implements AutoCloseable can be used. Lesson 6.A and Chapter 9.|||Output của chương trình thật: "open A open B body close B close A catch finally". try-with-resources (Java 7, nên dùng được trên máy thi JDK 8) tự đóng mọi tài nguyên khi khối kết thúc — bình thường hay do ngoại lệ — theo thứ tự NGƯỢC với lúc mở (B mở sau nên đóng trước), và đóng TRƯỚC khi catch và finally chạy. Vì vậy nó thay cho kiểu cũ tự đóng file bằng tay trong finally. Lớp nào implements AutoCloseable cũng dùng được. Bài 6.A và Chương 9.' },
    { id: 'q6',
      question: 'What happens when this code runs?|||Điều gì xảy ra khi đoạn code chạy?',
      code: `Object[] arr = new String[2];
arr[0] = "OK";
arr[1] = Integer.valueOf(1);
System.out.println(arr[0] + " " + arr[1]);`,
      codeLang: 'java',
      options: ['An ArrayStoreException is thrown at arr[1] = Integer.valueOf(1)|||Ném ArrayStoreException ở dòng arr[1] = Integer.valueOf(1)', 'It prints OK 1|||In ra OK 1', 'Compile error: incompatible types: Integer cannot be converted to String|||Lỗi biên dịch: incompatible types: Integer cannot be converted to String', 'A ClassCastException is thrown at Object[] arr = new String[2]|||Ném ClassCastException ở dòng Object[] arr = new String[2]'],
      correctIndex: 0,
      points: 1,
      explanation: 'The real program catches java.lang.ArrayStoreException: java.lang.Integer. Arrays are covariant: a String[] IS-A Object[], so the first line compiles and runs. The compiler only sees the declared type Object[], so storing an Integer also compiles — but every array remembers its REAL element type and checks each store at run time. This hole is one reason why generics (List<String>) do not allow List<Object> list = new ArrayList<String>(); at all. Lesson 7.A.|||Chương trình thật bắt được java.lang.ArrayStoreException: java.lang.Integer. Mảng là hiệp biến (covariant): String[] LÀ MỘT Object[], nên dòng đầu biên dịch và chạy được. Trình biên dịch chỉ thấy kiểu khai báo Object[], nên cất một Integer cũng biên dịch được — nhưng mỗi mảng nhớ kiểu phần tử THẬT của nó và kiểm từng lần cất lúc chạy. Lỗ hổng này là một lý do generics (List<String>) cấm hẳn List<Object> list = new ArrayList<String>();. Bài 7.A.' },
    { id: 'q7',
      question: '(FE question type, made precise) A extends B, and only B implements Comparable. What does sorting this mixed array print?|||(Dạng câu FE, viết lại cho rõ) A extends B, và chỉ B implements Comparable. Sắp mảng trộn này in ra gì?',
      code: `class B implements Comparable<B> {
    int v;
    B(int v) { this.v = v; }
    public int compareTo(B o) { return v - o.v; }
    public String toString() { return "B" + v; }
}
class A extends B {
    A(int v) { super(v); }
    public String toString() { return "A" + v; }
}
public class Q7 {
    public static void main(String[] args) {
        B[] arr = { new A(3), new B(1), new A(2), new B(4) };
        Arrays.sort(arr);
        System.out.println(Arrays.toString(arr));
    }
}`,
      codeLang: 'java',
      options: ['[A2, A3, B1, B4]|||[A2, A3, B1, B4]', 'A ClassCastException, because A and B are different classes|||Một ClassCastException, vì A và B là hai lớp khác nhau', '[A3, B1, A2, B4]|||[A3, B1, A2, B4]', '[B1, A2, A3, B4]|||[B1, A2, A3, B4]'],
      correctIndex: 3,
      points: 1,
      explanation: "Output of the real program: \"[B1, A2, A3, B4]\". An A IS-A B, so it inherits compareTo(B) and every pair can be compared by v; the array is sorted by number, ignoring the class. The FE bank asks this question without saying which class implements Comparable, and two papers give opposite answers (\"sorted by B's method\" in FE24, \"ClassCastException\" in FE26). Both can happen: with Comparable in the parent you get this output; if neither class implemented it you would get the exception. Lesson 7.A.|||Output của chương trình thật: \"[B1, A2, A3, B4]\". Một A LÀ MỘT B, nên nó kế thừa compareTo(B) và mọi cặp so được theo v; mảng được sắp theo số, bỏ qua lớp. Ngân hàng FE hỏi câu này mà không nói lớp nào implements Comparable, và hai đề cho đáp án ngược nhau (\"theo phương thức của B\" ở FE24, \"ClassCastException\" ở FE26). Cả hai đều có thể xảy ra: Comparable ở lớp cha thì ra output này; nếu không lớp nào hiện thực nó thì mới có ngoại lệ. Bài 7.A." },
    { id: 'q8',
      question: '(FE question type) Which line does NOT compile?|||(Dạng câu FE) Dòng nào KHÔNG biên dịch được?',
      code: `public class Main {
    public static void main(String[] args) {
        Object ob = new Object();
        String[] stringarr = new String[50];
        Float floater = new Float(3.14f);
        ob = stringarr;
        ob = stringarr[5];
        floater = ob;
        ob = floater;
    }
}`,
      codeLang: 'java',
      options: ['ob = stringarr;|||ob = stringarr;', 'floater = ob;|||floater = ob;', 'ob = stringarr[5];|||ob = stringarr[5];', 'ob = floater;|||ob = floater;'],
      correctIndex: 1,
      points: 1,
      explanation: 'The real JDK 8 javac rejects exactly one line, floater = ob; ("incompatible types: Object cannot be converted to Float"). Going UP (any reference to Object, an array to Object, a Float to Object) is always allowed implicitly. Going DOWN from Object to Float needs a cast, (Float) ob, which the compiler accepts and the JVM checks at run time. ob = stringarr[5] compiles too — it just stores null, the default value of an element of a new String[50]. Lesson 7.A.|||javac JDK 8 thật từ chối đúng một dòng, floater = ob; ("incompatible types: Object cannot be converted to Float"). Đi LÊN (tham chiếu bất kỳ sang Object, mảng sang Object, Float sang Object) luôn được phép ngầm. Đi XUỐNG từ Object sang Float thì cần ép kiểu, (Float) ob, trình biên dịch chấp nhận và JVM kiểm lúc chạy. ob = stringarr[5] cũng biên dịch được — nó chỉ cất null, giá trị mặc định của phần tử trong một new String[50]. Bài 7.A.' },
    { id: 'q9',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `class Pen implements Comparable<Pen> {
    String color;
    int price;
    Pen(String color, int price) { this.color = color; this.price = price; }
    public String toString() { return "(" + color + "," + price + ") "; }
    public int compareTo(Pen x) {
        int k = color.compareTo(x.color);
        if (k != 0) return -k;
        return x.price - price;
    }
}
public class Q9 {
    public static void main(String[] args) {
        List<Pen> t = new ArrayList<Pen>();
        t.add(new Pen("B", 3));
        t.add(new Pen("C", 4));
        t.add(new Pen("D", 7));
        t.add(new Pen("C", 5));
        t.add(new Pen("A", 6));
        Collections.sort(t);
        System.out.println(t);
    }
}`,
      codeLang: 'java',
      options: ['[(D,7) , (C,5) , (C,4) , (B,3) , (A,6) ]|||[(D,7) , (C,5) , (C,4) , (B,3) , (A,6) ]', '[(A,6) , (B,3) , (C,4) , (C,5) , (D,7) ]|||[(A,6) , (B,3) , (C,4) , (C,5) , (D,7) ]', '[(D,7) , (C,4) , (C,5) , (B,3) , (A,6) ]|||[(D,7) , (C,4) , (C,5) , (B,3) , (A,6) ]', '[(A,6) , (B,3) , (C,5) , (C,4) , (D,7) ]|||[(A,6) , (B,3) , (C,5) , (C,4) , (D,7) ]'],
      correctIndex: 0,
      points: 1,
      explanation: 'Output of the real program: "[(D,7) , (C,5) , (C,4) , (B,3) , (A,6) ]". return -k reverses the colour order (D before A). For the two C pens the colours tie, so x.price - price decides: it is positive when THIS pen is cheaper, which puts the more expensive pen first (5 before 4). Read compareTo as "negative = I come first". The spaces before the commas come from toString(), which ends with a space. Chapter 8.|||Output của chương trình thật: "[(D,7) , (C,5) , (C,4) , (B,3) , (A,6) ]". return -k đảo thứ tự màu (D trước A). Với hai bút màu C, màu hoà nhau nên x.price - price quyết định: nó dương khi bút NÀY rẻ hơn, tức bút đắt hơn đứng trước (5 trước 4). Đọc compareTo là "âm = tôi đứng trước". Dấu cách trước dấu phẩy đến từ toString(), vốn kết thúc bằng một dấu cách. Chương 8.' },
    { id: 'q10',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `public class Q10 {
    void swap(Integer t1, Integer t2) {
        int temp = t1;
        t1 = t2;
        t2 = temp;
    }
    void f1() {
        List<Integer> list = new ArrayList<Integer>();
        list.add(1);
        list.add(2);
        swap(list.get(0), list.get(1));
        System.out.println(list);
    }
    public static void main(String[] args) {
        new Q10().f1();
    }
}`,
      codeLang: 'java',
      options: ['[2, 1]|||[2, 1]', '[1, 1]|||[1, 1]', '[1, 2]|||[1, 2]', '[2, 2]|||[2, 2]'],
      correctIndex: 2,
      points: 1,
      explanation: 'Output of the real program: "[1, 2]". list.get(0) and list.get(1) pass two REFERENCES by value; inside swap, t1 and t2 are local copies, and swapping them changes nothing outside (Integer is immutable anyway — there is no method to change its value). To really swap you must touch the list: Collections.swap(list, 0, 1) or list.set(...). Chapter 8 (pass by value: Chapter 2).|||Output của chương trình thật: "[1, 2]". list.get(0) và list.get(1) truyền hai THAM CHIẾU theo giá trị; trong swap, t1 và t2 là bản sao cục bộ, đổi chỗ chúng không thay đổi gì bên ngoài (đằng nào Integer cũng bất biến — không có phương thức nào đổi giá trị của nó). Muốn đổi thật phải chạm vào list: Collections.swap(list, 0, 1) hoặc list.set(...). Chương 8 (truyền theo giá trị: Chương 2).' },
    { id: 'q11',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `class Employee {
    private String id;
    private String name;
    Employee(String id, String name) { this.id = id; this.name = name; }
    String getName() { return name; }
}
public class Q11 {
    public static void main(String[] args) {
        Map<String, Employee> emp = new HashMap<String, Employee>();
        emp.put("A", new Employee("A", "John Doe"));
        emp.put("B", new Employee("B", "Mark David"));
        emp.put("A", new Employee("A", "Rose Mary"));
        System.out.println(emp.get("A").getName() + " " + emp.size());
    }
}`,
      codeLang: 'java',
      options: ['John Doe 3|||John Doe 3', 'Rose Mary 2|||Rose Mary 2', 'John Doe 2|||John Doe 2', 'Rose Mary 3|||Rose Mary 3'],
      correctIndex: 1,
      points: 1,
      explanation: 'Output of the real program: "Rose Mary 2". A Map keeps at most ONE value per key: the third put with key "A" replaces John Doe (put returns the old value) instead of adding an entry, so the size stays 2. To refuse duplicates, check first with containsKey, or use putIfAbsent (Java 8). This is exactly the "duplicate ID" rule of LAB211 and PE questions. Chapter 8.|||Output của chương trình thật: "Rose Mary 2". Map giữ tối đa MỘT giá trị cho mỗi khoá: lần put thứ ba với khoá "A" thay John Doe (put trả về giá trị cũ) chứ không thêm mục mới, nên size vẫn là 2. Muốn từ chối trùng thì kiểm trước bằng containsKey, hoặc dùng putIfAbsent (Java 8). Đây đúng là luật "trùng mã" của LAB211 và các câu PE. Chương 8.' },
    { id: 'q12',
      question: '(FE question type) What happens when you compile and run this program?|||(Dạng câu FE) Biên dịch và chạy chương trình này thì sao?',
      code: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Vector<Integer> t = new Vector<Integer>();
        t.add(12);
        t.add(2);
        t.add(6);
        t.add(2.4);
        Iterator<Integer> i = t.iterator();
        int sum = 0;
        while (i.hasNext()) sum += i.next();
        System.out.println(sum);
    }
}`,
      codeLang: 'java',
      options: ['It prints 20|||In ra 20', 'It prints 22|||In ra 22', 'A ClassCastException when the iterator reaches 2.4|||Một ClassCastException khi iterator tới 2.4', 'Compile error: no suitable method found for add(double)|||Lỗi biên dịch: no suitable method found for add(double)'],
      correctIndex: 3,
      points: 1,
      explanation: 'Measured with the real JDK 8 javac: "no suitable method found for add(double)" with the detail "argument mismatch; double cannot be converted to Integer". This is the whole point of generics: a Vector<Integer> accepts only Integer, and the mistake is caught by the COMPILER instead of exploding later. 2.4 can only be boxed to Double, never to Integer. With a raw Vector the add would compile and the ClassCastException of C would appear at run time instead. Chapter 8.|||Đo bằng javac JDK 8 thật: "no suitable method found for add(double)" kèm chi tiết "argument mismatch; double cannot be converted to Integer". Đó chính là ý nghĩa của generics: Vector<Integer> chỉ nhận Integer, và lỗi bị TRÌNH BIÊN DỊCH bắt thay vì nổ ra về sau. 2.4 chỉ đóng hộp được thành Double, không bao giờ thành Integer. Với Vector thô (raw) thì add biên dịch được và ClassCastException ở C sẽ xuất hiện lúc chạy. Chương 8.' },
    { id: 'q13',
      question: '(FE question type) Q13 does not implement Comparable. What is printed on JDK 8?|||(Dạng câu FE) Q13 không implements Comparable. Trên JDK 8 chương trình in ra gì?',
      code: `public class Q13 {
    public static void main(String[] args) {
        Set<Q13> set = new TreeSet<Q13>();
        try {
            set.add(new Q13());
            System.out.print("1 ");
            set.add(new Q13());
            System.out.print("2 ");
            set.add(new Q13());
            System.out.print("3 ");
        } catch (ClassCastException e) {
            System.out.print("ClassCastException");
        }
    }
}`,
      codeLang: 'java',
      options: ['1 2 3|||1 2 3', 'ClassCastException|||ClassCastException', '1 ClassCastException|||1 ClassCastException', 'Compile error: Q13 is not Comparable|||Lỗi biên dịch: Q13 không phải Comparable'],
      correctIndex: 1,
      points: 1,
      explanation: 'Output of the real program: "ClassCastException" — even the FIRST add fails. A TreeSet keeps its elements sorted, so it must compare them; without a Comparator it casts each element to Comparable. Since Java 7 the first put compares the key with itself just to check this, so nothing is printed before the exception (Java 6 only failed at the second add, which is why answer C appears in old papers). It compiles because TreeSet<E> does not require E extends Comparable. Fix: implement Comparable or pass a Comparator to the constructor. Chapter 8.|||Output của chương trình thật: "ClassCastException" — ngay lần add ĐẦU TIÊN đã hỏng. TreeSet giữ phần tử có thứ tự nên phải so sánh chúng; không có Comparator thì nó ép từng phần tử sang Comparable. Từ Java 7, lần put đầu tiên so khoá với chính nó chỉ để kiểm điều này, nên không có gì được in trước ngoại lệ (Java 6 chỉ hỏng ở lần add thứ hai, vì thế phương án C còn trong đề cũ). Biên dịch được vì TreeSet<E> không đòi E extends Comparable. Sửa: implements Comparable hoặc truyền Comparator vào constructor. Chương 8.' },
    { id: 'q14',
      question: '(FE question type) How many bytes does this code write to the file dest?|||(Dạng câu FE) Đoạn code ghi bao nhiêu byte vào file dest?',
      code: `FileOutputStream fos = new FileOutputStream("dest");
DataOutputStream dos = new DataOutputStream(fos);
dos.writeInt(3);
dos.writeFloat(0.0001f);
dos.close();
System.out.println(new File("dest").length());`,
      codeLang: 'java',
      options: ['8|||8', '2|||2', '7|||7', '16|||16'],
      correctIndex: 0,
      points: 1,
      explanation: 'Output of the real program: 8. DataOutputStream writes primitives in their fixed binary size, independent of the value: writeInt = 4 bytes, writeFloat = 4 bytes (writeLong / writeDouble = 8, writeChar = 2, writeByte = 1). 7 is what you would get by writing the TEXT "3" and "1.0E-4" with a Writer. Binary files are compact and exact but unreadable in Notepad; you must read them back with DataInputStream in the same order. Chapter 9.|||Output của chương trình thật: 8. DataOutputStream ghi kiểu nguyên thủy theo kích thước nhị phân cố định, không phụ thuộc giá trị: writeInt = 4 byte, writeFloat = 4 byte (writeLong / writeDouble = 8, writeChar = 2, writeByte = 1). 7 là kết quả nếu ghi CHỮ "3" và "1.0E-4" bằng một Writer. File nhị phân gọn và chính xác nhưng mở Notepad không đọc được; phải đọc lại bằng DataInputStream đúng thứ tự đã ghi. Chương 9.' },
    { id: 'q15',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `class A {
    String name;
    int age;
    A(String name, int age) { this.name = name; this.age = age; }
}
public class Q15 {
    public static void main(String[] args) {
        try {
            FileOutputStream fos = new FileOutputStream("xxx.ser");
            ObjectOutputStream oos = new ObjectOutputStream(fos);
            oos.writeObject(new A("HOA", 22));
            oos.close();
            System.out.println("saved");
        } catch (Exception x) {
            System.out.println(x.getClass().getSimpleName());
        }
    }
}`,
      codeLang: 'java',
      options: ['saved|||saved', 'Compile error: A must implement Serializable|||Lỗi biên dịch: A phải implements Serializable', 'FileNotFoundException|||FileNotFoundException', 'NotSerializableException|||NotSerializableException'],
      correctIndex: 3,
      points: 1,
      explanation: 'Output of the real program: "NotSerializableException". writeObject(Object) accepts any object, so javac cannot know — the check happens at run time, and a class must say "implements java.io.Serializable" (a marker interface with no methods) to be written. Measured detail: xxx.ser is still created (883 bytes: the stream header plus the serialized exception itself), so a failed save leaves a broken file behind. Fix: class A implements Serializable — and every field type must be serializable too. Chapter 9.|||Output của chương trình thật: "NotSerializableException". writeObject(Object) nhận mọi đối tượng nên javac không biết trước được — việc kiểm diễn ra lúc chạy, và lớp phải khai "implements java.io.Serializable" (interface đánh dấu, không có phương thức) mới được ghi. Chi tiết đo được: file xxx.ser vẫn được tạo (883 byte: phần đầu luồng cộng chính ngoại lệ đã được tuần tự hoá), nên một lần lưu thất bại để lại file hỏng. Sửa: class A implements Serializable — và mọi kiểu của các trường cũng phải tuần tự hoá được. Chương 9.' },
    { id: 'q16',
      question: '(FE question type) What is printed?|||(Dạng câu FE) Chương trình in ra gì?',
      code: `class Student implements Serializable {
    String name;
    transient int pin;
    Student(String name, int pin) { this.name = name; this.pin = pin; }
}
public class Q16 {
    public static void main(String[] args) throws Exception {
        ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("st.dat"));
        out.writeObject(new Student("An", 1234));
        out.close();
        ObjectInputStream in = new ObjectInputStream(new FileInputStream("st.dat"));
        Student s = (Student) in.readObject();
        in.close();
        System.out.println(s.name + " " + s.pin);
    }
}`,
      codeLang: 'java',
      options: ['An 1234|||An 1234', 'null 0|||null 0', 'An 0|||An 0', 'NotSerializableException|||NotSerializableException'],
      correctIndex: 2,
      points: 1,
      explanation: 'Output of the real program: "An 0". transient means "do not write this field": name travels to the file, pin does not. When the object is read back, its constructor does NOT run, so the skipped field gets its default value (0 for int, null for an object). Static fields are not written either — they belong to the class, not to the object. Use transient for passwords, caches and anything that must not be saved. Chapter 9.|||Output của chương trình thật: "An 0". transient nghĩa là "đừng ghi trường này": name đi vào file, pin thì không. Khi đọc đối tượng trở lại, constructor của nó KHÔNG chạy, nên trường bị bỏ qua nhận giá trị mặc định (0 với int, null với đối tượng). Trường static cũng không được ghi — nó thuộc về lớp, không thuộc đối tượng. Dùng transient cho mật khẩu, dữ liệu đệm và mọi thứ không được lưu. Chương 9.' },
    { id: 'q17',
      question: '(FE question type, variant) test.txt has 4 lines: Hello / Xin chao / Hallo / Anyong Haseyo. The loop reads 5 times. What is printed?|||(Dạng câu FE, biến thể) test.txt có 4 dòng: Hello / Xin chao / Hallo / Anyong Haseyo. Vòng lặp đọc 5 lần. Chương trình in ra gì?',
      code: `BufferedReader bf = new BufferedReader(new FileReader("test.txt"));
String line = "";
for (int i = 0; i < 5; i++) {
    line = bf.readLine();
}
bf.close();
System.out.println(line);`,
      codeLang: 'java',
      options: ['null|||null', 'Anyong Haseyo|||Anyong Haseyo', 'An EOFException is thrown|||Ném ra EOFException', 'Hello|||Hello'],
      correctIndex: 0,
      points: 1,
      explanation: 'Output of the real program: "null". readLine() returns null at the end of the file instead of throwing — EOFException belongs to DataInputStream / ObjectInputStream. The fifth call overwrites "Anyong Haseyo" with null. That is why the standard loop is while ((line = br.readLine()) != null) { … }, which never processes a null line. With k = 2 (the original FE question) the output is "Xin chao". Chapter 9.|||Output của chương trình thật: "null". readLine() trả về null khi hết file chứ không ném ngoại lệ — EOFException là của DataInputStream / ObjectInputStream. Lần gọi thứ năm ghi đè "Anyong Haseyo" bằng null. Vì thế vòng lặp chuẩn là while ((line = br.readLine()) != null) { … }, không bao giờ xử lý một dòng null. Với k = 2 (câu FE gốc) output là "Xin chao". Chương 9.' },
    { id: 'q18',
      question: '(FE question type) The program runs in an empty directory. What is printed?|||(Dạng câu FE) Chương trình chạy trong một thư mục rỗng. Nó in ra gì?',
      code: `File f1 = new File("dirname");
File f2 = new File(f1, "filename");
System.out.println(f1.exists() + " " + f2.exists());`,
      codeLang: 'java',
      options: ['true false|||true false', 'true true|||true true', 'false true|||false true', 'false false|||false false'],
      correctIndex: 3,
      points: 1,
      explanation: 'Output of the real program: "false false" — no directory and no file is created. A File object is only a PATH in memory; creating one touches nothing on disk. You must ask explicitly: f1.mkdir() (or mkdirs()) creates the folder, f2.createNewFile() creates an empty file, and opening a FileWriter/FileOutputStream creates the file (but not missing folders). exists() is how you check before reading. Chapter 9.|||Output của chương trình thật: "false false" — không thư mục, không file nào được tạo. Đối tượng File chỉ là một ĐƯỜNG DẪN trong bộ nhớ; tạo nó không chạm gì tới đĩa. Phải yêu cầu tường minh: f1.mkdir() (hoặc mkdirs()) tạo thư mục, f2.createNewFile() tạo file rỗng, và mở một FileWriter/FileOutputStream thì tạo file (nhưng không tạo thư mục còn thiếu). exists() là cách kiểm trước khi đọc. Chương 9.' },
    { id: 'q19',
      question: '(FE question type) read(name) returns the content of the file. What is printed?|||(Dạng câu FE) read(name) trả về nội dung của file. Chương trình in ra gì?',
      code: `FileWriter w = new FileWriter("log.txt");
w.write("A");
w.close();
w = new FileWriter("log.txt", true);
w.write("B");
w.close();
System.out.print(read("log.txt") + " ");
w = new FileWriter("log.txt");
w.write("C");
w.close();
System.out.println(read("log.txt"));`,
      codeLang: 'java',
      options: ['AB ABC|||AB ABC', 'B C|||B C', 'AB C|||AB C', 'A C|||A C'],
      correctIndex: 2,
      points: 1,
      explanation: 'Output of the real program: "AB C". new FileWriter(name) opens the file for writing from the start and TRUNCATES it; new FileWriter(name, true) — the append parameter in the FileWriter constructor — keeps the content and writes after it. So A, then append B gives "AB", then a plain FileWriter wipes it and writes "C". The File class has no append parameter at all. Forgetting true is the classic "my save file only keeps the last record" bug. Chapter 9.|||Output của chương trình thật: "AB C". new FileWriter(tên) mở file để ghi từ đầu và XOÁ TRẮNG nó; new FileWriter(tên, true) — tham số append trong constructor của FileWriter — giữ nội dung cũ và ghi tiếp sau. Nên A, rồi ghi nối B được "AB", rồi một FileWriter thường xoá sạch và ghi "C". Lớp File hoàn toàn không có tham số append. Quên true là lỗi kinh điển "file lưu chỉ còn bản ghi cuối". Chương 9.' },
    { id: 'q20',
      question: '(FE question type) What is the content of result.dat after this code runs?|||(Dạng câu FE) Sau khi đoạn code chạy, file result.dat chứa gì?',
      code: `String file = "result.dat";
String[] num = {"An", "an", "An an"};
List<String> list = new ArrayList<String>(Arrays.asList(num));
Collections.sort(list);
PrintWriter out = new PrintWriter(file);
out.write(list.toString());
out.close();`,
      codeLang: 'java',
      options: ['[An, an, An an]|||[An, an, An an]', '[An, An an, an]|||[An, An an, an]', '[an, An, An an]|||[an, An, An an]', '[An an, An, an]|||[An an, An, an]'],
      correctIndex: 1,
      points: 1,
      explanation: 'Output of the real program (the file read back): "[An, An an, an]". Collections.sort uses String.compareTo, which compares character codes: uppercase A (65) comes before lowercase a (97), and "An" is a prefix of "An an", so the shorter string comes first. PrintWriter then writes list.toString() as text. For a human-friendly order use String.CASE_INSENSITIVE_ORDER or a Collator. Chapter 8 and 9.|||Output của chương trình thật (đọc lại file): "[An, An an, an]". Collections.sort dùng String.compareTo, so mã ký tự: chữ hoa A (65) đứng trước chữ thường a (97), và "An" là tiền tố của "An an" nên chuỗi ngắn hơn đứng trước. Rồi PrintWriter ghi list.toString() dạng chữ. Muốn thứ tự hợp mắt người thì dùng String.CASE_INSENSITIVE_ORDER hoặc một Collator. Chương 8 và 9.' },
  ],
};

export default {
  quiz: QUIZ,
  quizDescription: 'Progress Test 2 viết lại: 20 câu theo dạng câu FE PRO192 phủ Chương 6–9 (CLO3, 4, 8, 9), mỗi câu có giải thích song ngữ; câu "in ra gì" chạy thật trên JDK 8 và câu lỗi biên dịch đo bằng javac của JDK 8: NullPointerException trong điều kiện, throws khi ghi đè, multi-catch, ngoại lệ có nguyên nhân, try-with-resources, mảng hiệp biến và ArrayStoreException, sắp mảng đối tượng kế thừa Comparable, phép gán giữa Object và mảng, compareTo nhiều khoá, đổi chỗ Integer trong list, HashMap trùng khoá, generics chặn lúc biên dịch, TreeSet cần Comparable, DataOutputStream, NotSerializableException, transient, readLine quá cuối file, new File không tạo gì, FileWriter ghi nối, và thứ tự sắp xếp của String ghi ra file.',
};
