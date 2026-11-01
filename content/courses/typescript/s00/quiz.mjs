/**
 * TypeScript · Mục 0 · Quiz Mục 0 (10 câu tình huống). BÀI MỚI 01/11/2026, slug typescript-0-5-quiz.
 * Mọi dữ kiện trong câu hỏi đã đo thật (Node 22.23.3, tsc 7.0.2, VS Code 1.124.2 / TS 6.0.3) — xem _HOP-DONG.md mục 1, 3.
 * Đáp án rải: A ×2 (câu 3, 7) · B ×3 (1, 5, 9) · C ×2 (4, 8) · D ×3 (2, 6, 10).
 */
export default {
  title: 'Section 0 check — 10 scenario questions|||Kiểm tra Mục 0 — 10 câu tình huống',
  slug: 'typescript-0-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về Mục 0: TypeScript là gì, Node chạy .ts mà không kiểm kiểu, enum và erasableSyntaxOnly, TS5112 khi gọi tsc kèm tên tệp, strict mặc định ở TS7, đọc lỗi từ lỗi đầu tiên, @ts-expect-error và TS2578, editor khác tsc, kiểu bị xoá lúc chạy, nghiên cứu 15% và sự cố seed của chính website — có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Check</span>
<h2>Section 0 check</h2>
<p class="lead">Ten situations you will really meet in your first week with TypeScript. Every fact in them was measured on Node 22.23.3 and tsc 7.0.2. Each answer explains why the right option is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say in one sentence what TypeScript adds to JavaScript, and what disappears when the code runs.</li>
<li>I can set up a project with pinned <code>typescript</code> and <code>@types/node</code>, and run both <code>npx tsc</code> and <code>node file.ts</code>.</li>
<li>I can read <code>file(line,col): error TSxxxx: message</code> and fix the first error first.</li>
<li>I know why checking (tsc) and running (node) are two separate steps.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Kiểm tra</span>
<h2>Kiểm tra Mục 0</h2>
<p class="lead">Mười tình huống bạn sẽ gặp thật trong tuần đầu dùng TypeScript. Mọi dữ kiện trong câu hỏi đều đã đo trên Node 22.23.3 và tsc 7.0.2. Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được trong một câu TypeScript thêm gì cho JavaScript, và cái gì biến mất khi code chạy.</li>
<li>Tôi dựng được dự án có ghim <code>typescript</code> và <code>@types/node</code>, chạy được cả <code>npx tsc</code> lẫn <code>node file.ts</code>.</li>
<li>Tôi đọc được <code>file(dòng,cột): error TSxxxx: thông báo</code> và sửa lỗi đầu tiên trước.</li>
<li>Tôi hiểu vì sao kiểm kiểu (tsc) và chạy (node) là hai bước tách rời.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'hello.ts contains const n: number = "5"; console.log(n). You run node hello.ts on Node 22.23.3 (no tsc). What happens?|||hello.ts có const n: number = "5"; console.log(n). Bạn chạy node hello.ts trên Node 22.23.3 (không chạy tsc). Chuyện gì xảy ra?',
        options: [
          'Node refuses to run it and prints error TS2322.|||Node từ chối chạy và in error TS2322.',
          'It runs and prints 5: Node strips the types and never checks them.|||Nó chạy và in 5: Node xoá kiểu đi và không bao giờ kiểm chúng.',
          'Node silently calls tsc first, so it prints the TS2322 error and then 5.|||Node âm thầm gọi tsc trước, nên in lỗi TS2322 rồi in 5.',
          'It crashes with ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX.|||Nó chết với ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Type stripping (on by default since Node 22.18) deletes the annotations and runs the JavaScript that is left — it never type-checks. Only tsc reports TS2322. Option D is tempting but that error is for syntax Node cannot erase (enum, namespace, parameter properties), not for a type mistake.|||VI: Type stripping (bật mặc định từ Node 22.18) xoá các chú thích kiểu rồi chạy phần JavaScript còn lại — nó không bao giờ kiểm kiểu. Chỉ tsc mới báo TS2322. Phương án D hấp dẫn nhưng lỗi đó dành cho cú pháp Node không xoá được (enum, namespace, parameter property), không phải cho một lỗi kiểu.',
      },
      {
        question: 'A teammate adds enum Status { Pending, Confirmed } to booking.ts. npx tsc passes, but node src/booking.ts crashes with ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX. What does this course recommend?|||Một bạn thêm enum Status { Pending, Confirmed } vào booking.ts. npx tsc qua, nhưng node src/booking.ts chết với ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX. Khoá này khuyên gì?',
        options: [
          'Downgrade to Node 20, which runs enums.|||Hạ xuống Node 20, bản đó chạy được enum.',
          'Type the value as any so Node stops complaining.|||Gõ kiểu giá trị là any cho Node hết kêu.',
          'Delete tsconfig.json so tsc and Node agree.|||Xoá tsconfig.json để tsc và Node khớp nhau.',
          'Use a union of string literals (type Status = "PENDING" | "CONFIRMED") and keep erasableSyntaxOnly on, so tsc reports TS1294 before Node ever crashes.|||Dùng union các chuỗi literal (type Status = "PENDING" | "CONFIRMED") và giữ erasableSyntaxOnly, để tsc báo TS1294 trước khi Node kịp chết.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: An enum creates a real JavaScript object, so it cannot simply be erased; Node 22 runs in strip-only mode. The erasableSyntaxOnly option in the course tsconfig makes tsc refuse such syntax (TS1294) so you find out at check time. Option A is wrong: Node 20 cannot run .ts files at all without a tool.|||VI: Enum tạo ra một object JavaScript thật nên không thể chỉ xoá đi; Node 22 chạy ở chế độ chỉ-xoá-kiểu. Tuỳ chọn erasableSyntaxOnly trong tsconfig của khoá khiến tsc từ chối cú pháp đó (TS1294) để bạn biết ngay lúc kiểm. Phương án A sai: Node 20 không tự chạy được tệp .ts nếu không có công cụ.',
      },
      {
        question: 'In the LabFlow TS folder (which has a tsconfig.json) you type npx tsc src/rules/time.ts. With TypeScript 7.0.2, what do you get?|||Trong thư mục LabFlow TS (có tsconfig.json) bạn gõ npx tsc src/rules/time.ts. Với TypeScript 7.0.2, bạn nhận được gì?',
        options: [
          'error TS5112: tsconfig.json is present but will not be loaded if files are specified on commandline — use npx tsc -p . (or --ignoreConfig on purpose).|||error TS5112: tsconfig.json có mặt nhưng sẽ không được nạp khi chỉ định tệp trên dòng lệnh — dùng npx tsc -p . (hoặc cố ý thêm --ignoreConfig).',
          'tsc checks time.ts with the settings from tsconfig.json.|||tsc kiểm time.ts bằng cấu hình trong tsconfig.json.',
          'tsc quietly ignores tsconfig.json and checks with the defaults.|||tsc lặng lẽ bỏ qua tsconfig.json và kiểm bằng cấu hình mặc định.',
          'tsc writes time.js next to the file because noEmit only applies to projects.|||tsc ghi time.js cạnh tệp vì noEmit chỉ áp dụng cho dự án.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Measured on 7.0.2: the command stops with TS5112 and exit code 1. Option C is what the tsc --help text suggests ("Ignoring tsconfig.json"), which is why it is tempting — but in a folder that has a tsconfig the compiler refuses instead of guessing. Check a project with npx tsc -p <folder>.|||VI: Đo trên 7.0.2: lệnh dừng với TS5112 và mã thoát 1. Phương án C là điều mà dòng chữ trong tsc --help gợi ý ("Ignoring tsconfig.json"), nên rất dễ tin — nhưng ở thư mục có tsconfig, trình biên dịch từ chối thay vì đoán. Kiểm một dự án bằng npx tsc -p <thư mục>.',
      },
      {
        question: 'A file with function greet(name) { return "Hi " + name; } is checked by tsc 7.0.2 with --ignoreConfig and no other flags. Result?|||Một tệp có function greet(name) { return "Hi " + name; } được tsc 7.0.2 kiểm với --ignoreConfig, không thêm cờ nào. Kết quả?',
        options: [
          'No error: strict mode is off unless you turn it on.|||Không lỗi: chế độ strict tắt trừ khi bạn bật.',
          'error TS2322 on the return line.|||error TS2322 ở dòng return.',
          'error TS7006: Parameter \'name\' implicitly has an \'any\' type — strict is the default in TypeScript 7.|||error TS7006: Parameter \'name\' implicitly has an \'any\' type — strict là mặc định ở TypeScript 7.',
          'Only a warning; tsc exits with code 0.|||Chỉ là cảnh báo; tsc thoát mã 0.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: TypeScript 7 changed the default to strict: true, so noImplicitAny is on even without a tsconfig — measured: TS7006 appears without --strict and disappears with --strict false. Option A was true for TypeScript 5 and older, which is why many old tutorials say it.|||VI: TypeScript 7 đổi mặc định thành strict: true, nên noImplicitAny bật ngay cả khi không có tsconfig — đo được: TS7006 hiện ra dù không có --strict và biến mất khi thêm --strict false. Phương án A đúng với TypeScript 5 trở về trước, nên nhiều hướng dẫn cũ vẫn nói vậy.',
      },
      {
        question: 'You rename a type and tsc prints 9 errors. The first is in types.ts (Cannot find name), the other 8 are in files that use that type. What is the fastest way forward?|||Bạn đổi tên một kiểu và tsc in 9 lỗi. Lỗi đầu ở types.ts (Cannot find name), 8 lỗi còn lại ở các tệp dùng kiểu đó. Cách nhanh nhất là gì?',
        options: [
          'Fix the 8 callers one by one, starting from the last error.|||Sửa lần lượt 8 chỗ gọi, bắt đầu từ lỗi cuối.',
          'Fix the first error (the root cause) and run tsc again — the cascade usually disappears with it.|||Sửa lỗi đầu tiên (gốc rễ) rồi chạy lại tsc — chuỗi lỗi kéo theo thường biến mất cùng nó.',
          'Add // @ts-ignore above each of the 9 lines.|||Thêm // @ts-ignore trên mỗi dòng trong 9 dòng.',
          'Delete node_modules and reinstall, since 9 errors means a broken install.|||Xoá node_modules rồi cài lại, vì 9 lỗi nghĩa là cài hỏng.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: One broken declaration makes every use of it fail, so tsc reports the cause and its consequences. Fix the cause, re-run, then count again. Option C makes the red disappear but removes the protection on 9 lines and hides the real problem.|||VI: Một khai báo hỏng làm mọi chỗ dùng nó hỏng theo, nên tsc báo cả nguyên nhân lẫn hệ quả. Sửa nguyên nhân, chạy lại, rồi đếm lại. Phương án C làm hết đỏ nhưng gỡ bỏ sự bảo vệ trên 9 dòng và che mất vấn đề thật.',
      },
      {
        question: 'You put // @ts-expect-error above a line, then fix the line so it compiles. What does tsc report now?|||Bạn đặt // @ts-expect-error trên một dòng, rồi sửa dòng đó cho nó biên dịch được. Giờ tsc báo gì?',
        options: [
          'Nothing — the directive is ignored when there is no error.|||Không gì cả — chỉ thị bị bỏ qua khi không có lỗi.',
          'The line is skipped at runtime.|||Dòng đó bị bỏ qua lúc chạy.',
          'error TS2345 on the next line.|||error TS2345 ở dòng kế tiếp.',
          'error TS2578: Unused \'@ts-expect-error\' directive.|||error TS2578: Unused \'@ts-expect-error\' directive.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: @ts-expect-error is a promise that the next line has an error; when the promise breaks, tsc says so (TS2578). That is why it is useful for learning and for graders: it proves a wrong call is still refused. Option A describes @ts-ignore, which stays silent either way — the dangerous one.|||VI: @ts-expect-error là lời hứa rằng dòng kế có lỗi; khi lời hứa sai, tsc nói ra (TS2578). Vì vậy nó hữu ích cho việc học và cho máy chấm: nó chứng minh một lời gọi sai vẫn bị từ chối. Phương án A mô tả @ts-ignore — thứ im lặng trong mọi trường hợp, và là thứ nguy hiểm.',
      },
      {
        question: 'VS Code shows no red squiggle in your file, but npx tsc in CI fails. Which explanation fits what we measured?|||VS Code không hiện gạch đỏ nào trong tệp của bạn, nhưng npx tsc trong CI lại hỏng. Giải thích nào khớp với điều ta đã đo?',
        options: [
          'The editor and the gate can differ: VS Code 1.124.2 uses its bundled TypeScript 6.0.3 and may not have every file open, while CI runs the project\'s tsc 7.0.2 over the whole tsconfig. The gate is npx tsc.|||Editor và cổng kiểm có thể khác nhau: VS Code 1.124.2 dùng TypeScript 6.0.3 đóng gói sẵn và có thể không mở hết mọi tệp, còn CI chạy tsc 7.0.2 của dự án trên toàn bộ tsconfig. Cổng kiểm là npx tsc.',
          'CI is wrong; trust the editor.|||CI sai; hãy tin editor.',
          'tsc 7 is unstable and reports random errors.|||tsc 7 chưa ổn định và báo lỗi ngẫu nhiên.',
          'Node 22 in CI checks types differently from Node on your machine.|||Node 22 trên CI kiểm kiểu khác với Node trên máy bạn.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: The editor only shows errors for what its language service has loaded, with its own TypeScript version; the CI command checks every file in the config with the pinned compiler. Option D is wrong because Node never checks types at all.|||VI: Editor chỉ hiện lỗi của những gì dịch vụ ngôn ngữ của nó đã nạp, với phiên bản TypeScript của riêng nó; lệnh trong CI kiểm mọi tệp trong cấu hình bằng trình biên dịch đã ghim. Phương án D sai vì Node không bao giờ kiểm kiểu.',
      },
      {
        question: 'type User = { name: string }; function isUser(x: unknown) { return x instanceof User; } — what does tsc say, and why?|||type User = { name: string }; function isUser(x: unknown) { return x instanceof User; } — tsc nói gì, và vì sao?',
        options: [
          'Nothing; instanceof works on every type.|||Không gì; instanceof dùng được với mọi kiểu.',
          'TS2322, because the function returns boolean.|||TS2322, vì hàm trả về boolean.',
          'TS2693: \'User\' only refers to a type, but is being used as a value here — types are erased, so there is nothing to compare against at runtime.|||TS2693: \'User\' only refers to a type, but is being used as a value here — kiểu bị xoá, nên lúc chạy chẳng có gì để so.',
          'TS18046, because x is unknown.|||TS18046, vì x là unknown.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: instanceof needs a constructor that exists when the code runs. A type alias exists only for the checker. To test data at runtime you write a check in JavaScript (typeof, in, a guard function, later Zod). Option D is tempting because unknown does restrict use, but instanceof is exactly one of the allowed ways to narrow unknown — the problem is the right-hand side.|||VI: instanceof cần một hàm khởi tạo tồn tại khi code chạy. Một type alias chỉ tồn tại với trình kiểm tra. Muốn kiểm dữ liệu lúc chạy thì viết phép kiểm bằng JavaScript (typeof, in, hàm guard, sau này là Zod). Phương án D hấp dẫn vì unknown đúng là hạn chế cách dùng, nhưng instanceof chính là một cách hợp lệ để thu hẹp unknown — vấn đề nằm ở vế phải.',
      },
      {
        question: 'Gao, Bird and Barr (ICSE 2017) annotated 400 public JavaScript bugs. What did they find, and what follows for your project?|||Gao, Bird và Barr (ICSE 2017) gắn kiểu cho 400 bug JavaScript công khai. Họ tìm thấy gì, và điều đó có nghĩa gì cho dự án của bạn?',
        options: [
          'TypeScript caught all 400, so tests are no longer needed.|||TypeScript bắt được cả 400, nên không cần test nữa.',
          'TypeScript 2.0 and Flow 0.30 each detected 15% — worth having, and you still need tests for the rest.|||TypeScript 2.0 và Flow 0.30 mỗi bên phát hiện 15% — đáng dùng, và bạn vẫn cần test cho phần còn lại.',
          'They measured that 38% of bugs are preventable.|||Họ đo được 38% bug có thể ngăn được.',
          'Static types made no measurable difference.|||Kiểu tĩnh không tạo khác biệt đo được nào.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: 15% of bugs that had already survived testing and review — a conservative number, and a big one. Option C mixes up sources: 38% is Airbnb\'s internal postmortem estimate reported by InfoQ, not this study.|||VI: 15% số bug đã lọt qua cả test lẫn review — một con số thận trọng, và vẫn lớn. Phương án C nhầm nguồn: 38% là ước tính hậu kiểm nội bộ của Airbnb do InfoQ đưa tin, không phải nghiên cứu này.',
      },
      {
        question: 'On 08/08/2026 this website renamed ContentType CODE to CODE_REVIEW. Every check passed, yet the seed broke production. What is the lesson for your own projects?|||Ngày 08/08/2026 website này đổi tên ContentType CODE thành CODE_REVIEW. Mọi phép kiểm đều qua, vậy mà seed vẫn vỡ production. Bài học cho dự án của bạn là gì?',
        options: [
          'Prisma has a bug with enums, so avoid Prisma.|||Prisma có lỗi với enum, nên tránh Prisma.',
          'Never rename anything in a type.|||Đừng bao giờ đổi tên gì trong một kiểu.',
          'Run the seed with node in CI instead of tsc.|||Chạy seed bằng node trong CI thay vì tsc.',
          'A hand-copied type is checked against itself, not against the source, and a file outside every tsconfig is never checked: import types from one place and make sure every file is in some tsc run.|||Một kiểu chép tay chỉ được kiểm với chính nó, không với nguồn, và một tệp nằm ngoài mọi tsconfig thì không bao giờ được kiểm: import kiểu từ một chỗ và bảo đảm tệp nào cũng nằm trong một lần chạy tsc.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: seed.ts carried its own copy of the union and the main tsconfig excluded prisma/**, so nothing compared it with the real enum. The fix was a second config (tsconfig.seed.json) plus npm run typecheck:seed. Option C would only find the problem by crashing — exactly what types are meant to prevent.|||VI: seed.ts mang bản chép riêng của union và tsconfig chính loại prisma/**, nên không gì so nó với enum thật. Cách sửa là một cấu hình thứ hai (tsconfig.seed.json) cộng npm run typecheck:seed. Phương án C chỉ phát hiện lỗi bằng cách để nó chết — đúng điều kiểu tĩnh sinh ra để ngăn.',
      },
    ],
  },
};
