/**
 * Deploy lên VPS · Deck dv-08 — Chương 8: Sống trên một cái máy nhỏ (bộ nhớ, OOM killer, swap, đĩa).
 *
 * MỌI output terminal MỚI trên slide là output THẬT, chạy 29/09/2026 (hợp đồng mục 7b):
 *   • Docker Desktop trên Mac M1: máy ảo linuxkit 7.0.12, cgroup v2, 8 GB RAM + 1 GB swap. Container thí nghiệm
 *     đều tên dv08-… và nhãn dvhoc=08; node:22-alpine (v22.23.2), node:20-alpine, node:18-alpine, postgres:16,
 *     redis:7, nginx:1.27-alpine.
 *   • "VPS thí nghiệm" dv08-vps = ubuntu:24.04 + systemd 255 thật (--privileged ngắn hạn), --memory 1g, SSH từ Mac
 *     qua 127.0.0.1:19082 bằng khoá tạo trong thư mục nháp. Node v18.19.1 (apt), python3 3.12.
 *   • Hai app Next.js 15 tối giản dựng bằng `next build` thật trong container giới hạn 800 MB / 3 GB.
 *   • Hệ tệp ext4 nhỏ dựng trên thiết bị loop BÊN TRONG dv08-vps để làm đầy khối và cạn inode (không đụng đĩa Mac).
 *   • linux-nha (Fedora 44) chỉ đọc: zram + systemd-oomd.
 * Số liệu production (VPS 6 GB, cache build 7,6 GB, build tuần tự ~15 phút, máy nhà 3–6 phút) lấy từ hồ sơ dự án.
 *
 * Hình tự vẽ (SVG nội tuyến): tinHieu() SIGTERM vs SIGKILL · toNhat() nhân chọn cái to nhất · thang() oom_score_adj ·
 * mauSwap() RAM ghim ở trần, swap lớn dần · dongBuild() tuần tự vs song song · ngânSach qua seg().
 * Tô màu: sh() cho bash; conf() (chép từ dv-03) cho unit systemd; yaml() cho compose; code(…,'json') cho daemon.json.
 */
import { S, cover, sh, yaml, term, mindmap, diagram, cards, box, steps, table, two, bars, seg, code, sv, R, T, A, D, esc } from './_dv-chung.mjs';

export const deck = { key: 'dv-08', code: 'DEPLOY · CHƯƠNG 8', title: 'Máy nhỏ', sub: 'Deploy lên VPS · Chương 8' };

const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15px}.c-t.sm td,.c-t.sm th{padding:6px 10px}' +
  '.d-yml .c .nu{color:#b5cea8}.d-yml .c .sx{color:#c586c0}.d-yml .c .sec{color:#ff7b72;font-weight:700}' +
  '.c-code{margin:0}.c-grid+*{margin-top:12px}.c-seg+*{margin-top:12px}.c-box+.c-box{margin-top:12px}.c-card p{font-size:15px}</style>';

/* ─────────── tô màu cấu hình unit systemd (ini) — chép từ dv-03, cùng khung .d-yml với yaml() ─────────── */
const conf = (lines, { fs = 15, lang = 'ini' } = {}) => {
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
          .replace(/\b(-?\d+(?:s|ms|M|G)?)\b/g, '<span class="nu">$1</span>');
        return `${m[1]}<span class="k">${esc(m[2])}</span>${m[3]}${v}${tail}`;
      }
      return esc(body) + tail;
    }
    return esc(body) + tail;
  };
  return `<div class="d-yml" style="--fs:${fs}px">${lines.map((x) => {
    const [c, a] = Array.isArray(x) ? x : [x, ''];
    return `<div class="c">${hl(c) || ' '}</div><div class="a">${a ? esc(a) : ''}</div>`;
  }).join('')}</div>`;
};

/* ─────────── Slide 3: SIGTERM được mời dừng, SIGKILL bị gỡ ─────────── */
const tinHieu = () => {
  let s = '';
  const hop = (x, y, w, t, d, c) => R(x, y, w, 66, { c, fill: '#0b1220', r: 10 }) + T(x + w / 2, y + 28, t, { fs: 15, a: 'middle', b: true, c }) + T(x + w / 2, y + 50, d, { fs: 13, a: 'middle', c: 'mu' });
  s += T(0, 22, 'SIGTERM (15) — được MỜI dừng', { fs: 16, b: true, c: 'amb' });
  s += hop(0, 36, 140, 'tiến trình', 'đang phục vụ', 'blu') + A(144, 69, 184, 69, { c: 'amb' });
  s += hop(188, 36, 180, 'handler chạy', 'đóng kết nối, xả việc', 'amb') + A(372, 69, 412, 69, { c: 'amb' });
  s += hop(416, 36, 124, 'exit 143', '128 + 15', 'grn');
  s += T(0, 132, 'có log · có dọn dẹp · request đang dở được trả xong (Ch3)', { fs: 13.5, c: 'dim' });
  s += T(0, 182, 'SIGKILL (9) — bị GỠ, không hỏi', { fs: 16, b: true, c: 'red' });
  s += hop(0, 196, 140, 'tiến trình', 'đang cấp phát', 'blu') + A(144, 229, 184, 229, { c: 'red' });
  s += R(188, 196, 180, 66, { c: 'red', fill: 'rgba(255,92,108,.10)', r: 10, dash: true });
  s += T(278, 224, '✕ nhân gỡ NGAY', { fs: 15, a: 'middle', b: true, c: 'red' }) + T(278, 246, 'giữa hai lệnh máy', { fs: 13, a: 'middle', c: 'mu' });
  s += A(372, 229, 412, 229, { c: 'red' }) + hop(416, 196, 124, 'exit 137', '128 + 9', 'red');
  s += T(0, 292, 'không bắt được · không log · không dọn dẹp · request đang dở rơi', { fs: 13.5, c: 'dim' });
  return sv(540, 304, s);
};

/* ─────────── Slide 8: cgroup 256 MB — nhân giết cái TO NHẤT (số đo thật: csdl 140 MB, cgroup 178 MB, build 120 MB) ─────────── */
const toNhat = () => {
  const x0 = 270, k = 2.7; // 1 MB = 2,7 px ⇒ 256 MB = 691 px
  const X = (mb) => x0 + mb * k;
  let s = '';
  s += `<path d="M${X(256)} 20 L${X(256)} 300" stroke="${D.red}" stroke-width="2.5" stroke-dasharray="7 6"/>` + T(X(256) + 8, 36, 'trần 256 MB', { fs: 14, c: 'red', b: true });
  const khoi = (y, a, b, t, { c = 'blu', fill, dash = false, op = 1 } = {}) => R(X(a), y, (b - a) * k, 50, { c, fill: fill || '#0b1220', r: 6, dash, op }) + T(X(a) + (b - a) * k / 2, y + 31, t, { fs: 14, a: 'middle', b: true, c });
  const nhan = (y, t, d) => T(0, y + 22, t, { fs: 16, b: true }) + T(0, y + 42, d, { fs: 13, c: 'mu' });
  // hàng 1
  s += nhan(56, '1. Đang yên', 'cgroup dùng 178 MB');
  s += khoi(56, 0, 140, 'csdl 140 MB', { c: 'blu' }) + khoi(56, 140, 178, 'nền', { c: 'dim' });
  // hàng 2
  s += nhan(142, '2. Bản dựng xin 120 MB', '178 + 120 = 298 > 256');
  s += khoi(142, 0, 140, 'csdl 140 MB', { c: 'blu' }) + khoi(142, 140, 178, 'nền', { c: 'dim' });
  s += khoi(142, 178, 256, 'build …', { c: 'amb' }) + R(X(256), 142, 42 * k, 50, { c: 'red', fill: 'rgba(255,92,108,.14)', r: 6, dash: true }) + T(X(256) + 21 * k, 173, 'thiếu', { fs: 13.5, a: 'middle', c: 'red', b: true });
  // hàng 3
  s += nhan(228, '3. Nhân chọn', 'to nhất = giải phóng nhiều nhất');
  s += khoi(228, 0, 140, '✕ csdl bị GIẾT', { c: 'red', fill: 'rgba(255,92,108,.10)', dash: true });
  s += khoi(228, 140, 178, 'nền', { c: 'dim' }) + khoi(228, 178, 298, 'build 120 MB → exit 0', { c: 'grn' });
  return sv(1150, 300, s);
};

