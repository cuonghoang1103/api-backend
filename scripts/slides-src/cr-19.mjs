/**
 * cr-19.mjs — Content Creator, Chương 19: Motion graphics, Fusion & 3D.
 * Hệ thống nhận diện chuyển động · Fusion (tư duy node) · Không gian 3D của
 * Fusion · Blender cho creator (render trên Mac M1 Max thật + cú pháp Linux).
 *
 *   node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/cr-19.mjs
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/cr-19.mjs --out <dir>
 *
 * Nguồn số liệu chính (đầy đủ trong báo cáo bàn giao):
 *  - Text+/Background/Merge, Delta Keyer/Ultra Keyer, Tracker(2D)/Planar
 *    Tracker, Text3D/Shape3D/Camera3D/Merge3D/Renderer3D = miễn phí trên
 *    TRANG FUSION của DaVinci Resolve (cả bản free) — kiểm chéo
 *    blackmagicdesign.com/products/davinciresolve/fusion + hai tìm kiếm độc
 *    lập cùng khớp "basic 3D nodes free, camera tracking Studio-only".
 *    ⚠️ blackmagicdesign.com/products/fusion/compare KHÔNG dùng được cho việc
 *    này — trang đó so "Fusion trong Resolve STUDIO" với "Fusion Studio độc
 *    lập" (CẢ HAI đều trả phí), không phải free-vs-Studio; đọc nhầm bảng này
 *    suýt viết sai cả slide 8.
 *  - Camera Tracker (dựng lại chuyển động 3D của máy quay) = CHỈ Fusion
 *    Studio — đã xác nhận lại ở Ch18 (blackmagicdesign.com/products/fusion),
 *    kiểm chéo lần nữa ở chương này, khớp.
 *  - YouTube end screen: 5–20 giây cuối video, tối đa 4 phần tử (16:9), video
 *    phải ≥ 25 giây — support.google.com/youtube/answer/6388789.
 *  - Blender: macOS Apple Silicon dùng Metal (yêu cầu macOS 13 Ventura+);
 *    Linux NVIDIA CUDA/OptiX cần compute capability 5.0+, OptiX cần thêm
 *    driver ≥ 575 — blender.org/download/requirements (đọc qua kết quả tìm
 *    kiếm có trích dẫn nguyên văn; trang gốc chặn bằng Cloudflare "Verify you
 *    are human" — KHÔNG bấm qua, xem mục báo cáo).
 *  - Cú pháp dòng lệnh Blender (-b/--background, -P/--python, -o, -F, -f, -a,
 *    và --cycles-device CPU|CUDA|OPTIX|HIP|ONEAPI|METAL phải đứng SAU dấu
 *    "--" ở cuối dòng) — docs.blender.org/manual/.../command_line/arguments
 *    và .../command_line/render.html, kiểm 2 lần độc lập, khớp nhau.
 *  - Apple Motion: 49,99 USD mua đứt, macOS 15.6+ — apps.apple.com (fetch
 *    trực tiếp, official).
 *  - After Effects: thuê bao, Windows+macOS; adobe.com hiện giá khuyến mãi
 *    9,19 USD/tháng (gồm VAT) lúc kiểm — giá NIÊM YẾT phổ biến theo nhiều
 *    nguồn tổng hợp độc lập là ~23–35 USD/tháng tuỳ cam kết năm; Adobe đổi
 *    giá theo khu vực/khuyến mãi nên KHÔNG in một con số cố định.
 *  - "Export Alpha" trên trang Deliver (ProRes 4444, chỉ hiện ở chế độ
 *    Individual Clips) — kiểm chéo forum.blackmagicdesign.com (diễn đàn
 *    chính chủ Blackmagic) + nhiều hướng dẫn độc lập khớp nhau; KHÔNG tự
 *    chạy được vì máy này không cài DaVinci Resolve.
 *  - Số đo THẬT trên máy này (script + log đầy đủ trong báo cáo bàn giao):
 *    Blender 5.1.2 macOS, Cycles GPU Metal (Apple M1 Max), 128 samples,
 *    1280×720, /usr/bin/time -p → real 4.67s; PNG RGBA 356 728 bytes, alpha
 *    nền=0 / chữ=255 xác nhận bằng Pillow. ffmpeg: ProRes 4444 alpha
 *    (codec_tag ap4h, pix_fmt yuva444p12le) 19 308 638 bytes vs ProRes 422 HQ
 *    không alpha (apch, yuv422p10le) 11 760 452 bytes cùng 2 giây — đo bằng
 *    ffprobe, và kéo ngược 1 khung từ chính file .mov ra vẫn còn alpha thật.
 */
