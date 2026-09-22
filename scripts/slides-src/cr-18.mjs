/**
 * cr-18.mjs — Content Creator, Chương 18: Mask, tracking & VFX thực tế.
 * Mask & rotoscope · Tracking & ổn định hình · Phông xanh & tách nền · VFX
 * thực tế cho creator (nhân bản chính mình, thay màn hình, luật chơi).
 *
 *   node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/cr-18.mjs
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/cr-18.mjs --out <dir>
 *
 * Nguồn số liệu chính (đầy đủ trong báo cáo bàn giao):
 *  - Magic Mask / Object Removal / Speed Warp / Super Scale / Camera Tracker =
 *    Studio-only: blackmagicdesign.com/products/davinciresolve/studio (danh
 *    sách "DaVinci Neural Engine" của trang sản phẩm).
 *  - 3D Keyer / Delta Keyer / Power Windows / Tracker (2D, trang Color) = có ở
 *    bản miễn phí: blackmagicdesign.com/products/davinciresolve/color +
 *    blackmagicdesign.com/products/davinciresolve (bảng so sánh Free/Studio).
 *  - Point Tracker & Planar Tracker (trang Fusion) = miễn phí; Camera Tracker
 *    (dựng lại chuyển động 3D) = Fusion Studio: blackmagicdesign.com/products/fusion.
 *  - CapCut Mask (Video tab): hình Linear/Mirror/Circle/Star + feather + invert
 *    + Add/Subtract/Intersect — capcut.com (trang hướng dẫn Mask chính thức).
 *  - CapCut Remove BG: 3 nhánh Chroma Key / Auto removal / Custom removal —
 *    capcut.com/resource/how-to-remove-green-screen-in-capcut,
 *    capcut.com/resource/how-to-remove-background-in-capcut.
 *  - CapCut Stabilize: 3 mức Recommended/Minimum cut/Most stable, miễn phí mọi
 *    nền tảng — capcut.com/resource/capcut-stabilizer.
 *  - Chính sách công khai nội dung bị thay đổi/tổng hợp của YouTube: chỉ áp
 *    dụng cho nội dung do AI tạo/thay đổi có tính chân thực cao; "dùng phông
 *    xanh cho ai đó trông như lơ lửng ngoài vũ trụ" là ví dụ CHÍNH THỨC của
 *    điều KHÔNG cần công bố — support.google.com/youtube/answer/14328491.
 *  - Điều 32 Bộ luật Dân sự 2015 (quyền hình ảnh) — đã kiểm & dùng ở Ch10,
 *    nối lại ở 18.2, không kiểm lại.
 */
import { S, cover, cards, box, steps, table, vs, mindmap, lightPlot, storyboard, esc, C } from './_cr-chung.mjs';

export const deck = {
  key: 'cr-18',
  code: 'CR · CHƯƠNG 18',
  title: 'Mask, tracking & VFX thực tế',
  sub: 'Content Creator · Chương 18',
};

// Sơ đồ đứng một mình thì dồn trái, bỏ trống nửa phải → căn giữa.
const giua = (h) => `<div style="display:flex;justify-content:center">${h}</div>`;

/** Text helper cục bộ cho SVG tự vẽ trong file này (T của _cr-chung.mjs không export). */
const txt = (x, y, s, o = {}) => {
  const { size = 15, fill = C.tx, anchor = 'middle', weight = 400, mono = false } = o;
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}" ` +
    `font-family="${mono ? "'SF Mono',Menlo,monospace" : "-apple-system,'Segoe UI',Arial,sans-serif"}">${esc(s)}</text>`;
};
const panelBg = (x) => `<rect x="${x}" y="20" width="360" height="250" rx="14" fill="${C.p1}" stroke="${C.bd}"/>`;

