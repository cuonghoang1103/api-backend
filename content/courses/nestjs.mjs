/**
 * NestJS — khoá học CuongThai (Courses, backend). KHUNG dựng 24/11/2026 theo bảng soát khoảng trống P1 (20/11):
 * "NestJS ~10 ch" — framework Node có cấu trúc mà tin tuyển backend Node ở công ty outsourcing hay đòi.
 * Người học: SV SE FPT kỳ 6 (Node.js + Spring Boot), mục tiêu OJT FPT Software SU27, đã/đang học khoá nodejs.
 * Trục khoá: CHỈ phần RIÊNG của Nest — module/DI container (so Spring IoC), controller/provider, pipe/guard/interceptor/filter,
 * DTO + class-validator, config, Prisma/TypeORM trong Nest, JWT + RBAC bằng guard, test (Vitest/Jest + e2e), OpenAPI,
 * BullMQ/microservice/WebSocket gateway, Docker + CI; dự án cuối khoá: API đặt lịch phòng lab (cùng đề Dự án 1 lộ trình Node).
 * KHÔNG dạy lại — chỉ dẫn link: nodejs (JS/Node/Express/REST nền), typescript ch14 (class, decorator), prisma-orm (Prisma sâu),
 * authentication (JWT/refresh/mật khẩu sâu), api-design (thiết kế REST, lỗi, phân trang), testing (tư duy test), docker, github-actions.
 * Phiên bản chạy thật: Nest 12 (12.0.0 ra 27/08/2026), Node 22, TypeScript 6 — dự án chính ESM + Vitest (mặc định Nest 12);
 * Jest dạy trên dự án Nest 11 CommonJS (dạng hay gặp ở công ty) — xem _KE-HOACH.md §4.
 * Khi soạn một chương: thay phần tử trong `sections` bằng tệp chương thật nestjs/sNN-*.mjs, GIỮ NGUYÊN slug bài và title chương.
 */
import { khung } from './_chung/khung.mjs';
import { ghep } from './nestjs/_chung.mjs';
import s00 from './nestjs/s00-bat-dau.mjs';
import s01 from './nestjs/s01-ben-duoi.mjs';
import s02 from './nestjs/s02-module-di.mjs';
import s03 from './nestjs/s03-day-chuyen.mjs';
import s04 from './nestjs/s04-dto-openapi.mjs';
import s05 from './nestjs/s05-cau-hinh-log.mjs';
import s06 from './nestjs/s06-csdl.mjs';
import s07 from './nestjs/s07-auth.mjs';
import s08 from './nestjs/s08-test.mjs';
import s09 from './nestjs/s09-viec-nen.mjs';
import s10 from './nestjs/s10-realtime.mjs';
import s11 from './nestjs/s11-production.mjs';
import s12 from './nestjs/s12-du-an.mjs';

/** Bài ĐÃ SOẠN (nestjs/sNN-*.mjs, cùng slug) thay bài khung; bài chưa soạn giữ khung. Tiêu đề chương giữ nguyên từ khung. */
const DA_SOAN = [s00, s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12];

