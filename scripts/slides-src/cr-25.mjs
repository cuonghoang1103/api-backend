/** Content Creator · Deck cr-25 — Chương 25: Thumbnail & tiêu đề. */
import { S, cover, cards, box, steps, table, vs, flow, mindmap, kpis, two, note, personShot, chart, esc } from './_cr-chung.mjs';

export const deck = { key: 'cr-25', code: 'CR · CHƯƠNG 25', title: 'Thumbnail & tiêu đề', sub: 'Content Creator · Chương 25' };

/* Thanh minh hoạ 100 ký tự tiêu đề, vùng 60 đầu luôn hiện trong kết quả tìm kiếm */
const truncBar = (() => {
  const w = 1000, cut = w * 0.6;
  return `<div style="position:relative;width:${w}px;height:64px;border-radius:10px;overflow:hidden;border:2px solid #2a3446">
    <div style="position:absolute;inset:0;background:#1a3a2c"></div>
    <div style="position:absolute;left:${cut}px;top:0;bottom:0;right:0;background:#3a2020"></div>
    <div style="position:absolute;left:0;top:0;bottom:0;width:3px;background:#fff"></div>
    <div style="position:absolute;left:${cut}px;top:0;bottom:0;width:3px;background:#ffc233"></div>
    <div style="position:absolute;left:${w}px;top:0;bottom:0;width:3px;background:#fff;transform:translateX(-3px)"></div>
    <div style="position:absolute;left:14px;top:8px;font:700 15px 'SF Mono',Menlo,monospace;color:#7ff0c4">0 · luôn hiện trên mọi thiết bị</div>
    <div style="position:absolute;left:${cut + 10}px;top:8px;font:700 15px 'SF Mono',Menlo,monospace;color:#ffc233">~60 · nhiều thiết bị cắt từ đây</div>
    <div style="position:absolute;right:14px;bottom:6px;font:700 15px 'SF Mono',Menlo,monospace;color:#ffb3ba">~100 · trần Studio khuyên</div>
  </div>`;
})();

/* Hai mockup thumbnail tự vẽ: rối (nhiều font/màu/yếu tố chỏi nhau) và gọn (1 điểm nhìn) */
const messyThumb = `<div style="position:relative;width:520px;height:293px;border-radius:10px;overflow:hidden;background:linear-gradient(135deg,#ff004c,#ffee00 42%,#00c2ff 76%,#7b2ff7)">
  <div style="position:absolute;left:8px;top:2px;font:900 32px/1 Arial;color:#fff;text-shadow:2px 2px 0 #000">CÁCH ĐỂ THÀNH CÔNG</div>
  <div style="position:absolute;left:14px;top:78px;font:900 30px/1 Arial;color:#ff0;text-shadow:2px 2px 0 #000;transform:rotate(-7deg)">CỰC NHANH!!</div>
  <div style="position:absolute;right:10px;top:14px;font:900 48px/1 Arial;color:#0f0;text-shadow:2px 2px 0 #000">100%</div>
  <div style="position:absolute;left:120px;top:150px;font:800 21px/1.2 Arial;color:#fff;background:#000;padding:3px 8px">XEM NGAY KẺO LỠ</div>
  <div style="position:absolute;right:10px;bottom:6px;width:84px;height:84px;border-radius:50%;background:#ffb703;border:4px solid #000;display:flex;align-items:center;justify-content:center;font-size:38px">😮</div>
  <div style="position:absolute;left:6px;bottom:6px;width:66px;height:66px;border-radius:50%;background:#06d6a0;border:4px solid #000;display:flex;align-items:center;justify-content:center;font-size:28px">🔥</div>
  <svg style="position:absolute;inset:0" viewBox="0 0 520 293"><path d="M270 6 L470 130" stroke="#fff" stroke-width="6"/><path d="M264 -4 L290 16 L263 30" fill="#fff"/></svg>
</div>`;
const cleanThumb = `<div style="position:relative;width:520px;height:293px;border-radius:10px;overflow:hidden;background:linear-gradient(160deg,#0b1120,#1c2740)">
  <div style="position:absolute;right:-30px;bottom:-30px;width:220px;height:220px;border-radius:50%;background:#22d3a5;opacity:.14"></div>
  <div style="position:absolute;left:26px;top:44px;font:900 60px/1 -apple-system,Arial;color:#ffd23f;text-shadow:0 4px 0 #0b1120">VPS</div>
  <div style="position:absolute;left:26px;top:118px;font:900 54px/1 -apple-system,Arial;color:#fff;text-shadow:0 4px 0 #0b1120">20 PHÚT</div>
  <div style="position:absolute;right:34px;bottom:22px;width:68px;height:68px;border-radius:50%;background:#1fbf75;border:4px solid #0b1120;display:flex;align-items:center;justify-content:center;font:900 32px Arial;color:#0b1120">✓</div>
</div>`;

