/** Content Creator · Deck cr-22 — Chương 22: Video bài giảng & quay màn hình. */
import { S, cover, mindmap, table, chart, flow, ui, two, steps, frame, cards, box, note } from './_cr-chung.mjs';

export const deck = { key: 'cr-22', code: 'CR · CHƯƠNG 22', title: 'Video bài giảng & quay màn hình', sub: 'Content Creator · Chương 22' };

export const slides = S([
  cover({ t: 'Chương 22 — Video bài giảng & quay màn hình', sub: 'Nguyên lý dạy bằng video · OBS & quay màn hình macOS · iPad làm bảng trắng · đưa lên 3 luồng VI/EN/YT', chap: 'CHƯƠNG 22' }),

  { t: 'Bản đồ chương', body: mindmap('Video bài giảng & quay màn hình', 'Chương 22', [
    { t: '🎯 22.1 Thiết kế bài giảng', d: 'Nguyên lý Mayer · độ dài video · chia đoạn', c: 'red' },
    { t: '🖥️ 22.2 Quay màn hình chuẩn', d: 'OBS · macOS · webcam · dọn bàn số', c: 'ora' },
    { t: '✍️ 22.3 iPad làm bảng trắng', d: 'Pencil · AirPlay · ghép camera mặt', c: 'amb' },
    { t: '🚀 22.4 Dựng & đưa lên khoá học', d: 'Cắt, callout, chapter, 3 luồng VI/EN/YT', c: 'grn' },
    { t: '✅ Nối từ', d: 'Ch9 (mic) · Ch14 (dựng) · Ch16.2 (callout) · Ch17.2 (zoom)', c: 'blu' },
    { t: '➡️ Nối tới', d: 'Ch23 song ngữ · Ch24 xuất & đăng', c: 'vio' },
  ]) },

  { t: 'Nguyên lý đa phương tiện của Mayer', body: table(['Nguyên lý', 'Ý chính', 'Áp dụng khi quay bài giảng'], [
    ['Tín hiệu <small>(signaling)</small>', 'Thêm dấu hiệu chỉ ra chỗ quan trọng', 'Mũi tên/khoanh đúng dòng code, tiêu đề mục rõ ràng'],
    ['Chia đoạn <small>(segmenting)</small>', 'Chia nhỏ theo nhịp người học tự bấm tiếp', 'Quay & dựng theo đoạn 3–8 phút, không một mạch dài'],
    ['Mạch lạc <small>(coherence)</small>', 'Bỏ thứ không liên quan thay vì thêm vào', 'Dọn desktop, tắt thông báo, không nhạc nền khi giảng code'],
    ['Dư thừa <small>(redundancy)</small>', 'Hình + lời > hình + lời + chữ dài y hệt trên màn hình', 'Đừng chiếu cả đoạn văn dài rồi đọc lại nguyên văn'],
    ['Cá nhân hoá <small>(personalization)</small>', 'Giọng trò chuyện học tốt hơn giọng trang trọng', 'Nói "bạn", dùng "mình" khi kể lại lỗi thật đã gặp'],
  ], { sm: true }) + note('Định nghĩa theo Cambridge Handbook of Multimedia Learning (chủ biên Richard E. Mayer, UC Santa Barbara).') },

  { t: 'Nghiên cứu độ dài video (Guo, Kim & Rubin 2014)', body: chart({
    series: [{ t: '% người xem còn ở lại (minh hoạ)', c: 'tea', wd: 4.5, pts: [[0, 100], [1, 92], [2, 86], [3, 80], [4, 74], [5, 68], [6, 60], [7, 46], [8, 36], [9, 28], [10, 22], [12, 16], [15, 10]] }],
    x: [0, 15, 'độ dài video (phút)'], y: [0, 100, '% còn ở lại'], xt: 5, yt: 4,
    notes: [{ x: 6, y: 60, t: '~6 phút — mức gắn bó bắt đầu rơi mạnh', c: 'amb', dx: 10, dy: -18 }],
  }) + note('L@S 2014 · 6,9 triệu lượt xem trên 4 khoá edX: video càng ngắn càng giữ chân tốt, mức gắn bó rơi mạnh sau khoảng 6 phút dù video dài bao nhiêu; talking-head kiểu thân mật và hình vẽ tay kiểu Khan Academy giữ chân tốt hơn bài giảng quay phòng học "chỉn chu". Đường trên là MINH HOẠ xu hướng đó, không phải số liệu gốc của nghiên cứu.') },

  { t: 'Cấu trúc một bài giảng — chia đoạn', body: flow([
    { e: '🎯', t: 'Mục tiêu', d: 'Một câu, học xong làm được gì', c: 'red' },
    { e: '❓', t: 'Vì sao', d: 'Vấn đề thật trước khái niệm', c: 'ora' },
    { e: '📖', t: 'Khái niệm', d: 'Định nghĩa ngắn + ví dụ nhỏ', c: 'amb' },
    { e: '⌨️', t: 'Làm mẫu', d: 'Gõ code thật, nói ra suy nghĩ', c: 'grn' },
    { e: '🧩', t: 'Luyện', d: 'Bài tập nhỏ người xem tự làm', c: 'tea' },
    { e: '📌', t: 'Tóm tắt', d: '3 gạch đầu dòng, dẫn đoạn kế', c: 'blu' },
  ]) },

  { t: 'Quay nhanh hay dựng cảnh — chọn công cụ nào', body: table(['', 'Screenshot app / QuickTime (có sẵn)', 'OBS Studio (miễn phí, mã nguồn mở)'], [
    ['Cài đặt', '+Có sẵn trên macOS — Shift+Cmd+5', '-Tải & cài riêng (obsproject.com)'],
    ['Ghép nhiều nguồn (màn hình + webcam)', '-Không — mỗi lần một nguồn', '+Nhiều "Source" xếp lớp trong một "Scene"'],
    ['Chỉnh mức mic khi đang quay', '-Không có mixer', '+Audio Mixer riêng cho từng nguồn'],
    ['Đổi cảnh giữa chừng (màn hình ⇄ chỉ mặt)', '-Phải dừng, quay lại đoạn mới', '+Bấm phím tắt đổi "Scene"'],
    ['Hợp dùng khi', 'Quay nhanh một đoạn ngắn, không cần webcam', 'Buổi bài giảng dài, có webcam góc, nhiều cảnh'],
  ], { sm: true }) },

  { t: 'Bố cục scene OBS cho một bài giảng code', body: ui({ w: 1120, h: 440, title: 'OBS Studio — scene "Bài giảng code" (minh hoạ)', regions: [
    { n: 1, t: 'Canvas quay màn hình', d: 'macOS Screen Capture — VS Code + terminal', x: 4, y: 4, w: 68, h: 70, c: 'blu' },
    { n: 2, t: 'Webcam góc', d: 'Video Capture Device — iPhone qua Continuity Camera', x: 74, y: 4, w: 22, h: 34, c: 'amb' },
    { n: 3, t: 'Audio Mixer', d: 'Mic USB — canh không đỏ', x: 74, y: 40, w: 22, h: 16, c: 'grn' },
    { n: 4, t: 'Danh sách Scene', d: 'Màn hình · Chỉ mặt · Màn hình+mặt', x: 4, y: 76, w: 36, h: 20, c: 'tea' },
    { n: 5, t: 'Danh sách Source', d: 'Kéo thả để xếp lớp trước/sau', x: 42, y: 76, w: 54, h: 20, c: 'vio' },
  ] }) + note('Bố cục MINH HOẠ — vị trí từng Source/Scene thật tuỳ bạn kéo thả trong OBS.') },

  { t: 'iPhone làm webcam qua Continuity Camera', body: two(
    steps([
      ['Trên iPhone: bật <b>Cài đặt → Camera → Camera Chính Continuity</b>', 'Cùng Apple Account, Wi-Fi + Bluetooth bật ở cả hai máy, đặt gần Mac'],
      ['Trong OBS: thêm Source <b>Video Capture Device</b>', 'Chọn tên iPhone trong danh sách thiết bị — cắm dây USB-C cũng dùng được'],
      ['macOS hỏi quyền Camera lần đầu → Cho phép', 'Chưa thấy máy trong danh sách thì khởi động lại OBS'],
      ['Kéo khung webcam vào góc trống của canvas', 'Đặt cỡ vừa đủ thấy mặt, không che dòng code đang giảng'],
    ]),
    frame({ w: 380, ratio: '16:9', size: 'MCU', at: 0.5, verdict: 'good', label: 'Khung webcam đúng — đủ khoảng đầu, mắt ở 1/3 trên' })
  ) },

  { t: 'Bảng cài đặt quay màn hình', body: table(['Mục', 'Đặt gì', 'Vì sao'], [
    ['!Base (Canvas) Resolution', 'Bằng độ phân giải thật của màn hình (vd 2560×1440)', 'Quay cao hơn để còn zoom lúc dựng mà không vỡ nét — cùng lý do Ch5.1 quay 4K xuất 1080p'],
    ['Output (Scaled) Resolution', '1920×1080 khi xuất', 'Nhẹ file, đủ nét để học viên xem trên web'],
    ['Downscale Filter', 'Lanczos', 'Giữ chữ trong VS Code sắc nét nhất khi thu nhỏ từ canvas lớn'],
    ['FPS', '30fps là đủ', 'Đây là chụp thẳng khung hình số qua ScreenCaptureKit, không qua cảm biến ánh sáng — không bị nhấp nháy 50Hz như quay CAMERA vào một màn hình (Ch10.2)'],
    ['Âm thanh', 'Mic USB (Ch9.2), 48kHz', 'Vị trí thu cố định trước máy — đúng việc mic USB sinh ra để làm'],
    ['Cỡ chữ VS Code', 'Tăng lên khoảng 150–200% cỡ thường dùng', 'Zoom cả giao diện: <code>Cmd+=</code> · hoặc riêng cỡ chữ trong Settings: gõ "editor.fontSize"'],
  ], { sm: true }) },

  { t: 'Dọn bàn làm việc số trước khi bấm quay', body: cards([
    { ic: '🔕', t: 'Tắt thông báo', d: 'Control Center → bật Focus "Không làm phiền" — tin nhắn/mail không nhảy lên giữa video.', c: 'red' },
    { ic: '🖱️', t: 'Làm to con trỏ', d: 'System Settings → Accessibility → Display → kéo "Pointer size" — người xem theo được tay bạn trỏ.', c: 'amb' },
    { ic: '⌨️', t: 'Hiện phím đang bấm', d: 'KeyCastr — mã nguồn mở, cài bằng <code>brew install --cask keycastr</code>.', c: 'grn' },
    { ic: '🗂️', t: 'Dọn desktop & menu bar', d: 'Ẩn file cá nhân, đóng tab/app không liên quan — mạch lạc không chỉ nằm ở lời nói.', c: 'blu' },
  ], 2) },

  { t: 'Presenter Overlay — khi bạn dạy TRỰC TIẾP qua video call', body: two(
    cards([
      { ic: '👤', t: 'Small', d: 'Mặt bạn trong bong bóng nhỏ, di chuyển được — nhường chỗ cho màn hình chia sẻ.', c: 'amb' },
      { ic: '🖼️', t: 'Large', d: 'Bạn hiện rõ cả người, màn hình chia sẻ thu gọn bên cạnh — hợp lúc cần chỉ tay lên hình.', c: 'tea' },
    ], 2),
    box('info', 'Yêu cầu đã kiểm: macOS Sonoma 14 trở lên, Mac dùng chip Apple silicon. Bật từ biểu tượng chia sẻ màn hình trên thanh menu, ngay trong lúc đang gọi video — dùng chung được với Center Stage.')
    + box('warn', 'Đây là tính năng của <b>app gọi video</b> (FaceTime và tương tự) — khác lớp webcam ghép trong OBS ở các slide trước. Dùng khi dạy TRỰC TIẾP qua video call, không phải khi quay file để dựng sau.')
  ) },

  { t: 'iPad làm bảng trắng — luồng ghép vào cảnh quay', body: flow([
    { e: '✏️', t: 'Viết trên iPad', d: 'Pencil trên Freeform/GoodNotes/Notability', c: 'red' },
    { e: '📡', t: 'Phản chiếu', d: 'AirPlay không dây, hoặc cáp ngoài', c: 'ora' },
    { e: '💻', t: 'Mac nhận hình', d: 'Bật AirPlay Receiver trong System Settings', c: 'amb' },
    { e: '🎬', t: 'OBS thu lại', d: 'macOS Screen Capture trỏ đúng cửa sổ đó', c: 'grn' },
    { e: '👤', t: 'Ghép camera mặt', d: 'Cùng một scene với webcam ở slide trước', c: 'tea' },
  ]) },

  { t: 'Ba app viết tay trên iPad', body: table(['App', 'Giá', 'Hợp dùng khi'], [
    ['Freeform', 'Miễn phí — có sẵn trên iPadOS (Apple)', 'Bảng trắng vẽ nhanh, không cần trang cố định — đủ cho phần lớn bài giảng code'],
    ['GoodNotes', 'Có bản miễn phí + gói trả phí', 'Muốn trang giấy/PDF cố định, viết tay đẹp, lưu lại thành file ôn tập'],
    ['Notability', 'Có bản miễn phí + gói trả phí', 'Ghi chú kèm ghi âm đồng bộ — hợp khi vừa giảng vừa viết'],
  ], { sm: true }) + note('Giá cụ thể đổi theo thời gian — kiểm lại trong App Store trước khi mua. Freeform là app của chính Apple, cài sẵn, không cần tải thêm.') },

  { t: 'Từ file dựng xong tới 3 luồng VI/EN/YT', body: flow([
    { e: '📤', t: 'Xuất video', d: 'MP4 H.264 — chi tiết đầy đủ ở Ch24.1', c: 'red' },
    { e: '☁️', t: 'Lưu trữ', d: 'YouTube của riêng bạn, hoặc tải thẳng lên R2', c: 'ora' },
    { e: '🔗', t: 'Gắn vào bài học', d: 'Trang quản trị — dán URL vào ô VN hoặc EN', c: 'amb' },
    { e: '🎚️', t: 'Chọn luồng mặc định', d: 'defaultVideoTrack — ưu tiên bản tự quay', c: 'grn' },
    { e: '🔀', t: 'Học viên chọn', d: 'Nút VN/EN/YT phía trên khung video', c: 'tea' },
  ]) },

  { t: 'Bảng tra nhanh chương 22', body: table(['Việc', 'Con số / thao tác'], [
    ['Nguyên lý dùng nhiều nhất', 'Chia đoạn (segmenting) — quay & dựng theo đoạn 3–8 phút'],
    ['!Điểm gắn bó rơi mạnh (Guo, Kim & Rubin 2014)', '~6 phút, gần như bất kể video dài bao nhiêu'],
    ['Quay có webcam + đổi cảnh', 'OBS Studio — macOS Screen Capture + Video Capture Device'],
    ['Quay nhanh, không cần webcam', 'Shift+Cmd+5 (Screenshot app)'],
    ['Canvas quay / Output xuất', 'Bằng độ phân giải màn hình thật / 1920×1080, Lanczos'],
    ['iPhone làm webcam', 'Continuity Camera — cùng Apple Account, Wi-Fi + Bluetooth bật'],
    ['Hiện phím bấm', 'KeyCastr — <code>brew install --cask keycastr</code>'],
    ['Chương (chapter) YouTube hợp lệ', '00:00 mở đầu · tối thiểu 3 mốc · mỗi đoạn ≥ 10 giây'],
  ]) },

  { t: '🎬 Thực hành', body: steps([
    ['Quay thử 3 phút giảng một đoạn code nhỏ bằng OBS: canvas cao, output 1080p, webcam góc + mic USB', 'Áp đúng bảng cài đặt ở slide 9'],
    ['Dọn bàn làm việc số: bật Focus, tăng cỡ con trỏ, cài & bật KeyCastr', 'Xem lại clip — còn thông báo hay con trỏ lạc giữa hình không?'],
    ['Viết một sơ đồ nhỏ trên iPad bằng Pencil, phản chiếu sang Mac, quay lại 1 phút', 'Kiểm độ trễ giữa nét bút và hình hiện trên Mac'],
    ['Nói đúng đường một file 3 phút cần đi để lên luồng VN của một bài học thật', 'Không cần tải thật lên — chỉ cần nói đúng các bước và ai làm bước nào'],
  ]) + box('good', '<b>Đạt khi:</b> bạn giải thích được vì sao quay theo đoạn ngắn tốt hơn một mạch dài — không chỉ vì thẻ nhớ, mà vì người học — và clip thử của bạn không còn thông báo hệ thống hay con trỏ nhỏ xíu lạc giữa dòng code.') },
]);
