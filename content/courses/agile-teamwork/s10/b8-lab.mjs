/**
 * 10.8 — Lab: Tự kiểm tra an ninh cá nhân (agl-10-8-lab). Soạn 24/11/2026, agent agl.
 * Mọi lệnh trong lab đã chạy thật trên repo/HOME thử ở scratchpad/agl/lab/ch10 (gitleaks v8.30.1 trong docker, ssh-keygen, Node 22.22.2);
 * output mẫu lấy từ RA.* (bài 10.5, 10.7, 10.1). Người học chạy trên tài khoản và repo CỦA CHÍNH MÌNH — báo cáo nộp KHÔNG chứa bí mật.
 */
import { bang, cl, note, thuatNgu, tomTat, giai, cs, ag, vo, bash, out } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L108 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 10 · Lab', 'Chương 10 · Lab', `
<h2>${t('10.8 — Lab: your personal security check-up', '10.8 — Lab: tự kiểm tra an ninh cá nhân')}</h2>
<p class="lead">${t(
    'This lab is done on <strong>your own</strong> accounts, repositories and laptop — the ones you will bring to OJT. In about two hours you scan your repositories for secrets, lock down GitHub, inventory SSH keys and tokens, check your laptop, and write a one-page "if I lose my laptop" plan. The result is a short report that contains <em>no</em> secrets, plus a pre-commit hook that keeps protecting you afterwards.',
    'Lab này làm trên tài khoản, repo và laptop <strong>của chính bạn</strong> — những thứ bạn sẽ mang theo khi đi OJT. Trong khoảng hai giờ, bạn quét repo tìm bí mật, siết GitHub, kiểm kê SSH key và token, kiểm laptop, và viết một trang kế hoạch "nếu mất laptop". Kết quả là một bản báo cáo ngắn <em>không</em> chứa bí mật nào, cộng một hook pre-commit tiếp tục bảo vệ bạn về sau.')}</p>
${cl('warn', t('If you find a real secret during this lab, follow lesson 10.7: rotate it first, then clean up. Never paste a real secret into the report, a chat or an AI tool to "ask if it is real".', 'Nếu trong lab bạn tìm ra một bí mật thật, làm theo bài 10.7: xoay khoá trước, rồi mới dọn. Không bao giờ dán bí mật thật vào báo cáo, chat hay công cụ AI để "hỏi xem nó có phải thật không".'))}

<h3>${t('Deliverables', 'Sản phẩm nộp')}</h3>
${bang(['#', t('Deliverable', 'Sản phẩm'), t('Done when', 'Đạt khi')], [
    ['1', t('Secret scan of your repositories (history included)', 'Kết quả quét bí mật các repo của bạn (gồm lịch sử)'), t('Every repo you own scanned; each finding rotated or marked false positive with reason', 'Mọi repo của bạn đã quét; mỗi phát hiện đã xoay khoá hoặc ghi là báo nhầm kèm lý do')],
    ['2', t('Pre-commit hook installed and proven', 'Hook pre-commit đã cài và chứng minh chạy'), t('A test commit with a fake token is rejected', 'Một commit thử có token giả bị từ chối')],
    ['3', t('GitHub account review', 'Soát tài khoản GitHub'), t('2FA on with a phishing-resistant factor if possible; recovery codes stored off the laptop; no unknown sessions/apps', '2FA đã bật, có yếu tố chống lừa đảo nếu được; mã khôi phục cất ngoài laptop; không còn phiên/ứng dụng lạ')],
    ['4', t('SSH key and token inventory', 'Kiểm kê SSH key và token'), t('Every key has a passphrase and a known machine; every token has an expiry and a purpose; unused ones deleted', 'Mọi khoá có passphrase và ứng với máy đã biết; mọi token có hạn và mục đích; cái không dùng đã xoá')],
    ['5', t('Laptop check', 'Kiểm laptop'), t('Disk encryption on, screen lock ≤ 5 minutes, OS and browser updated', 'Đã mã hoá ổ đĩa, tự khoá màn hình ≤ 5 phút, hệ điều hành và trình duyệt đã cập nhật')],
    ['6', t('"If I lose my laptop" plan + portfolio scan', 'Kế hoạch "nếu mất laptop" + soát portfolio'), t('One page: accounts on the laptop and where to revoke each; public repos free of company/customer traces', 'Một trang: tài khoản có trên laptop và nơi thu hồi từng cái; repo công khai không còn dấu vết công ty/khách')],
  ])}

