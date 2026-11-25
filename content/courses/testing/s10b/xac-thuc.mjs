/**
 * Testing · Chương 10B · 10B.3 — API có xác thực: JWT, token hết hạn, OAuth 2.0 client credentials, token giả mạo. BÀI MỚI 24/11/2026, slug tst-10b-3-xac-thuc.
 * Chạy thật: server TOKEN_TTL=2 (pmn-api-ttl :43181) — đăng nhập một lần ⇒ 2/3 request 401; làm mới trong pre-request ⇒ 3/3 xanh;
 * /oauth/token client credentials (không secret ⇒ 401, có ⇒ 200); alg none / sửa role / rác ⇒ 401; pre-request gõ sai ⇒ vẫn gửi, test ✓, exit 1.
 * Sự cố thật: CloudSEK 23/12/2024 — hơn 30.000 workspace Postman công khai lộ khoá/token.
 */
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const lines = (t) => t.split('\n');
const bo = (t) => lines(t).filter((l) => l.trim() !== '' && !/^[├┌└]|│ +(iterations|requests|test-scripts|prerequest|total|average)|data received|^newman$|at assertion|^\s*[┌└]$/.test(l)).join('\n');
const tach = (t) => {
  const a = lines(t);
  const i = a.findIndex((l, k) => k > 0 && l.startsWith('$ '));
  return [a.slice(0, i).join('\n'), a.slice(i).join('\n')];
};
const [TTL1, TTL2] = (() => { const a = lines(OUT['b3-ttl']); const idx = a.map((l, k) => (l.startsWith('$ ') ? k : -1)).filter((k) => k >= 0); return [a.slice(idx[1], idx[2]).join('\n'), a.slice(idx[2]).join('\n')]; })();
const OAUTH_NO = bo(OUT['b3-oauth-nosecret']).replace(/ *│ `Using "btoa" is deprecated[^\n]*\n *│ tead\.`\n/, '');
const OAUTH_OK = bo(OUT['b3-oauth']);
const BAD = bo(OUT['b3-bad']);
const TYPO = bo(OUT['b3-typo']);
const LO = OUT['b3-lo'];
const GUARD = lines(OUT['th3-typo']).filter((l) => /✓|^  [0-9]+[.⠄]|Authorization|│ +assertions/.test(l)).join('\n');

const PV_EN = `<ol>
<li><strong>“How do you handle auth in a Postman collection?”</strong> Log in once in a request (or in a collection pre-request script), save the token in a collection variable, set Bearer <code>{{token}}</code> on the collection so every request inherits it, and override per request for other roles or <em>No Auth</em>.</li>
<li><strong>“Your nightly run starts failing with 401 halfway.”</strong> The token outlived its TTL during the run. Refresh in the collection pre-request when it is missing or about to expire — measured here: 2 of 3 requests 401 without, 3 of 3 green with.</li>
<li><strong>“What is client credentials?”</strong> The OAuth 2.0 grant for a machine with no user: POST <code>grant_type=client_credentials</code> with the client id and secret (HTTP Basic) to the token endpoint, get an access token with a scope.</li>
<li><strong>“Which security tests would you add to a collection?”</strong> Tokens the API must refuse: missing, garbage, signature stripped (<code>alg: none</code>), payload changed under an old signature, expired; plus one user reading another's resource (IDOR) and a student calling an admin route.</li>
<li><strong>“Where do you keep secrets?”</strong> Not in the collection, not in a shared environment's initial value. CI secrets injected with <code>--env-var</code>; locally in current values or a vault.</li>
</ol>`;
const PV_VI = `<ol>
<li><strong>“Xử lý xác thực trong collection Postman thế nào?”</strong> Đăng nhập một lần bằng một request (hoặc trong pre-request script của collection), lưu token vào biến collection, đặt Bearer <code>{{token}}</code> ở collection để mọi request kế thừa, và ghi đè ở từng request cho vai trò khác hoặc <em>No Auth</em>.</li>
<li><strong>“Lượt chạy đêm bắt đầu 401 giữa chừng.”</strong> Token sống quá TTL ngay trong lượt chạy. Làm mới ở pre-request của collection khi chưa có hoặc sắp hết hạn — đo ở đây: không làm mới 2/3 request 401, có làm mới 3/3 xanh.</li>
<li><strong>“Client credentials là gì?”</strong> Luồng OAuth 2.0 cho một cỗ máy không có người dùng: POST <code>grant_type=client_credentials</code> kèm client id và secret (HTTP Basic) tới token endpoint, nhận access token có scope.</li>
<li><strong>“Bạn thêm test bảo mật nào vào collection?”</strong> Những token API phải từ chối: thiếu, rác, bị gỡ chữ ký (<code>alg: none</code>), sửa payload dưới chữ ký cũ, hết hạn; cộng một người đọc tài nguyên của người khác (IDOR) và sinh viên gọi route admin.</li>
<li><strong>“Bí mật để đâu?”</strong> Không trong collection, không ở initial value của environment dùng chung. Bí mật CI bơm vào bằng <code>--env-var</code>; ở máy mình thì để current value hoặc một kho bí mật.</li>
</ol>`;

