/**
 * 4.3 — Mapped types và tuần tự hoá phản hồi (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (Node 22, Nest 12.6.0, @nestjs/mapped-types 12.0.1, class-transformer 0.5.1) — lab/c4/app/src/b43:
 * ser.ts (PartialType/OmitType/PickType giữ luật; ClassSerializerInterceptor bỏ qua object thường ⇒ passwordHash + resetToken lộ;
 * "as UserEntity" không cứu; instance thật ẩn được nhưng lộ lop.giangVienEmail (danh sách chặn); DTO trả về @Exclude lớp + @Expose
 * và @SerializeOptions({ type }) chỉ còn 3 trường), bt.ts (DTO lồng @Type, groups admin, getter).
 * Sự cố: Peloton 05/05/2021 (TechCrunch; Pen Test Partners) — API trả dữ liệu hồ sơ riêng tư mà giao diện đã ẩn.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'api-design', bai: 'api-6-3-owasp-api', title: 'API Design 6.3 — OWASP API Security Top 10 (2023)', sub: 'API3: lộ thuộc tính và mass assignment, thành bộ kiểm tự động.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'typescript', bai: 'typescript-13-3-schema-source-of-truth', title: 'TypeScript 13.3 — Schema là nguồn sự thật duy nhất', sub: 'Cùng ý tưởng "một nguồn, nhiều kiểu" của mapped types, phía Zod.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS Docs — Mapped types', 'PartialType, PickType, OmitType, IntersectionType; bản @nestjs/swagger cho OpenAPI.', 'https://docs.nestjs.com/techniques/validation#mapped-types'),
  nguon('📘', 'NestJS Docs — Serialization', 'ClassSerializerInterceptor, @Exclude, @Expose, @SerializeOptions({ type }).', 'https://docs.nestjs.com/techniques/serialization'),
  nguon('📰', 'TechCrunch (05/05/2021) — Peloton’s leaky API let anyone grab riders’ private account data', 'Phát hiện của Jan Masters (Pen Test Partners): dữ liệu hồ sơ riêng tư vẫn trả qua API.', 'https://techcrunch.com/2021/05/05/peloton-bug-account-data-leak/'),
  nguon('📘', 'OWASP API3:2023 — Broken Object Property Level Authorization', 'Trả thừa thuộc tính và cho ghi thuộc tính không được phép.', 'https://owasp.org/API-Security/editions/2023/en/0xa3-broken-object-property-level-authorization/'),
].join('\n');

const MA_43 = "import 'reflect-metadata';\nimport { Body, ClassSerializerInterceptor, Controller, Get, Module, Patch, SerializeOptions, UseInterceptors, ValidationPipe } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\nimport { OmitType, PartialType, PickType } from '@nestjs/mapped-types';\nimport { Exclude, Expose, plainToInstance } from 'class-transformer';\nimport { IsEmail, IsEnum, IsString, Length, MinLength } from 'class-validator';\nimport { goi } from '../goi.js';\n\n// ---- Mapped types: một nguồn luật, nhiều DTO\nclass CreateUserDto {\n  @IsString() @Length(2, 50) name: string;\n  @IsEmail() email: string;\n  @IsString() @MinLength(12) password: string;\n  @IsEnum(['STUDENT', 'LECTURER']) role: 'STUDENT' | 'LECTURER';\n}\nclass UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password', 'role'] as const)) {}\nclass LoginDto extends PickType(CreateUserDto, ['email', 'password'] as const) {}\n\n// ---- \"Bản ghi DB\": ORM như Prisma trả về object THƯỜNG, không phải instance của class\nconst rowDb = () => ({ id: 7, name: 'An', email: 'an@fpt.edu.vn', passwordHash: '$argon2id$v=19$m=65536…', role: 'STUDENT', resetToken: 'f3a9c1…', lop: { id: 2, ten: 'SE1801', giangVienEmail: 'gv@fe.edu.vn' } });\n\nclass UserEntity {\n  id: number; name: string; email: string; role: string;\n  @Exclude() passwordHash: string;\n  @Exclude() resetToken: string;\n  lop: object;\n  constructor(p: Partial<UserEntity>) { Object.assign(this, p); }\n}\n// DTO trả về: chỉ những gì client được thấy — chặn mặc định, mở từng trường\n@Exclude() class UserResponse {\n  @Expose() id: number;\n  @Expose() name: string;\n  @Expose() email: string;\n}\n\n@Controller('users')\n@UseInterceptors(ClassSerializerInterceptor)\nclass C {\n  @Get('thang') thang() { return rowDb(); }                                   // trả thẳng bản ghi\n  @Get('entity-thuong') eThuong() { return rowDb() as unknown as UserEntity; }  // \"ép kiểu\" — vẫn object thường\n  @Get('entity') e() { return new UserEntity(rowDb()); }                      // instance thật ⇒ @Exclude chạy\n  @Get('response') r() { return plainToInstance(UserResponse, rowDb()); }\n  @Get('serialize-type') @SerializeOptions({ type: UserResponse }) s() { return rowDb(); }\n  @Patch('7') u(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) d: UpdateUserDto) { return d; }\n  @Patch('login') l(@Body(new ValidationPipe()) d: LoginDto) { return { ok: true }; }\n}\n@Module({ controllers: [C] }) class AppModule {}\nconst app = await NestFactory.create(AppModule, { logger: false });\nawait app.listen(3000);\nawait goi([\n  ['GET', '/users/thang'],\n  ['GET', '/users/entity-thuong'],\n  ['GET', '/users/entity'],\n  ['GET', '/users/response'],\n  ['GET', '/users/serialize-type'],\n  ['PATCH', '/users/7', { name: 'Bình' }],\n  ['PATCH', '/users/7', { name: 'B' }],\n  ['PATCH', '/users/7', { role: 'LECTURER' }],\n  ['PATCH', '/users/login', { email: 'an@fpt.edu.vn' }],\n], 22);\nawait app.close();";
const OUT_43 = "GET /users/thang\n  → 200 {\"id\":7,\"name\":\"An\",\"email\":\"an@fpt.edu.vn\",\"passwordHash\":\"$argon2id$v=19$m=65536…\",\"role\":\"STUDENT\",\"resetToken\":\"f3a9c1…\",\"lop\":{\"id\":2,\"ten\":\"SE1801\",\"giangVienEmail\":\"gv@fe.edu.vn\"}}\nGET /users/entity-thuong\n  → 200 {\"id\":7,\"name\":\"An\",\"email\":\"an@fpt.edu.vn\",\"passwordHash\":\"$argon2id$v=19$m=65536…\",\"role\":\"STUDENT\",\"resetToken\":\"f3a9c1…\",\"lop\":{\"id\":2,\"ten\":\"SE1801\",\"giangVienEmail\":\"gv@fe.edu.vn\"}}\nGET /users/entity\n  → 200 {\"id\":7,\"name\":\"An\",\"email\":\"an@fpt.edu.vn\",\"role\":\"STUDENT\",\"lop\":{\"id\":2,\"ten\":\"SE1801\",\"giangVienEmail\":\"gv@fe.edu.vn\"}}\nGET /users/response\n  → 200 {\"id\":7,\"name\":\"An\",\"email\":\"an@fpt.edu.vn\"}\nGET /users/serialize-type\n  → 200 {\"id\":7,\"name\":\"An\",\"email\":\"an@fpt.edu.vn\"}\nPATCH /users/7         {\"name\":\"Bình\"}\n  → 200 {\"name\":\"Bình\"}\nPATCH /users/7         {\"name\":\"B\"}\n  → 400 {\"message\":[\"name must be longer than or equal to 2 characters\"],\"error\":\"Bad Request\",\"statusCode\":400}\nPATCH /users/7         {\"role\":\"LECTURER\"}\n  → 400 {\"message\":[\"property role should not exist\"],\"error\":\"Bad Request\",\"statusCode\":400}\nPATCH /users/login     {\"email\":\"an@fpt.edu.vn\"}\n  → 400 {\"message\":[\"password must be longer than or equal to 12 characters\",\"password must be a string\"],\"error\":\"Bad Request\",\"statusCode\":400}";
const MA_BT = "import 'reflect-metadata';\nimport { ClassSerializerInterceptor, Controller, Get, Module, SerializeOptions, UseInterceptors } from '@nestjs/common';\nimport { NestFactory } from '@nestjs/core';\nimport { Exclude, Expose, Type } from 'class-transformer';\nimport { goi } from '../goi.js';\n\nconst rowDb = () => ({ id: 7, name: 'An', email: 'an@fpt.edu.vn', passwordHash: '$argon2id$…', role: 'STUDENT', lop: { id: 2, ten: 'SE1801', giangVienEmail: 'gv@fe.edu.vn' } });\n\n@Exclude() class LopResponse { @Expose() ten: string; }\n@Exclude() class UserDetailResponse {\n  @Expose() id: number;\n  @Expose() name: string;\n  @Expose() @Type(() => LopResponse) lop: LopResponse;      // lồng: phải chỉ rõ class, nếu không cả object lọt qua\n  @Expose({ groups: ['admin'] }) role: string;               // chỉ hiện với nhóm admin\n  @Expose() get nhan() { return `${this.name} (${this.lop?.ten})`; }\n}\n@Controller('users') @UseInterceptors(ClassSerializerInterceptor)\nclass C {\n  @Get('7') @SerializeOptions({ type: UserDetailResponse }) a() { return rowDb(); }\n  @Get('7/admin') @SerializeOptions({ type: UserDetailResponse, groups: ['admin'] }) b() { return rowDb(); }\n}\n@Module({ controllers: [C] }) class AppModule {}\nconst app = await NestFactory.create(AppModule, { logger: false });\nawait app.listen(3000);\nawait goi([['GET', '/users/7'], ['GET', '/users/7/admin']]);\nawait app.close();";
const OUT_BT = "GET /users/7\n  → 200 {\"id\":7,\"name\":\"An\",\"lop\":{\"ten\":\"SE1801\"},\"nhan\":\"An (SE1801)\"}\nGET /users/7/admin\n  → 200 {\"id\":7,\"name\":\"An\",\"lop\":{\"ten\":\"SE1801\"},\"role\":\"STUDENT\",\"nhan\":\"An (SE1801)\"}";

export default {
  title: '4.3 — Mapped types and response serialization: PartialType, @Exclude, response DTOs|||4.3 — Mapped types và tuần tự hoá phản hồi: PartialType, @Exclude, DTO trả về',
  slug: 'nst-4-3-mapped-types-serialization',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một DTO gốc sinh ra DTO sửa và DTO đăng nhập bằng PartialType, OmitType, PickType mà vẫn giữ luật. Chiều ra: chạy thật cho thấy ClassSerializerInterceptor bỏ qua object thường (như Prisma trả về) nên @Exclude không có tác dụng và passwordHash, resetToken lộ ra; instance thật ẩn được nhưng vẫn lộ email giảng viên trong object lồng. Cách đúng: DTO trả về theo danh sách cho phép với @SerializeOptions({ type }). Sự cố Peloton 2021 (OWASP API3).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>4.3 — One source for inputs, an allow-list for outputs</h2>
<p class="lead">Two problems, one lesson. Input: you need a create DTO, an update DTO where everything is optional, a login DTO with two fields — without copying rules three times. Output: the record you load from the database has fields the client must never see (<code>passwordHash</code>, reset tokens, internal notes). Mapped types solve the first; a response DTO solves the second — and the popular <code>@Exclude()</code> shortcut fails in a way we will reproduce.</p>

<h3>Everyday analogy: the medical record and the sick-leave note</h3>
<p>The clinic keeps your full record. When your employer needs proof, the clinic does not hand over the record with a few lines blacked out — someone might forget a line. It writes a separate sick-leave note that contains only dates and a signature. Blacking out is a deny-list (<code>@Exclude</code>); the note is an allow-list (a response DTO).</p>

<h3>Experiment — derived DTOs and five ways to return a user</h3>
<pre><code class="language-ts">${esc(MA_43)}</code></pre>
<div class="out">${esc(OUT_43)}</div>

<h4>1. Mapped types keep the rules</h4>
<p><code>UpdateUserDto = PartialType(OmitType(CreateUserDto, ['password', 'role']))</code>: <code>name</code> and <code>email</code> are optional but still validated (<code>"B"</code> fails <code>Length(2, 50)</code>), and <code>role</code> no longer exists, so <code>forbidNonWhitelisted</code> rejects it. <code>LoginDto = PickType(…, ['email', 'password'])</code> requires the password with the same 12-character rule. One source of truth; change a rule once. Import these helpers from <code>@nestjs/swagger</code> instead of <code>@nestjs/mapped-types</code> once you add OpenAPI (Lesson 4.4) — the swagger versions copy the documentation too.</p>

<h4>2. Returning the database row leaks everything</h4>
<p><code>/users/thang</code> sent <code>passwordHash</code>, <code>resetToken</code> and the lecturer's email inside <code>lop</code>. A reset token in a response is account takeover: whoever reads it can set a new password.</p>

<h4>3. <code>@Exclude()</code> on an entity does nothing for plain objects</h4>
<p><code>/users/entity-thuong</code> casts the row <code>as UserEntity</code> — and leaks exactly the same. <code>ClassSerializerInterceptor</code> runs <code>instanceToPlain</code>, which only applies decorators to <strong>class instances</strong>. Prisma, the MongoDB driver, <code>JSON.parse</code> and most query builders return plain objects, and a TypeScript cast changes nothing at runtime. This is the most common way the "just add @Exclude" advice fails in real projects.</p>

<h4>4. A real instance hides two fields — and still leaks the third</h4>
<p><code>/users/entity</code> builds <code>new UserEntity(row)</code>: <code>passwordHash</code> and <code>resetToken</code> are gone. But <code>lop.giangVienEmail</code> is still there: the nested object is plain, and nobody listed it. Deny-lists fail open — every new column added to the table (<code>phone</code>, <code>dateOfBirth</code>) is public until someone remembers to exclude it.</p>

<h4>5. Allow-list: a response DTO</h4>
<p><code>UserResponse</code> is <code>@Exclude()</code> at class level and <code>@Expose()</code> per field. <code>plainToInstance(UserResponse, row)</code> or, more simply, <code>@SerializeOptions({ type: UserResponse })</code> on the route turns any plain row into exactly <code>{ id, name, email }</code>. New columns stay private by default. The return type of the handler then documents the contract, and Lesson 4.4 turns it into OpenAPI.</p>

<h3>🕵️ Real incident — Peloton, May 2021</h3>
<p>On 5 May 2021 TechCrunch reported research by Jan Masters of Pen Test Partners on Peloton's API. Step by step: (1) Peloton's app let users set their profile to <em>private</em>, and the app then hid age, gender, city, weight and workout statistics; (2) the API endpoints behind the app still returned those fields — and could be called without authentication; (3) anyone could therefore collect private profile data of riders, including for accounts marked private. Peloton fixed it after disclosure; reports did not confirm whether the data was abused. The lesson for this chapter: <strong>hiding a field in the user interface is not access control</strong>. The server decides what leaves, per field — OWASP calls this API3:2023, Broken Object Property Level Authorization. A response DTO per audience (student, lecturer, admin) is how you implement that decision in Nest.</p>

<h3>🧪 Exercise (20 min) — a detail response with nesting and roles</h3>
<p>Write <code>UserDetailResponse</code>: <code>id</code>, <code>name</code>, the class name only (<code>lop.ten</code>, not the lecturer's email), a computed label <code>"An (SE1801)"</code>, and <code>role</code> visible only to admins.</p>
<details><summary>Show solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Nested allow-lists need <code>@Type(() =&gt; LopResponse)</code>; without it the whole <code>lop</code> object would pass. <code>groups</code> let one DTO serve two audiences; a getter with <code>@Expose()</code> adds computed fields. If audiences differ a lot, separate DTOs are clearer than many groups.</p>
</details>

<h3>💼 On the job</h3>
<p>Security testers at customer acceptance (and bug-bounty hunters) open the browser's Network tab first: what does the API return that the screen does not show? In review, flag any controller that returns a repository result directly. A cheap guard: an e2e test that asserts the exact key list of each response (Lab 4.5 does that), so a new column cannot leak silently.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">PartialType / PickType / OmitType</span><span class="v">Derive DTOs from one class, keeping validation rules (and docs, in the swagger version).</span></div>
  <div class="kv"><span class="k">ClassSerializerInterceptor</span><span class="v">Runs instanceToPlain on responses; only class instances are affected.</span></div>
  <div class="kv"><span class="k">@Exclude / @Expose</span><span class="v">Hide / show a property; @Exclude on the class + @Expose per field = allow-list.</span></div>
  <div class="kv"><span class="k">@SerializeOptions({ type })</span><span class="v">Converts plain return values into the given response class before serializing.</span></div>
  <div class="kv"><span class="k">API3:2023</span><span class="v">OWASP: broken authorization at property level — returning or accepting fields the caller may not see/set.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Write the create DTO once; derive update/login DTOs with mapped types.</li>
<li><code>@Exclude</code> on an entity protects nothing when the ORM returns plain objects — and a cast does not change that.</li>
<li>Deny-lists fail open on new columns and nested objects; allow-list with a response DTO.</li>
<li>Use <code>@SerializeOptions({ type })</code> (or <code>plainToInstance</code>) per route; one DTO per audience.</li>
<li>Hidden in the UI ≠ protected: the server decides per field (Peloton 2021).</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>4.3 — Một nguồn cho dữ liệu vào, danh sách cho phép cho dữ liệu ra</h2>
<p class="lead">Hai vấn đề, một bài. Chiều vào: bạn cần DTO tạo mới, DTO sửa với mọi trường không bắt buộc, DTO đăng nhập có hai trường — mà không chép luật ba lần. Chiều ra: bản ghi đọc từ cơ sở dữ liệu có những trường client không bao giờ được thấy (<code>passwordHash</code>, token đặt lại mật khẩu, ghi chú nội bộ). Mapped types giải vấn đề thứ nhất; DTO trả về giải vấn đề thứ hai — còn lối tắt <code>@Exclude()</code> phổ biến thì hỏng theo cách ta sẽ tái hiện ngay.</p>

<h3>Liên hệ đời thường: bệnh án và giấy nghỉ ốm</h3>
<p>Phòng khám giữ toàn bộ bệnh án của bạn. Khi công ty cần bằng chứng, phòng khám không đưa bệnh án đã bôi đen vài dòng — lỡ quên một dòng thì sao. Họ viết một tờ giấy nghỉ ốm riêng chỉ có ngày và chữ ký. Bôi đen là danh sách chặn (<code>@Exclude</code>); tờ giấy là danh sách cho phép (DTO trả về).</p>

<h3>Thí nghiệm — DTO dẫn xuất và năm cách trả về một người dùng</h3>
<pre><code class="language-ts">${esc(MA_43)}</code></pre>
<div class="out">${esc(OUT_43)}</div>

<h4>1. Mapped types giữ nguyên luật</h4>
<p><code>UpdateUserDto = PartialType(OmitType(CreateUserDto, ['password', 'role']))</code>: <code>name</code> và <code>email</code> thành không bắt buộc nhưng vẫn bị kiểm (<code>"B"</code> trượt <code>Length(2, 50)</code>), còn <code>role</code> không còn tồn tại nên <code>forbidNonWhitelisted</code> từ chối. <code>LoginDto = PickType(…, ['email', 'password'])</code> bắt buộc mật khẩu với đúng luật 12 ký tự. Một nguồn sự thật; đổi luật một chỗ. Khi đã thêm OpenAPI (Bài 4.4), nhập các hàm này từ <code>@nestjs/swagger</code> thay vì <code>@nestjs/mapped-types</code> — bản của swagger chép cả phần tài liệu.</p>

<h4>2. Trả thẳng bản ghi là lộ tất cả</h4>
<p><code>/users/thang</code> gửi đi <code>passwordHash</code>, <code>resetToken</code> và email giảng viên nằm trong <code>lop</code>. Token đặt lại mật khẩu nằm trong phản hồi là chiếm tài khoản: ai đọc được thì đặt được mật khẩu mới.</p>

<h4>3. <code>@Exclude()</code> trên entity vô tác dụng với object thường</h4>
<p><code>/users/entity-thuong</code> ép kiểu bản ghi <code>as UserEntity</code> — và lộ y hệt. <code>ClassSerializerInterceptor</code> chạy <code>instanceToPlain</code>, hàm này chỉ áp decorator lên <strong>instance của class</strong>. Prisma, driver MongoDB, <code>JSON.parse</code> và đa số query builder trả về object thường, còn ép kiểu TypeScript không đổi gì lúc chạy. Đây là cách phổ biến nhất khiến lời khuyên "cứ thêm @Exclude" thất bại trong dự án thật.</p>

<h4>4. Instance thật ẩn được hai trường — vẫn lộ trường thứ ba</h4>
<p><code>/users/entity</code> dựng <code>new UserEntity(row)</code>: <code>passwordHash</code> và <code>resetToken</code> đã mất. Nhưng <code>lop.giangVienEmail</code> vẫn còn: object lồng là object thường, và không ai liệt kê nó. Danh sách chặn hỏng theo kiểu "mở cửa" — mỗi cột mới thêm vào bảng (<code>phone</code>, <code>dateOfBirth</code>) đều công khai cho tới khi có người nhớ ra mà chặn.</p>

<h4>5. Danh sách cho phép: DTO trả về</h4>
<p><code>UserResponse</code> đặt <code>@Exclude()</code> ở mức class và <code>@Expose()</code> từng trường. <code>plainToInstance(UserResponse, row)</code> hoặc gọn hơn, <code>@SerializeOptions({ type: UserResponse })</code> trên route, biến mọi bản ghi thường thành đúng <code>{ id, name, email }</code>. Cột mới mặc định là riêng tư. Kiểu trả về của handler khi đó ghi lại hợp đồng, và Bài 4.4 biến nó thành OpenAPI.</p>

<h3>🕵️ Sự cố thật — Peloton, tháng 5/2021</h3>
<p>Ngày 05/05/2021, TechCrunch đăng nghiên cứu của Jan Masters (Pen Test Partners) về API của Peloton. Từng bước: (1) ứng dụng Peloton cho người dùng đặt hồ sơ ở chế độ <em>riêng tư</em>, khi đó ứng dụng ẩn tuổi, giới tính, thành phố, cân nặng và số liệu tập luyện; (2) các endpoint API phía sau vẫn trả về những trường đó — và gọi được mà không cần đăng nhập; (3) vì vậy ai cũng thu thập được dữ liệu hồ sơ riêng tư của người tập, kể cả tài khoản đã đặt riêng tư. Peloton sửa sau khi được báo; các bài báo không xác nhận dữ liệu đã bị lạm dụng hay chưa. Bài học cho chương này: <strong>ẩn một trường trên giao diện không phải là kiểm soát truy cập</strong>. Máy chủ quyết định thứ gì được đi ra, từng trường một — OWASP gọi là API3:2023, Broken Object Property Level Authorization. Mỗi đối tượng xem (sinh viên, giảng viên, admin) một DTO trả về là cách hiện thực quyết định đó trong Nest.</p>

<h3>🧪 Bài tập (20 phút) — phản hồi chi tiết có lồng và có vai trò</h3>
<p>Viết <code>UserDetailResponse</code>: <code>id</code>, <code>name</code>, chỉ tên lớp (<code>lop.ten</code>, không có email giảng viên), một nhãn tính sẵn <code>"An (SE1801)"</code>, và <code>role</code> chỉ hiện với admin.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Danh sách cho phép lồng nhau cần <code>@Type(() =&gt; LopResponse)</code>; thiếu nó cả object <code>lop</code> sẽ lọt qua. <code>groups</code> cho một DTO phục vụ hai đối tượng; getter có <code>@Expose()</code> thêm trường tính sẵn. Nếu các đối tượng khác nhau nhiều, tách DTO riêng sẽ rõ hơn là dùng nhiều nhóm.</p>
</details>

<h3>💼 Tình huống đi làm</h3>
<p>Người kiểm thử bảo mật lúc khách hàng nghiệm thu (và thợ săn bug bounty) mở tab Network của trình duyệt đầu tiên: API trả gì mà màn hình không hiện? Khi review, đánh dấu mọi controller trả thẳng kết quả của repository. Cách chặn rẻ: một test e2e khẳng định đúng danh sách khoá của từng phản hồi (Lab 4.5 làm vậy), để cột mới không thể lộ âm thầm.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">PartialType / PickType / OmitType</span><span class="v">Dẫn xuất DTO từ một class, giữ luật kiểm (và tài liệu, ở bản swagger).</span></div>
  <div class="kv"><span class="k">ClassSerializerInterceptor</span><span class="v">Chạy instanceToPlain trên phản hồi; chỉ có tác dụng với instance của class.</span></div>
  <div class="kv"><span class="k">@Exclude / @Expose</span><span class="v">Ẩn / hiện một thuộc tính; @Exclude ở class + @Expose từng trường = danh sách cho phép.</span></div>
  <div class="kv"><span class="k">@SerializeOptions({ type })</span><span class="v">Đổi giá trị trả về thường thành class phản hồi đã chỉ định trước khi tuần tự hoá.</span></div>
  <div class="kv"><span class="k">API3:2023</span><span class="v">OWASP: phân quyền hỏng ở mức thuộc tính — trả ra hoặc nhận vào trường người gọi không được xem/đặt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Viết DTO tạo mới một lần; dẫn xuất DTO sửa/đăng nhập bằng mapped types.</li>
<li><code>@Exclude</code> trên entity không bảo vệ gì khi ORM trả object thường — và ép kiểu không đổi được điều đó.</li>
<li>Danh sách chặn "mở cửa" với cột mới và object lồng; dùng danh sách cho phép bằng DTO trả về.</li>
<li>Dùng <code>@SerializeOptions({ type })</code> (hoặc <code>plainToInstance</code>) theo từng route; mỗi đối tượng xem một DTO.</li>
<li>Ẩn trên giao diện ≠ được bảo vệ: máy chủ quyết định từng trường (Peloton 2021).</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
