/**
 * 5.4 — Tab Application và React DevTools: cookie, storage, service worker (soạn 24/11/2026).
 * Output THẬT: Chrome 150 headless + CDP (Network.responseReceivedExtraInfo.blockedCookies, requestWillBeSentExtraInfo.associatedCookies,
 * Network.getAllCookies, ServiceWorker.*, CacheStorage.*, Storage.clearDataForOrigin). React: hook __REACT_DEVTOOLS_GLOBAL_HOOK__
 * cài trước khi React tải — đúng cơ chế extension React DevTools dùng (máy không có GUI nên không chụp được extension). Tập lệnh lab/ch5/tools/c54-*.mjs.
 */
import { nguon, lienKet } from '../_chung.mjs';
import { SW_LOI, SW_SUA, HOOK_REACT } from './_ma-5.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;

const OUT_COOKIE = `<div class="out">=== A) page http://localhost:41511 → API http://127.0.0.1:41510, cookie "SameSite=Lax"
◂ POST /api/dang-nhap  Set-Cookie: sid=…; HttpOnly; SameSite=Lax; Path=/
      ⚠ blocked when SAVING: SameSiteLax                    ← DevTools: yellow ⚠ on the Set-Cookie line (Network › Cookies)
  POST /api/dang-nhap → 200                                  ← "login succeeded"…
▸ GET /api/toi   cookies sent: []
  GET /api/toi → 401                                          ← …and the user is still logged out
h1: "LabFlow — Đăng nhập"          Application › Cookies: (empty)

=== B) same, cookie "SameSite=None; Secure"
◂ Set-Cookie: sid=…; HttpOnly; SameSite=None; Secure; Path=/      ✓ saved
▸ GET /api/toi   cookies sent: [sid]      → 200      h1: "LabFlow — xin chào SE1804"
  Application › Cookies: sid domain=127.0.0.1 HttpOnly=true Secure=true SameSite=None

=== C) Vite proxy: /api on the SAME origin localhost:41511, cookie "SameSite=Lax"
◂ Set-Cookie: sid=…; HttpOnly; SameSite=Lax; Path=/              ✓ saved
▸ GET /api/toi   cookies sent: [sid]      → 200      h1: "LabFlow — xin chào SE1804"
  Application › Cookies: sid domain=localhost HttpOnly=true Secure=false SameSite=Lax
  document.cookie in the page = ""                                ← HttpOnly: JavaScript cannot see it

=== D) like A, cookie "SameSite=None" without Secure
◂ Set-Cookie: sid=…; HttpOnly; SameSite=None; Path=/
      ⚠ blocked when SAVING: SameSiteNoneInsecure</div>`;

const MA_PROXY = ma(`// vite.config.mjs — in development, make the browser see ONE origin
server: { proxy: { '/api': 'http://127.0.0.1:41510' } }
// web/src/api.js — call relative URLs: fetch('/api/toi') instead of fetch('http://127.0.0.1:41510/api/toi')`);

const OUT_SW = `<div class="out">[Service workers] sw.js #0 installing → installed → activating → activated
first visit:   fetch('/phien-ban.json') = {"phienBan":"1.0.0"}   page controlled by SW: false   (Network: from server)
reload:        fetch('/phien-ban.json') = {"phienBan":"1.0.0"}   page controlled by SW: true    (Network: from service worker)
— deploy: phien-ban.json on the server is now 1.1.0 —
curl to the server:  {"phienBan":"1.1.0"}
user reloads:  fetch('/phien-ban.json') = {"phienBan":"1.0.0"}   (Network: /phien-ban.json 200 (from service worker))
[Cache storage] "labflow": /, /@react-refresh, /@vite/client, /api/dat-cho?phong=401, /api/phong, /api/toi, … /src/App.sua.jsx, /widget-ho-tro.js
                                                            ← it cached API answers too, including the 401 of /api/toi
— Application › Storage › Clear site data (service workers + cache storage) —
reload:        fetch('/phien-ban.json') = {"phienBan":"1.1.0"}   (from server)</div>`;

