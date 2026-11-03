/**
 * Authentication · Chương 10 · 10.4 — Đánh vào tầng CON NGƯỜI: mệt mỏi, bàn hỗ trợ, và nhà mạng. Slug giữ: auth-10-4-tang-con-nguoi.
 * Output THẬT từ _ma.mjs: demo10/mfa-fatigue.mjs (bấm-duyệt vào được, ghép số chỉ vào khi đoán trúng 1/100).
 */
import G from '../giang/auth-10-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { OUT } from './_ma.mjs';

const NGUON_EN = [
  nguon('🔐', 'OWASP — Multifactor Authentication Cheat Sheet', 'Push fatigue, number matching, and why SMS is the weak factor (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html'),
  nguon('📏', 'NIST SP 800-63B — Digital Identity Guidelines', 'Restricted authenticators (SMS/OOB over the phone network) and account recovery guidance (read 04/11/2026).', 'https://pages.nist.gov/800-63-4/sp800-63b.html'),
].join('\n');
const NGUON_VI = [
  nguon('🔐', 'OWASP — Multifactor Authentication Cheat Sheet', 'Mệt mỏi push, ghép số, và vì sao SMS là yếu tố yếu (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html'),
  nguon('📏', 'NIST SP 800-63B — Hướng dẫn danh tính số', 'Authenticator bị hạn chế (SMS/OOB qua mạng điện thoại) và hướng dẫn khôi phục tài khoản (đọc 04/11/2026).', 'https://pages.nist.gov/800-63-4/sp800-63b.html'),
].join('\n');

