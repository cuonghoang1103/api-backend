/**
 * cr-24.mjs — Content Creator, Chương 24: Xuất file & đăng tải.
 *   node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/cr-24.mjs
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/cr-24.mjs --out <dir>
 */
import { S, cover, cards, box, steps, table, two, mindmap, flow, code, note, ui, bars } from './_cr-chung.mjs';

export const deck = { key: 'cr-24', code: 'CR · CHƯƠNG 24', title: 'Xuất file & đăng tải', sub: 'Content Creator · Chương 24' };

export const slides = S([

  /* 1 — bìa */
  cover({
    t: 'Chương 24 — Xuất file & đăng tải',
    sub: 'Đúng khuyến nghị của YouTube, đo thật bằng ffmpeg/ffprobe — rồi đăng chéo sạch sang TikTok, Facebook, Instagram',
    chap: 'CHƯƠNG 24',
  }),

  /* 2 — bản đồ chương */
  {
    t: 'Bản đồ chương',
    body: mindmap('Xuất file & đăng tải', 'Chương 24', [
      { t: '24.1 Xuất file chuẩn', d: 'MP4/H.264 đúng khuyến nghị YouTube, bitrate SDR/HDR, chạy thật bằng ffmpeg', c: 'blu' },
      { t: '24.2 Đăng YouTube chuẩn SEO', d: 'Mô tả, chapters, tag/hashtag, minh bạch: made-for-kids, quảng cáo, nội dung AI', c: 'amb' },
      { t: '24.3 TikTok · Facebook · Instagram', d: 'Đăng chéo sạch, lên lịch, UTM đo lượt về cuongthai.com', c: 'grn' },
      { t: '24.4 Bản quyền & luật chơi', d: 'Nhạc có phép, Content ID vs strike, fair use vs Luật SHTT Việt Nam', c: 'red' },
      { t: '✅ Nối từ', d: 'Ch5 (codec/HDR) · Ch12 (xuất CapCut) · Ch13 (Deliver) · Ch16 (LUFS/phụ đề) · Ch19 (end screen) · Ch20 (đăng chéo video ngắn)', c: 'tea' },
      { t: '➡️ Nối tới', d: 'Ch25 Thumbnail & tiêu đề · Ch26 Số liệu, tăng trưởng & kiếm tiền', c: 'vio' },
    ]),
  },

  /* 3 — container/video khuyến nghị */
  {
    t: 'Khuyến nghị xuất của YouTube — container & video',
    body: table(['Thành phần', 'Khuyến nghị (đã kiểm 09/2026)'], [
      ['Container', 'MP4 — moov atom ở ĐẦU file ("Fast Start"), không Edit List'],
      ['Video codec', '!H.264, High Profile, quét liên tục (progressive)'],
      ['GOP (nhóm khung hình)', 'Đóng (closed GOP) — độ dài = một nửa fps'],
      ['B-frame', '2 khung liên tiếp'],
      ['Entropy coding', 'CABAC'],
      ['Chế độ bitrate', '+Biến đổi (VBR) — KHÔNG phải hằng số (CBR)'],
      ['Chroma subsampling', '4:2:0'],
      ['Khung hình/giây', 'Khớp bản GHI GỐC — 24/25/30/48/50/60 (Bài 5.1: VN dùng 25/50)'],
      ['Không gian màu (SDR)', 'BT.709'],
    ], { sm: true }) + note('Nguồn: support.google.com/youtube/answer/1722171 — "Recommended upload encoding settings", kiểm 09/2026.'),
  },

  /* 4 — bitrate SDR/HDR */
  {
    t: 'Bitrate khuyến nghị — SDR & HDR',
    body: table(['Độ phân giải', 'SDR chuẩn (24/25/30fps)', 'SDR cao (48/50/60fps)', 'HDR chuẩn', 'HDR cao'], [
      ['1080p', '!8 Mbps', '12 Mbps', '10 Mbps', '15 Mbps'],
      ['4K (2160p)', '!35–45 Mbps', '53–68 Mbps', '44–56 Mbps', '66–85 Mbps'],
    ], { sm: true })
      + note('Nửa SDR đã thấy ở Bài 12.4 — đây là bức tranh đầy đủ, thêm cột HDR. 1080p, bốn chế độ, vẽ theo đúng tỉ lệ:')
      + bars([
        { l: 'SDR chuẩn (24/25/30fps)', v: 8, txt: '8 Mbps', c: 'blu' },
        { l: 'HDR chuẩn (24/25/30fps)', v: 10, txt: '10 Mbps', c: 'tea' },
        { l: 'SDR cao (48/50/60fps)', v: 12, txt: '12 Mbps', c: 'amb' },
        { l: 'HDR cao (48/50/60fps)', v: 15, txt: '15 Mbps', c: 'red' },
      ], { lw: 260 })
      + note('Âm thanh: AAC-LC, 48kHz — 384kbps (stereo) / 512kbps (5.1). Cùng nguồn answer/1722171.'),
  },

  /* 5 — chạy thật ffmpeg + ffprobe + bẫy VBR/CBR + faststart */
  {
    t: 'Chạy thật — xuất bằng ffmpeg đúng khuyến nghị, kiểm bằng ffprobe',
    body: two(
      code('ffmpeg -f lavfi -i "testsrc2=size=1920x1080:rate=25:duration=6" \\\n  -i giong-noi.wav \\\n  -c:v libx264 -profile:v high -pix_fmt yuv420p \\\n  -b:v 8M -maxrate 10M -bufsize 16M -bf 2 -g 12 \\\n  -c:a aac -b:a 384k -ar 48000 -ac 2 \\\n  -movflags +faststart xuat-youtube.mp4', 'bash'),
      code('codec_name=h264\nprofile=High\npix_fmt=yuv420p\nr_frame_rate=25/1\nbit_rate=8458561\n\ncodec_name=aac\nsample_rate=48000\nchannels=2\nbit_rate≈237753', 'plaintext'),
    ) + box('warn', '<b>Bẫy thật gặp phải trên máy này:</b> đặt <code>-maxrate</code> BẰNG <code>-b:v</code> làm x264 tự in ra <code>rc=cbr</code> trong log — không còn là VBR. Nâng <code>-maxrate</code> lên TRÊN mức bitrate mục tiêu (ở đây 10M &gt; 8M) mới ra đúng <code>rc=abr</code> (biến đổi thật).')
      + note('moov offset 36 byte, mdat offset 5.545 byte — moov ĐỨNG TRƯỚC mdat, đo bằng grep -abo trên chính file vừa xuất, xác nhận faststart có tác dụng thật.'),
  },

  /* 6 — ui() wireframe màn hình tải lên YouTube */
  {
    t: 'Màn hình tải video lên YouTube Studio (minh hoạ)',
    body: ui({
      w: 1120, h: 460, title: 'YouTube Studio — Chi tiết video (minh hoạ, không phải ảnh chụp thật)',
      regions: [
        { n: 1, t: 'Tiêu đề', d: '≤100 ký tự — từ khoá chính trong 60 ký tự đầu', x: 0, y: 0, w: 58, h: 12, c: 'blu' },
        { n: 2, t: 'Mô tả', d: '2 dòng đầu lộ khi tìm kiếm · link cuongthai.com · danh sách 00:00 chương', x: 0, y: 12, w: 58, h: 46, c: 'amb' },
        { n: 3, t: 'Đối tượng · Quảng cáo trả phí · Nội dung AI', d: '3 công tắc RIÊNG — made for kids, paid promotion, altered/synthetic content', x: 0, y: 58, w: 58, h: 42, c: 'red' },
        { n: 4, t: 'Thumbnail', d: 'ảnh riêng, không dùng khung tự trích', x: 60, y: 0, w: 40, h: 28, c: 'grn' },
        { n: 5, t: 'Playlist · Phụ đề', d: 'phụ đề song ngữ đã tải ở Bài 16.3 hiện sẵn tại đây', x: 60, y: 28, w: 40, h: 22, c: 'tea' },
        { n: 6, t: 'Danh mục · Ngôn ngữ video', d: '', x: 60, y: 50, w: 40, h: 20, c: 'vio' },
        { n: 7, t: 'Công khai · Hẹn giờ / Premiere', d: 'Premiere: không dùng cho Shorts hay >1080p', x: 60, y: 70, w: 40, h: 30, c: 'pnk' },
      ],
    }),
  },

  /* 7 — bảng: mô tả & khám phá */
  {
    t: 'Mô tả & khám phá — quy tắc đã kiểm',
    body: table(['Mục', 'Quy tắc đã kiểm (09/2026)'], [
      ['!Chapters (chương)', 'Mốc ĐẦU phải 00:00 · ít nhất 3 mốc tăng dần · mỗi đoạn ≥10 giây'],
      ['Tags (thẻ)', 'Tác dụng RẤT ít — chỉ đáng thêm cho từ khoá hay bị viết sai; nhồi thẻ là vi phạm chính sách spam'],
      ['Hashtag', '>60 hashtag trong mô tả → YouTube bỏ qua TẤT CẢ (đã kiểm Bài 1.2)'],
      ['Danh mục (category)', 'Chọn đúng chủ đề — góp phần vào gợi ý "video liên quan"'],
      ['Playlist', 'Thêm ngay lúc tải lên — giữ người xem ở lại kênh sau khi hết video'],
      ['Phụ đề', 'Tải .srt VI/EN đã làm ở Bài 16.3 — KHÔNG cần làm lại ở đây'],
    ], { sm: true }),
  },

  /* 8 — bảng: đối tượng, minh bạch, lịch đăng */
  {
    t: 'Đối tượng, minh bạch & lịch đăng',
    body: table(['Mục', 'Quy tắc đã kiểm (09/2026)'], [
      ['+Made for kids', 'Đặt ĐÚNG đối tượng thật — tắt bình luận, quảng cáo cá nhân hoá, cards/end screen/nút thông báo'],
      ['!Quảng cáo trả phí', 'Có hợp đồng nhãn hàng/tài trợ → bật "Paid promotion" → gắn nhãn công bố đầu video'],
      ['!Nội dung bị thay đổi/tổng hợp (AI)', 'Chỉ bắt buộc khi nội dung AI đủ chân thực để đánh lừa về điều CÓ THẬT — đã học Bài 19.1'],
      ['Thẻ (Cards)', 'Tối đa 5 thẻ/video — video, playlist, kênh, hoặc link ngoài (cần YPP); không dùng trên video made-for-kids'],
      ['End screen', 'Đã học Bài 19.1 — 5–20 giây cuối, video phải ≥25 giây mới bật được'],
      ['Hẹn giờ / Premiere', 'Premiere KHÔNG hỗ trợ Shorts hay video phân giải >1080p'],
    ], { sm: true }),
  },

  /* 9 — flow đăng chéo sạch */
  {
    t: 'Quy trình đăng chéo sạch',
    body: flow([
      { e: '🎬', t: '1. Bản gốc sạch', d: 'Watermark → Remove MỖI lần xuất (Bài 12.4) — không phải cài một lần là xong', c: 'blu' },
      { e: '✍️', t: '2. Mô tả riêng', d: 'Viết lại cho từng nền tảng — copy 1 caption dán khắp nơi lộ ngay là đăng lại tự động', c: 'amb' },
      { e: '🖼️', t: '3. Ảnh bìa đúng khung', d: 'Cắt đúng vùng an toàn — không lệch chữ/mặt ra rìa', c: 'grn' },
      { e: '📅', t: '4. Lên lịch', d: 'Meta Business Suite (FB+IG) · TikTok Studio', c: 'tea' },
      { e: '🔗', t: '5. Link đo được', d: 'UTM trong bio/mô tả → biết đúng nền tảng nào kéo người về cuongthai.com', c: 'vio' },
    ]),
  },

  /* 10 — so sánh 3 nền tảng */
  {
    t: 'TikTok · Facebook · Instagram — so sánh nhanh',
    body: table(['Việc', 'TikTok', 'Facebook', 'Instagram'], [
      ['Lên lịch đăng', 'TikTok Studio (tiktok.com/tiktokstudio) — cần tài khoản Creator/Business', 'Meta Business Suite → Content/Planner → Create post → Scheduling options', 'Cùng Meta Business Suite — 1 lượt chọn cả Facebook lẫn Instagram'],
      ['Chế độ tài khoản', 'Business/Creator — đổi kho nhạc Add Sound (đã học Bài 20.3)', 'Professional mode (Pro mode) trên hồ sơ cá nhân, hoặc Page riêng', 'Tài khoản chuyên nghiệp — bắt buộc để dùng Meta Business Suite'],
      ['Đăng chung nhiều người', '—', '—', 'Collab post: Tag people → Invite collaborator — hiện trên CẢ HAI hồ sơ, gộp lượt thích/bình luận'],
      ['Ảnh bìa', 'Chọn khung từ video hoặc tải ảnh riêng', '(dùng ảnh bìa video thường)', 'Reels: khuyến nghị 420×654px (~1:1,55) — KHÔNG sửa được sau khi đã đăng'],
    ], { sm: true }),
  },

  /* 11 — UTM mẫu thật */
  {
    t: 'UTM — đo đúng nền tảng nào kéo người về web',
    body: code('https://cuongthai.com/courses/content-creator?utm_source=youtube&utm_medium=video&utm_campaign=ch24-xuat-dang\n\nhttps://cuongthai.com/courses/content-creator?utm_source=tiktok&utm_medium=bio&utm_campaign=ch24-xuat-dang\n\nhttps://cuongthai.com/courses/content-creator?utm_source=instagram&utm_medium=reels&utm_campaign=ch24-xuat-dang', 'plaintext')
      + note('utm_source = nơi dẫn tới · utm_medium = hình thức (video/bio/reels) · utm_campaign = tên chiến dịch — đọc lại trong Google Analytics ở Chương 26.'),
  },

  /* 12 — nhạc có phép */
  {
    t: 'Nhạc có phép — bốn nguồn, bốn kiểu giấy phép',
    body: cards([
      { ic: '🎵', t: 'YouTube Audio Library', d: 'Miễn phí, có thể kiếm tiền — nhạc dán nhãn Creative Commons PHẢI ghi nguồn trong mô tả.', c: 'blu' },
      { ic: '✂️', t: 'CapCut Commercial Music', d: 'Đã học Bài 12.3 — chỉ xác nhận dùng được TRÊN CapCut, không đảm bảo cho nơi khác.', c: 'amb' },
      { ic: '🎧', t: 'Epidemic Sound', d: 'Video đăng LÚC ĐANG trả phí (kênh đã safelist) sạch bản quyền MÃI MÃI — huỷ gói thì không dùng được cho video MỚI.', c: 'grn' },
      { ic: '🎼', t: 'Artlist', d: 'Giấy phép theo TỪNG dự án đã đăng lúc còn trả phí — không phải "trọn đời"; huỷ gói thì không gắn được vào dự án MỚI.', c: 'tea' },
    ], 2),
  },

  /* 13 — Content ID claim vs copyright strike */
  {
    t: 'Content ID claim khác Copyright strike thế nào',
    body: table(['', 'Content ID claim', 'Copyright strike'], [
      ['Vì sao xảy ra', 'Hệ thống TỰ ĐỘNG so khớp với nhạc/clip đã đăng ký', 'Chủ sở hữu bản quyền GỬI yêu cầu gỡ hợp lệ'],
      ['Hậu quả cho video', 'Chặn / kiếm tiền hộ chủ sở hữu / chỉ theo dõi — có thể khác nhau theo TỪNG quốc gia', 'Video bị GỠ khỏi YouTube'],
      ['Hậu quả cho kênh', '-KHÔNG tính là strike', '3 strike trong 90 ngày → kênh bị chấm dứt'],
      ['Cách gỡ', 'Tranh chấp (dispute) claim', 'Hết hạn sau 90 ngày (hoàn thành Copyright School) hoặc counter notification'],
    ], { sm: true }),
  },

  /* 14 — fair use vs luật VN */
  {
    t: '"Fair use" vs Luật Sở hữu trí tuệ Việt Nam',
    body: box('warn', '<b>"Fair use" là khái niệm của luật Mỹ</b> — không tự động áp dụng ở Việt Nam. Việt Nam có <b>Luật Sở hữu trí tuệ</b> riêng (Luật số 50/2005/QH11, sửa đổi 2009, 2019 và 2022) điều chỉnh quyền tác giả. Đây KHÔNG phải tư vấn pháp lý — chỉ nêu nguyên tắc; muốn chắc chắn về một tình huống cụ thể thì hỏi nguồn chính thức hoặc luật sư.'),
  },

  /* 15 — bảng tra nhanh cuối chương */
  {
    t: 'Bảng tra nhanh trước khi bấm Đăng',
    body: table(['Việc', 'Con số / thao tác'], [
      ['Xuất chuẩn YouTube', 'MP4 · H.264 High · VBR (maxrate &gt; bitrate) · AAC-LC 48kHz 384kbps · <code>-movflags +faststart</code>'],
      ['Bitrate 1080p SDR', '8 Mbps (chuẩn) / 12 Mbps (48–60fps)'],
      ['Bitrate 4K SDR', '35–45 Mbps (chuẩn) / 53–68 Mbps (48–60fps)'],
      ['Chapters', '00:00 đầu tiên · ≥3 mốc · mỗi đoạn ≥10 giây'],
      ['Hashtag YouTube', '>60 hashtag → bỏ qua TẤT CẢ'],
      ['Watermark khi đăng chéo', 'Remove ở MỖI lần xuất — không phải cài một lần là xong'],
      ['UTM', 'utm_source · utm_medium · utm_campaign'],
      ['3 strike / 90 ngày', 'Kênh bị chấm dứt'],
    ], { sm: true }),
  },

  /* 16 — thực hành */
  {
    t: '🎬 Thực hành',
    body: steps([
      ['Xuất một clip thật đúng khuyến nghị YouTube', '<code>ffmpeg</code> theo đúng lệnh Bài 24.1, kiểm lại bằng <code>ffprobe</code> — không tin bằng mắt'],
      ['Viết mô tả YouTube đầy đủ cho MỘT video thật', '2 dòng đầu + link cuongthai.com có UTM + danh sách chương 00:00 (nếu video đủ 3 đoạn)'],
      ['Xuất bản sạch, đăng chéo ít nhất 2 nền tảng', 'Watermark → Remove, mô tả RIÊNG cho từng nơi, không copy 1 caption dán khắp'],
      ['Ghi rõ nguồn nhạc đang dùng', 'Xác nhận lại: nhạc đó còn dùng được không nếu bạn ngừng trả phí dịch vụ tháng sau'],
    ]) + box('good', '<b>Đạt khi:</b> có một file .mp4 xuất đúng chuẩn YouTube (đã soi bằng ffprobe), một mô tả video thật có UTM, và bạn nói được nhạc nền của video đó còn hợp lệ hay không nếu ngừng trả phí dịch vụ đang dùng.'),
  },
]);