/* Lưới gợi ý trên điện thoại: 2 thẻ video xếp dọc, thẻ đầu dùng đúng thumb-gọn ở trên thu nhỏ */
const phoneList = (() => {
  const cardW = 210, thumbH = 112;
  const row = (label, sub, mini) => `<div style="padding:7px 14px">
    <div style="width:${cardW}px;height:${thumbH}px;border-radius:8px;overflow:hidden;position:relative;background:#1a2030">${mini}</div>
    <div style="font-size:12px;color:#fff;font-weight:700;margin-top:4px;line-height:1.25">${esc(label)}</div>
    <div style="font-size:10.5px;color:#8f9bb0;margin-top:1px">${esc(sub)}</div>
  </div>`;
  const miniClean = `<div style="transform:scale(${(cardW / 520).toFixed(4)});transform-origin:0 0">${cleanThumb}</div>`;
  const miniOther1 = `<div style="position:absolute;inset:0;background:linear-gradient(160deg,#182034,#0d1220);display:flex;align-items:center;justify-content:center;font:700 12px -apple-system,Arial;color:#c9d3e2">B-roll thư viện FPTU</div>`;
  return `<div style="width:${cardW + 44}px;border:7px solid #1e2533;border-radius:26px;background:#0b0e14;overflow:hidden;box-shadow:0 0 0 2px #3a4558">
    <div style="padding:8px 14px 2px;font:700 11.5px -apple-system,Arial;color:#8f9bb0">Đề xuất cho bạn</div>
    ${row('Deploy Next.js lên VPS trong 20 phút', 'cuongthai · 3,2 N lượt xem', miniClean)}
    ${row('Một ngày của SV FPTU đi thực tập', 'cuongthai · 890 lượt xem', miniOther1)}
  </div>`;
})();

