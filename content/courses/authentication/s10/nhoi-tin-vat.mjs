/**
 * Authentication · Chương 10 · 10.1 — Nhồi tín vật, cú tấn công đang diễn ra NGAY LÚC NÀY. Slug giữ: auth-10-1-nhoi-tin-vat. Bài đầu chương.
 * Code THẬT từ _ma.mjs (src/defense/stuffing.js) + output demo10/stuffing-run.mjs (LabFlow ID v0.10).
 */
import G from '../giang/auth-10-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const S = CODE.stuffing.split('\n');
const DECIDE = S.slice(S.findIndex((l) => l.includes('export function decide')), S.length).join('\n');

const NGUON_EN = [
  nguon('🛡️', 'OWASP — Credential Stuffing Prevention Cheat Sheet', 'The defences this lesson uses: breached-password blocking, rate limiting, challenges, not account lockout (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html'),
  nguon('🤖', 'OWASP — Automated Threats to Web Applications (OAT-008)', 'Credential stuffing as a catalogued automated threat; the shape this lesson defends (read 04/11/2026).', 'https://owasp.org/www-project-automated-threats-to-web-applications/'),
].join('\n');
const NGUON_VI = [
  nguon('🛡️', 'OWASP — Credential Stuffing Prevention Cheat Sheet', 'Các phòng thủ bài này dùng: chặn mật khẩu đã lộ, giới hạn tần suất, thách đố, không khoá tài khoản (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html'),
  nguon('🤖', 'OWASP — Mối đe doạ tự động (OAT-008)', 'Nhồi tín vật như một mối đe doạ tự động được phân loại; cái dáng bài này phòng thủ (đọc 04/11/2026).', 'https://owasp.org/www-project-automated-threats-to-web-applications/'),
].join('\n');

