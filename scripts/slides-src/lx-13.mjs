/**
 * Linux & Bash · Deck lx-13 — Chương 13: Bash nâng cao — cấu trúc dữ liệu, luồng & tốc độ.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 28/09/2026:
 *   • "Ubuntu" = container ubuntu:24.04 (bash 5.2.21, arm64, 10 CPU ảo của Docker Desktop, giới hạn 512 MB),
 *                người dùng an, thư mục ~/thu-linux. Gói thêm: shellcheck 0.9.0, shfmt 3.8.0, bats 1.10.0,
 *                GNU parallel 20231122, hyperfine 1.18.0, bc, gawk. access.log = 200.000 dòng giả lập (400 IP).
 *   • "Fedora" = máy linux-nha, Fedora 44, bash 5.3.9, x86_64 12 nhân — chỉ để đo fork và thử ${ …; } của 5.3.
 *   • "Mac"    = Mac M1, macOS 27, /bin/bash 3.2.57 (zsh gọi /bin/bash), BSD xargs.
 * Số đo tốc độ = hyperfine (trung bình nhiều lượt) hoặc $EPOCHREALTIME quanh vòng lặp; máy khác ra số khác,
 * TỈ LỆ thì giữ.
 * Mốc phiên bản bash lấy từ tệp NEWS của bash (tiswww.case.edu/php/chet/bash/NEWS).
 *
 * Hình tự vẽ (SVG nội tuyến, không đụng thư viện): idxSvg() — mảng thưa sau unset; fdSvg() — bảng fd của một
 * tiến trình; swapSvg() — 3>&1 1>&2 2>&3 từng bước; xargsSvg() — làn song song có/không -n1; semSvg() — hàng
 * đợi 3 làn của wait -n (đo thật); specSvg() — chuỗi getopts ':nvd:h-:' (chép từ lx-07 rồi sửa); stackSvg() —
 * ba mảng FUNCNAME/BASH_LINENO/BASH_SOURCE xếp thành stack trace.
 */
import { S, cover, sh, term, mindmap, diagram, cards, box, steps, table, two, bars, sv, R, T, A, D, esc } from './_lx-chung.mjs';

export const deck = { key: 'lx-13', code: 'LINUX · CHƯƠNG 13', title: 'Bash nâng cao', sub: 'Linux & Bash · Chương 13' };

const MONO = 'SF Mono,Menlo,monospace';
const c = (k) => D[k] || k;
const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15px}.c-t.sm td,.c-t.sm th{padding:6px 10px}</style>';

/* Slide 3 — mảng thưa: unset để lại lỗ, += nối sau chỉ số LỚN NHẤT */
const idxSvg = () => {
  const rows = [
    ["a=(web db 'cache redis' worker)", [[0, 'web'], [1, 'db'], [2, 'cache redis'], [3, 'worker']], '${#a[@]} = 4', 'grn'],
    ["unset 'a[1]'", [[0, 'web'], [1, null], [2, 'cache redis'], [3, 'worker']], '${#a[@]} = 3 · ${!a[@]} = 0 2 3', 'amb'],
    ['a+=(mail)', [[0, 'web'], [1, null], [2, 'cache redis'], [3, 'worker'], [4, 'mail']], 'chỉ số 4 — lỗ số 1 vẫn còn', 'blu'],
  ];
  let s = '';
  rows.forEach(([cmd, cells, note, col], r) => {
    const y = 10 + r * 96;
    s += T(0, y + 34, cmd, { fs: 16, mono: true, b: true, c: col });
    cells.forEach(([i, v], k) => {
      const x = 330 + k * 140;
      s += T(x + 64, y + 10, `[${i}]`, { fs: 14, a: 'middle', mono: true, c: 'mu' });
      if (v === null) s += R(x, y + 18, 128, 46, { c: 'red', dash: true, fill: 'rgba(255,92,108,.08)', r: 8, sw: 2 }) + T(x + 64, y + 47, 'không có', { fs: 14, a: 'middle', c: 'red' });
      else s += R(x, y + 18, 128, 46, { c: col, r: 8, sw: 2 }) + T(x + 64, y + 47, v, { fs: 15, a: 'middle', mono: true });
    });
    s += T(0, y + 60, note, { fs: 14, c: col, mono: true });
  });
  return sv(1160, 300, s);
};

/* Slide 9 — bảng fd của một tiến trình bash (ls -l /proc/$$/fd, thật) */
const fdSvg = () => {
  const rows = [
    ['0', 'stdin', '/dev/null', 'dim'],
    ['1', 'stdout', 'pipe:[3169279]', 'grn'],
    ['2', 'stderr', 'pipe:[3169279]', 'amb'],
    ['10', '{log}>>', '~/thu-linux/nhat-ky.txt', 'lx'],
    ['255', 'bash tự giữ', '~/thu-linux/b1.sh', 'vio'],
  ];
  let s = R(0, 0, 330, 58 + rows.length * 50, { c: 'bd', fill: '#0d140f', r: 12 });
  s += T(165, 34, 'tiến trình bash (PID $$)', { fs: 16, a: 'middle', b: true, c: 'mu' });
  rows.forEach(([fd, nm, tg, col], i) => {
    const y = 52 + i * 50;
    s += R(18, y, 70, 38, { c: col, r: 8 }) + T(53, y + 25, fd, { fs: 18, a: 'middle', mono: true, b: true, c: col });
    s += T(104, y + 25, nm, { fs: 15, mono: true });
    s += A(312, y + 19, 486, y + 19, { c: col === 'dim' ? 'mu' : col, sw: 2.5 });
    s += R(490, y, 300, 38, { c: col, r: 8, fill: '#050806' }) + T(640, y + 25, tg, { fs: 14.5, a: 'middle', mono: true });
  });
  s += T(820, 90, 'fd = số thứ tự trong bảng', { fs: 15, c: 'lx', b: true });
  s += T(820, 114, 'file đang mở của tiến trình', { fs: 15, c: 'lx', b: true });
  s += T(820, 158, '0 1 2 luôn có sẵn', { fs: 14.5, c: 'mu' });
  s += T(820, 182, 'exec {log}>>f: bash chọn số ≥ 10', { fs: 14.5, c: 'mu' });
  s += T(820, 206, 'tiến trình con THỪA KẾ cả bảng', { fs: 14.5, c: 'mu' });
  s += T(820, 230, 'exec {log}>&- để đóng', { fs: 14.5, c: 'mu' });
  return sv(1160, 314, s);
};

/* Slide 10 — 3>&1 1>&2 2>&3 3>&- : ba ô fd sau từng bước (trái → phải) */
const swapSvg = () => {
  const steps = [
    ['ban đầu', ['ỐNG | sed', 'màn hình', '—']],
    ['3>&1', ['ỐNG | sed', 'màn hình', 'ỐNG | sed']],
    ['1>&2', ['màn hình', 'màn hình', 'ỐNG | sed']],
    ['2>&3', ['màn hình', 'ỐNG | sed', 'ỐNG | sed']],
    ['3>&-', ['màn hình', 'ỐNG | sed', '—']],
  ];
  const fdc = ['grn', 'amb', 'blu'];
  let s = '';
  ['fd 1 (stdout)', 'fd 2 (stderr)', 'fd 3 (tạm)'].forEach((t, j) => { s += T(0, 70 + j * 58, t, { fs: 15, b: true, c: fdc[j], mono: true }); });
  steps.forEach(([op, v], k) => {
    const x = 170 + k * 198;
    s += R(x, 4, 170, 34, { c: k ? 'lx' : 'dim', r: 8, fill: k ? 'rgba(245,183,0,.1)' : '#0a0f0c' }) + T(x + 85, 27, op, { fs: 16, a: 'middle', mono: true, b: true, c: k ? 'lx' : 'mu' });
    v.forEach((t, j) => {
      const y = 46 + j * 58;
      const col = t === '—' ? 'dim' : (t.startsWith('ỐNG') ? 'grn' : 'amb');
      s += R(x, y, 170, 42, { c: col, r: 8, dash: t === '—', fill: '#050806' }) + T(x + 85, y + 27, t, { fs: 14.5, a: 'middle', mono: true, c: t === '—' ? 'dim' : '#e6edf3' });
    });
    if (k) s += A(x - 26, 21, x - 4, 21, { c: 'lx', sw: 2 });
  });
  s += T(580, 232, 'Đọc từ TRÁI sang PHẢI, mỗi bước chép "đang trỏ đâu" — giống a=b trong phép đổi chỗ hai biến', { fs: 15, a: 'middle', c: 'mu' });
  return sv(1160, 244, s);
};

