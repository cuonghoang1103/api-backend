/**
 * Docker — khoá học CuongThai (Courses, academyType=GENERAL, KHÔNG thuộc kỳ Academy).
 * Giáo trình tự soạn: 13 mục (Mục 0 + Chương 1–12), zero → vận hành production,
 * song ngữ EN/VI. Sections tách theo file trong ./docker/ cho dễ soạn;
 * seeder chỉ đọc file này.
 *
 * Kiểm trước khi seed:
 *   node scripts/course-content-check.mjs ./content/courses/docker.mjs
 *   node scripts/course-depth-audit.mjs   ./content/courses/docker.mjs
 * Seed: node scripts/course-seed.mjs --file ./content/courses/docker.mjs --apply
 */
import s00 from './docker/s00-intro.mjs';
import s01 from './docker/s01-mo-hinh.mjs';

export default {
  category: { slug: 'devops', name: 'DevOps & Vận hành', icon: 'Rocket', sortOrder: 4 },
  course: {
    slug: 'docker',
    title: 'Docker',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: true,
    // Sinh bằng scripts/course-cover.mjs (logo Simple Icons chính thức trên nền
    // bìa dùng chung của CuongThai). Sinh lại, KHÔNG sửa tay:
    //   docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
    //     --slug docker --icon docker --color 2496ED --title "Docker" --subtitle "Container → Production"
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/docker.png',
    shortDescription: 'From "it works on my machine" to images you can ship: what a container really is, Dockerfiles that build fast and small, volumes and networks that behave, Compose for a whole stack, and running it all in production without surprises.|||Từ "máy tôi chạy được mà" tới những ảnh đem đi đâu cũng chạy: container thật sự là gì, Dockerfile dựng nhanh và nhẹ, volume và mạng chạy đúng ý, Compose cho cả một hệ thống, và vận hành tất cả trên production mà không có bất ngờ.',
    description: 'Khoá Docker từ số 0 tới mức vận hành được một hệ thống thật trên máy chủ, do CuongThai tự biên soạn. 13 mục đi từ container và image thực chất là gì (namespace, cgroup, tầng ảnh), qua chạy container và mọi cờ đáng biết, registry và tag, Dockerfile từ cơ bản tới thành thạo, cache và multi-stage để build nhanh, ảnh nhỏ và an toàn (alpine/slim/distroless, musl với glibc, chạy không phải root), dữ liệu với volume và bind mount, mạng và DNS nội bộ, Docker Compose cho cả stack, tới vận hành production (restart policy, giới hạn tài nguyên, xoay vòng log, healthcheck, CI/CD, dọn đĩa) và một sách công thức chẩn đoán. Mọi ví dụ là output chạy thật.',
    whatYouLearn: 'Giải thích được container khác máy ảo ở chỗ nào và vì sao điều đó quan trọng; viết Dockerfile dựng lại trong vài giây thay vì vài phút nhờ hiểu cache theo tầng; cắt một ảnh Node từ 1,2GB xuống dưới 200MB bằng multi-stage; giữ dữ liệu sống sót qua mọi lần thay container; cho nhiều container gọi nhau bằng TÊN thay vì địa chỉ IP; dựng cả một hệ thống (web + API + Postgres + Redis + nginx) bằng một file Compose và một câu lệnh; chạy nó trên VPS với healthcheck, giới hạn RAM và log không làm đầy đĩa; và chẩn đoán một container chết trong im lặng chỉ bằng mã thoát của nó.',
    requirements: 'Biết dùng terminal ở mức cơ bản (cd, ls, đường dẫn, biến môi trường) — khoá "Linux & Bash" trên trang này là phần chuẩn bị lý tưởng nhưng không bắt buộc. KHÔNG cần biết Docker trước. Có một máy cài được Docker Engine hoặc Docker Desktop (Linux, macOS, hoặc Windows với WSL2), và khoảng 10GB đĩa trống để thoải mái thử.',
    documentsNote: 'Tài liệu tham chiếu chính: docs.docker.com (sổ tay chính thức, gồm cả Dockerfile reference và Compose specification) • github.com/docker/awesome-compose cho ví dụ stack thật • hub.docker.com cho ảnh nền chính thức • docs.docker.com/build/cache cho phần cache của BuildKit. Phần thực hành đi kèm: track "Docker" trên Code Lab.',
  },
  sections: [
    s00,
    s01,
  ],
};
