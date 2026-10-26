/**
 * osg-cs6 — OSG202 · ⭐ Advanced 6 "Containers = namespaces + cgroups" (deck tự dựng, slide EN, khuôn _pg-chung.mjs, 25/10/2026).
 * Đề cương: REPO/OSG202/CHUYEN-SAU.md mục 6. Mọi output = CHẠY THẬT, lưu ở REPO/OSG202/cs-nguon/cs6/*.out.txt
 * Môi trường đo: macOS 27.0.1 (arm64) + Docker Desktop 29.8.0 ⇒ VM Linux kernel 7.0.12-linuxkit, cgroup v2 (cgroupfs driver),
 * snapshotter overlayfs (containerd). Thí nghiệm namespace/cgroup chạy trong container --privileged (image tạm osg-cs6-tools = debian:12
 * + util-linux/strace/busybox-static, xem cs-nguon/cs6/Dockerfile). Nguồn: man7 namespaces(7), kernel.org cgroup-v2 + Yama,
 * docs.docker.com seccomp. Sự cố thật: deploy.sh Step 2a/2b (2026-07-06/07 next build exit 137 trên VPS 6 GB).
 */
import { lamDeck, sql, psql, sh, two as two0, box, steps, cards, kw, vsd, c, tbl } from './_pg-chung.mjs';

/* two() của khuôn đặt TỪNG phần tử con vào lưới ⇒ bọc mỗi cột trong <div> để cột có nhiều khối không bị tràn sang hàng sau */
const two = (a, b, ti = '') => two0(`<div style="display:flex;flex-direction:column;gap:12px">${a}</div>`, `<div style="display:flex;flex-direction:column;gap:12px">${b}</div>`, ti);

export const deck = { key: 'cs6', code: 'CS.6', title: 'Containers = namespaces + cgroups', sub: 'OSG202 · ⭐ Advanced' };

const out = (t, o = {}) => psql(t, { title: 'output', sm: true, ...o });
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const bash = (s, o = {}) => sql(s, { lang: 'bash', sm: true, ...o });
const zm = (h, z) => `<div style="zoom:${z}">${h}</div>`;
const AR = (id, col) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${col}"/></marker>`;
/* rộng chữ ước lượng: 0,602 × cỡ chữ × số ký tự */
const tw = (s, fs) => Math.ceil(String(s).length * 0.602 * fs);

/* ── Hình 1: nhà riêng (VM) vs căn hộ chung cư (container) ── */
const apartment = () => {
  let s = `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial">`;
  // trái: 3 nhà riêng
  s += `<text x="255" y="26" text-anchor="middle" font-size="22" font-weight="800" fill="#b85a2b">Virtual machines = separate houses</text>`;
  [20, 185, 350].forEach((x, i) => {
    s += `<path d="M${x},140 L${x + 70},88 L${x + 140},140 z" fill="#fbe9dc" stroke="#b85a2b" stroke-width="2.5"/>`;
    s += `<rect x="${x + 12}" y="140" width="116" height="90" fill="#fff7ef" stroke="#b85a2b" stroke-width="2.5"/>`;
    s += `<text x="${x + 70}" y="178" text-anchor="middle" font-size="17" fill="#333">app ${i + 1}</text>`;
    s += `<text x="${x + 70}" y="204" text-anchor="middle" font-size="15" fill="#666">own OS</text>`;
    s += `<rect x="${x}" y="232" width="140" height="34" fill="#b85a2b"/>`;
    s += `<text x="${x + 70}" y="255" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">own kernel</text>`;
  });
  s += `<text x="255" y="300" text-anchor="middle" font-size="18" fill="#555">each house: its own foundation, plumbing, wiring</text>`;
  s += `<text x="255" y="322" text-anchor="middle" font-size="18" fill="#555">→ strong walls, but heavy and slow to build</text>`;
  // phải: chung cư
  const X = 600;
  s += `<text x="${X + 245}" y="26" text-anchor="middle" font-size="22" font-weight="800" fill="#336791">Containers = flats in one building</text>`;
  s += `<rect x="${X}" y="44" width="490" height="190" rx="6" fill="#eef4fa" stroke="#336791" stroke-width="2.5"/>`;
  [0, 1, 2].forEach((i) => {
    const fx = X + 18 + i * 158;
    s += `<rect x="${fx}" y="60" width="140" height="160" rx="6" fill="#fff" stroke="#336791" stroke-width="2"/>`;
    s += `<text x="${fx + 70}" y="88" text-anchor="middle" font-size="17" font-weight="700" fill="#333">flat ${i + 1}</text>`;
    s += `<text x="${fx + 12}" y="118" font-size="15" fill="#245077">🚪 own door no.</text>`;
    s += `<text x="${fx + 12}" y="144" font-size="15" fill="#245077">📬 own mailbox</text>`;
    s += `<text x="${fx + 12}" y="170" font-size="15" fill="#b85a2b">⚡ own meter</text>`;
    s += `<text x="${fx + 12}" y="196" font-size="15" fill="#b85a2b">🔌 own breaker</text>`;
  });
  s += `<rect x="${X}" y="232" width="490" height="34" fill="#336791"/>`;
  s += `<text x="${X + 245}" y="255" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">ONE shared foundation = ONE Linux kernel</text>`;
  s += `<text x="${X + 245}" y="300" text-anchor="middle" font-size="18" fill="#555"><tspan fill="#245077" font-weight="700">door/mailbox</tspan> = namespaces (what you SEE)</text>`;
  s += `<text x="${X + 245}" y="322" text-anchor="middle" font-size="18" fill="#555"><tspan fill="#b85a2b" font-weight="700">meter/breaker</tspan> = cgroups (how much you USE)</text>`;
  return s + `</svg>`;
};

/* ── Hình 2: chồng tầng VM vs container ── */
const stacks = () => {
  const box2 = (x, y, w, h, t, f, st, fs = 17, col = '#333') =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${f}" stroke="${st}" stroke-width="2"/><text x="${x + w / 2}" y="${y + h / 2 + fs * 0.35}" text-anchor="middle" font-size="${fs}" fill="${col}" font-weight="700">${t}</text>`;
  let s = `<svg viewBox="0 0 560 330" width="560" height="330" font-family="Arial">`;
  s += `<text x="135" y="22" text-anchor="middle" font-size="19" font-weight="800" fill="#b85a2b">Virtual machine</text>`;
  s += `<text x="420" y="22" text-anchor="middle" font-size="19" font-weight="800" fill="#336791">Container</text>`;
  [0, 1].forEach((i) => {
    const x = 10 + i * 90;
    s += box2(x, 36, 82, 44, 'app', '#fff7ef', '#e08a1e', 15);
    s += box2(x, 84, 82, 44, 'libs', '#fff7ef', '#e08a1e', 15);
    s += box2(x, 132, 82, 56, 'guest', '#fbe9dc', '#b85a2b', 14);
    s += `<text x="${x + 41}" y="180" text-anchor="middle" font-size="14" fill="#333" font-weight="700">kernel</text>`;
  });
  s += box2(190, 36, 74, 152, '…', '#fff', '#ccc', 22, '#999');
  s += box2(10, 194, 254, 50, 'hypervisor', '#f3f0ea', '#999', 17);
  s += box2(10, 248, 254, 34, 'host kernel', '#e9e9e9', '#999', 15);
  s += box2(10, 286, 254, 34, 'hardware', '#ddd', '#999', 15);
  [0, 1, 2].forEach((i) => {
    const x = 296 + i * 88;
    s += box2(x, 132, 80, 44, 'app', '#eef4fa', '#336791', 15);
    s += box2(x, 180, 80, 44, 'libs', '#eef4fa', '#336791', 15);
  });
  s += `<rect x="296" y="228" width="256" height="54" rx="6" fill="#336791"/><text x="424" y="251" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">ONE shared Linux kernel</text><text x="424" y="272" text-anchor="middle" font-size="14" fill="#fff">namespaces + cgroups</text>`;
  s += box2(296, 286, 256, 34, 'hardware', '#ddd', '#999', 15);
  return s + `</svg>`;
};