<h3>${t('Step 1 — Scan your repositories (20 min)', 'Bước 1 — Quét repo của bạn (20 phút)')}</h3>
<p>${t('Install gitleaks (<code>brew install gitleaks</code>, <code>winget install gitleaks</code>, or a release binary), or run the official container as below. Scan the <strong>history</strong>, not only the folder:', 'Cài gitleaks (<code>brew install gitleaks</code>, <code>winget install gitleaks</code>, hoặc tệp chạy từ trang phát hành), hoặc chạy container chính thức như dưới. Quét <strong>lịch sử</strong>, không chỉ thư mục:')}</p>
${bash(`# Cách 1: đã cài gitleaks
cd ~/code/ten-repo
gitleaks git . --redact -v --log-opts="--all"
# Cách 2: container (không cần cài), không mạng, giới hạn tài nguyên
docker run --rm --network none --memory 2g --cpus 2 -u "$(id -u):$(id -g)" \\
  -v "$PWD:/repo" -w /repo zricethezav/gitleaks:v8.30.1 git . --redact -v --log-opts="--all"
# Quét mọi repo trong ~/code (cần gitleaks đã cài)
for d in ~/code/*/.git; do echo "== \${d%/.git}"; gitleaks git "\${d%/.git}" --redact --no-banner; done`)}
${out(RA.labVong)}
${note(t('On Fedora/RHEL with SELinux, add <code>:Z</code> to the volume (<code>-v "$PWD:/repo:Z"</code>), otherwise the container cannot read the folder.', 'Trên Fedora/RHEL có SELinux, thêm <code>:Z</code> vào volume (<code>-v "$PWD:/repo:Z"</code>), nếu không container không đọc được thư mục.'))}
<p>${t('Expected output looks like lesson 10.7:', 'Output mong đợi giống bài 10.7:')}</p>
${out(RA.gitleaksGit.split('\n').slice(0, 11).join('\n') + '\n…\n' + RA.gitleaksGit.split('\n').slice(-3).join('\n'))}
<p>${t('Also run the 40-line scanner from lesson 10.7 (<code>node quet-bi-mat.mjs .</code>) — it catches connection strings with passwords that the default gitleaks rules missed in our test. For each finding: is it real? If yes → rotate now. If it is a test value → note why.', 'Chạy thêm bộ quét 40 dòng ở bài 10.7 (<code>node quet-bi-mat.mjs .</code>) — nó bắt được chuỗi kết nối có mật khẩu mà luật mặc định của gitleaks bỏ sót trong phép thử của ta. Với mỗi phát hiện: có thật không? Thật → xoay khoá ngay. Là giá trị thử → ghi lý do.')}</p>

