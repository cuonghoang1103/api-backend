/**
 * Linux & Bash · Deck lx-14 — Chương 14: Linux chuyên sâu — nhân, hiệu năng, lưu trữ & bảo mật.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 28/09/2026:
 *   • "Ubuntu" = container ubuntu:24.04 (arm64) trên Docker Desktop của Mac M1 (nhân 7.0.12-linuxkit, 10 vCPU),
 *                chạy /sbin/init (systemd 255.4-1ubuntu8.17), --privileged NGẮN hạn, --memory 512m, hostname vps-14.
 *                strace 6.8, sysstat 12.6.1, fio, iperf3, stress-ng, perf 6.8.12 (chỉ sự kiện phần mềm — máy ảo
 *                không có bộ đếm phần cứng), lvm2, parted, nftables, fail2ban 1.0.2, lynis 3.0.9, OpenSSH 9.6p1.
 *                Đĩa thử là FILE (truncate + losetup) — không đụng đĩa thật.
 *   • "Fedora" = linux-nha (Fedora 44, nhân 7.1.3, systemd 259, SELinux enforcing) — chỉ đọc + ~/lxhoc-14.
 *   • "Mac"    = Mac M1, macOS 27, OpenSSH_10.3p1 — ssh-keygen trong thư mục nháp, lệnh chỉ đọc.
 *
 * Hình tự vẽ (SVG nội tuyến): ranhGioi() user space ⇄ nhân · nsLuoi() 8 namespace · cayCg() cây cgroup ·
 * lua() flame graph dựng từ số đo perf thật · annot() (chép lx-11) · lvm() PV → VG → LV · nhan() nhãn SELinux.
 */
import { S, cover, sh, term, mindmap, diagram, cards, box, steps, table, two, layers, bars, kpis, sv, R, T, A, D, esc } from './_lx-chung.mjs';

export const deck = { key: 'lx-14', code: 'LINUX · CHƯƠNG 14', title: 'Linux chuyên sâu', sub: 'Linux & Bash · Chương 14' };

const MONO = 'SF Mono,Menlo,monospace';
const c = (k) => D[k] || k;
const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15.5px}.c-t.sm td,.c-t.sm th{padding:6px 10px}.c-two svg{max-width:100%;height:auto}</style>';
const P = (t) => `<p style="font-size:14.5px;color:${D.mu};margin-top:8px;text-align:center">${t}</p>`;

/** annot(str, segs) — một dòng chữ đơn cách, ngoặc màu + nhãn dưới từng đoạn (chép lx-11). */
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

/* Slide 3 — ranh giới user space ⇄ nhân: mọi việc thật đều là một syscall */
const ranhGioi = () => {
  let s = '';
  s += R(0, 0, 560, 118, { c: 'blu', r: 12, fill: 'rgba(88,166,255,.06)' }) + T(16, 26, 'USER SPACE — chương trình của bạn', { fs: 15, b: true, c: 'blu' });
  const hop = (x, y, w, t, d, col) => R(x, y, w, 58, { c: col, r: 10 }) + T(x + w / 2, y + 25, t, { fs: 16, b: true, a: 'middle', mono: true }) + T(x + w / 2, y + 46, d, { fs: 13, a: 'middle', c: 'mu' });
  s += hop(16, 42, 170, 'dd · python', 'mã của bạn', 'blu') + hop(206, 42, 150, 'libc', 'write() của C', 'tea') + hop(376, 42, 170, 'strace', 'đứng rình ở đây', 'lx');
  s += A(186, 71, 204, 71, { c: 'blu' });
  s += `<path d="M0 150 L560 150" stroke="${D.red}" stroke-width="3" stroke-dasharray="10 7"/>` + T(246, 142, 'syscall: cánh cửa DUY NHẤT vào nhân', { fs: 14, c: 'red', b: true });
  s += A(228, 101, 228, 176, { c: 'red' });
  s += R(0, 180, 560, 128, { c: 'lx', r: 12, fill: 'rgba(245,183,0,.06)' }) + T(16, 205, 'NHÂN (kernel) — chạy ở chế độ đặc quyền', { fs: 15, b: true, c: 'lx' });
  ['VFS · file', 'bộ lập lịch', 'bộ nhớ', 'mạng', 'namespaces', 'cgroups'].forEach((t, i) => {
    const x = 16 + (i % 3) * 180, y = 218 + Math.floor(i / 3) * 42;
    s += R(x, y, 168, 34, { c: i > 3 ? 'grn' : 'dim', r: 8 }) + T(x + 84, y + 23, t, { fs: 14, a: 'middle', c: i > 3 ? 'grn' : 'tx' });
  });
  return sv(560, 312, s);
};

/* Slide 5 — tám namespace, mỗi cái che một thứ */
const nsLuoi = () => {
  const ns = [
    ['pid', 'thấy mình là PID 1', '2.6.24 · 2008', 'lx'],
    ['mnt', 'cây / riêng', '2.4.19 · 2002', 'amb'],
    ['net', 'card mạng, cổng, luật riêng', '2.6.24 · 2008', 'grn'],
    ['uts', 'hostname riêng', '2.6.19 · 2006', 'tea'],
    ['ipc', 'hàng đợi IPC riêng', '2.6.19 · 2006', 'blu'],
    ['user', 'root "giả" ⇄ uid thật', 'không cần root: 3.8', 'vio'],
    ['cgroup', 'thấy cây cgroup của mình là /', '4.6 · 2016', 'pnk'],
    ['time', 'đồng hồ khởi động riêng', '5.6 · 2020', 'ora'],
  ];
  let s = '';
  ns.forEach(([n, d, y, col], i) => {
    const x = (i % 4) * 288, yy = Math.floor(i / 4) * 100;
    s += R(x, yy, 272, 86, { c: col, r: 12 });
    s += T(x + 16, yy + 32, n, { fs: 22, b: true, mono: true, c: col }) + T(x + 256, yy + 30, y, { fs: 12.5, a: 'end', c: 'dim', mono: true });
    s += T(x + 16, yy + 62, d, { fs: 15, c: 'tx' });
  });
  return sv(1150, 190, s);
};

/* Slide 7 — cây cgroup v2 và các file giới hạn */
const cayCg = () => {
  let s = '';
  const n = (x, y, w, t, col, d) => R(x, y, w, d ? 58 : 38, { c: col, r: 9 }) + T(x + 12, y + 25, t, { fs: 15, b: true, mono: true, c: col }) + (d ? T(x + 12, y + 47, d, { fs: 13, c: 'mu', mono: true }) : '');
  s += n(0, 0, 250, '/sys/fs/cgroup', 'lx');
  s += `<path d="M20 38 L20 250" stroke="${D.bd}" stroke-width="2"/>`;
  s += `<path d="M20 70 L40 70 M20 150 L40 150 M20 230 L40 230" stroke="${D.bd}" stroke-width="2"/>`;
  s += n(40, 50, 230, 'demo/', 'red', 'memory.max = 64M');
  s += n(40, 130, 230, 'cpu20/', 'amb', 'cpu.max = 20000 100000');
  s += n(40, 210, 230, 'p5/', 'vio', 'pids.max = 5');
  return sv(280, 272, s);
};

