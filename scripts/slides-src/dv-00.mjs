/**
 * Deploy lên VPS · Deck dv-00 — Mục 0: Một lần deploy thật ra là cái gì (+ hai bài "Bắt đầu tại đây").
 *
 * MỌI output terminal MỚI trên slide là output THẬT, chạy 29/09/2026:
 *   • "VPS thí nghiệm" = container ubuntu:24.04 (arm64, OpenSSH 9.6p1, rsync 3.2.7, coreutils 9.4, node 18.19,
 *     strace 6.8) tên dv00-vps, SSH vào từ Mac qua 127.0.0.1:19002 bằng khoá sinh trong thư mục nháp.
 *     "Sân tập dựng lại" = container dv00-lab (ubuntu:24.04 + openssh-server) cổng 19003, ảnh chụp dv00-lab-sach.
 *     So sánh ln: ubuntu:22.04 (coreutils 8.32) và alpine:3.20 (BusyBox 1.36.1), container chạy một lần.
 *   • "Mac" = Mac M1, macOS 27, OpenSSH của Apple, openrsync (protocol 29), curl 8.7.1, dig 9.10.6.
 *   Số liệu CŨ của bài 0.1–0.4 (byte rsync/git, 94 ms → 3.070 ms, 4,8 ms → 590 ms…) lấy nguyên từ bài, không đo lại.
 *   Mốc lịch sử / sự cố: đối chiếu nguồn 29/09/2026 (SEC, GitLab, Cloudflare, Meta Engineering, CrowdStrike, Wikipedia),
 *   link-card nằm trong bài 0.5 / 0.6.
 *
 * Hình tự vẽ (SVG nội tuyến): dongThoiGian() 1985 → 2020 · lotrinh() 16 phần · knight() tám máy SMARS ·
 * bigBang() đẩy toàn cầu một lần so với từng bậc · reqChart() request rơi khi tráo · pkillSvg() pkill tự khớp shell.
 */
import { S, cover, sh, yaml, term, mindmap, diagram, cards, box, steps, table, two, tree, bars, sv, R, T, A, D, esc } from './_dv-chung.mjs';

export const deck = { key: 'dv-00', code: 'DEPLOY · MỤC 0', title: 'Một lần deploy thật ra là cái gì', sub: 'Deploy lên VPS · Mục 0' };

const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15.5px}.c-t.sm td,.c-t.sm th{padding:6px 10px}.c-card p{font-size:15.5px}.c-card b{font-size:19px}</style>';
const P = (t) => `<p style="font-size:15px;color:${D.mu};margin-top:8px;text-align:center">${t}</p>`;
const BG = '#0b1220';
const box1 = (x, y, w, h, t, d, c, { fs = 16, fs2 = 14, mono = false } = {}) =>
  R(x, y, w, h, { c, fill: BG, r: 10 }) + T(x + w / 2, y + (d ? h / 2 - 4 : h / 2 + 6), t, { fs, b: true, a: 'middle', mono }) +
  (d ? T(x + w / 2, y + h / 2 + 18, d, { fs: fs2, a: 'middle', c: 'mu' }) : '');

/* Slide 6 — ba mươi lăm năm deploy trong một hình */
const dongThoiGian = () => {
  const M = [
    ['1985', 'FTP', 'RFC 959: kéo thả tệp', 'amb'],
    ['1996', 'cPanel', 'shared hosting có giao diện', 'amb'],
    ['1999', 'VMware', 'ảo hoá x86 dùng được', 'blu'],
    ['2003', 'Xen · Linode', 'VPS ra đời', 'blu'],
    ['2005', 'SwitchTower', '→ Capistrano 2006', 'vio'],
    ['2006', 'Amazon EC2', 'thuê máy theo giờ', 'blu'],
    ['2007', 'KVM · Heroku', 'KVM vào nhân 2.6.20', 'vio'],
    ['2011', 'DigitalOcean', 'Twelve-Factor App', 'vio'],
    ['2013', 'Docker', 'tạo tác = ảnh', 'grn'],
    ['2014', 'Kubernetes', 'Lambda · Netlify', 'grn'],
    ['2015', "Let's Encrypt", 'HTTPS miễn phí (beta)', 'tea'],
    ['2019', 'GitHub Actions', 'CI/CD chính thức', 'grn'],
    ['2020', 'Vercel', 'đổi tên từ ZEIT', 'tea'],
  ];
  // 4 làn: trên-xa, dưới-gần, trên-gần, dưới-xa ⇒ hai hộp cùng làn cách nhau 4 mốc, không chồng.
  const x0 = 105, dx = (1065 - 105) / (M.length - 1), ay = 232, BW = 200, BH = 76;
  let s = `<path d="M20 ${ay} L1150 ${ay}" stroke="${D.dim}" stroke-width="3"/>`;
  M.forEach(([y, t, d, c], i) => {
    const x = x0 + i * dx, lane = i % 4, up = lane === 0 || lane === 2, far = lane === 0 || lane === 3;
    s += `<circle cx="${x}" cy="${ay}" r="8" fill="${D[c]}"/>`;
    const gap = far ? 118 : 22;
    const by = up ? ay - gap - BH : ay + gap;
    s += `<path d="M${x} ${ay + (up ? -8 : 8)} L${x} ${up ? by + BH : by}" stroke="${D[c]}" stroke-width="2"/>`;
    s += R(x - BW / 2, by, BW, BH, { c, fill: BG, r: 10, sw: 2 });
    s += T(x, by + 23, `${y} · ${t}`, { fs: `${y} · ${t}`.length > 22 ? 14 : 15.5, b: true, a: 'middle', c });
    s += T(x, by + 50, d, { fs: 14, a: 'middle', c: 'mu' });
  });
  const lg = [['amb', 'tệp + hosting'], ['blu', 'ảo hoá / VPS'], ['vio', 'tự động hoá'], ['grn', 'container / CI'], ['tea', 'nền tảng']];
  lg.forEach(([c, t], i) => { s += `<circle cx="${250 + i * 170}" cy="478" r="7" fill="${D[c]}"/>` + T(262 + i * 170, 484, t, { fs: 15, c: 'mu' }); });
  return sv(1170, 492, s);
};

/* Slide 9 — lộ trình 16 phần, bốn cung */
const lotrinh = () => {
  const cung = [
    ['Cung 1 · hiểu và làm tay', 'blu', [['0', 'Deploy là gì'], ['1', 'Tạo tác'], ['2', 'Vận chuyển'], ['3', 'Bước tráo']]],
    ['Cung 2 · cái hay làm sập', 'vio', [['4', 'Cấu hình & bí mật'], ['5', 'Migration'], ['6', 'Lùi bản'], ['7', 'Script deploy']]],
    ['Cung 3 · giữ nó sống', 'amb', [['8', 'Máy nhỏ: RAM, OOM, đĩa'], ['9', 'Giám sát'], ['10', 'Sao lưu & phục hồi'], ['11', 'Chẩn đoán + thi']]],
    ['Cung 4 · mới 09/2026', 'grn', [['12', 'Tên miền → HTTPS'], ['13', 'Container, registry, CI'], ['14', 'Nhiều môi trường & máy'], ['15', 'Dự án cuối khoá']]],
  ];
  let s = '';
  cung.forEach(([t, c, ps], i) => {
    const x = i * 292;
    s += T(x + 138, 22, t, { fs: 16, b: true, a: 'middle', c });
    ps.forEach(([n, d], j) => {
      const y = 38 + j * 92;
      s += R(x, y, 276, 78, { c, fill: BG, r: 10, sw: 2 });
      s += `<circle cx="${x + 36}" cy="${y + 39}" r="21" fill="${D[c]}"/>` + T(x + 36, y + 46, n, { fs: 18, b: true, a: 'middle', c: '#0b1220' });
      s += T(x + 68, y + 45, d, { fs: d.length > 20 ? 14.5 : 16.5, b: true });
    });
    if (i < 3) s += A(x + 278, 190, x + 290, 190, { c: 'dim', sw: 2 });
  });
  return sv(1160, 410, s);
};