/* ─────────── Slide 10: thang oom_score_adj (số đo thật) ─────────── */
const thang = () => {
  const X = (v) => 60 + (v + 1000) * 0.5; // -1000..1000 ⇒ 60..1060
  let s = '';
  s += `<defs><linearGradient id="gth" x1="0" x2="1"><stop offset="0" stop-color="${D.grn}"/><stop offset=".5" stop-color="${D.dim}"/><stop offset="1" stop-color="${D.red}"/></linearGradient></defs>`;
  s += `<rect x="60" y="120" width="1000" height="14" rx="7" fill="url(#gth)"/>`;
  [-1000, -500, 0, 500, 1000].forEach((v) => { s += T(X(v), 160, String(v), { fs: 14, a: 'middle', c: 'mu', mono: true }); });
  s += T(60, 196, '← được giữ lại', { fs: 15, c: 'grn', b: true }) + T(1060, 196, 'bị chọn trước →', { fs: 15, c: 'red', b: true, a: 'end' });
  const moc = (v, y, t1, t2, c) => `<path d="M${X(v)} ${y + 40} L${X(v)} 118" stroke="${D[c]}" stroke-width="2.5"/><circle cx="${X(v)}" cy="127" r="9" fill="${D[c]}"/>` +
    T(X(v), y, t1, { fs: 14.5, a: 'middle', b: true, c }) + T(X(v), y + 20, t2, { fs: 13, a: 'middle', c: 'mu', mono: true });
  s += moc(-900, 30, 'OOMScoreAdjust=-900', 'oom_score=70–85', 'grn');
  s += moc(-500, 70, 'docker --oom-score-adj -500', 'oom_score=334', 'tea');
  s += moc(0, 30, 'mặc định 0 (csdl 140 MB)', 'oom_score=680', 'blu');
  s += moc(1000, 70, 'build tự ghi 1000', 'bị giết trước', 'red');
  return sv(1120, 206, s);
};

/* ─────────── Slide 13: mẫu thật mỗi 0,25 s — RAM ghim ở 255 MB, swap lớn dần ─────────── */
const mauSwap = () => {
  const M = [[0, 1, 0], [0.25, 54, 0], [0.5, 255, 31], [0.75, 255, 89], [1.0, 255, 231]];
  const X = (t) => 70 + t * 440, Y = (mb) => 250 - mb * 0.44;
  let s = '';
  [0, 100, 200, 300, 400, 500].forEach((mb) => { s += `<path d="M70 ${Y(mb)} L530 ${Y(mb)}" stroke="#1d2735" stroke-width="1"/>` + T(62, Y(mb) + 5, String(mb), { fs: 12.5, a: 'end', c: 'mu', mono: true }); });
  s += `<path d="M70 ${Y(256)} L530 ${Y(256)}" stroke="${D.red}" stroke-width="2" stroke-dasharray="6 5"/>` + T(76, Y(256) - 8, 'MemoryMax 256 MB', { fs: 13, c: 'red', b: true });
  const duong = (i, c) => `<path d="${M.map(([t, r, w], k) => `${k ? 'L' : 'M'}${X(t)} ${Y(i ? r + w : r)}`).join(' ')}" stroke="${D[c]}" stroke-width="3.5" fill="none"/>` +
    M.map(([t, r, w]) => `<circle cx="${X(t)}" cy="${Y(i ? r + w : r)}" r="5" fill="${D[c]}"/>`).join('');
  s += `<path d="M${X(0)} ${Y(0)} ${M.map(([t, r, w]) => `L${X(t)} ${Y(r + w)}`).join(' ')} L${X(1)} ${Y(255)} ${[...M].reverse().map(([t, r]) => `L${X(t)} ${Y(r)}`).join(' ')} Z" fill="rgba(188,140,255,.22)"/>`;
  s += duong(1, 'vio') + duong(0, 'blu');
  [0, 0.25, 0.5, 0.75, 1].forEach((t) => { s += T(X(t), 272, `${t.toFixed(2)} s`, { fs: 12.5, a: 'middle', c: 'mu', mono: true }); });
  s += T(X(1) - 6, Y(486) - 10, 'RAM + swap = 486 MB', { fs: 13.5, a: 'end', c: 'vio', b: true });
  s += T(X(0.5) + 8, Y(255) + 22, 'RAM ghim ở 255 MB', { fs: 13.5, c: 'blu', b: true });
  s += T(70, 18, 'MB (mẫu thật mỗi 0,25 s trong cgroup của unit)', { fs: 13, c: 'dim' });
  return sv(540, 282, s);
};

/* ─────────── Slide 24: tuần tự vs song song (số đo thật, hai app Next.js 15) ─────────── */
const dongBuild = () => {
  const x0 = 300, k = 16.5; // 1 s = 16,5 px ⇒ 40 s = 660 px
  let s = '';
  const hang = (y, t, d, parts, kq, c) => {
    s += T(0, y + 24, t, { fs: 15.5, b: true }) + T(0, y + 44, d, { fs: 13, c: 'mu' });
    parts.forEach(([a, b, lb, cc, dash]) => { s += R(x0 + a * k, y + 6, (b - a) * k, 38, { c: cc, fill: dash ? 'rgba(255,92,108,.12)' : '#0b1220', r: 6, dash }) + T(x0 + (a + b) / 2 * k, y + 31, lb, { fs: 13.5, a: 'middle', b: true, c: cc }); });
    s += T(x0 + 41 * k, y + 31, kq, { fs: 14.5, b: true, c });
  };
  hang(10, 'Tuần tự · trần 800 MB', 'đỉnh 541 MB', [[0, 38.3, 'a rồi b · 38,3 s', 'blu']], '✓ ✓', 'grn');
  hang(82, 'Song song · trần 800 MB', 'đỉnh 800 MB = trần', [[0, 16.3, 'a + b ✕ · 16,3 s', 'red', true]], '✕ ✕ 137', 'red');
  hang(154, 'Song song · trần 3 GB', 'đỉnh 1.139 MB', [[0, 23.4, 'a + b · 23,4 s', 'grn']], '✓ ✓', 'grn');
  hang(226, 'Tuần tự · trần 3 GB', 'đỉnh 668 MB', [[0, 39.4, 'a rồi b · 39,4 s', 'blu']], '✓ ✓', 'grn');
  [0, 10, 20, 30, 40].forEach((t) => { s += `<path d="M${x0 + t * k} 290 L${x0 + t * k} 298" stroke="${D.dim}" stroke-width="2"/>` + T(x0 + t * k, 316, `${t} s`, { fs: 13, a: 'middle', c: 'mu', mono: true }); });
  s += `<path d="M${x0} 294 L${x0 + 40 * k} 294" stroke="${D.dim}" stroke-width="2"/>`;
  return sv(1150, 322, s);
};