/* ───────────────────── slide 3: mask cứng / mềm / đảo ───────────────────── */
const maskSvg = `<svg class="c-svg" viewBox="0 0 1160 300" width="1160">
<defs>
  <clipPath id="mkHard"><circle cx="185" cy="145" r="86"/></clipPath>
  <filter id="mkBlur" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="13"/></filter>
  <mask id="mkSoftB"><circle cx="580" cy="145" r="86" fill="#fff" filter="url(#mkBlur)"/></mask>
  <mask id="mkSoftC"><rect x="820" y="40" width="320" height="210" fill="#fff"/><circle cx="975" cy="145" r="86" fill="#000" filter="url(#mkBlur)"/></mask>
</defs>
${panelBg(10)}${panelBg(405)}${panelBg(800)}
<rect x="30" y="40" width="320" height="210" fill="${C.blu}"/>
<rect x="30" y="40" width="320" height="210" fill="${C.amb}" clip-path="url(#mkHard)"/>
<rect x="425" y="40" width="320" height="210" fill="${C.blu}"/>
<rect x="425" y="40" width="320" height="210" fill="${C.amb}" mask="url(#mkSoftB)"/>
<rect x="820" y="40" width="320" height="210" fill="${C.blu}"/>
<rect x="820" y="40" width="320" height="210" fill="${C.amb}" mask="url(#mkSoftC)"/>
<rect x="70" y="44" width="240" height="28" rx="7" fill="#0b0e14" opacity=".62"/>
<rect x="460" y="44" width="250" height="28" rx="7" fill="#0b0e14" opacity=".62"/>
<rect x="875" y="44" width="210" height="28" rx="7" fill="#0b0e14" opacity=".62"/>
${txt(190, 63, '① MASK CỨNG', { size: 17, weight: 800, fill: '#fff' })}
${txt(585, 63, '② FEATHER (MỀM)', { size: 17, weight: 800, fill: '#fff' })}
${txt(980, 63, '③ ĐẢO MASK', { size: 17, weight: 800, fill: '#fff' })}
${txt(190, 268, 'biên sắc — dễ lộ vòng tròn giả', { size: 14.5, fill: C.mu })}
${txt(585, 268, 'biên tan dần — hoà vào cảnh', { size: 14.5, fill: C.mu })}
${txt(980, 268, 'trong ⇄ ngoài đổi chỗ nhau', { size: 14.5, fill: C.mu })}
</svg>`;

/* ───────────────────── slide 6: point / planar / camera tracker ───────────────────── */
const trackerSvg = `<svg class="c-svg" viewBox="0 0 1160 300" width="1160">
${panelBg(10)}${panelBg(405)}${panelBg(800)}
${txt(190, 55, 'POINT TRACKER', { size: 17, weight: 800, fill: C.amb })}
${txt(585, 55, 'PLANAR TRACKER', { size: 17, weight: 800, fill: C.tea })}
${txt(980, 55, 'CAMERA TRACKER', { size: 17, weight: 800, fill: C.vio })}
<path d="M60 220 Q110 140 175 165 T300 120" fill="none" stroke="${C.dim}" stroke-width="2" stroke-dasharray="5 5"/>
<circle cx="300" cy="120" r="14" fill="${C.amb}" opacity=".85"/>
<path d="M300 96 v16 M300 128 v16 M276 120 h16 M308 120 h16" stroke="${C.amb}" stroke-width="2.5"/>
<circle cx="300" cy="120" r="30" fill="none" stroke="${C.amb}" stroke-width="1.5" opacity=".6"/>
${txt(190, 245, 'bám 1 điểm tương phản cao', { size: 14.5, fill: C.mu })}
${txt(190, 265, '(nốt ruồi, góc bảng hiệu…)', { size: 14.5, fill: C.mu })}
<polygon points="470,205 705,185 692,95 458,110" fill="${C.tea}" fill-opacity=".12" stroke="${C.tea}" stroke-width="2.5"/>
<circle cx="470" cy="205" r="6.5" fill="${C.tea}"/><circle cx="705" cy="185" r="6.5" fill="${C.tea}"/>
<circle cx="692" cy="95" r="6.5" fill="${C.tea}"/><circle cx="458" cy="110" r="6.5" fill="${C.tea}"/>
${txt(585, 245, 'bám 4 góc MỘT mặt phẳng', { size: 14.5, fill: C.mu })}
${txt(585, 265, '(màn hình, bìa sách, biển…)', { size: 14.5, fill: C.mu })}
<path d="M980 235 L845 235 M980 235 L1115 235 M980 235 L905 90 M980 235 L1055 90 M845 235 L905 90 M1115 235 L1055 90 M905 90 L1055 90" stroke="${C.vio}" stroke-width="1.4" opacity=".55" fill="none"/>
<circle cx="980" cy="235" r="5" fill="${C.vio}"/>
<path d="M905 200 l0 -14 l26 0 l8 -8 l0 22 Z" fill="${C.tx}" opacity=".9"/>
${txt(585 + 395, 245, 'dựng lại đường đi máy quay 3D', { size: 14.5, fill: C.mu })}
${txt(585 + 395, 265, '⛔ chỉ Resolve Studio', { size: 14.5, fill: C.red, weight: 700 })}
</svg>`;

