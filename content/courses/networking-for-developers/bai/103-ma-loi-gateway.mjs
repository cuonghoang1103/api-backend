/**
 * Chương 10 · 10.4 — Đọc đúng 502, 503, 504 và 524 (slug khung netdev-10-4-ma-loi-gateway). Sự cố thật cuongthai 06/07/2026 (502 bảy phút).
 * Output thật: lab/out/c104-*.out.txt (dựng lại: bash lab/code/dung-output-ch10.sh).
 */
import { run, card, kv } from '../_ui.mjs';
import G from '../giang/nfd-10-4.mjs';

const L = card;

export default {
  title: '10.4 — Reading 502, 503, 504 and 524 correctly|||10.4 — Đọc đúng 502, 503, 504 và 524',
  slug: 'netdev-10-4-ma-loi-gateway',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bốn mã 5xx đến từ PHÍA TRƯỚC app (proxy/biên), mô tả trạng thái BACKEND: 502 (tới được nhưng trả lời hỏng/chết), 503 (không backend khoẻ), 504 (quá chậm qua read timeout), 524 (Cloudflare, origin im quá ~100s). Khác 500 (app tự ném). Đo thật 502 (upstream chết) + 504 (backend 3s vs timeout 1s). Sự cố thật: vòng lặp khởi động lại backend Exited(137) ⇒ 502 bảy phút; khôi phục bằng docker start. Chẩn đoán: đọc MÃ + curl từng chặng.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>Reading 502, 503, 504 and 524 correctly</h2>
<p class="lead">A 5xx error is not a vague "the site is broken." The specific number is a precise sentence about <em>where</em> the failure is, and almost always it is spoken by a layer <strong>in front of</strong> your application — a proxy, load balancer or CDN — reporting on the <strong>backend</strong> behind it. Learn to read 502, 503, 504 and 524 and a page that "just fails" becomes a page that tells you exactly where to look. This lesson reads each code, measures two of them on the lab, and tells the story of a 502 that lasted seven minutes.</p>

<h3>The four codes at a glance</h3>
${kv([
  ['502 Bad Gateway', 'The proxy reached the backend but got a broken/empty reply. Backend misbehaved.'],
  ['503 Service Unavailable', 'No healthy backend to send to (all down / overloaded).'],
  ['504 Gateway Timeout', 'The backend did not answer within the read timeout. Backend too slow.'],
  ['524 (Cloudflare)', 'Cloudflare-specific 504: origin silent past ~100 s (see Chapter 8).'],
])}
<p>All four come from <strong>in front of</strong> your app, describing the backend as <strong>broken</strong> (502), <strong>missing</strong> (503) or <strong>too slow</strong> (504/524). Crucially, a <code>500</code> is different: that is <em>your own code</em> throwing an exception. 500 = my app broke; 502 = the proxy says my backend broke.</p>

<h3>502 and 504 on the lab</h3>
<p>Two backend problems behind the same nginx, two different codes:</p>
${run('c104-codes', 'curl', 2)}
<p>The <code>:8082</code> server points at a port nobody is listening on, so nginx cannot connect to any backend → <strong>502</strong>. The <code>/slow</code> backend takes 3 s against a 1 s <code>proxy_read_timeout</code> → <strong>504</strong>. The code you get already tells you which kind of problem you have, before you even open the backend's logs.</p>

<h3>What each one is really saying</h3>
<ul>
<li><strong>502</strong> — "I found your backend and it misbehaved": it crashed mid-response, closed early, returned garbage, or was not listening. First check: is the backend actually up and listening? <code>curl</code> it directly.</li>
<li><strong>503</strong> — "I have no healthy backend to send to": all backends are down or marked unhealthy, or the LB is shedding load. Fix: add capacity, fix the health check.</li>
<li><strong>504</strong> — "the backend is up but too slow": it exceeded the read timeout. Fix: speed it up, or move long work off the request (202 + poll, Chapter 8).</li>
<li><strong>524</strong> — Cloudflare's own: the origin connected but stayed silent past ~100 s. Same fix as 504 at the edge.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>The real outage (cuongthai.com, 6 Jul 2026): a steady 502 means the proxy is fine but has no backend to reach.</strong> A deploy hit a backend <em>recreate race</em> — the container kept restarting and exiting with <code>Exited(137)</code> (OOM-killed), leaving orphan containers — so for <strong>seven minutes</strong> nginx had no healthy backend and returned <code>502</code> to every request. The trap is to blame nginx or the network; in fact the proxy was doing its job and telling the truth (<em>"the backend is broken"</em>). Recovery was simply <code>docker start cuonghoangdev_backend</code> to bring a healthy container back. The durable lesson that followed: deploys became a <strong>script you run</strong> with a controlled restart, never a side effect of a push that could race the container into a crash loop. When you see a sustained 502, do not debug the proxy — go check whether the backend is actually up.</p>
</div>

<h3>Diagnose: which layer is unhappy?</h3>
<ol>
<li><strong>Ask the backend directly</strong> (bypass the proxy): is it up and fast? That rules 502/504 in or out.</li>
<li><strong>Ask through the proxy</strong> on the same path and compare — the code tells you broken / missing / slow.</li>
<li><strong>Read the code, not the page</strong>: 502 ≠ 503 ≠ 504, and each points at a different cause.</li>
</ol>
<p>This is the same hop-by-hop <code>curl</code> discipline as the cache-header lesson (Chapter 8.3): the status on the wire is the truth, and it names the layer.</p>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> three incidents — a sustained 502, an intermittent 504, and a 503 during a traffic spike. Diagnose each from the code.</p>
<ol>
<li>On the lab, reproduce the 502 (<code>:8082</code>) and the 504 (<code>:8080/slow</code>). State which backend problem each represents.</li>
<li>For the sustained 502, write the first thing to check and why (hint: the backend, not the proxy).</li>
<li>Map each of 502 / 503 / 504 / 524 to "backend broken / missing / too slow / silent past ~100 s".</li>
<li>Explain how a <code>500</code> differs from a <code>502</code>.</li>
</ol>
<p><strong>Done when:</strong> you reproduced 502 (dead upstream) and 504 (slow backend vs timeout); your first check for a sustained 502 is "is the backend up and listening?" (curl it directly); your mapping is correct; and you can say a 500 is the app throwing while a 502 is the proxy reporting a bad backend.</p>
<details><summary>Solution</summary>
<p>502 = dead/broken upstream (the proxy connected to nothing); 504 = the backend took 3 s against a 1 s timeout. For a sustained 502, check the backend first — is the process up and listening on the expected port? (The cuongthai outage was a crash loop; the proxy was fine.) Mapping: 502 broken, 503 missing/none healthy, 504 too slow, 524 silent past ~100 s (Cloudflare). A 500 is your application code throwing an exception; a 502 is a proxy in front of it reporting that the backend misbehaved — different layers entirely.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['502 Bad Gateway', 'Proxy reached the backend but got a broken/empty reply.'],
  ['503 Service Unavailable', 'No healthy backend available (down / overloaded).'],
  ['504 Gateway Timeout', 'The backend did not answer within the read timeout.'],
  ['524', 'Cloudflare 504: origin connected but silent past ~100 s.'],
  ['500 Internal Server Error', 'Your own app threw — a different layer from 502.'],
  ['proxy_read_timeout', 'How long nginx waits for the backend before 504.'],
])}

