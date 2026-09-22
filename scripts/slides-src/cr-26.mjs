/**
 * cr-26.mjs — Content Creator, Chương 26: Số liệu, tăng trưởng & kiếm tiền.
 *   node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/cr-26.mjs
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/cr-26.mjs --out <dir>
 */
import { S, cover, cards, box, steps, table, flow, mindmap, bars, calendar, chart, funnel, note } from './_cr-chung.mjs';

export const deck = { key: 'cr-26', code: 'CR · CHƯƠNG 26', title: 'Số liệu, tăng trưởng & kiếm tiền', sub: 'Content Creator · Chương 26' };

export const slides = S([

  /* 1 — bìa */
  cover({
    t: 'Chương 26 — Số liệu, tăng trưởng & kiếm tiền',
    sub: 'Đọc đúng bảng điều khiển đã có sẵn trên ba nền tảng · vòng lặp cải tiến hằng tuần · cộng đồng · kiếm tiền và phễu về website',
    chap: 'CHƯƠNG 26',
  }),

  /* 2 — mindmap bản đồ chương */
  {
    t: 'Bản đồ chương',
    body: mindmap('Số liệu, tăng trưởng & kiếm tiền', 'Chương 26', [
      { t: '📊 26.1 Đọc analytics', d: 'YouTube Studio · TikTok Studio · Meta Insights — một ngôn ngữ chung', c: 'red' },
      { t: '🔁 26.2 Vòng lặp cải tiến', d: 'Buổi xem số liệu hằng tuần · giả thuyết & thử nghiệm', c: 'ora' },
      { t: '💬 26.3 Cộng đồng', d: 'Bình luận, bài đăng cộng đồng, hợp tác, email/nhóm', c: 'amb' },
      { t: '💰 26.4 Kiếm tiền & phễu', d: 'YouTube/TikTok/Facebook ở Việt Nam · short → long → website → Pro', c: 'grn' },
      { t: '✅ Nối từ', d: 'Ch1.2 CTR/watch time · Ch3.2 retention · Ch14.3 đọc đồ thị · Ch20.4 Engaged views · Ch24.3 UTM', c: 'blu' },
      { t: '➡️ Ch27 kế tiếp', d: 'Dự án cuối khoá 30 ngày — áp dụng mọi thứ đã học', c: 'vio' },
    ]),
  },

  /* 3 — bảng tra: đã học ở đâu, chương 26 thêm gì */
  {
    t: 'Đã học rải rác — chương này gộp lại thành một thói quen',
    body: table(['Đã học ở đâu', 'Chương 26 thêm gì'], [
      ['Bài 1.2 — impression, CTR, watch time (lời chính YouTube)', 'Đúng CHỖ các số này nằm trong YouTube Studio thật'],
      ['Bài 3.2 — đồ thị giữ chân, "intro drop"', '4 kiểu tín hiệu trên đồ thị: phẳng · dốc dần · đỉnh · rơi'],
      ['Bài 14.3 — đọc hình dạng đường cong để sửa cách dựng', 'Phân khúc AI đang xem: mới/quay lại, đã đăng ký/chưa, tự nhiên/quảng cáo'],
      ['Bài 20.4 — Engaged views, Viewed vs. Swiped Away', 'Gộp vào một buổi xem số liệu HẰNG TUẦN, không xem rời rạc mỗi lúc rảnh'],
      ['Bài 24.3 — gắn UTM vào link về website', 'Đọc kết quả UTM thật trong Google Analytics'],
    ], { sm: true }),
  },

  /* 4 — 5 chỉ số cốt lõi */
  {
    t: 'Năm chỉ số cốt lõi của YouTube Studio',
    body: cards([
      { ic: '👁️', t: 'Impressions', d: 'Số lần thumbnail được CHO HIỆN RA — tính khi hiện quá 1 giây và ít nhất 50% khung hình lọt màn hình.', c: 'red' },
      { ic: '🎯', t: 'CTR (tỉ lệ nhấp)', d: 'Bao nhiêu phần impression đó biến thành một lượt xem thật — đo sức hút của tiêu đề và thumbnail.', c: 'ora' },
      { ic: '▶️', t: 'Views (lượt xem)', d: 'Tính ngay khi video BẮT ĐẦU phát, mọi định dạng, không còn ngưỡng thời gian (Bài 20.4).', c: 'amb' },
      { ic: '⏱️', t: 'Watch time', d: 'Tổng thời gian người xem đã bỏ ra cho video — cộng dồn mọi lượt xem.', c: 'grn' },
      { ic: '📏', t: 'Average view duration', d: 'Số phút xem TRUNG BÌNH của những người Ở LẠI xem — không tính người bỏ đi ngay.', c: 'blu' },
    ], 3),
  },

  /* 5 — chart 4 tín hiệu retention */
  {
    t: 'Đọc đồ thị giữ chân: bốn tín hiệu, không phải một đường tụt đều',
    body: chart({
      series: [{ t: 'Đồ thị giữ chân (minh hoạ)', c: 'tea', wd: 4, dy: -34, pts: [[0, 100], [3, 78], [8, 74], [20, 71], [30, 64], [38, 59], [42, 74], [46, 57], [52, 33], [58, 50], [70, 44], [85, 37], [100, 32]] }],
      x: [0, 100, '% thời lượng video'], y: [0, 100, '% người xem còn ở lại'], xt: 5, yt: 4,
      notes: [
        { x: 14, y: 72, t: 'Phẳng — xem trọn đoạn này', c: 'grn', dx: -10, dy: -34 },
        { x: 34, y: 61, t: 'Dốc dần — mất hứng thú', c: 'amb', dx: -10, dy: 28, anchor: 'end' },
        { x: 42, y: 74, t: 'Đỉnh — xem lại/chia sẻ', c: 'blu', dx: 10, dy: -22 },
        { x: 52, y: 33, t: 'Rơi — bỏ đoạn này', c: 'red', dx: 14, dy: 22 },
      ],
    }) + note('Đường MINH HOẠ hình dạng thường gặp (nối Bài 3.2/14.3), không phải số đo của video cụ thể. Bốn tín hiệu theo đúng YouTube Help: phẳng = xem hết đoạn đó; dốc dần = video "taper off" bình thường; đỉnh = xem lại/tua lại/chia sẻ; rơi = bỏ ngang đúng đoạn đó. Báo cáo chỉ tô 4 loại này khi video ≥ 60 giây và ≥ 100 lượt xem.'),
  },

  /* 6 — audience retention theo phân khúc */
  {
    t: 'Cùng một đồ thị, tách theo TỪNG NHÓM người xem',
    body: table(['Phân khúc (tab "Segments")', 'So sánh gì', 'Vì sao nhìn vào'], [
      ['Người xem mới ↔ quay lại', 'New viewers vs Returning viewers', 'Video này kéo được người LẠ hay chỉ fan cũ bấm vào'],
      ['Đã đăng ký ↔ chưa đăng ký', 'Subscriber vs non-subscriber', 'Nội dung có lọt ra ngoài vòng người đã biết bạn không'],
      ['Tự nhiên ↔ có trả tiền', 'Organic vs Paid traffic', 'Tách phần do quảng cáo kéo tới khỏi số liệu tự nhiên'],
    ], { sm: true }) + note('Theo YouTube Help: cả ba cặp nằm trong tab "Segments" của báo cáo Audience retention (chỉ ở cấp video), có thể cần bật Advanced Mode. Số lượt xem tuyệt đối của một đoạn có thể VƯỢT tổng view video — vì một người có thể xem lại đúng đoạn đó nhiều lần trong một lượt xem.'),
  },

  /* 7 — YouTube / TikTok / Meta cùng việc khác tên */
  {
    t: 'YouTube, TikTok, Meta — cùng một câu hỏi, khác tên gọi',
    body: table(['Muốn biết…', 'YouTube Studio', 'TikTok Studio', 'Meta Insights (FB/IG)'], [
      ['Bao nhiêu người THẤY trước khi bấm', 'Impressions + CTR', 'gộp trong lượt xem', 'Reach (lượt tiếp cận)'],
      ['Xem trung bình bao lâu', 'Average view duration', 'Average Watch Time', 'xem theo từng bài đăng'],
      ['Xem hết bao nhiêu phần trăm', 'Audience retention (đồ thị)', 'Completion Rate', 'không có chỉ số tương đương'],
      ['Có tương tác không', 'Watch time · like · share', 'like · share · comment', 'Engagement · accounts engaged'],
    ], { sm: true }) + note('Cột TikTok đã kiểm ở Bài 20.4 (TikTok Studio → Analytics → Content). Cột Meta theo help.instagram.com "About Instagram dashboards": mở từ Professional dashboard → Insights, cần chuyển tài khoản Business/Creator.'),
  },

  /* 8 — calendar buổi xem số liệu hằng tuần */
  {
    t: 'Buổi xem số liệu hằng tuần — một chỗ CỐ ĐỊNH trong lịch, không phải "lúc nào rảnh"',
    body: calendar([
      { w: 'Tuần này', days: [[], [], [{ t: 'QUAY DỒN', c: 'red' }], [], [{ t: 'Đăng dài', c: 'grn' }], [], [{ t: '📊 Xem số liệu', c: 'vio' }]] },
      { w: 'Tuần sau', days: [[], [], [{ t: 'QUAY DỒN', c: 'red' }], [], [{ t: 'Đăng dài', c: 'grn' }], [], [{ t: '📊 Xem số liệu', c: 'vio' }]] },
    ]) + note('30–45 phút mỗi Chủ nhật, SAU khi tuần đã đăng xong — nối đúng nhịp quay dồn/đăng dài của Bài 2.3. Không phải để "ngắm lượt xem" — để trả lời ba câu hỏi: CTR ổn không? Rớt ở đâu? Nguồn nào đổi?'),
  },

  /* 9 — flow giả thuyết & thử nghiệm */
  {
    t: 'Vòng lặp giả thuyết → thử nghiệm',
    body: flow([
      { e: '👀', t: '1. Quan sát', d: 'CTR thấp? Rớt sớm? Nguồn nào đổi?', c: 'red' },
      { e: '💡', t: '2. Giả thuyết', d: 'Đúng MỘT câu "vì sao" — không phải danh sách', c: 'ora' },
      { e: '🔧', t: '3. Đổi một thứ', d: 'Một biến mỗi lần: hook, thumbnail, độ dài…', c: 'amb' },
      { e: '🎬', t: '4. Video mới', d: 'Áp thay đổi đó, giữ nguyên mọi thứ khác', c: 'grn' },
      { e: '📈', t: '5. So sánh', d: 'Số liệu đổi đúng hướng giả thuyết không?', c: 'blu' },
    ]) + box('warn', 'Đổi <b>hai thứ cùng lúc</b> (vừa đổi thumbnail vừa đổi độ dài video) thì không bao giờ biết thứ nào thật sự tạo ra khác biệt. Chậm mà chắc thắng nhanh mà mù — tăng trưởng chậm, đều đặn là BÌNH THƯỜNG, không phải dấu hiệu thất bại.'),
  },

  /* 10 — nhân đôi video vượt trội trên chính kênh */
  {
    t: 'Nhân đôi video vượt trội — trên chính kênh BẠN, không phải kênh người khác',
    body: bars([
      { l: 'Video 1', v: 32, txt: '3,2k', c: 'blu' },
      { l: 'Video 2', v: 28, txt: '2,8k', c: 'blu' },
      { l: 'Video 3 — "vượt trội"', v: 94, txt: '9,4k', c: 'amb' },
      { l: 'Video 4', v: 35, txt: '3,5k', c: 'blu' },
      { l: 'Video 5', v: 30, txt: '3,0k', c: 'blu' },
    ], { lw: 230 }) + note('Số liệu MINH HOẠ. Đúng phương pháp "video vượt trội" ở Bài 2.1 — chỉ khác một chỗ: lần này bạn sắp tab Videos của CHÍNH kênh mình theo phổ biến nhất, rồi hỏi "vì sao video này vượt xa mức thường" TRƯỚC khi lên kịch bản làm thêm video cùng hướng.'),
  },

  /* 11 — cộng đồng, phần 1: tương tác trực tiếp */
  {
    t: 'Giữ người đã tới — tương tác trực tiếp',
    body: cards([
      { ic: '💬', t: 'Trả lời & ghim bình luận', d: 'Ưu tiên câu hỏi thật trong giờ đầu — trả lời là một tín hiệu hài lòng (Bài 1.2).', c: 'red' },
      { ic: '📝', t: 'Bài đăng cộng đồng', d: 'Thăm dò ý kiến, hé lộ video sắp ra — giữ kênh "còn sống" giữa hai lần đăng.', c: 'ora' },
      { ic: '🎙️', t: 'Livestream hỏi đáp', d: 'Gặp khán giả trực tiếp — câu hỏi họ đặt ra là nguồn ý tưởng (Bài 2.1).', c: 'amb' },
    ], 3) + note('Ưu tiên ba việc này trong 48 giờ đầu sau khi đăng — video còn mới, bình luận còn ít, một câu trả lời của bạn dễ được thấy nhất và là tín hiệu hài lòng sớm (Bài 1.2/26.1).'),
  },

  /* 12 — cộng đồng, phần 2: mở rộng & bảo vệ */
  {
    t: 'Mở rộng ra ngoài kênh — và tự bảo vệ mình',
    body: cards([
      { ic: '🤝', t: 'Hợp tác creator', d: 'Video chung với kênh cùng ngách — mượn khán giả của nhau sòng phẳng.', c: 'grn' },
      { ic: '📧', t: 'Danh sách email / nhóm', d: 'Kênh DUY NHẤT không phụ thuộc thuật toán — dẫn từ mô tả video, giống hub Bài 1.4.', c: 'blu' },
      { ic: '🛡️', t: 'Bình luận tiêu cực', d: 'Góp ý thật thì trả lời tử tế; công kích/spam thì ẩn hoặc chặn — đừng để bụng.', c: 'pnk' },
    ], 3) + note('Ba việc này không hiện trong bảng số liệu nào — nhưng chúng quyết định một người xem một lần có QUAY LẠI hay không (tab Segments, Bài 26.1).'),
  },

  /* 13 — YouTube Partner Program hai mức */
  {
    t: 'Kiếm tiền trên YouTube — hai mức, không phải một cửa duy nhất',
    body: table(['Điều kiện', 'Mức 1 — Fan funding & Shopping', 'Mức 2 — Doanh thu quảng cáo'], [
      ['Subscriber', '500', '1.000'],
      ['Giờ xem / view Shorts', '3.000 giờ/12 tháng HOẶC 3 triệu view Shorts/90 ngày', '4.000 giờ/12 tháng HOẶC 10 triệu view Shorts/90 ngày'],
      ['Khác', '+3 video công khai hợp lệ trong 90 ngày gần nhất', '(đã có sẵn từ Mức 1)'],
      ['Mở khoá', 'Channel memberships · Super Chat/Sticker · Super Thanks · quà tặng · Shopping', 'Chia sẻ quảng cáo + YouTube Premium'],
    ], { sm: true }) + box('good', '<b>Việt Nam nằm trong danh sách quốc gia đủ điều kiện</b> (kiểm 23/09/2026, support.google.com/youtube/answer/13429240). Điều kiện chung cả hai mức: đúng chính sách kiếm tiền, bật Xác minh 2 bước, có một tài khoản AdSense for YouTube đang liên kết.'),
  },

  /* 14 — TikTok & Facebook ở Việt Nam */
  {
    t: 'TikTok & Facebook — kiểm tới 09/2026, đừng tin lời đồn',
    body: table(['Nền tảng', 'Chương trình', 'Việt Nam?'], [
      ['TikTok', 'Creator Rewards Program', '-KHÔNG — chỉ mở cho tài khoản đăng ký ở Mỹ, Anh, Đức, Nhật, Hàn, Pháp, Mexico, Brazil'],
      ['Facebook', 'Content monetisation (thay in-stream ads cũ, hết hạn 31/08/2025)', '!Chỉ theo LỜI MỜI — trang chính thức không công bố ngưỡng lẫn danh sách quốc gia'],
      ['YouTube', 'Partner Program', '+CÓ — xem slide trước'],
    ], { sm: true }) + box('warn', 'Đừng tin bài blog nói "TikTok Việt Nam đã có Creator Fund/Rewards" — trang Creator Academy CHÍNH THỨC của TikTok (cập nhật 11/09/2026) liệt kê đúng 8 nước, Việt Nam không có trong đó. Facebook thì đơn giản là CHƯA công bố ngưỡng hay danh sách quốc gia cho chương trình mới — không có gì để trích.'),
  },

  /* 15 — funnel phễu về website */
  {
    t: 'Phễu: từ video ngắn tới gói Pro',
    body: funnel([
      { t: 'Video ngắn', d: 'Hook 3 giây · một ý', c: 'tea' },
      { t: 'Video dài', d: 'Xây niềm tin, giải quyết vấn đề', c: 'blu' },
      { t: 'cuongthai.com', d: 'Link mô tả gắn UTM', c: 'amb' },
      { t: 'Gói Pro', d: 'Đích cuối của phễu', c: 'grn' },
    ], { w: 560 }) + note('Đo đúng nền tảng nào đang đẩy người qua phễu: mỗi nền tảng một link gắn UTM riêng (Bài 24.3) → đọc kết quả thật trong Google Analytics ở Báo cáo → Thu hút lưu lượng truy cập (Traffic acquisition), lọc theo Session source/medium.'),
  },

  /* 16 — thực hành */
  {
    t: '🎬 Thực hành chương 26',
    body: steps([
      ['Mở YouTube Studio → Analytics → tab Nội dung, ghi lại Impressions, CTR và Average view duration của video gần nhất.', 'Có TikTok/Instagram thì ghi thêm Average Watch Time hoặc Reach.'],
      ['Mở báo cáo Audience retention của một video, tìm đúng một chỗ "phẳng" và một chỗ "rơi" — viết một câu đoán vì sao.'],
      ['Đặt lịch buổi xem số liệu Chủ nhật tới (30–45 phút) vào /creator/calendar hoặc lịch cá nhân.'],
      ['Viết đúng MỘT giả thuyết cải tiến cho video kế tiếp — đổi đúng một thứ so với video trước.'],
      ['Kiểm trang YouTube Partner Program chính thức xem kênh bạn còn thiếu bao nhiêu để tới 500 subscriber.'],
    ]) + box('good', '<b>Đạt khi:</b> có ba con số Impressions/CTR/Average view duration thật của kênh bạn, một câu đoán về một chỗ "rơi" trên đồ thị giữ chân, và một giả thuyết cải tiến đã viết ra cho video kế tiếp.'),
  },
]);
