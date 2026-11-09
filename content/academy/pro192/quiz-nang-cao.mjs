/**
 * PRO192 · Quiz cuối hai chương "Nâng cao 1" (N1.1 Java hiện đại) và "Nâng cao 2" (N2.1 SOLID + N2.2 Banking) — 09/11/2026.
 * Câu "in ra gì" đã chạy thật trên JDK 21 (`java Q.java`): q1 [An, Chi, Dung] · q2 0 · q3 30 · q4 2 · q5 3 · q6 fig,pear,apple;
 * tiền double: 0.1 + 0.2 in 0.30000000000000004 và so == 0.3 là false; `Box<int>` báo "unexpected type".
 */

const QUIZ_N1 = {
  timeLimitSeconds: 600,
  questions: [
    { id: 'q1',
      question: 'What is printed?|||Chương trình in ra gì?',
      code: `record Sv(String ten, double gpa) {}
List<Sv> ds = List.of(new Sv("An", 3.2), new Sv("Binh", 2.8),
                      new Sv("Chi", 3.0), new Sv("Dung", 3.5));
System.out.println(ds.stream()
        .filter(s -> s.gpa() >= 3.0)
        .map(Sv::ten)
        .collect(Collectors.toList()));`,
      codeLang: 'java',
      options: ['[An, Chi, Dung]|||[An, Chi, Dung]', '[An, Dung]|||[An, Dung]', '[Binh]|||[Binh]', '[Dung, An, Chi]|||[Dung, An, Chi]'],
      correctIndex: 0,
      points: 1,
      explanation: 'filter keeps the elements whose condition is true — 3.0 >= 3.0 is true, so Chi stays (B forgets the "=" ). A stream keeps the source order unless you sort, so D is wrong. map then turns each Sv into its name.|||filter giữ phần tử có điều kiện đúng — 3.0 >= 3.0 là đúng nên Chi được giữ (B quên dấu "="). Stream giữ nguyên thứ tự nguồn nếu không sắp xếp, nên D sai. Sau đó map đổi mỗi Sv thành tên.' },
    { id: 'q2',
      question: 'Why do we write one Box<T> instead of a StringBox and an IntegerBox?|||Vì sao viết một Box<T> thay vì một StringBox và một IntegerBox?',
      options: ['One class works safely for every type; the compiler checks the type at each use|||Một lớp dùng an toàn cho mọi kiểu; trình biên dịch kiểm kiểu ở mỗi chỗ dùng',
        'Box<T> runs faster than two separate classes|||Box<T> chạy nhanh hơn hai lớp riêng',
        'Box<T> can hold any type without casts AND without type checking|||Box<T> chứa được mọi kiểu mà không cần ép kiểu VÀ không kiểm kiểu',
        'Because Java forbids writing two classes with similar code|||Vì Java cấm viết hai lớp có code giống nhau'],
      correctIndex: 0,
      points: 1,
      explanation: 'N1.1: generics let a class work with any type safely — you write the logic once, and Box<String> only accepts Strings (the compiler refuses anything else). C is the opposite of the point: the type IS checked. Speed (B) is not the reason.|||N1.1: generics cho một lớp làm việc với mọi kiểu một cách an toàn — viết logic một lần, và Box<String> chỉ nhận String (trình biên dịch từ chối thứ khác). C ngược với mục đích: kiểu CÓ được kiểm. Tốc độ (B) không phải lý do.' },
    { id: 'q3',
      question: 'Given class Box<T> { T item; ... } — which declaration does NOT compile?|||Cho class Box<T> { T item; ... } — khai báo nào KHÔNG biên dịch được?',
      options: ['Box<String> a = new Box<>();|||Box<String> a = new Box<>();', 'Box<Integer> b = new Box<>();|||Box<Integer> b = new Box<>();', 'Box<int> c = new Box<>();|||Box<int> c = new Box<>();', 'Box<List<String>> d = new Box<>();|||Box<List<String>> d = new Box<>();'],
      correctIndex: 2,
      points: 1,
      explanation: 'A type argument must be a reference type. int is primitive, so javac reports "unexpected type" — use the wrapper Integer (B) instead. A nested generic type like List<String> (D) is a reference type and is fine.|||Đối số kiểu phải là kiểu tham chiếu. int là kiểu nguyên thuỷ nên javac báo "unexpected type" — dùng lớp bọc Integer (B). Kiểu generic lồng như List<String> (D) là kiểu tham chiếu nên hợp lệ.' },
    { id: 'q4',
      question: 'What is printed?|||Chương trình in ra gì?',
      code: `System.out.println(Stream.of(1, 2, 3, 4)
        .map(x -> x * x)
        .reduce(0, Integer::sum));`,
      codeLang: 'java',
      options: ['10|||10', '30|||30', '24|||24', '[1, 4, 9, 16]|||[1, 4, 9, 16]'],
      correctIndex: 1,
      points: 1,
      explanation: 'map squares each number (1, 4, 9, 16), then reduce adds them starting from 0: 1 + 4 + 9 + 16 = 30. 10 (A) is the sum before squaring; D would need collect, not reduce.|||map bình phương từng số (1, 4, 9, 16), rồi reduce cộng dồn bắt đầu từ 0: 1 + 4 + 9 + 16 = 30. 10 (A) là tổng trước khi bình phương; D phải dùng collect, không phải reduce.' },
    { id: 'q5',
      question: 'How many times does the lambda inside filter run?|||Lambda bên trong filter chạy bao nhiêu lần?',
      code: `List<String> log = new ArrayList<>();
Stream<Integer> s = Stream.of(1, 2, 3)
        .filter(x -> { log.add("f" + x); return x > 1; });
System.out.println(log.size());`,
      codeLang: 'java',
      options: ['0|||0', '2|||2', '3|||3', '1|||1'],
      correctIndex: 0,
      points: 1,
      explanation: 'Streams are lazy: filter only records the step. Nothing runs until a terminal operation (forEach, collect, count, reduce…) is called, and this code has none — so log stays empty and 0 is printed.|||Stream là lười: filter chỉ ghi lại bước xử lý. Không gì chạy cho tới khi gọi một thao tác kết thúc (forEach, collect, count, reduce…), mà đoạn code này không có — nên log rỗng và in ra 0.' },
    { id: 'q6',
      question: 'What is printed?|||Chương trình in ra gì?',
      code: `System.out.println(IntStream.rangeClosed(1, 10)
        .filter(x -> x % 3 == 0)
        .count());`,
      codeLang: 'java',
      options: ['3|||3', '4|||4', '10|||10', '18|||18'],
      correctIndex: 0,
      points: 1,
      explanation: 'rangeClosed(1, 10) includes 10. The multiples of 3 in 1..10 are 3, 6, 9 — count() returns 3. 18 (D) is their sum, which would need sum().|||rangeClosed(1, 10) có cả 10. Các bội của 3 trong 1..10 là 3, 6, 9 — count() trả về 3. 18 (D) là tổng của chúng, phải dùng sum().' },
    { id: 'q7',
      question: 'What is printed?|||Chương trình in ra gì?',
      code: `System.out.println(Stream.of("pear", "fig", "apple")
        .sorted(Comparator.comparing(String::length))
        .collect(Collectors.joining(",")));`,
      codeLang: 'java',
      options: ['apple,fig,pear|||apple,fig,pear', 'fig,pear,apple|||fig,pear,apple', 'apple,pear,fig|||apple,pear,fig', 'pear,fig,apple|||pear,fig,apple'],
      correctIndex: 1,
      points: 1,
      explanation: 'The comparator sorts by length, not alphabetically: fig (3) < pear (4) < apple (5). A is the alphabetical order; C is longest first.|||Comparator sắp theo độ dài, không theo chữ cái: fig (3) < pear (4) < apple (5). A là thứ tự chữ cái; C là dài nhất trước.' },
    { id: 'q8',
      question: 'Which statement about streams vs a plain for loop is correct?|||Phát biểu nào về stream so với vòng for thường là đúng?',
      options: ['A stream describes WHAT you want (filter, map…), the loop spells out HOW, step by step|||Stream mô tả bạn muốn CÁI GÌ (filter, map…), vòng lặp viết ra LÀM SAO từng bước',
        'A stream changes the original list in place|||Stream sửa thẳng vào list gốc',
        'Anything written with a stream always runs faster than a loop|||Mọi thứ viết bằng stream luôn chạy nhanh hơn vòng lặp',
        'Streams are examined heavily in PRO192 instead of loops|||Stream được thi nặng ở PRO192 thay cho vòng lặp'],
      correctIndex: 0,
      points: 1,
      explanation: 'That is the functional style of N1.1. A stream produces a new result and leaves the source list untouched (B is wrong); it is not automatically faster (C); and N1.1 says it is not examined heavily in PRO192 (D) — it pays off in LAB211, PRJ301 and real Java jobs.|||Đó là phong cách functional của N1.1. Stream tạo kết quả mới và giữ nguyên list nguồn (B sai); nó không tự động nhanh hơn (C); và N1.1 nói nó không bị thi nặng ở PRO192 (D) — nó có ích ở LAB211, PRJ301 và công việc Java thật.' },
  ],
};

