/**
 * Linux & Bash · Deck lx-16 — Chương 16: Dự án cuối khoá — dựng, tự động hoá và vận hành một máy chủ thật.
 *
 * MỌI output terminal trên slide là output THẬT, chạy đêm 28→29/09/2026:
 *   • "VPS" = container ubuntu:24.04 CÓ systemd 255 thật (ảnh tạm lx16-img: systemd, openssh-server 9.6,
 *             nginx 1.24.0, python3 3.12.3, sqlite3, logrotate, cron, ufw, jq), tên lx16-srv, hostname clinic-vps,
 *             --privileged ngắn hạn, --memory 512m, đồng hồ UTC. App "datlich" (Đặt lịch phòng khám) = 63 dòng
 *             Python thư viện chuẩn. bootstrap.sh / deploy.sh / sao-luu.sh / giam-sat.sh / bao-cao-sang.sh
 *             qua ShellCheck sạch. Sự cố 16.4 được DỰNG LẠI thật: tmpfs 40M, tmpfs nr_inodes=2000, OOM
 *             của cgroup, cổng bị chiếm, file CSDL của root, cron UTC + CRON_TZ, CRLF, drop-in sshd, bind-mount.
 *   • "Fedora" = máy linux-nha, Fedora 44 (SELinux enforcing) — chỉ đọc: getenforce, ls -Z, matchpathcon.
 *   • "Mac"    = Mac M1, macOS 27 (bsdtar 3.5.3, BSD head/mv/stat/date).
 *   • strace ln -sfn: container ubuntu:24.04 (coreutils 9.4), debian:12 (9.1), alpine (BusyBox 1.37).
 *
 * Hình tự vẽ (SVG nội tuyến, không đụng thư viện): kienTruc() toàn cảnh máy chủ · banPhatHanh() thư mục
 * releases + symlink current · luongDeploy() health check rẽ nhánh · xoayLog() fd trỏ inode trước/sau logrotate.
 */
import { S, cover, sh, term, mindmap, cards, box, steps, table, two, tree, sv, R, T, A, D } from './_lx-chung.mjs';

export const deck = { key: 'lx-16', code: 'LINUX · CHƯƠNG 16', title: 'Dự án cuối khoá', sub: 'Linux & Bash · Chương 16' };

const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15px}.c-t.sm td,.c-t.sm th{padding:6px 10px}</style>';
const P = (t) => `<p style="font-size:14.5px;color:${D.mu};margin-top:8px;text-align:center">${t}</p>`;

/* Slide 3 — toàn cảnh máy chủ của dự án */
const kienTruc = () => {
  let s = '';
  // laptop
  s += R(0, 150, 190, 150, { c: 'blu' }) + T(95, 182, '💻 Laptop', { fs: 18, a: 'middle', b: true, c: 'blu' });
  s += T(95, 210, 'tar -czf gói', { fs: 14, a: 'middle', mono: true, c: 'mu' }) + T(95, 232, 'scp · ssh -i khoá', { fs: 14, a: 'middle', mono: true, c: 'mu' });
  s += T(95, 262, 'người dùng: 🌐', { fs: 14, a: 'middle', c: 'mu' }) + T(95, 284, 'trình duyệt', { fs: 14, a: 'middle', c: 'mu' });
  // tường lửa
  s += R(236, 20, 34, 420, { c: 'red', fill: 'rgba(255,92,108,.10)', r: 8 });
  ['u', 'f', 'w'].forEach((ch, i) => { s += T(253, 200 + i * 26, ch, { fs: 18, a: 'middle', b: true, c: 'red', mono: true }); });
  s += T(253, 460, 'chỉ 22 + 80', { fs: 13.5, a: 'middle', c: 'red' });
  // khung VPS
  s += R(300, 0, 860, 470, { c: 'bd', fill: '#0c140f', r: 16, dash: true });
  s += T(318, 26, 'VPS Ubuntu 24.04 · clinic-vps', { fs: 15, b: true, c: 'mu' });
  // sshd + nginx
  s += R(330, 50, 230, 74, { c: 'vio' }) + T(445, 80, 'sshd :22', { fs: 17, a: 'middle', b: true, mono: true }) + T(445, 104, 'chỉ khoá · chỉ user deploy', { fs: 13.5, a: 'middle', c: 'mu' });
  s += R(330, 250, 230, 74, { c: 'grn' }) + T(445, 280, 'nginx :80', { fs: 17, a: 'middle', b: true, mono: true }) + T(445, 304, 'proxy_pass → 127.0.0.1:8080', { fs: 13.5, a: 'middle', c: 'mu', mono: true });
  // deploy.sh
  s += R(620, 50, 250, 74, { c: 'vio', fill: '#141024' }) + T(745, 80, 'sudo deploy.sh gói', { fs: 16, a: 'middle', b: true, mono: true }) + T(745, 104, 'releases/ + current → bản mới', { fs: 13.5, a: 'middle', c: 'mu' });
  // app
  s += R(610, 220, 270, 134, { c: 'lx', fill: '#1a1606' });
  s += T(745, 250, 'datlich.service', { fs: 17, a: 'middle', b: true, mono: true, c: 'lx' });
  s += T(745, 274, 'app.py nghe 127.0.0.1:8080', { fs: 13.5, a: 'middle', mono: true, c: 'mu' });
  s += T(745, 298, 'User=datlich (nologin)', { fs: 13.5, a: 'middle', mono: true, c: 'mu' });
  s += T(745, 322, 'MemoryMax=150M · Restart=', { fs: 13.5, a: 'middle', mono: true, c: 'mu' });
  s += T(745, 344, 'EnvironmentFile=/etc/datlich', { fs: 13.5, a: 'middle', mono: true, c: 'mu' });
  // dữ liệu
  s += R(930, 50, 210, 64, { c: 'tea' }) + T(1035, 78, '/var/lib/datlich', { fs: 14.5, a: 'middle', b: true, mono: true }) + T(1035, 100, 'datlich.db (SQLite)', { fs: 13, a: 'middle', c: 'mu' });
  s += R(930, 136, 210, 64, { c: 'tea' }) + T(1035, 164, '/var/log/datlich', { fs: 14.5, a: 'middle', b: true, mono: true }) + T(1035, 186, 'access.log · deploy.log', { fs: 13, a: 'middle', c: 'mu' });
  s += R(930, 222, 210, 64, { c: 'tea' }) + T(1035, 250, '/var/backups/datlich', { fs: 14.5, a: 'middle', b: true, mono: true }) + T(1035, 272, '7 bản .db.gz gần nhất', { fs: 13, a: 'middle', c: 'mu' });
  // timers
  s += R(330, 380, 810, 70, { c: 'amb', fill: '#1a1406' });
  s += T(350, 408, '⏰ systemd timer', { fs: 15.5, b: true, c: 'amb' });
  s += T(350, 434, 'sao lưu 02:30 VN · giám sát 5 phút/lần · báo cáo sáng 07:30 VN · logrotate hằng ngày', { fs: 14.5, c: 'mu' });
  // mũi tên
  s += A(190, 190, 326, 90, { c: 'vio' }) + A(190, 262, 326, 287, { c: 'grn' });
  s += A(560, 87, 616, 87, { c: 'vio' }) + A(745, 124, 745, 216, { c: 'vio' }) + A(560, 287, 616, 287, { c: 'grn' });
  s += A(880, 250, 926, 90, { c: 'tea', sw: 2.5 }) + A(880, 280, 926, 170, { c: 'tea', sw: 2.5 });
  s += A(1035, 376, 1035, 290, { c: 'amb', sw: 2.5, dash: true });
  return sv(1160, 472, s);
};