export const slides = S([
  /* 1 — bìa */
  cover({
    t: 'Chương 18 — Mask, tracking & VFX thực tế',
    sub: 'Mask & rotoscope · Tracking & ổn định hình · Phông xanh & tách nền · VFX thực tế cho creator',
    chap: 'CHƯƠNG 18',
  }),

  /* 2 — bản đồ chương */
  {
    t: 'Bản đồ chương',
    body: mindmap('CHƯƠNG 18', 'nối Ch17 (chuyển cảnh) và Ch19 (Fusion/3D)', [
      { t: '✂️ Mask & rotoscope', d: 'Vẽ, feather, đảo, animate theo keyframe', c: 'red' },
      { t: '🎯 Tracking & ổn định hình', d: 'Point/planar/camera, làm mờ mặt, Stabilizer', c: 'ora' },
      { t: '🟩 Phông xanh & tách nền', d: 'Quay đúng, key, dọn viền, AI không cần phông', c: 'grn' },
      { t: '🎬 VFX thực tế cho creator', d: 'Nhân bản, thay màn hình, xoá vật, luật chơi', c: 'blu' },
      { t: '⬅️ Ch17 vừa học', d: 'Chuyển cảnh, keyframe, tốc độ', c: 'vio' },
      { t: '➡️ Ch19 sắp tới', d: 'Node Fusion, motion graphics, 3D', c: 'pnk' },
    ]),
  },

  /* 3 — mask cứng/mềm/đảo */
  {
    t: 'Mask: cứng, mềm (feather), và đảo',
    body: maskSvg + box('tip', '<strong>Feather</strong> làm biên mask tan dần thay vì cắt một khối phẳng — gần như luôn nên bật một chút, trừ khi bạn CỐ Ý muốn viền hình học rõ ràng (kiểu poster/infographic).'),
  },

  /* 4 — animate mask theo keyframe (roto thủ công) */
  {
    t: 'Roto thủ công: animate mask theo keyframe',
    body: steps([
      ['Vẽ mask khớp hình chủ thể ở khung hình ĐẦU TIÊN của đoạn cần che/lộ', 'hình tròn/chữ nhật/polygon tuỳ hình chủ thể'],
      ['Tua tới chỗ chủ thể đổi vị trí/hình dạng rõ rệt, chỉnh lại mask, phần mềm tự ghi một keyframe', 'không cần tự bấm nút "thêm keyframe" ở hầu hết trình dựng — chỉnh là tự ghi'],
      ['Phần mềm tự nội suy hình dạng mask giữa hai keyframe liền nhau', 'chủ thể đổi hình càng nhiều, càng cần nhiều keyframe gần nhau'],
      ['Tua chậm qua toàn đoạn ở tốc độ thực, sửa khung nào mask bị "trượt" ra ngoài rìa', 'đây là bước hay bị bỏ qua nhất — đừng chỉ xem tĩnh từng khung'],
    ]) + box('info', 'Đây chính xác là việc <strong>Magic Mask</strong> của DaVinci Resolve Studio làm THAY bạn bằng AI (tự bám theo người/vật qua nhiều khung hình) — bản miễn phí không có, nên phải tự tay làm 4 bước trên bằng Power Window + keyframe.'),
  },

  /* 5 — bảng công cụ mask & tách nền */
  {
    t: 'Công cụ mask & tách chủ thể — CapCut vs Resolve',
    body: table(
      ['Việc cần làm', 'CapCut (máy tính)', 'DaVinci Resolve'],
      [
        ['Vẽ mask hình học + feather + đảo', 'Mask (tab Video) — Linear/Mirror/Circle/Star', 'Power Window (trang Color)'],
        ['Xếp chồng nhiều mask trên 1 clip', 'Thêm nhiều mask cùng lúc (đã xác nhận)', 'Cộng nhiều node Power Window trên cây node'],
        ['Tự tách người khỏi nền bằng AI', '+Remove BG → Auto removal (miễn phí)', '-Magic Mask — CHỈ Resolve Studio'],
        ['Cắt tay khi AI đoán sai chi tiết', 'Remove BG → Custom removal', 'Vẽ tay Power Window + Paint (Fusion)'],
      ],
      { sm: true },
    ) + box('warn', 'Tên & bản đã kiểm tới 09/2026 trên capcut.com và blackmagicdesign.com/products/davinciresolve/studio — app có thể đổi tên nút giữa các bản cập nhật, kiểm lại trong app nếu không khớp.'),
  },

  /* 6 — 3 loại tracker */
  {
    t: '3 loại tracker — chọn theo HÌNH DẠNG, không theo tên',
    body: trackerSvg,
  },

  /* 7 — làm mờ mặt người lạ & biển số */
  {
    t: 'Làm mờ mặt người lạ / biển số — quy trình 4 bước',
    body: steps([
      ['Vẽ mask (hình tròn quanh mặt, hình chữ nhật quanh biển số) ở khung đầu tiên cần che'],
      ['Gắn Tracker: point tracker cho một khuôn mặt xoay/di chuyển tự do, planar tracker nếu biển số gần như phẳng và chỉ nghiêng theo góc xe'],
      ['Áp Blur (Gaussian) hoặc Mosaic/Pixelate GIỚI HẠN bên trong mask đã tracked, không phải cả khung hình'],
      ['Phát lại ở tốc độ thực (không tua chậm) — chỗ mask "trượt" khỏi mặt khi quay đầu nhanh chỉ lộ ra ở tốc độ thật'],
    ]) + box('bad', '<strong>Điều 32 Bộ luật Dân sự 2015</strong> (đã học ở Chương 10): người lạ nhận diện được và là TRUNG TÂM cảnh quay — không thuộc ngoại lệ hoạt động công cộng — thì phải xin phép hoặc che mặt trước khi đăng.'),
  },

  /* 8 — ổn định hình: chế độ */
  {
    t: 'Ổn định hình (Stabilizer) — chế độ & mức',
    body: table(
      ['Chế độ / mức', 'Ở đâu', 'Làm gì'],
      [
        ['Translation', 'Resolve', 'Chỉ phân tích pan/tilt — rung nhẹ, đơn giản nhất'],
        ['Similarity', 'Resolve', 'Pan/tilt/zoom/xoay — mức mặc định hợp lý nhất'],
        ['Perspective', 'Resolve', 'Phân tích cả phối cảnh — máy di chuyển nhiều (giống Warp Stabilizer)'],
        ['Camera Lock', 'Resolve', 'Cố định cứng như tripod ảo — hiếm khi tự nhiên, dùng dè dặt'],
        ['!Recommended', 'CapCut', 'Mức đề xuất tự động theo độ rung đo được'],
        ['Minimum cut', 'CapCut', 'Ưu tiên giữ khung hình, crop ít nhất'],
        ['Most stable', 'CapCut', 'Ổn định nhất — cũng crop nhiều nhất'],
      ],
      { sm: true },
    ) + box('warn', 'Ổn định hình LUÔN phải crop bớt khung hình để có chỗ dịch bù rung — càng rung nhiều, càng crop nhiều. Gimbal thật (Pocket 3) lúc quay vẫn ăn đứt việc chữa cháy ở hậu kỳ.'),
  },

  /* 9 — khi nào không cứu được */
  {
    t: 'Khi nào Stabilizer KHÔNG cứu được',
    body: vs({
      no: { t: 'Ổn định hình BÓ TAY', items: [
        'Nhoè chuyển động do màn trập quá chậm — nhoè đã "in" vào từng khung, không tua ngược lại thành nét được',
        'Méo hình rolling shutter (cột thẳng thành "xiên") khi lia máy nhanh — Stabilizer giảm rung tổng thể, không sửa méo trong một khung',
        'Rung cực mạnh vượt biên độ crop cho phép — muốn ổn định hết phải crop tới mức mất bố cục',
      ] },
      yes: { t: 'Ổn định hình CỨU được', items: [
        'Rung tay cầm nhẹ tới vừa, máy đứng yên tương đối (talking head, vlog đi bộ chậm)',
        'Lia máy đều tay nhưng không mượt tuyệt đối',
        'Pan/tilt lệch nhịp nhẹ giữa các khung — đúng việc Translation/Similarity xử lý tốt',
      ] },
    }),
  },

  /* 10 — phông xanh nhìn từ trên */
  {
    t: 'Phông xanh nhìn từ trên: khoảng cách người–phông',
    body: giua(lightPlot({
      lights: [{ x: 470, y: 230, k: 'soft', c: 'amb', t: 'KEY LIGHT', d: '~45°, chiếu người — không chiếu phông' }],
    })) + box('good', '"TƯỜNG/NỀN" trong sơ đồ = phông xanh. Người đứng cách phông <strong>1–2 m</strong> để tránh ánh xanh hắt ngược lên da/tóc (spill) và tránh đổ bóng lên phông. Phông cần thêm ĐÈN RIÊNG chiếu chính nó, tách biệt khỏi key light chiếu người.'),
  },

  /* 11 — phông xanh sai/đúng */
  {
    t: 'Quay phông xanh — sai vs đúng',
    body: vs({
      no: { t: 'Sai', items: [
        'Phông có nếp nhăn — bóng đổ làm key loang lổ từng mảng',
        'Chỉ có đèn chiếu người, phông tối hơn/sáng hơn không đều',
        'Đứng sát phông (dưới 1 m) — ánh xanh hắt ngược lên da, tóc',
        'Mặc áo màu trùng/gần giống phông — áo bị key mất theo nền',
        'Màn trập quá chậm — tay/tóc nhoè, viền key vỡ vụn',
      ] },
      yes: { t: 'Đúng', items: [
        'Căng phẳng phông, là/ủi hết nếp trước khi bật đèn',
        'Đèn RIÊNG cho phông, sáng đều hai bên, tách biệt đèn chiếu người',
        'Người cách phông 1–2 m',
        'Chọn màu quần áo khác hẳn phông VÀ khác tông da',
        'Giữ màn trập theo quy tắc 180° (Chương 5) — đủ nhanh cho chuyển động tay',
      ] },
    }),
  },

  /* 12 — key & dọn viền */
  {
    t: 'Key & dọn viền (spill suppression)',
    body: table(
      ['Công cụ', 'Ở đâu', 'Bản'],
      [
        ['Chroma Key', 'CapCut → Remove BG → Chroma Key', '+Miễn phí'],
        ['3D Keyer', 'Resolve → trang Color', '+Miễn phí'],
        ['Delta Keyer', 'Resolve → trang Color', '+Miễn phí — key sạch hơn 3D Keyer'],
        ['Ultra Keyer', 'Resolve → trang Fusion', '!Đi sâu ở Chương 19'],
      ],
      { sm: true },
    ) + box('tip', '<strong>Dọn viền:</strong> sau khi key, tóc/da vẫn có thể ám xanh nhẹ do ánh phông phản chiếu ngược — CapCut xử lý bằng thanh <strong>Shadow</strong>, Resolve có công cụ Spill Suppression đi kèm mỗi keyer. Đừng cố sửa bằng cách tăng thêm Strength — dễ ăn mất luôn chi tiết tóc.'),
  },

  /* 13 — VFX khác cho creator */
  {
    t: 'VFX thực tế khác creator hay cần',
    body: cards([
      { ic: '🌤️', t: 'Thay trời', d: 'Chọn vùng trời bằng mask/qualifier theo màu, track theo máy quay nếu có, khớp sáng/màu với cảnh.', c: 'blu' },
      { ic: '🧹', t: 'Xoá vật/người lạ', d: 'Resolve Object Removal (CHỈ Studio) — track quanh vật, phần mềm tự "vá" bằng dữ liệu khung khác.', c: 'red' },
      { ic: '✨', t: 'Hạt bụi, ánh sáng', d: 'Overlay clip hiệu ứng có sẵn, chế độ hoà trộn Screen/Add — thường không cần track nếu máy ít di chuyển.', c: 'amb' },
      { ic: '📺', t: 'Glitch / hologram', d: 'Preset dịch màu RGB, nhiễu ngang — kết hợp mask để chỉ áp lên một vùng (vd một "màn hình ảo").', c: 'vio' },
    ], 4),
  },

  /* 14 — nhân bản chính mình */
  {
    t: 'Ví dụ từng bước: nhân bản chính mình',
    body: storyboard([
      { s: 'B1', t: 'Khoá máy trên chân máy', d: 'Không xê dịch máy suốt cả 2 lượt quay', kind: 'place' },
      { s: 'B2', t: 'Quay TAKE 1 — đứng bên trái', d: 'Diễn trọn phần thoại/hành động của mình', size: 'MS', at: 0.25 },
      { s: 'B3', t: 'Quay TAKE 2 — đứng bên phải', d: 'Không đi lấn sang nửa khung của Take 1', size: 'MS', at: 0.75 },
      { s: 'B4', t: 'Ghép 2 track + mask dọc', d: 'Chia ở vùng trống, không ai đi qua cả hai bên; feather nhẹ đường chia', size: 'MWS', at: 0.5 },
    ], { cols: 4, w: 262 }) + box('warn', 'Máy dù rung một chút cũng làm 2 lớp "trôi" khỏi nhau khi ghép — đây là lý do máy CỐ ĐỊNH quan trọng hơn ống kính đẹp trong đúng cảnh quay này.'),
  },

  /* 15 — bảng tra nhanh cả chương */
  {
    t: 'Bảng tra nhanh cả chương',
    body: table(
      ['Muốn làm gì', 'CapCut', 'DaVinci Resolve'],
      [
        ['Che một phần khung hình', 'Mask (4 hình + feather + đảo)', 'Power Window (Color) — +miễn phí'],
        ['Tự tách người khỏi nền', '+Remove BG → Auto removal', '-Magic Mask — chỉ Studio'],
        ['Bám 1 điểm chuyển động', 'Keyframe tay, không có tên riêng', '+Point Tracker (Fusion)'],
        ['Bám 1 mặt phẳng (thay màn hình)', 'Keyframe tay, không có tên riêng', '+Planar Tracker (Fusion)'],
        ['Dựng lại chuyển động máy quay 3D', 'Không có', '-Camera Tracker — chỉ Studio'],
        ['Ổn định hình rung', '+Stabilize — 3 mức', '+Stabilizer — 3 chế độ + Camera Lock'],
        ['Tách nền có phông xanh thật', '+Chroma Key', '+3D/Delta Keyer (Color), Ultra (Fusion)'],
        ['Xoá hẳn một vật khỏi cảnh', 'Không có công cụ riêng', '-Object Removal — chỉ Studio'],
      ],
      { sm: true },
    ),
  },

  /* 16 — thực hành */
  {
    t: '🎬 Thực hành',
    body: steps([
      ['Vẽ một mask hình tròn quanh mặt bạn trong CapCut hoặc Power Window Resolve, bật feather, thử đảo mask', 'So sánh cảm giác biên cứng vs mềm trên chính khuôn mặt mình.'],
      ['Quay 5 giây một vật di chuyển qua trước chữ đã đặt sẵn trên khung — animate mask theo keyframe để chữ "hiện ra" đúng lúc vật đi qua', 'Tua chậm kiểm mask có bám sát rìa vật không.'],
      ['Dựng một góc phông xanh tại phòng trọ (vải/giấy màu đơn sắc cũng được), quay 10 giây, key thử bằng Chroma Key hoặc 3D Keyer', 'Dùng đúng checklist "quay đúng" ở slide 11 trước khi bấm quay.'],
      ['Track một điểm hoặc một mặt phẳng bất kỳ (bìa sách, màn hình điện thoại tắt) và dán đè một nhãn/chữ lên nó suốt cảnh', 'Xem lại: nhãn có bám đúng khi vật nghiêng/xoay nhẹ không.'],
    ]) + box('good', '<strong>Đạt khi:</strong> nhìn một cảnh phông xanh bất kỳ (kể cả không phải của bạn), chỉ ra được ngay 2 lỗi quay hay gặp nhất chỉ bằng cách nhìn viền chủ thể trên nền đã ghép.'),
  },
]);
