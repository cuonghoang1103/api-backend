/**
 * Docker · Deck dk-01 — Chương 1: Container & image — mô hình tư duy.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 23/09/2026:
 *   • "máy Linux"  = Fedora 44, nhân 7.1.3, Docker Engine 29.6.2 (containerd 2.2.6, runc 1.3.6), amd64,
 *                    kho ảnh containerd (docker info → Driver: overlayfs)
 *   • "máy Mac"    = Mac M1, Docker Desktop 4.91 / Engine 29.8.0 (containerd 2.3.4, runc 1.4.3), arm64
 * Tên container trong output mang tiền tố dk01- (luật an toàn của khoá); trong bài người học dùng tên ngắn.
 *
 * Hình tự vẽ (SVG nội tuyến, không đụng thư viện): sv()/R()/T()/A() bên dưới —
 * dùng cho "tiến trình đeo kính", cây overlay lowerdir/upperdir/merged, dòng thời gian SIGTERM→SIGKILL.
 */
import { S, cover, cards, box, steps, table, vs, kpis, flow, two, list, mindmap, layers, host, term as dkTerm, diagram, yaml, bars, esc, D } from './_dk-chung.mjs';

/** terminal của deck này: dấu nhắc ngắn "~" để dòng lệnh dài không phải xuống dòng. */
const term = (lines, { title } = {}) => dkTerm(lines, { title, dir: '~' });
/** chữ terminal 15px trên mọi slide của deck (mặc định 16px làm lệnh docker dài bị gãy dòng). */
const TCSS = '<style>.g-term pre{font-size:15px;line-height:1.45}</style>';

export const deck = { key: 'dk-01', code: 'DOCKER · CHƯƠNG 1', title: 'Container & image: mô hình tư duy', sub: 'Docker · Chương 1' };

/* ───────────── SVG nhỏ tự vẽ ───────────── */
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

/* Slide 3 — một tiến trình đeo hai lớp "kính" */
const procLens = () => sv(600, 440,
  R(6, 6, 588, 268, { c: 'dk', dash: true, fill: 'rgba(36,150,237,.06)' }) +
  T(24, 36, 'NAMESPACE — nó NHÌN THẤY gì', { fs: 18, c: 'dk', b: true }) +
  T(24, 60, 'cây file riêng · PID riêng · mạng riêng · tên máy riêng', { fs: 15, c: 'mu' }) +
  R(36, 80, 528, 176, { c: 'amb', fill: 'rgba(255,194,51,.06)' }) +
  T(54, 108, 'CGROUP — nó DÙNG được bao nhiêu', { fs: 18, c: 'amb', b: true }) +
  T(54, 132, '≤ 256 MB RAM · ≤ 0,5 CPU · ≤ N tiến trình', { fs: 15, c: 'mu' }) +
  R(70, 150, 460, 88, { c: 'grn', fill: '#0d1628' }) +
  T(300, 184, 'nginx: master process', { fs: 19, a: 'middle', b: true, mono: true }) +
  T(300, 214, 'bên trong: PID 1 · trên máy chủ: PID 367975', { fs: 15, a: 'middle', c: 'mu' }) +
  [['systemd', 20], ['sshd', 155], ['dockerd', 290]].map(([n, x]) => R(x, 300, 120, 42, { c: 'dim' }) + T(x + 60, 327, n, { fs: 16, a: 'middle', mono: true })).join('') +
  T(20, 294, 'tiến trình khác của máy chủ', { fs: 13.5, c: 'mu' }) +
  A(480, 256, 480, 378, { c: 'grn' }) + T(470, 290, 'gọi thẳng vào nhân', { fs: 14, c: 'grn', a: 'end' }) +
  R(6, 382, 588, 52, { c: 'red', fill: 'rgba(255,92,108,.08)' }) +
  T(300, 414, 'NHÂN LINUX của máy chủ — chỉ có MỘT', { fs: 19, a: 'middle', b: true }));

/* Slide 11 — overlay: các tầng chỉ-đọc + tầng ghi ⇒ một cây / */
const overlay = () => {
  const cols = ['bin/sh', 'usr/local/bin/node', 'docker-entrypoint.sh', 'data/note.txt'];
  const x0 = 330, cw = 205, rh = 44;
  const rows = [
    { n: 'merged — tiến trình thấy là /', s: 'không có thư mục riêng: là phép hợp', c: 'grn', cells: ['từ tầng 1', 'từ tầng 2', 'bản ĐÃ SỬA', 'file mới'] },
    { n: 'upperdir — tầng ghi của container', s: 'snapshots/18482 · rỗng lúc đầu', c: 'amb', cells: [0, 0, 'bản chép lên', 'mới tạo'] },
    { n: 'tầng 4 · COPY entrypoint', s: 'snapshots/18480 · chỉ đọc', c: 'dk', cells: [0, 0, 'bản gốc 388 B', 0] },
    { n: 'tầng 2 · RUN cài node', s: 'snapshots/18478 · chỉ đọc', c: 'dk', cells: [0, 'node 126 MB', 0, 0] },
    { n: 'tầng 1 · ADD alpine rootfs', s: 'snapshots/18444 · DÙNG CHUNG', c: 'tea', cells: ['busybox', 0, 0, 0] },
  ];
  let s = cols.map((c, i) => T(x0 + i * cw + cw / 2, 18, c, { fs: 14.5, a: 'middle', c: 'mu', mono: true })).join('');
  rows.forEach((r, k) => {
    const y = 30 + k * (rh + 10) + (k ? 16 : 0);
    s += R(0, y, 316, rh, { c: r.c, fill: '#0f182a', r: 9 }) + T(12, y + 19, r.n, { fs: 15.5, b: true }) + T(12, y + 37, r.s, { fs: 13, c: 'mu', mono: true });
    r.cells.forEach((v, i) => {
      if (!v) return;
      const x = x0 + i * cw + 8;
      s += R(x, y + 6, cw - 16, rh - 12, { c: r.c, fill: k === 0 ? 'rgba(63,185,80,.12)' : '#0d1628', r: 8, sw: 2 }) +
        T(x + (cw - 16) / 2, y + 28, v, { fs: 15, a: 'middle', b: k === 0 });
    });
  });
  // đường chia merged / các tầng
  s += `<line x1="0" y1="${30 + rh + 13}" x2="1150" y2="${30 + rh + 13}" stroke="${D.grn}" stroke-width="2" stroke-dasharray="4 6"/>`;
  s += T(740, 332, '▲ đọc từ trên xuống: file có ở nhiều tầng thì tầng TRÊN nhất thắng', { fs: 14.5, a: 'middle', c: 'grn' });
  return sv(1150, 340, s);
};

