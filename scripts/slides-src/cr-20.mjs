/**
 * cr-20.mjs — Content Creator, Chương 20: Video ngắn dọc.
 *   node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/cr-20.mjs
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/cr-20.mjs --out <dir>
 */
import { S, cover, cards, box, steps, table, seg, flow, mindmap, phone, aspect, storyboard } from './_cr-chung.mjs';

export const deck = { key: 'cr-20', code: 'CR · CHƯƠNG 20', title: 'Video ngắn dọc', sub: 'Content Creator · Chương 20' };

export const slides = S([

  /* 1 — bìa */
  cover({
    t: 'Chương 20 — Video ngắn dọc',
    sub: 'Ba giây đầu quyết định tất cả — giải phẫu, quay, dựng và đăng một video dọc giữ được chân người xem',
    chap: 'CHƯƠNG 20',
  }),

  /* 2 — mindmap */
  {
    t: 'Bản đồ chương',
    body: mindmap('Video ngắn dọc', 'Chương 20', [
      { t: '20.1 Giải phẫu', d: 'Hook 0–3s, một ý, kết-vòng lặp, độ dài & vùng an toàn từng nền tảng', c: 'red' },
      { t: '20.2 Quay nhanh', d: 'Pocket 3 xoay dọc, iPhone, kiểu video, quay dồn', c: 'ora' },
      { t: '20.3 Dựng giữ chân', d: 'Nhịp, phụ đề từng chữ, punch-in, SFX, nhạc — nối Ch12/14/16/17', c: 'amb' },
      { t: '20.4 Đăng & phân phối', d: 'Đăng chéo sạch, số liệu giữ chân, dẫn về video dài', c: 'grn' },
      { t: 'Nối chương trước', d: 'Ch1 4 nền tảng · Ch4 shot list · Ch7 an toàn · Ch12 CapCut', c: 'blu' },
      { t: 'Ch21 kế tiếp', d: 'Vlog — video dài hơn, kể chuyện một ngày', c: 'vio' },
    ]),
  },

  /* 3 — seg() giải phẫu thời lượng */
  {
    t: 'Giải phẫu một video ngắn — ba đoạn, không hơn',
    body: seg([
      { t: 'HOOK', d: '0–3 giây: hình + chữ + lời', w: 2, c: 'red' },
      { t: 'MỘT Ý DUY NHẤT', d: 'không lạc đề, không "tiện thể nói thêm"', w: 5.5, c: 'amb' },
      { t: 'KẾT — VÒNG LẶP', d: 'câu/khung cuối nối liền về khung đầu', w: 2, c: 'grn' },
    ], ['0:00', '0:03', '', '↺ về 0:00']) + box('tip', 'Vòng lặp (loop) không phải hiệu ứng — là VIẾT kịch bản sao cho câu cuối dẫn tự nhiên về đúng cảnh/câu mở đầu, để người xem không nhận ra video đã lặp lại và xem tiếp lượt hai (cả hai lượt đều được tính).'),
  },

  /* 4 — table độ dài & tỉ lệ (tái dùng số liệu đã kiểm ở Ch1) */
  {
    t: 'Độ dài & tỉ lệ — số liệu đã kiểm ở Chương 1',
    body: table(['Nền tảng', 'Tỉ lệ', 'Độ dài video ngắn', 'Nguồn'], [
      ['YouTube Shorts', '9:16 hoặc vuông', '!Tới 3 phút', 'Từ 15/10/2024 — YouTube Blog'],
      ['TikTok', '9:16', 'Tải lên tới 10 phút phổ biến', 'TikTok thử 60 phút nhóm nhỏ, 5/2024'],
      ['Instagram Reels', '9:16', '!Tới 3 phút', 'Adam Mosseri công bố 1/2025'],
      ['Facebook Reels', '9:16', 'Không giới hạn độ dài', 'Mọi video → Reels từ 6/2025'],
    ], { sm: true }) + box('info', 'Bảng gốc và nguồn đầy đủ ở Bài 1.1. Video ngắn của chương này nhắm 20–60 giây — nằm sâu trong mọi giới hạn trên, nên "còn bao nhiêu giây" không bao giờ là vấn đề của bạn; giữ chân người xem mới là vấn đề thật.'),
  },

  /* 5 — phone() x3 vùng an toàn */
  {
    t: 'Vùng an toàn 9:16 — ba nền tảng, cùng một ước lượng',
    body: `<div style="display:flex;gap:22px;justify-content:center">${
      phone({ w: 190, label: 'TikTok' })
    }${
      phone({ w: 190, label: 'Reels' })
    }${
      phone({ w: 190, label: 'Shorts' })
    }</div>` + box('warn', 'Như Bài 7.3 và 12.3 đã nói rõ: không nền tảng nào công bố con số pixel chính thức, và giao diện cả ba đổi theo thời gian — vùng xanh là ƯỚC LƯỢNG giống nhau cho cả ba (chú thích/tên tài khoản dưới, dải nút bên phải, đôi khi một thanh trên cùng), không phải ba con số đo riêng. Luôn tự kiểm bằng một clip thử trên điện thoại thật.'),
  },

  /* 6 — aspect() Pocket 3 xoay dọc vs iPhone */
  {
    t: 'Quay dọc: Pocket 3 xoay màn hình, iPhone chỉ xoay máy',
    body: aspect({ items: [
      { r: '16:9', px: '3840×2160', t: 'Pocket 3 — ngang, mặc định', c: 'blu' },
      { r: '9:16', px: '1728×3072 "3K"', t: 'Pocket 3 — xoay màn hình 90°', c: 'red' },
      { r: '9:16', px: '1080×1920 hoặc 4K dọc', t: 'iPhone 16 Pro Max — xoay cả máy', c: 'amb' },
    ] }) + box('tip', '<strong>Pocket 3 (theo hướng dẫn chính thức DJI):</strong> xoay màn hình 2 inch cho khớp chiều với thân máy để vào chế độ quay dọc — 3K dọc là 1728×3072, ngoài ra còn 2.7K (1512×2688) và 1080p (1080×1920) dọc, cùng dải fps 24–60 như quay ngang (theo spec dji.com). 3K nặng máy dựng hơn 1080p — chọn 1080p dọc nếu chỉ đăng thẳng, không cắt/zoom lại.'),
  },

  /* 7 — storyboard 6 khung */
  {
    t: 'Sáu khung cho một video ngắn — "1 dòng CSS đổi cả giao diện"',
    body: storyboard([
      { s: '0–3s', t: 'Hook — MCU', d: '"Bạn đang viết CSS sai cách nếu chưa biết thuộc tính này" — nhìn thẳng ống kính', size: 'MCU', kind: 'person' },
      { s: 'Insert', t: 'Màn hình — trước', d: 'Giao diện rối, phải viết lặp lại nhiều dòng', kind: 'screen' },
      { s: 'Ý chính 1', t: 'Giải thích — MCU', d: 'Thuộc tính đó là gì, dùng khi nào', size: 'MCU', kind: 'person' },
      { s: 'Insert', t: 'Màn hình — sau', d: 'Gõ một dòng, giao diện đổi ngay lập tức', kind: 'screen' },
      { s: 'Nhấn mạnh', t: 'Tay gõ phím — CU', d: 'Cận cảnh thao tác thật, không dựng lại', kind: 'hands' },
      { s: 'Kết = Hook', t: 'CTA — vòng lặp — MCU', d: '"Thử ngay đi" — cùng khung hình/tư thế với khung 1', size: 'MCU', kind: 'person' },
    ], { cols: 3 }) + box('good', 'Khung 1 và khung 6 cùng cỡ cảnh, cùng tư thế — vòng lặp nằm ở KỊCH BẢN, không phải hiệu ứng dựng.'),
  },

  /* 8 — 3 kiểu video ngắn */
  {
    t: 'Ba kiểu video ngắn bạn sẽ quay nhiều nhất',
    body: cards([
      { ic: '🗣️', t: 'Talking head ngắn', d: 'Nhìn thẳng ống kính, một ý, 20–40 giây. Pocket 3 dọc trên chân mini hoặc cầm tay ActiveTrack (Bài 10.3).', c: 'blu' },
      { ic: '💻', t: 'Hướng dẫn ngắn — màn hình + mặt', d: 'Cắt giữa khung mặt (mở/kết) và màn hình quay lại (Bài 22.2) — một mẹo code, một phím tắt.', c: 'amb' },
      { ic: '🎞️', t: 'B-roll montage + lồng tiếng', d: 'Không cảnh nào có bạn nói trước máy — dựng theo giọng thu riêng (Bài 9.4), hợp vlog/hành trình.', c: 'grn' },
    ], 3),
  },

  /* 9 — quay dồn 10 video/buổi */
  {
    t: 'Quay dồn 10 video ngắn — một buổi, không phải mười buổi',
    body: steps([
      ['Viết trước 10 hook/kịch bản ngắn', 'Bài 3.1/3.3 — không ứng khẩu tại chỗ, tốn thẻ nhớ và năng lượng'],
      ['Gộp theo chủ đề/bối cảnh gần nhau', 'Đỡ dọn lại đèn, mic, góc máy giữa các video'],
      ['Dựng máy, đèn, mic một lần', 'Chi phí lớn nhất của một buổi quay (nối Bài 2.3)'],
      ['Quay lần lượt, 1–3 take mỗi hook', 'Dừng máy giữa mỗi video — đừng quay liền một lèo (Bài 4.1)'],
      ['Đổi áo/góc máy nhẹ mỗi 3–4 video', 'Đỡ trông như một video bị cắt vụn ra mười bản'],
      ['Đổ thẻ & đặt tên theo hook ngay trong ngày', 'Quy ước đặt tên Bài 11.1 — sáu tháng sau vẫn nhận ra'],
    ]),
  },

  /* 10 — bảng tra: kỹ thuật dựng giữ chân → nối chương nào */
  {
    t: 'Dựng giữ chân — bảng tra: đã học ở đâu, thêm gì cho video ngắn',
    body: table(['Kỹ thuật', 'Đã học ở', 'Thêm cho video ngắn'], [
      ['Nhịp cắt & khoảng chết', 'Bài 14.3', '!Cắt sát hơn nữa — video ngắn không có chỗ cho một giây thừa'],
      ['Phụ đề', 'Bài 16.3', 'Kiểu "từng chữ" nổi bật theo giọng nói — xem Bài 20.3'],
      ['Punch-in & easing', 'Bài 12.2 / 17.2', '1–2 lần có chủ đích: mở ý chính, chốt lại — không rải khắp video'],
      ['SFX (whoosh, click)', 'Bài 14.4', 'Đánh dấu đúng lúc chuyển từ hook sang ý chính'],
      ['Chữ trên màn hình', 'Bài 16.2', 'Hook chữ giây đầu — nhiều người xem tắt tiếng'],
      ['Nhạc nền', 'Bài 9.4 (thu), 12.3 (ducking)', '!Nhạc thịnh hành có giới hạn cho tài khoản doanh nghiệp — Bài 20.3'],
    ], { sm: true }),
  },

  /* 11 — nhạc thịnh hành & giới hạn tài khoản doanh nghiệp */
  {
    t: 'Nhạc thịnh hành — có giới hạn cho tài khoản doanh nghiệp',
    body: cards([
      { ic: '🎵', t: 'TikTok Commercial Music Library', d: 'Tài khoản Business bấm Add Sound CHỈ thấy nhạc trong CML (Commercial Sounds) — mất quyền dùng nhạc thịnh hành thường, theo đúng trang trợ giúp TikTok.', c: 'red' },
      { ic: '📸', t: 'Instagram — thư viện tách riêng', d: 'Tài khoản Business cũng chỉ dùng một thư viện nhạc có phép thương mại riêng (Sound Collection), khác danh sách đầy đủ của tài khoản cá nhân/creator.', c: 'amb' },
      { ic: '🔀', t: 'Cân nhắc trước khi đổi loại tài khoản', d: 'Business/Creator mở bảng phân tích chi tiết (Bài 20.4) nhưng đổi lại nhạc thịnh hành — cân nhắc kỹ trước khi chuyển.', c: 'blu' },
    ], 3) + box('warn', 'Ngược lại: TikTok chỉ xác nhận nhạc trong CML dùng được TRÊN TikTok — cùng kiểu giới hạn với Commercial Music riêng của CapCut (Bài 12.3) — dùng đúng bài đó cho video đăng YouTube vẫn có thể dính Content ID.'),
  },

  /* 12 — flow đăng chéo */
  {
    t: 'Đăng chéo — một bản gốc, nhiều bản riêng',
    body: flow([
      { e: '🎬', t: 'Bản gốc sạch', d: 'Xuất dọc, không watermark (Bài 12.4)', c: 'blu' },
      { e: '✏️', t: 'Mô tả riêng', d: 'Không copy 1 caption cho cả bốn nơi', c: 'amb' },
      { e: '📱', t: 'TikTok', d: 'Hashtag + âm thanh TikTok', c: 'red' },
      { e: '🔁', t: 'Reels · Shorts', d: 'File riêng — không logo TikTok (Bài 2.4)', c: 'grn' },
      { e: '📘', t: 'Facebook Reels', d: 'Trang/Nhóm — dẫn về cuongthai.com', c: 'vio' },
    ]) + box('warn', 'Đăng lại thẳng một clip TikTok còn watermark lên Reels vẫn tới người theo dõi sẵn có bình thường — thứ bị hãm lại là phạm vi ĐỀ XUẤT rộng hơn (Instagram, 2/2021, đã kiểm ở Bài 2.4). Xuất lại bản sạch chỉ tốn vài phút.'),
  },

  /* 13 — số liệu giữ chân & tính năng liên kết */
  {
    t: 'Đọc đúng số liệu của video ngắn',
    body: cards([
      { ic: '📊', t: 'TikTok Studio', d: 'Thời gian xem trung bình và tỉ lệ xem hết từng video — Profile → menu → TikTok Studio → Analytics → Content.', c: 'red' },
      { ic: '👆', t: 'YouTube — "Xem hay lướt qua"', d: 'Studio → Content → Shorts: % người xem thay vì lướt qua ngay — chỉ báo mạnh nhất cho hook.', c: 'amb' },
      { ic: '🔗', t: 'Related video (Shorts)', d: 'Gắn video dài của kênh thành link ngay dưới TÊN KÊNH trong khung Short — cầu nối trực tiếp nhất từ khám phá sang video dài.', c: 'grn' },
    ], 3) + box('warn', '<strong>"View" đổi nghĩa từ 24/08/2026:</strong> mọi định dạng (kể cả Shorts) tính view ngay khi video BẮT ĐẦU phát — không còn ngưỡng thời gian xem tối thiểu. Doanh thu/điều kiện Đối tác vẫn tính theo "engaged views" riêng, không đổi. View thô KHÔNG phải thước đo giữ chân.'),
  },

  /* 14 — checklist trước khi đăng */
  {
    t: 'Checklist trước khi đăng',
    body: table(['Kiểm', 'Đạt khi'], [
      ['Hook 3 giây', '!Xem không tiếng vẫn hiểu đang nói về gì (chữ trên hình)'],
      ['Một ý', 'Không có đoạn nào "tiện thể nói thêm"'],
      ['Vùng an toàn', 'Chữ/CTA không nằm dưới 20% đáy hay dải phải'],
      ['Watermark', '!Xuất lại bản sạch cho từng nền tảng, không thả nguyên file TikTok'],
      ['Vòng lặp', 'Khung/câu cuối nối tự nhiên về khung đầu'],
      ['Mô tả riêng', 'Không copy 1 caption cho cả bốn nơi'],
    ], { sm: true }),
  },

  /* 15 — thực hành */
  {
    t: 'Thực hành chương 20',
    body: cards([
      { ic: '✍️', t: '1. Viết 3 hook', d: 'Ba video ngắn khác chủ đề, mỗi hook đúng một câu, đọc to thử bằng đồng hồ — phải dưới 3 giây.', c: 'blu' },
      { ic: '🎥', t: '2. Quay dồn', d: 'Quay cả 3 video trong một buổi, Pocket 3 xoay dọc hoặc iPhone dọc, 1–3 take mỗi video.', c: 'amb' },
      { ic: '✂️', t: '3. Dựng một video', d: 'CapCut theo 10 bước Bài 12.4, thêm phụ đề từng chữ + 1 punch-in ngay đầu ý chính.', c: 'grn' },
      { ic: '📤', t: '4. Đăng chéo thật', d: 'Xuất riêng, mô tả riêng, đăng lên ít nhất 2 nền tảng, hẹn xem số liệu sau 48 giờ.', c: 'red' },
    ], 2) + box('good', '<strong>Đạt khi:</strong> có 3 video ≤ 60 giây đã đăng, mỗi video hook dưới 3 giây kiểm bằng đồng hồ, không video nào dính watermark của nền tảng khác, và bạn đọc được số liệu giữ chân của ít nhất một video sau 48 giờ.'),
  },
]);
