/**
 * Chương 8 · 8.3 — Khi proxy ghi đè header cache của bạn (slug khung netdev-8-3-nginx-nuot-header). Sự cố THẬT cuongthai 23/08/2026.
 * Output thật: lab/out/c83-*.out.txt (dựng lại: bash lab/code/dung-output-ch8.sh).
 */
import { run, card, kv, code } from '../_ui.mjs';
import G from '../giang/nfd-08-3.mjs';

const L = card;

export default {
  title: '8.3 — When your proxy overrides your cache headers|||8.3 — Khi proxy ghi đè header cache của bạn',
  slug: 'netdev-8-3-nginx-nuot-header',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bốn tầng (app, nginx, CDN, trình duyệt) đều có thể đổi Cache-Control; tầng CHẠM CUỐI thắng. Lab: origin gửi max-age=3600, biên hỏng proxy_hide_header + add_header no-store nuốt sạch. Sự cố thật cuongthai 23/08: no-store bao trùm làm cache Next.js không bao giờ chạy. add_header / proxy_hide_header / proxy_pass_header làm gì, và vì sao phải curl -I ở MỖI chặng — "đã ghi" ≠ "đã có hiệu lực".',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>When your proxy overrides your cache headers</h2>
<p class="lead">You read the last two lessons, set an immaculate <code>Cache-Control</code> in your app, deploy — and nothing caches. This is one of the most maddening caching bugs because the thing you configured is correct; a layer <em>between</em> your app and the user quietly rewrote the header on the way out. This lesson reproduces the fight on the lab, then tells the real story of the outage where nginx ate every cache header on cuongthai.com — not for an hour, but for the entire life of the feature.</p>

<h3>Four layers, and the last one wins</h3>
<p>On the way to the browser, a response passes through several places that can each <em>change</em> its headers:</p>
${kv([
  ['App (Next.js/Express)', 'Sets the value you intended on the response.'],
  ['nginx (reverse proxy)', 'Can hide, replace or add headers — the last word before the CDN.'],
  ['CDN (edge)', 'Applies its own rules; may honour or override the origin.'],
  ['Browser', 'Obeys whatever finally arrives.'],
])}
<p>The header the browser actually sees is whatever the <strong>last layer that touched it</strong> set. So a perfect <code>Cache-Control</code> in your app is worth nothing if nginx rewrites it on the way out — and you will not find that by reading your app's code.</p>

<h3>The lab: origin right, edge wrong</h3>
<p>Our origin (<code>:8081</code>) sends a correct caching header. A deliberately broken edge (<code>:8082</code>) rewrites it. Same file, both hops:</p>
${run('c83-nuot', 'curl', 2)}
<p>The origin says <code>Cache-Control: public, max-age=3600</code>. The broken edge returns <code>Cache-Control: no-store</code> for the identical file, because its config runs:</p>
${code('location /img/ {\n    proxy_pass http://origin;\n    proxy_hide_header Cache-Control;        # strip what the origin sent\n    add_header Cache-Control "no-store";    # stamp our own\n}', 'nginx')}
<p>It <strong>strips</strong> the good header and <strong>stamps</strong> its own. Everything downstream — browser, any CDN — now refuses to cache, and the origin's careful <code>max-age</code> never had a chance.</p>

<div class="pitfall co-tieu-de">
<p><strong>The real outage (cuongthai.com, 23 Aug 2026): nginx beats <code>next.config.js</code>, always.</strong> Next.js set a 7-day <code>Cache-Control</code> on <code>/playground/**</code> (94 MB of 3D assets) — exactly right. But nginx's <code>location /</code> ran <code>proxy_hide_header Cache-Control;</code> and then pasted <code>no-store</code> onto <em>every</em> response. So the rule in <code>next.config.js</code> never took effect — not for a single day. The same blanket <code>no-store</code> ate <code>public/</code> too: 12 SVG logos and a <code>robot.json</code> re-downloaded on every navigation. The fix was to give the cacheable branch its own <code>location</code> with no <code>proxy_hide_header</code>. The general lesson: <strong>setting a cache header in the app without a matching <code>location</code> in nginx is decoration</strong> — the proxy has the last word.</p>
</div>

<h3>The nginx directives in play</h3>
${kv([
  ['add_header X v;', 'ADD a header on the way out (does not by itself replace an upstream one).'],
  ['proxy_hide_header X;', 'STRIP header X coming from upstream before sending it on.'],
  ['proxy_pass_header X;', 'Explicitly let an upstream header through.'],
  ['add_header … always;', 'Add even on 4xx/5xx responses, not just 2xx/3xx.'],
])}
<p>Two sharp edges. First, the combination <code>proxy_hide_header Cache-Control;</code> + <code>add_header Cache-Control "no-store";</code> silently overrides anything upstream sent. Second, <code>add_header</code> in a nested <code>location</code> <strong>replaces</strong> the parent block's <code>add_header</code>s — you can lose a header simply by adding a different one in a child block.</p>

<h3>Verify on the wire, do not read the config</h3>
<p>This bug survives for weeks because people read the config and <em>believe</em> it. The header on the wire is the only truth. Check each hop:</p>
<ul>
<li><strong>App directly</strong> (bypass the proxy): <code>curl -I http://10.10.2.20:3000/x</code>.</li>
<li><strong>Through nginx</strong>: <code>curl -I http://10.10.2.10:8082/img/logo.txt</code> — compare the <code>Cache-Control</code>.</li>
<li><strong>Through the CDN</strong>: <code>curl -I https://&lt;public-domain&gt;/x</code> and read <code>cf-cache-status</code>.</li>
</ul>
<p>Where the header changes between two hops, you have found the layer at fault. This is the same lesson as nginx bind-mounts and <code>sshd</code> drop-ins: <strong>"it is written" is not "it is in effect."</strong></p>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> an app sets <code>Cache-Control: public, max-age=3600</code> but the browser shows <code>no-store</code> and nothing caches. Find the layer.</p>
<ol>
<li>On the lab, <code>curl -sD - -o /dev/null http://10.10.2.10:8081/img/logo.txt | grep -i cache-control</code> (origin) and the same against <code>:8082</code> (edge). Note where the header changes.</li>
<li>Read the broken edge's config and identify the two directives that cause it (<code>proxy_hide_header</code> + <code>add_header</code>).</li>
<li>Write the corrected <code>location</code> that lets the origin's <code>max-age=3600</code> survive.</li>
<li>State the general rule in one sentence.</li>
</ol>
<p><strong>Done when:</strong> you can show the header is correct at <code>:8081</code> and wrong at <code>:8082</code>, name the two directives, and your rule is "the last layer to touch the header wins — verify each hop with <code>curl -I</code>."</p>
<details><summary>Solution</summary>
<p>At <code>:8081</code> the header is <code>public, max-age=3600</code>; at <code>:8082</code> it is <code>no-store</code> — so the edge is the culprit. The cause is <code>proxy_hide_header Cache-Control;</code> followed by <code>add_header Cache-Control "no-store";</code>. The fix: drop both in that <code>location</code> (or give the cacheable path its own <code>location</code> without them) so the upstream header passes through. Rule: the last layer to touch a header wins; a cache header set in the app means nothing unless the proxy lets it through, so verify each hop with <code>curl -I</code>.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Layer fight', 'Several hops each able to set/override the same header; the last wins.'],
  ['proxy_hide_header', 'nginx directive that strips a header coming from upstream.'],
  ['add_header', 'nginx directive that adds a header on the response out.'],
  ['proxy_pass_header', 'Explicitly forwards an upstream header that nginx hides by default.'],
  ['no-store', 'Cache-Control value meaning "never cache"; lethal when applied blanket.'],
  ['curl -I', 'HEAD request to read only the headers — your per-hop truth check.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Four layers can change <code>Cache-Control</code> — app, nginx, CDN, browser; the <strong>last to touch it wins</strong>.</li>
<li>Lab: a broken edge's <code>proxy_hide_header</code> + <code>no-store</code> strips a correct <code>max-age=3600</code>.</li>
<li>Real outage: nginx's blanket <code>no-store</code> made a 7-day Next.js cache rule useless for the feature's whole life.</li>
<li><code>add_header</code> / <code>proxy_hide_header</code> / <code>proxy_pass_header</code> decide what survives — know which runs last.</li>
<li>Verify on the wire with <code>curl -I</code> at every hop; <strong>"it is written" ≠ "it is in effect."</strong></li>
</ul>
${L('https://nginx.org/en/docs/http/ngx_http_headers_module.html', '📘', 'nginx — ngx_http_headers_module (add_header)', 'How add_header works, including the "replaces parent block" gotcha.', 'Open')}
${L('https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_hide_header', '📘', 'nginx — proxy_hide_header / proxy_pass_header', 'Which upstream headers nginx hides by default and how to pass them.', 'Open')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control', '📘', 'MDN — Cache-Control', 'no-store, no-cache, public/private and max-age — what each means.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Khi proxy ghi đè header cache của bạn</h2>
<p class="lead">Bạn đọc hai bài trước, đặt một <code>Cache-Control</code> hoàn mỹ trong app, deploy — và không gì được cache. Đây là một trong những lỗi cache phát điên nhất vì thứ bạn cấu hình thì đúng; một tầng <em>giữa</em> app và người dùng đã âm thầm ghi đè header trên đường ra. Bài này tái hiện cuộc tranh trên lab, rồi kể câu chuyện thật về sự cố nơi nginx nuốt mọi header cache trên cuongthai.com — không phải một giờ, mà suốt cả đời của tính năng đó.</p>

<h3>Bốn tầng, và tầng cuối thắng</h3>
<p>Trên đường tới trình duyệt, một câu trả lời đi qua vài nơi, mỗi nơi đều có thể <em>đổi</em> header của nó:</p>
${kv([
  ['App (Next.js/Express)', 'Đặt giá trị bạn mong muốn trên câu trả lời.'],
  ['nginx (reverse proxy)', 'Có thể ẩn, thay hay thêm header — tiếng nói cuối trước CDN.'],
  ['CDN (biên)', 'Áp luật riêng; có thể tôn trọng hay ghi đè origin.'],
  ['Trình duyệt', 'Tuân theo cái cuối cùng tới.'],
])}
<p>Header trình duyệt thật sự thấy là cái mà <strong>tầng cuối cùng chạm vào</strong> đã đặt. Nên một <code>Cache-Control</code> hoàn hảo trong app chẳng đáng gì nếu nginx ghi đè nó trên đường ra — và bạn sẽ không tìm ra điều đó bằng cách đọc mã của app.</p>

<h3>Lab: origin đúng, biên sai</h3>
<p>Origin của ta (<code>:8081</code>) gửi một header cache đúng. Một biên cố tình làm hỏng (<code>:8082</code>) ghi đè nó. Cùng tệp, cả hai chặng:</p>
${run('c83-nuot', 'curl', 2)}
<p>Origin nói <code>Cache-Control: public, max-age=3600</code>. Biên hỏng trả <code>Cache-Control: no-store</code> cho đúng tệp đó, vì config của nó chạy:</p>
${code('location /img/ {\n    proxy_pass http://origin;\n    proxy_hide_header Cache-Control;        # tước cái origin gửi\n    add_header Cache-Control "no-store";    # đóng dấu của ta\n}', 'nginx')}
<p>Nó <strong>tước</strong> header tốt và <strong>đóng dấu</strong> cái của nó. Mọi thứ phía dưới — trình duyệt, bất kỳ CDN nào — nay từ chối cache, và cái <code>max-age</code> cẩn thận của origin không có cơ hội nào.</p>

<div class="pitfall co-tieu-de">
<p><strong>Sự cố thật (cuongthai.com, 23/08/2026): nginx thắng <code>next.config.js</code>, luôn luôn.</strong> Next.js đặt một <code>Cache-Control</code> 7 ngày trên <code>/playground/**</code> (94 MB tài nguyên 3D) — hoàn toàn đúng. Nhưng <code>location /</code> của nginx chạy <code>proxy_hide_header Cache-Control;</code> rồi dán <code>no-store</code> lên <em>mọi</em> câu trả lời. Nên luật trong <code>next.config.js</code> không bao giờ có hiệu lực — không một ngày nào. Cùng cái <code>no-store</code> bao trùm đó nuốt luôn <code>public/</code>: 12 logo SVG và một <code>robot.json</code> tải lại mỗi lần điều hướng. Cách sửa là cho nhánh cache-được một <code>location</code> riêng không có <code>proxy_hide_header</code>. Bài học chung: <strong>đặt một header cache trong app mà không có một <code>location</code> khớp trong nginx chỉ là trang trí</strong> — proxy có tiếng nói cuối.</p>
</div>

<h3>Các chỉ thị nginx trong cuộc</h3>
${kv([
  ['add_header X v;', 'THÊM một header trên đường ra (tự nó không thay một cái từ thượng nguồn).'],
  ['proxy_hide_header X;', 'TƯỚC header X đến từ thượng nguồn trước khi gửi tiếp.'],
  ['proxy_pass_header X;', 'Cho rõ một header thượng nguồn đi qua.'],
  ['add_header … always;', 'Thêm cả trên câu trả lời 4xx/5xx, không chỉ 2xx/3xx.'],
])}
<p>Hai cạnh sắc. Thứ nhất, kết hợp <code>proxy_hide_header Cache-Control;</code> + <code>add_header Cache-Control "no-store";</code> âm thầm ghi đè bất cứ gì thượng nguồn gửi. Thứ hai, <code>add_header</code> trong một <code>location</code> lồng <strong>thay cho</strong> các <code>add_header</code> của khối cha — bạn có thể mất một header chỉ vì thêm một cái khác trong khối con.</p>

<h3>Xác nhận trên dây, đừng đọc config</h3>
<p>Lỗi này sống nhiều tuần vì người ta đọc config rồi <em>tin</em> nó. Header trên dây là sự thật duy nhất. Kiểm từng chặng:</p>
<ul>
<li><strong>App trực tiếp</strong> (bỏ qua proxy): <code>curl -I http://10.10.2.20:3000/x</code>.</li>
<li><strong>Qua nginx</strong>: <code>curl -I http://10.10.2.10:8082/img/logo.txt</code> — so <code>Cache-Control</code>.</li>
<li><strong>Qua CDN</strong>: <code>curl -I https://&lt;tên-miền-công-khai&gt;/x</code> và đọc <code>cf-cache-status</code>.</li>
</ul>
<p>Chỗ header đổi giữa hai chặng là chỗ bạn tìm ra tầng có lỗi. Đây đúng là bài học của nginx bind-mount và drop-in <code>sshd</code>: <strong>"đã ghi" không phải "đã có hiệu lực."</strong></p>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một app đặt <code>Cache-Control: public, max-age=3600</code> nhưng trình duyệt hiện <code>no-store</code> và không gì được cache. Tìm tầng.</p>
<ol>
<li>Trên lab, <code>curl -sD - -o /dev/null http://10.10.2.10:8081/img/logo.txt | grep -i cache-control</code> (origin) và cùng lệnh với <code>:8082</code> (biên). Ghi nơi header đổi.</li>
<li>Đọc config của biên hỏng và nhận ra hai chỉ thị gây ra nó (<code>proxy_hide_header</code> + <code>add_header</code>).</li>
<li>Viết <code>location</code> đã sửa để <code>max-age=3600</code> của origin sống sót.</li>
<li>Nói quy tắc chung trong một câu.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn cho thấy header đúng ở <code>:8081</code> và sai ở <code>:8082</code>, kể hai chỉ thị, và quy tắc của bạn là "tầng cuối chạm vào header thắng — xác nhận mỗi chặng bằng <code>curl -I</code>."</p>
<details><summary>Lời giải</summary>
<p>Ở <code>:8081</code> header là <code>public, max-age=3600</code>; ở <code>:8082</code> là <code>no-store</code> — nên biên là thủ phạm. Nguyên nhân là <code>proxy_hide_header Cache-Control;</code> theo sau bởi <code>add_header Cache-Control "no-store";</code>. Sửa: bỏ cả hai trong <code>location</code> đó (hoặc cho đường cache-được một <code>location</code> riêng không có chúng) để header thượng nguồn đi qua. Quy tắc: tầng cuối chạm vào một header thắng; một header cache đặt trong app chẳng nghĩa gì trừ khi proxy cho nó qua, nên xác nhận mỗi chặng bằng <code>curl -I</code>.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Tranh tầng', 'Nhiều chặng đều đặt/ghi đè cùng một header; cái cuối thắng.'],
  ['proxy_hide_header', 'Chỉ thị nginx tước một header đến từ thượng nguồn.'],
  ['add_header', 'Chỉ thị nginx thêm một header trên câu trả lời ra.'],
  ['proxy_pass_header', 'Chuyển tiếp rõ một header thượng nguồn mà nginx ẩn mặc định.'],
  ['no-store', 'Giá trị Cache-Control nghĩa "không bao giờ cache"; chết người khi áp bao trùm.'],
  ['curl -I', 'Yêu cầu HEAD đọc chỉ header — phép kiểm sự thật từng chặng của bạn.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bốn tầng có thể đổi <code>Cache-Control</code> — app, nginx, CDN, trình duyệt; <strong>tầng cuối chạm vào thắng</strong>.</li>
<li>Lab: <code>proxy_hide_header</code> + <code>no-store</code> của một biên hỏng tước một <code>max-age=3600</code> đúng.</li>
<li>Sự cố thật: <code>no-store</code> bao trùm của nginx làm một luật cache Next.js 7 ngày vô dụng suốt cả đời tính năng.</li>
<li><code>add_header</code> / <code>proxy_hide_header</code> / <code>proxy_pass_header</code> quyết cái gì sống sót — biết cái nào chạy cuối.</li>
<li>Xác nhận trên dây bằng <code>curl -I</code> ở mọi chặng; <strong>"đã ghi" ≠ "đã có hiệu lực."</strong></li>
</ul>
${L('https://nginx.org/en/docs/http/ngx_http_headers_module.html', '📘', 'nginx — ngx_http_headers_module (add_header)', 'add_header hoạt động thế nào, kèm bẫy "thay cho khối cha".', 'Mở')}
${L('https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_hide_header', '📘', 'nginx — proxy_hide_header / proxy_pass_header', 'nginx ẩn các header thượng nguồn nào mặc định và cách cho chúng qua.', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control', '📘', 'MDN — Cache-Control', 'no-store, no-cache, public/private và max-age — mỗi cái nghĩa gì.', 'Mở')}
</div>
`,
};