/* Slide 10 — thư mục releases + symlink current (đúng tên thật của lần chạy) */
const banPhatHanh = () => {
  const ban = [
    ['20260928-170422', '1.0.0', 'grn', ''],
    ['20260928-170424', '1.1.0', 'grn', 'quay lui về đây'],
    ['20260928-170427.hong', '1.2.0', 'red', 'health hỏng'],
    ['20260928-170452', '1.1.0', 'grn', ''],
  ];
  let s = T(0, 22, '/opt/datlich/releases/', { fs: 16, mono: true, b: true, c: 'mu' });
  ban.forEach(([ten, v, col, note], i) => {
    const x = i * 290;
    s += R(x, 40, 270, 76, { c: col, dash: col === 'red', fill: col === 'red' ? 'rgba(255,92,108,.08)' : '#0f1712' });
    s += T(x + 135, 70, ten, { fs: 14.5, a: 'middle', mono: true, b: true });
    s += T(x + 135, 96, `app.py · VERSION ${v}`, { fs: 13.5, a: 'middle', mono: true, c: 'mu' });
    if (note) s += T(x + 135, 138, note, { fs: 13.5, a: 'middle', c: col });
  });
  // current
  s += R(520, 200, 330, 60, { c: 'lx', fill: '#1a1606' }) + T(685, 237, '/opt/datlich/current', { fs: 17, a: 'middle', mono: true, b: true, c: 'lx' });
  s += A(790, 200, 990, 122, { c: 'lx' });
  s += `<path d="M590 200 L470 122" stroke="${D.lx}" stroke-width="2.5" fill="none" stroke-dasharray="7 6"/>`;
  s += T(935, 186, 'bây giờ', { fs: 14, c: 'lx', b: true });
  s += T(515, 190, 'quay lui = trỏ lại', { fs: 14, c: 'lx', a: 'end' });
  s += T(685, 290, 'systemd chạy /opt/datlich/current/app.py ⇒ đổi mũi tên + restart = đổi bản', { fs: 15, a: 'middle', c: 'mu' });
  return sv(1160, 300, s);
};

/* Slide 11 — luồng deploy: kiểm trước khi đụng, health quyết định */
const luongDeploy = () => {
  let s = '';
  const hop = (x, y, w, t, d, col) => {
    s += R(x, y, w, 64, { c: col, r: 10 }) + T(x + w / 2, y + 27, t, { fs: 15, a: 'middle', b: true, mono: true }) + T(x + w / 2, y + 50, d, { fs: 13, a: 'middle', c: 'mu' });
  };
  hop(0, 0, 200, 'flock -n', 'bản thứ hai ⇒ mã 3', 'vio');
  hop(230, 0, 200, 'giải nén + ast', 'sai cú pháp ⇒ mã 2', 'blu');
  hop(460, 0, 200, 'mv -T → releases/', 'tên theo thời gian', 'tea');
  hop(690, 0, 200, 'đổi current', 'ln -sfn + mv -T', 'lx');
  hop(920, 0, 230, 'reset-failed + restart', 'systemctl', 'amb');
  [200, 430, 660, 890].forEach((x) => { s += A(x + 2, 32, x + 26, 32, { c: 'mu', sw: 2 }); });
  s += `<path d="M1035 64 L1035 100 L575 100 L575 118" stroke="${D.amb}" stroke-width="2.5" fill="none"/>`;
  s += R(440, 122, 270, 56, { c: 'amb', r: 28, fill: '#1a1406' }) + T(575, 156, 'curl /health × 10 lần', { fs: 15, a: 'middle', b: true, mono: true, c: 'amb' });
  s += A(440, 150, 300, 212, { c: 'grn' }) + A(710, 150, 850, 212, { c: 'red' });
  s += T(330, 176, 'ok', { fs: 14, c: 'grn', b: true }) + T(800, 176, 'hỏng', { fs: 14, c: 'red', b: true });
  hop(130, 216, 330, 'giữ bản mới', 'dọn bản cũ, giữ 5 · mã 0', 'grn');
  hop(690, 216, 400, 'current → bản cũ, restart', 'bản mới đổi tên .hong · mã 1', 'red');
  return sv(1160, 284, s);
};

/* Slide 19 — logrotate: tiến trình giữ fd trỏ vào INODE, không vào tên */
const xoayLog = () => {
  let s = '';
  const cot = (x, tieuDe, col, dong) => {
    s += T(x + 170, 20, tieuDe, { fs: 15.5, a: 'middle', b: true, c: col });
    s += R(x, 40, 110, 56, { c: 'lx', r: 10 }) + T(x + 55, 64, 'app.py', { fs: 14.5, a: 'middle', b: true, mono: true }) + T(x + 55, 84, 'fd 3', { fs: 13.5, a: 'middle', mono: true, c: 'lx' });
    dong.forEach(([ten, ino, y, cc, noi]) => {
      s += R(x + 170, y, 180, 50, { c: cc, r: 8, fill: '#050806' }) + T(x + 260, y + 22, ten, { fs: 14, a: 'middle', mono: true, b: true }) + T(x + 260, y + 41, ino, { fs: 12.5, a: 'middle', mono: true, c: 'mu' });
      if (noi) s += A(x + 110, 68, x + 166, y + 25, { c: noi, sw: 2.5 });
    });
  };
  cot(0, '① trước', 'mu', [['access.log', 'inode 12 · đang ghi', 40, 'grn', 'grn']]);
  cot(390, '② mv (logrotate), KHÔNG báo app', 'red', [['access.log.1', 'inode 12 · VẪN ghi', 40, 'red', 'red'], ['access.log', 'inode 13 · rỗng mãi', 110, 'dim', '']]);
  cot(780, '③ postrotate: SIGHUP ⇒ mở lại', 'grn', [['access.log.1', 'inode 12 · đóng', 40, 'dim', ''], ['access.log', 'inode 13 · đang ghi', 110, 'grn', 'grn']]);
  return sv(1160, 170, s);
};