import { S, cover, cards, box, steps, table, vs, mindmap, flow, kpis, bars, nodes, code, esc, C } from './_cr-chung.mjs';

export const deck = {
  key: 'cr-19',
  code: 'CR · CHƯƠNG 19',
  title: 'Motion graphics, Fusion & 3D',
  sub: 'Content Creator · Chương 19',
};

/** Text helper cục bộ cho SVG tự vẽ (giống cr-18.mjs — T của _cr-chung.mjs không export). */
const txt = (x, y, s, o = {}) => {
  const { size = 15, fill = C.tx, anchor = 'middle', weight = 400, mono = false } = o;
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}" ` +
    `font-family="${mono ? "'SF Mono',Menlo,monospace" : "-apple-system,'Segoe UI',Arial,sans-serif"}">${esc(s)}</text>`;
};

/* ───────────────────── slide 4: end screen — vùng an toàn & thời lượng ───────────────────── */
const endScreenSvg = `<svg class="c-svg" viewBox="0 0 1160 380" width="1160">
<rect x="40" y="14" width="560" height="315" rx="12" fill="${C.p1}" stroke="${C.bd}" stroke-width="2"/>
<rect x="64" y="34" width="170" height="96" rx="8" fill="${C.blu}" fill-opacity=".16" stroke="${C.blu}" stroke-width="2"/>
${txt(80, 55, '①', { anchor: 'start', size: 20, weight: 800, fill: C.blu })}
${txt(149, 88, 'Video gợi ý', { size: 15 })}
<rect x="64" y="140" width="170" height="96" rx="8" fill="${C.tea}" fill-opacity=".16" stroke="${C.tea}" stroke-width="2"/>
${txt(80, 161, '②', { anchor: 'start', size: 20, weight: 800, fill: C.tea })}
${txt(149, 194, 'Playlist', { size: 15 })}
<circle cx="518" cy="266" r="42" fill="${C.amb}" fill-opacity=".18" stroke="${C.amb}" stroke-width="2"/>
${txt(518, 258, '③', { size: 20, weight: 800, fill: C.amb })}
${txt(518, 278, 'Đăng ký', { size: 13 })}
<rect x="326" y="252" width="150" height="40" rx="8" fill="${C.vio}" fill-opacity=".16" stroke="${C.vio}" stroke-width="2"/>
${txt(401, 277, '④ Kênh / link', { size: 14.5, fill: C.vio, weight: 700 })}
${txt(320, 20, '16:9 — khung video', { anchor: 'start', size: 13.5, fill: C.dim })}
<g font-family="-apple-system,Arial">
${txt(640, 60, '① Video gợi ý — tối đa 2 video', { anchor: 'start', size: 17, fill: C.blu, weight: 700 })}
${txt(640, 100, '② Playlist — thay cho 1 trong 2 video ở trên', { anchor: 'start', size: 17, fill: C.tea, weight: 700 })}
${txt(640, 140, '③ Đăng ký kênh — nút Subscribe', { anchor: 'start', size: 17, fill: C.amb, weight: 700 })}
${txt(640, 180, '④ Kênh hoặc link ngoài', { anchor: 'start', size: 17, fill: C.vio, weight: 700 })}
${txt(640, 220, 'Tối đa BỐN phần tử — chỉ video tỉ lệ', { anchor: 'start', size: 15.5, fill: C.mu })}
${txt(640, 242, 'chuẩn 16:9 (support.google.com/youtube)', { anchor: 'start', size: 15.5, fill: C.mu })}
</g>
<rect x="40" y="345" width="1080" height="18" rx="9" fill="${C.p2}" stroke="${C.bd}"/>
<rect x="904" y="345" width="216" height="18" rx="9" fill="${C.red}" fill-opacity=".6"/>
${txt(50, 340, '0:00', { anchor: 'start', size: 14, mono: true, fill: C.dim })}
${txt(1110, 340, 'hết video', { anchor: 'end', size: 14, mono: true, fill: C.dim })}
${txt(1012, 300, '5–20 giây CUỐI', { size: 16, fill: C.red, weight: 800 })}
<path d="M1012 306 L1012 342" stroke="${C.red}" stroke-width="2" stroke-dasharray="3 3"/>
</svg>`;

