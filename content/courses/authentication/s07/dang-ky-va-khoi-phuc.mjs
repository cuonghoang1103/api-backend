/**
 * Authentication · Chương 7 · 7.3 — Đăng ký một yếu tố, và cái đường khôi phục bạn CHẮC CHẮN sẽ cần. Slug giữ: auth-7-3-dang-ky-va-khoi-phuc.
 * Output thật (_ma.mjs): 73-totp-enroll (begin → confirm → step-up code → recovery → reuse fails); 72-recovery (single-use).
 */
import G from '../giang/auth-07-3.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const SV = CODE.server07.split('\n');
const ENROLL = SV.slice(SV.findIndex((l) => l.includes('lesson 7.3: enroll TOTP')), SV.findIndex((l) => l.includes('lesson 7.1/7.3: the step-up'))).join('\n').trim();
const RV = CODE.recovery.split('\n');
const RECGEN = RV.slice(RV.findIndex((l) => l.includes('export function generateRecoveryCodes')), RV.findIndex((l) => l.includes('export function consumeRecoveryCode'))).join('\n').trim();

const NGUON_EN = [
  nguon('🦉', 'OWASP — Multifactor Authentication Cheat Sheet (recovery)', 'Why every account needs a recovery path, and why recovery codes the user holds offline beat an SMS/email reset (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html'),
  nguon('🏛️', 'NIST SP 800-63B §5.1.1 — look-up secrets (recovery codes)', 'Recovery codes as "look-up secrets": high-entropy, one-time, stored hashed (read 04/11/2026).', 'https://pages.nist.gov/800-63-3/sp800-63b.html'),
].join('\n');
const NGUON_VI = [
  nguon('🦉', 'OWASP — Multifactor Authentication Cheat Sheet (khôi phục)', 'Vì sao mọi tài khoản cần một đường khôi phục, và vì sao mã khôi phục người dùng giữ ngoại tuyến thắng một lần reset qua SMS/email (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html'),
  nguon('🏛️', 'NIST SP 800-63B §5.1.1 — look-up secrets (mã khôi phục)', 'Mã khôi phục như "look-up secrets": entropy cao, một lần, lưu dạng băm (đọc 04/11/2026).', 'https://pages.nist.gov/800-63-3/sp800-63b.html'),
].join('\n');