/* Slide 10 — Knight Capital: tám máy SMARS, một máy thiếu mã mới */
const knight = () => {
  let s = T(290, 22, 'Tám máy chủ SMARS sau lần deploy', { fs: 16, b: true, a: 'middle', c: 'mu' });
  for (let i = 0; i < 8; i++) {
    const x = (i % 4) * 146, y = 40 + Math.floor(i / 4) * 128, bad = i === 7;
    s += R(x, y, 128, 108, { c: bad ? 'red' : 'grn', fill: bad ? 'rgba(255,92,108,.12)' : BG, r: 10 });
    s += T(x + 64, y + 30, `máy ${i + 1}`, { fs: 16, b: true, a: 'middle' });
    s += T(x + 64, y + 58, bad ? 'mã CŨ' : 'mã mới', { fs: 16, a: 'middle', c: bad ? 'red' : 'grn', b: true });
    s += T(x + 64, y + 84, bad ? 'cờ cũ bật lại' : 'đúng', { fs: 14, a: 'middle', c: 'mu' });
  }
  s += T(290, 316, 'kỹ thuật viên chép tay mã mới — bỏ sót máy thứ 8', { fs: 15, a: 'middle', c: 'red' });
  s += T(290, 340, 'không ai rà lại, không có quy trình deploy viết thành văn', { fs: 14, a: 'middle', c: 'mu' });
  return sv(590, 350, s);
};

/* Slide 12 — đẩy toàn cầu một lần so với từng bậc */
const bigBang = () => {
  let s = '';
  s += T(0, 24, 'Đẩy MỘT LẦN ra toàn bộ', { fs: 17, b: true, c: 'red' });
  s += R(0, 40, 540, 60, { c: 'red', fill: 'rgba(255,92,108,.14)', r: 10 }) + T(270, 77, '100% máy nhận bản mới cùng lúc', { fs: 16, a: 'middle', b: true });
  s += T(0, 128, 'Cloudflare 02/07/2019: 13:42 đẩy luật WAF → sập 27 phút', { fs: 15, c: 'mu' });
  s += T(0, 152, 'CrowdStrike 19/07/2024: 04:09 đẩy → 05:27 gỡ, ~8,5 triệu máy', { fs: 15, c: 'mu' });
  s += T(620, 24, 'Đẩy TỪNG BẬC (canary)', { fs: 17, b: true, c: 'grn' });
  const st = [['1%', 80], ['10%', 110], ['50%', 150], ['100%', 190]];
  let x = 620;
  st.forEach(([p, w], i) => {
    s += R(x, 40, w - 10, 60, { c: i === 0 ? 'amb' : 'grn', fill: BG, r: 10 }) + T(x + (w - 10) / 2, 77, p, { fs: 16, a: 'middle', b: true });
    if (i < 3) s += A(x + w - 10, 70, x + w - 1, 70, { c: 'dim', sw: 2 });
    x += w;
  });
  s += T(620, 128, 'bậc đầu hỏng ⇒ dừng, lùi bản — 99% chưa từng thấy', { fs: 15, c: 'mu' });
  s += T(620, 152, 'giữa hai bậc: kiểm lỗi, đợi, rồi mới đi tiếp', { fs: 15, c: 'mu' });
  return sv(1170, 165, s);
};

/* Slide 21 — request rơi khi tráo: 94 ms so với 3.070 ms */
const reqChart = () => {
  const x0 = 150, pxms = 0.24; // 4000 ms → 960 px
  let s = '';
  const row = (y, lbl, sub, fails, gap) => {
    s += T(0, y + 6, lbl, { fs: 16, b: true }) + T(0, y + 28, sub, { fs: 14, c: 'mu' });
    for (let t = 0; t < 4000; t += 50) {
      const x = x0 + t * pxms;
      const inGap = t >= 800 && t < 800 + gap;
      if (inGap) continue;
      s += `<circle cx="${x.toFixed(1)}" cy="${y}" r="4" fill="${D.grn}"/>`;
    }
    for (let k = 0; k < fails; k++) {
      const t = 800 + (fails === 1 ? 0 : (k * gap) / fails);
      s += `<circle cx="${(x0 + t * pxms).toFixed(1)}" cy="${y}" r="5" fill="${D.red}"/>`;
    }
    s += `<path d="M${x0 + 800 * pxms} ${y - 22} L${x0 + 800 * pxms} ${y + 22}" stroke="${D.amb}" stroke-width="2" stroke-dasharray="4 4"/>`;
  };
  row(60, 'Khởi động ~0 s', '1 request rơi', 1, 94);
  s += T(x0 + 800 * pxms + 40, 40, '200 lại sau +94 ms', { fs: 15, c: 'grn', b: true });
  row(190, 'Khởi động 3 s', '49 request rơi', 49, 3070);
  s += T(x0 + 800 * pxms + 360, 168, 'gián đoạn 2.983 ms · 200 lại sau +3.070 ms', { fs: 15, c: 'red', b: true, a: 'middle' });
  s += T(x0 + 800 * pxms, 262, '▲ kill bản cũ', { fs: 15, c: 'amb', a: 'middle' });
  s += `<path d="M${x0} 290 L${x0 + 960} 290" stroke="${D.dim}" stroke-width="2"/>`;
  [0, 1000, 2000, 3000, 4000].forEach((t) => { s += T(x0 + t * pxms, 312, `${t} ms`, { fs: 14, c: 'mu', a: 'middle' }); });
  s += `<circle cx="${x0}" cy="340" r="5" fill="${D.grn}"/>` + T(x0 + 12, 345, 'phép đo /health mỗi 50 ms trả 200', { fs: 14.5, c: 'mu' });
  s += `<circle cx="${x0 + 390}" cy="340" r="5" fill="${D.red}"/>` + T(x0 + 402, 345, 'phép đo hỏng (không ai nghe cổng)', { fs: 14.5, c: 'mu' });
  return sv(1160, 355, s);
};

/* Slide 29 — pkill -f khớp cả chính cái shell đang chạy lệnh deploy */
const pkillSvg = () => {
  let s = '';
  s += T(0, 22, 'Tiến trình trên VPS lúc pkill -f "node src/server.js" chạy', { fs: 16, b: true, c: 'mu' });
  s += R(0, 38, 1150, 62, { c: 'red', fill: 'rgba(255,92,108,.10)', r: 10 });
  s += T(18, 64, 'PID 1037  bash -c cd ~/app && tar xzf … && pkill -f "node src/server.js"; sleep 0.3; setsid nohup node …', { fs: 14.5, mono: true });
  s += T(18, 88, '↑ chính cái shell ssh mở ra để chạy lệnh deploy — dòng lệnh của nó CHỨA chuỗi cần tìm ⇒ bị giết', { fs: 14.5, c: 'red' });
  s += R(0, 112, 1150, 62, { c: 'amb', fill: BG, r: 10 });
  s += T(18, 138, 'PID 991   node src/server.js', { fs: 14.5, mono: true });
  s += T(18, 162, '↑ bản cũ — thứ bạn THẬT SỰ muốn dừng', { fs: 14.5, c: 'amb' });
  return sv(1160, 180, s);
};

