/**
 * Linux & Bash · Deck lx-03 — Chương 3: Văn bản, ống dẫn & chuyển hướng.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 28/09/2026:
 *   • "Ubuntu"  = container ubuntu:24.04 (24.04.5, bash 5.2.21, GNU grep 3.11, GNU sed 4.9, mawk 1.3.4 là awk
 *                 mặc định, coreutils 9.4, util-linux 2.39.3), arm64, người dùng `an`, máy tên `lab`
 *                 (đã cài thêm moreutils/jq/curl/patch/gawk để minh hoạ; awk vẫn trỏ về mawk như ảnh gốc)
 *   • "Fedora"  = máy linux-nha (Fedora 44, bash 5.3.9, GNU grep 3.12, gawk 5.3.2 là awk mặc định)
 *   • "Mac"     = Mac M1, macOS 27, /bin/bash 3.2.57, /usr/bin/grep = BSD grep 2.6.0-FreeBSD, sed BSD,
 *                 awk version 20200816 — gọi bằng ĐƯỜNG DẪN TUYỆT ĐỐI vì shell có thể bọc grep/diff bằng hàm
 * Dữ liệu mẫu: ~/thu-linux/ch3/log/app.log (10 dòng) và access.log (10 dòng nginx) — dựng bằng heredoc trong bài 3.3.
 *
 * Hình tự vẽ (SVG nội tuyến, không đụng thư viện): annot() chép từ lx-01 (một dòng chữ đơn cách có ngoặc chú thích
 * từng đoạn); fdSvg() — ba "dây" 0/1/2 của một tiến trình; thuTu() — bảng fd qua từng bước của `> f 2>&1`
 * và `2>&1 > f`; ongSvg() — hai tiến trình + bộ đệm ống + SIGPIPE; commSvg() — ba cột của comm; seenSvg() —
 * bảng giá trị seen[] qua từng dòng của awk '!seen[$0]++'.
 */
import { S, cover, sh, pipe, term, mindmap, diagram, cards, box, steps, table, two, flow, sv, R, T, A, D, esc } from './_lx-chung.mjs';

export const deck = { key: 'lx-03', code: 'LINUX · CHƯƠNG 3', title: 'Văn bản, ống dẫn & chuyển hướng', sub: 'Linux & Bash · Chương 3' };

const MONO = 'SF Mono,Menlo,monospace';
const c = (k) => D[k] || k;

/** annot(str, segs, opts) — chép từ lx-01: chữ đơn cách + ngoặc màu + nhãn dưới từng đoạn [from, to). */
const annot = (str, segs, { fs = 40, w = 1150, rowH = 64, y0 = 56, h, num = false } = {}) => {
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
  if (num) {
    segs.forEach((g, k) => {
      const a = x0 + g.from * cw + 2, b = x0 + g.to * cw - 2, mid = (a + b) / 2, col = c(g.c);
      s += `<path d="M${a} ${by} L${a} ${by + 8} L${b} ${by + 8} L${b} ${by}" stroke="${col}" stroke-width="3" fill="none"/>`;
      s += `<circle cx="${mid}" cy="${by + 30}" r="15" fill="${col}"/>` + T(mid, by + 36, String(k + 1), { fs: 17, a: 'middle', b: true, c: '#0a0f0c' });
    });
    return sv(w, h || by + 52, s);
  }
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
  const H = h || by + 36 + rowsEnd.length * rowH + 4;
  return sv(w, H, s);
};
/** đoạn [from, to) của chuỗi con `sub` trong `str` (lần xuất hiện thứ k). */
const at = (str, sub, k = 0) => { let i = -1; for (let n = 0; n <= k; n++) i = str.indexOf(sub, i + 1); return { from: i, to: i + sub.length }; };

/* Slide 3 — ba "dây" của một tiến trình */
const fdSvg = () => {
  let s = '';
  s += R(0, 132, 116, 76, { c: 'blu' }) + T(58, 164, 'bàn phím', { fs: 16, a: 'middle', b: true }) + T(58, 188, '/dev/pts/0', { fs: 13, a: 'middle', mono: true, c: 'mu' });
  s += R(178, 78, 160, 184, { c: 'lx', fill: 'rgba(245,183,0,.08)' }) + T(258, 162, 'lệnh', { fs: 20, a: 'middle', b: true }) + T(258, 188, '(tiến trình)', { fs: 15, a: 'middle', c: 'mu' });
  s += A(116, 170, 176, 170, { c: 'blu' }) + T(146, 152, 'fd 0', { fs: 14, a: 'middle', c: 'blu', b: true, mono: true }) + T(146, 196, 'stdin', { fs: 13, a: 'middle', c: 'blu' });
  s += R(430, 88, 130, 76, { c: 'grn' }) + T(495, 120, 'terminal', { fs: 16, a: 'middle', b: true }) + T(495, 144, '/dev/pts/0', { fs: 13, a: 'middle', mono: true, c: 'mu' });
  s += R(430, 188, 130, 76, { c: 'red' }) + T(495, 220, 'terminal', { fs: 16, a: 'middle', b: true }) + T(495, 244, '/dev/pts/0', { fs: 13, a: 'middle', mono: true, c: 'mu' });
  s += A(338, 126, 428, 126, { c: 'grn' }) + T(383, 112, 'fd 1', { fs: 14, a: 'middle', c: 'grn', b: true, mono: true }) + T(383, 146, 'stdout', { fs: 13, a: 'middle', c: 'grn' });
  s += A(338, 226, 428, 226, { c: 'red' }) + T(383, 212, 'fd 2', { fs: 14, a: 'middle', c: 'red', b: true, mono: true }) + T(383, 246, 'stderr', { fs: 13, a: 'middle', c: 'red' });
  s += T(280, 26, 'kết quả → fd 1 · lời than phiền → fd 2', { fs: 15.5, a: 'middle', c: 'mu' });
  s += T(280, 300, 'shell cắm sẵn 3 dây TRƯỚC khi lệnh chạy dòng đầu tiên;', { fs: 15, a: 'middle', c: 'mu' });
  s += T(280, 322, '>  <  2>  | chỉ là CẮM LẠI dây — lệnh không hề biết', { fs: 15, a: 'middle', c: 'lx', b: true });
  return sv(560, 332, s);
};

/* Slide 5 — bảng fd qua từng bước của hai thứ tự */
const thuTu = () => {
  let s = '';
  const chip = (x, y, fd, to, col) => R(x, y, 230, 34, { c: col, r: 8, fill: '#0d140f' }) + T(x + 14, y + 23, `${fd} →`, { fs: 16, mono: true, b: true, c: col }) + T(x + 62, y + 23, to, { fs: 16, mono: true });
  const row = (y, nhan, lenh, col, heads, st) => {
    let r = R(0, y, 300, 92, { c: col, fill: col === 'grn' ? 'rgba(63,185,80,.08)' : 'rgba(255,92,108,.08)' }) +
      T(18, y + 32, nhan, { fs: 18, b: true, c: col }) + T(18, y + 66, lenh, { fs: 16.5, mono: true, b: true });
    heads.forEach((h, i) => {
      const x = 340 + i * 272;
      r += T(x + 115, y - 8, h, { fs: 14.5, a: 'middle', c: 'mu', mono: i > 0 });
      const [o1, o2] = st[i];
      r += chip(x, y + 6, 1, o1[0], o1[1]) + chip(x, y + 50, 2, o2[0], o2[1]);
      if (i < 2) r += A(x + 232, y + 46, x + 268, y + 46, { c: 'dim', sw: 2.5 });
    });
    return r;
  };
  s += row(30, '✓ ĐÚNG', 'ls … > a.log 2>&1', 'grn', ['lúc đầu', 'bước 1: > a.log', 'bước 2: 2>&1'], [
    [['terminal', 'blu'], ['terminal', 'blu']], [['a.log', 'grn'], ['terminal', 'blu']], [['a.log', 'grn'], ['a.log  ✓', 'grn']]]);
  s += row(168, '✗ SAI', 'ls … 2>&1 > b.log', 'red', ['lúc đầu', 'bước 1: 2>&1', 'bước 2: > b.log'], [
    [['terminal', 'blu'], ['terminal', 'blu']], [['terminal', 'blu'], ['terminal', 'blu']], [['b.log', 'grn'], ['terminal  ✗', 'red']]]);
  s += T(575, 290, '2>&1 = “fd 2 trỏ tới chỗ fd 1 đang trỏ LÚC NÀY” — chép địa chỉ, không phải buộc dây vĩnh viễn', { fs: 15, a: 'middle', c: 'lx' });
  return sv(1150, 300, s);
};

