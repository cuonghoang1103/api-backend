/** Content Creator · Deck cr-13 — Chương 13: Dựng chuyên nghiệp với DaVinci Resolve. */
import { S, cover, cards, box, steps, table, flow, mindmap, ui, timeline } from './_cr-chung.mjs';

export const deck = { key: 'cr-13', code: 'CR · CHƯƠNG 13', title: 'Dựng chuyên nghiệp với DaVinci Resolve', sub: 'Content Creator · Chương 13' };

export const slides = S([
  /* 1 — Bìa */
  cover({
    t: 'Chương 13 — Dựng chuyên nghiệp với DaVinci Resolve',
    sub: 'Từ "quay xong không biết edit" tới tự dựng một video YouTube dài — trên Mac, iPad và Linux',
    chap: 'CHƯƠNG 13',
  }),

  /* 2 — Bản đồ chương */
  { t: 'Bản đồ chương', body: mindmap('DaVinci Resolve', 'Chương 13', [
    { t: '🖥️ 7 trang & bắt đầu đúng', d: 'Project Settings, fps trước khi thêm media, Miễn phí vs Studio', c: 'red' },
    { t: '✂️ Công cụ trang Edit', d: 'Phím tắt, ripple/roll/slip/slide, J-cut/L-cut', c: 'ora' },
    { t: '🔤 Text+, keyframe, chuyển cảnh', d: 'Tiêu đề, hoạt hoạ, compound clip', c: 'amb' },
    { t: '🎥 Đa máy & đồng bộ', d: 'Auto Sync Audio, Multicam Pocket 3 + iPhone', c: 'grn' },
    { t: '📱 Resolve trên iPad & Linux', d: 'Trang có sẵn, GPU, giới hạn codec', c: 'blu' },
    { t: '🚀 Từ 0 tới video đầu tiên', d: 'Quy trình 10 bước dựng một video YouTube dài', c: 'vio' },
  ]) },

  /* 3 — 7 trang Resolve */
  { t: '7 trang của DaVinci Resolve — đi từ trái sang phải', body:
    ui({ w: 1120, h: 300, title: 'Thanh chọn trang — góc dưới màn hình Resolve', regions: [
      { n: 1, t: 'Media', d: 'nhập & tổ chức file', x: 1, y: 5, w: 13, h: 90, c: 'red' },
      { n: 2, t: 'Cut', d: 'dựng nhanh, thời sự', x: 15, y: 5, w: 13, h: 90, c: 'ora' },
      { n: 3, t: 'Edit', d: 'dựng chính — đủ công cụ', x: 29, y: 5, w: 13, h: 90, c: 'amb' },
      { n: 4, t: 'Fusion', d: 'kỹ xảo, hợp thành', x: 43, y: 5, w: 13, h: 90, c: 'grn' },
      { n: 5, t: 'Color', d: 'chỉnh màu bằng node', x: 57, y: 5, w: 13, h: 90, c: 'tea' },
      { n: 6, t: 'Fairlight', d: 'dựng & mix âm thanh', x: 71, y: 5, w: 13, h: 90, c: 'blu' },
      { n: 7, t: 'Deliver', d: 'xuất file cuối cùng', x: 85, y: 5, w: 13, h: 90, c: 'vio' },
    ] }) +
    box('info', 'Thứ tự trái → phải gần đúng thứ tự bạn LÀM VIỆC thật: nhập liệu → (Cut để ra bản nháp nhanh nếu cần) → dựng ở Edit → kỹ xảo → màu → âm → xuất. Bài này tập trung vào <b>Edit</b>, chạm nhẹ <b>Cut</b>; Color và Fairlight có chương riêng (15, 16).') },

  /* 4 — Project Manager & fps trước khi thêm media */
  { t: 'Bắt đầu đúng: đặt Frame Rate TRƯỚC khi thêm media', body:
    flow([
      { e: '🆕', t: '1. New Project', d: 'đặt tên dự án trong Project Manager', c: 'red' },
      { e: '⚙️', t: '2. Project Settings', d: 'menu File hoặc icon bánh răng góc dưới', c: 'ora' },
      { e: '🎞️', t: '3. Timeline Frame Rate', d: 'đặt 25fps NGAY — khớp Pocket 3 & iPhone quay 25fps', c: 'amb' },
      { e: '📥', t: '4. Giờ mới Import', d: 'kéo media vào Media Pool', c: 'grn' },
    ]) +
    box('bad', '<b>Thêm media rồi mới định đổi Timeline Frame Rate?</b> Theo tài liệu Resolve, ô đó chỉ còn sửa được qua đường vòng (đổi ở khâu khác, dễ lệch) — cách sạch nhất là tạo Project mới và đặt lại từ đầu. Luật chung: mọi lựa chọn ảnh hưởng "thời gian" (frame rate, timebase) phải chốt TRƯỚC; Proxy/Optimized Media thì đổi lại lúc nào cũng được.') },

  /* 5 — Miễn phí vs Studio */
  { t: 'DaVinci Resolve miễn phí và Studio khác nhau ở đâu', body:
    table(['Tiêu chí', 'Miễn phí', 'Studio (295 USD)'], [
      ['Độ phân giải xuất tối đa', 'UHD 3840×2160', '+Vượt 4K — DCI 4K/6K/8K'],
      ['FPS xuất tối đa', '60fps', '+120fps'],
      ['Mã hoá 10-bit (định dạng chuyên nghiệp)', 'Hạn chế', '+Có'],
      ['DaVinci Neural Engine (AI)', '-Không', '+Có'],
      ['Magic Mask · Speed Warp · Super Scale', '-Xem trước có watermark', '+Có, xuất sạch'],
      ['Voice Isolation (lọc giọng bằng AI)', '-Không', '+Có'],
      ['Khử nhiễu AI (temporal & spatial)', '-Không', '+Có'],
      ['Dựng bằng văn bản (text-based editing)', '-Không', '+Có'],
      ['Cộng tác nhiều người · HDR grading', '+Có', '+Có'],
    ]) +
    box('tip', 'Xuất thường trên bản miễn phí <b>KHÔNG có watermark</b>. Watermark chỉ hiện khi bạn dùng một hiệu ứng CHỈ CÓ ở Studio.') },

  /* 6 — Trang Edit: vùng làm việc */
  { t: 'Trang Edit — 5 vùng làm việc chính', body:
    ui({ w: 1120, h: 470, title: 'DaVinci Resolve — trang Edit', regions: [
      { n: 1, t: 'Media Pool / Effects Library', d: 'clip nguồn, bin, hiệu ứng kéo thả', x: 1, y: 4, w: 28, h: 54, c: 'red' },
      { n: 2, t: 'Viewer nguồn & Viewer timeline', d: 'xem clip gốc (trái) và bản dựng (phải)', x: 30.5, y: 4, w: 39, h: 54, c: 'amb' },
      { n: 3, t: 'Inspector', d: 'thông số clip đang chọn: crop, transform, retime', x: 70.5, y: 4, w: 28.5, h: 54, c: 'blu' },
      { n: 4, t: 'Thanh công cụ tỉa', d: 'biểu tượng của phím A/T/B/…', x: 1, y: 60, w: 98, h: 9, c: 'grn' },
      { n: 5, t: 'Timeline', d: 'các track V (hình) và A (tiếng) xếp chồng', x: 1, y: 71, w: 98, h: 27, c: 'vio' },
    ] }) },

  /* 7 — Phím tắt cốt lõi */
  { t: 'Phím tắt cốt lõi trang Edit (bàn phím Mac)', body:
    table(['Phím', 'Lệnh', 'Dùng khi'], [
      ['A', 'Selection Mode', 'Chọn, kéo di chuyển clip — chế độ mặc định'],
      ['T', 'Trim Edit Mode', 'Tỉa đầu/đuôi clip (ripple/roll)'],
      ['B', 'Blade Edit Mode', 'Bấm vào clip để cắt tại đó'],
      ['I  /  O', 'Đánh dấu In / Out', 'Chọn đoạn nguồn cần dùng (3-point editing)'],
      ['J  /  K  /  L', 'Tua lùi / dừng / tua tới', 'Bấm L nhiều lần để tăng tốc độ tua'],
      ['F9  /  F10', 'Insert  /  Overwrite', 'Đưa clip nguồn vào đúng vị trí playhead'],
      ['F11  /  F12', 'Replace  /  Place on Top', 'Thay clip đang có / chèn đè track trên'],
      ['Shift+Delete', 'Ripple Delete', 'Xoá clip, tự khép khoảng trống để lại'],
      ['N', 'Bật/tắt Snapping', 'Ghép mép hai clip khít, không hở/đè'],
      ['M', 'Đặt Marker', 'Đánh dấu điểm cần quay lại'],
      ['⌘B', 'Cắt mọi track tại playhead', 'Cắt nhanh không cần đổi công cụ Blade'],
    ], { sm: true }) +
    box('warn', 'Bộ phím <b>mặc định</b> của Resolve trên Mac. Nếu máy bạn từng đổi bộ phím kiểu Premiere/FCP, mở <b>Keyboard Customization</b> (⌘⌥K) để xem lại bộ đang bật.') },

  /* 8 — Ripple vs Roll */
  { t: 'Tỉa cạnh: Ripple vs Roll', body:
    `<div style="font-size:16px;color:#ffc233;font-weight:800;margin-bottom:2px">RIPPLE TRIM — tỉa 1 mép, mọi clip phía sau DỊCH theo → tổng thời lượng ĐỔI</div>` +
    timeline({ len: 24, step: 4, tracks: [
      { id: 'TRƯỚC', clips: [{ s: 0, e: 8, t: 'A', c: 'blu' }, { s: 8, e: 16, t: 'B', c: 'amb' }, { s: 16, e: 24, t: 'C', c: 'grn' }] },
      { id: 'SAU', clips: [{ s: 0, e: 8, t: 'A', c: 'blu' }, { s: 8, e: 11, t: 'B', c: 'amb' }, { s: 11, e: 19, t: 'C', c: 'grn' }] },
    ], braces: [{ s: 8, e: 24, t: 'B ngắn lại 5s → mọi thứ sau DỊCH TRÁI 5s', c: 'amb' }] }) +
    `<div style="font-size:16px;color:#7ff0c4;font-weight:800;margin:10px 0 2px">ROLL TRIM — tỉa ĐIỂM NỐI giữa 2 clip cùng lúc → tổng thời lượng KHÔNG đổi</div>` +
    timeline({ len: 24, step: 4, tracks: [
      { id: 'TRƯỚC', clips: [{ s: 0, e: 8, t: 'A', c: 'blu' }, { s: 8, e: 16, t: 'B', c: 'amb' }, { s: 16, e: 24, t: 'C', c: 'grn' }] },
      { id: 'SAU', clips: [{ s: 0, e: 8, t: 'A', c: 'blu' }, { s: 8, e: 11, t: 'B', c: 'amb' }, { s: 11, e: 24, t: 'C', c: 'grn' }] },
    ], braces: [{ s: 0, e: 24, t: 'B ngắn lại 5s, C dài thêm 5s — điểm cuối GIỮ NGUYÊN', c: 'grn' }] }) },

  /* 9 — Slip vs Slide */
  { t: 'Tỉa nội dung: Slip vs Slide', body:
    `<div style="font-size:16px;color:#f472b6;font-weight:800;margin-bottom:2px">SLIP — đổi ĐOẠN NGUỒN bên trong B, vị trí và độ dài trên timeline KHÔNG đổi</div>` +
    timeline({ len: 24, step: 4, tracks: [
      { id: 'TRƯỚC', clips: [{ s: 0, e: 8, t: 'A', c: 'blu' }, { s: 8, e: 14, t: 'B: nguồn 0:10–0:16', c: 'pnk' }, { s: 14, e: 24, t: 'C', c: 'grn' }] },
      { id: 'SAU', clips: [{ s: 0, e: 8, t: 'A', c: 'blu' }, { s: 8, e: 14, t: 'B: nguồn 0:14–0:20', c: 'pnk' }, { s: 14, e: 24, t: 'C', c: 'grn' }] },
    ], braces: [{ s: 8, e: 14, t: 'vị trí + 6s không đổi ở cả 2 hàng', c: 'pnk' }] }) +
    `<div style="font-size:16px;color:#a78bfa;font-weight:800;margin:10px 0 2px">SLIDE — B trượt sang vị trí khác, GIỮ NGUYÊN nội dung & độ dài của B</div>` +
    timeline({ len: 24, step: 4, tracks: [
      { id: 'TRƯỚC', clips: [{ s: 0, e: 8, t: 'A', c: 'blu' }, { s: 8, e: 14, t: 'B (6s)', c: 'vio' }, { s: 14, e: 24, t: 'C', c: 'grn' }] },
      { id: 'SAU', clips: [{ s: 0, e: 11, t: 'A dài thêm', c: 'blu' }, { s: 11, e: 17, t: 'B (6s)', c: 'vio' }, { s: 17, e: 24, t: 'C ngắn lại', c: 'grn' }] },
    ] }) },

  /* 10 — J-cut / L-cut */
  { t: 'Tỉa lệch hình/tiếng: J-cut và L-cut', body:
    `<div style="font-size:16px;color:#ffc233;font-weight:800;margin-bottom:2px">J-CUT — NGHE cảnh sau trước khi THẤY nó (tiếng dẫn trước)</div>` +
    timeline({ len: 24, step: 4, tracks: [
      { id: 'V1', clips: [{ s: 0, e: 12, t: 'A (hình)', c: 'blu' }, { s: 12, e: 24, t: 'B (hình)', c: 'amb' }] },
      { id: 'A1', a: true, clips: [{ s: 0, e: 8, t: 'A (tiếng)', c: 'blu' }, { s: 8, e: 24, t: 'B (tiếng)', c: 'amb' }] },
    ], braces: [{ s: 8, e: 12, t: 'nghe B trước — 4s trước khi thấy', c: 'amb' }] }) +
    `<div style="font-size:16px;color:#7ff0c4;font-weight:800;margin:10px 0 2px">L-CUT — THẤY cảnh sau mà vẫn còn NGHE tiếng cảnh trước (tiếng ở lại)</div>` +
    timeline({ len: 24, step: 4, tracks: [
      { id: 'V1', clips: [{ s: 0, e: 12, t: 'A (hình)', c: 'blu' }, { s: 12, e: 24, t: 'B (hình)', c: 'grn' }] },
      { id: 'A1', a: true, clips: [{ s: 0, e: 16, t: 'A (tiếng)', c: 'blu' }, { s: 16, e: 24, t: 'B (tiếng)', c: 'grn' }] },
    ], braces: [{ s: 12, e: 16, t: 'còn nghe A — 4s sau khi đã thấy B', c: 'grn' }] }) },

  /* 11 — Text+, keyframe, chuyển cảnh, adjustment/compound clip */
  { t: 'Công cụ dựng khác trong trang Edit', body:
    cards([
      { ic: '🔤', t: 'Text+', d: 'công cụ chữ chính — kéo từ Effects Library, gõ trực tiếp trên Inspector', c: 'red' },
      { ic: '🔑', t: 'Keyframe', d: 'ghi lại thông số đổi theo thời gian (vị trí, zoom, mờ dần) trên Inspector', c: 'ora' },
      { ic: '⏩', t: 'Retime Controls', d: 'chuột phải clip → đổi tốc độ (chậm/nhanh), giữ cao độ giọng nói', c: 'amb' },
      { ic: '🔀', t: 'Transitions', d: 'kéo từ Effects Library đè lên điểm nối — dùng tiết chế, hard cut vẫn là chính', c: 'grn' },
      { ic: '🎛️', t: 'Adjustment Clip', d: 'một clip trong suốt đặt đè lên track trên — chỉnh nhiều clip bên dưới cùng lúc', c: 'blu' },
      { ic: '📦', t: 'Compound Clip', d: 'gộp nhiều clip thành một khối — dọn timeline, dùng lại ở dự án khác', c: 'vio' },
    ], 3) },

  /* 12 — Auto Sync Audio */
  { t: 'Đồng bộ đa máy: Auto Sync Audio theo sóng âm', body:
    flow([
      { e: '👏', t: '1. Vỗ tay', d: 'một cái, đầu mỗi lần quay cả 2 máy — mốc âm thanh chung', c: 'red' },
      { e: '💾', t: '2. Đổ thẻ', d: 'cả 2 clip Pocket 3 + iPhone vào CÙNG một bin', c: 'ora' },
      { e: '🖱️', t: '3. Chọn cả 2 clip', d: 'chuột phải → Auto Sync Audio', c: 'amb' },
      { e: '🌊', t: '4. Based on Waveform', d: 'so khớp dạng sóng — không cần timecode chung', c: 'grn' },
      { e: '🔗', t: '5. Đã đồng bộ', d: 'Resolve tạo file .wav khớp khung hình cho từng clip', c: 'blu' },
    ]) +
    box('tip', 'Không có clap thì chọn <b>Based on Timecode</b> nếu 2 máy đã "jam" timecode chung — Pocket 3 và iPhone của bạn KHÔNG làm được việc này, nên clap tay ở mỗi lần quay là cách chắc chắn nhất.') },

  /* 13 — Multicam & trang Cut */
  { t: 'Multicam Clip và bộ công cụ dựng nhanh của trang Cut', body:
    cards([
      { ic: '🎬', t: 'Create New Multicam Clip', d: 'chuột phải các clip đã đồng bộ → gộp thành MỘT clip nhiều góc, chuyển góc bằng phím số khi phát', c: 'red' },
      { ic: '📼', t: 'Source Tape', d: 'xem mọi clip trong bin nối liền như một cuộn băng, tua bằng J/K/L — không phải mở từng clip', c: 'ora' },
      { ic: '🔎', t: 'Sync Bin', d: 'hiện các clip KHỚP với đúng thời điểm playhead trên timeline — chọn cutaway trong vài giây', c: 'amb' },
      { ic: '⚡', t: 'Smart Insert', d: 'chèn clip vào điểm ghép gần playhead nhất, tự đẩy phần sau — không cần đặt In point tay', c: 'grn' },
    ], 2) },

  /* 14 — Mac / iPad / Linux */
  { t: 'Resolve trên ba máy của bạn', body:
    cards([
      { ic: '💻', t: 'Mac M1 Max', d: 'Apple Silicon — bắt buộc từ Resolve 21.1 (macOS 15 Sequoia trở lên). Đủ cả 7 trang, giải mã HEVC/ProRes bằng phần cứng. Trạm dựng chính.', c: 'blu' },
      { ic: '📱', t: 'iPad Pro M5', d: 'App riêng "DaVinci Resolve for iPad" (cần iPadOS 18+). Hiện CHỈ có Cut · Color · Deliver · Photo — CHƯA có Edit/Fusion/Fairlight chính thức. Studio: 94,99 USD mua trong app.', c: 'amb' },
      { ic: '🐧', t: 'Máy Linux ở nhà', d: 'Rocky Linux 8.6 là bản chính thức duy nhất, cần GPU NVIDIA rời + CUDA/OpenCL. Bản MIỄN PHÍ không giải mã H.264/HEVC, và AAC không chạy trên cả hai bản — phải chuyển mã trước (ffmpeg, Chương 11).', c: 'grn' },
    ], 3) },

  /* 15 — Quy trình 10 bước */
  { t: 'Quy trình 10 bước — từ thẻ nhớ tới video YouTube', body:
    table(['#', 'Bước', 'Ghi chú'], [
      ['1', 'Tạo Project, đặt Timeline Frame Rate trước khi thêm gì', '25fps khớp Pocket 3 & iPhone'],
      ['2', 'Import cả hai thẻ vào Media Pool, chia bin theo cảnh', 'tên đã chuẩn hoá từ Chương 11'],
      ['3', 'Đa máy: Auto Sync Audio rồi gộp Multicam Clip', 'bỏ qua nếu chỉ quay 1 máy'],
      ['4', 'Kéo lên timeline trang Edit, dựng thô theo shot list', 'đúng thứ tự kể chuyện trước, đẹp sau'],
      ['5', 'Tỉa lại bằng Ripple/Roll, chèn J-cut/L-cut', 'phím T, kéo mép clip'],
      ['6', 'Thêm Text+ cho tiêu đề, chuyển cảnh tiết chế', 'phần lớn để hard cut là đủ'],
      ['7', 'Sang trang Color, chỉnh sáng/màu cơ bản', 'Chương 15 đi sâu'],
      ['8', 'Sang trang Fairlight, chỉnh mức âm, khử ồn cơ bản', 'Chương 16 đi sâu'],
      ['9', 'Sang trang Deliver, chọn preset xuất khớp fps gốc', 'YouTube 1080p/4K, H.264'],
      ['10', 'Add to Render Queue → Start Render → kiểm bằng ffprobe', 'thói quen Chương 6 — luôn kiểm file thật'],
    ], { sm: true, center: [0] }) },

  /* 16 — Thực hành */
  { t: '🎬 Thực hành — dựng thô 3–5 phút đầu tiên', body:
    cards([
      { ic: '📁', t: 'Dùng đúng footage của bạn', d: 'clip Pocket 3 + iPhone đã quay ở Chương 4/10, project đặt fps ĐÚNG trước khi import', c: 'blu' },
      { ic: '✂️', t: 'Bắt buộc có trong timeline', d: 'ít nhất 6 clip, một lần tỉa Ripple, một lần Roll, một J-cut hoặc L-cut, một Text+ tiêu đề', c: 'amb' },
    ], 2) +
    box('good', '<b>Đạt khi:</b> project không bị hỏi lại frame rate giữa chừng, timeline có đủ các kiểu tỉa nêu trên, và bạn xuất thử được một file từ trang Deliver rồi mở lên phát được (không cần đẹp — cần CHẠY ĐƯỢC hết quy trình 10 bước).') },
]);