export const slides = S([
  cover({ t: 'Chương 16 — Dự án cuối khoá', sub: 'Dựng · deploy · tự động hoá · vận hành một máy chủ thật cho API “Đặt lịch phòng khám”', chap: 'CHƯƠNG 16' }),

  { t: 'Bản đồ chương: một tuần đầu của một máy chủ', body: mindmap('Dự án cuối khoá', 'một VPS · một app · cả khoá học', [
    { t: '16.1 Ngày 1', d: 'user riêng · thư mục · SSH khoá · ufw', c: 'lx' },
    { t: '16.2 Deploy', d: 'releases + current · health · quay lui', c: 'grn' },
    { t: '16.3 Tự động hoá', d: 'timer sao lưu · logrotate · giám sát', c: 'tea' },
    { t: '16.4 Tuần đầu', d: '8 sự cố dựng lại thật', c: 'red' },
    { t: 'Thi cuối khoá', d: '20 câu · Mục 0 → Ch16', c: 'vio' },
    { t: 'Nối về chương cũ', d: 'mỗi bước trỏ về bài đã học', c: 'blu' },
  ]) },

  { t: 'Một VPS, một app — và mọi thứ bạn đã học', body: `${kienTruc()}` },

  /* ───────────── 16.1 ───────────── */
  { t: 'App không chạy bằng root: mỗi thứ một chủ', body: two(
    tree(`/
├── opt/datlich/            root:root 755
│   ├── ops/                bootstrap.sh deploy.sh …
│   ├── releases/           mỗi bản một thư mục
│   └── current → releases/20260928-170509
├── etc/datlich/            root:datlich 750
│   └── datlich.env         640 — bí mật
├── var/lib/datlich/        datlich 750 — CSDL
├── var/log/datlich/        datlich 750 — log
└── var/backups/datlich/    datlich 750 — 7 bản`),
    `${table(['Ai', 'Là gì', 'Được làm gì'], [
      ['<code>datlich</code>', 'user hệ thống, shell <code>nologin</code>', 'chạy app; ghi CSDL + log; KHÔNG sửa được mã'],
      ['<code>deploy</code>', 'user SSH bằng khoá', 'chỉ <code>sudo deploy.sh</code> (sudoers 1 dòng)'],
      ['<code>root</code>', 'chủ mã + cấu hình', 'không đăng nhập SSH được'],
    ], { sm: true })}
    ${term(['$ sudo -u datlich touch /opt/datlich/current/x', "! touch: cannot touch '/opt/datlich/current/x': Permission denied", '$ sudo -u deploy cat /etc/datlich/datlich.env', '! cat: /etc/datlich/datlich.env: Permission denied'], { title: 'VPS — quyền tối thiểu, đo thật', fs: 13.5 })}`) },

  { t: 'bootstrap.sh: kiểm trước, làm sau — chạy lại không hỏng', body: two(
    sh([
      ['set -Eeuo pipefail', 'Ch7: hỏng là dừng'],
      ['cai() {', 'chỉ ghi khi nội dung KHÁC'],
      ['  if cmp -s "$1" "$2"; then ok "$2"; return 1; fi', ''],
      ['  lam "cài $2"; install -m "$3" "$1" "$2"', 'install = cp + chmod'],
      ['}', ''],
      ['thu_muc() {', 'đã đúng chủ + quyền?'],
      ["  if [[ -d $1 && $(stat -c '%U:%G %a' \"$1\") == \"$2 $3\" ]]", ''],
      ['  then ok "$1"; return; fi', ''],
      ['  install -d -o "${2%:*}" -g "${2#*:}" -m "$3" "$1"', 'Ch6: ${x%:*}'],
      ['}', ''],
      ['id -u datlich &>/dev/null ||', 'có rồi thì thôi'],
      ['  useradd --system --shell /usr/sbin/nologin datlich', ''],
      ['[[ -f $ENV ]] || tạo_env_một_lần', 'KHÔNG ghi đè bí mật'],
      ['cai "$HT/datlich.service" /etc/systemd/… && NAP=1', ''],
      ['(( NAP )) && systemctl daemon-reload', 'chỉ khi unit đổi'],
    ], { fs: 13.5 }),
    `${cards([
      { t: '✓ = đã đúng', d: 'không đụng vào', c: 'grn' },
      { t: '→ = vừa sửa', d: 'đếm vào “N thay đổi”', c: 'amb' },
    ], 2)}
    ${box('tip', '<strong>Idempotent</strong> (chạy lại cho cùng kết quả): mỗi bước hỏi “đã đúng chưa?” trước khi làm. Nhờ vậy script vừa là <em>cài đặt</em> vừa là <em>kiểm tra</em>: chạy lại mà ra “0 thay đổi” nghĩa là máy vẫn đúng như bản thiết kế.')}
    ${box('warn', 'Đừng <code>echo … &gt;&gt; file</code> trong bootstrap: chạy lần hai là dòng bị nhân đôi. Dùng <code>grep -qxF</code> trước, hoặc ghi cả file rồi so bằng <code>cmp</code>.')}`) },

  { t: 'Lần 1 hỏng giữa chừng, lần 2 đi tiếp, lần 3: 0 thay đổi', body: two(
    term(['$ sudo ./ops/bootstrap.sh ~/.ssh/id_ed25519.pub', '1/7 Gói phần mềm', '  ✓ đủ 7 gói', '2/7 Người dùng', '+   → tạo user hệ thống datlich (không đăng nhập được)', '+   → tạo user deploy', '3/7 Thư mục và quyền', '+   → thư mục /opt/datlich → root:root 755', '# … 24 dòng “→” nữa …', '5/7 SSH chỉ bằng khoá', '+   → cài /etc/ssh/sshd_config.d/01-datlich.conf', '! Missing privilege separation directory: /run/sshd   (×2)', "! bootstrap: hỏng ở dòng 92: sed 's/^/    sshd -T: /'", '! mã=1'], { title: 'VPS — lần 1 (máy mới tinh)', fs: 13 }),
    `${term(['$ sudo ./ops/bootstrap.sh ~/.ssh/id_ed25519.pub | tail -n 8', '6/7 Tường lửa', '  ✓ ufw đang bật', '7/7 Dịch vụ và hẹn giờ', '  ✓ datlich.service', '  ✓ datlich-saoluu.timer', '  ✓ datlich-giamsat.timer', '  ✓ datlich-baocao.timer', '= Xong: 0 thay đổi.', '# real 0m0.124s'], { title: 'VPS — lần 3', fs: 13 })}
    ${box('bad', '24.04: <code>ssh.socket</code> chỉ khởi động sshd khi có kết nối ⇒ <code>/run/sshd</code> chưa có ⇒ <code>sshd -t</code> hỏng. Sửa: <code>install -d -m 755 /run/sshd</code>, chạy lại — bước đã xong chỉ in ✓.')}`) },

  { t: 'SSH chỉ bằng khoá — nghiệm thu bằng sshd -T', body: two(
    term(['$ ssh deploy@vps whoami', 'deploy', '$ ssh -o PubkeyAuthentication=no deploy@vps', '! deploy@127.0.0.1: Permission denied (publickey).', '$ ssh root@vps', '! root@127.0.0.1: Permission denied (publickey).', '$ sudo sshd -T | grep -E "^(passwordauth|permitroot|allowusers)"', '= permitrootlogin no', '= passwordauthentication no', '= allowusers deploy'], { title: 'VPS — ba lần thử, đo thật', fs: 13.5 }),
    `${sh([
      ['# /etc/ssh/sshd_config.d/01-datlich.conf', ''],
      ['PasswordAuthentication no', ''],
      ['KbdInteractiveAuthentication no', ''],
      ['PermitRootLogin no', ''],
      ['AllowUsers deploy', ''],
    ], { fs: 14.5, so: false })}
    ${box('warn', 'Tên <code>01-</code>: sshd lấy giá trị ĐẦU TIÊN đọc được; <code>50-cloud-init.conf</code> của VPS cloud nói <code>yes</code> (Bài 11.3).')}
    ${box('bad', 'Bẫy đo thật: <code>set -o pipefail; sshd -T | grep -q …</code> trả <strong>141</strong> dù tìm thấy — grep -q thoát sớm, sshd chết vì SIGPIPE. Dùng <code>grep … &gt;/dev/null</code>.')}`) },

  { t: 'Tường lửa: chặn mặc định, chỉ mở 22 và 80', body: two(
    term(['$ sudo ufw status verbose', 'Status: active', 'Default: deny (incoming), allow (outgoing), deny (routed)', '', 'To                         Action      From', '22/tcp (OpenSSH)           ALLOW IN    Anywhere', '80/tcp (Nginx HTTP)        ALLOW IN    Anywhere', '22/tcp (OpenSSH (v6))      ALLOW IN    Anywhere (v6)', '80/tcp (Nginx HTTP (v6))   ALLOW IN    Anywhere (v6)'], { title: 'VPS', fs: 13 }),
    `${term(['$ curl -m 5 http://vps:8080/health', '! curl: (28) Connection timed out after 5002 milliseconds', '$ curl -m 5 http://vps/health', '= {"status": "ok", "version": "1.1.0"}', '# cùng lệnh, ufw TẮT:', '$ curl -m 5 http://vps:8080/health', "! curl: (7) Failed to connect … Couldn't connect to server"], { title: 'một máy khác trong cùng mạng', fs: 13 })}
    ${box('tip', '<strong>Timeout</strong> = gói tin bị tường lửa NUỐT (DROP). <strong>Refused</strong> = tới nơi nhưng không ai nghe (app chỉ nghe 127.0.0.1). Hai lớp chặn, hai triệu chứng khác nhau (Bài 9.5, 12.2).')}`) },

  /* ───────────── 16.2 ───────────── */
  { t: 'deploy.sh: bộ giáp set -Eeuo, trap, flock', body: two(
    sh([
      ['set -Eeuo pipefail; shopt -s inherit_errexit', 'Ch7 + Ch13'],
      ['readonly APP=datlich REL=/opt/datlich/releases', ''],
      ['log() { printf \'%(%F %T)T %-5s %s\\n\' -1 "$1" "${*:2}" |', 'log có mức'],
      ['        tee -a "$LOG" >&2; }', 'ra stderr + file'],
      ['die() { log ERROR "$1"; exit "${2:-1}"; }', 'mã thoát có nghĩa'],
      ["TAM=''", ''],
      ['don_dep() { if [[ -n $TAM && -d $TAM ]]; then rm -rf -- "$TAM"; fi; }', ''],
      ['trap don_dep EXIT', 'dọn thư mục tạm'],
      ["trap 'log ERROR \"dòng $LINENO: $BASH_COMMAND\"' ERR", 'nói hỏng ở đâu'],
      ['(( EUID == 0 )) || { echo "cần sudo" >&2; exit 2; }', ''],
      ['exec {KHOA}>"/run/lock/$APP-deploy.lock"', 'fd tự cấp (Ch13)'],
      ['flock -n "$KHOA" || die "đang có deploy khác" 3', 'một bản mỗi lúc'],
    ], { fs: 13.5 }),
    `${table(['Mã', 'Nghĩa'], [
      ['+0', 'bản mới khoẻ, đang chạy'],
      ['- 1', 'health hỏng ⇒ ĐÃ quay lui'],
      ['!2', 'gọi sai / gói hỏng — chưa đụng gì'],
      ['!3', 'có deploy khác đang chạy'],
      ['- 4', 'quay lui cũng hỏng — gọi người'],
    ], { sm: true })}
    ${box('tip', 'CI hay cron đọc được mã thoát: 3 = thử lại sau, 1 = báo nhóm, 4 = đánh thức người trực.')}`) },

  { t: 'Mỗi bản một thư mục; current chỉ là mũi tên', body: `${banPhatHanh()}
    ${two(
      sh([
        ['doi_symlink() {', ''],
        ['  ln -sfn "$1" "$GOC/.current.moi"', 'tạo mũi tên mới bên cạnh'],
        ['  mv -T "$GOC/.current.moi" "$GOC/current"', 'rename(): nguyên tử'],
        ['}', ''],
      ], { fs: 14 }),
      box('info', 'strace thật: <code>ln -sfn</code> của coreutils 9.4 (Ubuntu 24.04) tự tạo tên tạm rồi <code>renameat</code>; BusyBox (Alpine) thì <code>unlinkat</code> RỒI mới <code>symlinkat</code> — có lúc không có <code>current</code>. <code>mv -T</code> đúng trên mọi Linux.'), 'l')}` },

  { t: 'Health check quyết định: giữ bản mới hay quay lui', body: `${luongDeploy()}
    ${term(['$ ssh deploy@vps sudo deploy.sh datlich-1.2.0.tgz', '2026-09-28 17:04:27 INFO  bản 1.2.0 → 20260928-170427 (đang chạy: 20260928-170424)', '+ 2026-09-28 17:04:37 WARN  health check hỏng sau 10 lần thử — QUAY LUI', '! 2026-09-28 17:04:38 ERROR deploy thất bại, đã về 20260928-170424. Xem: journalctl -u datlich -n 30', 'mã=1        # 11 giây sau, người dùng lại được bản 1.1.0 phục vụ'], { title: 'VPS — bản 1.2.0 cần biến SMS_API_KEY chưa ai thêm vào datlich.env', fs: 13 })}` },

  { t: 'Liệt kê, quay lui tay, và hai người deploy cùng lúc', body: two(
    term(['$ sudo deploy.sh datlich-1.2.1.tgz   # app.py sai cú pháp', '!   File "<unknown>", line 64', '!     def hong(:', '! SyntaxError: invalid syntax', '! … ERROR app.py sai cú pháp — không đụng vào bản đang chạy', '= mã=2', '$ deploy.sh x.tgz & deploy.sh x.tgz; wait', '… INFO  bản 1.1.0 → 20260928-170452 (đang chạy: 20260928-170424)', '! … ERROR đang có một deploy khác chạy — thử lại sau', '= mã bản thứ hai=3'], { title: 'VPS', fs: 13 }),
    term(['$ sudo deploy.sh --rollback', '… INFO  đã quay lui 20260928-170452 → 20260928-170424 (1.1.0)', '$ sudo deploy.sh --list', '  20260928-170422  1.0.0', '= * 20260928-170424  1.1.0', '  20260928-170452  1.1.0', '# … ba lần deploy nữa:', '… INFO  dọn 1 bản cũ (giữ 5)', '$ readlink /opt/datlich/current', '/opt/datlich/releases/20260928-170509'], { title: 'VPS', fs: 13 })) },

  { t: 'Lần chạy thật đầu tiên: StartLimitBurst khoá luôn cả quay lui', body: two(
    term(['$ sudo deploy.sh datlich-1.2.0.tgz', '… WARN  health check hỏng sau 10 lần thử — QUAY LUI', '! Job for datlich.service failed because the control process exited with error code.', '! … ERROR lệnh hỏng ở dòng 57: systemctl restart "$APP"', '$ journalctl -u datlich -o cat | grep -m1 -A3 "counter is at 2"', 'datlich.service: Scheduled restart job, restart counter is at 2.', '! datlich.service: Start request repeated too quickly.', "! datlich.service: Failed with result 'exit-code'.", '! Failed to start datlich.service - Đặt lịch phòng khám (API).'], { title: 'VPS — bản deploy.sh đầu tiên', fs: 13 }),
    `${box('bad', 'Bốn lần start do deploy trong vòng một phút + 1 lần <code>Restart=</code> tự dựng lại = 5 lần trong 60 s = chạm <code>StartLimitBurst=5</code>. Từ lần thứ sáu systemd TỪ CHỐI mọi lần start — kể cả lần quay lui. Web chết dù bản cũ vẫn tốt.')}
    ${sh([
      ['khoi_dong_lai() {', ''],
      ['  systemctl reset-failed "$APP" 2>/dev/null || true', 'xoá bộ đếm'],
      ['  systemctl restart "$APP"', ''],
      ['}', ''],
    ], { fs: 14 })}
    ${P('Sau khi sửa: 1.2.0 hỏng ⇒ quay lui thành công sau 11 giây (slide trước).')}`) },

  { t: 'Unit của app: User=, Restart=, MemoryMax=, EnvironmentFile=', body: two(
    sh([
      ['[Unit]', ''],
      ['After=network-online.target', ''],
      ['StartLimitIntervalSec=60', 'đặt ở [Unit]'],
      ['StartLimitBurst=5', '5 lần/60 s thì thôi'],
      ['[Service]', ''],
      ['User=datlich', 'không phải root'],
      ['EnvironmentFile=/etc/datlich/datlich.env', 'PORT, DB_PATH, bí mật'],
      ['WorkingDirectory=/opt/datlich/current', 'symlink: đọc lúc START'],
      ['ExecStart=/usr/bin/python3 /opt/datlich/current/app.py', ''],
      ['Restart=on-failure', 'chết bất thường ⇒ dựng lại'],
      ['RestartSec=2', ''],
      ['MemoryMax=150M', 'trần RAM của cgroup'],
      ['MemorySwapMax=0', 'KHÔNG thì trần tràn ra swap'],
      ['NoNewPrivileges=yes', ''],
      ['ProtectSystem=strict', '/ chỉ đọc…'],
      ['ReadWritePaths=/var/lib/datlich /var/log/datlich', '…trừ hai chỗ này'],
      ['[Install]', ''],
      ['WantedBy=multi-user.target', 'bật cùng máy'],
    ], { fs: 13 }),
    `${box('info', 'Đường dẫn tuyệt đối trong <code>ExecStart=</code>; <code>EnvironmentFile=</code> KHÔNG phải bash — không <code>export</code>, không <code>$(…)</code> (Bài 11.1).')}
    ${box('warn', 'Sửa file unit xong phải <code>systemctl daemon-reload</code>. Quên: <code>restart</code> vẫn chạy CẤU HÌNH CŨ, chỉ in một dòng Warning.')}
    ${term(['$ systemd-analyze security datlich | tail -1', '+ → Overall exposure level for datlich.service: 8.3 EXPOSED :-('], { title: 'VPS', fs: 13 })}
    ${P('8.3 vẫn “lộ”: còn nhiều lớp hộp cát để siết — Bài 11.1, 14.4.')}`) },

  { t: 'systemctl status đọc được: cgroup, RAM và trần', body: two(
    term(['$ systemctl status datlich', '● datlich.service - Đặt lịch phòng khám (API)', '     Loaded: loaded (/etc/systemd/system/datlich.service; enabled; …)', '=      Active: active (running) since Mon 2026-09-28 17:05:09 UTC; 19s ago', '   Main PID: 2728 (python3)', '      Tasks: 1 (limit: 9563)', '+      Memory: 9.8M (max: 150.0M available: 140.1M peak: 9.8M)', '     CGroup: /system.slice/datlich.service', '             └─2728 /usr/bin/python3 /opt/datlich/current/app.py', '$ ps -o user,pid,rss,cmd -C python3', 'USER         PID   RSS CMD', 'datlich     2728 20448 /usr/bin/python3 /opt/datlich/current/app.py'], { title: 'VPS', fs: 12.5 }),
    `${table(['Dòng', 'Đọc thế nào'], [
      ['<code>enabled</code>', 'sẽ tự chạy khi máy khởi động'],
      ['<code>active (running)</code>', 'đang chạy; <code>failed</code> = đã chết'],
      ['<code>Memory: … max:</code>', 'đang dùng / trần <code>MemoryMax</code>'],
      ['<code>CGroup:</code>', 'MỌI tiến trình của dịch vụ (Bài 14.1)'],
      ['<code>USER datlich</code>', 'chạy đúng người, không phải root'],
    ], { sm: true })}
    ${P('RSS của ps (20 MB) ≠ Memory của cgroup (9,8 MB): hai cách đếm khác nhau — Bài 5.2.')}`) },

  /* ───────────── 16.3 ───────────── */
  { t: 'Sao lưu: sqlite3 .backup, kiểm, giữ đúng 7 bản', body: two(
    sh([
      ['set -Eeuo pipefail', ''],
      ['readonly DB=/var/lib/datlich/datlich.db GIU=7', ''],
      ['ten=$DICH/datlich-$(date +%Y%m%d-%H%M%S).db.gz', 'tên có thời gian'],
      ['tam=$(mktemp "$DICH/.dang-ghi.XXXXXX")', 'cùng thư mục đích'],
      ['trap \'rm -f -- "$tam" "$tam.gz"\' EXIT', ''],
      ['sqlite3 "$DB" ".backup \'$tam\'"', 'chụp nhất quán'],
      ['kq=$(sqlite3 "$tam" \'PRAGMA integrity_check;\')', ''],
      ['[[ $kq == ok ]] || { echo "hỏng: $kq" >&2; exit 1; }', 'kiểm TRƯỚC khi giữ'],
      ['gzip -9 "$tam"', ''],
      ['mv -T "$tam.gz" "$ten"', 'tên thật = đã đủ'],
      ["mapfile -t cu < <(find \"$DICH\" -name 'datlich-*.db.gz' |", ''],
      ['                  sort -r | tail -n +$((GIU + 1)))', 'từ bản thứ 8 trở đi'],
      ['(( ${#cu[@]} )) && rm -f -- "${cu[@]}"', ''],
    ], { fs: 13.5 }),
    `${box('bad', '<code>cp datlich.db</code> lúc app đang ghi = có thể chép nửa giao dịch. <code>.backup</code> của SQLite (hoặc <code>pg_dump</code> với PostgreSQL) mới cho một bản nhất quán.')}
    ${box('tip', 'Bản sao lưu chưa từng khôi phục thử = chưa có bản sao lưu. Thử: <code>zcat …gz &gt; /tmp/thu.db; sqlite3 /tmp/thu.db "select count(*) from lich"</code> → <code>2</code>.')}
    ${box('warn', 'Bản sao lưu nằm CÙNG máy chỉ cứu được lỗi người và lỗi app, không cứu được máy chết. Đẩy thêm một bản ra ngoài (rsync, Bài 9.4).')}`) },

  { t: 'Timer theo giờ Việt Nam trên một máy chạy UTC', body: two(
    `${sh([
      ['# /etc/systemd/system/datlich-saoluu.timer', ''],
      ['[Timer]', ''],
      ['OnCalendar=*-*-* 02:30:00 Asia/Ho_Chi_Minh', 'múi giờ ngay trong lịch'],
      ['Persistent=true', 'máy tắt lúc 02:30 ⇒ bù khi bật'],
      ['RandomizedDelaySec=5min', 'rải tải'],
      ['[Install]', ''],
      ['WantedBy=timers.target', ''],
    ], { fs: 14 })}
    ${box('tip', 'Timer đi cặp với <code>datlich-saoluu.service</code> (<code>Type=oneshot</code>, <code>User=datlich</code>). Chạy tay ngay: <code>sudo systemctl start datlich-saoluu.service</code>.')}`,
    term(['$ date; TZ=Asia/Ho_Chi_Minh date', 'Mon Sep 28 17:06:19 UTC 2026', 'Tue Sep 29 00:06:19 +07 2026', '$ systemd-analyze calendar "*-*-* 02:30:00 Asia/Ho_Chi_Minh"', 'Normalized form: *-*-* 02:30:00 Asia/Ho_Chi_Minh', '=     Next elapse: Mon 2026-09-28 19:30:00 UTC', '       From now: 2h 23min left', '$ systemctl list-timers "datlich-*"', 'NEXT                            LEFT UNIT', 'Mon 2026-09-28 17:06:41 UTC      21s datlich-giamsat.timer', 'Mon 2026-09-28 19:31:05 UTC 2h 24min datlich-saoluu.timer', 'Tue 2026-09-29 00:30:00 UTC       7h datlich-baocao.timer'], { title: 'VPS (cột LAST/PASSED/ACTIVATES được cắt bớt)', fs: 12.5 })) },

  { t: 'Chạy 10 lần, còn đúng 7 — và luật 5 lần/10 giây', body: two(
    term(['$ for i in $(seq 8); do sleep 1.1; sudo systemctl start datlich-saoluu.service; done', '! Job for datlich-saoluu.service failed.', '! Job for datlich-saoluu.service failed.   # × 4', '$ journalctl -u datlich-saoluu -o cat | grep -m1 "too quickly"', '! datlich-saoluu.service: Start request repeated too quickly.', '$ systemctl show datlich-saoluu -p StartLimitBurst -p StartLimitIntervalUSec', 'StartLimitIntervalUSec=10s', 'StartLimitBurst=5'], { title: 'VPS — lần thử đầu, cách nhau 1,1 s', fs: 12.5 }),
    term(['$ sudo systemctl reset-failed datlich-saoluu', '# … cách nhau 2,2 s: không chạm giới hạn', '$ journalctl -u datlich-saoluu -o cat | tail -n 2', 'đã sao lưu datlich-20260928-170611.db.gz (4.0K)', '+ xoá 1 bản cũ nhất, còn 7', '$ ls -1 /var/backups/datlich', 'datlich-20260928-170544.db.gz', 'datlich-20260928-170545.db.gz', 'datlich-20260928-170602.db.gz', 'datlich-20260928-170604.db.gz', 'datlich-20260928-170606.db.gz', 'datlich-20260928-170608.db.gz', 'datlich-20260928-170611.db.gz'], { title: 'VPS — 10 lần thành công, còn 7 file', fs: 12.5 })) },

  { t: 'logrotate đổi TÊN file; app phải mở lại', body: `${xoayLog()}
    ${two(
      sh([
        ['/var/log/datlich/access.log {', ''],
        ['    daily', ''],
        ['    rotate 14', 'giữ 14 bản'],
        ['    compress', ''],
        ['    delaycompress', 'bản .1 chưa nén'],
        ['    create 0640 datlich datlich', ''],
        ['    su datlich datlich', 'thư mục không của root'],
        ['    postrotate', ''],
        ['        systemctl kill -s HUP --kill-whom=main datlich.service', ''],
        ['    endscript', ''],
        ['}', ''],
      ], { fs: 12.5 }),
      term(['# thiếu postrotate:', '$ ls -l /proc/$PID/fd | grep access', '! 3 -> /var/log/datlich/access.log.1', '# có postrotate:', '$ journalctl -u datlich -n 1 -o cat', '= nhận SIGHUP: đã mở lại /var/log/datlich/access.log', '$ ls /var/log/datlich/access.log*   # sau 2 lần xoay', 'access.log  access.log.1  access.log.2.gz'], { title: 'VPS', fs: 12.5 }))}` },

  { t: 'Giám sát: chỉ báo khi TRẠNG THÁI đổi', body: two(
    sh([
      ['set -Euo pipefail', 'cố ý KHÔNG có -e'],
      ['loi=()', ''],
      ['(( dung < 85 )) || loi+=("đĩa $fs đầy ${dung}%")', 'df --output=pcent'],
      ['(( ino < 85 ))  || loi+=("inode $fs đầy ${ino}%")', 'df --output=ipcent'],
      ['(( ram >= 100 )) || loi+=("RAM còn ${ram} MB")', 'MemAvailable'],
      ['systemctl is-active -q datlich || loi+=(…)', ''],
      ['curl -fsS -m 3 -o /dev/null http://127.0.0.1/health \\', ''],
      ['  || loi+=("health qua nginx hỏng")', ''],
      ['find … -mmin -1560 -print -quit  # sao lưu < 26 giờ', ''],
      ['cu=$(cat "$TT" 2>/dev/null || echo OK)', 'trạng thái lần trước'],
      ['if [[ $hien != "$cu" ]]; then bao "…"; fi', 'đổi mới báo'],
      ['bao(): >> canh-bao.log · logger · curl webhook', ''],
    ], { fs: 13 }),
    term(['$ sudo systemctl stop datlich; sudo giam-sat.sh', '! curl: (22) The requested URL returned error: 502', 'giám sát: 2 vấn đề — dịch vụ datlich: inactive; health qua nginx hỏng', '$ sudo giam-sat.sh        # 5 phút sau: vẫn hỏng', 'giám sát: 2 vấn đề — …   (KHÔNG gửi lại)', '$ sudo systemctl start datlich; sudo giam-sat.sh', 'giám sát: 0 vấn đề — OK', '$ journalctl -u webhook-gia -o cat', '! WEBHOOK nhận: [clinic-vps] CẢNH BÁO: dịch vụ datlich: inactive; health …', '= WEBHOOK nhận: [clinic-vps] ĐÃ ỔN (trước đó: dịch vụ datlich: inactive; …)'], { title: 'VPS — webhook giả lập thay Slack/Discord/Telegram', fs: 12.5 })) },

  { t: 'journalctl -p err bỏ sót Traceback; báo cáo sáng', body: two(
    term(['$ journalctl -u datlich -p err --since -30min', 'Sep 28 17:03:39 … Failed to start datlich.service …', 'Sep 28 17:03:44 … Failed to start datlich.service …', '$ journalctl -u datlich -g KeyError -o json -n 1 | jq "{PRIORITY, MESSAGE}"', '{', '!   "PRIORITY": "6",', '  "MESSAGE": "KeyError: \'SMS_API_KEY\'"', '}', '$ journalctl -u datlich --since -30min -o cat | grep -c Traceback', '= 7'], { title: 'VPS — stdout/stderr của app đều vào journal ở mức 6 (info)', fs: 12.5 }),
    term(['$ journalctl -u datlich-baocao -o cat', 'BÁO CÁO SÁNG 2026-09-29 00:08 giờ VN — máy clinic-vps', '── tài nguyên', '  /           911G   24G  842G   3%', '  RAM: dùng 2805 MB, khả dụng 5128 MB', '── dịch vụ', '  datlich active · bản 1.1.0 · khởi động lại 0 lần · RAM 12M', '+   24h: 7 lần app văng Traceback · 2 dòng systemd mức err', '  yêu cầu HTTP: 5, lỗi 5xx: 0', '── sao lưu', '  mới nhất: datlich-20260928-170611.db.gz', '  số bản: 7'], { title: 'VPS — datlich-baocao.timer, 07:30 giờ VN', fs: 12.5 })) },

  /* ───────────── 16.4 ───────────── */
  { t: '8 sự cố tuần đầu: triệu chứng → lệnh đầu tiên', body: table(['#', 'Triệu chứng', 'Lệnh đầu tiên', 'Học ở'], [
    ['1', 'df 100%, xoá file mà không trả chỗ', '<code>lsof -a +L1 /var/log/datlich</code>', '10.1 · 12.3'],
    ['2', '<code>No space left</code> mà df -h còn 93M', '<code>df -i</code> · <code>du --inodes</code>', '10.1 · 14.3'],
    ['3', '502 rồi app tự dậy, <code>status=9/KILL</code>', "<code>journalctl -u datlich</code> · <code>-k -g oom</code>", '5.2 · 11.1 · 14.1'],
    ['4', 'app không lên, <code>Errno 98</code>', '<code>ss -ltnp "sport = :8080"</code>', '12.2'],
    ['5', 'đọc được, ghi thì 502 <code>readonly database</code>', '<code>namei -l</code> · <code>sudo -u datlich test -w</code>', '4.5 · 14.4'],
    ['6', 'báo cáo 07:30 chạy lúc 14:30', '<code>timedatectl</code> · <code>systemd-analyze calendar</code>', '11.2'],
    ['7', '<code>$\'\\r\'</code> / <code>env: use -[v]S</code>, 127', '<code>file</code> · <code>cat -A</code>', '7.1 · 12.4 · 15.3'],
    ['8', 'sửa config “xong” mà không có tác dụng', '<code>sshd -T</code> · <code>ls -i</code> · <code>daemon-reload</code>', '2.4 · 11.3'],
  ], { sm: true }) },

  { t: 'Đĩa đầy mà rm không trả chỗ: lsof -a +L1', body: two(
    term(['$ sudo giam-sat.sh', '! giám sát: 1 vấn đề — đĩa /var/log/datlich đầy 100%', '$ sudo du -xah /var/log/datlich | sort -h | tail -n 2', '40M	/var/log/datlich', '40M	/var/log/datlich/nhac-lich-debug.log', '$ sudo rm /var/log/datlich/nhac-lich-debug.log; df -h /var/log/datlich', 'Filesystem      Size  Used Avail Use% Mounted on', '! tmpfs            40M   40M     0 100% /var/log/datlich', '$ journalctl -u datlich-nhaclich -n 1 -o cat', 'ghi log hỏng: [Errno 28] No space left on device'], { title: 'VPS — worker nhắc lịch quên tắt DEBUG (tmpfs 40M)', fs: 12.5 }),
    `${term(['$ sudo lsof -a +L1 /var/log/datlich', 'COMMAND  PID    USER   FD   SIZE/OFF NLINK NAME', '+ python3 3775 datlich    3w   41918464     0 …/nhac-lich-debug.log (deleted)', '$ sudo truncate -s 0 /proc/3775/fd/3', '$ df -h /var/log/datlich', '= tmpfs            40M   24K   40M   1% /var/log/datlich'], { title: 'VPS (cột TYPE/DEVICE/NODE cắt bớt)', fs: 12.5 })}
    ${box('warn', 'Thiếu <code>-a</code>, lsof <strong>HOẶC</strong> hai điều kiện: <code>lsof +L1 /var/log/datlich</code> in cả <code>access.log</code> (NLINK 1) lẫn file đã xoá. <code>-a</code> = “và”.')}
    ${P('Phòng: logrotate cho mọi file log, giám sát đĩa, log dài hạn vào journal (có trần SystemMaxUse).')}`) },

  { t: 'Còn 93M trống mà không tạo nổi file: hết inode', body: two(
    term(['$ sudo -u datlich touch /var/cache/datlich/phieu/moi.pdf', "! touch: cannot touch '…/moi.pdf': No space left on device", '$ df -h /var/cache/datlich', 'Filesystem      Size  Used Avail Use% Mounted on', '= tmpfs           100M  7.9M   93M   8% /var/cache/datlich', '$ df -i /var/cache/datlich', 'Filesystem     Inodes IUsed IFree IUse% Mounted on', '! tmpfs            2000  2000     0  100% /var/cache/datlich', '$ sudo du --inodes -xd1 /var/cache/datlich | sort -n | tail -n 2', '1999	/var/cache/datlich/phieu', '2000	/var/cache/datlich'], { title: 'VPS — mỗi phiếu hẹn một file PDF nhỏ, không ai dọn', fs: 12.5 }),
    `${sh([
      ['# /etc/tmpfiles.d/datlich.conf', ''],
      ['# loại đường dẫn                quyền chủ    nhóm    tuổi', ''],
      ['d      /var/cache/datlich/phieu 0750  datlich datlich 7d', ''],
    ], { fs: 13, so: false })}
    ${term(['$ sudo systemd-tmpfiles --clean /tmp/thu-10s.conf   # cùng luật, tuổi 10s', '$ df -i /var/cache/datlich', '= tmpfs            2000     2  1998    1% /var/cache/datlich'], { title: 'VPS', fs: 12.5 })}
    ${box('tip', '<code>systemd-tmpfiles-clean.timer</code> chạy sẵn mỗi ngày: chỉ cần thả luật vào <code>/etc/tmpfiles.d/</code>. Mỗi file tốn MỘT inode dù chỉ 20 byte.')}`) },

  { t: 'OOM: MemoryMax chỉ là trần thật khi tắt swap', body: two(
    term(['# MemoryMax=150M, CHƯA có MemorySwapMax=0', "$ curl -s -w ' → HTTP %{http_code}' localhost/api/xuat?n=300", '= {"bytes": 314572800} → HTTP 200', '$ systemctl show datlich -p MemoryPeak -p MemoryMax', 'MemoryPeak=157286400', 'MemoryMax=157286400', '$ systemctl show datlich -p MemorySwapPeak', '+ MemorySwapPeak=175337472      # 167 MB đẩy ra swap', '# thêm MemorySwapMax=0, daemon-reload, restart:', "$ curl -s -w ' → HTTP %{http_code}' localhost/api/xuat?n=300", '! <title>502 Bad Gateway</title> → HTTP 502'], { title: 'VPS — xuất báo cáo dựng cả file trong RAM', fs: 12.5 }),
    term(['$ journalctl -u datlich -n 5 -o cat', '! datlich.service: A process of this unit has been killed by the OOM killer.', '! datlich.service: Main process exited, code=killed, status=9/KILL', "! datlich.service: Failed with result 'oom-kill'.", '+ datlich.service: Scheduled restart job, restart counter is at 1.', '= Started datlich.service - Đặt lịch phòng khám (API).', '$ journalctl -k --case-sensitive=no -g oom -n 1 -o cat', 'Memory cgroup out of memory: Killed process 10562 (python3) …', '  anon-rss:153096kB … UID:999', '$ curl -s localhost/health', '= {"status": "ok", "version": "1.1.0"}'], { title: 'VPS — cgroup giết app, Restart= dựng lại sau 2 giây', fs: 12.5 })) },

  { t: 'Cổng bị chiếm · file của root: hai kiểu “app chết”', body: two(
    term(['$ sudo systemctl start datlich; sleep 12; systemctl is-active datlich', '! failed', '$ journalctl -u datlich -o cat | grep -m1 Errno', '! OSError: [Errno 98] Address already in use', '$ sudo ss -ltnp "sport = :8080"', 'LISTEN 0 5  127.0.0.1:8080  0.0.0.0:*  users:(("python3",pid=4020,fd=3))', '$ ps -o pid,user,etime,unit,cmd -p 4020', '   4020 root  00:13 thu-nhanh.service  python3 -m http.server 8080', '$ sudo systemctl stop thu-nhanh; sudo systemctl reset-failed datlich', '$ sudo systemctl start datlich'], { title: 'VPS — ai đó “thử nhanh” trên đúng cổng 8080', fs: 12 }),
    term(['# khôi phục “cho nhanh”: zcat bản sao lưu > /tmp/x.db; sudo mv … datlich.db', '$ curl -s -XPOST localhost/api/lich -d …', '! <title>502 Bad Gateway</title>', '$ journalctl -u datlich -n 2 -o cat', '! sqlite3.OperationalError: attempt to write a readonly database', '$ namei -l /var/lib/datlich/datlich.db', 'drwxr-x--- datlich datlich datlich', '! -rw-r--r-- root    root    datlich.db', '$ sudo -u datlich test -w …/datlich.db && echo ghi-được || echo KHÔNG-ghi-được', 'KHÔNG-ghi-được', '$ sudo chown datlich:datlich …; sudo chmod 640 …', '= {"id": 3, "ten": "Phạm D", …} → HTTP 201'], { title: 'VPS — mv giữ chủ root của file mới', fs: 12 })) },

  { t: 'Múi giờ · CRLF · config không ăn: ba lỗi “im lặng”', body: two(
    `${term(['# /etc/cron.d/thu-utc:    14 17 * * *  (giờ UTC)', '# /etc/cron.d/thu-crontz: CRON_TZ=Asia/Ho_Chi_Minh + 14 00 * * *', '$ cat /tmp/cron.log      # lúc 17:14 UTC = 00:14 giờ VN', '= dòng giờ UTC chạy lúc 17:14:01 UTC', '! (dòng CRON_TZ không chạy — cron của Ubuntu bỏ qua CRON_TZ)'], { title: 'VPS — cron 3.0pl1-184ubuntu2', fs: 12 })}
    ${term(['$ sudo systemctl start datlich-giamsat.service', '! Job for datlich-giamsat.service failed …', '$ journalctl -u datlich-giamsat -n 2 -o cat', '! /usr/bin/env: use -[v]S to pass options in shebang lines', '! … status=127/n/a', '$ head -n 1 ops/giam-sat.sh | cat -A', '#!/usr/bin/env bash^M$'], { title: 'VPS — script sửa trên Windows (CRLF)', fs: 12 })}`,
    `${term(['$ ls /etc/ssh/sshd_config.d/', '50-cloud-init.conf  70-hardening.conf', '$ grep -h PasswordAuth /etc/ssh/sshd_config.d/*', 'PasswordAuthentication yes', 'PasswordAuthentication no', '$ sudo sshd -T | grep ^passwordauthentication', '! passwordauthentication yes'], { title: 'VPS — sshd: giá trị ĐẦU TIÊN thắng', fs: 12 })}
    ${term(['$ sed -i s/512/4096/ /srv/repo/nginx.conf   # file được bind-mount', '$ cat /srv/container-thay/nginx.conf', '! worker_connections 512;', '$ ls -i /srv/repo/nginx.conf /srv/container-thay/nginx.conf', '31522 /srv/container-thay/nginx.conf', '31524 /srv/repo/nginx.conf'], { title: 'VPS — sed -i tạo inode MỚI', fs: 12 })}`) },

  { t: 'Sai lầm hay gặp ở Chương 16', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Bootstrap lần 2 nhân đôi dòng', '<code>echo &gt;&gt;</code> không hỏi “đã có chưa”', '<code>grep -qxF</code> trước, hoặc <code>cmp</code> cả file'],
    ['Quay lui cũng không start được', 'chạm <code>StartLimitBurst</code>', '<code>systemctl reset-failed</code> trước <code>restart</code>'],
    ['Deploy “thành công” mà người dùng lỗi', 'không có health check thật', 'kiểm nội dung <code>"status": "ok"</code>, không chỉ mã 200'],
    ['<code>MemoryMax</code> không bao giờ giết', 'trần tràn ra swap', '<code>MemorySwapMax=0</code>'],
    ['Log mới rỗng, log cũ cứ to', 'thiếu <code>postrotate</code> gửi HUP', 'HUP để mở lại, hoặc <code>copytruncate</code>'],
    ['Báo cáo lỗi 24h ghi 0 dù app văng', '<code>-p err</code> không thấy Traceback (mức 6)', '<code>journalctl -g Traceback</code>'],
    ['Cảnh báo dội 288 lần/ngày', 'báo theo lần kiểm, không theo trạng thái', 'lưu trạng thái, chỉ báo khi ĐỔI'],
    ['Khôi phục xong app chỉ đọc được', '<code>mv</code> giữ chủ root', '<code>install -o datlich -g datlich -m 640</code>'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 16 (1/2): dựng máy và deploy', body: two(
    sh([
      ['useradd --system -s /usr/sbin/nologin app', 'user chạy app'],
      ['install -d -o app -g app -m 750 DIR', 'tạo + chủ + quyền'],
      ['install -m 640 -o root -g app src dst', 'chép + quyền'],
      ['cmp -s a b', 'giống nhau? (idempotent)'],
      ['grep -qxF "$dong" f || echo "$dong" >> f', 'thêm một lần'],
      ['visudo -cqf file', 'kiểm sudoers trước khi cài'],
      ['sshd -t  |  sshd -T | grep …', 'cú pháp · giá trị thật'],
      ['ufw default deny incoming', ''],
      ['ufw allow OpenSSH; ufw allow "Nginx HTTP"', ''],
      ['ufw --force enable; ufw status verbose', ''],
      ['ssh -o PubkeyAuthentication=no u@h', 'thử: mật khẩu bị chặn?'],
    ], { fs: 13 }),
    sh([
      ['tar -czf app.tgz -C app .', 'Mac: thêm --no-xattrs'],
      ['scp app.tgz deploy@vps:', ''],
      ['ssh deploy@vps sudo deploy.sh app.tgz', ''],
      ['exec {fd}>f.lock; flock -n "$fd"', 'một deploy mỗi lúc'],
      ['mktemp -d "$REL/.tam.XXXXXX"', 'cùng ổ ⇒ mv nguyên tử'],
      ['ln -sfn "$moi" c.moi; mv -T c.moi current', 'đổi bản'],
      ['[[ -L current ]] && readlink -f current', 'bản đang chạy'],
      ['systemctl reset-failed app', 'xoá bộ đếm start'],
      ['systemctl restart app', ''],
      ['curl -fsS -m 2 http://127.0.0.1:8080/health', 'health'],
      ['systemctl daemon-reload', 'sau khi sửa unit'],
      ['systemd-analyze security app', 'điểm hộp cát'],
    ], { fs: 13 })) },

  { t: 'Bảng tra nhanh Chương 16 (2/2): tự động hoá và sự cố', body: two(
    sh([
      ['sqlite3 db ".backup \'b.db\'"', 'sao lưu nhất quán'],
      ['sort -r | tail -n +8', 'mọi thứ trừ 7 mới nhất'],
      ['systemctl list-timers "app-*"', ''],
      ['systemd-analyze calendar "02:30 Asia/Ho_Chi_Minh"', ''],
      ['systemctl start app-backup.service', 'chạy timer ngay'],
      ['logrotate -d /etc/logrotate.d/app', 'chỉ nói, không làm'],
      ['logrotate -f /etc/logrotate.d/app', 'ép xoay ngay'],
      ['systemctl kill -s HUP --kill-whom=main app', ''],
      ['logger -t app-mon -p user.warning "…"', 'ghi vào journal'],
      ['journalctl -u app -g Traceback --since -24h', ''],
      ['journalctl -u app -o json | jq .PRIORITY', ''],
    ], { fs: 13 }),
    sh([
      ['df -h  |  df -i', 'dung lượng · inode'],
      ['du -xah DIR | sort -h | tail', 'cái gì to'],
      ['lsof -a +L1 /var/log', 'đã xoá còn mở'],
      ['truncate -s 0 /proc/PID/fd/N', 'trả chỗ không kill'],
      ['journalctl -k -g oom --case-sensitive=no', 'ai bị OOM'],
      ['ss -ltnp "sport = :8080"', 'ai giữ cổng'],
      ['namei -l PATH; sudo -u app test -w F', 'vì sao Permission denied'],
      ['timedatectl  |  TZ=Asia/Ho_Chi_Minh date', ''],
      ['file s.sh; cat -A s.sh | head -n 1', 'CRLF?'],
      ['dos2unix s.sh  |  sed -i \'s/\\r$//\' s.sh', ''],
      ['ls -i f  (bind-mount: cat mới > f)', 'inode'],
    ], { fs: 13 })) },

  { t: 'Thực hành Chương 16 (45–60 phút): dựng lại cả máy', body: `
    ${steps([
      ['Container 24.04 có systemd (<code>--privileged</code>, ngắn hạn), chép <code>datlich/</code>, chạy <code>bootstrap.sh</code> ba lần', 'lần cuối: <code>Xong: 0 thay đổi.</code> · <code>sshd -T</code>: <code>passwordauthentication no</code>'],
      ['Đóng gói 1.0.0 và 1.1.0, deploy qua <code>ssh deploy@…</code>; tạo 1.2.0 đòi biến môi trường chưa có', '1.2.0 tự quay lui, <code>deploy.sh --list</code> đánh dấu * đúng bản'],
      ['<code>systemctl start</code> timer sao lưu 9 lần cách nhau ≥ 2,1 s; ép logrotate hai lần', 'còn đúng 7 bản; có <code>access.log.2.gz</code>; journal có “nhận SIGHUP”'],
      ['Dừng app, chạy <code>giam-sat.sh</code> hai lần, bật lại', 'webhook nhận đúng 2 tin: CẢNH BÁO rồi ĐÃ ỔN'],
      ['Dựng lại 3 trong 8 sự cố của 16.4, chẩn đoán bằng lệnh đầu tiên, sửa', 'ghi 3 dòng: triệu chứng · nguyên nhân · cách phòng; rồi <code>docker rm -f</code>'],
    ])}
    ${box('good', '<strong>Đạt khi:</strong> giải thích được vì sao mỗi thư mục có chủ đó, vì sao quay lui chỉ là đổi mũi tên, vì sao giám sát chỉ báo khi trạng thái đổi.')}` },

  { t: 'Cả khoá trong một máy chủ: 17 phần bạn đã đi qua', body: table(['Phần', 'Bạn làm được', 'Dùng ở đâu trong Ch16'], [
    ['Mục 0 · 1 · 2', 'đọc dấu nhắc, đường dẫn, cây FHS; tạo/chép/tìm file, symlink, tar', '<code>/opt</code> <code>/etc</code> <code>/var</code>; <code>tar -czf</code>; <code>current</code>'],
    ['3 · 6', 'ống dẫn, grep/sort/awk; biến, nháy, khai triển', 'đếm 5xx; <code>${moi##*/}</code>'],
    ['4 · 8', 'quyền, user, sudo; PATH, môi trường, bí mật', 'user <code>datlich</code>; sudoers 1 dòng; <code>.env</code> 640'],
    ['5 · 12', 'tiến trình, tín hiệu; chẩn đoán chết/chậm/lạ', 'SIGHUP; OOM; cổng bị chiếm'],
    ['7 · 13', 'script production; bash nâng cao', '<code>set -Eeuo</code>, <code>trap</code>, <code>flock</code>, <code>mapfile</code>'],
    ['9 · 10', 'mạng, SSH, tường lửa; đĩa, gói, log', 'ufw; khoá SSH; <code>df -i</code>; logrotate'],
    ['11 · 14', 'systemd, cron, gia cố; nhân, cgroup, bảo mật sâu', 'unit, timer; <code>MemoryMax</code>; SELinux'],
    ['15 · 16', 'macOS/WSL; một máy chủ trọn vẹn', 'đóng gói từ Mac; CRLF; cả chương này'],
  ], { sm: true }) },
]).map((s) => (s.kind === 'cover' ? s : { ...s, body: s.body + FIX }));
