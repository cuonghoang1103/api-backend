# Part 6 — arrays, ArrayList, HashMap, Comparator.
from kit import h, p, ul, ol, table, code, out, mermaid, part, practice


def build():
    part(7, 'Storing many things: array, ArrayList, HashMap',
         'Lưu nhiều phần tử: mảng, ArrayList, HashMap',
         'Choosing the right structure, and the delete-while-looping trap',
         'Chọn đúng cấu trúc, và cái bẫy vừa duyệt vừa xoá')

    p('<p>25 briefs use a <code>List</code>, 14 use a plain array, 5 use a <code>HashMap</code>. '
      'Choosing the right one is a defence question, so know the trade-off rather than reaching for '
      'whichever you saw last.</p>',
      '<p>25 đề dùng <code>List</code>, 14 đề dùng mảng thường, 5 đề dùng <code>HashMap</code>. Chọn đúng '
      'cấu trúc là một câu hỏi vấn đáp, nên hãy nắm được đánh đổi giữa chúng thay vì bạ đâu dùng đó.</p>')

    table(['Structure', 'Size', 'Find by position', 'Find by key', 'Use it when'],
          ['Cấu trúc', 'Kích thước', 'Tìm theo vị trí', 'Tìm theo khoá', 'Dùng khi'],
          [['<code>int[]</code>', 'fixed at creation', 'instant', '—',
            'the brief says "an array of 3 persons"'],
           ['<code>ArrayList</code>', 'grows automatically', 'instant', 'scan the whole list',
            'you add and remove as the program runs'],
           ['<code>HashMap</code>', 'grows automatically', '—', 'instant',
            'you look things up by a unique id']],
          [['<code>int[]</code>', 'cố định khi tạo', 'tức thì', '—',
            'đề nói rõ "mảng 3 person"'],
           ['<code>ArrayList</code>', 'tự lớn lên', 'tức thì', 'phải duyệt cả danh sách',
            'bạn thêm/xoá trong lúc chương trình chạy'],
           ['<code>HashMap</code>', 'tự lớn lên', '—', 'tức thì',
            'bạn tra cứu theo một mã định danh duy nhất']])

    h('Arrays', 'Mảng')

    code('Everything you need from arrays', 'Tất cả những gì bạn cần ở mảng',
         """int[] a = new int[5];                    // five zeros
int[] b = {5, 1, 12, -5, 16};            // literal
System.out.println(b.length);            // 5   (a field, no brackets)
System.out.println(b[0] + " " + b[4]);   // 5 16
// b[5] would throw ArrayIndexOutOfBoundsException: index 5 out of bounds for length 5

for (int i = 0; i < b.length; i++) {     // classic loop: you need the index
    b[i] = b[i] * 2;
}
for (int value : b) {                    // for-each: you only need the values
    System.out.print(value + " ");
}
System.out.println();
System.out.println(Arrays.toString(b));  // easy printing while debugging""",
         kind='fragment')

    out('Real output', 'Kết quả chạy thật',
        '5\n5 16\n10 2 24 -10 32 \n[10, 2, 24, -10, 32]')

    p('<p>Use the indexed loop when you must write into the array or when you need the position; use '
      'for-each when you only read. Saying that sentence in a defence is worth more than knowing ten '
      'library methods.</p>',
      '<p>Dùng vòng lặp có chỉ số khi bạn cần ghi vào mảng hoặc cần biết vị trí; dùng for-each khi chỉ '
      'đọc. Nói được đúng câu đó trong buổi vấn đáp còn giá trị hơn thuộc mười phương thức thư viện.</p>')

    h('ArrayList — the default choice', 'ArrayList — lựa chọn mặc định')

    code('The seven operations the briefs need',
         'Bảy thao tác mà các đề cần đến',
         """List<String> names = new ArrayList<>();

names.add("Tran Binh");            // append
names.add("Le Hoa");
names.add(0, "An Nguyen");         // insert at a position

System.out.println(names.size());          // 3
System.out.println(names.get(1));          // Tran Binh
System.out.println(names.contains("Le Hoa"));   // true
System.out.println(names.indexOf("Le Hoa"));    // 2

names.set(1, "Tran Binh Minh");    // replace
names.remove("An Nguyen");         // remove by value
names.remove(0);                   // remove by index

System.out.println(names);
System.out.println(names.isEmpty());""",
         kind='fragment')

    out('Real output', 'Kết quả chạy thật',
        '3\nTran Binh\ntrue\n2\n[Le Hoa]\nfalse')

    p('<p>Declare the variable as <code>List</code> and create an <code>ArrayList</code>. It is the '
      'standard Java habit and it invites the best question you can be asked — "why?" — to which the '
      'answer is: the code depends only on what a list <em>does</em>, so the implementation can change '
      'without touching anything else.</p>',
      '<p>Khai báo biến kiểu <code>List</code> nhưng tạo <code>ArrayList</code>. Đây là thói quen chuẩn '
      'của Java và nó mời gọi đúng câu hỏi tốt nhất bạn có thể nhận — "vì sao?" — mà câu trả lời là: code '
      'chỉ phụ thuộc vào <em>những gì</em> một danh sách làm được, nên có thể đổi cách cài đặt mà không '
      'phải sửa chỗ nào khác.</p>')

    h('The remove-while-looping trap', 'Bẫy vừa duyệt vừa xoá')

    p('<p>Deleting from a list while a for-each walks it throws '
      '<code>ConcurrentModificationException</code>. Deleting with an index loop that goes forwards '
      'silently <em>skips</em> the next element — which is worse, because nothing crashes and the '
      'output is just wrong.</p>',
      '<p>Xoá phần tử khỏi danh sách trong lúc for-each đang duyệt sẽ ném '
      '<code>ConcurrentModificationException</code>. Còn xoá bằng vòng lặp chỉ số chạy xuôi thì lặng lẽ '
      '<em>bỏ sót</em> phần tử kế tiếp — điều này còn tệ hơn, vì không có gì báo lỗi mà kết quả thì sai.</p>')

    code('Three ways to delete, two of them broken',
         'Ba cách xoá, hai cách sai',
         """List<Integer> nums = new ArrayList<>(List.of(1, 2, 2, 3));

// BROKEN 1 - throws ConcurrentModificationException
// for (Integer n : nums) { if (n == 2) nums.remove(n); }

// BROKEN 2 - skips the second 2, leaves [1, 2, 3]
List<Integer> forwards = new ArrayList<>(List.of(1, 2, 2, 3));
for (int i = 0; i < forwards.size(); i++) {
    if (forwards.get(i) == 2) forwards.remove(i);
}
System.out.println(forwards);

// CORRECT - walk backwards, so removing never moves an unvisited element
List<Integer> backwards = new ArrayList<>(List.of(1, 2, 2, 3));
for (int i = backwards.size() - 1; i >= 0; i--) {
    if (backwards.get(i) == 2) backwards.remove(i);
}
System.out.println(backwards);

// ALSO CORRECT - removeIf says the intent in one line
System.out.println(nums);
nums.removeIf(n -> n == 2);
System.out.println(nums);""",
         kind='fragment')

    out('Real output', 'Kết quả chạy thật',
        '[1, 2, 3]\n[1, 3]\n[1, 2, 2, 3]\n[1, 3]')

    p('<p>The middle line is the lesson: the forwards loop produced <code>[1, 2, 3]</code> — it left a '
      '2 behind and reported no error at all.</p>',
      '<p>Dòng giữa chính là bài học: vòng lặp chạy xuôi cho ra <code>[1, 2, 3]</code> — nó bỏ sót một số '
      '2 và không hề báo lỗi gì.</p>')

    h('HashMap — when you look things up by id',
      'HashMap — khi bạn tra cứu theo mã')

    code('HashMap in the shape the briefs use it',
         'HashMap theo đúng cách các đề dùng',
         """Map<String, Double> salaries = new HashMap<>();

salaries.put("E001", 1200.0);
salaries.put("E002", 900.0);
salaries.put("E001", 1500.0);       // same key -> replaces, does not duplicate

System.out.println(salaries.size());                 // 2
System.out.println(salaries.get("E001"));            // 1500.0
System.out.println(salaries.get("E999"));            // null - not an error!
System.out.println(salaries.containsKey("E002"));    // true  <- the duplicate-id check
System.out.println(salaries.getOrDefault("E999", 0.0));  // 0.0 - avoids the null

for (Map.Entry<String, Double> e : salaries.entrySet()) {
    System.out.println(e.getKey() + " earns " + e.getValue());
}""",
         kind='fragment')

    p('<p><code>containsKey</code> is how you satisfy every "check duplicate Id" requirement in the '
      'briefs, and it is instant no matter how many records you hold — that is the reason to choose a '
      'map, and the reason to give when asked.</p>',
      '<p><code>containsKey</code> chính là cách bạn đáp ứng mọi yêu cầu "check duplicate Id" trong đề, '
      'và nó cho kết quả tức thì bất kể bạn đang giữ bao nhiêu bản ghi — đó là lý do chọn map, và cũng là '
      'lý do để trả lời khi bị hỏi.</p>')

    h('Sorting objects with Comparator', 'Sắp xếp đối tượng bằng Comparator')

    p('<p>Seven briefs say "sort by salary ascending" or "sort by name". Once your data is objects in a '
      '<code>List</code>, you do not write a sorting algorithm — you describe the order and let the '
      'library sort.</p>',
      '<p>Bảy đề nói "sắp xếp theo lương tăng dần" hoặc "sắp theo tên". Khi dữ liệu đã là các đối tượng '
      'trong <code>List</code>, bạn không cần viết thuật toán sắp xếp — bạn chỉ mô tả thứ tự rồi để thư '
      'viện sắp.</p>')

    code('Comparator, three ways of increasing power',
         'Comparator, ba mức từ đơn giản đến mạnh',
         """import java.util.*;

class Employee {
    private final String name;
    private final double salary;

    public Employee(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }
    public String getName()   { return name; }
    public double getSalary() { return salary; }

    @Override
    public String toString() {
        return name + "(" + salary + ")";
    }
}

public class SortDemo {
    public static void main(String[] args) {
        List<Employee> staff = new ArrayList<>(List.of(
                new Employee("Hoa", 900),
                new Employee("Binh", 1500),
                new Employee("An", 900)));

        staff.sort(Comparator.comparingDouble(Employee::getSalary));
        System.out.println(staff);

        staff.sort(Comparator.comparingDouble(Employee::getSalary).reversed());
        System.out.println(staff);

        // salary first, then name for ties - what "sort by salary" usually means
        staff.sort(Comparator.comparingDouble(Employee::getSalary)
                             .thenComparing(Employee::getName));
        System.out.println(staff);
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        """[Hoa(900.0), An(900.0), Binh(1500.0)]
[Binh(1500.0), Hoa(900.0), An(900.0)]
[An(900.0), Hoa(900.0), Binh(1500.0)]""")

    p('<p>Look at the first and third lines. Sorting by salary alone left <code>Hoa</code> before '
      '<code>An</code> because they earn the same and the sort is <em>stable</em> — equal elements keep '
      'their original order. Adding <code>thenComparing</code> makes the result predictable. Examiners '
      'like this question because it shows whether you understand your own output.</p>',
      '<p>Nhìn dòng thứ nhất và dòng thứ ba. Chỉ sắp theo lương thì <code>Hoa</code> vẫn đứng trước '
      '<code>An</code> vì hai người bằng lương và phép sắp xếp là <em>ổn định</em> — các phần tử bằng '
      'nhau giữ nguyên thứ tự ban đầu. Thêm <code>thenComparing</code> mới cho kết quả đoán trước được. '
      'Giám khảo thích hỏi chỗ này vì nó cho thấy bạn có hiểu kết quả của chính mình hay không.</p>')

    practice([
        (251, 'Collections framework and data structures', 'Collections và cấu trúc dữ liệu',
         'List, Set, Map, iterators and Comparator — 10 exercises',
         'List, Set, Map, iterator và Comparator — 10 bài'),
        ('implement-a-word-frequency-analyzer-using-collection-types',
         'Exercise: word frequency with a Map', 'Bài tập: đếm tần suất từ bằng Map',
         'HashMap keys and counting — the duplicate-id skill in another shape',
         'Khoá HashMap và đếm — cùng kỹ năng chặn trùng mã ở dạng khác'),
    ])
