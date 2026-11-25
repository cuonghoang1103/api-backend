/**
 * 9.4 — Khi DevTools không đủ: NetLog (chrome://net-export), MOZ_LOG của Firefox, log service worker/extension (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s09/netlog'] (Chrome 150 --log-net-log, chế độ Default, jq 1.7, openssl) và OUT['s09/firefox'] (Firefox 152 headless, MOZ_LOG).
 * Đã che trong output: thư mục nhà (/home/<ten-nguoi-dung>) và octet cuối của IP LAN — chính là bài học về quyền riêng tư của NetLog.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '9.4 — When DevTools is not enough: chrome://net-export and NetLog, Firefox MOZ_LOG, service worker and extension logs|||9.4 — Khi DevTools không đủ: chrome://net-export và NetLog, MOZ_LOG của Firefox, log của service worker và extension',
  slug: 'log-9-4-net-export',
  type: 'LESSON',
  isFreePreview: true,
  description: 'DevTools chỉ thấy request của một tab sau khi trình duyệt đã quyết định gửi. Bên dưới là ngăn mạng của cả trình duyệt: DNS, proxy, socket, TLS, và những request trình duyệt tự gửi. Ghi một NetLog thật (lỗi chứng chỉ, tên miền không tồn tại, cổng không ai nghe), đọc cấu trúc constants/events/source/phase bằng jq, tách tín hiệu khỏi nhiễu (ERR_ABORTED, thăm dò IPv6), đọc chuỗi sự kiện của một lỗi TLS, bảng mã net::ERR_ phải nhận ra, xem chứng chỉ máy chủ gửi để phát hiện proxy soi TLS; NetLog cũng lộ dữ liệu riêng tư như HAR. Firefox: about:logging và MOZ_LOG. Log của service worker và extension nằm ở đâu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Below DevTools: the browser's own network log</h2>
<p class="lead">The Network panel shows one tab's requests, from the moment the browser decided to send them. When a site fails only on one customer's laptop — corporate proxy, antivirus intercepting TLS, broken DNS, a VPN — the answer is lower down: in the browser's network stack. Chrome records that stack in a <strong>NetLog</strong>; Firefox in <strong>MOZ_LOG</strong>. This lesson captures and reads both, and shows where service workers and extensions log.</p>

<h3>The everyday picture: the bus dash-cam vs the passenger's ticket</h3>
<p>A ticket (a Network row) says one passenger rode from A to B. The dash-cam (NetLog) records the whole bus: every stop, the detour around a closed road, the passenger who tried to get on and was refused. Use it when the ticket alone cannot explain the trip.</p>

<h3>How to capture</h3>
<ul>
<li><strong>Normal users:</strong> open <code>chrome://net-export</code> (also <code>edge://net-export</code>) → choose <em>Strip private information</em> (default), <em>Include cookies and credentials</em>, or <em>Include raw bytes</em> → <strong>Start Logging to Disk</strong> → reproduce in another tab → <strong>Stop Logging</strong>. You get one JSON file.</li>
<li><strong>From the command line</strong> (what we do): <code>--log-net-log=FILE --net-log-capture-mode=Default</code> (or <code>IncludeSensitive</code>, <code>Everything</code>). Same file, starting from browser launch.</li>
<li><strong>To view:</strong> drop the file on <code>netlog-viewer.appspot.com</code> — Chromium's official viewer; it runs in your browser and does not upload the file. Or read it with jq, as below.</li>
</ul>

<h3>Step 1 — capture four outcomes</h3>
${ma('js', 's09/cong-cu/netlog.mjs')}
${lenh('s09/netlog', 0)}
${lenh('s09/netlog', 1)}
${lenh('s09/netlog', 2)}
<p>About 2 seconds of browsing, 3 438 events, 0.8 MB. The file has two parts. <code>constants</code> are dictionaries: event type names ↔ numbers, error names ↔ codes, source types, phases (<code>PHASE_BEGIN</code> 1, <code>PHASE_END</code> 2, <code>PHASE_NONE</code> 0), plus <code>clientInfo</code> (browser version, OS). <code>events</code> is the log: each has <code>time</code>, a numeric <code>type</code>, a <code>source</code> (<code>{id, type}</code> — which request, socket, DNS job… the event belongs to), a <code>phase</code> and <code>params</code>. Events are numbers, so every query starts by turning numbers back into names.</p>
${ma('bash', 's09/cong-cu/netlog-url.jq')}
${lenh('s09/netlog', 3)}
<ul>
<li><strong>The browser talks on its own.</strong> Time sync with Google, Safe Browsing keys, account list, a connectivity check — none were typed by us. DevTools for our tab would never show them; a firewall or proxy log at your company will. "Who is calling <code>accounts.google.com</code> from the build server?" — often the browser itself.</li>
<li><strong>A 404 is <code>net::OK</code>.</strong> At this level an HTTP error is a successful network transaction. NetLog answers "did the bytes travel?", not "was the page right?".</li>
<li>The three failures are three different layers: TLS trust, DNS, TCP.</li>
</ul>

<h3>Step 2 — signal vs noise</h3>
${ma('bash', 's09/cong-cu/netlog-loi.jq')}
${lenh('s09/netlog', 4)}
${lenh('s09/netlog', 6)}
<p>Not every error is a problem. <code>ERR_ABORTED</code> (18 here) is Chrome cancelling its own speculative connections — preconnects it did not need. <code>ERR_ADDRESS_UNREACHABLE</code> to <code>[2001:4860:4860::8888]:443</code> is Chrome probing whether this machine has an IPv6 route (a UDP "connect" to Google's public DNS address; no IPv6 here, so the probe fails — harmless). The real failures are the ones that end a <code>URL_REQUEST</code>:</p>
${lenh('s09/netlog', 5)}
<p>Read a failure from the bottom (the request) to the top (the cause): <code>URL_REQUEST#86</code> failed with <code>ERR_CERT_AUTHORITY_INVALID</code> → its <code>HTTP_STREAM_JOB</code> → <code>SSL_CONNECT_JOB</code> → <code>SOCKET#123</code> → <code>SSL_HANDSHAKE_ERROR</code> → <code>CERT_VERIFIER_JOB</code>: the certificate verifier rejected the server's certificate. The viewer shows the same chain as linked sources. What certificate did the server send?</p>
${lenh('s09/netlog', 10)}
<p>Subject = issuer: self-signed, nobody vouches for it. On a customer laptop the interesting case is the opposite — a valid-looking certificate whose <strong>issuer is the company's firewall or the antivirus</strong> (e.g. "FortiGate CA", "Kaspersky Anti-Virus Personal Root"): proof that TLS is being intercepted on that machine, which explains failures with certificate pinning, client certificates or HTTP/2 that nobody else can reproduce.</p>
${lenh('s09/netlog', 9)}
<table>
<thead><tr><th>Error</th><th>Layer</th><th>Usual cause at work</th></tr></thead>
<tbody>
<tr><td><code>ERR_NAME_NOT_RESOLVED</code> (-105)</td><td>DNS</td><td>Typo, internal name outside the VPN, DNS filter</td></tr>
<tr><td><code>ERR_CONNECTION_REFUSED</code> (-102)</td><td>TCP</td><td>Nothing listening; wrong port; service down</td></tr>
<tr><td><code>ERR_CONNECTION_TIMED_OUT</code> (-118)</td><td>TCP</td><td>Firewall dropping packets, wrong IP</td></tr>
<tr><td><code>ERR_CONNECTION_RESET</code> (-101)</td><td>TCP</td><td>Middlebox or server killed the connection (DPI, crash)</td></tr>
<tr><td><code>ERR_CERT_AUTHORITY_INVALID</code> (-202), <code>_COMMON_NAME_INVALID</code> (-200), <code>_DATE_INVALID</code> (-201)</td><td>TLS</td><td>Self-signed/internal CA, wrong host name, expired or a wrong clock on the client (Lesson 1.5)</td></tr>
<tr><td><code>ERR_SSL_PROTOCOL_ERROR</code> (-107)</td><td>TLS</td><td>Plain HTTP on an HTTPS port, broken proxy</td></tr>
<tr><td><code>ERR_PROXY_CONNECTION_FAILED</code> (-130), <code>ERR_TUNNEL_CONNECTION_FAILED</code> (-111)</td><td>Proxy</td><td>Proxy settings/PAC wrong, proxy refuses CONNECT</td></tr>
<tr><td><code>ERR_INTERNET_DISCONNECTED</code> (-106), <code>ERR_ADDRESS_UNREACHABLE</code> (-109)</td><td>Local network</td><td>No network / no route</td></tr>
<tr><td><code>ERR_BLOCKED_BY_CLIENT</code> (-20)</td><td>Browser</td><td>An extension (ad blocker) blocked it</td></tr>
<tr><td><code>ERR_ABORTED</code> (-3), <code>ERR_FAILED</code> (-2)</td><td>Generic</td><td>Cancelled (navigation, preconnect) / see the other errors near it — CORS shows up as ERR_FAILED</td></tr>
</tbody></table>

<h3>Step 3 — a NetLog is private data too</h3>
${lenh('s09/netlog', 7)}
${lenh('s09/netlog', 8)}
<p>Even in the default "strip private information" mode, the file contains the full command line (with the user's home folder — masked by us above), the LAN address of the machine (masked to <code>.x</code>), the OS version and every host name visited. With <em>Include cookies and credentials</em> it is as dangerous as the HAR of Lesson 9.3. Ask customers for the default mode first, store the file like a HAR, delete it after the ticket.</p>

<h3>Step 4 — Firefox: about:logging and MOZ_LOG</h3>
<p>Firefox has no NetLog, but it can log its network modules as text. In the UI: <code>about:logging</code> → preset <em>Networking</em> → Start logging; <code>about:networking</code> shows live DNS cache, sockets and HTTP connections. From the command line it is the <code>MOZ_LOG</code> environment variable — module:level pairs:</p>
${ma('bash', 's09/firefox.bash')}
${lenh('s09/firefox', 0)}
${lenh('s09/firefox', 1)}
<p>Each line: UTC timestamp, process (<code>Parent</code> = the main process; content processes write <code>child-N</code> files), thread, level letter (<code>E</code> error, <code>W</code>, <code>I</code>, <code>D</code> debug, <code>V</code>) and module (<code>nsHttp</code>, <code>nsHostResolver</code>). Same diagnosis as Chrome's <code>ERR_NAME_NOT_RESOLVED</code>: <em>failure: unknown host</em>.</p>

<h3>Step 5 — service workers and extensions log elsewhere</h3>
<ul>
<li><strong>Service worker</strong> (offline caching, push): its <code>console.*</code> goes to its own context. DevTools → Application → Service workers (click the worker's link to inspect it), or <code>chrome://serviceworker-internals</code> / <code>chrome://inspect/#service-workers</code> for all of them with "Inspect" and a log of registrations. "My fix is deployed but users still see the old page" is often a service worker serving cache — the debugging course shows the fix.</li>
<li><strong>Extensions</strong> (Manifest V3): the background code is a service worker; <code>chrome://extensions</code> → Developer mode → "Inspect views: service worker" opens its Console, and the <strong>Errors</strong> button lists its crashes. When a customer's page fails and the Console mentions <code>chrome-extension://…</code>, an extension is modifying the page.</li>
</ul>

<h3>Hacker's corner: the proxy in the middle</h3>
<p>TLS interception is what an attacker on the network wants (read and change traffic) and what many corporate firewalls and antivirus products do on purpose by installing their own root certificate. The browser trusts it, so the padlock stays green — the only trace is the <strong>issuer</strong> in the certificate chain, which a NetLog captures. Habits: on your own machine, check the issuer of a site you know (DevTools → Security, or the NetLog step above); on a public Wi-Fi, a certificate warning is not a nuisance to click through — it is the browser telling you someone is in the middle. On a customer's machine, an unexpected issuer is a finding to report, not something to "fix" by disabling checks.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>"Your site works for us but not for our office."</strong> Ask for a NetLog (default mode) while they reproduce. You will see the proxy, the DNS answer and the certificate issuer — and can tell them which device to look at.</li>
<li><strong>Learning on a school network</strong> where some sites are blocked: NetLog shows whether the block is DNS (name resolves to a block page IP), TCP reset, or TLS interception — useful when you need a VPN for development, as in the networking course.</li>
<li><strong>Outsourcing</strong>: the customer's QA environment is behind their VPN; a NetLog from their tester is the closest you get to sitting at their desk.</li>
</ul>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>In your own Chrome, record <code>chrome://net-export</code> while opening <code>https://expired.badssl.com/</code> and <code>https://wrong.host.badssl.com/</code>. Which two error names appear, and in which event type?</li>
<li>Load the file in netlog-viewer.appspot.com → Events. Find the <code>URL_REQUEST</code> for the first site and follow its dependencies down to the socket.</li>
<li>With jq, print the issuer of every certificate the browser received during the capture. Is any issuer not a public CA?</li>
<li>Repeat 1 in Firefox with <code>about:logging</code> preset Networking. Find the matching line.</li>
</ol>
<p><strong>Done when:</strong> 1 gives <code>ERR_CERT_DATE_INVALID</code> and <code>ERR_CERT_COMMON_NAME_INVALID</code> from <code>CERT_VERIFIER_JOB</code>/<code>SSL_CONNECT</code>; 2 reaches <code>SSL_HANDSHAKE_ERROR</code>; 3 loops over <code>SSL_CERTIFICATES_RECEIVED</code> → <code>params.certificates[0]</code> → <code>openssl x509 -issuer</code>; 4 quotes a line with the host name and the error.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['NetLog', 'Chrome’s log of its whole network stack (DNS, proxy, sockets, TLS, requests), as JSON.'],
  ['chrome://net-export', 'The page that records a NetLog to disk; capture modes Default / IncludeSensitive / Everything.'],
  ['source / phase', 'Which object (URL_REQUEST, SOCKET, DNS job…) an event belongs to; BEGIN/END/NONE.'],
  ['net::ERR_…', 'Chromium network error names with negative codes (-105, -102, -202…).'],
  ['TLS interception', 'A proxy/antivirus decrypts HTTPS using its own trusted root certificate; visible in the issuer.'],
  ['MOZ_LOG', 'Firefox module:level logging (nsHttp, nsHostResolver…), also set from about:logging.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>NetLog sees the whole browser, including its own background requests, below the HTTP layer.</li>
<li>Read it with jq by turning numbers into names; follow a failed URL_REQUEST down to the socket.</li>
<li>Ignore expected noise (ERR_ABORTED, IPv6 probe); a 404 is net::OK here.</li>
<li>The certificate issuer exposes TLS interception.</li>
<li>NetLog contains paths, IPs and host names — handle it like a HAR.</li>
<li>Firefox: about:logging / MOZ_LOG; service workers and extensions have their own consoles.</li>
</ul>
${nguon('📘', 'Chromium — NetLog: Chrome’s network logging', 'net-export, capture modes, viewer', 'https://www.chromium.org/developers/design-documents/network-stack/netlog/')}
${nguon('🧰', 'NetLog viewer', 'Chromium’s viewer; the file stays in your browser', 'https://netlog-viewer.appspot.com/')}
${nguon('📘', 'Firefox Source Docs — HTTP logging', 'about:logging, MOZ_LOG modules for networking', 'https://firefox-source-docs.mozilla.org/networking/http/logging.html')}
${lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-5-4-storage-react', title: 'Debugging 5.4 — Application tab', sub: 'Service workers that serve yesterday’s version', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Bên dưới DevTools: log mạng riêng của trình duyệt</h2>
<p class="lead">Bảng Network cho thấy request của một tab, kể từ lúc trình duyệt quyết định gửi. Khi một trang chỉ lỗi trên laptop của một khách hàng — proxy công ty, phần mềm diệt virus soi TLS, DNS hỏng, VPN — câu trả lời nằm thấp hơn: trong ngăn mạng của trình duyệt. Chrome ghi ngăn đó vào <strong>NetLog</strong>; Firefox vào <strong>MOZ_LOG</strong>. Bài này ghi và đọc cả hai, và chỉ ra service worker với extension ghi log ở đâu.</p>

<h3>Liên tưởng đời thường: camera hành trình của xe buýt và tấm vé của hành khách</h3>
<p>Tấm vé (một hàng Network) nói một hành khách đi từ A tới B. Camera hành trình (NetLog) quay cả chiếc xe: từng trạm dừng, đoạn đi vòng vì đường cấm, người khách định lên mà bị từ chối. Dùng nó khi chỉ tấm vé không giải thích được chuyến đi.</p>

<h3>Cách ghi</h3>
<ul>
<li><strong>Người dùng bình thường:</strong> mở <code>chrome://net-export</code> (Edge: <code>edge://net-export</code>) → chọn <em>Strip private information</em> (mặc định), <em>Include cookies and credentials</em>, hoặc <em>Include raw bytes</em> → <strong>Start Logging to Disk</strong> → tái hiện ở tab khác → <strong>Stop Logging</strong>. Bạn nhận được một tệp JSON.</li>
<li><strong>Từ dòng lệnh</strong> (cách ta làm): <code>--log-net-log=TỆP --net-log-capture-mode=Default</code> (hoặc <code>IncludeSensitive</code>, <code>Everything</code>). Cùng loại tệp, ghi từ lúc trình duyệt khởi động.</li>
<li><strong>Để xem:</strong> kéo tệp vào <code>netlog-viewer.appspot.com</code> — trình xem chính thức của Chromium; nó chạy ngay trong trình duyệt của bạn, không tải tệp lên. Hoặc đọc bằng jq như dưới đây.</li>
</ul>

<h3>Bước 1 — ghi bốn kết cục</h3>
${ma('js', 's09/cong-cu/netlog.mjs')}
${lenh('s09/netlog', 0)}
${lenh('s09/netlog', 1)}
${lenh('s09/netlog', 2)}
<p>Chừng 2 giây duyệt web, 3 438 sự kiện, 0,8 MB. Tệp có hai phần. <code>constants</code> là các từ điển: tên kiểu sự kiện ↔ số, tên lỗi ↔ mã, kiểu nguồn, các pha (<code>PHASE_BEGIN</code> 1, <code>PHASE_END</code> 2, <code>PHASE_NONE</code> 0), cộng <code>clientInfo</code> (phiên bản trình duyệt, hệ điều hành). <code>events</code> là log: mỗi sự kiện có <code>time</code>, một <code>type</code> dạng số, một <code>source</code> (<code>{id, type}</code> — sự kiện thuộc request, socket, tác vụ DNS… nào), một <code>phase</code> và <code>params</code>. Sự kiện được ghi bằng số, nên truy vấn nào cũng bắt đầu bằng việc đổi số về tên.</p>
${ma('bash', 's09/cong-cu/netlog-url.jq')}
${lenh('s09/netlog', 3)}
<ul>
<li><strong>Trình duyệt tự nói chuyện.</strong> Đồng bộ giờ với Google, khoá Safe Browsing, danh sách tài khoản, kiểm tra kết nối mạng — không cái nào do ta gõ. DevTools của tab ta không bao giờ hiện chúng; log tường lửa hay proxy ở công ty bạn thì có. "Ai gọi <code>accounts.google.com</code> từ máy build?" — nhiều khi chính là trình duyệt.</li>
<li><strong>404 là <code>net::OK</code>.</strong> Ở tầng này, một lỗi HTTP là một giao dịch mạng thành công. NetLog trả lời "byte có đi tới nơi không?", không phải "trang có đúng không?".</li>
<li>Ba lỗi là ba tầng khác nhau: độ tin cậy TLS, DNS, TCP.</li>
</ul>

<h3>Bước 2 — tín hiệu và nhiễu</h3>
${ma('bash', 's09/cong-cu/netlog-loi.jq')}
${lenh('s09/netlog', 4)}
${lenh('s09/netlog', 6)}
<p>Không phải lỗi nào cũng là vấn đề. <code>ERR_ABORTED</code> (18 lần ở đây) là Chrome tự huỷ những kết nối mở sẵn đoán trước mà nó không cần tới. <code>ERR_ADDRESS_UNREACHABLE</code> tới <code>[2001:4860:4860::8888]:443</code> là Chrome thăm dò xem máy có đường IPv6 không (một lệnh "connect" UDP tới địa chỉ DNS công cộng của Google; máy này không có IPv6 nên thất bại — vô hại). Lỗi thật là lỗi kết thúc một <code>URL_REQUEST</code>:</p>
${lenh('s09/netlog', 5)}
<p>Đọc một lỗi từ dưới (request) lên trên (nguyên nhân): <code>URL_REQUEST#86</code> hỏng với <code>ERR_CERT_AUTHORITY_INVALID</code> → <code>HTTP_STREAM_JOB</code> của nó → <code>SSL_CONNECT_JOB</code> → <code>SOCKET#123</code> → <code>SSL_HANDSHAKE_ERROR</code> → <code>CERT_VERIFIER_JOB</code>: bộ kiểm chứng chỉ đã từ chối chứng chỉ của máy chủ. Trình xem hiện cùng chuỗi đó dưới dạng các nguồn liên kết nhau. Máy chủ đã gửi chứng chỉ nào?</p>
${lenh('s09/netlog', 10)}
<p>Subject = issuer: tự ký, không ai bảo lãnh. Trên laptop khách hàng, trường hợp đáng chú ý lại ngược lại — một chứng chỉ trông hợp lệ mà <strong>bên cấp là tường lửa của công ty hay phần mềm diệt virus</strong> (ví dụ "FortiGate CA", "Kaspersky Anti-Virus Personal Root"): bằng chứng TLS đang bị soi trên máy đó, giải thích các lỗi với certificate pinning, chứng chỉ phía máy khách hay HTTP/2 mà không ai khác tái hiện được.</p>
${lenh('s09/netlog', 9)}
<table>
<thead><tr><th>Lỗi</th><th>Tầng</th><th>Nguyên nhân hay gặp khi đi làm</th></tr></thead>
<tbody>
<tr><td><code>ERR_NAME_NOT_RESOLVED</code> (-105)</td><td>DNS</td><td>Gõ sai, tên nội bộ khi không bật VPN, bộ lọc DNS</td></tr>
<tr><td><code>ERR_CONNECTION_REFUSED</code> (-102)</td><td>TCP</td><td>Không ai lắng nghe; sai cổng; dịch vụ đang tắt</td></tr>
<tr><td><code>ERR_CONNECTION_TIMED_OUT</code> (-118)</td><td>TCP</td><td>Tường lửa vứt gói, sai IP</td></tr>
<tr><td><code>ERR_CONNECTION_RESET</code> (-101)</td><td>TCP</td><td>Thiết bị trung gian hay máy chủ cắt kết nối (DPI, sập)</td></tr>
<tr><td><code>ERR_CERT_AUTHORITY_INVALID</code> (-202), <code>_COMMON_NAME_INVALID</code> (-200), <code>_DATE_INVALID</code> (-201)</td><td>TLS</td><td>Tự ký/CA nội bộ, sai tên máy, hết hạn hoặc đồng hồ máy khách sai (bài 1.5)</td></tr>
<tr><td><code>ERR_SSL_PROTOCOL_ERROR</code> (-107)</td><td>TLS</td><td>HTTP thường trên cổng HTTPS, proxy hỏng</td></tr>
<tr><td><code>ERR_PROXY_CONNECTION_FAILED</code> (-130), <code>ERR_TUNNEL_CONNECTION_FAILED</code> (-111)</td><td>Proxy</td><td>Cấu hình proxy/PAC sai, proxy từ chối CONNECT</td></tr>
<tr><td><code>ERR_INTERNET_DISCONNECTED</code> (-106), <code>ERR_ADDRESS_UNREACHABLE</code> (-109)</td><td>Mạng nội bộ</td><td>Không có mạng / không có đường đi</td></tr>
<tr><td><code>ERR_BLOCKED_BY_CLIENT</code> (-20)</td><td>Trình duyệt</td><td>Một extension (chặn quảng cáo) đã chặn</td></tr>
<tr><td><code>ERR_ABORTED</code> (-3), <code>ERR_FAILED</code> (-2)</td><td>Chung</td><td>Bị huỷ (chuyển trang, kết nối mở sẵn) / xem các lỗi cạnh nó — CORS hiện ra dưới dạng ERR_FAILED</td></tr>
</tbody></table>

<h3>Bước 3 — NetLog cũng là dữ liệu riêng tư</h3>
${lenh('s09/netlog', 7)}
${lenh('s09/netlog', 8)}
<p>Ngay ở chế độ mặc định "strip private information", tệp vẫn chứa nguyên dòng lệnh (có thư mục nhà của người dùng — ta đã che ở trên), địa chỉ LAN của máy (che thành <code>.x</code>), phiên bản hệ điều hành và mọi tên máy đã truy cập. Với <em>Include cookies and credentials</em> nó nguy hiểm ngang tệp HAR ở bài 9.3. Xin khách hàng chế độ mặc định trước, cất tệp như cất HAR, xoá sau khi xong ticket.</p>

<h3>Bước 4 — Firefox: about:logging và MOZ_LOG</h3>
<p>Firefox không có NetLog, nhưng ghi được log các mô-đun mạng dạng chữ. Trên giao diện: <code>about:logging</code> → mẫu <em>Networking</em> → Start logging; <code>about:networking</code> cho xem trực tiếp bộ nhớ đệm DNS, socket và kết nối HTTP. Từ dòng lệnh là biến môi trường <code>MOZ_LOG</code> — các cặp mô-đun:mức:</p>
${ma('bash', 's09/firefox.bash')}
${lenh('s09/firefox', 0)}
${lenh('s09/firefox', 1)}
<p>Mỗi dòng: dấu thời gian UTC, tiến trình (<code>Parent</code> = tiến trình chính; tiến trình nội dung ghi tệp <code>child-N</code>), luồng, chữ cái mức (<code>E</code> lỗi, <code>W</code>, <code>I</code>, <code>D</code> debug, <code>V</code>) và mô-đun (<code>nsHttp</code>, <code>nsHostResolver</code>). Cùng chẩn đoán với <code>ERR_NAME_NOT_RESOLVED</code> của Chrome: <em>failure: unknown host</em>.</p>

<h3>Bước 5 — service worker và extension ghi log ở chỗ khác</h3>
<ul>
<li><strong>Service worker</strong> (cache ngoại tuyến, push): <code>console.*</code> của nó đi vào ngữ cảnh riêng. DevTools → Application → Service workers (bấm liên kết của worker để inspect), hoặc <code>chrome://serviceworker-internals</code> / <code>chrome://inspect/#service-workers</code> để xem tất cả, có nút "Inspect" và log đăng ký. "Em deploy bản sửa rồi mà người dùng vẫn thấy trang cũ" thường là service worker đang phục vụ cache — khoá gỡ lỗi có cách sửa.</li>
<li><strong>Extension</strong> (Manifest V3): mã nền là một service worker; <code>chrome://extensions</code> → Developer mode → "Inspect views: service worker" mở Console của nó, và nút <strong>Errors</strong> liệt kê các lần nó lỗi. Khi trang của khách hỏng mà Console nhắc tới <code>chrome-extension://…</code>, có một extension đang sửa trang.</li>
</ul>

<h3>Góc hacker: proxy đứng giữa</h3>
<p>Soi TLS là điều kẻ tấn công trên đường mạng muốn (đọc và sửa lưu lượng), và cũng là điều nhiều tường lửa công ty, phần mềm diệt virus cố ý làm bằng cách cài chứng chỉ gốc riêng của chúng. Trình duyệt tin chứng chỉ đó nên ổ khoá vẫn xanh — dấu vết duy nhất là <strong>bên cấp</strong> trong chuỗi chứng chỉ, thứ NetLog ghi lại được. Thói quen: trên máy mình, kiểm bên cấp của một trang quen (DevTools → Security, hoặc bước NetLog ở trên); ở Wi-Fi công cộng, cảnh báo chứng chỉ không phải thứ phiền phức để bấm bỏ qua — đó là trình duyệt báo có người đứng giữa. Trên máy khách hàng, bên cấp lạ là một phát hiện cần báo, không phải thứ để "sửa" bằng cách tắt kiểm tra.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>"Trang của các anh chạy với chúng tôi nhưng ở văn phòng thì không."</strong> Xin một NetLog (chế độ mặc định) khi họ tái hiện. Bạn sẽ thấy proxy, câu trả lời DNS và bên cấp chứng chỉ — và chỉ được cho họ thiết bị nào cần xem.</li>
<li><strong>Học trên mạng trường</strong> có trang bị chặn: NetLog cho thấy chặn ở DNS (tên trỏ về IP trang chặn), TCP bị reset, hay TLS bị soi — có ích khi bạn cần VPN để làm việc, như ở khoá mạng.</li>
<li><strong>Outsourcing</strong>: môi trường QA của khách nằm sau VPN của họ; một NetLog từ tester của họ là thứ gần nhất với việc ngồi tại bàn của họ.</li>
</ul>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Trên Chrome của bạn, ghi <code>chrome://net-export</code> trong khi mở <code>https://expired.badssl.com/</code> và <code>https://wrong.host.badssl.com/</code>. Hai tên lỗi nào hiện ra, ở kiểu sự kiện nào?</li>
<li>Mở tệp trong netlog-viewer.appspot.com → Events. Tìm <code>URL_REQUEST</code> của trang đầu và đi theo các phụ thuộc xuống tới socket.</li>
<li>Bằng jq, in bên cấp của mọi chứng chỉ trình duyệt nhận được trong lần ghi. Có bên cấp nào không phải CA công khai không?</li>
<li>Làm lại câu 1 trên Firefox với <code>about:logging</code> mẫu Networking. Tìm dòng tương ứng.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 ra <code>ERR_CERT_DATE_INVALID</code> và <code>ERR_CERT_COMMON_NAME_INVALID</code> từ <code>CERT_VERIFIER_JOB</code>/<code>SSL_CONNECT</code>; câu 2 đi tới được <code>SSL_HANDSHAKE_ERROR</code>; câu 3 lặp qua <code>SSL_CERTIFICATES_RECEIVED</code> → <code>params.certificates[0]</code> → <code>openssl x509 -issuer</code>; câu 4 trích được một dòng có tên máy và lỗi.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['NetLog', 'Log của cả ngăn mạng Chrome (DNS, proxy, socket, TLS, request), dạng JSON.'],
  ['chrome://net-export', 'Trang ghi NetLog ra đĩa; chế độ Default / IncludeSensitive / Everything.'],
  ['source / phase', 'Sự kiện thuộc đối tượng nào (URL_REQUEST, SOCKET, tác vụ DNS…); BEGIN/END/NONE.'],
  ['net::ERR_…', 'Tên lỗi mạng của Chromium với mã âm (-105, -102, -202…).'],
  ['soi TLS (TLS interception)', 'Proxy/phần mềm diệt virus giải mã HTTPS bằng chứng chỉ gốc riêng được tin cậy; lộ ra ở bên cấp.'],
  ['MOZ_LOG', 'Ghi log theo mô-đun:mức của Firefox (nsHttp, nsHostResolver…), cũng đặt được từ about:logging.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>NetLog thấy cả trình duyệt, kể cả request nền nó tự gửi, ở dưới tầng HTTP.</li>
<li>Đọc bằng jq bằng cách đổi số thành tên; đi từ URL_REQUEST hỏng xuống tới socket.</li>
<li>Bỏ qua nhiễu có thể đoán trước (ERR_ABORTED, thăm dò IPv6); 404 ở đây là net::OK.</li>
<li>Bên cấp chứng chỉ lộ ra việc soi TLS.</li>
<li>NetLog chứa đường dẫn, IP, tên máy — xử lý như tệp HAR.</li>
<li>Firefox: about:logging / MOZ_LOG; service worker và extension có Console riêng.</li>
</ul>
${nguon('📘', 'Chromium — NetLog: Chrome’s network logging', 'net-export, các chế độ ghi, trình xem', 'https://www.chromium.org/developers/design-documents/network-stack/netlog/')}
${nguon('🧰', 'NetLog viewer', 'Trình xem của Chromium; tệp ở lại trong trình duyệt của bạn', 'https://netlog-viewer.appspot.com/')}
${nguon('📘', 'Firefox Source Docs — HTTP logging', 'about:logging, các mô-đun MOZ_LOG cho mạng', 'https://firefox-source-docs.mozilla.org/networking/http/logging.html')}
${lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-5-4-storage-react', title: 'Gỡ lỗi 5.4 — Tab Application', sub: 'Service worker phục vụ bản của hôm qua', cta: 'Mở bài' })}
</div>
`,
};
