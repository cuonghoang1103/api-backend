/**
 * cr-21.mjs — Content Creator, Chương 21: Vlog.
 * Vlog là kể chuyện (kiểu vlog, Casey Neistat) · quay vlog bằng Pocket 3 (selfie,
 * gimbal, quay đêm, âm thanh môi trường) · dựng vlog (cấu trúc, montage theo
 * nhạc, kỹ thuật nối mạch) · vlog học tập & thương hiệu (build in public).
 *
 *   node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/cr-21.mjs
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/cr-21.mjs --out <dir>
 *
 * Nguồn số liệu chính (đầy đủ trong báo cáo bàn giao):
 *  - DJI Osmo Pocket 3 — độ phân giải/fps Low-Light Video (CHỈ 4K hoặc 1080p,
 *    CHỈ 24/25/30fps — khác Normal Video có tới 48/50/60fps): dji.com/osmo-pocket-3/specs
 *    (bảng "Video Resolution", đọc 09/2026).
 *  - DJI Osmo Pocket 3 User Manual v1.0 (bản cập nhật 2025-08-26, dl.djicdn.com)
 *    — ba chế độ gimbal Follow/Tilt Locked/FPV, nguyên văn: Follow "is suitable
 *    for most scenarios, including vlogs and selfie videos"; Tilt Locked
 *    "suitable for scenarios such as where the camera position switches
 *    between high and low"; FPV "suitable for scenarios where the camera
 *    position is continuously rotating and there is less stability". Cũng từ
 *    tài liệu này: FT (Selfie) tự nhận diện + xoay máy về mặt bạn; Gimbal
 *    Startup Direction Forward/Backward; Selfie Flip (lật ảnh như gương);
 *    Screen Rotate & Capture (xoay màn hình là bấm quay ngay); Directional
 *    Audio Front/Front and Back/All (CHỈ áp dụng mic tích hợp, không áp dụng
 *    khi cắm mic ngoài); Low-Light PRO mode KHÔNG có Focus Mode/Colors riêng;
 *    ActiveTrack/Smart Gimbal Mode (Face Auto-Detect) bị loại trừ khỏi
 *    Low-Light — khớp với loại trừ đã kiểm ở Ch10 (dji.com/osmo-pocket-3/faq).
 *  - Cảm biến 1 inch, dải nhiệt 0–40°C: đã kiểm ở Ch5–6 — dùng lại nguyên số,
 *    không đo lại ở chương này.
 *  - Casey Neistat — vlog hằng ngày bắt đầu 25/3/2015 (sinh nhật 34 tuổi),
 *    ngừng chuỗi hằng ngày 19/11/2016; phong cách dựng: cảnh thiết lập dí dỏm,
 *    chữ viết tay, cắt dựng táo bạo, nhạc có "không khí": Tubefilter — "20
 *    years of YouTube: In 2015, Casey Neistat revolutionized the vlog"
 *    (tubefilter.com, đọc 09/2026; trả 403 khi curl không trình duyệt — HTTP
 *    thật của trang là 200, chặn bot bằng Cloudflare).
 *  - Điều 32 Bộ luật Dân sự số 91/2015/QH13 (quyền cá nhân đối với hình ảnh):
 *    ĐÃ kiểm và dẫn nguồn đầy đủ ở Chương 10.4 (vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=95942)
 *    — dùng lại, không đo lại ở đây.
 *  - Timelapse/Hyperlapse/Motionlapse, speed ramp, J-cut/L-cut, khớp màu
 *    Pocket 3 ↔ iPhone: đã dạy đủ ở Ch17.3/14.2/15.4 — chỉ nối mạch.
 */
import { S, cover, cards, box, steps, table, flow, hud, mindmap, storyboard, timeline, note } from './_cr-chung.mjs';

// Hình đứng một mình (SVG/HUD cố định bề ngang) thì dồn trái, bỏ trống nửa phải → căn giữa.
const giua = (h) => `<div style="display:flex;justify-content:center">${h}</div>`;

export const deck = {
  key: 'cr-21',
  code: 'CR · CHƯƠNG 21',
  title: 'Vlog',
  sub: 'Content Creator · Chương 21',
};

