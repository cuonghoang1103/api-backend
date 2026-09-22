/** Content Creator · Deck cr-01 — Chương 1: Nền tảng & khán giả. */
import { S, cover, cards, box, steps, table, vs, flow, mindmap, bars, two, list, note, esc } from './_cr-chung.mjs';

export const deck = { key: 'cr-01', code: 'CR · CHƯƠNG 1', title: 'Nền tảng & khán giả', sub: 'Content Creator · Chương 1' };

/* Ba vòng tròn giao nhau: chọn ngách */
const venn = (() => {
  const c = [
    { x: 300, y: 230, t: 'Bạn giỏi / đang học', d: 'web, Next.js, Node, database', col: '#60a5fa' },
    { x: 470, y: 230, t: 'Người khác cần', d: 'SV IT, người tự học code', col: '#34d399' },
    { x: 385, y: 370, t: 'Bạn làm được lâu', d: 'vui, có sẵn chất liệu', col: '#ffc233' },
  ];
  let s = `<svg class="c-svg" viewBox="0 0 770 590" width="600">`;
  c.forEach((k) => { s += `<circle cx="${k.x}" cy="${k.y}" r="150" fill="${k.col}" fill-opacity=".16" stroke="${k.col}" stroke-width="3"/>`; });
  const lab = [[190, 42], [580, 42], [385, 552]];
  c.forEach((k, i) => {
    s += `<text x="${lab[i][0]}" y="${lab[i][1]}" text-anchor="middle" font-size="19" font-weight="800" fill="${k.col}" font-family="-apple-system,Arial">${esc(k.t)}</text>`;
    s += `<text x="${lab[i][0]}" y="${lab[i][1] + 22}" text-anchor="middle" font-size="14" fill="#c9d3e3" font-family="-apple-system,Arial">${esc(k.d)}</text>`;
  });
  s += `<circle cx="385" cy="275" r="44" fill="#ff4d5e"/>`;
  s += `<text x="385" y="271" text-anchor="middle" font-size="17" font-weight="800" fill="#fff" font-family="-apple-system,Arial">NGÁCH</text>`;
  s += `<text x="385" y="291" text-anchor="middle" font-size="13" fill="#fff" font-family="-apple-system,Arial">của bạn</text>`;
  return s + `</svg>`;
})();