export default {
  title: '10.4 — Attacking the human layer: fatigue, the help desk, and the carrier|||10.4 — Đánh vào tầng CON NGƯỜI: mệt mỏi, bàn hỗ trợ, và nhà mạng',
  slug: 'auth-10-4-tang-con-nguoi',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Khi mật mã kín như bưng, kẻ tấn công đi vòng qua con người. Ba kênh: (1) MỆT MỎI MFA (push bombing) — kẻ tấn công đã có mật khẩu, spam "Duyệt?" lúc 3h sáng cho tới khi nạn nhân mệt bấm Duyệt; sửa KHÔNG phải thêm lời nhắc mà bằng GHÉP SỐ (màn hình đăng nhập hiện số 2 chữ số, nạn nhân phải GÕ nó — số nằm trên màn hình KẺ TẤN CÔNG nạn nhân không thấy); đo thật: bấm-duyệt vào được, ghép số chỉ vào khi đoán trúng 1/100. (2) BÀN HỖ TRỢ — "mất điện thoại, đặt lại MFA" qua cuộc gọi thuyết phục là đặt lại yếu tố không cần yếu tố; cứng hoá đường đặt lại ngang đường đăng nhập, xác minh ngoài băng. (3) NHÀ MẠNG (SIM swap) — SMS chuyển số được, chỉ mạnh ngang một nhân viên tổng đài; SMS phát lại/chặn/chuyển được nên là dự phòng, không phải kế hoạch. Mẫu chung: soát ĐƯỜNG VÀO yếu nhất (gồm khôi phục), không chỉ cửa trước. Theo OWASP MFA + NIST SP 800-63B.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>Attacking the human layer: fatigue, the help desk, and the carrier</h2>
<p class="lead">Sometimes the login is airtight and the attacker simply goes around it — through the people. Three human channels show up again and again in real account takeovers: MFA fatigue, the help desk, and the phone carrier. Each turns a person, not a protocol, into the bypass.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> explain MFA fatigue and why number matching stops it; harden the help-desk reset path to match the login; and say why SMS is the weak second factor and treat it as a fallback, not the plan.</p>
</div>

<h3>MFA fatigue (push bombing)</h3>
<p>The attacker already has the password (from a dump, lesson 10.1). A push-approval second factor sends "Approve this login?" to the victim's phone. The attacker fires it over and over, at 3am, until a tired, confused victim taps <em>Approve</em> just to make it stop. Rate-limiting the prompts helps but does not solve it: one well-timed prompt still gets a tap.</p>

<h3>The fix: number matching</h3>
<p>The real fix changes what "approve" means. The login screen — the <em>attacker's</em> screen — shows a two-digit number, and the victim must <em>type it</em> into their phone. The number is on the attacker's screen, which the victim never sees, so tapping is no longer enough. The measured demo:</p>
${ra(OUT['104-fatigue'])}
<p>Tap-to-approve lets the attacker in on a single tired tap. Number matching lets them in only on a 1-in-100 guess of a number they do not have — and that is before rate-limiting the prompts and showing the victim <em>where</em> the login is coming from.</p>

<h3>The help desk</h3>
<p>"I lost my phone, please reset my MFA." A help desk that resets a factor on a convincing phone call is performing a factor reset <em>without any factor</em>. Attackers rehearse the story, spoof caller ID, and know the org chart. The reset path must be as strong as the login: verify through a channel the attacker does not control — a video call, a manager's approval, an in-person check — never "they knew the last four digits of the card". A weak recovery <em>is</em> the real authentication, however strong the front door.</p>

<h3>The carrier: SIM swap</h3>
<p>If a factor is SMS, the attacker calls the phone carrier and ports the victim's number to a SIM they control. Now the codes arrive on the attacker's phone. SMS as a second factor is only as strong as a call-centre employee at a phone company — and it is also relayable (phishing, 10.2) and interceptable (SS7). It beats nothing-but-a-password, but TOTP and especially passkeys are a different tier. Prefer them; treat SMS as a fallback, not the plan.</p>

<h3>The pattern</h3>
<p>Every human attack targets the <em>weakest path</em> to the account, not the strongest. A hardened login with a soft help desk, an SMS fallback, or a tap-to-approve push is only as strong as those. The lesson for your design: audit every path <em>in</em> — recovery, help desk, fallback factors — and make each as strong as the login, because the attacker will find and use the weakest.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — a strong login with a weak reset.</strong> It is common to pour effort into passwords, MFA and OIDC, then let support reset any of them on a phone call, or offer SMS "just as a backup". The attacker ignores the strong path and takes the weak one. The recovery flow and the fallback factor are part of your authentication, not an afterthought — size them to match.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"What is MFA fatigue, and how do you stop it?"</strong> — Spamming push-approval prompts until the victim taps yes; stop it with number matching (type a number only the login screen shows) plus prompt rate-limiting.</li>
<li><strong>"Why is SMS a weak second factor?"</strong> — It is SIM-swappable at the carrier, relayable by phishing, and interceptable on the network. Prefer TOTP or passkeys; SMS is a fallback.</li>
<li><strong>"How should account recovery be secured?"</strong> — As strongly as the login: verify out of band, not with knowledge an attacker can gather. A weak recovery is the real authentication.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo10/mfa-fatigue.mjs</code>. Why does number matching defeat the fatigue attack that tap-to-approve does not?</li>
<li>A help desk resets MFA when the caller "knows the last four digits of the card on file". What is wrong with that check?</li>
<li>Why is an SMS second factor only as strong as the phone carrier?</li>
</ol>
<p><strong>Solution:</strong> (1) the number is shown on the attacker's login screen, which the victim never sees, so tapping Approve is not enough — the victim must enter a value they do not have. (2) the last four digits are not a secret — they appear on receipts and statements, so "knowing" them authenticates an attacker who gathered them; recovery must verify out of band. (3) the attacker can SIM-swap the number at the carrier, after which the codes arrive on their phone — the factor is only as strong as the carrier's call centre.</p>
<p><strong>Done when:</strong> you can harden a reset path to match the login and justify preferring passkeys/TOTP over SMS.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">MFA fatigue / push bombing</span><span class="v">Spamming approval prompts until a tired victim taps yes.</span></div>
  <div class="kv"><span class="k">number matching</span><span class="v">Requiring the victim to type a number shown only on the login screen — defeats tap-to-approve.</span></div>
  <div class="kv"><span class="k">help-desk social engineering</span><span class="v">Talking support into a factor reset without any factor.</span></div>
  <div class="kv"><span class="k">SIM swap</span><span class="v">Porting the victim's number to the attacker's SIM to receive SMS codes.</span></div>
  <div class="kv"><span class="k">weakest path</span><span class="v">The least-defended way into the account — where the human attacker goes.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>MFA fatigue spams push approvals until a tired victim taps yes — fix with number matching, not more prompts.</li>
<li>The help desk resets factors without factors unless the reset is verified out of band.</li>
<li>SMS is SIM-swappable, relayable and interceptable — a fallback, never the plan.</li>
<li>Every human attack takes the weakest path in — audit recovery and fallbacks, not just the login.</li>
<li>The recovery flow is part of your authentication; size it to match the front door.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-7-1-yeu-to-thu-hai', title: 'Back to 7.1 — the factors and their strength', sub: 'There, the second factor as a defence — TOTP, recovery codes, passkeys. Here, the attacks that target the human around those factors: fatigue, the help desk, the carrier. One topic, both sides.', cta: 'OPEN LESSON 7.1 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Đánh vào tầng CON NGƯỜI: mệt mỏi, bàn hỗ trợ, và nhà mạng</h2>
<p class="lead">Đôi khi trang đăng nhập kín như bưng và kẻ tấn công đơn giản đi vòng qua nó — qua con người. Ba kênh con người xuất hiện lặp đi lặp lại trong các vụ chiếm tài khoản thật: mệt mỏi MFA, bàn hỗ trợ, và nhà mạng. Mỗi cái biến một con người, không phải một giao thức, thành chỗ bypass.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> giải thích mệt mỏi MFA và vì sao ghép số chặn nó; cứng hoá đường đặt lại ở bàn hỗ trợ cho ngang trang đăng nhập; và nói vì sao SMS là yếu tố thứ hai yếu và coi nó là dự phòng, không phải kế hoạch.</p>
</div>

<h3>Mệt mỏi MFA (push bombing)</h3>
<p>Kẻ tấn công đã có mật khẩu (từ một bản dump, bài 10.1). Một yếu tố thứ hai dạng push gửi "Duyệt lần đăng nhập này?" tới điện thoại nạn nhân. Kẻ tấn công bắn nó liên tục, lúc 3 giờ sáng, cho tới khi một nạn nhân mệt mỏi, bối rối bấm <em>Duyệt</em> chỉ để nó dừng. Giới hạn tần suất lời nhắc giúp nhưng không giải quyết: một lời nhắc đúng lúc vẫn được một cái bấm.</p>

<h3>Cách sửa: ghép số</h3>
<p>Cách sửa thật thay đổi nghĩa của "duyệt". Màn hình đăng nhập — màn hình của <em>kẻ tấn công</em> — hiện một số hai chữ số, và nạn nhân phải <em>gõ nó</em> vào điện thoại. Số nằm trên màn hình kẻ tấn công, cái nạn nhân không bao giờ thấy, nên bấm không còn đủ. Demo đo thật:</p>
${ra(OUT['104-fatigue'])}
<p>Bấm-để-duyệt cho kẻ tấn công vào chỉ với một cái bấm mệt mỏi. Ghép số chỉ cho họ vào khi đoán trúng 1 trên 100 một số họ không có — và đó là trước khi giới hạn tần suất lời nhắc và hiện cho nạn nhân <em>đâu</em> là nguồn lần đăng nhập.</p>

<h3>Bàn hỗ trợ</h3>
<p>"Tôi mất điện thoại, làm ơn đặt lại MFA cho tôi." Một bàn hỗ trợ đặt lại một yếu tố qua một cuộc gọi thuyết phục đang thực hiện một lần đặt lại yếu tố <em>mà không cần yếu tố nào</em>. Kẻ tấn công tập dượt câu chuyện, giả số gọi, và biết sơ đồ tổ chức. Đường đặt lại phải mạnh ngang trang đăng nhập: xác minh qua một kênh kẻ tấn công không kiểm soát — một cuộc gọi video, một phê duyệt của quản lý, một kiểm tra trực tiếp — không bao giờ "họ biết bốn số cuối của thẻ". Một đường khôi phục yếu <em>chính là</em> xác thực thật, dù cửa trước mạnh đến đâu.</p>

<h3>Nhà mạng: SIM swap</h3>
<p>Nếu một yếu tố là SMS, kẻ tấn công gọi nhà mạng và chuyển số nạn nhân sang một SIM họ kiểm soát. Giờ mã về điện thoại kẻ tấn công. SMS làm yếu tố thứ hai chỉ mạnh ngang một nhân viên tổng đài ở một công ty điện thoại — và nó còn phát lại được (lừa đảo, 10.2) và chặn được (SS7). Nó hơn chỉ-có-mật-khẩu, nhưng TOTP và nhất là passkey ở một đẳng cấp khác. Ưu tiên chúng; coi SMS là dự phòng, không phải kế hoạch.</p>

<h3>Mẫu chung</h3>
<p>Mọi cú tấn công con người nhắm vào <em>đường yếu nhất</em> tới tài khoản, không phải đường mạnh nhất. Một trang đăng nhập cứng với một bàn hỗ trợ mềm, một dự phòng SMS, hay một push bấm-để-duyệt chỉ mạnh ngang những cái đó. Bài học cho thiết kế của bạn: soát mọi đường <em>vào</em> — khôi phục, bàn hỗ trợ, yếu tố dự phòng — và làm mỗi cái mạnh ngang trang đăng nhập, vì kẻ tấn công sẽ tìm và dùng cái yếu nhất.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — một đăng nhập mạnh với một đường đặt lại yếu.</strong> Rất thường người ta đổ công vào mật khẩu, MFA và OIDC, rồi để hỗ trợ đặt lại bất kỳ cái nào qua một cuộc gọi, hoặc mời SMS "chỉ để dự phòng". Kẻ tấn công bỏ qua đường mạnh và lấy đường yếu. Luồng khôi phục và yếu tố dự phòng là một phần của xác thực của bạn, không phải một thứ nghĩ sau — cân kích thước chúng cho ngang nhau.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Mệt mỏi MFA là gì, và bạn chặn nó thế nào?"</strong> — Spam lời nhắc push-duyệt cho tới khi nạn nhân bấm có; chặn nó bằng ghép số (gõ một số chỉ màn hình đăng nhập hiện) cộng giới hạn tần suất lời nhắc.</li>
<li><strong>"Vì sao SMS là một yếu tố thứ hai yếu?"</strong> — Nó chuyển SIM được ở nhà mạng, phát lại được bằng lừa đảo, và chặn được trên mạng. Ưu tiên TOTP hay passkey; SMS là dự phòng.</li>
<li><strong>"Khôi phục tài khoản nên được bảo vệ ra sao?"</strong> — Mạnh ngang trang đăng nhập: xác minh ngoài băng, không bằng kiến thức một kẻ tấn công thu thập được. Một khôi phục yếu là xác thực thật.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo10/mfa-fatigue.mjs</code>. Vì sao ghép số đánh bại cú tấn công mệt mỏi mà bấm-để-duyệt không?</li>
<li>Một bàn hỗ trợ đặt lại MFA khi người gọi "biết bốn số cuối của thẻ trong hồ sơ". Sai ở đâu với phép kiểm đó?</li>
<li>Vì sao một yếu tố thứ hai SMS chỉ mạnh ngang nhà mạng?</li>
</ol>
<p><strong>Lời giải:</strong> (1) số được hiện trên màn hình đăng nhập của kẻ tấn công, cái nạn nhân không bao giờ thấy, nên bấm Duyệt không đủ — nạn nhân phải nhập một giá trị họ không có. (2) bốn số cuối không phải một bí mật — chúng xuất hiện trên biên lai và sao kê, nên "biết" chúng xác thực một kẻ tấn công đã thu thập được; khôi phục phải xác minh ngoài băng. (3) kẻ tấn công có thể chuyển SIM số đó ở nhà mạng, sau đó mã về điện thoại họ — yếu tố chỉ mạnh ngang tổng đài của nhà mạng.</p>
<p><strong>Đạt khi:</strong> bạn cứng hoá được một đường đặt lại cho ngang trang đăng nhập và biện minh được việc ưu tiên passkey/TOTP hơn SMS.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">MFA fatigue / push bombing</span><span class="v">Spam lời nhắc duyệt cho tới khi một nạn nhân mệt bấm có.</span></div>
  <div class="kv"><span class="k">number matching (ghép số)</span><span class="v">Buộc nạn nhân gõ một số chỉ hiện trên màn hình đăng nhập — đánh bại bấm-để-duyệt.</span></div>
  <div class="kv"><span class="k">help-desk social engineering</span><span class="v">Nói cho hỗ trợ đặt lại một yếu tố mà không cần yếu tố nào.</span></div>
  <div class="kv"><span class="k">SIM swap</span><span class="v">Chuyển số nạn nhân sang SIM của kẻ tấn công để nhận mã SMS.</span></div>
  <div class="kv"><span class="k">weakest path (đường yếu nhất)</span><span class="v">Đường ít được phòng thủ nhất vào tài khoản — chỗ kẻ tấn công con người đi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mệt mỏi MFA spam duyệt push cho tới khi một nạn nhân mệt bấm có — sửa bằng ghép số, không phải thêm lời nhắc.</li>
<li>Bàn hỗ trợ đặt lại yếu tố mà không cần yếu tố trừ khi việc đặt lại được xác minh ngoài băng.</li>
<li>SMS chuyển SIM được, phát lại được và chặn được — một dự phòng, không bao giờ kế hoạch.</li>
<li>Mọi cú tấn công con người lấy đường vào yếu nhất — soát khôi phục và dự phòng, không chỉ đăng nhập.</li>
<li>Luồng khôi phục là một phần của xác thực của bạn; cân kích thước cho ngang cửa trước.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-7-1-yeu-to-thu-hai', title: 'Quay lại 7.1 — các yếu tố và độ mạnh của chúng', sub: 'Ở đó, yếu tố thứ hai như một phòng thủ — TOTP, mã khôi phục, passkey. Ở đây, các cú tấn công nhắm vào con người quanh các yếu tố đó: mệt mỏi, bàn hỗ trợ, nhà mạng. Một chủ đề, cả hai phía.', cta: 'MỞ BÀI 7.1 →' })}
</div>
`,
};
