/**
 * Bài 0.2 — Web hoạt động thế nào (nâng cấp 02/11/2026). Output thật: _demo/0-2 (Chromium — tách URL, một trang
 * nhiều request), _demo/_t0 (chay-web.sh: dig, curl -v tới example.com, máy chủ Node 22 cục bộ + curl -i).
 * Deck: scripts/slides-src/wf-0-2.mjs (11 slide, WF/v1/wf-0-2). Giữ video YouTube cũ.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-0-2', 'How the web works', 'Web hoạt động thế nào', [
  [1, 'How the web works',
    '<p>You type an address and press Enter; about a second later a page appears. This lesson slows that second down into five steps and shows each one with a real tool: the browser’s URL parser, a DNS lookup, curl talking to a real website, and a web server you run yourself.</p>',
    '<p>Bạn gõ một địa chỉ rồi nhấn Enter; khoảng một giây sau trang hiện ra. Bài này quay chậm giây đó thành năm bước và cho xem từng bước bằng công cụ thật: bộ tách URL của trình duyệt, một lần tra DNS, curl nói chuyện với một website thật, và một máy chủ web do chính bạn chạy.</p>'],
  [2, 'After this lesson you can…',
    '<p>The reason to learn this now: almost every bug in later chapters lives in one of these five steps. A wrong address, a server that answers 404, a page that is slow because it makes forty requests — once you can name the step, you know where to look.</p>',
    '<p>Lý do học điều này ngay bây giờ: gần như mọi lỗi ở các chương sau đều nằm ở một trong năm bước này. Một địa chỉ sai, một máy chủ trả 404, một trang chậm vì gửi bốn mươi request — khi gọi được tên bước, bạn biết phải nhìn vào đâu.</p>'],
  [3, 'The journey in five steps',
    '<p>Read the address, find the machine with DNS, open a secure connection, send a request and receive a response, then render — and the rendering itself triggers more requests. Keep this picture; every later slide zooms into one step.</p>',
    '<p>Đọc địa chỉ, tìm máy bằng DNS, mở kết nối an toàn, gửi request và nhận response, rồi hiển thị — và chính việc hiển thị lại kích hoạt thêm request. Giữ bức tranh này; mỗi slide sau phóng to một bước.</p>'],
  [4, 'Step 1: a URL has parts',
    '<p>The browser’s own URL parser split one address into protocol, host name, path, query and hash. Two details matter later: the query is extra information for the server, and the hash never leaves the browser at all.</p>',
    '<p>Bộ tách URL của chính trình duyệt chia một địa chỉ thành giao thức, tên máy, đường dẫn, chuỗi truy vấn và phần băm. Hai chi tiết quan trọng về sau: chuỗi truy vấn là thông tin thêm cho máy chủ, còn phần băm thì không bao giờ rời khỏi trình duyệt.</p>'],
  [5, 'Step 2: DNS turns a name into numbers',
    '<p>Networks route by numbers, not names. A real DNS lookup for example.com returned two IP addresses — two machines that can both answer. It is the internet’s contact list: you remember the name, the phone looks up the number.</p>',
    '<p>Mạng định tuyến bằng con số, không bằng tên. Một lần tra DNS thật cho example.com trả về hai địa chỉ IP — hai máy đều có thể trả lời. Đó là danh bạ của internet: bạn nhớ tên, điện thoại tự tra số.</p>'],
  [6, 'Step 3: connect, then encrypt',
    '<p>curl’s verbose output shows the connection: trying one of the two addresses on port 443, connected, then a TLS 1.3 session. From that line on, nobody between you and the server — the café Wi-Fi, the internet provider — can read or change the traffic.</p>',
    '<p>Output chi tiết của curl cho thấy việc kết nối: thử một trong hai địa chỉ ở cổng 443, đã kết nối, rồi một phiên TLS 1.3. Từ dòng đó trở đi, không ai đứng giữa bạn và máy chủ — Wi-Fi quán cà phê, nhà mạng — đọc hay sửa được lưu lượng.</p>'],
  [7, 'Step 4: request and response are text',
    '<p>Lines starting with a greater-than sign went out: the method GET, the path, and a few headers. Lines starting with less-than came back: status 200 and headers describing the body. That really is all a request is — a few lines of text.</p>',
    '<p>Các dòng bắt đầu bằng dấu lớn hơn là đi ra: method GET, đường dẫn, và vài header. Các dòng bắt đầu bằng dấu nhỏ hơn là trở về: mã trạng thái 200 và các header mô tả phần thân. Một request thật sự chỉ có vậy — vài dòng chữ.</p>'],
  [8, 'Be the server',
    '<p>Thirteen lines of Node.js are a complete web server. curl asked for the home page and got 200 with HTML; it asked for a path that does not exist and got 404. The terminal on the right printed each request as it arrived — this is the other side of the conversation.</p>',
    '<p>Mười ba dòng Node.js là một máy chủ web hoàn chỉnh. curl xin trang chủ và nhận 200 kèm HTML; nó xin một đường dẫn không tồn tại và nhận 404. Terminal bên phải in ra từng request ngay khi nó tới — đây là phía bên kia của cuộc trò chuyện.</p>'],
  [9, 'Step 5: render — and request more',
    '<p>This page made five requests: the HTML, then the stylesheet, two images and a script that the HTML pointed to. The list comes from inside the page and matches what the Network tab shows. Real sites make fifty to three hundred.</p>',
    '<p>Trang này gửi năm request: tệp HTML, rồi bảng định kiểu, hai ảnh và một script mà HTML trỏ tới. Danh sách được đọc từ bên trong trang và khớp với thẻ Network. Website thật gửi từ năm mươi tới ba trăm request.</p>'],
  [10, 'Who does what',
    '<p>The client asks and displays; the server decides and remembers. The browser only ever sees what the server chose to send. That line between the two is the same line Next.js draws between server and client components later.</p>',
    '<p>Máy khách hỏi và hiển thị; máy chủ quyết định và ghi nhớ. Trình duyệt chỉ thấy đúng những gì máy chủ chọn gửi đi. Đường ranh giữa hai bên chính là đường mà Next.js vạch giữa server component và client component về sau.</p>'],
  [11, 'Summary & practice',
    '<p>The practice extends your own server with a new page. The "Done when" is checked with curl and with the server log, the same two views you saw in this lesson — so you confirm both sides of the conversation, not just what the browser shows.</p>',
    '<p>Bài luyện mở rộng máy chủ của chính bạn bằng một trang mới. Phần "Xong khi" được kiểm bằng curl và bằng nhật ký máy chủ, đúng hai góc nhìn bạn đã thấy trong bài — để bạn xác nhận cả hai phía của cuộc trò chuyện, không chỉ thứ trình duyệt hiển thị.</p>'],
]);

export default {
  title: '0.2 — How the web works, in one picture|||0.2 — Web hoạt động thế nào, trong một bức tranh',
  slug: 'wf-0-2-web-hoat-dong',
  type: 'VIDEO',
  isFreePreview: true,
  // "How the Internet Works in 5 Minutes" — Aaron.
  video: { url: 'https://youtu.be/7_LPdttKXPc', durationSeconds: 0 },
  description: 'Năm bước từ lúc nhấn Enter tới khi trang hiện ra, mỗi bước bằng công cụ thật: tách URL trong Chromium, tra DNS bằng dig, curl -v tới example.com (TLS, request/response là chữ), tự chạy máy chủ Node 13 dòng và xem request tới, một trang = nhiều request; client vs server; bẫy và bài luyện.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>What happens between pressing Enter and seeing the page</h2>
<p class="lead">After this lesson you can take any web address apart into its pieces, name the five steps between pressing Enter and seeing a page, read a real HTTP request and response in a terminal, run a tiny web server on your own computer and watch requests arrive, and explain why one page is really dozens of requests. You need this picture because almost every bug in later chapters — a wrong link, a 404, a slow page, a login cookie that "does not stick" — happens in one of these five steps. Name the step and you know where to look.</p>

<h3>The whole journey first</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Read the URL</span><span class="lz-d">The browser splits the address into protocol, host, path and query.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">DNS: name → IP address</span><span class="lz-d">"example.com" becomes a number like 104.20.23.154 — the actual machine.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Connect + encrypt</span><span class="lz-d">A connection to that machine (port 443), then TLS so nobody in between can read it.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Request → response</span><span class="lz-d">A few lines of text go out ("GET /"); a status, headers and a body come back.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Render, then request more</span><span class="lz-d">The browser reads the HTML, asks for every CSS, image and script it mentions, and paints.</span></div>
</div>
<p>Each step below is shown with a real tool. You do not need to remember the commands yet — Chapter 1 teaches the terminal — but do read the outputs: they are what the machines actually said.</p>

<h3>Step 1 — a URL is an address with parts</h3>
<p>A URL (Uniform Resource Locator) is not one blob of text. The browser parses it into pieces before doing anything else. Here the browser's own parser, <code>new URL(…)</code>, takes a CuongThai address apart:</p>
${ma('javascript', CODE['0-2/url.js'])}
${ra(OUT['0-2/url'])}
<div class="kv-grid">
  <div class="kv"><span class="k">protocol</span><span class="v"><code>https:</code> — the language to speak. The <em>s</em> means encrypted (step 3).</span></div>
  <div class="kv"><span class="k">hostname</span><span class="v"><code>cuongthai.com</code> — which machine. A name for humans; DNS turns it into a number.</span></div>
  <div class="kv"><span class="k">port</span><span class="v">A "door" number on that machine. Empty means the default: 443 for https, 80 for http.</span></div>
  <div class="kv"><span class="k">pathname</span><span class="v"><code>/courses/web-foundations/learn</code> — which resource on that machine, like a folder path.</span></div>
  <div class="kv"><span class="k">search (query)</span><span class="v"><code>?lessonSlug=wf-0-2&amp;lang=vi</code> — extra options for the server, as name=value pairs.</span></div>
  <div class="kv"><span class="k">hash (fragment)</span><span class="v"><code>#journey</code> — a spot <em>inside</em> the page. It stays in the browser and is <strong>never sent</strong> to the server.</span></div>
  <div class="kv"><span class="k">origin</span><span class="v">protocol + host + port. Browsers use it as a security boundary (CORS, Lesson 7.5).</span></div>
</div>

<h3>Step 2 — DNS turns a name into numbers</h3>
<p>The network does not route by names; it routes by <strong>IP addresses</strong>, numbers like <code>104.20.23.154</code>. DNS (Domain Name System) is the internet's contact list: you remember the name, your computer asks a DNS server for the number. Here is a real lookup with the <code>dig</code> tool:</p>
${ra(OUT['_t0/out/dns'])}
<p>Two addresses came back: two machines that can both serve example.com. Big sites return several so that one broken machine does not take the site down. Your computer remembers the answer for a while (the record's <em>TTL</em>, time to live), so the lookup does not repeat on every click.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "I changed my domain settings and the old site still shows".</strong> Every resolver along the way caches DNS answers until their TTL runs out — sometimes minutes, sometimes a day. Changing a DNS record is not instant, and refreshing the page faster does not help. Check what the world currently sees with <code>dig +short yourdomain.com</code>, and wait for the TTL before deciding something is broken.</p></div>

<h3>Step 3 — connect, then encrypt</h3>
<p>With an IP address, the browser opens a connection to it and — for <code>https</code> — negotiates encryption with TLS (Transport Layer Security). The tool <code>curl</code> is a browser without a screen; with <code>-v</code> (verbose) it narrates everything. These are the first lines of a real run against example.com:</p>
${ra(OUT['_t0/out/curl-v'].split('\n').slice(0, 5).join('\n'))}
<p>"Trying 104.20.23.154:443" — one of the two IPs from DNS, on door 443. "Connected". Then "SSL connection using TLSv1.3": from here on, the café Wi-Fi, your internet provider and anyone else between you and the server see only scrambled bytes. The padlock in the address bar means exactly this.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — typing a password on an <code>http://</code> page.</strong> Without the <em>s</em>, step 3 skips encryption, and everything you send — including the password field — travels as readable text through every network on the way. Browsers mark such pages "Not secure" for this reason. Never build a login on plain http; Lesson 7.5 shows how HTTPS is set up and why browsers now block many features without it.</p></div>

<h3>Step 4 — the request and the response are just text</h3>
<p>The rest of the same curl run. Lines with <code>&gt;</code> went <strong>out</strong> (the request); lines with <code>&lt;</code> came <strong>back</strong> (the response headers):</p>
${ra(OUT['_t0/out/curl-v'].split('\n').slice(5).join('\n'))}
<div class="kv-grid">
  <div class="kv"><span class="k">GET / HTTP/2</span><span class="v">The <strong>method</strong> (GET = "give me"), the <strong>path</strong> (<code>/</code> = home page), and the protocol version.</span></div>
  <div class="kv"><span class="k">Host, User-Agent, Accept</span><span class="v">Request <strong>headers</strong>: which site, which program is asking, which formats it accepts.</span></div>
  <div class="kv"><span class="k">HTTP/2 200</span><span class="v">The <strong>status code</strong>: 200 = OK. You will meet 404 (not found), 401 (log in first), 500 (server crashed) in Chapter 6.</span></div>
  <div class="kv"><span class="k">content-type</span><span class="v">A response header telling the browser what the body is — here an HTML document in UTF-8.</span></div>
</div>
<p>After the headers comes the <strong>body</strong> — the HTML itself (we sent it to <code>/dev/null</code> to keep the output short). Method, path, headers, status, body: five words you will use every day from Chapter 6 on.</p>

<h3>Be the server — thirteen lines of Node.js</h3>
<p>The other side of the conversation is a program. Here is a complete web server; you will be able to write this yourself after Chapter 4, so for now just read it like a story: "when a request arrives, print it; if the path is <code>/</code>, answer 200 with some HTML; otherwise answer 404".</p>
${ma('javascript', CODE['_t0/web/server.mjs'])}
<p>We started it on this computer and asked it for two paths with <code>curl -i</code> (<code>-i</code> = include the response headers):</p>
${ra(OUT['_t0/out/curl-local'])}
<p>And this is what the server's own terminal printed while that happened — every request, as it arrived:</p>
${ra(OUT['_t0/out/server-log'])}
<p><code>localhost</code> is a special name that always means "this same computer", so no DNS lookup and no internet were involved. The 404 is not an error in the server — it is the server correctly saying "I have nothing at that path".</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — sending a friend your <code>localhost</code> link.</strong> <code>http://localhost:3000</code> means "port 3000 on <em>my own</em> machine" — on your friend's computer it points at <em>their</em> machine, where nothing is running, so they get "This site can't be reached". To share your work you must put it on a server with a public address; Chapter 14 does exactly that.</p></div>

<h3>Step 5 — the browser renders, then asks for more</h3>
<p>The first response is only the HTML. While reading it, the browser finds a stylesheet, images and scripts, and requests each one. This page lists its own requests from inside, using the browser's Performance API — the same list DevTools → Network shows:</p>
${ma('html', CODE['0-2/mot-trang-nhieu-request.html'], [8, 28])}
${ra(OUT['0-2/mot-trang-nhieu-request'])}
<p>Five requests for a page with one heading and two pictures. A news site or a shop typically makes fifty to three hundred. The browser then builds the page tree from the HTML, applies the CSS, paints, and runs the JavaScript (screenshot on slide 9).</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — thinking a page is one request.</strong> When "the site is slow", the useful question is not "is my server slow?" but "which of these many requests is slow, and how many are there?". It also explains a bug you will hit within a week: you change a CSS file, reload, and nothing changes, because the browser reused its <em>cached</em> copy instead of requesting it again. Hard-reload (Ctrl/Cmd+Shift+R) or tick "Disable cache" in the Network tab before hunting a bug in code that is already correct.</p></div>

<h3>Client and server — who does what</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Client (browser)</span><span class="lz-t">asks and displays</span><span class="lz-d">Parses URLs, sends requests, renders HTML/CSS, runs JavaScript. It only ever sees what the server chose to send — and everything it receives is public (Lesson 0.1).</span></div>
<div class="lz-layer"><span class="lz-k">Network</span><span class="lz-t">carries text both ways</span><span class="lz-d">DNS, TCP, TLS, HTTP. Encrypted with https; readable by anyone in between with http.</span></div>
<div class="lz-layer"><span class="lz-k">Server</span><span class="lz-t">decides and remembers</span><span class="lz-d">Runs your backend code (Node.js), talks to the database, holds passwords and API keys. The browser never sees this code.</span></div>
</div>
<p>Why this matters later: the "Server Component vs Client Component" idea in Next.js is this exact line drawn inside one application — some code runs on the server, some in the browser. With this picture, that lesson is easy.</p>

<h3>See it yourself: the Network tab</h3>
<ol>
<li>Open any website in Chrome, press <strong>F12</strong> and choose the <strong>Network</strong> tab.</li>
<li>Reload the page. Each row is one request: its name, <strong>Status</strong> (200, 304, 404…), <strong>Type</strong> and size.</li>
<li>Click the first row (the document). <strong>Headers</strong> shows the request URL, method, status code, and the request and response headers — the same lines curl printed.</li>
<li>Look at the bottom bar: the number of requests and the total transferred size for the whole page.</li>
</ol>

<div class="callout ok">
<p><strong>🧪 Practice (20 minutes) — run your own server</strong></p>
<ol>
<li>Install Node.js (Lesson 0.3) if you have not yet. Create a folder, and in it a file <code>server.mjs</code> with the 13 lines above.</li>
<li>In a terminal inside that folder run <code>node server.mjs</code>. Leave it running.</li>
<li>Add a second route: when <code>req.url === '/about'</code>, answer 200 with <code>&lt;h1&gt;About me&lt;/h1&gt;&lt;p&gt;</code> plus your name. Stop the server (Ctrl+C) and start it again after each change.</li>
<li>Open <code>http://localhost:3000/about</code> in the browser with the Network tab open.</li>
</ol>
<p>Hint: copy the shape of the existing <code>if (req.url === '/')</code> block and use <code>else if</code>.</p>
<p><strong>Done when:</strong> <code>curl -i http://localhost:3000/about</code> prints <code>HTTP/1.1 200 OK</code> and your name; <code>curl -i http://localhost:3000/nope</code> prints <code>404 Not Found</code>; the server's terminal shows <code>GET /about</code> and <code>GET /nope</code>; and in the Network tab you can point at the status code and the <code>Content-Type</code> header of your page.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">URL</span><span class="v">địa chỉ tài nguyên — giao thức, tên máy, đường dẫn, truy vấn, phần băm.</span></div>
  <div class="kv"><span class="k">query string</span><span class="v">chuỗi truy vấn — phần sau dấu ?, gửi cho máy chủ.</span></div>
  <div class="kv"><span class="k">fragment / hash</span><span class="v">phần băm — phần sau dấu #, không gửi đi.</span></div>
  <div class="kv"><span class="k">IP address</span><span class="v">địa chỉ IP — con số định danh một máy trên mạng.</span></div>
  <div class="kv"><span class="k">DNS</span><span class="v">hệ thống tên miền — "danh bạ" đổi tên thành địa chỉ IP.</span></div>
  <div class="kv"><span class="k">TTL</span><span class="v">thời gian sống — bản ghi DNS được nhớ bao lâu.</span></div>
  <div class="kv"><span class="k">port</span><span class="v">cổng — "cửa" trên một máy (443 = https, 80 = http).</span></div>
  <div class="kv"><span class="k">TLS / HTTPS</span><span class="v">lớp mã hoá / HTTP chạy trên TLS — ổ khoá trên thanh địa chỉ.</span></div>
  <div class="kv"><span class="k">request / response</span><span class="v">yêu cầu / phản hồi — hai nửa của một lượt HTTP.</span></div>
  <div class="kv"><span class="k">method</span><span class="v">phương thức — GET, POST… (Chương 6).</span></div>
  <div class="kv"><span class="k">header</span><span class="v">tiêu đề — dòng name: value mô tả request/response.</span></div>
  <div class="kv"><span class="k">status code</span><span class="v">mã trạng thái — 200, 404, 500…</span></div>
  <div class="kv"><span class="k">body</span><span class="v">phần thân — nội dung thật (HTML, JSON…).</span></div>
  <div class="kv"><span class="k">localhost</span><span class="v">"chính máy này" — không ai khác truy cập được.</span></div>
  <div class="kv"><span class="k">cache</span><span class="v">bộ nhớ đệm — bản sao giữ lại để khỏi tải lại.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Five steps: read the URL → DNS → connect + TLS → request/response → render and request more.</li>
  <li>A URL has protocol, host, port, path, query and hash; the hash never reaches the server.</li>
  <li>DNS turns names into IP addresses and caches them for a TTL.</li>
  <li>HTTPS encrypts everything after the connection; never send passwords over plain http.</li>
  <li>A request is a few lines of text: method, path, headers. A response: status, headers, body.</li>
  <li>A server is just a program that answers requests — 13 lines of Node.js are enough.</li>
  <li>One page = many requests; use the Network tab and hard-reload when caching fools you.</li>
</ul>
${nguon('📗', 'MDN — How the web works', 'The same journey explained with illustrations', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works')}
${nguon('📘', 'MDN — An overview of HTTP', 'Requests, responses, methods and headers — the reference for Chapter 6', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview')}
${lienKet({ khoa: 'networking-for-developers', bai: 'netdev-0-2-go-dia-chi', title: 'Networking for Developers 0.2 — the seven stages of a page load', sub: 'The same journey one level deeper: TCP, TLS timing with curl -w, round trips', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Chuyện gì xảy ra giữa lúc nhấn Enter và lúc thấy trang</h2>
<p class="lead">Học xong bài này bạn tách được mọi địa chỉ web thành từng mảnh, gọi tên được năm bước từ lúc nhấn Enter tới lúc thấy trang, đọc được một request và response HTTP thật trong terminal, chạy được một máy chủ web tí hon trên máy của mình và xem request đổ về, và giải thích được vì sao một trang thật ra là hàng chục request. Bạn cần bức tranh này vì gần như mọi lỗi ở các chương sau — một liên kết sai, một trang 404, một trang chậm, một cookie đăng nhập "không chịu dính" — đều xảy ra ở một trong năm bước. Gọi được tên bước là biết phải nhìn vào đâu.</p>

<h3>Toàn bộ hành trình trước đã</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đọc URL</span><span class="lz-d">Trình duyệt tách địa chỉ thành giao thức, tên máy, đường dẫn, chuỗi truy vấn.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">DNS: tên → địa chỉ IP</span><span class="lz-d">"example.com" thành một con số như 104.20.23.154 — cái máy thật sự.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Kết nối + mã hoá</span><span class="lz-d">Một kết nối tới máy đó (cổng 443), rồi TLS để không ai đứng giữa đọc được.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Request → response</span><span class="lz-d">Vài dòng chữ đi ra ("GET /"); mã trạng thái, header và phần thân trở về.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Hiển thị, rồi xin thêm</span><span class="lz-d">Trình duyệt đọc HTML, xin từng tệp CSS, ảnh, script mà nó nhắc tới, rồi vẽ ra.</span></div>
</div>
<p>Mỗi bước dưới đây được minh hoạ bằng một công cụ thật. Bạn chưa cần nhớ các lệnh — Chương 1 dạy terminal — nhưng hãy đọc output: đó là điều các cỗ máy đã thật sự nói.</p>

<h3>Bước 1 — URL là một địa chỉ có nhiều phần</h3>
<p>URL (Uniform Resource Locator — địa chỉ định vị tài nguyên) không phải một cục chữ. Trình duyệt tách nó thành từng mảnh trước khi làm bất cứ gì. Ở đây bộ tách của chính trình duyệt, <code>new URL(…)</code>, mổ một địa chỉ CuongThai:</p>
${ma('javascript', CODE['0-2/url.js'])}
${ra(OUT['0-2/url'])}
<div class="kv-grid">
  <div class="kv"><span class="k">protocol</span><span class="v"><code>https:</code> — ngôn ngữ để nói chuyện. Chữ <em>s</em> nghĩa là có mã hoá (bước 3).</span></div>
  <div class="kv"><span class="k">hostname</span><span class="v"><code>cuongthai.com</code> — máy nào. Một cái tên cho người đọc; DNS đổi nó thành con số.</span></div>
  <div class="kv"><span class="k">port</span><span class="v">Số "cửa" trên máy đó. Để trống nghĩa là mặc định: 443 cho https, 80 cho http.</span></div>
  <div class="kv"><span class="k">pathname</span><span class="v"><code>/courses/web-foundations/learn</code> — tài nguyên nào trên máy đó, giống đường dẫn thư mục.</span></div>
  <div class="kv"><span class="k">search (truy vấn)</span><span class="v"><code>?lessonSlug=wf-0-2&amp;lang=vi</code> — tuỳ chọn thêm cho máy chủ, dạng cặp tên=giá trị.</span></div>
  <div class="kv"><span class="k">hash (phần băm)</span><span class="v"><code>#journey</code> — một vị trí <em>bên trong</em> trang. Nó ở lại trình duyệt và <strong>không bao giờ được gửi</strong> lên máy chủ.</span></div>
  <div class="kv"><span class="k">origin</span><span class="v">giao thức + tên máy + cổng. Trình duyệt dùng nó làm ranh giới bảo mật (CORS, Bài 7.5).</span></div>
</div>

<h3>Bước 2 — DNS đổi tên thành con số</h3>
<p>Mạng không định tuyến theo tên; nó định tuyến theo <strong>địa chỉ IP</strong>, những con số như <code>104.20.23.154</code>. DNS (Domain Name System — hệ thống tên miền) là danh bạ của internet: bạn nhớ tên, máy tính hỏi một máy chủ DNS để lấy số. Đây là một lần tra thật bằng công cụ <code>dig</code>:</p>
${ra(OUT['_t0/out/dns'])}
<p>Hai địa chỉ trả về: hai cỗ máy đều phục vụ được example.com. Các trang lớn trả về vài địa chỉ để một máy hỏng không kéo sập cả trang. Máy tính của bạn nhớ câu trả lời một lúc (theo <em>TTL</em> của bản ghi — thời gian sống), nên không phải tra lại ở mỗi cú bấm.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "mình đổi cấu hình tên miền mà vẫn hiện trang cũ".</strong> Mọi máy phân giải trên đường đi đều nhớ câu trả lời DNS cho tới khi TTL hết hạn — có khi vài phút, có khi một ngày. Sửa một bản ghi DNS không có hiệu lực tức thì, và bấm tải lại nhanh hơn cũng chẳng giúp gì. Kiểm thứ cả thế giới đang thấy bằng <code>dig +short tenmiencuaban.com</code>, và chờ hết TTL rồi mới kết luận có gì hỏng.</p></div>

<h3>Bước 3 — kết nối, rồi mã hoá</h3>
<p>Có địa chỉ IP rồi, trình duyệt mở một kết nối tới nó và — với <code>https</code> — thương lượng mã hoá bằng TLS (Transport Layer Security — bảo mật tầng truyền tải). Công cụ <code>curl</code> là một trình duyệt không có màn hình; với <code>-v</code> (verbose — nói chi tiết) nó thuật lại mọi thứ. Đây là những dòng đầu của một lần chạy thật tới example.com:</p>
${ra(OUT['_t0/out/curl-v'].split('\n').slice(0, 5).join('\n'))}
<p>"Trying 104.20.23.154:443" — một trong hai IP lấy từ DNS, ở cửa 443. "Connected" — đã kết nối. Rồi "SSL connection using TLSv1.3": từ đây trở đi, Wi-Fi quán cà phê, nhà mạng của bạn và bất kỳ ai khác đứng giữa bạn và máy chủ chỉ thấy những byte bị xáo trộn. Ổ khoá trên thanh địa chỉ nghĩa đúng là điều này.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — gõ mật khẩu trên một trang <code>http://</code>.</strong> Thiếu chữ <em>s</em>, bước 3 bỏ qua mã hoá, và mọi thứ bạn gửi — kể cả ô mật khẩu — đi dưới dạng chữ đọc được qua mọi mạng trên đường. Trình duyệt đánh dấu những trang như vậy là "Not secure" vì lý do này. Đừng bao giờ dựng trang đăng nhập trên http trần; Bài 7.5 cho thấy HTTPS được thiết lập ra sao và vì sao trình duyệt giờ chặn nhiều tính năng nếu thiếu nó.</p></div>

<h3>Bước 4 — request và response chỉ là chữ</h3>
<p>Phần còn lại của cùng lần chạy curl. Dòng có <code>&gt;</code> là đi <strong>ra</strong> (request); dòng có <code>&lt;</code> là trở <strong>về</strong> (header của response):</p>
${ra(OUT['_t0/out/curl-v'].split('\n').slice(5).join('\n'))}
<div class="kv-grid">
  <div class="kv"><span class="k">GET / HTTP/2</span><span class="v"><strong>Method</strong> (GET = "đưa tôi"), <strong>đường dẫn</strong> (<code>/</code> = trang chủ), và phiên bản giao thức.</span></div>
  <div class="kv"><span class="k">Host, User-Agent, Accept</span><span class="v"><strong>Header</strong> của request: trang nào, chương trình nào đang hỏi, chấp nhận định dạng nào.</span></div>
  <div class="kv"><span class="k">HTTP/2 200</span><span class="v"><strong>Mã trạng thái</strong>: 200 = OK. Bạn sẽ gặp 404 (không thấy), 401 (đăng nhập trước), 500 (máy chủ lỗi) ở Chương 6.</span></div>
  <div class="kv"><span class="k">content-type</span><span class="v">Một header của response cho trình duyệt biết phần thân là gì — ở đây là tài liệu HTML mã UTF-8.</span></div>
</div>
<p>Sau phần header là <strong>phần thân (body)</strong> — chính tệp HTML (chúng tôi đổ nó vào <code>/dev/null</code> cho output ngắn gọn). Method, đường dẫn, header, mã trạng thái, phần thân: năm từ bạn sẽ dùng hằng ngày kể từ Chương 6.</p>

<h3>Làm máy chủ — mười ba dòng Node.js</h3>
<p>Phía bên kia của cuộc trò chuyện là một chương trình. Đây là một máy chủ web hoàn chỉnh; học xong Chương 4 bạn sẽ tự viết được nó, nên giờ cứ đọc như đọc truyện: "khi có request tới, in nó ra; nếu đường dẫn là <code>/</code> thì trả 200 kèm ít HTML; còn lại thì trả 404".</p>
${ma('javascript', CODE['_t0/web/server.mjs'])}
<p>Chúng tôi chạy nó trên chính máy này rồi xin hai đường dẫn bằng <code>curl -i</code> (<code>-i</code> = in kèm header của response):</p>
${ra(OUT['_t0/out/curl-local'])}
<p>Và đây là thứ terminal của chính máy chủ in ra trong lúc đó — từng request, ngay khi nó tới:</p>
${ra(OUT['_t0/out/server-log'])}
<p><code>localhost</code> là một cái tên đặc biệt luôn có nghĩa "chính máy này", nên không có lần tra DNS nào và không cần internet. Trang 404 không phải lỗi của máy chủ — đó là máy chủ nói đúng sự thật "tôi không có gì ở đường dẫn đó".</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — gửi cho bạn bè đường link <code>localhost</code>.</strong> <code>http://localhost:3000</code> nghĩa là "cổng 3000 trên <em>chính máy tôi</em>" — trên máy bạn của bạn, nó trỏ vào <em>máy của họ</em>, nơi chẳng có gì đang chạy, nên họ nhận "This site can't be reached". Muốn chia sẻ sản phẩm bạn phải đặt nó lên một máy chủ có địa chỉ công khai; Chương 14 làm đúng việc đó.</p></div>

<h3>Bước 5 — trình duyệt hiển thị, rồi xin thêm</h3>
<p>Response đầu tiên chỉ là HTML. Trong lúc đọc, trình duyệt gặp một bảng định kiểu, các ảnh và script, và xin từng thứ một. Trang này tự liệt kê các request của chính nó từ bên trong, bằng Performance API của trình duyệt — đúng danh sách mà DevTools → Network hiển thị:</p>
${ma('html', CODE['0-2/mot-trang-nhieu-request.html'], [8, 28])}
${ra(OUT['0-2/mot-trang-nhieu-request'])}
<p>Năm request cho một trang chỉ có một tiêu đề và hai bức ảnh. Một trang tin tức hay cửa hàng thường gửi năm mươi tới ba trăm. Sau đó trình duyệt dựng cây trang từ HTML, áp CSS, vẽ, rồi chạy JavaScript (ảnh chụp ở slide 9).</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — nghĩ rằng một trang là một request.</strong> Khi "trang chạy chậm", câu hỏi hữu ích không phải "máy chủ mình có chậm không?" mà là "trong rất nhiều request này, cái nào chậm, và có bao nhiêu cái?". Nó còn giải thích một lỗi bạn sẽ gặp trong tuần đầu: bạn sửa tệp CSS, tải lại, mà chẳng có gì đổi, vì trình duyệt dùng lại bản sao <em>đệm (cache)</em> thay vì xin lại. Hãy tải lại cứng (Ctrl/Cmd+Shift+R) hoặc tick "Disable cache" trong thẻ Network trước khi đi săn lỗi trong đoạn mã vốn đã đúng.</p></div>

<h3>Client và server — ai làm gì</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Client (trình duyệt)</span><span class="lz-t">hỏi và hiển thị</span><span class="lz-d">Tách URL, gửi request, vẽ HTML/CSS, chạy JavaScript. Nó chỉ thấy đúng những gì máy chủ chọn gửi — và mọi thứ nó nhận được đều công khai (Bài 0.1).</span></div>
<div class="lz-layer"><span class="lz-k">Mạng</span><span class="lz-t">chở chữ theo hai chiều</span><span class="lz-d">DNS, TCP, TLS, HTTP. Được mã hoá với https; ai đứng giữa cũng đọc được với http.</span></div>
<div class="lz-layer"><span class="lz-k">Server (máy chủ)</span><span class="lz-t">quyết định và ghi nhớ</span><span class="lz-d">Chạy mã backend của bạn (Node.js), nói chuyện với cơ sở dữ liệu, giữ mật khẩu và khoá API. Trình duyệt không bao giờ thấy đoạn mã này.</span></div>
</div>
<p>Vì sao điều này quan trọng về sau: ý tưởng "Server Component và Client Component" trong Next.js chính là đường ranh này được vạch bên trong một ứng dụng — một số mã chạy ở máy chủ, một số chạy trong trình duyệt. Có bức tranh này rồi, bài đó sẽ dễ.</p>

<h3>Tự xem: thẻ Network</h3>
<ol>
<li>Mở một website bất kỳ trong Chrome, nhấn <strong>F12</strong> rồi chọn thẻ <strong>Network</strong>.</li>
<li>Tải lại trang. Mỗi dòng là một request: tên, <strong>Status</strong> (200, 304, 404…), <strong>Type</strong> và kích thước.</li>
<li>Bấm vào dòng đầu tiên (tài liệu). Mục <strong>Headers</strong> hiện URL của request, method, mã trạng thái, cùng header của request và response — đúng những dòng curl đã in.</li>
<li>Nhìn thanh dưới cùng: số request và tổng dung lượng đã tải cho cả trang.</li>
</ol>

<div class="callout ok">
<p><strong>🧪 Luyện tập (20 phút) — chạy máy chủ của riêng bạn</strong></p>
<ol>
<li>Cài Node.js (Bài 0.3) nếu chưa có. Tạo một thư mục, trong đó tệp <code>server.mjs</code> với 13 dòng ở trên.</li>
<li>Mở terminal trong thư mục đó và chạy <code>node server.mjs</code>. Cứ để nó chạy.</li>
<li>Thêm tuyến thứ hai: khi <code>req.url === '/about'</code> thì trả 200 với <code>&lt;h1&gt;About me&lt;/h1&gt;&lt;p&gt;</code> kèm tên bạn. Dừng máy chủ (Ctrl+C) rồi chạy lại sau mỗi lần sửa.</li>
<li>Mở <code>http://localhost:3000/about</code> trong trình duyệt với thẻ Network đang mở.</li>
</ol>
<p>Gợi ý: chép hình dạng của khối <code>if (req.url === '/')</code> sẵn có và dùng <code>else if</code>.</p>
<p><strong>Xong khi:</strong> <code>curl -i http://localhost:3000/about</code> in ra <code>HTTP/1.1 200 OK</code> và tên bạn; <code>curl -i http://localhost:3000/nope</code> in ra <code>404 Not Found</code>; terminal của máy chủ hiện <code>GET /about</code> và <code>GET /nope</code>; và trong thẻ Network bạn chỉ được vào mã trạng thái và header <code>Content-Type</code> của trang mình.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">URL</span><span class="v">địa chỉ tài nguyên — giao thức, tên máy, đường dẫn, truy vấn, phần băm.</span></div>
  <div class="kv"><span class="k">query string</span><span class="v">chuỗi truy vấn — phần sau dấu ?, gửi cho máy chủ.</span></div>
  <div class="kv"><span class="k">fragment / hash</span><span class="v">phần băm — phần sau dấu #, không gửi đi.</span></div>
  <div class="kv"><span class="k">IP address</span><span class="v">địa chỉ IP — con số định danh một máy trên mạng.</span></div>
  <div class="kv"><span class="k">DNS</span><span class="v">hệ thống tên miền — "danh bạ" đổi tên thành địa chỉ IP.</span></div>
  <div class="kv"><span class="k">TTL</span><span class="v">thời gian sống — bản ghi DNS được nhớ bao lâu.</span></div>
  <div class="kv"><span class="k">port</span><span class="v">cổng — "cửa" trên một máy (443 = https, 80 = http).</span></div>
  <div class="kv"><span class="k">TLS / HTTPS</span><span class="v">lớp mã hoá / HTTP chạy trên TLS — ổ khoá trên thanh địa chỉ.</span></div>
  <div class="kv"><span class="k">request / response</span><span class="v">yêu cầu / phản hồi — hai nửa của một lượt HTTP.</span></div>
  <div class="kv"><span class="k">method</span><span class="v">phương thức — GET, POST… (Chương 6).</span></div>
  <div class="kv"><span class="k">header</span><span class="v">tiêu đề — dòng tên: giá trị mô tả request/response.</span></div>
  <div class="kv"><span class="k">status code</span><span class="v">mã trạng thái — 200, 404, 500…</span></div>
  <div class="kv"><span class="k">body</span><span class="v">phần thân — nội dung thật (HTML, JSON…).</span></div>
  <div class="kv"><span class="k">localhost</span><span class="v">"chính máy này" — không ai khác truy cập được.</span></div>
  <div class="kv"><span class="k">cache</span><span class="v">bộ nhớ đệm — bản sao giữ lại để khỏi tải lại.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Năm bước: đọc URL → DNS → kết nối + TLS → request/response → hiển thị và xin thêm.</li>
  <li>URL có giao thức, tên máy, cổng, đường dẫn, truy vấn và phần băm; phần băm không bao giờ tới máy chủ.</li>
  <li>DNS đổi tên thành địa chỉ IP và nhớ chúng trong một khoảng TTL.</li>
  <li>HTTPS mã hoá mọi thứ sau khi kết nối; đừng bao giờ gửi mật khẩu qua http trần.</li>
  <li>Request là vài dòng chữ: method, đường dẫn, header. Response: mã trạng thái, header, phần thân.</li>
  <li>Máy chủ chỉ là một chương trình trả lời request — 13 dòng Node.js là đủ.</li>
  <li>Một trang = nhiều request; dùng thẻ Network và tải lại cứng khi bộ đệm đánh lừa bạn.</li>
</ul>
${nguon('📗', 'MDN — How the web works', 'Cùng hành trình đó, giải thích kèm hình minh hoạ', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works')}
${nguon('📘', 'MDN — An overview of HTTP', 'Request, response, method và header — tài liệu tham chiếu cho Chương 6', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview')}
${lienKet({ khoa: 'networking-for-developers', bai: 'netdev-0-2-go-dia-chi', title: 'Mạng cho lập trình viên 0.2 — bảy chặng của một lần tải trang', sub: 'Cùng hành trình đó, sâu thêm một tầng: TCP, bấm giờ TLS bằng curl -w, vòng đi-về', cta: 'Mở bài' })}
</div>
`,
};
