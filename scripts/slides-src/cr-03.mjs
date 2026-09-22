/** Content Creator · Deck cr-03 — Chương 3: Kịch bản & kể chuyện. */
import { S, cover, cards, box, steps, table, vs, flow, mindmap, seg, chart, phone, bars, two, list, note, tag } from './_cr-chung.mjs';

export const deck = { key: 'cr-03', code: 'CR · CHƯƠNG 3', title: 'Kịch bản & kể chuyện', sub: 'Content Creator · Chương 3' };

export const slides = S([
  cover({ t: 'Chương 3 — Kịch bản & kể chuyện', sub: 'Hook 3 giây · Cấu trúc câu chuyện · Viết cho tai nghe · Kịch bản 2 cột · Lên hình tự nhiên', chap: 'CHƯƠNG 3' }),

  { t: 'Bản đồ chương', body: mindmap('Kịch bản', 'nói gì, theo thứ tự nào', [
    { t: '🪝 Hook', d: '3 giây đầu và 30 giây đầu', c: 'red' },
    { t: '🧱 Cấu trúc', d: '3 hồi · "nhưng / vì vậy" · vòng mở', c: 'ora' },
    { t: '🗂 Theo loại video', d: 'Hướng dẫn · vlog · bài giảng · short', c: 'amb' },
    { t: '👂 Viết cho tai', d: 'Câu ngắn, một ý, nói thành tiếng', c: 'tea' },
    { t: '📋 Kịch bản 2 cột', d: 'HÌNH | LỜI → thẳng sang shot list', c: 'blu' },
    { t: '🎙 Lên hình', d: 'Teleprompter iPad · nhìn ống kính', c: 'vio' },
  ]) },

  { t: 'Người xem quyết định rất sớm', body: chart({
    x: [0, 60, 'giây đầu tiên của video'], y: [0, 100, '% người xem còn ở lại'], xt: 6, yt: 4,
    xfmt: (v) => v + 's', yfmt: (v) => v + '%', h: 360,
    series: [
      { t: 'Mở bằng lời chào dài', c: 'red', pts: [[0, 100], [3, 78], [10, 58], [20, 48], [40, 42], [60, 39]] },
      { t: 'Mở bằng hook', c: 'grn', pts: [[0, 100], [3, 92], [10, 84], [20, 79], [40, 74], [60, 71]], fill: true },
    ],
    notes: [{ x: 10, y: 58, t: 'đợt rời đi lớn nhất nằm ở đây', c: 'red', dy: 28 }],
  }) + note('Đường MINH HOẠ hình dạng thường gặp, không phải số đo của một kênh cụ thể. Chương 26 dạy đọc đồ thị giữ chân thật của bạn.') },

  { t: 'Một hook có ba lớp — cùng lúc', body: two(
    phone({ w: 220, size: 'MCU', label: 'Giây 0–3 trên điện thoại' }),
    cards([
      { ic: '👁', t: 'Lớp HÌNH', d: 'Thứ người xem thấy ngay: kết quả, một cảnh lạ, chuyển động. Không phải logo, không phải màn hình đen.', c: 'red' },
      { ic: '🔤', t: 'Lớp CHỮ', d: 'Một dòng chữ to trên màn hình nói lời hứa — nhiều người xem không bật tiếng.', c: 'amb' },
      { ic: '🗣', t: 'Lớp LỜI', d: 'Câu nói đầu tiên: vào thẳng vấn đề hoặc kết quả, không chào hỏi.', c: 'grn' },
    ], 1), 'r') },

  { t: '8 kiểu hook — ví dụ cho kênh của bạn', body: table(['Kiểu', 'Ví dụ', 'Hợp với'], [
    ['Kết quả trước', '"Đây là web mình dựng trong 2 giờ. Giờ làm lại từ đầu."', 'Hướng dẫn'],
    ['Câu hỏi đúng nỗi đau', '"Code chạy trên máy bạn, lên server thì lỗi?"', 'Hướng dẫn, short'],
    ['Nói ngược số đông', '"Đừng học React trước khi hiểu cái này."', 'Short, bài giảng'],
    ['Con số cụ thể', '"3 lỗi Git làm mình mất cả buổi tối."', 'Mọi loại'],
    ['Vòng mở', '"Lỗi thứ ba là lỗi mình mắc suốt một năm."', 'Video dài'],
    ['Đặt cược', '"Còn 24 giờ là nộp đồ án — và server vừa sập."', 'Vlog, kể chuyện'],
    ['Giữa hành động', 'Mở thẳng vào lúc đang sửa lỗi, rồi mới kể lại', 'Vlog'],
    ['Trước / sau', '"Video của mình tháng 1 và bây giờ."', 'Hành trình'],
  ], { sm: true }) },

  { t: 'Mở đầu dở và mở đầu tốt', body: vs({
    no: { t: 'Mở đầu làm người xem đi', items: ['"Xin chào các bạn, mình là… hôm nay mình sẽ…"', '10 giây logo và nhạc', '"Trước khi vào bài, nhớ đăng ký kênh"', 'Kể lý do vì sao làm video này'] },
    yes: { t: 'Mở đầu giữ người xem', items: ['Câu đầu = vấn đề hoặc kết quả', 'Hình đầu đã có chuyển động/kết quả', 'Chữ trên màn hình nhắc lại lời hứa', 'Giới thiệu bản thân SAU khi họ đã ở lại'] },
  }) + box('warn', 'Hook phải được video trả. Hứa "sửa trong 5 phút" mà mất 15 phút là người xem bỏ đi — và nền tảng ghi nhận họ bỏ đi.') },

  { t: 'Cấu trúc 3 hồi cho video 8 phút', body: seg([
    { t: 'Hook', d: '0:00–0:15', w: 1, c: 'red' },
    { t: 'Hồi 1 · Bối cảnh', d: 'vấn đề là gì, vì sao quan trọng', w: 3, c: 'amb' },
    { t: 'Hồi 2 · Xung đột → giải', d: 'thử, vướng, tìm ra cách', w: 9, c: 'blu' },
    { t: 'Hồi 3 · Trả thưởng', d: 'kết quả + bài học', w: 2.5, c: 'grn' },
    { t: 'CTA', d: '1 lời kêu gọi', w: 1, c: 'vio' },
  ], ['0:00', '0:15', '1:30', '6:45', '7:45', '8:00']) + list(['<b>Hồi 1</b> trả lời "tại sao phải xem"', '<b>Hồi 2</b> chiếm phần lớn thời lượng — nơi có khó khăn thật', '<b>Hồi 3</b> trả đúng thứ hook đã hứa']) },

  { t: 'Luật "nhưng / vì vậy" thay cho "và rồi"', body: flow([
    { e: '🧩', t: 'Mình dựng form đăng nhập', c: 'blu' },
    { e: '⚠️', t: 'NHƯNG cookie không lưu', d: 'xung đột', c: 'red' },
    { e: '🔍', t: 'VÌ VẬY mở tab Network', d: 'hệ quả', c: 'amb' },
    { e: '😮', t: 'NHƯNG thấy lỗi SameSite', d: 'bất ngờ', c: 'red' },
    { e: '✅', t: 'VÌ VẬY sửa 1 dòng cấu hình', d: 'trả thưởng', c: 'grn' },
  ]) + box('tip', 'Nối các nhịp bằng "và rồi…" là kể lể. Nối bằng "nhưng…" và "vì vậy…" là kể chuyện — mỗi nhịp sinh ra nhịp sau. (Luật do hai tác giả South Park chia sẻ với sinh viên NYU.)') },

  { t: 'Khung cho từng loại video', body: table(['Loại', 'Khung (các mẫu có sẵn trong /creator)'], [
    ['Hướng dẫn công cụ', 'Vấn đề → Kết quả → Cài đặt → Dùng cơ bản → Mẹo → Khi nào KHÔNG dùng → Tóm tắt'],
    ['Bài giảng', 'Mục tiêu → Khái niệm → Ví dụ chạy được → Lỗi thường gặp → Bài tập'],
    ['Vlog kể chuyện', 'Hook → Bối cảnh → 4 nhịp diễn biến → Bài học → Một lời kêu gọi'],
    ['Video ngắn', 'Hook 0–3s → Vấn đề → MỘT lời giải → Chốt 1 câu → Kêu gọi'],
    ['Review / so sánh', 'Kết luận trước → Tiêu chí → So sánh → Ai nên chọn gì'],
  ]) },

  { t: 'Viết cho tai, không phải cho mắt', body: vs({
    no: { t: 'Câu viết (đọc lên nghe như đọc văn)', items: ['"Việc cấu hình biến môi trường (xem mục 2.3) là cần thiết nhằm đảm bảo tính bảo mật."', 'Câu dài, nhiều mệnh đề, ngoặc đơn', 'Đọc từng ký hiệu code thành tiếng'] },
    yes: { t: 'Câu nói (nghe là hiểu)', items: ['"Mật khẩu không được nằm trong code. Mình để nó trong file .env."', 'Một ý một câu, câu ngắn', 'Code hiện trên màn hình, lời nói giải thích Ý NGHĨA'] },
  }) + box('good', 'Mẹo: viết xong, <b>đọc to</b> một lượt. Chỗ nào vấp lưỡi là chỗ phải viết lại.') },

  { t: 'Kịch bản 2 cột: HÌNH | LỜI', body: table(['Giây', 'HÌNH (thấy gì)', 'LỜI (nghe gì)'], [
    ['0:00', 'Cận mặt, nhìn thẳng ống kính', '"Commit thẳng lên main làm mình mất ba tiếng đêm trước hạn nộp."'],
    ['0:04', 'Insert: terminal báo lỗi đỏ', '"Nếu bạn mới học Git, đây là ba lỗi mình ước biết sớm hơn."'],
    ['0:10', 'Chữ lớn: LỖI 1 — COMMIT LÊN MAIN', '"Lỗi thứ nhất…"'],
    ['0:12', 'Quay màn hình: git checkout -b', '"Mỗi việc một nhánh. Main chỉ nhận code đã chạy."'],
  ], { sm: true }) + note('Cột HÌNH chính là shot list của Chương 4 — mỗi dòng thành một shot cần quay.') },

  { t: 'Số chữ ↔ thời lượng (đo tốc độ của chính bạn)', body: bars([
    { l: 'Video ngắn 60 giây', v: 150, txt: '≈ 150 từ', c: 'red' },
    { l: 'Video 3 phút', v: 450, txt: '≈ 450 từ', c: 'amb' },
    { l: 'Video 8 phút', v: 1200, txt: '≈ 1.200 từ', c: 'blu' },
  ], { lw: 250 }) + box('info', 'Tính theo ví dụ <b>150 từ/phút</b> — đúng ngân sách mẫu "Video ngắn" trong /creator. Tốc độ thật của bạn: đọc to một đoạn 150 từ ở nhịp quay video, bấm giờ; <code>từ ÷ phút</code> = tốc độ của bạn.') },

  { t: 'Teleprompter trên iPad — phím tắt của /creator', body: two(table(['Phím', 'Tác dụng'], [
    ['<code>Space</code>', 'Chạy / dừng cuộn chữ'],
    ['<code>R</code>', 'Về đầu kịch bản'],
    ['<code>F</code>', 'Toàn màn hình'],
    ['<code>↑</code> / <code>↓</code>', 'Tốc độ ± 0,25× (0,25–4×)'],
    ['Thanh trượt', 'Cỡ chữ (mặc định 48px)'],
    ['Lật gương', 'Dùng với khung prompter có kính'],
  ]), steps([
    ['Đặt iPad <b>ngay dưới</b> ống kính iPhone', 'Mắt đọc gần ống kính → người xem thấy bạn nhìn họ.'],
    ['Thu hẹp cột chữ, cỡ chữ to', 'Mắt ít đảo ngang hơn.'],
    ['Đứng xa hơn một chút', 'Càng xa, mắt đảo càng khó thấy.'],
  ]), 'l') },

  { t: 'Lên hình tự nhiên — 4 thói quen', body: cards([
    { ic: '🎯', t: 'Nhìn ống kính', d: 'Không nhìn màn hình xem mình. Ống kính là mắt người xem.', c: 'red' },
    { ic: '⚡', t: 'Năng lượng cao hơn đời thường', d: 'Máy quay "nuốt" bớt năng lượng. Nói to, rõ, chậm hơn một chút, cười.', c: 'amb' },
    { ic: '⏸', t: 'Vấp thì dừng 2 giây', d: 'Im lặng 2 giây rồi nói lại CẢ câu. Lúc dựng cắt gọn một chỗ.', c: 'grn' },
    { ic: '🧩', t: 'Quay theo đoạn', d: 'Mỗi đoạn kịch bản một take. Không cố nói liền 8 phút.', c: 'blu' },
  ], 4) },

  { t: 'Checklist kịch bản trước khi quay', body: steps([
    ['Hook ≤ 3 giây, có cả <b>hình · chữ · lời</b>', 'Đọc to: có muốn nghe tiếp không?'],
    ['Mỗi nhịp nối bằng <b>nhưng / vì vậy</b>', 'Không có "và rồi" nào.'],
    ['Đọc to toàn bộ, <b>bấm giờ</b>', 'Khớp thời lượng dự định ±10%.'],
    ['Cột HÌNH đủ cho <b>mọi câu</b>', 'Câu nào không có hình = một shot còn thiếu.'],
    ['Đúng <b>một</b> lời kêu gọi', 'Đăng ký HOẶC xem video tiếp HOẶC vào web — chọn một.'],
  ]) },

  { t: '🎬 Thực hành chương 3', body: cards([
    { ic: '🪝', t: '5 hook cho một ý tưởng', d: 'Mỗi kiểu một câu. Quay thử 3 câu bằng iPhone, giữ câu làm bạn muốn xem tiếp.', c: 'red' },
    { ic: '📋', t: 'Kịch bản 2 cột cho video 60 giây', d: 'Tối đa 150 từ, dán vào /creator → mẫu "Video ngắn — một ý duy nhất".', c: 'amb' },
    { ic: '🎙', t: 'Đọc bằng teleprompter', d: 'iPad dưới ống kính, quay 3 lượt, so hướng mắt ở lượt 1 và lượt 3.', c: 'grn' },
  ], 3) + box('good', '<b>Đạt khi:</b> clip 60 giây đọc từ teleprompter, hook trong 3 giây đầu, và bạn nhìn vào ống kính gần như suốt clip.') },
]);
