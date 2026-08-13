/**
 * Nạp kiến thức vào sổ tay của robot.
 *
 *   npx tsx scripts/robot-nap-kien-thuc.ts <projectId> <file.txt> [tên nguồn]
 *   npx tsx scripts/robot-nap-kien-thuc.ts <projectId> --xem
 *   npx tsx scripts/robot-nap-kien-thuc.ts <projectId> --xoa
 *
 * File chia mẩu theo DÒNG TRỐNG. Mỗi mẩu nên là một ý trọn vẹn, tự đứng
 * được — vì lúc tra, robot chỉ nhận được đúng mẩu đó chứ không thấy phần
 * trước sau. Viết "Cường thích bún bò Huế" chứ đừng viết "Món đó anh ấy
 * thích lắm".
 */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { prisma } from '../src/config/database.js';
import { napKienThuc, xoaKienThuc, demKienThuc, timKienThuc } from '../src/services/makerlab/kienThuc.js';

async function main() {
  const [idRaw, arg, nguon] = process.argv.slice(2);
  const projectId = Number(idRaw);
  if (!Number.isFinite(projectId) || !arg) {
    console.error('Dùng: npx tsx scripts/robot-nap-kien-thuc.ts <projectId> <file.txt|--xem|--xoa> [nguồn]');
    process.exit(1);
  }

  if (arg === '--xoa') {
    console.log(`Đã xoá ${await xoaKienThuc(projectId)} mẩu của dự án #${projectId}.`);
    return;
  }

  if (arg === '--xem') {
    console.log(`Dự án #${projectId} đang có ${await demKienThuc(projectId)} mẩu.`);
    const thu = await timKienThuc(projectId, 'cường robot server nhạc ăn', 5);
    thu.forEach((m, i) => console.log(`  ${i + 1}. [${m.diem.toFixed(3)}] ${m.noiDung.slice(0, 100)}…`));
    return;
  }

  const vanBan = readFileSync(arg, 'utf8');
  const so = await napKienThuc(projectId, vanBan, nguon || arg);
  console.log(`Đã nạp ${so} mẩu từ "${arg}". Tổng kho: ${await demKienThuc(projectId)} mẩu.`);
  if (!so) {
    console.log('(0 mẩu — kiểm tra xem file có ngăn cách bằng DÒNG TRỐNG chưa, và mỗi mẩu ≥20 ký tự.)');
  }
}

main()
  .catch((e) => { console.error('LỖI:', e.message ?? e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
