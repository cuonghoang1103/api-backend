/**
 * Prisma ORM — khoá học CuongThai (Courses, academyType=GENERAL, KHÔNG thuộc kỳ Academy).
 * Giáo trình tự soạn: 13 mục (Mục 0 + Chương 1–12), zero → vận hành Prisma production, song ngữ EN/VI.
 * Sections tách theo file trong ./prisma-orm/ cho dễ soạn; seeder chỉ đọc file này.
 *
 * KHÔNG trùng với Node.js Chương 7 (PostgreSQL và Prisma, 167k ký tự): khoá đó dùng
 * Prisma như một phương tiện để đổi ruột Notes API từ RAM sang PostgreSQL. Khoá này
 * dạy CHÍNH Prisma — ngôn ngữ lược đồ, sinh mã và hệ kiểu, quan hệ, migration và
 * shadow database, transaction và tranh chấp, chiến lược nạp quan hệ và hiệu năng,
 * SQL thô, engine và binary target, cho tới sách công thức chẩn đoán mã lỗi P1xxx–P6xxx.
 *
 * KHÔNG trùng với PostgreSQL (11 mục): khoá đó dạy SQL và bản thân cơ sở dữ liệu.
 * Khoá này dạy lớp giữa — và luôn chỉ ngược về nó khi cần SQL thật.
 *
 * Kiểm trước khi seed:
 *   node scripts/course-content-check.mjs ./content/courses/prisma-orm.mjs
 *   node scripts/course-depth-audit.mjs   ./content/courses/prisma-orm.mjs
 * Seed: node scripts/course-seed.mjs --file ./content/courses/prisma-orm.mjs --apply
 */
import s00 from './prisma-orm/s00-intro.mjs';
import s01 from './prisma-orm/s01-orm.mjs';
import s02 from './prisma-orm/s02-luoc-do.mjs';
import s03 from './prisma-orm/s03-quan-he.mjs';
import s04 from './prisma-orm/s04-doc-ghi.mjs';
import s05 from './prisma-orm/s05-truy-van.mjs';
import s06 from './prisma-orm/s06-migration.mjs';

export default {
  category: { slug: 'databases', name: 'Cơ sở dữ liệu', icon: 'Database', sortOrder: 3 },
  course: {
    slug: 'prisma-orm',
    title: 'Prisma ORM',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: true,
    // Sinh bằng scripts/course-cover.mjs (logo Simple Icons chính thức trên nền
    // bìa dùng chung của CuongThai). Sinh lại, KHÔNG sửa tay:
    //   docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
    //     --slug prisma-orm --icon prisma --color 2D3748 --title "Prisma ORM" --subtitle "Schema → Production"
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/prisma-orm.png',
    shortDescription: 'One schema file becomes your database, your types and your queries. Learn what Prisma actually generates, why a migration that passes locally can still fail on production, and how to read the SQL it sends before your users do.|||Một tệp lược đồ sinh ra cơ sở dữ liệu, hệ kiểu và câu truy vấn của bạn. Học xem Prisma thật sự sinh ra cái gì, vì sao một migration chạy được ở máy vẫn có thể chết trên production, và cách đọc SQL nó gửi đi trước khi người dùng đọc hộ bạn.',
    description: 'Khoá Prisma ORM từ số 0 tới mức vận hành được trên production, do CuongThai tự biên soạn. 13 mục đi từ vì sao cần một lớp giữa, qua toàn bộ ngôn ngữ lược đồ Prisma, mọi kiểu quan hệ và hành vi tham chiếu, Client CRUD với select/include và ghi lồng nhau, bộ lọc — sắp xếp — phân trang con trỏ — tổng hợp, migration với shadow database và trôi dạt lược đồ, transaction lồng và mức cô lập, hệ kiểu sinh ra, chiến lược nạp quan hệ và bài toán N+1 đo bằng số thật, SQL thô an toàn, engine với binary target và connection pool, cho tới sách công thức chẩn đoán mã lỗi. Mọi ví dụ là output chạy thật, kèm SQL Prisma thật sự gửi xuống.',
    whatYouLearn: 'Đọc và viết trọn vẹn ngôn ngữ lược đồ Prisma, kể cả native type và mọi thuộc tính @/@@; dựng đúng quan hệ 1-1, 1-n, n-n ẩn và n-n tường minh, tự quan hệ, và biết onDelete làm gì với dữ liệu thật; dùng Client thành thạo — select với include, ghi lồng nhau, upsert, createMany, giao dịch tuần tự với giao dịch tương tác; phân trang bằng con trỏ thay vì skip khi bảng lớn; hiểu shadow database, biết vì sao migrate dev hỏng mà migrate deploy vẫn chạy, và viết SQL migration tay khi buộc phải; nhìn thấy N+1 bằng log query rồi vá bằng relationLoadStrategy hoặc include; biết khi nào rời Prisma sang $queryRaw và cách không tự mở cửa cho SQL injection; hiểu engine, binary target và vì sao ảnh Docker sai libc làm API chết 502; và chẩn đoán được P1001, P2002, P2025, P3006, P3009 mà không phá dữ liệu.',
    requirements: 'Biết JavaScript hoặc TypeScript ở mức đọc hiểu được. Biết SQL cơ bản thì tốt (SELECT, JOIN) nhưng KHÔNG bắt buộc — Chương 1 dựng lại phần cần thiết, và khoá PostgreSQL của CuongThai là nơi đào sâu. Có Node.js 18 trở lên. Có Docker để chạy PostgreSQL trong một câu lệnh (khoá Docker của CuongThai bao phần đó), hoặc một PostgreSQL sẵn có.',
    documentsNote: 'Tài liệu tham chiếu chính: prisma.io/docs (tài liệu chính thức) • prisma.io/docs/orm/reference/prisma-schema-reference (tra cứu từng thuộc tính lược đồ) • prisma.io/docs/orm/reference/prisma-client-reference (tra cứu từng phương thức Client) • prisma.io/docs/orm/reference/error-reference (bảng mã lỗi P1xxx–P6xxx) • github.com/prisma/prisma (mã nguồn và issue tracker). Phần thực hành đi kèm: track "Prisma ORM" trên Code Lab.',
  },
  sections: [
    s00,
    s01,
    s02,
    s03,
    s04,
    s05,
    s06,
  ],
};
