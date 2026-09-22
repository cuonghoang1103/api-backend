/** Content Creator · Deck cr-09 — Chương 9: Thu âm khi quay. */
import { two, S, cover, cards, box, table, mindmap, bars, meter, audioWave, timeline, code, note, figure, steps, C, esc } from './_cr-chung.mjs';

export const deck = { key: 'cr-09', code: 'CR · CHƯƠNG 9', title: 'Thu âm khi quay', sub: 'Content Creator · Chương 9' };

/* Chữ SVG dùng chung cho hình tự vẽ trong deck này (bản rút gọn của T() trong _cr-chung.mjs — không export nên khai lại). */
const t = (x, y, s, { size = 16, fill = C.tx, anchor = 'start', weight = 400, mono = false, op } = {}) =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}"` +
  ` font-family="${mono ? "'SF Mono',Menlo,monospace" : "-apple-system,'Segoe UI',Arial,sans-serif"}"${op ? ` opacity="${op}"` : ''}>${esc(s)}</text>`;

/* ── Thang dBFS: thanh dọc 0 → -60 dBFS, chia vùng. ───────────────────────── */
const dbfsGauge = () => {
  const W = 620, x0 = 230, bw = 90, yTop = 34, yBot = 420; // 0dB ở yTop, -60dB ở yBot
  const H = 460;
  const y = (db) => yTop + ((-db) / 60) * (yBot - yTop);
  const zone = (dbHi, dbLo, fill, op = 0.85) => `<rect x="${x0}" y="${y(dbHi).toFixed(1)}" width="${bw}" height="${(y(dbLo) - y(dbHi)).toFixed(1)}" fill="${fill}" opacity="${op}"/>`;
  let s = `<svg class="c-svg" viewBox="0 0 ${W} ${H}" width="${W}">`;
  s += zone(0, -6, C.red, 0.55);
  s += zone(-6, -12, C.grn, 0.85);
  s += zone(-12, -40, '#2a3446', 0.9);
  s += zone(-40, -60, C.dim, 0.35);
  s += `<rect x="${x0}" y="${yTop}" width="${bw}" height="${yBot - yTop}" fill="none" stroke="#3a4558" stroke-width="1.5"/>`;
  s += `<line x1="${x0 - 8}" y1="${yTop}" x2="${x0 + bw + 8}" y2="${yTop}" stroke="${C.red}" stroke-width="3"/>`;
  [0, -6, -12, -24, -40, -60].forEach((db) => {
    s += `<line x1="${x0 - 6}" y1="${y(db).toFixed(1)}" x2="${x0}" y2="${y(db).toFixed(1)}" stroke="#8f9bb0" stroke-width="1.5"/>`;
    s += t(x0 - 12, y(db) + 5, `${db}`, { size: 14, anchor: 'end', fill: C.mu, mono: true });
  });
  s += t(x0 + bw / 2, yTop - 12, '0 dBFS — TRẦN CỨNG', { size: 15, anchor: 'middle', weight: 800, fill: C.red });
  const lbl = (dbHi, dbLo, title, desc, fill, dy = 0) => {
    const cy = (y(dbHi) + y(dbLo)) / 2 + dy;
    return t(x0 + bw + 22, cy - 6, title, { size: 17, weight: 800, fill }) + t(x0 + bw + 22, cy + 15, desc, { size: 14, fill: C.mu });
  };
  s += lbl(-6, 0, 'Sát trần', 'đỉnh to bất chợt là vỡ', C.red);
  s += lbl(-12, -6, 'MỤC TIÊU', 'đặt đỉnh giọng nói ở đây', C.grn);
  s += lbl(-40, -12, 'An toàn', 'còn khoảng lùi (headroom)', '#c9d3e0');
  s += lbl(-60, -40, 'Sàn ồn', 'tiếng quạt/máy/mic tự nhiễu', C.dim);
  return s + `</svg>`;
};

