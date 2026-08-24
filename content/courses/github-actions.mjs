/**
 * GitHub Actions — khoá học CuongThai (Courses, academyType=GENERAL, KHÔNG thuộc kỳ Academy).
 * Giáo trình tự soạn: 12 mục (Mục 0 + Chương 1–11), zero → vận hành CI/CD production, song ngữ EN/VI.
 * Sections tách theo file trong ./github-actions/ cho dễ soạn; seeder chỉ đọc file này.
 *
 * MỌI SỐ ĐO trong khoá này lấy từ CHÍNH KHO NÀY: 11 workflow thật, 1.394 dòng YAML,
 * và 2.343 lần chạy thật đọc qua API của GitHub — thời lượng từng bước, từng job,
 * trên cả ba nền tảng runner. Không có con số nào chép từ tài liệu.
 *
 * KHÔNG trùng khoá Git & GitHub (nói về commit/branch/PR) và KHÔNG trùng khoá
 * Deploy VPS (nói về bốn bước của một lần deploy). Khoá này dạy CHÍNH cỗ máy
 * chạy việc: workflow được kích hoạt thế nào, job chạy ở đâu, biểu thức tính
 * lúc nào, bộ đệm giữ cái gì, và vì sao CI đỏ.
 *
 * Kiểm trước khi seed:
 *   node scripts/course-content-check.mjs ./content/courses/github-actions.mjs
 *   node scripts/course-depth-audit.mjs   ./content/courses/github-actions.mjs
 * Seed: node scripts/course-seed.mjs --file ./content/courses/github-actions.mjs --apply
 */

import s00 from './github-actions/s00-intro.mjs';
import s01 from './github-actions/s01-tep-workflow.mjs';

export default {
  category: { slug: 'devops', name: 'DevOps & Vận hành', icon: 'Server', sortOrder: 4 },
  course: {
    slug: 'github-actions',
    title: 'GitHub Actions',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: true,
    // Sinh bằng scripts/course-cover.mjs (logo Simple Icons chính thức trên nền
    // bìa dùng chung của CuongThai). Sinh lại, KHÔNG sửa tay:
    //   docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
    //     --slug github-actions --icon githubactions --color 2088FF \
    //     --title "GitHub Actions" --subtitle "Push → Production"
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/github-actions.png',
    shortDescription: 'A machine that runs your code on somebody else computer, every time you push. What triggers it, where it runs, when expressions are evaluated, what the cache actually keeps, and why the same command takes 38 seconds on Linux and 107 on Windows.|||Một cỗ máy chạy mã của bạn trên máy người khác, mỗi lần bạn push. Cái gì kích hoạt nó, nó chạy ở đâu, biểu thức được tính lúc nào, bộ đệm thật ra giữ gì, và vì sao cùng một câu lệnh mất 38 giây trên Linux và 107 trên Windows.',
    description: 'Khoá GitHub Actions từ số 0 tới mức vận hành được một đường ống CI/CD production, do CuongThai tự biên soạn. 12 mục đi từ việc CI thật ra giải quyết vấn đề gì, qua tệp workflow và cái khoá `on` mà YAML đọc thành boolean, job và runner, biểu thức và ngữ cảnh, action và thứ `uses:` thật sự làm, bộ đệm và tạo tác, ma trận và đường tới hạn, bí mật và quyền, tốc độ và chi phí, cho tới một sách công thức khi CI đỏ. MỌI số đo lấy từ 2.343 lần chạy THẬT của chính kho này.',
    whatYouLearn: 'Đọc được một tệp workflow và biết chính xác nó chạy khi nào; phân biệt được `push` với `pull_request` và cái bẫy `paths` chỉ áp cho một trong hai; hiểu job chạy ở đâu và vì sao ba nền tảng cho ba con số khác nhau cho cùng một lệnh; biết biểu thức được tính lúc NÀO và vì sao điều đó quyết định `if` của bạn có chạy không; dùng bộ đệm mà không phục vụ dữ liệu cũ; đọc được đường tới hạn của một lần chạy để biết tối ưu chỗ nào; giữ bí mật không rò ra log; và chẩn đoán một lần chạy đỏ bằng chính log của nó.',
    requirements: 'Biết git ở mức commit/push và hiểu pull request là gì — khoá Git & GitHub của CuongThai bao phần đó. Biết chạy lệnh trong terminal (khoá Linux & Bash là đủ). Có một kho GitHub để thực hành; kho công khai thì hoàn toàn miễn phí. KHÔNG cần biết CI trước: Mục 0 dựng lại từ đầu.',
    documentsNote: 'Tài liệu tham chiếu chính: docs.github.com/en/actions (tài liệu chính thức — phần "Workflow syntax for GitHub Actions" là chỗ tra từng khoá) • docs.github.com/en/actions/learn-github-actions/contexts (bảng ngữ cảnh và lúc nào cái nào có sẵn) • yaml.org/spec/1.2.2 (đặc tả YAML — đáng đọc phần kiểu vô hướng, vì phần lớn bẫy nằm ở đó). Phần thực hành đi kèm: track "GitHub Actions" trên Code Lab.',
  },
  sections: [
    s00,
    s01,
  ],
};