/* ── Hình 3: công thức container ── */
const recipe = () => {
  let s = `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial"><defs>${AR('ra', '#999')}</defs>`;
  s += `<ellipse cx="555" cy="165" rx="170" ry="62" fill="#fff3c4" stroke="#e08a1e" stroke-width="3"/>`;
  s += `<text x="555" y="158" text-anchor="middle" font-size="24" font-weight="800" fill="#333">an ordinary process</text>`;
  s += `<text x="555" y="188" text-anchor="middle" font-size="18" fill="#666">e.g. node server.js, PID 48028</text>`;
  const it = [
    [20, 20, '#336791', '① namespaces', 'what it can SEE', 'PIDs, hostname, network, mounts, users'],
    [740, 20, '#b85a2b', '② cgroups', 'how much it can USE', 'memory.max · cpu.max · pids.max'],
    [20, 220, '#2f7d4f', '③ root filesystem', 'which files are “/”', 'image layers via overlayfs'],
    [740, 220, '#8e44ad', '④ capabilities + seccomp', 'what it may DO', 'root, but with most powers removed'],
  ];
  it.forEach(([x, y, m, h, a, b]) => {
    s += `<rect x="${x}" y="${y}" width="350" height="92" rx="12" fill="${m}12" stroke="${m}" stroke-width="2.5"/>`;
    s += `<text x="${x + 16}" y="${y + 30}" font-size="22" font-weight="800" fill="${m}">${h}</text>`;
    s += `<text x="${x + 16}" y="${y + 56}" font-size="19" font-weight="700" fill="#333">${a}</text>`;
    s += `<text x="${x + 16}" y="${y + 80}" font-size="16" fill="#666">${b}</text>`;
    const ex = x < 400 ? x + 350 : x, ey = y + 46;
    const tx = x < 400 ? 395 : 715, ty = y < 100 ? 130 : 200;
    s += `<line x1="${ex}" y1="${ey}" x2="${tx}" y2="${ty}" stroke="#999" stroke-width="2.5" stroke-dasharray="6 5" marker-end="url(#ra)"/>`;
  });
  return s + `</svg>`;
};

/* ── Hình 4: số PID lồng nhau ── */
const pidNest = () => {
  let s = `<svg viewBox="0 0 520 330" width="520" height="330" font-family="Arial"><defs>${AR('rp', '#e08a1e')}</defs>`;
  s += `<rect x="6" y="6" width="508" height="318" rx="12" fill="#f6f6f6" stroke="#999" stroke-width="2"/>`;
  s += `<text x="22" y="34" font-size="18" font-weight="800" fill="#555">host PID namespace (the Linux VM)</text>`;
  const row = (y, pid, name, col = '#333') => `<text x="30" y="${y}" font-size="17" font-family="Menlo,monospace" fill="${col}"><tspan font-weight="700">${pid}</tspan>  ${name}</text>`;
  s += row(66, '    1', 'init');
  s += row(94, '48005', 'containerd-shim');
  s += `<rect x="40" y="112" width="460" height="196" rx="10" fill="#eef4fa" stroke="#336791" stroke-width="2.5"/>`;
  s += `<text x="56" y="140" font-size="18" font-weight="800" fill="#245077">container PID namespace</text>`;
  s += `<rect x="60" y="160" width="420" height="44" rx="8" fill="#fff3c4" stroke="#e08a1e" stroke-width="2"/>`;
  s += `<text x="76" y="189" font-size="18" font-family="Menlo,monospace" fill="#333"><tspan font-weight="800" fill="#b85a2b">48028</tspan> outside  =  <tspan font-weight="800" fill="#245077">1</tspan> inside</text>`;
  s += `<text x="76" y="236" font-size="16" fill="#333">one process, two numbers: the kernel</text>`;
  s += `<text x="76" y="258" font-size="16" fill="#333">keeps a PID for every namespace level</text>`;
  s += `<text x="76" y="288" font-size="16" fill="#666">inside sees only itself + its children</text>`;
  return s + `</svg>`;
};

/* ── Hình 5: ánh xạ uid của user namespace ── */
const uidMap = () => `<svg viewBox="0 0 520 250" width="520" height="250" font-family="Arial"><defs>${AR('ru', '#8e44ad')}</defs>
  <rect x="6" y="20" width="220" height="150" rx="12" fill="#f3eaf8" stroke="#8e44ad" stroke-width="2.5"/>
  <text x="116" y="50" text-anchor="middle" font-size="18" font-weight="800" fill="#6c3483">inside the user ns</text>
  <text x="116" y="102" text-anchor="middle" font-size="34" font-weight="800" fill="#333">uid 0</text>
  <text x="116" y="138" text-anchor="middle" font-size="17" fill="#555">“root” — may mount,</text>
  <text x="116" y="160" text-anchor="middle" font-size="17" fill="#555">set hostname in its ns</text>
  <rect x="294" y="20" width="220" height="150" rx="12" fill="#f6f6f6" stroke="#999" stroke-width="2.5"/>
  <text x="404" y="50" text-anchor="middle" font-size="18" font-weight="800" fill="#555">real kernel view</text>
  <text x="404" y="102" text-anchor="middle" font-size="34" font-weight="800" fill="#333">uid 65534</text>
  <text x="404" y="138" text-anchor="middle" font-size="17" fill="#555">nobody — owns the files,</text>
  <text x="404" y="160" text-anchor="middle" font-size="17" fill="#555">no power over the host</text>
  <line x1="230" y1="95" x2="288" y2="95" stroke="#8e44ad" stroke-width="3" marker-end="url(#ru)"/>
  <text x="260" y="214" text-anchor="middle" font-size="18" font-family="Menlo,monospace" fill="#333">uid_map:  0   65534   1</text>
  <text x="260" y="240" text-anchor="middle" font-size="15" fill="#666">inside-id · outside-id · how many ids</text>
</svg>`;