/* Slide 13 — flame graph dựng lại từ số đo perf THẬT (children %) */
const lua = () => {
  const W = 1000, H = 30;
  const khung = [
    // [tên, x%, w%, tầng, màu]
    ['python3 app.py (toàn bộ mẫu)', 0, 100, 0, '#b0412e'],
    ['py::<module>  96,6%', 0, 96.6, 1, '#c8553d'],
    ['py::xu_ly_don  96,6%', 0, 96.6, 2, '#d9673f'],
    ['py::tinh_thue  94,0%', 0, 94.0, 3, '#e8833a'],
    ['py::<genexpr>  67,6%', 0, 67.6, 4, '#f0a13a'],
    ['sum() + tự thân 26,4%', 67.6, 26.4, 4, '#e0b04a'],
    ['doc_cau_hinh 2,6%', 94.0, 2.64, 3, '#f5c542'],
    ['import', 96.6, 3.4, 1, '#9a6a3a'],
  ];
  let s = '';
  khung.forEach(([t, x, w, lv, col]) => {
    const px = (x / 100) * W, pw = (w / 100) * W, y = 170 - lv * (H + 4);
    s += `<rect x="${px.toFixed(1)}" y="${y}" width="${(pw - 2).toFixed(1)}" height="${H}" rx="3" fill="${col}"/>`;
    if (pw > 60) s += `<text x="${(px + 8).toFixed(1)}" y="${y + 20}" font-size="14" fill="#1a1005" font-family="${MONO}" font-weight="700">${esc(pw > 110 ? t : t.split(' ')[0])}</text>`;
  });
  s += T(0, 222, 'vẽ lại từ số của perf report · trục X: tỉ lệ MẪU (không phải thời gian), xếp theo tên · trục Y: độ sâu ngăn xếp ↑', { fs: 14, c: 'mu' });
  s += A(1066, 83, 996, 83, { c: 'red' }) + T(1072, 88, 'hẹp = rẻ', { fs: 14, c: 'red', b: true });
  s += T(1072, 122, 'rộng = đắt', { fs: 14, c: 'lx', b: true });
  return sv(1150, 232, s);
};

/* Slide 19 — LVM: đĩa vật lý → nhóm → ổ logic */
const lvm = () => diagram({
  w: 1150, h: 250,
  nodes: [
    { id: 'p1', x: 0, y: 10, w: 250, h: 70, t: 'PV /dev/loop0p2', d: '720 MiB', c: 'blu', mono: true },
    { id: 'p2', x: 0, y: 150, w: 250, h: 70, t: 'PV /dev/loop1', d: 'đĩa thêm sau · 512 MiB', c: 'tea', mono: true },
    { id: 'vg', x: 400, y: 70, w: 270, h: 90, t: 'VG vg_app', d: 'một "bể" 1,2 GiB\nchia thành extent 4 MiB', c: 'lx', mono: true },
    { id: 'lv', x: 830, y: 20, w: 300, h: 80, t: 'LV lv_db  → ext4', d: '/srv/db · nới khi đang chạy', c: 'grn', mono: true },
    { id: 'fr', x: 830, y: 150, w: 300, h: 70, t: 'chỗ trống (VFree)', d: 'dành cho snapshot / LV mới', c: 'dim' },
  ],
  edges: [
    { from: 'p1', to: 'vg', t: 'vgcreate', off: -8 },
    { from: 'p2', to: 'vg', t: 'vgextend', c: 'tea', off: 8 },
    { from: 'vg', to: 'lv', t: 'lvcreate', c: 'grn', off: -8 },
    { from: 'vg', to: 'fr', c: 'dim', dash: true },
  ],
});

/* Slide 26 — một nhãn SELinux tách ra từng phần */
/** đoạn(str, sub) — vị trí [from, to) của sub trong str, để ngoặc của annot() không lệch. */
const doan = (str, sub, tu = 0) => { const i = str.indexOf(sub, tu); if (i < 0) throw new Error(`không thấy ${sub}`); return { from: i, to: i + sub.length }; };
const NHAN = 'system_u:object_r:httpd_sys_content_t:s0';
const nhan = () => annot(NHAN, [
  { ...doan(NHAN, 'system_u'), t: 'người dùng SELinux', d: 'không phải user Linux', c: 'blu' },
  { ...doan(NHAN, 'object_r'), t: 'vai trò', d: 'object_r = file', c: 'vio' },
  { ...doan(NHAN, 'httpd_sys_content_t'), t: 'KIỂU (type) — phần quyết định', d: 'httpd_t chỉ được đọc kiểu *_content_t', c: 'lx' },
  { ...doan(NHAN, 's0'), t: 'mức MLS', d: 's0', c: 'dim' },
], { fs: 30, rowH: 54 });
const FST = 'UUID=a48bb7be…  /mnt/du-lieu  ext4  defaults,nofail  0  2';

