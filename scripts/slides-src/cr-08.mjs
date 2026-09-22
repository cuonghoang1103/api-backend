/**
 * cr-08.mjs — Content Creator, Chương 8: Ánh sáng.
 * Bản chất ánh sáng (cứng/mềm, hướng, luật nghịch đảo, Kelvin, CRI/TLCI) · ánh
 * sáng tự nhiên (cửa sổ 45°, nắng trưa VN) · ba điểm & 4 kiểu sáng mặt · góc
 * quay tại nhà ngân sách thấp.
 *
 *   node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/cr-08.mjs
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/cr-08.mjs --out <dir>
 *
 * Nguồn số liệu chính (đầy đủ trong báo cáo bàn giao):
 *  - Luật bình phương nghịch đảo (chính xác cho nguồn điểm, gần đúng cho nguồn
 *    lớn/gần): petapixel.com/inverse-square-law-light,
 *    digital-photography-school.com/an-introduction-to-the-inverse-square-law.
 *  - CRI — chuẩn CIE, thang 0–100: waveformlighting.com/tech/what-is-cri-color-rendering-index.
 *  - TLCI — chuẩn EBU (Tech 3355 / TLCI-2012), thang 0–100, ≥85 = máy quay gần
 *    như không cần chỉnh màu lại: gossen-photo.de/en/tlci-television-lighting-consistency-index.
 *  - Nhấp nháy do PWM dimming (khác nhấp nháy 100Hz điện lưới đã nói ở Chương 5):
 *    waveformlighting.com/film-photography/an-introduction-to-flicker-free-led-strip-dimming.
 *  - 4 kiểu sáng mặt Rembrandt/loop/butterfly/split:
 *    digital-photography-school.com/6-portrait-lighting-patterns-every-photographer-should-know.
 *  - Tỉ lệ key:fill theo stop (quy ước ĐƠN GIẢN — so trực tiếp độ sáng 2 đèn,
 *    không phải công thức (key+fill):fill của ASC): studiobinder.com/blog/lighting-ratios.
 *  - DJI Osmo Pocket 3 — 1 inch sensor, f/2.0 cố định: dji.com/osmo-pocket-3/specs
 *    (đã dùng ở Chương 5, nhắc lại khi nói về khẩu độ không đổi được).
 *  - Điện Việt Nam 220V/50Hz: worldstandards.eu/electricity/plug-voltage-by-country/vietnam
 *    (đã dùng ở Chương 5, nhắc lại khi nói về nhấp nháy 100Hz).
 */
import { S, cover, cards, box, steps, table, vs, mindmap, kelvin, bars, lightPlot, C } from './_cr-chung.mjs';

// Sơ đồ đèn (SVG 560px) đứng một mình thì dồn trái, bỏ trống nửa phải → căn giữa.
const giua = (h) => `<div style="display:flex;justify-content:center">${h}</div>`;

export const deck = {
  key: 'cr-08',
  code: 'CR · CHƯƠNG 8',
  title: 'Ánh sáng',
  sub: 'Content Creator · Chương 8',
};

