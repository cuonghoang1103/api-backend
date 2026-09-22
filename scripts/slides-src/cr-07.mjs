/** Content Creator · Deck cr-07 — Chương 7: Bố cục & ngôn ngữ hình ảnh. */
import {
  S, cover, cards, box, mindmap, table, kpis, storyboard,
  shotLadder, frame, fov, axis180, phone,
  C, esc,
} from './_cr-chung.mjs';

export const deck = { key: 'cr-07', code: 'CR · CHƯƠNG 7', title: 'Bố cục & ngôn ngữ hình ảnh', sub: 'Content Creator · Chương 7' };

/* ─────────────────────── tiện ích SVG cục bộ (chỉ dùng trong deck này) ─────────────────────── */
const txt = (x, y, s, { size = 15, fill = C.tx, anchor = 'start', weight = 400, mono = false } = {}) =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}" ` +
  `font-family="${mono ? "'SF Mono',Menlo,monospace" : "-apple-system,'Segoe UI',Arial,sans-serif"}">${esc(s)}</text>`;

/** Biểu tượng máy quay hướng về target=[tx,ty], đặt tại (x,y). */
const camIcon = (x, y, target, c) => {
  const a = Math.atan2(target[1] - y, target[0] - x) * 180 / Math.PI;
  return `<g transform="translate(${x} ${y}) rotate(${a.toFixed(1)})">` +
    `<rect x="-14" y="-10" width="22" height="20" rx="4" fill="${c}"/>` +
    `<path d="M8 -6 L18 -11 L18 11 L8 6 Z" fill="${c}"/></g>`;
};

/* ── Góc máy: 5 kiểu nhìn từ bên, cùng một người ── */
const GOC_MAY = (() => {
  const W = 900, H = 440;
  const px = 460, headY = 150, headR = 30;
  const eye = [px, headY];
  let s = `<svg class="c-svg" viewBox="0 0 ${W} ${H}" width="820"><rect width="${W}" height="${H}" rx="14" fill="#0f131a" stroke="#2a3446"/>`;
  s += `<line x1="40" y1="300" x2="860" y2="300" stroke="#2a3446" stroke-width="2"/>`;
  // người (nhìn từ bên, đứng thẳng)
  s += `<rect x="${px - 20}" y="${headY + headR - 4}" width="40" height="118" rx="14" fill="${C.blu}"/>`;
  s += `<circle cx="${px}" cy="${headY}" r="${headR}" fill="#f0c29e"/>`;

  const cams = [
    { x: 130, y: headY, t: 'NGANG TẦM MẮT', d: 'trung lập — mặc định talking head', c: C.grn, la: 'l' },
    { x: 800, y: 55, t: 'GÓC CAO', d: 'nhìn xuống — nhỏ bé, yếu thế', c: C.amb, la: 'r' },
    { x: 800, y: 300, t: 'GÓC THẤP', d: 'nhìn lên — to lớn, quyền lực', c: C.red, la: 'r' },
    { x: px, y: 35, t: 'TOP-DOWN', d: 'bàn phím, bàn làm việc, tổng quan', c: C.vio, la: 'c' },
  ];
  cams.forEach((cm) => {
    s += `<line x1="${cm.x}" y1="${cm.y}" x2="${eye[0]}" y2="${eye[1]}" stroke="${cm.c}" stroke-width="1.5" stroke-dasharray="5 4" opacity=".55"/>`;
    s += camIcon(cm.x, cm.y, eye, cm.c);
  });
  s += txt(130, 200, 'NGANG TẦM MẮT', { size: 15, weight: 800, fill: C.grn, anchor: 'middle' });
  s += txt(130, 219, 'trung lập — mặc định talking head', { size: 12, fill: C.mu, anchor: 'middle' });
  s += txt(800, 96, 'GÓC CAO', { size: 15, weight: 800, fill: C.amb, anchor: 'middle' });
  s += txt(800, 115, 'nhìn xuống — nhỏ bé, yếu thế', { size: 12, fill: C.mu, anchor: 'middle' });
  s += txt(800, 341, 'GÓC THẤP', { size: 15, weight: 800, fill: C.red, anchor: 'middle' });
  s += txt(800, 360, 'nhìn lên — to lớn, quyền lực', { size: 12, fill: C.mu, anchor: 'middle' });
  s += txt(px, 18, 'TOP-DOWN — bàn phím, bàn làm việc', { size: 13.5, weight: 800, fill: C.vio, anchor: 'middle' });

  // Dutch tilt — hai khung ngắm mini: ngang vs nghiêng
  const miniFrame = (x, y, rot, c) => `<g transform="translate(${x} ${y}) rotate(${rot})">` +
    `<rect x="-38" y="-24" width="76" height="48" rx="4" fill="none" stroke="${c}" stroke-width="3"/>` +
    `<line x1="-38" y1="0" x2="38" y2="0" stroke="${c}" stroke-width="1.5" opacity=".65"/></g>`;
  s += miniFrame(190, 378, 0, C.mu);
  s += txt(190, 432, 'khung ngang', { size: 12.5, fill: C.mu, anchor: 'middle' });
  s += miniFrame(360, 378, -16, C.pnk);
  s += txt(360, 432, 'khung nghiêng ~15–20°', { size: 12.5, fill: C.pnk, anchor: 'middle' });
  s += txt(575, 378, 'NGHIÊNG (DUTCH TILT)', { size: 15, weight: 800, fill: C.pnk, anchor: 'start' });
  s += txt(575, 398, 'xoay máy quanh trục ống kính — KHÔNG đổi vị trí đứng,', { size: 12.5, fill: C.mu, anchor: 'start' });
  s += txt(575, 415, 'chỉ đổi trục chân trời — bất an, mất phương hướng', { size: 12.5, fill: C.mu, anchor: 'start' });
  s += `</svg>`;
  return s;
})();