const OUT_SW_SUA = `<div class="out"># fixed sw.js, same scenario
reload:        {"phienBan":"1.0.0"}   (from server)
— deploy 1.1.0 —
user reloads:  {"phienBan":"1.1.0"}   (from server)
[Cache storage] "labflow-1.1.0": /widget-ho-tro.js          ← only static files, one versioned cache</div>`;

const OUT_REACT = `<div class="out">Components (after load):
    App          state: [{"id":401,"ten":"Lab 401","choNgoi":30},{"id":402,…}], 401, null
      LichPhong  props: phong=401   state: 401, [{"id":1,"phong":401,"nguoiDat":"SE1801",…}]
      DatChoForm props: phong=401 onXong=ƒ   state: "15:00", ""
    &lt;h2&gt; on the page: "Lịch phòng 401"

Components (after choosing Lab 402 in the select):
    App          state: […], 402, null
      LichPhong  props: phong=402   state: 401, [{"id":1,"phong":401,…}]     ← props say 402, state still says 401
      DatChoForm props: phong=402 onXong=ƒ   state: "15:00", ""
    &lt;h2&gt; on the page: "Lịch phòng 401"

Profiler — commits while changing room: [["App","LichPhong","DatChoForm"]]
Profiler — typing "16:30" (clear + 5 keys): 6 commits, each rendered: ["DatChoForm"]</div>`;

const MA_STATE = ma(`// before: the prop is copied into state ONCE (first render) and the effect runs ONCE ([] deps)
function LichPhong({ phong }) {
  const [phongDangXem] = useState(phong);
  useEffect(() =&gt; { goi(\`/api/dat-cho?phong=\${phongDangXem}\`).then(…); }, []);
// after: use the prop, list it in the deps, ignore answers for a room we already left
function LichPhong({ phong }) {
  useEffect(() =&gt; {
    let huy = false;
    goi(\`/api/dat-cho?phong=\${phong}\`).then((d) =&gt; { if (!huy) setLich(d.items ?? []); });
    return () =&gt; { huy = true; };
  }, [phong]);`, 'jsx');

