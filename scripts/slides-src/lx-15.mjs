/**
 * Linux & Bash · Deck lx-15 — Chương 15: Dùng kỹ năng Linux trên macOS và Windows.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 28/09/2026:
 *   • "Mac" = Mac M1, macOS 27.0 (Darwin 27.0.0, xnu-13432), zsh 5.9, /bin/bash 3.2.57, công cụ BSD của Apple,
 *            Homebrew 7.0.6 (CHỈ brew --prefix/info/list/services list), launchctl CHỈ list/print, plist + keychain +
 *            defaults thử trong thư mục scratch (keychain thử đã delete-keychain, danh sách keychain như cũ).
 *   • "Ubuntu" = container ubuntu:24.04 (arm64, bash 5.2.21, GNU coreutils 9.4, sed 4.9, grep 3.11, git 2.43,
 *            dos2unix 7.5.1) tên lx15-u, --memory 512m — CRLF và .gitattributes dựng lại thật trong đó.
 *   • "PowerShell" = PowerShell 7.6.6 (bản linux-arm64 chính thức từ GitHub PowerShell/PowerShell) cài vào CHÍNH
 *            container lx15-u, vì ảnh mcr.microsoft.com/powershell không có bản arm64 (manifest chỉ amd64/arm/windows).
 *   • WSL2/Windows: KHÔNG có máy Windows ⇒ lệnh wsl.exe, wsl.conf, .wslconfig lấy từ learn.microsoft.com (09/2026),
 *            ghi rõ "theo tài liệu Microsoft" trên slide, không in output giả.
 *
 * Hình tự vẽ (SVG nội tuyến): hoUnix() cây họ Unix → macOS/Linux · mocShell() dòng thời gian bash/zsh trên Mac ·
 * wslSvg() WSL2 = máy ảo nhẹ · haiHeFile() /mnt/c chậm vs ~ nhanh · chon() khi nào dùng cái nào.
 */
import { S, cover, sh, term, mindmap, diagram, cards, box, table, two, code, pipe, sv, R, T, A, D } from './_lx-chung.mjs';

export const deck = { key: 'lx-15', code: 'LINUX · CHƯƠNG 15', title: 'macOS &amp; Windows', sub: 'Linux & Bash · Chương 15' };

const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15px}.c-t.sm td,.c-t.sm th{padding:6px 10px}' +
  '.c-code{font-size:14.5px;line-height:1.45}.c-code .hljs-name{color:#569cd6}.c-code .hljs-tag{color:#808080}' +
  '.c-code .hljs-section{color:#dcdcaa}.c-code .hljs-attribute{color:#9cdcfe}</style>';

/* Slide 3 — cây họ: Unix → BSD → Darwin/macOS; Linux + GNU → Ubuntu */
const hoUnix = () => {
  let s = '';
  const box2 = (x, y, w, t, d, c) => R(x, y, w, 62, { c, fill: `color-mix(in srgb,${D[c]} 12%,#0d130f)` }) +
    T(x + 14, y + 26, t, { fs: 17, b: true, c }) + T(x + 14, y + 49, d, { fs: 13.5, c: 'mu' });
  s += box2(20, 10, 250, 'Unix · 1969', 'Bell Labs: Thompson, Ritchie', 'lx');
  s += box2(20, 110, 250, 'BSD · 1977→', 'Berkeley: bản Unix của đại học', 'blu');
  s += box2(20, 210, 250, 'NeXTSTEP · 1989', 'Mach + BSD, công ty của Jobs', 'vio');
  s += box2(20, 310, 250, 'Darwin / XNU', 'nhân Mach + lớp BSD, mã mở', 'tea');
  s += box2(20, 410, 250, 'macOS', 'UNIX 03 · zsh · lệnh BSD', 'grn');
  [[72, 106], [172, 206], [272, 306], [372, 406]].forEach(([a, b]) => { s += A(145, a, 145, b, { c: 'dim', sw: 2.5 }); });
  s += box2(330, 110, 250, 'GNU · 1983', 'Stallman: bash, coreutils, gcc', 'amb');
  s += box2(330, 210, 250, 'Linux · 1991', 'Torvalds: chỉ là NHÂN', 'ora');
  s += box2(330, 330, 250, 'Ubuntu · Fedora', 'nhân Linux + công cụ GNU', 'pnk');
  s += `<path d="M582 141 C 622 141, 622 361, 586 361" stroke="${D.amb}" stroke-width="2.5" fill="none" marker-end="url(#m-amb)"/>`;
  s += A(455, 272, 455, 326, { c: 'ora', sw: 2.5 });
  s += `<path d="M272 41 C 400 41, 455 70, 455 106" stroke="${D.dim}" stroke-width="2" fill="none" stroke-dasharray="6 5" marker-end="url(#m-dim)"/>`;
  s += T(470, 30, 'ý tưởng, không phải mã', { fs: 13, c: 'dim' });
  s += T(330, 432, 'Cùng họ: ống dẫn, rwx, /etc, shell.', { fs: 15, c: 'lx' });
  s += T(330, 456, 'Khác nhà: cờ lệnh, trình quản lý', { fs: 15, c: 'lx' });
  s += T(330, 478, 'dịch vụ, vị trí file.', { fs: 15, c: 'lx' });
  return sv(630, 500, s);
};

/* Slide 4 — dòng thời gian bash/zsh trên Mac */
const mocShell = () => {
  const X = (y) => 60 + (y - 2006) * 52;
  let s = `<path d="M40 120 L1110 120" stroke="${D.dim}" stroke-width="3"/>`;
  [2006, 2009, 2012, 2015, 2019, 2022, 2025].forEach((y) => { s += `<path d="M${X(y)} 114 L${X(y)} 126" stroke="${D.dim}" stroke-width="2"/>` + T(X(y), 146, String(y), { fs: 14, a: 'middle', c: 'mu', mono: true }); });
  const ev = [
    [2006.8, 'up', 'bash 3.2', 'bản cuối dùng GPLv2', 'lx', 0],
    [2009.1, 'dn', 'bash 4.0 → GPLv3', 'Apple dừng cập nhật bash', 'red', 0],
    [2019.8, 'up', 'macOS 10.15 Catalina', 'zsh thành shell mặc định', 'grn', 0],
    [2025.5, 'dn', 'bash 5.3', 'brew info bash: 5.3.20', 'blu', 0],
  ];
  ev.forEach(([y, side, t, d, c]) => {
    const x = X(y), up = side === 'up';
    const ty = up ? 52 : 196;
    s += `<circle cx="${x}" cy="120" r="8" fill="${D[c]}"/>` + `<path d="M${x} ${up ? 112 : 128} L${x} ${up ? 78 : 172}" stroke="${D[c]}" stroke-width="2" stroke-dasharray="4 4"/>`;
    s += T(x, ty, t, { fs: 17, b: true, c, a: 'middle' }) + T(x, ty + 22, d, { fs: 14, c: 'mu', a: 'middle' });
  });
  return sv(1150, 232, s);
};

/* Slide 18 — WSL2 là một máy ảo nhẹ */
const wslSvg = () => {
  let s = '';
  s += R(0, 0, 1150, 300, { c: 'blu', fill: 'rgba(88,166,255,.05)', r: 16 }) + T(20, 32, '🪟 Windows 10 (build 19041+) / Windows 11', { fs: 18, b: true, c: 'blu' });
  s += R(20, 56, 300, 220, { c: 'blu', r: 12 }) + T(40, 88, 'Phía Windows', { fs: 17, b: true, c: 'blu' });
  ['PowerShell · wsl.exe', 'VS Code (+ tiện ích WSL)', 'Explorer: \\\\wsl$', 'C:\\Users\\an ⇄ /mnt/c'].forEach((t, i) => { s += T(40, 124 + i * 36, t, { fs: 15, mono: true }); });
  s += R(380, 56, 750, 220, { c: 'lx', dash: true, r: 12, fill: 'rgba(245,183,0,.05)' }) + T(400, 88, 'Máy ảo tiện ích nhẹ (Microsoft quản lý, không cần cấu hình)', { fs: 16, b: true, c: 'lx' });
  s += R(400, 104, 710, 44, { c: 'ora', r: 8 }) + T(420, 132, 'NHÂN LINUX THẬT — Microsoft build từ kernel.org, cập nhật qua Windows Update', { fs: 14.5, c: 'ora', b: true });
  [['Ubuntu', 'ext4 riêng · ~/du-an', 'grn'], ['Debian', 'distro thứ hai', 'tea'], ['docker-desktop', 'nếu cài Docker', 'vio']].forEach(([t, d, c], i) => {
    const x = 400 + i * 240;
    s += R(x, 166, 220, 92, { c, r: 10 }) + T(x + 14, 196, t, { fs: 17, b: true, c }) + T(x + 14, 222, d, { fs: 14, c: 'mu' }) + T(x + 14, 244, 'systemd khi bật', { fs: 13, c: 'dim' });
  });
  s += A(322, 166, 396, 166, { c: 'lx' }) + A(396, 196, 322, 196, { c: 'lx' });
  s += T(575, 324, 'Mỗi distro chạy như một container cô lập bên trong CÙNG một máy ảo (theo tài liệu Microsoft, 09/2026)', { fs: 15, a: 'middle', c: 'mu' });
  return sv(1150, 334, s);
};

