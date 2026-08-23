/**
 * Redis — khoá học CuongThai (Courses, academyType=GENERAL, KHÔNG thuộc kỳ Academy).
 * Giáo trình tự soạn: 13 mục (Mục 0 + Chương 1–12), zero → vận hành Redis production, song ngữ EN/VI.
 * Sections tách theo file trong ./redis/ cho dễ soạn; seeder chỉ đọc file này.
 *
 * KHÔNG trùng với Node.js Chương 12 (Redis, 125k ký tự): khoá đó dạy DÙNG Redis
 * từ phía ứng dụng Node. Khoá này dạy CHÍNH Redis — mô hình thực thi, mọi kiểu
 * dữ liệu, bộ nhớ và đẩy khoá, lưu lâu dài, nhân bản/Sentinel/Cluster, vận hành.
 *
 * Kiểm trước khi seed:
 *   node scripts/course-content-check.mjs ./content/courses/redis.mjs
 *   node scripts/course-depth-audit.mjs   ./content/courses/redis.mjs
 * Seed: node scripts/course-seed.mjs --file ./content/courses/redis.mjs --apply
 */
import s00 from './redis/s00-intro.mjs';
import s01 from './redis/s01-mo-hinh.mjs';
import s02 from './redis/s02-khoa-ttl.mjs';
import s03 from './redis/s03-chuoi-bitmap.mjs';
import s04 from './redis/s04-list-set-zset.mjs';
import s05 from './redis/s05-hash.mjs';
import s06 from './redis/s06-cache.mjs';
import s07 from './redis/s07-nguyen-tu.mjs';

export default {
  category: { slug: 'databases', name: 'Cơ sở dữ liệu', icon: 'Database', sortOrder: 3 },
  course: {
    slug: 'redis',
    title: 'Redis',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: true,
    // Sinh bằng scripts/course-cover.mjs (logo Simple Icons chính thức trên nền
    // bìa dùng chung của CuongThai). Sinh lại, KHÔNG sửa tay:
    //   docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
    //     --slug redis --icon redis --color DC382D --title "Redis" --subtitle "Cache → Production"
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/redis.png',
    shortDescription: 'The database that lives in memory: why one thread is fast enough, which data structure turns a hard problem into one command, how to cache without serving stale data, and how to run it so it never loses what it should not.|||Cơ sở dữ liệu sống trong bộ nhớ: vì sao một luồng là đủ nhanh, kiểu dữ liệu nào biến một bài toán khó thành một câu lệnh, cache thế nào để không phục vụ dữ liệu cũ, và vận hành ra sao để nó không mất thứ không được phép mất.',
    description: 'Khoá Redis từ số 0 tới mức vận hành được một cụm Redis production, do CuongThai tự biên soạn. 13 mục đi từ mô hình một luồng và giao thức RESP, qua khoá và TTL, đủ mọi kiểu dữ liệu (chuỗi, bitmap, HyperLogLog, list, set, sorted set, hash, geo), cache cho đúng, tính nguyên tử với Lua, Pub/Sub và Streams, bộ nhớ với chính sách đẩy khoá, lưu lâu dài, bảo mật và ACL, nhân bản với Sentinel và Cluster, cho tới một sách công thức chẩn đoán. Mọi ví dụ là output redis-cli chạy thật.',
    whatYouLearn: 'Hiểu vì sao Redis một luồng mà vẫn nhanh, và câu lệnh nào làm đứng cả máy chủ; chọn đúng kiểu dữ liệu để một bài toán khó thành một câu lệnh (bảng xếp hạng, cửa sổ trượt, đếm duy nhất bằng 12KB); viết cache không bị stampede và không phục vụ dữ liệu cũ; dùng MULTI/WATCH và Lua để có tính nguyên tử thật; chọn giữa Pub/Sub với Streams và biết cái nào làm mất tin nhắn; đặt maxmemory với chính sách đẩy khoá cho đúng; hiểu RDB với AOF mất gì khi sập; dựng nhân bản, chuyển dự phòng bằng Sentinel, và chia khoá trong Cluster; và chẩn đoán một Redis chậm bằng SLOWLOG, LATENCY và MEMORY DOCTOR.',
    requirements: 'Biết mở terminal và gõ lệnh cơ bản. KHÔNG cần biết Redis trước — Mục 0 dựng lại từ đầu. Biết một ngôn ngữ lập trình ở mức đọc hiểu được (ví dụ dùng JavaScript/Node và redis-cli). Có Docker để chạy Redis trong hai mươi giây (khoá Docker của CuongThai bao phần đó), hoặc cài trực tiếp.',
    documentsNote: 'Tài liệu tham chiếu chính: redis.io/docs (tài liệu chính thức, phần Reference cho từng câu lệnh) • redis.io/docs/latest/commands (tra cứu 240+ câu lệnh kèm độ phức tạp) • antirez.com (blog của tác giả, giải thích các quyết định thiết kế) • github.com/redis/redis (mã nguồn, đọc được hơn bạn nghĩ). Phần thực hành đi kèm: track "Redis" trên Code Lab.',
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
  ],
};