/* Slide 17 — 16 file, 10 làn: -n1 -P10 chia đều; thiếu -n1 thì 1 gzip nhận cả 16 */
const xargsSvg = () => {
  let s = '';
  const X0 = 250, SC = 180; // px mỗi giây
  const lane = (y, lab, col, blocks, tt) => {
    s += T(0, y + 20, lab, { fs: 15, b: true, mono: true, c: col });
    blocks.forEach(([a, b, t]) => { s += R(X0 + a * SC, y, (b - a) * SC - 3, 28, { c: col, r: 5, sw: 1.5, fill: 'rgba(255,255,255,.04)' }) + (t ? T(X0 + a * SC + 8, y + 19, t, { fs: 12.5, mono: true, c: 'mu' }) : ''); });
    if (tt) s += T(X0 + blocks[blocks.length - 1][1] * SC + 10, y + 20, tt, { fs: 15, b: true, c: col });
  };
  // thang thời gian
  for (let t = 0; t <= 4.5; t += 0.5) {
    const x = X0 + t * SC;
    s += `<line x1="${x}" y1="18" x2="${x}" y2="370" stroke="${D.bd}" stroke-width="1" stroke-dasharray="3 5"/>` + T(x, 12, `${t}s`, { fs: 12, a: 'middle', c: 'dim', mono: true });
  }
  lane(26, 'vòng for', 'red', [[0, 4.28, '16 file nối đuôi nhau, mỗi lúc 1 nhân']], '4,28 s');
  s += T(0, 90, 'xargs -0 -n1 -P10', { fs: 15, b: true, mono: true, c: 'grn' });
  for (let i = 0; i < 10; i++) {
    const y = 74 + i * 22;
    const b = [[0, 0.37]];
    if (i < 6) b.push([0.37, 0.74]);
    b.forEach(([a, e]) => { s += R(X0 + a * SC, y, (e - a) * SC - 3, 17, { c: 'grn', r: 4, sw: 1.2, fill: 'rgba(63,185,80,.12)' }); });
  }
  s += T(X0 + 0.74 * SC + 12, 140, '0,74 s — 16 việc / 10 làn = 2 đợt', { fs: 15, b: true, c: 'grn' });
  lane(310, 'xargs -0 -P10', 'amb', [[0, 4.40, 'gzip file1 … file16 — MỘT tiến trình']], '4,40 s');
  s += T(X0, 360, 'không có -n, xargs nhồi cả 16 tên vào MỘT lần gọi ⇒ -P10 không có gì để chia', { fs: 14.5, c: 'amb' });
  return sv(1160, 372, s);
};

/* Slide 18 — hàng đợi 3 làn bằng wait -n (thời điểm thật từ c3.sh) */
const semSvg = () => {
  const jobs = [[1, 0, 0.5], [2, 0, 0.6], [3, 0, 0.4], [4, 0.4, 0.9], [5, 0.5, 1.1, 1], [6, 0.6, 1.0], [7, 0.9, 1.4]];
  const lanes = [[3, 4, 7], [1, 5], [2, 6]];
  const X0 = 62, SC = 300;
  let s = '';
  for (let t = 0; t <= 1.4001; t += 0.2) {
    const x = X0 + t * SC;
    s += `<line x1="${x}" y1="20" x2="${x}" y2="176" stroke="${D.bd}" stroke-width="1" stroke-dasharray="3 5"/>` + T(x, 14, `${t.toFixed(1)}s`, { fs: 12, a: 'middle', c: 'dim', mono: true });
  }
  lanes.forEach((ln, i) => {
    const y = 28 + i * 50;
    s += T(0, y + 26, `làn ${i + 1}`, { fs: 13.5, c: 'mu', b: true });
    ln.forEach((j) => {
      const [n, a, b, bad] = jobs[j - 1];
      const col = bad ? 'red' : 'grn';
      s += R(X0 + a * SC + 2, y, (b - a) * SC - 5, 38, { c: col, r: 7, fill: bad ? 'rgba(255,92,108,.14)' : 'rgba(63,185,80,.12)' });
      s += T(X0 + (a + b) / 2 * SC, y + 25, bad ? `${n} ✗` : `việc ${n}`, { fs: 14, a: 'middle', b: true, c: bad ? 'red' : '#e6edf3' });
    });
  });
  return sv(490, 184, s);
};

/* Slide 22 — chuỗi đặc tả getopts ':nvd:h-:' (chép specSvg của lx-07, sửa ký tự và nhãn) */
const specSvg = () => {
  const str = "getopts ':nvd:h-:' opt", fs = 32, cw = fs * 0.602, w = 1150;
  const x0 = Math.round((w - str.length * cw) / 2), y0 = 44;
  const cols = { 9: 'vio', 10: 'grn', 11: 'grn', 12: 'lx', 13: 'lx', 14: 'tea', 15: 'pnk', 16: 'pnk', 19: 'blu', 20: 'blu', 21: 'blu' };
  let s = R(x0 - 18, y0 - fs - 4, str.length * cw + 36, fs + 22, { c: 'bd', fill: '#050806', r: 10, sw: 2 });
  [...str].forEach((ch, i) => { s += `<text x="${(x0 + i * cw).toFixed(1)}" y="${y0}" font-size="${fs}" fill="${c(cols[i] || '#e6edf3')}" font-family="${MONO}" font-weight="700">${esc(ch)}</text>`; });
  const labs = [
    [9, 10, ': đầu', 'im lặng — tự báo lỗi', 'vio'],
    [10, 12, 'n  v', 'cờ bật/tắt', 'grn'],
    [12, 14, 'd:', 'cần giá trị → OPTARG', 'lx'],
    [14, 15, 'h', 'trợ giúp', 'tea'],
    [15, 17, '-:', '--dài ⇒ opt="-"', 'pnk'],
    [19, 22, 'opt', 'chữ vừa đọc', 'blu'],
  ];
  labs.forEach(([f, t, name, d, col], k) => {
    const a = x0 + f * cw + 2, b = x0 + t * cw - 2, mid = (a + b) / 2, lx = 96 + k * 192, ly = 116;
    s += `<path d="M${a} ${y0 + 12} L${a} ${y0 + 18} L${b} ${y0 + 18} L${b} ${y0 + 12}" stroke="${c(col)}" stroke-width="3" fill="none"/>`;
    s += `<path d="M${mid} ${y0 + 18} L${mid} ${y0 + 32} L${lx} ${ly - 30} L${lx} ${ly - 20}" stroke="${c(col)}" stroke-width="2" fill="none" stroke-dasharray="4 4"/>`;
    s += T(lx, ly, name, { fs: 18, a: 'middle', b: true, c: col, mono: true }) + T(lx, ly + 22, d, { fs: 14, a: 'middle', c: 'mu' });
  });
  return sv(w, 146, s);
};

/* Slide 23 — stack trace: ba mảng song song, đọc theo cột i */
const stackSvg = () => {
  const cols = [
    ['i', ['0', '1', '2', '3']],
    ['FUNCNAME[i]', ['on_err', 'run', 'main', 'main*']],
    ['BASH_LINENO[i-1]', ['—', '55', '63', '69']],
    ['BASH_SOURCE[i]', ['don-log.sh', 'don-log.sh', 'don-log.sh', 'don-log.sh']],
    ['in ra', ['(bẫy — bỏ qua)', 'tại run() :55', 'tại main() :63', 'tại (thân script) :69']],
  ];
  const W = [60, 190, 200, 190, 280];
  let s = '', x = 0;
  cols.forEach(([h, v], j) => {
    s += T(x + W[j] / 2, 22, h, { fs: 15, a: 'middle', b: true, mono: j < 4, c: ['mu', 'lx', 'grn', 'blu', 'amb'][j] });
    v.forEach((t, i) => {
      const y = 36 + i * 46;
      const col = i === 0 ? 'dim' : ['mu', 'lx', 'grn', 'blu', 'amb'][j];
      s += R(x + 4, y, W[j] - 8, 38, { c: col, r: 7, fill: '#050806', sw: 1.8, dash: i === 0 }) + T(x + W[j] / 2, y + 25, t, { fs: 14.5, a: 'middle', mono: true, c: i === 0 ? 'dim' : '#e6edf3' });
    });
    x += W[j];
  });
  s += T(x + 20, 82, 'gzip hỏng', { fs: 15, c: 'red', b: true }) + T(x + 20, 104, 'ở dòng 55', { fs: 15, c: 'red', b: true });
  s += A(x + 14, 96, x - 4, 100, { c: 'red', sw: 2 });
  s += T(0, 238, '* bash gọi phần thân script là "main" — trùng tên với hàm main() của bạn, nên đổi nhãn khi in', { fs: 14, c: 'dim' });
  return sv(1150, 248, s);
};

