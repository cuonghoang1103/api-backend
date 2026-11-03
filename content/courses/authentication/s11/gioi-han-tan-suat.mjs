/**
 * Authentication · Chương 11 · 11.3 — Giới hạn tần suất sống nổi với lưu lượng thật. Slug giữ: auth-11-3-gioi-han-tan-suat.
 * Code THẬT từ _ma.mjs (src/ops/ratelimit.js) + output demo11/ratelimit.mjs (LabFlow ID v0.11).
 */
import G from '../giang/auth-11-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const NGUON_EN = [
  nguon('🛡️', 'OWASP — Denial of Service Cheat Sheet', 'Rate limiting as a DoS/abuse control: keys, thresholds, failing open (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html'),
  nguon('🛡️', 'OWASP — Credential Stuffing Prevention Cheat Sheet', 'Rate limiting in the stuffing-defence context — the layer under Chapter 10 (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html'),
].join('\n');
const NGUON_VI = [
  nguon('🛡️', 'OWASP — Denial of Service Cheat Sheet', 'Giới hạn tần suất như một control chống DoS/lạm dụng: khoá, ngưỡng, hỏng mở (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html'),
  nguon('🛡️', 'OWASP — Credential Stuffing Prevention Cheat Sheet', 'Giới hạn tần suất trong bối cảnh phòng thủ nhồi — lớp dưới Chương 10 (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html'),
].join('\n');

