/**
 * Chương 10 · 10.2 — Thuật toán chia và kiểm tra sức khoẻ (slug khung netdev-10-2-thuat-toan).
 * Output thật: lab/out/c102-*.out.txt (dựng lại: bash lab/code/dung-output-ch10.sh).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import G from '../giang/nfd-10-2.mjs';

const L = card;
const NGINX = { mon: 'Nginx', khoa: 'nginx' };

export default {
  title: '10.2 — Algorithms and health checks|||10.2 — Thuật toán chia và kiểm tra sức khoẻ',
  slug: 'netdev-10-2-thuat-toan',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Hai việc của LB: chọn backend (round robin mặc định · least connections cho tải không đều · consistent hashing sticky theo khoá — đo thật alice/bob · weighted cho backend khác cỡ) và ngừng dùng backend bệnh (kiểm bị động max_fails vs chủ động dò /health). Đo thật failover: giết be2 ⇒ nginx retry + bỏ nó khỏi dàn, người dùng không thấy lỗi. Rút êm (drain) trước khi gỡ: xong việc đang bay, không nhận mới — nền của rolling deploy.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Algorithms and health checks</h2>
<p class="lead">A load balancer makes two decisions over and over: which backend should this request go to, and is that backend still healthy enough to receive it? Get the first wrong and load piles onto one machine; get the second wrong and you cheerfully route users to a dead server. This lesson covers the balancing algorithms you choose between, and the health checks and draining that keep a failing or departing backend invisible to users — two of them measured on the lab.</p>

<h3>The algorithms</h3>
${kv([
  ['Round robin', 'The next backend in turn. Simple, even, the default.'],
  ['Least connections', 'The backend with the fewest active connections — good when requests vary in length.'],
  ['Consistent hashing', 'A backend chosen by hashing a key (user/IP/URL): same key → same backend.'],
  ['Weighted', 'Proportionally more traffic to bigger backends (weight 3 = 3× the share).'],
])}
<p>Round robin is the default and the right first choice. Reach for <strong>least connections</strong> when requests are uneven (one slow request should not keep getting more), and <strong>consistent hashing</strong> when a request must stick to a backend.</p>

<h3>Consistent hashing: the same user, the same backend</h3>
<p>With <code>hash $arg_user consistent</code>, nginx picks a backend by hashing the <code>?user=</code> value:</p>
${run('c102-hash', 'for i', 2)}
<p>Every <strong>alice</strong> request lands on one backend; every <strong>bob</strong> request on its own. This matters when a backend caches per-user data — you want a user's requests to keep hitting the cache that already holds their data. The word <em>consistent</em> is the key property: adding or removing one backend remaps only a <strong>small fraction</strong> of keys, not all of them, so the pool can change without a cache stampede (you saw the stampede idea in the CDN chapter).</p>
${cauNoi('en', { ...NGINX, bai: 'nginx-9-2-dinh-tuyen-dinh', so: '9.2', ten: 'Sticky routing, and the word that saves 47% of your users', giong: 'making a user stick to one backend (consistent hash / sticky sessions)', khac: 'the Nginx course configures ip_hash, hash and sticky cookie, and measures the hit-rate win', them: 'the measurement of consistent hashing on the wire here, plus the health-check and draining that must accompany any sticky scheme' })}

<h3>Health checks: active vs passive</h3>
${kv([
  ['Passive', 'The LB watches real traffic; after N failures (max_fails) it marks a backend down for a while. Free; only notices after a user is affected.'],
  ['Active', 'The LB periodically probes a /health endpoint, independent of users. Catches a sick backend before a user does; costs probe traffic.'],
])}
<p>A good <code>/health</code> endpoint checks the backend's own <strong>dependencies</strong> — can it reach its database and cache? — not merely "the process is up." A backend whose DB connection died is "up" but cannot serve; only a dependency-aware health check catches that.</p>

<h3>Failover: a dead backend leaves the pool</h3>
<p>Watch what happens when a backend dies mid-service. Before, all three serve in rotation:</p>
${run('c102-health-before', 'for i', 1)}
<p>Now kill <code>be2</code> and request again:</p>
${run('c102-health-after', 'for i', 1)}
<p><code>be2</code> is gone — only <code>be1</code> and <code>be3</code> answer. nginx's passive health check did it: the first request that hit the dead backend was <strong>retried</strong> on a healthy one (<code>proxy_next_upstream</code>), and <code>be2</code> was marked down and skipped until it recovers. The user never saw an error. <em>That</em> is what a health check buys you — a crash becomes a non-event.</p>

<div class="pitfall co-tieu-de">
<p><strong>Do not kill a backend to deploy — drain it first, or you return errors to users mid-request.</strong> When you take a backend out to update it, killing the process severs every request it was in the middle of serving, and those users get a 502. Instead <strong>drain</strong> it: mark it draining at the LB so <em>new</em> requests stop arriving, let the <em>in-flight</em> ones finish, and only then stop it. Then update and return it, one backend at a time — a rolling deploy. The same discipline as the real-time chapter's graceful deploy: a removal should be invisible, and it is only invisible if you wait for in-flight work to drain. Health checks protect you from <em>unplanned</em> failures; draining protects you from your own <em>planned</em> ones.</p>
</div>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a service with a per-user cache sees a low cache hit rate and occasional 502s during deploys. Pick an algorithm and fix the deploy.</p>
<ol>
<li>On the lab, run the consistent-hash demo: confirm <code>alice</code> and <code>bob</code> each stick to one backend. Explain why that helps a per-user cache.</li>
<li>Run the health demo: show all three serving, then kill <code>be2</code> and show it removed. Explain who retried the failed request.</li>
<li>Describe active vs passive health checks and what a good <code>/health</code> should test.</li>
<li>Write a 3-step drain-and-roll plan for a zero-downtime deploy.</li>
</ol>
<p><strong>Done when:</strong> you can say consistent hashing keeps a user on the backend that caches their data, that nginx retried the failed request onto a healthy backend and removed the dead one, that active health probes <code>/health</code> (which should check the DB/cache) ahead of users, and that a safe deploy drains (no new requests) before stopping each backend.</p>
<details><summary>Solution</summary>
<p>With consistent hashing, <code>alice</code>→one backend and <code>bob</code>→another, so each user keeps hitting the backend that already cached their data (higher hit rate). Killing <code>be2</code> removes it: nginx retried the failed request on a healthy backend (<code>proxy_next_upstream</code>) and skipped <code>be2</code> via <code>max_fails</code>. Active checks probe <code>/health</code> independently (and <code>/health</code> should verify DB/cache reachability, not just the process). A zero-downtime deploy: (1) drain backend A (stop new, finish in-flight), (2) update and return A, (3) repeat for B and C.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Round robin', 'Each request to the next backend in turn (the default).'],
  ['Least connections', 'Route to the backend with the fewest active connections.'],
  ['Consistent hashing', 'Hash a key to a backend; pool changes remap few keys.'],
  ['Weighted', 'Bigger backends get proportionally more traffic.'],
  ['Passive health check', 'Mark a backend down after failures in real traffic (max_fails).'],
  ['Active health check', 'Probe a /health endpoint independently of user traffic.'],
  ['Connection draining', 'Stop new requests, let in-flight finish, then remove the backend.'],
])}

<h3>📌 Summary</h3>
<ul>
<li><strong>Round robin</strong> (default), <strong>least connections</strong> (uneven load), <strong>consistent hashing</strong> (sticky per key), <strong>weighted</strong> (uneven backends).</li>
<li><strong>Consistent hashing</strong>: same user → same backend; a pool change remaps only a small fraction of keys.</li>
<li><strong>Health checks</strong>: passive (notices failures in real traffic) vs active (probes <code>/health</code> ahead of users).</li>
<li>A <strong>failed backend is removed</strong> and the request retried — the user never sees it (measured).</li>
<li><strong>Drain</strong> before removing a backend (finish in-flight, accept no new) — the basis of a rolling, zero-downtime deploy.</li>
</ul>
${L('https://docs.nginx.com/nginx/admin-guide/load-balancer/http-health-check/', '📘', 'nginx — HTTP health checks', 'max_fails/fail_timeout (passive) and active probes.', 'Open')}
${L('https://www.cloudflare.com/learning/performance/types-of-load-balancing-algorithms/', '📘', 'Cloudflare — Load balancing algorithms', 'Round robin, least connections, hashing and weighting compared.', 'Open')}
${L('https://docs.haproxy.org/2.9/configuration.html#5.2', '📄', 'HAProxy — Server health checking', 'A deep, production reference on active health checks.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Thuật toán chia và kiểm tra sức khoẻ</h2>
<p class="lead">Một bộ cân bằng tải ra hai quyết định lặp đi lặp lại: yêu cầu này nên đi tới backend nào, và backend đó còn đủ khoẻ để nhận nó không? Sai cái đầu thì tải dồn lên một máy; sai cái sau thì bạn vui vẻ định tuyến người dùng tới một máy chủ chết. Bài này nói về các thuật toán cân bằng bạn chọn giữa, và các kiểm sức khoẻ cùng rút êm giữ một backend đang hỏng hay đang rời đi vô hình với người dùng — hai cái được đo trên lab.</p>

<h3>Các thuật toán</h3>
${kv([
  ['Round robin', 'Backend kế tiếp lần lượt. Đơn giản, đều, mặc định.'],
  ['Least connections', 'Backend có ít kết nối đang hoạt động nhất — tốt khi yêu cầu dài ngắn khác nhau.'],
  ['Consistent hashing', 'Một backend chọn bằng cách băm một khoá (user/IP/URL): cùng khoá → cùng backend.'],
  ['Weighted', 'Lưu lượng tỷ lệ nhiều hơn tới backend lớn hơn (trọng số 3 = 3× phần).'],
])}
<p>Round robin là mặc định và lựa chọn đầu đúng. Với tới <strong>least connections</strong> khi yêu cầu không đều (một yêu cầu chậm không nên cứ nhận thêm), và <strong>consistent hashing</strong> khi một yêu cầu phải dính một backend.</p>

<h3>Consistent hashing: cùng người dùng, cùng backend</h3>
<p>Với <code>hash $arg_user consistent</code>, nginx chọn một backend bằng cách băm giá trị <code>?user=</code>:</p>
${run('c102-hash', 'for i', 2)}
<p>Mọi yêu cầu <strong>alice</strong> rơi vào một backend; mọi yêu cầu <strong>bob</strong> vào cái của nó. Điều này quan trọng khi một backend cache dữ liệu theo người dùng — bạn muốn yêu cầu của một người dùng tiếp tục đụng cache đã giữ dữ liệu của họ. Chữ <em>consistent</em> là tính chất then chốt: thêm hay bớt một backend chỉ ánh xạ lại một <strong>phần nhỏ</strong> khoá, không phải tất cả, nên dàn máy đổi được mà không có cơn giẫm đạp cache (bạn đã thấy ý giẫm đạp ở chương CDN).</p>
${cauNoi('vi', { ...NGINX, bai: 'nginx-9-2-dinh-tuyen-dinh', so: '9.2', ten: 'Định tuyến dính, và cái chữ cứu được 47% người dùng của bạn', giong: 'làm một người dùng dính một backend (consistent hash / sticky session)', khac: 'khoá Nginx cấu hình ip_hash, hash và sticky cookie, và đo lợi ích tỷ lệ trúng', them: 'phép đo consistent hashing trên dây ở đây, cộng kiểm sức khoẻ và rút êm phải đi kèm bất kỳ sơ đồ dính nào' })}

<h3>Kiểm sức khoẻ: chủ động so với bị động</h3>
${kv([
  ['Bị động', 'LB canh lưu lượng thật; sau N lần lỗi (max_fails) nó đánh dấu một backend down một lúc. Miễn phí; chỉ nhận ra sau khi một người dùng bị ảnh hưởng.'],
  ['Chủ động', 'LB định kỳ dò một điểm cuối /health, độc lập với người dùng. Bắt một backend bệnh trước khi một người dùng bắt; tốn lưu lượng dò.'],
])}
<p>Một điểm cuối <code>/health</code> tốt kiểm các <strong>phụ thuộc</strong> của chính backend — nó với tới được cơ sở dữ liệu và cache không? — không chỉ "tiến trình đang chạy." Một backend có kết nối DB đã chết thì "đang chạy" nhưng không phục vụ được; chỉ một kiểm sức khoẻ biết-phụ-thuộc mới bắt được.</p>

<h3>Failover: một backend chết rời khỏi dàn</h3>
<p>Nhìn chuyện gì xảy ra khi một backend chết giữa phục vụ. Trước, cả ba phục vụ xoay vòng:</p>
${run('c102-health-before', 'for i', 1)}
<p>Giờ giết <code>be2</code> và hỏi lại:</p>
${run('c102-health-after', 'for i', 1)}
<p><code>be2</code> biến mất — chỉ <code>be1</code> và <code>be3</code> trả lời. Kiểm bị động của nginx làm điều đó: yêu cầu đầu đụng backend chết được <strong>thử lại</strong> trên một cái khoẻ (<code>proxy_next_upstream</code>), và <code>be2</code> bị đánh dấu down và bỏ qua tới khi hồi phục. Người dùng không bao giờ thấy một lỗi. <em>Đó</em> là cái một kiểm sức khoẻ mua cho bạn — một lần sập thành một chuyện không-xảy-ra.</p>

<div class="pitfall co-tieu-de">
<p><strong>Đừng giết một backend để deploy — rút êm nó trước, không thì bạn trả lỗi cho người dùng giữa chừng yêu cầu.</strong> Khi bạn lấy một backend ra để cập nhật, giết tiến trình cắt đứt mọi yêu cầu nó đang phục vụ dở, và những người dùng đó nhận một 502. Thay vào đó <strong>rút êm</strong> nó: đánh dấu nó đang rút ở LB để yêu cầu <em>mới</em> ngừng đến, để các cái <em>đang bay</em> hoàn tất, và chỉ khi đó mới dừng nó. Rồi cập nhật và trả nó về, một backend một lần — một rolling deploy. Cùng kỷ luật với deploy êm của chương thời gian thực: một lần gỡ nên vô hình, và nó chỉ vô hình nếu bạn chờ việc đang bay rút cạn. Kiểm sức khoẻ bảo vệ bạn khỏi lỗi <em>bất ngờ</em>; rút êm bảo vệ bạn khỏi những lỗi <em>có kế hoạch</em> của chính bạn.</p>
</div>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một dịch vụ có cache theo người dùng thấy tỷ lệ trúng cache thấp và thỉnh thoảng 502 khi deploy. Chọn một thuật toán và sửa deploy.</p>
<ol>
<li>Trên lab, chạy demo consistent-hash: xác nhận <code>alice</code> và <code>bob</code> mỗi người dính một backend. Giải thích vì sao điều đó giúp một cache theo người dùng.</li>
<li>Chạy demo health: cho thấy cả ba phục vụ, rồi giết <code>be2</code> và cho thấy nó bị gỡ. Giải thích ai thử lại yêu cầu lỗi.</li>
<li>Mô tả kiểm chủ động so với bị động và một <code>/health</code> tốt nên kiểm gì.</li>
<li>Viết một kế hoạch rút-và-cuốn 3 bước cho một deploy không gián đoạn.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được consistent hashing giữ một người dùng trên backend cache dữ liệu của họ, rằng nginx thử lại yêu cầu lỗi lên một backend khoẻ và gỡ cái chết, rằng kiểm chủ động dò <code>/health</code> (vốn nên kiểm DB/cache) trước người dùng, và rằng một deploy an toàn rút êm (không yêu cầu mới) trước khi dừng mỗi backend.</p>
<details><summary>Lời giải</summary>
<p>Với consistent hashing, <code>alice</code>→một backend và <code>bob</code>→một cái khác, nên mỗi người dùng tiếp tục đụng backend đã cache dữ liệu của họ (tỷ lệ trúng cao hơn). Giết <code>be2</code> gỡ nó: nginx thử lại yêu cầu lỗi trên một backend khoẻ (<code>proxy_next_upstream</code>) và bỏ qua <code>be2</code> qua <code>max_fails</code>. Kiểm chủ động dò <code>/health</code> độc lập (và <code>/health</code> nên xác minh với tới được DB/cache, không chỉ tiến trình). Một deploy không gián đoạn: (1) rút êm backend A (ngừng mới, xong việc đang bay), (2) cập nhật và trả A về, (3) lặp cho B và C.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Round robin', 'Mỗi yêu cầu tới backend kế tiếp lần lượt (mặc định).'],
  ['Least connections', 'Định tuyến tới backend có ít kết nối đang hoạt động nhất.'],
  ['Consistent hashing', 'Băm một khoá tới một backend; dàn đổi ánh xạ lại ít khoá.'],
  ['Weighted', 'Backend lớn hơn nhận lưu lượng tỷ lệ nhiều hơn.'],
  ['Kiểm bị động', 'Đánh dấu một backend down sau các lỗi trong lưu lượng thật (max_fails).'],
  ['Kiểm chủ động', 'Dò một điểm cuối /health độc lập với lưu lượng người dùng.'],
  ['Rút kết nối (drain)', 'Ngừng yêu cầu mới, để việc đang bay xong, rồi gỡ backend.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><strong>Round robin</strong> (mặc định), <strong>least connections</strong> (tải không đều), <strong>consistent hashing</strong> (dính theo khoá), <strong>weighted</strong> (backend không đều).</li>
<li><strong>Consistent hashing</strong>: cùng người dùng → cùng backend; một lần đổi dàn chỉ ánh xạ lại một phần nhỏ khoá.</li>
<li><strong>Kiểm sức khoẻ</strong>: bị động (nhận ra lỗi trong lưu lượng thật) so với chủ động (dò <code>/health</code> trước người dùng).</li>
<li>Một <strong>backend hỏng được gỡ</strong> và yêu cầu thử lại — người dùng không bao giờ thấy (đo thật).</li>
<li><strong>Rút êm</strong> trước khi gỡ một backend (xong việc đang bay, không nhận mới) — nền của một rolling deploy không gián đoạn.</li>
</ul>
${L('https://docs.nginx.com/nginx/admin-guide/load-balancer/http-health-check/', '📘', 'nginx — Kiểm sức khoẻ HTTP', 'max_fails/fail_timeout (bị động) và dò chủ động.', 'Mở')}
${L('https://www.cloudflare.com/learning/performance/types-of-load-balancing-algorithms/', '📘', 'Cloudflare — Thuật toán cân bằng tải', 'Round robin, least connections, hashing và weighting so sánh.', 'Mở')}
${L('https://docs.haproxy.org/2.9/configuration.html#5.2', '📄', 'HAProxy — Kiểm sức khoẻ máy chủ', 'Một tham chiếu production sâu về kiểm sức khoẻ chủ động.', 'Mở')}
</div>
`,
};
