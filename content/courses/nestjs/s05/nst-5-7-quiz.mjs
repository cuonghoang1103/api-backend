/**
 * 5.7 — Kiểm tra Chương 5 (khoá nestjs, soạn 24/11/2026). 10 câu; đáp án đối chiếu output chạy thật (scratchpad/nst/lab/c5/o):
 * câu 1 51 (get("PORT") = "3100" string), câu 2 51 (PORT=8080 thắng .env), câu 3 51 (đọc lúc nạp tệp ⇒ undefined), câu 4 51 (4b: bốn lỗi,
 * exit=1), câu 5 51bt (z.coerce.boolean ⇒ true), câu 6 52-git (git show HEAD~1:.env vẫn in bí mật), câu 7 52-docker (ARG trong history),
 * câu 8 53 (log injection văn bản vs JSON), câu 9 53-q9 (redact không che chuỗi), câu 10 54-alias (tsc exit 0, ERR_MODULE_NOT_FOUND).
 * Phân bố đáp án: A3 B2 C2 D3.
 */
export default {
  title: '5.7 — Chapter 5 quiz|||5.7 — Kiểm tra Chương 5',
  slug: 'nst-5-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống về Chương 5: ConfigService trả chuỗi, thứ tự ưu tiên biến tiến trình và tệp .env, đọc process.env quá sớm, schema báo mọi lỗi, bẫy z.coerce.boolean, bí mật còn trong lịch sử git và docker history, log injection, redact không che chuỗi, và bí danh tsconfig paths sập lúc chạy.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, each checked against real output from this chapter. Configuration bugs are the ones that "work on my machine" — so most questions ask what really happens at startup or in production.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain where a value in <code>ConfigService</code> comes from and in which order sources win.</li>
<li>I can write a schema that coerces, validates and rejects bad production settings.</li>
<li>I know what to do first when a secret leaks, and where secrets hide in git and Docker.</li>
<li>I can configure JSON logs with request ids and redaction, and I know what redaction does not cover.</li>
<li>I can organise a Nest project by feature and explain why path aliases can crash at runtime.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, câu nào cũng đã đối chiếu với output chạy thật trong chương. Lỗi cấu hình là loại lỗi "máy em chạy được" — nên phần lớn câu hỏi hỏi điều gì thật sự xảy ra lúc khởi động hoặc trên production.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được một giá trị trong <code>ConfigService</code> đến từ đâu và nguồn nào thắng theo thứ tự nào.</li>
<li>Tôi viết được schema vừa ép kiểu, vừa kiểm, vừa từ chối thiết lập production sai.</li>
<li>Tôi biết việc đầu tiên phải làm khi bí mật bị lộ, và bí mật ẩn ở đâu trong git và Docker.</li>
<li>Tôi cấu hình được log JSON có request id và redact, và biết redact không che được gì.</li>
<li>Tôi tổ chức được dự án Nest theo tính năng và giải thích được vì sao bí danh đường dẫn có thể sập lúc chạy.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'ConfigModule.forRoot({ envFilePath: [".env.local", ".env"] }) with no schema. .env.local has PORT=3100, .env has PORT=3000. What does configService.get("PORT") return?|||ConfigModule.forRoot({ envFilePath: [".env.local", ".env"] }) không có schema. .env.local có PORT=3100, .env có PORT=3000. configService.get("PORT") trả gì?',
        options: [
          'The string "3100"|||Chuỗi "3100"',
          'The number 3100|||Số 3100',
          'The string "3000" — the last file wins|||Chuỗi "3000" — tệp sau cùng thắng',
          'undefined until a schema is added|||undefined cho tới khi thêm schema',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 5.1, experiment 1: get("PORT") = "3100" string. The first file that defines a key wins, and without a schema every value is a string.|||VI: Bài 5.1, thí nghiệm 1: get("PORT") = "3100" string. Tệp đầu tiên có khoá thì thắng, và không có schema thì giá trị nào cũng là chuỗi.',
      },
      {
        question: 'Same setup. The app is started with PORT=8080 node dist/main.js. What does get("PORT") return?|||Cùng thiết lập. Ứng dụng chạy bằng PORT=8080 node dist/main.js. get("PORT") trả gì?',
        options: [
          '"3100" — .env.local always wins|||"3100" — .env.local luôn thắng',
          'The app refuses to start because of a conflict|||Ứng dụng từ chối khởi động vì xung đột',
          '"8080" — variables already set in the process are not overwritten|||"8080" — biến đã có trong tiến trình không bị ghi đè',
          '"3000"|||"3000"',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 5.1, section 1b: "8080". Process variables beat files unless override: true — which is why Docker/CI variables control production.|||VI: Bài 5.1, phần 1b: "8080". Biến tiến trình thắng tệp trừ khi override: true — vì vậy biến của Docker/CI điều khiển production.',
      },
      {
        question: 'mail.module.ts has, at the top of the file, const SMTP_HOST = process.env.SMTP_HOST; and SMTP_HOST is only in .env (loaded by ConfigModule.forRoot in AppModule). What is SMTP_HOST when MailService uses it?|||mail.module.ts có ở đầu tệp const SMTP_HOST = process.env.SMTP_HOST; và SMTP_HOST chỉ nằm trong .env (do ConfigModule.forRoot trong AppModule nạp). SMTP_HOST là gì khi MailService dùng nó?',
        options: [
          '"smtp.fpt.test", because ConfigModule is global|||"smtp.fpt.test", vì ConfigModule là global',
          'A TypeError at startup|||Một TypeError lúc khởi động',
          'An empty string|||Chuỗi rỗng',
          'undefined — the line ran when the file was imported, before .env was loaded|||undefined — dòng đó chạy lúc tệp được import, trước khi .env được nạp',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 5.1, experiment 2: "read at file load: undefined", "read at call time: smtp.fpt.test". ESM evaluates imports first. Inject ConfigService instead.|||VI: Bài 5.1, thí nghiệm 2: "đọc lúc nạp tệp: undefined", "đọc lúc gọi: smtp.fpt.test". ESM chạy import trước. Hãy tiêm ConfigService.',
      },
      {
        question: 'A Zod validationSchema requires NODE_ENV enum, PORT ≤ 65535, a postgres DATABASE_URL and JWT_SECRET ≥ 32 chars. The .env has all four wrong. What happens?|||validationSchema Zod đòi NODE_ENV thuộc enum, PORT ≤ 65535, DATABASE_URL postgres và JWT_SECRET ≥ 32 ký tự. Tệp .env sai cả bốn. Chuyện gì xảy ra?',
        options: [
          'Only the first problem is reported; fix and retry four times|||Chỉ báo lỗi đầu tiên; sửa rồi thử lại bốn lần',
          '"Config validation error" lists all four problems and the process exits with code 1|||"Config validation error" liệt kê cả bốn lỗi và tiến trình thoát mã 1',
          'The app starts and the first request returns 500|||Ứng dụng chạy lên và request đầu tiên trả 500',
          'Invalid values are replaced by defaults with a warning|||Giá trị sai bị thay bằng mặc định kèm cảnh báo',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 5.1, section 4b: four lines (NODE_ENV, PORT, DATABASE_URL, JWT_SECRET), exit=1, before listening on a port.|||VI: Bài 5.1, phần 4b: bốn dòng (NODE_ENV, PORT, DATABASE_URL, JWT_SECRET), exit=1, trước khi nghe cổng nào.',
      },
      {
        question: 'Schema field SWAGGER: z.coerce.boolean(). Production is started with SWAGGER=false. What is the value?|||Trường schema SWAGGER: z.coerce.boolean(). Production chạy với SWAGGER=false. Giá trị là gì?',
        options: [
          'true — Boolean("false") is true, so /docs would open|||true — Boolean("false") là true, nên /docs sẽ mở',
          'false|||false',
          'A validation error|||Lỗi kiểm hợp lệ',
          'undefined|||undefined',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 5.1 exercise: SWAGGER_SAI = true. Accept an explicit enum ("true"/"false") and transform; Lab 5.5 has a test for it.|||VI: Bài tập 5.1: SWAGGER_SAI = true. Nhận enum rõ ràng ("true"/"false") rồi biến đổi; Lab 5.5 có test cho chuyện này.',
      },
      {
        question: 'You committed .env with the production JWT secret, then ran git rm --cached .env, added it to .gitignore and pushed both commits to a public repository. What should you do FIRST?|||Bạn đã commit .env có khoá JWT production, rồi git rm --cached .env, thêm vào .gitignore và push cả hai commit lên kho công khai. Việc ĐẦU TIÊN phải làm là gì?',
        options: [
          'Nothing — the second commit removed the file|||Không cần gì — commit thứ hai đã xoá tệp',
          'Make the repository private|||Chuyển kho sang riêng tư',
          'Rewrite history with git filter-repo and force push|||Viết lại lịch sử bằng git filter-repo rồi force push',
          'Rotate the secret (new key deployed, old one revoked), then investigate and clean history|||Xoay bí mật (triển khai khoá mới, thu hồi khoá cũ), rồi điều tra và dọn lịch sử',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 5.2: git show HEAD~1:.env still printed the secret. Once seen, assume it is known — rotation is the only real fix; cleanup comes after.|||VI: Bài 5.2: git show HEAD~1:.env vẫn in ra bí mật. Đã bị thấy thì coi như đã bị biết — xoay khoá là cách sửa thật sự duy nhất; dọn dẹp làm sau.',
      },
      {
        question: 'Dockerfile: ARG NPM_TOKEN, then RUN echo "…_authToken=${NPM_TOKEN}" > /tmp/.npmrc && npm ci && rm /tmp/.npmrc, built with --build-arg NPM_TOKEN=…. Can someone with the image read the token?|||Dockerfile: ARG NPM_TOKEN, rồi RUN echo "…_authToken=${NPM_TOKEN}" > /tmp/.npmrc && npm ci && rm /tmp/.npmrc, build với --build-arg NPM_TOKEN=…. Người có image đọc được token không?',
        options: [
          'No — the file was deleted in the same layer|||Không — tệp đã bị xoá trong cùng lớp',
          'Only with root access to the registry|||Chỉ khi có quyền root trên registry',
          'Yes — docker history shows the build argument in the RUN line|||Có — docker history hiện tham số build ngay trong dòng RUN',
          'Only if the container is running|||Chỉ khi container đang chạy',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 5.2, section 4: "RUN |1 NPM_TOKEN=npm_Xy7DemoToken0000 …". With RUN --mount=type=secret only the variable name remains.|||VI: Bài 5.2, phần 4: "RUN |1 NPM_TOKEN=npm_Xy7DemoToken0000 …". Với RUN --mount=type=secret chỉ còn lại tên biến.',
      },
      {
        question: 'A login failure is logged as logger.warn(`Đăng nhập sai cho tài khoản ${name}`) and an attacker sends a name containing "\\n" followed by a fake "LOG [Auth] admin đăng nhập thành công". Text mode vs json: true?|||Lỗi đăng nhập được ghi bằng logger.warn(`Đăng nhập sai cho tài khoản ${name}`) và kẻ tấn công gửi tên chứa "\\n" rồi một dòng giả "LOG [Auth] admin đăng nhập thành công". Chế độ văn bản so với json: true?',
        options: [
          'Both modes strip the newline|||Cả hai chế độ đều bỏ dấu xuống dòng',
          'Text mode prints a second, forged line; JSON keeps it as \\n inside one message|||Chế độ văn bản in ra dòng thứ hai giả mạo; JSON giữ nó là \\n trong một message',
          'JSON mode throws because of the newline|||Chế độ JSON ném lỗi vì dấu xuống dòng',
          'Both modes print two lines|||Cả hai chế độ đều in hai dòng',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 5.3, experiment 1, point 4: the text log shows a separate "admin đăng nhập thành công" line; the JSON record contains "…an\\n[Nest] 1  - LOG [Auth]…" in one string.|||VI: Bài 5.3, thí nghiệm 1, ý 4: log văn bản hiện riêng một dòng "admin đăng nhập thành công"; bản ghi JSON chứa "…an\\n[Nest] 1  - LOG [Auth]…" trong một chuỗi.',
      },
      {
        question: 'new ConsoleLogger({ json: true, redact: ["password"] }), then logger.log(`login ${JSON.stringify(body)}`) where body has a password. What is printed?|||new ConsoleLogger({ json: true, redact: ["password"] }), rồi logger.log(`login ${JSON.stringify(body)}`) với body có password. In ra gì?',
        options: [
          'password: "[REDACTED]"|||password: "[REDACTED]"',
          'The whole message is replaced by [REDACTED]|||Cả thông điệp bị thay bằng [REDACTED]',
          'Nothing — the line is dropped|||Không gì cả — dòng bị bỏ',
          'The password in clear — redaction does not apply to string messages|||Mật khẩu ở dạng rõ — redact không áp dụng cho thông điệp dạng chuỗi',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 5.3, checked: the interpolated line contains \\"password\\":\\"hunter2\\"; logger.log("login", body) prints "password":"[REDACTED]". Pass objects, not strings (Twitter 2018, Facebook 2019).|||VI: Bài 5.3, đã thử: dòng nhét chuỗi chứa \\"password\\":\\"hunter2\\"; logger.log("login", body) in "password":"[REDACTED]". Truyền object, đừng nhét chuỗi (Twitter 2018, Facebook 2019).',
      },
      {
        question: 'tsconfig.json has "paths": { "@common/*": ["./src/common/*"] }. The Dockerfile builds with plain tsc and runs node dist/main.js. What happens?|||tsconfig.json có "paths": { "@common/*": ["./src/common/*"] }. Dockerfile build bằng tsc trần và chạy node dist/main.js. Chuyện gì xảy ra?',
        options: [
          'tsc succeeds, then Node fails with ERR_MODULE_NOT_FOUND because the alias was not rewritten|||tsc thành công, rồi Node báo ERR_MODULE_NOT_FOUND vì bí danh không được viết lại',
          'tsc fails with "cannot find module"|||tsc báo lỗi "cannot find module"',
          'It works, tsc rewrites aliases|||Chạy được, tsc viết lại bí danh',
          'It works only on Node 24|||Chỉ chạy được trên Node 24',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 5.4, experiment 1: tsc exit=0, Error [ERR_MODULE_NOT_FOUND]: Cannot find package \'@common/clock.js\'. nest build rewrites aliases; Node subpath imports need no rewriting.|||VI: Bài 5.4, thí nghiệm 1: tsc exit=0, Error [ERR_MODULE_NOT_FOUND]: Cannot find package \'@common/clock.js\'. nest build viết lại bí danh; subpath imports của Node không cần viết lại.',
      },
    ],
  },
};
