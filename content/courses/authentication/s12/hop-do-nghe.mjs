/**
 * Authentication · Chương 12 · 12.3 — Hộp đồ nghề: tự trả lời lấy câu hỏi. Slug giữ: auth-12-3-hop-do-nghe.
 * Code THẬT từ _ma.mjs (demo12/toolbox.mjs) + output (LabFlow ID v1.0).
 */
import G from '../giang/auth-12-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const T = CODE.toolbox.split('\n');
const DECODE = T.slice(T.findIndex((l) => l.includes('const b64urlJson')), T.findIndex((l) => l.includes('function cookieFlags'))).join('\n').replace(/^\s*\n/gm, '').trim();

const NGUON_EN = [
  nguon('🔑', 'MDN — HTTP headers (Set-Cookie)', 'Reading cookie attributes from the header — part of the toolbox (read 04/11/2026).', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status'),
  nguon('🔐', 'OWASP — Authentication Cheat Sheet', 'The correct behaviours to check a token and cookie against (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
].join('\n');
const NGUON_VI = [
  nguon('🔑', 'MDN — HTTP headers (Set-Cookie)', 'Đọc thuộc tính cookie từ header — một phần hộp đồ nghề (đọc 04/11/2026).', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status'),
  nguon('🔐', 'OWASP — Authentication Cheat Sheet', 'Các hành vi đúng để kiểm một token và cookie với nó (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
].join('\n');

export default {
  title: '12.3 — The toolbox: answering the question yourself|||12.3 — Hộp đồ nghề: tự trả lời lấy câu hỏi',
  slug: 'auth-12-3-hop-do-nghe',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Bạn không cần đội backend nói cho bạn cái gì trong một token hay một cookie đặt đúng không — câu trả lời hiện ra nếu biết nhìn đâu. Hộp đồ nghề: (1) GIẢI một JWT bằng tay — base64url JSON hai phần (header + payload), tách theo dấu chấm, giải, parse; alg/kid/sub/exp ngay đó. (2) Đọc HẠN: so exp với now ⇒ "EXPIRED 50s ago" là cả câu trả lời "vì sao 401?". (3) Giải mã để ĐỌC, không để QUYẾT ĐỊNH — ai cũng giải được; chữ ký mới làm nó đáng tin (Ch4); dùng để chẩn đoán, không bao giờ để phân quyền. (4) KIỂM cookie — Set-Cookie là văn bản: HttpOnly/Secure/__Host-/SameSite (giải "Postman chạy, trình duyệt hỏng"). (5) curl -i lấy mã + header. (6) ĐO thời gian cho rò enumeration (Ch6). (7) Kiểm kid với JWKS (Ch4) cho "kid lạ" của xoay hỏng (11.2). (8) TÁI HIỆN nhỏ: một curl, hai dòng, một tài khoản thử. Theo MDN + OWASP Authentication.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>The toolbox: answering the question yourself</h2>
<p class="lead">You do not need the backend team to tell you what is inside a token or whether a cookie is set correctly — the answers are visible if you know where to look. The toolbox is a handful of tiny techniques, no libraries required, that turn "I think it is expired" into "it expired 50 seconds ago, here is the proof".</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> decode a JWT by hand to read its claims and expiry; inspect a cookie's flags from the header; and use timing and JWKS to answer questions without asking anyone.</p>
</div>

<h3>Decode a JWT by hand</h3>
<p>A JWT is base64url-encoded JSON in two readable parts — header and payload. Split on the dots, base64url-decode, parse. The <code>alg</code>, the <code>kid</code>, the <code>sub</code>, the <code>exp</code> are right there:</p>
${ma('javascript', DECODE)}
${ra(OUT['123-toolbox'])}
<p>The single most common "why is it 401?" is an expired token, and the decode answers it in two lines — <code>EXPIRED 50s ago</code> — without asking anyone. The cookie inspector reads the four session flags straight from the <code>Set-Cookie</code> header, which answers most of the "works in Postman, fails in the browser" shape from 12.2.</p>

<h3>Decode to diagnose, never to authorize</h3>
<p>Decoding is for <em>reading</em>, not deciding. Anyone can base64url-decode a token; the <strong>signature</strong> is what makes a claim trustworthy (Chapter 4). Use the decode to diagnose — read the claims, check the expiry — but the server still verifies the signature before it believes anything. A tool that decodes a token and trusts its <code>sub</code> is the exact bug the "yeu" client had in Chapter 8.</p>

<h3>The rest of the kit</h3>
<ul>
<li><strong>curl with status and headers:</strong> <code>curl -i</code> shows the status and every header; <code>-w "%{http_code}"</code> prints just the status for a script. The <code>Set-Cookie</code> is right there.</li>
<li><strong>Time the login:</strong> to check for an enumeration leak (Chapter 6), time a real vs a fake account; a consistent difference is the bug, equal timing is the fix.</li>
<li><strong>Check the kid against JWKS:</strong> when verification fails, fetch <code>/.well-known/jwks.json</code> (Chapter 4) and confirm the token's <code>kid</code> is present — a missing one is the "unknown kid" of a botched rotation (11.2).</li>
<li><strong>Reproduce small:</strong> a single curl, a two-line script, a test account. If you cannot reproduce it in isolation, you do not understand it yet.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Trap — "the token must be fine, the library would have caught it."</strong> Decode it and look. An expired token, a wrong <code>aud</code>, a <code>kid</code> that is not in JWKS — all are plainly visible in the token itself, and all produce the same opaque "401". The library did catch it; the question is <em>why</em>, and the answer is in the two lines of JSON you can read yourself.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"How do you check what is in a JWT without the backend?"</strong> — Split on the dots, base64url-decode the first two parts, read the JSON. For reading only — the signature still gates trust.</li>
<li><strong>"A token 401s — how do you find out why?"</strong> — Decode it: check <code>exp</code> vs now, <code>aud</code> vs the API, and the <code>kid</code> against JWKS. Usually one of those is the answer.</li>
<li><strong>"Why not trust a decoded token's claims?"</strong> — Anyone can forge an unsigned token; only the verified signature makes a claim trustworthy. Decode to diagnose, verify to authorize.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo12/toolbox.mjs</code>. The token's state line says what, and how did it conclude that from the payload?</li>
<li>You decode a token and its <code>sub</code> is "admin". Can you treat the request as an admin? Why or why not?</li>
<li>Verification fails with "unknown kid". Which two documents do you compare, and what are you looking for?</li>
</ol>
<p><strong>Solution:</strong> (1) <code>EXPIRED 50s ago</code> — it compared the payload's <code>exp</code> to the current time and found now is past it. (2) no — a decoded token is unverified; anyone can mint one claiming <code>sub: "admin"</code>. Only the verified signature authorizes; decoding is for diagnosis. (3) the token's header (its <code>kid</code>) and the provider's <code>/.well-known/jwks.json</code> — you are checking whether that <code>kid</code> is present in JWKS; if not, it is a botched rotation (11.2).</p>
<p><strong>Done when:</strong> you can read a token's claims and expiry by hand, inspect a cookie's flags, and never confuse decoding with verifying.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">decode a JWT</span><span class="v">base64url-decode the header and payload to read claims — for diagnosis only.</span></div>
  <div class="kv"><span class="k">decode vs verify</span><span class="v">Decoding reads; only the signature check authorizes (Chapter 4).</span></div>
  <div class="kv"><span class="k">cookie inspector</span><span class="v">Reading HttpOnly/Secure/__Host-/SameSite from <code>Set-Cookie</code>.</span></div>
  <div class="kv"><span class="k">timing check</span><span class="v">Timing real vs fake logins to detect an enumeration leak (Chapter 6).</span></div>
  <div class="kv"><span class="k">minimal repro</span><span class="v">A curl, a two-line script, a test account — isolate before you explain.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A JWT is base64url JSON you can decode in two lines — read the <code>alg</code>, <code>kid</code>, <code>sub</code>, <code>exp</code>.</li>
<li>The expiry answers most "why is it 401?" questions without asking anyone.</li>
<li>Decode to diagnose, never to authorize — only the verified signature makes a claim trustworthy.</li>
<li>Inspect cookie flags from <code>Set-Cookie</code>; time logins for enumeration; check the <code>kid</code> against JWKS.</li>
<li>Reproduce small — if you cannot isolate it, you do not understand it yet.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-4-1-giai-ma-bang-tay', title: 'Back to 4.1 — decoding a JWT by hand', sub: 'There, taking a JWT apart to see it is just base64url JSON, and why decoding is not verifying. Here, that same skill is your fastest diagnostic tool. The lesson that demystified the token now debugs it.', cta: 'OPEN LESSON 4.1 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Hộp đồ nghề: tự trả lời lấy câu hỏi</h2>
<p class="lead">Bạn không cần đội backend nói cho bạn cái gì bên trong một token hay một cookie đặt đúng không — câu trả lời hiện ra nếu bạn biết nhìn đâu. Hộp đồ nghề là một nắm kỹ thuật nhỏ, không cần thư viện, biến "tôi nghĩ nó hết hạn" thành "nó hết hạn 50 giây trước, đây là bằng chứng".</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> giải một JWT bằng tay để đọc claim và hạn của nó; kiểm cờ một cookie từ header; và dùng thời gian và JWKS để trả lời câu hỏi mà không hỏi ai.</p>
</div>

<h3>Giải một JWT bằng tay</h3>
<p>Một JWT là JSON mã base64url trong hai phần đọc được — header và payload. Tách theo dấu chấm, giải base64url, parse. <code>alg</code>, <code>kid</code>, <code>sub</code>, <code>exp</code> ngay đó:</p>
${ma('javascript', DECODE)}
${ra(OUT['123-toolbox'])}
<p>Cái "vì sao 401?" phổ biến nhất là một token hết hạn, và giải mã trả lời nó trong hai dòng — <code>EXPIRED 50s ago</code> — mà không hỏi ai. Bộ kiểm cookie đọc bốn cờ phiên thẳng từ header <code>Set-Cookie</code>, trả lời phần lớn dáng "chạy trong Postman, hỏng ở trình duyệt" từ 12.2.</p>

<h3>Giải mã để chẩn đoán, không bao giờ để phân quyền</h3>
<p>Giải mã là để <em>đọc</em>, không phải quyết định. Ai cũng giải base64url một token; <strong>chữ ký</strong> mới làm một claim đáng tin (Chương 4). Dùng giải mã để chẩn đoán — đọc claim, kiểm hạn — nhưng máy chủ vẫn xác minh chữ ký trước khi tin bất cứ gì. Một công cụ giải một token và tin <code>sub</code> của nó là đúng con lỗi mà client "yếu" có ở Chương 8.</p>

<h3>Phần còn lại của bộ đồ</h3>
<ul>
<li><strong>curl với mã và header:</strong> <code>curl -i</code> hiện mã và mọi header; <code>-w "%{http_code}"</code> in chỉ mã cho một script. <code>Set-Cookie</code> ngay đó.</li>
<li><strong>Đo thời gian đăng nhập:</strong> để kiểm một rò enumeration (Chương 6), đo một tài khoản thật so với một cái giả; một khác biệt nhất quán là con lỗi, thời gian bằng nhau là cách sửa.</li>
<li><strong>Kiểm kid với JWKS:</strong> khi xác minh hỏng, lấy <code>/.well-known/jwks.json</code> (Chương 4) và xác nhận <code>kid</code> của token có mặt — một cái thiếu là "kid lạ" của một lần xoay hỏng (11.2).</li>
<li><strong>Tái hiện nhỏ:</strong> một curl, một script hai dòng, một tài khoản thử. Nếu bạn không tái hiện nó cô lập được, bạn chưa hiểu nó.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "token chắc ổn, thư viện đã bắt nếu không."</strong> Giải nó và nhìn. Một token hết hạn, một <code>aud</code> sai, một <code>kid</code> không trong JWKS — tất cả hiện rõ trong chính token, và tất cả tạo cùng một "401" mờ đục. Thư viện có bắt nó; câu hỏi là <em>vì sao</em>, và câu trả lời ở hai dòng JSON bạn tự đọc được.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Bạn kiểm cái gì trong một JWT mà không có backend ra sao?"</strong> — Tách theo dấu chấm, giải base64url hai phần đầu, đọc JSON. Chỉ để đọc — chữ ký vẫn chốt sự tin.</li>
<li><strong>"Một token 401 — bạn tìm ra vì sao ra sao?"</strong> — Giải nó: kiểm <code>exp</code> với now, <code>aud</code> với API, và <code>kid</code> với JWKS. Thường một trong số đó là câu trả lời.</li>
<li><strong>"Sao không tin claim của một token đã giải?"</strong> — Ai cũng giả một token không ký; chỉ chữ ký đã xác minh làm một claim đáng tin. Giải để chẩn đoán, xác minh để phân quyền.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo12/toolbox.mjs</code>. Dòng trạng thái của token nói gì, và nó kết luận điều đó từ payload ra sao?</li>
<li>Bạn giải một token và <code>sub</code> của nó là "admin". Bạn coi request là admin được không? Vì sao được/không?</li>
<li>Xác minh hỏng với "kid lạ". Bạn so hai tài liệu nào, và bạn tìm cái gì?</li>
</ol>
<p><strong>Lời giải:</strong> (1) <code>EXPIRED 50s ago</code> — nó so <code>exp</code> của payload với thời gian hiện tại và thấy now đã qua nó. (2) không — một token đã giải là chưa xác minh; ai cũng đúc một cái khai <code>sub: "admin"</code>. Chỉ chữ ký đã xác minh phân quyền; giải mã là để chẩn đoán. (3) header của token (cái <code>kid</code> của nó) và <code>/.well-known/jwks.json</code> của provider — bạn kiểm <code>kid</code> đó có trong JWKS không; nếu không, là một lần xoay hỏng (11.2).</p>
<p><strong>Đạt khi:</strong> bạn đọc được claim và hạn của một token bằng tay, kiểm cờ một cookie, và không bao giờ lẫn giải mã với xác minh.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">decode a JWT (giải một JWT)</span><span class="v">Giải base64url header và payload để đọc claim — chỉ để chẩn đoán.</span></div>
  <div class="kv"><span class="k">decode vs verify</span><span class="v">Giải mã thì đọc; chỉ phép kiểm chữ ký phân quyền (Chương 4).</span></div>
  <div class="kv"><span class="k">cookie inspector</span><span class="v">Đọc HttpOnly/Secure/__Host-/SameSite từ <code>Set-Cookie</code>.</span></div>
  <div class="kv"><span class="k">timing check (đo thời gian)</span><span class="v">Đo đăng nhập thật so với giả để phát hiện một rò enumeration (Chương 6).</span></div>
  <div class="kv"><span class="k">minimal repro (tái hiện tối thiểu)</span><span class="v">Một curl, một script hai dòng, một tài khoản thử — cô lập trước khi giải thích.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một JWT là JSON base64url bạn giải trong hai dòng — đọc <code>alg</code>, <code>kid</code>, <code>sub</code>, <code>exp</code>.</li>
<li>Hạn trả lời phần lớn câu hỏi "vì sao 401?" mà không hỏi ai.</li>
<li>Giải để chẩn đoán, không bao giờ để phân quyền — chỉ chữ ký đã xác minh làm một claim đáng tin.</li>
<li>Kiểm cờ cookie từ <code>Set-Cookie</code>; đo thời gian đăng nhập cho enumeration; kiểm <code>kid</code> với JWKS.</li>
<li>Tái hiện nhỏ — nếu bạn không cô lập được, bạn chưa hiểu nó.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-4-1-giai-ma-bang-tay', title: 'Quay lại 4.1 — giải một JWT bằng tay', sub: 'Ở đó, tháo một JWT ra để thấy nó chỉ là JSON base64url, và vì sao giải mã không phải xác minh. Ở đây, đúng kỹ năng đó là công cụ chẩn đoán nhanh nhất của bạn. Bài giải mật token giờ debug nó.', cta: 'MỞ BÀI 4.1 →' })}
</div>
`,
};