/* Slide 19 — hai hệ thống file */
const haiHeFile = () => {
  let s = '';
  s += R(0, 10, 500, 200, { c: 'blu', r: 14 }) + T(20, 44, 'Ổ Windows (NTFS)', { fs: 19, b: true, c: 'blu' });
  s += T(20, 80, 'C:\\Users\\an\\du-an', { fs: 16, mono: true }) + T(20, 110, 'trong WSL thấy là /mnt/c/Users/an/du-an', { fs: 14.5, c: 'mu', mono: true });
  s += T(20, 150, 'không phân biệt hoa/thường · quyền rwx', { fs: 14.5, c: 'mu' }) + T(20, 174, 'không có sẵn (cần metadata)', { fs: 14.5, c: 'mu' });
  s += R(650, 10, 500, 200, { c: 'grn', r: 14 }) + T(670, 44, 'Ổ Linux của distro (ext4)', { fs: 19, b: true, c: 'grn' });
  s += T(670, 80, '/home/an/du-an', { fs: 16, mono: true }) + T(670, 110, 'từ Windows: \\\\wsl$\\Ubuntu\\home\\an', { fs: 14.5, c: 'mu', mono: true });
  s += T(670, 150, 'phân biệt hoa/thường · chmod +x giữ nguyên', { fs: 14.5, c: 'mu' }) + T(670, 174, 'git, npm, apt chạy ở tốc độ Linux', { fs: 14.5, c: 'mu' });
  s += `<path d="M502 110 L646 110" stroke="${D.red}" stroke-width="4" stroke-dasharray="10 7" marker-end="url(#m-red)" marker-start="url(#m-red)"/>`;
  s += T(575, 96, 'đi qua ranh', { fs: 14, a: 'middle', c: 'red', b: true }) + T(575, 138, 'CHẬM', { fs: 18, a: 'middle', c: 'red', b: true });
  s += R(120, 236, 910, 58, { c: 'lx', fill: 'rgba(245,183,0,.08)', r: 10 });
  s += T(575, 262, 'Làm bằng lệnh Linux ⇒ để file trong ~ của Linux. Làm bằng PowerShell ⇒ để file ở C:\\.', { fs: 16, a: 'middle', c: 'lx', b: true });
  s += T(575, 284, '(khuyến nghị của Microsoft — "Working across file systems")', { fs: 13.5, a: 'middle', c: 'mu' });
  return sv(1150, 300, s);
};

/* Slide 28 — chọn công cụ nào */
const chon = () => {
  const rows = [
    ['Script deploy chạy trên VPS Ubuntu', 'bash (#!/usr/bin/env bash)', 'grn', 'máy chủ chỉ có bash; Chương 7'],
    ['Học khoá này trên laptop Windows', 'WSL2 + Ubuntu', 'grn', 'Linux thật, output khớp bài'],
    ['Chỉ cần git + vài lệnh trên Windows', 'Git Bash', 'tea', 'nhẹ, đi kèm Git for Windows'],
    ['Tự động hoá chính Windows (dịch vụ, registry, AD)', 'PowerShell 7', 'blu', 'đối tượng .NET, cmdlet của Windows'],
    ['Dựng máy Mac mới cho cả nhóm', 'zsh + Homebrew + Brewfile', 'vio', 'brew bundle cài lại một lệnh'],
    ['Script cả nhóm chạy trên Mac, Linux, WSL', 'bash ≥ 4 + dò khả năng', 'amb', 'kiểm BASH_VERSINFO, gsed/sed'],
  ];
  let s = T(10, 22, 'Việc bạn cần làm', { fs: 14, c: 'mu' }) + T(560, 22, 'Dùng', { fs: 14, c: 'mu' }) + T(860, 22, 'Vì sao', { fs: 14, c: 'mu' });
  rows.forEach(([v, d, c, why], i) => {
    const y = 34 + i * 66;
    s += R(0, y, 500, 54, { c: 'bd', r: 10, sw: 1.5 }) + T(16, y + 33, v, { fs: 16 });
    s += A(504, y + 27, 546, y + 27, { c, sw: 2.5 });
    s += R(550, y, 290, 54, { c, r: 10, fill: `color-mix(in srgb,${D[c]} 14%,#0d130f)` }) + T(566, y + 33, d, { fs: 15.5, b: true, c, mono: true });
    s += T(860, y + 33, why, { fs: 14.5, c: 'mu' });
  });
  return sv(1150, 434, s);
};

