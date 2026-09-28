/**
 * Linux & Bash · Deck lx-02 — Chương 2: File & thư mục.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 28/09/2026:
 *   • "Ubuntu 24.04" = container ubuntu:24.04 (bash 5.2.21, coreutils 9.4, findutils 4.9.0, GNU tar 1.35,
 *                      zstd 1.5.5, xz 5.4.5, gzip 1.12) trên Mac M1, Docker Desktop, 10 CPU — người dùng thường `cuong`
 *   • "macOS"        = Mac M1, macOS 27, zsh 5.9, /bin/bash 3.2.57, công cụ BSD (/usr/bin/find, /bin/cp, bsdtar 3.5.3)
 *   • "Fedora"       = máy linux-nha, Fedora 44 (so thứ tự sắp xếp theo locale)
 * Số inode/giờ trong output là của lần chạy đó — trên máy bạn sẽ khác, quy luật thì không.
 *
 * Hình tự vẽ (SVG nội tuyến, không đụng thư viện): inodeMap(), unlinkMap(), mtimeRuler(), releasesMap().
 */
import { S, cover, sh, term, mindmap, diagram, cards, box, steps, table, vs, kpis, flow, two, list, bars, sv, R, T, A, D } from './_lx-chung.mjs';

export const deck = { key: 'lx-02', code: 'LINUX · CHƯƠNG 2', title: 'File & thư mục', sub: 'Linux & Bash · Chương 2' };

/* ───────────── SVG tự vẽ ───────────── */

/* Slide 6 — rm chỉ gỡ TÊN: mục thư mục → inode → khối dữ liệu */
const unlinkMap = () => sv(560, 400,
  T(0, 22, 'THƯ MỤC ~/thu-linux', { fs: 15, c: 'mu', b: true }) +
  R(0, 34, 230, 50, { c: 'grn', r: 9 }) + T(115, 65, 'notes.txt → …', { fs: 16, a: 'middle', mono: true }) +
  R(0, 96, 230, 50, { c: 'red', r: 9, dash: true }) + T(115, 127, 'bao-cao.txt → 43293', { fs: 16, a: 'middle', mono: true, c: 'red' }) +
  `<line x1="12" y1="121" x2="218" y2="121" stroke="${D.red}" stroke-width="3"/>` +
  T(115, 172, 'rm = unlink(): gạch MỤC này', { fs: 15, a: 'middle', c: 'red', b: true }) +
  A(232, 121, 318, 121, { c: 'red', dash: true }) +
  R(320, 76, 230, 92, { c: 'amb' }) + T(435, 106, 'inode 43293', { fs: 18, a: 'middle', b: true, mono: true }) +
  T(435, 130, 'số liên kết: 1 → 0', { fs: 15, a: 'middle', c: 'amb' }) + T(435, 152, 'được đánh dấu TRỐNG', { fs: 14, a: 'middle', c: 'mu' }) +
  A(435, 170, 435, 232, { c: 'amb' }) +
  R(320, 236, 230, 70, { c: 'dim' }) + T(435, 264, 'khối dữ liệu 19 byte', { fs: 16, a: 'middle' }) + T(435, 288, 'ghi đè bởi file kế tiếp', { fs: 14, a: 'middle', c: 'mu' }) +
  R(0, 330, 550, 60, { c: 'red', fill: 'rgba(255,92,108,.08)' }) +
  T(275, 356, 'Không có bước “chuyển vào Thùng rác” nào cả —', { fs: 16, a: 'middle', b: true }) +
  T(275, 378, 'Thùng rác chỉ là việc của ứng dụng đồ hoạ.', { fs: 15, a: 'middle', c: 'mu' }));

/* Slide 21 — tên file là con trỏ tới inode */
const inodeMap = () => sv(1150, 330,
  T(0, 20, 'MỤC THƯ MỤC (tên → số inode)', { fs: 15, c: 'mu', b: true }) +
  R(0, 34, 300, 56, { c: 'grn', r: 9 }) + T(150, 68, 'report.txt → 41338', { fs: 17, a: 'middle', mono: true }) +
  R(0, 112, 300, 56, { c: 'grn', r: 9 }) + T(150, 146, 'backup.txt → 41338', { fs: 17, a: 'middle', mono: true }) +
  R(0, 216, 300, 56, { c: 'blu', r: 9 }) + T(150, 250, 'shortcut.txt → 43084', { fs: 17, a: 'middle', mono: true }) +
  T(0, 300, 'ln report.txt backup.txt = thêm một TÊN', { fs: 14.5, c: 'grn' }) +
  T(0, 320, 'ln -s report.txt shortcut.txt = thêm một FILE nhỏ', { fs: 14.5, c: 'blu' }) +
  T(430, 20, 'INODE (siêu dữ liệu, KHÔNG có tên)', { fs: 15, c: 'mu', b: true }) +
  R(430, 44, 330, 112, { c: 'amb' }) + T(595, 76, 'inode 41338', { fs: 19, a: 'middle', b: true, mono: true }) +
  T(595, 102, 'loại: file thường · 6 byte', { fs: 15, a: 'middle', c: 'mu' }) + T(595, 126, 'số liên kết = 2', { fs: 16, a: 'middle', c: 'amb', b: true }) +
  T(595, 146, 'chủ · quyền · mtime · con trỏ khối', { fs: 13.5, a: 'middle', c: 'mu' }) +
  R(430, 200, 330, 90, { c: 'blu' }) + T(595, 232, 'inode 43084', { fs: 19, a: 'middle', b: true, mono: true }) +
  T(595, 258, 'loại: symlink · 10 byte', { fs: 15, a: 'middle', c: 'mu' }) + T(595, 280, 'nội dung = chữ "report.txt"', { fs: 15, a: 'middle', c: 'blu' }) +
  A(302, 62, 428, 90, { c: 'grn' }) + A(302, 140, 428, 110, { c: 'grn' }) + A(302, 244, 428, 244, { c: 'blu' }) +
  T(800, 236, 'mở shortcut.txt ⇒ nhân đọc chữ', { fs: 14.5, c: 'blu' }) + T(800, 258, '"report.txt" rồi tra lại TÊN đó', { fs: 14.5, c: 'blu' }) +
  T(800, 280, '⇒ tên đó mất thì link TREO', { fs: 14.5, c: 'red' }) +
  T(900, 20, 'KHỐI DỮ LIỆU', { fs: 15, c: 'mu', b: true }) +
  R(880, 60, 260, 80, { c: 'dim' }) + T(1010, 94, '"hello\\n"', { fs: 19, a: 'middle', mono: true }) + T(1010, 120, 'giải phóng khi liên kết = 0', { fs: 13.5, a: 'middle', c: 'mu' }) +
  A(762, 100, 878, 100, { c: 'amb' }));

