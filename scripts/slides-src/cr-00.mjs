/** Content Creator · Deck cr-00 — Mục 0: Bắt đầu hành trình creator. */
import { S, cover, cards, box, steps, flow, mindmap, bars, table, vs, seg, ui, kpis, note, esc } from './_cr-chung.mjs';

export const deck = { key: 'cr-00', code: 'CR · MỤC 0', title: 'Bắt đầu hành trình creator', sub: 'Content Creator · Mục 0' };

/* Dòng thời gian video trực tuyến — SVG riêng của deck này. */
const lichSu = (() => {
  const ev = [
    { y: '2005', t: 'YouTube ra đời', d: '"Me at the zoo" — 19 giây', c: '#ff4d5e' },
    { y: '2006', t: 'Google mua YouTube', d: '1,65 tỷ USD', c: '#ff8a3d' },
    { y: '2007', t: 'Partner Program', d: 'creator bắt đầu có thu nhập', c: '#ffc233' },
    { y: '2013', t: 'Vine', d: 'video 6 giây lặp lại', c: '#34d399' },
    { y: '2016', t: 'Douyin', d: 'ByteDance, Trung Quốc', c: '#2dd4bf' },
    { y: '2018', t: 'TikTok + musical.ly', d: 'video dọc toàn cầu', c: '#60a5fa' },
    { y: '2020', t: 'Instagram Reels', d: 'và YouTube Shorts (bản thử)', c: '#a78bfa' },
    { y: '2024', t: 'Shorts dài 3 phút', d: 'từ 15/10/2024', c: '#f472b6' },
  ];
  const W = 1160, y0 = 250, x0 = 60, x1 = 1100;
  let s = `<svg class="c-svg" viewBox="0 0 ${W} 470" width="${W}">`;
  s += `<defs><linearGradient id="lsg" x1="0" x2="1"><stop offset="0" stop-color="#ff4d5e"/><stop offset=".5" stop-color="#60a5fa"/><stop offset="1" stop-color="#f472b6"/></linearGradient></defs>`;
  s += `<rect x="${x0}" y="${y0 - 4}" width="${x1 - x0}" height="8" rx="4" fill="url(#lsg)"/>`;
  ev.forEach((e, i) => {
    const x = x0 + 30 + i * ((x1 - x0 - 60) / (ev.length - 1));
    const up = i % 2 === 0;
    const ly = up ? y0 - 150 : y0 + 60;
    s += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${up ? ly + 78 : ly - 6}" stroke="${e.c}" stroke-width="2" stroke-dasharray="4 4"/>`;
    s += `<circle cx="${x}" cy="${y0}" r="13" fill="#0d1017" stroke="${e.c}" stroke-width="4"/>`;
    s += `<rect x="${x - 88}" y="${ly}" width="176" height="80" rx="12" fill="#151b26" stroke="${e.c}" stroke-width="1.5"/>`;
    s += `<text x="${x}" y="${ly + 27}" text-anchor="middle" font-size="22" font-weight="800" fill="${e.c}" font-family="'SF Mono',Menlo,monospace">${e.y}</text>`;
    s += `<text x="${x}" y="${ly + 50}" text-anchor="middle" font-size="15.5" font-weight="700" fill="#fff" font-family="-apple-system,Arial">${esc(e.t)}</text>`;
    s += `<text x="${x}" y="${ly + 69}" text-anchor="middle" font-size="12.5" fill="#a3aec0" font-family="-apple-system,Arial">${esc(e.d)}</text>`;
  });
  s += `<text x="${x1}" y="${y0 + 190}" text-anchor="end" font-size="15" fill="#6f7b8f" font-family="-apple-system,Arial">2026 — bạn ở đây: ai cũng có máy quay trong túi, thiếu là thiếu KỸ NĂNG</text>`;
  return s + `</svg>`;
})();