export const slides = S([
  cover({ t: 'Mục 0 — Một lần deploy thật ra là cái gì', sub: 'deploy là gì · 35 năm lịch sử · sự cố thật · bốn bước · cái máy nhận · deploy bằng tay · thứ còn thiếu', chap: 'MỤC 0' }),

  { t: 'Bản đồ Mục 0: sáu bài, đi từ “là gì” tới “đo”', body: mindmap('Mục 0', 'deploy thật ra là cái gì', [
    { t: 'Bắt đầu (1/2)', d: 'deploy · VPS · tên miền · 7 chỗ chạy web · lịch sử · lợi ích', c: 'dv' },
    { t: 'Bắt đầu (2/2)', d: 'Knight · GitLab · Cloudflare · Facebook · CrowdStrike · học không sợ', c: 'red' },
    { t: '0.1 Bốn bước', d: 'tạo tác · vận chuyển · tráo · kiểm — đo bằng byte và ms', c: 'amb' },
    { t: '0.2 Cái máy nhận', d: 'sshd -T · chỉ khoá · khoá chỉ-deploy · ControlMaster · quyền', c: 'vio' },
    { t: '0.3 Deploy bằng tay', d: 'bốn lệnh · bốn mức kiểm · pkill tự giết · health', c: 'grn' },
    { t: '0.4 Chưa giải quyết', d: 'lùi bản bằng symlink · ln có nguyên tử? · 16 phần', c: 'tea' },
  ]) },

  /* ───────── Bắt đầu tại đây (1/2) — slide 3–9 ───────── */
  { t: 'Deploy giống dọn nhà sang căn hộ thuê', body: diagram({
    w: 1160, h: 400,
    nodes: [
      { id: 'may', x: 0, y: 30, w: 230, h: 100, ic: '💻', t: 'Máy của bạn', d: 'phòng trọ: đồ đạc = mã nguồn\nchỉ bạn vào được', c: 'blu' },
      { id: 'thung', x: 310, y: 30, w: 230, h: 100, ic: '📦', t: 'Tạo tác (artifact)', d: 'thùng đồ đã đóng, dán nhãn\nđúng thứ sẽ mang đi', c: 'vio' },
      { id: 'xe', x: 620, y: 30, w: 210, h: 100, ic: '🚚', t: 'Vận chuyển', d: 'rsync · git · docker pull', c: 'amb' },
      { id: 'vps', x: 920, y: 30, w: 240, h: 100, ic: '🏢', t: 'VPS', d: 'căn hộ thuê: mở cửa 24/7\nai cũng ghé được', c: 'dv' },
      { id: 'ten', x: 920, y: 250, w: 240, h: 100, ic: '🪧', t: 'Tên miền', d: 'địa chỉ dễ nhớ\nDNS đổi tên → số nhà (IP)', c: 'tea' },
      { id: 'khach', x: 480, y: 250, w: 280, h: 100, ic: '🧑‍🤝‍🧑', t: 'Người dùng', d: 'khách tới chơi — không bao giờ\nvào phòng trọ của bạn', c: 'grn' },
    ],
    edges: [
      { from: 'may', to: 'thung', t: 'gói' }, { from: 'thung', to: 'xe', t: 'chở' }, { from: 'xe', to: 'vps', t: 'tráo' },
      { from: 'khach', to: 'ten', t: 'gõ tên', off: 8 }, { from: 'ten', to: 'vps', t: 'ra IP' },
    ],
  }) + P('Deploy = đưa bản mới của phần mềm từ máy bạn lên một máy luôn bật, để người khác dùng được — và chứng minh nó chạy.') },

  { t: 'Một request thật đi qua tên miền, IP, máy chủ', body: two(
    term([
      '$ dig example.com A +noall +answer',
      '= example.com.  7  IN  A  104.20.23.154',
      '= example.com.  7  IN  A  172.66.147.243',
      '$ curl -sI https://example.com | head -4',
      '= HTTP/2 200',
      'date: Tue, 29 Sep 2026 01:07:25 GMT',
      'content-type: text/html; charset=utf-8',
      '+ server: cloudflare',
      "$ curl -s -o /dev/null -w 'dns %{…}s | …' https://example.com",
      'dns 0.003685s | tcp 0.038726s | tls 0.099313s',
      '= tong 0.140719s | ma 200 | ip 104.20.23.154',
    ], { title: 'Mac — zsh', fs: 14.5 }),
    steps([
      ['<strong>Tên miền → IP</strong>', 'DNS trả “số nhà”: 104.20.23.154 (TTL 7 giây)'],
      ['<strong>Kết nối TCP + TLS</strong>', 'bắt tay mất ~99 ms trên mạng trường'],
      ['<strong>Máy chủ trả lời</strong>', '<code>HTTP/2 200</code> — header <code>server</code> nói ai đứng trước'],
      ['<strong>Deploy của BẠN</strong> nằm ở bước 3', 'ba bước kia hỏng thì web vẫn “sập” trong mắt người dùng'],
    ])) + FIX },

  { t: 'Bảy chỗ chạy web: càng cao càng ít việc, ít quyền', body: table(
    ['Kiểu', 'BẠN quản', 'HỌ quản', 'Giá khởi điểm (09/2026)', 'Hợp khi'],
    [
      ['Shared hosting', 'tệp PHP/HTML', 'máy, web server, PHP', 'rẻ nhất, chung máy', 'blog, web tĩnh cũ'],
      ['!VPS', '!hệ điều hành trở lên: mọi thứ', '!phần cứng, mạng', '!DigitalOcean $4 · Hetzner €5,49', '!học deploy, đồ án, web nhỏ'],
      ['Máy chủ riêng', 'cả máy vật lý (trừ điện, mạng)', 'trung tâm dữ liệu', 'cao nhất', 'tải lớn, đều'],
      ['Cloud IaaS (EC2)', 'như VPS + mạng, IAM', 'phần cứng, API', 'tính theo giờ', 'cần co giãn, dịch vụ AWS'],
      ['PaaS (Heroku, Render, Vercel)', 'mã + cấu hình', 'máy, OS, build, tráo', 'Vercel Hobby $0 · Render free 512 MB', 'demo nhanh, frontend'],
      ['Serverless (Lambda)', 'từng hàm', 'mọi thứ khác', '1 triệu request/tháng miễn phí', 'việc lẻ, theo sự kiện'],
      ['Kubernetes', 'manifest, cụm (nếu tự dựng)', '(bản managed) mặt điều khiển', 'đắt, phức tạp', 'nhiều dịch vụ, nhiều máy'],
    ], { sm: true }) + P('Giá kiểm trên trang chính thức 29/09/2026 — thay đổi thường xuyên. Khoá này ở hàng VPS: thấy được mọi bước. Chương 14 so sánh lại.') + FIX },

  { t: 'Ba mươi lăm năm deploy trong một hình', body: dongThoiGian() },

  { t: 'Mỗi bước tiến lịch sử bỏ đi một việc làm tay', body: cards([
    { ic: '📂', t: 'FTP lên hosting', d: 'kéo thả từng tệp. Không có “bản” nào — đang chép dở thì web chạy nửa cũ nửa mới.', c: 'amb' },
    { ic: '📜', t: 'Script (Capistrano)', d: '<strong>releases/ + current</strong>: mỗi bản một thư mục, lùi bản = đổi một liên kết.', c: 'vio' },
    { ic: '🚀', t: 'git push (Heroku)', d: 'đẩy mã là nền tảng tự dựng + tráo. Đổi lại: bạn không thấy máy.', c: 'pnk' },
    { ic: '🐳', t: 'Ảnh container', d: 'tạo tác = <strong>ảnh</strong> chứa cả thư viện hệ thống. “Máy tôi chạy được” bớt đi.', c: 'grn' },
    { ic: '🔁', t: 'CI/CD (Actions)', d: 'máy của người khác dựng, kiểm, đẩy. Script vẫn là script — chỉ chạy ở chỗ khác.', c: 'blu' },
  ], 5) + box('tip', 'Bốn bước <strong>tạo tác → vận chuyển → tráo → kiểm</strong> không đổi suốt 35 năm. Công cụ mới chỉ tự động hoá một bước, và giấu nó đi.') + FIX },

  { t: 'Code chỉ có giá trị khi người khác dùng được', body: cards([
    { ic: '🎓', t: 'Đồ án nhóm', d: 'hội đồng bấm một <strong>link thật</strong>, không xem video quay màn hình. Không còn “trên máy em chạy mà”.', c: 'blu' },
    { ic: '📄', t: 'CV', d: 'một sản phẩm <strong>đang chạy</strong> có tên miền, HTTPS, và bạn kể được nó đã hỏng thế nào.', c: 'grn' },
    { ic: '💬', t: 'Phỏng vấn', d: '“Deploy thế nào? Lùi bản ra sao? Migration chạy lúc nào? Hết đĩa thì làm gì?” — câu hỏi rất hay gặp.', c: 'amb' },
    { ic: '🛠', t: 'Công việc', d: 'backend, DevOps, SRE đều deploy hằng ngày. Người hiểu bốn bước là người được gọi lúc 2 giờ sáng — và gỡ được.', c: 'vio' },
  ], 4) + FIX },

  { t: 'Lộ trình khoá: 16 phần, bốn cung', body: lotrinh() + P('Mục 0–11 có từ trước; Chương 12–15 thêm tháng 9/2026 — đưa web ra Internet, deploy bằng container + CI, nhiều môi trường, dự án cuối khoá.') },

  /* ───────── Bắt đầu tại đây (2/2) — slide 10–16 ───────── */
  { t: 'Knight Capital 2012: bảy máy đúng, một máy sai', body: two(knight(), cards([
    { big: '~45 phút', t: 'từ 9:30 sáng 01/08/2012', d: '4 triệu lệnh khớp, 154 mã cổ phiếu', c: 'red' },
    { big: '> 460 tr USD', t: 'lỗ (theo SEC)', d: 'phạt thêm 12 triệu USD năm 2013', c: 'amb' },
    { ic: '🧭', t: 'Nguyên tắc bị thiếu', d: 'deploy bằng script giống hệt trên mọi máy · kiểm TỪNG máy sau deploy · có nút dừng', c: 'grn' },
  ], 1)) + FIX },

  { t: 'Bốn sự cố lớn, mỗi cái một bài học deploy', body: cards([
    { ic: '🗄', t: 'GitLab · 31/01/2017', d: 'xoá nhầm ~300 GB dữ liệu DB chính. Nhiều lớp sao lưu, lúc cần không lớp nào dùng ngay được ⇒ mất ~6 giờ dữ liệu. <strong>Bài học: phục hồi thử định kỳ.</strong> → Ch10', c: 'red' },
    { ic: '🧮', t: 'Cloudflare · 02/07/2019', d: 'một biểu thức chính quy trong luật WAF ăn 100% CPU. Đẩy toàn cầu một lần ⇒ sập 27 phút. <strong>Bài học: đẩy từng bậc.</strong> → Ch3, Ch14', c: 'amb' },
    { ic: '🌐', t: 'Facebook · 04/10/2021', d: 'lệnh bảo trì cắt cả mạng xương sống; công cụ kiểm có lỗi nên không chặn. ~6–7 giờ. <strong>Bài học: bộ kiểm cũng phải được kiểm.</strong> → Ch7', c: 'vio' },
    { ic: '🖥', t: 'CrowdStrike · 19/07/2024', d: 'bản cập nhật cấu hình đẩy tới mọi máy cùng lúc; ~8,5 triệu máy Windows sập. <strong>Bài học: canary + lùi bản nhanh.</strong> → Ch6, Ch14', c: 'blu' },
  ], 2) + FIX },

  { t: 'Cùng một kiểu hỏng: đẩy ra tất cả cùng lúc', body: bigBang() + box('warn', 'Canary (con chim hoàng yến trong mỏ than) = cho MỘT phần nhỏ người dùng nhận bản mới trước. Máy nhỏ của bạn cũng làm được: một máy, hai bản chạy song song, chuyển dần — Chương 3 và 14.') + FIX },

  { t: 'Sự cố thật của một dự án sinh viên', body: table(['Ngày', 'Chuyện gì', 'Vì sao “deploy thành công”', 'Chương'], [
    ['02/07', 'route mới 404', 'deploy <code>--no-build</code> chỉ chép tệp, container chạy ảnh CŨ', 'Ch2, Ch7'],
    ['03/07', 'feed trả 500', 'hai workflow deploy đua nhau, schema lệch ảnh', 'Ch5, Ch13'],
    ['06/07', '<code>Exited(137)</code>', 'hai lần tráo container chạy chồng', 'Ch3, Ch7'],
    ['18/08', 'đĩa đầy giữa lúc build', 'cache build 7,6 GB trên đĩa của Postgres', 'Ch8'],
    ['18/08', '502 bảy phút', 'nhầm Dockerfile: Alpine (musl) + Prisma (glibc) — build xanh, tráo xanh', 'Ch1, Ch13'],
    ['23–25/08', 'sửa nginx không ăn', 'nginx.conf là bind-mount, rồi <code>mv</code> đổi inode', 'Ch4, Ch13'],
  ], { sm: true }) + P('Mọi dòng ở đây là một lần script báo XANH. Đó là lý do khoá này ám ảnh bước 4 — kiểm bằng request thật.') + FIX },

  { t: 'Vì sao người mới sợ deploy — và cách chữa', body: cards([
    { ic: '💥', t: 'Sợ làm sập thứ thật', d: 'Chữa: tập trên <strong>VPS thí nghiệm</strong> — container dựng lại trong 1,6 giây. Phá thoải mái.', c: 'red' },
    { ic: '🔍', t: 'Lỗi mơ hồ', d: 'Chữa: bốn câu hỏi cố định — tiến trình? cổng? log? request? Hỏi theo thứ tự, không đoán.', c: 'amb' },
    { ic: '🧩', t: 'Quá nhiều mảnh', d: 'Chữa: bốn bước. Mỗi lỗi thuộc đúng MỘT bước — gọi tên bước trước khi sửa.', c: 'vio' },
    { ic: '❓', t: 'Không biết xong chưa', d: 'Chữa: “xong” = một tuyến thật trả đúng mã. Không phải script thoát 0.', c: 'grn' },
  ], 2) + FIX },

  { t: 'Deploy hỏng: hỏi bốn câu, theo thứ tự', body: two(
    term([
      '$ curl -sS http://127.0.0.1:3000/health',
      "! curl: (7) Failed to connect to 127.0.0.1 port 3000 after 0 ms: Couldn't connect to server",
      '$ pgrep -af "^node"',
      '# (không in gì — mã thoát 1)',
      '$ ss -tlnp | grep :3000',
      '# (không in gì — mã thoát 1)',
      '$ tail -n 3 ~/app.log',
      '! [khoi dong] LOI: thieu bien DATABASE_URL — dung lai',
    ], { title: 'VPS thí nghiệm — deploy@dv00-vps', fs: 14.5 }),
    steps([
      ['<strong>Request</strong> trả gì?', '<code>000</code>/(7) = không ai nghe · 5xx = app trả lỗi'],
      ['<strong>Tiến trình</strong> còn không?', 'không ⇒ nó đã chết — đọc log'],
      ['<strong>Cổng</strong> có ai nghe?', 'không ⇒ chưa lên / nghe nhầm cổng'],
      ['<strong>Log</strong> nói gì?', 'dòng CUỐI thường là câu trả lời'],
    ])) + FIX },

  { t: 'Sân tập an toàn: một “VPS” dựng lại trong 1,6 giây', body: two(
    sh([
      ['ssh-keygen -t ed25519 -N "" -f ./khoa', 'khoá riêng cho sân tập'],
      ['docker run -d --name lab-vps \\', ''],
      ['  -p 127.0.0.1:2222:22 ubuntu:24.04 sleep infinity', 'chỉ nghe localhost'],
      ['docker exec lab-vps bash -c "apt-get update -qq \\', ''],
      ['  && apt-get install -y -qq openssh-server …"', 'cài sshd + user deploy'],
      ['docker commit lab-vps lab-sach', 'CHỤP trạng thái sạch'],
      ['docker rm -f lab-vps && docker run -d … lab-sach \\', 'phá xong? dựng lại'],
      ['  /usr/sbin/sshd -D', ''],
    ], { fs: 14 }),
    term([
      '# lần đầu, từ số 0 tới ssh vào được:',
      '= tong: 59 giay',
      '# phá (xoá ~/.ssh) → ssh bị từ chối:',
      '! deploy@127.0.0.1: Permission denied (publickey,password).',
      '# dựng lại từ ảnh sạch:',
      '= dung lai tu anh sach: 1.63 giay',
      '# dựng lại TỪ ĐẦU (không có ảnh sạch) thì:',
      '! WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!',
      "$ ssh-keygen -R '[127.0.0.1]:2222' -f ./known_hosts",
    ], { title: 'Mac — zsh', fs: 14 })) + P('Cảnh báo “HOST IDENTIFICATION HAS CHANGED” ở sân tập là bình thường (máy mới, khoá mới). Ở VPS THẬT thì dừng lại và hỏi vì sao.') + FIX },

  /* ───────── 0.1 — slide 17–22 ───────── */
  { t: 'Bốn bước, bốn câu hỏi, bốn kiểu hỏng', body: steps([
    ['<strong>1 · Tạo tác</strong> — gửi NHỮNG BYTE NÀO?', 'hỏng: tệp gõ dở, tệp .env, thư mục build cũ lọt vào'],
    ['<strong>2 · Vận chuyển</strong> — tới máy bằng đường nào?', 'hỏng: gửi thiếu, sai quyền sở hữu, đứt giữa chừng'],
    ['<strong>3 · Tráo</strong> — lúc nào bản mới thành bản sống?', 'hỏng: gián đoạn dài bằng thời gian khởi động, không có đường lùi'],
    ['<strong>4 · Kiểm</strong> — chứng minh nó chạy bằng gì?', 'hỏng: tin “script thoát 0”, trong khi web trả 500'],
  ]) + box('tip', 'Bốn bước độc lập: đổi cách vận chuyển không cần đụng bước tráo. “Deploy hỏng” luôn là “<strong>bước N</strong> hỏng”.') + FIX },

  { t: 'rsync cây làm việc gửi luôn cả tệp gõ dở', body: two(
    term([
      '  cay lam viec bay gio CO mot tep hong, CHUA commit:',
      '     M src/server.js',
      '!    node --check: /tmp/duan/src/server.js:5',
      '=== rsync (day CAY LAM VIEC) ===',
      '!    tren VPS: /srv/vps/app/src/server.js:5',
      '=== git push (day thu DA COMMIT) ===',
      '=    tren VPS: cu phap HOP LE',
    ], { title: 'số liệu gốc của bài 0.1', fs: 14.5 }),
    diagram({ w: 540, h: 360, nodes: [
      { id: 'wt', x: 0, y: 20, w: 200, h: 90, t: 'Cây làm việc', d: 'đã commit + đang gõ dở', c: 'amb' },
      { id: 'cm', x: 0, y: 230, w: 200, h: 90, t: 'Commit', d: 'chỉ thứ bạn đã chốt', c: 'grn' },
      { id: 'v1', x: 330, y: 20, w: 210, h: 90, t: 'VPS: tệp hỏng', d: 'app sập vài phút sau', c: 'red' },
      { id: 'v2', x: 330, y: 230, w: 210, h: 90, t: 'VPS: bản đúng', d: 'tệp gõ dở ở lại máy bạn', c: 'grn' },
    ], edges: [{ from: 'wt', to: 'v1', t: 'rsync' }, { from: 'cm', to: 'v2', t: 'git archive' }] })) + FIX },

  { t: 'rsync và git đều chỉ gửi phần chênh lệch', body: bars([
    { l: 'rsync lần đầu', sub: 'cả cây 176 KB', v: 85318, txt: '85.318 byte', c: 'amb' },
    { l: 'rsync sửa 1 tệp', sub: 'chỉ phần khác', v: 1228, txt: '1.228 byte', c: 'blu' },
    { l: 'git push sửa 1 tệp', sub: 'đối tượng nén + delta', v: 569, txt: '569 byte', c: 'grn' },
  ], { lw: 280 }) + table(['', 'rsync (cây tệp)', 'git (kho trần)'], [
    ['Trên ĐĨA máy chủ', '176 KB', '556 KB — mang theo mọi phiên bản'],
    ['Thời gian mỗi lần', '~280 ms bất kể gửi bao nhiêu', '— (cũng một lần bắt tay SSH)'],
    ['Quyết định thật sự', '!gửi CÂY LÀM VIỆC', '+gửi thứ ĐÃ COMMIT'],
  ], { sm: true }) + FIX },

  { t: 'Chạy thử trước: đọc từng dòng -i', body: two(
    term([
      '$ rsync -azin --delete --exclude .git ./ vps:app/',
      '<f.st.... src/server.js',
      '# rồi mới chạy thật (bỏ -n):',
      '$ rsync -az --stats --exclude .git ./ vps:app/',
      'Number of files transferred: 1',
      'Total sent: 669 B',
      '# ↑ openrsync của Mac: KHÔNG có dòng "Literal data",',
      '#   không có --chown, không có --info=stats2',
    ], { title: 'Mac (openrsync) → VPS thí nghiệm', fs: 14 }),
    table(['Cờ', 'Nghĩa'], [
      ['<code>-a</code>', 'giữ quyền, giờ, liên kết, đệ quy'],
      ['<code>-z</code>', 'nén khi gửi'],
      ['<code>-n</code>', 'chạy thử — KHÔNG đổi gì'],
      ['<code>-i</code>', 'in từng thay đổi: <code>&lt;f.st</code> = gửi tệp, khác cỡ (s) + giờ (t)'],
      ['<code>--delete</code>', 'xoá bên kia thứ bên này không có — nguy hiểm nếu sai thư mục'],
      ['<code>--exclude .git</code>', 'không gửi lịch sử git'],
      ['<code>--stats</code>', 'đếm byte thật sự đã gửi'],
    ], { sm: true })) + FIX },

  { t: 'Tráo ngây thơ: gián đoạn dài bằng lúc khởi động', body: reqChart() + P('Cùng một script “dừng rồi khởi động lại”, hai ứng dụng chỉ khác thời gian khởi động: 1 → 49 request rơi (số liệu bài 0.1).') },

  { t: '“Nó chạy rồi” có bốn mức — chỉ mức 3 đáng tin', body: steps([
    ['<strong>Script thoát 0</strong>', 'chứng minh các lệnh đã chạy — không nói gì về app'],
    ['<strong>Tiến trình đang chạy / cổng đang nghe</strong>', 'vẫn qua khi app trả 500 cho mọi request'],
    ['<strong>Một tuyến THẬT trả đúng mã</strong>', '<code>200</code>/<code>401</code> = tuyến đã gắn · <code>404</code> = ảnh cũ · <code>5xx</code> = app hỏng'],
    ['<strong>Kiểm hỏng thì deploy HỎNG</strong>', 'phép kiểm không dừng được deploy = đồ trang trí'],
  ]) + FIX },

  /* ───────── 0.2 — slide 23–27 ───────── */
  { t: 'Đọc cấu hình ĐANG hiệu lực, đừng đọc tệp', body: two(
    term([
      '$ ls /etc/ssh/sshd_config.d/',
      '50-cloud-init.conf  70-gia-co.conf',
      '$ sudo sshd -T | grep -E "^(passwordauth|permitroot)"',
      'permitrootlogin without-password',
      '! passwordauthentication yes',
      '# đổi tên 70- thành 01- :',
      '$ sudo sshd -T | grep ^passwordauth',
      '= passwordauthentication no',
    ], { title: 'VPS thí nghiệm — root', fs: 14.5 }),
    box('warn', '<strong>sshd lấy giá trị đọc được ĐẦU TIÊN</strong>, và <code>*.conf</code> được đọc theo thứ tự chữ cái. <code>50-cloud-init.conf</code> (có sẵn: <code>PasswordAuthentication yes</code>) thắng <code>70-</code>. Đặt tên <code>01-</code>.') +
    box('info', 'Đặt <code>prohibit-password</code> mà <code>sshd -T</code> vẫn in <code>without-password</code>: hai tên của CÙNG một giá trị — OpenSSH 9.6 in tên cũ.'))
    + FIX },

  { t: 'sshd -T nói “sẽ thế”; máy khách nói “đang thế”', body: two(
    term([
      '# tệp đã sửa, sshd -T đã báo "no", CHƯA nạp lại:',
      '$ ssh -o PubkeyAuthentication=no khongcoai@vps',
      '! khongcoai@127.0.0.1: Permission denied (publickey,password).',
      '$ sudo systemctl reload ssh   # (ở đây: kill -HUP 1)',
      '$ ssh -o PubkeyAuthentication=no khongcoai@vps',
      '= khongcoai@127.0.0.1: Permission denied (publickey).',
    ], { title: 'Mac → VPS thí nghiệm', fs: 14.5 }),
    cards([
      { t: '(publickey,password)', d: 'máy quét biết: <strong>đáng đoán mật khẩu</strong>, mỗi kết nối được mấy lượt.', c: 'red' },
      { t: '(publickey)', d: 'không mật khẩu nào mở được, dù yếu tới đâu. Cửa không có ổ khoá để cạy.', c: 'grn' },
      { t: 'Thử bằng terminal THỨ HAI', d: 'giữ phiên cũ mở tới khi phiên mới vào được — khoá nhầm mình ở ngoài là phải vào console cứu hộ.', c: 'amb' },
    ], 1)) + FIX },

  { t: 'Một khoá deploy không thể biến thành shell', body: sh([
    ['# ~/.ssh/authorized_keys trên VPS — TẤT CẢ trên MỘT dòng', ''],
    ['command="/srv/vps/chi-duoc-deploy.sh",no-pty,no-agent-forwarding,no-port-forwarding,no-X11-forwarding ssh-ed25519 AAAAC3Nz… deploy@ci', ''],
  ], { fs: 14, so: false }) + table(['Tuỳ chọn', 'Chặn cái gì', 'Khi khoá bị lộ'], [
    ['<code>command="…"</code>', 'mọi lệnh khác — xin shell cũng chạy script deploy', 'lệnh gốc nằm ở <code>$SSH_ORIGINAL_COMMAND</code> ⇒ ghi log được'],
    ['<code>no-pty</code>', 'không cấp terminal tương tác', 'không có phiên gõ lệnh'],
    ['<code>no-port-forwarding</code>', 'đường hầm vào mạng sau VPS', 'không thành cầu nối vào DB'],
    ['<code>no-agent-forwarding</code>', 'mượn khoá trên máy người dùng', 'không nhảy tiếp sang máy khác'],
    ['<code>restrict</code> (OpenSSH ≥ 7.2)', 'tắt HẾT các thứ trên một lần', 'viết ngắn hơn, và chặn cả tính năng mới sau này'],
  ], { sm: true }) + FIX },

  { t: 'Dùng chung một kết nối SSH: 134 → 15 ms/lệnh', body: two(
    bars([
      { l: '8 lệnh riêng lẻ', sub: 'mỗi lệnh một lần bắt tay', v: 1073, txt: '1.073 ms', c: 'red' },
      { l: '8 lệnh dùng chung', sub: 'ControlMaster', v: 121, txt: '121 ms', c: 'grn' },
    ], { lw: 210 }) + term([
      '! ControlPath too long (… >= 104 bytes)',
      '# đường dẫn socket Unix có giới hạn độ dài',
      '# ⇒ dùng %C (mã băm ngắn) thay vì %r@%h:%p',
    ], { title: 'Mac — lỗi thật khi đặt socket trong thư mục sâu', fs: 14 }),
    yaml([
      ['# ~/.ssh/config', ''],
      ['Host vps', ''],
      ['    HostName 203.0.113.10', 'IP tài liệu (RFC 5737)'],
      ['    User deploy', ''],
      ['    ControlMaster auto', 'lệnh đầu mở, lệnh sau đi nhờ'],
      ['    ControlPath ~/.ssh/cm-%C', '%C = băm, luôn ngắn'],
      ['    ControlPersist 60', 'giữ thêm 60 s sau lệnh cuối'],
    ], { lang: 'ini' }) + box('info', 'Đóng: <code>ssh -O exit vps</code>. OpenSSH có sẵn trong Windows <strong>không</strong> hỗ trợ ControlMaster — trên Windows hãy chạy script deploy trong WSL.')) + FIX },

  { t: 'rsync bằng root: tệp đổi chủ, app hết ghi được', body: two(
    term([
      '  /srv/vps/app2 thuoc: trienkhai:trienkhai',
      '=== rsync bang root vao thu muc cua trienkhai ===',
      '!  sau rsync: root:root',
      '=  → ung dung co doc duoc khong: CO',
      '!  → co GHI de duoc khong (log, cache, upload): KHONG',
    ], { title: 'số liệu gốc của bài 0.2', fs: 14.5 }),
    steps([
      ['<strong>Deploy BẰNG chính user của app</strong>', 'câu hỏi quyền không bao giờ xuất hiện'],
      ['<code>rsync --chown=app:app</code>', 'cần root bên nhận · openrsync của Mac KHÔNG có cờ này ⇒ <code>brew install rsync</code>'],
      ['<strong>Thư mục ghi được nằm NGOÀI bản phát hành</strong>', 'tạo tác chỉ đọc, dữ liệu sống ở <code>shared/</code> — Chương 3, 4'],
    ])) + FIX },

  /* ───────── 0.3 — slide 28–32 ───────── */
  { t: 'Deploy bằng tay: bốn bước thành bốn lệnh', body: sh([
    ['# 1 · tạo tác: đúng MỘT commit, không .git, không tệp gõ dở', ''],
    ['git archive --format=tar HEAD | gzip > /tmp/ban.tar.gz', '625 byte, 2 mục'],
    ['# 2 · vận chuyển', ''],
    ['scp /tmp/ban.tar.gz vps:phat-hanh/', ''],
    ['# 3 · tráo (pkill neo ^ — xem slide sau)', ''],
    ['ssh vps \'cd ~/app && tar xzf ../phat-hanh/ban.tar.gz && \\', ''],
    ['  pkill -f "^node src/server.js"; sleep 0.3; \\', 'dừng bản cũ'],
    ['  setsid nohup node src/server.js >~/app.log 2>&1 </dev/null &\'', 'đóng CẢ BA luồng'],
    ['# 4 · kiểm', ''],
    ['ssh vps \'curl -s -o /dev/null -w "%{http_code}" localhost:3000/health\'', '200 mới là xong'],
  ], { fs: 15 }) + FIX },

  { t: 'pkill -f tự giết luôn cái shell đang deploy', body: term([
      '$ ssh vps \'echo "shell cua lenh nay: PID $$"; pgrep -af "node src/server.js"; …; true\'',
      'shell cua lenh nay: PID 1037',
      '+ 991 node src/server.js',
      '! 1037 bash -c echo "shell cua lenh nay: PID $$"; pgrep -af "node src/server.js"; echo "---"; pgrep …',
      '---',
      '+ 991 node src/server.js',
      '# ↑ mẫu có neo ^ (pgrep -af "^node src/server.js") chỉ còn đúng tiến trình node',
      '$ ssh vps \'cd ~/app && tar xzf … && pkill -f "node src/server.js"; sleep 0.3; setsid nohup node … &\'',
      '$ echo "ssh ma thoat: $?"',
      '! ssh ma thoat: 255',
      '$ ssh vps \'pgrep -af "^node" || echo "khong co tien trinh node nao"\'',
      '! khong co tien trinh node nao',
    ], { title: 'Mac → VPS thí nghiệm', fs: 14 }) +
    box('bad', '<code>-f</code> so với CẢ dòng lệnh, và dòng lệnh của shell <code>bash -c \'…\'</code> mà ssh mở ra CHỨA đúng chuỗi đó ⇒ shell tự sát giữa chừng: bản cũ đã chết, bản mới chưa chạy, ssh trả 255. Sửa: neo <code>"^node src/server.js"</code>, hoặc tệp PID, hoặc systemd (Chương 3).') + FIX },

  { t: 'Quên &lt;/dev/null: ssh treo bằng tiến trình nền', body: bars([
    { l: 'không chuyển hướng', sub: "ssh vps 'setsid nohup sleep 5 &'", v: 5.16, txt: '5,16 s — treo tới khi sleep xong', c: 'red' },
    { l: 'chuyển hướng cả 3 luồng', sub: '>/dev/null 2>&1 </dev/null', v: 0.14, txt: '0,14 s', c: 'grn' },
    { l: 'ssh vps true', sub: 'đối chứng', v: 0.15, txt: '0,15 s', c: 'blu' },
  ], { lw: 330 }) + box('warn', 'ssh chỉ trả về khi MỌI thứ đang giữ stdout/stderr của phiên đã đóng. Tiến trình nền thừa hưởng chúng ⇒ script deploy “treo” trông như máy chủ chậm. Với app thật chạy mãi mãi: treo mãi mãi.') + FIX },

  { t: 'Ba bản deploy, bốn phép kiểm: chỉ một cái bắt đủ', body: table(['Phép kiểm', 'A · bản TỐT', 'B · thiếu tệp', 'C · lên được, trả 500'], [
    ['a) script thoát 0?', '+0', '- 0 — vẫn “xanh”', '- 0 — vẫn “xanh”'],
    ['b) tiến trình chạy?', '+32689', '+KHÔNG CÓ', '- 710 — trông khoẻ'],
    ['c) cổng 3000 có ai nghe?', '+CÓ', '+KHÔNG', '-CÓ — trông khoẻ'],
    ['d) tuyến THẬT trả gì?', '+200', '+000', '+500 — bắt được'],
  ]) + P('Ô xanh = phép kiểm nói ĐÚNG sự thật · ô đỏ = phép kiểm nói dối. Case C thường là thiếu một biến môi trường: <code>Loi cau hinh: thieu DATABASE_URL</code>.') + FIX },

  { t: 'Health: “còn sống” khác “sẵn sàng nhận khách”', body: cards([
    { ic: '🫀', t: 'Liveness — còn sống?', d: 'tiến trình không kẹt. Hỏng ⇒ <strong>khởi động lại</strong>. Đừng chạm DB ở đây, kẻo DB chậm là app bị giết oan.', c: 'red' },
    { ic: '🚦', t: 'Readiness — sẵn sàng?', d: 'phục vụ được thật (DB nối được: <code>SELECT 1</code>). Hỏng ⇒ <strong>đừng gửi request</strong>, chưa cần giết.', c: 'grn' },
    { ic: '🪶', t: 'Rẻ', d: 'bị gọi mỗi giây mãi mãi. <code>SELECT 1</code> được; đếm hàng bảng lớn thì không.', c: 'amb' },
    { ic: '🔓', t: 'Không cần đăng nhập, không lộ gì', d: 'không in phiên bản, chuỗi kết nối, tên thư viện ra cổng công khai.', c: 'vio' },
  ], 2) + P('Trong 3 giây khởi động ở bài 0.1, app <strong>còn sống nhưng chưa sẵn sàng</strong>. Gộp hai thứ này là cách tạo ra vòng restart vô tận.') + FIX },

  /* ───────── 0.4 — slide 33–35 ───────── */
  { t: 'Lùi bản: đổi symlink 4,8 ms, giải nén lại 590 ms', body: two(
    bars([
      { l: 'đổi symlink', sub: 'dự án 48 MB', v: 4.8, txt: '4,8 ms', c: 'grn' },
      { l: 'giải nén lại', sub: '12.000 tệp', v: 590, txt: '590 ms — và tăng theo dự án', c: 'red' },
    ], { lw: 170 }) + box('tip', 'Quan trọng hơn con số: symlink chỉ cần một thư mục <strong>đã nằm trên đĩa</strong>. Giải nén lại cần tạo tác cũ + mạng — đúng lúc mọi thứ đang hỏng.'),
    tree(`/srv/app/
├── phat-hanh/
│   ├── 2026-08-23-1930-a3f1c9/   # mỗi bản một thư mục
│   ├── 2026-08-23-2114-b8e402/
│   └── 2026-08-24-0902-c1d773/
├── hien-tai -> phat-hanh/2026-08-24-0902-c1d773
└── chung/                        # không thuộc bản nào
    ├── .env
    └── tai-len/`)) + FIX },

  { t: 'ln -sfn có nguyên tử không? Tuỳ bản ln', body: term([
      '# GNU coreutils 9.4 (Ubuntu 24.04) — 8.32 (Ubuntu 22.04) in ra y hệt',
      '$ strace -e trace=symlink,symlinkat,unlink,unlinkat,rename,renameat,renameat2 ln -sfn phat-hanh/b2 hien-tai',
      'symlinkat("phat-hanh/b2", AT_FDCWD, "hien-tai") = -1 EEXIST (File exists)',
      'symlinkat("phat-hanh/b2", AT_FDCWD, "Cu1B21aY") = 0',
      '= renameat(AT_FDCWD, "Cu1B21aY", AT_FDCWD, "hien-tai") = 0',
      '# BusyBox v1.36.1 (alpine:3.20 — nền của rất nhiều ảnh Docker), cùng lệnh strace',
      '! unlinkat(AT_FDCWD, "cur", 0)            = 0',
      '! symlinkat("b", AT_FDCWD, "cur")         = 0',
    ], { title: 'VPS thí nghiệm + container alpine:3.20', fs: 14 }) + cards([
      { t: 'GNU ln: tên tạm rồi rename', d: 'đã nguyên tử — không có khe hở nào', c: 'grn' },
      { t: 'BusyBox ln: xoá rồi mới tạo', d: 'có khoảnh khắc <code>hien-tai</code> KHÔNG tồn tại', c: 'red' },
      { t: 'Dạng không phụ thuộc bản ln', d: '<code>ln -sfn X hien-tai.moi &amp;&amp; mv -T hien-tai.moi hien-tai</code>', c: 'blu' },
    ], 3) + FIX },

  { t: 'Năm lỗ hổng của deploy tay → năm chương', body: table(['Lỗ hổng', 'Vì sao đau', 'Chương'], [
    ['Không có đường lùi', '<code>tar xzf</code> ghi ĐÈ lên bản cũ', 'Ch3, Ch6'],
    ['Gián đoạn = thời gian khởi động', 'giết bản cũ trước khi biết bản mới chạy', 'Ch3, Ch13'],
    ['Hỏng nửa chừng vẫn đi tiếp', 'thiếu <code>set -euo pipefail</code>, thiếu khoá chạy chồng', 'Ch7'],
    ['Cơ sở dữ liệu nằm ngoài bức tranh', 'mã đổi mà lược đồ chưa đổi (hoặc ngược lại)', 'Ch5'],
    ['Khởi động lại máy là mất', '<code>nohup</code> sống qua phiên, không sống qua reboot', 'Ch3'],
  ]) + FIX },

  /* ───────── tổng kết ───────── */
  { t: 'Sai lầm hay gặp ở Mục 0', body: table(['Sai lầm', 'Hậu quả thật', 'Làm đúng'], [
    ['rsync thẳng cây làm việc', 'tệp gõ dở lên production', 'tạo tác từ commit: <code>git archive</code> / ảnh'],
    ['Tin “script thoát 0”', 'web trả 500 mà log deploy xanh', 'curl một tuyến thật, hỏng thì dừng'],
    ['<code>pkill -f "node app"</code> trong <code>ssh \'…\'</code>', 'shell tự sát, ssh 255, không app nào chạy', 'neo <code>^</code> hoặc tệp PID; tốt nhất: systemd'],
    ['Quên <code>&lt;/dev/null</code>', 'ssh treo, deploy không bao giờ xong', '<code>&gt;log 2&gt;&amp;1 &lt;/dev/null</code> + <code>setsid</code>'],
    ['Sửa sshd bằng tệp <code>70-…conf</code>', '<code>50-cloud-init</code> vẫn cho mật khẩu', '<code>01-</code> + <code>sshd -T</code> + reload + thử từ máy khách'],
    ['Đẩy một lần ra tất cả', 'Cloudflare 27 phút, CrowdStrike 8,5 triệu máy', 'từng bậc, có điểm dừng, lùi bản nhanh'],
  ], { sm: true }) + FIX },

  { t: 'Bảng tra nhanh (1/2): triệu chứng → lệnh đầu tiên', body: table(['Triệu chứng', 'Lệnh ĐẦU TIÊN', 'Đọc output'], [
    ['Deploy xong, web lỗi', "<code>curl -s -o /dev/null -w '%{http_code}' URL</code>", '000 = không ai nghe · 5xx = app lỗi · 404 = ảnh/tuyến cũ'],
    ['000 / refused', '<code>pgrep -af "^node"</code> · <code>ss -tlnp</code>', 'không tiến trình ⇒ đọc log · có mà không cổng ⇒ nghe nhầm'],
    ['App chết ngay', '<code>tail -n 30 app.log</code>', 'dòng CUỐI: thường là thiếu biến / thiếu tệp'],
    ['ssh deploy treo', '<code>ssh -v</code> · xem lệnh nền', 'thiếu <code>&lt;/dev/null</code> hoặc <code>&amp;</code> bọc cả chuỗi <code>&amp;&amp;</code>'],
    ['ssh 255 giữa chừng', 'đọc lại <code>pkill -f</code>', 'mẫu có khớp chính shell không?'],
    ['Sửa sshd không ăn', '<code>sshd -T</code> rồi thử từ MÁY KHÁCH', '“sẽ thế” ≠ “đang thế” — chưa reload'],
    ['HOST IDENTIFICATION CHANGED', 'hỏi: máy này vừa dựng lại?', 'sân tập: <code>ssh-keygen -R</code> · VPS thật: DỪNG'],
    ['Muốn biết rsync sẽ làm gì', '<code>rsync -azin --delete …</code>', 'mỗi dòng một thay đổi, không đổi gì thật'],
  ], { sm: true }) + FIX },

  { t: 'Bảng tra nhanh (2/2): lệnh và cờ của Mục 0', body: two(
    sh([
      ['git archive --format=tar HEAD | gzip > b.tgz', '1 commit'],
      ['rsync -azin --delete --exclude .git ./ vps:app/', 'chạy thử'],
      ['rsync -az --stats …', 'đếm byte'],
      ['scp b.tgz vps:phat-hanh/', 'chép tệp'],
      ["ssh vps 'lệnh >log 2>&1 </dev/null &'", 'không treo'],
      ['pkill -f "^node src/server.js"', 'neo ^'],
      ["curl -s -o /dev/null -w '%{http_code}' URL", 'mã thật'],
      ['dig tên A +noall +answer', 'tên → IP'],
    ], { fs: 14 }),
    sh([
      ['sudo sshd -T | grep -i passwordauth', 'sẽ hiệu lực'],
      ['sudo sshd -t && sudo systemctl reload ssh', 'kiểm rồi nạp'],
      ['ssh -o PubkeyAuthentication=no u@vps', 'cho cách nào?'],
      ['ssh -O check vps; ssh -O exit vps', 'kết nối chung'],
      ['ln -sfn phat-hanh/X hien-tai.moi', 'link tạm'],
      ['mv -T hien-tai.moi hien-tai', 'tráo'],
      ['readlink hien-tai', 'bản nào?'],
      ["ssh-keygen -R '[127.0.0.1]:2222' -f kh", 'sân tập'],
    ], { fs: 14 })) + FIX },

  { t: 'Thực hành Mục 0: một buổi 45 phút', body: steps([
    ['<strong>10′ · Dựng sân tập</strong> (bài 2/2)', 'container Ubuntu + sshd + khoá riêng · chụp ảnh sạch · phá thử rồi dựng lại'],
    ['<strong>10′ · Deploy tay</strong> (0.3)', '<code>git archive</code> → <code>scp</code> → tráo → <code>curl</code> ra <code>200</code>'],
    ['<strong>10′ · Làm hỏng có chủ đích</strong> (0.1, 0.3)', 'bỏ <code>DATABASE_URL</code> ⇒ 500 · dùng <code>pkill</code> không neo ⇒ ssh 255 · hỏi bốn câu'],
    ['<strong>10′ · Gia cố máy nhận</strong> (0.2)', '<code>01-gia-co.conf</code> · <code>sshd -T</code> · reload · máy khách chỉ còn thấy <code>(publickey)</code>'],
    ['<strong>5′ · Lùi bản</strong> (0.4)', 'hai thư mục phát hành + <code>mv -T</code> · <code>readlink</code> xác nhận'],
  ]) + FIX },
]);