/* Slide 7 — ống dẫn: hai tiến trình chạy cùng lúc + bộ đệm của nhân */
const ongSvg = () => {
  let s = '';
  s += R(0, 30, 230, 96, { c: 'lx' }) + T(115, 70, 'yes', { fs: 24, a: 'middle', b: true, mono: true }) + T(115, 100, 'ghi “y” mãi mãi', { fs: 15, a: 'middle', c: 'mu' });
  s += R(920, 30, 230, 96, { c: 'grn' }) + T(1035, 70, 'head -3', { fs: 24, a: 'middle', b: true, mono: true }) + T(1035, 100, 'đọc 3 dòng rồi THOÁT', { fs: 15, a: 'middle', c: 'mu' });
  s += R(330, 44, 490, 68, { c: 'blu', r: 34, fill: '#0b1320' });
  for (let i = 0; i < 11; i++) s += `<rect x="${352 + i * 40}" y="60" width="30" height="36" rx="5" fill="${D.blu}" opacity="${i < 8 ? 0.55 : 0.15}"/>`;
  s += T(575, 30, 'bộ đệm ống TRONG NHÂN — 64 KB, không file, không đĩa', { fs: 15.5, a: 'middle', c: 'blu', b: true });
  s += A(232, 78, 326, 78, { c: 'lx' }) + T(279, 66, 'fd 1', { fs: 13.5, a: 'middle', c: 'lx', mono: true, b: true });
  s += A(822, 78, 916, 78, { c: 'grn' }) + T(869, 66, 'fd 0', { fs: 13.5, a: 'middle', c: 'grn', mono: true, b: true });
  s += T(330, 146, 'đầy ⇒ yes bị cho NGỦ', { fs: 15, c: 'mu' });
  s += T(820, 146, 'rỗng ⇒ head CHỜ', { fs: 15, c: 'mu', a: 'end' });
  s += R(0, 164, 1150, 46, { c: 'red', fill: 'rgba(255,92,108,.08)', r: 10 });
  s += T(575, 194, 'head thoát ⇒ lần write() kế tiếp của yes không còn ai đọc ⇒ nhân gửi SIGPIPE ⇒ yes chết (mã 141 = 128 + 13)', { fs: 16, a: 'middle', b: true });
  return sv(1150, 214, s);
};

/* Slide 19 — ba cột của comm */
const commSvg = () => {
  let s = '';
  const col3 = [
    ['cột 1 · chỉ trong can.txt', 'lx', ['jq', 'postgresql'], 'comm -23 ⇒ còn THIẾU'],
    ['cột 2 · chỉ trong da-cai.txt', 'blu', ['htop'], 'comm -13 ⇒ cài THỪA'],
    ['cột 3 · có ở CẢ HAI', 'grn', ['curl', 'git', 'nginx'], 'comm -12 ⇒ đã đủ'],
  ];
  col3.forEach(([h, k, items, foot], i) => {
    const x = i * 190;
    s += R(x, 0, 178, 196, { c: k, fill: '#0d140f' }) + T(x + 89, 26, h.split(' · ')[0], { fs: 14, a: 'middle', c: k, b: true }) + T(x + 89, 46, h.split(' · ')[1], { fs: 13.5, a: 'middle', c: 'mu' });
    items.forEach((it, j) => { s += T(x + 89, 82 + j * 28, it, { fs: 17, a: 'middle', mono: true, b: true }); });
    s += T(x + 89, 222, foot, { fs: 14, a: 'middle', c: k, mono: true, b: true });
  });
  return sv(560, 232, s);
};

/* Slide 27 — seen[] qua từng dòng */
const seenSvg = () => {
  const rows = [['apple', 0, true], ['banana', 0, true], ['apple', 1, false], ['cherry', 0, true], ['banana', 1, false]];
  let s = T(0, 20, 'dòng vào', { fs: 14, c: 'mu', b: true }) + T(150, 20, 'seen[$0] TRƯỚC ++', { fs: 14, c: 'mu', b: true }) + T(335, 20, '!giá trị', { fs: 14, c: 'mu', b: true }) + T(440, 20, 'in?', { fs: 14, c: 'mu', b: true });
  rows.forEach(([w, v, p], i) => {
    const y = 34 + i * 40;
    s += R(0, y, 540, 34, { c: p ? 'grn' : 'dim', r: 8, fill: p ? 'rgba(63,185,80,.07)' : '#0d140f', sw: 1.5 });
    s += T(14, y + 23, w, { fs: 16, mono: true, b: true }) + T(200, y + 23, String(v), { fs: 16, mono: true, a: 'middle' }) + T(365, y + 23, p ? 'đúng' : 'sai', { fs: 16, a: 'middle', c: p ? 'grn' : 'red' }) + T(452, y + 23, p ? '✓ in' : '✗ bỏ', { fs: 16, a: 'middle', c: p ? 'grn' : 'red', b: true });
  });
  return sv(540, 236, s);
};

const NG = '203.0.113.45 - - [28/Sep/2026:10:14:01 +0000] "GET /api/v1/posts HTTP/1.1" 200 5120';
const RX = '^[0-9]{1,3}(\\.[0-9]{1,3}){3}$';
const SD = "sed -n '2,5s|/usr/local|/opt|gp' f.txt";

