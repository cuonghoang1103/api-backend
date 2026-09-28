/**
 * Linux & Bash · Deck lx-04 — Chương 4: Quyền, người dùng & sudo.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 28/09/2026:
 *   • "Ubuntu"  = container ubuntu:24.04 (bash 5.2.21, coreutils 9.4, sudo 1.9.15p5, acl, arm64) trên Mac M1,
 *                 máy tên `lab`, người dùng an(1000) · alice(1001) · bob(1002) · deploy(1003), nhóm developers.
 *                 Lệnh "đăng nhập" chạy qua `su`/`su -` ⇒ đi qua PAM như SSH (vì vậy umask = 0002, xem slide 10 và bài 4.2).
 *   • "Fedora"  = máy linux-nha (Fedora 44, SELinux Enforcing), chỉ lệnh đọc.
 *   • "Mac"     = Mac M1, macOS 27, zsh 5.9, công cụ BSD; ACL thử trên file trong thư mục scratch.
 *
 * Hình tự vẽ (SVG nội tuyến, không đụng thư viện): kernelCheck() — luồng kiểm quyền của nhân (EUID → chủ? → nhóm?
 * → khác); pathWalk() — đi dọc /srv/app/config/db.yml, gãy ở app; umaskSvg() — mặt nạ gỡ bit (và bẫy 033);
 * uidSvg() — UID thật / UID hiệu lực khi chạy passwd; annot() — chép từ lx-01 để chú thích một dòng.
 */
import { S, cover, sh, perms, term, mindmap, diagram, cards, box, steps, table, vs, two, list, sv, R, T, A, D, esc } from './_lx-chung.mjs';

export const deck = { key: 'lx-04', code: 'LINUX · CHƯƠNG 4', title: 'Quyền, người dùng &amp; sudo', sub: 'Linux & Bash · Chương 4' };

const MONO = 'SF Mono,Menlo,monospace';
const c = (k) => D[k] || k;

