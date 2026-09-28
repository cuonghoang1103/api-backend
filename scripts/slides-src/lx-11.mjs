/**
 * Linux & Bash · Deck lx-11 — Chương 11: systemd, cron & quản trị.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 28/09/2026:
 *   • "Ubuntu" = container ubuntu:24.04 (arm64) chạy systemd THẬT (systemd 255.4-1ubuntu8.17, --privileged, ngắn hạn,
 *                hostname vps-1): cron 3.0pl1-184ubuntu2, OpenSSH 9.6p1 (ssh.socket), fail2ban 1.0.2 (nftables),
 *                unattended-upgrades. Múi giờ container = UTC.
 *   • "Fedora" = linux-nha (Fedora 44, systemd 259, cronie 1.7.2) — chỉ đọc.
 *   • "Mac"    = Mac M1, macOS 27 (múi giờ Asia/Ho_Chi_Minh), chỉ lệnh đọc.
 *
 * Hình tự vẽ (SVG nội tuyến): lichSu() dòng thời gian init/cron · phuThuoc() Wants/Requires/After ·
 * vongDoi() vòng đời Restart= · annot() (chép lx-05/lx-09) · haiDongHo() UTC với +07 · thuTuSshd() 01- thắng 50- ·
 * capTimer() .timer → .service.
 */
import { S, cover, sh, term, mindmap, diagram, cards, box, steps, table, two, layers, sv, R, T, A, D, esc } from './_lx-chung.mjs';

export const deck = { key: 'lx-11', code: 'LINUX · CHƯƠNG 11', title: 'systemd, cron &amp; quản trị', sub: 'Linux & Bash · Chương 11' };

const MONO = 'SF Mono,Menlo,monospace';
const c = (k) => D[k] || k;
const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15.5px}.c-t.sm td,.c-t.sm th{padding:6px 10px}</style>';
const P = (t) => `<p style="font-size:14.5px;color:${D.mu};margin-top:8px;text-align:center">${t}</p>`;

/** annot(str, segs) — một dòng chữ đơn cách, ngoặc màu + nhãn dưới từng đoạn (chép lx-09). */
const annot = (str, segs, { fs = 40, w = 1150, rowH = 58, y0 = 56, h } = {}) => {
  const cw = fs * 0.602;
  const x0 = Math.round((w - str.length * cw) / 2);
  let s = R(x0 - 22, y0 - fs - 6, str.length * cw + 44, fs + 28, { c: 'bd', fill: '#050806', r: 12, sw: 2 });
  let last = 0;
  const pieces = [];
  segs.slice().sort((a, b) => a.from - b.from).forEach((g) => {
    if (g.from > last) pieces.push([str.slice(last, g.from), '#e6edf3', last]);
    pieces.push([str.slice(g.from, g.to), c(g.c), g.from]);
    last = g.to;
  });
  if (last < str.length) pieces.push([str.slice(last), '#e6edf3', last]);
  pieces.forEach(([t, col, at]) => {
    s += `<text x="${(x0 + at * cw).toFixed(1)}" y="${y0}" font-size="${fs}" fill="${col}" font-family="${MONO}" font-weight="700" xml:space="preserve">${esc(t)}</text>`;
  });
  const rowsEnd = [];
  const by = y0 + 22;
  segs.forEach((g) => {
    const a = x0 + g.from * cw + 2, b = x0 + g.to * cw - 2, mid = (a + b) / 2;
    const half = Math.max(String(g.t).length * 17 * 0.56, String(g.d || '').length * 14.5 * 0.5) / 2 + 6;
    let r = 0;
    while (rowsEnd[r] !== undefined && rowsEnd[r] > mid - half - 8) r++;
    rowsEnd[r] = mid + half;
    const ly = by + 36 + r * rowH;
    const col = c(g.c);
    s += `<path d="M${a} ${by} L${a} ${by + 8} L${b} ${by + 8} L${b} ${by}" stroke="${col}" stroke-width="3" fill="none"/>`;
    s += `<path d="M${mid} ${by + 8} L${mid} ${ly - 18}" stroke="${col}" stroke-width="2" stroke-dasharray="4 4"/>`;
    s += T(mid, ly, g.t, { fs: 17, c: col, a: 'middle', b: true });
    if (g.d) s += T(mid, ly + 21, g.d, { fs: 14.5, c: 'mu', a: 'middle' });
  });
  return sv(w, h || by + 36 + rowsEnd.length * rowH + 4, s);
};

/* Slide 3 — dòng thời gian: ai trông các dịch vụ và các lịch chạy */
const lichSu = () => {
  const ev = [
    [1979, 'cron', 'Unix V7', 'grn', 0],
    [1983, 'SysV init', 'script /etc/init.d', 'blu', 1],
    [1987, 'Vixie cron', 'Paul Vixie · cron Ubuntu = 3.0pl1', 'grn', 0],
    [2006, 'Upstart', 'Ubuntu 6.10', 'vio', 1],
    [2010, 'systemd', 'Poettering &amp; Sievers', 'lx', 0],
    [2011, 'Fedora 15', 'bản lớn đầu tiên dùng', 'lx', 1],
    [2015, 'Debian 8 · Ubuntu 15.04', 'systemd mặc định', 'lx', 0],
    [2022, 'ssh.socket', 'Ubuntu 22.10: giữ cổng 22', 'red', 1],
  ];
  let s = `<path d="M20 130 L1130 130" stroke="${D.bd}" stroke-width="4"/>` +
    T(1130, 16, 'khoảng cách không theo tỉ lệ năm', { fs: 12.5, c: 'dim', a: 'end' });
  ev.forEach(([y, t, d, col, up], i) => {
    const x = 60 + i * 147;
    s += `<circle cx="${x}" cy="130" r="9" fill="${D[col]}"/>`;
    const ty = up ? 190 : 62;
    s += `<path d="M${x} ${up ? 140 : 120} L${x} ${up ? ty - 22 : ty + 10}" stroke="${D[col]}" stroke-width="2" stroke-dasharray="4 4"/>`;
    s += T(x, ty, `${y} · ${t}`, { fs: 16, b: true, a: x > 1000 ? 'end' : x < 90 ? 'start' : 'middle', c: col });
    s += `<text x="${x}" y="${ty + 21}" font-size="13.5" fill="${D.mu}" text-anchor="${x > 1000 ? 'end' : x < 90 ? 'start' : 'middle'}">${d}</text>`;
  });
  return sv(1150, 230, s);
};

