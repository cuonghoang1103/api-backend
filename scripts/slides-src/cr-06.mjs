/**
 * cr-06.mjs — Content Creator, Chương 6: Cài đặt đồ nghề của bạn.
 * DJI Osmo Pocket 3 · iPhone 16 Pro Max · iPad Pro M5 · Mac M1 Max · máy Linux
 * ở nhà · quản lý thẻ nhớ/pin/dung lượng.
 *
 *   node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/cr-06.mjs
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/cr-06.mjs --out <dir>
 *
 * Nguồn số liệu chính: DJI Osmo Pocket 3 — trang specs (dji.com/osmo-pocket-3/specs)
 * + User Manual v1.0 (dl.djicdn.com); Apple — support.apple.com (121032 tech specs,
 * 109041 ProRes, iphc1827d32f cài đặt quay video, adjust-hdr-camera-settings, mic-3/faq
 * qua dji.com); Blackmagic Camera app — blackmagicdesign.com; DaVinci Resolve trên
 * Linux — wiki.archlinux.org/title/DaVinci_Resolve (bảng hỗ trợ MP4/H.264/H.265/AAC).
 * GB/phút Pocket 3 đo THẬT bằng ffmpeg (CBR 130 Mbps, khớp trần DJI công bố — xem báo
 * cáo bàn giao). Số GB/phút của iPhone là ƯỚC LƯỢNG cộng đồng (Apple không công bố
 * bitrate cố định) — ghi rõ trong bài học, không trình bày như số chính thức.
 */
import { S, cover, cards, table, mindmap, flow, hud, ui, fov, bars, steps } from './_cr-chung.mjs';

export const deck = {
  key: 'cr-06',
  code: 'CR · CHƯƠNG 6',
  title: 'Cài đặt đồ nghề của bạn',
  sub: 'Content Creator · Chương 6',
};