export default {
  title: '10B.3 — Testing APIs behind authentication: JWT, expiry, OAuth 2.0 and forged tokens|||10B.3 — Test API có xác thực: JWT, hết hạn, OAuth 2.0 và token giả mạo',
  slug: 'tst-10b-3-xac-thuc',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Auth kế thừa từ collection và ghi đè ở request; token 2 giây giết lượt chạy giữa chừng (đo thật) và cách làm mới trong pre-request; OAuth 2.0 client credentials với pm.sendRequest; bốn token API phải từ chối (alg none, sửa role, rác) và cái bẫy pre-request lỗi mà test vẫn xanh; sự cố CloudSEK 2024 hơn 30.000 workspace Postman lộ bí mật, và báo cáo HTML chứa mật khẩu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10B · Lesson 10B.3</span>
<h2>Testing APIs behind authentication: JWT, expiry, OAuth 2.0 and forged tokens</h2>
<p class="lead">Nearly every real API wants a token. This lesson gets one, keeps it alive through a long run, gets a machine token with OAuth 2.0, and then attacks the API with tokens it must refuse — the security tests a collection is good at.</p>

<h3>Auth that requests inherit</h3>
<p>On the collection: <em>Authorization → Bearer Token → <code>{{tokenAn}}</code></em>. Each request's Authorization tab says <em>Inherit auth from parent</em> by default; you override where you need another person (<code>{{tokenBinh}}</code>, <code>{{tokenBoss}}</code>) or none at all (login, “No token”). In the JSON this is the <code>auth</code> block you saw in 10B.1 — <code>"type": "noauth"</code> on a request switches inheritance off. The login tests save the tokens (10B.2). So far so good — until a token expires in the middle of a run.</p>

<h3>A token that dies mid-run — measured</h3>
<p>Real tokens live minutes, not hours. A second server with <code>TOKEN_TTL=2</code> makes the problem visible in seconds; <code>--delay-request 1500</code> waits 1.5 s before each request, like a slow nightly run. Collection A logs in once and then reads three times:</p>
${ra(TTL1)}
<p>The first read is still within the token's life; the next two are not. Collection B instead puts this in the <strong>collection pre-request script</strong>, so it runs before every request:</p>
${ma('javascript', CODE.refresh)}
${ra(TTL2)}
<p>Each request got a fresh token because 1.5 s of waiting left less than the 1-second margin. With a real 15-minute token the same script logs in once and then only when needed. Why only 1.x seconds instead of 2? The server writes <code>iat</code> rounded down to whole seconds, so a “2-second” token can be up to one second older than you think — keep a margin.</p>
<p>The <code>pm.sendRequest</code> call needs the URL built with <code>pm.variables.replaceIn</code> and its own headers: as 10B.2 measured, it inherits nothing from the collection.</p>

<h3>OAuth 2.0 client credentials</h3>
<p>A reporting bot has no user and no password form. OAuth 2.0 (RFC 6749 §4.4) gives it the <strong>client credentials</strong> grant: send its client id and secret to the token endpoint, receive an access token with a scope. Our server's <code>/oauth/token</code> does exactly that for <code>report-bot</code>. In the Postman app you can let the <em>Authorization → OAuth 2.0</em> helper fetch the token (<em>Get New Access Token</em>, with auto-refresh in recent versions); in a collection that must also run in Newman, a pre-request script is explicit and portable:</p>
${ma('javascript', CODE.oauth)}
<p>The secret is <em>not</em> in the collection — its value is empty. Run without it, then with it injected the way CI will:</p>
${ra(OAUTH_NO)}
${ra(OAUTH_OK)}
<p>Newman prints a deprecation note for the global <code>btoa</code>; it still works in 6.2.3, and the message names the replacement. The first run is the important one: a missing secret is a loud 401, not a silently skipped test.</p>

<h3>Tokens the API must refuse</h3>
<p>Here a collection shines: one request per forged token, all expecting 401. The pre-request scripts build the tokens:</p>
${ma('javascript', CODE.algNone)}
${ma('javascript', CODE.tamper)}
${ma('javascript', CODE.negTest)}
${ra(BAD)}
<p>The first token says <code>alg: none</code> and has no signature — the 2015 class of JWT library bugs where a server trusted the header's choice of algorithm. The second keeps An's real signature but claims <code>ADMIN</code> in the payload. Our API pins <code>HS256</code> and checks the signature, so all three are refused.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — a broken pre-request still sends the request.</strong> Misspell one variable in the tampering script (<code>'tokn'</code>) and watch:</p>
${ra(TYPO)}
<p>The script crashed before setting <code>{{bad}}</code>, Postman sent the request anyway with the literal text <code>{{bad}}</code> as the token, the API refused it — and “refused with 401” is ✓. The forged-token test tested nothing. Newman still exits 1 because the script error counts as a failure, but in the Postman app's test results you see one green test. Read the errors, not just the ticks.</p></div>

<h3>🕵️ Hacker corner: secrets in collections (CloudSEK, 2024)</h3>
<p>On 23 December 2024 the CloudSEK TRIAD team published a year-long investigation: more than <strong>30,000 public Postman workspaces</strong> were leaking access tokens, refresh tokens and third-party API keys — reported in the press as including GitHub, Slack, Salesforce and payment-provider credentials. Most came from developers who saved a real token as an initial value or pasted it in a header, then set the workspace to public. Postman responded with secret detection and alerts on public workspaces. Separately, Truffle Security counted thousands of live credentials in public Postman data.</p>
<p>Your own run leaks too, in a quieter way. Measured on this collection (password as a collection variable, tokens set during the run):</p>
${ra(LO)}
<p>The exported collection kept the password but not the run's tokens. The JUnit XML holds neither. The Newman JSON report and the <code>htmlextra</code> HTML report hold the password and the tokens many times — they record every request and response. Upload that HTML as a CI artifact of a public repository and anyone can download it. Rules: secrets come from CI (<code>--env-var</code>), demo-only accounts in test environments, short-lived tokens, and JUnit (not full HTML) as the artifact of public builds.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Add a request “Expired token is refused”: in its pre-request, log in on the TTL-2 server, wait until the token is dead, and use it.</li>
<li>Protect the forged-token tests against the trap above.</li>
</ol>
<details><summary>Solution</summary>
<p>1. Waiting inside a script is the wrong tool (the sandbox has <code>setTimeout</code>, but you would slow every run); use the runner instead: a request “Login (TTL 2 s)” that saves <code>expiredToken</code>, then “Expired token is refused” with Bearer <code>{{expiredToken}}</code>, and run that folder with <code>--delay-request 2500</code> — exactly Collection A above, where the reads after the token died answered 401.</p>
<p>2. First line of each forged-token test: <code>pm.test('the forged token was really sent', () =&gt; pm.expect(pm.request.headers.get('Authorization')).to.not.include('{{'));</code> — with the typo (a <code>console.log</code> of the header added to show what was sent):</p>
${ra(GUARD)}
<p>The guard is red, the misleading ✓ is now next to a red line that names the cause. On the three correct forged-token requests the guard is ✓ (6 assertions, 0 failed).</p>
</details>
<p><strong>Done when</strong> the typo version of the tampering request shows a red test, not a green one.</p>
</div>

<h3>In real life</h3>
<p>A token is a day pass at a theme park. You get it at the gate (login), show it at every ride (Bearer header), and it stops working at closing time (expiry). A collection that buys one pass at 9:00 for a run that lasts until 18:00 will be turned away at the afternoon rides — buy a new one at the gate when the old one is about to expire.</p>
<p><strong>On a project:</strong> the customer gives your team one shared “QA admin” account for UAT. Someone puts its password in the team workspace as an initial value “just for now”. Six months later the workspace is made public for a partner. That is the CloudSEK story in one sentence. Ask for per-person or per-pipeline credentials, and put shared secrets in the CI secret store from day one.</p>

<h3>🎤 What an interviewer will ask</h3>
${PV_EN}

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">inherit auth</span><span class="v">A request uses the auth of its folder/collection unless it overrides it.</span></div>
  <div class="kv"><span class="k">TTL / exp</span><span class="v">How long a token lives / the JWT claim with its expiry time.</span></div>
  <div class="kv"><span class="k">client credentials</span><span class="v">OAuth 2.0 grant for a machine client: id + secret → access token.</span></div>
  <div class="kv"><span class="k">scope</span><span class="v">What an access token is allowed to do, e.g. <code>bookings:read</code>.</span></div>
  <div class="kv"><span class="k">alg: none</span><span class="v">An unsigned JWT; a server must never accept it.</span></div>
  <div class="kv"><span class="k">pm.sendRequest</span><span class="v">Send another HTTP request from a script; inherits no auth.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Bearer auth on the collection, overridden per request for other roles.</li>
<li>Measured: a 2-second token killed 2 of 3 requests; refreshing in the collection pre-request made all 3 green.</li>
<li>Client credentials in a pre-request script, secret injected by CI — missing secret is a loud 401.</li>
<li>Forged tokens (alg none, changed role, garbage) must all be 401 — and check the forged token was actually sent.</li>
<li>Secrets leak through public workspaces (CloudSEK 2024: 30,000+) and through full HTML reports.</li>
</ul>
${lienKet({ khoa: 'testing', bai: 'tst-5-2-xac-thuc', title: 'Back to 5.2 — 401, 403, 404 and IDOR with Supertest', sub: 'The same rules tested from inside, with a controllable clock.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'authentication', bai: 'auth-4-2-truong-alg', title: 'Authentication — 4.2: the alg field', sub: 'Why alg none and algorithm confusion broke JWT libraries.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'authentication', bai: 'auth-8-1-oauth-la-gi', title: 'Authentication — 8.1: what OAuth is', sub: 'All the grants, and which one fits which client.', cta: 'OPEN LESSON →' })}
${nguon('🕵️', 'CloudSEK — Postman data leaks: the hidden risks lurking in your workspaces', '23 Dec 2024: 30,000+ public workspaces leaking tokens and keys.', 'https://www.cloudsek.com/blog/postman-data-leaks-the-hidden-risks-lurking-in-your-workspaces')}
${nguon('🕵️', 'Truffle Security — Postman carries lots of secrets', 'A separate count of live credentials in public Postman data.', 'https://trufflesecurity.com/blog/postman-carries-lots-of-secrets')}
${nguon('📘', 'RFC 6749 §4.4 — Client Credentials Grant', 'The OAuth 2.0 standard.', 'https://datatracker.ietf.org/doc/html/rfc6749#section-4.4')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10B · Bài 10B.3</span>
<h2>Test API có xác thực: JWT, hết hạn, OAuth 2.0 và token giả mạo</h2>
<p class="lead">Gần như API thật nào cũng đòi token. Bài này lấy một token, giữ nó sống qua một lượt chạy dài, lấy token cho máy bằng OAuth 2.0, rồi tấn công API bằng những token nó phải từ chối — loại test bảo mật mà collection làm rất tốt.</p>

<h3>Auth để request kế thừa</h3>
<p>Ở collection: <em>Authorization → Bearer Token → <code>{{tokenAn}}</code></em>. Thẻ Authorization của từng request mặc định là <em>Inherit auth from parent</em>; bạn ghi đè chỗ cần người khác (<code>{{tokenBinh}}</code>, <code>{{tokenBoss}}</code>) hoặc không cần gì (đăng nhập, “No token”). Trong JSON đó là khối <code>auth</code> bạn đã thấy ở 10B.1 — <code>"type": "noauth"</code> trên một request là tắt kế thừa. Test đăng nhập lưu token (10B.2). Mọi thứ ổn — cho tới khi token hết hạn giữa lượt chạy.</p>

<h3>Token chết giữa lượt chạy — đo thật</h3>
<p>Token thật sống vài phút, không phải vài giờ. Một server thứ hai với <code>TOKEN_TTL=2</code> làm vấn đề lộ ra trong vài giây; <code>--delay-request 1500</code> chờ 1,5 giây trước mỗi request, như một lượt chạy đêm chậm. Collection A đăng nhập một lần rồi đọc ba lần:</p>
${ra(TTL1)}
<p>Lần đọc đầu còn trong đời token; hai lần sau thì không. Collection B thay vào đó đặt đoạn này trong <strong>pre-request script của collection</strong>, chạy trước mọi request:</p>
${ma('javascript', CODE.refresh)}
${ra(TTL2)}
<p>Request nào cũng được token mới vì chờ 1,5 giây là còn ít hơn biên 1 giây. Với token thật 15 phút, cùng script này đăng nhập một lần rồi chỉ khi cần. Vì sao chỉ sống 1,x giây chứ không phải 2? Server ghi <code>iat</code> làm tròn xuống giây, nên token “2 giây” có thể đã già hơn bạn nghĩ tới một giây — luôn chừa biên.</p>
<p>Lời gọi <code>pm.sendRequest</code> cần URL dựng bằng <code>pm.variables.replaceIn</code> và header riêng: như 10B.2 đã đo, nó không kế thừa gì từ collection.</p>

<h3>OAuth 2.0 client credentials</h3>
<p>Một bot làm báo cáo không có người dùng, không có ô mật khẩu. OAuth 2.0 (RFC 6749 §4.4) cho nó luồng <strong>client credentials</strong>: gửi client id và secret tới token endpoint, nhận access token kèm scope. <code>/oauth/token</code> của server ta làm đúng như vậy cho <code>report-bot</code>. Trong ứng dụng Postman bạn có thể để trợ thủ <em>Authorization → OAuth 2.0</em> tự lấy token (<em>Get New Access Token</em>, bản mới có tự làm mới); với collection còn phải chạy trong Newman, pre-request script rõ ràng và mang đi đâu cũng chạy:</p>
${ma('javascript', CODE.oauth)}
<p>Secret <em>không</em> nằm trong collection — giá trị của nó để trống. Chạy khi thiếu nó, rồi khi bơm vào theo đúng cách CI sẽ làm:</p>
${ra(OAUTH_NO)}
${ra(OAUTH_OK)}
<p>Newman in một lời nhắc ngừng hỗ trợ cho <code>btoa</code> toàn cục; ở 6.2.3 nó vẫn chạy, và lời nhắc nêu sẵn cái thay thế. Lượt đầu mới quan trọng: thiếu secret là một lỗi 401 to rõ, không phải một test lặng lẽ bị bỏ qua.</p>

<h3>Những token API phải từ chối</h3>
<p>Chỗ này collection toả sáng: mỗi token giả một request, tất cả chờ 401. Pre-request script dựng token:</p>
${ma('javascript', CODE.algNone)}
${ma('javascript', CODE.tamper)}
${ma('javascript', CODE.negTest)}
${ra(BAD)}
<p>Token đầu ghi <code>alg: none</code> và không có chữ ký — lớp lỗi thư viện JWT năm 2015, khi server tin lựa chọn thuật toán ghi trong header. Token thứ hai giữ chữ ký thật của An nhưng khai <code>ADMIN</code> trong payload. API của ta ghim <code>HS256</code> và kiểm chữ ký, nên cả ba bị từ chối.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — pre-request lỗi vẫn gửi request.</strong> Gõ sai một tên biến trong script sửa token (<code>'tokn'</code>) rồi xem:</p>
${ra(TYPO)}
<p>Script chết trước khi đặt <code>{{bad}}</code>, Postman vẫn gửi request với nguyên chữ <code>{{bad}}</code> làm token, API từ chối — và “refused with 401” được ✓. Test token giả chẳng kiểm gì. Newman vẫn thoát 1 vì lỗi script tính là thất bại, nhưng trong kết quả test của ứng dụng Postman bạn thấy một test xanh. Đọc lỗi, không chỉ đọc dấu tích.</p></div>

<h3>🕵️ Góc hacker: bí mật trong collection (CloudSEK, 2024)</h3>
<p>Ngày 23/12/2024 nhóm TRIAD của CloudSEK công bố một cuộc điều tra kéo dài một năm: hơn <strong>30.000 workspace Postman công khai</strong> đang làm lộ access token, refresh token và khoá API của bên thứ ba — báo chí đưa tin có cả thông tin đăng nhập GitHub, Slack, Salesforce và cổng thanh toán. Phần lớn đến từ lập trình viên lưu token thật làm initial value hoặc dán vào header, rồi đặt workspace thành công khai. Postman đáp lại bằng tính năng phát hiện bí mật và cảnh báo trên workspace công khai. Một nghiên cứu riêng của Truffle Security đếm được hàng nghìn thông tin đăng nhập còn sống trong dữ liệu Postman công khai.</p>
<p>Lượt chạy của chính bạn cũng rò, theo kiểu lặng lẽ hơn. Đo trên collection này (mật khẩu là biến collection, token được đặt trong lượt chạy):</p>
${ra(LO)}
<p>Collection xuất ra giữ mật khẩu nhưng không giữ token của lượt chạy. JUnit XML không chứa cái nào. Báo cáo JSON của Newman và báo cáo HTML <code>htmlextra</code> chứa mật khẩu và token nhiều lần — chúng ghi lại mọi request và phản hồi. Tải tệp HTML đó lên làm artifact CI của một repo công khai là ai cũng tải về được. Quy tắc: bí mật lấy từ CI (<code>--env-var</code>), tài khoản chỉ để demo trong môi trường test, token sống ngắn, và artifact của build công khai là JUnit (không phải HTML đầy đủ).</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Thêm request “Expired token is refused”: trong pre-request, đăng nhập vào server TTL 2 giây, chờ token chết rồi dùng nó.</li>
<li>Bảo vệ các test token giả khỏi cái bẫy ở trên.</li>
</ol>
<details><summary>Lời giải</summary>
<p>1. Chờ trong script là sai công cụ (sandbox có <code>setTimeout</code>, nhưng bạn sẽ làm chậm mọi lượt chạy); hãy dùng trình chạy: một request “Login (TTL 2 s)” lưu <code>expiredToken</code>, rồi “Expired token is refused” với Bearer <code>{{expiredToken}}</code>, và chạy folder đó với <code>--delay-request 2500</code> — đúng như Collection A ở trên, nơi các lần đọc sau khi token chết trả 401.</p>
<p>2. Dòng đầu của mỗi test token giả: <code>pm.test('the forged token was really sent', () =&gt; pm.expect(pm.request.headers.get('Authorization')).to.not.include('{{'));</code> — với lỗi gõ sai (thêm một <code>console.log</code> header để thấy thứ đã gửi):</p>
${ra(GUARD)}
<p>Rào chắn đỏ, dấu ✓ đánh lừa giờ nằm cạnh một dòng đỏ gọi đúng tên nguyên nhân. Trên ba request token giả viết đúng, rào chắn ✓ (6 assertion, 0 đỏ).</p>
</details>
<p><strong>Xong khi</strong> bản gõ sai của request sửa token hiện một test đỏ, không phải xanh.</p>
</div>

<h3>Liên hệ đời thường</h3>
<p>Token là vé ngày ở công viên giải trí. Bạn lấy ở cổng (đăng nhập), đưa ra ở mỗi trò chơi (header Bearer), và nó hết hiệu lực lúc đóng cửa (hết hạn). Một collection mua đúng một vé lúc 9 giờ cho lượt chạy kéo tới 18 giờ sẽ bị từ chối ở các trò buổi chiều — ra cổng mua vé mới khi vé cũ sắp hết hạn.</p>
<p><strong>Ở dự án:</strong> khách hàng đưa cả đội một tài khoản “QA admin” dùng chung cho UAT. Ai đó để mật khẩu của nó trong workspace của đội làm initial value “tạm thời thôi”. Sáu tháng sau workspace được mở công khai cho một đối tác. Đó là câu chuyện CloudSEK trong một câu. Hãy xin thông tin đăng nhập riêng cho từng người hoặc từng pipeline, và đưa bí mật dùng chung vào kho bí mật của CI ngay từ ngày đầu.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
${PV_VI}

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">inherit auth (kế thừa auth)</span><span class="v">Request dùng auth của folder/collection trừ khi tự ghi đè.</span></div>
  <div class="kv"><span class="k">TTL / exp</span><span class="v">Token sống bao lâu / claim JWT chứa thời điểm hết hạn.</span></div>
  <div class="kv"><span class="k">client credentials</span><span class="v">Luồng OAuth 2.0 cho client là máy: id + secret → access token.</span></div>
  <div class="kv"><span class="k">scope (phạm vi)</span><span class="v">Access token được phép làm gì, ví dụ <code>bookings:read</code>.</span></div>
  <div class="kv"><span class="k">alg: none</span><span class="v">JWT không ký; server không bao giờ được chấp nhận.</span></div>
  <div class="kv"><span class="k">pm.sendRequest</span><span class="v">Gửi thêm một request HTTP từ trong script; không kế thừa auth.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Auth Bearer đặt ở collection, ghi đè ở từng request cho vai trò khác.</li>
<li>Đo được: token 2 giây giết 2/3 request; làm mới ở pre-request của collection thì 3/3 xanh.</li>
<li>Client credentials trong pre-request script, secret do CI bơm vào — thiếu secret là lỗi 401 to rõ.</li>
<li>Token giả (alg none, sửa role, rác) đều phải là 401 — và kiểm rằng token giả thực sự đã được gửi.</li>
<li>Bí mật rò qua workspace công khai (CloudSEK 2024: hơn 30.000) và qua báo cáo HTML đầy đủ.</li>
</ul>
${lienKet({ khoa: 'testing', bai: 'tst-5-2-xac-thuc', title: 'Quay lại 5.2 — 401, 403, 404 và IDOR bằng Supertest', sub: 'Cùng các luật, test từ bên trong với đồng hồ điều khiển được.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'authentication', bai: 'auth-4-2-truong-alg', title: 'Khoá Authentication — 4.2: trường alg', sub: 'Vì sao alg none và nhầm thuật toán đã làm vỡ các thư viện JWT.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'authentication', bai: 'auth-8-1-oauth-la-gi', title: 'Khoá Authentication — 8.1: OAuth là gì', sub: 'Mọi luồng cấp quyền, và luồng nào hợp client nào.', cta: 'MỞ BÀI →' })}
${nguon('🕵️', 'CloudSEK — Postman data leaks: the hidden risks lurking in your workspaces', '23/12/2024: hơn 30.000 workspace công khai lộ token và khoá.', 'https://www.cloudsek.com/blog/postman-data-leaks-the-hidden-risks-lurking-in-your-workspaces')}
${nguon('🕵️', 'Truffle Security — Postman carries lots of secrets', 'Một con số riêng về thông tin đăng nhập còn sống trong dữ liệu Postman công khai.', 'https://trufflesecurity.com/blog/postman-carries-lots-of-secrets')}
${nguon('📘', 'RFC 6749 §4.4 — Client Credentials Grant', 'Chuẩn OAuth 2.0.', 'https://datatracker.ietf.org/doc/html/rfc6749#section-4.4')}
</div>
`,
};