/* ── Hình 6: cây cgroup ── */
const cgTree = () => {
  let s = `<svg viewBox="0 0 520 330" width="520" height="330" font-family="Arial">`;
  s += `<rect x="150" y="8" width="220" height="44" rx="8" fill="#b85a2b"/><text x="260" y="37" text-anchor="middle" font-size="17" font-weight="700" fill="#fff" font-family="Menlo,monospace">/sys/fs/cgroup</text>`;
  const kids = [
    [10, 'init/', ['all other', 'processes'], '#888888'],
    [140, 'bomb/', ['pids.max', '= 20'], '#c0392b'],
    [270, 'mem/', ['memory.max', '= 50M'], '#336791'],
    [400, 'slow/', ['cpu.max =', '20000 100000'], '#2f7d4f'],
  ];
  kids.forEach(([x, n, f, m], i) => {
    s += `<line x1="260" y1="52" x2="${x + 55}" y2="100" stroke="#b85a2b" stroke-width="2"/>`;
    s += `<rect x="${x}" y="100" width="110" height="40" rx="8" fill="${m}18" stroke="${m}" stroke-width="2.5"/>`;
    s += `<text x="${x + 55}" y="126" text-anchor="middle" font-size="17" font-weight="700" fill="${m}" font-family="Menlo,monospace">${n}</text>`;
    f.forEach((ln, k) => { s += `<text x="${x + 55}" y="${164 + k * 20}" text-anchor="middle" font-size="15" fill="#444" font-family="Menlo,monospace">${ln}</text>`; });
  });
  s += `<rect x="10" y="214" width="500" height="106" rx="10" fill="#fff7ef" stroke="#e3c9ae" stroke-width="2"/>`;
  s += `<text x="26" y="242" font-size="16" fill="#333"><tspan font-weight="800" fill="#9a4a12">a cgroup = a directory.</tspan> Its files are the knobs:</text>`;
  s += `<text x="26" y="270" font-size="15" fill="#333" font-family="Menlo,monospace">*.max      limit you write</text>`;
  s += `<text x="26" y="292" font-size="15" fill="#333" font-family="Menlo,monospace">*.current  usage right now</text>`;
  s += `<text x="26" y="314" font-size="15" fill="#333" font-family="Menlo,monospace">*.events   how often the limit bit</text>`;
  return s + `</svg>`;
};

/* ── Hình 7: dòng thời gian cpu.max ── */
const cpuTimeline = () => {
  const x0 = 30, W = 1050, per = W / 3;
  let s = `<svg viewBox="0 0 1110 175" width="1110" height="175" font-family="Arial">`;
  for (let i = 0; i < 3; i++) {
    const x = x0 + i * per, run = per * 0.2;
    s += `<rect x="${x}" y="40" width="${run}" height="50" fill="#2f7d4f"/>`;
    s += `<rect x="${x + run}" y="40" width="${per - run}" height="50" fill="#e9e9e9" stroke="#ccc"/>`;
    s += `<text x="${x + run / 2}" y="71" text-anchor="middle" font-size="17" font-weight="700" fill="#fff">20 ms</text>`;
    s += `<text x="${x + run + (per - run) / 2}" y="71" text-anchor="middle" font-size="17" fill="#777">throttled — waits for next period</text>`;
    s += `<line x1="${x}" y1="30" x2="${x}" y2="100" stroke="#b85a2b" stroke-width="2"/>`;
    s += `<text x="${x + 4}" y="122" font-size="15" fill="#b85a2b">${i * 100} ms</text>`;
  }
  s += `<line x1="${x0 + W}" y1="30" x2="${x0 + W}" y2="100" stroke="#b85a2b" stroke-width="2"/><text x="${x0 + W - 4}" y="122" text-anchor="end" font-size="15" fill="#b85a2b">300 ms</text>`;
  s += `<text x="555" y="22" text-anchor="middle" font-size="18" font-weight="700" fill="#333">cpu.max = "20000 100000"  →  at most 20 000 µs of CPU in every 100 000 µs period</text>`;
  s += `<text x="555" y="160" text-anchor="middle" font-size="17" fill="#555">docker --cpus 0.5 writes "50000 100000" · --cpus 2 writes "200000 100000" (two CPUs' worth per period)</text>`;
  return s + `</svg>`;
};

/* ── Hình 8: các lớp overlayfs ── */
const overlay = () => {
  const L = (y, h, t, sub, f, st, files) => {
    let r = `<rect x="10" y="${y}" width="500" height="${h}" rx="8" fill="${f}" stroke="${st}" stroke-width="2.5"/>`;
    r += `<text x="24" y="${y + 26}" font-size="17" font-weight="800" fill="${st}">${t}</text><text x="24" y="${y + 48}" font-size="14" fill="#666">${sub}</text>`;
    files.forEach(([n, col, x], i) => { r += `<text x="${x}" y="${y + 37}" font-size="15" font-family="Menlo,monospace" fill="${col}">${n}</text>`; });
    return r;
  };
  let s = `<svg viewBox="0 0 520 340" width="520" height="340" font-family="Arial">`;
  s += L(6, 62, 'merged  (what “/” shows)', 'one combined view', '#fff3c4', '#b85a2b', [['app.conf  new.txt', '#333', 290]]);
  s += L(80, 62, 'upperdir  (writable)', 'per container, thrown away', '#f1f9f4', '#2f7d4f', [['new.txt  app.conf', '#1f6b40', 290], ['', '#333', 0]]);
  s += `<text x="290" y="135" font-size="14" font-family="Menlo,monospace" fill="#c0392b">os-release = c 0,0</text>`;
  s += L(154, 62, 'lowerdir 1  (image layer)', 'read-only, shared', '#eef4fa', '#336791', [['app.conf', '#245077', 290]]);
  s += `<text x="290" y="209" font-size="14" fill="#245077" font-family="Menlo,monospace">"from layer 2"</text>`;
  s += L(228, 62, 'lowerdir 2  (image layer)', 'read-only, shared', '#eef4fa', '#336791', [['app.conf  os-release', '#245077', 290]]);
  s += `<text x="10" y="320" font-size="16" fill="#333"><tspan font-weight="800">Read:</tspan> top-most copy wins.  <tspan font-weight="800">Write:</tspan> copy-up into upperdir.</text>`;
  s += `<text x="10" y="338" font-size="16" fill="#333"><tspan font-weight="800">Delete:</tspan> a “whiteout” (char device 0,0) hides the lower file.</text>`;
  return s + `</svg>`;
};

