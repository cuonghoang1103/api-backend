/**
 * 10.7 — Sự cố rò rỉ thật và bài học (agl-10-7-su-co-that). Soạn 24/11/2026, agent agl.
 * Chạy thật: repo thử scratchpad/agl/lab/ch10/repo-lo (khoá giả sinh ngẫu nhiên, đã che khi in): git log -S / git show → RA.keXauDocLichSu;
 * gitleaks v8.30.1 (docker zricethezav/gitleaks, --network none, --memory 2g) → RA.gitleaksDir, RA.gitleaksGit, RA.gitleaksAll;
 * quet-bi-mat.mjs tự viết (Node 22.22.2) → RA.quetTuViet. Điểm đáng dạy: gitleaks KHÔNG bắt chuỗi kết nối postgres://user:pass@…, bộ tự viết bắt.
 * Nguồn: FTC 11/04/2018 (Uber — thoả thuận mở rộng; xâm nhập 13/10–15/11/2016, khoá truy cập trong repo GitHub riêng tư, tài khoản GitHub
 * cá nhân của kỹ sư, không bắt MFA, trả 100.000 USD qua bug bounty, công bố 11/2017; >25 triệu tên + email, 22 triệu tên + SĐT, 600.000 GPLX);
 * Toyota 07/10/2022 (The Register 11/10/2022, TechCrunch 12/10/2022: nhà thầu đăng một phần mã T-Connect lên GitHub 12/2017–15/09/2022,
 * khoá truy cập máy chủ dữ liệu, 296.019 email + mã quản lý khách, đổi khoá 17/09/2022); CircleCI 13/01/2023 (báo cáo sự cố: mã độc trên
 * laptop kỹ sư 16/12/2022 lấy cookie phiên SSO đã qua 2FA; khách phải xoay mọi bí mật).
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, cs, ag, ng, vo, bash, js, out } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L107 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 10 · Information security at work', 'Chương 10 · An ninh thông tin khi đi làm', `
<h2>${t('10.7 — Real leaks and what they teach: secrets in repos, lost devices, pasted code', '10.7 — Sự cố rò rỉ thật và bài học: bí mật trong repo công khai, mất thiết bị, dán code')}</h2>
<p class="lead">${t(
    'Large breaches are rarely the work of a genius attacker against a well-defended company. Read the official reports and the same picture keeps coming back: one person, one convenient action — a key in a config file, a repo pushed "temporarily", a laptop with a stolen session, a code paste — and a missing safety net. This lesson walks through three cases with primary sources, then reproduces the key-in-the-repo mistake on a test repository so you can see exactly what an attacker sees and what the tools catch.',
    'Các vụ rò rỉ lớn hiếm khi là chiến công của một kẻ tấn công thiên tài trước một công ty phòng thủ tốt. Đọc báo cáo chính thức, cùng một bức tranh cứ lặp lại: một người, một thao tác tiện tay — khoá trong tệp cấu hình, repo đẩy lên "tạm", laptop bị lấy phiên đăng nhập, một lần dán mã — và một tấm lưới an toàn bị thiếu. Bài này đi qua ba vụ có nguồn gốc, rồi tái hiện lỗi "khoá trong repo" trên một repo thử để bạn thấy đúng thứ kẻ tấn công thấy và công cụ bắt được gì.')}</p>

<h3>${t('Case 1 — Uber, 2016: reused passwords → GitHub → AWS key', 'Vụ 1 — Uber, 2016: mật khẩu dùng lại → GitHub → khoá AWS')}</h3>
<p>${t(
    'According to the US Federal Trade Commission\'s revised complaint (April 2018), between 13 October and 15 November 2016 intruders logged into a private GitHub repository used by Uber engineers, through an engineer\'s personal GitHub account, using a password exposed in an earlier, unrelated breach. Uber had no policy against reusing credentials and did not require multi-factor authentication for GitHub. In the repository they found an access key in plain text that opened Uber\'s Amazon S3 storage, and downloaded unencrypted files with more than 25 million names and e-mail addresses, 22 million names and phone numbers, and 600,000 driver\'s licence numbers. Uber paid the intruders $100,000 through its bug-bounty programme and did not disclose the breach until November 2017.',
    'Theo đơn khiếu nại sửa đổi của Uỷ ban Thương mại Liên bang Mỹ (FTC, tháng 4/2018), từ 13/10 đến 15/11/2016, kẻ xâm nhập đăng nhập vào một repo GitHub riêng tư mà kỹ sư Uber dùng, thông qua tài khoản GitHub cá nhân của một kỹ sư, bằng mật khẩu đã lộ từ một vụ rò rỉ khác không liên quan. Uber không có quy định cấm dùng lại mật khẩu và không bắt xác thực nhiều yếu tố cho GitHub. Trong repo, chúng thấy một khoá truy cập dạng chữ thường mở được kho Amazon S3 của Uber, và tải về các tệp không mã hoá chứa hơn 25 triệu tên và email, 22 triệu tên và số điện thoại, 600.000 số giấy phép lái xe. Uber trả kẻ xâm nhập 100.000 USD qua chương trình bug bounty và không công bố vụ việc cho tới tháng 11/2017.')}
${ng('https://www.ftc.gov/news-events/press-releases/2018/04/uber-agrees-expanded-settlement-ftc-related-privacy-security', 'FTC, 11/04/2018')}</p>

<h3>${t('Case 2 — Toyota T-Connect, 2017–2022: a contractor\'s public repo', 'Vụ 2 — Toyota T-Connect, 2017–2022: repo công khai của nhà thầu')}</h3>
<p>${t(
    'On 7 October 2022 Toyota announced that a development subcontractor had published part of the source code of its T-Connect user site on GitHub — by mistake — in December 2017. The code contained an access key to the data server. Until the repository was made private on 15 September 2022, anyone who found the key could have accessed 296,019 customers\' e-mail addresses and customer management numbers. Toyota changed the key on 17 September and said it could not rule out that the data had been accessed. Almost five years — and the person who pushed it was not even a Toyota employee.',
    'Ngày 07/10/2022, Toyota thông báo một nhà thầu phát triển đã — do nhầm lẫn — đăng một phần mã nguồn trang người dùng T-Connect lên GitHub từ tháng 12/2017. Mã có chứa khoá truy cập máy chủ dữ liệu. Cho tới khi repo bị chuyển sang riêng tư ngày 15/09/2022, ai tìm thấy khoá cũng có thể truy cập 296.019 địa chỉ email và mã quản lý khách hàng. Toyota đổi khoá ngày 17/09 và cho biết không thể loại trừ khả năng dữ liệu đã bị truy cập. Gần năm năm — và người đẩy mã lên thậm chí không phải nhân viên Toyota.')}
${ng('https://www.theregister.com/2022/10/11/toyota_source_code_email_leak/', 'The Register, 11/10/2022')} · ${ng('https://techcrunch.com/2022/10/12/toyota-customer-email-addresses-exposed/', 'TechCrunch, 12/10/2022')}</p>
${cl('warn', t('You will be that subcontractor. In outsourcing, the vendor\'s developer pushing code is exactly the role this lesson is training you for — and the customer\'s name is what ends up in the headline.', 'Bạn sẽ chính là nhà thầu đó. Trong outsourcing, lập trình viên của vendor đẩy mã lên chính là vai trò bài này đang huấn luyện bạn — còn tên khách hàng mới là thứ lên trang nhất.'))}

<h3>${t('Case 3 — CircleCI, 2022–2023: 2FA did not help, because the session was stolen', 'Vụ 3 — CircleCI, 2022–2023: 2FA không cứu được, vì phiên đăng nhập đã bị lấy')}</h3>
<p>${t(
    'CircleCI\'s incident report (January 2023) says malware was deployed on an engineer\'s laptop on 16 December 2022 and was not detected by antivirus. It stole a single-sign-on session cookie that had <em>already passed 2FA</em>, so the attacker could act as the engineer without logging in. Using the engineer\'s privileges, the attacker stole data from some of the company\'s databases and stores, including customers\' environment variables, tokens and keys. CircleCI told all customers to rotate every secret stored on the platform — every team using it spent the first days of 2023 doing exactly that.',
    'Báo cáo sự cố của CircleCI (tháng 1/2023) cho biết mã độc được cài lên laptop của một kỹ sư ngày 16/12/2022 và phần mềm diệt virus không phát hiện. Nó lấy cắp cookie phiên đăng nhập một lần (SSO) <em>đã qua bước 2FA</em>, nên kẻ tấn công hành động như kỹ sư mà không cần đăng nhập. Dùng quyền của kỹ sư, chúng lấy dữ liệu từ một số database và kho lưu trữ của công ty, gồm biến môi trường, token và khoá của khách hàng. CircleCI yêu cầu mọi khách hàng xoay (thay) toàn bộ bí mật lưu trên nền tảng — đội nào dùng CircleCI cũng phải dành những ngày đầu năm 2023 làm đúng việc đó.')}
${ng('https://circleci.com/blog/jan-4-2023-incident-report/', 'CircleCI incident report, 01/2023')}</p>

<h3>${t('The pattern', 'Điểm chung')}</h3>
${bang([t('Case', 'Vụ'), t('One person, one convenient action', 'Một người, một thao tác tiện tay'), t('Missing safety net', 'Lưới an toàn bị thiếu'), t('What you can do', 'Bạn làm được gì')], [
    ['Uber 2016', t('Reused password; access key committed to a repo', 'Dùng lại mật khẩu; khoá truy cập commit vào repo'), t('MFA not enforced; no secret scanning; long-lived key', 'Không bắt MFA; không quét bí mật; khoá sống lâu'), t('Password manager + 2FA (10.5); never commit keys; scan (below)', 'Trình quản lý mật khẩu + 2FA (10.5); không commit khoá; quét (dưới đây)')],
    ['Toyota 2017–22', t('Subcontractor pushed code to a public repo', 'Nhà thầu đẩy mã lên repo công khai'), t('Nobody watching public GitHub for the company\'s code; key not rotated for 5 years', 'Không ai theo dõi GitHub công khai tìm mã của công ty; khoá 5 năm không đổi'), t('No customer code in personal repos (10.3); pre-commit scan', 'Không đưa mã khách vào repo cá nhân (10.3); quét trước commit')],
    ['CircleCI 2022–23', t('Malware on an engineer\'s laptop', 'Mã độc trên laptop kỹ sư'), t('Long-lived sessions; broad privileges', 'Phiên sống lâu; quyền quá rộng'), t('Managed device only (10.4); report oddities fast (10.2)', 'Chỉ dùng thiết bị được quản lý (10.4); báo điều bất thường thật nhanh (10.2)')],
    ['Samsung 2023', t('Engineers pasted code into ChatGPT', 'Kỹ sư dán mã vào ChatGPT'), t('No approved tool or rule at the time', 'Lúc đó chưa có công cụ được duyệt hay quy định'), t('Approved tools only, check before paste (10.3)', 'Chỉ dùng công cụ được duyệt, soát trước khi dán (10.3)')],
    ['Amagasaki 2022', t('Copied data to USB and took it out', 'Chép dữ liệu ra USB và mang ra ngoài'), t('USB not blocked; process allowed off-site copies', 'Không chặn USB; quy trình cho chép mang ra ngoài'), t('Never carry data out (10.4)', 'Không bao giờ mang dữ liệu ra ngoài (10.4)')],
  ])}

<h3>${t('Reproduce it: what the attacker sees (run for real)', 'Tái hiện: kẻ tấn công thấy gì (chạy thật)')}</h3>
<p>${t('A test repository with three commits: initial code; a <code>config.js</code> with an AWS-style key pair and a GitHub token (randomly generated, fake); then "fix: remove config.js" with a <code>.gitignore</code>. The current folder looks clean. Anyone who clones it can still do this (values masked here):', 'Một repo thử có ba commit: mã ban đầu; tệp <code>config.js</code> chứa cặp khoá kiểu AWS và một token GitHub (sinh ngẫu nhiên, giả); rồi "fix: xoá config.js" kèm <code>.gitignore</code>. Thư mục hiện tại trông sạch. Ai clone repo vẫn làm được thế này (giá trị đã che ở đây):')}</p>
${out(RA.keXauDocLichSu)}
<p>${t('Attackers do not even need to clone: bots watch the public GitHub event stream and scan every new push within minutes.', 'Kẻ tấn công thậm chí không cần clone: bot theo dõi luồng sự kiện công khai của GitHub và quét mọi lần push mới trong vài phút.')}</p>

<h3>${t('What the scanners see', 'Công cụ quét thấy gì')}</h3>
<p>${t('gitleaks v8.30.1, run in a container without network. First on the folder only, then on the git history:', 'gitleaks v8.30.1, chạy trong container không mạng. Trước hết chỉ quét thư mục, sau đó quét lịch sử git:')}</p>
${bash(MA.gl)}
${out('$ ./gl.sh repo-lo dir . --no-banner\n' + RA.gitleaksDir)}
${out('$ ./gl.sh repo-lo git . --no-banner --redact -v\n' + RA.gitleaksGit)}
<p>${t('"No leaks found" in the folder, three leaks in history — the deletion commit changed nothing. To understand what such a tool does, here is a 40-line scanner of our own: read every added line in the history of all branches, apply a few patterns, and use Shannon entropy to tell a random key from an ordinary word:', 'Thư mục "no leaks found", lịch sử thì ba chỗ lộ — commit xoá tệp không thay đổi gì. Để hiểu công cụ kiểu này làm gì, đây là bộ quét 40 dòng tự viết: đọc mọi dòng được thêm trong lịch sử của mọi nhánh, áp vài mẫu, và dùng entropy Shannon để phân biệt khoá ngẫu nhiên với chữ bình thường:')}</p>
${js(MA.quetBiMat)}
<p>${t('A fourth commit was added on another branch: a PostgreSQL connection string with an embedded password.', 'Thêm commit thứ tư trên nhánh khác: một chuỗi kết nối PostgreSQL có nhúng mật khẩu.')}</p>
${out('$ node quet-bi-mat.mjs repo-lo\n' + RA.quetTuViet)}
${out('$ ./gl.sh repo-lo git . --no-banner --redact -v --log-opts="--all" | grep -E "RuleID|commits scanned|leaks found"\n' + RA.gitleaksAll.split('\n').filter((l) => l.startsWith('RuleID') || /commits scanned|leaks found/.test(l)).join('\n'))}
${note(t('Our scanner found the database password in the connection string; gitleaks with its default rules, on this sample, did not — while gitleaks has dozens of provider-specific rules ours lacks. No scanner catches everything. Use one in a pre-commit hook <em>and</em> keep secrets out of code by design (environment, secret store).', 'Bộ quét tự viết tìm ra mật khẩu database trong chuỗi kết nối; gitleaks với bộ luật mặc định, trên mẫu này, thì không — trong khi gitleaks có hàng chục luật riêng cho từng nhà cung cấp mà bộ của ta không có. Không công cụ quét nào bắt được hết. Dùng một công cụ trong hook pre-commit <em>và</em> thiết kế để bí mật không nằm trong mã ngay từ đầu (biến môi trường, kho bí mật).'))}

<h3>${t('Stop it before the commit', 'Chặn trước khi commit')}</h3>
${bash(MA.preCommit)}
${out('$ git config core.hooksPath .githooks\n$ git add token.js .githooks\n$ git commit -m "feat: goi API GitHub"\n' + `Finding:     const t = 'REDACTED';
Secret:      REDACTED
RuleID:      github-pat
Entropy:     4.703056
File:        token.js
Line:        1
Fingerprint: token.js:github-pat:1

8:34AM INF 0 commits scanned.
8:34AM INF scanned ~275 bytes (275 bytes) in 83.4ms
8:34AM WRN leaks found: 1
[exit 1]
$ git log --oneline
fatal: your current branch 'main' does not have any commits yet`)}
<p>${t('The hook refused the commit; the token never entered history. Team-wide versions (GitHub push protection, CI scans) are in ', 'Hook từ chối commit; token chưa từng vào lịch sử. Các phiên bản cho cả đội (push protection của GitHub, quét trong CI) ở ')}${cs('git', 'git-11-4-bao-mat-kho', 'Git 11.3')} ${t('and', 'và')} ${cs('devsecops', 'dso-2-2-pre-commit', 'DevSecOps 2.2')}.</p>

<h3>${t('If it already leaked: the order matters', 'Nếu đã lộ: thứ tự là quan trọng')}</h3>
<ol>
<li>${t('<strong>Report</strong> to your leader/security channel (lesson 10.2) — the key may belong to the customer.', '<strong>Báo cáo</strong> leader/kênh an ninh (bài 10.2) — khoá có thể là của khách.')}</li>
<li>${t('<strong>Revoke/rotate</strong> the secret at its source (AWS IAM, GitHub tokens page, DB user). This is the step that actually stops the damage.', '<strong>Thu hồi/xoay</strong> bí mật tại nơi cấp nó (AWS IAM, trang token của GitHub, user DB). Đây là bước thật sự chặn thiệt hại.')}</li>
<li>${t('<strong>Check usage logs</strong> since the commit date (CloudTrail, GitHub security log, DB logs) to know whether it was used.', '<strong>Xem nhật ký sử dụng</strong> từ ngày commit (CloudTrail, security log GitHub, log DB) để biết nó đã bị dùng chưa.')}</li>
<li>${t('<strong>Then</strong> clean the history if the project decides to — ', '<strong>Sau đó</strong> mới dọn lịch sử nếu dự án quyết định — ')}${cs('git', 'git-8-3-go-bi-mat', 'Git 8.3')}${t(' — knowing that forks, clones and caches may still hold it.', ' — và hiểu rằng fork, bản clone và bộ đệm vẫn có thể còn giữ nó.')}</li>
</ol>
${cl('danger', t('Deleting the file, force-pushing and saying nothing is the worst option: the key still works, the copies still exist, and the next time anyone finds it, the cover-up becomes the story — as it did for Uber.', 'Xoá tệp, force-push rồi im lặng là lựa chọn tệ nhất: khoá vẫn dùng được, bản sao vẫn còn, và lần tới có ai tìm ra thì việc che giấu mới thành tin chính — như chuyện của Uber.'))}

<h3>${t('Situation at work', 'Tình huống đi làm')}</h3>
<p>${t(
    'During code review you notice that a teammate\'s PR — already merged to <code>develop</code> yesterday — contains the staging database password. What do you do? — Comment on the PR and message the teammate and leader privately now (not in the big group chat); the leader arranges rotation of the password with whoever owns staging; then a follow-up PR moves it to configuration. Do not try to rewrite <code>develop</code> yourself.',
    'Lúc review code, bạn thấy PR của đồng đội — đã merge vào <code>develop</code> từ hôm qua — chứa mật khẩu database staging. Bạn làm gì? — Bình luận trong PR và nhắn riêng đồng đội cùng leader ngay (không nói trong nhóm chat đông người); leader sắp xếp đổi mật khẩu với người quản lý staging; sau đó một PR khác chuyển nó sang cấu hình. Đừng tự viết lại lịch sử <code>develop</code>.')}</p>

<h3>${t('Exercise', 'Bài tập')}</h3>
<ol>
<li>${t('Add a rule to <code>quet-bi-mat.mjs</code> for Slack tokens (<code>xox[baprs]-</code> followed by digits, letters and dashes) and test it on a new commit.', 'Thêm luật vào <code>quet-bi-mat.mjs</code> cho token Slack (<code>xox[baprs]-</code> theo sau là số, chữ và gạch ngang) rồi thử trên một commit mới.')}</li>
<li>${t('Why did the Toyota key remain dangerous for five years even though the code was "only" part of a website?', 'Vì sao khoá của Toyota nguy hiểm suốt năm năm dù mã "chỉ" là một phần của website?')}</li>
<li>${t('In the CircleCI case, why did 2FA not stop the attacker?', 'Trong vụ CircleCI, vì sao 2FA không chặn được kẻ tấn công?')}</li>
</ol>
${giai(t('Answers', 'Đáp án'), `<ol>
<li>${t('For example <code>[\'slack-token\', /\\bxox[baprs]-[0-9A-Za-z-]{10,}/, 0]</code> placed before the generic rule.', 'Ví dụ <code>[\'slack-token\', /\\bxox[baprs]-[0-9A-Za-z-]{10,}/, 0]</code> đặt trước luật chung.')}</li>
<li>${t('A key is valid until rotated, regardless of where the code came from; nobody rotated it because nobody knew it was public.', 'Khoá còn hiệu lực tới khi bị xoay, bất kể mã đến từ đâu; không ai xoay vì không ai biết nó đã công khai.')}</li>
<li>${t('The malware stole a session cookie created <em>after</em> 2FA; a valid session needs no second factor. Defences: managed, monitored devices; short sessions; re-authentication for sensitive actions.', 'Mã độc lấy cookie phiên tạo ra <em>sau</em> bước 2FA; phiên hợp lệ thì không cần yếu tố thứ hai. Phòng: thiết bị được quản lý, giám sát; phiên ngắn; xác thực lại cho thao tác nhạy cảm.')}</li>
</ol>`)}

${phongVan([
    [t('You accidentally committed an API key and pushed it. What do you do?', 'Bạn lỡ commit một API key và đã push. Bạn làm gì?'), t('Report it, revoke/rotate the key immediately, check logs for use since the push, then clean history if required — rotation first, because history rewriting does not remove copies.', 'Báo cáo, thu hồi/xoay khoá ngay, xem log từ lúc push xem có bị dùng không, rồi dọn lịch sử nếu cần — xoay khoá trước, vì viết lại lịch sử không xoá được các bản sao.')],
    [t('Why is deleting a secret in a new commit not enough?', 'Vì sao xoá bí mật bằng một commit mới là chưa đủ?'), t('Git keeps every version; <code>git log -p</code>/<code>git show</code> or any scanner of history recovers it, and clones/forks already have it.', 'Git giữ mọi phiên bản; <code>git log -p</code>/<code>git show</code> hay công cụ quét lịch sử lấy lại được, và các bản clone/fork đã có nó.')],
    [t('Tell me about a real security incident and what you learned.', 'Kể một sự cố bảo mật thật và bạn học được gì.'), t('E.g. Uber 2016: reused password, no MFA on GitHub, AWS key in a repo — so I use a password manager and 2FA, keep secrets out of code, and run a secret scanner before commits.', 'Ví dụ Uber 2016: dùng lại mật khẩu, GitHub không bắt MFA, khoá AWS trong repo — nên tôi dùng trình quản lý mật khẩu và 2FA, không để bí mật trong mã, và chạy công cụ quét bí mật trước khi commit.')],
  ], en)}

${thuatNgu([
    [t('Secret scanning', 'Quét bí mật'), t('Searching code and history for credentials', 'Tìm thông tin đăng nhập trong mã và lịch sử')],
    [t('Rotation', 'Xoay khoá (rotation)'), t('Replacing a secret with a new one and invalidating the old', 'Thay bí mật bằng cái mới và vô hiệu cái cũ')],
    [t('Pre-commit hook', 'Hook pre-commit'), t('Script git runs before creating a commit; non-zero exit blocks it', 'Script git chạy trước khi tạo commit; thoát khác 0 là chặn')],
    [t('Shannon entropy', 'Entropy Shannon'), t('Measure of randomness per character; random keys score high', 'Độ ngẫu nhiên trên mỗi ký tự; khoá ngẫu nhiên có điểm cao')],
    [t('Session hijacking', 'Chiếm phiên'), t('Using a stolen session cookie/token instead of logging in', 'Dùng cookie/token phiên bị lấy cắp thay vì đăng nhập')],
  ], en)}

${tomTat([
    t('Big leaks start with one person and one convenient action; the fix is habits plus safety nets.', 'Rò rỉ lớn bắt đầu từ một người và một thao tác tiện tay; cách chữa là thói quen cộng lưới an toàn.'),
    t('Deleting a file does not remove it from history; scan history, not just the folder.', 'Xoá tệp không xoá khỏi lịch sử; quét lịch sử, không chỉ thư mục.'),
    t('No scanner catches everything — use one in a pre-commit hook and keep secrets out of code.', 'Không công cụ quét nào bắt hết — dùng một cái trong hook pre-commit và không để bí mật trong mã.'),
    t('Leaked: report, rotate, check logs, then clean — never hide.', 'Đã lộ: báo cáo, xoay khoá, xem log, rồi mới dọn — không bao giờ giấu.'),
  ], en)}
<p>${t('Next', 'Tiếp theo')}: ${ag('agl-10-8-lab', t('10.8 — Lab: your personal security check-up', '10.8 — Lab: tự kiểm tra an ninh cá nhân'))}.</p>
`);
};
