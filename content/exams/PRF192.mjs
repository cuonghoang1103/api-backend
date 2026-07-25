// PRF192 — Practical Exam (PE) sample paper, imported from the school's FA25 PE
// (Paper No. 3). Real problems; reference C solutions authored & test-run here
// (verified: 1.877 · 2 · 18 · hollow triangle). Students write in their own IDE,
// zip Q1.c..Q4.c, and upload for AI grading.

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
          kind: 'CODE', points: 2.5, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q1 (file: Q1.c).</b> Write a program that reads two floating-point numbers <code>a</code> and <code>b</code> from the keyboard and computes <b>(a + b) / (a - b)</b>. If <code>a - b</code> equals zero, print <b>"Invalid operation"</b>. Round the result to three decimal places.</p></div>' +
            '<div class="ml-vi"><p><b>Q1 (file: Q1.c).</b> Viết chương trình đọc hai số thực <code>a</code> và <code>b</code> từ bàn phím và tính <b>(a + b) / (a - b)</b>. Nếu <code>a - b</code> bằng 0, in <b>"Invalid operation"</b>. Làm tròn kết quả tới ba chữ số thập phân.</p></div>',
          expectedOutput: '10.5\n3.2\nOUTPUT:\n1.877',
          sampleSolution: '#include <stdio.h>\nint main() {\n    double a, b;\n    scanf("%lf %lf", &a, &b);\n    if (a - b == 0) {\n        printf("Invalid operation\\n");\n    } else {\n        printf("%.3f\\n", (a + b) / (a - b));\n    }\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q2 (file: Q2.c).</b> Write a program that reads three integers and prints the count of numbers that are divisible by 4.</p></div>' +
            '<div class="ml-vi"><p><b>Q2 (file: Q2.c).</b> Viết chương trình đọc ba số nguyên và in ra số lượng số chia hết cho 4.</p></div>',
          expectedOutput: '10\n8\n16\nOUTPUT:\n2',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int x, count = 0;\n    for (int i = 0; i < 3; i++) {\n        scanf("%d", &x);\n        if (x % 4 == 0) count++;\n    }\n    printf("%d\\n", count);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q3 (file: Q3.c).</b> Write a program that reads two integers <code>start</code> and <code>end</code> (start &le; end) and computes the sum of all numbers divisible by <b>9</b> in the range from <code>start+1</code> to <code>end-1</code>.</p></div>' +
            '<div class="ml-vi"><p><b>Q3 (file: Q3.c).</b> Viết chương trình đọc hai số nguyên <code>start</code> và <code>end</code> (start &le; end) và tính tổng các số chia hết cho <b>9</b> trong khoảng từ <code>start+1</code> tới <code>end-1</code>.</p></div>',
          expectedOutput: '9 27\nOUTPUT:\n18',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int start, end;\n    scanf("%d %d", &start, &end);\n    long sum = 0;\n    for (int i = start + 1; i <= end - 1; i++) {\n        if (i % 9 == 0) sum += i;\n    }\n    printf("%ld\\n", sum);\n    return 0;\n}',
          rubric: RUBRIC,
        },
        {
          kind: 'CODE', points: 2.5, language: 'c',
          prompt:
            '<div class="ml-en"><p><b>Q4 (file: Q4.c).</b> Write a program that prints a hollow right-angled triangle pattern using the character <code>#</code> with height <b>n</b> entered by the user.</p></div>' +
            '<div class="ml-vi"><p><b>Q4 (file: Q4.c).</b> Viết chương trình in tam giác vuông RỖNG bằng ký tự <code>#</code> với chiều cao <b>n</b> do người dùng nhập.</p></div>',
          expectedOutput: '7\nOUTPUT:\n#\n##\n# #\n#  #\n#   #\n#    #\n#######',
          sampleSolution: '#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    for (int i = 1; i <= n; i++) {\n        for (int j = 1; j <= i; j++) {\n            if (i == 1 || i == n || j == 1 || j == i) printf("#");\n            else printf(" ");\n        }\n        printf("\\n");\n    }\n    return 0;\n}',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