<h3>${t('Step 2 — Install the hook and prove it works (15 min)', 'Bước 2 — Cài hook và chứng minh nó chạy (15 phút)')}</h3>
${bash(`mkdir -p .githooks
cat > .githooks/pre-commit <<'EOF'
#!/bin/bash
gitleaks git --pre-commit --staged --redact --no-banner -v
EOF
chmod +x .githooks/pre-commit
git config core.hooksPath .githooks
# Chứng minh: tạo token GIẢ đúng định dạng rồi thử commit
printf "const t = 'ghp_%s';\\n" "$(LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 36)" > thu-token.js
git add thu-token.js && git commit -m "thu hook"     # phải bị từ chối
git restore --staged thu-token.js && rm thu-token.js`)}
${out(RA.labHook)}
${note(t('Generate the fake token exactly like this. An earlier draft used <code>head -c 200 /dev/urandom | tr -dc …</code>: under a UTF-8 locale it produced only 35 characters, gitleaks (correctly) did not recognise it as a GitHub token, the commit went through — and the test "passed" for the wrong reason. Always check that a security test can fail.', 'Sinh token giả đúng như trên. Bản nháp trước dùng <code>head -c 200 /dev/urandom | tr -dc …</code>: với locale UTF-8 nó chỉ ra 35 ký tự, gitleaks (đúng) không coi đó là token GitHub, commit lọt qua — và phép thử "đạt" vì lý do sai. Luôn kiểm rằng một phép thử bảo mật có thể thất bại.'))}
<p>${t('Version that uses the container instead of an installed binary: ', 'Phiên bản dùng container thay vì tệp cài sẵn: ')}<code>gl.sh</code> ${t('in lesson 10.7. Want it in every repo automatically? Set it globally: <code>git config --global core.hooksPath ~/.githooks</code> (it then replaces per-repo hooks — check the projects you work on).', 'ở bài 10.7. Muốn áp cho mọi repo? Đặt toàn cục: <code>git config --global core.hooksPath ~/.githooks</code> (khi đó nó thay hook riêng của từng repo — kiểm các dự án bạn đang làm).')}</p>

<h3>${t('Step 3 — GitHub account review (20 min)', 'Bước 3 — Soát tài khoản GitHub (20 phút)')}</h3>
<p>${t('Walk through the table from lesson 10.5 and fill in the report:', 'Đi qua bảng ở bài 10.5 và điền vào báo cáo:')}</p>
<ol>
<li>${t('<em>Password and authentication</em>: 2FA on; add a passkey or security key if you have one; download recovery codes and store them in your password manager and on paper.', '<em>Password and authentication</em>: đã bật 2FA; thêm passkey hoặc khoá bảo mật nếu có; tải mã khôi phục, cất trong trình quản lý mật khẩu và trên giấy.')}</li>
<li>${t('<em>Sessions</em>: revoke anything you do not recognise.', '<em>Sessions</em>: thu hồi mọi phiên lạ.')}</li>
<li>${t('<em>Applications</em> (OAuth Apps, GitHub Apps, Authorized tokens): revoke what you no longer use.', '<em>Applications</em> (OAuth Apps, GitHub Apps, Authorized tokens): thu hồi cái không còn dùng.')}</li>
<li>${t('<em>Emails</em>: turn on "Keep my email addresses private" and "Block command line pushes that expose my email" so your personal address is not in public commits.', '<em>Emails</em>: bật "Keep my email addresses private" và "Block command line pushes that expose my email" để địa chỉ cá nhân không nằm trong commit công khai.')}</li>
<li>${t('<em>Security log</em>: scroll the last 90 days for events you did not do.', '<em>Security log</em>: xem 90 ngày gần nhất tìm sự kiện bạn không làm.')}</li>
</ol>

<h3>${t('Step 4 — SSH keys and tokens (20 min)', 'Bước 4 — SSH key và token (20 phút)')}</h3>
${bash(MA.kiemKe)}
${out(RA.ssh)}
<ul>
<li>${t('Every key: passphrase = yes, comment says which machine. Compare with <em>Settings → SSH and GPG keys</em>; delete keys of machines you no longer use.', 'Mỗi khoá: passphrase = yes, ghi chú nói rõ máy nào. So với <em>Settings → SSH and GPG keys</em>; xoá khoá của máy không còn dùng.')}</li>
<li>${t('Tokens: in <em>Developer settings → Personal access tokens</em>, delete classic tokens you can replace with fine-grained ones; every remaining token has an expiry and a purpose in its name.', 'Token: trong <em>Developer settings → Personal access tokens</em>, xoá token cổ điển có thể thay bằng fine-grained; token còn lại đều có hạn và tên ghi mục đích.')}</li>
<li>${t('Search your machine for tokens lying in plain files: ', 'Tìm token nằm trong tệp thường trên máy: ')}</li>
</ul>
${out(RA.labGrep)}
<ul>
<li>${t('This searches ordinary files only (not git history — that was step 1). A hit like a forgotten <code>token.js</code> in a test folder: rotate the token, delete the file.', 'Lệnh này chỉ tìm trong tệp thường (không gồm lịch sử git — việc đó ở bước 1). Gặp kết quả như một tệp <code>token.js</code> bỏ quên trong thư mục thử: xoay token, xoá tệp.')}</li>
</ul>