const QUIZ_N2 = {
  timeLimitSeconds: 720,
  questions: [
    { id: 'q1',
      question: 'A Student class stores student data, prints report cards and saves itself to a file. Which SOLID principle does it break?|||Lớp Student vừa giữ dữ liệu sinh viên, vừa in bảng điểm, vừa tự lưu ra file. Nó vi phạm nguyên tắc SOLID nào?',
      options: ['S — Single Responsibility|||S — Trách nhiệm đơn', 'O — Open/Closed|||O — Mở/Đóng', 'L — Liskov Substitution|||L — Thay thế Liskov', 'I — Interface Segregation|||I — Tách interface'],
      correctIndex: 0,
      points: 1,
      explanation: 'N2.1 uses exactly this example: a class should do one thing. Holding data, printing and saving are three reasons to change, so they belong in three classes.|||N2.1 dùng đúng ví dụ này: một lớp nên làm một việc. Giữ dữ liệu, in và lưu là ba lý do để sửa, nên thuộc về ba lớp.' },
    { id: 'q2',
      question: 'You need a new payment method. Under Open/Closed, the best move is to…|||Cần thêm một phương thức thanh toán mới. Theo nguyên tắc Mở/Đóng, cách tốt nhất là…',
      options: ['add a new class implementing the existing Payment interface|||thêm một lớp mới cài đặt interface Payment sẵn có',
        'add another else-if branch inside the existing pay() method|||thêm một nhánh else-if vào phương thức pay() sẵn có',
        'copy the whole payment class and edit the copy|||chép nguyên lớp thanh toán rồi sửa bản chép',
        'make every field public so the new code can reach it|||cho mọi trường thành public để code mới với tới'],
      correctIndex: 0,
      points: 1,
      explanation: 'Open to extension, closed to modification: new behaviour arrives as a new implementation, while the tested code stays untouched. B modifies existing code; C duplicates it; D breaks encapsulation.|||Mở để mở rộng, đóng để sửa đổi: hành vi mới đến dưới dạng một cài đặt mới, code đã kiểm giữ nguyên. B sửa code cũ; C nhân đôi code; D phá đóng gói.' },
    { id: 'q3',
      question: 'Which pair matches the letter to its meaning correctly?|||Cặp nào ghép đúng chữ cái với ý nghĩa?',
      options: ['L — a subclass must work anywhere its parent is expected|||L — lớp con phải chạy được ở mọi chỗ lớp cha được mong đợi',
        'I — every class must implement one big interface|||I — mọi lớp phải cài đặt một interface lớn',
        'D — depend on concrete classes so the code is simpler|||D — phụ thuộc vào lớp cụ thể cho code đơn giản',
        'O — closed to extension, open to modification|||O — đóng với mở rộng, mở với sửa đổi'],
      correctIndex: 0,
      points: 1,
      explanation: 'Liskov: a subclass must not surprise code written for the parent. I asks for small focused interfaces (the opposite of B); D says depend on abstractions (the opposite of C); O is reversed in D.|||Liskov: lớp con không được làm bất ngờ code viết cho lớp cha. I đòi interface nhỏ, tập trung (ngược với B); D nói phụ thuộc vào trừu tượng (ngược với C); O bị đảo ngược ở đáp án D.' },
    { id: 'q4',
      question: 'In the refactored Banking project, BankService talks to storage through the BankRepository interface. What does that buy?|||Trong project Banking đã dựng lại, BankService làm việc với kho lưu qua interface BankRepository. Điều đó được lợi gì?',
      options: ['Storage can be swapped (memory ↔ files) without touching the service — Dependency Inversion|||Đổi được kho lưu (bộ nhớ ↔ file) mà không đụng vào service — Đảo ngược phụ thuộc',
        'The program runs faster because interfaces are cached|||Chương trình chạy nhanh hơn vì interface được cache',
        'The UI can now call the repository directly|||Giao diện giờ gọi thẳng được repository',
        'It removes the need for a model package|||Không cần package model nữa'],
      correctIndex: 0,
      points: 1,
      explanation: 'The target design: the service depends on an interface for storage, so the in-memory and file versions are interchangeable. Layers talk downward only — UI → service → repository — so C breaks the rule; the shared model stays (D).|||Thiết kế đích: service phụ thuộc vào một interface cho kho lưu, nên bản bộ nhớ và bản file thay cho nhau được. Các tầng chỉ gọi xuống dưới — UI → service → repository — nên C phá luật; model dùng chung vẫn giữ (D).' },
    { id: 'q5',
      question: 'What is printed?|||Chương trình in ra gì?',
      code: `double bal = 0.1;
bal += 0.2;
System.out.println(bal);
System.out.println(bal == 0.3);`,
      codeLang: 'java',
      options: ['0.3 and true|||0.3 và true', '0.30000000000000004 and false|||0.30000000000000004 và false', '0.3 and false|||0.3 và false', '0.30000000000000004 and true|||0.30000000000000004 và true'],
      correctIndex: 1,
      points: 1,
      explanation: 'Binary floating point cannot store 0.1 or 0.2 exactly, so the sum is 0.30000000000000004 and is not equal to 0.3. That is bug 7 of the Banking case study (money stored as double); the fix stores whole VND in a long.|||Số thực dấu phẩy động nhị phân không lưu chính xác 0.1 hay 0.2, nên tổng là 0.30000000000000004 và không bằng 0.3. Đó là lỗi 7 của case study Banking (tiền lưu bằng double); cách sửa là lưu số đồng nguyên trong một long.' },
    { id: 'q6',
      question: 'Banking bug 6: the balance and account number can be set from outside the class. Which fix matches "an object guards its own data"?|||Lỗi 6 của Banking: số dư và số tài khoản đặt được từ bên ngoài lớp. Cách sửa nào đúng với "đối tượng tự bảo vệ dữ liệu của nó"?',
      options: ['Remove the public setters; change the balance only through deposit/withdraw methods that check the amount|||Bỏ setter public; chỉ đổi số dư qua phương thức nạp/rút có kiểm số tiền',
        'Keep the setters but add a comment "do not call"|||Giữ setter nhưng thêm chú thích "đừng gọi"',
        'Make the balance field public static|||Cho trường số dư thành public static',
        'Check the amount in the UI only|||Chỉ kiểm số tiền ở giao diện'],
      correctIndex: 0,
      points: 1,
      explanation: 'Step 1 of the refactoring: no setter for money, every rule in one place — deposit and withdraw refuse negative amounts themselves (that also fixes bug 5). A comment enforces nothing; a UI-only check is skipped by any other caller.|||Bước 1 của việc dựng lại: không có setter cho tiền, mọi luật ở một chỗ — nạp và rút tự từ chối số âm (cũng sửa luôn lỗi 5). Một chú thích không bắt buộc được gì; kiểm chỉ ở giao diện thì mọi chỗ gọi khác bỏ qua được.' },
    { id: 'q7',
      question: 'Banking bug 1: piped input crashes at the first prompt with NoSuchElementException. What is the root cause?|||Lỗi 1 của Banking: nạp dữ liệu qua pipe là sập ngay ô nhập đầu tiên với NoSuchElementException. Nguyên nhân gốc là gì?',
      options: ['A new Scanner is created on every call; the fix keeps ONE Scanner for the whole program|||Mỗi lần gọi lại tạo một Scanner mới; cách sửa là giữ MỘT Scanner cho cả chương trình',
        'The input file is too large|||Tệp dữ liệu vào quá lớn',
        'Scanner cannot read numbers|||Scanner không đọc được số',
        'The program forgot to import java.util.Scanner|||Chương trình quên import java.util.Scanner'],
      correctIndex: 0,
      points: 1,
      explanation: 'The case study measured it: a fresh Scanner per call buffers input it then throws away, so the next Scanner finds nothing. Step 5 builds a console UI with ONE Scanner (the Input class). A missing import (D) would not even compile.|||Case study đã đo: mỗi lần gọi tạo Scanner mới thì nó đệm trước dữ liệu rồi bỏ đi, nên Scanner sau không còn gì để đọc. Bước 5 dựng giao diện console với MỘT Scanner (lớp Input). Thiếu import (D) thì đã không biên dịch được.' },
    { id: 'q8',
      question: 'Which habit does N2.1 recommend from day one?|||N2.1 khuyên thói quen nào ngay từ ngày đầu?',
      options: ['One clear job per class, private fields, interfaces where things may change, composition over deep inheritance|||Mỗi lớp một việc rõ, trường private, interface ở chỗ có thể đổi, ưu tiên kết hợp hơn kế thừa sâu',
        'Put all logic in main so it is easy to find|||Dồn mọi logic vào main cho dễ tìm',
        'Use deep inheritance trees so every class reuses as much as possible|||Dùng cây kế thừa thật sâu để mỗi lớp tái dùng tối đa',
        'Make every field public to avoid writing getters|||Cho mọi trường public để khỏi viết getter'],
      correctIndex: 0,
      points: 1,
      explanation: 'That is the closing advice of N2.1: small choices like these decide whether a team can live with the code for years. Prefer composition (has-a) over deep inheritance (C), and keep fields private (D).|||Đó là lời khuyên cuối N2.1: những lựa chọn nhỏ như vậy quyết định một đội có sống chung với code nhiều năm được không. Ưu tiên kết hợp (has-a) hơn kế thừa sâu (C), và giữ trường private (D).' },
  ],
};

export const QL_n1 = {
  title: 'Quiz N1 — Modern Java: generics, lambdas & streams|||Quiz N1 — Java hiện đại: generics, lambda & stream',
  slug: 'pro192-quiz-n1',
  type: 'QUIZ',
  description: '8 câu ôn chương Nâng cao 1 (không thi PRO192), giải thích song ngữ; câu "in ra gì" đã chạy thật trên JDK 21: filter/map/collect, tính lười của stream, reduce, count, sắp theo độ dài, Box<int>.',
  quiz: QUIZ_N1,
};

export const QL_n2 = {
  title: 'Quiz N2 — Design principles & the Banking case study|||Quiz N2 — Nguyên tắc thiết kế & case study Banking',
  slug: 'pro192-quiz-n2',
  type: 'QUIZ',
  description: '8 câu ôn chương Nâng cao 2 (không thi PRO192), giải thích song ngữ: năm chữ SOLID, interface kho lưu, tiền double (đã chạy thật), setter public, một Scanner cho cả chương trình.',
  quiz: QUIZ_N2,
};