const NGUON = [
  nguon('🍪', 'Chrome DevTools — View, edit and delete cookies', 'Application › Cookies; cột SameSite, HttpOnly, Secure, Partition Key; cookie bị chặn trong Network › Cookies.', 'https://developer.chrome.com/docs/devtools/application/cookies'),
  nguon('🧭', 'web.dev — SameSite cookies explained', 'Site khác origin; Lax mặc định; None bắt buộc Secure.', 'https://web.dev/articles/samesite-cookies-explained'),
  nguon('⚙️', 'Chrome DevTools — Debug Progressive Web Apps (service workers, cache storage)', 'Update on reload, Bypass for network, Unregister, Clear storage.', 'https://developer.chrome.com/docs/devtools/progressive-web-apps'),
  nguon('⚛', 'React — React Developer Tools', 'Components (props, state, hooks), Profiler, highlight updates.', 'https://react.dev/learn/react-developer-tools'),
  nguon('💳', 'ICO — British Airways fined £20m (10/2020)', 'Script skimmer chèn vào trang thanh toán năm 2018 lấy dữ liệu thẻ của hơn 400 000 khách.', 'https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2020/10/ico-fines-british-airways-20m-for-data-breach-affecting-more-than-400-000-customers/'),
  lienKet({ khoa: 'authentication', bai: 'auth-3-2-thuoc-tinh-cookie', title: 'Khoá Xác thực 3.2 — thuộc tính cookie', sub: 'HttpOnly, Secure, SameSite, Domain, Path, Max-Age — thiết kế phiên đúng từ đầu.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-9-5-loi-nguoi-dung', title: 'Log từ A đến Z 9.5 — lỗi phía người dùng', sub: 'Thu lỗi trình duyệt của người dùng thật về server.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '5.4 — Application tab and React DevTools: cookies, storage, service workers|||5.4 — Tab Application và React DevTools: cookie, storage, service worker',
  slug: 'dbg-5-4-storage-react',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đăng nhập "mất" đo thật bốn cấu hình: localhost gọi 127.0.0.1 là khác site ⇒ Set-Cookie bị chặn SameSiteLax, None thiếu Secure bị chặn, proxy cùng origin thì chạy; HttpOnly làm document.cookie rỗng; localStorage và XSS; service worker cache-first giữ bản 1.0.0 sau khi deploy 1.1.0 (cả câu trả lời 401) — xoá và viết lại SW đúng; React DevTools: props phong=402 nhưng state còn 401, Profiler đếm commit; vụ British Airways 2018.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>What the browser remembers — and what React is holding</h2>
<p class="lead">Many "random" front-end bugs are state stored in the wrong place or kept for too long: a cookie the browser refused to save, a token any script can read, a service worker serving yesterday's files, a component holding a copy of an old prop. The Application panel shows what the browser stores for this site; React DevTools shows what each component holds. This lesson uses both on real bugs.</p>

<h3>An everyday picture: a wallet, a notebook on the table, and a doorman</h3>
<p>Cookies are cards in your wallet with rules printed on them: which shops accept them (SameSite), whether a child may take them out to look (HttpOnly = no JavaScript), whether they may be shown at an unsecured counter (Secure). localStorage is a notebook left open on the table — anyone in the room (any script on the page) can read it. A service worker is a doorman who keeps photocopies of everything that came in; if nobody tells him the menu changed, he keeps handing out yesterday's.</p>

<h3>1. "I log in, and I am still logged out": SameSite</h3>
<p>The login request returns 200, yet the next call is 401. We measured four configurations (CDP reports the same "blocked" reasons DevTools shows with a yellow ⚠ in Network › Cookies and Application › Cookies):</p>
${OUT_COOKIE}
<p>Why A fails: <strong>site ≠ origin</strong>. An origin is scheme + host + port. A <em>site</em> is scheme + registrable domain (eTLD+1). <code>localhost</code> and <code>127.0.0.1</code> are different sites, so a request from one to the other is <em>cross-site</em>, and a <code>SameSite=Lax</code> cookie (also Chrome's default when no SameSite is given) is neither stored from nor sent on a cross-site <code>fetch</code>. Note that <code>api.cuongthai.com</code> and <code>cuongthai.com</code> <em>are</em> the same site — that is why the same code may work in production and fail on your laptop.</p>
<p>Fixes, from best to last resort:</p>
<ul>
<li><strong>Same origin in development:</strong> a proxy in the dev server (C). Production: serve API and web from the same site (same domain or subdomain).</li>
<li><strong>Truly cross-site</strong> (an embedded widget): <code>SameSite=None; Secure</code> over HTTPS (B). Without <code>Secure</code> the browser refuses (D). Expect extra restrictions on third-party cookies in modern browsers.</li>
<li>Never "fix" it by moving the session token to localStorage — see below.</li>
</ul>
${MA_PROXY}
<p>Where to look in the UI: Application › Cookies › (origin) lists each cookie with Domain, Path, Expires, HttpOnly, Secure, SameSite — double-click to edit or delete for a test. In Network, click the request → <em>Cookies</em> tab; tick "show filtered out request cookies" to see cookies the browser decided not to send, with the reason on hover.</p>

<h3>2. HttpOnly, localStorage and XSS</h3>
<p>In C, the cookie exists and is sent, but <code>document.cookie</code> is <code>""</code>: HttpOnly hides it from JavaScript. If an attacker manages to run script on your page (XSS, or a compromised third-party script), they cannot read that session. A token in <code>localStorage</code> has no such protection — <code>localStorage.getItem('token')</code> works for any script on the origin. Application › Local storage / Session storage / IndexedDB let you inspect, edit and delete values; "Clear site data" (Application › Storage) wipes cookies, storage, caches and service workers for this site in one click — the first thing to try when a bug "only happens in my browser".</p>

<h3>3. The service worker that keeps yesterday's version</h3>
<p>Report after a deploy: "Customers still see version 1.0.0; we see 1.1.0". The sample app registers a cache-first service worker:</p>
${ma(SW_LOI)}
${OUT_SW}
<p>Three findings in one run. One: after the first visit, the page is controlled by the service worker, and <code>/phien-ban.json</code> comes "(from service worker)" — the server is not even asked, so Disable cache does not help. Two: the cache name never changes and nothing ever deletes old entries. Three: it also cached <code>/api/*</code> responses — including the <code>401</code> of "who am I" — so a user can log in and still be shown as logged out on the next load. Lab 5.5 has exactly that bug.</p>
<p>Application › Service workers is where you work on it: see the status (activated, <em>waiting to activate</em> for a new version), <strong>Update on reload</strong> (always fetch the new sw.js during development), <strong>Bypass for network</strong> (ignore the SW while debugging), <em>skipWaiting</em>, <em>Unregister</em>. Application › Cache storage shows what it stored. Fixed worker:</p>
${ma(SW_SUA)}
${OUT_SW_SUA}
<p>Even with the fix, users who already have the old worker get the new one only after the browser re-checks <code>sw.js</code> (on navigation); we measured it in Lab 5.5: the first reload after the deploy still comes from the old cache, the second is clean. Plan deploys of service workers like database migrations.</p>

<h3>4. React DevTools: props, state, and who rendered</h3>
<p>Install the "React Developer Tools" extension; two new tabs appear. <strong>Components</strong>: the component tree with props, state and hooks of the selected component, search, "rendered by", edit values live, and <code>$r</code> in the Console for the selected component. <strong>Profiler</strong>: record an interaction, then see each commit, which components rendered and how long they took; in settings tick "Highlight updates when components render" and "Record why each component rendered while profiling". Our machine has no screen, so we read the tree through the same hook the extension uses (<code>__REACT_DEVTOOLS_GLOBAL_HOOK__</code>, installed before React loads):</p>
<details><summary>c54-react.mjs — a 30-line "Components + Profiler" (for curiosity, not needed for the lesson)</summary>${ma(HOOK_REACT)}</details>
${OUT_REACT}
<p>The bug "I choose Lab 402 and still see Lab 401" is readable in one glance: <code>LichPhong</code> receives <code>phong=402</code> but its first state is still 401. Copying a prop into <code>useState</code> only uses the prop on the first render; and the effect with <code>[]</code> never runs again. In the extension you would click <code>LichPhong</code>, see <em>props: phong 402</em> and <em>hooks: State 401</em> side by side.</p>
${MA_STATE}
<p>The Profiler lines answer a different question — "does it render too much?": changing the room renders <code>App</code>, <code>LichPhong</code>, <code>DatChoForm</code> (all legitimately — they receive <code>phong</code>); typing renders only <code>DatChoForm</code>, once per keystroke. If you ever see a whole page re-render on each keystroke, the state lives too high, or a parent passes a new object/function every time (then <code>memo</code>/<code>useMemo</code>/<code>useCallback</code> or moving state down helps — measure before and after with the Profiler).</p>

<h3>Hacker corner: the script that reads the page — British Airways, 2018</h3>
<p>In 2018 attackers modified a JavaScript file on British Airways' website; for about two weeks it copied what customers typed on the payment page and sent it to a look-alike domain. More than 400,000 customers were affected; the UK ICO fined BA £20 million in 2020. Any script on your page — yours, a library, an analytics or chat widget — can read the DOM, localStorage and every non-HttpOnly cookie. Defences you can check in DevTools: session cookies HttpOnly + Secure + SameSite; no tokens in localStorage; a Content-Security-Policy that limits where scripts load from and where data can be sent (violations appear in the Console and Issues); Subresource Integrity (<code>integrity="sha384-…"</code>) for third-party files; and fewer third-party scripts on sensitive pages.</p>

<h3>On the job</h3>
<p>The QA team writes "login sometimes fails on staging, works on dev". Ask for one fact first: the URLs of the web and the API on each environment. Staging on <code>https://staging-web.vendor.io</code> and API on <code>https://api.client.vn</code> are different sites — the dev setup was same-site through a proxy. Show the ⚠ <code>SameSiteLax</code> in Network › Cookies in your report; the fix is an infrastructure decision (same site, or <code>None; Secure</code> + CORS with credentials), not a front-end patch.</p>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok">
<ol>
<li>Reproduce A–D. For each, screenshot (or copy) the Set-Cookie line with its ⚠ reason and the Application › Cookies row.</li>
<li>Prove HttpOnly: compare <code>document.cookie</code> with Application › Cookies. Put a fake token in localStorage and read it from the Console.</li>
<li>Reproduce the stale version with the service worker; recover with Update on reload / Unregister / Clear site data; then deploy the fixed worker and count the reloads until users get 1.1.0.</li>
<li>With React DevTools, find the props-vs-state mismatch in <code>LichPhong</code>; fix it; record a Profiler session while changing rooms and typing.</li>
</ol>
<p><strong>Done when:</strong> you can explain "site vs origin" with the localhost/127.0.0.1 example, and you know in which panel to look first for a login, a stale version and a stale component.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Site vs origin</span><span class="v">Site = scheme + registrable domain; origin = scheme + host + port.</span></div>
  <div class="kv"><span class="k">SameSite</span><span class="v">Strict / Lax (default) / None — whether a cookie goes with cross-site requests.</span></div>
  <div class="kv"><span class="k">HttpOnly · Secure</span><span class="v">Not readable by JavaScript · only over HTTPS (localhost is treated as secure).</span></div>
  <div class="kv"><span class="k">Domain · Path</span><span class="v">Which hosts and which URL paths a cookie is sent to.</span></div>
  <div class="kv"><span class="k">Service worker</span><span class="v">Script between the page and the network; can answer requests from its cache.</span></div>
  <div class="kv"><span class="k">Cache storage</span><span class="v">The caches a service worker fills — visible in Application.</span></div>
  <div class="kv"><span class="k">Components / Profiler</span><span class="v">React DevTools: props/state/hooks per component; commits and render reasons.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Login "lost" ⇒ look for ⚠ on Set-Cookie: SameSite, Secure, Domain/Path decide storing and sending.</li>
<li>localhost ↔ 127.0.0.1 is cross-site; use a dev proxy and same-site deployments.</li>
<li>HttpOnly keeps sessions away from scripts; localStorage does not.</li>
<li>A service worker can serve old files and old API answers; version caches, never cache /api blindly, know how to unregister.</li>
<li>React DevTools: compare props and state; Profiler before optimising.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Trình duyệt nhớ gì — và React đang giữ gì</h2>
<p class="lead">Nhiều lỗi giao diện "ngẫu nhiên" thật ra là trạng thái cất sai chỗ hoặc giữ quá lâu: cookie trình duyệt từ chối lưu, token script nào cũng đọc được, service worker trả tệp của hôm qua, component giữ bản sao của một prop cũ. Tab Application cho thấy trình duyệt đang cất gì cho trang này; React DevTools cho thấy mỗi component đang giữ gì. Bài này dùng cả hai trên lỗi thật.</p>

<h3>Liên tưởng đời thường: cái ví, cuốn sổ để trên bàn, và anh gác cửa</h3>
<p>Cookie là những tấm thẻ trong ví có in luật: cửa hàng nào nhận (SameSite), trẻ con có được rút ra xem không (HttpOnly = JavaScript không đọc được), có được đưa ra ở quầy không an toàn không (Secure). localStorage là cuốn sổ mở sẵn trên bàn — ai trong phòng (script nào trên trang) cũng đọc được. Service worker là anh gác cửa giữ bản photo mọi thứ từng đi qua; không ai báo thực đơn đã đổi thì anh cứ phát thực đơn hôm qua.</p>

<h3>1. "Đăng nhập xong vẫn chưa đăng nhập": SameSite</h3>
<p>Request đăng nhập trả 200, vậy mà lần gọi tiếp theo ra 401. Chúng tôi đo bốn cấu hình (CDP báo đúng các lý do "bị chặn" mà DevTools hiện bằng dấu ⚠ vàng ở Network › Cookies và Application › Cookies):</p>
${OUT_COOKIE}
<p>Vì sao A hỏng: <strong>site khác origin</strong>. Origin là scheme + host + cổng. <em>Site</em> là scheme + tên miền đăng ký được (eTLD+1). <code>localhost</code> và <code>127.0.0.1</code> là hai site khác nhau, nên request từ bên này sang bên kia là <em>cross-site</em>, và cookie <code>SameSite=Lax</code> (cũng là mặc định của Chrome khi không ghi SameSite) không được lưu từ, cũng không được gửi kèm, một <code>fetch</code> cross-site. Để ý <code>api.cuongthai.com</code> và <code>cuongthai.com</code> lại <em>cùng</em> site — vì vậy cùng một mã có thể chạy trên production mà hỏng trên laptop của bạn.</p>
<p>Cách sửa, từ tốt nhất tới bất đắc dĩ:</p>
<ul>
<li><strong>Cùng origin khi dev:</strong> proxy trong dev server (C). Production: đặt API và web cùng site (cùng tên miền hoặc tên miền con).</li>
<li><strong>Thật sự khác site</strong> (widget nhúng vào trang khác): <code>SameSite=None; Secure</code> qua HTTPS (B). Thiếu <code>Secure</code> là trình duyệt từ chối (D). Trình duyệt hiện đại còn siết thêm cookie bên thứ ba.</li>
<li>Đừng bao giờ "sửa" bằng cách chuyển token phiên sang localStorage — xem phần dưới.</li>
</ul>
${MA_PROXY}
<p>Nhìn ở đâu trên giao diện: Application › Cookies › (origin) liệt kê từng cookie với Domain, Path, Expires, HttpOnly, Secure, SameSite — bấm đúp để sửa hoặc xoá khi thử. Ở Network, bấm request → tab <em>Cookies</em>; tích "show filtered out request cookies" để thấy cookie trình duyệt quyết định không gửi, rê chuột để xem lý do.</p>

<h3>2. HttpOnly, localStorage và XSS</h3>
<p>Ở C, cookie có tồn tại và được gửi, nhưng <code>document.cookie</code> là <code>""</code>: HttpOnly giấu nó khỏi JavaScript. Nếu kẻ tấn công chạy được script trên trang (XSS, hoặc một script bên thứ ba bị chiếm), họ không đọc được phiên đó. Token trong <code>localStorage</code> không có lớp bảo vệ ấy — <code>localStorage.getItem('token')</code> chạy được với mọi script cùng origin. Application › Local storage / Session storage / IndexedDB cho xem, sửa, xoá giá trị; "Clear site data" (Application › Storage) xoá sạch cookie, storage, cache và service worker của trang trong một cú bấm — việc đầu tiên nên thử khi lỗi "chỉ xảy ra trên trình duyệt của em".</p>

<h3>3. Service worker giữ phiên bản hôm qua</h3>
<p>Báo cáo sau khi deploy: "Khách vẫn thấy bản 1.0.0; bên mình thấy 1.1.0". Ứng dụng mẫu đăng ký một service worker kiểu cache-first:</p>
${ma(SW_LOI)}
${OUT_SW}
<p>Một lần chạy, ba phát hiện. Một: sau lần vào đầu, trang do service worker điều khiển, và <code>/phien-ban.json</code> đến "(from service worker)" — server còn không được hỏi, nên Disable cache vô dụng. Hai: tên bộ đệm không bao giờ đổi và không gì xoá mục cũ. Ba: nó cache cả response <code>/api/*</code> — kể cả cái <code>401</code> của "tôi là ai" — nên người dùng đăng nhập xong vẫn có thể bị hiện là chưa đăng nhập ở lần tải sau. Lab 5.5 có đúng lỗi đó.</p>
<p>Application › Service workers là chỗ làm việc với nó: xem trạng thái (activated, <em>waiting to activate</em> cho bản mới), <strong>Update on reload</strong> (luôn tải sw.js mới khi dev), <strong>Bypass for network</strong> (bỏ qua SW khi debug), <em>skipWaiting</em>, <em>Unregister</em>. Application › Cache storage cho thấy nó đã cất gì. Bản sửa:</p>
${ma(SW_SUA)}
${OUT_SW_SUA}
<p>Kể cả có bản sửa, người dùng đang có worker cũ chỉ nhận worker mới sau khi trình duyệt kiểm lại <code>sw.js</code> (lúc điều hướng); chúng tôi đo ở Lab 5.5: lần tải lại đầu tiên sau deploy vẫn lấy từ bộ đệm cũ, lần thứ hai mới sạch. Lên kế hoạch deploy service worker cẩn thận như migration cơ sở dữ liệu.</p>

<h3>4. React DevTools: props, state, và ai đã render</h3>
<p>Cài extension "React Developer Tools"; xuất hiện hai tab mới. <strong>Components</strong>: cây component cùng props, state, hooks của component đang chọn, ô tìm, "rendered by", sửa giá trị trực tiếp, và <code>$r</code> trong Console là component đang chọn. <strong>Profiler</strong>: ghi một thao tác, rồi xem từng commit, component nào đã render và mất bao lâu; trong cài đặt tích "Highlight updates when components render" và "Record why each component rendered while profiling". Máy soạn bài không có màn hình, nên chúng tôi đọc cây qua đúng cái hook mà extension dùng (<code>__REACT_DEVTOOLS_GLOBAL_HOOK__</code>, cài trước khi React tải):</p>
<details><summary>c54-react.mjs — "Components + Profiler" 30 dòng (đọc cho biết, không bắt buộc)</summary>${ma(HOOK_REACT)}</details>
${OUT_REACT}
<p>Lỗi "chọn Lab 402 mà vẫn thấy Lab 401" đọc ra trong một cái liếc: <code>LichPhong</code> nhận <code>phong=402</code> nhưng state đầu tiên vẫn là 401. Chép prop vào <code>useState</code> chỉ dùng prop ở lần render đầu; còn effect với <code>[]</code> không bao giờ chạy lại. Trong extension bạn bấm <code>LichPhong</code>, thấy <em>props: phong 402</em> và <em>hooks: State 401</em> nằm cạnh nhau.</p>
${MA_STATE}
<p>Các dòng Profiler trả lời câu hỏi khác — "có render quá nhiều không?": đổi phòng thì render <code>App</code>, <code>LichPhong</code>, <code>DatChoForm</code> (đều hợp lý — chúng nhận <code>phong</code>); gõ phím chỉ render <code>DatChoForm</code>, mỗi phím một lần. Nếu thấy cả trang render lại mỗi lần gõ phím thì state đặt quá cao, hoặc component cha truyền object/hàm mới mỗi lần (khi đó <code>memo</code>/<code>useMemo</code>/<code>useCallback</code> hoặc dời state xuống sẽ giúp — đo trước và sau bằng Profiler).</p>

<h3>Góc hacker: đoạn script đọc trộm trang — British Airways, 2018</h3>
<p>Năm 2018 kẻ tấn công sửa một tệp JavaScript trên trang của British Airways; khoảng hai tuần, nó chép những gì khách gõ ở trang thanh toán và gửi về một tên miền giả trông giống thật. Hơn 400 000 khách bị ảnh hưởng; cơ quan ICO của Anh phạt BA 20 triệu bảng năm 2020. Script nào trên trang — của bạn, thư viện, widget thống kê hay chat — cũng đọc được DOM, localStorage và mọi cookie không HttpOnly. Các lớp phòng thủ bạn kiểm được bằng DevTools: cookie phiên HttpOnly + Secure + SameSite; không để token trong localStorage; Content-Security-Policy giới hạn script được tải từ đâu và dữ liệu được gửi đi đâu (vi phạm hiện ở Console và Issues); Subresource Integrity (<code>integrity="sha384-…"</code>) cho tệp bên thứ ba; và bớt script bên thứ ba ở các trang nhạy cảm.</p>

<h3>Tình huống đi làm</h3>
<p>Đội QA viết "đăng nhập thỉnh thoảng hỏng trên staging, trên dev thì được". Hỏi trước một sự thật: URL của web và API ở mỗi môi trường. Staging ở <code>https://staging-web.vendor.io</code> còn API ở <code>https://api.client.vn</code> là hai site khác nhau — môi trường dev thì cùng site nhờ proxy. Đưa dấu ⚠ <code>SameSiteLax</code> ở Network › Cookies vào báo cáo; cách sửa là quyết định hạ tầng (cùng site, hoặc <code>None; Secure</code> + CORS có credentials), không phải vá front-end.</p>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok">
<ol>
<li>Tái hiện A–D. Với mỗi cấu hình, chụp (hoặc chép) dòng Set-Cookie cùng lý do ⚠ và dòng trong Application › Cookies.</li>
<li>Chứng minh HttpOnly: so <code>document.cookie</code> với Application › Cookies. Đặt một token giả vào localStorage rồi đọc nó từ Console.</li>
<li>Tái hiện lỗi bản cũ với service worker; khôi phục bằng Update on reload / Unregister / Clear site data; rồi deploy worker đã sửa và đếm số lần tải lại cho tới khi người dùng thấy 1.1.0.</li>
<li>Dùng React DevTools tìm chỗ props lệch state trong <code>LichPhong</code>; sửa; ghi một phiên Profiler khi đổi phòng và gõ phím.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải thích được "site khác origin" bằng ví dụ localhost/127.0.0.1, và biết nhìn tab nào trước tiên cho lỗi đăng nhập, lỗi bản cũ và lỗi component giữ dữ liệu cũ.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Site và origin</span><span class="v">Site = scheme + tên miền đăng ký được; origin = scheme + host + cổng.</span></div>
  <div class="kv"><span class="k">SameSite</span><span class="v">Strict / Lax (mặc định) / None — cookie có đi kèm request cross-site không.</span></div>
  <div class="kv"><span class="k">HttpOnly · Secure</span><span class="v">JavaScript không đọc được · chỉ qua HTTPS (localhost được coi là an toàn).</span></div>
  <div class="kv"><span class="k">Domain · Path</span><span class="v">Cookie được gửi tới host nào và đường dẫn URL nào.</span></div>
  <div class="kv"><span class="k">Service worker</span><span class="v">Script đứng giữa trang và mạng; có thể trả lời request từ bộ đệm của nó.</span></div>
  <div class="kv"><span class="k">Cache storage</span><span class="v">Các bộ đệm service worker lấp đầy — xem được trong Application.</span></div>
  <div class="kv"><span class="k">Components / Profiler</span><span class="v">React DevTools: props/state/hooks từng component; các commit và lý do render.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đăng nhập "mất" ⇒ tìm dấu ⚠ trên Set-Cookie: SameSite, Secure, Domain/Path quyết định lưu và gửi.</li>
<li>localhost ↔ 127.0.0.1 là cross-site; dùng proxy khi dev và deploy cùng site.</li>
<li>HttpOnly giữ phiên khỏi tầm script; localStorage thì không.</li>
<li>Service worker có thể trả tệp cũ và câu trả lời API cũ; đặt phiên bản cho bộ đệm, đừng cache /api bừa, biết cách gỡ đăng ký.</li>
<li>React DevTools: so props với state; dùng Profiler trước khi tối ưu.</li>
</ul>
${NGUON}
</div>
`,
};
