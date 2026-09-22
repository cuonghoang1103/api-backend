/** Content Creator · Deck cr-02 — Chương 2: Ý tưởng & chiến lược nội dung. */
import { S, cover, cards, box, steps, table, vs, flow, mindmap, bars, two, list, note, calendar, seg, kpis, esc, ui } from './_cr-chung.mjs';

export const deck = { key: 'cr-02', code: 'CR · CHƯƠNG 2', title: 'Ý tưởng & chiến lược nội dung', sub: 'Content Creator · Chương 2' };

/* Kim tự tháp tái sử dụng: 1 video dài → nhiều mảnh */
const pyramid = (() => {
  const L = [
    { t: '1 video dài YouTube', d: 'bản gốc: nghiên cứu, kịch bản, quay kỹ', c: '#ff4d5e' },
    { t: '3–5 video ngắn', d: 'mỗi ý hay nhất thành một Short / Reel / TikTok', c: '#ff8a3d' },
    { t: '1 bài viết trên cuongthai.com', d: 'lệnh, code, sơ đồ — thứ video khó chép', c: '#ffc233' },
    { t: 'Bài đăng cộng đồng', d: 'Facebook, LinkedIn: 1 hình + 1 bài học', c: '#34d399' },
    { t: 'Câu hỏi cho video sau', d: 'từ bình luận của chính video này', c: '#60a5fa' },
  ];
  let s = `<svg class="c-svg" viewBox="0 0 1100 460" width="1100">`;
  L.forEach((l, i) => {
    const y = 10 + i * 88, top = 360 + i * 150, bot = 360 + (i + 1) * 150;
    const x1 = 550 - top / 2, x2 = 550 + top / 2, x3 = 550 + bot / 2, x4 = 550 - bot / 2;
    s += `<path d="M${x1} ${y} H${x2} L${Math.min(x3, 1095)} ${y + 80} H${Math.max(x4, 5)} Z" fill="${l.c}" fill-opacity=".85"/>`;
    s += `<text x="550" y="${y + 36}" text-anchor="middle" font-size="21" font-weight="800" fill="#0b0e14" font-family="-apple-system,Arial">${esc(l.t)}</text>`;
    s += `<text x="550" y="${y + 60}" text-anchor="middle" font-size="15" font-weight="600" fill="#0b0e14" font-family="-apple-system,Arial">${esc(l.d)}</text>`;
  });
  return s + `</svg>`;
})();