<h3>${t('Step 5 — Laptop (15 min)', 'Bước 5 — Laptop (15 phút)')}</h3>
${bash(`# Mã hoá ổ đĩa
manage-bde -status C:            # Windows (admin): "Protection Status: Protection On"
fdesetup status                  # macOS: "FileVault is On."
lsblk -o NAME,FSTYPE,MOUNTPOINT  # Linux: có crypto_LUKS
# Tự khoá màn hình ≤ 5 phút: Settings → Lock screen / Privacy & Security / Power & Lock
# Cập nhật: Windows Update, softwareupdate -l (macOS), dnf/apt upgrade (Linux) + trình duyệt`)}
<p>${t('Why encryption matters, measured: lesson 10.4 (a thief reads the raw disk in one command).', 'Vì sao mã hoá quan trọng, có đo thật: bài 10.4 (kẻ trộm đọc ổ đĩa thô bằng một lệnh).')}</p>

<h3>${t('Step 6 — Lost-laptop plan and portfolio scan (30 min)', 'Bước 6 — Kế hoạch mất laptop và soát portfolio (30 phút)')}</h3>
<p>${t('List every account that is logged in or has keys on this laptop, and where to revoke it from another device. Then scan each public repo with the script from lesson 10.1:', 'Liệt kê mọi tài khoản đang đăng nhập hoặc có khoá trên laptop này, và nơi thu hồi từ thiết bị khác. Rồi soát mỗi repo công khai bằng script ở bài 10.1:')}</p>
${bash(MA.soatPortfolio)}
${out(RA.portfolio)}

<h3>${t('Report template (copy, fill, keep — no secrets)', 'Mẫu báo cáo (chép, điền, giữ lại — không có bí mật)')}</h3>
${out(t(
`SECURITY CHECK-UP — <name> — <date>
1. Repos scanned: <n> (history incl.)   Findings: <n> real (rotated on <date>), <n> false positive (why)
2. Pre-commit hook: installed in <repos/global>; test commit rejected: yes/no
3. GitHub: 2FA = <TOTP/passkey/key>; recovery codes stored at <password manager + paper>;
   sessions revoked: <n>; apps revoked: <n>; email private: yes/no
4. SSH keys: <n> (all with passphrase: yes/no); deleted on GitHub: <n>
   Tokens: <n> left, all expiring before <date>; deleted: <n>
5. Laptop: encryption <on/off>; screen lock <n> min; updates <date>
6. Lost-laptop plan: <n> accounts listed; IT hotline saved: yes/no
   Public repos scanned: <n>; customer/company traces: <none / fixed how>
Next review: <date + 3 months>`,
`KIỂM TRA AN NINH CÁ NHÂN — <tên> — <ngày>
1. Số repo đã quét: <n> (có lịch sử)   Phát hiện: <n> thật (đã xoay ngày <…>), <n> báo nhầm (lý do)
2. Hook pre-commit: đã cài ở <repo/toàn cục>; commit thử bị từ chối: có/không
3. GitHub: 2FA = <TOTP/passkey/khoá>; mã khôi phục cất ở <trình quản lý + giấy>;
   phiên đã thu hồi: <n>; ứng dụng đã thu hồi: <n>; email riêng tư: có/không
4. SSH key: <n> (đều có passphrase: có/không); đã xoá trên GitHub: <n>
   Token: còn <n>, đều hết hạn trước <ngày>; đã xoá: <n>
5. Laptop: mã hoá <bật/tắt>; tự khoá <n> phút; cập nhật ngày <…>
6. Kế hoạch mất laptop: <n> tài khoản; đã lưu số IT: có/không
   Repo công khai đã soát: <n>; dấu vết khách/công ty: <không có / đã sửa thế nào>
Lần soát tới: <ngày + 3 tháng>`))}

