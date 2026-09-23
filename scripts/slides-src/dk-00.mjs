/**
 * Docker · Deck dk-00 — Mục 0: Docker giải quyết gì, lịch sử, cài đặt, năm phút đầu tiên.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 23/09/2026:
 *   • "máy Mac"   = Mac M1, Docker Desktop 4.91 / Engine 29.8.0 (containerd v2.3.4, runc 1.4.3), arm64,
 *                   Docker Compose v5.5.1, buildx v0.37.0
 *   • "máy Linux" = Fedora 44, Docker Engine 29.6.2 (containerd v2.2.6), amd64, 12 CPU
 * Tên container khi chạy thật mang tiền tố dk00- (luật an toàn của khoá); trên slide người học thấy tên ngắn
 * (web, db…) như trong bài. Cổng thật là 18000–18003; slide in đúng cổng đã chạy.
 *
 * Mốc lịch sử (slide 7–8) đã đối chiếu 23/09/2026: Wikipedia "Chroot", "FreeBSD jail", "Solaris Containers",
 * "Linux namespaces", "Cgroups", "LXC", "Docker (software)"; docker.com/blog "It's here: Docker 1.0";
 * CNCF 29/03/2017 (containerd); mirantis.com 13/11/2019; docs.docker.com/subscription/desktop-license;
 * kubernetes.io/blog/2022/02/17/dockershim-faq. Số liệu slide 11: survey.stackoverflow.co/2025 + /2024.
 * Sự cố slide 15: lệnh SEC 34-70694 (Knight Capital), Unit 42 (Graboid), TechCrunch 15/06/2018 (17 ảnh độc).
 */
import { S, cover, cards, box, steps, table, vs, kpis, flow, two, list, mindmap, layers, host, term as dkTerm, diagram, yaml, bars, seg, esc, D } from './_dk-chung.mjs';

const term = (lines, { title, fs = 15 } = {}) => dkTerm(lines, { title, dir: '~', fs });
const TCSS = '<style>.g-term pre{font-size:15px;line-height:1.45}</style>';

export const deck = { key: 'dk-00', code: 'DOCKER · MỤC 0', title: 'Docker giải quyết gì, và cài đặt', sub: 'Docker · Mục 0' };

/* ───────────── SVG nhỏ tự vẽ (chép từ dk-01) ───────────── */
const MONO = 'SF Mono,Menlo,monospace';
const sv = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="display:block;margin:0 auto"><defs>` +
  ['dk', 'amb', 'red', 'grn', 'mu', 'tea', 'vio'].map((k) => `<marker id="m-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${D[k]}"/></marker>`).join('') +
  `</defs>${inner}</svg>`;
const R = (x, y, w, h, { c = 'dk', fill = '#111a2b', dash = false, r = 12, sw = 2.5, op = 1 } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${D[c] || c}" stroke-width="${sw}"${dash ? ' stroke-dasharray="9 7"' : ''} opacity="${op}"/>`;
const T = (x, y, s, { fs = 17, c = '#e6edf3', a = 'start', b = false, mono = false } = {}) =>
  `<text x="${x}" y="${y}" font-size="${fs}" fill="${D[c] || c}" text-anchor="${a}"${b ? ' font-weight="800"' : ''}${mono ? ` font-family="${MONO}"` : ''}>${esc(s)}</text>`;
const A = (x1, y1, x2, y2, { c = 'dk', dash = false, sw = 3 } = {}) =>
  `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${D[c]}" stroke-width="${sw}" fill="none"${dash ? ' stroke-dasharray="7 6"' : ''} marker-end="url(#m-${c})"/>`;

/* Slide 3 — thùng hàng tiêu chuẩn: trước và sau */
const shipping = () => {
  let s = '';
  // TRƯỚC: hàng rời đủ hình dạng
  s += R(0, 0, 540, 300, { c: 'red', fill: 'rgba(255,92,108,.05)', dash: true });
  s += T(20, 34, 'TRƯỚC 1956: hàng rời, mỗi món một kiểu', { fs: 18, c: 'red', b: true });
  const loose = [['🛢', 40, 90], ['📦', 120, 110], ['🎹', 200, 86], ['🧺', 280, 118], ['🪑', 360, 92], ['🍷', 440, 112], ['🧳', 70, 170], ['🛞', 170, 182], ['📚', 270, 170], ['🎸', 380, 184]];
  s += loose.map(([e, x, y]) => `<text x="${x}" y="${y}" font-size="38">${e}</text>`).join('');
  s += T(20, 250, 'Bốc xếp từng món bằng tay · mỗi cảng một cách', { fs: 15.5, c: 'mu' });
  s += T(20, 276, '≈ phần mềm: mỗi máy cài một kiểu, lệch phiên bản', { fs: 15.5, c: 'amb' });
  // SAU: container tiêu chuẩn
  const X0 = 620;
  s += R(X0, 0, 540, 300, { c: 'grn', fill: 'rgba(63,185,80,.05)' });
  s += T(X0 + 20, 34, 'SAU: một cái thùng tiêu chuẩn', { fs: 18, c: 'grn', b: true });
  const box = (x, y, c, lbl) => R(x, y, 150, 56, { c, fill: '#0b1322', r: 6, sw: 3 }) +
    [30, 60, 90, 120].map((dx) => `<line x1="${x + dx}" y1="${y + 8}" x2="${x + dx}" y2="${y + 48}" stroke="${D[c]}" stroke-width="2" opacity=".55"/>`).join('') +
    T(x + 75, y + 35, lbl, { fs: 15, a: 'middle', b: true, mono: true });
  s += box(X0 + 30, 70, 'dk', 'web') + box(X0 + 195, 70, 'tea', 'api') + box(X0 + 360, 70, 'vio', 'db');
  s += box(X0 + 110, 140, 'amb', 'redis') + box(X0 + 275, 140, 'grn', 'nginx');
  s += `<rect x="${X0 + 20}" y="206" width="500" height="10" rx="4" fill="${D.dim}"/>`;
  s += T(X0 + 20, 250, 'Cẩu, tàu, xe tải nào cũng bốc được — không cần mở ra', { fs: 15.5, c: 'mu' });
  s += T(X0 + 20, 276, '≈ image: laptop, CI, VPS nào cũng chạy y hệt', { fs: 15.5, c: 'grn' });
  s += A(548, 150, 612, 150, { c: 'dk' });
  return sv(1160, 305, s);
};

/* Slide 7–8 — dòng thời gian */
const timeline = (ev, { note } = {}) => {
  const W = 1160, H = 400, Y = 200, n = ev.length, x = (i) => 120 + i * ((W - 240) / (n - 1));
  let s = `<path d="M20 ${Y} H${W - 20}" stroke="#2a3a55" stroke-width="6" stroke-linecap="round"/>`;
  ev.forEach(([d, a, b, c], i) => {
    const X = x(i), up = i % 2 === 0;
    s += `<line x1="${X}" y1="${Y}" x2="${X}" y2="${up ? Y - 28 : Y + 28}" stroke="${D[c]}" stroke-width="2"/>`;
    s += `<circle cx="${X}" cy="${Y}" r="11" fill="#0b1220" stroke="${D[c]}" stroke-width="4"/>`;
    const t0 = up ? Y - 104 : Y + 56;
    s += T(X, t0, d, { fs: 16, a: 'middle', b: true, mono: true, c });
    s += T(X, t0 + 24, a, { fs: 16, a: 'middle', b: true });
    if (b) s += T(X, t0 + 45, b, { fs: 14.5, a: 'middle', c: 'mu' });
  });
  if (note) s += T(W / 2, H - 6, note, { fs: 14.5, a: 'middle', c: 'dim' });
  return sv(W, H, s);
};