/* ───────────────────── slide 10: không gian 3D của Fusion (hội tụ về Merge3D → Renderer3D) ───────────────────── */
const scene3dSvg = `<svg class="c-svg" viewBox="0 0 1160 320" width="1160">
${[
  { x: 20, y: 15, c: C.amb, t: 'Text3D', d: 'chữ 3D' },
  { x: 230, y: 15, c: C.tea, t: 'Shape3D', d: 'khối / hình 3D' },
  { x: 20, y: 150, c: C.blu, t: 'Camera3D', d: 'góc nhìn, chuyển động' },
  { x: 230, y: 150, c: C.vio, t: 'Đèn', d: 'Spot / Point / Directional' },
].map((n) => `<rect x="${n.x}" y="${n.y}" width="190" height="110" rx="10" fill="${C.p1}" stroke="${n.c}" stroke-width="2"/>` +
  `<rect x="${n.x}" y="${n.y}" width="6" height="110" fill="${n.c}"/>` +
  txt(n.x + 100, n.y + 46, n.t, { size: 19, weight: 800, fill: '#fff' }) +
  txt(n.x + 100, n.y + 70, n.d, { size: 14, fill: C.mu })).join('')}
${[[210, 70, 520, 130], [210, 205, 520, 170], [420, 70, 520, 130], [420, 205, 520, 170]].map(([x1, y1, x2, y2]) =>
  `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${C.dim}" stroke-width="2" fill="none" opacity=".7"/><circle cx="${x2}" cy="${y2}" r="4" fill="${C.dim}"/>`).join('')}