export const slides = S([
  cover({ t: 'Chương 15 — Dùng kỹ năng Linux trên macOS và Windows', sub: 'macOS là Unix · zsh vs bash · BSD vs GNU · Homebrew · launchd · WSL2 · CRLF · PowerShell cho người biết bash', chap: 'CHƯƠNG 15' }),

  { t: 'Bản đồ chương: một kỹ năng, ba hệ điều hành', body: mindmap('Linux ở mọi nơi', 'biết chỗ GIỐNG, thuộc chỗ KHÁC', [
    { t: '15.1 macOS: zsh', d: 'Darwin · UNIX 03 · zsh từ 2019 · bash 3.2 · mảng từ 1', c: 'lx' },
    { t: '15.1 BSD vs GNU', d: 'sed -i · date -v · stat -f · grep -P · script chạy hai nơi', c: 'amb' },
    { t: '15.2 Công cụ Mac', d: 'Homebrew · Brewfile · gnubin · launchd · pbcopy, open, mdfind…', c: 'grn' },
    { t: '15.3 WSL2', d: 'máy ảo Linux thật · ~ chứ không /mnt/c · wsl.conf · .wslconfig', c: 'blu' },
    { t: '15.3 CRLF', d: "$'\\r' · dos2unix · core.autocrlf · .gitattributes", c: 'red' },
    { t: '15.4 PowerShell', d: 'đối tượng trong ống dẫn · bảng dịch · pwsh 7 · execution policy', c: 'vio' },
  ]) },

  /* ───────────── 15.1 ───────────── */
  { t: 'macOS là Unix có chứng nhận — nhưng không phải Linux', body: FIX + two(
    hoUnix(),
    `${term(['$ sw_vers', 'ProductName:\t\tmacOS', 'ProductVersion:\t\t27.0', 'BuildVersion:\t\t26A428', '$ uname -srm', '= Darwin 27.0.0 arm64', '$ uname -v | cut -c1-60', 'Darwin Kernel Version 27.0.0: Tue Aug 11 21:22:49 PDT 2026;', '$ ls /proc', '! ls: /proc: No such file or directory'], { title: 'Mac M1 — output thật', fs: 14 })}
    ${box('info', 'The Open Group liệt kê <b>macOS 26 Tahoe trên Mac Apple silicon</b> đạt chứng nhận <b>UNIX 03</b> (đăng ký 29/08/2025). Linux phần lớn KHÔNG đi xin chứng nhận này — nhưng máy chủ thì chạy Linux.')}`, 'l') },

  { t: 'zsh mặc định từ 2019 vì bash mới là GPLv3', body: FIX + `${mocShell()}
    ${two(
      term(['$ echo $SHELL', '/bin/zsh', '$ zsh --version', 'zsh 5.9 (arm64-apple-darwin26.0)', '$ /bin/bash --version | head -1', '! GNU bash, version 3.2.57(1)-release (arm64-apple-darwin26)', '$ brew info bash | head -1', '+ ==> bash: stable 5.3.20 (bottled), HEAD'], { title: 'Mac M1 — output thật', fs: 14 }),
      box('warn', 'Mọi thứ bash 4–5 thêm vào (<code>declare -A</code>, <code>mapfile</code>, <code>${x^^}</code>, <code>**</code> với <code>globstar</code>, <code>${arr[-1]}</code>) đều <b>vỡ</b> trên <code>/bin/bash</code> của Mac. Apple giữ bash 3.2 vì nó là bản cuối còn giấy phép GPLv2 — và đổi shell mặc định sang zsh (giấy phép kiểu MIT).'))}` },

  { t: 'zsh không phải bash: bốn chỗ hay vấp', body: FIX + two(
    `${sh([['arr=(tao cam le)', ''], ['echo "${arr[1]} ${arr[0]}"', 'phần tử ĐẦU là số mấy?'], ['v="mot hai ba"', ''], ['for w in $v; do echo "tu: $w"; done', 'có tách từ không?'], ['ls *.log', 'không có file .log nào']], { fs: 14.5 })}
    ${two(term(['$ zsh -f z1.sh', '+ tao ', 'tu: mot hai ba', '! z1.sh:5: no matches found: *.log'], { title: 'Mac — zsh 5.9', fs: 13.5 }),
      term(['$ /bin/bash z1.sh', '+ cam tao', 'tu: mot', 'tu: hai', 'tu: ba', 'ls: *.log: No such file or directory'], { title: 'Mac — bash 3.2', fs: 13.5 }))}`,
    table(['Chỗ vấp', 'zsh mặc định', 'Muốn giống bash'], [
      ['Chỉ số mảng', '!bắt đầu từ <b>1</b>', '<code>setopt KSH_ARRAYS</code>'],
      ['<code>$v</code> không nháy', '!KHÔNG tách từ', '<code>${=v}</code> tách một chỗ'],
      ['Glob không khớp', '!báo lỗi, bỏ lệnh', '<code>setopt NULL_GLOB</code> / <code>NO_NOMATCH</code>'],
      ['<code>#</code> trong dòng gõ tay', '!không phải chú thích', '<code>setopt interactivecomments</code>'],
      ['Chạy đoạn sh trong hàm', '—', '<code>emulate -L sh</code>'],
      ['Mảng kết hợp', '+có sẵn: <code>typeset -A</code>', 'bash 3.2 thì KHÔNG'],
    ], { sm: true }), 'l') },

  { t: 'BSD vs GNU: cùng tên lệnh, khác cờ', body: FIX + table(['Việc', 'Ubuntu (GNU) — đo thật', 'macOS (BSD) — đo thật', 'Chạy được cả hai'], [
    ['Sửa file tại chỗ', '<code>sed -i \'s/a/b/\' f</code>', '<code>sed -i \'\' \'s/a/b/\' f</code>', '<code>sed -i.bak …</code> (cả hai hiểu)'],
    ['Ngày mai', '<code>date -d tomorrow +%F</code>', '<code>date -v+1d +%F</code>', 'thử <code>-d</code>, hỏng thì <code>-v</code>'],
    ['Kích thước file', '<code>stat -c %s f</code>', '<code>stat -f %z f</code>', '<code>wc -c &lt; f</code>'],
    ['Regex Perl', '<code>grep -oP \'\\d+(?=ms)\'</code>', '-<code>grep: invalid option -- P</code>', '<code>grep -oE</code> hoặc <code>perl -nle</code>'],
    ['In theo mẫu khi tìm', '<code>find … -printf \'%s %p\\n\'</code>', '-<code>unknown primary or operator</code>', '<code>find … -exec stat …</code>'],
    ['Giới hạn thời gian', '<code>timeout 5 cmd</code> (mã 124)', '-<code>command not found</code>', '<code>gtimeout</code> (brew coreutils)'],
    ['Bỏ dòng cuối', '<code>head -n -1</code>', '-<code>illegal line count -- -1</code>', '<code>sed \'$d\'</code>'],
    ['Đảo thứ tự dòng', '<code>tac</code>', '<code>tail -r</code>', '<code>awk</code> gom rồi in ngược'],
    ['Cỡ thư mục (byte)', '<code>du -sb</code>', '<code>du -sk</code> (KB, không có -b)', '<code>du -sk</code>'],
  ], { sm: true }) },

  { t: 'Lỗi thật khi đem lệnh GNU sang Mac', body: FIX + two(
    term(['$ sed -i \'s/yes/no/\' m.conf', '! sed: 1: "m.conf', '! ": invalid command code m', '$ date -d tomorrow +%F', '! date: illegal option -- d', '$ stat -c %s m.conf', '! stat: illegal option -- c', '$ echo id=42ms | grep -oP \'\\d+(?=ms)\'', '! grep: invalid option -- P', '$ timeout 1 true', '! zsh: command not found: timeout'], { title: 'Mac M1 — công cụ BSD của Apple', fs: 14 }),
    `${box('bad', '<b>Đọc lỗi đầu tiên cho đúng:</b> <code>invalid command code m</code> — BSD sed coi <code>\'s/yes/no/\'</code> là <b>đuôi file sao lưu</b> (đối số của <code>-i</code>), rồi đọc <code>m.conf</code> như KỊCH BẢN sed: lệnh <code>m</code> không tồn tại.')}
    ${term(['$ sed --version', '! sed: illegal option -- -', '$ grep --version', 'grep (BSD grep, GNU compatible) 2.6.0-FreeBSD', '$ sed --version        # Ubuntu', '= sed (GNU sed) 4.9'], { title: 'Hỏi thẳng: đây là bản nào?', fs: 14 })}`) },

  { t: 'Có thứ đã giống — và có thứ khác mà IM LẶNG', body: FIX + two(
    `${table(['Lệnh trên macOS 27', 'Kết quả đo'], [
      ['<code>readlink -f ../lx-15/m.conf</code>', '+chạy (đường tuyệt đối)'],
      ['<code>ls --color=auto</code>', '+chạy'],
      ['<code>sed -E \'s/(y|n)o/X/\'</code>', '+chạy (ERE cả hai)'],
      ['<code>sort --version</code>', '+<code>2.3-Apple</code> (gốc GNU)'],
      ['<code>xargs -r</code>', '+nhận cờ, không lỗi'],
      ['<code>ls --time-style=…</code>', '-<code>unrecognized option</code>'],
      ['<code>du -sb</code>', '-<code>invalid option -- b</code>'],
    ], { sm: true })}
    ${box('tip', 'Bài cũ trên mạng hay nói "Mac không có <code>readlink -f</code>" — đo lại trước khi tin: trên macOS 27 nó chạy.')}`,
    `${two(term(['$ printf \'\' | xargs echo chay', '= chay'], { title: 'Ubuntu — GNU xargs', fs: 12 }), term(['$ printf \'\' | xargs echo chay', '# (không in gì)'], { title: 'Mac — BSD xargs', fs: 12 }))}
    ${two(term(['$ echo g/**/*.log', 'g/a/y.log', '$ shopt -s globstar', '! shopt: globstar: invalid', '! shell option name'], { title: 'Mac — bash 3.2', fs: 13.5 }), term(['$ print -l g/**/*.log', 'g/a/b/z.log', 'g/a/y.log', 'g/x.log'], { title: 'Mac — zsh 5.9', fs: 13.5 }))}
    ${box('warn', 'Đầu vào rỗng: GNU <code>xargs</code> vẫn chạy lệnh MỘT lần, BSD thì không. Cùng một script, khác kết quả, <b>không có lỗi nào</b>.')}`) },

  { t: 'Script chạy cả hai nơi: dò khả năng, đừng dò tên máy', body: FIX + two(
    sh([
      ['#!/usr/bin/env bash', 'bash đầu tiên trong PATH'],
      ['set -euo pipefail', ''],
      ['case "$(uname -s)" in', ''],
      ['  Darwin) OS=mac ;;', ''],
      ['  Linux) grep -qi microsoft /proc/version \\', 'WSL có chữ này'],
      ['     2>/dev/null && OS=wsl || OS=linux ;;', ''],
      ['  MINGW*|MSYS*|CYGWIN*) OS=windows-bash ;;', 'Git Bash'],
      ['esac', ''],
      ['sedi() { if sed --version >/dev/null 2>&1', 'hỏi sed: GNU?'],
      ['  then sed -i "$@"; else sed -i \'\' "$@"; fi; }', ''],
      ['ngay_mai() { date -d tomorrow +%F 2>/dev/null \\', 'thử GNU trước'],
      ['  || date -v+1d +%F; }', 'hỏng thì BSD'],
      ['kich_thuoc() { stat -c %s "$1" 2>/dev/null \\', ''],
      ['  || stat -f %z "$1"; }', ''],
    ], { fs: 13 }),
    `${term(['$ /bin/bash hai-noi.sh', '= OS=mac bash=3.2.57 ngay_mai=2026-09-29 size=8 mode=no'], { title: 'Mac M1', fs: 13.5 })}
    ${term(['$ bash hai-noi.sh', '= OS=linux bash=5.2.21 ngay_mai=2026-09-29 size=8 mode=no'], { title: 'Ubuntu 24.04', fs: 13.5 })}
    ${sh([['if (( BASH_VERSINFO[0] < 4 )); then', 'cần bash 4+?'], ['  echo "Can bash >= 4, dang chay $BASH_VERSION" >&2', ''], ['  exit 2', 'dừng SỚM, nói rõ'], ['fi', '']], { fs: 13.5 })}
    ${term(['$ /bin/bash can-bash4.sh; echo rc=$?', '! Can bash >= 4, dang chay 3.2.57(1)-release (/bin/bash)', 'rc=2'], { title: 'Mac — thay vì "declare: -A: invalid option" ở dòng 40', fs: 13 })}`, 'l') },

  /* ───────────── 15.2 ───────────── */
  { t: 'Homebrew: trình quản lý gói mà macOS không có sẵn', body: FIX + two(
    diagram({ w: 560, h: 420, nodes: [
      { id: 'b', x: 150, y: 0, w: 260, h: 70, t: 'brew install bash', d: 'tải bottle (gói dựng sẵn)', c: 'lx', mono: true },
      { id: 'c', x: 0, y: 150, w: 260, h: 80, t: 'Cellar/bash/5.3.20', d: '/opt/homebrew/Cellar', c: 'amb' },
      { id: 'o', x: 300, y: 150, w: 260, h: 80, t: 'opt/bash', d: 'liên kết tới bản đang dùng', c: 'tea' },
      { id: 'p', x: 150, y: 310, w: 260, h: 80, t: '/opt/homebrew/bin/bash', d: 'nằm TRƯỚC /bin trong PATH', c: 'grn', mono: true },
    ], edges: [{ from: 'b', to: 'c', t: 'giải nén', off: 8 }, { from: 'c', to: 'o', t: 'link', off: -8 }, { from: 'o', to: 'p', t: 'symlink', off: 8 }] }),
    `${term(['$ brew --prefix', '/opt/homebrew', '$ brew --version', 'Homebrew 7.0.6', '$ brew list --formula | wc -l', '     123', '$ brew info coreutils | head -1', '+ ==> coreutils: stable 9.12 (bottled), HEAD', '$ command -v gsed gtimeout; echo $?', '! 1'], { title: 'Mac M1 — chỉ lệnh ĐỌC', fs: 14 })}
    ${box('info', 'Apple silicon: <code>/opt/homebrew</code>. Mac Intel: <code>/usr/local</code>. Không bao giờ ghi vào <code>/usr/bin</code> — Apple khoá thư mục đó (SIP).')}`, 'r') },

  { t: 'GNU trên Mac: gọi tên có chữ g, hoặc đặt gnubin trước', body: FIX + two(
    `${sh([
      ['brew install coreutils gnu-sed grep findutils', 'bản GNU, tên có g'],
      ['gsed --version | head -1', 'GNU sed'],
      ['gdate -d tomorrow +%F', 'date của GNU'],
      ['gtimeout 5 ./chay-lau.sh', 'timeout có rồi'],
      ['# muốn gõ tên gốc? đặt gnubin ĐẦU PATH:', ''],
      ['P=$(brew --prefix)/opt', ''],
      ['export PATH="$P/coreutils/libexec/gnubin:$PATH"', 'trong ~/.zshrc'],
      ['export PATH="$P/gnu-sed/libexec/gnubin:$PATH"', ''],
    ], { fs: 14 })}
    ${box('warn', 'gnubin đầu PATH đổi <b>mọi</b> <code>sed</code>/<code>date</code> trong shell của bạn — kể cả script của Apple hay trình cài đặt chờ BSD. Script chia sẻ cho nhóm: dò <code>command -v gsed</code>, đừng giả định PATH của bạn.')}`,
    `${code(`# Brewfile — commit vào repo của nhóm
brew "bash"
brew "coreutils"
brew "gnu-sed"
brew "jq"
brew "shellcheck"
cask "visual-studio-code"`, 'ruby')}
    ${sh([['brew bundle install', 'cài ĐỦ theo Brewfile'], ['brew bundle check', 'còn thiếu gói nào?'], ['brew bundle dump --file=Brewfile', 'chụp máy hiện tại']], { fs: 14 })}
    ${box('tip', 'Brewfile là "package.json của cả máy": bạn mới vào nhóm chạy MỘT lệnh là đủ công cụ, cùng phiên bản lớn với mọi người.')}`) },

  { t: 'launchd thay cả systemd lẫn cron trên Mac', body: FIX + table(['Việc', 'Linux (Chương 11)', 'macOS (launchd)'], [
    ['Mô tả một dịch vụ', 'file unit <code>.service</code> (INI)', 'file <code>.plist</code> (XML), khoá <code>Label</code>'],
    ['Chạy lệnh gì', '<code>ExecStart=</code>', '<code>ProgramArguments</code> (mảng, không qua shell)'],
    ['Tự khởi động lại', '<code>Restart=always</code>', '<code>KeepAlive</code> = true'],
    ['Chạy lúc khởi động', '<code>WantedBy=</code> + enable', '<code>RunAtLoad</code> = true'],
    ['Hẹn giờ (cron / timer)', '<code>OnCalendar=</code> · crontab', '<code>StartCalendarInterval</code> · <code>StartInterval</code>'],
    ['Biến môi trường', '<code>Environment=</code>', '<code>EnvironmentVariables</code> (dict)'],
    ['Log', 'journald', '<code>StandardOutPath</code> / <code>StandardErrorPath</code>'],
    ['Của một người dùng', '<code>systemctl --user</code>', '<code>~/Library/LaunchAgents</code> · miền <code>gui/501</code>'],
    ['Của cả máy (root)', '<code>/etc/systemd/system</code>', '<code>/Library/LaunchDaemons</code> · miền <code>system</code>'],
    ['Nạp / gỡ / xem', '<code>enable --now</code> · <code>disable</code> · <code>status</code>', '<code>launchctl bootstrap</code> · <code>bootout</code> · <code>print</code>'],
  ], { sm: true }) },

  { t: 'Một LaunchAgent thật: brew services viết plist hộ bạn', body: FIX + two(
    term(['$ brew services list', 'Name          Status  User  File', 'postgresql@14 started admin …/homebrew.mxcl.postgresql@14.plist', 'redis         none', '$ launchctl list | grep postgres', '2720\t0\thomebrew.mxcl.postgresql@14', '$ launchctl list | wc -l', '     567'], { title: 'Mac M1 — output thật (CHỈ đọc)', fs: 13 }),
    `${term(['$ launchctl print gui/501/homebrew.mxcl.postgresql@14', '  type = LaunchAgent', '+   state = running', '  program = …/opt/postgresql@14/bin/postgres', '  stdout path = …/var/log/postgresql@14.log', '  default environment = {', '!     PATH => /usr/bin:/bin:/usr/sbin:/sbin', '  }', '  runs = 1', '  last exit code = (never exited)', '  properties = keepalive | runatload | …'], { title: 'Mac M1 — cắt dòng …', fs: 13 })}
    ${box('warn', 'PATH mặc định của launchd là <code>/usr/bin:/bin:/usr/sbin:/sbin</code> — KHÔNG có <code>/opt/homebrew/bin</code>. Y hệt bài học cron ở Chương 8: đường tuyệt đối, hoặc khai <code>EnvironmentVariables</code>.')}`, 'l') },

  { t: 'Tự viết plist: plutil -lint trước khi nạp', body: FIX + two(
    code(`<plist version="1.0">
<dict>
  <key>Label</key>
  <string>vn.cuongthai.sao-luu</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>/Users/an/bin/sao-luu.sh</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>   <integer>3</integer>
    <key>Minute</key> <integer>0</integer>
  </dict>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>/opt/homebrew/bin:/usr/bin:/bin</string>
  </dict>
  <key>StandardErrorPath</key>
  <string>/tmp/sao-luu.log</string>
</dict>
</plist>`, 'xml').replace('class="c-code"', 'class="c-code" style="font-size:12.5px;line-height:1.32"'),
    `${term(['$ plutil -lint vn.cuongthai.sao-luu.plist', '= vn.cuongthai.sao-luu.plist: OK', '$ plutil -lint hong.plist', '! hong.plist: (Close tag on line 14 does not match', '! open tag integer)'], { title: 'Mac — plutil đọc file trong thư mục thử', fs: 13.5 })}
    ${sh([
      ['cp vn.cuongthai.sao-luu.plist ~/Library/LaunchAgents/', ''],
      ['launchctl bootstrap gui/$(id -u) \\', 'NẠP (thay load)'],
      ['  ~/Library/LaunchAgents/vn.cuongthai.sao-luu.plist', ''],
      ['launchctl kickstart -k gui/$(id -u)/vn.cuongthai.sao-luu', 'chạy thử ngay'],
      ['launchctl print gui/$(id -u)/vn.cuongthai.sao-luu', 'last exit code'],
      ['launchctl bootout gui/$(id -u)/vn.cuongthai.sao-luu', 'GỠ (thay unload)'],
    ], { fs: 12 })}
    ${box('info', 'Bài này chỉ IN các lệnh nạp — không nạp agent nào trên máy thật. <code>man launchctl</code> xếp <code>load</code>/<code>unload</code> vào mục LEGACY, khuyên dùng <code>bootstrap</code>/<code>bootout</code>.')}`, 'l') },

  { t: 'Những lệnh chỉ Mac mới có — và đáng thuộc', body: FIX + two(
    cards([
      { ic: '📋', t: '<code>pbcopy</code> · <code>pbpaste</code>', d: 'ống dẫn ⇄ khay nhớ tạm: <code>cat id_ed25519.pub | pbcopy</code>', c: 'amb' },
      { ic: '📂', t: '<code>open</code>', d: '<code>open .</code> Finder · <code>open -a "Visual Studio Code" .</code> · <code>open URL</code>', c: 'blu' },
      { ic: '🔎', t: '<code>mdfind</code>', d: 'tìm bằng chỉ mục Spotlight, nhanh hơn <code>find</code> cả ổ', c: 'tea' },
      { ic: '☕', t: '<code>caffeinate</code>', d: '<code>caffeinate -i ./build.sh</code> — máy không ngủ khi việc còn chạy', c: 'grn' },
      { ic: '⚙️', t: '<code>defaults</code>', d: 'đọc/ghi thiết lập ứng dụng (file .plist) từ terminal', c: 'vio' },
      { ic: '🔐', t: '<code>security</code>', d: 'Keychain: giữ token ngoài file .env', c: 'pnk' },
    ], 2),
    term(['$ echo "lenh da chep" | pbcopy -pboard ruler', '$ pbpaste -pboard ruler', 'lenh da chep', '$ mdfind -onlyin /System/Applications -name Calculator', '/System/Applications/Calculator.app', '$ caffeinate -i -t 4 & P=$!', '$ pmset -g assertions | grep "pid $P("', 'pid 21780(caffeinate): … PreventUserIdleSystemSleep', '$ defaults read -g AppleLocale', 'en_VN', '$ security add-generic-password -a an \\', '    -s lx15-demo-api -w \'xxxx-token-thu\' "$K"', '$ security find-generic-password -s lx15-demo-api -w "$K"', '= xxxx-token-thu'], { title: 'Mac M1 — output thật; keychain thử ở thư mục scratch', fs: 13 }), 'l') },

  { t: 'Dịch lệnh chẩn đoán Linux → macOS', body: FIX + table(['Muốn biết', 'Linux (Ubuntu)', 'macOS — đo trên Mac M1'], [
    ['Phiên bản hệ điều hành', '<code>cat /etc/os-release</code>', '<code>sw_vers</code>'],
    ['Số nhân · RAM', '<code>nproc</code> · <code>free -h</code>', '<code>sysctl -n hw.ncpu hw.memsize</code> · <code>vm_stat</code>'],
    ['Áp lực bộ nhớ', '<code>free</code> cột available', '<code>memory_pressure</code> (→ <code>free percentage: 45%</code>)'],
    ['Đĩa và phân vùng', '<code>lsblk</code> · <code>df -h</code>', '<code>diskutil list</code> · <code>df -h</code>'],
    ['Ai nghe cổng', '<code>ss -tlnp</code>', '<code>lsof -nP -iTCP -sTCP:LISTEN</code>'],
    ['Log hệ thống', '<code>journalctl -u X</code>', '<code>/usr/bin/log show --last 1h --predicate …</code>'],
    ['Dịch vụ', '<code>systemctl status X</code>', '<code>launchctl print gui/$(id -u)/X</code>'],
    ['Mạng', '<code>ip a</code> · <code>ip route</code>', '<code>ifconfig</code> · <code>netstat -rn</code>'],
    ['Thông tin tiến trình', '<code>/proc/PID/…</code>', '-không có <code>/proc</code>: <code>ps -o</code> · <code>lsof -p</code>'],
    ['Cài gói', '<code>apt install</code>', '<code>brew install</code>'],
  ], { sm: true }) },

  /* ───────────── 15.3 ───────────── */
  { t: 'Ba cách có bash trên Windows — chỉ một cách là Linux', body: FIX + `${cards([
      { ic: '🐧', t: 'WSL2 + Ubuntu', d: 'nhân Linux THẬT trong máy ảo nhẹ. <code>apt</code>, <code>systemd</code>, Docker, mọi lệnh của khoá này chạy y như trên VPS. <strong>Chọn cái này để học và làm đồ án.</strong>', c: 'grn' },
      { ic: '🌿', t: 'Git Bash (Git for Windows)', d: 'bash + bộ công cụ nhỏ dựng trên MSYS2, chạy thẳng trên Windows. Đủ cho <code>git</code>, <code>ls</code>, <code>grep</code>; KHÔNG có <code>apt</code>, <code>systemd</code>, <code>/proc</code> thật.', c: 'tea' },
      { ic: '🧰', t: 'MSYS2 · Cygwin', d: 'môi trường kiểu Unix trên Windows, có trình quản lý gói (<code>pacman</code>). Hợp để biên dịch phần mềm cho Windows, không phải để giả lập máy chủ.', c: 'amb' },
      { ic: '🔷', t: 'PowerShell (không phải bash)', d: 'shell gốc của Windows. PowerShell 7 (<code>pwsh</code>) chạy cả trên Mac/Linux. Bài 15.4.', c: 'blu' },
    ], 4)}
    ${table(['Hỏi', 'WSL2', 'Git Bash'], [
      ['<code>uname -s</code> in ra', 'Linux', 'MINGW64_NT-…'],
      ['Chạy được <code>deploy.sh</code> dùng <code>apt</code>/<code>systemctl</code>?', '+có', '-không'],
      ['Đường dẫn C:', '<code>/mnt/c/…</code>', '<code>/c/…</code>'],
    ], { sm: true })}` },

  { t: 'WSL2 là một máy ảo Linux thật — chỉ là rất nhẹ', body: FIX + `${wslSvg()}
    ${two(
      sh([['wsl --install', 'một lần, PowerShell Admin'], ['wsl -l -v', 'NAME · STATE · VERSION'], ['wsl --set-version Ubuntu 2', 'đổi WSL1 → 2'], ['wsl --shutdown', 'tắt hẳn máy ảo'], ['wsl -d Ubuntu -u root', 'distro + user']], { fs: 13.5, so: false }),
      box('info', 'Lệnh <code>wsl</code> gõ ở PowerShell/CMD; từ bên trong Linux thì gõ <code>wsl.exe</code>. Cần Windows 10 bản 2004 (build 19041) trở lên hoặc Windows 11. Nguồn: learn.microsoft.com, 09/2026 — khoá không có máy Windows để in output.'))}` },

  { t: 'Để mã nguồn trong ~ của Linux, đừng để ở /mnt/c', body: FIX + `${haiHeFile()}
    ${two(
      sh([['cd ~ && mkdir -p du-an && cd du-an', 'ở phía Linux'], ['git clone https://github.com/…/swp391.git', ''], ['code .', 'VS Code mở qua WSL'], ['explorer.exe .', 'Explorer mở thư mục này']], { fs: 13.5 }),
      sh([['wslpath -w ~/du-an', 'đường Linux → Windows'], ["wslpath 'C:\\Users\\an'", 'Windows → /mnt/c/…'], ['ls -la | findstr.exe foo', 'trộn lệnh Linux + Windows'], ['echo "$PATH" | tr : "\\n" | grep mnt/c', 'PATH Windows bị nối vào']], { fs: 13.5 }))}` },

  { t: 'wsl.conf cho MỘT distro, .wslconfig cho CẢ máy ảo', body: FIX + two(
    `${code(`# /etc/wsl.conf — BÊN TRONG distro (sudo nano)
[boot]
systemd=true

[interop]
appendWindowsPath=false   # PATH sạch, không /mnt/c/…

[automount]
options="metadata,umask=022"  # chmod có tác dụng trên /mnt/c

[user]
default=an`, 'ini')}
    ${box('tip', 'Ubuntu cài bằng <code>wsl --install</code> hiện đã bật systemd sẵn (Mục 0.3). Kiểm: <code>ps -p 1 -o comm=</code> in <code>systemd</code>.')}`,
    `${code(`# %UserProfile%\\.wslconfig — phía WINDOWS
[wsl2]
memory=4GB          # mặc định: 50% RAM Windows
processors=2
networkingMode=mirrored   # Windows 11 22H2+
                          # localhost hai chiều, IPv6`, 'ini')}
    ${box('warn', '<b>Luật 8 giây:</b> sửa xong phải đợi máy ảo tắt HẲN (khoảng 8 giây sau khi đóng mọi cửa sổ), hoặc chạy <code>wsl --shutdown</code>. Đóng cửa sổ rồi mở lại ngay ⇒ cấu hình cũ vẫn chạy.')}
    ${box('info', 'Mặc định mạng là NAT: Windows gọi được <code>localhost:3000</code> của Linux, chiều ngược lại phải dùng IP của Windows. <code>mirrored</code> cho cả hai chiều dùng <code>127.0.0.1</code>.')}`) },

  { t: "CRLF: script của bạn Windows vỡ trên Linux", body: FIX + two(
    term(['$ ./deploy.sh', '! bash: ./deploy.sh: cannot execute: required file not found', '$ bash deploy.sh', "! deploy.sh: line 2: $'\\r': command not found", 'Xin chao', "! deploy.sh: line 4: cd: $'/tmp\\r': No such file or directory", '$ file deploy.sh', 'deploy.sh: Bourne-Again shell script, ASCII text executable,', '+ with CRLF line terminators', '$ cat -A deploy.sh | head -2', '#!/bin/bash^M$', '^M$', '$ head -1 deploy.sh | xxd', '00000000: 2321 2f62 696e 2f62 6173 680d 0a  #!/bin/bash..'], { title: 'Ubuntu 24.04 — dựng lại thật', fs: 13 }),
    `${table(['Lỗi bạn thấy', 'Vì sao'], [
      ['<code>required file not found</code>', 'kernel tìm trình thông dịch tên <code>/bin/bash\\r</code>'],
      ["<code>$'\\r': command not found</code>", 'dòng trống thật ra chứa <code>\\r</code>'],
      ["<code>cd: $'/tmp\\r'</code>", '<code>\\r</code> dính vào đối số cuối'],
    ], { sm: true })}
    ${sh([['dos2unix deploy.sh', 'gói dos2unix'], ["sed -i 's/\\r$//' deploy.sh", 'GNU sed, không cần cài'], ["tr -d '\\r' < a.sh > b.sh", 'chạy cả trên Mac'], ["grep -c $'\\r' deploy.sh", 'đếm dòng CRLF (ra 4)']], { fs: 14 })}
    ${term(['$ dos2unix deploy.sh', 'dos2unix: converting file deploy.sh to Unix format...', '$ ./deploy.sh', '= Xin chao'], { title: 'Ubuntu — sửa xong', fs: 13.5 })}`) },

  { t: 'Chặn CRLF từ gốc: .gitattributes thắng core.autocrlf', body: FIX + two(
    `${term(['$ git config --global core.autocrlf true   # kiểu Windows', '$ git clone -q goc may-win; cd may-win', '$ git ls-files --eol', 'i/lf    w/crlf  attr/                 README.md', '! i/lf    w/crlf  attr/                 deploy.sh', '$ printf \'*.sh text eol=lf\\n\' > .gitattributes', '$ rm deploy.sh && git checkout -- deploy.sh', '$ git ls-files --eol', 'i/lf    w/crlf  attr/                 README.md', '= i/lf    w/lf    attr/text eol=lf      deploy.sh'], { title: 'Ubuntu — giả lập máy Windows bằng autocrlf=true', fs: 12.5 })}
    ${box('info', '<code>i/</code> = trong kho (index) · <code>w/</code> = trong thư mục làm việc · <code>attr/</code> = luật đang áp. Kho vẫn LF; máy Windows nhận CRLF lúc checkout.')}`,
    `${code(`# .gitattributes — commit ở gốc repo
* text=auto
*.sh   text eol=lf
*.bash text eol=lf
Dockerfile text eol=lf
*.ps1  text eol=crlf
*.png  binary`, 'ini')}
    ${term(['$ git ls-files --eol          # kho ĐÃ lỡ chứa CRLF', '! i/crlf  w/crlf  attr/                 build.sh', '$ git add --renormalize .', '$ git status --short', 'M  build.sh', '$ git ls-files --eol', '= i/lf    w/crlf  attr/text eol=lf      build.sh'], { title: 'Ubuntu — chuẩn hoá lại file đã commit', fs: 12.5 })}
    ${box('tip', '<code>core.autocrlf</code> là thiết lập của TỪNG MÁY, bạn không kiểm soát được máy của người khác. <code>.gitattributes</code> nằm trong repo ⇒ áp cho mọi người.')}`) },

  /* ───────────── 15.4 ───────────── */
  { t: 'PowerShell chuyền ĐỐI TƯỢNG qua ống, không phải chữ', body: FIX + `
    ${pipe([{ c: 'ls -l logs', d: 'chữ: "-rw-r--r-- 1 root root 2001 … big.log"', ac: 'lx' }, { c: "sort -k5 -n", d: 'đoán cột 5 là cỡ', ac: 'amb' }, { c: 'tail -1', d: 'dòng cuối', ac: 'amb' }, { c: "awk '{print $9}'", d: 'đoán cột 9 là tên', ac: 'red' }], { mui: ['dòng chữ', 'dòng chữ', 'dòng chữ'] })}
    ${pipe([{ c: 'Get-ChildItem logs', d: 'đối tượng FileInfo có .Name .Length', ac: 'blu' }, { c: 'Sort-Object Length', d: 'sắp theo THUỘC TÍNH', ac: 'tea' }, { c: 'Select-Object -Last 1', d: 'đối tượng cuối', ac: 'tea' }, { c: 'ForEach-Object Name', d: 'lấy .Name', ac: 'grn' }], { mui: ['đối tượng', 'đối tượng', 'đối tượng'] })}
    ${two(
      term(['$ (Get-ChildItem logs)[0].GetType().FullName', 'System.IO.FileInfo', '$ Get-ChildItem logs | Get-Member -MemberType Property |', '      Select-Object -First 5 -ExpandProperty Name', 'Attributes', 'CreationTime', 'CreationTimeUtc', 'Directory', 'DirectoryName'], { title: 'PowerShell 7.6.6 trên Ubuntu — output thật', fs: 13, dir: 'PS /tmp>' }),
      box('tip', 'Bash: chữ ⇒ bạn cắt cột bằng <code>awk</code>/<code>cut</code> và cầu cho định dạng không đổi. PowerShell: đối tượng ⇒ gọi thẳng tên thuộc tính. <code>Get-Member</code> là "<code>man</code>" của một đối tượng: nó có những gì.'))}` },

  { t: 'Bảng dịch bash → PowerShell', body: FIX + table(['Việc', 'bash', 'PowerShell (bí danh trên Windows)'], [
    ['Liệt kê file', '<code>ls -la</code>', '<code>Get-ChildItem -Force</code> (<code>ls</code>, <code>dir</code>, <code>gci</code>)'],
    ['Đọc file · 20 dòng cuối', '<code>cat f</code> · <code>tail -n 20 f</code>', '<code>Get-Content f</code> · <code>Get-Content f -Tail 20</code>'],
    ['Tìm chữ', '<code>grep -n ERROR app.log</code>', '<code>Select-String ERROR app.log</code>'],
    ['Lọc · lấy cột', '<code>awk \'$5 &gt; 100\'</code> · <code>cut</code>', '<code>Where-Object Length -gt 100</code> · <code>Select-Object Name</code>'],
    ['Sắp · đếm · tổng', '<code>sort</code> · <code>wc -l</code> · <code>awk</code> cộng', '<code>Sort-Object</code> · <code>Measure-Object -Sum</code>'],
    ['Tiến trình · diệt', '<code>ps aux</code> · <code>kill PID</code>', '<code>Get-Process</code> · <code>Stop-Process -Id PID</code>'],
    ['Gọi API JSON', '<code>curl -s URL | jq .name</code>', '<code>(Invoke-RestMethod URL).name</code>'],
    ['Biến môi trường · PATH', '<code>export X=1</code> · <code>$PATH</code> (dấu <code>:</code>)', '<code>$env:X = 1</code> · <code>$env:PATH</code> (dấu <code>;</code> trên Windows)'],
    ['Mã thoát lệnh ngoài', '<code>$?</code> (số)', '<code>$LASTEXITCODE</code> (số) · <code>$?</code> (True/False)'],
    ['Lệnh là gì · trợ giúp', '<code>type -a</code> · <code>man</code>', '<code>Get-Command</code> · <code>Get-Help</code> · <code>Get-Member</code>'],
    ['Nối lệnh khi thành công', '<code>a &amp;&amp; b</code>', '<code>a &amp;&amp; b</code> — chỉ từ PowerShell 7'],
  ], { sm: true }) },

  { t: 'PowerShell 7 chạy thật trên Linux: đo trong container', body: FIX + two(
    term(['$ Select-String ERROR logs/app.log', 'logs/app.log:2:ERROR db timeout', 'logs/app.log:4:ERROR disk full', '$ Get-ChildItem logs | Where-Object Length -gt 100 |', '      ForEach-Object Name', 'big.log', '$ Get-ChildItem logs | Measure-Object Length -Sum |', '      Select-Object Count, Sum', 'Count     Sum', '-----     ---', '    2 2053.00', '$ Get-Content logs/app.log | Select-String ERROR |', '      ForEach-Object { $_.Line.Split(" ", 2)[1] }', 'db timeout', 'disk full'], { title: 'PowerShell 7.6.6 · Ubuntu 24.04 arm64', fs: 13, dir: 'PS /tmp>' }),
    `${term(['$ Get-ChildItem logs | Select-Object Name, Length |', '      ConvertTo-Json', '[', '  { "Name": "app.log", "Length": 52 },', '  { "Name": "big.log", "Length": 2001 }', ']', '$ $r = Invoke-RestMethod https://api.github.com/repos/PowerShell/PowerShell', '$ $r.full_name; $r.license.spdx_id; $r.GetType().Name', 'PowerShell/PowerShell', 'MIT', 'PSCustomObject'], { title: 'JSON ra và vào — không cần jq (JSON gộp dòng)', fs: 11.5, dir: 'PS /tmp>' })}
    ${box('info', 'Ảnh <code>mcr.microsoft.com/powershell</code> không có bản arm64 ⇒ khoá cài bản <code>linux-arm64</code> chính thức (v7.6.6) vào container Ubuntu.')}`) },

  { t: '&& của PowerShell xét LỆNH chạy được, không xét True/False', body: FIX + two(
    `${term(['$ Test-Path /khongco && "co" || "khong"', 'False', '! co', '$ if (Test-Path /khongco) { "co" } else { "khong" }', '= khong', '$ /bin/false; $?', 'False', '$ /bin/false && "chay"; "rc=$LASTEXITCODE"', 'rc=1'], { title: 'PowerShell 7.6.6 — output thật', fs: 13.5, dir: 'PS /tmp>' })}
    ${box('bad', '<code>Test-Path</code> CHẠY THÀNH CÔNG và in ra <code>False</code> ⇒ <code>&amp;&amp;</code> vẫn đi tiếp. Muốn rẽ nhánh theo giá trị: dùng <code>if</code>. Với lệnh ngoài (<code>/bin/false</code>, <code>git</code>), <code>&amp;&amp;</code> xét mã thoát như bash.')}`,
    `${term(['$ Get-Command ls, Get-ChildItem', 'CommandType Name          Source', 'Application ls            /usr/bin/ls', '     Cmdlet Get-ChildItem Microsoft.PowerShell.Management', '$ Get-Alias cat', "! Get-Alias: … an alias with the name 'cat' does not exist.", '$ Get-Alias dir, gci, echo', 'dir  Get-ChildItem', 'gci  Get-ChildItem', 'echo Write-Output'], { title: 'PowerShell trên Linux: ls là /usr/bin/ls', fs: 13, dir: 'PS /tmp>' })}
    ${box('warn', 'Trên Windows <code>ls</code>, <code>cat</code>, <code>sort</code> là bí danh của cmdlet; trên Linux/Mac thì KHÔNG (để khỏi che lệnh thật). Script <code>.ps1</code> chạy hai nơi: viết tên đầy đủ <code>Get-ChildItem</code>.')}`) },

  { t: 'Chạy script .ps1: tham số, mã thoát, execution policy', body: FIX + two(
    `${code(`# dem-loi.ps1
param(
  [string]$Path = 'logs/app.log',
  [int]$Top = 5
)
$loi = Select-String -Path $Path -Pattern 'ERROR'
if (-not $loi) {
  Write-Error "Khong co dong ERROR trong $Path"
  exit 1
}
$loi | Select-Object -First $Top | ForEach-Object Line
"Tong: $($loi.Count)"`, 'powershell')}
    ${term(['$ pwsh -File dem-loi.ps1 -Top 1; echo rc=$?', 'ERROR db timeout', 'Tong: 2', '= rc=0', '$ pwsh -File dem-loi.ps1 -Path logs/sach.log; echo rc=$?', '! Write-Error: Khong co dong ERROR trong logs/sach.log', '! rc=1'], { title: 'gọi từ bash — output thật', fs: 12.5 })}`,
    `${table(['Chính sách', 'Nghĩa', 'Mặc định ở đâu'], [
      ['<code>Restricted</code>', 'lệnh gõ tay được, script KHÔNG', '!Windows PowerShell 5.1 · máy khách'],
      ['<code>RemoteSigned</code>', 'script tải từ mạng phải có chữ ký', '!PowerShell 7.6 trên Windows · Windows Server'],
      ['<code>AllSigned</code>', 'mọi script phải ký', '—'],
      ['<code>Bypass</code>', 'không chặn, không hỏi', 'nhúng trong ứng dụng'],
      ['<code>Unrestricted</code>', 'chạy hết (hỏi với file từ mạng)', '+Mac/Linux — không đổi được'],
    ], { sm: true })}
    ${sh([['Get-ExecutionPolicy -List', 'xem mọi phạm vi'], ['Set-ExecutionPolicy RemoteSigned -Scope CurrentUser', 'không cần Admin'], ['Unblock-File .\\setup.ps1', 'bỏ dấu "tải từ mạng"']], { fs: 13, so: false })}
    ${box('warn', 'Microsoft nói thẳng: execution policy <b>không phải ranh giới bảo mật</b> — chỉ chặn chạy nhầm. Đừng hạ về <code>Unrestricted</code> cho cả máy để "chạy cho được".')}`) },

  { t: 'Khi nào dùng cái nào', body: FIX + chon() },

  { t: 'Sai lầm hay gặp khi làm việc trên Mac và Windows', body: FIX + table(['Việc làm', 'Vì sao hỏng', 'Làm thay bằng'], [
    ['<code>#!/bin/bash</code> + <code>declare -A</code>, chạy trên Mac', 'Mac: <code>/bin/bash</code> là 3.2', '<code>#!/usr/bin/env bash</code> + kiểm <code>BASH_VERSINFO</code>'],
    ['<code>sed -i \'s/…/\' f</code> trong script dùng chung', 'BSD sed ăn biểu thức làm đuôi sao lưu', '<code>sed -i.bak</code> hoặc hàm <code>sedi()</code>'],
    ['Tin mọi bài "Mac không có X"', 'macOS đổi: <code>readlink -f</code> đã có', 'chạy thử, đọc <code>man</code> trên chính máy'],
    ['Để repo ở <code>/mnt/c/…</code> rồi <code>npm install</code> trong WSL', 'mỗi lần đọc file phải đi qua ranh Windows ⇄ Linux', 'repo trong <code>~/</code> của Linux, mở bằng VS Code WSL'],
    ['Sửa <code>.wslconfig</code>, đóng cửa sổ, mở lại ngay', 'máy ảo chưa tắt (luật 8 giây)', '<code>wsl --shutdown</code> rồi mở lại'],
    ['Chỉ dặn cả nhóm "đặt autocrlf"', 'thiết lập từng máy, một người quên là CRLF vào kho', '<code>.gitattributes</code> với <code>*.sh text eol=lf</code>'],
    ['launchd agent gọi <code>node</code> không đường dẫn', 'PATH của launchd: <code>/usr/bin:/bin:/usr/sbin:/sbin</code>', 'đường tuyệt đối / <code>EnvironmentVariables</code>'],
    ['PowerShell: <code>Test-Path x &amp;&amp; …</code>', '<code>&amp;&amp;</code> xét lệnh chạy được, không xét False', '<code>if (Test-Path x) { … }</code>'],
    ['Hạ execution policy về Unrestricted cho cả máy', 'mở cửa cho script lạ, mà đó không phải cách đúng', '<code>-Scope CurrentUser RemoteSigned</code> · <code>Unblock-File</code>'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh (1/2): macOS', body: FIX + two(
    table(['Lệnh', 'Làm gì'], [
      ['<code>sw_vers</code> · <code>uname -srm</code>', 'phiên bản macOS · nhân Darwin'],
      ['<code>echo $SHELL</code> · <code>zsh -f</code>', 'shell đăng nhập · zsh không đọc rc'],
      ['<code>setopt</code> · <code>setopt KSH_ARRAYS</code>', 'tuỳ chọn đang bật · mảng từ 0'],
      ['<code>${=v}</code> · <code>emulate -L sh</code>', 'tách từ · cư xử như sh'],
      ['<code>sed -i \'\'</code> · <code>sed -i.bak</code>', 'sửa tại chỗ (BSD) · cả hai'],
      ['<code>date -v+1d</code> · <code>date -j -f</code>', 'cộng ngày · đọc ngày có định dạng'],
      ['<code>stat -f %z</code> · <code>tail -r</code>', 'cỡ file · đảo dòng'],
      ['<code>/usr/bin/log show</code>', 'log hệ thống (không phải <code>log</code> của zsh)'],
    ], { sm: true }),
    table(['Lệnh', 'Làm gì'], [
      ['<code>brew install/info/list</code>', 'cài · xem · liệt kê gói'],
      ['<code>brew bundle install/dump</code>', 'cài theo / chụp Brewfile'],
      ['<code>brew services list/start</code>', 'dịch vụ qua launchd'],
      ['<code>gsed</code> <code>gdate</code> <code>gtimeout</code>', 'bản GNU của coreutils/sed'],
      ['<code>launchctl list</code> · <code>print</code>', 'dịch vụ · chi tiết một dịch vụ'],
      ['<code>launchctl bootstrap/bootout</code>', 'nạp / gỡ agent (thay load/unload)'],
      ['<code>plutil -lint</code> · <code>-p</code>', 'kiểm · in plist'],
      ['<code>pbcopy</code> <code>open</code> <code>mdfind</code> <code>caffeinate</code>', 'khay nhớ · mở · Spotlight · chống ngủ'],
      ['<code>defaults read/write</code> · <code>security</code>', 'thiết lập · Keychain'],
    ], { sm: true })) },

  { t: 'Bảng tra nhanh (2/2): Windows, WSL, CRLF, PowerShell', body: FIX + two(
    table(['Lệnh', 'Làm gì'], [
      ['<code>wsl --install</code> · <code>wsl -l -v</code>', 'cài · xem distro và phiên bản'],
      ['<code>wsl --shutdown</code> · <code>--terminate X</code>', 'tắt máy ảo · tắt một distro'],
      ['<code>wsl --export/--import</code>', 'sao lưu / khôi phục distro (.tar)'],
      ['<code>/etc/wsl.conf</code> · <code>.wslconfig</code>', 'một distro · cả máy ảo'],
      ['<code>explorer.exe .</code> · <code>\\\\wsl$</code>', 'mở thư mục Linux từ Windows'],
      ['<code>wslpath -w</code> · <code>wslpath</code>', 'đổi đường Linux ⇄ Windows'],
      ['<code>file f</code> · <code>cat -A f</code>', 'thấy CRLF · thấy <code>^M</code>'],
      ['<code>dos2unix</code> · <code>sed -i \'s/\\r$//\'</code>', 'bỏ <code>\\r</code>'],
      ['<code>git ls-files --eol</code> · <code>add --renormalize</code>', 'xem · chuẩn hoá kiểu xuống dòng'],
    ], { sm: true }),
    table(['PowerShell', 'Làm gì'], [
      ['<code>Get-Command</code> · <code>Get-Help</code> · <code>Get-Member</code>', 'là gì · trợ giúp · có thuộc tính gì'],
      ['<code>Get-ChildItem</code> · <code>Get-Content -Tail</code>', 'ls · tail'],
      ['<code>Select-String</code>', 'grep'],
      ['<code>Where-Object</code> · <code>Select-Object</code>', 'lọc · chọn cột / đầu / cuối'],
      ['<code>Sort-Object</code> · <code>Measure-Object</code>', 'sắp · đếm/tổng'],
      ['<code>ForEach-Object</code> · <code>$_</code>', 'làm với từng đối tượng'],
      ['<code>Invoke-RestMethod</code> · <code>ConvertTo-Json</code>', 'gọi API · xuất JSON'],
      ['<code>$env:X</code> · <code>$LASTEXITCODE</code>', 'biến môi trường · mã thoát'],
      ['<code>Get-ExecutionPolicy -List</code> · <code>Unblock-File</code>', 'chính sách · bỏ chặn file'],
    ], { sm: true })) },

  { t: 'Thực hành Chương 15 (40 phút): một script, ba máy', body: FIX + two(
    `${cards([
      { ic: '1', t: 'Mac: bắt lỗi BSD', d: 'chạy script mẫu bằng <code>/bin/bash</code>, ghi lại MỌI dòng lỗi (<code>sed -i</code>, <code>date -d</code>, <code>stat -c</code>) — không sửa gì cả', c: 'amb' },
      { ic: '2', t: 'Sửa cho chạy hai nơi', d: 'hàm <code>sedi</code>/<code>ngay_mai</code>/<code>kich_thuoc</code> + chặn bash &lt; 4; chạy trên Mac và container Ubuntu, output phải GIỐNG nhau', c: 'grn' },
      { ic: '3', t: 'Giả làm bạn Windows', d: 'trong container: <code>git config core.autocrlf true</code>, clone, thấy <code>w/crlf</code>; thêm <code>.gitattributes</code>, thấy <code>w/lf</code>', c: 'blu' },
      { ic: '4', t: 'Cùng việc bằng PowerShell', d: 'đếm dòng ERROR bằng <code>Select-String</code>, xuất JSON bằng <code>ConvertTo-Json</code>', c: 'vio' },
    ], 2)}`,
    `${sh([
      ['docker run --rm -it --name lab15 ubuntu:24.04 bash', 'sân tập vứt đi'],
      ['apt-get update && apt-get install -y git dos2unix', ''],
      ['printf \'#!/bin/bash\\r\\necho ok\\r\\n\' > t.sh', 'dựng file CRLF'],
      ['bash t.sh; file t.sh; cat -A t.sh', 'đọc triệu chứng'],
      ['dos2unix t.sh && bash t.sh', ''],
      ['# PowerShell trên Mac (tuỳ chọn):', ''],
      ['brew install powershell && pwsh', 'formula 7.6.6'],
    ], { fs: 13.5 })}
    ${box('good', '<b>Đạt khi:</b> script in cùng một dòng kết quả trên Mac và Ubuntu; <code>git ls-files --eol</code> cho thấy <code>w/lf</code> cho <code>*.sh</code> dù <code>autocrlf=true</code>; bạn giải thích được vì sao <code>Test-Path x &amp;&amp; "co"</code> in "co".')}`) },
]);