/* Slide 13 — lộ trình 17 phần: tàu điện 3 hàng */
const STAGES = [
  { n: 'Nhập môn', c: D.mu }, { n: 'Mô hình', c: D.dk }, { n: 'Dựng ảnh', c: D.tea },
  { n: 'Dữ liệu · mạng · Compose', c: D.vio }, { n: 'Production & chẩn đoán', c: D.red }, { n: 'MỚI 09/2026', c: D.grn },
];
const STOPS = [
  ['0', 'Bắt đầu', '& cài đặt', 0], ['1', 'Mô hình', 'tư duy', 1], ['2', 'Chạy', 'container', 1],
  ['3', 'Image &', 'registry', 1], ['4', 'Dockerfile', '', 2], ['5', 'Tầng &', 'cache', 2],
  ['6', 'Ảnh nhỏ', '& an toàn', 2], ['7', 'Dữ liệu', 'volume', 3], ['8', 'Mạng', '', 3],
  ['9', 'Compose', '', 3], ['10', 'Stack', 'thật', 3], ['11', 'Production', '', 4],
  ['12', 'Chẩn đoán', '', 4], ['13', 'Vòng lặp', 'dev', 5], ['14', 'Cho mọi việc', 'tự host · AI', 5],
  ['15', 'Nâng cao', 'Swarm · K8s', 5], ['16', 'Dự án', 'cuối khoá', 5], ['🏁', 'Thi cuối', '20 câu', 5],
];
const roadmap = () => {
  const W = 1160, H = 440, X = (i) => 92 + i * 195, Y = [40, 200, 360], RR = 25;
  const pos = STOPS.map((_, k) => { const row = Math.floor(k / 6), i = k % 6; return [row % 2 ? X(5 - i) : X(i), Y[row]]; });
  let s = '';
  for (let k = 1; k < STOPS.length; k++) {
    const [x1, y1] = pos[k - 1], [x2, y2] = pos[k], c = STAGES[STOPS[k][3]].c;
    if (y1 === y2) s += `<path d="M${x1} ${y1} H${x2}" stroke="${c}" stroke-width="8" stroke-linecap="round" fill="none"/>`;
    else { const ex = x1 > W / 2 ? x1 + 72 : x1 - 72; s += `<path d="M${x1} ${y1} C${ex} ${y1} ${ex} ${y2} ${x2} ${y2}" stroke="${c}" stroke-width="8" stroke-linecap="round" fill="none"/>`; }
  }
  STOPS.forEach(([num, a, b, st], k) => {
    const [x, y] = pos[k], c = STAGES[st].c;
    s += `<circle cx="${x}" cy="${y}" r="${RR}" fill="#0b1220" stroke="${c}" stroke-width="5"/>`;
    s += `<text x="${x}" y="${y + 7}" text-anchor="middle" font-size="${num === '🏁' ? 22 : 19}" font-weight="800" fill="#fff">${esc(num)}</text>`;
    s += T(x, y + 50, a, { fs: 16, a: 'middle', b: true });
    if (b) s += T(x, y + 69, b, { fs: 14.5, a: 'middle', c: 'mu' });
  });
  return sv(W, H, s);
};
const legend = () => `<div style="display:flex;flex-wrap:wrap;gap:8px 18px;justify-content:center;font-size:15px;color:${D.mu};margin-top:2px">` +
  STAGES.map((x) => `<span><i style="display:inline-block;width:22px;height:8px;border-radius:4px;background:${x.c};margin-right:6px;vertical-align:middle"></i>${esc(x.n)}</span>`).join('') + `</div>`;

/* Slide 32 — giải phẫu một lệnh docker run */
const anatomy = () => {
  const parts = [
    ['docker run', 'dk', 'tạo + chạy một container', 'kéo ảnh nếu máy chưa có'],
    ['-d', 'tea', 'chạy nền (detached)', 'trả lại dấu nhắc cho bạn'],
    ['--name web', 'vio', 'đặt tên do bạn chọn', 'duy nhất trên máy'],
    ['-p 8080:80', 'amb', 'cổng MÁY:CONTAINER', '8080 của bạn → 80 bên trong'],
    ['nginx:1.27-alpine', 'grn', 'ảnh : tag', 'ghim phiên bản cụ thể'],
  ];
  const fs = 26, cw = fs * 0.6;
  let x = 20, s = '';
  const xs = parts.map(([p]) => { const x0 = x; x += (p.length + 1) * cw; return [x0, x0 + p.length * cw]; });
  const total = x;
  const off = (1160 - total) / 2;
  parts.forEach(([p, c], i) => {
    const [a, b] = xs[i];
    s += `<rect x="${a + off - 4}" y="22" width="${b - a + 8}" height="44" rx="8" fill="${D[c]}" opacity=".16"/>`;
    s += `<text x="${a + off}" y="54" font-size="${fs}" font-family="${MONO}" font-weight="700" fill="${D[c]}">${esc(p)}</text>`;
  });
  const bw = 214, gap = 12, bx0 = (1160 - (5 * bw + 4 * gap)) / 2;
  parts.forEach(([, c, t, d], i) => {
    const [a, b] = xs[i], mid = (a + b) / 2 + off, bx = bx0 + i * (bw + gap);
    s += `<path d="M${mid} 70 C${mid} 120 ${bx + bw / 2} 120 ${bx + bw / 2} 168" stroke="${D[c]}" stroke-width="2.5" fill="none" marker-end="url(#m-${c === 'vio' ? 'vio' : c})"/>`;
    s += R(bx, 172, bw, 96, { c, fill: '#0f182a' });
    s += T(bx + bw / 2, 206, t, { fs: 16.5, a: 'middle', b: true });
    s += T(bx + bw / 2, 236, d, { fs: 14, a: 'middle', c: 'mu' });
  });
  return sv(1160, 280, s);
};

