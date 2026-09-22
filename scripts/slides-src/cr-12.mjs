/**
 * cr-12.mjs — Content Creator, Chương 12: Dựng nhanh với CapCut.
 *   node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/cr-12.mjs
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/cr-12.mjs --out <dir>
 */
import { S, cover, cards, box, steps, table, vs, two, mindmap, ui, timeline, audioWave, frame, aspect, cap, phone } from './_cr-chung.mjs';

export const deck = { key: 'cr-12', code: 'CR · CHƯƠNG 12', title: 'Dựng nhanh với CapCut', sub: 'Content Creator · Chương 12' };

/** stepsRow(items, start) — như steps({row:true}) của _cr-chung nhưng đánh số tiếp từ `start`
 *  (dùng để bổ đôi một chuỗi 10 bước thành 2 hàng 5 mà số không lặp lại 1..5 ở hàng dưới). */
const ACC8 = ['red', 'ora', 'amb', 'grn', 'tea', 'blu', 'vio', 'pnk'];
const stepsRow = (items, start = 0) => `<div class="c-steps row">${items.map((h, i) =>
  `<div class="s ${ACC8[(start + i + 2) % 8]}"><span class="n">${start + i + 1}</span><div>${h}</div></div>`).join('')}</div>`;
export const slides = S([

  /* 1 — bìa */
  cover({
    t: 'Chương 12 — Dựng nhanh với CapCut',
    sub: 'Quay xong rồi — giờ biến footage thành một video hoàn chỉnh, đúng từng nút bấm',
    chap: 'CHƯƠNG 12',
  }),

  /* 2 — mindmap */
  {
    t: 'Bản đồ chương',
    body: mindmap('CapCut', 'dựng nhanh, miễn phí', [
      { t: '12.1 Giao diện & project', d: 'Cài đặt, tour giao diện, main track & magnet, đồng bộ máy', c: 'blu' },
      { t: '12.2 Cắt dựng cơ bản', d: 'Split, ripple delete, jump cut, B-roll, tốc độ, keyframe, crop', c: 'amb' },
      { t: '12.3 Chữ, phụ đề, hiệu ứng', d: 'Auto captions, hiệu ứng tiết chế, nhạc nền, màu cơ bản', c: 'grn' },
      { t: '12.4 Xuất & quy trình', d: 'Đúng thông số từng nền tảng, 10 bước dựng 1 video ngắn', c: 'red' },
      { t: 'Miễn phí trước, Pro sau', d: 'Free đủ dùng — biết rõ chỗ nào mới cần trả tiền', c: 'tea' },
      { t: 'Ch.13 kế tiếp', d: 'Khi nào CapCut là đủ, khi nào cần DaVinci Resolve', c: 'vio' },
    ]),
  },

  /* 3 — ui() wireframe */
  {
    t: 'Giao diện CapCut desktop (Mac)',
    body: ui({
      w: 1100, h: 430, title: 'CapCut — video-ngan-60s.capcut',
      regions: [
        { n: 1, t: 'Công cụ', d: '9 tab', x: 0, y: 0, w: 9, h: 100, c: 'blu' },
        { n: 2, t: 'Bảng nội dung', d: 'File/hiệu ứng của tab đang chọn — kéo xuống timeline', x: 9, y: 0, w: 23, h: 66, c: 'amb' },
        { n: 3, t: 'Player', d: 'Khung xem trước, vùng an toàn, nút phát', x: 32, y: 0, w: 45, h: 66, c: 'grn' },
        { n: 4, t: 'Bảng thuộc tính', d: 'Chỉnh clip / chữ / hiệu ứng đang chọn trên timeline', x: 77, y: 0, w: 23, h: 66, c: 'pnk' },
        { n: 5, t: 'Timeline', d: 'Track V1/V2 hình · A1/A2 tiếng — cắt, kéo, ghim tại đây', x: 0, y: 66, w: 100, h: 34, c: 'red' },
      ],
    }) + box('tip', '<strong>① Thanh công cụ 9 tab:</strong> Media · Audio · Text · Stickers · Effects · Transitions · Filters · Adjustment · Templates. Chọn nội dung ở ① ②, xem ở ③, chỉnh thông số ở ④, sắp xếp theo thời gian ở ⑤.'),
  },

  /* 4 — cài đặt project */
  {
    t: 'Cài đặt project — khớp với footage, đừng để mặc định',
    body: two(
      aspect({ items: [
        { r: '16:9', px: '1920×1080', t: 'YouTube, bài giảng', c: 'blu' },
        { r: '9:16', px: '1080×1920', t: 'TikTok · Reels · Shorts', c: 'red' },
      ] }),
      table(['Máy quay', 'Đặt fps project'], [
        ['Pocket 3 / iPhone quay 25fps (điện VN 50Hz)', '!25fps'],
        ['Quay 30fps (mặc định kiểu Mỹ)', '30fps'],
        ['Quay chậm 50/60fps để làm slow-mo', '25 hoặc 30fps'],
      ], { sm: true }),
      'l',
    ) + box('bad', '<strong>Sai lầm hay gặp:</strong> tạo project 9:16 rồi mới nhét clip 16:9 vào — CapCut tự bo/crop giữa khung, mất hết hai bên. Chọn đúng tỉ lệ NGAY khi bấm New project.'),
  },

  /* 5 — main track & magnet */
  {
    t: 'Main track magnet — xoá xong tự khít, không hở',
    body:
      timeline({ len: 16, tracks: [{ id: 'V1', clips: [{ s: 0, e: 5, t: 'Clip 1', c: 'blu' }, { s: 5, e: 9, t: 'Clip 2 — sắp xoá', c: 'red' }, { s: 9, e: 16, t: 'Clip 3', c: 'grn' }] }] }) + cap('TRƯỚC — 3 clip nối liền trên track chính') +
      timeline({ len: 16, tracks: [{ id: 'V1', clips: [{ s: 0, e: 5, t: 'Clip 1', c: 'blu' }, { s: 5, e: 12, t: 'Clip 3', c: 'grn' }] }], braces: [{ s: 5, e: 12, t: 'Clip 3 tự dồn sang trái — không còn khoảng đen', c: 'amb' }] }) + cap('SAU — xoá Clip 2 khi Main track magnet BẬT') +
      box('info', '<strong>Khác nhau:</strong> <b>Main track magnet</b> (icon nam châm) giữ các clip trên track chính LUÔN khít nhau. <b>Linkage</b> là nút riêng, quyết định chữ/nhãn dán/hiệu ứng gắn gần một clip có bị DI CHUYỂN/XOÁ theo clip đó hay không.'),
  },

  /* 6 — jump cut audioWave */
  {
    t: 'Jump cut — cắt bằng mắt nhìn sóng âm, không cắt theo cảm tính',
    body: audioWave({
      len: 22,
      parts: [
        { s: 2.5, e: 4, t: 'im lặng', k: 'pause' },
        { s: 8, e: 9.3, t: '"ờ…"', k: 'filler' },
        { s: 13, e: 14.2, t: 'hít thở', k: 'breath' },
        { s: 17, e: 19, t: 'nói hỏng — cắt cả câu', k: 'filler' },
      ],
    }) + box('tip', '<strong>Quy trình:</strong> phóng to timeline (⌘=), nghe lại, thấy khoảng lặng/"ờ"/câu hỏng thì bấm <b>Q</b> (xoá bên trái playhead) hoặc <b>W</b> (xoá bên phải), main track magnet BẬT tự khít. CapCut Pro có <b>Remove filler words</b> tự nhận diện cả ba loại này trong một cú bấm.'),
  },

  /* 7 — keyframe punch-in */
  {
    t: 'Keyframe — zoom punch-in mượt giữa hai điểm',
    body: two(
      frame({ w: 380, size: 'MS', label: 'Keyframe 1 · 0:03 — 100%', shirt: '#3b82f6' }),
      frame({ w: 380, size: 'MCU', label: 'Keyframe 2 · 0:04 — 130% (punch-in)', shirt: '#3b82f6' }),
    ) + box('tip', 'Bảng thuộc tính ④ → Keyframe → đặt playhead, bấm kim cương để thêm điểm. Chỉ 2 điểm cách nhau 0.3–0.8s, easing Ease in/out, là đủ nhấn một câu nói — không cần animation dài.'),
  },

  /* 8 — auto captions & phone safe zone */
  {
    t: 'Phụ đề tự động — trong vùng an toàn, không bị nút che',
    sub: '',
    body: two(
      `<div style="display:flex;justify-content:center">` + phone({ w: 192, label: 'Phụ đề nằm TRONG khung xanh' }) + `</div>`,
      cards([
        { ic: '🗣️', t: 'Auto captions', d: 'Giọng nói → chữ, có bản dịch song ngữ. Free giới hạn lượt/tháng, hết lượt hoặc không giới hạn thì cần Pro.', c: 'blu' },
        { ic: '✏️', t: 'Sửa lại + kiểu chữ', d: 'Máy hay nghe sai tên riêng/thuật ngữ — đọc lại; cỡ chữ đủ lớn, viền tương phản, dòng ngắn.', c: 'grn' },
      ], 1),
      'l',
    ) + box('warn', 'Vùng đỏ là nơi UI TikTok/Reels/Shorts hay đè lên. Chữ tiêu đề/hook tự kéo tay thì luôn kiểm lại trong khung xanh trước khi xuất.'),
  },

  /* 9 — music ducking */
  {
    t: 'Nhạc nền ducking — hạ tự động khi có giọng nói',
    body: timeline({
      len: 30,
      tracks: [
        { id: 'A1', a: true, clips: [{ s: 0, e: 30, t: 'Giọng nói (A1)', c: 'grn' }] },
        { id: 'A2', a: true, clips: [{ s: 0, e: 30, t: 'Nhạc nền (A2)', c: 'vio', quiet: [[2, 11], [15, 27]] }] },
      ],
      marks: [{ s: 2, t: 'nói', c: 'amb' }, { s: 15, t: 'nói', c: 'amb' }],
    }) + box('tip', '<strong>Cách làm trong CapCut:</strong> chọn clip nhạc (A2) → bảng thuộc tính ④ → Audio → kéo Volume xuống ~−15…−20dB đúng đoạn có giọng (thêm keyframe ở đầu/cuối đoạn để lên/xuống mượt), hoặc kéo hẳn xuống rồi trả lại khi hết câu. CapCut không có nút "Duck" tự động một-chạm — làm bằng tay qua keyframe âm lượng.'),
  },

  /* 10 — effects/transitions dos & don'ts */
  {
    t: 'Hiệu ứng & chuyển cảnh — tiết chế',
    body: vs({
      no: { t: 'Người mới hay lạm dụng', items: [
        'Chuyển cảnh 3D xoay, lật trang ở MỌI lần cắt',
        'Hiệu ứng rung/zoom-nảy trên từng câu nói',
        'Mỗi đoạn một filter màu khác nhau',
        'Text animation bay/nảy trên toàn bộ chữ tiêu đề',
      ] },
      yes: { t: 'Dân dựng chuyên nghiệp', items: [
        'Mặc định KHÔNG chuyển cảnh — cắt thẳng (hard cut) là chuẩn',
        'Chỉ 1 kiểu chuyển cảnh nhẹ (fade/dip) ở điểm đổi chủ đề lớn',
        '1 filter/LUT xuyên suốt cả video cho đồng nhất',
        'Hiệu ứng dùng để NHẤN — không dùng để "cho đẹp"',
      ] },
    }),
  },

  /* 11 — basic color (Adjust) */
  {
    t: 'Màu cơ bản trong Adjust',
    body: cards([
      { ic: '☀️', t: 'Brightness', d: 'Sáng/tối tổng thể — sửa trước tiên nếu footage bị thiếu/dư sáng.', c: 'amb' },
      { ic: '◐', t: 'Contrast', d: 'Độ tương phản đen–trắng. Tăng nhẹ cho hình đỡ "bệt".', c: 'blu' },
      { ic: '🎨', t: 'Saturation', d: 'Độ rực màu. Tăng quá tay là dấu hiệu rõ nhất của "màu mới học".', c: 'red' },
      { ic: '🌡️', t: 'Temperature / Tint', d: 'Ngả vàng/xanh, ngả tím/lục — chỉnh về đúng ánh sáng thật của cảnh.', c: 'tea' },
      { ic: '🔆', t: 'Highlight / Shadow', d: 'Kéo lại vùng sáng cháy hoặc vùng tối mất chi tiết.', c: 'grn' },
      { ic: '🖼️', t: 'Filters có sẵn', d: 'Preset nhanh — dùng làm điểm xuất phát rồi chỉnh tay, đừng để nguyên 100%.', c: 'vio' },
    ], 3) + box('info', 'Đây là chỉnh màu MỘT LỚP bằng thanh trượt — đủ cho video ngắn. Grading nhiều lớp bằng node, theo dõi bằng scope (waveform/vectorscope) là chuyện của DaVinci Resolve — Chương 15.'),
  },

  /* 12 — bảng phím tắt đã kiểm */
  {
    t: 'Phím tắt đã kiểm trên Mac',
    body: two(
      table(['Thao tác', 'Phím'], [
        ['Tách clip tại playhead', '!⌘B'],
        ['Xoá phần bên trái playhead', '!Q'],
        ['Xoá phần bên phải playhead', '!W'],
        ['Xoá clip đang chọn', 'Delete'],
        ['Copy · Cut · Paste', '⌘C·⌘X·⌘V'],
        ['Undo · Redo', '⌘Z · ⌘⇧Z'],
        ['Chọn tất cả', '⌘A'],
      ], { sm: true }),
      table(['Thao tác', 'Phím'], [
        ['Zoom timeline vào/ra', '⌘= · ⌘−'],
        ['Zoom timeline bằng cuộn', '⌘ + cuộn'],
        ['Vừa khít timeline vào khung', '⇧Z'],
        ['Mở bảng tốc độ (Speed)', '⌘R'],
        ['Thêm điểm keyframe', '⌥K'],
        ['Nhập media', '⌘I'],
        ['Xuất video', '!⌘E'],
      ], { sm: true }),
    ) + box('warn', '<b>Q/W</b> xác nhận từ nhiều hướng dẫn cập nhật 2025–2026, không tách được ký tự đơn từ chính file cài — kiểm lại icon bàn phím trên thanh công cụ. Phần còn lại đối chiếu trực tiếp trong CapCut 8.4.0 cài trên máy này.'),
  },

  /* 13 — bảng thông số xuất */
  {
    t: 'Thông số xuất cho từng nền tảng',
    body: table(['Nền tảng', 'Khung hình', 'fps', 'Bitrate khuyến nghị', 'Codec/định dạng'], [
      ['TikTok · Reels · Shorts', '1080×1920 (9:16)', '30 (60 nếu chuyển động nhanh)', '8–15 Mbps', 'H.264 · MP4'],
      ['YouTube 1080p', '1920×1080 (16:9)', 'khớp máy quay', '!8 Mbps (12 nếu 48–60fps)', 'H.264 · MP4'],
      ['YouTube 4K', '3840×2160 (16:9)', 'khớp máy quay', '!35–45 Mbps (53–68 nếu 48–60fps)', 'H.264 · MP4'],
      ['Nội bộ / lưu gốc chất lượng cao', 'giữ nguyên timeline', 'khớp máy quay', 'Custom → kéo max', 'ProRes 422 (Mac)'],
    ], { sm: true }) + box('good', 'Cột YouTube lấy đúng từ trang khuyến nghị mã hoá chính thức (support.google.com/youtube). CapCut: Export → Bit rate → Custom để nhập tay; bật <b>Watermark: Remove</b> và bỏ đoạn <b>Outro</b> nếu không muốn dính logo CapCut.'),
  },

  /* 14 — quy trình 10 bước */
  {
    t: 'Quy trình 10 bước — dựng một video ngắn 60s từ Pocket 3',
    body: stepsRow([
      'Tạo project đúng tỉ lệ & fps',
      'Import, kéo B-roll lên V2',
      'Lượt thô: dựng theo kịch bản',
      'Lượt tinh: jump cut bằng Q/W',
      'Chèn B-roll, thêm keyframe zoom',
    ], 0) + stepsRow([
      'Auto captions, sửa lỗi chính tả',
      'Nhạc nền, ducking dưới giọng',
      'Adjust màu cơ bản 1 lần',
      'Xem lại full-screen, không tua',
      'Export đúng chuẩn, tắt watermark',
    ], 5),
  },

  /* 15 — thực hành */
  {
    t: 'Thực hành chương 12',
    body: cards([
      { ic: '🎬', t: '1. Project + tour', d: 'Tạo project khớp fps footage thật của bạn, gọi tên đúng cả 5 vùng giao diện.', c: 'blu' },
      { ic: '✂️', t: '2. Jump cut 1 talking head', d: 'Một đoạn ≥ 2 phút → cắt còn ≤ 60s bằng Q/W + main track magnet.', c: 'amb' },
      { ic: '🔤', t: '3. Phụ đề + nhạc', d: 'Auto captions, sửa lỗi, thêm nhạc nền ducking dưới giọng.', c: 'grn' },
      { ic: '📤', t: '4. Xuất đúng chuẩn', d: 'Xuất bản 9:16 cho TikTok/Reels/Shorts, không watermark, đặt tên file rõ.', c: 'red' },
    ], 2) + box('good', '<strong>Đạt khi:</strong> có 1 file .mp4 60s, phụ đề không lỗi chính tả rõ, nhạc nghe rõ giọng nói xuyên suốt, xuất đúng 1080×1920/30fps/H.264, không có watermark "Made with CapCut".'),
  },
]);
