/**
 * Gắn giảng viên cho các khoá học CHƯA có.
 *
 * Vì sao cần: ô "Instructor" trên trang khoá lấy ảnh và tên từ quan hệ
 * `course.instructor` → bảng `users`. Đo 20/09/2026: **575/592 khoá có
 * `instructor_id` NULL**, nên API trả `instructorName`/`instructorAvatar`
 * rỗng và giao diện rơi về tên cứng "CuongHoangDev" + ảnh chữ cái.
 *
 * Gắn vào tài khoản thật thì: ảnh đổi theo tài khoản (admin đổi avatar là
 * trang khoá đổi theo, vì đọc từ `users` mỗi lần gọi), tên đúng, và bấm vào
 * dẫn sang hồ sơ có Kết bạn / Nhắn tin / Theo dõi.
 *
 * ⚠️ CHỈ điền chỗ đang trống — không bao giờ ghi đè khoá đã có giảng viên.
 * `scripts/academy-seed-course.mjs` không đụng tới `instructorId`, nên gắn
 * một lần là giữ qua mọi lần seed lại.
 *
 * Dùng:
 *   node scripts/course-gan-giang-vien.mjs --user Cuong03dx          (thử, không ghi)
 *   node scripts/course-gan-giang-vien.mjs --user Cuong03dx --apply
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const val = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const APPLY = args.includes('--apply');
const TEN = val('--user') || 'Cuong03dx';

const nguoi = await prisma.user.findFirst({
  where: { username: TEN },
  select: { id: true, username: true, fullName: true, avatarUrl: true },
});
if (!nguoi) {
  console.error(`✗ không tìm thấy tài khoản "${TEN}"`);
  process.exit(1);
}

const trong = await prisma.course.count({ where: { instructorId: null } });
const daCo = await prisma.course.count({ where: { NOT: { instructorId: null } } });

console.log(`Tài khoản: #${nguoi.id} ${nguoi.username} — ${nguoi.fullName || '(chưa đặt tên)'}`);
console.log(`Ảnh đại diện: ${nguoi.avatarUrl ? nguoi.avatarUrl.slice(0, 60) : '(CHƯA CÓ — trang sẽ hiện chữ cái đầu)'}`);
console.log(`Khoá chưa có giảng viên: ${trong} · đã có: ${daCo}`);

if (!APPLY) {
  console.log('\nThử chạy — thêm --apply để ghi thật.');
  await prisma.$disconnect();
  process.exit(0);
}

const kq = await prisma.course.updateMany({
  where: { instructorId: null },
  data: { instructorId: nguoi.id },
});
console.log(`\n✓ đã gắn ${kq.count} khoá vào #${nguoi.id} ${nguoi.username}`);

const conTrong = await prisma.course.count({ where: { instructorId: null } });
console.log(conTrong ? `! còn ${conTrong} khoá trống` : '✓ không còn khoá nào trống');
await prisma.$disconnect();