export const slides = S([
  cover({ t: 'Mục 0 — Docker giải quyết gì, và cài đặt', sub: 'Docker là gì &amp; ra đời thế nào · khi không có nó · cài đặt &amp; bạn vừa cài gì · năm phút đầu tiên', chap: 'MỤC 0' }),

  { t: 'Bản đồ Mục 0: hai bài “bắt đầu” + ba bài làm quen', body: mindmap('Mục 0', 'hiểu · muốn học · cài · chạy thử', [
    { t: 'Bắt đầu 1/2', d: 'Docker là gì, lịch sử 1979→nay, vì sao quan trọng với BẠN', c: 'dk' },
    { t: 'Bắt đầu 2/2', d: 'sự cố thật khi không có nó · cách học không nản', c: 'red' },
    { t: '0.1 Giải quyết gì', d: '3 cú hỏng, 4 thứ nó cho, 4 thứ nó KHÔNG phải', c: 'amb' },
    { t: '0.2 Cài đặt', d: 'Engine vs Desktop · Linux/Mac/Windows · CLI ↔ daemon', c: 'tea' },
    { t: '0.3 Năm phút đầu', d: 'web server · CSDL · nhìn vào trong · dọn sạch', c: 'grn' },
  ]) },

  /* ───────────── Bắt đầu 1/2 ───────────── */
  { t: 'Docker là “thùng hàng tiêu chuẩn” cho phần mềm', body: `${shipping()}
    ${box('info', '26/4/1956 tàu Ideal-X chở 58 thùng hàng từ Newark tới Houston; 1968–1970 kích thước thùng được chuẩn hoá ISO. Từ đó: <b>đóng gói một lần, chở bằng mọi phương tiện</b>. Docker làm đúng điều đó với ứng dụng: gói mã + thư viện + môi trường vào một <b>image</b>, máy nào có Docker cũng chạy y hệt.')}` },

  { t: 'Image là cái khuôn, container là bản đang chạy từ khuôn đó', body: `
    ${diagram({ w: 1160, h: 260, nodes: [
      { id: 'df', x: 10, y: 0, w: 250, h: 80, t: '📝 Dockerfile', d: 'công thức tự viết (Ch 4)', c: 'dim' },
      { id: 'rg', x: 10, y: 170, w: 250, h: 80, t: '☁️ Docker Hub', d: 'kho ảnh (registry)', c: 'blu' },
      { id: 'im', x: 390, y: 75, w: 290, h: 100, t: 'IMAGE', d: 'nginx:1.27-alpine\nchỉ đọc · đem đi được', c: 'dk' },
      { id: 'c1', x: 850, y: 0, w: 300, h: 72, t: 'container web', d: 'đang chạy · cổng 8080', c: 'grn' },
      { id: 'c2', x: 850, y: 94, w: 300, h: 72, t: 'container web2', d: 'đang chạy · cổng 8081', c: 'grn' },
      { id: 'c3', x: 850, y: 188, w: 300, h: 72, t: 'container thu', d: 'đã dừng (Exited)', c: 'dim', dash: true },
    ], edges: [
      { from: 'df', to: 'im', t: 'docker build', c: 'dim' },
      { from: 'rg', to: 'im', t: 'docker pull', c: 'blu' },
      { from: 'im', to: 'c1', t: 'docker run', c: 'grn' },
      { from: 'im', to: 'c2', c: 'grn' },
      { from: 'im', to: 'c3', c: 'dim', dash: true },
    ] })}
    ${two(box('tip', '<b>Giống lớp và đối tượng trong Java:</b> image là <code>class</code>, container là <code>new</code> — một khuôn, bao nhiêu bản cũng được, mỗi bản có dữ liệu riêng.'),
    box('info', 'Image lấy về từ <b>registry</b> (kho ảnh) như Docker Hub bằng <code>docker pull</code>, hoặc tự dựng từ Dockerfile bằng <code>docker build</code>.'))}` },

  { t: '“Docker” là cả một họ — đừng nhầm sáu cái tên', body: cards([
    { ic: '⚙️', t: 'Docker Engine', d: '<code>dockerd</code> — tiến trình nền tạo và chạy container. Miễn phí, mã nguồn mở, chạy trên Linux.', c: 'blu' },
    { ic: '⌨️', t: 'docker (CLI)', d: 'Lệnh bạn gõ. Chỉ là <strong>máy khách</strong>: gửi yêu cầu tới Engine qua socket.', c: 'tea' },
    { ic: '🖥', t: 'Docker Desktop', d: 'Mac/Windows: một <strong>máy ảo Linux</strong> có Engine + giao diện. Công ty ≥ 250 người hoặc ≥ 10 triệu USD/năm phải trả phí.', c: 'amb' },
    { ic: '☁️', t: 'Docker Hub', d: 'Kho ảnh công cộng mặc định: <code>nginx</code>, <code>postgres</code>, <code>node</code>… có ảnh “chính thức”.', c: 'vio' },
    { ic: '🧩', t: 'Docker Compose', d: 'Một file YAML mô tả cả hệ thống (web + api + db). <code>docker compose up</code> (Ch 9).', c: 'grn' },
    { ic: '🏢', t: 'Docker, Inc.', d: 'Công ty — trước năm 2013 tên là dotCloud. “Container” thì KHÔNG phải của riêng ai: đó là chuẩn mở OCI.', c: 'pnk' },
  ], 3) },

  { t: 'Container KHÔNG phải máy ảo thu nhỏ', body: two(
    `<div style="display:flex;gap:16px;justify-content:center">
      ${layers({ w: 260, cap: '<b>Máy ảo</b> — mỗi máy một nhân riêng', rows: [
        { t: 'Phần cứng', c: 'dim' }, { t: 'Hypervisor', c: 'vio' }, { t: 'Nhân khách + hệ điều hành', c: 'red' }, { t: 'Thư viện + app', c: 'dk' }] })}
      ${layers({ w: 260, cap: '<b>Container</b> — dùng chung nhân máy chủ', rows: [
        { t: 'Phần cứng', c: 'dim' }, { t: 'Nhân Linux của máy chủ', c: 'red' }, { t: 'Docker Engine', c: 'tea' }, { t: 'Thư viện + app', c: 'dk' }] })}
    </div>`,
    table(['', 'Máy ảo', 'Container'], [
      ['Khởi động', 'hàng chục giây', '+dưới 1 giây'],
      ['Kích thước ảnh', 'vài GB', '+vài chục–trăm MB'],
      ['RAM khi rảnh', 'giữ trước cả khối', '+dùng tới đâu lấy tới đó'],
      ['Nhân hệ điều hành', 'riêng từng máy', '!dùng chung một nhân'],
      ['Cô lập', '+mạnh', '!mỏng hơn (Ch 1, 6)'],
      ['Chạy Windows trên Linux', '+được', '-không'],
    ], { sm: true }), 'l') },

  { t: '45 năm dọn đường: từ chroot 1979 tới Docker 2013', body: `${timeline([
    ['1979', 'chroot', 'Unix V7: đổi thư mục gốc', 'dim'],
    ['03/2000', 'FreeBSD jails', 'chroot + cô lập mạng, user', 'mu'],
    ['2002', 'namespace', 'Linux 2.4.19 (mount)', 'tea'],
    ['02/2004', 'Solaris Zones', 'bản beta Solaris 10', 'mu'],
    ['2006 → 01/2008', 'cgroups', 'Google khởi xướng · Linux 2.6.24', 'amb'],
    ['08/2008', 'LXC', 'namespace + cgroup ghép lại', 'vio'],
    ['21/03/2013', 'Docker', 'Solomon Hykes, PyCon', 'dk'],
  ], { note: 'Nguồn: Wikipedia “Chroot”, “FreeBSD jail”, “Linux namespaces”, “Solaris Containers”, “Cgroups”, “LXC”, “Docker (software)” — kiểm 09/2026' })}
    ${box('tip', 'Docker <b>không phát minh</b> container — nhân Linux đã có đủ đồ nghề. Docker làm nó <b>dễ dùng</b>: một lệnh, một định dạng ảnh, một kho ảnh để chia sẻ.')}` },

  { t: 'Sau 2013: container thành CHUẨN chung của cả ngành', body: `${timeline([
    ['03/2013', 'Mã nguồn mở', 'dotCloud → Docker Inc.', 'dk'],
    ['09/06/2014', 'Docker 1.0', 'đủ ổn cho production', 'dk'],
    ['22/06/2015', 'OCI', 'chuẩn mở · runc tặng OCI', 'tea'],
    ['29/03/2017', 'containerd', 'tặng cho CNCF', 'tea'],
    ['13/11/2019', 'Mirantis', 'mua mảng Enterprise', 'mu'],
    ['08/2021', 'Desktop', 'thu phí công ty lớn', 'amb'],
    ['05/2022', 'Kubernetes 1.24', 'bỏ dockershim', 'vio'],
  ], { note: 'Nguồn: docker.com/blog (Docker 1.0) · Wikipedia “Docker (software)” · CNCF · mirantis.com · docs.docker.com · kubernetes.io — kiểm 09/2026' })}
    ${box('info', '<b>OCI</b> (Open Container Initiative) = ảnh bạn dựng bằng Docker chạy được trên Podman, containerd, Kubernetes, mọi đám mây. Kubernetes bỏ dockershim nhưng <b>ảnh Docker vẫn chạy nguyên</b> — vì chúng là ảnh OCI.')}` },

  { t: 'Vì sao nó ra đời: “máy em chạy được mà thầy!”', body: two(
    `${term(['# cùng một lệnh, ba phiên bản Node:', '$ docker run --rm node:18-alpine node -p process.versions.modules', '108', '$ docker run --rm node:20-alpine node -p process.versions.modules', '115', '$ docker run --rm node:22-alpine node -p process.versions.modules', '+ 127', '# mô-đun native (sharp, bcrypt…) dịch trên máy Node 22 mang số 127', '# đem sang server Node 18 (108) ⇒ không nạp được: "máy tôi chạy mà!"'], { title: 'output thật — máy Mac', fs: 14 })}
    ${box('good', 'Với Docker, phiên bản Node là <b>một dòng FROM</b> trong Dockerfile, không phải “cái máy chủ tình cờ cài gì”.')}`,
    table(['Không có Docker', 'Có Docker'], [
      ['-Laptop Node 22, server Node 18', '+Node nằm TRONG image — máy nào cũng như nhau'],
      ['-README cài đặt 8 bước, lệch từng máy', '+<code>docker compose up</code> — một dòng'],
      ['-Deploy = SSH vào gõ tay, sợ quên bước', '+Deploy = kéo đúng image đã chạy ở CI'],
      ['-Nâng cấp hệ điều hành ⇒ app chết lây', '+App mang thư viện riêng, host đổi không sao'],
    ], { sm: true }), 'l') },

  { t: 'Ai dùng Docker, để làm gì?', body: diagram({ w: 1160, h: 500, nodes: [
    { id: 'd', x: 455, y: 200, w: 250, h: 100, t: '🐳 Docker', d: 'một image · chạy mọi nơi', c: 'dk' },
    { id: 'a', x: 10, y: 10, w: 340, h: 92, t: '👩‍💻 Lập trình viên', d: 'CSDL, Redis, công cụ\nkhông cần cài lên máy', c: 'tea' },
    { id: 'b', x: 410, y: 10, w: 340, h: 92, t: '👥 Nhóm đồ án', d: 'cả nhóm chung một môi trường\ndocker compose up', c: 'grn' },
    { id: 'c', x: 810, y: 10, w: 340, h: 92, t: '🤖 CI (GitHub Actions)', d: 'test trong đúng image\nsẽ lên production', c: 'amb' },
    { id: 'e', x: 10, y: 398, w: 340, h: 92, t: '🚀 Deploy / DevOps', d: 'VPS kéo image, chạy,\nquay lui bằng tag cũ', c: 'vio' },
    { id: 'f', x: 410, y: 398, w: 340, h: 92, t: '🏠 Tự host', d: 'n8n, Uptime Kuma…\ntrên VPS / máy nhà', c: 'blu' },
    { id: 'g', x: 810, y: 398, w: 340, h: 92, t: '🧠 AI & dữ liệu', d: 'Ollama, Jupyter, GPU\n(Ch 14)', c: 'pnk' },
  ], edges: [
    { from: 'd', to: 'a', c: 'tea' }, { from: 'd', to: 'b', c: 'grn' }, { from: 'd', to: 'c', c: 'amb' },
    { from: 'd', to: 'e', c: 'vio' }, { from: 'd', to: 'f', c: 'blu' }, { from: 'd', to: 'g', c: 'pnk' },
  ] }) },

  { t: 'Quan trọng tới mức nào: 71,1% lập trình viên dùng Docker', body: two(
    `${bars([
      { l: 'Lập trình viên chuyên nghiệp', sub: 'khảo sát 2025', v: 73.8, txt: '73,8%', c: 'blu' },
      { l: 'Mọi người trả lời', sub: 'khảo sát 2025', v: 71.1, txt: '71,1%', c: 'tea' },
      { l: 'Mọi người trả lời', sub: 'khảo sát 2024', v: 53.9, txt: '53,9%', c: 'dim' },
      { l: 'Người đang học lập trình', sub: 'khảo sát 2025', v: 52.5, txt: '52,5%', c: 'grn' },
      { l: 'Kubernetes (để so)', sub: 'khảo sát 2025', v: 28.5, txt: '28,5%', c: 'vio' },
    ], { lw: 290, max: 80 })}`,
    `${kpis([{ v: '#1', l: 'công cụ phổ biến nhất nhóm “Cloud development” 2025', c: 'blu' }, { v: '+17', l: 'điểm % trong một năm — mức tăng lớn nhất khảo sát', c: 'grn' }])}
    ${box('info', 'Nguồn: Stack Overflow Developer Survey 2025 &amp; 2024, mục Technology. Câu hỏi 2025 có 24.473 người trả lời. Một phần mức tăng là do khảo sát 2025 gộp lại các nhóm công nghệ.')}`, 'l') },

  { t: 'Docker giúp gì cho BẠN — từ đồ án tới đi làm', body: cards([
    { ic: '🎓', t: 'Đồ án SWP391', d: 'Cả nhóm chạy <code>docker compose up</code> là có web + API + CSDL giống hệt. Hết cảnh “máy Windows của bạn không chạy”.', c: 'grn' },
    { ic: '🧪', t: 'Học CSDL, thử công nghệ', d: 'Postgres, MySQL, Mongo, Redis — mỗi thứ một lệnh, xoá là sạch, không rác trong máy.', c: 'tea' },
    { ic: '💼', t: 'Phỏng vấn thực tập', d: 'Image vs container? Volume để làm gì? <code>CMD</code> khác <code>ENTRYPOINT</code>? Exit 137 là gì? — khoá này trả lời hết.', c: 'amb' },
    { ic: '🚀', t: 'Đưa sản phẩm lên mạng', d: 'Một VPS 5 USD chạy cả hệ thống từ một file Compose; cập nhật và quay lui bằng tag ảnh.', c: 'vio' },
    { ic: '🛠', t: 'Công việc backend/DevOps', d: 'CI, Kubernetes, đám mây — đều bắt đầu từ một image. Docker là “chữ cái” của cả mảng này.', c: 'blu' },
    { ic: '🤝', t: 'Mã nguồn mở', d: 'Hầu hết dự án có <code>Dockerfile</code> / <code>compose.yaml</code>: đọc hiểu là chạy thử được trong vài phút.', c: 'pnk' },
  ], 3) },

  { t: 'Lộ trình toàn khoá — 17 phần', body: `${roadmap()}${legend()}` },

  /* ───────────── Bắt đầu 2/2 ───────────── */
  { t: 'Một tuần đồ án nhóm: không Docker vs có Docker (minh hoạ)', body: vs({
    no: { t: 'Không Docker', items: [
      'Thứ Hai: An cài Postgres 16, Bình cài 14, Chi dùng SQL Server “cho quen”',
      'Thứ Ba: migration chạy ở máy An, lỗi ở máy Bình — mất buổi tối',
      'Thứ Tư: Chi dùng Windows, đường dẫn <code>\\</code> vỡ script build',
      'Thứ Sáu: demo trên máy thầy — thiếu Redis, trang trắng trước hội đồng',
    ] },
    yes: { t: 'Có Docker + Compose', items: [
      'Một file <code>compose.yaml</code> ghim <code>postgres:16-alpine</code>, <code>redis:7-alpine</code>',
      'Máy nào cũng <code>docker compose up</code> ⇒ cùng phiên bản, cùng dữ liệu mẫu',
      'Windows chạy trong WSL2 — cùng Linux với cả nhóm',
      'Demo: một lệnh trên máy bất kỳ có Docker — đã thử trước ở CI',
    ] },
  }) },

  { t: 'Ba sự cố có thật — đã kiểm nguồn', body: cards([
    { ic: '💸', t: 'Knight Capital · 01/08/2012', d: 'Deploy TAY lên 8 máy chủ, kỹ thuật viên quên chép mã mới vào 1 máy, không ai kiểm lại. 45 phút mất <strong>hơn 460 triệu USD</strong> (theo SEC).', c: 'red' },
    { ic: '🪱', t: 'Graboid · 10/2019', d: 'Hơn 2.000 máy mở Docker API ra Internet <strong>không xác thực</strong>. Một con sâu tự chạy container đào tiền ảo, lây từ máy này sang máy khác (Unit 42).', c: 'amb' },
    { ic: '☠️', t: '17 ảnh độc trên Docker Hub · 2017–2018', d: 'Ảnh “tiện dụng” của một tài khoản lạ, <strong>5 triệu lượt kéo</strong>, cài sẵn máy đào Monero ~90.000 USD (Kromtech, Fortinet).', c: 'vio' },
  ], 3) + box('warn', 'Bài học chung: Docker giúp <b>deploy giống hệt nhau</b> (Knight), nhưng dùng <b>sai</b> thì chính Docker thành cửa hậu — đừng mở cổng 2375, chỉ dùng ảnh chính thức, ghim phiên bản (Ch 3, 6, 11, 15).') },

  { t: 'Bốn sự cố THẬT của một dự án sinh viên chạy Docker', body: table(['Chuyện gì xảy ra', 'Hậu quả', 'Nguyên nhân thật', 'Học ở'], [
    ['Đổi ảnh nền sang Alpine cho nhẹ', '-API chết 502 suốt 7 phút', 'Alpine dùng musl, Prisma mang engine glibc — build xanh, chạy thì không', 'Ch 6, 12'],
    ['Deploy chết giữa chừng', '-<code>no space left on device</code>', 'Cache build phình 7,6 GB trên chính đĩa chứa Postgres', 'Ch 5, 11'],
    ['<code>next build</code> bị giết', '-exit 137, deploy hỏng', 'Hai bản build song song vượt RAM 6 GB của VPS (OOM)', 'Ch 1, 11'],
    ['Sửa <code>nginx.conf</code> “thành công”', '!Không có gì thay đổi', 'Bind mount MỘT file, sửa bằng <code>mv</code> ⇒ container vẫn đọc bản cũ', 'Ch 7, 0.3'],
  ], { sm: true }) + box('good', 'Cả bốn đều chữa được trong vài phút <b>khi đã hiểu mô hình</b> — và cả bốn đều được dạy trong khoá này, kèm lệnh chẩn đoán.') },

  { t: 'Tình huống minh hoạ — rất có thể là nhóm bạn', body: table(['Tình huống', 'Cái giá', 'Docker (dùng đúng) ngăn thế nào', 'Chương'], [
    ['“Cài Postgres mất cả buổi chiều”', 'Sai cổng, sai mật khẩu, gỡ không sạch', '<code>docker run postgres:16-alpine</code> — 10 giây, xoá là sạch', '0.3, 7'],
    ['Demo chết trước hội đồng', 'Máy chấm thiếu một thư viện', 'Ảnh mang đủ thư viện; thử trước trên máy khác', '4, 10'],
    ['“Máy Windows của em không chạy”', 'Một thành viên ngồi chơi cả tuần', 'WSL2 + Compose: cùng Linux, cùng lệnh', '0.2, 13'],
    ['Server khác bản thư viện hệ thống', 'App lên mạng là lỗi <code>libssl</code>', 'Thư viện nằm trong ảnh, không phụ thuộc host', '0.1, 6'],
    ['Deploy tay quên một bước', 'Trang sập lúc nửa đêm', 'Deploy = kéo image + <code>up -d</code>; hỏng thì về tag cũ', '11, 16'],
  ], { sm: true }) },

  { t: 'Vì sao người mới hay bỏ Docker — và cách chữa', body: table(['Lý do bỏ cuộc', 'Cách chữa trong khoá này'], [
    ['Thuật ngữ tiếng Anh dồn dập: image, layer, volume, bind mount…', 'Nghĩa tiếng Việt ngay cạnh lần đầu gặp + ô 🗂 cuối mỗi bài'],
    ['Học thuộc lệnh, không hiểu mô hình ⇒ lệch một chút là bí', 'Chương 1: container = tiến trình + namespace + cgroup; ảnh = chồng tầng'],
    ['Chữ đỏ dài, đáng sợ', 'Đọc từ cuối lên: dòng cuối nói nguyên nhân (slide kế tiếp)'],
    ['Sợ làm hỏng máy / mất dữ liệu', 'Sân tập <code>~/thu-docker</code>, container vứt đi được, dọn bằng tên'],
    ['Đọc mà không làm', 'Mỗi bài một 🧪 làm ngay 15–20 phút, có tiêu chí “Đạt khi”'],
    ['Máy yếu, Docker Desktop ngốn RAM', 'Chỉnh RAM máy ảo, chạy ít container, dọn cache (0.2, Ch 13)'],
  ], { sm: true }) },

  { t: 'Đọc lỗi Docker: bỏ qua phần đầu, đọc cụm cuối', body: `${term([
    '$ docker run -d -p 18000:80 nginx:1.27-alpine',
    'docker: Error response from daemon: failed to set up container networking:',
    '  driver failed programming external connectivity on endpoint …:',
    '! Bind for 0.0.0.0:18000 failed: port is already allocated',
    '$ docker run -d --name web nginx:1.27-alpine',
    '! docker: Error response from daemon: Conflict. The container name "/web" is already in use …',
    '$ docker run --rm ngnix',
    '! … pull access denied for ngnix, repository does not exist or may require \'docker login\'',
    '$ docker ps          # giả lập Desktop chưa chạy (DOCKER_HOST sai)',
    '! failed to connect to the docker API at unix:///…/docker.sock; check if … the daemon is running',
  ], { title: 'output thật — máy Mac, Docker 29.8 (cắt bớt …)', fs: 14.5 })}
    ${table(['Cụm chữ', 'Nghĩa', 'Làm gì'], [
      ['port is already allocated', 'Cổng máy chủ đang bị giữ', '<code>docker ps</code>, đổi <code>-p 18001:80</code>'],
      ['name … already in use', 'Container cũ (kể cả đã dừng) giữ tên', '<code>docker rm -f web</code>'],
      ['pull access denied', 'Sai tên ảnh (ngnix) hoặc ảnh riêng tư', 'Kiểm chính tả trên Docker Hub'],
      ['failed to connect … daemon', 'Engine chưa chạy — CLI vô tội', 'Mở Docker Desktop / <code>systemctl status docker</code>'],
    ], { sm: true })}` },

  { t: 'Lộ trình: tối thiểu 2 tuần cho đồ án · đầy đủ 17 phần', body: `
    <div style="font-size:18px;font-weight:800;color:${D.grn};margin:0 0 8px">Tối thiểu — đủ cho đồ án nhóm (≈ 10 buổi × 1 giờ)</div>
    ${seg([
      { t: 'Mục 0', d: 'hiểu + cài', c: 'dim', w: 1 },
      { t: 'Ch 1', d: 'mô hình', c: 'blu', w: 1.2 },
      { t: 'Ch 2', d: 'chạy', c: 'blu', w: 1 },
      { t: 'Ch 4', d: 'Dockerfile', c: 'tea', w: 1.2 },
      { t: 'Ch 7', d: 'volume', c: 'vio', w: 1 },
      { t: 'Ch 8', d: 'mạng', c: 'pnk', w: 0.9 },
      { t: 'Ch 9', d: 'Compose', c: 'amb', w: 1.2 },
      { t: 'Ch 10', d: 'stack thật', c: 'grn', w: 1.2 },
    ], ['tuần 1', '', '', '', 'tuần 2', '', '', '', 'xong'])}
    <div style="font-size:18px;font-weight:800;color:${D.dk};margin:22px 0 8px">Đầy đủ — theo thứ tự, mỗi buổi một bài</div>
    ${seg([
      { t: '0–3', d: 'mô hình', c: 'blu', w: 1.2 }, { t: '4–6', d: 'dựng ảnh', c: 'tea', w: 1.2 },
      { t: '7–10', d: 'dữ liệu · mạng · Compose', c: 'vio', w: 1.6 }, { t: '11–12', d: 'production · chẩn đoán', c: 'red', w: 1.1 },
      { t: '13–16', d: 'dev · mọi việc · nâng cao · dự án', c: 'grn', w: 1.6 },
    ])}
    ${box('tip', 'Làm xong đồ án thì quay lại Ch 3, 5, 6 (ảnh nhỏ, dựng nhanh) và Ch 11–12 trước khi đưa gì lên VPS. Ch 12 mở ra giữa sự cố cũng được.')}` },

  { t: 'Nhịp một buổi học (~60 phút) và các mốc “mình làm được”', body: two(
    steps([
      ['Xem slide của bài', '5 phút — nắm hình trước'],
      ['Đọc bài giảng', '20 phút — gặp chữ lạ thì tra ô 🗂'],
      ['Gõ lại lệnh trong <code>~/thu-docker</code>', 'tự gõ, đừng dán — tay cũng phải học'],
      ['Làm 🧪 Thực hành', '15–20 phút, tới khi đạt tiêu chí'],
      ['Cuối chương: quiz 10 câu', 'đọc giải thích cả câu làm đúng'],
    ]),
    `${list([
      '🥉 <b>Mốc 1:</b> <code>hello-world</code> in ra “Hello from Docker!”',
      '🥈 <b>Mốc 2:</b> tự chạy Postgres trong container và kết nối được',
      '🥇 <b>Mốc 3:</b> tự viết Dockerfile cho app của mình',
      '🏅 <b>Mốc 4:</b> cả nhóm chạy đồ án bằng một lệnh <code>docker compose up</code>',
      '🏆 <b>Mốc 5:</b> app của bạn chạy trên VPS từ image bạn dựng',
    ])}
    ${box('good', 'Dừng khi còn muốn học tiếp — buổi mai sẽ dễ hơn.')}`) },

  /* ───────────── 0.1 ───────────── */
  { t: 'Ba cú hỏng quen thuộc — ba cơ chế của Docker chấm dứt chúng', body: table(['Cú hỏng', 'Gốc rễ', 'Docker làm gì', 'Chương'], [
    ['“Máy tôi chạy được”: <code>sharp</code> không nạp ở server', 'Môi trường KHÔNG nằm trong thứ bạn đem đi', '+Image gói cả Node, thư viện, mô-đun native', '1, 4'],
    ['README cài đặt 8 bước, mất một ngày', 'Mỗi máy một phiên bản', '+<code>docker compose up</code> — giống nhau tới từng byte', '9, 10'],
    ['<code>apt upgrade</code> làm app chết: thiếu <code>libssl.so.3</code>', 'App dùng chung thư viện với hệ điều hành', '+Container mang userland riêng; hỏng thì về ảnh cũ', '6, 11'],
  ], { sm: true }) + box('info', 'Cả ba cùng một bệnh: <b>môi trường không phải một phần của sản phẩm</b>. Docker biến môi trường thành một thứ có phiên bản, đem đi được, xoá đi dựng lại được.') },

  { t: 'Bốn thứ Docker cho bạn — và bốn thứ nó KHÔNG phải', body: two(
    cards([
      { ic: '🔁', t: 'Tái lập được', d: 'Cùng image ⇒ cùng môi trường ở laptop, CI, server.', c: 'grn' },
      { ic: '🧱', t: 'Cô lập', d: 'Node 18 và 22, Postgres 14 và 16 trên một máy.', c: 'tea' },
      { ic: '🗑', t: 'Vứt đi được', d: 'Phá hỏng? Xoá, 2 giây có cái mới.', c: 'blu' },
      { ic: '📦', t: 'Đem đi được', d: 'Một hiện vật có phiên bản trong registry.', c: 'vio' },
    ], 2),
    cards([
      { ic: '🖥', t: 'Không phải máy ảo', d: 'Không có nhân khách — là tiến trình.', c: 'red' },
      { ic: '🛡', t: 'Không phải két sắt', d: 'Dùng chung nhân: mã lạ cần hơn thế.', c: 'ora' },
      { ic: '🐢', t: 'Không tự nhanh/nhẹ', d: '1,4 GB hay 180 MB là do bạn (Ch 5–6).', c: 'amb' },
      { ic: '🚫', t: 'Không cho mọi thứ', d: 'Trang tĩnh trên CDN không cần container.', c: 'pnk' },
    ], 2)) },

  { t: 'Image = file chỉ-đọc + cách chạy; container = bản đang chạy', body: two(
    layers({ w: 520, cap: 'một container nginx đang chạy', rows: [
      { t: 'alpine — hệ thống file gốc', sz: 'chỉ đọc', k: 'IMAGE', c: 'tea' },
      { t: 'cài nginx', sz: 'chỉ đọc', k: 'IMAGE', c: 'dk' },
      { t: 'cấu hình: CMD nginx -g "daemon off;"', sz: 'siêu dữ liệu', k: 'IMAGE', c: 'blu' },
      { t: 'tầng nháp ghi được — log, file tạm', sz: 'mất khi rm', rw: true, k: 'CONTAINER' },
    ] }),
    `${list([
      '<b>Image</b>: một hệ thống file chỉ-đọc (xếp thành tầng) + siêu dữ liệu nói phải chạy lệnh gì.',
      '<b>Container</b>: một bản đang chạy của image + một tầng nháp ghi được nằm trên cùng.',
      'Một image ⇒ bao nhiêu container cũng được; xoá container không đụng tới image.',
    ])}
    ${box('warn', 'Tầng nháp chết theo container. Dữ liệu phải sống ⇒ <b>volume</b> (Ch 7).')}`, 'l') },

  { t: 'Đọc khoá này thế nào: phần đầu theo thứ tự, phần sau để tra', body: `${flow([
    { e: '🧠', t: 'Ch 1–3', d: 'theo thứ tự, ngồi trước terminal — dựng mô hình', c: 'blu' },
    { e: '🧱', t: 'Ch 4–6', d: 'mở sẵn dự án của bạn — mỗi bài sửa đúng file bạn cầm', c: 'tea' },
    { e: '🧩', t: 'Ch 7–10', d: 'cùng dựng một hệ thống — đọc theo thứ tự', c: 'vio' },
    { e: '🚑', t: 'Ch 11–12', d: 'đọc 11 trước khi lên server; 12 để tra', c: 'red' },
    { e: '✨', t: 'Ch 13–16', d: 'dev hằng ngày · mọi việc · nâng cao · dự án cuối', c: 'grn' },
  ])}
    ${box('info', '<b>Mới 09/2026:</b> Ch 13 Dev Containers, hot reload, DB cho test, Mac/Windows · Ch 14 công cụ không cần cài, tự host, GPU &amp; AI · Ch 15 buildx, rootless/Podman, Swarm, Kubernetes · Ch 16 dự án cuối khoá + bài thi 20 câu.')}` },

  /* ───────────── 0.2 ───────────── */
  { t: 'Linux chạy Docker thẳng; Mac và Windows có một máy ảo ở giữa', body: `${diagram({ w: 1160, h: 330, nodes: [
    { id: 'l', x: 10, y: 10, w: 360, h: 70, t: '🐧 Linux / VPS', d: 'Docker Engine', c: 'grn' },
    { id: 'lk', x: 10, y: 240, w: 360, h: 70, t: 'nhân Linux của MÁY', d: 'container chạy thẳng ở đây', c: 'red' },
    { id: 'm', x: 400, y: 10, w: 360, h: 70, t: '🍎 macOS', d: 'Docker Desktop (hoặc OrbStack, Colima)', c: 'amb' },
    { id: 'mv', x: 400, y: 125, w: 360, h: 70, t: 'máy ảo Linux nhỏ', d: 'có Engine · RAM/CPU/đĩa riêng', c: 'vio' },
    { id: 'mk', x: 400, y: 240, w: 360, h: 70, t: 'nhân linuxkit', d: 'container chạy trong máy ảo', c: 'red' },
    { id: 'w', x: 790, y: 10, w: 360, h: 70, t: '🪟 Windows', d: 'Docker Desktop + WSL2', c: 'blu' },
    { id: 'wv', x: 790, y: 125, w: 360, h: 70, t: 'WSL2 (máy ảo nhẹ)', d: 'Ubuntu của bạn sống ở đây', c: 'vio' },
    { id: 'wk', x: 790, y: 240, w: 360, h: 70, t: 'nhân Linux của WSL2', d: 'để mã TRONG /home/…', c: 'red' },
  ], edges: [
    { from: 'l', to: 'lk', c: 'grn' }, { from: 'm', to: 'mv', c: 'amb' }, { from: 'mv', to: 'mk', c: 'vio' },
    { from: 'w', to: 'wv', c: 'blu' }, { from: 'wv', to: 'wk', c: 'vio' },
  ] })}
    ${box('info', 'Container là tiến trình <b>Linux</b> ⇒ phải có một nhân Linux ở đâu đó. Trên Mac/Windows đó là máy ảo — vì thế file chia sẻ chậm hơn và <code>docker info</code> báo RAM của máy ảo.')}` },

  { t: 'Bạn cài năm gói — và lệnh docker chỉ là MÁY KHÁCH', body: `${diagram({ w: 1160, h: 150, nodes: [
    { id: 'cli', x: 10, y: 30, w: 230, h: 84, t: 'docker (CLI)', d: 'docker-ce-cli', c: 'blu' },
    { id: 'dd', x: 460, y: 30, w: 250, h: 84, t: 'dockerd', d: 'docker-ce', c: 'dk' },
    { id: 'cd', x: 910, y: 30, w: 240, h: 84, t: 'containerd', d: 'containerd.io', c: 'tea' },
  ], edges: [
    { from: 'cli', to: 'dd', t: 'HTTP · docker.sock', c: 'blu' },
    { from: 'dd', to: 'cd', t: 'giao việc chạy', c: 'dk' },
  ] })}
    ${table(['Gói', 'Là gì', 'Nếu thiếu'], [
      ['<code>docker-ce</code>', 'Engine — tiến trình nền <code>dockerd</code>', '-“Cannot connect to the Docker daemon”'],
      ['<code>docker-ce-cli</code>', 'Lệnh <code>docker</code> bạn gõ', '-<code>command not found</code>'],
      ['<code>containerd.io</code>', 'Runtime cấp thấp giám sát tiến trình container', '-Engine không khởi động'],
      ['<code>docker-buildx-plugin</code>', 'BuildKit: cache mount, đa nền tảng (Ch 5, 15)', '!build cũ, chậm, thiếu tính năng'],
      ['<code>docker-compose-plugin</code>', '<code>docker compose</code> (có dấu CÁCH)', '!phải dùng <code>docker-compose</code> v1 đã khai tử'],
    ], { sm: true })}` },

  { t: 'docker version in HAI phần vì có HAI chương trình', body: two(
    term(['$ docker version', 'Client:', ' Version:           29.8.0', ' API version:       1.56', '+  OS/Arch:           darwin/arm64', ' Context:           desktop-linux', '', 'Server: Docker Desktop 4.91.0 (239619)', ' Engine:', '  Version:          29.8.0', '  API version:      1.56 (minimum version 1.40)', '+   OS/Arch:          linux/arm64', ' containerd:', '  Version:          v2.3.4', ' runc:', '  Version:          1.4.3'], { title: 'output thật — máy Mac (cắt bớt dòng Go/Git commit)', fs: 14 }),
    `${box('info', '<b>Client</b> chạy trên macOS (<code>darwin/arm64</code>), <b>Server</b> chạy trong máy ảo Linux (<code>linux/arm64</code>). Hai hệ điều hành khác nhau — một lệnh.')}
    ${table(['Thấy', 'Nghĩa là'], [
      ['Có cả Client + Server', '+Mọi thứ ổn'],
      ['Chỉ có Client, rồi lỗi “failed to connect”', '-Engine / Desktop chưa chạy'],
      ['permission denied … docker.sock', '!Linux: chưa vào nhóm <code>docker</code> ⇒ dùng <code>sudo</code>'],
    ], { sm: true })}
    ${term(['$ docker compose version', 'Docker Compose version v5.5.1'], { title: 'máy Mac', fs: 14 })}`, 'l') },

  { t: 'Vào nhóm docker = có quyền root, không cần mật khẩu', body: two(
    term(['$ id -nG', 'Cuong03dx wheel dialout docker', '$ wc -l /etc/shadow', '! wc: /etc/shadow: Permission denied', '# nhờ Docker đọc hộ — không sudo, không mật khẩu:', '$ docker run --rm -v /etc:/h:ro alpine sh -c \\', '    \'id; wc -l /h/shadow\'', '+ uid=0(root) gid=0(root) groups=0(root),…', '+ 54 /h/shadow'], { title: 'output thật — máy Linux (chỉ ĐỌC, đếm dòng)' }),
    `${box('bad', 'Tài khoản thường không đọc nổi <code>/etc/shadow</code> (file mật khẩu). Qua Docker thì đọc được — vì <code>dockerd</code> chạy bằng root và làm theo lệnh bất kỳ ai trong nhóm <code>docker</code>.')}
    ${list([
      'Laptop của bạn: thêm mình vào nhóm là hợp lý.',
      'Server dùng chung / production: chỉ người đã có <code>sudo</code>, hoặc dùng <b>rootless</b> (Ch 15).',
      '<b>Đừng bao giờ</b> mở Docker API ra mạng (cổng 2375) — đó chính là cửa của sâu Graboid.',
    ])}`, 'l') },

  { t: 'Trên Mac: máy ảo có RAM riêng, và file phải vượt biên', body: two(
    `${term(['$ docker info --format \\', '  \'{{.OperatingSystem}} · {{.Architecture}} · {{.NCPU}} CPU · {{.MemTotal}}\'', '+ Docker Desktop · aarch64 · 10 CPU · 8319504384', '$ docker info --format \'{{.DockerRootDir}}\'', '/var/lib/docker          # nằm TRONG máy ảo', '$ docker run --rm alpine uname -m', 'aarch64                  # Mac M1 = ARM, VPS thường = x86_64'], { title: 'output thật — máy Mac (32 GB RAM)' })}
    ${box('warn', '<code>8319504384</code> byte = <b>7,7 GiB</b> — RAM của máy ảo, không phải 32 GB của Mac. Build Next.js hay chết ⇒ tăng ở Docker Desktop → Settings → Resources.')}`,
    `${cards([
      { ic: '🍎', t: 'macOS', d: 'Chia sẻ file qua VirtioFS: ổn cho mã nguồn, chậm với <code>node_modules</code> 40.000 file.', c: 'amb' },
      { ic: '🪟', t: 'Windows', d: 'Để dự án trong <code>/home/bạn/…</code> của WSL, <strong>không</strong> ở <code>/mnt/c/…</code> — nhanh hơn cả chục lần, hot reload mới chạy.', c: 'blu' },
      { ic: '🧬', t: 'ARM vs x86', d: 'Mac M1 dựng ảnh <code>arm64</code>; VPS là <code>amd64</code>. Ch 15 dạy dựng đa nền tảng.', c: 'vio' },
    ], 1)}`, 'l') },

  { t: 'hello-world: năm bước gói trong một lệnh', body: two(
    term(['$ docker run hello-world', 'Unable to find image \'hello-world:latest\' locally', 'latest: Pulling from library/hello-world', '58dee6a49ef1: Pull complete', 'Digest: sha256:5e23090353324d887c48ad5e5c56d294eab8…', 'Status: Downloaded newer image for hello-world:latest', '', '= Hello from Docker!', 'This message shows that your installation appears', 'to be working correctly.', '$ docker ps -a --format \'table {{.Names}}\\t{{.Status}}\'', 'NAMES          STATUS', '+ dk00-hello     Exited (0) Less than a second ago'], { title: 'output thật — máy Mac, lần kéo đầu tiên', fs: 14 }),
    steps([
      ['CLI hỏi Engine: “có ảnh <code>hello-world</code> chưa?”', 'chưa ⇒ <code>Unable to find image … locally</code>'],
      ['Kéo từ Docker Hub', '<code>hello-world</code> = <code>docker.io/library/hello-world:latest</code>'],
      ['Tải từng tầng', 'mỗi dòng <code>Pull complete</code> là một tầng (Ch 1)'],
      ['Digest — danh tính theo nội dung', 'tag thì trôi, digest thì không (Ch 3)'],
      ['Tạo + chạy container, in chữ, thoát', 'container vẫn nằm đó ở trạng thái Exited (0)'],
    ]), 'l') },

  /* ───────────── 0.3 ───────────── */
  { t: 'Giải phẫu một lệnh docker run', body: `${anatomy()}
    ${term(['$ docker run -d --name web -p 18000:80 nginx:1.27-alpine', 'd9c3098effe22e3aaa6c9275dba97d435aa584b8c6fa1404d1b20ac36d3ea6d8   # ID đầy đủ', '$ curl -s localhost:18000 | head -4', '<!DOCTYPE html>', '<html>', '<head>', '+ <title>Welcome to nginx!</title>'], { title: 'output thật — máy Mac (cổng 18000 thay cho 8080 trong bài)' })}` },

  { t: '-p MÁY:CONTAINER — gõ cửa máy, Docker chuyển vào trong', body: `${diagram({ w: 1160, h: 220, nodes: [
    { id: 'b', x: 10, y: 60, w: 250, h: 90, t: '🌐 Trình duyệt / curl', d: 'localhost:8080', c: 'blu' },
    { id: 'h', x: 380, y: 60, w: 300, h: 90, t: 'MÁY của bạn · cổng 8080', d: 'Docker giữ cổng này', c: 'amb' },
    { id: 'c', x: 820, y: 30, w: 330, h: 150, t: 'container web', d: 'nginx lắng nghe cổng 80\nmạng riêng 172.17.0.x\nkhông biết gì về 8080', c: 'grn' },
  ], edges: [
    { from: 'b', to: 'h', t: 'gõ 8080', c: 'blu' },
    { from: 'h', to: 'c', t: 'chuyển tới :80', c: 'amb' },
  ] })}
    ${two(table(['Viết', 'Kết quả'], [
      ['<code>-p 8080:80</code>', '+localhost:8080 → nginx'],
      ['<code>-p 80:8080</code>', '-Chuyển tới cổng 8080 trong container — nginx không nghe ở đó'],
      ['<code>-p 8081:80</code>', '+Container thứ hai, cổng máy khác'],
      ['(không có <code>-p</code>)', '!Chạy nhưng từ máy không gọi vào được'],
    ], { sm: true }),
    box('tip', 'Nhớ: <b>trái là máy của tôi, phải là trong hộp</b>. Hai container cùng nghe <code>:80</code> bên trong thoải mái — chỉ cổng BÊN TRÁI là không được trùng.'), 'l2')}` },

  { t: 'Bên trong chỉ có vài tiến trình — và chúng hiện ra ở máy chủ', body: two(
    term(['$ docker exec web ps aux', 'PID   USER     TIME  COMMAND', '+    1 root      0:00 nginx: master process nginx -g daemon off;', '   30 nginx     0:00 nginx: worker process', '   …  (mỗi CPU một worker — Mac cấp 10 CPU ⇒ 10 dòng)', '   39 nginx     0:00 nginx: worker process', '   40 root      0:00 ps aux'], { title: 'output thật — máy Mac' }),
    `${term(['$ docker inspect -f \'{{.State.Pid}}\' web', '388192', '$ ps -o pid,user,args -p 388192', '    PID USER     COMMAND', '+ 388192 root     nginx: master process nginx -g daemon off;', '$ docker exec web ps -o pid,args | head -2', 'PID   COMMAND', '+    1 nginx: master process nginx -g daemon off;'], { title: 'máy Linux: MỘT tiến trình, hai PID', fs: 13.5 })}
    ${box('info', 'Máy ảo chạy nginx có cả trăm tiến trình. Container chỉ có thứ bạn yêu cầu. Trên Mac, <code>ps</code> của macOS <b>không</b> thấy nginx (nó ở trong máy ảo) — dùng <code>docker top web</code>.')}`, 'l') },

  { t: 'Bind mount: gắn cả THƯ MỤC, đừng gắn một file lẻ', body: two(
    term(['# gắn MỘT FILE', '$ docker run -d --name web -p 18000:80 \\', '    -v "$PWD/index.html:/usr/share/nginx/html/index.html:ro" \\', '    nginx:1.27-alpine', '$ curl -s localhost:18000', '= <h1>Xin chào từ một container</h1>', '# lưu kiểu ghi-file-mới-rồi-đổi-tên (nhiều trình soạn thảo làm vậy):', '$ echo \'<h1>Bản mới</h1>\' > index.new && mv index.new index.html', '$ curl -s localhost:18000 | head -2', '! <html>', '! <head><title>404 Not Found</title></head>'], { title: 'output thật — máy Mac', fs: 13.5 }),
    `${term(['# gắn cả THƯ MỤC', '$ docker run -d --name web -p 18000:80 \\', '    -v "$PWD/site:/usr/share/nginx/html:ro" \\', '    nginx:1.27-alpine', '$ echo \'<h1>Bản 2 — lưu kiểu mv</h1>\' > site/tmp.html \\', '    && mv site/tmp.html site/index.html', '$ curl -s localhost:18000', '= <h1>Bản 2 — lưu kiểu mv</h1>'], { title: 'output thật — máy Mac', fs: 13.5 })}
    ${box('warn', 'Gắn file lẻ là gắn theo <b>inode</b>: file bị thay bằng <code>mv</code> ⇒ container mất file (Mac) hoặc đọc bản cũ mãi (Linux). Đây chính là sự cố <code>nginx.conf</code> ở slide 16.')}`, 'l') },

  { t: 'Postgres một lệnh — nhưng dữ liệu nằm ở volume vô danh', body: two(
    `${term(['$ docker run -d --name db -e POSTGRES_PASSWORD=devpass \\', '    -e POSTGRES_DB=app_dev -p 18001:5432 postgres:16-alpine', '$ docker exec db psql -U postgres -d app_dev -c \'select version();\'', '+ PostgreSQL 16.14 on aarch64-unknown-linux-musl, compiled by gcc …', '$ docker run -d --name db14 … -p 18003:5432 postgres:14-alpine', '$ docker stats --no-stream --format \'table {{.Name}}\\t{{.MemUsage}}\'', 'NAME   MEM USAGE / LIMIT', 'web    8.477MiB / 7.748GiB', 'db     23.92MiB / 7.748GiB', 'db14   21.24MiB / 7.748GiB'], { title: 'output thật — máy Mac', fs: 13 })}`,
    `${term(['$ docker inspect db --format \\', '    \'{{range .Mounts}}{{.Type}} {{.Name}}{{end}}\'', '+ volume 429a8358ea06b94dc4721786dc77…', '$ docker rm -f db', '$ docker volume ls', 'DRIVER    VOLUME NAME', '! local     429a8358ea06b94dc4721786dc77…   # vẫn còn!'], { title: 'output thật — máy Mac' })}
    ${box('warn', 'Ảnh postgres tự tạo một <b>volume vô danh</b>. Lệnh <code>docker&nbsp;rm&nbsp;-f</code> không xoá nó: dữ liệu KHÔNG theo sang container mới (container mới nhận volume mới rỗng), mà volume cũ nằm lại ăn đĩa. <code>docker&nbsp;rm&nbsp;-fv</code> xoá cả hai. Cách đúng: đặt tên volume (Ch 7).')}`, 'l') },

  { t: 'Container dùng một lần — rồi dọn sạch thật sự', body: two(
    term(['$ docker run --rm node:22-alpine \\', '    node -e \'console.log(process.version, 2**32)\'', 'v22.23.2 4294967296', '$ echo \'{"b":2,"a":1}\' | docker run --rm -i ghcr.io/jqlang/jq -S .', '{', '  "a": 1,', '  "b": 2', '}', '$ docker run --rm python:3.12-alpine python -c \\', '    \'import sys,platform; print(sys.version.split()[0], platform.machine())\'', '3.12.13 aarch64'], { title: 'output thật — máy Mac: không cài Node, jq hay Python', fs: 13 }),
    `${table(['Lệnh', 'Xoá gì', 'Để lại gì'], [
      ['<code>--rm</code> khi chạy', 'container ngay khi thoát', 'ảnh (để lần sau nhanh)'],
      ['<code>docker rm -f web</code>', 'container', '!volume vô danh của nó'],
      ['<code>docker rm -fv db</code>', 'container + volume vô danh', 'ảnh'],
      ['<code>docker image rm postgres:14-alpine</code>', 'ảnh (khi không container nào dùng)', '—'],
      ['<code>docker system prune</code>', 'container dừng, mạng thừa, ảnh treo, cache build', '!ảnh có tag và volume'],
    ], { sm: true })}
    ${box('tip', '<code>docker system df</code> cho biết Docker đang ngốn bao nhiêu đĩa. Dọn <b>theo tên</b> thứ bạn tạo — đừng prune bừa trên máy có dự án khác.')}`, 'l') },

  /* ───────────── Cuối mục ───────────── */
  { t: 'Sai lầm hay gặp ở Mục 0', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['“Cannot connect / failed to connect to the docker API”', 'Engine chưa chạy — không phải lỗi CLI', 'Mở Docker Desktop · <code>sudo systemctl start docker</code>'],
    ['<code>permission denied … docker.sock</code>', 'Linux: chưa ở nhóm <code>docker</code>', '<code>sudo usermod -aG docker $USER</code> rồi đăng nhập lại'],
    ['<code>port is already allocated</code>', 'Container khác / tiến trình khác giữ cổng máy', '<code>docker ps</code>; đổi cổng trái của <code>-p</code>'],
    ['Tên đã dùng dù “không chạy gì”', 'Container Exited (hoặc Created do lần run lỗi) vẫn giữ tên', '<code>docker ps -a</code> rồi <code>docker rm</code>'],
    ['Sửa file mà container không thấy', 'Bind mount MỘT file + trình soạn thảo lưu bằng đổi tên', 'Gắn cả thư mục'],
    ['Đĩa đầy dần', 'Volume vô danh mồ côi + ảnh + cache', '<code>docker system df</code>; <code>rm -v</code>; dọn theo tên'],
    ['<code>docker-compose</code> báo lỗi lạ', 'Đang dùng Compose v1 (Python) đã khai tử', '<code>docker compose</code> (dấu cách)'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Mục 0', body: table(['Muốn…', 'Gõ'], [
    ['Kiểm cài đặt: client + server', '<code>docker version</code> · <code>docker info</code>'],
    ['Chạy thử lần đầu', '<code>docker run hello-world</code>'],
    ['Web server chạy nền, mở cổng', '<code>docker run -d --name web -p 8080:80 nginx:1.27-alpine</code>'],
    ['Xem container đang chạy / mọi container', '<code>docker ps</code> · <code>docker ps -a</code>'],
    ['Log · tài nguyên · tiến trình', '<code>docker logs web</code> · <code>docker stats --no-stream</code> · <code>docker top web</code>'],
    ['Vào bên trong', '<code>docker exec -it web sh</code>'],
    ['Phục vụ thư mục của mình', '<code>-v "$PWD/site:/usr/share/nginx/html:ro"</code>'],
    ['Công cụ dùng một lần', '<code>docker run --rm -it python:3.12-alpine python</code>'],
    ['Xoá container (+ volume vô danh)', '<code>docker rm -f web</code> · <code>docker rm -fv db</code>'],
    ['Docker ngốn bao nhiêu đĩa', '<code>docker system df</code>'],
  ], { sm: true }) },

  { t: 'Thực hành Mục 0 (40 phút)', body: `
    ${steps([
      ['Cài Docker, chạy <code>docker version</code>: thấy đủ Client + Server', 'Mac/Windows: mở Docker Desktop trước'],
      ['<code>docker run hello-world</code>, đọc từng dòng, rồi <code>docker ps -a</code>', 'vì sao container vẫn còn?'],
      ['Chạy nginx ở cổng 8080, phục vụ THƯ MỤC <code>~/thu-docker/site</code> của bạn', 'sửa file, tải lại trình duyệt'],
      ['Chạy Postgres 16 và 14 cùng lúc, hỏi <code>show server_version</code> từng cái', 'hai cổng máy khác nhau'],
      ['Dọn: <code>docker rm -fv</code> theo tên, rồi <code>docker ps -a</code> và <code>docker volume ls</code>', 'không còn gì của bạn'],
    ])}
    ${box('good', '<b>Đạt khi:</b> trình duyệt hiện trang của chính bạn, hai Postgres báo <code>16.x</code> và <code>14.x</code>, và sau khi dọn không còn container hay volume vô danh nào bạn tạo.')}` },
]).map((x) => ({ ...x, body: TCSS + x.body }));