/* ── Hình 9: luồng container tí hon ── */
const tinyFlow = () => {
  const it = [
    ['mkdir cgroup', 'write limits', '#b85a2b'], ['unshare', '6 new namespaces', '#336791'],
    ['chroot', 'rootfs = “/”', '#2f7d4f'], ['sh = PID 1', 'mount /proc, hostname', '#8e44ad'], ['exec cmd', 'your program', '#e08a1e'],
  ];
  const w = 1110, gap = 30, bw = (w - gap * 4) / 5;
  let s = `<svg viewBox="0 0 ${w} 110" width="${w}" height="110" font-family="Arial"><defs>${AR('rt', '#b85a2b')}</defs>`;
  it.forEach(([a, b, m], i) => {
    const x = i * (bw + gap);
    s += `<rect x="${x + 2}" y="10" width="${bw - 4}" height="88" rx="12" fill="${m}14" stroke="${m}" stroke-width="2.5"/>`;
    s += `<text x="${x + bw / 2}" y="48" text-anchor="middle" font-size="20" font-weight="800" fill="${m}">${a}</text>`;
    s += `<text x="${x + bw / 2}" y="76" text-anchor="middle" font-size="15" fill="#555">${b}</text>`;
    if (i < 4) s += `<line x1="${x + bw}" y1="54" x2="${x + bw + gap - 3}" y2="54" stroke="#b85a2b" stroke-width="3" marker-end="url(#rt)"/>`;
  });
  return s + `</svg>`;
};

