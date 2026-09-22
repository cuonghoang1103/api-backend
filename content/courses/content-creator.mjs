/**
 * Content Creator: Quay, Dựng & Đăng Video — khoá GENERAL của CuongThai.
 * Zero → tự lên ý tưởng, viết kịch bản, phân cảnh, quay (Pocket 3 · iPhone),
 * dựng (CapCut · DaVinci Resolve), chỉnh màu/âm, làm phụ đề, đăng và phát triển
 * kênh YouTube/TikTok/Facebook/Instagram — bằng tiếng Việt lẫn tiếng Anh.
 * Song ngữ EN/VI. Mục 0 + 27 chương (17–19 chèn 22/09/2026: hiệu ứng, VFX, motion graphics & 3D), mỗi chương ./content-creator/sNN-*.mjs.
 *
 * Luật soạn bài: ./content-creator/_HOP-DONG.md  ·  Slide: scripts/slides-src/cr-NN.mjs
 * Seed: node scripts/course-seed.mjs --file ./content/courses/content-creator.mjs --apply
 * Kiểm: node scripts/course-content-check.mjs ./content/courses/content-creator.mjs
 * Video YT từng bài: content/course-videos/content-creator.mjs (seed riêng, deploy tự chạy).
 */
import s00 from './content-creator/s00-gioi-thieu.mjs';
import s01 from './content-creator/s01-nen-tang-khan-gia.mjs';
import s02 from './content-creator/s02-y-tuong-chien-luoc.mjs';
import s03 from './content-creator/s03-kich-ban-ke-chuyen.mjs';
import s04 from './content-creator/s04-phan-canh.mjs';
import s05 from './content-creator/s05-may-quay.mjs';
import s06 from './content-creator/s06-cai-dat-thiet-bi.mjs';
import s07 from './content-creator/s07-bo-cuc.mjs';
import s08 from './content-creator/s08-anh-sang.mjs';
import s09 from './content-creator/s09-am-thanh.mjs';
import s10 from './content-creator/s10-quay-thuc-chien.mjs';
import s11 from './content-creator/s11-quy-trinh-hau-ky.mjs';
import s12 from './content-creator/s12-capcut.mjs';
import s13 from './content-creator/s13-davinci-resolve.mjs';
import s14 from './content-creator/s14-nghe-thuat-dung.mjs';
import s15 from './content-creator/s15-chinh-mau.mjs';
import s16 from './content-creator/s16-am-thanh-chu-phu-de.mjs';
import s17 from './content-creator/s17-chuyen-canh-keyframe.mjs';

