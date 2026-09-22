/**
 * cr-05.mjs — Content Creator, Chương 5: Máy quay hoạt động thế nào.
 * Độ phân giải/tỉ lệ khung/fps · phơi sáng (khẩu độ/màn trập/ISO/ND) · cân bằng
 * trắng & lấy nét · codec/bitrate/bit depth/Log-HLG-HDR.
 *
 *   node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/cr-05.mjs
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/cr-05.mjs --out <dir>
 *
 * Nguồn số liệu chính (đầy đủ trong báo cáo bàn giao):
 *  - DJI Osmo Pocket 3: dji.com/osmo-pocket-3/specs, dji.com/osmo-pocket-3 (D-Log M
 *    10-bit, HLG 10-bit, khẩu f/2.0 cố định, bitrate tối đa 130 Mbps).
 *  - iPhone 16 Pro Max: support.apple.com/en-us/121032 (4K Dolby Vision
 *    24/25/30/60/100/120fps, ProRes, Log), support.apple.com/en-us/109041
 *    (ProRes nặng tới 30 lần HEVC, tốc độ ổ ngoài 220/440 MB/s).
 *  - Quy tắc 180° màn trập: studiobinder.com/blog/what-is-the-180-degree-shutter-rule,
 *    polarpro.com — 24fps→1/48(≈1/50) · 25fps→1/50 · 30fps→1/60 · 50fps→1/100.
 *  - HEVC vs H.264 cùng chất lượng: trac.ffmpeg.org/wiki/Encode/H.265 (x265 CRF 28
 *    ≈ x264 CRF 23 — dùng đúng cặp này khi đo thật bên dưới).
 *  - YouTube HDR: support.google.com/youtube/answer/7126552 (PQ/HLG, tự chuyển SDR).
 *  - Mọi số "đo thật" trên bars()/table() ở các slide 13–14 lấy từ ffmpeg/ffprobe
 *    chạy thật trên clip lavfi testsrc2 (xem báo cáo bàn giao) — KHÔNG phải số
 *    liệu chính thức của DJI/Apple, ghi rõ "đo thật" trong bài học đi kèm.
 */
import { S, cover, cards, box, steps, table, vs, flow, mindmap, kelvin, dof,
  exposureTriangle, shutterDemo, lumaScope, bars, aspect, kpis } from './_cr-chung.mjs';

export const deck = {
  key: 'cr-05',
  code: 'CR · CHƯƠNG 5',
  title: 'Máy quay hoạt động thế nào',
  sub: 'Content Creator · Chương 5',
};

