/**
 * 1.7 — Kiểm tra Chương 1 (khoá nestjs, soạn 24/11/2026). 10 câu; đáp án kiểm bằng output chạy thật của chương
 * (scratchpad/nst/lab/c1): câu 1 thu-tu.ts, câu 2 meta.ts, câu 3 khong-deco.ts, câu 4 tsconfig.tc39.json (TS1206),
 * câu 5 thiếu controller (404, không dòng RoutesResolver), câu 6 SWC exit 0 / --type-check exit 1, câu 7 users/me,
 * câu 8 @Res() curl exit 28, câu 9 guard chặn (t14.sh), câu 10 /:tu-:den. Phân bố đáp án: A2 B3 C3 D2.
 */
export default {
  title: '1.7 — Chapter 1 quiz|||1.7 — Kiểm tra Chương 1',
  slug: 'nst-1-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống về Chương 1: decorator chạy lúc nào, design:paramtypes với interface, class không decorator, TS1206, route không hiện trong log, SWC không kiểm kiểu, thứ tự route, @Res() làm treo request, guard chặn, hai tham số trong một đoạn URL.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations; every answer was checked against the real output shown in this chapter. Read the explanations after submitting — especially for the ones you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say when a decorator runs and what it leaves behind.</li>
<li>I can explain what <code>design:paramtypes</code> contains for a class, an interface and a string.</li>
<li>I can read Nest's startup log and find a missing module, controller or provider.</li>
<li>I know which values from the URL are strings and how route order decides the handler.</li>
<li>I can draw the request lifecycle from memory and say where a request stops when a guard or pipe rejects it.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống; đáp án câu nào cũng đã đối chiếu với output chạy thật trong chương. Đọc phần giải thích sau khi nộp — nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được decorator chạy lúc nào và để lại gì.</li>
<li>Tôi giải thích được <code>design:paramtypes</code> chứa gì với một class, một interface và một chuỗi.</li>
<li>Tôi đọc được log khởi động của Nest và tìm ra module, controller hay provider bị thiếu.</li>
<li>Tôi biết giá trị nào từ URL là chuỗi, và thứ tự route quyết định handler ra sao.</li>
<li>Tôi vẽ lại được vòng đời request mà không nhìn, và nói được request dừng ở đâu khi guard hoặc pipe từ chối.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A class has two methods decorated with @Ghi(...) and the class itself is decorated too. When do the decorators run?|||Một class có hai phương thức mang @Ghi(...) và chính class cũng mang decorator. Các decorator chạy lúc nào?',
        options: [
          'Every time a method is called|||Mỗi lần một phương thức được gọi',
          'When new MonAn() is called, class decorator first|||Khi gọi new MonAn(), decorator của class trước',
          'Once, when the class is defined: the method decorators first, then the class decorator|||Một lần, lúc class được định nghĩa: decorator phương thức trước, rồi tới decorator class',
          'Only when Nest starts the application|||Chỉ khi Nest khởi động ứng dụng',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: In lesson 1.1 (thu-tu.ts) every decorator line printed before "4. class đã định nghĩa xong" and new MonAn() printed nothing from decorators. Member decorators ran top to bottom, then the class decorator. Nest only reads what they recorded, at startup.|||VI: Ở bài 1.1 (thu-tu.ts), mọi dòng của decorator in ra trước "4. class đã định nghĩa xong", còn new MonAn() không in gì từ decorator. Decorator thành viên chạy từ trên xuống, rồi tới decorator class. Nest chỉ đọc những gì chúng đã ghi, lúc khởi động.',
      },
      {
        question: 'constructor(private dongHo: DongHo, private kho: KhoGhiChu, private ten: string) where KhoGhiChu is an interface. What is design:paramtypes?|||constructor(private dongHo: DongHo, private kho: KhoGhiChu, private ten: string) với KhoGhiChu là interface. design:paramtypes là gì?',
        options: [
          '[DongHo, Object, String]|||[DongHo, Object, String]',
          '[DongHo, KhoGhiChu, String]|||[DongHo, KhoGhiChu, String]',
          '[DongHo, undefined, "string"]|||[DongHo, undefined, "string"]',
          'undefined, because one parameter is an interface|||undefined, vì có một tham số là interface',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Real output: [ [class DongHo], [Function: Object], [Function: String] ]. Interfaces do not exist at runtime, so TypeScript writes Object — and Nest cannot inject by that. Use a token with @Inject() (lesson 2.2).|||VI: Output thật: [ [class DongHo], [Function: Object], [Function: String] ]. Interface không tồn tại lúc chạy, nên TypeScript ghi Object — và Nest không tiêm theo đó được. Dùng token với @Inject() (bài 2.2).',
      },
      {
        question: 'emitDecoratorMetadata is on. A class with a constructor parameter has NO decorator at all. What does Reflect.getMetadata("design:paramtypes", TheClass) return?|||emitDecoratorMetadata đang bật. Một class có tham số constructor nhưng KHÔNG mang decorator nào. Reflect.getMetadata("design:paramtypes", TheClass) trả gì?',
        options: [
          'The parameter types, as for any class|||Kiểu các tham số, như mọi class khác',
          'An empty array|||Một mảng rỗng',
          'It throws "metadata not found"|||Nó ném lỗi "metadata not found"',
          'undefined — TypeScript only emits metadata for decorated declarations|||undefined — TypeScript chỉ ghi metadata cho khai báo có decorator',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: khong-deco.ts printed "không decorator trên class → undefined". This is why every Nest service carries @Injectable(): the decorator triggers the metadata that DI reads.|||VI: khong-deco.ts in "không decorator trên class → undefined". Vì thế service nào của Nest cũng mang @Injectable(): decorator là cò súng sinh ra metadata mà DI đọc.',
      },
      {
        question: 'You copy a tsconfig from another project and compile a Nest controller. The compiler says TS1206 "Decorators are not valid here." on @Body(). What is the most likely cause?|||Bạn chép tsconfig từ dự án khác sang rồi biên dịch một controller Nest. Trình biên dịch báo TS1206 "Decorators are not valid here." ở @Body(). Nguyên nhân khả dĩ nhất?',
        options: [
          '@Body() must be imported from express|||@Body() phải import từ express',
          'experimentalDecorators is off, so TypeScript uses standard decorators, which have no parameter decorators|||experimentalDecorators đang tắt, nên TypeScript dùng decorator chuẩn, loại không có decorator tham số',
          'The DTO class is missing @Injectable()|||Class DTO thiếu @Injectable()',
          'Node 22 does not support decorators|||Node 22 không hỗ trợ decorator',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: In lesson 1.1, compiling with experimentalDecorators: false gave exactly meta.ts(12,7): error TS1206 on the parameter decorator. Nest 12 still needs the legacy mode. Node never sees decorators — tsc compiles them away.|||VI: Ở bài 1.1, biên dịch với experimentalDecorators: false cho đúng meta.ts(12,7): error TS1206 ở decorator tham số. Nest 12 vẫn cần chế độ cũ. Node không bao giờ thấy decorator — tsc đã biên dịch chúng thành lời gọi hàm.',
      },
      {
        question: 'The app starts without any error, but GET /notes returns 404 and the startup log has no line "NotesController {/notes}". What do you check first?|||Ứng dụng khởi động không báo lỗi gì, nhưng GET /notes trả 404 và log khởi động không có dòng "NotesController {/notes}". Bạn kiểm gì trước tiên?',
        options: [
          'Whether NotesService is in providers|||NotesService có trong providers chưa',
          'Whether the port is already in use|||Cổng có đang bị chiếm không',
          'Whether NotesController is in the module\'s controllers, and that module is imported by AppModule|||NotesController có trong controllers của module chưa, và module đó có được AppModule import không',
          'Whether the handler is async|||Handler có phải async không',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 1.2: removing the controller from its module gave a silent start and {"message":"Cannot GET /notes",…,"statusCode":404}. A missing provider is different: it fails loudly at startup ("Nest can\'t resolve dependencies…", exit 1).|||VI: Bài 1.2: bỏ controller khỏi module cho ra khởi động im lặng và {"message":"Cannot GET /notes",…,"statusCode":404}. Thiếu provider thì khác: đổ ầm ĩ lúc khởi động ("Nest can\'t resolve dependencies…", exit 1).',
      },
      {
        question: 'Your team switched to nest build -b swc to speed up CI. A pull request with const x: number = "chuoi" passed CI. What is the right fix?|||Nhóm bạn chuyển sang nest build -b swc cho CI nhanh hơn. Một pull request có const x: number = "chuoi" vẫn qua CI. Sửa thế nào là đúng?',
        options: [
          'Go back to tsc and accept the slower build everywhere|||Quay lại tsc và chịu build chậm ở mọi nơi',
          'Keep SWC but add --type-check or a separate npx tsc --noEmit step in CI|||Giữ SWC nhưng thêm --type-check hoặc một bước npx tsc --noEmit riêng trong CI',
          'Nothing; SWC already reported the error but CI ignored the log|||Không cần gì; SWC đã báo lỗi nhưng CI bỏ qua log',
          'Turn on strict mode in tsconfig|||Bật strict trong tsconfig',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Measured in lesson 1.2: tsc exit=1 with TS2322; SWC "Successfully compiled" exit=0; with --type-check exit=1. SWC strips types without checking them. Strict mode does not help if nothing checks types.|||VI: Đo ở bài 1.2: tsc exit=1 kèm TS2322; SWC "Successfully compiled" exit=0; có --type-check thì exit=1. SWC bóc kiểu mà không kiểm. Bật strict cũng vô ích nếu không có gì kiểm kiểu.',
      },
      {
        question: 'GET /users/me returns {"id":"me"} instead of the current user. The controller has @Get(\'users/:id\') then @Get(\'users/me\'). Why?|||GET /users/me trả {"id":"me"} thay vì người dùng hiện tại. Controller khai @Get(\'users/:id\') rồi mới tới @Get(\'users/me\'). Vì sao?',
        options: [
          'Routes are tried in declaration order and :id matched "me" first|||Route được thử theo thứ tự khai báo và :id đã khớp "me" trước',
          'Nest sorts routes alphabetically|||Nest sắp route theo bảng chữ cái',
          'The me route needs @HttpCode(200)|||Route me cần @HttpCode(200)',
          'Express 5 does not allow fixed segments after parameters|||Express 5 không cho đoạn cố định đứng sau tham số',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 1.3 reproduced it, and demo2 fixed it by declaring users/me first. The Mapped lines in the startup log are printed in the order routes are tried.|||VI: Bài 1.3 đã tái hiện, và demo2 sửa bằng cách khai users/me trước. Các dòng Mapped trong log khởi động in đúng thứ tự route được thử.',
      },
      {
        question: 'A handler takes @Res() res and calls res.json(...) only inside an if. For other requests it returns an object. What does the client get on those requests?|||Một handler nhận @Res() res và chỉ gọi res.json(...) trong một nhánh if. Với các request khác nó return một object. Client nhận gì ở những request đó?',
        options: [
          'The returned object, as usual|||Object được return, như thường',
          'A 500 Internal server error|||Lỗi 500 Internal server error',
          'An empty 200 response|||Phản hồi 200 rỗng',
          'Nothing: the request hangs until the client gives up|||Không gì cả: request treo tới khi client bỏ cuộc',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: With @Res() Nest ignores the return value. In lesson 1.3, curl -m 3 on /demo/res-quen ended with exit=28 (timeout). Use @Res({ passthrough: true }) if you only need to add a cookie or header.|||VI: Có @Res() là Nest bỏ qua giá trị trả về. Ở bài 1.3, curl -m 3 gọi /demo/res-quen kết thúc với exit=28 (hết giờ). Chỉ cần thêm cookie hay header thì dùng @Res({ passthrough: true }).',
      },
      {
        question: 'A guard returns false for a request. Which layers still run for that request?|||Guard trả false cho một request. Những lớp nào vẫn chạy với request đó?',
        options: [
          'Interceptor, pipe and handler, then the response is replaced by 403|||Interceptor, pipe và handler, rồi phản hồi bị thay bằng 403',
          'The pipe only, to validate the input|||Chỉ pipe, để kiểm đầu vào',
          'Only what came before the guard (middleware) and then the exception filter with a 403|||Chỉ những gì đứng trước guard (middleware), rồi exception filter với 403',
          'Nothing at all, not even middleware|||Không gì cả, kể cả middleware',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: In lesson 1.4 the header x-chan: 1 produced: 1. middleware, 2. guard → CHẶN, 3. filter bắt 403 Forbidden resource. Interceptor, pipe and handler never ran — a cheap rejection.|||VI: Ở bài 1.4, header x-chan: 1 cho ra: 1. middleware, 2. guard → CHẶN, 3. filter bắt 403 Forbidden resource. Interceptor, pipe và handler không hề chạy — từ chối rất rẻ.',
      },
      {
        question: 'Route @Get(\'lich/:tu-:den\') on Nest 12. A client calls /lich/2026-12-01. What are tu and den?|||Route @Get(\'lich/:tu-:den\') trên Nest 12. Client gọi /lich/2026-12-01. tu và den là gì?',
        options: [
          'tu = "2026", den = "12-01"|||tu = "2026", den = "12-01"',
          'tu = "2026-12", den = "01"|||tu = "2026-12", den = "01"',
          'The route does not match: 404|||Route không khớp: 404',
          'tu = "2026-12-01", den = undefined|||tu = "2026-12-01", den = undefined',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Real output in lesson 1.3: {"p":{"tu":"2026-12","den":"01"}}. Two params in one segment are ambiguous when the separator appears in the values — and in path-to-regexp 0.1.x (Express 4, Nest ≤ 10) this pattern was also a ReDoS (CVE-2024-45296/52798). Use query parameters instead.|||VI: Output thật ở bài 1.3: {"p":{"tu":"2026-12","den":"01"}}. Hai tham số trong một đoạn là mập mờ khi dấu ngăn cách có trong giá trị — và ở path-to-regexp 0.1.x (Express 4, Nest ≤ 10) kiểu route này còn là lỗ ReDoS (CVE-2024-45296/52798). Dùng tham số query thay thế.',
      },
    ],
  },
};