/* ── Hình 10: sự cố thật — RAM 6 GB khi build song song ── */
const ramBar = () => {
  const seg = (x, w, t, f, col = '#fff') => `<rect x="${x}" y="0" width="${w}" height="54" fill="${f}" stroke="#fff" stroke-width="2"/><text x="${x + w / 2}" y="33" text-anchor="middle" font-size="16" font-weight="700" fill="${col}">${t}</text>`;
  const row = (y, label, segs, over) => {
    let r = `<g transform="translate(0,${y})"><text x="0" y="-10" font-size="18" font-weight="800" fill="#333">${label}</text><g transform="translate(0,0)">`;
    r += segs.join('');
    r += `</g>`;
    if (over) r += `<text x="1104" y="33" text-anchor="end" font-size="18" font-weight="800" fill="#c0392b">${over}</text>`;
    return r + `</g>`;
  };
  let s = `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Arial">`;
  s += `<line x1="760" y1="20" x2="760" y2="240" stroke="#c0392b" stroke-width="3" stroke-dasharray="7 5"/><text x="766" y="236" font-size="15" font-weight="700" fill="#c0392b">6 GB RAM of the VPS</text>`;
  s += row(40, 'Parallel build (before)', [seg(0, 300, 'live stack: postgres · backend · …', '#336791'), seg(300, 210, 'backend build', '#e08a1e'), seg(510, 340, 'next build (frontend)', '#b85a2b')], '→ OOM-killer → exit 137');
  s += row(150, 'Sequential build (after)', [seg(0, 300, 'live stack: postgres · backend · …', '#336791'), seg(300, 340, 'one build at a time', '#2f7d4f')], '');
  s += `<text x="0" y="246" font-size="14" fill="#888">illustration — bar lengths not measured</text>`;
  return s + `</svg>`;
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'academy/osg202', bieuTuong: '🐧', khau: 'from zero to real backend work',
  chuong: '⭐ Advanced 6 — Containers = namespaces + cgroups', bai: 'CS.6',
}, [
  { cover: true, t: 'Containers =<br>namespaces + cgroups', sub: 'What <code>docker run</code> really asks the Linux kernel to do —<br>measured on a real kernel (7.0, cgroup v2)' },

  { t: 'Learning goals', to: true, giua: true, body: `
<ul>
<li>Explain why a container is <b>not a virtual machine</b> — and prove it with one command</li>
<li>Create the 6 main <b>namespaces</b> by hand: <code class="i">unshare</code>, look inside with <code class="i">nsenter</code> and <code class="i">lsns</code></li>
<li>Set <b>cgroup v2</b> limits by writing files: stop a fork bomb, trigger an OOM kill (<b>exit 137</b>), throttle a CPU hog</li>
<li>Read what <code class="i">docker run --memory --cpus --pids-limit</code> writes into <code class="i">/sys/fs/cgroup</code></li>
<li>Understand image <b>layers (overlayfs)</b>, <b>capabilities</b>, <b>seccomp</b>, <b>rootless</b></li>
<li>Build a working <b>tiny container in ~30 lines of bash</b></li>
</ul>` },

  { t: 'Everyday picture: houses vs flats in one building', giua: true, body: `${apartment()}
${box('', 'A container is a <b>flat</b>, not a house: it <b>looks</b> private (own door number, own mailbox) and is <b>metered</b> (own breaker), but every flat stands on the <b>same foundation</b> — the host’s Linux kernel.', 'lam')}` },

  { t: 'A container is not a VM: they share one kernel', giua: true, body: two(`${stacks()}`,
    `${term(`$ uname -sr               # on the Mac itself
Darwin 27.0.0
$ docker run --rm debian:12 uname -r
7.0.12-linuxkit
$ docker run --rm alpine uname -r
7.0.12-linuxkit`)}
<ul style="font-size:20px">
<li>Debian and Alpine report the <b>same kernel</b> — they only bring different files (libs, shell, package manager)</li>
<li>macOS has no Linux kernel ⇒ <b>Docker Desktop runs one Linux VM</b> and all containers share <b>its</b> kernel</li>
</ul>`, 'r46') + `<p class="nho">Measured on: Docker Desktop 29.8.0 · Linux 7.0.12-linuxkit · cgroup v2 · overlayfs snapshotter</p>` },

  { t: 'Proof: a container is just a process on the host', giua: true, body: two(
    `${term(`$ docker run -d --name osg-cs6-web osg-cs6-tools sleep 1000
$ docker exec osg-cs6-web ps -eo pid,ppid,comm
    PID    PPID COMMAND
      1       0 sleep
      6       0 ps
$ docker inspect -f '{{.State.Pid}}' osg-cs6-web
48028
$ docker run --rm --pid=host osg-cs6-tools \\
    ps -eo pid,ppid,comm,args | grep -E 'PID|sleep 1000'
  PID  PPID COMMAND         COMMAND
48028 48005 sleep           sleep 1000
$ … ps -o pid,comm,args -p 48005      # its parent
48005 containerd-shim /usr/bin/containerd-shim-runc-v2 …`, { hl: [4, 7, 11, 13] })}`,
    `${pidNest()}`, 'r64') +
    box('', 'No guest OS boots. <code class="i">docker run</code> asks the kernel to start <b>one normal process</b> with a different <b>view</b> (namespaces) and <b>budget</b> (cgroups). Its parent on the host is <code class="i">containerd-shim</code>.', 'xanh') },

  { t: 'The recipe: four kernel features around one process', giua: true, body: `${recipe()}
<p style="font-size:21px">${kw('container', 'a process + namespaces + cgroups + a root filesystem + reduced privileges')} — there is no “container” object inside the Linux kernel. Docker, Podman, containerd and Kubernetes only <b>combine</b> these features for you.</p>` },

  { t: 'Namespaces: 8 kinds, each hides one thing', body: two(
    `<table class="t" style="font-size:18px">
<tr><th>Namespace</th><th>Isolates</th><th>Linux</th></tr>
<tr><td><b>pid</b></td><td>process IDs — you become PID 1</td><td>3.8</td></tr>
<tr><td><b>mnt</b></td><td>mount points — your own “/”</td><td>3.8</td></tr>
<tr><td><b>net</b></td><td>interfaces, IPs, ports, routes</td><td>3.0</td></tr>
<tr><td><b>uts</b></td><td>hostname</td><td>3.0</td></tr>
<tr><td><b>ipc</b></td><td>System V IPC, POSIX queues</td><td>3.0</td></tr>
<tr><td><b>user</b></td><td>user &amp; group IDs (root inside ≠ root outside)</td><td>3.8</td></tr>
<tr><td><b>cgroup</b></td><td>which cgroup looks like “/”</td><td>4.6</td></tr>
<tr><td><b>time</b></td><td>boot &amp; monotonic clocks</td><td>5.6</td></tr>
</table><p class="nho">Source: man7.org namespaces(7) — versions = when /proc/PID/ns/&lt;type&gt; appeared.</p>`,
    `${term(`$ ls -l /proc/self/ns
cgroup -> cgroup:[4026534057]
ipc -> ipc:[4026534055]
mnt -> mnt:[4026534053]
net -> net:[4026534058]
pid -> pid:[4026534056]
pid_for_children -> pid:[4026534056]
time -> time:[4026534186]
time_for_children -> time:[4026534186]
user -> user:[4026531837]
uts -> uts:[4026534054]`)}
<p style="font-size:19px">Every process points to one namespace of each kind. Same number = same namespace.</p>`, 'r46') },

  { t: 'PID namespace: become PID 1 with one command', giua: true, body: `${term(`$ echo $$          # my PID outside (this lab shell is itself PID 1 of its container)
1
$ unshare --pid --fork --mount-proc bash -c 'echo "inside: my PID is $$"; ps -ef; exit'
inside: my PID is 1
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 16:40 ?        00:00:00 bash -c echo "inside: my PID is $$"; ps -ef; exit
root           2       1  0 16:40 ?        00:00:00 ps -ef`, { hl: [4, 6] })}
${cards([
  ['--pid', 'new PID namespace for the <b>children</b> of unshare'],
  ['--fork', 'fork first, so the child (not unshare itself) becomes <b>PID 1</b>'],
  ['--mount-proc', 'mount a fresh <code class="i">/proc</code> — otherwise <code class="i">ps</code> reads the old /proc and still shows everything'],
])}
${box('PID 1 is special (recall CS.1)', 'If PID 1 dies, the kernel kills <b>every</b> process in the namespace. PID 1 also ignores signals it has no handler for — that is why <code class="i">docker stop</code> sometimes waits 10 s and then sends SIGKILL.', 'do2')}` },

  { t: 'UTS, network, IPC and mount namespaces — all real', giua: true, body: `<div class="hai" style="zoom:.88">
<div style="display:flex;flex-direction:column;gap:12px">${term(`$ unshare --uts bash -c 'hostname box-42; echo "inside: $(hostname)"'
inside: box-42
$ echo "outside: $(hostname)"
outside: 70ebc2f98610`)}${term(`$ unshare --mount bash -c 'mount -t tmpfs none /mnt
    touch /mnt/secret; echo "inside: $(ls /mnt)"'
inside: secret
$ echo "outside: [$(ls /mnt)]"
outside: []`)}</div>
<div style="display:flex;flex-direction:column;gap:12px">${term(`$ unshare --net ip -br link | grep -v @NONE
lo               DOWN           00:00:00:00:00:00 <LOOPBACK>
$ ip -br addr | grep -v @NONE               # outside
lo               UNKNOWN        127.0.0.1/8 ::1/128
eth0@if193       UP             172.17.0.7/16`)}${term(`$ ipcmk -Q; ipcs -q                        # outside
------ Message Queues --------
key        msqid      owner      perms      used-bytes   messages
0x442d408d 0          root       644        0            0
$ unshare --ipc ipcs -q                     # inside: empty
------ Message Queues --------
key        msqid      owner      perms      used-bytes   messages`)}</div></div>
<p style="font-size:20px">A new network namespace starts with only a <b>DOWN loopback</b> — Docker then adds a <b>veth pair</b> (<code class="i">eth0@if193</code>) wired to the <code class="i">docker0</code> bridge. <span class="nho"><code>grep -v @NONE</code> hides this kernel’s idle tunnel stubs.</span></p>` },

  { t: 'lsns and nsenter: see a box from outside, step into it', body: `${term(`$ unshare --pid --uts --mount --fork --mount-proc bash -c 'hostname box-7; exec sleep 300' &
$ pgrep -x sleep                  # the box's PID 1, seen from outside
37
$ lsns -p 37 -o NS,TYPE,NPROCS,PID,COMMAND
        NS TYPE   NPROCS PID COMMAND
4026531837 user        4   1 bash /w/02-namespaces.sh
4026533649 net         4   1 bash /w/02-namespaces.sh
4026534053 mnt         2  36 |-unshare --pid --uts --mount --fork --mount-proc bash -c hostname box-7; exec…
4026534055 uts         2  36 \`-unshare --pid --uts --mount --fork --mount-proc bash -c hostname box-7; exec…
4026534056 pid         1  37   \`-sleep 300
$ nsenter -t 37 -p -u -m bash -c 'hostname; ps -ef'
box-7
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 16:40 ?        00:00:00 sleep 300`, { hl: [8, 9, 10, 12] })}
<p class="nho" style="margin:0">lsns rows for ipc / cgroup / time (shared, like user and net) omitted.</p>
${two(`<ul style="font-size:20px">
<li><code class="i">lsns</code>: user/net are shared with the lab shell; mnt, uts, pid are <b>new</b></li>
<li><code class="i">nsenter -t PID -p -u -m</code> joins that process’s namespaces (syscall <code class="i">setns</code>)</li>
</ul>`, box('So what is docker exec?', '<code class="i">docker exec</code> = start a new process and <b>setns()</b> it into the container’s namespaces + cgroup. No SSH needed inside.', 'xanh'))}` },

  { t: 'User namespace: root inside, nobody outside', giua: true, body: two(
    `${term(`$ su -s /bin/bash nobody -c '
    id
    unshare --user --map-root-user bash -c "
      id; cat /proc/self/uid_map
      touch /tmp/made-by-root-in-ns"'
uid=65534(nobody) gid=65534(nogroup) groups=65534(nogroup)
uid=0(root) gid=0(root) groups=0(root)
         0      65534          1
$ ls -l /tmp/made-by-root-in-ns
-rw-r--r-- 1 nobody nogroup 0 Oct 25 16:40 /tmp/made-by-root-in-ns`, { hl: [7, 10] })}
${zm(uidMap(), 0.82)}`,
    `<ul style="font-size:19px">