/* Slide 5 — Wants / Requires / After: bốn tình huống đo thật */
const phuThuoc = () => {
  let s = '';
  const box1 = (x, y, w, h, t, d, col) => R(x, y, w, h, { c: col, r: 10 }) + T(x + w / 2, y + 30, t, { fs: 17, b: true, a: 'middle', mono: true }) + T(x + w / 2, y + 54, d, { fs: 14, a: 'middle', c: 'mu' });
  s += box1(420, 120, 250, 76, 'db.service', 'cơ sở dữ liệu', 'vio');
  s += box1(0, 20, 260, 76, 'web-wants', 'Wants= + After=', 'grn');
  s += box1(0, 220, 260, 76, 'web-req', 'Requires= + After=', 'red');
  s += A(262, 58, 416, 140, { c: 'grn', dash: true }) + T(300, 44, 'Wants: "thử bật giùm"', { fs: 14, c: 'grn' });
  s += A(262, 258, 416, 180, { c: 'red' }) + T(300, 296, 'Requires: "thiếu là tôi thôi"', { fs: 14, c: 'red' });
  s += R(0, 120, 260, 76, { c: 'lx', r: 10, dash: true }) + T(130, 150, 'After= chỉ là THỨ TỰ', { fs: 15.5, b: true, a: 'middle', c: 'lx' }) + T(130, 174, 'chờ db "đã khởi động xong"', { fs: 13.5, a: 'middle', c: 'mu' });
  // bảng kết quả
  const rows = [
    ['db KHÔNG khởi động được', 'vẫn chạy ✓', 'không chạy — Dependency failed', 'red'],
    ['systemctl stop db', 'vẫn chạy ✓', 'bị dừng theo', 'amb'],
    ['db tự SẬP (kill -9)', 'vẫn chạy', 'VẪN CHẠY — cần BindsTo=', 'vio'],
  ];
  const x0 = 720;
  s += T(x0, 22, 'đo thật (Ubuntu 24.04, systemd 255)', { fs: 14, c: 'mu' });
  rows.forEach(([k, a, b, col], i) => {
    const y = 40 + i * 84;
    s += R(x0, y, 430, 66, { c: col, r: 8, fill: 'rgba(255,255,255,.02)' });
    s += T(x0 + 12, y + 24, k, { fs: 14.5, b: true, c: col });
    s += T(x0 + 12, y + 48, `wants: ${a}`, { fs: 13.5, c: 'grn' });
    s += T(x0 + 170, y + 48, `req: ${b}`, { fs: 13.5, c: 'tx' });
  });
  s += T(x0, 308, 'Type=simple "xong" ngay khi fork ⇒ After= không đợi app SẴN SÀNG', { fs: 13, c: 'lx' });
  return sv(1150, 320, s);
};

/* Slide 6 — vòng đời Restart= */
const vongDoi = () => {
  let s = '';
  const st = (x, y, w, t, d, col) => R(x, y, w, 70, { c: col, r: 35 }) + T(x + w / 2, y + 30, t, { fs: 16, b: true, a: 'middle', mono: true }) + T(x + w / 2, y + 52, d, { fs: 13.5, a: 'middle', c: 'mu' });
  s += st(0, 120, 200, 'activating', 'đang khởi động', 'blu');
  s += st(290, 120, 210, 'active (running)', 'Main PID sống', 'grn');
  s += st(600, 20, 250, 'auto-restart', 'chờ RestartSec', 'amb');
  s += st(600, 220, 250, 'inactive (dead)', 'thoát 0 / bị stop', 'dim');
  s += st(930, 20, 220, 'failed', 'start-limit-hit', 'red');
  s += A(202, 155, 286, 155, { c: 'blu' });
  s += A(502, 138, 598, 66, { c: 'amb' }) + T(566, 120, 'thoát ≠ 0 · tín hiệu', { fs: 13.5, c: 'amb' }) + T(566, 138, '(kill -9, OOM…)', { fs: 13, c: 'mu' });
  s += A(502, 172, 598, 246, { c: 'dim' }) + T(512, 222, 'thoát 0 · stop', { fs: 13.5, c: 'mu', a: 'end' });
  s += `<path d="M640 20 Q 300 -10 100 116" stroke="${D.amb}" stroke-width="2.5" fill="none" stroke-dasharray="7 6" marker-end="url(#m-amb)"/>`;
  s += T(250, 78, 'on-failure / always: bật lại', { fs: 14, c: 'amb', b: true });
  s += A(852, 55, 926, 55, { c: 'red' }) + T(1040, 114, 'lần thứ 6 trong 10 s', { fs: 13.5, c: 'red', a: 'middle' }) + T(1040, 134, 'reset-failed để thử lại', { fs: 13, c: 'mu', a: 'middle', mono: true });
  s += `<path d="M600 262 Q 250 330 100 194" stroke="${D.grn}" stroke-width="2.5" fill="none" stroke-dasharray="6 5" marker-end="url(#m-grn)"/>`;
  s += T(330, 300, 'Restart=always: bật lại cả khi thoát 0', { fs: 13.5, c: 'grn' });
  s += T(880, 300, 'mặc định: RestartSec=100ms', { fs: 14, c: 'lx', mono: true }) + T(880, 320, 'Burst=5 · IntervalSec=10s', { fs: 14, c: 'lx', mono: true });
  return sv(1150, 326, s);
};