export const slides = S([
  /* 1 — bìa */
  cover({
    t: 'Chương 21 — Vlog',
    sub: 'Vlog là kể chuyện · quay bằng Pocket 3 · dựng vlog · vlog học tập & thương hiệu',
    chap: 'CHƯƠNG 21',
  }),

  /* 2 — bản đồ chương */
  {
    t: 'Bản đồ chương',
    body: mindmap('CHƯƠNG 21', 'Một ngày, kể lại cho người khác xem', [
      { t: 'Vlog là kể chuyện', d: 'Muốn gì – vướng gì – thay đổi gì; các kiểu vlog; Casey Neistat', c: 'red' },
      { t: 'Quay bằng Pocket 3', d: 'Selfie, gimbal Follow, quay đêm, âm thanh môi trường', c: 'ora' },
      { t: 'Dựng vlog', d: 'Cold open → nhịp → kết, montage theo nhạc, J/L-cut, màu nhất quán', c: 'amb' },
      { t: 'Học tập & thương hiệu', d: 'Study with me, build in public, dẫn về cuongthai.com', c: 'grn' },
      { t: 'Nối mạch', d: 'Timelapse (Ch17), quyền hình ảnh (Ch10), hook & cấu trúc (Ch3)', c: 'vio' },
    ]),
  },

  /* 3 — storyboard một ngày vlog */
  {
    t: 'Một ngày vlog — sáu khung hình',
    body: storyboard([
      { s: '1', t: 'Cold open', d: 'Khoảnh khắc hay nhất trong ngày — nhử trước, chưa giải thích', kind: 'person', size: 'CU' },
      { s: '2', t: 'Sáng — chuẩn bị', d: 'Cảnh thiết lập ngày mới', kind: 'person', size: 'MS' },
      { s: '3', t: 'Trên đường', d: 'Selfie, gimbal Follow, vừa đi vừa nói', kind: 'person', size: 'WS' },
      { s: '4', t: 'Giờ học / làm việc', d: 'Toàn cảnh bối cảnh chính trong ngày', kind: 'place' },
      { s: '5', t: 'Chi tiết đời thường', d: 'B-roll môi trường — tay gõ phím, ly cà phê', kind: 'hands' },
      { s: '6', t: 'Kết', d: 'Một câu suy ngẫm — trả lời cold open đã mở', kind: 'person', size: 'MCU' },
    ], { cols: 3, w: 250 }),
  },

  /* 4 — 4 kiểu vlog */
  {
    t: 'Bốn kiểu vlog cho kênh của bạn',
    body: cards([
      { ic: '📅', t: 'Hằng ngày (daily)', d: 'Một ngày, kế hoạch lỏng — mở bằng khoảnh khắc hay nhất. Casey Neistat phổ biến kiểu này từ 2015.', c: 'red' },
      { ic: '🧳', t: 'Du lịch / sự kiện', d: 'Có điểm đầu–cuối tự nhiên sẵn — chuyến đi, hội thảo, ngày thi đấu.', c: 'ora' },
      { ic: '📚', t: 'Học tập', d: '"Một ngày của SV FPTU", study with me — đúng khán giả khoá này đang nhắm tới.', c: 'amb' },
      { ic: '🛠️', t: 'Build in public', d: 'Quay quá trình làm cuongthai.com — tiến độ thật, kể cả lỗi và cách sửa.', c: 'grn' },
    ], 4),
  },

  /* 5 — HUD cài đặt Pocket 3 cho vlog */
  {
    t: 'Cài đặt Pocket 3 cho một buổi vlog',
    body: giua(hud({
      w: 620, h: 348,
      top: [{ k: 'FT (SELFIE)', v: 'BẬT', hi: true }, { k: 'GIMBAL MODE', v: 'FOLLOW' }],
      bot: [{ k: 'ĐỊNH HƯỚNG KHỞI ĐỘNG', v: 'BACKWARD' }, { k: 'DIRECTIONAL AUDIO', v: 'ALL' }, { k: 'ĐỘ PHÂN GIẢI', v: '4K·25 · ngang 16:9' }],
    })) + `<p class="c-note" style="text-align:center;margin-top:8px">Backward = máy quay xoay về phía bạn khi bật nguồn; Directional Audio "All" chỉ có tác dụng với mic TÍCH HỢP (nối Bài 21.2).</p>`,
  },

  /* 6 — ba chế độ gimbal cho vlog */
  {
    t: 'Ba chế độ gimbal — chọn đúng cho vlog',
    body: table(
      ['Chế độ', 'Trục hoạt động', 'DJI khuyến nghị dùng khi'],
      [
        ['Follow', 'Pan + tilt theo tay cầm, roll giữ ngang', '+Hầu hết cảnh — chính DJI gọi tên "vlog và video selfie"'],
        ['Tilt Locked', 'Chỉ pan theo tay, tilt KHOÁ cứng, roll giữ ngang', 'Cảnh đổi độ cao máy — ngồi xuống/đứng lên, lên/xuống cầu thang'],
        ['FPV', 'Xoay tự do theo mọi hướng tay cầm', 'Chuyển động xoay liên tục, chấp nhận ít ổn định hơn'],
      ],
    ),
  },

  /* 7 — quay đêm, Low-Light Video */
  {
    t: 'Quay đêm — Low-Light Video',
    body: table(
      ['Yếu tố', 'Low-Light Video — đã kiểm 09/2026'],
      [
        ['Cảm biến', '1 inch CMOS (đã kiểm Ch5–6) — không đo lại ở đây'],
        ['Cách hoạt động', 'Máy tự động chỉnh thông số phơi sáng để cải thiện chất lượng ảnh nơi thiếu sáng'],
        ['Độ phân giải · fps', '!CHỈ 4K hoặc 1080p, CHỈ 24/25/30fps — không 2.7K, không 48/50/60fps, không khung vuông/dọc'],
        ['ActiveTrack / Face Auto-Detect', '-KHÔNG hoạt động — tự canh khung, đừng giao cho máy'],
        ['Bảng PRO có gì', 'Exposure, White Balance, Image Adjustment, Glamour Effects, Audio — KHÔNG có Focus Mode hay Colors (D-Log M/HLG) riêng'],
      ],
    ),
  },

  /* 8 — kiểu shot & chuyển cảnh cho vlog */
  {
    t: 'Kiểu shot & chuyển cảnh trong vlog',
    body: cards([
      { ic: '🤳', t: 'Selfie tay cầm', d: 'FT (Selfie) bật, Gimbal Startup Direction = Backward quay máy về bạn; Selfie Flip lật ảnh như gương.', c: 'red' },
      { ic: '👀', t: 'POV', d: 'Máy ngang tầm mắt hoặc tầm tay, không lộ mặt — người xem "đứng vào giày" bạn.', c: 'ora' },
      { ic: '🏙️', t: 'Cảnh thiết lập', d: 'Toàn cảnh mở đầu mỗi nhịp mới — nối Ch7.1 (WS/EWS).', c: 'amb' },
      { ic: '🌤️', t: 'B-roll môi trường', d: 'Directional Audio → All để thu cả tiếng môi trường — nối Ch10.2.', c: 'grn' },
      { ic: '⏱️', t: 'Chuyển cảnh nén thời gian', d: 'Timelapse/Hyperlapse/Motionlapse đã dạy đủ ở Ch17.3 — dùng lại, không học mới.', c: 'tea' },
    ], 3),
  },

  /* 9 — cấu trúc dựng vlog (2 hàng flow) */
  {
    t: 'Cấu trúc dựng: cold open → tiêu đề → nhịp → kết',
    body: flow([
      { e: '🎬', t: 'Cold open', d: 'Khoảnh khắc hay nhất — nhử trước (nối Ch3.1 hook)', c: 'red' },
      { e: '🔤', t: 'Tiêu đề', d: 'Card tên ngày/tập, 1–2 giây', c: 'ora' },
      { e: '🧭', t: 'Nhịp — bối cảnh', d: 'Trả lời cold open: chuyện gì, vì sao', c: 'amb' },
    ]) + flow([
      { e: '🎵', t: 'Nhịp — montage', d: 'Cảnh đời thường cắt theo nhạc, không lời', c: 'grn' },
      { e: '💬', t: 'Nhịp — cao trào', d: 'Khó khăn/khoảnh khắc chính trong ngày', c: 'tea' },
      { e: '🏁', t: 'Kết + CTA', d: 'Một câu suy ngẫm, một lời mời theo dõi', c: 'blu' },
    ]),
  },

  /* 10 — montage theo nhạc */
  {
    t: 'Montage theo nhạc',
    body: timeline({
      len: 20,
      tracks: [
        { id: 'V1', clips: [
          { s: 0, e: 4, c: 'red', t: 'Cảnh 1' },
          { s: 4, e: 8, c: 'ora', t: 'Cảnh 2' },
          { s: 8, e: 13, c: 'amb', t: 'Cảnh 3' },
          { s: 13, e: 20, c: 'grn', t: 'Cảnh 4' },
        ] },
        { id: 'NHẠC', a: true, clips: [{ s: 0, e: 20, c: 'blu', t: 'Nhạc nền' }] },
      ],
      marks: [{ s: 4, c: 'amb' }, { s: 8, c: 'amb' }, { s: 13, c: 'amb' }],
      w: 1100,
    }) + note('Cắt đúng vào marker phách — đánh dấu bằng ⌘J trên clip nhạc trong CapCut, đã dạy ở Bài 12.3.'),
  },

  /* 11 — dựng tự nhiên, nối mạch */
  {
    t: 'Dựng vlog tự nhiên — dùng lại kỹ thuật đã học',
    body: table(
      ['Kỹ thuật', 'Vì sao hợp vlog', 'Đã dạy ở đâu'],
      [
        ['J-cut / L-cut', 'Lồng tiếng nối mạch qua cảnh sau/trước — bớt cảm giác "cắt dán"', 'Bài 14.2'],
        ['Speed ramp', 'Hụp chậm đúng khoảnh khắc đáng nhớ giữa một montage', 'Bài 17.3'],
        ['Màu nhất quán', 'Khớp Pocket 3 ↔ iPhone trong cùng một ngày quay', 'Bài 15.4'],
      ],
    ) + box('tip', 'Ba kỹ thuật này đã có bài dạy riêng — bài 21.3 chỉ nói ÁP DỤNG vào vlog, không dạy lại thao tác.'),
  },

  /* 12 — build in public: quy trình quay */
  {
    t: 'Build in public — quay tiến độ cuongthai.com',
    body: steps([
      ['Chọn MỘT mốc thật', 'Deploy một tính năng mới, sửa một lỗi lớn — không "làm web nói chung"'],
      ['Quay trước — trong — sau', 'Nối checklist 3 cột đã học ở Bài 10.4'],
      ['Lồng tiếng giải thích quyết định thật', 'Vì sao chọn cách này, chỗ nào từng sai — không chỉ khoe kết quả đẹp'],
      ['Gắn CTA đúng trang vừa làm', 'Dẫn thẳng về tính năng/bài viết trên cuongthai.com, không phải trang chủ chung chung'],
    ]),
  },

  /* 13 — vòng lặp thương hiệu đều đặn */
  {
    t: 'Vòng lặp thương hiệu đều đặn',
    body: flow([
      { e: '🎥', t: 'Quay', d: 'Build in public + đời thường xen kẽ', c: 'red' },
      { e: '✂️', t: 'Dựng', d: 'Cold open → nhịp → kết', c: 'ora' },
      { e: '🚀', t: 'Đăng kèm link', d: 'Mô tả/bình luận ghim về cuongthai.com', c: 'amb' },
      { e: '📊', t: 'Đo', d: 'Lượt về web từ video — nối Ch26', c: 'grn' },
      { e: '🔁', t: 'Lặp lại', d: 'Tuần sau — đều đặn hơn số lượng', c: 'blu' },
    ]),
  },

  /* 14 — bảng tra nhanh cả chương */
  {
    t: 'Bảng tra nhanh — Chương 21',
    body: table(
      ['Chủ đề', 'Chốt lại', 'Nguồn / ghi chú'],
      [
        ['Gimbal cho vlog', 'Follow — DJI nêu đúng tên "vlog và video selfie"; Tilt Locked cho đổi độ cao; FPV cho xoay liên tục', 'DJI User Manual v1.0'],
        ['Quay đêm', 'Low-Light Video: CHỈ 4K/1080p, CHỈ 24/25/30fps, không ActiveTrack', 'dji.com/osmo-pocket-3/specs'],
        ['Selfie', 'FT (Selfie) tự nhận diện + xoay máy; Selfie Flip lật ảnh như gương', 'DJI User Manual v1.0'],
        ['Âm thanh môi trường', 'Directional Audio → All — chỉ áp dụng mic TÍCH HỢP, mất tác dụng khi cắm mic ngoài', 'DJI User Manual v1.0'],
        ['Chuyển cảnh nén thời gian', 'Timelapse/Hyperlapse/Motionlapse — không dạy lại', 'Bài 17.3'],
        ['Quay nơi công cộng', 'Điều 32 BLDS 2015 — không dạy lại', 'Bài 10.4'],
      ],
      { sm: true },
    ),
  },

  /* 15 — thực hành */
  {
    t: 'Thực hành',
    body: steps([
      ['Quay một "ngày vlog" theo storyboard 6 khung — cold open, sáng, trên đường, giờ học, chi tiết, kết', 'Dùng gimbal Follow + FT (Selfie) khi tự quay'],
      ['Dựng theo cấu trúc cold open → tiêu đề → 3 nhịp → kết, cắt một đoạn theo nhạc', 'Đánh dấu phách bằng ⌘J (Bài 12.3) rồi cắt đúng marker'],
      ['Lồng J-cut/L-cut cho ít nhất một chỗ nối cảnh, và khớp màu nếu quay cả hai máy', 'Nối Bài 14.2 và Bài 15.4'],
      ['Đăng kèm một CTA dẫn về đúng MỘT trang trên cuongthai.com', 'Không phải trang chủ chung chung'],
    ]),
  },
]);