export default {
  title: '11.3 — Rate limiting that survives real traffic|||11.3 — Giới hạn tần suất sống nổi với lưu lượng thật',
  slug: 'auth-11-3-gioi-han-tan-suat',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Chương 10 phòng thủ nhồi bằng một quyết định; bài này là CÁI ĐẾM sau nó. Lỗi kinh điển: một cái đếm trong-tiến-trình — với N instance sau load balancer, mỗi cái thấy phần của nó nên giới hạn thật là N lần. Cái đếm phải CHUNG (Redis). Cửa sổ cố định: allow() tăng đếm mỗi khoá mỗi cửa sổ, dưới giới hạn là ok, trên bị chặn, reset khi cửa sổ lăn. Đo thật: 5 request ip-A qua, cái 6–7 bị chặn cùng cửa sổ; ip-B độc lập; ip-A cửa sổ sau reset. Giới hạn theo ĐÚNG khoá (IP + tài khoản + tuyến — chỉ-IP thua botnet, chỉ-tài-khoản mời lockout DoS Ch10). HỎNG MỞ nếu Redis sập (hỏng đóng = một sự cố cache thành sự cố đăng nhập toàn phần). Trả 429 + Retry-After (giới hạn client không thấy = không lùi được). Cửa sổ cố định có đợt bùng ở rìa; sliding window/token bucket mượt hơn. Là một lớp DƯỚI decide() của Ch10. Theo OWASP DoS + Credential Stuffing.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>Rate limiting that survives real traffic</h2>
<p class="lead">Chapter 10 defended credential stuffing with a decision — allow, challenge or block. This lesson is the counter behind it: the thing that actually measures how many requests a key has made. It is simple to get subtly wrong in a way that only shows up in production, under load, across more than one instance.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> explain why a rate-limit counter must be shared across instances; implement a fixed-window limiter keyed correctly; and make it fail open and tell the client, so the protection never becomes the outage.</p>
</div>

<h3>The limiter that only works on one node</h3>
<p>The classic mistake is an in-process counter. With N instances behind a load balancer, each instance sees only its share of the traffic, so a "100 per minute" limit actually allows 100×N per minute across the fleet. The counter has to live where <em>every</em> instance sees it — Redis. An in-memory <code>Map</code> is fine for one process and for a demo; production shares the counter.</p>

<h3>Fixed window</h3>
<p>The simplest shared counter: a count per key per time window. <code>allow()</code> increments the key's count in the current window and says whether it is under the limit:</p>
${ma('javascript', CODE.ratelimit)}
<p>The key-and-window pair (<code>\`\${key}:\${windowStart}\`</code>) is the Redis key; the count resets automatically when the window rolls over, because the next window is a different Redis key.</p>

<h3>The measured limiter</h3>
${ra(OUT['113-ratelimit'])}
<p>Five requests from <code>ip-A</code> pass, the sixth and seventh are blocked in the same window; <code>ip-B</code> is independent (one key's flood does not throttle another); <code>ip-A</code> in the next window resets. The limit holds per key, shared across the counter.</p>

<h3>Limit by the right key</h3>
<p>What you key on <em>is</em> the design: per IP (stops a single source), per account (stops targeting one user), per route (login is stricter than a public GET). Often all three at once. The wrong key limits the wrong thing — per-IP alone fails against a botnet spread over thousands of IPs; per-account alone invites the account-lockout DoS of Chapter 10. Rate limiting and Chapter 10's <code>decide()</code> work together: the limiter stops raw volume, the decision tells a spraying attacker from a mistyping user.</p>

<h3>Fail open, and tell the client</h3>
<p>Two rules keep the limiter from becoming the outage. <strong>Fail open:</strong> if Redis is down, allow the request — a limiter that fails closed turns a cache blip into a total login outage, because nobody can log in when the counter cannot be read. <strong>Tell the client:</strong> return <code>429</code> with a <code>Retry-After</code> header. A limit the client cannot see is a limit it cannot back off from — it just retries harder and makes things worse.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — the fixed-window edge burst.</strong> Five requests at 0.999s and five at 1.001s is ten in two milliseconds, because they fall in two different windows. For auth endpoints the fixed window is usually fine; when the edge burst actually matters (a hard per-second cap), reach for a sliding window or a token bucket, which smooth the boundary. Know the limitation before you rely on the limiter.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"Why can't the rate-limit counter be in memory?"</strong> — With N instances, each sees 1/N of the traffic, so the real limit is N× what you set. The counter must be shared (Redis).</li>
<li><strong>"What should happen if Redis is down?"</strong> — Fail open — allow the request. Failing closed turns a cache outage into a full login outage.</li>
<li><strong>"How does the client know it is rate-limited?"</strong> — A <code>429</code> with <code>Retry-After</code>, so a well-behaved client backs off instead of retrying harder.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo11/ratelimit.mjs</code>. Why does <code>ip-B</code> still pass while <code>ip-A</code> is being blocked in the same window?</li>
<li>Your API runs on four instances with an in-memory limiter set to 100/min. What is the real limit, and how do you fix it?</li>
<li>Why must the limiter fail open if the store is down?</li>
</ol>
<p><strong>Solution:</strong> (1) the counter is per key; <code>ip-B</code> has its own count, so one key's flood does not throttle another. (2) the real limit is 400/min (each node counts its own ~1/4 of the traffic up to 100); fix it by sharing one counter in Redis. (3) failing closed means a Redis outage blocks every login — the protection becomes a total outage; failing open keeps logins working and loses only the throttle temporarily.</p>
<p><strong>Done when:</strong> you share the counter, key by IP/account/route, fail open, and return 429 + Retry-After.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">rate limiting</span><span class="v">Capping how many requests a key may make in a window.</span></div>
  <div class="kv"><span class="k">shared counter</span><span class="v">A count in Redis every instance sees, so the limit holds across the fleet.</span></div>
  <div class="kv"><span class="k">fixed window</span><span class="v">A count per key per time window, reset at the boundary.</span></div>
  <div class="kv"><span class="k">fail open</span><span class="v">Allow the request if the limiter's store is down — never lock everyone out.</span></div>
  <div class="kv"><span class="k">429 / Retry-After</span><span class="v">The status and header that tell a client it is limited and when to retry.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The counter must be shared (Redis), or N nodes let the limit through N times.</li>
<li>Fixed window per key; <code>allow()</code> increments and compares; the next window resets.</li>
<li>Limit by the right key — IP, account and route; the wrong key limits the wrong thing.</li>
<li>Fail open if the store is down, and return 429 + Retry-After so the client can back off.</li>
<li>Rate limiting is the floor under Chapter 10's decision, not the whole defence.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-10-1-nhoi-tin-vat', title: 'Back to 10.1 — the stuffing decision above this counter', sub: 'There, decide() judges a login as allow / challenge / block. Here, the shared counter that feeds it the ipFails and request rate it reasons over. The counter measures; the decision judges. Two halves of one defence.', cta: 'OPEN LESSON 10.1 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Giới hạn tần suất sống nổi với lưu lượng thật</h2>
<p class="lead">Chương 10 phòng thủ nhồi tín vật bằng một quyết định — allow, challenge hay block. Bài này là cái đếm sau nó: thứ thực sự đo một khoá đã làm bao nhiêu request. Nó đơn giản để sai một cách tinh vi theo kiểu chỉ hiện ra ở production, dưới tải, qua hơn một instance.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> giải thích vì sao một cái đếm giới hạn tần suất phải chung qua các instance; cài một bộ giới hạn cửa sổ cố định key đúng; và làm nó hỏng mở và báo client, để bảo vệ không bao giờ thành sự cố.</p>
</div>

<h3>Bộ giới hạn chỉ chạy trên một node</h3>
<p>Lỗi kinh điển là một cái đếm trong-tiến-trình. Với N instance sau một load balancer, mỗi instance chỉ thấy phần của nó, nên một giới hạn "100 mỗi phút" thực ra cho phép 100×N mỗi phút trên cả cụm. Cái đếm phải sống ở nơi <em>mọi</em> instance thấy nó — Redis. Một <code>Map</code> trong bộ nhớ ổn cho một tiến trình và một demo; production chia sẻ cái đếm.</p>

<h3>Cửa sổ cố định</h3>
<p>Cái đếm chung đơn giản nhất: một đếm mỗi khoá mỗi cửa sổ thời gian. <code>allow()</code> tăng đếm của khoá trong cửa sổ hiện tại và nói liệu nó có dưới giới hạn:</p>
${ma('javascript', CODE.ratelimit)}
<p>Cặp khoá-và-cửa-sổ (<code>\`\${key}:\${windowStart}\`</code>) là khoá Redis; đếm reset tự động khi cửa sổ lăn qua, vì cửa sổ sau là một khoá Redis khác.</p>

<h3>Bộ giới hạn đo thật</h3>
${ra(OUT['113-ratelimit'])}
<p>Năm request từ <code>ip-A</code> qua, cái thứ sáu và bảy bị chặn trong cùng cửa sổ; <code>ip-B</code> độc lập (đợt dội của một khoá không kìm cái khác); <code>ip-A</code> trong cửa sổ sau reset. Giới hạn giữ mỗi khoá, chung qua cái đếm.</p>

<h3>Giới hạn theo đúng khoá</h3>
<p>Cái bạn key theo <em>chính là</em> thiết kế: mỗi IP (chặn một nguồn), mỗi tài khoản (chặn nhắm một người dùng), mỗi tuyến (đăng nhập nghiêm hơn một GET công khai). Thường cả ba cùng lúc. Sai khoá giới hạn sai thứ — chỉ-mỗi-IP thua một botnet trải qua hàng nghìn IP; chỉ-mỗi-tài-khoản mời cú lockout DoS của Chương 10. Giới hạn tần suất và <code>decide()</code> của Chương 10 phối hợp: bộ giới hạn chặn khối lượng thô, quyết định phân biệt một kẻ tấn công đang phun với một người dùng gõ sai.</p>

<h3>Hỏng mở, và báo client</h3>
<p>Hai luật giữ bộ giới hạn khỏi thành sự cố. <strong>Hỏng mở:</strong> nếu Redis sập, cho request qua — một bộ giới hạn hỏng đóng biến một cái chớp cache thành một sự cố đăng nhập toàn phần, vì không ai đăng nhập được khi cái đếm không đọc được. <strong>Báo client:</strong> trả <code>429</code> với một header <code>Retry-After</code>. Một giới hạn client không thấy là một giới hạn nó không lùi lại được — nó chỉ thử lại mạnh hơn và làm tệ hơn.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — đợt bùng ở rìa cửa sổ cố định.</strong> Năm request lúc 0,999s và năm lúc 1,001s là mười trong hai mili-giây, vì chúng rơi vào hai cửa sổ khác nhau. Với endpoint xác thực cửa sổ cố định thường ổn; khi đợt bùng ở rìa thực sự quan trọng (một trần cứng mỗi-giây), với tới một sliding window hay một token bucket, làm mượt ranh giới. Biết giới hạn của công cụ trước khi dựa vào nó.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Sao cái đếm giới hạn tần suất không thể ở trong bộ nhớ?"</strong> — Với N instance, mỗi cái thấy 1/N lưu lượng, nên giới hạn thật là N× cái bạn đặt. Cái đếm phải chung (Redis).</li>
<li><strong>"Nếu Redis sập thì nên xảy ra gì?"</strong> — Hỏng mở — cho request qua. Hỏng đóng biến một sự cố cache thành một sự cố đăng nhập toàn phần.</li>
<li><strong>"Client biết nó bị giới hạn ra sao?"</strong> — Một <code>429</code> với <code>Retry-After</code>, để một client ngoan lùi lại thay vì thử lại mạnh hơn.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo11/ratelimit.mjs</code>. Vì sao <code>ip-B</code> vẫn qua trong khi <code>ip-A</code> đang bị chặn trong cùng cửa sổ?</li>
<li>API của bạn chạy trên bốn instance với một bộ giới hạn trong bộ nhớ đặt 100/phút. Giới hạn thật là bao nhiêu, và bạn sửa nó ra sao?</li>
<li>Vì sao bộ giới hạn phải hỏng mở nếu kho sập?</li>
</ol>
<p><strong>Lời giải:</strong> (1) cái đếm là mỗi khoá; <code>ip-B</code> có đếm riêng, nên đợt dội của một khoá không kìm cái khác. (2) giới hạn thật là 400/phút (mỗi node đếm ~1/4 lưu lượng của nó tới 100); sửa bằng cách chia sẻ một cái đếm trong Redis. (3) hỏng đóng nghĩa là một sự cố Redis chặn mọi đăng nhập — bảo vệ thành một sự cố toàn phần; hỏng mở giữ đăng nhập chạy và chỉ mất cái kìm tạm thời.</p>
<p><strong>Đạt khi:</strong> bạn chia sẻ cái đếm, key theo IP/tài khoản/tuyến, hỏng mở, và trả 429 + Retry-After.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">rate limiting (giới hạn tần suất)</span><span class="v">Chặn trên số request một khoá được làm trong một cửa sổ.</span></div>
  <div class="kv"><span class="k">shared counter (cái đếm chung)</span><span class="v">Một đếm trong Redis mọi instance thấy, nên giới hạn giữ trên cả cụm.</span></div>
  <div class="kv"><span class="k">fixed window (cửa sổ cố định)</span><span class="v">Một đếm mỗi khoá mỗi cửa sổ thời gian, reset ở ranh giới.</span></div>
  <div class="kv"><span class="k">fail open (hỏng mở)</span><span class="v">Cho request qua nếu kho của bộ giới hạn sập — không bao giờ khoá tất cả.</span></div>
  <div class="kv"><span class="k">429 / Retry-After</span><span class="v">Mã và header báo một client nó bị giới hạn và khi nào thử lại.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cái đếm phải chung (Redis), nếu không N node để giới hạn qua N lần.</li>
<li>Cửa sổ cố định mỗi khoá; <code>allow()</code> tăng và so; cửa sổ sau reset.</li>
<li>Giới hạn theo đúng khoá — IP, tài khoản và tuyến; sai khoá giới hạn sai thứ.</li>
<li>Hỏng mở nếu kho sập, và trả 429 + Retry-After để client lùi lại được.</li>
<li>Giới hạn tần suất là sàn dưới quyết định của Chương 10, không phải cả phòng thủ.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-10-1-nhoi-tin-vat', title: 'Quay lại 10.1 — quyết định nhồi trên cái đếm này', sub: 'Ở đó, decide() phán một đăng nhập là allow / challenge / block. Ở đây, cái đếm chung cấp cho nó ipFails và tần suất request mà nó lý giải. Cái đếm đo; quyết định phán. Hai nửa của một phòng thủ.', cta: 'MỞ BÀI 10.1 →' })}
</div>
`,
};