<li>An <b>unprivileged</b> user created a user namespace and became <b>uid 0</b> inside</li>
<li>The file it created belongs to <b>nobody</b> on the real system</li>
</ul>
${box('Rootless containers', '<b>Rootless Docker / Podman</b> run the whole engine as a normal user inside a user namespace. A container escape then lands as <b>your normal user</b>, not as host root. Costs: binding ports &lt; 1024 needs extra setup, slower user-space networking, some storage drivers unavailable.', 'lam')}`, 'r64') },

  { t: 'cgroup v2: the meter and the breaker', giua: true, body: two(`${cgTree()}`,
    `${term(`$ cat /proc/self/cgroup
0::/init
$ cat /sys/fs/cgroup/cgroup.controllers
cpuset cpu io memory hugetlb pids rdma
$ echo "+cpu +memory +pids" > cgroup.subtree_control
$ mkdir demo; ls demo | grep -E '^(memory|pids|cpu)\\.'
cpu.max cpu.stat memory.current memory.events
memory.max memory.stat pids.current pids.events
pids.max`)}
<ul style="font-size:19px">
<li>${kw('cgroup', 'control group')} — a group of processes with a resource budget</li>
<li>v2 = <b>one tree</b>, file system at <code class="i">/sys/fs/cgroup</code></li>
<li>Rule: a cgroup with controllers on for children holds <b>no processes itself</b> ⇒ we first moved everyone into <code class="i">init/</code></li>
</ul>`, 'r46') },

  { t: 'pids.max: a fork bomb hits a wall', giua: true, body: two(
    `${term(`$ mkdir bomb; echo 20 > bomb/pids.max
$ ./forkcount          # fork() until the kernel says no
fork #20 failed: Resource temporarily unavailable (errno 11 = EAGAIN)

$ # the classic bash fork bomb  :(){ :|:& };:  — 5 seconds
pids.current = 20   pids.max = 20
pids.events  = max 64
     63 environment: fork: retry: Resource temporarily unavailable
$ echo 1 > bomb/cgroup.kill; cat bomb/pids.current
0`, { hl: [3, 6, 7] })}`,
    `<ul style="font-size:20px">
<li>${kw('fork bomb', 'a function that calls itself twice, in the background, forever')}</li>
<li>Without a limit it fills the <b>whole machine’s</b> process table — SSH can’t even start a shell</li>
<li>With <code class="i">pids.max</code>: <code class="i">fork()</code> fails with <b>EAGAIN</b>; only this cgroup suffers</li>
<li><code class="i">cgroup.kill</code> (Linux 5.14+) kills every process in the group at once</li>
</ul>`, 'r64') + box('', '<code class="i">forkcount.c</code> = 19 children + itself = 20 tasks ⇒ fork #20 is refused. <code class="i">docker run --pids-limit</code> does exactly this.', 'xanh') },

  { t: 'memory.max: OOM kill inside the cgroup → exit 137', giua: true, body: two(
    `${term(`$ echo 50M > mem/memory.max; echo 0 > mem/memory.swap.max
$ ./eat                 # malloc 10 MiB + memset, repeat
allocated 20 MiB
allocated 30 MiB
allocated 40 MiB
exit code = 137   (128 + 9 = SIGKILL)
$ cat mem/memory.events
max 41
oom 1
oom_kill 1
$ dmesg | grep -i 'memory cgroup out of memory'
Memory cgroup out of memory: Killed process 51070 (eat)
  total-vm:53424kB, anon-rss:51044kB …`, { hl: [6, 10, 12], sm: false })}`,
    `<ul style="font-size:20px">
<li><code class="i">eat.c</code> touches every page, so the memory is <b>really</b> used (RSS), not just reserved</li>
<li>Over <code class="i">memory.max</code> the kernel first reclaims cache, then runs the <b>OOM killer only inside this cgroup</b></li>
<li>Killed by <b>SIGKILL (9)</b> ⇒ the shell reports <b>128 + 9 = 137</b> (CS.1)</li>
<li><code class="i">memory.events</code> keeps the evidence even after the process is gone</li>
</ul>`, 'r64') },

  { t: 'cpu.max: a quota per period, not a “slower CPU”', giua: true, body: `${cpuTimeline()}
${two(term(`$ echo "20000 100000" > slow/cpu.max; cat fast/cpu.max
max 100000
$ # busy loop for 3 s wall-clock in each group, then cpu.stat
fast  usage_usec=3001204  (= 3.00 s of CPU in 3 s)  nr_throttled=0
slow  usage_usec=621587   (= 0.62 s of CPU in 3 s)  nr_throttled=31`, { hl: [4, 5] }),
    `<ul style="font-size:19px">
<li>CPU limit = <b>throttling</b>: the process runs at full speed, then is <b>paused</b> until the next period</li>
<li>Latency symptom: a request that needs 30 ms of CPU may take <b>&gt;100 ms</b> wall-clock</li>
<li>Watch <code class="i">nr_throttled</code> in <code class="i">cpu.stat</code></li>
</ul>`, 'r64')}` },

  { t: 'What docker run writes into /sys/fs/cgroup', giua: true, body: two(
    `${term(`$ docker run --rm debian:12 cat … (no limits)
memory.max       max
memory.swap.max  max
cpu.max          max 100000
pids.max         max
$ docker run --rm --memory 64m --cpus 0.5 \\
      --pids-limit 50 debian:12 cat …
memory.max       67108864
memory.swap.max  67108864
cpu.max          50000 100000
pids.max         50`, { hl: [8, 9, 10, 11] })}`,
    `${tbl(['docker flag', 'cgroup v2 file'], [
      ['--memory 64m', 'memory.max = 67108864'],
      ['(--memory-swap unset)', 'memory.swap.max = same 64m'],
      ['--cpus 0.5', 'cpu.max = 50000 100000'],
      ['--pids-limit 50', 'pids.max = 50'],
      ['--cpuset-cpus 0,1', 'cpuset.cpus = 0-1'],
    ])}
${term(`$ # host view (--cgroupns=host --pid=host)
/sys/fs/cgroup/docker/<ID>
memory.max     67108864
cpu.max        50000 100000
pids.max       50
cgroup.procs   53667`)}`, 'r46') + `<p style="font-size:19px">Inside, the container sees its own cgroup as <code class="i">/</code> (cgroup namespace). On a systemd host the path is <code class="i">/sys/fs/cgroup/system.slice/docker-&lt;ID&gt;.scope</code>.</p>` },

  { t: 'docker --memory: exit 137 and the swap surprise', giua: true, body: two(
    `${term(`$ docker run --name osg-cs6-oom --memory 64m … ./eat
Killed
allocated 110 MiB
allocated 120 MiB
$ docker inspect -f '{{.State.OOMKilled}} {{.State.ExitCode}}' osg-cs6-oom
true 137

$ docker run --rm --memory 64m --memory-swap 64m … ./eat
Killed
allocated 50 MiB
allocated 60 MiB`, { hl: [4, 6, 11] })}`,
    `<ul style="font-size:20px">
