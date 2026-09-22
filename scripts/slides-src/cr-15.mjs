/** Content Creator · Deck cr-15 — Chương 15: Chỉnh màu. */
import { S, cover, cards, box, table, flow, mindmap, wheels, vectorscope, lumaScope, nodes, curve, bars, personShot } from './_cr-chung.mjs';

export const deck = { key: 'cr-15', code: 'CR · CHƯƠNG 15', title: 'Chỉnh màu', sub: 'Content Creator · Chương 15' };

const shotBox = (w, h, borderColor, filterCss, shirt, label) =>
  `<div style="text-align:center"><div style="border-radius:12px;overflow:hidden;border:2.5px solid ${borderColor};width:${w}px;height:${h}px;filter:${filterCss}">` +
  personShot({ w, h, size: 'MCU', at: 0.5, shirt }) +
  `</div><div style="margin-top:8px;font-size:16px;color:#d6deea;max-width:${w}px">${label}</div></div>`;

export const slides = S([
  /* 1 — Bìa */
  cover({
    t: 'Chương 15 — Chỉnh màu',
    sub: 'Từ cảnh Log xám xịt tới một tông màu nhất quán trên cả Pocket 3 và iPhone — đọc scope, dùng LUT, dựng cây node',
    chap: 'CHƯƠNG 15',
  }),

  /* 2 — Bản đồ chương */
  { t: 'Bản đồ chương', body: mindmap('Chỉnh màu', 'Chương 15', [
    { t: '🩹 Correction vs Grading', d: 'Rec.709, Log trông "bạc" vì sao, màn hình tham chiếu', c: 'red' },
    { t: '📊 Đọc scope', d: 'Waveform, vectorscope, RGB parade — không đoán bằng mắt', c: 'ora' },
    { t: '🎞️ Log & LUT', d: 'D-Log M, Apple Log → Rec.709 bằng LUT hoặc Color Space Transform', c: 'amb' },
    { t: '🔗 Cây node & look', d: 'Cân bằng → tương phản → thứ cấp → look, đúng thứ tự', c: 'grn' },
    { t: '🎥 Khớp Pocket 3 ↔ iPhone', d: 'Cùng một cảnh, hai máy, một tông màu', c: 'blu' },
    { t: '🧪 Thực hành', d: 'Chỉnh thật một clip Log bằng DaVinci Resolve', c: 'vio' },
  ]) },

  /* 3 — Correction vs Grading */
  { t: 'Correction và Grading — hai việc khác nhau', body:
    cards([
      { ic: '🩹', t: 'Color CORRECTION', d: 'Sửa lỗi: phơi sáng đúng, cân bằng trắng đúng, khớp các clip trong cùng một cảnh với nhau. Việc PHẢI làm, không phải lựa chọn.', c: 'blu' },
      { ic: '🎨', t: 'Color GRADING', d: 'Sau khi đã đúng, tạo MỘT LOOK có chủ đích — ấm hơn, lạnh hơn, tương phản hơn — cho cả video hoặc cả series. Việc lựa chọn, làm SAU correction.', c: 'amb' },
    ], 2) +
    box('info', '<b>Vì sao cảnh Log trông "bạc" (xám xịt, bệt màu)?</b> Log cố tình nén cả dải sáng rộng của cảm biến vào một dải giá trị hẹp, không áp tương phản hay bão hoà — Bài 5.4 đã nói: đó là NGUYÊN LIỆU THÔ, không phải lỗi. Correction đưa nó về đúng (Rec.709), rồi Grading mới thêm look. Làm ngược — thêm look trước khi correction đúng — là lý do "chỉnh mãi không ra màu".') },

  /* 4 — Màn hình tham chiếu */
  { t: 'Xem màu ở đâu cũng sai như nhau — trừ khi có màn hình tham chiếu', body:
    cards([
      { ic: '💻', t: 'MacBook Pro (Liquid Retina XDR)', d: 'System Settings → Displays → chọn một Reference Mode/preset Rec.709 — màn tự giới hạn đúng dải màu, tắt True Tone và tự chỉnh sáng trong lúc xem.', c: 'blu' },
      { ic: '🖥️', t: 'Mac Studio (không màn hình riêng)', d: 'Reference Mode chỉ có khi màn ngoài là Apple Studio Display/Pro Display XDR. Màn thường: ít nhất đặt đúng profile màu trong Displays, đừng tin mắt trần trên màn chưa hiệu chỉnh.', c: 'grn' },
      { ic: '📱', t: 'iPad Pro M5', d: 'Settings → Display & Brightness → Advanced → Reference Mode — Ultra Retina XDR hiện màu tham chiếu Rec.709/HDR. Tiện xem lại nhanh, không phải máy chỉnh màu chính (Bài 6.3).', c: 'amb' },
    ], 3) +
    box('warn', 'Không màn hình nào ở trên "biết trước" bạn cài đúng chế độ — và ngay cả màn xịn vẫn đánh lừa mắt nếu phòng quá sáng hoặc quá tối. Đó là lý do Bài 15.2 dạy đọc SỐ trên scope thay vì tin mắt, giống cách Bài 5.2 đã dạy đọc waveform/zebra thay vì tin màn hình máy quay.') },

  /* 5 — Waveform 4 kiểu */
  { t: 'Đọc waveform: thiếu sáng · đủ · cháy · Log chưa chỉnh', body:
    `<div style="font-size:16px;color:#a3aec0;margin-bottom:10px">Trục dọc 0–100 là độ sáng (luma); mỗi chấm là một điểm ảnh chiếu xuống theo đúng cột ngang của nó trong khung hình.</div>` +
    `<div style="display:grid;grid-template-columns:repeat(2,330px);gap:16px;justify-content:center">` +
    lumaScope({ kind: 'under', w: 330, label: 'THIẾU SÁNG — dồn sát đáy (0)' }) +
    lumaScope({ kind: 'ok', w: 330, label: 'ĐỦ SÁNG — trải giữa, không chạm 2 mép' }) +
    lumaScope({ kind: 'over', w: 330, label: 'CHÁY SÁNG — dồn sát đỉnh (100), mất chi tiết' }) +
    lumaScope({ kind: 'flat', w: 330, label: 'LOG CHƯA CHỈNH — bệt hẹp giữa khung' }) +
    `</div>` },

  /* 6 — Vectorscope đúng/lệch */
  { t: 'Vectorscope: cân bằng trắng đúng và lệch', body:
    `<div style="display:flex;gap:28px;justify-content:center;align-items:flex-start">` +
    vectorscope({ clouds: [{ a: 123, r: 0.4, sp: 0.12, c: '#ffd08a' }], w: 340, skin: true, label: 'ĐÚNG — mây da nằm sát đường mốc ≈123°' }) +
    vectorscope({ clouds: [{ a: 99, r: 0.42, sp: 0.12, c: '#ff9a6b' }], w: 340, skin: true, label: 'LỆCH — mây da ngả về phía đỏ (ám nóng)' }) +
    `</div>` },

  /* 7 — RGB Parade (minh hoạ) */
  { t: 'RGB Parade (minh hoạ) — lệch cân bằng trắng theo từng kênh màu', body:
    `<div style="font-size:16px;color:#ffc233;font-weight:800;margin-bottom:4px">LỆCH — cân bằng trắng ngả ấm: R cao, B thấp</div>` +
    bars([
      { l: 'R — đỏ', v: 78, txt: '≈78', c: 'red' },
      { l: 'G — lục', v: 61, txt: '≈61', c: 'grn' },
      { l: 'B — lam', v: 41, txt: '≈41', c: 'blu' },
    ], { lw: 110 }) +
    `<div style="font-size:16px;color:#7ff0c4;font-weight:800;margin:16px 0 4px">ĐÃ CÂN BẰNG — ba kênh gần như cùng mức</div>` +
    bars([
      { l: 'R — đỏ', v: 64, txt: '≈64', c: 'red' },
      { l: 'G — lục', v: 63, txt: '≈63', c: 'grn' },
      { l: 'B — lam', v: 62, txt: '≈62', c: 'blu' },
    ], { lw: 110 }) },

  /* 8 — Log → LUT/CST → Rec.709 */
  { t: 'Từ Log tới Rec.709: LUT hoặc Color Space Transform', body:
    flow([
      { e: '🎬', t: '1. Quay Log', d: 'D-Log M (Pocket 3) hoặc Apple Log (iPhone) — 10-bit, phẳng có chủ đích', c: 'red' },
      { e: '🧩', t: '2. Node đầu tiên', d: 'LUT chính hãng D-Log M→Rec.709, hoặc Color Space Transform', c: 'ora' },
      { e: '🎚️', t: '3. Node correction', d: 'Sửa phơi sáng, cân bằng trắng còn sai sót sau LUT', c: 'amb' },
      { e: '🎨', t: '4. Node grading', d: 'Tương phản, thứ cấp, look — có chủ đích', c: 'grn' },
      { e: '📤', t: '5. Xuất Rec.709', d: 'Dải màu chuẩn cho YouTube/TikTok/Facebook/Instagram', c: 'blu' },
    ]) +
    box('tip', 'LUT/CST luôn đứng ĐẦU chuỗi node, không phải cuối — mọi node sau nó phải tính trên dữ liệu ĐÃ đúng không gian màu, không phải trên Log thô.') },

  /* 9 — LUT chính hãng */
  { t: 'LUT chính hãng: D-Log M và Apple Log', body:
    table(['Máy / phần mềm', 'LUT hoặc CST chính hãng', 'Ghi chú đã kiểm'], [
      ['DJI Osmo Pocket 3 (D-Log M)', '+LUT .cube tải từ dji.com/downloads', '"D-Log M to Rec.709" — mục Transcoders'],
      ['iPhone (Apple Log)', '+LUT dựng SẴN trong Final Cut Pro', 'Final Cut Pro tự nhận diện & áp — không phải file .cube rời để tải'],
      ['DaVinci Resolve — Apple Log', '+Color Space Transform: Input Color Space = Apple Log', 'Có trong CST từ Resolve 18.6 — kiểm đúng tên trong bản bạn cài'],
      ['DaVinci Resolve — D-Log M', '-Chưa có preset CST chính thức riêng cho bản "M"', 'Preset "DJI D-Gamut/D-Log" có sẵn là cho D-Log ĐỜI CŨ — dùng LUT .cube của DJI thay vì preset này'],
    ], { sm: true }) },

  /* 10 — Cây node */
  { t: 'Cây node chỉnh màu kiểu DaVinci Resolve', body:
    nodes([
      { n: 1, t: 'Cân bằng: LUT/CST + phơi sáng', th: 'linear-gradient(135deg,#6b7280,#9ca3af)' },
      { n: 2, t: 'Tương phản: curve chữ S', th: 'linear-gradient(135deg,#334155,#0f172a)' },
      { n: 3, t: 'Thứ cấp: da (qualifier)', th: 'linear-gradient(135deg,#f0c29e,#d99a6c)' },
      { n: 4, t: 'Look: ấm/lạnh có chủ đích', th: 'linear-gradient(135deg,#0ea5a0,#d97706)' },
      { n: 5, t: 'Vignette + grain nhẹ', th: 'radial-gradient(circle,#6b7280,#111827)' },
    ]) +
    box('tip', 'Thứ tự KHÔNG tuỳ ý: sửa đúng (node 1–2) trước, chọn vùng cần riêng (node 3) sau khi màu chung đã đúng, rồi mới thêm look (node 4) và hiệu ứng trang trí (node 5) cuối cùng. Đổi thứ tự này, mọi chỉnh sau LUT đều tính SAI vì đang tính trên dữ liệu chưa đúng.') },

  /* 11 — Wheels */
  { t: 'Bánh xe màu: Lift · Gamma · Gain', body:
    wheels([
      { t: 'Lift (Shadow)', d: 'Vùng tối — đẩy nhẹ về xanh lam/teal', x: -0.15, y: 0.12 },
      { t: 'Gamma (Midtone)', d: 'Vùng giữa — giữ trung tính, chỉ chỉnh độ sáng', x: 0, y: 0 },
      { t: 'Gain (Highlight)', d: 'Vùng sáng — đẩy nhẹ về cam/vàng', x: 0.22, y: 0.08 },
    ]) +
    box('info', 'Đây là ba bánh xe màu chính trong trang Color của Resolve — kéo NHẸ như hình là đủ tạo một look "teal & orange" rất phổ biến; kéo mạnh tay là dấu hiệu rõ nhất của người mới học màu.') },

  /* 12 — Curve */
  { t: 'Đường cong tương phản (Curves)', body:
    `<div style="display:flex;gap:34px;justify-content:center">` +
    curve({ kind: 's', w: 300, label: 'S-curve — tăng tương phản' }) +
    curve({ kind: 'lift', w: 300, label: 'Lift — nâng đen, look phai màu' }) +
    `</div>` },

  /* 13 — Trước/sau: Log → đã chỉnh */
  { t: 'Trước/sau: D-Log M phẳng → đã chỉnh qua 4 node', body:
    `<div style="display:flex;gap:26px;justify-content:center;align-items:flex-end">` +
    shotBox(420, 236, '#3a4558', 'grayscale(45%) contrast(62%) brightness(1.1) saturate(45%)', '#3b82f6', 'D-Log M — CHƯA chỉnh (phẳng, xám)') +
    shotBox(420, 236, '#34d399', 'contrast(112%) saturate(122%) brightness(1.01)', '#3b82f6', 'Sau node 1–4 — cân bằng + tương phản + look') +
    `</div>` },

  /* 14 — Khớp Pocket 3 ↔ iPhone */
  { t: 'Khớp màu: Pocket 3 và iPhone trong cùng một cảnh', body:
    `<div style="display:flex;gap:26px;justify-content:center;align-items:flex-end">` +
    shotBox(420, 236, '#60a5fa', 'contrast(110%) saturate(118%) brightness(1.0)', '#3b82f6', 'Pocket 3 — D-Log M đã chỉnh') +
    shotBox(420, 236, '#f472b6', 'contrast(110%) saturate(118%) brightness(1.0)', '#3b82f6', 'iPhone — Apple Log đã chỉnh') +
    `</div>` +
    box('good', 'Cùng một node cuối, cùng một look — đó là MỤC TIÊU của việc khớp máy: người xem không đoán được cảnh nào vừa quay bằng máy nào.') },

  /* 15 — Bảng tra nhanh */
  { t: 'Bảng tra nhanh cả chương', body:
    table(['Thuật ngữ', 'Ý nghĩa nhanh'], [
      ['Correction', 'Sửa đúng: phơi sáng + cân bằng trắng + khớp các clip trong cùng cảnh'],
      ['Grading', 'Thêm look có chủ đích, luôn làm SAU correction'],
      ['Rec.709', 'Dải màu chuẩn cho video xem trên web/mạng xã hội'],
      ['Waveform', 'Đọc ĐỘ SÁNG (luma) 0–100 theo chiều ngang khung hình'],
      ['Vectorscope', 'Đọc MÀU — hướng và độ mạnh; đường mốc da nằm giữa mốc R và Yl, ≈123°'],
      ['RGB Parade', 'Ba kênh R/G/B tách riêng — thấy ngay kênh nào đang lệch'],
      ['LUT', 'Bảng tra sẵn đổi màu — dùng ở node ĐẦU, không phải "look" cuối cùng'],
      ['CST', 'Color Space Transform — Resolve tự tính đổi không gian màu bằng công thức'],
      ['Node', 'Một bước chỉnh trong chuỗi — thứ tự quyết định kết quả đúng hay sai'],
      ['PowerGrade / Stills', 'Lưu lại một cây node để dùng lại — Stills riêng từng dự án, PowerGrade dùng chung mọi dự án'],
    ], { sm: true }) },

  /* 16 — Thực hành */
  { t: '🎬 Thực hành', body:
    cards([
      { ic: '🎬', t: 'Quay một clip Log', d: 'D-Log M hoặc Apple Log, 10 giây, có mặt người trong khung — cần vùng da để soi vectorscope', c: 'blu' },
      { ic: '🧩', t: 'Node 1: LUT hoặc CST', d: 'Đưa về Rec.709 đúng bảng ở Bài 15.3 — KHÔNG dùng preset D-Log đời cũ cho D-Log M', c: 'amb' },
      { ic: '📊', t: 'Soi bằng scope, không bằng mắt', d: 'Waveform trải giữa; vectorscope: mây da chạm đường mốc ≈123°', c: 'grn' },
      { ic: '🎨', t: 'Node 2–4: tương phản + look nhẹ', d: 'S-curve nhẹ, kéo wheel không quá 20%, lưu lại thành Still', c: 'vio' },
    ], 2) +
    box('good', '<b>Đạt khi:</b> vectorscope cho thấy mây da nằm sát đường mốc da, waveform không dồn sát 0 hay 100, và bạn giải thích được vì sao node LUT phải đứng ĐẦU chuỗi chứ không phải cuối.') },
]);
