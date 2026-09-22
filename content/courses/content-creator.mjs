/**
 * Content Creator: Quay, Dựng & Đăng Video — khoá GENERAL của CuongThai.
 * Zero → tự lên ý tưởng, viết kịch bản, phân cảnh, quay (Pocket 3 · iPhone),
 * dựng (CapCut · DaVinci Resolve), chỉnh màu/âm, làm phụ đề, đăng và phát triển
 * kênh YouTube/TikTok/Facebook/Instagram — bằng tiếng Việt lẫn tiếng Anh.
 * Song ngữ EN/VI. Mục 0 + 24 chương, mỗi chương ./content-creator/sNN-*.mjs.
 *
 * Luật soạn bài: ./content-creator/_HOP-DONG.md  ·  Slide: scripts/slides-src/cr-NN.mjs
 * Seed: node scripts/course-seed.mjs --file ./content/courses/content-creator.mjs --apply
 * Kiểm: node scripts/course-content-check.mjs ./content/courses/content-creator.mjs
 * Video YT từng bài: content/course-videos/content-creator.mjs (seed riêng, deploy tự chạy).
 */
import s00 from './content-creator/s00-gioi-thieu.mjs';
import s04 from './content-creator/s04-phan-canh.mjs';
import s06 from './content-creator/s06-cai-dat-thiet-bi.mjs';

export default {
  category: { slug: 'content-creation', name: 'Sáng tạo nội dung', icon: 'Video', sortOrder: 5 },
  course: {
    slug: 'content-creator',
    title: 'Content Creator: Quay, Dựng & Đăng Video',
    level: 'BEGINNER',
    language: 'Vietnamese',
    // ⚠️ DRAFT CÓ CHỦ Ý cho tới khi đủ 25 phần + video YT: nếu phiên khác lỡ
    // deploy giữa chừng, khoá vẫn ẩn khỏi danh sách /courses (route '/' lọc
    // isPublished). Đổi sang 'PUBLISHED' ở lượt deploy chính thức.
    status: 'DRAFT',
    isFeatured: true,
    // Thứ tự trong CSDL bám thứ tự FILE — không có cờ này, bài mới thêm vào
    // giữa chương bị đẩy xuống cuối (đo thật 19/09/2026 ở web-foundations).
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy/CR/v1/cr-cover/001.webp',
    shortDescription: 'From zero to a working creator: ideas, scripts, shot lists, shooting on Pocket 3 and iPhone, light and sound, editing in CapCut and DaVinci Resolve, colour, captions, and growing on YouTube, TikTok, Facebook and Instagram — in Vietnamese and English.|||Từ số 0 tới làm video thật: ý tưởng, kịch bản, phân cảnh, quay bằng Pocket 3 và iPhone, ánh sáng, âm thanh, dựng CapCut và DaVinci Resolve, chỉnh màu, phụ đề, đăng và phát triển kênh — cả tiếng Việt lẫn tiếng Anh.',
    description: 'Khoá làm video do CuongThai biên soạn cho người chưa biết gì về quay dựng. Nếu bạn từng bật máy quay một lèo 30 phút rồi về không biết cắt từ đâu, thẻ nhớ đầy mà video vẫn chưa ra — khoá này dành cho bạn. 25 phần đi theo đúng quy trình của người làm nghề: tiền kỳ (nền tảng, ý tưởng, kịch bản, phân cảnh), quay (máy quay hoạt động thế nào, cài đặt DJI Osmo Pocket 3 và iPhone 16 Pro Max, bố cục, ánh sáng, âm thanh), hậu kỳ (quản lý dữ liệu, CapCut, DaVinci Resolve, nghệ thuật cắt dựng, chỉnh màu, âm thanh, phụ đề), theo định dạng (video ngắn, vlog, bài giảng, song ngữ Việt–Anh) và phát triển kênh (xuất file, thumbnail, số liệu, kiếm tiền). Mỗi chương có bộ slide nhiều hình minh hoạ, bài giảng song ngữ, bài thực hành bằng chính thiết bị của bạn, video chọn lọc và bài kiểm tra có giải thích.',
    whatYouLearn: 'Chọn nền tảng, ngách và xây thương hiệu cá nhân; tìm và thẩm định ý tưởng, lập lịch đăng; viết hook và kịch bản dễ nói; phân cảnh bằng shot list và storyboard để quay theo cảnh thay vì quay một lèo; hiểu độ phân giải, khung hình, màn trập, ISO, cân bằng trắng, codec và Log; cài đặt Pocket 3, iPhone 16 Pro Max, iPad và Mac cho từng kiểu quay; bố cục, cỡ cảnh, chuyển động máy; chiếu sáng ba điểm và thu âm sạch; tổ chức dữ liệu và sao lưu 3-2-1; dựng nhanh bằng CapCut và dựng chuyên nghiệp bằng DaVinci Resolve (trên Mac, iPad và Linux); nhịp dựng giữ chân người xem, J-cut/L-cut, âm nhạc; chỉnh màu bằng scopes, Log và LUT; mix âm thanh chuẩn LUFS, làm chữ và phụ đề (kể cả tự động bằng Whisper); làm video ngắn, vlog, bài giảng quay màn hình và video song ngữ; xuất file đúng chuẩn từng nền tảng, thiết kế tiêu đề và thumbnail, đọc số liệu, và biến khán giả thành người theo dõi website của bạn.',
    requirements: 'Không cần biết gì về quay dựng. Có một chiếc điện thoại quay được video là bắt đầu được; khoá dùng DJI Osmo Pocket 3, iPhone 16 Pro Max, iPad Pro và máy Mac làm ví dụ, kèm cách làm tương đương cho máy khác. Phần mềm chính đều có bản miễn phí (CapCut, DaVinci Resolve).',
    documentsNote: 'Tài liệu tham chiếu chính: YouTube Help & YouTube Creators (quy định, số liệu, xuất bản) • bộ sách hướng dẫn DaVinci Resolve miễn phí của Blackmagic Design • hướng dẫn sử dụng chính hãng của DJI Osmo Pocket 3 và Apple iPhone • In the Blink of an Eye (Walter Murch) về nghệ thuật dựng.',
  },
  sections: [
    s00,
    s04,
    s06,
  ],
};
