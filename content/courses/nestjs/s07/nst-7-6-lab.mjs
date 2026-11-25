/**
 * 7.6 — Lab: Sinh viên, giảng viên, admin — ai được làm gì (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Nest 12.6.0, @nestjs/jwt 12.0.5, @casl/ability 7.1.3, Vitest 4.1.12 + supertest): scratchpad/nst/lab/c7/app/src/lab76 —
 * 33 test xanh (8 thao tác × 4 người + token giả); thử phá PHA=quen ⇒ 1 đỏ (admin 403 vì mặc định đóng), PHA=mo ⇒ 2 đỏ (sv/gv đọc báo cáo).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'authentication', bai: 'auth-9-7-lab-can', title: 'Authentication Lab 9 — Cổng phân quyền duy nhất', sub: 'Cùng ý tưởng một cổng cho mọi phép kiểm, viết không cần framework.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-0-8-bat-dau-tai-day', title: 'Testing — Bắt đầu tại đây', sub: 'Test bảng (table-driven) và vì sao test phải đỏ được.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'OWASP — Authorization Testing Automation Cheat Sheet', 'Ý tưởng ma trận quyền: liệt kê vai trò × tài nguyên, test tự động từng ô.', 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html'),
].join('\n');
const MA_APP = "type Perm = 'room:read' | 'room:write' | 'booking:create' | 'report:read';\nconst QUYEN: Record<User['role'], Perm[]> = {\n  student: ['room:read', 'booking:create'],\n  lecturer: ['room:read', 'booking:create'],\n  admin: ['room:read', 'room:write', 'booking:create', 'report:read'],\n};\nexport const Public = Reflector.createDecorator<boolean>({ transform: () => true });\nexport const CanPerm = Reflector.createDecorator<Perm>();\nexport const DuocDung = Reflector.createDecorator<boolean>({ transform: () => true });   // \"mọi người đã đăng nhập\" — phải khai rõ\nconst CurrentUser = createParamDecorator((_: unknown, c: ExecutionContext): User => c.switchToHttp().getRequest().user);\n\n@Injectable()\nclass JwtAuthGuard implements CanActivate {\n  constructor(private readonly jwt: JwtService, private readonly reflector: Reflector) {}\n  async canActivate(ctx: ExecutionContext) {\n    if (this.reflector.getAllAndOverride(Public, [ctx.getHandler(), ctx.getClass()])) return true;\n    const req = ctx.switchToHttp().getRequest();\n    const token = /^Bearer (.+)$/.exec(req.headers.authorization ?? '')?.[1];\n    const p = token && (await this.jwt.verifyAsync(token).catch(() => null));\n    if (!p) throw new UnauthorizedException();\n    req.user = { id: Number(p.sub), role: p.role };\n    return true;\n  }\n}\n@Injectable()\nclass PermGuard implements CanActivate {\n  constructor(private readonly reflector: Reflector) {}\n  canActivate(ctx: ExecutionContext) {\n    const dich = [ctx.getHandler(), ctx.getClass()];\n    if (this.reflector.getAllAndOverride(Public, dich) || this.reflector.getAllAndOverride(DuocDung, dich)) return true;\n    const perm = this.reflector.getAllAndOverride(CanPerm, dich);\n    if (!perm && process.env.PHA === 'mo') return true;                    // thử phá: mặc định MỞ\n    if (!perm) throw new ForbiddenException('Route chưa khai quyền');          // mặc định ĐÓNG\n    const u: User = ctx.switchToHttp().getRequest().user;\n    if (!QUYEN[u.role].includes(perm)) throw new ForbiddenException();\n    return true;\n  }\n}";
const MA_CTRL = "@Controller()\nclass AppController {\n  constructor(private readonly s: Store) {}\n  private bk(u: User, id: number, act: 'read' | 'cancel' | 'approve') {\n    const b = this.s.bookings.find((x) => x.id === id);\n    const a = abilityFor(u);\n    if (!b || !a.can('read', subject('Booking', b))) throw new NotFoundException();\n    if (!a.can(act, subject('Booking', b))) throw new ForbiddenException();\n    return b;\n  }\n  @Get('rooms') @Public() rooms() { return this.s.rooms; }\n  @Post('rooms') @CanPerm('room:write') taoPhong(@Body() b: { code: string }) { const r = { id: this.s.rooms.length + 1, code: b.code }; this.s.rooms.push(r); return r; }\n  @Delete('rooms/:id') @HttpCode(204) @CanPerm('room:write') xoaPhong(@Param('id', ParseIntPipe) id: number) { this.s.rooms = this.s.rooms.filter((r) => r.id !== id); }\n  @Post('bookings') @CanPerm('booking:create') dat(@CurrentUser() u: User, @Body() b: { roomId: number }) {\n    const x: Booking = { id: 200 + this.s.bookings.length, ownerId: u.id, roomId: b.roomId, status: 'PENDING', phone: '-' }; this.s.bookings.push(x); return x;\n  }\n  @Get('bookings/:id') @DuocDung() xem(@CurrentUser() u: User, @Param('id', ParseIntPipe) id: number) { return this.bk(u, id, 'read'); }\n  @Delete('bookings/:id') @DuocDung() huy(@CurrentUser() u: User, @Param('id', ParseIntPipe) id: number) { const b = this.bk(u, id, 'cancel'); b.status = 'CANCELLED'; return b; }\n  @Patch('bookings/:id/approve') @DuocDung() duyet(@CurrentUser() u: User, @Param('id', ParseIntPipe) id: number) { const b = this.bk(u, id, 'approve'); b.status = 'APPROVED'; return b; }\n  @Get('reports/usage') @QuyenBaoCao bao() { return { dat: this.s.bookings.length }; }\n}";
const MA_SPEC = "import { Test } from '@nestjs/testing';\nimport type { INestApplication } from '@nestjs/common';\nimport { JwtService } from '@nestjs/jwt';\nimport request from 'supertest';\nimport { AppModule, Store } from './app.module.js';\n\n// ô = mã HTTP mong đợi. sv = sinh viên #3, gv = giảng viên #20 (quản lý phòng 1), ad = admin #1, an = không token\nconst MA_TRAN: [string, string, string, { an: number; sv: number; gv: number; ad: number }][] = [\n  ['xem danh sách phòng', 'GET', '/rooms', { an: 200, sv: 200, gv: 200, ad: 200 }],\n  ['tạo phòng', 'POST', '/rooms', { an: 401, sv: 403, gv: 403, ad: 201 }],\n  ['xoá phòng', 'DELETE', '/rooms/2', { an: 401, sv: 403, gv: 403, ad: 204 }],\n  ['đặt lịch', 'POST', '/bookings', { an: 401, sv: 201, gv: 201, ad: 201 }],\n  ['xem lịch của người khác (#102, phòng 1)', 'GET', '/bookings/102', { an: 401, sv: 404, gv: 200, ad: 200 }],\n  ['huỷ lịch của chính sinh viên (#101)', 'DELETE', '/bookings/101', { an: 401, sv: 200, gv: 403, ad: 200 }],\n  ['duyệt lịch phòng 2 (#103)', 'PATCH', '/bookings/103/approve', { an: 401, sv: 404, gv: 404, ad: 200 }],\n  ['xem báo cáo', 'GET', '/reports/usage', { an: 401, sv: 403, gv: 403, ad: 200 }],\n];\nconst AI = { sv: { sub: '3', role: 'student' }, gv: { sub: '20', role: 'lecturer' }, ad: { sub: '1', role: 'admin' } } as const;\n\nlet app: INestApplication; let token: Record<string, string>;\nbeforeAll(async () => {\n  const m = await Test.createTestingModule({ imports: [AppModule] }).compile();\n  app = m.createNestApplication(); await app.init();\n  const jwt = app.get(JwtService);\n  token = Object.fromEntries(Object.entries(AI).map(([k, p]) => [k, jwt.sign(p)]));\n});\nafterAll(() => app.close());\nbeforeEach(() => app.get(Store).reset());\n\nconst O = MA_TRAN.flatMap(([ten, m, u, mong]) => (['an', 'sv', 'gv', 'ad'] as const).map((ai) => [`${ai} · ${ten} → ${mong[ai]}`, m, u, ai, mong[ai]] as const));\nit.each(O)('%s', async (_, m, u, ai, ma) => {\n  let r = request(app.getHttpServer())[m.toLowerCase() as 'get'](u);\n  if (ai !== 'an') r = r.set('authorization', `Bearer ${token[ai]}`);\n  if (m === 'POST') r = r.send({ code: 'AL-301', roomId: 1 });\n  expect((await r).status).toBe(ma);\n});\n\nit('token giả chữ ký với role admin bị từ chối', async () => {\n  const [h, , s] = token.sv.split('.');\n  const p = Buffer.from(JSON.stringify({ sub: '3', role: 'admin' })).toString('base64url');\n  expect((await request(app.getHttpServer()).get('/reports/usage').set('authorization', `Bearer ${h}.${p}.${s}`)).status).toBe(401);\n});";
const OUT_TEST = "$ npx vitest run src/lab76\n RUN  v4.1.12 /home/sv/app\n Test Files  1 passed (1)\n      Tests  33 passed (33)\n   Start at  07:24:51\n   Duration  1.02s (transform 98ms, setup 0ms, import 506ms, tests 246ms, environment 0ms)";
const OUT_PHA = "$ PHA=quen npx vitest run src/lab76\n      Tests  1 failed | 32 passed (33)\n   × ad · xem báo cáo → 200 10ms\n$ PHA=mo npx vitest run src/lab76\n      Tests  2 failed | 31 passed (33)\n   × gv · xem báo cáo → 403 2ms\n   × sv · xem báo cáo → 403 9ms";

export default {
  title: '7.6 — Lab: Students, lecturers, admins — who may do what|||7.6 — Lab: Sinh viên, giảng viên, admin — ai được làm gì',
  slug: 'nst-7-6-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab gộp cả chương: JWT thật, hai guard toàn cục mặc định đóng, quyền theo vai trò và luật CASL theo chủ lịch. Bạn viết ma trận 8 thao tác × 4 người (khách, sinh viên, giảng viên quản lý phòng, admin) thành 33 test e2e, rồi thử phá: quên khai quyền một route thì đúng 1 ô đỏ, đổi guard sang mặc định mở thì đúng 2 ô đỏ — sinh viên và giảng viên đọc được báo cáo.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lab</span>
<h2>7.6 — An authorization matrix, every cell a test</h2>
<p class="lead">Authorization bugs hide in the cells nobody tests: "lecturer, someone else's booking", "student, report". In this lab you write the access rules of a small booking API as a <strong>matrix</strong> — rows are actions, columns are callers — and turn every cell into an e2e test. Then you break the app on purpose and check that exactly the right cells go red.</p>

<h3>Goal and pass criteria</h3>
<ul>
<li>A Nest app with <code>JwtAuthGuard</code> + <code>PermGuard</code> as global guards (authentication first), <code>@Public</code>, <code>@CanPerm</code>, <code>@DuocDung</code> ("any logged-in user; the service decides"), and the CASL policy from lesson 7.4 for bookings.</li>
<li>Routes without any declaration answer 403 — closed by default.</li>
<li><strong>Pass</strong>: 33 green tests (8 actions × 4 callers + one forged token), and both sabotage runs fail on exactly the expected cells.</li>
</ul>

<h3>The matrix (write it before the code)</h3>
<table>
<tr><th>Action</th><th>anonymous</th><th>student #3</th><th>lecturer #20 (manages room 1)</th><th>admin</th></tr>
<tr><td>GET /rooms</td><td>200</td><td>200</td><td>200</td><td>200</td></tr>
<tr><td>POST /rooms</td><td>401</td><td>403</td><td>403</td><td>201</td></tr>
<tr><td>DELETE /rooms/2</td><td>401</td><td>403</td><td>403</td><td>204</td></tr>
<tr><td>POST /bookings</td><td>401</td><td>201</td><td>201</td><td>201</td></tr>
<tr><td>GET /bookings/102 (another student's, room 1)</td><td>401</td><td>404</td><td>200</td><td>200</td></tr>
<tr><td>DELETE /bookings/101 (the student's own)</td><td>401</td><td>200</td><td>403</td><td>200</td></tr>
<tr><td>PATCH /bookings/103/approve (room 2)</td><td>401</td><td>404</td><td>404</td><td>200</td></tr>
<tr><td>GET /reports/usage</td><td>401</td><td>403</td><td>403</td><td>200</td></tr>
</table>
<p>Look at the cells that need thought: the lecturer may <em>see</em> booking 102 in their room but may not <em>cancel</em> the student's booking 101 (403, not 404 — they can see it); booking 103 is in a room the lecturer does not manage, so it does not exist for them (404).</p>

<h3>Step 1 — the app</h3>
<p>Reuse <code>policy.ts</code> from lesson 7.4 (<code>abilityFor</code>) and the guards from 7.3, with a third marker:</p>
<pre><code class="language-ts">${esc(MA_APP)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTRL)}</code></pre>

<h3>Step 2 — the matrix as tests</h3>
<p>Write the test yourself first. Requirements: one <code>it</code> per cell with a readable name; a fresh data set before each test (cancelling 101 must not affect the next cell); real tokens signed by the app's <code>JwtService</code>; one extra test with a forged admin payload.</p>
<details><summary>Show the test</summary>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">${esc(OUT_TEST)}</div>
<p>33 tests in about 0.25 s. The matrix in the test file is the same table as above — reviewers read the table, not the assertions.</p>
</details>

<h3>Step 3 — break it on purpose</h3>
<p>A test suite that cannot fail proves nothing. Two sabotages, controlled by an environment variable in <code>app.module.ts</code>:</p>
<ol>
<li><code>PHA=quen</code> — someone "forgets" <code>@CanPerm('report:read')</code> on <code>GET /reports/usage</code>.</li>
<li><code>PHA=mo</code> — the same, plus someone changes <code>PermGuard</code> to "no declaration ⇒ allow".</li>
</ol>
<p>Predict which cells go red before you run them.</p>
<details><summary>Show the results</summary>
<div class="out">${esc(OUT_PHA)}</div>
<p><strong>Forgotten declaration, closed by default</strong>: only the admin cell fails — the route became 403 for everybody. Annoying, visible, safe. <strong>Forgotten declaration, open by default</strong>: the admin cell passes, but students and lecturers now read the report — two red cells, and in production nobody would notice because nothing errors. This is the strongest argument for closed-by-default: a mistake costs a bug report instead of a data leak.</p>
</details>

<h3>Extension (optional)</h3>
<ul>
<li>Add a fifth column "lecturer #21 (manages room 2)" — how many cells change?</li>
<li>Add the action "reject a booking" with the same rules as approve, test first.</li>
<li>Add the forged-token variants from lesson 7.1 (alg none, expired, other audience) as more rows.</li>
</ul>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>How do you test authorization?</strong> Write the role × action matrix and generate one e2e test per cell, including negative cells; reset data per test.</li>
<li><strong>Why test negative cases explicitly?</strong> Positive tests pass for an app that allows everything; only "should be refused" tests catch missing checks.</li>
<li><strong>Closed or open by default?</strong> Closed: a forgotten rule becomes a visible 403 instead of a silent leak — shown here as 1 red cell versus 2 leaking cells.</li>
<li><strong>How do you get tokens in e2e tests?</strong> Sign them with the app's own <code>JwtService</code> (same secret and options), or call the real login endpoint for a few tests that cover login itself.</li>
<li><strong>Why can a lecturer get 403 on one booking and 404 on another?</strong> 404 when the policy says they may not see it; 403 when they may see it but not perform this action.</li>
</ol>

<h3>💼 On the job</h3>
<p>Attach the matrix table to the pull request description. Business analysts and the client's QA can review it without reading TypeScript, and when the client says "lecturers should also cancel bookings in their rooms", the change is one cell in the table, one line in the policy, and one test that turns from red to green.</p>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Lab</span>
<h2>7.6 — Một ma trận phân quyền, mỗi ô một test</h2>
<p class="lead">Lỗi phân quyền trốn trong những ô không ai test: "giảng viên, lịch của người khác", "sinh viên, báo cáo". Trong lab này bạn viết luật truy cập của một API đặt lịch nhỏ thành một <strong>ma trận</strong> — hàng là thao tác, cột là người gọi — và biến mỗi ô thành một test e2e. Rồi bạn cố tình phá ứng dụng và kiểm rằng đúng những ô cần đỏ thì đỏ.</p>

<h3>Mục tiêu và tiêu chí đạt</h3>
<ul>
<li>Một ứng dụng Nest với <code>JwtAuthGuard</code> + <code>PermGuard</code> làm guard toàn cục (xác thực đứng trước), <code>@Public</code>, <code>@CanPerm</code>, <code>@DuocDung</code> ("ai đăng nhập cũng được; service quyết định"), và policy CASL của bài 7.4 cho lịch đặt.</li>
<li>Route không khai gì trả 403 — mặc định đóng.</li>
<li><strong>Đạt</strong>: 33 test xanh (8 thao tác × 4 người + một token giả), và cả hai lần phá đều đỏ đúng những ô dự đoán.</li>
</ul>

<h3>Ma trận (viết trước khi viết mã)</h3>
<table>
<tr><th>Thao tác</th><th>khách (không token)</th><th>sinh viên #3</th><th>giảng viên #20 (quản lý phòng 1)</th><th>admin</th></tr>
<tr><td>GET /rooms</td><td>200</td><td>200</td><td>200</td><td>200</td></tr>
<tr><td>POST /rooms</td><td>401</td><td>403</td><td>403</td><td>201</td></tr>
<tr><td>DELETE /rooms/2</td><td>401</td><td>403</td><td>403</td><td>204</td></tr>
<tr><td>POST /bookings</td><td>401</td><td>201</td><td>201</td><td>201</td></tr>
<tr><td>GET /bookings/102 (của sinh viên khác, phòng 1)</td><td>401</td><td>404</td><td>200</td><td>200</td></tr>
<tr><td>DELETE /bookings/101 (của chính sinh viên)</td><td>401</td><td>200</td><td>403</td><td>200</td></tr>
<tr><td>PATCH /bookings/103/approve (phòng 2)</td><td>401</td><td>404</td><td>404</td><td>200</td></tr>
<tr><td>GET /reports/usage</td><td>401</td><td>403</td><td>403</td><td>200</td></tr>
</table>
<p>Nhìn những ô cần suy nghĩ: giảng viên được <em>xem</em> lịch 102 trong phòng mình nhưng không được <em>huỷ</em> lịch 101 của sinh viên (403, không phải 404 — họ thấy được nó); lịch 103 ở phòng giảng viên không quản lý, nên với họ nó không tồn tại (404).</p>

<h3>Bước 1 — ứng dụng</h3>
<p>Dùng lại <code>policy.ts</code> của bài 7.4 (<code>abilityFor</code>) và các guard của bài 7.3, thêm một dấu thứ ba:</p>
<pre><code class="language-ts">${esc(MA_APP)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTRL)}</code></pre>

<h3>Bước 2 — ma trận thành test</h3>
<p>Tự viết test trước. Yêu cầu: mỗi ô một <code>it</code> với tên dễ đọc; bộ dữ liệu mới trước mỗi test (huỷ 101 không được ảnh hưởng ô tiếp theo); token thật ký bằng <code>JwtService</code> của chính ứng dụng; thêm một test với payload admin giả.</p>
<details><summary>Xem test</summary>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">${esc(OUT_TEST)}</div>
<p>33 test trong khoảng 0,25 giây. Ma trận trong tệp test chính là bảng ở trên — người review đọc bảng, không đọc từng câu kiểm.</p>
</details>

<h3>Bước 3 — cố tình phá</h3>
<p>Một bộ test không thể đỏ thì không chứng minh được gì. Hai kiểu phá, bật bằng biến môi trường trong <code>app.module.ts</code>:</p>
<ol>
<li><code>PHA=quen</code> — ai đó "quên" <code>@CanPerm('report:read')</code> ở <code>GET /reports/usage</code>.</li>
<li><code>PHA=mo</code> — như trên, cộng thêm ai đó sửa <code>PermGuard</code> thành "không khai ⇒ cho qua".</li>
</ol>
<p>Đoán trước ô nào sẽ đỏ rồi mới chạy.</p>
<details><summary>Xem kết quả</summary>
<div class="out">${esc(OUT_PHA)}</div>
<p><strong>Quên khai, mặc định đóng</strong>: chỉ ô admin đỏ — route thành 403 với tất cả. Phiền, dễ thấy, an toàn. <strong>Quên khai, mặc định mở</strong>: ô admin vẫn xanh, nhưng sinh viên và giảng viên đọc được báo cáo — hai ô đỏ, và trên production không ai nhận ra vì chẳng có lỗi nào hiện lên. Đây là lý lẽ mạnh nhất cho mặc định đóng: một sai sót tốn một báo cáo lỗi thay vì một vụ lộ dữ liệu.</p>
</details>

<h3>Mở rộng (không bắt buộc)</h3>
<ul>
<li>Thêm cột thứ năm "giảng viên #21 (quản lý phòng 2)" — bao nhiêu ô thay đổi?</li>
<li>Thêm thao tác "từ chối lịch" với cùng luật như duyệt, viết test trước.</li>
<li>Thêm các biến thể token giả của bài 7.1 (alg none, hết hạn, audience khác) thành các hàng mới.</li>
</ul>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Test phân quyền thế nào?</strong> Viết ma trận vai trò × thao tác và sinh mỗi ô một test e2e, kể cả ô bị từ chối; làm mới dữ liệu cho từng test.</li>
<li><strong>Vì sao phải test rõ các ca bị từ chối?</strong> Test ca được phép vẫn xanh với một ứng dụng cho phép tất cả; chỉ test "phải bị từ chối" mới bắt được phép kiểm bị thiếu.</li>
<li><strong>Mặc định đóng hay mở?</strong> Đóng: quên một luật thành 403 dễ thấy thay vì rò rỉ âm thầm — ở đây là 1 ô đỏ so với 2 ô rò.</li>
<li><strong>Lấy token trong test e2e ở đâu?</strong> Ký bằng chính <code>JwtService</code> của ứng dụng (cùng khoá, cùng tuỳ chọn), hoặc gọi endpoint đăng nhập thật cho vài test về chính việc đăng nhập.</li>
<li><strong>Vì sao giảng viên nhận 403 ở lịch này mà 404 ở lịch kia?</strong> 404 khi policy nói họ không được thấy; 403 khi được thấy nhưng không được làm thao tác này.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Đính bảng ma trận vào mô tả pull request. BA và QA của khách hàng review được mà không cần đọc TypeScript, và khi khách nói "giảng viên cũng được huỷ lịch trong phòng của mình", thay đổi là một ô trong bảng, một dòng trong policy, và một test chuyển từ đỏ sang xanh.</p>
${THE}
${NGUON}
</div>
`,
};