export const slides = S([
  /* 1 — bìa */
  cover({
    t: 'Chương 5 — Máy quay hoạt động thế nào',
    sub: 'Độ phân giải · Phơi sáng · Cân bằng trắng & lấy nét · Codec, bitrate, Log/HDR',
    chap: 'CHƯƠNG 5',
  }),

  /* 2 — bản đồ chương */
  {
    t: 'Bản đồ chương',
    body: mindmap('CHƯƠNG 5', 'nguyên lý — Chương 6 mới vào menu cụ thể', [
      { t: '📐 Độ phân giải & khung hình', d: 'Pixel, 4K/1080p, tỉ lệ, fps, điện 50Hz ở VN', c: 'red' },
      { t: '☀️ Phơi sáng', d: 'Khẩu độ · màn trập · ISO · kính lọc ND', c: 'ora' },
      { t: '🎨 Cân bằng trắng & lấy nét', d: 'Thang Kelvin, khoá WB, AF/MF, độ sâu trường ảnh', c: 'amb' },
      { t: '💾 Codec & bitrate', d: 'H.264 · HEVC · ProRes, công thức GB/phút', c: 'tea' },
      { t: '🌈 Bit depth & Log', d: '8-bit vs 10-bit, D-Log M, Apple Log, HDR', c: 'blu' },
      { t: '🎯 Áp dụng thật', d: 'Pocket 3 & iPhone 16 Pro Max — cài đặt cụ thể ở Chương 6', c: 'vio' },
    ]),
  },

  /* 3 — độ phân giải & tỉ lệ khung hình */
  {
    t: 'Độ phân giải & tỉ lệ khung hình',
    body: kpis([
      { v: '2,1 triệu', l: 'điểm ảnh — 1080p (1920×1080)', c: 'blu' },
      { v: '8,3 triệu', l: 'điểm ảnh — 4K (3840×2160), gấp 4×', c: 'red' },
    ]) + `<p class="c-note" style="text-align:center;margin:10px 0">4× điểm ảnh cho phép cắt/phóng (crop) hoặc ổn định hình trong lúc dựng mà vẫn xuất ra 1080p nét — lý do hay quay 4K dù xuất 1080p.</p>` + aspect(),
  },

  /* 4 — frame rate */
  {
    t: 'Frame rate — chọn theo việc, không theo thói quen',
    body: flow([
      { e: '🎞', t: '24 fps', d: 'Chuẩn điện ảnh — cảm giác "phim"', c: 'vio' },
      { e: '🇻🇳', t: '25 fps', d: 'Chuẩn PAL — mặc định khoá này ở VN', c: 'grn' },
      { e: '🌐', t: '30 fps', d: 'Phổ biến trên mạng — lệch nhẹ điện 50Hz', c: 'amb' },
    ]) + flow([
      { e: '💡', t: '50 fps', d: 'Mượt hơn 25, vẫn khớp điện VN', c: 'tea' },
      { e: '⚡', t: '60 fps', d: 'Chuyển động nhanh, thể thao', c: 'blu' },
      { e: '🐢', t: '120 fps+', d: 'Quay để PHÁT chậm lại (slow motion)', c: 'red' },
    ]) + box('warn', 'Slow motion = quay ở fps CAO rồi phát lại ở fps THƯỜNG (vd quay 120fps, phát 25fps ⇒ chậm 4,8 lần). Đang dùng hai máy cùng lúc? Đặt CÙNG một fps — trộn fps là lý do clip giật khi ghép.'),
  },

  /* 5 — điện VN 50Hz */
  {
    t: 'Điện Việt Nam chạy 50Hz — con số quan trọng nhất chương',
    body: vs({
      no: { t: 'Lệch nhịp điện', items: [
        'Quay 30fps, màn trập 1/60 dưới đèn LED/huỳnh quang',
        'Đèn thật ra nhấp nháy 100 lần/giây (2× tần số 50Hz)',
        'Màn trập không khớp nhịp đó ⇒ sọc tối chạy ngang khung hình',
      ] },
      yes: { t: 'Khớp nhịp điện', items: [
        'Quay 25fps (màn trập 1/50) hoặc 50fps (màn trập 1/100)',
        'Màn trập là BỘI SỐ của nhịp nhấp nháy 100 lần/giây',
        'Hết sọc — đây là lý do khoá này mặc định 25/50fps',
      ] },
    }) + box('info', 'Mỹ và nhiều nước dùng điện 60Hz nên máy bán ở đó mặc định 30/60fps — công thức bạn thấy trên YouTube quốc tế thường SAI cho phòng học ở Việt Nam.'),
  },

  /* 6 — tam giác phơi sáng */
  {
    t: 'Tam giác phơi sáng — ba núm vặn, một mục tiêu',
    body: exposureTriangle(),
  },

  /* 7 — khẩu độ & DOF */
  {
    t: 'Khẩu độ (f-number) & độ sâu trường ảnh',
    body: dof([
      { t: 'f/1.8–2.0 (iPhone · Pocket 3) — nền mờ, nổi chủ thể', blur: 7 },
      { t: 'f/8 (máy chỉnh được khẩu) — nền nét, dễ rối mắt', blur: 0 },
    ]),
  },

  /* 8 — màn trập & 180° */
  {
    t: 'Màn trập & quy tắc 180°',
    body: shutterDemo() + box('warn', 'ĐỪNG nhầm với "quy tắc 180°" ở Chương 7 — đó là quy tắc dựng cảnh (trục máy quay), tên trùng nhau nhưng hai chuyện khác hẳn nhau.'),
  },

  /* 9 — ISO & ND filter */
  {
    t: 'ISO, nhiễu, và vì sao cần kính lọc ND',
    body: cards([
      { ic: '🌙', t: 'ISO thấp (100–400)', d: 'Hình sạch, cần đủ sáng. Mặc định ban ngày.', c: 'grn' },
      { ic: '🔆', t: 'ISO cao (1600+)', d: 'Sáng hơn trong tối, đổi lại nhiễu hạt (grain/noise).', c: 'amb' },
      { ic: '🔒', t: 'Khẩu cố định', d: 'Pocket 3 f/2.0, iPhone ống chính f/1.78 — KHÔNG chỉnh được khẩu để giảm sáng.', c: 'red' },
      { ic: '🕶️', t: 'Kính lọc ND', d: 'Neutral Density — chặn bớt sáng vào ống kính mà KHÔNG đổi màu, giữ được màn trập 1/50 giữa trưa nắng.', c: 'blu' },
    ], 2),
  },

  /* 10 — công cụ đo sáng */
  {
    t: 'Đọc sáng bằng số, không đoán bằng mắt',
    body: `<div style="display:flex;gap:18px;justify-content:center">${
      lumaScope({ kind: 'under', w: 340, label: 'Thiếu sáng — dồn về đáy' }) +
      lumaScope({ kind: 'ok', w: 340, label: 'Đủ sáng — trải đều, không chạm hai mép' }) +
      lumaScope({ kind: 'over', w: 340, label: 'Cháy sáng — dồn lên đỉnh, mất chi tiết' })
    }</div>` + box('info', 'Đây là dạng sóng (waveform) — chuẩn đo sáng của dân làm phim. Zebra (kẻ sọc chéo vùng cháy) và false color (tô màu theo mức sáng) làm cùng việc bằng cách khác; Pocket 3 và app Blackmagic Camera (Chương 6) đều có các lớp phủ này.'),
  },

  /* 11 — cân bằng trắng */
  {
    t: 'Cân bằng trắng — thang Kelvin',
    body: kelvin([
      { k: 1900, t: 'Nến', below: false },
      { k: 3200, t: 'Đèn sợi đốt / hoàng hôn', below: true },
      { k: 5000, t: 'LED trung tính', below: false },
      { k: 5600, t: 'Ánh nắng ban ngày', below: true },
      { k: 7000, t: 'Trời nhiều mây', below: false },
      { k: 9000, t: 'Bóng râm, trời trong', below: true },
    ]) + `<p class="c-note" style="text-align:center;margin-top:10px">Số Kelvin CÀNG THẤP càng ngả cam/vàng; CÀNG CAO càng ngả xanh. Auto White Balance tự dò lại mỗi vài giây — khoá WB (Chương 6) để màu da không nhảy giữa các đoạn cắt.</p>`,
  },

  /* 12 — lấy nét */
  {
    t: 'Lấy nét: tự động, khoá, và tay',
    body: cards([
      { ic: '🎯', t: 'AF theo chủ thể', d: 'Máy tự dò mặt/vật và bám nét khi chủ thể di chuyển. Mặc định hợp lý cho hầu hết cảnh.', c: 'grn' },
      { ic: '🔒', t: 'Khoá nét (AF/AE Lock)', d: 'Giữ nguyên điểm nét đã chọn dù đổi khung hình hay có người đi ngang qua ống kính.', c: 'amb' },
      { ic: '✋', t: 'Lấy nét tay (MF)', d: 'Chủ động 100%, không bị "AF nhảy" giữa cảnh — cần luyện ước lượng khoảng cách.', c: 'blu' },
    ], 3),
  },

  /* 13 — codec: đo thật */
  {
    t: 'Container & codec — số đo thật bằng ffmpeg',
    body: table(
      ['Codec (1080p25, cùng 6 giây thử)', 'Dung lượng', 'Bitrate đo được', 'Đặc điểm'],
      [
        ['H.264 (CRF 23)', '4,27 MB', '≈5,7 Mbps', 'Long-GOP — nhẹ, phổ biến, phát được mọi nơi'],
        ['HEVC/H.265 (CRF 28 ≈ chất lượng H.264 CRF 23)', '!3,37 MB', '≈4,5 Mbps', '+Nhẹ hơn H.264 ~21% ở CÙNG chất lượng'],
        ['ProRes 422 HQ (10-bit, intra-frame)', '-48,58 MB', '≈64,8 Mbps', 'Mọi khung hình trọn vẹn → dựng mượt, file nặng ~11–14×'],
      ],
    ) + box('warn', 'Bẫy đo: CRF của hai codec KHÔNG dùng chung thang. Đặt cùng số "CRF 20" cho cả hai, HEVC lại ra file TO hơn H.264 29% trong phép đo của tôi — phải khớp đúng cặp CRF tương đương (23↔28, theo FFmpeg) mới so sánh công bằng.'),
  },

  /* 14 — bitrate & bit depth: đo thật */
  {
    t: 'Bitrate & bit depth — đo thật bằng ffmpeg',
    body: `<p class="c-note" style="margin:0 0 4px"><b style="color:#fff">Bitrate → dung lượng (Pocket 3, trần công bố 130 Mbps ở 4K, phóng ra 1 phút)</b></p>` +
      bars([
        { l: 'Lý thuyết: 130 × 60 ÷ 8', v: 975, txt: '975 MB/phút', c: 'amb' },
        { l: 'Đo thật (ép trần 130Mbps, VBR)', v: 662, txt: '662 MB/phút (68%)', c: 'grn' },
      ], { lw: 340 }) +
      `<p class="c-note" style="margin:14px 0 4px"><b style="color:#fff">8-bit vs 10-bit — cùng HEVC, cùng CRF 28, 1080p25, 6 giây</b></p>` +
      bars([
        { l: '8-bit (yuv420p)', v: 3.37, txt: '3,37 MB', c: 'blu' },
        { l: '10-bit (yuv420p10le)', v: 3.53, txt: '3,53 MB (+4,7%)', c: 'vio' },
      ], { lw: 340, max: 4 }),
  },

  /* 15 — Log/HLG/Normal/HDR */
  {
    t: 'Normal · HLG · Log — và HDR khi đăng lên mạng',
    body: table(
      ['Chế độ màu', 'Nhìn ngay khi chưa chỉnh', 'Dải sáng (dynamic range)', 'Khi nào dùng'],
      [
        ['Normal / SDR (Rec.709)', '+Đẹp ngay, đăng thẳng được', 'Chuẩn', 'Mặc định — không định chỉnh màu sau'],
        ['HLG (10-bit)', '+Tạm ổn trên màn hình hỗ trợ HDR', 'Rộng hơn Normal', 'Muốn HDR mà không chỉnh màu sâu'],
        ['Log — D-Log M / Apple Log (10-bit)', '-Xám, bệt màu — PHẢI chỉnh màu', 'Rộng nhất', 'Chỉ khi CHẮC CHẮN sẽ chỉnh màu (Chương 15)'],
      ],
    ) + box('warn', 'YouTube tự chuyển HDR (PQ/HLG) sang SDR cho người xem không có màn hình HDR — nhưng chính YouTube ghi họ vẫn đang "cải thiện" bước tự chuyển này. Quay Dolby Vision trên iPhone rồi ghép với clip SDR của Pocket 3 mà không kiểm lại là mất công bằng màu — Chương 6 chỉ đúng công tắc, Chương 21 dạy xuất file đúng chuẩn khi đăng.'),
  },

  /* 16 — bảng tra nhanh */
  {
    t: 'Bảng tra nhanh cả chương',
    body: table(
      ['Bạn muốn', 'Chỉnh gì', 'Giá trị gợi ý (VN, 50Hz)'],
      [
        ['Quay chuẩn, không lỗi nhấp nháy', 'FPS · màn trập', '25fps · 1/50  (hoặc 50fps · 1/100)'],
        ['Xoá phông, nổi chủ thể', 'Khẩu độ (nếu chỉnh được)', 'f/1.8–f/2.0, đứng gần chủ thể, xa hậu cảnh'],
        ['Quay ngoài nắng mà vẫn giữ 1/50', 'Kính lọc ND', 'ND8–ND64 tuỳ độ sáng — máy khẩu cố định BẮT BUỘC cần'],
        ['Màu da không nhảy giữa các cảnh', 'Cân bằng trắng', 'Khoá WB theo Kelvin của nguồn sáng chính'],
        ['File nhẹ, đăng nhanh', 'Codec · màu', 'H.264/HEVC · Normal — KHÔNG quay Log'],
        ['Sẽ chỉnh màu kỹ sau', 'Codec · màu · bit depth', 'D-Log M / Apple Log · 10-bit — nối sang Chương 15'],
      ],
    ),
  },

  /* 17 — thực hành */
  {
    t: '🎬 Thực hành',
    body: steps([
      ['Đặt máy 25fps, tự tìm và đặt màn trập 1/50', 'Quay thử 10 giây dưới đèn trong nhà, xem có còn sọc không.'],
      ['Quay 3 clip cùng một cảnh: ISO 100, ISO 800, ISO 3200', 'So nhiễu hạt trên màn hình lớn (Mac/iPad), không phải màn hình máy quay.'],
      ['Đổi Kelvin tay từ 3200K sang 7000K trên cùng một khung hình', 'Ghi lại cảm giác ngả màu cam ⇄ xanh.'],
      ['Quay 5 giây bằng Normal và 5 giây bằng Log/D-Log M (nếu máy hỗ trợ)', 'Xem thử cảnh Log — thừa nhận nó XẤU khi chưa chỉnh, đó là bình thường.'],
      ['Dùng ffprobe đọc lại chính file vừa quay', '&#96;ffprobe -select_streams v:0 -show_entries stream=codec_name,pix_fmt,r_frame_rate,bit_rate canh-quay.mp4&#96;'],
    ]) + box('good', '<b>Đạt khi:</b> gọi tên được đúng 4 con số trên màn hình máy quay (fps, màn trập, ISO, Kelvin) mà không cần mở lại bài học, và giải thích được vì sao cảnh Log trông xám trước khi chỉnh màu.'),
  },
]);