<h3>📌 Summary</h3>
<ul>
<li><strong>502/503/504</strong> come from the <strong>proxy/edge</strong> about the <strong>backend</strong> (broken / missing / too slow); <strong>524</strong> is Cloudflare's.</li>
<li>Lab: a dead upstream → <code>502</code>; a slow backend vs a 1 s timeout → <code>504</code>.</li>
<li>A <code>500</code> is your app throwing; a <code>502</code> is the proxy reporting on a bad backend — different layers.</li>
<li>Real outage: a backend restart loop (<code>Exited(137)</code>) → <strong>502 for 7 minutes</strong>; recovered by starting a healthy container.</li>
<li>Diagnose by <strong>reading the code</strong> and <code>curl</code>-ing each hop — it names the layer and the backend's state.</li>
</ul>
${L('https://developer.mozilla.org/docs/Web/HTTP/Status/502', '📘', 'MDN — 502 Bad Gateway', 'What a gateway/proxy means by a bad upstream reply.', 'Open')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Status/504', '📘', 'MDN — 504 Gateway Timeout', 'The timeout-from-upstream status and its causes.', 'Open')}
${L('https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/', '📘', 'Cloudflare — 5xx errors', '520–524 explained, including which side each blames.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Đọc đúng 502, 503, 504 và 524</h2>
<p class="lead">Một lỗi 5xx không phải một câu mơ hồ "site hỏng." Con số cụ thể là một câu rõ về <em>chỗ</em> lỗi nằm đâu, và gần như luôn được nói bởi một tầng <strong>phía trước</strong> ứng dụng của bạn — một proxy, cân bằng tải hay CDN — báo về <strong>backend</strong> sau nó. Học đọc 502, 503, 504 và 524 và một trang "cứ thế hỏng" thành một trang nói cho bạn chính xác nhìn đâu. Bài này đọc từng mã, đo hai cái trên lab, và kể câu chuyện một 502 kéo dài bảy phút.</p>

<h3>Bốn mã trong một cái nhìn</h3>
${kv([
  ['502 Bad Gateway', 'Proxy tới được backend nhưng nhận trả lời hỏng/rỗng. Backend hành xử sai.'],
  ['503 Service Unavailable', 'Không backend khoẻ nào để gửi tới (tất cả down / quá tải).'],
  ['504 Gateway Timeout', 'Backend không trả lời trong timeout đọc. Backend quá chậm.'],
  ['524 (Cloudflare)', '504 riêng Cloudflare: origin im quá ~100s (xem Chương 8).'],
])}
<p>Cả bốn đến từ <strong>phía trước</strong> app của bạn, mô tả backend là <strong>hỏng</strong> (502), <strong>thiếu</strong> (503) hay <strong>quá chậm</strong> (504/524). Quan trọng, một <code>500</code> thì khác: đó là <em>mã của chính bạn</em> ném một ngoại lệ. 500 = app tôi hỏng; 502 = proxy nói backend tôi hỏng.</p>

<h3>502 và 504 trên lab</h3>
<p>Hai bài toán backend sau cùng một nginx, hai mã khác nhau:</p>
${run('c104-codes', 'curl', 2)}
<p>Máy chủ <code>:8082</code> trỏ tới một cổng không ai nghe, nên nginx không nối được tới backend nào → <strong>502</strong>. Backend <code>/slow</code> mất 3 giây so với <code>proxy_read_timeout</code> 1 giây → <strong>504</strong>. Mã bạn nhận đã nói cho bạn biết bạn có loại bài toán nào, trước cả khi mở log của backend.</p>

<h3>Mỗi cái thật sự đang nói gì</h3>
<ul>
<li><strong>502</strong> — "tôi tìm thấy backend của bạn và nó hành xử sai": nó sập giữa câu trả lời, đóng sớm, trả rác, hay không nghe. Kiểm đầu: backend có thật sự đang chạy và nghe không? <code>curl</code> nó trực tiếp.</li>
<li><strong>503</strong> — "tôi không có backend khoẻ nào để gửi tới": mọi backend down hay bị đánh dấu không khoẻ, hay LB đang giảm tải. Sửa: thêm dung lượng, sửa kiểm sức khoẻ.</li>
<li><strong>504</strong> — "backend đang chạy nhưng quá chậm": nó vượt timeout đọc. Sửa: tăng tốc nó, hoặc đưa việc dài ra khỏi yêu cầu (202 + hỏi lại, Chương 8).</li>
<li><strong>524</strong> — của riêng Cloudflare: origin nối được nhưng im quá ~100 giây. Cùng cách sửa như 504 ở biên.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Sự cố thật (cuongthai.com, 06/07/2026): một 502 đều đặn nghĩa là proxy ổn nhưng không có backend để với tới.</strong> Một deploy đụng một cuộc đua <em>tạo-lại</em> backend — container cứ khởi động lại và thoát với <code>Exited(137)</code> (bị OOM giết), để lại các container mồ côi — nên suốt <strong>bảy phút</strong> nginx không có backend khoẻ và trả <code>502</code> cho mọi yêu cầu. Cái bẫy là đổ lỗi nginx hay mạng; thực ra proxy đang làm việc của nó và nói sự thật (<em>"backend hỏng"</em>). Khôi phục chỉ là <code>docker start cuonghoangdev_backend</code> để đưa một container khoẻ về. Bài học bền theo sau: deploy thành một <strong>script bạn chạy</strong> với một lần khởi động lại có kiểm soát, không bao giờ là tác dụng phụ của một lần push có thể đua container vào một vòng lặp sập. Khi bạn thấy một 502 kéo dài, đừng gỡ lỗi proxy — đi kiểm backend có thật sự đang chạy không.</p>
</div>

<h3>Chẩn đoán: tầng nào không vui?</h3>
<ol>
<li><strong>Hỏi backend trực tiếp</strong> (bỏ qua proxy): nó có đang chạy và nhanh không? Điều đó loại 502/504 vào hay ra.</li>
<li><strong>Hỏi qua proxy</strong> trên cùng đường và so — mã cho bạn biết hỏng / thiếu / chậm.</li>
<li><strong>Đọc mã, không phải trang</strong>: 502 ≠ 503 ≠ 504, và mỗi cái chỉ một nguyên nhân khác.</li>
</ol>
<p>Đây là cùng kỷ luật <code>curl</code> từng chặng với bài header cache (Chương 8.3): trạng thái trên dây là sự thật, và nó gọi tên tầng.</p>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> ba sự cố — một 502 kéo dài, một 504 gián đoạn, và một 503 trong một đợt dồn lưu lượng. Chẩn đoán từng cái từ mã.</p>
<ol>
<li>Trên lab, tái hiện 502 (<code>:8082</code>) và 504 (<code>:8080/slow</code>). Nói mỗi cái biểu thị bài toán backend nào.</li>
<li>Với 502 kéo dài, viết thứ đầu tiên cần kiểm và vì sao (gợi ý: backend, không phải proxy).</li>
<li>Ánh xạ mỗi 502 / 503 / 504 / 524 tới "backend hỏng / thiếu / quá chậm / im quá ~100s".</li>
<li>Giải thích một <code>500</code> khác một <code>502</code> thế nào.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tái hiện 502 (upstream chết) và 504 (backend chậm vs timeout); kiểm đầu của bạn cho một 502 kéo dài là "backend có đang chạy và nghe không?" (curl nó trực tiếp); ánh xạ của bạn đúng; và bạn nói được một 500 là app ném còn một 502 là proxy báo một backend tồi.</p>
<details><summary>Lời giải</summary>
<p>502 = upstream chết/hỏng (proxy nối tới không gì); 504 = backend mất 3 giây so với timeout 1 giây. Với một 502 kéo dài, kiểm backend trước — tiến trình có đang chạy và nghe trên cổng mong đợi không? (Sự cố cuongthai là một vòng lặp sập; proxy ổn.) Ánh xạ: 502 hỏng, 503 thiếu/không khoẻ, 504 quá chậm, 524 im quá ~100s (Cloudflare). Một 500 là mã ứng dụng của bạn ném một ngoại lệ; một 502 là một proxy phía trước nó báo backend hành xử sai — hoàn toàn khác tầng.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['502 Bad Gateway', 'Proxy tới được backend nhưng nhận trả lời hỏng/rỗng.'],
  ['503 Service Unavailable', 'Không backend khoẻ nào sẵn (down / quá tải).'],
  ['504 Gateway Timeout', 'Backend không trả lời trong timeout đọc.'],
  ['524', '504 Cloudflare: origin nối được nhưng im quá ~100s.'],
  ['500 Internal Server Error', 'App của chính bạn ném — khác tầng với 502.'],
  ['proxy_read_timeout', 'nginx chờ backend bao lâu trước khi 504.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><strong>502/503/504</strong> đến từ <strong>proxy/biên</strong> về <strong>backend</strong> (hỏng / thiếu / quá chậm); <strong>524</strong> là của Cloudflare.</li>
<li>Lab: một upstream chết → <code>502</code>; một backend chậm so với timeout 1 giây → <code>504</code>.</li>
<li>Một <code>500</code> là app bạn ném; một <code>502</code> là proxy báo về một backend tồi — các tầng khác nhau.</li>
<li>Sự cố thật: một vòng lặp khởi động lại backend (<code>Exited(137)</code>) → <strong>502 bảy phút</strong>; khôi phục bằng cách khởi động một container khoẻ.</li>
<li>Chẩn đoán bằng cách <strong>đọc mã</strong> và <code>curl</code> mỗi chặng — nó gọi tên tầng và trạng thái backend.</li>
</ul>
${L('https://developer.mozilla.org/docs/Web/HTTP/Status/502', '📘', 'MDN — 502 Bad Gateway', 'Một gateway/proxy nghĩa gì khi upstream trả lời tồi.', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Status/504', '📘', 'MDN — 504 Gateway Timeout', 'Mã timeout-từ-upstream và các nguyên nhân.', 'Mở')}
${L('https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/', '📘', 'Cloudflare — Lỗi 5xx', '520–524 giải thích, kèm mỗi cái đổ lỗi phía nào.', 'Mở')}
</div>
`,
};