/* Slide 12 — hai đồng hồ: cron trong máy UTC, người đọc ở +07 */
const haiDongHo = () => {
  let s = '';
  const X = (h) => 60 + h * 44;
  const row = (y, lb, off, col, sub) => {
    s += T(0, y - 26, lb, { fs: 15, b: true, c: col });
    s += T(0, y - 8, sub, { fs: 13, c: 'mu' });
    for (let h = 0; h <= 24; h += 3) {
      s += `<path d="M${X(h)} ${y} L${X(h)} ${y + 10}" stroke="${D.bd}" stroke-width="2"/>`;
      s += T(X(h), y + 30, String((h + off) % 24).padStart(2, '0') + ':00', { fs: 13, a: 'middle', mono: true, c: col });
    }
    s += `<path d="M${X(0)} ${y + 5} L${X(24)} ${y + 5}" stroke="${D[col]}" stroke-width="3"/>`;
  };
  row(60, 'Máy chủ / container (UTC)', 0, 'blu', 'cron đọc cột này');
  row(232, 'Bạn ở Việt Nam (+07)', 7, 'lx', 'bạn nghĩ theo cột này');
  // 02:00 UTC = 09:00 VN
  s += `<path d="M${X(2)} 50 L${X(2)} 238" stroke="${D.red}" stroke-width="3" stroke-dasharray="6 5"/>`;
  s += R(X(2) + 12, 112, 330, 56, { c: 'red', r: 10, fill: '#1a0f0f' }) + T(X(2) + 26, 136, '0 2 * * *  backup.sh', { fs: 15.5, b: true, mono: true }) + T(X(2) + 26, 158, 'chạy 02:00 UTC = 09:00 giờ VN — giờ cao điểm!', { fs: 13.5, c: 'red' });
  s += `<path d="M${X(19)} 50 L${X(19)} 238" stroke="${D.grn}" stroke-width="3" stroke-dasharray="6 5"/>`;
  s += R(X(19) - 330, 112, 318, 56, { c: 'grn', r: 10, fill: '#0f1a12' }) + T(X(19) - 316, 136, 'muốn 02:00 VN ⇒ viết 0 19 * * *', { fs: 14.5, b: true, mono: true }) + T(X(19) - 316, 158, '(hoặc OnCalendar=… Asia/Ho_Chi_Minh)', { fs: 13.5, c: 'grn', mono: true });
  return sv(1150, 272, s);
};

/* Slide 17 — thứ tự đọc drop-in của sshd: giá trị ĐẦU TIÊN thắng */
const thuTuSshd = (ten) => {
  let s = '';
  const f = [
    [ten, 'PasswordAuthentication no', ten.startsWith('01') ? 'grn' : 'dim'],
    ['50-cloud-init.conf', 'PasswordAuthentication yes', ten.startsWith('01') ? 'dim' : 'red'],
  ];
  if (!ten.startsWith('01')) f.reverse();
  f.forEach(([n, v, col], i) => {
    const y = 8 + i * 78;
    s += T(0, y + 42, String(i + 1), { fs: 28, b: true, c: 'mu' });
    s += R(30, y, 340, 64, { c: col, r: 10 }) + T(46, y + 26, n, { fs: 15.5, b: true, mono: true, c: col }) + T(46, y + 50, v, { fs: 14, mono: true });
  });
  s += A(376, 40, 404, 40, { c: 'lx' });
  s += T(410, 36, 'đọc TRƯỚC', { fs: 15, b: true, c: 'lx' }) + T(410, 56, '⇒ THẮNG', { fs: 15, b: true, c: 'lx' });
  return sv(540, 160, s);
};

/* Slide 13 — cặp .timer → .service */
const capTimer = () => diagram({
  w: 1150, h: 250,
  nodes: [
    { id: 'tt', x: 0, y: 20, w: 250, h: 90, t: 'timers.target', d: 'enable móc vào đây', c: 'dim' },
    { id: 'tm', x: 330, y: 20, w: 300, h: 90, t: 'backup.timer', d: 'LÚC NÀO: OnCalendar=\nPersistent=true', c: 'lx', mono: true },
    { id: 'sv', x: 330, y: 150, w: 300, h: 90, t: 'backup.service', d: 'LÀM GÌ: Type=oneshot\nkhông có [Install]', c: 'grn', mono: true },
    { id: 'jr', x: 790, y: 150, w: 340, h: 90, t: 'journal + mã thoát', d: 'journalctl -u backup.service', c: 'blu' },
    { id: 'st', x: 790, y: 20, w: 340, h: 90, t: 'stamp-backup.timer', d: '/var/lib/systemd/timers/', c: 'vio', mono: true },
  ],
  edges: [
    { from: 'tt', to: 'tm', t: 'WantedBy', off: -8 },
    { from: 'tm', to: 'sv', t: 'khớp theo TÊN', c: 'lx', off: 8 },
    { from: 'sv', to: 'jr', t: 'mỗi lượt', c: 'blu' },
    { from: 'tm', to: 'st', t: 'lần chạy cuối', c: 'vio', off: -8 },
  ],
});