<rect x="520" y="95" width="190" height="110" rx="10" fill="${C.p2}" stroke="${C.tx}" stroke-width="2.5"/>
${txt(615, 145, 'Merge3D', { size: 19, weight: 800, fill: '#fff' })}
${txt(615, 168, 'gộp mọi thứ 3D lại', { size: 14, fill: C.mu })}
${txt(615, 186, 'thành MỘT cảnh', { size: 14, fill: C.mu })}
<path d="M710 150 L800 150" stroke="${C.tx}" stroke-width="2.5" fill="none"/><circle cx="800" cy="150" r="4" fill="${C.tx}"/>
<rect x="800" y="95" width="190" height="110" rx="10" fill="${C.p1}" stroke="${C.red}" stroke-width="2"/>
${txt(895, 145, 'Renderer3D', { size: 19, weight: 800, fill: '#fff' })}
${txt(895, 168, 'dựng cảnh 3D thành', { size: 14, fill: C.mu })}
${txt(895, 186, 'MỘT ảnh 2D phẳng', { size: 14, fill: C.mu })}
<path d="M990 150 L1055 150" stroke="${C.red}" stroke-width="2.5" fill="none"/><path d="M1048 143 L1057 150 L1048 157" stroke="${C.red}" stroke-width="2.5" fill="none"/>
<rect x="1058" y="112" width="78" height="76" rx="8" fill="#1b2230" stroke="${C.red}" stroke-width="2"/>
${txt(1097, 155, '2D', { size: 18, weight: 800, fill: C.red })}
${txt(1097, 205, '→ ghép với cảnh quay', { size: 13, fill: C.dim })}
${txt(1097, 222, 'ở node Merge (2D)', { size: 13, fill: C.dim })}
</svg>`;

export const slides = S([
  /* 1 — bìa */
  cover({
    t: 'Chương 19 — Motion graphics, Fusion & 3D',
    sub: 'Hệ thống nhận diện chuyển động · Tư duy node Fusion · Không gian 3D · Blender cho creator',
    chap: 'CHƯƠNG 19',
  }),

  /* 2 — bản đồ chương */
  {
    t: 'Bản đồ chương',
    body: mindmap('CHƯƠNG 19', 'nối Ch17 (keyframe) & Ch18 (tracking), mở Ch20', [
      { t: '🎬 Motion graphics', d: 'Hệ nhận diện, lower third, end screen, xuất alpha', c: 'red' },
      { t: '🧩 Fusion trong Resolve', d: 'Tư duy node, Text+/Merge, macro dùng lại', c: 'ora' },
      { t: '🧊 3D trong Fusion', d: 'Text3D/Shape3D/Camera3D/Renderer3D', c: 'amb' },
      { t: '🖥️ Blender cho creator', d: 'Logo 3D → PNG alpha → ghép Resolve', c: 'grn' },
      { t: '⬅️ Ch18 vừa học', d: 'Mask, tracking, phông xanh, VFX', c: 'vio' },
      { t: '➡️ Ch20 sắp tới', d: 'Video ngắn dọc', c: 'pnk' },
    ]),
  },

  /* 3 — hệ thống nhận diện chuyển động: các thành phần */
  {
    t: 'Hệ thống nhận diện chuyển động — các thành phần',
    body: cards([
      { ic: '🎬', t: 'Intro / logo', d: '3–5 giây, mở đầu mọi video — không dài hơn', c: 'red' },
      { ic: '🏷️', t: 'Lower third', d: 'Tên/chức danh — đúng font & ease đã dựng ở Ch16.2', c: 'ora' },
      { ic: '📖', t: 'Tiêu đề chương', d: 'Ngăn video dài thành các đoạn có tên', c: 'amb' },
      { ic: '👉', t: 'Callout code', d: 'Khoanh, mũi tên, zoom — nối Ch17.2', c: 'tea' },
      { ic: '📊', t: 'Thanh tiến độ / chapter', d: 'Người xem biết đang ở đâu trong video', c: 'blu' },
      { ic: '🔚', t: 'End screen', d: '5–20 giây cuối — Slide 4', c: 'vio' },
    ], 3) + box('tip', '<strong>Ít mà đều</strong> quan trọng hơn nhiều mà mỗi video một kiểu: MỘT font, MỘT bảng màu, MỘT nhịp chuyển động cho tất cả 6 thành phần này — đúng "bộ nhận diện" đã học ở Ch16.2, giờ áp cho toàn bộ đồ hoạ chuyển động.'),
  },

  /* 4 — end screen YouTube */
  {
    t: 'End screen: vùng phần tử & thời lượng (YouTube)',
    body: endScreenSvg + box('warn', 'Video phải dài <strong>≥ 25 giây</strong> mới bật được end screen — support.google.com/youtube/answer/6388789 (kiểm 09/2026). Đặt lower third/callout của chương này ra XA vùng 4 góc đó, hoặc dọn màn hình sạch trong 5–20 giây cuối.'),
  },

  /* 5 — công cụ dựng motion graphics */
  {
    t: 'Công cụ dựng motion graphics — chọn cái nào',
    body: table(
      ['Công cụ', 'Nền tảng', 'Giá', 'Hợp cho'],
      [
        ['Resolve Titles + Fusion Titles', 'Mac/Win/Linux — Ch13.4: KHÔNG trên iPad', '+Miễn phí trong Resolve', 'Mọi kỹ thuật trong chương này'],
        ['CapCut Templates', 'Máy tính & di động', '+Miễn phí (phần lớn)', 'Video ngắn, dựng nhanh — nối Ch12'],
        ['Adobe After Effects', 'Windows, macOS', '!Thuê bao — giá đổi theo khuyến mãi/khu vực, kiểm lại trên adobe.com', 'Motion graphics chuyên sâu, chuẩn ngành'],
        ['Apple Motion', 'macOS 15.6 trở lên', '+49,99 USD mua đứt 1 lần', 'Dựng template cho Final Cut Pro'],
      ],
      { sm: true },
    ) + box('info', 'Khoá này dùng Fusion trong Resolve — <strong>miễn phí, đã có sẵn</strong>, và là công cụ DUY NHẤT ở đây chạy được trên cả Mac lẫn máy Linux của bạn.'),
  },

  /* 6 — xuất đồ hoạ có alpha, đo thật */
  {
    t: 'Xuất đồ hoạ có nền trong suốt — đo thật trên máy này',
    body: bars([
      { l: 'PNG RGBA', sub: '1 khung 1280×720, có alpha', v: 0.349, txt: '0,35 MB', c: 'blu' },
      { l: 'ProRes 422 HQ', sub: '2 giây, KHÔNG alpha (yuv422p10le)', v: 11.76, txt: '11,76 MB', c: 'tea' },
      { l: 'ProRes 4444', sub: '2 giây, CÓ alpha (yuva444p12le)', v: 19.31, txt: '19,31 MB', c: 'amb' },
    ], { lw: 240 }) + box('good', 'Đo bằng <code>ffprobe</code> trên máy này: bản ProRes 4444 mang đúng codec_tag <code>ap4h</code>. Kéo ngược MỘT khung ra khỏi chính file .mov đó vẫn thấy nền alpha=0, chữ alpha=255 — cùng 2 giây, bản CÓ alpha nặng hơn bản KHÔNG alpha khoảng 64%.'),
  },

  /* 7 — tư duy node của Fusion */
  {
    t: 'Tư duy NODE của Fusion — khác layer của CapCut/After Effects',
    body: nodes([
      { n: 1, t: 'MediaIn', th: 'linear-gradient(135deg,#4b5563,#9ca3af)' },
      { n: 2, t: 'Background', th: `linear-gradient(135deg,${C.amb},#7a5a10)` },
      { n: 3, t: 'Text+', th: `linear-gradient(135deg,${C.tea},#0f5952)` },
      { n: 4, t: 'Transform', th: `linear-gradient(135deg,${C.blu},#1e3a6e)` },
      { n: 5, t: 'Merge', th: `linear-gradient(135deg,${C.vio},#3d2e6e)` },
      { n: 6, t: 'MediaOut', th: 'linear-gradient(135deg,#4b5563,#9ca3af)' },
    ]) + box('info', '<strong>Layer</strong> (CapCut, After Effects): chồng theo THỨ TỰ TRÊN-DƯỚI cố định, mỗi lớp tự mang hiệu ứng riêng. <strong>Node</strong> (Fusion): mỗi bước là MỘT ô riêng, nối bằng dây — cùng một Text+ nối được vào nhiều Merge khác nhau, thứ tự do dây quyết định chứ không phải vị trí trên/dưới.'),
  },

  /* 8 — bảng công cụ Fusion: free vs Studio */
  {
    t: 'Công cụ trang Fusion — free hay chỉ Studio',
    body: table(
      ['Công cụ trên trang Fusion', 'Bản nào', 'Dùng để làm gì'],
      [
        ['Text+, Background, Merge, Transform', '+Miễn phí', 'Khối dựng cơ bản của mọi composite'],
        ['Polygon/Rectangle mask + Paint', '+Miễn phí', 'Vẽ mask tay, rotoscope — nối Ch18.1'],
        ['Tracker (2D) & Planar Tracker', '+Miễn phí', 'Bám điểm/mặt phẳng — nối Ch18.2 & Ch18.4'],
        ['Delta Keyer & Ultra Keyer', '+Miễn phí', 'Key phông xanh nâng cao — nối Ch18.3'],
        ['Text3D/Shape3D/Camera3D/Merge3D/Renderer3D', '+Miễn phí', 'Không gian 3D cơ bản — Bài 19.3'],
        ['Lưu Macro / Title dùng lại cho cả series', '+Miễn phí', 'Đóng gói một cụm node thành template'],
        ['Camera Tracker (chuyển động 3D của máy quay)', '-CHỈ Fusion Studio', 'Đặt vật 3D "dính" vào cảnh quay thật'],
        ['Độ phân giải > 16K, network render nhiều máy', '-CHỈ Fusion Studio', 'Dự án siêu lớn — hiếm khi creator cần'],
      ],
      { sm: true },
    ) + box('warn', '<code>blackmagicdesign.com/products/fusion/compare</code> so hai bản ĐỀU TRẢ PHÍ (Fusion trong Resolve Studio ↔ Fusion Studio rời) — không phải free-vs-Studio. Bảng trên kiểm lại bằng trang sản phẩm Fusion + tìm kiếm chéo, khớp với Ch18.'),
  },

  /* 9 — làm mẫu: lower third trong Fusion */
  {
    t: 'Làm mẫu từng bước: lower third trong Fusion',
    body: steps([
      ['Thêm node <strong>Background</strong> (trong suốt) rồi <strong>Text+</strong> — gõ tên/chức danh bằng font đã kiểm ở Ch16.2', 'Text+ nối vào đầu Foreground của Background'],
      ['Thêm node <strong>Merge</strong> — nối cảnh quay (MediaIn) vào Background của Merge, nối cụm Text+ vào Foreground', 'Merge là chỗ hai lớp thật sự chồng lên nhau'],
      ['Trên node <strong>Transform</strong> (chèn trước Merge), đặt keyframe Position: ngoài khung → vị trí dừng; keyframe Opacity 0 → 1', 'Đúng khái niệm keyframe của Ch17.2, chỉ khác nơi bấm'],
      ['Mở <strong>Spline Editor</strong>, chuột phải điểm keyframe cuối → chọn kiểu easing (Ease Out)', 'Cùng ý tưởng "slow in, slow out" ở Ch17.2 — Fusion gọi đường cong này là Spline'],
      ['Chọn cả cụm node → chuột phải → <strong>Save As Macro</strong>', 'Lần sau chỉ kéo macro ra, đổi chữ — không dựng lại từ đầu'],
    ]) + box('bad', '<strong>iPad KHÔNG có trang Fusion</strong> (đã nói ở Ch13.4: chỉ Cut/Color/Deliver/Photo) — mọi việc ở bài này làm trên Mac.'),
  },

  /* 10 — không gian 3D của Fusion */
  {
    t: 'Không gian 3D của Fusion: 4 node hội tụ về MỘT cảnh',
    body: scene3dSvg,
  },

  /* 11 — giới hạn vs đủ dùng */
  {
    t: 'Fusion 3D: đủ dùng cho creator, KHÔNG thay phần mềm 3D thật',
    body: vs({
      no: { t: 'Fusion 3D KHÔNG thay được', items: [
        'Mô hình hoá vật thể nhiều chi tiết (nhân vật, sản phẩm phức tạp)',
        'Vật liệu/ánh sáng vật lý sâu (path tracing đầy đủ, global illumination)',
        'Rigging, hoạt hình nhân vật, mô phỏng vải/nước/hạt phức tạp',
        'Kho model/add-on khổng lồ như hệ sinh thái Blender',
      ] },
      yes: { t: 'Fusion 3D ĐỦ DÙNG cho', items: [
        'Chữ/logo 3D xoay nhẹ, có ánh sáng, cho intro 3–5 giây',
        'Một khối hình đơn giản (Shape3D) làm nền động cho tiêu đề',
        'Không cần rời phần mềm đang dựng — khỏi export/import qua lại',
        'Chạy mượt trên Mac M1 Max nhờ GPU accel (Metal) ngay trong Resolve',
      ] },
    }),
  },

  /* 12 — quy trình Blender → Resolve */
  {
    t: 'Blender cho creator — quy trình logo/chữ 3D → ghép Resolve',
    body: flow([
      { e: '✍️', t: 'Dựng chữ/logo 3D', d: 'Text + Extrude + Bevel, vật liệu, đèn, camera', c: 'amb' },
      { e: '🎥', t: '(Tuỳ chọn) Camera tracking', d: 'Movie Clip Editor — khớp camera Blender với cảnh quay thật', c: 'tea' },
      { e: '🖼️', t: 'Render PNG/EXR có alpha', d: 'Film Transparent BẬT, 1 khung hoặc cả chuỗi', c: 'blu' },
      { e: '🧩', t: 'Ghép vào Resolve/Fusion', d: 'Import làm lớp riêng — PNG sequence hoặc ProRes 4444', c: 'vio' },
    ]) + box('info', 'Blender <strong>miễn phí, mã nguồn mở</strong> — macOS Apple Silicon tăng tốc bằng <strong>Metal</strong>, Linux có NVIDIA dùng <strong>CUDA/OptiX</strong> (blender.org, kiểm 09/2026).'),
  },

  /* 13 — render thật trên máy này */
  {
    t: 'Render chữ 3D THẬT trên máy này (Mac M1 Max)',
    body: kpis([
      { v: '4,67s', l: 'Thời gian render THẬT — real (/usr/bin/time -p)', c: 'amb' },
      { v: 'Metal', l: 'GPU thật Cycles dùng — Apple M1 Max', c: 'tea' },
      { v: '349 KB', l: 'File PNG RGBA 1280×720, 128 samples', c: 'blu' },
      { v: '128', l: 'Samples Cycles, 1 khung — Blender 5.1.2', c: 'vio' },
    ]) + box('good', 'Lệnh thật: <code>blender -b -P tao-chu-3d.py -- out.png</code> — script Python tự dựng chữ "cuongthai" (Text+Extrude+Bevel), MỘT đèn Area, MỘT camera, <code>film_transparent=True</code>. Nền alpha=0, chữ alpha=255 — xác nhận bằng Pillow, không đoán.'),
  },

  /* 14 — render trên Linux RTX 3060 */
  {
    t: 'Render trên máy Linux (RTX 3060) — cú pháp CHƯA chạy ở đây',
    body: code(`# 1) Kiem VRAM dang trong bao nhieu TRUOC khi render
nvidia-smi --query-gpu=memory.used,memory.total --format=csv

# 2) Render 1 khung, chon thiet bi Cycles qua OptiX (RTX 3060 ho tro OptiX)
blender -b logo-3d.blend -o //render/khung_##### -F PNG -f 1 -- --cycles-device OPTIX

# 3) VRAM dang gan day thi doi sang CUDA, hoac CPU (cham hon, khong tranh VRAM)
blender -b logo-3d.blend -o //render/khung_##### -F PNG -f 1 -- --cycles-device CUDA
blender -b logo-3d.blend -o //render/khung_##### -F PNG -f 1 -- --cycles-device CPU`, 'bash')
      + box('warn', 'Đo thật 22/09/2026: dịch vụ thường trú trên máy Linux ở nhà chiếm khoảng <strong>11/12 GB VRAM</strong> lúc cao điểm. Cú pháp <code>--cycles-device</code> PHẢI đứng SAU dấu <code>--</code> ở cuối dòng — theo đúng Blender Manual (kiểm 2 nguồn độc lập, khớp nhau). Lệnh này CHƯA chạy trên máy Linux đó.'),
  },

  /* 15 — bảng tra nhanh cả chương */
  {
    t: 'Bảng tra nhanh cả chương',
    body: table(
      ['Muốn làm gì', 'Ở đâu'],
      [
        ['Lower third/tiêu đề có keyframe, lưu template', 'Fusion (Text+, Merge, Transform) → Save As Macro'],
        ['Chữ/logo 3D đơn giản, xoay nhẹ theo camera', 'Fusion trang 3D — Text3D/Shape3D + Camera3D + Merge3D + Renderer3D'],
        ['Thay màn hình điện thoại/laptop bám theo chuyển động', 'Fusion Planar Tracker + corner-pin — nối Ch18.4'],
        ['Vật 3D "dính" vào cảnh quay có máy quay di chuyển', '-Fusion Camera Tracker — CHỈ Studio'],
        ['Chữ/logo 3D chi tiết, vật liệu/ánh sáng phức tạp', 'Blender (miễn phí) → render PNG/EXR alpha → ghép Resolve'],
        ['Xuất đồ hoạ nền trong suốt để dùng lại nhiều lần', 'Deliver → Individual Clips → ProRes 4444 → Export Alpha'],
        ['Template dựng sẵn, không cần học node', 'CapCut Templates / Resolve Titles có sẵn'],
      ],
      { sm: true },
    ),
  },

  /* 16 — thực hành */
  {
    t: '🎬 Thực hành',
    body: steps([
      ['Dựng MỘT lower third trong Fusion theo đúng 5 bước ở Slide 9, lưu thành Macro', 'Kiểm: kéo macro ra một clip khác, chỉ cần đổi chữ.'],
      ['Dựng chữ/logo 3D đơn giản trong Fusion (Text3D + Camera3D + Merge3D + Renderer3D), cho camera lia nhẹ qua chữ', 'So với slide 10 — đủ 4 node hội tụ chưa?'],
      ['Xuất một đồ hoạ (logo hoặc lower third) dạng ProRes 4444 có alpha từ Deliver, kiểm bằng cách kéo vào một track khác đè lên video bất kỳ', 'Đạt khi nền thật sự trong suốt, không phải nền đen/trắng.'],
      ['Nếu có Blender: dựng một chữ 3D bằng Text+Extrude+Bevel, thêm một đèn một camera, render PNG có Film Transparent bật', 'So sánh với số đo thật ở Slide 13 — máy bạn nhanh/chậm hơn bao nhiêu.'],
    ]) + box('good', '<strong>Đạt khi:</strong> nhìn một video intro bất kỳ, chỉ ra được nó dùng layer (CapCut/AE) hay node (Fusion) chỉ bằng cách đoán quy trình dựng — không cần mở file dự án.'),
  },
]);
