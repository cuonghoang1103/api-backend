/**
 * Deploy VPS — khoá học CuongThai (Courses, academyType=GENERAL, KHÔNG thuộc kỳ Academy).
 * Giáo trình tự soạn: 12 mục (Mục 0 + Chương 1–11), zero → một quy trình phát hành
 * chạy được trên VPS thật, song ngữ EN/VI.
 * Sections tách theo file trong ./deploy-vps/ cho dễ soạn; seeder chỉ đọc file này.
 *
 * KHÔNG trùng ba khoá đã có:
 *   - Linux & Bash dạy CÁI MÁY (shell, quyền, tiến trình, systemd, cron).
 *   - Docker dạy CÁI ẢNH (lớp, Dockerfile, cache, Compose).
 *   - Nginx dạy CÁI PROXY (server block, location, TLS, giới hạn).
 * Khoá này dạy CÁI HÀNH ĐỘNG đưa mã từ máy bạn lên máy đó và giữ nó ở đó an toàn:
 * tạo tác, vận chuyển, tráo, kiểm — cùng những chỗ mỗi bước có thể hỏng.
 *
 * Kiểm trước khi seed:
 *   node scripts/course-content-check.mjs ./content/courses/deploy-vps.mjs
 *   node scripts/course-depth-audit.mjs   ./content/courses/deploy-vps.mjs
 * Seed: node scripts/course-seed.mjs --file ./content/courses/deploy-vps.mjs --apply
 */

import s00 from './deploy-vps/s00-intro.mjs';
import s01 from './deploy-vps/s01-tao-tac.mjs';
import s02 from './deploy-vps/s02-van-chuyen.mjs';
import s03 from './deploy-vps/s03-trao.mjs';
import s04 from './deploy-vps/s04-cau-hinh.mjs';
import s05 from './deploy-vps/s05-migration.mjs';
import s06 from './deploy-vps/s06-lui-ban.mjs';
import s07 from './deploy-vps/s07-script.mjs';
import s08 from './deploy-vps/s08-may-nho.mjs';
import s09 from './deploy-vps/s09-giam-sat.mjs';

export default {
  category: { slug: 'devops', name: 'DevOps & Vận hành', icon: 'Server', sortOrder: 4 },
  course: {
    slug: 'deploy-vps',
    title: 'Deploy lên VPS',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: true,
    // Sinh bằng scripts/course-cover.mjs (logo Simple Icons chính thức trên nền
    // bìa dùng chung của CuongThai). Sinh lại, KHÔNG sửa tay:
    //   docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
    //     --slug deploy-vps --icon ubuntu --color E95420 --title "Deploy lên VPS" --subtitle "Máy bạn → Production"
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/deploy-vps.png',
    shortDescription: 'A deploy is four steps — build an artifact, move it, swap it in, prove it works — and each one has its own way of failing silently. Measured on a real server over real SSH.|||Một lần deploy là bốn bước — dựng tạo tác, chuyển đi, tráo vào, chứng minh nó chạy — và mỗi bước có kiểu hỏng âm thầm riêng. Đo thật trên một máy chủ thật qua SSH thật.',
    description: 'Khoá deploy lên VPS từ số 0 tới một quy trình phát hành chạy được, do CuongThai tự biên soạn. 12 mục đi từ mô hình bốn bước của một lần deploy, qua cách chuẩn bị máy nhận, ba đường vận chuyển mã (rsync, git, registry) đo bằng byte và giây, cách tráo phiên bản mà không rơi request, nơi cất bí mật, thứ tự chạy migration cơ sở dữ liệu, đường lùi khi hỏng, viết script deploy chịu được lỗi, giới hạn tài nguyên trên một VPS nhỏ, giám sát, sao lưu và phục hồi, cho tới một sách công thức chẩn đoán. Mọi kết quả đều ĐO THẬT trên một máy chủ SSH thật, không chép từ tài liệu.',
    whatYouLearn: 'Nhìn một lần deploy thành bốn bước tách rời và biết bước nào đang hỏng; chuẩn bị một VPS mới nhận deploy an toàn bằng khoá SSH và một người dùng riêng; chọn giữa rsync, git và registry bằng số đo chứ không bằng thói quen; tráo phiên bản mà không rơi request, kể cả khi ứng dụng khởi động mất vài giây; cất bí mật ở nơi sống sót qua mọi lần deploy; chạy migration cơ sở dữ liệu theo thứ tự không khoá bảng và không kẹt; lùi lại được khi bản mới hỏng — và biết thứ gì KHÔNG lùi được; viết một script deploy tự dừng khi có gì sai thay vì đi tiếp; sống được trên một VPS 6GB mà không bị OOM hay đầy đĩa; và phục hồi từ bản sao lưu, đo bằng đồng hồ thật.',
    requirements: 'Biết dùng terminal ở mức cơ bản (khoá Linux & Bash của CuongThai bao phần đó). Biết git ở mức commit/push (khoá Git & GitHub là đủ). Hiểu HTTP ở mức request/response. KHÔNG cần biết Docker trước — khoá này có nhắc tới nhưng giải thích lại chỗ cần. Nên có một VPS rẻ tiền để thực hành; không có thì một máy ảo hoặc container cũng chạy được toàn bộ bài.',
    documentsNote: 'Tài liệu tham chiếu chính: man ssh, ssh_config(5), sshd_config(5) và rsync(1) (đây là ba trang man đáng đọc hết) • OpenSSH manual (openssh.com/manual.html) • The Twelve-Factor App (12factor.net — phần III Config và phần V Build/Release/Run là xương sống của khoá này) • systemd.service(5) và systemd.exec(5) cho phần chạy dịch vụ. Phần thực hành đi kèm: track "Deploy VPS" trên Code Lab.',
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
  ],
};
