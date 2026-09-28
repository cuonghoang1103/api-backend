/**
 * Linux & Bash · Deck lx-06 — Chương 6: Biến, dấu nháy & khai triển.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 28/09/2026:
 *   • "Ubuntu" = container ubuntu:24.04 (bash 5.2.21, dash là /bin/sh, + bc 1.07.1) trên Mac M1, người dùng an,
 *                thư mục ~/thu-linux/ch6.
 *   • "Mac"    = Mac M1, macOS 27, /bin/bash 3.2.57 và zsh 5.9 (chạy với -f: không đọc file cấu hình).
 * Thứ tự khai triển lấy từ bash(1) mục EXPANSION ("The order of expansions is: brace expansion; tilde expansion,
 * parameter and variable expansion, arithmetic expansion, and command substitution (done in a left-to-right
 * fashion); word splitting; pathname expansion; and quote removal").
 *
 * Hình tự vẽ (SVG nội tuyến, không đụng thư viện): orderSvg() — một dòng lệnh đi qua từng bước khai triển;
 * splitSvg() — một biến không nháy thành 4 tham số; trimSvg() — # ## % %% trên cùng một đường dẫn;
 * andOrSvg() — vì sao a && b || c không phải if/else.
 */
import { S, cover, sh, term, mindmap, diagram, cards, box, steps, table, two, list, kpis, sv, R, T, A, D, esc } from './_lx-chung.mjs';

export const deck = { key: 'lx-06', code: 'LINUX · CHƯƠNG 6', title: 'Biến, dấu nháy &amp; khai triển', sub: 'Linux & Bash · Chương 6' };

const MONO = 'SF Mono,Menlo,monospace';
const c = (k) => D[k] || k;

/** Một dòng chữ đơn cách ghép từ nhiều đoạn màu: segs = [[chữ, màu], …]. */
const tok = (x, y, segs, { fs = 17 } = {}) =>
  `<text x="${x}" y="${y}" font-size="${fs}" font-family="${MONO}" xml:space="preserve">${segs.map(([s, k]) =>
    `<tspan fill="${c(k || '#e6edf3')}">${esc(s)}</tspan>`).join('')}</text>`;

/** Slide 8 — một dòng lệnh đi qua từng bước khai triển của bash. */
const orderSvg = () => {
  const rows = [
    ['Bạn gõ', 'dim', [["printf '[%s]\\n' ", 'mu'], ['{a,b}', 'lx'], ['.$ext ', 'blu'], ['~ ', 'tea'], ['$((6*7)) ', 'vio'], ['$v ', 'blu'], ["'*'", 'ora']], 'ext=txt · v=\'x *.md\' · thư mục có README.md, notes.md'],
    ['1 · Ngoặc nhọn {}', 'lx', [["printf '[%s]\\n' ", 'mu'], ['a.$ext b.$ext ', 'lx'], ['~ $((6*7)) $v ', 'mu'], ["'*'", 'ora']], 'chỉ sinh chữ — chưa biết $ext là gì'],
    ['2 · Dấu ngã ~', 'tea', [["printf '[%s]\\n' a.$ext b.$ext ", 'mu'], ['/home/an ', 'tea'], ['$((6*7)) $v ', 'mu'], ["'*'", 'ora']], 'bước 2–3 là CÙNG một lượt, trái → phải'],
    ['3 · $biến $(lệnh) $((số))', 'blu', [["printf '[%s]\\n' a.", 'mu'], ['txt', 'blu'], [' b.', 'mu'], ['txt', 'blu'], [' /home/an ', 'mu'], ['42 ', 'vio'], ['⟨x *.md⟩ ', 'blu'], ["'*'", 'ora']], 'giá trị của $v vẫn là MỘT mẩu: "x *.md"'],
    ['4 · Cắt từ (IFS)', 'amb', [["printf '[%s]\\n' a.txt b.txt /home/an 42 ", 'mu'], ['⟨x⟩ ⟨*.md⟩ ', 'amb'], ["'*'", 'ora']], 'chỉ cắt KẾT QUẢ khai triển KHÔNG nháy'],
    ['5 · Glob (tên file)', 'grn', [["printf '[%s]\\n' a.txt b.txt /home/an 42 x ", 'mu'], ['README.md notes.md ', 'grn'], ["'*'", 'ora']], "'*' có nháy ⇒ không glob"],
    ['6 · Bỏ dấu nháy', 'pnk', [["printf [%s]\\n a.txt b.txt /home/an 42 x README.md notes.md ", 'mu'], ['*', 'pnk']], 'nháy biến mất — lệnh không bao giờ thấy chúng'],
  ];
  let s = '';
  rows.forEach(([lab, col, segs, note], i) => {
    const y = i * 60;
    s += R(0, y + 4, 262, 48, { c: col, fill: i === 0 ? '#0a0f0c' : '#111812', r: 10, sw: 2, dash: i === 0 });
    s += T(131, y + 34, lab, { fs: 16, a: 'middle', b: true, c: col === 'dim' ? 'mu' : col });
    s += R(280, y + 4, 880, 48, { c: 'bd', fill: '#050806', r: 8, sw: 1.5 });
    s += tok(294, y + 26, segs, { fs: 16 });
    s += T(294, y + 46, note, { fs: 14, c: 'dim' });
    if (i) s += A(131, y - 8, 131, y + 2, { c: 'dim', sw: 2 });
  });
  s += `<path d="M268 128 L274 128 L274 232 L268 232" stroke="${D.tea}" stroke-width="2" fill="none"/>`;
  return sv(1160, 422, s);
};

/** Slide 9 — một biến không nháy thành bốn tham số. */
const splitSvg = () => {
  const Bx = (x, y, w, t, col, dash = false) => R(x, y, w, 40, { c: col, r: 8, sw: 2, dash }) + T(x + w / 2, y + 26, t, { fs: 15.5, a: 'middle', mono: true, c: col === 'dim' ? 'mu' : '#fff' });
  let s = '';
  s += T(0, 18, 'KHÔNG NHÁY:  printf \'[%s]\\n\' $v', { fs: 16, b: true, c: 'red', mono: true });
  s += Bx(0, 40, 150, '$v', 'blu');
  s += A(155, 60, 200, 60, { c: 'mu' }) + Bx(205, 40, 190, '"my\u00a0\u00a0*.txt"', 'blu');
  s += T(300, 104, 'thay giá trị vào', { fs: 13.5, a: 'middle', c: 'dim' });
  s += A(400, 60, 445, 60, { c: 'amb' }) + Bx(450, 40, 90, 'my', 'amb') + Bx(548, 40, 110, '*.txt', 'amb');
  s += T(554, 104, 'cắt ở dấu cách: 2 từ', { fs: 13.5, a: 'middle', c: 'amb' });
  s += A(663, 60, 703, 60, { c: 'grn' });
  s += Bx(708, 40, 70, 'my', 'grn') + Bx(784, 40, 90, 'a.txt', 'grn') + Bx(880, 40, 90, 'b.txt', 'grn') + Bx(976, 40, 184, 'my report.txt', 'grn');
  s += T(934, 104, '*.txt glob ra 3 file ⇒ 4 tham số', { fs: 13.5, a: 'middle', c: 'grn' });
  s += T(0, 150, 'CÓ NHÁY:  printf \'[%s]\\n\' "$v"', { fs: 16, b: true, c: 'grn', mono: true });
  s += Bx(0, 170, 150, '"$v"', 'blu') + A(155, 190, 200, 190, { c: 'mu' }) + Bx(205, 170, 190, 'my\u00a0\u00a0*.txt', 'grn');
  s += T(410, 196, '⇒ đúng MỘT tham số, hai dấu cách còn nguyên, * không bị glob', { fs: 15, c: 'grn' });
  return sv(1160, 222, s);
};

