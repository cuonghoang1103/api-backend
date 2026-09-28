/**
 * Linux & Bash · Deck lx-07 — Chương 7: Viết script cho production.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 28/09/2026:
 *   • "Ubuntu" = container ubuntu:24.04 (24.04.5, bash 5.2.21, dash là /bin/sh, util-linux flock, ShellCheck 0.9.0),
 *                arm64, người dùng `an`. Script mẫu deploy.sh (bài 7.5) chạy với `docker` giả (một file `exit 0`)
 *                và một kho git sạch trong /srv/app — chỉ để chế độ --dry-run đi hết đường.
 *   • "Mac"    = Mac M1, macOS 27, /bin/bash 3.2.57, mktemp/sed/df kiểu BSD, không có flock/timeout.
 * Ctrl-C được giả lập bằng `kill -INT -- -PGID` (gửi SIGINT tới CẢ nhóm tiến trình, đúng như terminal làm) trong
 * một shell bật `set -m`; không có `set -m` thì tiến trình nền của shell không tương tác BỎ QUA SIGINT.
 *
 * Hình tự vẽ (SVG nội tuyến, không đụng thư viện): annot() chép từ lx-01/lx-03; trapSvg() — sáu cách một script
 * chết và bẫy nào chạy (đo thật); fdLock() — khoá flock nằm ở fd, tiến trình con thừa kế fd.
 */
import { S, cover, sh, term, mindmap, diagram, cards, box, steps, table, two, flow, list, sv, R, T, A, D, esc } from './_lx-chung.mjs';

export const deck = { key: 'lx-07', code: 'LINUX · CHƯƠNG 7', title: 'Viết script cho production', sub: 'Linux & Bash · Chương 7' };

const MONO = 'SF Mono,Menlo,monospace';
const c = (k) => D[k] || k;

