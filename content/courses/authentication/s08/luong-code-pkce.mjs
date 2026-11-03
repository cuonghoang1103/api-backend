/**
 * Authentication · Chương 8 · 8.2 — Luồng authorization code kèm PKCE, từng bước một. Slug giữ: auth-8-2-luong-code-pkce.
 * Output thật (_ma.mjs, 81-oidc-flow): authorize→code (state echoed)→token→id_token verified; code + verifier SAI ⇒ invalid_grant.
 */
import G from '../giang/auth-08-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const P = CODE.provider.split('\n');
const AUTHORIZE = P.slice(P.findIndex((l) => l.includes('authorize(client, p, userId)')), P.findIndex((l) => l.includes('async token('))).join('\n').replace(/^\s*\n/gm, '').trim();
const TOKEN = P.slice(P.findIndex((l) => l.includes('async token(')), P.findIndex((l) => l.includes('return { access_token'))+1).join('\n').replace(/^\s*\n/gm, '').trim();
const C = CODE.client.split('\n');
const BEGIN = C.slice(C.findIndex((l) => l.includes('begin(scope')), C.findIndex((l) => l.includes('verifyIdToken'))).join('\n').replace(/^\s*\n/gm, '').trim();

const NGUON_EN = [
  nguon('📜', 'RFC 7636 — Proof Key for Code Exchange (PKCE)', 'The verifier/challenge mechanism this lesson builds, and the stolen-code attack it closes (read 04/11/2026).', 'https://www.rfc-editor.org/rfc/rfc7636'),
  nguon('📜', 'RFC 9700 §2.1 — authorization code + PKCE for all clients', 'Why every client, not just mobile, now uses PKCE (read 04/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9700.html'),
].join('\n');
const NGUON_VI = [
  nguon('📜', 'RFC 7636 — Proof Key for Code Exchange (PKCE)', 'Cơ chế verifier/challenge bài này dựng, và cú tấn công trộm-code nó đóng (đọc 04/11/2026).', 'https://www.rfc-editor.org/rfc/rfc7636'),
  nguon('📜', 'RFC 9700 §2.1 — authorization code + PKCE cho mọi client', 'Vì sao mọi client, không chỉ di động, nay dùng PKCE (đọc 04/11/2026).', 'https://www.rfc-editor.org/rfc/rfc9700.html'),
].join('\n');