/** Slide 15 — # ## % %% trên cùng một đường dẫn. */
const trimSvg = () => {
  const str = '/srv/app/config/db.yml';
  const fs = 24, cw = fs * 0.602, x0 = 250;
  const rows = [
    ['${p#*/}', 0, 1, 'lx', 'ngắn nhất, từ TRÁI'],
    ['${p##*/}', 0, 16, 'lx', 'dài nhất, từ TRÁI → basename'],
    ['${p%/*}', 15, 22, 'blu', 'ngắn nhất, từ PHẢI → dirname'],
    ['${p%%/*}', 0, 22, 'blu', 'dài nhất, từ PHẢI → rỗng'],
  ];
  let s = T(0, 30, 'p=', { fs: 20, mono: true, c: 'mu' }) + T(x0, 30, str, { fs, mono: true, b: true });
  s += T(x0 + str.length * cw + 24, 30, '(bị gỡ = đỏ gạch, còn lại = xanh)', { fs: 14, c: 'dim' });
  rows.forEach(([op, a, b, col, note], i) => {
    const y = 60 + i * 62;
    s += R(0, y, 200, 44, { c: col, r: 8, sw: 2 }) + T(100, y + 29, op, { fs: 18, a: 'middle', mono: true, b: true, c: col });
    s += R(x0 + a * cw - 2, y + 4, (b - a) * cw + 4, 36, { c: 'red', fill: 'rgba(255,92,108,.14)', r: 4, sw: 1.5 });
    const kept = str.slice(0, a) + ' '.repeat(b - a) + str.slice(b);
    s += `<text x="${x0}" y="${y + 30}" font-size="${fs}" font-family="${MONO}" xml:space="preserve"><tspan fill="${D.grn}">${esc(kept.slice(0, a))}</tspan><tspan fill="${D.red}" text-decoration="line-through">${esc(str.slice(a, b))}</tspan><tspan fill="${D.grn}">${esc(str.slice(b))}</tspan></text>`;
    const res = str.slice(0, a) + str.slice(b);
    s += T(x0 + str.length * cw + 24, y + 22, `→ [${res}]`, { fs: 17, mono: true, b: true, c: 'grn' });
    s += T(x0 + str.length * cw + 24, y + 42, note, { fs: 13.5, c: 'mu' });
  });
  return sv(1160, 310, s);
};

/** Slide 20 — a && b || c: c chạy cả khi a đúng mà b hỏng. */
const andOrSvg = () => {
  const Nd = (x, y, w, t, d, col) => R(x, y, w, 64, { c: col, r: 10 }) + T(x + w / 2, y + 28, t, { fs: 17, a: 'middle', b: true, mono: true }) + T(x + w / 2, y + 50, d, { fs: 13.5, a: 'middle', c: 'mu' });
  let s = '';
  s += Nd(0, 70, 230, '[[ -f f ]]', 'a: có file ✓ (0)', 'grn');
  s += A(232, 102, 318, 102, { c: 'grn' }) + T(275, 92, '&&', { fs: 16, a: 'middle', mono: true, c: 'grn', b: true });
  s += Nd(322, 70, 250, 'process f', 'b: xử lý HỎNG (1)', 'red');
  s += A(574, 102, 660, 102, { c: 'red' }) + T(617, 92, '||', { fs: 16, a: 'middle', mono: true, c: 'red', b: true });
  s += Nd(664, 70, 300, 'echo "không có file"', 'c: VẪN chạy — nói sai', 'amb');
  s += T(0, 30, '|| nhìn mã thoát của lệnh NGAY TRƯỚC nó (process), không nhìn [[ -f f ]]', { fs: 16, c: 'lx', b: true });
  s += T(0, 170, 'a && b || c  =  (a && b) || c  ⇒ c chạy khi a sai HOẶC khi b sai', { fs: 16, mono: true, c: 'mu' });
  return sv(1160, 186, s);
};

/** Khoảng cách giữa các khối xếp chồng trong một cột của two(). */
const FIX = '<style>.c-two>div>*+*{margin-top:12px}</style>';