/* ── Sơ đồ đặt lav mic trên người. Figure() đặt bên phải, chú thích bên trái/phải — tránh đè chữ lên người. */
const micPlacement = () => {
  const W = 760, H = 480;
  const fx = 560, fy = 66, sc = 1.5; // gốc figure() sau translate+scale
  const mouthY = fy + 22 * sc, clipX = fx + 14 * sc, clipY = fy + 50 * sc;
  let s = `<svg class="c-svg" viewBox="0 0 ${W} ${H}" width="${W}">`;
  s += `<defs><marker id="arrTeal" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="${C.tea}"/></marker></defs>`;
  s += `<g transform="translate(${fx} ${fy}) scale(${sc})">${figure({ shirt: '#3b82f6' })}</g>`;

  // Nhãn "Miệng" phía trên đầu.
  s += t(fx, 34, 'Miệng', { size: 16, weight: 800, fill: '#e9eef6', anchor: 'middle' });
  s += `<line x1="${fx}" y1="42" x2="${fx}" y2="${mouthY - 4}" stroke="#8f9bb0" stroke-width="1.5"/>`;

  // Khoảng cách miệng → mic, đặt bên PHẢI figure (ngoài vai áo).
  const dx = fx + 62;
  s += `<line x1="${dx}" y1="${mouthY}" x2="${dx}" y2="${clipY}" stroke="${C.amb}" stroke-width="2" stroke-dasharray="5 4"/>`;
  s += `<path d="M${dx - 6} ${mouthY + 6} L${dx} ${mouthY} L${dx + 6} ${mouthY + 6} M${dx - 6} ${clipY - 6} L${dx} ${clipY} L${dx + 6} ${clipY - 6}" stroke="${C.amb}" stroke-width="2" fill="none"/>`;
  s += t(dx + 14, (mouthY + clipY) / 2 - 2, '~1 gang tay', { size: 16, weight: 800, fill: C.amb });
  s += t(dx + 14, (mouthY + clipY) / 2 + 18, '(15–20cm)', { size: 13, fill: C.mu, mono: true });

  // Mic capsule kẹp trên ngực.
  s += `<circle cx="${clipX}" cy="${clipY}" r="7" fill="#e9eef6" stroke="${C.tea}" stroke-width="2.5"/>`;
  s += `<rect x="${clipX - 3}" y="${clipY - 2}" width="6" height="12" rx="2" fill="${C.tea}"/>`;
  s += `<line x1="${clipX}" y1="${clipY - 9}" x2="${clipX}" y2="${clipY - 16}" stroke="${C.tea}" stroke-width="2"/>`;

  // Chú thích bên TRÁI, mũi tên chạy từ khối chữ tới mic — không cắt qua thân người.
  const tx = 40, tyTop = 150;
  s += `<path d="M300 ${tyTop + 55} Q${(300 + clipX) / 2} ${tyTop + 20} ${clipX - 10} ${clipY - 6}" stroke="${C.tea}" stroke-width="2" fill="none" marker-end="url(#arrTeal)"/>`;
  s += t(tx, tyTop, 'Kẹp trên vải DÀY', { size: 17, weight: 800, fill: C.tea });
  s += t(tx, tyTop + 24, '(áo sơ mi, áo khoác)', { size: 15, fill: '#e9eef6' });
  s += t(tx, tyTop + 50, 'Đầu mic hướng LÊN,', { size: 14, fill: C.mu });
  s += t(tx, tyTop + 70, 'không bị vải che phía trên.', { size: 14, fill: C.mu });
  s += t(tx, tyTop + 94, 'Vải mỏng / 2 lớp: bí tiếng,', { size: 14, fill: C.mu });
  s += t(tx, tyTop + 114, 'hụt các âm cao (treble).', { size: 14, fill: C.mu });

  s += t(40, H - 46, 'Tránh: kẹp dưới khăn/cà vạt cọ xát,', { size: 14, fill: C.dim });
  s += t(40, H - 26, 'hướng mic úp xuống, hoặc để lộ ngoài áo khoác gió.', { size: 14, fill: C.dim });
  return s + `</svg>`;
};

