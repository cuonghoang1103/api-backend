/**
 * Deploy lên VPS · Deck dv-07 — Chương 7: Script deploy (hỏng thật to, chạy hai lần vẫn an toàn).
 *
 * MỌI output terminal MỚI trên slide là output THẬT, chạy 29/09/2026 trên "VPS thí nghiệm" (hợp đồng mục 7b):
 *   • container ubuntu:24.04 `dv07-vps` (arm64, Docker Desktop trên Mac M1), --memory 512m, sshd, người dùng
 *     `deploy`, SSH từ Mac qua 127.0.0.1:19072 bằng khoá tạo trong thư mục nháp.
 *   • phần mềm: GNU bash 5.2.21, git 2.43.0, curl 8.5, Node v18.19.1, ShellCheck 0.9.0, util-linux flock, procps pgrep.
 *   • "đĩa" /srv/dia = tmpfs 1300 MB (--tmpfs) để đo df -BG làm tròn lên mà không đụng đĩa thật.
 *   • ứng dụng thử app.mjs ở 127.0.0.1:3340: /health 200, /api/v1/don 401, /api/v1/tin 401, còn lại 404, /cham trả sau 5 s.
 *   • hai phép đo phía máy dev chạy trên Mac (macOS 27): df -BG không có, date +%3N không hiểu, không có flock(1).
 * Output CŨ của chương (bảng cờ, local x=$(), 5 dòng PATH, lời hỏi [y/N], xh 3.022 ms, nhánh hỏng A–E) chép NGUYÊN
 * VĂN từ bài học.
 *
 * Hình tự vẽ (SVG nội tuyến): idemSvg() ba lần chạy → trạng thái · banLeSvg() chuẩn bị / tráo / kiểm chứng ·
 * vungMaSvg() năm bước của script và bốn vùng mã thoát · symlinkSvg() cú lùi trả con trỏ mà không trả tiến trình.
 */
import { S, cover, sh, term, mindmap, cards, box, table, vs, kpis, flow, two, sv, R, T, A, D } from './_dv-chung.mjs';

export const deck = { key: 'dv-07', code: 'DEPLOY · CHƯƠNG 7', title: 'Script deploy', sub: 'Deploy lên VPS · Chương 7' };

const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15px}.c-t.sm td,.c-t.sm th{padding:6px 10px}' +
  '.c-flow .f small{font-size:14px}.c-kpis .k b{font-size:40px}</style>';

/* ─────────── Slide 9: idempotent = trạng thái cuối chỉ theo tham số ─────────── */
const idemSvg = () => {
  let s = '';
  const hang = (y, ten, mau, trangThai, nhan) => {
    s += T(0, y + 34, ten, { fs: 17, b: true, c: mau });
    s += T(0, y + 58, nhan, { fs: 14, c: 'mu' });
    trangThai.forEach((tt, i) => {
      const x = 250 + i * 300;
      if (i) s += A(x - 62, y + 45, x - 8, y + 45, { c: mau });
      s += T(x - 36, y + 34, `lần ${i + 1}`, { fs: 13, c: 'dim', a: 'middle' });
      s += R(x, y, 230, 92, { c: mau, fill: '#0b1220', r: 10 });
      tt.forEach((ln, k) => { s += T(x + 14, y + 26 + k * 20, ln, { fs: 13.5, mono: true, c: k === tt.length - 1 && tt.length > 1 && mau === 'red' ? 'red' : 'tx' }); });
    });
  };
  hang(20, 'Nối thêm (>>)', 'red', [
    ['moi-truong:', '  PATH=/opt/…'],
    ['moi-truong:', '  PATH=/opt/…', '  PATH=/opt/…'],
    ['moi-truong:', '  PATH=/opt/… ×3', '  (mã thoát vẫn 0)'],
  ], 'mỗi lần chạy thêm một dòng');
  hang(170, 'Sinh lại cả tệp (>)', 'grn', [
    ['moi-truong:', '  PATH=/opt/…'],
    ['moi-truong:', '  PATH=/opt/…'],
    ['moi-truong:', '  PATH=/opt/…'],
  ], 'lần 2, lần 3 = lần 1');
  s += T(0, 312, 'Idempotent KHÔNG có nghĩa "lần hai không làm gì" — nghĩa là trạng thái cuối chỉ phụ thuộc THAM SỐ.', { fs: 16, b: true, c: 'amb' });
  s += T(0, 338, 'Đổi tham số (v1 → v2) thì trạng thái PHẢI đổi theo: tính chất hay bị quên đem đi kiểm.', { fs: 15, c: 'mu' });
  return sv(1150, 350, s);
};

/* ─────────── Slide 10: chuẩn bị ở bên lề → tráo → kiểm chứng ─────────── */
const banLeSvg = () => {
  let s = '';
  const y = 40;
  s += R(0, y, 560, 110, { c: 'blu', fill: 'rgba(88,166,255,.07)' });
  s += T(20, y + 32, 'CHUẨN BỊ ở bên lề', { fs: 18, b: true, c: 'blu' });
  s += T(20, y + 60, 'bung · cài · dựng · hâm nóng · migration an toàn', { fs: 15, c: 'tx' });
  s += T(20, y + 88, 'hỏng ở đây ⇒ người dùng KHÔNG thấy gì', { fs: 15, c: 'grn', b: true });
  s += R(590, y, 190, 110, { c: 'amb', fill: 'rgba(245,183,0,.08)' });
  s += T(685, y + 40, 'TRÁO', { fs: 20, b: true, c: 'amb', a: 'middle' });
  s += T(685, y + 68, 'rename(2)', { fs: 15, c: 'tx', a: 'middle', mono: true });
  s += T(685, y + 92, 'một thao tác', { fs: 14, c: 'mu', a: 'middle' });
  s += R(810, y, 340, 110, { c: 'vio', fill: 'rgba(167,139,250,.08)' });
  s += T(830, y + 32, 'KIỂM CHỨNG', { fs: 18, b: true, c: 'vio' });
  s += T(830, y + 60, 'sẵn sàng · kiểm khói · cửa trước', { fs: 15, c: 'tx' });
  s += T(830, y + 88, 'hỏng ⇒ trap lùi (7.5)', { fs: 15, c: 'red', b: true });
  s += A(562, y + 55, 586, y + 55, { c: 'dim' }) + A(782, y + 55, 806, y + 55, { c: 'dim' });
  s += `<path d="M0 ${y + 140} L1150 ${y + 140}" stroke="${D.dim}" stroke-width="2"/>`;
  s += T(0, y + 166, 'symlink hien-tai: trỏ bản CŨ ────────────────────────────', { fs: 14, c: 'blu', mono: true });
  s += T(700, y + 166, '→ bản MỚI', { fs: 14, c: 'grn', mono: true });
  return sv(1150, 216, s);
};

/* ─────────── Slide 23: năm bước của script và các vùng mã thoát ─────────── */
const vungMaSvg = () => {
  let s = '';
  const o = [
    ['0 tiền kiểm', 'công cụ · bản có · terminal', '2 · 3 · 4 · 5', 'grn', 0, 200],
    ['khoá', 'flock -w 30', '1 (75)', 'tea', 210, 110],
    ['1-2 chuẩn bị', 'mktemp · chép · kiểm tạo tác', '6', 'blu', 330, 200],
    ['3 tráo', 'symlink + khởi động', '—', 'amb', 540, 140],
    ['4 chờ', '/health = 200', '7', 'ora', 690, 130],
    ['5 kiểm', 'khói · cửa trước', '8 · 9', 'vio', 830, 150],
    ['mốc', 'đã lên prod', '0', 'pnk', 990, 160],
  ];
  o.forEach(([t, d, ma, c, x, w]) => {
    s += R(x, 30, w, 96, { c, fill: '#0b1220', r: 10 });
    s += T(x + w / 2, 60, t, { fs: 16, b: true, c, a: 'middle' });
    s += T(x + w / 2, 86, d, { fs: 12.5, c: 'mu', a: 'middle' });
    s += T(x + w / 2, 114, `thoát ${ma}`, { fs: 14, c: 'tx', a: 'middle', mono: true });
  });
  s += `<rect x="0" y="146" width="320" height="44" rx="8" fill="rgba(63,185,80,.12)" stroke="${D.grn}" stroke-width="1.5"/>`;
  s += T(160, 174, 'TỪ CHỐI: máy chưa bị đụng', { fs: 15, b: true, c: 'grn', a: 'middle' });
  s += `<rect x="330" y="146" width="820" height="44" rx="8" fill="rgba(248,81,73,.10)" stroke="${D.red}" stroke-width="1.5"/>`;
  s += T(740, 174, 'HỎNG: đã có thứ đổi ⇒ trap don_dep EXIT lùi symlink VÀ tiến trình', { fs: 15, b: true, c: 'red', a: 'middle' });
  s += T(0, 222, 'Quy tắc thứ tự: mọi phép kiểm CÓ THỂ từ chối đứng TRƯỚC lần ghi đầu tiên — nên "thoát 2–5" luôn an toàn để chạy lại ngay.', { fs: 15, c: 'amb', b: true });
  return sv(1150, 234, s);
};