/* Trung tâm & các nan hoa: mọi kênh dẫn về website */
const hub = (() => {
  const sp = [
    { t: 'TikTok', d: 'người lạ biết bạn', a: -150, c: '#ff4d5e' },
    { t: 'Reels', d: 'Instagram · Facebook', a: -90, c: '#f472b6' },
    { t: 'Shorts', d: 'dẫn sang video dài', a: -30, c: '#ff8a3d' },
    { t: 'YouTube', d: 'người xem tin bạn', a: 30, c: '#ffc233' },
    { t: 'Facebook', d: 'nhóm · trang', a: 90, c: '#60a5fa' },
    { t: 'LinkedIn / CV', d: 'nhà tuyển dụng', a: 150, c: '#a78bfa' },
  ];
  const cx = 480, cy = 235, R = 185;
  let s = `<svg class="c-svg" viewBox="0 0 960 470" width="900">`;
  sp.forEach((k) => {
    const r = (k.a * Math.PI) / 180, x = cx + Math.cos(r) * R * 1.35, y = cy + Math.sin(r) * R;
    s += `<line x1="${x}" y1="${y}" x2="${cx + Math.cos(r) * 90}" y2="${cy + Math.sin(r) * 62}" stroke="${k.c}" stroke-width="3" marker-end="url(#hubA)" opacity=".85"/>`;
    s += `<rect x="${x - 88}" y="${y - 30}" width="176" height="60" rx="12" fill="#151b26" stroke="${k.c}" stroke-width="2"/>`;
    s += `<text x="${x}" y="${y - 4}" text-anchor="middle" font-size="18" font-weight="800" fill="${k.c}" font-family="-apple-system,Arial">${esc(k.t)}</text>`;
    s += `<text x="${x}" y="${y + 17}" text-anchor="middle" font-size="13" fill="#c9d3e3" font-family="-apple-system,Arial">${esc(k.d)}</text>`;
  });
  s += `<defs><marker id="hubA" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#c9d3e3"/></marker></defs>`;
  s += `<ellipse cx="${cx}" cy="${cy}" rx="120" ry="72" fill="url(#hubG)"/>`;
  s += `<defs><linearGradient id="hubG" x1="0" x2="1"><stop offset="0" stop-color="#ff4d5e"/><stop offset="1" stop-color="#ff8a3d"/></linearGradient></defs>`;
  s += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="22" font-weight="800" fill="#fff" font-family="-apple-system,Arial">cuongthai.com</text>`;
  s += `<text x="${cx}" y="${cy + 20}" text-anchor="middle" font-size="14" fill="#fff" font-family="-apple-system,Arial">khoá học · bài viết · Pro</text>`;
  return s + `</svg>`;
})();

export const slides = S([
  cover({ t: 'Chương 1 — Nền tảng & khán giả', sub: 'YouTube · TikTok · Facebook · Instagram · Thuật toán đề xuất · Chọn ngách · Thương hiệu cá nhân', chap: 'CHƯƠNG 1' }),

  { t: 'Bản đồ chương', body: mindmap('Nền tảng & khán giả', 'đăng ở đâu, cho ai', [
    { t: '📺 Bốn nền tảng', d: 'Mỗi nơi một luật chơi, một kiểu người xem', c: 'red' },
    { t: '🧮 Thuật toán đề xuất', d: 'Nó đo gì — theo lời chính nền tảng', c: 'ora' },
    { t: '🧭 Lời đồn vs sự thật', d: 'Follower, hashtag, "bị bóp"…', c: 'amb' },
    { t: '🎯 Chọn ngách', d: 'Giỏi × được cần × làm được lâu', c: 'tea' },
    { t: '🧑‍🎓 Chân dung khán giả', d: 'Viết cho MỘT người cụ thể', c: 'blu' },
    { t: '🏠 Thương hiệu & trung tâm', d: 'Mọi kênh dẫn về website', c: 'vio' },
  ]) },

  { t: 'Bốn nền tảng, bốn luật chơi', body: cards([
    { ic: '▶️', t: 'YouTube', d: 'Tìm kiếm + đề xuất. Video dài sống nhiều năm; Shorts để được khám phá. Hợp nhất cho bài hướng dẫn.', c: 'red' },
    { ic: '🎵', t: 'TikTok', d: 'Luồng "Dành cho bạn" đẩy video tới người lạ theo sở thích. Phản hồi nhanh cho câu hook.', c: 'pnk' },
    { ic: '👥', t: 'Facebook', d: 'Lớn nhất Việt Nam. Từ 6/2025 mọi video đăng lên đều thành Reels. Nhóm & trang cộng đồng.', c: 'blu' },
    { ic: '📸', t: 'Instagram', d: 'Reels + hình ảnh thương hiệu. Nhỏ ở Việt Nam, mạnh ở quốc tế — hợp nội dung tiếng Anh.', c: 'vio' },
  ], 4) + box('tip', 'Đừng chọn một nền tảng duy nhất — hãy giao cho mỗi nền tảng <b>một việc</b>. Bài 1.4 dựng sơ đồ đó.') },

  { t: 'Định dạng & độ dài (tính đến 09/2026)', body: table(['Nền tảng', 'Tỉ lệ khung', 'Độ dài', 'Ghi chú'], [
    ['YouTube (video)', '16:9', '15 phút · 12 giờ khi đã xác minh', 'tối đa 256 GB/file'],
    ['YouTube Shorts', '9:16 hoặc vuông', 'tới 3 phút', 'từ 15/10/2024'],
    ['TikTok', '9:16', 'tải lên tới 10 phút', 'có thử nghiệm 60 phút (5/2024)'],
    ['Facebook Reels', '9:16', 'không giới hạn độ dài', 'mọi video thành Reels (6/2025)'],
    ['Instagram Reels', '9:16', 'tới 3 phút', 'từ 1/2025'],
  ]) + note('Nguồn: YouTube Help, YouTube Blog, TikTok (qua TechCrunch), Meta Newsroom, Adam Mosseri (Threads). Các con số này hay đổi — kiểm lại trước khi lên kế hoạch dài.') },

  { t: 'Người Việt đang ở đâu', body: bars([
    { l: 'Facebook', v: 79.0, txt: '79,0 triệu', c: 'blu' },
    { l: 'TikTok', sub: 'từ 18 tuổi', v: 76.1, txt: '76,1 triệu', c: 'red' },
    { l: 'YouTube', v: 62.1, txt: '62,1 triệu', c: 'ora' },
    { l: 'Instagram', v: 11.7, txt: '11,7 triệu', c: 'vio' },
  ], { lw: 240 }) + note('DataReportal, Digital 2026: Vietnam — tệp quảng cáo tiếp cận được, 10/2025 (đếm tài khoản, không phải người).') },

  { t: 'YouTube đề xuất video dựa vào gì', body: flow([
    { e: '👀', t: 'Hiển thị', d: 'video xuất hiện trước mắt người xem', c: 'blu' },
    { e: '🖱', t: 'Cú bấm', d: 'tiêu đề + thumbnail có hấp dẫn?', c: 'amb' },
    { e: '⏱', t: 'Thời lượng xem', d: 'xem bao lâu, bỏ ở đâu', c: 'ora' },
    { e: '⭐', t: 'Hài lòng', d: 'khảo sát, like, dislike, chia sẻ', c: 'grn' },
    { e: '🔁', t: 'Đề xuất tiếp', d: 'cho người giống họ', c: 'vio' },
  ]) + box('info', 'Theo blog chính thức của YouTube (15/09/2021): hệ thống dùng <b>cú bấm</b>, <b>thời lượng xem</b>, <b>khảo sát "thời lượng xem có giá trị"</b>, <b>chia sẻ</b>, <b>like</b> và <b>dislike</b>. Nó chạy theo người xem, không "ghét" hay "thích" riêng ai.') },

  { t: 'TikTok "Dành cho bạn" dựa vào gì', body: cards([
    { ic: '❤️', t: 'Tương tác của người xem', d: 'like, chia sẻ, theo dõi, bình luận — và XEM HẾT một video dài là tín hiệu rất mạnh.', c: 'red' },
    { ic: '🏷', t: 'Thông tin video', d: 'chú thích, âm thanh, hashtag — để hiểu video nói về gì.', c: 'amb' },
    { ic: '⚙️', t: 'Cài đặt máy & tài khoản', d: 'ngôn ngữ, quốc gia — tín hiệu yếu hơn.', c: 'blu' },
  ], 3) + box('good', 'TikTok nói rõ: <b>số người theo dõi</b> và việc từng có video nổi <b>KHÔNG</b> phải yếu tố trực tiếp của hệ thống đề xuất (Newsroom TikTok, 18/06/2020). Kênh mới vẫn có cơ hội.') },

  { t: 'Lời đồn và điều nền tảng thật sự nói', body: vs({
    no: { t: 'Lời đồn', items: ['"Kênh nhỏ không bao giờ lên đề xuất"', '"Càng nhiều hashtag càng tốt"', '"Thuật toán ghét kênh mình"', '"Cứ đăng thật nhiều là lên"'] },
    yes: { t: 'Điều có nguồn', items: ['TikTok: follower không phải yếu tố trực tiếp', 'YouTube: quá 60 hashtag ⇒ bỏ qua TẤT CẢ hashtag của video', 'YouTube: hệ thống bám theo sự hài lòng của người xem', 'Hài lòng quan trọng hơn số lượng — video dở kéo tín hiệu xuống'] },
  }) },

  { t: 'Chọn ngách: giao của ba vòng tròn', body: two(venn, list([
    '<b>Giỏi / đang học</b>: thứ bạn nói được mà không cần tra mỗi câu',
    '<b>Người khác cần</b>: có người tìm, có người hỏi',
    '<b>Làm được lâu</b>: 50 video sau vẫn còn muốn làm',
    'Hẹp trước, mở rộng sau — "web thực chiến cho SV IT Việt Nam" tốt hơn "công nghệ"',
  ]), 'l2') },

  { t: 'Viết cho MỘT người cụ thể', body: two(`<div class="c-card blu" style="padding:18px 20px">
  <span class="ic">🧑‍🎓</span><b>Minh, 20 tuổi — SV IT năm 2</b>
  <p>Học xong môn lập trình web ở trường nhưng chưa tự dựng được sản phẩm nào. Tối xem YouTube bằng điện thoại, hay tìm "cách deploy web", "lỗi CORS". Sợ tiếng Anh. Muốn có dự án để xin thực tập.</p>
  <p style="margin-top:8px"><span class="c-tag red">nỗi đau: làm theo tutorial xong vẫn không tự làm được</span></p>
</div>`, steps([
    ['Họ là ai, trình độ tới đâu', 'đừng giải thích thứ họ đã biết'],
    ['Họ đau ở đâu', 'đó là nơi ra ý tưởng'],
    ['Họ tìm gì, gõ chữ gì', 'đó là tiêu đề của bạn'],
    ['Họ xem ở đâu, lúc nào', 'đó là nền tảng và giờ đăng'],
  ]), 'l') },

  { t: 'Trụ cột nội dung — 3 đến 4 cột', body: cards([
    { ic: '🧑‍🏫', t: 'Dạy', d: 'Bài hướng dẫn code, sửa lỗi thật, giải thích khái niệm.', c: 'blu' },
    { ic: '🛠', t: 'Hành trình', d: 'Build in public: dựng cuongthai.com, thành công và thất bại.', c: 'grn' },
    { ic: '🎬', t: 'Hậu trường', d: 'Vlog học tập, ngày làm việc, cách bạn học.', c: 'amb' },
    { ic: '🧰', t: 'Công cụ', d: 'Review công cụ dev/creator bạn thật sự dùng.', c: 'vio' },
  ], 4) + box('tip', 'Mỗi video phải thuộc về MỘT cột. Người xem biết sẽ nhận được gì khi theo dõi bạn — đó chính là thương hiệu.') },

  { t: 'Nhận diện đồng nhất trên mọi nền tảng', body: table(['Thứ cần thống nhất', 'Làm thế nào'], [
    ['Tên / handle', 'Cùng một @ ở mọi nơi nếu còn trống; nếu không, thêm hậu tố giống nhau'],
    ['Ảnh đại diện', 'Cùng một ảnh mặt rõ, nền gọn, nhìn được ở cỡ 40px'],
    ['Câu giới thiệu (bio)', 'Một câu: bạn giúp ai làm gì + đường link về website'],
    ['Màu & font', 'Hai màu chính + một font có đủ dấu tiếng Việt, dùng lại ở thumbnail'],
    ['Đường link', 'Mọi hồ sơ trỏ về cùng một trang trên cuongthai.com'],
  ]) },

  { t: 'Website là trung tâm — mọi kênh dẫn về', body: hub },

  { t: '🎬 Thực hành chương 1', body: steps([
    ['Viết <b>chân dung khán giả</b> một người: tên, tuổi, trình độ, nỗi đau, họ tìm gì', 'Dán vào /creator/ideas làm mục ghim đầu tiên.'],
    ['Vẽ <b>ba vòng tròn</b> của bạn và viết ngách trong một câu', 'Hẹp tới mức một người lạ đọc là hiểu kênh nói gì.'],
    ['Chọn <b>3–4 trụ cột</b>, mỗi cột ghi 3 ý tưởng video', 'Có ngay 9–12 ý tưởng đầu tiên.'],
    ['<b>Kiểm hồ sơ</b> YouTube, TikTok, Facebook, Instagram', 'Tên, ảnh, bio, link về cuongthai.com — đồng nhất.'],
  ]) + box('good', '<b>Đạt khi:</b> có chân dung khán giả, câu ngách, 3–4 trụ cột với ít nhất 9 ý tưởng, và bốn hồ sơ có cùng tên, ảnh, bio và link.') },
]);
