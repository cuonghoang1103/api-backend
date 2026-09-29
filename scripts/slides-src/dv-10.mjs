/**
 * Deploy lên VPS · Deck dv-10 — Chương 10: Sao lưu, và cú phục hồi không ai bấm giờ.
 *
 * MỌI output terminal MỚI trên slide là output THẬT, chạy 29/09/2026 (hợp đồng mục 7b), trên Docker Desktop
 * (Mac M1, máy ảo Linux, 10 nhân) — container đều tên dv10-… và nhãn dvhoc=10, mạng riêng dv10-net:
 *   • dv10-pg   = "production": pgvector/pgvector:pg16 (PostgreSQL 16.15 + pgvector), CSDL `thu` 191 MB
 *                 (lon 400.170 dòng / 124 MB, bf 300.000, kh 200.000, tai_lieu_nhung 20.000 có cột vector + chỉ mục hnsw,
 *                 bai_hoc 120, tien_do 320 với ON DELETE CASCADE, vai trò ung_dung).
 *   • dv10-vps  = "VPS thí nghiệm": ubuntu:24.04 + sshd (SSH từ Mac qua 127.0.0.1:19102), pg_dump 16.15, age 1.1.1,
 *                 rclone 1.60.1, rsync 3.2.7 — chạy sao-luu.sh, và giữ khoá CÔNG KHAI age.
 *   • dv10-kho  = máy thứ ba giữ bản sao ngoài máy + khoá BÍ MẬT age; kéo bản sao lưu bằng khoá chỉ-đọc.
 *   • dv10-may2 / dv10-may3 / dv10-moi = máy MỚI để bấm giờ phục hồi (đúng ảnh pgvector); dv10-sai = postgres:16 thường.
 *   • dv10-nho  = máy có đĩa tmpfs 48 MB để pg_dump chạm ENOSPC thật.
 * Số liệu production (44 lỗi / 316 vs 318 bảng / 340.265 vs 367.043 dòng; verify-backup.sh không tồn tại 62 ngày;
 * lần restore đầu 18/08: 281 bảng, 223.382 dòng, 16 s) lấy từ hồ sơ dự án — không đo lại trên production.
 *
 * Hình tự vẽ (SVG nội tuyến): anhChup() dòng thời gian ảnh chụp của pg_dump · rto() các chặng phục hồi trên máy mới ·
 * rpo() trục thời gian RPO/RTO · baHaiMot() quy tắc 3-2-1.
 * Tô màu: sh() cho bash; conf() (chép từ dv-03) cho unit systemd và authorized_keys; code(…,'sql') cho SQL.
 */
import { S, cover, sh, term, mindmap, diagram, cards, box, steps, table, two, bars, code, sv, R, T, A, D, esc } from './_dv-chung.mjs';

export const deck = { key: 'dv-10', code: 'DEPLOY · CHƯƠNG 10', title: 'Sao lưu & phục hồi', sub: 'Deploy lên VPS · Chương 10' };

const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15px}.c-t.sm td,.c-t.sm th{padding:6px 10px}' +
  '.d-yml .c .nu{color:#b5cea8}.d-yml .c .sx{color:#c586c0}.d-yml .c .sec{color:#ff7b72;font-weight:700}' +
  '.c-code{margin:0}.c-grid+*{margin-top:12px}.c-box+.c-box{margin-top:12px}.c-card p{font-size:15px}' +
  '.g-term+.g-term{margin-top:12px}.l-sh+.c-box,.g-term+.c-box,.c-t+.c-box,.c-bars+.g-term,.c-t+.g-term{margin-top:12px}svg{max-width:100%;height:auto}</style>';

/* ─────────── tô màu cấu hình: unit systemd (ini) và dòng authorized_keys — chép từ dv-03, cùng khung .d-yml ─────────── */
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
          .replace(/\b(\d+(?:s|ms|h|min)?)\b/g, '<span class="nu">$1</span>');
        return `${m[1]}<span class="k">${esc(m[2])}</span>${m[3]}${v}${tail}`;
      }
      return esc(body) + tail;
    }
    // authorized_keys: tuỳ chọn trước kiểu khoá
    if ((m = body.match(/^(\S+)(\s+)(ssh-\S+)(.*)$/))) {
      const opt = esc(m[1]).replace(/(&quot;[^&]*&quot;|"[^"]*")/g, '\u0001$1\u0002').replace(/([a-z-]+)(=)/g, '<span class="k">$1</span>$2')
        .replace(/\u0001/g, '<span class="s">').replace(/\u0002/g, '</span>');
      return `${opt}${m[2]}<span class="sx">${esc(m[3])}</span>${esc(m[4])}${tail}`;
    }
    return esc(body) + tail;
  };
  return `<div class="d-yml" style="--fs:${fs}px">${lines.map((x) => {
    const [c, a] = Array.isArray(x) ? x : [x, ''];
    return `<div class="c">${hl(c) || ' '}</div><div class="a">${a ? esc(a) : ''}</div>`;
  }).join('')}</div>`;
};

/* ─────────── Slide 5: bản dump chụp lúc BẮT ĐẦU (số đo thật: 0 · 399 · 1.757 ms) ─────────── */
const anhChup = () => {
  const x0 = 40, k = 0.3; // 1 ms = 0,3 px ⇒ 1.800 ms = 540 px
  const X = (ms) => x0 + ms * k;
  let s = '';
  s += `<path d="M${X(0)} 150 L${X(1800)} 150" stroke="${D.dim}" stroke-width="2"/>`;
  [0, 500, 1000, 1500].forEach((t) => { s += `<path d="M${X(t)} 145 L${X(t)} 155" stroke="${D.dim}" stroke-width="2"/>` + T(X(t), 174, `${t} ms`, { fs: 12.5, a: 'middle', c: 'mu', mono: true }); });
  s += R(X(0), 88, (1757) * k, 40, { c: 'blu', fill: 'rgba(88,166,255,.12)', r: 8 }) + T(X(878), 114, 'pg_dump đang chạy', { fs: 14.5, a: 'middle', b: true, c: 'blu' });
  s += `<circle cx="${X(0)}" cy="150" r="7" fill="${D.grn}"/>` + T(X(0), 64, 'ẢNH CHỤP', { fs: 14, b: true, c: 'grn' }) + T(X(0), 80, 'nguoi_dung = 6', { fs: 13, c: 'grn', mono: true });
  s += `<circle cx="${X(399)}" cy="150" r="7" fill="${D.amb}"/>` + `<path d="M${X(399)} 150 L${X(399)} 206" stroke="${D.amb}" stroke-width="2" stroke-dasharray="5 4"/>`;
  s += T(X(399) - 20, 226, 'ghi + CHỐT dòng id=7', { fs: 13.5, b: true, c: 'amb' }) + T(X(399) - 20, 244, 'CSDL thật: 7 dòng', { fs: 13, c: 'mu' });
  s += `<circle cx="${X(1757)}" cy="150" r="7" fill="${D.vio}"/>` + T(X(1757), 64, 'xong, thoát 0', { fs: 14, b: true, c: 'vio', a: 'end' }) + T(X(1757), 80, 'bản dump: 6 dòng', { fs: 13, c: 'vio', a: 'end', mono: true });
  s += T(x0, 24, 'Một giao dịch REPEATABLE READ duy nhất — mọi bảng nhìn cùng một thời điểm', { fs: 14, c: 'dim' });
  return sv(620, 256, s);
};