export default {
  category: { slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 1 },
  course: {
    slug: 'nestjs',
    title: 'NestJS: Structured Node.js Backends',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/nestjs.png?v=1',
    shortDescription: 'NestJS from zero: modules and dependency injection (vs Spring), pipes, guards, interceptors, DTO validation, Prisma/TypeORM, JWT + roles, tests, OpenAPI, queues, WebSockets, Docker + CI — capstone: a lab booking API.|||NestJS từ số 0: module và DI (so với Spring), pipe, guard, interceptor, DTO, Prisma/TypeORM, JWT + phân quyền, test, OpenAPI, hàng đợi, WebSocket, Docker + CI — dự án cuối: API đặt lịch phòng lab.',
    description: 'Khoá dạy NestJS — framework Node.js có cấu trúc (module, dependency injection, decorator) mà nhiều công ty dùng cho backend TypeScript lớn. Khoá chỉ dạy phần RIÊNG của Nest; phần nền (JavaScript, Express, REST, Prisma, JWT) đã có ở các khoá Node.js, TypeScript, Prisma, Authentication và được liên kết đúng bài. Bạn tự viết một DI container 60 dòng để hiểu Nest làm gì bên dưới, so từng khái niệm với Spring Boot, rồi đi hết vòng đời một request: middleware → guard → interceptor → pipe → controller → filter. Mọi ví dụ chạy thật trên Node 22 với Nest 12, output chép nguyên. Mỗi chương có lab, bài tập, câu phỏng vấn, góc bảo mật bằng sự cố thật và một mốc dự án. Cuối khoá: API đặt lịch phòng lab — không đặt trùng, duyệt lịch qua hàng đợi, cập nhật trực tiếp qua WebSocket, test e2e, Docker và CI.',
    whatYouLearn: 'Tạo và tổ chức dự án Nest 12 (ESM hoặc CommonJS); hiểu và dùng module, provider, dependency injection, scope, dynamic module như dùng Spring IoC; viết controller, middleware, pipe, guard, interceptor, exception filter và decorator riêng, biết thứ tự chạy của chúng; kiểm dữ liệu vào bằng DTO + class-validator (whitelist chống mass assignment) hoặc Standard Schema (Zod); ẩn trường nhạy cảm khi trả về; cấu hình theo môi trường có kiểm biến; dùng Prisma và TypeORM trong Nest, transaction và chống đặt trùng; xác thực JWT bằng guard toàn cục + @Public, phân quyền theo vai trò và theo chủ sở hữu; test đơn vị với TestingModule, test e2e với cơ sở dữ liệu thật, Jest và Vitest; sinh tài liệu OpenAPI; hàng đợi BullMQ, lịch cron, sự kiện, microservice, WebSocket gateway; đóng gói Docker, health check, CI GitHub Actions.',
    requirements: 'Đã viết được API Express cơ bản bằng JavaScript/TypeScript (khoá Node.js chương 1–8 hoặc tương đương); biết class, interface, generic TypeScript cơ bản; biết SQL nhập môn. Biết Spring Boot là lợi thế (có bảng so sánh) nhưng không bắt buộc.',
    documentsNote: 'Tài liệu chính: docs.nestjs.com (Overview, Fundamentals, Techniques, Security, Recipes) • NestJS v12.0.0 release notes (github.com/nestjs/nest/releases) • Nest courses (courses.nestjs.com) • class-validator/class-transformer README • Prisma Docs — NestJS guide • TypeORM docs • @nestjs/swagger, @nestjs/bullmq, @nestjs/websockets docs • Socket.IO docs • BullMQ docs • OWASP API Security Top 10 (2023) • Spring Framework Reference — The IoC Container (để so sánh).',
  },
  sections: khung('nst', [
    ['Section 0 — Why NestJS', 'Mục 0 — Vì sao học NestJS', 'NestJS là gì, khác Express và Spring Boot chỗ nào, học xong làm được gì; dựng môi trường Nest 12 chạy thật và chọn đề tài dự án.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What NestJS is, where it came from, and what this course gives you', 'Bắt đầu tại đây (1/2) — NestJS là gì, từ đâu ra, và khoá này cho bạn điều gì', 'Nest là gì: khung có cấu trúc chạy trên Express/Fastify · Lịch sử: Kamil Myśliwiec, 2017, cảm hứng Angular, tới Nest 12 (08/2026) · Khác Express, Fastify, Hono, Spring Boot · Nền cần trước · Học xong làm gì, tin tuyển dụng · Công ty lớn dùng thật (nestjs.com) · Học kèm khoá nào'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — Express without structure, and how to learn this course', 'Bắt đầu tại đây (2/2) — Express không khuôn khổ lớn lên thành gì, và cách học khoá này', 'Tình huống minh hoạ: đồ án Express một tệp 2.000 dòng · Sự cố thật: GitHub 04/03/2012 (mass assignment) · CVE-2025-54782 (devtools của Nest, 2025) · Cấu trúc không tự làm an toàn — vì sao vẫn phải hiểu bên dưới · Lộ trình tối thiểu/đầy đủ, nhịp học'],
      ['moi-truong-lab', 'Lab setup: Node 22, Nest CLI 12, ESM vs CommonJS, first run and first test', 'Dựng môi trường: Node 22, Nest CLI 12, ESM hay CommonJS, chạy và test lần đầu', 'Cài Nest CLI, nest new --type esm/cjs · Sự cố thật khi soạn: npm 10.9 cài hỏng (edgesOut), Jest 30 không nạp được gói ESM trên Node 22 · Đọc từng tệp sinh ra · Chạy, curl, test đơn vị + e2e · Docker Postgres cho các chương sau'],
      ['du-an', 'The course project: pick a topic, and the lab-booking capstone', 'Dự án xuyên suốt: chọn đề tài, và đề cuối khoá đặt lịch phòng lab', 'Năm đề tài gợi ý + tự chọn · Mỗi chương một mốc dự án · Đề cuối khoá: API đặt lịch phòng lab (cùng đề Dự án 1 lộ trình Node) · Rubric bảo vệ · Đăng ký đề tài'],
    ]],
    ['Chapter 1 — Nest under the hood: decorators, metadata and your first controller', 'Chương 1 — Nest bên dưới: decorator, metadata và controller đầu tiên', 'Hiểu decorator + reflect-metadata đủ để Nest không còn là phép màu; controller và vòng đời request.', [
      ['decorator-metadata', 'Decorators and reflect-metadata: build a 60-line @Get router yourself', 'Decorator và reflect-metadata: tự viết router @Get 60 dòng', 'Decorator là hàm chạy lúc định nghĩa class · experimentalDecorators vs decorator chuẩn TC39 · emitDecoratorMetadata và design:paramtypes · Lab: router mini đọc metadata · Liên kết typescript 14.4'],
      ['nest-new', 'Anatomy of a Nest app: main.ts, NestFactory, AppModule, build and watch', 'Giải phẫu ứng dụng Nest: main.ts, NestFactory, AppModule, build và watch', 'NestFactory.create làm gì · Express hay Fastify bên dưới · nest build, start:dev, SWC · Log khởi động đọc thế nào · nest g resource'],
      ['controller', 'Controllers: routes, params, query, body, status codes and headers', 'Controller: route, tham số, query, body, mã trạng thái và header', '@Controller/@Get/@Post · @Param, @Query, @Body, @Headers · @HttpCode, @Header, @Redirect · Trả object, Promise, Observable · @Res và cái giá của nó · Thứ tự route :id vs me'],
      ['vong-doi', 'The request lifecycle: middleware → guard → interceptor → pipe → handler → filter', 'Vòng đời request: middleware → guard → interceptor → pipe → handler → filter', 'Sơ đồ toàn cảnh, mỗi lớp trả lời câu hỏi nào · So với chuỗi middleware Express và filter chain Spring · Thí nghiệm in log từng lớp · Bản đồ cho chương 3'],
      ['lab', 'Lab: A Notes API in Nest, side by side with its Express version', 'Lab: Notes API bằng Nest, đặt cạnh bản Express', 'Viết lại Notes API của khoá Node.js · So số dòng, chỗ đặt logic, cách test · Đạt khi: 5 endpoint chạy, curl ra đúng mã trạng thái'],
      ['moc-du-an', 'Project milestone 1: skeleton and first resource of your topic', 'Mốc dự án 1: khung và tài nguyên đầu tiên của đề tài', 'nest new, một resource CRUD trong bộ nhớ · README chạy được · Commit đầu'],
      ['quiz', 'Chapter 1 quiz', 'Kiểm tra Chương 1', '10 câu có giải thích: decorator chạy khi nào · design:paramtypes · @Res · thứ tự route'],
    ]],
    ['Chapter 2 — Modules and the DI container (compared with Spring IoC)', 'Chương 2 — Module và DI container (so với Spring IoC)', 'Trái tim của Nest: ai tạo object, ai được thấy object nào.', [
      ['di-la-gi', 'Inversion of control from zero: write a 60-line DI container', 'Đảo ngược điều khiển từ số 0: tự viết DI container 60 dòng', 'new trong constructor và vì sao khó test · Container đọc design:paramtypes, tạo singleton · Đồ thị phụ thuộc, vòng lặp · Liên tưởng bếp nhà hàng: đầu bếp không tự đi chợ'],
      ['provider', 'Providers in depth: useClass, useValue, useFactory, useExisting, tokens and @Inject', 'Provider chuyên sâu: useClass, useValue, useFactory, useExisting, token và @Inject', 'Class token, string/symbol token, InjectionToken · Factory có inject · @Optional · Thay bản thật bằng bản giả'],
      ['module', 'Modules: imports, exports, encapsulation, global modules and circular dependencies', 'Module: imports, exports, đóng gói, module global và phụ thuộc vòng', 'Đọc lỗi "Nest can\'t resolve dependencies" · exports là cửa ra duy nhất · @Global và khi nào đừng dùng · forwardRef và cách tránh'],
      ['scope-lifecycle', 'Scopes and lifecycle hooks: singleton, request, transient, startup and shutdown', 'Scope và lifecycle hook: singleton, request, transient, khởi động và tắt', 'Request scope lan ngược lên cây và giá của nó · onModuleInit, onApplicationBootstrap, onModuleDestroy · enableShutdownHooks và SIGTERM trong Docker · Nest 12: hook chạy theo cấp cây'],
      ['dynamic-module', 'Dynamic modules: forRoot, forFeature, register and ConfigurableModuleBuilder', 'Dynamic module: forRoot, forFeature, register và ConfigurableModuleBuilder', 'Vì sao ConfigModule.forRoot nhận tham số · Tự viết một module có cấu hình · forRootAsync với useFactory'],
      ['so-spring', 'Nest vs Spring IoC: a translation table for Java developers', 'Nest và Spring IoC: bảng dịch cho người biết Java', '@Module ≈ @Configuration, @Injectable ≈ @Component/@Service, useFactory ≈ @Bean · Scope, @Qualifier vs token · Khác biệt: không quét classpath, đóng gói theo module · Câu phỏng vấn: DI là gì'],
      ['lab', 'Lab: Swap a payment provider without touching the service', 'Lab: Đổi nhà cung cấp thanh toán mà không sửa service', 'Token + useFactory theo biến môi trường · Bản giả cho test · Đạt khi: đổi provider bằng cấu hình, test xanh'],
      ['moc-du-an', 'Project milestone 2: split your topic into feature modules', 'Mốc dự án 2: tách đề tài thành module tính năng', 'Mỗi tính năng một module · Chỉ export thứ module khác cần · Sơ đồ phụ thuộc trong README'],
      ['quiz', 'Chapter 2 quiz', 'Kiểm tra Chương 2', '10 câu: lỗi resolve dependencies · exports · request scope · so Spring'],
    ]],
    ['Chapter 3 — The request pipeline: middleware, filters, pipes, guards, interceptors', 'Chương 3 — Dây chuyền request: middleware, filter, pipe, guard, interceptor', 'Mỗi lớp một việc; đặt logic đúng lớp là kỹ năng phân biệt người biết Nest.', [
      ['middleware', 'Middleware: functional and class middleware, consumer.apply, and Express middleware reuse', 'Middleware: dạng hàm và dạng class, consumer.apply, dùng lại middleware Express', 'Gắn request id, đo thời gian · forRoutes/exclude · Dùng helmet, cors · Middleware không biết handler nào sẽ chạy'],
      ['exception-filter', 'Exceptions and filters: HttpException, built-in errors, a problem+json filter', 'Ngoại lệ và filter: HttpException, lỗi dựng sẵn, filter trả problem+json', 'Lỗi không bắt được thành 500 · errorCode của Nest 12 · @Catch, ArgumentsHost · Không lộ stack ra ngoài · Liên kết api-design ch2'],
      ['pipe', 'Pipes: ParseIntPipe, ParseUUIDPipe, default values and custom pipes', 'Pipe: ParseIntPipe, ParseUUIDPipe, giá trị mặc định và pipe tự viết', 'Biến đổi + kiểm · Gắn ở tham số, route, toàn cục · Pipe tự viết đổi chuỗi ngày thành Date · Lỗi 400 rõ ràng'],
      ['guard', 'Guards: CanActivate, ExecutionContext, Reflector and custom metadata decorators', 'Guard: CanActivate, ExecutionContext, Reflector và decorator metadata tự viết', 'Guard trả true/false hay ném lỗi · Reflector.createDecorator · Đọc metadata ở handler và class · Guard chạy SAU middleware, TRƯỚC pipe'],
      ['interceptor', 'Interceptors: just enough RxJS, timing, response mapping, timeouts and caching', 'Interceptor: RxJS vừa đủ, đo thời gian, đổi dạng phản hồi, timeout và cache', 'next.handle() là Observable · map, tap, catchError, timeout · Bọc phản hồi {data} · Interceptor vs middleware'],
      ['thu-tu', 'Binding scope and execution order: global, controller, route — a full experiment', 'Phạm vi gắn và thứ tự chạy: toàn cục, controller, route — thí nghiệm đầy đủ', 'useGlobal* vs APP_GUARD/APP_PIPE (có DI) · Thứ tự khi nhiều lớp cùng loại · createParamDecorator, applyDecorators · Bảng tra nhanh'],
      ['lab', 'Lab: An audit trail — request id, timing, role check, unified errors', 'Lab: Nhật ký kiểm toán — request id, đo thời gian, kiểm vai trò, lỗi thống nhất', 'Mỗi yêu cầu đặt đúng lớp · Đạt khi: log đủ trường, lỗi cùng một dạng, test chứng minh thứ tự'],
      ['moc-du-an', 'Project milestone 3: errors, logging and a first guard in your project', 'Mốc dự án 3: lỗi, log và guard đầu tiên trong dự án', 'Filter problem+json · Interceptor đo thời gian · Guard API key tạm'],
      ['quiz', 'Chapter 3 quiz', 'Kiểm tra Chương 3', '10 câu: logic này đặt lớp nào · thứ tự chạy · APP_GUARD vs useGlobalGuards'],
    ]],
    ['Chapter 4 — DTOs, validation, serialization and OpenAPI', 'Chương 4 — DTO, kiểm dữ liệu, tuần tự hoá và OpenAPI', 'Không tin dữ liệu vào, không lộ dữ liệu ra, và tài liệu tự sinh từ cùng một nguồn.', [
      ['dto-validation', 'DTOs with class-validator and ValidationPipe — and Standard Schema (Zod) in Nest 12', 'DTO với class-validator và ValidationPipe — và Standard Schema (Zod) ở Nest 12', 'DTO là gì, vì sao là class · IsString, IsInt, Min, IsEmail, IsEnum · Thông báo lỗi tiếng Việt · @Body({ schema }) và StandardSchemaValidationPipe · Liên kết typescript ch13'],
      ['whitelist-transform', 'whitelist, forbidNonWhitelisted, transform, nested objects and arrays', 'whitelist, forbidNonWhitelisted, transform, object lồng và mảng', 'Mass assignment: gửi thêm role=ADMIN · GitHub 2012 · transform và ép kiểu query · ValidateNested + Type · Giới hạn kích thước mảng'],
      ['mapped-types-serialization', 'Mapped types and response serialization: PartialType, @Exclude, response DTOs', 'Mapped types và tuần tự hoá phản hồi: PartialType, @Exclude, DTO trả về', 'Create/Update DTO không lặp · ClassSerializerInterceptor, @Exclude passwordHash · Trả DTO riêng thay vì entity · Lộ dữ liệu thừa (OWASP API3:2023)'],
      ['openapi', 'OpenAPI with @nestjs/swagger: CLI plugin, decorators, auth, versioning', 'OpenAPI với @nestjs/swagger: plugin CLI, decorator, xác thực, versioning', 'DocumentBuilder, /docs · Plugin tự đọc DTO · ApiResponse, ApiBearerAuth · URI versioning · Sinh client TypeScript · Tắt docs ở production?'],
      ['lab', 'Lab: A booking form that cannot be abused', 'Lab: Biểu mẫu đặt lịch không thể lạm dụng', 'DTO đầy đủ, ngày giờ hợp lệ, không trường lạ · Phản hồi không lộ trường nội bộ · Đạt khi: 12 request xấu đều bị chặn đúng mã'],
      ['moc-du-an', 'Project milestone 4: DTOs, validation and API docs for your topic', 'Mốc dự án 4: DTO, kiểm dữ liệu và tài liệu API cho đề tài', 'ValidationPipe toàn cục whitelist · DTO trả về · /docs chạy được'],
      ['quiz', 'Chapter 4 quiz', 'Kiểm tra Chương 4', '10 câu: whitelist · transform · @Exclude · OpenAPI plugin'],
    ]],
    ['Chapter 5 — Configuration, logging and project structure', 'Chương 5 — Cấu hình, log và cấu trúc dự án', 'Một mã nguồn chạy được ở dev, test, production mà không sửa code.', [
      ['config', '@nestjs/config: .env, validated environment, namespaces and typed access', '@nestjs/config: .env, kiểm biến môi trường, namespace và truy cập có kiểu', 'ConfigModule.forRoot với schema (Nest 12: Standard Schema) · registerAs · Ứng dụng từ chối khởi động khi thiếu biến · Liên kết docker (biến môi trường)'],
      ['bi-mat', 'Secrets and environments: what never goes into git, and real leaks', 'Bí mật và môi trường: thứ không bao giờ vào git, và các vụ lộ thật', '.env.example vs .env · Sự cố thật: khoá truy cập bị đẩy lên GitHub công khai · Quét bí mật trước commit · Biến khác nhau giữa môi trường'],
      ['logger', 'Logging in Nest: Logger, JSON logs, structured params and pino', 'Log trong Nest: Logger, log JSON, tham số có cấu trúc và pino', 'ConsoleLogger json:true · Nest 12 structuredParams · nestjs-pino và request id · Không log mật khẩu/token · Liên kết log-tu-a-den-z'],
      ['cau-truc', 'Project structure that scales: feature folders, shared modules, monorepo libraries', 'Cấu trúc dự án lớn lên được: thư mục theo tính năng, module dùng chung, thư viện monorepo', 'Theo tính năng thay vì theo loại tệp · nest g app/library · Path alias · Quy ước đặt tên ở công ty'],
      ['lab', 'Lab: One build, three environments', 'Lab: Một bản build, ba môi trường', 'Thiếu biến ⇒ không khởi động · Log JSON ở production, log màu ở dev · Đạt khi: cùng image chạy 3 cấu hình'],
      ['moc-du-an', 'Project milestone 5: config, logs and structure of your project', 'Mốc dự án 5: cấu hình, log và cấu trúc dự án', 'Schema biến môi trường · .env.example · Log có request id'],
      ['quiz', 'Chapter 5 quiz', 'Kiểm tra Chương 5', '10 câu: registerAs · lộ bí mật · log JSON · cấu trúc thư mục'],
    ]],
    ['Chapter 6 — Databases in Nest: Prisma, TypeORM and transactions', 'Chương 6 — Cơ sở dữ liệu trong Nest: Prisma, TypeORM và transaction', 'Nối ORM vào DI container cho đúng; transaction và chống đặt trùng.', [
      ['prisma', 'Prisma in Nest: a PrismaService, lifecycle and a repository layer', 'Prisma trong Nest: PrismaService, vòng đời và tầng repository', 'PrismaService là provider, kết nối ở onModuleInit · Module Prisma dùng chung · Service gọi repository · Prisma chuyên sâu: liên kết khoá prisma-orm'],
      ['transaction', 'Transactions across services: $transaction, interactive transactions and CLS', 'Transaction xuyên service: $transaction, interactive transaction và CLS', 'Hai service một giao dịch · Truyền tx qua tham số hay qua CLS (nestjs-cls) · Isolation level · Bẫy giữ transaction quá lâu'],
      ['typeorm', 'TypeORM in Nest: entities, repositories, relations and migrations (the JPA-like option)', 'TypeORM trong Nest: entity, repository, quan hệ và migration (lựa chọn giống JPA)', 'TypeOrmModule.forRootAsync, forFeature · @InjectRepository · So với JPA/Hibernate · synchronize:true và vì sao cấm ở production'],
      ['loi-db-phan-trang', 'Database errors and lists: unique violations → 409, not found → 404, pagination', 'Lỗi cơ sở dữ liệu và danh sách: trùng → 409, không thấy → 404, phân trang', 'Filter đổi P2002/23505 thành 409 · findUniqueOrThrow · Phân trang offset vs cursor · Liên kết api-design ch3'],
      ['chong-dat-trung', 'No double booking: constraints, exclusion constraints and optimistic locking', 'Không đặt trùng: ràng buộc, exclusion constraint và optimistic locking', 'Race khi kiểm-rồi-ghi · Exclusion constraint tstzrange trên PostgreSQL · version column · Test 50 request song song'],
      ['lab', 'Lab: Room booking storage that survives concurrent requests', 'Lab: Lưu đặt phòng chịu được request đồng thời', 'Prisma + PostgreSQL thật trong Docker · Đạt khi: 50 request song song chỉ 1 thành công, 49 nhận 409'],
      ['moc-du-an', 'Project milestone 6: a real database for your project', 'Mốc dự án 6: cơ sở dữ liệu thật cho dự án', 'Lược đồ, migration, seed · Lỗi DB đổi thành mã HTTP đúng'],
      ['quiz', 'Chapter 6 quiz', 'Kiểm tra Chương 6', '10 câu: PrismaService · transaction · synchronize · exclusion constraint'],
    ]],
    ['Chapter 7 — Authentication and authorization: JWT guards and RBAC', 'Chương 7 — Xác thực và phân quyền: guard JWT và RBAC', 'Ai đang gọi, và được làm gì — viết bằng guard, không rải if khắp nơi.', [
      ['jwt-guard', 'JWT in Nest: @nestjs/jwt, a hand-written AuthGuard, and when Passport helps', 'JWT trong Nest: @nestjs/jwt, AuthGuard tự viết, và khi nào Passport có ích', 'Đăng ký JwtModule.registerAsync · Guard đọc Bearer, verify, gắn req.user · @nestjs/passport strategy · JWT chuyên sâu: liên kết authentication ch4'],
      ['dang-nhap', 'Register and login: hashing, access + refresh tokens, logout', 'Đăng ký và đăng nhập: băm mật khẩu, access + refresh token, đăng xuất', 'argon2/bcrypt trong service · Refresh xoay vòng, lưu băm · Không phân biệt "sai email" và "sai mật khẩu" · Liên kết authentication ch2, ch5'],
      ['rbac', 'Global auth with @Public(), roles with @Roles() and a RolesGuard', 'Xác thực toàn cục với @Public(), vai trò với @Roles() và RolesGuard', 'APP_GUARD để mặc định là đóng · Reflector.getAllAndOverride · Thứ tự hai guard · @CurrentUser() tự viết'],
      ['so-huu', 'Ownership and policies: stopping IDOR, and CASL for fine-grained rules', 'Quyền theo chủ sở hữu: chặn IDOR, và CASL cho luật chi tiết', 'Sinh viên chỉ huỷ lịch của mình · Sự cố thật: First American Financial 2019 (885 triệu hồ sơ qua URL đoán được) · OWASP API1:2023 BOLA · CASL ability'],
      ['throttler-helmet', 'Hardening: @nestjs/throttler, helmet, CORS and brute-force protection', 'Gia cố: @nestjs/throttler, helmet, CORS và chống dò mật khẩu', 'Giới hạn theo IP/tài khoản · Đằng sau proxy: trust proxy · CORS đúng nguồn · Header bảo mật'],
      ['lab', 'Lab: Students, lecturers, admins — who may do what', 'Lab: Sinh viên, giảng viên, admin — ai được làm gì', 'Ma trận quyền 3 vai trò × 8 thao tác · Đạt khi: test e2e cho từng ô ma trận'],
      ['moc-du-an', 'Project milestone 7: accounts, roles and ownership in your project', 'Mốc dự án 7: tài khoản, vai trò và quyền sở hữu trong dự án', 'Đăng ký/đăng nhập · Mặc định đóng · Ít nhất 2 vai trò + 1 luật sở hữu'],
      ['quiz', 'Chapter 7 quiz', 'Kiểm tra Chương 7', '10 câu: APP_GUARD · @Public · IDOR · throttler sau proxy'],
    ]],
    ['Chapter 8 — Testing Nest apps: unit, integration and e2e (Vitest and Jest)', 'Chương 8 — Test ứng dụng Nest: đơn vị, tích hợp và e2e (Vitest và Jest)', 'TestingModule thay provider thật bằng giả; e2e chạy cả dây chuyền trên cơ sở dữ liệu thật.', [
      ['unit', 'Unit tests with Test.createTestingModule, overrideProvider and mocks', 'Test đơn vị với Test.createTestingModule, overrideProvider và mock', 'Dựng module test nhỏ nhất · vi.fn/jest.fn · Test service không chạm DB · Tư duy test: liên kết khoá testing'],
      ['thanh-phan', 'Testing guards, pipes, interceptors and filters in isolation', 'Test riêng guard, pipe, interceptor và filter', 'Giả ExecutionContext · Test pipe như hàm thuần · Test filter bằng ArgumentsHost giả'],
      ['e2e', 'End-to-end tests: supertest, the same global setup as main.ts, a real PostgreSQL', 'Test e2e: supertest, cùng cấu hình toàn cục như main.ts, PostgreSQL thật', 'Tách hàm cauHinhApp dùng chung · DB test trong Docker, dọn dữ liệu giữa test · Test guard + DTO + filter cùng lúc'],
      ['jest-du-an-cu', 'Jest on existing Nest 10/11 projects, and moving between Jest and Vitest', 'Jest trên dự án Nest 10/11 đang chạy, và chuyển qua lại Jest–Vitest', 'Dự án công ty: CommonJS + Jest · Vì sao Nest 12 + Jest cần Node 24.9+ · Bảng đổi jest.fn ↔ vi.fn · Độ phủ, test chập chờn'],
      ['lab', 'Lab: Cover the booking module — unit, guard and e2e', 'Lab: Phủ test module đặt lịch — đơn vị, guard và e2e', 'Đạt khi: test bắt được 3 lỗi cài sẵn (quên @Public, quên whitelist, sai chủ sở hữu)'],
      ['moc-du-an', 'Project milestone 8: tests that catch real bugs in your project', 'Mốc dự án 8: test bắt được lỗi thật của dự án', 'Đơn vị cho service chính · e2e cho luồng đăng nhập + một luồng nghiệp vụ'],
      ['quiz', 'Chapter 8 quiz', 'Kiểm tra Chương 8', '10 câu: overrideProvider · e2e thiếu ValidationPipe · Jest vs Vitest'],
    ]],
    ['Chapter 9 — Work outside the request: queues, schedules and events', 'Chương 9 — Việc ngoài request: hàng đợi, lịch hẹn giờ và sự kiện', 'Gửi email, duyệt lịch, dọn dữ liệu — không bắt người dùng chờ.', [
      ['bullmq', 'Queues with @nestjs/bullmq: producers, processors, retries and idempotency', 'Hàng đợi với @nestjs/bullmq: producer, processor, thử lại và idempotency', 'BullModule.forRootAsync, registerQueue · @Processor, WorkerHost · attempts, backoff · Job chạy hai lần · BullMQ bên trong: liên kết nodejs ch13'],
      ['schedule', 'Scheduling with @nestjs/schedule: cron, intervals, and running once across replicas', 'Hẹn giờ với @nestjs/schedule: cron, interval, và chạy đúng một lần khi có nhiều bản', '@Cron, SchedulerRegistry · Ba bản chạy ba lần · Khoá Redis hoặc job lặp BullMQ'],
      ['events', 'Events with @nestjs/event-emitter: decoupling modules inside one app', 'Sự kiện với @nestjs/event-emitter: tách module trong một ứng dụng', '@OnEvent, async listener · Sự kiện trong bộ nhớ mất khi sập · Khi nào chuyển sang hàng đợi · outbox pattern ở mức nhận biết'],
      ['lab', 'Lab: Booking approval and reminder emails through a queue', 'Lab: Duyệt lịch và email nhắc qua hàng đợi', 'Redis thật trong Docker · Đạt khi: worker chết giữa chừng vẫn không gửi trùng'],
      ['moc-du-an', 'Project milestone 9: move slow work of your project to a queue', 'Mốc dự án 9: dời việc chậm của dự án sang hàng đợi', 'Một job có thử lại · Một cron dọn dữ liệu'],
      ['quiz', 'Chapter 9 quiz', 'Kiểm tra Chương 9', '10 câu: idempotency · cron nhiều bản · event vs queue'],
    ]],
    ['Chapter 10 — Real time and microservices: WebSocket gateways and transports', 'Chương 10 — Thời gian thực và microservice: WebSocket gateway và transport', 'Đẩy cập nhật tới trình duyệt; nói chuyện giữa các dịch vụ bằng thông điệp.', [
      ['gateway', 'WebSocket gateways: @WebSocketGateway, @SubscribeMessage, Socket.IO and ws adapters', 'WebSocket gateway: @WebSocketGateway, @SubscribeMessage, adapter Socket.IO và ws', 'Gateway là provider · Phát cho mọi người, cho một phòng · Pipe/guard/filter trên WebSocket · Realtime nền: liên kết nodejs ch11'],
      ['ws-auth-scale', 'Authenticating sockets, rooms per resource, and scaling with the Redis adapter', 'Xác thực socket, phòng theo tài nguyên, và mở rộng bằng Redis adapter', 'Kiểm JWT lúc bắt tay · WsException · Hai bản ứng dụng cùng phát · Góc hacker: Cross-Site WebSocket Hijacking và kiểm Origin'],
      ['microservice', 'Microservices in Nest: transports, @MessagePattern vs @EventPattern, hybrid apps', 'Microservice trong Nest: transport, @MessagePattern và @EventPattern, ứng dụng lai', 'TCP, Redis, NATS, RabbitMQ, Kafka · ClientProxy.send vs emit · Timeout, thử lại · connectMicroservice'],
      ['khi-nao-tach', 'When not to split: a modular monolith first', 'Khi nào chưa nên tách: khối nguyên theo module trước', 'Chi phí mạng, dữ liệu phân tán, triển khai · Module Nest là ranh giới sẵn · Liên kết nodejs 18.4 và system-design'],
      ['lab', 'Lab: A live room-availability board', 'Lab: Bảng tình trạng phòng cập nhật trực tiếp', 'Đặt lịch ở tab A, tab B thấy ngay · Đạt khi: socket không token bị từ chối, hai bản ứng dụng vẫn đồng bộ'],
      ['moc-du-an', 'Project milestone 10: one real-time feature in your project', 'Mốc dự án 10: một tính năng thời gian thực trong dự án', 'Gateway có xác thực · Phòng theo tài nguyên'],
      ['quiz', 'Chapter 10 quiz', 'Kiểm tra Chương 10', '10 câu: gateway · xác thực socket · send vs emit · khi nào tách'],
    ]],
    ['Chapter 11 — Production: Docker, health checks, CI and operations', 'Chương 11 — Production: Docker, health check, CI và vận hành', 'Từ máy bạn tới server: đóng gói, kiểm sức khoẻ, tự động kiểm mỗi lần đẩy mã.', [
      ['docker', 'A production Dockerfile for Nest: multi-stage, non-root, small image', 'Dockerfile production cho Nest: nhiều tầng, không chạy root, ảnh nhỏ', 'npm ci --omit=dev · prisma generate trong tầng build · USER node · Tắt đúng cách khi SIGTERM · Docker nền: liên kết khoá docker'],
      ['health', 'Health checks with @nestjs/terminus, graceful shutdown and readiness', 'Health check với @nestjs/terminus, tắt êm và sẵn sàng nhận request', 'Liveness vs readiness · Kiểm DB, Redis · enableShutdownHooks · Compose healthcheck'],
      ['ci', 'CI with GitHub Actions: lint, unit, e2e with a Postgres service, build image', 'CI với GitHub Actions: lint, test đơn vị, e2e với dịch vụ Postgres, build image', 'Workflow từng bước · Cache npm · Service container · Chặn merge khi đỏ · Liên kết github-actions'],
      ['hieu-nang-bao-mat', 'Performance and upkeep: Fastify adapter, caching, npm audit and upgrading Nest', 'Hiệu năng và bảo trì: Fastify adapter, cache, npm audit và nâng cấp Nest', 'Đo Express vs Fastify · @nestjs/cache-manager · nest upgrade 11→12 · CVE-2025-54782: gói devtools chỉ ở máy dev, cập nhật'],
      ['lab', 'Lab: Ship it — compose stack, green CI, zero-downtime restart', 'Lab: Đưa lên — stack compose, CI xanh, khởi động lại không rớt request', 'Đạt khi: image < 200 MB, không root, health xanh, CI chạy e2e'],
      ['moc-du-an', 'Project milestone 11: your project in Docker with CI', 'Mốc dự án 11: dự án của bạn trong Docker và CI', 'Dockerfile + compose · Workflow CI · Badge trong README'],
      ['quiz', 'Chapter 11 quiz', 'Kiểm tra Chương 11', '10 câu: multi-stage · readiness · service container · nâng cấp phiên bản'],
    ]],
    ['Chapter 12 — Capstone: a lab-booking API', 'Chương 12 — Dự án cuối khoá: API đặt lịch phòng lab', 'Ghép cả khoá thành một sản phẩm đưa vào CV và bảo vệ được trước hội đồng.', [
      ['de-bai', 'The brief: user stories, constraints, deadline and rubric', 'Đề bài: user story, ràng buộc, thời hạn và rubric', 'Sinh viên đặt, giảng viên duyệt, admin quản lý phòng · Không đặt trùng · Rubric 100 điểm · Bản thi có giờ kiểu PE'],
      ['kien-truc', 'Architecture: modules, data model and API contract first', 'Kiến trúc: module, mô hình dữ liệu và hợp đồng API trước', 'Sơ đồ module · Lược đồ Prisma · OpenAPI viết trước, code sau · Quyết định ghi lại (ADR)'],
      ['dat-lich', 'Core: booking without double booking, approval flow and ownership', 'Lõi: đặt lịch không trùng, luồng duyệt và quyền sở hữu', 'Exclusion constraint · Trạng thái chờ/duyệt/từ chối/huỷ · Guard vai trò + sở hữu'],
      ['hang-doi-realtime', 'Queue and real time: approval notifications and a live board', 'Hàng đợi và thời gian thực: thông báo duyệt và bảng trực tiếp', 'Job gửi thông báo có thử lại · Gateway cập nhật bảng phòng · Nhắc lịch bằng cron'],
      ['kiem-thu-trien-khai', 'Tests, Docker and CI for the capstone', 'Test, Docker và CI cho dự án cuối', 'Bộ e2e theo user story · Compose một lệnh · CI xanh · README tiếng Anh'],
      ['bao-ve', 'Defending your project: demo script and the panel\'s questions', 'Bảo vệ dự án: kịch bản demo và câu hỏi của hội đồng', 'Demo 7 phút · 15 câu hội đồng hay hỏi · Tự chấm theo rubric'],
      ['phong-van', 'NestJS interview questions (with model answers)', 'Câu hỏi phỏng vấn NestJS (kèm gợi ý trả lời)', 'DI là gì, Nest khác Express · Vòng đời request · Guard vs middleware vs interceptor · Request scope · Test e2e · Câu so với Spring'],
      ['tong-ket', 'Final quiz and checklist', 'Kiểm tra tổng kết và checklist', '20 câu trộn cả khoá · Checklist trước khi đẩy một API Nest lên production'],
    ]],
  ]).map((sec, i) => (DA_SOAN[i] ? ghep(sec, DA_SOAN[i]) : sec)),
};
