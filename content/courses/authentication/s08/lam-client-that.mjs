/**
 * Authentication · Chương 8 · 8.5 — Làm client thật: nối, gỡ nối, và cái ngày Google sập. Slug giữ: auth-8-5-lam-client-that.
 * Output thật (_ma.mjs, 81-oidc-flow): client bắt đầu phiên CỦA MÌNH sau khi xác minh id_token (sub ổn định để nối).
 */
import G from '../giang/auth-08-5.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const C = CODE.client.split('\n');
const CLIENT = C.slice(C.findIndex((l) => l.includes('export function oidcClient')), C.findIndex((l) => l.includes('async verifyIdToken'))).join('\n').replace(/^\s*\n/gm, '').trim() + '\n    // … verifyIdToken: the seven checks (lesson 8.4)\n  };\n}';

const NGUON_EN = [
  nguon('📜', 'RFC 9700 §4.2 — account linking and the email trap', 'Why linking federated identity by (unverified) email is an account-takeover vector (read 04/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9700.html'),
  nguon('🆔', 'OpenID Connect Core §2 — the sub claim', 'The stable, provider-local identifier you should link accounts on (read 04/11/2026).', 'https://openid.net/specs/openid-connect-core-1_0.html'),
].join('\n');
const NGUON_VI = [
  nguon('📜', 'RFC 9700 §4.2 — nối tài khoản và cái bẫy email', 'Vì sao nối danh tính liên kết theo email (chưa xác minh) là một hướng chiếm tài khoản (đọc 04/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9700.html'),
  nguon('🆔', 'OpenID Connect Core §2 — claim sub', 'Định danh ổn định, cục bộ-theo-provider mà bạn nên nối tài khoản theo (đọc 04/11/2026).', 'https://openid.net/specs/openid-connect-core-1_0.html'),
].join('\n');