/* Slide 17 — dòng thời gian docker stop (số đo thật trên máy Linux) */
const stopTimeline = () => {
  const X = (t) => 250 + t * 80; // 0..11 s
  let s = '';
  for (let t = 0; t <= 11; t++) s += `<line x1="${X(t)}" y1="30" x2="${X(t)}" y2="330" stroke="#1d2a40" stroke-width="1"/>` + T(X(t), 352, `${t}s`, { fs: 14, a: 'middle', c: 'dim', mono: true });
  const row = (y, name, sub, endT, endLbl, c) => {
    s += T(0, y + 10, name, { fs: 17, b: true }) + T(0, y + 32, sub, { fs: 14, c: 'mu' });
    s += `<rect x="${X(0)}" y="${y - 6}" width="${Math.max(6, X(endT) - X(0))}" height="30" rx="6" fill="${D[c]}" opacity=".22"/>`;
    s += `<circle cx="${X(0)}" cy="${y + 9}" r="7" fill="${D.amb}"/>`;
    s += `<circle cx="${X(endT)}" cy="${y + 9}" r="8" fill="${D[c]}"/>` + T(X(endT) + 14, y + 15, endLbl, { fs: 16, c, b: true, mono: true });
  };
  row(60, 'sleep làm PID 1', 'không bắt SIGTERM', 10, '', 'red');
  s += T(X(0) + 14, 58, 'SIGTERM… bị phớt lờ', { fs: 14.5, c: 'amb' });
  s += `<path d="M${X(10)} 40 L${X(10)} 100" stroke="${D.red}" stroke-width="3"/>` + T(X(10) - 8, 38, 'kill 9 → die 137', { fs: 15, c: 'red', b: true, mono: true, a: 'end' });
  row(170, 'sleep + --init', 'tini chuyển tiếp tín hiệu', 0.1, 'die 143 · 0,12 s', 'grn');
  row(260, 'nginx (tự bắt SIGTERM)', 'đóng kết nối rồi thoát', 0.2, 'die 0 · 0,20 s', 'grn');
  s += T(X(0), 395, '● kill 15 = SIGTERM lúc bấm docker stop', { fs: 15, c: 'amb' });
  return sv(1150, 405, s);
};