/* ── Méo phối cảnh do KHOẢNG CÁCH, không do ống kính ── */
const MEO_KHOANG_CACH = (() => {
  const W = 1040, H = 300;
  let s = `<svg class="c-svg" viewBox="0 0 ${W} ${H}" width="1000"><rect width="${W}" height="${H}" rx="14" fill="#0f131a" stroke="#2a3446"/>`;
  // Mỗi hàng: nhãn (label/sub) nằm HẲN phía trên, sơ đồ (tick/vòng tròn/badge) nằm HẲN phía dưới —
  // tách hai khối theo chiều dọc để chữ dài không bao giờ đè lên nhãn "mũi/tai".
  const row = (top, label, sub, noseCm, earCm, lineColor) => {
    const camX = 60, noseX = 330, earX = 470, cy = top + 92;
    let g = txt(30, top + 18, label, { size: 17, weight: 800, fill: lineColor });
    g += txt(30, top + 38, sub, { size: 13, fill: C.mu });
    g += `<line x1="${camX}" y1="${cy}" x2="${earX}" y2="${cy}" stroke="#2a3446" stroke-width="2"/>`;
    g += camIcon(camX, cy, [earX + 40, cy], lineColor);
    const earR = 15, noseR = Math.round(earR * (earCm / noseCm));
    g += `<line x1="${noseX}" y1="${cy - 26}" x2="${noseX}" y2="${cy + 26}" stroke="${C.mu}" stroke-width="1.5"/>`;
    g += `<circle cx="${noseX}" cy="${cy}" r="${noseR}" fill="${lineColor}" opacity=".85"/>`;
    g += txt(noseX, top + 64, `mũi · ${noseCm}cm`, { size: 12.5, anchor: 'middle', fill: C.tx, weight: 700 });
    g += `<line x1="${earX}" y1="${cy - 26}" x2="${earX}" y2="${cy + 26}" stroke="${C.mu}" stroke-width="1.5"/>`;
    g += `<circle cx="${earX}" cy="${cy}" r="${earR}" fill="${lineColor}" opacity=".4"/>`;
    g += txt(earX, top + 64, `tai · ${earCm}cm`, { size: 12.5, anchor: 'middle', fill: C.tx, weight: 700 });
    const pct = Math.round((earCm / noseCm - 1) * 100);
    g += `<rect x="${earX + 50}" y="${cy - 17}" width="168" height="34" rx="8" fill="${lineColor}" opacity=".14" stroke="${lineColor}"/>`;
    g += txt(earX + 134, cy + 5, `mũi to hơn tai +${pct}%`, { size: 14, anchor: 'middle', weight: 800, fill: lineColor });
    return g;
  };
  s += row(4, 'SAI — cách 30cm, ống siêu rộng 13mm', 'đứng gần để "lấy hết mặt" ở khoảng cách selfie', 30, 42, C.red);
  s += row(154, 'ĐÚNG — lùi ra 2m, dùng tele 120mm (5×)', 'cùng khung mặt, khoảng cách tới mũi/tai gần bằng nhau', 200, 212, C.grn);
  s += `</svg>`;
  return s;
})();