export default {
  title: '7.3 — Enrolling a factor, and the recovery you will actually need|||7.3 — Đăng ký một yếu tố, và cái đường khôi phục bạn CHẮC CHẮN sẽ cần',
  slug: 'auth-7-3-dang-ky-va-khoi-phuc',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Bật một yếu tố thứ hai là hai bước người ta thường làm sai. Thứ nhất: lưu bí mật TOTP là CHƯA XÁC NHẬN, hiện QR (otpauth:// URI), rồi đòi một mã đúng trước khi đánh dấu bật — bỏ bước này và một người quét nhầm tự khoá mình lần đăng nhập kế. Thứ hai: phát mã khôi phục — mười mã entropy cao, hiện MỘT LẦN, chỉ lưu dạng digest SHA-256 (như mọi tín vật, 1.3), dùng một lần. LabFlow ID v0.7 đo thật: enroll begin → confirm (với mã hiện tại) → { enabled } + 10 mã khôi phục; step-up nhận mã HOẶC mã khôi phục; mã khôi phục dùng lại trả BAD_CODE. Mỗi đường khôi phục là một cửa trước mới (Chương 6) — mã người dùng giữ ngoại tuyến tốt hơn một link reset qua kênh yếu; cách sửa thật cho mất-yếu-tố là một yếu tố thứ hai (passkey/khoá dự phòng). Theo OWASP + NIST SP 800-63B.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Enrolling a factor, and the recovery you will actually need</h2>
<p class="lead">7.2 built the code; this lesson turns it on for a real user. Enrollment is two steps teams routinely get wrong, and each one, skipped, produces a support queue: confirm the factor works before you trust it, and hand the user a way back in for the day the phone is lost — because that day comes for a predictable fraction of your users every month.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> enroll a TOTP secret as unconfirmed and confirm it with one real code; issue recovery codes once, stored as digests; and verify a step-up with either a code or a single-use recovery code.</p>
</div>

<h3>Confirm before you trust</h3>
<p>The ordering that matters: store the secret <strong>unconfirmed</strong>, show the QR, and require one correct code before you mark the factor on. Enable it on the strength of "we generated a secret" and a user who mis-scanned, or whose clock is wrong, is locked out on their very next login — with no working factor to recover with. LabFlow ID's <code>/mfa/totp/begin</code> stores the secret and returns an <code>otpauth://</code> URI; <code>/mfa/totp/confirm</code> flips it on only after a code verifies, and only then issues recovery codes.</p>
${ma('javascript', ENROLL)}
${ra(OUT['73-totp-enroll'])}
<p>The QR the app scans is just that <code>otpauth://</code> URI — secret, issuer, label, digits, period. Confirm returns <code>{ enabled: true }</code> and ten recovery codes, returned <strong>once</strong>; the step-up then accepts a fresh code (<code>via: 'totp'</code>) or a recovery code (<code>via: 'recovery'</code>), and a reused recovery code fails.</p>

<h3>Recovery codes: the way back in</h3>
<p>Recovery codes are the floor of every MFA system: high-entropy strings, shown once at enrollment, stored only as SHA-256 digests (the same credential handling as Lesson 1.3). When the phone is gone, one code logs the user in. They are generated with <code>randomInt</code> (lesson 1.2) over an unambiguous alphabet, and consuming one is single-use and constant-time.</p>
${ma('javascript', RECGEN)}
${ra(OUT['72-recovery'])}
<div class="kv-grid">
  <div class="kv"><span class="k">Shown once, stored hashed</span><span class="v">The server keeps digests, not codes; a database dump is a list of hashes, not of working recovery codes.</span></div>
  <div class="kv"><span class="k">Single-use</span><span class="v">Consuming a code removes it. The demo shows the same code returning <code>ok: false</code> the second time — a spent code helps no one.</span></div>
  <div class="kv"><span class="k">Unambiguous alphabet</span><span class="v">No <code>l/o/0/1</code>, grouped <code>xxxx-xxxx</code> — because humans copy these onto paper and mistype them.</span></div>
  <div class="kv"><span class="k">Regenerate, do not top up</span><span class="v">If a user asks for new codes, replace the whole set; never add to a set whose plaintext you no longer know.</span></div>
</div>

<h3>Recovery is the new weakest link</h3>
<div class="pitfall co-tieu-de">
<p><strong>Trap — a "reset my 2FA" email/SMS link undoes the whole factor.</strong> Every recovery path you add is another front door (Chapter 6's lesson, applied to the second factor). A link that disables 2FA from an email just moves the trust back to the email account — the weak channel the second factor was supposed to backstop. Recovery <em>codes</em> are good precisely because the user holds them offline, outside any channel an attacker can redirect. The strongest "recovery" of all is a second enrolled authenticator: encourage two from the start, so losing one is an inconvenience, not a lockout.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"Why require a code before enabling TOTP?"</strong> — To confirm the app scanned the right secret and the clocks agree; otherwise the user is locked out on the next login with no factor to recover with.</li>
<li><strong>"How do you store recovery codes?"</strong> — As SHA-256 digests, shown once, single-use — the same as any credential (1.3).</li>
<li><strong>"User lost their phone and has no recovery code — now what?"</strong> — That is why you push a second authenticator at enrollment; the manual fallback (identity-proofed support) must be deliberately slow and logged, because it is the real attack surface.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>bash demo7/totp-enroll.sh</code>. Confirm the factor is only enabled after a valid code, and that recovery codes are returned exactly once.</li>
<li>Run <code>node demo7/recovery.mjs</code>. Consume a code, then consume it again — what changes, and what is stored server-side?</li>
<li>Skip the confirm step (enable TOTP straight after <code>begin</code>). Describe the support ticket you just guaranteed.</li>
</ol>
<p><strong>Solution:</strong> (1) <code>confirm</code> returns <code>{ enabled: true }</code> + 10 codes only after a code verifies. (2) the first consume succeeds (remaining 9), the second returns <code>ok: false</code>; only digests are stored. (3) a user who mis-scanned is now locked out on the next login with no working factor — the exact failure confirming first prevents.</p>
<p><strong>Done when:</strong> enrollment refuses to enable without a verified code, and a recovery code works exactly once.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">enrollment</span><span class="v">Turning on a factor: share a secret, confirm it works, issue recovery.</span></div>
  <div class="kv"><span class="k">unconfirmed factor</span><span class="v">A stored secret not yet trusted, until the user proves one code.</span></div>
  <div class="kv"><span class="k">otpauth:// URI</span><span class="v">The QR payload: secret, issuer, label, digits, period.</span></div>
  <div class="kv"><span class="k">recovery code</span><span class="v">A high-entropy, single-use, hashed string for logging in without the factor.</span></div>
  <div class="kv"><span class="k">look-up secret (NIST)</span><span class="v">NIST's name for recovery codes — a pre-shared one-time secret.</span></div>
  <div class="kv"><span class="k">recovery path</span><span class="v">Any way back into the account; each one is a front door to defend (Ch 6).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Store the secret unconfirmed, confirm with one real code, only then enable the factor.</li>
<li>The QR is an <code>otpauth://</code> URI; the app computes codes from the secret inside it.</li>
<li>Issue recovery codes once, store them as digests, single-use — the way back when the phone is gone.</li>
<li>A "reset 2FA" email/SMS link re-weakens everything; offline codes and a second authenticator do not.</li>
<li>The real fix for device loss is a second enrolled factor — encourage two from the start.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-1-2-ngau-nhien', title: 'Revisit Chapter 1 — lesson 1.2: randomness you can trust', sub: 'Recovery codes and the TOTP secret both lean on a CSPRNG (randomInt / randomBytes). The quality of that randomness is the quality of the secret. Each stands on its own.', cta: 'OPEN LESSON 1.2 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Đăng ký một yếu tố, và cái đường khôi phục bạn CHẮC CHẮN sẽ cần</h2>
<p class="lead">7.2 đã dựng cái mã; bài này bật nó cho một người dùng thật. Đăng ký là hai bước các đội thường làm sai, và mỗi cái, bỏ qua, đẻ ra một hàng chờ hỗ trợ: xác nhận yếu tố chạy được trước khi tin nó, và trao cho người dùng một đường quay lại cho cái ngày mất điện thoại — vì ngày đó tới với một tỷ lệ đoán được của người dùng mỗi tháng.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> đăng ký một bí mật TOTP là chưa xác nhận và xác nhận bằng một mã thật; phát mã khôi phục một lần, lưu dạng digest; và xác minh step-up bằng một mã hoặc một mã khôi phục dùng một lần.</p>
</div>

<h3>Xác nhận trước khi tin</h3>
<p>Thứ tự quan trọng: lưu bí mật <strong>chưa xác nhận</strong>, hiện QR, và đòi một mã đúng trước khi đánh dấu yếu tố bật. Bật nó chỉ dựa vào "ta đã sinh một bí mật" và một người quét nhầm, hay đồng hồ sai, bị khoá ngay lần đăng nhập kế — không còn yếu tố chạy được để khôi phục. <code>/mfa/totp/begin</code> của LabFlow ID lưu bí mật và trả một URI <code>otpauth://</code>; <code>/mfa/totp/confirm</code> chỉ bật sau khi một mã xác minh, và chỉ khi đó mới phát mã khôi phục.</p>
${ma('javascript', ENROLL)}
${ra(OUT['73-totp-enroll'])}
<p>Cái QR app quét chỉ là URI <code>otpauth://</code> đó — bí mật, nhà phát hành, nhãn, số chữ số, chu kỳ. Confirm trả <code>{ enabled: true }</code> và mười mã khôi phục, trả về <strong>một lần</strong>; step-up rồi nhận một mã mới (<code>via: 'totp'</code>) hoặc một mã khôi phục (<code>via: 'recovery'</code>), và một mã khôi phục dùng lại thất bại.</p>

<h3>Mã khôi phục: đường quay lại</h3>
<p>Mã khôi phục là sàn của mọi hệ MFA: chuỗi entropy cao, hiện một lần lúc đăng ký, chỉ lưu dạng digest SHA-256 (cùng cách xử lý tín vật ở bài 1.3). Khi mất điện thoại, một mã đăng nhập người dùng. Chúng sinh bằng <code>randomInt</code> (bài 1.2) trên một bảng chữ không nhập nhằng, và tiêu một mã là dùng-một-lần và hằng thời gian.</p>
${ma('javascript', RECGEN)}
${ra(OUT['72-recovery'])}
<div class="kv-grid">
  <div class="kv"><span class="k">Hiện một lần, lưu dạng băm</span><span class="v">Máy chủ giữ digest, không giữ mã; một bản dump là danh sách băm, không phải mã khôi phục chạy được.</span></div>
  <div class="kv"><span class="k">Dùng một lần</span><span class="v">Tiêu một mã là bỏ nó. Demo cho thấy cùng mã trả <code>ok: false</code> lần hai — một mã đã tiêu không giúp ai.</span></div>
  <div class="kv"><span class="k">Bảng chữ không nhập nhằng</span><span class="v">Không <code>l/o/0/1</code>, nhóm <code>xxxx-xxxx</code> — vì con người chép chúng ra giấy và gõ nhầm.</span></div>
  <div class="kv"><span class="k">Sinh lại, không bù thêm</span><span class="v">Nếu một người xin mã mới, thay cả bộ; đừng bao giờ thêm vào một bộ mà bản gốc bạn không còn biết.</span></div>
</div>

<h3>Khôi phục là mắt xích yếu mới</h3>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — một link "reset 2FA" qua email/SMS gỡ bỏ cả yếu tố.</strong> Mỗi đường khôi phục bạn thêm là một cửa trước nữa (bài học Chương 6, áp cho yếu tố thứ hai). Một link tắt 2FA từ email chỉ đẩy niềm tin về lại tài khoản email — cái kênh yếu mà yếu tố thứ hai lẽ ra phải chống lưng. Mã khôi phục tốt chính vì người dùng giữ chúng ngoại tuyến, ngoài mọi kênh kẻ tấn công chuyển hướng được. "Khôi phục" mạnh nhất là một bộ xác thực thứ hai đã đăng ký: khuyến khích hai cái từ đầu, để mất một cái là phiền toái, không phải bị khoá.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Vì sao đòi một mã trước khi bật TOTP?"</strong> — Để xác nhận app đã quét đúng bí mật và đồng hồ đồng ý; không thì người dùng bị khoá lần đăng nhập kế mà không còn yếu tố để khôi phục.</li>
<li><strong>"Lưu mã khôi phục thế nào?"</strong> — Dạng digest SHA-256, hiện một lần, dùng một lần — như mọi tín vật (1.3).</li>
<li><strong>"Người dùng mất điện thoại và không có mã khôi phục — giờ sao?"</strong> — Vì thế bạn đẩy một bộ xác thực thứ hai lúc đăng ký; đường lùi thủ công (hỗ trợ có kiểm danh tính) phải cố ý chậm và được ghi log, vì nó mới là bề mặt tấn công thật.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>bash demo7/totp-enroll.sh</code>. Xác nhận yếu tố chỉ bật sau một mã hợp lệ, và mã khôi phục trả về đúng một lần.</li>
<li>Chạy <code>node demo7/recovery.mjs</code>. Tiêu một mã, rồi tiêu lại — gì đổi, và cái gì lưu phía máy chủ?</li>
<li>Bỏ bước confirm (bật TOTP ngay sau <code>begin</code>). Mô tả cái ticket hỗ trợ bạn vừa chắc chắn tạo ra.</li>
</ol>
<p><strong>Lời giải:</strong> (1) <code>confirm</code> trả <code>{ enabled: true }</code> + 10 mã chỉ sau khi một mã xác minh. (2) tiêu đầu thành công (còn 9), tiêu thứ hai trả <code>ok: false</code>; chỉ digest được lưu. (3) một người quét nhầm giờ bị khoá lần đăng nhập kế mà không còn yếu tố chạy được — đúng cái hỏng mà xác nhận-trước ngăn.</p>
<p><strong>Đạt khi:</strong> đăng ký từ chối bật nếu không có một mã đã xác minh, và một mã khôi phục chạy đúng một lần.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">enrollment (đăng ký)</span><span class="v">Bật một yếu tố: chia một bí mật, xác nhận nó chạy, phát khôi phục.</span></div>
  <div class="kv"><span class="k">unconfirmed factor (yếu tố chưa xác nhận)</span><span class="v">Một bí mật đã lưu chưa được tin, tới khi người dùng chứng minh một mã.</span></div>
  <div class="kv"><span class="k">otpauth:// URI</span><span class="v">Nội dung QR: bí mật, nhà phát hành, nhãn, số chữ số, chu kỳ.</span></div>
  <div class="kv"><span class="k">recovery code (mã khôi phục)</span><span class="v">Một chuỗi entropy cao, dùng một lần, lưu băm, để đăng nhập không cần yếu tố.</span></div>
  <div class="kv"><span class="k">look-up secret (NIST)</span><span class="v">Tên NIST cho mã khôi phục — một bí mật chia trước, dùng một lần.</span></div>
  <div class="kv"><span class="k">recovery path (đường khôi phục)</span><span class="v">Bất kỳ đường quay lại tài khoản nào; mỗi cái là một cửa trước phải phòng (Ch 6).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lưu bí mật chưa xác nhận, xác nhận bằng một mã thật, chỉ khi đó mới bật yếu tố.</li>
<li>Cái QR là một URI <code>otpauth://</code>; app tính mã từ bí mật bên trong nó.</li>
<li>Phát mã khôi phục một lần, lưu dạng digest, dùng một lần — đường quay lại khi mất điện thoại.</li>
<li>Một link "reset 2FA" qua email/SMS làm yếu lại mọi thứ; mã ngoại tuyến và một bộ xác thực thứ hai thì không.</li>
<li>Cách sửa thật cho mất thiết bị là một yếu tố thứ hai đã đăng ký — khuyến khích hai cái từ đầu.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-1-2-ngau-nhien', title: 'Xem lại Chương 1 — bài 1.2: ngẫu nhiên tin được', sub: 'Mã khôi phục và bí mật TOTP đều dựa vào một CSPRNG (randomInt / randomBytes). Chất lượng của ngẫu nhiên đó là chất lượng của bí mật. Học riêng bài nào cũng tự đứng được.', cta: 'MỞ BÀI 1.2 →' })}
</div>
`,
};