export const slides = S([
  cover({ t: 'Mục 0 — Bắt đầu hành trình creator', sub: 'Vì sao làm video · Đồ nghề bạn đang có · Quy trình sản xuất · Lộ trình 28 phần', chap: 'MỤC 0' }),

  { t: 'Bản đồ Mục 0', body: mindmap('Hành trình creator', 'bắt đầu từ đây', [
    { t: '🎬 Creator là gì', d: 'Người tạo nội dung đều đặn cho một nhóm khán giả', c: 'red' },
    { t: '📜 Lịch sử video trực tuyến', d: 'YouTube 2005 → video dọc 2016–2024', c: 'ora' },
    { t: '🎒 Đồ nghề của bạn', d: 'Pocket 3 · iPhone · iPad · Mac · Linux', c: 'amb' },
    { t: '🔁 Quy trình sản xuất', d: '10 bước — và bước bạn đang bỏ qua', c: 'tea' },
    { t: '🗺 Lộ trình 28 phần', d: '5 giai đoạn: tiền kỳ → phát triển kênh', c: 'blu' },
    { t: '🧠 Cách học', d: 'Làm → xem lại → sửa, mỗi chương một sản phẩm', c: 'vio' },
  ]) },

  { t: '20 năm video trực tuyến', body: lichSu },

  { t: 'Vì sao video xây được thương hiệu cá nhân', body: cards([
    { ic: '🤝', t: 'Tin tưởng', d: 'Người xem thấy mặt, nghe giọng, xem bạn làm thật — thứ mà một CV không làm được.', c: 'red' },
    { ic: '📈', t: 'Tích luỹ', d: 'Một video tốt được tìm thấy nhiều năm. Công sức hôm nay làm việc cho bạn cả khi bạn ngủ.', c: 'amb' },
    { ic: '📣', t: 'Đòn bẩy', d: 'Giải thích một lần, hàng nghìn người nghe — thay vì trả lời từng tin nhắn một.', c: 'tea' },
    { ic: '🌐', t: 'Cửa ngõ về website', d: 'Mỗi video là một lối dẫn về cuongthai.com: khoá học, bài viết, Pro.', c: 'blu' },
  ], 4) + box('info', 'Mục tiêu của khoá: bạn tự làm ra video <b>đều đặn</b> và <b>đủ tốt</b> để người lạ xem hết, tin bạn, rồi đi theo bạn về website.') },

  { t: 'Người Việt đang xem ở đâu', body: bars([
    { l: 'Facebook', v: 79.0, txt: '79,0 triệu', c: 'blu' },
    { l: 'TikTok', sub: 'người từ 18 tuổi', v: 76.1, txt: '76,1 triệu', c: 'red' },
    { l: 'YouTube', v: 62.1, txt: '62,1 triệu', c: 'ora' },
    { l: 'Instagram', v: 11.7, txt: '11,7 triệu', c: 'vio' },
  ], { lw: 250 }) + note('Nguồn: DataReportal, Digital 2026: Vietnam — số người quảng cáo tiếp cận được, 10/2025. Không phải số người dùng duy nhất: một người có thể có nhiều tài khoản.') +
    box('tip', 'Không phải chọn một. Chương 1 dạy dùng <b>mỗi nền tảng cho một việc</b>: video ngắn để người lạ biết bạn, YouTube để họ tin bạn, website để họ ở lại.') },

  { t: 'Đồ nghề bạn đang có — thừa đủ để bắt đầu', body: cards([
    { ic: '🎥', t: 'DJI Osmo Pocket 3', d: 'Cảm biến 1 inch, gimbal 3 trục, 4K tới 120fps. Máy vlog và B-roll.', c: 'red' },
    { ic: '📱', t: 'iPhone 16 Pro Max', d: '4K120 Dolby Vision, ProRes Log, 3 ống kính. Máy A/B và ảnh thumbnail.', c: 'amb' },
    { ic: '✏️', t: 'iPad Pro M5', d: 'Vẽ storyboard, làm teleprompter, màn hình phụ, dựng khi đi đường.', c: 'tea' },
    { ic: '💻', t: 'Mac M1 Max', d: 'Trạm dựng chính: DaVinci Resolve, CapCut. Giải mã ProRes/HEVC bằng phần cứng.', c: 'blu' },
    { ic: '🐧', t: 'Máy Linux ở nhà', d: 'RTX 3060: sao lưu, chuyển mã ffmpeg, chạy Whisper làm phụ đề tự động.', c: 'vio' },
    { ic: '🧩', t: 'Còn thiếu', d: 'Một micro cài áo không dây và một đèn mềm. Phần lớn video hỏng vì TIẾNG, không phải vì máy.', c: 'pnk' },
  ], 3) },

  { t: 'Mua gì trước — thứ tự của người làm nghề', body: flow([
    { e: '🎙️', t: '1. Âm thanh', d: 'Micro không dây / cài áo. Người xem bỏ đi vì tiếng rè trước khi bỏ vì hình mờ.', c: 'grn' },
    { e: '💡', t: '2. Ánh sáng', d: 'Một đèn mềm + cửa sổ. Ánh sáng tốt làm máy rẻ trông như máy đắt.', c: 'amb' },
    { e: '🎞', t: '3. Lưu trữ', d: 'Thẻ nhớ đủ nhanh + SSD ngoài để đổ thẻ và dựng.', c: 'blu' },
    { e: '📷', t: '4. Máy quay', d: 'Bạn đã có hai máy tốt. Đổi máy là việc CUỐI cùng.', c: 'dim' },
  ]) + box('good', 'Nếu Pocket 3 của bạn là bản <b>Creator Combo</b>, trong hộp đã có bộ phát <b>DJI Mic 2</b> — cắm được thẳng vào Pocket 3. Kiểm lại hộp trước khi mua micro.') },

  { t: 'Quy trình sản xuất: 10 bước', body: flow([
    { e: '💡', t: 'Ý tưởng', c: 'red' }, { e: '📝', t: 'Kịch bản', c: 'ora' }, { e: '🎬', t: 'Phân cảnh', c: 'amb' },
    { e: '🎥', t: 'Quay', c: 'grn' }, { e: '💾', t: 'Nhập liệu', c: 'tea' },
  ]) + flow([
    { e: '✂️', t: 'Dựng', c: 'blu' }, { e: '🎨', t: 'Màu & âm', c: 'vio' }, { e: '📤', t: 'Xuất', c: 'pnk' },
    { e: '🚀', t: 'Đăng', c: 'red' }, { e: '📊', t: 'Đo & học', c: 'amb' },
  ]) + note('Ba bước đầu là TIỀN KỲ. Bỏ qua chúng thì mọi bước sau đều khó gấp đôi.') },

  { t: 'Bạn đang ở đâu trong quy trình', body: vs({
    no: { t: 'Cách đang làm', items: ['Bật Pocket 3, quay một lèo 20–30 phút', 'Về nhà mới nghĩ xem video nói gì', 'Tua cả tiếng để tìm đoạn hay', '≈ 29 GB mỗi lần quay 30 phút — thẻ đầy'] },
    yes: { t: 'Cách của người làm nghề', items: ['Viết ý + dàn ý 20 phút trước khi quay', 'Liệt kê shot cần quay (shot list)', 'Quay từng clip 10–60 giây, biết clip nào để làm gì', 'Dựng nhanh vì mọi clip đều có chỗ đứng'] },
  }) + note('Con số 29 GB: Pocket 3 ghi tối đa 130 Mbps ⇒ 130 × 60 ÷ 8 ≈ 975 MB/phút. Chương 4 dạy cách quay theo cảnh.') },

  { t: 'Lộ trình 28 phần — 5 giai đoạn', body: table(['Giai đoạn', 'Chương', 'Học xong bạn làm được'], [
    ['!0 · Bắt đầu', 'Mục 0', 'Biết mình cần gì, học theo thứ tự nào'],
    ['1 · Tiền kỳ', 'Ch1–4', 'Chọn ngách, ra ý tưởng, viết kịch bản, lập shot list'],
    ['2 · Quay', 'Ch5–10', 'Cài máy đúng, bố cục, ánh sáng, thu âm sạch, quay một mình'],
    ['3 · Hậu kỳ', 'Ch11–19', 'Quản lý file, dựng CapCut & DaVinci, màu, âm, phụ đề, hiệu ứng, VFX & 3D'],
    ['4 · Định dạng', 'Ch20–23', 'Video ngắn, vlog, bài giảng, video song ngữ Việt–Anh'],
    ['5 · Phát triển', 'Ch24–27', 'Xuất & đăng, thumbnail, số liệu, kiếm tiền, dự án 30 ngày'],
  ]) },

  { t: 'Mỗi chương học thế nào', body: steps([
    ['Lướt <b>slide N.0</b> để thấy bức tranh cả chương', 'Mỗi slide là một hình — nhìn trước, đọc sau.'],
    ['Đọc <b>4 bài dạy</b> và xem video đi kèm', 'Video đặt ngay đầu bài: tiếng Việt / tiếng Anh / YouTube chọn lọc.'],
    ['Làm <b>🎬 Thực hành</b> bằng chính máy của bạn', 'Mỗi bài có tiêu chí "Đạt khi" đo được — chưa đạt thì làm lại.'],
    ['Làm <b>bài kiểm tra</b> cuối chương', '10 câu tình huống, có giải thích sau khi nộp.'],
    ['<b>Đăng thử</b> một sản phẩm nhỏ', 'Không đăng thì không có số liệu, không có số liệu thì không biết sửa gì.'],
  ]) },

  { t: 'Công cụ đi cùng khoá: /creator trên web của bạn', body: ui({ w: 1100, h: 380, title: 'cuongthai.com/creator — Xưởng nội dung', regions: [
    { n: 1, t: 'Ý tưởng', d: '/creator/ideas — kho ý tưởng, chấm điểm', x: 1, y: 3, w: 32, h: 44, c: 'amb' },
    { n: 2, t: 'Lịch đăng', d: '/creator/calendar — nhịp đăng cả tháng', x: 34, y: 3, w: 32, h: 44, c: 'blu' },
    { n: 3, t: 'Tiến độ', d: '/creator/pipeline — ý tưởng → quay → dựng → đăng', x: 67, y: 3, w: 32, h: 44, c: 'grn' },
    { n: 4, t: 'Dự án → Kịch bản', d: '9 mẫu dựng sẵn · lưu phiên bản', x: 1, y: 50, w: 49, h: 47, c: 'vio' },
    { n: 5, t: 'Teleprompter', d: 'đọc kịch bản khi quay · Space / R / F / ↑↓', x: 51, y: 50, w: 48, h: 47, c: 'red' },
  ] }) },

  { t: 'Ba luồng video trong mỗi bài học', body: cards([
    { ic: '🇻🇳', t: 'VI — bạn tự quay', d: 'Bài giảng tiếng Việt của chính bạn. Chương 22 dạy quay và đưa lên.', c: 'red' },
    { ic: '🇬🇧', t: 'EN — bạn tự quay', d: 'Bản tiếng Anh cho khán giả quốc tế. Chương 23 dạy làm video song ngữ.', c: 'blu' },
    { ic: '▶️', t: 'YT — video chọn lọc', d: 'Video chuyên sâu của người làm nghề, chọn đúng chủ đề từng bài. Mặc định khi bạn chưa quay.', c: 'amb' },
  ], 3) + box('tip', 'Học xong khoá này, chính bạn sẽ lấp luồng VI và EN cho các khoá khác trên cuongthai.com.') },

  { t: '🎬 Thực hành Mục 0 — video "trước khi học"', body: steps([
    ['Chụp một ảnh <b>toàn bộ đồ nghề</b> đang có, ghi tên từng món', 'Lưu vào /creator hoặc ghi chú.'],
    ['Quay <b>một clip 60 giây</b> tự giới thiệu bằng iPhone — không cắt, không làm lại', 'Để máy tự động hết. Đây là "ảnh chụp trước khi học".'],
    ['Xem lại, ghi <b>3 điều</b> bạn muốn sửa nhất', 'Tiếng? Ánh sáng? Nói vấp? Không biết nhìn đâu?'],
    ['Tạo <b>dự án đầu tiên</b> trong /creator/projects', 'Tên: "Video trước khi học". Dán 3 điều vừa ghi vào phần mô tả.'],
  ]) + box('good', '<b>Đạt khi:</b> có clip 60 giây + 3 điều cần sửa được ghi lại. Chương 27 bạn sẽ quay lại đúng clip này để so.') },
]);