export default {
  category: { slug: 'content-creation', name: 'Sáng tạo nội dung', icon: 'Video', sortOrder: 5 },
  course: {
    slug: 'content-creator',
    title: 'Content Creator: Quay, Dựng & Đăng Video',
    level: 'BEGINNER',
    language: 'Vietnamese',
    // Công khai từ 22/09/2026 theo yêu cầu người dùng ("deploy trước phần đã xong") —
    // khoá đang được soạn dần, các chương còn lại thêm vào sau.
    status: 'PUBLISHED',
    isFeatured: true,
    // Thứ tự trong CSDL bám thứ tự FILE — không có cờ này, bài mới thêm vào
    // giữa chương bị đẩy xuống cuối (đo thật 19/09/2026 ở web-foundations).
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy/CR/v1/cr-cover/001.webp',
    shortDescription: 'From zero to a working creator: ideas, scripts, shot lists, shooting on Pocket 3 and iPhone, light, sound, editing in CapCut and DaVinci Resolve, colour, captions, effects, VFX and 3D, and growing on YouTube, TikTok, Facebook and Instagram — in Vietnamese and English.|||Từ số 0 tới làm video thật: ý tưởng, kịch bản, phân cảnh, quay bằng Pocket 3 và iPhone, ánh sáng, âm thanh, dựng CapCut và DaVinci Resolve, màu, phụ đề, hiệu ứng, VFX và 3D, phát triển kênh — tiếng Việt lẫn tiếng Anh.',
    description: 'Khoá làm video do CuongThai biên soạn cho người chưa biết gì về quay dựng. Nếu bạn từng bật máy quay một lèo 30 phút rồi về không biết cắt từ đâu, thẻ nhớ đầy mà video vẫn chưa ra — khoá này dành cho bạn. 28 phần đi theo đúng quy trình của người làm nghề: tiền kỳ (nền tảng, ý tưởng, kịch bản, phân cảnh), quay (máy quay hoạt động thế nào, cài đặt DJI Osmo Pocket 3 và iPhone 16 Pro Max, bố cục, ánh sáng, âm thanh), hậu kỳ (quản lý dữ liệu, CapCut, DaVinci Resolve, nghệ thuật cắt dựng, chỉnh màu, âm thanh, phụ đề, rồi hiệu ứng chuyên nghiệp: chuyển cảnh, keyframe, tốc độ, mask, tracking, phông xanh, VFX, motion graphics, Fusion và 3D với Blender), theo định dạng (video ngắn, vlog, bài giảng, song ngữ Việt–Anh) và phát triển kênh (xuất file, thumbnail, số liệu, kiếm tiền). Mỗi chương có bộ slide nhiều hình minh hoạ, bài giảng song ngữ, bài thực hành bằng chính thiết bị của bạn, video chọn lọc và bài kiểm tra có giải thích.',
    whatYouLearn: 'Chọn nền tảng, ngách và xây thương hiệu cá nhân; tìm và thẩm định ý tưởng, lập lịch đăng; viết hook và kịch bản dễ nói; phân cảnh bằng shot list và storyboard để quay theo cảnh thay vì quay một lèo; hiểu độ phân giải, khung hình, màn trập, ISO, cân bằng trắng, codec và Log; cài đặt Pocket 3, iPhone 16 Pro Max, iPad và Mac cho từng kiểu quay; bố cục, cỡ cảnh, chuyển động máy; chiếu sáng ba điểm và thu âm sạch; tổ chức dữ liệu và sao lưu 3-2-1; dựng nhanh bằng CapCut và dựng chuyên nghiệp bằng DaVinci Resolve (trên Mac, iPad và Linux); nhịp dựng giữ chân người xem, J-cut/L-cut, âm nhạc; chỉnh màu bằng scopes, Log và LUT; mix âm thanh chuẩn LUFS, làm chữ và phụ đề (kể cả tự động bằng Whisper); chuyển cảnh, keyframe và speed ramp như dân chuyên; mask, tracking, phông xanh và VFX thực tế (nhân bản chính mình, thay màn hình); motion graphics trong Fusion và chữ/logo 3D bằng Blender; làm video ngắn, vlog, bài giảng quay màn hình và video song ngữ; xuất file đúng chuẩn từng nền tảng, thiết kế tiêu đề và thumbnail, đọc số liệu, và biến khán giả thành người theo dõi website của bạn.',
    requirements: 'Không cần biết gì về quay dựng. Có một chiếc điện thoại quay được video là bắt đầu được; khoá dùng DJI Osmo Pocket 3, iPhone 16 Pro Max, iPad Pro và máy Mac làm ví dụ, kèm cách làm tương đương cho máy khác. Phần mềm chính đều có bản miễn phí (CapCut, DaVinci Resolve).',
    documentsNote: 'Tài liệu tham chiếu chính: YouTube Help & YouTube Creators (quy định, số liệu, xuất bản) • bộ sách hướng dẫn DaVinci Resolve miễn phí của Blackmagic Design • hướng dẫn sử dụng chính hãng của DJI Osmo Pocket 3 và Apple iPhone • In the Blink of an Eye (Walter Murch) về nghệ thuật dựng.',
  },
  sections: [
    s00,
    s01,
    s02,
    s03,
    s04,
    s05,
    s06,
    s07,
    s08,
    s09,
    s10,
    s11,
    s12,
    s13,
    s14,
    s15,
    s16,
    s17,
  ],
};
