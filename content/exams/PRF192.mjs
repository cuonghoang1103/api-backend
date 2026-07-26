// PRF192 — Practical Exam (PE) sample paper, imported from the school's FA25 PE
// (Paper No. 3, full 8-question paper). Real problems; reference C solutions
// authored & test-run here (verified: 1.877 · 2 · 18 · hollow triangle ·
// odd/even sort · char-replace · student GPA · product catalog). Students
// write in their own IDE, zip Q1.c..Q8.c, and upload for AI grading.

const RUBRIC = [
  { id: 'correct', criterion: 'Program compiles and produces the exact expected output for the given examples and edge cases.|||Chương trình biên dịch được và cho đúng kết quả kỳ vọng với ví dụ và ca biên.', weight: 3, maxScore: 4 },
  { id: 'logic', criterion: 'Correct algorithm/logic and proper input handling.|||Thuật toán/logic đúng và xử lý nhập liệu hợp lý.', weight: 2, maxScore: 4 },
  { id: 'quality', criterion: 'Readable code: naming, structure, no unused clutter.|||Mã dễ đọc: đặt tên, cấu trúc, không thừa.', weight: 1, maxScore: 4 },
];

export default {
  course: { courseCode: 'PRF192' },
  exams: [
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-FA25-P3',
      source: 'REAL',
      title: 'Practical Exam — C Programming (FA25, Paper 3)|||Thi thực hành — Lập trình C (FA25, Đề 3)',
      description:
        'Real PE paper. Write each program in C, then zip all files (Q1.c … Q4.c) and upload for AI grading.|||Đề PE thật. Viết từng chương trình bằng C, nén tất cả file (Q1.c … Q4.c) thành .zip rồi nộp để AI chấm.',
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      attachmentUrl: '/exam-assets/PRF192-given.zip',
      attachmentName: 'Given — starter files (Q1.c … Q8.c)|||Given — file cho sẵn (Q1.c … Q8.c)',
      instructions:
        '<div class="ml-en"><p><b>How to take this exam:</b></p><ol>' +
        '<li><b>Download</b> the "Given" file below and <b>extract</b> the .zip — it contains the starter files <code>Q1.c … Q8.c</code>.</li>' +
        '<li>Open them in your own IDE / VS Code and write your solution in each file. <b>Keep the file names exactly</b> as given (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Test</b> your program against the example input/output shown in each question.</li>' +
        '<li>When done, select all <code>.c</code> files, compress them into <b>one <code>.zip</code></b>, and upload it in the submit box on the right.</li>' +
        '<li>AI grades each question against the spec, the expected output, and a reference solution, then shows your score + feedback.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi:</b></p><ol>' +
        '<li><b>Tải</b> file "Given" bên dưới và <b>giải nén</b> .zip — bên trong có các file mẫu <code>Q1.c … Q8.c</code>.</li>' +
        '<li>Mở bằng IDE / VS Code của bạn và viết lời giải vào từng file. <b>Giữ NGUYÊN tên file</b> như đề (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Chạy thử</b> chương trình với ví dụ input/output trong mỗi câu.</li>' +
        '<li>Xong xuôi, chọn tất cả file <code>.c</code>, nén thành <b>một file <code>.zip</code></b>, rồi tải lên ô nộp bài bên phải.</li>' +
        '<li>AI chấm từng câu theo đề, kết quả mong đợi và đáp án mẫu, rồi hiện điểm + nhận xét.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q1 (file: Q1.c).</b> Write a program that reads two floating-point numbers <code>a</code> and <code>b</code> from the keyboard and computes <b>(a + b) / (a - b)</b>. If <code>a - b</code> equals zero, print <b>"Invalid operation"</b>. Round the result to three decimal places.</p></div>' +
            '<div class="ml-vi"><p><b>Q1 (file: Q1.c).</b> Viết chương trình đọc hai số thực <code>a</code> và <code>b</code> từ bàn phím và tính <b>(a + b) / (a - b)</b>. Nếu <code>a - b</code> bằng 0, in <b>"Invalid operation"</b>. Làm tròn kết quả tới ba chữ số thập phân.</p></div>',
          expectedOutput: '10.5\n3.2\nOUTPUT:\n1.877',
          sampleSolution: '#include <stdio.h>\nint main() {\n    double a, b;\n    scanf("%lf %lf", &a, &b);\n    if (a - b == 0) {\n        printf("Invalid operation\\n");\n    } else {\n        printf("%.3f\\n", (a + b) / (a - b));\n    }\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q2 (file: Q2.c).</b> Write a program that reads three integers and prints the count of numbers that are divisible by 4.</p></div>' +
            '<div class="ml-vi"><p><b>Q2 (file: Q2.c).</b> Viết chương trình đọc ba số nguyên và in ra số lượng số chia hết cho 4.</p></div>',
          expectedOutput: '10\n8\n16\nOUTPUT:\n2',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int x, count = 0;\n    for (int i = 0; i < 3; i++) {\n        scanf("%d", &x);\n        if (x % 4 == 0) count++;\n    }\n    printf("%d\\n", count);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q3 (file: Q3.c).</b> Write a program that reads two integers <code>start</code> and <code>end</code> (start &le; end) and computes the sum of all numbers divisible by <b>9</b> in the range from <code>start+1</code> to <code>end-1</code>.</p></div>' +
            '<div class="ml-vi"><p><b>Q3 (file: Q3.c).</b> Viết chương trình đọc hai số nguyên <code>start</code> và <code>end</code> (start &le; end) và tính tổng các số chia hết cho <b>9</b> trong khoảng từ <code>start+1</code> tới <code>end-1</code>.</p></div>',
          expectedOutput: '9 27\nOUTPUT:\n18',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int start, end;\n    scanf("%d %d", &start, &end);\n    long sum = 0;\n    for (int i = start + 1; i <= end - 1; i++) {\n        if (i % 9 == 0) sum += i;\n    }\n    printf("%ld\\n", sum);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q4 (file: Q4.c).</b> Write a program that prints a hollow right-angled triangle pattern using the character <code>#</code> with height <b>n</b> entered by the user.</p></div>' +
            '<div class="ml-vi"><p><b>Q4 (file: Q4.c).</b> Viết chương trình in tam giác vuông RỖNG bằng ký tự <code>#</code> với chiều cao <b>n</b> do người dùng nhập.</p></div>',
          expectedOutput: '7\nOUTPUT:\n#\n##\n# #\n#  #\n#   #\n#    #\n#######',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    for (int i = 1; i <= n; i++) {\n        for (int j = 1; j <= i; j++) {\n            if (i == 1 || i == n || j == 1 || j == i) printf("#");\n            else printf(" ");\n        }\n        printf("\\n");\n    }\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q5 (file: Q5.c).</b> The program allows the user to enter an integer array of <code>n</code> elements from the keyboard (n&gt;0). Sort and print the list of elements in descending order with odd numbers first and even numbers last. Each printed element is on one line (<code>\\n</code>).</p><p>Example: enter n = 6, array = [5, 1, 3, 2, 4, 9]</p></div>' +
            '<div class="ml-vi"><p><b>Q5 (file: Q5.c).</b> Chương trình cho người dùng nhập một mảng số nguyên gồm <code>n</code> phần tử (n&gt;0). Sắp xếp và in danh sách theo thứ tự giảm dần với các số lẻ đứng trước, số chẵn đứng sau. Mỗi phần tử in trên một dòng (<code>\\n</code>).</p><p>Ví dụ: nhập n = 6, mảng = [5, 1, 3, 2, 4, 9]</p></div>',
          expectedOutput: '6\n5 1 3 2 4 9\nOUTPUT:\n9\n5\n3\n1\n4\n2',
          sampleSolution: '#include <stdio.h>\n#include <stdlib.h>\nint cmpDesc(const void *a, const void *b) {\n    int x = *(const int*)a, y = *(const int*)b;\n    return y - x;\n}\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[100];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    int odd[100], even[100], oc = 0, ec = 0;\n    for (int i = 0; i < n; i++) {\n        if (arr[i] % 2 != 0) odd[oc++] = arr[i];\n        else even[ec++] = arr[i];\n    }\n    qsort(odd, oc, sizeof(int), cmpDesc);\n    qsort(even, ec, sizeof(int), cmpDesc);\n    for (int i = 0; i < oc; i++) printf("%d\\n", odd[i]);\n    for (int i = 0; i < ec; i++) printf("%d\\n", even[i]);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q6 (file: Q6.c).</b> The program allows the user to enter a character string <code>s</code> from the keyboard, then enter a character <code>c</code> to be converted in the string entered above. If the character <code>c</code> exists in the string <code>s</code>, convert every occurrence of it to uppercase and print the converted string. If not found, print <b>"Character &#39;c&#39; not found"</b> (with the actual character in place of <code>c</code>).</p></div>' +
            '<div class="ml-vi"><p><b>Q6 (file: Q6.c).</b> Chương trình cho người dùng nhập chuỗi ký tự <code>s</code> từ bàn phím, sau đó nhập ký tự <code>c</code> cần chuyển đổi trong chuỗi vừa nhập. Nếu ký tự <code>c</code> có trong chuỗi <code>s</code>, chuyển TẤT CẢ ký tự đó thành chữ hoa rồi in chuỗi đã chuyển đổi. Nếu không tìm thấy, in <b>"Character &#39;c&#39; not found"</b> (thay <code>c</code> bằng ký tự thật).</p></div>',
          expectedOutput: 'Example 1: s = "hello everybody", c = \'e\'\nhello everybody\ne\nOUTPUT:\nhEllo EvErybody\n\nExample 2: s = "hello everybody", c = \'g\'\nhello everybody\ng\nOUTPUT:\nCharacter \'g\' not found',
          sampleSolution: '#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nint main() {\n    char s[200];\n    fgets(s, sizeof(s), stdin);\n    s[strcspn(s, "\\n")] = \'\\0\';\n    char cline[10];\n    fgets(cline, sizeof(cline), stdin);\n    char c = cline[0];\n    int found = 0;\n    int len = strlen(s);\n    for (int i = 0; i < len; i++) {\n        if (s[i] == c) {\n            s[i] = toupper(s[i]);\n            found = 1;\n        }\n    }\n    if (found) {\n        printf("%s\\n", s);\n    } else {\n        printf("Character \'%c\' not found\\n", c);\n    }\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1.5, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q7 (file: Q7.c).</b> The program allows the user to enter information for <code>n</code> students (n is an integer entered from the keyboard). For each student, the information includes: <b>id</b> (char[]), <b>fullName</b> (char[]), <b>score1</b> (float), <b>score2</b> (float), <b>score3</b> (float). The program should display the list of all students along with their GPA and academic result. The <b>GPA</b> is calculated as <b>GPA=(score1+score2+score3)/3</b> and should be printed with two digits after the decimal point. If the GPA &gt;= 5, print <b>"Passed"</b>; otherwise print <b>"Failed"</b>. Hint: use an <b>array of structures</b> to organize the data.</p></div>' +
            '<div class="ml-vi"><p><b>Q7 (file: Q7.c).</b> Chương trình cho người dùng nhập thông tin của <code>n</code> sinh viên (n là số nguyên nhập từ bàn phím). Mỗi sinh viên có: <b>id</b> (char[]), <b>fullName</b> (char[]), <b>score1</b> (float), <b>score2</b> (float), <b>score3</b> (float). Chương trình hiển thị danh sách sinh viên cùng GPA và kết quả học tập. <b>GPA</b> tính bằng <b>GPA=(score1+score2+score3)/3</b>, in với hai chữ số thập phân. Nếu GPA &gt;= 5, in <b>"Passed"</b>; ngược lại in <b>"Failed"</b>. Gợi ý: dùng <b>mảng cấu trúc (array of structures)</b> để tổ chức dữ liệu.</p></div>',
          expectedOutput: '2\nHE001\nNguyen Hai Binh\n8 7.5 9.0\nHE002\nHoang Minh Tu\n2 3.5 4\nOUTPUT:\nHE001; Nguyen Hai Binh; 8.17\n=> Passed\nHE002; Hoang Minh Tu; 3.17\n=> Failed',
          sampleSolution: '#include <stdio.h>\n#include <string.h>\ntypedef struct {\n    char id[20];\n    char fullName[100];\n    float score1, score2, score3;\n} Student;\nint main() {\n    int n;\n    scanf("%d", &n);\n    getchar();\n    Student st[100];\n    for (int i = 0; i < n; i++) {\n        fgets(st[i].id, sizeof(st[i].id), stdin);\n        st[i].id[strcspn(st[i].id, "\\n")] = \'\\0\';\n        fgets(st[i].fullName, sizeof(st[i].fullName), stdin);\n        st[i].fullName[strcspn(st[i].fullName, "\\n")] = \'\\0\';\n        scanf("%f %f %f", &st[i].score1, &st[i].score2, &st[i].score3);\n        getchar();\n    }\n    for (int i = 0; i < n; i++) {\n        float gpa = (st[i].score1 + st[i].score2 + st[i].score3) / 3;\n        printf("%s; %s; %.2f\\n", st[i].id, st[i].fullName, gpa);\n        printf("=> %s\\n", gpa >= 5 ? "Passed" : "Failed");\n    }\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q8 (file: Q8.c).</b> The program allows the user to enter information for <code>n</code> products (n is an integer entered from the keyboard). For each product: <b>id</b> (char[]), <b>name</b> (char[]), <b>price</b> (float), <b>brand</b> (char[]). After entering all products, the user enters an integer <code>option</code> to choose one of: <b>Option 1</b> — display the list of all products; <b>Option 2</b> — display all products and the total price of all products; <b>Option 3</b> — display the product(s) with the highest price. If the entered option is invalid, print <b>"Invalid option!"</b>. Hint: use an <b>array of structures</b>.</p></div>' +
            '<div class="ml-vi"><p><b>Q8 (file: Q8.c).</b> Chương trình cho người dùng nhập thông tin của <code>n</code> sản phẩm (n là số nguyên nhập từ bàn phím). Mỗi sản phẩm có: <b>id</b> (char[]), <b>name</b> (char[]), <b>price</b> (float), <b>brand</b> (char[]). Sau khi nhập xong, người dùng nhập số nguyên <code>option</code> để chọn: <b>Option 1</b> — hiển thị danh sách tất cả sản phẩm; <b>Option 2</b> — hiển thị tất cả sản phẩm và tổng giá; <b>Option 3</b> — hiển thị (các) sản phẩm có giá cao nhất. Nếu option không hợp lệ, in <b>"Invalid option!"</b>. Gợi ý: dùng <b>mảng cấu trúc (array of structures)</b>.</p></div>',
          expectedOutput:
            'Enter n=3, products: P001/Macbook Pro/3500.5/Apple, P002/Samsung Ultra 24/1500.99/Samsung, P003/IPhone 17 Pro/3500.5/Apple\n\n' +
            'option = 1:\nOUTPUT:\nList of products:\nP001; Macbook Pro; 3500.50; Apple\nP002; Samsung Ultra 24; 1500.99; Samsung\nP003; IPhone 17 Pro; 3500.50; Apple\n\n' +
            'option = 2:\nOUTPUT:\nP001; Macbook Pro; 3500.50; Apple\nP002; Samsung Ultra 24; 1500.99; Samsung\nP003; IPhone 17 Pro; 3500.50; Apple\nTotal price: $8501.99\n\n' +
            'option = 3 (ties are all listed):\nOUTPUT:\nThe highest priced products:\nP001; Macbook Pro; 3500.50; Apple\nP003; IPhone 17 Pro; 3500.50; Apple\n\n' +
            'option = 5 (invalid):\nOUTPUT:\nInvalid option!',
          sampleSolution: '#include <stdio.h>\n#include <string.h>\ntypedef struct {\n    char id[20];\n    char name[100];\n    float price;\n    char brand[50];\n} Product;\nint main() {\n    int n;\n    scanf("%d", &n);\n    getchar();\n    Product p[100];\n    for (int i = 0; i < n; i++) {\n        fgets(p[i].id, sizeof(p[i].id), stdin);\n        p[i].id[strcspn(p[i].id, "\\n")] = \'\\0\';\n        fgets(p[i].name, sizeof(p[i].name), stdin);\n        p[i].name[strcspn(p[i].name, "\\n")] = \'\\0\';\n        scanf("%f", &p[i].price);\n        getchar();\n        fgets(p[i].brand, sizeof(p[i].brand), stdin);\n        p[i].brand[strcspn(p[i].brand, "\\n")] = \'\\0\';\n    }\n    int option;\n    scanf("%d", &option);\n    if (option == 1) {\n        printf("List of products:\\n");\n        for (int i = 0; i < n; i++)\n            printf("%s; %s; %.2f; %s\\n", p[i].id, p[i].name, p[i].price, p[i].brand);\n    } else if (option == 2) {\n        float total = 0;\n        for (int i = 0; i < n; i++) {\n            printf("%s; %s; %.2f; %s\\n", p[i].id, p[i].name, p[i].price, p[i].brand);\n            total += p[i].price;\n        }\n        printf("Total price: $%.2f\\n", total);\n    } else if (option == 3) {\n        float maxPrice = p[0].price;\n        for (int i = 1; i < n; i++) if (p[i].price > maxPrice) maxPrice = p[i].price;\n        printf("The highest priced products:\\n");\n        for (int i = 0; i < n; i++)\n            if (p[i].price == maxPrice)\n                printf("%s; %s; %.2f; %s\\n", p[i].id, p[i].name, p[i].price, p[i].brand);\n    } else {\n        printf("Invalid option!\\n");\n    }\n    return 0;\n}',
          rubric: RUBRIC,
        },
      ],
    },
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-SP25-P1',
      source: 'REAL',
      title: 'Practical Exam — C Programming (SP25, Paper 1)|||Thi thực hành — Lập trình C (SP25, Đề 1)',
      description:
        'Real PE paper. Write each program in C, then zip all files (Q1.c … Q4.c) and upload for AI grading.|||Đề PE thật. Viết từng chương trình bằng C, nén tất cả file (Q1.c … Q4.c) thành .zip rồi nộp để AI chấm.',
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      attachmentUrl: '/exam-assets/PRF192-PE-SP25-P1-given.zip',
      attachmentName: 'Given — starter files (Q1.c … Q4.c)|||Given — file cho sẵn (Q1.c … Q4.c)',
      instructions:
        '<div class="ml-en"><p><b>How to take this exam:</b></p><ol>' +
        '<li><b>Download</b> the "Given" file below and <b>extract</b> the .zip — it contains the starter files <code>Q1.c … Q4.c</code>.</li>' +
        '<li>Open them in your own IDE / VS Code and write your solution in each file. <b>Keep the file names exactly</b> as given (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Test</b> your program against the example input/output shown in each question.</li>' +
        '<li>When done, select all <code>.c</code> files, compress them into <b>one <code>.zip</code></b>, and upload it in the submit box on the right.</li>' +
        '<li>AI grades each question against the spec, the expected output, and a reference solution, then shows your score + feedback.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi:</b></p><ol>' +
        '<li><b>Tải</b> file "Given" bên dưới và <b>giải nén</b> .zip — bên trong có các file mẫu <code>Q1.c … Q4.c</code>.</li>' +
        '<li>Mở bằng IDE / VS Code của bạn và viết lời giải vào từng file. <b>Giữ NGUYÊN tên file</b> như đề (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Chạy thử</b> chương trình với ví dụ input/output trong mỗi câu.</li>' +
        '<li>Xong xuôi, chọn tất cả file <code>.c</code>, nén thành <b>một file <code>.zip</code></b>, rồi tải lên ô nộp bài bên phải.</li>' +
        '<li>AI chấm từng câu theo đề, kết quả mong đợi và đáp án mẫu, rồi hiện điểm + nhận xét.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 2, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q1 (file: Q1.c).</b> The given file <code>Q1.c</code> already contains statements to enter a temperature in Celsius (C). Write statements to convert the temperature from Celsius (C) to Fahrenheit (F).</p><p>Hint: F = C &times; 9/5 + 32. The output result is formatted with two decimal places.</p></div>' +
            '<div class="ml-vi"><p><b>Q1 (file: Q1.c).</b> File <code>Q1.c</code> cho sẵn đã có lệnh nhập nhiệt độ theo Celsius (C). Viết lệnh chuyển nhiệt độ từ Celsius (C) sang Fahrenheit (F).</p><p>Gợi ý: F = C &times; 9/5 + 32. Kết quả in ra định dạng hai chữ số thập phân.</p></div>',
          expectedOutput: '20.5\nOUTPUT:\n68.90',
          sampleSolution: '#include <stdio.h>\nint main() {\n    double celsius, fahrenheit;\n    scanf("%lf", &celsius);\n    fahrenheit = celsius * 9.0 / 5.0 + 32;\n    printf("%.2f\\n", fahrenheit);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 3, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q2 (file: Q2.c).</b> The given file <code>Q2.c</code> already contains statements to input data for variable <code>n</code>. Write statements to calculate <b>S</b> by <code>n</code>, where S is defined as:</p><p><code>S = 1 + 1/2 + 1/3 + ... + 1/n</code></p><p>The output value is formatted with two decimal places.</p></div>' +
            '<div class="ml-vi"><p><b>Q2 (file: Q2.c).</b> File <code>Q2.c</code> cho sẵn đã có lệnh nhập biến <code>n</code>. Viết lệnh tính <b>S</b> theo <code>n</code>, với S được định nghĩa:</p><p><code>S = 1 + 1/2 + 1/3 + ... + 1/n</code></p><p>Kết quả in ra định dạng hai chữ số thập phân.</p></div>',
          expectedOutput: '9\nOUTPUT:\n2.83',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    double s = 0;\n    for (int i = 1; i <= n; i++) s += 1.0 / i;\n    printf("%.2f\\n", s);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q3 (file: Q3.c).</b> The given file <code>Q3.c</code> already contains statements to input data for an integer 1-D array and an integer variable <code>x</code>. Write statements to find whether <code>x</code> is in the array or not. If found, print ALL the positions of <code>x</code> in the array (each position separated by a space); otherwise print the last element of the array.</p></div>' +
            '<div class="ml-vi"><p><b>Q3 (file: Q3.c).</b> File <code>Q3.c</code> cho sẵn đã có lệnh nhập mảng số nguyên 1 chiều và biến nguyên <code>x</code>. Viết lệnh kiểm tra <code>x</code> có trong mảng hay không. Nếu có, in TẤT CẢ vị trí của <code>x</code> trong mảng (mỗi vị trí cách nhau một khoảng trắng); nếu không, in phần tử cuối cùng của mảng.</p></div>',
          expectedOutput: 'Example 1: n=7, array = [1 2 5 4 2 3 2], x=2\nOUTPUT:\n1 4 6\n\nExample 2: n=5, array = [1 2 5 4 7], x=9\nOUTPUT:\n7',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[100];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    int x;\n    scanf("%d", &x);\n    int found = 0;\n    for (int i = 0; i < n; i++) {\n        if (arr[i] == x) {\n            if (found) printf(" ");\n            printf("%d", i);\n            found = 1;\n        }\n    }\n    if (!found) printf("%d", arr[n - 1]);\n    printf("\\n");\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 3, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q4 (file: Q4.c).</b> The given file <code>Q4.c</code> already contains statements to input data for a string. Write statements to count the number of uppercase letters in it.</p></div>' +
            '<div class="ml-vi"><p><b>Q4 (file: Q4.c).</b> File <code>Q4.c</code> cho sẵn đã có lệnh nhập một chuỗi. Viết lệnh đếm số chữ cái IN HOA trong chuỗi đó.</p></div>',
          expectedOutput: 'Please enter a string: testPE25\nOUTPUT:\n2',
          sampleSolution: '#include <stdio.h>\n#include <ctype.h>\nint countUpperLetters(char *s) {\n    int count = 0;\n    for (int i = 0; s[i] != \'\\0\'; i++)\n        if (isupper((unsigned char)s[i])) count++;\n    return count;\n}\nint main() {\n    char s[21];\n    scanf("%20[^\\n]", s);\n    printf("%d\\n", countUpperLetters(s));\n    return 0;\n}',
          rubric: RUBRIC,
        },
      ],
    },
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-SP25-B5',
      source: 'REAL',
      title: 'Practical Exam — C Programming (SP25, Block 5)|||Thi thực hành — Lập trình C (SP25, Block 5)',
      description:
        'Real PE paper (Programming Fundamentals using C, BIT_SE curriculum). Write each program in C, then zip all files (Q1.c … Q3.c) and upload for AI grading.|||Đề PE thật (Nhập môn lập trình C, chương trình BIT_SE). Viết từng chương trình bằng C, nén tất cả file (Q1.c … Q3.c) thành .zip rồi nộp để AI chấm.',
      durationMinutes: 85,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      attachmentUrl: '/exam-assets/PRF192-PE-SP25-B5-given.zip',
      attachmentName: 'Given — starter files (Q1.c … Q3.c)|||Given — file cho sẵn (Q1.c … Q3.c)',
      instructions:
        '<div class="ml-en"><p><b>How to take this exam:</b></p><ol>' +
        '<li><b>Download</b> the "Given" file below and <b>extract</b> the .zip — it contains the starter files <code>Q1.c … Q3.c</code>.</li>' +
        '<li>Open them in your own IDE / VS Code and write your solution in each file. <b>Keep the file names exactly</b> as given (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Test</b> your program against the example input/output shown in each question.</li>' +
        '<li>When done, select all <code>.c</code> files, compress them into <b>one <code>.zip</code></b>, and upload it in the submit box on the right.</li>' +
        '<li>AI grades each question against the spec, the expected output, and a reference solution, then shows your score + feedback.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi:</b></p><ol>' +
        '<li><b>Tải</b> file "Given" bên dưới và <b>giải nén</b> .zip — bên trong có các file mẫu <code>Q1.c … Q3.c</code>.</li>' +
        '<li>Mở bằng IDE / VS Code của bạn và viết lời giải vào từng file. <b>Giữ NGUYÊN tên file</b> như đề (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Chạy thử</b> chương trình với ví dụ input/output trong mỗi câu.</li>' +
        '<li>Xong xuôi, chọn tất cả file <code>.c</code>, nén thành <b>một file <code>.zip</code></b>, rồi tải lên ô nộp bài bên phải.</li>' +
        '<li>AI chấm từng câu theo đề, kết quả mong đợi và đáp án mẫu, rồi hiện điểm + nhận xét.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 3, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q1 (file: Q1.c).</b> Users are required to enter a 3-digit integer <code>N</code> using the keyboard (100 &le; N &le; 999). Print out the <b>maximum number</b> that can be formed by rearranging the <b>3 digits</b> of N (i.e. sort its 3 digits in descending order).</p></div>' +
            '<div class="ml-vi"><p><b>Q1 (file: Q1.c).</b> Người dùng nhập một số nguyên 3 chữ số <code>N</code> (100 &le; N &le; 999). In ra <b>số lớn nhất</b> có thể tạo được từ <b>3 chữ số</b> của N (tức sắp xếp 3 chữ số theo thứ tự giảm dần).</p></div>',
          expectedOutput: 'Example 1: N=123\nOUTPUT:\n321\n\nExample 2: N=290\nOUTPUT:\n920',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int d[3];\n    d[0] = n / 100;\n    d[1] = (n / 10) % 10;\n    d[2] = n % 10;\n    for (int i = 0; i < 2; i++)\n        for (int j = i + 1; j < 3; j++)\n            if (d[i] < d[j]) { int t = d[i]; d[i] = d[j]; d[j] = t; }\n    printf("%d%d%d\\n", d[0], d[1], d[2]);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 4, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q2 (file: Q2.c).</b> In a slow cycling competition, the champion is the person who takes the <b>longest</b> time to reach the finish line. The competition has exactly three winners: Champion (1st place), Runner-up (2nd place), Third place (3rd place). Print out the time taken by the <b>Runner-up (2nd place)</b> to complete the race.</p><p>Note: if several contestants tie for the longest time, the Runner-up took the same (tied) time as the Champion — e.g. with times [2,5,7,1,3,6,9,4,6,9], the Champion takes 9s and the Runner-up ALSO takes 9s (the second occurrence of the max).</p><p>Input: first line is the number of competitors N (2 &le; N &le; 100); second line has N integers (1 &le; t<sub>i</sub> &le; 10<sup>9</sup>), the time of each competitor, separated by spaces.</p></div>' +
            '<div class="ml-vi"><p><b>Q2 (file: Q2.c).</b> Trong cuộc thi đạp xe chậm, nhà vô địch là người có thời gian về đích <b>lâu nhất</b>. Cuộc thi có đúng ba người thắng: Vô địch (hạng 1), Á quân (hạng 2), Hạng 3. In ra thời gian của <b>Á quân (hạng 2)</b>.</p><p>Lưu ý: nếu có nhiều người cùng có thời gian lớn nhất (hòa), Á quân sẽ có CÙNG thời gian hòa đó với Vô địch — ví dụ mảng thời gian [2,5,7,1,3,6,9,4,6,9], Vô địch về ở giây thứ 9, Á quân CŨNG về ở giây thứ 9 (lần xuất hiện thứ hai của giá trị lớn nhất).</p><p>Input: dòng đầu là số thí sinh N (2 &le; N &le; 100); dòng hai gồm N số nguyên (1 &le; t<sub>i</sub> &le; 10<sup>9</sup>), thời gian mỗi thí sinh, cách nhau bởi khoảng trắng.</p></div>',
          expectedOutput: 'Example 1: N=10, times = [2 5 7 1 3 6 9 4 6 9]\nOUTPUT:\n9\n\nExample 2: N=7, times = [4 9 3 1 0 2 8]\nOUTPUT:\n8',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int t[100];\n    for (int i = 0; i < n; i++) scanf("%d", &t[i]);\n    int maxVal = t[0];\n    for (int i = 1; i < n; i++) if (t[i] > maxVal) maxVal = t[i];\n    int maxCount = 0;\n    for (int i = 0; i < n; i++) if (t[i] == maxVal) maxCount++;\n    if (maxCount >= 2) {\n        printf("%d\\n", maxVal);\n    } else {\n        int second = -1;\n        for (int i = 0; i < n; i++)\n            if (t[i] != maxVal && (second == -1 || t[i] > second)) second = t[i];\n        printf("%d\\n", second);\n    }\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 3, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q3 (file: Q3.c).</b> Write a C program to search all occurrences of a character in a given string. Input: the first line contains a string with any characters (max 100), the second line contains the character to search for. Print ALL the indices (0-based) of the specified character within the string, separated by a space, in the order they occur. If not found, print <b>-1</b>.</p></div>' +
            '<div class="ml-vi"><p><b>Q3 (file: Q3.c).</b> Viết chương trình C tìm tất cả vị trí xuất hiện của một ký tự trong chuỗi cho trước. Input: dòng đầu là chuỗi bất kỳ ký tự (tối đa 100 ký tự), dòng hai là ký tự cần tìm. In ra TẤT CẢ chỉ số (đánh từ 0) của ký tự đó trong chuỗi, cách nhau một khoảng trắng, theo đúng thứ tự xuất hiện. Nếu không tìm thấy, in <b>-1</b>.</p></div>',
          expectedOutput: 'Example 1: s = "I love Prf192. I love programming", c = \'I\'\nOUTPUT:\n0 15\n\nExample 2: s = "Summer Summer", c = \'m\' (case-sensitive, lowercase only)\nOUTPUT:\n2 3 9 10',
          sampleSolution: '#include <stdio.h>\n#include <string.h>\nint main() {\n    char str[101];\n    fgets(str, sizeof(str), stdin);\n    int len = strlen(str);\n    if (len > 0 && str[len - 1] == \'\\n\') { str[len - 1] = \'\\0\'; len--; }\n    char ch;\n    scanf("%c", &ch);\n    int found = 0;\n    for (int i = 0; i < len; i++) {\n        if (str[i] == ch) {\n            if (found) printf(" ");\n            printf("%d", i);\n            found = 1;\n        }\n    }\n    if (!found) printf("-1");\n    printf("\\n");\n    return 0;\n}',
          rubric: RUBRIC,
        },
      ],
    },
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-SU25-B1-P8',
      source: 'REAL',
      title: 'Practical Exam — C Programming (SU25, Block 1, Paper 8)|||Thi thực hành — Lập trình C (SU25, Block 1, Đề 8)',
      description:
        'Real PE paper. Write each program in C, then zip all files (Q1.c … Q7.c) and upload for AI grading.|||Đề PE thật. Viết từng chương trình bằng C, nén tất cả file (Q1.c … Q7.c) thành .zip rồi nộp để AI chấm.',
      durationMinutes: 90,
      totalPoints: 7,
      passMark: 3,
      isPublished: true,
      attachmentUrl: '/exam-assets/PRF192-PE-SU25-B1-given.zip',
      attachmentName: 'Given — starter files (Q1.c … Q7.c)|||Given — file cho sẵn (Q1.c … Q7.c)',
      instructions:
        '<div class="ml-en"><p><b>How to take this exam:</b></p><ol>' +
        '<li><b>Download</b> the "Given" file below and <b>extract</b> the .zip — it contains the starter files <code>Q1.c … Q7.c</code>.</li>' +
        '<li>Open them in your own IDE / VS Code and write your solution in each file. <b>Keep the file names exactly</b> as given (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Test</b> your program against the example input/output shown in each question.</li>' +
        '<li>When done, select all <code>.c</code> files, compress them into <b>one <code>.zip</code></b>, and upload it in the submit box on the right.</li>' +
        '<li>AI grades each question against the spec, the expected output, and a reference solution, then shows your score + feedback.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi:</b></p><ol>' +
        '<li><b>Tải</b> file "Given" bên dưới và <b>giải nén</b> .zip — bên trong có các file mẫu <code>Q1.c … Q7.c</code>.</li>' +
        '<li>Mở bằng IDE / VS Code của bạn và viết lời giải vào từng file. <b>Giữ NGUYÊN tên file</b> như đề (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Chạy thử</b> chương trình với ví dụ input/output trong mỗi câu.</li>' +
        '<li>Xong xuôi, chọn tất cả file <code>.c</code>, nén thành <b>một file <code>.zip</code></b>, rồi tải lên ô nộp bài bên phải.</li>' +
        '<li>AI chấm từng câu theo đề, kết quả mong đợi và đáp án mẫu, rồi hiện điểm + nhận xét.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q1 (file: Q1.c).</b> Write a program that takes three integers <code>a</code>, <code>b</code>, and <code>c</code> as input, and calculates the area of a trapezoid using the formula <code>(a+b)*c/2</code>, rounding the result to two decimal places.</p></div>' +
            '<div class="ml-vi"><p><b>Q1 (file: Q1.c).</b> Viết chương trình đọc ba số nguyên <code>a</code>, <code>b</code>, <code>c</code>, và tính diện tích hình thang theo công thức <code>(a+b)*c/2</code>, làm tròn kết quả tới hai chữ số thập phân.</p></div>',
          expectedOutput: '6 3 3\nOUTPUT:\n13.50',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int a, b, c;\n    scanf("%d %d %d", &a, &b, &c);\n    double area = (a + b) * c / 2.0;\n    printf("%.2f\\n", area);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q2 (file: Q2.c).</b> Write a program that takes five integers from the keyboard and prints the count of numbers that are <b>even and positive</b>.</p></div>' +
            '<div class="ml-vi"><p><b>Q2 (file: Q2.c).</b> Viết chương trình đọc năm số nguyên từ bàn phím và in ra số lượng số vừa <b>chẵn vừa dương</b>.</p></div>',
          expectedOutput: '2 -4 3 8 -2\nOUTPUT:\n2',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int count = 0, x;\n    for (int i = 0; i < 5; i++) {\n        scanf("%d", &x);\n        if (x > 0 && x % 2 == 0) count++;\n    }\n    printf("%d\\n", count);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q3 (file: Q3.c).</b> Write a program that takes two integers <code>a</code> and <code>b</code> (a &lt; b) and calculates the sum of all odd numbers from <code>a</code> to <code>b</code> (inclusive), then prints the result.</p></div>' +
            '<div class="ml-vi"><p><b>Q3 (file: Q3.c).</b> Viết chương trình đọc hai số nguyên <code>a</code> và <code>b</code> (a &lt; b) và tính tổng các số lẻ từ <code>a</code> đến <code>b</code> (bao gồm cả hai đầu), rồi in kết quả.</p></div>',
          expectedOutput: '3\n7\nOUTPUT:\n15',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    long sum = 0;\n    for (int i = a; i <= b; i++) if (i % 2 != 0) sum += i;\n    printf("%ld\\n", sum);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q4 (file: Q4.c).</b> Write a program that prints a hollow right triangle <code>x</code> pattern with side of <code>n</code> entered by the user (n is an integer). The right angle is at the bottom-right corner: each row is right-padded to width n, with an <code>x</code> on the diagonal (left) edge, an <code>x</code> on the right edge, and the bottom row fully filled with <code>x</code>.</p></div>' +
            '<div class="ml-vi"><p><b>Q4 (file: Q4.c).</b> Viết chương trình in tam giác vuông RỖNG bằng ký tự <code>x</code> với cạnh <code>n</code> do người dùng nhập (n là số nguyên). Góc vuông ở dưới-phải: mỗi dòng canh phải với độ rộng n, có <code>x</code> ở cạnh chéo (bên trái), <code>x</code> ở cạnh phải, dòng cuối (đáy) đặc kín <code>x</code>.</p></div>',
          expectedOutput: '5\nOUTPUT:\n    x\n   xx\n  x x\n x  x\nxxxxx',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    for (int i = 1; i <= n; i++) {\n        for (int s = 0; s < n - i; s++) printf(" ");\n        if (i == n) {\n            for (int k = 0; k < i; k++) printf("x");\n        } else if (i == 1) {\n            printf("x");\n        } else {\n            printf("x");\n            for (int k = 0; k < i - 2; k++) printf(" ");\n            printf("x");\n        }\n        printf("\\n");\n    }\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q5 (file: Q5.c).</b> Your program allows the user to enter an array of <code>n</code> integers, where n is a positive number entered by the user (n &gt; 0). The program then calculates and prints the sum of all odd numbers in the array. If there are no odd numbers, it prints: <b>"There are no odd numbers among the n elements"</b> (with the actual value of n).</p></div>' +
            '<div class="ml-vi"><p><b>Q5 (file: Q5.c).</b> Chương trình cho người dùng nhập một mảng gồm <code>n</code> số nguyên, n là số dương do người dùng nhập (n &gt; 0). Chương trình tính và in tổng các số lẻ trong mảng. Nếu không có số lẻ nào, in: <b>"There are no odd numbers among the n elements"</b> (thay n bằng giá trị thật).</p></div>',
          expectedOutput: 'Example 1: n=6, array = [9 3 2 7 6 4]\nOUTPUT:\n19\n\nExample 2: n=6, array = [2 8 6 4 10 12]\nOUTPUT:\nThere are no odd numbers among the 6 elements',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[100];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    long sum = 0;\n    int found = 0;\n    for (int i = 0; i < n; i++) {\n        if (arr[i] % 2 != 0) { sum += arr[i]; found = 1; }\n    }\n    if (found) printf("%ld\\n", sum);\n    else printf("There are no odd numbers among the %d elements\\n", n);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q6 (file: Q6.c).</b> Write a program that takes a string <code>s</code> (max 100 characters) and counts the number of words with an <b>even</b> number of characters.</p></div>' +
            '<div class="ml-vi"><p><b>Q6 (file: Q6.c).</b> Viết chương trình đọc chuỗi <code>s</code> (tối đa 100 ký tự) và đếm số từ có độ dài (số ký tự) là <b>số chẵn</b>.</p></div>',
          expectedOutput: 'Input: s = "I am a student of FPT University"\nOUTPUT:\n3',
          sampleSolution: '#include <stdio.h>\n#include <string.h>\nint main() {\n    char s[101];\n    fgets(s, sizeof(s), stdin);\n    s[strcspn(s, "\\n")] = \'\\0\';\n    int count = 0, wordLen = 0;\n    int len = strlen(s);\n    for (int i = 0; i <= len; i++) {\n        if (s[i] != \' \' && s[i] != \'\\0\') {\n            wordLen++;\n        } else {\n            if (wordLen > 0 && wordLen % 2 == 0) count++;\n            wordLen = 0;\n        }\n    }\n    printf("%d\\n", count);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q7 (file: Q7.c).</b> Write a program that accepts an array of <code>n</code> integers (where n &lt; 10) and outputs the <b>cubes</b> of all negative numbers, in <b>ascending order</b>.</p></div>' +
            '<div class="ml-vi"><p><b>Q7 (file: Q7.c).</b> Viết chương trình đọc mảng <code>n</code> số nguyên (n &lt; 10) và in ra <b>lập phương</b> của tất cả các số âm, theo thứ tự <b>tăng dần</b>.</p></div>',
          expectedOutput: 'Enter n = 5, array = {-2, 3, -4, 1, 0}\nOUTPUT:\n-64 -8',
          sampleSolution: '#include <stdio.h>\n#include <stdlib.h>\nint cmpAsc(const void *a, const void *b) {\n    long long x = *(const long long*)a, y = *(const long long*)b;\n    return (x > y) - (x < y);\n}\nint main() {\n    int n;\n    scanf("%d", &n);\n    long long arr[100];\n    for (int i = 0; i < n; i++) scanf("%lld", &arr[i]);\n    long long cubes[100];\n    int c = 0;\n    for (int i = 0; i < n; i++)\n        if (arr[i] < 0) cubes[c++] = arr[i] * arr[i] * arr[i];\n    qsort(cubes, c, sizeof(long long), cmpAsc);\n    for (int i = 0; i < c; i++) printf("%lld ", cubes[i]);\n    printf("\\n");\n    return 0;\n}',
          rubric: RUBRIC,
        },
      ],
    },
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-SU25-B1-P4',
      source: 'REAL',
      title: 'Practical Exam — C Programming (SU25, Block 1, Paper 4)|||Thi thực hành — Lập trình C (SU25, Block 1, Đề 4)',
      description:
        'Real PE paper. Write each program in C, then zip all files (Q1.c … Q10.c) and upload for AI grading.|||Đề PE thật. Viết từng chương trình bằng C, nén tất cả file (Q1.c … Q10.c) thành .zip rồi nộp để AI chấm.',
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      attachmentUrl: '/exam-assets/PRF192-PE-SU25-B1-P4-given.zip',
      attachmentName: 'Given — starter files (Q1.c … Q10.c)|||Given — file cho sẵn (Q1.c … Q10.c)',
      instructions:
        '<div class="ml-en"><p><b>How to take this exam:</b></p><ol>' +
        '<li><b>Download</b> the "Given" file below and <b>extract</b> the .zip — it contains the starter files <code>Q1.c … Q10.c</code>.</li>' +
        '<li>Open them in your own IDE / VS Code and write your solution in each file. <b>Keep the file names exactly</b> as given (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Test</b> your program against the example input/output shown in each question.</li>' +
        '<li>When done, select all <code>.c</code> files, compress them into <b>one <code>.zip</code></b>, and upload it in the submit box on the right.</li>' +
        '<li>AI grades each question against the spec, the expected output, and a reference solution, then shows your score + feedback.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi:</b></p><ol>' +
        '<li><b>Tải</b> file "Given" bên dưới và <b>giải nén</b> .zip — bên trong có các file mẫu <code>Q1.c … Q10.c</code>.</li>' +
        '<li>Mở bằng IDE / VS Code của bạn và viết lời giải vào từng file. <b>Giữ NGUYÊN tên file</b> như đề (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Chạy thử</b> chương trình với ví dụ input/output trong mỗi câu.</li>' +
        '<li>Xong xuôi, chọn tất cả file <code>.c</code>, nén thành <b>một file <code>.zip</code></b>, rồi tải lên ô nộp bài bên phải.</li>' +
        '<li>AI chấm từng câu theo đề, kết quả mong đợi và đáp án mẫu, rồi hiện điểm + nhận xét.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q1 (file: Q1.c).</b> Write a program that takes three integers <code>a</code>, <code>b</code>, and <code>c</code> as input, and calculates the area of a trapezoid using the formula <code>(a+b)*c/2</code>, rounding the result to two decimal places.</p></div>' +
            '<div class="ml-vi"><p><b>Q1 (file: Q1.c).</b> Viết chương trình đọc ba số nguyên <code>a</code>, <code>b</code>, <code>c</code>, và tính diện tích hình thang theo công thức <code>(a+b)*c/2</code>, làm tròn kết quả tới hai chữ số thập phân.</p></div>',
          expectedOutput: '6 3 3\nOUTPUT:\n13.50',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int a, b, c;\n    scanf("%d %d %d", &a, &b, &c);\n    double area = (a + b) * c / 2.0;\n    printf("%.2f\\n", area);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q2 (file: Q2.c).</b> Write a program that takes four integers as input and prints the largest one that is divisible by <b>2 or 3</b>.</p></div>' +
            '<div class="ml-vi"><p><b>Q2 (file: Q2.c).</b> Viết chương trình đọc bốn số nguyên và in ra số lớn nhất trong các số chia hết cho <b>2 hoặc 3</b>.</p></div>',
          expectedOutput: '4 9 6 7\nOUTPUT:\n9',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int a[4];\n    for (int i = 0; i < 4; i++) scanf("%d", &a[i]);\n    int best = -1;\n    for (int i = 0; i < 4; i++)\n        if ((a[i] % 2 == 0 || a[i] % 3 == 0) && (best == -1 || a[i] > best)) best = a[i];\n    printf("%d\\n", best);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q3 (file: Q3.c).</b> Write a program that takes two integers <code>a</code> and <code>b</code> (a &lt; b) and calculates the sum of all odd numbers from <code>a</code> to <code>b</code> (inclusive), then prints the result.</p></div>' +
            '<div class="ml-vi"><p><b>Q3 (file: Q3.c).</b> Viết chương trình đọc hai số nguyên <code>a</code> và <code>b</code> (a &lt; b) và tính tổng các số lẻ từ <code>a</code> đến <code>b</code> (bao gồm cả hai đầu), rồi in kết quả.</p></div>',
          expectedOutput: '3\n7\nOUTPUT:\n15',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    long sum = 0;\n    for (int i = a; i <= b; i++) if (i % 2 != 0) sum += i;\n    printf("%ld\\n", sum);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q4 (file: Q4.c).</b> Write a program that prints a hollow right triangle <code>+</code> pattern with side of <code>n</code> entered by the user (n is an integer). The right angle is at the top-left: the TOP row is fully filled with <code>+</code> (width n); each following row is one shorter, left-aligned, with a <code>+</code> at both ends and spaces in between (hollow), down to a single <code>+</code> at the bottom.</p></div>' +
            '<div class="ml-vi"><p><b>Q4 (file: Q4.c).</b> Viết chương trình in tam giác vuông RỖNG bằng ký tự <code>+</code> với cạnh <code>n</code> do người dùng nhập (n là số nguyên). Góc vuông ở trên-trái: dòng ĐẦU đặc kín <code>+</code> (độ rộng n); mỗi dòng sau ngắn hơn 1, canh trái, có <code>+</code> ở hai đầu và khoảng trắng ở giữa (rỗng), tới dòng cuối chỉ còn 1 <code>+</code>.</p></div>',
          expectedOutput: '5\nOUTPUT:\n+++++\n+  +\n+ +\n++\n+',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    for (int i = 1; i <= n; i++) {\n        int width = n - i + 1;\n        if (width == n) {\n            for (int k = 0; k < width; k++) printf("+");\n        } else if (width == 1) {\n            printf("+");\n        } else {\n            printf("+");\n            for (int k = 0; k < width - 2; k++) printf(" ");\n            printf("+");\n        }\n        printf("\\n");\n    }\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q5 (file: Q5.c).</b> Your program allows users to enter an array of <code>n</code> integers, where n is entered by the user (n &gt; 0). The program calculates and prints the sum of all <b>even</b> numbers in the array. If there are no even numbers, it prints: <b>"No even numbers among the n elements"</b> (with the actual value of n).</p></div>' +
            '<div class="ml-vi"><p><b>Q5 (file: Q5.c).</b> Chương trình cho người dùng nhập mảng <code>n</code> số nguyên, n do người dùng nhập (n &gt; 0). Chương trình tính và in tổng các số <b>chẵn</b> trong mảng. Nếu không có số chẵn nào, in: <b>"No even numbers among the n elements"</b> (thay n bằng giá trị thật).</p></div>',
          expectedOutput: 'Example 1: n=6, array = [9 3 2 7 4 6]\nOUTPUT:\n12\n\nExample 2: n=5, all-odd array\nOUTPUT:\nNo even numbers among the 5 elements',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[100];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    long sum = 0;\n    int found = 0;\n    for (int i = 0; i < n; i++) {\n        if (arr[i] % 2 == 0) { sum += arr[i]; found = 1; }\n    }\n    if (found) printf("%ld\\n", sum);\n    else printf("No even numbers among the %d elements\\n", n);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q6 (file: Q6.c).</b> Write a program that takes a string <code>s</code> (max 100 characters) and counts the number of words with an <b>even</b> number of characters.</p></div>' +
            '<div class="ml-vi"><p><b>Q6 (file: Q6.c).</b> Viết chương trình đọc chuỗi <code>s</code> (tối đa 100 ký tự) và đếm số từ có độ dài (số ký tự) là <b>số chẵn</b>.</p></div>',
          expectedOutput: 'Input: s = "I am a student of FPT University"\nOUTPUT:\n3',
          sampleSolution: '#include <stdio.h>\n#include <string.h>\nint main() {\n    char s[101];\n    fgets(s, sizeof(s), stdin);\n    s[strcspn(s, "\\n")] = \'\\0\';\n    int count = 0, wordLen = 0;\n    int len = strlen(s);\n    for (int i = 0; i <= len; i++) {\n        if (s[i] != \' \' && s[i] != \'\\0\') {\n            wordLen++;\n        } else {\n            if (wordLen > 0 && wordLen % 2 == 0) count++;\n            wordLen = 0;\n        }\n    }\n    printf("%d\\n", count);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q7 (file: Q7.c).</b> Write a program that accepts an array of <code>n</code> integers (where n &lt; 10) and outputs the <b>cubes</b> of all negative numbers, in <b>ascending order</b>.</p></div>' +
            '<div class="ml-vi"><p><b>Q7 (file: Q7.c).</b> Viết chương trình đọc mảng <code>n</code> số nguyên (n &lt; 10) và in ra <b>lập phương</b> của tất cả các số âm, theo thứ tự <b>tăng dần</b>.</p></div>',
          expectedOutput: 'Enter n = 5, array = {-2, 3, -4, 1, 0}\nOUTPUT:\n-64 -8',
          sampleSolution: '#include <stdio.h>\n#include <stdlib.h>\nint cmpAsc(const void *a, const void *b) {\n    long long x = *(const long long*)a, y = *(const long long*)b;\n    return (x > y) - (x < y);\n}\nint main() {\n    int n;\n    scanf("%d", &n);\n    long long arr[100];\n    for (int i = 0; i < n; i++) scanf("%lld", &arr[i]);\n    long long cubes[100];\n    int c = 0;\n    for (int i = 0; i < n; i++)\n        if (arr[i] < 0) cubes[c++] = arr[i] * arr[i] * arr[i];\n    qsort(cubes, c, sizeof(long long), cmpAsc);\n    for (int i = 0; i < c; i++) printf("%lld ", cubes[i]);\n    printf("\\n");\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q8 (file: Q8.c).</b> Write a program that accepts an array of <code>n</code> integers and prints all the elements that are greater than the <b>average</b> of the array, in the order they appear.</p></div>' +
            '<div class="ml-vi"><p><b>Q8 (file: Q8.c).</b> Viết chương trình đọc mảng <code>n</code> số nguyên và in ra tất cả phần tử lớn hơn <b>trung bình cộng</b> của mảng, theo đúng thứ tự xuất hiện.</p></div>',
          expectedOutput: 'n=7, array = [5 5 4 6 2 4 3] (average = 29/7 ≈ 4.14)\nOUTPUT:\n5 5 6',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[100];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    double sum = 0;\n    for (int i = 0; i < n; i++) sum += arr[i];\n    double avg = sum / n;\n    for (int i = 0; i < n; i++)\n        if (arr[i] > avg) printf("%d ", arr[i]);\n    printf("\\n");\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q9 (file: Q9.c).</b> The program allows the user to enter a string <code>s</code> with a maximum length of 100 characters. It removes all characters from the string except alphabetic letters (a-z, A-Z) and spaces (used as word separators), then prints the resulting string after <b>standardisation</b>: collapse repeated spaces into one, trim leading/trailing spaces, and capitalize the first letter of each word (rest lowercase).</p></div>' +
            '<div class="ml-vi"><p><b>Q9 (file: Q9.c).</b> Chương trình cho người dùng nhập chuỗi <code>s</code> tối đa 100 ký tự. Xóa tất cả ký tự trừ chữ cái (a-z, A-Z) và khoảng trắng (dùng để tách từ), rồi in chuỗi kết quả sau khi <b>chuẩn hóa</b>: gộp các khoảng trắng liên tiếp thành một, xóa khoảng trắng đầu/cuối, viết hoa chữ cái đầu mỗi từ (còn lại viết thường).</p></div>',
          expectedOutput: 'Enter: s = "@Welcome Spring semester - 2025!"\nOUTPUT:\nWelcome Spring Semester',
          sampleSolution: '#include <stdio.h>\n#include <ctype.h>\n#include <string.h>\nint main() {\n    char s[101];\n    fgets(s, sizeof(s), stdin);\n    s[strcspn(s, "\\n")] = \'\\0\';\n    char filtered[101];\n    int fc = 0;\n    for (int i = 0; s[i] != \'\\0\'; i++)\n        if (isalpha((unsigned char)s[i]) || s[i] == \' \') filtered[fc++] = s[i];\n    filtered[fc] = \'\\0\';\n    char result[101];\n    int rc = 0, wordStart = 1;\n    for (int i = 0; i < fc; i++) {\n        if (filtered[i] == \' \') {\n            if (rc > 0 && result[rc - 1] != \' \') result[rc++] = \' \';\n            wordStart = 1;\n        } else {\n            result[rc++] = wordStart ? toupper(filtered[i]) : tolower(filtered[i]);\n            wordStart = 0;\n        }\n    }\n    while (rc > 0 && result[rc - 1] == \' \') rc--;\n    result[rc] = \'\\0\';\n    printf("%s\\n", result);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q10 (file: Q10.c).</b> The program swaps the places of the first largest and (first) smallest <b>even</b> number with each other in the array, then prints the array.</p></div>' +
            '<div class="ml-vi"><p><b>Q10 (file: Q10.c).</b> Chương trình hoán đổi vị trí của số <b>chẵn</b> lớn nhất và số chẵn nhỏ nhất trong mảng cho nhau, rồi in mảng.</p></div>',
          expectedOutput: 'Enter n=7, array = {4, -2, 8, 0, 7, 6, 20}\nOUTPUT:\n4 20 8 0 7 6 -2',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[100];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    int maxIdx = -1, minIdx = -1;\n    for (int i = 0; i < n; i++) {\n        if (arr[i] % 2 == 0) {\n            if (maxIdx == -1 || arr[i] > arr[maxIdx]) maxIdx = i;\n            if (minIdx == -1 || arr[i] < arr[minIdx]) minIdx = i;\n        }\n    }\n    if (maxIdx != -1 && minIdx != -1) {\n        int t = arr[maxIdx]; arr[maxIdx] = arr[minIdx]; arr[minIdx] = t;\n    }\n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    return 0;\n}',
          rubric: RUBRIC,
        },
      ],
    },
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-SU25-P1',
      source: 'REAL',
      title: 'Practical Exam — C Programming (SU25, Paper 1)|||Thi thực hành — Lập trình C (SU25, Đề 1)',
      description:
        'Real PE paper. Write each program in C, then zip all files (Q1.c … Q4.c) and upload for AI grading.|||Đề PE thật. Viết từng chương trình bằng C, nén tất cả file (Q1.c … Q4.c) thành .zip rồi nộp để AI chấm.',
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      attachmentUrl: '/exam-assets/PRF192-PE-SU25-P1-given.zip',
      attachmentName: 'Given — starter files (Q1.c … Q4.c)|||Given — file cho sẵn (Q1.c … Q4.c)',
      instructions:
        '<div class="ml-en"><p><b>How to take this exam:</b></p><ol>' +
        '<li><b>Download</b> the "Given" file below and <b>extract</b> the .zip — it contains the starter files <code>Q1.c … Q4.c</code>.</li>' +
        '<li>Open them in your own IDE / VS Code and write your solution in each file. <b>Keep the file names exactly</b> as given (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Test</b> your program against the example input/output shown in each question.</li>' +
        '<li>When done, select all <code>.c</code> files, compress them into <b>one <code>.zip</code></b>, and upload it in the submit box on the right.</li>' +
        '<li>AI grades each question against the spec, the expected output, and a reference solution, then shows your score + feedback.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi:</b></p><ol>' +
        '<li><b>Tải</b> file "Given" bên dưới và <b>giải nén</b> .zip — bên trong có các file mẫu <code>Q1.c … Q4.c</code>.</li>' +
        '<li>Mở bằng IDE / VS Code của bạn và viết lời giải vào từng file. <b>Giữ NGUYÊN tên file</b> như đề (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Chạy thử</b> chương trình với ví dụ input/output trong mỗi câu.</li>' +
        '<li>Xong xuôi, chọn tất cả file <code>.c</code>, nén thành <b>một file <code>.zip</code></b>, rồi tải lên ô nộp bài bên phải.</li>' +
        '<li>AI chấm từng câu theo đề, kết quả mong đợi và đáp án mẫu, rồi hiện điểm + nhận xét.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 2, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q1 (file: Q1.c).</b> The given file <code>Q1.c</code> already contains statements to input the double variable <code>water_usage</code> (assume water_usage &gt; 0). Write statements to calculate the total water bill based on this tiered pricing scheme:</p><ul><li>The first 5 cubic meters (m&sup3;) are charged at 3000 VND per m&sup3;.</li><li>The next 4 cubic meters (from 6m&sup3; to 9m&sup3;) are charged at 5000 VND per m&sup3;.</li><li>From the 10th cubic meter and above are charged at 7000 VND per m&sup3;.</li></ul><p>The output result is formatted to two decimal places.</p></div>' +
            '<div class="ml-vi"><p><b>Q1 (file: Q1.c).</b> File <code>Q1.c</code> cho sẵn đã có lệnh nhập biến thực <code>water_usage</code> (giả sử water_usage &gt; 0). Viết lệnh tính tổng tiền nước theo bậc thang giá sau:</p><ul><li>5 m&sup3; đầu tiên: 3000 VND/m&sup3;.</li><li>4 m&sup3; tiếp theo (từ m&sup3; thứ 6 đến thứ 9): 5000 VND/m&sup3;.</li><li>Từ m&sup3; thứ 10 trở đi: 7000 VND/m&sup3;.</li></ul><p>Kết quả in ra định dạng hai chữ số thập phân.</p></div>',
          expectedOutput: 'water_usage=12.5 (5*3000 + 4*5000 + 3.5*7000 = 59500)\nOUTPUT:\n59500.00',
          sampleSolution: '#include <stdio.h>\nint main() {\n    double usage;\n    scanf("%lf", &usage);\n    double bill;\n    if (usage <= 5) {\n        bill = usage * 3000;\n    } else if (usage <= 9) {\n        bill = 5 * 3000 + (usage - 5) * 5000;\n    } else {\n        bill = 5 * 3000 + 4 * 5000 + (usage - 9) * 7000;\n    }\n    printf("%.2f\\n", bill);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 3, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q2 (file: Q2.c).</b> The provided file <code>Q2.c</code> includes statements to input an integer <code>n</code>. Write statements to calculate the sum of the <b>third powers (cubes)</b> of all digits of <code>n</code>.</p></div>' +
            '<div class="ml-vi"><p><b>Q2 (file: Q2.c).</b> File <code>Q2.c</code> cho sẵn đã có lệnh nhập số nguyên <code>n</code>. Viết lệnh tính tổng <b>lập phương</b> của tất cả các chữ số của <code>n</code>.</p></div>',
          expectedOutput: 'n = 321 (3^3 + 2^3 + 1^3 = 36)\nOUTPUT:\n36',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int sum = 0;\n    while (n != 0) {\n        int d = n % 10;\n        sum += d * d * d;\n        n /= 10;\n    }\n    printf("%d\\n", sum);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q3 (file: Q3.c).</b> The given file <code>Q3.c</code> already contains statements to input data for an integer 1-D array. Write statements to calculate the sum of <b>odd</b> numbers in the array if the first number in the array is odd; otherwise, if the first number is even, calculate the sum of <b>even</b> numbers in the array.</p></div>' +
            '<div class="ml-vi"><p><b>Q3 (file: Q3.c).</b> File <code>Q3.c</code> cho sẵn đã có lệnh nhập mảng số nguyên 1 chiều. Viết lệnh tính tổng các số <b>lẻ</b> trong mảng nếu phần tử đầu tiên là số lẻ; ngược lại nếu phần tử đầu tiên là số chẵn, tính tổng các số <b>chẵn</b> trong mảng.</p></div>',
          expectedOutput: 'Example 1: n=5, array = [1 4 7 2 9] (first "1" is odd)\nOUTPUT:\n17\n\nExample 2: n=6, array = [4 5 6 2 7 17] (first "4" is even)\nOUTPUT:\n12',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[50];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    int sum = 0;\n    if (arr[0] % 2 != 0) {\n        for (int i = 0; i < n; i++) if (arr[i] % 2 != 0) sum += arr[i];\n    } else {\n        for (int i = 0; i < n; i++) if (arr[i] % 2 == 0) sum += arr[i];\n    }\n    printf("%d\\n", sum);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 3, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q4 (file: Q4.c).</b> The given file <code>Q4.c</code> already contains statements to input a string named <code>s</code>. Write statements to replace all characters in the string <code>s</code> that are <b>not letters</b> (both uppercase and lowercase) with the <code>*</code> character.</p></div>' +
            '<div class="ml-vi"><p><b>Q4 (file: Q4.c).</b> File <code>Q4.c</code> cho sẵn đã có lệnh nhập chuỗi <code>s</code>. Viết lệnh thay thế tất cả ký tự trong chuỗi <code>s</code> mà <b>không phải chữ cái</b> (hoa và thường) bằng ký tự <code>*</code>.</p></div>',
          expectedOutput: 'Enter string : he LLo@12#!\nOUTPUT:\nhe*LLo*****',
          sampleSolution: '#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nint main() {\n    char s[51];\n    fgets(s, sizeof(s), stdin);\n    s[strcspn(s, "\\n")] = \'\\0\';\n    for (int i = 0; s[i] != \'\\0\'; i++)\n        if (!isalpha((unsigned char)s[i])) s[i] = \'*\';\n    printf("%s\\n", s);\n    return 0;\n}',
          rubric: RUBRIC,
        },
      ],
    },
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-FA24-P02',
      source: 'REAL',
      title: 'Practical Exam — C Programming (FA24, Paper 2)|||Thi thực hành — Lập trình C (FA24, Đề 2)',
      description:
        'Real PE paper. Write each program in C, then zip all files (Q1.c … Q4.c) and upload for AI grading.|||Đề PE thật. Viết từng chương trình bằng C, nén tất cả file (Q1.c … Q4.c) thành .zip rồi nộp để AI chấm.',
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      attachmentUrl: '/exam-assets/PRF192-PE-FA24-P02-given.zip',
      attachmentName: 'Given — starter files (Q1.c … Q4.c)|||Given — file cho sẵn (Q1.c … Q4.c)',
      instructions:
        '<div class="ml-en"><p><b>How to take this exam:</b></p><ol>' +
        '<li><b>Download</b> the "Given" file below and <b>extract</b> the .zip — it contains the starter files <code>Q1.c … Q4.c</code>.</li>' +
        '<li>Open them in your own IDE / VS Code and write your solution in each file. <b>Keep the file names exactly</b> as given (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Test</b> your program against the example input/output shown in each question.</li>' +
        '<li>When done, select all <code>.c</code> files, compress them into <b>one <code>.zip</code></b>, and upload it in the submit box on the right.</li>' +
        '<li>AI grades each question against the spec, the expected output, and a reference solution, then shows your score + feedback.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi:</b></p><ol>' +
        '<li><b>Tải</b> file "Given" bên dưới và <b>giải nén</b> .zip — bên trong có các file mẫu <code>Q1.c … Q4.c</code>.</li>' +
        '<li>Mở bằng IDE / VS Code của bạn và viết lời giải vào từng file. <b>Giữ NGUYÊN tên file</b> như đề (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Chạy thử</b> chương trình với ví dụ input/output trong mỗi câu.</li>' +
        '<li>Xong xuôi, chọn tất cả file <code>.c</code>, nén thành <b>một file <code>.zip</code></b>, rồi tải lên ô nộp bài bên phải.</li>' +
        '<li>AI chấm từng câu theo đề, kết quả mong đợi và đáp án mẫu, rồi hiện điểm + nhận xét.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 2, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q1 (file: Q1.c).</b> The given file <code>Q1.c</code> already contains statements to input the radius of a circle. Write statements to calculate the area of the circle with <code>area = 3.14 * radius * radius</code>. The output result is formatted to two decimal places.</p></div>' +
            '<div class="ml-vi"><p><b>Q1 (file: Q1.c).</b> File <code>Q1.c</code> cho sẵn đã có lệnh nhập bán kính hình tròn. Viết lệnh tính diện tích hình tròn với <code>area = 3.14 * radius * radius</code>. Kết quả in ra định dạng hai chữ số thập phân.</p></div>',
          expectedOutput: 'radius = 3\nOUTPUT:\n28.26',
          sampleSolution: '#include <stdio.h>\nint main() {\n    double r;\n    scanf("%lf", &r);\n    double area = 3.14 * r * r;\n    printf("%.2f\\n", area);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 3, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q2 (file: Q2.c).</b> The given file <code>Q2.c</code> already contains statements to input an integer variable named <code>n</code>. Write statements to calculate the following expression value:</p><p><code>S(n) = (1 + 1/1&sup2;) * (1 + 1/2&sup2;) * ... * (1 + 1/n&sup2;)</code></p><p>The output value is formatted to two decimal places.</p></div>' +
            '<div class="ml-vi"><p><b>Q2 (file: Q2.c).</b> File <code>Q2.c</code> cho sẵn đã có lệnh nhập số nguyên <code>n</code>. Viết lệnh tính giá trị biểu thức:</p><p><code>S(n) = (1 + 1/1&sup2;) * (1 + 1/2&sup2;) * ... * (1 + 1/n&sup2;)</code></p><p>Kết quả in ra định dạng hai chữ số thập phân.</p></div>',
          expectedOutput: 'n = 10\nOUTPUT:\n3.34',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    double s = 1.0;\n    for (int i = 1; i <= n; i++) s *= (1 + 1.0 / (i * i));\n    printf("%.2f\\n", s);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q3 (file: Q3.c).</b> The given file <code>Q3.c</code> already contains statements to input data for an integer 1-D array and an integer variable named <code>x</code>. Write statements to count the elements that have the <b>last digit</b> equal to <code>x</code>.</p></div>' +
            '<div class="ml-vi"><p><b>Q3 (file: Q3.c).</b> File <code>Q3.c</code> cho sẵn đã có lệnh nhập mảng số nguyên 1 chiều và biến nguyên <code>x</code>. Viết lệnh đếm số phần tử có <b>chữ số cuối</b> bằng <code>x</code>.</p></div>',
          expectedOutput: 'Array: 15 12 22 23 2, x=2\nOUTPUT:\n3 (12, 22, 2 all end in digit 2)',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[100];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    int x;\n    scanf("%d", &x);\n    int count = 0;\n    for (int i = 0; i < n; i++) if (arr[i] % 10 == x) count++;\n    printf("%d\\n", count);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 3, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q4 (file: Q4.c).</b> The given file <code>Q4.c</code> already contains statements to input data for two strings: <code>s</code> and <code>k</code>. Write statements to count the number of times <code>k</code> occurs in string <code>s</code> (occurrences may overlap). Hint: all strings have extra spaces removed and are converted to lowercase before comparison.</p></div>' +
            '<div class="ml-vi"><p><b>Q4 (file: Q4.c).</b> File <code>Q4.c</code> cho sẵn đã có lệnh nhập hai chuỗi <code>s</code> và <code>k</code>. Viết lệnh đếm số lần <code>k</code> xuất hiện trong chuỗi <code>s</code> (các lần xuất hiện có thể chồng lấn). Gợi ý: mọi chuỗi đã được xóa khoảng trắng thừa và chuyển về chữ thường trước khi so sánh.</p></div>',
          expectedOutput: 'Example 1: s = "Practice Exam PRF192", k = "Pr"\nOUTPUT:\n2\n\nExample 2: s = "Practice Exam PRF192", k = "test"\nOUTPUT:\n0',
          sampleSolution: '#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nint main() {\n    char s[101], k[101];\n    fgets(s, sizeof(s), stdin);\n    s[strcspn(s, "\\n")] = \'\\0\';\n    fgets(k, sizeof(k), stdin);\n    k[strcspn(k, "\\n")] = \'\\0\';\n    for (int i = 0; s[i]; i++) s[i] = tolower((unsigned char)s[i]);\n    for (int i = 0; k[i]; i++) k[i] = tolower((unsigned char)k[i]);\n    int count = 0;\n    char *pos = strstr(s, k);\n    while (pos != NULL) {\n        count++;\n        pos = strstr(pos + 1, k);\n    }\n    printf("%d\\n", count);\n    return 0;\n}',
          rubric: RUBRIC,
        },
      ],
    },
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-SU24-B5-P6',
      source: 'REAL',
      title: 'Practical Exam — C Programming (SU24, Block 5, Paper 6)|||Thi thực hành — Lập trình C (SU24, Block 5, Đề 6)',
      description:
        'Real PE paper. Write each program in C, then zip all files (Q1.c … Q10.c) and upload for AI grading.|||Đề PE thật. Viết từng chương trình bằng C, nén tất cả file (Q1.c … Q10.c) thành .zip rồi nộp để AI chấm.',
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      attachmentUrl: '/exam-assets/PRF192-PE-SU24-B5-P6-given.zip',
      attachmentName: 'Given — starter files (Q1.c … Q10.c)|||Given — file cho sẵn (Q1.c … Q10.c)',
      instructions:
        '<div class="ml-en"><p><b>How to take this exam:</b></p><ol>' +
        '<li><b>Download</b> the "Given" file below and <b>extract</b> the .zip — it contains the starter files <code>Q1.c … Q10.c</code>.</li>' +
        '<li>Open them in your own IDE / VS Code and write your solution in each file. <b>Keep the file names exactly</b> as given (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Test</b> your program against the example input/output shown in each question.</li>' +
        '<li>When done, select all <code>.c</code> files, compress them into <b>one <code>.zip</code></b>, and upload it in the submit box on the right.</li>' +
        '<li>AI grades each question against the spec, the expected output, and a reference solution, then shows your score + feedback.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi:</b></p><ol>' +
        '<li><b>Tải</b> file "Given" bên dưới và <b>giải nén</b> .zip — bên trong có các file mẫu <code>Q1.c … Q10.c</code>.</li>' +
        '<li>Mở bằng IDE / VS Code của bạn và viết lời giải vào từng file. <b>Giữ NGUYÊN tên file</b> như đề (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Chạy thử</b> chương trình với ví dụ input/output trong mỗi câu.</li>' +
        '<li>Xong xuôi, chọn tất cả file <code>.c</code>, nén thành <b>một file <code>.zip</code></b>, rồi tải lên ô nộp bài bên phải.</li>' +
        '<li>AI chấm từng câu theo đề, kết quả mong đợi và đáp án mẫu, rồi hiện điểm + nhận xét.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q1 (file: Q1.c).</b> Users are required to enter two "double" numbers: <code>a</code> and <code>b</code> using the keyboard (STDIN). Print out the result of <code>a*x - b = 0</code> (i.e. solve for x = b/a), with 3 decimal places.</p></div>' +
            '<div class="ml-vi"><p><b>Q1 (file: Q1.c).</b> Người dùng nhập hai số thực <code>a</code> và <code>b</code>. In ra nghiệm x của phương trình <code>a*x - b = 0</code> (tức x = b/a), với 3 chữ số thập phân.</p></div>',
          expectedOutput: 'a=5.123, b=9.123\nOUTPUT:\n1.781',
          sampleSolution: '#include <stdio.h>\nint main() {\n    double a, b;\n    scanf("%lf %lf", &a, &b);\n    double x = b / a;\n    printf("%.3f\\n", x);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q2 (file: Q2.c).</b> Users are required to enter two integer numbers: <code>x</code> and <code>y</code> (x &lt; y). Print the sum of the <b>even</b> numbers from x to y (inclusive).</p></div>' +
            '<div class="ml-vi"><p><b>Q2 (file: Q2.c).</b> Người dùng nhập hai số nguyên <code>x</code> và <code>y</code> (x &lt; y). In tổng các số <b>chẵn</b> từ x đến y (bao gồm cả hai đầu).</p></div>',
          expectedOutput: 'x=2, y=20\nOUTPUT:\n110',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int x, y;\n    scanf("%d %d", &x, &y);\n    long sum = 0;\n    for (int i = x; i <= y; i++) if (i % 2 == 0) sum += i;\n    printf("%ld\\n", sum);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q3 (file: Q3.c).</b> Your program allows the user to enter an array of <code>n</code> integer numbers (n entered from STDIN). Print the <b>even</b> numbers sorted in <b>ascending</b> order, one per line.</p></div>' +
            '<div class="ml-vi"><p><b>Q3 (file: Q3.c).</b> Chương trình cho người dùng nhập mảng <code>n</code> số nguyên. In các số <b>chẵn</b> theo thứ tự <b>tăng dần</b>, mỗi số một dòng.</p></div>',
          expectedOutput: 'n=6, array = [2 -4 5 8 15 0]\nOUTPUT:\n-4\n0\n2\n8',
          sampleSolution: '#include <stdio.h>\n#include <stdlib.h>\nint cmpAsc(const void *a, const void *b) { return *(const int*)a - *(const int*)b; }\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[100];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    int even[100], ec = 0;\n    for (int i = 0; i < n; i++) if (arr[i] % 2 == 0) even[ec++] = arr[i];\n    qsort(even, ec, sizeof(int), cmpAsc);\n    for (int i = 0; i < ec; i++) printf("%d\\n", even[i]);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q4 (file: Q4.c).</b> Users are required to enter an integer number to define rows of a half pyramid of alphabets (rows &gt; 0). Print the half pyramid of alphabet letters, wrapping around to \'A\' after \'Z\'. Row 1 (top) has <code>rows</code> letters, each following row has one fewer letter than the previous.</p></div>' +
            '<div class="ml-vi"><p><b>Q4 (file: Q4.c).</b> Người dùng nhập số dòng <code>rows</code> (rows &gt; 0). In nửa tam giác chữ cái, quay vòng lại \'A\' sau \'Z\'. Dòng 1 (trên cùng) có <code>rows</code> chữ cái, mỗi dòng sau ít hơn dòng trước 1 chữ cái.</p></div>',
          expectedOutput: 'rows = 6\nOUTPUT:\nA B C D E F\nG H I J K\nL M N O\nP Q R\nS T\nU',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int rows;\n    scanf("%d", &rows);\n    char ch = \'A\';\n    for (int i = 0; i < rows; i++) {\n        for (int j = 0; j < rows - i; j++) {\n            if (ch > \'Z\') ch = \'A\';\n            printf("%c ", ch++);\n        }\n        printf("\\n");\n    }\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q5 (file: Q5.c).</b> Your program allows users to enter an array of <code>n</code> integers, where n is entered by the user (n &gt; 0). Print the sum of all <b>even</b> numbers. If there are no even numbers in the array, print <b>"There are no even numbers in n elements"</b> (with the actual value of n).</p></div>' +
            '<div class="ml-vi"><p><b>Q5 (file: Q5.c).</b> Chương trình cho người dùng nhập mảng <code>n</code> số nguyên (n &gt; 0). In tổng các số <b>chẵn</b>. Nếu không có số chẵn nào, in <b>"There are no even numbers in n elements"</b> (thay n bằng giá trị thật).</p></div>',
          expectedOutput: 'Example 1: n=6, array = [9 3 2 7 4 6]\nOUTPUT:\n12\n\nExample 2 (test case 1): n=5, array = [3 9 1 5 7]\nOUTPUT:\nThere are no even numbers in 5 elements',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[100];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    long sum = 0;\n    int found = 0;\n    for (int i = 0; i < n; i++) if (arr[i] % 2 == 0) { sum += arr[i]; found = 1; }\n    if (found) printf("%ld\\n", sum);\n    else printf("There are no even numbers in %d elements\\n", n);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q6 (file: Q6.c).</b> Your program allows the user to enter a string <code>s</code> with a maximum length of 100 characters. Find and print the number of words whose first letter is a <b>consonant</b> (a letter that is not \'a\', \'e\', \'i\', \'o\', \'u\', and not case sensitive).</p></div>' +
            '<div class="ml-vi"><p><b>Q6 (file: Q6.c).</b> Chương trình cho người dùng nhập chuỗi <code>s</code> tối đa 100 ký tự. Tìm và in số từ có chữ cái đầu là <b>phụ âm</b> (chữ cái không phải \'a\', \'e\', \'i\', \'o\', \'u\', không phân biệt hoa thường).</p></div>',
          expectedOutput: 'Enter s = "I am a student of FPT University"\nOUTPUT:\n2',
          sampleSolution: '#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nint isConsonant(char c) {\n    c = tolower((unsigned char)c);\n    return isalpha((unsigned char)c) && c != \'a\' && c != \'e\' && c != \'i\' && c != \'o\' && c != \'u\';\n}\nint main() {\n    char s[101];\n    fgets(s, sizeof(s), stdin);\n    s[strcspn(s, "\\n")] = \'\\0\';\n    int count = 0, wordStart = 1;\n    for (int i = 0; s[i] != \'\\0\'; i++) {\n        if (isspace((unsigned char)s[i])) {\n            wordStart = 1;\n        } else {\n            if (wordStart && isConsonant(s[i])) count++;\n            wordStart = 0;\n        }\n    }\n    printf("%d\\n", count);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q7 (file: Q7.c).</b> Your program should allow users to enter an array of <code>n</code> integer numbers. Find and display each pair: frequency of number divisible by <b>5</b> and the number itself, on a line, in the format <code>count-value</code>, following the order the distinct numbers were first entered.</p></div>' +
            '<div class="ml-vi"><p><b>Q7 (file: Q7.c).</b> Chương trình cho người dùng nhập mảng <code>n</code> số nguyên. Tìm và hiển thị mỗi cặp: tần suất của số chia hết cho <b>5</b> và giá trị số đó, mỗi cặp một dòng, định dạng <code>count-value</code>, theo thứ tự số khác nhau xuất hiện lần đầu.</p></div>',
          expectedOutput: 'n=7, array = [25 15 9 15 15 20 20]\nOUTPUT:\n1-25\n3-15\n2-20',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[100];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    for (int i = 0; i < n; i++) {\n        if (arr[i] % 5 == 0) {\n            int already = 0;\n            for (int j = 0; j < i; j++) if (arr[j] == arr[i]) { already = 1; break; }\n            if (!already) {\n                int count = 0;\n                for (int j = i; j < n; j++) if (arr[j] == arr[i]) count++;\n                printf("%d-%d\\n", count, arr[i]);\n            }\n        }\n    }\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q8 (file: Q8.c).</b> Your program allows the user to enter an integer array of <code>n</code> elements from the keyboard. The program swaps the places of the first largest and (first) smallest <b>odd</b> number with each other, then prints the array.</p></div>' +
            '<div class="ml-vi"><p><b>Q8 (file: Q8.c).</b> Chương trình cho người dùng nhập mảng <code>n</code> số nguyên. Hoán đổi vị trí số <b>lẻ</b> lớn nhất và số lẻ nhỏ nhất cho nhau, rồi in mảng.</p></div>',
          expectedOutput: 'n=7, array = [2 5 8 0 9 6 20]\nOUTPUT:\n2 9 8 0 5 6 20',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[100];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    int minIdx = -1, maxIdx = -1;\n    for (int i = 0; i < n; i++) {\n        if (arr[i] % 2 != 0) {\n            if (minIdx == -1 || arr[i] < arr[minIdx]) minIdx = i;\n            if (maxIdx == -1 || arr[i] > arr[maxIdx]) maxIdx = i;\n        }\n    }\n    if (minIdx != -1 && maxIdx != -1 && minIdx != maxIdx) {\n        int t = arr[minIdx]; arr[minIdx] = arr[maxIdx]; arr[maxIdx] = t;\n    }\n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q9 (file: Q9.c).</b> Your program allows the user to enter a string <code>s</code> with a maximum length of 100 characters. Convert the first letter of each word to uppercase. Print out the string <code>s</code> after the conversion.</p></div>' +
            '<div class="ml-vi"><p><b>Q9 (file: Q9.c).</b> Chương trình cho người dùng nhập chuỗi <code>s</code> tối đa 100 ký tự. Chuyển chữ cái đầu mỗi từ thành chữ hoa. In chuỗi <code>s</code> sau khi chuyển đổi.</p></div>',
          expectedOutput: 'Input: "scarlett johansson"\nOUTPUT:\nScarlett Johansson',
          sampleSolution: '#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nint main() {\n    char s[101];\n    fgets(s, sizeof(s), stdin);\n    s[strcspn(s, "\\n")] = \'\\0\';\n    int capNext = 1;\n    for (int i = 0; s[i] != \'\\0\'; i++) {\n        if (isspace((unsigned char)s[i])) {\n            capNext = 1;\n        } else if (capNext && isalpha((unsigned char)s[i])) {\n            s[i] = toupper((unsigned char)s[i]);\n            capNext = 0;\n        } else {\n            capNext = 0;\n        }\n    }\n    printf("%s\\n", s);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q10 (file: Q10.c).</b> Your program allows users to enter an integer number <code>n</code> (10 &lt; n &lt; 100), then it should display 4 prime numbers whose values are less than n, starting from the number closest to n. A newline character is between any two adjacent numbers.</p></div>' +
            '<div class="ml-vi"><p><b>Q10 (file: Q10.c).</b> Chương trình cho người dùng nhập số nguyên <code>n</code> (10 &lt; n &lt; 100), sau đó hiển thị 4 số nguyên tố nhỏ hơn n, bắt đầu từ số gần n nhất. Mỗi số một dòng.</p></div>',
          expectedOutput: 'n = 20\nOUTPUT:\n19\n17\n13\n11',
          sampleSolution: '#include <stdio.h>\nint isPrime(int num) {\n    if (num < 2) return 0;\n    for (int i = 2; i * i <= num; i++) if (num % i == 0) return 0;\n    return 1;\n}\nint main() {\n    int n;\n    scanf("%d", &n);\n    int count = 0;\n    for (int i = n - 1; i > 1 && count < 4; i--) {\n        if (isPrime(i)) { printf("%d\\n", i); count++; }\n    }\n    return 0;\n}',
          rubric: RUBRIC,
        },
      ],
    },
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-SP24-P1',
      source: 'REAL',
      title: 'Practical Exam — C Programming (SP24, Paper 1)|||Thi thực hành — Lập trình C (SP24, Đề 1)',
      description:
        'Real PE paper. Write each program in C, then zip all files (Q1.c … Q4.c) and upload for AI grading.|||Đề PE thật. Viết từng chương trình bằng C, nén tất cả file (Q1.c … Q4.c) thành .zip rồi nộp để AI chấm.',
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      attachmentUrl: '/exam-assets/PRF192-PE-SP24-P1-given.zip',
      attachmentName: 'Given — starter files (Q1.c … Q4.c)|||Given — file cho sẵn (Q1.c … Q4.c)',
      instructions:
        '<div class="ml-en"><p><b>How to take this exam:</b></p><ol>' +
        '<li><b>Download</b> the "Given" file below and <b>extract</b> the .zip — it contains the starter files <code>Q1.c … Q4.c</code>.</li>' +
        '<li>Open them in your own IDE / VS Code and write your solution in each file. <b>Keep the file names exactly</b> as given (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Test</b> your program against the example input/output shown in each question.</li>' +
        '<li>When done, select all <code>.c</code> files, compress them into <b>one <code>.zip</code></b>, and upload it in the submit box on the right.</li>' +
        '<li>AI grades each question against the spec, the expected output, and a reference solution, then shows your score + feedback.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi:</b></p><ol>' +
        '<li><b>Tải</b> file "Given" bên dưới và <b>giải nén</b> .zip — bên trong có các file mẫu <code>Q1.c … Q4.c</code>.</li>' +
        '<li>Mở bằng IDE / VS Code của bạn và viết lời giải vào từng file. <b>Giữ NGUYÊN tên file</b> như đề (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Chạy thử</b> chương trình với ví dụ input/output trong mỗi câu.</li>' +
        '<li>Xong xuôi, chọn tất cả file <code>.c</code>, nén thành <b>một file <code>.zip</code></b>, rồi tải lên ô nộp bài bên phải.</li>' +
        '<li>AI chấm từng câu theo đề, kết quả mong đợi và đáp án mẫu, rồi hiện điểm + nhận xét.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 2, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q1 (file: Q1.c).</b> The given file <code>Q1.c</code> already contains statements to input data for two real variables named <code>a</code> and <code>b</code> (a and b are not zero). Write statements to check if they have the <b>same sign</b>; if so, print the result of <code>a&sup2; + b&sup2;</code>, otherwise print the result of <code>a*b</code>. The output value is formatted to two decimal places.</p></div>' +
            '<div class="ml-vi"><p><b>Q1 (file: Q1.c).</b> File <code>Q1.c</code> cho sẵn đã có lệnh nhập hai số thực <code>a</code> và <code>b</code> (a và b khác 0). Viết lệnh kiểm tra chúng có <b>cùng dấu</b> hay không; nếu có, in ra <code>a&sup2; + b&sup2;</code>, ngược lại in ra <code>a*b</code>. Kết quả in ra định dạng hai chữ số thập phân.</p></div>',
          expectedOutput: 'Example 1: a=-3.5, b=-4.5 (same sign)\nOUTPUT:\n32.50\n\nExample 2: a=-3.5, b=4.5 (different sign)\nOUTPUT:\n-15.75',
          sampleSolution: '#include <stdio.h>\nint main() {\n    float a, b;\n    scanf("%f %f", &a, &b);\n    double result;\n    if ((a > 0 && b > 0) || (a < 0 && b < 0)) {\n        result = a * a + b * b;\n    } else {\n        result = a * b;\n    }\n    printf("%.2f\\n", result);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 3, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q2 (file: Q2.c).</b> The given file <code>Q2.c</code> already contains statements to input data for integer variable <code>n</code> (n&gt;0). Write statements to calculate <b>S</b> (formatted to two decimal places) by <code>n</code>, where S is defined as:</p><p><code>S(n) = 1/&radic;1&sup3; + 2/&radic;2&sup3; + 3/&radic;3&sup3; + ... + n/&radic;n&sup3;</code></p></div>' +
            '<div class="ml-vi"><p><b>Q2 (file: Q2.c).</b> File <code>Q2.c</code> cho sẵn đã có lệnh nhập số nguyên <code>n</code> (n&gt;0). Viết lệnh tính <b>S</b> (định dạng hai chữ số thập phân) theo <code>n</code>, với S được định nghĩa:</p><p><code>S(n) = 1/&radic;1&sup3; + 2/&radic;2&sup3; + 3/&radic;3&sup3; + ... + n/&radic;n&sup3;</code></p></div>',
          expectedOutput: 'n = 2\nOUTPUT:\n1.71',
          sampleSolution: '#include <stdio.h>\n#include <math.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    double s = 0;\n    for (int i = 1; i <= n; i++) s += i / sqrt(i * i * i);\n    printf("%.2f\\n", s);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q3 (file: Q3.c).</b> The given file <code>Q3.c</code> already contains statements to input data for an integer 1-D array and an integer variable named <code>x</code>. Write statements to count the <b>even</b> elements that are <b>greater than x</b> in the array.</p></div>' +
            '<div class="ml-vi"><p><b>Q3 (file: Q3.c).</b> File <code>Q3.c</code> cho sẵn đã có lệnh nhập mảng số nguyên 1 chiều và biến nguyên <code>x</code>. Viết lệnh đếm số phần tử <b>chẵn</b> mà <b>lớn hơn x</b> trong mảng.</p></div>',
          expectedOutput: 'n=5, array = [1 7 8 4 10], x=4\nOUTPUT:\n2 (8 and 10 are even and > 4)',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[100];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    int x;\n    scanf("%d", &x);\n    int count = 0;\n    for (int i = 0; i < n; i++) if (arr[i] % 2 == 0 && arr[i] > x) count++;\n    printf("%d\\n", count);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 3, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q4 (file: Q4.c).</b> The given file <code>Q4.c</code> already contains statements to input a string named <code>str</code> and a character named <code>ch</code>. Write statements to count the number of occurrences of the character <code>ch</code> in the string <code>str</code> (<b>not case-sensitive</b> for letters).</p></div>' +
            '<div class="ml-vi"><p><b>Q4 (file: Q4.c).</b> File <code>Q4.c</code> cho sẵn đã có lệnh nhập chuỗi <code>str</code> và ký tự <code>ch</code>. Viết lệnh đếm số lần xuất hiện của ký tự <code>ch</code> trong chuỗi <code>str</code> (chữ cái <b>không phân biệt hoa thường</b>).</p></div>',
          expectedOutput: 'Example 1: str = "12A3aaaABC", ch = \'a\'\nOUTPUT:\n5\n\nExample 2: str = "12B3a2bA2BC", ch = \'2\'\nOUTPUT:\n3',
          sampleSolution: '#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nint main() {\n    char str[51], ch;\n    scanf("%50[^\\n]", str);\n    getchar();\n    scanf("%c", &ch);\n    int count = 0;\n    for (int i = 0; str[i] != \'\\0\'; i++)\n        if (tolower((unsigned char)str[i]) == tolower((unsigned char)ch)) count++;\n    printf("%d\\n", count);\n    return 0;\n}',
          rubric: RUBRIC,
        },
      ],
    },
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-SU24-P8',
      source: 'REAL',
      title: 'Practical Exam — C Programming (SU24, Paper 8)|||Thi thực hành — Lập trình C (SU24, Đề 8)',
      description:
        'Real PE paper. Write each program in C, then zip all files (Q1.c … Q10.c) and upload for AI grading.|||Đề PE thật. Viết từng chương trình bằng C, nén tất cả file (Q1.c … Q10.c) thành .zip rồi nộp để AI chấm.',
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      attachmentUrl: '/exam-assets/PRF192-PE-SU24-P8-given.zip',
      attachmentName: 'Given — starter files (Q1.c … Q10.c)|||Given — file cho sẵn (Q1.c … Q10.c)',
      instructions:
        '<div class="ml-en"><p><b>How to take this exam:</b></p><ol>' +
        '<li><b>Download</b> the "Given" file below and <b>extract</b> the .zip — it contains the starter files <code>Q1.c … Q10.c</code>.</li>' +
        '<li>Open them in your own IDE / VS Code and write your solution in each file. <b>Keep the file names exactly</b> as given (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Test</b> your program against the example input/output shown in each question.</li>' +
        '<li>When done, select all <code>.c</code> files, compress them into <b>one <code>.zip</code></b>, and upload it in the submit box on the right.</li>' +
        '<li>AI grades each question against the spec, the expected output, and a reference solution, then shows your score + feedback.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi:</b></p><ol>' +
        '<li><b>Tải</b> file "Given" bên dưới và <b>giải nén</b> .zip — bên trong có các file mẫu <code>Q1.c … Q10.c</code>.</li>' +
        '<li>Mở bằng IDE / VS Code của bạn và viết lời giải vào từng file. <b>Giữ NGUYÊN tên file</b> như đề (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Chạy thử</b> chương trình với ví dụ input/output trong mỗi câu.</li>' +
        '<li>Xong xuôi, chọn tất cả file <code>.c</code>, nén thành <b>một file <code>.zip</code></b>, rồi tải lên ô nộp bài bên phải.</li>' +
        '<li>AI chấm từng câu theo đề, kết quả mong đợi và đáp án mẫu, rồi hiện điểm + nhận xét.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q1 (file: Q1.c).</b> The program asks the user to enter two integers <code>a</code> and <code>b</code>. Print the result of <code>1/a + 1/b</code>, with 2 digits after the decimal point.</p></div>' +
            '<div class="ml-vi"><p><b>Q1 (file: Q1.c).</b> Chương trình đọc hai số nguyên <code>a</code> và <code>b</code>. In kết quả <code>1/a + 1/b</code>, với 2 chữ số thập phân.</p></div>',
          expectedOutput: 'a=3, b=7\nOUTPUT:\n0.48',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    double result = 1.0 / a + 1.0 / b;\n    printf("%.2f\\n", result);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q2 (file: Q2.c).</b> The program requires the user to enter two integers <code>m</code> and <code>n</code> (m &lt; n). If m &gt; n, swap the values. Print the total (sum) of the numbers from m to n.</p></div>' +
            '<div class="ml-vi"><p><b>Q2 (file: Q2.c).</b> Chương trình đọc hai số nguyên <code>m</code> và <code>n</code> (m &lt; n). Nếu m &gt; n, hoán đổi giá trị. In tổng các số từ m đến n.</p></div>',
          expectedOutput: 'm=5, n=10\nOUTPUT:\n45',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int m, n;\n    scanf("%d %d", &m, &n);\n    if (m > n) { int t = m; m = n; n = t; }\n    long sum = 0;\n    for (int i = m; i <= n; i++) sum += i;\n    printf("%ld\\n", sum);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q3 (file: Q3.c).</b> The program asks the user to enter any integer <code>n</code>. Count and print the numbers in the range from 1 to 100 divisible by n. If no number satisfies, print <b>"There is no number divisible by n"</b> (with the actual value of n).</p></div>' +
            '<div class="ml-vi"><p><b>Q3 (file: Q3.c).</b> Chương trình đọc số nguyên <code>n</code>. Đếm và in số lượng số trong khoảng 1 đến 100 chia hết cho n. Nếu không có số nào, in <b>"There is no number divisible by n"</b> (thay n bằng giá trị thật).</p></div>',
          expectedOutput: 'Case 1: n=6\nOUTPUT:\n16\n\nCase 2: n=101\nOUTPUT:\nThere is no number divisible by 101',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int count = 0;\n    for (int i = 1; i <= 100; i++) if (i % n == 0) count++;\n    if (count == 0) printf("There is no number divisible by %d\\n", n);\n    else printf("%d\\n", count);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q4 (file: Q4.c).</b> Print a growing pattern using alphabets with <code>n</code> rows entered by the user. Row i has (2i-1) letters starting fresh from \'A\' each row, single-space separated, right-aligned so the widest (bottom) row starts at column 0 (each shorter row indented by 2 spaces per missing letter-pair).</p></div>' +
            '<div class="ml-vi"><p><b>Q4 (file: Q4.c).</b> In ra hình mẫu chữ cái tăng dần với <code>n</code> dòng do người dùng nhập. Dòng i có (2i-1) chữ cái, luôn bắt đầu lại từ \'A\', cách nhau một khoảng trắng, canh phải sao cho dòng rộng nhất (dòng cuối) bắt đầu từ cột 0 (mỗi dòng ngắn hơn thụt vào 2 khoảng trắng mỗi cặp chữ thiếu).</p></div>',
          expectedOutput: 'n = 6\nOUTPUT:\n          A\n        A B C\n      A B C D E\n    A B C D E F G\n  A B C D E F G H I\nA B C D E F G H I J K',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    for (int i = 1; i <= n; i++) {\n        for (int s = 0; s < n - i; s++) printf("  ");\n        for (int k = 0; k < 2 * i - 1; k++) {\n            printf("%c", \'A\' + k);\n            if (k < 2 * i - 2) printf(" ");\n        }\n        printf("\\n");\n    }\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q5 (file: Q5.c).</b> The program asks the user to enter an array of n integers. Find and print the <b>even</b> numbers in <b>ascending</b> order, space-separated on one line.</p></div>' +
            '<div class="ml-vi"><p><b>Q5 (file: Q5.c).</b> Chương trình đọc mảng n số nguyên. Tìm và in các số <b>chẵn</b> theo thứ tự <b>tăng dần</b>, cách nhau khoảng trắng trên một dòng.</p></div>',
          expectedOutput: 'n=6, array = [8 3 2 10 7 4]\nOUTPUT:\n2 4 8 10',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[100];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    int even[100], ec = 0;\n    for (int i = 0; i < n; i++) if (arr[i] % 2 == 0) even[ec++] = arr[i];\n    for (int i = 0; i < ec - 1; i++)\n        for (int j = 0; j < ec - i - 1; j++)\n            if (even[j] > even[j + 1]) { int t = even[j]; even[j] = even[j + 1]; even[j + 1] = t; }\n    for (int i = 0; i < ec; i++) printf("%d ", even[i]);\n    printf("\\n");\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q6 (file: Q6.c).</b> The program allows the user to enter a string containing any characters. Find and print the number of characters that are <b>lowercase letters</b>.</p></div>' +
            '<div class="ml-vi"><p><b>Q6 (file: Q6.c).</b> Chương trình đọc chuỗi bất kỳ ký tự. Tìm và in số ký tự là <b>chữ thường</b>.</p></div>',
          expectedOutput: 'Enter a string = "Summer semester 2024 - FPTU"\nOUTPUT:\n13',
          sampleSolution: '#include <stdio.h>\n#include <ctype.h>\nint main() {\n    char s[201];\n    fgets(s, sizeof(s), stdin);\n    int count = 0;\n    for (int i = 0; s[i] != \'\\0\'; i++) if (islower((unsigned char)s[i])) count++;\n    printf("%d\\n", count);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q7 (file: Q7.c).</b> The program allows users to enter an array of n real numbers, then a real number <code>k</code>. Print the elements of the array with values <b>other than k</b>, in <b>descending</b> order, space-separated on one line, 1 digit after the decimal point.</p></div>' +
            '<div class="ml-vi"><p><b>Q7 (file: Q7.c).</b> Chương trình đọc mảng n số thực, sau đó số thực <code>k</code>. In các phần tử <b>khác k</b>, theo thứ tự <b>giảm dần</b>, cách nhau khoảng trắng trên một dòng, 1 chữ số thập phân.</p></div>',
          expectedOutput: 'n=6, array = [2.2 3.5 4.11 5.5 4.11 8], k=4.11\nOUTPUT:\n8.0 5.5 3.5 2.2',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    float arr[100];\n    for (int i = 0; i < n; i++) scanf("%f", &arr[i]);\n    float k;\n    scanf("%f", &k);\n    float filtered[100];\n    int fc = 0;\n    for (int i = 0; i < n; i++) if (arr[i] != k) filtered[fc++] = arr[i];\n    for (int i = 0; i < fc - 1; i++)\n        for (int j = 0; j < fc - i - 1; j++)\n            if (filtered[j] < filtered[j + 1]) { float t = filtered[j]; filtered[j] = filtered[j + 1]; filtered[j + 1] = t; }\n    for (int i = 0; i < fc; i++) printf("%.1f ", filtered[i]);\n    printf("\\n");\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q8 (file: Q8.c).</b> The program allows the user to enter an array of n integers, considered the prices of each product. Calculate and print the amount the buyer has to pay for each product with 8% VAT, in the format <code>index - amount</code> (1-indexed).</p></div>' +
            '<div class="ml-vi"><p><b>Q8 (file: Q8.c).</b> Chương trình đọc mảng n số nguyên, là giá của từng sản phẩm. Tính và in số tiền phải trả cho mỗi sản phẩm với VAT 8%, định dạng <code>index - amount</code> (đánh số từ 1).</p></div>',
          expectedOutput: 'n=6, array = [8 10 15 9 50 10]\nOUTPUT:\n1 - 8.64\n2 - 10.80\n3 - 16.20\n4 - 9.72\n5 - 54.00\n6 - 10.80',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[100];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    for (int i = 0; i < n; i++) printf("%d - %.2f\\n", i + 1, arr[i] * 1.08);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q9 (file: Q9.c).</b> The program allows the user to enter 3 character strings: <code>s1</code>, <code>s2</code>, and <code>s3</code>. Search in string s1; if it contains substrings equal to s2, replace ALL of them with s3. Print the resulting string s1.</p></div>' +
            '<div class="ml-vi"><p><b>Q9 (file: Q9.c).</b> Chương trình đọc 3 chuỗi ký tự: <code>s1</code>, <code>s2</code>, <code>s3</code>. Tìm trong chuỗi s1; nếu có chuỗi con bằng s2, thay TẤT CẢ bằng s3. In chuỗi s1 sau khi thay thế.</p></div>',
          expectedOutput: 's1 = "Chao mung ban den voi ngon ngu lap trinh C", s2 = "ng", s3 = "AB"\nOUTPUT:\nChao muAB ban den voi ABon ABu lap trinh C',
          sampleSolution: '#include <stdio.h>\n#include <string.h>\nint main() {\n    char s1[201], s2[51], s3[51];\n    fgets(s1, sizeof(s1), stdin);\n    s1[strcspn(s1, "\\n")] = \'\\0\';\n    fgets(s2, sizeof(s2), stdin);\n    s2[strcspn(s2, "\\n")] = \'\\0\';\n    fgets(s3, sizeof(s3), stdin);\n    s3[strcspn(s3, "\\n")] = \'\\0\';\n    char result[401];\n    int rc = 0;\n    int len1 = strlen(s1), len2 = strlen(s2), len3 = strlen(s3);\n    for (int i = 0; i < len1;) {\n        if (len2 > 0 && strncmp(&s1[i], s2, len2) == 0) {\n            for (int j = 0; j < len3; j++) result[rc++] = s3[j];\n            i += len2;\n        } else {\n            result[rc++] = s1[i];\n            i++;\n        }\n    }\n    result[rc] = \'\\0\';\n    printf("%s\\n", result);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q10 (file: Q10.c).</b> The program allows the user to enter an array of n integers. Find and print the number of <b>perfect numbers</b> in the array (a perfect number is a number whose sum of its proper divisors equals itself, e.g. 6 = 1+2+3, 28 = 1+2+4+7+14). If there is no perfect number, print <b>"There is no perfect number among the n elements of the array"</b> (with the actual value of n).</p></div>' +
            '<div class="ml-vi"><p><b>Q10 (file: Q10.c).</b> Chương trình đọc mảng n số nguyên. Tìm và in số lượng <b>số hoàn hảo</b> trong mảng (số hoàn hảo là số có tổng các ước thực sự bằng chính nó, vd 6 = 1+2+3, 28 = 1+2+4+7+14). Nếu không có, in <b>"There is no perfect number among the n elements of the array"</b> (thay n bằng giá trị thật).</p></div>',
          expectedOutput: 'Case 1: n=5, array = [9 6 20 28 15]\nOUTPUT:\n2\n\nCase 2: n=5, array = [9 5 30 27 15]\nOUTPUT:\nThere is no perfect number among the 5 elements of the array',
          sampleSolution: '#include <stdio.h>\nint isPerfect(int num) {\n    if (num < 2) return 0;\n    int sum = 0;\n    for (int i = 1; i < num; i++) if (num % i == 0) sum += i;\n    return sum == num;\n}\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[100];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    int count = 0;\n    for (int i = 0; i < n; i++) if (isPerfect(arr[i])) count++;\n    if (count == 0) printf("There is no perfect number among the %d elements of the array\\n", n);\n    else printf("%d\\n", count);\n    return 0;\n}',
          rubric: RUBRIC,
        },
      ],
    },
    {
      kind: 'PE', peType: 'CODE',
      code: 'PE-SU25-P3',
      source: 'REAL',
      title: 'Practical Exam — C Programming (SU25, Block 1, Paper 3)|||Thi thực hành — Lập trình C (SU25, Block 1, Đề 3)',
      description:
        'Real PE paper. Write each program in C, then zip all files (Q1.c … Q10.c) and upload for AI grading.|||Đề PE thật. Viết từng chương trình bằng C, nén tất cả file (Q1.c … Q10.c) thành .zip rồi nộp để AI chấm.',
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 4,
      isPublished: true,
      attachmentUrl: '/exam-assets/PRF192-PE-SU25-P3-given.zip',
      attachmentName: 'Given — starter files (Q1.c … Q10.c)|||Given — file cho sẵn (Q1.c … Q10.c)',
      instructions:
        '<div class="ml-en"><p><b>How to take this exam:</b></p><ol>' +
        '<li><b>Download</b> the "Given" file below and <b>extract</b> the .zip — it contains the starter files <code>Q1.c … Q10.c</code>.</li>' +
        '<li>Open them in your own IDE / VS Code and write your solution in each file. <b>Keep the file names exactly</b> as given (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Test</b> your program against the example input/output shown in each question.</li>' +
        '<li>When done, select all <code>.c</code> files, compress them into <b>one <code>.zip</code></b>, and upload it in the submit box on the right.</li>' +
        '<li>AI grades each question against the spec, the expected output, and a reference solution, then shows your score + feedback.</li>' +
        '</ol></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài thi:</b></p><ol>' +
        '<li><b>Tải</b> file "Given" bên dưới và <b>giải nén</b> .zip — bên trong có các file mẫu <code>Q1.c … Q10.c</code>.</li>' +
        '<li>Mở bằng IDE / VS Code của bạn và viết lời giải vào từng file. <b>Giữ NGUYÊN tên file</b> như đề (<code>Q1.c</code>, <code>Q2.c</code>, …).</li>' +
        '<li><b>Chạy thử</b> chương trình với ví dụ input/output trong mỗi câu.</li>' +
        '<li>Xong xuôi, chọn tất cả file <code>.c</code>, nén thành <b>một file <code>.zip</code></b>, rồi tải lên ô nộp bài bên phải.</li>' +
        '<li>AI chấm từng câu theo đề, kết quả mong đợi và đáp án mẫu, rồi hiện điểm + nhận xét.</li>' +
        '</ol></div>',
      questions: [
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q1 (file: Q1.c).</b> Write a program that takes three integers <code>a</code>, <code>b</code>, and <code>c</code> as input, and calculates the area of a trapezoid using the formula <code>(a+b)*c/2</code>, rounding the result to two decimal places.</p></div>' +
            '<div class="ml-vi"><p><b>Q1 (file: Q1.c).</b> Viết chương trình đọc ba số nguyên <code>a</code>, <code>b</code>, <code>c</code>, và tính diện tích hình thang theo công thức <code>(a+b)*c/2</code>, làm tròn kết quả tới hai chữ số thập phân.</p></div>',
          expectedOutput: '6 3 3\nOUTPUT:\n13.50',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int a, b, c;\n    scanf("%d %d %d", &a, &b, &c);\n    double area = (a + b) * c / 2.0;\n    printf("%.2f\\n", area);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q2 (file: Q2.c).</b> Write a program that takes five integers from the keyboard and prints the count of numbers that are <b>even and positive</b>.</p></div>' +
            '<div class="ml-vi"><p><b>Q2 (file: Q2.c).</b> Viết chương trình đọc năm số nguyên từ bàn phím và in ra số lượng số vừa <b>chẵn vừa dương</b>.</p></div>',
          expectedOutput: '2 -4 3 8 -2\nOUTPUT:\n2',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int count = 0, x;\n    for (int i = 0; i < 5; i++) {\n        scanf("%d", &x);\n        if (x > 0 && x % 2 == 0) count++;\n    }\n    printf("%d\\n", count);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q3 (file: Q3.c).</b> Write a program that takes two integers <code>a</code> and <code>b</code> (a &lt; b) and calculates the sum of all odd numbers from <code>a</code> to <code>b</code> (inclusive), then prints the result.</p></div>' +
            '<div class="ml-vi"><p><b>Q3 (file: Q3.c).</b> Viết chương trình đọc hai số nguyên <code>a</code> và <code>b</code> (a &lt; b) và tính tổng các số lẻ từ <code>a</code> đến <code>b</code> (bao gồm cả hai đầu), rồi in kết quả.</p></div>',
          expectedOutput: '3\n7\nOUTPUT:\n15',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    long sum = 0;\n    for (int i = a; i <= b; i++) if (i % 2 != 0) sum += i;\n    printf("%ld\\n", sum);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q4 (file: Q4.c).</b> Your program prints a hollow inverted right triangle <code>+</code> pattern with side of <code>n</code> entered by the user (n is an integer). The TOP row is fully filled with <code>+</code> (width n); each following row is one shorter, with a <code>+</code> at both ends and spaces in between (hollow), down to a single <code>+</code> at the bottom.</p></div>' +
            '<div class="ml-vi"><p><b>Q4 (file: Q4.c).</b> Chương trình in tam giác vuông ngược RỖNG bằng ký tự <code>+</code> với cạnh <code>n</code> do người dùng nhập (n là số nguyên). Dòng ĐẦU đặc kín <code>+</code> (độ rộng n); mỗi dòng sau ngắn hơn 1, có <code>+</code> ở hai đầu và khoảng trắng ở giữa (rỗng), tới dòng cuối chỉ còn 1 <code>+</code>.</p></div>',
          expectedOutput: 'n = 5\nOUTPUT:\n+++++\n+  +\n+ +\n++\n+',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    for (int i = 1; i <= n; i++) {\n        int width = n - i + 1;\n        if (width == n) {\n            for (int k = 0; k < width; k++) printf("+");\n        } else if (width == 1) {\n            printf("+");\n        } else {\n            printf("+");\n            for (int k = 0; k < width - 2; k++) printf(" ");\n            printf("+");\n        }\n        printf("\\n");\n    }\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q5 (file: Q5.c).</b> Your program allows users to enter an array of <code>n</code> integers, where n is entered by the user (n &gt; 0). The program calculates and prints the sum of all <b>even</b> numbers. If there are no even numbers, it prints <b>"No even numbers among the n elements"</b> (with the actual value of n).</p></div>' +
            '<div class="ml-vi"><p><b>Q5 (file: Q5.c).</b> Chương trình cho người dùng nhập mảng <code>n</code> số nguyên, n do người dùng nhập (n &gt; 0). Chương trình tính và in tổng các số <b>chẵn</b>. Nếu không có số chẵn nào, in <b>"No even numbers among the n elements"</b> (thay n bằng giá trị thật).</p></div>',
          expectedOutput: 'Example 1: n=6, array = [9 3 2 7 4 6]\nOUTPUT:\n12',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[100];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    long sum = 0;\n    int found = 0;\n    for (int i = 0; i < n; i++) if (arr[i] % 2 == 0) { sum += arr[i]; found = 1; }\n    if (found) printf("%ld\\n", sum);\n    else printf("No even numbers among the %d elements\\n", n);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q6 (file: Q6.c).</b> Write a program that takes a string <code>s</code> (max 100 characters) and counts the number of words with an <b>even</b> number of characters.</p></div>' +
            '<div class="ml-vi"><p><b>Q6 (file: Q6.c).</b> Viết chương trình đọc chuỗi <code>s</code> (tối đa 100 ký tự) và đếm số từ có độ dài (số ký tự) là <b>số chẵn</b>.</p></div>',
          expectedOutput: 'Input: s = "I am a student of FPT University"\nOUTPUT:\n3',
          sampleSolution: '#include <stdio.h>\n#include <string.h>\nint main() {\n    char s[101];\n    fgets(s, sizeof(s), stdin);\n    s[strcspn(s, "\\n")] = \'\\0\';\n    int count = 0, wordLen = 0;\n    int len = strlen(s);\n    for (int i = 0; i <= len; i++) {\n        if (s[i] != \' \' && s[i] != \'\\0\') {\n            wordLen++;\n        } else {\n            if (wordLen > 0 && wordLen % 2 == 0) count++;\n            wordLen = 0;\n        }\n    }\n    printf("%d\\n", count);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q7 (file: Q7.c).</b> Write a program that accepts an array of <code>n</code> integers (where n &lt; 10) and outputs the <b>cubes</b> of all negative numbers, in <b>ascending order</b>.</p></div>' +
            '<div class="ml-vi"><p><b>Q7 (file: Q7.c).</b> Viết chương trình đọc mảng <code>n</code> số nguyên (n &lt; 10) và in ra <b>lập phương</b> của tất cả các số âm, theo thứ tự <b>tăng dần</b>.</p></div>',
          expectedOutput: 'n=5, array = {-2, 3, -4, 1, 0}\nOUTPUT:\n-64 -8',
          sampleSolution: '#include <stdio.h>\n#include <stdlib.h>\nint cmpAsc(const void *a, const void *b) {\n    long long x = *(const long long*)a, y = *(const long long*)b;\n    return (x > y) - (x < y);\n}\nint main() {\n    int n;\n    scanf("%d", &n);\n    long long arr[100];\n    for (int i = 0; i < n; i++) scanf("%lld", &arr[i]);\n    long long cubes[100];\n    int c = 0;\n    for (int i = 0; i < n; i++)\n        if (arr[i] < 0) cubes[c++] = arr[i] * arr[i] * arr[i];\n    qsort(cubes, c, sizeof(long long), cmpAsc);\n    for (int i = 0; i < c; i++) printf("%lld ", cubes[i]);\n    printf("\\n");\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q8 (file: Q8.c).</b> Write a program that takes an array of n integers and prints all numbers that appear <b>exactly twice</b>, in ascending order, with a newline between numbers.</p></div>' +
            '<div class="ml-vi"><p><b>Q8 (file: Q8.c).</b> Viết chương trình đọc mảng n số nguyên và in ra tất cả số xuất hiện <b>đúng hai lần</b>, theo thứ tự tăng dần, mỗi số một dòng.</p></div>',
          expectedOutput: 'n=8, array = [2 3 4 2 7 8 8 3]\nOUTPUT:\n2\n3\n8',
          sampleSolution: '#include <stdio.h>\n#include <stdlib.h>\nint cmpAsc(const void *a, const void *b) { return *(const int*)a - *(const int*)b; }\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[100];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    int result[100], rc = 0;\n    for (int i = 0; i < n; i++) {\n        int cnt = 0;\n        for (int j = 0; j < n; j++) if (arr[j] == arr[i]) cnt++;\n        if (cnt == 2) {\n            int already = 0;\n            for (int k = 0; k < rc; k++) if (result[k] == arr[i]) already = 1;\n            if (!already) result[rc++] = arr[i];\n        }\n    }\n    qsort(result, rc, sizeof(int), cmpAsc);\n    for (int i = 0; i < rc; i++) printf("%d\\n", result[i]);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q9 (file: Q9.c).</b> Your program allows users to enter a string <code>s</code> with maximum length of 100 characters. The system finds and removes all characters in the string except the alphabet characters (a-z, A-Z) — collapsing repeated spaces into one, trimming leading/trailing spaces, and capitalizing the first letter of each word (rest lowercase). Print the resulting string after standardization.</p></div>' +
            '<div class="ml-vi"><p><b>Q9 (file: Q9.c).</b> Chương trình cho người dùng nhập chuỗi <code>s</code> tối đa 100 ký tự. Xóa tất cả ký tự trừ chữ cái (a-z, A-Z) — gộp khoảng trắng liên tiếp thành một, xóa khoảng trắng đầu/cuối, viết hoa chữ cái đầu mỗi từ (còn lại viết thường). In chuỗi kết quả sau khi chuẩn hóa.</p></div>',
          expectedOutput: 'Enter: s = "@hello Spring 2024     semester!"\nOUTPUT:\nHello Spring Semester',
          sampleSolution: '#include <stdio.h>\n#include <ctype.h>\n#include <string.h>\nint main() {\n    char s[101];\n    fgets(s, sizeof(s), stdin);\n    s[strcspn(s, "\\n")] = \'\\0\';\n    char filtered[101];\n    int fc = 0;\n    for (int i = 0; s[i] != \'\\0\'; i++)\n        if (isalpha((unsigned char)s[i]) || s[i] == \' \') filtered[fc++] = s[i];\n    filtered[fc] = \'\\0\';\n    char result[101];\n    int rc = 0, wordStart = 1;\n    for (int i = 0; i < fc; i++) {\n        if (filtered[i] == \' \') {\n            if (rc > 0 && result[rc - 1] != \' \') result[rc++] = \' \';\n            wordStart = 1;\n        } else {\n            result[rc++] = wordStart ? toupper(filtered[i]) : tolower(filtered[i]);\n            wordStart = 0;\n        }\n    }\n    while (rc > 0 && result[rc - 1] == \' \') rc--;\n    result[rc] = \'\\0\';\n    printf("%s\\n", result);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 1, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q10 (file: Q10.c).</b> Your program allows the user to enter an integer array of <code>n</code> elements. The program swaps the places of the first largest and (first) smallest <b>odd</b> number with each other, then prints the array.</p></div>' +
            '<div class="ml-vi"><p><b>Q10 (file: Q10.c).</b> Chương trình cho người dùng nhập mảng <code>n</code> số nguyên. Hoán đổi vị trí số <b>lẻ</b> lớn nhất và số lẻ nhỏ nhất cho nhau, rồi in mảng.</p></div>',
          expectedOutput: 'n=7, array = [2 5 8 0 9 6 20]\nOUTPUT:\n2 9 8 0 5 6 20',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    int arr[100];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n    int minIdx = -1, maxIdx = -1;\n    for (int i = 0; i < n; i++) {\n        if (arr[i] % 2 != 0) {\n            if (minIdx == -1 || arr[i] < arr[minIdx]) minIdx = i;\n            if (maxIdx == -1 || arr[i] > arr[maxIdx]) maxIdx = i;\n        }\n    }\n    if (minIdx != -1 && maxIdx != -1 && minIdx != maxIdx) {\n        int t = arr[minIdx]; arr[minIdx] = arr[maxIdx]; arr[maxIdx] = t;\n    }\n    for (int i = 0; i < n; i++) printf("%d ", arr[i]);\n    printf("\\n");\n    return 0;\n}',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