export const slides = S([
  cover({ t: 'Chương 25 — Thumbnail & tiêu đề', sub: 'Đóng gói là lời hứa · Viết tiêu đề · Thiết kế đọc được ở cỡ nhỏ · Test & Compare', chap: 'CHƯƠNG 25' }),

  { t: 'Bản đồ chương', body: mindmap('Thumbnail & tiêu đề', 'thắng ĐÚNG cú bấm', [
    { t: '🔁 Vòng lặp đóng gói', d: 'Ý tưởng → lời hứa → video → đo → sửa', c: 'red' },
    { t: '✍️ Công thức tiêu đề', d: '6 công thức, khi nào dùng cái nào', c: 'ora' },
    { t: '🖼 Nguyên tắc thumbnail', d: '1 điểm nhìn · mặt cảm xúc · tương phản', c: 'amb' },
    { t: '📐 Kích thước & công cụ', d: 'Thông số YouTube thật · giá đã kiểm', c: 'grn' },
    { t: '🧪 Test & Compare', d: 'YouTube tự thử — thắng bằng watch time', c: 'blu' },
    { t: '📊 CTR có ngữ cảnh', d: 'CTR thấp không tự động là xấu', c: 'vio' },
  ]) },

  { t: 'Đóng gói không dừng lại lúc bấm quay', body: flow([
    { e: '💡', t: 'Ý tưởng', d: 'chấm điểm ở Bài 2.2', c: 'vio' },
    { e: '🎁', t: 'Đóng gói', d: 'viết tiêu đề + phác thumbnail', c: 'red' },
    { e: '🎬', t: 'Quay & dựng', d: 'video phải TRẢ đúng lời hứa', c: 'ora' },
    { e: '🚀', t: 'Đăng', d: 'tiêu đề + thumbnail thật lên YouTube', c: 'amb' },
    { e: '📊', t: 'Đo', d: 'CTR, watch time, Test & Compare', c: 'grn' },
    { e: '🔧', t: 'Sửa lại', d: 'đổi thumbnail/tiêu đề nếu cần', c: 'blu' },
  ]) + note('Mũi tên cuối quay ngược lại "Đóng gói" — Bài 25.4 khép vòng lặp này. Đóng gói không phải một quyết định một lần rồi thôi.') },

  { t: 'Lời hứa phải được video trả', body: table(['Tiêu đề', 'Lời hứa', 'Video thực tế', 'Hậu quả'], [
    ['"Deploy VPS chỉ 5 PHÚT!!"', 'Xong trong 5 phút', 'Video dài 20 phút, có đoạn cài đặt bị cắt', '-Bỏ giữa chừng · report "gây hiểu lầm"'],
    ['"Deploy Next.js lên VPS trong 20 phút"', 'Toàn bộ quy trình, đúng 20 phút', 'Video 19–21 phút, đủ bước như hứa', '+Xem hết · hài lòng · tin lần sau'],
  ]) + box('warn', 'Chính sách "Thumbnails" của YouTube (đã kiểm) gọi đây là <b>malicious clickbait / misleading metadata</b> — nhẹ thì gỡ thumbnail + cảnh cáo, nặng thì strike, ba strike trong 90 ngày có thể mất kênh.') },

  { t: '6 công thức viết tiêu đề', body: table(['Công thức', 'Dùng khi nào', 'Ví dụ'], [
    ['Tò mò (curiosity gap)', 'Có một khoảng hở thông tin đáng tò mò', '"Vì sao code chạy trên máy tôi mà vỡ trên VPS"'],
    ['Con số', 'Nội dung liệt kê được, đo được', '"7 lệnh git tôi dùng mỗi ngày đi thực tập"'],
    ['Cách làm (how-to)', 'Hướng dẫn từng bước, ý định tìm kiếm rõ', '"Cách deploy Next.js lên VPS bằng Docker"'],
    ['Biến đổi (trước/sau)', 'Có kết quả đo được trước và sau', '"Web tải 4 giây → 0,8 giây, tôi đã sửa gì"'],
    ['Cảnh báo / sai lầm', 'Bạn từng mắc lỗi thật, muốn cứu người khác', '"Lỗi Prisma khiến tôi mất dữ liệu production"'],
    ['Câu hỏi', 'Đúng câu người học đang tự hỏi', '"Học lập trình có cần giỏi tiếng Anh trước không?"'],
  ], { sm: true }) },

  { t: 'Độ dài hiển thị, và từ khoá vs tò mò', body: truncBar +
    `<p style="font-size:16.5px;color:#a3aec0;margin:6px 0 14px">Bài 24.2 đã đo: tiêu đề nên dưới <b style="color:#fff">~100 ký tự</b>, quan trọng nhất nằm trong <b style="color:#fff">~60 ký tự đầu</b>. Nhưng ĐẶT GÌ vào vùng đó tuỳ ý định người xem:</p>` +
    table(['', 'Tối ưu TÌM KIẾM', 'Tối ưu ĐỀ XUẤT'], [
    ['Người xem đang làm gì', 'Gõ đúng từ họ cần (Bài 1.1)', 'Lướt Trang chủ / Xem tiếp — chưa gõ gì'],
    ['Đặt gì lên đầu tiêu đề', 'Từ khoá thật ("Deploy Next.js VPS")', 'Móc tò mò ("Tôi suýt mất cả trang web")'],
  ], { sm: true }) },

  { t: 'Nguyên tắc thiết kế thumbnail đọc được ở cỡ nhỏ', body: cards([
    { ic: '🎯', t: 'Một điểm nhìn', d: 'mắt người xem phải biết nhìn đâu TRƯỚC trong nửa giây', c: 'red' },
    { ic: '😮', t: 'Mặt người có cảm xúc', d: 'khuôn mặt kéo mắt nhanh hơn bất cứ gì khác', c: 'ora' },
    { ic: '⚫⚪', t: 'Tương phản mạnh', d: 'chữ/chủ thể tách hẳn khỏi nền, không chìm', c: 'amb' },
    { ic: '3️⃣', t: '≤ 3 yếu tố', d: 'người, chữ, 1 điểm nhấn — hết, đừng nhồi thêm', c: 'grn' },
    { ic: '🔤', t: '≤ 4 chữ trên hình', d: 'thumbnail không phải chỗ viết cả câu', c: 'blu' },
    { ic: '📱', t: 'Đọc được ở cỡ nhỏ', d: 'kiểm thật, đừng đoán — slide 11', c: 'vio' },
  ], 3) },

  { t: 'Thumbnail rối vs gọn — tự dựng để so', body: `<div class="c-vs"><div class="no"><h4>❌ Rối</h4>${messyThumb}<p style="font-size:15px;color:#d6deea;margin-top:8px">7 yếu tố, 4 font, viền chữ lem, mũi tên vô nghĩa — mắt không biết nhìn đâu trước.</p></div><div class="yes"><h4>✅ Gọn</h4>${cleanThumb}<p style="font-size:15px;color:#d6deea;margin-top:8px">1 lời hứa 3 từ, 1 huy hiệu, tương phản vàng/trắng trên nền tối — đọc được trong nửa giây.</p></div></div>` },

  { t: 'Thu nhỏ xuống lưới gợi ý trên điện thoại', body: two(phoneList, box('good', 'Thẻ đầu dùng đúng bản "gọn" ở slide trước, thu nhỏ còn <b>~210px</b> rộng — vẫn đọc được "VPS" và dấu ✓ dù không còn đọc được câu chữ nhỏ. <b>210px là bố cục minh hoạ của slide này</b>, không phải kích thước chính thức của lưới YouTube — slide "Chạy thật" kiểm ở cỡ 168px, còn nhỏ hơn nữa.') + note('Lý do "≤ 4 chữ, cỡ chữ to" ở slide trước không phải gu thẩm mỹ — đó là điều kiện để còn đọc được sau khi bị thu nhỏ.'), 'l2') },

  { t: 'Thumbnail tuỳ chỉnh — thông số thật của YouTube (đã kiểm 09/2026)', body: table(['Mục', 'Khuyến nghị', 'Ghi chú'], [
    ['Độ phân giải', '!3840×2160', 'Rộng tối thiểu 640px — số 1280×720 lưu truyền là số CŨ'],
    ['Tỉ lệ khung', '16:9', 'Giống video, không phải hình vuông'],
    ['Định dạng file', 'JPG hoặc PNG', 'GIF động không dùng được cho thumbnail'],
    ['Dung lượng tối đa', '2MB (tải từ điện thoại)', '50MB nếu tải từ máy tính/Studio web'],
    ['Điều kiện dùng được', '!Tài khoản đã xác minh', 'Không xác minh → chỉ chọn ảnh YouTube tự trích từ video'],
  ]) + note('Nguồn: YouTube Help "Add video thumbnails". Nhiều bài viết trên mạng vẫn ghi 1280×720 — đó là khuyến nghị cũ, đã đổi.') },

  // Ảnh mẫu nằm TRÊN, bốn ô số trải hết bề ngang: xếp hai cột (two) làm mỗi ô
  // chỉ còn ~90px nên nhãn rớt mỗi dòng một từ — đo trên bản render 23/09.
  { t: 'Chạy thật — dựng ảnh mẫu rồi thu nhỏ, đo bằng số', body:
    `<div style="display:flex;justify-content:center;margin:-4px 0 -96px">
      <div style="transform:scale(0.56);transform-origin:top center">${cleanThumb}</div>
    </div>` +
    kpis([
      { v: '1280×720', l: 'ảnh gốc · JPEG', c: 'blu' },
      { v: '48,8 KB', l: 'dung lượng gốc — dưới hạn 2MB rất xa', c: 'grn' },
      { v: '168×94', l: 'thu nhỏ bằng ffmpeg scale', c: 'amb' },
      { v: '3,0 KB', l: 'sau khi thu nhỏ — chữ vẫn đọc được', c: 'vio' },
    ]) + note('Số đo THẬT trên máy này: dựng 1 ảnh 1280×720 rồi `ffmpeg -i … -vf scale=168:94 …`, đo bằng `ls -la`. Không phải số minh hoạ.') },

  { t: 'Công cụ thiết kế & giá (đã kiểm 09/2026)', body: cards([
    { ic: '🎨', t: 'Photoshop', big: '~$22,99/tháng', d: 'gói Single App (máy tính + web + di động)', c: 'red' },
    { ic: '🖌️', t: 'Pixelmator Pro', big: '$49,99 một lần', d: 'Mac — hoặc trong Apple Creator Studio $12,99/tháng (có bản iPad)', c: 'ora' },
    { ic: '🆓', t: 'Affinity (by Canva)', big: 'Miễn phí', d: 'Mac/Windows, cần tài khoản Canva; bản iPad hợp nhất chưa ra mắt', c: 'grn' },
    { ic: '🌐', t: 'Canva', big: 'Free / ~$18/tháng', d: 'bản Free đủ cắt/chữ cơ bản; Pro thêm tách nền, đổi cỡ hàng loạt', c: 'blu' },
    { ic: '🧩', t: 'Figma', big: 'Miễn phí', d: 'gói Starter đủ dùng cho một người tự thiết kế thumbnail', c: 'vio' },
  ], 3) + box('warn', 'Giá đổi liên tục và theo khu vực — đây là giá USD kiểm qua trang của chính hãng 09/2026, kiểm lại trước khi trả tiền.') },

  { t: 'Chụp thumbnail ngay trong buổi quay dồn', body: steps([
    ['Giữ nguyên đèn/khung của A-roll vừa quay xong', 'Đừng dọn máy rồi mới nhớ ra cần ảnh.'],
    ['Chuyển sang camera chính 48MP của iPhone (không phải ống góc rộng)', 'Bài 6.2 — camera Fusion 48MP, tương đương 24mm.'],
    ['Diễn đúng biểu cảm khớp lời hứa đã viết ở Bài 25.1', 'Ngạc nhiên, tự tin, "vừa xong!" — không phải mặt vô hồn.'],
    ['Chụp 5–8 biến thể biểu cảm/góc, chọn lúc dựng', 'Có ảnh để chọn còn hơn quay lại một mình sau đó.'],
  ]) + note('Đúng khung giờ 14:30–15:00 trong buổi quay dồn mẫu của Bài 2.3 — chụp thumbnail là VIỆC CUỐI, không phải việc phát sinh.') },

  { t: 'Test & Compare — YouTube tự thử giúp bạn', body: kpis([
    { v: '3', l: 'biến thể tối đa: tiêu đề, thumbnail, hoặc cả hai', c: 'red' },
    { v: '~2 tuần', l: 'thời gian một lượt thử chạy xong', c: 'ora' },
    { v: 'Watch time', l: 'chỉ số QUYẾT ĐỊNH người thắng', c: 'amb' },
    { v: 'KHÔNG phải CTR', l: 'YouTube nói rõ: tối ưu watch time hơn CTR', c: 'grn' },
  ]) + box('info', 'Chỉ chạy trên máy tính qua YouTube Studio, cần bật "advanced features". Không thử được trên Shorts, live đã hẹn giờ, hay video Premiere.') },

  { t: 'CTR đọc trong ngữ cảnh impression', body: chart({
    series: [{ pts: [[10000, 9], [100000, 3.5]], c: 'amb' }],
    x: [0, 110000, 'impression (lượt hiển thị)'], y: [0, 10, 'CTR (%)'], xt: 5, yt: 5,
    xfmt: (v) => v >= 1000 ? `${v / 1000}k` : v, yfmt: (v) => `${v}%`,
    // Hai nhãn bên phải phải nằm DƯỚI điểm cuối: đặt ngang/trên thì đường
    // dốc xuống cắt ngang qua chữ (thấy trên bản render 23/09).
    notes: [{ x: 10000, y: 9, t: '10.000 impr · 9%', c: 'blu', dx: 16, dy: -12, anchor: 'start' }, { x: 100000, y: 3.5, t: '100.000 impr · 3,5%', c: 'grn', dx: -10, dy: 26, anchor: 'end' }, { x: 100000, y: 3.5, t: 'KHÔNG xấu hơn — chỉ rộng hơn', c: 'grn', dx: -10, dy: 46, anchor: 'end' }],
  }) + note('Ví dụ số ĐÃ KIỂM từ YouTube Help "Decoding CTR & impressions" — không phải video thật của bạn. CTR giảm vì video chạm tới khán giả rộng hơn (Trang chủ, ý định xem lướt), không phải vì thumbnail tệ đi.') },

  { t: '🎬 Thực hành chương 25', body: steps([
    ['Viết <b>3 tiêu đề</b> theo 3 công thức khác nhau cho một ý tưởng đang có trong /creator/ideas', 'Đọc lại: tiêu đề nào khiến chính bạn muốn bấm nhất?'],
    ['Dựng <b>1 thumbnail thật</b> theo nguyên tắc ≤3 yếu tố / ≤4 chữ, xuất đúng JPG/PNG dưới hạn dung lượng', 'Chụp bằng iPhone 48MP nếu đang có buổi quay.'],
    ['Thu nhỏ ảnh còn khoảng <b>168px rộng</b> (Preview, hoặc &#96;ffmpeg -vf scale=168:-1&#96;) và tự hỏi: chữ còn đọc được không?', 'Đọc không nổi thì bớt chữ, tăng tương phản — đừng đoán.'],
    ['Nếu kênh đủ điều kiện, bật <b>Test & Compare</b> cho một video sắp đăng', 'Không đủ điều kiện thì ghi lại CTR/impression thật để so sau — nối Bài 26.1.'],
  ]) + box('good', '<b>Đạt khi:</b> có 3 tiêu đề viết theo công thức, 1 ảnh thumbnail thật đã thu nhỏ kiểm chữ, và biết được kênh của bạn có Test & Compare hay chưa.') },
]);