<li>With only <code class="i">--memory 64m</code> the program reached <b>120 MiB</b>: Docker also allowed <b>64 MiB of swap</b> (memory.swap.max)</li>
<li><code class="i">--memory-swap</code> = RAM + swap total ⇒ set it <b>equal</b> to <code class="i">--memory</code> for “no swap”</li>
<li>Diagnose: <code class="i">docker inspect … OOMKilled</code>, <code class="i">memory.events</code>, <code class="i">dmesg</code></li>
</ul>
${box('', 'Swapping in a container keeps it alive but can make it <b>many times slower</b> — often worse than a clean restart.', 'do2')}`, 'r64') },

  { t: 'Image layers = overlayfs: read-only + writable', giua: true, body: two(`${overlay()}`,
    `${term(`$ mount -t overlay overlay \\
   -o lowerdir=img2:img1,upperdir=up,workdir=work merged
$ cat merged/app.conf            # top layer wins
from layer 2
$ echo hi > merged/new.txt; rm merged/os-release
$ ls -l up
-rw-r--r-- 1 root root    3 new.txt
c--------- 2 root root 0, 0 os-release
$ echo changed >> merged/app.conf; cat up/app.conf
from layer 2
changed
$ cat img2/app.conf              # lower: untouched
from layer 2`, { hl: [8, 11, 13] })}
<p style="font-size:18px">A real container root: <code class="i">osg-cs6-tools</code> has <b>2</b> image layers → <b>3</b> lowerdirs (+1 small init layer: hosts, resolv.conf). 10 containers from one image share the same read-only layers on disk.</p>`, 'r46') },

  { t: 'Capabilities: root in a container is not full root', giua: true, body: two(
    `${term(`$ docker run --rm debian:12 grep -E '^(CapEff|Seccomp)' /proc/self/status
CapEff: 00000000a80425fb
Seccomp:        2
$ capsh --decode=00000000a80425fb
cap_chown cap_dac_override cap_fowner cap_fsetid cap_kill
cap_setgid cap_setuid cap_setpcap cap_net_bind_service
cap_net_raw cap_sys_chroot cap_mknod cap_audit_write cap_setfcap
$ docker run --rm --privileged debian:12 grep … /proc/self/status
CapEff: 000001ffffffffff
Seccomp:        0
$ docker run --rm debian:12 hostname test
hostname: you must be root to change the host name
$ docker run --rm --cap-drop NET_RAW osg-cs6-tools ping -c1 127.0.0.1
exec /usr/bin/ping: operation not permitted`, { hl: [2, 9, 12, 14] })}`,
    `<ul style="font-size:19px">
<li>Linux splits root’s power into ~41 <b>capabilities</b>; a default container keeps <b>14</b></li>
<li>Missing: <code class="i">SYS_ADMIN</code> (mount, hostname…), <code class="i">SYS_PTRACE</code>, <code class="i">NET_ADMIN</code>, <code class="i">SYS_MODULE</code>…</li>
<li>The error says “must be root” even though we <b>are</b> uid 0 — the real reason is the missing capability</li>
<li><code class="i">--privileged</code> = all caps + <b>no seccomp</b> ⇒ only for labs</li>
</ul>`, 'r64') },

  { t: 'seccomp, and when strace really needs SYS_PTRACE', giua: true, body: two(
    `${term(`$ docker run --rm osg-cs6-tools unshare --user --map-root-user id
unshare: unshare failed: Operation not permitted
$ docker run --rm --security-opt seccomp=unconfined … (same)
uid=0(root) gid=0(root) groups=0(root)

$ # root attaches to a ROOT process: works by default
strace: Process 7 attached
$ # root attaches to a process of user nobody (USER node in a Dockerfile)
nobody         9 sleep
strace: attach: ptrace(PTRACE_SEIZE, 9): Operation not permitted
$ docker run --rm --cap-add SYS_PTRACE … (same)
strace: Process 9 attached`, { hl: [2, 10, 12] })}`,
    `<ul style="font-size:18px">
<li>${kw('seccomp', 'a syscall filter')} — Docker’s default profile <b>allows</b> a list and blocks ~44 syscalls (mount, reboot, kexec, …); <code class="i">Seccomp: 2</code> = filter on</li>
<li>Here it alone blocked <code class="i">unshare(CLONE_NEWUSER)</code></li>
<li>strace = <code class="i">ptrace()</code>. Since kernel 4.8 seccomp allows it; attaching to a process with <b>other credentials</b> still needs <code class="i">CAP_SYS_PTRACE</code></li>
<li>On Ubuntu hosts <b>Yama</b> <code class="i">ptrace_scope=1</code> also blocks attaching to a non-child (e.g. <code class="i">docker exec … strace -p 1</code>) without that cap. This kernel has no Yama.</li>
</ul>`, 'r64') },

  { t: 'Tiny container (1/2): the root filesystem', giua: true, body: two(
    `${bash(`set -euo pipefail
ROOT=$(realpath "\${1:?rootfs dir}"); shift

# 1) root filesystem: one static busybox = a whole userland
if [ ! -x "$ROOT/bin/busybox" ]; then
  mkdir -p "$ROOT"/{bin,dev,proc,sys,tmp,etc}
  cp /bin/busybox "$ROOT/bin/"
  for a in sh ps ls cat hostname id mount sleep ip seq; do
    ln -sf busybox "$ROOT/bin/$a"; done
  echo "root:x:0:0::/:/bin/sh" > "$ROOT/etc/passwd"
  mknod -m 666 "$ROOT/dev/null" c 1 3
fi`)}`,
    `<ul style="font-size:20px">
<li>A container image is, in the end, <b>just a directory tree</b></li>
<li><code class="i">busybox</code> = one static binary that acts as <code class="i">sh</code>, <code class="i">ps</code>, <code class="i">ls</code>… depending on its name</li>
<li>Static ⇒ needs no <code class="i">/lib</code> inside the rootfs</li>
<li><code class="i">/dev/null</code> made by hand with <code class="i">mknod</code> (char device 1,3)</li>
</ul>
<p class="nho">File: cs-nguon/cs6/tiny-container.sh (34 lines incl. comments)</p>`, 'r64') },

  { t: 'Tiny container (2/2): limits + namespaces', body: `${tinyFlow()}
<div style="zoom:.92">${two(bash(`# 2) limits: 32 MB RAM, no swap, 20 tasks, half a CPU
C=/sys/fs/cgroup; CG=$C/tiny-$$
echo "+memory +pids +cpu" > $C/cgroup.subtree_control || :
mkdir $CG
echo 32M > $CG/memory.max;  echo 0 > $CG/memory.swap.max
echo 20  > $CG/pids.max;    echo "50000 100000" > $CG/cpu.max
echo $$  > $CG/cgroup.procs        # me + all my children`),
    bash(`# 3) new PID, mount, UTS, IPC, net, cgroup namespaces
set +e
unshare --pid --mount --uts --ipc --net --cgroup --fork \\
  chroot "$ROOT" /bin/sh -c \\
  'mount -t proc proc /proc; hostname tiny; exec "$@"' sh "$@"
rc=$?
# 4) clean up: leave the cgroup, delete it
echo $$ > $C/init/cgroup.procs || echo $$ > $C/cgroup.procs
rmdir $CG; exit $rc`), 'r46')}</div>` },

  { t: 'The tiny container runs — every line is real output', giua: true, body: `<div class="hai">