export const slides = S([
  cover({ t: 'Chương 8 — Sống trên một cái máy nhỏ', sub: 'mã 137 và OOM killer · ai bị giết · swap mua gì, trả gì · đĩa đầy, inode, log không xoay · dựng bản song song trên VPS 6 GB', chap: 'CHƯƠNG 8' }),

  { t: 'Bản đồ chương: RAM và đĩa là ngân sách', body: mindmap('Máy nhỏ', 'hết RAM thì bị giết · hết đĩa thì hỏng ghi', [
    { t: '8.1 Mã 137', d: '128 + 9 = SIGKILL · OOMKilled=true · dmesg · memory.events', c: 'red' },
    { t: '8.2 Ai bị giết', d: 'cái TO NHẤT, không phải thủ phạm · oom_score_adj · MemoryMax từng dịch vụ', c: 'amb' },
    { t: '8.3 Swap', d: '137 thành 0 · đọc lại chậm hàng trăm lần · --memory-swap', c: 'vio' },
    { t: '8.4 Đĩa', d: 'ENOSPC · tệp xoá còn mở · cạn inode · log Docker không xoay', c: 'tea' },
    { t: '8.5 Dựng trên máy nhỏ', d: 'next build song song ⇒ 137 · Node đọc trần cgroup · ngân sách RAM 6 GB', c: 'blu' },
    { t: 'Chuyện thật', d: '06/07 build song song bị giết · 18/08 cache 7,6 GB đầy đĩa · dời build về máy nhà', c: 'grn' },
  ]) },

  /* ───────────── 8.1 ───────────── */
  { t: '137 = 128 + 9: bị gỡ đi, không phải vỡ', body: two(
    table(['Mã thoát', 'Tín hiệu', 'Nghĩa là'], [
      ['<b>137</b>', 'SIGKILL (9)', '!bị gỡ: không bắt được — trên máy chủ gần như luôn là OOM killer'],
      ['<b>143</b>', 'SIGTERM (15)', '+được mời dừng, handler đã chạy (Ch3)'],
      ['<b>134</b>', 'SIGABRT (6)', 'Node: <code>heap out of memory</code> — có log (8.5)'],
      ['<b>139</b>', 'SIGSEGV (11)', 'lỗi phân đoạn, thường ở mã native'],
      ['<b>130</b>', 'SIGINT (2)', 'ai đó bấm Ctrl-C'],
      ['<b>1</b>', '—', 'lỗi thường: chương trình TỰ thoát'],
    ], { sm: true }),
    `${tinHieu()}${box('warn', 'Mã thoát &gt; 128 nghĩa là tiến trình <b>không tự thoát</b> — có thứ khác kết thúc nó. Tìm lý do ở NHÂN, không ở log ứng dụng.')}`, 'r') },

  { t: 'Đo thật: 500 MB trong 256 MB ⇒ 137', body: two(
    term([
      '$ docker run --name dv08-oom --memory 256m \\',
      '    --memory-swap 256m -v $PWD:/w:ro \\',
      '    node:22-alpine node /w/an-ram.js 500; echo "exit=$?"',
      'da cap 0 MB, rss=45 MB',
      'da cap 50 MB, rss=98 MB',
      'da cap 100 MB, rss=148 MB',
      'da cap 150 MB, rss=199 MB',
      'da cap 200 MB, rss=238 MB',
      '! exit=137',
      '$ F=\'ExitCode={{.State.ExitCode}} OOMKilled={{.State.OOMKilled}}\'',
      '$ docker inspect -f "$F" dv08-oom',
      '! ExitCode=137 OOMKilled=true',
    ], { title: 'Mac M1 · Docker Desktop (cgroup v2) — output thật', fs: 13.5 }),
    `${term([
      '$ docker events --since 3m --until 0s \\',
      '    --filter container=dv08-oom',
      '1790660899 create',
      '1790660899 attach',
      '1790660899 start',
      '! 1790660903 oom',
      '! 1790660903 die exitCode=137',
      '$ docker ps -a --filter name=dv08-oom \\',
      '    --format \'{{.Names}}  {{.Status}}\'',
      'dv08-oom  Exited (137) Less than a second ago',
    ], { title: 'sự kiện của Docker — output thật', fs: 13.5 })}
    ${box('bad', 'Dòng cuối trong log là <code>da cap 200 MB</code> — một dòng bình thường. <b>Không</b> có "out of memory", không stack trace: tiến trình không kịp viết gì.')}`, 'l') },

  { t: 'Nhân ghi lại ở dmesg, log app thì không', body: `
    ${term([
      '$ dmesg | grep -E "invoked oom-killer|oom-kill:|Killed process"',
      '…',
      '[458460.255344] node invoked oom-killer: gfp_mask=0x100cca(GFP_HIGHUSER_MOVABLE),',
      '                order=0, oom_score_adj=0',
      '[458460.258459] oom-kill:constraint=CONSTRAINT_MEMCG,nodemask=(null),cpuset=c96c811a…,',
      '                mems_allowed=0,oom_memcg=/docker/c96c811a…,task_memcg=/docker/c96c811a…,',
      '                task=node,pid=6271,uid=0',
      '! [458460.260258] Memory cgroup out of memory: Killed process 6271 (node) total-vm:666612kB,',
      '!                 anon-rss:251900kB, file-rss:720kB, shmem-rss:0kB, UID:0 pgtables:1012kB oom_score_adj:0',
    ], { title: 'máy ảo của Docker Desktop, đọc bằng container --privileged ngắn hạn — ba dòng của lần giết này (cắt …)', fs: 13 })}
    ${cards([
      { ic: '🧱', t: 'constraint=', d: '<code>CONSTRAINT_MEMCG</code>: chạm trần <strong>cgroup</strong> (container/unit) — máy có thể còn thừa. <code>CONSTRAINT_NONE</code>: CẢ MÁY hết.', c: 'amb' },
      { ic: '📦', t: 'oom_memcg=', d: 'cgroup nào hết: <code>/docker/&lt;id&gt;</code> = container nào; <code>…/csdl.service</code> = unit nào.', c: 'blu' },
      { ic: '🎯', t: 'Killed process', d: 'pid + tên + <code>anon-rss:251900kB</code> (~246 MB bộ nhớ của chính nó) + <code>oom_score_adj</code>.', c: 'red' },
      { ic: '⏳', t: 'Vòng đệm', d: 'dmesg bị ghi đè dần. Có systemd thì <code>journalctl -k</code> giữ bản lưu.', c: 'tea' },
    ], 4)}` },

  { t: 'systemd nói "oom-kill"; cgroup v2 giữ sổ', body: two(
    term([
      '$ sudo systemd-run --unit=thu-oom -p MemoryMax=128M \\',
      '    -p MemorySwapMax=0 --wait /usr/bin/node an-ram.js 300',
      '! Finished with result: oom-kill',
      '! Main processes terminated with: code=killed/status=KILL',
      'Service runtime: 265ms',
      'Memory peak: 128.0M',
      '$ sudo journalctl -u thu-oom -o short-precise | tail -3',
      'Sep 29 05:49:18.543356 cffcaaa5d26c systemd[1]: thu-oom.service:',
      '  A process of this unit has been killed by the OOM killer.',
      'Sep 29 05:49:18.558251 cffcaaa5d26c systemd[1]: thu-oom.service:',
      '  Main process exited, code=killed, status=9/KILL',
      '! Sep 29 05:49:18.558337 cffcaaa5d26c systemd[1]: thu-oom.service:',
      "!   Failed with result 'oom-kill'.",
    ], { title: 'VPS thí nghiệm, systemd 255 — output thật (rút gọn)', fs: 12.5 }),
    `${term([
      '$ cd /sys/fs/cgroup',
      '$ echo "memory.max  = $(cat memory.max)"',
      'memory.max  = 1073741824',
      '$ echo "memory.peak = $(cat memory.peak)"',
      'memory.peak = 173756416',
      '$ cat memory.events',
      'low 0',
      'high 0',
      'max 37',
      'oom 1',
      '! oom_kill 1',
      'oom_group_kill 0',
    ], { title: 'cùng máy — bộ đếm của cgroup', fs: 13.5 })}
    ${box('tip', '<code>oom_kill</code> là <b>bộ đếm cộng dồn</b>: đọc nó trước và sau mỗi deploy là biết có gì bị giết lúc không ai nhìn. <code>memory.peak</code> = đỉnh từng chạm.')}`, 'l') },

  { t: 'Cùng một sự kiện, bốn bộ quần áo', body: `
    ${cards([
      { ic: '🐳', t: 'Docker', d: '<code>Exited (137)</code> · <code>OOMKilled=true</code> · sự kiện <code>oom</code> rồi <code>die</code>', c: 'blu' },
      { ic: '⚙️', t: 'systemd', d: '<code>Failed with result \'oom-kill\'</code> · <code>status=9/KILL</code>', c: 'amb' },
      { ic: '💲', t: 'Script bash', d: 'shell in <code>Killed</code>, <code>$?</code> = 137', c: 'tea' },
      { ic: '📄', t: 'Log ứng dụng', d: '<strong>không có gì</strong> — dòng cuối là việc nó đang làm dở', c: 'red' },
    ], 4)}
    ${two(
      term([
        '$ free -m | head -2',
        '        total   used   free  shared  buff/cache  available',
        '! Mem:    7934   3011    484      77        4714       4922',
        '$ cat /sys/fs/cgroup/memory.max',
        '= 1073741824',
      ], { title: 'BÊN TRONG container --memory 1g — output thật', fs: 13 }),
      box('bad', '<b>Trong container, <code>free</code> nói dối:</b> nó đọc <code>/proc/meminfo</code> của cả máy (7.934 MB) trong khi trần thật là <b>1 GiB</b>. Muốn biết trần: đọc <code>memory.max</code>. Trên VPS KVM thật thì <code>free</code> đúng.'), 'l')}` },

  /* ───────────── 8.2 ───────────── */
  { t: 'OOM killer chọn cái TO NHẤT, không chọn thủ phạm', body: `${toNhat()}
    ${box('warn', 'Nhân cần trang nhớ <b>NGAY</b>, nên nó chọn tiến trình mà giết đi thì giải phóng nhiều nhất. Trên VPS, cái to nhất gần như luôn là <b>cơ sở dữ liệu</b> — đúng vì nó làm đúng việc của nó.')}` },

  { t: 'Đo thật: bản dựng thoát 0, CSDL chết', body: two(
    term([
      '$ sh ai-chet.sh 0',
      'csdl pid=8 giu 140 MB',
      'truoc: csdl oom_score=680 adj=0',
      'cgroup dung 178 MB / 256 MB',
      '--- ban dung xin 120 MB (adj=0) ---',
      '=   build ma thoat : 0   (dong cuoi: XONG 120 MB)',
      '!   csdl pid 8   : DA BI GIET',
    ], { title: 'container --memory 256m (không swap) — output thật', fs: 13.5 }),
    `${term([
      '$ sh ai-chet.sh 1000',
      'csdl pid=8 giu 140 MB',
      'truoc: csdl oom_score=680 adj=0',
      'cgroup dung 178 MB / 256 MB',
      '--- ban dung xin 120 MB (adj=1000) ---',
      '!   build ma thoat : 137   (dong cuoi: da cap 50 MB, rss=98 MB)',
      '=   csdl pid 8   : CON SONG',
    ], { title: 'cùng máy, bản dựng tự nâng điểm — output thật', fs: 13.5 })}
    ${sh([['echo 1000 > /proc/self/oom_score_adj', 'không cần quyền gì'], ['exec npm run build', 'con cháu thừa kế điểm']], { fs: 14 })}`) },

  { t: 'oom_score: bộ nhớ quyết định, adj là ngón tay', body: `${thang()}
    ${two(
      term([
        '$ docker run --rm node:22-alpine sh -c \\',
        '    \'echo -1000 > /proc/self/oom_score_adj; echo "exit=$?"\'',
        '! sh: write error: Permission denied',
        'exit=1',
        '$ docker run --rm --oom-score-adj -500 node:22-alpine \\',
        '    sh -c \'cat /proc/1/oom_score_adj /proc/1/oom_score\'',
        '= -500',
        '334',
      ], { title: 'HẠ điểm cần quyền; Docker đặt hộ lúc khởi động — output thật', fs: 13 }),
      box('info', '<b>Nâng</b> điểm của chính mình: ai cũng làm được. <b>Hạ</b> điểm (bảo vệ): cần <code>CAP_SYS_RESOURCE</code> ⇒ đặt từ BÊN NGOÀI: <code>OOMScoreAdjust=</code> của systemd, <code>--oom-score-adj</code> / <code>oom_score_adj:</code> của Docker/Compose.'), 'l')}` },

  { t: 'Trần cho TỪNG dịch vụ: OOM ở trong chuồng', body: two(
    `${table(['VPS 1 GB: csdl 550 MB + build xin 600 MB', 'build', 'csdl'], [
      ['A. không trần nào', '+exit 0', '-oom-kill'],
      ['B. build <code>MemoryMax=300M</code>', '-oom-kill', '+sống'],
      ['C. csdl <code>OOMScoreAdjust=-900</code>', '-oom-kill', '+sống'],
    ], { sm: true })}
    ${term([
      '$ ./vps-ai.sh -p MemoryMax=300M -p MemorySwapMax=0',
      'VPS: memory.max=1024 MB  dang dung=597 MB',
      'csdl: 567 0  oom_score=710',
      '--- build xin 600 MB: systemd-run -p MemoryMax=300M -p MemorySwapMax=0 ---',
      '!  build: Finished with result: oom-kill',
      '   build: Main processes terminated with: code=killed/status=KILL',
      '   build: Memory peak: 300.0M',
      '   build: Memory swap peak: 0B',
      '=  csdl : success active',
      'Killed process 11580 (node) total-vm:899748kB, anon-rss:305720kB',
    ], { title: 'VPS thí nghiệm — ca B, output thật', fs: 12 })}`,
    `${box('good', '<b>Trần riêng</b> (B) biến "cả máy hết" thành "một chuồng hết": OOM chỉ xét tiến trình TRONG chuồng đó, csdl không bị đưa lên bàn cân.')}
    ${box('tip', '<b>Điểm âm</b> (C) cũng cứu được csdl — nhưng bản dựng vẫn ăn tới 445 MB trước khi chết. Dùng cả hai: trần cho việc tạm, điểm âm cho dữ liệu.')}
    ${box('info', 'Docker: mỗi container là một cgroup ⇒ <code>mem_limit</code> cho mọi service là "chuồng" miễn phí.')}`, 'l') },

  { t: 'Unit systemd: trần mềm, trần cứng, điểm OOM', body: two(
    conf([
      ['[Unit]', ''],
      ['StartLimitIntervalSec=60', 'trong 60 s…'],
      ['StartLimitBurst=3', '…chết quá 3 lần: thôi'],
      ['', ''],
      ['[Service]', ''],
      ['ExecStart=/usr/bin/node /home/deploy/giu.js 200', ''],
      ['OOMScoreAdjust=-900', 'đừng chọn tôi'],
      ['MemoryHigh=400M', 'trần MỀM: bóp chậm'],
      ['MemoryMax=512M', 'trần CỨNG: giết'],
      ['MemorySwapMax=0', 'không lấn sang swap'],
      ['Restart=on-failure', ''],
      ['RestartSec=2', ''],
    ], { fs: 14.5 }),
    `${term([
      '$ systemctl show csdl-thu -p MemoryMax -p MemoryHigh \\',
      '    -p MemorySwapMax -p OOMScoreAdjust',
      'MemoryHigh=419430400',
      'MemoryMax=536870912',
      'MemorySwapMax=0',
      'OOMScoreAdjust=-900',
      '$ PID=$(systemctl show csdl-thu -p MainPID --value)',
      '$ cat /proc/$PID/oom_score_adj /proc/$PID/oom_score',
      '= -900',
      '= 70',
    ], { title: 'VPS thí nghiệm — output thật', fs: 13 })}
    ${term([
      '$ docker run -d --name dv08-loop --restart unless-stopped \\',
      '    --memory 128m --memory-swap 128m … an-ram.js 300',
      '$ sleep 15; docker ps -a --filter name=dv08-loop',
      'NAMES       STATUS',
      '! dv08-loop   Restarting (137) Less than a second ago',
      '$ docker inspect -f \'RestartCount={{.RestartCount}} …\' dv08-loop',
      'RestartCount=8 OOMKilled=true ExitCode=137',
    ], { title: 'restart + OOM = vòng lặp: 8 lần trong 15 s', fs: 12.5 })}`, 'r') },

  /* ───────────── 8.3 ───────────── */
  { t: 'Có swap: 137 thành 0, RAM ghim ở trần', body: two(
    mauSwap(),
    `${term([
      '$ for sw in 0 512M; do echo "== … MemorySwapMax=$sw …"',
      '    sudo systemd-run --unit=thu-swap -p MemoryMax=256M \\',
      '      -p MemorySwapMax=$sw --wait node an-ram.js 500 …; done',
      '== MemoryMax=256M MemorySwapMax=0 : xin 500 MB',
      '! Finished with result: oom-kill',
      'da cap 200 MB, rss=247 MB',
      '== MemoryMax=256M MemorySwapMax=512M : xin 500 MB',
      '= Finished with result: success',
      'XONG 500 MB',
    ], { title: 'VPS thí nghiệm — output thật (rút gọn)', fs: 13 })}
    ${box('info', 'Trần 256 MB được giữ ĐÚNG; phần tràn đi xuống đĩa. Đó là toàn bộ việc của swap.')}`) },

  { t: 'Cái giá: đọc lại chậm hàng trăm lần', body: two(
    `${bars([
      { l: '200 MB — vừa RAM', sub: '3 lượt đọc lại', v: 16, txt: '1,2 – 16 ms', c: 'grn' },
      { l: '400 MB — tràn swap', sub: '3 lượt đọc lại', v: 7238, txt: '4.576 – 7.238 ms', c: 'red' },
    ], { lw: 190 })}
    ${term([
      'luot 1: doc lai 200 MB mat 16.0 ms',
      'luot 2: doc lai 200 MB mat 13.3 ms',
      'luot 3: doc lai 200 MB mat 1.2 ms',
      '! luot 1: doc lai 400 MB mat 7238.3 ms',
      '! luot 2: doc lai 400 MB mat 5223.2 ms',
      '! luot 3: doc lai 400 MB mat 4576.0 ms',
    ], { title: 'doc-lai.js · MemoryMax=256M + swap 512M — output thật', fs: 13 })}`,
    `${term([
      '$ vmstat 1 6',
      ' r  b   swpd   free  …      si     so',
      ' 0  1 653032 772408  …  152160 153088',
      ' 1  0 654148 772168  …  179080 176240',
      ' 1  0 653844 774892  …   78784  78252',
      ' 2  0 656424 774892  …  158848 158340',
    ], { title: 'trong lúc đọc lại 400 MB — output thật (cắt cột)', fs: 13.5 })}
    ${box('warn', 'Tính theo MB: ~0,065 ms/MB trong RAM so với ~12 ms/MB khi tràn — <b>khoảng 200 lần</b>. Đo trên SSD của Mac; đĩa VPS rẻ còn chậm hơn.')}
    ${box('tip', 'Báo động theo <b>tốc độ</b> <code>si</code>/<code>so</code> (KB/s), không theo <code>swpd</code>. swpd lớn mà si/so = 0 là lành mạnh.')}`, 'l') },

  { t: 'Tạo swap file: bốn lệnh, một dòng fstab', body: two(
    `${sh([
      ['sudo fallocate -l 2G /swapfile', 'giữ chỗ 2 GB'],
      ['sudo chmod 600 /swapfile', 'chỉ root đọc được'],
      ['sudo mkswap /swapfile', 'ghi đầu vùng swap'],
      ['sudo swapon /swapfile', 'bật ngay'],
      ["echo '/swapfile none swap sw 0 0' |", ''],
      ['  sudo tee -a /etc/fstab', 'bật lại sau reboot'],
      ['sudo sysctl vm.swappiness=10', 'ưu tiên bỏ cache trước'],
      ['swapon --show; free -m', 'kiểm lại'],
    ], { fs: 14.5 })}
    ${box('info', 'Mặc định <code>vm.swappiness=60</code>. Muốn giữ qua reboot: ghi <code>vm.swappiness=10</code> vào <code>/etc/sysctl.d/99-swap.conf</code>.')}`,
    `${term([
      '$ sudo chmod 644 /mnt/dia/swapfile; sudo mkswap /mnt/dia/swapfile',
      '+ mkswap: /mnt/dia/swapfile: insecure permissions 0644, fix with: chmod 0600 /mnt/dia/swapfile',
      'Setting up swapspace version 1, size = 256 MiB (268431360 bytes)',
      '$ sudo swapon /mnt/dia/swapfile; echo "swapon exit=$?"',
      '+ swapon: /mnt/dia/swapfile: insecure permissions 0644, 0600 suggested.',
      '! swapon exit=0',
      '$ swapon --show',
      'NAME              TYPE  SIZE   USED PRIO',
      '/var/lib/swap     file 1024M 476.6M   -1',
      '! /mnt/dia/swapfile file  256M     0B   -1',
    ], { title: 'VPS thí nghiệm (ext4 trên loop) — output thật', fs: 11.5 })}
    ${box('bad', '<b>swapon chỉ CẢNH BÁO rồi vẫn bật</b> (exit 0). Tệp 0644 = bộ nhớ tiến trình (token, bí mật) ai cũng đọc được trên đĩa. Luôn <code>chmod 600</code> TRƯỚC <code>mkswap</code>.')}`, 'r') },

  { t: '--memory-swap, mem_limit: đọc cho đúng', body: two(
    table(['Bạn viết', 'RAM', 'Swap thêm'], [
      ['<code>--memory 256m --memory-swap 256m</code>', '256 MB', '-<span>0 — tắt swap</span>'],
      ['<code>--memory 256m --memory-swap 768m</code>', '256 MB', '512 MB (tổng 768)'],
      ['<code>mem_limit: 768m</code> (Compose, không gì thêm)', '768 MB', '!THÊM 768 MB nếu máy có swap'],
      ['<code>mem_limit</code> = <code>memswap_limit</code>', 'bằng trần', '-<span>0</span>'],
      ['systemd <code>MemoryMax=</code> + <code>MemorySwapMax=0</code>', 'MemoryMax', '-<span>0</span>'],
      ['cgroup v2: <code>memory.max</code> / <code>memory.swap.max</code>', 'memory.max', 'swap.max (RIÊNG)'],
    ], { sm: true }),
    `${term([
      '$ F=\'{{.Name}} Memory={{.HostConfig.Memory}}\'',
      '$ F="$F MemorySwap={{.HostConfig.MemorySwap}}"',
      '$ docker inspect -f "$F" $(docker compose ps -q)',
      '! /dv08-backend-1 Memory=805306368 MemorySwap=1610612736',
      '/dv08-nginx-1 Memory=134217728 MemorySwap=268435456',
      '= /dv08-postgres-1 Memory=1610612736 MemorySwap=1610612736',
      '/dv08-redis-1 Memory=268435456 MemorySwap=536870912',
    ], { title: 'compose dv08 — output thật', fs: 12.5 })}
    ${box('warn', '<code>--memory-swap</code> là <b>TỔNG</b> RAM + swap, không phải phần swap. Chỉ đặt <code>mem_limit</code> ⇒ Docker cho thêm đúng chừng ấy swap: backend 768 MB có thể phình lên 1,5 GB và chạy <b>chậm</b> thay vì chết.')}`, 'l') },

  { t: 'Chậm có khi tệ hơn chết: ba trạng thái', body: `
    ${cards([
      { ic: '💥', t: 'Không swap', d: '<strong>exit 137</strong> — ồn, ngay lập tức, rõ trong nhân. Bộ giám sát khởi động lại, người ta nhìn thấy.', c: 'red' },
      { ic: '😌', t: 'Swap dùng nhẹ', d: 'trang <strong>nhàn rỗi</strong> ra đĩa, không ai biết. si/so ≈ 0. Đây là swap làm tốt.', c: 'grn' },
      { ic: '🐌', t: 'Swap nặng — thrashing', d: 'sống, trả lời ĐÚNG nhưng mất giây. Hạn giờ đổ dây chuyền, health check <strong>vẫn xanh</strong>.', c: 'amb' },
    ], 3)}
    ${two(
      term([
        '$ cat /sys/fs/cgroup/system.slice/thu-doc.service/memory.pressure',
        '+ some avg10=3.04 avg60=0.60 avg300=0.12 total=480289',
        '+ full avg10=3.04 avg60=0.60 avg300=0.12 total=480289',
      ], { title: 'PSI khi đang đọc lại 400 MB trong 256 MB — output thật', fs: 12.5 }),
      box('tip', '<b>PSI</b> (pressure stall — thời gian bị ĐỨNG chờ bộ nhớ, %): <code>avg10=3.04</code> = 3% của 10 s vừa qua tiến trình đứng im chờ trang. Theo dõi nó thay cho "% RAM dùng".'), 'l')}` },

  /* ───────────── 8.4 ───────────── */
  { t: 'Đĩa đầy: ghi hỏng, xoá thì được', body: two(
    term([
      '$ head -c 20M /dev/urandom > /mnt/dia/pg/data',
      '$ dd if=/dev/zero of=/mnt/dia/cache/layer bs=1M count=100 \\',
      '    status=none; echo "dd exit=$?"',
      'dd exit=1',
      '! dd: error writing \'/mnt/dia/cache/layer\': No space left on device',
      '$ df -h /mnt/dia',
      '! /dev/loop0       56M   55M  664K  99% /mnt/dia',
      '$ head -c 1M /dev/urandom >> /mnt/dia/pg/wal; echo "ghi WAL 1 MB exit=$?"',
      '! head: error writing \'standard output\': No space left on device',
      'ghi WAL 1 MB exit=1',
      '$ rm -rf /mnt/dia/cache; df -h /mnt/dia',
      '= /dev/loop0       56M   21M   35M  38% /mnt/dia',
    ], { title: 'ext4 64 MB trên loop, trong VPS thí nghiệm — output thật', fs: 12.5 }),
    `${box('bad', 'Bản dựng hỏng một mình thì không sao. Cái chết là <b>cơ sở dữ liệu ghi tiếp</b>: WAL hỏng ⇒ Postgres dừng nhận ghi, có khi tự tắt. Tiến trình KHÔNG bị giết — nó sống và nhận lỗi <code>ENOSPC</code> (errno 28).')}
    ${box('good', '<b>Xoá thì chạy</b> khi ghi không chạy: gỡ một mục thư mục không cần khối mới. 100% đĩa gần như luôn cách "sống lại" đúng một lệnh <code>rm</code> — miễn là xoá đúng thứ.')}
    ${box('info', 'ext4 giữ 5% cho root (<code>tune2fs -m</code>) — lý do máy "đầy" vẫn cho bạn đăng nhập để dọn.')}`, 'l') },

  { t: 'df đầy, du không: tệp đã xoá còn mở', body: two(
    term([
      '$ bash xoa-mo.sh',
      '/dev/loop0       56M   51M  4.1M  93% /mnt/dia',
      '--- da rm app.log',
      '! /dev/loop0       56M   51M  4.1M  93% /mnt/dia',
      '21M	/mnt/dia',
      'COMMAND  PID   USER   FD   TYPE DEVICE SIZE/OFF NLINK NODE NAME',
      '! python3 2408 deploy    3w   REG    7,0 31457280     0   13 /mnt/dia/app.log (deleted)',
      '--- da cat cut qua /proc/2408/fd/3',
      '= /dev/loop0       56M   21M   35M  38% /mnt/dia',
    ], { title: 'VPS thí nghiệm — output thật', fs: 12 }),
    `${sh([
      ['lsof -nP +L1', 'NLINK 0 = đã xoá mà còn mở'],
      [': > /proc/2408/fd/3', 'cắt cụt qua fd, không restart'],
      ['truncate -s 0 app.log', 'khi tệp còn tên: cắt, đừng rm'],
    ], { fs: 14 })}
    ${box('warn', '<code>rm</code> một log lớn khi tiến trình còn mở nó = lấy lại <b>0 byte</b>, còn <code>du</code> thì báo đã hết. Đó là lý do <code>logrotate</code> có <code>copytruncate</code>.')}`, 'l2') },

  { t: 'Cạn inode: 52 MB trống vẫn ENOSPC', body: two(
    term([
      '$ sudo mkfs.ext4 -q -N 1024 /inode.img',
      '$ i=0; while head -c 100 /dev/zero > /mnt/ino/s$i; do i=$((i+1)); done',
      '! bash: line 10: /mnt/ino/s1013: No space left on device',
      '$ df -h /mnt/ino',
      '= /dev/loop1       60M  4.0M   52M   8% /mnt/ino',
      '$ df -i /mnt/ino',
      '! /dev/loop1       1024  1024     0  100% /mnt/ino',
    ], { title: 'ext4 64 MB chỉ 1024 inode — output thật', fs: 13 }),
    table(['Lệnh báo đầy', 'Nghĩa là', 'Làm gì'], [
      ['<code>df -h</code>', 'hết KHỐI', 'xoá / cắt tệp LỚN'],
      ['<code>df -i</code>', 'hết INODE', 'xoá NHIỀU tệp nhỏ (session, cache)'],
      ['<code>df</code> đầy, <code>du</code> không', 'tệp xoá còn mở', '<code>lsof +L1</code>, cắt qua <code>/proc</code>'],
      ['không cái nào', 'hạn ngạch / tệp quá lớn', '<code>EDQUOT</code>, <code>EFBIG</code>'],
    ], { sm: true }), 'l') },

  { t: 'Log Docker không tự xoay: 15 MB ⇒ 43 MB', body: two(
    `${bars([
      { l: 'chữ app in ra', sub: '400.000 dòng', v: 15.1, txt: '15,1 MB', c: 'blu' },
      { l: 'json-file mặc định', sub: 'không giới hạn', v: 43.1, txt: '43,1 MB (×2,85)', c: 'red' },
      { l: 'max-size=5m, max-file=2', sub: '', v: 8.0, txt: '8,0 MB — trần', c: 'grn' },
    ], { lw: 210 })}
    ${term([
      '43051196 11b2758d…-json.log',
      '# --log-opt max-size=5m --log-opt max-file=2',
      '3040250 71d38d84…-json.log',
      '5000008 71d38d84…-json.log.1',
    ], { title: 'containers/<id>/ — output thật (cắt id)', fs: 13 })}`,
    `${yaml([
      ['services:', ''],
      ['  backend:', ''],
      ['    logging:', ''],
      ['      driver: json-file', ''],
      ['      options:', ''],
      ['        max-size: "10m"', 'mỗi tệp tối đa'],
      ['        max-file: "3"', 'giữ 3 tệp ⇒ ≤ 30 MB'],
    ], { fs: 14 })}
    ${code(`{\n  "log-driver": "json-file",\n  "log-opts": { "max-size": "10m", "max-file": "3" }\n}`, 'json')}
    ${box('warn', '<code>/etc/docker/daemon.json</code> chỉ áp cho container TẠO MỚI sau khi restart dockerd. Container cũ giữ cấu hình cũ tới lần <code>up</code> kế.')}`) },

  { t: 'Thứ lớn dần trên VPS nằm cùng đĩa với CSDL', body: two(
    `${term([
      '$ docker system df',
      'TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE',
      'Images          27        19        13.47GB   2.238GB (16%)',
      'Containers      37        11        975.9MB   553.7MB (56%)',
      'Local Volumes   83        25        13.38GB   8.347GB (62%)',
      '! Build Cache     117       15        5.685GB   2.337GB',
    ], { title: 'chính máy Mac dev của khoá này — output thật', fs: 12.5 })}
    ${cards([
      { t: '🧱 Cache build', d: '18/08: <strong>7,6 GB</strong> cạnh Postgres ⇒ <code>no space left</code> giữa lúc dựng', c: 'red' },
      { t: '🖼 Ảnh cũ', d: 'mỗi lần kéo bản mới, bản cũ nằm lại', c: 'amb' },
      { t: '📜 Log', d: 'json-file không trần · journal không trần', c: 'vio' },
      { t: '📦 Bản phát hành', d: '<code>node_modules</code> mỗi bản (Ch6)', c: 'blu' },
    ], 2)}`,
    `${sh([
      ['df -h / ; df -i /', 'khối hay inode?'],
      ['docker system df', 'ảnh · cache · volume'],
      ['docker builder prune -f \\', ''],
      ['  --filter until=168h', 'cache cũ hơn 7 ngày'],
      ['docker image prune -f \\', ''],
      ['  --filter until=168h', 'ảnh lơ lửng cũ'],
      ['journalctl --disk-usage', ''],
      ['sudo journalctl --vacuum-size=200M', ''],
    ], { fs: 14 })}
    ${box('good', '<b>Sửa tận gốc (18/08):</b> không dựng trên VPS nữa ⇒ VPS <b>không còn cache build</b>. Cron dọn hằng tuần chỉ là lưới đỡ.')}`, 'r') },

  /* ───────────── 8.5 ───────────── */
  { t: 'Hai next build song song: cả hai 137', body: two(
    term([
      '$ docker run --memory 800m --memory-swap 800m … sh hai-ban.sh',
      'gioi han: 800 MB, swap: 0',
      '=== TUAN TU ===',
      '= a exit=0',
      '= b exit=0',
      '  38342 ms | dinh 541 MB | oom_kill 0',
      '=== SONG SONG ===',
      '! b exit=137',
      '! a exit=137',
      '  16300 ms | dinh 800 MB | oom_kill 2',
      '  [a] Killed',
      '  [b] Killed',
    ], { title: 'hai app Next.js 15 thật, next build — output thật', fs: 13 }),
    `${term([
      '$ docker run --memory 3g --memory-swap 3g … sh hai-ban.sh',
      '=== TUAN TU ===',
      '  39373 ms | dinh 668 MB | oom_kill 0',
      '=== SONG SONG ===',
      '  23440 ms | dinh 1139 MB | oom_kill 0',
    ], { title: 'cùng hai app, trần 3 GB — output thật (rút gọn)', fs: 13 })}
    ${box('bad', '<b>Chuyện thật 06/07:</b> VPS 6 GB dựng ảnh backend + frontend <b>song song</b> với cache lạnh ⇒ <code>next build</code> chết exit 137. Sửa lần 1: dựng TUẦN TỰ. Sửa lần 2 (18/08): dời hẳn việc dựng về máy nhà.')}`, 'l') },

  { t: 'Song song nhanh hơn — cho tới khi hết RAM', body: `${dongBuild()}
    ${two(
      box('warn', 'Song song cộng hai <b>đỉnh</b> lại với nhau: 668 → 1.139 MB. Dưới trần 800 MB, cả hai chết sau 16 s — công sức đổ sông, rồi còn phải chạy lại.'),
      box('tip', 'Cache ấm thì cả hai bước dựng gần như không làm gì ⇒ tuần tự chỉ tốn thêm vài giây đúng ở những lần mà tốc độ lẽ ra quan trọng.'))}` },

  { t: 'Dời bản dựng khỏi VPS: chỉ kéo về và tráo', body: `${diagram({
    w: 1160, h: 230,
    nodes: [
      { id: 'dev', x: 0, y: 70, w: 160, h: 86, ic: '💻', t: 'commit', d: 'main cục bộ', c: 'blu' },
      { id: 'nha', x: 300, y: 70, w: 230, h: 86, ic: '🏠', t: 'máy nhà dựng', d: '12 nhân / 31 GB\nsong song · 3–6 phút', c: 'grn' },
      { id: 'reg', x: 670, y: 70, w: 160, h: 86, ic: '📦', t: 'GHCR', d: 'ảnh đã dựng xong', c: 'vio' },
      { id: 'vps', x: 970, y: 70, w: 190, h: 86, ic: '🖥', t: 'VPS 6 GB', d: 'pull + tráo\nKHÔNG cache build', c: 'dv' },
    ],
    edges: [
      { from: 'dev', to: 'nha', t: 'git push', off: 8 },
      { from: 'nha', to: 'reg', t: 'docker push', off: 8 },
      { from: 'reg', to: 'vps', t: 'docker pull', off: 8 },
    ],
  })}
    ${cards([
      { ic: '1️⃣', t: 'Dựng ở chỗ khác', d: 'VPS chỉ nhận tạo tác xong (Ch1). Không đỉnh RAM, không cache trên đĩa CSDL.', c: 'grn' },
      { ic: '2️⃣', t: 'Dựng trên VPS, tuần tự', d: 'nửa đỉnh. Trước 18/08: ~15 phút mỗi lần.', c: 'blu' },
      { ic: '3️⃣', t: '…có trần / điểm +1000', d: 'phải tranh thì ít ra nó thua, không phải CSDL.', c: 'amb' },
      { ic: '4️⃣', t: 'Song song trên VPS', d: 'đo rồi: chết 137 và chậm hơn.', c: 'red' },
    ], 4)}` },

  { t: 'Node 20+ tự đọc trần cgroup; Node 18 thì không', body: two(
    term([
      '$ docker run --rm --memory 512m node:18-alpine node -e \\',
      '    \'console.log(…heap_size_limit…)\'',
      '! node v18.20.8 heap_size_limit = 2096 MB',
      '$ … --memory 512m node:20-alpine …',
      '= node v20.20.2 heap_size_limit = 259 MB',
      '$ … --memory 512m node:22-alpine …',
      '= node v22.23.2 heap_size_limit = 259 MB | constrainedMemory = 512 MB',
      '$ … --memory 2g node:22-alpine …',
      'node v22.23.2 heap_size_limit = 1048 MB | constrainedMemory = 2048 MB',
      '$ … (không --memory) node:22-alpine …',
      'node v22.23.2 heap_size_limit = 2096 MB | constrainedMemory = 17592186044416 MB',
    ], { title: 'Docker Desktop (máy ảo 8 GB) — output thật, rút gọn lệnh', fs: 12 }),
    `${box('bad', '<b>Node 18</b> trong container 512 MB vẫn định heap 2.096 MB (theo cả máy) ⇒ phình tới trần rồi bị giết <b>137</b>, không một dòng log.')}
    ${box('good', '<b>Node 20/22</b> lấy ~<b>một nửa</b> trần cgroup làm heap ⇒ hết heap thì chết <b>134</b> kèm <code>FATAL ERROR: … heap out of memory</code> — đọc được.')}
    ${sh([['NODE_OPTIONS=--max-old-space-size=384 \\', 'đặt tay'], ['  npm run build', 'mọi bản Node']], { fs: 13.5 })}`, 'l2') },

  { t: 'Ngân sách RAM cho một VPS 6 GB', body: `
    ${seg([
      { t: 'hệ thống', d: '~500', w: 500, c: 'dim' },
      { t: 'postgres', d: '1.536', w: 1536, c: 'blu' },
      { t: 'redis', d: '256', w: 256, c: 'red' },
      { t: 'backend', d: '768', w: 768, c: 'grn' },
      { t: 'next', d: '768', w: 768, c: 'tea' },
      { t: '', d: '', w: 128, c: 'amb' },
      { t: 'dư: cache đĩa + bản thứ hai lúc tráo', d: '~2.000 MB', w: 2000, c: 'vio' },
    ])}
    ${table(['Thành phần', 'Trần đặt (kế hoạch)', 'Căn cứ đo trong phòng thí nghiệm'], [
      ['Hệ điều hành, dockerd, containerd, sshd, journald', '~500 MB (không trần)', 'dockerd 84–271 MB · containerd 55–72 MB · journald 15 MB'],
      ['PostgreSQL 16', '<code>mem_limit: 1536m</code> + <code>memswap_limit</code> bằng', 'nghỉ 69 MiB → 214 MiB sau pgbench 10 kết nối (shared_buffers 128 MB)'],
      ['Redis 7', '256m, <code>--maxmemory 200mb</code>', 'nghỉ 34 MiB · maxmemory giữ nó dưới trần container'],
      ['Backend Node 22 · Next.js server', '768m mỗi cái ⇒ heap tự ~384 MB', '<code>docker stats</code>: backend nghỉ 103 MiB'],
      ['nginx', '128m', 'nghỉ 18 MiB (10 worker vì máy ảo 10 nhân; VPS 2–4 nhân ít hơn)'],
      ['Bản dựng (build)', '!0 — không dựng trên VPS', 'một next build tối giản: đỉnh 541–668 MB'],
    ], { sm: true })}` },

  { t: 'docker stats: đo từng container, đừng đoán', body: two(
    `${term([
      '$ F=\'table {{.Name}}\\t{{.MemUsage}}\\t{{.MemPerc}}\\t{{.CPUPerc}}\'',
      '$ docker stats --no-stream --format "$F" $(docker compose ps -q)',
      'NAME              MEM USAGE / LIMIT   MEM %     CPU %',
      'dv08-backend-1    102.6MiB / 768MiB   13.36%    0.00%',
      'dv08-nginx-1      18.05MiB / 128MiB   14.11%    0.00%',
      'dv08-postgres-1   69.04MiB / 1.5GiB   4.49%     0.12%',
      'dv08-redis-1      34.33MiB / 256MiB   13.41%    2.06%',
      '$ docker exec dv08-postgres-1 pgbench -c 10 -T 10 -S …',
      'tps = 33886.603309 (without initial connection time)',
      '$ docker stats --no-stream … dv08-postgres-1',
      '! dv08-postgres-1   213.8MiB / 1.5GiB   13.92%',
    ], { title: 'compose dv08 trên Mac — output thật', fs: 12 })}
    ${box('info', 'Cột LIMIT = trần bạn đặt; không đặt thì nó hiện cả máy. <code>MEM USAGE</code> đã trừ phần cache đĩa có thể thu hồi.')}`,
    yaml([
      ['services:', ''],
      ['  postgres:', ''],
      ['    image: postgres:16', ''],
      ['    mem_limit: 1536m', 'trần RAM'],
      ['    memswap_limit: 1536m', 'bằng nhau = không swap'],
      ['    oom_score_adj: -500', 'CẢ MÁY hết: giữ'],
      ['  redis:', ''],
      ['    mem_limit: 256m', '+ --maxmemory 200mb'],
      ['  backend:', ''],
      ['    mem_limit: 768m', 'heap Node 22 ~384'],
      ['    restart: unless-stopped', ''],
    ], { fs: 13 }), 'l2') },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 8', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Container <code>Exited (137)</code>, log trống', 'OOM killer — <code>OOMKilled=true</code>', 'đọc <code>dmesg</code> / <code>memory.events</code>, rồi đặt trần'],
    ['Build xanh, 20 s sau web sập', 'OOM giết CSDL (to nhất), không giết build', 'không build trên VPS · trần cho việc tạm'],
    ['<code>Restarting (137)</code> mãi', 'restart + OOM = vòng lặp', 'nâng trần hoặc sửa rò; <code>StartLimitBurst</code>'],
    ['Web chậm dần, health check xanh', 'thrashing: si/so chạy liên tục', 'giảm tải / thêm RAM; báo động theo PSI, si/so'],
    ['<code>mem_limit</code> đặt rồi mà vẫn phình', '<code>--memory-swap</code> mặc định cho thêm swap', '<code>memswap_limit</code> = <code>mem_limit</code>'],
    ['<code>free</code> báo 8 GB trong container 1 GB', '<code>/proc/meminfo</code> là của cả máy', 'đọc <code>/sys/fs/cgroup/memory.max</code>'],
    ['<code>rm</code> log lớn mà đĩa không trống ra', 'tệp đã xoá còn mở', '<code>lsof +L1</code> · cắt qua <code>/proc/PID/fd</code>'],
    ['Còn 52 MB trống vẫn ENOSPC', 'cạn inode', '<code>df -i</code> · xoá nhiều tệp nhỏ'],
    ['Đĩa đầy dần sau mỗi deploy', 'cache build · log json-file · ảnh cũ', 'dời build · <code>max-size</code> · prune có filter'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 8 (1/2): RAM và OOM', body: two(
    sh([
      ['docker inspect -f "{{.State.OOMKilled}}" app', 'bị OOM giết?'],
      ['dmesg | grep -i "killed process"', 'ai, bao nhiêu, vì sao'],
      ['journalctl -k --since "1 hour ago"', 'bản lưu của nhân'],
      ['cat /sys/fs/cgroup/memory.{max,peak}', 'trần + đỉnh (v2)'],
      ['grep oom_kill /sys/fs/cgroup/memory.events', 'đếm cộng dồn'],
      ['docker stats --no-stream', 'từng container'],
      ['ps -eo pid,rss,comm --sort=-rss | head', 'ai to nhất'],
      ['cat /proc/PID/oom_score /proc/PID/oom_score_adj', ''],
      ['echo 1000 > /proc/self/oom_score_adj', 'việc tạm: tự nhận chết'],
      ['vmstat 1 5', 'si/so = đang thrash?'],
      ['cat /proc/pressure/memory', 'PSI cả máy'],
    ], { fs: 13 }),
    table(['Chỗ đặt trần', 'Cú pháp'], [
      ['docker run', '<code>--memory 512m --memory-swap 512m</code>'],
      ['compose', '<code>mem_limit</code> · <code>memswap_limit</code> · <code>oom_score_adj</code>'],
      ['systemd unit', '<code>MemoryHigh=</code> · <code>MemoryMax=</code> · <code>MemorySwapMax=</code> · <code>OOMScoreAdjust=</code>'],
      ['lệnh lẻ', '<code>systemd-run --scope -p MemoryMax=512M …</code>'],
      ['Node', '<code>NODE_OPTIONS=--max-old-space-size=384</code>'],
      ['docker build', '<code>--memory</code> (lỗi: <code>cannot allocate memory</code>)'],
      ['swap', '<code>chmod 600</code> → <code>mkswap</code> → <code>swapon</code> → fstab'],
    ], { sm: true }), 'l') },

  { t: 'Bảng tra nhanh Chương 8 (2/2): đĩa', body: two(
    sh([
      ['df -h; df -i', 'khối hay inode?'],
      ['sudo du -xh --max-depth=1 / | sort -h | tail', 'thư mục nào to'],
      ['lsof -nP +L1', 'xoá rồi mà còn mở'],
      [': > /proc/PID/fd/N', 'cắt cụt không restart'],
      ['truncate -s 0 big.log', 'cắt, đừng rm'],
      ['docker system df', ''],
      ['docker builder prune -f --filter until=168h', ''],
      ['docker image prune -f --filter until=168h', ''],
      ['journalctl --disk-usage', ''],
      ['sudo journalctl --vacuum-size=200M', ''],
      ['sudo tune2fs -l /dev/sdX | grep -i reserved', '5% cho root'],
    ], { fs: 13 }),
    `${table(['Thứ lớn dần', 'Trần'], [
      ['log container', '<code>logging.options.max-size/max-file</code> hoặc <code>daemon.json</code>'],
      ['journal', '<code>SystemMaxUse=500M</code> trong <code>journald.conf</code>'],
      ['cache build', '!đừng dựng trên VPS'],
      ['ảnh cũ', 'prune có <code>--filter until=</code>'],
      ['bản phát hành', 'giữ N bản (Ch6)'],
    ], { sm: true })}
    ${box('tip', 'Báo động theo <b>xu hướng</b> ("đầy trong 3 ngày"), không theo ngưỡng 90% — Chương 9.')}`, 'l') },

  { t: 'Thực hành Chương 8 (45 phút): làm máy nhỏ đau', body: `
    ${steps([
      ['Chạy <code>an-ram.js 500</code> trong <code>--memory 256m --memory-swap 256m</code>', 'ghi: dòng cuối trong log, ExitCode, OOMKilled, dòng Killed process trong dmesg'],
      ['Chạy <code>ai-chet.sh 0</code> rồi <code>ai-chet.sh 1000</code>', 'ai chết ở mỗi lần, và vì sao bản dựng "vô tội" ở lần đầu'],
      ['Trên VPS thí nghiệm: <code>systemd-run</code> với <code>MemorySwapMax=0</code> rồi <code>512M</code>; chạy <code>doc-lai.js 200/400</code>', 'hai con số ms của MÁY BẠN + si/so trong vmstat'],
      ['Dựng ext4 64 MB trên loop: làm đầy khối, tệp xoá còn mở, cạn inode', 'một lệnh chẩn đoán cho mỗi ca'],
      ['Compose 4 dịch vụ có <code>mem_limit</code> + <code>logging</code>; <code>docker stats</code>; điền bảng ngân sách cho VPS của nhóm', 'tổng trần + chỗ cho bản thứ hai lúc tráo ≤ RAM'],
    ])}
    ${box('good', '<b>Đạt khi:</b> có số đo của chính máy bạn cho 137 / 0, ms trong RAM và khi tràn swap, ba ca đĩa đầy; giải thích được vì sao build thoát 0 mà CSDL chết — và <code>docker ps -a --filter label=dvhoc=08</code> rỗng.')}` },
].map((s) => (s.kind === 'cover' ? s : { ...s, body: FIX + s.body })));