export const slides = S([
  /* 1 — bìa */
  cover({
    t: 'Chương 6 — Cài đặt đồ nghề của bạn',
    sub: 'DJI Osmo Pocket 3 · iPhone 16 Pro Max · iPad Pro M5 · Mac M1 Max · máy Linux ở nhà',
    chap: 'CHƯƠNG 6',
  }),

  /* 2 — bản đồ chương */
  {
    t: 'Bản đồ chương',
    body: mindmap('CHƯƠNG 6', '5 máy + thẻ nhớ', [
      { t: 'DJI Osmo Pocket 3', d: 'Vlog, B-roll, gimbal 3 trục', c: 'red' },
      { t: 'iPhone 16 Pro Max', d: 'Máy A/B, ProRes Log, webcam Mac', c: 'ora' },
      { t: 'iPad Pro M5', d: 'Storyboard, teleprompter, dựng', c: 'amb' },
      { t: 'Mac M1 Max', d: 'Trạm dựng chính', c: 'blu' },
      { t: 'Máy Linux ở nhà', d: 'Sao lưu, chuyển mã, Whisper', c: 'tea' },
      { t: 'Thẻ nhớ · pin · nhiệt', d: 'Không tràn, không hết pin giữa buổi', c: 'vio' },
    ]),
  },

  /* 3 — vai trò từng máy */
  {
    t: 'Vai trò từng máy trong đồ nghề của bạn',
    body: cards([
      { ic: '📷', t: 'Osmo Pocket 3', d: 'Gimbal 3 trục — vlog, cảnh ngoài đường, B-roll, talking head gọn nhẹ.', c: 'red' },
      { ic: '📱', t: 'iPhone 16 Pro Max', d: 'Máy A/B — quay 4K/ProRes Log, ảnh bìa 48MP, webcam cho Mac.', c: 'ora' },
      { ic: '✏️', t: 'iPad Pro M5', d: 'Vẽ storyboard bằng Pencil, teleprompter, màn hình phụ, dựng nhanh.', c: 'amb' },
      { ic: '💻', t: 'Mac M1 Max', d: 'Trạm dựng chính — DaVinci Resolve, CapCut, Final Cut Pro.', c: 'blu' },
      { ic: '🐧', t: 'Máy Linux ở nhà', d: 'Sao lưu bản 2, chuyển mã bằng ffmpeg, Whisper làm phụ đề.', c: 'tea' },
      { ic: '🗂️', t: 'Thẻ nhớ & pin', d: 'Quản lý dung lượng và pin để không đứt giữa buổi quay.', c: 'vio' },
    ], 3),
  },

  /* 4 — Pocket 3: màn hình cài đặt */
  {
    t: 'Pocket 3 — đọc màn hình cài đặt',
    body: hud({
      w: 620, h: 348,
      top: [{ k: 'ĐỘ PHÂN GIẢI · FPS', v: '4K · 25', hi: true }, { k: 'MÀU · BIT SÂU', v: 'Normal · 10-bit' }],
      bot: [{ k: 'MÀN TRẬP', v: '1/50', hi: true }, { k: 'ISO', v: '400' }, { k: 'CÂN BẰNG TRẮNG', v: '5000K' }],
    }) + `<p class="c-note" style="text-align:center;margin-top:8px">Preset "talking head trong nhà, đèn 50Hz" — swipe trái để vào PRO, swipe phải để xem lại.</p>`,
  },

  /* 5 — Pocket 3: bảng preset theo tình huống */
  {
    t: 'Pocket 3 — preset theo tình huống',
    body: table(
      ['Tình huống', 'Độ phân giải · FPS · màn trập', 'Màu', 'Vì sao'],
      [
        ['Talking head trong nhà (đèn 50Hz)', '4K · 25fps · 1/50', 'Normal', 'Khớp điện 50Hz — hết sọc nhấp nháy'],
        ['Vlog ngoài trời, nắng Việt Nam', '4K · 25fps · màn trập Auto', 'Normal', 'Nắng gắt + f/2.0: muốn giữ 1/50 phải gắn kính ND (Ch5)'],
        ['B-roll quay chậm', '1080p · 120fps (Slow Motion 4x)', 'Normal', 'Mượt khi phát chậm lại 4 lần'],
        ['Quay đêm / thiếu sáng', '4K · 25fps · chế độ Low-Light', 'Normal', 'Low-Light tự tăng sáng, đỡ nhiễu'],
        ['Sẽ chỉnh màu kỹ (nối Ch.15)', '4K · 25fps · 1/50', '!D-Log M', '10-bit, dải sáng rộng — PHẢI chỉnh màu lại'],
      ],
      { center: [2] },
    ),
  },

  /* 6 — Pocket 3: chế độ gimbal */
  {
    t: 'Pocket 3 — ba chế độ gimbal',
    body: cards([
      { ic: '🧍', t: 'Follow (mặc định)', d: 'Pan và tilt bám theo tay cầm, trục roll luôn giữ ngang. Dùng cho hầu hết cảnh — kể cả vlog và selfie.', c: 'grn' },
      { ic: '🔒', t: 'Tilt Locked', d: 'Chỉ pan bám tay, tilt khoá cứng. Hợp cảnh bạn đổi độ cao (ngồi ⇄ đứng) mà không muốn khung nghiêng theo.', c: 'amb' },
      { ic: '🌀', t: 'FPV', d: 'Camera xoay tự do theo mọi chuyển động của tay cầm — cảm giác mạnh, ít ổn định. Hợp cảnh hành động.', c: 'red' },
    ], 3) + `<p class="c-note" style="text-align:center;margin-top:6px">Swipe xuống từ đỉnh màn hình → chọn biểu tượng gimbal ở góc dưới phải của Control Center.</p>`,
  },

  /* 7 — Pocket 3: mic & âm thanh */
  {
    t: 'Pocket 3 — mic tích hợp và mic rời',
    body: cards([
      { ic: '🎙️', t: 'Mic tích hợp (3 mic)', d: 'Chỉnh hướng thu Front / Front&Back / All trong Swipe trái → Audio Parameters.', c: 'blu' },
      { ic: '🌬️', t: 'Wind Noise Reduction', d: 'Bật khi quay ngoài trời có gió — chỉ có tác dụng với mic tích hợp trên thân máy.', c: 'tea' },
      { ic: '📶', t: 'DJI Mic 2 / Mic 3', d: 'Bluetooth thẳng, KHÔNG cần receiver (OsmoAudio). Control Center → Wireless Microphone → TX1/TX2.', c: 'grn' },
      { ic: '🔌', t: 'DJI Mic (bản gốc)', d: 'Qua adapter USB-C đi kèm, cắm vào cổng dưới đáy máy — receiver, không link Bluetooth thẳng.', c: 'vio' },
    ], 2),
  },

  /* 8 — iPhone: cài đặt nên bật/tắt */
  {
    t: 'iPhone 16 Pro Max — Settings › Camera',
    body: table(
      ['Cài đặt (trong Record Video / Formats)', 'Bật hay tắt', 'Vì sao'],
      [
        ['Hiện định dạng PAL (25/50fps)', '+BẬT', 'Việt Nam điện 50Hz — khớp màn trập 1/50'],
        ['HDR Video (Dolby Vision)', '-TẮT khi dựng chung Pocket 3', 'Ra thẳng SDR, đỡ một bước tone-map khi edit'],
        ['Lock Camera', '+BẬT khi quay đa ống kính', 'Máy không tự đổi lens giữa cảnh, đỡ giật khung'],
        ['Lock White Balance', '+BẬT trong một cảnh cố định', 'Màu da không nhảy giữa các đoạn cắt'],
        ['Enhanced Stabilization', 'Tuỳ cảnh', 'Ổn định hơn nhưng zoom nhẹ, ăn bớt khung hình'],
        ['Apple ProRes (mục Formats)', 'Chỉ bật khi sẽ chỉnh màu kỹ', 'Nặng hơn HEVC rất nhiều — xem slide dung lượng'],
      ],
    ),
  },

  /* 9 — so sánh góc nhìn ống kính */
  {
    t: 'Góc nhìn: Pocket 3 và ba ống kính iPhone',
    body: fov({
      w: 520,
      lenses: [
        { f: 13, t: 'iPhone Ultra Wide', c: 'blu' },
        { f: 20, t: 'Pocket 3 (cố định)', c: 'amb' },
        { f: 24, t: 'iPhone chính 1x', c: 'grn' },
        { f: 120, t: 'iPhone Tele 5x', c: 'red' },
      ],
    }) + `<p class="c-note" style="text-align:center;margin-top:4px">Tiêu cự tương đương 35mm, theo thông số camera chính thức của DJI và Apple.</p>`,
  },

  /* 10 — Blackmagic Camera app */
  {
    t: 'Blackmagic Camera — app quay tay trên iPhone',
    body: ui({
      title: 'Blackmagic Camera',
      regions: [
        { n: 1, t: 'Shutter angle · ISO · WB', d: 'chỉnh tay, một chạm', x: 4, y: 6, w: 45, h: 24, c: 'blu' },
        { n: 2, t: 'Zebra · Focus Peaking · False Color', d: 'canh sáng và lấy nét', x: 51, y: 6, w: 45, h: 24, c: 'amb' },
        { n: 3, t: 'Apple Log (10-bit)', d: 'dải sáng rộng, để chỉnh màu', x: 4, y: 33, w: 45, h: 22, c: 'vio' },
        { n: 4, t: 'LUT xem trước', d: 'chỉ xem, không ghi vào file gốc', x: 51, y: 33, w: 45, h: 22, c: 'tea' },
        { n: 5, t: 'Ghi thẳng ra SSD ngoài', d: 'qua cổng USB-C', x: 4, y: 58, w: 45, h: 20, c: 'grn' },
        { n: 6, t: 'Điều khiển từ xa / đa máy', d: 'xem và bấm REC từ thiết bị khác', x: 51, y: 58, w: 45, h: 20, c: 'pnk' },
        { n: 7, t: 'Nút REC', d: '', x: 4, y: 81, w: 92, h: 15, c: 'red' },
      ],
    }),
  },

  /* 11 — iPad/Mac/Linux: luồng dữ liệu */
  {
    t: 'Từ máy quay tới bản dựng cuối',
    body: flow([
      { e: '📷', t: 'Pocket 3 / iPhone', d: 'Quay xong, rút thẻ / rút cáp' },
      { e: '✏️', t: 'iPad Pro M5', d: 'Xem lại, storyboard, ghi chú' },
      { e: '💻', t: 'Mac M1 Max', d: 'Nhập liệu, dựng, chỉnh màu' },
      { e: '🐧', t: 'Máy Linux', d: 'Sao lưu bản 2, chuyển mã, Whisper' },
    ]) + `<p class="c-note" style="text-align:center;margin-top:10px">Chi tiết quy trình sao lưu 3-2-1 và chuyển mã ở Chương 11 và 16 — chương này chỉ giới thiệu vai trò.</p>`,
  },

  /* 12 — phần mềm dựng theo từng máy */
  {
    t: 'Phần mềm dựng — máy nào dùng app nào',
    body: table(
      ['Máy', 'Phần mềm chính', 'Giá (kiểm 09/2026)'],
      [
        ['iPad Pro M5', 'CapCut · DaVinci Resolve for iPad', 'Cả hai có bản miễn phí; Resolve Studio: mua thêm trong app'],
        ['Mac M1 Max', 'DaVinci Resolve · CapCut · Final Cut Pro', 'Resolve free/Studio; FCP mua đứt; CapCut free/Pro'],
        ['Máy Linux', 'DaVinci Resolve (bản Linux)', 'Free KHÔNG giải mã H.264/H.265/AAC — phải chuyển mã trước'],
      ],
    ),
  },

  /* 13 — bảng dung lượng GB/giờ */
  {
    t: 'Một giờ quay nặng bao nhiêu GB?',
    body: bars([
      { l: 'Pocket 3', sub: 'trần bitrate DJI công bố, mọi chế độ', v: 58.5, txt: '≈58,5 GB/giờ', c: 'red' },
      { l: 'iPhone HEVC 4K·60', sub: 'ước tính — xem cách tính trong bài', v: 24.0, txt: '≈24 GB/giờ (ước tính)', c: 'ora' },
      { l: 'iPhone HEVC 4K·30', sub: 'ước tính', v: 10.2, txt: '≈10 GB/giờ (ước tính)', c: 'amb' },
    ], { lw: 300 }) + `<p class="c-note" style="text-align:center;margin-top:8px">"Ước tính" = DJI/Apple không công bố số theo từng chế độ — cách tự đo bằng ffprobe có trong bài học.</p>`,
  },

  /* 14 — thẻ nhớ, pin, nhiệt */
  {
    t: 'Thẻ nhớ · pin · nhiệt — checklist',
    body: steps([
      ['Format thẻ TRONG máy quay, không bằng máy tính', 'Đúng cấu trúc DJI/Apple mong đợi'],
      ['Không quay đầy 100% dung lượng thẻ', 'Chừa khoảng trống — máy báo và dừng an toàn hơn'],
      ['Hai thẻ luân phiên, dán nhãn khớp tên thư mục', '1 thẻ đang quay + 1 thẻ hôm trước; ví dụ the-A ⇄ 2026-09-22_theA'],
      ['Sạc đầy pin + pin/battery handle dự phòng', 'Pocket 3 chỉ ~166 phút ở 1080p24 — 4K/gimbal ăn pin nhanh hơn'],
      ['Nghỉ giữa các đoạn 4K120 / ProRes mùa hè Việt Nam', 'Máy nóng lên, cảm biến cần thời gian hạ nhiệt'],
      ['Đổ thẻ cuối ngày, chỉ xoá SAU khi đã sao lưu', 'Nối sang quy trình sao lưu 3-2-1 ở Chương 11'],
    ]),
  },

  /* 15 — thực hành */
  {
    t: 'Thực hành',
    body: steps([
      ['Cài Pocket 3 theo preset "trong nhà, đèn 50Hz" và quay thử 30 giây', '4K · 25 · 1/50 · Normal'],
      ['Bật hiện định dạng PAL trên iPhone, quay 4K·25, tắt HDR Video', 'Settings › Camera › Record Video'],
      ['Format một thẻ nhớ TRONG Pocket 3 và đặt tên theo ngày', 'Ví dụ 2026-09-22_theA'],
      ['Quay đúng 1 phút trên mỗi máy, đo dung lượng thật rồi so với slide trước', 'Chênh lệch bao nhiêu phần trăm so với ước tính?'],
      ['Lưu preset "trong nhà" vào Custom Mode của Pocket 3', 'Gọi lại bằng một chạm ở lần quay sau'],
    ]),
  },
]);
