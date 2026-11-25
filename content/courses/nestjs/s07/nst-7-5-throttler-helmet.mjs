/**
 * 7.5 — Gia cố: @nestjs/throttler, helmet, CORS và chống dò mật khẩu (khoá nestjs, soạn 24/11/2026). helmet/CORS đã dạy ở 3.1 ⇒ liên kết.
 * Output THẬT (máy nhà, Nest 12.6.0, @nestjs/throttler 6.8.0, ioredis 5.11.1, redis:7-alpine container nst-redis 127.0.0.1:41703 — đã xoá):
 * scratchpad/nst/lab/c7/app/src/b75/throttle.ts — co-ban (3×200 rồi 429, header X-RateLimit-*, Retry-After 60), proxy (không trust: người thật
 * 429; trust true: giả XFF lọt 4/4; trust 1: đúng), hai-ban (6 lọt thay vì 3), login (theo email: lần 6–7 ⇒ 429, chủ thật cũng 429);
 * bt.ts (kho Redis tự viết: 2 bản chung bộ đếm, 3 lọt). @nest-lab/throttler-storage-redis 1.2.0 ERESOLVE với Nest 12 (đo thật).
 * Sự cố: 23andMe 10/2023 (nhồi mật khẩu ~14.000 tài khoản ⇒ 6,9 triệu người) — Axios 04/12/2023.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-3-1-middleware', title: 'NestJS 3.1 — Middleware: helmet và CORS', sub: '12 header của helmet, CORS vẫn trả 200 — phần đó không dạy lại.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-10-1-nhoi-tin-vat', title: 'Authentication 10.1 — Nhồi tín vật', sub: 'Credential stuffing: cú tấn công đang diễn ra ngay lúc này.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-10-7-lab-chong-nhoi', title: 'Authentication Lab 10 — Chống nhồi mà không khoá người thật', sub: 'Giải bài toán "khoá theo tài khoản thì chủ thật cũng bị khoá".', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-11-3-gioi-han-tan-suat', title: 'Authentication 11.3 — Giới hạn tần suất với lưu lượng thật', sub: 'Thuật toán, NAT, và con số giới hạn chọn thế nào.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS docs — Rate limiting', 'ThrottlerModule, @Throttle, @SkipThrottle, getTracker, trust proxy.', 'https://docs.nestjs.com/security/rate-limiting'),
  nguon('📘', 'Express — Express behind proxies', 'trust proxy: true / số hop / địa chỉ, và req.ip lấy từ X-Forwarded-For thế nào.', 'https://expressjs.com/en/guide/behind-proxies.html'),
  nguon('🕵️', 'Axios — 23andMe sees personal data on 6.9 million customers stolen by hackers (04/12/2023)', 'Nhồi mật khẩu vào ~14.000 tài khoản, lan qua tính năng DNA Relatives.', 'https://www.axios.com/2023/12/04/23andme-customers-stolen-data'),
].join('\n');
const MA_THR = "@Injectable()\nclass LoginThrottlerGuard extends ThrottlerGuard {             // đếm theo TÀI KHOẢN thay vì theo IP\n  protected async getTracker(req: Record<string, any>) { return `email:${String(req.body?.email ?? '').toLowerCase()}`; }\n}\n\n@Controller()\nclass AppController {\n  @Get('rooms') rooms() { return 'ok'; }\n  @Get('health') @SkipThrottle() health() { return 'ok'; }\n  @Post('login') @HttpCode(200) @Throttle({ default: { limit: 5, ttl: 15 * 60_000 } })\n  login(@Body() b: { email: string; password: string }) { if (b.password !== 'dung') throw new UnauthorizedException(); return 'ok'; }\n}\n// chỉ route đăng nhập có THÊM bộ đếm theo email (gắn toàn cục thì mọi GET không có email chung một xô)\nif (process.env.THEO === 'email') UseGuards(LoginThrottlerGuard)(AppController.prototype, 'login', Object.getOwnPropertyDescriptor(AppController.prototype, 'login')!);\n@Module({\n  imports: [ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: Number(process.env.LIMIT ?? 3) }])],\n  controllers: [AppController],\n  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],   // toàn cục: đếm theo IP\n})\nclass AppModule {}";
const MA_TAO = "const tao = async (cong: number) => {\n  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: false });\n  const tp = process.env.TRUST_PROXY;\n  if (tp) app.set('trust proxy', /^\\d+$/.test(tp) ? Number(tp) : tp === 'true');\n  await app.listen(cong, '127.0.0.1'); return app;\n};";
const OUT_CB = "$ KICH=co-ban node dist/b75/throttle.js\nGET /rooms #1 → 200  limit=3 remaining=2 reset=60 retry-after=-\nGET /rooms #2 → 200  limit=3 remaining=1 reset=60 retry-after=-\nGET /rooms #3 → 200  limit=3 remaining=0 reset=60 retry-after=-\nGET /rooms #4 → 429  limit=- remaining=- reset=- retry-after=60\nGET /health    → 200 (SkipThrottle)";
const OUT_PROXY = "$ KICH=proxy node dist/b75/throttle.js\nTRUST_PROXY=(không đặt)\n  kẻ tấn công 5.6.7.8 (giả XFF 10.0.0.1) → 200\n  kẻ tấn công 5.6.7.8 (giả XFF 10.0.0.2) → 200\n  kẻ tấn công 5.6.7.8 (giả XFF 10.0.0.3) → 200\n  kẻ tấn công 5.6.7.8 (giả XFF 10.0.0.4) → 429\n  người thật  9.9.9.9                → 429\n$ KICH=proxy TRUST_PROXY=true node dist/b75/throttle.js\nTRUST_PROXY=true\n  kẻ tấn công 5.6.7.8 (giả XFF 10.0.0.1) → 200\n  kẻ tấn công 5.6.7.8 (giả XFF 10.0.0.2) → 200\n  kẻ tấn công 5.6.7.8 (giả XFF 10.0.0.3) → 200\n  kẻ tấn công 5.6.7.8 (giả XFF 10.0.0.4) → 200\n  người thật  9.9.9.9                → 200\n$ KICH=proxy TRUST_PROXY=1 node dist/b75/throttle.js\nTRUST_PROXY=1\n  kẻ tấn công 5.6.7.8 (giả XFF 10.0.0.1) → 200\n  kẻ tấn công 5.6.7.8 (giả XFF 10.0.0.2) → 200\n  kẻ tấn công 5.6.7.8 (giả XFF 10.0.0.3) → 200\n  kẻ tấn công 5.6.7.8 (giả XFF 10.0.0.4) → 429\n  người thật  9.9.9.9                → 200";
const OUT_HAI = "$ KICH=hai-ban node dist/b75/throttle.js\n2 bản sau cân bằng tải, giới hạn 3/phút mỗi bản: 200 200 200 200 200 200 429 429 ⇒ 6 request lọt";
const OUT_LOGIN = "$ KICH=login TRUST_PROXY=1 THEO=ip node dist/b75/throttle.js\nTHEO=ip: 7 lần đoán từ 7 IP → 401 401 401 401 401 401 401 · An thật mật khẩu đúng → 200 · Bình → 200\n$ KICH=login TRUST_PROXY=1 THEO=email node dist/b75/throttle.js\nTHEO=email: 7 lần đoán từ 7 IP → 401 401 401 401 401 429 429 · An thật mật khẩu đúng → 429 · Bình → 200";
const MA_BT = "@Injectable()\nclass RedisThrottlerStorage implements ThrottlerStorage {\n  constructor(private readonly redis: Redis) {}\n  async increment(key: string, ttl: number, limit: number, blockDuration: number, name: string) {\n    const k = `throttle:${name}:${key}`, kb = `${k}:block`;\n    const [[, hits], [, pttl], [, bttl]] = (await this.redis.multi().incr(k).pttl(k).pttl(kb).exec()) as [unknown, number][];\n    if (pttl < 0) await this.redis.pexpire(k, ttl);                       // lần đầu trong cửa sổ: đặt hạn\n    let chan = bttl > 0;\n    if (!chan && hits > limit) { await this.redis.set(kb, '1', 'PX', blockDuration); chan = true; }\n    return { totalHits: hits, timeToExpire: Math.ceil((pttl > 0 ? pttl : ttl) / 1000), isBlocked: chan, timeToBlockExpire: chan ? Math.ceil((bttl > 0 ? bttl : blockDuration) / 1000) : 0 };\n  }\n}";
const MA_BT2 = "const redis = new Redis(process.env.REDIS_URL ?? 'redis://127.0.0.1:41703');\n@Module({\n  imports: [ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 3 }], storage: new RedisThrottlerStorage(redis) })],\n  controllers: [C], providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],\n})\nclass AppModule {}";
const OUT_BT = "$ docker run -d --name nst-redis -p 127.0.0.1:41703:6379 redis:7-alpine\n$ node dist/b75/bt.js\n2 bản, chung Redis, giới hạn 3/phút: 200 200 200 429 429 429 429 429 ⇒ 3 request lọt\nkhoá trong Redis: throttle:default:17ee23502360586bf240196c2a4fcc2bdbd25f1f9f8081b3840173a980cd0d8c, throttle:default:17ee23502360586bf240196c2a4fcc2bdbd25f1f9f8081b3840173a980cd0d8c:block";

export default {
  title: '7.5 — Hardening: @nestjs/throttler, helmet, CORS and brute-force protection|||7.5 — Gia cố: @nestjs/throttler, helmet, CORS và chống dò mật khẩu',
  slug: 'nst-7-5-throttler-helmet',
  type: 'LESSON',
  isFreePreview: true,
  description: '@nestjs/throttler chạy thật bốn tình huống: giới hạn cơ bản với header Retry-After; đứng sau nginx mà không đặt trust proxy thì một kẻ tấn công làm người thật bị 429, đặt trust proxy true thì giả X-Forwarded-For lọt 4/4, đặt đúng 1 hop mới chặn đúng người; hai bản ứng dụng sau cân bằng tải cho lọt gấp đôi; botnet đổi IP dò một tài khoản chỉ bị chặn khi đếm theo email. Bài tập: kho đếm Redis tự viết khi gói có sẵn chưa nhận Nest 12.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>7.5 — Counting requests correctly is harder than limiting them</h2>
<p class="lead">Lesson 7.2 measured that one login costs ~50 ms of CPU; without a limit, anyone can try passwords as fast as your CPU allows. <code>@nestjs/throttler</code> adds a limit in three lines. The hard part is <em>what you count</em>: which IP is "the client" behind a proxy, what happens with two instances, and whether you count per IP or per account. Helmet and CORS were set up in lesson 3.1 and are not repeated here.</p>

<h3>Everyday analogy: the ATM that keeps your card</h3>
<p>Three wrong PINs and the ATM keeps the card — it counts per <em>card</em>, not per person standing in front of it, so a thief cannot reset the count by asking a friend to type. But if the bank counted per <em>building</em>, one prankster in the lobby would lock out every customer in the building. Choosing the key to count by is the whole lesson.</p>

<h3>1. The basics</h3>
<pre><code class="language-ts">${esc(MA_THR)}</code></pre>
<div class="out">${esc(OUT_CB)}</div>
<p>Three requests per minute here (to make it visible): the fourth gets 429 with <code>Retry-After: 60</code>; while allowed, the response carries <code>X-RateLimit-Limit/Remaining/Reset</code> so a well-behaved client can slow down. <code>@SkipThrottle()</code> exempts health checks — your load balancer polls them every few seconds. In milestone 7 the global default is 100/minute/IP.</p>

<h3>2. Behind a proxy: whose IP is it?</h3>
<p>In production, nginx (or a cloud load balancer) sits in front of Nest. Every TCP connection Nest sees comes from nginx. nginx <em>appends</em> the real client IP to <code>X-Forwarded-For</code>; whatever the client wrote there itself stays in front. The simulation sends exactly what nginx would forward — an attacker at 5.6.7.8 who forges <code>X-Forwarded-For: 10.0.0.N</code>, and a real user at 9.9.9.9:</p>
<pre><code class="language-ts">${esc(MA_TAO)}</code></pre>
<div class="out">${esc(OUT_PROXY)}</div>
<table>
<tr><th><code>trust proxy</code></th><th><code>req.ip</code> becomes</th><th>Result</th></tr>
<tr><td>not set</td><td>nginx's IP for everybody</td><td>everyone shares one bucket — the attacker's 3 requests get the real user 429</td></tr>
<tr><td><code>true</code></td><td>the <em>leftmost</em> X-Forwarded-For entry — written by the client</td><td>the attacker picks a new "IP" per request: 4/4 pass, the limit is gone</td></tr>
<tr><td><code>1</code> (one proxy)</td><td>the entry added by your nginx</td><td>the attacker is limited, the real user is not</td></tr>
</table>
<p>Set it to the number of proxies you actually run (or their addresses), never <code>true</code> on an internet-facing app. Milestone 7 reads it from <code>TRUST_PROXY</code> (default 0) so the setting follows the deployment.</p>

<h3>3. Two instances, double the limit</h3>
<div class="out">${esc(OUT_HAI)}</div>
<p>The default storage is a <code>Map</code> inside each process. Behind a load balancer with two instances, each counts on its own: 6 requests passed a "3 per minute" limit. With N instances the real limit is N × the configured one. Shared storage (Redis) fixes it — the exercise.</p>

<h3>4. Per IP or per account?</h3>
<p>Credential stuffing comes from botnets: each IP tries only a few passwords, far under any per-IP limit. The experiment has seven IPs guessing <code>an@fpt.edu.vn</code>'s password:</p>
<div class="out">${esc(OUT_LOGIN)}</div>
<ul>
<li><strong>Per IP</strong>: all seven guesses go through (401 means "wrong", not "blocked").</li>
<li><strong>Per email</strong> (a second guard on the login route only, with <code>getTracker</code> returning the email): guesses 6 and 7 are blocked — and so is the <strong>real An</strong> with the correct password. Bình is unaffected. Counting per account protects the password but lets an attacker lock a chosen user out; Authentication lab 10 works through the mitigations (allow known devices, CAPTCHA after N failures, notify the user).</li>
<li>The email guard is attached to the login route only. Registering it globally would give every request without an email the same key — all of <code>GET /rooms</code> would share one bucket.</li>
</ul>
<p>Milestone 7 found one more trap: <code>@Throttle({ default: { limit: 5 } })</code> on the login route also tightens the <em>global per-IP</em> counter for that route, because both guards read the same <code>default</code> throttler. A whole computer lab behind one campus NAT IP would be locked out after five logins. The fix is a separately named throttler — shown in 7.7.</p>

<h3>🕵️ Real incident — 23andMe, October 2023</h3>
<p>Attackers took email/password pairs leaked from other sites and tried them on 23andMe — credential stuffing. About 14,000 accounts (0.1% of users) reused a leaked password. Through the "DNA Relatives" feature those accounts could see relatives' profiles, and the data of about 6.9 million people was taken; 23andMe said its own systems were not breached. Per-IP limits do little against a distributed botnet; per-account limits, breached-password checks at signup (Authentication 2.4) and MFA do. The bigger lesson is the multiplier: one feature (relatives) turned 14,000 compromised logins into 6.9 million exposed people.</p>

<h3>🧪 Exercise (20 min)</h3>
<p>Make the two instances share one counter in Redis. The ready-made package fails to install on Nest 12:</p>
<div class="out">$ npx npm@11 install @nest-lab/throttler-storage-redis@1.2.0
npm error ERESOLVE unable to resolve dependency tree
npm error Found: @nestjs/common@12.6.0
npm error peer @nestjs/common@"^7.0.0 || ^8.0.0 || ^9.0.0 || ^10.0.0 || ^11.0.0" from @nest-lab/throttler-storage-redis@1.2.0</div>
<p>So implement the <code>ThrottlerStorage</code> interface yourself with <code>ioredis</code>: <code>increment(key, ttl, limit, blockDuration, name)</code> must return <code>{ totalHits, timeToExpire, isBlocked, timeToBlockExpire }</code>.</p>
<details><summary>Show solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<pre><code class="language-ts">${esc(MA_BT2)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>3 requests pass across both instances. <code>INCR</code> is atomic in Redis, so two instances incrementing at the same moment cannot both read "2". The key names show that the throttler hashes the tracker (IP) before storing it — the raw IP is not kept in Redis. Alternative to writing it: <code>--legacy-peer-deps</code> installs the package anyway (a dry run printed <code>add @nest-lab/throttler-storage-redis 1.2.0</code> — and <code>removed 3 packages</code> from the tree as a side effect), but then nobody has tested it against Nest 12 — the 20 lines above are easier to trust and to test.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>How do you rate-limit a NestJS API?</strong> <code>ThrottlerModule.forRoot</code> + <code>ThrottlerGuard</code> as <code>APP_GUARD</code>; override per route with <code>@Throttle</code>, exempt with <code>@SkipThrottle</code>.</li>
<li><strong>What breaks behind a load balancer?</strong> The client IP (set <code>trust proxy</code> to the hop count, never <code>true</code>) and in-memory counters per instance (use Redis).</li>
<li><strong>How do you stop credential stuffing?</strong> Per-account limits on login, breached-password checks, MFA, anomaly alerts; per-IP limits alone do not stop botnets.</li>
<li><strong>What does <code>X-Forwarded-For</code> contain and which part can you trust?</strong> A list of hops; only the entries added by proxies you control — counted from the right.</li>
</ol>

<h3>💼 On the job</h3>
<p>Ask the DevOps team three questions before you set any limit: how many proxies are in front of the app (that is your <code>trust proxy</code>), how many instances run (shared storage or not), and whether the client's users sit behind one corporate NAT (a whole office can look like one IP — a bank's branch, an FPT campus). Then choose numbers from real traffic logs, not from a blog post.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ThrottlerGuard</span><span class="v">Counts requests per tracker key per window; over the limit ⇒ 429 + Retry-After.</span></div>
  <div class="kv"><span class="k">getTracker</span><span class="v">Decides what is counted: IP by default, or e.g. the login email.</span></div>
  <div class="kv"><span class="k">trust proxy</span><span class="v">Express setting deciding how req.ip is read from X-Forwarded-For.</span></div>
  <div class="kv"><span class="k">X-Forwarded-For</span><span class="v">Header listing client and proxy IPs; the leftmost part is client-controlled.</span></div>
  <div class="kv"><span class="k">ThrottlerStorage</span><span class="v">Where counters live; default in-process Map, Redis for several instances.</span></div>
  <div class="kv"><span class="k">Credential stuffing</span><span class="v">Trying passwords leaked elsewhere, spread across many IPs.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Limits are easy; the key you count by is the design decision.</li>
<li>Behind nginx: no <code>trust proxy</code> ⇒ everyone shares a bucket; <code>true</code> ⇒ forged headers bypass it; the hop count ⇒ correct.</li>
<li>In-memory counters multiply with instances (6 instead of 3); share them in Redis.</li>
<li>Per-email limits stop botnets on one account, at the cost of letting an attacker lock that account.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>7.5 — Đếm request cho đúng khó hơn chặn request</h2>
<p class="lead">Bài 7.2 đo được một lần đăng nhập tốn ~50 ms CPU; không có giới hạn, ai cũng thử mật khẩu được nhanh tới mức CPU của bạn cho phép. <code>@nestjs/throttler</code> thêm giới hạn trong ba dòng. Phần khó là <em>đếm cái gì</em>: IP nào là "client" khi đứng sau proxy, hai bản ứng dụng thì sao, và đếm theo IP hay theo tài khoản. Helmet và CORS đã dựng ở bài 3.1, không nhắc lại ở đây.</p>

<h3>Liên hệ đời thường: cây ATM nuốt thẻ</h3>
<p>Sai mã PIN ba lần là ATM giữ thẻ — nó đếm theo <em>thẻ</em>, không theo người đứng trước máy, nên kẻ trộm không xoá được bộ đếm bằng cách nhờ bạn bấm hộ. Nhưng nếu ngân hàng đếm theo <em>toà nhà</em>, một kẻ phá bĩnh ở sảnh sẽ khoá thẻ của mọi khách trong toà. Chọn khoá để đếm chính là toàn bộ bài này.</p>

<h3>1. Phần cơ bản</h3>
<pre><code class="language-ts">${esc(MA_THR)}</code></pre>
<div class="out">${esc(OUT_CB)}</div>
<p>Ở đây đặt ba request mỗi phút (cho dễ thấy): request thứ tư nhận 429 kèm <code>Retry-After: 60</code>; khi còn được phép, phản hồi có <code>X-RateLimit-Limit/Remaining/Reset</code> để client tử tế tự giảm tốc. <code>@SkipThrottle()</code> miễn cho health check — bộ cân bằng tải gọi nó vài giây một lần. Ở mốc 7, mặc định toàn cục là 100/phút/IP.</p>

<h3>2. Đứng sau proxy: IP đó là của ai?</h3>
<p>Trên production, nginx (hoặc bộ cân bằng tải của nhà cung cấp đám mây) đứng trước Nest. Mọi kết nối TCP mà Nest thấy đều từ nginx. nginx <em>nối thêm</em> IP thật của client vào cuối <code>X-Forwarded-For</code>; thứ client tự viết vào đó vẫn đứng ở đầu. Thí nghiệm gửi đúng thứ nginx sẽ chuyển tiếp — một kẻ tấn công ở 5.6.7.8 giả <code>X-Forwarded-For: 10.0.0.N</code>, và một người thật ở 9.9.9.9:</p>
<pre><code class="language-ts">${esc(MA_TAO)}</code></pre>
<div class="out">${esc(OUT_PROXY)}</div>
<table>
<tr><th><code>trust proxy</code></th><th><code>req.ip</code> thành</th><th>Kết quả</th></tr>
<tr><td>không đặt</td><td>IP của nginx cho tất cả</td><td>mọi người chung một xô — 3 request của kẻ tấn công làm người thật bị 429</td></tr>
<tr><td><code>true</code></td><td>mục <em>bên trái nhất</em> của X-Forwarded-For — do client viết</td><td>kẻ tấn công tự chọn "IP" mới mỗi request: lọt 4/4, giới hạn biến mất</td></tr>
<tr><td><code>1</code> (một proxy)</td><td>mục do nginx của bạn thêm</td><td>kẻ tấn công bị chặn, người thật thì không</td></tr>
</table>
<p>Đặt đúng số proxy bạn thật sự chạy (hoặc địa chỉ của chúng), không bao giờ đặt <code>true</code> cho ứng dụng mở ra internet. Mốc 7 đọc giá trị này từ <code>TRUST_PROXY</code> (mặc định 0) để cấu hình đi theo cách triển khai.</p>

<h3>3. Hai bản ứng dụng, giới hạn gấp đôi</h3>
<div class="out">${esc(OUT_HAI)}</div>
<p>Kho đếm mặc định là một <code>Map</code> trong từng tiến trình. Sau bộ cân bằng tải với hai bản, mỗi bản tự đếm phần mình: 6 request lọt qua giới hạn "3 mỗi phút". Với N bản thì giới hạn thật là N × con số đã cấu hình. Kho dùng chung (Redis) sửa được — đó là bài thực hành.</p>

<h3>4. Theo IP hay theo tài khoản?</h3>
<p>Nhồi mật khẩu (credential stuffing) đến từ botnet: mỗi IP chỉ thử vài mật khẩu, thấp hơn xa mọi giới hạn theo IP. Thí nghiệm cho bảy IP cùng đoán mật khẩu của <code>an@fpt.edu.vn</code>:</p>
<div class="out">${esc(OUT_LOGIN)}</div>
<ul>
<li><strong>Theo IP</strong>: cả bảy lần đoán đều qua (401 nghĩa là "sai", không phải "bị chặn").</li>
<li><strong>Theo email</strong> (guard thứ hai chỉ gắn ở route đăng nhập, <code>getTracker</code> trả về email): lần đoán 6 và 7 bị chặn — và <strong>An thật</strong> với mật khẩu đúng cũng bị chặn. Bình không ảnh hưởng. Đếm theo tài khoản bảo vệ được mật khẩu nhưng cho kẻ tấn công khoá một người dùng tuỳ chọn; Lab 10 của khoá Authentication giải bài toán này (cho phép thiết bị quen, CAPTCHA sau N lần sai, báo cho người dùng).</li>
<li>Guard theo email chỉ gắn ở route đăng nhập. Đăng ký nó toàn cục thì mọi request không có email sẽ chung một khoá — cả <code>GET /rooms</code> chung một xô.</li>
</ul>
<p>Mốc 7 còn tìm ra một bẫy nữa: <code>@Throttle({ default: { limit: 5 } })</code> ở route đăng nhập cũng siết luôn bộ đếm <em>theo IP toàn cục</em> của route đó, vì cả hai guard cùng đọc throttler tên <code>default</code>. Cả một phòng máy sau một IP NAT của trường sẽ bị khoá sau năm lần đăng nhập. Cách sửa là một throttler đặt tên riêng — xem ở bài 7.7.</p>

<h3>🕵️ Sự cố thật — 23andMe, tháng 10/2023</h3>
<p>Kẻ tấn công lấy các cặp email/mật khẩu lộ từ trang khác rồi thử trên 23andMe — nhồi mật khẩu. Khoảng 14.000 tài khoản (0,1% người dùng) dùng lại mật khẩu đã lộ. Qua tính năng "DNA Relatives", những tài khoản đó xem được hồ sơ của họ hàng, và dữ liệu của khoảng 6,9 triệu người bị lấy; 23andMe nói hệ thống của chính họ không bị xâm nhập. Giới hạn theo IP gần như vô dụng trước botnet phân tán; giới hạn theo tài khoản, kiểm mật khẩu đã lộ lúc đăng ký (Authentication 2.4) và MFA thì có tác dụng. Bài học lớn hơn là hệ số nhân: một tính năng (họ hàng) biến 14.000 lần đăng nhập bị chiếm thành 6,9 triệu người bị lộ.</p>

<h3>🧪 Thực hành (20 phút)</h3>
<p>Cho hai bản ứng dụng dùng chung một bộ đếm trong Redis. Gói làm sẵn không cài được trên Nest 12:</p>
<div class="out">$ npx npm@11 install @nest-lab/throttler-storage-redis@1.2.0
npm error ERESOLVE unable to resolve dependency tree
npm error Found: @nestjs/common@12.6.0
npm error peer @nestjs/common@"^7.0.0 || ^8.0.0 || ^9.0.0 || ^10.0.0 || ^11.0.0" from @nest-lab/throttler-storage-redis@1.2.0</div>
<p>Vậy hãy tự cài interface <code>ThrottlerStorage</code> bằng <code>ioredis</code>: <code>increment(key, ttl, limit, blockDuration, name)</code> phải trả <code>{ totalHits, timeToExpire, isBlocked, timeToBlockExpire }</code>.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<pre><code class="language-ts">${esc(MA_BT2)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>3 request lọt trên cả hai bản. <code>INCR</code> của Redis là nguyên tử, nên hai bản cùng tăng một lúc không thể cùng đọc ra "2". Tên khoá cho thấy throttler băm tracker (IP) trước khi lưu — IP gốc không nằm trong Redis. Thay cho tự viết: <code>--legacy-peer-deps</code> vẫn cài được gói kia (chạy thử --dry-run in <code>add @nest-lab/throttler-storage-redis 1.2.0</code> — kèm <code>removed 3 packages</code> khỏi cây phụ thuộc), nhưng khi đó chưa ai thử nó với Nest 12 — 20 dòng ở trên dễ tin và dễ test hơn.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Giới hạn tần suất cho API NestJS thế nào?</strong> <code>ThrottlerModule.forRoot</code> + <code>ThrottlerGuard</code> làm <code>APP_GUARD</code>; chỉnh theo route bằng <code>@Throttle</code>, miễn bằng <code>@SkipThrottle</code>.</li>
<li><strong>Cái gì hỏng khi đứng sau bộ cân bằng tải?</strong> IP của client (đặt <code>trust proxy</code> bằng số hop, không bao giờ <code>true</code>) và bộ đếm trong bộ nhớ của từng bản (dùng Redis).</li>
<li><strong>Chặn nhồi mật khẩu thế nào?</strong> Giới hạn theo tài khoản ở login, kiểm mật khẩu đã lộ, MFA, cảnh báo bất thường; chỉ giới hạn theo IP thì không cản được botnet.</li>
<li><strong><code>X-Forwarded-For</code> chứa gì, tin được phần nào?</strong> Danh sách các chặng; chỉ tin những mục do proxy của bạn thêm — đếm từ bên phải.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Hỏi đội DevOps ba câu trước khi đặt bất kỳ giới hạn nào: trước ứng dụng có mấy proxy (đó là <code>trust proxy</code> của bạn), chạy bao nhiêu bản (có cần kho dùng chung không), và người dùng của khách hàng có ngồi sau một NAT công ty không (cả một văn phòng có thể trông như một IP — một chi nhánh ngân hàng, một cơ sở FPT). Sau đó chọn con số từ log lưu lượng thật, không phải từ một bài blog.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ThrottlerGuard</span><span class="v">Đếm request theo khoá tracker trong mỗi cửa sổ thời gian; quá giới hạn ⇒ 429 + Retry-After.</span></div>
  <div class="kv"><span class="k">getTracker</span><span class="v">Quyết định đếm cái gì: mặc định là IP, hoặc ví dụ email đăng nhập.</span></div>
  <div class="kv"><span class="k">trust proxy</span><span class="v">Thiết lập của Express quyết định req.ip đọc từ X-Forwarded-For thế nào.</span></div>
  <div class="kv"><span class="k">X-Forwarded-For</span><span class="v">Header liệt kê IP của client và các proxy; phần bên trái do client kiểm soát.</span></div>
  <div class="kv"><span class="k">ThrottlerStorage</span><span class="v">Chỗ giữ bộ đếm; mặc định Map trong tiến trình, Redis khi có nhiều bản.</span></div>
  <div class="kv"><span class="k">Nhồi mật khẩu (credential stuffing)</span><span class="v">Thử mật khẩu đã lộ ở nơi khác, rải trên rất nhiều IP.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đặt giới hạn thì dễ; khoá để đếm mới là quyết định thiết kế.</li>
<li>Sau nginx: không đặt <code>trust proxy</code> ⇒ mọi người chung một xô; <code>true</code> ⇒ header giả vượt qua; số hop ⇒ đúng.</li>
<li>Bộ đếm trong bộ nhớ nhân lên theo số bản (6 thay vì 3); dùng chung trong Redis.</li>
<li>Giới hạn theo email chặn được botnet nhắm một tài khoản, đổi lại kẻ tấn công khoá được tài khoản đó.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