/* ─────────── Slide 9: các chặng phục hồi trên một máy MỚI (số đo thật, tổng 9.571 ms) ─────────── */
const rto = () => {
  const ch = [
    ['Postgres mới sẵn sàng', 3809, 'dv', 'docker run → init xong'],
    ['giải mã + sha256', 75, 'tea', ''],
    ['vai trò', 70, 'amb', ''],
    ['pg_restore -j4', 4170, 'blu', '8 bảng, 0 lỗi'],
    ['ANALYZE', 840, 'vio', ''],
    ['đối chiếu bản kê', 433, 'grn', '8/8 khớp + truy vấn mẫu'],
  ];
  const x0 = 250, k = 0.084; // 1 ms = 0,084 px ⇒ 9.600 ms ≈ 806 px
  let s = '', t = 0;
  ch.forEach(([ten, ms, c, d], i) => {
    const y = 14 + i * 44;
    s += T(0, y + 22, ten, { fs: 15, b: true, c }) + (d ? T(0, y + 38, d, { fs: 12, c: 'mu' }) : '');
    s += R(x0 + t * k, y + 4, Math.max(ms * k, 4), 30, { c, fill: 'rgba(255,255,255,.04)', r: 6 });
    s += T(x0 + (t + ms) * k + 8, y + 25, `${ms.toLocaleString('vi-VN')} ms`, { fs: 13.5, c, mono: true, b: true });
    t += ms;
  });
  const y = 14 + ch.length * 44 + 8;
  s += `<path d="M${x0} ${y} L${x0 + t * k} ${y}" stroke="${D.dim}" stroke-width="2"/>`;
  [0, 2000, 4000, 6000, 8000].forEach((m) => { s += `<path d="M${x0 + m * k} ${y - 5} L${x0 + m * k} ${y + 5}" stroke="${D.dim}" stroke-width="2"/>` + T(x0 + m * k, y + 22, `${m / 1000} s`, { fs: 12.5, a: 'middle', c: 'mu', mono: true }); });
  s += T(x0 + t * k, y + 22, 'TỔNG 9,6 s', { fs: 14, a: 'end', b: true, c: 'grn' });
  return sv(1160, y + 30, s);
};

/* ─────────── Slide 11: RPO và RTO trên một trục thời gian ─────────── */
const rpo = () => {
  const X = (h) => 30 + (h - 1) * 72; // giờ trong ngày ⇒ px, 01:00…16:00
  let s = '';
  s += `<path d="M${X(1)} 130 L${X(16.3)} 130" stroke="${D.dim}" stroke-width="2.5"/>`;
  [2, 4, 6, 8, 10, 12, 14, 16].forEach((h) => { s += `<path d="M${X(h)} 124 L${X(h)} 136" stroke="${D.dim}" stroke-width="2"/>` + T(X(h), 156, `${String(h).padStart(2, '0')}:00`, { fs: 12.5, a: 'middle', c: 'mu', mono: true }); });
  s += `<circle cx="${X(3.25)}" cy="130" r="8" fill="${D.grn}"/>` + T(X(3.25), 30, 'bản sao lưu', { fs: 14, a: 'middle', b: true, c: 'grn' }) + T(X(3.25), 48, '03:15', { fs: 13, a: 'middle', c: 'grn', mono: true });
  s += `<path d="M${X(3.25)} 56 L${X(3.25)} 120" stroke="${D.grn}" stroke-width="2" stroke-dasharray="5 4"/>`;
  s += `<circle cx="${X(14.33)}" cy="130" r="8" fill="${D.red}"/>` + T(X(14.33), 30, 'sự cố', { fs: 14, a: 'middle', b: true, c: 'red' }) + T(X(14.33), 48, '14:20', { fs: 13, a: 'middle', c: 'red', mono: true });
  s += `<path d="M${X(14.33)} 56 L${X(14.33)} 120" stroke="${D.red}" stroke-width="2" stroke-dasharray="5 4"/>`;
  s += R(X(3.25), 84, X(14.33) - X(3.25), 30, { c: 'red', fill: 'rgba(255,92,108,.14)', r: 6, dash: true }) + T((X(3.25) + X(14.33)) / 2, 104, 'RPO thật: 11 giờ 05 phút dữ liệu MẤT', { fs: 14.5, a: 'middle', b: true, c: 'red' });
  s += R(X(14.33), 172, X(15.9) - X(14.33), 30, { c: 'amb', fill: 'rgba(255,196,0,.14)', r: 6 }) + T(X(14.33) - 8, 192, 'RTO: tới lúc phục vụ lại →', { fs: 14, a: 'end', b: true, c: 'amb' });
  s += T(X(1), 236, 'RPO do LỊCH sao lưu quyết định · RTO do việc bạn đã TẬP phục hồi hay chưa', { fs: 14, c: 'dim' });
  return sv(1150, 248, s);
};

/* ─────────── Slide 24: quy tắc 3-2-1 ─────────── */
const baHaiMot = () => {
  let s = '';
  const hop = (x, y, w, h, t, d, c, dash = false) => R(x, y, w, h, { c, fill: '#0b1220', r: 12, dash }) + T(x + w / 2, y + 30, t, { fs: 16, a: 'middle', b: true, c }) + T(x + w / 2, y + 54, d, { fs: 13, a: 'middle', c: 'mu' });
  s += R(0, 30, 520, 250, { c: 'dv', fill: 'rgba(56,189,248,.05)', r: 16 }) + T(18, 58, '🖥 VPS (một máy, một đĩa)', { fs: 16, b: true, c: 'dv' });
  s += hop(24, 80, 220, 76, '① CSDL đang chạy', 'bản GỐC — không phải bản sao', 'blu');
  s += hop(276, 80, 220, 76, '② ~/sao-luu', 'bản sao 1: sửa nhầm thì cứu', 'tea');
  s += T(24, 196, 'đĩa hỏng · máy bị chiếm · nhà cung cấp khoá', { fs: 13.5, c: 'red' }) + T(24, 218, 'tài khoản ⇒ ① và ② mất CÙNG LÚC', { fs: 13.5, c: 'red' });
  s += T(24, 258, '= 2 bản, nhưng MỘT chỗ để mất', { fs: 14, b: true, c: 'amb' });
  s += A(530, 157, 640, 157, { c: 'grn' }) + T(585, 140, 'age + kéo', { fs: 13, a: 'middle', c: 'grn' });
  s += hop(650, 80, 250, 76, '③ máy kho (nhà / nơi khác)', 'bản sao 2: NGOÀI máy, đã mã hoá', 'grn');
  s += hop(650, 190, 250, 76, '(tuỳ) kho đối tượng R2/S3', 'versioning + vòng đời 90 ngày', 'vio', true);
  s += A(775, 160, 775, 186, { c: 'vio', dash: true });
  s += T(930, 100, '3 bản', { fs: 22, b: true, c: 'grn' }) + T(930, 124, 'gốc + 2 bản sao', { fs: 13, c: 'mu' });
  s += T(930, 170, '2 loại nơi', { fs: 22, b: true, c: 'grn' }) + T(930, 194, 'đĩa khác, máy khác', { fs: 13, c: 'mu' });
  s += T(930, 240, '1 ngoài máy', { fs: 22, b: true, c: 'grn' }) + T(930, 264, 'sống qua mất trắng VPS', { fs: 13, c: 'mu' });
  return sv(1100, 290, s);
};

