/**
 * Dữ liệu trang chủ app CT Language (/language/app) — 17/11/2026, ngày 1.0.1 lên App Store.
 *
 * Mọi câu phải khớp tính năng CÓ THẬT trong bản trên store. Nguồn đối chiếu: chữ App Store
 * (`ios-app/app-store/ctlanguage/metadata.json`), ghi chú duyệt (`NOTES-FOR-REVIEW.txt`), lịch sử commit 1.0.1.
 * Con số chỉ lấy số đếm được (1.071 điểm ngữ pháp, 214 bộ thủ, 124 tập podcast = số tệp trong content/ctlanguage/podcast).
 */
import type { AppSite } from '@/components/appsite/types';

const A = '/images/ct-language/app';

export const CTLANGUAGE_SITE: AppSite = {
  goc: '/language/app',
  ten: 'CT Language',
  phuDe: 'Học Nhật · Trung · Anh cùng AI',
  tieuDeLon: 'Học tiếng Nhật, Trung, Anh từ số\u00a00 cùng Gấu và CuongMini',
  moTa:
    'App học ngoại ngữ cho người Việt: lộ trình từ bảng chữ cái tới luyện thi JLPT, HSK, IELTS, giải thích bằng tiếng Việt. Từ điển, dịch, podcast, học qua video và 5 trò chơi — miễn phí, không quảng cáo, không cần tài khoản để bắt đầu.',
  icon: `${A}/icon-180.png`,
  mau: '#f97316',
  mau2: '#8b5cf6',
  appStoreId: '6834209813',
  nenTang: 'iPhone & iPad · miễn phí, có gói Pro tuỳ chọn',
  nutPhu: [{ href: '/language', nhan: 'Học trên web' }],
  conSo: [
    { so: '3', nhan: 'ngôn ngữ trong một app' },
    { so: '1.071', nhan: 'điểm ngữ pháp N5–N1 · HSK 1–6 · A1–C1' },
    { so: '124', nhan: 'tập podcast theo cấp' },
    { so: '214', nhan: 'bộ thủ có thứ tự nét' },
    { so: '5', nhan: 'trò chơi học từ' },
  ],
  diemNoi: [
    { emoji: '🇻🇳', ten: 'Giải thích bằng tiếng Việt', moTa: 'Âm Hán Việt, nghĩa tiếng Việt, mẹo nhớ viết cho người Việt — không phải dịch máy từ app nước ngoài.' },
    { emoji: '🐻', ten: 'Có Gấu đồng hành', moTa: 'Bấm nút Gấu ở bất kỳ màn nào để hỏi CuongMini về đúng thứ bạn đang xem, kể cả gửi ảnh trang sách.' },
    { emoji: '🗺️', ten: 'Có lộ trình, không học vu vơ', moTa: '"Hôm nay 15 phút" xếp sẵn: ôn từ đến hạn, nghe, nói, học tiếp bài đang dở.' },
    { emoji: '🚫', ten: 'Không quảng cáo', moTa: 'Bài học, từ điển, dịch và trò chơi miễn phí. Pro chỉ nâng giới hạn, không khoá phần học cơ bản.' },
  ],
  tinhNang: [
    {
      id: 'lo-trinh', emoji: '🗺️', ten: 'Học từ số 0, có lộ trình',
      ngan: 'Nhật từ Hiragana tới JLPT, Trung từ pinyin tới HSK, Anh từ 44 âm IPA tới IELTS.',
      chiTiet: [
        'Tiếng Nhật: Hiragana, Katakana rồi 16 bài sơ cấp theo lộ trình JLPT',
        'Tiếng Trung: pinyin và thanh điệu rồi khoá từ 0 theo cấp HSK',
        'Tiếng Anh: 44 âm IPA rồi hai tập luyện IELTS (nền tảng và bốn kỹ năng)',
        '"Hôm nay 15 phút": ôn từ đến hạn, nghe, nói, học tiếp bài đang dở',
        'Bài kiểm tra cuối mỗi bài học',
      ],
      anh: `${A}/iphone-01-ba-ngon-ngu.webp`, anhIpad: `${A}/ipad-05-hoc-hai-cot.webp`,
    },
    {
      id: 'cuongmini', emoji: '🤖', ten: 'CuongMini — trợ lý AI',
      ngan: 'Hỏi gì cũng được về từ, ngữ pháp, bài đang học; trả lời bằng tiếng Việt, có bảng và câu tự kiểm tra.',
      chiTiet: [
        'Gửi tối đa 3 ảnh mỗi câu: trang sách, biển hiệu, bài tập',
        '8 tính cách: bạn học, cô giáo tận tâm, huấn luyện viên, luyện thi, kể chuyện…',
        'Nút Gấu ở mọi màn — hỏi ngay về nội dung đang xem',
        'Miễn phí 8 câu/ngày, Pro 80 câu/ngày',
      ],
      anh: `${A}/iphone-02-cuongmini-ai.webp`, anhIpad: `${A}/ipad-06-cuongmini.webp`,
    },
    {
      id: 'goi-thoai', emoji: '📞', ten: 'Gọi thoại luyện nói',
      ngan: 'Nói chuyện với CuongMini như gọi điện, theo chủ đề — sai đâu sửa đó.',
      chiTiet: ['Chọn chủ đề hội thoại theo trình độ', 'Sửa lỗi ngay trong cuộc gọi', 'Pro: chấm điểm cả buổi nói', 'Miễn phí 10 lượt nói mỗi ngày'],
      anh: `${A}/iphone-03-goi-thoai.webp`,
    },
    {
      id: 'hoc-tu-vung', emoji: '🧠', ten: 'Học từ vựng mỗi ngày', nhan: 'MỚI',
      ngan: 'Đặt mục tiêu ngày, học thẻ rồi kiểm tra trộn 6 dạng câu — từ đã thuộc không lặp lại.',
      chiTiet: [
        'Tiếng Anh theo lộ trình IELTS, tiếng Nhật theo bài Dekiru, tiếng Trung theo HSK',
        'Học thẻ → kiểm tra trộn dạng (chọn nghĩa, nghe, ghép, gõ…) → ngữ pháp → tổng kết',
        'Có tim như game, học lại từ sai, ôn từ khó, "Từ của tôi"',
        'Sau 4 ngày, app nhắc "Bạn còn nhớ…" để ôn đúng lúc sắp quên',
      ],
    },
    {
      id: 'hoc-qua-video', emoji: '🎬', ten: 'Học qua video', nhan: 'MỚI',
      ngan: 'Dán link YouTube hoặc TikTok, học bằng phụ đề song ngữ có furigana và pinyin.',
      chiTiet: [
        'Chạm từ trong phụ đề để tra và lưu',
        'Lặp câu, lặp đoạn A–B, nghe trước, nghe chép, nhại theo và ghi âm so sánh',
        'Hỏi CuongMini theo câu, đoạn hoặc cả video ⇒ thẻ từ vựng và ngữ pháp, lưu vào bộ sưu tập',
        'Tiếp tục đúng chỗ đang xem dở; video phát bằng trình phát chính thức của nền tảng',
      ],
    },
    {
      id: 'podcast', emoji: '🎧', ten: 'Podcast theo cấp', nhan: 'MỚI',
      ngan: '124 tập nghe theo trình độ, câu được tô sáng khi đọc, chạm từ để tra.',
      chiTiet: [
        'Song ngữ hoặc nghe trước rồi mới xem chữ',
        'Nghe chậm, lặp câu, nói theo; cách nói khác và ngữ pháp từng câu',
        'Chạm tên riêng (người, nước, thành phố) để xem cách đọc và giới thiệu',
        'Câu hỏi hiểu bài cuối tập',
      ],
    },
    {
      id: 'tu-dien', emoji: '📖', ten: 'Từ điển nghĩa tiếng Việt',
      ngan: 'Nhật · Trung · Anh, âm Hán Việt, on/kun, pinyin, ví dụ; tra bằng gõ, viết tay, giọng nói, camera.',
      chiTiet: ['Hoạt hình thứ tự nét, tra 214 bộ thủ', 'Bộ từ HSK 1–6, JLPT N5–N1, CEFR A1–C2', 'Viết tay bằng Apple Pencil trên iPad', 'Chọn giọng đọc và tốc độ 0,5–1,5×'],
      anh: `${A}/iphone-04-tu-dien.webp`, anhIpad: `${A}/ipad-04-tu-dien-hai-cot.webp`,
    },
    {
      id: 'dich', emoji: '🌐', ten: 'Dịch và đọc báo',
      ngan: 'Dịch văn bản, PDF, ảnh, camera, hội thoại hai người — chạy ngay trên iPhone, dùng được khi mất mạng.',
      chiTiet: [
        'Dùng offline sau khi tải gói ngôn ngữ',
        'Dán link bài báo: thêm pinyin/furigana, gạch màu theo cấp HSK/JLPT/CEFR',
        'Chạm từ để tra và lưu vào sổ',
        'AI sửa bài viết, chỉ ra lỗi và cách viết tự nhiên hơn',
      ],
      anh: `${A}/iphone-05-doc-bao-dich.webp`,
    },
    {
      id: 'luyen-thi', emoji: '📝', ten: 'Luyện thi',
      ngan: 'Đề thi thử theo cấu trúc JLPT N5–N3, HSK 1–4, IELTS; tính giờ, phiếu điểm, xem lại câu sai.',
      chiTiet: ['Thi nói với giám khảo AI: IELTS Speaking Part 1–3, HSKK sơ cấp', 'Thi nhanh từ vựng 12 phút', 'Luyện phát âm chấm từng từ, từng âm, thanh điệu tiếng Trung', 'Pro: thi không giới hạn, giải thích chi tiết, biểu đồ tiến bộ'],
      anh: `${A}/iphone-07-thi-thu.webp`, anhIpad: `${A}/ipad-10-thi-thu.webp`,
    },
    {
      id: 'tro-choi', emoji: '🎮', ten: '5 trò chơi học từ',
      ngan: 'Gấu Canh Trời, Gấu Thư Pháp, Gấu Câu Chữ, Bếp Gấu Bận Rộn, Gấu Chạy Ghép Câu.',
      chiTiet: ['Mỗi game có Vượt chặng, 60 giây và Thách đấu bạn bè bằng mã', 'Bảng xếp hạng', 'Tủ đồ cho Gấu đổi bằng xu kiếm được khi học — xu không bán', 'Viết tay bằng Apple Pencil trong Gấu Thư Pháp'],
      anh: `${A}/iphone-06-game.webp`, anhIpad: `${A}/ipad-07-game.webp`,
    },
    {
      id: 'ngu-phap', emoji: '🧩', ten: 'Thư viện ngữ pháp',
      ngan: '1.071 điểm ngữ pháp N5–N1, HSK 1–6, A1–C1 — có ví dụ, so sánh, bài luyện.',
      chiTiet: ['Lộ trình ngữ pháp theo cấp', 'Ví dụ có cách đọc và nghĩa', 'Hỏi CuongMini ngay trên từng điểm ngữ pháp'],
      anh: `${A}/iphone-08-lo-trinh-ngu-phap.webp`,
    },
    {
      id: 'so-tay', emoji: '🗂️', ten: 'Sổ tay ôn lặp & widget',
      ngan: 'Sổ tay ôn lặp ngắt quãng, nhiều sổ, đồng bộ theo tài khoản; lật thẻ ngay trên widget.',
      chiTiet: [
        'Sổ từ chuyên ngành: CNTT, du lịch, nhà hàng – khách sạn, nhà máy, văn phòng, y tế…',
        'Lưu từ từ app khác qua nút Chia sẻ',
        '5 widget màn hình chính và màn khoá',
        'Miễn phí 200 từ, Pro không giới hạn',
      ],
      anh: `${A}/iphone-09-so-tay.webp`,
    },
    {
      id: 'cong-dong', emoji: '💬', ten: 'Cộng đồng & tin nhắn',
      ngan: 'Hỏi đáp theo ngôn ngữ, đăng kèm ảnh, nhắn tin với bạn học — có kiểm duyệt.',
      chiTiet: ['Bảng xếp hạng người giúp đỡ', 'Tin từ người lạ vào mục Lời mời', 'Lọc từ xấu, báo cáo, chặn người dùng'],
      anh: `${A}/iphone-10-cong-dong.webp`, anhIpad: `${A}/ipad-08-tin-nhan.webp`,
    },
    {
      id: 'vong-quay', emoji: '🎡', ten: 'Chuỗi ngày & vòng quay', nhan: 'MỚI',
      ngan: 'Học đều mỗi ngày giữ chuỗi; mỗi ngày một lượt quay miễn phí nhận quà trong app.',
      chiTiet: [
        '+1 lượt khi đạt mục tiêu ngày, +1 ở mốc chuỗi 7 ngày',
        'Quà chỉ là xu và đồ trang trí trong app, tỉ lệ ghi rõ trong mục Thể lệ',
        'Không bán lượt quay',
      ],
    },
    {
      id: 'ipad', emoji: '✏️', ten: 'iPad & Apple Pencil',
      ngan: 'Bố cục hai cột thật trên iPad, viết tay tra chữ và chơi game bằng Apple Pencil.',
      chiTiet: ['Thanh bên iPadOS, phím tắt bàn phím', 'Từ điển và bài học hai cột', 'Xoay ngang thoải mái'],
      anhIpad: `${A}/ipad-02-pencil-tra-chu.webp`,
    },
    {
      id: 'ca-nhan', emoji: '🎨', ten: 'Cá nhân hoá',
      ngan: 'Linh vật Gấu pixel cùng 7 bạn đồng hành, 3 bảng màu, 14 hình nền.',
      chiTiet: ['Nhắc học đúng giờ', 'Chuỗi ngày học và mốc mừng', 'Đăng nhập bằng Apple, Google hoặc GitHub để đồng bộ'],
      anhIpad: `${A}/ipad-09-toi-ngang.webp`,
    },
  ],
  anhChay: [
    { anh: `${A}/iphone-01-ba-ngon-ngu.webp`, nhan: 'Ba ngôn ngữ, một app' },
    { anh: `${A}/iphone-02-cuongmini-ai.webp`, nhan: 'Hỏi CuongMini' },
    { anh: `${A}/iphone-03-goi-thoai.webp`, nhan: 'Gọi thoại luyện nói' },
    { anh: `${A}/iphone-04-tu-dien.webp`, nhan: 'Từ điển tiếng Việt' },
    { anh: `${A}/iphone-05-doc-bao-dich.webp`, nhan: 'Dịch & đọc báo' },
    { anh: `${A}/iphone-06-game.webp`, nhan: '5 trò chơi' },
    { anh: `${A}/iphone-07-thi-thu.webp`, nhan: 'Thi thử' },
    { anh: `${A}/iphone-08-lo-trinh-ngu-phap.webp`, nhan: 'Lộ trình ngữ pháp' },
    { anh: `${A}/iphone-09-so-tay.webp`, nhan: 'Sổ tay ôn lặp' },
    { anh: `${A}/iphone-10-cong-dong.webp`, nhan: 'Cộng đồng' },
  ],
  anhIpad: [
    { anh: `${A}/ipad-01-ipad.webp`, nhan: 'Trên iPad' },
    { anh: `${A}/ipad-02-pencil-tra-chu.webp`, nhan: 'Viết tay tra chữ' },
    { anh: `${A}/ipad-03-pencil-game.webp`, nhan: 'Game với Apple Pencil' },
    { anh: `${A}/ipad-04-tu-dien-hai-cot.webp`, nhan: 'Từ điển hai cột' },
    { anh: `${A}/ipad-05-hoc-hai-cot.webp`, nhan: 'Bài học hai cột' },
    { anh: `${A}/ipad-06-cuongmini.webp`, nhan: 'CuongMini' },
  ],
  huongDan: [
    {
      id: 'bat-dau', emoji: '🚀', tieuDe: 'Bắt đầu trong 1 phút',
      buoc: [
        { ten: 'Tải app miễn phí', moTa: 'Mở App Store trên iPhone hoặc iPad, tìm "CT Language" hoặc quét mã QR ở trang này.' },
        { ten: 'Chọn ngôn ngữ và trình độ', moTa: 'Chọn Nhật, Trung hoặc Anh, rồi chọn "mới bắt đầu" hoặc trình độ hiện tại. Không cần tài khoản để học.' },
        { ten: 'Học "Hôm nay 15 phút"', moTa: 'Trang chủ xếp sẵn việc của ngày: ôn từ đến hạn, nghe, nói và bài tiếp theo. Làm hết là giữ được chuỗi ngày.', anh: `${A}/iphone-01-ba-ngon-ngu.webp` },
        { ten: 'Đăng nhập để đồng bộ (tuỳ chọn)', moTa: 'Đăng nhập bằng Apple, Google hoặc GitHub để giữ sổ từ, tiến độ và chuỗi ngày khi đổi máy, và dùng chung với web.', meo: 'Tài khoản dùng chung với cuongthai.com — học trên web hay app đều cộng tiến độ.' },
      ],
    },
    {
      id: 'hoc-tu-vung', emoji: '🧠', tieuDe: 'Học từ vựng mỗi ngày',
      buoc: [
        { ten: 'Đặt mục tiêu ngày', moTa: 'Vào Học từ vựng, chọn số từ mới mỗi ngày phù hợp với thời gian của bạn.' },
        { ten: 'Học thẻ', moTa: 'Xem từ, nghe cách đọc, ví dụ và ảnh minh hoạ. Đánh dấu "đã biết" để bỏ qua từ bạn đã thuộc.' },
        { ten: 'Làm bài kiểm tra trộn dạng', moTa: 'Chọn nghĩa, nghe chọn từ, ghép cặp, gõ lại… Sai thì mất tim, cuối buổi có tổng kết.' },
        { ten: 'Ôn đúng lúc', moTa: 'Từ sai vào mục học lại; sau 4 ngày app nhắc "Bạn còn nhớ…" để ôn trước khi quên.' },
      ],
    },
    {
      id: 'cuongmini', emoji: '🤖', tieuDe: 'Hỏi CuongMini & gọi thoại',
      buoc: [
        { ten: 'Bấm nút Gấu', moTa: 'Ở bất kỳ màn nào, bấm nút Gấu để hỏi về đúng nội dung đang xem.', anh: `${A}/iphone-02-cuongmini-ai.webp` },
        { ten: 'Gửi ảnh', moTa: 'Chụp trang sách, biển hiệu hay bài tập — tối đa 3 ảnh mỗi câu — CuongMini đọc và giải thích.' },
        { ten: 'Chọn tính cách', moTa: 'Đổi giữa 8 tính cách: bạn học, cô giáo tận tâm, huấn luyện viên, luyện thi…' },
        { ten: 'Gọi thoại luyện nói', moTa: 'Chọn chủ đề rồi nói như gọi điện. CuongMini sửa lỗi ngay trong cuộc gọi.', meo: 'Miễn phí 8 câu hỏi và 10 lượt nói mỗi ngày; Pro nâng lên nhiều hơn.' },
      ],
    },
    {
      id: 'hoc-qua-video', emoji: '🎬', tieuDe: 'Học qua video',
      buoc: [
        { ten: 'Dán link video', moTa: 'Vào Học qua video, dán link YouTube hoặc TikTok có phụ đề, hoặc chọn video trong thư viện.' },
        { ten: 'Xem với phụ đề song ngữ', moTa: 'Phụ đề có furigana/pinyin; chạm một từ để tra nghĩa và lưu vào sổ.' },
        { ten: 'Luyện từng câu', moTa: 'Lặp câu, lặp đoạn A–B, nghe chép hoặc nhại theo và ghi âm để so với bản gốc.' },
        { ten: 'Rút thẻ học bằng CuongMini', moTa: 'Hỏi CuongMini theo câu, đoạn hoặc cả video để có thẻ từ vựng và ngữ pháp, rồi lưu vào bộ sưu tập.' },
      ],
    },
    {
      id: 'tu-dien-dich', emoji: '📖', tieuDe: 'Từ điển & dịch',
      buoc: [
        { ten: 'Tra theo cách bạn thích', moTa: 'Gõ, viết tay, nói hoặc chĩa camera vào chữ.', anh: `${A}/iphone-04-tu-dien.webp` },
        { ten: 'Xem thứ tự nét và bộ thủ', moTa: 'Mỗi chữ Hán/Kanji có hoạt hình thứ tự nét, âm Hán Việt và bộ thủ.' },
        { ten: 'Dịch khi không có mạng', moTa: 'Tải gói ngôn ngữ một lần, sau đó dịch văn bản, ảnh, PDF và hội thoại ngay trên máy.' },
        { ten: 'Đọc báo có trợ giúp', moTa: 'Dán link bài báo: app thêm pinyin/furigana và tô màu từ theo cấp; chạm từ để tra.' },
      ],
    },
    {
      id: 'luyen-thi', emoji: '📝', tieuDe: 'Luyện thi JLPT · HSK · IELTS',
      buoc: [
        { ten: 'Chọn đề', moTa: 'Vào Thi thử, chọn kỳ thi và cấp. Đề theo đúng cấu trúc từng phần.', anh: `${A}/iphone-07-thi-thu.webp` },
        { ten: 'Làm bài có tính giờ', moTa: 'Đồng hồ chạy riêng từng phần như phòng thi thật.' },
        { ten: 'Xem phiếu điểm', moTa: 'Điểm từng phần, câu sai kèm giải thích để học lại.' },
        { ten: 'Thi nói với giám khảo AI', moTa: 'IELTS Speaking Part 1–3 hoặc HSKK sơ cấp: trả lời bằng giọng nói, nhận nhận xét chi tiết.' },
      ],
    },
    {
      id: 'so-tay', emoji: '🗂️', tieuDe: 'Sổ tay, widget & trò chơi',
      buoc: [
        { ten: 'Lưu từ khi học', moTa: 'Bấm lưu ở bất kỳ từ nào; từ vào sổ ôn lặp ngắt quãng.', anh: `${A}/iphone-09-so-tay.webp` },
        { ten: 'Lưu từ app khác', moTa: 'Bôi đen chữ trong Safari hay app khác → Chia sẻ → CT Language.' },
        { ten: 'Thêm widget', moTa: 'Giữ màn hình chính → + → CT Language → chọn widget lật thẻ để ôn ngay trên màn hình.' },
        { ten: 'Chơi để nhớ', moTa: 'Mở Trò chơi, chọn một trong 5 game; kiếm xu đổi đồ cho Gấu.' },
      ],
    },
    {
      id: 'tai-khoan', emoji: '👤', tieuDe: 'Tài khoản & gói Pro',
      buoc: [
        { ten: 'Đăng ký Pro', moTa: 'Trong app, mở màn Pro, chọn gói tháng hoặc năm. Người mới có 7 ngày dùng thử.' },
        { ten: 'Huỷ hoặc đổi gói', moTa: 'Cài đặt › Apple ID › Gói đăng ký › CT Language. Tắt ít nhất 24 giờ trước khi hết kỳ để không bị gia hạn.' },
        { ten: 'Khôi phục giao dịch', moTa: 'Đổi máy? Mở màn Pro và chọn Khôi phục giao dịch bằng cùng Apple ID.' },
        { ten: 'Xoá tài khoản', moTa: 'Bấm ảnh đại diện › Xoá tài khoản. Việc xoá hoàn tất sau 72 giờ và có thể huỷ trong thời gian đó.', meo: 'Xoá tài khoản không tự huỷ thuê bao Apple — nhớ huỷ trong Cài đặt.' },
      ],
    },
  ],
  pro: {
    ten: 'CT Language Pro',
    moTa: 'Bản miễn phí đủ để học hằng ngày — Pro nâng giới hạn',
    gia: '49.000 ₫/tháng hoặc 399.000 ₫/năm tại Việt Nam (giá chính xác theo khu vực hiện trong app). Người mới có 7 ngày dùng thử.',
    ghiChu:
      'Thuê bao tự gia hạn qua Apple. Phí tính vào tài khoản Apple khi xác nhận mua và tự gia hạn trừ khi tắt ít nhất 24 giờ trước khi hết kỳ. Quản lý hoặc huỷ trong Cài đặt › Apple ID › Gói đăng ký. Một gói Pro dùng chung trên cuongthai.com và các app CuongThai. Các lượt AI có giới hạn sử dụng hợp lý để chống lạm dụng.',
    bang: [
      { muc: 'Bài học, từ điển, dịch, podcast, trò chơi', free: '✓', pro: '✓' },
      { muc: 'Không quảng cáo', free: '✓', pro: '✓' },
      { muc: 'Hỏi CuongMini', free: '8 câu/ngày', pro: '80 câu/ngày' },
      { muc: 'Gọi thoại luyện nói', free: '10 lượt nói/ngày', pro: 'Thoải mái + chấm điểm cả buổi' },
      { muc: 'AI sửa bài viết, bài học AI, chấm phát âm', free: 'Có giới hạn', pro: 'Nhiều hơn' },
      { muc: 'Thi thử & thi nói với giám khảo AI', free: 'Có giới hạn', pro: 'Không giới hạn' },
      { muc: 'Giải thích chi tiết, biểu đồ tiến bộ', free: '—', pro: '✓' },
      { muc: 'Sổ từ ôn lặp', free: '200 từ', pro: 'Không giới hạn' },
      { muc: 'Tải trọn khoá học & từ điển học offline', free: '—', pro: '✓' },
      { muc: 'Dùng chung trên web cuongthai.com', free: '—', pro: '✓' },
    ],
  },
  congDong: {
    moTa: 'Trong app có mục Cộng đồng hỏi đáp theo từng ngôn ngữ và nhắn tin với bạn học. Trên web, bạn hỏi đáp ở trang Q&A của từng khoá và diễn đàn chung.',
    lienKet: [
      { href: '/language/ja/qna', nhan: '🇯🇵 Hỏi đáp tiếng Nhật', moTa: 'Ngữ pháp, Kanji, JLPT — hỏi và trả lời trên web' },
      { href: '/language/zh/qna', nhan: '🇨🇳 Hỏi đáp tiếng Trung', moTa: 'Pinyin, thanh điệu, HSK' },
      { href: '/language/en/qna', nhan: '🇬🇧 Hỏi đáp tiếng Anh', moTa: 'IELTS, phát âm, từ vựng' },
      { href: '/forum', nhan: '🗣️ Diễn đàn CuongThai', moTa: 'Thảo luận chung, chia sẻ kinh nghiệm học' },
      { href: '/gop-y', nhan: '💌 Góp ý cho app', moTa: 'Báo lỗi hoặc đề xuất tính năng mới' },
      { href: '/language', nhan: '💻 Học tiếp trên web', moTa: 'Cùng tài khoản, cùng tiến độ với app' },
    ],
    quyTac: [
      'Tôn trọng mọi người, không xúc phạm, không quấy rối',
      'Hỏi rõ ràng, kèm ảnh hoặc câu gốc nếu có',
      'Không quảng cáo, không đăng link lừa đảo',
      'Không đăng nội dung vi phạm bản quyền (đề thi, sách scan)',
      'Thấy nội dung xấu: bấm Báo cáo hoặc Chặn — có người kiểm duyệt xem xét',
    ],
  },
  capNhat: [
    {
      phienBan: '1.0.1', ngay: '17/11/2026', tieuDe: 'Ra mắt trên App Store 🎉',
      muc: [
        'Học từ vựng mỗi ngày: mục tiêu ngày, kiểm tra trộn 6 dạng, tim, tổng kết, nhắc ôn sau 4 ngày',
        'Học qua video YouTube/TikTok: phụ đề song ngữ, lặp câu A–B, nghe chép, nhại theo, thẻ học từ CuongMini',
        'Podcast 124 tập theo cấp, chạm tên riêng để xem cách đọc và giới thiệu',
        'Trang chủ mới, chuỗi ngày và vòng quay mỗi ngày',
        'Đăng nhập bằng Google và GitHub (ngoài Apple)',
        'Chọn giọng đọc từng ngôn ngữ và tốc độ 0,5–1,5×; giọng CuongMini mới',
        'Hỗ trợ iPad thật: hai cột, thanh bên, Apple Pencil',
      ],
    },
  ],
  hoiDap: [
    { nhom: 'Chung', hoi: 'CT Language có miễn phí không?', dap: 'Có. Bài học, từ điển, dịch, podcast và trò chơi dùng miễn phí, không quảng cáo. Gói Pro chỉ nâng giới hạn các tính năng AI, thi thử và sổ từ.' },
    { nhom: 'Chung', hoi: 'Có cần tài khoản không?', dap: 'Không cần để bắt đầu. Đăng nhập (Apple, Google hoặc GitHub) khi bạn muốn đồng bộ tiến độ giữa các máy và với web.' },
    { nhom: 'Chung', hoi: 'App có trên Android không?', dap: 'Hiện chỉ có trên iPhone và iPad. Trên máy khác, bạn học được ở cuongthai.com/language bằng cùng tài khoản.' },
    { nhom: 'Chung', hoi: 'Học trên web và trên app có chung tiến độ không?', dap: 'Có, khi bạn đăng nhập cùng tài khoản: sổ từ, tiến độ và gói Pro dùng chung.' },
    { nhom: 'Học', hoi: 'Mới bắt đầu nên học gì trước?', dap: 'Chọn ngôn ngữ rồi làm "Hôm nay 15 phút". Tiếng Nhật: bắt đầu từ Hiragana. Tiếng Trung: pinyin và thanh điệu. Tiếng Anh: 44 âm IPA.' },
    { nhom: 'Học', hoi: 'App giúp thi tới cấp nào?', dap: 'Lộ trình tiếng Nhật hướng tới JLPT, tiếng Trung theo HSK, tiếng Anh theo IELTS. Đề thi thử hiện có JLPT N5–N3, HSK 1–4 và IELTS; thư viện ngữ pháp phủ N5–N1, HSK 1–6, A1–C1.' },
    { nhom: 'Học', hoi: 'Học từ vựng có lặp lại từ đã biết không?', dap: 'Không. Từ đánh dấu "đã biết" hoặc đã thuộc không được đưa lại vào bài mới; từ sai được ôn riêng.' },
    { nhom: 'Học', hoi: 'Dùng app khi không có mạng được không?', dap: 'Dịch chạy offline sau khi tải gói ngôn ngữ. Pro tải được trọn khoá học và từ điển để học offline. Tính năng AI cần mạng.' },
    { nhom: 'CuongMini', hoi: 'CuongMini là gì?', dap: 'Trợ lý AI của app: trả lời bằng tiếng Việt về từ, ngữ pháp, bài đang học, đọc ảnh bạn gửi và gọi thoại luyện nói. Câu trả lời của AI có thể sai — hãy đối chiếu khi cần.' },
    { nhom: 'CuongMini', hoi: 'Mỗi ngày hỏi được bao nhiêu câu?', dap: 'Miễn phí 8 câu và 10 lượt nói mỗi ngày; Pro 80 câu/ngày và gọi thoại thoải mái. Lượt được làm mới mỗi ngày.' },
    { nhom: 'Pro & thanh toán', hoi: 'Giá Pro bao nhiêu?', dap: 'Tại Việt Nam: 49.000 ₫/tháng hoặc 399.000 ₫/năm. Giá chính xác theo khu vực hiện trong app. Người mới có 7 ngày dùng thử.' },
    { nhom: 'Pro & thanh toán', hoi: 'Huỷ Pro thế nào?', dap: 'Cài đặt › Apple ID › Gói đăng ký › CT Language › Huỷ. Tắt ít nhất 24 giờ trước khi hết kỳ để không bị gia hạn.' },
    { nhom: 'Pro & thanh toán', hoi: 'Đổi máy có mất Pro không?', dap: 'Không. Mở màn Pro và chọn Khôi phục giao dịch bằng cùng Apple ID.' },
    { nhom: 'Pro & thanh toán', hoi: 'Vòng quay có phải cờ bạc không?', dap: 'Không. Lượt quay không bán; quà chỉ là xu và đồ trang trí dùng trong app, không quy ra tiền. Tỉ lệ ghi rõ trong mục Thể lệ.' },
    { nhom: 'Tài khoản & riêng tư', hoi: 'Xoá tài khoản ở đâu?', dap: 'Bấm ảnh đại diện › Xoá tài khoản. Việc xoá hoàn tất sau 72 giờ và có thể huỷ trong thời gian đó. Nhớ huỷ thuê bao Apple riêng.' },
    { nhom: 'Tài khoản & riêng tư', hoi: 'App thu thập dữ liệu gì?', dap: 'Xem mục 14 của Chính sách bảo mật: dữ liệu học, nội dung bạn gửi cho AI, ghi âm luyện nói (chỉ khi bạn bấm)… và cách xoá.' },
    { nhom: 'Tài khoản & riêng tư', hoi: 'Bị người lạ nhắn tin làm phiền?', dap: 'Tin từ người bạn chưa theo dõi vào mục Lời mời. Bạn có thể chặn hoặc báo cáo trong cuộc trò chuyện.' },
  ],
  gioiThieu: {
    doan: [
      'CT Language bắt đầu từ một nhu cầu rất thật: học tiếng Nhật, tiếng Trung và tiếng Anh cùng lúc mà không phải cài ba app, và có ai đó giải thích bằng tiếng Việt khi không hiểu.',
      'App gom lộ trình học từ số 0, từ điển nghĩa tiếng Việt, dịch, podcast, học qua video, luyện thi và trò chơi vào một nơi. CuongMini — trợ lý AI có hình Gấu pixel — luôn ở cạnh để trả lời câu hỏi, đọc ảnh bài tập và gọi thoại luyện nói.',
      'CT Language là một phần của hệ sinh thái CuongThai (cuongthai.com), dùng chung tài khoản và gói Pro với web và các app khác.',
    ],
    giaTri: [
      { emoji: '🇻🇳', ten: 'Viết cho người Việt', moTa: 'Âm Hán Việt, ví dụ gần gũi, giải thích không vòng vo.' },
      { emoji: '🔒', ten: 'Tôn trọng riêng tư', moTa: 'Không quảng cáo, không bán dữ liệu; xoá tài khoản ngay trong app.' },
      { emoji: '🐾', ten: 'Học vui, học đều', moTa: 'Gấu, chuỗi ngày, trò chơi — để mỗi ngày mở app một chút.' },
    ],
    nguoiLam: 'Làm bởi CuongThai — Hoàng Nghĩa Cường, Việt Nam.',
  },
  lienHe: {
    email: 'cuongthaihnhe176322@gmail.com',
    kenh: [
      { href: '/gop-y', nhan: 'Góp ý / báo lỗi' },
      { href: '/about', nhan: 'Về CuongThai' },
    ],
  },
  chinhSach: [
    { href: '/chinh-sach-bao-mat#ct-language', nhan: 'Chính sách bảo mật' },
    { href: '/dieu-khoan-su-dung', nhan: 'Điều khoản sử dụng' },
  ],
  gau: true,
  loiChao: 'Chào bạn! Tải app học cùng Gấu nhé ✨',
  nhanDan: ['あ', '汉', 'Aa', 'HSK·JLPT'],
};