/** annot(str, segs, opts) — chép từ lx-01: chữ đơn cách + ngoặc màu + nhãn dưới từng đoạn [from, to). */
const annot = (str, segs, { fs = 40, w = 1150, rowH = 60, y0 = 56, h } = {}) => {
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

/* Slide 14 — script chết giữa chừng: bẫy nào chạy? (sáu hàng, ba làn ERR · INT · EXIT) */
const trapSvg = () => {
  const rows = [
    ['chạy tới dòng cuối', 'bình thường', [0, 0, 1], '0', 'grn'],
    ['exit 1 / die', 'tự thoát sớm', [0, 0, 1], '1', 'grn'],
    ['lệnh hỏng + set -e', 'curl, false, mv…', [1, 0, 1], 'mã lệnh', 'amb'],
    ['Ctrl-C', 'SIGINT cả nhóm', [0, 2, 1], '130', 'amb'],
    ['kill · systemctl stop', 'SIGTERM', [0, 0, 1], '143', 'amb'],
    ['kill -9 · OOM killer', 'SIGKILL', [0, 0, 0], '137', 'red'],
  ];
  const X = { ev: 10, err: 470, int: 640, exit: 810, rc: 1000 };
  let s = '';
  // tiêu đề làn
  [['err', 'trap … ERR', 'red'], ['int', 'trap … INT', 'vio'], ['exit', 'trap … EXIT', 'grn']].forEach(([k, t, col]) => {
    s += R(X[k] - 68, 4, 136, 36, { c: col, fill: 'rgba(255,255,255,.03)', r: 8 }) + T(X[k], 28, t, { fs: 15, a: 'middle', mono: true, b: true, c: col });
    s += `<line x1="${X[k]}" y1="42" x2="${X[k]}" y2="400" stroke="${c(col)}" stroke-width="2" stroke-dasharray="3 6" opacity=".45"/>`;
  });
  s += T(X.ev + 10, 28, 'Script chết vì…', { fs: 16, b: true, c: 'mu' }) + T(X.rc + 70, 28, 'mã thoát', { fs: 16, b: true, c: 'mu', a: 'middle' });
  rows.forEach(([t, d, fire, rc, col], i) => {
    const y = 64 + i * 58;
    s += R(X.ev, y, 300, 46, { c: col, r: 9 }) + T(X.ev + 14, y + 21, t, { fs: 16, b: true, mono: true }) + T(X.ev + 14, y + 39, d, { fs: 13, c: 'mu' });
    const ends = fire[2] ? X.exit : (fire[1] ? X.int : X.rc - 10);
    s += `<path d="M${X.ev + 300} ${y + 23} L${X.rc - 6} ${y + 23}" stroke="${c(col)}" stroke-width="3" fill="none" marker-end="url(#m-${col})" opacity="${fire.some(Boolean) ? 1 : .9}"${fire.some(Boolean) ? '' : ' stroke-dasharray="8 6"'}/>`;
    [['err', 'red'], ['int', 'vio'], ['exit', 'grn']].forEach(([k, kc], j) => {
      const f = fire[j];
      if (f === 1) s += `<circle cx="${X[k]}" cy="${y + 23}" r="13" fill="${c(kc)}"/>` + T(X[k], y + 28, '✓', { fs: 15, a: 'middle', b: true, c: '#0a0f0c' });
      else if (f === 2) s += `<circle cx="${X[k]}" cy="${y + 23}" r="13" fill="#0a0f0c" stroke="${c(kc)}" stroke-width="3"/>` + T(X[k], y + 28, '?', { fs: 15, a: 'middle', b: true, c: kc });
      else if (k === 'exit' && col === 'red') s += T(X[k], y + 29, '✗', { fs: 22, a: 'middle', b: true, c: 'red' });
    });
    s += R(X.rc, y + 5, 140, 36, { c: col, r: 8, fill: '#050806' }) + T(X.rc + 70, y + 29, rc, { fs: 16, a: 'middle', mono: true, b: true, c: col });
    void ends;
  });
  s += T(X.int, 414, '? = chỉ khi bạn có bẫy INT — và nó PHẢI exit', { fs: 14, a: 'middle', c: 'vio' });
  s += T(X.rc + 70, 414, 'thư mục tạm sót lại', { fs: 14, a: 'middle', c: 'red' });
  return sv(1150, 424, s);
};

/* Slide 18 — khoá flock nằm ở fd 9; tiến trình con thừa kế fd */
const fdLock = () => {
  let s = '';
  s += R(20, 30, 250, 90, { c: 'grn', r: 12 }) + T(145, 64, 'khoa.sh (PID 3222)', { fs: 16, a: 'middle', mono: true, b: true }) + T(145, 92, 'exec 9>/tmp/sao-luu.lock', { fs: 14, a: 'middle', mono: true, c: 'mu' });
  s += R(20, 190, 250, 80, { c: 'amb', r: 12 }) + T(145, 224, 'sleep 2 (con, PID 3225)', { fs: 16, a: 'middle', mono: true, b: true }) + T(145, 250, 'thừa kế fd 9', { fs: 14, a: 'middle', c: 'amb' });
  s += A(145, 120, 145, 186, { c: 'amb' }) + T(158, 158, 'fork', { fs: 14, c: 'amb', mono: true });
  s += R(430, 110, 280, 96, { c: 'lx', r: 12, fill: 'rgba(245,183,0,.08)' }) + T(570, 148, 'khoá trong NHÂN', { fs: 18, a: 'middle', b: true, c: 'lx' }) + T(570, 176, 'gắn với file đang MỞ', { fs: 15, a: 'middle', c: 'mu' });
  s += A(270, 75, 428, 140, { c: 'grn' }) + T(330, 90, 'fd 9', { fs: 14, c: 'grn', mono: true, b: true });
  s += A(270, 230, 428, 180, { c: 'amb' }) + T(330, 228, 'fd 9', { fs: 14, c: 'amb', mono: true, b: true });
  s += R(820, 110, 310, 96, { c: 'dim', r: 12, dash: true }) + T(975, 148, '/tmp/sao-luu.lock', { fs: 16, a: 'middle', mono: true }) + T(975, 176, 'file RỖNG — chỉ là cái tên', { fs: 14, a: 'middle', c: 'mu' });
  s += `<path d="M710 158 L818 158" stroke="${D.dim}" stroke-width="2" stroke-dasharray="6 6"/>`;
  s += T(575, 262, 'Khoá chỉ nhả khi MỌI fd trỏ tới nó đều đóng:', { fs: 15, a: 'middle', c: 'tx', b: true });
  s += T(575, 286, 'kill -9 bash cha mà sleep con còn sống ⇒ vẫn bị khoá', { fs: 15, a: 'middle', c: 'red' });
  return sv(1150, 296, s);
};


/* Slide 10 — chuỗi đặc tả của getopts: mỗi ký tự một nhãn, nhãn xếp đều một hàng bên dưới */
const specSvg = () => {
  const str = 'getopts ":vo:fh" opt', fs = 34, cw = fs * 0.602, w = 1150;
  const x0 = Math.round((w - str.length * cw) / 2), y0 = 46;
  const cols = { 9: 'vio', 10: 'grn', 11: 'lx', 12: 'lx', 13: 'tea', 14: 'tea', 17: 'blu', 18: 'blu', 19: 'blu' };
  let s = R(x0 - 18, y0 - fs - 4, str.length * cw + 36, fs + 22, { c: 'bd', fill: '#050806', r: 10, sw: 2 });
  [...str].forEach((ch, i) => { s += `<text x="${(x0 + i * cw).toFixed(1)}" y="${y0}" font-size="${fs}" fill="${c(cols[i] || '#e6edf3')}" font-family="${MONO}" font-weight="700">${esc(ch)}</text>`; });
  const labs = [
    [9, 10, ': ở đầu', 'im lặng — BẠN tự in lỗi', 'vio'],
    [10, 11, 'v', 'cờ bật/tắt', 'grn'],
    [11, 13, 'o:', 'cần giá trị → $OPTARG', 'lx'],
    [13, 15, 'f  h', 'thêm hai cờ bật/tắt', 'tea'],
    [17, 20, 'opt', 'chữ cái vừa đọc', 'blu'],
  ];
  labs.forEach(([f, t, name, d, col], k) => {
    const a = x0 + f * cw + 2, b = x0 + t * cw - 2, mid = (a + b) / 2, lx = 115 + k * 230, ly = 118;
    s += `<path d="M${a} ${y0 + 14} L${a} ${y0 + 20} L${b} ${y0 + 20} L${b} ${y0 + 14}" stroke="${c(col)}" stroke-width="3" fill="none"/>`;
    s += `<path d="M${mid} ${y0 + 20} L${mid} ${y0 + 34} L${lx} ${ly - 30} L${lx} ${ly - 20}" stroke="${c(col)}" stroke-width="2" fill="none" stroke-dasharray="4 4"/>`;
    s += T(lx, ly, name, { fs: 18, a: 'middle', b: true, c: col, mono: true }) + T(lx, ly + 22, d, { fs: 14.5, a: 'middle', c: 'mu' });
  });
  return sv(w, 150, s);
};

export const slides = S([
  cover({ t: 'Chương 7 — Viết script cho production', sub: 'Khung script · tham số &amp; kiểm tra · trap &amp; dọn dẹp · gỡ lỗi · một script hoàn chỉnh', chap: 'CHƯƠNG 7' }),

  { t: 'Bản đồ chương: script chạy lúc 3 giờ sáng, không ai trông', body: mindmap('Script production', 'hoặc làm trọn, hoặc dừng và nói rõ vì sao', [
    { t: '7.1 Bộ khung', d: 'shebang · set -Eeuo pipefail · bẫy của -e · cd hỏng · CRLF', c: 'lx' },
    { t: '7.2 Cửa trước', d: '$@ · shift · getopts · while/case · -- · usage', c: 'grn' },
    { t: '7.2 Kiểm trước khi làm', d: 'giá trị · điều kiện tiên quyết · run() --dry-run', c: 'tea' },
    { t: '7.3 Dọn dẹp', d: 'trap EXIT/ERR/INT · mktemp · flock · chạy lại không hỏng', c: 'blu' },
    { t: '7.4 Gỡ lỗi', d: 'set -x · PS4 · bash -n · shellcheck · env -i', c: 'vio' },
    { t: '7.5 Script hoàn chỉnh', d: '9 khối · stdout = dữ liệu · stderr = log · smoke test', c: 'amb' },
  ]) },

  /* ───────────── 7.1 ───────────── */
  { t: 'Bộ khung chuẩn: mỗi dòng đầu chặn một kiểu hỏng', body: sh([
    ['#!/usr/bin/env bash', 'tìm bash qua PATH (bash 5 của Homebrew)'],
    ['# deploy.sh — dựng và triển khai ứng dụng', 'dòng 2–3 cũng là phần trợ giúp'],
    ['# Cách dùng: deploy.sh [-n] <staging|production>', ''],
    ['set -Eeuo pipefail', 'E: ERR vào hàm · e u pipefail'],
    ["IFS=$'\\n\\t'", 'bỏ dấu cách khỏi dấu tách từ'],
    ['SCRIPT_DIR=$(dirname "$(readlink -f "$0")")', 'thư mục THẬT (qua symlink)'],
    ["log() { printf '%s %s\\n' \"$(date +%T)\" \"$*\" >&2; }", 'log ra stderr, không bẩn stdout'],
    ['die() { log "LỖI: $*"; exit 1; }', 'dừng kèm lời nhắn + mã ≠ 0'],
    ['cleanup() { rm -rf "${tmpdir:-}"; }', 'dọn dẹp — ${:-} an toàn với -u'],
    ['trap cleanup EXIT', 'chạy khi thoát vì BẤT KỲ lý do gì'],
    ['main() {', 'thân script nằm trong hàm…'],
    ['  local env=${1:?thiếu môi trường}', 'thiếu tham số ⇒ dừng + lời nhắn'],
    ['  log "deploy lên $env"', ''],
    ['}', ''],
    ['main "$@"', '…và chỉ chạy khi cả file đã đọc xong'],
  ], { fs: 15.5 }) },

  { t: 'Shebang chọn trình thông dịch — /bin/sh trên Ubuntu là dash', body: `
    ${diagram({ w: 1160, h: 150, nodes: [
      { id: 'k', x: 0, y: 30, w: 230, h: 80, t: './deploy.sh', d: 'nhân đọc 2 byte đầu #!', c: 'lx', mono: true },
      { id: 'e', x: 320, y: 30, w: 250, h: 80, t: '/usr/bin/env bash', d: 'tra "bash" trong PATH', c: 'grn', mono: true },
      { id: 'b', x: 660, y: 0, w: 230, h: 60, t: 'bash 5.2 (Ubuntu)', c: 'grn' },
      { id: 'm', x: 660, y: 86, w: 230, h: 60, t: 'bash 3.2 (Mac /bin)', c: 'amb' },
      { id: 's', x: 950, y: 30, w: 210, h: 80, t: '#!/bin/sh', d: 'Ubuntu → dash', c: 'red', mono: true },
    ], edges: [{ from: 'k', to: 'e', c: 'lx' }, { from: 'e', to: 'b', c: 'grn' }, { from: 'e', to: 'm', c: 'amb' }] })}
    ${two(
      term(['$ ls -l /bin/sh', 'lrwxrwxrwx 1 root root 4 Mar 31  2024 /bin/sh -> dash', '$ ./sh-sai.sh           # #!/bin/sh mà viết [[ ]] và ${ten^^}', '! ./sh-sai.sh: 2: [[: not found', '! ./sh-sai.sh: 4: Bad substitution', '$ bash sh-sai.sh        # cùng file, gọi bằng bash', '= co HOME', '= AN'], { title: 'Ubuntu 24.04 — output thật', fs: 14 }),
      table(['Dòng đầu', 'Khi nào dùng'], [
        ['+<code>#!/usr/bin/env bash</code>', 'mặc định cho script bash'],
        ['<code>#!/bin/bash</code>', 'được trên Linux; trên Mac là bash <b>3.2</b> (2007)'],
        ['-<code>#!/bin/sh</code>', 'chỉ khi viết đúng POSIX: không <code>[[</code>, mảng, <code>local</code>'],
        ['<code>bash deploy.sh</code>', 'bỏ qua shebang — cần biết khi gỡ lỗi'],
      ], { sm: true }), 'l')}` },

  { t: 'Strict mode: mỗi cờ chặn một kiểu hỏng', body: two(
    table(['Cờ', 'Không có nó thì…', 'Có nó thì…'], [
      ['<code>-e</code> errexit', '-lệnh hỏng, script cứ chạy tiếp dòng sau', '+dừng ở lệnh hỏng đầu tiên'],
      ['<code>-u</code> nounset', '-<code>$PREFX</code> gõ sai = chuỗi rỗng ⇒ <code>rm -rf "/data"</code>', '+<code>PREFX: unbound variable</code>, mã 1'],
      ['<code>-o pipefail</code>', '-<code>false | cat</code> báo thành công', '+ống hỏng nếu BẤT KỲ khâu nào hỏng'],
      ['<code>-E</code> errtrace', '-<code>trap … ERR</code> câm trong hàm', '+ERR nổ cả trong hàm và <code>$( )</code>'],
      ["<code>IFS=$'\\n\\t'</code>", 'biến quên nháy bị chẻ theo dấu cách', '!<code>"$*"</code> nối bằng XUỐNG DÒNG (7.5)'],
    ], { sm: true }),
    `${term(['$ cat u.sh', 'PREFIX=/srv/app', 'set -u', 'echo rm -rf "$PREFX/data"', '$ bash u.sh; echo "mã=$?"', '! u.sh: line 3: PREFX: unbound variable', 'mã=1', '$ bash -c \'false | cat; echo "mã=$?"\'', '+ mã=0', '$ bash -c \'set -o pipefail; false | cat; echo "mã=$?"\'', '= mã=1'], { title: 'Ubuntu 24.04 — output thật', fs: 14 })}
    ${box('tip', 'Cần biến có thể vắng? Viết <code>${VAR:-mặc-định}</code>. Cần bắt buộc? <code>${VAR:?thiếu VAR}</code> — lời nhắn tự in.')}`, 'l') },

  { t: 'set -e KHÔNG dừng ở những chỗ này — đo từng ca', body: two(
    table(['Ca (mỗi dòng một bash -c riêng)', 'Kết quả thật'], [
      ['<code>false</code> đứng một mình', '-DỪNG (mã 1)'],
      ['<code>if false; then …; fi</code>', '+chạy tiếp'],
      ['<code>false || echo cứu</code>', '+chạy tiếp'],
      ['<code>false &amp;&amp; echo x</code>', '+chạy tiếp'],
      ['<code>false | cat</code> (không pipefail)', '+chạy tiếp'],
      ['<code>x=$(false)</code>', '-DỪNG (mã 1)'],
      ['<code>local x=$(false)</code> trong hàm', '!chạy tiếp — local che mã'],
      ['<code>readonly y=$(false)</code> · <code>export z=$(false)</code>', '!chạy tiếp — cũng che'],
      ['<code>if f</code> — hàm f có <code>false</code> bên trong', '!chạy tiếp — -e TẮT trong cả hàm'],
      ['<code>echo "$(false; echo hi)"</code>', '!in hi, chạy tiếp'],
    ], { sm: true }),
    `${sh([['local out', 'khai báo'], ['out=$(curl -sf "$url")', 'gán riêng ⇒ -e hoạt động']], { fs: 15, so: false })}
    ${term(['$ bash -c \'set -e', '  f(){ [[ -n "" ]] && echo x; }', '  f; echo SAU-f\'; echo "mã=$?"', '! mã=1          # SAU-f không bao giờ in'], { title: 'Ubuntu — && ở CUỐI hàm thành mã trả về', fs: 14 })}
    ${box('warn', 'Coi <code>set -e</code> là lưới đỡ, không phải khiên. Chỗ quan trọng vẫn viết <code>|| die "…"</code> tường minh.')}`, 'l') },

  { t: 'cd hỏng trong chuỗi &amp;&amp;: cả chuỗi bị bỏ, script vẫn báo xong', body: `
    ${diagram({ w: 1160, h: 130, nodes: [
      { id: 'c', x: 0, y: 25, w: 230, h: 80, t: 'cd /srv/ap', d: 'gõ thiếu chữ p ⇒ mã 1', c: 'red', mono: true },
      { id: 'g', x: 300, y: 25, w: 200, h: 80, t: 'git pull', d: 'BỎ QUA', c: 'dim', mono: true, dash: true },
      { id: 'd', x: 570, y: 25, w: 250, h: 80, t: 'docker compose up', d: 'BỎ QUA', c: 'dim', mono: true, dash: true },
      { id: 'e', x: 900, y: 25, w: 260, h: 80, t: 'echo "Deploy xong ✔"', d: 'VẪN CHẠY — mã 0', c: 'amb', mono: true },
    ], edges: [{ from: 'c', to: 'g', t: '&&', c: 'red', off: -14 }, { from: 'g', to: 'd', t: '&&', c: 'dim', off: -14 }, { from: 'd', to: 'e', t: 'dòng sau', c: 'amb', off: -14 }] })}
    ${two(
      term(['$ cat deploy-cu.sh', 'set -euo pipefail', 'cd /srv/ap && git pull && docker compose up -d', 'echo "Deploy xong ✔"', '$ ./deploy-cu.sh; echo "mã thoát: $?"', '! ./deploy-cu.sh: line 3: cd: /srv/ap: No such file or directory', '+ Deploy xong ✔', '+ mã thoát: 0'], { title: 'Ubuntu — set -e không cứu: lệnh hỏng nằm TRONG chuỗi &&', fs: 13.5 }),
      `${sh([['cd /srv/ap || die "không vào được /srv/ap"', 'chặn ngay tại cd'], ['git pull', 'mỗi bước một dòng'], ['docker compose up -d', '⇒ -e bắt được từng bước']], { fs: 14.5, so: false })}
      ${box('bad', 'Bản <code>;</code> còn tệ hơn: <code>cd /srv/ap/tmp; rm -rf ./*</code> — cd hỏng, <code>rm</code> chạy ở thư mục HIỆN TẠI. Thử thật: chỉ còn sót <code>.env</code> (glob <code>*</code> bỏ qua file chấm).')}`, 'l')}` },

  { t: 'Script từ Windows: $\'\\r\': command not found', body: two(
    `${term(['$ ./crlf2.sh', "! /usr/bin/env: 'bash\\r': No such file or directory", '$ bash crlf2.sh', "! crlf2.sh: line 2: $'\\r': command not found", "! crlf2.sh: line 3: cd: $'/tmp\\r': No such file or directory", '$ file crlf2.sh', '+ …shell script, ASCII text executable, with CRLF line terminators', '$ cat -A crlf2.sh | head -2', '#!/usr/bin/env bash^M$', '^M$'], { title: 'Ubuntu — file tạo trên Windows (CRLF), dựng lại thật', fs: 13.5 })}`,
    `${steps([
      ['Windows kết thúc dòng bằng <code>\\r\\n</code>', 'bash coi <code>\\r</code> là một phần của chữ: <code>bash\\r</code>, <code>/tmp\\r</code>'],
      ['Nhận ra', '<code>file x.sh</code> in “with CRLF”; <code>cat -A</code> hiện <code>^M$</code>'],
      ['Sửa file', "<code>sed -i 's/\\r$//' deploy.sh</code> (hoặc <code>dos2unix</code>)"],
      ['Chặn tận gốc trong git', '<code>.gitattributes</code>: <code>*.sh text eol=lf</code>'],
    ])}
    <div style="height:8px"></div>${term(['# checkout lại với core.autocrlf=true', '$ git ls-files --eol a.sh', 'i/lf    w/lf    attr/text eol=lf      a.sh'], { title: 'Ubuntu — .gitattributes thắng autocrlf', fs: 13 })}`, 'l') },

  /* ───────────── 7.2 ───────────── */
  { t: '"$@" giữ nguyên từng tham số — $@ trần chẻ tên có dấu cách', body: two(
    table(['Ký hiệu', 'Nghĩa'], [
      ['<code>$0</code>', 'tên script như lúc được gọi'],
      ['<code>$1</code> … <code>$9</code>, <code>${10}</code>', 'tham số thứ n'],
      ['<code>$#</code>', 'số tham số'],
      ['+<code>"$@"</code>', 'TỪNG tham số, nguyên vẹn — dùng cái này'],
      ['<code>"$*"</code>', 'mọi tham số dính thành MỘT chuỗi'],
      ['<code>shift</code> · <code>shift 2</code>', 'bỏ $1 (hai cái đầu), dồn phần còn lại lên'],
      ['<code>$?</code> · <code>$$</code> · <code>$!</code>', 'mã lệnh trước · PID script · PID job nền'],
    ], { sm: true }),
    term(['$ ./pos.sh staging "bao cao.txt" x', '$0=./pos.sh  $#=3  $1=staging  $2=bao cao.txt', '+ "$@" → [staging] [bao cao.txt] [x]', '"$*" → [staging bao cao.txt x]', '! $@  → [staging] [bao] [cao.txt] [x]', 'sau shift: $1=bao cao.txt $#=2'], { title: 'Ubuntu 24.04 — ba cách viết, ba kết quả', fs: 15 }), 'l') },

  { t: 'getopts ":vo:fh": mỗi ký tự trong chuỗi là một luật', body: `
    ${specSvg()}
    ${two(
      term(['$ ./go.sh -vf -o kq.txt a.log b.log', 'OPTIND=4', 'verbose=1 output=kq.txt force=1', 'còn lại (2): a.log b.log', '$ ./go.sh -z; echo "mã=$?"', '! cờ lạ: -z', 'mã=2', '$ ./go.sh -o', '! cờ -o cần giá trị'], { title: 'Ubuntu — gộp -vf miễn phí', fs: 14 }),
      `${term(['$ ./go.sh a.log -v', 'OPTIND=1', '! verbose=0 output=không force=0', 'còn lại (2): a.log -v'], { title: 'getopts DỪNG ở tham số đầu không phải cờ', fs: 14 })}
      ${box('warn', 'Quên <code>shift $((OPTIND - 1))</code> ⇒ <code>"$@"</code> vẫn chứa <code>-v -o kq.txt</code>. getopts chỉ hiểu cờ NGẮN; bản nâng cao ở Chương 13.')}`, 'l')}` },

  { t: 'Cờ dài: vòng while/case + shift, và -- để kết thúc cờ', body: two(
    sh([
      ['while [[ $# -gt 0 ]]; do', 'còn tham số thì còn đọc'],
      ['  case $1 in', ''],
      ['    -n|--dry-run) dry_run=1; shift ;;', 'cờ bật/tắt: bỏ 1'],
      ['    -t|--tag) tag=${2:?--tag cần giá trị}', 'thiếu $2 ⇒ dừng'],
      ['              shift 2 ;;', 'cờ có giá trị: bỏ 2'],
      ['    --tag=*) tag=${1#*=}; shift ;;', 'dạng --tag=v1.4'],
      ['    --) shift; break ;;', 'hết cờ từ đây'],
      ['    -*) die "cờ lạ: $1" ;;', 'gõ nhầm ⇒ báo'],
      ['    *) env=$1; shift ;;', 'tham số thường'],
      ['  esac', ''],
      ['done', ''],
    ], { fs: 14.5 }),
    term(['$ ./dai.sh --tag=v1.4 -n production', 'env=production tag=v1.4 dry_run=1 còn:', '$ ./dai.sh -t v2 staging -- -rf', '+ env=staging tag=v2 dry_run=0 còn: -rf', '$ ./dai.sh --tag', '! ./dai.sh: line 7: 2: --tag cần giá trị', '$ ./dai.sh --tag v1', '! ./dai.sh: line 14: env: thiếu môi trường', '$ ./dai.sh --force x; echo "mã=$?"', '! cờ lạ: --force', 'mã=2'], { title: 'Ubuntu 24.04 — output thật', fs: 14 }), 'l') },

  { t: 'Bốn cửa: phân tích → kiểm giá trị → tiền kiểm → mới làm', body: `
    ${flow([
      { e: '1', t: 'Phân tích', d: 'getopts / while-case', c: 'grn' },
      { e: '2', t: 'Kiểm giá trị', d: 'enum · số · định dạng · đường dẫn', c: 'tea' },
      { e: '3', t: 'Tiền kiểm', d: 'lệnh có chưa · file đọc được · đĩa trống', c: 'blu' },
      { e: '4', t: 'Làm việc', d: 'chỉ tới đây mới đụng hệ thống', c: 'amb' },
    ])}
    ${two(
      sh([
        ['case $env in staging|production) ;;', 'enum: case rõ nhất'],
        ['  *) die "môi trường sai: $env" ;; esac', ''],
        ['[[ $port =~ ^[0-9]+$ ]] || die "port: $port"', 'số'],
        ['[[ $tag =~ ^v[0-9]+\\.[0-9]+\\.[0-9]+$ ]] || die …', 'định dạng v1.2.3'],
        ['command -v docker >/dev/null || die "thiếu docker"', 'lệnh có chưa'],
        ['[[ -r .env.$env ]] || die "không đọc được"', 'file'],
        ['[[ -z $(git status --porcelain) ]] || die …', 'kho sạch'],
      ], { fs: 13.5 }),
      box('good', 'Hỏng ở cửa 1–3 thì hệ thống <b>chưa bị đụng tới</b>: sửa lỗi rồi chạy lại là xong. Hỏng ở bước 7/9 của cửa 4 thì ảnh đã dựng, CSDL đã migrate, còn nginx chưa chuyển — phải ngồi gỡ tay.'), 'l2')}` },

  { t: 'run() + --dry-run: in ra đúng thứ SẼ chạy', body: `${two(
    sh([
      ['run() {', ''],
      ['  if (( dry_run )); then', ''],
      ["    local IFS=' '", 'nối "$*" bằng dấu cách'],
      ["    printf '[dry-run] %s\\n' \"$*\" >&2", 'chỉ IN, ra stderr'],
      ['  else "$@"; fi', 'CHẠY — giữ nguyên từng tham số'],
      ['}', ''],
      ['run docker build -t "myapp:$tag" .', 'mọi lệnh có hậu quả…'],
    ], { fs: 14.5 }),
    box('tip', 'Đọc script của người khác? Chạy <code>--dry-run</code> rồi đọc danh sách lệnh — chắc hơn đọc mã rồi tưởng tượng. Dùng <code>"$@"</code>, đừng ghép chuỗi rồi <code>eval</code>.'), 'l2')}
    <div style="height:10px"></div>${term(['$ ./deploy.sh --dry-run --tag v1.4 production 2>&1 | grep dry-run', '[dry-run] docker build -t ghcr.io/cuonghoang1103/myapp:v1.4 /srv/app', '[dry-run] docker push ghcr.io/cuonghoang1103/myapp:v1.4', "[dry-run] ssh vps docker pull 'ghcr.io/cuonghoang1103/myapp:v1.4' &&     docker compose -p myapp up -d --no-build backend", '[dry-run] curl https://cuongthai.com/api/v1/posts'], { title: 'Ubuntu — script bài 7.5 (bản đã sửa), docker giả', fs: 13.5 })}` },

  /* ───────────── 7.3 ───────────── */
  { t: 'Script chết giữa chừng: bẫy nào chạy, mã thoát bao nhiêu?', body: `${trapSvg()}
    ${box('info', 'Đo thật trên Ubuntu với <code>trap … EXIT</code> xoá thư mục <code>mktemp -d</code>: năm cách chết đầu đều dọn sạch; <code>kill -9</code> để lại đúng 1 thư mục. 130 = 128 + 2 (SIGINT), 143 = 128 + 15, 137 = 128 + 9.')}` },

  { t: 'Bẫy INT mà quên exit: Ctrl-C xong script CHẠY TIẾP', body: two(
    `${sh([
      ["trap 'echo \"bắt Ctrl-C\" >&2' INT", '✗ không exit'],
      ["trap 'echo \"dọn dẹp\" >&2' EXIT", ''],
      ['sleep 30', 'Ctrl-C giết sleep…'],
      ['echo "SAU sleep: vẫn chạy tiếp!"', '…rồi CHẠY dòng này'],
    ], { fs: 14.5 })}
    ${term(['== int.sh  (bẫy INT không exit)', '+ SAU sleep: script vẫn chạy tiếp!', 'INT: đã bắt Ctrl-C', 'EXIT: dọn dẹp', '! mã thoát: 0', "== int2.sh (trap '…; exit 130' INT)", 'INT: đã bắt Ctrl-C, thoát 130', 'EXIT: dọn dẹp', '= mã thoát: 130'], { title: 'Ubuntu — SIGINT tới cả nhóm, như Ctrl-C', fs: 14 })}`,
    `${sh([
      ['cleanup() {', ''],
      ['  local rc=$?', 'BẮT MÃ Ở DÒNG ĐẦU'],
      ['  trap - ERR', 'đừng để ERR nổ trong cleanup'],
      ['  rm -rf "${tmpdir:-}"', '${:-}: chưa gán vẫn an toàn'],
      ['  [[ -n ${cid:-} ]] && docker rm -f "$cid"', 'dọn thứ 2, thứ 3…'],
      ['  (( rc )) && log "hỏng, mã $rc"', ''],
      ['  return "$rc"', 'giữ nguyên mã thoát'],
      ['}', ''],
      ['trap cleanup EXIT', 'MỘT dòng phủ 5/6 cách chết'],
    ], { fs: 14.5 })}
    ${box('warn', 'Chết vì tín hiệu thì <code>$?</code> trong bẫy EXIT KHÔNG phải 130/143 — đo thật in 0. Muốn biết chết vì tín hiệu gì ⇒ bẫy riêng INT/TERM.')}`) },

  { t: 'mktemp: tên không đoán được, quyền 600 — đừng /tmp/x.$$', body: two(
    term(['$ mktemp', '/tmp/tmp.hfamqMRWWR', '$ mktemp -d', '/tmp/tmp.SoezcrBq9w', '$ mktemp -t deploy.XXXXXX', '/tmp/deploy.7cdXsE', '$ mktemp -p ~', '/home/an/tmp.0Z2HEjiUVW', '$ ls -ld "$f" "$d"', '+ -rw------- 1 an an    0 Sep 28 10:18 /tmp/tmp.0PJYxxJKeo', '+ drwx------ 2 an an 4096 Sep 28 10:18 /tmp/tmp.5VKZkmv2EW', '$ mktemp /tmp/sai', "! mktemp: too few X's in template '/tmp/sai'"], { title: 'Ubuntu 24.04 (GNU coreutils 9.4)', fs: 14 }),
    `${table(['Cách viết', 'GNU (Ubuntu)', 'BSD (macOS)'], [
      ['<code>mktemp</code>', '/tmp/tmp.XXXXXXXXXX', '$TMPDIR/tmp.XXXXXXXXXX'],
      ['<code>mktemp -d</code>', 'thư mục, quyền 700', 'như nhau'],
      ['<code>mktemp -t deploy.XXXXXX</code>', '+/tmp/deploy.7cdXsE', '-…/T/deploy.XXXXXX.r1Borxn1Pc'],
      ['<code>mktemp -t deploy</code>', "-lỗi: too few X's", '+…/T/deploy.Y9g8MaxW1R'],
      ['<code>mktemp -p DIR</code>', 'trong DIR', 'có (macOS 27)'],
    ], { sm: true })}
    ${box('bad', '<code>/tmp/backup.$$</code>: PID đoán được, <code>/tmp</code> ai cũng ghi. Kẻ khác tạo trước tên đó thành symlink tới file của bạn ⇒ script ghi đè nó bằng quyền của bạn (CWE-377).')}
    ${box('tip', 'Viết chạy được cả hai: <code>mktemp "${TMPDIR:-/tmp}/deploy.XXXXXX"</code> — đường dẫn đầy đủ, X ở cuối.')}`, 'l') },

  { t: 'trap ERR chỉ vào được trong hàm khi có set -E', body: two(
    `${sh([
      ['#!/usr/bin/env bash', ''],
      ['set -${CO:-e}uo pipefail', 'thử hai bản: -e và -Ee'],
      ["trap 'echo \"ERR: dòng $LINENO, mã $?: $BASH_COMMAND\" >&2' ERR", ''],
      ['tai_ve() {', ''],
      ['  curl -sSf --max-time 3 "http://127.0.0.1:19070/khong-co"', 'ERR báo đúng dòng 5 này'],
      ['}', ''],
      ['main() { echo "bắt đầu"; tai_ve; echo "xong"; }', 'lỗi xảy ra TRONG hàm'],
      ['main "$@"', ''],
    ], { fs: 13.5 })}
    ${box('info', '<code>$LINENO</code> và <code>$BASH_COMMAND</code> phải nằm trong nháy ĐƠN: nháy kép khai triển ngay lúc đặt bẫy ⇒ mọi lỗi báo cùng một dòng.')}`,
    `${term(['# bản 1: set -euo pipefail', '$ ./err.sh; echo "mã=$?"', 'bắt đầu', 'curl: (7) Failed to connect to 127.0.0.1 port 19070 …', '! mã=7      # chết câm: không dòng ERR nào', '# bản 2: set -Eeuo pipefail', '$ CO=Ee ./err.sh; echo "mã=$?"', 'bắt đầu', 'curl: (7) Failed to connect to 127.0.0.1 port 19070 …', '+ ERR: dòng 5, mã 7: curl -sSf --max-time 3 "http://…"', 'mã=7'], { title: 'Ubuntu 24.04 — output thật', fs: 13 })}
    ${box('warn', 'Script đặt mọi thứ trong <code>main()</code> mà thiếu <code>-E</code> thì bẫy ERR KHÔNG BAO GIỜ nổ. Bản cũ của bài 7.5 dính đúng lỗi này.')}`, 'r') },

  { t: 'flock: khoá nằm ở fd đang mở — kể cả của tiến trình con', body: `${fdLock()}
    ${two(
      sh([
        ['exec 9>/tmp/sao-luu.lock', 'mở fd 9 (Bài 3.1)'],
        ['flock -n 9 || { echo "đang chạy" >&2; exit 0; }', '-n: không chờ'],
        ['# … việc …  khoá tự nhả khi thoát', ''],
        ['flock -w 30 /tmp/x.lock cmd', 'chờ tối đa 30 giây'],
        ['*/5 * * * * flock -n /tmp/s.lock /srv/sync.sh', 'dạng một dòng cho cron'],
      ], { fs: 13.5 }),
      term(['$ ./khoa.sh & sleep 0.3; ./khoa.sh', '[3205] giữ khoá, làm việc 2 giây', '+ [3209] đang có bản khác chạy — bỏ qua', '[3205] xong', '$ ./khoa.sh & sleep 0.3; kill -9 $!; ./khoa.sh', '[3222] giữ khoá, làm việc 2 giây', '! [3228] đang có bản khác chạy — bỏ qua', '= lấy được khoá   # 2 giây sau, khi sleep con chết'], { title: 'Ubuntu — util-linux flock', fs: 13.5 }), 'l')}` },

  { t: 'Chạy hai lần không hỏng: kiểm rồi mới làm', body: two(
    table(['Không bền (lần 2 hỏng/nhân đôi)', 'Bền khi chạy lại'], [
      ['-<code>mkdir /srv/app/data</code>', '+<code>mkdir -p /srv/app/data</code>'],
      ['-<code>echo "$dong" &gt;&gt; ~/.bashrc</code>', '+<code>grep -qxF "$dong" f || echo "$dong" &gt;&gt; f</code>'],
      ['-<code>useradd deploy</code>', '+<code>id -u deploy &amp;&gt;/dev/null || useradd …</code>'],
      ['-<code>ln -s bản-mới current</code>', '+<code>ln -sfn bản-mới current</code>'],
      ['-<code>cp app.conf /etc/…</code>', '+<code>install -m 644 app.conf /etc/…</code>'],
      ['-<code>mv "$tmp"/* /srv/backups/$(date +%F)/</code>', '+<code>mkdir -p</code> đích trước rồi mới <code>mv</code>'],
    ], { sm: true }),
    `${term(['# bản cũ của bài 7.3', '$ ./backup.sh', "! mv: target '/srv/backups/2026-09-28/': No such file…", '! ERROR at line 25: mv "$tmpdir"/*.{sql,tar.gz} …', 'backup failed (1)', '# thêm: mkdir -p "/srv/backups/$(date +%F)"', '$ ./backup.sh', '= backup complete'], { title: 'Ubuntu — lỗi thật khi chạy lại bài cũ', fs: 13 })}
    ${box('good', 'Mẫu chung: <b>kiểm trạng thái → chỉ làm khi còn thiếu</b>. Script bền thì deploy hỏng cứ chạy lại, 5 giây thay vì một buổi điều tra.')}`, 'l') },

  /* ───────────── 7.4 ───────────── */
  { t: 'set -x in lệnh SAU khai triển; PS4 thêm file:dòng:hàm', body: two(
    term(['$ bash -x dbg.sh staging', '+ + set -euo pipefail', '+ + deploy staging', '+ + local env=staging', '+ + local tag=latest', '+ + [[ -f .env.staging ]]', "+ + echo 'deploy myapp:latest lên staging'", 'deploy myapp:latest lên staging', '# dòng vàng = vệt trace trên stderr'], { title: 'Ubuntu — PS4 mặc định "+ ": không biết đang ở đâu', fs: 14 }),
    `${sh([["export PS4='+ ${BASH_SOURCE##*/}:${LINENO}:${FUNCNAME[0]:-main}: '", '']], { fs: 13, so: false })}
    ${term(['$ bash -x dbg.sh production', '+ + dbg.sh:9:main: deploy production', '+ + dbg.sh:4:deploy: local env=production', '+ + dbg.sh:5:deploy: local tag=latest', '+ + dbg.sh:6:deploy: [[ -f .env.production ]]', "+ + dbg.sh:6:deploy: echo 'thiếu .env.production'", 'thiếu .env.production', '! + dbg.sh:6:deploy: return 1'], { title: 'Ubuntu — cùng script, PS4 có vị trí', fs: 14 })}
    ${table(['Cách bật', 'Dùng khi'], [['<code>bash -x f.sh</code>', 'không sửa file'], ['<code>[[ ${DEBUG:-0} == 1 ]] &amp;&amp; set -x</code>', 'bật bằng biến môi trường'], ['<code>local -; set -x</code>', 'chỉ trong một hàm, tự tắt khi return']], { sm: true })}`, 'l') },

  { t: 'Năm bậc gỡ lỗi trước khi rắc echo', body: two(
    steps([
      ['<code>shellcheck f.sh</code>', 'tìm cả lớp lỗi mà không chạy gì — 1 giây'],
      ['<code>bash -n f.sh</code>', 'chỉ kiểm cú pháp: thiếu fi/done/nháy'],
      ['<code>bash -x f.sh</code> + PS4 tốt', 'nhìn lệnh THẬT sau khai triển'],
      ["<code>trap '…$LINENO…' ERR</code> + <code>set -E</code>", 'script chết câm ⇒ biết dòng nào'],
      ['<code>env -i PATH=/usr/bin:/bin ./f.sh</code>', '“tay chạy được, cron hỏng”'],
    ]),
    `${term(['$ cat -n n.sh', '     2  if [[ -n "$1" ]]; then', '     3    echo "co tham so"', '     4  for f in *.log; do', '     5    echo "$f"', '     6  done', '$ bash -n n.sh; echo "mã=$?"', '! n.sh: line 7: syntax error: unexpected end of file', 'mã=2'], { title: 'Ubuntu — báo dòng 7, lỗi thật ở dòng 3 (thiếu fi)', fs: 14 })}
    ${box('info', '<code>bash -n</code> không chạy dòng nào — như <code>tsc --noEmit</code> của shell. “unexpected end of file” = thiếu <code>fi</code>/<code>done</code>/<code>}</code>/nháy đóng ở ĐÂU ĐÓ phía trên.')}`, 'l') },

  { t: 'ShellCheck đọc ra những lỗi mắt không thấy', body: two(
    term(['$ shellcheck sc.sh', 'In sc.sh line 3:', 'rm -rf $tmpdir/*', '!        ^-------^ SC2115 (warning): Use "${var:?}" to ensure', '!        this never expands to /* .', 'In sc.sh line 5:', '  local out=$(curl -s "$1")', '!        ^-^ SC2155 (warning): Declare and assign separately…', 'In sc.sh line 8:', 'for f in $(ls *.log); do', '!          ^---------^ SC2045 (error): Iterating over ls output…', 'In sc.sh line 11:', 'cd /srv/app', "! ^---------^ SC2164 (warning): Use 'cd ... || exit' …", 'In sc.sh line 12:', 'if [ $count > 5 ]; then echo nhieu; fi', '!             ^-- SC2071 (error): > is for string comparisons.'], { title: 'Ubuntu — ShellCheck 0.9.0 (cắt bớt)', fs: 13 }),
    `${table(['Mã', 'Lỗi', 'Học ở'], [
      ['SC2086', 'biến không bọc nháy', 'Bài 6.2'],
      ['SC2115', '<code>rm -rf $d/*</code> có thể thành <code>/*</code>', 'Bài 6.3'],
      ['SC2155', '<code>local x=$(…)</code> che mã', 'Bài 7.1'],
      ['SC2164', '<code>cd</code> không có <code>|| exit</code>', 'Bài 7.1'],
      ['SC2045', 'lặp trên output của <code>ls</code>', 'Bài 6.5'],
      ['SC2071', '<code>&gt;</code> trong <code>[ ]</code> là chuyển hướng/so chuỗi', 'Bài 6.4'],
    ], { sm: true })}
    ${sh([['sudo apt install shellcheck', 'brew install shellcheck trên Mac'], ['# shellcheck disable=SC2086  # lý do…', 'tắt 1 luật, GHI lý do']], { fs: 13.5, so: false })}`, 'l') },

  { t: 'Tay chạy được, cron hỏng: env -i tái hiện môi trường trống', body: two(
    term(['$ ./cron-thu.sh', 'HOME=/home/an PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:…', '= OK', '$ env -i PATH=/usr/bin:/bin ./cron-thu.sh; echo "mã=$?"', 'HOME=<rỗng> PATH=/usr/bin:/bin', '! ./cron-thu.sh: line 4: pg_dump: command not found', 'mã=127', '$ env -i HOME=/home/an PATH=/usr/local/bin:/usr/bin:/bin ./cron-thu.sh', '= OK'], { title: 'Ubuntu — pg_dump nằm ở /usr/local/bin', fs: 13.5 }),
    `${cards([
      { ic: '🧭', t: 'PATH ngắn', d: 'cron: <code>/usr/bin:/bin</code> ⇒ đặt PATH ở đầu script hoặc gọi đường dẫn tuyệt đối', c: 'amb' },
      { ic: '📂', t: 'Thư mục khác', d: '<code>cd "$SCRIPT_DIR"</code> hoặc dùng đường dẫn tuyệt đối (Bài 1.2)', c: 'blu' },
      { ic: '🔑', t: 'Không có biến của bạn', d: 'nạp từ file: <code>set -a; . /opt/app/.env; set +a</code>', c: 'grn' },
      { ic: '🙊', t: 'set -x lộ bí mật', d: 'trace in <code>Bearer 12345</code> ra log — đừng trace khối có token', c: 'red' },
    ], 2)}`, 'l') },

  /* ───────────── 7.5 ───────────── */
  { t: 'Script hoàn chỉnh = 9 khối, mỗi khối là một bài đã học', body: two(
    table(['#', 'Khối', 'Làm gì', 'Bài'], [
      ['1', '!<code>set -Eeuo pipefail</code> · IFS', 'hỏng thì dừng, ERR vào được hàm', '7.1'],
      ['2', 'hằng số <code>readonly</code>', 'SCRIPT_DIR · LOCKFILE · REGISTRY', '7.1'],
      ['3', '<code>log/info/warn/die</code>', 'mọi lời nhắn ra stderr', '7.4'],
      ['4', '<code>cleanup</code> + <code>trap EXIT/ERR</code>', 'dọn dẹp mọi cách chết', '7.3'],
      ['5', '<code>run()</code> + <code>usage()</code>', 'hỗ trợ <code>--dry-run</code> và <code>--help</code>', '7.2'],
      ['6', '<code>parse_args</code>', 'while/case, kiểm enum + tag', '7.2'],
      ['7', '<code>preflight</code>', 'docker · git sạch · .env · chặn latest→prod', '7.2'],
      ['8', '<code>flock</code>', 'hai người không deploy cùng lúc', '7.3'],
      ['9', '+build → release → smoke_test', 'kiểm KẾT QUẢ, không kiểm các bước', '7.5'],
    ], { sm: true, center: [0, 3] }),
    `${box('info', 'Khung này ~150 dòng vì <code>docker</code>, <code>git</code>, <code>ssh</code>, <code>curl</code> làm việc thật — bash chỉ quyết định thứ tự, kiểm điều kiện và báo cáo. Đó là việc bash giỏi nhất.')}
    ${box('good', 'Chính sách thành dòng mã: <code>production</code> + <code>latest</code> ⇒ <code>die</code>. Thứ “không được xảy ra” thành thứ “không THỂ xảy ra”.')}`, 'l') },

  { t: 'stdout mang giá trị, stderr mang log — nên $(…) hứng sạch', body: `
    ${diagram({ w: 1160, h: 170, nodes: [
      { id: 'f', x: 0, y: 40, w: 280, h: 90, t: 'build_and_push', d: 'info … >&2\nprintf "$image"', c: 'lx', mono: true },
      { id: 'o', x: 430, y: 0, w: 300, h: 64, t: 'stdout (fd 1)', d: 'ghcr.io/…/myapp:v1.4', c: 'grn' },
      { id: 'e', x: 430, y: 104, w: 300, h: 64, t: 'stderr (fd 2)', d: 'log + [dry-run] …', c: 'amb' },
      { id: 'v', x: 850, y: 0, w: 310, h: 64, t: 'image=$(build_and_push)', c: 'grn', mono: true },
      { id: 't', x: 850, y: 104, w: 310, h: 64, t: 'màn hình / journal', c: 'amb' },
    ], edges: [{ from: 'f', to: 'o', c: 'grn' }, { from: 'f', to: 'e', c: 'amb' }, { from: 'o', to: 'v', c: 'grn', t: 'hứng', off: -12 }, { from: 'e', to: 't', c: 'amb', t: 'người đọc', off: -12 }] })}
    ${term(['$ ./deploy.sh --dry-run --tag v1.4 production', '10:20:12 [INFO] building ghcr.io/cuonghoang1103/myapp:v1.4', '[dry-run] docker build -t ghcr.io/cuonghoang1103/myapp:v1.4 /srv/app', '10:20:12 [INFO] releasing to vps', "[dry-run] ssh vps docker pull 'ghcr.io/cuonghoang1103/myapp:v1.4' &&     docker compose -p myapp up -d --no-build backend", '10:20:12 [INFO] smoke-testing https://cuongthai.com/api/v1/posts', '= 10:20:12 [INFO] deployed v1.4 to production'], { title: 'Ubuntu — bản đã sửa, docker giả, kho git sạch (cắt bớt)', fs: 13 })}` },

  { t: 'Chạy lại bản cũ lộ hai lỗi thật: IFS và thiếu -E', body: two(
    `${term(['$ ./deploy-cu.sh --dry-run --tag v1.4 production', '10:19:48 [INFO] building ghcr.io/cuonghoang1103/myapp:v1.4', '! [dry-run] docker', '! build', '! -t', '! ghcr.io/cuonghoang1103/myapp:v1.4', '! /srv/app', "# \"$*\" nối bằng ký tự ĐẦU của IFS = xuống dòng"], { title: 'Ubuntu — lỗi 1: [dry-run] vỡ thành từng dòng', fs: 13.5 })}
    ${sh([["local IFS=' '", 'sửa: trong run(), trước printf']], { fs: 14, so: false })}`,
    `${term(['# .env.production thiếu DEPLOY_HOST', '$ ./deploy-cu.sh -n -t v1.4 production', '…', '! 10:20:12 [WARN] deploy failed with exit code 1', '# chết câm: không biết dòng nào', '# bản sửa: set -Eeuo pipefail', '$ ./deploy.sh -n -t v1.4 production', '…', '+ 10:20:23 [ERROR] line 117: cut -d= -f2', "+ 10:20:23 [ERROR] line 117: host=$(grep -m1 … | cut -d= -f2)", '10:20:23 [WARN] deploy failed with exit code 1'], { title: 'Ubuntu — lỗi 2: bẫy ERR không vào main()', fs: 13 })}
    ${box('good', 'Sửa: <code>set -Eeuo pipefail</code> + <code>trap - ERR</code> ở đầu <code>cleanup</code>. Bài học: chạy thật mới thấy — đọc mã 10 lần vẫn lọt.')}`) },

  { t: 'Khi nào thôi dùng bash — và 7 mục kiểm trước khi commit', body: two(
    `${table(['Dấu hiệu', 'Vì sao bash yếu'], [
      ['Dữ liệu lồng nhau, JSON', 'mảng một chiều, không lồng'],
      ['Số thập phân', '<code>$(( ))</code> chỉ có số nguyên'],
      ['Thử lại có giãn cách, nhiều loại lỗi', 'không có exception'],
      ['&gt; ~300 dòng, nhiều hàm', 'một phạm vi toàn cục phẳng'],
      ['Điều phối nhiều worker', '<code>&amp;</code> + <code>wait</code> là hết mức'],
    ], { sm: true })}
    ${box('tip', 'Giữ điều phối ở bash, chuyển phần TÍNH sang chương trình bash gọi: <code>manifest=$(python3 build_manifest.py)</code>.')}`,
    steps([
      ['<code>shellcheck</code> sạch', 'mọi <code>disable</code> có ghi lý do'],
      ['<code>bash -n</code> im lặng', ''],
      ['<code>--help</code> có ví dụ', ''],
      ['Tham số sai / thiếu lệnh ⇒ mã ≠ 0 + lời nhắn', ''],
      ['Chạy hai lần không hỏng', ''],
      ['Ctrl-C giữa chừng: không sót file tạm, không kẹt khoá', ''],
      ['Thử với tên <code>\'a b.txt\'</code>, <code>\'-rf\'</code>, <code>\'*\'</code>', ''],
    ]), 'l') },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Trên Mac: bash 3.2, mktemp và sed kiểu BSD, không có flock', body: two(
    table(['Thứ trong chương', 'Ubuntu / WSL2', 'macOS (đo thật)'], [
      ['<code>/bin/bash --version</code>', '5.2.21', '!3.2.57 (2007)'],
      ['<code>${ten^^}</code>', 'AN', '-bad substitution'],
      ['<code>declare -A</code>', 'có', '-declare: -A: invalid option'],
      ['<code>readlink -f</code>', 'có', '+có (macOS ≥ 12.3)'],
      ['<code>flock</code> · <code>timeout</code>', 'có (util-linux · coreutils)', '-not found'],
      ["<code>sed 's/^# \\?//'</code>", 'bỏ “# ”', '-không bỏ (BSD không hiểu <code>\\?</code>)'],
      ['<code>df --output=avail</code>', 'có', '-unrecognized option'],
      ['<code>mktemp -t deploy.XXXXXX</code>', '/tmp/deploy.7cdXsE', '-giữ nguyên XXXXXX + đuôi lạ'],
    ], { sm: true }),
    `${term(['$ /bin/bash mac1.sh', '! mac1.sh: line 3: ${ten^^}: bad substitution', '! mac1.sh: line 4: declare: -A: invalid option', 'ok', '$ echo "# Usage: x" | sed -E "s/^# ?//"', '= Usage: x'], { title: 'Mac M1 — macOS 27, zsh gọi /bin/bash', fs: 14 })}
    ${box('tip', 'Script chạy cả hai nơi: <code>sed -E</code> thay <code>\\?</code>, không dùng <code>^^</code>/<code>-A</code>, hoặc <code>brew install bash</code> rồi để <code>#!/usr/bin/env bash</code> tìm bash 5. WSL2 là Ubuntu thật — giống hệt VPS.')}`, 'l') },

  { t: 'Sai lầm hay gặp ở Chương 7', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Báo “Deploy xong” mà chẳng có gì đổi', '<code>cd</code> hỏng trong chuỗi <code>&amp;&amp;</code> — -e không áp', '<code>cd … || die</code>, mỗi bước một dòng'],
    ["<code>$'\\r': command not found</code>", 'file lưu CRLF trên Windows', "<code>sed -i 's/\\r$//'</code> + <code>.gitattributes</code>"],
    ['<code>[[: not found</code>, Bad substitution', 'shebang <code>#!/bin/sh</code> = dash', '<code>#!/usr/bin/env bash</code>'],
    ['Lỗi trong hàm mà <code>set -e</code> không dừng', '<code>local x=$(…)</code> / hàm gọi trong <code>if</code>', 'khai báo và gán hai dòng'],
    ['Script chết câm, không biết dòng nào', 'bẫy ERR thiếu <code>set -E</code>', '<code>set -Eeuo pipefail</code>'],
    ['File <code>-v</code> “không tồn tại”', 'quên <code>shift $((OPTIND-1))</code>', 'shift sau vòng getopts'],
    ['/tmp đầy thư mục <code>tmp.*</code>', 'dọn ở dòng cuối thay vì trong trap', '<code>mktemp -d</code> + <code>trap … EXIT</code> ngay dòng sau'],
    ['Cron chồng 5 bản backup, máy treo', 'không có khoá', '<code>flock -n</code>'],
    ['Log production lộ token', 'quên <code>set -x</code>', 'bật bằng <code>${DEBUG:-0}</code>, không trace khối bí mật'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 7 (1/2): khung, tham số, kiểm tra', body: two(
    sh([
      ['#!/usr/bin/env bash', 'shebang khả chuyển'],
      ['set -Eeuo pipefail', 'strict mode đủ 4 cờ'],
      ["IFS=$'\\n\\t'", 'nhớ local IFS=\' \' khi in "$*"'],
      ['local x; x=$(cmd)', 'không che mã lỗi'],
      ['cmd || true', 'cho phép hỏng, CÓ CHỦ Ý'],
      ['cd "$d" || die "…"', 'không để cd hỏng im lặng'],
      ['readlink -f "$0"', 'đường dẫn thật của script'],
      ['main "$@"', 'chạy khi cả file đã đọc'],
      ["sed -i 's/\\r$//' f.sh", 'bỏ CRLF'],
    ], { fs: 14.5 }),
    sh([
      ['"$@"  $#  $0  $1  shift', 'tham số vị trí'],
      ['while getopts ":vo:h" o; do', 'cờ ngắn, : đầu = im lặng'],
      ['shift $((OPTIND - 1))', 'BẮT BUỘC sau getopts'],
      ['while [[ $# -gt 0 ]]; do case', 'cờ dài --tag / --tag='],
      ['${2:?--tag cần giá trị}', 'kiểm + báo trong 1 dòng'],
      ['--) shift; break ;;', 'hết cờ'],
      ['command -v jq >/dev/null', 'lệnh có chưa (≠ which)'],
      ['[[ $p =~ ^[0-9]+$ ]]', 'kiểm định dạng'],
      ['run() { … "$@"; }', '--dry-run'],
    ], { fs: 14.5 })) },

  { t: 'Bảng tra nhanh Chương 7 (2/2): dọn dẹp, khoá, gỡ lỗi', body: two(
    sh([
      ['trap cleanup EXIT', 'mọi cách chết trừ kill -9'],
      ["trap '…$LINENO $BASH_COMMAND' ERR", 'báo dòng hỏng (nháy ĐƠN)'],
      ["trap '…; exit 130' INT", 'bẫy INT phải exit'],
      ['trap -p · trap - EXIT', 'xem · gỡ bẫy'],
      ['tmp=$(mktemp -d)', 'quyền 700, tên ngẫu nhiên'],
      ['exec 9>f.lock; flock -n 9', 'một bản chạy mỗi lúc'],
      ['flock -n f.lock cmd', 'dạng cho crontab'],
      ['mkdir -p · ln -sfn · grep -qxF ||', 'chạy lại không hỏng'],
    ], { fs: 14.5 }),
    sh([
      ['bash -n f.sh', 'chỉ kiểm cú pháp'],
      ['bash -x f.sh', 'trace sau khai triển'],
      ["PS4='+ ${BASH_SOURCE##*/}:${LINENO}: '", 'trace có vị trí'],
      ['[[ ${DEBUG:-0} == 1 ]] && set -x', 'bật bằng biến'],
      ['local -; set -x', 'trace trong 1 hàm'],
      ['shellcheck -S warning f.sh', 'lint trước commit'],
      ['env -i PATH=/usr/bin:/bin ./f.sh', 'giả môi trường cron'],
      ['file f.sh · cat -A f.sh', 'soi CRLF'],
    ], { fs: 14.5 })) },

  { t: 'Thực hành Chương 7 (45 phút): gia cố backup.sh của nhóm', body: `
    ${steps([
      ['Viết <code>backup.sh</code> từ bộ khung, trong container <code>ubuntu:24.04</code>', 'shebang · set -Eeuo pipefail · log/die · main "$@" — bash -n và shellcheck sạch'],
      ['Nhận <code>-n/--dry-run</code>, <code>-k/--keep N</code> và một thư mục nguồn; sai thì mã 2 + lời nhắn', 'thử <code>--keep</code> thiếu giá trị, <code>--keep abc</code>, cờ lạ'],
      ['<code>mktemp -d</code> + <code>trap cleanup EXIT</code>; nén nguồn vào đó rồi <code>mv</code> sang <code>~/backups/$(date +%F)</code>', 'Ctrl-C giữa chừng: <code>ls -d /tmp/tmp.*</code> không tăng'],
      ['Thêm <code>flock -n</code>; chạy hai bản cùng lúc', 'bản thứ hai in “đang chạy” và thoát 0'],
      ['Đổi file sang CRLF bằng <code>sed -i \'s/$/\\r/\'</code>, xem lỗi, sửa lại; rồi chạy dưới <code>env -i PATH=/usr/bin:/bin</code>', 'đọc ra được lỗi <code>$\'\\r\'</code> và chạy lại được'],
    ])}
    ${box('good', '<b>Đạt khi:</b> chạy 2 lần liên tiếp không hỏng, <code>--dry-run</code> không tạo file nào, và mọi cách thoát (xong / sai tham số / Ctrl-C) đều không để lại thư mục tạm.')}` },
]);