/** annot(str, segs) — một dòng chữ đơn cách, dưới mỗi đoạn [from,to) một ngoặc màu + nhãn 2 dòng (chép từ lx-01). */
const annot = (str, segs, { fs = 40, w = 1150, rowH = 64, y0 = 56, h } = {}) => {
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

/** Slide 4 — nhân chọn MỘT lớp: EUID 0? → chủ? → nhóm? → khác. */
const kernelCheck = () => {
  const Dm = (x, y, w, t, d, col) => R(x, y, w, 62, { c: col, fill: '#111812', r: 31 }) +
    T(x + w / 2, y + 27, t, { fs: 17, a: 'middle', b: true, mono: true }) + T(x + w / 2, y + 49, d, { fs: 13.5, a: 'middle', c: 'mu' });
  const Bx = (x, y, w, t, d, col) => R(x, y, w, 62, { c: col, fill: 'rgba(255,255,255,.03)', r: 10 }) +
    T(x + w / 2, y + 26, t, { fs: 17, a: 'middle', b: true, c: col }) + T(x + w / 2, y + 48, d, { fs: 13.5, a: 'middle', c: 'mu' });
  let s = '';
  s += R(0, 8, 196, 70, { c: 'vio', r: 10 }) + T(98, 36, 'tiến trình gọi open()', { fs: 15, a: 'middle', b: true }) + T(98, 58, 'EUID + danh sách nhóm', { fs: 13.5, a: 'middle', c: 'mu' });
  s += A(196, 43, 246, 43, { c: 'mu' });
  s += Dm(250, 12, 200, 'EUID = 0 ?', 'root', 'red');
  s += A(450, 43, 526, 43, { c: 'mu' }) + Dm(530, 12, 230, 'EUID = UID chủ ?', 'là chủ file', 'lx');
  s += A(760, 43, 836, 43, { c: 'mu' }) + Dm(840, 12, 300, 'GID file ∈ nhóm mình ?', 'thuộc nhóm của file', 'grn');
  s += T(488, 32, 'không', { fs: 13, c: 'mu', a: 'middle' }) + T(798, 32, 'không', { fs: 13, c: 'mu', a: 'middle' });
  // nhánh "có"
  s += A(350, 74, 350, 150, { c: 'red' }) + T(360, 118, 'có', { fs: 14, c: 'red', b: true });
  s += A(645, 74, 645, 150, { c: 'lx' }) + T(655, 118, 'có', { fs: 14, c: 'lx', b: true });
  s += A(990, 74, 990, 150, { c: 'grn' }) + T(1000, 118, 'có', { fs: 14, c: 'grn', b: true });
  s += Bx(240, 154, 220, 'BỎ QUA bit rwx', '(x trên file: cần ≥1 bit x)', 'red');
  s += Bx(535, 154, 220, 'chỉ xét bit CHỦ', 'rwx ở cột 2–4 — DỪNG', 'lx');
  s += Bx(880, 154, 220, 'chỉ xét bit NHÓM', 'cột 5–7 — DỪNG', 'grn');
  // nhánh "không" cuối → other
  s += `<path d="M1140 43 L1152 43 L1152 263 L1104 263" stroke="${D.mu}" stroke-width="3" fill="none" marker-end="url(#m-mu)"/>`;
  s += T(1144, 150, 'không', { fs: 13, c: 'mu', a: 'end' });
  s += Bx(880, 232, 220, 'chỉ xét bit KHÁC', 'cột 8–10', 'blu');
  // kết luận
  s += R(0, 330, 1160, 66, { c: 'bd', fill: '#050806', r: 12, sw: 2 });
  s += T(22, 358, 'Ví dụ thật:', { fs: 16, c: 'lx', b: true }) + T(122, 358, '-r--rwxrwx an an note.txt  ·  an ghi vào  →  bash: note.txt: Permission denied', { fs: 16, mono: true });
  s += T(22, 384, 'an là CHỦ ⇒ chỉ đọc cột r-- — nhóm/khác có rwx cũng không “cộng” vào. Quyền KHÔNG cộng dồn.', { fs: 15.5, c: 'mu' });
  return sv(1160, 400, s);
};

/** Slide 7 — đi dọc đường dẫn: mỗi thư mục là một cửa cần x. */
const pathWalk = () => {
  const parts = [
    ['/', 'drwxr-xr-x root', 'khác: r-x ✓', 'grn'],
    ['srv', 'drwxr-xr-x root', 'khác: r-x ✓', 'grn'],
    ['app', 'drwxr-x--- an an', 'khác: --- ✗', 'red'],
    ['config', 'drwxr-xr-x an', 'không tới được', 'dim'],
    ['db.yml', '-rw-r--r-- an', 'không tới được', 'dim'],
  ];
  let s = '';
  parts.forEach(([n, m, v, col], i) => {
    const x = i * 232;
    s += R(x, 20, 200, 110, { c: col, fill: col === 'red' ? 'rgba(255,92,108,.10)' : '#111812', dash: col === 'dim' });
    s += T(x + 100, 54, n, { fs: 22, a: 'middle', b: true, mono: true, c: col === 'dim' ? 'mu' : '#fff' });
    s += T(x + 100, 84, m, { fs: 14, a: 'middle', mono: true, c: 'mu' });
    s += T(x + 100, 112, v, { fs: 15, a: 'middle', b: true, c: col === 'dim' ? 'dim' : col });
    if (i < parts.length - 1) s += A(x + 200, 75, x + 230, 75, { c: i < 2 ? 'grn' : 'dim', dash: i >= 2 });
  });
  s += T(580, 162, 'www-data (uid 33) không phải an, không thuộc nhóm an ⇒ lớp KHÁC ⇒ cửa app đóng', { fs: 16, a: 'middle', c: 'red', b: true });
  return sv(1160, 175, s);
};

/** Slide 12 — umask là mặt nạ gỡ bit. */
const umaskSvg = () => {
  const Row = (y, lab, bits, col, note, hl = []) => {
    let s = T(0, y + 30, lab, { fs: 16, c: col, b: true });
    [...bits].forEach((b, i) => {
      const x = 150 + i * 44 + Math.floor(i / 3) * 16;
      const on = b !== '-';
      s += R(x, y, 38, 44, { c: hl.includes(i) ? 'red' : col, fill: on ? 'rgba(255,255,255,.05)' : '#0a0f0c', r: 6, sw: 2, dash: !on });
      s += T(x + 19, y + 30, b, { fs: 20, a: 'middle', mono: true, b: true, c: on ? '#fff' : 'dim' });
    });
    return s + T(590, y + 29, note, { fs: 15, c: 'mu' });
  };
  let s = '';
  s += Row(0, 'chương trình xin', 'rw-rw-rw-', 'blu', '666 — file mới KHÔNG BAO GIỜ được xin x');
  s += Row(58, 'umask 022', '----w--w-', 'red', 'các bit sẽ bị GỠ (w của nhóm, w của khác)', [4, 7]);
  s += `<path d="M150 116 L570 116" stroke="${D.mu}" stroke-width="2"/>`;
  s += Row(128, '= kết quả', 'rw-r--r--', 'grn', '644 = 666 AND NOT 022');
  s += R(0, 196, 1160, 116, { c: 'amb', fill: 'rgba(255,194,51,.07)', r: 12, sw: 2 });
  s += T(20, 226, 'Bẫy: umask 033 — tính kiểu phép TRỪ ra 633 (-rw--wx-wx) là SAI', { fs: 17, c: 'amb', b: true });
  s += T(20, 256, 'rw-rw-rw- gỡ bit trong ---wx-wx ⇒ chỉ gỡ được w (x vốn không có) ⇒ rw-r--r-- = 644', { fs: 16, mono: true });
  s += T(20, 290, 'Đo thật trên Ubuntu:  umask 033; touch f → 644   ·   mkdir d → 744 (777 gỡ -wx-wx)', { fs: 15.5, c: 'mu' });
  return sv(1160, 316, s);
};

/** Slide 15 — setuid: UID thật giữ nguyên, UID hiệu lực đổi thành chủ file. */
const uidSvg = () => {
  let s = '';
  s += R(0, 30, 250, 96, { c: 'tea' }) + T(125, 66, 'shell của an', { fs: 19, a: 'middle', b: true }) + T(125, 94, 'UID 1000 · EUID 1000', { fs: 15, a: 'middle', mono: true, c: 'mu' });
  s += A(250, 78, 330, 78, { c: 'lx' }) + T(290, 66, 'execve', { fs: 13.5, a: 'middle', c: 'lx', mono: true });
  s += R(334, 12, 330, 132, { c: 'lx', fill: 'rgba(245,183,0,.08)' });
  s += T(499, 44, '/usr/bin/passwd', { fs: 19, a: 'middle', b: true, mono: true });
  s += T(499, 72, '-rwsr-xr-x root root', { fs: 16, a: 'middle', mono: true, c: 'lx' });
  s += T(499, 100, 'nhân thấy bit s ⇒ EUID := chủ file', { fs: 14.5, a: 'middle', c: 'mu' });
  s += T(499, 124, 'UID thật giữ nguyên = 1000', { fs: 14.5, a: 'middle', c: 'mu' });
  s += A(664, 78, 744, 78, { c: 'red' });
  s += R(748, 30, 412, 96, { c: 'red', fill: 'rgba(255,92,108,.08)' });
  s += T(954, 64, 'tiến trình passwd', { fs: 19, a: 'middle', b: true }) + T(954, 92, 'UID 1000 (ai gọi) · EUID 0 (quyền)', { fs: 15, a: 'middle', mono: true, c: 'mu' });
  s += T(954, 116, '→ ghi được /etc/shadow, chỉ dòng của an', { fs: 14, a: 'middle', c: 'red' });
  return sv(1160, 150, s);
};

/** Nhãn dưới ô LOẠI của perms() (“thư mục”) không được xuống dòng. */
const FIX = '<style>.l-pm .gp .oc{white-space:nowrap}</style>';

export const slides = S([
  cover({ t: 'Chương 4 — Quyền, người dùng &amp; sudo', sub: 'rwx và bát phân · chmod/chown/umask · setuid, setgid, bit dính, ACL · tài khoản, nhóm, sudoers · chẩn đoán “Permission denied”', chap: 'CHƯƠNG 4' }),

  { t: 'Bản đồ chương: đọc quyền, đổi quyền, và biết ai đang hỏi', body: mindmap('Quyền', 'ai · được làm gì · với cái gì', [
    { t: '4.1 Mô hình rwx', d: '10 ký tự · một lớp duy nhất · rwx trên thư mục · namei', c: 'lx' },
    { t: '4.2 chmod · chown · umask', d: 'hệ tám vs ký hiệu · X hoa · mặt nạ gỡ bit', c: 'grn' },
    { t: '4.3 Bit đặc biệt + ACL', d: 'setuid · setgid · sticky · setfacl/getfacl', c: 'amb' },
    { t: '4.4 Người dùng &amp; sudo', d: 'passwd/shadow/group · -aG · sudoers · visudo', c: 'blu' },
    { t: '4.5 Chẩn đoán', d: 'id → namei → sudo -u → không phải quyền? → MAC', c: 'red' },
    { t: 'macOS · Fedora', d: 'chmod +a · ls -le · dscl · ls -Z SELinux', c: 'vio' },
  ]) },

  /* ───────────── 4.1 ───────────── */
  { t: 'Mười ký tự: 1 loại + 3 lớp × rwx, mỗi lớp là một chữ số hệ tám', body: `
    ${perms('-rwxr-xr--', { raw: '-rwxr-xr-- 1 an an 15 Sep 28 09:29 deploy.sh' })}
    ${two(
      table(['Chữ', 'Số', 'Hay gặp'], [
        ['<code>r</code> đọc', '4', '<code>644</code> rw-r--r-- file thường'],
        ['<code>w</code> ghi', '2', '<code>755</code> rwxr-xr-x script, thư mục'],
        ['<code>x</code> chạy / đi qua', '1', '!<code>600</code> rw------- khoá, .env'],
        ['<code>-</code> không có', '0', '!<code>700</code> rwx------ ~/.ssh'],
      ], { sm: true, center: [1] }),
      term(['$ stat -c "%A %a %U:%G %n" deploy.sh', '-rwxr-xr-- 754 an:an deploy.sh', '# 7 = 4+2+1 · 5 = 4+0+1 · 4 = 4+0+0'], { title: 'Ubuntu 24.04 — stat in luôn số hệ tám', dir: '~/thu-linux/ch4' }), 'l')}` },

  { t: 'Nhân chỉ chọn MỘT lớp — lớp khớp đầu tiên, không cộng dồn', body: kernelCheck() },

  { t: 'Trên THƯ MỤC, rwx là quyền trên danh sách tên', body: two(
    `${perms('d--x------', { raw: 'd--x------ 2 an an 4096 secret' })}
    ${term(['$ ls secret', '! ls: cannot open directory \'secret\': Permission denied', '$ cat secret/key.txt', '= hunter2', '# có x, không có r: vào được, KHÔNG liệt kê được'], { title: 'Ubuntu 24.04 — output thật', dir: '~/thu-linux/ch4' })}`,
    table(['Bit', 'Trên file', 'Trên thư mục'], [
      ['<code>r</code>', 'đọc nội dung', 'liệt kê TÊN (<code>ls</code>)'],
      ['<code>w</code>', 'sửa nội dung', '!tạo · XOÁ · đổi tên mục bên trong'],
      ['<code>x</code>', 'chạy như chương trình', '!đi xuyên qua: <code>cd</code>, và mọi đường dẫn qua nó'],
    ], { sm: true }) + box('tip', 'Ubuntu 24.04 tạo nhà mới với <code>HOME_MODE 0750</code>: <code>drwxr-x--- an an /home/an</code> ⇒ nginx (<code>www-data</code>) không đi qua được thư mục nhà của bạn.'), 'r') },

  { t: 'Xoá file là sửa THƯ MỤC: file chỉ-đọc của root vẫn mất', body: `
    ${diagram({ w: 1160, h: 200, nodes: [
      { id: 'd', x: 0, y: 40, w: 300, h: 110, t: 'thư mục . (của an)', d: 'drwxr-xr-x an an\nbảng: notes.txt → inode 812', c: 'grn', mono: true },
      { id: 'f', x: 860, y: 40, w: 300, h: 110, t: 'inode 812', d: '-r--r--r-- root root\nnội dung “x”', c: 'red', mono: true },
      { id: 'r', x: 440, y: 55, w: 280, h: 80, t: 'rm notes.txt = unlink()', d: 'gạch một dòng trong BẢNG', c: 'lx' },
    ], edges: [{ from: 'r', to: 'd', c: 'grn', t: 'cần w ✓' }, { from: 'r', to: 'f', c: 'dim', dash: true, t: 'không hỏi' }] })}
    ${two(
      term(['$ ls -l notes.txt; ls -ld .', '-r--r--r-- 1 root root    2 Sep 28 09:29 notes.txt', 'drwxr-xr-x 3 an   an   4096 Sep 28 09:29 .', '$ rm -f notes.txt; echo $?', '= 0', '$ ls notes.txt', "! ls: cannot access 'notes.txt': No such file or directory"], { title: 'Ubuntu — an xoá file của root', dir: '~/thu-linux/ch4' }),
      box('warn', '“Để file cấu hình chỉ-đọc cho an toàn” không chặn được ai có <b>w trên thư mục</b>: họ xoá rồi tạo file mới cùng tên. Muốn chặn thật: siết thư mục, bit dính (4.3) hoặc <code>chattr +i</code> (4.5).'), 'l')}` },

  { t: 'Mọi thư mục trên đường dẫn cần x — namei -l chỉ ra chỗ gãy', body: `
    ${pathWalk()}
    ${two(
      term(['$ namei -l /srv/app/config/db.yml', 'f: /srv/app/config/db.yml', 'drwxr-xr-x root root /', 'drwxr-xr-x root root srv', '+ drwxr-x--- an   an   app', 'drwxr-xr-x an   an   config', '-rw-r--r-- an   an   db.yml', '$ su -s /bin/bash www-data -c "cat /srv/app/config/db.yml"', '! cat: /srv/app/config/db.yml: Permission denied'], { title: 'Ubuntu 24.04 — output thật', fs: 14 }),
      box('bad', 'File cuối <code>644</code> — ai cũng đọc được — mà vẫn bị từ chối. Mọi <code>chmod</code> lên <code>db.yml</code> đều VÔ ÍCH; cửa hỏng là <code>app</code>. Năm phép kiểm, cùng một câu báo lỗi.'), 'l')}` },

  /* ───────────── 4.2 ───────────── */
  { t: 'chmod: ký hiệu chỉnh vài bit, hệ tám đặt lại cả 9 bit', body: `
    ${annot('chmod u=rw,g=r,o= config.yml', [
      { from: 6, to: 10, t: 'AI · PHÉP · QUYỀN', d: 'u (chủ) · = (đặt đúng) · rw', c: 'lx' },
      { from: 10, to: 17, t: 'thêm mệnh đề', d: 'g=r · o= (rỗng)', c: 'blu' },
      { from: 18, to: 28, t: 'file', d: '→ rw-r----- = 640', c: 'tea' },
    ], { fs: 38 })}
    ${two(
      `${sh([
        ['chmod 600 ~/.ssh/id_ed25519', 'tuyệt đối — bí mật'],
        ['chmod u+x deploy.sh', 'chỉ thêm x cho chủ'],
        ['chmod g-w,o= shared.txt', 'bỏ w nhóm, khác rỗng'],
        ['chmod --reference=a.txt b.txt', 'chép chế độ file khác'],
        ['chmod -v 640 app.log', 'in mỗi thay đổi'],
      ], { fs: 14.5 })}
      ${table(['ai', 'phép', 'quyền'], [['<code>u</code> <code>g</code> <code>o</code> <code>a</code>', '<code>+</code> thêm · <code>-</code> bỏ · <code>=</code> đặt', '<code>r w x X s t</code>']], { sm: true })}`,
      term(['$ umask 077', '$ touch p; chmod +x p; ls -l p', '-rwx------ 1 an an 0 p', '$ chmod a+x p; ls -l p', '+ -rwx--x--x 1 an an 0 p', '# +x không ghi “ai” ⇒ còn tuỳ umask', '# a+x thì bỏ qua umask'], { title: 'Ubuntu — +x khác a+x', dir: '~/thu-linux/ch4', fs: 14 }), 'l')}` },

  { t: 'chmod -R 755 làm .env chạy được — X hoa không chữa nổi', body: two(
    term(['$ find . -printf "%M %p\\n"      # TRƯỚC', '-rw------- ./.env', 'drwx------ ./config', '-rwxr-xr-x ./deploy.sh', '-rw-r--r-- ./package.json', '$ chmod -R 755 . ; find . -printf "%M %p\\n"', '! -rwxr-xr-x ./.env', '! -rwxr-xr-x ./package.json', '$ chmod -R u=rwX,go=rX . ; find …   # chữa?', '! -rwxr-xr-x ./.env           ← X thấy đã có x ⇒ GIỮ', '$ find . -type f -exec chmod 644 {} + ; chmod +x deploy.sh', '= -rw-r--r-- ./.env  ·  -rwxr-xr-x ./deploy.sh'], { title: 'Ubuntu 24.04 — dựng lại trong ~/thu-linux/ch4/app2', fs: 13.5 }),
    `${table(['Cách', 'Thư mục', 'File thường', 'Script'], [
      ['-<code>chmod -R 755</code>', '755', '-755 ✗', '755'],
      ['+<code>chmod -R u=rwX,go=rX</code>', '755', '644', 'giữ x ✓'],
      ['+<code>find -type d / -type f</code>', '755', '644', '-mất x ⇒ +x lại'],
    ], { sm: true })}
    ${box('warn', '<b>X hoa</b> = x chỉ cho thư mục và file ĐÃ có x. Chạy nó TRƯỚC khi lỡ tay thì hoàn hảo; chạy SAU <code>755</code> thì mọi file đã “có x” ⇒ vô dụng. Để ý luôn: <code>go=rX</code> mở <code>.env</code> 600 thành 644.')}`, 'l') },

  { t: 'umask là MẶT NẠ gỡ bit — không phải phép trừ', body: `
    ${umaskSvg()}
    ${two(
      term(['$ for m in 022 077 002 027; do (umask $m; touch f$m; mkdir d$m); done', '$ stat -c "%a %n" f* d*', '664 f002   644 f022   640 f027   600 f077', '775 d002   755 d022   750 d027   700 d077'], { title: 'Ubuntu — bốn mặt nạ hay dùng', fs: 14 }),
      box('info', '<code>umask</code> thuộc từng TIẾN TRÌNH, con thừa kế cha. Dịch vụ systemd: <code>UMask=0027</code> trong unit. Chỉ xem: <code>umask -S</code> → <code>u=rwx,g=rx,o=rx</code>.'), 'l')}` },

  { t: 'Đổi chủ cần root; đổi nhóm chỉ sang nhóm mình đang ở', body: two(
    term(['$ id -Gn', 'an developers', '$ chown alice bao-cao.txt', "! chown: changing ownership of 'bao-cao.txt': Operation not permitted", '$ chgrp developers bao-cao.txt; echo $?', '= 0', '$ chgrp www-data bao-cao.txt', "! chgrp: changing group of 'bao-cao.txt': Operation not permitted", '$ sudo chown -v alice:developers bao-cao.txt', "+ changed ownership of 'bao-cao.txt' from an:developers to alice:developers"], { title: 'Ubuntu 24.04 — người dùng an, output thật', dir: '~/thu-linux/ch4', fs: 14 }),
    `${table(['Cú pháp', 'Đổi gì'], [
      ['<code>chown alice f</code>', 'chủ'],
      ['<code>chown alice:dev f</code>', 'chủ + nhóm'],
      ['<code>chown :dev f</code> = <code>chgrp dev f</code>', 'chỉ nhóm'],
      ['<code>chown -R deploy: /srv/app</code>', 'chủ + nhóm CHÍNH của deploy, cả cây'],
      ['<code>chown -c</code> / <code>-v</code>', 'in khi có đổi / in mọi file'],
      ['<code>chown -h link</code>', 'đổi chính symlink, không đổi đích'],
    ], { sm: true })}
    ${box('tip', 'Lỗi chủ quyền báo <b>Operation not permitted</b> (EPERM), không phải <b>Permission denied</b> (EACCES) — hai câu khác nhau chỉ hai nguyên nhân khác nhau (4.5).')}`, 'l') },

  { t: 'SSH bỏ qua khoá riêng mà người khác đọc được', body: two(
    term(['$ chmod 644 ~/.ssh/id_ed25519', '$ ssh-keygen -y -f ~/.ssh/id_ed25519', '! @         WARNING: UNPROTECTED PRIVATE KEY FILE!          @', "! Permissions 0644 for '/home/an/.ssh/id_ed25519' are too open.", '! This private key will be ignored.', '! Load key "/home/an/.ssh/id_ed25519": bad permissions', '$ chmod 600 ~/.ssh/id_ed25519; chmod 700 ~/.ssh', '$ stat -c "%a %n" ~/.ssh ~/.ssh/*', '= 700 /home/an/.ssh', '= 600 /home/an/.ssh/id_ed25519', '644 /home/an/.ssh/id_ed25519.pub'], { title: 'Ubuntu 24.04 — ssh-keygen kiểm quyền y như ssh', fs: 14 }),
    `${table(['Đường dẫn', 'Số', 'Vì sao'], [
      ['!<code>~/.ssh/</code>', '700', 'không ai khác vào được'],
      ['!<code>id_ed25519</code>', '600', 'bất kỳ bit nào cho nhóm/khác ⇒ bị bỏ'],
      ['<code>id_ed25519.pub</code>', '644', 'khoá công khai, ai đọc cũng được'],
      ['<code>authorized_keys</code>', '600', 'sshd máy chủ đòi chủ ghi được một mình'],
    ], { sm: true })}
    ${box('info', '<code>640</code> cũng bị từ chối — OpenSSH kiểm <code>mode &amp; 077</code>, nghĩa là KHÔNG một bit nào cho nhóm hay khác.')}`, 'l') },

  /* ───────────── 4.3 ───────────── */
  { t: 'setuid: passwd chạy với EUID của chủ file (root)', body: `
    ${uidSvg()}
    ${two(
      term(['$ ls -l /usr/bin/passwd', '+ -rwsr-xr-x 1 root root 72056 May 30  2024 /usr/bin/passwd', '$ su an -c /tmp/id2        # bản sao của id, chmod 4755', '+ uid=1000(an) gid=1000(an) euid=0(root) groups=…', '$ su an -c /tmp/ai.sh      # SCRIPT, cũng chmod 4755', '1000', '# script: Linux BỎ QUA bit setuid'], { title: 'Ubuntu 24.04 — output thật', fs: 14 }),
      box('warn', 'Sự an toàn nằm trong CODE của <code>passwd</code> (chỉ sửa dòng của người gọi), không nằm trong hệ thống quyền. Một chương trình setuid-root có lỗi ⇒ người dùng thường thành root.'), 'l')}` },

  { t: 'setgid trên thư mục: file mới theo nhóm của THƯ MỤC', body: `
    ${perms('drwxrwsr-x', { raw: 'drwxrwsr-x root developers /srv/shared' })}
    ${two(sh([['sudo mkdir /srv/shared', ''], ['sudo chgrp developers /srv/shared', 'nhóm của đội'], ['sudo chmod 2775 /srv/shared', '2 = setgid'], ['umask 002', 'nhóm GHI được file mới']], { fs: 14.5 }),
      term(['$ su alice -c "touch tu-alice.txt; mkdir docs"', '$ su an -c "touch tu-an.txt"', '$ ls -l', '+ drwxrwsr-x 2 alice developers 4096 docs', '# ↑ thư mục con cũng tự mang s', '= -rw-rw-r-- 1 alice developers    0 tu-alice.txt', '= -rw-rw-r-- 1 an    developers    0 tu-an.txt', '# /srv/nosg KHÔNG setgid, cùng lệnh:', '! -rw-rw-r-- 1 alice alice 0 a.txt', '# ↑ nhóm riêng của alice — bob không ghi được'], { title: 'Ubuntu 24.04 — trong /srv/shared', dir: '', fs: 13 }), 'r')}` },

  { t: 'Bit dính: /tmp ai cũng ghi, nhưng chỉ xoá được file của mình', body: `
    ${perms('drwxrwxrwt', { raw: 'drwxrwxrwt root root /tmp' })}
    ${two(box('info', 'Luật thêm của bit <b>t</b>: gỡ/đổi tên một mục chỉ khi bạn là chủ MỤC đó, chủ THƯ MỤC, hoặc root. Thư mục cả thế giới ghi được ⇒ luôn <code>1777</code>, không bao giờ <code>777</code>.'),
      term(['$ chmod 1777 .; ls -ld .', 'drwxrwxrwt 2 root root 4096 Sep 28 09:31 .', '$ su alice -c "echo a > cua-alice.txt"', '$ su bob -c "rm cua-alice.txt"', "! rm: cannot remove 'cua-alice.txt': Operation not permitted", '$ chmod -t .', '$ su bob -c "rm -f cua-alice.txt"; echo $?', '! 0', '# ↑ bỏ t: bob xoá được file của alice'], { title: 'Ubuntu 24.04 — trong /srv/scratch', dir: '', fs: 13 }), 'r')}` },

  { t: 's/S, t/T — và chmod 775 KHÔNG gỡ setgid của thư mục', body: two(
    `${table(['Thấy', 'Nghĩa'], [
      ['<code>rws</code> ở ô chủ / nhóm', 'setuid/setgid + có x — bình thường'],
      ['!<code>rwS</code>', 'setuid mà THIẾU x — gần như luôn là gõ nhầm'],
      ['<code>rwt</code> · <code>rwT</code>', 'dính + có x · dính mà thiếu x'],
    ], { sm: true })}
    ${sh([['chmod 4755 prog   # = chmod u+s', 'setuid'], ['chmod 2775 dir    # = chmod g+s', 'setgid'], ['chmod 1777 dir    # = chmod +t', 'dính'], ['chmod g-s dir', 'gỡ setgid (thư mục)'], ['chmod 00775 dir · chmod =775 dir', 'cũng gỡ được']], { fs: 14.5 })}`,
    `${term(['$ ls -ld /srv/shared', 'drwxrwsr-x 3 root developers /srv/shared', '$ chmod 775 /srv/shared; ls -ld /srv/shared', '+ drwxrwsr-x …   ← VẪN còn s (GNU giữ cho thư mục)', '$ chmod 0775 /srv/shared; ls -ld /srv/shared', '+ drwxrwsr-x …   ← vẫn còn', '$ chmod 00775 /srv/shared; ls -ld /srv/shared', '! drwxrwxr-x …   ← giờ mới mất', '$ chmod 755 /tmp/myid     # FILE 4755', '! -rwxr-xr-x … /tmp/myid  ← file thì 3 chữ số gỡ ngay'], { title: 'Ubuntu 24.04 (coreutils 9.4) — output thật', fs: 13.5 })}
    ${box('warn', 'chmod(1): “For directories chmod preserves set-user-ID and set-group-ID bits unless you explicitly specify otherwise”. Bit dính thì KHÔNG được giữ: <code>chmod 777</code> gỡ <code>t</code>.')}`, 'l') },

  { t: 'ACL: cấp cho đúng MỘT người, không đổi chủ hay nhóm', body: two(
    term(['$ ls -ld uploads', 'drwxr-x--- 2 an an 4096 uploads', '$ su -s /bin/bash www-data -c "touch uploads/t.txt"', "! touch: cannot touch 'uploads/t.txt': Permission denied", '$ setfacl -m u:www-data:rwx uploads; ls -ld uploads', '+ drwxrwx---+ 2 an an 4096 uploads    ← dấu + = có ACL', '$ getfacl -c uploads', 'user::rwx', '+ user:www-data:rwx', 'group::r-x', '+ mask::rwx', 'other::---', '$ chmod 750 uploads; getfacl -c uploads | sed -n 2,4p', '! user:www-data:rwx	#effective:r-x    ← chmod sửa MASK'], { title: 'Ubuntu 24.04 (gói acl) — output thật', fs: 13.5 }),
    `${table(['', 'Bit rwx', 'ACL POSIX'], [
      ['Chủ thể', '1 chủ · 1 nhóm · khác', '+bao nhiêu user/nhóm tuỳ ý'],
      ['Đọc', '<code>ls -l</code>, <code>stat</code>', '<code>getfacl</code> (thấy <code>+</code> ở ls)'],
      ['Đặt', '<code>chmod</code>', '<code>setfacl -m</code> · gỡ <code>-x</code> · xoá hết <code>-b</code>'],
      ['File mới kế thừa', 'chỉ qua setgid (nhóm)', '+<code>setfacl -d -m</code> (ACL mặc định)'],
      ['Cột nhóm của ls', 'quyền nhóm', '!là MASK — trần của mọi mục ACL'],
      ['Sao lưu', 'mọi công cụ giữ', '-cần <code>cp -a</code>, <code>tar --acls</code>, <code>rsync -A</code>'],
    ], { sm: true })}`, 'l') },

  { t: 'Máy chủ mới tiếp quản: rà file setuid — capability là lối thay thế', body: two(
    term(['$ find / -xdev -perm -4000 -type f 2>/dev/null | sort', '/usr/bin/chfn', '/usr/bin/chsh', '/usr/bin/gpasswd', '/usr/bin/mount', '/usr/bin/newgrp', '/usr/bin/passwd', '/usr/bin/su', '/usr/bin/sudo', '/usr/bin/umount', '/usr/lib/openssh/ssh-keysign'], { title: 'Ubuntu 24.04 (+ sudo, openssh-client) — output thật', fs: 14 }),
    `${term(['$ getcap -r /usr/bin 2>/dev/null | head -4', '/usr/bin/arping cap_net_raw=p', '/usr/bin/clockdiff cap_net_raw=p', '/usr/bin/newgidmap cap_setgid=ep', '/usr/bin/newuidmap cap_setuid=ep'], { title: 'Fedora 44 — một quyền lẻ thay vì cả root', fs: 14 })}
    ${list(['Lạ trong <code>/tmp</code>, <code>/home</code>, thư mục app ⇒ điều tra: “thả shell setuid-root” là cửa hậu kinh điển.', '<code>-perm -4000</code>: MỌI bit trong 4000 phải bật · <code>-2000</code> cho setgid.', 'Cần một đặc quyền cho một chương trình ⇒ <code>sudo</code> luật hẹp hoặc <code>setcap</code> (Chương 14), đừng tạo setuid.'])}`, 'l') },

  /* ───────────── 4.4 ───────────── */
  { t: '/etc/passwd 7 trường — UID mới là danh tính, tên chỉ là nhãn', body: `
    ${annot('deploy:x:1003:1004:Deploy user:/home/deploy:/bin/bash', [
      { from: 0, to: 6, t: 'tên', d: 'nhãn', c: 'tea' },
      { from: 7, to: 8, t: 'x', d: '→ /etc/shadow', c: 'red' },
      { from: 9, to: 13, t: 'UID', d: 'danh tính thật', c: 'lx' },
      { from: 14, to: 18, t: 'GID', d: 'nhóm CHÍNH', c: 'grn' },
      { from: 19, to: 30, t: 'GECOS', d: 'chú thích', c: 'mu' },
      { from: 31, to: 43, t: 'nhà', d: '$HOME', c: 'blu' },
      { from: 44, to: 53, t: 'shell', d: 'nologin = cấm vào', c: 'vio' },
    ], { fs: 30 })}
    ${two(
      term(["$ awk -F: '$3 == 0' /etc/passwd", 'root:x:0:0:root:/root:/bin/bash      # đúng MỘT dòng', "$ awk -F: '$3 < 1000 {print $1,$3,$7}' /etc/passwd | head -3", 'root 0 /bin/bash', 'daemon 1 /usr/sbin/nologin', 'bin 2 /usr/sbin/nologin', '$ su cuongapp -c id      # useradd -r -s /usr/sbin/nologin', '! This account is currently not available.'], { title: 'Ubuntu 24.04 — output thật', fs: 14 }),
      table(['Dải UID', 'Là ai'], [['!0', 'root — bất kể tên gì'], ['1–999', 'tài khoản hệ thống (dịch vụ)'], ['+1000+', 'người thật (<code>UID_MIN 1000</code>)'], ['65534', 'nobody']], { sm: true }), 'l')}` },

  { t: 'Nhóm CHÍNH ở passwd, nhóm PHỤ ở group — id gộp cả hai', body: two(
    diagram({ w: 560, h: 330, nodes: [
      { id: 'p', x: 0, y: 0, w: 260, h: 90, t: '/etc/passwd', d: 'deploy:…:1003:1004:…\n→ nhóm chính 1004', c: 'blu', mono: true },
      { id: 'g', x: 300, y: 0, w: 260, h: 90, t: '/etc/group', d: 'developers:x:1001:…,deploy\nsudo:x:27:deploy', c: 'grn', mono: true },
      { id: 'i', x: 90, y: 200, w: 380, h: 90, t: 'id deploy', d: 'gid=1004(deploy)\ngroups=1004,27(sudo),1001(developers)', c: 'lx', mono: true },
    ], edges: [{ from: 'p', to: 'i', c: 'blu', fs: 'b', ts: 't' }, { from: 'g', to: 'i', c: 'grn', fs: 'b', ts: 't' }] }),
    `${term(['$ id deploy', 'uid=1003(deploy) gid=1004(deploy) groups=1004(deploy),27(sudo),1001(developers)', '$ getent group developers', 'developers:x:1001:alice,bob,an,deploy', '$ getent shadow deploy | cut -c1-30', 'deploy:$y$j9T$7QoJ0PVYKeDHGab5', '$ passwd -S deploy', 'deploy P 2026-09-28 0 99999 7 -1'], { title: 'Ubuntu 24.04 — output thật', fs: 13.5 })}
    ${box('tip', '<code>getent</code> đọc qua NSS — thấy cả tài khoản LDAP/SSSD mà <code>grep /etc/passwd</code> bỏ sót. <code>passwd -S</code>: <b>P</b> có mật khẩu · <b>L</b> bị khoá · <b>NP</b> không mật khẩu.')}`, 'l') },

  { t: 'usermod -G trần THAY cả danh sách nhóm — luôn -aG', body: two(
    term(['$ id alice', 'uid=1001(alice) gid=1002(alice) groups=1002(alice),1001(developers)', '$ usermod -G docker alice; id alice', '! uid=1001(alice) gid=1002(alice) groups=1002(alice),1005(docker)', '# developers đã BIẾN MẤT — nếu là sudo, bạn vừa tự khoá mình', '$ usermod -aG developers alice; id alice', '= … groups=1002(alice),1001(developers),1005(docker)'], { title: 'Ubuntu 24.04 — output thật', fs: 14 }),
    `${table(['Lệnh', 'Cờ cần nhớ'], [
      ['<code>useradd</code>', '<code>-m</code> tạo nhà · <code>-s</code> shell · <code>-G</code> nhóm phụ · <code>-r</code> hệ thống · <code>-c</code> GECOS'],
      ['<code>adduser</code>', 'Debian/Ubuntu: hỏi đáp, tự tạo nhà'],
      ['<code>usermod</code>', '!<code>-aG</code> THÊM nhóm · <code>-g</code> nhóm chính · <code>-L</code>/<code>-U</code> khoá/mở · <code>-s</code>'],
      ['<code>gpasswd -d u g</code>', 'gỡ khỏi MỘT nhóm'],
      ['<code>userdel -r</code>', 'xoá cả nhà + hộp thư'],
      ['<code>passwd</code> · <code>chage -l</code>', 'đặt mật khẩu · xem tuổi mật khẩu'],
    ], { sm: true })}`, 'l') },

  { t: 'Nhóm mới KHÔNG vào shell đang chạy — chép lúc đăng nhập', body: two(
    `${term(["$ ( su alice -c 'sleep 2; echo shell cũ: $(id -Gn)' ) &", '$ usermod -aG sudo alice; wait', '! shell cũ: alice developers docker', "$ su alice -c 'echo đăng nhập mới: $(id -Gn)'", '= đăng nhập mới: alice sudo developers docker', '$ id -Gn alice', '= alice sudo developers docker'], { title: 'Ubuntu 24.04 — dựng lại thật', fs: 14 })}
    ${term(['$ su alice -c "echo id | newgrp docker"', 'uid=1001(alice) gid=1005(docker) groups=1005(docker),1001(developers),1002(alice)'], { title: 'newgrp: shell con với nhóm chính mới', fs: 13 })}`,
    steps([
      ['<code>id</code> (trần)', 'đọc TIẾN TRÌNH này — danh sách chép lúc đăng nhập'],
      ['<code>id tên</code>', 'đọc FILE <code>/etc/group</code> — thứ bạn vừa sửa'],
      ['Hai cái khác nhau?', 'đăng xuất hẳn (SSH: đóng kết nối, kể cả ControlMaster) hoặc <code>newgrp</code>'],
      ['Dịch vụ systemd?', '<code>systemctl restart</code> — nó cũng mang nhóm cũ'],
    ]), 'l') },

  { t: 'sudo hỏi mật khẩu CỦA BẠN; su hỏi mật khẩu của ĐÍCH', body: two(
    `${table(['Lệnh', 'Làm gì'], [
      ['<code>sudo lệnh</code>', 'MỘT lệnh với quyền root'],
      ['<code>sudo -u postgres psql</code>', 'chạy như user khác'],
      ['<code>sudo -i</code>', 'shell đăng nhập root (môi trường root)'],
      ['<code>sudo -l</code>', 'tôi được chạy gì?'],
      ['<code>sudo -k</code>', 'quên mật khẩu đang nhớ (15 phút)'],
      ['<code>sudo -n</code>', 'không hỏi — hỏng ngay (dùng trong script)'],
      ['-<code>su -</code>', 'cần mật khẩu root — Ubuntu khoá sẵn'],
    ], { sm: true })}
    ${term(['$ passwd -S root', '! root L 2026-09-11 0 99999 7 -1       # L = khoá', '$ su -', '! su: Authentication failure'], { title: 'Ubuntu 24.04', fs: 13.5 })}`,
    term(['$ sudo echo xin chao > /etc/loi-chao', '! -bash: /etc/loi-chao: Permission denied', '# > do SHELL của bạn mở, trước khi sudo chạy', '$ echo xin chao | sudo tee /etc/loi-chao', '= xin chao', '$ sudo -k; sudo -n true', '! sudo: a password is required', "$ sudo cat /etc/shadow        # deploy, luật hẹp", "! Sorry, user deploy is not allowed to execute '/usr/bin/cat /etc/shadow' as root on lab."], { title: 'Ubuntu 24.04 — người dùng deploy', fs: 13.5 }), 'l') },

  { t: 'sudoers: AI · MÁY = (CHẠY NHƯ) LỆNH — kiểm bằng visudo -c', body: `
    ${annot('deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart myapp', [
      { from: 0, to: 6, t: 'ai', d: '%nhóm cho nhóm', c: 'tea' },
      { from: 7, to: 10, t: 'máy', d: 'ALL', c: 'blu' },
      { from: 11, to: 17, t: 'chạy như', d: '(root)', c: 'vio' },
      { from: 18, to: 27, t: 'không hỏi mk', d: 'tuỳ chọn', c: 'amb' },
      { from: 28, to: 60, t: 'đúng lệnh + tham số', d: 'đường dẫn tuyệt đối', c: 'grn' },
    ], { fs: 25 })}
    ${two(
      term(['$ visudo -cf /tmp/bad.rule', '! /tmp/bad.rule:1:39: syntax error', '! deploy ALL=(root) NOPASSWD /usr/bin/id', '!                                       ^', '$ install -m 0440 /tmp/deploy.rule /etc/sudoers.d/deploy', '$ visudo -c', '/etc/sudoers: parsed OK', '/etc/sudoers.d/deploy: parsed OK', '$ sudo -l -U deploy | tail -2', '+     (root) NOPASSWD: /usr/bin/systemctl restart myapp, …', '+     (root) /usr/bin/journalctl'], { title: 'Ubuntu 24.04 (sudo 1.9.15p5) — thiếu dấu “:” sau NOPASSWD', fs: 13 }),
      box('bad', 'Sửa <code>/etc/sudoers</code> bằng trình soạn thảo thường mà sai một ký tự ⇒ <code>sudo</code> từ chối chạy HOÀN TOÀN, kể cả để sửa. Luôn: <code>visudo -f /etc/sudoers.d/tên</code> (file 0440), giữ một terminal root mở, thử luật mới ở terminal khác.'), 'l')}` },

  /* ───────────── 4.5 ───────────── */
  { t: 'Chẩn đoán 6 bước: đọc ra nguyên nhân, đừng vớ sudo', body: sh([
    ['# 1 · AI đang chạy? (dịch vụ không phải bạn)', ''],
    ['id; ps -o user,group,pid,cmd -C nginx', 'worker nginx = www-data'],
    ['# 2 · Cửa nào trên đường dẫn đóng?', ''],
    ['namei -l /srv/app/config/db.yml', 'thường gãy ở GIỮA'],
    ['# 3 · Chứng minh bằng ĐÚNG danh tính', ''],
    ['sudo -u www-data cat /srv/app/config/db.yml', 'KHÔNG thử bằng root'],
    ['# 4 · Không phải bit? chỉ-đọc · bất biến · đầy', ''],
    ['findmnt -O ro; lsattr f; df -h; df -i', 'chmod không chữa được'],
    ['# 5 · Lớp TRÊN các bit (ls -l không thấy)', ''],
    ['sudo dmesg | grep -i apparmor; sudo ausearch -m avc', 'Ubuntu · Fedora'],
    ['# 6 · Sửa MỘT thứ, chạy lại bước 3', ''],
    ['sudo chmod o+x /srv/app', 'không bao giờ chmod -R 777'],
  ], { fs: 16.5 }) },

  { t: 'Thử bằng ĐÚNG danh tính — rồi đọc câu báo lỗi', body: two(
    term(['$ sudo -u www-data touch /srv/web/uploads/test.txt', "! touch: cannot touch '/srv/web/uploads/test.txt': Permission denied", '$ namei -l /srv/web/uploads', 'drwxr-xr-x root   root   /', 'drwxr-xr-x root   root   srv', 'drwxr-xr-x deploy deploy web', '+ drwxr-xr-x deploy deploy uploads   ← khác: r-x, không w', '$ id www-data', 'uid=33(www-data) gid=33(www-data) groups=33(www-data)', '$ sudo chown www-data:www-data /srv/web/uploads', '$ sudo -u www-data touch /srv/web/uploads/test.txt && echo OK', '= OK'], { title: 'Ubuntu 24.04 — output thật', fs: 13.5 }),
    `${table(['Câu báo lỗi', 'errno', 'Thường là'], [
      ['<code>Permission denied</code>', 'EACCES 13', 'bit rwx, thiếu x trên đường, noexec'],
      ['<code>Operation not permitted</code>', 'EPERM 1', 'không phải CHỦ (chown/chmod), bit dính, <code>chattr +i</code>'],
      ['<code>Read-only file system</code>', 'EROFS 30', 'gắn chỉ-đọc — root cũng chịu'],
    ], { sm: true })}
    ${box('warn', 'Bẫy: <code>sudo cat file</code> chạy được ⇒ “quyền ổn”. SAI: root bỏ qua mọi bit rwx, nó chẳng nói gì về www-data.')}`, 'l') },

  { t: 'Chỉ-đọc, bất biến, noexec: chmod vô dụng', body: two(
    term(['$ chattr +i app.conf; lsattr app.conf', '----i----------------- app.conf', '$ echo x >> app.conf        # đang là ROOT', '! bash: app.conf: Operation not permitted', '$ rm app.conf', "! rm: cannot remove 'app.conf': Operation not permitted", '$ chattr -i app.conf && rm app.conf && echo xoá được', '= xoá được', '$ touch /etc/thu            # container --read-only', "! touch: cannot touch '/etc/thu': Read-only file system", '$ findmnt -no TARGET,OPTIONS -T /etc | cut -c1-20', '+ /      ro,relatime'], { title: 'Ubuntu 24.04 — root, output thật', fs: 13.5 }),
    `${term(['$ ls -l /mnt/nx/a.sh', '-rwxr-xr-x 1 root root 20 /mnt/nx/a.sh', '$ /mnt/nx/a.sh; echo $?', '! bash: /mnt/nx/a.sh: Permission denied', '! 126', '$ sh /mnt/nx/a.sh', '+ chay        ← noexec chặn execve, không chặn đọc', '$ mount | grep /mnt/nx', 'tmpfs on /mnt/nx type tmpfs (rw,nosuid,nodev,noexec,…)'], { title: 'Ubuntu — tmpfs gắn noexec', fs: 13.5 })}
    ${box('info', '<code>mount | grep \' ro,\'</code> không bao giờ khớp: tuỳ chọn đầu nằm sau dấu <code>(</code>. Dùng <code>findmnt -O ro</code> hoặc <code>grep \'(ro,\'</code>.')}`, 'l') },

  { t: 'macOS và Fedora khác gì: ACL kiểu NFSv4, dscl, nhãn SELinux', body: two(
    `${term(['$ chmod +a "user:_www allow read" bao-cao.txt', '$ ls -le bao-cao.txt', '-rw-------@ 1 admin wheel 3 bao-cao.txt', '+  0: user:_www allow read', '$ ls -led ~/Desktop', 'drwx------+ 5 admin staff 160 /Users/admin/Desktop', '+  0: group:everyone deny delete', '$ dscl . -read /Users/admin UniqueID PrimaryGroupID', 'PrimaryGroupID: 20', 'UniqueID: 501'], { title: 'Mac M1 (macOS 27) — chỉ đọc + file trong scratch', fs: 13.5 })}`,
    `${term(['$ ls -Z /etc/shadow /usr/bin/passwd', '       system_u:object_r:shadow_t:s0 /etc/shadow', '  system_u:object_r:passwd_exec_t:s0 /usr/bin/passwd', '$ ls -l /etc/shadow', '+ ----------. 1 root root 1325 Sep 19 22:38 /etc/shadow', '$ getenforce', 'Enforcing'], { title: 'Fedora 44 (linux-nha) — dấu . = có nhãn SELinux', fs: 13.5 })}
    ${table(['Việc', 'Ubuntu/Fedora', 'macOS'], [
      ['ACL', '<code>setfacl</code>/<code>getfacl</code>', '<code>chmod +a</code> · <code>ls -le</code>'],
      ['Tài khoản', '<code>useradd</code>, <code>/etc/passwd</code>', '<code>dscl</code> (passwd chỉ cho single-user)'],
      ['Nhóm file mới', 'nhóm chính (trừ setgid)', '!LUÔN nhóm của thư mục cha'],
      ['<code>namei</code>', 'có (util-linux)', '-không có ⇒ vòng <code>ls -ld</code>'],
    ], { sm: true })}`, 'l') },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 4', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['nginx 403/“Permission denied” dù file 644', 'Một thư mục trên đường thiếu x (nhà 750)', '<code>namei -l</code> → <code>chmod o+x</code> đúng thư mục đó'],
    ['Sau <code>chmod -R 755</code>, <code>.env</code> chạy được', '<code>-R</code> không phân biệt file/thư mục', '<code>find -type f … 644</code> rồi <code>+x</code> lại script'],
    ['Đồng đội không sửa được file trong thư mục chung', 'Thiếu setgid hoặc umask 022', '<code>chgrp</code> + <code>2775</code> + <code>umask 002</code>'],
    ['<code>usermod -G docker</code> xong mất sudo', '<code>-G</code> trần THAY cả danh sách', 'Luôn <code>-aG</code>; khôi phục từ tài khoản sudo khác'],
    ['Đã vào nhóm docker mà vẫn bị từ chối', 'Shell mang nhóm chép lúc đăng nhập', 'Đăng xuất hẳn / <code>newgrp docker</code>'],
    ['<code>sudo echo … &gt; /etc/x</code> báo Permission denied', 'Chuyển hướng do shell của bạn làm', '<code>… | sudo tee /etc/x</code>'],
    ['Khoá SSH “bad permissions”', 'Khoá riêng có bit cho nhóm/khác', '<code>chmod 600</code> khoá, <code>700 ~/.ssh</code>'],
    ['Root cũng “Operation not permitted”', '<code>chattr +i</code>, chỉ-đọc, thiếu capability', '<code>lsattr</code> · <code>findmnt -O ro</code>'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 4 (1/2): đọc và đổi quyền', body: two(
    sh([
      ['ls -l f · ls -ld dir', 'quyền của file / CHÍNH thư mục'],
      ['stat -c "%A %a %U:%G %n" f', 'ký hiệu + số + chủ'],
      ['namei -l /đường/dẫn', 'quyền MỌI thành phần'],
      ['chmod 640 f · chmod u+x,g-w f', 'hệ tám · ký hiệu'],
      ['chmod -R u=rwX,go=rX dir', 'cây: x chỉ cho thư mục'],
      ['find d -type f -exec chmod 644 {} +', 'chỉ file thường'],
      ['chown -R user:group dir', 'đổi chủ (cần root)'],
      ['chgrp dev f', 'đổi nhóm (nhóm mình thuộc)'],
      ['umask · umask -S · umask 027', 'xem · ký hiệu · đặt'],
    ], { fs: 15 }),
    sh([
      ['chmod u+s · g+s · +t', 'setuid · setgid · dính'],
      ['chmod 2775 dir · chmod g-s dir', 'đặt / gỡ setgid'],
      ['find / -xdev -perm -4000 -type f', 'rà file setuid'],
      ['setfacl -m u:www-data:rx dir', 'thêm một người'],
      ['setfacl -d -m g:dev:rwX dir', 'ACL mặc định (kế thừa)'],
      ['getfacl -c f · setfacl -b f', 'đọc · xoá mọi ACL'],
      ['lsattr f · chattr +i f', 'thuộc tính · bất biến'],
      ['getcap -r /usr/bin', 'file có capability'],
      ['chmod +a "…" f · ls -le', 'ACL trên macOS'],
    ], { fs: 15 })) },

  { t: 'Bảng tra nhanh Chương 4 (2/2): người dùng, sudo, chẩn đoán', body: two(
    sh([
      ['id · id tên · id -Gn', 'tiến trình · file · tên nhóm'],
      ['getent passwd tên · getent group g', 'tra qua NSS'],
      ["awk -F: '$3==0' /etc/passwd", 'ai có UID 0'],
      ['useradd -m -s /bin/bash tên', 'người thật'],
      ['useradd -r -s /usr/sbin/nologin app', 'tài khoản dịch vụ'],
      ['usermod -aG nhóm tên', 'THÊM nhóm phụ'],
      ['gpasswd -d tên nhóm · userdel -r', 'gỡ nhóm · xoá'],
      ['passwd tên · passwd -S · chage -l', 'mật khẩu · trạng thái'],
    ], { fs: 15 }),
    sh([
      ['sudo -l · sudo -l -U deploy', 'được chạy gì'],
      ['sudo -u www-data lệnh', 'thử bằng ĐÚNG danh tính'],
      ['sudo -i · sudo -k · sudo -n', 'shell root · quên · không hỏi'],
      ['cmd | sudo tee /etc/f', 'ghi file root'],
      ['visudo -f /etc/sudoers.d/x', 'sửa luật an toàn'],
      ['visudo -c', 'kiểm cú pháp mọi luật'],
      ['newgrp docker', 'shell con với nhóm mới'],
      ['findmnt -O ro · df -i', 'chỉ-đọc · hết inode'],
      ['ls -Z · getenforce · ausearch', 'SELinux (Fedora)'],
    ], { fs: 15 })) },

  { t: 'Thực hành Chương 4 (40 phút): máy chủ của nhóm', body: `
    ${steps([
      ['Container <code>ubuntu:24.04</code> + <code>sudo acl</code>; tạo alice, bob, nhóm developers', 'kiểm: <code>id alice</code>, <code>getent group developers</code>'],
      ['Thư mục chung <code>/srv/shared</code>: chgrp + <code>2775</code>; alice tạo file, bob sửa được', '<code>ls -l</code> thấy nhóm developers và <code>-rw-rw-r--</code>'],
      ['Dựng <code>/srv/app</code> 750 của alice; www-data đọc <code>config/db.yml</code> hỏng', 'tìm cửa gãy bằng <code>namei -l</code>, sửa bằng <code>setfacl -m u:www-data:x</code>'],
      ['Tạo <code>deploy</code> + luật sudoers hẹp chỉ cho <code>/usr/bin/id</code>', '<code>visudo -c</code> OK; <code>sudo id</code> được, <code>sudo cat /etc/shadow</code> bị từ chối'],
      ['<code>usermod -G</code> thử trên bob rồi sửa lại bằng <code>-aG</code>', 'so <code>id bob</code> trước/sau'],
    ])}
    ${box('good', '<b>Đạt khi:</b> bob sửa được file của alice trong <code>/srv/shared</code>, <code>sudo -u www-data cat /srv/app/config/db.yml</code> in ra nội dung mà <code>/srv/app</code> vẫn là <code>750</code>, và <code>sudo -l -U deploy</code> in đúng một luật.')}` },
]).map((x) => ({ ...x, body: x.body + FIX }));
