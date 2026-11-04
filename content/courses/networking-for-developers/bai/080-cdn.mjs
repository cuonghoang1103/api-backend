/**
 * Chương 8 · 8.1 — CDN hoạt động thế nào: edge, origin, PoP (slug khung netdev-8-1-cdn). Bài MỞ CHƯƠNG 8 (có khối 🎯).
 * Output thật: lab/out/c81-*.out.txt (dựng lại: bash lab/code/dung-output-ch8.sh).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import G from '../giang/nfd-08-1.mjs';

const L = card;
const NGINX = { mon: 'Nginx', khoa: 'nginx' };

export default {
  title: '8.1 — How a CDN works: edge, origin and PoP|||8.1 — CDN hoạt động thế nào: edge, origin và PoP',
  slug: 'netdev-8-1-cdn',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một CDN là bộ đệm đặt gần người dùng: origin (máy chủ gốc) đứng sau, nhiều edge/PoP cache ở biên, Anycast định tuyến tới PoP gần nhất. Đọc trạng thái cache (HIT/MISS/EXPIRED) thẳng từ header (cf-cache-status / X-Cache / Age) trên một CDN thu nhỏ bằng nginx. Lịch sử Akamai (1998) → Cloudflare (2009/2010). CDN tăng tốc cái gì và KHÔNG tăng tốc cái gì.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>How a CDN works: edge, origin and PoP</h2>
<p class="lead">Almost every fast site on the internet sits behind a CDN, and most developers treat it as magic: you "put it on a CDN" and things get faster. This chapter takes the magic apart. A CDN is nothing more than a <strong>cache placed close to the user</strong>, and like every cache in this course you can read exactly what it did — <code>HIT</code>, <code>MISS</code> or <code>EXPIRED</code> — in a response header. This first lesson builds a miniature CDN out of two nginx servers (an edge caching a file from an origin) and watches a request get served from the edge without ever touching the origin.</p>

<div class="callout info">
<p><strong>🎯 Chapter 8 at a glance — what you will be able to do after it</strong></p>
<ul>
<li><strong>Explain a CDN</strong> in real terms: edge caches at many PoPs, one origin behind them, and Anycast routing a user to the nearest PoP.</li>
<li><strong>Read the cache status</strong> of any response — <code>HIT</code>, <code>MISS</code>, <code>EXPIRED</code>, <code>BYPASS</code> — from <code>cf-cache-status</code> / <code>X-Cache</code> and <code>Age</code>.</li>
<li><strong>Cache correctly</strong>: hashed immutable filenames, TTL, <code>stale-while-revalidate</code>, purge by URL/tag, and why a cookie or a query string quietly destroys your hit rate.</li>
<li><strong>Debug the layer fight</strong> — the real outage where nginx overrode the <code>Cache-Control</code> that Next.js set, so caching never worked.</li>
<li><strong>Respect the edge's limits</strong>: the ~100-second timeout (error 524), body-size caps, and routing long work and big uploads around the CDN instead of through it.</li>
</ul>
<p><strong>Why a developer needs this:</strong> "the deploy isn't live", "the image is stale", "the site is slow in one region", "uploads over 100 MB fail", "long reports time out at 524" are all cache/CDN problems you can <em>read</em> once you can see the status at each hop. Everything in this chapter is measured on a miniature CDN — an nginx edge caching from an nginx origin — on the base lab.</p>
</div>

<h3>A CDN is a cache near the user</h3>
<p>Strip away the branding and a CDN has three parts:</p>
<ul>
<li><strong>Origin</strong> — your real server (nginx → API → database). The single source of truth. It is the only thing that actually <em>has</em> the content.</li>
<li><strong>Edge</strong> (a server in a <strong>PoP</strong>, Point of Presence) — a cache sitting physically near the user. A large CDN has hundreds of PoPs worldwide.</li>
<li><strong>Anycast</strong> — one IP address announced from <em>every</em> PoP at once; the internet's routing delivers a user to the <strong>nearest</strong> PoP automatically (you met Anycast for DNS in Chapter 3).</li>
</ul>
<p>The payoff: a request for a cached file is answered at a PoP a few milliseconds away and <strong>never reaches your origin</strong>. The origin sees only the first request for each file (and the occasional refresh). Less distance for the user, far less load for the origin.</p>

<h3>HIT and MISS — read it in a header</h3>
<p>Our lab edge (nginx on <code>:8080</code>) caches a file from the origin. Request it three times:</p>
${run('c81-hitmiss', 'curl', 3)}
<p>The first response is a <strong><code>MISS</code></strong>: the edge had no copy, fetched it from the origin, stored it, and stamped the header. Every request after is a <strong><code>HIT</code></strong> — served straight from the edge, origin untouched. Cloudflare names this header <code>cf-cache-status</code>; our nginx sets <code>X-Cache</code> from its <code>$upstream_cache_status</code> variable. The name differs by vendor; the idea is identical, and you always read it the same way — in a header.</p>

<h3>TTL: fresh, then EXPIRED</h3>
<p>A cached copy is not kept forever. It is <strong>fresh</strong> for its TTL (here 30 seconds, taken from <code>Cache-Control: max-age</code> or the CDN's rule). Watch the status after the TTL lapses:</p>
${run('c81-expire', 'curl', 4)}
<p>While fresh, it is a <code>HIT</code> with no origin contact at all. Once the TTL passes, the next request is <strong><code>EXPIRED</code></strong>: the edge revalidates with the origin, and then caches the fresh copy again. This is the whole lifecycle of one cached object — and the knob you tune in the next lesson.</p>

<h3>The states you will see in the wild</h3>
${kv([
  ['MISS', 'Not in the edge cache — fetched from the origin this time.'],
  ['HIT', 'Served from the edge; the origin was not contacted.'],
  ['EXPIRED / STALE', 'Was cached but past TTL — revalidated (or served stale while revalidating).'],
  ['BYPASS / DYNAMIC', 'Not cacheable: a cookie, a no-store header, or a dynamic route.'],
  ['Age', 'Seconds this copy has already sat in the cache — a MISS has Age: 0.'],
])}
<p>The first question for any "slow / stale / not updating" bug is simply: <strong>what is the cache status at each hop?</strong> Read it with <code>curl -I</code> or <code>curl -sD -</code> at the edge and at the origin, and the layer at fault names itself.</p>

<h3>Where CDNs came from</h3>
<p><strong>Akamai (1998)</strong> was born from an MIT problem — how to serve a sudden flash crowd without melting the origin — and is still the largest CDN by footprint. Through the 2000s, CDNs spread for images, video and static assets, and "put it on a CDN" became standard advice. <strong>Cloudflare (2009–2010)</strong> made a CDN available to everyone, free tier included, and the edge grew teeth: TLS termination, a web application firewall, DNS, and code that runs at the PoP. The idea never changed — <em>a cache close to the user, one origin behind it</em> — but the edge now does far more than cache.</p>

<div class="pitfall co-tieu-de">
<p><strong>A CDN does not make your application faster — only your cacheable responses.</strong> It cannot speed up the database, a logged-in dashboard, or any per-user page that must not be cached, and it does nothing for the <em>first</em> (MISS) request to a slow origin. Teams put a CDN in front of a slow dynamic API, see no improvement, and conclude "the CDN is broken" — when in fact every response was a <code>BYPASS</code>. Cache static assets aggressively; for dynamic responses the edge still helps with TLS, routing and keep-alive, but the speed-up you are chasing lives in the application and the database, not the cache.</p>
</div>
${cauNoi('en', { ...NGINX, bai: 'nginx-5-2-cai-gi-duoc-cache', so: '5.2', ten: 'What gets cached', giong: 'the idea of caching a response and serving it from a cache', khac: 'the Nginx course configures proxy_cache on one server (keys, zones, cache_valid)', them: 'the CDN picture above that server — edge vs origin, PoPs, Anycast, and the HIT/MISS/EXPIRED status read from a real response' })}

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> you are handed a site behind a cache and asked to prove it is actually caching, and to say what the cache does on each request.</p>
<ol>
<li>Bring up the lab and the miniature CDN: <code>bash lab/code/dung-output-ch8.sh</code> leaves the edge (<code>:8080</code>) and origin running.</li>
<li>Request the same file three times with <code>curl -sD - -o /dev/null http://10.10.2.10:8080/img/logo.txt</code> and read <code>X-Cache</code> each time. Explain MISS then HIT.</li>
<li>Request <code>http://10.10.2.10:8080/</code>, wait past its 30-second TTL, request again, and catch the <code>EXPIRED</code>.</li>
<li>Write one sentence each for what <code>MISS</code>, <code>HIT</code> and <code>EXPIRED</code> told you about where the response came from.</li>
</ol>
<p><strong>Done when:</strong> you have produced MISS → HIT → HIT on one file and MISS → HIT → EXPIRED on another, and can say which requests touched the origin (only the MISS and the EXPIRED revalidation).</p>
<details><summary>Solution</summary>
<p>The first request is a <code>MISS</code> (edge fetches from origin and stores); the next two are <code>HIT</code> (served at the edge, origin untouched). On the second file, after the 30-second TTL the status becomes <code>EXPIRED</code> — the edge revalidated with the origin and re-cached. Only the MISS and the EXPIRED revalidation reached the origin; every HIT was answered at the edge.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Origin', 'Your real server — the single source of truth the edge fetches from.'],
  ['Edge / PoP', 'A cache server in a Point of Presence physically near the user.'],
  ['Anycast', 'One IP announced from every PoP; routing sends the user to the nearest.'],
  ['HIT / MISS', 'Served from the edge cache / not in cache, fetched from the origin.'],
  ['EXPIRED', 'Cached copy is past its TTL; the edge revalidates with the origin.'],
  ['TTL', 'How long a cached copy stays fresh (from Cache-Control or the CDN rule).'],
  ['cf-cache-status / X-Cache', 'The response header that names the cache result.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A CDN is <strong>edge caches at many PoPs</strong> in front of one <strong>origin</strong>; <strong>Anycast</strong> routes the user to the nearest PoP.</li>
<li>First request = <code>MISS</code> (fetched from origin); later requests = <code>HIT</code> (served at the edge, origin untouched).</li>
<li>A copy is fresh for its <strong>TTL</strong>, then <code>EXPIRED</code> → the edge revalidates and re-caches.</li>
<li>Read the result in a header — <code>cf-cache-status</code> / <code>X-Cache</code> and <code>Age</code> — with <code>curl -I</code> at each hop.</li>
<li>Akamai (1998) → Cloudflare (2009/2010) made the edge universal and smart; it speeds <strong>cacheable</strong> responses and offloads the origin, not the database or dynamic pages.</li>
</ul>
${L('https://www.cloudflare.com/learning/cdn/what-is-a-cdn/', '📘', 'Cloudflare — What is a CDN?', 'Edge, origin, PoP and how a CDN reduces latency and origin load.', 'Open')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Caching', '📘', 'MDN — HTTP caching', 'Fresh vs stale, max-age, revalidation and the shared/private cache.', 'Open')}
${L('https://www.rfc-editor.org/rfc/rfc9111.html', '📄', 'RFC 9111 — HTTP Caching', 'The standard for how caches (browser, proxy, CDN) decide freshness.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>CDN hoạt động thế nào: edge, origin và PoP</h2>
<p class="lead">Gần như mọi site nhanh trên internet đều nằm sau một CDN, và phần lớn lập trình viên coi nó là phép thuật: bạn "đưa lên CDN" và mọi thứ nhanh lên. Chương này tháo tung phép thuật đó. Một CDN chẳng là gì hơn một <strong>bộ đệm đặt gần người dùng</strong>, và như mọi bộ đệm trong khoá này, bạn đọc được chính xác nó đã làm gì — <code>HIT</code>, <code>MISS</code> hay <code>EXPIRED</code> — trong một header câu trả lời. Bài đầu này dựng một CDN thu nhỏ từ hai máy nginx (một biên cache một tệp từ một origin) và nhìn một yêu cầu được phục vụ từ biên mà không hề chạm origin.</p>

<div class="callout info">
<p><strong>🎯 Chương 8 trong một khung — học xong bạn làm được gì</strong></p>
<ul>
<li><strong>Giải thích một CDN</strong> bằng lời thật: các bộ đệm ở biên tại nhiều PoP, một origin phía sau, và Anycast định tuyến người dùng tới PoP gần nhất.</li>
<li><strong>Đọc trạng thái cache</strong> của bất kỳ câu trả lời nào — <code>HIT</code>, <code>MISS</code>, <code>EXPIRED</code>, <code>BYPASS</code> — từ <code>cf-cache-status</code> / <code>X-Cache</code> và <code>Age</code>.</li>
<li><strong>Cache cho đúng</strong>: tên tệp bất biến có mã băm, TTL, <code>stale-while-revalidate</code>, purge theo URL/tag, và vì sao một cookie hay một query string âm thầm phá tỷ lệ trúng cache.</li>
<li><strong>Gỡ cuộc tranh tầng</strong> — sự cố thật nơi nginx ghi đè <code>Cache-Control</code> mà Next.js đặt, nên cache không bao giờ có hiệu lực.</li>
<li><strong>Tôn trọng giới hạn của biên</strong>: timeout ~100 giây (lỗi 524), trần kích thước thân, và đưa việc dài cùng upload lớn đi VÒNG qua CDN thay vì XUYÊN qua nó.</li>
</ul>
<p><strong>Vì sao lập trình viên cần:</strong> "deploy chưa lên", "ảnh bị cũ", "site chậm ở một vùng", "upload trên 100 MB hỏng", "báo cáo dài timeout ở 524" đều là vấn đề cache/CDN bạn <em>đọc</em> được một khi thấy trạng thái ở mỗi chặng. Mọi thứ trong chương đo trên một CDN thu nhỏ — một nginx biên cache từ một nginx origin — trên lab cơ bản.</p>
</div>

<h3>Một CDN là bộ đệm gần người dùng</h3>
<p>Bóc hết nhãn hiệu đi, một CDN có ba phần:</p>
<ul>
<li><strong>Origin</strong> — máy chủ thật của bạn (nginx → API → cơ sở dữ liệu). Nguồn sự thật duy nhất. Nó là thứ duy nhất thật sự <em>có</em> nội dung.</li>
<li><strong>Edge</strong> (một máy chủ trong một <strong>PoP</strong>, Điểm hiện diện) — một bộ đệm nằm vật lý gần người dùng. Một CDN lớn có hàng trăm PoP trên toàn cầu.</li>
<li><strong>Anycast</strong> — một địa chỉ IP được quảng bá từ <em>mọi</em> PoP cùng lúc; định tuyến của internet đưa người dùng tới PoP <strong>gần nhất</strong> tự động (bạn đã gặp Anycast cho DNS ở Chương 3).</li>
</ul>
<p>Cái lợi: một yêu cầu tới tệp đã cache được trả lời ở một PoP cách vài mili-giây và <strong>không bao giờ chạm origin</strong>. Origin chỉ thấy yêu cầu đầu tiên cho mỗi tệp (và thỉnh thoảng làm tươi). Ít khoảng cách hơn cho người dùng, ít tải hơn nhiều cho origin.</p>

<h3>HIT và MISS — đọc trong một header</h3>
<p>Biên lab của ta (nginx trên <code>:8080</code>) cache một tệp từ origin. Hỏi nó ba lần:</p>
${run('c81-hitmiss', 'curl', 3)}
<p>Câu trả lời đầu là một <strong><code>MISS</code></strong>: biên không có bản sao, lấy từ origin, lưu, và đóng dấu header. Mọi yêu cầu sau là một <strong><code>HIT</code></strong> — phục vụ thẳng từ biên, origin không bị chạm. Cloudflare đặt tên header này là <code>cf-cache-status</code>; nginx của ta đặt <code>X-Cache</code> từ biến <code>$upstream_cache_status</code>. Tên khác nhau theo nhà cung cấp; ý tưởng y hệt, và bạn luôn đọc nó cùng một cách — trong một header.</p>

<h3>TTL: tươi, rồi EXPIRED</h3>
<p>Một bản sao đã cache không giữ mãi. Nó <strong>tươi</strong> trong TTL của nó (ở đây 30 giây, lấy từ <code>Cache-Control: max-age</code> hoặc luật của CDN). Nhìn trạng thái sau khi TTL hết:</p>
${run('c81-expire', 'curl', 4)}
<p>Khi còn tươi, nó là một <code>HIT</code> không chạm origin chút nào. Khi TTL hết, yêu cầu kế tiếp là <strong><code>EXPIRED</code></strong>: biên kiểm lại với origin, rồi cache bản tươi lần nữa. Đây là trọn vòng đời của một đối tượng cache — và cái núm bạn chỉnh ở bài sau.</p>

<h3>Các trạng thái bạn sẽ gặp thực tế</h3>
${kv([
  ['MISS', 'Không có trong cache biên — lần này lấy từ origin.'],
  ['HIT', 'Phục vụ từ biên; origin không bị chạm.'],
  ['EXPIRED / STALE', 'Từng được cache nhưng quá TTL — kiểm lại (hoặc phục vụ bản cũ trong khi kiểm lại).'],
  ['BYPASS / DYNAMIC', 'Không cache được: một cookie, một header no-store, hay một tuyến động.'],
  ['Age', 'Số giây bản sao này đã nằm trong cache — một MISS có Age: 0.'],
])}
<p>Câu hỏi đầu tiên cho bất kỳ lỗi "chậm / cũ / không cập nhật" nào đơn giản là: <strong>trạng thái cache ở mỗi chặng là gì?</strong> Đọc bằng <code>curl -I</code> hoặc <code>curl -sD -</code> ở biên và ở origin, và tầng có lỗi tự khai tên.</p>

<h3>CDN từ đâu ra</h3>
<p><strong>Akamai (1998)</strong> ra đời từ một bài toán ở MIT — làm sao phục vụ một đám đông ùa vào đột ngột mà không làm cháy origin — và vẫn là CDN lớn nhất về quy mô. Suốt những năm 2000, CDN lan ra cho ảnh, video và tài nguyên tĩnh, và "đưa lên CDN" thành lời khuyên chuẩn. <strong>Cloudflare (2009–2010)</strong> làm CDN sẵn cho tất cả mọi người, kèm gói miễn phí, và biên mọc răng: kết thúc TLS, một tường lửa ứng dụng web, DNS, và mã chạy ngay tại PoP. Ý tưởng không bao giờ đổi — <em>một bộ đệm gần người dùng, một origin phía sau</em> — nhưng biên nay làm nhiều hơn cache rất nhiều.</p>

<div class="pitfall co-tieu-de">
<p><strong>Một CDN không làm ứng dụng của bạn nhanh hơn — chỉ làm nhanh các câu trả lời cache-được.</strong> Nó không tăng tốc cơ sở dữ liệu, một bảng điều khiển đã đăng nhập, hay bất kỳ trang theo-người-dùng nào không được cache, và nó không làm gì cho yêu cầu <em>đầu tiên</em> (MISS) tới một origin chậm. Đội nhóm đặt CDN trước một API động chậm, không thấy cải thiện gì, rồi kết luận "CDN hỏng" — trong khi thực ra mọi câu trả lời đều là <code>BYPASS</code>. Cache mạnh tay tài nguyên tĩnh; với câu trả lời động biên vẫn giúp với TLS, định tuyến và keep-alive, nhưng cái nhanh bạn đang đuổi theo nằm ở ứng dụng và cơ sở dữ liệu, không phải ở cache.</p>
</div>
${cauNoi('vi', { ...NGINX, bai: 'nginx-5-2-cai-gi-duoc-cache', so: '5.2', ten: 'Cái gì được cache', giong: 'ý tưởng cache một câu trả lời rồi phục vụ từ bộ đệm', khac: 'khoá Nginx cấu hình proxy_cache trên MỘT máy chủ (khoá cache, zone, cache_valid)', them: 'bức tranh CDN phía trên máy chủ đó — edge so với origin, các PoP, Anycast, và trạng thái HIT/MISS/EXPIRED đọc từ một câu trả lời thật' })}

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bạn được giao một site nằm sau một bộ đệm và được yêu cầu chứng minh nó thật sự đang cache, và nói bộ đệm làm gì ở mỗi yêu cầu.</p>
<ol>
<li>Dựng lab và CDN thu nhỏ: <code>bash lab/code/dung-output-ch8.sh</code> để biên (<code>:8080</code>) và origin chạy.</li>
<li>Hỏi cùng một tệp ba lần với <code>curl -sD - -o /dev/null http://10.10.2.10:8080/img/logo.txt</code> và đọc <code>X-Cache</code> mỗi lần. Giải thích MISS rồi HIT.</li>
<li>Hỏi <code>http://10.10.2.10:8080/</code>, chờ quá TTL 30 giây, hỏi lại, và bắt cái <code>EXPIRED</code>.</li>
<li>Viết một câu cho mỗi thứ <code>MISS</code>, <code>HIT</code> và <code>EXPIRED</code> nói gì về nơi câu trả lời đến từ đâu.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tạo ra MISS → HIT → HIT trên một tệp và MISS → HIT → EXPIRED trên một tệp khác, và nói được yêu cầu nào chạm origin (chỉ MISS và lần kiểm lại EXPIRED).</p>
<details><summary>Lời giải</summary>
<p>Yêu cầu đầu là một <code>MISS</code> (biên lấy từ origin và lưu); hai cái sau là <code>HIT</code> (phục vụ ở biên, origin không bị chạm). Ở tệp thứ hai, sau TTL 30 giây trạng thái thành <code>EXPIRED</code> — biên kiểm lại với origin và cache lại. Chỉ MISS và lần kiểm lại EXPIRED chạm tới origin; mọi HIT đều được trả lời ở biên.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Origin', 'Máy chủ thật của bạn — nguồn sự thật duy nhất biên lấy về từ đó.'],
  ['Edge / PoP', 'Một máy chủ đệm trong một Điểm hiện diện nằm vật lý gần người dùng.'],
  ['Anycast', 'Một IP quảng bá từ mọi PoP; định tuyến đưa người dùng tới cái gần nhất.'],
  ['HIT / MISS', 'Phục vụ từ cache biên / không có trong cache, lấy từ origin.'],
  ['EXPIRED', 'Bản cache quá TTL; biên kiểm lại với origin.'],
  ['TTL', 'Bản cache tươi bao lâu (từ Cache-Control hoặc luật CDN).'],
  ['cf-cache-status / X-Cache', 'Header câu trả lời khai kết quả cache.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một CDN là <strong>các bộ đệm ở biên tại nhiều PoP</strong> đứng trước một <strong>origin</strong>; <strong>Anycast</strong> định tuyến người dùng tới PoP gần nhất.</li>
<li>Yêu cầu đầu = <code>MISS</code> (lấy từ origin); yêu cầu sau = <code>HIT</code> (phục vụ ở biên, origin không bị chạm).</li>
<li>Một bản sao tươi trong <strong>TTL</strong>, rồi <code>EXPIRED</code> → biên kiểm lại và cache lại.</li>
<li>Đọc kết quả trong một header — <code>cf-cache-status</code> / <code>X-Cache</code> và <code>Age</code> — bằng <code>curl -I</code> ở mỗi chặng.</li>
<li>Akamai (1998) → Cloudflare (2009/2010) làm biên phổ quát và thông minh; nó tăng tốc câu trả lời <strong>cache-được</strong> và gỡ tải origin, không phải cơ sở dữ liệu hay trang động.</li>
</ul>
${L('https://www.cloudflare.com/learning/cdn/what-is-a-cdn/', '📘', 'Cloudflare — CDN là gì?', 'Edge, origin, PoP và cách một CDN giảm độ trễ cùng tải origin.', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Caching', '📘', 'MDN — Cache HTTP', 'Tươi và cũ, max-age, kiểm lại, và cache dùng chung/riêng.', 'Mở')}
${L('https://www.rfc-editor.org/rfc/rfc9111.html', '📄', 'RFC 9111 — HTTP Caching', 'Chuẩn cho cách các cache (trình duyệt, proxy, CDN) quyết độ tươi.', 'Mở')}
</div>
`,
};
