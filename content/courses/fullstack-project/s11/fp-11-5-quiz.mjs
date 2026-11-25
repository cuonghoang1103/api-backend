/**
 * 11.5 — Kiểm tra Chương 11 (soạn 25/11/2026, agent trên Mac tiếp quản fsp). BÀI THÊM (không có trong khung), slug mới fp-11-5-quiz.
 * 10 câu; đáp án dựa trên output chạy thật của bài 11.1–11.4 (VPS mô phỏng Ubuntu 24.04, Pebble + certbot, deploy.sh R1–R7).
 * Phân bố đáp án: A2 B3 C3 D2.
 */
const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

export default {
  title: '11.5 — Chapter 11 quiz|||11.5 — Kiểm tra Chương 11',
  slug: 'fp-11-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống từ chính lần đưa ChiaSe lên VPS: drop-in sshd thua 50-cloud-init.conf, cổng Docker đi vòng ufw, nhóm docker ngang root, chứng chỉ chưa có thì nginx -t đỏ, certbot --dry-run gọi staging, TRUST_PROXY thiếu/thừa một lớp, CSP biến mất vì một add_header, lùi bản mà POST 500, migration Prisma hỏng giữa chừng để lại cột thừa, và báo cáo dọn token đếm trên ảnh chụp trước khi xoá.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Check</span>
<h2>Check what stuck — and close the course</h2>
<p class="lead">Ten situations taken from what actually happened while ChiaSe went to production. Read every explanation, including for the questions you got right.</p>
<h3>Self-check before you start</h3>
<ul>
<li>Password login to my server is refused, verified with <code>sshd -T</code> and a real attempt from outside.</li>
<li>From another machine, only 22, 80 and 443 answer.</li>
<li><code>/api/</code> and <code>/ban.txt</code> report the SHA that <code>~/chiase/.ban-dang-chay</code> says is deployed.</li>
<li>I have seen my deploy roll itself back, and I have restored a backup on purpose.</li>
<li>Checkpoint 11 passes every criterion.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì — và khép lại khoá học</h2>
<p class="lead">Mười tình huống lấy từ chính những gì đã xảy ra khi đưa ChiaSe lên production. Đọc mọi phần giải thích, kể cả câu bạn làm đúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Máy chủ của tôi từ chối đăng nhập bằng mật khẩu, đã kiểm bằng <code>sshd -T</code> và một lần thử thật từ bên ngoài.</li>
<li>Từ một máy khác, chỉ 22, 80 và 443 trả lời.</li>
<li><code>/api/</code> và <code>/ban.txt</code> khai đúng SHA mà <code>~/chiase/.ban-dang-chay</code> ghi là đang deploy.</li>
<li>Tôi đã thấy lần deploy của mình tự lùi, và đã cố ý phục hồi một bản sao lưu.</li>
<li>Checkpoint 11 đạt mọi tiêu chí.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      q('You wrote PasswordAuthentication no into /etc/ssh/sshd_config.d/70-chiase.conf. sshd -t passed, the reload passed, and a password still logs in. sshd -T says passwordauthentication yes. Why?|||Bạn ghi PasswordAuthentication no vào /etc/ssh/sshd_config.d/70-chiase.conf. sshd -t qua, reload qua, mà mật khẩu vẫn vào được. sshd -T báo passwordauthentication yes. Vì sao?',
        ['The reload needs a full reboot on Ubuntu 24.04|||Trên Ubuntu 24.04 phải khởi động lại cả máy',
         'sshd uses the FIRST value it reads, drop-ins are read alphabetically, and 50-cloud-init.conf (PasswordAuthentication yes) comes before 70-|||sshd dùng giá trị đọc được ĐẦU TIÊN, drop-in đọc theo thứ tự chữ cái, và 50-cloud-init.conf (PasswordAuthentication yes) đứng trước 70-',
         'Drop-in files are ignored unless listed in sshd_config|||Tệp drop-in bị bỏ qua trừ khi được liệt kê trong sshd_config',
         'The key must be written in lowercase|||Từ khoá phải viết chữ thường'],
        1,
        'EN: Half of the file worked (kbdinteractiveauthentication no — nobody else set it), half did not: the fingerprint of an ordering conflict. Renaming to 01-chiase.conf fixed it. Verify with sshd -T and a real attempt, never with cat.|||VI: Nửa tệp có hiệu lực (kbdinteractiveauthentication no — không ai khác khai), nửa không: dấu vân tay của va chạm thứ tự. Đổi tên thành 01-chiase.conf là xong. Nghiệm thu bằng sshd -T và một lần thử thật, không bao giờ bằng cat.'),
      q('ufw allows only 22, 80, 443. A test container runs with -p 5432:5432. From another machine, pg_isready -h chiase.test -p 5432 says "accepting connections". What is going on?|||ufw chỉ mở 22, 80, 443. Một container thử chạy với -p 5432:5432. Từ máy khác, pg_isready -h chiase.test -p 5432 báo "accepting connections". Chuyện gì vậy?',
        ['ufw is not enabled; port 8080 would also answer|||ufw chưa bật; cổng 8080 cũng sẽ trả lời',
         'Postgres opens its own hole in the firewall|||Postgres tự đục lỗ trên tường lửa',
         'Docker publishes the port with a DNAT rule in the nat table, before ufw\'s INPUT rules, and accepts it in FORWARD — published ports bypass ufw|||Docker công bố cổng bằng một luật DNAT ở bảng nat, trước các luật INPUT của ufw, rồi cho qua ở FORWARD — cổng công bố đi vòng ufw',
         'pg_isready lies when the password is wrong|||pg_isready nói dối khi sai mật khẩu'],
        2,
        'EN: ufw was working (8080 timed out). Docker\'s docs: published ports "bypass your firewall rules". Fix: -p 127.0.0.1:5432:5432 or no -p at all; DOCKER-USER chain if you really must filter.|||VI: ufw có chạy (8080 bị treo tới hết giờ). Tài liệu Docker: cổng công bố "bypass your firewall rules". Sửa: -p 127.0.0.1:5432:5432 hoặc bỏ hẳn -p; chuỗi DOCKER-USER nếu thật sự cần lọc.'),
      q('deployer has no sudo, but is in the docker group. What can deployer do?|||deployer không có sudo nhưng ở trong nhóm docker. deployer làm được gì?',
        ['Only start and stop containers it created|||Chỉ bật/tắt container do chính nó tạo',
         'Nothing outside its home directory|||Không làm được gì ngoài thư mục nhà',
         'Read /etc/shadow only if SELinux is off|||Chỉ đọc được /etc/shadow khi tắt SELinux',
         'Anything root can: docker run -v /:/host … read root\'s password hash and wrote a file in /root|||Mọi thứ root làm được: docker run -v /:/host … đã đọc mã băm mật khẩu root và ghi tệp vào /root'],
        3,
        'EN: Control of the Docker daemon is root on the host ("only trusted users should be allowed to control your Docker daemon"). Guard deployer\'s key like root\'s; never mount docker.sock into an app container.|||VI: Điều khiển Docker daemon là root trên máy ("only trusted users should be allowed to control your Docker daemon"). Giữ khoá của deployer như khoá root; không bao giờ gắn docker.sock vào container ứng dụng.'),
      q('First setup: nginx -t fails with "cannot load certificate … fullchain.pem: No such file". You need Nginx running for certbot\'s http-01 challenge. What is the clean way out?|||Lần dựng đầu: nginx -t hỏng vì "cannot load certificate … fullchain.pem: No such file". Muốn certbot chạy http-01 thì cần Nginx đang chạy. Lối ra gọn gàng là gì?',
        ['A temporary site that only serves /.well-known/acme-challenge/ on port 80; get the certificate with --webroot; then enable the real config|||Một site TẠM chỉ phục vụ /.well-known/acme-challenge/ ở cổng 80; lấy chứng chỉ bằng --webroot; rồi mới bật cấu hình thật',
         'Comment out ssl_certificate and let Nginx generate one|||Chú thích ssl_certificate để Nginx tự sinh',
         'Use a self-signed certificate forever|||Dùng chứng chỉ tự ký mãi mãi',
         'Open port 443 in ufw first|||Mở cổng 443 trên ufw trước'],
        0,
        'EN: The CA connects to the NAME on port 80 and fetches the token certbot wrote into the webroot (Pebble\'s log showed exactly that). Port 80 stays open afterwards for renewals, even though users are redirected.|||VI: CA nối tới cái TÊN ở cổng 80 và lấy mã certbot đã ghi vào webroot (log của Pebble cho thấy đúng vậy). Sau đó cổng 80 vẫn phải mở cho các lần gia hạn, dù người dùng đều bị chuyển hướng.'),
      q('certbot renew --dry-run fails with "Cannot issue for chiase.test: Domain name does not end with a valid public suffix", although the certificate was issued by your configured ACME server a minute ago. Why?|||certbot renew --dry-run hỏng với "Cannot issue for chiase.test: Domain name does not end with a valid public suffix", dù chứng chỉ vừa được máy chủ ACME bạn cấu hình cấp một phút trước. Vì sao?',
        ['The certificate is too new to renew|||Chứng chỉ còn quá mới để gia hạn',
         '--dry-run talks to the real Let\'s Encrypt STAGING server, not your configured one, and staging refuses a fake .test name|||--dry-run gọi máy chủ STAGING thật của Let\'s Encrypt, không phải máy chủ bạn cấu hình, và staging từ chối tên giả .test',
         'Pebble forbids renewals|||Pebble cấm gia hạn',
         'The webroot directory was deleted|||Thư mục webroot đã bị xoá'],
        1,
        'EN: The log showed acme-staging-v02.api.letsencrypt.org. On a real domain the dry run passes. Also measured: a renewal without a terminal sleeps a random delay first (392 s) — use --no-random-sleep-on-renew when you run it by hand, and --deploy-hook "nginx -s reload" so Nginx loads the new file.|||VI: Log ghi acme-staging-v02.api.letsencrypt.org. Với tên miền thật thì dry run qua. Đo thêm: gia hạn không có terminal ngủ ngẫu nhiên trước (392 giây) — chạy tay thì dùng --no-random-sleep-on-renew, và --deploy-hook "nginx -s reload" để Nginx nạp tệp mới.'),
      q('Requests pass VPS Nginx ⇒ web-image Nginx ⇒ API. With TRUST_PROXY: 1, an attacker makes 11 wrong logins; then a real user on another network logs in with the right password. What does the user get, and why?|||Request đi qua Nginx của VPS ⇒ Nginx của ảnh web ⇒ API. Với TRUST_PROXY: 1, kẻ tấn công đăng nhập sai 11 lần; rồi một người dùng thật ở mạng khác đăng nhập đúng mật khẩu. Người dùng nhận gì, và vì sao?',
        ['200 — rate limits are per account|||200 — giới hạn tính theo tài khoản',
         '401 — the attacker changed the password|||401 — kẻ tấn công đã đổi mật khẩu',
         '429 — with one hop too few, the API sees every user as the VPS Nginx\'s address, so everybody shares the attacker\'s counter|||429 — thiếu một lớp, API thấy mọi người dùng mang địa chỉ của Nginx trên VPS, nên ai cũng dùng chung bộ đếm với kẻ tấn công',
         '502 — Nginx drops the request|||502 — Nginx bỏ request'],
        2,
        'EN: Measured: TRUST_PROXY 2 ⇒ attacker 429, user 200; 1 ⇒ user 429; 3 ⇒ the attacker forges X-Forwarded-For per request and never sees 429. Count the hops, then prove the count.|||VI: Đã đo: TRUST_PROXY 2 ⇒ kẻ tấn công 429, người dùng 200; 1 ⇒ người dùng 429; 3 ⇒ kẻ tấn công giả X-Forwarded-For mỗi lần và không bao giờ thấy 429. Đếm số lớp, rồi chứng minh con số.'),
      q('The server block of the VPS Nginx sets HSTS and CSP with add_header … always. One location adds add_header Cache-Control no-store. What do responses from that location carry?|||Khối server của Nginx trên VPS đặt HSTS và CSP bằng add_header … always. Một location thêm add_header Cache-Control no-store. Response từ location đó mang gì?',
        ['All three headers|||Cả ba header',
         'Only Cache-Control: a block that declares any add_header inherits none from the outer block — CSP and HSTS vanish, and the injected test script ran|||Chỉ Cache-Control: khối nào khai bất kỳ add_header nào thì không kế thừa cái nào từ khối ngoài — CSP và HSTS biến mất, và script thử chèn vào đã chạy',
         'CSP and HSTS, because always forces them|||CSP và HSTS, vì always ép chúng',
         'Nothing — Nginx refuses the config|||Không gì cả — Nginx từ chối cấu hình'],
        1,
        'EN: curl counted 2 security headers on /thu-csp and 0 on /thu-csp-2; headless Chrome showed the inline script blocked on the first and executed on the second. Put security headers in an include file and include it wherever a location has its own add_header.|||VI: curl đếm 2 header bảo mật ở /thu-csp và 0 ở /thu-csp-2; Chrome không giao diện cho thấy script nội tuyến bị chặn ở trang đầu và chạy ở trang sau. Gom header bảo mật vào một tệp include và include nó ở mọi location có add_header riêng.'),
      q('R2 added posts.tom_tat with "ADD COLUMN … NOT NULL DEFAULT \'\'" then "ALTER COLUMN … DROP DEFAULT". Rolling back to R1 (which knows nothing of tom_tat): every GET in the smoke test is green. What happens next?|||R2 thêm posts.tom_tat bằng "ADD COLUMN … NOT NULL DEFAULT \'\'" rồi "ALTER COLUMN … DROP DEFAULT". Lùi về R1 (không biết gì về tom_tat): mọi GET trong smoke test đều xanh. Chuyện gì tiếp theo?',
        ['The rollback succeeds; old code ignores new columns|||Lùi thành công; mã cũ bỏ qua cột mới',
         'Prisma migrates the column back automatically|||Prisma tự migrate ngược cột đó',
         'R1 fails to start|||R1 không khởi động được',
         'POST /api/posts returns 500 (null value in column "tom_tat" violates not-null); the write path of the smoke test catches it and the script goes back to R2; the fix is forward: SET DEFAULT \'\'|||POST /api/posts trả 500 (null value in column "tom_tat" violates not-null); lượt ghi của smoke test bắt được và script quay lại R2; cách sửa là đi tiến: SET DEFAULT \'\''],
        3,
        'EN: Dropping the default closed a one-way door. Expand/contract: a release may only add what the previous one can ignore; tightening waits one release. After R4 (SET DEFAULT) rollback to R1 was green both ways.|||VI: Bỏ DEFAULT là đóng một cánh cửa một chiều. Expand/contract: một bản phát hành chỉ được thêm thứ bản trước bỏ qua được; siết lại phải đợi một bản. Sau R4 (SET DEFAULT), lùi về R1 xanh cả hai chiều.'),
      q('R5\'s migration ran ADD COLUMN, UPDATE, then CREATE UNIQUE INDEX, which failed on duplicate data (P3018). The next deploy stops with P3009. What is true?|||Migration của R5 chạy ADD COLUMN, UPDATE, rồi CREATE UNIQUE INDEX — câu này hỏng vì dữ liệu trùng (P3018). Lần deploy sau dừng với P3009. Điều nào đúng?',
        ['Prisma ran the file without a transaction, so the column from statement 1 stayed; a human must undo it, run migrate resolve --rolled-back, fix the migration (wrap it in BEGIN/COMMIT) and redeploy|||Prisma chạy tệp không trong giao dịch, nên cột của câu 1 nằm lại; con người phải gỡ nó, chạy migrate resolve --rolled-back, sửa migration (bọc BEGIN/COMMIT) rồi deploy lại',
         'PostgreSQL rolled everything back; just run migrate resolve --applied|||PostgreSQL đã lùi hết; chỉ cần migrate resolve --applied',
         'Users are now on R5 with a broken schema|||Người dùng đang ở R5 với lược đồ hỏng',
         'Delete the row from _prisma_migrations and redeploy the same file|||Xoá dòng trong _prisma_migrations rồi deploy lại đúng tệp đó'],
        0,
        'EN: \\d users showed ten_dang_nhap after the failure. deploy.sh stopped before the swap, so users stayed on R4. Wrapped in BEGIN/COMMIT, the same failure left nothing behind (R6, and the manual test). --applied would declare a half-applied schema finished.|||VI: \\d users cho thấy ten_dang_nhap còn đó sau lần hỏng. deploy.sh dừng trước bước tráo, nên người dùng ở lại R4. Bọc BEGIN/COMMIT thì cùng lần hỏng đó không để lại gì (R6, và phép thử tay). --applied là tuyên bố một lược đồ nửa chừng đã xong.'),
      q('The first don-refresh.sh used one statement: WITH xoa AS (DELETE … RETURNING 1) SELECT count(*) FROM xoa, (SELECT count(*) FROM refresh_tokens). It printed "deleted 45, 62 left"; the next run said "deleted 0, 17 left". What was wrong?|||Bản đầu của don-refresh.sh dùng một câu: WITH xoa AS (DELETE … RETURNING 1) SELECT count(*) FROM xoa, (SELECT count(*) FROM refresh_tokens). Nó in "xoá 45, còn 62"; lần chạy sau báo "xoá 0, còn 17". Sai ở đâu?',
        ['The DELETE did not commit|||Câu DELETE không được commit',
         'cron ran the script twice|||cron chạy script hai lần',
         'Only the report: all parts of one statement see the snapshot from before the DELETE, so the "left" count included the 45 rows being deleted; count in a separate statement|||Chỉ phần báo cáo: mọi phần của một câu lệnh nhìn cùng ảnh chụp trước DELETE, nên số "còn lại" tính cả 45 dòng đang bị xoá; đếm bằng câu lệnh riêng',
         'refresh_tokens grew by 45 between runs|||refresh_tokens tăng 45 dòng giữa hai lần chạy'],
        2,
        'EN: 62 − 45 = 17: the deletion was right, the report lied. PostgreSQL documents that sub-statements in WITH run concurrently with the main query on the same snapshot. Tools are code; measure them too.|||VI: 62 − 45 = 17: xoá đúng, báo cáo nói dối. Tài liệu PostgreSQL ghi các câu con trong WITH chạy đồng thời với truy vấn chính trên cùng một ảnh chụp. Công cụ cũng là mã; đo cả nó.'),
    ],
  },
};
