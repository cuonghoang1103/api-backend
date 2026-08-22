/**
 * Linux & Bash — khoá học CuongThai (Courses, academyType=GENERAL, KHÔNG thuộc kỳ Academy).
 * Giáo trình tự soạn: 13 chương, từ lệnh cd đầu tiên tới vận hành một máy chủ thật, song ngữ EN/VI.
 * Sections tách theo file trong ./linux-bash/ cho dễ soạn; seeder chỉ đọc file này.
 *
 * Kiểm trước khi seed:
 *   node scripts/course-content-check.mjs ./content/courses/linux-bash.mjs
 *   node scripts/course-depth-audit.mjs   ./content/courses/linux-bash.mjs
 * Seed: node scripts/course-seed.mjs --file ./content/courses/linux-bash.mjs --apply
 */
import s00 from './linux-bash/s00-intro.mjs';
import s01 from './linux-bash/s01-shell-he-thong-file.mjs';

export default {
  category: { slug: 'devops', name: 'DevOps & Vận hành', icon: 'Rocket', sortOrder: 4 },
  course: {
    slug: 'linux-bash',
    title: 'Linux & Bash',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: true,
    // Sinh bằng scripts/course-cover.mjs (logo Simple Icons chính thức trên nền
    // bìa dùng chung của CuongThai). Sinh lại, KHÔNG sửa tay:
    //   docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
    //     --slug linux-bash --icon linux --color FCC624 --title "Linux & Bash" --subtitle "Terminal → Server"
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/linux-bash.png',
    shortDescription: 'Go from pasting commands you do not understand to reading any command, writing scripts that fail loudly, and diagnosing a server you have never seen — using nothing but a terminal.|||Đi từ chỗ dán những lệnh không hiểu tới chỗ đọc được mọi lệnh, viết script hỏng thì kêu to, và chẩn đoán một máy chủ chưa từng thấy — chỉ bằng một cái terminal.',
    description: 'Khoá Linux & Bash từ số 0 tới vận hành máy chủ, do CuongThai tự biên soạn. 13 chương đi từ shell và hệ thống file, qua thao tác file, xử lý văn bản bằng ống dẫn, quyền và người dùng, tiến trình và tín hiệu, shell như một ngôn ngữ lập trình, viết script cho production, môi trường và PATH, mạng và máy từ xa, đĩa/gói/log, systemd và cron, cho tới một sách công thức chẩn đoán máy chủ thật. Mọi ví dụ là output terminal chạy thật.',
    whatYouLearn: 'Đọc một lệnh lạ và đoán trước nó làm gì, kể cả khi có ống dẫn và dấu nháy; tìm mọi file theo tên/kích thước/tuổi/nội dung và tác động lên tất cả trong một dòng; hiểu quyền đủ để sửa "Permission denied" thay vì vớ lấy sudo; nhìn ra tiến trình nào ngốn CPU, cái gì giữ một cổng, vì sao đĩa đầy; viết script shell có kiểm tham số và dọn dẹp khi thoát; chạy ứng dụng dưới systemd, hẹn giờ công việc, đọc log; và chẩn đoán một máy chủ chưa từng thấy.',
    requirements: 'Biết mở một cửa sổ terminal. KHÔNG cần biết Linux trước — Mục 0 dựng cho bạn một môi trường thí nghiệm trên Windows (WSL2), macOS hoặc Linux. KHÔNG cần biết lập trình; Chương 6 dạy shell như một ngôn ngữ từ đầu. Có Docker thì tốt (dùng làm sân tập vứt đi) nhưng không bắt buộc.',
    documentsNote: 'Tài liệu tham chiếu chính: gnu.org/software/bash/manual (sách Bash chuẩn mực) • man7.org/linux/man-pages (trang man trực tuyến) • explainshell.com để mổ xẻ một lệnh lạ • tldr.sh cho ví dụ thực dụng • linuxjourney.com đọc kèm. Phần thực hành đi kèm: track "Linux & Bash" trên Code Lab.',
  },
  sections: [
    s00,
    s01,
  ],
};