<div>${term(`$ ./tiny rootfs sh -c 'hostname; id; ls /'
tiny
uid=0(root) gid=0 groups=0
bin  dev  etc  proc  sys  tmp
$ ./tiny rootfs sh -c 'sleep 5 & sleep 0.3; ps -o pid,ppid,comm; kill $!'
PID   PPID  COMMAND
    1     0 sh
    4     1 sleep
    6     1 ps
$ ./tiny rootfs ip -o link        # stubs hidden
1: lo: <LOOPBACK> mtu 65536 qdisc noop qlen 1000 …`, { hl: [2, 7] })}</div>
<div>${term(`$ ./tiny rootfs sh -c 'cat /proc/self/cgroup
      mount -t cgroup2 none /sys
      cat /sys/memory.max /sys/pids.max /sys/cpu.max'
0::/
33554432
20
50000 100000
$ ./tiny rootfs sh -c 'for i in $(seq 30); do
      sleep 2 & echo $i > /tmp/n; done; wait'
sh: can't fork: Resource temporarily unavailable
$ ./tiny rootfs cat /tmp/n         # sleeps started
17
$ ./tiny rootfs sh -c 'eat; echo eat exit=$?' | tail -3
allocated 30 MiB
Killed
eat exit=137`, { hl: [10, 12, 16] })}</div></div>
<p style="font-size:19px">Own hostname, PID 1, empty network, own cgroup root with the limits — that is a container. 17 sleeps + sh + unshare + the script = <b>20 = pids.max</b>. Docker adds: image layers, a veth network, caps/seccomp, logs, a nice CLI. <span class="nho">(ls output joined on one line.)</span></p>` },

  { t: 'Traps', giua: true, body: vsd(`<ul style="font-size:19px">
<li>“A container is a lightweight VM, so it is a security boundary like a VM.”</li>
<li>“Permission denied? Add <code class="i">--privileged</code>.”</li>
<li>“<code class="i">free -m</code> / <code class="i">os.totalmem()</code> inside the container shows my limit.”</li>
<li>“<code class="i">--memory 512m</code> means the app can never use more than 512 MB.”</li>
<li>“<code class="i">--cpus 1</code> makes my code run on a slower CPU.”</li>
</ul>`, `<ul style="font-size:19px">
<li>All containers share <b>one kernel</b>: a kernel bug or <code class="i">--privileged</code> can reach the host. Use rootless, drop caps, keep seccomp</li>
<li>Add only the capability you need: <code class="i">--cap-add SYS_PTRACE</code>, <code class="i">NET_ADMIN</code>…</li>
<li><code class="i">/proc/meminfo</code> is the host’s. Read <code class="i">/sys/fs/cgroup/memory.max</code>; JVM/Node must be configured for it (CS.5)</li>
<li>Plus the same amount of <b>swap</b> unless <code class="i">--memory-swap</code> is set</li>
<li>Full speed, then <b>throttled</b> each period — watch <code class="i">nr_throttled</code></li>
</ul>`) },

  { t: '🧭 On the real server: cuongthai.com deploy, exit 137', body: `${ramBar()}
${two(`<ul style="font-size:19px">
<li><b>2026-07-06</b>: VPS with <b>6 GB</b> RAM, live stack running. Backend + frontend images built <b>in parallel</b> with a cold cache ⇒ <code class="i">next build</code> killed, <b>exit 137</b></li>
<li><b>2026-07-07</b>: <code class="i">docker compose up --build</code> started both builds again in parallel ⇒ same OOM kill</li>
</ul>`, `<ul style="font-size:19px">
<li>Fix in <code class="i">deploy.sh</code>: build images <b>one at a time</b>, never <code class="i">up --build</code></li>
<li>Later: build on a 31 GB home machine, the VPS only pulls (<code class="i">deploy-nha.sh</code>)</li>
<li>Read 137 as: <b>SIGKILL — check memory first</b> (<code class="i">dmesg</code>, <code class="i">OOMKilled</code>, <code class="i">memory.events</code>)</li>
</ul>`)}` },

  { t: '🎤 Interview questions', giua: true, body: `
<table class="t" style="font-size:18px">
<tr><th style="width:42%">Question</th><th>Short model answer</th></tr>
<tr><td>Container vs virtual machine?</td><td>VM: own kernel on a hypervisor. Container: a host process isolated by namespaces and limited by cgroups — one shared kernel, starts in ms</td></tr>
<tr><td>Namespaces vs cgroups?</td><td>Namespaces limit what a process can <b>see</b>; cgroups limit how much it can <b>use</b></td></tr>
<tr><td>Your pod/container exits with 137. What happened?</td><td>128+9 = SIGKILL, usually the OOM killer: check <code>OOMKilled</code>, <code>memory.events</code>, <code>dmesg</code>; then heap/RSS vs limit</td></tr>
<tr><td>Why is PID 1 in a container special?</td><td>Kernel won’t deliver signals it has no handler for; it must reap zombies; when it exits all others die ⇒ <code>exec</code> form, <code>tini</code>/<code>--init</code></td></tr>
<tr><td>How do image layers save disk?</td><td>overlayfs: shared read-only lowerdirs + one thin writable upperdir per container; copy-up on write, whiteout on delete</td></tr>
<tr><td>Is root in a container dangerous?</td><td>Less than host root (14 caps, seccomp), but still uid 0 on the shared kernel — prefer <code>USER</code> non-root or rootless</td></tr>
</table>` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol style="font-size:24px">
<li><code class="i">docker run alpine uname -r</code> and <code class="i">docker run ubuntu uname -r</code> print the same thing. Why?</li>
<li>You write <code class="i">10</code> into <code class="i">pids.max</code> and run a fork bomb in that cgroup. What does the kernel return to <code class="i">fork()</code>, and what happens to the rest of the machine?</li>
<li>A container started with <code class="i">--memory 64m</code> used 120 MiB before being killed. Explain, and give the flag that fixes it.</li>
</ol>
${box('Answers', '1) Containers share the host’s kernel; images only bring user-space files. 2) <b>EAGAIN</b> (“Resource temporarily unavailable”) once 10 tasks exist; only that cgroup is affected — <code class="i">pids.events</code> counts the hits. 3) Docker also allowed 64 MiB of swap; set <code class="i">--memory-swap 64m</code>.', 'xanh')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Container = <b>process</b> + <b>namespaces</b> (see) + <b>cgroups</b> (use) + <b>rootfs</b> (overlayfs) + <b>caps/seccomp</b> (do)</li>
<li>One shared kernel — Docker Desktop on a Mac runs it inside a Linux VM</li>
<li>cgroup v2 limits are <b>files</b>: <code class="i">memory.max</code> → OOM <b>137</b>, <code class="i">pids.max</code> → <b>EAGAIN</b>, <code class="i">cpu.max</code> → <b>throttled</b></li>
<li><code class="i">docker exec</code> = nsenter; <code class="i">--privileged</code> = no walls</li>
<li>Next: <b>CS.7 — Performance &amp; debugging toolkit</b></li>
</ul>
${box('Practice', 'All programs + real outputs: <b>cs-nguon/cs6</b> · Courses: <b>/courses/docker</b>, <b>/courses/linux-bash</b>', 'lam')}` },
]);