/* ─────────── Slide 26: cú lùi trả CON TRỎ mà không trả TIẾN TRÌNH ─────────── */
const symlinkSvg = () => {
  let s = '';
  const cot = (x, ten, chu, mauTT, ttChu, nhan) => {
    s += T(x, 26, ten, { fs: 17, b: true, c: 'amb' });
    s += R(x, 44, 250, 64, { c: 'grn', fill: '#0b1220', r: 10 });
    s += T(x + 14, 72, 'hien-tai → ban/v2', { fs: 14.5, mono: true, c: 'grn' });
    s += T(x + 14, 96, chu, { fs: 13, c: 'mu' });
    s += A(x + 125, 110, x + 125, 146, { c: 'dim', dash: true });
    s += T(x + 142, 134, 'cổng 3340 là của…', { fs: 13, c: 'dim' });
    s += R(x, 150, 250, 64, { c: mauTT, fill: '#0b1220', r: 10, dash: mauTT === 'red' });
    s += T(x + 14, 178, ttChu, { fs: 14.5, mono: true, c: mauTT });
    s += T(x + 14, 202, nhan, { fs: 13, c: 'mu' });
  };
  cot(0, 'Ca D — thiếu route (thoát 8)', 'trap đã dời về v2 ✓', 'red', 'node … v4/app.mjs', 'chưa ai giết ⇒ vẫn trả lời');
  cot(300, 'Ca E — vỡ ngay (thoát 7)', 'trap đã dời về v2 ✓', 'red', '(không ai nghe)', 'v2 bị giết ở bước 3');
  s += R(610, 44, 540, 170, { c: 'grn', fill: 'rgba(63,185,80,.07)', r: 12 });
  s += T(630, 76, 'Sửa: trap trả lại cả TIẾN TRÌNH', { fs: 17, b: true, c: 'grn' });
  s += T(630, 106, '1. dời symlink về bản cũ', { fs: 15, c: 'tx' });
  s += T(630, 132, '2. giết thứ đang giữ cổng (ss -ltnp)', { fs: 15, c: 'tx' });
  s += T(630, 158, '3. khởi động bản cũ, 9>&- đóng fd khoá', { fs: 15, c: 'tx' });
  s += T(630, 184, '4. chờ /health = 200 rồi mới báo', { fs: 15, c: 'tx' });
  s += T(0, 246, 'Tiến trình đã mở app.mjs lúc khởi động — dời symlink là chuyện vô hình với nó (đo ở 6.1).', { fs: 15, c: 'amb', b: true });
  return sv(1150, 256, s);
};

