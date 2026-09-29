/**
 * Deploy lên VPS · Deck dv-11 — Chương 11: Chẩn đoán, nghiệm thu, và bài thi phần cốt lõi.
 *
 * MỌI output terminal MỚI trên slide là output THẬT, chạy 29/09/2026:
 *   • "VPS thí nghiệm" (hợp đồng mục 7b) = container ubuntu:24.04 `dv11-vps` (arm64, nhân 7.0.12-linuxkit của Docker
 *     Desktop trên Mac M1, 10 nhân ảo), systemd 255 thật (--privileged ngắn hạn), --memory 768m, SSH từ Mac qua
 *     127.0.0.1:19112 bằng khoá tạo trong thư mục nháp. Phần mềm: nginx 1.24.0, Python 3.12.3, PostgreSQL 16.15,
 *     curl 8.5.0, OpenSSL 3.0.13, ufw. Chồng thử: nginx (80/443, chứng chỉ tự ký cho vidu.local qua /etc/hosts,
 *     proxy_read_timeout 2s) → app.py 127.0.0.1:8080 (unit ung-dung, WorkingDirectory=/srv/app/hien-tai, đọc tệp BAN
 *     MỘT lần lúc khởi động) → PostgreSQL (CSDL nt, bảng bai). Đĩa đầy dựng bằng tmpfs 40M (và nr_inodes=2000).
 *   • Mã thoát 137/134/139/1: Docker 29.8.0 trên Mac, node:22-alpine (Node v22.23.2), container nhãn dvhoc=11.
 * Output CŨ của chương (240 ms deploy, 15 phép kiểm, 88 request…) nằm nguyên trong bài học, không chép lên slide.
 *
 * Hình tự vẽ (SVG nội tuyến): cay4() cây "hỏng ở bước nào trong bốn bước" · luiSvg() lùi trước hay đi tới ·
 * tangSvg() đi từ ngoài vào với kết quả đo · vong() chu kỳ đo → giả thuyết → kiểm · pha() curl -w chia pha.
 * Tô màu: sh() cho bash; conf() (chép từ dv-03) cho nginx.conf.
 */
import { S, cover, sh, term, mindmap, diagram, cards, box, table, kpis, two, sv, R, T, A, D, esc } from './_dv-chung.mjs';

export const deck = { key: 'dv-11', code: 'DEPLOY · CHƯƠNG 11', title: 'Chẩn đoán và nghiệm thu', sub: 'Deploy lên VPS · Chương 11' };

const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15px}.c-t.sm td,.c-t.sm th{padding:6px 10px}' +
  '.d-yml .c .nu{color:#b5cea8}.d-yml .c .sx{color:#c586c0}.d-yml .c .sec{color:#ff7b72;font-weight:700}' +
  '.c-kpis .k b{font-size:40px}</style>';