/* Slide 17 — -mtime cắt phần lẻ theo chu kỳ 24 giờ */
const mtimeRuler = () => {
  const X = (d) => 90 + d * 250; // 0..4 ngày
  let s = '';
  for (let d = 0; d <= 4; d++) s += `<line x1="${X(d)}" y1="36" x2="${X(d)}" y2="300" stroke="#223028" stroke-width="1.5"/>` + T(X(d), 26, `${d * 24} giờ`, { fs: 14, a: 'middle', c: 'dim', mono: true });
  const band = (y, d0, d1, lbl, c, sub) => {
    s += `<rect x="${X(d0)}" y="${y}" width="${X(d1) - X(d0)}" height="38" rx="7" fill="${D[c]}" opacity=".22" stroke="${D[c]}" stroke-width="2"/>` +
      T(X(d0) + 12, y + 25, lbl, { fs: 16, c, b: true, mono: true }) + (sub ? T(X(d1) + 10, y + 25, sub, { fs: 14, c: 'mu' }) : '');
  };
  s += T(0, 76, 'tuổi', { fs: 14, c: 'mu' }) + T(0, 94, '(làm tròn', { fs: 13, c: 'dim' }) + T(0, 110, 'XUỐNG)', { fs: 13, c: 'dim' });
  [['0', 0], ['1', 1], ['2', 2], ['3', 3]].forEach(([n, d]) => { s += T((X(d) + X(d + 1)) / 2, 80, `= ${n} ngày`, { fs: 15, a: 'middle', c: 'lx', b: true }); });
  band(110, 0, 1, '-mtime -1  (=0)', 'grn');
  band(158, 1, 2, '-mtime 1', 'amb', '← ĐÚNG 1: từ 24 tới dưới 48 giờ');
  band(206, 2, 4, '-mtime +1  (≥ 2)', 'red');
  s += `<circle cx="${X(0.25)}" cy="276" r="9" fill="${D.blu}"/>` + T(X(0.25) + 16, 282, 'file sửa 6 giờ trước: -mtime 0 ✓ · -mtime +0 ✗ · -mmin -420 ✓', { fs: 15, c: 'blu', b: true });
  return sv(1150, 310, s);
};

/* Slide 23 — releases/ + current (deploy nguyên tử) */
const releasesMap = () => sv(560, 330,
  T(0, 22, '/srv/app', { fs: 17, mono: true, b: true }) +
  R(20, 40, 320, 48, { c: 'dim', r: 9 }) + T(34, 70, 'releases/2026-09-27-9f8e7d/', { fs: 15, mono: true, c: 'mu' }) +
  R(20, 100, 320, 48, { c: 'grn', r: 9 }) + T(34, 130, 'releases/2026-09-28-a1b2c3/', { fs: 15, mono: true }) +
  R(20, 196, 200, 50, { c: 'lx', r: 9 }) + T(120, 227, 'current →', { fs: 17, a: 'middle', mono: true, b: true }) +
  A(222, 212, 352, 132, { c: 'lx' }) + A(222, 230, 352, 72, { c: 'dim', dash: true }) +
  T(360, 70, 'bản cũ (quay lui)', { fs: 14, c: 'mu' }) + T(360, 130, 'bản mới', { fs: 14, c: 'grn', b: true }) +
  R(0, 268, 560, 56, { c: 'grn', fill: 'rgba(63,185,80,.08)' }) +
  T(280, 292, 'mv -T = MỘT rename(): mọi tiến trình thấy cũ', { fs: 15.5, a: 'middle', b: true }) +
  T(280, 314, 'hoặc mới — không bao giờ thấy "current" biến mất', { fs: 15, a: 'middle', c: 'mu' }));

