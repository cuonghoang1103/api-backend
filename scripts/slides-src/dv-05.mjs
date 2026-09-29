/**
 * Deploy lên VPS · Deck dv-05 — Chương 5: Cơ sở dữ liệu — migration và cái cửa sổ nằm giữa.
 *
 * MỌI output terminal trên slide là output THẬT, chạy 29/09/2026 trong "VPS thí nghiệm" (hợp đồng mục 7b):
 *   • vps = container ubuntu:24.04 `dv05-vps` (sshd, người dùng `deploy`, psql 16) — SSH từ Mac qua 127.0.0.1:19052
 *   • CSDL = container `dv05-pg` (ảnh postgres:16 → PostgreSQL 16.14, --memory 1g), cùng mạng Docker `dv05-net`,
 *     Mac M1 ⇒ số mili giây là của máy thí nghiệm; VPS 6 GB thật đĩa chậm hơn, nên số thật thường LỚN hơn.
 *   • bảng thử: nd1m (1 triệu dòng, 87 MB) · nd5m (5 triệu dòng, 464 MB): id bigserial, ten, email, tao.
 *   • "request" = một lệnh psql mới mỗi 250 ms trong 14 s (probe.sh), migration bắt đầu ở giây 2.
 *   • Prisma = 5.22.0 (đúng bản của kho mã), chạy từ Mac vào dv05-pg (127.0.0.1:19053).
 *   • "seed OK giả" = script bash thật + container dv05-app bị `docker stop` giữa chừng.
 *
 * Hình tự vẽ (SVG nội tuyến): cuaSoSvg() request của mã cũ đỏ lên sau cú đổi tên · banLuongSvg() ba thứ tự
 * migration/tráo và chỗ lệch · ecSvg() bốn giai đoạn mở rộng–thu hẹp · hangDoiSvg() hàng đợi khoá sau một SELECT dài.
 */
import { S, cover, sh, term, pipe, mindmap, cards, box, steps, table, two, bars, code, sv, R, T, A, D } from './_dv-chung.mjs';

export const deck = { key: 'dv-05', code: 'DEPLOY · CHƯƠNG 5', title: 'Migration CSDL', sub: 'Deploy lên VPS · Chương 5' };

const FIX = '<style>.c-two>div>*+*{margin-top:12px}.c-t.sm{font-size:15px}.c-t.sm td,.c-t.sm th{padding:6px 10px}.l-pp .st{min-width:120px}.c-code{margin:0}</style>';

/** Khối SQL tô màu kiểu VS Code (highlight.js), cỡ chữ chỉnh được. */
const sql = (src, fs = 15) => code(src, 'sql').replace('<pre class="c-code">', `<pre class="c-code" style="font-size:${fs}px;line-height:1.45">`);

/* Slide 3 — mã CŨ hỏi "email" mỗi 250 ms; ở 1005 ms migration đổi tên; ở 3000 ms mã MỚI thay vào (số đo thật) */
const cuaSoSvg = () => {
  const X = (t) => 150 + t * 0.195; // ms → px (0–5000 ms ⇒ 150–1125)
  let s = '';
  s += `<rect x="${X(1005)}" y="10" width="${X(3000) - X(1005)}" height="150" fill="rgba(255,92,108,.10)" stroke="${D.red}" stroke-dasharray="6 5" rx="8"/>`;
  s += T((X(1005) + X(3000)) / 2, 32, 'CỬA SỔ: 8/8 request của mã cũ LỖI', { fs: 15, a: 'middle', b: true, c: 'red' });
  s += T(0, 76, 'mã CŨ', { fs: 16, b: true, c: 'amb' }) + T(0, 96, 'select email', { fs: 13.5, c: 'mu', mono: true });
  s += T(0, 136, 'mã MỚI', { fs: 16, b: true, c: 'grn' }) + T(0, 156, 'select dia_chi_email', { fs: 13.5, c: 'mu', mono: true });
  [5, 250, 498, 747, 995].forEach((t) => { s += `<circle cx="${X(t)}" cy="78" r="8" fill="${D.grn}"/>`; });
  [1240, 1482, 1738, 1988, 2236, 2498, 2748, 3001].forEach((t) => { s += `<circle cx="${X(t)}" cy="78" r="8" fill="${D.red}"/>`; });
  [3240, 3486, 3727, 3980, 4214, 4466, 4713, 4965].forEach((t) => { s += `<circle cx="${X(t)}" cy="136" r="8" fill="${D.grn}"/>`; });
  s += `<path d="M${X(1005)} 50 L${X(1005)} 190" stroke="${D.vio}" stroke-width="3"/>` + T(X(1005) + 8, 206, 'migration đổi tên: 3,4 ms ✓', { fs: 14, c: 'vio', b: true });
  s += `<path d="M${X(3000)} 50 L${X(3000)} 190" stroke="${D.grn}" stroke-width="3"/>` + T(X(3000) + 8, 206, 'mã mới thay mã cũ', { fs: 14, c: 'grn', b: true });
  s += `<path d="M${X(0)} 230 L${X(5000)} 230" stroke="${D.dim}" stroke-width="2"/>`;
  [0, 1000, 2000, 3000, 4000, 5000].forEach((t) => { s += `<path d="M${X(t)} 224 L${X(t)} 236" stroke="${D.dim}" stroke-width="2"/>` + T(X(t), 254, `${t / 1000} s`, { fs: 13.5, a: 'middle', c: 'mu', mono: true }); });
  return sv(1150, 262, s);
};

/* Slide 4 — ba thứ tự, mỗi hàng là một trục thời gian; đoạn đỏ/vàng = mã và lược đồ lệch nhau */
const banLuongSvg = () => {
  let s = '';
  const x0 = 250, W = 890;
  const seg = (y, a, b, txt, c, fill) => R(x0 + a * W, y, (b - a) * W - 4, 44, { c, r: 8, fill, sw: 2 }) + T(x0 + (a + b) / 2 * W, y + 28, txt, { fs: 14, a: 'middle', b: true, c: c === 'grn' ? 'tx' : c });
  const mk = (y, a, txt, c) => `<path d="M${x0 + a * W - 2} ${y - 8} L${x0 + a * W - 2} ${y + 52}" stroke="${D[c]}" stroke-width="3"/>` + T(x0 + a * W - 2, y - 14, txt, { fs: 13.5, a: 'middle', c, b: true });
  const G = 'rgba(63,185,80,.10)', Rd = 'rgba(255,92,108,.16)', Am = 'rgba(245,183,0,.14)';
  // A
  s += T(0, 58, 'A · migrate TRƯỚC', { fs: 16, b: true, c: 'blu' }) + T(0, 80, 'phổ biến nhất', { fs: 13.5, c: 'mu' });
  s += seg(40, 0, 0.26, 'mã cũ · lược đồ cũ', 'grn', G) + seg(40, 0.26, 0.62, 'mã CŨ · lược đồ MỚI', 'red', Rd) + seg(40, 0.62, 1, 'mã mới · lược đồ mới', 'grn', G);
  s += mk(40, 0.26, 'migrate', 'vio') + mk(40, 0.62, 'tráo', 'grn');
  // B
  s += T(0, 168, 'B · migrate SAU', { fs: 16, b: true, c: 'blu' }) + T(0, 190, 'mã đi trước', { fs: 13.5, c: 'mu' });
  s += seg(150, 0, 0.26, 'mã cũ · lược đồ cũ', 'grn', G) + seg(150, 0.26, 0.62, 'mã MỚI · lược đồ CŨ', 'red', Rd) + seg(150, 0.62, 1, 'mã mới · lược đồ mới', 'grn', G);
  s += mk(150, 0.26, 'tráo', 'grn') + mk(150, 0.62, 'migrate', 'vio');
  // C
  s += T(0, 278, 'C · xanh-lam', { fs: 16, b: true, c: 'blu' }) + T(0, 300, '+ lùi bản', { fs: 13.5, c: 'mu' });
  s += seg(260, 0, 0.18, 'cũ · cũ', 'grn', G) + seg(260, 0.18, 0.4, 'CŨ · lược đồ MỚI', 'red', Rd) + seg(260, 0.4, 0.62, 'CŨ + MỚI cùng chạy', 'amb', Am) + seg(260, 0.62, 0.8, 'mới · mới', 'grn', G) + seg(260, 0.8, 1, 'lùi: CŨ · MỚI', 'red', Rd);
  s += mk(260, 0.18, 'migrate', 'vio') + mk(260, 0.4, 'bản mới lên', 'grn') + mk(260, 0.62, 'tắt bản cũ', 'grn') + mk(260, 0.8, 'lùi bản', 'red');
  s += T(x0, 350, 'Ô đỏ chỉ vô hại khi lược đồ ở đó đọc/ghi được bằng CẢ HAI phiên bản mã — đó là luật của cả chương.', { fs: 15, c: 'tx' });
  return sv(1150, 362, s);
};