/* ─────────── tô màu cấu hình: nginx.conf — chép từ dv-03 ─────────── */
const conf = (lines, { fs = 15, lang = 'nginx' } = {}) => {
  const hl = (raw) => {
    const ci = raw.search(/(^|\s)#/);
    let body = raw, tail = '';
    if (ci >= 0) { const at = raw[ci] === '#' ? ci : ci + 1; tail = `<span class="cm">${esc(raw.slice(at))}</span>`; body = raw.slice(0, at); }
    let m;
    if (lang === 'ini') {
      if ((m = body.match(/^(\s*)(\[[^\]]+\])(.*)$/))) return `${m[1]}<span class="sec">${esc(m[2])}</span>${esc(m[3])}${tail}`;
      if ((m = body.match(/^(\s*)([A-Za-z]+)(=)(.*)$/))) {
        const v = esc(m[4]).replace(/(%[a-zA-Z])/g, '<span class="sx">$1</span>')
          .replace(/(&#39;[^&]*?&#39;|'[^']*')/g, '<span class="s">$1</span>')
          .replace(/\b(\d+(?:s|ms|min)?)\b/g, '<span class="nu">$1</span>');
        return `${m[1]}<span class="k">${esc(m[2])}</span>${m[3]}${v}${tail}`;
      }
      return esc(body) + tail;
    }
    if ((m = body.match(/^(\s*)([a-z_]+)(\s.*)?$/))) {
      const rest = esc(m[3] || '').replace(/('[^']*'|"[^"]*")/g, '<span class="s">$1</span>')
        .replace(/(\d+\.\d+\.\d+\.\d+)(:\d+)?/g, '<span class="nu">$1$2</span>')
        .replace(/\b(off|on|ssl|default_server|always)\b/g, '<span class="sx">$1</span>')
        .replace(/\b(\d+s?)\b/g, '<span class="nu">$1</span>');
      return `${m[1]}<span class="k">${esc(m[2])}</span>${rest}${tail}`;
    }
    return esc(body) + tail;
  };
  return `<div class="d-yml" style="--fs:${fs}px">${lines.map((x) => {
    const [c, a] = Array.isArray(x) ? x : [x, ''];
    return `<div class="c">${hl(c) || ' '}</div><div class="a">${a ? esc(a) : ''}</div>`;
  }).join('')}</div>`;
};

/* ─────────── Slide 3: hỏng ở bước nào trong bốn bước ─────────── */
const cay4 = () => {
  let s = '';
  s += R(395, 0, 360, 56, { c: 'dv', fill: 'rgba(56,189,248,.14)', r: 28 }) + T(575, 35, '🚨 Vừa deploy xong, web hỏng', { fs: 19, b: true, a: 'middle' });
  const nh = [
    { x: 0, t: '1 · DỰNG', d: 'tạo tác có đúng?', col: 'amb', ch: 'Ch1 · Ch8', la: [
      ['build thoát 0 thật?', 'set -euo pipefail'],
      ['đúng commit chưa?', 'cat BAN · git rev-parse'],
      ['đúng nền tảng?', 'ldd · --platform'],
      ['dựng có bị OOM?', 'dmesg | grep -i oom'],
    ] },
    { x: 290, t: '2 · CHUYỂN', d: 'bytes tới đủ chưa?', col: 'blu', ch: 'Ch2', la: [
      ['tới đủ, không sai?', 'sha256sum hai đầu'],
      ['đúng thư mục?', 'ls -l ban/ · rsync -n'],
      ['bị cắt giữa chừng?', 'mã thoát (ssh 255)'],
      ['đĩa đích còn chỗ?', 'df -h; df -i'],
    ] },
    { x: 580, t: '3 · TRÁO', d: 'bản mới có đang chạy?', col: 'vio', ch: 'Ch3 · 4 · 5', la: [
      ['symlink trỏ đâu?', 'readlink -f hien-tai'],
      ['tiến trình bản nào?', 'readlink /proc/PID/cwd'],
      ['khởi động được?', 'journalctl -u app -n 20'],
      ['lược đồ khớp mã?', 'migrate status · \\d'],
    ] },
    { x: 870, t: '4 · CHỨNG MINH', d: 'người dùng thấy gì?', col: 'grn', ch: 'Ch7 · Ch9', la: [
      ['cửa trước bản nào?', 'curl -s https://…/ban'],
      ['route mới có chưa?', '401/200 có · 404 cũ'],
      ['có bộ đệm phía trước?', 'curl -sI · X-Cache'],
      ['phép kiểm từng đỏ?', 'làm hỏng có chủ đích'],
    ] },
  ];
  nh.forEach((b) => {
    s += A(575, 58, b.x + 140, 90, { c: b.col, sw: 2.5 });
    s += R(b.x, 94, 280, 64, { c: b.col, fill: `color-mix(in srgb,${D[b.col]} 16%,#0b1018)` });
    s += T(b.x + 16, 122, b.t, { fs: 19, b: true, c: b.col }) + T(b.x + 16, 146, b.d, { fs: 14, c: 'mu' });
    s += T(b.x + 266, 122, b.ch, { fs: 13, a: 'end', c: b.col });
    b.la.forEach(([q, cmd], i) => {
      const y = 176 + i * 62;
      s += `<path d="M${b.x + 12} ${y - 18} L${b.x + 12} ${y + 24} L${b.x + 22} ${y + 24}" stroke="${D[b.col]}" stroke-width="2" fill="none" opacity=".6"/>`;
      s += R(b.x + 24, y, 256, 52, { c: '#2a3441', r: 8, sw: 1.5, fill: '#0b1220' });
      s += T(b.x + 36, y + 21, q, { fs: 14.5 }) + T(b.x + 36, y + 42, cmd, { fs: 13, c: b.col, mono: true });
    });
  });
  s += T(575, 440, 'Đi TRÁI sang PHẢI: bước đầu tiên trả lời "không" là bước hỏng — bước sau chỉ là triệu chứng của nó.', { fs: 15, a: 'middle', c: 'dv' });
  return sv(1150, 452, s);
};

/* ─────────── Slide 6: đi từ ngoài vào, với kết quả đo thật ─────────── */
const tangSvg = () => {
  const L = [
    ['https://vidu.local/', 'DNS + TLS + proxy + app', '502', 'red'],
    ['http://127.0.0.1/', 'proxy + app', '502', 'red'],
    ['http://127.0.0.1:8080/', 'chỉ app', '000', 'red'],
    ["psql -c 'select 1'", 'chỉ CSDL', '1', 'grn'],
  ];
  let s = '';
  L.forEach(([u, d, ma, c], i) => {
    const y = i * 84, x = i * 26;
    s += R(x, y, 540 - x, 66, { c, fill: `color-mix(in srgb,${D[c]} 10%,#0b1018)`, r: 10 });
    s += T(x + 16, y + 28, u, { fs: 16, b: true, mono: true }) + T(x + 16, y + 52, d, { fs: 14, c: 'mu' });
    s += T(524, y + 42, ma, { fs: 24, b: true, c, a: 'end', mono: true });
    if (i < 3) s += A(x + 40, y + 66, x + 66, y + 84, { c: 'dim', sw: 2 });
  });
  s += `<path d="M556 186 L590 186 L590 290 L556 290" stroke="${D.amb}" stroke-width="2.5" fill="none"/>`;
  s += T(600, 232, 'tầng SÂU NHẤT', { fs: 15, b: true, c: 'amb' }) + T(600, 254, 'còn hỏng = app', { fs: 15, b: true, c: 'amb' });
  return sv(720, 330, s);
};

/* ─────────── Slide 7: chu kỳ đo → giả thuyết → kiểm ─────────── */
const vong = () => {
  const B = [
    [30, 20, '1 · ĐO', 'chưa sửa gì — chỉ đọc', 'blu'],
    [410, 20, '2 · GIẢ THUYẾT', 'một câu, ghi ra giấy', 'dv'],
    [790, 20, '3 · KIỂM', 'lệnh nào sẽ bác bỏ nó?', 'vio'],
    [790, 190, '4 · ĐỔI MỘT THỨ', 'rồi ĐO lại, cùng lệnh', 'amb'],
    [410, 190, '5 · XÁC NHẬN', 'từ cửa trước, như người dùng', 'grn'],
  ];
  let s = '';
  B.forEach(([x, y, t, d, c]) => {
    s += R(x, y, 320, 90, { c, fill: `color-mix(in srgb,${D[c]} 12%,#0b1018)` });
    s += T(x + 18, y + 38, t, { fs: 19, b: true, c }) + T(x + 18, y + 67, d, { fs: 15, c: 'mu' });
  });
  s += A(352, 65, 406, 65, { c: 'dv' }) + A(732, 65, 786, 65, { c: 'vio' });
  s += A(950, 112, 950, 186, { c: 'amb' }) + A(788, 235, 734, 235, { c: 'grn' });
  s += `<path d="M190 112 L190 300 L1100 300 L1100 65 L1112 65" stroke="${D.red}" stroke-width="0" fill="none"/>`;
  s += `<path d="M408 250 L190 250 L190 114" stroke="${D.red}" stroke-width="2.5" fill="none" stroke-dasharray="8 6" marker-end="url(#m-red)"/>`;
  s += T(30, 186, 'không khớp ⇒', { fs: 14.5, c: 'red', b: true }) + T(30, 206, 'quay về ĐO', { fs: 14.5, c: 'red', b: true });
  s += T(575, 318, '"Khởi động lại thử xem" nhảy thẳng tới bước 4 — và xoá bằng chứng mà bước 1 cần.', { fs: 15, a: 'middle', c: 'amb' });
  return sv(1150, 326, s);
};

/* ─────────── Slide 12: curl -w chia pha (đo thật, VPS thí nghiệm) ─────────── */
const pha = () => {
  // https://vidu.local/ — dns=0.000328 tcp=0.000540 tls=0.005415 dau=0.011160 (giây)
  const P = [[0, 0.328, 'DNS', 'blu'], [0.328, 0.540, 'TCP', 'tea'], [0.540, 5.415, 'TLS', 'vio'], [5.415, 11.160, 'máy chủ nghĩ', 'amb']];
  const x0 = 20, W = 1100, X = (ms) => x0 + (ms / 11.16) * W;
  let s = '';
  P.forEach(([a, b, t, c]) => {
    const w = Math.max(6, X(b) - X(a));
    s += `<rect x="${X(a)}" y="30" width="${w}" height="44" rx="4" fill="${D[c]}" opacity=".85"/>`;
    if (w > 120) s += T(X(a) + w / 2, 58, t, { fs: 16, b: true, a: 'middle', c: '#04111c' });
  });
  s += T(X(0.2), 100, 'DNS 0,33 ms · TCP 0,54 ms', { fs: 14, c: 'tea' });
  [[0, 'dns=0'], [0.540, 'tcp=0.54'], [5.415, 'tls=5.42'], [11.160, 'dau=11.16 ms']].forEach(([m, t], i) => {
    s += `<path d="M${X(m)} 24 L${X(m)} 80" stroke="#e6edf3" stroke-width="1.5"/>`;
    if (i) s += T(X(m), 18, t, { fs: 13.5, mono: true, a: i === 3 ? 'end' : 'middle', c: 'mu' });
  });
  return sv(1140, 110, s);
};

/* ─────────── Slide 4: lùi trước hay đi tới ─────────── */
const luiSvg = () => diagram({
  w: 1160, h: 330,
  nodes: [
    { id: 'q1', x: 0, y: 110, w: 300, h: 96, t: 'Có deploy trong', d: 'MỘT giờ vừa qua?', c: 'dv' },
    { id: 'q2', x: 420, y: 0, w: 330, h: 110, t: 'Bản TRƯỚC chạy được', d: 'với lược đồ HIỆN TẠI?\n(tầm lùi — 5.2, 6.2)', c: 'vio' },
    { id: 'lui', x: 880, y: 0, w: 280, h: 110, t: 'LÙI NGAY', d: 'symlink: 140 ms (Ch6)\nchẩn đoán SAU', c: 'grn' },
    { id: 'toi', x: 880, y: 200, w: 280, h: 110, t: 'ĐI TỚI', d: 'sửa nóng / trả cột\nlùi ở đây làm TỆ hơn', c: 'red' },
    { id: 'cd', x: 420, y: 210, w: 330, h: 100, t: 'Chẩn đoán luôn', d: '3 câu hỏi của 11.1', c: 'amb' },
  ],
  edges: [
    { from: 'q1', to: 'q2', t: 'có', c: 'vio', off: 8 },
    { from: 'q1', to: 'cd', t: 'không', c: 'amb', off: 8 },
    { from: 'q2', to: 'lui', t: 'có', c: 'grn', off: 8 },
    { from: 'q2', to: 'toi', t: 'không', c: 'red', off: 8, fs: 'b', ts: 'l' },
  ],
});

export const slides = S([
  cover({ t: 'Chương 11 — Chẩn đoán và nghiệm thu', sub: 'năm phút đầu · chữ ký của cú hỏng · sách công thức · nghiệm thu từ cửa trước · bài thi phần cốt lõi', chap: 'CHƯƠNG 11' }),

  { t: 'Bản đồ chương: hỏng ở đâu, và chứng minh đã hết', body: mindmap('Chẩn đoán', 'và nghiệm thu', [
    { t: '11.1 Năm phút đầu', d: 'bước nào trong 4 bước · lùi trước · đo → giả thuyết → kiểm', c: 'dv' },
    { t: '11.2 Chữ ký', d: 'mã × thời gian · errno 111/110 · curl -w chia pha', c: 'vio' },
    { t: '11.3 Công thức deploy', d: 'báo xong mà cũ · 404 = ảnh cũ · lệch lược đồ', c: 'blu' },
    { t: '11.4 Công thức tài nguyên', d: 'đĩa → RAM → bão hoà → CSDL · 137/134/139', c: 'amb' },
    { t: '11.5 Nghiệm thu', d: 'nghiem-thu.sh · kiem-vps.sh · bắt kiểm HỎNG', c: 'grn' },
    { t: '11.6 Bài thi', d: '10 câu Mục 0–11 · đi tiếp Ch12–15', c: 'red' },
  ]) },

  /* ═══════════ 11.1 ═══════════ */
  { t: 'Hỏng ở bước nào trong BỐN bước?', body: cay4() },

  { t: 'Lùi trước, chẩn đoán sau — trừ một ca', body: luiSvg() + kpis([
    { v: '140 ms', l: 'lùi bằng symlink (Ch6)', c: 'grn' },
    { v: '18,6 s', l: 'bản hỏng ghi 240 dòng sai (6.3)', c: 'red' },
    { v: '0', l: 'tầm lùi khi bản cũ không đọc được lược đồ mới', c: 'vio' },
  ]) },

  { t: 'Câu hỏi 1: có phải mình vừa gây ra?', body: two(
    `${sh([
      ['curl -s https://vidu.local/ban', 'người dùng thấy'],
      ['readlink -f /srv/app/hien-tai', 'symlink trỏ'],
      ['PID=$(systemctl show -p MainPID --value ung-dung)', ''],
      ['readlink /proc/$PID/cwd', 'tiến trình ĐANG chạy'],
      ['systemctl show -p ActiveEnterTimestamp ung-dung', ''],
      ['stat -c %y /srv/app/hien-tai', 'lúc đổi link'],
    ], { fs: 13.5, so: false })}
    ${box('tip', 'Tiến trình khởi động <strong>TRƯỚC</strong> lúc đổi symlink ⇒ nó chưa từng đọc bản mới. Hai mốc giờ trả lời "có phải mình" trong 5 giây.')}`,
    term([
      '$ bash ban-nao.sh',
      '! cua truoc : v1',
      'symlink   : v2',
      '! tien trinh: v1  (pid 880)',
      'khoi dong : Tue 2026-09-29 14:23:17 +07',
      'doi link  : 2026-09-29 14:23:20',
      '# sau: sudo systemctl restart ung-dung',
      '= cua truoc : v2',
      'symlink   : v2',
      '= tien trinh: v2  (pid 899)',
      'khoi dong : Tue 2026-09-29 14:23:20 +07',
    ], { title: 'VPS thí nghiệm — symlink mới, tiến trình cũ', fs: 14 }), 'l') },

  { t: 'Đi từ ngoài vào: tầng SÂU NHẤT còn hỏng', body: two(
    tangSvg(),
    `${term([
      '$ sudo systemctl stop ung-dung',
      '$ bash vao-trong.sh',
      '! https://vidu.local/      502',
      '! http://127.0.0.1/        502',
      '! http://127.0.0.1:8080/   000',
      '= psql select 1            1',
    ], { title: 'VPS thí nghiệm — app chết', fs: 14 })}
    ${box('info', 'Hai dòng 502 ở trên chỉ là <strong>triệu chứng</strong>. Tầng trong cùng còn hỏng (<code>000</code> = không ai nghe cổng 8080) là chỗ cần nhìn; CSDL trả <code>1</code> ⇒ để yên.')}`, 'l') },

  { t: 'Chu kỳ đo → giả thuyết → kiểm', body: vong() + sh([
    ['SO=~/su-co-$(date +%Y%m%d).md', 'sổ sự cố của hôm nay'],
    ['ghi() { echo "$(date +%T)  \\$ $*" >> "$SO"; "$@" 2>&1 | tee -a "$SO"; }', 'chạy + ghi lệnh + kết quả'],
    ['gt()  { echo "$(date +%T)  GIA THUYET: $*" | tee -a "$SO"; }', 'giả thuyết có giờ'],
  ], { fs: 14 }) },

  { t: 'Sổ sự cố thật: giả thuyết đúng, vẫn 502', body: two(
    term([
      '14:28:39  $ curl -s -o /dev/null -w %{http_code}\\n … https://vidu.local/',
      '! 502',
      '14:28:39  $ systemctl is-active ung-dung',
      'failed',
      '14:28:39  $ journalctl -u ung-dung -n 1 -o cat',
      "! FileNotFoundError: [Errno 2] No such file or directory: 'BAN'",
      '+ 14:28:40  GIA THUYET: ban v3 thieu tep BAN nen app thoat 1',
      '14:28:40  $ ln -sfn /srv/app/ban/v2 /srv/app/hien-tai',
      '14:28:40  $ sudo systemctl restart ung-dung',
      '! Job for ung-dung.service failed because the control process exited …',
      '14:28:40  $ curl … https://vidu.local/',
      '! 502',
      '+ 14:29:10  GIA THUYET: restart bi tu choi vi cham gioi han khoi dong …',
      '14:29:10  $ sudo systemctl reset-failed ung-dung',
      '14:29:10  $ sudo systemctl restart ung-dung',
      '14:29:11  $ curl … https://vidu.local/',
      '= 200',
    ], { title: 'cat ~/su-co-20260929.md (cắt bớt)', fs: 13 }),
    `${box('bad', 'Lùi về v2 là ĐÚNG, mà vẫn 502: <code>Restart=on-failure</code> đã tự khởi động lại 5 lần trong 1,5 giây, chạm <code>StartLimitBurst=5</code>/10 s ⇒ systemd <strong>từ chối cả lệnh restart tay</strong> ("Start request repeated too quickly").')}
    ${box('good', 'Vì đã ĐO lại sau khi đổi, dữ kiện mới lộ ra ngay ⇒ quay về bước 1, giả thuyết thứ hai, <code>reset-failed</code>, 200. Không ghi thì ta đã kết luận "lùi không ăn thua".')}`, 'l') },

  /* ═══════════ 11.2 ═══════════ */
  { t: 'Bốn cú hỏng, bốn thời gian', body: two(
    `${sh([
      ['for u in / /loi /chet /cham; do', ''],
      ["  printf '%-6s ' \"$u\"", ''],
      ["  curl -s -o /dev/null -w 'ma=%{http_code}  %{time_total}s\\n' \\", 'mã + thời gian'],
      ['    "http://127.0.0.1$u"', ''],
      ['done', ''],
    ], { fs: 14.5, so: false })}
    ${term([
      '$ bash bon-cu.sh',
      '= /      ma=200  0.005526s',
      '! /loi   ma=500  0.002317s',
      '! /chet  ma=502  0.002292s',
      '! /cham  ma=504  2.005320s',
    ], { title: 'VPS thí nghiệm — nginx 1.24, proxy_read_timeout 2s', fs: 15 })}`,
    table(['Kết quả', 'Đọc ra'], [
      ['<strong>500</strong>, vài ms', 'app NHẬN request, chạy mã, CHỌN trả lỗi — lỗi của mã bạn'],
      ['<strong>502</strong>, ~2 ms', 'kết nối bị TỪ CHỐI ngay — không ai nghe cổng upstream'],
      ['<strong>504</strong>, 2,005 s', 'ĐÚNG bằng <code>proxy_read_timeout 2s</code> — upstream nhận rồi im'],
      ['số khớp hạn giờ BẠN đặt', 'không bao giờ là trùng hợp'],
    ], { sm: true }), 'r') },

  { t: 'Mã × thời gian → tầng nào hỏng', body: table(['Chữ ký', 'Tầng', 'Lệnh xác nhận', 'Học ở'], [
    ['-<span>502 dưới vài ms</span>', 'không có tiến trình nghe / sai địa chỉ', '<code>ss -ltnp</code> — đọc cột ĐỊA CHỈ', '8.1 · 11.2'],
    ['-<span>502 sau vài giây</span>', 'upstream nhận rồi chết giữa chừng', 'log app + <code>dmesg</code> (137?)', '8.1'],
    ['-<span>504 = đúng hạn giờ</span>', 'truy vấn chậm, khoá, lời gọi ngoài', '<code>pg_stat_activity</code>, <code>pg_locks</code>', '5.3 · 11.4'],
    ['-<span>503</span>', 'nginx tự từ chối: hết upstream / limit_req', 'error.log của nginx', 'Nginx'],
    ['-<span>500 nhanh</span>', 'mã của bạn ném lỗi', 'log ứng dụng (vết ngăn xếp)', '9.3'],
    ['!404 trên route LẼ RA có', 'ảnh/bản dựng cũ, router chưa gắn', 'kiểm khói 401/200/404', '7.4'],
    ['!200 nhanh mà SAI', 'bộ đệm / tiến trình chưa khởi động lại', 'so bản phục vụ với symlink', '6.5 · 11.3'],
    ['!không có mã (000)', 'DNS · cổng · TLS', '<code>curl -w</code> chia pha', '11.2'],
  ], { sm: true }) },

  { t: 'nginx ghi rõ lời gọi hệ thống nào hỏng', body: term([
    '$ sudo tail -n 4 /var/log/nginx/error.log',
    '! … [error] 257#257: *13 connect() failed (111: Connection refused) while connecting to',
    '  upstream, client: 127.0.0.1, server: , request: "GET /chet HTTP/1.1",',
    '  upstream: "http://127.0.0.1:8099/chet", host: "127.0.0.1"',
    '! … [error] 255#255: *15 upstream timed out (110: Connection timed out) while reading',
    '  response header from upstream, client: 127.0.0.1, server: , request: "GET /cham HTTP/1.1",',
    '  upstream: "http://127.0.0.1:8080/cham", host: "127.0.0.1"',
    '… (hai dòng sau: y hệt, của lần chạy bon-cu.sh thứ hai)',
    '$ ss -ltn | grep -E ":8080|:8099|:80 |:443"',
    'LISTEN 0      5          127.0.0.1:8080       0.0.0.0:*',
    'LISTEN 0      511          0.0.0.0:80         0.0.0.0:*',
    'LISTEN 0      511          0.0.0.0:443        0.0.0.0:*',
    '# không có dòng nào cho 8099 ⇒ ca 502 là "cổng đóng", không phải "app chậm"',
  ], { title: 'VPS thí nghiệm — error.log (dòng dài đã bẻ cho vừa)', fs: 14 }) + two(
    box('bad', '<strong>111 ECONNREFUSED</strong> ở <code>connect()</code>: cổng đóng. Khởi động lại nginx là vô ích — xem app có sống, có nghe ĐÚNG địa chỉ.'),
    box('warn', '<strong>110 ETIMEDOUT</strong> khi <em>đọc header trả lời</em>: kết nối đã thành, upstream im. Đừng restart app vội — tìm cái nó đang CHỜ.')) },

  { t: 'curl -w chia một request thành từng pha', body: pha() + two(
    term([
      '$ bash pha.sh',
      '# https://vidu.local/',
      '= dns=0.000328 tcp=0.000540 tls=0.005415 dau=0.011160 ma=200',
      '# https://vidu.local/cham',
      '+ dns=0.001195 tcp=0.001413 tls=0.011144 dau=2.017190 ma=504',
      '# https://vidu.local:8443/',
      '! dns=0.000686 tcp=0.000000 tls=0.000000 dau=0.000000 ma=000',
      '  thoat=7',
      '# https://vidu-sai.local/',
      '! dns=0.000000 tcp=0.000000 tls=0.000000 dau=0.000000 ma=000',
      '  thoat=6',
      '# https://127.0.0.1/',
      '! dns=0.000020 tcp=0.000179 tls=0.000000 dau=0.000000 ma=000',
      '  thoat=60',
    ], { title: 'VPS thí nghiệm — chứng chỉ tự ký cho vidu.local', fs: 13 }),
    table(['Pha = 0', 'Dừng ở', 'curl thoát'], [
      ['<code>dns</code>', 'tên không phân giải', '6'],
      ['<code>tcp</code>', 'cổng đóng / tường lửa', '7'],
      ['<code>tls</code>', 'chứng chỉ sai tên / hết hạn', '60'],
      ['<code>dau</code> lớn', 'máy chủ đang NGHĨ — sang 11.4', '0'],
    ], { sm: true }), 'l') },

  /* ═══════════ 11.3 ═══════════ */
  { t: 'Deploy báo XONG mà chẳng có gì đổi', body: table(['Symlink', 'Tiến trình', 'Cửa trước', 'Nghĩa là', 'Làm gì'], [
    ['-cũ', 'cũ', 'cũ', 'script dừng TRƯỚC bước tráo', 'đọc nhật ký deploy: bước số mấy là cuối? (7.5)'],
    ['+mới', '-cũ', 'cũ', 'chưa khởi động lại — tiến trình không đi theo symlink', '<code>readlink /proc/PID/cwd</code>, rồi restart (đo ở 11.1)'],
    ['+mới', '+mới', '-cũ', 'bộ đệm đứng trước', '<code>curl -sI</code> tìm <code>X-Cache: HIT</code>, xoá đệm (6.5)'],
    ['—', '—', '—', 'script thoát 0 mà KHÔNG có nhật ký', 'lời hỏi không có terminal (7.3)'],
    ['+mới', '+mới', '+mới', 'bản mới THẬT đang chạy', 'lỗi nằm trong chính bản mới ⇒ lùi (11.1)'],
  ], { sm: true }) + box('tip', 'Ba cột đầu là BA lệnh: <code>readlink -f hien-tai</code> · <code>readlink /proc/$PID/cwd</code> · <code>curl -s https://…/ban</code>. Chạy cả ba TRƯỚC khi đoán.') },

  { t: 'Kiểm khói: 401 là CÓ, 404 là ảnh cũ', body: two(
    sh([
      ['hong=0', ''],
      ['for r in /health /api/v1/bai /api/v1/rieng /api/v1/lich-moi; do', ''],
      ["  ma=$(curl -s -o /dev/null -w '%{http_code}' \"https://vidu.local$r\" \\", ''],
      ['         --cacert /etc/nginx/vidu.crt)', ''],
      ['  case $ma in', ''],
      ['    200|401) echo "  ✓ $r → $ma" ;;', 'đã gắn route'],
      ['    *)       echo "  ✗ $r → $ma"; hong=1 ;;', '404 = chưa gắn'],
      ['  esac', ''],
      ['done', ''],
      ['exit $hong', 'khác 0 ⇒ script lùi'],
    ], { fs: 13.5 }),
    `${term([
      '$ bash khoi.sh; echo "thoat=$?"',
      '=   ✓ /health → 200',
      '=   ✓ /api/v1/bai → 200',
      '=   ✓ /api/v1/rieng → 401',
      '!   ✗ /api/v1/lich-moi → 404',
      'thoat=1',
    ], { title: 'VPS thí nghiệm', fs: 15 })}
    ${box('warn', '<code>/health</code> 200 KHÔNG nói route của bản mới có mặt. 02/07 của dự án thật: deploy <code>--no-build</code> chạy ảnh cũ, route GIF 404 trong khi mọi thứ khác xanh.')}`, 'l') },

  { t: '/health 200, API 500: lược đồ đã đi tiếp', body: two(
    term([
      '$ psql -d nt -Xqc "alter table bai rename column ten to tieu_de"',
      '$ for r in /health /api/v1/bai; do …; done',
      '= /health      200',
      '! /api/v1/bai  500',
      '$ journalctl -u ung-dung -n 4 -o short-iso',
      '! … python3[899]: [v2] LOI /api/v1/bai: ERROR:  column "ten" does not exist',
      '… python3[899]: LINE 1: select id, ten from bai order by id',
      '$ psql -d nt -Xc "\\d bai"',
      ' Column  |  Type   | Collation | Nullable | Default',
      '---------+---------+-----------+----------+---------',
      ' id      | integer |           | not null |',
      '+ tieu_de | text    |           |          |',
    ], { title: 'VPS thí nghiệm — PostgreSQL 16.15', fs: 13.5 }),
    `${box('info', '<code>/health</code> trả lời mà KHÔNG đụng CSDL — cố ý, để supervisor không giết app khi DB chập chờn (9.5). Nên nó <strong>không thể</strong> thấy lệch lược đồ.')}
    ${box('tip', '<strong>Hai đường ra:</strong> lùi luôn lược đồ (nếu còn đường lùi), hoặc đi tới bằng bản mã đọc được CẢ HAI tên cột — mở rộng/thu hẹp của 5.2.')}
    ${box('bad', 'ĐỪNG <code>prisma migrate resolve</code> để "cho qua" — soi câu lệnh nào đã chạy rồi mới quyết (5.4).')}`, 'l') },

  { t: '"Chẳng có gì thay đổi" gần như luôn SAI', body: cards([
    { ic: '🔐', t: 'Chứng chỉ hết hạn', d: 'không ai deploy, vẫn hỏng đúng giờ. Canh bằng <code>-checkend</code> (9.5)', c: 'amb' },
    { ic: '💽', t: 'Đĩa vượt ngưỡng', d: 'cache build 7,6 GB làm đầy đĩa của Postgres — 18/08 (Ch8)', c: 'red' },
    { ic: '⏰', t: 'Cron chạy lần đầu', d: 'việc hằng tháng, sao lưu, xoay log mở lại tệp', c: 'vio' },
    { ic: '🌐', t: 'Phía trên vừa deploy', d: 'nhà cung cấp, CDN, API bên thứ ba, DNS', c: 'blu' },
    { ic: '🧾', t: 'Dữ liệu mới', d: 'một dòng lạ đi vào nhánh mã chưa ai chạy', c: 'tea' },
    { ic: '🧍', t: 'Người khác', d: 'bạn cùng nhóm, một cron của ai đó, hai deploy chạy chồng (7.2)', c: 'grn' },
  ], 3) + box('tip', 'Khi ai đó nói "chẳng có gì đổi", họ chỉ đang nói "chẳng ai DEPLOY". Hỏi lại: <strong>cái gì đã đổi, lúc NÀO</strong> — nhật ký deploy, <code>git log</code>, sổ migration, <code>journalctl --since</code>.') },

  /* ═══════════ 11.4 ═══════════ */
  { t: 'Thứ tự kiểm: đĩa → RAM → bão hoà → CSDL', body: table(['#', 'Kiểm', 'Lệnh', 'Vì sao đứng ở đây', 'Học ở'], [
    ['1', '<strong>Đĩa</strong>', '<code>df -h; df -i</code>', 'hai dòng; đĩa đầy đẻ ra lỗi trông chẳng liên quan', '8.4'],
    ['2', '<strong>Bộ nhớ</strong>', '<code>dmesg | grep -i oom</code>', 'cú hỏng mà log ứng dụng KHÔNG thể ghi', '8.1 · 8.2'],
    ['3', '<strong>Bão hoà</strong>', '<code>vmstat 1 5</code>', 'tách CPU, swap, chờ đĩa trong một lệnh', '8.3 · 9.1'],
    ['4', '<strong>CSDL</strong>', '<code>pg_stat_activity</code>', 'chỉ sau khi đã loại trừ CÁI MÁY', '5.3 · 10.2'],
  ]) + two(
    box('warn', 'Tài nguyên CẠN thường không phải thứ HỎNG: đĩa đầy ⇒ Postgres không ghi ⇒ triệu chứng là 500 ở app. Kiểm cái máy trước khi tinh chỉnh app.'),
    box('info', 'Chẩn đoán CÁI MÁY đầy đủ (quét 60 giây, cây chết/chậm/lạ, zombie, TLS, namei…) nằm ở <strong>Linux &amp; Bash — Chương 12</strong>. Chương này chỉ giữ phần dính tới deploy.')) },

  { t: 'vmstat: dòng đầu là QUÁ KHỨ', body: term([
    '$ nproc; vmstat 1 3',
    '10',
    ' r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st gu',
    '+  0  0 515948 235740 182344 5131724   11   18   670   474 1172    1  1  0 99  0  0  0',
    ' 0  0 515948 235244 182344 5132024    0    0     0   256  923  877  1  0 99  0  0  0',
    '$ for i in $(seq 14); do timeout 12 yes >/dev/null & done; sleep 2; vmstat 1 4',
    ' r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st gu',
    '+ 16  0 515948 231788 182344 5132696   11   18   670   474 1173    1  1  0 99  0  0  0',
    '! 14  0 515948 231556 182352 5132920    0    0     0   356 5235 1536 28 72  0  0  0  0',
    '! 14  0 515948 231324 182352 5133152    0    0     0   260 5030 1538 28 72  0  0  0  0',
    '! 31  0 515948 230864 182352 5133384    0    0     0   256 3757 1108 31 69  0  0  0  0',
  ], { title: 'VPS thí nghiệm — 10 nhân, 14 vòng yes', fs: 14 }) + two(
    box('bad', 'Dòng đầu mỗi lần chạy là <strong>trung bình từ lúc khởi động</strong>: nó nói <code>id 99</code> ngay khi CPU đã bận 100%. Đọc từ dòng thứ hai.'),
    table(['Cột', 'Nói gì'], [
      ['<code>r</code> &gt; số nhân, <code>id</code> 0', 'nghẽn CPU (14–31 &gt; 10)'],
      ['<code>si</code>/<code>so</code> nhảy liên tục', 'quẫy swap (8.3)'],
      ['<code>wa</code> cao, <code>r</code> thấp', 'chờ đĩa'],
    ], { sm: true })) },

  { t: 'Đĩa đầy mà du nói 0: tệp đã xoá còn mở', body: two(
    term([
      '$ (head -c 36M /dev/zero; exec sleep 600) > app.log &',
      '$ rm /srv/log-app/app.log',
      '$ df -h /srv/log-app ; du -sh /srv/log-app',
      '! tmpfs            40M   36M  4.0M  90% /srv/log-app',
      '0	/srv/log-app',
      '$ lsof -nP +L1 | grep -E "COMMAND|deleted"',
      'COMMAND  PID   USER   FD   TYPE DEVICE SIZE/OFF NLINK NODE NAME',
      '+ sleep   1114 deploy    1w   REG  0,179 37748736     0    3 /srv/log-app/app.log (deleted)',
      '$ : > /proc/1114/fd/1',
      '= tmpfs            40M     0   40M   0% /srv/log-app',
    ], { title: 'VPS thí nghiệm — tmpfs 40M', fs: 12.5 }),
    `${box('bad', '<code>rm</code> chỉ xoá TÊN. Tiến trình còn giữ tệp mở ⇒ inode sống tiếp, <code>df</code> vẫn 90%, <code>du</code> không thấy gì để cộng.')}
    ${box('good', '<code>lsof +L1</code> = tệp có số liên kết &lt; 1 (đã xoá). Cắt cụt qua <code>/proc/PID/fd/N</code> lấy lại 36M <strong>không cần khởi động lại</strong>.')}
    ${box('tip', 'Lần sau: <code>: &gt; app.log</code> thay cho <code>rm</code>, và log xoay vòng có giới hạn (8.4).')}`, 'l2') },

  { t: 'Còn 40M trống mà ENOSPC: cạn inode', body: term([
      "$ cd /srv/tai-len; i=0; while touch anh-$i.jpg 2>/tmp/loi; do i=$((i+1)); done",
      '$ echo "tao duoc $i tep, roi: $(cat /tmp/loi)"',
      "! tao duoc 1999 tep, roi: touch: cannot touch 'anh-1999.jpg': No space left on device",
      '$ df -h /srv/tai-len ; df -i /srv/tai-len',
      '= tmpfs            40M     0   40M   0% /srv/tai-len',
      '! tmpfs            2000  2000     0  100% /srv/tai-len',
    ], { title: 'VPS thí nghiệm — tmpfs size=40m,nr_inodes=2000', fs: 14 }) + two(
    table(['df -h', 'df -i', 'du', 'Nghĩa là'], [
      ['-đầy', 'ổn', 'khớp', 'cạn KHỐI — xoá/cắt tệp lớn'],
      ['ổn', '-đầy', 'nhỏ', 'cạn INODE — xoá NHIỀU tệp nhỏ'],
      ['-đầy', 'ổn', '-không khớp', 'tệp đã xoá còn mở — <code>lsof +L1</code>'],
      ['-đầy', 'ổn', 'không có gì lớn', 'đang nằm trong 5% dự trữ root'],
    ], { sm: true }), box('warn', 'Cùng một chữ <code>No space left on device</code> cho cả bốn ca. Luôn chạy <strong>cả hai</strong> <code>df -h</code> và <code>df -i</code> — ảnh thumbnail, phiên PHP, cache npm là những thứ đẻ ra hàng triệu tệp nhỏ.'), 'l') },

  { t: 'Mã thoát kể chuyện: 137, 134, 139, 1', body: two(
    term([
      '$ docker run --name dv11-oom --memory 64m --memory-swap 64m \\',
      "    node:22-alpine node -e 'const a=[];for(;;)a.push(Buffer.alloc(1e6,1))'",
      '! thoat=137',
      '$ docker inspect -f \'OOMKilled={{.State.OOMKilled}}\' dv11-oom',
      '! OOMKilled=true',
      '$ docker run … node --max-old-space-size=32 -e …   # node là PID 1',
      'FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory',
      '! PID1: thoat=139',
      '$ docker run --init … node --max-old-space-size=32 -e …',
      '+ --init: thoat=134',
      '$ docker run … node -e "…process.exit(1)"',
      'thieu DATABASE_URL',
      'OOMKilled=false ExitCode=1',
    ], { title: 'Mac — Docker 29.8, node:22-alpine (v22.23.2)', fs: 12.5 }),
    table(['Mã', 'Nghĩa', 'Bằng chứng ở'], [
      ['<strong>137</strong>', '128+9 SIGKILL — OOM, log app RỖNG', '<code>dmesg</code>, <code>OOMKilled</code>'],
      ['<strong>134</strong>', '128+6 SIGABRT — V8 hết heap, CÓ thông báo', 'log app'],
      ['<strong>139</strong>', 'cùng cú hết heap, nhưng node là PID 1: SIGABRT bị bỏ qua ⇒ SIGSEGV', '<code>--init</code> / <code>init: true</code>'],
      ['<strong>1</strong>', 'app tự thoát — thường thiếu cấu hình', '2 dòng cuối log'],
    ], { sm: true }), 'l2') },

  /* ═══════════ 11.5 ═══════════ */
  { t: 'nghiem-thu.sh: mười hai phép kiểm từ cửa trước', body: sh([
    ['kiem() { if eval "$2" >/dev/null 2>&1; then echo "  ✓ $1"; dat=$((dat+1));', ''],
    ['         else echo "  ✗ $1"; hong=$((hong+1)); fi; }', ''],
    ["ma()  { curl \"${C[@]}\" -o /dev/null -w '%{http_code}' \"$U$1\"; }", 'chỉ mã'],
    ['hd()  { curl "${C[@]}" -o /dev/null -D - "$U$1"; }', 'chỉ header'],
    ["kiem \"1. trang chu 200 + noi dung that\" \"curl ${C[*]} $U/ | grep 'id=\\\"trang-chu\\\"'\"", 'NỘI DUNG, không chỉ mã'],
    ['kiem "4. route can dang nhap tra 401"   "[ \\$(ma /api/v1/rieng) = 401 ]"', 'route đã gắn'],
    ['kiem "6. ban cua truoc = ban symlink"   "[ \\"\\$(curl … $U/ban)\\" = \\"\\$(basename …)\\" ]"', '200 mà SAI bản'],
    ["kiem \"8. KHONG lo phien ban nginx\"      \"! hd / | grep -i '^server: nginx/'\"", 'server_tokens'],
    ['kiem "9. /loi THAT SU la 500"           "[ \\$(ma /loi) = 500 ]"', 'chốt cho phép 10'],
    ["kiem \"10. 500 KHONG lo ban/chi tiet\"    \"! hd /loi | grep -i '^x-ban' && …\"", 'handler lỗi'],
    ['kiem "11. http:// chuyen sang https://" "[ … -w \'%{http_code}\' http://… = 301 ]"', ''],
    ['kiem "12. chung chi con >= 14 ngay"     "… openssl x509 -noout -checkend \\$((14*86400))"', ''],
    ['echo "── dat $dat / hong $hong ──"; [ "$hong" -eq 0 ]', 'mã thoát = kết luận'],
  ], { fs: 13 }) + box('tip', '(Trích 8 trong 12 phép.) Phép 9 tồn tại chỉ để phép 10 không <strong>đạt miễn phí</strong>: bản đầu của bộ này từng soi một trang 404 rồi kết luận "500 không lộ gì" (bài 11.5). Chạy như bước CUỐI của script deploy — thoát khác 0 thì lùi.') },

  { t: 'Lần chạy đầu: 8/12 — bốn lỗi THẬT', body: two(
    term([
      '$ bash nghiem-thu.sh; echo "thoat=$?"',
      '=   ✓ 1. trang chu 200 + noi dung that',
      '=   ✓ 2. /health 200',
      '=   ✓ 3. API cong khai tra JSON',
      '=   ✓ 4. route can dang nhap tra 401',
      '=   ✓ 5. route khong co tra 404',
      '=   ✓ 6. ban cua truoc = ban symlink',
      '!   ✗ 7. co X-Content-Type-Options',
      '!   ✗ 8. KHONG lo phien ban nginx',
      '=   ✓ 9. /loi THAT SU la 500',
      '!   ✗ 10. 500 KHONG lo ban/chi tiet',
      '!   ✗ 11. http:// chuyen sang https://',
      '=   ✓ 12. chung chi con >= 14 ngay',
      '── dat 8 / hong 4 ──',
      'thoat=1',
      '$ curl -sD - … /loi | grep -iE "^(HTTP|x-ban)"',
      '! HTTP/1.1 500 Internal Server Error',
      '! x-ban: v2',
    ], { title: 'VPS thí nghiệm — trước khi sửa', fs: 13 }),
    `${conf([
      ['server_tokens off;', 'Server: nginx (không số)'],
      ['server {', ''],
      ['    listen 80 default_server;', ''],
      ['    return 301 https://$host$request_uri;', 'phép 11'],
      ['}', ''],
      ['server {', ''],
      ['    listen 443 ssl default_server;', ''],
      ['    add_header X-Content-Type-Options nosniff always;', 'phép 7'],
      ['    …', ''],
      ['}', ''],
    ], { fs: 13.5 })}
    ${box('good', 'Cộng bỏ <code>LO_LOI=1</code> ở handler lỗi (không trả <code>x-ban</code> và thông điệp gốc) ⇒ <strong>dat 12 / hong 0</strong>, chạy lại 3 lần vẫn 12/12.')}`, 'l') },

  { t: 'Bắt bộ kiểm HỎNG: bốn phép vẫn xanh', body: two(
    term([
      '$ sudo systemctl stop ung-dung    # cố tình làm hỏng',
      '$ bash nghiem-thu.sh; echo "thoat=$?"',
      '!   ✗ 1. trang chu 200 + noi dung that',
      '!   ✗ 2. /health 200',
      '!   ✗ 3. API cong khai tra JSON',
      '!   ✗ 4. route can dang nhap tra 401',
      '!   ✗ 5. route khong co tra 404',
      '!   ✗ 6. ban cua truoc = ban symlink',
      '+   ✓ 7. co X-Content-Type-Options',
      '+   ✓ 8. KHONG lo phien ban nginx',
      '!   ✗ 9. /loi THAT SU la 500',
      '!   ✗ 10. 500 KHONG lo ban/chi tiet',
      '+   ✓ 11. http:// chuyen sang https://',
      '+   ✓ 12. chung chi con >= 14 ngay',
      '── dat 4 / hong 8 ──',
      'thoat=1',
    ], { title: 'VPS thí nghiệm — app đã dừng', fs: 13.5 }),
    `${box('good', 'Bộ kiểm ĐỎ và thoát 1 khi app chết ⇒ nó đáng tin cho đường chính.')}
    ${box('warn', 'Phép 7, 8, 11, 12 vẫn XANH khi app đã chết: chúng chỉ kiểm <strong>nginx</strong> (<code>add_header … always</code> gắn cả vào trang 502). Chúng không sai — nhưng đừng đếm chúng là bằng chứng app sống.')}
    ${box('tip', 'Luật: mỗi phép kiểm phải được thấy ĐỎ ít nhất một lần. Phép chưa ai thấy hỏng là phép chưa ai thử (7.4, 9.4).')}`, 'l') },

  { t: 'Nghiệm thu CÁI MÁY trước khi giao', body: two(
    sh([
      ['kiem "1. SSH: tat dang nhap mat khau" \\', ''],
      ["  \"sshd -T | grep -x 'passwordauthentication no'\"", 'giá trị ĐANG hiệu lực'],
      ['kiem "3. chi 22 80 443 mo ra ngoai" \\', ''],
      ["  \"[ \\\"\\$(mo_ngoai)\\\" = '22 80 443 ' ]\"", 'ss -tlnH, bỏ 127.*'],
      ['kiem "4. tuong lua dang bat" \\', ''],
      ["  \"ufw status | grep 'Status: active'\"", ''],
      ['kiem "6. dich vu bat khi khoi dong" \\', ''],
      ['  "systemctl is-enabled -q nginx postgresql ung-dung"', 'sống sau reboot'],
      ['kiem "10. ban sao luu moi hon 26 gio" \\', ''],
      ["  \"[ -n \\\"\\$(find /srv/sao-luu -name '*.dump' -mmin -1560)\\\" ]\"", 'Ch10'],
    ], { fs: 13 }),
    `${term([
      '$ sudo bash kiem-vps.sh; echo "thoat=$?"',
      '!   ✗ 1. SSH: tat dang nhap mat khau',
      '=   ✓ 2. SSH: root khong vao bang mat khau',
      '!   ✗ 3. chi 22 80 443 mo ra ngoai',
      '!   ✗ 4. tuong lua dang bat',
      '=   ✓ 5. tu cai ban va bao mat',
      '=   ✓ 6. dich vu bat khi khoi dong',
      '=   ✓ 7. khong unit nao failed',
      '=   ✓ 8. o dia / duoi 80%',
      '=   ✓ 9. cau hinh nginx hop le',
      '!   ✗ 10. ban sao luu moi hon 26 gio',
      '+ cong mo ra ngoai: 22 80 443 5432',
      '── dat 6 / hong 4 ──',
    ], { title: 'VPS thí nghiệm — trước khi sửa', fs: 13 })}
    ${box('good', 'Sửa: drop-in <code>01-khong-mat-khau.conf</code>, Postgres về <code>localhost</code>, <code>ufw allow 22,80,443</code> + <code>enable</code>, <code>pg_dump -Fc</code> ⇒ <strong>10/10</strong>.')}`, 'r') },

  { t: 'grep -q + pipefail: bộ kiểm hỏng GIẢ 57/200', body: two(
    `${sh([
      ['set -o pipefail', ''],
      ['a=0; b=0', ''],
      ['for i in $(seq 200); do', ''],
      ['  apt-config dump | grep -q "Unattended-Upgrade \\"1\\"" || a=$((a+1))', 'thoát sớm'],
      ['  apt-config dump | grep "Unattended-Upgrade \\"1\\"" >/dev/null || b=$((b+1))', 'đọc hết'],
      ['done', ''],
    ], { fs: 13.5, so: false })}
    ${term([
      '$ apt-config dump | wc -l',
      '245',
      '$ bash chap.sh',
      '! grep -q         : hong 57 / 200',
      '= grep >/dev/null : hong 0 / 200',
    ], { title: 'VPS thí nghiệm', fs: 15 })}`,
    `${box('bad', 'Lần chạy đầu của <code>kiem-vps.sh</code> báo phép 5 "hỏng" dù máy đúng. <code>grep -q</code> thấy dòng thì <strong>thoát ngay</strong>; <code>apt-config</code> còn đang ghi thì dính SIGPIPE ⇒ ống trả khác 0 ⇒ <code>pipefail</code> kết luận "hỏng".')}
    ${box('good', 'Trong bộ kiểm có <code>pipefail</code>: bỏ <code>-q</code>, đẩy ra <code>&gt;/dev/null</code> để grep đọc HẾT đầu vào. 200/200 đúng.')}
    ${box('tip', 'Bộ kiểm chập chờn còn tệ hơn không có: nó dạy cả nhóm LỜ màu đỏ đi (26 ngày đỏ ở 9.5).')}`, 'l') },

  { t: 'Đi tiếp: bốn chương đưa ra Internet thật', body: diagram({
    w: 1160, h: 300,
    nodes: [
      { id: 'c', x: 0, y: 100, w: 230, h: 100, t: 'Mục 0 – Ch11', d: 'một máy, bốn bước\nđo, lùi, canh, chẩn đoán', c: 'dim' },
      { id: 'a', x: 330, y: 0, w: 370, h: 100, t: 'Ch12 · Tên miền → HTTPS', d: 'DNS, TTL, reverse proxy, ACME\nchỉ mở đúng cổng, CDN', c: 'blu' },
      { id: 'b', x: 330, y: 200, w: 370, h: 100, t: 'Ch13 · Container + registry + CI', d: 'Compose, build ở máy khác\nGitHub Actions, tráo không rơi', c: 'vio' },
      { id: 'd', x: 800, y: 0, w: 360, h: 100, t: 'Ch14 · Nhiều môi trường', d: 'staging, hai máy, cân bằng tải\nPaaS vs VPS, chi phí', c: 'amb' },
      { id: 'e', x: 800, y: 200, w: 360, h: 100, t: 'Ch15 · Dự án cuối khoá', d: 'đặt lịch phòng khám, 3 ngày\n+ bài thi 20 câu toàn khoá', c: 'grn' },
    ],
    edges: [
      { from: 'c', to: 'a', c: 'blu' }, { from: 'c', to: 'b', c: 'vio' },
      { from: 'a', to: 'd', c: 'amb' }, { from: 'b', to: 'e', c: 'grn' },
    ],
  }) + box('info', 'Cùng một ý đi tiếp qua bốn chương: kiểm từ cửa trước với HTTPS thật (Ch12), smoke-test sau mỗi lần tráo container (Ch13), và một checklist nghiệm thu làm tiêu chí "xong" cho dự án (Ch15). Giữ <code>nghiem-thu.sh</code>, <code>kiem-vps.sh</code> — bạn sẽ mở rộng chúng.') },

  /* ═══════════ cuối chương ═══════════ */
  { t: 'Sai lầm hay gặp khi chẩn đoán', body: table(['Việc làm', 'Vì sao hỏng', 'Làm thay bằng'], [
    ['Chẩn đoán cả tiếng khi bản mới vừa lên', 'bản hỏng vẫn đang ghi dữ liệu sai', 'lùi trước (140 ms), trừ khi lược đồ không cho'],
    ['Khởi động lại "cho chắc"', 'xoá bằng chứng; không biết cái gì đã chữa', 'đo trước, đổi MỘT thứ, ghi sổ'],
    ['Đọc tầng NGOÀI CÙNG đang hỏng', '502 ở cửa trước chỉ là triệu chứng', 'đi vào tới tầng sâu nhất còn hỏng'],
    ['Nhìn mã, bỏ qua thời gian', '502 nhanh ≠ 502 chậm; 504 = hạn giờ', '<code>-w \'%{http_code} %{time_total}\'</code>'],
    ['Tin <code>/health</code> 200', 'không đụng CSDL, không thấy route mới', 'kiểm khói 401/404 + nội dung'],
    ['<code>rm</code> tệp log lớn khi đĩa đầy', 'tệp còn mở: 0 byte được trả', '<code>: &gt; tệp</code>, <code>lsof +L1</code>'],
    ['Chỉ chạy <code>df -h</code>', 'cạn inode vẫn ENOSPC khi còn chỗ', '<code>df -h; df -i</code>'],
    ['Đọc dòng đầu của <code>vmstat</code>', 'trung bình từ lúc khởi động', 'bỏ dòng đầu'],
    ['<code>grep -q</code> trong bộ kiểm có pipefail', 'hỏng giả 57/200 lần', '<code>grep … &gt;/dev/null</code>'],
    ['Bộ nghiệm thu xanh ngay lần đầu, tin luôn', 'chưa ai thấy nó đỏ', 'cố tình làm hỏng, xem nó đỏ'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh (1/2): năm phút đầu', body: two(
    sh([
      ["curl -s -o /dev/null -w '%{http_code} %{time_total}\\n' URL", 'sập/chậm/sai?'],
      ["curl -s -o /dev/null -w 'dns=%{time_namelookup} \\", ''],
      ["  tcp=%{time_connect} tls=%{time_appconnect} \\", ''],
      ["  dau=%{time_starttransfer}\\n' URL", 'dừng ở pha nào'],
      ['readlink -f /srv/app/hien-tai', 'symlink'],
      ['readlink /proc/$PID/cwd', 'tiến trình'],
      ['curl -s https://…/ban', 'cửa trước'],
      ['ss -ltnp', 'ai nghe, ĐỊA CHỈ nào'],
      ['sudo tail -n 20 /var/log/nginx/error.log', 'errno 111/110'],
      ['journalctl -u app -n 30 --no-pager', 'log app'],
      ['systemctl reset-failed app', 'hết StartLimit'],
      ['source ghi.sh; ghi <lệnh>', 'sổ sự cố'],
    ], { fs: 13.5 }),
    table(['Thấy', 'Nghĩa là'], [
      ['502 · vài ms', 'không ai nghe cổng upstream'],
      ['504 = hạn giờ', 'upstream nhận rồi im'],
      ['500 · nhanh', 'mã của bạn ném lỗi'],
      ['404 route mới', 'ảnh/bản dựng cũ'],
      ['200 · bản cũ', 'chưa restart / bộ đệm'],
      ['curl thoát 6 / 7 / 60', 'DNS / cổng / chứng chỉ'],
      ['"Start request repeated too quickly"', '<code>reset-failed</code> rồi restart'],
    ], { sm: true }), 'l') },

  { t: 'Bảng tra nhanh (2/2): tài nguyên và nghiệm thu', body: two(
    sh([
      ['df -h; df -i', 'khối VÀ inode'],
      ['lsof -nP +L1 | grep deleted', 'đã xoá còn mở'],
      [': > /proc/PID/fd/N', 'trả chỗ, không restart'],
      ['dmesg | grep -i "killed process"', 'OOM (137)'],
      ["docker inspect -f '{{.State.OOMKilled}} {{.State.ExitCode}}' X", ''],
      ['vmstat 1 5', 'bỏ dòng đầu'],
      ['psql -c "select … from pg_stat_activity …"', 'ai chạy, ai chờ'],
      ['bash nghiem-thu.sh https://ten-mien', 'hệ thống, từ cửa trước'],
      ['sudo bash kiem-vps.sh', 'cái máy, trước khi giao'],
      ['sshd -T | grep passwordauth', 'giá trị HIỆU LỰC'],
      ["ss -tlnH | awk '$4 !~ /^127/'", 'cổng mở ra ngoài'],
    ], { fs: 13.5 }),
    table(['Mã thoát', 'Nghĩa'], [
      ['137', 'SIGKILL — OOM, log rỗng'],
      ['134', 'SIGABRT — hết heap V8, có thông báo'],
      ['139', 'hết heap khi node là PID 1 — dùng <code>--init</code>'],
      ['1', 'app tự thoát — thiếu cấu hình?'],
      ['143', 'SIGTERM — dừng bình thường (3.2)'],
      ['255 (ssh)', 'chính ssh hỏng, không phải lệnh xa'],
    ], { sm: true }), 'l') },

  { t: 'Thực hành chương 11 (45 phút, VPS thí nghiệm)', body: table(['Bước', 'Làm gì', 'Đạt khi'], [
    ['<strong>1. Dựng chồng</strong> · 10′', 'nginx 443 tự ký → <code>app.py</code> (unit, <code>WorkingDirectory=/srv/app/hien-tai</code>) → Postgres; <code>ban/v1</code>, <code>ban/v2</code>', '<code>curl https://vidu.local/</code> trả 200 + "ban v1"'],
    ['<strong>2. Bốn chữ ký</strong> · 8′', '<code>bon-cu.sh</code> + <code>pha.sh</code>; đọc <code>error.log</code>', 'nói đúng tầng của 500/502/504 và thoát 6/7/60'],
    ['<strong>3. Bản nào?</strong> · 7′', 'đổi symlink sang v2 KHÔNG restart; <code>ban-nao.sh</code>', 'thấy "tiến trình: v1" và giải thích bằng hai mốc giờ'],
    ['<strong>4. Sự cố có sổ</strong> · 10′', 'v3 thiếu tệp <code>BAN</code>; xử lý bằng <code>ghi</code>/<code>gt</code>', 'sổ có ≥ 2 giả thuyết, kết thúc bằng 200'],
    ['<strong>5. Nghiệm thu</strong> · 10′', '<code>nghiem-thu.sh</code> + <code>kiem-vps.sh</code>; sửa; dừng app thử', '12/12 và 10/10; thấy nó ĐỎ khi app chết'],
  ], { sm: true }) + two(
    box('info', '<strong>VPS thí nghiệm:</strong> container <code>dv11-vps</code> (Ubuntu 24.04 + systemd + sshd + nginx + PostgreSQL), SSH qua <code>127.0.0.1:19112</code> — lệnh dựng ở 🧪 bài 11.1. Xong: <code>docker rm -f dv11-vps</code>.'),
    box('warn', 'Mọi thứ trong container của BẠN. Đừng chạy <code>nghiem-thu.sh</code> dồn dập vào tên miền thật của người khác, và đừng <code>ufw enable</code> trên VPS thật khi chưa <code>allow 22</code>.')) },
].map((s) => (s.kind === 'cover' ? s : { ...s, body: FIX + s.body })));
