/**
 * Authentication · Chương 11 · 11.2 — Xoay một cái khoá mà không đá tất cả mọi người ra ngoài. Slug giữ: auth-11-2-xoay-khoa.
 * Code THẬT từ _ma.mjs (src/ops/rotation.js) + output demo11/rotate.mjs (LabFlow ID v0.11).
 */
import G from '../giang/auth-11-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const NGUON_EN = [
  nguon('🔑', 'NIST SP 800-57 Part 1 Rev. 5 — Recommendation for Key Management', 'Cryptoperiods and key rollover — why and when keys rotate (read 04/11/2026).', 'https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final'),
  nguon('🔐', 'OWASP — Secrets Management Cheat Sheet', 'Rotation practice, including overlap windows for signing keys (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html'),
].join('\n');
const NGUON_VI = [
  nguon('🔑', 'NIST SP 800-57 Part 1 Rev. 5 — Khuyến nghị Quản lý khoá', 'Cryptoperiod và luân chuyển khoá — vì sao và khi nào khoá xoay (đọc 04/11/2026).', 'https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final'),
  nguon('🔐', 'OWASP — Secrets Management Cheat Sheet', 'Thực hành xoay, gồm cửa sổ chồng lấn cho khoá ký (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html'),
].join('\n');

export default {
  title: '11.2 — Rotating a key without logging everyone out|||11.2 — Xoay một cái khoá mà không đá tất cả mọi người ra ngoài',
  slug: 'auth-11-2-xoay-khoa',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Mọi khoá ký xoay theo lịch, và NGAY nếu rò. Xoay ngây thơ (tráo khoá + khởi động lại) vô hiệu mọi token ký bằng khoá cũ cùng lúc ⇒ đá mọi người dùng ra. Nghệ thuật: một CỬA SỔ CHỒNG LẤN — CẢ HAI khoá sống, khoá mới KÝ token mới, khoá cũ vẫn XÁC MINH token đã ở ngoài tới khi chúng hết hạn, rồi mới cho nghỉ. kid trong header (Chương 4) để mỗi token nói khoá nào ký nó ⇒ keyring xác minh cả cũ và mới. Ba pha: introduce (thêm vào JWKS, vẫn ký bằng cũ để client học khoá mới trước ⇒ không bị từ chối kid-lạ), activate (chuyển ký sang mới), retire (bỏ cũ sau khi token của nó hết hạn). Cửa sổ ≥ vòng đời token cũ (access 15 phút ⇒ 15 phút). Đo thật: token đúc dưới k1 vẫn xác minh qua introduce+activate (không ai bị đá), ngừng chỉ sau retire. Rò ⇒ xoay ngay + có thể thu hồi. Mẫu hai-bản-sống tổng quát cho mọi secret ký. Theo NIST SP 800-57 + OWASP.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>Rotating a key without logging everyone out</h2>
<p class="lead">Every signing key is rotated on a schedule, and immediately if it leaks. The obvious way — swap the key and restart — invalidates every token signed with the old key at once, logging out every single user. The real skill is rotating with no mass logout and no gap, and it comes down to one idea: an overlap.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> rotate a signing key in three phases with both keys live during the overlap; explain why <code>kid</code> makes side-by-side verification possible; and size the overlap to the token lifetime.</p>
</div>

<h3>The trick: an overlap</h3>
<p>For a window, <em>both</em> keys are live. The new key signs new tokens; the old key still <em>verifies</em> the tokens already in the wild. Only after every token the old key signed has expired do you retire it. The rotation module is three small functions over a keyring:</p>
${ma('javascript', CODE.rotation)}
<p>A ring is <code>{ active, live }</code>: <code>active</code> is the kid that signs, <code>live</code> is the list of kids that may still verify. <code>rotate(ring, phase, newKid)</code> advances one phase at a time.</p>

<h3>kid makes it possible</h3>
<p>Every token carries a <code>kid</code> (key id, Chapter 4) in its header. The verifier reads the <code>kid</code> and picks the matching key from the keyring. With two keys in the ring, a token says which one signed it — so the old and the new can be verified side by side, no guessing.</p>

<h3>Three phases, and why introduce comes first</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Introduce</span><span class="lz-lnote">Add the new key to the ring and publish it in JWKS, but keep <em>signing</em> with the old one — so every JWKS client fetches and learns the new key before it ever sees a token signed with it.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Activate</span><span class="lz-lnote">Switch signing to the new key. The old key stays live for verify during the overlap.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Retire</span><span class="lz-lnote">Drop the old key — only after its tokens have expired, so retiring it logs out nobody.</span></div>
</div>
<p>Introduce before activate matters: a client that verifies via JWKS must have fetched the new key before it sees a token signed with it, or it rejects an "unknown kid". Introducing first gives every client time to learn it.</p>

<h3>The measured rotation</h3>
<p>The demo rotates <code>k1 → k2</code> and tracks a token already in the wild (signed under <code>k1</code>):</p>
${ra(OUT['112-rotate'])}
<p>The in-the-wild token verifies through introduce and activate — nobody is logged out — and stops verifying only after retire, by which time its own 15-minute expiry had already passed. A clean rotation with zero user impact.</p>

<h3>How long is the overlap</h3>
<p>The overlap must be at least the maximum lifetime of a token signed by the old key — for 15-minute access tokens (Chapter 5), 15 minutes. Retire the old key sooner and you log out whoever still holds a valid old token; retire it later is only harmless extra caution. On a <em>suspected leak</em> you rotate immediately and may also <em>revoke</em> the old key's tokens (a shorter overlap, accepting some logouts) — the risk of a stolen key outweighs the inconvenience.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — rotating by restart with one key.</strong> "We rolled the signing key last night" too often means the key was swapped and the service restarted, logging out every user and breaking every in-flight token. Rotation is a <em>process</em> — introduce, activate, retire — not a swap. The same two-live-versions pattern applies to session secrets, cookie secrets and encryption keys.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"How do you rotate a JWT signing key without logging everyone out?"</strong> — Keep both keys live during an overlap: sign with the new one, verify with both, retire the old one after its tokens expire. <code>kid</code> selects the key.</li>
<li><strong>"Why publish the new key before signing with it?"</strong> — So JWKS clients fetch it first; otherwise they reject a token with an unknown <code>kid</code>.</li>
<li><strong>"A key leaked — routine rotation or something else?"</strong> — Rotate now, and consider revoking the old key's tokens (a short overlap), accepting some logouts because a stolen key is worse.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo11/rotate.mjs</code>. At which phase does the in-the-wild <code>k1</code> token stop verifying, and why is that safe?</li>
<li>Why must "introduce" (publish in JWKS) come before "activate" (sign with the new key)?</li>
<li>For 15-minute access tokens, what is the minimum overlap before you may retire the old key?</li>
</ol>
<p><strong>Solution:</strong> (1) only at <em>retire</em> — and by then its own 15-minute expiry had passed, so no live token was invalidated. (2) a JWKS client must have fetched the new key before it sees a token signed with it, or it rejects the unknown <code>kid</code>; introducing first gives it time. (3) 15 minutes — at least the maximum lifetime of a token the old key signed.</p>
<p><strong>Done when:</strong> you can rotate in three phases with both keys live, and size the overlap to the token lifetime.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">key rotation</span><span class="v">Replacing a signing key on a schedule or after a leak.</span></div>
  <div class="kv"><span class="k">overlap window</span><span class="v">The period when both the old and new key are live (sign new, verify both).</span></div>
  <div class="kv"><span class="k"><code>kid</code></span><span class="v">The key id in a token header that selects which key verifies it (Chapter 4).</span></div>
  <div class="kv"><span class="k">introduce / activate / retire</span><span class="v">The three rotation phases; introduce (JWKS) before activate (sign).</span></div>
  <div class="kv"><span class="k">cryptoperiod</span><span class="v">The time a key is allowed to be used before rotation (NIST SP 800-57).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Rotate with an overlap: two keys live, the new one signs, the old one still verifies until its tokens expire.</li>
<li><code>kid</code> lets a token say which key signed it, so old and new verify side by side.</li>
<li>Introduce (publish in JWKS) before activate (sign), so JWKS clients learn the key first.</li>
<li>Size the overlap to the token lifetime; retire the old key only after its tokens expire.</li>
<li>On a leak, rotate now and consider revoking the old key's tokens. The pattern is general.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-4-4-khoa-va-jwks', title: 'Back to 4.4 — keys, kid and JWKS', sub: 'There, building the keyring and JWKS, and the kid in a token header that selects its key. Here, that exact kid is what lets you keep two keys live and rotate with no mass logout. One mechanism, two chapters.', cta: 'OPEN LESSON 4.4 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Xoay một cái khoá mà không đá tất cả mọi người ra ngoài</h2>
<p class="lead">Mọi khoá ký được xoay theo lịch, và ngay lập tức nếu nó rò. Cách hiển nhiên — tráo khoá và khởi động lại — vô hiệu mọi token ký bằng khoá cũ cùng một lúc, đá mọi người dùng ra. Kỹ năng thật là xoay mà không đá hàng loạt và không có khoảng trống, và nó quy về một ý tưởng: một cửa sổ chồng lấn.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> xoay một khoá ký trong ba pha với cả hai khoá sống trong cửa sổ chồng lấn; giải thích vì sao <code>kid</code> làm xác minh song song khả thi; và cân cửa sổ cho ngang vòng đời token.</p>
</div>

<h3>Mẹo: một cửa sổ chồng lấn</h3>
<p>Trong một cửa sổ, <em>cả hai</em> khoá đều sống. Khoá mới ký token mới; khoá cũ vẫn <em>xác minh</em> các token đã ở ngoài. Chỉ sau khi mọi token khoá cũ ký đã hết hạn bạn mới cho nó nghỉ. Module xoay là ba hàm nhỏ trên một keyring:</p>
${ma('javascript', CODE.rotation)}
<p>Một ring là <code>{ active, live }</code>: <code>active</code> là kid ký, <code>live</code> là danh sách kid còn xác minh được. <code>rotate(ring, phase, newKid)</code> tiến một pha một lần.</p>

<h3>kid làm nó khả thi</h3>
<p>Mỗi token mang một <code>kid</code> (id khoá, Chương 4) trong header. Bộ xác minh đọc <code>kid</code> và chọn khoá khớp từ keyring. Với hai khoá trong ring, một token nói cái nào ký nó — nên cũ và mới xác minh được song song, không đoán.</p>

<h3>Ba pha, và vì sao introduce tới trước</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Introduce (giới thiệu)</span><span class="lz-lnote">Thêm khoá mới vào ring và công bố nó trong JWKS, nhưng vẫn <em>ký</em> bằng khoá cũ — để mọi client JWKS lấy và học khoá mới trước khi nó từng thấy một token ký bằng nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Activate (kích hoạt)</span><span class="lz-lnote">Chuyển ký sang khoá mới. Khoá cũ vẫn sống để xác minh trong cửa sổ.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Retire (cho nghỉ)</span><span class="lz-lnote">Bỏ khoá cũ — chỉ sau khi token của nó hết hạn, nên cho nó nghỉ không đá ai ra.</span></div>
</div>
<p>Introduce trước activate quan trọng: một client xác minh qua JWKS phải đã lấy khoá mới trước khi thấy một token ký bằng nó, nếu không nó từ chối một "kid lạ". Giới thiệu trước cho mọi client thời gian học nó.</p>

<h3>Lần xoay đo thật</h3>
<p>Demo xoay <code>k1 → k2</code> và theo dõi một token đã ở ngoài (ký dưới <code>k1</code>):</p>
${ra(OUT['112-rotate'])}
<p>Token đã ở ngoài xác minh qua introduce và activate — không ai bị đá ra — và ngừng xác minh chỉ sau retire, mà lúc đó hạn 15 phút của chính nó đã qua. Một lần xoay sạch không ảnh hưởng người dùng.</p>

<h3>Cửa sổ dài bao lâu</h3>
<p>Cửa sổ phải ít nhất bằng vòng đời tối đa của một token ký bằng khoá cũ — với access token 15 phút (Chương 5), là 15 phút. Cho khoá cũ nghỉ sớm hơn là bạn đá ra bất kỳ ai còn giữ một token cũ hợp lệ; nghỉ muộn hơn chỉ là sự cẩn thận thêm vô hại. Khi <em>nghi rò</em> bạn xoay ngay và cũng có thể <em>thu hồi</em> token của khoá cũ (một cửa sổ ngắn hơn, chấp nhận vài lần đá ra) — rủi ro một khoá bị trộm lớn hơn sự bất tiện.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — xoay bằng khởi động lại với một khoá.</strong> "Chúng tôi xoay khoá ký tối qua" quá thường nghĩa là khoá được tráo và dịch vụ khởi động lại, đá mọi người dùng ra và làm hỏng mọi token đang bay. Xoay là một <em>quy trình</em> — introduce, activate, retire — không phải một cú tráo. Cùng mẫu hai-bản-sống áp cho session secret, cookie secret và khoá mã hoá.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Bạn xoay một khoá ký JWT mà không đá mọi người ra sao?"</strong> — Giữ cả hai khoá sống trong một cửa sổ: ký bằng cái mới, xác minh bằng cả hai, cho cái cũ nghỉ sau khi token của nó hết hạn. <code>kid</code> chọn khoá.</li>
<li><strong>"Vì sao công bố khoá mới trước khi ký bằng nó?"</strong> — Để client JWKS lấy nó trước; nếu không chúng từ chối một token với một <code>kid</code> lạ.</li>
<li><strong>"Một khoá rò — xoay thường lệ hay gì khác?"</strong> — Xoay ngay, và cân nhắc thu hồi token của khoá cũ (một cửa sổ ngắn), chấp nhận vài lần đá ra vì một khoá bị trộm thì tệ hơn.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo11/rotate.mjs</code>. Ở pha nào token <code>k1</code> đã-ở-ngoài ngừng xác minh, và vì sao điều đó an toàn?</li>
<li>Vì sao "introduce" (công bố trong JWKS) phải tới trước "activate" (ký bằng khoá mới)?</li>
<li>Với access token 15 phút, cửa sổ tối thiểu trước khi bạn được cho khoá cũ nghỉ là bao nhiêu?</li>
</ol>
<p><strong>Lời giải:</strong> (1) chỉ ở <em>retire</em> — và tới lúc đó hạn 15 phút của chính nó đã qua, nên không token sống nào bị vô hiệu. (2) một client JWKS phải đã lấy khoá mới trước khi thấy một token ký bằng nó, nếu không nó từ chối <code>kid</code> lạ; giới thiệu trước cho nó thời gian. (3) 15 phút — ít nhất bằng vòng đời tối đa của một token khoá cũ ký.</p>
<p><strong>Đạt khi:</strong> bạn xoay được trong ba pha với cả hai khoá sống, và cân cửa sổ cho ngang vòng đời token.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">key rotation (xoay khoá)</span><span class="v">Thay một khoá ký theo lịch hoặc sau một vụ rò.</span></div>
  <div class="kv"><span class="k">overlap window (cửa sổ chồng lấn)</span><span class="v">Khoảng khi cả khoá cũ và mới đều sống (ký mới, xác minh cả hai).</span></div>
  <div class="kv"><span class="k"><code>kid</code></span><span class="v">Id khoá trong header một token, chọn khoá nào xác minh nó (Chương 4).</span></div>
  <div class="kv"><span class="k">introduce / activate / retire</span><span class="v">Ba pha xoay; introduce (JWKS) trước activate (ký).</span></div>
  <div class="kv"><span class="k">cryptoperiod</span><span class="v">Thời gian một khoá được phép dùng trước khi xoay (NIST SP 800-57).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Xoay với một cửa sổ: hai khoá sống, cái mới ký, cái cũ vẫn xác minh tới khi token của nó hết hạn.</li>
<li><code>kid</code> để một token nói khoá nào ký nó, nên cũ và mới xác minh song song.</li>
<li>Introduce (công bố trong JWKS) trước activate (ký), để client JWKS học khoá trước.</li>
<li>Cân cửa sổ cho ngang vòng đời token; cho khoá cũ nghỉ chỉ sau khi token của nó hết hạn.</li>
<li>Khi rò, xoay ngay và cân nhắc thu hồi token của khoá cũ. Mẫu này tổng quát.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-4-4-khoa-va-jwks', title: 'Quay lại 4.4 — khoá, kid và JWKS', sub: 'Ở đó, dựng keyring và JWKS, và cái kid trong header một token chọn khoá của nó. Ở đây, đúng cái kid đó là thứ để bạn giữ hai khoá sống và xoay không đá hàng loạt. Một cơ chế, hai chương.', cta: 'MỞ BÀI 4.4 →' })}
</div>
`,
};