/* ───────────────────── 4 khuôn mặt sơ đồ: Rembrandt/loop/butterfly/split ───────────────────── */
let _fx = 0;
const SKIN = '#f0c29e';
const faceCard = ({ shadowSvg, lx, ly, name, desc }) => {
  const id = 'fc' + (++_fx);
  const hairC = '#2a2118', shirtC = '#3b5a8a', mouthC = '#a24d3e';
  return `<div style="width:216px;background:#141a24;border:1.5px solid #2a3446;border-radius:14px;padding:12px 10px 14px;text-align:center">
<svg viewBox="0 0 220 260" width="196" height="232" style="display:block;margin:0 auto">
  <path d="M34 258 Q34 196 78 182 L142 182 Q186 196 186 258 Z" fill="${shirtC}"/>
  <rect x="94" y="150" width="32" height="38" fill="${SKIN}"/>
  <ellipse cx="110" cy="104" rx="54" ry="66" fill="${SKIN}"/>
  <path d="M56 96 Q52 34 110 32 Q168 34 164 96 Q150 52 110 58 Q70 52 56 96 Z" fill="${hairC}"/>
  <ellipse cx="90" cy="100" rx="7" ry="8" fill="#fff"/><ellipse cx="130" cy="100" rx="7" ry="8" fill="#fff"/>
  <ellipse cx="90" cy="101" rx="3.4" ry="4" fill="#231c1a"/><ellipse cx="130" cy="101" rx="3.4" ry="4" fill="#231c1a"/>
  <path d="M110 104 L104 128 Q110 133 116 128 Z" fill="none" stroke="#00000055" stroke-width="1.5"/>
  <path d="M94 146 Q110 154 126 146" fill="none" stroke="${mouthC}" stroke-width="3" stroke-linecap="round"/>
  <clipPath id="${id}"><ellipse cx="110" cy="104" rx="54" ry="66"/></clipPath>
  <g clip-path="url(#${id})">${shadowSvg}</g>
  <line x1="${lx}" y1="${ly}" x2="110" y2="104" stroke="#ffc233" stroke-width="1.5" stroke-dasharray="4 4" opacity=".65"/>
  <circle cx="${lx}" cy="${ly}" r="9" fill="#ffc233"/><circle cx="${lx}" cy="${ly}" r="15" fill="none" stroke="#ffc233" stroke-width="2" opacity=".5"/>
</svg>
<b style="display:block;color:#fff;font-size:19px;margin-top:2px">${name}</b>
<span style="display:block;color:#a3aec0;font-size:14px;margin-top:3px;line-height:1.35">${desc}</span>
</div>`;
};

const faces4 = `<div style="display:flex;gap:12px;justify-content:center">` +
  faceCard({
    shadowSvg: `<rect x="110" y="20" width="90" height="170" fill="#000" opacity=".6"/>`,
    lx: 28, ly: 104, name: 'Split', desc: 'Đèn ở 90° ngang mặt — chia đúng NỬA mặt sáng, nửa tối.',
  }) +
  faceCard({
    shadowSvg: `<path d="M118 110 Q138 116 133 140 Q121 150 113 137 Q111 122 118 110 Z" fill="#000" opacity=".55"/>`,
    lx: 68, ly: 36, name: 'Loop', desc: 'Bóng mũi nhỏ "vòng" xuống má, KHÔNG chạm bóng gò má.',
  }) +
  faceCard({
    shadowSvg: `<rect x="110" y="20" width="90" height="170" fill="#000" opacity=".55"/><path d="M116 108 L139 100 L127 127 Z" fill="${SKIN}"/>`,
    lx: 20, ly: 72, name: 'Rembrandt', desc: 'Nửa mặt tối + một TAM GIÁC SÁNG nhỏ dưới mắt bên tối.',
  }) +
  faceCard({
    shadowSvg: `<path d="M96 128 Q110 141 124 128 Q117 148 110 150 Q103 148 96 128 Z" fill="#000" opacity=".55"/>`,
    lx: 110, ly: 12, name: 'Butterfly', desc: 'Đèn chính diện, cao — bóng "cánh bướm" đối xứng dưới mũi.',
  }) +
  `</div>`;

