/**
 * Git & GitHub — khoá học CuongThai (Courses, academyType=GENERAL, KHÔNG thuộc kỳ Academy).
 * Giáo trình tự soạn: 14 chương, zero → cứu một kho tưởng đã hỏng, song ngữ EN/VI.
 * Sections tách theo file trong ./git/ cho dễ soạn; seeder chỉ đọc file này.
 *
 * Kiểm trước khi seed:
 *   node scripts/course-content-check.mjs ./content/courses/git.mjs
 *   node scripts/course-depth-audit.mjs   ./content/courses/git.mjs
 * Seed: node scripts/course-seed.mjs --file ./content/courses/git.mjs --apply
 */
import s00 from './git/s00-intro.mjs';
import s01 from './git/s01-mo-hinh.mjs';
import s02 from './git/s02-doc-lich-su.mjs';
import s03 from './git/s03-nhanh-hop-nhat.mjs';
import s04 from './git/s04-hoan-tac.mjs';
import s05 from './git/s05-remote-github.mjs';
import s06 from './git/s06-pull-request.mjs';
import s07 from './git/s07-quy-trinh-nhom.mjs';
import s08 from './git/s08-viet-lai-lich-su.mjs';

export default {
  category: { slug: 'devops', name: 'DevOps & Vận hành', icon: 'Rocket', sortOrder: 4 },
  course: {
    slug: 'git',
    title: 'Git & GitHub',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: true,
    // Sinh bằng scripts/course-cover.mjs (logo Simple Icons chính thức trên nền
    // bìa dùng chung của CuongThai). Sinh lại, KHÔNG sửa tay:
    //   docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
    //     --slug git --icon git --color F05032 --title "Git & GitHub" --subtitle "Zero → Production"
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/git.png',
    shortDescription: 'Master the tool you touch every day: what a commit really is, branching and merging without fear, undoing anything, pull requests and code review, rewriting history safely, and recovering work you thought was gone.|||Làm chủ công cụ bạn chạm vào mỗi ngày: một commit thật sự là gì, tạo nhánh và hợp nhất mà không sợ, hoàn tác được mọi thứ, pull request và code review, viết lại lịch sử an toàn, và cứu lại việc bạn tưởng đã mất.',
    description: 'Khoá Git & GitHub từ số 0 tới mức cứu được một kho mã tưởng đã hỏng, do CuongThai tự biên soạn. 14 chương đi từ mô hình ba cây và bản chất của một commit, qua đọc lịch sử (log, blame, bisect), nhánh và hợp nhất, mọi cách hoàn tác an toàn, remote và GitHub, pull request và code review, chiến lược nhánh cho nhóm, viết lại lịch sử, ruột gan kho đối tượng, kho mã lớn (worktree, submodule, LFS, monorepo), nền tảng GitHub, hook và ký commit, cho tới một sách công thức cứu hộ. Mọi ví dụ là output terminal chạy thật.',
    whatYouLearn: 'Hiểu ba cây (thư mục làm việc, index, HEAD) và đoán trước được mọi lệnh sẽ làm gì; giải quyết xung đột hợp nhất một cách bình tĩnh; dùng rebase tương tác để dọn lịch sử trước khi review; lấy lại commit/nhánh đã "mất" bằng reflog; tìm commit gây lỗi bằng bisect; chạy quy trình GitHub chuyên nghiệp với nhánh bảo vệ, CODEOWNERS và kiểm tra bắt buộc; gỡ một khoá API bị lộ khỏi toàn bộ lịch sử; và biết chính xác khi nào một thao tác trở nên nguy hiểm cho người khác.',
    requirements: 'Biết mở terminal và gõ lệnh cơ bản (cd, ls, mkdir). KHÔNG cần biết Git trước — Chương 1 dựng lại từ đầu. KHÔNG cần biết một ngôn ngữ lập trình cụ thể nào; ví dụ dùng file văn bản và JavaScript ở mức đọc hiểu được. Máy tính cài được Git 2.30 trở lên.',
    documentsNote: 'Tài liệu tham chiếu chính: git-scm.com/book (Pro Git, miễn phí, có bản tiếng Việt) • git-scm.com/docs (sách tra cứu lệnh) • docs.github.com cho phần nền tảng • conventionalcommits.org cho quy ước lời nhắn. Phần thực hành đi kèm: track "Git" trên Code Lab.',
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
  ],
};
