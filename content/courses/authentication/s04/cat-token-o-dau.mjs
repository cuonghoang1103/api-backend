/**
 * Authentication · Chương 4 · 4.5 — Cất token ở đâu trong trình duyệt. Slug giữ: auth-4-5-cat-token-o-dau.
 * Output thật (_ma.mjs, Chromium 156): một script bị tiêm trộm token từ localStorage và cookie thường, KHÔNG chạm được
 * cookie HttpOnly (document.cookie không hiện). Đánh đổi XSS ↔ CSRF; mẫu an toàn: access token trong bộ nhớ, refresh ở cookie HttpOnly.
 */
import G from '../giang/auth-04-5.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const SV = CODE.server04.split('\n');
const TOKENROUTE = SV.slice(SV.findIndex((l) => l.includes("app.post('/token'")), SV.findIndex((l) => l.includes("app.post('/me/email'"))).join('\n').trim();

const NGUON_EN = [
  nguon('🦉', 'OWASP — JSON Web Token Cheat Sheet (token sidejacking, storage)', 'Protect tokens from theft; a token readable by JavaScript is exposed to XSS; prefer cookie flags and short lifetimes (read 03/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html'),
  nguon('🦉', 'OWASP — HTML5 Security / Local Storage', 'Do not store sensitive tokens in localStorage: any script on the origin can read it; there is no HttpOnly equivalent (read 03/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html'),
].join('\n');
const NGUON_VI = [
  nguon('🦉', 'OWASP — JSON Web Token Cheat Sheet (trộm token, nơi cất)', 'Bảo vệ token khỏi bị trộm; một token JavaScript đọc được là phơi ra trước XSS; ưu tiên cờ cookie và tuổi thọ ngắn (đọc 03/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html'),
  nguon('🦉', 'OWASP — HTML5 Security / Local Storage', 'Đừng cất token nhạy cảm trong localStorage: mọi script trên origin đọc được nó; không có tương đương HttpOnly (đọc 03/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Where</th><th>Survives refresh?</th><th>Readable by a script?</th><th>Sent automatically?</th><th>Main risk</th></tr></thead>
<tbody>
<tr><td><code>localStorage</code></td><td>yes</td><td><strong>yes — any script</strong></td><td>no (you attach it)</td><td>XSS reads and exfiltrates it</td></tr>
<tr><td>a JS variable (memory)</td><td>no</td><td>only the running page</td><td>no (you attach it)</td><td>gone on refresh; a later injected script cannot read the old one</td></tr>
<tr><td>a plain cookie</td><td>yes</td><td><strong>yes</strong></td><td>yes</td><td>XSS reads it <em>and</em> CSRF spends it</td></tr>
<tr><td><code>HttpOnly</code> cookie</td><td>yes</td><td><strong>no</strong></td><td>yes</td><td>CSRF (another site makes the browser send it) — Chapter 3</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Ở đâu</th><th>Sống qua tải lại?</th><th>Script đọc được?</th><th>Tự gửi?</th><th>Rủi ro chính</th></tr></thead>
<tbody>
<tr><td><code>localStorage</code></td><td>có</td><td><strong>có — mọi script</strong></td><td>không (bạn tự gắn)</td><td>XSS đọc và tuồn nó ra</td></tr>
<tr><td>một biến JS (bộ nhớ)</td><td>không</td><td>chỉ trang đang chạy</td><td>không (bạn tự gắn)</td><td>mất khi tải lại; một script tiêm sau không đọc được cái cũ</td></tr>
<tr><td>một cookie thường</td><td>có</td><td><strong>có</strong></td><td>có</td><td>XSS đọc <em>và</em> CSRF tiêu nó</td></tr>
<tr><td>cookie <code>HttpOnly</code></td><td>có</td><td><strong>không</strong></td><td>có</td><td>CSRF (site khác bắt trình duyệt gửi nó) — Chương 3</td></tr>
</tbody>
</table>`;

export default {
  title: '4.5 — Where to keep a token in the browser|||4.5 — Cất token ở đâu trong trình duyệt',
  slug: 'auth-4-5-cat-token-o-dau',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bạn có một token — giờ trình duyệt đặt nó ở đâu? Mỗi lựa chọn đánh đổi một rủi ro lấy rủi ro khác. Trong Chromium 156, một script bị tiêm trộm được token từ localStorage và từ một cookie thường, nhưng KHÔNG chạm được cookie HttpOnly (document.cookie không hiện nó); đổi lại HttpOnly mang về chính bài toán CSRF của Chương 3. Mẫu an toàn phổ biến: access token ngắn giữ trong bộ nhớ và gửi qua header Authorization, refresh token (Chương 5) trong một cookie HttpOnly giới hạn ở tuyến refresh; không bao giờ để token trong URL (bài 1.1).',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>Where to keep a token in the browser</h2>
<p class="lead">You can now build, verify and rotate a token. The last question is the one tutorials wave away: once LabFlow's front end has an access token, <strong>where does it keep it?</strong> Unlike a session cookie — which the browser manages and lesson 3.2 pinned down attribute by attribute — an access token you fetch is yours to store, and every place you could put it trades one attack for another. This lesson runs the theft in real Chromium and then chooses a plan on purpose.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>name the three places a browser can keep a token and the risk of each;</li>
<li>show, in a real browser, what an injected script can and cannot read;</li>
<li>explain why HttpOnly stops XSS theft but reintroduces CSRF;</li>
<li>pick a storage plan — short access token in memory, refresh token in an HttpOnly cookie, nothing in the URL.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> “just put the JWT in localStorage” is the single most common front-end security mistake, and it turns any XSS into a full account takeover. After this lesson you can defend your choice with a demo, not a vibe.</p>
</div>

<h3>An everyday picture first</h3>
<p>Where do you keep cash? In your <strong>wallet</strong> it is easy to spend but a pickpocket can lift it (localStorage: any script reads it). In a <strong>safe</strong> it is hard to steal but also hard to spend on the move (memory: gone the moment the page reloads). Or you hand it to a <strong>valet who pays on your behalf</strong> — convenient, but a con artist can trick the valet into paying the wrong person (an HttpOnly cookie: the browser pays automatically, so another site can trigger it — CSRF). There is no pocket that is simply safe; you pick which risk you can control.</p>

<h3>The injected script, in real Chromium</h3>
<p>Assume one line of someone else's JavaScript runs on the page — a cross-site scripting bug, a compromised npm dependency, a malicious extension. It runs with the page's full privileges. LabFlow's page keeps the same token in three places; the injected script reads what it can and ships it to the attacker:</p>
${ra(OUT['45-storage'])}
<p>The <code>localStorage</code> token is stolen. The plain cookie is stolen (it shows up in <code>document.cookie</code>). The <strong>HttpOnly</strong> cookie is the one thing the script cannot see — <code>document.cookie</code> simply does not include it. That is the whole security value of <code>HttpOnly</code> (lesson 3.2): it takes the token off the JavaScript table.</p>

<h3>But HttpOnly brings CSRF back</h3>
<p>So put every token in an HttpOnly cookie? Then the browser attaches it to <em>every</em> request to the origin by itself — which is exactly the setup for CSRF (Chapter 3): another site can make the user's browser fire a request that carries the cookie. You have traded “a script can read the token” for “another site can spend it”. Neither storage is free; you are choosing which attack you will defend.</p>
${BANG_EN}

<h3>A common safe pattern</h3>
<p>The usual answer splits the two tokens of Chapter 5 by where each is kept:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Access token → memory</span><span class="lz-d">A short (15-min) token in a JS variable, attached as <code>Authorization: Bearer …</code>. A <em>later</em> injected script cannot read a variable from a previous page load, and it expires fast.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Refresh token → HttpOnly cookie</span><span class="lz-d">Long-lived, in an HttpOnly cookie scoped to the refresh route only. A script cannot read it; CSRF can reach just that one endpoint, which gets the Chapter 3 defences.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Short lifetimes do the rest</span><span class="lz-d">Because a JWT cannot be revoked instantly (4.3), 15 minutes caps a stolen access token's damage; the refresh token — which you <em>can</em> revoke — is the real control (Chapter 5).</span></div>
</div>

<h3>How LabFlow ID issues it</h3>
<p>LabFlow ID itself keeps its session in a <code>__Host-</code> cookie (Chapter 3). The access token it mints for LabFlow API is returned in the body, for the client to hold in memory and send as a bearer header:</p>
${ma('javascript', TOKENROUTE)}
<p>The response is <code>{ access_token, token_type: 'Bearer', expires_in: 900 }</code>. The client does <strong>not</strong> write that into <code>localStorage</code>; it keeps it in a variable and attaches it to API calls. The long-lived refresh token that renews it (Chapter 5) is the part that belongs in an HttpOnly cookie.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — a token in the URL.</strong> Passing a token as <code>?access_token=…</code> lands it in browser history, server access logs, and the <code>Referer</code> sent to third parties (lesson 1.1, measured in Chromium 156). It also makes it trivially shareable by copy-paste. A token belongs in the <code>Authorization</code> header or an HttpOnly cookie — never a query string, never a path segment.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“Where do you store a JWT in the browser?”</strong> — Not in localStorage. Access token in memory as a bearer header; refresh token in an HttpOnly, path-scoped cookie; short lifetimes. Name the XSS/CSRF trade-off.</li>
<li><strong>“Isn't an HttpOnly cookie just safe?”</strong> — It stops a script reading the token, but the browser sends it automatically, so you still need CSRF defence (SameSite, Origin/Sec-Fetch checks — Chapter 3).</li>
<li><strong>“Why keep the access token so short?”</strong> — Because you cannot revoke a JWT instantly; a short lifetime is the cap on a stolen token, and the refresh token is where real revocation lives.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo4/storage-server.js</code> and <code>node demo4/storage-xss.mjs</code>. Confirm which of the three places the injected script read, and which it could not.</li>
<li>In <code>demo4/storage-server.js</code>, remove <code>HttpOnly</code> from the first cookie and rerun. What changes in <code>document.cookie</code>?</li>
<li>Argue it out: your SEP490 app is a single-page app that reloads rarely. Where do you keep the access token, and what must you still do for the refresh route?</li>
</ol>
<p><strong>Solution:</strong> (1) localStorage and the readable cookie are stolen; the HttpOnly cookie is not in <code>document.cookie</code>. (2) the former HttpOnly cookie now appears in <code>document.cookie</code> and is stolen too — the flag was the only thing hiding it. (3) access token in memory (bearer header); the refresh route needs CSRF defence because its HttpOnly cookie is sent automatically.</p>
<p><strong>Done when:</strong> you can demo what an injected script reads, and defend a storage choice by naming its attack.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">localStorage</span><span class="v">Per-origin key/value store, readable by any script on the origin. No HttpOnly equivalent — bad for tokens.</span></div>
  <div class="kv"><span class="k">in-memory token</span><span class="v">A token held in a JS variable; unreadable by a later-injected script, lost on refresh.</span></div>
  <div class="kv"><span class="k">HttpOnly cookie</span><span class="v">A cookie JavaScript cannot read; sent automatically, so it needs CSRF defence (Chapter 3).</span></div>
  <div class="kv"><span class="k">XSS</span><span class="v">Cross-site scripting: attacker JavaScript running on your page; reads anything a script can.</span></div>
  <div class="kv"><span class="k">CSRF</span><span class="v">Cross-site request forgery: another site makes the browser send an authenticated request with the cookie.</span></div>
  <div class="kv"><span class="k">bearer token</span><span class="v">A token sent in <code>Authorization: Bearer …</code>; whoever holds it can use it, so where you keep it matters.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>No browser storage is simply safe: each trades a script reading the token for the browser sending it.</li>
<li>In real Chromium, an injected script steals a localStorage token and a plain cookie, but not an HttpOnly one.</li>
<li>HttpOnly stops XSS theft but reintroduces CSRF — the token is sent automatically.</li>
<li>Pattern: short access token in memory (bearer header), refresh token in an HttpOnly, path-scoped cookie.</li>
<li>Never put a token in a URL — history, logs and <code>Referer</code> leak it (lesson 1.1).</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-4-cookie-csrf-thu-hoi', title: 'Applied in Node.js — lesson 8.4: cookies, CSRF, revocation', sub: 'Same trade-off from the cookie side: that lesson puts the token in a cookie and must then defend CSRF and revoke with a tokenVersion; this one weighs localStorage vs memory vs HttpOnly and shows the theft in a real browser. Each stands on its own.', cta: 'OPEN NODE.JS LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Cất token ở đâu trong trình duyệt</h2>
<p class="lead">Giờ bạn dựng, xác minh và xoay được một token. Câu hỏi cuối là câu các hướng dẫn gạt đi: khi front end của LabFlow đã có một access token, <strong>nó cất ở đâu?</strong> Khác với một cookie phiên — thứ trình duyệt tự quản và bài 3.2 đã chốt từng thuộc tính — một access token bạn tự tải về là của bạn để cất, và mọi chỗ bạn có thể đặt nó đều đánh đổi một cú tấn công lấy một cú khác. Bài này chạy cú trộm trong Chromium thật rồi chọn một kế hoạch có chủ ý.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>gọi tên ba chỗ trình duyệt có thể cất token và rủi ro của mỗi chỗ;</li>
<li>chỉ ra, trong một trình duyệt thật, một script bị tiêm đọc được gì và không đọc được gì;</li>
<li>giải thích vì sao HttpOnly chặn trộm bằng XSS nhưng mang CSRF trở lại;</li>
<li>chọn một kế hoạch cất token — access token ngắn trong bộ nhớ, refresh token trong cookie HttpOnly, không gì trong URL.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> "cứ để JWT trong localStorage" là lỗi bảo mật front-end phổ biến nhất, và nó biến mọi XSS thành một cú chiếm trọn tài khoản. Học xong bài này, bạn bảo vệ được lựa chọn của mình bằng một demo, không bằng cảm tính.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Bạn giữ tiền ở đâu? Trong <strong>ví</strong> thì dễ tiêu nhưng móc túi lấy được (localStorage: mọi script đọc được). Trong <strong>két</strong> thì khó trộm nhưng cũng khó tiêu khi đang đi (bộ nhớ: mất ngay khi trang tải lại). Hoặc bạn giao cho một <strong>người giữ xe trả hộ</strong> — tiện, nhưng một kẻ lừa đảo lừa được anh ta trả cho nhầm người (cookie HttpOnly: trình duyệt tự trả, nên một site khác kích hoạt được — CSRF). Không có túi nào đơn giản là an toàn; bạn chọn rủi ro mình kiểm soát được.</p>

<h3>Script bị tiêm, trong Chromium thật</h3>
<p>Giả sử một dòng JavaScript của người khác chạy trên trang — một lỗi cross-site scripting, một phụ thuộc npm bị chiếm, một tiện ích độc. Nó chạy với toàn quyền của trang. Trang của LabFlow giữ cùng một token ở ba chỗ; script bị tiêm đọc cái gì đọc được và tuồn nó cho kẻ tấn công:</p>
${ra(OUT['45-storage'])}
<p>Token <code>localStorage</code> bị trộm. Cookie thường bị trộm (nó hiện trong <code>document.cookie</code>). Cookie <strong>HttpOnly</strong> là thứ duy nhất script không thấy — <code>document.cookie</code> đơn giản không gồm nó. Đó là toàn bộ giá trị bảo mật của <code>HttpOnly</code> (bài 3.2): nó gạt token khỏi bàn của JavaScript.</p>

<h3>Nhưng HttpOnly mang CSRF trở lại</h3>
<p>Vậy để mọi token trong một cookie HttpOnly? Thì trình duyệt tự gắn nó vào <em>mọi</em> request tới origin — đúng là bối cảnh của CSRF (Chương 3): một site khác bắt trình duyệt của người dùng bắn một request mang theo cookie. Bạn đã đánh đổi "một script đọc được token" lấy "một site khác tiêu được nó". Không chỗ cất nào miễn phí; bạn đang chọn cú tấn công mình sẽ chống.</p>
${BANG_VI}

<h3>Một mẫu an toàn phổ biến</h3>
<p>Câu trả lời thường gặp tách hai token của Chương 5 theo nơi cất mỗi cái:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Access token → bộ nhớ</span><span class="lz-d">Một token ngắn (15 phút) trong một biến JS, gắn qua <code>Authorization: Bearer …</code>. Một script tiêm <em>sau</em> không đọc được một biến từ lần tải trang trước, và nó hết hạn nhanh.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Refresh token → cookie HttpOnly</span><span class="lz-d">Dài hạn, trong một cookie HttpOnly chỉ giới hạn ở tuyến refresh. Script không đọc được; CSRF chỉ với tới đúng một endpoint đó, và endpoint đó nhận các lớp phòng của Chương 3.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Tuổi thọ ngắn lo phần còn lại</span><span class="lz-d">Vì một JWT không thu hồi tức thì được (4.3), 15 phút giới hạn thiệt hại của một access token bị trộm; refresh token — thứ bạn <em>thu hồi được</em> — mới là chốt chặn thật (Chương 5).</span></div>
</div>

<h3>LabFlow ID phát nó thế nào</h3>
<p>Bản thân LabFlow ID giữ phiên của mình trong một cookie <code>__Host-</code> (Chương 3). Access token nó đúc cho LabFlow API được trả trong thân, để client giữ trong bộ nhớ và gửi dưới dạng một header bearer:</p>
${ma('javascript', TOKENROUTE)}
<p>Phản hồi là <code>{ access_token, token_type: 'Bearer', expires_in: 900 }</code>. Client <strong>không</strong> ghi nó vào <code>localStorage</code>; nó giữ trong một biến và gắn vào các lời gọi API. Refresh token dài hạn làm mới nó (Chương 5) mới là phần nên nằm trong một cookie HttpOnly.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — một token trong URL.</strong> Truyền một token kiểu <code>?access_token=…</code> làm nó rơi vào lịch sử trình duyệt, log truy cập máy chủ, và <code>Referer</code> gửi tới bên thứ ba (bài 1.1, đo trong Chromium 156). Nó cũng khiến token dễ bị chia sẻ bằng sao-chép. Một token thuộc về header <code>Authorization</code> hoặc một cookie HttpOnly — không bao giờ một query string, không bao giờ một đoạn đường dẫn.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Bạn cất một JWT ở đâu trong trình duyệt?"</strong> — Không phải localStorage. Access token trong bộ nhớ làm header bearer; refresh token trong một cookie HttpOnly giới hạn đường dẫn; tuổi thọ ngắn. Gọi tên đánh đổi XSS/CSRF.</li>
<li><strong>"Một cookie HttpOnly không phải là an toàn rồi sao?"</strong> — Nó chặn một script đọc token, nhưng trình duyệt tự gửi nó, nên bạn vẫn cần phòng CSRF (SameSite, kiểm Origin/Sec-Fetch — Chương 3).</li>
<li><strong>"Vì sao giữ access token ngắn đến thế?"</strong> — Vì bạn không thu hồi một JWT tức thì được; tuổi thọ ngắn là cái trần cho một token bị trộm, và refresh token là nơi có thu hồi thật.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo4/storage-server.js</code> và <code>node demo4/storage-xss.mjs</code>. Xác nhận script bị tiêm đọc được chỗ nào trong ba chỗ, và chỗ nào không.</li>
<li>Trong <code>demo4/storage-server.js</code>, bỏ <code>HttpOnly</code> khỏi cookie đầu và chạy lại. <code>document.cookie</code> đổi gì?</li>
<li>Lập luận: app SEP490 của bạn là một ứng dụng một trang hiếm khi tải lại. Bạn giữ access token ở đâu, và vẫn phải làm gì cho tuyến refresh?</li>
</ol>
<p><strong>Lời giải:</strong> (1) localStorage và cookie đọc được bị trộm; cookie HttpOnly không có trong <code>document.cookie</code>. (2) cái cookie HttpOnly trước đó giờ hiện trong <code>document.cookie</code> và cũng bị trộm — cái cờ là thứ duy nhất giấu nó. (3) access token trong bộ nhớ (header bearer); tuyến refresh cần phòng CSRF vì cookie HttpOnly của nó tự gửi.</p>
<p><strong>Đạt khi:</strong> bạn demo được một script bị tiêm đọc gì, và bảo vệ được một lựa chọn cất token bằng cách gọi tên cú tấn công của nó.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">localStorage</span><span class="v">Kho key/value theo origin, mọi script trên origin đọc được. Không có tương đương HttpOnly — tệ cho token.</span></div>
  <div class="kv"><span class="k">in-memory token (token trong bộ nhớ)</span><span class="v">Một token giữ trong biến JS; script tiêm sau không đọc được, mất khi tải lại.</span></div>
  <div class="kv"><span class="k">HttpOnly cookie</span><span class="v">Một cookie JavaScript không đọc được; tự gửi, nên cần phòng CSRF (Chương 3).</span></div>
  <div class="kv"><span class="k">XSS</span><span class="v">Cross-site scripting: JavaScript của kẻ tấn công chạy trên trang bạn; đọc bất cứ gì một script đọc được.</span></div>
  <div class="kv"><span class="k">CSRF</span><span class="v">Cross-site request forgery: một site khác bắt trình duyệt gửi một request có xác thực kèm cookie.</span></div>
  <div class="kv"><span class="k">bearer token</span><span class="v">Một token gửi trong <code>Authorization: Bearer …</code>; ai cầm là dùng được, nên cất ở đâu rất quan trọng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Không chỗ cất nào trong trình duyệt đơn giản là an toàn: mỗi chỗ đánh đổi script đọc token lấy trình duyệt tự gửi.</li>
<li>Trong Chromium thật, một script bị tiêm trộm token localStorage và cookie thường, nhưng không trộm cookie HttpOnly.</li>
<li>HttpOnly chặn trộm bằng XSS nhưng mang CSRF trở lại — token tự được gửi.</li>
<li>Mẫu: access token ngắn trong bộ nhớ (header bearer), refresh token trong cookie HttpOnly giới hạn đường dẫn.</li>
<li>Không bao giờ để token trong URL — lịch sử, log và <code>Referer</code> rò nó (bài 1.1).</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-4-cookie-csrf-thu-hoi', title: 'Áp vào Node.js — bài 8.4: cookie, CSRF, thu hồi', sub: 'Cùng đánh đổi nhìn từ phía cookie: bài đó đặt token trong một cookie rồi phải phòng CSRF và thu hồi bằng tokenVersion; bài này cân localStorage với bộ nhớ với HttpOnly và chỉ ra cú trộm trong một trình duyệt thật. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI NODE.JS →' })}
</div>
`,
};