export const slides = S([
  cover({ t: 'Chương 3 — Văn bản, ống dẫn &amp; chuyển hướng', sub: 'fd 0/1/2 &amp; 2&gt;&amp;1 · ống dẫn chạy song song · grep &amp; regex · cut/sort/uniq/comm/diff · sed · awk', chap: 'CHƯƠNG 3' }),

  { t: 'Bản đồ chương: công cụ nhỏ, nối bằng ống, văn bản là giao diện chung', body: mindmap('Văn bản &amp; ống dẫn', 'mỗi lệnh một việc, nối bằng |', [
    { t: '3.1 Ba dòng chuẩn', d: 'fd 0/1/2 · &gt; &gt;&gt; 2&gt;&amp;1 &amp;&gt; · heredoc · tee · /dev/null', c: 'lx' },
    { t: '3.2 Ống dẫn', d: 'chạy song song · SIGPIPE · pipefail · shell con · xargs', c: 'amb' },
    { t: '3.3 grep &amp; regex', d: 'BRE/ERE/PCRE · -inwvocl · -A/-B/-C · mã thoát · macOS', c: 'grn' },
    { t: '3.4 Công cụ nhỏ', d: 'cut sort uniq tr wc · paste comm join column · diff', c: 'tea' },
    { t: '3.5 sed', d: 's///g · địa chỉ · \\1 &amp; · -n p · -i GNU vs macOS', c: 'blu' },
    { t: '3.6 awk', d: '$1…$NF · NR NF · BEGIN/END · mảng · -v', c: 'vio' },
  ]) },

  /* ───────────── 3.1 ───────────── */
  { t: 'Mỗi tiến trình sinh ra với sẵn 3 “dây”: fd 0, 1, 2', body: two(
    fdSvg(),
    term(['$ ls -l /proc/self/fd', 'lrwx… 0 -> /dev/pts/0', 'lrwx… 1 -> /dev/pts/0', 'lrwx… 2 -> /dev/pts/0', '$ ls -l /proc/self/fd >out.txt 2>/dev/null', '$ cat out.txt', 'lrwx… 0 -> /dev/pts/0', '+ l-wx… 1 -> /home/an/thu-linux/ch3/out.txt', '+ l-wx… 2 -> /dev/null', '$ ls -l /proc/self/fd | cat', '+ l-wx… 1 -> pipe:[2972559]', '# /proc/self = chính tiến trình đang đọc nó'], { title: 'Ubuntu 24.04 — cùng lệnh, ba cách cắm dây', dir: 'ch3', fs: 14.5 }), 'l') },

  { t: '&gt; làm rỗng file TRƯỚC khi lệnh chạy — sort f &gt; f mất sạch', body: two(
    `${steps([
      ['Shell mở <code>names.txt</code> để ghi, cắt về 0 byte', 'việc của SHELL, xảy ra trước tiên'],
      ['Shell khởi động <code>sort</code>, fd 1 = <code>names.txt</code>', 'sort chưa đọc byte nào'],
      ['<code>sort</code> đọc <code>names.txt</code>… rỗng', 'dữ liệu đã mất ở bước 1'],
      ['<code>sort</code> ghi 0 dòng, thoát mã 0', 'không lỗi, không cảnh báo'],
    ])}
    ${box('warn', 'Lệnh sai tên cũng vậy: <code>badcommand &gt; important.txt</code> ⇒ file rỗng + mã 127. Dữ liệu mất vì <b>dấu &gt;</b>, không vì lệnh.')}`,
    `${term(["$ printf 'chuoi\\nan\\nbinh\\n' > names.txt", '$ sort names.txt > names.txt', '$ wc -l names.txt', '! 0 names.txt', '$ badcommand > important.txt', '! bash: badcommand: command not found', '$ wc -c important.txt', '! 0 important.txt'], { title: 'Ubuntu 24.04 — output thật', dir: 'ch3' })}
    ${sh([
      ['sort -o names.txt names.txt', 'sort đọc hết rồi mới ghi'],
      ['sort names.txt | sponge names.txt', 'moreutils: hút hết rồi ghi'],
      ['sort names.txt > t && mv t names.txt', 'file tạm, chắc ăn nhất'],
      ['set -o noclobber', '> từ chối ghi đè · >| để ép'],
    ], { fs: 14.5 })}`, 'r') },

  { t: '2&gt;&amp;1 chép địa chỉ fd 1 NGAY LÚC ĐÓ — thứ tự quyết định', body: `
    ${thuTu()}
    ${two(
      term(['$ ls /etc/hostname /nope > a.log 2>&1', '$ cat a.log', "= ls: cannot access '/nope': No such file or directory", '= /etc/hostname', '$ ls /etc/hostname /nope 2>&1 > b.log', "! ls: cannot access '/nope': No such file or directory", '$ cat b.log', '/etc/hostname'], { title: 'Ubuntu 24.04 — lỗi của bản SAI lọt ra màn hình', dir: 'ch3', fs: 14 }),
      box('tip', 'Quy tắc: <b><code>2&gt;&amp;1</code> đứng CUỐI</b>. Hoặc viết <code>&amp;&gt; build.log</code> (bash) — không thể sai thứ tự. <code>|&amp;</code> = <code>2&gt;&amp;1 |</code>. Mac <code>/bin/bash</code> 3.2 KHÔNG có <code>&amp;&gt;&gt;</code> và <code>|&amp;</code> (syntax error).'), 'l2')}` },

  { t: 'Heredoc: nháy quanh EOF quyết định có khai triển — và sudo không nâng quyền cho &gt;', body: two(
    `${sh([
      ['PORT=3000'],
      ['cat <<EOF', 'KHÔNG nháy: $ và $( ) chạy'],
      ['port: $PORT'],
      ['user: $(whoami)'],
      ['EOF'],
      ["cat <<'EOF'", "CÓ nháy: giữ nguyên từng byte"],
      ['port: $PORT'],
      ['EOF'],
    ], { fs: 15 })}
    ${term(['port: 3000', 'user: an', '+ port: $PORT'], { title: 'Ubuntu — output của hai khối', dir: '~' })}`,
    `${term(['$ sudo echo "10.0.0.5 db" >> /etc/hosts', '! bash: /etc/hosts: Permission denied', '$ echo "10.0.0.5 db" | sudo tee -a /etc/hosts', '10.0.0.5 db', '$ echo "10.0.0.6 cache" | sudo tee -a /etc/hosts >/dev/null', '$ tail -2 /etc/hosts', '= 10.0.0.5 db', '= 10.0.0.6 cache'], { title: 'Ubuntu — người dùng an, có sudo', dir: '~', fs: 14 })}
    ${box('info', '<code>&gt;&gt;</code> do SHELL của <b>an</b> mở, trước khi sudo kịp chạy ⇒ bị từ chối. <code>tee</code> là một chương trình, sudo nâng quyền được cho nó ⇒ nó tự mở file.')}`) },

  /* ───────────── 3.2 ───────────── */
  { t: 'a | b: hai tiến trình chạy CÙNG LÚC, nối bằng bộ đệm của nhân', body: `
    ${ongSvg()}
    ${two(
      term(['$ yes | head -3; echo "${PIPESTATUS[@]}"', 'y', 'y', 'y', '+ 141 0', '$ time (seq 1 100000000 | head -1)', '1', '= real    0m0.002s'], { title: 'Ubuntu 24.04 — seq không bao giờ phải đếm tới 100 triệu', dir: '~', fs: 14 }),
      box('info', 'Nếu ống là “chạy xong a rồi mới đưa cho b”, <code>yes | head</code> sẽ chạy mãi và <code>seq</code> phải sinh 100 triệu dòng. Thực tế: 2 mili giây. <b>141</b> trong <code>PIPESTATUS</code> chính là dấu vết của SIGPIPE.'), 'l')}` },

  { t: 'Ống chỉ báo mã của khâu CUỐI — pipefail bắt khâu hỏng', body: `
    ${pipe([
      { c: 'curl -s bad-url', d: 'exit <b>6</b> — không phân giải được tên', ac: 'red' },
      { c: "jq '.'", d: 'exit <b>0</b> — đầu vào rỗng vẫn “ổn”', ac: 'grn' },
      { c: 'wc -l', d: 'exit <b>0</b> — in 0', ac: 'grn' },
    ], { mui: ['0 byte', '0 byte'] })}
    ${two(
      term(['$ false | true; echo $?', '! 0', '$ curl -s bad-url | jq . | wc -l', '0', '$ echo "${PIPESTATUS[@]}"', '+ 6 0 0', '$ set -o pipefail', '$ curl -sf https://httpbin.org/status/404 | jq .; echo $?', '= 22'], { title: 'Ubuntu 24.04 — output thật', dir: '~', fs: 14 }),
      `${table(['Công cụ', 'Làm gì'], [
        ['<code>$?</code>', 'mã của khâu CUỐI (mặc định)'],
        ['!<code>set -o pipefail</code>', 'mã khác 0 của khâu hỏng bên PHẢI nhất'],
        ['<code>${PIPESTATUS[@]}</code>', 'mã từng khâu — lệnh kế tiếp ghi đè ngay'],
        ['<code>curl -f</code>', 'HTTP 4xx/5xx ⇒ exit 22; thiếu <code>-f</code> thì 404 vẫn là 0'],
      ], { sm: true })}`, 'l')}` },

  { t: 'stderr không chảy qua ống — và grep trong ống xả theo khối', body: two(
    `${diagram({ w: 560, h: 200, nodes: [
      { id: 'l', x: 0, y: 60, w: 170, h: 70, t: 'ls', d: 'fd 1 · fd 2', c: 'lx' },
      { id: 'w', x: 380, y: 0, w: 180, h: 70, t: 'wc -l', d: 'chỉ nhận fd 1', c: 'grn' },
      { id: 't', x: 380, y: 125, w: 180, h: 70, t: 'terminal', d: 'lỗi hiện ở đây', c: 'red' },
    ], edges: [{ from: 'l', to: 'w', c: 'grn', t: '| (fd 1)' }, { from: 'l', to: 't', c: 'red', t: 'fd 2' }] })}
    ${term(['$ ls /etc/hostname /nope | wc -l', "! ls: cannot access '/nope': No such file or directory", '1', '$ ls /etc/hostname /nope 2>&1 | wc -l', '= 2'], { title: 'Ubuntu — gộp fd 2 vào fd 1 TRƯỚC khi vào ống', dir: '~', fs: 14 })}`,
    `${term(['$ (echo "ERROR 1"; sleep 3; echo "ERROR 2") \\', '    | grep ERROR | while read -r l; do …', '! giây 3: ERROR 1', '! giây 3: ERROR 2', '$ … | grep --line-buffered ERROR | …', '= giây 0: ERROR 1', 'giây 3: ERROR 2'], { title: 'Ubuntu — đo thật bằng $SECONDS', dir: '~', fs: 14 })}
    ${sh([
      ['tail -f app.log | grep --line-buffered ERROR', 'cờ của grep'],
      ['tail -f app.log | stdbuf -oL grep ERROR', 'ép đệm dòng'],
      ["tail -f app.log | awk '/ERROR/{print; fflush()}'", ''],
    ], { fs: 13.5, so: false })}
    ${box('warn', 'stdout là terminal ⇒ đệm theo DÒNG; là ống ⇒ đệm theo KHỐI (4 KB+). Im lặng ≠ không có lỗi.')}`) },

  { t: 'Khâu ống chạy trong shell con — biến của while biến mất', body: two(
    `${diagram({ w: 560, h: 290, nodes: [
      { id: 'p', x: 150, y: 0, w: 260, h: 70, t: 'bash (cha)', d: 'count=0 … vẫn 0', c: 'lx' },
      { id: 'a', x: 0, y: 190, w: 230, h: 80, t: 'con 1: cat f.txt', d: 'ghi 3 dòng vào ống', c: 'blu' },
      { id: 'b', x: 320, y: 190, w: 240, h: 80, t: 'con 2: while read', d: 'count=3 → thoát → MẤT', c: 'red' },
    ], edges: [{ from: 'p', to: 'a', c: 'dim', t: 'fork' }, { from: 'p', to: 'b', c: 'dim', t: 'fork' }, { from: 'a', to: 'b', c: 'blu', t: '|' }] })}`,
    `${term(['$ count=0; cat f.txt | while read -r l; do count=$((count+1)); done', '$ echo $count', '! 0', '$ count=0; while read -r l; do count=$((count+1)); done < f.txt', '$ echo $count', '= 3', '$ count=0; while read -r l; do …; done < <(grep -v b f.txt)', '$ echo $count', '= 2', '$ echo <(true)', '+ /dev/fd/63'], { title: 'Ubuntu 24.04 — f.txt có 3 dòng a b c', dir: 'ch3', fs: 13.5 })}
    ${box('info', '<code>&lt;(lệnh)</code> = thay thế tiến trình: output của lệnh hiện ra như một TÊN FILE. zsh trên Mac chạy khâu CUỐI trong shell cha ⇒ vòng lặp giữ được biến; bash thì không.')}`, 'r') },

  { t: 'xargs biến từng dòng thành THAM SỐ cho lệnh không đọc stdin', body: `
    ${pipe([
      { c: "printf 'a.txt\\nb c.txt\\n'", d: '2 dòng trên stdin', ac: 'blu' },
      { c: 'xargs -t touch', d: '<b style="color:#ff5c6c">touch a.txt b c.txt</b> — 3 file!', ac: 'red' },
    ], { mui: ['dòng'] })}
    ${two(
      term(["$ printf 'a.txt\\nb c.txt\\n' | xargs -d '\\n' -t touch", "= touch a.txt 'b c.txt'", "$ printf '1\\n2\\n3\\n4\\n5\\n' | xargs -n2 echo", '1 2', '3 4', '5', "$ printf 'x\\ny\\n' | xargs -I{} echo file-{}.bak", 'file-x.bak', 'file-y.bak', '# 4 × sleep 1 (đo bằng time): -n1 → 4,0 s · -P4 -n1 → 1,0 s'], { title: 'Ubuntu 24.04 — xargs -t in lệnh trước khi chạy', dir: '~', fs: 13.5 }),
      table(['Cờ', 'Nghĩa'], [
        ['<code>-n N</code>', 'mỗi lượt gọi tối đa N tham số'],
        ['<code>-I{}</code>', '{} là chỗ đặt, mỗi dòng một lượt'],
        ['!<code>-0</code>', 'cắt theo NUL — đi với <code>find -print0</code>'],
        ['<code>-d \'\\n\'</code>', 'chỉ cắt theo xuống dòng (GNU)'],
        ['<code>-P N</code>', 'N lượt chạy song song'],
        ['<code>-r</code>', 'đầu vào rỗng ⇒ không chạy (GNU)'],
        ['<code>-t</code>', 'in từng lệnh ra stderr'],
      ], { sm: true }), 'l')}` },

  /* ───────────── 3.3 ───────────── */
  { t: 'Ba phương ngữ regex: cùng một ý, khác số dấu gạch chéo', body: two(
    `${table(['Ý muốn', 'BRE <code>grep</code>', 'ERE <code>grep -E</code>', 'PCRE <code>grep -P</code>'], [
      ['A hoặc B', '<code>A\\|B</code>', '!<code>A|B</code>', '<code>A|B</code>'],
      ['1 lần trở lên', '<code>a\\+</code>', '!<code>a+</code>', '<code>a+</code>'],
      ['có hoặc không', '<code>colou\\?r</code>', '!<code>colou?r</code>', '<code>colou?r</code>'],
      ['đúng 3 lần', '<code>x\\{3\\}</code>', '!<code>x{3}</code>', '<code>x{3}</code>'],
      ['nhóm', '<code>\\(ab\\)</code>', '!<code>(ab)</code>', '<code>(ab)</code>'],
      ['chữ số', '<code>[0-9]</code>', '<code>[0-9]</code>', '<code>\\d</code>'],
      ['nhìn trước', '—', '—', '<code>(?=ms)</code>'],
    ], { sm: true })}
    ${box('tip', 'Mặc định dùng <b>-E</b>. Chuỗi nguyên văn có <code>.</code> <code>*</code> <code>[</code> (IP, phiên bản) ⇒ <b>-F</b>.')}`,
    `${sh([
      ['grep -c "ERROR\\|FATAL" app.log', 'BRE: | phải có \\'],
      ['grep -c "ERROR|FATAL" app.log', 'BRE: | là chữ thường!'],
      ['grep -cE "ERROR|FATAL" app.log', 'ERE'],
      ['grep -oP "\\d+(?=ms)" app.log', 'PCRE: chỉ lấy số'],
      ['grep -c "1.2.3" ips.txt', '. khớp mọi ký tự'],
      ['grep -cF "1.2.3" ips.txt', '-F: chấm là chấm'],
    ], { fs: 14.5 })}
    ${term(['4', '! 0', '4', '1840', '! 2        # khớp cả 1x2y3', '= 1'], { title: 'Ubuntu — output thật, đúng thứ tự 6 lệnh', dir: '~/thu-linux/ch3/log', fs: 14.5 })}`, 'r') },

  { t: 'Đọc một regex từ trái sang phải: mỗi mảnh một nghĩa', body: `
    ${annot(RX, [
      { from: 0, to: 1, t: '^', d: 'đầu dòng', c: 'pnk' },
      { from: 1, to: 6, t: '[0-9]', d: 'một chữ số', c: 'blu' },
      { from: 6, to: 11, t: '{1,3}', d: 'lặp 1–3 lần', c: 'vio' },
      { from: 11, to: 25, t: '( … ) nhóm', d: '\\. = dấu chấm THẬT + 1–3 số', c: 'grn' },
      { from: 25, to: 28, t: '{3}', d: 'cả nhóm lặp 3 lần', c: 'lx' },
      { from: 28, to: 29, t: '$', d: 'cuối dòng', c: 'pnk' },
    ], { fs: 40 })}
    ${two(
      term(["$ printf '10.0.0.5\\n999.1.1.1\\n10.0.0\\nhost 192.168.1.20 up\\n' \\", "  | grep -E '^[0-9]{1,3}(\\.[0-9]{1,3}){3}$'", '= 10.0.0.5', '! 999.1.1.1', '# 10.0.0 thiếu nhóm · dòng 4 vướng ^ và $'], { title: 'Ubuntu 24.04 — output thật', dir: '~', fs: 14 }),
      table(['Mảnh', 'Nghĩa'], [
        ['<code>.</code> · <code>\\.</code>', 'ký tự bất kỳ · dấu chấm thật'],
        ['<code>[abc]</code> · <code>[^abc]</code>', 'một ký tự trong tập · NGOÀI tập'],
        ['<code>[[:digit:]]</code> <code>[[:space:]]</code>', 'lớp POSIX — chạy ở mọi grep'],
        ['<code>\\b</code> · <code>-w</code>', 'ranh giới từ · khớp nguyên từ'],
        ['-<code>999</code> vẫn lọt', 'regex kiểm HÌNH DẠNG, không kiểm GIÁ TRỊ'],
      ], { sm: true }), 'l')}` },

  { t: 'grep trả mã 0 · 1 · 2 — và các cờ dùng hằng ngày', body: two(
    `${table(['Cờ', 'Nghĩa', 'Trên app.log'], [
      ['<code>-c</code>', 'đếm DÒNG khớp', '<code>-c ERROR</code> → 3'],
      ['<code>-i</code>', 'bỏ qua hoa/thường', '<code>-ci error</code> → 4'],
      ['<code>-w</code>', 'khớp nguyên từ', '<code>-w error</code> → 1 dòng'],
      ['<code>-v</code>', 'dòng KHÔNG khớp', '<code>-v INFO</code>'],
      ['<code>-n</code> · <code>-l</code>', 'số dòng · chỉ tên file', '<code>-l ERROR *.log</code>'],
      ['<code>-o</code>', 'chỉ phần khớp', '<code>-oE "[0-9]+ms"</code> → 1840ms'],
      ['<code>-A</code> <code>-B</code> <code>-C</code>', 'dòng sau · trước · hai phía', '<code>-B1 -A2 Exception</code>'],
      ['<code>-r</code> <code>--include</code>', 'đệ quy · lọc tên file', '<code>-rn --include="*.ts"</code>'],
      ['<code>-q</code>', 'im lặng, chỉ trả mã thoát', '<code>if grep -q …</code>'],
    ], { sm: true })}`,
    `${term(['$ grep -B1 -A2 Exception app.log', '2026-09-28 10:14:02 INFO  handling POST /api/v1/orders', '! 2026-09-28 10:14:02 ERROR Exception: connection refused', '2026-09-28 10:14:02 ERROR   at Pool.connect (db.ts:41)', '2026-09-28 10:14:02 ERROR   at createOrder (orders.ts:88)', '$ grep -q FATAL app.log; echo $?', '= 0', '$ grep -q PANIC app.log; echo $?', '+ 1', '$ grep -q x missing.txt; echo $?', '! grep: missing.txt: No such file or directory', '! 2'], { title: 'Ubuntu 24.04 — ~/thu-linux/ch3/log', dir: 'log', fs: 13.5 })}
    ${box('warn', '0 = có khớp · 1 = không khớp · <b>2 = LỖI</b>. Script coi “khác 0 là không có” sẽ đọc file thiếu thành “sạch”.')}`, 'l') },

  { t: 'grep trên Mac là BSD: cùng một mẫu, kết quả khác', body: `
    ${table(['Lệnh', 'Ubuntu (GNU grep 3.11)', 'Mac (/usr/bin/grep, BSD 2.6.0)'], [
      ['<code>grep -oP "\\d+(?=ms)" app.log</code>', '+1840', '-grep: invalid option -- P'],
      ['<code>grep -oE "\\d+ms" app.log</code>', '-(không ra gì — \\d là chữ d)', '+1840ms'],
      ['<code>grep "ERROR\\|FATAL" app.log</code>', '+4 dòng', '+4 dòng (macOS 27)'],
      ['<code>grep -v "/CEA201.pdf$\\|/CSI106.pdf$" list.txt</code>', '+loại cả hai', '-chỉ loại NHÁNH CUỐI — $ giữa mẫu BRE là ký tự thường'],
      ['<code>grep -vE "/CEA201.pdf$|/CSI106.pdf$" list.txt</code>', '+loại cả hai', '+loại cả hai'],
    ], { sm: true })}
    ${two(
      term(['$ /usr/bin/grep -v "/CEA201.pdf$\\|/CSI106.pdf$\\|/MAE101.pdf$" list.txt', '! a/CEA201.pdf', '! a/CSI106.pdf', 'a/keep.txt', '$ /usr/bin/grep -vE "/CEA201.pdf$|/CSI106.pdf$|/MAE101.pdf$" list.txt', '= a/keep.txt'], { title: 'Mac M1 · macOS 27 — 2/3 mẫu bị bỏ qua, không một lời báo', dir: '~', fs: 13.5 }),
      box('good', '<b>Viết một lần, chạy cả hai nơi:</b> <code>-E</code> cho mọi phép hoặc · <code>[0-9]</code>/<code>[[:digit:]]</code> thay <code>\\d</code> · danh sách cố định ⇒ <code>grep -Fxf file</code> · và <b>đếm trước</b> số dòng phải ra.'), 'l')}` },

  /* ───────────── 3.4 ───────────── */
  { t: 'cut coi MỖI dấu cách là một ngăn — output căn lề thì dùng awk', body: two(
    term(['$ ls -l', 'total 12', '-rw-r--r-- 1 an an 833 Sep 28 09:24 access.log', '-rw-r--r-- 1 an an 499 Sep 28 09:24 app.log', '+ -rw-r--r-- 1 an an  20 Sep 28 09:24 blocked.txt', "$ ls -l | tail -n +2 | cut -d' ' -f5", '833', '499', '', '# ↑ dòng trống: hai dấu cách liền = một trường rỗng', "$ ls -l | tail -n +2 | awk '{print $5}'", '833', '499', '= 20', '$ echo -n "Việt" | wc -c;  echo -n "Việt" | LC_ALL=C.UTF-8 wc -m', '6', '4'], { title: 'Ubuntu 24.04 — ~/thu-linux/ch3/log', dir: 'log', fs: 13.5 }),
    table(['Lệnh', 'Làm gì'], [
      ['<code>cut -d: -f1,7</code>', 'trường 1 và 7, phân cách <code>:</code>'],
      ['<code>cut -c1-10</code>', 'ký tự 1–10 (ngày trong log)'],
      ['<code>tr a-z A-Z</code> · <code>tr -d \'\\r\'</code>', 'đổi ký tự · xoá CR của Windows'],
      ['<code>tr -s \' \'</code>', 'ép chuỗi dấu cách còn một'],
      ['<code>wc -l</code> · <code>wc -l &lt; f</code>', '“10 app.log” · chỉ “10”'],
      ['<code>wc -c</code> · <code>wc -m</code>', 'byte · ký tự (UTF-8 khác nhau)'],
      ['<code>head -20</code> · <code>tail -n +2</code>', '20 dòng đầu · từ dòng 2 (bỏ tiêu đề)'],
      ['!<code>tail -F</code>', 'theo dõi THEO TÊN, sống qua logrotate'],
    ], { sm: true }), 'l') },

  { t: 'sort so sánh CHỮ, trừ khi bạn bảo khác: -n -h -V -k2,2', body: `
    ${table(['Đầu vào', '<code>sort</code> trơn', 'Cờ đúng', 'Kết quả đúng'], [
      ['<code>9 10 100</code>', '-(chữ) 10 100 9', '<code>sort -n</code>', '+9 10 100'],
      ['<code>1M 512K 2G 3K</code>', '-(-n) 1M 2G 3K 512K', '<code>sort -h</code>', '+3K 512K 1M 2G'],
      ['<code>v1.10 v1.9 v1.2</code>', '-(chữ) v1.10 v1.2 v1.9', '<code>sort -V</code>', '+v1.2 v1.9 v1.10'],
      ['<code>an 30 · binh 9 · chi 120</code>', '-(-k2) chi 120 · an 30 · binh 9', '<code>sort -k2,2n</code>', '+binh 9 · an 30 · chi 120'],
      ['<code>/etc/passwd</code>', 'theo tên', '<code>sort -t: -k3,3n</code>', '+theo UID: … an:1001, nobody:65534'],
    ], { sm: true })}
    ${two(
      sh([
        ['sort -rn', 'số, lớn trước'],
        ['sort -u', 'sắp xếp + bỏ trùng'],
        ['sort -k2,2 -k1,1nr f', 'khoá 2, rồi khoá 1 số giảm'],
        ['LC_ALL=C sort', 'thứ tự byte, nhanh, ổn định'],
      ], { fs: 15 }),
      term(['$ printf "a\\nB\\nb\\nA\\n_x\\n" | LC_ALL=en_US.UTF-8 sort | paste -sd" "', 'a A b B _x', '$ printf "a\\nB\\nb\\nA\\n_x\\n" | LC_ALL=C sort | paste -sd" "', '+ A B _x a b'], { title: 'Fedora 44 — cùng dữ liệu, hai locale, hai thứ tự', dir: '~', fs: 13.5 }), 'r')}
    ${box('warn', '<code>-k2</code> = “từ trường 2 tới HẾT dòng”; <code>-k2,2</code> = “chỉ trường 2”. <code>comm</code>/<code>join</code> đòi hai file sắp xếp CÙNG locale.')}` },

  { t: 'Đếm theo nhóm trong 5 chặng: awk | sort | uniq -c | sort -rn | head', body: `
    ${pipe([
      { c: "awk '{print $1}'", d: '10 dòng, mỗi dòng 1 IP', ac: 'lx' },
      { c: 'sort', d: 'IP giống nhau nằm CẠNH nhau', ac: 'blu' },
      { c: 'uniq -c', d: '3 dòng “số IP”', ac: 'grn' },
      { c: 'sort -rn', d: 'theo SỐ, lớn trước', ac: 'vio' },
      { c: 'head -3', d: 'top 3 — SIGPIPE dừng sớm', ac: 'tea' },
    ])}
    ${two(
      term(["$ awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -3", '      5 203.0.113.45', '      3 198.51.100.7', '      2 192.0.2.19'], { title: 'Ubuntu 24.04 — access.log mẫu 10 dòng', dir: 'log', fs: 14 }),
      term(["$ printf 'a\\nb\\na\\na\\nb\\n' | uniq -c", '!       1 a', '!       1 b', '!       2 a', '!       1 b', "$ printf 'a\\nb\\na\\na\\nb\\n' | sort | uniq -c", '=       3 a', '=       2 b'], { title: 'Ubuntu — uniq chỉ gộp dòng KỀ NHAU', dir: '~', fs: 14 }))}
    ${box('tip', '<code>uniq -d</code> = chỉ dòng lặp (ID trùng) · <code>uniq -u</code> = chỉ dòng xuất hiện đúng 1 lần · <code>sort -u</code> = bỏ trùng không cần đếm.')}` },

  { t: 'comm chia 3 cột, paste ghép ngang, join nối theo khoá', body: two(
    `${commSvg()}
    ${term(['$ comm -23 <(sort can.txt) <(sort da-cai.txt)', 'jq', 'postgresql', '$ comm can.txt da-cai.txt       # quên sort', '! comm: file 2 is not in sorted order', '…'], { title: 'Ubuntu — gói cần cài vs gói đã cài', dir: 'so', fs: 13.5 })}`,
    `${term(['$ paste ten.txt diem.txt', 'an      8.5', 'binh    6.0', 'chi     9.25', '$ paste -sd, ten.txt', '= an,binh,chi', '$ join -t, users.csv orders.csv', 'u1,an,ORD-9', 'u3,chi,ORD-7', 'u3,chi,ORD-8', '$ column -t -s, -o " | " diem.csv', 'ten  | vai tro  | diem', 'an   | backend  | 8.5', 'binh | frontend | 6'], { title: 'Ubuntu 24.04 — output thật (paste dùng TAB)', dir: 'so', fs: 13.5 })}
    ${box('warn', 'Mac: <code>paste -sd, -</code> phải có <code>-</code> khi đọc stdin · <code>column</code> không có <code>-o</code>.')}`) },

  { t: 'diff -u đọc như git diff: @@ vị trí, “-” dòng cũ, “+” dòng mới', body: two(
    `${term(['$ diff -u sshd.cu sshd.moi', '--- sshd.cu   2026-09-28 09:26:19.186619260 +0000', '+++ sshd.moi  2026-09-28 09:26:19.186619260 +0000', '+ @@ -1,5 +1,6 @@', ' Port 22', '! -PermitRootLogin yes', '! -PasswordAuthentication yes', '= +PermitRootLogin no', '= +PasswordAuthentication no', ' X11Forwarding yes', ' UsePAM yes', '= +MaxAuthTries 3', '$ echo $?', '1'], { title: 'Ubuntu 24.04 — hai bản sshd_config', dir: 'cfg', fs: 14 })}
    ${box('info', '<code>@@ -1,5 +1,6 @@</code> = đoạn này là dòng 1–5 của file cũ, thành dòng 1–6 của file mới. Dòng bắt đầu bằng dấu cách = không đổi (ngữ cảnh).')}`,
    `${table(['Lệnh', 'Dùng khi'], [
      ['<code>diff -u a b</code>', 'đọc thay đổi · gửi cho người khác'],
      ['<code>diff -q a b</code>', 'chỉ hỏi: khác hay giống?'],
      ['<code>diff -rq d1 d2</code>', 'so hai THƯ MỤC: file nào khác, file nào chỉ bên nào'],
      ['<code>diff -w</code> · <code>-y</code>', 'bỏ qua khoảng trắng · hai cột cạnh nhau'],
      ['<code>diff &lt;(sort a) &lt;(sort b)</code>', 'so NỘI DUNG, bỏ qua thứ tự'],
      ['<code>cmp -s a b</code>', 'so từng byte, im lặng (file nhị phân)'],
      ['<code>diff -u a b &gt; x.patch</code>', '<code>patch a &lt; x.patch</code> áp lại'],
    ], { sm: true })}
    ${table(['Mã thoát', 'diff · cmp'], [['+<b>0</b>', 'giống hệt'], ['!<b>1</b>', 'KHÁC nhau (không phải lỗi!)'], ['-<b>2</b>', 'lỗi: file không tồn tại…']], { sm: true })}`, 'l') },

  /* ───────────── 3.5 ───────────── */
  { t: 'Một lệnh sed = địa chỉ + chữ cái lệnh + đối số', body: `
    ${annot(SD, [
      { ...at(SD, '-n'), t: '-n', d: 'tắt in tự động', c: 'pnk' },
      { ...at(SD, '2,5'), t: '2,5', d: 'địa chỉ: dòng 2–5', c: 'blu' },
      { ...at(SD, 's|'), to: at(SD, 's|').from + 1, t: 's', d: 'lệnh thay thế', c: 'lx' },
      { ...at(SD, '/usr/local'), t: 'mẫu', d: 'regex cần tìm', c: 'grn' },
      { ...at(SD, '/opt'), t: 'thay bằng', d: 'chuỗi mới', c: 'tea' },
      { ...at(SD, 'gp'), t: 'cờ g p', d: 'mọi chỗ · in dòng đã đổi', c: 'vio' },
    ], { fs: 34 })}
    ${flow([
      { e: '1', t: 'Đọc 1 dòng', d: 'vào “vùng mẫu” (pattern space)', c: 'blu' },
      { e: '2', t: 'Địa chỉ khớp?', d: 'không có địa chỉ = mọi dòng', c: 'amb' },
      { e: '3', t: 'Chạy lệnh', d: 's d p a i c q y …', c: 'grn' },
      { e: '4', t: 'In vùng mẫu', d: 'trừ khi có -n', c: 'vio' },
      { e: '↺', t: 'Dòng kế', d: 'bộ nhớ ~ một dòng ⇒ file 40 GB vẫn chạy', c: 'tea' },
    ])}
    ${box('info', 'Dấu phân cách là ký tự ĐỨNG NGAY SAU <code>s</code>: <code>s|a|b|</code> = <code>s/a/b/</code>. Có đường dẫn ⇒ dùng <code>|</code> hoặc <code>#</code>.')}` },

  { t: 's/// thay chỗ khớp ĐẦU mỗi dòng; \\1 và &amp; dùng lại phần đã khớp', body: two(
    term(['$ echo "cat cat cat" | sed \'s/cat/dog/\'', 'dog cat cat', '$ echo "cat cat cat" | sed \'s/cat/dog/g\'', '= dog dog dog', '$ echo "cat cat cat" | sed \'s/cat/dog/2\'', 'cat dog cat', '$ echo "2026-09-28" | sed -E \'s/([0-9]{4})-([0-9]{2})-([0-9]{2})/\\3\\/\\2\\/\\1/\'', '= 28/09/2026', '$ echo "port 8080" | sed -E \'s/[0-9]+/[&]/\'', 'port [8080]', '$ echo "URL=/search" | sed \'s|/search|/search?q=a&page=2|\'', '! URL=/search?q=a/searchpage=2', '$ echo "URL=/search" | sed \'s|/search|/search?q=a\\&page=2|\'', '= URL=/search?q=a&page=2'], { title: 'Ubuntu 24.04 — GNU sed 4.9, output thật', dir: '~', fs: 13.5 }),
    `${table(['Cờ cuối s', 'Nghĩa'], [
      ['<code>g</code>', 'mọi chỗ khớp trên dòng'],
      ['<code>2</code>', 'chỉ chỗ khớp thứ 2'],
      ['<code>i</code> / <code>I</code>', 'không phân biệt hoa thường'],
      ['<code>p</code>', 'in dòng đã đổi (đi với <code>-n</code>)'],
      ['<code>w f</code>', 'ghi dòng đã đổi vào file f'],
    ], { sm: true })}
    ${table(['Trong phần THAY', 'Là'], [
      ['<code>&amp;</code>', 'toàn bộ chỗ khớp'],
      ['<code>\\1</code> … <code>\\9</code>', 'nhóm <code>( )</code> thứ 1…9 (cần <code>-E</code>)'],
      ['!<code>\\&amp;</code> · <code>\\/</code>', 'dấu &amp; / dấu phân cách THẬT'],
    ], { sm: true })}
    ${box('warn', 'URL có <code>&amp;</code> mà quên thoát ⇒ sed chèn chính chỗ khớp vào giữa — <b>không báo lỗi</b>, chỉ ra kết quả sai trông hợp lý.')}`, 'l') },

  { t: 'Địa chỉ chọn dòng, chữ cái chọn việc: p d i a c q', body: two(
    table(['Viết', 'Làm gì'], [
      ['<code>3</code> · <code>2,5</code> · <code>$</code>', 'dòng 3 · dòng 2–5 · dòng cuối'],
      ['<code>/^#/</code> · <code>/BEGIN/,/END/</code>', 'dòng khớp regex · khoảng giữa hai mốc'],
      ['<code>/^#/!</code>', '<code>!</code> = đảo: dòng KHÔNG khớp'],
      ['<code>-n \'5p\'</code> · <code>\'5q\'</code>', 'chỉ in dòng 5 · thoát sau dòng 5'],
      ['<code>\'/^$/d\'</code>', 'xoá dòng trống'],
      ['<code>\'1i\\text\'</code> · <code>\'/x/a\\text\'</code>', 'chèn TRƯỚC · thêm SAU (GNU một dòng)'],
      ['<code>\'/^Port/c\\Port 2222\'</code>', 'thay CẢ dòng'],
      ['<code>\'y/abc/xyz/\'</code>', 'đổi từng ký tự, như tr'],
      ['<code>-n \'$=\'</code>', 'in số dòng (như wc -l)'],
    ], { sm: true }),
    `${term(["$ sed -n '/Password/p' sshd.moi", 'PasswordAuthentication no', "$ sed -n 's/yes/no/p' sshd.cu", 'PermitRootLogin no', 'PasswordAuthentication no', '…', "$ printf 'x\\nBEGIN\\n1\\n2\\nEND\\ny\\n' | sed -n '/BEGIN/,/END/{//!p}'", '1', '2', "$ printf '[database]\\nhost=db\\n' | sed '/^\\[database\\]/a\\timeout = 30'", '[database]', '= timeout = 30', 'host=db', "$ seq 1 1000000 | sed -n '5,7p;7q'", '5', '6', '7'], { title: 'Ubuntu 24.04 — output thật', dir: 'cfg', fs: 13.5 })}`, 'r') },

  { t: 'sed -i khác nhau giữa GNU và macOS — và nó đổi inode', body: two(
    `${term(["$ sed -i 's/yes/no/' m.conf", '! sed: 1: "m.conf', '! ": invalid command code m', "$ sed -i '' 's/yes/no/' m.conf", '# chạy — BSD bắt buộc có hậu tố, rỗng cũng được', "$ echo 'id width valid' | sed 's/\\bid\\b/uuid/g'", '! id width valid          # \\b không có trong BSD sed', "$ printf '[database]\\nhost=db\\n' | sed '/^\\[database\\]/a\\timeout = 30'", '! sed: 1: "/^\\[database\\]/a\\timeou ...": extra characters after \\ at the end of a command'], { title: 'Mac M1 · macOS 27 — /usr/bin/sed (BSD)', dir: '~', fs: 13.5 })}`,
    `${term(["$ ls -i t3.conf | cut -d' ' -f1", '31365', "$ sed -i 's/yes/no/' t3.conf", "$ ls -i t3.conf | cut -d' ' -f1", '+ 31367'], { title: 'Ubuntu — sed -i ghi file tạm rồi đổi tên', dir: 'cfg', fs: 14 })}
    ${sh([
      ["sed -n 's/old/new/gp' f", '1. chạy thử: chỉ XEM'],
      ["sed -i.bak 's/old/new/g' f", '2. chạy cả GNU lẫn Mac'],
      ["perl -pi -e 's/old/new/g' f", 'hoặc perl: giống mọi nơi'],
      ["sed -E 's/[[:space:]]+$//' f", '[[:space:]] thay \\s'],
    ], { fs: 14 })}
    ${box('warn', 'Container bind-mount MỘT file vẫn đọc inode CŨ sau <code>sed -i</code> ⇒ ghi đè tại chỗ: <code>cat moi &gt; file</code>.')}`, 'r') },

  /* ───────────── 3.6 ───────────── */
  { t: 'awk cắt sẵn mỗi dòng thành $1…$NF — đọc một dòng log nginx', body: `
    ${annot(NG, [
      { ...at(NG, '203.0.113.45'), t: '$1', d: 'IP', c: 'lx' },
      { ...at(NG, '[28/Sep/2026:10:14:01'), t: '$4', d: 'giờ (còn dính [ )', c: 'blu' },
      { ...at(NG, '"GET'), t: '$6', d: 'phương thức', c: 'pnk' },
      { ...at(NG, '/api/v1/posts'), t: '$7', d: 'đường dẫn', c: 'grn' },
      { ...at(NG, '200'), t: '$9', d: 'mã HTTP', c: 'vio' },
      { ...at(NG, '5120'), t: '$10 = $NF', d: 'số byte', c: 'tea' },
    ], { fs: 20.5, rowH: 58 })}
    ${two(
      table(['Biến', 'Nghĩa'], [
        ['<code>$0</code> · <code>$1</code>…', 'cả dòng · trường thứ 1…'],
        ['<code>NF</code> · <code>$NF</code>', 'số trường (ở đây 10) · trường CUỐI'],
        ['<code>NR</code> · <code>FNR</code>', 'số dòng tổng · số dòng trong file hiện tại'],
        ['<code>-F:</code> · <code>OFS</code>', 'dấu phân cách vào · ra'],
      ], { sm: true }),
      term(["$ awk '$9 >= 400 {print $9, $7}' access.log", '500 /api/v1/orders', '401 /api/v1/auth/me', '404 /favicon.ico'], { title: 'Ubuntu 24.04 (mawk) — mẫu { hành động }', dir: 'log', fs: 14 }), 'l')}` },

  { t: 'BEGIN chạy trước, END chạy sau — biến tự nhớ qua mọi dòng', body: two(
    `${flow([
      { e: 'B', t: 'BEGIN { }', d: 'một lần, trước dòng đầu: đặt FS, OFS', c: 'blu' },
      { e: '↺', t: 'mẫu { việc }', d: 'mỗi dòng; biến tự = 0 / ""', c: 'grn' },
      { e: 'E', t: 'END { }', d: 'một lần, sau dòng cuối: in tổng', c: 'vio' },
    ])}
    ${sh([
      ["awk 'BEGIN { FS=\":\"; OFS=\" | \" }", 'trước dòng 1'],
      ['     $3 >= 1000 { n++; print $1, $7 }', 'mỗi dòng khớp'],
      ["     END { print n, \"tài khoản\" }' /etc/passwd", 'sau dòng cuối'],
    ], { fs: 13.5 })}
    ${term(['nobody | /usr/sbin/nologin', 'ubuntu | /bin/bash', 'an | /bin/bash', '+ 3 | tài khoản'], { title: 'Ubuntu 24.04 (mawk) — output của 3 dòng trên', dir: '~', fs: 13.5 })}`,
    `${term(["$ awk '{s += $10} END {print s, NR}' access.log", '21917 10', "$ awk '{s+=$10; n++} END {if (n) printf \"%.1f\\n\", s/n}' \\", '    access.log', '2191.7', "$ echo a:b:c | awk -F: 'BEGIN{OFS=\"-\"} {print}'", '! a:b:c', "$ echo a:b:c | awk -F: 'BEGIN{OFS=\"-\"} {$1=$1; print}'", '= a-b-c'], { title: 'Ubuntu 24.04 — mawk 1.3.4', dir: 'log', fs: 13.5 })}
    ${box('info', 'OFS chỉ có tác dụng khi awk DỰNG LẠI dòng: <code>print $1, $2</code> hoặc <code>$1=$1</code>. In <code>$0</code> nguyên xi thì dấu cũ vẫn còn. Biến chưa gán = 0 hoặc chuỗi rỗng ⇒ <code>n++</code> không cần khai báo.')}`) },

  { t: 'Mảng liên kết: nhóm và cộng dồn trong MỘT lượt đọc', body: two(
    `${sh([
      ["awk '{b[$1] += $10}           # khoá = IP"],
      ["  END {for (ip in b) printf \"%-14s %6d\\n\", ip, b[ip]}' \\"],
      ['  access.log | sort -k2,2nr     # for-in KHÔNG theo thứ tự'],
    ], { fs: 13.5 })}
    ${term(['203.0.113.45    11301', '198.51.100.7     5432', '192.0.2.19       5184'], { title: 'Ubuntu 24.04 — output thật', dir: 'log', fs: 13.5 })}
    ${term(["$ awk '{c[$9]++} END {for (s in c) print s, c[s]}' \\", '    access.log | sort | paste -sd" "', '200 5 201 1 304 1 401 1 404 1 500 1'], { title: 'đếm theo mã HTTP — không cần sort | uniq -c', dir: 'log', fs: 13.5 })}`,
    `${seenSvg()}
    ${term(["$ printf 'apple\\nbanana\\napple\\ncherry\\nbanana\\n' | awk '!seen[$0]++'", 'apple', 'banana', 'cherry'], { title: 'bỏ trùng, GIỮ thứ tự gốc', dir: '~', fs: 13.5 })}`) },

  { t: 'Chương trình awk nằm trong nháy ĐƠN — biến shell đi qua -v', body: two(
    `${term(['$ awk "{print $1}" access.log | head -1', '! 203.0.113.45 - - [28/Sep/2026:10:14:01 +0000] "GET /api/…', '# bash thay $1 (rỗng) ⇒ awk nhận {print } ⇒ in CẢ dòng', '$ nguong=1000', "$ awk -v n=\"$nguong\" '$10 > n {print $1, $10}' access.log | head -2", '= 203.0.113.45 5120', '= 203.0.113.45 5120', "$ echo abc | awk '{print gensub(/b/, \"X\", \"g\")}'", '! awk: line 2: function gensub never defined', "$ echo abc | gawk '{print gensub(/b/, \"X\", \"g\")}'", '= aXc'], { title: 'Ubuntu 24.04 — awk ở đây là mawk', dir: 'log', fs: 13.5 })}`,
    `${table(['Máy', '<code>awk</code> là', 'Ghi chú'], [
      ['Ubuntu 24.04', 'mawk 1.3.4', 'nhanh; không gensub/asort'],
      ['Fedora 44', 'gawk 5.3.2', 'đủ phần mở rộng GNU'],
      ['macOS 27', 'awk 20200816 (BSD)', 'không gensub; length đếm byte'],
    ], { sm: true })}
    ${table(['Hàm POSIX', 'Ví dụ → kết quả'], [
      ['<code>length(s)</code>', '<code>length("abc")</code> → 3'],
      ['<code>substr(s,i,n)</code>', '<code>substr("/api/v1/x",1,7)</code> → /api/v1'],
      ['<code>split(s,a,sep)</code>', '<code>split("/api/v1/x",p,"/")</code> → 4, p[2]=api'],
      ['<code>sub</code> · <code>gsub</code>', 'thay lần đầu · mọi lần (trả số lần)'],
      ['<code>toupper</code> · <code>index</code>', 'viết hoa · vị trí chuỗi con'],
    ], { sm: true })}`, 'l') },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 3', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['File rỗng sau <code>sort f &gt; f</code>', 'Shell cắt file TRƯỚC khi sort đọc', '<code>sort -o f f</code> · <code>| sponge f</code>'],
    ['Log build thiếu dòng lỗi', '<code>2&gt;&amp;1 &gt; log</code> sai thứ tự', '<code>&gt; log 2&gt;&amp;1</code> hoặc <code>&amp;&gt; log</code>'],
    ['<code>sudo echo … &gt;&gt; /etc/x</code>: Permission denied', 'Shell của bạn mở file, không phải sudo', '<code>| sudo tee -a /etc/x</code>'],
    ['Script “thành công” dù curl lỗi', 'Ống chỉ báo mã khâu cuối', '<code>set -o pipefail</code> + <code>curl -f</code>'],
    ['<code>tail -f | grep</code> im lặng hàng giờ', 'grep trong ống đệm theo khối', '<code>--line-buffered</code> · <code>stdbuf -oL</code>'],
    ['Biến đếm trong <code>| while</code> vẫn 0', 'Khâu của ống chạy trong shell con', '<code>done &lt; file</code> · <code>&lt; &lt;(lệnh)</code>'],
    ['<code>uniq -c</code> đếm thiếu', 'uniq chỉ gộp dòng kề nhau', '<code>sort | uniq -c</code>'],
    ['Lọc chạy trên VPS, trượt trên Mac', 'BRE <code>\\|</code>, <code>\\d</code>, <code>sed -i</code> khác GNU/BSD', '<code>-E</code>, <code>[0-9]</code>, <code>sed -i.bak</code>'],
    ['<code>awk "{print $1}"</code> in cả dòng', 'Nháy kép: bash thay $1 trước', 'Nháy đơn + <code>-v</code>'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 3 (1/2): chuyển hướng, ống dẫn, grep', body: two(
    sh([
      ['cmd > f · cmd >> f', 'ghi đè · nối thêm stdout'],
      ['cmd 2> err · cmd 2>/dev/null', 'stderr vào file · vứt đi'],
      ['cmd > f 2>&1 · cmd &> f', 'CẢ HAI vào f'],
      ['cmd < f · cmd <<< "$s"', 'file / chuỗi vào stdin'],
      ["cat <<'EOF' > f", 'heredoc, không khai triển'],
      ['cmd | tee -a log', 'xem + lưu'],
      ['cmd |& grep x', '= 2>&1 | (bash 4+)'],
      ['set -o pipefail · ${PIPESTATUS[@]}', 'mã thoát cả chuỗi'],
      ['while read -r l; do …; done < f', 'không mất biến'],
      ['diff <(sort a) <(sort b)', 'thay thế tiến trình'],
      ['find … -print0 | xargs -0 -r cmd', 'dòng → tham số, an toàn'],
    ], { fs: 14.5 }),
    sh([
      ['grep -E "a|b" · grep -F "1.2.3"', 'ERE · nguyên văn'],
      ['grep -P "\\d+(?=ms)"', 'PCRE · Mac không có'],
      ['grep -inw error f', 'hoa/thường · số dòng · từ'],
      ['grep -v · -c · -l · -o', 'đảo · đếm · tên · phần khớp'],
      ['grep -C3 Exception f', 'ngữ cảnh 3 dòng'],
      ['grep -rn --include="*.ts" x src/', 'đệ quy có lọc'],
      ['grep -rn --exclude-dir=.git x .', 'bỏ thư mục'],
      ['grep -Fxf ds.txt all.txt', 'giao hai danh sách'],
      ['grep -q x f && echo co', 'mã 0/1/2'],
      ['tail -f log | grep --line-buffered x', 'theo dõi'],
      ['rg -t ts apiKey', 'ripgrep cho kho mã'],
    ], { fs: 14.5 })) },

  { t: 'Bảng tra nhanh Chương 3 (2/2): công cụ nhỏ, sed, awk', body: two(
    sh([
      ["cut -d: -f1,7 · cut -c1-10", 'trường · ký tự'],
      ["sort -n · -h · -V · -rn · -u", 'số · 2K/1M · phiên bản'],
      ['sort -t: -k3,3n f', 'theo đúng trường 3'],
      ['sort | uniq -c | sort -rn', 'đếm theo nhóm'],
      ['uniq -d · uniq -u', 'dòng lặp · dòng đơn'],
      ["tr -d '\\r' · tr -s ' '", 'xoá CR · ép dấu cách'],
      ['wc -l < f · tail -n +2 · tail -F', 'đếm · bỏ tiêu đề · theo tên'],
      ['paste -sd, f · paste a b', 'dồn một dòng · ghép ngang'],
      ['comm -23 <(sort a) <(sort b)', 'chỉ có trong a'],
      ['join -t, a.csv b.csv · column -t -s,', 'nối khoá · căn bảng'],
      ['diff -u a b · diff -rq d1 d2 · cmp -s', 'file · thư mục · byte'],
    ], { fs: 13.5 }),
    sh([
      ["sed 's/a/b/g' · sed -E 's/(x)-(y)/\\2-\\1/'", 'thay · nhóm'],
      ["sed -n '10,20p' · sed -n '/re/p'", 'in khoảng · như grep'],
      ["sed '/^#/d; /^$/d' f", 'bỏ # và dòng trống'],
      ["sed 's|/usr/local|/opt|g'", 'đổi dấu phân cách'],
      ["sed -i.bak 's/a/b/' f", 'sửa tại chỗ, cả Mac'],
      ["awk '{print $1, $NF}' f", 'trường đầu · cuối'],
      ["awk -F: '$3 >= 1000' /etc/passwd", 'mẫu = phép so sánh'],
      ["awk '{s+=$2} END {print s}'", 'cộng cột'],
      ["awk '{c[$1]++} END {for(k in c) print c[k],k}'", 'đếm theo khoá'],
      ["awk '!seen[$0]++'", 'bỏ trùng, giữ thứ tự'],
      ["awk -v n=\"$x\" '$3 > n'", 'biến shell vào awk'],
    ], { fs: 13.5 })) },

  { t: 'Thực hành Chương 3 (45 phút): điều tra một buổi sáng sự cố', body: `
    ${steps([
      ['Dựng <code>~/thu-linux/ch3/log</code>: <code>app.log</code> + <code>access.log</code> bằng heredoc (bài 3.3)', 'kiểm: <code>wc -l *.log</code> ra 10 và 10'],
      ['Chạy build giả <code>ls /etc/hostname /nope</code> vào <code>build.log</code> SAO CHO bắt được cả lỗi; thử cả thứ tự sai', '<code>wc -l build.log</code> = 2 ở bản đúng, 1 ở bản sai'],
      ['Trả lời bằng MỘT dòng mỗi câu: bao nhiêu dòng lỗi (ERROR+FATAL)? IP nào gọi nhiều nhất? mã HTTP nào ≥ 400?', '4 · 203.0.113.45 (5) · 500 401 404'],
      ['Tính tổng byte theo IP bằng awk, sắp giảm dần; bỏ trùng danh sách đường dẫn mà giữ thứ tự', '203.0.113.45 = 11301'],
      ['Sửa <code>sshd.cu</code>: <code>PermitRootLogin no</code> bằng sed — chạy thử <code>-n …p</code> trước, rồi <code>-i.bak</code>; <code>diff -u</code> bản cũ và mới', '<code>diff</code> chỉ còn đúng 1 dòng “-” và 1 dòng “+”'],
    ])}
    ${box('good', '<b>Đạt khi:</b> mỗi con số ở dòng chữ nhỏ ra đúng, mọi one-liner bạn gõ được từ trái sang phải mà nhìn output sau mỗi <code>|</code>, và bạn giải thích được vì sao <code>2&gt;&amp;1 &gt; f</code> để lọt lỗi.')}` },
]);