export const slides = S([
  /* 1 — bìa */
  cover({
    t: 'Chương 8 — Ánh sáng',
    sub: 'Bản chất ánh sáng · Ánh sáng tự nhiên · Ba điểm & kiểu sáng mặt · Góc quay tại nhà',
    chap: 'CHƯƠNG 8',
  }),

  /* 2 — bản đồ chương */
  {
    t: 'Bản đồ chương',
    body: mindmap('CHƯƠNG 8', 'ánh sáng — nối sang Chương 9: âm thanh', [
      { t: '🔲 Bản chất ánh sáng', d: 'Cứng/mềm, hướng, luật nghịch đảo, Kelvin, CRI/TLCI', c: 'red' },
      { t: '🌤️ Ánh sáng tự nhiên', d: 'Cửa sổ 45°, giờ vàng, nắng trưa VN, tấm hắt/tản', c: 'ora' },
      { t: '💡 Ba điểm & kiểu sáng mặt', d: 'Key/fill/back, tỉ lệ, Rembrandt/loop/butterfly/split', c: 'amb' },
      { t: '🏠 Góc quay tại nhà', d: 'Setup ngân sách thấp, đèn RGB, màn hình hắt xanh', c: 'grn' },
      { t: '🛍️ Mua đồ theo ngân sách', d: '3 mức tiền — loại thiết bị, không phải tên sản phẩm', c: 'blu' },
      { t: '🎯 Áp dụng thật', d: 'Phòng trọ, nắng gắt VN, bài giảng lập trình', c: 'vio' },
    ]),
  },

  /* 3 — cứng/mềm + hướng */
  {
    t: 'Ánh sáng cứng/mềm & ba hướng chiếu',
    body: cards([
      { ic: '🔲', t: 'Ánh sáng CỨNG', d: 'Nguồn nhỏ hoặc xa chủ thể (nắng trưa, đèn trần trơ). Bóng đổ viền sắc, rõ.', c: 'red' },
      { ic: '🟢', t: 'Ánh sáng MỀM', d: 'Nguồn lớn hoặc gần chủ thể (softbox sát mặt, trời âm u). Bóng đổ mờ dần, dịu.', c: 'grn' },
      { ic: '➡️', t: 'Chiếu trước / bên', d: 'Trước mặt: phẳng, ít chiều sâu. Chiếu bên (45–90°): lộ khối, lộ kết cấu da/vật liệu.', c: 'amb' },
      { ic: '⬅️', t: 'Chiếu sau (ngược sáng)', d: 'Tách chủ thể khỏi nền — hoặc biến chủ thể thành bóng đen nếu không có key bù sáng.', c: 'blu' },
    ], 4),
  },

  /* 4 — luật bình phương nghịch đảo */
  {
    t: 'Luật bình phương nghịch đảo — gấp đôi khoảng cách, mất 2 stop',
    body: bars([
      { l: '1 m (mốc)', v: 100, txt: '100%', c: 'grn' },
      { l: '2 m (−2 stop)', v: 25, txt: '25%', c: 'amb' },
      { l: '4 m (−4 stop)', v: 6.25, txt: '6,25%', c: 'ora' },
      { l: '8 m (−6 stop)', v: 1.5625, txt: '1,56%', c: 'red' },
    ], { lw: 220 }) + box('info', 'Chính xác cho NGUỒN ĐIỂM nhỏ (đèn LED trần, đèn pin). Với softbox lớn đặt gần chủ thể, ánh sáng tắt CHẬM hơn công thức này — luật áp dụng gần đúng khi khoảng cách lớn hơn nhiều lần kích thước tấm softbox.'),
  },

  /* 5 — kelvin + CRI/TLCI */
  {
    t: 'Kelvin, CRI & TLCI — ba con số khi mua đèn',
    body: kelvin([
      { k: 2700, t: 'Bóng đèn sợi đốt ấm', below: false },
      { k: 3200, t: 'Đèn tungsten quay phim', below: true },
      { k: 4000, t: 'LED trung tính', below: false },
      { k: 5600, t: 'Daylight — chuẩn nắng', below: true },
      { k: 6500, t: 'Trời nhiều mây', below: false },
      { k: 9000, t: 'Bóng râm, trời trong', below: true },
    ]) + table(
      ['Thang đo', 'Ai định nghĩa', 'Thang điểm', 'Mức "đủ tốt"'],
      [
        ['CRI (Ra)', 'CIE', '0–100', '!≥95 — tiêu chí phổ biến, không phải chuẩn bắt buộc'],
        ['TLCI', 'EBU (Tech 3355)', '0–100', '!≥85 — máy quay gần như khỏi chỉnh màu lại'],
      ],
      { sm: true },
    ),
  },

  /* 6 — cửa sổ 45° */
  {
    t: 'Cửa sổ 45° — nguồn sáng tự nhiên tốt nhất trong nhà',
    body: giua(lightPlot({
      lights: [{ x: 470, y: 230, ty: 300, k: 'window', c: 'blu', t: 'CỬA SỔ', d: 'lệch ~45°, chiếu vào mặt' }],
    })) + box('good', 'Không đứng thẳng trước cửa sổ (phẳng, mất chiều sâu) và không hoàn toàn từ một bên (mất sáng nửa mặt còn lại) — 45° là điểm cân bằng: mặt vẫn có khối, vẫn đủ sáng đều.'),
  },

  /* 7 — ngược sáng sai vs cửa sổ đúng */
  {
    t: 'Ngược sáng SAI vs quay mặt về cửa sổ ĐÚNG',
    body: `<div style="display:flex;gap:20px;justify-content:center;align-items:flex-start">
<div style="text-align:center">
  <div style="border:2px solid ${C.red};border-radius:14px;padding:8px;background:rgba(255,77,94,.06)">
    ${lightPlot({ w: 470, lights: [{ x: 300, y: 110, k: 'window', c: 'red', t: 'CỬA SỔ', d: 'ngay sau lưng bạn' }] })}
  </div>
  <p style="color:${C.red};font-weight:800;font-size:18px;margin-top:8px">❌ Ngược sáng — mặt tối thui</p>
</div>
<div style="text-align:center">
  <div style="border:2px solid ${C.grn};border-radius:14px;padding:8px;background:rgba(52,211,153,.06)">
    ${lightPlot({ w: 470, lights: [{ x: 470, y: 230, ty: 300, k: 'window', c: 'grn', t: 'CỬA SỔ', d: 'lệch 45°, chiếu vào mặt' }] })}
  </div>
  <p style="color:${C.grn};font-weight:800;font-size:18px;margin-top:8px">✅ Xoay lại, quay mặt lệch 45°</p>
</div>
</div>`,
  },

  /* 8 — nắng trưa VN */
  {
    t: 'Nắng trưa Việt Nam — vấn đề & cách sửa',
    body: cards([
      { ic: '☀️', t: 'Nắng đứng bóng (11h–14h)', d: 'Bóng đổ ngắn, gắt dưới mắt/mũi/cằm; chủ thể nheo mắt, tương phản cao.', c: 'red' },
      { ic: '🌳', t: 'Tìm bóng râm', d: 'Mái hiên, dưới tán cây, cạnh cửa sổ/cửa lớn trong nhà — ánh sáng dịu lại ngay.', c: 'grn' },
      { ic: '🪭', t: 'Tấm tản sáng (diffuser)', d: 'Vải mờ căng giữa nắng và chủ thể — biến nắng gắt thành ánh sáng mềm như trời âm u.', c: 'tea' },
      { ic: '📄', t: 'Tấm hắt sáng (bounce)', d: 'Foam trắng/giấy bìa hắt ngược sáng vào vùng tối dưới mắt, giảm bớt tương phản.', c: 'amb' },
    ], 4) + box('tip', 'Trời âm u (nhiều mây) = một tấm tản sáng khổng lồ MIỄN PHÍ: mây tán xạ nắng gắt thành ánh sáng mềm phủ khắp bầu trời. Nhiều người mới lại nghĩ trời âm u là "hôm nay xui, không quay được" — ngược lại, đó là điều kiện dễ quay chân dung nhất.'),
  },

  /* 9 — ba điểm key/fill/back */
  {
    t: 'Ba điểm: Key · Fill · Back',
    body: giua(lightPlot({
      lights: [
        { x: 480, y: 230, k: 'led', c: 'amb', t: 'KEY', d: 'nguồn chính' },
        { x: 150, y: 240, k: 'soft', c: 'tea', t: 'FILL', d: 'dịu bóng, yếu hơn key' },
        { x: 400, y: 60, k: 'led', c: 'vio', t: 'BACK', d: 'tách khỏi nền' },
      ],
    })) + box('info', 'Chỉ có 1 đèn? Bỏ FILL, dùng tấm hắt (slide sau). Chỉ có 2 đèn? Ưu tiên KEY trước rồi BACK — FILL có thể thay bằng tường/trần sáng hắt lại tự nhiên.'),
  },

  /* 10 — tỉ lệ key:fill */
  {
    t: 'Tỉ lệ key:fill theo stop',
    body: table(
      ['Tỉ lệ key:fill', 'Chênh lệch', 'Cảm giác', 'Hay dùng cho'],
      [
        ['1:1', '0 stop', 'Phẳng, ít kịch tính', 'Tin tức, hướng dẫn cần nhìn rõ mọi chi tiết'],
        ['!2:1', '1 stop', 'Có khối nhẹ, vẫn tự nhiên', 'Vlog, video hướng dẫn, talking head'],
        ['4:1', '2 stop', 'Chiều sâu rõ, bắt đầu kịch tính', 'Kể chuyện, phỏng vấn nghiêm túc'],
        ['8:1', '3 stop', 'Kịch tính mạnh, bóng gần như đen', 'Phim ảnh, tâm trạng u tối'],
      ],
      { center: [1] },
    ) + box('warn', 'Đây là quy ước ĐƠN GIẢN — so trực tiếp độ sáng bạn vặn trên hai đèn (hợp với đèn LED có núm chỉnh %, đúng đồ Cường đang có). Dân quay phim chuyên nghiệp dùng máy đo sáng và công thức khác phức tạp hơn — ngoài phạm vi bài này.'),
  },

  /* 11 — một đèn + tấm hắt */
  {
    t: 'Chỉ có MỘT đèn? Thêm tấm hắt',
    body: giua(lightPlot({
      lights: [
        { x: 470, y: 230, k: 'led', c: 'amb', t: 'ĐÈN KEY', d: 'duy nhất' },
        { x: 150, y: 210, k: 'bounce', c: 'tea', t: 'TẤM HẮT', d: 'foam trắng/giấy bìa' },
      ],
    })) + box('tip', 'Tấm hắt không PHÁT sáng — nó hắt lại ánh sáng đèn key đang "thừa" sang phía tối, làm dịu bóng mà không cần mua thêm đèn. Một tấm bìa mút trắng (foam board) hoặc tờ giấy bìa lớn là đủ.'),
  },

  /* 12 — bốn kiểu sáng mặt */
  {
    t: 'Bốn kiểu sáng mặt — chỉ đổi vị trí MỘT đèn key',
    body: faces4,
  },

  /* 13 — setup bàn làm việc */
  {
    t: 'Setup bàn làm việc tại nhà',
    body: giua(lightPlot({
      lights: [
        { x: 470, y: 230, k: 'soft', c: 'amb', t: 'KEY (SOFTBOX)', d: '45°, ngang mặt' },
        { x: 180, y: 60, k: 'practical', c: 'vio', t: 'ĐÈN RGB', d: 'trang trí, tách nền' },
      ],
    })) + box('warn', 'Màn hình máy tính KHÔNG phải đèn key — độ sáng và màu của nó đổi liên tục theo nội dung hiển thị (nền IDE sáng ⇄ tối) và luôn ngả xanh. Để màn hình làm ánh sáng phụ/viền, không phải nguồn sáng chính. Tắt đèn trần khi quay: ánh sáng trần hắt bóng thẳng xuống từ trên đầu, đá nhau với key.'),
  },

  /* 14 — setup sai vs đúng */
  {
    t: 'Setup tại nhà — sai vs đúng',
    body: vs({
      no: { t: 'Sai', items: [
        'Chỉ có đèn trần phía trên — bóng đổ thẳng xuống hốc mắt',
        'Ngồi sát tường trắng phía sau — chói loá, mất chiều sâu',
        'Trộn đèn bàn 2700K với ánh màn hình ~6500K mà không khoá WB',
        'Đèn RGB trang trí bật full sáng, lấn át key',
      ] },
      yes: { t: 'Đúng', items: [
        'Tắt đèn trần, dùng một đèn key riêng ở khoảng 45°',
        'Ngồi cách tường ít nhất nửa mét, hoặc làm mờ hậu cảnh',
        'Một nguồn Kelvin chính cho mặt, khoá WB theo đúng nguồn đó (Chương 5)',
        'Đèn RGB/practical chỉ để mức thấp — phụ trợ, không cạnh tranh với key',
      ] },
    }),
  },

  /* 15 — bảng tra nhanh */
  {
    t: 'Bảng tra nhanh cả chương',
    body: table(
      ['Bạn muốn', 'Chỉnh gì', 'Giá trị / gợi ý'],
      [
        ['Bóng đổ dịu, không gắt', 'Nguồn sáng lớn hơn hoặc gần chủ thể hơn', 'Softbox sát mặt, hoặc ngồi gần cửa sổ'],
        ['Không bất ngờ tối/sáng khi dời đèn', 'Nhớ luật bình phương nghịch đảo', 'Gấp đôi khoảng cách = còn 1/4 sáng (−2 stop)'],
        ['Mua đèn quay video, không phải đèn phòng khách', 'Xem CRI/TLCI khi mua', 'CRI ≥95 hoặc TLCI ≥85'],
        ['Quay trong nhà không dính sọc nhấp nháy', 'Màn trập khớp nhịp 100Hz', '1/50 (25fps) hoặc 1/100 (50fps) — Chương 5'],
        ['Chân dung có chiều sâu, không phẳng', 'Ba điểm: key/fill/back', 'Tỉ lệ key:fill 2:1 đến 4:1 tuỳ mức kịch tính'],
        ['Chỉ có 1 đèn vẫn ra hình đẹp', 'Thêm tấm hắt phía đối diện', 'Foam trắng/giấy bìa — không cần mua thêm đèn'],
      ],
    ),
  },

  /* 16 — thực hành */
  {
    t: '🎬 Thực hành',
    body: steps([
      ['Ngồi quay lưng về cửa sổ, quay 10 giây — rồi xoay lại quay mặt lệch 45° về cửa sổ, quay tiếp 10 giây', 'So sánh hai đoạn trên màn hình lớn, gọi tên được vì sao đoạn đầu tối/silhouette.'],
      ['Di chuyển một đèn bàn hoặc đèn pin điện thoại ra xa chủ thể đúng theo bội số 1×/2×/4× khoảng cách ban đầu', 'Quan sát độ sáng giảm có gần khớp 100%/25%/6,25% không.'],
      ['Dựng một setup 1 đèn + 1 tấm hắt (bìa cứng trắng cũng được) cho một cảnh talking head', 'So với khi không có tấm hắt — nhìn rõ bóng dưới mắt dịu đi hẳn.'],
      ['Tự đứng trước gương hoặc quay chính mình, di chuyển một đèn/đèn pin quanh mặt để lần lượt tạo Rembrandt, loop, butterfly, split', 'Chụp lại cả 4 tấm, so với slide "Bốn kiểu sáng mặt" — gọi tên đúng cả 4 kiểu không cần xem lại bài.'],
    ]) + box('good', '<b>Đạt khi:</b> nhìn một video bất kỳ (kể cả không phải của bạn), chỉ ra được hướng đặt đèn key gần đúng chỉ bằng cách nhìn bóng đổ trên mặt người trong khung hình.'),
  },
]);
