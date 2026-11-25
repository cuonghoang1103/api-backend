/**
 * 2.9 — Kiểm tra Chương 2 (khoá nestjs, soạn 24/11/2026). 10 câu; đáp án đối chiếu output chạy thật của chương
 * (scratchpad/nst/lab/c2/o): câu 1 22-loi (interface ⇒ "?"), câu 2 22-importtype (Function), câu 3 23-A (thiếu exports),
 * câu 4 23-C (khai lại ⇒ #1/#2), câu 5 23-v2 (forwardRef vẫn ReferenceError ở ESM), câu 6 24-scope (ngam ⇒ 3003 controller),
 * câu 7 24-ro (An nhận dữ liệu Bình), câu 8 24-hooks (HOOKS=0 ⇒ 10,1 s, exit 137), câu 9 22-a (useFactory async in trước),
 * câu 10 22-bt bt3 (useClass ⇒ aliasCungMotBan false). Phân bố đáp án: A3 B2 C2 D3.
 */
export default {
  title: '2.9 — Chapter 2 quiz|||2.9 — Kiểm tra Chương 2',
  slug: 'nst-2-9-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống về Chương 2: đọc lỗi "can\'t resolve dependencies" (interface, import type, quên exports), khai provider ở hai module, forwardRef trong ESM, request scope ngầm vì @Inject(REQUEST), trạng thái trong singleton làm lộ dữ liệu, docker stop khi thiếu enableShutdownHooks, factory bất đồng bộ, useExisting và useClass.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, each checked against real output from this chapter. Most are "read this error" questions — the skill you will use every week.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain how Nest decides what to inject into a constructor.</li>
<li>I can read "can't resolve dependencies" and tell a token problem from an export/import problem.</li>
<li>I know what happens when a provider is listed in two modules, and when a cycle appears in ESM.</li>
<li>I can name the three scopes, what bubbles up, and why request data does not belong in a singleton field.</li>
<li>I know the order of lifecycle hooks and why <code>enableShutdownHooks</code> matters in Docker.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, câu nào cũng đã đối chiếu với output chạy thật trong chương. Phần lớn là câu "đọc lỗi này" — kỹ năng bạn sẽ dùng mỗi tuần.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được Nest quyết định tiêm gì vào constructor bằng cách nào.</li>
<li>Tôi đọc được "can't resolve dependencies" và phân biệt lỗi token với lỗi export/import.</li>
<li>Tôi biết chuyện gì xảy ra khi một provider khai ở hai module, và khi có vòng trong ESM.</li>
<li>Tôi kể được ba scope, cái gì lan lên, và vì sao dữ liệu request không được nằm trong trường của singleton.</li>
<li>Tôi biết thứ tự các lifecycle hook và vì sao <code>enableShutdownHooks</code> quan trọng trong Docker.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'constructor(private readonly mailer: Mailer) where Mailer is an interface. Startup says "Nest can\'t resolve dependencies of the NotifyService (?)". Best fix?|||constructor(private readonly mailer: Mailer) với Mailer là interface. Khởi động báo "Nest can\'t resolve dependencies of the NotifyService (?)". Cách sửa tốt nhất?',
        options: [
          'Make Mailer an abstract class (or add @Inject(MAILER) with a provider for that token)|||Đổi Mailer thành abstract class (hoặc thêm @Inject(MAILER) kèm provider cho token đó)',
          'Add @Optional() to the parameter|||Thêm @Optional() vào tham số',
          'Add Mailer to the providers array|||Thêm Mailer vào mảng providers',
          'Change import to import type|||Đổi import thành import type',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 2.2: an interface is erased, so design:paramtypes holds Object and Nest cannot even print a name — hence "(?)". You cannot list an interface in providers (it is not a value). @Optional would hide the problem and inject undefined. An abstract class exists at runtime and works as token and contract at once.|||VI: Bài 2.2: interface bị xoá, nên design:paramtypes chứa Object và Nest không in nổi tên — vì thế mới có "(?)". Không thể liệt kê interface trong providers (nó không phải giá trị). @Optional chỉ giấu lỗi và tiêm undefined. Abstract class tồn tại lúc chạy, vừa là token vừa là hợp đồng.',
      },
      {
        question: 'A lint autofix changed import { RoomsService } to import type { RoomsService } in bookings.service.ts. RoomsService is still registered. What is in design:paramtypes for BookingsService?|||Một bản sửa tự động của lint đổi import { RoomsService } thành import type { RoomsService } trong bookings.service.ts. RoomsService vẫn được đăng ký. design:paramtypes của BookingsService chứa gì?',
        options: [
          '[RoomsService] — import type only affects type checking|||[RoomsService] — import type chỉ ảnh hưởng kiểm kiểu',
          '[undefined]|||[undefined]',
          '[Object]|||[Object]',
          '[Function] — and startup fails at index [0]|||[Function] — và khởi động lỗi ở index [0]',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Real output in lesson 2.2: design:paramtypes = [ [Function: Function] ], then "the argument Function at index [0] is available…". The type-only import is erased, so TypeScript writes the generic Function. Remove the word type.|||VI: Output thật ở bài 2.2: design:paramtypes = [ [Function: Function] ], rồi "the argument Function at index [0] is available…". Import chỉ-kiểu bị xoá, nên TypeScript ghi chữ chung chung Function. Xoá chữ type.',
      },
      {
        question: '"Nest can\'t resolve dependencies of the BookingsService (?). Please make sure that the argument RoomsService at index [0] is available in the BookingsModule module." BookingsModule imports RoomsModule. Most likely cause?|||"Nest can\'t resolve dependencies of the BookingsService (?). Please make sure that the argument RoomsService at index [0] is available in the BookingsModule module." BookingsModule đã import RoomsModule. Nguyên nhân khả dĩ nhất?',
        options: [
          'RoomsService is missing @Injectable()|||RoomsService thiếu @Injectable()',
          'RoomsModule does not export RoomsService|||RoomsModule không export RoomsService',
          'There is a circular dependency|||Có phụ thuộc vòng',
          'BookingsService must be request-scoped|||BookingsService phải là request scope',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 2.3, experiment 1: Nest names the class (so the token is fine) and RoomsService was even built (#1) — inside RoomsModule. Importing a module only gives access to what it exports. Adding exports: [RoomsService] fixed it.|||VI: Bài 2.3, thí nghiệm 1: Nest gọi được tên class (nên token không sai) và RoomsService thậm chí đã được tạo (#1) — bên trong RoomsModule. Import một module chỉ cho dùng thứ nó export. Thêm exports: [RoomsService] là chạy.',
      },
      {
        question: 'To "fix" that error, a teammate also adds RoomsService to BookingsModule\'s providers. The app starts. What really happens?|||Để "sửa" lỗi đó, bạn cùng nhóm thêm luôn RoomsService vào providers của BookingsModule. Ứng dụng khởi động được. Thực tế chuyện gì xảy ra?',
        options: [
          'Nest deduplicates: one shared instance|||Nest gộp lại: một bản dùng chung',
          'Startup fails with a duplicate provider error|||Khởi động lỗi vì trùng provider',
          'Two instances: RoomsModule\'s classes get #1, BookingsModule\'s classes get #2|||Hai bản: class của RoomsModule nhận #1, class của BookingsModule nhận #2',
          'BookingsModule becomes global|||BookingsModule thành global',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Real output in lesson 2.3: "tạo RoomsService #1", "tạo RoomsService #2", "BookingsService dùng RoomsService #2; RoomsModule giữ #1". Two recipes, two objects — with in-memory data, rooms created via /rooms are invisible to bookings.|||VI: Output thật ở bài 2.3: "tạo RoomsService #1", "tạo RoomsService #2", "BookingsService dùng RoomsService #2; RoomsModule giữ #1". Hai công thức, hai đối tượng — với dữ liệu trong bộ nhớ, phòng tạo qua /rooms vô hình với phần đặt lịch.',
      },
      {
        question: 'Nest 12 ESM project. UsersService and AuthService inject each other; both module imports and both injections use forwardRef(() => X), parameters typed as the classes. What happens?|||Dự án Nest 12 ESM. UsersService và AuthService tiêm lẫn nhau; cả hai import module và hai chỗ tiêm đều dùng forwardRef(() => X), tham số khai kiểu là các class. Chuyện gì xảy ra?',
        options: [
          'It works: forwardRef is exactly for this|||Chạy được: forwardRef sinh ra để làm việc này',
          'Nest throws CircularDependencyException|||Nest ném CircularDependencyException',
          'Both services receive undefined|||Cả hai service nhận undefined',
          'ReferenceError: Cannot access \'UsersService\' before initialization, before Nest even starts|||ReferenceError: Cannot access \'UsersService\' before initialization, trước cả khi Nest chạy',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 2.3, vong2: forwardRef delays Nest\'s lookup, but emitDecoratorMetadata still writes [UsersService] eagerly while the ESM module graph is loading — a TDZ ReferenceError. It worked only with a type alias (Ref<T>) that makes the metadata Object. Better: extract a third module.|||VI: Bài 2.3, vong2: forwardRef hoãn việc tra của Nest, nhưng emitDecoratorMetadata vẫn ghi [UsersService] ngay khi đồ thị module ESM đang nạp — ReferenceError vùng chết tạm thời. Chỉ chạy được với bí danh kiểu (Ref<T>) làm metadata thành Object. Tốt hơn: tách module thứ ba.',
      },
      {
        question: 'TenantService has no scope option but its constructor has @Inject(REQUEST) req. RoomsService depends on it; RoomsController depends on RoomsService. After 3 000 requests, how many RoomsController instances exist in total?|||TenantService không khai scope nhưng constructor có @Inject(REQUEST) req. RoomsService phụ thuộc nó; RoomsController phụ thuộc RoomsService. Sau 3 000 request, tổng cộng có bao nhiêu RoomsController được tạo?',
        options: [
          'About one per request (3 003 in the lesson, including 3 warm-up requests)|||Khoảng mỗi request một cái (3 003 trong bài, gồm 3 request khởi động)',
          '1 — the controller stays a singleton|||1 — controller vẫn là singleton',
          '0 — controllers are not providers|||0 — controller không phải provider',
          '2 — one for the module, one for the request|||2 — một cho module, một cho request',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 2.4, mode "ngam": counts identical to explicit Scope.REQUEST — TenantService, RoomsService and RoomsController built per request; "RoomsController đã tạo 3003 lần". Injecting REQUEST implies request scope, and scope bubbles up the chain.|||VI: Bài 2.4, chế độ "ngam": số đếm giống hệt Scope.REQUEST khai tường minh — TenantService, RoomsService và RoomsController bị tạo mỗi request; "RoomsController đã tạo 3003 lần". Tiêm REQUEST kéo theo request scope, và scope lan lên cả chuỗi.',
      },
      {
        question: 'A singleton ProfileService does this.nguoiDung = user; await db(); return data of this.nguoiDung. An (slow query) and Bình call almost together. What can An receive?|||ProfileService singleton làm this.nguoiDung = user; await db(); rồi trả dữ liệu của this.nguoiDung. An (truy vấn chậm) và Bình gọi gần như cùng lúc. An có thể nhận gì?',
        options: [
          'Always her own data: Node is single-threaded|||Luôn là dữ liệu của mình: Node chạy một luồng',
          'Bình\'s data|||Dữ liệu của Bình',
          'An error: concurrent access to a singleton|||Lỗi: truy cập đồng thời singleton',
          'Empty data|||Dữ liệu rỗng',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 2.4, experiment 2 (same result in 3 runs): "An nhận: … số điện thoại của binh". Single-threaded does not mean one request at a time — every await lets another request overwrite the shared field. Keep request data in parameters/locals.|||VI: Bài 2.4, thí nghiệm 2 (ba lần chạy cùng kết quả): "An nhận: … số điện thoại của binh". Một luồng không có nghĩa là mỗi lúc một request — mỗi await cho request khác ghi đè trường dùng chung. Giữ dữ liệu request trong tham số/biến cục bộ.',
      },
      {
        question: 'A Nest app runs as PID 1 in a container and never calls app.enableShutdownHooks(). You run docker stop. What happens?|||Ứng dụng Nest chạy làm PID 1 trong container và không gọi app.enableShutdownHooks(). Bạn chạy docker stop. Chuyện gì xảy ra?',
        options: [
          'Hooks run, exit code 0|||Hook chạy, mã thoát 0',
          'Only onModuleDestroy runs|||Chỉ onModuleDestroy chạy',
          'No hook runs; after about 10 s Docker kills it, exit 137|||Không hook nào chạy; khoảng 10 giây sau Docker giết nó, exit 137',
          'The container ignores docker stop forever|||Container bỏ qua docker stop mãi mãi',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 2.4: HOOKS=0 — "docker stop mất 10.1 s", ExitCode=137, no destroy/shutdown lines. With enableShutdownHooks: 0.2 s, all hooks root-first, ExitCode=0.|||VI: Bài 2.4: HOOKS=0 — "docker stop mất 10.1 s", ExitCode=137, không dòng huỷ/tắt nào. Có enableShutdownHooks: 0,2 giây, mọi hook chạy từ gốc xuống, ExitCode=0.',
      },
      {
        question: '{ provide: DB, useFactory: async (cfg) => { await connect(); return pool; }, inject: [CAU_HINH] } and CheckoutService injects DB. When is CheckoutService constructed?|||{ provide: DB, useFactory: async (cfg) => { await connect(); return pool; }, inject: [CAU_HINH] } và CheckoutService tiêm DB. CheckoutService được tạo lúc nào?',
        options: [
          'After the factory\'s promise resolves|||Sau khi promise của factory xong',
          'Immediately, receiving a Promise in the DB parameter|||Ngay lập tức, nhận một Promise ở tham số DB',
          'On the first request that needs it|||Ở request đầu tiên cần tới nó',
          'Never: async factories are not allowed|||Không bao giờ: factory bất đồng bộ không được phép',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 2.2: "[factory] đã kết nối … sau 300 ms" printed before anything else and CheckoutService then received the resolved object (db: rows(INSERT payment)). Nest awaits async providers during startup.|||VI: Bài 2.2: "[factory] đã kết nối … sau 300 ms" in ra trước mọi thứ, rồi CheckoutService nhận object đã xong (db: rows(INSERT payment)). Nest chờ provider bất đồng bộ trong lúc khởi động.',
      },
      {
        question: 'LoggerThat is a provider. You add { provide: \'LOGGER_CU\', useClass: LoggerThat } and inject both. Are they the same instance?|||LoggerThat là một provider. Bạn thêm { provide: \'LOGGER_CU\', useClass: LoggerThat } và tiêm cả hai. Chúng có cùng một bản không?',
        options: [
          'Yes, a class is always a singleton|||Có, một class luôn là singleton',
          'Yes, because they share the class|||Có, vì chung class',
          'Only inside the same module|||Chỉ khi ở cùng module',
          'No — use useExisting for an alias to the same instance|||Không — muốn bí danh trỏ đúng bản đó thì dùng useExisting',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 2.2 practice 3, real output: aliasCungMotBan: false with useClass, true with useExisting. Singleton is per token (per recipe), not per class.|||VI: Bài 2.2 thực hành 3, output thật: aliasCungMotBan: false với useClass, true với useExisting. Singleton tính theo token (theo công thức), không theo class.',
      },
    ],
  },
};