export const slides = S([
  cover({ t: 'Chương 10 — Sao lưu, và cú phục hồi không ai bấm giờ', sub: 'pg_dump đo thật · bấm giờ phục hồi sang máy mới · bản sao lưu nói dối · kiểm bằng cách phục hồi · thứ bản dump không chứa · 3-2-1, kéo về máy kho, age, xoay vòng', chap: 'CHƯƠNG 10' }),

  { t: 'Bản đồ chương: một tệp chưa phải bản sao lưu', body: mindmap('Sao lưu', 'chỉ có giá trị khi PHỤC HỒI được', [
    { t: '10.1 Làm ra', d: '-Fp / -Fc / -Fd · zstd · ảnh chụp lúc bắt đầu · docker exec -t', c: 'blu' },
    { t: '10.2 Phục hồi', d: 'bấm giờ sang máy mới · -j4 · ANALYZE · RPO/RTO · cứu một bảng', c: 'grn' },
    { t: '10.3 Nói dối', d: 'tệp cụt thoát 0 · --list thoát 0 · mã thoát nói gì', c: 'red' },
    { t: '10.4 Kiểm chứng', d: 'phục hồi + đếm + truy vấn mẫu · đúng ảnh prod · báo khi VẮNG', c: 'amb' },
    { t: '10.5 Ngoài bản dump', d: 'vai trò · volume tệp tải lên · .env · cấu hình vào git', c: 'vio' },
    { t: '10.7 Ra khỏi máy', d: '3-2-1 · máy kho KÉO bằng khoá chỉ-đọc · age · xoay vòng', c: 'tea' },
  ]) },

  /* ───────────── 10.1 ───────────── */
  { t: 'Ba định dạng: nhanh, nhỏ, hay song song', body: two(
    `${table(['pg_dump (CSDL 191 MB)', 'Thời gian (7 lần)', 'Kích thước'], [
      ['<code>-Fp</code> SQL thuần', '524–933 ms · giữa 695', '-<span>114 MB</span>'],
      ['<code>-Fc</code> custom (gzip 6)', '1.365–3.420 · giữa 1.928', '13 MB'],
      ['<code>-Fd -j4</code> thư mục', '1.070–3.055 · giữa 2.612', '13 MB'],
      ['<code>-Fc -Z1</code> nén nhẹ', '613–1.095 · giữa 735', '14 MB'],
      ['<code>-Fp</code> rồi <code>gzip -6</code>', 'cộng 1.369–1.941 cho gzip', '13 MB'],
    ], { sm: true })}
    ${box('info', 'Đo trên Docker Desktop (Mac M1): số dao động gấp đôi giữa các lần. Đọc <b>thứ tự</b>, đừng đọc từng mili giây.')}`,
    `${bars([
      { l: 'SQL thuần', sub: '-Fp', v: 114, txt: '114 MB', c: 'red' },
      { l: 'custom', sub: '-Fc', v: 13, txt: '13 MB', c: 'blu' },
      { l: 'custom zstd', sub: '--compress=zstd', v: 10.4, txt: '10,4 MB', c: 'grn' },
    ], { lw: 170 })}
    ${cards([
      { t: '-Fp', d: 'đọc được bằng mắt · chỉ <strong>psql</strong>, một luồng, theo thứ tự', c: 'amb' },
      { t: '-Fc', d: 'nén + <strong>mục lục</strong> ⇒ <code>-j</code>, <code>-t</code>, <code>--list</code>. Mặc định nên chọn', c: 'blu' },
      { t: '-Fd', d: 'một tệp mỗi bảng ⇒ DUMP song song được (<code>-j</code>)', c: 'tea' },
    ], 3)}`, 'l') },

  { t: 'zstd: nhỏ hơn VÀ nhanh hơn gzip', body: two(
    term([
      '$ for c in gzip:6 lz4 zstd; do for i in 1 2 3; do … \\',
      '    pg_dump -d thu -Fc --compress=$c -f thu.$i.c …',
      'gzip:6 2709 ms 13254204',
      'gzip:6 1386 ms 13254204',
      'gzip:6 1359 ms 13254204',
      'lz4 583 ms 22270996',
      'lz4 522 ms 22270996',
      'lz4 509 ms 22270996',
      '= zstd 508 ms 10384319',
      '= zstd 499 ms 10384319',
      '= zstd 487 ms 10384319',
    ], { title: 'VPS thí nghiệm · pg_dump 16.15 — output thật', fs: 14 }),
    `${box('good', '<b>pg_dump 16+</b> nhận <code>--compress=zstd</code> (và <code>lz4</code>): nhanh gần bằng lz4 mà nhỏ hơn cả gzip. Ở đây: 0,5 s và 10,4 MB so với 1,4 s và 13,3 MB.')}
    ${box('warn', 'Đọc lại được CẦN <code>pg_restore</code> cùng đời, dựng có zstd. Đổi cách nén là đổi thứ bạn phải có trên <b>máy phục hồi</b> — ghi vào sổ tay.')}
    ${sh([['pg_dump -d thu -Fc --compress=zstd \\', 'nén trong lúc dump'], ['  -f thu.dump', ''], ['pg_restore --list thu.dump | head -3', 'đọc lại được không?']], { fs: 14 })}`, 'l') },

  { t: 'Bản dump là ảnh chụp lúc BẮT ĐẦU', body: two(
    anhChup(),
    `${term([
      '$ anh-chup.sh',
      '[1 ms] luc bat dau: nguoi_dung = 6',
      '+ [399 ms] da ghi va CHOT dong id=7 (pg_dump van dang chay)',
      '[1757 ms] pg_dump xong, ma thoat 0',
      'trong CSDL that : nguoi_dung = 7',
      '= trong ban dump  : nguoi_dung = 6',
    ], { title: 'VPS thí nghiệm — output thật', fs: 13.5 })}
    ${box('info', 'Đúng thiết kế: mọi bảng trong bản dump nhất quán với <b>nhau</b>. Nhưng chỉ với nhau — tệp tải lên ghi lúc 399 ms nằm trên đĩa, dòng của nó thì không có trong dump (10.5).')}`, 'l') },

  { t: 'Script sao lưu: mỗi dòng một việc', body: sh([
    ['#!/bin/bash', ''],
    ['set -Eeuo pipefail', 'lỗi ở đâu cũng dừng (Ch7)'],
    ['umask 077', 'tệp chỉ chủ đọc được'],
    ['DB=thu; DICH=~/sao-luu; TEN="$DB-$(date +%Y%m%d-%H%M)"', ''],
    ['TAM=$(mktemp -d); trap \'rm -rf "$TAM"\' EXIT', 'dọn trên MỌI đường ra'],
    ['pg_dump -d "$DB" -Fc --compress=zstd -f "$TAM/csdl.dump"', 'dữ liệu'],
    ['pg_dumpall --roles-only -f "$TAM/vai-tro.sql"', 'vai trò (10.5)'],
    ['pg_restore -f - "$TAM/csdl.dump" | awk \'…\' > "$TAM/ban-ke.txt"', 'đếm dòng TRONG dump (10.4)'],
    ['(cd "$TAM" && sha256sum csdl.dump vai-tro.sql ban-ke.txt > sha256.txt)', 'vân tay'],
    ['tar -C "$TAM" -cf - . | age -R ~/nguoi-nhan.txt \\', 'mã hoá khoá CÔNG KHAI'],
    ['  -o "$DICH/$TEN.tar.age.tam"', 'viết tên tạm…'],
    ['mv "$DICH/$TEN.tar.age.tam" "$DICH/$TEN.tar.age"', '…xong mới đổi tên'],
    ['rclone copy "$DICH/$TEN.tar.age" kho:kho/', 'ra khỏi máy (10.7)'],
    ['echo "$(date -Is) OK $TEN.tar.age …" >> "$DICH/so-sach.log"', 'một dòng sổ sách'],
  ], { fs: 14.5 }) },

  { t: 'docker exec -t làm hỏng bản dump', body: two(
    term([
      '$ docker exec dv10-pg pg_dump -U postgres -Fc thu > khong-t.dump',
      '$ docker exec -t dv10-pg pg_dump -U postgres -Fc thu > co-t.dump',
      '$ ls -l khong-t.dump co-t.dump',
      '13302026 co-t.dump',
      '13254198 khong-t.dump',
      '$ pg_restore --list khong-t.dump | wc -l',
      '= 57',
      '$ pg_restore --list co-t.dump',
      '! Segmentation fault',
      '! pg_restore --list exit=139',
      '$ pg_restore -d thu_t co-t.dump',
      '! Segmentation fault',
      '! pg_restore exit=139',
    ], { title: 'máy chạy Docker — output thật (cắt lệnh cho gọn)', fs: 13.5 }),
    `${box('bad', '<code>-t</code> cấp một <b>terminal ảo</b>: mỗi byte <code>\\n</code> trong tệp nhị phân bị đổi thành <code>\\r\\n</code>. Tệp to thêm <b>47.828 byte</b>, cả hai lệnh đều thoát 0, và bản dump không đọc lại được nữa.')}
    ${box('tip', 'Dump qua <code>docker exec</code>: <b>không</b> <code>-t</code>, không <code>-it</code>. Muốn chắc thì ghi tệp BÊN TRONG container (<code>-f /tmp/x.dump</code>) rồi <code>docker cp</code>.')}
    ${box('info', 'Bản SQL thuần dính <code>-t</code> cũng hỏng theo kiểu khác: mỗi dòng mang thêm <code>\\r</code>.')}`, 'l') },

  /* ───────────── 10.2 ───────────── */
  { t: 'Phục hồi chậm hơn dump; -j4 gỡ lại', body: two(
    `${bars([
      { l: 'psql -f thu.sql', sub: 'SQL thuần, một luồng', v: 4473, txt: '4.473 ms', c: 'amb' },
      { l: 'pg_restore', sub: 'custom, một luồng', v: 4961, txt: '4.961 ms', c: 'blu' },
      { l: 'pg_restore -j4', sub: 'custom, 4 luồng', v: 2390, txt: '2.390 ms', c: 'grn' },
    ], { lw: 200 })}
    ${term([
      '$ do-phuc-hoi.sh      # may2: moi lan mot CSDL moi',
      '  psql -f thu.sql              4473 ms   lon=400170',
      '  pg_restore (1 luong)         4961 ms   lon=400170',
      '=   pg_restore -j4               2390 ms   lon=400170',
    ], { title: 'VPS → máy thứ hai dv10-may2 — lần 2/3, thật', fs: 13 })}`,
    `${box('info', 'Ba lần đo: SQL thuần 4,5–6,7 s · một luồng 4,8–5,2 s · <b>-j4 2,4–4,2 s</b>. So với dump custom (giữa 1,9 s): phục hồi tốn gấp <b>2–3 lần</b>.')}
    ${box('warn', 'Phục hồi = chèn dữ liệu + <b>dựng lại mọi chỉ mục</b> + khoá ngoại. Dump chỉ đọc. Đừng lấy thời gian dump để ước lượng thời gian sập.')}
    ${box('tip', '<code>-j</code> chỉ chạy với <code>-Fc</code>/<code>-Fd</code>, cần CSDL đích đã có (<code>createdb</code> trước). Số luồng ≈ số nhân của máy đích.')}`, 'l') },

  { t: 'Bấm giờ trọn cú phục hồi sang máy mới', body: `${rto()}
    ${two(
      box('good', 'Từ "không có máy" tới "đã kiểm đủ 8 bảng" trên một máy MỚI: <b>9,6 giây</b>. Phần lớn là chờ Postgres khởi tạo và <code>pg_restore</code> dựng chỉ mục.'),
      box('warn', 'Đây mới là phần <b>CSDL</b>. Dựng VPS, cài Docker, đặt <code>.env</code>, xin chứng chỉ, đổi DNS nằm NGOÀI con số này (10.5). Production thật lần đầu: 281 bảng, 223.382 dòng, <b>16 s</b>.'))}` },

  { t: 'Thiếu ANALYZE: kế hoạch dựng trên đoán mò', body: two(
    term([
      '$ do-analyze.sh      # may2, autovacuum TAT de giu cua so',
      '=== NGAY sau pg_restore — chua ai chay ANALYZE ===',
      '!   ->  Nested Loop  (cost=0.42..20896.25 rows=625 width=0)',
      '61.157 ms | 42.949 ms | 38.507 ms |',
      '=== sau ANALYZE ===',
      '=   ->  Parallel Hash Join  (cost=17074.53..21254.47 rows=10695 width=0)',
      '81.161 ms | 84.751 ms | 71.832 ms |',
      'so dong that: 18681',
    ], { title: 'lon ⋈ bf, lọc du_lieu like \'a%\' — output thật', fs: 12.5 }),
    `${box('warn', 'Không thống kê ⇒ đoán <b>625</b> dòng, thật <b>18.681</b> (lệch 30×) ⇒ chọn kế hoạch khác. Ở đây mọi thứ nằm trong RAM nên kế hoạch "sai" còn nhanh hơn chút; lần đo cũ của khoá (bảng 124.946 dòng) thì <b>chậm 2,5×</b>. Cái nguy là <b>không đoán trước được</b>.')}
    ${table(['autovacuum bật (mặc định)', 'sau pg_restore'], [
      ['7 bảng lớn', 'tự ANALYZE sau ~20 s'],
      ['<code>nguoi_dung</code> (6 dòng)', '-<span>KHÔNG BAO GIỜ — dưới ngưỡng 50 dòng</span>'],
    ], { sm: true })}
    ${sh([['psql -d thu -c "ANALYZE;"', 'bước cuối của MỌI cú phục hồi']], { fs: 14 })}`, 'l') },

  { t: 'RPO và RTO trên một trục thời gian', body: `${rpo()}
    ${cards([
      { t: 'RPO — mất bao nhiêu', d: 'khoảng từ bản sao lưu cuối tới lúc sự cố. Dump 03:15 mỗi đêm ⇒ tới <strong>24 giờ</strong>.', c: 'red' },
      { t: 'RTO — sập bao lâu', d: 'từ "mất rồi" tới "phục vụ lại". Chỉ biết được bằng một lần <strong>bấm giờ thật</strong> (slide 9).', c: 'amb' },
      { t: 'Thu nhỏ RPO', d: 'dump dày hơn (rẻ, vẫn tính giờ) · lưu trữ WAL liên tục / PITR (tính phút, nhiều máy móc hơn).', c: 'blu' },
      { t: 'Thu nhỏ RTO', d: 'script phục hồi · máy dự phòng · đúng ảnh Postgres · <code>-j</code> · sổ tay có bấm giờ.', c: 'grn' },
    ], 4)}` },

  { t: 'Seed lại xoá tiến độ — cứu MỘT bảng', body: two(
    term([
      '$ cuu-tien-do.sh',
      'truoc seed : tien_do = 320',
      '! seed bao OK, ma thoat 0 — bai_hoc = 120, tien_do = 0',
      'COPY 320',
      'BEGIN',
      'CREATE TABLE',
      'COPY 320',
      'INSERT 0 320',
      'COMMIT',
      '= sau khi cuu: tien_do = 320',
    ], { title: 'VPS thí nghiệm — thật (bỏ dòng NOTICE)', fs: 12.5 }),
    `${box('bad', '<b>Chuyện thật:</b> một bộ seed "xoá hết rồi tạo lại" bảng bước học. Bảng tiến độ khai <code>ON DELETE CASCADE</code> ⇒ mỗi lần seed, mọi người dùng mất sạch dấu "đã xong". Không lỗi, không log.')}
    ${sh([
      ['createdb cuu', 'KHÔNG đè production'],
      ['pg_restore -d cuu -t bai_hoc -t tien_do dem-qua.dump', ''],
      ['psql -d cuu -c "\\copy (select … join … ) to \'tien-do.csv\' csv"', 'nối theo slug'],
      ["psql -d thu -v ON_ERROR_STOP=1 <<'SQL' … SQL", 'bảng tạm + insert … join'],
    ], { fs: 13 })}`, 'l') },

  /* ───────────── 10.3 ───────────── */
  { t: 'Tệp cụt: psql thoát 0, dữ liệu sai', body: two(
    term([
      '$ df -h /mnt/nho',
      'tmpfs            48M     0   48M   0% /mnt/nho',
      '=== pg_dump plain vao dia 48 MB ===',
      '! pg_dump: error: could not write to file: No space left on device',
      '  ma thoat: 1',
      '  tep con lai: 48M',
      '=== psql -f (mac dinh) ===',
      '  psql ma thoat: 0',
      '  so dong loi: 0',
      '!  lon=141090  bf=300000  kh=200000  tai_lieu_nhung=0',
      '=== psql -v ON_ERROR_STOP=1 ===',
      '!  psql ma thoat: 0',
    ], { title: 'máy có đĩa 48 MB → phục hồi sang may2 — output thật', fs: 13 }),
    `${box('bad', 'Tệp bị cắt đúng giữa một dòng <code>COPY</code>: <code>141090⇥8a62ffc2c8d6c376</code>. psql gặp hết tệp thì coi là hết dữ liệu ⇒ bảng <code>lon</code> nhận <b>141.090</b> dòng, dòng cuối chỉ còn 16/252 ký tự. Không lỗi nào, kể cả với <code>ON_ERROR_STOP=1</code>.')}
    ${box('warn', 'Và mọi thứ nằm SAU chỗ cắt biến mất: bảng <code>tai_lieu_nhung</code>, <b>0/12</b> chỉ mục, mọi khoá chính và khoá ngoại.')}`, 'l') },

  { t: '-Fc phát hiện được; --list thì không', body: two(
    term([
      '$ df -h /mnt/nho',
      'tmpfs            48M   42M  6.0M  88% /mnt/nho',
      '=== pg_dump -Fc vao dia con 6 MB ===',
      '! pg_dump: error: could not write to output file: No space left on device',
      '  pg_dump ma thoat: 1',
      '  tep: 6.0M (ban du: 13M)',
      '=== pg_restore --list (doc muc luc) ===',
      '!  ma thoat: 0, 8 muc TABLE DATA',
      '3646; 0 16725 TABLE DATA public lon postgres',
      '=== pg_restore -d ph3 ===',
      '= pg_restore: error: could not read from input file: end of file',
      '=  pg_restore ma thoat: 1',
      '  bf=300000  kh=200000  lon=0  tai_lieu_nhung=0',
    ], { title: 'cùng máy, định dạng custom — output thật', fs: 12 }),
    `${box('good', '<code>pg_restore</code> đọc tới chỗ đứt thì báo <b>end of file</b> và thoát 1 — tốt hơn psql. Nhưng nó vẫn để lại một CSDL <b>nửa vời</b>: bf, kh đủ; lon rỗng.')}
    ${box('bad', '<code>--list</code> chỉ đọc <b>mục lục ở đầu tệp</b> ⇒ thoát 0 và liệt kê sạch sẽ những bảng mà dữ liệu KHÔNG còn ở đó. Nó không phải phép kiểm.')}
    ${sh([['pg_restore --exit-on-error -d ph ban.dump', 'dừng ở lỗi ĐẦU'], ['pg_restore --single-transaction -d ph ban.dump', 'hỏng ⇒ không để lại gì']], { fs: 13 })}`, 'l') },

  { t: 'Mã thoát nói gì — và không nói gì', body: table(['Tình huống (đo thật)', 'Mã thoát', 'Sự thật'], [
    ['<code>pg_dump</code> ghi vào đĩa đầy', '+1 — thành thật', 'chỉ có ích nếu script kiểm (<code>set -e</code>, Ch7)'],
    ['<code>psql -f</code> tệp cụt giữa dòng COPY', '-<span>0 (cả với ON_ERROR_STOP)</span>', 'lon 141.090/400.170, dòng cuối cụt, 0 chỉ mục'],
    ['<code>psql -f</code> tệp cụt gây lỗi cú pháp (lần đo cũ)', '0 · <code>ON_ERROR_STOP=1</code> ⇒ 3', 'lon = 0 — COPY hỏng thì cuộn lại cả bảng'],
    ['<code>pg_restore</code> kho lưu bị cắt', '+1', 'vẫn để lại CSDL nửa vời'],
    ['<code>pg_restore --list</code> kho lưu bị cắt', '-<span>0</span>', 'mục lục ở đầu tệp, dữ liệu thì không'],
    ['<code>pg_restore</code> tệp dump qua <code>docker exec -t</code>', '139 — segfault', 'tệp hỏng từ lúc ghi, cả hai lệnh ghi đều thoát 0'],
    ['<code>pg_restore</code> vào ảnh thiếu pgvector', '1 · <em>errors ignored</em>', 'mất hẳn bảng có cột <code>vector</code> (10.4)'],
    ['<code>pg_restore</code> lên máy chưa có vai trò', '1 · <em>errors ignored</em>', 'đủ 400.170 dòng, app không đăng nhập được (10.5)'],
    ['<b>Phục hồi + đếm dòng từng bảng + truy vấn mẫu</b>', '+cái duy nhất nói thật', 'đây là phép kiểm (10.4)'],
  ], { sm: true }) },

  /* ───────────── 10.4 ───────────── */
  { t: 'Kiểm ở máy khác: mang theo bản kê', body: two(
    sh([
      ['TEP=$1; export PGHOST=$2 PGUSER=postgres', 'máy ĐÍCH mới tinh'],
      ['age -d -i ~/.config/age/khoa.txt "$TEP" |', 'khoá BÍ MẬT chỉ ở đây'],
      ['  tar -C "$TAM" -xf -', ''],
      ['(cd "$TAM" && sha256sum --quiet -c sha256.txt)', 'đúng từng byte?'],
      ['grep -vE \'^(CREATE|ALTER) ROLE postgres\' \\', ''],
      ['  "$TAM/vai-tro.sql" | psql -v ON_ERROR_STOP=1 -f -', 'vai trò TRƯỚC'],
      ['createdb kiem', ''],
      ['pg_restore -j4 -d kiem "$TAM/csdl.dump" || LOI=$?', ''],
      ['psql -d kiem -c analyze', ''],
      ['while read -r bang can; do', 'bản kê: bảng + số dòng'],
      ['  co=$(psql -d kiem -Atc "select count(*) from $bang")', ''],
      ['  [ "$co" = "$can" ] || LECH=1', 'thiếu bảng = lệch'],
      ['done < "$TAM/ban-ke.txt"', ''],
      ['psql -d kiem -Atc "… order by nhung <-> \'[0,…]\' limit 1"', 'truy vấn mẫu'],
    ], { fs: 13 }),
    `${box('info', '<b>Bản kê</b> (<code>ban-ke.txt</code>) được đếm TỪ CHÍNH bản dump lúc sao lưu. Máy kiểm không cần nhìn thấy production — nó so với thứ bản dump <b>lẽ ra</b> phải chứa.')}
    ${box('tip', 'Bài 10.4 gốc so với CSDL nguồn (cùng máy). Bản này chạy được ở <b>máy khác</b> — nơi phép kiểm có giá trị nhất, vì đó là nơi bạn sẽ phục hồi thật.')}
    ${box('warn', 'Truy vấn mẫu chạm vào thứ mà đếm dòng không chạm: kiểu <code>vector</code>, chỉ mục hnsw, toán tử <code>&lt;-&gt;</code>.')}`, 'l') },

  { t: 'Đúng ảnh prod thì ✓; ảnh thường thì ✗', body: two(
    term([
      '$ kiem-may-khac.sh thu-20260929-1359.tar.age may2',
      '  [85 ms] giai ma + sha256 khop',
      '  [172 ms] tao vai tro',
      '  [5559 ms] pg_restore -j4 xong, ma thoat 0, 0 dong loi',
      '  [6474 ms] analyze',
      '    …',
      '    ✓ public.lon             400170',
      '    ✓ public.nguoi_dung      6',
      '    ✓ public.tai_lieu_nhung  20000',
      '    …',
      '    truy van mau (hnsw): id=1205',
      '= ✓ PHUC HOI DUOC — khop ban ke',
      'ma thoat 0',
    ], { title: 'máy kho → may2 = pgvector/pgvector:pg16 (ĐÚNG ảnh)', dir: '~/kho', fs: 12.5 }),
    term([
      '$ kiem-may-khac.sh thu-20260929-1359.tar.age sai',
      '  …',
      '  [2453 ms] pg_restore -j4 xong, ma thoat 1, 7 dong loi',
      '!    ERROR:  extension "vector" is not available',
      '!    ERROR:  extension "vector" does not exist',
      '    …',
      '    ✓ public.lon             400170',
      '    ✓ public.nguoi_dung      6',
      '!    ✗ public.tai_lieu_nhung  can 20000, co THIEU',
      '    ✓ public.tien_do         320',
      '!    ERROR:  relation "tai_lieu_nhung" does not exist',
      '  …',
      '! ✗ KHONG DAT',
      'ma thoat 3',
    ], { title: 'cùng tệp → sai = postgres:16 (ảnh "na ná")', dir: '~/kho', fs: 12.5 }), '') },

  { t: 'Chuyện thật: bộ kiểm sai ảnh vẫn in ✅', body: two(
    `${table(['Cùng MỘT tệp backup (20/09)', 'ảnh "na ná" (không pgvector)', 'ảnh của prod'], [
      ['lỗi psql', '-<span>44</span>', '+0'],
      ['số bảng', '316', '+318'],
      ['số dòng', '340.265', '+367.043'],
      ['bộ kiểm in', '!✅ RESTORE ĐƯỢC', '✅ RESTORE ĐƯỢC'],
    ])}
    ${box('bad', 'Timer 03:00 trên máy nhà thử-restore backup prod mỗi đêm vào một ảnh Postgres <b>thiếu pgvector</b> ⇒ 2 bảng, <b>26.778 dòng</b> im lặng không về — mà vẫn in <b>✅</b>. Bản backup KHÔNG hỏng; môi trường thử mới hỏng, và phép kiểm không phân biệt được.')}`,
    `${cards([
      { t: '🎯 Đúng ảnh', d: 'thử-restore bằng <strong>đúng</strong> ảnh prod đang chạy (đọc <code>image:</code> trong compose), không phải ảnh "cùng bản 16".', c: 'grn' },
      { t: '🔢 So với bản kê', d: 'đếm bảng + dòng, so với con số lúc sao lưu. "Không lỗi" chưa phải "đủ".', c: 'blu' },
      { t: '⚠️ Tin cảnh báo', d: 'bộ kiểm vừa in lỗi vừa in ✅ ⇒ tin lỗi. Kết luận xanh phải là HỆ QUẢ của các phép so, không phải dòng cuối cố định.', c: 'amb' },
    ], 1)}`, 'l') },

  { t: 'Bộ kiểm cũng phải được kiểm', body: two(
    `${term([
      '$ docker run -d --name dv10-thu … pgvector/pgvector:pg16',
      '$ docker inspect -f "{{range .Mounts}}…{{end}}" dv10-thu',
      'volume c6599c64bff0… -> /var/lib/postgresql/data',
      '$ docker rm -f dv10-thu',
      '$ docker volume inspect -f "{{.Name}}" c6599c64bff0…',
      '! c6599c64bff0',
      '$ docker run --rm -v c6599c64bff0…:/v alpine du -sh /v',
      '! 38.2M	/v',
    ], { title: 'máy chạy Docker — output thật', fs: 12.5 })}
    ${box('bad', '<code>rm -f</code> không <code>-v</code> ⇒ volume vô danh ở lại. Rỗng: 38 MB; sau một lần phục hồi thử: <b>360–385 MB</b>. Trên máy nhà thật: 650–915 MB <b>mỗi đêm</b>. Dọn bằng <code>docker rm -fv</code>.')}`,
    `${cards([
      { t: '👻 Script không tồn tại', d: 'cron 02:05 gọi <code>verify-backup.sh</code> — tệp KHÔNG có. Hỏng câm <strong>62 ngày</strong>: chưa bản backup nào từng được thử restore.', c: 'red' },
      { t: '⏳ pg_isready nói dối', d: 'ảnh Postgres khởi tạo bằng một server TẠM rồi tắt nó. Nạp dump lúc ấy ⇒ bị cắt. Đợi dòng log <code>init process complete</code>.', c: 'amb' },
      { t: '🔢 Sai phiên bản', d: 'GitLab 31/01/2017: pg_dump <strong>9.2</strong> chạy với server <strong>9.6</strong> ⇒ hỏng câm, mail báo lỗi bị từ chối.', c: 'vio' },
    ], 1)}
    ${term(['! pg_dump: error: aborting because of server version mismatch'], { title: 'pg_dump 15.4 → server 16.15 — output thật', fs: 12.5 })}`, 'l') },

  { t: 'Báo động khi VẮNG MẶT: tuổi bản mới nhất', body: `${sh([
      ['DIR=$1; NGUONG=${2:-26}', 'mỗi đêm + 2 giờ dư'],
      ['M=$(ls -t "$DIR"/*.tar.age 2>/dev/null | head -1)', 'bản mới nhất'],
      ['[ -n "$M" ] || { echo "BAO DONG: khong co ban nao"; exit 2; }', ''],
      ['TUOI=$(( ($(date +%s) - $(stat -c %Y "$M")) / 3600 ))', 'bao nhiêu giờ tuổi'],
      ['CO=$(stat -c %s "$M")', ''],
      ['if (( TUOI > NGUONG )); then echo "BAO DONG: … $TUOI gio"; exit 1', ''],
      ['elif (( CO < 1000000 )); then echo "BAO DONG: … $CO byte"; exit 1', 'tệp bé bất thường'],
      ['else echo "OK: … $TUOI gio tuoi, $CO byte"; fi', ''],
    ], { fs: 13 })}
    ${two(term([
      '$ canh-tuoi.sh ~/kho',
      '= OK: moi nhat thu-20260929-1412.tar.age, 0 gio tuoi, 10396328 byte',
      '$ canh-tuoi.sh ~/cu      # cron sao luu da chet tu hom qua',
      '! BAO DONG: moi nhat thu-20260929-1359.tar.age da 31 gio tuoi (> 26)',
      'ma thoat 1',
      '$ canh-tuoi.sh ~/rong',
      '! BAO DONG: khong co ban sao luu nao trong /home/deploy/rong',
      'ma thoat 2',
    ], { title: 'máy kho — output thật', dir: '~', fs: 12.5 }),
    box('tip', 'Mọi phép kiểm khác nổ khi <b>hỏng</b>. Cái này nổ khi <b>không có gì chạy</b> — trường hợp log im lặng, mã thoát không có. Chạy nó ở máy KHÁC máy sao lưu (Ch9: công tắc người chết).'), 'l2')}` },

  /* ───────────── 10.5 ───────────── */
  { t: 'pg_dump có GRANT, không có CREATE ROLE', body: two(
    term([
      '$ pg_restore -f - thu.dump | grep -c ung_dung',
      '1',
      'GRANT SELECT ON TABLE public.lon TO ung_dung;',
      '$ pg_restore -d thu thu.dump   # may MOI, chua co vai tro',
      '! pg_restore: error: could not execute query: ERROR:  role "ung_dung" does not exist',
      'Command was: GRANT SELECT ON TABLE public.lon TO ung_dung;',
      '! pg_restore: warning: errors ignored on restore: 1',
      'ma thoat 1',
      '= lon=400170',
      '$ psql -h moi -U ung_dung -d thu',
      '! … FATAL:  password authentication failed for user "ung_dung"',
    ], { title: 'VPS thí nghiệm → máy mới dv10-moi — output thật', fs: 12 }),
    `${box('warn', 'Vai trò sống ở mức <b>CỤM</b>, trên mọi CSDL ⇒ <code>pg_dump</code> (một CSDL) không mang theo. Dữ liệu về đủ, ứng dụng không đăng nhập được.')}
    ${sh([['pg_dumpall --roles-only -f vai-tro.sql', 'kèm MỌI bản sao lưu'], ['psql -f vai-tro.sql', 'chạy TRƯỚC pg_restore']], { fs: 14 })}
    ${box('bad', '<code>vai-tro.sql</code> chứa mã băm SCRAM của mọi mật khẩu ⇒ nó là <b>bí mật</b>: mã hoá cùng bản dump, không bao giờ vào git.')}`, 'l') },

  { t: 'Volume Docker: sao lưu bằng container vứt đi', body: two(
    `${sh([
      ['docker run --rm \\', 'container dùng một lần'],
      ['  -v dv10-tai-len:/du-lieu:ro \\', 'volume cần sao lưu, CHỈ ĐỌC'],
      ['  -v "$PWD":/ra \\', 'thư mục trên máy chủ'],
      ['  alpine tar -C /du-lieu -cf /ra/tai-len.tar .', ''],
      ['docker volume create dv10-tai-len-moi', 'phục hồi vào volume MỚI'],
      ['docker run --rm -v dv10-tai-len-moi:/du-lieu \\', ''],
      ['  -v "$PWD":/vao:ro alpine \\', ''],
      ['  tar -C /du-lieu -xf /vao/tai-len.tar', 'giải nén vào'],
    ], { fs: 13.5 })}
    ${term([
      'dv10-tai-len       400 tep, tong bam bda5e1e41d8feafe',
      '= dv10-tai-len-moi   400 tep, tong bam bda5e1e41d8feafe',
    ], { title: 'đối chiếu: sha256 mọi tệp, sắp theo tên — output thật', fs: 13 })}`,
    `${table(['Volume 400 ảnh, 15,8 MB', 'Thời gian', 'Tệp ra'], [
      ['<code>tar -czf</code> (gzip)', '2,25 s', '15.793.512 B'],
      ['<code>tar -cf</code> (không nén)', '1,98 s', '16.051.200 B'],
    ], { sm: true })}
    ${box('info', 'Ảnh/video đã nén sẵn ⇒ gzip chỉ bớt <b>1,6%</b>. Đừng tốn CPU của VPS cho nó.')}
    ${box('warn', '<b>Đừng</b> tar thư mục dữ liệu Postgres khi nó đang chạy — tài liệu Postgres đòi tắt server. CSDL thì dùng <code>pg_dump</code>; volume này là cho <b>tệp</b>.')}
    ${box('tip', 'Trên VPS volume nằm ở <code>/var/lib/docker/volumes/&lt;tên&gt;/_data</code>. Tệp tải lên ở R2/S3 thì bật <b>versioning</b> thay vì tar.')}`, 'l') },

  { t: 'Trạng thái thì sao lưu, cấu hình thì vào git', body: two(
    `${cards([
      { ic: '🗄', t: 'CSDL', d: '<code>pg_dump -Fc</code> + <code>pg_dumpall --roles-only</code>', c: 'blu' },
      { ic: '🖼', t: 'Tệp tải lên', d: 'volume (tar) hoặc R2/S3 có versioning', c: 'tea' },
      { ic: '🔑', t: 'Bí mật', d: '<code>.env</code>, khoá age/SSH — trình quản lý mật khẩu, NGOÀI máy', c: 'amb' },
    ], 1)}`,
    `${cards([
      { ic: '📜', t: 'Cấu hình', d: 'compose, nginx.conf, unit/timer systemd, cron, tường lửa ⇒ <strong>git</strong>: đọc được, so khác được, áp lên máy mới được', c: 'grn' },
      { ic: '🌐', t: 'Ngoài máy', d: 'DNS (hạ TTL TRƯỚC), chứng chỉ TLS (xin lại sau khi DNS trỏ), webhook, OAuth redirect', c: 'vio' },
      { ic: '⏱', t: 'Sổ tay PHUC-HOI.md', d: 'dòng đầu: <strong>ngày tập lần cuối + mất bao lâu</strong>. Chưa tập = danh sách những thứ từng đúng', c: 'red' },
    ], 1)}`) },

  /* ───────────── 10.7 ───────────── */
  { t: '3-2-1: ba bản, hai nơi, một ngoài máy', body: `${baHaiMot()}
    ${box('info', '"Keep three copies of your data on two different media with one copy off-site" — Backblaze; US-CERT khuyên dùng năm 2012. Hai bản trên cùng một VPS vẫn chỉ là <b>một</b> chỗ để mất.')}` },

  { t: 'Kéo, đừng đẩy: khoá chỉ-đọc cho máy kho', body: two(
    `${conf([
      ['command="/usr/local/bin/chi-doc-backup",restrict ssh-ed25519 AAAA… kho-keo', ''],
    ], { fs: 13, lang: 'keys' })}
    ${sh([
      ['set -- ${SSH_ORIGINAL_COMMAND:-}', 'lệnh máy kho XIN chạy'],
      ['case "${1:-}" in', ''],
      ['  liet-ke)    ls -1 "$DIR" | grep \'\\.tar\\.age$\' ;;', ''],
      ['  lay)        f=$(basename -- "${2:?}")', 'cắt bỏ mọi ../'],
      ['              [[ $f == *.tar.age ]] || exit 2', ''],
      ['              cat -- "$DIR/$f" ;;', ''],
      ['  tinh-trang) … "gio tuoi" ;;', 'tuổi bản mới nhất'],
      ['  *) echo "tu choi: …" >&2; exit 2 ;;', ''],
      ['esac', ''],
    ], { fs: 13 })}`,
    `${term([
      '$ ssh vps liet-ke',
      'thu-20260929-1359.tar.age',
      'thu-20260929-1412.tar.age',
      '$ ssh vps lay thu-20260929-1412.tar.age > keo/…',
      '$ ssh vps "lay ../../../etc/shadow"',
      '! tu choi: shadow',
      '$ ssh vps "rm -rf ~/sao-luu"',
      '! tu choi: rm -rf ~/sao-luu',
      '$ ssh vps   (xin shell)',
      '! tu choi: (shell)',
      '$ ssh -N -L 9999:db:5432 vps',
      '! channel 2: open failed: administratively prohibited: open failed',
    ], { title: 'máy kho, khoá keo_backup — thật, cắt dòng', dir: '~', fs: 12.5 })}
    ${box('good', 'VPS bị chiếm cũng <b>không với tới</b> máy kho: nó không giữ khoá nào của kho. Kẻ xâm nhập xoá được <code>~/sao-luu</code>, không xoá được bản ngoài máy.')}`, 'l') },

  { t: 'rsync, rclone sang máy thứ ba — rồi kiểm', body: two(
    term([
      '$ rsync -a --info=stats1 ~/sao-luu/ kho:rsync-kho/',
      'sent 20,798,140 bytes  received 76 bytes  13,865,477.33 bytes/sec',
      '$ rclone copy ~/sao-luu/thu-….tar.age kho:kho/',
      '$ rclone check ~/sao-luu kho:kho --one-way --exclude so-sach.log',
      '= NOTICE: sftp://deploy@kho:22/kho: 0 differences found',
      '= NOTICE: sftp://deploy@kho:22/kho: 2 matching files',
    ], { title: 'VPS thí nghiệm → dv10-kho qua SSH — output thật', fs: 12.5 }),
    `${table(['', 'rsync', 'rclone'], [
      ['đích', 'máy có SSH', 'SSH/SFTP + ~70 kho: S3, R2, B2, Drive…'],
      ['đứt giữa chừng', '<code>--partial</code> nối tiếp', 'tệp tạm, chỉ đổi tên khi xong'],
      ['kiểm sau khi chép', '<code>--checksum</code> lần 2', '<code>rclone check</code> (so băm)'],
      ['dùng khi', 'máy kho của bạn', 'kho đối tượng trên mạng'],
    ], { sm: true })}
    ${box('warn', 'Một lần chép đứt ở 97% để lại tệp đúng 97%. Chép xong mà chưa so băm thì chưa biết bản ngoài máy có dùng được không.')}
    ${box('tip', 'Đẩy lên R2/S3 thì khoá chỉ nên có quyền GHI đối tượng — xoá và vòng đời đặt ở phía kho (luật 90 ngày).')}`, 'l') },

  { t: 'age: máy chủ mã hoá, không giải mã được', body: two(
    `${term([
      '$ /usr/bin/time -f "age -R ma hoa: %e s" \\',
      '    age -R ~/nguoi-nhan.txt -o t.age thu.dump',
      'age -R ma hoa: 0.05 s',
      '$ head -c 21 t.age',
      'age-encryption.org/v1',
      '$ age -d ~/sao-luu/thu-20260929-1412.tar.age',
      '! age: error: no identity matched any of the recipients',
      'ma thoat 1',
    ], { title: 'VPS thí nghiệm (chỉ có khoá CÔNG KHAI) — output thật', fs: 13 })}
    ${term([
      '$ /usr/bin/time -f "age -d giai ma: %e s" \\',
      '    age -d -i ~/.config/age/khoa.txt -o /tmp/t.dump /tmp/t.age',
      'age -d giai ma: 0.04 s',
      '$ sha256sum /tmp/t.dump | cut -c1-16',
      '= ef152030525ed945',
    ], { title: 'máy kho (giữ khoá BÍ MẬT) — output thật', dir: '~', fs: 13 })}`,
    `${table(['Tệp dump 13,25 MB', 'Mã hoá', 'Máy chủ giữ gì'], [
      ['<code>age -R</code> (khoá công khai)', '0,03–0,05 s', '+chỉ khoá công khai'],
      ['<code>gpg --symmetric</code> AES256', '0,48–1,23 s', '-<span>mật khẩu giải mã được</span>'],
      ['<code>openssl enc -pbkdf2</code> (10.4)', '58 ms / 21 MB', '-<span>mật khẩu giải mã được</span>'],
    ], { sm: true })}
    ${box('good', 'Mã hoá bằng <b>khoá công khai</b>: script trên VPS mã hoá được mà không có cách nào giải mã. Kẻ chiếm VPS lấy được tệp cũng chỉ có một khối byte vô dụng.')}
    ${box('bad', 'Khoá bí mật mất = <b>mọi</b> bản sao lưu mất. Cất ít nhất hai nơi ngoài VPS (trình quản lý mật khẩu + giấy/USB), và thử giải mã mỗi tuần.')}`, 'l') },

  { t: 'Xoay vòng: ngày, tuần, tháng — và cái bẫy', body: two(
    term([
      '$ xoay-vong.sh ~/xoay     # 151 ban, 02/05 → 29/09',
      '  giu  thu-20260929-0315.tar.age  (ngay)',
      '  …',
      '  giu  thu-20260920-0315.tar.age  (tuan)',
      '  giu  thu-20260913-0315.tar.age  (tuan)',
      '  giu  thu-20260906-0315.tar.age  (tuan)',
      '  giu  thu-20260901-0315.tar.age  (thang)',
      '  giu  thu-20260830-0315.tar.age  (tuan)',
      '  giu  thu-20260801-0315.tar.age  (thang)',
      '  giu  thu-20260701-0315.tar.age  (thang)',
      '  giu  thu-20260601-0315.tar.age  (thang)',
      '= sau: 15 ban',
      'chay lan 2: 15 ban',
    ], { title: 'VPS thí nghiệm — 7 ngày + 4 Chủ nhật + mùng 1 — output thật', fs: 12.5 }),
    `${term([
      '$ ls -1t thu-*.dump | tail -n +8 | xargs -r rm -f',
      '$ ls -l --time-style=+%d/%m | awk "NR>1{print \\$5, \\$6, \\$7}"',
      '! 0 23/09 thu-20260923.dump',
      '! 0 24/09 thu-20260924.dump',
      '!   …',
      '! 0 29/09 thu-20260929.dump',
    ], { title: '10 bản tốt rồi 8 đêm rỗng — thật, cắt dòng', fs: 12.5 })}
    ${box('bad', 'Xoay vòng theo SỐ LƯỢNG xoá đúng những bản <b>tốt</b> cuối cùng khi các bản mới đều hỏng. Chỉ đếm bản <b>đã kiểm đạt</b>, và báo động theo tuổi (slide 20).')}
    ${box('info', 'GFS giữ 15 bản mà vẫn lùi được 4 tháng. Kho đối tượng: đặt luật vòng đời (vd 90 ngày) ở phía kho.')}`, 'l') },

  /* ───────────── cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 10', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['"Có backup" nhưng chưa ai phục hồi thử', 'tệp tồn tại ≠ phục hồi được', 'kiểm tự động mỗi đêm ở máy khác (10.4)'],
    ['Phục hồi thoát 0, bảng lớn thiếu dòng', 'tệp cụt · psql coi hết tệp là hết dữ liệu', '<code>-Fc</code> + pg_restore + đếm theo bản kê'],
    ['<code>pg_restore</code> segfault / "not a valid archive"', 'dump qua <code>docker exec -t</code>', 'bỏ <code>-t</code>; ghi trong container rồi <code>docker cp</code>'],
    ['Bộ kiểm báo ✅ mà thiếu bảng', 'thử-restore bằng ảnh Postgres khác prod', 'đúng <code>image:</code> của prod'],
    ['CSDL về đủ, app không đăng nhập được', 'vai trò ở mức cụm', '<code>pg_dumpall --roles-only</code>, chạy trước'],
    ['Sau phục hồi truy vấn thất thường', 'chưa ANALYZE', '<code>ANALYZE</code> là bước cuối'],
    ['Seed lại, người dùng mất tiến độ', '<code>ON DELETE CASCADE</code> từ bảng seed', 'cứu MỘT bảng vào CSDL tạm, nối theo khoá tự nhiên'],
    ['Backup ngừng chạy mà không ai biết', 'mọi phép kiểm chỉ nổ khi HỎNG', 'báo động theo tuổi bản mới nhất'],
    ['Xoay vòng xoá mất bản tốt', 'giữ N bản mới nhất bất kể đạt hay hỏng', 'GFS + chỉ đếm bản đã kiểm'],
    ['VPS mất, backup mất theo', 'mọi bản sao trên cùng máy', '3-2-1 · máy kho KÉO · age'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 10 (1/2): làm và phục hồi', body: two(
    sh([
      ['pg_dump -d thu -Fc --compress=zstd -f thu.dump', 'mặc định nên chọn'],
      ['pg_dump -d thu -Fd -j4 -f thu.d', 'dump song song'],
      ['pg_dumpall --roles-only -f vai-tro.sql', 'vai trò'],
      ['docker exec pg pg_dump -U postgres -Fc thu > x.dump', 'KHÔNG -t'],
      ['pg_restore --list thu.dump', 'mục lục — không phải kiểm'],
      ['psql -f vai-tro.sql', 'vai trò trước'],
      ['createdb moi && pg_restore -j4 -d moi thu.dump', ''],
      ['pg_restore --exit-on-error --single-transaction …', 'hỏng thì không để lại gì'],
      ['psql -v ON_ERROR_STOP=1 -f thu.sql', 'SQL thuần'],
      ['psql -d moi -c "ANALYZE;"', 'bước cuối'],
      ['pg_restore -d cuu -t tien_do thu.dump', 'cứu MỘT bảng'],
    ], { fs: 13 }),
    `${table(['Cờ', 'Nghĩa'], [
      ['<code>-Fp/-Fc/-Fd</code>', 'SQL thuần / custom / thư mục'],
      ['<code>--compress=zstd</code>', 'nén (pg_dump 16+)'],
      ['<code>-j N</code>', 'song song (restore: -Fc/-Fd; dump: -Fd)'],
      ['<code>-t bảng</code>', 'chỉ bảng này'],
      ['<code>--no-owner</code>', 'bỏ ALTER … OWNER (máy khác tên vai trò)'],
      ['<code>--exit-on-error</code>', 'dừng ở lỗi đầu'],
      ['<code>--single-transaction</code>', 'tất cả hoặc không gì'],
    ], { sm: true })}
    ${box('tip', 'Thứ tự trên máy mới: Postgres <b>đúng ảnh</b> → vai trò → <code>pg_restore -j</code> → <code>ANALYZE</code> → đếm theo bản kê → tệp tải lên → app.')}`, 'l') },

  { t: 'Bảng tra nhanh Chương 10 (2/2): kiểm và đưa đi', body: two(
    `${sh([
      ['age-keygen -o khoa.txt', 'CHỈ trên máy kho'],
      ['age -R nguoi-nhan.txt -o x.age x.tar', 'VPS: khoá công khai'],
      ['age -d -i khoa.txt -o x.tar x.age', ''],
      ['rclone copy x.age kho:kho/ && rclone check …', 'chép rồi so băm'],
      ['rsync -a --partial ~/sao-luu/ kho:sao-luu/', ''],
      ['sha256sum -c sha256.txt', ''],
      ['docker rm -fv tam', '-v: xoá cả volume vô danh'],
    ], { fs: 13 })}
    ${conf([
      ['[Timer]', ''],
      ['OnCalendar=*-*-* 03:15:00 Asia/Ho_Chi_Minh', 'máy chạy UTC vẫn đúng giờ VN'],
      ['Persistent=true', 'máy tắt lúc 03:15 thì chạy bù'],
      ['RandomizedDelaySec=5min', ''],
    ], { fs: 13.5 })}`,
    `${term([
      '$ TZ=UTC systemd-analyze calendar --iterations=2 \\',
      '    "*-*-* 03:15:00 Asia/Ho_Chi_Minh"',
      'Normalized form: *-*-* 03:15:00 Asia/Ho_Chi_Minh',
      '    Next elapse: Tue 2026-09-29 20:15:00 UTC',
      '   Iteration #2: Wed 2026-09-30 20:15:00 UTC',
    ], { title: 'VPS thí nghiệm, systemd 255 — thật, cắt dòng', fs: 12.5 })}
    ${table(['Lịch', 'Việc'], [
      ['sau MỖI lần sao lưu', 'kiểm ở máy khác: phục hồi + bản kê + truy vấn mẫu'],
      ['mỗi 1 giờ', 'tuổi bản mới nhất &gt; 26 giờ ⇒ báo'],
      ['mỗi tuần', 'giải mã bản NGOÀI máy bằng khoá cất riêng'],
      ['mỗi quý', 'diễn tập trọn trên máy mới, bấm giờ ⇒ RTO'],
    ], { sm: true })}
    ${box('info', 'Timer và unit: khoá Linux Ch11 (11.2) và Ch16 (16.3).')}`, 'l') },

  { t: 'Thực hành Chương 10 (45 phút): một đêm sao lưu', body: `
    ${steps([
      ['Dựng <code>dv10-pg</code> (pgvector:pg16) có một bảng <code>vector</code>; chạy <code>sao-luu.sh</code> trên VPS thí nghiệm', 'một tệp <code>.tar.age</code> trong <code>~/sao-luu</code> và một bản ở máy kho'],
      ['Dump qua <code>docker exec -t</code> và không <code>-t</code>; <code>pg_restore --list</code> cả hai', 'hai kích thước + mã thoát 139'],
      ['Chạy <code>kiem-may-khac.sh</code> vào ảnh pgvector rồi vào <code>postgres:16</code>', '✓ và ✗ — ghi dòng nào báo thiếu'],
      ['Cho máy kho KÉO bằng khoá <code>command=…,restrict</code>; thử <code>lay ../../etc/shadow</code>', 'bị từ chối, mã 2'],
      ['Bấm giờ từ "máy trống" tới "khớp bản kê"; điền PHUC-HOI.md', 'con số RTO phần CSDL của máy bạn'],
    ])}
    ${box('good', '<b>Đạt khi:</b> có một bản sao lưu đã mã hoá nằm ngoài VPS, một lần phục hồi ✓ và một lần ✗ vì sai ảnh, một con số RTO bấm giờ thật — và <code>docker ps -a --filter label=dvhoc=10</code> rỗng.')}` },
].map((s) => (s.kind === 'cover' ? s : { ...s, body: FIX + s.body })));
