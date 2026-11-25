/**
 * 7.3 — Xác thực toàn cục với @Public(), vai trò với @Roles() và RolesGuard (khoá nestjs, soạn 24/11/2026). Cơ chế guard/APP_GUARD/@Public
 * đã dạy ở 3.4 ⇒ bài này nối với JWT thật, quyền thay vai trò, thứ tự guard, vai trò cũ trong token.
 * Output THẬT (máy nhà, Nest 12.6.0, @nestjs/jwt 12.0.5): scratchpad/nst/lab/c7/app/src/b73/rbac.ts (8 request; THU_TU=nguoc ⇒ 7×500
 * TypeError; KICH=ha-vai-tro: token cũ vẫn duyệt được 200, VAI_TRO=csdl ⇒ 401 "Phiên đã bị thu hồi"), bt.ts (DiscoveryService chặn khởi động
 * khi route chưa khai quyền, exit 1). Sự cố: Block/Cash App (nhân viên cũ tải báo cáo 10/12/2021, 8,2 triệu khách) — TechCrunch 05/04/2022.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-3-4-guard', title: 'NestJS 3.4 — Guard', sub: 'APP_GUARD, Reflector.createDecorator, @Public + @Roles và lỗi gắn ở class.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-3-6-thu-tu', title: 'NestJS 3.6 — Thứ tự dây chuyền', sub: 'Guard toàn cục, controller, route chạy theo thứ tự nào.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-9-2-rbac', title: 'Authentication 9.2 — RBAC', sub: 'Vai trò, quyền, và cái boolean thành bốn mươi cái.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-9-5-dat-phep-kiem-o-dau', title: 'Authentication 9.5 — Phép kiểm nằm ở đâu', sub: 'Làm sao để KHÔNG THỂ quên kiểm quyền.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS docs — Authorization', 'RolesGuard, Reflector, gợi ý CASL.', 'https://docs.nestjs.com/security/authorization'),
  nguon('🕵️', 'TechCrunch — Block confirms Cash App breach after former employee accessed US customer data (05/04/2022)', 'Nhân viên đã nghỉ vẫn tải được báo cáo ngày 10/12/2021; ~8,2 triệu khách được thông báo.', 'https://techcrunch.com/2022/04/05/block-cash-app-data-breach/'),
].join('\n');
const MA_DEC = "export const Public = Reflector.createDecorator<boolean>({ transform: () => true });\nexport const Roles = Reflector.createDecorator<Role[]>();\nexport const CanPerm = Reflector.createDecorator<Perm>();\nexport const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): NguoiDung => ctx.switchToHttp().getRequest().user);\n\n// một chỗ duy nhất nói vai trò nào có quyền gì\nconst QUYEN: Record<Role, Perm[]> = {\n  student: ['room:read'],\n  lecturer: ['room:read', 'booking:approve'],\n  admin: ['room:read', 'room:delete', 'booking:approve', 'report:read'],\n};";
const MA_JWT = "@Injectable()\nclass JwtAuthGuard implements CanActivate {\n  constructor(private readonly jwt: JwtService, private readonly reflector: Reflector, private readonly users: UsersRepo) {}\n  async canActivate(ctx: ExecutionContext) {\n    if (this.reflector.getAllAndOverride(Public, [ctx.getHandler(), ctx.getClass()])) return true;\n    const req = ctx.switchToHttp().getRequest();\n    const token = /^Bearer (.+)$/.exec(req.headers.authorization ?? '')?.[1];\n    const p = token && (await this.jwt.verifyAsync(token).catch(() => null));\n    if (!p) throw new UnauthorizedException();\n    const id = Number(p.sub);\n    if (process.env.VAI_TRO === 'csdl') {                       // cách sửa A: đọc vai trò HIỆN TẠI từ DB mỗi request\n      const u = this.users.ds.get(id);\n      if (!u || u.tokenVersion !== p.ver) throw new UnauthorizedException('Phiên đã bị thu hồi');\n      req.user = { id, roles: u.roles };\n    } else req.user = { id, roles: p.roles };                    // mặc định: tin vai trò ghi trong token\n    return true;\n  }\n}";
const MA_ACC = "@Injectable()\nclass AccessGuard implements CanActivate {\n  constructor(private readonly reflector: Reflector) {}\n  canActivate(ctx: ExecutionContext) {\n    const dich = [ctx.getHandler(), ctx.getClass()];\n    if (this.reflector.getAllAndOverride(Public, dich)) return true;\n    const user: NguoiDung = ctx.switchToHttp().getRequest().user;\n    const roles = this.reflector.getAllAndOverride(Roles, dich);\n    const perm = this.reflector.getAllAndOverride(CanPerm, dich);\n    if (roles && !roles.some((r) => user.roles.includes(r))) throw new ForbiddenException(`Cần vai trò ${roles.join('/')}`);\n    if (perm && !user.roles.some((r) => QUYEN[r].includes(perm))) throw new ForbiddenException(`Cần quyền ${perm}`);\n    return true;\n  }\n}";
const MA_CTRL = "@Controller()\nclass AppController {\n  constructor(private readonly users: UsersRepo) {}\n  @Get('health') @Public() health() { return 'ok'; }\n  @Get('rooms') @CanPerm('room:read') rooms(@CurrentUser() u: NguoiDung) { return { xem: 'Lab 401, Lab 402', boi: u.id }; }\n  @Delete('rooms/:id') @CanPerm('room:delete') xoa(@Param('id', ParseIntPipe) id: number) { return { daXoa: id }; }\n  @Patch('bookings/:id/approve') @CanPerm('booking:approve') duyet(@Param('id', ParseIntPipe) id: number) { return { daDuyet: id }; }\n  @Get('reports') @Roles(['admin']) bao() { return { doanhThu: '12 800 000 đ' }; }\n  @Patch('admin/users/:id/demote') @Roles(['admin']) ha(@Param('id', ParseIntPipe) id: number) {\n    const u = this.users.ds.get(id)!; u.roles = ['student']; u.tokenVersion++;   // hạ vai trò + tăng phiên bản token\n    return { id, roles: u.roles };\n  }\n}";
const MA_MOD = "const THU_TU = process.env.THU_TU === 'nguoc' ? [AccessGuard, JwtAuthGuard] : [JwtAuthGuard, AccessGuard];\n@Module({\n  imports: [JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '15m' } })],\n  controllers: [AppController],\n  providers: [UsersRepo, ...THU_TU.map((g) => ({ provide: APP_GUARD, useClass: g }))],   // thứ tự trong mảng = thứ tự chạy\n})";
const OUT_RBAC = "$ node dist/b73/rbac.js\nGET /health                    -      → 200 ok\nGET /rooms                     -      → 401 {\"message\":\"Unauthorized\"}\nGET /rooms                     sv     → 200 {\"xem\":\"Lab 401, Lab 402\",\"boi\":3}\nDELETE /rooms/1                sv     → 403 {\"message\":\"Cần quyền room:delete\",\"error\":\"Forbidden\"}\nPATCH /bookings/5/approve      sv     → 403 {\"message\":\"Cần quyền booking:approve\",\"error\":\"Forbidden\"}\nPATCH /bookings/5/approve      gv     → 200 {\"daDuyet\":5}\nGET /reports                   gv     → 403 {\"message\":\"Cần vai trò admin\",\"error\":\"Forbidden\"}\nDELETE /rooms/1                admin  → 200 {\"daXoa\":1}";
const OUT_NGUOC = "$ THU_TU=nguoc node dist/b73/rbac.js   # AccessGuard đứng trước JwtAuthGuard\nGET /health                    -      → 200 ok\n[Nest] ERROR [ExceptionsHandler] TypeError: Cannot read properties of undefined (reading 'roles')\n    at AccessGuard.canActivate (file:///home/sv/app/dist/b73/rbac.js:79:27)\nGET /rooms                     -      → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}\nGET /rooms                     sv     → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}\nDELETE /rooms/1                sv     → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}\nPATCH /bookings/5/approve      sv     → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}\nPATCH /bookings/5/approve      gv     → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}\nGET /reports                   gv     → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}\nDELETE /rooms/1                admin  → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}\n(mỗi request 500 đều in cùng TypeError đó vào log — 7 lần)";
const OUT_HA = "$ KICH=ha-vai-tro node dist/b73/rbac.js\nPATCH /bookings/5/approve      gv     → 200 {\"daDuyet\":5}\nPATCH /admin/users/2/demote    admin  → 200 {\"id\":2,\"roles\":[\"student\"]}\nPATCH /bookings/6/approve      gv     → 200 {\"daDuyet\":6}\n$ KICH=ha-vai-tro VAI_TRO=csdl node dist/b73/rbac.js\nPATCH /bookings/5/approve      gv     → 200 {\"daDuyet\":5}\nPATCH /admin/users/2/demote    admin  → 200 {\"id\":2,\"roles\":[\"student\"]}\nPATCH /bookings/6/approve      gv     → 401 {\"message\":\"Phiên đã bị thu hồi\",\"error\":\"Unauthorized\"}";
const MA_BT = "@Injectable()\nclass KiemQuyenLucKhoiDong implements OnApplicationBootstrap {\n  constructor(private readonly disc: DiscoveryService, private readonly scan: MetadataScanner, private readonly reflector: Reflector) {}\n  onApplicationBootstrap() {\n    const thieu: string[] = [];\n    for (const w of this.disc.getControllers()) {\n      const proto = Object.getPrototypeOf(w.instance);\n      for (const ten of this.scan.getAllMethodNames(proto)) {\n        const h = proto[ten]; const dich = [h, w.metatype as Function];\n        if (Reflect.getMetadata(PATH_METADATA, h) === undefined) continue;                  // không phải route\n        const khai = [Public, Roles, CanPerm].some((d) => this.reflector.getAllAndOverride(d, dich) !== undefined);\n        if (!khai) thieu.push(`${w.name}.${ten}`);\n      }\n    }\n    if (thieu.length) throw new Error(`Route chưa khai quyền: ${thieu.join(', ')}`);\n    console.log('mọi route đã khai quyền');\n  }\n}";
const OUT_BT = "$ node dist/b73/bt.js; echo \"exit $?\"\nError: Route chưa khai quyền: ExportsController.csv\n    at KiemQuyenLucKhoiDong.onApplicationBootstrap (file:///home/sv/app/dist/b73/bt.js:44:19)\nexit 1\n$ SUA=1 node dist/b73/bt.js   # chỉ còn RoomsController (mọi route đã khai)\nmọi route đã khai quyền";

export default {
  title: '7.3 — Global auth with @Public(), roles with @Roles() and a RolesGuard|||7.3 — Xác thực toàn cục với @Public(), vai trò với @Roles() và RolesGuard',
  slug: 'nst-7-3-rbac',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Nối cơ chế guard của bài 3.4 với JWT thật: JwtAuthGuard + AccessGuard toàn cục, @CurrentUser(), và quyền (room:delete, booking:approve) thay vì rải tên vai trò khắp controller. Chạy thật: đảo thứ tự hai guard ⇒ mọi request 500 kể cả admin; admin hạ vai trò giảng viên nhưng token cũ vẫn duyệt lịch được 200 cho tới khi hết hạn — sửa bằng tokenVersion ⇒ 401 ngay; và một kiểm tra lúc khởi động từ chối chạy khi có route chưa khai quyền.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>7.3 — Who you are, then what you may do — in that order, everywhere</h2>
<p class="lead">Lesson 3.4 built the mechanism: a global guard via <code>APP_GUARD</code>, <code>@Public()</code> and <code>@Roles()</code> made with <code>Reflector.createDecorator</code>, and the bug of <code>@Public</code> on a method being overridden by <code>@Roles</code> on the class. That lesson used API keys. Here the user comes from a JWT, and three new problems appear: <strong>the two guards must run in a fixed order, roles copied into a token go stale, and nobody notices a route that declares nothing.</strong></p>

<h3>Everyday analogy: the ID card and the access list</h3>
<p>The security desk at a company first checks your staff card (authentication), then the access list of the floor you want (authorization). Swapping the two — reading the floor list before anyone has shown a card — means asking "what may <em>nobody</em> do?". And a card printed with "Manager" stays printed with "Manager" after you are demoted, until someone checks the HR system instead of the card.</p>

<h3>1. Decorators and one permission table</h3>
<pre><code class="language-ts">${esc(MA_DEC)}</code></pre>
<p>Controllers ask for a <strong>permission</strong> (<code>@CanPerm('booking:approve')</code>), not a role. Which roles hold it lives in one table, <code>QUYEN</code>. When the faculty decides "lecturers may also delete rooms", you edit one line, not every controller. <code>@Roles()</code> remains available for the rare case where the role itself is the rule (an admin-only screen).</p>

<h3>2. Two global guards</h3>
<pre><code class="language-ts">${esc(MA_JWT)}</code></pre>
<pre><code class="language-ts">${esc(MA_ACC)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTRL)}</code></pre>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<p>Global guards run in the order of the <code>providers</code> array. <code>@CurrentUser()</code> (a param decorator, lesson 3.6) hands the handler the user the first guard attached.</p>
<div class="out">${esc(OUT_RBAC)}</div>
<p>Each status has one meaning: <strong>401</strong> = we do not know who you are (no or bad token); <strong>403</strong> = we know, and you may not. The lecturer passes <code>booking:approve</code> but is refused the admin-only report; the admin passes everything.</p>

<h3>3. Trap 1 — the guards in the wrong order</h3>
<div class="out">${esc(OUT_NGUOC)}</div>
<p>With <code>AccessGuard</code> first, <code>req.user</code> does not exist yet: <code>user.roles</code> throws, every protected route is 500 — including the admin's — and only the public <code>/health</code> survives. Here it fails loudly, which is lucky. A "defensive" <code>user?.roles ?? []</code> would have turned it into a quiet 403 for everyone, and a guard written as <code>if (!user) return true</code> would have opened everything. Pin the order with a test (lab 7.6) and keep both guards in one place in <code>AppModule</code>.</p>

<h3>4. Trap 2 — the role in the token is a photograph</h3>
<p>Lecturer #2 logs in at 8:00 with a 15-minute token that says <code>roles: ["lecturer"]</code>. At 8:05 an admin demotes them. At 8:06 they reuse the old token:</p>
<div class="out">${esc(OUT_HA)}</div>
<p>By default the guard trusts the role written in the token, so the demoted user approves booking #6 with 200 — and would keep doing so for up to 15 minutes. With <code>VAI_TRO=csdl</code> the guard reads the <em>current</em> role and a <code>tokenVersion</code> from the user store on each request (one primary-key lookup); the demote endpoint increments the version, so the old token gets 401 immediately. Choices, from cheapest to strictest:</p>
<table>
<tr><th>Approach</th><th>Revocation delay</th><th>Cost per request</th></tr>
<tr><td>Role in token only</td><td>up to the token lifetime (15 min)</td><td>none</td></tr>
<tr><td>Shorter access token (2–5 min) + refresh</td><td>a few minutes</td><td>more refresh calls</td></tr>
<tr><td>tokenVersion / current role from DB (or cache)</td><td>immediate</td><td>1 indexed lookup (or a short-lived cache)</td></tr>
</table>
<p>Milestone 7 uses the third: for a booking system, one primary-key lookup is cheap compared with a demoted lecturer approving bookings.</p>

<h3>🕵️ Real incident — Cash App, December 2021</h3>
<p>On 4 April 2022 Block, Cash App's parent company, told the SEC that a <strong>former employee</strong> had downloaded internal reports on 10 December 2021, after their employment had ended. The reports held full names and brokerage account numbers, and for some customers portfolio value and holdings; Block contacted about 8.2 million current and former customers. Block declined to say why the former employee still had access. The lesson is the one measured above: access that outlives the role. In your own API, removing a role must take effect on the next request, not "when the token expires" — and the same goes for deactivated accounts.</p>

<h3>🧪 Exercise (20 min)</h3>
<p>"Closed by default" in 3.4 meant <em>authenticated</em> by default — a new route without <code>@CanPerm</code>/<code>@Roles</code> is still open to any logged-in user. Make that impossible: at startup, list every route that declares none of <code>@Public</code>, <code>@Roles</code>, <code>@CanPerm</code> and refuse to start. Hint: <code>DiscoveryService</code>, <code>MetadataScanner</code> and <code>PATH_METADATA</code>.</p>
<details><summary>Show solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>The new <code>ExportsController.csv</code> — which returns student emails — is caught before the port opens, with exit code 1 so CI fails too. <code>ping</code> in the same controller declared <code>@Public()</code> and passes. Milestone 7 takes a cheaper variant: <code>PermGuard</code> answers 403 "Route chưa khai quyền" for undeclared routes, so a forgotten declaration is closed for everyone instead of open.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>401 or 403?</strong> 401 when the caller is not authenticated (missing/invalid token); 403 when they are authenticated but not allowed.</li>
<li><strong>How do you implement RBAC in NestJS?</strong> A metadata decorator (<code>@Roles</code>/<code>@CanPerm</code>), a guard that reads it with <code>Reflector.getAllAndOverride</code> and compares with <code>req.user</code>, registered with <code>APP_GUARD</code> after the authentication guard.</li>
<li><strong>Roles or permissions in the code?</strong> Permissions at call sites, a role→permission table in one place; roles change, call sites should not.</li>
<li><strong>A user is demoted — when does it take effect?</strong> With roles only in the JWT, when the token expires. For immediate effect, check the current role or a token version per request.</li>
</ol>

<h3>💼 On the job</h3>
<p>The ticket says "add role HEAD_OF_DEPARTMENT who can approve bookings of the whole building". With permissions it is a new row in the table plus an ownership rule (next lesson). With <code>@Roles(['admin', 'lecturer'])</code> scattered over 40 handlers it is a 40-file pull request where missing one is a security bug. Spot that in the first week of an OJT code base and propose the table — it is a classic, welcome refactor.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Authentication / authorization</span><span class="v">Who you are (401 if unknown) / what you may do (403 if not allowed).</span></div>
  <div class="kv"><span class="k">Permission</span><span class="v">A named action (booking:approve) checked by the guard; roles map to sets of permissions.</span></div>
  <div class="kv"><span class="k">@CurrentUser()</span><span class="v">Param decorator returning req.user set by the authentication guard.</span></div>
  <div class="kv"><span class="k">Guard order</span><span class="v">Global guards run in providers-array order; authentication must come first.</span></div>
  <div class="kv"><span class="k">Stale claim</span><span class="v">A role copied into a token that no longer matches the database.</span></div>
  <div class="kv"><span class="k">tokenVersion</span><span class="v">Counter in the user row, copied into the token; increment it to kill every issued token.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>JwtAuthGuard then AccessGuard, both global; the order is the order in <code>providers</code> — reversed, every route returned 500.</li>
<li>Ask for permissions in controllers; map roles to permissions in one table.</li>
<li>A role inside a JWT is a snapshot: the demoted lecturer kept approving (200) until a per-request tokenVersion check made it 401.</li>
<li>Make undeclared routes impossible: refuse to start, or answer 403.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>7.3 — Bạn là ai, rồi bạn được làm gì — đúng thứ tự đó, ở mọi nơi</h2>
<p class="lead">Bài 3.4 đã dựng cơ chế: guard toàn cục qua <code>APP_GUARD</code>, <code>@Public()</code> và <code>@Roles()</code> làm bằng <code>Reflector.createDecorator</code>, và con lỗi <code>@Public</code> ở method bị <code>@Roles</code> ở class ghi đè. Bài đó dùng khoá API. Ở đây người dùng đến từ JWT, và ba vấn đề mới xuất hiện: <strong>hai guard phải chạy theo thứ tự cố định, vai trò chép vào token sẽ cũ đi, và không ai để ý một route không khai gì cả.</strong></p>

<h3>Liên hệ đời thường: thẻ nhân viên và danh sách ra vào</h3>
<p>Bàn bảo vệ ở công ty kiểm thẻ nhân viên của bạn trước (xác thực), rồi mới xem danh sách ra vào của tầng bạn muốn lên (phân quyền). Đảo hai bước — đọc danh sách tầng trước khi ai đó trình thẻ — là hỏi "<em>không ai cả</em> thì được làm gì?". Và tấm thẻ in chữ "Trưởng phòng" vẫn in chữ "Trưởng phòng" sau khi bạn bị giáng chức, cho tới khi có người tra hệ thống nhân sự thay vì nhìn thẻ.</p>

<h3>1. Decorator và một bảng quyền</h3>
<pre><code class="language-ts">${esc(MA_DEC)}</code></pre>
<p>Controller đòi một <strong>quyền</strong> (<code>@CanPerm('booking:approve')</code>), không đòi một vai trò. Vai trò nào có quyền đó nằm ở một bảng duy nhất, <code>QUYEN</code>. Khi khoa quyết định "giảng viên cũng được xoá phòng", bạn sửa một dòng, không sửa từng controller. <code>@Roles()</code> vẫn còn cho trường hợp hiếm mà chính vai trò là luật (một màn hình chỉ admin).</p>

<h3>2. Hai guard toàn cục</h3>
<pre><code class="language-ts">${esc(MA_JWT)}</code></pre>
<pre><code class="language-ts">${esc(MA_ACC)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTRL)}</code></pre>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<p>Guard toàn cục chạy theo thứ tự trong mảng <code>providers</code>. <code>@CurrentUser()</code> (decorator tham số, bài 3.6) đưa cho handler người dùng mà guard thứ nhất đã gắn.</p>
<div class="out">${esc(OUT_RBAC)}</div>
<p>Mỗi mã một nghĩa: <strong>401</strong> = chưa biết bạn là ai (không có hoặc sai token); <strong>403</strong> = biết rồi, và bạn không được làm. Giảng viên qua được <code>booking:approve</code> nhưng bị từ chối báo cáo chỉ dành cho admin; admin qua hết.</p>

<h3>3. Bẫy 1 — hai guard sai thứ tự</h3>
<div class="out">${esc(OUT_NGUOC)}</div>
<p>Khi <code>AccessGuard</code> đứng trước, <code>req.user</code> chưa tồn tại: <code>user.roles</code> ném lỗi, mọi route được bảo vệ đều 500 — kể cả của admin — chỉ <code>/health</code> công khai sống sót. Ở đây nó hỏng ồn ào, là may. Một dòng "phòng thủ" <code>user?.roles ?? []</code> sẽ biến nó thành 403 lặng lẽ cho tất cả, còn guard viết kiểu <code>if (!user) return true</code> thì mở toang mọi thứ. Ghim thứ tự bằng test (lab 7.6) và giữ cả hai guard ở cùng một chỗ trong <code>AppModule</code>.</p>

<h3>4. Bẫy 2 — vai trò trong token là một tấm ảnh chụp</h3>
<p>Giảng viên #2 đăng nhập lúc 8:00 với token 15 phút ghi <code>roles: ["lecturer"]</code>. Lúc 8:05 admin hạ họ xuống sinh viên. Lúc 8:06 họ dùng lại token cũ:</p>
<div class="out">${esc(OUT_HA)}</div>
<p>Mặc định guard tin vai trò ghi trong token, nên người đã bị hạ vẫn duyệt được lịch #6 với mã 200 — và còn duyệt được tới 15 phút nữa. Với <code>VAI_TRO=csdl</code>, guard đọc vai trò <em>hiện tại</em> và <code>tokenVersion</code> từ kho người dùng ở mỗi request (một lần tra theo khoá chính); endpoint hạ vai trò tăng phiên bản, nên token cũ nhận 401 ngay. Các lựa chọn, từ rẻ nhất tới chặt nhất:</p>
<table>
<tr><th>Cách</th><th>Độ trễ thu hồi</th><th>Chi phí mỗi request</th></tr>
<tr><td>Chỉ có vai trò trong token</td><td>tới hết đời token (15 phút)</td><td>không có</td></tr>
<tr><td>Access token ngắn hơn (2–5 phút) + refresh</td><td>vài phút</td><td>nhiều lần refresh hơn</td></tr>
<tr><td>tokenVersion / vai trò hiện tại từ DB (hoặc cache)</td><td>ngay lập tức</td><td>1 lần tra có chỉ mục (hoặc một cache sống ngắn)</td></tr>
</table>
<p>Mốc 7 dùng cách thứ ba: với hệ thống đặt lịch, một lần tra theo khoá chính là rẻ so với một giảng viên đã bị hạ vẫn duyệt lịch.</p>

<h3>🕵️ Sự cố thật — Cash App, tháng 12/2021</h3>
<p>Ngày 04/04/2022, Block — công ty mẹ của Cash App — báo cáo với SEC rằng một <strong>nhân viên đã nghỉ việc</strong> tải các báo cáo nội bộ vào ngày 10/12/2021, sau khi hợp đồng đã kết thúc. Các báo cáo có họ tên và số tài khoản chứng khoán, với một số khách còn có giá trị danh mục và cổ phiếu đang giữ; Block liên hệ khoảng 8,2 triệu khách hàng cũ và hiện tại. Block từ chối giải thích vì sao người đã nghỉ vẫn còn quyền truy cập. Bài học đúng như phép đo ở trên: quyền sống lâu hơn vai trò. Trong API của bạn, gỡ một vai trò phải có hiệu lực ở request kế tiếp, không phải "khi token hết hạn" — tài khoản bị khoá cũng vậy.</p>

<h3>🧪 Thực hành (20 phút)</h3>
<p>"Mặc định đóng" ở bài 3.4 nghĩa là mặc định <em>phải đăng nhập</em> — một route mới không có <code>@CanPerm</code>/<code>@Roles</code> vẫn mở cho mọi người đã đăng nhập. Hãy làm cho điều đó không thể xảy ra: lúc khởi động, liệt kê mọi route không khai <code>@Public</code>, <code>@Roles</code> hay <code>@CanPerm</code> và từ chối chạy. Gợi ý: <code>DiscoveryService</code>, <code>MetadataScanner</code> và <code>PATH_METADATA</code>.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p><code>ExportsController.csv</code> mới — thứ trả về email sinh viên — bị bắt trước khi mở cổng, với mã thoát 1 nên CI cũng đỏ. <code>ping</code> cùng controller đã khai <code>@Public()</code> nên qua. Mốc 7 chọn bản rẻ hơn: <code>PermGuard</code> trả 403 "Route chưa khai quyền" cho route không khai, nên quên khai thì route bị đóng với mọi người thay vì mở.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>401 hay 403?</strong> 401 khi người gọi chưa được xác thực (thiếu/sai token); 403 khi đã xác thực nhưng không được phép.</li>
<li><strong>Cài RBAC trong NestJS thế nào?</strong> Một decorator metadata (<code>@Roles</code>/<code>@CanPerm</code>), một guard đọc nó bằng <code>Reflector.getAllAndOverride</code> rồi so với <code>req.user</code>, đăng ký bằng <code>APP_GUARD</code> sau guard xác thực.</li>
<li><strong>Trong mã nên ghi vai trò hay quyền?</strong> Ghi quyền ở chỗ gọi, bảng vai trò → quyền ở một nơi; vai trò thay đổi, chỗ gọi thì không nên đổi.</li>
<li><strong>Một người bị hạ vai trò — khi nào có hiệu lực?</strong> Nếu vai trò chỉ nằm trong JWT thì khi token hết hạn. Muốn có hiệu lực ngay, kiểm vai trò hiện tại hoặc phiên bản token ở mỗi request.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Phiếu việc ghi "thêm vai trò TRƯỞNG BỘ MÔN được duyệt lịch của cả toà nhà". Có bảng quyền thì đó là một dòng mới trong bảng cộng một luật sở hữu (bài sau). Có <code>@Roles(['admin', 'lecturer'])</code> rải trên 40 handler thì đó là một pull request 40 tệp, sót một chỗ là một lỗi bảo mật. Nhận ra điều này trong tuần đầu ở một dự án OJT và đề xuất bảng quyền — đó là một lần tái cấu trúc kinh điển, ai cũng hoan nghênh.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Xác thực / phân quyền</span><span class="v">Bạn là ai (chưa biết ⇒ 401) / bạn được làm gì (không được ⇒ 403).</span></div>
  <div class="kv"><span class="k">Quyền (permission)</span><span class="v">Một hành động có tên (booking:approve) do guard kiểm; vai trò ánh xạ sang tập quyền.</span></div>
  <div class="kv"><span class="k">@CurrentUser()</span><span class="v">Decorator tham số trả về req.user do guard xác thực gắn.</span></div>
  <div class="kv"><span class="k">Thứ tự guard</span><span class="v">Guard toàn cục chạy theo thứ tự mảng providers; xác thực phải đứng đầu.</span></div>
  <div class="kv"><span class="k">Claim cũ (stale claim)</span><span class="v">Vai trò chép vào token không còn khớp cơ sở dữ liệu.</span></div>
  <div class="kv"><span class="k">tokenVersion</span><span class="v">Bộ đếm trong dòng người dùng, chép vào token; tăng lên là giết mọi token đã cấp.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>JwtAuthGuard rồi mới AccessGuard, cả hai toàn cục; thứ tự là thứ tự trong <code>providers</code> — đảo lại thì mọi route trả 500.</li>
<li>Controller đòi quyền; ánh xạ vai trò sang quyền ở một bảng.</li>
<li>Vai trò trong JWT là ảnh chụp: giảng viên đã bị hạ vẫn duyệt được (200) cho tới khi kiểm tokenVersion ở mỗi request làm nó thành 401.</li>
<li>Làm cho route không khai quyền không thể tồn tại: từ chối khởi động, hoặc trả 403.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
