/** Content Creator · Deck cr-27 — Chương 27: Dự án cuối khoá — 30 ngày ra mắt kênh. */
import { S, cover, cards, box, steps, table, vs, flow, mindmap, calendar, seg, kpis, note } from './_cr-chung.mjs';

export const deck = { key: 'cr-27', code: 'CR · CHƯƠNG 27', title: 'Dự án cuối khoá — 30 ngày ra mắt kênh', sub: 'Content Creator · Chương 27' };

export const slides = S([
  cover({ t: 'Chương 27 — Dự án cuối khoá: 30 ngày ra mắt kênh', sub: '2 dự án thật · Rubric tự chấm 8 tiêu chí · Quay lại clip Mục 0 để so · Bước tiếp theo', chap: 'CHƯƠNG 27' }),

  { t: 'Bản đồ chương', body: mindmap('Dự án cuối khoá', '30 ngày ra mắt kênh', [
    { t: '🗓️ Kế hoạch 30 ngày', d: 'Mức trần & mức nhẹ, lịch 4 tuần, dùng /creator', c: 'amb' },
    { t: '🎬 Dự án 1 — video dài', d: 'Ý tưởng → kịch bản → quay → dựng → đăng', c: 'red' },
    { t: '📱 Dự án 2 — ngắn & vlog', d: 'Quay dồn 1 buổi, 4 sản phẩm, đăng chéo', c: 'blu' },
    { t: '📊 Tự đánh giá', d: 'Rubric 1–5, so lại clip Mục 0, bước tiếp theo', c: 'grn' },
  ]) },

  { t: 'Vòng lặp 10 bước — lần này chạy hết, không bỏ bước nào', body: flow([
    { e: '💡', t: 'Ý tưởng', d: 'chấm điểm, đóng gói trước — Ch2', c: 'red' },
    { e: '📝', t: 'Kịch bản + Shot list', d: 'hai cột, hook — Ch3–4', c: 'ora' },
    { e: '🎥', t: 'Quay', d: 'đúng thông số, một mình — Ch5–10', c: 'amb' },
    { e: '✂️', t: 'Dựng', d: 'rough → fine → lock — Ch11–14', c: 'grn' },
    { e: '🎨', t: 'Màu, âm, phụ đề', d: 'Ch15–16', c: 'tea' },
    { e: '🚀', t: 'Xuất, đăng, đo', d: 'Ch24–26', c: 'blu' },
  ]) + note('Đúng 10 bước của Bài 0.3, gộp lại còn 6 chặng lớn. Lần này không bước nào bị bỏ qua — kể cả những bước bạn từng bỏ qua trước khi học khoá này.') },

  { t: 'Mục tiêu 30 ngày — chọn mức phù hợp với tuần học', body: table(['Mức', 'Video dài', 'Video ngắn', 'Vlog', 'Bài giảng', 'Giờ/tuần (ước lượng)'], [
    ['!Trần — tuần rảnh', '4', '12', '2', '2', '~16h'],
    ['Nhẹ — tuần thi/bận', '2', '6', '1', '1', '~8h'],
  ], { center: [1, 2, 3, 4, 5] }) + note('Giờ/tuần là ước lượng để TỰ CÂN, không phải số đo chính thức — đo lại tốc độ thật của bạn sau video đầu tiên, đúng cách Bài 0.3 đã gợi ý.') },

  { t: 'Lịch 30 ngày — mẫu bạn tự điền theo mức đã chọn', body: calendar([
    { w: 'Tuần 1 · 1–7', days: [[{ t: 'Hồ sơ kênh', c: 'vio' }], [{ t: '10+ ý tưởng', c: 'amb' }], [{ t: 'Chấm điểm', c: 'amb' }], [{ t: 'Kịch bản', c: 'blu' }], [{ t: 'Shot list', c: 'tea' }], [], [{ t: 'Rà lại tuần', c: 'grn' }]] },
    { w: 'Tuần 2 · 8–14', days: [[], [{ t: 'QUAY DỒN #1', c: 'red' }], [{ t: 'Đổ thẻ + lưu', c: 'ora' }], [{ t: 'Dựng', c: 'amb' }], [{ t: 'Màu + âm', c: 'tea' }], [{ t: 'Thumbnail', c: 'vio' }], [{ t: 'ĐĂNG dài #1', c: 'grn' }]] },
    { w: 'Tuần 3 · 15–21', days: [[{ t: 'Kịch bản ×4', c: 'blu' }], [], [{ t: 'QUAY DỒN #2', c: 'red' }], [{ t: 'Dựng CapCut', c: 'amb' }], [], [{ t: 'Đăng chéo', c: 'grn' }], []] },
    { w: 'Tuần 4 · 22–28', days: [[{ t: 'Video dài #2', c: 'red' }], [{ t: 'QUAY DỒN #3', c: 'ora' }], [{ t: 'Dựng', c: 'amb' }], [{ t: 'Đăng dài #2', c: 'grn' }], [{ t: 'Bài giảng', c: 'vio' }], [], []] },
    { w: 'Tuần 5 · 29–30', days: [[{ t: 'Quay lại clip 60s', c: 'blu' }], [{ t: 'Rubric + nhật ký', c: 'grn' }], [], [], [], [], []] },
  ]) + note('Mức nhẹ: bỏ trống các ô tô màu của Tuần 4 (video dài #2, bài giảng) — vẫn đủ hoàn thành cả 2 dự án bắt buộc trong 3 tuần đầu.') },

  { t: '/creator đi cùng suốt 30 ngày', body: cards([
    { ic: '💡', t: '/creator/ideas', d: 'Ghi mọi ý tưởng cho cả 2 dự án, chấm điểm trước khi chọn', c: 'amb' },
    { ic: '🗓️', t: '/creator/calendar', d: 'Đặt ngày Quay + ngày Đăng cho từng dự án', c: 'blu' },
    { ic: '📋', t: '/creator/pipeline', d: 'Kéo thẻ qua 6 cột — nhìn một lần biết dự án nào bị kẹt', c: 'grn' },
    { ic: '🎬', t: '/creator/projects', d: 'Kịch bản 9 mẫu + Teleprompter cho từng video', c: 'vio' },
  ], 4) },

  { t: 'Dự án 1 — video YouTube dài đầu tiên', body: flow([
    { e: '💡', t: 'Ý tưởng', d: 'chấm điểm — Bài 2.1–2.2', c: 'red' },
    { e: '✍️', t: 'Kịch bản', d: 'hook + 2 cột — Bài 3.1, 3.3', c: 'ora' },
    { e: '🗂', t: 'Shot list', d: 'Bài 4.3', c: 'amb' },
    { e: '🎥', t: 'Quay + đổ thẻ', d: 'Bài 5–11', c: 'grn' },
    { e: '✂️', t: 'Dựng + màu + âm', d: 'Bài 12–16', c: 'tea' },
    { e: '🚀', t: 'Đóng gói + đăng', d: 'Bài 24–25', c: 'blu' },
  ]) },

  { t: 'Checklist Dự án 1 — mỗi hàng là một buổi làm việc', body: table(['Giai đoạn', 'Bài học', 'Sản phẩm ra được'], [
    ['Ý tưởng + chấm điểm', '2.1–2.2', '1 ý tưởng ≥4 sao, tiêu đề nháp'],
    ['Kịch bản 2 cột', '3.1, 3.3', 'Kịch bản đã lưu trong /creator'],
    ['Shot list', '4.3', 'Bảng shot có cột số giây'],
    ['Cài máy + quay', '5–10', 'Clip ngắn, đúng fps/phơi sáng'],
    ['Đổ thẻ + sao lưu', '11.1–11.2', 'Thư mục đặt tên, 2 bản sao'],
    ['Dựng tới picture lock', '12–14', 'Bản dựng đã khoá thứ tự'],
    ['Màu + âm + phụ đề', '15–16', 'File đã mix loudness, có SRT'],
    ['Đóng gói + xuất + đăng', '24–25', '+Video LÊN SÓNG'],
  ], { sm: true }) },

  { t: 'Dự án 2 — 3 video ngắn + 1 vlog, một buổi quay dồn', body: flow([
    { e: '✍️', t: '4 kịch bản', d: 'mẫu có sẵn — Bài 3.3', c: 'red' },
    { e: '🎥', t: 'Quay dồn 1 buổi', d: 'Bài 4.1, 21.2', c: 'ora' },
    { e: '✂️', t: 'Dựng CapCut', d: 'Bài 12', c: 'grn' },
    { e: '🔀', t: 'Đăng chéo', d: 'Bài 24.3', c: 'blu' },
  ]) },

  { t: 'Một buổi quay dồn — bốn sản phẩm', body: seg([
    { t: 'Dựng máy', d: 'đèn, âm, khung', w: 1, c: 'dim' },
    { t: 'Vlog', d: 'theo bạn cả buổi', w: 3, c: 'pnk' },
    { t: '3 video ngắn', d: 'cùng bối cảnh, đổi áo', w: 2, c: 'amb' },
    { t: 'B-roll', d: 'tay, màn hình, chi tiết', w: 1, c: 'grn' },
    { t: 'Đổ thẻ', d: 'đặt tên ngay', w: 0.8, c: 'vio' },
  ], ['8:00', '8:20', '11:20', '13:20', '14:20', '14:40']) + note('Dựng máy một lần, quay bốn sản phẩm. Vlog chạy nền suốt buổi; 3 video ngắn và B-roll chen vào lúc dừng tay.') },

  { t: 'Đăng chéo — nhắc lại luật của Chương 2', body: vs({
    no: { t: 'Làm hỏng', items: ['Tải bản có watermark từ app khác rồi đăng chéo', 'Nhồi nguyên video ngang 16:9 vào khung dọc 9:16', 'Copy y nguyên caption ở mọi nền tảng'] },
    yes: { t: 'Áp dụng đúng cho Dự án 2', items: ['Xuất bản GỐC sạch, dựng riêng khung dọc trong CapCut', 'Viết lại caption theo từng nền tảng', 'Đăng xong thì đọc số liệu riêng từng nơi — Bài 26.1'] },
  }) },

  { t: 'Trước / sau — cùng một bài tập 60 giây', body: cards([
    { ic: '🔴', t: 'Mục 0 — clip "trước khi học"', d: 'Ánh sáng cửa sổ ngẫu nhiên, mic built-in, không biết nhìn đâu, nói vấp không sửa', c: 'red' },
    { ic: '🟢', t: 'Chương 27 — quay lại, vẫn một take', d: 'Ánh sáng đặt chủ đích, mic gắn ngoài, khung theo 1/3, nhìn thẳng ống kính', c: 'grn' },
  ], 2) },

  { t: 'Rubric tự chấm — 8 tiêu chí, thang 1–5', body: table(['Tiêu chí', '1–2 điểm trông như', '4–5 điểm trông như'], [
    ['Hook', '"Xin chào các bạn, hôm nay…"', 'Vào thẳng vấn đề trong 3 giây'],
    ['Âm thanh', 'Vọng, rè, ồn nền rõ', 'Giọng rõ, khoảng −12…−6 dBFS'],
    ['Ánh sáng', 'Ngược sáng, mặt tối', 'Có key/fill, mắt sáng rõ'],
    ['Khung hình', 'Đầu chạm mép, nghiêng', 'Theo 1/3, đủ khoảng nhìn'],
    ['Nhịp dựng', 'Lê thê, khoảng lặng chết', 'Cắt đúng lúc, giữ chân người xem'],
    ['Màu', 'Ám vàng/xanh, mỗi cảnh một tông', 'Nhất quán giữa các cảnh'],
    ['Phụ đề', 'Không có, hoặc sai chính tả', 'Đúng chữ, đúng vùng an toàn'],
    ['Đóng gói', 'Tiêu đề chung chung', 'Lời hứa rõ, thumbnail đọc được ở cỡ nhỏ'],
  ], { sm: true }) },

  { t: 'Học tiếp gì sau ngày 30', body: cards([
    { ic: '🎙️', t: 'Podcast đa máy', d: 'Nhiều mic độc lập rồi đồng bộ — nền đã học ở Bài 9.4 + 13.3', c: 'red' },
    { ic: '🔴', t: 'Livestream', d: 'Hỏi đáp trực tiếp, cộng đồng thời gian thực', c: 'ora' },
    { ic: '✨', t: 'Motion design sâu hơn', d: 'Đào tiếp Fusion của Chương 19', c: 'blu' },
    { ic: '🎨', t: 'Colorist', d: 'Colorist Guide miễn phí của Blackmagic Design', c: 'vio' },
  ], 4) },

  { t: 'Con số khép lại 28 phần', body: kpis([
    { v: '28', l: 'phần đã học (Mục 0 → Ch27)', c: 'red' },
    { v: '2', l: 'dự án capstone', c: 'ora' },
    { v: '30', l: 'ngày', c: 'amb' },
    { v: '8', l: 'tiêu chí tự chấm', c: 'grn' },
  ]) },

  { t: '🎬 Thực hành chương 27', body: steps([
    ['Chọn <b>mức trần hay mức nhẹ</b>, điền lịch 4 tuần vào /creator', 'Theo tuần học thật của bạn — xem lại slide 4.'],
    ['Hoàn thành <b>Dự án 1 và Dự án 2</b> — cả hai đã ĐĂNG thật', 'Thẻ pipeline ở cột "Đã đăng", không chỉ dựng xong.'],
    ['Quay lại <b>clip 60 giây</b> của Mục 0 — cùng điều kiện: một take', 'Không cắt, không làm lại — để so sánh công bằng.'],
    ['Chấm <b>rubric 8 tiêu chí</b> cho cả 2 clip và cả 2 dự án', 'Viết điểm ra, đừng chỉ ước lượng trong đầu.'],
    ['Viết <b>nhật ký creator</b> + một mục tiêu 30 ngày tiếp theo', 'Ba dòng: ổn · chưa ổn · lần sau.'],
  ]) + box('good', '<b>Đạt khi:</b> 2 dự án đã đăng thật, rubric đã chấm đủ 8 tiêu chí cho cả hai clip so sánh, và một mục tiêu 30 ngày mới đã được viết ra trong /creator.') },
]);