export const slides = S([
  cover({ t: 'Chương 13 — Bash nâng cao', sub: 'Mảng &amp; mảng kết hợp · file descriptor &amp; luồng · song song &amp; tốc độ · script mức chuyên gia', chap: 'CHƯƠNG 13' }),

  { t: 'Bản đồ chương: khi script lớn lên', body: mindmap('Bash nâng cao', 'đúng dữ liệu · đúng luồng · đủ nhanh · kiểm được', [
    { t: '13.1 Mảng', d: 'declare -a/-A · mapfile · nameref · -i -r', c: 'lx' },
    { t: '13.2 Luồng', d: '{fd} · <( ) >( ) · heredoc · fifo · coproc', c: 'grn' },
    { t: '13.3 Tốc độ', d: 'fork đắt · awk một lần · xargs -P · wait -n', c: 'tea' },
    { t: '13.4 Chuyên gia', d: 'getopts -: · stack trace · bats · shfmt', c: 'blu' },
    { t: 'Đo, đừng đoán', d: 'time · hyperfine · $EPOCHREALTIME', c: 'vio' },
    { t: 'Mac bash 3.2', d: 'thiếu -A, mapfile, wait -n… · khi nào sang Python', c: 'amb' },
  ]) },

  /* ───────────── 13.1 ───────────── */
  { t: 'Mảng có thể THƯA: unset để lại một lỗ', body: `${idxSvg()}
    ${two(
      term(['$ for ((i=0; i<${#a[@]}; i++)); do echo "i=$i [${a[i]}]"; done', 'i=0 [web]', '! i=1 []', 'i=2 [cache redis]', 'i=3 [worker]', '# … mail ở chỉ số 4 bị BỎ SÓT', '$ for i in "${!a[@]}"; do …   # đúng: lặp theo chỉ số THẬT'], { title: 'Ubuntu — vòng for kiểu C trên mảng thưa', fs: 13.5 }),
      box('tip', 'Lặp phần tử: <code>for x in "${a[@]}"</code>. Cần chỉ số: <code>for i in "${!a[@]}"</code>. Phần tử cuối: <code>${a[-1]}</code> (bash ≥ 4.3 — Mac 3.2 báo <code>bad array subscript</code>).'), 'l')}` },

  { t: 'Mảng kết hợp: tra theo TÊN, không theo số', body: two(
    `${sh([
      ['declare -A port=([web]=3000 [api]=4000)', 'BẮT BUỘC declare -A'],
      ['port[db]=5432', 'thêm một cặp'],
      ['port["redis cache"]=6379', 'khoá có dấu cách: nháy'],
      ['echo "${port[api]}"', 'tra: 4000'],
      ['echo "${#port[@]} khoá: ${!port[@]}"', '! = danh sách KHOÁ'],
      ['[[ -v port[db] ]] && echo "có db"', 'có khoá chưa (≠ rỗng)'],
      ["unset 'port[web]'", 'xoá một khoá — có nháy'],
      ['declare -p port', 'in ra để xem/ghi file'],
    ], { fs: 14.5 })}
    ${box('warn', 'Thứ tự khoá là thứ tự của bảng băm — KHÔNG phải thứ tự bạn thêm. Cần sắp xếp: <code>printf \'%s\\n\' "${!port[@]}" | sort</code>.')}`,
    term(['$ bash a2.sh', 'api -> 4000', 'số khoá: 4', '+ các khoá: db api web redis cache', 'db           5432', 'api          4000', 'web          3000', 'redis cache  6379', 'có khoá db', 'không có khoá mail', 'mail -> []', 'declare -A port=([db]="5432" [api]="4000" ["redis cache"]="6379" )'], { title: 'Ubuntu 24.04 — bash 5.2.21', fs: 14 }), 'l') },

  { t: 'Quên declare -A: bash im lặng dồn vào ô 0', body: `
    ${diagram({ w: 1160, h: 130, nodes: [
      { id: 'a', x: 0, y: 25, w: 250, h: 80, t: 'p[web]=3000', d: 'p chưa khai báo', c: 'amb', mono: true },
      { id: 'b', x: 330, y: 25, w: 260, h: 80, t: 'web ⇒ phép TÍNH', d: 'biến web chưa có = 0', c: 'red' },
      { id: 'c', x: 670, y: 25, w: 200, h: 80, t: 'p[0]=3000', d: 'mảng CHỈ SỐ', c: 'red', mono: true },
      { id: 'd', x: 950, y: 25, w: 210, h: 80, t: 'p[api]=4000', d: 'cũng vào p[0] — đè', c: 'red', mono: true },
    ], edges: [{ from: 'a', to: 'b', c: 'amb', off: 8 }, { from: 'b', to: 'c', c: 'red', off: 8 }, { from: 'c', to: 'd', c: 'red', off: 8 }] })}
    ${two(
      term(['$ p[web]=3000; p[api]=4000', '$ echo "web=${p[web]} api=${p[api]}"', '! web=4000 api=4000', '$ declare -p p', '! declare -a p=([0]="4000")'], { title: 'Ubuntu — không lỗi, không cảnh báo, sai dữ liệu', fs: 14 }),
      term(['$ /bin/bash a2.sh', "! line 1: declare: -A: invalid option", '! line 3: redis cache: syntax error in expression', '! api -> 5432      # SAI: đọc nhầm ô 0', 'số khoá: 1', "! line 8: syntax error near `port[db]'"], { title: 'Mac — /bin/bash 3.2: không có mảng kết hợp', fs: 14 }), 'r')}
    ${box('bad', 'Trong HÀM, <code>declare -A m</code> tạo biến <b>cục bộ</b> — ra khỏi hàm là mất. Muốn toàn cục: <code>declare -gA m</code> (đo: <code>port=[]</code> so với <code>port2=[80]</code>).')}` },

  { t: 'Đếm IP: mảng kết hợp đúng nhưng chậm 30×', body: two(
    `${sh([
      ['declare -A dem', ''],
      ['while read -r ip _; do', 'chỉ lấy cột 1'],
      ['  (( dem[$ip]++ ))', 'đếm theo khoá'],
      ['done < access.log', ''],
      ['for ip in "${!dem[@]}"; do', ''],
      ["  printf '%7d %s\\n' \"${dem[$ip]}\" \"$ip\"", ''],
      ['done | sort -rn | head -5', ''],
    ], { fs: 14.5 })}
    ${term(['$ ./demip.sh', '  30270 10.0.2.75', '  15456 10.0.1.167', '  10471 10.0.1.171', '# cut|sort|uniq -c và awk in y hệt 5 dòng này'], { title: 'Ubuntu — 200.000 dòng, 16 MB', fs: 14 })}`,
    `${bars([
      { l: 'while read + declare -A', sub: 'bash đọc từng dòng', v: 1.732, txt: '1,73 s', c: 'red' },
      { l: 'cut | sort | uniq -c', sub: '4 chương trình C', v: 0.109, txt: '0,109 s', c: 'amb' },
      { l: "awk '{d[$1]++}'", sub: 'mảng kết hợp của awk', v: 0.058, txt: '0,058 s', c: 'grn' },
    ], { lw: 250, max: 1.8 })}
    <p style="font-size:14.5px;color:${D.mu};margin-top:6px">hyperfine, 5 lượt, trung bình. Cùng ý tưởng “mảng kết hợp” — awk làm trong C.</p>
    ${box('tip', 'Mảng kết hợp của bash dành cho <b>trạng thái</b> của script (bảng cấu hình, đã-thấy-chưa, PID → tên việc), không phải để nghiền cả file log.')}`, 'r') },

  { t: 'mapfile: mỗi dòng của file thành một phần tử', body: two(
    table(['Cờ', 'Nghĩa', 'Kết quả thật (dv.txt = web/db/cache)'], [
      ['<code>-t</code>', 'bỏ ký tự xuống dòng cuối', '<code>([0]="web" [1]="db" [2]="cache")</code>'],
      ['(không <code>-t</code>)', '-giữ <code>\\n</code> trong từng phần tử', "<code>([0]=$'web\\n' …)</code>"],
      ['<code>-n 2</code>', 'đọc tối đa 2 dòng', '<code>web db</code>'],
      ['<code>-s 1</code>', 'bỏ qua 1 dòng đầu (tiêu đề CSV)', '<code>db cache</code>'],
      ['<code>-O N</code>', 'ghi từ chỉ số N (nối thêm)', '<code>-O "${#dv[@]}"</code> ⇒ thêm mail'],
      ["<code>-d ''</code>", 'tách theo NUL (bash ≥ 4.4)', 'đi với <code>find -print0</code>'],
      ['<code>-C f -c 2</code>', 'gọi f sau mỗi 2 dòng', 'thanh tiến độ khi đọc file lớn'],
    ], { sm: true }),
    `${sh([
      ['mapfile -t dv < dv.txt', 'từ file'],
      ['mapfile -t ds < <(git ls-files)', 'từ một lệnh'],
      ["mapfile -d '' -t fs < <(find . -print0)", 'tên file bất kỳ'],
      ['readarray -t dv < dv.txt', 'tên khác, y hệt'],
    ], { fs: 14, so: false })}
    ${term(['$ /bin/bash -c \'mapfile -t x < /etc/hosts\'', '! /bin/bash: mapfile: command not found', '$ /bin/bash -c \'readarray x < /etc/hosts\'', '! /bin/bash: readarray: command not found'], { title: 'Mac — bash 3.2', fs: 13.5 })}
    ${box('bad', '<code>cmd | mapfile -t a</code> ⇒ mảng RỖNG: mapfile chạy trong shell con của ống (Bài 3.2). Luôn dùng <code>&lt; &lt;(cmd)</code>.')}`, 'l') },

  { t: 'Nameref và thuộc tính: -n -i -l -r -p', body: two(
    `${sh([
      ['them_cong() {', '$1 = TÊN mảng của người gọi'],
      ['  local -n bang=$1', 'bang là TÊN KHÁC của mảng đó'],
      ['  bang[$2]=$3', 'ghi thẳng vào mảng người gọi'],
      ['}', ''],
      ['declare -A cong=([web]=3000)', ''],
      ['them_cong cong api 4000', 'truyền TÊN, không phải "$cong"'],
      ['them_cong cong db 5432', ''],
      ['declare -p cong', ''],
    ], { fs: 14.5 })}
    ${term(['declare -A cong=([db]="5432" [api]="4000" [web]="3000" )', '$ f() { local -n mang=$1; …; }; mang=(a b); f mang', '! warning: mang: circular name reference'], { title: 'Ubuntu — output thật', fs: 13.5 })}`,
    `${table(['Thuộc tính', 'Làm gì', 'Đo thật'], [
      ['<code>declare -i n=5</code>', 'gán là TÍNH', '<code>n+=3</code> → 8 · <code>n="2*10"</code> → 20'],
      ['', '-chữ lạ thành 0, không báo', '<code>n=abc</code> → 0'],
      ['(không -i)', '<code>+=</code> là NỐI chuỗi', '<code>s=5; s+=3</code> → 53'],
      ['<code>declare -l</code> / <code>-u</code>', 'tự đổi thường / HOA', 'HELLO → hello'],
      ['<code>readonly</code> · <code>local -r</code>', 'hằng — gán lại là lỗi', '!bỏ CẢ dòng lệnh'],
      ['<code>declare -p m</code>', 'in dạng nạp lại được', '<code>&gt; f</code> rồi <code>source f</code>'],
    ], { sm: true })}
    ${box('warn', 'Đặt tên nameref thật riêng (<code>_bang</code>) — trùng tên biến của người gọi là tham chiếu vòng.')}`, 'l') },

  /* ───────────── 13.2 ───────────── */
  { t: 'Mỗi tiến trình có một bảng fd; exec mở thêm', body: `${fdSvg()}
    ${two(
      sh([
        ['exec {log}>>nhat-ky.txt', 'mở fd MỚI, số ghi vào $log'],
        ['echo "fd được cấp: $log"', '→ 10'],
        ['echo "bước 1 xong" >&$log', 'ghi vào file qua fd'],
        ['exec {log}>&-', 'đóng'],
        ['exec 3<trai.txt 4<phai.txt', 'hai file đọc song song'],
        ['while read -r x <&3 && read -r y <&4; do', ''],
        ['  echo "$x-$y"; done', '→ a-1  b-2  c-3'],
      ], { fs: 13.5 }),
      box('info', 'Bài 3.1 đã có <code>exec 3&gt; f</code> với số tự chọn. <code>{tên}</code> (bash ≥ 4.1) để bash chọn số trống — không lo đè fd 3 mà một thư viện khác đang dùng. Mac 3.2: <code>exec: {log}: not found</code>.'), 'l')}` },

  { t: 'Đổi chỗ stdout và stderr: fd 3 làm chỗ trung chuyển', body: `${swapSvg()}
    ${two(
      sh([
        ['f() { echo "dữ liệu"; echo "lỗi" >&2; }', ''],
        ['# chỉ LỖI đi vào ống, dữ liệu ra màn hình', ''],
        ["f 3>&1 1>&2 2>&3 3>&- | sed 's/^/ỐNG NHẬN: /'", ''],
        ['# hứng stderr vào biến, stdout vẫn ra màn hình', ''],
        ['{ loi=$(f 2>&1 1>&3 3>&-); } 3>&1', ''],
      ], { fs: 13.5, so: false }),
      term(['dữ liệu (stdout)', '+ ỐNG NHẬN: lỗi (stderr)', '# ---- cách 2 ----', 'dữ liệu (stdout)', '= loi=[lỗi (stderr)]'], { title: 'Ubuntu — output thật', fs: 14 }), 'l')}` },

  { t: '<(lệnh) là một TÊN FILE trỏ vào một ống', body: two(
    `${diagram({ w: 560, h: 250, nodes: [
      { id: 's1', x: 0, y: 10, w: 200, h: 64, t: 'sort can.txt', c: 'grn', mono: true },
      { id: 's2', x: 0, y: 170, w: 200, h: 64, t: 'sort co.txt', c: 'blu', mono: true },
      { id: 'd', x: 330, y: 80, w: 230, h: 90, t: 'diff A B', d: 'A=/dev/fd/63\nB=/dev/fd/62', c: 'lx', mono: true },
    ], edges: [{ from: 's1', to: 'd', t: 'ống', c: 'grn', off: 8 }, { from: 's2', to: 'd', t: 'ống', c: 'blu', off: 8 }] })}
    ${box('tip', 'Dùng khi lệnh CHỈ nhận tên file (<code>diff</code>, <code>comm</code>, <code>join</code>, <code>paste</code>) mà bạn có output của lệnh khác. Không cần file tạm, không cần dọn.')}`,
    `${term(['$ echo <(true)', '/dev/fd/63', '$ ls -l <(true)', 'lr-x------ /dev/fd/63 -> pipe:[3171670]', '$ diff <(sort can.txt) <(sort co.txt); echo "mã=$?"', '3d2', '< nginx', 'mã=1', "$ seq 1 5 | tee >(wc -l > dem.txt) >(gzip > so.gz) >/dev/null", '= đếm=5  gz=1 2 3 4 5', '$ cat <(false; echo trong); echo "mã=$?"', 'trong', '! mã=0          # mã của <( ) bị MẤT', '$ exec 5< <(sleep 0.1; exit 3); wait $!; echo $?', '= 3               # bash ≥ 4.4: $! là PID của <( )'], { title: 'Ubuntu 24.04 — output thật', fs: 13.5 })}`, 'r') },

  { t: 'Heredoc ba kiểu và here-string <<<', body: two(
    `${sh([
      ['cat <<EOF', 'KHÔNG nháy: khai triển $ và $( )'],
      ['Xin chào $ten, hôm nay $(date +%F)', ''],
      ['EOF', ''],
      ["cat <<'EOF'", 'CÓ nháy: giữ nguyên từng ký tự'],
      ['Xin chào $ten, hôm nay $(date +%F)', ''],
      ['EOF', ''],
      ['	cat <<-EOF', '<<- : xoá TAB đầu dòng'],
      ['	thụt bằng TAB', '(TAB — không phải dấu cách)'],
      ['	EOF', ''],
      ['read -r a b c <<< "một hai ba bốn"', 'here-string: 1 dòng vào stdin'],
    ], { fs: 14 })}`,
    `${term(['Xin chào Cường, hôm nay 2026-09-28', 'Xin chào $ten, hôm nay $(date +%F)', 'thụt bằng TAB — <<- xoá tab đầu dòng', 'a=một b=hai c=ba bốn', '$ od -c <<< "hi"', '0000000   h   i  \\n        # <<< tự thêm \\n'], { title: 'Ubuntu — output thật', fs: 14 })}
    ${term(["! b5.sh: line 6: warning: here-document at line 2 delimited by end-of-file (wanted `EOF')", '! b5.sh: line 7: syntax error: unexpected end of file'], { title: 'Ubuntu — <<- mà thụt bằng DẤU CÁCH', fs: 13 })}
    ${box('tip', 'Script gửi SQL/cấu hình có <code>$</code>: dùng <code>&lt;&lt;\'EOF\'</code>. Trình soạn thảo đổi TAB thành dấu cách là <code>&lt;&lt;-</code> hỏng ngay.')}`, 'l') },

  { t: 'mkfifo và coproc: hai tiến trình nói chuyện qua ống', body: two(
    `${sh([
      ['mkfifo ong', 'ống CÓ TÊN trên đĩa (loại p)'],
      ['( sleep 1; echo "tin" > ong ) &', 'bên GHI'],
      ['read -r tin < ong', 'bên ĐỌC chờ tới khi có người ghi'],
      ['rm ong', ''],
    ], { fs: 14 })}
    ${term(['$ ls -l ong | cut -c1-10', 'prw-r--r--', 'đọc đang CHỜ…', '= nhận: tin từ tiến trình ghi sau 1.0 giây'], { title: 'Ubuntu — output thật', fs: 14 })}
    ${box('info', 'Mở fifo là CHẶN tới khi có cả người đọc lẫn người ghi. Dùng cho hai chương trình độc lập, không cùng ống <code>|</code>.')}`,
    `${sh([
      ['coproc BC { bc -l; }', 'chạy nền, nối HAI ống'],
      ['echo "scale=4; 22/7" >&"${BC[1]}"', 'ghi vào stdin của bc'],
      ['read -r kq <&"${BC[0]}"', 'đọc stdout của bc'],
      ['exec {BC[1]}>&-; wait "$BC_PID"', 'đóng stdin ⇒ bc thoát'],
    ], { fs: 14 })}
    ${term(['PID coproc=3801, fd: 63 60', '22/7 = 3.1428', '2^64 = 18446744073709551616', '= bc đã thoát, mã 0'], { title: 'Ubuntu — một bc sống suốt script', fs: 14 })}
    ${box('warn', 'Đọc nhiều hơn số dòng coproc in ra là TREO. Mac 3.2: <code>coproc: command not found</code>.')}`) },

  { t: 'Đọc tên file an toàn: 5 cách, 4 kết quả', body: two(
    `${table(['Cách viết (4 file, 1 tên có \\n)', 'n'], [
      ['-<code>find | while read f</code>', '-✗ 0'],
      ['<code>while read f … &lt; &lt;(find)</code>', '!5'],
      ["+<code>while IFS= read -r -d '' f … &lt; &lt;(find -print0)</code>", '+4'],
      ['+<code>shopt -s lastpipe</code> + <code>find -print0 |</code>', '+4'],
      ["+<code>mapfile -d '' -t ds &lt; &lt;(find -print0)</code>", '+4'],
    ], { sm: true, center: [1] })}
    ${box('info', '0: vòng lặp chạy trong shell CON của ống — biến đếm chết theo nó (Bài 3.2). 5: tên <code>xuong↵dong.txt</code> bị đọc thành HAI dòng.')}`,
    `${table(['Viết', 'Đầu vào', 'Nhận được'], [
      ['<code>read -r x</code>', '"␣␣thụt lề"', '-[thụt lề] — mất dấu cách'],
      ['<code>IFS= read -r x</code>', '"␣␣thụt lề"', '+[␣␣thụt lề]'],
      ['<code>read x</code>', '<code>a\\tb</code>', '-[atb] — ăn gạch chéo'],
      ['<code>read -r x</code>', '<code>a\\tb</code>', '+[a\\tb]'],
      ['<code>while read -r x</code>', 'dòng cuối thiếu \\n', '-mất dòng cuối'],
      ['<code>… || [[ -n $x ]]</code>', 'dòng cuối thiếu \\n', '+giữ được'],
    ], { sm: true })}
    ${term(['$ IFS=, read -r -a b <<< "x,y z,,w"; declare -p b', 'declare -a b=([0]="x" [1]="y z" [2]="" [3]="w")'], { title: 'Ubuntu — IFS chỉ cho MỘT lệnh', fs: 13.5 })}`, 'l') },

  /* ───────────── 13.3 ───────────── */
  { t: 'Mỗi $(…) là một fork: 10.000 vòng, đo thật', body: two(
    `${bars([
      { l: '$(echo "$f" | sed …)', sub: '2 fork + 2 exec', v: 14.861, txt: '14,9 s', c: 'red' },
      { l: '$(expr $i + 1)', sub: 'fork + exec', v: 7.852, txt: '7,85 s', c: 'red' },
      { l: '$(date +%H:%M:%S)', sub: 'fork + exec', v: 7.324, txt: '7,32 s', c: 'red' },
      { l: '$(basename "$f")', sub: 'fork + exec', v: 6.43, txt: '6,43 s', c: 'red' },
      { l: "printf -v d '%(%T)T' -1", sub: 'builtin, bash ≥ 4.2', v: 0.121, txt: '0,121 s', c: 'grn' },
      { l: '${f##*/}', sub: 'khai triển (Bài 6.3)', v: 0.045, txt: '0,045 s', c: 'grn' },
      { l: '${f/tar/zip}', sub: 'khai triển', v: 0.039, txt: '0,039 s', c: 'grn' },
      { l: '(( k = i + 1 ))', sub: 'số học builtin', v: 0.027, txt: '0,027 s', c: 'grn' },
    ], { lw: 280, max: 15 })}`,
    `${term(['$ ./c1.sh 10000     # 10.000 vòng mỗi dòng', '$(basename "$f")          6.430 s', '${f##*/}                  0.045 s', '$(date +%H:%M:%S)         7.324 s', "printf -v d '%(%T)T' -1   0.121 s", '$(echo "$f" | sed …)     14.861 s', '${f/tar/zip}              0.039 s', '$(expr $i + 1)            7.852 s', '(( k = i + 1 ))           0.027 s'], { title: 'Ubuntu — $EPOCHREALTIME quanh vòng', fs: 13.5 })}
    ${box('info', 'Chậm không vì <code>basename</code> chậm — vì mỗi <code>$(…)</code> nhân bản cả shell (fork, ~0,3 ms). Đo riêng: <code>$(printf x)</code> — builtin! — 10.000 lần mất 3,4 s; <code>printf -v</code> 0,04 s. Fedora 44: <code>basename</code> 11,9 s.')}`, 'l') },

  { t: 'Một lần awk thay 20.000 lần gọi awk', body: two(
    `${sh([
      ['# ✗ mỗi dòng một ống + một awk (tong2.sh)', ''],
      ['while read -r line; do', ''],
      ['  b=$(echo "$line" | awk \'{print $10}\')', '≥ 2 fork mỗi dòng'],
      ['  (( tong += b ))', ''],
      ['done < a20k.log', ''],
      ['# ~ bash thuần: read -a tách cột (tong1.sh)', ''],
      ['while read -r -a c; do (( tong += c[9] )); done < a20k.log', ''],
      ['# ✓ một chương trình đọc cả file', ''],
      ["awk '{s += $10} END {print s}' a20k.log", ''],
    ], { fs: 14 })}
    ${term(['$ bash tong1.sh; awk \'{s+=$10} END{print s}\' a20k.log', '90919365', '90919365'], { title: 'Ubuntu — cùng một đáp số', fs: 14 })}`,
    `${bars([
      { l: 'awk trong vòng lặp', sub: '≥ 40.000 fork', v: 33.292, txt: '33,3 s', c: 'red' },
      { l: 'while read -r -a', sub: 'bash thuần', v: 0.1545, txt: '0,154 s', c: 'amb' },
      { l: 'awk một lần', sub: '1 tiến trình', v: 0.0118, txt: '0,012 s', c: 'grn' },
    ], { lw: 230, max: 34 })}
    <p style="font-size:14.5px;color:${D.mu};margin-top:6px">hyperfine, 3 lượt, 20.000 dòng log. awk-một-lần nhanh hơn ~2.800 lần.</p>
    ${box('good', 'Luật: <b>đừng gọi chương trình ngoài bên trong vòng lặp trên dữ liệu</b>. Đẩy cả dòng dữ liệu cho MỘT <code>awk</code>/<code>sed</code>/<code>sort</code>; giữ bash cho điều phối.')}`, 'l') },

  { t: 'xargs -P: thiếu -n1 thì -P không có gì để chia', body: `${xargsSvg()}
    ${two(
      sh([["printf '%s\\0' *.txt | xargs -0 -n1 -P10 gzip -9 -k --", '16 file × 6 MB']], { fs: 14, so: false }),
      term(['real 0m0.801s   user 0m6.078s'], { title: 'Ubuntu — time: user > real', fs: 14 }), 'l2')}` },

  { t: 'wait -n: tự viết hàng đợi 3 làn, biết việc nào hỏng', body: two(
    sh([
      ['max=3 dang=0 loi=0', ''],
      ['declare -A ten', 'PID → số thứ tự việc'],
      ['cho_mot() {', 'chờ MỘT việc bất kỳ xong'],
      ['  wait -n -p pid; local rc=$?', '-p: bash ≥ 5.1'],
      ['  (( dang-- ))', ''],
      ['  (( rc )) && { echo "việc ${ten[$pid]} HỎNG"; loi=1; }', ''],
      ['}', ''],
      ['for i in 1 2 3 4 5 6 7; do', ''],
      ['  (( dang >= max )) && cho_mot', 'đủ 3 làn thì chờ'],
      ['  viec "$i" & ten[$!]=$i; (( dang++ ))', '$! = PID vừa chạy'],
      ['done', ''],
      ['while (( dang > 0 )); do cho_mot; done', 'chờ nốt'],
      ['exit "$loi"', 'cron/CI thấy HỎNG'],
    ], { fs: 13.5 }),
    `${semSvg()}
    ${term(['0.0s  bắt đầu việc 1', '0.0s  bắt đầu việc 2', '0.0s  bắt đầu việc 3', '0.4s  bắt đầu việc 4', '0.5s  bắt đầu việc 5', '0.6s  bắt đầu việc 6', '0.9s  bắt đầu việc 7', '!   việc 5 HỎNG (mã 1)', '1.4s  xong hết, loi=1'], { title: 'Ubuntu — c3.sh, mã thoát 1', fs: 13 })}`, 'l') },

  { t: 'GNU parallel: giữ thứ tự, gắn nhãn, ghi nhật ký', body: two(
    `${sh([
      ['sudo apt install parallel', 'Mac: brew install parallel'],
      ['parallel -j3 CMD {} ::: 1 2 3 4 5 6', 'tối đa 3 việc cùng lúc'],
      ['parallel -k -j3 …', '-k: in theo thứ tự ĐẦU VÀO'],
      ['parallel --tag "echo {.}.gz; echo {/}" ::: …', '{.} bỏ đuôi · {/} tên file'],
      ['parallel --joblog nk.tsv "exit {}" ::: 0 1 0 2', 'nhật ký từng việc'],
      ['parallel echo {1}-{2} ::: a b ::: 1 2', 'mọi tổ hợp'],
    ], { fs: 13.5 })}
    ${box('info', 'Lần đầu parallel xin trích dẫn học thuật — tắt vĩnh viễn: <code>parallel --citation</code> hoặc tạo <code>~/.parallel/will-cite</code>.')}`,
    `${term(['# không -k: xong trước in trước', 'việc 2', 'việc 1', 'việc 3', '# có -k', 'việc 1', 'việc 2', 'việc 3', '$ parallel --tag "echo {.}.gz" ::: "/tmp/a b.txt"', '/tmp/a b.txt	/tmp/a b.gz', '$ parallel -j2 --joblog nk.tsv "exit {}" ::: 0 1 0 2', '$ echo $?', '! 2               # = SỐ việc hỏng', '$ cut -f1,4,7,9 nk.tsv', 'Seq  JobRuntime  Exitval  Command', '2         0.003        1  exit 1', '4         0.001        2  exit 2'], { title: 'Ubuntu — GNU parallel 20231122 (cắt bớt)', fs: 13.5 })}`, 'l') },

  { t: 'Đo cho đúng: real, user và hyperfine', body: two(
    `${term(['$ time bash tuantu.sh      # gzip 16 file nối đuôi', 'real	0m6.262s', 'user	0m6.133s', '$ time P=10 bash song.sh   # xargs -P10', '+ real	0m0.801s', '+ user	0m6.078s', '$ TIMEFORMAT="%Rs thực, %Us user"; time sleep 0.3', '0.305s thực, 0.001s user'], { title: 'Ubuntu — từ khoá time của bash', fs: 14 })}
    ${table(['Cột', 'Nghĩa'], [
      ['<code>real</code>', 'đồng hồ treo tường — người dùng chờ bao lâu'],
      ['<code>user</code> + <code>sys</code>', 'thời gian CPU của mọi nhân cộng lại'],
      ['<code>user &gt; real</code>', '+đang chạy song song thật'],
      ['<code>real ≫ user</code>', 'đang CHỜ (mạng, đĩa, sleep)'],
    ], { sm: true })}`,
    `${term(['$ hyperfine -w 1 -r 5 -N ./demip.sh "awk …"', 'Benchmark 1: ./demip.sh', '  Time (mean ± σ):   1.732 s ±  0.194 s', 'Benchmark 2: awk …', '  Time (mean ± σ):  57.9 ms ±  10.7 ms', '= awk … ran 29.91 ± 6.48 times faster'], { title: 'Ubuntu — hyperfine 1.18', fs: 13.5 })}
    ${sh([
      ['t0=$EPOCHREALTIME', 'bash ≥ 5.0, micro giây'],
      ['…việc…', ''],
      ["awk -v a=$t0 -v b=$EPOCHREALTIME 'BEGIN{print b-a}'", 'số thực ⇒ awk/bc'],
    ], { fs: 13, so: false })}
    ${box('warn', 'Mac 3.2: <code>$EPOCHREALTIME</code> RỖNG, không báo lỗi. Một lần đo không đủ: cùng <code>tuantu.sh</code>, hyperfine ra 4,28 s, lần <code>time</code> lẻ ra 6,26 s — hãy đo nhiều lượt.')}`, 'l') },

  /* ───────────── 13.4 ───────────── */
  { t: 'Script chuyên gia = khung Ch7 + 5 lớp nữa', body: two(
    sh([
      ['set -Eeuo pipefail', '(Ch7)'],
      ['shopt -s inherit_errexit', '-e áp cả trong $( ) — 4.4'],
      ["[[ -t 2 ]] && C_ERR=$'\\e[31m'", 'màu chỉ khi stderr là terminal'],
      ["log() { printf '%(%F %T)T %-5s %s\\n' -1 \"$1\" \"${*:2}\" >&2; }", ''],
      ['debug() { (( VERBOSE )) && log DEBUG "$@"; return 0; }', ''],
      ['trap on_err ERR', 'in stack trace'],
      ["while getopts ':nvd:h-:' opt; do …", 'ngắn VÀ dài'],
      ['run() { if (( DRY_RUN )); then …; else "$@"; fi; }', '--dry-run (Ch7)'],
      ['exec {lock}>"${TMPDIR:-/tmp}/$TEN.lock"', 'khoá — fd tự cấp'],
      ['flock -n "$lock" || die "đang chạy" 3', 'mã 3 = đang bận'],
      ["done < <(find \"$DIR\" … -print0)", 'tên file bất kỳ (13.2)'],
    ], { fs: 13 }),
    `${table(['Mã thoát', 'Nghĩa trong don-log.sh'], [
      ['<code>0</code>', '+xong, hoặc <code>--help</code>'],
      ['<code>1</code>', '-lệnh bên trong hỏng (có stack trace)'],
      ['<code>2</code>', '!gọi sai: cờ lạ, thiếu giá trị, thư mục không có'],
      ['<code>3</code>', 'một bản khác đang giữ khoá'],
    ], { sm: true })}
    ${term(['$ shellcheck don-log.sh && echo SC-OK', '= SC-OK', '$ /bin/bash don-log.sh -n logs; echo "mã=$?"', '! line 5: shopt: inherit_errexit: invalid shell option name', '! mã=1'], { title: 'Ubuntu · rồi Mac bash 3.2', fs: 13.5 })}`, 'l') },

  { t: "getopts hiểu cả --days=9 nhờ '-:'", body: `${specSvg()}
    ${two(
      sh([
        ['if [[ $opt == - ]]; then', 'gặp --… : opt là "-"'],
        ['  opt=${OPTARG%%=*}', 'days=9 → days'],
        ["  [[ $OPTARG == *=* ]] && OPTARG=${OPTARG#*=} || OPTARG=''", '→ 9'],
        ['fi', ''],
        ['case $opt in', 'MỘT case cho cả -d và --days'],
        ['  d|days) [[ -n $OPTARG ]] || die "cần --days=N" 2', ''],
        ['          DAYS=$OPTARG ;;', ''],
      ], { fs: 13.5 }),
      term(['$ ./don-log.sh -n --days=7 logs', 'INFO  [dry-run] gzip -- logs/app-10.log', 'INFO  đã nén 3 file cũ hơn 7 ngày', '$ ./don-log.sh --xyz logs; echo "mã=$?"', '! ERROR cờ lạ: xyz (xem --help)', 'mã=2', '$ ./don-log.sh --days logs; echo "mã=$?"', '! ERROR cần -d N hoặc --days=N', 'mã=2'], { title: 'Ubuntu — (cắt bớt cột ngày giờ)', fs: 13.5 }), 'l')}` },

  { t: 'Stack trace: FUNCNAME + BASH_LINENO + BASH_SOURCE', body: `${stackSvg()}
    ${two(
      sh([
        ['on_err() {', ''],
        ['  local rc=$? i n=${#FUNCNAME[@]}', 'bắt mã ĐẦU TIÊN'],
        ['  log ERROR "lệnh hỏng (mã $rc): $BASH_COMMAND"', ''],
        ['  for (( i = 1; i < n; i++ )); do', 'bỏ [0] = chính on_err'],
        ['    log ERROR "  tại ${FUNCNAME[i]}() …:${BASH_LINENO[i-1]}"', ''],
        ['  done', ''],
        ['}', ''],
      ], { fs: 13 }),
      term(['gzip: logs/app-10.log.gz: Permission denied', '! ERROR lệnh hỏng (mã 1): "$@"', '! ERROR   tại run() don-log.sh:55', '! ERROR   tại main() don-log.sh:63', '! ERROR   tại (thân script) don-log.sh:69', 'mã=1'], { title: 'Ubuntu — logs/ chmod 555', fs: 13.5 }), 'l')}` },

  { t: 'bats-core: kiểm script như kiểm code', body: two(
    sh([
      ['setup() {', 'chạy TRƯỚC mỗi test'],
      ['  LOGS="$BATS_TEST_TMPDIR/logs"', 'thư mục riêng, tự xoá'],
      ["  touch -d '-10 days' \"$LOGS/cu.log\"", ''],
      ['}', ''],
      ['@test "cờ lạ ⇒ mã 2 và nói rõ cờ nào" {', ''],
      ['  run "$SCRIPT" --xoa-het "$LOGS"', 'run: bắt $status, $output'],
      ['  [ "$status" -eq 2 ]', ''],
      ['  [[ $output == *"cờ lạ: xoa-het"* ]]', ''],
      ['}', ''],
      ['@test "gzip hỏng ⇒ có stack trace" {', ''],
      ["  printf '#!/bin/sh\\nexit 1\\n' > \"$BIN/gzip\"", 'gzip GIẢ…'],
      ['  PATH="$BIN:$PATH" run "$SCRIPT" "$LOGS"', '…đứng trước PATH'],
      ['  [[ $output == *"tại run()"* ]]', ''],
      ['}', ''],
    ], { fs: 13 }),
    `${term(['$ bats -p test/', '= ✓ --help in cách dùng, mã 0', '= ✓ cờ lạ ⇒ mã 2 và nói rõ cờ nào', '= ✓ --dry-run không đụng vào file nào', '= ✓ chỉ nén file cũ hơn --days', '= ✓ gzip hỏng ⇒ mã ≠ 0 và có stack trace', '5 tests, 0 failures'], { title: 'Ubuntu — bats 1.10.0', fs: 13.5 })}
    ${term(['! ✗ cờ lạ ⇒ mã 2 và nói rõ cờ nào', "!   (in test file sai.bats, line 21)", "!     `[ \"$status\" -eq 0 ]' failed", '1 test, 1 failure'], { title: 'Ubuntu — cố tình sửa sai một dòng kiểm', fs: 13.5 })}`, 'l') },

  { t: 'shellcheck bắt lỗi mảng; shfmt giữ một kiểu viết', body: two(
    `${term(['$ shellcheck -f gcc mang-sai.sh', '! 2:9: warning: Prefer mapfile or read -a to split', '!      command output … [SC2207]', '! 3:10: warning: Expanding an array without an index', '!      only gives the first element. [SC2128]', '! 4:10: error: Double quote array expansions … [SC2068]', '! 5:18: warning: Quote to prevent word splitting … [SC2206]'], { title: 'Ubuntu — ShellCheck 0.9.0', fs: 13 })}
    ${table(['Mã', 'Dòng sai', 'Sửa'], [
      ['SC2207', '<code>files=( $(find …) )</code>', "<code>mapfile -d '' -t files &lt; &lt;(find … -print0)</code>"],
      ['SC2128', '<code>echo "$files"</code>', '<code>"${#files[@]}"</code> / <code>"${files[0]}"</code>'],
      ['SC2068', '<code>for f in ${files[@]}</code>', '<code>"${files[@]}"</code>'],
      ['SC2206', '<code>arr=($ds)</code>', '<code>read -r -a arr &lt;&lt;&lt; "$ds"</code>'],
    ], { sm: true })}`,
    `${term(['$ shfmt -d -i 2 -ci lon-xon.sh', '! -if [ -f a ]', '! -then', '! -echo co', '+ +if [ -f a ]; then', '+ +  echo co', ' fi', '! -for f in *.log ;do', '+ +for f in *.log; do', '$ shfmt -l -i 2 .     # file nào CHƯA đúng kiểu', 'lon-xon.sh'], { title: 'Ubuntu — shfmt 3.8.0', fs: 13.5 })}
    ${box('bad', 'ShellCheck ĐỔ VỠ với chữ tiếng Việt khi locale là POSIX: <code>commitBuffer: invalid argument (invalid character)</code>. Chạy <code>LC_ALL=C.UTF-8 shellcheck …</code> — trong container/CI hay gặp.')}`, 'l') },

  { t: 'Khi nào thôi viết bash, chuyển sang Python', body: two(
    table(['Dấu hiệu', 'Vì sao bash yếu', 'Bài'], [
      ['Cần mảng LỒNG mảng, JSON sâu', 'mảng chỉ một tầng, giá trị là chuỗi', '13.1'],
      ['Số thực, ngày giờ, tiền', '<code>$(( ))</code> chỉ số nguyên', '6.1'],
      ['Xử lý từng dòng dữ liệu lớn', 'đọc từng dòng chậm 30–2.800×', '13.3'],
      ['Thử lại, timeout, nhiều loại lỗi', 'chỉ có mã thoát 0–255', '7.3'],
      ['Chạy cả Mac bash 3.2 lẫn Linux', 'nửa chương này không có trên 3.2', '13.x'],
      ['&gt; ~100 dòng, logic rẽ nhánh nhiều', 'Google: “viết lại bằng ngôn ngữ có cấu trúc”', '—'],
    ], { sm: true, center: [2] }),
    `${cards([
      { ic: '🐚', t: 'Giữ bash', d: 'nối lệnh có sẵn: <code>docker</code>, <code>git</code>, <code>rsync</code>, <code>systemctl</code> — bash chỉ quyết định thứ tự', c: 'grn' },
      { ic: '🐍', t: 'Sang Python', d: 'tính toán, phân tích JSON/CSV, gọi API có thử lại, test đơn vị', c: 'blu' },
      { ic: '🤝', t: 'Kết hợp', d: '<code>ds=$(python3 tinh.py)</code> — bash điều phối, Python tính', c: 'amb' },
    ], 1)}`, 'l') },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Trên Mac: bash 3.2 thiếu gần hết chương này', body: two(
    table(['Tính năng', 'Có từ bash', 'Mac /bin/bash 3.2 (đo thật)'], [
      ['<code>declare -A</code>, <code>mapfile</code>, <code>coproc</code>', '4.0', '-invalid option / command not found'],
      ['<code>exec {fd}&gt;f</code>', '4.1', '-exec: {log}: not found'],
      ["<code>printf '%(%F)T'</code>, <code>lastpipe</code>", '4.2', '-invalid format character'],
      ['<code>wait -n</code>, <code>declare -n</code>, <code>${a[-1]}</code>', '4.3', '-invalid option / bad array subscript'],
      ['<code>inherit_errexit</code>, <code>mapfile -d</code>', '4.4', '-invalid shell option name'],
      ['<code>$EPOCHREALTIME</code>', '5.0', '!RỖNG — không báo lỗi'],
      ['<code>wait -p</code>, <code>m=(k v k v)</code>', '5.1', '-wait: -p: invalid option'],
      ['<code>${ lệnh; }</code> không fork', '5.3', '-bad substitution (cả Ubuntu 5.2)'],
      ["<code>read -r -d ''</code>, <code>printf -v</code>, <code>&lt;(…)</code>", '≤ 3.2', '+chạy được'],
    ], { sm: true, center: [1] }),
    `${term(['$ ssh linux-nha bash --version | head -1', 'GNU bash, version 5.3.9(1)-release', "$ x=${ echo hi; }; echo $x   # Fedora 44", '= hi', '10.000 × $(printf x)      6.107 s', '+ 10.000 × ${ printf x; }   0.112 s', '10.000 × printf -v         0.022 s'], { title: 'Fedora 44 — bash 5.3: thay thế lệnh không fork', fs: 13.5 })}
    ${box('tip', 'Script cho cả Mac: <code>brew install bash</code> + <code>#!/usr/bin/env bash</code>, và kiểm đầu script: <code>(( BASH_VERSINFO[0] &gt;= 5 )) || die "cần bash 5"</code>. BSD <code>xargs</code> có <code>-P -0 -n</code> như GNU.')}`, 'l') },

  { t: 'Sai lầm hay gặp ở Chương 13', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Mọi khoá cùng một giá trị', 'quên <code>declare -A</code> ⇒ mảng chỉ số, khoá = 0', '<code>declare -A</code> (trong hàm: <code>-gA</code>)'],
    ['Mảng rỗng sau <code>cmd | mapfile</code>', 'mapfile chạy trong shell con của ống', '<code>mapfile -t a &lt; &lt;(cmd)</code>'],
    ['Script <code>set -e</code> chết ở <code>(( n++ ))</code>', 'biểu thức = 0 ⇒ mã 1 (đo: mã=1)', '<code>n=$((n + 1))</code> hoặc <code>(( ++n ))</code>'],
    ['Script mất 30 giây cho 20.000 dòng', '<code>$( … | awk )</code> trong vòng lặp', 'MỘT awk cho cả file'],
    ['<code>xargs -P8</code> không nhanh hơn', 'thiếu <code>-n1</code>/<code>-n N</code>: một lần gọi nhận hết', '<code>xargs -0 -n1 -P8</code>'],
    ['Hàng đợi báo xong mà có việc hỏng', '<code>wait</code> trần trả 0', '<code>wait -n -p pid</code> + gom mã'],
    ['<code>&lt;&lt;-EOF</code>: unexpected end of file', 'thụt bằng dấu cách, không phải TAB', "TAB, hoặc bỏ thụt / <code>&lt;&lt;'EOF'</code>"],
    ['Chạy được trên VPS, Mac báo <code>invalid option</code>', '<code>/bin/bash</code> của Mac là 3.2', 'bash 5 từ Homebrew, kiểm <code>BASH_VERSINFO</code>'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 13 (1/2): mảng và luồng', body: two(
    sh([
      ['a=(x "y z"); a+=(w)', 'tạo · nối thêm'],
      ['"${a[@]}"  ${#a[@]}  "${!a[@]}"', 'mọi phần tử · số · chỉ số'],
      ['${a[-1]}  "${a[@]:1:2}"', 'cuối · lát cắt'],
      ["unset 'a[1]'", 'để lại lỗ'],
      ['declare -A m=([k]=v); m[k2]=v2', 'mảng kết hợp'],
      ['[[ -v m[k] ]]', 'có khoá chưa'],
      ["mapfile -t a < f  |  -d '' -O -n -s", 'file → mảng'],
      ['local -n ref=$1', 'nameref: mảng vào hàm'],
      ['declare -i -l -u -r -g  |  declare -p', 'thuộc tính · in ra'],
      ['(IFS=,; echo "${a[*]}")', 'nối bằng dấu phẩy'],
    ], { fs: 13.5 }),
    sh([
      ['exec {fd}>>f … exec {fd}>&-', 'fd tự cấp số'],
      ['3>&1 1>&2 2>&3 3>&-', 'đổi chỗ out/err'],
      ['{ e=$(f 2>&1 1>&3 3>&-); } 3>&1', 'hứng riêng stderr'],
      ['diff <(sort a) <(sort b)', 'lệnh → tên file'],
      ['tee >(gzip > x.gz) > x', 'một nguồn, hai đích'],
      ["<<'EOF'  <<-EOF  <<< \"$s\"", 'heredoc · here-string'],
      ['mkfifo p; cmd > p & read < p', 'ống có tên'],
      ['coproc N { cmd; }; ${N[0]} ${N[1]}', 'tiến trình hai chiều'],
      ["while IFS= read -r -d '' f", 'đi với -print0'],
      ['shopt -s lastpipe', 'khâu cuối ống ở shell cha'],
    ], { fs: 13.5 })) },

  { t: 'Bảng tra nhanh Chương 13 (2/2): tốc độ và chuyên nghiệp', body: two(
    sh([
      ['${f##*/} ${f%/*} ${f/a/b}', 'thay basename/dirname/sed'],
      ["printf -v now '%(%F %T)T' -1", 'thay $(date)'],
      ['(( n = i + 1 ))', 'thay $(expr)'],
      ["awk '{s+=$10} END{print s}' f", 'một lần cho cả file'],
      ['xargs -0 -n1 -P"$(nproc)" cmd', 'song song có giới hạn'],
      ['wait -n -p pid; rc=$?', 'việc nào xong, mã gì'],
      ['parallel -k -j4 --joblog j.tsv', 'GNU parallel'],
      ['time cmd  |  TIMEFORMAT=%R', 'real / user / sys'],
      ["hyperfine -w1 -N 'a' 'b'", 'so hai lệnh, nhiều lượt'],
      ['$EPOCHREALTIME  $EPOCHSECONDS', 'đồng hồ trong bash 5'],
    ], { fs: 13.5 }),
    sh([
      ["getopts ':nvd:h-:' opt", 'ngắn + dài (--x=y)'],
      ['shopt -s inherit_errexit', '-e trong $( )'],
      ['trap on_err ERR + FUNCNAME/BASH_LINENO', 'stack trace'],
      ['[[ -t 2 ]]', 'stderr là terminal?'],
      ['exec {lk}>f.lock; flock -n "$lk"', 'một bản mỗi lúc'],
      ['bats -p test/   run  $status $output', 'kiểm thử'],
      ['PATH="$BIN:$PATH" run …', 'lệnh giả trong test'],
      ['LC_ALL=C.UTF-8 shellcheck -f gcc f', 'lint'],
      ['shfmt -d -i 2 -ci f  |  -w', 'xem diff · ghi'],
      ['(( BASH_VERSINFO[0] >= 5 ))', 'đòi bash 5'],
    ], { fs: 13.5 })) },

  { t: 'Thực hành Chương 13 (45 phút): công cụ báo cáo log', body: `
    ${steps([
      ['Trong container <code>ubuntu:24.04</code>: sinh <code>access.log</code> 200.000 dòng; <code>top-ip.sh</code> đếm IP bằng <code>declare -A</code> rồi bằng <code>awk</code>', 'hai cách in cùng 5 dòng; <code>hyperfine</code> cho thấy awk nhanh hơn ≥ 10×'],
      ['Nhận danh sách file log qua <code>find -print0</code> + <code>mapfile -d \'\'</code>; thử với tên có dấu cách và xuống dòng', '<code>${#ds[@]}</code> đúng số file thật'],
      ['Nén các log bằng <code>xargs -0 -n1 -P"$(nproc)"</code>; đo <code>time</code> có và không có <code>-n1</code>', '<code>user &gt; real</code> ở bản song song'],
      ['Thêm <code>getopts \':nvh-:\'</code> (<code>--dry-run</code>, <code>--top=N</code>), log có mức ra stderr, <code>trap on_err ERR</code> in stack trace', 'cờ lạ ⇒ mã 2; lệnh hỏng ⇒ có dòng “tại …()”'],
      ['4 test <code>bats</code> (help, cờ lạ, dry-run, lệnh giả hỏng); <code>shellcheck</code> + <code>shfmt -d</code> sạch; thử <code>/bin/bash</code> trên Mac', 'ghi lại dòng đầu tiên vỡ trên bash 3.2'],
    ])}
    ${box('good', '<b>Đạt khi:</b> <code>bats test/</code> 4/4, <code>shellcheck</code> sạch, bản song song nhanh ≥ 3× (máy ≥ 4 nhân).')}` },
]).map((s) => (s.kind === 'cover' ? s : { ...s, body: s.body + FIX }));