/* Slide 7 — bốn giai đoạn mở rộng–thu hẹp */
const ecSvg = () => {
  let s = '';
  const cw = 262, gap = 34;
  const cols = [
    { h: 'GĐ1 · lúc đầu', k: 'chưa đổi gì', cot: ['email'], tg: false, cu: '✓', moi: '✗ chưa deploy', c: 'dim' },
    { h: 'GĐ2 · MỞ RỘNG', k: 'deploy LƯỢC ĐỒ', cot: ['email', 'dia_chi_email'], tg: true, cu: '✓', moi: '✓ (nếu có)', c: 'blu' },
    { h: 'GĐ3 · CHUYỂN', k: 'deploy MÃ', cot: ['email', 'dia_chi_email'], tg: true, cu: '✓ (đích lùi)', moi: '✓', c: 'vio' },
    { h: 'GĐ4 · THU HẸP', k: 'deploy LƯỢC ĐỒ (xoá)', cot: ['dia_chi_email'], tg: false, cu: '— đã hết', moi: '✓', c: 'red' },
  ];
  cols.forEach((o, i) => {
    const x = i * (cw + gap);
    s += R(x, 0, cw, 330, { c: o.c, r: 14, fill: '#0d1420' });
    s += T(x + cw / 2, 32, o.h, { fs: 17, a: 'middle', b: true, c: o.c === 'dim' ? 'tx' : o.c });
    s += T(x + cw / 2, 56, o.k, { fs: 14, a: 'middle', c: 'mu' });
    s += T(x + 16, 90, 'bảng nguoi_dung:', { fs: 14, c: 'mu' });
    o.cot.forEach((ct, j) => { s += R(x + 16, 102 + j * 46, cw - 32, 36, { c: ct === 'email' ? 'amb' : 'grn', r: 7, sw: 2 }) + T(x + cw / 2, 126 + j * 46, ct, { fs: 15, a: 'middle', mono: true }); });
    if (o.tg) s += T(x + cw / 2, 214, '⚙ trigger đồng bộ', { fs: 14.5, a: 'middle', c: 'lx', b: true });
    s += `<path d="M${x + 16} 236 L${x + cw - 16} 236" stroke="${D.bd}" stroke-width="1.5"/>`;
    s += T(x + 16, 266, 'mã cũ:', { fs: 14.5, c: 'amb' }) + T(x + 86, 266, o.cu, { fs: 14.5, c: o.cu.startsWith('✓') ? 'grn' : 'mu', b: true });
    s += T(x + 16, 300, 'mã mới:', { fs: 14.5, c: 'grn' }) + T(x + 86, 300, o.moi, { fs: 14.5, c: o.moi.startsWith('✓') ? 'grn' : 'red', b: true });
    if (i < 3) s += A(x + cw + 3, 165, x + cw + gap - 3, 165, { c: 'dv', sw: 3 });
  });
  return sv(1150, 336, s);
};

/* Slide 14 — hàng đợi khoá: SELECT dài giữ khoá, ALTER chờ, request mới xếp hàng sau ALTER (số đo thật) */
const hangDoiSvg = () => {
  const X = (t) => 250 + t * 0.072; // ms → px (0–12100 ms)
  let s = '';
  const lane = (y, nm, sub, c) => T(0, y + 22, nm, { fs: 15, b: true, c }) + T(0, y + 42, sub, { fs: 13, c: 'mu', mono: true });
  s += lane(0, 'A · báo cáo dài', 'AccessShare ✓', 'blu');
  s += `<rect x="${X(0)}" y="6" width="${X(12070) - X(0)}" height="34" rx="6" fill="${D.blu}" opacity=".75"/>` + T(X(6000), 29, 'BEGIN; SELECT …; pg_sleep(12) — giữ khoá tới COMMIT', { fs: 14, a: 'middle', b: true, c: '#0b1018' });
  s += lane(62, 'B · migration', 'AccessExclusive ✗', 'vio');
  s += `<rect x="${X(1008)}" y="68" width="${X(12070) - X(1008)}" height="34" rx="6" fill="rgba(167,139,250,.18)" stroke="${D.vio}" stroke-dasharray="6 5"/>` + T(X(6500), 91, 'ALTER … ADD COLUMN (lệnh "tức thì") — CHỜ A', { fs: 14, a: 'middle', c: 'vio', b: true });
  s += lane(124, 'C · request web', 'AccessShare ✗', 'red');
  s += `<rect x="${X(2020)}" y="130" width="${X(12071) - X(2020)}" height="34" rx="6" fill="rgba(255,92,108,.14)" stroke="${D.red}" stroke-dasharray="6 5"/>` + T(X(7000), 153, 'SELECT … WHERE id = 42 — CHỜ B (dù không xung đột với A)', { fs: 14, a: 'middle', c: 'red', b: true });
  s += `<path d="M${X(12070)} 0 L${X(12070)} 176" stroke="${D.grn}" stroke-width="2.5"/>` + T(X(12070) - 6, 192, 'A commit ⇒ B xong ⇒ C xong: 12,07 s', { fs: 13.5, a: 'end', c: 'grn' });
  s += `<path d="M${X(0)} 206 L${X(12100)} 206" stroke="${D.dim}" stroke-width="2"/>`;
  [0, 2000, 4000, 6000, 8000, 10000, 12000].forEach((t) => { s += `<path d="M${X(t)} 200 L${X(t)} 212" stroke="${D.dim}" stroke-width="2"/>` + T(X(t), 230, `${t / 1000} s`, { fs: 13, a: 'middle', c: 'mu', mono: true }); });
  return sv(1150, 236, s);
};