export default {
  title: '8.2 — The authorization code flow with PKCE, step by step|||8.2 — Luồng authorization code kèm PKCE, từng bước một',
  slug: 'auth-8-2-luong-code-pkce',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Luồng duy nhất OAuth 2.1 giữ, mổ từng bước trên LabFlow ID v0.8. Client tạo một code_verifier ngẫu nhiên, băm thành code_challenge (S256), gửi CHỈ challenge trong URL authorize (verifier không rời client). Người dùng (đã đăng nhập ở provider — phiên Chương 3) uỷ quyền; provider đúc một code MỘT LẦN, 60 giây, gắn với client + redirect_uri + challenge, rồi 302 về redirect_uri?code&state. Client đổi code + verifier ở /oauth/token (máy-chủ-với-máy-chủ); provider băm verifier và so với challenge đã lưu — bằng chứng chính client đã bắt đầu luồng. PKCE đóng cú trộm-code: demo8 cho thấy code + verifier SAI ⇒ invalid_grant. Theo RFC 7636 + RFC 9700.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>The authorization code flow with PKCE, step by step</h2>
<p class="lead">This is the one flow OAuth 2.1 keeps, and the shape of every "Sign in with…" you will ever build. It has three moves: the user authorizes at the provider, a short code comes back in the browser, and the client swaps that code for tokens in a back-channel call — proving, with PKCE, that it is the same client that started the flow. Get these three straight and OAuth stops being folklore.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> trace each step and say who holds what; explain PKCE as a one-time secret the client keeps, and the stolen-code attack it closes; and say why the code is short-lived and single-use.</p>
</div>

<h3>Begin: a verifier and its challenge</h3>
<p>Before anything leaves the client, it mints a random <code>code_verifier</code>, hashes it to a <code>code_challenge</code> (SHA-256, "S256"), and will send only the <em>challenge</em> in the authorize URL — alongside <code>state</code> and <code>nonce</code> (lesson 8.3). The verifier stays on the client; it is the secret that proves, at the end, that this is the same client.</p>
${ma('javascript', BEGIN)}

<h3>Authorize: the user approves, at the provider</h3>
<p>The browser goes to <code>/oauth/authorize</code> with the client id, <code>redirect_uri</code>, scope, state, nonce and challenge. The user must already be signed in at LabFlow ID — a Chapter 3 session — and <em>that</em> session, not anything the client sent, is whose identity the tokens will carry. The provider mints a one-time code bound to this client, this exact <code>redirect_uri</code> and this challenge, then redirects back.</p>
${ma('javascript', AUTHORIZE)}
${ra(OUT['81-oidc-flow'])}
<p>The measured run (step 2) shows the code coming back with the <code>state</code> echoed unchanged, then the token exchange yielding an ID token that verifies to <code>{ ok, sub: usr_1, email }</code>. The code travels in the URL — and that is fine, because without the verifier it cannot be spent.</p>

<h3>Token: swap the code and verifier for tokens</h3>
<p>The client POSTs the code <em>and</em> the <code>code_verifier</code> to <code>/oauth/token</code>, server-to-server. The provider re-checks everything — same client, same <code>redirect_uri</code>, not expired, not already used — and hashes the verifier to confirm it equals the stored challenge. Only then does it issue the access token and the signed ID token.</p>
${ma('javascript', TOKEN)}

<h3>PKCE closes the stolen-code attack</h3>
<div class="pitfall co-tieu-de">
<p><strong>Trap — the code alone is enough (it is not, with PKCE).</strong> The code rides back through the browser, where a malicious app on the device, a logged URL, or a crafted redirect could intercept it. Without PKCE, whoever holds the code can redeem it. With PKCE, redemption requires the <code>code_verifier</code> the attacker never saw — the demo shows a code presented with a <em>wrong</em> verifier returning <code>{ "error": "invalid_grant" }</code>. And the code is single-use and lives 60 seconds, so even the right verifier cannot replay a spent code.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"What does PKCE actually prove?"</strong> — That the client redeeming the code is the same one that started the flow, because only it holds the verifier that hashes to the challenge.</li>
<li><strong>"Why is it safe for the code to be in the URL?"</strong> — The code is useless without the verifier (and is single-use, 60s). The tokens are never in the URL.</li>
<li><strong>"Does a server-side web app need PKCE?"</strong> — Yes — OAuth 2.1 requires it for all clients; it is cheap and closes the interception attack regardless of client type.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo8/oidc-flow.mjs</code>. Follow step 2: where is the code returned, and what is verified at the end?</li>
<li>In step 3, a code is presented with a wrong verifier. What error comes back, and which stored value did it fail against?</li>
<li>Redeem a code twice (the grader/provider deletes it on first use). Why is a replayed code rejected even with the correct verifier?</li>
</ol>
<p><strong>Solution:</strong> (1) the code is in the redirect URL back to the client; the ID token is verified with the seven checks at the end. (2) <code>invalid_grant</code> — the SHA-256 of the presented verifier did not equal the stored <code>code_challenge</code>. (3) the provider deletes the code on redemption, so the second attempt finds nothing — single-use.</p>
<p><strong>Done when:</strong> you can narrate the three moves and say exactly what PKCE binds together.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">authorization code flow</span><span class="v">The OAuth 2.1 flow: authorize → code → back-channel token exchange.</span></div>
  <div class="kv"><span class="k">PKCE</span><span class="v">A one-time verifier the client keeps; its hash (the challenge) is sent up front and checked at redemption.</span></div>
  <div class="kv"><span class="k">code_verifier / code_challenge</span><span class="v">The secret and its SHA-256 (S256); <code>challenge = base64url(sha256(verifier))</code>.</span></div>
  <div class="kv"><span class="k">authorization code</span><span class="v">A short-lived (60s), single-use token returned in the browser, redeemed for tokens.</span></div>
  <div class="kv"><span class="k">back-channel</span><span class="v">The server-to-server token request, where the verifier and tokens travel, never the browser.</span></div>
  <div class="kv"><span class="k">consent / authorize</span><span class="v">The step where the signed-in user approves the client's requested scopes.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Begin with a verifier and its challenge; send only the challenge in the authorize request.</li>
<li>The user authorizes at the provider; the provider's session decides whose identity the tokens carry.</li>
<li>A one-time, 60-second code comes back in the browser; tokens never do.</li>
<li>The client swaps code + verifier back-channel; the provider checks the verifier hashes to the challenge.</li>
<li>PKCE binds the code to the client that started the flow — a stolen code without the verifier is <code>invalid_grant</code>.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-3-4-csrf', title: 'Revisit Chapter 3 — lesson 3.4: CSRF and the Origin', sub: 'The authorize request rides the user’s provider session; state (8.3) defends the callback the same way a CSRF token defends a form. Each stands on its own.', cta: 'OPEN LESSON 3.4 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Luồng authorization code kèm PKCE, từng bước một</h2>
<p class="lead">Đây là luồng duy nhất OAuth 2.1 giữ, và là hình dạng của mọi "Đăng nhập bằng…" bạn sẽ từng dựng. Nó có ba nước: người dùng uỷ quyền ở provider, một code ngắn trở về trong trình duyệt, và client đổi code đó lấy token trong một lời gọi kênh-sau — chứng minh, bằng PKCE, rằng đó chính là client đã bắt đầu luồng. Nắm rõ ba nước này và OAuth hết là chuyện truyền miệng.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> lần từng bước và nói ai giữ gì; giải thích PKCE là một bí mật một lần client giữ, và cú tấn công trộm-code nó đóng; và nói vì sao code ngắn hạn và dùng một lần.</p>
</div>

<h3>Begin: một verifier và challenge của nó</h3>
<p>Trước khi bất cứ gì rời client, nó đúc một <code>code_verifier</code> ngẫu nhiên, băm thành một <code>code_challenge</code> (SHA-256, "S256"), và sẽ chỉ gửi <em>challenge</em> trong URL authorize — cùng <code>state</code> và <code>nonce</code> (bài 8.3). Verifier ở lại client; nó là bí mật chứng minh, ở cuối, rằng đây là cùng một client.</p>
${ma('javascript', BEGIN)}

<h3>Authorize: người dùng duyệt, ở provider</h3>
<p>Trình duyệt tới <code>/oauth/authorize</code> với client id, <code>redirect_uri</code>, scope, state, nonce và challenge. Người dùng phải đã đăng nhập ở LabFlow ID — một phiên Chương 3 — và <em>chính</em> phiên đó, không phải thứ client gửi, là danh tính mà token mang. Provider đúc một code một lần gắn với client này, <code>redirect_uri</code> chính xác này và challenge này, rồi redirect về.</p>
${ma('javascript', AUTHORIZE)}
${ra(OUT['81-oidc-flow'])}
<p>Lượt chạy đo được (bước 2) cho thấy code trở về với <code>state</code> dội lại nguyên vẹn, rồi đổi token cho ra một ID token verify thành <code>{ ok, sub: usr_1, email }</code>. Code đi trong URL — và ổn, vì thiếu verifier thì không tiêu được.</p>

<h3>Token: đổi code và verifier lấy token</h3>
<p>Client POST code <em>và</em> <code>code_verifier</code> tới <code>/oauth/token</code>, máy-chủ-với-máy-chủ. Provider kiểm lại mọi thứ — cùng client, cùng <code>redirect_uri</code>, chưa hết hạn, chưa dùng — và băm verifier để xác nhận nó bằng challenge đã lưu. Chỉ khi đó nó mới phát access token và ID token đã ký.</p>
${ma('javascript', TOKEN)}

<h3>PKCE đóng cú trộm-code</h3>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — chỉ cần code là đủ (không, khi có PKCE).</strong> Code đi về qua trình duyệt, nơi một app độc trên thiết bị, một URL bị log, hay một redirect dàn dựng có thể chặn bắt nó. Không PKCE, ai giữ code đổi được nó. Với PKCE, đổi cần <code>code_verifier</code> mà kẻ tấn công không bao giờ thấy — demo cho thấy một code nộp với một verifier <em>sai</em> trả về <code>{ "error": "invalid_grant" }</code>. Và code dùng một lần và sống 60 giây, nên kể cả verifier đúng cũng không phát lại được một code đã tiêu.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"PKCE thực sự chứng minh gì?"</strong> — Rằng client đang đổi code là cùng cái đã bắt đầu luồng, vì chỉ nó giữ verifier băm ra challenge.</li>
<li><strong>"Vì sao code nằm trong URL mà vẫn an toàn?"</strong> — Code vô dụng nếu thiếu verifier (và dùng một lần, 60s). Token không bao giờ trong URL.</li>
<li><strong>"Một web app phía máy chủ có cần PKCE không?"</strong> — Có — OAuth 2.1 đòi nó cho mọi client; nó rẻ và đóng cú chặn bắt bất kể loại client.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo8/oidc-flow.mjs</code>. Theo bước 2: code trả về đâu, và cái gì được xác minh ở cuối?</li>
<li>Ở bước 3, một code được nộp với một verifier sai. Lỗi gì trả về, và nó thất bại khi so với giá trị lưu nào?</li>
<li>Đổi một code hai lần (máy chấm/provider xoá nó ở lần đầu). Vì sao một code phát lại bị từ chối kể cả với verifier đúng?</li>
</ol>
<p><strong>Lời giải:</strong> (1) code nằm trong URL redirect về client; ID token được xác minh với bảy phép kiểm ở cuối. (2) <code>invalid_grant</code> — SHA-256 của verifier nộp không bằng <code>code_challenge</code> đã lưu. (3) provider xoá code khi đổi, nên lần thử thứ hai không thấy gì — dùng một lần.</p>
<p><strong>Đạt khi:</strong> bạn thuật được ba nước và nói đúng PKCE gắn những gì với nhau.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">authorization code flow (luồng mã uỷ quyền)</span><span class="v">Luồng OAuth 2.1: authorize → code → đổi token kênh-sau.</span></div>
  <div class="kv"><span class="k">PKCE</span><span class="v">Một verifier một lần client giữ; băm của nó (challenge) gửi trước và kiểm khi đổi.</span></div>
  <div class="kv"><span class="k">code_verifier / code_challenge</span><span class="v">Bí mật và SHA-256 của nó (S256); <code>challenge = base64url(sha256(verifier))</code>.</span></div>
  <div class="kv"><span class="k">authorization code (mã uỷ quyền)</span><span class="v">Một token ngắn hạn (60s), dùng một lần, trả trong trình duyệt, đổi lấy token.</span></div>
  <div class="kv"><span class="k">back-channel (kênh sau)</span><span class="v">Lời gọi token máy-chủ-với-máy-chủ, nơi verifier và token đi, không bao giờ qua trình duyệt.</span></div>
  <div class="kv"><span class="k">consent / authorize (đồng ý / uỷ quyền)</span><span class="v">Bước người dùng đã đăng nhập duyệt các scope client xin.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bắt đầu bằng một verifier và challenge của nó; chỉ gửi challenge trong yêu cầu authorize.</li>
<li>Người dùng uỷ quyền ở provider; phiên của provider quyết định token mang danh tính của ai.</li>
<li>Một code một lần, 60 giây trở về trong trình duyệt; token không bao giờ.</li>
<li>Client đổi code + verifier kênh-sau; provider kiểm verifier băm ra challenge.</li>
<li>PKCE gắn code với client đã bắt đầu luồng — một code bị trộm thiếu verifier là <code>invalid_grant</code>.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-3-4-csrf', title: 'Xem lại Chương 3 — bài 3.4: CSRF và Origin', sub: 'Yêu cầu authorize đi nhờ phiên provider của người dùng; state (8.3) phòng callback đúng cách một token CSRF phòng một form. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI 3.4 →' })}
</div>
`,
};