export const slides = S([
  cover({ t: 'Chương 11 — systemd, cron &amp; quản trị', sub: 'unit · Wants/Requires/After · Restart= · drop-in · hộp cát · cron · timer · OnCalendar · flock · sshd -T · ssh.socket · fail2ban · unattended-upgrades', chap: 'CHƯƠNG 11' }),

  { t: 'Bản đồ chương: từ “chạy bằng nohup” tới máy tự lo', body: mindmap('systemd', 'PID 1 trông mọi thứ', [
    { t: '11.1 · Unit', d: 'file 3 mục · systemctl · daemon-reload', c: 'lx' },
    { t: 'Phụ thuộc &amp; Restart=', d: 'Wants · Requires · After · vòng lặp sập', c: 'amb' },
    { t: 'Drop-in &amp; hộp cát', d: 'systemctl edit · ProtectSystem · MemoryMax', c: 'vio' },
    { t: '11.2 · cron', d: '5 trường · môi trường · UTC vs +07', c: 'grn' },
    { t: 'Timer', d: 'OnCalendar · Persistent · calendar · flock', c: 'tea' },
    { t: '11.3 · Gia cố', d: 'sshd -T · ssh.socket · fail2ban · cập nhật tự động', c: 'red' },
  ]) },

  /* ───────────── 11.1 ───────────── */
  { t: 'nohup sống qua rớt mạng, KHÔNG sống qua reboot', body: `${lichSu()}
    ${cards([
      { ic: '🪦', t: 'nohup / tmux (Bài 5.4)', d: 'Máy khởi động lại lúc 4 giờ sáng ⇒ app không bao giờ quay lại. Sập ⇒ không ai dựng dậy.', c: 'red' },
      { ic: '📜', t: 'SysV init', d: 'Mỗi dịch vụ một script shell dài, tự ghi PID file, tự viết start/stop/status.', c: 'blu' },
      { ic: '🧩', t: 'systemd', d: 'Mười mấy dòng <strong>khai báo</strong>: chạy cùng máy, tự bật lại, log vào journal, giới hạn tài nguyên.', c: 'amb' },
    ])}` },

  { t: 'Một unit = một file INI ba mục', body: two(
    sh([
      ['# /etc/systemd/system/myapp.service', ''],
      ['[Unit]', 'siêu dữ liệu + THỨ TỰ'],
      ['Description=My app', 'hiện trong status'],
      ['After=network-online.target', 'chạy SAU mạng'],
      ['Wants=network-online.target', '…và thử bật mạng'],
      ['[Service]', 'chạy NHƯ THẾ NÀO'],
      ['User=appuser', 'không phải root'],
      ['WorkingDirectory=/srv/app', 'cd vào đây trước'],
      ['ExecStart=/usr/bin/python3 server.py', 'KHÔNG qua shell'],
      ['Restart=on-failure', 'sập thì dựng lại'],
      ['[Install]', 'enable móc vào đâu'],
      ['WantedBy=multi-user.target', '= khởi động bình thường'],
    ], { fs: 15 }),
    `${steps([
      ['Sửa file xong: <code>systemctl daemon-reload</code>', 'không có nó: “Warning: … changed on disk”'],
      ['<code>enable</code> = cùng máy · <code>start</code> = ngay bây giờ', '<code>enable --now</code> làm cả hai'],
      ['<code>/usr/lib/systemd/system</code> của gói', '<code>/etc/systemd/system</code> của BẠN — thắng'],
    ])}
    ${box('warn', 'Đo thật: sửa <code>RestartSec=2s</code>→<code>3s</code>, <code>restart</code> mà chưa reload ⇒ <code>systemctl show</code> vẫn <code>RestartUSec=2s</code>.')}`) },

  { t: 'Wants, Requires, After: ba chữ, ba nghĩa khác nhau', body: `${phuThuoc()}
    ${P('<code>systemctl list-dependencies myapp</code> — cây phụ thuộc · <code>--reverse db</code> — ai đang dựa vào db')}` },

  { t: 'Restart=: sập → chờ → dậy lại; quá 5 lần/10 s thì thôi', body: `${vongDoi()}
    ${two(
    term(['$ systemctl show crashy -p NRestarts', '! NRestarts=5', '# …Start request repeated too quickly.', '# RestartSec=3s, giữ mặc định 5/10s, chờ 25s:', '$ systemctl show crashy -p NRestarts -p SubState', '+ NRestarts=7', '+ SubState=auto-restart'], { title: 'Ubuntu 24.04 — output thật', fs: 13.5 }),
    term(['# đặt StartLimitIntervalSec=300 trong [Service]:', '$ systemd-analyze verify sl.service', "! sl.service:5: Unknown key name 'StartLimitIntervalSec'", "!   in section 'Service', ignoring.", '# ⇒ phải nằm trong [Unit]', '$ systemctl reset-failed crashy', '# xoá bộ đếm sau khi sửa lỗi thật'], { title: 'Ubuntu 24.04 — output thật', fs: 13.5 }))}` },

  { t: 'status + journal nói ĐÚNG chỗ hỏng — đọc mã sau dấu /', body: two(
    term(['$ systemctl status t-node', '! Process: 200 ExecStart=node server.js', '!   (code=exited, status=203/EXEC)', '$ journalctl -u t-chdir -o cat -n1', '! Changing to the requested working', '!   directory failed: No such file…', '$ journalctl -u t-user -o cat -n1', '! Failed to determine user credentials', '$ systemd-path search-binaries-default', '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin'], { title: 'Ubuntu 24.04 — output thật', fs: 13.5 }),
    table(['Mã', 'Nghĩa', 'Sửa'], [
      ['<code>203/EXEC</code>', 'không tìm/chạy được chương trình', 'đường dẫn tuyệt đối · <code>chmod +x</code>'],
      ['<code>200/CHDIR</code>', '<code>WorkingDirectory</code> không có', 'tạo thư mục · quyền đi qua'],
      ['<code>217/USER</code>', '<code>User=</code> không tồn tại', '<code>useradd -r</code> · sửa gõ sai'],
      ['<code>1/FAILURE</code>', 'CHÍNH app thoát ≠ 0', 'đọc journal của app'],
      ['!tên trần <code>python3</code>', 'chạy được — tra 4 thư mục cố định', 'node của nvm thì KHÔNG thấy'],
      ['-<code>&gt;&gt; app.log</code>', 'thành THAM SỐ, không chuyển hướng', 'để journal hứng stdout'],
    ], { sm: true })) },

  { t: 'Drop-in ghi đè, hộp cát khoá lại — systemctl cat thấy hết', body: two(
    term(['$ systemctl cat myapp', '# /etc/systemd/system/myapp.service', '[Service]', 'ExecStart=python3 server.py …', '# /etc/systemd/system/myapp.service.d/hardening.conf', '+ [Service]', '+ NoNewPrivileges=true', '+ ProtectSystem=strict', '+ PrivateTmp=true', '+ MemoryMax=64M'], { title: 'Ubuntu 24.04 — output thật (cắt)', fs: 13.5 }),
    `${term(['$ systemd-analyze security myapp | tail -1', '! Overall exposure level: 9.2 UNSAFE', '# thêm drop-in hardening.conf:', '= Overall exposure level: 7.5 EXPOSED', '$ systemd-run -p ProtectSystem=strict touch /srv/app/x', "! touch: cannot touch '/srv/app/x': Read-only file system", '$ systemd-run -p MemoryMax=64M python3 leak.py', "! leak.service: Failed with result 'oom-kill'."], { title: 'Ubuntu 24.04 — output thật', fs: 13 })}
    ${box('tip', 'Muốn THAY danh sách như <code>ExecStart=</code>: viết <code>ExecStart=</code> rỗng trước. <code>systemctl revert</code> gỡ mọi drop-in.')}`) },

  /* ───────────── 11.2 ───────────── */
  { t: 'Một dòng cron = 5 trường thời gian + câu lệnh', body: `${annot('*/15 9-17 * * 1-5 /usr/local/bin/check.sh', [
    { from: 0, to: 4, t: 'phút', d: '*/15 = 0,15,30,45', c: 'lx' },
    { from: 5, to: 9, t: 'giờ', d: '9-17 · giờ CỦA MÁY', c: 'amb' },
    { from: 10, to: 11, t: 'ngày', d: '1–31', c: 'grn' },
    { from: 12, to: 13, t: 'tháng', d: '1–12', c: 'tea' },
    { from: 14, to: 17, t: 'thứ', d: '0 và 7 = CN', c: 'blu' },
    { from: 18, to: 41, t: 'câu lệnh', d: 'chạy bằng /bin/sh', c: 'vio' },
  ], { fs: 34, rowH: 56 })}
    ${cards([
      { t: '* = mọi', d: '<code>*</code> ở trường phút = 60 lần/giờ.', c: 'amb' },
      { t: 'a-b · a,b · */n', d: 'khoảng · danh sách · bước nhảy.', c: 'grn' },
      { t: 'ngày HOẶC thứ', d: 'giới hạn cả hai ⇒ chạy khi MỘT trong hai khớp.', c: 'red' },
      { t: '@reboot @daily', d: 'lối tắt; <code>@daily</code> = <code>0 0 * * *</code>.', c: 'blu' },
    ], 4)}` },

  { t: 'Dịch cron sang OnCalendar — rồi hỏi máy, đừng đoán', body: two(
    table(['cron', 'OnCalendar=', 'Nghĩa'], [
      ['<code>30 3 * * *</code>', '<code>*-*-* 03:30</code>', '03:30 mỗi ngày'],
      ['<code>*/15 * * * *</code>', '<code>*:0/15</code>', 'mỗi 15 phút'],
      ['<code>0 */6 * * *</code>', '<code>*-*-* 0/6:00</code>', '00·06·12·18 giờ'],
      ['<code>0 9 * * 1-5</code>', '<code>Mon..Fri 09:00</code>', 'ngày làm việc'],
      ['<code>0 0 * * 1</code>', '<code>weekly</code>', 'thứ Hai 00:00'],
      ['-(không viết được)', '<code>Sat *-*-1..7 02:00</code>', 'thứ Bảy ĐẦU tháng'],
      ['-(không viết được)', '<code>*-*~01 23:00</code>', 'ngày CUỐI tháng'],
    ], { sm: true }),
    term(["$ systemd-analyze calendar '*-*~01 23:00' \\", '    --iterations=3', 'Normalized form: *-*~01 23:00:00', '+    Next elapse: Wed 2026-09-30 23:00:00 UTC', '+   Iteration #2: Sat 2026-10-31 23:00:00 UTC', '+   Iteration #3: Mon 2026-11-30 23:00:00 UTC', "$ systemd-analyze calendar '0 */6 * * *'", "! Failed to parse calendar specification", "!   '0 */6 * * *': Invalid argument", '# cú pháp cron KHÔNG dán thẳng vào được'], { title: 'Ubuntu 24.04 — output thật', fs: 13.5 })) },

  { t: 'Chạy tay được, cron thì không: môi trường và tên file', body: two(
    `${term(['$ cat /tmp/cron-env.txt     # do cron ghi ra', 'HOME=/home/deploy', 'LOGNAME=deploy', 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:…', 'LANG=C.UTF-8', 'SHELL=/bin/sh', '! # không ~/.bashrc ⇒ không nvm, không ~/.local/bin'], { title: 'Ubuntu 24.04 — cron thật ghi env', fs: 13 })}
    ${box('info', 'Ubuntu nạp <code>/etc/environment</code> qua PAM nên PATH dài. cronie (Fedora) mặc định chỉ <code>/usr/bin:/bin:/usr/sbin:/sbin</code>.')}`,
    `${term(['$ ls /etc/cron.daily', 'apt-compat  backup-db  backup.sh  dpkg', 'noexec-job  rotate.bak', '$ run-parts --test /etc/cron.daily', '= /etc/cron.daily/apt-compat', '= /etc/cron.daily/backup-db', '= /etc/cron.daily/dpkg', '# backup.sh, rotate.bak (dấu chấm) và', '# noexec-job (thiếu +x): im lặng bị bỏ'], { title: 'Ubuntu 24.04 — output thật', fs: 13.5 })}
    ${box('warn', '<code>/etc/cron.d/app.cleanup</code> không bao giờ chạy; <code>app-cleanup</code> chạy đúng phút sau — đo thật.')}`) },

  { t: 'Máy chủ ở UTC, bạn ở +07: cron chạy lệch 7 tiếng', body: `${haiDongHo()}
    ${two(
    term(['$ date; TZ=Asia/Ho_Chi_Minh date', 'Mon Sep 28 15:26:06 UTC 2026', 'Mon Sep 28 22:26:06 +07 2026', "$ systemd-analyze calendar '*-*-* 09:00 Asia/Ho_Chi_Minh'", '+    Next elapse: Tue 2026-09-29 02:00:00 UTC'], { title: 'Ubuntu 24.04 — output thật', fs: 13 }),
    term(['$ crontab -l -u deploy', 'CRON_TZ=Asia/Ho_Chi_Minh', '28 22 * * * touch /tmp/crontz-vn', '# 22:28 giờ VN đã qua…', '$ ls /tmp/crontz-vn', "! ls: cannot access '/tmp/crontz-vn'", '! # cron của Ubuntu LỜ CRON_TZ (cronie thì hiểu)'], { title: 'Ubuntu 24.04 — output thật', fs: 13 }))}` },

  { t: 'Timer = cặp .timer (lúc nào) + .service (làm gì)', body: `${capTimer()}
    ${term(['$ systemctl enable --now backup.timer   # enable TIMER, không phải service', '$ systemctl list-timers backup.timer', 'NEXT                        LEFT LAST PASSED UNIT         ACTIVATES', '+ Tue 2026-09-29 03:32:04 UTC  12h -         - backup.timer backup.service', '$ systemctl start backup.service; journalctl -u backup.service -o cat', '= backup: 4.0K -> /srv/backups/app-20260928-152548.tar.gz'], { title: 'Ubuntu 24.04 — output thật (03:32 = 03:30 + RandomizedDelaySec)', fs: 13.5 })}` },

  { t: 'cron hay timer: chọn theo việc', body: table(['', 'cron', 'systemd timer'], [
    ['Viết', '+1 dòng', '2 file + <code>daemon-reload</code>'],
    ['Log', '-mail đi đâu mất; tự chuyển hướng', '+journal sẵn: <code>journalctl -u x.service</code>'],
    ['Máy tắt đúng giờ chạy', '-bỏ lượt đó', '+<code>Persistent=true</code> chạy bù khi lên'],
    ['Chạy thử NGAY', '-chờ tới giờ, hoặc <code>env -i …</code>', '+<code>systemctl start x.service</code>'],
    ['Chồng lượt', '-chạy bản 2, 3, 4… ⇒ cần <code>flock</code>', '+không chạy lượt 2 khi lượt 1 chưa xong'],
    ['Múi giờ', '!theo máy; Ubuntu lờ <code>CRON_TZ</code>', '+ghi thẳng: <code>… 09:00 Asia/Ho_Chi_Minh</code>'],
    ['Phụ thuộc, hộp cát, <code>MemoryMax</code>', '-không', '+như mọi service (Bài 11.1)'],
    ['Có ở đâu', '+mọi Unix, container, macOS', '!chỉ máy chạy systemd (WSL cần bật)'],
  ], { sm: true }) },

  { t: 'flock: bản thứ hai tự lui, khoá nhả khi tiến trình chết', body: two(
    term(['$ flock -n /tmp/backup.lock sleep 30 &', '$ flock -n /tmp/backup.lock echo "second copy"', '$ echo "exit=$?"', '! exit=1', '$ flock -w 2 -E 75 /tmp/backup.lock echo hi', '$ echo "exit=$?"', '! exit=75', '# chờ 2 giây rồi bỏ, mã thoát do mình chọn'], { title: 'Ubuntu 24.04 — output thật', fs: 14 }),
    `${sh([
      ['# crontab: bỏ lượt nếu lượt trước còn chạy', ''],
      ['30 3 * * * /usr/bin/flock -n /var/lock/backup.lock \\', ''],
      ['    /usr/local/bin/backup.sh', ''],
    ], { fs: 14.5, so: false })}
    ${table(['Cờ', 'Nghĩa'], [
      ['<code>-n</code>', 'không chờ — khoá bận thì thoát 1 ngay'],
      ['<code>-w 60</code>', 'chờ tối đa 60 giây'],
      ['<code>-E 75</code>', 'mã thoát khi không lấy được khoá'],
      ['<code>-s</code> / <code>-x</code>', 'khoá chia sẻ / độc quyền (mặc định)'],
    ], { sm: true })}
    ${box('warn', 'Khoá gắn với file descriptor: con cháu còn giữ fd thì khoá chưa nhả.')}`) },

  /* ───────────── 11.3 ───────────── */
  { t: 'Bị dò mật khẩu sau vài phút — xếp 6 lớp phòng thủ', body: two(
    layers({ w: 540, cap: 'từ ngoài vào trong', rows: [
      { k: '1', t: 'Chỉ khoá SSH · <code>PasswordAuthentication no</code>', c: 'red' },
      { k: '2', t: 'Không root · <code>deploy</code> + sudo hẹp', c: 'amb' },
      { k: '3', t: 'Tường lửa mặc định từ chối (ufw)', c: 'ora' },
      { k: '4', t: 'Cập nhật bảo mật tự động', c: 'grn' },
      { k: '5', t: 'fail2ban — cấm IP dò dai', c: 'tea' },
      { k: '6', t: 'swap · đồng hồ · sao lưu đã PHỤC HỒI thử', c: 'blu' },
    ] }),
    `${term(['$ journalctl -u ssh -o short | tail -4', 'sshd[1030]: Invalid user oracle from 127.0.0.1', 'sshd[1030]: Connection closed by invalid user oracle …', 'sshd[1034]: Invalid user postgres from 127.0.0.1', 'sshd[1034]: Connection closed by invalid user postgres …'], { title: 'Ubuntu 24.04 — lượt dò tự tạo, output thật', fs: 13 })}
    ${box('tip', 'Lớp 1 chấm dứt các lượt dò mật khẩu. Các lớp sau là phòng thủ nhiều lớp phía SAU nó — không lớp nào thay được lớp 1.')}`) },

  { t: 'sshd: giá trị ĐẦU TIÊN thắng — 01- thắng 50-cloud-init', body: two(
    `${thuTuSshd('99-hardening.conf')}
     ${term(['$ ls /etc/ssh/sshd_config.d/', '50-cloud-init.conf  99-hardening.conf', '$ sshd -T | grep -E "^(passwordauth|permitroot)"', 'permitrootlogin no', '! passwordauthentication yes'], { title: 'Ubuntu 24.04 — output thật', fs: 13.5 })}`,
    `${thuTuSshd('01-hardening.conf')}
     ${term(['$ mv 99-hardening.conf 01-hardening.conf', '$ sshd -T | grep -E "^(passwordauth|permitroot)"', 'permitrootlogin no', '= passwordauthentication no'], { title: 'Ubuntu 24.04 — output thật', fs: 13.5 })}
     ${box('good', '<code>PermitRootLogin</code> đã ăn cả hai lần vì cloud-init không khai nó. Nửa ăn nửa trượt = va chạm THỨ TỰ.')}`) },

  { t: 'Ubuntu 24.04: cổng SSH do ssh.socket giữ, không phải sshd', body: two(
    term(['$ systemctl is-enabled ssh.socket ssh.service', 'enabled', 'disabled', "$ echo 'Port 2222' > /etc/ssh/sshd_config.d/02-port.conf", '$ systemctl restart ssh; sshd -T | grep ^port', '! port 2222', "$ ss -tlnp | grep -E ':22 |:2222 '", '! LISTEN 0.0.0.0:22 … ("sshd",pid=902),("systemd",pid=1)', '$ systemctl daemon-reload && systemctl restart ssh.socket', "$ ss -tlnp | grep -E ':22 |:2222 '", '= LISTEN 0.0.0.0:2222 … ("systemd",pid=1,fd=51)'], { title: 'Ubuntu 24.04 chạy systemd thật — output thật', fs: 13 }),
    `${steps([
      ['<code>sshd -T</code> nói 2222, <code>ss</code> nói 22', 'cấu hình ≠ cổng đang mở'],
      ['Generator dịch <code>Port</code> thành <code>ListenStream=</code>', 'chỉ khi <code>daemon-reload</code>'],
      ['Rồi <code>restart ssh.socket</code>', 'mở <code>ufw allow 2222/tcp</code> TRƯỚC'],
    ])}
    ${term(['$ cat /run/systemd/generator/ssh.socket.d/*.conf', '[Socket]', 'ListenStream=', '+ ListenStream=0.0.0.0:2222', '+ ListenStream=[::]:2222'], { title: 'file do generator sinh', fs: 13.5 })}`) },

  { t: 'fail2ban: đọc log, đếm lần hỏng, cấm IP bằng nftables', body: two(
    `${sh([
      ['# /etc/fail2ban/jail.local  (đừng sửa jail.conf)', ''],
      ['[sshd]', ''],
      ['enabled  = true', ''],
      ['maxretry = 3', 'hỏng 3 lần…'],
      ['findtime = 10m', '…trong 10 phút'],
      ['bantime  = 1h', '⇒ cấm 1 giờ'],
    ], { fs: 15 })}
    ${box('info', 'Ubuntu 24.04 sẵn <code>backend = systemd</code> (đọc journal) và <code>banaction = nftables</code> trong <code>jail.d/defaults-debian.conf</code>.')}`,
    term(['$ fail2ban-client status sshd', '|- Filter', '|  |- Total failed:     4', '|  `- Journal matches:  _SYSTEMD_UNIT=sshd.service + _COMM=sshd', '`- Actions', '!   |- Currently banned: 1', '!   `- Banned IP list:   127.0.0.1', '$ nft list ruleset | grep reject', '  tcp dport 22 ip saddr @addr-set-sshd reject …', '$ ssh x@127.0.0.1', '! ssh: connect to host 127.0.0.1 port 22: Connection refused', '$ fail2ban-client set sshd unbanip 127.0.0.1'], { title: 'Ubuntu 24.04 — output thật', fs: 13 })) },

  { t: 'Cập nhật bảo mật tự chạy lúc 6 giờ — bạn chỉ lo reboot', body: two(
    term(['$ cat /etc/apt/apt.conf.d/20auto-upgrades', 'APT::Periodic::Update-Package-Lists "1";', 'APT::Periodic::Unattended-Upgrade "1";', '$ systemctl cat apt-daily-upgrade.timer \\', '    | grep -A3 Timer', '+ OnCalendar=*-*-* 6:00', '+ RandomizedDelaySec=60m', '+ Persistent=true', '$ unattended-upgrade --dry-run --debug 2>&1 \\', '    | grep origins', 'Allowed origins are: o=Ubuntu,a=noble,', '  o=Ubuntu,a=noble-security, …'], { title: 'Ubuntu 24.04 — output thật', fs: 12.5 }),
    `${sh([
      ['cat /var/run/reboot-required.pkgs', 'cần reboot?'],
      ['sudo needrestart -r l', 'dịch vụ cần restart'],
      ['free -h; swapon --show', 'có swap chưa'],
      ['timedatectl', 'NTP synchronized: yes?'],
    ], { fs: 13.5 })}
    ${box('warn', 'Bản thân unattended-upgrades CHẠY BẰNG TIMER (Bài 11.2). Nhân mới chỉ có hiệu lực sau khi khởi động lại.')}`, 'l') },

  { t: 'Giờ đầu tiên với một VPS mới: 8 việc, theo đúng thứ tự', body: cards([
    { big: '1', t: 'Cập nhật hết', d: '<code>apt update &amp;&amp; apt full-upgrade -y</code> rồi <code>reboot</code> — khi chưa có gì để hỏng.', c: 'blu' },
    { big: '2', t: 'Người dùng + khoá', d: '<code>adduser deploy</code> · <code>usermod -aG sudo</code> · <code>.ssh</code> 700, khoá 600.', c: 'grn' },
    { big: '3', t: 'Khoá SSH lại', d: 'Drop-in <code>01-hardening.conf</code> · <code>sshd -t</code> · reload · nghiệm thu <code>sshd -T</code>.', c: 'red' },
    { big: '4', t: 'Tường lửa', d: '<code>ufw allow OpenSSH</code> → 80,443 → <code>enable</code>. Luật SSH TRƯỚC.', c: 'amb' },
    { big: '5', t: 'Cập nhật tự động', d: 'unattended-upgrades · chạy thử <code>--dry-run</code> để BIẾT nó chạy.', c: 'tea' },
    { big: '6', t: 'fail2ban · swap', d: 'fail2ban (tuỳ) · swap 2G nếu RAM nhỏ, ghi <code>/etc/fstab</code>.', c: 'vio' },
    { big: '7', t: 'Đồng hồ · tên máy', d: '<code>timedatectl</code> (để UTC) · <code>hostnamectl set-hostname vps-1</code>.', c: 'pnk' },
    { big: '8', t: 'Sao lưu + PHỤC HỒI', d: 'Một timer sao lưu, và phục hồi thử một lần — hôm nay.', c: 'ora' },
  ], 4) + box('warn', 'Suốt giờ này: GIỮ một phiên SSH đang mở, thử mọi thay đổi từ terminal THỨ HAI.') },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 11', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Sửa unit mà không đổi gì', 'chưa <code>daemon-reload</code>', 'reload rồi restart'],
    ['Máy reboot, app biến mất', 'chỉ <code>start</code>, chưa <code>enable</code>', '<code>enable --now</code>'],
    ['<code>203/EXEC</code>', 'node của nvm ngoài 4 thư mục chuẩn', 'đường dẫn tuyệt đối'],
    ['Vòng lặp sập không bao giờ dừng', '<code>RestartSec</code> ≥ 2,5 s: 5 lần không lọt vào 10 s', '<code>StartLimitIntervalSec</code> trong <code>[Unit]</code>'],
    ['App dựa DB vẫn chạy khi DB sập', '<code>Requires=</code> không theo khi sập', '<code>BindsTo=</code> hoặc app tự thử lại'],
    ['cron: <code>command not found</code>', 'không đọc <code>~/.bashrc</code>', 'script bọc tự đặt PATH'],
    ['Job trong cron.d không chạy', 'tên file có dấu chấm', 'đổi tên <code>app-cleanup</code>'],
    ['Sao lưu chạy 9 giờ sáng', 'máy UTC, lịch viết theo +07', 'đổi giờ hoặc OnCalendar có múi'],
    ['Tắt mật khẩu mà vẫn vào được', '<code>50-cloud-init.conf</code> đọc trước', 'đặt tên <code>01-</code> · <code>sshd -T</code>'],
    ['Đổi <code>Port</code> không ăn', '<code>ssh.socket</code> giữ cổng', '<code>daemon-reload</code> + restart socket'],
  ], { sm: true }) },

  { t: 'Ubuntu · Fedora · macOS · WSL: cùng việc, khác công cụ', body: table(['Việc', 'Ubuntu 24.04', 'Fedora 44', 'macOS / WSL2'], [
    ['Trình quản lý dịch vụ', 'systemd 255', 'systemd 259', '!macOS: launchd · WSL: systemd nếu bật'],
    ['cron', 'Vixie cron 3.0pl1 (<code>cron</code>)', 'cronie (<code>crond</code>)', 'macOS có <code>/usr/bin/crontab</code>, Apple khuyên launchd'],
    ['PATH của cron', 'dài (từ <code>/etc/environment</code>)', '<code>/usr/bin:/bin:/usr/sbin:/sbin</code>', '—'],
    ['<code>CRON_TZ=</code>', '-bị lờ (đo thật)', '+hiểu', '—'],
    ['Log của cron', '<code>journalctl -t CRON</code>', '<code>journalctl -u crond</code>', '—'],
    ['<code>systemctl</code> · <code>flock</code>', 'có', 'có', '-macOS: <code>systemctl not found</code>, <code>flock not found</code>'],
    ['Ngày mai', '<code>date -d tomorrow</code>', 'như Ubuntu', '!macOS: <code>date -v+1d</code> (<code>-d</code>: illegal option)'],
    ['Bật systemd trên WSL', '—', '—', '<code>/etc/wsl.conf</code>: <code>[boot]</code> <code>systemd=true</code>'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 11 (1/2): systemctl, unit, journal', body: two(
    sh([
      ['systemctl status|start|stop|restart X', ''],
      ['systemctl reload-or-restart X', 'SIGHUP nếu hỗ trợ'],
      ['systemctl enable --now X · disable --now', 'cùng máy + ngay'],
      ['systemctl is-active|is-enabled|is-failed X', 'cho script'],
      ['systemctl list-units --failed', 'việc đầu tiên'],
      ['systemctl daemon-reload', 'sau MỌI lần sửa'],
      ['systemctl cat X · show X -p User', 'file · giá trị đã giải'],
      ['systemctl edit X · revert X', 'drop-in · gỡ'],
      ['systemctl reset-failed X', 'xoá bộ đếm'],
      ['systemctl mask X · unmask X', 'cấm khởi động'],
      ['systemctl list-dependencies [--reverse] X', 'cây phụ thuộc'],
    ], { fs: 13.5 }),
    sh([
      ['journalctl -u X -n 50 --no-pager', 'log của unit'],
      ['journalctl -u X -f · -p err · --since today', 'theo dõi · lọc'],
      ['systemd-analyze verify file.service', 'bắt khoá sai mục'],
      ['systemd-analyze security X', 'điểm hộp cát'],
      ['systemd-analyze calendar "…" --iterations=3', 'lần chạy kế'],
      ['systemd-run -p MemoryMax=64M cmd', 'unit tạm để thử'],
      ['systemd-path search-binaries-default', 'nơi tra tên trần'],
      ['Restart=on-failure  RestartSec=5s', '[Service]'],
      ['StartLimitIntervalSec=300  StartLimitBurst=5', '[Unit]!'],
      ['NoNewPrivileges ProtectSystem=strict', 'hộp cát'],
      ['PrivateTmp ProtectHome MemoryMax=512M', 'hộp cát'],
    ], { fs: 13.5 })) },

  { t: 'Bảng tra nhanh Chương 11 (2/2): cron, timer, gia cố', body: two(
    sh([
      ['crontab -e · -l · -l > cron.bak', 'sửa · xem · sao lưu'],
      ['crontab -u deploy -l', 'của người khác (root)'],
      ['run-parts --test /etc/cron.daily', 'cái gì SẼ chạy'],
      ['journalctl -t CRON --since today', 'cron có THỬ không'],
      ['env -i HOME=$HOME PATH=/usr/bin:/bin sh -c CMD', 'thử như cron'],
      ['cmd 2>&1 | logger -t backup', 'output vào journal'],
      ['flock -n /var/lock/x.lock cmd', 'không chạy chồng'],
      ['systemctl list-timers --all', 'timer nào, khi nào'],
      ['systemctl enable --now x.timer', 'TIMER, không service'],
      ['systemctl start x.service', 'chạy thử ngay'],
      ['systemd-run --on-calendar="*:0/2" cmd', 'timer tạm'],
    ], { fs: 13.5 }),
    sh([
      ['sshd -t · sshd -T | grep ^passwordauth', 'cú pháp · giá trị THẬT'],
      ['/etc/ssh/sshd_config.d/01-hardening.conf', 'tên xếp TRƯỚC'],
      ['systemctl daemon-reload', 'rồi…'],
      ['systemctl restart ssh.socket', '…đổi Port'],
      ['visudo -f /etc/sudoers.d/deploy', 'không bao giờ nano'],
      ['ufw allow OpenSSH && ufw enable', 'SSH trước'],
      ['fail2ban-client status sshd', 'IP đang bị cấm'],
      ['fail2ban-client set sshd unbanip IP', 'gỡ cấm'],
      ['unattended-upgrade --dry-run --debug', 'sẽ cài gì'],
      ['cat /var/run/reboot-required.pkgs', 'cần reboot?'],
      ['timedatectl · hostnamectl set-hostname', 'đồng hồ · tên máy'],
    ], { fs: 13.5 })) },

  { t: 'Thực hành Chương 11 (45 phút): một container, một máy chủ', body: `
    ${steps([
      ['Dựng container Ubuntu có systemd (<code>--privileged</code>), viết <code>myapp.service</code> chạy <code>python3 -m http.server</code>', '<code>kill -9</code> Main PID — nó tự dậy, <code>NRestarts=1</code>'],
      ['Làm hỏng có chủ đích: <code>WorkingDirectory</code> sai, <code>User</code> sai, <code>ExecStart=node</code>', 'đọc đúng ba mã 200 / 217 / 203'],
      ['Thêm drop-in hộp cát; so điểm <code>systemd-analyze security</code> trước/sau', 'điểm giảm'],
      ['Crontab ghi <code>env</code> ra file; timer <code>backup.timer</code> + <code>systemctl start backup.service</code>', 'thấy PATH của cron + một dòng journal'],
      ['<code>50-cloud-init.conf</code> (yes) + <code>99-…</code> (no) ⇒ <code>sshd -T</code>; đổi tên <code>01-</code>', 'giải thích vì sao 99- thua'],
    ])}
    ${box('good', '<b>Đạt khi:</b> có output thật cho cả 5 bước, và <code>docker rm -f</code> đã dọn container.')}` },
].map((s) => (s.kind === 'cover' ? s : { ...s, body: FIX + s.body })));
