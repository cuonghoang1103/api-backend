/**
 * 10.5 — Vệ sinh tài khoản cá nhân (agl-10-5-tai-khoan). Soạn 24/11/2026, agent agl.
 * Chạy thật (OpenSSH ssh-keygen trên Fedora, HOME giả scratchpad/agl/lab/ch10/ssh/home-gia): kiem-ke.sh → RA.ssh.
 * Nguồn: NIST SP 800-63B-4 (final 07/2025: không bắt đổi định kỳ, không quy tắc ghép ký tự, đối chiếu danh sách mật khẩu đã lộ;
 * tối thiểu 15 ký tự khi mật khẩu là yếu tố duy nhất, 8 khi dùng kèm MFA) — pages.nist.gov/800-63-4/sp800-63b.html.
 * GitHub bắt buộc 2FA cho người đóng góp mã: công bố 04/05/2022, áp dụng dần từ 13/03/2023 (github.blog).
 * Uber 09/2022: thông báo "Security update" của Uber (mật khẩu nhà thầu có thể bị mua trên dark web, chấp nhận một lần đẩy MFA).
 * Không dạy lại: TOTP/passkey từ phía người xây hệ thống (authentication ch7), gỡ bí mật khỏi lịch sử (git 8.3), SSH ban đầu (git 0.3).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, cs, ag, ng, vo, bash, out } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L105 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 10 · Information security at work', 'Chương 10 · An ninh thông tin khi đi làm', `
<h2>${t('10.5 — Personal account hygiene: password manager, 2FA, SSH keys, scoped tokens', '10.5 — Vệ sinh tài khoản cá nhân: trình quản lý mật khẩu, 2FA, SSH key, token phạm vi hẹp')}</h2>
<p class="lead">${t(
    'Once you join a project, your GitHub account, your SSH key and your access tokens become keys to the customer\'s code. Attackers know that breaking a company is hard and breaking one developer is easy. This lesson is the user side of authentication: what to set up on your own accounts, what to check every few months, and what to do the moment something leaks. How to <em>build</em> login systems is a different course — we link to it instead of repeating it.',
    'Khi đã vào dự án, tài khoản GitHub, SSH key và các access token của bạn trở thành chìa khoá vào mã của khách. Kẻ tấn công biết phá một công ty thì khó, phá một lập trình viên thì dễ. Bài này là phía người dùng của xác thực: cần thiết lập gì trên tài khoản của chính mình, vài tháng kiểm lại gì, và làm gì ngay khi có thứ bị lộ. Cách <em>xây</em> hệ thống đăng nhập là khoá khác — ta dẫn liên kết thay vì giảng lại.')}</p>

${cl('info', t(
    '<strong>Everyday picture.</strong> You would not use one key for your house, your motorbike and your office, and you would not leave a spare under the doormat forever. Passwords, SSH keys and tokens are the same: one per door, the smallest key that opens only the door you need, and change the lock when a key goes missing.',
    '<strong>Liên tưởng đời thường.</strong> Không ai dùng một chìa cho nhà, xe máy và văn phòng, và không ai để chìa dự phòng dưới thảm chùi chân mãi mãi. Mật khẩu, SSH key và token cũng vậy: mỗi cửa một chìa, chìa nhỏ nhất chỉ mở đúng cửa cần mở, và mất chìa thì thay ổ khoá.'))}

<h3>${t('1. Passwords: a manager, not your memory', '1. Mật khẩu: để trình quản lý nhớ, không phải đầu bạn')}</h3>
<p>${t(
    'Password reuse is how the 2016 Uber breach started (lesson 10.7): engineers\' passwords leaked from other sites opened their GitHub accounts. A password manager (Bitwarden, 1Password, KeePassXC…) lets every site have a long random password; you remember one strong passphrase. Use the company-provided manager for work accounts if there is one, and keep work and personal vaults separate.',
    'Dùng lại mật khẩu là cách vụ Uber 2016 bắt đầu (bài 10.7): mật khẩu của kỹ sư lộ từ trang khác đã mở được tài khoản GitHub của họ. Trình quản lý mật khẩu (Bitwarden, 1Password, KeePassXC…) cho mỗi trang một mật khẩu ngẫu nhiên dài; bạn chỉ nhớ một cụm mật khẩu mạnh. Nếu công ty cấp trình quản lý thì dùng nó cho tài khoản công việc, và tách kho công việc với kho cá nhân.')}</p>
<p>${t(
    'Modern guidance has dropped the old rules. NIST SP 800-63B-4 (final, July 2025) tells services <em>not</em> to force periodic changes or composition rules ("one capital, one symbol"), but to require length, check new passwords against lists of breached ones, and require a change only when there is evidence of compromise. For you that means: long passphrases, never reused, changed when leaked. Details from the system side: ',
    'Hướng dẫn hiện đại đã bỏ các quy tắc cũ. NIST SP 800-63B-4 (bản chính thức, 07/2025) yêu cầu dịch vụ <em>không</em> bắt đổi mật khẩu định kỳ hay quy tắc ghép ký tự ("một chữ hoa, một ký hiệu"), mà đòi độ dài, đối chiếu mật khẩu mới với danh sách mật khẩu đã lộ, và chỉ bắt đổi khi có bằng chứng bị lộ. Với bạn nghĩa là: cụm mật khẩu dài, không dùng lại, đổi khi bị lộ. Chi tiết từ phía hệ thống: ')}${cs('authentication', 'auth-2-4-chinh-sach', t('Authentication 2.4', 'Xác thực 2.4'))}.</p>
<p>${ng('https://pages.nist.gov/800-63-4/sp800-63b.html', 'NIST SP 800-63B-4')}</p>

<h3>${t('2. Two-factor authentication — and the push you did not ask for', '2. Xác thực hai yếu tố — và lời nhắc đăng nhập bạn không hề yêu cầu')}</h3>
<p>${t(
    'GitHub announced in May 2022 that everyone who contributes code must enable 2FA, and rolled it out from March 2023 — so you already have it there. What matters is <em>which</em> second factor and what you do with it:',
    'GitHub công bố tháng 5/2022 rằng mọi người đóng góp mã phải bật 2FA, và áp dụng dần từ tháng 3/2023 — nên trên GitHub bạn đã có rồi. Điều quan trọng là dùng yếu tố thứ hai <em>nào</em> và bạn xử lý nó ra sao:')}</p>
${bang([t('Factor', 'Yếu tố'), t('Resists phishing?', 'Chống lừa đảo?'), t('Notes', 'Ghi chú')], [
    [t('Passkey / security key (FIDO2)', 'Passkey / khoá bảo mật (FIDO2)'), t('Yes — bound to the real site\'s domain', 'Có — gắn với tên miền của trang thật'), t('Best choice where supported', 'Lựa chọn tốt nhất nếu trang hỗ trợ')],
    [t('Authenticator app (TOTP, 6 digits)', 'Ứng dụng xác thực (TOTP, 6 số)'), t('No — a fake page can ask for the code', 'Không — trang giả có thể hỏi mã'), t('Good baseline; back up the seed or have recovery codes', 'Mức nền tốt; sao lưu khoá gốc hoặc giữ mã khôi phục')],
    [t('Push approval', 'Bấm duyệt thông báo đẩy'), t('Weak against "MFA fatigue"', 'Yếu trước kiểu "dội thông báo"'), t('Safer with number matching', 'An toàn hơn khi có so khớp số')],
    ['SMS', t('No; also SIM swap', 'Không; còn bị chiếm SIM'), t('Better than nothing, last choice', 'Còn hơn không, lựa chọn cuối')],
  ])}
${cl('danger', t(
    '<strong>Never approve a login you did not start.</strong> In September 2022 Uber said an attacker, probably using a contractor\'s password bought on the dark web, repeatedly triggered MFA push requests; the contractor rejected them at first and eventually accepted one. The attacker then reached internal tools such as G-Suite and Slack. If prompts arrive that you did not trigger: deny, change the password, report (lesson 10.2).',
    '<strong>Không bao giờ duyệt một lần đăng nhập mà bạn không tự thực hiện.</strong> Tháng 9/2022, Uber cho biết kẻ tấn công, nhiều khả năng dùng mật khẩu của một nhà thầu mua trên dark web, đã liên tục kích hoạt thông báo xác thực đẩy; nhà thầu lúc đầu từ chối, rồi cuối cùng bấm chấp nhận một lần. Kẻ tấn công sau đó vào được công cụ nội bộ như G-Suite và Slack. Thấy thông báo mà bạn không tự kích hoạt: từ chối, đổi mật khẩu, báo cáo (bài 10.2).'))}
<p>${ng('https://www.uber.com/en-gb/newsroom/security-update/', 'Uber — Security update, 09/2022')} · ${ng('https://github.blog/news-insights/company-news/software-security-starts-with-the-developer-securing-developer-accounts-with-2fa/', 'GitHub Blog, 04/05/2022')}</p>
<p>${t('<strong>Recovery codes</strong>: download them when you enable 2FA, store them in your password manager <em>and</em> on paper at home — not only on the laptop that might be lost (lesson 10.4). What a second factor buys and does not buy, from the builder\'s side: ', '<strong>Mã khôi phục</strong>: tải về ngay khi bật 2FA, cất trong trình quản lý mật khẩu <em>và</em> trên giấy ở nhà — không chỉ trên laptop có thể bị mất (bài 10.4). Yếu tố thứ hai mua được gì và không mua được gì, từ phía người xây: ')}${cs('authentication', 'auth-7-1-yeu-to-thu-hai', t('Authentication 7.1', 'Xác thực 7.1'))}.</p>

<h3>${t('3. SSH keys: passphrase, one per machine, inventory (run for real)', '3. SSH key: có passphrase, mỗi máy một khoá, kiểm kê (chạy thật)')}</h3>
<p>${t(
    'An SSH private key without a passphrase is a file that <em>is</em> your identity: whoever copies it — malware, a thief with an unencrypted disk, a backup uploaded to the wrong place — can push to every repo you can. Rules: <code>ed25519</code>, a passphrase (with <code>ssh-agent</code> so you type it once per session), one key per machine with a comment saying which machine, and delete keys of machines you no longer use. Creating the first key is in ',
    'SSH private key không có passphrase là một tệp <em>chính là</em> danh tính của bạn: ai chép được nó — mã độc, kẻ trộm có ổ đĩa không mã hoá, bản sao lưu tải nhầm chỗ — đều push được vào mọi repo bạn có quyền. Quy tắc: <code>ed25519</code>, có passphrase (dùng <code>ssh-agent</code> để mỗi phiên chỉ gõ một lần), mỗi máy một khoá có ghi chú là máy nào, và xoá khoá của máy không còn dùng. Tạo khoá đầu tiên ở ')}${cs('git', 'git-0-3-cai-dat-cau-hinh', 'Git 0.3')}.</p>
<p>${t('A small inventory script — it tells whether each key has a passphrase by trying to read it with an empty one:', 'Một script kiểm kê nhỏ — nó biết khoá nào có passphrase bằng cách thử đọc khoá với passphrase rỗng:')}</p>
${bash(MA.kiemKe)}
${out(RA.ssh)}
<p>${t('Then on GitHub: <em>Settings → SSH and GPG keys</em> — every key listed there should match a machine you use today; delete the rest. Server-side protections (who can access the repo) are in ', 'Rồi trên GitHub: <em>Settings → SSH and GPG keys</em> — mỗi khoá trong danh sách phải ứng với một máy bạn đang dùng; xoá phần còn lại. Các lớp bảo vệ phía máy chủ (ai vào được repo) ở ')}${cs('git', 'git-11-4-bao-mat-kho', 'Git 11.3')}.</p>

<h3>${t('4. Tokens: smallest scope, shortest life', '4. Token: phạm vi nhỏ nhất, thời hạn ngắn nhất')}</h3>
${bang([t('Kind', 'Loại'), t('Looks like', 'Trông như'), t('Scope', 'Phạm vi'), t('Use when', 'Dùng khi')], [
    [t('GitHub classic PAT', 'GitHub PAT cổ điển'), '<code>ghp_…</code>', t('Broad: e.g. <code>repo</code> = every repo you can access', 'Rộng: ví dụ <code>repo</code> = mọi repo bạn có quyền'), t('Avoid for new work', 'Tránh dùng cho việc mới')],
    [t('GitHub fine-grained PAT', 'GitHub PAT chi tiết (fine-grained)'), '<code>github_pat_…</code>', t('Chosen repositories, chosen permissions, mandatory expiry', 'Repo được chọn, quyền được chọn, bắt buộc có hạn'), t('Scripts and tools that need API access', 'Script và công cụ cần gọi API')],
    [t('Login via CLI / credential manager', 'Đăng nhập qua CLI / trình quản lý thông tin đăng nhập'), t('<code>gh auth login</code>, Git Credential Manager', '<code>gh auth login</code>, Git Credential Manager'), t('Stored in the OS keychain, revocable', 'Cất trong kho khoá của hệ điều hành, thu hồi được'), t('Everyday HTTPS git', 'Dùng git qua HTTPS hằng ngày')],
    [t('Cloud keys (AWS, GCP…)', 'Khoá đám mây (AWS, GCP…)'), '<code>AKIA…</code>', t('Whatever the IAM policy allows', 'Tuỳ chính sách IAM cho phép'), t('Prefer short-lived credentials via SSO; never in code', 'Ưu tiên thông tin ngắn hạn qua SSO; không bao giờ để trong mã')],
  ])}
<ul>
<li>${t('Never put a token in code, a <code>.env</code> that is committed, a ticket, chat or screenshot. Where secrets should live for a running app: ', 'Không bao giờ để token trong mã, trong <code>.env</code> có commit, trong ticket, chat hay ảnh chụp màn hình. Bí mật của ứng dụng đang chạy nên nằm ở đâu: ')}${cs('authentication', 'auth-11-1-bi-mat', t('Authentication 11.1', 'Xác thực 11.1'))}; ${t('where secrets leak without any attack: ', 'bí mật rò ra mà chẳng cần ai tấn công: ')}${cs('authentication', 'auth-1-5-bi-mat-ro-o-dau', '1.5')}.</li>
<li>${t('Set an expiry even when it is optional; 30–90 days for personal tools is plenty. Name the token after its purpose ("ci-report-script, repo X, read-only").', 'Đặt hạn kể cả khi không bắt buộc; 30–90 ngày cho công cụ cá nhân là đủ. Đặt tên token theo mục đích ("ci-report-script, repo X, chỉ đọc").')}</li>
<li>${t('Leaked? <strong>Revoke first</strong>, then clean up — deleting the commit does not un-leak it (lesson 10.7, ', 'Bị lộ? <strong>Thu hồi trước</strong>, dọn sau — xoá commit không làm token "hết lộ" (bài 10.7, ')}${cs('git', 'git-8-3-go-bi-mat', 'Git 8.3')}).</li>
</ul>

<h3>${t('5. Two identities on one laptop', '5. Hai danh tính trên một laptop')}</h3>
<p>${t(
    'Many developers have one GitHub account for work and one for personal projects. Mixing them leaks your company e-mail into personal repos (lesson 10.1) or pushes personal experiments to the customer\'s organisation. Separate them with <code>includeIf</code> per folder and a different SSH key per account (',
    'Nhiều lập trình viên có một tài khoản GitHub cho công việc và một cho dự án cá nhân. Trộn lẫn sẽ làm email công ty lọt vào repo cá nhân (bài 10.1) hoặc đẩy thử nghiệm cá nhân lên tổ chức của khách. Tách chúng bằng <code>includeIf</code> theo thư mục và mỗi tài khoản một SSH key (')}${cs('git', 'git-14-3-cau-hinh', 'Git 14.3')}). ${t('If your company requires a dedicated work account, that is the simplest separation of all.', 'Nếu công ty bắt dùng tài khoản riêng cho công việc thì đó là cách tách đơn giản nhất.')}</p>

<h3>${t('Review every three months (15 minutes)', 'Ba tháng soát một lần (15 phút)')}</h3>
${bang([t('Where (GitHub)', 'Ở đâu (GitHub)'), t('Look for', 'Tìm gì')], [
    ['<code>Settings → Password and authentication</code>', t('2FA on, passkey/security key added, recovery codes saved', 'Đã bật 2FA, đã thêm passkey/khoá bảo mật, đã lưu mã khôi phục')],
    ['<code>Settings → Sessions</code>', t('Devices and locations you do not recognise ⇒ revoke', 'Thiết bị và vị trí lạ ⇒ thu hồi')],
    ['<code>Settings → SSH and GPG keys</code>', t('Keys of old machines ⇒ delete', 'Khoá của máy cũ ⇒ xoá')],
    ['<code>Settings → Developer settings → Personal access tokens</code>', t('Tokens without expiry, unused, too broad ⇒ delete or replace', 'Token không có hạn, không dùng, quyền quá rộng ⇒ xoá hoặc thay')],
    ['<code>Settings → Applications</code>', t('OAuth apps and GitHub Apps you no longer use ⇒ revoke', 'Ứng dụng OAuth và GitHub App không còn dùng ⇒ thu hồi')],
    ['<code>Settings → Security log</code>', t('Events you did not do', 'Sự kiện bạn không hề làm')],
  ])}
<p>${t('Lab 10.8 turns this table into a checklist you fill in for your real accounts.', 'Lab 10.8 biến bảng này thành checklist bạn điền cho tài khoản thật của mình.')}</p>

<h3>${t('Hacker\'s corner: the token in the CI log', 'Góc hacker: token trong log CI')}</h3>
<p>${t(
    'A common real-world chain: a developer adds <code>set -x</code> or <code>echo $TOKEN</code> to debug a pipeline; the token appears in a public CI log or a screenshot posted in a group chat; bots that scan public sources pick it up within minutes and use it. GitHub masks registered secrets in Actions logs, but not values you build by hand or print in another encoding. Debug with a redacted value (<code>&#36;{TOKEN:0:4}…</code>) and treat any token that ever appeared on screen in a shared space as leaked.',
    'Một chuỗi hay gặp ngoài đời: dev thêm <code>set -x</code> hay <code>echo $TOKEN</code> để gỡ lỗi pipeline; token hiện trong log CI công khai hoặc trong ảnh chụp gửi nhóm chat; bot quét nguồn công khai nhặt được trong vài phút và dùng luôn. GitHub che các secret đã đăng ký trong log Actions, nhưng không che giá trị bạn tự ghép hay in ra dưới dạng mã hoá khác. Gỡ lỗi bằng giá trị đã che (<code>&#36;{TOKEN:0:4}…</code>) và coi mọi token từng hiện trên màn hình ở chỗ dùng chung là đã lộ.')}</p>

<h3>${t('Situation at work', 'Tình huống đi làm')}</h3>
<p>${t(
    'Your leader asks you to write a script that reads issues from the customer\'s repo every night. A teammate says "just use my classic token, it works for everything". What do you do? — Do not borrow someone else\'s token (the audit log would show them doing your actions). Ask how the project issues machine credentials; if a personal token is allowed, create a fine-grained one limited to that repo, read-only on issues, with an expiry, stored in the CI secret store — and write down when it expires.',
    'Leader nhờ bạn viết script đọc issue từ repo của khách mỗi đêm. Đồng đội bảo "dùng tạm token cổ điển của anh, cái gì cũng chạy". Bạn làm gì? — Không mượn token người khác (nhật ký kiểm toán sẽ ghi họ làm việc của bạn). Hỏi dự án cấp thông tin đăng nhập cho máy theo cách nào; nếu được dùng token cá nhân thì tạo token fine-grained chỉ cho repo đó, chỉ đọc issue, có hạn, cất trong kho secret của CI — và ghi lại ngày hết hạn.')}</p>

<h3>${t('Exercise', 'Bài tập')}</h3>
<ol>
<li>${t('Run <code>kiem-ke.sh</code> on your own <code>~/.ssh</code>. How many keys, how many without a passphrase?', 'Chạy <code>kiem-ke.sh</code> trên <code>~/.ssh</code> của bạn. Bao nhiêu khoá, bao nhiêu khoá không có passphrase?')}</li>
<li>${t('At 23:10 your phone shows three GitHub sign-in approvals in a row. What do you do, in order?', 'Lúc 23:10 điện thoại hiện liền ba yêu cầu duyệt đăng nhập GitHub. Bạn làm gì, theo thứ tự?')}</li>
<li>${t('Which token would you create for a script that only comments on pull requests in one repo?', 'Bạn tạo token nào cho script chỉ bình luận vào pull request trong một repo?')}</li>
</ol>
${giai(t('Answers', 'Đáp án'), `<ol>
<li>${t('Any key without a passphrase: add one with <code>ssh-keygen -p -f &lt;key&gt;</code>, or replace it if you do not know where it has been copied.', 'Khoá nào chưa có passphrase: thêm bằng <code>ssh-keygen -p -f &lt;khoá&gt;</code>, hoặc thay khoá mới nếu không biết nó từng được chép đi đâu.')}</li>
<li>${t('Deny all; change the password from a trusted device; check Sessions and Security log; revoke unknown sessions; report to your company security channel if the account has access to work repos.', 'Từ chối hết; đổi mật khẩu từ thiết bị tin cậy; xem Sessions và Security log; thu hồi phiên lạ; báo kênh an ninh công ty nếu tài khoản có quyền vào repo công việc.')}</li>
<li>${t('Fine-grained PAT: that one repository, Pull requests: read and write, nothing else, with an expiry.', 'PAT fine-grained: đúng repo đó, Pull requests: đọc và ghi, không quyền nào khác, có hạn.')}</li>
</ol>`)}

${phongVan([
    [t('How do you manage credentials as a developer?', 'Bạn quản lý thông tin đăng nhập thế nào với tư cách lập trình viên?'), t('Password manager with unique passwords, phishing-resistant 2FA where possible, SSH keys with passphrases per machine, fine-grained tokens with expiry stored in secret stores, and a periodic review of sessions, keys and tokens.', 'Trình quản lý mật khẩu, mỗi nơi một mật khẩu; 2FA chống lừa đảo khi có thể; SSH key có passphrase, mỗi máy một khoá; token fine-grained có hạn, cất trong kho secret; định kỳ soát phiên, khoá và token.')],
    [t('What is MFA fatigue and how do you defend against it?', 'MFA fatigue là gì và chống thế nào?'), t('Flooding a user with push approvals until they accept one (Uber 2022). Never approve unexpected prompts; services should use number matching or phishing-resistant factors.', 'Dội liên tục yêu cầu duyệt đẩy cho tới khi người dùng bấm nhận (Uber 2022). Không bao giờ duyệt yêu cầu bất ngờ; dịch vụ nên dùng so khớp số hoặc yếu tố chống lừa đảo.')],
    [t('Why should a personal access token have an expiry?', 'Vì sao personal access token nên có hạn?'), t('It limits the damage window if it leaks unnoticed, and forces a periodic review of whether it is still needed.', 'Giới hạn khoảng thời gian bị khai thác nếu lộ mà không ai biết, và buộc định kỳ xem nó còn cần không.')],
  ], en)}

${thuatNgu([
    [t('Password manager', 'Trình quản lý mật khẩu'), t('Encrypted vault generating and storing a unique password per site', 'Kho mã hoá sinh và cất mỗi trang một mật khẩu riêng')],
    [t('Passkey / FIDO2', 'Passkey / FIDO2'), t('Public-key credential bound to a site\'s domain; resists phishing', 'Thông tin đăng nhập khoá công khai gắn với tên miền trang; chống lừa đảo')],
    ['TOTP', t('Time-based one-time password (6-digit codes)', 'Mật khẩu dùng một lần theo thời gian (mã 6 số)')],
    ['MFA fatigue', t('Spamming push approvals until the victim accepts', 'Dội yêu cầu duyệt đẩy tới khi nạn nhân bấm nhận')],
    ['PAT', t('Personal access token — a password for scripts, ideally scoped and expiring', 'Token truy cập cá nhân — mật khẩu cho script, nên giới hạn phạm vi và có hạn')],
    ['ssh-agent', t('Process holding decrypted keys in memory so you type the passphrase once', 'Tiến trình giữ khoá đã giải mã trong bộ nhớ để chỉ gõ passphrase một lần')],
  ], en)}

${tomTat([
    t('Unique passwords from a manager; change on compromise, not on a calendar.', 'Mật khẩu riêng cho từng nơi bằng trình quản lý; đổi khi bị lộ, không đổi theo lịch.'),
    t('Prefer passkeys/security keys; never approve a prompt you did not start; keep recovery codes off the laptop.', 'Ưu tiên passkey/khoá bảo mật; không duyệt yêu cầu mình không tạo; cất mã khôi phục ngoài laptop.'),
    t('SSH: ed25519 + passphrase, one key per machine, delete old ones.', 'SSH: ed25519 + passphrase, mỗi máy một khoá, xoá khoá cũ.'),
    t('Tokens: fine-grained, minimal permissions, expiry, never in code; leaked ⇒ revoke first.', 'Token: fine-grained, quyền tối thiểu, có hạn, không để trong mã; lộ ⇒ thu hồi trước.'),
    t('Review sessions, keys, tokens and apps every three months.', 'Ba tháng soát phiên, khoá, token và ứng dụng một lần.'),
  ], en)}
<p>${t('Next', 'Tiếp theo')}: ${ag('agl-10-6-lua-dao', t('10.6 — phishing and social engineering aimed at developers', '10.6 — lừa đảo nhắm vào lập trình viên'))}.</p>
`);
};