export const slides = S([
  cover({ t: 'Chương 6 — Biến, dấu nháy &amp; khai triển', sub: 'biến và $(…) · thứ tự khai triển · ba loại nháy và "$@" · ${var…} xử lý chuỗi · mã thoát, [[ ]], case · vòng lặp và hàm', chap: 'CHƯƠNG 6' }),

  { t: 'Bản đồ chương: shell viết lại dòng lệnh trước khi chạy', body: mindmap('Shell là ngôn ngữ', 'bạn chọn thứ nó viết lại', [
    { t: '6.1 Biến', d: 'gán không cách · $(…) · $((…)) · export', c: 'lx' },
    { t: '6.2 Dấu nháy', d: 'thứ tự khai triển · cắt từ · "$@" · mảng · IFS', c: 'grn' },
    { t: '6.3 ${var…}', d: ':- := :? :+ · # % · / // · ^^ ,,', c: 'blu' },
    { t: '6.4 Mã thoát', d: '$? · && || · [[ ]] · test file · case', c: 'amb' },
    { t: '6.5 Vòng lặp · hàm', d: 'for glob · while read -r · local', c: 'vio' },
    { t: 'macOS · Ch13', d: 'bash 3.2 · zsh không cắt $var · declare -A ở Ch13', c: 'red' },
  ]) },

  /* ───────────── 6.1 ───────────── */
  { t: 'Dấu cách quanh = biến phép gán thành một lệnh', body: two(
    `${sh([
      ['name = "Binh"', 'chạy lệnh "name" với 2 tham số'],
      ['name= "Binh"', 'name rỗng, chạy lệnh "Binh"'],
      ['name="Binh"', 'phép gán đúng'],
      ['echo "$name_backup.txt"', 'tìm biến name_backup'],
      ['echo "${name}_backup.txt"', '{} chỉ rõ tên dừng ở đâu'],
    ], { fs: 15 })}
    ${box('tip', 'Mặc định cho cả khoá: <code>"${var}"</code> — ngoặc nhọn chặn lỗi ranh giới tên, nháy kép chặn cắt từ và glob (6.2).')}`,
    term(['$ name = "Binh"', '! bash: name: command not found', '$ name= "Binh"', '! bash: Binh: command not found', '$ name="Binh"', '$ echo "[$name_backup.txt] [${name}_backup.txt]"', '[.txt] [Binh_backup.txt]'], { title: 'Ubuntu 24.04 — bash 5.2', dir: '~/thu-linux/ch6' }), 'l') },

  { t: '$(lệnh) chạy shell con, bắt stdout, bỏ \\n cuối', body: `
    ${diagram({ w: 1160, h: 190, nodes: [
      { id: 's', x: 0, y: 50, w: 290, h: 90, t: 'shell của bạn', d: 'today=$(date +%F)\nchờ rồi dán kết quả vào', c: 'lx', mono: true },
      { id: 'c', x: 440, y: 50, w: 280, h: 90, t: 'shell con (fork)', d: 'chạy: date +%F', c: 'blu', mono: true },
      { id: 't', x: 880, y: 0, w: 280, h: 72, t: 'terminal', d: 'stderr ra thẳng đây', c: 'red' },
      { id: 'v', x: 880, y: 112, w: 280, h: 72, t: 'today="2026-09-28"', d: '"\\n" cuối đã bị cắt', c: 'grn', mono: true },
    ], edges: [
      { from: 's', to: 'c', t: 'fork', c: 'blu' },
      { from: 'c', to: 't', t: 'stderr', c: 'red', off: 8 },
      { from: 'c', to: 'v', t: 'stdout', c: 'grn', off: 8 },
    ] })}
    ${two(
      term(["$ x=$(printf 'a\\n\\n\\n'); printf '[%s]\\n' \"$x\"", '[a]', '$ y=$(ls /khong-co); echo "rc=$? y=[$y]"', "! ls: cannot access '/khong-co': No such file or directory", 'rc=2 y=[]', '$ y=$(ls /khong-co 2>&1); echo "[$y]"', "+ [ls: cannot access '/khong-co': No such file or directory]"], { title: 'Ubuntu — stderr không bị bắt, trừ khi 2>&1', fs: 13.5 }),
      box('info', '<code>$( )</code> lồng được: <code>$(dirname "$(readlink -f "$0")")</code>. Dấu huyền <code>&#96;…&#96;</code> làm cùng việc nhưng lồng phải thoát <code>\\&#96;</code> — chỉ còn gặp trong script cũ.'), 'l2')}` },

  { t: 'Số học bash chỉ có số nguyên — và 08 là hệ tám', body: two(
    term(['$ echo $((10 / 3)) $((10 % 3)) $((1 / 2)) $((-7 / 2)) $((2**10))', '3 1 0 -3 1024', '$ echo $((08))', '! bash: 08: value too great for base (error token is "08")', '$ month=08; echo $((10#$month))', '= 8', '$ echo "scale=2; 10/3" | bc', '3.33', "$ awk 'BEGIN {print 10/3}'", '3.33333', '$ echo $(( 9223372036854775807 + 1 ))', '! -9223372036854775808'], { title: 'Ubuntu — bash 5.2 + bc 1.07.1', fs: 14 }),
    `${table(['Viết', 'Nghĩa'], [
      ['<code>$(( a * b ))</code>', 'tính, thay bằng KẾT QUẢ'],
      ['<code>(( i++ ))</code> · <code>(( i += 5 ))</code>', 'tính tại chỗ, không in'],
      ['<code>(( n &gt; 10 ))</code>', 'mã thoát 0 nếu đúng — dùng trong <code>if</code>'],
      ['!<code>(( 0 ))</code>', 'kết quả 0 ⇒ mã thoát 1 (“sai”)'],
      ['<code>10#$x</code>', 'ép hệ mười: 08, 09 không lỗi'],
      ['-<code>$((1/2))</code> = 0', 'cắt bỏ phần lẻ, không làm tròn'],
    ], { sm: true })}
    ${box('warn', 'Trong <code>(( ))</code> không cần <code>$</code> trước tên biến. Tràn số 64 bit thì quay vòng âm — không báo lỗi.')}`, 'l') },

  { t: 'Chỉ biến đã export mới sang tiến trình con', body: `
    ${diagram({ w: 1160, h: 170, nodes: [
      { id: 'p', x: 0, y: 20, w: 360, h: 120, t: 'shell cha', d: 'myvar="cuc bo"      (biến shell)\nexport MYVAR="da xuat" (môi trường)', c: 'lx', mono: true },
      { id: 'k', x: 780, y: 20, w: 380, h: 120, t: 'bash -c (tiến trình con)', d: '$myvar  → rỗng\n$MYVAR  → "da xuat"', c: 'grn', mono: true },
    ], edges: [{ from: 'p', to: 'k', t: 'fork+exec: BẢN SAO môi trường', c: 'grn' }] })}
    ${two(
      term(['$ myvar="cuc bo"; export MYVAR="da xuat"', "$ bash -c 'echo \"[$myvar] [$MYVAR]\"'", '[] [da xuat]', "$ MYVAR=once bash -c 'echo \"[$MYVAR]\"'; echo \"sau: [$MYVAR]\"", '[once]', 'sau: [da xuat]', '$ declare -p myvar MYVAR', 'declare -- myvar="cuc bo"', '+ declare -x MYVAR="da xuat"'], { title: 'Ubuntu — -x trong declare -p = đã export', fs: 13.5 }),
      box('tip', '<code>VAR=x lệnh</code> đặt biến cho ĐÚNG một lệnh. Con không bao giờ gửi biến ngược về cha — muốn “lấy” giá trị từ con thì cho con in ra stdout và bắt bằng <code>$(…)</code>. PATH và file khởi động: Chương 8.'), 'l2')}` },

  { t: 'Biến đặc biệt: shell tự điền cho mọi script', body: two(
    term(['$ ./demo.sh deploy "bao cao.pdf"', '$0=./demo.sh  $#=2  $1=[deploy]  $2=[bao cao.pdf]', '$@ ->', '  [deploy]', '  [bao cao.pdf]', '$?=1  $$=20412  BASHPID=20412', '$!=20413', 'LINENO=6  BASH_SOURCE=./demo.sh  SECONDS=0', 'RANDOM=30707  BASH_VERSION=5.2.21(1)-release'], { title: 'Ubuntu — demo.sh in từng biến', dir: '~/thu-linux/ch6', fs: 13.5 }),
    table(['Biến', 'Là gì'], [
      ['<code>$0</code> · <code>$1</code>…<code>${10}</code>', 'tên script · tham số (từ 10 cần {})'],
      ['<code>$#</code> · <code>"$@"</code>', 'số tham số · mọi tham số, mỗi cái một từ'],
      ['<code>$?</code>', 'mã thoát lệnh vừa rồi (6.4)'],
      ['<code>$$</code> · <code>$!</code>', 'PID shell · PID job nền cuối (Ch5)'],
      ['<code>$LINENO</code> · <code>$BASH_SOURCE</code>', 'dòng · file đang chạy — cho log lỗi'],
      ['<code>$SECONDS</code> · <code>$RANDOM</code>', 'giây từ lúc chạy · 0–32767'],
      ['!<code>read -r -p "…" v</code>', 'đọc vào biến; <code>-s</code> ẩn · <code>-t</code> hết giờ'],
    ], { sm: true }), 'l') },

  /* ───────────── 6.2 ───────────── */
  { t: 'Bash khai triển theo thứ tự cố định', body: `${orderSvg()}
    ${box('tip', 'Soi thứ bash THẬT SỰ chạy: <code>set -x</code> in <code>+ printf \'[%s]\\n\' a.txt b.txt /home/an 42 x README.md notes.md \'*\'</code> — đúng các tham số của hàng 6 (xtrace tự thêm nháy chỉ để hiển thị).')}` },

  { t: 'Không nháy: một biến thành bốn tham số', body: `${splitSvg()}
    ${two(
      term(["$ touch a.txt b.txt 'my report.txt'", "$ v='my  *.txt'", "$ printf '[%s]\\n' $v", '! [my]', '! [a.txt]', '! [b.txt]', '! [my report.txt]', "$ printf '[%s]\\n' \"$v\"", '= [my  *.txt]'], { title: 'Ubuntu — printf \'[%s]\\n\' in mỗi tham số một dòng', dir: '~/thu-linux/ch6/q', fs: 13.5 }),
      box('bad', '<code>rm $userinput</code> với <code>userinput="*"</code> = xoá cả thư mục. Chỗ hỏng nằm ở DỮ LIỆU chứ không ở mã: thử bằng tên file “gọn” thì không bao giờ thấy.'), 'l')}` },

  { t: "Ba loại nháy: soi bằng printf '[%s]\\n'", body: two(
    table(['Viết', 'printf \'[%s]\\n\' … in ra', 'Khai triển gì'], [
      ['<code>$v</code>', '-[my] [a.txt] [b.txt] [my report.txt]', 'mọi thứ + cắt + glob'],
      ['<code>"$v"</code>', '+[my&nbsp;&nbsp;*.txt]', '$ $( ) $(( )) — không cắt, không glob'],
      ['<code>\'$v\'</code>', '[$v]', 'KHÔNG gì cả'],
      ['<code>$\'tab:\\there\'</code>', '[tab:→here] (tab thật)', '\\t \\n \\\' kiểu C'],
      ['<code>"Giá: \\$5 \\"x\\""</code>', '[Giá: $5 "x"]', 'trong "" chỉ \\ trước $ &#96; " \\'],
      ['<code>\'it\'"\'"\'s\'</code> · <code>"it\'s"</code>', '[it\'s] · [it\'s]', 'chuỗi đứng sát nhau = nối'],
    ], { sm: true }),
    `${term(["$ printf '[%s]\\n' 'nguyen van $HOME la '\"$HOME\"", '[nguyen van $HOME la /home/an]', "$ echo \"a\"'b'c\\ d", 'abc d', '$ f=app.log', '$ [[ $f == *.log ]] && echo "khop glob"', 'khop glob', '$ [[ $f == "*.log" ]] || echo "co nhay = chu nguyen van"', '+ co nhay = chu nguyen van'], { title: 'Ubuntu — nháy trong [[ ]] làm mẫu thành chữ thường', fs: 13.5 })}
    ${box('tip', 'Nháy đơn cho chương trình awk/sed/regex; nháy kép cho mọi <code>$</code> của shell.')}`, 'r') },

  { t: '"$@" giữ nguyên từng tham số — $@ và "$*" thì không', body: two(
    term(['$ set -- "hello world" foo ""', "$ printf '[%s]\\n' \"$@\"", '= [hello world]', '= [foo]', '= []', "$ printf '[%s]\\n' $@", '! [hello]', '! [world]', '! [foo]', "$ printf '[%s]\\n' \"$*\"", '[hello world foo ]', "$ IFS=,; printf '[%s]\\n' \"$*\"", '[hello world,foo,]'], { title: 'Ubuntu — 3 tham số, một cái rỗng', fs: 13.5 }),
    `${table(['Viết', 'Kết quả', 'Dùng khi'], [
      ['+<code>"$@"</code>', 'đủ 3, giữ dấu cách và cả tham số rỗng', 'chuyển tiếp tham số — gần như LUÔN'],
      ['-<code>$@</code> · <code>$*</code>', 'cắt lại: hello · world · foo — MẤT tham số rỗng', 'không bao giờ'],
      ['<code>"$*"</code>', 'MỘT chuỗi, nối bằng ký tự đầu của IFS', 'dựng một thông điệp'],
    ], { sm: true })}
    ${sh([['#!/usr/bin/env bash', 'script bọc'], ['exec docker run --rm -v "$PWD:/w" img "$@"', 'đưa nguyên xi mọi tham số']], { fs: 14.5 })}`, 'l') },

  { t: 'Mảng: "${a[@]}" là cách mở đúng duy nhất', body: two(
    `${sh([
      ['files=("report one.txt" "b.txt" "*")', 'ba phần tử'],
      ['echo "${#files[@]} ${files[0]} ${files[-1]}"', 'đếm · đầu · cuối'],
      ['files+=("x y")', 'nối thêm'],
      ['unset \'files[1]\'', 'xoá — chỉ số không dồn lại'],
      ['echo "${!files[@]}"', 'các chỉ số còn lại'],
      ['args=(--output "/tmp/my log")', 'dựng lệnh dần dần'],
      ['[[ -n $f ]] && args+=(--filter "$f")', ''],
      ['mycommand "${args[@]}"', 'mỗi phần tử một tham số'],
    ], { fs: 14.5 })}
    ${box('info', 'Mảng KẾT HỢP <code>declare -A</code>, <code>mapfile</code> nâng cao, nameref: Chương 13.')}`,
    term(["$ printf '[%s]\\n' \"${files[@]}\"", '= [report one.txt]', '= [b.txt]', '= [*]', "$ printf '[%s]\\n' ${files[@]}", '! [report]', '! [one.txt]', '! [b.txt]', '! [a.txt]', '! [b.txt]', '! [my report.txt]', '$ echo "n=${#files[@]} dau=${files[0]} cuoi=${files[-1]}"', 'n=3 dau=report one.txt cuoi=*', '$ files+=("x y"); unset \'files[1]\'; echo "${!files[@]}"', '0 2 3'], { title: 'Ubuntu — không nháy: cắt từ, rồi * glob ra 3 file', fs: 13.5 }), 'r') },

  { t: 'IFS quyết định cắt ở đâu — zsh thì không cắt $var', body: two(
    term(["$ bash -c 'printf \"%s\" \"$IFS\"' | od -c | head -1", '0000000      \\t  \\n', '$ line="alice:x:1001:1001::/home/alice:/bin/bash"', '$ IFS=: read -r user _ uid gid _ home shell <<< "$line"', '$ echo "$user $uid $home $shell"', '= alice 1001 /home/alice /bin/bash', '$ IFS=, read -r -a parts <<< "a,b,,c"', "$ printf '[%s]\\n' \"${parts[@]}\"", '[a]', '[b]', '[]', '[c]'], { title: 'Ubuntu — IFS mặc định: dấu cách, tab, xuống dòng', fs: 13.5 }),
    `${term(["% zsh -f -c 'v=\"a b *.txt\"; printf \"[%s]\\n\" $v'", '+ [a b *.txt]', "% zsh -f -c 'v=\"a b *.txt\"; printf \"[%s]\\n\" ${=v}'", '[a]', '[b]', '[*.txt]', "% zsh -f -c 'n=3; echo {1..$n}'", '1 2 3'], { title: 'Mac — zsh 5.9', dir: 'scratch', fs: 13.5 })}
    ${box('warn', 'Script “chạy được trong zsh” chưa chắc chạy được trong bash: zsh không cắt <code>$var</code> và khai triển <code>{1..$n}</code>. Luôn thử bằng đúng shell trong shebang.')}`) },

  /* ───────────── 6.3 ───────────── */
  { t: 'Bốn toán tử mặc định: chưa đặt khác rỗng', body: two(
    `${table(['v đang…', '${v:-D}', '${v-D}', '${v:+A}', '${v+A}'], [
      ['chưa đặt (<code>unset v</code>)', '!D', '!D', '', ''],
      ['rỗng (<code>v=</code>)', '!D', '', '', '!A'],
      ['có giá trị (<code>v=val</code>)', 'val', 'val', '!A', '!A'],
    ], { sm: true, center: [1, 2, 3, 4] })}
    ${table(['Dạng', 'Làm gì'], [
      ['<code>${v:=x}</code>', 'như <code>:-</code> và GÁN luôn x vào v'],
      ['+<code>${v:?thông điệp}</code>', 'chưa đặt/rỗng ⇒ in lỗi, thoát script'],
      ['<code>${v:-${W:-3000}}</code>', 'chuỗi phương án lùi lồng nhau'],
      ['<code>${v:+--verbose}</code>', 'cờ chỉ xuất hiện khi v có giá trị'],
    ], { sm: true })}`,
    `${term(['$ unset c; echo "[${c:=green}] c=[$c]"', '[green] c=[green]', '$ : "${DATABASE_URL:?DATABASE_URL la bat buoc}"', '! bash: DATABASE_URL: DATABASE_URL la bat buoc', '$ echo $?', '1'], { title: 'Ubuntu — output thật', fs: 14 })}
    ${box('tip', 'Thiếu dấu <code>:</code> = chỉ xét “chưa đặt”. Có <code>:</code> = xét cả “rỗng”. Biến cấu hình gần như luôn cần dạng có <code>:</code>.')}`, 'l') },

  { t: '# xén từ trái, % xén từ phải — nhân đôi là tham lam', body: `${trimSvg()}
    ${two(
      term(['$ f=archive.tar.gz', "$ printf '[%s]\\n' \"${f%.*}\" \"${f%%.*}\" \"${f##*.}\" \"${f#*.}\"", '[archive.tar]', '[archive]', '[gz]', '[tar.gz]'], { title: 'Ubuntu — đuôi file', fs: 13.5 }),
      box('warn', 'Mẫu là GLOB, không phải regex: <code>${f%%\\d*}</code> không khớp gì và trả nguyên chuỗi, không lỗi. Nhớ: <code>#</code> đứng TRÁI <code>%</code> trên bàn phím.'))}` },

  { t: '/ thay lần đầu, // thay tất cả — cẩn thận dấu &', body: two(
    term(['$ s="hello world world"', "$ printf '[%s]\\n' \"${s/world/there}\" \"${s//world/there}\" \\", '    "${s//o/}" "${s/#hello/HI}" "${s/%world/WORLD}" "${s//[ol]/_}"', '[hello there world]', '[hello there there]', '[hell wrld wrld]', '[HI world world]', '[hello world WORLD]', '[he___ w_r_d w_r_d]', '$ branch="feature/user-login"; echo "myapp:${branch//\\//-}"', '= myapp:feature-user-login', '$ echo "${s/world/[&]}"', '+ hello [world] world', '$ q="a=1&b=2"; u="x?QUERY"; echo "${u/QUERY/$q}"', '! x?a=1QUERYb=2', '$ echo "${u/QUERY/"$q"}"', '= x?a=1&b=2'], { title: 'Ubuntu — bash 5.2', fs: 13 }),
    `${table(['Dạng', 'Nghĩa'], [
      ['<code>${v/a/b}</code>', 'thay chỗ khớp ĐẦU TIÊN'],
      ['<code>${v//a/b}</code>', 'thay MỌI chỗ khớp'],
      ['<code>${v/#a/b}</code> · <code>${v/%a/b}</code>', 'chỉ khi khớp ở ĐẦU · ở CUỐI'],
      ['<code>${v//a/}</code>', 'xoá (phần thay để rỗng)'],
      ['<code>${v//\\//-}</code>', 'thay dấu <code>/</code> phải thoát <code>\\/</code>'],
    ], { sm: true })}
    ${box('warn', 'Từ bash 5.2 (<code>patsub_replacement</code>, bật sẵn) <code>&amp;</code> trong phần thay = đoạn vừa khớp. Muốn chữ <code>&amp;</code> thật: <code>\\&amp;</code> hoặc để phần thay trong nháy. bash 3.2 của Mac in <code>hello [&amp;]</code>.')}`, 'l') },

  { t: 'Độ dài, cắt lát, hoa thường — ${s: -4} khác ${s:-4}', body: two(
    term(['$ s=deployment', "$ printf '[%s]\\n' \"${#s}\" \"${s:0:6}\" \"${s:6}\" \"${s: -4}\" \"${s:-4}\"", '[10]', '[deploy]', '[ment]', '[ment]', '! [deployment]', "$ printf '[%s]\\n' \"${s^^}\" \"${s^}\" \"${s:(-4):2}\"", '[DEPLOYMENT]', '[Deployment]', '[me]', '$ u="đường"; echo ${#u}; LC_ALL=C bash -c \'u="đường"; echo ${#u}\'', '5', '9', '$ v="it\'s \\"x\\" \\$y"; echo "${v@Q}"', "'it'\\''s \"x\" $y'"], { title: 'Ubuntu — LANG=C.UTF-8', fs: 13.5 }),
    `${table(['Dạng', 'Nghĩa'], [
      ['<code>${#s}</code>', 'độ dài — tính KÝ TỰ theo locale'],
      ['<code>${s:i:n}</code> · <code>${s:i}</code>', 'n ký tự từ vị trí i (đếm từ 0)'],
      ['!<code>${s: -4}</code>', 'CẦN dấu cách; thiếu nó thành <code>:-</code>'],
      ['<code>${s^^}</code> · <code>${s,,}</code> · <code>${s^}</code>', 'HOA · thường · hoa chữ đầu (bash ≥ 4)'],
      ['<code>${s@Q}</code> · <code>${s@U}</code>', 'thêm nháy an toàn · hoa (bash ≥ 5.1)'],
      ['<code>${!key}</code> · <code>${!DB_@}</code>', 'đọc gián tiếp · liệt kê tên biến'],
    ], { sm: true })}
    ${box('info', 'Tiếng Việt: trong locale UTF-8, “đường” dài 5 ký tự; với <code>LC_ALL=C</code> bash đếm 9 BYTE — cron/container không đặt locale sẽ đếm kiểu thứ hai.')}`, 'l') },

  { t: 'Không fork thì nhanh gấp ~200 lần — Mac còn chậm hơn', body: `
    ${kpis([
      { v: '6,06 s', l: '10.000 × <code>basename "$path"</code> (Ubuntu)', c: 'red' },
      { v: '0,031 s', l: '10.000 × <code>x=${path##*/}</code> (Ubuntu)', c: 'grn' },
      { v: '15,7 s', l: 'chỉ 2.000 × <code>basename</code> trên Mac M1', c: 'amb' },
    ])}
    ${two(
      term(['% /bin/bash -c \'s=deploy; echo "${s^^}"\'', '! /bin/bash: ${s^^}: bad substitution', "% /bin/bash -c 'mapfile -t a < /etc/hosts'", '! /bin/bash: mapfile: command not found', "% /bin/bash -c 'a=(x y z); echo \"${a[-1]}\"'", '! /bin/bash: a: bad array subscript', '% /bin/bash -c \'v="it s"; echo "${v@Q}"\'', '! /bin/bash: ${v@Q}: bad substitution'], { title: 'Mac — /bin/bash 3.2.57 (2007)', dir: 'scratch', fs: 13.5 }),
      box('warn', 'Script dùng <code>^^</code> <code>,,</code> <code>@Q</code> <code>mapfile</code> <code>${a[-1]}</code> ⇒ shebang <code>#!/usr/bin/env bash</code> và cài bash mới trên Mac (Homebrew, Ch15). Hoặc viết theo tập con bash 3.2 nếu phải chạy bằng <code>/bin/bash</code>.'), 'l')}` },

  /* ───────────── 6.4 ───────────── */
  { t: 'Mã thoát: 0 là thành công, số khác là kiểu hỏng', body: two(
    term(['$ ls /khong 2>/dev/null; echo $?', '2', '$ grep -q nobodyxx /etc/passwd; echo $?', '1', '$ khonglenh; echo $?', '127', '$ ./s.sh; echo $?          # thiếu quyền x', '126', "$ bash -c 'kill -TERM $$'; echo $?", '143', "$ bash -c 'exit 300'; echo $?", '+ 44', '$ false | true; echo "$? ${PIPESTATUS[*]}"', '+ 0 1 0'], { title: 'Ubuntu — output thật (đã bỏ bớt stderr)', fs: 13.5 }),
    `${table(['Mã', 'Nghĩa'], [
      ['+0', 'thành công'],
      ['1', 'hỏng chung · grep: KHÔNG khớp (là kết quả, không phải lỗi)'],
      ['2', 'dùng sai / lỗi thật (ls, grep đọc file lỗi)'],
      ['126 · 127', 'không chạy được · <strong>không tìm thấy lệnh</strong>'],
      ['128+N', 'chết vì tín hiệu N: 130 Ctrl-C · 137 KILL · 143 TERM'],
    ], { sm: true })}
    ${box('warn', '<code>$?</code> bị ghi đè bởi MỌI lệnh, kể cả <code>echo</code>. Mã thoát chỉ 0–255 (300 → 44). Ống dẫn trả mã của lệnh CUỐI — <code>set -o pipefail</code> (Ch3, Ch7).')}`, 'l') },

  { t: '&& và || ngắt mạch — a && b || c không phải if', body: `${andOrSvg()}
    ${two(
      term(['$ check && process || echo "=> nhanh \'khong co file\' cung chay!"', 'xu ly... hong', "! => nhanh 'khong co file' cung chay!", '$ if check; then process || echo "=> bao dung"; else echo "khong co file"; fi', 'xu ly... hong', '= => bao dung'], { title: 'Ubuntu — check trả 0, process trả 1', fs: 13.5 }),
      table(['Viết', 'Chạy b khi'], [
        ['<code>a &amp;&amp; b</code>', 'a thành công'],
        ['<code>a || b</code>', 'a thất bại'],
        ['<code>a ; b</code>', 'luôn luôn'],
        ['<code>! a</code>', 'đảo mã thoát: 0 ↔ 1'],
        ['+<code>cmd || { echo lỗi &gt;&amp;2; exit 1; }</code>', 'chốt chặn một dòng'],
      ], { sm: true }), 'l')}` },

  { t: 'if chạy một LỆNH — và [ cũng chỉ là một lệnh', body: two(
    term(['$ type [ [[ test; ls -l /usr/bin/[', '[ is a shell builtin', '[[ is a shell keyword', 'test is a shell builtin', '-rwxr-xr-x 1 root root 67760 Aug 25 15:09 /usr/bin/[', '$ var=; [ $var = yes ]; echo $?', '! bash: [: =: unary operator expected', '2', '$ [[ $var == yes ]]; echo $?', '= 1', '$ f="a b"; [ -f $f ]', '! bash: [: a: binary operator expected', "$ sh -c '[ a == a ] && echo ok'", '! sh: 1: [: a: unexpected operator'], { title: 'Ubuntu — /bin/sh là dash', fs: 13.5 }),
    table(['', '<code>[ ]</code> / <code>test</code>', '<code>[[ ]]</code>'], [
      ['Là gì', 'lệnh (builtin + /usr/bin/[)', 'từ khoá cú pháp của bash'],
      ['Biến rỗng không nháy', '-vỡ cú pháp', '+an toàn'],
      ['Cắt từ / glob bên trong', '-có', '+không'],
      ['<code>&amp;&amp;</code> <code>||</code> bên trong', '-không (dùng hai [ ])', '+có'],
      ['<code>==</code> glob · <code>=~</code> regex', '-không (dash báo lỗi ==)', '+có, nhóm vào BASH_REMATCH'],
      ['Chạy trong sh/dash', '+có', '-không: <code>[[: not found</code>'],
    ], { sm: true }), 'l') },

  { t: '> trong [[ ]] so CHUỖI — trong [ ] nó tạo file', body: two(
    term(['$ a=10 b=9', '$ [[ $a > $b ]] && echo "10>9" || echo "10 KHONG > 9"', '! 10 KHONG > 9', '$ [[ $a -gt $b ]] && echo "so: 10>9"', '= so: 10>9', '$ (( a > b )) && echo "(( )) 10>9"', '= (( )) 10>9', '$ [ $a > $b ]; ls', '! 9  f  s.sh', '$ [[ $a -gt x ]]; echo $?', '+ 0', '$ (( 08 > 1 ))', '! bash: ((: 08: value too great for base (error token is "08")'], { title: 'Ubuntu — “9” là file vừa bị tạo ra', dir: '~/thu-linux/ch6/dk', fs: 13.5 }),
    `${table(['So sánh', 'Chuỗi', 'Số'], [
      ['bằng · khác', '<code>==</code> · <code>!=</code>', '<code>-eq</code> · <code>-ne</code> · <code>(( a == b ))</code>'],
      ['nhỏ · lớn', '<code>&lt;</code> · <code>&gt;</code> (thứ tự từ điển)', '<code>-lt -le -gt -ge</code> · <code>(( a &lt; b ))</code>'],
      ['rỗng · khác rỗng', '<code>-z</code> · <code>-n</code>', '—'],
    ], { sm: true })}
    ${box('warn', 'Trong <code>[[ ]]</code>, <code>-gt</code> tính SỐ HỌC: <code>x</code> là tên biến (chưa đặt = 0) nên <code>10 -gt x</code> đúng. Muốn kiểm “là số” thì dùng <code>[[ $v =~ ^[0-9]+$ ]]</code> trước.')}`, 'l') },

  { t: 'Phép thử file và case: khớp đầu tiên thắng', body: two(
    `${table(['Thử', 'd/', 'rong', 'coc', 'lk→coc', 'không có'], [
      ['<code>-e</code> tồn tại', '+✓', '+✓', '+✓', '+✓', ''],
      ['<code>-f</code> file thường', '', '+✓', '+✓', '+✓', ''],
      ['<code>-d</code> thư mục', '+✓', '', '', '', ''],
      ['<code>-s</code> khác rỗng', '+✓', '', '+✓', '+✓', ''],
      ['<code>-L</code> liên kết', '', '', '', '+✓', ''],
      ['<code>-x</code> chạy/vào được', '+✓', '', '', '', ''],
    ], { sm: true, center: [1, 2, 3, 4, 5] })}
    ${box('info', '<code>-f</code>/<code>-e</code> đi THEO liên kết. <code>-r -w -x</code> hỏi “TÔI có làm được không” — gồm cả nhóm, ACL, đường dẫn (Ch4). <code>a -nt b</code>: a mới hơn b.')}`,
    `${sh([
      ['case "$1" in', ''],
      ['  start)         echo "start" ;;', ''],
      ['  stop|halt)     echo "stop" ;;', 'nhiều mẫu'],
      ['  *.log)         echo "log" ;;', 'mẫu glob'],
      ['  "")            echo "rỗng" ;;', ''],
      ['  *)             echo "khác" >&2; exit 2 ;;', 'mặc định'],
      ['esac', ''],
    ], { fs: 14.5 })}
    ${term(['$ for x in start halt app.log "" foo; do …', '[start] start', '[halt] stop', '[app.log] log', '[] rong', '[foo] khac'], { title: 'Ubuntu — ;; kết thúc nhánh, ;& rơi xuống', fs: 13.5 })}`, 'r') },

  /* ───────────── 6.5 ───────────── */
  { t: 'for qua glob, mảng, khoảng — {1..$n} không chạy', body: two(
    `${sh([
      ['for f in *.log; do', 'shell cắt glob giúp bạn'],
      ['  [[ -e $f ]] || continue', 'chốt khi không khớp gì'],
      ['  echo "xử lý $f"', ''],
      ['done', ''],
      ['for f in "${files[@]}"; do …; done', 'mảng: @ có nháy'],
      ['for arg in "$@"; do …; done', 'tham số'],
      ['for i in {1..5}; do …; done', 'khoảng CỐ ĐỊNH'],
      ['for ((i = 1; i <= n; i++)); do …; done', 'cận là biến'],
    ], { fs: 14.5 })}
    ${box('tip', '<code>{01..10..3}</code> → <code>01 04 07 10</code> · <code>{a..e}</code> · <code>x{,.bak}</code> → <code>x x.bak</code>. <code>seq -w 8 10</code> → <code>08 09 10</code>.')}`,
    term(['$ n=3; echo {1..$n}', '! {1..3}', '$ echo {1..3} {01..10..3} {a..e} x{,.bak}', '1 2 3 01 04 07 10 a b c d e x x.bak', '$ for ((i=1;i<=n;i++)); do printf "%s " $i; done; echo', '= 1 2 3', '$ for f in *.csv; do printf "[%s]\\n" "$f"; done', '! [*.csv]', '$ shopt -s nullglob; for f in *.csv; do echo "$f"; done', '# (không in gì — 0 vòng)'], { title: 'Ubuntu — ngoặc nhọn chạy TRƯỚC biến', fs: 13.5 }), 'l') },

  { t: 'Đừng lặp trên $(ls): tên có dấu cách vỡ đôi', body: two(
    term(['$ ls', 'a*b.txt  b.txt  bao cao.txt', '$ for f in $(ls *.txt); do printf "[%s]\\n" "$f"; done', '[a*b.txt]', '[b.txt]', '! [bao]', '! [cao.txt]', '$ for f in *.txt; do printf "[%s]\\n" "$f"; done', '= [a*b.txt]', '= [b.txt]', '= [bao cao.txt]', '$ touch -- -rf.txt; for f in $(ls *.txt); do …', "! ls: invalid option -- '.'"], { title: 'Ubuntu — thư mục có tên “hiểm”', dir: '~/thu-linux/ch6/ls2', fs: 13.5 }),
    `${sh([
      ['for f in $(ls *.txt); do rm "$f"; done', 'SAI'],
      ['for f in *.txt; do rm -- "$f"; done', 'ĐÚNG — ở đây'],
      ["find . -name '*.txt' -print0 |", 'ĐÚNG — đệ quy'],
      ["  while IFS= read -r -d '' f; do", 'phân cách NUL'],
      ['    rm -- "$f"', '-- : tên bắt đầu bằng -'],
      ['  done', ''],
    ], { fs: 14.5 })}
    ${box('bad', '<code>-rf.txt</code> lọt vào dòng lệnh của <code>ls</code> thành một CỜ. Với <code>rm $(ls)</code> thay vì <code>ls</code>, một file tên <code>-rf</code> là thảm hoạ — <code>--</code> báo “hết cờ”.')}`, 'l') },

  { t: 'while IFS= read -r: giữ thụt lề, \\ và dòng cuối', body: two(
    term(['$ cat in.txt', '   thut le\\n C:\\temp', '$ while read l; do printf "[%s]\\n" "$l"; done < in.txt', '! [thut len C:temp]', '$ while IFS= read -r l; do printf "[%s]\\n" "$l"; done < in.txt', '= [   thut le\\n C:\\temp]', "$ printf 'mot\\nhai' > nonl.txt   # dòng cuối không có \\n", '$ while IFS= read -r l; do …; done < nonl.txt', '! [mot]', '$ while IFS= read -r l || [[ -n $l ]]; do …; done < nonl.txt', '= [mot]', '= [hai]'], { title: 'Ubuntu — mỗi mảnh của dòng lệnh chữa một lỗi', fs: 13.5 }),
    table(['Cờ read', 'Nghĩa', 'Ví dụ thật'], [
      ['<code>-r</code>', 'giữ nguyên <code>\\</code>', 'luôn luôn'],
      ['<code>IFS=</code>', 'giữ khoảng trắng đầu/cuối', 'luôn khi đọc dòng'],
      ['<code>-d \'\'</code>', 'đọc tới NUL thay vì \\n', 'với <code>find -print0</code>'],
      ['<code>-a arr</code>', 'tách vào MẢNG', '<code>"x y  z"</code> → 3 phần tử'],
      ['<code>-n 3</code>', 'đọc đúng n ký tự', '<code>abcdef</code> → <code>abc</code>'],
      ['<code>-t 1</code>', 'hết giờ ⇒ mã &gt; 128', 'thật: 142'],
      ['<code>-p "…"</code>', 'in dấu nhắc trước khi đọc', 'hỏi y/N'],
      ['<code>-s</code>', 'không hiện chữ đang gõ', 'mật khẩu'],
    ], { sm: true }), 'l') },

  { t: 'Ống dẫn chạy vòng lặp trong shell con — biến mất', body: `
    ${diagram({ w: 1160, h: 150, nodes: [
      { id: 'a', x: 0, y: 10, w: 250, h: 70, t: 'printf … |', d: 'tiến trình 1', c: 'blu', mono: true },
      { id: 'b', x: 330, y: 10, w: 330, h: 70, t: 'while … ((count++))', d: 'shell CON: count=2 rồi chết', c: 'red', mono: true },
      { id: 'c', x: 790, y: 10, w: 370, h: 70, t: 'echo $count  →  0', d: 'shell cha: count vẫn = 0', c: 'amb', mono: true },
    ], edges: [{ from: 'a', to: 'b', c: 'blu' }, { from: 'b', to: 'c', t: 'mất', c: 'red', dash: true, off: -12 }] })}
    ${two(
      term(["$ count=0; printf 'ERROR a\\nok\\nERROR b\\n' | while IFS= read -r l; do", '    [[ $l == ERROR* ]] && ((count++)); done; echo "pipe: $count"', '! pipe: 0', '$ count=0; while IFS= read -r l; do …; done < <(printf …); echo "procsub: $count"', '= procsub: 2', "$ printf 'prod\\r\\n' > env.txt; read -r e < env.txt; [[ $e == prod ]] || echo KHONG", '! KHONG', "$ e=${e%$'\\r'}; [[ $e == prod ]] && echo khop", '= khop'], { title: 'Ubuntu — < <(lệnh) giữ vòng lặp ở shell cha', fs: 13.5 }),
      box('warn', 'File soạn trên Windows có <code>\\r</code> cuối dòng: <code>read</code> giữ lại nó nên so sánh luôn SAI mà nhìn thì y hệt. Soi bằng <code>cat -A</code> (thấy <code>^M</code>), gỡ bằng <code>${e%$\'\\r\'}</code> hoặc <code>dos2unix</code>.'), 'l')}` },

  { t: 'Hàm: local, return là mã thoát, dữ liệu qua stdout', body: two(
    `${sh([
      ['log() { echo "[$(date +%T)] $*" >&2; }', 'chẩn đoán ra stderr'],
      ['get_branch() {', ''],
      ['  local b', 'khai báo RIÊNG'],
      ['  b=$(git rev-parse --abbrev-ref HEAD) || return 1', ''],
      ["  printf '%s\\n' \"$b\"", 'dữ liệu ra stdout'],
      ['}', ''],
      ['if branch=$(get_branch); then', 'bắt dữ liệu + mã'],
      ['  log "đang ở $branch"', ''],
      ['fi', ''],
    ], { fs: 14.5 })}
    ${box('tip', 'Song song: <code>xargs -0 -P 4</code> giữ đúng 4 việc — 8 × <code>sleep 1</code> mất 2,0 s; 4 việc bằng <code>&amp;</code> + <code>wait</code> mất 1,0 s; tuần tự 4,0 s (đo thật).')}`,
    term(['$ i=99; bad() { for i in 1 2 3; do :; done; }; bad; echo "i=$i"', '! i=3', '$ i=99; good() { local i; for i in 1 2 3; do :; done; }; good; echo "i=$i"', '= i=99', '$ f() { local out=$(false); echo "rc=$?"; }; f', '! rc=0', '$ f() { local o; o=$(false); echo "rc=$?"; }; f', '= rc=1', '$ g() { return 300; }; g; echo $?', '+ 44', '$ sum() { echo $(( $1 + $2 )); }; r=$(sum 2 3); echo "r=$r"', 'r=5'], { title: 'Ubuntu — thiếu local là giẫm biến người gọi', fs: 13.5 }), 'l') },

  /* ───────────── Tổng kết ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 6', body: table(['Triệu chứng', 'Nguyên nhân', 'Sửa'], [
    ['<code>name: command not found</code>', 'dấu cách quanh <code>=</code>', '<code>name="Binh"</code>'],
    ['Script vỡ khi tên file có dấu cách', '<code>$f</code> không nháy ⇒ cắt từ', '<code>"$f"</code>, <code>"$@"</code>, <code>"${a[@]}"</code>'],
    ['<code>[: =: unary operator expected</code>', 'biến rỗng trong <code>[ ]</code>', '<code>[[ $v == yes ]]</code>'],
    ['So “10 &gt; 9” ra sai; có file tên <code>9</code>', '<code>&gt;</code> là so chuỗi / chuyển hướng', '<code>(( a &gt; b ))</code>'],
    ['<code>08: value too great for base</code>', 'số 0 đầu = hệ tám', '<code>$((10#$m))</code>'],
    ['Biến đếm = 0 sau vòng lặp', '<code>cmd | while</code> chạy trong shell con', '<code>done &lt; &lt;(cmd)</code>'],
    ['<code>|| return 1</code> không bao giờ chạy', '<code>local x=$(cmd)</code> lấy mã của local', 'khai báo và gán hai dòng'],
    ['Chạy trên Mac: <code>bad substitution</code>', 'bash 3.2 thiếu <code>^^</code> <code>@Q</code> <code>mapfile</code>', '<code>#!/usr/bin/env bash</code> + bash mới'],
    ['So sánh với dữ liệu từ Windows luôn sai', '<code>\\r</code> cuối dòng', '<code>${v%$\'\\r\'}</code> · <code>dos2unix</code>'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 6 (1/2): biến, nháy, ${…}', body: two(
    sh([
      ['v="giá trị" · readonly V=1 · unset v', 'gán · hằng · gỡ'],
      ['export V=1 · V=1 lệnh', 'cho con · cho MỘT lệnh'],
      ['declare -p v · declare -i n=5', 'xem · kiểu số nguyên'],
      ['x=$(lệnh) · x=$(lệnh 2>&1)', 'bắt stdout · cả stderr'],
      ['$(( a * b )) · (( i++ )) · 10#$m', 'số học nguyên'],
      ['read -r -p "Hỏi: " ans', 'đọc vào biến'],
      ['"$v" · \'nguyên văn\' · $\'\\t\\n\'', 'ba+một loại nháy'],
      ['"$@" · "${a[@]}" · ${#a[@]}', 'tham số · mảng · đếm'],
      ['IFS=: read -r a b c <<< "$line"', 'tách trường'],
      ['set -x · printf \'[%s]\\n\' $v', 'soi khai triển'],
    ], { fs: 14 }),
    sh([
      ['${v:-mặc định} · ${v:=gán}', 'rỗng/chưa đặt ⇒ dùng'],
      ['${v:?thông điệp} · ${v:+cờ}', 'bắt buộc · chỉ khi có'],
      ['${p##*/} · ${p%/*}', 'basename · dirname'],
      ['${f%.*} · ${f##*.}', 'bỏ đuôi · lấy đuôi'],
      ['${s/a/b} · ${s//a/b}', 'thay đầu · thay hết'],
      ['${s/#a/b} · ${s/%a/b}', 'neo đầu · neo cuối'],
      ['${#s} · ${s:i:n} · ${s: -4}', 'độ dài · cắt lát'],
      ['${s^^} · ${s,,} · ${s^}', 'hoa · thường (bash 4+)'],
      ['${s@Q} · ${!name} · ${!DB_@}', 'nháy · gián tiếp · liệt kê'],
      ['shellcheck script.sh', 'bắt biến thiếu nháy'],
    ], { fs: 14 })) },

  { t: 'Bảng tra nhanh Chương 6 (2/2): điều kiện, vòng lặp, hàm', body: two(
    sh([
      ['echo $? · ${PIPESTATUS[*]}', 'mã thoát · cả ống'],
      ['a && b · a || b · ! a', 'ngắt mạch · đảo'],
      ['cmd || { echo lỗi >&2; exit 1; }', 'chốt chặn'],
      ['[[ $a == b* ]] · [[ $s =~ ^[0-9]+$ ]]', 'glob · regex'],
      ['[[ -z $v ]] · [[ -n $v ]]', 'rỗng · khác rỗng'],
      ['(( a > b )) · [[ $a -gt $b ]]', 'so SỐ'],
      ['[[ -f f ]] -d -e -s -L -r -w -x', 'thử file'],
      ['[[ a -nt b ]] · -ot', 'mới hơn · cũ hơn'],
      ['case "$1" in a|b) … ;; *) … ;; esac', 'rẽ nhiều nhánh'],
      ['exit 0 · exit 1 · exit 2', 'ổn · hỏng · dùng sai'],
    ], { fs: 14 }),
    sh([
      ['for f in *.log; do …; done', 'file ở đây'],
      ['for ((i=1; i<=n; i++)); do …; done', 'cận là biến'],
      ['for i in {1..10..2} · seq -w 1 10', 'khoảng cố định'],
      ["while IFS= read -r l; do …; done < f", 'từng dòng'],
      ['… done < <(lệnh)', 'giữ biến'],
      ["find . -print0 | while IFS= read -r -d '' f", 'mọi tên file'],
      ['mapfile -t arr < f', 'file → mảng (bash 4+)'],
      ['break · continue · continue 2', 'thoát · bỏ vòng'],
      ['f() { local x; …; return 0; }', 'hàm'],
      ['r=$(f) · xargs -0 -P 4', 'bắt kết quả · song song'],
    ], { fs: 14 })) },

  { t: 'Thực hành Chương 6 (40 phút): script dọn log của nhóm', body: `
    ${steps([
      ['Container <code>ubuntu:24.04</code>, dựng <code>~/logs</code>: <code>touch -- \'a b.log\' -rf.log \'*.log\' x.log</code>', '1 dòng ERROR vào <code>a b.log</code>, 2 dòng vào <code>x.log</code> · kiểm: <code>ls | wc -l</code> ra 4'],
      ['Viết <code>dem.sh</code>: <code>: "${LOG_DIR:?cần LOG_DIR}"</code>, lặp <code>for f in "$LOG_DIR"/*.log</code>', 'không đặt LOG_DIR ⇒ thoát mã 1 và nói thiếu gì'],
      ['Mỗi file: in <code>${f##*/}</code>, số dòng ERROR bằng <code>grep -c</code>, đổi tên sang <code>${f%.log}.bak</code> trong hàm có <code>local</code>', '<code>printf \'[%s]\\n\'</code> thấy đủ 4 tên, không bị cắt'],
      ['Đếm tổng lỗi qua <code>while IFS= read -r</code> … <code>&lt; &lt;(grep -h ERROR …)</code>', 'tổng in ra đúng — không phải 0'],
      ['<code>shellcheck dem.sh</code> sạch; thử lại bằng <code>sh dem.sh</code> và giải thích lỗi', 'dash báo <code>Syntax error: redirection unexpected</code> — nó không có <code>&lt;(…)</code> lẫn <code>[[</code>'],
    ])}
    ${box('good', '<b>Đạt khi:</b> 4 file thành <code>.bak</code> với đúng tên (kể cả <code>a b.bak</code>, <code>-rf.bak</code>, <code>*.bak</code>), tổng lỗi = 3, và <code>shellcheck</code> không cảnh báo nào.')}` },
]).map((x) => ({ ...x, body: x.body + FIX }));