export default {
  title: '10.1 — Credential stuffing, the attack that is happening right now|||10.1 — Nhồi tín vật, cú tấn công đang diễn ra NGAY LÚC NÀY',
  slug: 'auth-10-1-nhoi-tin-vat',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cú tấn công phổ biến nhất không tinh vi: phát lại hàng triệu cặp email+mật khẩu rò từ vụ lộ NƠI KHÁC vào trang đăng nhập của bạn, cược rằng người ta dùng lại mật khẩu. Cách sửa HIỂN NHIÊN — khoá tài khoản sau 5 lần sai — là một cái bẫy: kẻ tấn công khoá mọi người dùng thật một cách cố ý (một DoS bạn tự dựng). Phòng thủ đúng DÁNG: nhồi thì RỘNG (vài IP chạm hàng nghìn tài khoản bằng mật khẩu đã lộ), nên chặn IP đang dội + thách đố lượt dùng mật khẩu đã lộ, và để YÊN tài khoản đơn lẻ. decide(signal) trả allow/challenge/block; thách đố (CAPTCHA/PoW) con người thay vì khoá; khoá cứng chỉ cho đợt dội (solved challenge xoá tín hiệu mềm nhưng KHÔNG xoá flood — trại giải vượt CAPTCHA). Đo thật: phát lại 10k spray + người dùng thật gõ sai 6 lần ⇒ decide() cho 0 kẻ tấn công lọt, 0 người thật bị khoá. Phòng thủ tốt nhất đã dựng ở chương trước (chặn mật khẩu đã lộ Ch2, passkey Ch7). Theo OWASP Credential Stuffing + OAT-008.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>Credential stuffing, the attack that is happening right now</h2>
<p class="lead">Chapters 1 through 9 built the defences. This chapter is the offence — the attacks a real identity service actually sees, ordered not by how clever they are but by how OFTEN they happen. And the most frequent one, by a wide margin, is the dullest imaginable: logging in with a password someone already stole from somewhere else.</p>

<div class="callout ok">
<p><strong>After Chapter 10 you can:</strong> name the attacks in order of frequency and defend against each; explain why account lockout is a self-inflicted denial-of-service; and build a credential-stuffing defence that stops the attack without locking out a single real user. Lab 10 grades exactly that function.</p>
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>explain what credential stuffing is and why password reuse makes it work;</li>
<li>say why "lock the account after N tries" hands the attacker a DoS;</li>
<li>defend the <em>shape</em> of the attack — the IP and the spread — while leaving the account alone.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> this is the attack your login endpoint is receiving today, in volume, whether or not you have looked. Everything earlier protected your storage; this protects your front door from keys stolen elsewhere.</p>
</div>

<h3>What it is, and why it works</h3>
<p>A breach at some unrelated site leaks millions of email-and-password pairs. Attackers replay those pairs against <em>your</em> login, automated, at scale — millions of attempts a day across the industry. There is no exploit and no cleverness; the bet is simply that a person who used <code>P@ssw0rd123</code> on a breached forum used it on LabFlow too. Everything in Chapters 1–7 protected <em>your</em> password storage, but this leak came from somewhere you do not control. The reused password is the whole attack.</p>

<h3>The wrong fix: account lockout</h3>
<p>"Lock the account after five wrong tries" feels obviously right and is a trap. Once lockout exists, the attacker can <em>lock every real user on purpose</em> — fail their account five times and it is locked, no password needed. You have built the attacker a denial-of-service out of your own defence. Lockout trades credential stuffing for account-lockout DoS, which is often worse.</p>

<h3>Defend the shape, not the account</h3>
<p>Credential stuffing has a distinctive <em>shape</em>: a few IPs touching thousands of distinct accounts with breached passwords. Defend <em>that</em> — block the flooding IP, challenge the breached-password attempt — and leave the individual account alone, so its real owner is never locked out. That decision is one pure function:</p>
${ma('javascript', DECIDE)}
<p>Read the order. A true flood (<code>ipFails ≥ 100</code>) or a spraying IP (many distinct accounts) is a hard <code>block</code>. A breached password being tried is the signature of stuffing, so it gets a <code>challenge</code>. A suspicious IP or a much-failed <em>account</em> is <code>challenge</code> too — never a block, because that account's "attacker" might be its real owner mistyping. Everything else is <code>allow</code>.</p>

<h3>The measured run</h3>
<p>The demo replays a 10,000-password spray from three IPs, mixed with real users — including one who fat-fingers their own password six times — and compares account lockout against <code>decide()</code>:</p>
${ra(OUT['101-stuffing'])}
<p>Account lockout lets one breached reuse in <em>and</em> locks two real users out of their own accounts — the DoS. <code>decide()</code> lets zero attacker logins through, locks zero real users, and the mistyping user keeps trying and gets in. The spray is challenged early and hard-blocked once the IP floods.</p>

<h3>Why the challenge, not a block, for the human</h3>
<p>A suspicious single account gets a <strong>challenge</strong> — a CAPTCHA or a proof-of-work — not a block. A real user solves it and continues; the attacker's bot usually cannot, and a human solver farm is slow and costs money. The human is never locked out of their own account, and the attacker's economics get worse. The one place a solved challenge is <em>not</em> enough is a true flood: solver farms pass CAPTCHAs, so <code>ipFails ≥ 100</code> stays blocked even with a solved token — which is why the hard block is checked first.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — thinking rate limiting is the main defence.</strong> The strongest anti-stuffing measures were built earlier: blocking breached passwords at sign-up and change (Chapter 2) means the leaked password never worked here, and offering passkeys (Chapter 7) means there is no password to stuff. Rate limiting and challenges are the <em>last</em> layer for the accounts that still have a reused password — not the first line.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"What is credential stuffing?"</strong> — Replaying leaked email/password pairs from other breaches against your login, betting on reuse. The highest-volume attack on any login.</li>
<li><strong>"Why not just lock the account after N failures?"</strong> — It lets an attacker lock every real user on purpose — a denial-of-service. Defend the IP and the spread; challenge, do not lock, the account.</li>
<li><strong>"What stops it best?"</strong> — Blocking breached passwords at sign-up and passkeys (no password to stuff), then rate limiting and challenges for the rest.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo10/stuffing-run.mjs</code>. How many real users does the account-lockout defence lock out, and who locked them?</li>
<li>In <code>decide()</code>, why is <code>accountFails</code> only ever a <code>challenge</code>, never a <code>block</code>?</li>
<li>Why does a solved challenge clear a suspicious IP but not a flooding one?</li>
</ol>
<p><strong>Solution:</strong> (1) two — and the attacker locked them, by failing their accounts on purpose during the spray. (2) because the account's failures might be its real owner mistyping; blocking the account is exactly the DoS the attacker wants, so a single account is challenged, and only the IP is ever hard-blocked. (3) a real user can solve a CAPTCHA to clear suspicion, but a solver farm passes CAPTCHAs too, so a true flood (<code>ipFails ≥ 100</code>) must stay blocked regardless.</p>
<p><strong>Done when:</strong> you can defend the spray by IP and breached-password signal, and you never lock a single account on its own failure count.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">credential stuffing</span><span class="v">Replaying leaked email/password pairs against a login, betting on password reuse.</span></div>
  <div class="kv"><span class="k">account lockout DoS</span><span class="v">Lockout turned against real users: the attacker locks accounts on purpose.</span></div>
  <div class="kv"><span class="k">challenge</span><span class="v">A CAPTCHA/proof-of-work that a human passes and a bot usually cannot — not a block.</span></div>
  <div class="kv"><span class="k">spread</span><span class="v">One IP touching many distinct accounts — the signature of a spray.</span></div>
  <div class="kv"><span class="k">breached-password signal</span><span class="v">A submitted password known to be in a breach corpus (Chapter 2) — a stuffing tell.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Credential stuffing is the highest-volume attack: replayed breached passwords, betting on reuse.</li>
<li>Account lockout is a self-inflicted DoS — the attacker locks real users on purpose.</li>
<li>Defend the IP and the spread; challenge the breached and the suspicious; never lock a single account.</li>
<li>A solved challenge clears soft signals but not a true flood (solver farms pass CAPTCHAs).</li>
<li>The strongest defences are earlier: block breached passwords (Ch2) and offer passkeys (Ch7).</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-2-4-chinh-sach', title: 'Back to 2.4 — password policy and the breached-password check', sub: 'There, the k-anonymity check that refuses a known-leaked password when the account is created. Here, why that check is the best defence against the stuffing this lesson measures. One idea, two ends of the attack.', cta: 'OPEN LESSON 2.4 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Nhồi tín vật, cú tấn công đang diễn ra NGAY LÚC NÀY</h2>
<p class="lead">Chương 1 tới 9 dựng phòng thủ. Chương này là tấn công — những cú một dịch vụ danh tính thật thực sự gặp, xếp không theo mức tinh vi mà theo mức THƯỜNG XUYÊN. Và cú phổ biến nhất, bỏ xa phần còn lại, lại nhạt nhẽo nhất có thể tưởng tượng: đăng nhập bằng một mật khẩu ai đó đã trộm sẵn ở nơi khác.</p>

<div class="callout ok">
<p><strong>Học xong Chương 10 bạn làm được:</strong> gọi tên các cú tấn công theo thứ tự tần suất và phòng thủ từng cái; giải thích vì sao khoá tài khoản là một cú từ chối dịch vụ tự gây; và dựng một phòng thủ chống nhồi mật khẩu chặn được cú tấn công mà không khoá một người dùng thật nào. Lab 10 chấm đúng hàm đó.</p>
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>giải thích nhồi tín vật là gì và vì sao dùng lại mật khẩu làm nó chạy;</li>
<li>nói vì sao "khoá tài khoản sau N lần" trao cho kẻ tấn công một DoS;</li>
<li>phòng thủ đúng <em>dáng</em> của cú tấn công — IP và độ lan — trong khi để yên tài khoản.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> đây là cú tấn công endpoint đăng nhập của bạn đang nhận hôm nay, với số lượng lớn, dù bạn có nhìn hay không. Mọi thứ trước đó bảo vệ kho của bạn; cái này bảo vệ cửa trước khỏi những chìa bị trộm ở nơi khác.</p>
</div>

<h3>Nó là gì, và vì sao nó chạy</h3>
<p>Một vụ lộ ở một site không liên quan tuồn ra hàng triệu cặp email-và-mật-khẩu. Kẻ tấn công phát lại các cặp đó vào trang đăng nhập của <em>bạn</em>, tự động, ở quy mô lớn — hàng triệu lượt mỗi ngày toàn ngành. Không khai thác và không tinh vi; cái cược đơn giản là một người dùng <code>P@ssw0rd123</code> trên một diễn đàn bị lộ cũng dùng nó trên LabFlow. Mọi thứ ở Chương 1–7 bảo vệ kho mật khẩu của <em>bạn</em>, nhưng vụ lộ này đến từ một nơi bạn không kiểm soát. Mật khẩu dùng lại là toàn bộ cú tấn công.</p>

<h3>Cách sửa sai: khoá tài khoản</h3>
<p>"Khoá tài khoản sau năm lần sai" nghe hiển nhiên đúng và là một cái bẫy. Một khi có khoá, kẻ tấn công có thể <em>khoá mọi người dùng thật một cách cố ý</em> — làm sai tài khoản họ năm lần và nó bị khoá, không cần mật khẩu. Bạn đã dựng cho kẻ tấn công một cú từ chối dịch vụ từ chính phòng thủ của mình. Khoá đổi nhồi tín vật lấy DoS khoá-tài-khoản, thứ thường tệ hơn.</p>

<h3>Phòng thủ cái dáng, không phải tài khoản</h3>
<p>Nhồi tín vật có một <em>dáng</em> đặc trưng: vài IP chạm hàng nghìn tài khoản khác nhau bằng mật khẩu đã lộ. Phòng thủ <em>cái đó</em> — chặn IP đang dội, thách đố lượt dùng mật khẩu đã lộ — và để yên tài khoản đơn lẻ, nên chủ thật của nó không bao giờ bị khoá. Quyết định đó là một hàm thuần:</p>
${ma('javascript', DECIDE)}
<p>Đọc thứ tự. Một đợt dội thật (<code>ipFails ≥ 100</code>) hay một IP đang phun (nhiều tài khoản khác nhau) là một <code>block</code> cứng. Một mật khẩu đã lộ đang được thử là chữ ký của nhồi, nên nó nhận một <code>challenge</code>. Một IP đáng ngờ hay một <em>tài khoản</em> sai nhiều cũng là <code>challenge</code> — không bao giờ block, vì "kẻ tấn công" của tài khoản đó có thể là chủ thật đang gõ sai. Còn lại là <code>allow</code>.</p>

<h3>Lượt chạy đo thật</h3>
<p>Demo phát lại một đợt 10.000 mật khẩu từ ba IP, trộn với người dùng thật — gồm một người gõ sai mật khẩu của chính mình sáu lần — và so khoá tài khoản với <code>decide()</code>:</p>
${ra(OUT['101-stuffing'])}
<p>Khoá tài khoản để một lần dùng lại mật khẩu đã lộ lọt <em>và</em> khoá hai người dùng thật khỏi tài khoản của chính họ — cú DoS. <code>decide()</code> cho không lần đăng nhập nào của kẻ tấn công lọt, khoá không người dùng thật nào, và người gõ sai vẫn thử tiếp và vào được. Đợt dội bị thách đố sớm và bị khoá cứng một khi IP dội.</p>

<h3>Vì sao thách đố, không phải khoá, cho con người</h3>
<p>Một tài khoản đơn lẻ đáng ngờ nhận một <strong>thách đố</strong> — một CAPTCHA hay một proof-of-work — không phải một khoá. Người dùng thật giải nó và đi tiếp; bot của kẻ tấn công thường không giải được, và một trại giải của con người thì chậm và tốn tiền. Con người không bao giờ bị khoá khỏi tài khoản của chính mình, và kinh tế của kẻ tấn công tệ đi. Chỗ duy nhất một thách đố đã giải <em>không</em> đủ là một đợt dội thật: trại giải vượt được CAPTCHA, nên <code>ipFails ≥ 100</code> vẫn bị khoá kể cả với một token đã giải — vì thế khoá cứng được kiểm trước.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — tưởng giới hạn tần suất là phòng thủ chính.</strong> Các biện pháp chống nhồi mạnh nhất đã dựng ở chương trước: chặn mật khẩu đã lộ lúc đăng ký và đổi (Chương 2) nghĩa là mật khẩu rò không bao giờ chạy ở đây, và mời passkey (Chương 7) nghĩa là không có mật khẩu mà nhồi. Giới hạn tần suất và thách đố là lớp <em>cuối</em> cho các tài khoản vẫn còn một mật khẩu dùng lại — không phải tuyến đầu.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Nhồi tín vật là gì?"</strong> — Phát lại các cặp email/mật khẩu rò từ vụ lộ khác vào trang đăng nhập của bạn, cược vào dùng lại. Cú tấn công nhiều lượt nhất lên bất kỳ trang đăng nhập nào.</li>
<li><strong>"Sao không khoá tài khoản sau N lần sai?"</strong> — Nó để một kẻ tấn công khoá mọi người dùng thật một cách cố ý — một DoS. Phòng thủ IP và độ lan; thách đố, không khoá, tài khoản.</li>
<li><strong>"Cái gì chặn nó tốt nhất?"</strong> — Chặn mật khẩu đã lộ lúc đăng ký và passkey (không có mật khẩu mà nhồi), rồi giới hạn tần suất và thách đố cho phần còn lại.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo10/stuffing-run.mjs</code>. Phòng thủ khoá-tài-khoản khoá mất bao nhiêu người dùng thật, và ai khoá họ?</li>
<li>Trong <code>decide()</code>, vì sao <code>accountFails</code> chỉ bao giờ là một <code>challenge</code>, không bao giờ một <code>block</code>?</li>
<li>Vì sao một thách đố đã giải xoá một IP đáng ngờ nhưng không xoá một IP đang dội?</li>
</ol>
<p><strong>Lời giải:</strong> (1) hai — và kẻ tấn công khoá họ, bằng cách làm sai tài khoản họ một cách cố ý trong lúc dội. (2) vì các lần sai của tài khoản có thể là chủ thật đang gõ sai; khoá tài khoản đúng là cú DoS kẻ tấn công muốn, nên một tài khoản đơn lẻ bị thách đố, và chỉ IP mới bao giờ bị khoá cứng. (3) một người dùng thật giải được một CAPTCHA để xoá nghi ngờ, nhưng một trại giải cũng vượt CAPTCHA, nên một đợt dội thật (<code>ipFails ≥ 100</code>) phải vẫn bị khoá bất kể.</p>
<p><strong>Đạt khi:</strong> bạn phòng thủ được đợt dội theo IP và tín hiệu mật khẩu đã lộ, và không bao giờ khoá một tài khoản đơn lẻ theo số lần sai của chính nó.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">credential stuffing (nhồi tín vật)</span><span class="v">Phát lại các cặp email/mật khẩu rò vào một trang đăng nhập, cược vào dùng lại mật khẩu.</span></div>
  <div class="kv"><span class="k">account lockout DoS</span><span class="v">Khoá bị quay ngược vào người dùng thật: kẻ tấn công khoá tài khoản một cách cố ý.</span></div>
  <div class="kv"><span class="k">challenge (thách đố)</span><span class="v">Một CAPTCHA/proof-of-work mà con người vượt và bot thường không — không phải một khoá.</span></div>
  <div class="kv"><span class="k">spread (độ lan)</span><span class="v">Một IP chạm nhiều tài khoản khác nhau — chữ ký của một đợt phun.</span></div>
  <div class="kv"><span class="k">breached-password signal</span><span class="v">Một mật khẩu gửi lên biết là có trong kho vụ lộ (Chương 2) — một dấu hiệu nhồi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Nhồi tín vật là cú tấn công nhiều lượt nhất: phát lại mật khẩu đã lộ, cược vào dùng lại.</li>
<li>Khoá tài khoản là một DoS tự gây — kẻ tấn công khoá người dùng thật một cách cố ý.</li>
<li>Phòng thủ IP và độ lan; thách đố cái đã lộ và cái đáng ngờ; không bao giờ khoá một tài khoản đơn lẻ.</li>
<li>Một thách đố đã giải xoá tín hiệu mềm nhưng không xoá một đợt dội thật (trại giải vượt CAPTCHA).</li>
<li>Phòng thủ mạnh nhất ở chương trước: chặn mật khẩu đã lộ (Ch2) và mời passkey (Ch7).</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-2-4-chinh-sach', title: 'Quay lại 2.4 — chính sách mật khẩu và kiểm mật khẩu đã lộ', sub: 'Ở đó, phép kiểm k-anonymity từ chối một mật khẩu biết-là-rò khi tài khoản được tạo. Ở đây, vì sao phép kiểm đó là phòng thủ tốt nhất trước cú nhồi mà bài này đo. Một ý tưởng, hai đầu của cú tấn công.', cta: 'MỞ BÀI 2.4 →' })}
</div>
`,
};