export const slides = S([
  cover({ t: 'Chương 2 — Ý tưởng & chiến lược nội dung', sub: 'Nguồn ý tưởng không cạn · Chấm điểm trước khi quay · Trụ cột & series · Lịch đăng · Tái sử dụng', chap: 'CHƯƠNG 2' }),

  { t: 'Bản đồ chương', body: mindmap('Ý tưởng & chiến lược', 'quay cái gì, khi nào', [
    { t: '🌱 Nguồn ý tưởng', d: '8 nguồn không bao giờ cạn', c: 'red' },
    { t: '⚖️ Chấm điểm', d: 'Nhu cầu · lợi thế · công sức · đóng gói', c: 'ora' },
    { t: '🎁 Đóng gói trước', d: 'Tiêu đề + thumbnail TRƯỚC khi quay', c: 'amb' },
    { t: '🏛 Trụ cột & series', d: 'Người xem biết sắp nhận gì', c: 'tea' },
    { t: '🗓 Lịch & quay dồn', d: 'Nhịp thực tế cho sinh viên', c: 'blu' },
    { t: '♻️ Tái sử dụng', d: '1 video dài → nhiều mảnh', c: 'vio' },
  ]) },

  { t: 'Ý tưởng không thiếu — thiếu là hệ thống', body: flow([
    { e: '✍️', t: 'Ghi lại', d: 'mọi ý, ngay lúc nảy ra — /creator/ideas "Đã ghi"', c: 'amb' },
    { e: '🪚', t: 'Gọt', d: 'một câu + câu hook nháp — "Đã gọt"', c: 'blu' },
    { e: '⭐', t: 'Chấm điểm', d: 'cân 4 tiêu chí, chốt 1–5 sao', c: 'ora' },
    { e: '🚀', t: 'Nâng thành dự án', d: 'nút "Nâng thành dự án" — "Đã nâng"', c: 'grn' },
    { e: '🗄', t: 'Cất', d: 'ý chưa tới lúc — "Đã cất", không xoá', c: 'vio' },
  ]) + box('tip', 'Bốn trạng thái trên là đúng tên trong Kho ý tưởng của <b>/creator/ideas</b>. Não để nghĩ, không để nhớ — ghi hết ra.') },

  { t: '8 nguồn ý tưởng không bao giờ cạn', body: cards([
    { ic: '💬', t: 'Câu hỏi của người học', d: 'bình luận, tin nhắn, câu hỏi trên lớp', c: 'red' },
    { ic: '📓', t: 'Nhật ký tự học', d: 'mỗi lỗi bạn vừa sửa là một video', c: 'ora' },
    { ic: '🔎', t: 'Gợi ý tìm kiếm', d: 'ô tìm YouTube tự điền = người ta đang gõ', c: 'amb' },
    { ic: '📈', t: 'Tab Trends YouTube · Google Trends', d: 'khán giả đang tìm gì, chủ đề nào đang lên', c: 'grn' },
    { ic: '🚀', t: 'Video "vượt trội"', d: 'video nhiều view gấp mấy lần mức thường của kênh', c: 'tea' },
    { ic: '👥', t: 'Nhóm cộng đồng', d: 'nhóm Facebook IT, Reddit: câu hỏi lặp lại', c: 'blu' },
    { ic: '📚', t: 'Khoá học của bạn', d: 'mỗi bài trên cuongthai.com là một video', c: 'vio' },
    { ic: '🛠', t: 'Dự án đang làm', d: 'build in public: tính năng tuần này', c: 'pnk' },
  ], 4) },

  { t: 'Video "vượt trội" — tín hiệu mạnh nhất về nhu cầu', body: bars([
    { l: 'Video A', sub: 'mức thường của kênh', v: 8, txt: '8 nghìn view', c: 'dim' },
    { l: 'Video B', v: 10, txt: '10 nghìn', c: 'dim' },
    { l: 'Video C', v: 7, txt: '7 nghìn', c: 'dim' },
    { l: 'Video D — vượt trội', sub: 'gấp ~6 lần', v: 48, txt: '48 nghìn  ← chủ đề này có nhu cầu', c: 'red' },
    { l: 'Video E', v: 9, txt: '9 nghìn', c: 'dim' },
  ], { lw: 240 }) + note('Số MINH HOẠ. Cách làm: mở tab Videos của một kênh cùng ngách, sắp theo Phổ biến, tìm video vượt xa mức thường của chính kênh đó — rồi hỏi vì sao chủ đề ấy được cần.') },

  { t: 'Chấm điểm trước khi quay', body: table(['Ý tưởng', 'Nhu cầu', 'Lợi thế của bạn', 'Công sức (dễ = 5)', 'Đóng gói được', 'Tổng'], [
    ['Deploy Next.js lên VPS từ A tới Z', '5', '5', '2', '5', '!17'],
    ['Review 10 extension VS Code', '4', '2', '4', '4', '14'],
    ['Lịch sử của JavaScript', '2', '2', '3', '3', '10'],
  ], { center: [1, 2, 3, 4, 5] }) + list([
    '<b>Nhu cầu</b>: có người tìm, có người hỏi không?',
    '<b>Lợi thế</b>: bạn làm được tốt hơn video đang có không?',
    '<b>Công sức</b>: vừa sức tuần này không?',
    '<b>Đóng gói</b>: nghĩ ra ngay tiêu đề + thumbnail hấp dẫn không?',
  ]) },

  { t: 'Đóng gói TRƯỚC khi quay', body: vs({
    no: { t: 'Quay xong mới nghĩ tiêu đề', items: ['Video không có lời hứa rõ ràng', 'Thumbnail chụp vội từ một khung hình', 'Tiêu đề chung chung: "Học Next.js phần 3"', 'Không ai biết bấm vào để được gì'] },
    yes: { t: 'Viết tiêu đề + phác thumbnail trước', items: ['Lời hứa quyết định nên quay gì', 'Chụp ảnh thumbnail ngay buổi quay', '"Deploy Next.js lên VPS trong 20 phút"', 'Không đóng gói nổi = ý tưởng chưa đủ rõ'] },
  }) + box('info', 'Nếu bạn không viết được một tiêu đề khiến chính mình muốn bấm, <b>đừng quay vội</b> — gọt ý tưởng thêm. Chương 22 dạy đóng gói chi tiết.') },

  { t: 'Thử rẻ trước, làm lớn sau', body: flow([
    { e: '📱', t: 'Video ngắn 45 giây', d: 'thử một ý trong một buổi tối', c: 'red' },
    { e: '📊', t: 'Đọc phản hồi', d: 'xem hết? chia sẻ? bình luận hỏi thêm?', c: 'amb' },
    { e: '🎬', t: 'Video dài YouTube', d: 'đầu tư kịch bản, quay kỹ cho ý đã được kiểm', c: 'grn' },
    { e: '🔗', t: 'Nối lại', d: 'video ngắn trỏ sang video dài', c: 'blu' },
  ]) + note('Một video ngắn thất bại tốn một buổi tối. Một video dài thất bại tốn cả tuần.') },

  { t: 'Trụ cột → series có tên', body: table(['Trụ cột', 'Series', 'Nhịp'], [
    ['Dạy', '"Web thật từ số 0" — mỗi tập một tính năng', '1 video dài / tuần'],
    ['Hành trình', '"Build in public — tuần #n"', 'mỗi tuần 1 short'],
    ['Hậu trường', '"Một ngày của SV FPTU"', '2 tuần / lần'],
    ['Công cụ', '"Công cụ mình dùng thật"', 'khi có thứ đáng nói'],
  ]) + box('tip', 'Series có tên làm người xem quay lại tìm tập tiếp theo, và làm bạn đỡ phải nghĩ "tuần này quay gì".') },

  { t: 'Nhịp đăng thực tế cho sinh viên (ví dụ)', body: kpis([
    { v: '1', l: 'video dài / tuần', c: 'red' },
    { v: '2–3', l: 'video ngắn / tuần', c: 'amb' },
    { v: '1', l: 'buổi quay dồn / tuần', c: 'grn' },
    { v: '2', l: 'video dự trữ luôn sẵn', c: 'blu' },
  ]) + box('good', 'Đều đặn thắng dày đặc. Chọn nhịp bạn giữ được <b>kể cả tuần thi</b>, rồi mới tăng. Luôn có sẵn 2 video đã dựng xong làm dự trữ.') },

  { t: 'Nhịp 4 tuần — kế hoạch của bạn', body: calendar([
    { w: 'Tuần 1', days: [[{ t: 'Ý tưởng', c: 'vio' }], [{ t: 'Kịch bản', c: 'blu' }], [{ t: 'Short 1', c: 'tea' }], [{ t: 'QUAY DỒN', c: 'red' }], [{ t: 'Dựng', c: 'amb' }], [{ t: 'Đăng dài', c: 'grn' }], [{ t: 'Short 2', c: 'tea' }]] },
    { w: 'Tuần 2', days: [[{ t: 'Short 3', c: 'tea' }], [{ t: 'Kịch bản', c: 'blu' }], [], [{ t: 'QUAY DỒN', c: 'red' }], [{ t: 'Dựng', c: 'amb' }], [{ t: 'Đăng dài', c: 'grn' }], [{ t: 'Short 4', c: 'tea' }]] },
    { w: 'Tuần 3', days: [[{ t: 'Short 5', c: 'tea' }], [{ t: 'Kịch bản', c: 'blu' }], [{ t: 'Vlog', c: 'pnk' }], [{ t: 'QUAY DỒN', c: 'red' }], [{ t: 'Dựng', c: 'amb' }], [{ t: 'Đăng dài', c: 'grn' }], [{ t: 'Short 6', c: 'tea' }]] },
    { w: 'Tuần 4', days: [[{ t: 'Đọc số liệu', c: 'vio' }], [{ t: 'Kịch bản', c: 'blu' }], [{ t: 'Short 7', c: 'tea' }], [{ t: 'QUAY DỒN', c: 'red' }], [{ t: 'Dựng', c: 'amb' }], [{ t: 'Đăng dài', c: 'grn' }], [{ t: 'Short 8', c: 'tea' }]] },
  ]) + note('Mỗi tuần đúng nhịp slide trước: 1 video dài + 2 short + 1 buổi quay dồn. Đây là kế hoạch LÀM VIỆC bạn tự lên (giấy, notes, hay bảng này) — không phải ảnh chụp một trang web; slide sau cho xem màn hình /creator/calendar thật.') },

  { t: '/creator/calendar thật: chỉ hai mốc mỗi dự án', body: ui({ w: 1100, h: 380, title: 'cuongthai.com/creator/calendar', regions: [
    { n: 1, t: 'Tháng ⇄ Lịch trình', d: 'chuyển lưới tháng ↔ danh sách theo tuần', x: 1, y: 3, w: 48, h: 20, c: 'blu' },
    { n: 2, t: 'Lưới tháng', d: 'chấm hổ phách = ngày Quay · chấm ngọc lục = ngày Đăng', x: 1, y: 26, w: 65, h: 68, c: 'amb' },
    { n: 3, t: 'Ngày đã chọn', d: 'trống → 2 nút "Lên lịch quay" / "Lên lịch đăng"', x: 68, y: 26, w: 31, h: 40, c: 'grn' },
    { n: 4, t: 'Tiếp theo', d: '3 mốc gần nhất — bấm để mở dự án', x: 68, y: 68, w: 31, h: 26, c: 'vio' },
  ] }) + note('Mỗi dự án chỉ có ĐÚNG hai mốc trên lịch — ngày Quay và ngày Đăng. Muốn xem "Kịch bản" hay "Đang dựng"? Đó là các cột trên /creator/pipeline (Ý tưởng → Viết kịch bản → Đang quay → Đang dựng → Đã lên lịch → Đã đăng) — kéo thẻ dự án qua cột để đổi trạng thái.') },

  { t: 'Quay dồn một buổi — nhiều video', body: seg([
    { t: 'Dựng máy', d: 'đèn, âm, khung', w: 1, c: 'dim' },
    { t: 'A-roll video dài', d: 'theo kịch bản 2 cột', w: 3, c: 'red' },
    { t: '3 video ngắn', d: 'cùng bối cảnh, đổi áo', w: 2, c: 'amb' },
    { t: 'B-roll', d: 'tay, màn hình, chi tiết', w: 1.5, c: 'grn' },
    { t: 'Thumbnail', d: 'ảnh 48MP', w: 0.8, c: 'vio' },
  ], ['9:00', '9:30', '12:00', '13:30', '14:30', '15:00']) + note('Dựng máy một lần, quay nhiều thứ. Chi phí lớn nhất của một buổi quay là thời gian dựng và dọn.') },

  { t: 'Kim tự tháp tái sử dụng', body: pyramid },

  { t: 'Đăng chéo đúng cách', body: vs({
    no: { t: 'Làm hỏng đăng chéo', items: ['Tải video TikTok có watermark rồi đăng lên Reels', 'Đăng nguyên file 16:9 vào luồng 9:16', 'Copy y nguyên chú thích và hashtag mọi nơi', 'Đăng cùng một lúc mà không xem nền tảng nào hợp'] },
    yes: { t: 'Đăng chéo sạch', items: ['Xuất một bản gốc KHÔNG watermark, đăng file đó lên từng nơi', 'Dựng bản dọc riêng cho video ngắn', 'Viết lại chú thích theo từng nền tảng', 'Theo dõi số liệu riêng từng nơi'] },
  }) + note('Instagram (2/2021) cho biết Reels còn logo/watermark của app khác hoặc bị mờ sẽ ít được đề xuất hơn.') },

  { t: '🎬 Thực hành chương 2', body: steps([
    ['Ghi <b>20 ý tưởng</b> vào /creator/ideas từ ít nhất 5 nguồn khác nhau', 'Mỗi ý một câu + một câu hook nháp.'],
    ['Chấm điểm 4 tiêu chí, giữ <b>5 ý cao nhất</b>', 'Ý thấp điểm: "Đã cất", đừng xoá.'],
    ['Viết <b>tiêu đề + phác thumbnail</b> cho 3 ý tốt nhất', 'Không viết nổi = gọt lại ý.'],
    ['Xếp <b>lịch 4 tuần</b> trong /creator/calendar', '1 dài + 2–3 ngắn mỗi tuần, có 1 buổi quay dồn.'],
  ]) + box('good', '<b>Đạt khi:</b> 20 ý đã ghi, 5 ý chấm điểm cao nhất có tiêu đề, 3 thumbnail phác, và lịch 4 tuần đã điền.') },
]);