export default {
  title: '8.5 — Being a client for real: linking, unlinking and the day Google is down|||8.5 — Làm client thật: nối, gỡ nối, và cái ngày Google sập',
  slug: 'auth-8-5-lam-client-that',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Luồng đường-thuận là phần dễ; một client thật phải nối một danh tính liên kết vào một tài khoản nội bộ, cho gỡ nối, và sống sót khi provider không với tới. Nối theo sub ỔN ĐỊNH của provider, KHÔNG theo email — nối theo email là cú chiếm kinh điển (provider không xác minh/cho đổi email ⇒ kẻ tấn công nhận tài khoản bằng cách đăng ký với địa chỉ của bạn); nếu buộc phải, đòi email_verified: true và coi thay đổi là một lần nối-lại cần xác nhận (như Chương 6). Luôn giữ một đường vào KHÔNG-qua-provider (mật khẩu nội bộ hoặc provider thứ hai) — danh tính một-nhà là một cú khoá chờ sẵn khi provider sập hoặc đóng tài khoản. Cho gỡ nối nhưng từ chối gỡ đường vào CUỐI. Sau khi xác minh id_token, client bắt đầu PHIÊN CỦA MÌNH (Chương 3) — token không phải phiên. Xin scope hẹp nhất. Theo RFC 9700 §4.2 + OIDC Core.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.5</span>
<h2>Being a client for real: linking, unlinking and the day Google is down</h2>
<p class="lead">8.2–8.4 made the flow correct. This lesson makes it survivable in production, where the hard parts are not the cryptography but the lifecycle: mapping a federated identity onto a local account without letting a stranger claim it, letting users unlink without locking themselves out, and staying usable the day the provider has an outage. These are where real "Sign in with…" integrations bleed users and get taken over.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> link a provider identity on the stable <code>sub</code> (not the email), keep a non-provider way in, refuse to unlink the last one, and start your own session after verifying rather than treating the ID token as one.</p>
</div>

<h3>Link on the sub, not the email</h3>
<p>After the ID token verifies (8.4), the client maps the user to a local account. Map on the provider's stable <code>sub</code> — a per-provider identifier that does not change.</p>
${ma('javascript', CLIENT)}
${ra(OUT['81-oidc-flow'])}
<p>The verified result carries <code>sub: usr_1</code> — that is the join key. The run also shows the client finishing by holding a verified identity; in a real app the very next step is to start its own session.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — "link by email".</strong> It is tempting: the provider gives you an email, you find the local account with that email, you link them. But if the provider does not verify the email, or lets a user change it, an attacker signs up at the provider with <em>your</em> address and is handed your local account. If you must link by email, require the provider's <code>email_verified: true</code> AND treat any later email change as a re-link that needs its own confirmation — an unverified federated email is a claim, exactly as in Chapter 6.</p>
</div>

<h3>Keep a way in that is not the provider</h3>
<p>If a user's only way into <em>your</em> product is "Sign in with X", then X's outage, X suspending their account, or X deprecating the integration locks them out of something that has nothing to do with X. Offer a local credential or a second provider, so identity is not single-homed. And when you unlink, refuse to remove the <em>last</em> way in: unlinking the only login is a self-inflicted lockout, so require a local password (or another linked provider) to exist first.</p>

<h3>The provider is down, and tokens are not sessions</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Fail gracefully on an outage</span><span class="v">A clear "try another method", not a stack trace; do not drop the user's half-finished work; and never fall back to a weaker check because the strong one timed out.</span></div>
  <div class="kv"><span class="k">Start your own session</span><span class="v">Once the ID token verifies, begin a Chapter-3 session. Do not re-call the provider per request, and do not store the ID token as the session — the federated login is a moment, your session is the state.</span></div>
  <div class="kv"><span class="k">Scope narrowly</span><span class="v">Request <code>openid email</code>, not every scope the provider offers. Over-asking scares users at consent and makes a client-token leak worse.</span></div>
  <div class="kv"><span class="k">Log out is local first</span><span class="v">Signing out of your app ends your session; it does not (and usually should not) sign the user out of the provider everywhere.</span></div>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"What do you link a federated account on?"</strong> — The provider's stable <code>sub</code>, not the email — and only on a verified email if you have no choice.</li>
<li><strong>"User can't log in because Google is down — design mistake?"</strong> — Yes, if that was their only method. Keep a local credential or a second provider; never single-home identity.</li>
<li><strong>"After the ID token verifies, then what?"</strong> — Start your own session (Chapter 3). The ID token is a one-time identity statement, not a session token.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo8/oidc-flow.mjs</code>. What identifier does the verified result give you to link the account on?</li>
<li>Design the "link by email" flow safely: what two conditions must hold before you link, and what must happen if the provider email later changes?</li>
<li>A user clicks "unlink Google" and Google is their only login. What should the client do, and why?</li>
</ol>
<p><strong>Solution:</strong> (1) <code>sub</code> (here <code>usr_1</code>) — the stable per-provider id. (2) the provider must assert <code>email_verified: true</code> AND the email must match a local account you otherwise trust; a later email change must trigger a fresh confirmation, not an automatic re-link. (3) refuse, and tell the user to set a local password or link a second provider first — unlinking the last way in is a lockout.</p>
<p><strong>Done when:</strong> you can explain why linking on email is dangerous and why identity must not be single-homed.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">account linking</span><span class="v">Mapping a provider identity to a local account, keyed on the stable <code>sub</code>.</span></div>
  <div class="kv"><span class="k"><code>sub</code> claim</span><span class="v">The provider-local, stable identifier for a user — the safe join key.</span></div>
  <div class="kv"><span class="k">email-linking takeover</span><span class="v">Claiming an account by registering its email at a provider that does not verify it.</span></div>
  <div class="kv"><span class="k">single-homed identity</span><span class="v">A user whose only way in is one provider — one outage from a lockout.</span></div>
  <div class="kv"><span class="k">unlink guard</span><span class="v">Refusing to remove the last remaining way into an account.</span></div>
  <div class="kv"><span class="k">scope minimisation</span><span class="v">Requesting only the scopes you need (<code>openid email</code>), not all on offer.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Link on the provider's stable <code>sub</code>, never on an unverified email.</li>
<li>If you must link by email, require <code>email_verified</code> and re-confirm on any change.</li>
<li>Keep a non-provider way in; refuse to unlink the last one — never single-home identity.</li>
<li>Fail gracefully when the provider is down; never fall back to a weaker check.</li>
<li>After the ID token verifies, start your own session — the token is a moment, not the state.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-6-3-dat-lai-mat-khau', title: 'Revisit Chapter 6 — lesson 6.3: password reset', sub: 'Keeping a non-provider way in means keeping a local credential — which means the reset flow from 6.3 still matters even in a "social login" product. Each stands on its own.', cta: 'OPEN LESSON 6.3 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.5</span>
<h2>Làm client thật: nối, gỡ nối, và cái ngày Google sập</h2>
<p class="lead">8.2–8.4 làm luồng đúng. Bài này làm nó sống được ở production, nơi phần khó không phải mật mã mà là vòng đời: ánh xạ một danh tính liên kết lên một tài khoản nội bộ mà không để một người lạ nhận nó, cho người dùng gỡ nối mà không tự khoá mình, và giữ dùng được cái ngày provider có sự cố. Đây là chỗ các tích hợp "Đăng nhập bằng…" thật chảy máu người dùng và bị chiếm.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> nối một danh tính provider theo <code>sub</code> ổn định (không theo email), giữ một đường vào không-qua-provider, từ chối gỡ cái cuối, và bắt đầu phiên của mình sau khi xác minh thay vì coi ID token là một phiên.</p>
</div>

<h3>Nối theo sub, không theo email</h3>
<p>Sau khi ID token xác minh (8.4), client ánh xạ người dùng lên một tài khoản nội bộ. Ánh xạ theo <code>sub</code> ổn định của provider — một định danh theo-provider không đổi.</p>
${ma('javascript', CLIENT)}
${ra(OUT['81-oidc-flow'])}
<p>Kết quả đã xác minh mang <code>sub: usr_1</code> — đó là khoá nối. Lượt chạy cũng cho thấy client kết thúc bằng việc giữ một danh tính đã xác minh; trong một app thật bước ngay sau là bắt đầu phiên của chính nó.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "nối theo email".</strong> Nó cám dỗ: provider cho bạn một email, bạn tìm tài khoản nội bộ có email đó, bạn nối chúng. Nhưng nếu provider không xác minh email, hay cho người dùng đổi nó, một kẻ tấn công đăng ký ở provider với <em>địa chỉ của bạn</em> và được trao tài khoản nội bộ của bạn. Nếu buộc phải nối theo email, đòi <code>email_verified: true</code> của provider VÀ coi bất kỳ thay đổi email về sau là một lần nối-lại cần xác nhận riêng — một email liên kết chưa xác minh là một lời khai, đúng như Chương 6.</p>
</div>

<h3>Giữ một đường vào không phải provider</h3>
<p>Nếu đường vào duy nhất của một người vào sản phẩm <em>của bạn</em> là "Đăng nhập bằng X", thì sự cố của X, X đình chỉ tài khoản họ, hay X bỏ tích hợp sẽ khoá họ khỏi một thứ chẳng liên quan gì tới X. Mời một tín vật nội bộ hoặc một provider thứ hai, để danh tính không một-nhà. Và khi gỡ nối, từ chối gỡ đường vào <em>cuối cùng</em>: gỡ đăng nhập duy nhất là tự khoá mình, nên đòi một mật khẩu nội bộ (hay một provider đã nối khác) tồn tại trước.</p>

<h3>Provider sập, và token không phải phiên</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hỏng cho duyên dáng khi sự cố</span><span class="v">Một "thử cách khác" rõ ràng, không phải một stack trace; đừng bỏ phần việc nửa chừng của người dùng; và không bao giờ lùi về một phép kiểm yếu hơn vì cái mạnh hết giờ.</span></div>
  <div class="kv"><span class="k">Bắt đầu phiên của mình</span><span class="v">Một khi ID token xác minh, bắt đầu một phiên Chương 3. Đừng gọi lại provider mỗi request, và đừng lưu ID token làm phiên — đăng nhập liên kết là một khoảnh khắc, phiên của bạn là trạng thái.</span></div>
  <div class="kv"><span class="k">Xin scope hẹp</span><span class="v">Xin <code>openid email</code>, không phải mọi scope provider mời. Xin quá đà làm người dùng sợ ở đồng ý và làm một vụ rò token-client tệ hơn.</span></div>
  <div class="kv"><span class="k">Đăng xuất là nội bộ trước</span><span class="v">Đăng xuất khỏi app của bạn kết thúc phiên của bạn; nó không (và thường không nên) đăng xuất người dùng khỏi provider mọi nơi.</span></div>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Bạn nối một tài khoản liên kết theo cái gì?"</strong> — Theo <code>sub</code> ổn định của provider, không theo email — và chỉ theo một email đã xác minh nếu không còn lựa chọn.</li>
<li><strong>"Người dùng không đăng nhập được vì Google sập — lỗi thiết kế?"</strong> — Có, nếu đó là cách duy nhất của họ. Giữ một tín vật nội bộ hoặc một provider thứ hai; không bao giờ một-nhà danh tính.</li>
<li><strong>"Sau khi ID token xác minh, rồi sao?"</strong> — Bắt đầu phiên của mình (Chương 3). ID token là một lời khai danh tính một lần, không phải một token phiên.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo8/oidc-flow.mjs</code>. Kết quả đã xác minh cho bạn định danh nào để nối tài khoản?</li>
<li>Thiết kế luồng "nối theo email" an toàn: hai điều kiện nào phải đúng trước khi nối, và gì phải xảy ra nếu email của provider sau đó đổi?</li>
<li>Một người dùng bấm "gỡ Google" và Google là đăng nhập duy nhất của họ. Client nên làm gì, và vì sao?</li>
</ol>
<p><strong>Lời giải:</strong> (1) <code>sub</code> (ở đây <code>usr_1</code>) — id ổn định theo-provider. (2) provider phải khẳng định <code>email_verified: true</code> VÀ email phải khớp một tài khoản nội bộ bạn vốn tin; một thay đổi email sau đó phải kích một xác nhận mới, không phải một lần nối-lại tự động. (3) từ chối, và bảo người dùng đặt một mật khẩu nội bộ hoặc nối một provider thứ hai trước — gỡ đường vào cuối là một cú khoá.</p>
<p><strong>Đạt khi:</strong> bạn giải thích được vì sao nối theo email nguy hiểm và vì sao danh tính không được một-nhà.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">account linking (nối tài khoản)</span><span class="v">Ánh xạ một danh tính provider lên một tài khoản nội bộ, khoá theo <code>sub</code> ổn định.</span></div>
  <div class="kv"><span class="k">claim <code>sub</code></span><span class="v">Định danh cục-bộ-theo-provider, ổn định cho một người dùng — khoá nối an toàn.</span></div>
  <div class="kv"><span class="k">email-linking takeover (chiếm qua nối-email)</span><span class="v">Nhận một tài khoản bằng cách đăng ký email của nó ở một provider không xác minh.</span></div>
  <div class="kv"><span class="k">single-homed identity (danh tính một-nhà)</span><span class="v">Một người dùng mà đường vào duy nhất là một provider — một sự cố khỏi bị khoá.</span></div>
  <div class="kv"><span class="k">unlink guard (chốt gỡ nối)</span><span class="v">Từ chối gỡ đường vào cuối cùng còn lại của một tài khoản.</span></div>
  <div class="kv"><span class="k">scope minimisation (tối thiểu scope)</span><span class="v">Chỉ xin các scope bạn cần (<code>openid email</code>), không phải tất cả.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Nối theo <code>sub</code> ổn định của provider, không bao giờ theo một email chưa xác minh.</li>
<li>Nếu buộc phải nối theo email, đòi <code>email_verified</code> và xác nhận lại khi có thay đổi.</li>
<li>Giữ một đường vào không-qua-provider; từ chối gỡ cái cuối — không bao giờ một-nhà danh tính.</li>
<li>Hỏng cho duyên dáng khi provider sập; không bao giờ lùi về một phép kiểm yếu hơn.</li>
<li>Sau khi ID token xác minh, bắt đầu phiên của mình — token là một khoảnh khắc, không phải trạng thái.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-6-3-dat-lai-mat-khau', title: 'Xem lại Chương 6 — bài 6.3: đặt lại mật khẩu', sub: 'Giữ một đường vào không-qua-provider nghĩa là giữ một tín vật nội bộ — nghĩa là luồng reset ở 6.3 vẫn quan trọng kể cả trong một sản phẩm "đăng nhập mạng xã hội". Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI 6.3 →' })}
</div>
`,
};