export const slides = S([
  cover({ t: 'Chương 7 — Script deploy', sub: 'hỏng thật to · chạy hai lần vẫn an toàn · từ chối khi điều kiện sai · khoá · kiểm khói · ghi mốc production', chap: 'CHƯƠNG 7' }),

  { t: 'Bản đồ chương: bốn việc không phải "deploy"', body: mindmap('Script deploy', 'dừng · chạy lại · từ chối · chứng minh', [
    { t: '7.1 Cờ shell', d: 'set -euo pipefail · local x=$() · ${X:?} · CRLF', c: 'red' },
    { t: '7.2 Chạy hai lần', d: 'ồn ào vs im lặng · sinh tệp · so trạng thái máy', c: 'grn' },
    { t: '7.3 Từ chối', d: '[y/N] không terminal · nhánh · cây bẩn · df -BG · flock · pgrep', c: 'amb' },
    { t: '7.4 Kiểm khói', d: '401 đạt · 404 bản cũ · 000 · bộ kiểm không chạy được', c: 'blu' },
    { t: '7.5 Cả script', d: 'trap lùi cả tiến trình · nhánh hỏng A–E · mốc production', c: 'vio' },
    { t: 'Linux Ch7/Ch13', d: 'set -e, trap, flock CƠ BẢN học ở khoá Linux', c: 'tea' },
  ]) },

  /* ───────────── 7.1 cờ shell ───────────── */
  { t: 'Không cờ nào: ba cú hỏng, vẫn thoát 0', body: two(
    `${sh([
      ['false | true', 'cần pipefail'],
      ['echo -n "ong:qua "', ''],
      [': ${CHUA_DAT}', 'cần -u'],
      ['echo -n "bien:qua "', ''],
      ['ls /khong-co 2>/dev/null', 'cần -e'],
      ['echo -n "lenh:qua "', ''],
    ], { fs: 15 })}
    ${term([
      'set (khong co)    → ong:qua bien:qua lenh:qua  | ma thoat: 0',
      'set -e            → ong:qua bien:qua  | ma thoat: 2',
      'set -u            → ong:qua t.sh: line 5: CHUA_DAT: unbound variable | ma thoat: 1',
      'set -e -o pipefail→  | ma thoat: 1',
      '= set -euo pipefail →  | ma thoat: 1',
    ], { title: 'bash 5.2 — năm tổ hợp cờ (đo trong bài 7.1)', fs: 12.5 })}`,
    `${cards([
      { t: '-e errexit', d: 'dừng khi lệnh trả ≠ 0 — nhưng TREO trong <code>if</code>, <code>&amp;&amp;</code>, <code>||</code>, <code>!</code>', c: 'red' },
      { t: '-u nounset', d: 'dừng khi gặp biến chưa đặt — cái chặn <code>rm -rf "$GOC/x"</code> thành <code>/x</code>', c: 'amb' },
      { t: '-o pipefail', d: 'ống hỏng nếu BẤT KỲ chặng nào hỏng: <code>tar … | ssh …</code>', c: 'blu' },
    ], 1)}
    ${box('info', 'Cách từng cờ hoạt động học ở <strong>Linux &amp; Bash Ch7/Ch13</strong>. Chương này chỉ hỏi: với một script <strong>DEPLOY</strong>, cờ nào cứu được gì.')}`, 'l2') },

  { t: 'local x=$(…): không cờ nào cứu nổi', body: two(
    `${sh([
      ['#!/bin/bash', ''],
      ['set -euo pipefail', 'đủ cả ba cờ'],
      ['lay_ban() {', ''],
      ['  local sha=$(git rev-parse HEAD)', 'local THẮNG mã thoát'],
      ['  echo "$sha"', ''],
      ['}', ''],
      ['lay_ban', 'ngoài kho git ⇒ hỏng'],
    ], { fs: 15 })}
    ${term([
      '$ bash sc.sh; echo "ma thoat: $?"',
      '! fatal: not a git repository (or any of the parent directories): .git',
      '',
      '! ma thoat: 0',
    ], { title: 'VPS thí nghiệm — bash 5.2.21', fs: 13.5 })}`,
    `${term([
      '$ shellcheck sc.sh',
      '',
      'In sc.sh line 4:',
      '  local sha=$(git rev-parse HEAD)',
      '        ^-^ SC2155 (warning): Declare and assign',
      '            separately to avoid masking return values.',
      '$ echo $?',
      '! 1',
    ], { title: 'ShellCheck 0.9.0 — bắt được trong 1 giây', fs: 13 })}
    ${sh([
      ['local sha', 'khai báo riêng'],
      ['sha=$(git rev-parse HEAD)', 'gán riêng ⇒ -e thấy lỗi'],
    ], { fs: 15 })}
    ${box('warn', 'Script deploy đưa <strong>SHA rỗng</strong> đi tiếp: build thẻ <code>:</code>, push <code>:main</code>, ghi mốc rỗng… và thoát 0.')}`) },

  { t: 'Biến rỗng: $GOC/ban-cu thành /ban-cu', body: two(
    `${sh([
      ['#!/bin/bash', ''],
      ['set -euo pipefail', ''],
      ['GOC="${GOC_DEPLOY:-}"', 'chép từ đâu đó: mặc định RỖNG'],
      ['echo "se xoa: ${GOC}/ban-cu"', ''],
      ['rm -rf "${GOC:?GOC chua dat — tu choi xoa}/ban-cu"', ':? chặn tại đây'],
    ], { fs: 14 })}
    ${term([
      '$ bash goc.sh 2>&1; echo "ma thoat: $?"',
      '! se xoa: /ban-cu',
      '! goc.sh: line 5: GOC: GOC chua dat — tu choi xoa',
      '  ma thoat: 1',
      '$ ls -d /ban-cu',
      "ls: cannot access '/ban-cu': No such file or directory",
    ], { title: 'VPS thí nghiệm — ${:-} làm câm -u, ${:?} cứu', fs: 13.5 })}`,
    table(['Viết', 'Biến chưa đặt / rỗng thì'], [
      ['<code>$GOC</code> + <code>set -u</code>', 'chưa đặt ⇒ dừng; rỗng ⇒ <span style="color:#ff7b72">đi tiếp</span>'],
      ['<code>${GOC:-}</code>', '-thành rỗng, <code>-u</code> câm luôn'],
      ['<code>${GOC:-/srv/app}</code>', 'dùng giá trị mặc định'],
      ['<code>${GOC:?thông báo}</code>', '+dừng, in tên biến + thông báo'],
      ['<code>rm -rf "${X:?}"/*</code>', '+dạng dùng cho MỌI đường dẫn sắp xoá'],
    ], { sm: true }), 'l') },

  { t: 'Đầu tệp deploy — và tệp CRLF từ Windows', body: two(
    `${sh([
      ['#!/usr/bin/env bash', 'bash trong PATH'],
      ['set -euo pipefail', ''],
      ['shopt -s inherit_errexit 2>/dev/null || true', 'bash ≥ 4.4'],
      ["IFS=$'\\n\\t'", 'tuỳ chọn'],
      ['trap \'echo "HONG o dong $LINENO" >&2\' ERR', 'chết ở đâu'],
    ], { fs: 13 })}
    ${box('tip', 'Soát trước mỗi lần sửa: <code>bash -n deploy.sh</code> (cú pháp) + <code>shellcheck deploy.sh</code> (SC2155, thiếu nháy…). Hai lệnh, dưới 2 giây.')}`,
    `${term([
      '$ bash crlf.sh 2>&1 | cat -A',
      '! crlf.sh: line 2: set: pipefail^M: invalid option name$',
      '$ ./crlf.sh 2>&1 | cat -A',
      '! bash: line 1: ./crlf.sh: cannot execute: required file not found$',
      '$ sed -i "s/\\r$//" crlf.sh; bash crlf.sh',
      '= xin chao',
    ], { title: 'VPS thí nghiệm — script lưu từ Windows (CRLF)', fs: 12.5 })}
    ${box('warn', '<code>^M</code> = ký tự <code>\\r</code> Windows để cuối dòng. Bạn cùng nhóm dùng Windows ⇒ thêm <code>*.sh text eol=lf</code> vào <code>.gitattributes</code>; lỗi "required file not found" là shebang <code>/bin/bash\\r</code>.')}`, 'r') },

  /* ───────────── 7.2 chạy hai lần ───────────── */
  { t: 'Chạy lại: hỏng ỒN ÀO hay hỏng IM LẶNG', body: table(['Thao tác', 'Lần chạy thứ hai (đo thật)', 'Dạng chạy lại được'], [
    ['<code>mkdir "$D/ban-v1"</code>', "-File exists · thoát 1", '<code>mkdir -p</code>'],
    ['<code>ln -s … hien-tai</code>', '-File exists', '<code>ln -sfn … ht.moi &amp;&amp; mv -Tf ht.moi hien-tai</code>'],
    ['<code>echo … &gt;&gt; moi-truong</code>', '!IM LẶNG · thoát 0 · thêm một dòng', '<code>grep -qxF … || echo …</code> — hoặc sinh cả tệp bằng <code>&gt;</code>'],
    ['<code>useradd ungdung</code>', "-user 'ungdung' already exists · thoát 9", '<code>id -u ungdung &gt;/dev/null 2&gt;&amp;1 || useradd ungdung</code>'],
    ['<code>git clone kho.git kho</code>', '-destination path … already exists · thoát 128', '<code>[ -d kho/.git ] || git clone …</code> rồi <code>git -C kho fetch</code>'],
    ['<code>cat &gt; moi-truong &lt;&lt;EOF</code>', '+ghi đè — lần nào cũng y hệt', 'tệp do MÁY sở hữu: luôn sinh lại'],
    ['<code>systemctl enable app</code>', '+đã bật thì thôi · thoát 0', 'vốn đã idempotent'],
  ], { sm: true }) + box('info', 'Ồn ào là kết cục <strong>TỐT</strong>: dừng ngay, gọi tên lý do, không đổi gì. Cái nguy hiểm là dòng màu vàng — năm lần sạch, năm lần hỏng ngầm.') },

  { t: 'Năm lần chạy sạch, năm dòng PATH', body: two(
    term([
      '  lan 1: OK (khong loi gi)',
      '  lan 2: OK (khong loi gi)',
      '  lan 3: OK (khong loi gi)',
      '  lan 4: OK (khong loi gi)',
      '  lan 5: OK (khong loi gi)',
      '  moi-truong bay gio:',
      '!      1	PATH=/opt/ung-dung/bin:$PATH',
      '!      2	PATH=/opt/ung-dung/bin:$PATH',
      '!      3	PATH=/opt/ung-dung/bin:$PATH',
      '!      4	PATH=/opt/ung-dung/bin:$PATH',
      '!      5	PATH=/opt/ung-dung/bin:$PATH',
      '  → 5 lan chay SACH, va PATH bi lap 5 lan. Khong co ma thoat nao bao dieu do.',
    ], { title: 'đo trong bài 7.2 — >> chưa sửa', fs: 12 }),
    `${sh([
      ["grep -qxF 'PATH=/opt/ung-dung/bin:$PATH' \\", ''],
      ['    "$D/moi-truong" 2>/dev/null \\', ''],
      ["  || echo 'PATH=/opt/ung-dung/bin:$PATH' >> \"$D/moi-truong\"", ''],
    ], { fs: 12.5, so: false })}
    ${cards([
      { t: '-q', d: 'im lặng, chỉ trả mã', c: 'blu' },
      { t: '-x', d: 'khớp CẢ DÒNG, không phải "chứa"', c: 'amb' },
      { t: '-F', d: 'chuỗi cố định: <code>.</code> <code>$</code> <code>[</code> không phải regex', c: 'red' },
    ], 3)}
    ${box('bad', 'Thiếu một trong ba cờ ⇒ cái chắn KHÔNG BAO GIỜ bật hoặc LÚC NÀO CŨNG bật. Hậu quả sau này: khối <code>server</code> lặp trong nginx, cron chạy 5 lần.')}`, 'l') },

  { t: 'Idempotent: trạng thái cuối chỉ theo tham số', body: idemSvg() + box('tip', 'Bản mạnh nhất: <strong>SINH RA, đừng SỬA</strong>. Tệp do máy sở hữu thì <code>cat &gt; tệp &lt;&lt;EOF</code> mỗi lần; tệp do NGƯỜI sở hữu thì script không đụng. Không tệp nào vừa cái này vừa cái kia.') },

  { t: 'Chuẩn bị ở bên lề, tráo ở cuối cùng', body: banLeSvg() + two(
    term([
      '=== trang thai NUA CHUNG: script hong o buoc 3 tren 4 ===',
      '  1) tao thu muc',
      '  2) viet README',
      '!   ma thoat: 1',
      '  thu muc co ton tai?  CO',
      '=   symlink da tro chua? CHUA — con tro ban CU',
    ], { title: 'đo trong bài 7.2', fs: 13.5 }),
    box('good', 'Script hỏng ở bước 3/4 mà website <strong>chạy suốt</strong> — không phải may: bước NHÌN THẤY ĐƯỢC đặt ở CUỐI. Chạy lại ngay sau đó là an toàn vì mọi bước trước đều idempotent.')) },

  { t: 'Phép thử: chạy hai lần rồi so trạng thái máy', body: sh([
      ['# chup.sh — ảnh chụp trạng thái /srv/app', ''],
      ['cd /srv/app && find . -path ./nhat-ky -prune \\', 'bỏ log: lớn dần là đúng'],
      ['  -o -printf "%p %s %m %l\\n" | sort |', 'đường dẫn · cỡ · quyền · đích link'],
      ['  while read -r p rest; do', ''],
      ['    [ -f "$p" ] && h=$(sha256sum < "$p" | cut -c1-12) || h=-', 'băm nội dung (12 ký tự đầu)'],
      ['    echo "$p $rest $h"', ''],
      ['  done', ''],
    ], { fs: 13.5 }) + two(
    `${sh([
      ['bash dk.sh v1; bash chup.sh > truoc.txt', 'lần 1'],
      ['bash dk.sh v1; bash chup.sh > sau.txt', 'lần 2, KHÔNG đổi gì'],
      ['diff truoc.txt sau.txt', 'rỗng = idempotent'],
    ], { fs: 13.5 })}
    ${box('info', 'Hai phút, và là cách <strong>DUY NHẤT</strong> để biết. Đọc script không thấy được — <code>dk.sh</code> "đọc thì đúng", chỉ có một dòng <code>&gt;&gt;</code>.')}`,
    term([
      '# dk.sh con dong ">>":',
      '$ diff truoc.txt sau.txt; echo "diff ma: $?"',
      '6c6',
      '! < ./moi-truong 20 664 628b969b1041',
      '! ---',
      '! > ./moi-truong 40 664 8b0b250e2953',
      'diff ma: 1',
      '# sua ">>" thanh ">" roi chay lai tu dau:',
      '$ diff truoc.txt sau.txt; echo "diff ma: $?"',
      '= diff ma: 0',
    ], { title: 'VPS thí nghiệm — cỡ 20 → 40 byte lộ ngay', fs: 13 })) },

  /* ───────────── 7.3 từ chối ───────────── */
  { t: '[y/N] không terminal: đừng đoán, TỪ CHỐI', body: two(
    term([
      '$ bash hoi-cu.sh </dev/null',
      '  cay lam viec con thay doi chua commit.',
      '  Dung theo yeu cau.',
      '!   ma thoat: 0',
      '$ echo y | bash hoi-cu.sh',
      '  cay lam viec con thay doi chua commit.',
      '  === DANG DEPLOY ===',
      '  ma thoat: 0',
      '$ bash hoi-moi.sh </dev/null',
      '  cay lam viec con thay doi chua commit.',
      '!   stdin khong phai terminal — TU CHOI. Dung --dong-y.',
      '  ma thoat: 4',
      '$ echo y | bash hoi-moi.sh',
      '  cay lam viec con thay doi chua commit.',
      '!   stdin khong phai terminal — TU CHOI. Dung --dong-y.',
      '  ma thoat: 4',
      '$ bash hoi-moi.sh --dong-y </dev/null',
      '  cay lam viec con thay doi chua commit.',
      '=   === DANG DEPLOY ===',
      '  ma thoat: 0',
    ], { title: 'VPS thí nghiệm — cũ: read || tl=""   mới: [ -t 0 ] + --dong-y', fs: 12 }),
    `${sh([
      ['if [ "$DONG_Y" != 1 ]; then', ''],
      ['  [ -t 0 ] || { echo "…TU CHOI" >&2; exit 4; }', 'stdin là terminal?'],
      ['  read -r -p "Van deploy? [y/N] " tl', ''],
      ['  [[ "$tl" =~ ^[Yy]$ ]] || exit 3', 'người nói KHÔNG'],
      ['fi', ''],
    ], { fs: 13 })}
    ${box('warn', 'Để ý: dòng <code>Van deploy? [y/N]</code> <strong>không hề hiện</strong> trong log — bash chỉ in lời nhắc của <code>read -p</code> khi đầu vào là terminal. Log chạy nền không để lại dấu vết nào của câu hỏi.')}
    ${box('info', '<code>echo y |</code> là trả lời HỘ, không phải bày tỏ ý định. Bản sửa coi nó là "không có người" ⇒ tự động hoá phải nói rõ bằng <code>--dong-y</code>.')}`, 'l') },

  { t: 'Ba chốt git: nhánh · cây bẩn · đứng sau', body: two(
    sh([
      ['tu_choi() { echo "  ✗ $2" >&2; exit "$1"; }', ''],
      ['NHANH=$(git rev-parse --abbrev-ref HEAD)', ''],
      ['[ "$NHANH" = main ] || tu_choi 10 "dang o nhanh $NHANH"', 'chỉ deploy từ main'],
      ['BAN=$(git status --porcelain --untracked-files=no)', '?? không tính'],
      ['[ -z "$BAN" ] || tu_choi 11 "cay lam viec ban"', 'dựng từ commit, không từ đĩa'],
      ['git fetch -q origin', ''],
      ['SAU=$(git rev-list --count HEAD..origin/main)', 'origin có mà mình chưa có'],
      ['[ "$SAU" = 0 ] || tu_choi 12 "dung SAU $SAU commit"', 'không cuộn ngược đồng đội'],
      ['SHA=$(git rev-parse HEAD)', 'KHOÁ commit từ đây'],
    ], { fs: 13 }),
    `${term([
      '# 1) ban cung nhom vua push c2',
      '!   ✗ dung SAU origin/main 1 commit — git pull truoc',
      '  ma thoat: 12',
      '$ git pull -q --ff-only; bash chot.sh',
      '=   ✓ qua ca ba chot — se deploy 8e1f5b45',
      '$ echo x >> a; bash chot.sh',
      '!   ✗ cay lam viec ban: 1 tep chua commit',
      '  ma thoat: 11',
      '$ git switch -qc thu-nghiem; bash chot.sh',
      "!  ✗ dang o nhanh 'thu-nghiem', chi deploy tu main",
      '  ma thoat: 10',
    ], { title: 'VPS thí nghiệm — kho thử, origin là kho trần', fs: 12.5 })}
    ${box('bad', '<strong>13/09, một dự án sinh viên:</strong> ba lần deploy từ ba nhánh tách rời trong một buổi sáng — mỗi lần XOÁ việc của nhánh kia khỏi production. Build xanh, tráo xanh, smoke sạch.')}`, 'l') },

  { t: 'df -BG làm tròn LÊN: 1,1G hiện thành 2G', body: two(
    term([
      '$ df -h /srv/dia',
      'Filesystem      Size  Used Avail Use% Mounted on',
      'tmpfs           1.3G  180M  1.1G  14% /srv/dia',
      '$ df -BG --output=avail /srv/dia',
      'Avail',
      '!    2G',
      '$ df -BM --output=avail /srv/dia',
      'Avail',
      '= 1120M',
      '# chot "can >= 2G" viet bang -BG:',
      '! CON=2',
      '! QUA chot >=2G (con 2G)',
      '# cung chot, viet bang -BM:',
      '= MB=1120',
      '= TU CHOI: chi con 1120M, can 2048M',
    ], { title: 'VPS thí nghiệm — tmpfs 1300 MB, ghi 180 MB', fs: 12.5 }),
    `${sh([
      ['MB=$(df -BM --output=avail /var/lib/docker \\', 'đúng phân vùng Docker ghi'],
      ['     | tail -1 | tr -dc "0-9")', 'lấy mỗi con số'],
      ['[ "${MB:-0}" -ge 5120 ] || {', 'chưa đọc được ⇒ 0 ⇒ từ chối'],
      ['  echo "chi con ${MB}M, can 5120M" >&2; exit 5; }', ''],
    ], { fs: 13 })}
    ${box('warn', '<code>-B</code> của GNU df <strong>làm tròn lên</strong>: sai số tới gần 1 đơn vị. Với ngưỡng "≥ 20G" thì 19,1G vẫn qua. Đo bằng <code>-BM</code> (sai tối đa 1 MB).')}
    ${box('info', 'macOS: <code>df -BG</code> ⇒ <code>df: invalid option -- B</code>; dùng <code>df -g</code> / <code>df -m</code>. Chốt đĩa chạy TRÊN VPS qua SSH nên dùng cú pháp GNU.')}`, 'l') },

  { t: 'Hai deploy cùng lúc: flock -n hay -w', body: two(
    `${sh([
      ['exec 9>/tmp/trien-khai.lock', 'mở fd 9'],
      ['if ! flock -n 9; then', '-n: không chờ'],
      ['  echo "co lan deploy khac dang chay"; exit 75', 'EX_TEMPFAIL: thử lại sau'],
      ['fi', ''],
      ['# flock -w 30 9  ⇒ chờ tối đa 30 giây', ''],
    ], { fs: 14 })}
    ${term([
      '--- flock -n (khong cho)',
      '  [A 3ms] giu khoa, dang trao...',
      '!   [B 3ms] co lan deploy khac dang chay — thoat 75',
      '  B ma thoat: 75',
      '  [A 2008ms] xong',
      '--- flock -w 5 (cho toi 5 giay)',
      '  [A 5ms] giu khoa, dang trao...',
      '  [A 2010ms] xong',
      '=   [B 1813ms] giu khoa, dang trao...',
      '  [B 3816ms] xong',
      '  B ma thoat: 0',
    ], { title: 'VPS thí nghiệm — B chạy sau A 0,2 giây', fs: 12.5 })}`,
    `${cards([
      { t: '-n: từ chối ngay', d: 'hợp với người chạy tay: biết ngay có ai đang deploy', c: 'amb' },
      { t: '-w 30: xếp hàng', d: 'hợp với tự động: đợi lượt trước xong rồi chạy', c: 'blu' },
    ], 2)}
    ${box('bad', '<strong>Chuyện thật:</strong> bốn phiên cùng chạy <code>deploy-nha.sh</code>; ba phiên nhận <code>EXIT=75</code> ở bước tráo. Đó là kết quả <strong>TỐT</strong> — khoá chặn TRƯỚC khi làm gì. Ở một lần khác, hai phiên tranh <code>refs/heads/deploy</code>: <code>cannot lock ref … reference already exists</code>.')}
    ${box('tip', 'Khoá đặt ở <strong>NƠI tráo</strong> (VPS), không chỉ ở máy dev: hai người trên hai laptop không chung một tệp khoá. macOS không có <code>flock</code> — chốt này chạy trên Linux.')}`) },

  { t: 'kill -9: khoá tệp kẹt mãi, flock thì không', body: two(
    `${term([
      '--- khoa bang TEP: A bi kill -9, roi B chay',
      '  [A] giu khoa tep, dang trao...',
      '--- 3 giay sau, khong con tien trinh nao',
      '!   [B] co tep /tmp/dang-deploy — thoat 75',
      '  B ma thoat: 75',
      '  (khong con sleep nao)',
    ], { title: 'VPS thí nghiệm — trap EXIT không chạy khi bị SIGKILL', fs: 13 })}
    ${term([
      '--- A bi kill -9 giua chung, roi B chay',
      '  [A 2ms] giu khoa, dang trao...',
      '!   [B 2ms] co lan deploy khac dang chay — thoat 75',
      '  B ma thoat: 75',
      '# lan do 2: lai kill -9 A, roi hoi ai giu khoa',
      '$ ai dang giu /tmp/trien-khai.lock?',
      '!     508 sleep           sleep 2',
      '--- 2 giay sau (sleep da thoat)',
      '=   [B 2ms] giu khoa, dang trao...',
      '  B ma thoat: 0',
    ], { title: 'VPS thí nghiệm — con "sleep 2" thừa hưởng fd 9', fs: 13 })}`,
    `${table(['Khoá bằng', 'Chủ chết bất thường'], [
      ['tệp <code>/tmp/dang-deploy</code>', '-tệp nằm lại ⇒ kẹt tới khi có người xoá tay'],
      ['<code>mkdir</code> thư mục khoá', '-như trên'],
      ['<code>flock</code> trên fd', '+nhân nhả khi fd cuối cùng đóng'],
    ], { sm: true })}
    ${box('warn', 'flock nhả khi fd <strong>cuối cùng</strong> đóng — mọi tiến trình con đang giữ fd 9 đều giữ khoá. Con sống lâu (app chạy nền) ⇒ khoá kẹt mãi ⇒ luôn <code>9&gt;&amp;-</code> cho lệnh chạy nền (bài 3.5).')}
    ${box('tip', 'Tìm ai giữ: <code>ls -l /proc/*/fd</code> trỏ tới tệp khoá, hoặc <code>fuser -v /tmp/trien-khai.lock</code>.')}`) },

  { t: 'Vòng chờ pgrep -f tự khớp chính nó', body: two(
    term([
      '$ pgrep -af deploy-nha.sh        # khong co deploy nao chay',
      '  ma: 1',
      '$ timeout 5 bash -c "while pgrep -f deploy-nha.sh >/dev/null; \\',
      '    do sleep 1; done; bash deploy-nha.sh"',
      '!   ma: 124',
      '$ bash -c "pgrep -af deploy-nha.sh; true"   # vong cho thay AI?',
      '! 631 bash -c pgrep -af deploy-nha.sh; true',
      '$ bash -c "pgrep -af \\"^bash deploy-nha\\"; echo ma: \\$?"',
      '=   ma: 1',
      '$ bash deploy-nha.sh &   # mot lan deploy THAT dang chay',
      '$ bash -c "pgrep -af \\"^bash deploy-nha\\"; true"',
      '= 648 bash deploy-nha.sh',
      '  vong cho thoat sau 2888ms — den luot minh',
    ], { title: 'VPS thí nghiệm — procps pgrep', fs: 12 }),
    `${box('bad', '<strong>25/09, chuyện thật:</strong> hai phiên cùng chờ bằng vòng <code>while&nbsp;pgrep&nbsp;-f&nbsp;deploy-nha.sh</code> rồi mới <code>bash&nbsp;deploy-nha.sh</code>. Chính shell chạy vòng đó có chuỗi "deploy-nha.sh" trong dòng lệnh ⇒ pgrep thấy nó ⇒ <strong>chờ mãi, không ai deploy</strong>.')}
    ${sh([
      ['until ! pgrep -f "^bash deploy-nha" >/dev/null; do', 'neo ở ĐẦU dòng lệnh'],
      ['  sleep 20', ''],
      ['done', ''],
      ['# tốt hơn: chờ đúng cái khoá mà deploy giữ', ''],
      ['flock -w 1800 /tmp/trien-khai.lock true', 'chờ ≤ 30 phút'],
    ], { fs: 13 })}
    ${box('info', '<code>timeout 5</code> thoát <code>124</code> = đã phải giết vòng lặp. Khi tự viết vòng chờ, luôn có TRẦN — "chờ mãi" là một lỗi, không phải một trạng thái.')}`, 'l') },

  /* ───────────── 7.4 kiểm khói ───────────── */
  { t: '401 ĐẠT · 404 bản cũ · 000 không ai nghe', body: two(
    term([
      '# voi tung URL (U):',
      "$ curl -s -o /dev/null -w '%{http_code}' --max-time 2 $U; echo \"  exit=$?\"",
      '/health       200  exit=0',
      '/api/v1/don   401  exit=0',
      '! /api/v1/gifs  404  exit=0',
      '! cong chet     000  exit=7',
      '! /cham (5s)    000  exit=28',
      '-f /api/v1/don401  exit=22',
    ], { title: 'VPS thí nghiệm — app.mjs ở 127.0.0.1:3340', fs: 12.5 }),
    table(['Thấy', 'Nghĩa là', 'Kiểm khói coi là'], [
      ['<code>200</code>', 'route có, công khai', '+ĐẠT'],
      ['<code>401</code>', 'route CÓ, chỉ thiếu đăng nhập', '+ĐẠT'],
      ['<code>404</code>', 'router chưa gắn ⇒ ảnh cũ / dựng nửa vời', '-HỎNG'],
      ['<code>000</code>/7', 'không ai nghe cổng (refused)', '-HỎNG'],
      ['<code>000</code>/28', 'quá <code>--max-time</code>', '-HỎNG'],
      ['<code>-f</code>', 'curl tự biến 401 thành exit 22', '!đừng dùng ở đây'],
    ], { sm: true }), 'l') },

  { t: 'Vòng kiểm khói, từng cờ của curl', body: two(
    sh([
      ['LOI=0', ''],
      ['for R in /health /api/v1/don /api/v1/tin; do', 'chỉ route GET trần'],
      ['  MA=$(curl -s -o /dev/null \\', '-s im · -o bỏ thân'],
      ["        -w '%{http_code}' --max-time 2 \\", 'chỉ in mã · trần 2 s'],
      ['        "$CUA_TRUOC$R")', 'qua CỬA TRƯỚC'],
      ['  case "$MA" in', ''],
      ['    200|401) echo "  ✓ $R → $MA" ;;', ''],
      ['    404) echo "  ✗ $R → 404 (ban cu?)"; LOI=1 ;;', ''],
      ['    *)   echo "  ? $R → $MA"; LOI=1 ;;', '000, 500, 502…'],
      ['  esac', ''],
      ['done', ''],
      ['[ "$LOI" = 0 ] || exit 8', 'mã riêng: kiểm khói hỏng'],
    ], { fs: 13.5 }),
    `${term([
      '=== ban THIEU mot route (mo phong dung cu) ===',
      '  ✓ /health → 200',
      '  ✓ /api/v1/don → 401',
      '!   ✗ /api/v1/gifs → 404  (KHONG gan — ban cu/dung nua voi)',
      '  ✓ /api/v1/tin → 401',
      '  ma thoat: 1',
    ], { title: 'đo trong bài 7.4', fs: 13 })}
    ${box('bad', '<strong>Đừng</strong> thêm route chỉ-POST hay đòi tham số: mọi lần deploy hỏng oan ⇒ một tuần sau bộ kiểm bị chú thích đi.')}
    ${box('info', '<strong>02/07:</strong> deploy <code>--no-build</code> ⇒ container chạy ảnh CŨ, route GIF 404 ⇒ từ đó có smoke-test: 401/200 = có route, 404 = bản cũ.')}`, 'l') },

  { t: 'Bộ kiểm KHÔNG CHẠY ĐƯỢC: kết cục thứ ba', body: flow([
    { e: '✅', t: 'chạy và ĐẠT', d: 'thoát 0 — kết cục duy nhất người ta hay thấy', c: 'grn' },
    { e: '❌', t: 'chạy và HỎNG', d: 'thoát ≠ 0 — thứ bạn viết nó ra để bắt', c: 'red' },
    { e: '🚫', t: 'KHÔNG chạy được', d: 'phải có mã RIÊNG — không thì trông y hệt "hỏng"', c: 'amb' },
  ]) + two(
    term([
      '…',
      '  xh       KHONG',
      '',
      '  KHONG len duoc sau 6 lan thu',
      '!   ma thoat: 0 | mat 3022 ms',
      "  → ung dung dang CHAY TOT o 3330. Bo kiem quay 6 vong, ton 3 giay, roi bao",
      "    'KHONG len duoc' — va thoat 0.",
      '# them MOT dong o dau:',
      '=   bo kiem KHONG chay duoc: thieu xh',
      '=   ma thoat: 5 | mat 4 ms',
    ], { title: 'đo trong bài 7.4 — vòng chờ viết bằng công cụ chưa cài', fs: 12.5 }),
    `${sh([
      ['for c in curl ss node flock; do', ''],
      ['  command -v "$c" >/dev/null ||', ''],
      ['    { echo "thieu $c" >&2; exit 5; }', 'trước mọi thứ khác'],
      ['done', ''],
    ], { fs: 14 })}
    ${box('bad', '<strong>Chuyện thật:</strong> phép kiểm frontend gọi <code>wget</code> BÊN TRONG container frontend — ảnh cố ý không có <code>wget</code> lẫn <code>curl</code>. Mỗi lần deploy quay đủ 6 vòng, ~25 giây, kiểm được con số không.')}`, 'l') },

  { t: 'Đọc danh sách kiểm từ ĐÚNG commit đang deploy', body: two(
    term([
      '$ kiem < smoke-routes.txt              # doc CAY LAM VIEC',
      '  /health            200',
      '  /api/v1/don        401',
      '!   /api/v1/llm-keys   404',
      '# doc DUNG commit dang deploy:',
      '$ git show "06d33ee:smoke-routes.txt" | kiem',
      '  /health            200',
      '=   /api/v1/don        401',
    ], { title: 'VPS thí nghiệm — ảnh từ c1, cây làm việc ở c2', fs: 12 }),
    `${box('bad', '<strong>13/09, chuyện thật:</strong> script bóc danh sách route smoke từ tệp trong <strong>cây làm việc</strong>. Một phiên khác vừa thêm route mới vào danh sách; lượt deploy một commit CŨ HƠN đọc phải danh sách "từ tương lai" ⇒ <code>HONG llm-keys/info -&gt; 404</code>, báo hỏng một bản hoàn toàn lành — và bỏ luôn bước push lẫn bước ghi mốc.')}
    ${sh([
      ['SHA=$(git rev-parse HEAD)', 'khoá một lần, ở đầu'],
      ['git show "$SHA:smoke-routes.txt" | kiem', 'cấu hình CÙNG nguồn với ảnh'],
    ], { fs: 14 })}
    ${box('tip', 'Nhiều người/phiên cùng làm trên một kho ⇒ cây làm việc <strong>không</strong> đại diện cho thứ đang deploy. Mọi chỗ script đọc tệp từ đĩa đều đáng hỏi lại: "tệp này của commit nào?"')}`, 'l') },

  { t: 'Nhật ký có giờ, set -x có số dòng', body: two(
    `${sh([
      ["ghi() { printf '%s %s\\n' \"$(date +%H:%M:%S.%3N)\" \"$*\" \\", 'mỗi dòng một mốc giờ'],
      ['         | tee -a "$LOG"; }', 'ra màn hình + tệp'],
      ["PS4='+ ${BASH_SOURCE##*/}:${LINENO}: '", 'tệp:dòng trước mỗi lệnh'],
      ['set -x   # ... đoạn đang gỡ ...   set +x', 'bật NGẮN, quanh một đoạn'],
    ], { fs: 13.5 })}
    ${term([
      '22:09:14.463 ── 1/4 dung tao tac ──',
      '22:09:14.867 ── 2/4 chuyen len may ──',
      '22:09:15.767 ── 3/4 chay migration ──',
      '22:09:15.967 ── 4/4 trao va kiem ──',
      '22:09:16.271 XONG',
      '…',
      '  + x.sh:7: mkdir -p /srv/vps/kb/idem/dich/ban-v7',
    ], { title: 'đo trong bài 7.4', fs: 13 })}`,
    `${term([
      '$ date +%H:%M:%S.%3N',
      '! 12:49:48.3N',
    ], { title: 'Mac (macOS 27) — date của BSD không hiểu %N', fs: 14 })}
    ${box('info', 'Script deploy chạy trên Mac ⇒ mốc giờ ra chữ <code>3N</code>. Dùng <code>gdate</code> (brew coreutils), hoặc chỉ đóng dấu giờ ở phía VPS.')}
    ${box('bad', '<code>set -x</code> in GIÁ TRỊ đã khai triển: <code>curl -H "Authorization: Bearer $TOKEN"</code> ghi thẳng token vào log deploy, log CI và mọi bản sao lưu của chúng (Chương 4).')}`) },

  /* ───────────── 7.5 cả script ───────────── */
  { t: 'Năm bước, và mã thoát nói bước nào hỏng', body: vungMaSvg() + table(['Mã', 'Nghĩa', 'Làm gì tiếp'], [
    ['<code>2 · 3 · 4 · 5</code>', 'không có bản · người nói không · không terminal · thiếu công cụ', '+sửa điều kiện, chạy lại NGAY'],
    ['<code>1</code> / <code>75</code>', 'có lần deploy khác giữ khoá', '!chờ lượt kia xong, rồi ĐO production'],
    ['<code>6 · 7 · 8 · 9</code>', 'tạo tác dị dạng · không lên · kiểm khói hỏng · cửa trước lệch', '-trap đã lùi — NHÌN máy trước khi chạy lại'],
  ], { sm: true }) },

  { t: 'trap don_dep: lùi cả tiến trình, không chỉ con trỏ', body: sh([
    ['don_dep() {', ''],
    ['  local ma=$?', 'mã thoát của script'],
    ['  [ -n "$TAM" ] && rm -rf "$TAM"', 'dọn thư mục tạm MỌI đường'],
    ['  if [ $ma -ne 0 ] && [ -n "$TRUOC" ]; then', 'hỏng SAU khi đã có bản cũ'],
    ['    ln -sfn "$GOC/ban/$TRUOC" "$GOC/ht.moi" && mv -Tf "$GOC/ht.moi" "$GOC/hien-tai"', '1. trả con trỏ'],
    ['    for p in $(ss -ltnp | grep ":$CONG " | grep -o \'pid=[0-9]*\' | cut -d= -f2); do', '2. ai giữ cổng'],
    ['      kill -TERM "$p" 2>/dev/null || true', '   giết bản hỏng'],
    ['    done', ''],
    ['    CONG=$CONG setsid nohup node "$GOC/hien-tai/app.mjs" >>"$NK" 2>&1 </dev/null 9>&- &', '3. chạy lại bản cũ'],
    ['    for i in $(seq 1 100); do', '4. CHỜ nó trả lời'],
    ['      [ "$(curl -s -o /dev/null -w \'%{http_code}\' --max-time 1 "$CUA_TRUOC/health")" = 200 ] && break', ''],
    ['      sleep 0.02', ''],
    ['    done', ''],
    ['  fi', ''],
    ['  return $ma', 'giữ nguyên mã: 6/7/8/9'],
    ['}', ''],
    ['trap don_dep EXIT', 'nổ khi thoát thường lẫn errexit'],
    ['…', ''],
    ['TRUOC=""   # dòng CUỐI script: thành công ⇒ không lùi nữa', ''],
  ], { fs: 12.5 }) },

  { t: 'Chạy từng nhánh hỏng: A–E', body: table(['Ca', 'Gây ra', 'Mã', 'Bản đầu phục vụ', 'Sau khi sửa trap'], [
    ['A', 'bản <code>v9</code> không tồn tại', '2', '+v2 (chưa đụng gì)', '+v2'],
    ['B', 'chạy nền, không <code>--dong-y</code>', '4', '+v2 (chưa đụng gì)', '+v2'],
    ['C', 'tạo tác thiếu <code>app.mjs</code>', '6', '+v2 (hỏng lúc chuẩn bị)', '+v2'],
    ['D', 'bản thiếu một route', '8', '-v4 — bản HỎNG', '+v2 sau 100 ms'],
    ['E', 'app vỡ ngay khi chạy', '7', '-(rỗng) — KHÔNG gì cả', '+v2 sau 100 ms'],
  ], { sm: true }) + two(
    term([
      '=== D. ban THIEU mot route (dung nua voi) ===',
      '! ✗     /api/v1/tin → 404',
      '! ✗ kiem khoi HONG — ban dung nua voi',
      '! ✗ hong (ma 8) — dua symlink ve \'v2\'    → ma thoat: 8',
      "!   → dang phuc vu: v4          ← ???",
    ], { title: 'đo trong bài 7.5 — trap bản đầu', fs: 12.5 }),
    box('bad', 'Mã thoát đúng, nhật ký đúng, và <strong>cái máy sai</strong> theo hai hướng. Không đọc nào thấy được — phải CỐ TÌNH gây hỏng rồi hỏi cửa trước xem nó đang phục vụ gì.')) },

  { t: 'Symlink đã về, tiến trình thì chưa', body: symlinkSvg() + kpis([
    { v: '196 ms', l: 'đường thuận, đầu tới cuối', c: 'grn' },
    { v: '100 ms', l: 'khôi phục v2 sau khi sửa trap', c: 'blu' },
    { v: '5 / 5', l: 'nhánh hỏng đã chạy thật', c: 'vio' },
  ]) },

  { t: 'Ghi mốc production bằng SHA đã khoá', body: two(
    term([
      '  [deploy] bat dau: build 4e4e6d1 ... (30 phut)',
      '  [deploy] trao xong, production chay 4e4e6d1',
      '$ git push origin HEAD:main              # ban CU',
      '!   origin/main = 16761ce  (c3: phien KHAC commit giua chung)',
      '$ git push origin "$SHA:refs/heads/main"  # ban SUA',
      '=   origin/main = 4e4e6d1  (c2: ban se deploy)',
      '# moc: production dang chay gi',
      '$ git push origin "$SHA:refs/heads/da-len-prod"',
      '# co gi CHUA len production?',
      '$ git log --oneline origin/da-len-prod..main',
      '+ 16761ce c3: phien KHAC commit giua chung',
    ], { title: 'VPS thí nghiệm — c3 commit giữa lúc deploy', fs: 12 }),
    `${box('bad', '<strong>23/09, chuyện thật:</strong> một lượt <code>deploy-nha.sh</code> chạy 16:18→16:50. Giữa chừng một phiên khác merge 26 commit (có migration) vào <code>main</code>. Bước cuối <code>git push origin HEAD:main</code> đẩy HEAD <em>lúc đó</em> ⇒ GitHub đi trước production 26 commit chưa từng chạy.')}
    ${sh([
      ['SHA=$(git rev-parse HEAD)', 'ĐẦU script, một lần'],
      ['# … build "$SHA" · tráo · kiểm khói · so mã băm …', ''],
      ['git push origin "$SHA:refs/heads/main"', 'đúng thứ đã chạy'],
      ['git push -f origin "$SHA:refs/heads/da-len-prod"', 'mốc: CHỈ sau khi đã kiểm'],
    ], { fs: 12.5 })}
    ${box('tip', 'Mốc <code>da-len-prod</code> ghi <strong>sau</strong> khi đã đối chiếu container chạy đúng ảnh — ghi sau bước tráo là quá sớm (có thể bị phiên khác tráo đè).')}`, 'l') },

  { t: 'Đừng sửa script deploy lúc nó đang chạy', body: two(
    term([
      '=== A) sua TAI CHO (ghi de cung inode) luc dang chay ===',
      '  buoc 1: build',
      '!   dep.sh: line 3: au: command not found',
      '!   buoc 1: build',
      '  buoc 2: trao',
      '  buoc 3: kiem khoi',
      '  buoc 4: push',
      '=   bash -n dep.sh: sach',
      '=== B) sua bang sed -i (tep MOI, inode moi) luc dang chay ===',
      '  buoc 1: build',
      '  buoc 2: trao',
      '  buoc 3: kiem khoi',
      '  buoc 4: push',
    ], { title: 'VPS thí nghiệm — thêm 1 dòng đầu tệp lúc đang chạy', fs: 12.5 }),
    `${box('warn', 'Bash đọc script <strong>theo vị trí byte</strong>, từng đoạn. Ghi đè tại chỗ ⇒ mọi thứ sau con trỏ dịch đi ⇒ bash đọc vào giữa dòng (<code>au</code> = đuôi của "dau") và chạy <strong>lại bước 1</strong>. <code>bash -n</code> vẫn bảo tệp sạch.')}
    ${box('bad', '<strong>07/09, chuyện thật:</strong> sửa dòng 384 lúc <code>deploy-nha.sh</code> đang chạy ⇒ chết ở dòng 462 với <code>syntax error near unexpected token</code> trên một dòng lành. Ảnh đã tráo, nhưng smoke-test, đồng bộ nginx và bước push bị bỏ — không ai thấy.')}
    ${box('tip', 'Muốn sửa: đợi nó xong, hoặc sửa một bản chép rồi <code>mv</code> vào (inode mới — chính cái <code>mv</code> mà bài nginx bind-mount cấm lại là thứ cứu ở đây).')}`, 'l') },

  /* ───────────── cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở script deploy', body: table(['Việc làm', 'Vì sao hỏng', 'Làm thay bằng'], [
    ['<code>local x=$(lệnh)</code> trong hàm', 'local thắng mã thoát ⇒ thoát 0 dù lệnh hỏng', '<code>local x; x=$(lệnh)</code> + ShellCheck'],
    ['<code>rm -rf "$GOC/…"</code>', 'GOC rỗng ⇒ xoá từ <code>/</code>, thoát 0', '<code>"${GOC:?}"</code>'],
    ['<code>echo … &gt;&gt; tệp</code>', 'chạy lại ⇒ dòng lặp, không ai báo', '<code>grep -qxF … ||</code> hoặc sinh cả tệp'],
    ['<code>read -p "[y/N]" || tl=""</code>', 'chạy nền ⇒ thoát 0, không deploy', '<code>[ -t 0 ]</code> + <code>--dong-y</code>, mã riêng'],
    ['<code>df -BG</code> so ngưỡng', 'làm tròn LÊN: 1,1G thành 2G', '<code>df -BM</code>, so bằng MB'],
    ['khoá bằng tệp/thư mục', 'kill -9 ⇒ khoá nằm lại mãi', '<code>flock</code> + <code>9&gt;&amp;-</code> cho con chạy nền'],
    ['<code>while pgrep -f tên.sh</code>', 'tự khớp dòng lệnh của chính nó ⇒ chờ mãi', '<code>^bash tên</code> hoặc chờ khoá <code>flock -w</code>'],
    ['kiểm khói bằng <code>curl -f</code>', '401 thành exit 22 ⇒ báo hỏng oan', '<code>-w %{http_code}</code>, 200/401 là đạt'],
    ['đọc cấu hình kiểm từ cây làm việc', 'so với commit khác ⇒ 404 giả', '<code>git show "$SHA:tệp"</code>'],
    ['<code>git push origin HEAD:main</code> ở cuối', 'đẩy commit chen vào giữa lúc deploy', '<code>"$SHA:refs/heads/main"</code>'],
    ['trap chỉ dời symlink', 'tiến trình hỏng vẫn chạy / không gì chạy', 'giết + khởi động bản cũ + chờ /health'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh (1/2): đầu tệp, chốt, khoá', body: two(
    sh([
      ['#!/usr/bin/env bash', ''],
      ['set -euo pipefail', 'dừng khi hỏng'],
      ['shopt -s inherit_errexit 2>/dev/null || true', ''],
      ['bash -n deploy.sh && shellcheck deploy.sh', 'soát trước khi chạy'],
      ['rm -rf "${X:?}"/*', 'biến rỗng ⇒ dừng'],
      ['[ -t 0 ] || exit 4', 'không terminal ⇒ từ chối'],
      ['git rev-parse --abbrev-ref HEAD', 'đang ở nhánh nào'],
      ['git status --porcelain --untracked-files=no', 'rỗng = cây sạch'],
      ['git rev-list --count HEAD..origin/main', '0 = không đứng sau'],
      ['df -BM --output=avail /var/lib/docker', 'đĩa, sai ≤ 1 MB'],
      ['exec 9>/tmp/x.lock; flock -n 9 || exit 75', 'một lúc một lần'],
      ['lệnh-nền … 9>&- &', 'con không giữ khoá'],
      ['pgrep -af "^bash deploy"', 'ai đang deploy (neo đầu)'],
    ], { fs: 13 }),
    table(['Dạng hỏng khi chạy lại', 'Dạng an toàn'], [
      ['<code>mkdir d</code>', '<code>mkdir -p d</code>'],
      ['<code>ln -s a l</code>', '<code>ln -sfn a l.moi &amp;&amp; mv -Tf l.moi l</code>'],
      ['<code>echo x &gt;&gt; f</code>', '<code>grep -qxF x f || echo x &gt;&gt; f</code>'],
      ['<code>useradd u</code>', '<code>id -u u || useradd u</code>'],
      ['<code>git clone r d</code>', '<code>[ -d d/.git ] || git clone r d</code>'],
      ['sửa tệp máy sở hữu', '<code>cat &gt; f &lt;&lt;EOF</code> — sinh lại'],
    ], { sm: true }), 'l') },

  { t: 'Bảng tra nhanh (2/2): kiểm khói, mã thoát, mốc', body: two(
    sh([
      ['SHA=$(git rev-parse HEAD)', 'khoá commit MỘT lần'],
      ["curl -s -o /dev/null -w '%{http_code}' --max-time 2 URL", 'chỉ mã HTTP'],
      ['git show "$SHA:smoke-routes.txt"', 'danh sách của đúng commit'],
      ['command -v curl >/dev/null || exit 5', 'kiểm bộ kiểm'],
      ['curl -s "$CUA_TRUOC/ban"', 'cửa trước đang phục vụ bản nào'],
      ["PS4='+ ${BASH_SOURCE##*/}:${LINENO}: '", 'set -x có tệp:dòng'],
      ['trap don_dep EXIT', 'lùi trên MỌI đường hỏng'],
      ['git push origin "$SHA:refs/heads/main"', 'đẩy đúng thứ đã chạy'],
      ['git push -f origin "$SHA:refs/heads/da-len-prod"', 'mốc sau khi đã kiểm'],
      ['git log --oneline origin/da-len-prod..main', 'cái gì CHƯA lên prod'],
    ], { fs: 13 }),
    table(['Mã', 'Nghĩa'], [
      ['<code>0</code>', '+đã deploy VÀ cửa trước xác nhận'],
      ['<code>2 3 4 5</code>', 'từ chối — máy chưa bị đụng'],
      ['<code>10 11 12</code>', 'chốt git: nhánh · cây bẩn · đứng sau'],
      ['<code>75</code>', '!khoá bận (EX_TEMPFAIL — thử lại sau)'],
      ['<code>6 7 8 9</code>', '-hỏng sau khi ghi — trap đã lùi'],
      ['<code>124</code>', '<code>timeout</code> đã phải giết'],
      ['curl <code>000</code> · exit 7', 'không ai nghe cổng'],
      ['curl exit 28', 'quá <code>--max-time</code>'],
    ], { sm: true }), 'l') },

  { t: 'Thực hành chương 7 (45 phút, VPS thí nghiệm)', body: table(['Bước', 'Làm gì', 'Đạt khi'], [
    ['<strong>1. Cờ</strong> · 8′', 'viết <code>sc.sh</code> có <code>local x=$(git …)</code>; chạy ngoài kho git; <code>shellcheck</code>', 'thấy thoát 0 rồi SC2155; bản tách dòng thoát ≠ 0'],
    ['<strong>2. Chạy hai lần</strong> · 10′', '<code>dk.sh v1</code> hai lần + <code>chup.sh</code> + <code>diff</code>; sửa <code>&gt;&gt;</code>', '+diff từ 1 thành 0'],
    ['<strong>3. Từ chối</strong> · 10′', 'chot.sh trên kho thử: đứng sau · cây bẩn · nhánh khác; <code>echo y |</code> bản cũ và mới', 'ra đủ 12 · 11 · 10; bản mới trả 4'],
    ['<strong>4. Đĩa + khoá</strong> · 8′', 'tmpfs 1300 MB ghi 180 MB, so <code>-BG</code>/<code>-BM</code>; chạy hai <code>khoa.sh</code> cùng lúc', 'thấy "2G" với 1120M; B thoát 75'],
    ['<strong>5. Kiểm khói + mốc</strong> · 9′', 'curl 200/401/404/000; <code>git show $SHA:</code>; push <code>HEAD</code> vs <code>$SHA</code>', '+origin/main = commit đã deploy'],
  ], { sm: true }) + two(
    box('info', '<strong>VPS thí nghiệm:</strong> <code>docker run -d --name dv07-vps --label dvhoc=07 --memory 512m --tmpfs /srv/dia:size=1300m,uid=1000 -p 127.0.0.1:19072:22 dv07-img</code>. Xong: <code>docker rm -f dv07-vps</code>.'),
    box('warn', 'Mọi phép thử khoá, <code>kill -9</code>, <code>rm -rf</code> chỉ làm trong container thí nghiệm — không bao giờ trên VPS thật đang chạy web.')) },
].map((s) => (s.kind === 'cover' ? s : { ...s, body: FIX + s.body })));