export const slides = S([
  cover({ t: 'Chương 5 — Cơ sở dữ liệu: migration và cái cửa sổ nằm giữa', sub: 'mã và lược đồ lên ở hai thời điểm · mở rộng–thu hẹp · khoá và hàng đợi khoá · migration kẹt P3009 · lấp dữ liệu và chỗ của migration trong script', chap: 'CHƯƠNG 5' }),

  { t: 'Bản đồ chương: một CSDL, hai phiên bản mã', body: mindmap('Migration', 'lược đồ phải chiều được CẢ HAI bản mã', [
    { t: '5.1 Hai thời điểm', d: 'đổi tên cột 3 ms ⇒ 2 giây lỗi · xanh-lam làm cửa sổ DÀI hơn · lùi mã ≠ lùi lược đồ', c: 'blu' },
    { t: '5.2 Mở rộng–thu hẹp', d: 'bốn giai đoạn, bốn lần deploy · trigger đồng bộ · GĐ4 hay bị quên', c: 'vio' },
    { t: '5.3 Khoá', d: 'ADD COLUMN 0,7 ms vs 8,1 s · hàng đợi khoá · lock_timeout · CONCURRENTLY', c: 'amb' },
    { t: '5.4 Kẹt nửa chừng', d: 'P3018 → P3009 · soi rồi mới resolve · migrate diff · shadow DB P3006', c: 'red' },
    { t: '5.5 Lấp dữ liệu', d: 'theo lô · migration TRƯỚC khi tráo · timeout · seed không phải "phụ"', c: 'tea' },
    { t: 'Chuyện thật', d: 'drift + P3009 chặn deploy · migrate dev hỏng vì shadow DB · seed báo OK khi backend đã bị tráo', c: 'grn' },
  ]) },

  /* ───────────── 5.1 hai thời điểm ───────────── */
  { t: 'Đổi tên cột: 3 ms migration, 2 giây lỗi', body: `
    ${cuaSoSvg()}
    ${two(
      term(['$ bash cuaso.sh', '  [995 ms] ma CU: nd1|nd1@x.com', '+   [1005 ms] MIGRATION: Time: 3.381 ms', '!   [1240 ms] ma CU: ERROR:  column "email" does not exist', '  … (8 dòng lỗi như vậy tới 3001 ms)', '=   [3240 ms] ma MOI: nd1|nd1@x.com'], { title: 'vps → dv05-pg — output thật', fs: 13.5 }),
      box('bad', 'Migration <b>báo thành công</b> — log của nó không có gì đỏ. Lỗi nằm ở phía <b>mã cũ</b>, trên MỌI request chạm bảng đó, cho tới khi tiến trình cũ cuối cùng tắt. Ở web thật cửa sổ này là cả thời gian build + tráo.'), 'l')}` },

  { t: 'Cửa sổ nằm giữa migration và mã mới', body: `
    ${banLuongSvg()}
    ${two(
      box('warn', '<b>Lùi MÃ không lùi LƯỢC ĐỒ.</b> Đang có sự cố mà lùi về bản trước là đặt mã cũ trước lược đồ mới — mở lại đúng ô đỏ, vào lúc tệ nhất.'),
      box('info', 'Chuyện thật 03/07: hai workflow deploy đua nhau khi push <code>main</code> ⇒ ảnh mới chạy trên lược đồ chưa migrate ⇒ feed trả <b>500</b>. Đó là hàng B, do không ai chọn thứ tự.'))}` },

  { t: 'Thay đổi nào tự thân an toàn với mã cũ', body: two(
    table(['Thay đổi', 'Mã CŨ còn chạy?', 'Vì sao'], [
      ['Thêm cột cho phép NULL', '+có', 'mã cũ không chọn nó'],
      ['Thêm bảng / chỉ mục', '+có', 'chưa ai tham chiếu — chỉ tốn khoá (5.3)'],
      ['Thêm cột <code>NOT NULL DEFAULT</code> hằng', '+có', 'lệnh chèn cũ nhận giá trị mặc định'],
      ['Thêm cột <code>NOT NULL</code> không mặc định', '-không', 'mọi INSERT của mã cũ hỏng'],
      ['Đổi tên / xoá cột, bảng', '-không', '<code>column "…" does not exist</code>'],
      ['Thu hẹp kiểu, thêm <code>UNIQUE</code>/CHECK', '!tuỳ dữ liệu', 'dòng đang có có thể vi phạm sẵn (5.4)'],
      ['Đổi giá trị mặc định', '!tuỳ mã', 'mã có tự cấp giá trị không?'],
    ], { sm: true }),
    `${box('good', '<b>Luật của chương:</b> mọi migration phải để CSDL ở trạng thái mà bản phát hành <b>TRƯỚC ĐÓ</b> vẫn chạy được. Không làm được trong một bước ⇒ nhiều lần deploy — chuyện bình thường.')}
    ${box('tip', 'Soi nhanh một migration: có dòng nào <code>DROP</code>, <code>RENAME</code>, <code>SET NOT NULL</code>, <code>TYPE</code>, <code>UNIQUE</code>? Có ⇒ phải tách giai đoạn (5.2).')}`, 'l') },

  { t: 'Không thứ tự nào cứu được migration hỏng', body: two(
    sh([
      ['# thứ tự trong script deploy — migration ở ĐÂU?', ''],
      ['# A) TRƯỚC khi tráo (phổ biến nhất)', ''],
      ['npx prisma migrate deploy', 'lược đồ MỚI, mã CŨ còn chạy'],
      ['docker compose up -d --no-build backend', 'tráo'],
      ['# B) SAU khi tráo', ''],
      ['docker compose up -d --no-build backend', 'mã MỚI, lược đồ CŨ'],
      ['npx prisma migrate deploy', ''],
      ['# C) bước RIÊNG, không dính vào deploy', ''],
      ['docker compose run --rm backend npx prisma migrate deploy', 'một tiến trình một-lần'],
    ], { fs: 13.5 }),
    `${steps([
      ['Migration <b>không an toàn</b>: A vỡ mã cũ, B vỡ mã mới', 'đổi thứ tự chỉ đổi nạn nhân'],
      ['Cửa sổ bảo trì: dừng app → migrate → bật lại', 'chạy được, tốn một lần gián đoạn'],
      ['Câu trả lời thật: <b>đổi chính migration</b>', 'tách thành các bước tự thân an toàn — 5.2'],
      ['Thứ tự chỉ quan trọng KHI mọi bước đã an toàn', 'khi đó: chọn A, và chọn có chủ ý'],
    ])}`, 'l') },

  /* ───────────── 5.2 mở rộng–thu hẹp ───────────── */
  { t: 'Mở rộng → chuyển → thu hẹp: bốn deploy', body: `
    ${ecSvg()}
    ${two(
      box('good', 'Không có khoảnh khắc nào phiên bản đang chạy bị vỡ, và ở GĐ2–GĐ3 đích lùi bản <b>vẫn hợp lệ</b>. Lỗi ở GĐ4 của mã cũ là ĐÚNG — mã cũ lẽ ra không còn tồn tại.'),
      box('warn', 'GĐ4 chỉ chạy khi <b>không còn bản cũ nào có thể bị lùi về</b> — thường là sau ít nhất một chu kỳ deploy. Lên lịch GĐ4 ngay lúc viết GĐ2.'))}` },

  { t: 'Giai đoạn 2: thêm cột, lấp, trigger đồng bộ', body: two(
    sql([
      '-- 1. thêm cột mới (cho NULL — an toàn với mã cũ)',
      'ALTER TABLE nguoi_dung ADD COLUMN dia_chi_email text;',
      '-- 2. lấp dữ liệu đang có (bảng lớn: theo LÔ, 5.5)',
      'UPDATE nguoi_dung SET dia_chi_email = email;',
      '-- 3. giữ hai cột khớp nhau, bên nào ghi cũng vậy',
      'CREATE OR REPLACE FUNCTION sync_row() RETURNS trigger AS $$',
      'BEGIN',
      "  IF TG_OP = 'INSERT' THEN",
      '    NEW.dia_chi_email := coalesce(NEW.dia_chi_email, NEW.email);',
      '    NEW.email         := coalesce(NEW.email, NEW.dia_chi_email);',
      '  ELSIF NEW.email IS DISTINCT FROM OLD.email THEN',
      '    NEW.dia_chi_email := NEW.email;      -- mã CŨ vừa sửa',
      '  ELSIF NEW.dia_chi_email IS DISTINCT FROM OLD.dia_chi_email THEN',
      '    NEW.email := NEW.dia_chi_email;      -- mã MỚI vừa sửa',
      '  END IF;',
      '  RETURN NEW;',
      'END $$ LANGUAGE plpgsql;',
      'CREATE TRIGGER tg_sync_row BEFORE INSERT OR UPDATE ON nguoi_dung',
      '  FOR EACH ROW EXECUTE FUNCTION sync_row();',
    ].join('\n'), 13),
    `${box('info', '<code>BEFORE</code> mới sửa được chính dòng đang ghi (gán <code>NEW.…</code>). <code>AFTER</code> thì dòng đã nằm trên đĩa rồi.')}
    ${box('tip', 'Ghi lý do ngay trên lược đồ: <code>COMMENT ON COLUMN nguoi_dung.email IS \'tạm thời — bỏ ở GĐ4 sau 2026-10-15\';</code>')}
    ${box('warn', 'Ghi-đôi trong <b>mã ứng dụng</b> thay cho trigger chỉ phủ phiên bản CÓ đoạn ghi-đôi — lệnh ghi của phiên bản kia vẫn lọt.')}`, 'l2') },

  { t: 'Trigger chỉ lấp NULL bỏ sót lệnh SỬA', body: two(
    `${sql([
      '-- bản trigger "ngây thơ" (cả Bài 5.2 cũ cũng dùng)',
      'IF NEW.dia_chi_email IS NULL THEN',
      '  NEW.dia_chi_email := NEW.email; END IF;',
      'IF NEW.email IS NULL THEN',
      '  NEW.email := NEW.dia_chi_email; END IF;',
    ].join('\n'), 14.5)}
    ${term(['# trigger ngây thơ: mã CŨ sửa email của nd1', '$ psql -c "update nguoi_dung set email = \'doi@x.com\' where id = 1"', '! email=doi@x.com  dia_chi_email=nd1@x.com', '# trigger đã sửa (so với OLD): mã CŨ sửa, rồi mã MỚI sửa', '= email=lan2@x.com  dia_chi_email=lan2@x.com', '= email=lan3@x.com  dia_chi_email=lan3@x.com'], { title: 'vps → dv05-pg — output thật', fs: 13 })}`,
    `${box('bad', 'Với <b>UPDATE</b>, <code>NEW</code> mang sẵn giá trị cũ của cột kia (không NULL) ⇒ trigger ngây thơ không làm gì. Mã cũ đổi email, mã mới vẫn đọc email <b>cũ</b> — lệch câm, không lỗi nào.')}
    ${box('good', 'Sửa: phân biệt <code>INSERT</code>/<code>UPDATE</code> và so <code>NEW</code> với <code>OLD</code> để biết <b>bên nào vừa đổi</b> (slide 8).')}
    ${box('tip', 'Kiểm được: sau GĐ2 chạy <code>SELECT count(*) FROM nguoi_dung WHERE email IS DISTINCT FROM dia_chi_email;</code> — phải bằng 0 trước GĐ4.')}`) },

  { t: 'Đo thật: mã cũ ghi, mã mới đọc được ngay', body: two(
    term(['── GD1: truoc khi bat dau ──', '    ma CU : nd1|nd1@x.com', '!     ma MOI: ERROR:  column "dia_chi_email" does not exist', '── GD2: THEM cot moi + trigger (chua doi ma) ──', '    ma CU : nd1|nd1@x.com', '=     ma MOI: nd1|nd1@x.com', "=     ma CU ghi 'nd_cu' → ma MOI doc: nd_cu@x.com", "=     ma MOI ghi 'nd_moi' → ma CU doc: nd_moi@x.com", '── GD3: deploy ma MOI — ca hai van chay ──', '    ma CU : nd1|nd1@x.com', '    ma MOI: nd1|nd1@x.com', '── GD4: THU HEP — bo cot cu ──', '!     ma CU : ERROR:  column "email" does not exist', '=     ma MOI: nd1|nd1@x.com'], { title: 'vps → dv05-pg: bash ec.sh — output thật', fs: 13.5 }),
    `${steps([
      ['GĐ2 = đổi <b>lược đồ</b>, không đổi mã', 'mã cũ không thấy gì khác'],
      ['Ghi từ bên nào cũng thấy ở cả hai', 'trigger lấp cột còn lại'],
      ['GĐ3 = đổi <b>mã</b>, không đổi lược đồ', 'lùi bản vẫn an toàn'],
      ['GĐ4 = bước PHÁ HUỶ duy nhất', 'bỏ trigger, hàm, rồi cột cũ'],
    ])}`, 'l') },

  { t: 'Cùng khuôn cho NOT NULL, đổi kiểu, tách cột', body: `
    ${table(['Muốn', 'Mở rộng (GĐ2)', 'Chuyển (GĐ3)', 'Thu hẹp (GĐ4)'], [
      ['Cột thành NOT NULL', 'thêm <code>DEFAULT</code>, lấp NULL theo lô', 'mã luôn tự cấp giá trị', '<code>CHECK … NOT VALID</code> → <code>VALIDATE</code> → <code>SET NOT NULL</code> (5.3)'],
      ['Đổi kiểu (<code>int</code> → <code>bigint</code>)', 'cột MỚI kiểu mới + trigger', 'mã đọc/ghi cột mới', 'bỏ cột cũ — đừng <code>ALTER TYPE</code> tại chỗ'],
      ['Tách <code>ho_ten</code> → <code>ho</code> + <code>ten</code>', 'thêm 2 cột, lấp, trigger giữ cả BA', 'mã dùng cặp mới', 'bỏ cột gộp'],
      ['Chuyển cột sang bảng khác', 'bảng mới + trigger ghi xuyên bảng', 'mã JOIN bảng mới', 'bỏ cột ở bảng cũ'],
    ], { sm: true })}
    ${cards([
      { ic: '🌙', t: 'Khi nào cửa sổ bảo trì là ĐỦ', d: 'đồ án một người, không ai dùng lúc 3 giờ sáng: dừng → migrate → bật. <strong>Một deploy, hai phút gián đoạn</strong>, không trigger.', c: 'blu' },
      { ic: '🔁', t: 'Khi nào PHẢI mở rộng–thu hẹp', d: 'có người dùng thật, tráo xanh-lam, cần lùi bản được. Nhóm SWP391 đang demo cho hội đồng cũng tính.', c: 'vio' },
      { ic: '🧹', t: 'Cái giá hay bị quên', d: 'GĐ4 không ai làm ⇒ hai năm sau bảng có <strong>sáu cột bỏ hoang</strong> và ba trigger không ai dám xoá.', c: 'amb' },
    ], 3)}` },

  /* ───────────── 5.3 khoá ───────────── */
  { t: 'ADD COLUMN: hằng số tức thì, hàm ghi lại bảng', body: two(
    table(['Câu lệnh', '1 triệu · 87 MB', '5 triệu · 464 MB'], [
      ['<code>ADD COLUMN ghi_chu text</code>', '+4,3 ms', '+0,7 ms'],
      ['<code>ADD COLUMN … NOT NULL DEFAULT \'moi\'</code>', '+1,8 ms', '+0,7 ms'],
      ['<code>ADD COLUMN ma uuid DEFAULT gen_random_uuid()</code>', '-<span>1.674 ms</span>', '-<span>8.106 ms</span>'],
      ['<code>ALTER COLUMN ten TYPE varchar(80)</code>', '-<span>927 ms</span>', '-<span>6.726 ms</span>'],
      ['<code>ALTER COLUMN email SET NOT NULL</code> (quét)', '!106 ms', '!853 ms'],
    ], { sm: true }),
    `${bars([
      { l: 'DEFAULT hằng số', sub: '5 triệu dòng', v: 0.7, txt: '0,7 ms', c: 'grn' },
      { l: 'SET NOT NULL', sub: 'quét, không ghi', v: 853, txt: '853 ms', c: 'amb' },
      { l: 'ALTER TYPE', sub: 'kiểm từng dòng', v: 6726, txt: '6.726 ms', c: 'red' },
      { l: 'DEFAULT hàm', sub: 'ghi lại MỌI dòng', v: 8106, txt: '8.106 ms', c: 'red' },
    ], { lw: 170 })}
    ${box('info', 'Từ PostgreSQL 11, mặc định <b>hằng số</b> nằm trong danh mục và áp lúc đọc ⇒ không đụng dòng nào. Hàm <b>biến thiên</b> cần giá trị riêng mỗi dòng ⇒ ghi lại cả bảng (cả loạt lệnh: 464 → 582 MB). Lời khuyên viết trước 2018 đã hết hạn một nửa.')}`, 'l') },

  { t: 'Trong 9,4 giây đó, cả đọc lẫn ghi đều đứng', body: two(
    `${term(['# 56 request, mỗi 250 ms; migration bắt đầu ở giây 2', '══ A) khong co migration — moc doi chieu ══', '= request: 56 cai · cham hon 500 ms: 0 · loi: 0 · trung binh 32 ms · lau nhat 68 ms', '══ B) ADD COLUMN ma2 uuid DEFAULT gen_random_uuid() — GHI ══', '  migration: … (9448 ms) OK', '! request: 56 cai · cham hon 500 ms: 35 · loi: 0 · trung binh 3180 ms · lau nhat 9374 ms', '══ C) cùng lệnh đó — request ĐỌC (select … where id = 4242) ══', '  migration: … (9691 ms) OK', '! request: 56 cai · cham hon 500 ms: 36 · loi: 0 · trung binh 3327 ms · lau nhat 9607 ms'], { title: 'vps: probe.sh trên nd5m — output thật', fs: 12 })}`,
    `${bars([
      { l: 'không migration', sub: 'lâu nhất', v: 68, txt: '68 ms', c: 'grn' },
      { l: 'ALTER — ghi', sub: 'lâu nhất', v: 9374, txt: '9.374 ms', c: 'red' },
      { l: 'ALTER — đọc', sub: 'lâu nhất', v: 9607, txt: '9.607 ms', c: 'red' },
    ], { lw: 150 })}
    ${box('bad', '<code>ALTER TABLE</code> lấy <b>ACCESS EXCLUSIVE</b> — xung đột với MỌI thứ, kể cả <code>SELECT</code>. Không request nào lỗi: chúng <b>đứng chờ</b>. Sau nginx (<code>proxy_read_timeout</code> mặc định 60 s) một bảng vài chục triệu dòng là <b>504</b>.')}`, 'l2') },

  { t: 'Hàng đợi khoá: một SELECT dài chặn cả bảng', body: `
    ${hangDoiSvg()}
    ${term(['$ psql -c "select pid, state, wait_event_type as cho, wait_event, pg_blocking_pids(pid) as bi_chan_boi, left(query,44) …"', ' pid | state  |   cho   | wait_event | bi_chan_boi |                    query', '  84 | active | Timeout | PgSleep    | {}          | begin; select count(*) from nd1m where id <', '!  85 | active | Lock    | relation   | {84}        | set lock_timeout=\'0\'; alter table nd1m add c', '!  86 | active | Lock    | relation   | {85}        | select ten from nd1m where id = 42;'], { title: 'vps: queue.sh, ở giây thứ 3 — output thật', fs: 13 })}` },

  { t: 'lock_timeout: thua sau 2 s thay vì làm nghẽn', body: two(
    `${sql([
      '-- đầu MỌI migration chạy trên production',
      "SET lock_timeout = '2s';        -- chờ khoá tối đa 2 s",
      "SET statement_timeout = '60s';  -- chạy tối đa 60 s",
      'ALTER TABLE nd1m ADD COLUMN ghi_chu_2 text;',
    ].join('\n'), 14.5)}
    ${term(['# cùng kịch bản slide 14, B có lock_timeout = 2s', '! [B migration] bat dau 1015 ms, xong 3048 ms: ERROR:  canceling statement due to lock timeout', '= [C request ] bat dau 2025 ms, xong 3048 ms: nd42', '# không có: B chờ tới 12070 ms, C cũng thế'], { title: 'vps: queue.sh 2s — output thật', fs: 13 })}`,
    `${term(["$ psql -c \"set statement_timeout = '3s'; alter table nd5m add column ma4 uuid default gen_random_uuid();\"", '! ERROR:  canceling statement due to statement timeout', '  Time: 3028.498 ms (00:03.028)', '  cot_ma4_ton_tai', '= ---------------', '=                0'], { title: 'statement_timeout — output thật', fs: 13 })}
    ${table(['Tham số', 'Giới hạn cái gì'], [
      ['<code>lock_timeout</code>', 'thời gian CHỜ lấy khoá'],
      ['<code>statement_timeout</code>', 'thời gian CHẠY cả câu lệnh'],
      ['<code>idle_in_transaction_session_timeout</code>', 'giao dịch mở mà bỏ quên'],
    ], { sm: true })}
    ${box('good', 'Hỏng nhanh là <b>thắng</b>: bị huỷ thì giao dịch lùi sạch (cột <code>ma4</code> không tồn tại) ⇒ đợi báo cáo dài xong rồi chạy lại.')}`) },

  { t: 'CREATE INDEX chặn ghi, CONCURRENTLY thì không', body: two(
    table(['nd5m · 56 request', 'Dựng chỉ mục', 'Request &gt; 500 ms', 'Lâu nhất'], [
      ['<code>CREATE INDEX</code> — ghi', '5.618 ms', '-<span>20 / 56</span>', '-<span>5.596 ms</span>'],
      ['<code>CREATE INDEX</code> — đọc', '9.784 ms', '!2 / 56', '!819 ms'],
      ['<code>… CONCURRENTLY</code> — ghi', '7.300 ms', '+0 / 56', '+204 ms'],
    ], { sm: true }),
    `${term(['# pg_locks của lệnh đang chạy, trên nd5m', '  create index idx_m1 on nd5m(tao)        ShareLock', '  create index concurrently idx_m2 on nd5m… ShareUpdateExclusiveLock', '  alter table nd5m add column ma9 uuid def… AccessExclusiveLock'], { title: 'vps: modes.sh — output thật', fs: 12.5 })}
    ${box('info', '<b>SHARE</b> cho đọc, chặn ghi. <b>SHARE UPDATE EXCLUSIVE</b> không chặn cả hai. Đọc chậm đi ở hàng 2 là tranh CPU/đĩa của máy thí nghiệm, không phải bị khoá.')}
    ${box('warn', 'CONCURRENTLY quét bảng HAI lần (chậm hơn 30% ở đây), và <b>không chạy được trong giao dịch</b> — slide 23.')}`, 'r') },

  { t: 'Ràng buộc hai bước: NOT VALID rồi VALIDATE', body: two(
    `${term(['-- A) SET NOT NULL thang (quet 5 trieu dong duoi ACCESS EXCLUSIVE)', '! Time: 1745.241 ms (00:01.745)', '-- B1) CHECK ... NOT VALID (tuc thi)', '= Time: 10.699 ms', '-- B2) VALIDATE (quet, nhung chi SHARE UPDATE EXCLUSIVE)', '+ Time: 855.735 ms', '-- B3) SET NOT NULL — da co CHECK hop le nen BO QUA buoc quet', '= Time: 1.206 ms'], { title: 'vps: psql < nn.sql trên nd5m — output thật', fs: 13 })}
    ${sql([
      'ALTER TABLE nd5m ADD CONSTRAINT ck_ten_nn',
      '  CHECK (ten IS NOT NULL) NOT VALID;      -- dòng MỚI bị kiểm ngay',
      'ALTER TABLE nd5m VALIDATE CONSTRAINT ck_ten_nn;  -- quét, không chặn ghi',
      'ALTER TABLE nd5m ALTER COLUMN ten SET NOT NULL; -- bỏ qua quét',
      'ALTER TABLE nd5m DROP CONSTRAINT ck_ten_nn;',
    ].join('\n'), 13.5)}`,
    `${steps([
      ['<code>NOT VALID</code>: áp cho dòng mới, không quét', '10 ms, khoá rất ngắn'],
      ['<code>VALIDATE</code>: quét dòng cũ dưới khoá YẾU', 'ghi vẫn chạy trong 856 ms đó'],
      ['<code>SET NOT NULL</code> thấy CHECK hợp lệ ⇒ bỏ qua quét', '1,2 ms thay vì 1.745 ms'],
      ['Cùng khuôn cho <code>FOREIGN KEY</code>, CHECK bất kỳ', 'UNIQUE thì: CREATE UNIQUE INDEX CONCURRENTLY'],
    ])}`, 'l') },

  { t: 'Bảng mức khoá: thao tác nào chặn gì', body: `
    ${table(['Thao tác', 'Khoá lấy', 'Chặn đọc?', 'Chặn ghi?', 'Thời gian theo cỡ bảng?'], [
      ['<code>ADD COLUMN</code> (không/hằng mặc định), <code>RENAME</code>, <code>DROP COLUMN</code>', 'ACCESS EXCLUSIVE', '-có — rất ngắn', '-có — rất ngắn', '+không'],
      ['<code>ADD COLUMN … DEFAULT hàm()</code>, <code>ALTER TYPE</code>', 'ACCESS EXCLUSIVE', '-có — suốt lúc ghi lại', '-có', '-có — ghi lại bảng'],
      ['<code>SET NOT NULL</code>, <code>ADD CONSTRAINT</code> (thường)', 'ACCESS EXCLUSIVE', '-có — suốt lúc quét', '-có', '!có — chỉ quét'],
      ['<code>CREATE INDEX</code>', 'SHARE', '+không', '-có', '!có'],
      ['<code>CREATE INDEX CONCURRENTLY</code>', 'SHARE UPDATE EXCLUSIVE', '+không', '+không', '!có — 2 lần quét'],
      ['<code>VALIDATE CONSTRAINT</code>', 'SHARE UPDATE EXCLUSIVE', '+không', '+không', '!có'],
    ], { sm: true })}
    ${box('warn', 'Khoá ngắn tới đâu cũng phải <b>xếp hàng</b> sau giao dịch đang mở (slide 14) ⇒ mọi dòng ở đây đều cần <code>lock_timeout</code>. Nguồn: tài liệu <code>ALTER TABLE</code>/<code>CREATE INDEX</code> PostgreSQL 16 + <code>pg_locks</code> đo ở trên.')}` },

  /* ───────────── 5.4 kẹt nửa chừng ───────────── */
  { t: 'P3018 rồi P3009: mọi deploy sau bị chặn', body: two(
    term(['$ npx prisma migrate deploy', 'Applying migration `20260902000000_them_unique`', '! Error: P3018', '! A migration failed to apply. New migrations cannot be applied …', '! ERROR: could not create unique index "uq_ma"', '! DETAIL: Key (ma)=(A) is duplicated.', '$ npx prisma migrate deploy        # lần 2 — sau khi "sửa"', '! Error: P3009', '! migrate found failed migrations in the target database, new migrations will not be applied. …', '! The `20260902000000_them_unique` migration started at 2026-09-29 01:57:28.971662 UTC failed'], { title: 'Mac → dv05-pg · Prisma 5.22.0 — output thật', fs: 12.5 }),
    `${term(['$ psql -c "select migration_name,', '    finished_at::time(0) as xong_luc,', '    applied_steps_count as buoc', '    from _prisma_migrations order by started_at"', '       migration_name       | xong_luc | buoc', '= 20260901000000_init        | 02:15:37 |    1', '! 20260902000000_them_unique |          |    0'], { title: 'cuốn sổ (CSDL shop4, tạo lại) — output thật', fs: 12.5 })}
    ${box('info', 'Prisma gửi cả tệp <code>migration.sql</code> trong <b>một</b> lượt ⇒ Postgres chạy nó như một giao dịch ngầm: cột <code>ghi_chu</code> và bảng <code>nhat_ky</code> ở câu 1–2 cũng <b>lùi sạch</b>. Nhưng sổ vẫn ghi "đã bắt đầu, chưa xong" ⇒ chặn.')}
    ${box('warn', 'P3009 chặn <b>mọi</b> migration sau, kể cả bản sửa gấp không liên quan. Một vấn đề lược đồ thành một sự cố deploy.')}`, 'l') },

  { t: 'resolve --applied bừa: xanh hôm nay, vỡ mai', body: two(
    term(['# "cho hết đỏ":', '$ npx prisma migrate resolve --applied 20260902000000_them_unique', '= Migration 20260902000000_them_unique marked as applied.', '$ npx prisma migrate deploy', '= No pending migrations to apply.', '$ npx prisma migrate status', '= Database schema is up to date!', '# mã mới đọc cột mà migration đó lẽ ra đã thêm:', '$ psql -c "select id, ma, ghi_chu from don_hang limit 1"', '! ERROR:  column "ghi_chu" does not exist'], { title: 'Mac → dv05-pg (CSDL shop2) — output thật', fs: 13 }),
    `${term(['$ npx prisma migrate diff \\', '    --from-migrations prisma/migrations \\', '    --to-url "$DATABASE_URL" \\', '    --shadow-database-url "$SHADOW" --script', '! -- DropIndex', '! DROP INDEX "uq_ma";', '! -- AlterTable', '! ALTER TABLE "don_hang" DROP COLUMN "ghi_chu";', '! -- DropTable', '! DROP TABLE "nhat_ky";'], { title: 'lịch sử ≠ CSDL — output thật', fs: 13 })}
    ${box('bad', '<code>--applied</code> chỉ sửa <b>sổ</b>, không chạy câu SQL nào. <code>status</code> xanh, <code>deploy</code> xanh — và CSDL thiếu 3 thứ. Hướng dẫn của dự án ghi in hoa: <b>DỪNG, đừng tự resolve</b>.')}`, 'l') },

  { t: 'Thoát kẹt: soi → sửa → resolve → diff', body: two(
    `${steps([
      ['<b>DỪNG.</b> Chép nguyên văn lỗi + tên migration', 'đừng resolve, đừng sửa tệp migration đã chạy'],
      ['<b>Soi</b> từng câu của tệp so với CSDL thật', 'bảng/cột/ràng buộc có chưa? chỉ mục có <code>indisvalid</code>?'],
      ['<b>Quyết</b>: làm nốt bằng tay, hay hoàn tác bằng tay', 'sửa cả DỮ LIỆU gây lỗi (ở đây: mã trùng)'],
      ['<b>resolve</b> cho sổ khớp với sự thật đã soi', '<code>--rolled-back</code> rồi deploy lại · hoặc <code>--applied</code>'],
      ['<b>diff</b>: lịch sử và CSDL có khớp không', 'chỉ in <code>-- This is an empty migration.</code> = khớp'],
    ])}`,
    `${term(['# 2. soi: mã nào trùng?', '$ psql -c "select ma, count(*) from don_hang group by ma having count(*) > 1"', '  A  |     2', "$ psql -c \"update don_hang set ma = 'A-3' where id = 3\"", 'UPDATE 1', '$ npx prisma migrate resolve --rolled-back 20260902000000_them_unique', '= Migration 20260902000000_them_unique marked as rolled back.', '$ npx prisma migrate deploy', 'Applying migration `20260902000000_them_unique`', '= All migrations have been successfully applied.', '$ npx prisma migrate diff … --script', '= -- This is an empty migration.'], { title: 'Mac → dv05-pg — output thật', fs: 12.5 })}`) },

  { t: 'migrate dev hỏng vì shadow DB: viết SQL tay', body: two(
    `${term(['$ npx prisma migrate dev --name them_cot_thu', '! Error: P3006', '! Migration `20260706130000_add_music_and_profile` failed to apply cleanly to the shadow database.', '! Error:', '! ERROR: relation "post_music_post_id_key" already exists'], { title: 'tái hiện migration thật của kho — output thật', fs: 12.5 })}
    ${sql([
      '-- 20260706130000_add_music_and_profile (ĐÃ deploy — cấm sửa)',
      'ALTER TABLE "post_music" ADD CONSTRAINT "post_music_post_id_key" UNIQUE ("post_id");',
      'CREATE INDEX "post_music_post_id_key" ON "post_music"("post_id");',
    ].join('\n'), 12.5)}
    ${box('info', 'UNIQUE tự tạo một chỉ mục <b>cùng tên</b> ⇒ câu 2 không bao giờ chạy được trên CSDL trống. <code>migrate dev</code> dựng lại lịch sử trên <b>shadow DB</b> trống ⇒ P3006 vĩnh viễn.')}`,
    `${sh([
      ['# 1. để Prisma TÍNH câu SQL còn thiếu (không cần shadow)', ''],
      ['npx prisma migrate diff \\', ''],
      ['  --from-schema-datasource prisma/schema.prisma \\', 'CSDL thật'],
      ['  --to-schema-datamodel prisma/schema.prisma --script', 'schema mới'],
      ['# 2. chép vào thư mục migration MỚI, đọc lại bằng mắt', ''],
      ['D=prisma/migrations/$(date -u +%Y%m%d%H%M%S)_them_cot_thu', ''],
      ['mkdir -p $D && $EDITOR $D/migration.sql', ''],
      ['# 3. áp — không dùng shadow DB', ''],
      ['npx prisma migrate deploy', ''],
      ['# 4. kiểm: lại lệnh diff ở bước 1', 'empty = khớp'],
    ], { fs: 13 })}
    ${term(['$ npx prisma migrate deploy', 'Applying migration `20260929090000_them_cot_thu`', '= All migrations have been successfully applied.', '$ npx prisma migrate diff --from-schema-datasource … --script', '= -- This is an empty migration.'], { title: 'output thật', fs: 12.5 })}`) },

  { t: 'CONCURRENTLY phải đứng MỘT MÌNH một tệp', body: two(
    `${term(['# migration.sql: ADD COLUMN "tao" + CREATE INDEX CONCURRENTLY "idx_tao"', '$ npx prisma migrate deploy', 'Applying migration `20260903000000_cic_kem`', '! Error: P3018', '! ERROR: CREATE INDEX CONCURRENTLY cannot run inside a transaction block', '# cột "tao" có được thêm không?  → 0', '# tệp mới CHỈ có một câu CREATE INDEX CONCURRENTLY', '$ npx prisma migrate deploy', 'Applying migration `20260903000000_cic_rieng`', '= All migrations have been successfully applied.'], { title: 'Mac → dv05-pg · Prisma 5.22 — output thật', fs: 13 })}`,
    `${term(["$ psql -c \"create unique index concurrently uq_ten on nd5m(ten)\"", '! ERROR:  could not create unique index "uq_ten"', '! DETAIL:  Key (ten)=(moi) is duplicated.', '$ psql -c "select indexrelid::regclass, indisvalid from pg_index where indrelid = \'nd5m\'::regclass"', '  idx_email_c | t', '! uq_ten      | f'], { title: 'CONCURRENTLY hỏng để lại xác — output thật', fs: 13 })}
    ${box('warn', 'CONCURRENTLY hỏng <b>không lùi được</b>: để lại chỉ mục <code>INVALID</code> — không dùng, vẫn tốn chỗ, vẫn phải cập nhật mỗi lần ghi. Dọn: <code>DROP INDEX CONCURRENTLY IF EXISTS uq_ten;</code>')}
    ${box('tip', 'Tệp CONCURRENTLY: một câu, <code>IF NOT EXISTS</code>, và bước dọn chỉ mục INVALID trước khi chạy lại.')}`) },

  /* ───────────── 5.5 lấp dữ liệu & vị trí ───────────── */
  { t: 'Lấp một phát giữ khoá 3,8 s; theo lô ≤ 0,15 s', body: two(
    `${term(['══ UPDATE mot phat 1 trieu dong + request sua 1 dong ngau nhien ══', '  migration: bat dau 2007 ms, xong 5839 ms (3832 ms) OK', '! request: 56 cai · cham hon 500 ms: 5 · loi: 0 · trung binh 232 ms · lau nhat 3000 ms', '══ lap theo lo (khoang id) + cung request ══', '  [khoang] 51 lo · tong 5243 ms · lo dau 106 ms · lo lau nhat 147 ms', '= request: 56 cai · cham hon 500 ms: 0 · loi: 0 · trung binh 43 ms · lau nhat 322 ms'], { title: 'vps: probe.sh / probe2.sh trên nd1m — output thật', fs: 12 })}
    ${bars([
      { l: 'một phát', sub: 'một giao dịch', v: 3832, txt: '3.832 ms giữ khoá dòng', c: 'red' },
      { l: 'theo lô', sub: 'lô lâu nhất', v: 147, txt: '147 ms', c: 'grn' },
    ], { lw: 150 })}`,
    `${box('warn', '<b>Tổng thời gian</b> theo lô dài hơn (5,2 s vs 3,8 s) — và vẫn là lựa chọn đúng. Tổng là thứ BẠN trả; <b>khoá dài nhất</b> là thứ NGƯỜI DÙNG cảm thấy.')}
    ${box('info', 'Một phát: bảng 89 → <b>200 MB</b> (mỗi UPDATE ghi phiên bản dòng mới), và một giao dịch dài còn cản <code>VACUUM</code> dọn ở MỌI bảng.')}
    ${box('good', 'Bị giết ở 90%: một phát lùi <b>hết</b>; theo lô giữ 90% và chạy lại từ chỗ dừng (chỉ chọn dòng còn NULL).')}`, 'l2') },

  { t: 'Vòng lặp lấp theo lô, chạy lại được', body: two(
    sh([
      ['#!/bin/bash — lap-email.sh (chạy RIÊNG, sau deploy)', ''],
      ['set -euo pipefail', ''],
      ['export PGOPTIONS="-c lock_timeout=2s -c statement_timeout=30s"', 'mỗi lô'],
      ['a=0; MAX=$(psql -qAt -c "select max(id) from nd1m")', ''],
      ['while [ "$a" -lt "$MAX" ]; do', ''],
      ['  psql -qAt -c "update nd1m set email_lo = email', ''],
      ['    where id > $a and id <= $a + 20000', 'khoảng id: dùng khoá chính'],
      ['      and email_lo is null"', 'chạy lại được'],
      ['  a=$((a + 20000))', ''],
      ['  sleep 0.1', 'nhường chỗ cho web'],
      ['done', ''],
    ], { fs: 14 }) + '<div style="height:12px"></div>' + term(['$ time bash lap-email.sh', 'real	0m9.938s', '$ psql -qAt -c "select count(*) from nd1m where email_lo is null"', '= 0'], { title: 'vps → dv05-pg (gồm cả các lần sleep 0.1) — output thật', fs: 13 }),
    `${table(['Cách chọn lô', '51 lô, 1 triệu dòng'], [
      ['<code>where id between a and a+20000</code>', 'lô đầu 106 ms · lô cuối 26 ms'],
      ['<code>where email_lo is null limit 20000</code><br><code>for update skip locked</code>', 'lô đầu 121 ms · lô cuối <b>296 ms</b>'],
    ], { sm: true })}
    ${box('info', '<code>is null limit</code> lướt lại dòng ĐÃ lấp mỗi lượt ⇒ lô sau chậm dần (×2,4). Hợp khi <b>nhiều máy</b> cùng lấp nhờ <code>skip locked</code>.')}
    ${box('bad', 'Bẫy đã dính khi đo: <code>psql -q</code> <b>nuốt</b> dòng <code>UPDATE 0</code> ⇒ vòng lặp không bao giờ dừng. Đếm bằng <code>RETURNING</code>.')}`, 'l') },

  { t: 'Migration nằm TRƯỚC bước tráo, và có trần', body: `
    ${pipe([
      { c: 'flock -w 30 9', d: 'một deploy một lúc (Ch2)', ac: 'grn' },
      { c: 'migrate deploy', d: 'an toàn với mã CŨ<br>lock_timeout + timeout 300', ac: 'vio' },
      { c: 'up -d backend', d: 'tráo (Ch3)', ac: 'blu' },
      { c: 'smoke-test', d: '401/200 = có route', ac: 'amb' },
      { c: 'lấp dữ liệu', d: 'job RIÊNG, theo lô', ac: 'tea' },
    ], { mui: ['', 'OK mới tráo', '', 'sau đó'] })}
    ${two(
      sh([
        ['cd "$BAN_MOI"', ''],
        ['if ! timeout 300 npx prisma migrate deploy; then', 'trần 5 phút'],
        ['  echo "migration HONG — khong trao, ban cu van chay" >&2', ''],
        ['  exit 1', 'dừng TRƯỚC khi đổi gì'],
        ['fi', ''],
        ['docker compose -p app up -d --no-build backend', 'mã mới lên SAU'],
      ], { fs: 14 }),
      `${box('good', 'Migration hỏng ở đây = rẻ nhất có thể: chưa tráo gì, bản cũ vẫn chạy trên lược đồ cũ (Prisma lùi cả tệp).')}
      ${box('warn', 'Nhiều máy chủ: chạy migration <b>MỘT</b> lần ở một bước riêng. Prisma có lấy khoá tư vấn, nhưng một bước rõ ràng dễ đọc log hơn.')}`, 'l')}` },

  { t: 'Seed báo OK khi backend đã bị tráo', body: two(
    `${term(['$ bash seed-sai.sh; echo "exit=$?"', '→ Seed khoa hoc', '  12 bai da ghi', '[✅ OK] Seed khoa hoc complete', '→ Seed de thi', '! [✅ OK] Seed de thi complete   # bị giết, im lặng', '→ Seed lo trinh', '! Error response from daemon: container 7087c7a5… is not running', '! [✅ OK] Seed lo trinh complete', 'Tong ket: khong buoc nao bao loi', '! exit=0'], { title: 'dv05-app bị stop giữa chừng — output thật', fs: 12.5 })}
    ${term(['$ bash seed-dung.sh; echo "exit=$?"', '[✅ OK] Seed khoa hoc complete', '→ Seed de thi', '= [❌ HONG] Seed de thi — dung toan bo loat seed', '= exit=1'], { title: 'kiểm mã thoát — output thật', fs: 12.5 })}`,
    `${box('bad', '<b>Chuyện thật 20/09 và 22/09:</b> phiên khác tráo đè backend giữa loạt seed ⇒ <b>11 bước</b> in <code>service "backend" is not running</code> rồi vẫn <code>[✅ OK]</code>; deploy <code>exit 0</code>.')}
    ${sh([
      ['buoc() {', ''],
      ['  if ! docker compose exec -T backend sh -c "$2"; then', 'KIỂM mã thoát'],
      ['    echo "[HONG] $1" >&2; exit 1', ''],
      ['  fi', ''],
      ['  echo "[OK] $1"', 'chỉ in khi đúng là OK'],
      ['}', ''],
    ], { fs: 13.5 })}
    ${box('warn', 'Cùng họ: đổi enum <code>CODE</code> → <code>CODE_REVIEW</code> qua sạch <code>tsc</code> mà vỡ seed trên production — <code>prisma/**</code> nằm trong <code>exclude</code>. Seed là mã production.')}`) },

  /* ───────────── Cuối chương ───────────── */
  { t: 'Sai lầm hay gặp ở Chương 5', body: table(['Triệu chứng', 'Nguyên nhân thật', 'Sửa'], [
    ['Migration xanh, mã cũ báo <code>column … does not exist</code>', 'đổi tên/xoá trong MỘT bước', 'mở rộng–thu hẹp, 4 deploy'],
    ['Mã mới đọc email cũ sau khi mã cũ sửa', 'trigger chỉ lấp NULL, bỏ sót UPDATE', 'so <code>NEW</code> với <code>OLD</code>'],
    ['Cả web treo khi migration "tức thì" chạy', 'hàng đợi khoá sau một giao dịch dài', '<code>lock_timeout</code> + soi <code>pg_stat_activity</code> trước'],
    ['Đọc lẫn ghi đứng 9 giây', '<code>DEFAULT hàm()</code> / <code>ALTER TYPE</code> ghi lại bảng', 'cột mới + lấp theo lô'],
    ['Ghi chậm khi thêm chỉ mục', '<code>CREATE INDEX</code> lấy SHARE', '<code>CONCURRENTLY</code>, một mình một tệp'],
    ['Mọi deploy báo P3009', 'migration trước đó hỏng, sổ ghi "chưa xong"', 'DỪNG → soi → sửa → resolve → diff'],
    ['<code>status</code> xanh mà thiếu cột', '<code>resolve --applied</code> khi chưa soi', '<code>migrate diff</code> sau mọi lần resolve'],
    ['<code>migrate dev</code> → P3006', 'lịch sử không dựng lại được trên shadow DB', 'SQL tay + <code>migrate deploy</code>'],
    ['Seed <code>[✅ OK]</code> mà không có dữ liệu', 'không kiểm mã thoát của <code>exec</code>', '<code>if ! …; then exit 1</code>'],
  ], { sm: true }) },

  { t: 'Bảng tra nhanh Chương 5 (1/2): SQL an toàn', body: two(
    sql([
      "SET lock_timeout = '2s';  SET statement_timeout = '60s';",
      '-- tức thì ở mọi cỡ bảng (PG 11+)',
      "ALTER TABLE t ADD COLUMN c text;",
      "ALTER TABLE t ADD COLUMN s text NOT NULL DEFAULT 'moi';",
      '-- chỉ mục không chặn ghi (một mình một tệp)',
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_c ON t(c);',
      'DROP INDEX CONCURRENTLY IF EXISTS idx_hong;',
      '-- ràng buộc hai bước',
      "ALTER TABLE t ADD CONSTRAINT ck CHECK (c IS NOT NULL) NOT VALID;",
      'ALTER TABLE t VALIDATE CONSTRAINT ck;',
      'ALTER TABLE t ALTER COLUMN c SET NOT NULL;',
      '-- dữ liệu trùng trước khi thêm UNIQUE?',
      'SELECT c, count(*) FROM t GROUP BY c HAVING count(*) > 1;',
    ].join('\n'), 13.5),
    sql([
      '-- giao dịch mở lâu (sẽ CHẶN migration)',
      'SELECT pid, now() - xact_start AS lau, left(query, 50)',
      'FROM pg_stat_activity',
      "WHERE xact_start < now() - interval '30 seconds';",
      '-- ai đang chờ ai',
      'SELECT pid, wait_event_type, pg_blocking_pids(pid),',
      '       left(query, 40) FROM pg_stat_activity',
      "WHERE wait_event_type = 'Lock';",
      '-- khoá trên một bảng',
      'SELECT pid, mode, granted FROM pg_locks',
      "WHERE relation = 't'::regclass;",
      '-- chỉ mục INVALID bỏ lại',
      'SELECT indexrelid::regclass FROM pg_index WHERE NOT indisvalid;',
    ].join('\n'), 13.5)) },

  { t: 'Bảng tra nhanh Chương 5 (2/2): Prisma', body: two(
    sh([
      ['npx prisma migrate deploy', 'áp migration chưa chạy'],
      ['npx prisma migrate status', 'đối chiếu sổ với thư mục'],
      ['psql -c "select migration_name, finished_at,', ''],
      ['  rolled_back_at from _prisma_migrations"', 'đọc sổ thật'],
      ['npx prisma migrate resolve --rolled-back NAME', 'SAU khi đã soi + hoàn tác'],
      ['npx prisma migrate resolve --applied NAME', 'SAU khi đã soi + làm nốt'],
      ['npx prisma migrate diff --from-migrations prisma/migrations \\', ''],
      ['  --to-url "$DATABASE_URL" \\', ''],
      ['  --shadow-database-url "$SHADOW" --script', 'lịch sử vs CSDL'],
      ['npx prisma migrate diff --from-schema-datasource S \\', ''],
      ['  --to-schema-datamodel S --script', 'CSDL vs schema.prisma'],
      ['npm run typecheck:seed && npx prisma db seed', 'seed là mã production'],
    ], { fs: 13 }),
    table(['Mã lỗi', 'Nghĩa', 'Làm gì'], [
      ['<code>P3018</code>', 'một migration vừa hỏng khi áp', 'đọc lỗi SQL, soi CSDL'],
      ['<code>P3009</code>', 'sổ có migration hỏng ⇒ chặn mọi deploy', 'DỪNG · soi · sửa · resolve'],
      ['<code>P3006</code>', 'không dựng lại được trên shadow DB', 'SQL tay + <code>deploy</code>'],
      ['<code>empty migration</code>', '<code>diff</code> không thấy khác biệt', '+sổ khớp CSDL'],
      ['<code>No pending…</code>', 'deploy KHÔNG so checksum tệp cũ', '!sửa tệp đã chạy = không có tác dụng'],
    ], { sm: true }), 'l') },

  { t: 'Thực hành Chương 5 (45 phút): một CSDL thật', body: `
    ${steps([
      'Dựng <code>postgres:16</code> trong mạng Docker riêng; bảng 1–5 triệu dòng bằng <code>generate_series</code>',
      ['<code>\\timing on</code>: ba lệnh <code>ADD COLUMN</code> (không/hằng/hàm) + <code>probe.sh</code> chạy song song', 'con số ms và số request &gt; 500 ms của máy bạn'],
      ['Mở một giao dịch dài, chạy <code>ALTER</code> + một <code>SELECT</code>; đọc <code>pg_stat_activity</code>; lặp lại với <code>lock_timeout</code>', 'chỉ ra đúng pid chặn pid nào'],
      'Đổi tên cột theo 4 giai đoạn, trigger so <code>OLD</code>; mã cũ SỬA, mã mới đọc — truy vấn lệch trả 0',
      'Prisma: tạo P3018 → P3009 bằng dữ liệu trùng; thoát ra đúng 5 bước tới <code>empty migration</code>',
    ])}
    ${box('good', '<b>Đạt khi:</b> có bảng số đo của chính máy bạn, giải thích được vì sao một <code>ADD COLUMN</code> "tức thì" vẫn làm web treo, thoát được P3009 mà không dùng <code>--applied</code> mù — và đã dọn container + mạng.')}` },
].map((s) => (s.kind === 'cover' ? s : { ...s, body: FIX + s.body })));