<h3>${t('Rubric (100 points)', 'Thang chấm (100 điểm)')}</h3>
${bang([t('Item', 'Mục'), t('Points', 'Điểm'), t('Full marks when', 'Đủ điểm khi')], [
    [t('Secret scan', 'Quét bí mật'), '20', t('All repos, history included; every finding resolved with a reason; real ones rotated <em>before</em> cleanup', 'Mọi repo, có lịch sử; mỗi phát hiện có cách xử lý và lý do; cái thật đã xoay <em>trước</em> khi dọn')],
    [t('Pre-commit hook', 'Hook pre-commit'), '15', t('Installed and a fake-token commit shown rejected', 'Đã cài và có bằng chứng commit token giả bị từ chối')],
    [t('GitHub review', 'Soát GitHub'), '20', t('2FA + recovery codes off-laptop + sessions/apps/email settings checked', '2FA + mã khôi phục ngoài laptop + đã soát phiên/ứng dụng/cài đặt email')],
    [t('Keys and tokens', 'Khoá và token'), '20', t('No passphrase-less key; no non-expiring or unused token', 'Không còn khoá thiếu passphrase; không còn token vô hạn hay không dùng')],
    [t('Laptop', 'Laptop'), '10', t('Encryption on, auto-lock ≤ 5 min, updates done', 'Đã mã hoá, tự khoá ≤ 5 phút, đã cập nhật')],
    [t('Lost-laptop plan + portfolio', 'Kế hoạch mất laptop + portfolio'), '15', t('Complete account list with revoke locations; public repos clean', 'Đủ danh sách tài khoản kèm nơi thu hồi; repo công khai sạch')],
  ])}
${note(t('Pass: ≥ 80 points <strong>and</strong> no secret left un-rotated <strong>and</strong> every token with an expiry. Repeat every three months, and on your last day of OJT.', 'Đạt: ≥ 80 điểm <strong>và</strong> không còn bí mật nào chưa xoay <strong>và</strong> mọi token đều có hạn. Lặp lại mỗi ba tháng, và vào ngày cuối OJT.'))}

