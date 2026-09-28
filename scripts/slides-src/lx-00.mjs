/**
 * Linux & Bash · Deck lx-00 — Mục 0: Bắt đầu tại đây · giới thiệu · shell là gì · cài đặt · cách học.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 28/09/2026:
 *   • "Ubuntu"  = container ubuntu:24.04 (24.04.5 LTS, bash 5.2.21, coreutils 9.4) trên Docker Desktop (Mac M1,
 *                 nhân 7.0.12-linuxkit, aarch64) — tên container mang tiền tố lx00- (luật an toàn của khoá)
 *   • "Fedora"  = máy linux-nha: Fedora 44, nhân 7.1.3, bash 5.3.9, GNU coreutils 9.10
 *   • "Mac"     = macOS 27.0 (Darwin 27.0.0, arm64), zsh 5.9, /bin/bash 3.2.57, công cụ BSD
 *   • "Alpine"  = alpine:latest (BusyBox v1.37.0)
 * Mốc lịch sử + số liệu: kiểm nguồn 28/09/2026 (Wikipedia History of Unix/Linux, Bash, GNU Project, BSD, Multics,
 * FSF, Thompson shell, Minix; W3Techs 28/09/2026; TOP500 06/2026; Stack Overflow Developer Survey 2025). Sự cố:
 * issue GitHub steam-for-linux #3671, bumblebee #123, post-mortem GitLab 31/01/2017, AWS S3 28/02/2017, CVE-2014-6271.
 *
 * Hình tự vẽ (SVG nội tuyến, không đụng thư viện): dòng thời gian 1969→2019.
 */
import { S, cover, sh, pipe, term, mindmap, diagram, cards, box, steps, table, vs, kpis, two, sv, T, D } from './_lx-chung.mjs';

export const deck = { key: 'lx-00', code: 'LINUX · MỤC 0', title: 'Bắt đầu: Linux, shell & cách học', sub: 'Linux & Bash · Mục 0' };

/* ───────────── dòng thời gian (hai làn: Unix & shell · Linux & ngày nay) ───────────── */
const timeline = () => {
  const lane = (y, label, c, ev) => {
    const x0 = 72, dx = 143;
    let s = T(0, y - 64, label, { fs: 16, c, b: true });
    s += `<line x1="20" y1="${y}" x2="1150" y2="${y}" stroke="${D[c]}" stroke-width="3" opacity=".55"/>`;
    ev.forEach(([yr, t, d1, d2], i) => {
      const x = x0 + i * dx;
      s += T(x, y - 18, yr, { fs: 21, c, b: true, a: 'middle', mono: true });
      s += `<circle cx="${x}" cy="${y}" r="8" fill="${D[c]}" stroke="#070b08" stroke-width="3"/>`;
      s += T(x, y + 32, t, { fs: 16, b: true, a: 'middle' });
      s += T(x, y + 54, d1, { fs: 13.5, c: 'mu', a: 'middle' });
      if (d2) s += T(x, y + 73, d2, { fs: 13.5, c: 'mu', a: 'middle' });
    });
    return s;
  };
  return sv(1150, 440,
    lane(92, 'UNIX & SHELL — Bell Labs, Berkeley, GNU', 'lx', [
      ['1969', 'Unix', 'Thompson & Ritchie', 'Bell Labs'],
      ['1971', 'shell đầu tiên', 'Thompson shell', 'sách man 3/11'],
      ['1973', 'C + ống |', 'Unix V4 viết bằng C', 'pipe của McIlroy'],
      ['1978', 'BSD', 'Berkeley 9/3', 'tổ tiên macOS'],
      ['1979', 'Bourne shell', 'Unix V7 · /bin/sh', 'shell = ngôn ngữ'],
      ['1983', 'GNU', 'Stallman 27/9', 'FSF 4/10/1985'],
      ['1988', 'POSIX', 'chuẩn chung', 'cho mọi Unix'],
      ['1989', 'Bash', 'Brian Fox 8/6', 'sh tự do của GNU'],
    ]) +
    lane(318, 'LINUX & NGÀY NAY — từ “sở thích” tới khắp nơi', 'grn', [
      ['1991', 'Linux', 'Torvalds 25/8', 'kèm sẵn bash 1.08'],
      ['1992', 'GPL', 'Linux 0.12', 'mã mở vĩnh viễn'],
      ['1993', 'Debian', 'Ian Murdock', '16/8/1993'],
      ['1994', 'Linux 1.0', '14/3/1994', 'Red Hat Linux 1995'],
      ['2004', 'Ubuntu', '20/10/2004', 'nhánh của Debian'],
      ['2008', 'Android', 'HTC Dream', 'nhân Linux sửa đổi'],
      ['2016', 'WSL', 'Linux trên', 'Windows 10 · 2/8'],
      ['2019', 'zsh / WSL2', 'Mac đổi sang zsh', 'WSL2 công bố 5/2019'],
    ]));
};

/* ───────────── cây họ Unix ───────────── */
const familyTree = () => diagram({
  w: 1160, h: 445,
  nodes: [
    { id: 'mu', x: 0, y: 10, w: 170, h: 66, t: 'Multics', d: '1964 · quá phức tạp', c: 'dim' },
    { id: 'ux', x: 230, y: 10, w: 190, h: 66, t: 'Unix', d: '1969 · Bell Labs', c: 'lx' },
    { id: 'bsd', x: 490, y: 10, w: 180, h: 66, t: 'BSD', d: '1978 · Berkeley', c: 'blu' },
    { id: 'fbsd', x: 740, y: 10, w: 180, h: 66, t: 'FreeBSD', d: '1993', c: 'blu' },
    { id: 'mac', x: 980, y: 10, w: 180, h: 66, t: 'macOS · iOS', d: 'Darwin ← 4.4BSD', c: 'blu' },
    { id: 'com', x: 230, y: 130, w: 190, h: 66, t: 'Unix thương mại', d: 'AIX · Solaris · HP-UX', c: 'dim' },
    { id: 'mnx', x: 490, y: 130, w: 180, h: 66, t: 'Minix', d: '1987 · Tanenbaum', c: 'vio' },
    { id: 'gnu', x: 0, y: 245, w: 170, h: 66, t: 'GNU', d: '1983 · bash, gcc, ls', c: 'ora' },
    { id: 'lnx', x: 490, y: 245, w: 180, h: 66, t: 'Linux', d: '1991 · Torvalds', c: 'grn' },
    { id: 'deb', x: 780, y: 118, w: 300, h: 56, t: 'Debian 1993 → Ubuntu 2004', d: 'apt · VPS của bạn', c: 'grn' },
    { id: 'rh', x: 780, y: 184, w: 300, h: 56, t: 'Red Hat 1995 → Fedora 2003', d: 'dnf · máy linux-nha', c: 'grn' },
    { id: 'alp', x: 780, y: 250, w: 300, h: 56, t: 'Alpine', d: 'BusyBox · ảnh Docker nhỏ', c: 'grn' },
    { id: 'and', x: 780, y: 316, w: 300, h: 56, t: 'Android 2008', d: 'nhân Linux sửa đổi', c: 'tea' },
    { id: 'wsl', x: 780, y: 382, w: 300, h: 56, t: 'WSL2 2019', d: 'nhân Linux thật trong Windows', c: 'tea' },
  ],
  edges: [
    { from: 'mu', to: 'ux', dash: true, c: 'dim' },
    { from: 'ux', to: 'bsd', c: 'blu' },
    { from: 'bsd', to: 'fbsd', c: 'blu' },
    { from: 'fbsd', to: 'mac', c: 'blu' },
    { from: 'ux', to: 'com', c: 'dim' },
    { from: 'ux', to: 'mnx', t: 'bắt chước', dash: true, c: 'vio' },
    { from: 'mnx', to: 'lnx', t: 'viết trên Minix', dash: true, c: 'vio' },
    { from: 'gnu', to: 'lnx', t: 'công cụ + GPL', c: 'ora' },
    { from: 'lnx', to: 'deb', c: 'grn' },
    { from: 'lnx', to: 'rh', c: 'grn' },
    { from: 'lnx', to: 'alp', c: 'grn' },
    { from: 'lnx', to: 'and', c: 'tea' },
    { from: 'lnx', to: 'wsl', c: 'tea' },
  ],
}) + `<div style="display:flex;gap:26px;justify-content:center;font-size:15px;color:${D.mu};margin-top:6px">` +
  `<span><b style="color:${D.blu}">━</b> dùng chung mã nguồn</span><span><b style="color:${D.vio}">╍</b> chỉ bắt chước ý tưởng, KHÔNG chung mã</span>` +
  `<span>Linux là “Unix-like” viết lại từ đầu</span></div>`;

