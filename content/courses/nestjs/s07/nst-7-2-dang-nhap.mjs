/**
 * 7.2 — Đăng ký và đăng nhập: băm mật khẩu, access + refresh token, đăng xuất (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, argon2 0.45.2, @nestjs/jwt 12.0.5): scratchpad/nst/lab/c7/app/src/b72/auth.ts
 * (register/login/refresh/logout trong bộ nhớ; tái dùng R1 ⇒ thu hồi cả họ; access vẫn 200 sau logout), KICH=thoi-gian (ngây thơ 79,3 vs 2,3 ms;
 * băm giả 59,2/56,6 và 64,9/57,5 ms), KICH=dong-thoi (16 login 649 ms; UV_THREADPOOL_SIZE=8 ⇒ 504 ms), bt.ts (đổi mật khẩu thu hồi 2 token).
 * Sự cố: Okta 10/2023 (HAR chứa session token) — nguồn Okta RCA 11/2023 + Cloudflare blog.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'authentication', bai: 'auth-2-2-chon-va-chinh', title: 'Authentication 2.2 — Chọn và chỉnh hàm băm, bằng phép đo', sub: 'argon2id, bcrypt, scrypt: tham số nào, đo thế nào.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-2-3-luong-dang-nhap', title: 'Authentication 2.3 — Luồng đăng nhập, mọi nhánh bằng nhau', sub: 'Phần nền của "băm giả" và câu báo lỗi chung.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-5-2-xoay-vong', title: 'Authentication 5.2 — Xoay vòng refresh token', sub: 'Họ token, phát hiện tái dùng, và cái giá cho người dùng thật.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-6-4-do-tai-khoan', title: 'Authentication 6.4 — Dò tài khoản', sub: 'Vì sao trang đăng ký luôn lộ email đã có, và cách giảm.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('🕵️', 'Okta — Unauthorized access to Okta\'s support case management system: root cause (11/2023)', 'Tệp HAR khách gửi hỗ trợ chứa session token; kẻ tấn công dùng lại để chiếm phiên.', 'https://sec.okta.com/articles/2023/11/unauthorized-access-oktas-support-case-management-system-root-cause/'),
  nguon('🕵️', 'Cloudflare — How Cloudflare mitigated yet another Okta compromise (20/10/2023)', 'Token cắp từ một phiếu hỗ trợ; Cloudflare phát hiện trước 24 giờ.', 'https://blog.cloudflare.com/how-cloudflare-mitigated-yet-another-okta-compromise/'),
  nguon('📘', 'node-argon2', 'Thư viện argon2 cho Node (mặc định argon2id, m=64 MiB, t=3, p=4).', 'https://github.com/ranisalt/node-argon2'),
].join('\n');
const MA_DTO = "class DangKyDto { @IsEmail() email: string; @IsString() @MinLength(12) password: string; }\nclass DangNhapDto { @IsString() email: string; @IsString() password: string; }\nclass RefreshDto { @IsString() refreshToken: string; }";
const MA_REPO = "type Refresh = { hash: string; userId: number; family: string; expiresAt: number; revokedAt?: number; replacedBy?: string };\n\n@Injectable()\nexport class UsersRepo {                                 // bài này giữ trong bộ nhớ; mốc 7 lưu bằng Prisma\n  private readonly ds: User[] = [];\n  findByEmail(email: string) { return this.ds.find((u) => u.email === email.toLowerCase()); }\n  findById(id: number) { return this.ds.find((u) => u.id === id); }\n  create(email: string, passwordHash: string) { const u = { id: this.ds.length + 1, email: email.toLowerCase(), passwordHash, roles: ['student'] }; this.ds.push(u); return u; }\n}\n@Injectable()\nexport class RefreshRepo {\n  readonly ds = new Map<string, Refresh>();             // khoá = SHA-256 của token: lộ bảng này cũng không dùng được token\n}\nconst sha256 = (s: string) => createHash('sha256').update(s).digest('hex');";
const MA_SVC = "@Injectable()\nexport class AuthService {\n  private readonly hashGia = argon2.hash('mat-khau-gia-de-can-thoi-gian');   // băm sẵn một lần lúc khởi động\n  constructor(private readonly users: UsersRepo, private readonly refresh: RefreshRepo, private readonly jwt: JwtService) {}\n\n  async register(d: DangKyDto) {\n    if (this.users.findByEmail(d.email)) throw new ConflictException('Email đã được đăng ký');\n    const u = this.users.create(d.email, await argon2.hash(d.password));     // argon2id, m=64 MiB, t=3, p=4 (mặc định)\n    return { id: u.id, email: u.email };\n  }\n\n  async login(d: DangNhapDto) {\n    const u = this.users.findByEmail(d.email);\n    if (process.env.LOGIN === 'ngay-tho' && !u) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');  // ✗ trả lời nhanh hơn hẳn\n    const dung = await argon2.verify(u?.passwordHash ?? (await this.hashGia), d.password);                         // ✓ luôn tốn một lần verify\n    if (!u || !dung) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');\n    return this.capCap(u, randomUUID());\n  }\n\n  async rotate(token: string) {\n    const r = this.refresh.ds.get(sha256(token));\n    if (!r || r.expiresAt < Date.now()) throw new UnauthorizedException('Refresh token không hợp lệ');\n    if (r.revokedAt) {                                                     // token ĐÃ dùng rồi mà lại xuất hiện ⇒ có kẻ giữ bản sao\n      for (const x of this.refresh.ds.values()) if (x.family === r.family) x.revokedAt ??= Date.now();\n      throw new UnauthorizedException('Refresh token đã dùng — thu hồi cả họ token');\n    }\n    r.revokedAt = Date.now();\n    const cap = await this.capCap(this.users.findById(r.userId)!, r.family);\n    r.replacedBy = sha256(cap.refreshToken);\n    return cap;\n  }\n\n  logout(token: string) { const r = this.refresh.ds.get(sha256(token)); if (r) r.revokedAt ??= Date.now(); }\n\n  private async capCap(u: User, family: string) {\n    const refreshToken = randomBytes(32).toString('base64url');            // token mờ (opaque), không phải JWT\n    this.refresh.ds.set(sha256(refreshToken), { hash: sha256(refreshToken), userId: u.id, family, expiresAt: Date.now() + 7 * 864e5 });\n    return { accessToken: await this.jwt.signAsync({ sub: String(u.id), roles: u.roles }), refreshToken };\n  }\n}";
const MA_CTRL = "@Controller('auth')\nclass AuthController {\n  constructor(private readonly auth: AuthService) {}\n  @Post('register') register(@Body() d: DangKyDto) { return this.auth.register(d); }\n  @Post('login') @HttpCode(200) login(@Body() d: DangNhapDto) { return this.auth.login(d); }\n  @Post('refresh') @HttpCode(200) refresh(@Body() d: RefreshDto) { return this.auth.rotate(d.refreshToken); }\n  @Post('logout') @HttpCode(204) logout(@Body() d: RefreshDto) { this.auth.logout(d.refreshToken); }\n  @Get('me') @UseGuards(JwtAuthGuard) me(@Req() r: any) { return r.user; }\n}";
const OUT_AUTH = "$ node dist/b72/auth.js\nregister an (mật khẩu 15 ký tự)    → 201 {\"id\":1,\"email\":\"an@fpt.edu.vn\"}\nregister lại an@fpt.edu.vn         → 409 {\"message\":\"Email đã được đăng ký\",\"error\":\"Conflict\",\"statusCode\":409}\nregister kèm roles:[\"admin\"]       → 400 {\"message\":[\"property roles should not exist\"],\"error\":\"Bad Request\",\"statusCode\":400}\nhash trong kho: $argon2id$v=19$m=65536,t=3,p=4$P…\nlogin sai mật khẩu                 → 401 {\"message\":\"Email hoặc mật khẩu không đúng\",\"error\":\"Unauthorized\",\"statusCode\":401}\nlogin email không có               → 401 {\"message\":\"Email hoặc mật khẩu không đúng\",\"error\":\"Unauthorized\",\"statusCode\":401}\nlogin đúng                         → 200 {\"accessToken\":\"eyJhbGciOiJI…\",\"refreshToken\":\"M7smnkwMcNlP…\"}\nrefresh R1 → cặp mới (R2)          → 200 {\"accessToken\":\"eyJhbGciOiJI…\",\"refreshToken\":\"EjPKWPl-c9z6…\"}\nKẺ CẮP dùng lại R1                 → 401 {\"message\":\"Refresh token đã dùng — thu hồi cả họ token\",\"error\":\"Unauthorized\",\"statusCode\":401}\nchủ thật dùng R2 (mới nhất)        → 401 {\"message\":\"Refresh token đã dùng — thu hồi cả họ token\",\"error\":\"Unauthorized\",\"statusCode\":401}\nlogout (thu hồi refresh)           → 204 null\nrefresh sau logout                 → 401 {\"message\":\"Refresh token đã dùng — thu hồi cả họ token\",\"error\":\"Unauthorized\",\"statusCode\":401}\nGET /me bằng access SAU logout     → 200 {\"id\":1,\"roles\":[\"student\"]}\ntrong RefreshRepo: b9341628… họ f719 thu hồi | 9721f3c4… họ f719 thu hồi | 0fa37caa… họ 319f thu hồi";
const OUT_TG = "$ KICH=thoi-gian LOGIN=ngay-tho node dist/b72/auth.js\nLOGIN=ngay-tho — trung vị 15 lần, mật khẩu sai:\n  email CÓ tồn tại    an@fpt.edu.vn    79.3 ms\n  email KHÔNG tồn tại khong@fpt.edu.vn 2.3 ms\n$ KICH=thoi-gian LOGIN=dung node dist/b72/auth.js   # lần 1\nLOGIN=dung — trung vị 15 lần, mật khẩu sai:\n  email CÓ tồn tại    an@fpt.edu.vn    59.2 ms\n  email KHÔNG tồn tại khong@fpt.edu.vn 56.6 ms\n$ KICH=thoi-gian LOGIN=dung node dist/b72/auth.js   # lần 2\nLOGIN=dung — trung vị 15 lần, mật khẩu sai:\n  email CÓ tồn tại    an@fpt.edu.vn    64.9 ms\n  email KHÔNG tồn tại khong@fpt.edu.vn 57.5 ms";
const OUT_DT = "$ KICH=dong-thoi node dist/b72/auth.js\nUV_THREADPOOL_SIZE=4 (mặc định): 16 login cùng lúc xong sau 649 ms; 1 register lẻ 56 ms\n$ KICH=dong-thoi UV_THREADPOOL_SIZE=8 node dist/b72/auth.js\nUV_THREADPOOL_SIZE=8: 16 login cùng lúc xong sau 504 ms; 1 register lẻ 51 ms";
const MA_BT = "@Injectable()\nclass PasswordService {\n  constructor(private readonly users: InstanceType<typeof UsersRepo>, private readonly refresh: InstanceType<typeof RefreshRepo>) {}\n  async change(userId: number, cu: string, moi: string) {\n    const u = this.users.findById(userId)!;\n    if (!(await argon2.verify(u.passwordHash, cu))) throw new BadRequestException('Mật khẩu hiện tại không đúng');\n    u.passwordHash = await argon2.hash(moi);\n    let n = 0;\n    for (const r of this.refresh.ds.values()) if (r.userId === userId && !r.revokedAt) { r.revokedAt = Date.now(); n++; }\n    return n;\n  }\n}";
const OUT_BT = "$ node dist/b72/bt.js\nđổi mật khẩu → thu hồi 2 refresh token\nrefresh của laptop: 401 Refresh token đã dùng — thu hồi cả họ token\nrefresh của điện thoại: 401 Refresh token đã dùng — thu hồi cả họ token\nđăng nhập bằng mật khẩu mới: được";

export default {
  title: '7.2 — Register and login: hashing, access + refresh tokens, logout|||7.2 — Đăng ký và đăng nhập: băm mật khẩu, access + refresh token, đăng xuất',
  slug: 'nst-7-2-dang-nhap',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một AuthModule đủ bốn đường: register băm argon2id, login trả cùng một câu cho sai email và sai mật khẩu, refresh xoay vòng lưu băm SHA-256, logout thu hồi. Chạy thật: tái dùng refresh cũ thu hồi cả họ token, access token vẫn dùng được sau logout, bỏ qua băm giả thì email không tồn tại trả lời nhanh gấp 34 lần (79 vs 2 ms), và 16 lần đăng nhập cùng lúc tốn 0,65 giây CPU.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>7.2 — Four endpoints, and the details that decide whether they are safe</h2>
<p class="lead">Lesson 7.1 checked tokens. Now we issue them. An <code>AuthModule</code> needs four routes: <code>register</code>, <code>login</code>, <code>refresh</code>, <code>logout</code>. The theory — why argon2id, how to tune it, why refresh tokens rotate — lives in the Authentication course chapters 2 and 5. This lesson is the Nest implementation and six measurements that show which lines actually matter. Users and tokens are kept in memory here to keep the focus; milestone 7 stores them with Prisma.</p>

<h3>Everyday analogy: a hotel key card and the front desk</h3>
<p>The key card (access token) opens your room for one night and the door never phones the desk to ask. The booking at the front desk (refresh token) lets you get a new card tomorrow. If you check out, the desk cancels the booking — but the card in your pocket still opens the door until it expires tonight. Every behaviour you will measure below follows from that picture.</p>

<h3>1. DTOs and storage</h3>
<pre><code class="language-ts">${esc(MA_DTO)}</code></pre>
<pre><code class="language-ts">${esc(MA_REPO)}</code></pre>
<p>The refresh token itself is never stored — only its SHA-256. A refresh token is 32 random bytes, so a fast hash is enough (no salt or slow hash needed, unlike passwords); a leaked table of hashes cannot be replayed.</p>

<h3>2. The service</h3>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTRL)}</code></pre>
<ul>
<li><strong>access token</strong>: a JWT, 15 minutes, checked by the guard without touching storage.</li>
<li><strong>refresh token</strong>: an <em>opaque</em> random string, 7 days, checked against storage on every use, so it can be revoked.</li>
<li><strong>family</strong>: every token born from one login shares a family id — the key to reuse detection.</li>
</ul>

<h3>3. Running the four routes</h3>
<div class="out">${esc(OUT_AUTH)}</div>
<ol>
<li><strong>Email is normalised</strong>: <code>An@fpt.edu.vn</code> was stored as <code>an@fpt.edu.vn</code>, so the second register is a 409. Note that this 409 itself tells anyone which emails have accounts — a registration page always leaks this; Authentication 6.4 covers the mitigations.</li>
<li><strong><code>roles: ["admin"]</code> in the body ⇒ 400</strong> thanks to <code>forbidNonWhitelisted</code> (lesson 4.2). Without it the field is silently dropped; without a DTO at all it would reach the database.</li>
<li><strong>The stored hash carries its parameters</strong>: <code>$argon2id$v=19$m=65536,t=3,p=4$…</code>. When you raise the cost later, old hashes still verify and can be re-hashed at the next login.</li>
<li><strong>Wrong password and unknown email return the same text</strong>.</li>
<li><strong>Reuse detection</strong>: R1 was rotated into R2. When R1 shows up again, someone else has a copy, so the whole family is revoked — the real owner's R2 dies too and they must log in again. That is the intended trade-off: a little friction for the user, a dead session for the thief.</li>
<li><strong>Logout revokes the refresh token, but the access token still returns 200.</strong> A JWT is checked without asking storage. It dies at <code>exp</code> — at most 15 minutes later. If that window is unacceptable (an admin firing an employee), you need a per-request check; lesson 7.3 adds a <code>tokenVersion</code> for exactly that.</li>
</ol>

<h3>4. Same message is not enough: timing</h3>
<p>Variant <code>LOGIN=ngay-tho</code> returns early when the email does not exist, skipping the expensive <code>argon2.verify</code>:</p>
<div class="out">${esc(OUT_TG)}</div>
<p>79 ms versus 2 ms: an attacker can list which emails have accounts without reading a single error message. The fix is in the service above: when the user does not exist, verify the password against a <em>dummy hash</em> computed once at startup. Both paths now cost one argon2 verification (57–65 ms; the differences between runs are noise on a loaded machine, not a pattern).</p>

<h3>5. The price of a slow hash</h3>
<div class="out">${esc(OUT_DT)}</div>
<p>Each verification takes ~50 ms of CPU — on purpose, so an attacker with your database is slow too. The flip side: 16 simultaneous logins take 0.65 s, and <code>argon2</code> work runs on libuv's thread pool (4 threads by default; 8 cut it to 0.5 s). Login is the most expensive endpoint in the app, and an open login endpoint is a cheap way to burn your CPU. That is one more reason for the rate limit in lesson 7.5.</p>
<p>Install note: <code>argon2</code> is a native module. <code>npm 11</code> printed <code>argon2@0.45.2 (install: … node-gyp-build)</code> under "install scripts not yet covered by allowScripts", yet it worked because a prebuilt binary for Linux x64 glibc ships in the package. In a Docker image on a different libc (Alpine/musl) install it <em>inside</em> the image — lesson 11.1.</p>

<h3>🕵️ Real incident — Okta support system, October 2023</h3>
<p>Okta's support staff asked customers for HAR files (browser recordings of network traffic) to debug problems. HAR files contain cookies and session tokens. An attacker who got into Okta's support case system downloaded those files and <strong>replayed the session tokens</strong> to enter customers' Okta admin consoles — no password, no MFA prompt. Cloudflare detected the intrusion on 18 October 2023, more than 24 hours before Okta notified it; Okta's root-cause report (November 2023) lists five customers targeted with stolen sessions. Lessons that map onto this lesson: bearer tokens <em>are</em> the credential; keep them short-lived, make refresh revocable and rotating, and never paste a token into a ticket or chat (in Nest logs, lesson 5.3 already redacts <code>authorization</code>).</p>

<h3>🧪 Exercise (15 min)</h3>
<p>The Authentication course lists five events that must end every session (5.3); one is "password changed". Write <code>PasswordService.change(userId, old, new)</code>: check the old password, store the new hash and revoke <strong>all</strong> refresh tokens of that user, so the laptop and the phone must log in again.</p>
<details><summary>Show solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Both devices are out, the new password works. Look at the message, though: <code>Refresh token đã dùng — thu hồi cả họ token</code>. Our <code>rotate()</code> cannot tell "revoked because reused" from "revoked because the password changed", so it logs a theft that never happened and revokes the family again. In production that false alarm floods the security dashboard. Store a reason (<code>revokedReason: 'ROTATED' | 'PASSWORD_CHANGED' | 'LOGOUT'</code>) and treat only <code>ROTATED</code> as reuse — Authentication 5.5 describes the same false alarm.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>Why two tokens?</strong> The access token is checked without a database hit, so it must be short-lived; the refresh token is checked against storage, so it can live longer and be revoked.</li>
<li><strong>How do you store refresh tokens?</strong> As a hash (SHA-256 is enough for 256-bit random tokens), with user id, family, expiry and revocation time; rotate on every use.</li>
<li><strong>Does logout invalidate a JWT?</strong> Not by itself — the access token lives until <code>exp</code>. Shorten its life, or check a token version / deny list per request.</li>
<li><strong>How do you avoid user enumeration on login?</strong> Same message, same status, and the same work (verify against a dummy hash when the user is missing).</li>
<li><strong>Why argon2id and not SHA-256 for passwords?</strong> Passwords are low-entropy; a slow, memory-hard hash makes offline guessing expensive. Random tokens are high-entropy, so a fast hash is fine.</li>
</ol>

<h3>💼 On the job</h3>
<p>A common review comment on an intern's auth pull request: "you return <code>user</code> from <code>register</code>" — the entity includes <code>passwordHash</code>. Return an explicit object or a response DTO (lesson 4.3). A second one: "the refresh endpoint has no rate limit" — it is <code>@Public()</code> and hits the database every call. Both are checked in milestone 7.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">argon2id</span><span class="v">Memory-hard password hash; default here m=64 MiB, t=3, p=4, ~50 ms per hash.</span></div>
  <div class="kv"><span class="k">Opaque refresh token</span><span class="v">Random string with no meaning; valid only if its hash is in storage and not revoked.</span></div>
  <div class="kv"><span class="k">Rotation</span><span class="v">Each refresh returns a new pair and revokes the token just used.</span></div>
  <div class="kv"><span class="k">Token family / reuse detection</span><span class="v">All tokens from one login; a revoked token reappearing ⇒ revoke the family.</span></div>
  <div class="kv"><span class="k">Dummy hash</span><span class="v">Hash verified when the user does not exist, so both login paths cost the same.</span></div>
  <div class="kv"><span class="k">UV_THREADPOOL_SIZE</span><span class="v">Size of libuv's thread pool (default 4) where argon2 and crypto work runs.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>register normalises email and hashes with argon2id; the DTO with <code>forbidNonWhitelisted</code> stops self-assigned roles.</li>
<li>login: same message and same cost for unknown email and wrong password — measured 79 vs 2 ms without the dummy hash.</li>
<li>Refresh tokens are opaque, hashed, rotating and grouped in families; reuse revokes the family.</li>
<li>Logout cannot recall an issued access token — it lives until <code>exp</code>.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>7.2 — Bốn endpoint, và những chi tiết quyết định chúng có an toàn không</h2>
<p class="lead">Bài 7.1 kiểm token. Giờ ta cấp token. Một <code>AuthModule</code> cần bốn route: <code>register</code>, <code>login</code>, <code>refresh</code>, <code>logout</code>. Phần lý thuyết — vì sao argon2id, chỉnh tham số ra sao, vì sao refresh token phải xoay vòng — nằm ở khoá Authentication chương 2 và 5. Bài này là phần cài đặt bằng Nest và sáu phép đo cho thấy dòng nào thật sự quan trọng. Người dùng và token tạm giữ trong bộ nhớ cho tập trung; mốc 7 lưu bằng Prisma.</p>

<h3>Liên hệ đời thường: thẻ phòng khách sạn và quầy lễ tân</h3>
<p>Thẻ phòng (access token) mở cửa phòng bạn trong một đêm, và cánh cửa không bao giờ gọi xuống quầy hỏi. Đặt phòng ở quầy lễ tân (refresh token) cho bạn lấy thẻ mới vào hôm sau. Bạn trả phòng thì quầy huỷ đặt phòng — nhưng tấm thẻ trong túi vẫn mở được cửa tới khi hết hạn tối nay. Mọi hành vi bạn sắp đo ở dưới đều suy ra từ bức tranh đó.</p>

<h3>1. DTO và chỗ lưu</h3>
<pre><code class="language-ts">${esc(MA_DTO)}</code></pre>
<pre><code class="language-ts">${esc(MA_REPO)}</code></pre>
<p>Không bao giờ lưu chính refresh token — chỉ lưu SHA-256 của nó. Refresh token là 32 byte ngẫu nhiên nên một hàm băm nhanh là đủ (không cần muối hay hàm băm chậm như mật khẩu); bảng băm có lộ cũng không dùng lại được.</p>

<h3>2. Service</h3>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTRL)}</code></pre>
<ul>
<li><strong>access token</strong>: một JWT, 15 phút, guard kiểm mà không đụng tới kho lưu.</li>
<li><strong>refresh token</strong>: một chuỗi ngẫu nhiên <em>mờ</em> (opaque), 7 ngày, mỗi lần dùng đều đối chiếu kho lưu, nên thu hồi được.</li>
<li><strong>họ token (family)</strong>: mọi token sinh ra từ một lần đăng nhập chung một mã họ — chìa khoá để phát hiện tái dùng.</li>
</ul>

<h3>3. Chạy bốn route</h3>
<div class="out">${esc(OUT_AUTH)}</div>
<ol>
<li><strong>Email được chuẩn hoá</strong>: <code>An@fpt.edu.vn</code> lưu thành <code>an@fpt.edu.vn</code>, nên lần register thứ hai là 409. Để ý chính mã 409 này cho bất kỳ ai biết email nào đã có tài khoản — trang đăng ký luôn lộ điều này; khoá Authentication 6.4 nói cách giảm.</li>
<li><strong><code>roles: ["admin"]</code> trong body ⇒ 400</strong> nhờ <code>forbidNonWhitelisted</code> (bài 4.2). Không có nó thì trường bị bỏ âm thầm; không có DTO thì nó chạm tới cơ sở dữ liệu.</li>
<li><strong>Chuỗi băm mang theo tham số</strong>: <code>$argon2id$v=19$m=65536,t=3,p=4$…</code>. Sau này tăng chi phí, băm cũ vẫn kiểm được và có thể băm lại ở lần đăng nhập kế tiếp.</li>
<li><strong>Sai mật khẩu và email không tồn tại trả cùng một câu</strong>.</li>
<li><strong>Phát hiện tái dùng</strong>: R1 đã đổi thành R2. Khi R1 xuất hiện lại, nghĩa là có người khác giữ bản sao, nên cả họ bị thu hồi — R2 của chủ thật cũng chết và họ phải đăng nhập lại. Đó là sự đánh đổi có chủ đích: người dùng phiền một chút, phiên của kẻ cắp thì chết hẳn.</li>
<li><strong>Logout thu hồi refresh token, nhưng access token vẫn trả 200.</strong> JWT được kiểm mà không hỏi kho lưu. Nó chết ở <code>exp</code> — chậm nhất 15 phút sau. Nếu khoảng đó không chấp nhận được (admin vừa cho một nhân viên nghỉ việc), bạn cần kiểm theo từng request; bài 7.3 thêm <code>tokenVersion</code> cho đúng việc đó.</li>
</ol>

<h3>4. Cùng một câu là chưa đủ: thời gian trả lời</h3>
<p>Biến thể <code>LOGIN=ngay-tho</code> trả lời ngay khi email không tồn tại, bỏ qua bước <code>argon2.verify</code> đắt đỏ:</p>
<div class="out">${esc(OUT_TG)}</div>
<p>79 ms so với 2 ms: kẻ tấn công liệt kê được email nào có tài khoản mà không cần đọc câu báo lỗi nào. Cách sửa nằm sẵn trong service ở trên: khi người dùng không tồn tại, vẫn verify mật khẩu với một <em>chuỗi băm giả</em> tính một lần lúc khởi động. Giờ cả hai đường đều tốn một lần argon2 (57–65 ms; chênh giữa các lần chạy là nhiễu trên máy đang tải nặng, không theo quy luật nào).</p>

<h3>5. Cái giá của hàm băm chậm</h3>
<div class="out">${esc(OUT_DT)}</div>
<p>Mỗi lần verify tốn ~50 ms CPU — cố ý, để kẻ tấn công cầm cơ sở dữ liệu của bạn cũng phải chậm. Mặt trái: 16 lần đăng nhập cùng lúc tốn 0,65 giây, và việc của <code>argon2</code> chạy trên thread pool của libuv (mặc định 4 luồng; 8 luồng giảm còn 0,5 giây). Đăng nhập là endpoint đắt nhất của ứng dụng, và một endpoint đăng nhập để ngỏ là cách rẻ tiền để đốt CPU của bạn. Thêm một lý do cho giới hạn tần suất ở bài 7.5.</p>
<p>Ghi chú cài đặt: <code>argon2</code> là module native. <code>npm 11</code> in <code>argon2@0.45.2 (install: … node-gyp-build)</code> dưới dòng "install scripts not yet covered by allowScripts", nhưng vẫn chạy vì gói có sẵn bản dựng cho Linux x64 glibc. Trong image Docker dùng libc khác (Alpine/musl) thì phải cài <em>bên trong</em> image — bài 11.1.</p>

<h3>🕵️ Sự cố thật — hệ thống hỗ trợ của Okta, tháng 10/2023</h3>
<p>Nhân viên hỗ trợ của Okta xin khách hàng tệp HAR (bản ghi lưu lượng mạng của trình duyệt) để dò lỗi. Tệp HAR chứa cookie và session token. Kẻ tấn công lọt vào hệ thống quản lý phiếu hỗ trợ của Okta đã tải các tệp đó và <strong>dùng lại session token</strong> để vào trang quản trị Okta của khách hàng — không mật khẩu, không hỏi MFA. Cloudflare phát hiện xâm nhập ngày 18/10/2023, sớm hơn thông báo của Okta hơn 24 giờ; báo cáo nguyên nhân của Okta (11/2023) ghi năm khách hàng bị nhắm bằng phiên bị cắp. Bài học ánh vào bài này: bearer token <em>chính là</em> thông tin đăng nhập; giữ nó sống ngắn, cho refresh thu hồi được và xoay vòng, và đừng bao giờ dán token vào phiếu hỗ trợ hay khung chat (log của Nest ở bài 5.3 đã che <code>authorization</code>).</p>

<h3>🧪 Thực hành (15 phút)</h3>
<p>Khoá Authentication liệt kê năm sự kiện bắt buộc phải kết thúc mọi phiên (5.3); một trong số đó là "đổi mật khẩu". Viết <code>PasswordService.change(userId, cũ, mới)</code>: kiểm mật khẩu cũ, lưu băm mới và thu hồi <strong>mọi</strong> refresh token của người đó, để laptop và điện thoại đều phải đăng nhập lại.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Cả hai thiết bị bị đá ra, mật khẩu mới dùng được. Nhưng nhìn câu báo: <code>Refresh token đã dùng — thu hồi cả họ token</code>. Hàm <code>rotate()</code> không phân biệt được "thu hồi vì bị tái dùng" với "thu hồi vì đổi mật khẩu", nên nó báo một vụ trộm chưa từng xảy ra và thu hồi cả họ thêm lần nữa. Trên production, báo động giả kiểu này làm ngập bảng giám sát bảo mật. Hãy lưu lý do (<code>revokedReason: 'ROTATED' | 'PASSWORD_CHANGED' | 'LOGOUT'</code>) và chỉ coi <code>ROTATED</code> là tái dùng — khoá Authentication 5.5 tả đúng báo động giả này.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Vì sao cần hai token?</strong> Access token được kiểm không cần hỏi cơ sở dữ liệu nên phải sống ngắn; refresh token kiểm với kho lưu nên sống lâu hơn được và thu hồi được.</li>
<li><strong>Lưu refresh token thế nào?</strong> Lưu băm (SHA-256 là đủ cho token ngẫu nhiên 256 bit), kèm id người dùng, họ token, hạn dùng và thời điểm thu hồi; xoay vòng ở mỗi lần dùng.</li>
<li><strong>Logout có vô hiệu hoá JWT không?</strong> Tự nó thì không — access token sống tới <code>exp</code>. Rút ngắn đời nó, hoặc kiểm phiên bản token / danh sách chặn ở mỗi request.</li>
<li><strong>Chống dò tài khoản ở login thế nào?</strong> Cùng câu báo, cùng mã trạng thái, và cùng khối lượng việc (verify với băm giả khi không có người dùng).</li>
<li><strong>Vì sao mật khẩu dùng argon2id mà không dùng SHA-256?</strong> Mật khẩu ít ngẫu nhiên; hàm băm chậm và tốn bộ nhớ làm việc đoán ngoại tuyến đắt. Token ngẫu nhiên thì đủ ngẫu nhiên, nên băm nhanh là được.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Một nhận xét review hay gặp trên pull request phần đăng nhập của thực tập sinh: "bạn trả <code>user</code> ra từ <code>register</code>" — entity có cả <code>passwordHash</code>. Hãy trả một object tường minh hoặc DTO phản hồi (bài 4.3). Nhận xét thứ hai: "endpoint refresh không giới hạn tần suất" — nó <code>@Public()</code> và mỗi lần gọi đều chạm cơ sở dữ liệu. Cả hai đều được kiểm ở mốc 7.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">argon2id</span><span class="v">Hàm băm mật khẩu tốn bộ nhớ; mặc định ở đây m=64 MiB, t=3, p=4, ~50 ms mỗi lần.</span></div>
  <div class="kv"><span class="k">Refresh token mờ (opaque)</span><span class="v">Chuỗi ngẫu nhiên không mang nghĩa; chỉ hợp lệ khi băm của nó có trong kho và chưa bị thu hồi.</span></div>
  <div class="kv"><span class="k">Xoay vòng (rotation)</span><span class="v">Mỗi lần refresh trả cặp mới và thu hồi token vừa dùng.</span></div>
  <div class="kv"><span class="k">Họ token / phát hiện tái dùng</span><span class="v">Mọi token từ một lần đăng nhập; token đã thu hồi mà xuất hiện lại ⇒ thu hồi cả họ.</span></div>
  <div class="kv"><span class="k">Băm giả (dummy hash)</span><span class="v">Chuỗi băm dùng để verify khi không có người dùng, cho hai đường đăng nhập tốn như nhau.</span></div>
  <div class="kv"><span class="k">UV_THREADPOOL_SIZE</span><span class="v">Số luồng trong thread pool của libuv (mặc định 4), nơi argon2 và crypto chạy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>register chuẩn hoá email và băm bằng argon2id; DTO có <code>forbidNonWhitelisted</code> chặn tự gán vai trò.</li>
<li>login: cùng câu báo và cùng chi phí cho email lạ lẫn sai mật khẩu — đo được 79 so với 2 ms khi thiếu băm giả.</li>
<li>Refresh token mờ, lưu băm, xoay vòng, gom theo họ; tái dùng thì thu hồi cả họ.</li>
<li>Logout không gọi lại được access token đã cấp — nó sống tới <code>exp</code>.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