${giai(t('Sample completed report (a student\'s check-up)', 'Báo cáo mẫu đã điền (bài của một sinh viên)'), out(t(
`SECURITY CHECK-UP — An — 24/11/2026
1. Repos scanned: 7 (history incl.)   Findings: 1 real (Mapbox token in an old class project,
   rotated 24/11 14:05, history rewritten, repo re-pushed), 2 false positive (example JWT in a README,
   sample AKIA…EXAMPLE key in docs — added to .gitleaksignore with comment)
2. Pre-commit hook: global (~/.githooks); test commit rejected: yes (screenshot in notes, value redacted)
3. GitHub: 2FA = TOTP + security key added; recovery codes in Bitwarden + paper in desk drawer;
   sessions revoked: 2 (old lab PC, phone sold last year); apps revoked: 3; email private: yes
4. SSH keys: 3 → 2 (deleted lab-PC key); both with passphrase: yes (added one with ssh-keygen -p)
   Tokens: 1 left (fine-grained, repo "portfolio-ci", Contents read, expires 22/02/2027); deleted: 4 classic
5. Laptop: BitLocker on; screen lock 3 min; updates 24/11
6. Lost-laptop plan: 9 accounts (GitHub, Google, school e-mail, Bitwarden, Discord, AWS student,
   Vercel, npm, Zalo PC) with revoke links; IT hotline: will save on OJT day 1
   Public repos scanned: 5; traces: 1 README mentioned the internship company's internal tool name — removed
Next review: 24/02/2027`,
`KIỂM TRA AN NINH CÁ NHÂN — An — 24/11/2026
1. Số repo đã quét: 7 (có lịch sử)   Phát hiện: 1 thật (token Mapbox trong đồ án môn cũ,
   đã xoay 24/11 14:05, viết lại lịch sử, push lại), 2 báo nhầm (JWT ví dụ trong README,
   khoá mẫu AKIA…EXAMPLE trong tài liệu — thêm vào .gitleaksignore kèm chú thích)
2. Hook pre-commit: toàn cục (~/.githooks); commit thử bị từ chối: có (ảnh trong ghi chú, giá trị đã che)
3. GitHub: 2FA = TOTP + đã thêm khoá bảo mật; mã khôi phục trong Bitwarden + giấy trong ngăn bàn;
   phiên đã thu hồi: 2 (máy phòng lab, điện thoại đã bán năm ngoái); ứng dụng đã thu hồi: 3; email riêng tư: có
4. SSH key: 3 → 2 (xoá khoá máy phòng lab); đều có passphrase: có (thêm một cái bằng ssh-keygen -p)
   Token: còn 1 (fine-grained, repo "portfolio-ci", Contents đọc, hết hạn 22/02/2027); đã xoá: 4 cổ điển
5. Laptop: BitLocker bật; tự khoá 3 phút; cập nhật 24/11
6. Kế hoạch mất laptop: 9 tài khoản (GitHub, Google, email trường, Bitwarden, Discord, AWS sinh viên,
   Vercel, npm, Zalo PC) kèm liên kết thu hồi; số IT: sẽ lưu ngày đầu OJT
   Repo công khai đã soát: 5; dấu vết: 1 README nhắc tên công cụ nội bộ của công ty thực tập — đã xoá
Lần soát tới: 24/02/2027`)))}

${thuatNgu([
    ['.gitleaksignore', t('File listing fingerprints of findings accepted as false positives', 'Tệp liệt kê dấu vân tay các phát hiện đã chấp nhận là báo nhầm')],
    ['core.hooksPath', t('Git setting pointing to a folder of hooks (per repo or global)', 'Cài đặt git trỏ tới thư mục chứa hook (theo repo hoặc toàn cục)')],
    [t('Fine-grained PAT', 'PAT fine-grained'), t('GitHub token limited to chosen repos and permissions, with expiry', 'Token GitHub giới hạn theo repo và quyền được chọn, có hạn')],
  ], en)}

${tomTat([
    t('Scan history, install a hook, prove it rejects a fake token.', 'Quét lịch sử, cài hook, chứng minh nó chặn token giả.'),
    t('Lock down GitHub: 2FA, recovery codes off the laptop, sessions, apps, private e-mail.', 'Siết GitHub: 2FA, mã khôi phục ngoài laptop, phiên, ứng dụng, email riêng tư.'),
    t('Every SSH key with a passphrase; every token with an expiry.', 'Mọi SSH key có passphrase; mọi token có hạn.'),
    t('Know your lost-laptop plan before you need it; repeat every three months.', 'Biết kế hoạch mất laptop trước khi cần tới; ba tháng làm lại một lần.'),
  ], en)}
<p>${t('Next', 'Tiếp theo')}: ${ag('agl-10-9-quiz', t('10.9 — Chapter 10 quiz', '10.9 — Kiểm tra Chương 10'))}. ${t('Related team-level practice: ', 'Thực hành cấp đội liên quan: ')}${cs('git', 'git-moc-9', t('Git project milestone 9 (secret-leak drill)', 'Git mốc dự án 9 (diễn tập lộ bí mật)'))}.</p>
`);
};
