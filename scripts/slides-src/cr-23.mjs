/** Content Creator · Deck cr-23 — Chương 23: Video song ngữ Việt – Anh. */
import { S, cover, mindmap, vs, cards, table, flow, timeline, steps, box, note } from './_cr-chung.mjs';

export const deck = { key: 'cr-23', code: 'CR · CHƯƠNG 23', title: 'Video song ngữ Việt – Anh', sub: 'Content Creator · Chương 23' };

export const slides = S([
  cover({ t: 'Chương 23 — Video song ngữ Việt – Anh', sub: 'Một kênh hay hai kênh · kịch bản tiếng Anh cho người mới · phụ đề & âm thanh đa ngôn ngữ · quy trình hai phiên bản', chap: 'CHƯƠNG 23' }),

  { t: 'Bản đồ chương', body: mindmap('Video song ngữ Việt – Anh', 'Chương 23', [
    { t: '🌐 Chiến lược', d: 'Một kênh hay hai kênh, nội dung nào hợp tiếng nào', c: 'red' },
    { t: '✍️ Kịch bản tiếng Anh', d: 'Từ vựng B1, AI chỉnh giữ giọng mình, luyện phát âm', c: 'ora' },
    { t: '📝 Phụ đề & lồng tiếng', d: 'Dịch SRT, âm thanh đa ngôn ngữ, auto dub, disclosure', c: 'amb' },
    { t: '🎬 Quy trình 2 phiên bản', d: 'Quay chung hay lồng tiếng, track riêng theo ngôn ngữ', c: 'tea' },
    { t: '✅ Nối từ', d: 'Ch1 khán giả VN/quốc tế · Ch3 teleprompter · Ch16 SRT/Whisper · Ch18 disclosure', c: 'blu' },
    { t: '➡️ Nối tới', d: 'Ch24 xuất & đăng đa ngôn ngữ', c: 'vio' },
  ]) },

  { t: 'Một kênh hay tách hai kênh riêng?', body: vs({
    no: { t: 'Tách hai kênh riêng ngay từ đầu', items: [
      'Gấp đôi việc — ý tưởng, quay, dựng, đăng — cho MỘT video gốc',
      'Mỗi kênh khởi đầu lại từ 0 lượt đăng ký, thuật toán chưa hiểu kênh',
      'Khó giữ nhịp đăng đều ở CẢ HAI nơi cùng lúc (Ch2.3 đã học cái giá của lịch đăng thất thường)',
    ] },
    yes: { t: 'Một kênh, gắn ngôn ngữ đúng cách', items: [
      'Một lượt quay/dựng phục vụ cả hai khán giả — qua phụ đề và/hoặc âm thanh dịch',
      'Giữ trọn lượt xem, đăng ký, dữ liệu thuật toán đã học về kênh — không chia nhỏ',
      'YouTube có sẵn 3 cơ chế cho đúng việc này (slide sau) — không cần kênh thứ hai để dùng',
    ] },
  }) },

  { t: 'Nội dung nào hợp tiếng nào', body: cards([
    { ic: '💻', t: 'Bài giảng lập trình sâu', d: 'Thuật ngữ code vốn đã tiếng Anh — ưu tiên tiếng Việt trước, thêm phụ đề Anh sau.', c: 'blu' },
    { ic: '🎒', t: 'Vlog đời sống, học tập ở VN', d: 'Ngữ cảnh và chuyện riêng ở Việt Nam — tiếng Việt là nhà, đừng ép dịch mọi video.', c: 'amb' },
    { ic: '⚡', t: 'Video ngắn — một mẹo/ý duy nhất', d: 'Ít lời, dễ thêm bản phụ đề Anh nhất — chi phí song ngữ thấp nhất trong khoá.', c: 'grn' },
    { ic: '🌍', t: 'Video cho hồ sơ, nhà tuyển dụng quốc tế', d: 'Ưu tiên tiếng Anh, kèm phụ đề Việt — đúng khán giả mục tiêu đọc tiếng Anh.', c: 'pnk' },
  ], 2) },

  { t: '4 cơ chế đa ngôn ngữ của YouTube', body: table(
    ['Cơ chế', 'Bạn phải làm', 'Người xem nhận được', 'Ai dùng được (09/2026)'],
    [
      ['Tiêu đề & mô tả dịch', 'Studio → Subtitles → ADD LANGUAGE → mục Title and description → Add → Publish', 'Tên/mô tả hiện bằng ngôn ngữ họ tìm kiếm — vào được kết quả tìm kiếm ngôn ngữ đó', '+Mọi kênh'],
      ['Phụ đề dịch (mềm)', 'Cùng màn hình Subtitles → ADD LANGUAGE → Upload file .srt cho ngôn ngữ đó', 'Bật phụ đề đúng ngôn ngữ họ chọn, giọng gốc giữ nguyên', '+Mọi kênh'],
      ['Âm thanh đa ngôn ngữ', 'Studio → Languages → Add Language → mục Dub → tự thu, tải file âm thanh riêng', 'Nghe giọng lồng khớp ngôn ngữ họ chọn, hình miệng vẫn theo bản gốc', '-Cần quyền Advanced features'],
      ['Lồng tiếng tự động', 'Bật/tắt ở app Studio → Settings → Content → Automatic dubbing', 'Nghe bản lồng AI tự động — không sửa trực tiếp được', '!Bật sẵn nếu đủ điều kiện'],
    ], { sm: true },
  ) + note('Cả 4 cơ chế nằm trong Studio của MỘT kênh — không cơ chế nào cần kênh thứ hai. Chi tiết & nguồn ở Bài 23.3.') },

  { t: 'Thuật ngữ creator EN ↔ VI (trích)', body: table(['Thuật ngữ EN', 'Nghĩa tiếng Việt ngắn'], [
    ['Hook', 'Mở đầu gây chú ý trong vài giây đầu'],
    ['Retention', 'Tỷ lệ giữ chân người xem theo thời gian'],
    ['B-roll', 'Cảnh phụ minh hoạ, chèn xen cảnh chính'],
    ['Jump cut', 'Cắt nhảy — bỏ đoạn giữa cùng một cảnh'],
    ['CTR', 'Tỷ lệ bấm vào video trên số lần hiển thị'],
    ['Watch time', 'Tổng thời gian xem tích luỹ'],
    ['Thumbnail', 'Ảnh đại diện video'],
    ['Dub / Dubbing', 'Lồng tiếng — thay giọng gốc bằng ngôn ngữ khác'],
    ['Shadowing', 'Nghe rồi nói lại NGAY theo đúng ngữ điệu để luyện phát âm'],
    ['Localization', 'Bản địa hoá — chỉnh nội dung hợp văn hoá/ngôn ngữ đích'],
    ['Evergreen content', 'Nội dung không lỗi thời theo thời gian'],
  ], { sm: true }) + note('Bảng đầy đủ hơn 30 từ nằm trong Bài 23.2.') },

  { t: 'Viết kịch bản tiếng Anh khi chưa giỏi', body: flow([
    { e: '🇻🇳', t: 'Viết ý bằng tiếng Việt trước', d: 'Rõ ý trước — đừng cố nghĩ bằng tiếng Anh ngay', c: 'red' },
    { e: '✂️', t: 'Câu ngắn, từ B1, hiện tại đơn', d: 'Ưu tiên câu chủ động, tránh mệnh đề phụ dài', c: 'ora' },
    { e: '🤖', t: 'AI chỉnh ngữ pháp — giữ giọng mình', d: 'Sửa lỗi sai, không đổi ý hay thay hết bằng từ hoa mỹ', c: 'amb' },
    { e: '🔊', t: 'Luyện phát âm từ khó', d: 'Shadowing + YouGlish cho từng cụm — slide sau', c: 'tea' },
    { e: '🎤', t: 'Quay từng đoạn qua teleprompter', d: 'Tab Nhắc lời của /creator — đã dựng ở Ch3.4', c: 'blu' },
  ]) },

  { t: 'Luyện phát âm: 2 công cụ + 1 thói quen', body: cards([
    { ic: '🗣️', t: 'Shadowing', d: 'Nghe một câu, nói lại NGAY theo đúng ngữ điệu — tổng quan nghiên cứu 2025 xác nhận cải thiện phát âm và độ trôi chảy.', c: 'red' },
    { ic: '🔎', t: 'YouGlish', d: 'Gõ một từ/cụm, nghe hàng loạt clip người bản xứ nói đúng từ đó trong ngữ cảnh thật.', c: 'amb' },
    { ic: '📱', t: 'Teleprompter /creator', d: 'Tab Nhắc lời — Space chạy/dừng, R về đầu, F toàn màn hình, ↑/↓ chỉnh tốc độ (đã học Ch3.4).', c: 'tea' },
    { ic: '🎧', t: 'Tự nghe lại & so sánh', d: 'Ghi âm chính mình, so với clip shadow gốc — sửa đúng chỗ lệch, không đoán.', c: 'blu' },
  ], 2) },

  { t: 'Track VI/EN trong một dự án', body: timeline({
    len: 60,
    tracks: [
      { id: 'V1', clips: [{ s: 0, e: 60, t: 'B-roll & hình nền — DÙNG CHUNG', c: 'blu' }] },
      { id: 'A-VI', a: true, clips: [{ s: 0, e: 27, t: 'Giọng đọc tiếng Việt', c: 'grn' }, { s: 29, e: 58, t: 'Giọng đọc tiếng Việt', c: 'grn' }] },
      { id: 'A-EN', a: true, clips: [{ s: 0, e: 30, t: 'Giọng lồng tiếng Anh', c: 'amb' }, { s: 32, e: 60, t: 'Giọng lồng tiếng Anh', c: 'amb' }] },
      { id: 'CC-VI', clips: [{ s: 0, e: 60, t: '.vi.srt', c: 'tea' }] },
      { id: 'CC-EN', clips: [{ s: 0, e: 60, t: '.en.srt', c: 'vio' }] },
    ],
  }) + note('Cùng một project, khác track âm thanh + track phụ đề theo từng ngôn ngữ — B-roll và đồ hoạ nền chỉ dựng một lần.') },

  { t: 'Quy trình hai phiên bản', body: flow([
    { e: '📝', t: 'Kịch bản chung', d: '2 cột, dịch trước khi quay (Ch3.3)', c: 'red' },
    { e: '🎬', t: 'Quay: chọn 1 trong 2', d: 'Quay 2 lần HAY quay 1 lần + lồng tiếng sau', c: 'ora' },
    { e: '🖼️', t: 'B-roll & đồ hoạ dùng chung', d: 'Không quay lại cảnh minh hoạ cho từng bản', c: 'amb' },
    { e: '🎞️', t: 'Dựng: track riêng theo ngôn ngữ', d: 'Cùng project, khác track âm thanh/phụ đề', c: 'tea' },
    { e: '📤', t: 'Xuất tên rõ ràng', d: '_VI / _EN — không lẫn lộn lúc đăng', c: 'blu' },
    { e: '📅', t: 'Đăng đúng lịch, đúng nhãn', d: 'Gắn ngôn ngữ ở đúng cơ chế của từng nền tảng', c: 'vio' },
  ]) },

  { t: 'Công cụ & nối chương', body: cards([
    { ic: '☁️', t: 'YouTube Studio → Subtitles/Languages', d: 'Một màn hình ADD LANGUAGE cho cả dịch tiêu đề/mô tả lẫn phụ đề (Ch16.3).', c: 'red' },
    { ic: '🖥️', t: 'Whisper task=translate', d: 'Máy Linux tự dịch phụ đề sang tiếng Anh trong một lượt chạy (Ch16.4).', c: 'ora' },
    { ic: '🎛️', t: 'CapCut / Resolve', d: 'Track/timeline riêng theo ngôn ngữ trong cùng một project (Ch11–14).', c: 'tea' },
    { ic: '⚖️', t: 'Disclosure nội dung tổng hợp', d: 'Chỉ bắt buộc khi lồng tiếng AI có thể đánh lừa là thật (Ch18.4).', c: 'blu' },
  ], 2) },

  { t: 'Bảng tra nhanh trước khi làm', body: table(['Việc', 'Con số / thao tác'], [
    ['Chọn kênh', 'Một kênh, gắn ngôn ngữ đúng cách — chỉ tách kênh khi đã có lý do rõ (Bài 23.1)'],
    ['Ngân sách từ vựng kịch bản Anh', 'B1, câu ngắn, ưu tiên thì hiện tại đơn'],
    ['Dịch tiêu đề/mô tả', 'Studio → Subtitles → ADD LANGUAGE → Title and description → Add → Publish'],
    ['Phụ đề dịch', 'Cùng màn hình trên, Upload file .srt — hoặc Whisper task=translate (Ch16.4)'],
    ['!Âm thanh đa ngôn ngữ', 'Cần quyền Advanced features — Studio → Languages → Add Language → Dub'],
    ['Lồng tiếng tự động', 'Bật/tắt ở Settings → Content — không sửa được, chỉ xoá/thay bằng bản của bạn'],
    ['Đặt tên file 2 bản', '_VI / _EN rõ ràng ngay từ lúc dựng (Ch11.1)'],
  ], { sm: true }) },

  { t: '🎬 Thực hành', body: steps([
    ['Viết một đoạn kịch bản 60 giây bằng tiếng Việt, rồi tự dịch sang tiếng Anh câu ngắn, từ B1', 'Không cần hoàn hảo — chỉ cần đúng ý và nói được'],
    ['Luyện 5 câu khó đọc nhất bằng shadowing, tra 3 từ trên YouGlish', 'Ghi âm trước/sau để tự nghe khác biệt'],
    ['Quay đoạn đó qua teleprompter /creator, toàn màn hình với F', 'Tốc độ chỉnh bằng ↑/↓ tới khi bạn thoải mái đi trước chữ'],
    ['Vào YouTube Studio của một video cũ (không công khai), thử luồng ADD LANGUAGE cho tiêu đề/mô tả', 'Chỉ để thấy đúng màn hình thật — không cần Publish nếu chưa muốn công khai'],
  ]) + box('good', '<b>Đạt khi:</b> bạn đọc trôi được đoạn kịch bản Anh 60 giây đã tự viết mà không vấp quá 2 lần, và bạn tự tay bấm qua được luồng ADD LANGUAGE thật trong YouTube Studio.')
    + note('Các bước chi tiết nằm trong 4 bài học VIDEO của chương.') },
]);