/* ───────────── SLIDES ───────────── */
export const slides = S([
  cover({ t: 'Chương 2 — File &amp; thư mục', sub: 'Tạo · chép · chuyển · xoá an toàn · glob · find · inode &amp; liên kết · tar và bộ nén đời mới', chap: 'CHƯƠNG 2' }),

  { t: 'Bản đồ chương: 4 bài, 1 mô hình — TÊN khác THỨ nó gọi tên', body: mindmap('File &amp; thư mục', 'tên → inode → dữ liệu', [
    { t: '2.1 Tạo · chép · chuyển · xoá', d: 'cp -a, mv đè im lặng, rm không có thùng rác', c: 'lx' },
    { t: '2.2 Glob', d: 'shell khai triển TRƯỚC; glob ≠ regex; nullglob, dotglob', c: 'grn' },
    { t: '2.3 find', d: 'nơi đi · phép thử · hành động; -exec + và xargs -0', c: 'blu' },
    { t: '2.4 Liên kết &amp; nén', d: 'hard link / symlink trên inode; tar -a, --zstd, -t, -C', c: 'vio' },
  ]) },

  /* ───────────── 2.1 ───────────── */
  { t: 'Năm lệnh làm 90% việc với file — mỗi lệnh có MỘT cờ đổi tất cả', body: two(
    sh([
      ['mkdir -p src/{api,web,shared}', 'có rồi cũng không lỗi'],
      ['touch notes.txt', 'tạo file rỗng / cập nhật mtime'],
      ['cp -a src/ /tmp/backup/', 'giữ quyền, giờ, symlink'],
      ['cp --backup=numbered a.yml b.yml', 'giữ bản cũ b.yml.~1~'],
      ['mv -n a.txt b.txt', 'KHÔNG đè nếu b.txt đã có'],
      ['rm -I *.log', 'hỏi MỘT lần khi > 3 file'],
      ['rmdir build/', 'chỉ xoá thư mục RỖNG'],
    ], { fs: 16 }),
    `${term(['$ mkdir logs; mkdir logs', "! mkdir: cannot create directory 'logs': File exists", '$ mkdir -p logs; echo "exit=$?"', '= exit=0', '$ cp src /tmp/x', "! cp: -r not specified; omitting directory 'src'"], { title: 'Ubuntu 24.04' })}
    ${box('tip', '<code>-p</code> làm <code>mkdir</code> chạy lại bao nhiêu lần cũng được — đúng thứ script cần.')}`, 'l') },

  { t: 'cp -r: đích CÓ SẴN hay chưa mới quyết định kết quả', body: two(
    term(['$ cp -r src dst        # dst chưa có', '$ ls dst', 'api  app.ts  auth.ts  shared  web', '$ cp -r src dst        # chạy lại: dst ĐÃ có', '$ ls dst', '+ api  app.ts  auth.ts  shared  src  web', '$ rm -rf dst; mkdir dst', '$ cp -r src/ dst/      # gạch chéo cuối?', '$ ls dst', '+ src                   # GNU cp: vẫn là dst/src'], { title: 'Ubuntu 24.04 — coreutils 9.4' }),
    `${table(['Lệnh', 'GNU (Ubuntu)', 'BSD (macOS)'], [
      ['<code>cp -r src dst</code> (dst có)', 'dst/src/…', 'dst/src/…'],
      ['<code>cp -r src/ dst</code> (dst có)', '!dst/src/…', '!dst/… (NỘI DUNG)'],
      ['<code>rsync -a src/ dst/</code>', 'dst/… (nội dung)', 'dst/… (nội dung)'],
    ], { sm: true })}
    ${box('warn', 'Cùng một lệnh, Mac và VPS cho hai kết quả. Muốn chắc chắn “chép NỘI DUNG” trên mọi máy: <code>cp -a src/. dst/</code>.')}`, 'l') },

  { t: 'mv chỉ sửa một MỤC thư mục — và đè đích mà không hỏi', body: two(
    `${diagram({ w: 560, h: 250, nodes: [
      { id: 'a', x: 0, y: 10, w: 240, h: 64, t: 'a.txt → 61809', c: 'dim', mono: true, dash: true },
      { id: 'b', x: 0, y: 150, w: 240, h: 64, t: 'b.txt → 61809', c: 'grn', mono: true },
      { id: 'i', x: 300, y: 76, w: 256, h: 84, t: 'inode 61809', d: 'dữ liệu KHÔNG\ndi chuyển', c: 'amb', mono: true },
    ], edges: [{ from: 'a', to: 'b', t: 'mv = rename()', c: 'lx', fs: 'b', ts: 't' }, { from: 'b', to: 'i', c: 'grn' }] })}
    ${term(['$ ls -i a.txt; mv a.txt b.txt; ls -i b.txt', '61809 a.txt', '+ 61809 b.txt                # cùng inode'], { title: 'Ubuntu 24.04' })}
    ${box('info', 'Cùng hệ thống file ⇒ tức thì dù file 50 GB. Khác ổ ⇒ chép rồi xoá; Ctrl+C giữa chừng để lại file dở.')}`,
    term(['$ echo A > a.txt; echo B > b.txt', '$ mv -n a.txt b.txt; echo "exit=$?"', "! mv: not replacing 'b.txt'", '! exit=1                 # coreutils 9.4: -n giờ là LỖI', '$ mv -v a.txt b.txt', "renamed 'a.txt' -> 'b.txt'", '$ cat b.txt', '+ A                      # B mất, không hỏi', '$ cp --backup=numbered new.yml cfg.yml   # ×2', '$ ls cfg.yml*', '= cfg.yml  cfg.yml.~1~  cfg.yml.~2~'], { title: 'Ubuntu 24.04' }), 'r') },

  { t: 'rm không có thùng rác: nó chỉ gạch cái TÊN', body: two(
    unlinkMap(),
    `${term(['$ echo "bao cao quan trong" > bao-cao.txt', '$ ls -li bao-cao.txt', '43293 -rw-r--r-- 1 cuong cuong 19 … bao-cao.txt', '$ rm bao-cao.txt', '$ ls bao-cao.txt', "! ls: cannot access 'bao-cao.txt': No such file or directory", '$ ls -d ~/.local/share/Trash', "! ls: cannot access '…/Trash': No such file or directory"], { title: 'Ubuntu 24.04 — không hỏi, không thùng rác', fs: 14 })}
    ${box('bad', 'Cứu lại cần công cụ chuyên dụng, và thường thất bại trên ổ đang ghi. Đừng lập kế hoạch dựa vào nó — lập kế hoạch để <b>không cần</b> nó.')}`, 'r') },

  { t: 'Biến rỗng + rm -rf = danh sách mọi thư mục của máy', body: two(
    `${sh([
      '# LỖI: biến chưa gán / gõ sai tên',
      'THU_MUC=""',
      ['rm -rf "$THU_MUC"/*', '= rm -rf /*'],
      '# Chốt 1: rỗng ⇒ báo lỗi, KHÔNG chạy',
      'rm -rf "${THU_MUC:?chua dat THU_MUC}"/*',
      '# Chốt 2: biến chưa gán ⇒ dừng script',
      'set -u',
    ], { fs: 14.5 })}
    ${box('info', '<code>--preserve-root</code> chỉ chặn đúng <code>/</code>. Còn <code>/*</code> là 18 đường dẫn khác — nó không chặn.')}`,
    term(['$ THU_MUC=""; echo rm -rf "$THU_MUC"/*', '! rm -rf /bin /boot /dev /etc /home /lib /media /mnt /opt', '! /proc /root /run /sbin /srv /sys /tmp /usr /var', '$ bash -c \'THU_MUC=""; echo rm -rf "${THU_MUC:?chua dat THU_MUC}"/*\'', '= bash: line 1: THU_MUC: chua dat THU_MUC', '# (trong container vứt đi, với quyền root:)', '$ rm -rf /', "+ rm: it is dangerous to operate recursively on '/'", '+ rm: use --no-preserve-root to override this failsafe'], { title: 'Ubuntu 24.04 — echo trước, không xoá gì', fs: 14 }), 'r2') },

  { t: 'Ba lưới an toàn thay cho “cẩn thận hơn”', body: two(
    steps([
      ['<b>NHÌN trước</b>: <code>ls -d *.log</code> rồi mới <code>rm *.log</code>', 'shell khai triển y hệt cả hai lần'],
      ['<b>Hỏi một lần</b>: <code>rm -I</code>', 'hỏi khi xoá &gt; 3 file hoặc -r — không phiền như <code>-i</code>'],
      ['<b>Thùng rác thật</b>: <code>trash-put</code>', 'gói <code>trash-cli</code>, chuẩn FreeDesktop — khôi phục được'],
      ['<b>Script</b>: <code>set -u</code> + <code>${X:?}</code>', 'alias không tồn tại trong script, cron, ssh'],
    ]),
    term(['$ touch f{1..5}.log; rm -I f*.log', '+ rm: remove 5 arguments? n', '$ trash-put cu/', '$ trash-list', '2026-09-28 08:40:24 /home/cuong/thu-linux/cu', '$ cat ~/.local/share/Trash/info/cu.trashinfo', '[Trash Info]', 'Path=/home/cuong/thu-linux/cu', 'DeletionDate=2026-09-28T08:40:24', '$ trash-restore', '   0 2026-09-28 08:40:24 /home/cuong/thu-linux/cu', '= What file to restore [0..0]: 0'], { title: 'Ubuntu 24.04 — apt install trash-cli' }), 'r') },

  /* ───────────── 2.2 ───────────── */
  { t: 'Shell khai triển glob TRƯỚC — rm không bao giờ thấy dấu *', body: `
    ${flow([
      { e: '⌨️', t: 'Bạn gõ', d: '<code>rm *.log</code>', c: 'amb' },
      { e: '📂', t: 'Shell đọc thư mục', d: 'tìm tên khớp, sắp xếp', c: 'grn' },
      { e: '✍️', t: 'Viết lại dòng lệnh', d: '<code>rm app.log db.log</code>', c: 'tea' },
      { e: '🚀', t: 'execve()', d: 'rm nhận 2 tên — không biết từng có glob', c: 'red' },
    ])}
    ${two(term(['$ ls', 'app.log  db.log  notes.txt  report.pdf', '$ echo *.log                  # echo = chạy thử miễn phí', '+ app.log db.log', '$ echo "*.log" \'*.log\'        # trong nháy: không khai triển', '*.log *.log', '$ bash -c \'set -f; echo *.log\'  # set -f: tắt glob', '*.log'], { title: 'Ubuntu 24.04' }),
    box('tip', 'Thêm <code>echo</code> trước bất kỳ lệnh phá huỷ nào, đọc, rồi bỏ <code>echo</code>. Thứ <code>echo</code> in ra CHÍNH LÀ thứ <code>rm</code> sẽ nhận.'), 'l2')}` },

  { t: 'Bốn ký tự đại diện + ngoặc nhọn (thứ SINH chữ, không đọc đĩa)', body: two(
    table(['Mẫu', 'Khớp', 'Không khớp'], [
      ['<code>*.log</code>', 'app.log · db.log', 'logs/app.log · .hidden.log'],
      ['<code>log?.txt</code>', 'log1.txt · logA.txt', 'log.txt · log12.txt'],
      ['<code>log[0-9].txt</code>', 'log1.txt … log9.txt', 'logA.txt'],
      ['<code>log[!0-9].txt</code>', 'logA.txt', 'log1.txt'],
      ['<code>[[:upper:]]*</code>', 'README.md · Banana', 'apple'],
      ['<code>{a,b}.txt</code>', '!luôn ra a.txt b.txt', '(không đọc thư mục)'],
    ], { sm: true }),
    `${term(['$ echo log?.txt', 'log1.txt log2.txt log3.txt logA.txt', '$ echo log[!0-9].txt', 'logA.txt', '$ cd /tmp/rong; echo {a,b,c}.txt *.txt', '+ a.txt b.txt c.txt *.txt', '$ echo {01..10..3} file{1..3}.txt', '01 04 07 10 file1.txt file2.txt file3.txt'], { title: 'Ubuntu 24.04' })}
    ${box('info', 'Ngoặc nhọn để <b>TẠO</b> (<code>mkdir -p site/{css,js}</code>), glob để <b>CHỌN</b> file có thật.')}`, 'l') },

  { t: 'Glob ≠ regex: cùng ký tự, hai ngôn ngữ khác nhau', body: two(
    table(['Ý muốn', 'Glob (shell, find -name)', 'Regex (grep, find -regex)'], [
      ['chuỗi bất kỳ', '<code>*</code>', '<code>.*</code>'],
      ['đúng 1 ký tự', '<code>?</code>', '<code>.</code>'],
      ['ký tự KHÔNG thuộc tập', '<code>[!abc]</code>', '<code>[^abc]</code>'],
      ['dấu chấm thật', '<code>.</code>', '<code>\\.</code>'],
      ['neo đầu / cuối', 'luôn khớp CẢ tên', '<code>^</code> … <code>$</code>'],
      ['lặp lại', '— (extglob: <code>+(…)</code>)', '<code>+</code> <code>*</code> <code>{2,}</code>'],
    ], { sm: true }),
    `${term(['$ ls', 'app.log  app.log.1  catalog.txt', '$ ls | grep \'.log\'     # regex: . = 1 ký tự bất kỳ', 'app.log', 'app.log.1', '! catalog.txt                 # "a" + "log" khớp!', '$ ls | grep -E \'\\.log$\'', '= app.log', '$ find . -regextype posix-extended \\', "    -regex '.*\\.log(\\.[0-9]+)?$'", './app.log', './app.log.1'], { title: 'Ubuntu 24.04' })}
    ${box('tip', '<code>find -regex</code> khớp <b>CẢ ĐƯỜNG DẪN</b> (<code>./app.log</code>), nên luôn mở đầu bằng <code>.*</code>.')}`, 'l') },

  { t: 'Glob không khớp: bash giữ NGUYÊN chữ, zsh báo lỗi', body: two(
    `${term(['$ for f in *.csv; do echo "dang xu ly $f"; done', '! dang xu ly *.csv            # chạy 1 lượt với chính cái mẫu', '$ shopt -s nullglob          # không khớp ⇒ RỖNG', '$ for f in *.csv; do …; done  # 0 lượt', '$ shopt -s failglob; ls *.csv', '+ bash: no match: *.csv       # ⇒ lỗi, lệnh không chạy'], { title: 'Ubuntu 24.04 — bash 5.2' })}
    ${term(['$ zsh -f -c \'for f in *.csv; do echo "x $f"; done\'', '! zsh:1: no matches found: *.csv', '$ /bin/bash -c \'for f in *.csv; do echo "x $f"; done\'', 'x *.csv'], { title: 'macOS — zsh 5.9 và /bin/bash 3.2' })}`,
    table(['Tuỳ chọn', 'Glob không khớp thành…', 'Dùng khi'], [
      ['(mặc định bash)', '!chính chữ <code>*.csv</code>', '— gây lỗi ngầm'],
      ['<code>nullglob</code>', '+rỗng', 'vòng <code>for</code> trong script'],
      ['<code>failglob</code>', '+lỗi, lệnh không chạy', 'gõ tay'],
      ['zsh mặc định', 'lỗi <code>no matches found</code>', 'Mac: <code>setopt null_glob</code>'],
    ], { sm: true }), 'l') },

  { t: 'File ẩn: bash 5.2 thôi cho .* khớp . và ..', body: two(
    term(['$ ls -A', '.env  .gitignore  app.log  db.log  notes.txt  report.pdf', '$ echo *', 'app.log db.log notes.txt report.pdf     # bỏ file ẩn', '$ echo .*', '+ .env .gitignore                        # globskipdots: on', "$ bash -c 'shopt -u globskipdots; echo .*'", '! . .. .env .gitignore', '$ echo .[!.]*', '.env .gitignore', '$ shopt -s dotglob; echo *', '= .env .gitignore app.log db.log notes.txt report.pdf'], { title: 'Ubuntu 24.04 — bash 5.2.21' }),
    `${table(['Shell', '<code>echo .*</code> in ra'], [
      ['bash 5.2+ (Ubuntu 24.04, Fedora 44)', '+.env .gitignore'],
      ['bash 3.2 (<code>/bin/bash</code> của Mac)', '-. .. .env'],
      ['zsh (Mac)', '+.env'],
    ], { sm: true })}
    ${box('bad', '<code>rm -rf .*</code> trên bash cũ = đệ quy vào <code>..</code>. <code>rm</code> GNU từ chối <code>.</code>/<code>..</code>, nhưng đừng thử vận may: dùng <code>.[!.]*</code> hoặc <code>dotglob</code>.')}`, 'l') },

  { t: 'extglob và globstar: glob biết “trừ ra” và đi xuống sâu', body: two(
    sh([
      ['shopt -s extglob', 'bật trước, dòng riêng'],
      ['echo !(*.log)', 'mọi thứ TRỪ .log'],
      ['echo *.@(log|pdf)', 'đuôi log HOẶC pdf'],
      ['rm -- !(*.env|*.pem)', 'xoá hết trừ bí mật'],
      '',
      ['shopt -s globstar', 'mặc định TẮT trong bash'],
      ['echo src/**/*.ts', 'mọi độ sâu'],
    ], { fs: 16 }),
    `${term(['$ echo !(*.log)', 'notes.txt report.pdf', '$ echo *.@(log|pdf)', 'app.log db.log report.pdf', '$ echo src/**/*.ts            # chưa bật: ** = *', '! src/api/user.ts src/lib/db.ts', '$ shopt -s globstar; echo src/**/*.ts', '= src/api/user.ts src/api/v2/admin.ts src/index.ts src/lib/db.ts'], { title: 'Ubuntu 24.04' })}
    ${term(['$ /bin/bash -c \'shopt -s globstar\'', '! /bin/bash: line 0: shopt: globstar: invalid shell option name'], { title: 'macOS — bash 3.2 không có globstar' })}`, 'r') },

  /* ───────────── 2.3 ───────────── */
  { t: 'Mọi lệnh find có ba phần: NƠI ĐI · PHÉP THỬ · HÀNH ĐỘNG', body: `
    ${sh([['find ./src -maxdepth 3 -type f -name "*.ts" -mmin -60 -print', '']], { fs: 20, so: false })}
    ${diagram({ w: 1160, h: 150, nodes: [
      { id: 'p', x: 0, y: 30, w: 200, h: 84, t: './src', d: 'NƠI ĐI · đứng đầu', c: 'grn', mono: true },
      { id: 'o', x: 250, y: 30, w: 230, h: 84, t: '-maxdepth 3', d: 'tuỳ chọn · trước', c: 'dim', mono: true },
      { id: 't', x: 530, y: 30, w: 400, h: 84, t: '-type f -name "*.ts" -mmin -60', d: 'PHÉP THỬ · nối bằng VÀ', c: 'blu', mono: true },
      { id: 'a', x: 980, y: 30, w: 170, h: 84, t: '-print', d: 'HÀNH ĐỘNG', c: 'lx', mono: true },
    ], edges: [{ from: 'p', to: 'o', c: 'dim' }, { from: 'o', to: 't', c: 'dim' }, { from: 't', to: 'a', c: 'lx' }] })}
    ${two(box('info', 'Với <b>MỖI</b> đường dẫn gặp được, find tính biểu thức trái → phải và dừng ngay khi đã biết kết quả (ngắt mạch). Phép thử sai ⇒ hành động phía sau KHÔNG chạy.'),
    box('warn', 'Mẫu của <code>-name</code> phải nằm trong nháy. Không nháy ⇒ shell khai triển theo thư mục HIỆN TẠI trước: <code>find: paths must precede expression</code>.'))}` },

  { t: 'Bảng phép thử hay dùng — số có dấu + / − / trần', body: table(['Phép thử', 'Nghĩa', 'Ví dụ'], [
    ['<code>-name</code> · <code>-iname</code>', 'glob trên phần TÊN (i = không phân biệt hoa thường)', '<code>-iname "*.jpg"</code>'],
    ['<code>-path</code> · <code>-regex</code>', 'glob / regex trên CẢ đường dẫn', '<code>-path "*/dist/*"</code>'],
    ['<code>-type f|d|l</code> · <code>-xtype l</code>', 'file · thư mục · symlink · symlink TREO', '<code>-xtype l</code> = link hỏng'],
    ['<code>-size +100M</code>', '&gt; 100 MiB (c = byte, k, M, G; số trần = khối 512 B)', '<code>-size +1G</code>'],
    ['<code>-mtime -1</code> · <code>-mmin -30</code>', 'sửa trong &lt; 1 ngày · &lt; 30 phút', '<code>-mmin +120</code>'],
    ['<code>-newer f</code> · <code>-newermt "3 hours ago"</code>', 'mới hơn file f · mới hơn một mốc giờ', '<code>-newermt 2026-09-01</code>'],
    ['<code>-empty</code> · <code>-user</code> · <code>-perm -0002</code>', 'rỗng · chủ sở hữu · ai cũng ghi được', '<code>-user www-data</code>'],
    ['<code>!</code> · <code>-o</code> · <code>\\( … \\)</code>', 'KHÔNG · HOẶC · nhóm (VÀ là ngầm định)', '<code>\\! -name "*.md"</code>'],
  ], { sm: true }) },

  { t: '-mtime đếm chu kỳ 24 giờ và CẮT phần lẻ', body: `
    ${mtimeRuler()}
    ${box('tip', 'Trong vòng một ngày, dùng <code>-mmin</code> (phút) hoặc <code>-newermt "6 hours ago"</code> — dễ suy luận hơn nhiều. Đo thật: file <code>touch -d "6 hours ago"</code> khớp <code>-mtime 0</code> và <code>-mmin -420</code>, KHÔNG khớp <code>-mtime +0</code>.')}` },

  { t: '-exec \\; vs + vs xargs -0 — đo thật trên 5.000 file', body: two(
    `${bars([
      { l: '-exec md5sum {} \\;', sub: '5.000 tiến trình', v: 3.06, txt: '3,06 s', c: 'red' },
      { l: '-exec md5sum {} +', sub: '1 tiến trình (5.000 tham số)', v: 0.029, txt: '0,03 s', c: 'grn' },
      { l: '-print0 | xargs -0 md5sum', sub: '1 tiến trình', v: 0.032, txt: '0,03 s', c: 'grn' },
      { l: 'xargs -0 -P4 -n 1250', sub: '4 tiến trình song song', v: 0.012, txt: '0,012 s', c: 'tea' },
    ], { lw: 330, max: 3.2 })}
    <p style="font-size:15px;color:${D.mu};margin-top:8px">Ubuntu 24.04, 3 lượt, lấy trung bình. Nhanh gấp ~100 lần chỉ nhờ đổi <code>\\;</code> thành <code>+</code>.</p>`,
    `${term(['$ find pdf -name \'*.pdf\' -exec echo "lenh:" {} \\;', 'lenh: pdf/Bao cao cuoi ky.pdf', 'lenh: pdf/ok.pdf', '$ find pdf -name \'*.pdf\' -exec echo "lenh:" {} +', '+ lenh: pdf/Bao cao cuoi ky.pdf pdf/ok.pdf'], { title: 'Ubuntu 24.04 — nhìn số lần chạy' })}
    ${table(['Dùng', 'Khi'], [['<code>{} +</code>', '+Mặc định — lệnh nhận nhiều file'], ['<code>{} \\;</code>', '<code>{}</code> không ở cuối / lệnh chỉ nhận 1 file'], ['<code>xargs -0 -P N</code>', 'cần chạy song song']], { sm: true })}`, 'l') },

  { t: 'Tên có dấu cách: chỉ byte NUL tách tên an toàn', body: two(
    term(['$ ls pdf', "'Bao cao cuoi ky.pdf'  ok.pdf", '$ find pdf -name \'*.pdf\' | xargs ls -1', "! ls: cannot access 'pdf/Bao': No such file or directory", "! ls: cannot access 'cao': No such file or directory", "! ls: cannot access 'cuoi': No such file or directory", "! ls: cannot access 'ky.pdf': No such file or directory", 'pdf/ok.pdf', "$ find pdf -name '*.pdf' -print0 | xargs -0 ls -1", '= pdf/Bao cao cuoi ky.pdf', '= pdf/ok.pdf'], { title: 'Ubuntu 24.04' }),
    `${table(['Cờ xargs', 'Nghĩa'], [
      ['<code>-0</code>', 'tách theo byte NUL (đi cặp với <code>-print0</code>)'],
      ['<code>-n 100</code>', 'tối đa 100 tham số mỗi lần chạy'],
      ['<code>-P 4</code>', 'chạy 4 lệnh song song'],
      ['<code>-I{}</code>', 'thay <code>{}</code> ở chỗ bất kỳ (1 tên/lần)'],
      ['<code>-r</code>', 'không chạy nếu đầu vào rỗng (GNU)'],
    ], { sm: true })}
    ${box('info', 'Tên file được chứa mọi byte TRỪ <code>/</code> và NUL — kể cả dấu cách và xuống dòng. Vì thế chỉ NUL là dấu tách không bao giờ nhập nhằng.')}`, 'l') },

  { t: 'Thứ tự viết = thứ tự chạy: -o cần ngoặc, -delete đứng CUỐI', body: two(
    `${term(['$ ls oo', 'a.log  b.tmp', '$ find oo -name "*.log" -o -name "*.tmp" -print', '! oo/b.tmp            # a.log khớp mà KHÔNG được in', '$ find oo \\( -name "*.log" -o -name "*.tmp" \\) -print', '= oo/a.log', '= oo/b.tmp'], { title: 'Ubuntu 24.04' })}
    ${term(['$ ls -A dd', 'a.log  b.txt  sub', '$ cd dd && find . -delete -name "*.log"; echo "exit=$?"', '! exit=0', '$ ls -A', '! (trống — XOÁ SẠCH, rồi mới xét tên)'], { title: 'Ubuntu 24.04 — findutils 4.9 KHÔNG chặn' })}`,
    `${sh([
      '# 1. dựng bằng -print, đọc',
      'find . -name "*.tmp" -mtime +7 -print',
      '# 2. y nguyên, hành động ở CUỐI',
      'find . -name "*.tmp" -mtime +7 -delete',
      '',
      '# tỉa cả cây, không đi vào',
      'find . \\( -name node_modules \\',
      '  -o -name .git \\) -prune \\',
      '  -o -type f -name "*.ts" -print',
    ], { fs: 14.5, so: false })}
    ${box('warn', '<code>-prune</code>, <code>-delete</code>, <code>-exec</code> là HÀNH ĐỘNG ⇒ <code>-print</code> ngầm định biến mất: phải tự ghi.')}`, 'l2') },

  /* ───────────── 2.4 ───────────── */
  { t: 'Tên file chỉ là con trỏ: MỤC thư mục → INODE → dữ liệu', body: `
    ${inodeMap()}
    ${term(['$ ls -li', '+ 41338 -rw-r--r-- 2 cuong cuong  6 Sep 28 08:47 backup.txt', '+ 41338 -rw-r--r-- 2 cuong cuong  6 Sep 28 08:47 report.txt', '43084 lrwxrwxrwx 1 cuong cuong 10 Sep 28 08:47 shortcut.txt -> report.txt'], { title: 'Ubuntu 24.04 — cột 1: số inode · cột 3: số liên kết' })}` },

  { t: 'Xoá tên gốc: hard link vẫn đọc được, symlink thành link TREO', body: two(
    term(['$ rm report.txt', '$ cat backup.txt', '= hello                      # liên kết: 2 → 1', '$ cat shortcut.txt', '! cat: shortcut.txt: No such file or directory', '$ find . -xtype l            # tìm link treo', './shortcut.txt', '$ mkdir thu; ln thu thu2', "! ln: thu: hard link not allowed for directory", '$ ln backup.txt /dev/shm/x.txt', "! ln: failed to create hard link '/dev/shm/x.txt'", '!     => \'backup.txt\': Invalid cross-device link'], { title: 'Ubuntu 24.04' }),
    table(['', 'Hard link <code>ln</code>', 'Symlink <code>ln -s</code>'], [
      ['Là gì', 'thêm một TÊN cho cùng inode', 'file nhỏ chứa một ĐƯỜNG DẪN'],
      ['Xoá đích', '+dữ liệu còn tới tên cuối', '-thành link treo'],
      ['Trỏ vào thư mục', '-không', '+được'],
      ['Sang ổ khác', '-không (cross-device)', '+được'],
      ['Nhận ra', 'số liên kết &gt; 1, cùng inode', '<code>l</code> đầu dòng, <code>-&gt;</code>'],
      ['Gặp ở đâu', 'bản sao lưu kiểu rsync --link-dest', '<code>current</code>, <code>/etc/alternatives</code>, <code>node_modules/.bin</code>'],
    ], { sm: true }), 'l') },

  { t: 'Deploy nguyên tử: ln -sfn rồi mv -T — thiếu một cờ là hỏng', body: two(
    releasesMap(),
    `${term(['$ ln -s rel/a cur', '$ ln -sf rel/b cur          # quên -n', '$ ls -l rel/a', '! lrwxrwxrwx … b -> rel/b     # link mới chui VÀO rel/a!', '$ ln -sfn rel/b cur; ls -l cur', '= cur -> rel/b', '$ ln -sfn rel/b cur-new; mv cur-new cur    # quên -T', '$ ls -l rel/a', '! lrwxrwxrwx … cur-new -> rel/b   # bị chuyển VÀO trong', '$ ln -sfn rel/a cur-new; mv -T cur-new cur', '= cur -> rel/a'], { title: 'Ubuntu 24.04' })}
    ${box('warn', 'macOS: <code>mv</code> không có <code>-T</code> (<code>illegal option -- T</code>), <code>ln</code> không có <code>-r</code>. Dùng <code>mv -h</code> trên Mac; script deploy chạy trên VPS Linux.')}`, 'r') },

  { t: 'tar chỉ GÓI; nén là một chương trình khác chạy trên cả dòng', body: `
    ${flow([
      { e: '📁', t: 'project/', d: 'nhiều file + quyền, chủ, giờ, symlink', c: 'grn' },
      { e: '📼', t: 'tar -c', d: 'nối thành MỘT dòng .tar', c: 'amb' },
      { e: '🗜️', t: 'gzip · xz · zstd', d: 'nén CẢ dòng ⇒ thấy trùng lặp giữa các file', c: 'tea' },
      { e: '📦', t: 'project.tar.zst', d: 'một file để chép / tải', c: 'blu' },
    ])}
    ${two(sh([
      ['tar -caf p.tar.zst project/', '-a: đoán bộ nén theo ĐUÔI'],
      ['tar -tf p.tar.zst', '-t: xem trước, bung tự nhận'],
      ['tar -xf p.tar.zst -C /srv/app', '-C: bung vào đâu'],
      ['tar -czf p.tar.gz --exclude=node_modules project', ''],
      ['tar -xzf p.tar.gz -O project/package.json', '-O: in 1 file ra stdout'],
    ], { fs: 15 }),
    term(['$ tar -caf p.tar.zst project', '$ tar -caf p.tar.xz project', '$ file p.tar.zst p.tar.xz', 'p.tar.zst: Zstandard compressed data (v0.8+)…', 'p.tar.xz:  XZ compressed data, …', '$ cat p.tar.zst | tar -tf -', '! tar: Archive is compressed. Use --zstd option'], { title: 'Ubuntu 24.04 — GNU tar 1.35' }), 'l')}` },

  { t: 'Bảng cờ tar: MỘT chế độ + f + (bộ nén) + chỗ', body: table(['Cờ', 'Nghĩa', 'Ghi chú'], [
    ['<code>-c</code> · <code>-x</code> · <code>-t</code>', 'tạo · bung · liệt kê', 'luôn đúng MỘT trong ba'],
    ['<code>-f FILE</code>', 'file kho nén (bỏ ⇒ stdin/stdout)', '<code>-cfz x.tar.gz</code> tạo file tên <b>z</b>!'],
    ['<code>-z</code> · <code>-j</code> · <code>-J</code> · <code>--zstd</code>', 'gzip · bzip2 · xz · zstd', 'bung từ FILE thì bỏ được; từ ống thì PHẢI ghi'],
    ['<code>-a</code>', 'chọn bộ nén theo đuôi file khi TẠO', '<code>.tar.zst</code> · <code>.tar.xz</code> · <code>.tgz</code>'],
    ['<code>-I \'zstd -19 -T0\'</code>', 'bộ nén tuỳ ý kèm mức nén', '<code>-T0</code> = dùng mọi nhân'],
    ['<code>-C DIR</code>', 'chuyển vào DIR trước', 'tạo: đường dẫn tương đối · bung: đích'],
    ['<code>--strip-components=1</code>', 'lột N tầng thư mục đầu', 'bung bản phát hành <code>node-v22…/</code>'],
    ['<code>--exclude=PAT</code> · <code>-v</code> · <code>-O</code>', 'bỏ qua · in từng file · bung ra stdout', '<code>-tvf</code> = xem quyền, chủ, cỡ'],
  ], { sm: true }) },

  { t: 'Đo thật: zstd nén nhanh gấp ~10 lần gzip, xz nhỏ nhất', body: two(
    table(['Bộ nén', 'Kích thước', 'Nén', 'Giải nén'], [
      ['(chỉ tar)', '156,3 MB', '—', '—'],
      ['<code>gzip</code> -z', '44,2 MB', '3,9 s', '0,85 s'],
      ['<code>bzip2</code> -j', '37,8 MB', '7,9 s', '2,7 s'],
      ['<code>xz</code> -J', '+28,1 MB', '!39,9 s', '1,5 s'],
      ['<code>xz -T0</code>', '28,5 MB', '12,4 s', '—'],
      ['<code>zstd</code> --zstd', '40,8 MB', '+0,40 s', '+0,20 s'],
      ['<code>zstd -T0</code>', '40,8 MB', '+0,13 s', '—'],
      ['<code>zstd -19 -T0</code>', '31,7 MB', '14,9 s', '+0,21 s'],
    ], { sm: true }),
    `${cards([
      { ic: '⚡', t: 'zstd', d: 'Sao lưu, CI, thứ nội bộ — bạn nắm cả hai đầu.', c: 'grn' },
      { ic: '🌍', t: 'gzip', d: 'Gửi người lạ: máy nào cũng mở được.', c: 'blu' },
      { ic: '📉', t: 'xz', d: 'Nén một lần, tải nhiều lần: bản phát hành.', c: 'vio' },
      { ic: '🪦', t: 'bzip2', d: 'Chỉ còn để ĐỌC kho cũ.', c: 'red' },
    ], 2)}
    <p style="font-size:14.5px;color:${D.mu};margin-top:8px">Đầu vào: <code>/usr</code> của ubuntu:24.04 (4.330 file, tar 156 MB), 10 CPU. Nén: <code>gzip -c usr.tar</code> · giải nén: <code>gzip -dc</code> (tương tự cho từng bộ).</p>`, 'l') },

  { t: 'Luôn -t trước -x: bom tar, dấu / ở đầu, và file ẩn bị * bỏ sót', body: two(
    term(['$ tar -tzf bomb.tar.gz          # KHÔNG có thư mục bọc', '! src/', '! src/index.ts', '! package.json                  # sẽ rải ra thư mục hiện tại', '$ tar -czf abs.tar.gz /etc/hostname', "+ tar: Removing leading `/' from member names", '$ cd project && tar -czf ../star.tar.gz *', '$ tar -tzf ../star.tar.gz', 'node_modules/ …  package.json  src/ …', '! # .env ĐÂU? — * không khớp file ẩn'], { title: 'Ubuntu 24.04' }),
    steps([
      ['<code>tar -tf x.tar.* | head</code>', 'có thư mục bọc ngoài chưa? có đường dẫn tuyệt đối không?'],
      ['Không bọc ⇒ <code>mkdir out &amp;&amp; tar -xf x -C out</code>', 'bom tar rơi vào một hộp riêng'],
      ['Đóng gói cả THƯ MỤC: <code>tar -czf b.tgz -C project .</code>', 'dấu <code>.</code> là đường dẫn, không phải glob ⇒ có .env'],
      ['Kiểm lại: <code>tar -tzf b.tgz | grep -c "^./\\."</code>', 'đếm file ẩn đã vào kho'],
    ]), 'l') },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 2', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Deploy nằm sâu thêm một tầng <code>app/app/</code>', '<code>cp -r src dst</code> khi dst ĐÃ có (hoặc rsync thiếu <code>/</code>)', '<code>cp -a src/. dst/</code> · <code>rsync -a src/ dst/</code>'],
    ['<code>config.yml</code> bị thay im lặng', '<code>mv</code>/<code>cp</code> đè đích không hỏi', '<code>mv -n</code>, <code>cp --backup=numbered</code>'],
    ['Script xoá nhầm cả <code>/*</code>', 'biến rỗng trong <code>rm -rf "$X"/*</code>', '<code>${X:?}</code> + <code>set -u</code>'],
    ['Vòng lặp chạy với <code>f=*.csv</code>', 'glob không khớp giữ nguyên chữ', '<code>shopt -s nullglob</code>'],
    ['<code>find: paths must precede expression</code>', '<code>-name *.log</code> không nháy', '<code>-name "*.log"</code>'],
    ['<code>xargs</code> báo không có file “Bao”', 'tên có dấu cách, tách theo khoảng trắng', '<code>-print0 | xargs -0</code>'],
    ['<code>find … -delete</code> xoá cả cây', '<code>-delete</code> đứng trước phép thử', 'chạy <code>-print</code> trước, <code>-delete</code> ở cuối'],
    ['Khôi phục thiếu <code>.env</code>', '<code>tar -czf b.tgz *</code> — * bỏ file ẩn', '<code>tar -czf b.tgz -C project .</code>'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 2 (1/2) — tạo · chép · xoá · glob', body: table(['Muốn…', 'Gõ'], [
    ['Tạo cả cây thư mục, chạy lại không lỗi', '<code>mkdir -p app/{src,logs,tmp}</code>'],
    ['Sao lưu giữ quyền/giờ/symlink', '<code>cp -a src/. /backup/src/</code>'],
    ['Chép/chuyển không đè · giữ bản cũ', '<code>mv -n a b</code> · <code>cp --backup=numbered a b</code>'],
    ['Xoá có hỏi một lần · vào thùng rác', '<code>rm -I *.log</code> · <code>trash-put dir/</code> · <code>trash-restore</code>'],
    ['Chặn biến rỗng khi xoá', '<code>rm -rf "${DIR:?}"/*</code> · <code>set -u</code>'],
    ['Xem trước glob sẽ khớp gì', '<code>echo *.log</code> · <code>ls -d .[!.]*</code>'],
    ['Glob không khớp ⇒ rỗng / lỗi', '<code>shopt -s nullglob</code> · <code>shopt -s failglob</code>'],
    ['Gồm file ẩn · đệ quy · trừ ra', '<code>shopt -s dotglob globstar extglob</code> → <code>**/*.ts</code> · <code>!(*.log)</code>'],
    ['File tên bắt đầu bằng <code>-</code>', '<code>rm -- -rf</code> · <code>rm ./*</code>'],
    ['Đọc file: đầu · cuối · theo dõi', '<code>head -20</code> · <code>tail -20</code> · <code>tail -F app.log</code>'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 2 (2/2) — find · liên kết · tar', body: table(['Muốn…', 'Gõ'], [
    ['File &gt; 100 MB sửa trong 24 giờ', '<code>find / -xdev -type f -size +100M -mtime -1 2&gt;/dev/null</code>'],
    ['20 file lớn nhất (GNU)', '<code>find . -type f -printf \'%s\\t%p\\n\' | sort -rn | head -20</code>'],
    ['Chạy lệnh trên kết quả (nhanh)', '<code>find . -name "*.log" -exec gzip {} +</code>'],
    ['An toàn với tên có dấu cách', '<code>find . -name "*.pdf" -print0 | xargs -0 -P4 …</code>'],
    ['Bỏ qua node_modules, .git', '<code>find . \\( -name node_modules -o -name .git \\) -prune -o -type f -print</code>'],
    ['Link treo · xoá thư mục rỗng', '<code>find . -xtype l</code> · <code>find . -depth -type d -empty -delete</code>'],
    ['Hard link · symlink · tráo nguyên tử', '<code>ln a b</code> · <code>ln -s đích tên</code> · <code>ln -sfn mới cur.new &amp;&amp; mv -T cur.new cur</code>'],
    ['Đọc link · đi tới đích thật', '<code>readlink l</code> · <code>readlink -f l</code> · <code>stat -c \'%i %h\' f</code>'],
    ['Nén · xem · bung', '<code>tar -caf x.tar.zst dir/</code> · <code>tar -tf x.tar.zst</code> · <code>tar -xf x.tar.zst -C out</code>'],
    ['Bung bản phát hành không lớp bọc', '<code>tar -xf node.tar.xz -C /usr/local --strip-components=1</code>'],
  ], { sm: true }) },

  { t: 'Cùng lệnh, khác máy: Ubuntu (GNU) · macOS (BSD) · WSL', body: table(['Việc', 'Ubuntu / WSL2', 'macOS (đo thật)'], [
    ['<code>cp -R src/ dst</code> (dst có)', 'dst/src/…', '!dst/… — chép NỘI DUNG'],
    ['<code>mv -n a b</code> khi b có', '!exit 1 + <code>not replacing</code>', 'exit 0, im lặng'],
    ['<code>mv -T</code> · <code>ln -r</code>', '+có', '-<code>illegal option</code> (dùng <code>mv -h</code>)'],
    ['<code>find -name x</code> (thiếu đường dẫn)', '+hiểu là <code>.</code>', '-<code>illegal option -- n</code>'],
    ['<code>find -printf</code> · <code>stat -c</code>', '+có', '-không có — dùng <code>stat -f \'%z %N\'</code>'],
    ['<code>echo .*</code> · glob không khớp', '<code>.env</code> · giữ nguyên chữ', 'zsh: <code>.env</code> · <b>no matches found</b>'],
    ['<code>shopt -s globstar</code>', '+bash 5.2', '-bash 3.2: invalid option (zsh có <code>**</code> sẵn)'],
    ['<code>tar --zstd</code> · <code>tar -a</code>', '+GNU tar 1.35', '+bsdtar 3.5.3 cũng hiểu'],
    ['Dự án để ở <code>/mnt/c/…</code> (ổ Windows)', '!WSL2: chạy được nhưng chậm — để trong <code>~</code>', '—'],
  ], { sm: true }) },

  { t: 'Thực hành Chương 2 (40 phút) — dọn thư mục log của nhóm', body: `
    ${steps([
      ['Dựng sân tập <code>~/thu-linux/ch2</code>: 300 file log, vài file tên có dấu cách, một <code>.env</code>', '<code>mkdir -p</code> + ngoặc nhọn + vòng <code>for</code>'],
      ['Chọn đúng file bằng glob, xem trước bằng <code>echo</code>, bật <code>nullglob</code>', 'đếm được bao nhiêu file khớp <code>app-[0-9][0-9].log</code>?'],
      ['Tìm 5 file lớn nhất sửa trong 24 giờ, nén chúng bằng <code>-exec gzip {} +</code>', 'so thời gian với <code>\\;</code>'],
      ['Dựng <code>releases/</code> + <code>current</code>, tráo nguyên tử 2 lần, quay lui', '<code>ls -l current</code> sau mỗi bước'],
      ['Sao lưu cả thư mục bằng <code>tar -caf</code> (.tar.zst), <code>-t</code> kiểm có <code>.env</code>, bung vào <code>out/</code>', '<code>diff -r</code> bản gốc và bản bung'],
    ])}
    ${box('good', '<b>Đạt khi:</b> <code>diff -r ch2 out/ch2</code> im lặng, <code>readlink current</code> trỏ đúng bản bạn chọn, không mất file nào ngoài ý muốn.')}` },
]);