export const slides = S([
  /* 1 — Bìa */
  cover({
    t: 'Chương 7 — Bố cục & ngôn ngữ hình ảnh',
    sub: 'Cỡ cảnh, góc máy, tiêu cự, quy tắc 1/3, chuyển động máy và liên tục dựng phim',
    chap: 'CHƯƠNG 7',
  }),

  /* 2 — Bản đồ chương */
  { t: 'Bản đồ chương', body: mindmap('Bố cục', 'Chương 7', [
    { t: '📏 Cỡ cảnh', d: 'ECU → EWS, cảm xúc & công dụng', c: 'red' },
    { t: '🎥 Góc máy & tiêu cự', d: 'cao/thấp/ngang · 13–120mm', c: 'ora' },
    { t: '▦ Bố cục 1/3', d: 'khoảng đầu, khoảng nhìn, đặt giữa', c: 'amb' },
    { t: '📱 Vùng an toàn 9:16', d: 'chữ, nút không bị giao diện che', c: 'grn' },
    { t: '🎬 Chuyển động máy', d: 'pan/tilt/push/track/orbit có lý do', c: 'blu' },
    { t: '🔗 Liên tục', d: 'trục 180°, quy tắc 30°, khớp hướng nhìn', c: 'vio' },
  ]) },

  /* 3 — shotLadder */
  { t: 'Bảy cỡ cảnh — từ đặc tả tới đại cảnh', body:
    shotLadder(['ECU', 'CU', 'MCU', 'MS', 'MWS', 'WS', 'EWS'], { cols: 7, w: 155 }) +
    box('info', '<b>Talking head</b> (bạn nói với máy) → MS/MCU · <b>B-roll đặc tả</b> (tay gõ phím, chi tiết) → ECU/CU · ' +
      '<b>Thiết lập bối cảnh</b> (mở đầu vlog, đổi cảnh) → WS/EWS · <b>Phỏng vấn 2 người / cowboy</b> → MWS.') },

  /* 4 — Góc máy */
  { t: 'Góc máy — cùng một người, năm cách nhìn', body: GOC_MAY },

  /* 5 — fov: tiêu cự tương đương */
  { t: 'Tiêu cự tương đương — đồ nghề của bạn', body:
    `<div style="display:flex;gap:26px;align-items:center;justify-content:center">` +
    fov({ lenses: [
      { f: 13, t: 'iPhone Ultra Wide', c: 'red' },
      { f: 20, t: 'Pocket 3 (cố định)', c: 'amb' },
      { f: 24, t: 'iPhone chính (1×)', c: 'grn' },
      { f: 120, t: 'iPhone Tele 5×', c: 'blu' },
    ], w: 540 }) +
    `<div style="max-width:420px;display:flex;flex-direction:column;gap:10px">` +
    box('good', '13mm — cảnh rộng thiết lập bối cảnh, phòng nhỏ. <b>Đừng đặt sát mặt</b> — méo là do khoảng cách (slide sau).') +
    box('info', '20–24mm — gần với mắt người, chuẩn talking head và vlog cầm tay.') +
    box('warn', '120mm (5×) — "kéo" chủ thể lại gần từ xa, nén hậu cảnh — cũng là hệ quả của khoảng cách xa hơn, không phải phép màu của ống tele.') +
    `</div></div>` },

  /* 6 — Méo phối cảnh do khoảng cách */
  { t: 'Méo mặt là do KHOẢNG CÁCH, không phải "ống rộng tự làm méo"', body: MEO_KHOANG_CACH },

  /* 7 — 1/3 & khoảng trống đầu */
  { t: 'Quy tắc 1/3 & khoảng trống đầu (headroom)', body:
    `<div style="display:flex;gap:22px;justify-content:center">` +
    frame({ w: 300, size: 'MS', eyeAt: 0.55, thirds: true, head: true, verdict: 'bad', label: 'Dư khoảng đầu — mắt quá thấp trong khung, đỉnh đầu "chìm"' }) +
    frame({ w: 300, size: 'MS', thirds: true, head: true, verdict: 'good', label: 'Mắt ở đường 1/3 trên — khoảng đầu vừa đủ' }) +
    frame({ w: 300, size: 'MS', eyeAt: 0.12, thirds: true, head: true, verdict: 'bad', label: 'Thiếu khoảng đầu — đỉnh đầu sát mép trên, ngộp' }) +
    `</div>` },

  /* 8 — Khoảng nhìn & đặt giữa */
  { t: 'Khoảng nhìn (lead room) & đặt giữa', body:
    `<div style="display:flex;gap:16px;justify-content:center">` +
    frame({ w: 250, size: 'MCU', at: 0.82, thirds: false, verdict: 'bad', label: 'Sát mép phải — không còn "khoảng thở" phía trước mặt' }) +
    frame({ w: 250, size: 'MCU', at: 0.32, thirds: false, verdict: 'good', label: 'Lệch trái, chừa khoảng trống bên phải — khoảng nhìn đủ' }) +
    frame({ w: 250, size: 'MS', at: 0.68, thirds: false, verdict: 'bad', label: 'Lệch không lý do — chật một bên, không chừa cho ai' }) +
    frame({ w: 250, size: 'MCU', at: 0.5, thirds: false, verdict: 'good', label: 'Đặt giữa — chuẩn talking head một mình, nền gọn 2 bên' }) +
    `</div>` },

  /* 9 — Bố cục sâu */
  { t: 'Thêm chiều sâu cho khung hình phẳng', body:
    cards([
      { ic: '🏞️', t: 'Tiền – trung – hậu cảnh', d: 'một vật mờ ở tiền cảnh, chủ thể nét ở trung cảnh, một chi tiết chuyển động nhẹ ở hậu cảnh', c: 'red' },
      { ic: '🖼️', t: 'Khung trong khung', d: 'quay qua khung cửa, kệ sách, màn hình mở — viền tự nhiên dẫn mắt thẳng vào chủ thể', c: 'amb' },
      { ic: '💡', t: 'Hậu cảnh gọn + đèn trang trí', d: 'dọn còn 2–3 vật có ý nghĩa, thêm một đèn LED phía sau tạo lớp — Chương 8 nói kỹ cách đặt đèn', c: 'grn' },
      { ic: '🛣️', t: 'Đường dẫn (leading lines)', d: 'hành lang, mép bàn, dây cáp — đường thẳng có sẵn trong khung dẫn mắt người xem về chủ thể', c: 'blu' },
    ], 4) },

  /* 10 — Vùng an toàn 9:16 */
  { t: 'Vùng an toàn cho video dọc 9:16', body:
    `<div style="display:flex;gap:22px;justify-content:center">` +
    phone({ w: 200, label: 'TikTok (ước lượng)' }) +
    phone({ w: 200, label: 'Reels (ước lượng)' }) +
    phone({ w: 200, label: 'Shorts (ước lượng)' }) +
    `</div>` +
    box('warn', 'Ba con số trên là ƯỚC LƯỢNG — trang nào cũng đổi giao diện theo thời gian và không công bố số pixel chính thức. ' +
      '<b>Tự kiểm trước khi đăng:</b> xuất thử một khung có lưới an toàn, mở đúng app đó trên điện thoại và xem chữ/nút của bạn có bị avatar, nút tim, thanh mô tả đè lên không.') },

  /* 11 — Chuyển động máy */
  { t: 'Chuyển động máy — phải có động cơ (motivated)', body:
    storyboard([
      { s: '1', t: 'PAN', d: 'máy đứng yên, xoay ◄ ►  — theo chủ thể đi ngang', size: 'MS', at: 0.5 },
      { s: '2', t: 'TILT', d: 'máy đứng yên, ngẩng/cúi ▲▼ — theo chủ thể đứng lên', size: 'MCU', at: 0.5 },
      { s: '3', t: 'PUSH-IN', d: 'tiến gần dần WS → MCU — kéo người xem vào cảm xúc', size: 'MCU', at: 0.5 },
      { s: '4', t: 'PULL-OUT', d: 'lùi xa dần MCU → WS — hé lộ bối cảnh rộng hơn', size: 'WS', at: 0.5 },
      { s: '5', t: 'TRACK', d: 'trượt ngang song song — "đi cùng" chủ thể, khoảng cách không đổi', size: 'MS', at: 0.3 },
      { s: '6', t: 'ORBIT', d: 'vòng quanh chủ thể — khoảng cách không đổi, góc đổi liên tục', size: 'MWS', at: 0.65 },
    ], { cols: 6, w: 182 }) +
    box('warn', 'Mỗi cú máy động phải có LÝ DO (motivated) — push-in đúng lúc câu chuyện lên cao trào, không di chuyển máy chỉ vì gimbal làm được. Chuyển động vô cớ gây rối mắt hơn là hay.') },

  /* 12 — Trục 180° */
  { t: 'Quy tắc 180° — trục hành động khi DỰNG PHIM', body:
    `<div style="display:flex;gap:26px;align-items:center;justify-content:center">${axis180({ w: 560 })}` +
    `<div style="max-width:420px;display:flex;flex-direction:column;gap:10px">` +
    box('bad', 'Đừng nhầm với quy tắc 180° ở Bài 5.2 (màn trập ≈ gấp đôi fps) — trùng tên, khác hoàn toàn ý nghĩa.') +
    box('info', 'Vẽ một đường tưởng tượng nối hai người đang nói chuyện (hoặc nối bạn với chủ thể). Đặt MỌI máy — kể cả A-cam và B-cam quay cùng lúc (Chương 10) — về CÙNG MỘT PHÍA đường đó.') +
    box('good', 'Vượt trục có chủ đích (Máy 3 trong hình) vẫn dùng được — để gây cảm giác mất phương hướng lúc kịch tính lên cao — miễn là bạn CHỌN làm vậy, không phải quên mất trục ở đâu.') +
    `</div></div>` },

  /* 13 — Quy tắc 30° & liên tục */
  { t: 'Quy tắc 30° & liên tục giữa các cú cắt', body:
    cards([
      { ic: '📐', t: 'Quy tắc 30°', d: 'đổi góc máy ít nhất 30° giữa hai shot liền nhau của CÙNG một chủ thể — đổi ít hơn thì thành jump cut', c: 'red' },
      { ic: '👀', t: 'Khớp hướng nhìn (eyeline)', d: 'nếu bạn nhìn sang trái ở shot này, hướng nhìn phải NHẤT QUÁN ở mọi shot tiếp — đổi trục là người xem lạc hướng', c: 'amb' },
      { ic: '✂️', t: 'Cắt theo hành động', d: 'cắt đúng LÚC tay đang đưa lên gõ phím, không cắt lúc đứng yên — cú cắt "trốn" trong chuyển động, mắt không kịp nhận ra', c: 'grn' },
      { ic: '🔁', t: 'Liên tục (continuity)', d: 'đồ vật, quần áo, mức nước trong cốc, ánh sáng ngoài cửa sổ — phải GIỐNG NHAU giữa các take của cùng một cảnh', c: 'blu' },
    ], 4) },

  /* 14 — Bảng tra nhanh */
  { t: 'Bảng tra nhanh cả chương', body:
    table(['Khái niệm', 'Quy tắc / giá trị', 'Dùng khi'], [
      ['Quy tắc 1/3', 'mắt ở giao điểm 1/3 trên khung', 'mọi shot có một chủ thể rõ'],
      ['Khoảng trống đầu', 'vừa đủ — không dư, không thiếu', 'MS/MCU/CU có đầu người trong khung'],
      ['Khoảng nhìn', 'chừa khoảng trống phía hướng nhìn/di chuyển', 'chủ thể không nhìn thẳng máy'],
      ['Đặt giữa', 'chủ thể ở tâm khung, nền đối xứng', 'talking head một mình, nền gọn'],
      ['Tiêu cự méo mặt', '! do khoảng cách gần, không do ống rộng', 'quay chân dung/talking head cận'],
      ['Trục 180° (dựng phim)', 'mọi máy cùng một phía trục hành động', 'hội thoại, phỏng vấn nhiều máy'],
      ['Quy tắc 30°', 'đổi góc ≥30° giữa 2 shot cùng chủ thể', 'tránh jump cut khi cắt liền'],
      ['Vùng an toàn 9:16', '! ước lượng — luôn tự kiểm lại trên app thật', 'video dọc có chữ/CTA gần mép'],
    ]) },

  /* 15 — Thực hành */
  { t: '🎬 Thực hành 20–30 phút', body:
    cards([
      { ic: '📱', t: 'Pocket 3 hoặc iPhone', d: 'máy đang có, không cần mua thêm', c: 'blu' },
      { ic: '🪑', t: 'Một góc bàn học/làm việc', d: 'nơi bạn hay quay talking head', c: 'amb' },
    ], 2) +
    kpis([
      { v: '5 cỡ cảnh', l: 'quay cùng một chủ thể: WS/MS/MCU/CU/ECU', c: 'grn' },
      { v: '3 góc máy', l: 'ngang mắt · cao · thấp, cùng một câu thoại', c: 'tea' },
      { v: '1 cặp khoảng cách', l: '30cm ống rộng vs 2m + zoom — so méo mặt', c: 'vio' },
    ]) +
    box('good', '<b>Đạt khi:</b> có đủ 5 file quay theo 5 cỡ cảnh (đặt tên rõ cỡ cảnh trong tên file), và bạn chỉ được — không cần xem lại bài — vì sao ảnh chụp cách 30cm bằng ống rộng làm mũi to bất thường.') },
]);