export const slides = S([
  cover({ t: 'Mục 0 — Bắt đầu tại đây: Linux, shell &amp; cách học không bỏ cuộc', sub: 'Linux &amp; shell là gì · 1969 → nay · sự cố thật · kernel/shell/terminal · cài đặt trên Mac/Windows/Linux · tra cứu &amp; thoát kẹt', chap: 'MỤC 0' }),

  { t: 'Bản đồ Mục 0: 6 bài trước khi gõ lệnh đầu tiên', body: mindmap('Mục 0', 'hiểu vì sao · có máy để phá · biết tự tra', [
    { t: 'Bắt đầu 1/2', d: 'Linux, shell là gì · lịch sử 1969→nay · vì sao quan trọng với BẠN', c: 'lx' },
    { t: 'Bắt đầu 2/2', d: 'sự cố thật khi không biết · cách học để không bỏ cuộc', c: 'red' },
    { t: '0.1 Cho ai · lộ trình', d: 'terminal thắng ở đâu · 17 phần của khoá', c: 'amb' },
    { t: '0.2 Kernel · shell · terminal', d: 'bốn lớp · bấm Enter thì chuyện gì xảy ra', c: 'grn' },
    { t: '0.3 Cài đặt', d: 'WSL2 · macOS (zsh, bash 3.2) · Docker làm sân tập', c: 'blu' },
    { t: '0.4 Sinh tồn', d: 'man · --help · help · tldr · thoát mọi thứ', c: 'vio' },
  ]) },

  /* ───────────── Bắt đầu 1/2 ───────────── */
  { t: 'Shell là người phục vụ: bạn gọi món, nó chuyển xuống bếp', body: `
    ${diagram({ w: 1160, h: 250, nodes: [
      { id: 'u', x: 0, y: 40, w: 150, h: 96, t: '🧑 Bạn', d: 'gõ: ls -l', c: 'dim' },
      { id: 't', x: 200, y: 40, w: 175, h: 96, t: 'Terminal', d: 'cái CỬA SỔ\n= quầy gọi món', c: 'blu' },
      { id: 's', x: 425, y: 40, w: 175, h: 96, t: 'Shell (bash)', d: 'người PHỤC VỤ\nhiểu và chuyển lời', c: 'lx' },
      { id: 'p', x: 650, y: 40, w: 175, h: 96, t: 'Chương trình', d: 'ĐẦU BẾP chuyên\nmón: ls, grep, cp', c: 'grn' },
      { id: 'k', x: 875, y: 40, w: 285, h: 96, t: 'Kernel Linux', d: 'cái BẾP: lửa, dao, tủ lạnh\n= CPU, RAM, đĩa, mạng', c: 'red' },
    ], edges: [
      { from: 'u', to: 't', c: 'dim' }, { from: 't', to: 's', c: 'blu' }, { from: 's', to: 'p', c: 'lx' }, { from: 'p', to: 'k', c: 'grn' },
      { from: 's', to: 'u', t: 'mang kết quả ra', c: 'lx', fs: 'b', ts: 'b', bend: 110, off: 34 },
    ] })}
    ${two(box('info', '<strong>Linux</strong> nói đúng ra chỉ là cái <strong>bếp</strong> (kernel). Thứ bạn gọi là “dùng Linux” là cả nhà hàng: kernel + công cụ GNU + shell + trình quản lý gói = một <strong>distro</strong>.'),
      box('tip', 'Đổi người phục vụ (bash → zsh) thì bếp vẫn thế. Đổi cửa sổ (Terminal → VS Code) thì người phục vụ vẫn thế. Lỗi nằm ở tầng nào ⇒ sửa ở tầng đó.'))}` },

  { t: 'Năm thứ hay bị gọi chung là “Linux”', body: table(['Thứ', 'Là gì (một câu)', 'Ví dụ', 'Kiểm trên máy bạn'], [
    ['<strong>Kernel</strong> (nhân)', 'Lõi duy nhất chạm phần cứng', 'Linux 7.1 · XNU (Mac) · NT (Windows)', '<code>uname -r</code>'],
    ['<strong>Distro</strong> (bản phân phối)', 'Kernel + công cụ + trình cài gói, đóng gói sẵn', 'Ubuntu · Fedora · Debian · Alpine', '<code>cat /etc/os-release</code>'],
    ['<strong>Shell</strong>', 'Chương trình đọc lệnh bạn gõ rồi chạy nó', 'bash · zsh · sh/dash · fish · PowerShell', '<code>ps -p $$ -o comm=</code>'],
    ['<strong>Terminal</strong>', 'Ứng dụng cửa sổ vẽ chữ, bắt phím', 'Terminal.app · iTerm2 · Windows Terminal · VS Code', '(là ứng dụng, không phải lệnh)'],
    ['<strong>Coreutils</strong> (bộ lệnh lõi)', '<code>ls cp mv cat sort</code>… mỗi cái một file', '+GNU (Linux) · BSD (Mac) · BusyBox (Alpine)', '<code>ls --version</code>'],
  ], { sm: true }) + box('warn', 'Cùng tên <code>ls</code> nhưng ba họ khác nhau: Ubuntu in <code>ls (GNU coreutils) 9.4</code>, Mac báo <code>unrecognized option</code>, Alpine in <code>BusyBox v1.37.0</code>. Vì thế script chạy ở máy này có thể vỡ ở máy kia.') },

  { t: 'Nửa thế kỷ trong một hình: 1969 → 2019', body: timeline() + `<p style="font-size:15px;color:${D.mu};text-align:center;margin-top:2px">Nguồn: Wikipedia — History of Unix · History of Linux · Bash · GNU Project · BSD (kiểm 28/09/2026). Thư của Torvalds: “just a hobby, won’t be big and professional like gnu”.</p>` },

  { t: 'Cây họ Unix: Mac là “anh em họ”, Linux là “con nuôi”', body: familyTree() },

  { t: 'Linux chạy phần lớn Internet — con số có nguồn', body: `
    ${kpis([
      { v: '92,1%', l: 'website chạy họ Unix (Linux: 62,6%) · W3Techs 28/09/2026', c: 'grn' },
      { v: '500/500', l: 'siêu máy tính TOP500 chạy Linux, 11/2017 → 06/2026', c: 'amb' },
      { v: '48,7%', l: 'lập trình viên dùng Bash/Shell · Stack Overflow 2025', c: 'blu' },
      { v: '27,7%', l: 'làm việc chính trên Ubuntu; 16,8% trên WSL · SO 2025', c: 'vio' },
    ])}
    ${cards([
      { ic: '🌐', t: 'Máy chủ web · VPS', d: 'nginx, Node, Postgres của đồ án bạn', c: 'grn' },
      { ic: '🐳', t: 'Docker · cloud', d: 'mọi container Linux dùng nhân Linux', c: 'blu' },
      { ic: '⚙️', t: 'CI/CD', d: 'GitHub Actions <code>ubuntu-latest</code>', c: 'amb' },
      { ic: '🧠', t: 'Máy GPU · AI', d: 'huấn luyện model gần như luôn trên Linux', c: 'vio' },
      { ic: '📱', t: 'Android', d: 'nhân Linux sửa đổi trong túi bạn', c: 'tea' },
      { ic: '🤖', t: 'Nhúng · robot', d: 'Raspberry Pi, router OpenWrt, TV', c: 'ora' },
    ], 3)}` },

  { t: 'Học Linux giúp gì cho BẠN — bốn chỗ dùng ngay', body: `
    ${cards([
      { ic: '🎓', t: 'Đồ án nhóm (SWP391…)', d: 'deploy lên VPS: <code>ssh</code>, xem log, khởi động lại dịch vụ, biết vì sao đĩa đầy — thay vì nhờ “bạn biết Linux” lúc 2 giờ sáng.', c: 'amb' },
      { ic: '💼', t: 'Thực tập · phỏng vấn', d: 'câu hay gặp: <code>chmod 755</code> là gì? tìm tiến trình giữ cổng 3000? <code>df</code> khác <code>du</code>? tìm lỗi trong log 2 GB?', c: 'grn' },
      { ic: '🛠', t: 'Backend · DevOps · AI', d: 'Docker, CI, máy GPU, cloud đều là Linux. Terminal là giao diện duy nhất của một máy chủ không có màn hình.', c: 'blu' },
      { ic: '💻', t: 'Mac &amp; Windows cũng dùng được', d: 'Mac: zsh cùng họ Unix. Windows: WSL2 là nhân Linux thật, Git Bash cho việc nhẹ. Học một lần, dùng ba nơi.', c: 'vio' },
    ], 2)}
    ${box('good', 'Khoá này đi 17 phần: từ <code>cd</code> đầu tiên tới tự dựng, tự động hoá và vận hành một máy chủ thật (Chương 16).')}` },

  /* ───────────── Bắt đầu 2/2 ───────────── */
  { t: 'Steam 2015: một biến RỖNG biến rm thành “xoá cả máy”', body: two(
    `${term(['# steam.sh dòng 468 (issue #3671)', '$ rm -rf "$STEAMROOT/"*', '# thử AN TOÀN bằng echo:', '$ cd / ; STEAMROOT=""', '$ echo rm -rf "$STEAMROOT/"*', '! rm -rf /bin /bin.usr-is-merged /boot', '! /dev /etc /home /lib /media /mnt', '! /opt /proc /root …'], { title: 'Ubuntu 24.04 — container lx00-u' })}
    ${box('bad', 'Người báo lỗi mất mọi file của mình, kể cả ổ sao lưu 3 TB đang gắn ở <code>/media</code>. Dòng lệnh đó có sẵn chú thích <code># Scary!</code> phía trên.')}`,
    `${sh([
      ['set -u', 'bắt biến CHƯA ĐẶT (gõ sai tên)'],
      ['rm -rf "${STEAMROOT:?chua dat}/"*', 'bắt cả biến RỖNG ⇒ dừng'],
    ], { fs: 16 })}
    ${term(['$ bash -uc \'STEAMROOT=""; echo rm -rf "$STEAMROOT/"*\'', '! rm -rf /bin /bin.usr-is-merged /boot /dev …', '# set -u KHÔNG cứu: biến có đặt, chỉ là rỗng', '$ bash -c \'STEAMROOT=""; echo rm -rf "${STEAMROOT:?}/"*\'', '= bash: line 1: STEAMROOT: parameter null or not set'], { title: 'Ubuntu — cái nào chặn được?', fs: 13.5 })}
    ${box('tip', 'Học ở: Ch6 (khai triển biến) · Ch7 (<code>set -euo pipefail</code> + <code>${VAR:?}</code> cho biến bắt buộc).')}`, 'l') },

  { t: 'Bốn sự cố thật — mỗi cái dạy một thói quen', body: cards([
    { ic: '🐝', t: 'Bumblebee · 24/05/2011', d: 'Thừa MỘT dấu cách: <code>rm -rf /usr /lib/nvidia-current/xorg/xorg</code> ⇒ rm nhận hai đường dẫn, xoá sạch <code>/usr</code>. Người dùng phải cài lại máy. <strong>→ Ch2, Ch6:</strong> đọc lệnh như shell đọc.', c: 'amb' },
    { ic: '🦊', t: 'GitLab · 31/01/2017', d: '<code>rm -rf</code> thư mục dữ liệu trên NHẦM máy (db1 thay vì db2), ~300 GB mất trong 1–2 giây; sao lưu cũng hỏng ⇒ mất ~6 giờ dữ liệu. <strong>→ Ch9, Ch11:</strong> luôn biết mình đang ở máy nào.', c: 'ora' },
    { ic: '☁️', t: 'AWS S3 · 28/02/2017', d: 'Một tham số gõ sai trong lệnh gỡ máy chủ của playbook ⇒ gỡ nhiều máy hơn ý định; S3 vùng us-east-1 ngừng ~4,5 giờ. <strong>→ Ch7:</strong> kiểm tham số, xem trước khi làm.', c: 'blu' },
    { ic: '🐚', t: 'Shellshock · 24/09/2014', d: 'Lỗi của chính bash từ 1989 (CVE-2014-6271): biến môi trường chứa <code>() { :;}; lệnh</code> được CHẠY. Hàng triệu lượt dò trong vài ngày. <strong>→ Ch10:</strong> cập nhật gói.', c: 'red' },
  ], 2) + `<p style="font-size:15px;color:${D.mu};text-align:center">Nguồn: GitHub bumblebee #123 · GitLab post-mortem · aws.amazon.com/message/41926 · CVE-2014-6271 (link trong bài)</p>` },

  { t: 'Sự cố của một dự án sinh viên — chuyện thật, lệnh thật', body: table(['Chuyện đã xảy ra', 'Vì sao', 'Biết thì làm gì', 'Ch.'], [
    ['Postgres chết giữa lúc deploy', 'Cache build 7,6 GB làm đầy đĩa VPS', '<code>df -h</code> · <code>du -xh -d1</code> · <code>ncdu</code>', 'Ch10'],
    ['<code>PasswordAuthentication no</code> “không ăn”', 'File <code>50-cloud-init.conf</code> đọc trước — giá trị ĐẦU thắng', 'Nghiệm thu bằng <code>sshd -T</code>, không bằng <code>cat</code>', 'Ch11'],
    ['Thêm <code>Port 993</code> vô tác dụng', '<code>ssh.socket</code> (systemd) giữ cổng', '<code>systemctl is-enabled ssh.socket</code>', 'Ch11'],
    ['Sửa file mà container vẫn thấy bản cũ', '<code>mv</code>/<code>sed -i</code> tạo inode MỚI', 'Ghi đè tại chỗ, kiểm từ trong container', 'Ch2'],
    ['<code>pkill -f "next start"</code> không diệt được', 'Tiến trình đổi tên thành <code>next-server</code>', '<code>lsof -ti:3000</code> — diệt theo cổng', 'Ch5'],
    ['Script chạy trên VPS, vỡ trên Mac', 'Mac: bash 3.2, không có <code>timeout</code>, <code>grep</code> BSD', 'Biết GNU ≠ BSD', 'Ch15'],
    ['Cron chạy lệch 7 tiếng', 'Container giờ UTC, máy giờ +07', '<code>date</code> · <code>TZ=</code>', 'Ch11'],
  ], { sm: true }) },

  { t: 'Vì sao người mới bỏ cuộc — và cách chữa từng lý do', body: vs({
    no: { t: 'Lý do bỏ cuộc', items: [
      'Màn hình đen, không biết gõ gì, sợ gõ sai làm hỏng máy',
      'Lỗi toàn tiếng Anh, đọc không hiểu nên chép lên Google',
      'Học thuộc lệnh ⇒ tình huống khác đi một chút là tắc',
      'Đọc lý thuyết cả tuần mà chưa làm được việc gì thật',
      'Bí một lỗi hai tiếng rồi bỏ',
    ] },
    yes: { t: 'Cách khoá này chữa', items: [
      'Sân tập vứt đi (container): phá thoải mái, <code>exit</code> là sạch',
      'Ô 🗂 thuật ngữ mọi bài + slide “đọc một thông báo lỗi”',
      'Học MÔ HÌNH (file, tiến trình, luồng, quyền) + ~40 lệnh, còn lại tra',
      'Mỗi bài có 🧪 một việc thật làm được trong 15–20 phút',
      'Quy tắc 20 phút: bí thì hỏi, kèm lệnh + lỗi nguyên văn + đã thử gì',
    ] },
  }) + box('tip', '<strong>Hỏi sao cho người khác trả lời được:</strong> (1) máy gì — <code>uname -srm</code>, (2) lệnh gõ nguyên văn, (3) lỗi nguyên văn (chép chữ, đừng chụp mờ), (4) đã thử gì. Tự viết ra bốn dòng này thì một nửa số lần bạn tự thấy lỗi.') },

  { t: 'Đọc thông báo lỗi: AI kêu · kêu về CÁI GÌ · VÌ SAO · mã thoát', body: two(
    term(['$ sl', '! bash: sl: command not found', '$ echo $?', '127', '$ ls khong-co', '! ls: cannot access \'khong-co\': No such file or directory', '$ echo $?', '2', '$ ./ghi-chu.txt', '! bash: ./ghi-chu.txt: Permission denied', '$ echo $?', '126', '$ cat /etc/shadow        # chạy như user thường', '! cat: /etc/shadow: Permission denied'], { title: 'Ubuntu 24.04 — lỗi thật', fs: 14 }),
    table(['Phần', 'Ví dụ', 'Nghĩa'], [
      ['AI kêu', '<code>bash:</code> · <code>ls:</code>', 'bash = shell không chạy được; ls = chương trình chạy rồi mới kêu'],
      ['Về cái gì', '<code>sl</code> · <code>\'khong-co\'</code>', 'đọc lại chính chữ này — thường sai chính tả'],
      ['Vì sao', 'command not found', 'không có trong PATH (Ch8)'],
      ['', 'No such file or directory', 'đường dẫn sai / đang đứng sai chỗ'],
      ['', 'Permission denied', 'thiếu quyền r/w/x — đừng vội sudo (Ch4)'],
      ['Mã thoát <code>$?</code>', '0 · 1–2 · 126 · 127', 'ổn · lỗi thường · không chạy được · không tìm thấy'],
    ], { sm: true })) },

  { t: 'Lộ trình: 2 tuần để tự tin, 17 phần để thành thạo', body: two(
    table(['Tuần', 'Học', 'Mốc “đã làm được”'], [
      ['1', 'Mục 0 · Ch1 · Ch2 · Ch3', 'Đi lại trong máy, tìm file, lọc log bằng <code>grep | sort | uniq</code>'],
      ['2', 'Ch4 · Ch5 · Ch6 · Ch7', 'Sửa “Permission denied”, diệt đúng tiến trình, viết script có <code>set -euo pipefail</code>'],
      ['3–4', 'Ch8 → Ch12', 'SSH vào VPS, đọc log, chạy dịch vụ systemd, chẩn đoán đĩa đầy'],
      ['sau đó', 'Ch13 → Ch16', 'Bash nâng cao, Linux chuyên sâu, Mac/Windows, dự án cuối khoá'],
    ], { sm: true }),
    steps([
      ['Xem slide của bài (5 phút)', 'nắm hình trước khi đọc chữ'],
      ['Đọc bài, GÕ LẠI từng lệnh', 'không dán — gõ tay mới nhớ'],
      ['Làm 🧪 (15–20 phút)', 'có tiêu chí “Đạt khi” để tự chấm'],
      ['Ghi 3 lệnh vào file mẹo', '<code>~/thu-linux/meo.txt</code>'],
      ['Làm quiz cuối chương', 'đọc giải thích cả câu đúng'],
    ]), 'l') },

  /* ───────────── 0.1 ───────────── */
  { t: 'Terminal thắng khi việc LẶP LẠI: 5 hay 4.000 file, một dòng', body: two(
    `${sh([
      ['for f in *.JPG; do', 'mỗi file khớp mẫu *.JPG'],
      ['  mv -- "$f" "${f%.JPG}.jpg"', 'cắt đuôi .JPG, gắn .jpg'],
      ['done', ''],
    ], { fs: 17 })}
    ${term(['$ ls', 'IMG_001.JPG  IMG_002.JPG  IMG_003.JPG  \'anh bia.JPG\'  ghi-chu.txt', '$ for f in *.JPG; do mv -- "$f" "${f%.JPG}.jpg"; done', '$ ls', '+ IMG_001.jpg  IMG_002.jpg  IMG_003.jpg  \'anh bia.jpg\'  ghi-chu.txt'], { title: 'Ubuntu — chạy thật', fs: 14 })}`,
    cards([
      { ic: '🔁', t: 'Lặp lại', d: '5 file hay 4.000 file: cùng một dòng, cùng 1 giây.', c: 'amb' },
      { ic: '🧩', t: 'Ghép nối', d: 'nối các công cụ nhỏ bằng <code>|</code> thành công cụ chưa ai viết.', c: 'grn' },
      { ic: '🌏', t: 'Từ xa', d: 'máy chủ không có màn hình: SSH + shell là tất cả.', c: 'blu' },
      { ic: '📋', t: 'Tái lập', d: 'lệnh dán vào README, lưu trong Git, năm sau chạy y hệt.', c: 'vio' },
    ], 2), 'l') },

  { t: 'Khoá này cho ai — và nên bắt đầu từ đâu', body: table(['Bạn là…', 'Dấu hiệu', 'Đi thẳng tới'], [
    ['Người quen dán lệnh', 'Chép lệnh từ blog, chạy được thì mừng, hỏng thì hoảng', 'Mục 0 → Ch1 → Ch3 → Ch6 (đọc được lệnh)'],
    ['Lập trình viên có deploy', 'Code được, nhưng SSH vào VPS là run tay', 'Ch4 · Ch5 · Ch9 · Ch11'],
    ['Kỹ sư tự học', 'Biết 20 lệnh, ngờ bên dưới có hệ thống', 'Ch1 · Ch3 · Ch6 — rồi Ch13–14'],
    ['Người đang trực sự cố', 'Máy chủ trục trặc NGAY BÂY GIỜ', 'Ch12 — sách công thức, đọc lẻ được'],
    ['Dùng Mac / Windows', 'Không có máy Linux riêng', 'Bài 0.3 (WSL2, Docker) → Ch15'],
  ], { sm: true }) + box('tip', 'Không chắc mình thuộc nhóm nào? Làm 🧪 của bài “Bắt đầu 1/2”. Xong trong 10 phút mà không cần tra ⇒ lướt Ch1–2 nhanh; cần tra nhiều ⇒ đi đúng thứ tự.') },

  { t: 'Lộ trình 17 phần: năm chặng từ cd tới vận hành máy chủ', body: cards([
    { ic: '🚪', t: 'Mục 0 · Bắt đầu', d: 'vì sao học · lịch sử · cài đặt · tra cứu', c: 'amb' },
    { ic: '🧭', t: 'Chặng 1 · Ch1–3', d: 'shell &amp; hệ file · file &amp; thư mục · văn bản, ống dẫn', c: 'grn' },
    { ic: '⚙️', t: 'Chặng 2 · Ch4–5', d: 'quyền &amp; sudo · tiến trình &amp; tín hiệu', c: 'blu' },
    { ic: '📜', t: 'Chặng 3 · Ch6–8', d: 'biến &amp; khai triển · script production · PATH &amp; môi trường', c: 'vio' },
    { ic: '🖥', t: 'Chặng 4 · Ch9–12', d: 'mạng &amp; SSH · đĩa, gói, log · systemd &amp; cron · chẩn đoán máy chủ', c: 'tea' },
    { ic: '🚀', t: 'Chặng 5 (MỚI) · Ch13–16', d: 'Bash nâng cao · Linux chuyên sâu · macOS &amp; Windows · dự án cuối khoá', c: 'ora' },
  ], 3) + box('info', 'Mỗi chương: slide (bài N.0) → bài giảng có 🧪 thực hành, 🗂 thuật ngữ, 📌 tóm tắt → quiz 10 câu tình huống thật. Chương 16 có bài kiểm tra cuối khoá (20 câu).') },

  { t: 'Học xong, bạn ĐỌC được những dòng này trước khi bấm Enter', body: sh([
    ["find . -name '*.log' -mtime +30 -delete", 'Ch2: xoá log cũ hơn 30 ngày'],
    ["grep ' 500 ' access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head", 'Ch3: IP gây lỗi 500'],
    ['chmod 750 deploy.sh && ls -l deploy.sh', 'Ch4: quyền rwxr-x---'],
    ['kill -TERM "$(lsof -ti:3000)"', 'Ch5: diệt tiến trình theo cổng'],
    ['set -euo pipefail', 'Ch7: script hỏng thì DỪNG'],
    ['ssh -p 993 deploy@vps "df -h /"', 'Ch9: đĩa VPS còn bao nhiêu'],
    ['du -xh -d1 / 2>/dev/null | sort -h | tail -5', 'Ch10: thư mục nào to nhất'],
    ['systemctl status api --no-pager && journalctl -u api -n 50', 'Ch11: dịch vụ có sống không'],
  ], { fs: 15 }) + box('good', 'Bây giờ chưa hiểu dòng nào cũng không sao — cuối khoá quay lại slide này và tự kiểm: đọc to từng cờ.') },

  /* ───────────── 0.2 ───────────── */
  { t: 'Bốn lớp sau cái cửa sổ đen: mỗi lỗi thuộc về MỘT lớp', body: two(
    diagram({ w: 560, h: 450, nodes: [
      { id: 't', x: 20, y: 0, w: 520, h: 72, t: 'Terminal (cửa sổ)', d: 'vẽ chữ, bắt phím — KHÔNG chạy lệnh', c: 'blu' },
      { id: 's', x: 20, y: 126, w: 520, h: 72, t: 'Shell: bash / zsh', d: 'đọc dòng, khai triển, tìm chương trình', c: 'lx' },
      { id: 'p', x: 20, y: 252, w: 520, h: 72, t: 'Chương trình: ls, grep, curl', d: 'file riêng trên đĩa (/usr/bin/…)', c: 'grn' },
      { id: 'k', x: 20, y: 378, w: 520, h: 72, t: 'Kernel Linux', d: 'file · bộ nhớ · mạng · tiến trình', c: 'red' },
    ], edges: [{ from: 't', to: 's', t: 'dòng chữ', c: 'blu', off: 8 }, { from: 's', to: 'p', t: 'fork + exec', c: 'lx', off: 8 }, { from: 'p', to: 'k', t: 'lời gọi hệ thống', c: 'grn', off: 8 }] }),
    `${term(['$ echo $SHELL', '/bin/bash', '$ ps -p $$ -o comm=', 'bash', '$ type ls', 'ls is /usr/bin/ls', '$ dpkg -S /usr/bin/ls', 'coreutils: /usr/bin/ls', '$ cat /proc/version', 'Linux version 7.0.12-linuxkit …'], { title: 'Ubuntu — tôi đang ở lớp nào?' })}
    ${box('info', '<code>$SHELL</code> là shell ĐĂNG NHẬP; <code>ps -p $$</code> là shell ĐANG chạy — hai cái có thể khác nhau (Mac: zsh đăng nhập, gõ <code>bash</code> là đổi).')}`, 'l') },

  { t: 'cd bắt buộc là “builtin” — ls thì là một file', body: two(
    term(['$ type ls cd', 'ls is /usr/bin/ls', 'cd is a shell builtin', '$ type -t cd ls if echo', 'builtin', 'file', 'keyword', 'builtin', '$ type -a pwd', 'pwd is a shell builtin', 'pwd is /usr/bin/pwd', 'pwd is /bin/pwd'], { title: 'Ubuntu 24.04 — bash 5.2' }),
    `${diagram({ w: 560, h: 250, nodes: [
      { id: 'b', x: 0, y: 0, w: 260, h: 80, t: 'bash (cwd = /root)', d: 'tiến trình CHA', c: 'lx' },
      { id: 'c', x: 0, y: 160, w: 260, h: 80, t: '/usr/bin/cd /tmp ?', d: 'CON đổi cwd CỦA NÓ', c: 'red', dash: true },
      { id: 'x', x: 300, y: 160, w: 260, h: 80, t: 'con thoát', d: 'cha vẫn đứng ở /root', c: 'dim' },
    ], edges: [{ from: 'b', to: 'c', t: 'fork', c: 'lx', off: 8 }, { from: 'c', to: 'x', c: 'red' }] })}
    ${box('tip', 'Thư mục hiện hành là trạng thái của CHÍNH shell ⇒ chỉ shell tự đổi được. Tương tự: <code>export</code>, <code>source</code>, <code>exit</code>. Xem trợ giúp builtin bằng <code>help cd</code>.')}`, 'l') },

  { t: 'Bấm Enter: shell BIẾN ĐỔI lệnh trước khi chạy', body: `
    ${steps([
      ['Terminal gửi dòng chữ', 'phím bạn gõ tới shell'],
      ['Shell khai triển', '<code>$HOME</code>, <code>*.txt</code>, nháy, <code>$(…)</code>'],
      ['Tìm chương trình', 'builtin? rồi mới tới <code>PATH</code>'],
      ['Nhờ kernel chạy', 'có sẵn stdin/stdout/stderr'],
      ['Cất mã thoát', 'vào <code>$?</code> — 0 là ổn'],
    ], { row: true })}
    ${two(term(['$ touch a.txt b.txt', '$ set -x          # in lệnh SAU khai triển', '$ ls *.txt', '+ + ls a.txt b.txt ghi-chu.txt', 'a.txt', 'b.txt', 'ghi-chu.txt', '$ echo $HOME', '+ + echo /root', '/root'], { title: 'Ubuntu — set -x cho bạn nhìn bước 2' }),
      box('warn', '<code>ls</code> KHÔNG BAO GIỜ thấy chữ <code>*.txt</code> — nó nhận ba tên file đã khai triển. Lệnh chạy lạ ⇒ hỏi “shell đã biến nó thành gì?”. Dòng mở đầu bằng <code>+</code> là câu trả lời.'), 'l')}` },

  { t: '“Mọi thứ là một file”: ổ đĩa, tiến trình, cả nhân', body: two(
    table(['Đường dẫn', 'Thật ra là', 'Đọc thử'], [
      ['<code>/etc/hostname</code>', 'file thường', '<code>cat</code>'],
      ['<code>/dev/null</code>', 'sọt rác vạn năng', '<code>echo x &gt; /dev/null</code>'],
      ['<code>/dev/urandom</code>', 'nguồn byte ngẫu nhiên vô tận', '<code>head -c 8</code>'],
      ['<code>/proc/meminfo</code>', 'kernel sinh ra lúc bạn đọc', '<code>head -3</code>'],
      ['<code>/proc/1/cmdline</code>', 'tiến trình số 1', '<code>tr \'\\0\' \' \'</code>'],
    ], { sm: true }),
    term(['$ cat /proc/meminfo | head -3', 'MemTotal:        8124516 kB', 'MemFree:         2460924 kB', 'MemAvailable:    5341556 kB', '$ ls -l /dev/null', 'crw-rw-rw- 1 root root 1, 3 Sep 28 08:39 /dev/null', '$ head -c 8 /dev/urandom | od -An -tx1', ' 08 01 fd f7 0d e3 0a d8', '$ tr \'\\0\' \' \' < /proc/1/cmdline; echo', 'sleep infinity', '# chữ c đầu dòng = thiết bị ký tự (Ch2, Ch4)'], { title: 'Ubuntu — container lx00-u' }), 'l') },

  { t: 'Triết lý Unix: mỗi chương trình một việc, nối bằng ống', body: `
    ${pipe([
      { c: 'printf "linux\\nbash…"', d: '6 dòng, lộn xộn', ac: 'blu' },
      { c: 'sort', d: 'xếp: bash bash linux linux linux zsh', ac: 'grn' },
      { c: 'uniq -c', d: 'đếm dòng liền nhau giống nhau', ac: 'lx' },
      { c: 'sort -rn', d: 'xếp theo SỐ, lớn trước', ac: 'vio' },
    ], { mui: ['từng dòng', 'đã xếp', '3 linux…'] })}
    ${two(term(['$ printf "linux\\nbash\\nlinux\\nzsh\\nlinux\\nbash\\n" \\', '  | sort | uniq -c | sort -rn', '      3 linux', '      2 bash', '      1 zsh'], { title: 'Ubuntu — chạy thật' }),
      box('info', '<strong>McIlroy, 1978:</strong> “Make each program do one thing well.” Bốn chương trình không biết nhau tồn tại — văn bản là giao diện chung. Ống <code>|</code> vào Unix năm 1973, Thompson viết “trong một đêm”.'), 'l')}` },

  { t: 'Distro khác nhau hẹp: gói, init, và bộ lệnh lõi', body: two(
    table(['', 'Ubuntu / Debian', 'Fedora / RHEL', 'Alpine'], [
      ['Cài gói', '<code>apt</code>', '<code>dnf</code>', '<code>apk</code>'],
      ['Init', 'systemd', 'systemd', 'OpenRC'],
      ['<code>/bin/sh</code>', 'dash', 'bash', 'BusyBox ash'],
      ['Bộ lệnh lõi', 'GNU coreutils 9.4', 'GNU coreutils 9.10', '!BusyBox — thiếu cờ'],
      ['Dùng ở đâu', 'VPS, WSL, CI', 'máy dev, doanh nghiệp', 'ảnh Docker nhỏ'],
    ], { sm: true }),
    term(['$ docker run --rm alpine ls --version', '! ls: unrecognized option: version', 'BusyBox v1.37.0 (2026-01-10 15:38:28 UTC) multi-call binary.', '$ docker run --rm alpine readlink -f /bin/sh', '/bin/busybox', '$ readlink -f /bin/sh      # Ubuntu', '/usr/bin/dash'], { title: 'Alpine vs Ubuntu — chạy thật', fs: 14 }), 'l') },

  /* ───────────── 0.3 ───────────── */
  { t: 'Bốn đường có một shell Linux — chọn theo máy bạn đang có', body: table(['Cách', 'Thật ra là', 'Hợp khi', 'Cần để ý'], [
    ['<strong>WSL2</strong> (Windows)', 'Nhân Linux THẬT trong máy ảo nhẹ (Hyper-V)', 'Bạn dùng Windows 10 2004+ / 11', '+Để dự án ở <code>~</code>, KHÔNG ở <code>/mnt/c</code>'],
    ['<strong>Terminal macOS</strong>', 'Unix (Darwin/BSD) — KHÔNG phải Linux', 'Việc hằng ngày, Git, SSH', '!zsh mặc định · bash 3.2 · lệnh BSD'],
    ['<strong>Máy Linux</strong> (Fedora/Ubuntu)', 'Chính là đích đến', 'Có máy cũ, máy ở nhà', '+Giống VPS nhất'],
    ['<strong>Container Docker</strong>', 'Ubuntu thật, vứt đi trong 1 giây', 'MỌI thí nghiệm phá huỷ', '!Không có systemd, man bị gỡ'],
  ], { sm: true }) + box('good', 'Khoá này chuẩn hoá trên <strong>Ubuntu 24.04</strong> (như VPS). Chạy lệnh phá huỷ (<code>rm -rf</code>, làm đầy đĩa, sửa <code>/etc</code>) CHỈ trong container, dù bạn đang ở máy nào.') },

  { t: 'Windows: WSL2 là Linux thật — đừng để code ở /mnt/c', body: two(
    `${sh([
      ['# PowerShell (Run as administrator), một lần:', ''],
      ['wsl --install', 'bật WSL + cài Ubuntu'],
      ['# khởi động lại máy, đặt user/mật khẩu Linux', ''],
      ['wsl --list --verbose', 'cột VERSION phải là 2'],
      ['wsl --set-version Ubuntu 2', 'nếu lỡ là bản 1'],
      ['wsl --update', 'cập nhật WSL'],
    ], { fs: 15 })}
    ${box('info', 'Theo tài liệu Microsoft (06/2026): cần Windows 10 2004 (build 19041)+ hoặc Windows 11; Ubuntu cài qua <code>wsl --install</code> có sẵn <strong>systemd</strong>.')}`,
    `${diagram({ w: 560, h: 260, nodes: [
      { id: 'w', x: 0, y: 10, w: 235, h: 90, t: 'Windows (NTFS)', d: 'C:\\Users\\an\\du-an\n= /mnt/c/Users/an/du-an', c: 'blu' },
      { id: 'l', x: 325, y: 10, w: 235, h: 90, t: 'Ubuntu trong WSL2', d: 'ext4: /home/an/du-an\n= \\\\wsl$ trong Explorer', c: 'grn' },
      { id: 'k', x: 155, y: 170, w: 250, h: 80, t: 'Nhân Linux thật', d: 'máy ảo nhẹ quản lý tự động', c: 'red' },
    ], edges: [{ from: 'w', to: 'l', t: 'chậm', c: 'red', both: true }, { from: 'l', to: 'k', c: 'grn' }] })}
    ${box('warn', 'Script <code>deploy.sh</code> soạn trong Notepad trên Windows mang đuôi dòng CRLF ⇒ trên Linux báo <code>$\'\\r\': command not found</code>. Sửa: lưu “LF” trong VS Code (Ch8, Ch15).')}`, 'l') },

  { t: 'macOS: zsh mặc định từ 2019, còn /bin/bash kẹt ở 3.2 (2007)', body: two(
    term(['$ echo $SHELL', '/bin/zsh', '$ zsh --version', 'zsh 5.9 (arm64-apple-darwin26.0)', '$ /bin/bash --version | head -2', 'GNU bash, version 3.2.57(1)-release (arm64-apple-darwin26)', 'Copyright (C) 2007 Free Software Foundation, Inc.', '$ bash', '+ The default interactive shell is now zsh.', '+ To update your account to use zsh, please run `chsh -s /bin/zsh`.', 'bash-3.2$ exit', '$ uname -srm', 'Darwin 27.0.0 arm64'], { title: 'Mac M1 — macOS 27, chạy thật', fs: 14 }),
    `${table(['Máy', 'bash', 'Giấy phép'], [
      ['macOS <code>/bin/bash</code>', '!3.2.57 (2007)', 'GPLv2 — bản cuối trước GPLv3'],
      ['Ubuntu 24.04', '+5.2.21', 'GPLv3'],
      ['Fedora 44', '+5.3.9', 'GPLv3'],
      ['Homebrew (<code>brew info bash</code>)', '+stable 5.3.20', 'cài vào <code>/opt/homebrew/bin/bash</code>'],
    ], { sm: true })}
    ${box('info', 'Bash từ 4.0 đổi sang GPLv3; Apple giữ 3.2 rồi từ macOS 10.15 Catalina (2019) chuyển shell mặc định sang zsh (Apple: “Use zsh as the default shell on Mac”).')}`, 'l') },

  { t: 'Script viết cho bash 5 vỡ trên bash 3.2 của Mac — ngay lập tức', body: two(
    term(['$ /bin/bash -c \'declare -A m\'', '! /bin/bash: line 0: declare: -A: invalid option', '$ /bin/bash -c \'x=abc; echo ${x^^}\'', '! /bin/bash: ${x^^}: bad substitution', '$ date -d tomorrow', '! date: illegal option -- d', '$ date -v+1d +%F       # cách của BSD', '2026-09-29', '$ sed --version', '! sed: illegal option -- -', '$ command -v timeout || echo "no timeout"', 'no timeout'], { title: 'Mac — lỗi thật', fs: 14 }),
    `${sh([
      ['brew install bash', 'bash 5.3 cạnh bash 3.2'],
      ['brew install coreutils gnu-sed grep', 'lệnh GNU tên gtimeout, gsed…'],
      ['', ''],
      ['#!/usr/bin/env bash', 'shebang tìm bash TRONG PATH'],
      ['#!/bin/bash', 'trên Mac luôn là 3.2!'],
    ], { fs: 15 })}
    ${box('warn', '<code>sed -i \'s/a/b/\' f</code> trên Mac báo <code>invalid command code f</code>; còn <code>sed -i -e …</code> lặng lẽ tạo thêm file <code>f-e</code>. Mac cần <code>sed -i \'\' …</code> (đo thật, Ch15).')}`, 'l') },

  { t: 'Docker: một Ubuntu để phá, dựng lại trong 1,5 giây', body: two(
    `${sh([
      ['docker run --rm -it ubuntu:24.04 bash', ''],
      ['#          │    │  └ ảnh: Ubuntu 24.04', ''],
      ['#          │    └ -i giữ stdin, -t cấp terminal', ''],
      ['#          └ --rm: thoát là xoá container', ''],
      ['', ''],
      ['docker run -it --name lab \\', 'container giữ lại'],
      ['  -v "$HOME/thu-linux:/root/thu-linux" \\', 'chia sẻ thư mục'],
      ['  ubuntu:24.04 bash', ''],
      ['docker start -ai lab', 'buổi sau: vào lại'],
    ], { fs: 15 })}`,
    `${term(['$ docker run --rm -i ubuntu:24.04 bash -i', 'root@0f7638217952:/# cat /etc/os-release | head -2', 'PRETTY_NAME="Ubuntu 24.04.5 LTS"', 'NAME="Ubuntu"', 'root@0f7638217952:/# exit', '# file tạo TRONG container, xem từ Mac:', '$ ls -l ~/thu-linux', '-rw-r--r--@ 1 admin wheel 24 Sep 28 15:57 chao.txt', '-rw-r--r--  1 admin wheel 22 Sep 28 15:57 tu-container.txt'], { title: 'Mac + container — chạy thật', fs: 13 })}
    ${box('warn', 'Trong container cùng file đó hiện <code>08:57</code> — container dùng giờ <strong>UTC</strong>, Mac dùng <strong>+07</strong>. Đồng hồ là một, múi giờ khác (Ch11).')}`, 'l') },

  { t: 'Kiểm “đã sẵn sàng”: ảnh Ubuntu gốc THIẾU curl và cả trang man', body: two(
    `${sh([
      ['for c in bash ls grep sed awk find curl ps; do', ''],
      ['  command -v "$c" >/dev/null \\', 'có trong PATH không?'],
      ['    && echo "ok   $c" || echo "MISSING $c"', ''],
      ['done', ''],
      ['', ''],
      ['apt-get update && apt-get install -y \\', 'container: không cần sudo'],
      ['  curl less tree file procps iproute2 vim man-db', ''],
    ], { fs: 15 })}`,
    `${term(['# ubuntu:24.04 vừa kéo về, CHƯA cài gì', 'ok   bash', 'ok   ls', 'ok   grep', 'ok   sed', 'ok   awk', 'ok   find', '! MISSING curl', 'ok   ps', '$ man ls', '+ This system has been minimized by removing', '+ packages and content that are not required', '+ on a system that users do not log into. …', '+ …you can run the \'unminimize\' command.'], { title: 'Ubuntu 24.04 — container lx00-u', fs: 14 })}
    ${box('tip', 'Container là bản tối giản. “Thiếu lệnh” trong container thường là chưa cài, không phải Linux không có.')}`, 'l') },

  /* ───────────── 0.4 ───────────── */
  { t: 'Sáu cách tra cứu — chọn theo câu hỏi bạn đang có', body: table(['Câu hỏi', 'Gõ', 'Ghi chú (đo 09/2026)'], [
    ['Lệnh này có cờ gì?', '<code>ls --help | grep -i sort</code>', 'nhanh nhất; GNU có, BSD (Mac) thường không'],
    ['Đọc đầy đủ', '<code>man tar</code> · trong đó <code>/</code> tìm, <code>n</code> tiếp, <code>q</code> thoát', 'container Ubuntu đã gỡ man ⇒ <code>unminimize</code> hoặc đọc man7.org'],
    ['Lệnh của chính shell?', '<code>help cd</code> · <code>help set</code>', 'builtin không có trang man riêng'],
    ['Chỉ cần ví dụ', '<code>tldr tar</code>', '!<code>apt install tldr</code> trên 24.04 KHÔNG tải được trang ⇒ <code>pipx install tldr</code>'],
    ['Không biết tên lệnh', '<code>apropos compress</code> = <code>man -k</code>', 'cần CSDL man (<code>mandb</code>); container trả “nothing appropriate”'],
    ['Cái này LÀ gì, ở đâu?', '<code>type -a python3</code> · <code>command -v</code>', 'builtin, alias, hàm hay file — Ch8'],
  ], { sm: true }) + box('info', 'Dòng lệnh lạ dài cả mét: dán vào <strong>explainshell.com</strong> — mỗi cờ được chú thích bằng chính trang man.') },

  { t: 'Tìm một cờ trong 10 giây: --help | grep', body: `
    ${term(['$ ls --help | grep -i "sort by"', '  -c                         with -lt: sort by, and show, ctime (time of last', '  -S                         sort by file size, largest first', '      --sort=WORD            sort by WORD instead of name: none (-U), size (-S),', '  -t                         sort by time, newest first; see --time', '$ help cd | head -2          # cd là builtin ⇒ hỏi chính bash', 'cd: cd [-L|[-P [-e]] [-@]] [dir]', '    Change the shell working directory.'], { title: 'Ubuntu 24.04 — coreutils 9.4, bash 5.2', fs: 14 })}
    ${two(term(['$ pipx install tldr', '$ tldr tar', '  - [c]reate a g[z]ipped archive and write it to a [f]ile:', '    tar czf path/to/target.tar.gz path/to/file1 …', '  - E[x]tract a (compressed) archive [f]ile …', '    tar xvf path/to/source.tar.ext'], { title: 'Ubuntu — tldr 3.4.4 (pipx)', fs: 13 }),
      box('warn', 'Hai client tldr trong kho apt của Ubuntu 24.04 (Haskell 0.9.2, tealdeer 1.6.1) đều báo lỗi “central directory” khi <code>--update</code>: tệp zip cũ trên tldr.sh không còn. Đo thật 28/09/2026.'))}` },

  { t: 'Thoát khỏi mọi thứ: bảy phím cứu hộ', body: table(['Đang kẹt ở…', 'Bấm', 'Vì sao'], [
    ['Lệnh chạy mãi không dừng', '<code>Ctrl</code>+<code>C</code>', 'gửi tín hiệu SIGINT: “dừng lại” (Ch5)'],
    ['Chương trình chờ bạn gõ (cat, python)', '<code>Ctrl</code>+<code>D</code>', 'báo “hết đầu vào”; ở dấu nhắc trống thì thoát shell'],
    ['Màn hình có <code>:</code> ở đáy (man, less, git log)', '<code>q</code>', 'đó là trình phân trang, không phải đơ'],
    ['vim', '<code>Esc</code> rồi <code>:q!</code> Enter', 'thoát không lưu; <code>:wq</code> là lưu rồi thoát'],
    ['nano', '<code>Ctrl</code>+<code>X</code>', 'thanh đáy ghi <code>^X</code> = Ctrl+X'],
    ['Chương trình lờ Ctrl+C', '<code>Ctrl</code>+<code>Z</code> rồi <code>kill %1</code>', 'tạm dừng rồi giết theo số job (Ch5)'],
    ['Terminal toàn ký tự rác', 'gõ mù <code>reset</code> Enter', 'khôi phục chế độ terminal sau khi cat file nhị phân'],
  ], { sm: true }) },

  { t: 'Ba câu hỏi trước MỌI lệnh phá huỷ: cái gì · ở đâu · là ai', body: two(
    steps([
      ['Lệnh chạm vào CÁI GÌ?', 'chạy <code>ls</code> / <code>echo</code> với đúng cái mẫu đó trước'],
      ['Tôi đang ở ĐÂU?', '<code>pwd</code> và <code>hostname</code> — GitLab 2017 xoá nhầm MÁY'],
      ['Tôi là AI?', '<code>whoami</code> — dấu nhắc <code>#</code> là root: không gì chặn bạn'],
    ]),
    `${sh([
      ['ls -la *.log', '① NHÌN trước'],
      ['rm *.log', '② rồi mới làm'],
      ["find . -name '*.tmp' -mtime +30", 'liệt kê'],
      ["find . -name '*.tmp' -mtime +30 -delete", 'rồi mới xoá'],
      ['cd /srv/app && rm -rf build/', '&&: cd hỏng ⇒ KHÔNG xoá'],
      ['cd /srv/app ;  rm -rf build/', ';: cd hỏng ⇒ xoá ở chỗ cũ!'],
    ], { fs: 15 })}
    ${term(['$ cd /khong-co && echo "deploy..."', '! bash: cd: /khong-co: No such file or directory', '$ echo $?', '1'], { title: 'Ubuntu — && dừng chuỗi' })}`, 'l') },

  { t: 'Đọc lệnh lạ: thêm từng chặng một, nhìn output đổi', body: `
    ${sh([
      ['grep \' 500 \' access.log', '① chỉ dòng có mã 500'],
      ['grep \' 500 \' access.log | awk \'{print $1}\'', '② chỉ lấy cột 1 = IP'],
      ['grep \' 500 \' access.log | awk \'{print $1}\' | sort', '③ xếp để IP giống nằm cạnh'],
      ['… | sort | uniq -c', '④ đếm mỗi IP'],
      ['… | sort | uniq -c | sort -rn | head -5', '⑤ 5 IP nhiều nhất'],
    ], { fs: 16 })}
    ${two(box('tip', 'Mỗi dấu <code>|</code> là một ranh giới. Chạy chặng đầu, thấy đúng rồi mới nối chặng sau. Không hiểu một cờ ⇒ <code>man awk</code> rồi <code>/</code> gõ tên cờ.'),
      box('good', '<strong>File mẹo cá nhân</strong> <code>~/thu-linux/meo.txt</code>: mỗi lệnh giải được việc gì thì chép vào, kèm một dòng tiếng Việt. Viết ra chính là ôn tập.'))}` },

  /* ───────────── Cuối mục ───────────── */
  { t: 'Sai lầm hay gặp ở Mục 0', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['“Linux lỗi rồi” khi lệnh chạy lạ', 'Shell đã khai triển glob/biến khác ý bạn', '<code>set -x</code> xem lệnh sau khai triển'],
    ['<code>cd</code> trong script không “đi” đâu cả', 'Script chạy trong tiến trình CON', '<code>source script.sh</code> hoặc chấp nhận (Ch8)'],
    ['Script chạy VPS, vỡ trên Mac', 'bash 3.2 + lệnh BSD', '<code>#!/usr/bin/env bash</code> + <code>brew install bash</code>'],
    ['WSL chậm, <code>chmod +x</code> không giữ', 'Code nằm ở <code>/mnt/c</code>', 'Chuyển dự án về <code>~/</code> trong Linux'],
    ['<code>$\'\\r\': command not found</code>', 'File soạn trên Windows có CRLF', 'Lưu LF · <code>sed -i \'s/\\r$//\' f</code>'],
    ['<code>man</code>/<code>curl</code> “không có” trong container', 'Ảnh Docker tối giản', '<code>apt-get install</code> · <code>unminimize</code>'],
    ['Thấy <code>:</code> ở đáy, tưởng đơ', 'Đang ở trình phân trang less', 'Bấm <code>q</code>'],
    ['Gặp “Permission denied” là thêm sudo', 'Lệnh sai / sai user / sai file', 'Đọc lỗi trước (Ch4)'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Mục 0 (1/2): tôi đang ở đâu, dùng gì?', body: sh([
    ['uname -srm', 'nhân + kiến trúc máy'],
    ['cat /etc/os-release | head -2', 'distro và phiên bản'],
    ['echo "$SHELL"; ps -p $$ -o comm=', 'shell đăng nhập · đang chạy'],
    ['bash --version | head -1', 'phiên bản bash (Mac: 3.2!)'],
    ['type -a ls cd ; type -t cd', 'builtin, alias hay file'],
    ['whoami; hostname; pwd', 'là ai · máy nào · ở đâu'],
    ['echo $?', 'mã thoát của lệnh vừa rồi'],
    ['set -x ; set +x', 'bật/tắt in lệnh sau khai triển'],
    ['wsl --list --verbose', '(PowerShell) WSL bản 1 hay 2'],
    ['docker run --rm -it ubuntu:24.04 bash', 'sân tập vứt đi'],
  ], { fs: 16 }) },

  { t: 'Bảng tra nhanh Mục 0 (2/2): tra cứu và thoát kẹt', body: two(
    sh([
      ['cmd --help | grep -i từ', 'tìm cờ nhanh'],
      ['man cmd   # / n q', 'đọc đủ, tìm, thoát'],
      ['help cd', 'trợ giúp lệnh builtin'],
      ['tldr cmd', 'vài ví dụ hay dùng'],
      ['apropos từ ; man -k từ', 'không nhớ tên lệnh'],
      ['command -v curl', 'có lệnh này không'],
    ], { fs: 18 }),
    table(['Phím', 'Tác dụng'], [
      ['<code>Tab</code> · <code>Tab Tab</code>', 'hoàn thành · liệt kê'],
      ['<code>Ctrl</code>+<code>R</code>', 'tìm ngược lịch sử lệnh'],
      ['<code>Ctrl</code>+<code>A</code> / <code>E</code>', 'về đầu / cuối dòng'],
      ['<code>Ctrl</code>+<code>U</code> / <code>W</code>', 'xoá tới đầu dòng / một từ'],
      ['<code>Ctrl</code>+<code>C</code> / <code>D</code> / <code>Z</code>', 'ngắt / hết đầu vào / tạm dừng'],
      ['<code>q</code> · <code>:q!</code> · <code>Ctrl</code>+<code>X</code>', 'thoát less · vim · nano'],
      ['<code>Ctrl</code>+<code>L</code> · <code>reset</code>', 'xoá màn hình · chữa terminal rác'],
    ], { sm: true }), 'l') },

  { t: 'Thực hành Mục 0 (45 phút): dựng chỗ học của riêng bạn', body: `
    ${steps([
      ['Trả lời 4 câu: nhân gì, distro gì, shell nào, bash bản mấy', '<code>uname -srm</code> · <code>cat /etc/os-release</code> · <code>ps -p $$ -o comm=</code> · <code>bash --version</code>'],
      ['Tạo sân tập <code>~/thu-linux</code> và file mẹo <code>meo.txt</code> ghi 3 lệnh vừa dùng', '<code>mkdir -p ~/thu-linux &amp;&amp; cd ~/thu-linux</code>'],
      ['Chạy container Ubuntu gắn <code>~/thu-linux</code>, tạo một file từ bên trong', 'thấy nó ở máy bạn — và để ý giờ UTC'],
      ['Chạy vòng kiểm “ok / MISSING”, cài phần thiếu, chạy lại tới khi đủ “ok”', '<code>apt-get install -y curl man-db …</code>'],
      ['Tái hiện AN TOÀN lỗi Steam bằng <code>echo</code>, thử chặn bằng <code>set -u</code> rồi bằng <code>${X:?}</code>', 'không bao giờ bỏ <code>echo</code> ở bài này'],
    ])}
    ${box('good', '<b>Đạt khi:</b> <code>meo.txt</code> có ≥ 6 lệnh kèm chú thích tiếng Việt, vòng kiểm in đủ 8 dòng <code>ok</code>, và bạn giải thích được vì sao <code>set -u</code> KHÔNG cứu được người dùng Steam còn <code>${X:?}</code> thì cứu được.')}` },
]);