export const slides = S([
  cover({ t: 'Chương 14 — Linux chuyên sâu', sub: 'syscall · /proc · namespaces · cgroups · capabilities · USE · perf · iostat · LVM · fstab · checksum · nftables · SELinux · sudo · lynis', chap: 'CHƯƠNG 14' }),

  { t: 'Bản đồ chương: mở nắp cái máy ra xem', body: mindmap('Nhân Linux', 'thứ mọi lệnh đều đi qua', [
    { t: '14.1 · Bên trong', d: 'syscall · /proc · /sys', c: 'lx' },
    { t: 'Container thật ra là gì', d: 'namespaces · cgroups · capabilities', c: 'amb' },
    { t: '14.2 · Hiệu năng', d: 'USE · mpstat · pidstat · perf', c: 'grn' },
    { t: 'Đĩa &amp; mạng dưới tải', d: 'iostat · fio · sar · iperf3', c: 'tea' },
    { t: '14.3 · Lưu trữ', d: 'GPT · mkfs · fstab · LVM · checksum', c: 'blu' },
    { t: '14.4 · Bảo mật sâu', d: 'sshd -T · nftables · SELinux · sudo · lynis', c: 'red' },
  ]) },

  /* ───────────── 14.1 ───────────── */
  { t: 'Mọi việc thật đều đi qua một syscall', body: two(
    `${ranhGioi()}
     ${bars([
      { l: 'dd bs=1 · 1 MB', sub: '2 triệu syscall', v: 638, txt: '0,638 s (sys 0,459)', c: 'red' },
      { l: 'dd bs=1M · 1 MB', sub: '1 read + 1 write', v: 3, txt: '0,003 s', c: 'grn' },
    ], { lw: 160, max: 638 })}`,
    `${term(['$ strace -c -e trace=read,write \\', '    dd if=/dev/zero of=c bs=1 count=100000', '% time  seconds  usecs/call   calls syscall', '! 56.89 0.840222          8  100000 write', '! 43.11 0.636618          6  100001 read', '100.00 1.476840          7  200001 total'], { title: 'Ubuntu 24.04 — output thật', fs: 13.5 })}
     ${box('info', 'Cùng 1 MB dữ liệu, chậm gấp ~200 lần chỉ vì số lần gõ cửa nhân. <code>strace -c</code> đếm giùm bạn — và chính nó cũng làm chậm: 100 nghìn byte mà tốn 1,48 s.')}`, 'l') },

  { t: '/proc và /sys: nhân mở cửa sổ dạng file', body: two(
    table(['Đường dẫn', 'Cho bạn thấy / đổi gì'], [
      ['<code>/proc/PID/status</code>', 'trạng thái, RAM, capability của một tiến trình'],
      ['<code>/proc/PID/ns/</code>', 'nó ở namespace nào (Slide 5–6)'],
      ['<code>/proc/sys/…</code> = <code>sysctl</code>', 'núm vặn của nhân: swappiness, ip_forward…'],
      ['<code>/proc/pressure/*</code>', 'PSI: thời gian phải CHỜ tài nguyên'],
      ['<code>/sys/class/net/eth0/</code>', 'mtu, địa chỉ MAC, trạng thái card'],
      ['<code>/sys/block/</code>', 'mọi thiết bị khối (đĩa, loop, nbd)'],
      ['<code>/sys/fs/cgroup/</code>', 'cây cgroup v2 (Slide 7)'],
    ], { sm: true }),
    term(['$ grep -E "^(Name|State|VmRSS|CapEff)" /proc/self/status', 'Name:   grep', 'State:  R (running)', 'VmRSS:      1540 kB', 'CapEff: 000001ffffffffff', '$ sysctl vm.swappiness net.ipv4.ip_forward', 'vm.swappiness = 60', 'net.ipv4.ip_forward = 1', '$ cat /proc/sys/vm/swappiness', '60', '$ cat /sys/class/net/eth0/{mtu,operstate}', '65535', 'up', '# không có file nào nằm trên đĩa — nhân sinh ra khi bạn đọc'], { title: 'Ubuntu 24.04 — output thật', fs: 13.5 }), 'r') },

  { t: 'Container = tiến trình thường + 8 namespace', body: `${nsLuoi()}
    ${two(
    term(['$ unshare --pid --fork --mount-proc bash -c \\', '    "sleep 100 & ps -e -o pid,ppid,comm"', '    PID    PPID COMMAND', '=       1       0 bash', '      2       1 sleep', '      3       1 ps'], { title: 'Ubuntu 24.04 — output thật', fs: 13.5 }),
    term(['$ hostname; unshare --uts bash -c \\', '    "hostname may-thu; hostname"; hostname', 'vps-14', '+ may-thu', 'vps-14', '$ unshare --net ip -br link show lo', '! lo    DOWN   00:00:00:00:00:00 <LOOPBACK>'], { title: 'Ubuntu 24.04 — output thật', fs: 13.5 }))}` },

  { t: 'unshare tạo, lsns liệt kê, nsenter bước vào', body: two(
    term(['$ unshare --uts --pid --fork --mount-proc \\', '    bash -c "hostname hop-kin; exec sleep 300" &', '$ P=$(pgrep -f "^sleep 300"); lsns -p $P', '        NS TYPE  NPROCS   PID COMMAND   (bỏ cột USER)', '4026532969 net        5     1 sleep infinity', '+ 4026533236 mnt        2   109 unshare --uts --pid…', '+ 4026533238 uts        2   109 unshare --uts --pid…', '+ 4026533239 pid        1   111 sleep 300', '$ nsenter -t $P -u -p -m bash -c "hostname; ps -e"', '= hop-kin', '    PID COMMAND', '      1 sleep', '      3 ps'], { title: 'Ubuntu 24.04 — output thật', fs: 13 }),
    `${term(['$ id -u', '1001', '$ unshare --user --map-root-user bash -c \\', '    "id; touch /etc/x; cat /proc/self/uid_map"', '+ uid=0(root) gid=0(root) groups=0(root)', "! touch: cannot touch '/etc/x': Permission denied", '         0       1001          1'], { title: 'Ubuntu 24.04 — người thường, output thật', fs: 13 })}
     ${box('tip', '<code>docker exec</code> = <code>nsenter</code> vào đúng các namespace của container. Root trong user namespace chỉ là uid 1001 đội lốt — đó là nền của Docker/Podman "rootless".')}`, 'l') },

  { t: 'cgroup v2: trần RAM, CPU, số tiến trình', body: two(
    `${cayCg()}
     ${box('warn', 'Luật "không tiến trình ở nút trong": muốn bật bộ điều khiển cho nhóm con thì phải dời tiến trình xuống lá trước.')}`,
    term(['$ echo 64M > demo/memory.max; echo 0 > demo/memory.swap.max', '$ echo $$ > demo/cgroup.procs', '$ python3 -c "b=bytearray(200*1024*1024)"; echo exit=$?', '! bash: line 1:   166 Killed    python3 -c "…"', '! exit=137', '$ grep -E "^(oom|oom_kill) " demo/memory.events', 'oom 1', '! oom_kill 1', '$ echo "20000 100000" > cpu20/cpu.max   # 20% một lõi', '$ timeout 5 bash -c "while :; do :; done"', '$ grep -E "usage_usec|nr_throttled" cpu20/cpu.stat', '+ usage_usec 1021854      # 1,02 s CPU trong 5 s', 'nr_throttled 51', '$ echo 5 > p5/pids.max; for i in 1 2 3 4 5 6; do sleep 30 & done', '! bash: fork: retry: Resource temporarily unavailable'], { title: 'Ubuntu 24.04 (--privileged) — output thật', fs: 12.5 }), 'r') },

  { t: 'systemd dựng cgroup giùm: MemoryMax, OOMScoreAdjust', body: two(
    `${sh([
      ['systemd-run --scope -p MemoryMax=64M \\', 'lệnh này trong cgroup riêng'],
      ['    -p MemorySwapMax=0 python3 leak.py', ''],
      ['systemd-run --unit=nang -p MemoryMax=64M CMD', 'thành một .service tạm'],
      ['systemd-run -p OOMScoreAdjust=-900 CMD', 'OOM chọn nó SAU CÙNG'],
      ['systemd-cgls · systemd-cgtop', 'cây · top theo cgroup'],
      ['choom -p PID -n 500', 'đổi oom_score_adj'],
    ], { fs: 14 })}
     ${term(['$ choom -p 125', "pid 125's current OOM score: 670", "pid 125's current OOM score adjust value: 0", '$ choom -p 144      # OOMScoreAdjust=-900', "= pid 144's current OOM score: 67"], { title: 'Ubuntu 24.04 — output thật', fs: 13 })}`,
    term(['$ systemd-run --scope -p MemoryMax=64M \\', '    -p MemorySwapMax=0 python3 -c "…200 MB…"; echo exit=$?', '! exit=137', '! bash: line 2:   118 Killed    systemd-run --scope …', '$ journalctl -n 3 -o cat', 'Memory cgroup out of memory: Killed process …', '!   (python3) … oom_score_adj:0', "! thu-bo-nho.scope: Failed with result 'oom-kill'.", '$ systemctl status nang | grep Memory', '+ Memory: 43.0M (max: 64.0M swap max: 0B', '+   available: 21.0M peak: 43.0M)', '$ systemd-cgtop -n1 -b --order=memory | head -3', '/                          14  -  85.9M', 'system.slice               10  -  77.0M', 'system.slice/nang.service   1  -  43.0M'], { title: 'Ubuntu 24.04 + systemd 255 — output thật', fs: 12.5 }), 'l') },

  { t: 'root được chẻ thành ~41 capability', body: two(
    `${term(['$ docker run --rm ubuntu:24.04 grep CapEff /proc/self/status', 'CapEff: 00000000a80425fb', '$ capsh --decode=00000000a80425fb', '= cap_chown,cap_dac_override,cap_fowner,cap_fsetid,', '= cap_kill,cap_setgid,cap_setuid,cap_setpcap,', '= cap_net_bind_service,cap_net_raw,cap_sys_chroot,', '= cap_mknod,cap_audit_write,cap_setfcap', '$ docker run --rm --cap-drop ALL ubuntu:24.04 chown nobody /tmp', "! chown: changing ownership of '/tmp': Operation not permitted"], { title: 'Docker trên Mac + capsh — output thật', fs: 12.5 })}
     ${box('info', 'Root trong container mặc định chỉ có 14 quyền con. Không có <code>cap_sys_admin</code> ⇒ không <code>mount</code>, không đổi hostname.')}`,
    `${term(['$ sysctl -w net.ipv4.ip_unprivileged_port_start=1024', '$ su an -c "py-web -m http.server 80"', '! PermissionError: [Errno 13] Permission denied', '$ setcap cap_net_bind_service=+ep /usr/local/bin/py-web', '$ getcap /usr/local/bin/py-web', '+ /usr/local/bin/py-web cap_net_bind_service=ep', "$ su an -c 'timeout 2 py-web -m http.server 80; echo rc=$?'", '= rc=124   # chạy được tới khi timeout giết', '$ getcap /usr/bin/ping', '/usr/bin/ping cap_net_raw=ep'], { title: 'Ubuntu 24.04 — output thật', fs: 12.5 })}
     ${box('good', 'Cho app đúng MỘT quyền (mở cổng &lt;1024) thay vì chạy cả app bằng root. Trong unit: <code>AmbientCapabilities=CAP_NET_BIND_SERVICE</code>.')}`) },

  /* ───────────── 14.2 ───────────── */
  { t: 'USE: mỗi tài nguyên, hỏi đúng ba câu', body: `${table(['Tài nguyên', 'U — mức dùng', 'S — bão hoà (xếp hàng)', 'E — lỗi'], [
    ['CPU', '<code>mpstat -P ALL 1</code> · <code>pidstat 1</code>', '<code>vmstat 1</code> cột r &gt; số lõi · <code>/proc/pressure/cpu</code>', '<code>perf stat</code> · dmesg'],
    ['Bộ nhớ', '<code>free -m</code> cột available', 'vmstat si/so ≠ 0 · <code>/proc/pressure/memory</code>', 'dmesg "Out of memory" · memory.events'],
    ['Đĩa I/O', '<code>iostat -xz 1</code> %util', 'aqu-sz, r_await/w_await · <code>pidstat -d</code>', '"I/O error" trong dmesg'],
    ['Dung lượng', '<code>df -h</code> · <code>df -i</code>', '—', 'ENOSPC "No space left"'],
    ['Mạng', '<code>sar -n DEV 1</code> rx/txkB/s', '<code>ss -s</code> · <code>nstat</code> retrans · drop', '<code>sar -n EDEV 1</code> · <code>ip -s link</code>'],
    ['Giới hạn phần mềm', 'số fd · số tiến trình', 'cgroup: <code>cpu.stat</code> nr_throttled', 'EMFILE · <code>pids.events</code>'],
  ], { sm: true })}
    ${box('info', 'Brendan Gregg (2012): <em>"For every resource, check utilization, saturation, and errors."</em> — theo ông giải được ~80% sự cố máy chủ với 5% công sức. Chương 12 đã giới thiệu; bài này đi hết cả bảng.')}` },

  { t: '"CPU rảnh 90%" mà một lõi đã kịch trần', body: two(
    term(['$ python3 ban.py &          # một vòng lặp đơn luồng', '$ mpstat -P ALL 2 1 | grep Average   # (cắt cột)', 'Average: CPU  %usr  %sys %iowait   %idle', '+ Average: all 10.26  0.20    0.10   88.89', '! Average:   5 100.00  0.00    0.00    0.00', '# …các lõi 0–4, 6–9 gần như rảnh', '$ pidstat -u 2 1 | sort -k8 -nr   # (cắt cột)', '    UID   PID   %usr %system    %CPU CPU Command', '! 0   235 100.00    0.00  100.00   - python3'], { title: 'Ubuntu 24.04 · 10 vCPU — output thật', fs: 13 }),
    `${steps([
      ['Tổng <code>all</code> 10% = 1/10 lõi', 'trung bình giấu mất lõi nghẽn'],
      ['<code>-P ALL</code>: từng lõi một', 'lõi 5 = 100%, không còn gì để cho'],
      ['<code>pidstat</code>: AI đang ăn', 'python3, 100% của MỘT lõi'],
      ['Kết luận: app đơn luồng', 'thêm lõi vô ích — tối ưu mã hoặc chạy nhiều tiến trình'],
    ])}`, 'r') },

  { t: 'Bão hoà: đếm hàng chờ, đừng nhìn phần trăm', body: two(
    term(['$ stress-ng --cpu 20 --timeout 12s &     # 20 việc / 10 lõi', '$ vmstat 1 4   # (bỏ dòng 1: trung bình từ lúc khởi động)', ' r  b   swpd   free …  us sy id wa st', '! 20  0 452384 646692 …  99  1  0  0  0', '! 20  0 452384 646692 … 100  0  0  0  0', '! 20  0 452384 646692 … 100  0  0  0  0', '$ cat /proc/pressure/cpu', '! some avg10=31.37 avg60=7.11 avg300=2.23 total=509912285', 'full avg10=0.00 avg60=0.00 avg300=0.00 total=0', '$ cat /proc/loadavg', '1.94 1.03 1.14 23/696 276'], { title: 'Ubuntu 24.04 · 10 vCPU — output thật', fs: 13 }),
    `${kpis([{ v: 'r = 20', l: 'việc CHỜ + đang chạy · 10 lõi', c: 'red' }, { v: '31%', l: 'PSI: thời gian có việc phải đợi CPU', c: 'amb' }, { v: '1,94', l: 'load 1 phút — trễ, chưa kịp lên', c: 'blu' }])}
     ${box('warn', 'CPU 100% chưa chắc là tệ; hàng chờ dài mới là tệ. PSI (từ Linux 4.20) nói thẳng "bao nhiêu % thời gian có ai đó phải đợi" — có cho CPU, bộ nhớ, I/O.')}`) },

  { t: 'perf + flame graph: hàm nào đang ăn CPU', body: `${lua()}
    ${two(
    term(['$ perf record -F 999 -g -- python3 -X perf app.py', '$ perf report --stdio --children --sort sym | grep py::', '96.60%  py::<module>:/tmp/app.py', '96.60%  py::xu_ly_don:/tmp/app.py', '! 93.96%  py::tinh_thue:/tmp/app.py', '67.55%  py::tinh_thue.<locals>.<genexpr>', '+  2.64%  py::doc_cau_hinh:/tmp/app.py'], { title: 'Ubuntu 24.04 · perf 6.8.12 — output thật', fs: 12.5 }),
    `${box('info', '<code>perf</code> lấy MẪU ngăn xếp 999 lần/giây. Không có ký hiệu (binary bị strip) thì chỉ thấy <code>0x0000…3104</code> — đã gặp thật với <code>gzip</code>. Python 3.12: thêm <code>-X perf</code>.')}
     ${box('tip', 'Máy ảo/container thường không có bộ đếm phần cứng: <code>cycles &lt;not supported&gt;</code>. Sự kiện phần mềm (task-clock, cpu-clock) vẫn chạy.')}`, 'l')}` },

  { t: 'Đĩa: đọc await và aqu-sz, đừng chỉ %util', body: two(
    term(['$ fio --name=ghi --rw=randwrite --bs=4k --direct=1 \\', '    --iodepth=16 --size=128M --runtime=8 --time_based &', '$ iostat -xz 1 2 | tail -2   # (cắt cột)', 'Device     w/s    wkB/s w_await wareq-sz aqu-sz %util', '! vda   64017.00 256068.00  0.17     4.00  10.77 66.20', '$ pidstat -d 1 2 | tail -1', 'Average: 0 34997 0.00 374157.21 0.00 0 fio', '$ grep -E "write:|99.00th" fio.txt', '+   write: IOPS=44.7k, BW=174MiB/s (183MB/s)', '|  99.00th=[ 1975], … 99.90th=[ 5014]   (µs)'], { title: 'Ubuntu 24.04 — output thật', fs: 12.5 }),
    table(['Cột', 'Đọc thế nào'], [
      ['<code>r/s w/s</code>', 'số yêu cầu mỗi giây (IOPS)'],
      ['<code>r_await w_await</code>', 'ms trung bình một yêu cầu, TÍNH CẢ thời gian xếp hàng'],
      ['<code>aqu-sz</code>', 'hàng chờ trung bình — bão hoà'],
      ['<code>%util</code>', '!% thời gian bận. SSD/NVMe xử lý song song ⇒ 100% vẫn còn sức'],
      ['<code>pidstat -d</code>', 'tiến trình nào đang đọc/ghi (khi không có <code>iotop</code>)'],
      ['<code>fio</code> p99', '1% yêu cầu chậm nhất — thứ người dùng cảm thấy'],
    ], { sm: true }), 'r') },

  { t: 'Mạng: băng thông, lỗi, hàng đợi — %ifutil ảo', body: two(
    term(['$ iperf3 -s -p 19140                  # container A', '$ iperf3 -c lx14-srv -p 19140 -t 5    # container B', '[ ID] Interval      Transfer     Bitrate         Retr', '+ [  5] 0.00-5.00 sec 27.1 GBytes 46.5 Gbits/sec  3491', '$ sar -n DEV 1 3 | grep Average', 'IFACE rxpck/s txpck/s  rxkB/s  txkB/s … %ifutil', '! eth0 50715.33 129778.67 3269.43 5720310.46 … 468.61', '$ sar -n EDEV 1 1 | grep Average   # (cắt cột)', 'IFACE rxerr/s txerr/s coll/s rxdrop/s txdrop/s', 'eth0     0.00    0.00   0.00     0.00     0.00'], { title: 'Hai container Ubuntu 24.04 — output thật', fs: 12.5 }),
    `${term(['$ ss -s', 'TCP:   103 (estab 0, closed 102, orphaned 0, timewait 2)', '$ nstat -az TcpRetransSegs TcpExtListenOverflows', 'TcpRetransSegs          0     0.0', 'TcpExtListenOverflows   0     0.0'], { title: 'Ubuntu 24.04 — output thật', fs: 13 })}
     ${box('warn', '%ifutil 468% vì card ảo (veth) tự khai tốc độ 10 Gbit/s. Trên máy ảo, đọc số tuyệt đối (kB/s, lỗi, drop, retrans) chứ đừng tin %.')}`) },

  /* ───────────── 14.3 ───────────── */
  { t: 'Từ đĩa tới thư mục: năm tầng', body: two(
    layers({ w: 520, cap: 'từ dưới lên', rows: [
      { k: '1', t: 'Phân vùng GPT trên đĩa · <code>sda1</code> · <code>nvme0n1p1</code>', c: 'blu' },
      { k: '2', t: '(tuỳ) LVM · PV → VG → LV', c: 'vio' },
      { k: '3', t: 'Hệ thống file · ext4 · XFS · btrfs', c: 'amb' },
      { k: '4', t: 'Gắn (mount) · <code>/etc/fstab</code> bằng <code>UUID=</code>', c: 'tea' },
      { k: '5', t: 'Thư mục bạn thấy · <code>/srv/db</code>', c: 'grn' },
    ] }),
    term(['$ lsblk -f', 'NAME        FSTYPE LABEL  UUID      FSUSE% MOUNTPOINTS', 'sda', '|-sda1      vfat          4A22-94E0     3% /boot/efi', '|-sda2      ext4          47e89fa2…    33% /boot', '`-sda3      btrfs  backup 88f2f4b2…    50% /mnt/backup', 'zram0       swap   zram0  8ce85e9f…       [SWAP]', 'nvme0n1', '`-nvme0n1p1 btrfs  fedora 1a1af067…    56% /home', '                                            /'], { title: 'Fedora 44 (linux-nha) — output thật (cắt cột)', fs: 12.5 }), 'r') },

  { t: 'Tập chia đĩa trên một FILE, không sợ hỏng', body: two(
    sh([
      ['truncate -s 1G dia1.img', 'file thưa: 1G mà 0 khối'],
      ['L=$(losetup -fP --show dia1.img)', 'thành /dev/loop0'],
      ['parted -s "$L" mklabel gpt \\', 'bảng phân vùng GPT'],
      ['  mkpart du-lieu ext4 1MiB 301MiB \\', 'p1: 300 MiB'],
      ['  mkpart lvm 301MiB 100% set 2 lvm on', 'p2: phần còn lại'],
      ['mkfs.ext4 -L du-lieu "${L}p1"', 'tạo hệ thống file'],
      ['blkid "${L}p1"', 'đọc UUID'],
      ['losetup -d "$L"', 'xong thì tháo ra'],
    ], { fs: 14 }),
    term(['$ ls -lhs dia1.img', '+ 0 -rw-r--r-- 1 root root 1.0G dia1.img', '$ parted -s /dev/loop0 print', 'Partition Table: gpt', 'Number  Start   End     Size   Name     Flags', ' 1      1049kB  316MB   315MB  du-lieu', ' 2      316MB   1073MB  757MB  lvm      lvm', '$ blkid /dev/loop0p1', '/dev/loop0p1: LABEL="du-lieu" UUID="a48bb7be-b8c1-…"', '  BLOCK_SIZE="4096" TYPE="ext4" PARTLABEL="du-lieu" …', '$ df -hT /mnt/du-lieu; df -i /mnt/du-lieu', '/dev/loop0p1 ext4 265M 24K 244M 1% /mnt/du-lieu', '/dev/loop0p1 76800 11 76789 1% /mnt/du-lieu'], { title: 'Ubuntu 24.04 (--privileged) — output thật', fs: 12.5 })) },

  { t: 'fstab: gắn bằng UUID, thêm nofail', body: `${annot(FST, [
    { ...doan(FST, 'UUID=a48bb7be…'), t: 'thiết bị', d: 'UUID — không đổi khi đổi khe cắm', c: 'lx' },
    { ...doan(FST, '/mnt/du-lieu'), t: 'điểm gắn', d: 'thư mục phải có sẵn', c: 'grn' },
    { ...doan(FST, 'ext4'), t: 'loại', d: 'ext4 · xfs · btrfs', c: 'tea' },
    { ...doan(FST, 'defaults,nofail'), t: 'tuỳ chọn', d: 'nofail: thiếu đĩa vẫn khởi động', c: 'amb' },
    { ...doan(FST, '0  2'), to: doan(FST, '0  2').from + 1, t: 'dump', d: 'luôn 0', c: 'dim' },
    { from: FST.length - 1, to: FST.length, t: 'fsck', d: '1 = /, 2 = còn lại, 0 = bỏ', c: 'blu' },
  ], { fs: 25, rowH: 54 })}
    ${two(
    term(['$ findmnt --verify --tab-file /tmp/fstab.sai', '/mnt/x', '!    [E] unreachable on boot required target: No such file…', '!    [E] unreachable on boot required source: UUID=sai-mot-chu', '0 parse errors, 2 errors, 1 warning', '$ mount -a && findmnt /mnt/du-lieu', '= /mnt/du-lieu /dev/loop0p1 ext4 rw,relatime'], { title: 'Ubuntu 24.04 — output thật', fs: 12.5 }),
    box('bad', 'Một dòng fstab sai (UUID gõ nhầm, đĩa gỡ ra) mà thiếu <code>nofail</code> ⇒ máy dừng ở chế độ khẩn cấp khi khởi động, SSH chưa lên. Máy nhà thật: <code>…/mnt/backup btrfs defaults,noatime,…,nofail,x-systemd.device-timeout=10</code>.'))}` },

  { t: 'LVM: nới ổ đĩa khi app vẫn đang chạy', body: `${lvm()}
    ${two(
    term(['$ df -h /srv/db | tail -1', '! /dev/mapper/vg_app-lv_db  359M  331M  352K 100% /srv/db', '$ lvextend -r -L +250M vg_app/lv_db', 'Size of logical volume vg_app/lv_db changed from 400.00 MiB', '  (100 extents) to 652.00 MiB (163 extents).', '… on-line resizing required', '$ df -h /srv/db | tail -1', '= /dev/mapper/vg_app-lv_db  598M  331M  236M  59% /srv/db'], { title: 'Ubuntu 24.04 — output thật', fs: 12.5 }),
    term(['$ pvcreate /dev/loop1; vgextend vg_app /dev/loop1', '  Volume group "vg_app" successfully extended', '$ lvextend -r -l +100%FREE vg_app/lv_db', '$ df -h /srv/db | tail -1', '= /dev/mapper/vg_app-lv_db  1.2G  331M  773M  30% /srv/db', '$ lvs -o lv_name,lv_size,devices vg_app', '  lv_db <1.20g /dev/loop0p2(0)', '  lv_db <1.20g /dev/loop1(0)'], { title: 'Ubuntu 24.04 — output thật', fs: 12.5 }))}` },

  { t: 'ext4 hay XFS — và swap file năm dòng', body: two(
    `${table(['', 'ext4', 'XFS'], [
      ['Mặc định của', 'Ubuntu, Debian', 'RHEL, Rocky, Fedora Server'],
      ['Nới khi đang gắn', '+có (<code>resize2fs</code>)', '+có (<code>xfs_growfs</code>)'],
      ['THU NHỎ', '+có (phải umount)', '-KHÔNG BAO GIỜ'],
      ['Số inode', '!cố định lúc <code>mkfs</code> (<code>-i</code>, <code>-N</code>)', '+cấp động'],
      ['Hợp với', 'hầu hết mọi thứ', 'file rất lớn, ghi song song'],
    ], { sm: true })}
     ${term(['$ lvreduce -r -y -L 200M vg_x/lv_x      # đang là XFS', '! fsadm: Xfs filesystem shrinking is unsupported.', '!   Filesystem resize failed.'], { title: 'Ubuntu 24.04 — output thật', fs: 13 })}`,
    `${sh([
      ['fallocate -l 2G /swapfile', 'cấp chỗ thật (không thưa)'],
      ['chmod 600 /swapfile', 'không thì swapon cảnh báo'],
      ['mkswap /swapfile', 'ghi chữ ký swap'],
      ['swapon /swapfile', 'bật ngay'],
      ["echo '/swapfile none swap sw 0 0' >> /etc/fstab", 'sống qua reboot'],
    ], { fs: 14 })}
     ${term(['$ swapon --show', 'NAME             TYPE  SIZE USED PRIO', '/var/lib/swap    file 1024M 441.8M  -1', '+ /srv/db/swapfile file  128M    0B  -1'], { title: 'Ubuntu 24.04 — output thật (128M để thử)', fs: 13 })}
     ${box('info', 'Chương 11.3 đã nói VÌ SAO cần swap; ở đây là cách làm trên hệ thống file bạn tự dựng.')}`) },

  { t: 'Checksum: sai một byte là FAILED', body: `${two(
    term(['$ sha256sum goi.tar > goi.tar.sha256', '$ sha256sum -c goi.tar.sha256', '= goi.tar: OK', '$ printf "\\x00" | dd of=goi.tar bs=1 seek=1000 conv=notrunc', '$ sha256sum -c goi.tar.sha256; echo rc=$?', '! goi.tar: FAILED', '! sha256sum: WARNING: 1 computed checksum did NOT match', 'rc=1', '# 300 MB: sha256sum 0,158 s · b3sum 0,060 s', '#         b3sum --num-threads 1: 0,295 s'], { title: 'Ubuntu 24.04 (arm64) — output thật', fs: 12.5 }),
    term(['# nguồn và đích: cùng CỠ, cùng GIỜ SỬA, khác nội dung', '$ rsync -av nguon/ dich/ | sed -n 2p', '! # (trống — không file nào được chép)', '$ cat dich/app.env', '! PORT=3000', '$ rsync -avc nguon/ dich/ | sed -n 2p', '+ app.env', '$ cat dich/app.env', '= PORT=4000'], { title: 'Ubuntu 24.04 — output thật', fs: 13 }))}
    ${two(box('info', '<code>sha256sum -c</code> trả mã thoát 1 khi lệch ⇒ dùng thẳng trong script: <code>sha256sum -c x.sha256 || exit 1</code>. BLAKE3 (<code>b3sum</code>) nhanh nhờ chạy nhiều luồng; một luồng thì SHA-256 có phần cứng hỗ trợ lại thắng.'), box('warn', 'rsync mặc định chỉ so CỠ + GIỜ SỬA (“quick check”). Hai file trùng cả hai mà khác nội dung ⇒ bị bỏ qua. <code>-c</code> băm từng file: chậm hơn, nhưng chắc.'))}` },

  /* ───────────── 14.4 ───────────── */
  { t: 'Bảo mật là nhiều lớp, mỗi lớp phải KIỂM được', body: two(
    layers({ w: 540, cap: '1 = lớp ngoài cùng', rows: [
      { k: '1', t: 'Tường lửa nftables · chỉ mở cổng cần', c: 'red' },
      { k: '2', t: 'SSH chỉ khoá · <code>sshd -T</code> nghiệm thu', c: 'amb' },
      { k: '3', t: 'fail2ban cho SSH VÀ app của bạn', c: 'ora' },
      { k: '4', t: 'sudo hẹp · quyền tối thiểu', c: 'grn' },
      { k: '5', t: 'SELinux / AppArmor · nhãn và hồ sơ', c: 'tea' },
      { k: '6', t: 'auditd ghi vết · lynis chấm điểm · cập nhật', c: 'blu' },
    ] }),
    table(['Lớp', 'Lệnh NGHIỆM THU (không phải cat file)'], [
      ['Tường lửa', '<code>nft list ruleset</code> + curl từ máy KHÁC'],
      ['SSH', '<code>sshd -T</code> · <code>sshd -T -C user=…</code>'],
      ['fail2ban', '<code>fail2ban-regex</code> · <code>fail2ban-client status</code>'],
      ['sudo', '<code>sudo -l -U an</code> · thử leo quyền'],
      ['SELinux', '<code>getenforce</code> · <code>ls -Z</code> · journal setroubleshoot'],
      ['Cả máy', '<code>lynis audit system</code> · Hardening index'],
    ], { sm: true }), 'r') },

  { t: 'SSH: khoá ed25519, nghiệm thu bằng sshd -T', body: two(
    `${term(['$ time ssh-keygen -t ed25519 -C an@laptop -f k_ed', '# … 0.013 total', '$ time ssh-keygen -t rsa -b 4096 -C an@laptop -f k_rsa', '# … 0.954 total', '$ wc -c k_ed.pub k_rsa.pub', '+       91 k_ed.pub', '!      735 k_rsa.pub', '$ ssh-keygen -lf k_ed.pub', '256 SHA256:pLC+2JcS…Es an@laptop (ED25519)'], { title: 'Mac · OpenSSH_10.3p1 — output thật', fs: 13 })}
     ${box('tip', 'Khoá bí mật nên có mật khẩu (<code>-N</code> rỗng = không) + <code>ssh-agent</code>. <code>-a 100</code> chỉ làm chậm dò mật khẩu KHI có mật khẩu.')}`,
    `${term(['$ sshd -t && echo OK; sshd -T | grep -E "^(passwordauth|permitroot|allowgroups|maxauthtries)"', '= OK', 'maxauthtries 3', 'permitrootlogin no', 'passwordauthentication no', '! allowgroups ssh-users', '$ sshd -T -C user=ban,host=x,addr=10.0.0.5 | grep -E "^(forcecommand|allowtcp)"', '+ allowtcpforwarding no', '+ forcecommand internal-sftp'], { title: 'Ubuntu 24.04 · OpenSSH 9.6p1 — output thật', fs: 12.5 })}
     ${box('bad', '<code>AllowGroups ssh-users</code> mà CHÍNH BẠN chưa vào nhóm ⇒ tự khoá mình ngoài cửa. Thêm nhóm, giữ phiên cũ, thử phiên mới.')}`) },

  { t: 'nftables: tự viết một bộ luật đọc được', body: two(
    sh([
      ['# /etc/nftables.conf (rút gọn — bản đủ trong bài)', ''],
      ['table inet loc {', 'inet = IPv4 + IPv6'],
      ['  set chan_ip { type ipv4_addr; flags timeout; }', 'danh sách cấm có hạn'],
      ['  chain vao {', ''],
      ['    type filter hook input priority filter', 'gắn vào đường VÀO'],
      ['    policy drop', 'mặc định: CHẶN'],
      ['    ct state established,related accept', 'trả lời đã hỏi'],
      ['    iif "lo" accept', 'localhost'],
      ['    ip saddr @chan_ip counter drop', 'IP trong danh sách'],
      ['    tcp dport 22 ct state new limit rate 10/minute accept', 'SSH có hạn mức'],
      ['    tcp dport { 80, 443, 19141 } accept', 'web'],
      ['    counter comment "roi xuong day = bi chan"', 'đếm gói bị chặn'],
      ['  }', ''],
      ['}', ''],
    ], { fs: 13 }),
    `${term(['$ nft -c -f /etc/nftables.conf && echo "cu phap OK"', '= cu phap OK', '$ nft -f /etc/nftables.conf', '# từ container khác (172.17.0.8):', '+ cong 19141: 200', '! cong 19142: curl exit 28   (hết giờ — DROP)', '$ nft add element inet loc chan_ip \\', '    { 172.17.0.8 timeout 10m }', '! cong 19141: curl exit 28', '$ nft list chain inet loc vao | grep chan_ip', '    ip saddr @chan_ip counter packets 3 bytes 180 drop'], { title: 'Ubuntu 24.04 — output thật', fs: 12.5 })}
     ${box('warn', 'Luôn <code>nft -c</code> trước, luật SSH trước <code>policy drop</code>, và <code>systemctl enable nftables</code> để sống qua reboot.')}`, 'l') },

  { t: 'fail2ban cho log của chính app bạn', body: two(
    `${sh([
      ['# /etc/fail2ban/filter.d/app-login.conf', ''],
      ['[Definition]', ''],
      ['failregex = ^.* LOGIN FAIL user=\\S+ ip=<HOST>$', '<HOST> = IP bị bắt'],
      ['# /etc/fail2ban/jail.d/app-login.local', ''],
      ['[app-login]', ''],
      ['logpath  = /var/log/app/login.log', 'log của APP'],
      ['maxretry = 5', ''],
      ['findtime = 10m', '5 lần / 10 phút'],
      ['bantime  = 1h', ''],
      ['port     = 80,443', 'chỉ chặn cổng web'],
      ['banaction = nftables-multiport', ''],
    ], { fs: 13 })}
     ${term(['$ fail2ban-regex /tmp/mau.log filter.d/app-login.conf', 'Lines: 3 lines, 0 ignored, 2 matched, 1 missed', '! |  … INFO LOGIN OK user=an ip=198.51.100.4'], { title: 'thử bộ lọc TRƯỚC khi bật', fs: 12.5 })}`,
    term(['$ fail2ban-client status app-login', '|- Filter', '|  |- Total failed:     6', '|  `- File list:        /var/log/app/login.log', '`- Actions', '!   |- Currently banned: 1', '!   `- Banned IP list:   203.0.113.7', '$ nft list ruleset | sed -n "/f2b/,$p"', 'table inet f2b-table {', '  set addr-set-app-login {', '+   elements = { 203.0.113.7 }', '  chain f2b-chain {', '    tcp dport { 80, 443 } ip saddr @addr-set-app-login', '      reject with icmp port-unreachable'], { title: 'Ubuntu 24.04 · fail2ban 1.0.2 — output thật (cắt)', fs: 12.5 }), 'l') },

  { t: 'SELinux: nhãn quyết định, không phải rwx', body: `${nhan()}
    ${two(
    term(['$ getenforce', '+ Enforcing', '$ ls -Z /tmp/lx14-mv.txt', 'unconfined_u:object_r:user_tmp_t:s0 /tmp/lx14-mv.txt', '$ mv /tmp/lx14-mv.txt .; cp /tmp/lx14-cp.txt .', '$ ls -Z lx14-mv.txt lx14-cp.txt', '! …:user_tmp_t:s0  lx14-mv.txt    ← mv GIỮ nhãn cũ', '+ …:user_home_t:s0 lx14-cp.txt    ← cp nhận nhãn mới', '$ restorecon -v lx14-mv.txt', '= Relabeled … from …user_tmp_t:s0 to …user_home_t:s0'], { title: 'Fedora 44 (linux-nha) — output thật, không sudo', fs: 12 }),
    term(['$ journalctl -t setroubleshoot --since -30d', '! SELinux is preventing sshd-session from name_bind', '!   access on the tcp_socket port 18030.', '*****  Plugin bind_ports (92.2 confidence) suggests ***', '+ # semanage port -a -t ssh_port_t -p tcp 18030', '*****  Plugin catchall (1.41 confidence) suggests  ***', "# ausearch -c 'sshd-session' --raw | audit2allow -M …"], { title: 'Fedora 44 — sự cố THẬT ngày 23/09', fs: 12 }))}` },

  { t: 'sudo "hẹp" mà vẫn thành root: find, less *', body: two(
    `${sh([
      ['# /etc/sudoers.d/an  —  SAI', ''],
      ['an ALL=(root) NOPASSWD: /usr/bin/find', 'find chạy được lệnh!'],
      ['an ALL=(root) NOPASSWD: /usr/bin/less /var/log/*', '* khớp cả ../'],
    ], { fs: 13.5 })}
     ${term(['$ sudo find /tmp -maxdepth 0 -exec /bin/sh -c "id" \\;', '! uid=0(root) gid=0(root) groups=0(root)', '$ sudo less /var/log/../../etc/shadow | head -1', '! root:*:20707:0:99999:7:::'], { title: 'Ubuntu 24.04 · người thường "an" — output thật', fs: 12.5 })}`,
    `${sh([
      ['# /etc/sudoers.d/an  —  ĐÚNG', ''],
      ['Cmnd_Alias APP = \\', 'ghi ĐỦ tham số'],
      ['    /usr/bin/systemctl restart nang.service', ''],
      ['an ALL=(root) NOPASSWD: APP', ''],
      ['an ALL=(root) NOPASSWD: NOEXEC: /usr/bin/find', 'cấm exec con'],
      ['an ALL=(root) sudoedit /etc/nang/app.env', 'không vim-root'],
    ], { fs: 12.5 })}
     ${term(['$ visudo -c -q && echo "visudo OK"', '= visudo OK', '$ sudo find /tmp -maxdepth 0 -exec /bin/sh -c id \\;', "+ find: '/bin/sh': Permission denied", '$ sudo -n systemctl stop nang.service', '+ sudo: a password is required'], { title: 'Ubuntu 24.04 — output thật', fs: 12.5 })}
     ${box('tip', 'Tra mọi chương trình "thoát ra shell được" ở GTFOBins trước khi cho vào sudoers.')}`, 'r') },

  { t: 'lynis chấm điểm; auditd ghi ai sửa gì', body: two(
    `${term(['$ lynis audit system --quick --no-colors', '  Hardening index : 64 [############        ]', '  Tests performed : 238', '! ! Found one or more vulnerable packages. [PKGS-7392]', '  * Install needrestart … [DEB-0831]', '  * Copy /etc/fail2ban/jail.conf to jail.local … [DEB-0880]', '  * Default umask in /etc/login.defs could be more', '    strict like 027 [AUTH-9328]', '  * Enable auditd to collect audit information [ACCT-9628]', '# 2 cảnh báo + 40 gợi ý · báo cáo: /var/log/lynis-report.dat'], { title: 'Ubuntu 24.04 · lynis 3.0.9 — output thật', fs: 12.5 })}
     ${box('info', 'Điểm là để SO SÁNH trước/sau trên CÙNG một máy, không phải thi đua. Đọc từng mã (<code>lynis show details AUTH-9328</code>), làm cái đáng làm.')}`,
    `${sh([
      ['# /etc/audit/rules.d/cung.rules', ''],
      ['-w /etc/sudoers -p wa -k sudoers', 'ai GHI/đổi thuộc tính'],
      ['-w /etc/sudoers.d/ -p wa -k sudoers', ''],
      ['-w /etc/ssh/sshd_config.d/ -p wa -k sshd', ''],
      ['augenrules --load', 'nạp luật'],
      ['ausearch -k sudoers -i', 'đọc: ai, lúc nào, lệnh gì'],
      ['aureport --auth --summary', 'tổng kết đăng nhập'],
    ], { fs: 13 })}
     ${term(['$ auditctl -w /etc/sudoers -p wa -k sudoers', '! Error sending add rule data request (Operation not permitted)', '# nhân chỉ có MỘT hệ audit, không chia theo namespace', '# ⇒ container không bật được — cần máy/VM thật'], { title: 'Ubuntu 24.04 container — output thật', fs: 12.5 })}`) },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 14', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Script chậm như rùa khi ghi file', 'ghi từng byte ⇒ hàng triệu syscall', 'gom bộ đệm; <code>strace -c</code> để thấy'],
    ['"CPU mới 10%" mà app đứng', 'app đơn luồng kịch một lõi', '<code>mpstat -P ALL</code> · <code>pidstat</code>'],
    ['Đĩa %util 100% ⇒ tưởng hỏng', 'SSD làm song song, %util nói quá', 'xem <code>w_await</code>, <code>aqu-sz</code>'],
    ['Container bị giết, exit 137', 'chạm <code>memory.max</code> của cgroup', '<code>memory.events</code> · tăng trần hoặc sửa rò rỉ'],
    ['Máy không lên sau khi gắn đĩa', 'dòng fstab sai, không <code>nofail</code>', '<code>findmnt --verify</code> TRƯỚC reboot'],
    ['Muốn thu nhỏ ổ XFS', 'XFS không thu nhỏ được', 'sao lưu → tạo lại; dùng ext4 nếu cần co'],
    ['rsync báo xong mà file cũ', 'so cỡ + giờ sửa, không so nội dung', '<code>rsync -c</code> · kiểm <code>sha256sum</code>'],
    ['Web trả 403 dù quyền 644', 'SELinux: file <code>mv</code> từ ~ mang nhãn cũ', '<code>restorecon -Rv</code>, đừng <code>setenforce 0</code>'],
    ['sudo "chỉ cho find/less" mà bị chiếm root', 'chương trình thoát ra shell · <code>*</code> khớp <code>../</code>', 'Cmnd_Alias đủ tham số · NOEXEC · sudoedit'],
    ['AllowGroups xong không vào được', 'chính mình chưa trong nhóm', 'thêm nhóm, giữ phiên cũ, thử phiên mới'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 14 (1/2): nhân, hiệu năng', body: two(
    sh([
      ['strace -c CMD · -f -e trace=%file', 'đếm · theo dõi syscall'],
      ['sysctl -a · sysctl -w k=v · /etc/sysctl.d/', 'núm vặn nhân'],
      ['unshare --pid --fork --mount-proc bash', 'namespace mới'],
      ['lsns · nsenter -t PID -a', 'liệt kê · bước vào'],
      ['cat /sys/fs/cgroup/<nhóm>/memory.events', 'OOM trong cgroup'],
      ['systemd-run --scope -p MemoryMax=64M CMD', 'cgroup tạm'],
      ['systemd-cgls · systemd-cgtop', 'cây · top theo nhóm'],
      ['capsh --print · getcap · setcap', 'capability'],
      ['choom -p PID [-n N] · OOMScoreAdjust=', 'thứ tự bị OOM giết'],
      ['cat /proc/pressure/{cpu,memory,io}', 'PSI — thời gian CHỜ'],
    ], { fs: 13 }),
    sh([
      ['mpstat -P ALL 1', 'CPU từng lõi'],
      ['pidstat 1 · -d · -r · -t', 'theo tiến trình/luồng'],
      ['vmstat 1', 'r · si/so · wa'],
      ['iostat -xz 1', 'await · aqu-sz · %util'],
      ['sar -n DEV 1 · -n EDEV · -q', 'mạng · lỗi · hàng chờ'],
      ['ss -s · nstat -az TcpRetransSegs', 'socket · gửi lại'],
      ['perf stat CMD · perf top', 'đếm · xem nóng'],
      ['perf record -F 99 -g CMD · perf report', 'lấy mẫu ngăn xếp'],
      ['fio --rw=randwrite --bs=4k --direct=1', 'đo đĩa'],
      ['iperf3 -s · iperf3 -c HOST', 'đo mạng'],
    ], { fs: 13 })) },

  { t: 'Bảng tra nhanh Chương 14 (2/2): lưu trữ, bảo mật', body: two(
    sh([
      ['lsblk -f · blkid · findmnt', 'đĩa · UUID · đang gắn'],
      ['truncate -s 1G x.img; losetup -fP --show x.img', 'đĩa thử'],
      ['parted -s DEV mklabel gpt mkpart …', 'phân vùng'],
      ['mkfs.ext4 -L nhan DEV · mkfs.xfs DEV', 'tạo FS'],
      ['findmnt --verify · mount -a', 'kiểm fstab'],
      ['pvcreate · vgcreate · lvcreate -n X -L 1G VG', 'LVM'],
      ['vgextend VG DEV · lvextend -r -L +1G VG/LV', 'nới khi chạy'],
      ['mkswap · swapon --show · swapoff', 'swap'],
      ['sha256sum -c F.sha256 · b3sum F', 'kiểm file'],
      ['rsync -avc NGUON/ DICH/', 'so bằng nội dung'],
    ], { fs: 13 }),
    sh([
      ['ssh-keygen -t ed25519 -C "ai@may"', 'khoá mới'],
      ['sshd -t · sshd -T -C user=U,addr=IP', 'giá trị THẬT'],
      ['nft -c -f F · nft list ruleset', 'kiểm · xem luật'],
      ['nft add element inet T S { IP timeout 1h }', 'cấm tạm'],
      ['fail2ban-regex LOG FILTER', 'thử bộ lọc'],
      ['fail2ban-client status JAIL · unbanip', 'ai bị cấm'],
      ['getenforce · ls -Z · restorecon -Rv', 'SELinux'],
      ['aa-status · journalctl -k | grep DENIED', 'AppArmor'],
      ['visudo -c · sudo -l -U an', 'sudoers'],
      ['lynis audit system · ausearch -k K -i', 'chấm điểm · vết'],
    ], { fs: 13 })) },

  { t: 'Thực hành Chương 14 (45 phút): mổ một container', body: `
    ${steps([
      ['<code>strace -c</code> so <code>dd bs=1</code> với <code>bs=1M</code>; <code>unshare --pid</code> xem PID 1', 'giải thích con số syscall'],
      ['cgroup <code>memory.max=64M</code>: cho một script ăn 200 MB', 'thấy <code>oom_kill 1</code> + exit 137'],
      ['<code>mpstat -P ALL</code> + <code>pidstat</code> với một vòng lặp đơn luồng; <code>perf record</code> một script', 'chỉ đúng lõi và đúng hàm'],
      ['Đĩa file 1G: GPT → ext4 → fstab <code>nofail</code>; LVM rồi <code>lvextend -r</code> khi đang ghi', '<code>df</code> tăng, không umount'],
      ['nftables policy drop + mở 1 cổng; sudoers có lỗ <code>find</code> ⇒ sửa bằng NOEXEC', 'curl 200/timeout · <code>id</code> không còn root'],
    ])}
    ${box('good', '<strong>Đạt khi:</strong> có output thật cho 5 bước, rồi <code>losetup -d</code> từng thiết bị, <code>docker rm -f</code> và xoá file .img.')}` },
].map((s) => (s.kind === 'cover' ? s : { ...s, body: FIX + s.body })));