/* ── Tiếng vang phòng: cứng vs mềm. ────────────────────────────────────────── */
const roomEcho = () => {
  const W = 1160, H = 380, pw = 540, gap = 40;
  const panel = (x0, hard) => {
    let s = `<rect x="${x0}" y="20" width="${pw}" height="300" rx="14" fill="#11161f" stroke="#2a3446" stroke-width="2"/>`;
    const mx = x0 + 70, my = 170, rx = x0 + pw - 90, ry = 260;
    if (hard) {
      // tường cứng: nhiều đường phản xạ zig-zag
      const bounces = [
        [[mx, my], [x0 + 480, 60], [x0 + 140, 290], [rx, ry]],
        [[mx, my], [x0 + 90, 60], [x0 + 470, 260], [rx, ry]],
        [[mx, my], [rx, 70], [x0 + 200, 270], [rx, ry]],
      ];
      bounces.forEach((pts, i) => {
        const d = pts.map((p, j) => `${j ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
        s += `<path d="${d}" stroke="${C.red}" stroke-width="1.8" fill="none" stroke-dasharray="6 5" opacity="${0.85 - i * 0.15}"/>`;
      });
      s += t(x0 + pw / 2, 350, 'Dội nhiều lần trước khi tới mic → nghe "vang", đục', { size: 15, anchor: 'middle', fill: C.red, weight: 700 });
    } else {
      const bounces = [
        [[mx, my], [x0 + 460, 90], [rx, ry]],
        [[mx, my], [x0 + 150, 260], [rx, ry]],
      ];
      bounces.forEach((pts, i) => {
        const d = pts.map((p, j) => `${j ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
        s += `<path d="${d}" stroke="${C.tea}" stroke-width="1.8" fill="none" stroke-dasharray="3 8" opacity="${0.55 - i * 0.2}"/>`;
      });
      // rèm bên trái, tủ áo bên phải trên
      s += `<rect x="${x0 + 20}" y="40" width="26" height="240" fill="#2a3446"/>`;
      for (let i = 0; i < 8; i++) s += `<path d="M${x0 + 20} ${44 + i * 30} q13 10 26 0" stroke="#4a5a76" stroke-width="2" fill="none"/>`;
      s += t(x0 + 33, 300, 'rèm dày', { size: 12.5, anchor: 'middle', fill: C.mu });
      s += `<rect x="${x0 + pw - 130}" y="40" width="90" height="70" rx="4" fill="#2a3446" stroke="#4a5a76"/>`;
      for (let i = 0; i < 3; i++) s += `<line x1="${x0 + pw - 122 + i * 28}" y1="46" x2="${x0 + pw - 122 + i * 28}" y2="104" stroke="#5a6a86" stroke-width="10" opacity=".6"/>`;
      s += t(x0 + pw - 85, 125, 'tủ quần áo mở', { size: 12.5, anchor: 'middle', fill: C.mu });
      s += t(x0 + pw / 2, 350, 'Bề mặt mềm hút bớt phản xạ → tiếng sạch, gọn', { size: 15, anchor: 'middle', fill: C.tea, weight: 700 });
    }
    s += `<circle cx="${mx}" cy="${my}" r="9" fill="${C.amb}"/>` + t(mx, my - 16, 'nguồn', { size: 12.5, anchor: 'middle', fill: C.amb });
    s += `<rect x="${rx - 12}" y="${ry - 10}" width="24" height="20" rx="3" fill="#e9eef6"/>` + t(rx, ry + 30, 'mic', { size: 12.5, anchor: 'middle', fill: '#e9eef6' });
    return s;
  };
  let s = `<svg class="c-svg" viewBox="0 0 ${W} ${H}" width="${W}">`;
  s += t(20 + pw / 2, 12, 'PHÒNG TRỐNG — TƯỜNG, KÍNH, SÀN CỨNG', { size: 15, anchor: 'middle', weight: 800, fill: '#e9eef6' });
  s += `<g>${panel(20, true)}</g>`;
  s += t(20 + pw + gap + pw / 2, 12, 'PHÒNG CÓ RÈM · CHĂN · TỦ QUẦN ÁO', { size: 15, anchor: 'middle', weight: 800, fill: '#e9eef6' });
  s += `<g>${panel(20 + pw + gap, false)}</g>`;
  return s + `</svg>`;
};

export const slides = S([
  cover({ t: 'Chương 9 — Thu âm khi quay', sub: 'dB/dBFS · micro & cách đặt · mức thu chuẩn · thu hai hệ thống & đồng bộ', chap: 'CHƯƠNG 9' }),

  { t: 'Bản đồ chương', body: mindmap('Thu âm khi quay', 'Chương 9', [
    { t: '📏 dB · dBFS · bit', d: '48kHz, 24-bit, 32-bit float — vì sao quan trọng', c: 'red' },
    { t: '🎙️ Micro & cách đặt', d: 'Tích hợp · lav · không dây · shotgun · USB', c: 'ora' },
    { t: '🎚️ Mức thu −12…−6 dBFS', d: 'Đo bằng ffmpeg, giám sát bằng tai nghe', c: 'amb' },
    { t: '🏠 Phòng & tiếng ồn', d: 'Tiếng vang, nguồn ồn nhà VN, room tone, chống gió', c: 'tea' },
    { t: '🔗 Hai hệ thống', d: 'Ghi dự phòng trên mic, đồng bộ bằng sóng âm', c: 'blu' },
    { t: '✅ Nối tới', d: 'Ch6 (Pocket 3) · Ch12/13 (dựng) · Ch16 (âm hậu kỳ)', c: 'vio' },
  ]) },

  { t: 'Tai khó tha thứ hơn mắt', body: cards([
    { ic: '👂', t: 'Tai khó tha thứ hơn mắt', d: 'Hình hơi mờ vẫn xem được. Giọng rè, vang, đầy tiếng gió — người xem thoát trong vài giây.', c: 'red' },
    { ic: '🧠', t: 'Não xử lý lời nói khác ảnh', d: 'Nghe một câu lẫn tạp âm buộc não phải "đoán lại" từng chữ — mệt hơn nhìn khung hình hơi rung.', c: 'ora' },
    { ic: '🎯', t: 'Mục 0 đã nói, đây là chỗ LÀM', d: 'Thứ tự đầu tư: âm thanh → ánh sáng → lưu trữ → máy quay. Chương này dạy làm đúng vế đầu tiên.', c: 'amb' },
    { ic: '🔧', t: 'Hậu kỳ cứu được — có giới hạn', d: 'Giảm ồn, EQ, nén tiếng (Ch16) cứu được nhiều thứ. Tiếng đã VỠ lúc thu thì không phần mềm nào phục hồi.', c: 'grn' },
  ], 2) },

  { t: 'Thang dBFS — trần cứng và ba vùng', body: two(dbfsGauge(),
    box('good', '<b>Đích:</b> đỉnh giọng nói ở −12…−6 dBFS — đủ to để át sàn ồn, vẫn còn 6–12 dB dự phòng cho tiếng cười hay tiếng hét bất ngờ.') +
    box('warn', '<b>0 dBFS là trần cứng:</b> vượt qua là đỉnh sóng bị cắt phẳng (clip) — méo, hậu kỳ không phục hồi được. 32-bit float chỉ cứu phần xử lý SỐ; micro/preamp đã quá tải ở đầu vào thì vẫn méo.') +
    box('info', '<b>Quá nhỏ cũng hỏng:</b> đỉnh ở −30 dBFS thì lúc kéo to lên ở hậu kỳ, sàn ồn (quạt, điều hoà) bị kéo lên theo.')) },

  { t: '48kHz · 24-bit · 32-bit float', body: table(['Thông số', 'Ý nghĩa', 'Trong đồ nghề của bạn'], [
    ['48 kHz', 'Tần số lấy mẫu chuẩn cho VIDEO (nhạc CD dùng 44,1kHz) — khớp nhịp khi đồng bộ hình/tiếng', 'DJI Mic 2/3 ghi nội bộ mặc định 48kHz'],
    ['24-bit', 'Nhiều "nấc" biên độ hơn 16-bit — còn khoảng lùi khi cần kéo gain ở hậu kỳ mà không lộ tiếng rè', 'Mic2: 8GB≈14 giờ · Mic3: 32GB≈57,3 giờ'],
    ['!32-bit float', 'Dấu phẩy động — kéo/hạ gain SAU khi quay không vỡ số. Chỉ cứu khâu SỐ: micro/preamp đã quá tải ở đầu vào analog thì vẫn méo tiếng.', 'Bật ở: Wireless Microphone → 32-bit Float (Mic 2/3)'],
  ]) + note('Theo DJI: 8GB/đầu phát Mic 2 ≈ 14 giờ ở 24-bit, ~11 giờ ở 32-bit float. Mic 3 (32GB/đầu phát) tới 57,3 giờ / 43 giờ.') },

  { t: 'Đo thật bằng ffmpeg — ba mức', body: meter([
    { t: 'Quá nhỏ', peak: -32.1, v: 'low' },
    { t: 'Trong mục tiêu', peak: -8.1, v: 'good' },
    { t: 'Vỡ tiếng', peak: 0.0, v: 'clip' },
  ]) + code('ffmpeg -i clip.wav -af volumedetect -f null -', 'bash') },

  { t: 'Năm loại micro bạn sẽ gặp', body: table(['Loại', 'Đặt ở đâu', 'Mạnh nhất khi'], [
    ['Tích hợp', 'Trên thân Pocket 3 (3 mic) / iPhone (4 mic)', 'Vlog nhanh, phòng yên tĩnh, không mang thêm gì'],
    ['Cài áo (lav) có dây', 'Kẹp ngực, cách miệng ~1 gang tay', 'Talking head, phỏng vấn ngồi yên một chỗ'],
    ['!Không dây (DJI Mic)', 'Kẹp ngực hoặc gắn nam châm', 'Vừa đi vừa nói, cách máy vài mét, 2 người nói chuyện'],
    ['Shotgun (thu hướng)', 'Hotshoe trên máy, hoặc boom ngoài khung hình', 'Quay nhóm, B-roll có lời, không muốn thấy mic cài áo'],
    ['USB (bàn làm việc)', 'Trên bàn, cách miệng 15–30cm', 'Giọng đọc, quay màn hình, podcast một chỗ cố định'],
  ], { sm: true }) },

  { t: 'Đặt lav mic trên người', body: micPlacement() },

  { t: 'DJI Mic 2/3 khi dùng với Pocket 3', body: cards([
    { ic: '🎙️', t: '32-bit float nội bộ', d: 'Ghi ngay trên đầu phát — kéo/hạ gain SAU khi quay gần như không vỡ. KHÔNG cứu được nếu tín hiệu đã quá tải NGAY ở đầu vào analog (hét sát mic). Có ở Mic 2 & Mic 3 — KHÔNG có ở DJI Mic bản gốc.', c: 'grn' },
    { ic: '🛟', t: 'Safety Track (Mic 2)', d: 'Tự ghi thêm một track dự phòng thấp hơn track chính 6dB — track chính vỡ vẫn còn bản sạch để dùng.', c: 'amb' },
    { ic: '💾', t: 'Ghi được bao lâu', d: 'Mic 2: 8GB/đầu phát ≈ 14 giờ (24-bit) / ~11 giờ (32-bit float). Mic 3: 32GB/đầu phát ≈ 57,3 giờ / 43 giờ.', c: 'vio' },
    { ic: '🎧', t: 'Nghe trực tiếp — chỉ qua receiver', d: 'Cổng tai nghe 3.5mm nằm trên RECEIVER. Link thẳng TX→Pocket 3 (không receiver) thì không có cổng này.', c: 'blu' },
  ], 2) + note('Chi tiết bật 32-bit float trên màn hình Pocket 3 và cách link OsmoAudio: xem lại Chương 6. Nguồn: dji.com/mic-2/faq, dji.com/mic-3/specs.') },

  { t: 'iPhone 16 Pro Max — Audio Mix', body: cards([
    { ic: '🔵', t: 'Standard', d: 'Phát đúng bản gốc đã thu — không chỉnh gì.', c: 'blu' },
    { ic: '🎯', t: 'In-Frame', d: 'Giảm tiếng và giọng nói từ nguồn KHÔNG xuất hiện trong khung hình.', c: 'amb' },
    { ic: '🏢', t: 'Studio', d: 'Giảm tiếng nền và tiếng vang phòng — nghe gần như thu trong phòng thu.', c: 'tea' },
    { ic: '🎬', t: 'Cinematic', d: 'Dồn mọi giọng nói vào track phía trước, giữ tiếng môi trường ở vòm xung quanh.', c: 'pnk' },
  ], 4) + note('4 chế độ này chỉnh SAU khi quay, trong app Ảnh — chỉ dùng được nếu quay ở Spatial Audio (mặc định trên iPhone 16+). Wind Noise Reduction tự bật cùng Spatial Audio/Stereo.') },

  { t: 'Tiếng vang phòng: cứng vs mềm', body: roomEcho() },

  { t: 'Sàn ồn nền — vì sao phải tắt trước khi quay', body: bars([
    { l: 'Tín hiệu ồn nền (minh hoạ tiếng quạt/điều hoà)', v: 47.6, txt: 'đỉnh ≈ −22,4 dBFS', c: 'red' },
    { l: 'Phòng gần như yên tĩnh (sàn ồn máy + phòng)', v: 5.7, txt: 'đỉnh ≈ −64,3 dBFS', c: 'grn' },
  ], { lw: 320 }) + note('Tín hiệu MINH HOẠ đo bằng ffmpeg volumedetect — không phải ghi âm tại một căn nhà cụ thể, nên xem đây là ví dụ về KHOẢNG CÁCH giữa hai trạng thái, không phải con số chuẩn cho mọi phòng. Bài học thật: điều hoà/quạt đang chạy tạo sàn ồn liên tục nằm ngay dưới vùng mục tiêu −12…−6dBFS của giọng nói, ăn bớt khoảng lùi giữa bạn và tạp âm. Tắt trước khi quay: điều hoà, quạt, đóng cửa hướng đường; hàng xóm đang karaoke thì đổi giờ quay.') },

  { t: 'Chống gió & room tone 30 giây', body: audioWave({ len: 30, parts: [
    { s: 11, e: 18, k: 'pause', t: 'đoạn đã cắt — im lặng trơ, cần room tone lấp vào' },
  ] }) + box('tip', '<b>Room tone:</b> ngay sau khi quay xong một bối cảnh, mọi người đứng yên, không nói, thu 30 giây "im lặng" của đúng căn phòng đó — dùng lấp chỗ cắt ở Chương 14/16.') + note('Chống gió: DJI Mic 2 có sẵn 2 lồng chống gió trong hộp (một cho mỗi đầu phát). Gió thổi thẳng vào đầu mic tạo tiếng "phù phù" tần số thấp — lồng đi kèm đủ cho gió nhẹ trong nhà; ra ngoài trời hoặc đi xe máy nên dùng thêm lồng lông dày (deadcat) để chắn gió mạnh hơn.') },

  { t: 'Thu hai hệ thống & đồng bộ', body: timeline({ len: 20, tracks: [
    { id: 'Pocket 3', clips: [{ s: 0, e: 20, t: 'hình + âm tích hợp', c: 'blu' }] },
    { id: 'DJI Mic', a: true, clips: [{ s: 0, e: 20, t: 'âm dự phòng 32-bit float', c: 'grn' }] },
  ], marks: [{ s: 1, t: '👏', c: 'amb' }] }) + note('👏 = mốc vỗ tay đầu mỗi take. Hai bản ghi độc lập, cùng một mốc — phần mềm dựng (Ch12/13) dò đúng đỉnh nhọn đó trên cả hai sóng âm để ghép khớp, không cần bạn tự đếm khung hình.') },

  { t: 'Bảng tra nhanh trước khi quay', body: table(['Việc', 'Con số / thao tác'], [
    ['Tần số mẫu', '48 kHz'],
    ['Độ sâu bit khi ghi nội bộ', '24-bit, hoặc 32-bit float nếu máy hỗ trợ'],
    ['!Mức đỉnh mục tiêu', '−12…−6 dBFS — không bao giờ chạm 0'],
    ['Khoảng cách lav tới miệng', '~1 gang tay (15–20cm), kẹp trên vải dày'],
    ['Trước khi quay', 'Tắt điều hoà/quạt, thu thử 10 giây rồi nghe lại bằng tai nghe'],
    ['Sau mỗi bối cảnh', 'Thu 30 giây room tone — im lặng hoàn toàn'],
    ['Quay 2 máy / ghi dự phòng', 'Vỗ tay 1 cái đầu mỗi take, đặt tên file âm khớp file hình'],
  ]) },

  { t: '🎬 Thực hành', body: steps([
    ['Tạo 3 file thử bằng ffmpeg ở ba mức khác nhau rồi tự đo lại', '&#96;ffmpeg -f lavfi -i "sine=frequency=440:duration=5" ... -af volumedetect -f null -&#96;'],
    ['Đặt lav mic cách miệng ~1 gang tay, kẹp trên vải dày, quay thử 20 giây', 'Nghe lại bằng tai nghe — đừng chỉ nhìn thanh mức trên màn hình'],
    ['Tắt điều hoà/quạt, đóng cửa hướng đường, thu 10 giây rồi so với lúc chưa tắt', 'Sàn ồn tụt xuống bao nhiêu dB so với lúc còn bật?'],
    ['Ngay sau cảnh, đứng yên không nói, thu 30 giây room tone', 'Đặt tên file kèm "_roomtone" để dễ tìm ở Chương 14/16'],
    ['Nếu quay 2 máy hoặc ghi dự phòng: vỗ tay 1 cái đầu mỗi take trước khi diễn', 'Đặt tên file âm khớp file hình cùng mã cảnh'],
  ]) + box('good', '<b>Đạt khi:</b> đọc được số dBFS thật từ ffmpeg thay vì đoán bằng mắt, và giải thích được vì sao 32-bit float không cứu được micro đã quá tải ngay ở đầu vào analog.') },
]);
