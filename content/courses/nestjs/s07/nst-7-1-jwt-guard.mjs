/**
 * 7.1 — JWT trong Nest: @nestjs/jwt, AuthGuard tự viết, và khi nào Passport có ích (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, @nestjs/jwt 12.0.5, @nestjs/passport 12.0.2, passport-jwt 4.0.1):
 * scratchpad/nst/lab/c7/app/src/b71 — jwt.ts (7 token × 2 guard; GUARD=decode nhận token giả), doan.ts (khoá "secret" đoán ra 0,19 ms,
 * ~600 nghìn khoá/giây), thieu-khoa.ts (register đọc process.env lúc import ⇒ khởi động được, /login 500), bt.ts (Zod chặn khoá < 32 ký tự).
 * Sự cố: CVE-2015-9235 (jsonwebtoken < 4.2.2) + bài Auth0 31/03/2015.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'authentication', bai: 'auth-4-1-giai-ma-bang-tay', title: 'Authentication 4.1 — Tự tay giải mã một JWT', sub: 'Header, payload, chữ ký — phần nền bài này không dạy lại.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-4-2-truong-alg', title: 'Authentication 4.2 — Trường alg', sub: 'Vì sao phải ghim thuật toán: alg none và nhầm RS/HS.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-4-3-cac-claim', title: 'Authentication 4.3 — Bảy claim', sub: 'exp, iss, aud… và cú tấn công cho mỗi cái bạn bỏ qua.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-3-4-guard', title: 'NestJS 3.4 — Guard', sub: 'Cơ chế guard, APP_GUARD, @Public — bài này chỉ thay khoá API bằng JWT.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS docs — Authentication', 'JwtModule, AuthGuard tự viết, @Public với APP_GUARD.', 'https://docs.nestjs.com/security/authentication'),
  nguon('📘', 'NestJS docs — Passport (recipe)', 'PassportStrategy, AuthGuard(\'jwt\'), validate().', 'https://docs.nestjs.com/recipes/passport'),
  nguon('🕵️', 'NVD — CVE-2015-9235', 'jsonwebtoken < 4.2.2: token ký HS bằng khoá công khai RS vẫn qua verify.', 'https://nvd.nist.gov/vuln/detail/CVE-2015-9235'),
  nguon('🕵️', 'Auth0 — Critical vulnerabilities in JSON Web Token libraries (31/03/2015)', 'Bài gốc công bố lỗi alg none / nhầm thuật toán ở nhiều thư viện.', 'https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/'),
].join('\n');
const MA_GUARD = "// —— cách 1: guard tự viết, 20 dòng ——\n@Injectable()\nexport class JwtAuthGuard implements CanActivate {\n  constructor(private readonly jwt: JwtService) {}\n  async canActivate(ctx: ExecutionContext): Promise<boolean> {\n    const req = ctx.switchToHttp().getRequest<Request & { user?: NguoiDung }>();\n    const [kieu, token] = req.headers.authorization?.split(' ') ?? [];\n    if (kieu !== 'Bearer' || !token) throw new UnauthorizedException('Thiếu Bearer token');\n    try {\n      const p = process.env.GUARD === 'decode'\n        ? this.jwt.decode<Payload>(token)                 // ✗ SAI: chỉ giải mã base64, KHÔNG kiểm chữ ký\n        : await this.jwt.verifyAsync<Payload>(token);     // ✓ kiểm chữ ký, alg, exp, iss, aud\n      req.user = { id: Number(p.sub), roles: p.roles };\n      return true;\n    } catch (e) {\n      throw new UnauthorizedException((e as Error).message);\n    }\n  }\n}";
const MA_PASSPORT = "// —— cách 2: Passport — cùng việc, chia thành strategy + guard dựng sẵn ——\n@Injectable()\nclass JwtStrategy extends PassportStrategy(Strategy, 'jwt') {\n  constructor(cfg: ConfigService) {\n    super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: cfg.getOrThrow('JWT_SECRET'),\n      algorithms: ['HS256'], issuer: 'lab-booking', audience: 'lab-booking-api' });\n  }\n  validate(p: Payload): NguoiDung { return { id: Number(p.sub), roles: p.roles }; }   // kết quả gắn vào req.user\n}";
const MA_MOD = "@Module({\n  imports: [\n    ConfigModule.forRoot({ ignoreEnvFile: true, isGlobal: true }),\n    JwtModule.registerAsync({\n      inject: [ConfigService],\n      useFactory: (cfg: ConfigService) => ({\n        secret: cfg.getOrThrow<string>('JWT_SECRET'),\n        signOptions: { expiresIn: '15m', issuer: 'lab-booking', audience: 'lab-booking-api' },\n        verifyOptions: { algorithms: ['HS256'], issuer: 'lab-booking', audience: 'lab-booking-api' },\n      }),\n    }),\n    PassportModule,\n  ],\n  controllers: [MeController],\n  providers: [JwtAuthGuard, JwtStrategy],\n})";
const MA_THU = "const tot = await jwt.signAsync({ sub: '7', roles: ['student'] });\nconst [h, , s] = tot.split('.');\nconst sua = `${h}.${b64({ ...jwt.decode(tot), roles: ['admin'] })}.${s}`;              // đổi vai trò, giữ chữ ký cũ\nconst none = `${b64({ alg: 'none', typ: 'JWT' })}.${b64({ sub: '1', roles: ['admin'], iss: 'lab-booking', aud: 'lab-booking-api' })}.`;\nconst khacAud = await jwt.signAsync({ sub: '7', roles: ['student'] }, { audience: 'payment-api' });\nconst hetHan = await jwt.signAsync({ sub: '7', roles: ['student'] }, { expiresIn: '1s' });\nawait new Promise((r) => setTimeout(r, 1100));\n\nconst DS: [string, string | undefined][] = [\n  ['không header', undefined], ['\"Bearer abc\"', 'Bearer abc'], ['token đúng', `Bearer ${tot}`],\n  ['đổi roles → admin', `Bearer ${sua}`], ['alg: none', `Bearer ${none}`], ['aud của dịch vụ khác', `Bearer ${khacAud}`], ['hết hạn 1 s', `Bearer ${hetHan}`],\n];";
const OUT_JWT = "$ node dist/b71/jwt.js     # GET /me (guard tự viết) và /me-passport\n—— GET /me\nkhông header           → 401 {\"message\":\"Thiếu Bearer token\",\"error\":\"Unauthorized\",\"statusCode\":401}\n\"Bearer abc\"           → 401 {\"message\":\"jwt malformed\",\"error\":\"Unauthorized\",\"statusCode\":401}\ntoken đúng             → 200 {\"id\":7,\"roles\":[\"student\"]}\nđổi roles → admin      → 401 {\"message\":\"invalid signature\",\"error\":\"Unauthorized\",\"statusCode\":401}\nalg: none              → 401 {\"message\":\"jwt signature is required\",\"error\":\"Unauthorized\",\"statusCode\":401}\naud của dịch vụ khác   → 401 {\"message\":\"jwt audience invalid. expected: lab-booking-api\",\"error\":\"Unauthorized\",\"statusCode\":401}\nhết hạn 1 s            → 401 {\"message\":\"jwt expired\",\"error\":\"Unauthorized\",\"statusCode\":401}\n—— GET /me-passport\nkhông header           → 401 {\"message\":\"Unauthorized\",\"statusCode\":401}\n\"Bearer abc\"           → 401 {\"message\":\"Unauthorized\",\"statusCode\":401}\ntoken đúng             → 200 {\"id\":7,\"roles\":[\"student\"]}\nđổi roles → admin      → 401 {\"message\":\"Unauthorized\",\"statusCode\":401}\nalg: none              → 401 {\"message\":\"Unauthorized\",\"statusCode\":401}\naud của dịch vụ khác   → 401 {\"message\":\"Unauthorized\",\"statusCode\":401}\nhết hạn 1 s            → 401 {\"message\":\"Unauthorized\",\"statusCode\":401}";
const OUT_DECODE = "$ GUARD=decode node dist/b71/jwt.js\nkhông header           → 401 {\"message\":\"Thiếu Bearer token\",\"error\":\"Unauthorized\",\"statusCode\":401}\n\"Bearer abc\"           → 401 {\"message\":\"Cannot read properties of null (reading 'sub')\",\"error\":\"Unauthorized\",\"statusCode\":401}\ntoken đúng             → 200 {\"id\":7,\"roles\":[\"student\"]}\nđổi roles → admin      → 200 {\"id\":7,\"roles\":[\"admin\"]}\nalg: none              → 200 {\"id\":1,\"roles\":[\"admin\"]}\naud của dịch vụ khác   → 200 {\"id\":7,\"roles\":[\"student\"]}\nhết hạn 1 s            → 200 {\"id\":7,\"roles\":[\"student\"]}";
const MA_DOAN = "// Đoán khoá HS256 từ MỘT token bắt được — không cần gọi máy chủ lần nào\nimport { createHmac } from 'node:crypto';\nimport { JwtService } from '@nestjs/jwt';\nconst token = new JwtService({ secret: process.env.KHOA_YEU }).sign({ sub: '7', roles: ['student'] });\nconst [h, p, s] = token.split('.');\nconst TU_DIEN = ['123456', 'password', 'admin', 'jwt', 'changeme', 'your-256-bit-secret', 'secretKey', 'secret', 'mysecret', 'labbooking'];\nconst ky = (k: string) => createHmac('sha256', k).update(`${h}.${p}`).digest('base64url');\nlet t = performance.now();\nconst thay = TU_DIEN.find((k) => ky(k) === s);\nconsole.log(`khoá \"${process.env.KHOA_YEU}\" → tìm thấy: ${thay ?? 'không'} sau ${(performance.now() - t).toFixed(2)} ms`);\nt = performance.now(); const N = 300_000; for (let i = 0; i < N; i++) ky('x' + i);\nconst tocDo = N / ((performance.now() - t) / 1000);\nconsole.log(`tốc độ thử trên 1 nhân CPU: ~${Math.round(tocDo / 1000)} nghìn khoá/giây`);\nconsole.log(`khoá 32 ký tự ngẫu nhiên [A-Za-z0-9] (~190 bit): cần ~10^${Math.round(190 * Math.log10(2) - Math.log10(tocDo) - Math.log10(31_536_000))} năm`);";
const OUT_DOAN = "$ KHOA_YEU=secret node dist/b71/doan.js\nkhoá \"secret\" → tìm thấy: secret sau 0.19 ms\ntốc độ thử trên 1 nhân CPU: ~619 nghìn khoá/giây\nkhoá 32 ký tự ngẫu nhiên [A-Za-z0-9] (~190 bit): cần ~10^44 năm\n$ KHOA_YEU=k7Gm2pQx9vT4rW8yN3bF6hJ1sL5dZ0cA node dist/b71/doan.js\nkhoá \"k7Gm2pQx9vT4rW8yN3bF6hJ1sL5dZ0cA\" → tìm thấy: không sau 0.33 ms\ntốc độ thử trên 1 nhân CPU: ~566 nghìn khoá/giây\nkhoá 32 ký tự ngẫu nhiên [A-Za-z0-9] (~190 bit): cần ~10^44 năm";
const MA_THIEU = "// ✗ đọc process.env lúc import module — trước khi ConfigModule nạp .env (bẫy của bài 5.1)\n@Controller() class AuthController {\n  constructor(private readonly jwt: JwtService) {}\n  @Post('login') login() { return { accessToken: this.jwt.sign({ sub: '7' }) }; }\n}\n@Module({ imports: [JwtModule.register({ secret: process.env.JWT_SECRET })], controllers: [AuthController] })\nclass AppModule {}";
const OUT_THIEU = "$ JWT_SECRET= node dist/b71/thieu-khoa.js\nứng dụng đã khởi động, nghe cổng 41701\n[Nest] ERROR [ExceptionsHandler] Error: secretOrPrivateKey must have a value\n    at AuthController.login (file:///home/sv/app/dist/b71/thieu-khoa.js:19:46)\n    at AuthController.login (file:///home/sv/app/node_modules/@nestjs/core/router/router-proxy.js:6:23)\nPOST /login → 500 {\"statusCode\":500,\"message\":\"Internal server error\"}";
const MA_BT = "const EnvSchema = z.object({ JWT_SECRET: z.string().min(32, 'JWT_SECRET phải ≥ 32 ký tự (openssl rand -base64 32)') });\n\n@Injectable()\nclass JwtAuthGuard implements CanActivate {\n  private readonly log = new Logger('JwtAuthGuard');\n  constructor(private readonly jwt: JwtService) {}\n  async canActivate(ctx: ExecutionContext) {\n    const req = ctx.switchToHttp().getRequest();\n    const [kieu, token] = req.headers.authorization?.split(' ') ?? [];\n    try {\n      if (kieu !== 'Bearer' || !token) throw new Error('thiếu Bearer');\n      req.user = await this.jwt.verifyAsync(token);\n      return true;\n    } catch (e) {\n      this.log.warn(`từ chối ${req.method} ${req.url}: ${(e as Error).message}`);   // lý do thật: chỉ vào log\n      throw new UnauthorizedException();                                              // client: chỉ biết 401\n    }\n  }\n}";
const MA_BT2 = "@Module({\n  imports: [\n    ConfigModule.forRoot({ ignoreEnvFile: true, isGlobal: true, validate: (env) => EnvSchema.parse(env) }),\n    JwtModule.registerAsync({ inject: [ConfigService], useFactory: (c: ConfigService) => ({ secret: c.getOrThrow('JWT_SECRET'), verifyOptions: { algorithms: ['HS256'] } }) }),\n  ],\n  controllers: [MeController], providers: [JwtAuthGuard],\n})";
const OUT_BT = "$ JWT_SECRET=secret node dist/b71/bt.js; echo \"exit $?\"\n[Nest] ERROR [ExceptionHandler] ZodError: [\n    \"message\": \"JWT_SECRET phải ≥ 32 ký tự (openssl rand -base64 32)\"\nexit 1\n$ JWT_SECRET=$(openssl rand -base64 32) node dist/b71/bt.js\n[Nest] WARN [JwtAuthGuard] từ chối GET /me: jwt malformed\nGET /me \"Bearer abc\" → 401 {\"message\":\"Unauthorized\",\"statusCode\":401}";

export default {
  title: '7.1 — JWT in Nest: @nestjs/jwt, a hand-written AuthGuard, and when Passport helps|||7.1 — JWT trong Nest: @nestjs/jwt, AuthGuard tự viết, và khi nào Passport có ích',
  slug: 'nst-7-1-jwt-guard',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Thay khoá API của mốc 3 bằng JWT: JwtModule.registerAsync lấy khoá từ ConfigService, một AuthGuard 20 dòng đọc Bearer và verifyAsync. Chạy thật 7 loại token qua guard tự viết và qua Passport; đổi verify thành decode thì token giả vai trò admin, alg none, token hết hạn đều lọt 200. Đoán khoá "secret" từ một token trong 0,19 ms, và vì sao khoá đọc từ process.env lúc import làm /login trả 500.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>7.1 — From a shared API key to a token that says who you are</h2>
<p class="lead">Since milestone 3, lab-booking has been protected by one shared <code>x-api-key</code>: the server knows "someone with the key", never "student An" or "lecturer Lan". This chapter replaces it with accounts and JWTs. How a JWT is built, why <code>alg</code> must be pinned and what each claim defends against is covered in depth in the Authentication course (links below). Here we do the Nest part: <strong>where the secret comes from, where the token is checked, and what goes wrong when you wire it slightly differently.</strong></p>

<h3>Everyday analogy: a festival wristband</h3>
<p>At the gate, security checks your ID once and puts a wristband on you. Inside, every bar just looks at the wristband. A JWT is that wristband: login checks the password once, then every request shows the token. The guard is the bartender — and a bartender who only <em>looks at the colour</em> without checking the seal will serve anyone who drew a wristband on their wrist with a marker. That is exactly the <code>decode</code> bug below.</p>

<h3>1. Register JwtModule with the secret from configuration</h3>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<p><code>registerAsync</code> + <code>inject: [ConfigService]</code> means the factory runs <em>after</em> configuration is loaded and validated (lesson 5.1). <code>signOptions</code> are defaults for <code>sign()</code>; <code>verifyOptions</code> are checked on every <code>verify()</code> — pinning <code>algorithms: ['HS256']</code>, the issuer and the audience here means no single call site can forget them.</p>

<h3>2. Two ways to write the guard</h3>
<p>Way 1 — a hand-written guard, about 20 lines. It reads the <code>Authorization</code> header, calls <code>verifyAsync</code> and attaches the result to <code>req.user</code>:</p>
<pre><code class="language-ts">${esc(MA_GUARD)}</code></pre>
<p>Way 2 — Passport. The same check split into a <em>strategy</em> (how to extract and verify) and a ready-made guard <code>AuthGuard('jwt')</code>. Whatever <code>validate()</code> returns becomes <code>req.user</code>:</p>
<pre><code class="language-ts">${esc(MA_PASSPORT)}</code></pre>

<h3>3. Seven tokens through both guards</h3>
<p>The experiment signs a good token, then builds six bad ones: payload edited to <code>roles: ['admin']</code> while keeping the old signature, a hand-made <code>alg: none</code> token, a token for another service's audience, and a token that expired one second ago:</p>
<pre><code class="language-ts">${esc(MA_THU)}</code></pre>
<div class="out">${esc(OUT_JWT)}</div>
<ul>
<li>Both guards accept exactly one token and reject six. The security is the same — it comes from <code>jsonwebtoken</code> underneath, not from the guard style.</li>
<li>The hand-written guard returns the library's reason (<code>invalid signature</code>, <code>jwt expired</code>…). Passport returns a bare <code>Unauthorized</code>. Detailed reasons help an attacker probe; in the exercise you keep them in the log and send the client only 401.</li>
<li><code>aud</code> matters in a company: the payment service and the booking service may share a signing key. Without the audience check a token issued for <code>payment-api</code> works on <code>lab-booking-api</code>.</li>
</ul>

<h3>4. The bug that looks like it works: decode instead of verify</h3>
<p><code>JwtService.decode()</code> only base64-decodes the payload. It is meant for reading a token you already trust (e.g. to show its expiry in a UI). Used in a guard, it turns authentication off:</p>
<div class="out">${esc(OUT_DECODE)}</div>
<p>Four forged or dead tokens now get 200, including <code>{"id":1,"roles":["admin"]}</code> from a token nobody signed. The good token still works, so every manual test passes. This is why section 3's list of bad tokens belongs in your e2e tests (lab 7.6), not only the happy path.</p>

<h3>🕵️ Real incident — JWT libraries trusting the token's own header (2015)</h3>
<p>On 31 March 2015 Tim McLean (published on the Auth0 blog) showed that several JWT libraries let the <em>token</em> choose the algorithm. Two attacks followed: <code>alg: none</code> (no signature at all) and algorithm confusion — sign with HS256 using the server's <em>public</em> RSA key as the HMAC secret, and a server expecting RS256 accepts it. Node's <code>jsonwebtoken</code> before 4.2.2 was vulnerable to the second (<strong>CVE-2015-9235</strong>). The fix in every library was the same idea you see in <code>verifyOptions</code>: the <em>server</em> decides the allowed algorithms. In the run above, <code>alg: none</code> is rejected with <code>jwt signature is required</code> because a secret is configured and the algorithm list is pinned.</p>

<h3>5. Weak secrets: no server call needed</h3>
<p>With HS256, anyone holding one valid token can test candidate secrets offline — compute the HMAC of <code>header.payload</code> and compare with the signature:</p>
<pre><code class="language-ts">${esc(MA_DOAN)}</code></pre>
<div class="out">${esc(OUT_DOAN)}</div>
<p>The secret <code>secret</code> fell in 0.19 ms from a list of ten common values — and real wordlists hold millions, still only seconds at ~600 thousand tries per second on one core (a GPU is far faster). A 32-character random secret is out of reach. Generate it with <code>openssl rand -base64 32</code>, never type it. Once the secret leaks, the attacker can mint tokens for any user and role.</p>

<h3>6. A secret that is undefined until the first login</h3>
<pre><code class="language-ts">${esc(MA_THIEU)}</code></pre>
<div class="out">${esc(OUT_THIEU)}</div>
<p><code>JwtModule.register({ secret: process.env.JWT_SECRET })</code> is evaluated when the module file is imported — before <code>ConfigModule</code> loads <code>.env</code> (the trap from lesson 5.1). The app starts, health checks pass, and the first real login returns 500. Use <code>registerAsync</code> + <code>ConfigService</code>, and validate the secret at startup (the exercise).</p>

<h3>Hand-written guard or Passport?</h3>
<table>
<tr><th></th><th>Hand-written guard</th><th>Passport (<code>@nestjs/passport</code>)</th></tr>
<tr><td>Size for JWT</td><td>~20 lines, all visible</td><td>strategy + guard + 3 packages</td></tr>
<tr><td>Error messages</td><td>yours to choose</td><td>bare 401 unless you override <code>handleRequest</code></td></tr>
<tr><td>Strong point</td><td>easy to read and test; enough for Bearer JWT</td><td>500+ strategies: Google/Microsoft OAuth, SAML, LDAP, local username/password</td></tr>
<tr><td>Pick when</td><td>one token type you issue yourself</td><td>several login methods, or an existing company code base already on Passport</td></tr>
</table>
<p>Many Nest projects you will meet at a company use Passport because the docs did for years — reading <code>PassportStrategy</code> code is a required skill even if you write your own guard.</p>

<h3>🧪 Exercise (15 min)</h3>
<p>Two hardening steps: (1) the app must refuse to start if <code>JWT_SECRET</code> is shorter than 32 characters; (2) the client only ever sees a plain 401, while the real reason goes to the log with method and URL.</p>
<details><summary>Show solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<pre><code class="language-ts">${esc(MA_BT2)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>The Zod schema runs inside <code>ConfigModule.forRoot</code>, so a weak secret stops the process with exit 1 — before any port is opened. With a real secret, the client gets <code>{"message":"Unauthorized"}</code> and the log says <code>jwt malformed</code>.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>How do you protect routes with JWT in NestJS?</strong> Register <code>JwtModule</code> (async, secret from config), write a guard that extracts the Bearer token, calls <code>verifyAsync</code> and sets <code>req.user</code>; register it globally with <code>APP_GUARD</code> and mark open routes <code>@Public()</code>.</li>
<li><strong>What is the difference between <code>decode</code> and <code>verify</code>?</strong> <code>decode</code> only reads base64; <code>verify</code> checks the signature, algorithm, expiry, issuer and audience. Only <code>verify</code> belongs in a guard.</li>
<li><strong>Passport or a custom guard?</strong> Custom for a single Bearer JWT; Passport when you need many strategies (OAuth providers, local login) or the code base already uses it.</li>
<li><strong>Why pin <code>algorithms</code>?</strong> So the token cannot choose <code>none</code> or switch RS256 to HS256 (CVE-2015-9235).</li>
</ol>

<h3>💼 On the job</h3>
<p>In an outsourcing project the token is often issued by the client's identity server (Keycloak, Azure AD, Cognito), not by your Nest app. Then you verify with their <em>public</em> key (RS256, fetched from a JWKS URL) and never hold a signing secret at all — the guard code stays the same, only <code>verifyOptions</code> change. Ask on day one: "who issues tokens, which algorithm, which audience is ours?"</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">JwtModule.registerAsync</span><span class="v">Registers JwtService with options built by a factory after ConfigService is ready.</span></div>
  <div class="kv"><span class="k">verifyAsync</span><span class="v">Checks signature, alg, exp, iss, aud; throws with a reason on failure.</span></div>
  <div class="kv"><span class="k">decode</span><span class="v">Reads the payload WITHOUT checking anything — never for authentication.</span></div>
  <div class="kv"><span class="k">PassportStrategy</span><span class="v">Nest wrapper for a Passport strategy; validate() result becomes req.user.</span></div>
  <div class="kv"><span class="k">aud (audience)</span><span class="v">Which API the token is meant for; stops tokens from another service.</span></div>
  <div class="kv"><span class="k">HS256 secret</span><span class="v">Shared key that both signs and verifies; ≥ 32 random bytes or it can be guessed offline.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Register <code>JwtModule</code> asynchronously from validated config; pin algorithms, issuer and audience in <code>verifyOptions</code>.</li>
<li>A 20-line guard is enough for Bearer JWT; Passport earns its weight when there are many login strategies.</li>
<li><code>decode</code> in a guard accepts forged, unsigned and expired tokens while the happy path still works — test the bad tokens.</li>
<li>A weak HS256 secret is cracked offline from one token; an undefined secret shows up only at the first login as 500.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>7.1 — Từ khoá API dùng chung sang token nói được bạn là ai</h2>
<p class="lead">Từ mốc 3, lab-booking được bảo vệ bằng một <code>x-api-key</code> dùng chung: máy chủ chỉ biết "ai đó có khoá", không bao giờ biết "sinh viên An" hay "giảng viên Lan". Chương này thay nó bằng tài khoản và JWT. JWT cấu tạo ra sao, vì sao phải ghim <code>alg</code>, mỗi claim chống được gì — khoá Authentication đã dạy kỹ (liên kết bên dưới). Ở đây ta làm phần của Nest: <strong>khoá bí mật lấy từ đâu, token được kiểm ở đâu, và cái gì hỏng khi nối hơi lệch một chút.</strong></p>

<h3>Liên hệ đời thường: vòng tay ở lễ hội âm nhạc</h3>
<p>Ở cổng, bảo vệ xem căn cước một lần rồi đeo cho bạn một vòng tay. Vào trong, quầy nào cũng chỉ nhìn vòng tay. JWT chính là cái vòng: đăng nhập kiểm mật khẩu một lần, sau đó request nào cũng trình token. Guard là người đứng quầy — và người đứng quầy chỉ <em>nhìn màu</em> mà không kiểm niêm phong thì sẽ phục vụ cả người tự vẽ vòng tay bằng bút dạ. Đó đúng là con lỗi <code>decode</code> ở dưới.</p>

<h3>1. Đăng ký JwtModule với khoá lấy từ cấu hình</h3>
<pre><code class="language-ts">${esc(MA_MOD)}</code></pre>
<p><code>registerAsync</code> + <code>inject: [ConfigService]</code> nghĩa là hàm factory chạy <em>sau</em> khi cấu hình đã nạp và kiểm xong (bài 5.1). <code>signOptions</code> là mặc định cho <code>sign()</code>; <code>verifyOptions</code> được kiểm ở mọi lần <code>verify()</code> — ghim <code>algorithms: ['HS256']</code>, issuer và audience ở đây thì không chỗ gọi nào quên được.</p>

<h3>2. Hai cách viết guard</h3>
<p>Cách 1 — guard tự viết, khoảng 20 dòng. Đọc header <code>Authorization</code>, gọi <code>verifyAsync</code>, gắn kết quả vào <code>req.user</code>:</p>
<pre><code class="language-ts">${esc(MA_GUARD)}</code></pre>
<p>Cách 2 — Passport. Cùng phép kiểm đó nhưng tách thành <em>strategy</em> (lấy token và kiểm thế nào) và guard dựng sẵn <code>AuthGuard('jwt')</code>. Thứ <code>validate()</code> trả về trở thành <code>req.user</code>:</p>
<pre><code class="language-ts">${esc(MA_PASSPORT)}</code></pre>

<h3>3. Bảy token qua cả hai guard</h3>
<p>Thí nghiệm ký một token đúng, rồi dựng sáu token hỏng: sửa payload thành <code>roles: ['admin']</code> nhưng giữ chữ ký cũ, một token <code>alg: none</code> làm tay, một token cho audience của dịch vụ khác, và một token hết hạn một giây trước:</p>
<pre><code class="language-ts">${esc(MA_THU)}</code></pre>
<div class="out">${esc(OUT_JWT)}</div>
<ul>
<li>Cả hai guard nhận đúng một token và từ chối sáu. Độ an toàn như nhau — nó đến từ <code>jsonwebtoken</code> bên dưới, không từ kiểu viết guard.</li>
<li>Guard tự viết trả về lý do của thư viện (<code>invalid signature</code>, <code>jwt expired</code>…). Passport trả một chữ <code>Unauthorized</code>. Lý do chi tiết giúp kẻ tấn công dò; ở bài thực hành bạn giữ lý do trong log và chỉ gửi client mã 401.</li>
<li><code>aud</code> quan trọng khi đi làm: dịch vụ thanh toán và dịch vụ đặt lịch có thể dùng chung khoá ký. Không kiểm audience thì token cấp cho <code>payment-api</code> dùng được ở <code>lab-booking-api</code>.</li>
</ul>

<h3>4. Con lỗi trông như vẫn chạy: decode thay cho verify</h3>
<p><code>JwtService.decode()</code> chỉ giải mã base64 phần payload. Nó dành cho việc đọc một token bạn đã tin (ví dụ hiện hạn dùng trên giao diện). Đặt vào guard, nó tắt luôn việc xác thực:</p>
<div class="out">${esc(OUT_DECODE)}</div>
<p>Bốn token giả hoặc đã chết giờ nhận 200, kể cả <code>{"id":1,"roles":["admin"]}</code> từ một token không ai ký. Token đúng vẫn chạy, nên mọi lần thử tay đều qua. Vì vậy danh sách token hỏng ở mục 3 phải nằm trong test e2e của bạn (lab 7.6), không chỉ đường thuận.</p>

<h3>🕵️ Sự cố thật — thư viện JWT tin header của chính token (2015)</h3>
<p>Ngày 31/03/2015, Tim McLean (đăng trên blog Auth0) chỉ ra rằng nhiều thư viện JWT để <em>token</em> tự chọn thuật toán. Hai kiểu tấn công đi kèm: <code>alg: none</code> (không có chữ ký), và nhầm thuật toán — ký HS256 bằng khoá RSA <em>công khai</em> của máy chủ làm khoá HMAC, máy chủ đang chờ RS256 vẫn nhận. <code>jsonwebtoken</code> của Node trước bản 4.2.2 dính kiểu thứ hai (<strong>CVE-2015-9235</strong>). Cách sửa ở mọi thư viện cùng một ý như bạn thấy trong <code>verifyOptions</code>: <em>máy chủ</em> quyết định thuật toán nào được dùng. Ở lần chạy trên, <code>alg: none</code> bị từ chối với <code>jwt signature is required</code> vì đã cấu hình khoá và ghim danh sách thuật toán.</p>

<h3>5. Khoá yếu: không cần gọi máy chủ lần nào</h3>
<p>Với HS256, ai cầm được một token hợp lệ là thử được khoá ngay trên máy mình — tính HMAC của <code>header.payload</code> rồi so với chữ ký:</p>
<pre><code class="language-ts">${esc(MA_DOAN)}</code></pre>
<div class="out">${esc(OUT_DOAN)}</div>
<p>Khoá <code>secret</code> lộ sau 0,19 ms từ danh sách mười giá trị hay gặp — danh sách thật có hàng triệu từ, vẫn chỉ vài giây với tốc độ ~600 nghìn lần thử mỗi giây trên một nhân (GPU nhanh hơn nhiều). Khoá ngẫu nhiên 32 ký tự thì ngoài tầm. Sinh bằng <code>openssl rand -base64 32</code>, đừng tự gõ. Khoá đã lộ thì kẻ tấn công tự ký được token cho bất kỳ người dùng và vai trò nào.</p>

<h3>6. Khoá bằng undefined cho tới lần đăng nhập đầu tiên</h3>
<pre><code class="language-ts">${esc(MA_THIEU)}</code></pre>
<div class="out">${esc(OUT_THIEU)}</div>
<p><code>JwtModule.register({ secret: process.env.JWT_SECRET })</code> được tính lúc tệp module được import — trước khi <code>ConfigModule</code> nạp <code>.env</code> (bẫy của bài 5.1). Ứng dụng khởi động, health check xanh, và lần đăng nhập thật đầu tiên trả 500. Dùng <code>registerAsync</code> + <code>ConfigService</code>, và kiểm khoá ngay lúc khởi động (bài thực hành).</p>

<h3>Guard tự viết hay Passport?</h3>
<table>
<tr><th></th><th>Guard tự viết</th><th>Passport (<code>@nestjs/passport</code>)</th></tr>
<tr><td>Kích thước cho JWT</td><td>~20 dòng, thấy hết</td><td>strategy + guard + 3 gói</td></tr>
<tr><td>Thông báo lỗi</td><td>bạn tự chọn</td><td>401 trơn, trừ khi ghi đè <code>handleRequest</code></td></tr>
<tr><td>Điểm mạnh</td><td>dễ đọc, dễ test; đủ cho Bearer JWT</td><td>hơn 500 strategy: OAuth Google/Microsoft, SAML, LDAP, đăng nhập tên + mật khẩu</td></tr>
<tr><td>Chọn khi</td><td>một loại token do chính bạn cấp</td><td>nhiều cách đăng nhập, hoặc dự án công ty đã dùng Passport sẵn</td></tr>
</table>
<p>Nhiều dự án Nest bạn gặp ở công ty dùng Passport vì tài liệu chính thức dạy như vậy suốt nhiều năm — đọc được mã <code>PassportStrategy</code> là kỹ năng bắt buộc, kể cả khi bạn tự viết guard.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<p>Hai bước gia cố: (1) ứng dụng phải từ chối khởi động nếu <code>JWT_SECRET</code> ngắn hơn 32 ký tự; (2) client chỉ thấy 401 trơn, còn lý do thật vào log kèm phương thức và URL.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<pre><code class="language-ts">${esc(MA_BT2)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Schema Zod chạy bên trong <code>ConfigModule.forRoot</code>, nên khoá yếu làm tiến trình dừng với exit 1 — trước khi mở cổng nào. Với khoá thật, client nhận <code>{"message":"Unauthorized"}</code> còn log ghi <code>jwt malformed</code>.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Bảo vệ route bằng JWT trong NestJS thế nào?</strong> Đăng ký <code>JwtModule</code> (async, khoá từ cấu hình), viết guard lấy Bearer token, gọi <code>verifyAsync</code>, gắn <code>req.user</code>; đăng ký toàn cục bằng <code>APP_GUARD</code> và đánh dấu route mở bằng <code>@Public()</code>.</li>
<li><strong><code>decode</code> khác <code>verify</code> chỗ nào?</strong> <code>decode</code> chỉ đọc base64; <code>verify</code> kiểm chữ ký, thuật toán, hạn dùng, issuer và audience. Chỉ <code>verify</code> được đặt trong guard.</li>
<li><strong>Passport hay guard tự viết?</strong> Tự viết cho một loại Bearer JWT; Passport khi cần nhiều strategy (nhà cung cấp OAuth, đăng nhập local) hoặc dự án đã dùng sẵn.</li>
<li><strong>Vì sao phải ghim <code>algorithms</code>?</strong> Để token không tự chọn <code>none</code> hoặc đổi RS256 sang HS256 (CVE-2015-9235).</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Ở dự án outsourcing, token thường do máy chủ định danh của khách hàng cấp (Keycloak, Azure AD, Cognito), không phải ứng dụng Nest của bạn. Khi đó bạn kiểm bằng khoá <em>công khai</em> của họ (RS256, lấy từ một URL JWKS) và không hề giữ khoá ký nào — mã guard giữ nguyên, chỉ <code>verifyOptions</code> đổi. Hỏi ngay ngày đầu: "ai cấp token, thuật toán gì, audience của mình là gì?"</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">JwtModule.registerAsync</span><span class="v">Đăng ký JwtService với tuỳ chọn dựng bởi factory, chạy sau khi ConfigService sẵn sàng.</span></div>
  <div class="kv"><span class="k">verifyAsync</span><span class="v">Kiểm chữ ký, alg, exp, iss, aud; hỏng thì ném lỗi kèm lý do.</span></div>
  <div class="kv"><span class="k">decode</span><span class="v">Đọc payload mà KHÔNG kiểm gì — không bao giờ dùng để xác thực.</span></div>
  <div class="kv"><span class="k">PassportStrategy</span><span class="v">Lớp bọc của Nest cho một strategy Passport; kết quả validate() thành req.user.</span></div>
  <div class="kv"><span class="k">aud (audience)</span><span class="v">Token dành cho API nào; chặn token của dịch vụ khác.</span></div>
  <div class="kv"><span class="k">Khoá HS256</span><span class="v">Khoá chung vừa ký vừa kiểm; cần ≥ 32 byte ngẫu nhiên, không thì bị đoán ngoại tuyến.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đăng ký <code>JwtModule</code> bất đồng bộ từ cấu hình đã kiểm; ghim thuật toán, issuer, audience trong <code>verifyOptions</code>.</li>
<li>Guard 20 dòng là đủ cho Bearer JWT; Passport đáng dùng khi có nhiều cách đăng nhập.</li>
<li><code>decode</code> trong guard nhận token giả, không chữ ký, hết hạn — trong khi đường thuận vẫn chạy; hãy test các token hỏng.</li>
<li>Khoá HS256 yếu bị bẻ ngoại tuyến từ một token; khoá undefined chỉ lộ ra ở lần đăng nhập đầu tiên với mã 500.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
