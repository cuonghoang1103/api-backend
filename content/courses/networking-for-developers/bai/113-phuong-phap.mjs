/**
 * Chương 11 · 11.4 — Bảng kiểm chẩn đoán theo tầng (slug khung netdev-11-4-phuong-phap).
 * Output thật: lab/out/c114-*.out.txt (dựng lại: bash lab/code/dung-output-ch11.sh).
 */
import { run, card, kv, cauNoi } from '../_ui.mjs';
import G from '../giang/nfd-11-4.mjs';

const L = card;
const LNX = { mon: 'Linux & Bash', khoa: 'linux-bash' };

export default {
  title: '11.4 — A layered troubleshooting checklist|||11.4 — Bảng kiểm chẩn đoán theo tầng',
  slug: 'netdev-11-4-phuong-phap',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cả khoá thành một PHƯƠNG PHÁP: một yêu cầu hỏng thì hỏng ở ĐÚNG MỘT tầng. Kiểm TỪ DƯỚI LÊN, mỗi tầng một lệnh, dừng ở cái đầu tiên hỏng: DNS (dig/getent) → định tuyến (ip route get) → cổng (nc -zv) → TLS (openssl s_client) → HTTP (curl -I) → app (curl /health). "Chạy ở máy tôi" = một TẦNG khác biệt (chạy cùng bảng kiểm hai nơi, so). Lỗi gián đoạn/một phần (MTU, IPv6 nửa-hỏng) trông ngẫu nhiên tới khi cô lập tầng. Tìm nhị phân tầng. Đo thật trên lab.',
  content: `${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>A layered troubleshooting checklist</h2>
<p class="lead">This is where the whole course pays off. Every layer you have studied — DNS, IP and routing, TCP, TLS, HTTP, load balancing — is a checkpoint, and a request that fails fails at <em>exactly one</em> of them. The method is simply to walk those checkpoints bottom-up, one command each, and stop at the first that fails. Done this way, "the site is broken" becomes "TLS is the layer, the cert expired" in about a minute — no guessing, no blaming "the network." This lesson runs the checklist on the lab and shows how it isolates even the random-looking bugs.</p>

<h3>Walk the layers, bottom-up</h3>
<p>Each layer depends on the one below, so you check from the bottom and stop at the first failure — there is no sense debugging HTTP if the port is refused.</p>
<ol>
<li><strong>DNS</strong> — does the name resolve to the right IP?</li>
<li><strong>Routing</strong> — does a packet to that IP leave by the right gateway?</li>
<li><strong>Port</strong> — is something listening (open), or refused/filtered?</li>
<li><strong>TLS</strong> — is the certificate valid and the handshake clean?</li>
<li><strong>HTTP</strong> — what status does the server return?</li>
<li><strong>App</strong> — does the application answer correctly?</li>
</ol>

<h3>The lower layers on the lab</h3>
<p><strong>DNS</strong> (name → IP) and <strong>routing</strong> (which gateway):</p>
${run('c114-checklist', 'getent', 1)}
${run('c114-checklist', 'ip route get', 1)}
<p>The name resolves, and a packet to the server leaves via the router (<code>10.10.1.254</code>). <strong>Port</strong> — is anything listening?</p>
${run('c114-checklist', 'nc -zv', 1)}
<p><code>nc -zv</code> gives an unambiguous answer: port 80 <strong>succeeded</strong>, port 81 <strong>refused</strong>. Now <strong>TLS</strong> — is the certificate valid?</p>
${run('c114-checklist', 'openssl', 1)}
<p><code>openssl s_client</code> + <code>x509</code> prints the certificate's subject and its validity window — exactly what you check for an expired or wrong-name cert.</p>

<h3>The upper layers</h3>
<p><strong>HTTP</strong> (what status) and <strong>app</strong> (a correct body):</p>
${run('c114-checklist', 'curl -sI', 1)}
${run('c114-checklist', 'curl -s http', 1)}
<p>The server returns <code>200 OK</code> and the application answers with valid JSON. Six layers, six commands, and at each one a yes/no that either moves you up or stops you at the culprit. (For a <em>public</em> name you'd use <code>dig +short name</code> for the DNS step instead of <code>getent</code>.)</p>

<div class="pitfall co-tieu-de">
<p><strong>"It works on my machine" is never magic — it is a layer that differs, and the checklist finds it.</strong> When something works in one place and fails in another, the instinct is to call it mysterious or flaky. It never is: <em>some</em> layer differs between the two environments — a different DNS resolver, a firewall rule, a missing or wrong certificate, an env var, a proxy in the path. The way to find it is mechanical, not clever: run the <strong>identical</strong> layer checklist on the machine where it works and on the one where it fails, and compare. The <em>first</em> layer whose answer differs is the cause. The same discipline cracks the nastiest bugs — the <strong>intermittent</strong> ones. "Big requests hang but small ones are fine" is an <strong>MTU</strong> black hole (oversized packets dropped, path-MTU-discovery blocked). "Slow for a few seconds, then fine" is often a <strong>half-broken IPv6</strong>: the client tries the AAAA record first, times out, and falls back to IPv4. These look random only until the checklist isolates the one layer misbehaving — <em>random is just a layer you have not measured yet</em>.</p>
</div>
${cauNoi('en', { ...LNX, bai: 'lnx-9-1-giao-dien-cong-dns', so: '9.1', ten: 'The network from the shell: interfaces, ports and DNS', giong: 'checking interfaces, ports and name resolution from the shell', khac: 'the Linux & Bash course covers ip, ss and dig as everyday shell commands', them: 'the layered method that strings them together — DNS → routing → port → TLS → HTTP → app, one command each, stopping at the first failure' })}

<h3>The habit: binary-search the layers</h3>
<p>You do not always have to start at the bottom. Start in the <strong>middle</strong> — port or TLS: is the connection even getting through? If yes, go <strong>up</strong> (HTTP, app); if no, go <strong>down</strong> (routing, DNS). Each check halves the remaining search, so you reach the cause in a few steps instead of trying things at random. That is the entire course distilled into a reflex: a request fails at one layer; find it, and the fix follows.</p>

<h3>🧪 Practice (25 minutes)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> "the API is down." Prove, layer by layer, where it actually fails (or that every layer is fine).</p>
<ol>
<li>On the lab, run the checklist in order: name → <code>ip route get</code> → <code>nc -zv</code> (80 and a closed port) → <code>openssl s_client</code> → <code>curl -I</code> → the app's JSON.</li>
<li>State the one command you'd use for each of the six layers, and what a healthy answer looks like.</li>
<li>Explain how you'd diagnose "works on my machine" with this checklist.</li>
<li>Match two symptoms to a layer: "big requests hang"; "slow for a few seconds then fine."</li>
</ol>
<p><strong>Done when:</strong> you ran all six checks and each passed; your commands are <code>dig/getent</code>, <code>ip route get</code>, <code>nc -zv</code>, <code>openssl s_client</code>, <code>curl -I</code>, a health GET; your "works on my machine" plan is "run the same checklist both places and compare"; and you matched "big requests hang" → MTU and "slow then fine" → IPv6/AAAA fallback.</p>
<details><summary>Solution</summary>
<p>DNS resolves the name (or <code>getent</code>/<code>dig +short</code> on the lab); <code>ip route get</code> shows the route via the router; <code>nc -zv</code> shows 80 open, 81 refused; <code>openssl s_client</code> shows a valid cert and dates; <code>curl -I</code> shows <code>200 OK</code>; the app returns JSON. "Works on my machine" = run the identical checklist on both and find the first layer whose answer differs. "Big requests hang" → MTU black hole; "slow then fine" → IPv6 AAAA tried first, times out, falls back to IPv4.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Layered checklist', 'Diagnose DNS → routing → port → TLS → HTTP → app, bottom-up.'],
  ['nc -zv', 'Test whether a port is open (succeeded) or refused/filtered.'],
  ['openssl s_client', 'Open a TLS connection to inspect the certificate and handshake.'],
  ['ip route get', 'Show which gateway a packet to an IP would use.'],
  ['MTU black hole', 'Oversized packets silently dropped; big requests hang.'],
  ['IPv6 fallback', 'AAAA tried first, times out, then IPv4 — a slow-then-fine symptom.'],
  ['Binary search', 'Check the middle layer, then go up or down — halve the search.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Diagnose <strong>bottom-up</strong> — DNS → routing → port → TLS → HTTP → app — and stop at the first failure.</li>
<li><strong>One command per layer</strong>: <code>dig</code>, <code>ip route get</code>, <code>nc -zv</code>, <code>openssl s_client</code>, <code>curl -I</code>, a health check.</li>
<li>"Works on my machine" is a <strong>layer that differs</strong> — run the same checklist both places and compare.</li>
<li>Intermittent/partial bugs (<strong>MTU</strong>, half-broken <strong>IPv6</strong>) look random until the checklist isolates the layer.</li>
<li><strong>Binary-search</strong> the layers: each check halves the problem — the method that ends guessing.</li>
</ul>
${L('https://wizardzines.com/zines/networking/', '📘', 'Julia Evans — Networking! (zine)', 'A visual, practical tour of the exact layers this checklist walks.', 'Open')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Session', '📘', 'MDN — An HTTP session', 'DNS → TCP → TLS → HTTP in sequence — the layers you check.', 'Open')}
${L('https://www.cloudflare.com/learning/network-layer/what-is-mtu/', '📘', 'Cloudflare — What is MTU?', 'Why oversized packets get dropped and big requests hang.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Bảng kiểm chẩn đoán theo tầng</h2>
<p class="lead">Đây là nơi cả khoá sinh lời. Mỗi tầng bạn đã học — DNS, IP và định tuyến, TCP, TLS, HTTP, cân bằng tải — là một chốt kiểm, và một yêu cầu hỏng thì hỏng ở <em>đúng một</em> trong chúng. Phương pháp đơn giản là đi qua các chốt đó từ dưới lên, mỗi tầng một lệnh, và dừng ở cái đầu tiên hỏng. Làm vậy, "site hỏng" thành "TLS là tầng, chứng chỉ hết hạn" trong khoảng một phút — không đoán, không đổ lỗi "mạng." Bài này chạy bảng kiểm trên lab và cho thấy nó cô lập cả các lỗi trông ngẫu nhiên thế nào.</p>

<h3>Đi qua các tầng, từ dưới lên</h3>
<p>Mỗi tầng phụ thuộc cái dưới, nên bạn kiểm từ đáy và dừng ở lỗi đầu tiên — vô nghĩa gỡ HTTP nếu cổng bị từ chối.</p>
<ol>
<li><strong>DNS</strong> — tên có phân giải ra IP đúng không?</li>
<li><strong>Định tuyến</strong> — một gói tới IP đó có đi ra qua gateway đúng không?</li>
<li><strong>Cổng</strong> — có gì đang nghe (mở), hay bị từ chối/lọc?</li>
<li><strong>TLS</strong> — chứng chỉ hợp lệ và cú bắt tay sạch không?</li>
<li><strong>HTTP</strong> — máy chủ trả mã gì?</li>
<li><strong>App</strong> — ứng dụng trả lời đúng không?</li>
</ol>

<h3>Các tầng dưới trên lab</h3>
<p><strong>DNS</strong> (tên → IP) và <strong>định tuyến</strong> (gateway nào):</p>
${run('c114-checklist', 'getent', 1)}
${run('c114-checklist', 'ip route get', 1)}
<p>Tên phân giải, và một gói tới máy chủ đi qua router (<code>10.10.1.254</code>). <strong>Cổng</strong> — có gì đang nghe không?</p>
${run('c114-checklist', 'nc -zv', 1)}
<p><code>nc -zv</code> cho một câu trả lời rõ ràng: cổng 80 <strong>thành công</strong>, cổng 81 <strong>bị từ chối</strong>. Giờ <strong>TLS</strong> — chứng chỉ hợp lệ không?</p>
${run('c114-checklist', 'openssl', 1)}
<p><code>openssl s_client</code> + <code>x509</code> in subject của chứng chỉ và cửa sổ hiệu lực của nó — đúng cái bạn kiểm cho một cert hết hạn hay sai tên.</p>

<h3>Các tầng trên</h3>
<p><strong>HTTP</strong> (mã gì) và <strong>app</strong> (một thân đúng):</p>
${run('c114-checklist', 'curl -sI', 1)}
${run('c114-checklist', 'curl -s http', 1)}
<p>Máy chủ trả <code>200 OK</code> và ứng dụng trả lời với JSON hợp lệ. Sáu tầng, sáu lệnh, và ở mỗi cái một có/không hoặc đẩy bạn lên hoặc dừng bạn ở thủ phạm. (Với một tên <em>công khai</em> bạn sẽ dùng <code>dig +short name</code> cho bước DNS thay vì <code>getent</code>.)</p>

<div class="pitfall co-tieu-de">
<p><strong>"Chạy ở máy tôi" không bao giờ là phép màu — nó là một tầng khác biệt, và bảng kiểm tìm ra nó.</strong> Khi một thứ chạy ở một nơi và hỏng ở nơi khác, bản năng là gọi nó bí ẩn hay chập chờn. Không bao giờ vậy: <em>một</em> tầng nào đó khác biệt giữa hai môi trường — một resolver DNS khác, một luật tường lửa, một chứng chỉ thiếu hay sai, một biến môi trường, một proxy trên đường. Cách tìm nó là máy móc, không phải khôn ngoan: chạy bảng kiểm tầng <strong>y hệt</strong> trên máy nơi nó chạy và trên cái nơi nó hỏng, và so. Tầng <em>đầu tiên</em> có câu trả lời khác là nguyên nhân. Cùng kỷ luật đó bẻ các lỗi tệ nhất — các lỗi <strong>gián đoạn</strong>. "Yêu cầu lớn treo nhưng nhỏ thì ổn" là một hố đen <strong>MTU</strong> (gói quá cỡ bị bỏ, path-MTU-discovery bị chặn). "Chậm vài giây, rồi ổn" thường là một <strong>IPv6 nửa-hỏng</strong>: client thử bản ghi AAAA trước, timeout, và lùi về IPv4. Những cái này trông ngẫu nhiên chỉ tới khi bảng kiểm cô lập một tầng hành xử sai — <em>ngẫu nhiên chỉ là một tầng bạn chưa đo</em>.</p>
</div>
${cauNoi('vi', { ...LNX, bai: 'lnx-9-1-giao-dien-cong-dns', so: '9.1', ten: 'Mạng nhìn từ shell: giao diện, cổng và DNS', giong: 'kiểm giao diện, cổng và phân giải tên từ shell', khac: 'khoá Linux & Bash dạy ip, ss và dig như lệnh shell hằng ngày', them: 'phương pháp theo tầng xâu chúng lại — DNS → định tuyến → cổng → TLS → HTTP → app, mỗi tầng một lệnh, dừng ở lỗi đầu tiên' })}

<h3>Thói quen: tìm nhị phân các tầng</h3>
<p>Bạn không phải luôn bắt đầu ở đáy. Bắt đầu ở <strong>giữa</strong> — cổng hay TLS: kết nối có đang đi qua không? Nếu có, đi <strong>lên</strong> (HTTP, app); nếu không, đi <strong>xuống</strong> (định tuyến, DNS). Mỗi phép kiểm chia đôi tìm kiếm còn lại, nên bạn tới nguyên nhân trong vài bước thay vì thử lung tung. Đó là cả khoá cô đọng thành một phản xạ: một yêu cầu hỏng ở một tầng; tìm nó, và cách sửa theo sau.</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> "API sập." Chứng minh, từng tầng, nơi nó thật sự hỏng (hay rằng mọi tầng đều ổn).</p>
<ol>
<li>Trên lab, chạy bảng kiểm theo thứ tự: tên → <code>ip route get</code> → <code>nc -zv</code> (80 và một cổng đóng) → <code>openssl s_client</code> → <code>curl -I</code> → JSON của app.</li>
<li>Nói một lệnh bạn sẽ dùng cho mỗi trong sáu tầng, và một câu trả lời khoẻ trông thế nào.</li>
<li>Giải thích cách bạn sẽ chẩn đoán "chạy ở máy tôi" với bảng kiểm này.</li>
<li>Khớp hai triệu chứng với một tầng: "yêu cầu lớn treo"; "chậm vài giây rồi ổn."</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chạy cả sáu phép kiểm và mỗi cái đạt; các lệnh của bạn là <code>dig/getent</code>, <code>ip route get</code>, <code>nc -zv</code>, <code>openssl s_client</code>, <code>curl -I</code>, một GET sức khoẻ; kế hoạch "chạy ở máy tôi" của bạn là "chạy cùng bảng kiểm hai nơi và so"; và bạn khớp "yêu cầu lớn treo" → MTU và "chậm rồi ổn" → lùi IPv6/AAAA.</p>
<details><summary>Lời giải</summary>
<p>DNS phân giải tên (hay <code>getent</code>/<code>dig +short</code> trên lab); <code>ip route get</code> cho thấy route qua router; <code>nc -zv</code> cho thấy 80 mở, 81 từ chối; <code>openssl s_client</code> cho thấy một cert hợp lệ và ngày; <code>curl -I</code> cho thấy <code>200 OK</code>; app trả JSON. "Chạy ở máy tôi" = chạy bảng kiểm y hệt trên cả hai và tìm tầng đầu tiên có câu trả lời khác. "Yêu cầu lớn treo" → hố đen MTU; "chậm rồi ổn" → IPv6 AAAA thử trước, timeout, lùi về IPv4.</p>
</details>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Bảng kiểm theo tầng', 'Chẩn đoán DNS → định tuyến → cổng → TLS → HTTP → app, từ dưới lên.'],
  ['nc -zv', 'Thử một cổng mở (succeeded) hay bị từ chối/lọc.'],
  ['openssl s_client', 'Mở một kết nối TLS để soi chứng chỉ và cú bắt tay.'],
  ['ip route get', 'Cho thấy gateway nào một gói tới một IP sẽ dùng.'],
  ['Hố đen MTU', 'Gói quá cỡ bị bỏ âm thầm; yêu cầu lớn treo.'],
  ['Lùi IPv6', 'AAAA thử trước, timeout, rồi IPv4 — triệu chứng chậm-rồi-ổn.'],
  ['Tìm nhị phân', 'Kiểm tầng giữa, rồi đi lên hay xuống — chia đôi tìm kiếm.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chẩn đoán <strong>từ dưới lên</strong> — DNS → định tuyến → cổng → TLS → HTTP → app — và dừng ở lỗi đầu tiên.</li>
<li><strong>Một lệnh mỗi tầng</strong>: <code>dig</code>, <code>ip route get</code>, <code>nc -zv</code>, <code>openssl s_client</code>, <code>curl -I</code>, một kiểm sức khoẻ.</li>
<li>"Chạy ở máy tôi" là một <strong>tầng khác biệt</strong> — chạy cùng bảng kiểm hai nơi và so.</li>
<li>Lỗi gián đoạn/một phần (<strong>MTU</strong>, <strong>IPv6</strong> nửa-hỏng) trông ngẫu nhiên tới khi bảng kiểm cô lập tầng.</li>
<li><strong>Tìm nhị phân</strong> các tầng: mỗi phép kiểm chia đôi vấn đề — phương pháp chấm dứt đoán mò.</li>
</ul>
${L('https://wizardzines.com/zines/networking/', '📘', 'Julia Evans — Networking! (zine)', 'Một chuyến trực quan, thực hành qua đúng các tầng bảng kiểm này đi.', 'Mở')}
${L('https://developer.mozilla.org/docs/Web/HTTP/Session', '📘', 'MDN — Một phiên HTTP', 'DNS → TCP → TLS → HTTP theo thứ tự — các tầng bạn kiểm.', 'Mở')}
${L('https://www.cloudflare.com/learning/network-layer/what-is-mtu/', '📘', 'Cloudflare — MTU là gì?', 'Vì sao gói quá cỡ bị bỏ và yêu cầu lớn treo.', 'Mở')}
</div>
`,
};