export const slides = S([
  cover({ t: 'Chương 1 — Container &amp; image: mô hình tư duy', sub: 'Namespace &amp; cgroup · chồng tầng · vòng đời &amp; PID 1 · tầng ghi được · ai thật sự chạy container', chap: 'CHƯƠNG 1' }),

  { t: 'Bản đồ chương: 5 câu hỏi, 5 bài', body: mindmap('Mô hình Docker', 'hiểu nó ⇒ đoán trước mọi lệnh', [
    { t: '1.1 Container là gì', d: 'một tiến trình + namespace (thấy gì) + cgroup (dùng bao nhiêu)', c: 'dk' },
    { t: '1.2 Image là gì', d: 'chồng tầng chỉ-đọc, băm theo nội dung, xếp bằng overlayfs', c: 'tea' },
    { t: '1.3 Vòng đời &amp; PID 1', d: 'create → start → stop (SIGTERM → SIGKILL), mã thoát', c: 'amb' },
    { t: '1.4 Tầng ghi được', d: 'vì sao dữ liệu mất khi rm — và cứu nó ra sao', c: 'red' },
    { t: '1.5 Ai chạy container', d: 'CLI → dockerd → containerd → shim → runc', c: 'vio' },
  ]) },

  /* ───────────── 1.1 ───────────── */
  { t: 'Container là một TIẾN TRÌNH đeo hai lớp kính', body: two(
    procLens(),
    `${term(['# trên máy Linux, nhìn từ NGOÀI container', '$ docker run -d --name web nginx:1.27-alpine', '$ docker inspect -f \'{{.State.Pid}}\' web', '367975', '$ ps -o pid,user,args -p 367975', '    PID USER     COMMAND', '+ 367975 root     nginx: master process nginx…'], { title: 'output thật — máy Linux, Docker 29.6' })}
    ${box('info', 'Không có “lời gọi hệ thống container”. Máy chủ thấy nginx như MỌI tiến trình khác — chỉ là nó bị bật thêm <b>namespace</b> và <b>cgroup</b>.')}`, 'l') },

  { t: 'Mỗi container có 7 namespace riêng — trừ user', body: `
    ${term(['$ PID=$(docker inspect -f \'{{.State.Pid}}\' web)', '$ docker run --rm --pid=host alpine ls -l /proc/$PID/ns   # không cần sudo', '$ ls -l /proc/self/ns                                   # namespace của shell bạn'], { title: 'máy Linux — so hai danh sách' })}
    ${table(['Namespace', 'Shell của bạn', 'Container web', 'Nghĩa là'], [
      ['<code>mnt</code>', '4026531832', '4026532607', '+Cây file riêng (của ảnh)'],
      ['<code>pid</code>', '4026531836', '4026532611', '+Đánh số riêng: nginx là PID 1'],
      ['<code>net</code>', '4026531833', '4026532675', '+Card mạng, cổng, localhost riêng'],
      ['<code>uts</code> · <code>ipc</code> · <code>cgroup</code>', '…838 · …839 · …835', '…609 · …610 · …674', '+Tên máy · bộ nhớ chia sẻ · cây cgroup riêng'],
      ['<code>time</code>', '4026531834', '4026532895', '!Riêng — nhưng giờ thực KHÔNG ảo hoá được'],
      ['<code>user</code>', '4026531837', '4026531837', '-GIỐNG ⇒ root trong container = root máy chủ'],
    ], { sm: true })}` },

  { t: 'Chỉ có MỘT nhân — trên Mac, đó là nhân của máy ảo', body: two(
    `${term(['$ uname -r', '7.1.3-201.fc44.x86_64', '$ docker run --rm alpine uname -r', '7.1.3-201.fc44.x86_64', '$ docker run --rm ubuntu:24.04 uname -r', '7.1.3-201.fc44.x86_64'], { title: 'máy Linux — 3 “hệ điều hành”, 1 nhân' })}
    ${term(['$ uname -r', '27.0.0                      # nhân Darwin của macOS', '$ docker run --rm alpine uname -r', '+ 7.0.12-linuxkit           # nhân của máy ảo Docker Desktop', '$ docker info --format \'{{.NCPU}} CPU {{.MemTotal}}\'', '10 CPU 8319504384            # 7,7 GiB — Mac có 32 GB'], { title: 'máy Mac M1' })}`,
    `<div style="display:flex;gap:16px;justify-content:center">
      ${layers({ w: 250, cap: '<b>Máy ảo</b> · khởi động ~chục giây', rows: [
        { t: 'Phần cứng', c: 'dim' }, { t: 'Hypervisor', c: 'vio' }, { t: 'Nhân khách riêng', c: 'red' }, { t: 'Thư viện + app', c: 'dk' }] })}
      ${layers({ w: 250, cap: '<b>Container</b> · khởi động ~mili giây', rows: [
        { t: 'Phần cứng', c: 'dim' }, { t: 'Nhân MÁY CHỦ (chung)', c: 'red' }, { t: 'alpine · ubuntu · node', c: 'tea' }, { t: 'app của bạn', c: 'dk' }] })}
    </div>
    ${box('warn', 'Mac không có nhân Linux ⇒ Docker Desktop chạy một máy ảo Linux. <code>docker info</code> báo RAM/CPU của <b>máy ảo</b>, không phải của Mac.')}`, 'l') },

  { t: 'cgroup không phải phép màu: là vài FILE trong /sys/fs/cgroup', body: two(
    term(['$ docker run -d --name limited --memory 256m --cpus 0.5 \\', '    nginx:1.27-alpine', '$ CID=$(docker inspect -f \'{{.Id}}\' limited)', '$ cd /sys/fs/cgroup/system.slice/docker-$CID.scope', '$ for f in memory.max cpu.max memory.swap.max pids.max', '> do printf "%s: " $f; cat $f; done', '+ memory.max: 268435456', '+ cpu.max: 50000 100000', 'memory.swap.max: 268435456', 'pids.max: 38112'], { title: 'output thật — máy Linux (cgroup v2)' }),
    `${table(['Cờ bạn gõ', 'File Docker ghi', 'Đọc là'], [
      ['<code>--memory 256m</code>', '<code>memory.max</code>', '256 × 1024 × 1024 byte'],
      ['<code>--cpus 0.5</code>', '<code>cpu.max</code>', '50 ms CPU mỗi 100 ms = nửa nhân'],
      ['(mặc định)', '<code>memory.swap.max</code>', '+256 MB swap nữa nếu máy có swap'],
    ], { sm: true })}
    ${box('tip', 'Docker chỉ <b>ghi số vào file</b>; nhân Linux mới là thứ thi hành giới hạn.')}`, 'l') },

  { t: 'Vượt trần bộ nhớ ⇒ nhân giết bằng SIGKILL ⇒ exit 137', body: two(
    term(['$ docker run --name oom --memory 128m --memory-swap 128m \\', '    alpine dd if=/dev/zero of=/dev/null bs=200M count=1', '$ echo "exit: $?"', '! exit: 137', '$ docker inspect -f \'OOMKilled={{.State.OOMKilled}}\' oom', '! OOMKilled=true', '# cùng lệnh, bs=100M (vừa trần) ⇒ 1+0 records out, exit: 0'], { title: 'output thật — Mac và máy Linux giống nhau' }),
    `${kpis([{ v: '137', l: '= 128 + 9 (SIGKILL)', c: 'red' }, { v: '143', l: '= 128 + 15 (SIGTERM)', c: 'amb' }])}
    ${box('warn', '<b>Có swap thì trần thật = RAM + swap.</b> Chỉ đặt <code>--memory 256m</code> trên máy có swap, cấp phát 400 MB vẫn in <code>survived</code>. Muốn thấy OOM chắc chắn: đặt <code>--memory-swap</code> BẰNG <code>--memory</code>.')}`, 'l') },

  { t: 'Ranh giới mỏng ở 4 chỗ — 2 chỗ do chính bạn mở', body: two(
    term(['$ docker run --rm alpine hostname', '15636845bee3', '$ docker run --rm --uts=host alpine hostname', '+ CuongThai', '$ docker run --rm alpine ip -o addr | wc -l', '3', '$ docker run --rm --net=host alpine ip -o addr | wc -l', '+ 23', '$ docker run --rm alpine date +%H:%M:%S ; date +%H:%M:%S', '13:17:09      # container: UTC', '20:17:09      # máy chủ: +07 — CÙNG một đồng hồ'], { title: 'máy Linux — một cờ là tường biến mất' }),
    cards([
      { ic: '🧠', t: 'Nhân dùng chung', d: 'Lỗ hổng nhân = lỗ thoát container. Mã lạ, không tin ⇒ máy ảo / gVisor.', c: 'red' },
      { ic: '👑', t: 'root là root thật', d: 'User namespace mặc định TẮT. UID 0 trong = UID 0 ngoài.', c: 'amb' },
      { ic: '🔓', t: 'Cờ bạn tự thêm', d: '<code>--net=host</code>, <code>--pid=host</code>, <code>--privileged</code>, gắn <code>docker.sock</code>.', c: 'ora' },
      { ic: '🕒', t: 'Đồng hồ', d: 'Giờ thực luôn là của máy chủ; chỉ múi giờ (file <code>/etc/localtime</code>) khác.', c: 'blu' },
    ], 2), 'l') },

  /* ───────────── 1.2 ───────────── */
  { t: 'docker history = đọc ngược cái Dockerfile, từ dưới lên', body: two(
    term(['$ docker history node:22-alpine \\', '    --format \'table {{.Size}}\\t{{.CreatedBy}}\'', 'SIZE      CREATED BY', '0B        CMD ["node"]', '0B        ENTRYPOINT ["docker-entrypoint.sh"]', '20.5kB    COPY docker-entrypoint.sh /usr/local/…', '5.48MB    RUN /bin/sh -c apk add --no-cache …', '0B        ENV YARN_VERSION=1.22.22', '+ 156MB     RUN /bin/sh -c addgroup -g 1000 node …', '0B        ENV NODE_VERSION=22.23.2', '0B        CMD ["/bin/sh"]', '9.31MB    ADD alpine-minirootfs-3.24.1-aarch64…'], { title: 'output thật — máy Mac (arm64)' }),
    `${layers({ w: 480, cap: '4 tầng có file — dòng 0B chỉ sửa cấu hình JSON', rows: [
      { t: 'ADD alpine rootfs', sz: '9.31MB', k: 'TẦNG 1', c: 'tea' },
      { t: 'RUN cài node', sz: '156MB', k: 'TẦNG 2', c: 'dk' },
      { t: 'RUN cài yarn', sz: '5.48MB', k: 'TẦNG 3', c: 'blu' },
      { t: 'COPY entrypoint', sz: '20.5kB', k: 'TẦNG 4', c: 'vio' },
    ] })}
    ${box('tip', '<code>&lt;missing&gt;</code> ở cột IMAGE <b>không phải lỗi</b>: tầng trung gian của ảnh tải về không có ID cục bộ.')}`, 'l') },

  { t: 'Tầng giống hệt nhau ⇒ lưu và tải đúng MỘT lần', body: `
    ${diagram({ w: 1160, h: 200, nodes: [
      { id: 'a', x: 20, y: 10, w: 250, h: 66, t: 'alpine:latest', d: '1 tầng', c: 'tea', mono: true },
      { id: 'n', x: 20, y: 118, w: 250, h: 66, t: 'node:22-alpine', d: '4 tầng', c: 'dk', mono: true },
      { id: 'l', x: 420, y: 56, w: 390, h: 86, t: 'sha256:74d97c42…', d: 'rootfs alpine 3.24 — MỘT bản trên đĩa', c: 'grn' },
      { id: 'o', x: 910, y: 60, w: 240, h: 78, t: '3 tầng riêng', d: 'node · yarn · entrypoint', c: 'dim' },
    ], edges: [{ from: 'a', to: 'l', c: 'grn', t: 'tầng 1' }, { from: 'n', to: 'l', c: 'grn', t: 'tầng 1' }, { from: 'l', to: 'o', c: 'dim', dash: true }] })}
    ${two(
    term(['$ docker image inspect alpine:latest node:22-alpine \\', '    --format \'{{.RepoTags}} {{len .RootFS.Layers}} {{index .RootFS.Layers 0}}\'', '[alpine:latest] 1 sha256:74d97c428c51a828f9051a…', '[node:22-alpine] 4 sha256:74d97c428c51a828f9051a…', '$ docker images node:22-alpine', 'IMAGE            ID             DISK USAGE   CONTENT SIZE', '+ node:22-alpine   b6f26b36c8ff        237MB         61.2MB'], { title: 'máy Linux — Docker 29 (kho ảnh containerd)' }),
    table(['Cột', 'Là gì'], [
      ['CONTENT SIZE', 'Bản NÉN — số byte phải tải về'],
      ['DISK USAGE', 'Bản nén + bản đã giải nén trên đĩa'],
    ], { sm: true }), 'l2')}` },

  { t: 'overlayfs: nhiều tầng chỉ-đọc + 1 tầng ghi ⇒ MỘT cây /', body: `
    ${overlay()}
    ${term(['$ findmnt -t overlay -no OPTIONS <rootfs của container> | tr "," "\\n"', '…', 'lowerdir=…/snapshots/18481/fs:…/18480/fs:…/18479/fs:…/18478/fs:…/18444/fs', '+ upperdir=…/snapshots/18482/fs', 'workdir=…/snapshots/18482/work'], { title: 'máy Linux — mount thật của một container node:22-alpine (18481 = tầng init của Docker)' })}` },

  { t: 'Ghi lần đầu vào file ⇒ chép TRỌN file lên tầng ghi', body: two(
    term(['$ docker run -d --name n1 node:22-alpine sleep 600', '$ docker exec n1 sh -c \\', '    \'echo hi >> /usr/local/bin/docker-entrypoint.sh\'', '$ docker diff n1', 'C /usr', 'C /usr/local', 'C /usr/local/bin', '+ C /usr/local/bin/docker-entrypoint.sh', '$ docker ps -s --filter name=n1 --format \'{{.Names}} {{.Size}}\'', 'n1 32.8kB (virtual 170MB)'], { title: 'output thật — máy Mac' }),
    `${steps([
      ['<b>Đọc</b> file: đọc thẳng từ tầng dưới', 'không tốn thêm byte nào'],
      ['<b>Ghi lần đầu</b>: chép cả file lên upperdir rồi mới sửa', 'đây là copy-on-write (sao chép-khi-ghi)'],
      ['File 2 GB ⇒ sửa 1 byte cũng tạm tốn 2 GB', 'đừng để CSDL ghi vào tầng ghi'],
    ])}
    ${table(['docker diff', 'Nghĩa'], [['<code>A</code>', 'Added — file mới'], ['<code>C</code>', 'Changed — đã chép lên và sửa'], ['<code>D</code>', 'Deleted — đã dán nhãn xoá']], { sm: true })}`, 'l') },

  { t: 'Xoá chỉ là dán nhãn .wh — byte gốc VẪN nằm trong ảnh', body: two(
    term(['$ docker exec n1 rm /usr/local/bin/docker-entrypoint.sh', '$ docker diff n1 | tail -1', 'D /usr/local/bin/docker-entrypoint.sh', '$ docker commit n1 snap:1 && docker save snap:1 -o snap.tar', '# giải nén snap.tar, liệt kê hai tầng:', '# ── tầng trên cùng (tầng commit):', '! ---------- 0/0    0  usr/local/bin/.wh.docker-entrypoint.sh', '# ── tầng 4 (COPY) — vẫn nguyên:', '+ -rwxr-xr-x 0/0  388  usr/local/bin/docker-entrypoint.sh'], { title: 'output thật — máy Linux' }),
    `${layers({ w: 440, rows: [
      { t: 'COPY entrypoint.sh', sz: '388 B', k: 'TẦNG 4', c: 'dk' },
      { t: '.wh.docker-entrypoint.sh', sz: '0 B', k: 'WHITEOUT', c: 'red' },
    ], cap: 'tầng trên che tầng dưới — không xoá được nó' })}
    ${box('bad', '<code>COPY .env .</code> rồi <code>RUN rm .env</code> ⇒ <b>.env vẫn nằm trong ảnh</b>. Ai kéo ảnh về cũng đọc được bằng <code>docker save | tar</code>.')}`, 'l') },

  { t: 'Hai luật: thứ ít đổi để DƯỚI, dọn rác trong CÙNG lệnh RUN', body: two(
    `<div style="font-size:18px;font-weight:800;color:${D.red};margin-bottom:6px">❌ Mỗi lần sửa 1 dòng mã: cài lại hết</div>
    ${yaml([
      ['FROM node:22-alpine', ''],
      ['COPY . .', 'mã đổi ⇒ mọi tầng dưới làm lại'],
      ['RUN npm ci', 'chạy lại MỌI lần'],
      ['RUN apk add git', ''],
      ['RUN rm -rf /var/cache/apk/*', 'vô ích: tầng trên vẫn nặng'],
    ], { lang: 'docker', fs: 15 })}`,
    `<div style="font-size:18px;font-weight:800;color:${D.grn};margin-bottom:6px">✅ Xếp theo tần suất thay đổi</div>
    ${yaml([
      ['FROM node:22-alpine', ''],
      ['RUN apk add --no-cache git', 'đổi hàng tháng'],
      ['COPY package*.json ./', ''],
      ['RUN npm ci', 'chỉ khi đổi thư viện'],
      ['COPY . .', 'đổi hằng giờ: trên cùng'],
    ], { lang: 'docker', fs: 15 })}
    ${box('tip', 'Một <code>RUN</code> = một tầng. Cài + dọn trong <b>cùng</b> một RUN thì rác không bao giờ vào ảnh.')}`) },

  /* ───────────── 1.3 ───────────── */
  { t: 'docker run thật ra là 3 lệnh: pull + create + start', body: `
    ${flow([
      { e: '⬇️', t: 'docker pull', d: 'tải ảnh (nếu chưa có)', c: 'blu' },
      { e: '🧱', t: 'docker create', d: 'tạo container: ID, tên, tầng ghi, cổng — CHƯA chạy gì', c: 'amb' },
      { e: '▶️', t: 'docker start', d: 'runc tạo namespace/cgroup rồi chạy PID 1', c: 'grn' },
    ])}
    ${term(['$ docker create --name web -p 18010:80 nginx:1.27-alpine | cut -c1-12', '74d0aad1623b', '$ docker ps -a --filter name=web --format \'{{.Names}} {{.Status}}\'', '+ web Created', '$ docker start web', 'web', '$ curl -s -o /dev/null -w \'%{http_code}\\n\' localhost:18010', '= 200'], { title: 'output thật — máy Mac' })}` },

  { t: 'Sáu trạng thái — và lệnh nào đưa container đi đâu', body: `
    ${diagram({ w: 1160, h: 330, nodes: [
      { id: 'c', x: 20, y: 30, w: 220, h: 76, t: 'created', d: 'có tầng ghi, chưa chạy', c: 'amb' },
      { id: 'r', x: 470, y: 30, w: 220, h: 76, t: 'running', d: 'PID 1 đang sống', c: 'grn' },
      { id: 'p', x: 920, y: 30, w: 220, h: 76, t: 'paused', d: 'bị cgroup đóng băng', c: 'blu' },
      { id: 'e', x: 470, y: 240, w: 220, h: 76, t: 'exited', d: 'còn log + mã thoát', c: 'red' },
      { id: 'x', x: 20, y: 240, w: 220, h: 76, t: '(đã xoá)', d: 'tầng ghi mất hẳn', c: 'dim', dash: true },
      { id: 'rs', x: 920, y: 240, w: 220, h: 76, t: 'restarting', d: 'thử lại ⇒ running', c: 'ora' },
    ], edges: [
      { from: 'c', to: 'r', t: 'start', c: 'grn' },
      { from: 'r', to: 'p', t: 'pause', c: 'blu', bend: -40 },
      { from: 'p', to: 'r', t: 'unpause', c: 'blu', bend: 40, off: 24 },
      { from: 'r', to: 'e', t: 'stop · kill · tự thoát', c: 'red', fs: 'b', ts: 't', off: 6 },
      { from: 'e', to: 'r', t: 'start', c: 'grn', fs: 'r', ts: 'r', bend: 90 },
      { from: 'e', to: 'x', t: 'rm', c: 'dim' },
      { from: 'c', to: 'x', t: 'rm', c: 'dim', fs: 'b', ts: 't' },
      { from: 'e', to: 'rs', t: 'sập + có --restart', c: 'ora' },
    ] })}
    ${box('info', 'Đang <b>paused</b> thì cổng vẫn mở mà không ai trả lời: <code>curl localhost:18010</code> treo tới hết giờ (curl exit 28). <b>exited</b> vẫn giữ tầng ghi — chỉ <code>rm</code> mới xoá.')}` },

  { t: 'docker stop: SIGTERM → chờ → SIGKILL', body: `
    ${stopTimeline()}
    ${box('warn', 'Số đo thật bằng <code>docker events</code> trên máy Linux (Engine 29.6): chờ đúng <b>10 s</b> như tài liệu. Máy Mac Docker Desktop 4.91 đo được <b>~3 s</b> — đừng tin con số mặc định, hãy đo máy của bạn; muốn chờ lâu hơn: <code>docker stop -t 30</code>.')}` },

  { t: 'PID 1 không tự chết vì SIGTERM — phải có người bắt nó', body: two(
    bars([
      { l: 'node, không bắt SIGTERM', sub: 'exit 137', v: 10.17, txt: '10,17 s', c: 'red' },
      { l: 'sleep (dạng exec)', sub: 'exit 137', v: 10.13, txt: '10,13 s', c: 'red' },
      { l: 'node + process.on(\'SIGTERM\')', sub: 'exit 0', v: 0.14, txt: '0,14 s', c: 'grn' },
      { l: 'node với --init', sub: 'exit 143', v: 0.16, txt: '0,16 s', c: 'grn' },
      { l: 'nginx', sub: 'exit 0', v: 0.20, txt: '0,20 s', c: 'grn' },
    ], { lw: 300, max: 11 }),
    `${box('info', '<b>Luật của nhân:</b> tín hiệu gửi tới PID 1 mà PID 1 <b>không cài hàm xử lý</b> thì bị VỨT — kể cả SIGTERM. Ở ngoài container, cùng chương trình đó chết ngay.')}
    ${yaml([
      ['process.on("SIGTERM", () => {', 'bắt tín hiệu'],
      ['  server.close(() => process.exit(0));', 'xong request rồi thoát'],
      ['});', ''],
    ], { fs: 15 })}
    <p style="font-size:15px;color:${D.mu};margin-top:6px">Đo thật trên máy Linux, <code>docker stop</code> mặc định.</p>`, 'l') },

  { t: 'Shell đứng làm PID 1 thì tín hiệu dừng lại ở shell', body: two(
    term(['$ docker run -d --name s1 alpine sh -c \'sleep 600\'', '$ docker exec s1 ps -o pid,args', '= 1 sleep 600          # busybox sh tự exec lệnh cuối', '$ docker run -d --name s2 alpine sh -c \'sleep 600; echo xong\'', '$ docker exec s2 ps -o pid,args', '! 1 sh -c sleep 600; echo xong', '  7 sleep 600          # app là CON của shell', '$ docker run -d --name s3 --init alpine sleep 600', '$ docker exec s3 ps -o pid,args', '= 1 /sbin/docker-init -- sleep 600', '  8 sleep 600'], { title: 'output thật — máy Mac' }),
    cards([
      { ic: 'A', t: 'Dạng exec', d: '<code>CMD ["node","server.js"]</code> — app LÀ PID 1', c: 'grn' },
      { ic: 'B', t: 'exec trong entrypoint', d: 'script kết thúc bằng <code>exec node server.js</code>', c: 'tea' },
      { ic: 'C', t: '--init / init: true', d: 'tini làm PID 1: chuyển tín hiệu + dọn tiến trình xác', c: 'dk' },
    ], 1), 'l2') },

  { t: 'Mã thoát kể lại chuyện gì đã xảy ra', body: table(['Mã', 'Thử thật (máy Mac)', 'Nghĩa là', 'Nhìn ở đâu'], [
    ['<code>0</code>', '<code>alpine true</code> → exited', 'Thoát sạch. Server mà 0 = nó tự dừng khi không nên', '<code>docker logs</code>'],
    ['<code>1</code>', '<code>alpine false</code> → exited', 'App CHỌN báo lỗi', '<code>docker logs</code>'],
    ['!<code>125</code>', 'cờ sai / volume mode sai', 'Docker hỏng TRƯỚC khi tạo container', 'stderr của lệnh docker'],
    ['<code>126</code>', '<code>/etc/hostname</code> → <b>created</b>', 'Có file nhưng không chạy được (thiếu +x, CRLF)', 'stderr của lệnh docker'],
    ['<code>127</code>', '<code>/bin/nope</code> → <b>created</b>', 'Không có lệnh đó TRONG ảnh', 'đổi ảnh nền gần đây?'],
    ['-<code>137</code>', '<code>dd bs=200M</code>, trần 128m', 'SIGKILL: OOM, hoặc stop quá hạn', '<code>.State.OOMKilled</code>'],
    ['<code>143</code>', 'stop với <code>--init</code>', 'SIGTERM và app đã tuân', 'bình thường'],
  ], { sm: true }) },

  /* ───────────── 1.4 ───────────── */
  { t: 'restart giữ dữ liệu, rm xoá — tầng ghi sống theo container', body: two(
    term(['$ docker run -d --name ghi alpine sleep 600', '$ docker exec ghi sh -c \'mkdir /data && echo "don hang 42" > /data/note.txt\'', '$ docker diff ghi', 'A /data', 'A /data/note.txt', '$ docker restart ghi && docker exec ghi cat /data/note.txt', '= don hang 42', '$ docker rm -f ghi', '$ docker run --rm alpine cat /data/note.txt', "! cat: can't open '/data/note.txt': No such file or directory"], { title: 'output thật — máy Mac' }),
    `${steps([
      ['<code>stop</code> · <code>start</code> · <code>restart</code>', '<b style="color:#7ee787">giữ</b> — vẫn container đó, vẫn upperdir đó'],
      ['<code>rm</code> · <code>compose down</code>', '<b style="color:#ff8b96">mất</b> — upperdir bị xoá, không hỏi lại'],
      ['Deploy ảnh mới · đổi một cờ <code>run</code>', '<b style="color:#ff8b96">mất</b> — luôn là container MỚI'],
    ])}
    ${box('good', 'Thứ phải sống qua deploy ⇒ đưa ra <b>volume</b> (Chương 7).')}`, 'l') },

  { t: 'Postgres “mất dữ liệu”: thật ra bị gắn một volume vô danh MỚI', body: `
    ${diagram({ w: 1160, h: 210, nodes: [
      { id: 'c1', x: 10, y: 10, w: 230, h: 66, t: 'db (container cũ)', d: 'đã docker rm -f', c: 'dim', dash: true },
      { id: 'v1', x: 330, y: 10, w: 300, h: 66, t: 'volume c979f0bd…', d: 'VẪN CÒN bảng important', c: 'vio', mono: true },
      { id: 'c2', x: 10, y: 130, w: 230, h: 66, t: 'db (container mới)', d: 'không có -v', c: 'red' },
      { id: 'v2', x: 330, y: 130, w: 300, h: 66, t: 'volume 35dbac4a…', d: 'mới tinh, CSDL rỗng', c: 'red', mono: true },
      { id: 'c3', x: 830, y: 60, w: 320, h: 90, t: 'db-cuu', d: '-v c979f0bd…:/var/lib/postgresql/data\n⇒ select trả lại dữ liệu', c: 'grn' },
    ], edges: [{ from: 'c1', to: 'v1', c: 'dim', dash: true }, { from: 'c2', to: 'v2', c: 'red' }, { from: 'v1', to: 'c3', c: 'grn', t: 'gắn lại' }] })}
    ${two(
    term(['$ docker diff db', 'C /run', 'C /run/postgresql', 'A /run/postgresql/.s.PGSQL.5432', 'A /run/postgresql/.s.PGSQL.5432.lock', '$ docker inspect db --format \'{{range .Mounts}}{{.Type}} {{.Name}}{{end}}\'', '+ volume c979f0bdbde303e3d40a11083637c05d06a2dbd7…'], { title: 'output thật — máy Mac' }),
    box('warn', 'Ảnh postgres khai <code>VOLUME /var/lib/postgresql/data</code> ⇒ dữ liệu nằm ở một volume <b>tên ngẫu nhiên</b>, không ở tầng ghi. Container mới lại được một volume mới rỗng. <b>Luôn tự đặt tên volume.</b>'), 'l')}` },

  { t: 'Ba đường đưa dữ liệu ra khỏi tầng ghi', body: `
    ${host({ t: 'Máy chủ · Docker Engine', cols: 1, ctrs: [{ n: 'db — postgres:16-alpine', c: 'dk', items: [
      '<code>/var/lib/postgresql/data</code> → <b style="color:#bc8cff">volume có tên</b> <code>pgdata</code>',
      '<code>/app/src</code> → <b style="color:#2dd4bf">bind mount</b> <code>~/thu-docker/src</code>',
      '<code>/tmp</code> → <b style="color:#ffc233">tmpfs</b> (RAM, mất khi dừng)',
      'mọi đường dẫn còn lại → <b style="color:#ff5c6c">tầng ghi</b> (mất khi rm)'] }],
      side: [{ t: '-v pgdata:/var/lib/postgresql/data', c: 'vio' }, { t: '-v "$PWD/src:/app/src"', c: 'tea' }, { t: '--tmpfs /tmp', c: 'amb' }] })}
    ${table(['Loại', 'Nằm ở đâu', 'Qua rm?', 'Dùng cho'], [
      ['Volume có tên', 'Docker quản lý', '+Còn', 'CSDL, file người dùng tải lên'],
      ['Bind mount', 'Thư mục máy của bạn', '+Còn', 'Mã nguồn khi dev, file cấu hình'],
      ['tmpfs', 'RAM', '-Mất', 'File tạm, thứ nhạy cảm'],
      ['Tầng ghi', 'upperdir của container', '-Mất', 'API/web không trạng thái'],
    ], { sm: true })}` },

  { t: 'docker cp cứu file ra khỏi container ĐÃ CHẾT — commit thì đừng', body: two(
    term(['$ docker stop ghi', '$ docker ps -a --filter name=ghi --format \'{{.Names}} {{.Status}}\'', 'ghi Exited (137) Less than a second ago', '$ docker cp ghi:/data/note.txt ./note-cuu.txt', '$ cat note-cuu.txt', '= don hang 42', '# docker exec thì KHÔNG chạy được trên container đã dừng'], { title: 'output thật — máy Mac' }),
    vs({
      no: { t: 'docker commit để dựng ảnh', items: ['<code>CREATED BY</code> ghi <code>sleep 600</code>, không ghi bạn đã cài gì', 'Không ai review, không tái lập được', 'Ảnh nền vá lỗi ⇒ không tự dựng lại'] },
      yes: { t: 'Dockerfile nằm trong git', items: ['Mỗi dòng là một bước đọc được', 'Dựng lại y hệt trên máy nào cũng được', 'commit chỉ dùng: chụp hiện trường sự cố'] },
    }), 'l') },

  { t: 'save giữ nguyên ẢNH — export ép phẳng một CONTAINER', body: `
    ${table(['', '<code>docker save tools:v1</code>', '<code>docker export tinker</code>'], [
      ['Đóng gói', 'Một <b>ảnh</b>: mọi tầng + tag + cấu hình', 'Một <b>container</b>: MỘT cây file phẳng'],
      ['Kích thước (đo thật, máy Mac)', '<b>6.7M</b> — tầng giữ dạng nén', '<b>15M</b> — file đã giải nén'],
      ['Bên trong tar', '<code>blobs/sha256/…</code> · <code>index.json</code> · <code>manifest.json</code>', '<code>.dockerenv</code> · <code>bin/</code> · <code>etc/</code> …'],
      ['Mất gì', '+Không mất gì', '-Mất lịch sử, tầng, CMD, ENV'],
      ['Nhận lại bằng', '<code>docker load</code>', '<code>docker import</code> (phải chỉ lại CMD)'],
      ['Dùng khi', 'Chuyển ảnh sang máy không có registry', 'Rút file ra / cố ý ép phẳng'],
    ], { sm: true })}
    ${box('tip', 'Chuyển ảnh thẳng lên VPS không cần registry: <code>docker save app:v2 | ssh vps docker load</code>')}` },

  /* ───────────── 1.5 ───────────── */
  { t: '“Docker” là 4 chương trình xếp chồng, mỗi cái một việc', body: `
    ${diagram({ w: 1160, h: 300, nodes: [
      { id: 'cli', x: 10, y: 20, w: 230, h: 84, t: 'docker (CLI)', d: 'chỉ gửi HTTP', c: 'blu', mono: true },
      { id: 'dd', x: 440, y: 20, w: 260, h: 84, t: 'dockerd', d: 'build · mạng · volume · API', c: 'dk' },
      { id: 'cd', x: 900, y: 20, w: 250, h: 84, t: 'containerd', d: 'kéo ảnh · snapshot · vòng đời', c: 'tea' },
      { id: 'sh', x: 900, y: 200, w: 250, h: 84, t: 'shim (1/container)', d: 'giữ stdio · báo mã thoát', c: 'vio' },
      { id: 'rc', x: 440, y: 200, w: 260, h: 84, t: 'runc', d: 'tạo namespace + cgroup\nrồi THOÁT', c: 'amb', mono: true, dash: true },
      { id: 'ng', x: 10, y: 200, w: 230, h: 84, t: 'nginx', d: 'PID 1 của container', c: 'grn', mono: true },
    ], edges: [
      { from: 'cli', to: 'dd', t: '/var/run/docker.sock', c: 'blu' },
      { from: 'dd', to: 'cd', t: 'containerd.sock', c: 'dk' },
      { from: 'cd', to: 'sh', t: 'khởi chạy', c: 'tea' },
      { from: 'sh', to: 'rc', t: 'gọi', c: 'vio' },
      { from: 'rc', to: 'ng', t: 'exec', c: 'amb' },
    ] })}
    ${term(['$ curl -s --unix-socket /var/run/docker.sock http://localhost/containers/json | head -c 120', '[{"Id":"f85e9fedbcab02a618a9552e7cd0729cb28b1d04379d1dfc289476f443f982c2","Names":["/dk01-web"],"Image":"nginx:1.27-alpi', '$ DOCKER_HOST=ssh://linux-nha docker ps --format \'{{.Names}} {{.Status}}\'    # gõ trên Mac, chạy ở máy Linux', 'dk01-n1 Up 6 minutes'], { title: 'output thật — CLI chỉ là một máy khách HTTP nói chuyện với dockerd' })}` },

  { t: 'Cha của nginx là shim — cha của shim là systemd', body: two(
    term(['$ ps -o user,pid,ppid,args -p 1,1069,1673,367950,367975', 'USER    PID    PPID COMMAND', 'root      1       0 /usr/lib/systemd/systemd …', 'root   1069       1 /usr/bin/containerd', 'root   1673       1 /usr/bin/dockerd -H fd:// …', '+ root 367950       1 /usr/bin/containerd-shim-runc-v2 …', '+ root 367975  367950 nginx: master process …', '$ pgrep -x runc | wc -l', '0'], { title: 'output thật — máy Linux' }),
    `${diagram({ w: 520, h: 330, nodes: [
      { id: 's', x: 170, y: 0, w: 180, h: 54, t: 'systemd (1)', c: 'dim', mono: true },
      { id: 'c', x: 0, y: 110, w: 160, h: 54, t: 'containerd', c: 'tea', mono: true },
      { id: 'd', x: 180, y: 110, w: 150, h: 54, t: 'dockerd', c: 'dk', mono: true },
      { id: 'h', x: 350, y: 110, w: 170, h: 54, t: 'shim 367950', c: 'vio', mono: true },
      { id: 'n', x: 330, y: 240, w: 190, h: 60, t: 'nginx 367975', d: '+ 12 worker', c: 'grn', mono: true },
    ], edges: [{ from: 's', to: 'c', c: 'dim' }, { from: 's', to: 'd', c: 'dim' }, { from: 's', to: 'h', c: 'dim' }, { from: 'h', to: 'n', c: 'grn' }] })}
    ${box('good', 'dockerd không nằm trên đường nào tới nginx ⇒ dockerd khởi động lại được mà container không chết (nếu bật <code>live-restore</code>).')}`, 'l') },

  { t: 'live-restore: nâng cấp Docker mà container vẫn chạy', body: `${vs({
      no: { t: 'Mặc định: live-restore = false', items: ['<code>systemctl restart docker</code> DỪNG mọi container', 'Chỉ cái có <code>--restart always / unless-stopped</code> tự lên lại', 'Cái chạy bằng <code>docker run -d</code> trần: nằm chết, im lặng'] },
      yes: { t: 'live-restore = true', items: ['Tiến trình container sống tiếp (cha là shim)', 'dockerd lên lại thì nhận lại chúng', 'Không dùng được với Swarm'] },
    })}
    ${two(yaml([
      ['{', '/etc/docker/daemon.json'],
      ['  "live-restore": true,', 'container sống qua restart'],
      ['  "log-driver": "json-file",', ''],
      ['  "log-opts": {', 'xoay vòng log (Ch.11)'],
      ['    "max-size": "10m", "max-file": "3" }', ''],
      ['}', ''],
    ], { fs: 15 }),
    box('tip', 'Đổi file này xong: <code>sudo systemctl reload docker</code> (reload, KHÔNG restart). Kiểm: <code>docker info -f \'{{.LiveRestoreEnabled}}\'</code>'), 'l')}` },

  { t: 'OCI: ảnh của bạn theo một CHUẨN mở', body: `
    ${cards([
      { ic: '📦', t: 'image-spec', d: 'Định dạng ảnh: manifest + config + tầng. Podman, containerd, mọi đám mây đọc được.', c: 'dk' },
      { ic: '⚙️', t: 'runtime-spec', d: 'Runtime phải làm gì với một rootfs + config. runc là bản mẫu.', c: 'amb' },
      { ic: '🌐', t: 'distribution-spec', d: 'API của registry: Docker Hub, GHCR, <code>registry:2</code> dùng chung <code>docker push</code>.', c: 'tea' },
    ], 3)}
    ${table(['Runtime', 'Cô lập', 'Khi nào dùng'], [
      ['<code>runc</code> (mặc định, 1.4.3 trên Mac)', 'Nhân chung', 'Việc của chính bạn'],
      ['<code>crun</code>', 'Nhân chung', 'Khởi động nhanh hơn, ít RAM hơn'],
      ['gVisor <code>runsc</code>', 'Nhân giả lập ở user space', 'Chạy mã không tin được'],
      ['Kata Containers', 'Máy ảo nhẹ, nhân riêng', 'Đám mây nhiều khách hàng'],
    ], { sm: true })}
    ${box('info', '2022 Kubernetes gỡ <b>dockershim</b> (bộ chuyển để nói với dockerd) và nói thẳng với containerd — ảnh dựng bằng Docker chạy y nguyên vì chúng là ảnh <b>OCI</b>.')}` },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 1', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['<code>docker stop</code> lần nào cũng đúng 10 s', 'PID 1 không bắt SIGTERM (shell, hoặc app không có handler)', 'Dạng exec + <code>process.on(\'SIGTERM\')</code>, hoặc <code>--init</code>'],
    ['<code>Exited (137)</code> mà không ai stop', 'Chạm trần RAM của cgroup (OOM)', 'Kiểm <code>.State.OOMKilled</code>; tăng <code>--memory</code> / giảm dùng'],
    ['Postgres rỗng sau <code>rm</code> / <code>compose down</code>', 'Volume vô danh mới được gắn', 'Đặt tên volume: <code>-v pgdata:/var/lib/postgresql/data</code>'],
    ['Đã <code>RUN rm .env</code> mà vẫn lộ', 'Xoá = whiteout, byte gốc còn ở tầng dưới', '<code>.dockerignore</code> + build secret (Ch.6)'],
    ['Đĩa đầy dần dù “chẳng chạy gì”', 'Container Exited + volume mồ côi', '<code>--rm</code>; <code>docker ps -a</code>; <code>volume ls -f dangling=true</code>'],
    ['Restart Docker xong web chết im', 'Không <code>live-restore</code>, không <code>--restart</code>', 'Bật cả hai (Ch.11)'],
    ['<code>exit 127</code> sau khi đổi ảnh nền', 'Lệnh không có trong ảnh mới', 'Cài thêm, hoặc chọn ảnh nền khác'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 1', body: table(['Muốn…', 'Gõ'], [
    ['PID trên máy chủ của container', '<code>docker inspect -f \'{{.State.Pid}}\' web</code>'],
    ['Xem namespace (không sudo)', '<code>docker run --rm --pid=host alpine ls -l /proc/&lt;PID&gt;/ns</code>'],
    ['Giới hạn RAM / CPU', '<code>--memory 256m --memory-swap 256m --cpus 0.5</code>'],
    ['Container có bị OOM không', '<code>docker inspect -f \'{{.State.OOMKilled}} {{.State.ExitCode}}\' web</code>'],
    ['Đọc ngược một ảnh · soi tầng', '<code>docker history &lt;ảnh&gt;</code> · <code>docker image inspect</code>'],
    ['Container đã ghi gì', '<code>docker diff web</code> · <code>docker ps -s</code>'],
    ['Ai là PID 1', '<code>docker exec web ps -o pid,args</code> · <code>docker top web</code>'],
    ['Xem sự kiện + tín hiệu', '<code>docker events --filter container=web</code>'],
    ['Lấy file từ container đã chết', '<code>docker cp web:/đường/dẫn ./</code>'],
    ['Container gắn volume nào', '<code>docker inspect -f \'{{json .Mounts}}\' web</code>'],
  ], { sm: true }) },

  { t: 'Thực hành chương 1 (40 phút)', body: `
    ${steps([
      ['Chạy nginx, tìm PID của nó trên máy chủ, so namespace với shell của bạn', '<code>--pid=host</code> + <code>/proc/&lt;PID&gt;/ns</code> — cái nào giống, cái nào khác?'],
      ['Gây một cú exit 137 có chủ đích rồi chứng minh nó là OOM', '<code>--memory 128m --memory-swap 128m</code> + <code>dd bs=200M</code> → <code>OOMKilled=true</code>'],
      ['Sửa rồi xoá một file trong container node, đọc <code>docker diff</code>', 'đoán trước A/C/D rồi mới nhìn'],
      ['Làm <code>docker stop</code> mất 10 s rồi sửa về &lt; 1 s', 'đo bằng <code>docker events</code>, sửa bằng <code>--init</code>'],
      ['“Mất” dữ liệu Postgres rồi cứu lại bằng volume cũ', '<code>docker inspect … .Mounts</code> → <code>-v &lt;tên cũ&gt;:/var/lib/postgresql/data</code>'],
    ])}
    ${box('good', '<b>Đạt khi:</b> bạn giải thích được bằng lời từng kết quả, và <code>docker ps -a --filter name=thu-</code> và <code>docker volume ls -f dangling=true</code> không còn thứ gì của bạn sau khi dọn.')}` },
]).map((x) => ({ ...x, body: TCSS + x.body }));
